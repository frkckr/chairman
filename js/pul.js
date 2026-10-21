/* ============ Chairman — 2D maç görünümü: pullar (P1, 2026-10-21; DENEME, kullanıcının kararı bekliyor) ============
   Kullanıcı kararı (2026-10-21 akşam): maç FM 2D gibi tepeden izlenir — başkanın loca bakışı ve ön planı (masa, eller) maçta kalkar, kamera tepeden
   bakar (js/kamera.js tepeKamera), stat, tribünler, reklamlar ve dumanlar 3B olarak çevrede kalır. Sahadaki her insan (oyuncu, kaleci, hakemler,
   kulübedeki yedekler, kenar personeli, top toplayıcılar) aynı numaralı pul olarak çizilir: üst yüzde forma rengi, forma süsünün renginde kenar
   halkası ve numara, önde gövde yönünü gösteren iki ayak çizgisi. Boy, saç, yapı ayrımı yoktur; ayrım yalnız renk ve numaradır.
   İskelet ve animasyon (js/animasyon.js) çalışmaya devam eder: pul açıkken insan modelinin yalnız malzemesi çizilmez (kök görünür kalır; kemiklere
   bağlı kart, bayrak, defter ve sprey görünsün diye — r128'de görünmez kök çocuklarını da gizler) ve insan gölgeleri kapanır (js/golgeler.js
   GOLGE.insanGizli). Her pul kendi modelinin kökünü izler: tünel, kulübe, sağlıkçı gizleme ve yedeğin eşofman/forma geçişi aynen.
   Çizim motoru yalnız okur (TEKNIK_PLAN §8); bu dosya rastlantı çağırmaz. Ayarlar STIL.pul (js/stil-99.js).
   Açma: Ayarlar > Maç > 2D maç görünümü (OYUN.ayarlar.pul), maçta G tuşu, adres ?pul=1 (?pul=0 ayarı ezer). Maçta Z tuşu yakınlığı değiştirir
   (?tepeSeviye=0|1|2). Karşılaştırma için ?tepe=0 pulları loca bakışında gösterir (?pulEgim=0..1, ?pulEnAz=2..20); arayüzde yoktur. */
const PUL_PARAM=(()=>{try{const v=new URLSearchParams(location.search).get('pul');return v==='1'?true:v==='0'?false:null;}catch(e){return null;}})();
const PUL_EGIM_PARAM=(()=>{try{const v=parseFloat(new URLSearchParams(location.search).get('pulEgim'));return isFinite(v)?clamp(v,0,1):null;}catch(e){return null;}})();
const PUL_ENAZ_PARAM=(()=>{try{const v=parseFloat(new URLSearchParams(location.search).get('pulEnAz'));return isFinite(v)?clamp(v,2,20):null;}catch(e){return null;}})();
const PUL_TEPE_PARAM=(()=>{try{return new URLSearchParams(location.search).get('tepe')!=='0';}catch(e){return true;}})();
const PUL_SEVIYE_PARAM=(()=>{try{const v=parseInt(new URLSearchParams(location.search).get('tepeSeviye'),10);return v>=0&&v<=2?v:null;}catch(e){return null;}})();
const PUL={acik:false,tepe:true,seviye:1,liste:[],geo:null,ayakGeo:null,golgeGeo:null,golgeMat:null,parlak:null,egim:0.5,enAz:6,
  UP:new THREE.Vector3(0,1,0),V:new THREE.Vector3(),N:new THREE.Vector3()};
/* modelin doku atlasındaki düz renk karesinden renk (js/oyuncular.js atlasCiz: forma 0. kare (4,36), süs 7. kare (60,36)); kaleci, hakem, eşofman,
   kenar personeli ve top toplayıcı renkleri böylece kendiliğinden doğru gelir */
function pulAtlasRenk(m,x,y){try{const d=m.mesh.material.map.image.getContext('2d').getImageData(x,y,1,1).data;
  return '#'+((1<<24)|(d[0]<<16)|(d[1]<<8)|d[2]).toString(16).slice(1);}catch(e){return null;}}
/* üst yüzün dokusu: forma zemini, kenar halkası ve ortada numara (3×5 piksel yazı). Silindirin üst kapağında doku satırı 0 yerel +x'e, sütunlar
   yerel +z'ye düşer (r128 CylinderGeometry kapak uv'si); pulKare numarayı kameraya göre döndürür */
function pulDoku(forma,trim,no){const S=STIL.pul,n=S.doku,cv=mk(n,n),g=cv.getContext('2d'),c=(n-1)/2,ic=n/2-S.halka-0.3;
  g.fillStyle=forma;g.fillRect(0,0,n,n);g.fillStyle=trim;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(Math.hypot(x-c,y-c)>=ic)g.fillRect(x,y,1,1);
  if(no){const s=String(no),k=S.sayiOlcek;ctxText(g,s,(n-textW(s,k))>>1,((n-5*k)>>1)-k,trim,k);}
  return tx(cv,'m');}   /* yakında piksel piksel (Nearest), uzakta mipmap: küçülen numara titreşmez */
/* bir modelin pulu: kök (konum, eğim, ölçek) → disk (numara kameraya dönük) ve ayak grubu (gövde yönü); altında yerde koyu leke */
function pulEkle(a,m){const S=STIL.pul,A=S.ayak,p=a.kaynak,forma=pulAtlasRenk(m,4,36)||'#888888',trim=pulAtlasRenk(m,60,36)||'#f2f2f2';
  const no=(p.tur==='oyuncu'||p.tur==='yedek')&&p.no?p.no:'',r=S.yaricap*(p.tur==='topcu'?S.topcuOran:1),h=S.yukseklik;
  const yanMat=LAM({color:dk(forma,S.yanKoyu)}),ustMat=BAS({map:pulDoku(forma,trim,no)}),ayakMat=LAM({color:trim});
  const root=new THREE.Group(),disk=new THREE.Mesh(PUL.geo,[yanMat,ustMat,yanMat]);disk.scale.set(r,h,r);disk.position.y=h/2;
  const ayak=new THREE.Group(),aL=new THREE.Mesh(PUL.ayakGeo,ayakMat),aR=new THREE.Mesh(PUL.ayakGeo,ayakMat);
  aL.position.set(A.yan,h+0.015,r+A.on);aR.position.set(-A.yan,h+0.015,r+A.on);ayak.add(aL,aR);
  root.add(disk,ayak);root.visible=false;scene.add(root);
  const golge=new THREE.Mesh(PUL.golgeGeo,PUL.golgeMat);golge.rotation.x=-Math.PI/2;golge.renderOrder=1;golge.visible=false;scene.add(golge);
  const E={a,m,root,disk,ayak,aL,aR,golge,ustMat,yanMat,ayakMat,yan0:new THREE.Color(dk(forma,S.yanKoyu)),r,amp:0};
  PUL.liste.push(E);return E;}
function pulKur(){const S=STIL.pul;
  PUL.geo=new THREE.CylinderGeometry(1,1,1,16,1);PUL.ayakGeo=new THREE.BoxGeometry(1,1,1);PUL.golgeGeo=new THREE.CircleGeometry(1,16);
  PUL.golgeMat=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:S.golge,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  PUL.parlak=BAS({color:S.ayak.parlak});
  PUL.egim=PUL_EGIM_PARAM!=null?PUL_EGIM_PARAM:S.egim;PUL.enAz=PUL_ENAZ_PARAM!=null?PUL_ENAZ_PARAM:S.enAzPx;
  PUL.tepe=PUL_TEPE_PARAM;PUL.seviye=PUL_SEVIYE_PARAM!=null?PUL_SEVIYE_PARAM:S.tepe.seviye;
  for(const a of AKTORLER){pulEkle(a,a.m);if(a.esofman)pulEkle(a,a.esofman);}}
/* 2D görünüm açık mı (tepeden kamera; js/kamera.js ve js/arayuz.js okur) */
function pulTepe(){return PUL.acik&&PUL.tepe;}
/* aç / kapa (canlı): insan malzemeleri, insan gölgeleri ve pullar */
function pulUygula(acik){PUL.acik=!!acik;GOLGE.insanGizli=PUL.acik;
  for(const a of AKTORLER)for(const m of[a.m,a.esofman])if(m&&m.mesh&&m.mesh.material)m.mesh.material.visible=!PUL.acik;
  if(!PUL.acik)for(const E of PUL.liste){E.root.visible=false;E.golge.visible=false;}
  if(STIL.pul.topUstte&&typeof topMesh!=='undefined'){topMesh.material.depthTest=!PUL.acik;topMesh.renderOrder=PUL.acik?3:0;}}
/* her kare (js/mac-sahnesi.js macKare; aktörlerin kökleri kesinleştikten sonra) */
function pulKare(dts){if(!PUL.acik)return;
  const S=STIL.pul,A=S.ayak,T=S.tepe,tepe=PUL.tepe,cp=camera.position,tf=Math.tan(camera.fov*Math.PI/360),t=mac.t,D=STIL.animasyon.dusus.aci,V=PUL.V,N=PUL.N;
  for(const E of PUL.liste){const a=E.a,m=E.m,p=a.kaynak,gor=m.root.visible&&!!m.root.parent;E.root.visible=gor;E.golge.visible=gor;if(!gor)continue;
    /* yatan oyuncu: pul yere yatar ve kararır (a.lth: çizimin yatış açısı) */
    const yat=m===a.m?clamp(a.lth/D,0,1):0,x=a.x,z=a.z;
    const y=p.oturuyor?S.oturmaY:Math.max(0,m.root.position.y-0.16*yat);
    /* eğim: pulun yüzü yerden kameraya doğru (yatarken düz; tepeden hep düz); en küçük ekran boyu için ölçek (tepeden ayrıca yaricapKat);
       eğik pulun yakın kenarı çime girmesin diye kaldırma */
    V.set(cp.x-x,cp.y-y,cp.z-z);const d=Math.max(1,V.length());V.multiplyScalar(1/d);
    const eg=tepe?0:PUL.egim*(1-yat);N.copy(PUL.UP).multiplyScalar(1-eg).addScaledVector(V,eg).normalize();
    E.root.quaternion.setFromUnitVectors(PUL.UP,N);
    const kat=tepe?T.yaricapKat:1,px=E.r*kat*(RH/2)/(d*tf),s=kat*clamp(PUL.enAz/Math.max(0.01,px),1,S.enCokKat);E.root.scale.setScalar(s);
    E.root.position.set(x,y+E.r*s*Math.sqrt(Math.max(0,1-N.y*N.y)),z);
    /* numara ekranda dik: dokunun üstü (yerel +x) kameradan uzağa; tepeden ekranın üstü dünya +z (js/kamera.js tepeKamera: kameranın üstü +z) */
    E.disk.rotation.y=tepe?-Math.PI/2:S.sayiKameraya&&(V.x*V.x+V.z*V.z)>1e-6?Math.atan2(V.z,-V.x):0;
    /* ayaklar: gövde yönü (çizimin yumuşatılmış açısı), adım salınımı çizimin adım evresinden (a.ph), genlik hızla */
    E.ayak.rotation.y=a.yaw;
    const spd=p.oturuyor?0:(p.spd||0);E.amp+=(clamp(spd/1.2,0,1)-E.amp)*Math.min(1,dts*8);
    const sw=A.adim*E.amp*Math.sin(a.ph||0),z0=E.r+A.on;E.aL.position.z=z0+sw;E.aR.position.z=z0-sw;
    /* vuran ayak: temastan sonraki takipte ya da vuruş dokunuşundan 0,15 sn içinde parlar ve büyür */
    const e=p.eylem,sd=p.sonDokunus;let vur=-1;
    if(e&&e.ad==='vurus'&&e.faz==='takip')vur=e.ayak==='sol'?0:1;
    else if(sd&&sd.tur==='vurus'&&t>=sd.t&&t-sd.t<0.15)vur=sd.ayak==='sol'?0:1;
    const kL=vur===0?1.4:1,kR=vur===1?1.4:1;
    E.aL.material=vur===0?PUL.parlak:E.ayakMat;E.aR.material=vur===1?PUL.parlak:E.ayakMat;
    E.aL.scale.set(A.en*kL,0.03,A.boy*kL);E.aR.scale.set(A.en*kR,0.03,A.boy*kR);
    /* kararma ve yerdeki leke (havadayken yerde kalır: yükseklik ipucu) */
    const dim=1-S.yatDim*yat;E.ustMat.color.setScalar(dim);E.yanMat.color.copy(E.yan0).multiplyScalar(dim);
    const gk=tepe?s:0;E.golge.position.set(x+T.golgeKay[0]*gk,0.025,z+T.golgeKay[1]*gk);E.golge.scale.setScalar(E.r*s*1.05);}}
/* maçta G tuşu (görünüm; D eski dürbünündü ve akış denemesi §17 onun etkisizliğini sınar): 2D görünümü aç / kapa (ayara yazılır); Z tuşu: 2D'de yakınlık seviyesi (yakın, orta, bütün stat).
   Yazı alanında, oda açıkken ve değiştirici tuşla çalışmaz */
addEventListener('keydown',e=>{if((e.code!=='KeyG'&&e.code!=='KeyZ')||e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;const t=e.target&&e.target.tagName;
  if(t==='INPUT'||t==='TEXTAREA')return;if(typeof ON_EKRAN!=='undefined'&&ON_EKRAN.sayfa==='oda')return;
  if(e.code==='KeyZ'){if(pulTepe())PUL.seviye=(PUL.seviye+1)%STIL.pul.tepe.genislik.length;return;}
  pulUygula(!PUL.acik);if(typeof OYUN!=='undefined'&&OYUN.ayarlar){OYUN.ayarlar.pul=PUL.acik;OYUN.ayarlar.kaydet();}});
pulKur();pulUygula(PUL_PARAM!=null?PUL_PARAM:!!(OYUN.ayarlar&&OYUN.ayarlar.pul));
