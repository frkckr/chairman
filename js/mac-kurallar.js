/* ============ Chairman — kurallar, hakemler, duran toplar, top toplayıcılar (mantık, çizimsiz) ============
   Duran toplar gerçek sırasıyla işler. N10 (kullanıcı kararı 2026-10-04; 2.8O/MM0b'deki konilerin yerini alır): oyuncu topu almaya saha
   dışına gitmez. Top taç, korner ya da aut olunca en yakın top toplayıcı çocuk elindeki yedek topu atana verir; dışarı çıkan eski topu
   boştaki bir çocuk toplar. Top atış yerinin hemen yanında duracaksa atan onu kendisi alır.
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
        const y=this.varlik('yedek',s.x,s.z,{team:t,rol:k.mevki==='KL'?'GK':(k.mevki||'OS'),name:k.ad,no:k.no,kayit:k,oz,ayak:k.ayak||'sag',boy:k.boy||1,
          maxSpd:6.4+2.4*oz.hiz,yon:Math.PI/2,oturuyor:true,koltuk:s});
        profilKur(y,this.tohum);this.yedekler[t].push(y);});}   /* T3: yedeğin profili (mevki yok: stoper / merkez sayılır) */
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

  /* ============ top toplayıcılar (N10): yan çizgilerin ve kalelerin arkasında 12 çocuk; her birinin elinde yedek top ============ */
  topculariKur(){
    const L=[],ekle=(x,z)=>L.push(this.varlik('topcu',x,z,{kind:'topcu',ev:{x,z},yon:z<0?Math.PI/2:z>PW?-Math.PI/2:x>0?Math.PI:0,maxSpd:5.6,hizOran:0.4,oz:{hiz:0.4},boy:0.72,top:true}));
    for(const x of[-41,-27,27,41])ekle(x,-2.9);
    for(const x of[-40,-14,14,40])ekle(x,PW+2.9);
    for(const s of[-1,1])for(const dz of[-13,13])ekle(s*(PL+3.4),MZ+dz);
    return L;
  },
  /* her adım: dışarıda duran topu boştaki en yakın çocuk toplar; görevli çocuk atanın yanına gelip topu verir; diğerleri yerinde oyunu izler.
     Maç öncesinde sırayla tünelden çıkıp yerlerine geçerler (sg.cikis; js/mac-oncesi.js). Tribüne giden top geri gelmez: topsuz kalan çocuğa
     ~40 sn sonra görevlilerce yeni top verilir */
  topcuAI(dt){
    const b=this.ball,oncesi=MAC_ONCESI.includes(this.phase);
    if(!oncesi)for(const o of this.disToplar){if(o.alan||hyp(o.vx,o.vz)>3||o.y>0.5)continue;
      /* yalnız topun bulunduğu kenarın çocuğu toplar: yolu sahadan geçmez */
      const bolge=o.z<0?'alt':o.z>PW?'ust':o.x<0?'sol':'sag';
      let en=null,ed=1e9;for(const k of this.topcular){if(k.top||k.gorev||this.topcuBolge(k)!==bolge)continue;const dd=hyp(k.x-o.x,k.z-o.z);if(dd<ed){ed=dd;en=k;}}
      if(en&&ed<60){en.gorev={tur:'al',top:o};o.alan=en;}}
    for(const k of this.topcular){
      const g=k.gorev;k.yonHedef=null;
      if(oncesi&&k.sg&&k.sg.cikis!=null&&this.sen&&this.sen.t<k.sg.cikis){this.moveP(k,dt);continue;}
      if(!g){k.tx=k.ev.x;k.tz=k.ev.z;k.hizOran=0.4;k.bak=oncesi?{x:k.ev.x*0.8,z:MZ}:b.tasiyan&&b.tasiyan!==k?b.tasiyan:b;
        if(!k.top&&!oncesi){k.topBos+=dt;if(k.topBos>40){k.top=true;k.topBos=0;}}}
      else if(g.tur==='al'){const o=g.top,i=this.disToplar.indexOf(o);
        if(i<0)k.gorev=null;
        else{/* topa kendi kenarından, çizginin dışından uzanır (sahaya basmaz) */
          const bo=this.topcuBolge(k);k.tx=bo==='sol'?Math.min(o.x,-PL-0.45):bo==='sag'?Math.max(o.x,PL+0.45):o.x;
          k.tz=bo==='alt'?Math.min(o.z,-0.45):bo==='ust'?Math.max(o.z,PW+0.45):o.z;k.hizOran=0.75;k.bak=o;
          if(hyp(k.x-o.x,k.z-o.z)<0.9){this.disToplar.splice(i,1);k.top=true;k.topBos=0;k.gorev=null;}}}
      else if(g.tur==='ver'){const du=this.phase==='durus'?this.durus:null;
        if(!du||du.topcu!==k||b.tasiyan!==k){if(b.tasiyan===k){b.tasiyan=null;this.topDegisti();}k.gorev=null;}
        else{/* atana yakın, saha dışında bir yere gelir; atan yaklaşınca topu atar. Atan yoksa (sahada uygun oyuncu kalmadı; yalnız yapay
             senaryolarda, ör. d-sut) bekler: stepDurus atanı yeniden seçer (M0, 2026-10-07; gerçek maçta sonuç değişmez) */
          k.tx=g.x;k.tz=g.z;k.hizOran=0.9;const tk=du.kullanan;k.bak=tk;
          if(tk){const L=hyp(tk.x-k.x,tk.z-k.z),gel=hyp(k.x-g.x,k.z-g.z)<2.5||L<9,menzil=du.tur==='serbest'||du.tur==='penalti'?32:16;
            /* atan çizgiye dönmeden atmaz: topun peşinden dışarı taşmış oyuncu (ör. kale arkasındaki kaleci) önce yerine yönelir */
            const tkDis=Math.max(Math.abs(tk.x)-PL,-tk.z,tk.z-PW);
            /* T3 bulgusu (2026-10-07): koşarak gelen atana uzaktan atılan top kontrol edilemeyip sahaya yuvarlanıyordu (taç, 16 sn'yi aşan
               hazırlık); top ancak atan yakındayken (6 m) ya da yavaşlamışken verilir */
            const yakin=L<6||(L<menzil&&tk.spd<2.5);
            if(gel&&yakin&&du.t>0.5&&tkDis<1.0){this.topcuAtar(k,tk,du);k.gorev=null;}}}}
      this.moveP(k,dt);
    }
  },
  /* çocuğun durduğu kenar: alt (ana tribün önü), ust (karşı kenar), sol ve sag (kale arkaları) */
  topcuBolge(k){return k.ev.z<0?'alt':k.ev.z>PW?'ust':k.ev.x<0?'sol':'sag';},
  /* çocuk yedek topu atana verir (taçta ve autta elden atar; kornerde ve uzaktaki atana yerden yuvarlar) */
  topcuAtar(k,tk,du){
    const b=this.ball;b.tasiyan=null;k.top=false;k.topBos=0;
    const hx=clamp(tk.x+tk.vx*0.5,-PL-0.5,PL+0.5),hz=clamp(tk.z+tk.vz*0.5,-0.5,PW+0.5),L=hyp(hx-k.x,hz-k.z)||1;
    b.x=k.x+Math.cos(k.yon)*0.2;b.z=k.z+Math.sin(k.yon)*0.2;b.egri=0;b.ust=0;
    if(du.tur==='korner'||L>14){b.y=0;b.vy=0;const v=yerIlkHiz(L,1.2,this.R);b.vx=(hx-b.x)/L*v;b.vz=(hz-b.z)/L*v;}
    else{b.y=1.0;const c=this.havadanCoz(b.x,1.0,b.z,hx,1.3,hz,0.55+L/16,0);b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;}
    k.eylem={ad:'atis',t:0,sure:0.5};this.topDegisti();this.on('topcu',{k,tk});
  },
  /* duran topa uygun kenardaki en yakın, elinde top olan ve boştaki çocuk. Taçta o yan çizginin, kornerde o kale arkasının ya da o yan
     çizginin, autta o kale arkasının çocuğu; diğerlerinde en yakını. Duracağı yer kendi kenarında, çizginin dışında, atış noktasına en
     yakın yerdedir: çocuk sahaya girmez */
  topcuSec(du){
    const yan=du.z<MZ?'alt':'ust',kale=du.x<0?'sol':'sag';
    const uygun=du.tur==='tac'?[yan]:du.tur==='korner'?[kale,yan]:du.tur==='kaleVurusu'?[kale]:['alt','ust','sol','sag'];
    let en=null,ed=1e9;
    for(const k of this.topcular){if(!k.top||k.gorev||!uygun.includes(this.topcuBolge(k)))continue;const dd=hyp(k.x-du.x,k.z-du.z);if(dd<ed){ed=dd;en=k;}}
    if(!en)return null;
    const bo=this.topcuBolge(en);let x,z;
    if(bo==='alt'||bo==='ust'){z=bo==='alt'?-2.2:PW+2.2;x=du.tur==='tac'?clamp(du.x+(en.x>du.x?4:-4),-PL+1,PL-1):clamp(du.x,-PL+2.5,PL-2.5);}
    else{x=(bo==='sol'?-1:1)*(PL+2.3);z=du.tur==='korner'?(du.z<MZ?6:PW-6):du.tur==='kaleVurusu'?MZ+(du.z<MZ?-9.5:9.5):clamp(du.z,3,PW-3);}
    en.gorev={tur:'ver',x,z};return en;
  },
  /* top nerede durur (kariyeri değil, kopyayı ilerletir): panolarda durur; tribüne giderse null */
  topDuracagiYer(){
    const b=this.ball,o={x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:b.egri||0};
    for(let i=0;i<360;i++){topFizikAdim(o,1/30,false,this.R,this.kosullar);if(!this.panoSiniri(o))return null;if(o.y<0.01&&Math.abs(o.vy)<0.01&&hyp(o.vx,o.vz)<0.15)break;}
    return{x:o.x,z:o.z};
  },
  /* duran top için top: atış yerinin hemen yanında (≤2,5 m) duracaksa atan onu alır; değilse en yakın top toplayıcı elindeki topu verir,
     eski top dışarıda kalır (boştaki çocuk toplar). Uygun çocuk yoksa atan eski topu alır (eski davranış) */
  durusTopu(du,zorla){
    const b=this.ball,yer=zorla?null:this.topDuracagiYer();
    /* atan yalnız atış yerinin dibinde ve çizginin en çok 1,5 m dışında duracak topu kendisi alır */
    if(yer&&hyp(yer.x-du.x,yer.z-du.z)<2.5&&Math.max(Math.abs(yer.x)-PL,-yer.z,yer.z-PW)<1.5)return;
    const k=this.topcuSec(du);if(!k)return;
    this.disToplar.push({x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:0,t:0,alan:null});
    du.topcu=k;b.tasiyan=k;b.vx=b.vy=b.vz=0;b.egri=0;this.topDegisti();
  },

  /* ============ duran toplar ============ */
  durusBaslat(tur,takim,x,z,veri){
    const b=this.ball;
    this.phase='durus';this.phaseT=0;
    for(const p of this.players){if(p.eylem&&!p.eylem.kilit)p.eylem=null;p.surus=null;p.kosu=null;p.destek=null;p.yonHedef=null;}
    b.sahip=null;b.hedefOyuncu=null;b.sut=null;b.pas=null;b.ofsaytta=null;b.endirekt=null;b.tac=null;
    const du=Object.assign({tur,takim,x,z,t:0,asama:'bekle',kullanan:null,topcu:null,hazirT:0},veri||{});
    this.durus=du;this.sp=du;
    du.kullanan=this.kullananSec(du);
    this.hocaKapisi();   /* T7a: hoca kapısı — m.hoca geri çağrısı varsa her duruşta sorulur (js/mac-takim.js) */
    /* taç, korner, aut ve saha dışında kalan top: top toplayıcı yedek topu verir (N10). Faulde top sahadadır; atan alıp yerine taşır */
    b.tasiyan=null;
    if(tur==='tac'||tur==='korner'||tur==='kaleVurusu'||Math.abs(b.x)>PL+0.2||b.z<-0.2||b.z>PW+0.2)this.durusTopu(du);
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
      /* T3: görevli profilden — korner: duran top + orta; penaltı: şut + soğukkanlılık; tehlikeli serbest vuruş: duran top (T8 bunun üstüne kurulur) */
      if(du.tur==='korner')c=c*0.4+(p.rol==='OS'?0:30)-(p.profil?0.5*p.profil.alt.duranTop+0.5*p.profil.alt.orta:p.oz.pas)*20;
      if(du.tur==='tac'&&(p.mevki.bek||p.mevki.kanat))c-=6;
      if(du.tur==='penalti')c=-(p.profil?0.6*p.oz.sut+0.4*p.profil.alt.sogukkanlilik:p.oz.sut)*50-(p.rol==='FV'?10:0)+(p.rol==='GK'?99:0);
      if(du.tur==='serbest'&&p.rol==='GK')c=this.kendiCezaSahasinda(p,du.x,du.z)?c-10:c+60;
      if(du.tur==='serbest'&&this.tehlikeliSerbest(du))c=c*0.3-profilAlt(p,'duranTop',p.oz.sut)*25;
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
    this.taramaAdim(dt);   /* duran topta da etrafa bakılır */
    this.takimAI(dt,du);
    this.durusYerlesim(du,dt);
    const nk=this.durusNoktasi(du);
    if(du.t>16&&(du.asama==='getir'||du.asama==='bekle')){b.tasiyan=tk;this.topDegisti();du.asama='yerles';}
    /* çok uzadıysa: atan yerine konur (taçta top elinde) */
    if(du.t>28&&du.asama!=='hazir'){du.asama='hazir';
      if(du.tur==='tac'){tk.x=nk.x;tk.z=nk.z;tk.vx=tk.vz=0;b.tasiyan=tk;tk.eylem={ad:'tac',t:0,faz:'tut',ft:0};}
      else{b.tasiyan=null;du.geriX=tk.x;du.geriZ=tk.z;du.aci=tk.yon;b.x=du.x;b.z=du.z;}}
    /* T7a: önde biten son dakikalarda duran topta acele yok (niyetin duranGecikme'si) */
    if(du.asama==='bekle'){tk.tx=nk.x;tk.tz=nk.z;tk.hizOran=0.8;if(du.t>(du.bekle||0.45)+(this._niyet&&du.tur!=='penalti'?this._niyet[du.takim].duranGecikme:0))du.asama='getir';}
    else if(du.asama==='getir'){
      if(b.tasiyan===tk)du.asama='yerles';
      /* top çocuğun elinde: atan atış yerine gelir, çocuğa döner ve topu bekler (saha dışına çıkmaz) */
      else if(b.tasiyan&&b.tasiyan.tur==='topcu'){tk.tx=nk.x;tk.tz=nk.z;tk.hizOran=0.85;tk.bak=b.tasiyan;}
      else if(!b.tasiyan){/* top havada ya da yerde: atan alır. T4h (2026-10-09, N10 kuralı): atan çizginin en çok 1,6 m dışına gider (tahmin topun
           1,5 m içinde duracağını söylese de yavaş top öteye yuvarlanabiliyor; 1 m'lik alma erimiyle 2,6 m'ye dek yetişir); top 2,5 m'den öteye
           yuvarlanıp yavaşladıysa top toplayıcı yenisini verir (uygun çocuk yoksa atan gider) */
        if(Math.max(Math.abs(b.x)-PL,-b.z,b.z-PW)>2.5&&hyp(b.vx,b.vz)<1&&b.y<0.3&&!du.topcu)this.durusTopu(du,true);
        if(!b.tasiyan){const k=this.yakalamaNoktasi(tk,2.2);tk.tx=clamp(k.x,-PL-1.6,PL+1.6);tk.tz=clamp(k.z,-1.6,PW+1.6);tk.hizOran=0.8;tk.bak=b;
          if(hyp(b.x-tk.x,b.z-tk.z)<1.0&&b.y<2.3){b.tasiyan=tk;b.vx=b.vy=b.vz=0;this.topDegisti();du.asama='yerles';}}}
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
    /* saha dışındaki top panolarda durur; panoların üstünden tribüne giderse top toplayıcı yenisini verir */
    if(!b.tasiyan&&(Math.abs(b.x)>PL||b.z<0||b.z>PW)&&!this.panoSiniri(b))this.durusTopu(du,true);
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
      /* T3: kafa için sıralama sıçramadan (0,6 kafa + 0,2 hız + 0,2 güç; profil) ve boydan; eski eşik kafa 0,68 ≈ sıçrama 0,62 */
      const kg=p=>profilAlt(p,'sicrama',p.oz.kafa);
      const hucumcular=this.sahadakiler(du.takim).filter(p=>p!==tk&&p.rol!=='GK').sort((a,c)=>(kg(c)+c.boy)-(kg(a)+a.boy));
      for(const p of hucumcular){if(p.rol==='DEF'&&!(kg(p)>0.62&&i<2)){p.tx=d*-2;p.tz=p.z<MZ?20:48;continue;}
        const y=hucumYer[i++];if(!y){p.tx=d*(PL-30);p.tz=p.mevki.w;continue;}p.tx=d*y[0];p.tz=y[1];p.hizOran=0.8;p.bak=this.ball;this.eforVer(p,0.4);}
      const savunanlar=this.sahadakiler(savunan).filter(p=>p.rol!=='GK').sort((a,c)=>(kg(c)+c.boy)-(kg(a)+a.boy));
      for(const p of savunanlar){if(p.rol==='FV'&&j>3){p.tx=d*(-8);p.tz=p.mevki.hedef?30:40;continue;}
        const y=savYer[j++];if(!y){p.tx=d*(PL-24);p.tz=p.mevki.w;continue;}p.tx=d*y[0];p.tz=y[1];p.hizOran=0.8;p.bak=this.ball;this.eforVer(p,0.4);}
    }else if(du.tur==='penalti'){
      const kl=this.kaleci(savunan);kl.tx=gx;kl.tz=MZ;kl.bak=this.ball;kl.yonHedef=null;
      let i=0;for(const p of this.players){if(!p.oyunda||p===tk||p===kl)continue;
        if(p.rol==='GK'){p.tx=-gx*0.9;p.tz=MZ;continue;}
        const s=i++;p.tx=d*(PL-19-((s*7)%5));p.tz=MZ-14+((s*11)%28);p.hizOran=0.5;p.bak=this.ball;this.eforVer(p,0.4);}
    }else if(du.tur==='serbest'||du.tur==='kaleVurusu'){
      /* baraj: kaleye yakın serbest vuruşta topla kale arasında, 9,15 m'de */
      if(du.tur==='serbest'&&this.tehlikeliSerbest(du)&&du.asama!=='bekle'){
        du.baraj=true;const a=Math.atan2(MZ-du.z,gx-du.x),ux=Math.cos(a),uz=Math.sin(a),n=clamp(Math.round(6-(hyp(gx-du.x,MZ-du.z)-16)/3.5),2,5);
        const yakinDirek=Math.sign(du.z-MZ)||1,merkez={x:du.x+ux*9.15,z:du.z+uz*9.15},px=-uz,pz=ux;
        const oyuncular=this.sahadakiler(savunan).filter(p=>p.rol!=='GK').sort((a,c)=>hyp(a.x-merkez.x,a.z-merkez.z)-hyp(c.x-merkez.x,c.z-merkez.z)).slice(0,n);
        du.barajdakiler=oyuncular;
        oyuncular.forEach((p,k)=>{const s=(k-(n-1)/2)*0.62+yakinDirek*0.35;p.tx=merkez.x+px*s;p.tz=merkez.z+pz*s;p.hizOran=0.8;p.bak=this.ball;p.yonHedef=a+Math.PI;this.eforVer(p,0.4);});
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
    b.tasiyan=null;b.x=du.x;b.z=du.z;b.y=0;b.vx=b.vz=b.vy=0;b.ust=0;this.topDegisti();
    tk.x=du.geriX;tk.z=du.geriZ;
    this.sahipYap(tk);
    /* dolaylı serbest vuruş: başka bir oyuncu dokunmadan gol olmaz (Match.gol) */
    b.endirekt=du.endirekt?{p:tk}:null;
    const sec=this.durusSecenegi(du,tk);
    if(sec)this.vurusBaslat(tk,sec);else tk.kararT=0;
    if(du.tur==='penalti')this.penaltiKaleciHazirla(du);
  },
  /* duran topun ilk vuruşu: korner ve serbest vuruş mac-topla.js, kale vuruşu mac-kaleci.js (Faz 0) */
  durusSecenegi(du,tk){
    if(du.tur==='korner')return this.kornerSecenegi(du,tk);
    if(du.tur==='kaleVurusu')return this.kaleVurusuSecenegi(du,tk);
    if(du.tur==='penalti')return this.penaltiAtisi(du,tk);
    if(du.tur==='serbest')return this.serbestSecenegi(du,tk);
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
      this.dokunus(p,true);b.hedefOyuncu=q||null;p.kickCd=0.4;b.tac={p};b.ust=0;
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


  cezaSahasi(t,x,z){const gx=-this.dir[t]*PL;return Math.abs(x-gx)<CEZA_U&&Math.abs(z-MZ)<CEZA_W;},
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
    this.avantajAdim(dt);
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
  /* sondan ikinci savunmacının hizası (M0: her karede iki kez çağrılır; dizi kurmadan en büyük iki değer, sonuç aynı) */
  ofsaytHizasi(side){const def=this.dir[0]===-side?0:1;let a=-Infinity,c=-Infinity;
    for(const p of this.teams[def])if(p.oyunda){const v=p.x*side;if(v>a){c=a;a=v;}else if(v>c)c=v;}
    return Math.max(c>0?c:0,this.ball.x*side,0);},
  oyundanCikar(p){p.oyunda=false;p.cikiyor=true;p.eylem=null;p.surus=null;p.tx=this.tunel.x;p.tz=this.tunel.z-4;p.hizOran=0.35;
    const b=this.ball;if(b.sahip===p)b.sahip=null;if(b.tasiyan===p)b.tasiyan=null;this.on('oyundanCikti',{p});
    this.yenidenDizil(p);},
  /* kırmızı kartta yeniden diziliş (MM2): kaleci atılırsa en uygun saha oyuncusu (önce forvet, sonra kalecilik özelliği) kaleye geçer;
     savunma ya da orta saha oyuncusu atılırsa bir forvet onun mevkisine iner (takım 4-4-1 gibi oynar). Takım dizisindeki yerler takas edilir */
  yenidenDizil(p){
    const t=p.team,T=this.teams[t],takas=(a,c)=>{const na=a.n,nc=c.n,ma=a.mevki,ra=a.rol;a.n=nc;a.mevki=c.mevki;a.rol=c.rol;c.n=na;c.mevki=ma;c.rol=ra;T[a.n]=a;T[c.n]=c;};
    if(p.rol==='GK'){const L=T.filter(q=>q.oyunda&&q!==p);if(!L.length)return;
      const puan=q=>(q.rol==='FV'?1:0)+q.oz.kalecilik*3;const y=L.reduce((a,c)=>puan(c)>puan(a)?c:a);
      takas(y,p);y.eylem=null;y.surus=null;this.on('kaleyeGecti',{p:y});return;}
    if(p.rol==='FV')return;
    const F=T.filter(q=>q.oyunda&&q.rol==='FV');if(!F.length)return;
    const f=F.find(q=>!q.mevki.hedef)||F[0];takas(f,p);this.on('yenidenDizildi',{p:f});
  },
});
EYLEM_ADIM.tac=function(p,e,dt){this.tacIlerle(p,e,dt);return true;};
