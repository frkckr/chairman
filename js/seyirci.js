/* ============ Demirkapı '99 — seyirci: tribündeki insanlar ============
   js/stadyum.js'in çıkardığı YERLER'e (koltuk ve basamak noktaları) maç günü doluluğuna göre insan oturtur.
   Her seyirci kutulardan kurulu küçük bir insandır. Binlerce kişi tek çizimle (InstancedMesh) çizilir, iki kareyle sallanır. */
const SEYIRCI_ZAMAN={value:0};
function seyirciMat(){
  const m=new THREE.MeshLambertMaterial({vertexColors:true}),K2=(2*STIL.seyirci.kareSuresi).toFixed(3);
  m.onBeforeCompile=s=>{s.uniforms.uZaman=SEYIRCI_ZAMAN;
    s.vertexShader='uniform float uZaman;\nattribute float aFaz;\n'+s.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\ntransformed.y+=step(0.5,fract(uZaman/'+K2+'+aFaz))*step(0.35,aFaz)*0.05;');
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
  SEYIRCILER[(ayakta?'ayak':'otur')+(uzak?'Uzak':'')].push({M,giysi,ten,sac:kel?new THREE.Color(ten).multiplyScalar(0.88):sac,faz:h2(i,37)});
 });}
const SEYIRCI_SAYISI=Object.values(SEYIRCILER).reduce((s,L)=>s+L.length,0);
for(const d in SEYIRCILER){
  const L=SEYIRCILER[d],n=L.length;if(!n)continue;
  const faz=new THREE.InstancedBufferAttribute(new Float32Array(L.map(k=>k.faz)),1),C=new THREE.Color();
  for(const [parca,renk] of[['govde','giysi'],['bas','ten'],['sac','sac']]){
    const geo=DURUS[d][parca].clone();geo.setAttribute('aFaz',faz);
    const im=new THREE.InstancedMesh(geo,seyirciMat(),n);im.frustumCulled=false;
    L.forEach((k,j)=>{im.setMatrixAt(j,k.M);im.setColorAt(j,C.set(k[renk]));});
    scene.add(im);
  }
}
