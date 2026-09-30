/* ============ Chairman — başkan odası: aydınlık oda sahnesi (yalnız çizim; yol haritası 2.5, 2.7) ============
   Başkanın masasından görülen oda: gün ışığı alan pencere, ahşap masa, ziyaretçi koltukları, dosya dolabı, kulüp flaması, duvar saati.
   Masada gündeme açılan nesneler vardır: telefon (haberler), ajanda defteri (günün işleri), dosya (açık mesele), gazete (çıkmış haber).
   Kayıtlı olaydan doğan izler: masada gazete ve teşekkür kartı, pencerede tribün çatısında iskele, duvarda pano sözünün notu (js/soz.js odaIzleri).
   Oyun kuralı içermez: neyin gösterileceğini sunum katmanı odaDurum ile bildirir (js/ekran-oda.js). Renkler STIL.oda'dadır.
   Maç sahnesinden ayrı bir sahnedir; aynı çizim hattını kullanır (js/goruntu.js: 640×480, 15 bit renk, titreme).
   Kulübün geçmişine ait kupa ya da fotoğraf yoktur: bağlı olduğu olay yaşanmadan nesne gösterilmez (STIL_REHBERI §6).
     odaDurum({haber, dosya, gun, ay, gunAdi, dakika, gazete, gazeteYeni, kart, iskele, panoNotu})
                                                          telefon ışığı, dosya, defterdeki tarih, saat ve gün ışığı, kayıtlı izler
     odaIsaret(x, y) → nesne adı ya da null              imlecin altındaki nesne (x, y: −1…1 ekran koordinatı); vurguyu da ayarlar
     odaOdak(ad | null)                                   bakışın döneceği nesne
     odaKare(dt) · odaCiz()                               küçük ortam hareketi ve çizim
   Balkon (2.7): uzak duvardaki kapıdan balkona çıkılır. ODA.yer: 'masa' | 'yolda' | 'balkon'. odaYuru(hedef, bitince) masadan balkondaki
   sandalyeye (ya da geri) kısa bir kamera yürüyüşü başlatır; odaYuruAtla() yürüyüşü bitirir. Balkonun ve sahanın kendisi js/balkon.js'te
   ODA.dis grubuna kurulur; grup yalnız yolda ve balkondayken görünür. Balkonda telefon balkon masasındadır. */
const OD=STIL.oda;
const ODA={sahne:new THREE.Scene(),kamera:new THREE.PerspectiveCamera(OD.aci,RW/RH,0.05,400),nesneler:{},odak:null,uzerinde:null,zaman:0,
  yer:'masa',yol:null,dis:new THREE.Group(),kapi:null,balkonTelefon:null,
  bakis:new THREE.Vector3(...OD.bakis),iskele:false,durum:{haber:0,dosya:false,gun:'',ay:'',gunAdi:'',dakika:540}};
{
  const S=ODA.sahne,oLAM=o=>LAM(Object.assign({fog:false},o));
  const ortam=new THREE.AmbientLight(OD.ortam.renk,OD.ortam.guc);S.add(ortam);
  const gunes=new THREE.DirectionalLight(OD.gunes.renk,0.7);gunes.position.set(...OD.gunes.konum);S.add(gunes);
  const dolgu=new THREE.DirectionalLight(OD.dolgu.renk,OD.dolgu.guc);dolgu.position.set(...OD.dolgu.konum);S.add(dolgu);
  ODA.isik={ortam,gunes};

  /* ---- zemin (tahta), halı, duvarlar, tavan ---- */
  {const cv=mk(64,32),g=cv.getContext('2d');g.fillStyle=OD.zemin;g.fillRect(0,0,64,32);
   for(let y=0;y<32;y+=8){g.fillStyle=OD.zeminKoyu;g.fillRect(0,y,64,1);const k=(h2(y,3)*40)|0;g.fillRect(k,y,1,8);g.fillRect((k+31)%64,y,1,8);
     for(let i=0;i<5;i++){g.fillStyle=h2(y,i+11)>0.5?OD.zeminAcik:OD.zeminKoyu;g.fillRect((h2(y+i,5)*60)|0,y+2+((h2(i,y)*5)|0),6+((h2(i,9)*10)|0),1);}}
   box(7,0.1,7,oLAM({map:tx(cv,'n',[5,8])}),0,-0.05,-1.2,S);}
  box(3.4,0.02,2.6,oLAM({color:OD.haliKenar}),0,0.01,-1.35,S);box(3.1,0.024,2.3,oLAM({color:OD.hali}),0,0.012,-1.35,S);
  const duvar=oLAM({color:OD.duvar}),lambri=oLAM({color:OD.lambri}),sup=oLAM({color:OD.supurgelik});
  /* uzak duvar: balkon kapısının boşluğu açık bırakılır (x0–x1, yerden h yüksekliğe) */
  {const K=OD.kapi,parca=(x0,x1)=>{const w=x1-x0,x=(x0+x1)/2;box(w,3,0.1,duvar,x,1.5,-3.5,S);box(w,0.95,0.04,lambri,x,0.475,-3.43,S);box(w,0.05,0.05,sup,x,0.96,-3.42,S);};
   parca(-3.5,K.x0);parca(K.x1,3.5);box(K.x1-K.x0,3-K.h,0.1,duvar,(K.x0+K.x1)/2,(3+K.h)/2,-3.5,S);
   const c=oLAM({color:K.renk}),w=K.x1-K.x0;
   for(const x of[K.x0-0.03,K.x1+0.03])box(0.07,K.h+0.06,0.14,c,x,K.h/2,-3.5,S);box(w+0.13,0.07,0.14,c,(K.x0+K.x1)/2,K.h+0.03,-3.5,S);
   /* kanat: menteşe x0'da; camlı üst yarı, dolu alt yarı, pirinç kol */
   const kanat=new THREE.Group();kanat.position.set(K.x0,0,-3.5);S.add(kanat);ODA.kapi=kanat;
   box(w,0.9,0.05,c,w/2,0.45,0,kanat);box(w,0.1,0.05,c,w/2,K.h-0.05,0,kanat);for(const x of[0.04,w-0.04])box(0.08,K.h-1,0.05,c,x,0.9+(K.h-1)/2,0,kanat);box(0.05,K.h-1,0.04,c,w/2,0.9+(K.h-1)/2,0,kanat);
   const camM=new THREE.MeshBasicMaterial({color:K.cam,fog:false});box(w-0.16,K.h-1,0.02,camM,w/2,0.9+(K.h-1)/2,0,kanat);ODA.kapiCam=camM;
   box(0.03,0.03,0.1,oLAM({color:K.kol}),w-0.1,1.02,0.04,kanat);}
  S.add(ODA.dis);ODA.dis.visible=false;
  for(const sx of[-1,1]){box(0.1,3,7,duvar,sx*3.2,1.5,-1.2,S);box(0.04,0.95,7,lambri,sx*3.13,0.475,-1.2,S);box(0.05,0.05,7,sup,sx*3.12,0.96,-1.2,S);}
  box(7,0.1,7,oLAM({color:OD.tavan}),0,3.05,-1.2,S);

  /* ---- pencere: gökyüzü, uzakta kulübün tribünü ve projektör direği; pervaz ve kayıtlar ---- */
  {const cv=mk(64,48);
   /* iskele: tribün çatısındaki onarım başladıysa (bakım taksiti ödendiyse) görünür; yaşanmamış iş gösterilmez */
   ODA.pencereCiz=iskele=>{const g=cv.getContext('2d'),gr=g.createLinearGradient(0,0,0,34);gr.addColorStop(0,OD.gokUst);gr.addColorStop(1,OD.gokAlt);g.fillStyle=gr;g.fillRect(0,0,64,48);
     g.fillStyle=OD.tribun;g.fillRect(6,27,40,8);g.fillStyle='#6d6e72';for(let x=6;x<46;x+=4)g.fillRect(x,27,1,8);g.fillStyle='#c8281e';g.fillRect(6,26,40,1);
     if(iskele){g.fillStyle=OD.iskele;for(let x=8;x<30;x+=5)g.fillRect(x,19,1,8);g.fillRect(8,19,21,1);g.fillRect(8,23,21,1);g.fillStyle=OD.iskeleBranda;g.fillRect(9,20,9,3);}
     g.fillStyle=OD.direk;g.fillRect(52,8,1,27);g.fillRect(49,6,7,3);g.fillStyle=OD.cim;g.fillRect(0,35,64,13);g.fillStyle='#2f7a2a';for(let x=0;x<64;x+=8)g.fillRect(x,35,4,13);
     if(ODA.cam)ODA.cam.material.map.needsUpdate=true;};
   ODA.pencereCiz(false);
   const cam=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.25),BAS({map:tx(cv,'n'),fog:false}));cam.position.set(-1.25,1.62,-3.44);S.add(cam);ODA.cam=cam;
   const c=oLAM({color:OD.cerceve});
   box(2.06,0.08,0.12,c,-1.25,2.28,-3.42,S);box(2.14,0.07,0.2,c,-1.25,0.97,-3.38,S);
   for(const x of[-2.24,-1.25,-0.26])box(x===-1.25?0.05:0.08,1.3,0.1,c,x,1.62,-3.42,S);box(1.9,0.04,0.08,c,-1.25,1.72,-3.42,S);}
  /* güneşin halıya düşen lekesi */
  {const m=new THREE.MeshBasicMaterial({color:OD.gunesLekesi,transparent:true,opacity:0.2,depthWrite:false,fog:false});
   const p=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.1),m);p.rotation.x=-Math.PI/2;p.rotation.z=-0.35;p.position.set(-0.75,0.03,-2.25);S.add(p);ODA.leke=m;}

  /* ---- duvar: kulüp flaması ve saat ---- */
  {const cv=mk(24,32),g=cv.getContext('2d');g.clearRect(0,0,24,32);
   for(let y=0;y<32;y++){const w=Math.max(0,Math.round(24*(1-y/32)));g.fillStyle=(y>9&&y<14)?OD.flamaSerit:OD.flama;g.fillRect((24-w)>>1,y,w,1);}
   ctxText(g,'D',10,2,OD.flamaSerit,1);
   const f=new THREE.Mesh(new THREE.PlaneGeometry(0.34,0.46),BAS({map:tx(cv,'n'),transparent:true,alphaTest:0.5,fog:false,color:0xdddddd}));f.position.set(0.02,1.72,-3.44);S.add(f);
   box(0.4,0.025,0.025,oLAM({color:OD.saatKasa}),0.02,1.96,-3.43,S);}
  /* pano sözünün notu: yalnız açık bir pano sözü varken duvarda durur */
  {const cv=mk(16,16),g=cv.getContext('2d');g.fillStyle=OD.notKagidi;g.fillRect(0,0,16,16);g.fillStyle=OD.defterYazi;g.fillRect(3,4,10,5);g.fillStyle=OD.notKagidi;g.fillRect(4,5,8,3);g.fillStyle=OD.defterYazi;g.fillRect(3,11,10,1);g.fillRect(3,13,6,1);
   const n=new THREE.Mesh(new THREE.PlaneGeometry(0.2,0.2),BAS({map:tx(cv,'n'),fog:false,color:0xe6e6e6}));n.position.set(0.02,1.22,-3.44);n.rotation.z=-0.06;n.visible=false;S.add(n);ODA.panoNotu=n;}
  const SAAT=new THREE.Group();SAAT.position.set(0.52,1.9,-3.44);S.add(SAAT);
  {const kasa=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.04,16),oLAM({color:OD.saatKasa}));kasa.rotation.x=Math.PI/2;SAAT.add(kasa);
   const yuz=new THREE.Mesh(new THREE.CircleGeometry(0.17,16),BAS({color:OD.saatYuz,fog:false}));yuz.position.z=0.022;SAAT.add(yuz);
   const ibre=(w,h)=>{const g=new THREE.Group(),m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),BAS({color:OD.saatIbre,fog:false}));m.position.y=h/2-0.01;g.add(m);g.position.z=0.026;SAAT.add(g);return g;};
   for(let i=0;i<12;i++){const c=new THREE.Mesh(new THREE.PlaneGeometry(0.012,i%3?0.018:0.034),BAS({color:OD.saatIbre,fog:false})),a=i*Math.PI/6;c.position.set(Math.sin(a)*0.145,Math.cos(a)*0.145,0.024);c.rotation.z=-a;SAAT.add(c);}
   ODA.akrep=ibre(0.022,0.095);ODA.yelkovan=ibre(0.014,0.14);}

  /* ---- dosya dolabı ve ziyaretçi koltukları ---- */
  {const d=oLAM({color:OD.dolap}),k=oLAM({color:OD.dolapKoyu}),p=oLAM({color:STIL.baskan.pirinc});
   box(1.05,1.35,0.5,d,2.35,0.675,-3.15,S);
   for(let i=0;i<3;i++){box(0.95,0.02,0.02,k,2.35,0.3+i*0.42,-2.89,S);box(0.16,0.03,0.03,p,2.35,0.5+i*0.42,-2.88,S);}
   box(0.3,0.22,0.22,oLAM({color:OD.kagit}),2.2,1.46,-3.15,S);box(0.24,0.3,0.2,oLAM({color:OD.dosya}),2.58,1.5,-3.15,S);}
  for(const sx of[-1,1]){const g=new THREE.Group(),m=oLAM({color:OD.koltuk}),a=oLAM({color:OD.koltukAyak});
    box(0.56,0.1,0.52,m,0,0.45,0,g);box(0.56,0.55,0.1,m,0,0.78,-0.24,g);for(const x of[-0.24,0.24])for(const z of[-0.22,0.22])box(0.05,0.42,0.05,a,x,0.21,z,g);
    for(const x of[-0.3,0.3])box(0.05,0.05,0.5,a,x,0.66,0,g);
    g.position.set(sx*0.72,0,-2.15);g.rotation.y=sx*-0.25;S.add(g);}

  /* ---- masa: ceviz tabla (maç günündeki masayla aynı doku), ön pano, sümen ---- */
  const MASA=new THREE.Group();S.add(MASA);const UST=0.78;
  {const B=STIL.baskan,cv=mk(32,16),g=cv.getContext('2d');g.fillStyle=B.masa;g.fillRect(0,0,32,16);
   for(let y=0;y<16;y++){g.fillStyle=h2(y,3)>0.5?B.masaKoyu:B.masaAcik;g.fillRect(((h2(y,9)*32)|0),y,8+((h2(y,5)*14)|0),1);}
   const ah=oLAM({map:tx(cv,'n',[4,2])}),koyu=oLAM({color:B.masaKoyu});
   box(2.2,0.06,1.0,ah,0,UST-0.03,-0.72,MASA);box(2.1,0.7,0.04,koyu,0,0.38,-1.18,MASA);
   for(const sx of[-1,1])box(0.05,0.72,0.9,koyu,sx*1.04,0.36,-0.72,MASA);
   box(2.2,0.02,0.03,oLAM({color:B.pirinc}),0,UST-0.005,-1.215,MASA);
   box(0.7,0.008,0.46,oLAM({color:B.sumen}),0,UST+0.004,-0.68,MASA);}

  /* gündeme açılan nesne: grup + görünmez dokunma kutusu + amber çerçeve (üzerine gelince ya da seçiliyken) */
  const gorunmez=new THREE.MeshBasicMaterial({visible:false});
  function nesne(ad,x,z,donus,w,h,d){
    const g=new THREE.Group();g.position.set(x,UST,z);g.rotation.y=donus;MASA.add(g);
    const geo=new THREE.BoxGeometry(w,h,d),kutu=new THREE.Mesh(geo,gorunmez);kutu.position.y=h/2;kutu.userData.nesne=ad;g.add(kutu);
    const cerceve=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:OD.vurgu,fog:false}));cerceve.position.y=h/2;cerceve.visible=false;g.add(cerceve);
    return ODA.nesneler[ad]={g,kutu,cerceve,merkez:new THREE.Vector3(x,UST+h/2,z)};
  }
  ODA.masa=MASA;ODA.masaUstu=UST;
  /* telefon: haber varken ekranı amber yanar ve sayı yazar */
  {const N=nesne('telefon',-0.56,-0.7,0.32,0.16,0.06,0.28),cv=mk(16,32);
   N.g.add(new THREE.Mesh(new THREE.BoxGeometry(0.11,0.016,0.22),oLAM({color:OD.telefon})));N.g.children[2].position.y=0.008;
   const e=new THREE.Mesh(new THREE.PlaneGeometry(0.094,0.196),BAS({map:tx(cv,'n'),fog:false}));e.rotation.x=-Math.PI/2;e.position.y=0.0165;N.g.add(e);
   N.cv=cv;N.ekran=e.material;N.isik=glow(OD.vurgu,0.34,0);N.isik.position.y=0.05;N.g.add(N.isik);}
  /* ajanda defteri: açık iki sayfa, sol sayfada günün tarihi */
  {const N=nesne('ajanda',0,-0.68,0,0.5,0.06,0.36),cv=mk(96,64);
   const sayfa=new THREE.Mesh(new THREE.PlaneGeometry(0.46,0.31),oLAM({map:tx(cv,'n')}));sayfa.rotation.x=-Math.PI/2;sayfa.position.y=0.021;N.g.add(sayfa);
   const kapak=new THREE.Mesh(new THREE.BoxGeometry(0.49,0.018,0.34),oLAM({color:0x3a2a1c}));kapak.position.y=0.009;N.g.add(kapak);
   N.cv=cv;N.doku=sayfa.material.map;}
  /* dosya: yalnız açık mesele varken masadadır */
  {const N=nesne('dosya',0.6,-0.72,-0.22,0.34,0.06,0.42);
   const kapak=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.022,0.38),oLAM({color:OD.dosya}));kapak.position.y=0.011;N.g.add(kapak);
   const kagit=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.008,0.36),oLAM({color:OD.kagit}));kagit.position.set(0.012,0.006,0.006);N.g.add(kagit);
   const etiket=new THREE.Mesh(new THREE.PlaneGeometry(0.17,0.07),oLAM({color:OD.dosyaEtiket}));etiket.rotation.x=-Math.PI/2;etiket.position.set(0,0.0225,-0.08);N.g.add(etiket);}
  /* gazete: yalnız çıkmış bir haber ya da gelen bir teşekkür varken masadadır; yeni haberde amber ışık */
  {const N=nesne('gazete',-0.6,-1.0,0.18,0.36,0.06,0.28),cv=mk(32,24),g=cv.getContext('2d');
   g.fillStyle=OD.gazete;g.fillRect(0,0,32,24);g.fillStyle=OD.defterYazi;g.fillRect(2,2,28,3);g.fillRect(2,7,18,2);for(let y=11;y<22;y+=2){g.fillRect(2,y,13,1);g.fillRect(17,y,13,1);}g.fillStyle=OD.defterSerit;g.fillRect(22,7,8,2);
   const govde=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.014,0.24),oLAM({color:OD.gazete}));govde.position.y=0.007;N.g.add(govde);
   const yuz=new THREE.Mesh(new THREE.PlaneGeometry(0.32,0.24),oLAM({map:tx(cv,'n')}));yuz.rotation.x=-Math.PI/2;yuz.position.y=0.0145;N.g.add(yuz);
   N.isik=glow(OD.vurgu,0.3,0);N.isik.position.y=0.05;N.g.add(N.isik);N.g.visible=false;}
  /* teşekkür kartı: ayakta duran küçük kart; yalnız gelen teşekkürden sonra */
  {const kart=new THREE.Group();kart.position.set(0.16,UST,-1.04);kart.rotation.y=-0.2;
   const a=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.09,0.004),oLAM({color:OD.kagit}));a.position.set(0,0.045,0);a.rotation.x=-0.3;kart.add(a);
   const s=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.014,0.005),oLAM({color:OD.defterSerit}));s.position.set(0,0.07,0.009);s.rotation.x=-0.3;kart.add(s);
   kart.visible=false;MASA.add(kart);ODA.kart=kart;}
  /* masa lambası, kalemlik, çay */
  {const l=oLAM({color:OD.lamba});box(0.16,0.02,0.12,l,0.92,UST+0.01,-1.02,MASA);box(0.02,0.3,0.02,l,0.92,UST+0.17,-1.02,MASA);
   const s=box(0.26,0.08,0.13,l,0.86,UST+0.34,-0.98,MASA);s.rotation.z=0.12;box(0.2,0.01,0.09,BAS({color:OD.lambaIc,fog:false}),0.855,UST+0.297,-0.98,MASA).rotation.z=0.12;
   box(0.07,0.1,0.07,oLAM({color:OD.kalemlik}),-0.9,UST+0.05,-1.0,MASA);
   for(const [x,r] of[[-0.915,0xc8281e],[-0.89,0x22347a],[-0.9,0xd8b030]])box(0.012,0.09,0.012,oLAM({color:r}),x,UST+0.13,-1.0+(x+0.9)*0.8,MASA);
   const tabak=new THREE.Mesh(new THREE.CylinderGeometry(0.062,0.05,0.01,12),oLAM({color:0xefece4}));tabak.position.set(0.36,UST+0.005,-0.98);MASA.add(tabak);
   const cay=new THREE.Mesh(new THREE.CylinderGeometry(0.026,0.02,0.085,10),oLAM({color:0x9a2a0c}));cay.position.set(0.36,UST+0.052,-0.98);MASA.add(cay);}
  ODA.kamera.position.set(...OD.goz);
}

/* saat → gün ışığının gücü ve rengi (STIL.oda.gunIsigi arasında doğrusal) */
function odaGunIsigi(dakika){
  const s=dakika/60,L=OD.gunIsigi;
  let a=L[0],b=L[L.length-1];
  if(s<=a[0])b=a;else if(s>=b[0])a=b;else for(let i=1;i<L.length;i++)if(s<=L[i][0]){a=L[i-1];b=L[i];break;}
  const t=a===b?0:(s-a[0])/(b[0]-a[0]),r=new THREE.Color(a[2]).lerp(new THREE.Color(b[2]),t);
  return{guc:a[1]+(b[1]-a[1])*t,renk:r};
}
function odaDurum(d){
  const D=Object.assign(ODA.durum,d),N=ODA.nesneler;
  N.dosya.g.visible=!!D.dosya;N.gazete.g.visible=!!D.gazete;ODA.kart.visible=!!D.kart;ODA.panoNotu.visible=!!D.panoNotu;
  if(ODA.iskele!==!!D.iskele){ODA.iskele=!!D.iskele;ODA.pencereCiz(ODA.iskele);}
  {const g=N.telefon.cv.getContext('2d');g.fillStyle=D.haber?OD.telefonHaber:OD.telefonEkran;g.fillRect(0,0,16,32);
   if(D.haber){const s=String(Math.min(9,D.haber));ctxText(g,s,5,9,'#1a1203',2);}else{g.fillStyle='#1c3a52';g.fillRect(0,0,16,5);}
   N.telefon.ekran.map.needsUpdate=true;}
  {const g=N.ajanda.cv.getContext('2d');g.fillStyle=OD.defter;g.fillRect(0,0,96,64);g.fillStyle=OD.defterCizgi;g.fillRect(47,0,2,64);
   for(let y=14;y<60;y+=8){g.fillRect(54,y,36,1);}g.fillStyle=OD.defterSerit;g.fillRect(4,4,39,15);
   ctxText(g,D.ay||'',(47-textW(D.ay||'',2))>>1,5,'#f2ede2',2);ctxText(g,D.gun||'',(47-textW(D.gun||'',4))>>1,22,OD.defterYazi,4);
   ctxText(g,D.gunAdi||'',(47-textW(D.gunAdi||'',2))>>1,49,OD.defterYazi,2);N.ajanda.doku.needsUpdate=true;}
  const dk=D.dakika||0,I=odaGunIsigi(dk);
  ODA.akrep.rotation.z=-((dk/60)%12)/12*Math.PI*2;ODA.yelkovan.rotation.z=-(dk%60)/60*Math.PI*2;
  ODA.isik.gunes.intensity=I.guc;ODA.isik.gunes.color.copy(I.renk);ODA.isik.ortam.intensity=OD.ortam.guc*(0.55+0.6*I.guc);
  ODA.cam.material.color.copy(I.renk).lerp(new THREE.Color(0xffffff),0.35).multiplyScalar(0.35+0.85*I.guc);ODA.leke.opacity=0.32*I.guc;
  ODA.kapiCam.color.set(OD.kapi.cam).multiply(ODA.cam.material.color);
}

/* ---- balkona yürüyüş ---- */
const ODA_YOL=OD.yol.map(d=>({p:new THREE.Vector3(...d[0]),b:new THREE.Vector3(...d[1])}));
/* yolun u (0 = masa, 1 = balkon) noktasındaki konum ve bakış: duraklar arasında yumuşak geçiş */
function odaYolNoktasi(u,konum,bakis){
  const n=ODA_YOL.length-1,s=Math.min(n-1e-6,Math.max(0,u)*n),i=Math.floor(s),t=s-i,y=t*t*(3-2*t);
  konum.lerpVectors(ODA_YOL[i].p,ODA_YOL[i+1].p,y);bakis.lerpVectors(ODA_YOL[i].b,ODA_YOL[i+1].b,y);
}
/* telefon bulunulan yerdedir: masada ya da balkon masasında (js/balkon.js ODA.balkonTelefon'u bildirir) */
function odaYerAyarla(yer){
  ODA.yer=yer;ODA.yol=null;
  const N=ODA.nesneler.telefon,B=ODA.balkonTelefon;
  if(yer==='balkon'&&B){ODA.sahne.add(N.g);N.g.position.set(B.x,B.y,B.z);N.g.rotation.y=B.donus;N.merkez.set(B.x,B.y+0.03,B.z);}
  else{ODA.masa.add(N.g);N.g.position.set(-0.56,ODA.masaUstu,-0.7);N.g.rotation.y=0.32;N.merkez.set(-0.56,ODA.masaUstu+0.03,-0.7);}
  ODA.dis.visible=yer!=='masa';ODA.kapi.rotation.y=yer==='masa'?0:1.75;
  ODA.kamera.fov=yer==='balkon'?STIL.balkon.aci:OD.aci;ODA.kamera.updateProjectionMatrix();
  ODA.bakis.set(...(yer==='balkon'?STIL.balkon.bakis:OD.bakis));
}
/* hedef: 'balkon' | 'masa'. Hareket azaltma ayarında yürüyüş gösterilmez */
function odaYuru(hedef,bitince){
  if(ODA.yer==='yolda'||ODA.yer===hedef){if(bitince)bitince();return;}
  ODA.odak=null;ODA.uzerinde=null;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){odaYerAyarla(hedef);if(bitince)bitince();return;}
  if(hedef==='masa'){ODA.masa.add(ODA.nesneler.telefon.g);ODA.nesneler.telefon.g.position.set(-0.56,ODA.masaUstu,-0.7);ODA.nesneler.telefon.g.rotation.y=0.32;}
  ODA.yer='yolda';ODA.dis.visible=true;ODA.yol={t:0,hedef,bitince:bitince||null};
}
function odaYuruAtla(){
  if(!ODA.yol)return;
  const y=ODA.yol;odaYerAyarla(y.hedef);if(y.bitince)y.bitince();
}
const ODA_ISIN=new THREE.Raycaster();
function odaIsaret(x,y){
  let ad=null;
  if(x!==null){ODA_ISIN.setFromCamera({x,y},ODA.kamera);
    /* masada bütün nesneler, balkonda yalnız yanındaki telefon seçilebilir; yolda hiçbiri */
    const L=ODA.yer==='masa'?Object.values(ODA.nesneler):ODA.yer==='balkon'?[ODA.nesneler.telefon]:[];
    const v=ODA_ISIN.intersectObjects(L.filter(n=>n.g.visible).map(n=>n.kutu));ad=v.length?v[0].object.userData.nesne:null;}
  ODA.uzerinde=ad;return ad;
}
function odaOdak(ad){ODA.odak=ad&&ODA.nesneler[ad]&&(ODA.yer==='masa'||(ODA.yer==='balkon'&&ad==='telefon'))?ad:null;}
function odaKare(dt){
  ODA.zaman+=dt;
  const t=ODA.zaman,N=ODA.nesneler,az=matchMedia('(prefers-reduced-motion: reduce)').matches?0:1;
  if(ODA.dis.visible&&typeof balkonKare==='function')balkonKare(dt);
  if(ODA.yol){
    /* yürüyüş: kamera yol boyunca ilerler, adım sallantısı; kapı yolun ortasında açılır */
    const Y=ODA.yol;Y.t=Math.min(1,Y.t+dt/OD.yuruyus);
    const u=Y.hedef==='balkon'?Y.t:1-Y.t,P=new THREE.Vector3();
    odaYolNoktasi(u,P,ODA.bakis);
    ODA.kamera.position.set(P.x,P.y+Math.abs(Math.sin(Y.t*Math.PI*5))*0.03*Math.sin(Y.t*Math.PI),P.z);ODA.kamera.lookAt(ODA.bakis);
    ODA.kapi.rotation.y=1.75*Math.min(1,Math.max(0,(u-0.18)/0.3));
    const aciY=OD.aci+(STIL.balkon.aci-OD.aci)*u;
    if(ODA.kamera.fov!==aciY){ODA.kamera.fov=aciY;ODA.kamera.updateProjectionMatrix();}
    for(const ad in N)N[ad].cerceve.visible=false;
    if(Y.t>=1)odaYuruAtla();
    return;
  }
  /* odakta bakış nesneye doğru eğilir ve nesnenin sağına kayar: sağda açılan panelin yanında nesne görünür kalır */
  const balkonda=ODA.yer==='balkon',G=balkonda?STIL.balkon.goz:OD.goz,k=Math.min(1,dt*4);
  const dinlenme=new THREE.Vector3(...(balkonda?STIL.balkon.bakis:OD.bakis));
  const hedef=ODA.odak?(balkonda?N[ODA.odak].merkez.clone().setX(N[ODA.odak].merkez.x+OD.odakKayma*0.6):dinlenme.clone().lerp(N[ODA.odak].merkez,0.6).setX(N[ODA.odak].merkez.x+OD.odakKayma)):dinlenme;
  ODA.bakis.lerp(hedef,k);
  ODA.kamera.position.set(G[0]+Math.sin(t*0.5)*0.006*az,G[1]+Math.sin(t*0.8)*0.004*az,G[2]);
  ODA.kamera.lookAt(ODA.bakis);
  const aci=balkonda?(ODA.odak?STIL.balkon.odakAci:STIL.balkon.aci):ODA.odak?OD.odakAci:OD.aci;
  if(Math.abs(ODA.kamera.fov-aci)>0.05){ODA.kamera.fov+=(aci-ODA.kamera.fov)*k;ODA.kamera.updateProjectionMatrix();}
  for(const ad in N)N[ad].cerceve.visible=N[ad].g.visible&&(ad===ODA.uzerinde||ad===ODA.odak);
  N.telefon.isik.material.opacity=ODA.durum.haber?0.3+0.22*Math.sin(t*4)*az:0;
  N.gazete.isik.material.opacity=ODA.durum.gazete&&ODA.durum.gazeteYeni?0.26+0.18*Math.sin(t*3)*az:0;
}
function odaCiz(){
  renderer.setRenderTarget(rt);renderer.setClearColor(OD.arkaPlan,1);renderer.clear();renderer.render(ODA.sahne,ODA.kamera);
  renderer.setRenderTarget(null);renderer.clear();renderer.render(post,postCam);
}
