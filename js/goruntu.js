/* ============ Demirkapı '99 — tek kare: PS1 / FIFA 99 dönemi görünümü (Three.js) ============ */
const $=id=>document.getElementById(id);
const RW=STIL.ekran.genislik,RH=STIL.ekran.yukseklik;
const screenEl=$('screen'),canvas=$('view'),hud=$('hud'),hg=hud.getContext('2d');
let renderer=null;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:false,preserveDrawingBuffer:true});}catch(e){renderer=null;}
if(!renderer){screenEl.insertAdjacentHTML('beforeend','<p class="nogl">Bu cihazda 3B görüntü (WebGL) açılamadı.</p>');throw new Error('WebGL yok');}
renderer.setPixelRatio(1);renderer.setSize(RW,RH,false);renderer.autoClear=false;
const rt=new THREE.WebGLRenderTarget(RW,RH,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter});
const scene=new THREE.Scene();scene.fog=new THREE.Fog(STIL.sis.renk,STIL.sis.yakin,STIL.sis.uzak);
const camera=new THREE.PerspectiveCamera(30,4/3,0.3,1200);

/* ---- son işlem: 15 bit renk + 4x4 düzenli titreme (dönemin ekran kartları gibi) ---- */
const post=new THREE.Scene(),postCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const postMat=new THREE.ShaderMaterial({uniforms:{tD:{value:rt.texture},uDither:{value:STIL.ekran.titreme?1:0},uLv:{value:Math.pow(2,STIL.ekran.renkBiti)-1}},depthTest:false,depthWrite:false,
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
  fragmentShader:`uniform sampler2D tD;uniform float uDither,uLv;varying vec2 vUv;
  float b2(vec2 a){a=floor(a);return fract(dot(a,vec2(0.5,a.y*0.75)));}
  float b4(vec2 a){return b2(0.5*a)*0.25+b2(a);}
  void main(){vec3 c=texture2D(tD,vUv).rgb;float d=(b4(gl_FragCoord.xy)-0.47)*uDither;c=floor(c*uLv+0.5+d)/uLv;gl_FragColor=vec4(c,1.0);}`});
post.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),postMat));

/* ---- köşe titremesi: köşeler ekran piksellerine yapışır (PS1 hissi) ---- */
const SG='vec2('+(RW/2).toFixed(1)+','+(RH/2).toFixed(1)+')',SNAP='#include <project_vertex>\n{vec4 q=gl_Position;q.xy=floor(q.xy/q.w*'+SG+'+0.5)/'+SG+'*q.w;gl_Position=q;}';
function ps1(m){if(STIL.ekran.koseTitremesi)m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <project_vertex>',SNAP);};return m;}
const LAM=o=>ps1(new THREE.MeshLambertMaterial(o)),BAS=o=>ps1(new THREE.MeshBasicMaterial(o));
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function tx(cv,mode,rep){const t=new THREE.CanvasTexture(cv);
  if(mode==='n'){t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;}
  else if(mode==='m'){t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;}
  else t.anisotropy=4;
  if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
function box(w,h,d,m,x,y,z,parent){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);(parent||scene).add(b);return b;}
const GLOWT=(()=>{const cv=mk(32,32),g=cv.getContext('2d'),gr=g.createRadialGradient(16,16,0,16,16,16);
  gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.3,'rgba(255,255,255,0.45)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);return tx(cv,'l');})();
function glow(color,size,op){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOWT,color,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));s.scale.set(size,size,1);return s;}

/* ---- ışık ve gökyüzü ---- */
{const I=STIL.isik;scene.add(new THREE.AmbientLight(I.ortam.renk,I.ortam.guc));
 const k1=new THREE.DirectionalLight(I.ana.renk,I.ana.guc);k1.position.set(...I.ana.konum);scene.add(k1);
 const k2=new THREE.DirectionalLight(I.dolgu.renk,I.dolgu.guc);k2.position.set(...I.dolgu.konum);scene.add(k2);}
{const g=new THREE.SphereGeometry(700,16,10),p=g.attributes.position,col=[];
 for(let i=0;i<p.count;i++){const t=clamp(p.getY(i)/700*2.4,0,1);const U=STIL.gokyuzu.ufuk,Q=STIL.gokyuzu.tepe;col.push(U[0]*(1-t)+Q[0]*t,U[1]*(1-t)+Q[1]*t,U[2]*(1-t)+Q[2]*t);}
 g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 scene.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false})));
 const sp=[];for(let i=0;i<320;i++){const a=rnd()*Math.PI*2,e=0.18+rnd()*1.2;sp.push(Math.cos(a)*Math.cos(e)*650,Math.sin(e)*650,Math.sin(a)*Math.cos(e)*650);}
 const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
 scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:STIL.gokyuzu.yildiz,size:1,sizeAttenuation:false,fog:false})));}
