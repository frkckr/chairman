/* ============ Chairman — maç günü: maç öncesi, devre arası, maç sonu (mantık, çizimsiz) ============
   Çizelge js/mac-senaryo.js'tedir. Başkan koltuğuna oturduğunda stat yarı boştur; saha kenarında herkes kendi işini yapar:
   top toplayıcılar yerlerine geçer, kaleciler antrenörleriyle, hakemler orta çizgi boyunca, takımlar yardımcı antrenörleriyle
   ısınır (koşu, esneme, rondo, paslaşma, şut, depar) ve farklı anlarda içeri girer. Sonra 4. hakem, yedekler, antrenörler,
   fotoğrafçılar ve en son teknik direktörler çıkar. Takımlar önde üç hakemle tünelden çıkar; İstiklal Marşı; TFF sırasıyla
   tokalaşma (misafirler kaptanları önde önce hakemlerle, sonra ev sahibiyle; ardından hakemler ev sahibiyle); iki takım
   fotoğrafı; yazı tura (Kural 8: kazanan santrayı ya da kaleyi seçer); takımlar kenetlenir ve yerlerine geçer.
   Senaryonun rastgeleliği ayrı bir tohumdan gelir (this.srast); maçın kendi rastgele dizisini değiştirmez.
   Görüntüye yalnızca durum verilir: kişilerin yeri, bakışı, "poz" etiketi (esneme, tokalaşma, çömelme…), antrenman topları,
   koniler ve olaylar (on). Nasıl görüneceğine görüntü katmanı karar verir. */
const SZ_SIRA=MZ-9;   // tören sırasının çizgisi (orta yuvarlak ile ana tribün arasında)
Object.assign(Match.prototype,{
  /* ============ saha kenarındaki kişiler: teknik direktör, kaleci antrenörü, kondisyoner, 4. hakem, fotoğrafçılar ============ */
  kenarKur(){
    const L=[],ekle=(kind,t,ek)=>{const p=this.varlik('kenar',0,MZ,Object.assign({kind,team:t,maxSpd:5.2,oz:{hiz:0.4},yon:Math.PI/2},ek));L.push(p);return p;};
    for(let t=0;t<2;t++){const kd=this.kadro&&this.kadro[t],kb=this.kulubeler[t];
      ekle('td',t,{name:kd?kd.td.ad:'Hoca',kayit:kd?kd.td:null,ev:{x:kb.alan.x,z:kb.alan.z}});
      const s=kb.koltuklar[5]||{x:kb.alan.x+2.6,z:kb.alan.z-3.3};
      ekle('kaleciAnt',t,{name:'Kaleci antrenörü',koltuk:s,ev:{x:s.x,z:s.z}});
      ekle('kondisyoner',t,{name:'Kondisyoner',ev:{x:kb.alan.x+(t?-4.1:4.1),z:kb.alan.z-2.8}});}
    ekle('dorduncu',-1,{name:'4. hakem',ev:{x:-5,z:-2.6},maxSpd:6});
    [[-1,-7],[-1,8],[1,-8],[1,7]].forEach(([s,dz])=>ekle('foto',-1,{name:'Fotoğrafçı',ev:{x:s*(PL+2.4),z:MZ+dz}}));
    this.kenar=L;
  },
  kenarBul(kind,t){return this.kenar.find(p=>p.kind===kind&&(t==null||p.team===t));},
  /* maç içinde saha kenarı: teknik direktör teknik alanda topu izleyerek gezinir, kaleci antrenörü kulübede oturur,
     kondisyoner kulübenin yanında, 4. hakem ortada, fotoğrafçılar kale arkalarında çömelir */
  kenarAI(dt){
    const b=this.ball,oyun=['play','durus','kickoff','goal'].includes(this.phase);
    for(const p of this.kenar){
      if(p.oturuyor)continue;
      if(p.kind==='td'&&oyun){p.tx=clamp(b.x*0.25+p.ev.x,p.ev.x-3.5,p.ev.x+3.5);p.tz=p.ev.z;p.hizOran=0.25;}
      else if(p.kind==='kaleciAnt'&&hyp(p.x-p.ev.x,p.z-p.ev.z-0.7)<0.4&&oyun){this.otur(p);continue;}
      else if(p.kind==='kaleciAnt'){p.tx=p.ev.x;p.tz=p.ev.z+0.7;p.hizOran=0.35;}
      else{p.tx=p.ev.x;p.tz=p.ev.z;p.hizOran=0.35;}
      p.bak=hyp(p.tx-p.x,p.tz-p.z)<1.5?(p.kind==='foto'?{x:0,z:MZ}:b):null;p.yonHedef=null;
      p.poz=p.kind==='foto'&&hyp(p.tx-p.x,p.tz-p.z)<0.8?'comel':null;
    }
  },
  otur(p){const k=p.koltuk;p.oturuyor=true;p.x=k.x;p.z=k.z;p.vx=p.vz=0;p.yon=Math.PI/2;p.poz=null;p.eylem=null;p.bak=null;},

  /* ============ maç öncesini kur: herkes tünelde, stat yarı boş ============ */
  oncesiHazirla(){
    const S=MAC_SENARYOSU,T=this.tunel,r=this.srast=tohumluRastgele((this.tohum^0x9e3779b9)>>>0),ara=a=>a[0]+r()*(a[1]-a[0]);
    this.phase='isinma';this.phaseT=0;this.durus=null;this.celeb=null;
    this.topuSifirla(T.x,T.z-3);
    let n=0;
    const iceri=p=>{p.x=T.x+((n%3)-1)*0.5;p.z=T.z-2.5-Math.floor(n/3)*0.6;n++;p.vx=p.vz=0;p.tx=p.x;p.tz=p.z;p.eylem=null;p.bak=null;
      p.yonHedef=null;p.yon=Math.PI/2;p.hizOran=0.4;p.oturuyor=false;p.poz=null;p.sg={};};
    for(const p of this.players)iceri(p);for(const Y of this.yedekler)for(const p of Y)iceri(p);
    for(const p of this.refs)iceri(p);for(const p of this.kenar)iceri(p);
    const sn=this.sen={t:0,bitti:false,toplar:[],koniler:[],olan:{},ilgiler:[],takim:[{},{}],kaleciler:[{},{}]};
    /* takımlar: sahadakiler (kaleci hariç 10) ve yedekler (kaleci hariç 4) birlikte ısınır */
    for(let t=0;t<2;t++){
      const s=t?1:-1,taban=ara(S.takimlar.cikis[t]),Y=this.yedekler[t];
      const saha=this.teams[t].slice(1).concat(Y.filter(p=>p.rol!=='GK'));
      const ts=sn.takim[t]={s,hx:s*26,gx:s*PL,taban,saha,drillBas:taban+7,kond:this.kenarBul('kondisyoner',t),toplar:[],sutSira:saha.slice()};
      let top=0;for(const [,sure] of S.driller)top+=sure;ts.drillBit=ts.drillBas+top;
      saha.forEach((p,i)=>{p.sg={cikis:taban+i*0.35+r()*1.2,iceri:ts.drillBit+2+r()*14};});
      ts.kond.sg={cikis:taban-5,iceri:ts.drillBit+10+r()*4};
      /* kaleciler ve kaleci antrenörü: daha erken çıkarlar, takım şut çalışmasına geçince antrenör kenara çekilir */
      const kl=sn.kaleciler[t]={s,gx:s*PL,cikis:ara(S.kaleciler[t]),kaleciler:[this.teams[t][0],Y.find(p=>p.rol==='GK')].filter(Boolean),
        ant:this.kenarBul('kaleciAnt',t),atis:0,sayac:0,top:null};
      kl.kaleciler.forEach((p,i)=>{p.sg={cikis:kl.cikis+i*0.8,iceri:ts.drillBit+4+r()*10};});
      kl.ant.sg={cikis:kl.cikis+0.4,iceri:ts.drillBit+8+r()*6};
      /* kulübeye dönüş: yedekler ve antrenörler rastgele anlarda; teknik direktör en son */
      for(const p of Y)p.sg.kulube=ara(S.yedekler);
      kl.ant.sg.kulube=ara(S.yedekler);ts.kond.sg.kulube=ara(S.yedekler);
      this.kenarBul('td',t).sg={kulube:ara(S.teknikDirektorler)};
    }
    this.refs.forEach((h,i)=>{h.sg={cikis:ara(S.hakemler.cikis)+i*0.7,iceri:ara(S.hakemler.iceri)+i*0.6,adim:0,x:(i-1)*2.2};});
    this.kenarBul('dorduncu').sg={kulube:ara(S.dorduncu)};
    this.kenar.filter(p=>p.kind==='foto').forEach((p,i)=>{p.sg={kulube:ara(S.fotografcilar),bekle:{x:[-7,-3,3,7][i],z:3.5}};});
    this.on('oncesi',{ad:'basla'});
  },

  /* ============ ısınma evresi ============ */
  stepIsinma(dt){
    const S=MAC_SENARYOSU,sn=this.sen;sn.t+=dt;sn.ilgiler.length=0;
    for(let t=0;t<2;t++){this.kaleciIsinma(t,dt);this.takimIsinma(t,dt);}
    this.hakemIsinma(dt);this.kenarOncesi(dt);
    this.hareketHepsi(dt,true);
    this.antrenmanTopu(dt);
    /* bakış için önemli anlar */
    const ol=(ad,kosul,v)=>{if(kosul&&!sn.olan[ad]){sn.olan[ad]=true;this.on('oncesi',Object.assign({ad},v||{}));}};
    ol('kaleciler',sn.t>sn.kaleciler[0].cikis+3,{x:sn.kaleciler[0].gx,z:MZ});
    ol('hakemler',sn.t>this.refs[0].sg.cikis+6,{x:0,z:MZ});
    ol('takim0',sn.t>sn.takim[0].taban+3,{takim:0,x:sn.takim[0].hx,z:MZ});
    ol('takim1',sn.t>sn.takim[1].taban+3,{takim:1,x:sn.takim[1].hx,z:MZ});
    ol('rondo',sn.takim[0].drill==='rondo',{x:sn.takim[0].hx,z:MZ});
    ol('sut',sn.takim[1].drill==='sut',{x:sn.takim[1].gx*0.7,z:MZ});
    ol('iceri',sn.t>sn.takim[0].drillBit+4,{x:this.tunel.x,z:0});
    ol('dorduncu',sn.t>this.kenarBul('dorduncu').sg.kulube+3,{x:this.kenarBul('dorduncu').ev.x,z:0});
    ol('kulube',sn.t>Math.min(...this.yedekler[0].map(p=>p.sg.kulube))+4,{x:this.kulubeler[0].alan.x,z:0});
    ol('td',sn.t>Math.max(this.kenarBul('td',0).sg.kulube,this.kenarBul('td',1).sg.kulube)+4,{x:0,z:0});
    if(sn.t>=S.giris)this.girisBaslat();
  },
  /* bir kişi çıkış anında tünelden çıkar, içeri anında tünele girer. Dışarıdaysa true */
  sahada(p,cikis,iceri){
    const T=this.tunel,sn=this.sen;
    if(sn.t<cikis||(iceri!=null&&sn.t>=iceri)){p.tx=T.x;p.tz=T.z-4;p.hizOran=0.55;p.bak=null;p.yonHedef=null;p.poz=null;return false;}
    return true;
  },
  ilgi(ad,x,z,oncelik){this.sen.ilgiler.push({ad,x,z,oncelik:oncelik||1});},

  /* ---- kaleciler: antrenör 11 m'den vurur ya da atar; kaleci uçar, tutar, çeler. İki kaleci sırayla kaleye geçer ---- */
  kaleciIsinma(t,dt){
    const sn=this.sen,kl=sn.kaleciler[t],ts=sn.takim[t],s=kl.s,gx=kl.gx,A=kl.ant,r=this.srast;
    const aktif=kl.kaleciler[Math.floor(kl.sayac/6)%kl.kaleciler.length],takimSutu=ts.drill==='sut'||ts.drill==='depar'||sn.t>=ts.drillBit;
    const havada=kl.top&&sn.toplar.includes(kl.top)&&(kl.top.bekleyen||kl.top.kaleci||kl.top.tutan);
    kl.kaleciler.forEach(p=>{
      if(!this.sahada(p,p.sg.cikis,p.sg.iceri))return;
      if(p.eylem&&p.eylem.kilit)return;
      const kaleci=takimSutu?kl.kaleciler[0]===p:aktif===p;
      if(kaleci){p.tx=gx-s*0.7;p.tz=MZ;p.hizOran=0.45;p.bak=havada?kl.top:A;}
      else{p.tx=gx-s*1.2;p.tz=MZ+5.6;p.hizOran=0.4;p.bak={x:0,z:MZ};}
    });
    if(!this.sahada(A,A.sg.cikis,A.sg.iceri))return;
    if(takimSutu){A.tx=gx-s*14;A.tz=MZ+11;A.hizOran=0.4;A.bak={x:gx,z:MZ};return;}
    A.tx=gx-s*11;A.tz=MZ-0.5;A.hizOran=0.45;A.bak={x:gx,z:MZ};
    this.ilgi('kaleci'+t,gx-s*5,MZ,t?1:1.2);
    const hazir=hyp(A.x-A.tx,A.z-A.tz)<1&&aktif&&hyp(aktif.x-(gx-s*0.7),aktif.z-MZ)<1.5;
    if(hazir&&sn.t>=kl.atis&&!havada){
      kl.atis=sn.t+2.6+r()*1.2;kl.sayac++;
      const hz=MZ+(r()-0.5)*5.6,hy=0.2+r()*1.7,v=13+r()*5,elle=r()<0.3;
      const o=this.antTop(A.x+Math.cos(A.yon)*0.35,A.z+Math.sin(A.yon)*0.35,'kaleci'+t);o.sil=sn.t+12;
      this.antVur(A,o,{x:gx,y:hy,z:hz,v,elle,kaleci:aktif});kl.top=o;}
  },
  /* ---- hakemler: orta çizgi boyunca enine koşu, yan adım, orta yuvarlakta esneme, kısa depar; sonra içeri ---- */
  hakemIsinma(dt){
    const sn=this.sen,PROG=[{z:65,h:0.5},{z:3,h:0.5},{z:65,h:0.95},{z:3,h:0.5},{z:65,h:0.4,yan:true},{z:3,h:0.4,yan:true},{esneme:16},{z:65,h:1},{z:3,h:0.5},{bekle:true}];
    let cx=0,cz=0,n=0;
    this.refs.forEach((h,i)=>{const g=h.sg;
      if(!this.sahada(h,g.cikis,g.iceri))return;
      cx+=h.x;cz+=h.z;n++;
      if(g.adim===0&&!g.basla){h.tx=g.x;h.tz=3;h.hizOran=0.5;h.bak=null;if(hyp(h.x-g.x,h.z-3)<1){g.basla=sn.t;g.adim=0;}h.poz=null;return;}
      const a=PROG[Math.min(g.adim,PROG.length-1)];h.poz=null;h.yonHedef=null;h.bak=null;
      if(a.esneme){const ac=i*2.1;h.tx=Math.cos(ac)*1.6;h.tz=MZ+Math.sin(ac)*1.6;h.hizOran=0.4;
        if(hyp(h.x-h.tx,h.z-h.tz)<0.6){h.poz='esneme';h.bak={x:0,z:MZ};g.esT=(g.esT||0)+dt;if(g.esT>a.esneme)g.adim++;}return;}
      if(a.bekle){h.tx=(i-1)*1.3;h.tz=MZ-3;h.hizOran=0.35;h.bak=this.refs[1];return;}
      h.tx=g.x;h.tz=a.z;h.hizOran=a.h;if(a.yan)h.yonHedef=0;
      if(Math.abs(h.z-a.z)<0.8)g.adim++;});
    if(n)this.ilgi('hakemler',cx/n,cz/n,1.1);
  },
  /* ---- takım ısınması: drillerin sırası veride; her oyuncu kendi anında çıkar, en sonda içeri girer ---- */
  takimIsinma(t,dt){
    const S=MAC_SENARYOSU,sn=this.sen,ts=sn.takim[t],r=this.srast,s=ts.s,hx=ts.hx,gx=ts.gx,K=ts.kond;
    /* hangi dril */
    let ad=null,tau=sn.t-ts.drillBas,sure=0;
    if(tau>=0)for(const [d,su] of S.driller){if(tau<su){ad=d;sure=su;break;}tau-=su;}
    if(ad!==ts.drill){this.drillBitir(t);ts.drill=ad;ts.drillT0=sn.t;if(ad)this.drillBaslat(t,ad);}
    tau=sn.t-(ts.drillT0||0);
    /* kondisyoner */
    if(this.sahada(K,K.sg.cikis,K.sg.iceri)){K.poz=null;K.hizOran=0.5;K.bak={x:hx,z:MZ};
      if(!ad){K.tx=hx;K.tz=MZ-4;}
      else if(ad==='kosu'){K.tx=hx-s*6;K.tz=MZ;K.poz='alkis';}
      else if(ad==='esneme'){K.tx=hx;K.tz=MZ;K.poz=Math.sin(tau*1.1)>0?'alkis':'esneme';}
      else if(ad==='rondo'||ad==='paslasma'){K.tx=hx-s*10;K.tz=MZ;}
      else if(ad==='sut'){K.tx=gx-s*20;K.tz=MZ+5;K.bak={x:gx-s*19,z:MZ-2};}
      else{K.tx=hx;K.tz=10;K.poz='alkis';}}
    let cx=0,cz=0,n=0;
    ts.saha.forEach((p,i)=>{
      if(!this.sahada(p,p.sg.cikis,p.sg.iceri))return;
      cx+=p.x;cz+=p.z;n++;
      p.poz=null;p.bak=null;p.yonHedef=null;p.hizOran=0.5;
      if(!ad){p.tx=hx+((i%5)-2)*1.4;p.tz=MZ-6+Math.floor(i/5)*1.4;p.bak={x:hx,z:MZ};return;}
      this.drillKonum(t,ad,tau,p,i);});
    if(n){const o=ad==='sut'?{x:gx-s*15,z:MZ}:ad==='rondo'&&ts.gruplar?ts.gruplar[0].c:{x:cx/n,z:cz/n};this.ilgi('takim'+t,o.x,o.z);}
    if(ad==='sut')this.sutDrili(t,tau);
    else if(ad==='rondo'||ad==='paslasma')this.pasDrili(t,ad);
  },
  drillBaslat(t,ad){
    const sn=this.sen,ts=sn.takim[t],s=ts.s,hx=ts.hx,gx=ts.gx,K=sn.koniler;
    const koni=(x,z)=>K.push({x,z,t});
    if(ad==='kosu'){for(const z of[12,56])for(const d of[-3,3])koni(hx+d,z);}
    else if(ad==='rondo'){ts.gruplar=[0,1].map(g=>({c:{x:hx,z:MZ+(g?9:-9)},uyeler:ts.saha.filter((p,i)=>(i<7?0:1)===g)}));
      for(const G of ts.gruplar){for(let j=0;j<5;j++){const a=j/5*Math.PI*2;koni(G.c.x+Math.cos(a)*6,G.c.z+Math.sin(a)*6);}
        const o=this.antTop(G.c.x+5,G.c.z,'rondo'+t);o.sahip=G.uyeler[0];o.grup=G;ts.toplar.push(o);}}
    else if(ad==='paslasma'){ts.ciftler=[];for(let j=0;j<7;j++){const a=ts.saha[j*2],b=ts.saha[j*2+1];if(!a||!b)continue;
        const z=10+j*7.5,c={a,b,z};ts.ciftler.push(c);koni(hx-7,z);koni(hx+7,z);
        const o=this.antTop(hx-6,z,'pas'+t);o.sahip=a;o.cift=c;ts.toplar.push(o);}}
    else if(ad==='sut'){koni(gx-s*19,MZ-2);koni(gx-s*27,MZ-8);ts.sut={sonraki:sn.t+1.5,atan:null,top:null};}
    else if(ad==='depar'){for(const z of[12,26,40,54]){koni(hx+s*8,z);koni(hx-s*8,z);}}
  },
  drillBitir(t){
    const sn=this.sen,ts=sn.takim[t];
    sn.koniler=sn.koniler.filter(k=>k.t!==t);
    for(const o of ts.toplar){o.sahip=null;o.hedef=null;o.sil=sn.t+4+this.srast()*3;}
    ts.toplar=[];ts.gruplar=null;ts.ciftler=null;
    for(const p of ts.saha){if(p.eylem&&p.eylem.ad==='tekme')p.eylem=null;}
  },
  drillKonum(t,ad,tau,p,i){
    const ts=this.sen.takim[t],s=ts.s,hx=ts.hx,gx=ts.gx;
    if(ad==='kosu'){/* iki sıra, eni boyunca gidip gelir */
      const L=44,ph=(tau*3)%(2*L),ileri=ph<L,zc=12+(ileri?ph:2*L-ph),k=Math.floor(i/2);
      p.tx=hx+(i%2?1.2:-1.2);p.tz=clamp(zc+(k-3)*1.8+(ileri?1.8:-1.8),8,60);p.hizOran=0.62;}
    else if(ad==='esneme'){const a=i/ts.saha.length*Math.PI*2;p.tx=hx+Math.cos(a)*5.4;p.tz=MZ+Math.sin(a)*5.4;p.hizOran=0.4;p.bak={x:hx,z:MZ};
      if(hyp(p.x-p.tx,p.z-p.tz)<0.6)p.poz='esneme';}
    else if(ad==='rondo'){const G=ts.gruplar&&ts.gruplar.find(g=>g.uyeler.includes(p));if(!G)return;const j=G.uyeler.indexOf(p),o=ts.toplar.find(b=>b.grup===G);
      if(j<5){const a=j/5*Math.PI*2;p.tx=G.c.x+Math.cos(a)*5;p.tz=G.c.z+Math.sin(a)*5;p.hizOran=0.5;p.bak=o||G.c;}
      else if(o){p.tx=o.x+(j===5?0.6:-0.6);p.tz=o.z;p.hizOran=0.5;p.bak=o;}}
    else if(ad==='paslasma'){const c=ts.ciftler&&ts.ciftler.find(c=>c.a===p||c.b===p);if(!c)return;const o=ts.toplar.find(b=>b.cift===c);
      p.tx=hx+(c.a===p?-6:6);p.tz=c.z;p.hizOran=0.45;p.bak=o||(c.a===p?c.b:c.a);}
    else if(ad==='sut'){const q=ts.sutSira.indexOf(p),su=ts.sut;
      if(su&&su.atan===p)return;
      p.tx=gx-s*(27+Math.max(0,q)*1.3);p.tz=MZ-8;p.hizOran=0.5;p.bak={x:gx,z:MZ};}
    else if(ad==='depar'){const k=Math.floor(i/2),z=12+k*7+(i%2)*2.5,git=(tau%5)<2.4;
      p.tx=hx+s*(git?-8:8);p.tz=z;p.hizOran=git?1:0.35;if(!git&&hyp(p.x-p.tx,p.z-p.tz)<1)p.bak={x:hx-s*20,z};}
  },
  /* rondo ve paslaşma: topu tutan bir an bekler, sonra arkadaşına yerden pas atar; ortadakiler topu kovalar */
  pasDrili(t,ad){
    const sn=this.sen,ts=sn.takim[t],r=this.srast;
    for(const o of ts.toplar){
      if(o.bekleyen)continue;
      const p=o.sahip;
      if(p){if(!o.tut)o.tut=sn.t+(ad==='rondo'?0.6+r()*0.6:1.0+r()*0.6);
        if(sn.t<o.tut||hyp(p.x-p.tx,p.z-p.tz)>1.2)continue;o.tut=0;
        let q;
        if(o.grup){const U=o.grup.uyeler.slice(0,5).filter(u=>u!==p);q=U[Math.floor(r()*U.length)];}
        else q=o.cift.a===p?o.cift.b:o.cift.a;
        if(!q)continue;
        const L=hyp(q.x-o.x,q.z-o.z);this.antVur(p,o,{x:q.x,z:q.z,v:yerIlkHiz(L,ad==='rondo'?3.5:4.5,this.R),yer:true,alici:q});continue;}
      /* ortadakiler araya girer: top geri döner */
      if(o.grup&&!o.bekleyen)for(const q of o.grup.uyeler.slice(5)){
        if(hyp(q.x-o.x,q.z-o.z)<0.45&&(!o.kesildi||sn.t-o.kesildi>2)&&hyp(o.vx,o.vz)>1){o.kesildi=sn.t;
          const U=o.grup.uyeler.slice(0,5),a=U.reduce((x,y)=>hyp(y.x-o.x,y.z-o.z)<hyp(x.x-o.x,x.z-o.z)?y:x),L=hyp(a.x-o.x,a.z-o.z)||1,v=yerIlkHiz(L,2.5,this.R);
          o.vx=(a.x-o.x)/L*v;o.vz=(a.z-o.z)/L*v;o.hedef=a;q.eylem={ad:'tekme',t:0,sure:0.3,ayak:'sag',kucuk:true};this.topDegisti();}}
    }
  },
  /* şut çalışması: kondisyoner topu şut noktasına verir, sıradaki oyuncu koşup gelişine vurur; kaleci uçar ya da tutar */
  sutDrili(t,tau){
    const sn=this.sen,ts=sn.takim[t],su=ts.sut,s=ts.s,gx=ts.gx,K=ts.kond,r=this.srast;if(!su)return;
    const nokta={x:gx-s*18.5,z:MZ-1.2};
    if(!su.atan&&sn.t>=su.sonraki&&tau<28){
      const p=ts.sutSira.find(q=>hyp(q.x-q.tx,q.z-q.tz)<3);if(!p)return;
      su.atan=p;su.t0=sn.t;su.vurdu=false;su.top=null;}
    const p=su.atan;if(!p)return;
    if(!su.top&&sn.t>su.t0+0.5){const o=this.antTop(K.x+Math.cos(K.yon)*0.35,K.z+Math.sin(K.yon)*0.35,'sut'+t);ts.toplar.push(o);su.top=o;
      const L=hyp(nokta.x-o.x,nokta.z-o.z);this.antVur(K,o,{x:nokta.x,z:nokta.z,v:yerIlkHiz(L,2.2,this.R),yer:true});}
    const o=su.top;
    if(!su.vurdu){p.tx=nokta.x+s*1.2;p.tz=nokta.z-0.6;p.hizOran=0.9;p.bak=o;
      if(o&&!o.bekleyen&&!o.sahip&&hyp(o.x-(p.x+Math.cos(p.yon)*0.4),o.z-(p.z+Math.sin(p.yon)*0.4))<0.8){su.vurdu=true;o.sahip=p;
        const kl=sn.kaleciler[t],gk=kl.kaleciler[0];
        this.antVur(p,o,{x:gx,y:0.25+r()*1.5,z:MZ+(r()-0.5)*6.4,v:20+r()*6,kaleci:gk,zor:true});
        const q=ts.sutSira;q.splice(q.indexOf(p),1);q.push(p);}
      else if(sn.t-su.t0>4){su.vurdu=true;}}
    else{p.tx=gx-s*(27+(ts.sutSira.length-1)*1.3);p.tz=MZ-8;p.hizOran=0.45;
      if(sn.t-su.t0>2.2){su.atan=null;su.sonraki=sn.t+0.3+r()*0.5;}}
  },
  /* ---- saha kenarı: 4. hakem, yedekler ve antrenörler kulübeye, fotoğrafçılar, en son teknik direktörler ---- */
  kenarOncesi(dt){
    const sn=this.sen;
    for(const t of[0,1])for(const p of this.yedekler[t]){if(p.oturuyor||sn.t<p.sg.kulube)continue;if(p.sg.iceri&&sn.t<p.sg.iceri+5)continue;
      const k=p.koltuk;p.tx=k.x;p.tz=k.z+0.7;p.hizOran=0.45;p.bak=null;p.poz=null;
      if(hyp(p.x-p.tx,p.z-p.tz)<0.35){p.oturuyor=true;p.x=k.x;p.z=k.z;p.vx=p.vz=0;p.yon=Math.PI/2;}}
    for(const p of this.kenar){const g=p.sg;
      if(p.oturuyor||g.kulube==null||sn.t<g.kulube)continue;if(g.iceri&&sn.t<g.iceri+5)continue;
      if(p.kind==='kaleciAnt'){p.tx=p.ev.x;p.tz=p.ev.z+0.7;p.hizOran=0.45;p.poz=null;if(hyp(p.x-p.tx,p.z-p.tz)<0.35)this.otur(p);continue;}
      const h=p.kind==='foto'?g.bekle:p.ev;p.tx=h.x;p.tz=h.z;p.hizOran=0.4;p.poz=null;
      p.bak=hyp(p.x-h.x,p.z-h.z)<1.2?{x:p.kind==='foto'?h.x:0,z:MZ}:null;}
  },

  /* ============ antrenman topları ============ */
  antTop(x,z,grup){const o={x,y:0,z,vx:0,vy:0,vz:0,egri:0,sahip:null,hedef:null,bekleyen:null,grup:null,cift:null,ad:grup,sil:0,agda:false,tutan:null,kaleci:null};this.sen.toplar.push(o);return o;},
  /* bir kişi antrenman topuna vurur: önce vuruş pozu, ~0,15 sn sonra top çıkar. h: {x,y,z,v,yer,alici,kaleci,elle,gecikme} */
  antVur(p,o,h){
    const sn=this.sen;o.sahip=o.sahip||p;o.hedef=null;
    p.eylem=h.elle?{ad:'atis',t:0,sure:0.5}:{ad:'tekme',t:0,sure:0.45,ayak:p.ayak==='sol'?'sol':'sag',kucuk:!!h.yer&&h.v<12};
    p.yonHedef=Math.atan2(h.z-p.z,h.x-p.x);
    o.bekleyen={zaman:sn.t+(h.elle?0.2:0.15),h,p};
  },
  antrenmanTopu(dt){
    const sn=this.sen;
    for(let i=sn.toplar.length-1;i>=0;i--){const o=sn.toplar[i];
      if(o.sil&&sn.t>o.sil){sn.toplar.splice(i,1);continue;}
      if(o.bekleyen){const B=o.bekleyen,p=B.p;
        if(sn.t<B.zaman){o.x=p.x+Math.cos(p.yon)*0.35;o.z=p.z+Math.sin(p.yon)*0.35;o.y=B.h.elle?1.6:0;o.vx=o.vy=o.vz=0;continue;}
        const h=B.h,L=hyp(h.x-o.x,h.z-o.z)||1;o.bekleyen=null;o.sahip=null;p.yonHedef=null;
        if(h.yer){o.y=0;o.vy=0;o.vx=(h.x-o.x)/L*h.v;o.vz=(h.z-o.z)/L*h.v;o.hedef=h.alici||null;}
        else{const c=this.havadanCoz(o.x,Math.max(o.y,0.11),o.z,h.x,h.y,h.z,L/h.v*1.08,0);o.y=Math.max(o.y,0.11);o.vx=c.vx;o.vy=c.vy;o.vz=c.vz;}
        if(h.kaleci)this.antKaleci(o,h.kaleci,h.zor);
        continue;}
      if(o.tutan){const p=o.tutan;o.x=p.x+Math.cos(p.yon)*0.3;o.z=p.z+Math.sin(p.yon)*0.3;o.y=1.05*p.boy;o.vx=o.vy=o.vz=0;
        if(sn.t>o.birak){o.tutan=null;p.poz=null;const A=o.geri;if(A){o.y=1.3;const L=hyp(A.x-o.x,A.z-o.z)||1;
            const c=this.havadanCoz(o.x,1.3,o.z,A.x,0.3,A.z,0.6+L/14,0);o.vx=c.vx;o.vy=c.vy;o.vz=c.vz;p.eylem={ad:'elleAtis',t:0,sure:0.6};o.sil=sn.t+4;o.alan=A;}}
        continue;}
      if(o.sahip){const p=o.sahip;o.x=p.x+Math.cos(p.yon)*0.35;o.z=p.z+Math.sin(p.yon)*0.35;o.y=0;o.vx=p.vx;o.vz=p.vz;o.vy=0;continue;}
      topFizikAdim(o,dt,false,this.R);
      if(o.alan&&hyp(o.x-o.alan.x,o.z-o.alan.z)<1.1&&o.y<1.6){sn.toplar.splice(i,1);continue;}
      /* kaleci: top hizasından geçerken kurtarış */
      const K=o.kaleci;
      if(K&&(o.x-K.p.x)*(o.x-o.vx*dt-K.p.x)<=0){o.kaleci=null;
        if(K.kurtar&&hyp(o.z-K.p.z,(o.y-1)*0.6)<1.6){
          if(K.tut){o.tutan=K.p;o.birak=sn.t+0.9+this.srast()*0.6;o.geri=K.geri;K.p.poz='tutus';continue;}
          const yan=Math.sign(o.z-K.p.z)||1;o.vx=-o.vx*0.2;o.vz=yan*(2+this.srast()*3);o.vy=1.5+this.srast()*2;o.sil=sn.t+3;}}
      /* ağ: kale çizgisini geçen top ağda durur */
      if(Math.abs(o.x)>PL&&Math.abs(o.z-MZ)<GW2&&o.y<GH){const sx=Math.sign(o.x);if(Math.abs(o.x)>PL+1.7){o.x=sx*(PL+1.7);o.vx=0;o.vz*=0.3;}
        if(!o.agda){o.agda=true;o.sil=sn.t+2.5;}}
      else if(Math.abs(o.x)>PL+4||o.z<-3||o.z>PW+3){o.vx=o.vz=0;if(!o.sil)o.sil=sn.t+2;}
      /* alıcı topu karşılar */
      if(o.hedef){const q=o.hedef;if(hyp(o.x-(q.x+Math.cos(q.yon)*0.3),o.z-(q.z+Math.sin(q.yon)*0.3))<0.75&&o.y<0.5){o.sahip=q;o.hedef=null;o.vx=o.vz=0;}}
    }
  },
  /* antrenman şutunda kaleci: topun geçeceği yere uçar ya da yerinde tutar; kurtarışı önceden belirlenir */
  antKaleci(o,gk,zor){
    const sn=this.sen,dx=gk.x-o.x;if(Math.abs(o.vx)<0.5)return;
    const T=dx/o.vx;if(T<=0)return;
    const z=o.z+o.vz*T,y=clamp(o.y+o.vy*T-0.5*G*T*T,0,2.6),dz=z-gk.z,kurtar=this.srast()<(zor?0.55:0.8);
    const A=this.kenarBul('kaleciAnt',gk.team);
    o.kaleci={p:gk,kurtar,tut:kurtar&&(Math.abs(dz)<0.9||this.srast()<0.4),geri:A};
    if(Math.abs(dz)>0.6&&!gk.eylem){const k=Math.max(0.25,T-0.08),v=clamp(dz/k,-6,6);
      gk.eylem={ad:'ucus',t:0,sure:1.05,kilit:true,fren:4,vx:0,vz:v,yan:Math.sign(dz)||1,y:clamp(y,0.2,2)};}
  },

  /* ============ tünelden çıkış: önde üç hakem (maç topu orta hakemde), arkada iki sıra oyuncu ============ */
  girisBaslat(){
    const T=this.tunel,sn=this.sen;this.phase='giris';this.phaseT=0;sn.bitti=true;
    sn.toplar.length=0;sn.koniler.length=0;
    this.sira=[];const SZ=SZ_SIRA;
    this.refs.forEach((r,i)=>{r.x=T.x+(i-1)*0.8;r.z=T.z-0.6;r.hedef={x:(i-1)*1.1,z:SZ};this.sira.push(r);});
    /* sıra: önde kaptan, sonra kaleci ve diğerleri */
    this.dizi=[0,1].map(t=>{const L=this.teams[t].slice();const k=L.findIndex(p=>p.kaptan);if(k>0)L.unshift(L.splice(k,1)[0]);return L;});
    for(let i=0;i<11;i++)for(let t=0;t<2;t++){const p=this.dizi[t][i];
      p.x=T.x+(t?0.6:-0.6);p.z=T.z-1.6-i*0.9;p.hedef={x:(t?1:-1)*(2.4+i*1.05),z:SZ};this.sira.push(p);}
    for(const p of this.sira){p.vx=p.vz=0;p.tx=p.x;p.tz=p.z;p.hizOran=0.3;p.eylem=null;p.bak=null;p.yonHedef=null;p.yon=Math.PI/2;p.poz=null;}
    this.topuSifirla(T.x,T.z-0.6);this.ball.tasiyan=this.refs[0];this.topDegisti();
    this.on('giris',{});
  },
  stepGiris(dt){
    let hazir=true;
    this.sira.forEach((p,k)=>{if(this.phaseT>k*0.45){p.tx=p.hedef.x;p.tz=p.hedef.z;}
      if(hyp(p.x-p.hedef.x,p.z-p.hedef.z)>0.5)hazir=false;else p.bak={x:p.x,z:-60};});
    this.hareketHepsi(dt,true);this.topAdim(dt);
    if((hazir&&this.phaseT>4)||this.phaseT>60){
      for(const p of this.sira){p.tx=p.hedef.x;p.tz=p.hedef.z;p.bak={x:p.x,z:-60};}
      this.phase='toren';this.phaseT=0;this.on('mars',{});}
  },
  stepToren(dt){
    this.hareketHepsi(dt,true);this.topAdim(dt);
    if(this.phaseT>MAC_SENARYOSU.mars){this.phase='selam';this.phaseT=0;this.on('marsBitti',{});this.on('selam',{});
      const r=this.refs[0];this.ball.tasiyan=null;this.topuSifirla(0,MZ);r.poz=null;}
  },

  /* ============ tokalaşma (TFF sırası) ve takım fotoğrafları ============ */
  /* sıradaki kişi: misafirlerin yolunda 0–2 hakemler (sağdan sola), 3–13 ev sahibi oyuncular */
  selamIstasyon(j){if(j<3)return this.refs[2-j];return this.dizi[0][j-3];},
  selamX(s){/* yol üzerindeki yer (x); s<0: kendi sırasında sola kayar */
    if(s<=-1)return 2.4+(-s-1)*1.05;if(s<0)return 1.1+(-s)*1.3;if(s<=2)return 1.1-s*1.1;if(s<=3)return -1.1-(s-2)*1.3;return -2.4-(s-3)*1.05;},
  stepSelam(dt){
    const S=MAC_SENARYOSU,A=S.selamAdim,tau=this.phaseT,SZ=SZ_SIRA,sn=this.sen,r=this.srast;
    for(const p of this.sira)p.poz=null;
    const yol=(p,s,son,sonra)=>{/* s: yol üzerindeki ilerleme (istasyon birimi) */
      if(s>=son+0.5){sonra();return;}
      const f=s-Math.floor(s),j=f<0.55?Math.floor(s):Math.floor(s)+1;
      p.tx=this.selamX(Math.min(j,son));p.tz=SZ-0.85;p.hizOran=0.3;
      const k=Math.floor(s);
      if(k>=0&&k<=son&&f<0.55&&hyp(p.x-this.selamX(k),p.z-(SZ-0.85))<0.45){const q=this.selamIstasyon(k);
        if(q){p.poz='tokalas';q.poz='tokalas';p.bak=q;q.bak=p;return;}}
      p.bak={x:p.tx-1,z:SZ-0.85};};
    /* misafirler: kaptan önde, birer istasyon arayla */
    this.dizi[1].forEach((p,k)=>yol(p,tau/A-k,13,()=>{const f=this.fotoYeri(1,k);p.tx=f.x;p.tz=f.z;p.hizOran=0.45;p.bak=null;
      if(hyp(p.x-f.x,p.z-f.z)<0.4){p.bak={x:p.x,z:-60};p.poz=f.on?'comel':'foto';}}));
    /* ev sahibi sıradakiler misafir geçerken yüzü tribünde bekler */
    for(const p of this.dizi[0])if(!p.poz)p.bak={x:p.x,z:-60};
    /* hakemler, son misafirin ardından ev sahibi sırasını geçer */
    const hBas=(10+4)*A;
    [this.refs[0],this.refs[1],this.refs[2]].forEach((h,q)=>{
      if(tau<hBas+q*A){if(!h.poz){h.tx=h.hedef.x;h.tz=h.hedef.z;h.bak={x:h.x,z:-60};}return;}
      yol(h,3+(tau-hBas)/A-q,13,()=>{h.tx=(q-1)*1.2;h.tz=MZ-1.5;h.hizOran=0.4;h.bak={x:0,z:MZ};});});
    /* ev sahibi fotoğrafı: hakemler geçince yerinde */
    const evFoto=hBas+(2+11+1)*A,misFoto=(10+13.5)*A+9;
    if(tau>evFoto)this.dizi[0].forEach((p,k)=>{const f=this.fotoYeri(0,k);p.tx=f.x;p.tz=f.z;p.hizOran=0.35;
      if(hyp(p.x-f.x,p.z-f.z)<0.4){p.bak={x:p.x,z:-60};p.poz=f.on?'comel':'foto';}else p.bak=null;});
    /* fotoğrafçılar: ikisi ev sahibinin, ikisi misafirin önüne */
    const F=this.kenar.filter(p=>p.kind==='foto'),bitis=Math.max(evFoto,misFoto)+S.foto+2;
    F.forEach((p,i)=>{const t=i<2?0:1,c=this.fotoMerkez(t),bas=t?misFoto:evFoto;
      if(tau<bas-6){p.tx=p.sg.bekle.x;p.tz=p.sg.bekle.z;p.bak={x:p.x,z:MZ};return;}
      p.tx=c.x+(i%2?1.6:-1.6);p.tz=c.z-5.5;p.hizOran=0.5;p.bak={x:c.x,z:c.z};
      const yerinde=hyp(p.x-p.tx,p.z-p.tz)<0.5;p.poz=yerinde?'comel':null;
      if(yerinde&&tau>bas+1&&tau<bas+S.foto&&r()<dt*2.2)this.on('flas',{x:p.x+Math.cos(p.yon)*0.3,z:p.z+Math.sin(p.yon)*0.3,y:0.95});});
    if(!sn.olan.foto&&tau>Math.min(evFoto,misFoto)+1){sn.olan.foto=true;this.on('oncesi',{ad:'foto',x:this.fotoMerkez(0).x,z:SZ});}
    this.hareketHepsi(dt,true);
    if(tau>bitis)this.yaziTuraBaslat();
  },
  fotoMerkez(t){return t?{x:16,z:SZ_SIRA+2}:{x:-7.6,z:SZ_SIRA};},
  /* takım fotoğrafı: arkada 6 kişi ayakta, önde 5 kişi çömelmiş */
  fotoYeri(t,k){const c=this.fotoMerkez(t),arka=k<6;return arka?{x:c.x+(k-2.5)*0.82,z:c.z+0.45,on:false}:{x:c.x+(k-8)*0.82,z:c.z-0.45,on:true};},

  /* ============ yazı tura (Kural 8), kenetlenme, santra ============ */
  yaziTuraBaslat(){
    this.phase='yazitura';this.phaseT=0;
    for(const p of this.players)p.poz=null;
    for(const p of this.kenar)if(p.kind==='foto')p.poz=null;
  },
  stepYazitura(dt){
    const S=MAC_SENARYOSU,tau=this.phaseT,r=this.refs,sn=this.sen;
    r[0].tx=0;r[0].tz=MZ+0.3;r[0].hizOran=0.4;r[0].bak={x:0,z:MZ-1};
    if(tau<7.5){r[1].tx=1.3;r[1].tz=MZ+0.9;r[2].tx=-1.3;r[2].tz=MZ+0.9;}else{r[1].tx=0;r[1].tz=PW+1.3;r[2].tx=0;r[2].tz=-1.3;}
    r[1].hizOran=r[2].hizOran=0.45;r[1].bak=r[2].bak=null;r[1].poz=r[2].poz=r[0].poz=null;
    for(const p of this.players){p.poz=null;
      const kaptanTura=p.kaptan&&tau<8.5;
      if(kaptanTura){p.tx=p.team?1.2:-1.2;p.tz=MZ-0.5;p.hizOran=0.4;p.bak={x:0,z:MZ};if(tau>6.8&&tau<8)p.poz='tokalas';continue;}
      /* diğerleri kendi yarısında kenetlenir */
      const d=this.dir[p.team],takim=this.teams[p.team],i=takim.indexOf(p),a=i/11*Math.PI*2,cx=-d*13,cz=MZ;
      p.tx=cx+Math.cos(a)*1.25;p.tz=cz+Math.sin(a)*1.25;p.hizOran=0.5;
      if(hyp(p.x-p.tx,p.z-p.tz)<0.6){p.bak={x:cx,z:cz};p.poz='cember';}else p.bak=null;}
    for(const p of this.kenar)if(p.kind==='foto'){p.tx=p.ev.x;p.tz=p.ev.z;p.hizOran=0.5;p.bak=null;}
    this.hareketHepsi(dt,true);
    if(this.yaziTura==null&&tau>4.5){
      const kazanan=this.yaziTura=this.rast()<0.5?0:1,secim=this.srast()<S.santraSecimi?'santra':'kale';
      this.ilkSantra=secim==='santra'?kazanan:1-kazanan;
      this.on('yazitura',{takim:kazanan,secim,santra:this.ilkSantra,x:r[0].x,z:r[0].z});}
    if(tau>S.yazitura+3){for(const p of this.players){p.bak=null;p.poz=null;}
      sn.bitti=true;this.santraHazirla(this.ilkSantra,false);}
  },
  /* maç öncesini atla: herkes yerinde, tribün dolu, ilk santra (deneme aracı ve "Maça geç" düğmesi) */
  macaGec(){
    const sn=this.sen;if(sn){sn.bitti=true;sn.t=Math.max(sn.t,MAC_SENARYOSU.giris+60);sn.toplar.length=0;sn.koniler.length=0;}
    for(const p of this.players){p.poz=null;p.eylem=null;}
    for(const t of[0,1])for(const p of this.yedekler[t]){p.poz=null;p.eylem=null;if(!p.cikti&&!p.oturuyor)this.otur(p);}
    for(const p of this.kenar){p.poz=null;p.eylem=null;if(p.kind==='kaleciAnt')this.otur(p);else{p.x=p.tx=p.ev.x;p.z=p.tz=p.ev.z;p.vx=p.vz=0;}}
    this.refs.forEach(r=>{r.poz=null;r.eylem=null;});
    this.refs[1].x=20;this.refs[1].z=PW+1.3;this.refs[2].x=-20;this.refs[2].z=-1.3;
    this.ball.tasiyan=null;
    this.yaziTura=this.rast()<0.5?0:1;this.ilkSantra=this.srast()<MAC_SENARYOSU.santraSecimi?this.yaziTura:1-this.yaziTura;
    this.santraHazirla(this.ilkSantra,true);
    this.on('macaGec',{});
  },

  /* ============ devre arası ve maç sonu ============ */
  endHalf(){
    const b=this.ball;b.sahip=null;b.tasiyan=null;b.vx*=0.3;b.vz*=0.3;b.sut=null;b.hedefOyuncu=null;this.durus=null;
    const first=this.half===1;this.phase=first?'halftime':'fulltime';this.phaseT=0;
    const T=this.tunel;
    for(const p of this.players){p.eylem=null;p.surus=null;p.sevinc=false;p.bak=null;p.yonHedef=null;p.hizOran=0.3;p.poz=null;
      if(!p.oyunda)continue;
      if(first){p.tx=T.x+(p.team?0.5:-0.5);p.tz=T.z-4-p.n*0.6;}else{p.tx=p.x*0.7;p.tz=p.z;}}
    if(this.sen){this.sen.devre={sut:[0,1].map(t=>({atan:null,sonraki:this.t+8+t*2}))};}
    this.refs[0].eylem={ad:'duduk',t:0,sure:first?1.4:0.6};this.refs[0].duduk=first?0:2;
    this.on(first?'halftime':'fulltime',{score:this.score.slice(),shots:this.ist.sut.slice(),poss:this.ist.sahiplik.slice()});
  },
  stepBreak(dt){
    const T=this.tunel;
    if(this.sen)this.sen.t+=dt;
    if(this.phase==='fulltime')this.macSonu(dt);else this.devreArasi(dt);
    this.hareketHepsi(dt,true);this.topAdim(dt);
    if(this.sen)this.antrenmanTopu(dt);
    if(this.phase==='halftime'&&this.phaseT>DEVRE_ARASI){
      this.half=2;this.dir=[-this.dir[0],-this.dir[1]];this.gameSec=2700;
      for(const p of this.players){p.x=T.x+(p.team?0.6:-0.6);p.z=T.z-1.6-p.n*0.9;p.vx=p.vz=0;}
      if(this.sen){this.sen.toplar.length=0;}
      for(const t of[0,1])for(const p of this.yedekler[t])if(!p.cikti&&!p.oturuyor)this.otur(p);
      for(const p of this.kenar){p.poz=null;if(p.kind==='kaleciAnt'&&!p.oturuyor)this.otur(p);}
      this.topuSifirla(0,MZ);this.santraHazirla(1-(this.ilkSantra||0),false);this.on('secondhalf',{});}
  },
  /* devre arası: yedekler kalelerin önünde şut çalışır (yedek kaleci kalede, kaleci antrenörü topu verir); sonra kulübeye */
  devreArasi(dt){
    const sn=this.sen,tau=this.phaseT,bitis=DEVRE_ARASI-7;if(!sn||!sn.devre)return;
    for(let t=0;t<2;t++){
      const s=t?1:-1,gx=s*PL,Y=this.yedekler[t].filter(p=>!p.cikti),gk=Y.find(p=>p.rol==='GK'),atan=Y.filter(p=>p.rol!=='GK'),A=this.kenarBul('kaleciAnt',t);
      const calis=tau>3&&tau<bitis,D=sn.devre.sut[t];
      if(!calis){for(const p of Y.concat([A]))if(!p.oturuyor){const k=p.koltuk;p.tx=k.x;p.tz=k.z+0.7;p.hizOran=0.5;p.poz=null;if(hyp(p.x-p.tx,p.z-p.tz)<0.35)this.otur(p);}continue;}
      for(const p of Y.concat([A]))p.oturuyor=false;
      if(gk){gk.tx=gx-s*0.7;gk.tz=MZ;gk.hizOran=0.5;gk.bak={x:0,z:MZ};}
      A.tx=gx-s*19;A.tz=MZ+5;A.hizOran=0.5;A.bak={x:gx,z:MZ};
      atan.forEach((p,i)=>{if(D.atan===p)return;p.tx=gx-s*(26+i*1.3);p.tz=MZ-7;p.hizOran=0.5;p.bak={x:gx,z:MZ};});
      if(!D.atan&&this.t>D.sonraki&&atan.length&&gk&&hyp(gk.x-gk.tx,gk.z-MZ)<1.5&&hyp(A.x-A.tx,A.z-A.tz)<1){
        const p=atan[D.n=(D.n||0)%atan.length];D.n++;D.atan=p;D.t0=this.t;D.vurdu=false;D.top=null;}
      if(D.atan&&!D.top&&this.t>D.t0+0.5){const o=this.antTop(A.x+Math.cos(A.yon)*0.35,A.z+Math.sin(A.yon)*0.35,'devre'+t);D.top=o;const nx=gx-s*18.5,nz=MZ-1.2;
        this.antVur(A,o,{x:nx,z:nz,v:yerIlkHiz(hyp(nx-o.x,nz-o.z),2.2,this.R),yer:true});}
      if(D.atan){const p=D.atan,o=D.top;
        if(!D.vurdu){p.tx=gx-s*17.3;p.tz=MZ-1.8;p.hizOran=0.8;p.bak=o;
          if(o&&!o.bekleyen&&!o.sahip&&hyp(o.x-p.x,o.z-p.z)<1.1){D.vurdu=true;o.sahip=p;this.antVur(p,o,{x:gx,y:0.3+this.srast()*1.4,z:MZ+(this.srast()-0.5)*6,v:19+this.srast()*5,kaleci:gk,zor:true});}
          else if(this.t-D.t0>4)D.vurdu=true;}
        else if(this.t-D.t0>2.5){D.atan=null;D.sonraki=this.t+1+this.srast();}}
    }
    /* teknik direktörler soyunma odasına gider, ikinci yarıdan önce döner */
    for(const p of this.kenar)if(p.kind==='td'){if(tau<DEVRE_ARASI-10){p.tx=this.tunel.x;p.tz=this.tunel.z-4;p.hizOran=0.4;}else{p.tx=p.ev.x;p.tz=p.ev.z;p.hizOran=0.5;}}
  },
  /* maç sonu: üç düdük; kazananlar sevinir, kaybedenler yere çöker; tokalaşma; ev sahibi taraftarını alkışlar; herkes tünele */
  macSonu(dt){
    const tau=this.phaseT,T=this.tunel,h=this.refs[0],s=this.score,kazanan=s[0]>s[1]?0:s[1]>s[0]?1:-1;
    if(h.duduk>0&&(!h.eylem||h.eylem.ad!=='duduk')&&tau<2.5){h.eylem={ad:'duduk',t:0,sure:0.55};h.duduk--;}
    const tunele=p=>{p.tx=T.x+(p.team?0.5:-0.5);p.tz=T.z-4-(p.n>0?p.n:0)*0.6;p.hizOran=0.4;p.poz=null;p.bak=null;};
    for(const p of this.players){if(!p.oyunda)continue;
      if(tau<6){p.sevinc=p.team===kazanan&&tau>0.6;p.poz=kazanan>=0&&p.team!==kazanan&&tau>0.8?'yorgun':null;if(kazanan<0&&tau>0.8&&p.n%3===0)p.poz='yorgun';continue;}
      p.sevinc=false;
      if(tau<15){/* rakibiyle tokalaşır */const q=this.teams[1-p.team][p.n];if(!q||!q.oyunda){p.poz=null;continue;}
        const mx=(p.x+q.x)/2,mz=(p.z+q.z)/2;p.tx=mx+(p.team?0.45:-0.45);p.tz=mz;p.hizOran=0.35;
        const yakin=hyp(p.x-q.x,p.z-q.z)<1.3;p.poz=yakin&&tau<13?'tokalas':null;p.bak=yakin?q:null;continue;}
      if(tau<30){/* taraftarını alkışlar: tribüne paralel bir sıra, yüzü tribüne */const y=p.team===0?this.taraftarYeri:this.deplasmanYeri;
        if(!y){tunele(p);continue;}
        const k=(p.n-5)*1.1;p.tx=y.nx?y.x:y.x+k;p.tz=y.nx?y.z+k:y.z;p.hizOran=0.4;
        const vardi=hyp(p.x-p.tx,p.z-p.tz)<1;p.bak=vardi?{x:p.x+y.nx*30,z:p.z+y.nz*30}:null;p.poz=vardi?'alkis':null;continue;}
      tunele(p);}
    if(tau>12){for(const t of[0,1])for(const p of this.yedekler[t]){if(p.oturuyor){p.oturuyor=false;}tunele(p);}
      for(const p of this.kenar)if(p.kind!=='foto'&&p.kind!=='dorduncu'){p.oturuyor=false;tunele(p);}}
  }
});
