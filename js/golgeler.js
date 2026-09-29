/* ============ Chairman — gölgeler: her projektörden zemine izdüşüm ============
   Her insanın kemiklerine bağlı kutu "gölge vekilleri" (gövde, baş, kollar, bacaklar) ve top, her projektör ışığından
   zemin düzlemine izdüşürülür. Gölge böylece oyuncunun gerçek silüetidir: bacaklar ve kollarla birlikte oynar,
   ışıktan uzaklaştıkça uzar (90'ların gece maçlarındaki dörtlü gölge).
   Her ışık kendi stencil bitini kullanır: aynı ışığın gölgesi bir pikseli bir kez koyulaştırır (çift koyulaşma yok),
   farklı ışıkların gölgeleri üst üste binince doğal olarak koyulaşır. */
const GOLGE_ZEMIN=0.02,GOLGE_KAPASITE=1400;
/* vekil kutular: [kemik, genişlik, yükseklik, derinlik, x, y, z] (kemiğe göre, metre) */
const GOLGE_VEKIL=[
  ['hip',0.34,0.22,0.21,0,0.02,0],['hip',0.42,0.54,0.23,0,0.39,0],['head',0.22,0.26,0.24,0,0,0],
  ['aL',0.11,0.34,0.11,0,-0.13,0],['aR',0.11,0.34,0.11,0,-0.13,0],['eL',0.09,0.36,0.09,0,-0.18,0],['eR',0.09,0.36,0.09,0,-0.18,0],
  ['lL',0.16,0.46,0.17,0,-0.2,0],['lR',0.16,0.46,0.17,0,-0.2,0],['kL',0.12,0.5,0.14,0,-0.24,0],['kR',0.12,0.5,0.14,0,-0.24,0],
  ['kL',0.12,0.08,0.26,0,-0.46,0.05],['kR',0.12,0.08,0.26,0,-0.46,0.05]
];
const GOLGE_VS=`uniform vec3 uIsik;uniform float uZemin;
void main(){
  #ifdef USE_INSTANCING
  vec4 w=modelMatrix*instanceMatrix*vec4(position,1.0);
  #else
  vec4 w=modelMatrix*vec4(position,1.0);
  #endif
  float t=(uIsik.y-uZemin)/max(uIsik.y-w.y,0.05);
  vec3 p=uIsik+(w.xyz-uIsik)*t;p.y=uZemin;
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.0);
}`;
const GOLGE_FS=`uniform float uOpak;void main(){gl_FragColor=vec4(0.0,0.0,0.0,uOpak);}`;
function golgeMalzeme(L,bit){
  return new THREE.ShaderMaterial({
    uniforms:{uIsik:{value:new THREE.Vector3(L[0],STAT.projektor.yukseklik,L[1])},uZemin:{value:GOLGE_ZEMIN},uOpak:{value:STIL.golge.opaklik}},
    vertexShader:GOLGE_VS,fragmentShader:GOLGE_FS,transparent:true,depthWrite:false,
    polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,
    stencilWrite:true,stencilRef:bit,stencilFuncMask:bit,stencilWriteMask:bit,
    stencilFunc:THREE.NotEqualStencilFunc,stencilFail:THREE.KeepStencilOp,stencilZFail:THREE.KeepStencilOp,stencilZPass:THREE.ReplaceStencilOp});
}
const GOLGE={insanlar:[],top:null,isiklar:[]};
{const kutu=new THREE.BoxGeometry(1,1,1),tp=new THREE.IcosahedronGeometry(1,1),ortak=new THREE.InstancedBufferAttribute(new Float32Array(GOLGE_KAPASITE*16),16);
 ortak.setUsage(THREE.DynamicDrawUsage);
 STAT.projektor.konumlar.forEach((L,i)=>{const bit=1<<i;
   const im=new THREE.InstancedMesh(kutu,golgeMalzeme(L,bit),GOLGE_KAPASITE);im.instanceMatrix=ortak;im.count=0;im.frustumCulled=false;im.renderOrder=1;scene.add(im);
   const tm=new THREE.Mesh(tp,golgeMalzeme(L,bit));tm.frustumCulled=false;tm.renderOrder=1;scene.add(tm);
   GOLGE.isiklar.push({im,tm});});
 GOLGE.ortak=ortak;}
/* bir insan modeli (player() sonucu) ya da top ağı gölge verir */
function golgeEkle(model){GOLGE.insanlar.push(model);}
function golgeTop(mesh,yaricap){GOLGE.top=mesh;GOLGE.topR=yaricap;}
/* her karede, modeller yerleştikten sonra: vekil kutuların dünya matrislerini yaz */
const GOLGE_M=new THREE.Matrix4(),GOLGE_K=new THREE.Matrix4();
function golgeleriGuncelle(){
  const a=GOLGE.ortak.array;let n=0;
  for(const m of GOLGE.insanlar){
    if(!m.root.visible||!m.root.parent)continue;
    m.root.updateMatrixWorld(true);
    for(const [kem,w,h,d,x,y,z] of GOLGE_VEKIL){if(n>=GOLGE_KAPASITE)break;
      GOLGE_K.makeScale(w,h,d).setPosition(x,y,z);GOLGE_M.multiplyMatrices(m[kem].matrixWorld,GOLGE_K);GOLGE_M.toArray(a,n*16);n++;}}
  GOLGE.ortak.needsUpdate=true;
  const t=GOLGE.top,tg=!!(t&&t.visible);
  for(const I of GOLGE.isiklar){I.im.count=n;I.tm.visible=tg;if(tg){I.tm.position.copy(t.position);I.tm.scale.setScalar(GOLGE.topR);}}
}
