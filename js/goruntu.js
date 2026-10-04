/* ============ Chairman — tek kare: PS1 / FIFA 99 dönemi görünümü (Three.js) ============ */
const $=id=>document.getElementById(id);
/* tek ızgara (2026-10-03, kullanıcı kararı: maçtaki görüntü kalitesi bütün oyunun standardıdır): oda, balkon ve maç 960×720 (RW×RH) */
const RW=STIL.ekran.genislik,RH=STIL.ekran.yukseklik;
const screenEl=$('screen'),canvas=$('view'),hud=$('hud'),hg=hud.getContext('2d');
let renderer=null;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:false,preserveDrawingBuffer:true});}catch(e){renderer=null;}
if(!renderer){screenEl.insertAdjacentHTML('beforeend','<p class="nogl">Bu cihazda 3B görüntü (WebGL) açılamadı.</p>');throw new Error('WebGL yok');}
renderer.setPixelRatio(1);renderer.setSize(RW,RH,false);hud.width=RW;hud.height=RH;renderer.autoClear=false;
/* her sahne ızgaranın ornekleme katı büyüklükte çizilir (rt, 1920×1440), son işlem her 2×2 bloğun ortalamasını alır; 15 bit renk ve
   titreme ızgaradadır. Doğrusal süzgeçle blok köşesinden tek örnek dört pikselin ortalamasıdır. Maç (js/arayuz.js frame) ile oda ve
   balkon (js/oda.js odaCiz) aynı hedefe çizer */
const EKRAN_ORNEK=Math.max(1,Math.round(STIL.ekran.ornekleme||1)),EKRAN_RT_AYAR={minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,generateMipmaps:false,stencilBuffer:true};
const rt=new THREE.WebGLRenderTarget(RW*EKRAN_ORNEK,RH*EKRAN_ORNEK,EKRAN_RT_AYAR);
const scene=new THREE.Scene();scene.fog=new THREE.Fog(STIL.sis.renk,STIL.sis.yakin,STIL.sis.uzak);
const camera=new THREE.PerspectiveCamera(30,4/3,0.3,1200);

/* ---- son işlem: 15 bit renk + 4x4 düzenli titreme (dönemin ekran kartları gibi) ----
   Tuval, ekrandaki boyunu karşılayan tam sayı katında (uK) çizilir: her iç piksel uK×uK düzgün bloktur; tarayıcı bunu ekrana yumuşak
   küçültür (keskin-çift doğrusal): pikseller eşit görünür, tam katta birebir. uDis: oyuncuların çevresinde koyu çizgi denemesi (okunurluk) */
const post=new THREE.Scene(),postCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const postMat=new THREE.ShaderMaterial({uniforms:{tD:{value:rt.texture},uDither:{value:STIL.ekran.titreme?STIL.ekran.titremeGucu:0},uLv:{value:Math.pow(2,STIL.ekran.renkBiti)-1},
  uK:{value:1},uR:{value:new THREE.Vector2(RW,RH)},uDis:{value:0}},depthTest:false,depthWrite:false,
  vertexShader:'void main(){gl_Position=vec4(position.xy,0.0,1.0);}',
  fragmentShader:`uniform sampler2D tD;uniform float uDither,uLv,uK,uDis;uniform vec2 uR;
  float b2(vec2 a){a=floor(a);return fract(dot(a,vec2(0.5,a.y*0.75)));}
  float b4(vec2 a){return b2(0.5*a)*0.25+b2(a);}
  void main(){vec2 q=floor(gl_FragCoord.xy/uK)+0.5,uv=q/uR;vec4 t=texture2D(tD,uv);vec3 c=t.rgb;
    if(uDis>0.5&&t.a>0.9){vec2 e=vec2(1.0/uR.x,0.0),f=vec2(0.0,1.0/uR.y);
      float m=min(min(texture2D(tD,uv+e).a,texture2D(tD,uv-e).a),min(texture2D(tD,uv+f).a,texture2D(tD,uv-f).a));if(m<0.9)c*=0.32;}
    float d=(b4(q)-0.47)*uDither;c=floor(c*uLv+0.5+d)/uLv;gl_FragColor=vec4(c,1.0);}`});
post.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),postMat));
/* tuvalin çizim katı: ekrandaki genişlik × aygıt piksel oranı / ızgara genişliği, yukarı yuvarlanır (1–4) */
let EKRAN_KAT=1;
function ekranKatGuncelle(){const r=canvas.getBoundingClientRect(),k=clamp(Math.ceil(r.width*(window.devicePixelRatio||1)/RW-0.02),1,4)||1;
  if(k!==EKRAN_KAT){EKRAN_KAT=k;renderer.setSize(RW*k,RH*k,false);postMat.uniforms.uK.value=k;}}
ekranKatGuncelle();addEventListener('resize',ekranKatGuncelle);
if(typeof ResizeObserver!=='undefined')new ResizeObserver(ekranKatGuncelle).observe(canvas);

/* ---- köşe titremesi: köşeler ekran piksellerine yapışır (PS1 hissi) ---- */
const SG='vec2('+(RW/2).toFixed(1)+','+(RH/2).toFixed(1)+')',SNAP='#include <project_vertex>\n{vec4 q=gl_Position;q.xy=floor(q.xy/q.w*'+SG+'+0.5)/'+SG+'*q.w;gl_Position=q;}';
function ps1(m){if(STIL.ekran.koseTitremesi)m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <project_vertex>',SNAP);};return m;}
const LAM=o=>ps1(new THREE.MeshLambertMaterial(o)),BAS=o=>ps1(new THREE.MeshBasicMaterial(o));
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function tx(cv,mode,rep){const t=new THREE.CanvasTexture(cv);
  if(mode==='n'){t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;}
  else if(mode==='m'){t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;}
  else t.anisotropy=renderer.capabilities.getMaxAnisotropy();   /* A akışı: uzaktaki saha çizgileri yatık açıda silinmesin */
  if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
/* birden çok kutuyu tek geometride birleştirir; her parçanın köşe rengi olur (varsayılan beyaz, örnek rengiyle çarpılır) */
function kutuBirlestir(parcalar){const pos=[],nor=[],col=[],idx=[];
  for(const p of parcalar){const g=new THREE.BoxGeometry(p.w,p.h,p.d);g.translate(p.x||0,p.y||0,p.z||0);const o=pos.length/3;
    pos.push(...g.attributes.position.array);nor.push(...g.attributes.normal.array);for(const i of g.index.array)idx.push(o+i);
    const c=p.renk||[1,1,1];for(let i=0;i<g.attributes.position.count;i++)col.push(c[0],c[1],c[2]);g.dispose();}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);return g;}
/* birden çok geometriyi (kutu dışındakiler de: çatı, koni, düzlem) tek geometride birleştirir; parça {g, m: Matrix4 (isteğe bağlı), renk: [r,g,b]}.
   Parçanın geometrisi dönüştürülüp bırakılır. Stadın çevresi (N8, js/stadyum-cevre.js) cephe başına tek çizimle kurulur */
function geoBirlestir(parcalar){const pos=[],nor=[],col=[],idx=[];
  for(const p of parcalar){const g=p.g;if(p.m)g.applyMatrix4(p.m);const P=g.attributes.position,N=g.attributes.normal,o=pos.length/3;
    for(let i=0;i<P.array.length;i++){pos.push(P.array[i]);nor.push(N.array[i]);}
    if(g.index)for(const i of g.index.array)idx.push(o+i);else for(let i=0;i<P.count;i++)idx.push(o+i);
    const c=p.renk||[1,1,1];for(let i=0;i<P.count;i++)col.push(c[0],c[1],c[2]);g.dispose();}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);return g;}
/* ekranda sabit kalınlıkta çizgi: gen ızgara pikseli (960×720'de). WebGL çizgisi tek iç piksel olduğundan örneklemeyle (2×) yarıya
   soluklaşır; bunun yerine her parça ekrana dik genişletilmiş dörtgen olur. geo: parça çiftleri (ör. EdgesGeometry) */
function kalinCizgi(geo,renk,gen){
  const a=geo.attributes.position.array,n=a.length/6,bas=new Float32Array(n*12),son=new Float32Array(n*12),uc=new Float32Array(n*4),yan=new Float32Array(n*4),idx=[];
  for(let i=0;i<n;i++){for(let k=0;k<4;k++){const j=(i*4+k)*3;for(let e=0;e<3;e++){bas[j+e]=a[i*6+e];son[j+e]=a[i*6+3+e];}uc[i*4+k]=k>>1;yan[i*4+k]=k&1?-1:1;}
    const o=i*4;idx.push(o,o+1,o+2,o+2,o+1,o+3);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(bas,3));g.setAttribute('son',new THREE.BufferAttribute(son,3));
  g.setAttribute('uc',new THREE.BufferAttribute(uc,1));g.setAttribute('yan',new THREE.BufferAttribute(yan,1));g.setIndex(idx);
  const m=new THREE.ShaderMaterial({uniforms:{uRenk:{value:new THREE.Color(renk)},uGen:{value:gen},uR:{value:new THREE.Vector2(RW,RH)}},
    vertexShader:`attribute vec3 son;attribute float uc,yan;uniform float uGen;uniform vec2 uR;
      void main(){vec4 a=projectionMatrix*modelViewMatrix*vec4(position,1.0),b=projectionMatrix*modelViewMatrix*vec4(son,1.0);
        vec2 d=b.xy/b.w*uR-a.xy/a.w*uR;d=length(d)>1e-5?normalize(d):vec2(1.0,0.0);
        vec4 p=uc>0.5?b:a;p.xy+=vec2(-d.y,d.x)*yan*uGen/uR*p.w;gl_Position=p;}`,
    fragmentShader:'uniform vec3 uRenk;void main(){gl_FragColor=vec4(uRenk,1.0);}'});
  const s=new THREE.Mesh(g,m);s.frustumCulled=false;return s;}
function box(w,h,d,m,x,y,z,parent){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);(parent||scene).add(b);return b;}
const GLOWT=(()=>{const cv=mk(32,32),g=cv.getContext('2d'),gr=g.createRadialGradient(16,16,0,16,16,16);
  gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.3,'rgba(255,255,255,0.45)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);return tx(cv,'l');})();
function glow(color,size,op){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOWT,color,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));s.scale.set(size,size,1);return s;}

/* ---- ışık ve gökyüzü ---- */
{const I=STIL.isik,G=STAT.projektor.guc;scene.add(new THREE.AmbientLight(I.ortam.renk,I.ortam.guc*(0.6+0.4*G)));
 const k1=new THREE.DirectionalLight(I.ana.renk,I.ana.guc*G);k1.position.set(...I.ana.konum);scene.add(k1);
 const k2=new THREE.DirectionalLight(I.dolgu.renk,I.dolgu.guc);k2.position.set(...I.dolgu.konum);scene.add(k2);}
{const g=new THREE.SphereGeometry(700,16,10),p=g.attributes.position,col=[];
 for(let i=0;i<p.count;i++){const t=clamp(p.getY(i)/700*2.4,0,1);const U=STIL.gokyuzu.ufuk,Q=STIL.gokyuzu.tepe;col.push(U[0]*(1-t)+Q[0]*t,U[1]*(1-t)+Q[1]*t,U[2]*(1-t)+Q[2]*t);}
 g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 scene.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false})));
 const sp=[];for(let i=0;i<320;i++){const a=rnd()*Math.PI*2,e=0.18+rnd()*1.2;sp.push(Math.cos(a)*Math.cos(e)*650,Math.sin(e)*650,Math.sin(a)*Math.cos(e)*650);}
 const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
 scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:STIL.gokyuzu.yildiz,size:EKRAN_ORNEK,sizeAttenuation:false,fog:false})));}
