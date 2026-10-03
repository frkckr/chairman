/* ============ Chairman — maçın okunurluğu (çizim) ============
   Sahibi: A akışı (2026-10-03). Locadan uzaktaki maçın net görünmesi için sahneye eklenen yardımcı çizimler. Yalnız maç sahnesini (scene)
   etkiler; balkon ve oda görünümü değişmez. Motoru yalnız okur.
   - Saha çizgileri: dokudaki çizgiler yatık açıda bir pikselin altına inip silinmesin diye üstlerine ekranda sabit genişlikli (maç ızgarasında,
     960×720, ≥ 1 piksel) şeritler çizilir (tek çizim; uzaklık sisi ve zemin kalitesinin soluklaştırması korunur).
   - Top: ekrandaki çapı topEnAz pikselin altına inmesin diye büyütülür (yere değdiği noktadan); havadaki topun hemen altında küçük koyu leke.
   - Oyuncular: dokunun kendi renginden hafif ışıma (parlama; gece ışığında koyu leke olmasınlar), isteğe bağlı 1 piksellik koyu dış çizgi
     denemesi (disCizgi; son işlemde oyuncu/top piksellerinin komşuluğundan, ek çizim yok).
   okunurlukKare her karede bakış yerleştikten sonra, çizimden önce çağrılır (js/arayuz.js frame). */
const OKN=STIL.okunurluk;
/* ---- saha çizgileri: tarifteki ölçüler (js/stadyum.js pitchCv ile aynı), en çok 4 m'lik parçalar ---- */
const OKN_CIZGI=(()=>{
  const P=[],ekle=(x0,z0,x1,z1)=>{const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,z1-z0)/4));for(let i=0;i<n;i++)P.push([x0+(x1-x0)*i/n,z0+(z1-z0)*i/n,x0+(x1-x0)*(i+1)/n,z0+(z1-z0)*(i+1)/n]);};
  const yay=(cx,cz,r,a0,a1,n)=>{for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n,b=a0+(a1-a0)*(i+1)/n;ekle(cx+Math.cos(a)*r,cz+Math.sin(a)*r,cx+Math.cos(b)*r,cz+Math.sin(b)*r);}};
  const nokta=(x,z)=>{ekle(x-0.18,z,x+0.18,z);ekle(x,z-0.18,x,z+0.18);};
  ekle(-PL,-MZ,PL,-MZ);ekle(-PL,MZ,PL,MZ);ekle(-PL,-MZ,-PL,MZ);ekle(PL,-MZ,PL,MZ);ekle(0,-MZ,0,MZ);
  yay(0,0,9.15,0,Math.PI*2,48);nokta(0,0);
  const th=Math.acos(5.5/9.15);
  for(const sd of[-1,1]){
    for(const [x,z] of[[36,20.16],[47,9.16]]){ekle(sd*x,-z,sd*x,z);ekle(sd*x,-z,sd*PL,-z);ekle(sd*x,z,sd*PL,z);}
    if(sd>0)yay(41.5,0,9.15,Math.PI-th,Math.PI+th,10);else yay(-41.5,0,9.15,-th,th,10);
    nokta(sd*41.5,0);
    for(const t of[-1,1]){const a0=sd>0?(t>0?Math.PI:Math.PI/2):(t>0?1.5*Math.PI:0);yay(sd*PL,t*MZ,1,a0,a0+Math.PI/2,3);}
  }
  const n=P.length,bas=new Float32Array(n*12),son=new Float32Array(n*12),uc=new Float32Array(n*4),yan=new Float32Array(n*4),idx=[];
  P.forEach(([x0,z0,x1,z1],i)=>{for(let k=0;k<4;k++){const j=(i*4+k)*3;bas[j]=x0;bas[j+1]=OKN.cizgi.y;bas[j+2]=z0;son[j]=x1;son[j+1]=OKN.cizgi.y;son[j+2]=z1;uc[i*4+k]=k>>1;yan[i*4+k]=k&1?-1:1;}
    const o=i*4;idx.push(o,o+1,o+2,o+2,o+1,o+3);});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(bas,3));g.setAttribute('son',new THREE.BufferAttribute(son,3));
  g.setAttribute('uc',new THREE.BufferAttribute(uc,1));g.setAttribute('yan',new THREE.BufferAttribute(yan,1));g.setIndex(idx);
  /* çizgi rengi: dokudaki çizgi (zemin kalitesiyle soluklaşır) × maç ışıklarının yatay yüzeye düşen ışığı (Lambert, js/goruntu.js ile aynı) */
  const I=STIL.isik,G=STAT.projektor.guc,q=0.45+0.55*STAT.zemin,isik=new THREE.Color(I.ortam.renk).multiplyScalar(I.ortam.guc*(0.6+0.4*G));
  for(const [L,k] of[[I.ana,I.ana.guc*G],[I.dolgu,I.dolgu.guc]].concat(I.kamera?[[I.kamera,I.kamera.guc]]:[])){const d=new THREE.Vector3(...L.konum).normalize();isik.add(new THREE.Color(L.renk).multiplyScalar(k*Math.max(0,d.y)));}
  const renk=new THREE.Color(STIL.saha.cimAcik).lerp(new THREE.Color(STIL.saha.cizgi),q).multiply(isik).multiplyScalar(OKN.cizgi.parlaklik);
  const m=new THREE.ShaderMaterial({uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{uRenk:{value:renk},uOpak:{value:OKN.cizgi.opak*q},uGen:{value:OKN.cizgi.genislik},uR:{value:new THREE.Vector2(MAC_RW,MAC_RH)}}]),
    fog:true,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,
    vertexShader:`attribute vec3 son;attribute float uc,yan;uniform float uGen;uniform vec2 uR;
      #include <fog_pars_vertex>
      void main(){vec4 a=projectionMatrix*modelViewMatrix*vec4(position,1.0),b=projectionMatrix*modelViewMatrix*vec4(son,1.0);
        if(a.w<0.5||b.w<0.5){gl_Position=vec4(0.0,0.0,2.0,1.0);return;}
        vec2 sa=a.xy/a.w*uR,sb=b.xy/b.w*uR,d=sb-sa;d=length(d)>1e-5?normalize(d):vec2(1.0,0.0);
        vec4 p=uc>0.5?b:a;p.xy+=vec2(-d.y,d.x)*yan*uGen/uR*p.w;gl_Position=p;
        vec4 mvPosition=modelViewMatrix*vec4(uc>0.5?son:position,1.0);
        #include <fog_vertex>
      }`,
    fragmentShader:`uniform vec3 uRenk;uniform float uOpak;
      #include <fog_pars_fragment>
      void main(){gl_FragColor=vec4(uRenk,uOpak);
        #include <fog_fragment>
      }`});
  const s=new THREE.Mesh(g,m);s.frustumCulled=false;s.visible=OKN.cizgi.acik;scene.add(s);return s;
})();
/* ---- havadaki topun altındaki koyu leke ---- */
const OKN_LEKE=(()=>{const m=new THREE.Mesh(new THREE.CircleGeometry(1,10),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:OKN.topLeke.opak,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));
  m.rotation.x=-Math.PI/2;m.renderOrder=1;m.visible=false;scene.add(m);return m;})();
/* ---- oyuncuların hafif ışıması: her aktör malzemesine bir kez (kare başına malzeme kurulmaz) ---- */
function oknMalzemeler(f){for(const a of AKTORLER)for(const m of[a.m,a.esofman])if(m&&m.mesh&&m.mesh.material)f(m.mesh.material);}
if(OKN.parlama>0)oknMalzemeler(M=>{if(M.map&&M.emissive){M.emissiveMap=M.map;M.emissive.setScalar(OKN.parlama);M.needsUpdate=true;}});
/* dış çizgi denemesi: oyuncu ve top pikselleri iç hedefin saydamlık kanalına işaret bırakır (0,5); son işlem komşuluğa bakar. İlk açılışta bir kez */
let OKN_DIS_KURULU=false;
function oknDisCizgiKur(){OKN_DIS_KURULU=true;
  const isaretle=M=>{const eski=M.onBeforeCompile,ad='okn-dis|'+(eski?String(eski):'');
    M.onBeforeCompile=(s,r)=>{if(eski)eski(s,r);s.fragmentShader=s.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\ngl_FragColor.a=0.5;');};
    M.customProgramCacheKey=()=>ad;M.needsUpdate=true;};
  oknMalzemeler(isaretle);isaretle(topMesh.material);}
/* ---- her kare: topun asgari boyu ve lekesi, dış çizgi ayarı ---- */
const OKN_TOP={sonY:NaN,tabanY:0};
function okunurlukKare(){
  const dis=!!OKN.disCizgi;if(dis&&!OKN_DIS_KURULU)oknDisCizgiKur();postMat.uniforms.uDis.value=dis?1:0;
  const t=topMesh,T=OKN_TOP;
  if(!t.visible){OKN_LEKE.visible=false;return;}
  /* topCiz konumu her kare yeniden yazar; yazmadıysa önceki kaldırmayı geri al */
  const y0=t.position.y===T.sonY?T.tabanY:t.position.y;
  const d=Math.max(1,camera.position.distanceTo(t.position)),px=2*TOP_R*(MAC_RH/2)/(d*Math.tan(camera.fov*Math.PI/360)),s=clamp(OKN.topEnAz/px,1,OKN.topEnCok);
  t.scale.setScalar(s);t.position.y=y0+TOP_R*(s-1);T.tabanY=y0;T.sonY=t.position.y;
  const h=y0-TOP_R;OKN_LEKE.visible=h>OKN.topLeke.yukseklik;
  if(OKN_LEKE.visible){OKN_LEKE.position.set(t.position.x,0.03,t.position.z);OKN_LEKE.scale.setScalar(TOP_R*s*OKN.topLeke.boy);}
}
