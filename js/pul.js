/* ============ Chairman — 2D maç görünümü: pullar (P1 2026-10-21 akşam; P2 2026-10-21 gece: karar kesin, 2D varsayılan) ============
   Kullanıcı kararı (2026-10-21 gece, kesin): maç FM 2D gibi tepeden izlenir; figürlü motor antrenman sahneleri içindir. Başkanın loca bakışı
   ve ön planı (masa, eller) maçta kalkar, locaya giriş sahnesi atlanır (js/loca-giris.js tepeAnBaslat), kamera tepeden
   bakar (js/kamera.js tepeKamera), stat, tribünler, reklamlar ve dumanlar 3B olarak çevrede kalır. Sahadaki her insan (oyuncu, kaleci, hakemler,
   kulübedeki yedekler, kenar personeli, top toplayıcılar) aynı numaralı pul olarak çizilir: üst yüzde forma rengi, forma süsünün renginde kenar
   halkası ve numara, önde gövde yönünü gösteren iki ayak çizgisi. Boy, saç, yapı ayrımı yoktur; ayrım yalnız renk ve numaradır.
   İskelet ve animasyon (js/animasyon.js) çalışmaya devam eder: pul açıkken insan modelinin yalnız malzemesi çizilmez (kök görünür kalır; kemiklere
   bağlı kart, bayrak, defter ve sprey görünsün diye — r128'de görünmez kök çocuklarını da gizler) ve insan gölgeleri kapanır (js/golgeler.js
   GOLGE.insanGizli). Her pul kendi modelinin kökünü izler: tünel, kulübe, sağlıkçı gizleme ve yedeğin eşofman/forma geçişi aynen.
   Çizim motoru yalnız okur (TEKNIK_PLAN §8); bu dosya rastlantı çağırmaz. Ayarlar STIL.pul (js/stil-99.js).
   2D varsayılandır. Loca bakışı yalnız geliştirme ve araçlar için (TEST): Ayarlar > Geliştirici > "Maçta loca bakışı" (OYUN.ayarlar.locaBakisi),
   maçta G tuşu, adres ?pul=0 (figürlü loca bakışı; animasyon araçları bunu kullanır) ya da ?pul=1 (2D; ayarı ezer). Maçta Z tuşu yakınlığı
   değiştirir (?tepeSeviye=0|1|2); ?pulEnAz=2..20 pulun en küçük ekran yarıçapı (deneme). */
const PUL_PARAM=(()=>{try{const v=new URLSearchParams(location.search).get('pul');return v==='1'?true:v==='0'?false:null;}catch(e){return null;}})();
const PUL_ENAZ_PARAM=(()=>{try{const v=parseFloat(new URLSearchParams(location.search).get('pulEnAz'));return isFinite(v)?clamp(v,2,20):null;}catch(e){return null;}})();
const PUL_SEVIYE_PARAM=(()=>{try{const v=parseInt(new URLSearchParams(location.search).get('tepeSeviye'),10);return v>=0&&v<=2?v:null;}catch(e){return null;}})();
const PUL={acik:false,seviye:1,liste:[],geo:null,ayakGeo:null,golgeGeo:null,golgeMat:null,parlak:null,enAz:6,stat:null};
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
/* P2: 2D'de stadın sınırı ve bütün stat görünümü (tribün arkalarından; js/stadyum.js STAT_OLCU): kamera merkezinin gidebileceği alan
   x0…x1, z0…z1, stadın ortası (cx, cz), bütün stadı gösteren dikey uzunluk E */
function pulStatKur(){const O=STAT_OLCU,K=STIL.pul.tepe.kenar,x0=-O.arka.kale1-K,x1=O.arka.kale2+K,z0=-O.arka.ana-K,z1=O.arka.karsi+K;
  return{x0,x1,z0,z1,cx:(x0+x1)/2,cz:(z0+z1)/2,E:Math.max(z1-z0,(x1-x0)*RH/RW)};}
function pulKur(){const S=STIL.pul;PUL.stat=pulStatKur();pulTopKur();
  PUL.geo=new THREE.CylinderGeometry(1,1,1,16,1);PUL.ayakGeo=new THREE.BoxGeometry(1,1,1);PUL.golgeGeo=new THREE.CircleGeometry(1,16);
  PUL.golgeMat=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:S.golge,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  PUL.parlak=BAS({color:S.ayak.parlak});
  PUL.enAz=PUL_ENAZ_PARAM!=null?PUL_ENAZ_PARAM:S.enAzPx;PUL.seviye=PUL_SEVIYE_PARAM!=null?PUL_SEVIYE_PARAM:S.tepe.seviye;
  for(const a of AKTORLER){pulEkle(a,a.m);if(a.esofman)pulEkle(a,a.esofman);}}
/* 2D görünüm açık mı (tepeden kamera; js/kamera.js ve js/arayuz.js okur) */
function pulTepe(){return PUL.acik;}
/* aç / kapa (canlı): insan malzemeleri, insan gölgeleri ve pullar */
function pulUygula(acik){PUL.acik=!!acik;GOLGE.insanGizli=PUL.acik;GOLGE.topGizli=pulTepe();
  for(const a of AKTORLER)for(const m of[a.m,a.esofman])if(m&&m.mesh&&m.mesh.material)m.mesh.material.visible=!PUL.acik;
  if(!PUL.acik)for(const E of PUL.liste){E.root.visible=false;E.golge.visible=false;}}
/* her kare (js/mac-sahnesi.js macKare; aktörlerin kökleri kesinleştikten sonra) */
function pulKare(dts){if(!PUL.acik){pulSimgeKare(false,dts);return;}
  const S=STIL.pul,A=S.ayak,T=S.tepe,cp=camera.position,tf=Math.tan(camera.fov*Math.PI/360),t=mac.t,D=STIL.animasyon.dusus.aci,G=PUL_GOR;G.length=0;
  for(const E of PUL.liste){const a=E.a,m=E.m,p=a.kaynak,gor=m.root.visible&&!!m.root.parent;E.root.visible=gor;E.golge.visible=gor;if(!gor)continue;
    /* yatan oyuncu: pul yere yatar ve kararır (a.lth: çizimin ya da E'den beri pulAktor'un yatış açısı) */
    const yat=m===a.m?clamp(a.lth/D,0,1):0,x=a.x,z=a.z;
    const y=p.oturuyor?S.oturmaY:Math.max(0,m.root.position.y-0.16*yat);
    /* boy: tepeden yaricapKat, uzakta en küçük ekran boyu; pul düz yatar */
    const d=Math.max(1,Math.hypot(cp.x-x,cp.y-y,cp.z-z)),kat=T.yaricapKat,px=E.r*kat*(RH/2)/(d*tf);
    E.s=kat*clamp(PUL.enAz/Math.max(0.01,px),1,S.enCokKat);E.x=x;E.y=y;E.z=z;E.yat=yat;G.push(E);}
  /* E3 (2026-10-23): kalabalıkta (korner, kutu) iç içe geçen pullar yerel olarak küçülür — en çok STIL.pul.kalabalik.enKucuk'e; numara okunur kalır */
  {const K=S.kalabalik;if(K&&K.acik&&G.length>1){for(const E of G)E.kk=1;
    for(let i=0;i<G.length;i++){const P=G[i];if(P.y>0.3)continue;for(let j=i+1;j<G.length;j++){const Q=G[j];if(Q.y>0.3)continue;const dx=P.x-Q.x,dz=P.z-Q.z,rr=P.r*P.s+Q.r*Q.s;
      if(dx*dx+dz*dz<rr*rr){const f=Math.max(K.enKucuk,Math.sqrt(dx*dx+dz*dz)/rr);if(f<P.kk)P.kk=f;if(f<Q.kk)Q.kk=f;}}}
    for(const E of G)E.s*=E.kk;}}
  for(const E of G){const a=E.a,m=E.m,p=a.kaynak,x=E.x,y=E.y,z=E.z,s=E.s,yat=E.yat;
    E.root.scale.setScalar(s);E.root.position.set(x,y,z);
    /* numara ekranda dik: dokunun üstü (yerel +x) ekranın üstüne, dünya +z'ye (js/kamera.js tepeKamera: kameranın üstü +z) */
    E.disk.rotation.y=-Math.PI/2;
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
    E.golge.position.set(x+T.golgeKay[0]*s,0.025,z+T.golgeKay[1]*s);E.golge.scale.setScalar(E.r*s*1.05);}
  pulSimgeKare(true,dts);}
const PUL_GOR=[];
/* ---- P2: 2D'de topun yüksekliği ve yolu (kullanıcı: "topun havada olduğu anlaşılmıyor"; FM27 de topa güçlü gölge verdi) ----
   Boy: top havada STIL.pul.top.yukseklik payı kadar büyür (tepe m'de tam). Gölge: kendi yumuşak diski; yükseldikçe ekranda sağ-aşağı kayar,
   büyür ve solar (projektör gölgeleri 2D'de kapalı: GOLGE.topGizli). İz: hızlı ya da havadaki topun ardında kısa, sönen noktalar (eğri pas
   görünür olsun). İniş: havadaki topun ineceği yerde halka; js/kamera.js'in iniş tahmini gibi özel bir top kopyası topFizikAdim ile ileri
   sarılır (motor yalnız okunur; yörünge değişince — b.surum — ya da 0,25 sn'de bir). Zaman maçın çizim saati (zaman) */
const PUL_TOP={iz:null,izOrnek:[],izSira:0,izSon:-1e9,golge:null,inis:null,inisSurum:-1,inisT:-1e9,inisVar:false,
  K:{x:0,y:0,z:0,vx:0,vy:0,vz:0,egri:0,ust:0,wYan:0,wUst:0,sw:0},M:new THREE.Matrix4(),Q:new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-Math.PI/2),
  P:new THREE.Vector3(),S:new THREE.Vector3(),C:new THREE.Color()};
function pulTopKur(){const T=STIL.pul.top,P=PUL_TOP;
  {const cv=mk(32,32),g=cv.getContext('2d'),gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(0.55,'rgba(0,0,0,0.7)');gr.addColorStop(1,'rgba(0,0,0,0)');
   g.fillStyle=gr;g.fillRect(0,0,32,32);
   P.golge=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({map:tx(cv,'l'),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));
   P.golge.rotation.x=-Math.PI/2;P.golge.renderOrder=1;P.golge.visible=false;scene.add(P.golge);}
  P.iz=new THREE.InstancedMesh(new THREE.CircleGeometry(1,10),new THREE.MeshBasicMaterial({transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}),T.iz.sayi);
  for(let i=0;i<T.iz.sayi;i++){P.M.makeScale(0,0,0);P.iz.setMatrixAt(i,P.M);P.iz.setColorAt(i,P.C.setRGB(0,0,0));P.izOrnek.push({x:0,y:0,z:0,t:-1e9});}
  P.iz.frustumCulled=false;P.iz.renderOrder=2;P.iz.visible=false;scene.add(P.iz);
  P.inis=new THREE.Mesh(new THREE.RingGeometry(0.72,1,24),new THREE.MeshBasicMaterial({color:0xf4f4ee,transparent:true,opacity:T.inis.opak,depthWrite:false,side:THREE.DoubleSide}));
  P.inis.rotation.x=-Math.PI/2;P.inis.renderOrder=1;P.inis.visible=false;scene.add(P.inis);}
function pulTopKare(acik){const P=PUL_TOP,T=STIL.pul.top,t=topMesh,b=mac.ball;
  if(!acik||!t.visible){P.golge.visible=false;P.iz.visible=false;P.inis.visible=false;return;}
  /* boy (js/okunurluk.js OKN_TOP: topCiz konumu her kare yazar; yazmadıysa önceki kaldırmayı geri al) */
  const O=OKN_TOP,y0=t.position.y===O.sonY?O.tabanY:t.position.y,h=Math.max(0,y0-TOP_R),hh=clamp(h/T.tepe,0,1);
  const d=Math.max(1,camera.position.distanceTo(t.position)),px=2*TOP_R*(RH/2)/(d*Math.tan(camera.fov*Math.PI/360));
  const s=Math.max(T.kat*(1+T.yukseklik*hh),OKN.topEnAz/px);t.scale.setScalar(s);t.position.y=y0+TOP_R*(s-1);O.tabanY=y0;O.sonY=t.position.y;
  /* gölge */
  {const G=T.golge,k=G.taban+Math.min(h,G.enCok),r=TOP_R*s*G.boy*(1+0.6*hh);P.golge.visible=true;
   P.golge.position.set(t.position.x+G.kay[0]*k,0.035,t.position.z+G.kay[1]*k);P.golge.scale.set(r,r,1);P.golge.material.opacity=G.opak*(1-0.45*hh);}
  /* iz */
  {const I=T.iz,v=Math.hypot(b.vx,b.vy,b.vz);
   if(!b.tasiyan&&(v>I.hiz||b.y>I.y)&&zaman-P.izSon>=I.aralik){const o=P.izOrnek[P.izSira];o.x=t.position.x;o.y=t.position.y;o.z=t.position.z;o.t=zaman;P.izSira=(P.izSira+1)%I.sayi;P.izSon=zaman;}
   let gor=false;
   for(let i=0;i<I.sayi;i++){const o=P.izOrnek[i],a=zaman-o.t;
     if(a<0||a>I.sure){P.M.makeScale(0,0,0);P.iz.setMatrixAt(i,P.M);continue;}
     const f=a/I.sure,r=TOP_R*s*(I.boy[0]+(I.boy[1]-I.boy[0])*f),k=I.parlak*(1-f);gor=true;
     P.M.compose(P.P.set(o.x,o.y,o.z),P.Q,P.S.set(r,r,r));P.iz.setMatrixAt(i,P.M);P.iz.setColorAt(i,P.C.setRGB(k,k,k));}
   P.iz.visible=gor;P.iz.instanceMatrix.needsUpdate=true;if(P.iz.instanceColor)P.iz.instanceColor.needsUpdate=true;}
  /* iniş halkası */
  {const N=T.inis,hava=!b.tasiyan&&!b.sahip&&(b.y>0.4||b.vy>1.5);
   if(N.acik&&hava){if(b.surum!==P.inisSurum||zaman-P.inisT>0.25){P.inisSurum=b.surum;P.inisT=zaman;const K=P.K;
       K.x=b.x;K.y=b.y;K.z=b.z;K.vx=b.vx;K.vy=b.vy;K.vz=b.vz;K.egri=b.egri||0;K.ust=b.ust||0;K.wYan=b.wYan||0;K.wUst=b.wUst||0;K.sw=b.sw||0;
       let tt=0;while(tt<4){topFizikAdim(K,1/60,false,mac.R,mac.kosullar);tt+=1/60;if(tt>0.05&&K.y<=0.02)break;}
       P.inisVar=tt<4;P.inis.position.set(K.x,0.04,K.z-MOTOR_Z);}
     P.inis.visible=P.inisVar;if(P.inisVar){const r=N.yaricap*(1+0.12*Math.sin(zaman*9));P.inis.scale.set(r,r,1);}}
   else P.inis.visible=false;}}
/* ---- E (2026-10-23; FUTBOL_KUTUPHANESI §12.1 E): kopuş — 2D'de figür animasyonu çalışmaz, pul motorun alanlarından beslenir ----
   pulAktor, aktorGuncelle'nin (js/animasyon.js) 2D'de yerine geçer (js/mac-sahnesi.js macKare; STIL.pul.kopus): konum (ara değer), görünürlük (tünel,
   kulübedeki sağlıkçı, yedeğin eşofmanı), gövde yönü (motor yönü, aynı yumuşatma), adım evresi hızdan (kadans = hız ÷ (taban + eğim·hız)), yatış motorun
   yere düşme eylemlerinden (düşüş, yerde, kayma, kalecinin uçuşu). Kemik, poz ve IK yok; kemiklere bağlı kart, defter, sprey kutusu ve yan hakem
   bayrağı 2D'de gizlidir (olay simgeleri yerlerini alır). Motor yalnız okunur, rastlantı yok */
const PUL_YAT={dusus:1,yerde:1,kayma:1,ucus:1};
function pulAktor(a,al,dts,T){const p=a.kaynak,S=STIL.pul;a.x=lerp(a.px,p.x,al);a.z=lerp(a.pz,p.z,al)-MOTOR_Z;a.al=al;
  let gor=p.z>T.z-0.8&&(p.tur!=='oyuncu'||p.oyunda||p.cikiyor);
  if(p.kind==='saglikci'&&p.ev&&Math.hypot(p.x-p.ev.x,p.z-p.ev.z)<STIL.saglikciGizle){gor=false;a.ilkYon=true;}
  let m=a.m;
  if(a.esofman){const es=p.tur==='yedek'&&!p.cikti;a.esofman.root.visible=gor&&es;if(es){a.m.root.visible=false;m=a.esofman;}else a.m.root.visible=gor;}
  else a.m.root.visible=gor;
  if(a.spK)a.spK.visible=false;if(a.bayrak)a.bayrak.visible=false;
  if(!gor)return;
  const yw=Math.atan2(Math.cos(p.yon),Math.sin(p.yon));if(a.ilkYon){a.ilkYon=false;a.yaw=a.yawO=yw;}aciYumusak(a,yw,dts,40,9);
  const spd=p.oturuyor?0:(p.spd||0),A=S.adim2;if(spd>0.05&&dts>0)a.ph=((a.ph||0)+dts*Math.PI*spd/(A.taban+A.egim*spd))%(2*Math.PI);
  const e=p.eylem,yat=e&&PUL_YAT[e.ad]?1:0,D=STIL.animasyon.dusus.aci;a.lth=(a.lth||0)+(yat*D-(a.lth||0))*Math.min(1,dts*S.yatHiz);
  m.root.position.set(a.x,0,a.z);m.root.rotation.set(0,a.yaw,0);}
/* 2D'de figür yolu kapalı mı (js/mac-sahnesi.js macKare okur) */
function pulKopus(){return PUL.acik&&!!STIL.pul.kopus;}
/* ---- E: olay simgeleri (kart, sakatlık, değişiklik, ofsayt bayrağı, pas isteği) ve top taşıyanın adı ----
   Oyunun piksel diliyle küçük dokular (Nearest), ekranda dik (sprite), pulun üstünde (ekranın üstü dünya +z); boy ekranda sabit (STIL.pul.simge.px; RH
   satıra göre). Olaylar js/mac-sahnesi.js olay'dan (pulOlay); süreler motor zamanıyla (mac.t). ?pul=0'da çizilmez */
const PUL_SIMGE={doku:{},liste:[],havuz:[],etiket:null,etDoku:new Map(),etP:null,etW:0,etA:0,istek:[]};
function pulSimgeCiz(tur){const D=PUL_SIMGE.doku;if(D[tur])return D[tur];
  const n=tur==='sari'||tur==='kirmizi'?[8,11]:[11,11],cv=mk(n[0],n[1]),g=cv.getContext('2d'),k='#141210',f=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  if(tur==='sari'||tur==='kirmizi'){f(k,0,0,8,11);f(tur==='sari'?'#f2d21d':'#d8201e',1,1,6,9);f('rgba(255,255,255,0.35)',1,1,6,2);}
  else if(tur==='sakat'){f(k,1,1,9,9);f('#f4f2ea',2,2,7,7);f('#d8201e',5,3,1,5);f('#d8201e',3,5,5,1);f('#d8201e',4,4,3,3);}
  else if(tur==='giren'||tur==='cikan'){const c=tur==='giren'?'#3fbf4f':'#d8201e',yuk=tur==='giren';f(k,1,1,9,9);f('#1e1c18',2,2,7,7);
    for(let i=0;i<4;i++){const y=yuk?3+i:7-i;f(c,5-i,y,1+2*i,1);}f(c,4,yuk?7:2,3,2);}
  else if(tur==='ofsayt'){f(k,2,1,2,10);f('#e8e4d8',3,1,1,9);f(k,4,1,6,6);f('#f2c11d',4,2,5,4);f('#d8201e',6,2,3,2);f('#d8201e',4,4,2,2);}
  else if(tur==='istek'){f(k,2,2,7,9);f('#f4f2ea',3,6,5,4);f('#f4f2ea',3,3,1,3);f('#f4f2ea',5,2,1,4);f('#f4f2ea',7,3,1,3);}
  return D[tur]=tx(cv,'n');}
function pulSprite(){const H=PUL_SIMGE.havuz;const s=H.pop()||new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false,depthWrite:false}));
  s.renderOrder=20;s.visible=false;if(!s.parent)scene.add(s);return s;}
function pulSimgeEkle(tur,p,sure){const L=PUL_SIMGE.liste;for(const o of L)if(o.p===p&&o.tur===tur){o.t0=mac.t;o.sure=sure;return;}
  const s=pulSprite();s.material.map=pulSimgeCiz(tur);s.material.needsUpdate=true;L.push({tur,p,t0:mac.t,sure,s});}
/* js/mac-sahnesi.js olay: olayın simgesi (2D kapalıyken de kaydedilir, çizilmez) */
function pulOlay(ad,v){if(!v)return;const S=STIL.pul.simge;
  if(ad==='kart'&&v.p)pulSimgeEkle(v.renk==='sari'?'sari':'kirmizi',v.p,S.kart);
  else if(ad==='sakatlik'&&v.p&&S.sakat)pulSimgeEkle('sakat',v.p,60);
  else if(ad==='degisiklik'){if(v.giren)pulSimgeEkle('giren',v.giren,S.degisiklik);if(v.cikan)pulSimgeEkle('cikan',v.cikan,S.degisiklik);}
  else if(ad==='ofsayt'&&v.p&&mac.refs){const yh=v.p.x>0?mac.refs[1]:mac.refs[2];if(yh)pulSimgeEkle('ofsayt',yh,S.ofsayt);}}
/* her kare (pulKare'nin sonunda): oyuncunun pulunun üstünde, ekranda sabit boyda; sakatlık simgesi oyuncu yerden kalkınca, sedye ve tedavi bitince söner */
function pulSimgeKare(acik,dts){const P=PUL_SIMGE,S=STIL.pul.simge,L=P.liste,tf=Math.tan(camera.fov*Math.PI/360),cp=camera.position;
  const yer=(p)=>{for(const e of PUL.liste)if(e.a.kaynak===p&&e.root.visible&&e.s)return e;return null;};
  const olcek=(x,y,z,px)=>{const d=Math.max(1,Math.hypot(cp.x-x,cp.y-y,cp.z-z));return px*2*d*tf/RH;};
  for(let i=L.length-1;i>=0;i--){const o=L[i],a=mac.t-o.t0;let bit=a>o.sure||a<0;
    if(o.tur==='sakat'&&a>1.5&&!(o.p.eylem&&PUL_YAT[o.p.eylem.ad])&&!(mac.sedye&&mac.sedye.p===o.p)&&!o.p.tedavi)bit=true;
    if(bit){o.s.visible=false;P.havuz.push(o.s);L.splice(i,1);continue;}
    const E=acik?yer(o.p):null;if(!E){o.s.visible=false;continue;}
    const h=olcek(E.x,1,E.z,S.px),w=o.tur==='sari'||o.tur==='kirmizi'?h*8/11:h,sol=a<0.25?a/0.25:o.sure-a<0.5?(o.sure-a)/0.5:1;
    o.s.visible=true;o.s.scale.set(w,h,1);o.s.material.opacity=clamp(sol,0,1);o.s.position.set(E.x,1.0,E.z+E.r*E.s*S.bosluk+h/2);}
  /* pas isteği: top takımda, sahibin dışındaki oyuncunun kol kaldırma ya da çağırma jesti süresince (en çok dört) */
  {const I=P.istek,b=mac.ball,sh=b.sahip;let n=0;
    if(acik&&S.istek&&sh&&sh.team!=null&&mac.teams[sh.team])for(const p of mac.teams[sh.team]){if(n>=4)break;if(p===sh||!p.oyunda||!p.jest||(p.jest.tur!=='kol'&&p.jest.tur!=='cagir'))continue;
      const E=yer(p);if(!E)continue;let s=I[n];if(!s){s=I[n]=pulSprite();s.material.map=pulSimgeCiz('istek');s.material.needsUpdate=true;}
      const h=olcek(E.x,1,E.z,S.istekPx);s.visible=true;s.material.opacity=0.92;s.scale.set(h,h,1);s.position.set(E.x+E.r*E.s*1.1+h*0.4,1.0,E.z+E.r*E.s*0.9+h*0.4);n++;}
    for(let i=n;i<I.length;i++)I[i].visible=false;}
  /* top taşıyanın adı (oyunun piksel yazısı, pulun altında); sahip değişince yumuşak geçiş */
  {const K=STIL.pul.etiket;if(!P.etiket)P.etiket=pulSprite();const s=P.etiket,b=mac.ball,p=acik&&K.acik?(b.sahip||(b.tasiyan&&b.tasiyan.tur==='oyuncu'?b.tasiyan:null)):null;
    if(p!==P.etP){P.etP=p;P.etA=0;if(p){let t=P.etDoku.get(p);if(!t){const ad=String(p.name||p.no||''),W=textW(ad,1)+4,cv=mk(W,9),g=cv.getContext('2d');
        g.fillStyle=K.golge;g.fillRect(0,0,W,9);ctxText(g,ad,2,1,K.renk,1);t={tex:tx(cv,'n'),w:W};P.etDoku.set(p,t);}
      s.material.map=t.tex;s.material.needsUpdate=true;P.etW=t.w;}}
    const E=p?yer(p):null;if(!E){s.visible=false;}else{P.etA=Math.min(1,P.etA+(dts>0?dts:0.016)/K.gecis);const h=olcek(E.x,1,E.z,K.px);
      s.visible=true;s.material.opacity=P.etA;s.scale.set(h*P.etW/9,h,1);s.position.set(E.x,1.0,E.z-E.r*E.s*K.bosluk-h/2);}}}
/* maçta G tuşu (görünüm; TEST — D eski dürbünündü ve akış denemesi §17 onun etkisizliğini sınar): 2D ↔ loca bakışı (OYUN.ayarlar.locaBakisi) (ayara yazılır); Z tuşu: 2D'de yakınlık seviyesi (yakın, orta, bütün stat).
   Yazı alanında, oda açıkken ve değiştirici tuşla çalışmaz */
addEventListener('keydown',e=>{if((e.code!=='KeyG'&&e.code!=='KeyZ')||e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;const t=e.target&&e.target.tagName;
  if(t==='INPUT'||t==='TEXTAREA')return;if(typeof ON_EKRAN!=='undefined'&&ON_EKRAN.sayfa==='oda')return;
  if(e.code==='KeyZ'){if(pulTepe())PUL.seviye=(PUL.seviye+1)%STIL.pul.tepe.genislik.length;return;}
  pulUygula(!PUL.acik);if(typeof OYUN!=='undefined'&&OYUN.ayarlar){OYUN.ayarlar.locaBakisi=!PUL.acik;OYUN.ayarlar.kaydet();}});
pulKur();pulUygula(PUL_PARAM!=null?PUL_PARAM:!(OYUN.ayarlar&&OYUN.ayarlar.locaBakisi));
