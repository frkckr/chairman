/* ============ Chairman — başkanın bedeni: önündeki küçük masa, elleri ve eşyaları (ön plan katmanı) ============
   Dünya çizildikten sonra derinlik temizlenir ve bu katman üstüne çizilir. Böylece masa ve eller her zaman ekranın altında durur.
   N5 (kullanıcı kararı 2026-10-04): büyük masa kalktı, yerine locanın ön duvarının üstünde ekranı kenardan kenara kesen dar bir raf geldi.
   K1 (kullanıcı kararı 2026-10-20; kullanıcının 1. maç notu): raf ve altındaki ön duvar kalktı. Ekranın alt ortasında kare kesitli dört
   ayaklı küçük bir masa durur (ölçüler ve ekran payı STIL.baskan.onMasa): genişliğin ~%40'ı, ayakların üst yarısı görünür, ayakların ucu
   ekranın altından çıkar. Telefon masanın üstünde, eller masanın yakın kenarında; masa ekranda sabittir (Z1). BK_MASA adı (masa grubu)
   diğer dosyalar için korunur.
   Eller maçtaki olaylara tepki verir: gol sevinci (başkan ayağa kalkar), yenilen golde eller başa, kaçan pozisyonda masaya yumruk,
   itiraz, alkış. Çay 2.8A'da, masadaki maç programı 2.8O'da, dürbün (elle kaldırma hareketiyle birlikte) 2026-10-07'de kaldırıldı (kullanıcı
   kararları); kendiliğinden telefona bakma 2026-10-03'te kaldırıldı (kullanıcı kararı): masadaki telefon yalnız kullanıcı tıklayınca açılır
   (js/ekran-mac-telefon.js). */
const BK=STIL.baskan;
const BASKAN={sahne:new THREE.Scene(),kamera:new THREE.PerspectiveCamera(BK.aci,RW/RH,0.02,6),eylem:null,kuyruk:[],
  kalk:0,kalkHedef:0,sarsinti:0,govde:{y:0,p:0}};
{const S=BASKAN.sahne;S.add(new THREE.AmbientLight(0x7a7064,1.1));
 const d=new THREE.DirectionalLight(0xffe4bc,0.75);d.position.set(0.4,2,1.2);S.add(d);
 const f=new THREE.DirectionalLight(0x9fb0d8,0.25);f.position.set(-1,0.5,-1);S.add(f);}
const BK_MASA=new THREE.Group();BASKAN.sahne.add(BK_MASA);
/* ---- masa (K1): ceviz tabla (üst yüzey y = OM.y, yakın kenarı gözden OM.uzak ötede), uzak kenarında pirinç şerit; tablanın altında etek
   (kuşak), kare kesitli dört ayak yere iner. Ayakların ucu oturuşta ekranın alt kenarının altında kalır; başkan ayağa kalkınca (kamera
   yukarı ve geri) masa ekranda aşağı iner, tablanın üstü görünür, altı görünmez ---- */
const BK_OM=BK.onMasa,BK_KENAR=-BK_OM.uzak,BK_OM_Z=BK_KENAR-BK_OM.derinlik/2;
{const OM=BK_OM,cv=mk(32,16),g=cv.getContext('2d');g.fillStyle=BK.masa;g.fillRect(0,0,32,16);
 for(let y=0;y<16;y++){g.fillStyle=h2(y,3)>0.5?BK.masaKoyu:BK.masaAcik;g.fillRect(((h2(y,9)*32)|0),y,8+((h2(y,5)*14)|0),1);}
 const ust=box(OM.en,OM.kalinlik,OM.derinlik,LAM({map:tx(cv,'n',[2,1])}),0,OM.y-OM.kalinlik/2,BK_OM_Z,BK_MASA);ust.name='masa';
 const [sy,sd]=OM.serit;box(OM.en,sy,sd,LAM({color:BK.pirinc}),0,OM.y+0.002,BK_KENAR-OM.derinlik,BK_MASA);
 const koyu=LAM({color:OM.ayakRenk}),a=OM.ayak,ax=OM.en/2-OM.ayakIc-a/2,az=OM.derinlik/2-OM.ayakIc-a/2,alt=OM.y-OM.kalinlik,ek=OM.etekKalinlik;
 /* etek: ayakların ekseninde, dış yüzleri ayakların biraz içinde */
 for(const s of[-1,1]){box(2*ax,OM.etek,ek,koyu,0,alt-OM.etek/2,BK_OM_Z+s*az,BK_MASA);box(ek,OM.etek,2*az,koyu,s*ax,alt-OM.etek/2,BK_OM_Z,BK_MASA);}
 const boy=OM.boy-OM.kalinlik;
 for(const sx of[-1,1])for(const sz of[-1,1])box(a,boy,a,koyu,sx*ax,alt-boy/2,BK_OM_Z+sz*az,BK_MASA);}
/* ---- telefon: masada, ellerin arasında ekranı kapalı durur; tıklanınca maç telefonu açılır (js/ekran-mac-telefon.js). Masa uzaklaştığından
   (K1) telefon ekranda küçüldü; çizilmeyen tıklama kutusu (OM.telAlan) isabet alanını eski boyuna yakın tutar (ışın görünmezi de bulur) ---- */
const BK_TEL=new THREE.Group();BK_TEL.position.set(BK_OM.tel[0],BK_OM.y+0.007,BK_KENAR-BK_OM.tel[1]);BK_TEL.rotation.y=BK_OM.tel[2];BK_MASA.add(BK_TEL);
const BK_TEL_EKRAN=BAS({color:0x10202c});
{BK_TEL.add(new THREE.Mesh(new THREE.BoxGeometry(0.072,0.01,0.148),LAM({color:0x1a1b1f})));
 const e=new THREE.Mesh(new THREE.PlaneGeometry(0.062,0.13),BK_TEL_EKRAN);e.rotation.x=-Math.PI/2;e.position.y=0.0055;BK_TEL.add(e);
 const [ae,ay,ab]=BK_OM.telAlan,alan=new THREE.Mesh(new THREE.BoxGeometry(ae,ay,ab),BAS({color:0}));alan.visible=false;alan.position.y=ay/2-0.005;BK_TEL.add(alan);}
/* ---- eller: lacivert kol, beyaz manşet, kutu el, parmaklar, başparmak; solda saat ---- */
function elKur(taraf){
  const g=new THREE.Group(),sx=taraf==='sol'?-1:1,kol=LAM({color:BK.takim}),ten=LAM({color:BK.ten});
  box(0.096,0.074,0.52,kol,0,0.004,0.29,g);box(0.1,0.078,0.03,LAM({color:0xf2f0ea}),0,0.004,0.03,g);
  box(0.08,0.03,0.095,ten,0,-0.008,-0.058,g);
  const parmak=new THREE.Group();parmak.position.set(0,-0.01,-0.105);g.add(parmak);box(0.078,0.024,0.07,ten,0,-0.002,-0.034,parmak);
  const bas=box(0.024,0.022,0.056,ten,-sx*0.046,0.0,-0.066,g);bas.rotation.y=sx*0.4;
  if(taraf==='sol'){box(0.1,0.08,0.018,LAM({color:0x2a1c12}),0,0.004,0.004,g);box(0.04,0.01,0.04,LAM({color:BK.saat}),0,0.047,0.004,g);box(0.026,0.004,0.026,LAM({color:0xf2eee0}),0,0.053,0.004,g);}
  BASKAN.sahne.add(g);return{g,parmak};
}
const BK_EL={sol:elKur('sol'),sag:elKur('sag')};

/* ---- pozlar: bilek konumu p, dönüşü r (Euler), parmak kıvrımı k ---- */
const BKP=(x,y,z,rx,ry,rz,k)=>({p:[x,y,z],r:[rx||0,ry||0,rz||0],k:k||0});
/* dinlenme (K1): eller masanın yakın kenarında. Bilek kenarın hemen önünde, tabla hizasında; el yukarı dönük (rx) kenarın üstüne yatar,
   parmaklar tablaya iner (k < 0). Masa uzakta olduğundan kol yatay kalsa ucu havada görünürdü: kol aşağı-geri iner ve ekranın altından çıkar;
   dirsekler biraz içeride (ry), yakın ayaklar kolların dışında görünür */
const BK_DINLEN={sol:BKP(-0.25,BK_OM.y-0.004,BK_KENAR+0.04,0.45,0.15,0,-0.5),sag:BKP(0.245,BK_OM.y-0.004,BK_KENAR+0.035,0.45,-0.14,0,-0.45)};
function bkKaristir(a,b,t){const s=t*t*(3-2*t),l=(u,v)=>u.map((x,i)=>x+(v[i]-x)*s);return{p:l(a.p,b.p),r:l(a.r,b.r),k:a.k+(b.k-a.k)*s};}
/* anahtar kareler: [zaman(sn), {sol?, sag?}] — verilmeyen el dinlenme pozunda kalır */
function bkAnahtar(keys,t){
  const out={};for(const el of['sol','sag']){
    const K=keys.map(([tt,v])=>[tt,v[el]||BK_DINLEN[el]]);let i=0;while(i<K.length-1&&t>K[i+1][0])i++;
    if(i>=K.length-1){out[el]=K[K.length-1][1];continue;}const [t0,a]=K[i],[t1,b]=K[i+1];out[el]=bkKaristir(a,b,clamp((t-t0)/Math.max(1e-3,t1-t0),0,1));}
  return out;}
const BK_EYLEM={
  alkis:{sure:2.2,keys:[[0,{}],[0.35,{sol:BKP(-0.08,-0.3,-0.78,0,0,-1.2,0.1),sag:BKP(0.08,-0.3,-0.78,0,0,1.2,0.1)}],[1.85,{sol:BKP(-0.08,-0.3,-0.78,0,0,-1.2,0.1),sag:BKP(0.08,-0.3,-0.78,0,0,1.2,0.1)}],[2.2,{}]],alkis:[0.35,1.85]},
  golBiz:{sure:4.2,keys:[[0,{}],[0.3,{sol:BKP(-0.3,0.08,-0.72,1.3,0,0.2,1),sag:BKP(0.3,0.08,-0.72,1.3,0,-0.2,1)}],[3.4,{sol:BKP(-0.3,0.1,-0.72,1.3,0,0.2,1),sag:BKP(0.3,0.1,-0.72,1.3,0,-0.2,1)}],[4.2,{}]],kalk:[0.2,3.6],salla:[0.3,3.4]},
  golYedik:{sure:3.4,keys:[[0,{}],[0.6,{sol:BKP(-0.36,0.3,-0.26,2.3,0.4,0.6,0.3),sag:BKP(0.36,0.3,-0.26,2.3,-0.4,-0.6,0.3)}],[2.6,{sol:BKP(-0.36,0.28,-0.26,2.25,0.4,0.6,0.3),sag:BKP(0.36,0.28,-0.26,2.25,-0.4,-0.6,0.3)}],[3.4,{}]]},
  /* masaya yumruk (K1): yumruk kenarın üstünde kalkar (kol dik, ucu ekranın altında), yukarıdan tablanın yakın kenarına iner; vur anında masa
     sarsılır. Vuruşta bilek dinlenmedeki gibi kenarın hemen önünde (+0,025), el kenarın üstünden tablaya yatar (tablaya değer, boşluk ~0):
     kol ve manşet kenarın önünde kalır, tablaya girmez (eskiden bilek tablanın 6 cm içindeydi, aşağı-geri inen kol ve manşet tablaya 1,7 cm
     giriyordu); kolun ucu hiçbir karede ekrana girmez (rx 0,5'in altına inilmez) */
  yumruk:{sure:1.3,keys:[[0,{}],[0.4,{sag:BKP(0.24,BK_OM.y+0.18,BK_KENAR-0.03,0.95,-0.14,0,1)}],[0.55,{sag:BKP(0.24,BK_OM.y+0.0125,BK_KENAR+0.025,0.5,-0.14,0,1)}],[0.9,{sag:BKP(0.24,BK_OM.y+0.0125,BK_KENAR+0.025,0.5,-0.14,0,1)}],[1.3,{}]],vur:0.55},
  itiraz:{sure:1.8,keys:[[0,{}],[0.45,{sol:BKP(-0.3,-0.33,-0.92,0,0.3,-2.7,0.05),sag:BKP(0.3,-0.33,-0.92,0,-0.3,2.7,0.05)}],[1.3,{sol:BKP(-0.32,-0.3,-0.9,0,0.3,-2.8,0.05),sag:BKP(0.32,-0.3,-0.9,0,-0.3,2.8,0.05)}],[1.8,{}]]},
  /* locaya girişte rakip başkanla tokalaşma (2.8T): sağ el öne uzanır, iki kez sallanır, geri çekilir */
  tokalas:{sure:2.0,keys:[[0,{sag:BKP(0.3,-0.75,-0.6,0.2,-0.2,0,0.3)}],[0.45,{sag:BKP(0.03,-0.24,-0.68,0.3,0.1,-1.45,0.5)}],[1.6,{sag:BKP(0.03,-0.24,-0.68,0.3,0.1,-1.45,0.5)}],[2.0,{sag:BKP(0.3,-0.75,-0.6,0.2,-0.2,0,0.3)}]],salla:[0.55,1.5]},
  /* N12: karar anında uzun tokalaşma: el uzanır, karar anı boyunca tutulur (js/loca-giris.js karar bitince bırakılma anına atlatır: t = 7,4) */
  tokalasAn:{sure:8.0,keys:[[0,{sag:BKP(0.3,-0.75,-0.6,0.2,-0.2,0,0.3)}],[0.45,{sag:BKP(0.03,-0.24,-0.68,0.3,0.1,-1.45,0.5)}],[7.4,{sag:BKP(0.03,-0.24,-0.68,0.3,0.1,-1.45,0.5)}],[8.0,{sag:BKP(0.3,-0.75,-0.6,0.2,-0.2,0,0.3)}]],salla:[0.55,1.5]}
};
/* ---- tepkiler: maç olaylarından gelir (js/mac-sahnesi.js → baskanOlay) ---- */
function baskanEylem(ad,oncelik){
  const e=BASKAN.eylem;if(e&&e.oncelik>=(oncelik||1))return;
  BASKAN.eylem={ad,t:0,oncelik:oncelik||1,...BK_EYLEM[ad]};}
function baskanOlay(ad,v){
  if(ad==='goal')baskanEylem(v.team===0?'golBiz':'golYedik',5);
  else if(ad==='kickoff'&&mac.half===1)baskanEylem('alkis',2);
  else if(ad==='wood'&&v.p&&v.p.team===0)baskanEylem('yumruk',3);
  else if(ad==='save'&&v.p&&v.p.team===1&&rnd()<0.45)baskanEylem('yumruk',3);
  /* aleyhimize karar (faul, kart, ofsayt): başkan itiraz eder */
  else if((ad==='faul'||ad==='kart'||ad==='ofsayt')&&v.aleyhe===0)baskanEylem('itiraz',3);
  else if(ad==='fulltime'){const s=v.score;baskanEylem(s[0]>s[1]?'alkis':s[0]<s[1]?'golYedik':'itiraz',4);}
}
/* ---- her kare ---- */
const BK_V=new THREE.Vector3();
function elYerlestir(el,poz){const E=BK_EL[el];E.g.position.set(...poz.p);E.g.rotation.set(poz.r[0],poz.r[1],poz.r[2]);E.parmak.rotation.x=poz.k*1.4;}
function baskanKare(dt,kamera){
  const B=BASKAN;
  /* eylemi oynat (yalnız maç olaylarından gelen tepkiler ve locaya girişteki tokalaşma; kendiliğinden eylem yok) */
  let poz={sol:BK_DINLEN.sol,sag:BK_DINLEN.sag};const e=B.eylem;
  if(e){e.t+=dt;poz=bkAnahtar(e.keys,Math.min(e.t,e.sure));
    if(e.alkis&&e.t>e.alkis[0]&&e.t<e.alkis[1]){const a=Math.sin(e.t*26)*0.045;poz.sol.p[0]-=a;poz.sag.p[0]+=a;}
    if(e.salla&&e.t>e.salla[0]&&e.t<e.salla[1]){const a=Math.sin(e.t*17)*0.03;poz.sol.p[1]+=a;poz.sag.p[1]-=a;}
    if(e.vur&&!e.vurdu&&e.t>=e.vur){e.vurdu=true;B.sarsinti=1;}
    B.kalkHedef=e.kalk&&e.t>e.kalk[0]&&e.t<e.kalk[1]?1:0;
    if(e.t>=e.sure)B.eylem=null;
  }else B.kalkHedef=0;
  elYerlestir('sol',poz.sol);elYerlestir('sag',poz.sag);
  /* ayağa kalkma (yay) ve masaya yumruk sarsıntısı */
  B.kalk+=(B.kalkHedef-B.kalk)*Math.min(1,dt*(B.kalkHedef>B.kalk?5:2.2));B.sarsinti=Math.max(0,B.sarsinti-dt*4);
  BK_MASA.position.y=Math.sin(zamanB*55)*0.004*B.sarsinti;
  /* gövde hissi: baş dönünce ön plan ters yöne kayar (nefes salınımı yok, 2.8J). Hedef ve hız js/kamera.js kameraGovdeHedefi'nden: bakış
     topu izlerken sık döndüğünden ön plan az ve yavaş (govdeHiz) izler, öndeki telefon ekranda kalır (N4: elle bakış kaldırıldı). Ön plan görüş açısı (aci) maçın yakınlaşmasından bağımsızdır; duraklatmada (dt 0) yerinde kalır */
  kamera.getWorldDirection(BK_V);const yaw=Math.atan2(BK_V.x,BK_V.z),pitch=Math.asin(clamp(BK_V.y,-1,1));
  const G=B.govde,H=kameraGovdeHedefi(yaw,pitch,G),m=H.hiz*dt;
  G.p+=clamp(H.p-G.p,-m,m);G.y+=clamp(H.y-G.y,-m,m);
  const K=B.kamera;K.rotation.set(G.p,G.y,0);
  K.position.set(0,B.kalk*0.34,B.kalk*0.1);
}
let zamanB=0;
function baskanZaman(dt){zamanB+=dt;}
function baskanCiz(){renderer.clearDepth();renderer.render(BASKAN.sahne,BASKAN.kamera);}
