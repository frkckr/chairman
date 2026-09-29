/* ============ Chairman — kurallar, hakemler, duran toplar, top toplayıcılar (mantık, çizimsiz) ============
   Duran toplar gerçek sırasıyla işler: top çıkınca en yakın top toplayıcı çocuk yedek topu atana verir (çoklu top sistemi),
   atan topu alır, yerine gelir, arkadaşları yerleşir, sonra kullanır. Dışarı çıkan eski topu başka bir çocuk koşup toplar.
   Taç: atan çizgide, top başının üstünde. Korner: köşe yayında, ceza sahasında koşu rolleri, falsolu orta.
   Aut: kaleci topu altıpasa koyar, kısa oynar ya da uzun vurur. Serbest vuruş: faulün yerinde; kaleye yakınsa 9,15 m'de baraj.
   Faul: müdahalenin sonucu (ayakta, kayarak, arkadan, hava topunda itme). Oyuncu düşer, hakem düdük çalar ve yön gösterir,
   gerekirse kart; faul yiyen takım iyi durumdaysa avantaj. Ofsayt: pas anında ölçülür, oyuna karışınca yan hakem bayrak kaldırır.
   Hakem çapraz sistemle koşar; yan hakemler sondan ikinci savunmacı (ya da top) hizasında durur. */
Object.assign(Match.prototype,{
  kuralHazirla(){this.avantaj=null;this.sonKullanim=null;this.degisiklik=null;},

  /* ============ yedekler ve oyuncu değişikliği ============ */
  yedekleriKur(){
    this.yedekler=[[],[]];
    for(let t=0;t<2;t++){const kd=this.kadro&&this.kadro[t];if(!kd)continue;
      (kd.yedekler||[]).forEach((k,i)=>{const s=this.kulubeler[t].koltuklar[i]||{x:t?11.5:-11.5,z:-5.8},oz=ozellikler(k);
        this.yedekler[t].push(this.varlik('yedek',s.x,s.z,{team:t,rol:k.mevki==='KL'?'GK':(k.mevki||'OS'),name:k.ad,no:k.no,kayit:k,oz,ayak:k.ayak||'sag',boy:k.boy||1,
          maxSpd:6.4+2.4*oz.hiz,yon:Math.PI/2,oturuyor:true,koltuk:s}));});}
    /* değişiklik planı: her takım ikinci yarıda 2–4 değişiklik, 55. ile 87. dakika arasında */
    this.degisimPlani=[0,1].map(()=>{const n=2+Math.floor(this.rast()*3),L=[];for(let i=0;i<n;i++)L.push(3300+this.rast()*1920);return L.sort((a,b)=>a-b);});
  },
  /* duruşta sırası gelen değişiklik başlar: yorgun (ya da sarı kartlı) oyuncu çıkar, aynı mevkiden yedek girer */
  degisiklikBaslat(du){
    if(this.degisiklik||this.half!==2||!['tac','kaleVurusu','serbest'].includes(du.tur))return;
    for(const t of[du.takim,1-du.takim]){
      const plan=this.degisimPlani[t];if(!plan.length||this.gameSec<plan[0]||this.ist.degisiklik[t]>=5)continue;
      const yedek=this.yedekler[t].filter(p=>!p.cikti&&p.rol!=='GK');if(!yedek.length){plan.length=0;continue;}
      const saha=this.teams[t].filter(p=>p.oyunda&&p.rol!=='GK'&&p!==du.kullanan&&!(p.eylem&&p.eylem.kilit));if(!saha.length)continue;
      const puan=p=>p.yorgunluk+(p.kart===1&&p.rol==='DEF'?0.25:0)+this.rast()*0.15-Math.min(p.z,PW-p.z)*0.004;
      const cikan=saha.reduce((a,c)=>puan(c)>puan(a)?c:a);
      const giren=yedek.find(y=>y.rol===cikan.rol)||yedek[0];
      plan.shift();
      giren.oturuyor=false;giren.tx=0;giren.tz=-0.7;giren.hizOran=0.5;giren.bak=cikan;
      /* çıkan oyuncu en yakın çizgiden çıkar; ana tribün tarafındaysa kulübeye yürür */
      cikan.hizOran=0.35;
      this.degisiklik={t,cikan,giren,t0:this.t,girdi:false};
      this.duranSure[this.half-1]+=30;
      this.on('degisiklik',{takim:t,cikan,giren});
      return;}
  },
  degisiklikAdim(dt){
    const dg=this.degisiklik;if(!dg)return;
    const {cikan,giren,t}=dg;
    /* çıkan: en yakın çizgiye yürür (kulübe tarafına), geçince kulübeye */
    if(!dg.girdi){cikan.tx=clamp(cikan.x,-PL+2,PL-2);cikan.tz=cikan.z<MZ?-0.8:PW+0.8;cikan.hizOran=0.6;cikan.bak=null;cikan.yonHedef=null;
      giren.tx=0;giren.tz=-0.7;giren.hizOran=0.55;
      const disarida=cikan.z<0.2||cikan.z>PW-0.2,girenHazir=hyp(giren.x,giren.z+0.7)<1.2;
      if((disarida&&girenHazir)||this.t-dg.t0>14){
        const n=cikan.n,i=this.players.indexOf(cikan);
        Object.assign(giren,{tur:'oyuncu',n,mevki:cikan.mevki,rol:cikan.rol,oyunda:true,oturuyor:false,yorgunluk:0,hizOran:0.8});
        this.teams[t][n]=giren;if(i>=0)this.players[i]=giren;
        Object.assign(cikan,{tur:'yedek',oyunda:false,cikti:true,koltuk:giren.koltuk,eylem:null,surus:null});
        const Y=this.yedekler[t];Y.splice(Y.indexOf(giren),1,cikan);
        if(this.ball.sahip===cikan)this.ball.sahip=null;
        this.ist.degisiklik[t]++;dg.girdi=true;dg.t1=this.t;
        this.on('oyuncuGirdi',{takim:t,cikan,giren});}}
    else{/* çıkan kulübedeki boş koltuğa oturur */const k=cikan.koltuk;
      if(cikan.z>MZ){cikan.tx=clamp(cikan.x,-PL,PL);cikan.tz=PW+2;}else{cikan.tx=k.x;cikan.tz=k.z;}
      cikan.hizOran=0.35;cikan.bak=null;
      if(hyp(cikan.x-k.x,cikan.z-k.z)<0.4){cikan.oturuyor=true;cikan.x=k.x;cikan.z=k.z;cikan.vx=cikan.vz=0;cikan.yon=Math.PI/2;}
      if(cikan.oturuyor||this.t-dg.t1>10){if(!cikan.oturuyor){cikan.oturuyor=true;cikan.x=k.x;cikan.z=k.z;}this.degisiklik=null;}}
  },

  /* ============ top toplayıcılar ============ */
  topculariKur(){
    const L=[],ekle=(x,z)=>L.push(this.varlik('topcu',x,z,{ev:{x,z},yon:z<MZ?Math.PI/2:z>PW?-Math.PI/2:x>0?Math.PI:0,maxSpd:5.6,hizOran:0.4,oz:{hiz:0.4},boy:0.72,top:true}));
    for(const x of[-41,-26,26,41])ekle(x,-2.7);
    for(const x of[-40,-14,14,40])ekle(x,PW+2.7);
    for(const s of[-1,1])for(const dz of[-13,13])ekle(s*(PL+3.3),MZ+dz);
    return L;
  },
  topcuAI(dt){
    const b=this.ball;
    /* dışarıdaki yavaşlamış toplar: topu olmayan en yakın çocuk toplar */
    for(const o of this.disToplar){if(o.alan||hyp(o.vx,o.vz)>3||o.y>0.5)continue;
      let en=null,ed=1e9;for(const k of this.topcular){if(k.top||k.gorev)continue;const dd=hyp(k.x-o.x,k.z-o.z);if(dd<ed){ed=dd;en=k;}}
      if(en&&ed<45){en.gorev={tur:'al',top:o};o.alan=en;}}
    const oncesi=MAC_ONCESI.includes(this.phase);
    for(const k of this.topcular){
      const g=k.gorev;k.yonHedef=null;
      /* maç öncesi: çocuklar tünelden sırayla çıkıp yerlerine geçer, sahaya bakar */
      if(oncesi&&k.cikisT!=null&&this.sen&&this.sen.t<k.cikisT){this.moveP(k,dt);continue;}
      if(!g){k.tx=k.ev.x;k.tz=k.ev.z;k.hizOran=0.4;k.bak=oncesi?{x:k.ev.x*0.8,z:MZ}:b.tasiyan&&b.tasiyan!==k?b.tasiyan:b;}
      else if(g.tur==='al'){const o=g.top;k.tx=o.x;k.tz=o.z;k.hizOran=0.75;k.bak=o;
        if(hyp(k.x-o.x,k.z-o.z)<0.55){const i=this.disToplar.indexOf(o);if(i>=0)this.disToplar.splice(i,1);k.top=true;k.gorev=null;}}
      else if(g.tur==='ver'){const du=this.durus;
        if(!du||du.topcu!==k||b.tasiyan!==k){k.gorev=null;continue;}
        /* atana yakın, saha dışında bir yere gel; atan yaklaşınca topu at */
        k.tx=g.x;k.tz=g.z;k.hizOran=0.9;const tk=du.kullanan;k.bak=tk;
        const L=hyp(tk.x-k.x,tk.z-k.z),gel=hyp(k.x-g.x,k.z-g.z)<2.5||L<9;
        if(gel&&L<16&&du.t>0.5){this.topcuAtar(k,tk,du);k.gorev=null;}}
      this.moveP(k,dt);
    }
  },
  /* çocuk yedek topu atana atar (taçta ve kale vuruşunda elden, kornerde yerden yuvarlar) */
  topcuAtar(k,tk,du){
    const b=this.ball;b.tasiyan=null;k.top=false;
    const hx=tk.x+tk.vx*0.5,hz=tk.z+tk.vz*0.5,L=hyp(hx-k.x,hz-k.z);
    b.x=k.x+Math.cos(k.yon)*0.2;b.z=k.z+Math.sin(k.yon)*0.2;
    if(du.tur==='korner'){b.y=0;b.vy=0;const v=yerIlkHiz(L,1.2,this.R);b.vx=(hx-b.x)/L*v;b.vz=(hz-b.z)/L*v;}
    else{b.y=1.0;const c=this.havadanCoz(b.x,1.0,b.z,hx,1.3,hz,0.55+L/16,0);b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;}
    k.eylem={ad:'atis',t:0,sure:0.5};this.topDegisti();this.on('topcu',{k,tk});
  },
  topcuSec(du){
    let en=null,ed=1e9;
    for(const k of this.topcular){if(!k.top||k.gorev)continue;const dd=hyp(k.x-du.x,k.z-du.z);if(dd<ed){ed=dd;en=k;}}
    if(!en)return null;
    /* çocuğun duracağı yer: çizginin dışında, atış noktasının yanında */
    let x,z;
    if(du.tur==='tac'){x=clamp(du.x+(en.x>du.x?4:-4),-PL-2,PL+2);z=du.z<MZ?-2.2:PW+2.2;}
    else if(du.tur==='korner'){x=Math.sign(du.x)*(PL+2.2);z=du.z<MZ?6:PW-6;}
    else{x=Math.sign(du.x)*(PL+2.5);z=MZ+(du.z<MZ?-6:6);}
    en.gorev={tur:'ver',x,z};return en;
  },

  /* ============ duran toplar ============ */
  durusBaslat(tur,takim,x,z,veri){
    const b=this.ball;
    this.phase='durus';this.phaseT=0;
    for(const p of this.players){if(p.eylem&&!p.eylem.kilit)p.eylem=null;p.surus=null;p.kosu=null;p.destek=null;p.yonHedef=null;}
    b.sahip=null;b.hedefOyuncu=null;b.sut=null;b.pas=null;b.ofsaytta=null;
    const du=Object.assign({tur,takim,x,z,t:0,asama:'bekle',kullanan:null,topcu:null,hazirT:0},veri||{});
    this.durus=du;this.sp=du;
    du.kullanan=this.kullananSec(du);
    const disarida=b.z<-0.2||b.z>PW+0.2||Math.abs(b.x)>PL+0.2;
    if(tur==='tac'||tur==='korner'||tur==='kaleVurusu'||disarida||hyp(b.x-x,b.z-z)>14){
      /* yeni top top toplayıcıdan gelir; oyundaki top saha içindeyse o da dış top olur */
      if(!disarida&&tur!=='tac'&&tur!=='korner'&&tur!=='kaleVurusu')this.disToplar.push({x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:0,alan:null,t:0});
      du.topcu=this.topcuSec(du);
      if(du.topcu){b.tasiyan=du.topcu;b.vx=b.vy=b.vz=0;this.topDegisti();}
      else{/* yedek top kalmadıysa atan eski topu kendisi alır */const o=this.disToplar.shift();if(o){b.x=o.x;b.z=clamp(o.z,-3,PW+3);b.y=0;b.vx=b.vz=b.vy=0;}b.tasiyan=null;this.topDegisti();}
    }
    /* avantajdan kalan kart ilk duruşta gösterilir */
    if(this.bekleyenKart){const a=this.bekleyenKart;this.bekleyenKart=null;if(a.yapan.oyunda)this.kartGoster(a.yapan,a.kart);}
    if(tur==='tac')this.ist.tac[takim]++;else if(tur==='korner')this.ist.korner[takim]++;else if(tur==='kaleVurusu')this.ist.kaleVurusu[takim]++;
    const r=this.refs[0];r.eylem={ad:'yon',t:0,sure:1.3,yon:this.dir[takim]};
    if(tur==='korner'||tur==='kaleVurusu'){const yh=b.x>0?this.refs[1]:this.refs[2];yh.eylem={ad:'bayrak',t:0,sure:1.6,tur};}
    const eski={tac:'throw',korner:'corner',kaleVurusu:'goalkick'}[tur];
    this.on(tur,{team:takim,taker:du.kullanan,x,z});if(eski)this.on(eski,{team:takim,taker:du.kullanan});
    this.degisiklikBaslat(du);
  },
  kullananSec(du){
    const tm=this.sahadakiler(du.takim);
    if(du.tur==='kaleVurusu')return this.kaleci(du.takim);
    let en=null,ep=1e9;
    for(const p of tm){if(p.rol==='GK'&&du.tur!=='serbest')continue;
      let c=hyp(p.x-du.x,p.z-du.z);
      if(du.tur==='korner')c=c*0.4+(p.rol==='OS'?0:30)-p.oz.pas*20;
      if(du.tur==='tac'&&(p.mevki.bek||p.mevki.kanat))c-=6;
      if(du.tur==='penalti')c=-p.oz.sut*50-(p.rol==='FV'?10:0)+(p.rol==='GK'?99:0);
      if(du.tur==='serbest'&&p.rol==='GK')c=this.kendiCezaSahasinda(p,du.x,du.z)?c-10:c+60;
      if(du.tur==='serbest'&&this.tehlikeliSerbest(du))c=c*0.3-p.oz.sut*25;
      if(c<ep){ep=c;en=p;}}
    return en;
  },
  tehlikeliSerbest(du){const u=du.x*this.dir[du.takim],dz=Math.abs(du.z-MZ);return !du.endirekt&&u>PL-33&&u<PL-15&&dz<17;},
  /* atış/vuruş noktasında atanın durduğu yer */
  durusNoktasi(du){
    const d=this.dir[du.takim];
    if(du.tur==='tac')return{x:du.x,z:du.z<MZ?-0.35:PW+0.35};
    if(du.tur==='korner')return{x:du.x,z:du.z};
    return{x:du.x,z:du.z};
  },
  stepDurus(dt){
    const du=this.durus,b=this.ball,tk=du.kullanan,d=this.dir[du.takim];du.t+=dt;
    if(!tk||!tk.oyunda){du.kullanan=this.kullananSec(du);return;}
    this.takimAI(dt,du);
    this.durusYerlesim(du,dt);
    const nk=this.durusNoktasi(du);
    if(du.t>16&&(du.asama==='getir'||du.asama==='bekle')){b.tasiyan=tk;this.topDegisti();du.asama='yerles';}
    if(du.t>28&&du.asama!=='hazir'){b.tasiyan=null;du.asama='hazir';du.geriX=tk.x;du.geriZ=tk.z;du.aci=tk.yon;b.x=du.x;b.z=du.z;}
    if(du.asama==='bekle'){tk.tx=nk.x;tk.tz=nk.z;tk.hizOran=0.8;if(du.t>(du.bekle||0.45))du.asama='getir';}
    else if(du.asama==='getir'){
      if(b.tasiyan===tk)du.asama='yerles';
      else if(b.tasiyan&&b.tasiyan.tur==='topcu'){tk.tx=nk.x;tk.tz=nk.z;tk.hizOran=0.85;tk.bak=b.tasiyan;}
      else if(!b.tasiyan){/* top havada ya da yerde: atan alır */
        const k=this.yakalamaNoktasi(tk,2.2);tk.tx=k.x;tk.tz=k.z;tk.hizOran=0.8;tk.bak=b;
        if(hyp(b.x-tk.x,b.z-tk.z)<1.0&&b.y<2.3){b.tasiyan=tk;this.topDegisti();du.asama='yerles';}}
    }else if(du.asama==='yerles'){
      tk.tx=nk.x;tk.tz=nk.z;tk.hizOran=0.7;tk.bak=null;tk.yonHedef=Math.atan2(MZ-nk.z,d*20-nk.x);
      if(hyp(tk.x-nk.x,tk.z-nk.z)<0.45){
        if(du.tur==='tac'){tk.eylem={ad:'tac',t:0,faz:'tut',ft:0};du.asama='hazir';}
        else{/* topu yere koy, iki adım geri çekil */b.tasiyan=null;b.x=du.x;b.z=du.z;b.y=0;b.vx=b.vy=b.vz=0;this.topDegisti();du.asama='hazir';
          const a=this.durusHedefAcisi(du);du.aci=a;du.geriX=du.x-Math.cos(a)*(du.tur==='penalti'?2.2:1.3);du.geriZ=du.z-Math.sin(a)*(du.tur==='penalti'?2.2:1.3);}}
    }else if(du.asama==='hazir'){
      du.hazirT+=dt;
      if(du.tur!=='tac'){tk.tx=du.geriX;tk.tz=du.geriZ;tk.hizOran=0.4;tk.yonHedef=du.aci;tk.bak=null;b.x=du.x;b.z=du.z;b.vx=b.vz=0;}
      const bekle={tac:0.5,korner:1.4,kaleVurusu:1.0,serbest:du.baraj?3.2:0.9,penalti:3.0}[du.tur]||1;
      const degisimBekle=this.degisiklik&&!this.degisiklik.girdi;
      if(!degisimBekle&&du.hazirT>=bekle&&(du.tur==='tac'||hyp(tk.x-du.geriX,tk.z-du.geriZ)<0.5||du.hazirT>bekle+2))this.durusKullan(du);
    }
    this.degisiklikAdim(dt);
    this.hareketHepsi(dt);this.topAdim(dt);
  },
  /* atanın bakacağı yön: kaleye ya da oyunun içine */
  durusHedefAcisi(du){const d=this.dir[du.takim];if(du.tur==='penalti'||(du.tur==='serbest'&&du.baraj))return Math.atan2(MZ-du.z,d*PL-du.x);
    if(du.tur==='korner')return Math.atan2(MZ-du.z,d*(PL-11)-du.x);return Math.atan2((MZ-du.z)*0.3,d*20);},
  /* duran topta herkesin yeri: korner rolleri, baraj, penaltı, 9,15 m kuralı */
  durusYerlesim(du,dt){
    const d=this.dir[du.takim],gx=d*PL,tk=du.kullanan,savunan=1-du.takim;
    if(du.tur==='korner'){
      const yan=Math.sign(du.z-MZ)||1;
      const hucumYer=[[PL-5.5,MZ+yan*2.5],[PL-7,MZ-yan*3],[PL-11,MZ+yan*0.5],[PL-4,MZ],[PL-17,MZ-yan*4],[PL-19,MZ+yan*6]];
      const savYer=[[PL-0.6,MZ+yan*(GW2-0.4)],[PL-5,MZ+yan*1.5],[PL-5,MZ-yan*2.5],[PL-7.5,MZ],[PL-10,MZ+yan*3],[PL-10,MZ-yan*3],[PL-16,MZ]];
      let i=0,j=0;
      const hucumcular=this.sahadakiler(du.takim).filter(p=>p!==tk&&p.rol!=='GK').sort((a,c)=>(c.oz.kafa+c.boy)-(a.oz.kafa+a.boy));
      for(const p of hucumcular){if(p.rol==='DEF'&&!(p.oz.kafa>0.68&&i<2)){p.tx=d*-2;p.tz=p.z<MZ?20:48;continue;}
        const y=hucumYer[i++];if(!y){p.tx=d*(PL-30);p.tz=p.mevki.w;continue;}p.tx=d*y[0];p.tz=y[1];p.hizOran=0.8;p.bak=this.ball;}
      const savunanlar=this.sahadakiler(savunan).filter(p=>p.rol!=='GK').sort((a,c)=>(c.oz.kafa+c.boy)-(a.oz.kafa+a.boy));
      for(const p of savunanlar){if(p.rol==='FV'&&j>3){p.tx=d*(-8);p.tz=p.n===9?30:40;continue;}
        const y=savYer[j++];if(!y){p.tx=d*(PL-24);p.tz=p.mevki.w;continue;}p.tx=d*y[0];p.tz=y[1];p.hizOran=0.8;p.bak=this.ball;}
    }else if(du.tur==='penalti'){
      const kl=this.kaleci(savunan);kl.tx=gx;kl.tz=MZ;kl.bak=this.ball;kl.yonHedef=null;
      let i=0;for(const p of this.players){if(!p.oyunda||p===tk||p===kl)continue;
        if(p.rol==='GK'){p.tx=-gx*0.9;p.tz=MZ;continue;}
        const s=i++;p.tx=d*(PL-19-((s*7)%5));p.tz=MZ-14+((s*11)%28);p.hizOran=0.5;p.bak=this.ball;}
    }else if(du.tur==='serbest'||du.tur==='kaleVurusu'){
      /* baraj: kaleye yakın serbest vuruşta topla kale arasında, 9,15 m'de */
      if(du.tur==='serbest'&&this.tehlikeliSerbest(du)&&du.asama!=='bekle'){
        du.baraj=true;const a=Math.atan2(MZ-du.z,gx-du.x),ux=Math.cos(a),uz=Math.sin(a),n=clamp(Math.round(6-(hyp(gx-du.x,MZ-du.z)-16)/3.5),2,5);
        const yakinDirek=Math.sign(du.z-MZ)||1,merkez={x:du.x+ux*9.15,z:du.z+uz*9.15},px=-uz,pz=ux;
        const oyuncular=this.sahadakiler(savunan).filter(p=>p.rol!=='GK').sort((a,c)=>hyp(a.x-merkez.x,a.z-merkez.z)-hyp(c.x-merkez.x,c.z-merkez.z)).slice(0,n);
        du.barajdakiler=oyuncular;
        oyuncular.forEach((p,k)=>{const s=(k-(n-1)/2)*0.62+yakinDirek*0.35;p.tx=merkez.x+px*s;p.tz=merkez.z+pz*s;p.hizOran=0.8;p.bak=this.ball;p.yonHedef=a+Math.PI;});
        const kl=this.kaleci(savunan);kl.tx=gx-d*0.8;kl.tz=MZ-yakinDirek*1.2;kl.bak=this.ball;
      }
      /* 9,15 m: savunan takım topa yaklaşmaz; aut'ta ceza sahası dışında kalır */
      for(const p of this.sahadakiler(savunan)){if(du.barajdakiler&&du.barajdakiler.includes(p))continue;if(p.rol==='GK'&&du.tur==='serbest')continue;
        const dx=p.tx-du.x,dz=p.tz-du.z,L=hyp(dx,dz);if(L<9.6){const s=9.6/(L||1);p.tx=du.x+dx*s;p.tz=du.z+dz*s;}
        if(du.tur==='kaleVurusu'){const u=p.tx*this.dir[du.takim];if(u<-PL+CEZA_U+1&&Math.abs(p.tz-MZ)<CEZA_W+1)p.tx=this.dir[du.takim]*(-PL+CEZA_U+1.5);}}
    }else if(du.tur==='tac'){
      for(const p of this.sahadakiler(savunan)){const L=hyp(p.tx-du.x,p.tz-du.z);if(L<2.5){p.tz=du.z<MZ?Math.max(p.tz,2.8):Math.min(p.tz,PW-2.8);}}
    }
  },
  /* duran topu kullan */
  durusKullan(du){
    const tk=du.kullanan,b=this.ball,d=this.dir[du.takim];
    this.sonKullanim={tur:du.tur,p:tk,t:this.t};
    if(du.tur==='tac'){const e=tk.eylem;if(e&&e.ad==='tac'&&e.faz==='tut'){e.faz='at';e.ft=0;e.hedef=this.tacHedefi(tk);}return;}
    if(du.duduk||du.tur==='penalti'||du.baraj)this.on('duduk',{tur:du.tur});
    this.phase='play';this.phaseT=0;this.durus=null;this.sp=null;
    b.tasiyan=null;b.x=du.x;b.z=du.z;b.y=0;b.vx=b.vz=b.vy=0;this.topDegisti();
    tk.x=du.geriX;tk.z=du.geriZ;
    this.sahipYap(tk);
    const sec=this.durusSecenegi(du,tk);
    if(sec)this.vurusBaslat(tk,sec);else tk.kararT=0;
    if(du.tur==='penalti'){/* kaleci bir yöne tahminle uçar */
      const kl=this.kaleci(1-du.takim),r=this.rast(),yan=r<0.44?-1:r<0.88?1:0;
      if(yan){kl.penaltiTahmin=yan;}}
  },
  durusSecenegi(du,tk){
    const d=this.dir[du.takim],gx=d*PL;
    if(du.tur==='korner'){
      const yan=Math.sign(du.z-MZ)||1,r=this.rast();
      if(r<0.13){/* kısa korner */let q=null,ed=1e9;for(const p of this.sahadakiler(du.takim)){if(p===tk||p.rol==='GK')continue;const dd=hyp(p.x-du.x,p.z-du.z);if(dd<ed){ed=dd;q=p;}}
        if(q&&ed<20)return{tur:'pas',hx:q.x,hz:q.z,tip:'yer',alici:q};}
      const hedefler=[[PL-5.5,MZ+yan*2.2],[PL-7,MZ-yan*3.2],[PL-11,MZ],[PL-6,MZ]],h=hedefler[Math.floor(this.rast()*hedefler.length)];
      let al=null,ed=1e9;for(const p of this.sahadakiler(du.takim)){if(p===tk||p.rol==='GK')continue;const dd=hyp(p.x-d*h[0],p.z-h[1]);if(dd<ed){ed=dd;al=p;}}
      return{tur:'korner',hx:d*h[0],hz:h[1],tip:'hava',T:1.15+hyp(d*h[0]-du.x,h[1]-du.z)/30,alici:al};
    }
    if(du.tur==='kaleVurusu'){
      const tkt=this.taktik[du.takim];
      if(this.rast()>tkt.direkt*0.8){/* kısa: açıktaki stopere */let q=null,eb=-1;for(const p of this.sahadakiler(du.takim)){if(p.rol!=='DEF')continue;const bos=enYakinRakip(this,p.x,p.z,p.team).d;if(bos>eb){eb=bos;q=p;}}
        if(q&&eb>7)return{tur:'kaleVurusu',hx:q.x,hz:q.z,tip:'yer',alici:q};}
      let q=null,ep=-1e9;for(const p of this.sahadakiler(du.takim)){if(p.rol!=='FV'&&p.rol!=='OS')continue;const s=p.oz.kafa+p.x*d*0.01+this.rast()*0.5;if(s>ep){ep=s;q=p;}}
      const hx=clamp(q.x+d*3,-PL+20,PL-20),L=hyp(hx-du.x,q.z-du.z);
      return{tur:'kaleVurusu',hx,hz:q.z,tip:'hava',T:1.5+L/30,alici:q};
    }
    if(du.tur==='penalti'){const yan=this.rast()<0.5?-1:1;return{tur:'sut',hx:gx,hz:MZ+yan*(GW2-0.7),penalti:true,xg:0.76};}
    if(du.tur==='serbest'&&du.baraj&&!du.endirekt&&this.rast()<0.62)return{tur:'sut',hx:gx,hz:MZ,serbest:true,xg:0.06};
    return null;
  },
  /* taç: atan top başının üstünde bekler, açıktaki arkadaşa atar */
  tacIlerle(p,e,dt){
    const b=this.ball;e.ft+=dt;
    if(e.faz==='tut'){if(b.tasiyan!==p)p.eylem=null;return;}
    if(e.faz==='at'&&!e.atti&&e.ft>=0.34){
      e.atti=true;const q=e.hedef,hx=q?q.x+q.vx*0.6:p.x+this.dir[p.team]*8,hz=q?q.z+q.vz*0.6:clamp(p.z+(p.z<MZ?8:-8),1,PW-1);
      const L=hyp(hx-p.x,hz-p.z),c=this.havadanCoz(p.x,2.0*p.boy,p.z,hx,1.0,hz,0.4+L/20,0);
      b.tasiyan=null;b.x=p.x+Math.cos(p.yon)*0.25;b.z=p.z+Math.sin(p.yon)*0.25;b.y=2.0*p.boy;b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.egri=0;
      this.dokunus(p,true);b.hedefOyuncu=q||null;p.kickCd=0.4;
      this.phase='play';this.phaseT=0;this.durus=null;this.sp=null;
    }
    if(e.ft>=0.65)p.eylem=null;
  },
  tacHedefi(p){
    let en=null,ep=-1e9;const d=this.dir[p.team];
    for(const q of this.sahadakiler(p.team)){if(q===p||q.rol==='GK')continue;const L=hyp(q.x-p.x,q.z-p.z);if(L<4||L>24)continue;
      const bos=enYakinRakip(this,q.x,q.z,p.team).d,s=Math.min(bos,7)*0.5+(q.x-p.x)*d*0.06-L*0.05+this.rast()*0.8;if(s>ep){ep=s;en=q;}}
    return en;
  },

  /* ============ kaleci topu elinde: ileri yürür, sonra atar ya da degaj yapar ============ */
  kaleciElde(dt){
    const b=this.ball,gk=b.tasiyan;if(!gk||gk.rol!=='GK')return;
    const tu=gk.tutus||(gk.tutus={t:0,sure:2});tu.t+=dt;
    const d=this.dir[gk.team],gx=-d*PL;
    gk.tx=gx+d*Math.min(14,Math.abs(gk.x-gx)+2);gk.tz=MZ+clamp(gk.z-MZ,-9,9);gk.hizOran=0.3;gk.bak=null;gk.yonHedef=d>0?0:Math.PI;
    if(tu.t<tu.sure||gk.eylem)return;
    const k=kaleciDagitim(this,gk);gk.tutus=null;b.tasiyan=null;
    const q=k?k.q:null,tur=k?k.tur:'degaj';
    let hx,hz,hy,T,y0;
    if(tur==='elleAtis'){hx=q.x+q.vx*0.6;hz=q.z+q.vz*0.6;hy=0.3;y0=1.9;T=0.4+hyp(hx-gk.x,hz-gk.z)/24;gk.eylem={ad:'elleAtis',t:0,sure:0.6};}
    else{const h=q||{x:d*10,z:MZ};hx=clamp(h.x+d*4,-PL+10,PL-10);hz=h.z;hy=0;y0=0.9;T=1.7+hyp(hx-gk.x,hz-gk.z)/34;gk.eylem={ad:'degaj',t:0,sure:0.7};}
    const L=hyp(hx-gk.x,hz-gk.z),a=Math.atan2(hz-gk.z,hx-gk.x)+this.normal()*(tur==='degaj'?0.06:0.03);
    hx=gk.x+Math.cos(a)*L;hz=gk.z+Math.sin(a)*L;
    b.x=gk.x+Math.cos(gk.yon)*0.3;b.z=gk.z+Math.sin(gk.yon)*0.3;b.y=y0;
    const c=this.havadanCoz(b.x,y0,b.z,hx,hy,hz,T,0);b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.egri=0;
    this.dokunus(gk,true);gk.kickCd=0.5;b.hedefOyuncu=q;
    this.pasSay(gk,hx,hz,L,tur);this.ofsaytPasAni(gk);this.on(tur==='degaj'?'gkkick':'pass',{p:gk,q});
  },

  /* ============ müdahale ve faul ============ */
  /* pres yapan oyuncu uygun anda müdahaleye girer: top açıktaysa ayakta, rakip kaçıyorsa kayarak */
  mudahaleDene(p,s,dt){
    if(p.eylem||p.kickCd>0||!s)return;
    const b=this.ball,db=hyp(b.x-p.x,b.z-p.z),ds=hyp(s.x-p.x,s.z-p.z)||1;
    /* top açıkta: sürenden 0,9 m'den fazla uzaklaşmış (uzun dokunuş) ya da müdahale edene sürenden belirgin yakın.
       Vuruş hazırlığında dönen oyuncunun ayağındaki top açıkta sayılmaz */
    const dSur=hyp(b.x-s.x,b.z-s.z),acik=dSur>0.9||db<dSur-0.3;
    const istek=MOTOR_AYAR.mudahaleIstegi*(0.55+p.oz.mudahale*0.8)*(0.75+this.taktik[p.team].pres*0.5);
    const a=Math.atan2(b.z-p.z,b.x-p.x);
    if(db<1.1&&(acik&&this.rast()<dt*3*istek||this.rast()<dt*0.35*istek)){
      p.eylem={ad:'mudahale',t:0,sure:0.5,temas:0.16};p.yonHedef=a;p.tx=b.x;p.tz=b.z;return;}
    const kacis=(s.vx*(s.x-p.x)+s.vz*(s.z-p.z))/ds;
    if(db>1.2&&db<2.6&&kacis>2.5&&this.rast()<dt*(0.25+p.oz.sertlik*0.7)*istek){
      const v=Math.max(p.spd,5.5)+1.2;p.eylem={ad:'kayma',t:0,sure:0.95,kilit:true,fren:4.5,oldu:false};p.vx=Math.cos(a)*v;p.vz=Math.sin(a)*v;p.yon=a;
      this.on('kayma',{p});}
  },
  /* kayarak müdahalede top her adım kontrol edilir */
  kaymaTemas(p){
    const e=p.eylem;if(!e||e.ad!=='kayma'||e.oldu||e.t<0.12||e.t>0.6)return;
    const b=this.ball,fx=p.x+Math.cos(p.yon)*0.8,fz=p.z+Math.sin(p.yon)*0.8;
    const s=b.sahip&&b.sahip.team!==p.team?b.sahip:null,dTop=hyp(b.x-fx,b.z-fz),dAdam=s?hyp(s.x-fx,s.z-fz):9;
    if(dTop<0.75||dAdam<0.7){e.oldu=true;this.mudahaleSonuc(p,e);}
  },
  mudahaleSonuc(p,e){
    const b=this.ball,s=b.sahip&&b.sahip!==p?b.sahip:null,kayma=e.ad==='kayma';
    const fx=p.x+Math.cos(p.yon)*(kayma?0.8:0.45),fz=p.z+Math.sin(p.yon)*(kayma?0.8:0.45);
    const dTop=hyp(b.x-fx,b.z-fz),menzil=kayma?0.8:0.75;
    let arkadan=false,rakip=s;
    if(!rakip){/* top sahipsiz: yakındaki rakibe çarpabilir */for(const o of this.teams[1-p.team])if(o.oyunda&&hyp(o.x-fx,o.z-fz)<0.8){rakip=o;break;}}
    if(rakip){const rx=p.x-rakip.x,rz=p.z-rakip.z,L=hyp(rx,rz)||1;arkadan=(rx*Math.cos(rakip.yon)+rz*Math.sin(rakip.yon))/L<-0.35;}
    const topaDegdi=dTop<menzil&&b.y<0.6;
    let kazan=false;
    if(topaDegdi){
      const sur=rakip?rakip.oz.surus:0.4,acik=s?hyp(b.x-s.x,b.z-s.z)>0.9||dTop<hyp(b.x-s.x,b.z-s.z)-0.3:true;
      kazan=this.rast()<clamp(0.34+(p.oz.mudahale-sur)*0.6+(acik?0.25:0)+(kayma?0.06:0)-(arkadan?0.15:0),0.1,0.85);
      if(kazan){const a=p.yon+this.normal()*(kayma?1.1:0.8),v=kayma?4+this.rast()*5:1.5+this.rast()*4;
        b.vx=Math.cos(a)*v;b.vz=Math.sin(a)*v;b.vy=0;b.egri=0;if(b.sahip)b.sahip.surus=null;b.sahip=null;this.dokunus(p,true);
        if(!kayma&&this.rast()<0.45+p.oz.mudahale*0.3){this.sahipYap(p);b.vx*=0.3;b.vz*=0.3;}
        this.on('steal',{p,kayma});}
    }
    /* faul: temas topa değilse ya da arkadan/sert girildiyse */
    if(rakip&&hyp(rakip.x-fx,rakip.z-fz)<(kayma?1.1:0.9)){
      const ciddiyet=clamp((kayma?0.35:0.12)+(arkadan?0.3:0)+p.oz.sertlik*0.25+(kazan?-0.1:0.1)+this.rast()*0.3,0,1);
      const P=(kayma?0.28:0.12)*(arkadan?2.6:1)*(1.35-p.oz.mudahale*0.7)*(0.7+p.oz.sertlik*0.6)*(kazan?0.3:1.25)*(topaDegdi?1:1.8)*MOTOR_AYAR.faulOrani;
      if(this.rast()<P){this.faul(p,rakip,{kayma,arkadan,ciddiyet,x:rakip.x,z:rakip.z});return;}
    }
    /* başarısız müdahale: savunmacı geçilir, bir an toparlanamaz */
    if(!kazan){p.kickCd=kayma?0.8:0.55;p.gir=0;}
  },
  /* topu alan oyuncuya arkadan itme ya da forma çekme */
  sirtFaulu(p){
    for(const o of this.teams[1-p.team]){if(!o.oyunda||o.rol==='GK'||(o.eylem&&o.eylem.kilit))continue;
      const dx=o.x-p.x,dz=o.z-p.z,d=hyp(dx,dz);if(d>1.0)continue;
      const arkada=(dx*Math.cos(p.yon)+dz*Math.sin(p.yon))/(d||1)<0.2;
      if(this.rast()<(arkada?0.09:0.04)*(0.6+o.oz.sertlik*0.8)*MOTOR_AYAR.faulOrani){this.faul(o,p,{ciddiyet:0.1+this.rast()*0.3,x:p.x,z:p.z,itme:true});return;}}
  },
  /* hava topunda itme ya da tutma */
  havaFaulu(kazanan,kaybeden){
    const P=0.055*(0.6+kaybeden.oz.sertlik*0.8)*MOTOR_AYAR.faulOrani,P2=0.03*MOTOR_AYAR.faulOrani;
    if(this.rast()<P){this.faul(kaybeden,kazanan,{hava:true,ciddiyet:0.15+this.rast()*0.25,x:kazanan.x,z:kazanan.z});return true;}
    if(this.rast()<P2){this.faul(kazanan,kaybeden,{hava:true,ciddiyet:0.1+this.rast()*0.2,x:kaybeden.x,z:kaybeden.z});return true;}
    return false;
  },
  faul(yapan,yiyen,v){
    const b=this.ball,x=clamp(v.x,-PL+0.3,PL-0.3),z=clamp(v.z,0.3,PW-0.3),h=this.half-1;
    this.ist.faul[yapan.team]++;
    yiyen.eylem={ad:'dusus',t:0,sure:0.45,kilit:true,fren:6,yerde:0.6+this.rast()*1.6*(0.4+v.ciddiyet)};
    yiyen.surus=null;if(b.sahip===yiyen)b.sahip=null;
    /* kart: sertlik, arkadan kayma, gelişen atağı kesme; son adam faulü kırmızı */
    const yd=this.dir[yiyen.team],yu=x*yd,atak=yu>PL-40&&b.sonTakim===yiyen.team;
    let sonAdam=false;if(yu>PL-30&&Math.abs(z-MZ)<16&&!v.hava){sonAdam=true;for(const q of this.teams[yapan.team])if(q!==yapan&&q.oyunda&&q.rol!=='GK'&&q.x*yd>yu)sonAdam=false;}
    /* kart: faullerin ~%20'si sarı; kırmızı çok nadir (son adam ya da çok sert giriş) */
    let kart=null;const r=this.rast();
    if(v.ciddiyet>0.95&&v.kayma&&r<0.25)kart='kirmizi';
    else if(sonAdam&&!this.cezaSahasi(yapan.team,x,z)&&v.ciddiyet>0.5&&r<0.45)kart='kirmizi';
    else if(r<clamp(v.ciddiyet*0.5+(atak?0.12:0)+(v.kayma&&v.arkadan?0.25:0)-(v.hava?0.08:0)-(v.itme?0.05:0)+(sonAdam?0.3:0)-0.02,0,0.9))kart='sari';
    const penalti=this.cezaSahasi(yapan.team,x,z)&&!v.hava||(v.hava&&this.cezaSahasi(yapan.team,x,z)&&this.rast()<0.5);
    /* avantaj: faul yiyen takım topla ilerliyor ve ciddi bir faul değil */
    if(!penalti&&kart!=='kirmizi'&&this.avantajVar(yiyen,yu)){
      this.avantaj={t:this.t,takim:yiyen.team,x,z,kart,yapan,yiyen};this.refs[0].eylem={ad:'avantaj',t:0,sure:1.4};
      this.on('avantaj',{takim:yiyen.team,aleyhe:yapan.team,faulYapan:yapan,faulYiyen:yiyen});return;}
    this.duranSure[h]+=penalti?60:15+(kart?15:0);
    this.on('faul',{faulYapan:yapan,faulYiyen:yiyen,takim:yiyen.team,aleyhe:yapan.team,x,z,penalti,kart});
    this.refs[0].eylem={ad:penalti?'penaltiGoster':'duduk',t:0,sure:1.0};
    this.durusBaslat(penalti?'penalti':'serbest',yiyen.team,penalti?this.dir[yiyen.team]*(PL-PENALTI_U):x,penalti?MZ:z,
      {bekle:1.4+(kart?2.2:0)+this.rast()*0.8,kart,faulYapan:yapan,duduk:true});
    if(kart)this.kartGoster(yapan,kart);
    this.itirazEt(yapan);
  },
  cezaSahasi(t,x,z){const gx=-this.dir[t]*PL;return Math.abs(x-gx)<CEZA_U&&Math.abs(z-MZ)<CEZA_W;},
  avantajVar(yiyen,yu){
    const b=this.ball;if(yu<-5)return false;
    const kimde=b.sahip||(b.sonDokunan&&hyp(b.x-b.sonDokunan.x,b.z-b.sonDokunan.z)<2?b.sonDokunan:null);
    if(kimde&&kimde.team===yiyen.team&&kimde!==yiyen)return true;
    let yakin=null,ed=1e9;for(const p of this.players){if(!p.oyunda||p===yiyen)continue;const dd=hyp(p.x-b.x,p.z-b.z);if(dd<ed){ed=dd;yakin=p;}}
    return !!(yakin&&yakin.team===yiyen.team&&ed<3&&this.rast()<0.5);
  },
  kartGoster(p,renk){
    const r=this.refs[0];
    if(renk==='sari'&&p.kart===1)renk='ikinciSari';
    if(renk==='sari'){p.kart=1;this.ist.sari[p.team]++;}
    else{if(renk==='ikinciSari')this.ist.sari[p.team]++;p.kart=2;this.ist.kirmizi[p.team]++;}
    const d=this.durus;if(d)d.kartAn={p,renk};
    r.kartSira={p,renk,t:0};
    this.on('kart',{p,renk,aleyhe:p.team,takim:p.team});
  },
  itirazEt(yapan){
    let n=0;for(const q of this.teams[yapan.team]){if(!q.oyunda||q.rol==='GK'||n>=2)continue;
      if(hyp(q.x-yapan.x,q.z-yapan.z)<14&&this.rast()<0.55){q.eylem={ad:'itiraz',t:0,sure:1.4+this.rast()};n++;}}
  },
  /* her karede: avantajın süresi, kaleci elde, kayma teması */
  kuralAdim(dt){
    const b=this.ball;
    if(this.degisiklik&&this.degisiklik.girdi)this.degisiklikAdim(dt);
    if(b.tasiyan&&b.tasiyan.rol==='GK')this.kaleciElde(dt);
    for(const p of this.players)if(p.eylem&&p.eylem.ad==='kayma')this.kaymaTemas(p);
    const a=this.avantaj;
    if(a){const kaybetti=b.sahip&&b.sahip.team!==a.takim;
      if(kaybetti&&this.t-a.t<2){/* avantaj gerçekleşmedi: faule dön */this.avantaj=null;
        this.on('faul',{faulYapan:a.yapan,faulYiyen:a.yiyen,takim:a.takim,aleyhe:a.yapan.team,x:a.x,z:a.z,penalti:false,kart:a.kart});
        this.duranSure[this.half-1]+=15;this.refs[0].eylem={ad:'duduk',t:0,sure:1.0};
        this.durusBaslat('serbest',a.takim,a.x,a.z,{bekle:1.2+(a.kart?2:0),kart:a.kart,faulYapan:a.yapan,duduk:true});if(a.kart)this.kartGoster(a.yapan,a.kart);}
      else if(this.t-a.t>2.5){this.avantaj=null;if(a.kart)this.bekleyenKart=a;}}
  },

  /* ============ ofsayt ============ */
  /* pas anında: pası alan takımın rakip yarıda, toptan ve sondan ikinci savunmacıdan önde olan oyuncuları */
  ofsaytPasAni(p){
    const b=this.ball,son=this.sonKullanim;
    if(son&&son.p===p&&this.t-son.t<1.5&&(son.tur==='tac'||son.tur==='korner'||son.tur==='kaleVurusu')){b.ofsaytta=null;return;}
    const t=p.team,d=this.dir[t],cizgi=ofsaytCizgisi(this,t),bu=b.x*d,liste=[];
    for(const q of this.teams[t]){if(q===p||!q.oyunda)continue;const qu=q.x*d;if(qu>0&&qu>bu+0.05&&qu>cizgi+0.05)liste.push({q,fark:qu-Math.max(cizgi,bu)});}
    b.ofsaytta=liste.length?{takim:t,liste,t:this.t}:null;
  },
  ofsaytDokunus(p,kasitli){
    const b=this.ball,o=b.ofsaytta;if(!o)return;
    if(p.team!==o.takim){if(kasitli)b.ofsaytta=null;return;}
    const k=o.liste.find(a=>a.q===p);b.ofsaytta=null;
    if(!k)return;
    /* çok yakın pozisyonda yan hakem bayrağı kaldırmayabilir */
    if(k.fark<0.4&&this.rast()<0.35*(1-k.fark/0.4))return;
    this.ofsaytCal(p);
  },
  ofsaytCal(p){
    const yh=p.x>0?this.refs[1]:this.refs[2];yh.eylem={ad:'bayrak',t:0,sure:2.6,tur:'ofsayt'};
    this.ist.ofsayt[p.team]++;this.on('ofsayt',{p,aleyhe:p.team});
    this.refs[0].eylem={ad:'duduk',t:0,sure:1.0};
    this.durusBaslat('serbest',1-p.team,clamp(p.x,-PL+1,PL-1),clamp(p.z,1,PW-1),{bekle:1.6,endirekt:true,ofsayt:true,duduk:true});
  },

  /* ============ hakemler ============ */
  hakemAI(dt){
    const b=this.ball,r=this.refs,T=this.tunel,ph=this.phase;
    if(MAC_ONCESI.includes(ph))return;
    if(ph==='halftime'||(ph==='fulltime'&&this.phaseT>9)){r.forEach((q,i)=>{q.hizOran=0.3;q.tx=T.x+(i-1)*0.5;q.tz=T.z-3;q.bak=null;q.yonHedef=null;});return;}
    if(ph==='fulltime'){r.forEach((q,i)=>{q.hizOran=0.3;q.tx=(i-1)*1.2;q.tz=MZ-3;});return;}
    /* orta hakem: çapraz çizgi, oyunu kendisiyle aktif yan hakem arasında tutar, 12–20 m uzakta */
    const h=r[0],du=this.durus,fx=du?du.x:b.x,fz=du?du.z:b.z;
    const kartSira=h.kartSira;
    if(kartSira){kartSira.t+=dt;const p=kartSira.p;h.tx=p.x+(h.x<p.x?-1.6:1.6);h.tz=p.z;h.hizOran=1;h.bak=p;
      if(hyp(h.x-p.x,h.z-p.z)<2.2&&!(h.eylem&&h.eylem.ad==='kart')){h.eylem={ad:'kart',t:0,sure:1.7,renk:kartSira.renk};}
      if(h.eylem&&h.eylem.ad==='kart'&&h.eylem.t>1.5||kartSira.t>6){h.kartSira=null;if(p.kart===2)this.oyundanCikar(p);}}
    else{
      const cap=MZ-clamp(fx,-PL,PL)/PL*21;
      let tx=clamp(fx*0.8-Math.sign(fx||1)*3,-40,40),tz=lerp(cap,fz,0.28);
      const dd=hyp(tx-fx,tz-fz);if(dd<12){const s=12/(dd||1);tx=fx+(tx-fx)*s;tz=fz+(tz-fz)*s;}
      h.tx=clamp(tx,-PL+2,PL-2);h.tz=clamp(tz,2,PW-2);const uzak=hyp(h.tx-h.x,h.tz-h.z);h.hizOran=uzak>14?1:uzak>5?0.65:0.4;h.bak=b;}
    /* yan hakemler: kendi yarılarında, sondan ikinci savunmacı ya da top hizasında; yan adımla izler */
    const yan=(q,s,z)=>{q.tx=clamp(this.ofsaytHizasi(s),0,PL-1)*s;q.tz=z;const uz=Math.abs(q.tx-q.x);q.hizOran=uz>8?1:0.55;
      q.yonHedef=uz>6?null:(z>MZ?-Math.PI/2:Math.PI/2);q.bak=b;};
    yan(r[1],1,PW+1.3);yan(r[2],-1,-1.3);
  },
  ofsaytHizasi(side){const def=this.dir[0]===-side?0:1;const xs=this.teams[def].filter(p=>p.oyunda).map(p=>p.x*side).sort((a,c)=>c-a);return Math.max(xs[1]||0,this.ball.x*side,0);},
  oyundanCikar(p){p.oyunda=false;p.cikiyor=true;p.eylem=null;p.surus=null;p.tx=this.tunel.x;p.tz=this.tunel.z-4;p.hizOran=0.35;
    const b=this.ball;if(b.sahip===p)b.sahip=null;this.on('oyundanCikti',{p});}
});
