/* ============ Chairman — seyirci: tribündeki insanlar ============
   js/stadyum.js'in çıkardığı YERLER'e (koltuk ve basamak noktaları) maç günü doluluğuna göre insan oturtur.
   Her seyirci kutulardan kurulu küçük bir insandır. Binlerce kişi tek çizimle (InstancedMesh) çizilir.
   Tribün sakin durur; birkaç kişi ara sıra hafifçe kıpırdar. Maçtaki heyecan arttıkça (SEYIRCI_HEYECAN: x = ev, y = deplasman)
   zıplayanlar çoğalır. Başkanın yakınındakiler ve başkan bölümü daha sakindir (aSakin).
   Maç öncesi tribün yavaş yavaş dolar: her seyircinin bir geliş sırası vardır (aGelis; SEYIRCI_DOLU'yu geçince görünür).
   N9 (2026-10-04): kimse yerinde belirmez; seyirci tribününün kapısından girip yerine yürür (dosyanın sonundaki “kapıdan yerine yürüyen seyirci”).
   Ev taraftarı erken gelir, deplasman taraftarı otobüsle topluca, locadakiler geç; birkaç kişi son dakikada.
   Marşta ve gol sevincinde oturanlar ayağa kalkar (SEYIRCI_AYAKTA: x = ev ve karışık, y = deplasman): başkana yakın oturanların
   ayakta duran bir ikizi vardır (aMod 1 ↔ 2), uzaktakiler koltuktan yükselir (aMod 3). */
const SEYIRCI_ZAMAN={value:0},SEYIRCI_HEYECAN={value:new THREE.Vector2(0,0)},SEYIRCI_DOLU={value:1},SEYIRCI_AYAKTA={value:new THREE.Vector2(0,0)};
function seyirciMat(){
  const m=new THREE.MeshLambertMaterial({vertexColors:true}),K2=(2*STIL.seyirci.kareSuresi).toFixed(3);
  m.onBeforeCompile=s=>{s.uniforms.uZaman=SEYIRCI_ZAMAN;s.uniforms.uHeyecan=SEYIRCI_HEYECAN;s.uniforms.uDolu=SEYIRCI_DOLU;s.uniforms.uAyakta=SEYIRCI_AYAKTA;
    s.vertexShader='uniform float uZaman;\nuniform vec2 uHeyecan;\nuniform float uDolu;\nuniform vec2 uAyakta;\nattribute float aFaz;\nattribute float aTaraf;\nattribute float aSakin;\nattribute float aGelis;\nattribute float aMod;\n'+s.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\n'+
      'float hy=mix(uHeyecan.x,uHeyecan.y,aTaraf)*aSakin;\n'+
      'transformed.y+=step(0.94,aFaz)*0.012*sin(uZaman*1.1+aFaz*50.0);\n'+
      'transformed.y+=step(0.5,fract(uZaman/'+K2+'+aFaz))*step(1.0-hy,fract(aFaz*7.31))*(0.05+0.13*hy);\n'+
      'float ayk=step(0.5,mix(uAyakta.x,uAyakta.y,aTaraf));\n'+
      'float m1=step(0.5,aMod)*step(aMod,1.5),m2=step(1.5,aMod)*step(aMod,2.5),m3=step(2.5,aMod);\n'+
      'transformed.y+=m3*ayk*0.42;\n'+
      'transformed*=step(aGelis,uDolu)*(1.0-m1*ayk)*(1.0-m2*(1.0-ayk));');
    if(STIL.ekran.koseTitremesi)s.vertexShader=s.vertexShader.replace('#include <project_vertex>',SNAP);};
  return m;
}
/* duruşlar: başlangıç noktası oturanda koltuk yüzeyi, ayaktakinde zemin; yüzü sahaya (+z). Pantolon köşe rengiyle koyulaşır.
   Başkandan UZAK_MESAFE'den uzaktakiler kolsuz ve ense saçsız, daha az parçayla çizilir (uzaktan fark edilmez). */
const UZAK_MESAFE=40;
const PANT=[0.3,0.3,0.34];
const DURUS={
  otur:{govde:kutuBirlestir([{w:0.4,h:0.52,d:0.22,y:0.3,z:-0.06},{w:0.08,h:0.42,d:0.1,x:-0.24,y:0.3,z:-0.02},{w:0.08,h:0.42,d:0.1,x:0.24,y:0.3,z:-0.02},{w:0.36,h:0.14,d:0.4,y:0.07,z:0.14,renk:PANT}]),
        bas:kutuBirlestir([{w:0.21,h:0.24,d:0.22,y:0.69,z:-0.04}]),
        sac:kutuBirlestir([{w:0.23,h:0.06,d:0.24,y:0.83,z:-0.04},{w:0.23,h:0.15,d:0.04,y:0.74,z:-0.155}])},
  ayak:{govde:kutuBirlestir([{w:0.32,h:0.84,d:0.18,y:0.42,renk:PANT},{w:0.4,h:0.54,d:0.22,y:1.11},{w:0.08,h:0.46,d:0.1,x:-0.24,y:1.1},{w:0.08,h:0.46,d:0.1,x:0.24,y:1.1}]),
        bas:kutuBirlestir([{w:0.21,h:0.24,d:0.22,y:1.52}]),
        sac:kutuBirlestir([{w:0.23,h:0.06,d:0.24,y:1.66},{w:0.23,h:0.15,d:0.04,y:1.57,z:-0.115}])},
  oturUzak:{govde:kutuBirlestir([{w:0.46,h:0.52,d:0.22,y:0.3,z:-0.06},{w:0.36,h:0.14,d:0.4,y:0.07,z:0.14,renk:PANT}]),
        sac:kutuBirlestir([{w:0.23,h:0.08,d:0.24,y:0.84,z:-0.04}])},
  ayakUzak:{govde:kutuBirlestir([{w:0.32,h:0.84,d:0.18,y:0.42,renk:PANT},{w:0.46,h:0.54,d:0.22,y:1.11}]),
        sac:kutuBirlestir([{w:0.23,h:0.08,d:0.24,y:1.67}])}
};
DURUS.oturUzak.bas=DURUS.otur.bas;DURUS.ayakUzak.bas=DURUS.ayak.bas;
/* bölüm doluluğu: ev taraftarı önce dolar, ana tribün sonra karşı, kale arkaları en son; deplasman bölümü deplasman oranı kadar */
const HEDEF_SEYIRCI=Math.round(STAT_KAPASITE*MAC_GUNU.doluluk);
function bolumOrani(b){
  const d=MAC_GUNU.doluluk;
  if(b.taraftar==='vip')return 0.85;
  if(b.taraftar==='bos')return 0;
  if(b.taraftar==='deplasman')return clamp(HEDEF_SEYIRCI*MAC_GUNU.deplasman/Math.max(1,b.kap),0,1);
  if(b.taraftar==='ev')return clamp(d*1.35+0.03,0,1);
  return clamp(d*(b.yer==='ana'?1.1:b.yer==='karsi'?1:0.8),0,1);
}
const SEYIRCILER={otur:[],ayak:[],oturUzak:[],ayakUzak:[]},YP=new THREE.Vector3();
/* SEYIRCI_KISILER: ikizler dışındaki her seyirci (N9 yolu için): {i: YERLER sırası, yer, kayit, w, h, yerP: yerinin ayakta duruş noktası} */
const SEYIRCI_KISILER=[];
{const S=STIL.seyirci,PAL={ev:S.ev,karisik:S.karisik,deplasman:S.deplasman,vip:S.vip},sec=(a,k)=>a[Math.floor(k*a.length)%a.length];
 YERLER.forEach((y,i)=>{
  const p=clamp(bolumOrani(y.bolum)*(0.8+0.4*(1-Math.abs(y.u))),0,1);
  if(h2(i,911)>=p)return;
  const pal=PAL[y.bolum.taraftar]||S.karisik,ten=sec(STIL.tenler,h2(i,5)),giysi=sec(pal,h2(i,7));
  const bereli=h2(i,11)<S.bere,kel=!bereli&&h2(i,13)<S.kel,sac=bereli?sec(pal,h2(i,17)):kel?ten:sec(S.sac,h2(i,19));
  const ayakta=y.tip!=='oturma'||(y.bolum.taraftar==='ev'&&h2(i,23)<0.3);
  const M=y.m.clone();if(y.tip==='oturma'&&ayakta)M.multiply(new THREE.Matrix4().makeTranslation(0,-KOLTUK_YUKSEKLIGI,0.12));
  const w=0.9+h2(i,29)*0.22,h=0.92+h2(i,31)*0.16;M.multiply(new THREE.Matrix4().makeScale(w,h,w));
  const uzak=YP.setFromMatrixPosition(y.m).distanceTo(BASKAN_KOLTUGU)>UZAK_MESAFE;
  const mesafe=YP.distanceTo(BASKAN_KOLTUGU),sakin=y.vip?0.2:mesafe<12?0.35:1;
  const tr=y.bolum.taraftar,hg=h2(i,43),gelis=h2(i,47)<0.07?0.9+hg*0.1:tr==='ev'?hg*0.62:tr==='deplasman'?0.42+hg*0.14:tr==='vip'||y.vip?0.55+hg*0.4:0.1+hg*0.85;
  const kayit={M,giysi,ten,sac:kel?new THREE.Color(ten).multiplyScalar(0.88):sac,faz:h2(i,37),taraf:tr==='deplasman'?1:0,sakin,gelis,mod:ayakta?0:uzak?3:1};
  SEYIRCILER[(ayakta?'ayak':'otur')+(uzak?'Uzak':'')].push(kayit);
  {const D=y.tip==='oturma'?y.m.clone().multiply(new THREE.Matrix4().makeTranslation(0,-KOLTUK_YUKSEKLIGI,0.12)):y.m;
   SEYIRCI_KISILER.push({i,yer:y,kayit,w,h,yerP:new THREE.Vector3().setFromMatrixPosition(D)});}
  /* başkana yakın oturanın ayakta ikizi: marşta ve golde görünür */
  if(!ayakta&&!uzak){const M2=y.m.clone().multiply(new THREE.Matrix4().makeTranslation(0,-KOLTUK_YUKSEKLIGI,0.12)).multiply(new THREE.Matrix4().makeScale(w,h,w));
    SEYIRCILER.ayak.push({...kayit,M:M2,mod:2,ikiz:true});}
 });}
const SEYIRCI_SAYISI=Object.values(SEYIRCILER).reduce((s,L)=>s+L.filter(k=>!k.ikiz).length,0);
for(const d in SEYIRCILER){
  const L=SEYIRCILER[d],n=L.length;if(!n)continue;
  const at=a=>new THREE.InstancedBufferAttribute(new Float32Array(L.map(k=>k[a])),1),faz=at('faz'),taraf=at('taraf'),sakin=at('sakin'),gelis=at('gelis'),mod=at('mod'),C=new THREE.Color();
  for(const [parca,renk] of[['govde','giysi'],['bas','ten'],['sac','sac']]){
    const geo=DURUS[d][parca].clone();geo.setAttribute('aFaz',faz);geo.setAttribute('aTaraf',taraf);geo.setAttribute('aSakin',sakin);geo.setAttribute('aGelis',gelis);geo.setAttribute('aMod',mod);
    const im=new THREE.InstancedMesh(geo,seyirciMat(),n);im.frustumCulled=false;
    L.forEach((k,j)=>{im.setMatrixAt(j,k.M);im.setColorAt(j,C.set(k[renk]));});
    scene.add(im);
  }
}

/* ---- N9 (kullanıcı kararı 2026-10-04): kapıdan yerine yürüyen seyirci ----
   Seyirci saati (SEYIRCI_SAAT.A): maç öncesinde senaryo saatidir (mac.sen.t; dolma eskisi gibi). Çıkışta senaryo durunca maç zamanıyla dolma
   eğrisinin sonuna kadar ilerler: geç gelenler törende ve maçın başında aynı yoldan girer (eskiden devre arasında beliriyorlardı). Atlama
   (Santraya geç) bir kesmedir: saat senaryo saatine sıçrar, gelmesi gerekenler yerindedir. Kişinin yerine varış anı, dolma eğrisinin onun geliş
   sırasındaki tersidir; yürüyüş yol süresi kadar önce başlar. Yol (KAPILAR, js/stadyum-cevre.js): sokaktan gelir → çevre kapısının dışı → çevre kapısı →
   tribünün arka kapısı (oturma ve ayakta tribünde içeriden geçer, görünmez) → giriş ağzı → koridor (giriş ağzının hizasında kendi sırasına) →
   sıra boyunca yerine; setlerde arka duvardaki açıklığın basamaklarından setin tepesine, oradan yerine. Varınca yürüyen kaybolur, aynı karede
   yerindeki örnek görünür (oturan yerine oturur). Rastlantı çekilmez (h2). Çizim: aynı anda yürüyebilecek en çok kişi kadar örnekli küçük havuz
   (gövde, baş, saç); konum her karede işlemcide, bacak salınımı ve adımdaki iniş-çıkış gölgelendiricide. Ayarlar STIL.seyirci.yuruyen.
     seyirciSaatIlerlet(dts)  saati ilerletir (js/mac-sahnesi.js macKare); döner: A
     seyirciKare(A)           yürüyenleri yerleştirir
     seyirciDurumlari(A)      denemeler için: her kişinin görünürlüğü, yeri, yürüyorsa kapıda mı (akış denemesi sürekliliği ölçer) */
const SEYIRCI_SAAT={A:0},DOLU_SON=MAC_SENARYOSU.tribun[MAC_SENARYOSU.tribun.length-1][0];
function seyirciSaatIlerlet(dts){const S=SEYIRCI_SAAT;S.A=Math.max(S.A,mac.sen.t);if(mac.phase!=='isinma'&&S.A<DOLU_SON)S.A=Math.min(DOLU_SON,S.A+dts);return S.A;}
/* dolma eğrisinin tersi: v oranına ulaşılan senaryo saniyesi (eğrinin başındakine eşit ya da azsa -Infinity: kişi baştan yerindedir) */
function egriTers(N,v){if(v<=N[0][1])return -Infinity;for(let i=1;i<N.length;i++)if(v<=N[i][1]){const a=N[i-1],b=N[i];return a[0]+(b[0]-a[0])*(v-a[1])/(b[1]-a[1]);}return N[N.length-1][0];}
const YURUYEN=[];
{const Y0=STIL.seyirci.yuruyen,V=(x,y,z)=>new THREE.Vector3(x,y,z),Z0=-0.3,ICZ=-0.07;
 /* stat koordinatından tribünün yerel çerçevesine: [u (tribün boyunca), f (sahadan geriye negatif)] ve tersi */
 const yerele=(t,x,z)=>{const Y=tribunYeri(t.yer),c=Math.cos(Y.rot),s=Math.sin(Y.rot),dx=x-Y.pos[0],dz=z-Y.pos[1];return[dx*c-dz*s,dx*s+dz*c];};
 const yerelden=(t,u,f)=>{const Y=tribunYeri(t.yer),c=Math.cos(Y.rot),s=Math.sin(Y.rot);return[Y.pos[0]+f*s+u*c,Y.pos[1]+f*c-u*s];};
 for(const k of SEYIRCI_KISILER){
   const son=egriTers(MAC_SENARYOSU.tribun,k.kayit.gelis);if(son===-Infinity)continue;
   const t=STAT.tribunler.find(x=>x.yer===k.yer.bolum.yer),G=t&&KAPILAR.filter(g=>g.tribun===t.yer);if(!G||!G.length)continue;
   const P=k.yerP,[us,fs]=yerele(t,P.x,P.z),g=G.reduce((a,b)=>Math.abs(b.u-us)<Math.abs(a.u-us)?b:a);
   const yol=[V(g.uzak[0],Z0,g.uzak[1]),V(g.dis[0],Z0,g.dis[1]),V(g.kapi[0],ICZ,g.kapi[1]),V(g.ic[0],ICZ,g.ic[2])],gizli=g.gizli?3:-1;
   yol.push(V(g.giris[0],g.giris[1],g.giris[2]));
   if(t.tip!=='set'){/* koridor: giriş ağzının hizasında kendi sırasına; protokol bölümündekiler sıra boyunca bölmeye kadar yürüyüp basamağa çıkar */
     const PH=k.yer.vip?(t.protokol||0):0,[ax,az]=yerelden(t,g.u,fs);yol.push(V(ax,P.y-PH,az));
     if(PH){const [bx,bz]=yerelden(t,Math.sign(us)*4.6,fs);yol.push(V(bx,P.y-PH,bz));}}
   yol.push(P.clone());
   const kum=[0];for(let j=1;j<yol.length;j++)kum.push(kum[j-1]+yol[j].distanceTo(yol[j-1]));
   const v=Y0.hiz[0]+(Y0.hiz[1]-Y0.hiz[0])*h2(k.i,971),L=kum[kum.length-1];
   k.yuru={yol,kum,gizli,v,bas:son-L/v,son};YURUYEN.push(k);}
 YURUYEN.sort((a,b)=>a.yuru.bas-b.yuru.bas);}
/* yolda d metredeki nokta: konum, yön (radyan), görünür mü, parça sırası ve parçanın başından uzaklık */
function yuruyenNokta(w,d,o){const K=w.kum,Y=w.yol;let j=0;while(j<K.length-2&&d>=K[j+1])j++;
  const L=Math.max(1e-6,K[j+1]-K[j]),u=Math.min(1,Math.max(0,(d-K[j])/L)),a=Y[j],b=Y[j+1];
  o.x=a.x+(b.x-a.x)*u;o.y=a.y+(b.y-a.y)*u;o.z=a.z+(b.z-a.z)*u;o.yon=Math.atan2(b.x-a.x,b.z-a.z);o.gorunur=j!==w.gizli;o.j=j;o.bas=d-K[j];return o;}
/* havuz: aynı anda yürüyen en çok kişi (yolun tamamı, içeriden geçilen parça dahil) */
const YURUYEN_HAVUZ=(()=>{const E=[];for(const k of YURUYEN)E.push([k.yuru.bas,1],[k.yuru.son,-1]);E.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);let n=0,m=0;for(const e of E){n+=e[1];m=Math.max(m,n);}return m+2;})();
const YURUYEN_CIZIM=(()=>{
  const Y0=STIL.seyirci.yuruyen,bacak=g=>{const P=g.attributes.position,b=new Float32Array(P.count);for(let i=0;i<P.count;i++)b[i]=P.getY(i)<0.845?(P.getX(i)<0?1:-1):0;g.setAttribute('aBacak',new THREE.BufferAttribute(b,1));return g;};
  const govde=bacak(kutuBirlestir([{w:0.15,h:0.84,d:0.17,x:-0.085,y:0.42,renk:PANT},{w:0.15,h:0.84,d:0.17,x:0.085,y:0.42,renk:PANT},{w:0.4,h:0.54,d:0.22,y:1.11},{w:0.08,h:0.46,d:0.1,x:-0.24,y:1.1},{w:0.08,h:0.46,d:0.1,x:0.24,y:1.1}]));
  const adim=new THREE.InstancedBufferAttribute(new Float32Array(YURUYEN_HAVUZ),1);adim.setUsage(THREE.DynamicDrawUsage);
  const mat=()=>{const m=new THREE.MeshLambertMaterial({vertexColors:true});
    m.onBeforeCompile=s=>{s.vertexShader='attribute float aAdim;\nattribute float aBacak;\n'+s.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nfloat sa=sin(aAdim)*'+Y0.salinim.toFixed(3)+'*aBacak,cy=transformed.y-0.84,cz=transformed.z;\n'+
      'transformed.y=0.84+cy*cos(sa)-cz*sin(sa);transformed.z=cy*sin(sa)+cz*cos(sa);\ntransformed.y+=abs(cos(aAdim))*'+Y0.sekme.toFixed(3)+';');
      if(STIL.ekran.koseTitremesi)s.vertexShader=s.vertexShader.replace('#include <project_vertex>',SNAP);};return m;};
  const parcalar=[[govde,'giysi'],[bacak(DURUS.ayak.bas.clone()),'ten'],[bacak(DURUS.ayak.sac.clone()),'sac']].map(([geo,renk])=>{
    geo.setAttribute('aAdim',adim);const im=new THREE.InstancedMesh(geo,mat(),YURUYEN_HAVUZ);im.frustumCulled=false;
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);im.setColorAt(0,new THREE.Color());im.count=0;scene.add(im);return{im,renk};});
  return{parcalar,adim};})();
const YURUYEN_GECICI={M:new THREE.Matrix4(),Q:new THREE.Quaternion(),P:new THREE.Vector3(),S:new THREE.Vector3(),UST:new THREE.Vector3(0,1,0),C:new THREE.Color(),o:{}};
/* yürüyenleri yerleştirir: yolda görünen her kişi için matris, renk ve adım evresi */
function seyirciKare(A){
  const Y0=STIL.seyirci.yuruyen,Z=YURUYEN_CIZIM,ad=Z.adim.array,G=YURUYEN_GECICI,o=G.o;let n=0;
  for(const k of YURUYEN){const w=k.yuru;if(w.bas>A)break;if(A>=w.son||n>=YURUYEN_HAVUZ)continue;
    const d=(A-w.bas)*w.v;yuruyenNokta(w,d,o);if(!o.gorunur)continue;
    G.M.compose(G.P.set(o.x,o.y,o.z),G.Q.setFromAxisAngle(G.UST,o.yon),G.S.set(k.w,k.h,k.w));ad[n]=d/Y0.adim*Math.PI;
    for(const p of Z.parcalar){p.im.setMatrixAt(n,G.M);p.im.setColorAt(n,G.C.set(k.kayit[p.renk]));}
    n++;}
  for(const p of Z.parcalar){p.im.count=n;p.im.instanceMatrix.needsUpdate=true;if(p.im.instanceColor)p.im.instanceColor.needsUpdate=true;}
  Z.adim.needsUpdate=true;}
function seyirciDurumlari(A){
  const dolu=cizgiDegeri(MAC_SENARYOSU.tribun,A),R=[],o={};
  for(const k of SEYIRCI_KISILER){const w=k.yuru;
    if(!w||A>=w.son){R.push({i:k.i,g:k.kayit.gelis<=dolu,x:k.yerP.x,y:k.yerP.y,z:k.yerP.z,tur:'yer'});continue;}
    if(A<w.bas){R.push({i:k.i,g:false,tur:'yok'});continue;}
    const d=(A-w.bas)*w.v;yuruyenNokta(w,d,o);
    /* kapıda: görünen yürüyüşün (dışarıdan ya da giriş ağzından) ilk 0,6 metresi */
    const s0=w.gizli>=0&&o.j>w.gizli?w.kum[w.gizli+1]:0;
    R.push({i:k.i,g:o.gorunur,x:o.x,y:o.y,z:o.z,tur:'yol',kapida:d-s0<0.6});}
  return R;}
