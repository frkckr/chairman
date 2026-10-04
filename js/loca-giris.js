/* ============ Chairman — stada varış, kalabalık loca ve rakip başkan (yol haritası N11, N12; yalnız sunum) ============
   Kullanıcı kararı 2026-10-04 (2.8T'nin yerini alır): “Maça geç”ten sonra doğrudan kapı gösterilmez; sahne karanlıktan yavaşça açılır ve statta
   olunduğu belli olur. Akış (~20 sn): kulüp binasının sokak cephesindeki otoparkta, armalı kapının önünde başlar (yanlarda seyirci kapılara
   yürür, N9) → kapıya yürünür, eşikte kısa bir karartma kesmesi (12 m'lik tırmanış yerine) → loş merdivenin son katı, sahanlık penceresinden
   projektör ışığı → loca kapısı açılır, aydınlık saha → kalabalık loca: önde iki yönetici ve rakip başkanın koltuğu, arkada basamakta konuklar
   (adsız ve sözsüz; içerik değildir); başkan ön sıranın önünden geçer, oturur; raf ve eller oturunca gelir.
   Rakip başkan (N12): maç gününün protokol kaydı MAC_PROTOKOL.rakipBaskan: 'yerinde' | 'sonra' | 'yok'. Kaynak sırası: ?rakipBaskan= (deneme),
   yazılmış içerik (bugün yok), TEST olarak maç tohumundan (h2; motor rastlantısı çekilmez) yerinde ya da sonra. 'yok' yalnız parametreden ya
   da içerikten gelir. Yerinde: koltuğunda oturur, başkan yaklaşınca kalkar ve döner; eller buluşur → karar anı → tepki → ikisi de oturur.
   Sonra: başkan oturduktan 8–20 sn sonra (takımlar ısınmaya çıkmadan) kapıdan gelir; başkan kalkıp ona döner → karar anı → oturulur.
   Yok: koltuk boş kalır. Karar anı js/ekran-an.js ile, kaydı js/karar-ani.js'ten (rakipTokalasma); seçim yalnız maç oturumunda tutulur
   (MAC_PROTOKOL.karar), kariyere ve ilişkiye etkisi yoktur (3.5, 5.4).
   Atlama: tıklama ya da Esc girişi bitirir (rakip başkan yerindeyse tokalaşma anına gider); karar anını hiçbir atlama geçemez. “Santraya geç”
   karar anı bitene kadar ertelenir; rakip başkan sonra gelecekse gelişi o an başlar, atlama ardından yapılır. Duraklat her şeyi dondurur
   (kare dt 0); karartma da zamandan okunur. Sırada ON_EKRAN.sayfa 'loca'dır: dürbün ve masadaki telefon kapalıdır. Maç günü arkada sürer.
   Merdiven, kapı, loca kişileri ve rakip başkan ilk girişte kurulur (tembel kurulum): ?ekran=mac denemelerinin sahnesi değişmez. Ses yoktur.
   Yürüyüş ortak modelle (js/yuruyus.js: yrYolKur, yrYuruAn, yrKalk, yrOtur; merdivende basamak başına bir adım). Ayarlar STIL.locaGiris (TEST).
     locaGirisBaslat()   varışı başlatır (js/ekran-mac-oncesi.js ilerle)
     locaGirisKare(dt)   ilerletir; rakip başkan sonra gelecekse bekler (js/arayuz.js frame)
     locaGirisKamera()   kamerayı yürüyüşün yerine koyar (js/kamera.js kameraUygula)
     locaGirisBitir()    bitirir ya da atlar: başkan oturmuş, bakış sahada */
const LG=STIL.locaGiris;
const MAC_PROTOKOL={rakipBaskan:null,karar:null};
const LOCA_GIRIS={aktif:false,mod:null,evre:null,kuruldu:false,t:0,tl:0,yol:null,kapi:null,rakip:null,kisiler:[],karartma:null,
  P:new THREE.Vector3(),B:new THREE.Vector3(),fov:LG.aci,rk:{evre:'yok',t:0},oturdu:null,selamYapildi:false,atlamaBekliyor:false,atla:null,tepki:null};
/* deneme parametresi: ?rakipBaskan=yerinde|sonra|yok */
const LG_PARAM=(()=>{try{const v=new URLSearchParams(location.search).get('rakipBaskan');return['yerinde','sonra','yok'].includes(v)?v:null;}catch(e){return null;}})();
function rakipBaskanDurumu(){
  if(LG_PARAM)return LG_PARAM;
  const ic=typeof MAC_GUNU!=='undefined'&&MAC_GUNU.protokol&&MAC_GUNU.protokol.rakipBaskan;if(ic)return ic;
  return h2((typeof mac!=='undefined'&&mac.tohum)||0,7151)<0.5?'yerinde':'sonra';
}
const lgV=(x,y,z)=>new THREE.Vector3(x,y,z);
const lgYumusak=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x);};
const lgPoz=(a,b,s)=>{const o={};for(const k of new Set([...Object.keys(a),...Object.keys(b)]))o[k]=(a[k]||0)*(1-s)+(b[k]||0)*s;return o;};
const lgYuruPoz=f=>{const s=Math.sin(f);return{lL:s*0.42,lR:-s*0.42,kL:Math.max(0,-s)*0.55,kR:Math.max(0,s)*0.55,aL:-s*0.28,aR:s*0.28,eL:-0.2,eR:-0.2};};

/* ---- kurulum: arka duvarda kapı, ardında sahanlık ve son kat merdiveni (pencereli), koltuklar, loca kişileri, rakip başkan, karartma ---- */
function locaGirisKur(){
  const L=LOCA,G=LOCA_GIRIS;if(G.kuruldu||!L)return;G.kuruldu=true;
  const kok=L.arka.parent,b=L.beton,k=L.koyu,z0=L.on-L.D,K=LG.kapi,y0=L.zemin,kutu=(w,h,d,m,x,y,z)=>box(w,h,d,m,x,y,z,kok);
  /* arka duvar kapı boşluğuyla yeniden: sol ve sağ parça, kapının üstü; çerçeve ve içeri açılan kanat */
  L.arka.visible=false;
  const x0=K.x-K.en/2,x1=K.x+K.en/2,sol=-L.W/2,sag=L.W/2;
  kutu(x0-sol,2.8,0.25,k,(sol+x0)/2,y0+1.4,z0);kutu(sag-x1,2.8,0.25,k,(x1+sag)/2,y0+1.4,z0);kutu(K.en,2.8-K.boy,0.25,k,K.x,y0+K.boy+(2.8-K.boy)/2,z0);
  const cerceve=LAM({color:LG.renk.cerceve});for(const x of[x0,x1])kutu(0.08,K.boy,0.3,cerceve,x,y0+K.boy/2,z0);kutu(K.en+0.16,0.08,0.3,cerceve,K.x,y0+K.boy,z0);
  const kanat=new THREE.Group();kanat.position.set(x0,y0,z0+0.12);kok.add(kanat);box(K.en,K.boy,0.05,LAM({color:LG.renk.kapi}),K.en/2,K.boy/2,0,kanat);
  box(0.03,0.03,0.08,LAM({color:STIL.baskan.pirinc}),K.en-0.1,1.02,0.05,kanat);G.kapi=kanat;
  /* sahanlık ve merdiven (son kat): loş, ışık kaynağı yok; tavanda ışıksız parlak lamba; batı duvarında sahanlık penceresi */
  const S=LG.merdiven,ic=LAM({color:LG.renk.ic}),bas=LAM({color:LG.renk.basamak}),zs=z0-0.12-S.sahanlik;
  kutu(K.en+0.6,0.2,S.sahanlik,bas,K.x,y0-0.1,z0-0.12-S.sahanlik/2);
  for(let i=0;i<S.basamak;i++){const yy=y0-(i+1)*S.yukseklik,zz=zs-(i+0.5)*S.derinlik;kutu(K.en+0.6,S.yukseklik,S.derinlik,bas,K.x,yy+S.yukseklik/2-0.1,zz);}
  const boy=S.basamak*S.derinlik+S.sahanlik+0.2,zm=z0-0.12-boy/2,alt=y0-S.basamak*S.yukseklik,H=3.2+S.basamak*S.yukseklik,yo=alt+H/2-0.2,zb=z0-0.12-boy;
  kutu(0.15,H,boy,ic,K.x+(K.en/2+0.35),yo,zm);
  {/* pencereli batı duvarı: sahanlığın ortasında 0,9 × 1,0 m boşluk */
    const wx=K.x-(K.en/2+0.35),pz=z0-0.12-S.sahanlik/2,pw=0.9,py0=y0+0.9,py1=y0+1.9,zt=z0-0.12,zalt=zb;
    kutu(0.15,H,zt-(pz+pw/2),ic,wx,yo,(zt+pz+pw/2)/2);kutu(0.15,H,(pz-pw/2)-zalt,ic,wx,yo,(pz-pw/2+zalt)/2);
    kutu(0.15,py0-(alt-0.2),pw,ic,wx,(py0+alt-0.2)/2,pz);kutu(0.15,(yo+H/2)-py1,pw,ic,wx,(py1+yo+H/2)/2,pz);
    kutu(0.2,0.05,pw+0.1,cerceve,wx,py0,pz);}
  kutu(K.en+0.85,0.12,boy,ic,K.x,y0+2.9,zm);kutu(K.en+0.85,H,0.15,ic,K.x,yo,zb);
  kutu(0.5,0.05,0.5,BAS({color:LG.renk.lamba}),K.x,y0+2.83,z0-0.12-S.sahanlik*0.5);
  /* koltuklar: önde başkan, rakip başkan ve iki yönetici; arkada basamak ve konuklar */
  const deri=LAM({color:LG.renk.koltuk}),ayak=LAM({color:0x2a2c33}),C=LG.kalabalik;
  const koltuk=(x,y,z)=>{const g=new THREE.Group();box(0.56,0.1,0.5,deri,0,0.46,0,g);box(0.56,0.62,0.1,deri,0,0.82,-0.24,g);box(0.06,0.42,0.06,ayak,0,0.21,0,g);
    g.position.set(x,y,z);kok.add(g);return g;};
  const zOn=L.on-0.55,zArk=L.on-C.arka.geri,yA=y0+C.arka.yukseklik;
  koltuk(0,y0,zOn);koltuk(LG.rakip.x,y0,zOn);for(const x of C.on)koltuk(x,y0,zOn);
  kutu(L.W/2-(K.x+K.en/2+0.25),C.arka.yukseklik,2.0,b,(L.W/2+K.x+K.en/2+0.25)/2,y0+C.arka.yukseklik/2,zArk-0.15);
  for(const x of C.arka.x)koltuk(x,yA,zArk);
  /* loca kişileri: takım elbiseli, aynı insan ölçeği; yüz ve saç karmayla (rastlantı çekilmez) */
  const SAC=['kisa','kisa','kel','kivircik','kisa'],SR=STIL.seyirci.sac;
  const kisi=(i,x,y,z)=>{const g={ten:Math.floor(h2(i,3)*STIL.tenler.length),sac:SAC[Math.floor(h2(i,5)*SAC.length)],sacRenk:SR[Math.floor(h2(i,7)*SR.length)],
      biyik:h2(i,11)<0.45,sakal:h2(i,13)<0.15,boy:0.97+h2(i,17)*0.06,yapi:0.97+h2(i,19)*0.07};
    const R=player(kitKaydi('takimElbise',g,0));R.root.rotation.order='YXZ';R.root.position.set(x,y,z);kok.add(R.root);pose(R,POSE.otur);return{R,x,y,z,by:0};};
  G.kisiler=[...C.on.map((x,i)=>kisi(301+i,x,y0,zOn)),...C.arka.x.map((x,i)=>kisi(311+i,x,yA,zArk))];
  /* rakip başkan */
  const R=player(kitKaydi('takimElbise',LG.rakip.gorunus,0));R.root.rotation.order='YXZ';kok.add(R.root);R.root.visible=false;G.rakip=R;
  /* karartma: oyun karesinin üstünde siyah katman (saydamlığı varış zamanından okunur; duraklatmada donar) */
  const d=document.createElement('div');d.id='karartma';d.style.cssText='position:absolute;inset:0;z-index:4;background:#000;opacity:0;pointer-events:none';
  document.getElementById('screen').appendChild(d);G.karartma=d;
}
/* ---- yollar: sokak kapısına (Y1), merdivenden locaya (Y2); duraklar ---- */
function locaGirisYolu(durum){
  const L=LOCA,K=LG.kapi,S=LG.merdiven,y0=L.zemin,z0=L.on-L.D,goz=LG.goz,koltuk=BASKAN_KOLTUGU,ya=-0.2+goz,zA=L.binaArka!==undefined?L.binaArka:L.on-10.7;
  const dis=lgV(-1.2,ya,zA-1.8-LG.dis),esik=lgV(0,ya,zA-1.8);
  const Y1=yrYolKur([dis,lgV(-0.5,ya,zA-1.8-LG.dis*0.5),esik],{hiz:LG.yol.hiz,viraj:LG.yol.viraj,ivme:LG.yol.ivme});
  const zs=z0-0.12-S.sahanlik,dip=y0-S.basamak*S.yukseklik,durakX=durum==='yerinde'?LG.rakip.x-LG.rakip.mesafe:0;
  const m0=lgV(K.x,dip+goz,zs-S.basamak*S.derinlik+0.15),m1=lgV(K.x,y0+goz,zs-0.05),mb=m0.distanceTo(m1);
  /* loca kapısından sol koridordan öne, ön sıranın önünden (yöneticilerin dizlerinin önünden) yerine */
  const W2=[m0,m1,lgV(K.x,y0+goz,z0-0.45),lgV(K.x,y0+goz,z0+0.55),lgV(-3.75,y0+goz,L.on-1.3),lgV(-3.45,y0+goz,L.on-0.3),lgV(durakX,y0+goz,L.on-0.3)];
  const Y2=yrYolKur(W2,{hiz:LG.yol.hiz,viraj:LG.yol.viraj,ivme:LG.yol.ivme,merdiven:[[0,mb]],merdivenHiz:LG.yol.merdivenHiz,basamak:{derinlik:S.derinlik,yukseklik:S.yukseklik}});
  /* kapıdan geçiş anı (yolda metre): loca kapısının z'sine en yakın nokta */
  let dKapi=0;for(let i=0;i<Y2.Q.length;i++)if(Y2.Q[i].z<=z0)dKapi=Y2.L[i];
  return{Y1,Y2,dis,esik,mb,dKapi,durak:lgV(durakX,y0+goz,L.on-0.3),ayakta:lgV(0,y0+goz,L.on-0.3),oturma:lgV(koltuk.x,koltuk.y+STIL.kameralar.baskan.goz,koltuk.z),
    kapiHedef:lgV(0,1.5,zA),cephe:lgV(3.5,4.2,zA),saha:lgV(koltuk.x,0,koltuk.z+40),rakipYuz:lgV(LG.rakip.x,y0+1.6,L.on-0.3)};
}
/* ---- rakip başkan: evreler (yok, oturuyor, kalkiyor, bekliyor, yuruyor, el, tepki, otur) ---- */
function lgRakipEvre(e){const r=LOCA_GIRIS.rk;r.evre=e;r.t=0;}
function lgRakipKare(dt){
  const G=LOCA_GIRIS,R=G.rakip,r=G.rk,L=LOCA;if(!R)return;r.t+=dt;
  const y0=L.zemin,koltukP=lgV(LG.rakip.x,y0,L.on-0.55),ayak=lgV(LG.rakip.x,y0,L.on-0.3),yuz=-Math.PI/2,T=LG.sure;
  R.root.visible=r.evre!=='yok';
  if(r.evre==='oturuyor'){R.root.position.copy(koltukP);R.root.rotation.y=0;pose(R,POSE.otur);}
  else if(r.evre==='kalkiyor'){const s=lgYumusak(r.t/T.kalk);R.root.position.lerpVectors(koltukP,ayak,s);R.root.rotation.y=yuz*s;pose(R,lgPoz(POSE.otur,{},s));
    if(r.t>=T.kalk)lgRakipEvre('bekliyor');}
  else if(r.evre==='bekliyor'){R.root.position.copy(r.yer||ayak);R.root.rotation.y=yuz;pose(R,lgPoz({},POSE.tokalas,lgYumusak(r.t/0.5)*(r.el?1:0)));}
  else if(r.evre==='yuruyor'){/* sonra gelen: kapıdan arka sıranın önünden geçerek başkanın yanına */
    const Y=r.yol,d=Math.min(Y.L,r.t*1.05),q=lgYolNoktasi(Y,d);R.root.position.copy(q.p);R.root.rotation.y=Math.atan2(q.yon.x,q.yon.z);pose(R,lgYuruPoz(d/0.62*Math.PI));
    if(d>=Y.L){r.yer=q.p.clone();lgRakipEvre('bekliyor');}}
  else if(r.evre==='el'){R.root.rotation.y=yuz;const p=lgPoz({},POSE.tokalas,1),a=r.t>0.4&&r.t<1.4?Math.sin(r.t*17)*0.08:0;pose(R,p);R.aL.rotation.x+=a;}
  else if(r.evre==='tepki'){/* karşılık: gülümseyip baş selamı; soğuk: kısa baş selamı, yüzünü çevirir; cevapsız: el bırakılır, kısa baş selamı */
    const s=r.t,ne=G.tepki;let p,yon=yuz;
    if(ne==='karsilik'){p=lgPoz(POSE.tokalas,{},lgYumusak((s-0.7)/0.4));p.hx=0.16*Math.max(0,Math.sin(s*7))*(s<1.2?1:0);}
    else if(ne==='soguk'){p=lgPoz(POSE.tokalas,{},lgYumusak(s/0.3));p.hx=s<0.6?0.22*Math.sin(Math.PI*s/0.6):0;yon=yuz+0.9*lgYumusak((s-0.6)/0.6);}
    else{p=lgPoz(POSE.tokalas,{},lgYumusak(s/0.35));p.hx=s>0.3&&s<0.8?0.18*Math.sin(Math.PI*(s-0.3)/0.5):0;}
    R.root.rotation.y=yon;pose(R,p);}
  else if(r.evre==='otur'){const s=lgYumusak(r.t/1.6),bas=r.yer||ayak;r.yon0=r.yon0===undefined?R.root.rotation.y:r.yon0;
    R.root.position.lerpVectors(bas,koltukP,s);R.root.rotation.y=r.yon0*(1-s);pose(R,lgPoz({},POSE.otur,lgYumusak((r.t-0.4)/1.2)));
    if(r.t>=1.6){r.yon0=undefined;r.yer=null;lgRakipEvre('oturuyor');}}
}
/* basit çoklu çizgi yol (rakip başkanın yürüyüşü): uçları yumuşak */
function lgYol(N){const L=[0];for(let i=1;i<N.length;i++)L.push(L[i-1]+N[i].distanceTo(N[i-1]));return{N,K:L,L:L[L.length-1]};}
function lgYolNoktasi(Y,d){let j=0;while(j<Y.N.length-2&&d>Y.K[j+1])j++;const a=Y.N[j],b=Y.N[j+1],u=Math.min(1,Math.max(0,(d-Y.K[j])/Math.max(1e-6,Y.K[j+1]-Y.K[j])));
  return{p:new THREE.Vector3().lerpVectors(a,b,u),yon:new THREE.Vector3().subVectors(b,a)};}
/* ---- loca kişileri: öndeki yönetici başkan geçerken başını çevirir; ötekiler sahaya bakar ---- */
function lgKisilerKare(dt){
  const G=LOCA_GIRIS;if(!G.kisiler.length)return;
  const k=G.kisiler[0],gecis=G.aktif&&G.mod==='giris'&&G.evre==='yuru2',d=Math.hypot(G.P.x-k.x,G.P.z-k.z);
  const hedef=gecis&&d<2.6?Math.max(-1.1,Math.min(1.1,Math.atan2(G.P.x-k.x,G.P.z-k.z))):0;
  k.by+=(hedef-k.by)*Math.min(1,dt*2.5);pose(k.R,Object.assign({},POSE.otur,{by:k.by}));
}
/* ---- karar anı (N12) ---- */
function lgKararAni(){
  const G=LOCA_GIRIS,kayit=KARAR_ANLARI.rakipTokalasma;if(!kayit||MAC_PROTOKOL.karar){lgKararBitti(null);return;}
  const rakip=(typeof LIG!=='undefined'&&(LIG.takimlar.find(t=>t.id===LIG.buMac.konuk)||{}).ad)||'Rakip kulüp';
  lgRakipEvre('el');baskanEylem('tokalasAn',9);
  kararAniAc(kayit,{kim:kayit.kim({rakipKulup:rakip}),bitince:lgKararBitti});
}
function lgKararBitti(secim){
  const G=LOCA_GIRIS,kayit=KARAR_ANLARI.rakipTokalasma;
  if(secim){MAC_PROTOKOL.karar={id:'rakipTokalasma',secim,an:typeof mac!=='undefined'?+mac.sen.t.toFixed(2):null};G.tepki=(kayit.tepki||{})[secim]||'basSelami';}
  else G.tepki='basSelami';
  /* el: karşılıkta biraz daha tutulur, ötekilerde hemen bırakılır */
  const e=BASKAN.eylem;if(e&&e.ad==='tokalasAn')e.t=Math.max(e.t,G.tepki==='karsilik'?6.8:7.4);
  lgRakipEvre('tepki');G.evre='tepki';G.tl=0;
}
/* ---- varış ---- */
function locaGirisBaslat(){
  if(!LOCA||!BASKAN_KOLTUGU)return;
  locaGirisKur();const G=LOCA_GIRIS;
  MAC_PROTOKOL.rakipBaskan=MAC_PROTOKOL.rakipBaskan||rakipBaskanDurumu();
  Object.assign(G,{aktif:true,mod:'giris',evre:'acilis',t:0,tl:0,yol:locaGirisYolu(MAC_PROTOKOL.rakipBaskan),fov:LG.acilisAci,oturdu:null,tepki:null});
  lgRakipEvre(MAC_PROTOKOL.rakipBaskan==='yerinde'?'oturuyor':'yok');
  ON_EKRAN.sayfa='loca';btnBino.disabled=true;
  locaGirisKare(0);
}
/* sonra gelen rakip başkanı karşılama: başkan oturuyorken kapı açılır, rakip başkan gelir; başkan kalkıp ona döner */
function lgSelamBaslat(){
  const G=LOCA_GIRIS,L=LOCA,K=LG.kapi,y0=L.zemin,z0=L.on-L.D;if(!G.rakip)return;
  G.selamYapildi=true;
  Object.assign(G,{aktif:true,mod:'selam',evre:'bak',tl:0,fov:camera.fov,P0:camera.position.clone(),B0:camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(20))});
  G.P.copy(G.P0);G.B.copy(G.B0);
  const yer=lgV(LG.rakip.mesafe,y0,L.on-0.35);
  G.rk.yol=lgYol([lgV(K.x,y0,z0+0.4),lgV(K.x+0.3,y0,L.on-1.0),lgV(yer.x+0.05,y0,L.on-1.0),yer]);G.rk.el=false;lgRakipEvre('yuruyor');
  G.selamYer=yer;G.ayaktaSelam=lgV(0,y0+LG.goz,L.on-0.25);
  ON_EKRAN.sayfa='loca';btnBino.disabled=true;
}
function lgKarartma(){
  const G=LOCA_GIRIS,T=LG.sure;if(!G.karartma)return;let o=0;
  if(G.aktif&&G.mod==='giris'){
    if(G.evre==='acilis')o=1-lgYumusak(G.t/T.acilis);
    else if(G.evre==='yuru1'){const kalan=G.yol.Y1.yuru-G.tl;o=Math.max(G.t<T.acilis?1-lgYumusak(G.t/T.acilis):0,kalan<T.kesmeKarar?lgYumusak(1-kalan/T.kesmeKarar):0);}
    else if(G.evre==='kesme')o=1;
    else if(G.evre==='yuru2')o=1-lgYumusak(G.tl/T.kesmeAc);}
  G.karartma.style.opacity=o.toFixed(3);
}
function locaGirisKare(dt){
  const G=LOCA_GIRIS;
  if(!G.aktif){
    /* sonra gelecek rakip başkan: başkan oturduktan bir süre sonra (takımlar ısınmaya çıkmadan) */
    if(G.kuruldu&&MAC_PROTOKOL.rakipBaskan==='sonra'&&!G.selamYapildi&&G.oturdu!==null&&typeof mac!=='undefined'){
      const gecikme=LG.sonra[0]+(LG.sonra[1]-LG.sonra[0])*h2(mac.tohum||0,7153),an=Math.min(LG.sinir,G.oturdu+gecikme);
      if(mac.sen.t>=an||mac.phase!=='isinma')lgSelamBaslat();}
    if(G.kuruldu){lgRakipKare(dt);lgKisilerKare(dt);}
    if(!G.aktif){if(G.karartma)G.karartma.style.opacity='0';return;}
  }
  G.t+=dt;G.tl+=dt;
  if(KARAR_ANI.acik)kararAniKare(dt);
  if(G.mod==='giris')lgGirisAdim(dt);else lgSelamAdim(dt);
  lgRakipKare(dt);lgKisilerKare(dt);lgKarartma();
  /* loca kapısı: başkan ya da rakip başkan yaklaşınca açılır, geçince kapanır */
  const zk=LOCA.on-LOCA.D,R=G.rakip,dz=Math.min(Math.abs(G.P.z-zk)+(Math.abs(G.P.x-LG.kapi.x)>1.2?9:0),R&&R.root.visible&&G.rk.evre==='yuruyor'?Math.abs(R.root.position.z-zk):9);
  if(G.kapi)G.kapi.rotation.y=-1.6*(1-lgYumusak((dz-0.6)/1.4));
}
/* varışın evreleri: acilis → yuru1 → kesme → yuru2 → (el → tepki → geri) → otur → son */
function lgGirisAdim(dt){
  const G=LOCA_GIRIS,Y=G.yol,T=LG.sure,P=G.P,B=G.B,yer=MAC_PROTOKOL.rakipBaskan,tmp=new THREE.Vector3();
  const sonraki=e=>{G.evre=e;G.tl=0;};
  /* açılış: geniş açıyla binanın cephesine (yazı, arma, ışıklı pencereler) ve iki yanındaki kapılara yürüyen seyirciye; yürürken açı daralır, bakış kapıya iner */
  if(G.evre==='acilis'){P.copy(Y.dis);B.copy(Y.cephe);G.fov=LG.acilisAci;if(G.tl>=T.bekle)sonraki('yuru1');}
  if(G.evre==='yuru1'){const s=lgYumusak(G.tl/Y.Y1.yuru);yrYuruAn(Y.Y1,G.tl,P,tmp);B.lerpVectors(Y.cephe,Y.kapiHedef,s).lerp(tmp,0.25);G.fov=LG.acilisAci+(LG.aci-LG.acilisAci)*s;
    if(G.tl>=Y.Y1.yuru)sonraki('kesme');}
  if(G.evre==='kesme'){P.copy(Y.esik);B.copy(Y.kapiHedef);if(G.tl>=T.kesmeSiyah)sonraki('yuru2');}
  if(G.evre==='yuru2'){
    const top=Y.Y2.L[Y.Y2.L.length-1],d=yrYuruAn(Y.Y2,G.tl,P,tmp);B.copy(tmp);
    /* loca kapısından geçince bakış sahaya açılır; rakip başkan yerindeyse son metrelerde ona */
    const saha=lgV(P.x*0.4,3,LOCA.on+26);B.lerp(saha,lgYumusak((d-Y.dKapi)/1.6));
    if(yer==='yerinde'){B.lerp(Y.rakipYuz,lgYumusak((d-(top-1.8))/1.3));if(d>top-2.8&&G.rk.evre==='oturuyor'){G.rk.el=true;lgRakipEvre('kalkiyor');}}
    if(G.tl>=Y.Y2.yuru)sonraki(yer==='yerinde'&&!MAC_PROTOKOL.karar?'el':'otur');}
  if(G.evre==='el'){P.copy(Y.durak);B.copy(Y.rakipYuz);G.fov+=(LG.elAci-G.fov)*Math.min(1,dt*5);
    if(!KARAR_ANI.acik&&G.rk.evre!=='el'&&G.rk.evre!=='tepki'&&(G.rk.evre==='bekliyor'||G.tl>T.kalk))lgKararAni();}
  if(G.evre==='tepki'){P.copy(Y.durak);B.copy(Y.rakipYuz);if(G.tl>=T.tepki){sonraki('geri');lgRakipEvre('otur');}}
  if(G.evre==='geri'){const s=lgYumusak(G.tl/T.geri);P.lerpVectors(Y.durak,Y.ayakta,s);B.lerpVectors(Y.rakipYuz,Y.saha,s);G.fov+=(LG.aci-G.fov)*Math.min(1,dt*5);if(G.tl>=T.geri)sonraki('otur');}
  if(G.evre==='otur'){const s=Math.min(1,G.tl/T.otur);yrOtur(s,Y.ayakta,Y.oturma,lgV(0,0,1),P);B.lerpVectors(tmp.copy(Y.ayakta).add(lgV(0,-0.3,2.5)),Y.saha,lgYumusak(s/0.7));
    G.fov+=(LG.aci-G.fov)*Math.min(1,dt*5);if(G.tl>=T.otur)sonraki('son');}
  if(G.evre==='son'){P.copy(Y.oturma);B.copy(Y.saha);if(G.tl>=T.raf)locaGirisBitir();}
  if(G.aktif)lgOnPlan();
}
/* sonra gelen rakip başkan: bak → kalk → el → tepki → otur */
function lgSelamAdim(dt){
  const G=LOCA_GIRIS,T=LG.sure,P=G.P,B=G.B,R=G.rakip,y0=LOCA.zemin,yuz=lgV(0,0,0);
  const sonraki=e=>{G.evre=e;G.tl=0;};
  const oturma=lgV(BASKAN_KOLTUGU.x,BASKAN_KOLTUGU.y+STIL.kameralar.baskan.goz,BASKAN_KOLTUGU.z);
  if(R)yuz.set(R.root.position.x,y0+1.6,R.root.position.z);
  if(G.evre==='bak'){P.copy(G.P0);B.lerpVectors(G.B0,yuz,lgYumusak(G.tl/0.9));G.fov+=(LG.aci-G.fov)*Math.min(1,dt*5);
    const kalan=(G.rk.yol?G.rk.yol.L/1.05:0)-G.rk.t;if(G.tl>0.9&&kalan<=T.selamKalk)sonraki('kalk');}
  if(G.evre==='kalk'){const s=Math.min(1,G.tl/T.selamKalk);yrKalk(s,G.P0,G.ayaktaSelam,lgV(1,0,0),P);B.copy(yuz);
    if(G.tl>=T.selamKalk&&G.rk.evre==='bekliyor'){G.rk.el=true;sonraki('el');}}
  if(G.evre==='el'){P.copy(G.ayaktaSelam);B.copy(yuz);G.fov+=(LG.elAci-G.fov)*Math.min(1,dt*5);if(!KARAR_ANI.acik&&G.rk.evre==='bekliyor'&&G.tl>0.4)lgKararAni();}
  if(G.evre==='tepki'){P.copy(G.ayaktaSelam);B.copy(yuz);if(G.tl>=T.tepki){sonraki('otur');G.rk.yer=R.root.position.clone();lgRakipEvre('otur');}}
  if(G.evre==='otur'){const s=Math.min(1,G.tl/T.otur);yrOtur(s,G.ayaktaSelam,oturma,lgV(0,0,1),P);B.lerpVectors(yuz,lgV(0,0,BASKAN_KOLTUGU.z+40),lgYumusak(s/0.7));
    G.fov+=(LG.aci-G.fov)*Math.min(1,dt*5);if(G.tl>=T.otur+T.raf)locaGirisBitir();}
  if(G.aktif)lgOnPlan();
}
/* ön plan: raf ve eller yalnız otururken (sağ el tokalaşırken de) */
function lgOnPlan(){
  const G=LOCA_GIRIS,otur=G.evre==='son'||(G.evre==='otur'&&G.tl>LG.sure.otur*0.55)||(G.mod==='selam'&&G.evre==='bak');
  BK_MASA.visible=otur;BK_EL.sol.g.visible=otur;BK_EL.sag.g.visible=otur||!!(BASKAN.eylem&&BASKAN.eylem.ad==='tokalasAn');
}
function locaGirisKamera(){
  const G=LOCA_GIRIS;camera.position.copy(G.P);camera.lookAt(G.B);
  if(Math.abs(camera.fov-G.fov)>1e-6){camera.fov=G.fov;camera.updateProjectionMatrix();}
}
/* atlama: rakip başkan yerindeyse ve karar anı olmadıysa tokalaşma anına gidilir */
function lgElAtla(){
  const G=LOCA_GIRIS;if(G.mod==='giris'){G.evre='el';G.tl=0;G.yol.Y2&&G.P.copy(G.yol.durak);G.rk.el=true;lgRakipEvre('bekliyor');}
  else{G.evre='el';G.tl=0.4;G.P.copy(G.ayaktaSelam);if(G.rk.evre==='yuruyor'){G.rk.t=1e3;lgRakipKare(0);}}
}
/* bitiş ya da atlama: başkan koltuğunda, kamera maçın bakışına hizalanır, düğmeler açılır; rakip başkan durumuna göre oturur ya da yoktur */
function locaGirisBitir(){
  const G=LOCA_GIRIS;if(!G.aktif)return;
  const selam=G.mod==='selam';G.aktif=false;G.evre=null;
  if(G.kapi)G.kapi.rotation.y=0;
  const r=G.rk.evre;if(r!=='yok'&&r!=='oturuyor'){G.rk.yer=null;lgRakipEvre('oturuyor');}lgRakipKare(0);
  BK_MASA.visible=true;BK_EL.sol.g.visible=true;BK_EL.sag.g.visible=true;if(BASKAN.eylem&&BASKAN.eylem.ad.startsWith('tokalas'))BASKAN.eylem=null;
  if(ON_EKRAN.sayfa==='loca')ON_EKRAN.sayfa=null;
  btnBino.disabled=duraklatmaVar();camera.fov=LG.aci;
  if(!selam&&typeof mac!=='undefined')G.oturdu=mac.sen.t;
  if(G.karartma)G.karartma.style.opacity='0';
  kameraOturt();
  /* ertelenen “Santraya geç”: karşılanacak kimse kalmadıysa şimdi */
  if(G.atlamaBekliyor&&!(MAC_PROTOKOL.rakipBaskan==='sonra'&&!G.selamYapildi)){G.atlamaBekliyor=false;if(G.atla)G.atla();}
  else if(G.atlamaBekliyor)lgSelamBaslat();
}
function lgAtla(){
  const G=LOCA_GIRIS;
  if(KARAR_ANI.acik)return;
  if(G.mod==='giris'&&MAC_PROTOKOL.rakipBaskan==='yerinde'&&!MAC_PROTOKOL.karar&&['acilis','yuru1','kesme','yuru2'].includes(G.evre)){lgElAtla();return;}
  if(G.mod==='selam'&&!MAC_PROTOKOL.karar&&['bak','kalk'].includes(G.evre)){lgElAtla();return;}
  if(['el','tepki'].includes(G.evre))return;
  locaGirisBitir();
}
/* atlama: maç görüntüsüne tıklamak ya da Esc; karar anı sürerken tıklama yutulur */
hud.addEventListener('click',e=>{if(LOCA_GIRIS.aktif){e.stopImmediatePropagation();if(!duraklatmaVar())lgAtla();}},true);
addEventListener('keydown',e=>{if(e.code==='Escape'&&LOCA_GIRIS.aktif){e.preventDefault();if(!duraklatmaVar())lgAtla();}});
/* “Santraya geç”: karar anı ya da karşılanacak rakip başkan varsa ertelenir; o an bitince yapılır */
{const eski=btnMacaGec.onclick;LOCA_GIRIS.atla=eski;
 btnMacaGec.onclick=()=>{const G=LOCA_GIRIS,bekleyen=MAC_PROTOKOL.rakipBaskan&&MAC_PROTOKOL.rakipBaskan!=='yok'&&!MAC_PROTOKOL.karar;
   if(!bekleyen){locaGirisBitir();eski();return;}
   G.atlamaBekliyor=true;
   if(G.aktif){if(G.mod==='giris'&&MAC_PROTOKOL.rakipBaskan==='yerinde'){if(!['el','tepki'].includes(G.evre))lgElAtla();}
     else if(G.mod==='giris')locaGirisBitir();
     else if(['bak','kalk'].includes(G.evre))lgElAtla();}
   else if(G.kuruldu&&!G.selamYapildi)lgSelamBaslat();
   else{G.atlamaBekliyor=false;eski();}};}
