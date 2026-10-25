/* ===== prototipler/stat-konsept/gercekci.js — stat görsel hedefi: tek sahne, ulaşılabilir en iyi görüntü (2026-10-25) =====
   Oyun kodu değildir. Her şey kodla üretilir: dokular ve normal haritaları tuvalde noise ile, geometri ilkellerden. Fiziksel malzeme
   (MeshStandardMaterial), gökyüzü ortam haritası (PMREM), güneş gölgesi, SSAO, hafif bloom ve vinyet; eğik kamera.
   Adres: gercekci.html?w=2560&h=1920&asama=1&saat=aksam */
'use strict';
const Q=new URLSearchParams(location.search);
const RW=+(Q.get('w')||1920),RH=+(Q.get('h')||1440),ASAMA=Math.min(2,Math.max(0,+(Q.get('asama')||1))),SSAO_ACIK=Q.get('ssao')!=='0';
function rastgele(t){return function(){t|=0;t=t+0x6D2B79F5|0;let r=Math.imul(t^t>>>15,1|t);r=r+Math.imul(r^r>>>7,61|r)^r;return((r^r>>>14)>>>0)/4294967296;};}
const R=rastgele(4242),ara=(a,b)=>a+R()*(b-a),sec=L=>L[Math.floor(R()*L.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
function hash(i,j){let h=(i*374761393+j*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
function gurultu(x,y){const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return lerp(lerp(hash(i,j),hash(i+1,j),u),lerp(hash(i,j+1),hash(i+1,j+1),u),v);}
function fbm(x,y){return 0.53*gurultu(x,y)+0.27*gurultu(2*x+7.3,2*y+3.1)+0.13*gurultu(4*x+11.7,4*y+5.2)+0.07*gurultu(8*x+1.9,8*y+9.4);}
const smoothstep=(a,b,t)=>{t=clamp((t-a)/(b-a),0,1);return t*t*(3-2*t);};
/* ---- tuval ve doku yardımcıları ---- */
function tuval(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function doku(c,tekrar,sRGB){const t=new THREE.CanvasTexture(c);t.anisotropy=8;if(sRGB!==false)t.encoding=THREE.sRGBEncoding;if(tekrar){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(tekrar[0],tekrar[1]);}return t;}
/* noise karosu: tekrar eden gri gürültü (pattern olarak kullanılır) */
function gurultuKaro(n,olcek,tohum){const c=tuval(n,n),g=c.getContext('2d'),im=g.createImageData(n,n),d=im.data;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const v=fbm((x/n*olcek)+tohum*13.1,(y/n*olcek)+tohum*7.7)*255|0;const o=(y*n+x)*4;d[o]=d[o+1]=d[o+2]=v;d[o+3]=255;}
  g.putImageData(im,0,0);return c;}
/* yükseklik tuvalinden normal haritası */
function normalHaritasi(hc,guc){const n=hc.width,m=hc.height,g=hc.getContext('2d'),src=g.getImageData(0,0,n,m).data,c=tuval(n,m),gc=c.getContext('2d'),im=gc.createImageData(n,m),d=im.data;
  const h=(x,y)=>src[(((y+m)%m)*n+((x+n)%n))*4]/255;
  for(let y=0;y<m;y++)for(let x=0;x<n;x++){const dx=(h(x+1,y)-h(x-1,y))*guc,dy=(h(x,y+1)-h(x,y-1))*guc,l=Math.hypot(dx,dy,1);const o=(y*n+x)*4;d[o]=(-dx/l*0.5+0.5)*255;d[o+1]=(-dy/l*0.5+0.5)*255;d[o+2]=(1/l*0.5+0.5)*255;d[o+3]=255;}
  gc.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;}
function karistir(h1,h2,t){const a=new THREE.Color(h1),b=new THREE.Color(h2);return '#'+a.lerp(b,t).getHexString();}
const STD=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:0.9,metalness:0,envMapIntensity:0.55},o));
/* --- beton: gri taban + noise + lekeler --- */
function betonDoku(taban,koyu,tohum){const c=tuval(512,512),g=c.getContext('2d');g.fillStyle=taban;g.fillRect(0,0,512,512);
  g.globalAlpha=0.35;g.fillStyle=g.createPattern(gurultuKaro(256,6,tohum),'repeat');g.fillRect(0,0,512,512);g.globalAlpha=1;
  const r=rastgele(tohum*31+5);for(let i=0;i<40;i++){const x=r()*512,y=r()*512,rad=20+r()*90,gr=g.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,'rgba(40,36,30,'+(0.05+0.14*r()).toFixed(2)+')');gr.addColorStop(1,'rgba(40,36,30,0)');g.fillStyle=gr;g.fillRect(x-rad,y-rad,2*rad,2*rad);}
  if(koyu){g.fillStyle='rgba(0,0,0,0.12)';for(let i=0;i<300;i++){g.fillRect(r()*512,r()*512,2,2);}}
  return c;}
/* --- taş blok duvar: sıralı bloklar, derz, yükseklik → normal --- */
function tasBlokDoku(){const n=512,c=tuval(n,n),g=c.getContext('2d'),h=tuval(n,n),gh=h.getContext('2d');const r=rastgele(9);
  g.fillStyle='#6f6a60';g.fillRect(0,0,n,n);gh.fillStyle='#303030';gh.fillRect(0,0,n,n);
  const satir=8,bh=n/satir;for(let i=0;i<satir;i++){const kay=(i%2)*0.5;const bw=n/4;for(let j=-1;j<5;j++){const x=(j+kay)*bw,y=i*bh;const ton=118+r()*40;g.fillStyle=`rgb(${ton+8},${ton},${ton-14})`;g.fillRect(x+3,y+3,bw-6,bh-6);
      gh.fillStyle=`rgb(${200+r()*40|0},0,0)`;gh.fillRect(x+3,y+3,bw-6,bh-6);}}
  g.globalAlpha=0.3;g.fillStyle=g.createPattern(gurultuKaro(256,5,3),'repeat');g.fillRect(0,0,n,n);g.globalAlpha=1;
  gh.globalAlpha=0.35;gh.fillStyle=gh.createPattern(gurultuKaro(256,9,4),'repeat');gh.fillRect(0,0,n,n);
  return{renk:c,normal:normalHaritasi(h,1.6)};}
/* --- kaldırım: karo + derz --- */
function kaldirimDoku(){const n=512,c=tuval(n,n),g=c.getContext('2d'),h=tuval(n,n),gh=h.getContext('2d');const r=rastgele(12);
  g.fillStyle='#8c877b';g.fillRect(0,0,n,n);gh.fillStyle='#202020';gh.fillRect(0,0,n,n);
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){const t=146+r()*28;g.fillStyle=`rgb(${t},${t-4},${t-14})`;g.fillRect(j*128+3,i*128+3,122,122);gh.fillStyle='#d0d0d0';gh.fillRect(j*128+3,i*128+3,122,122);}
  g.globalAlpha=0.28;g.fillStyle=g.createPattern(gurultuKaro(256,7,5),'repeat');g.fillRect(0,0,n,n);g.globalAlpha=1;
  return{renk:c,normal:normalHaritasi(h,0.8)};}
/* --- çimen (çevre): yeşil noise --- */
function cayirDoku(){const n=512,c=tuval(n,n),g=c.getContext('2d');g.fillStyle='#5f7f33';g.fillRect(0,0,n,n);
  g.globalAlpha=0.5;g.fillStyle=g.createPattern(gurultuKaro(256,8,6),'repeat');g.globalCompositeOperation='multiply';g.fillRect(0,0,n,n);g.globalCompositeOperation='source-over';g.globalAlpha=1;
  g.globalAlpha=0.25;g.fillStyle='#a6a85a';g.fillStyle=g.createPattern(gurultuKaro(128,3,8),'repeat');g.globalCompositeOperation='screen';g.fillRect(0,0,n,n);g.globalCompositeOperation='source-over';g.globalAlpha=1;
  return c;}
/* --- dalga normal haritası --- */
function dalgaNormal(){const n=512,h=tuval(n,n),g=h.getContext('2d'),im=g.createImageData(n,n),d=im.data;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const u=x/n,v=y/n;let s=0;
    s+=Math.sin((u*9+v*3)*6.283+fbm(u*4,v*4)*3)*0.5;s+=Math.sin((u*2-v*7)*6.283+fbm(u*3+5,v*3+2)*2)*0.35;s+=(fbm(u*12,v*12)-0.5)*0.9;
    const val=clamp(128+s*60,0,255)|0;const o=(y*n+x)*4;d[o]=d[o+1]=d[o+2]=val;d[o+3]=255;}
  g.putImageData(im,0,0);return normalHaritasi(h,2.2);}
/* --- saha çimi: biçme şeritleri, ince doku, yıpranma, çizgiler --- */
const SAHA={x:52.5,z:34,pay:7.5};
function cimDoku(){const k=32,W=(SAHA.x+SAHA.pay)*2*k,H=(SAHA.z+SAHA.pay)*2*k,c=tuval(W,H),g=c.getContext('2d');
  const X=x=>(x+SAHA.x+SAHA.pay)*k,Z=z=>(z+SAHA.z+SAHA.pay)*k;
  const n=14,sw=W/n;for(let i=0;i<n;i++){g.fillStyle=i%2?'#4a8f3a':'#3f7f33';g.fillRect(i*sw,0,sw+1,H);}
  g.globalAlpha=0.42;g.globalCompositeOperation='multiply';g.fillStyle=g.createPattern(gurultuKaro(256,10,21),'repeat');g.fillRect(0,0,W,H);
  g.globalAlpha=0.18;g.globalCompositeOperation='screen';g.fillStyle=g.createPattern(gurultuKaro(128,2,22),'repeat');g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';g.globalAlpha=1;
  const yip=[0.6,0.32,0.12][ASAMA];
  const leke=(x,z,r,a)=>{const gr=g.createRadialGradient(X(x),Z(z),0,X(x),Z(z),r*k);gr.addColorStop(0,'rgba(128,104,52,'+a+')');gr.addColorStop(0.6,'rgba(128,104,52,'+(a*0.5).toFixed(2)+')');gr.addColorStop(1,'rgba(128,104,52,0)');g.fillStyle=gr;g.fillRect(X(x)-r*k,Z(z)-r*k,2*r*k,2*r*k);};
  leke(0,0,9,0.42*yip);leke(-48,0,8,0.5*yip);leke(48,0,8,0.5*yip);leke(-30,-9,6,0.22*yip);leke(28,11,6,0.22*yip);
  g.strokeStyle='#f4f4ee';g.lineWidth=0.12*k;g.lineJoin='round';
  const dik=(x0,z0,x1,z1)=>{g.strokeRect(X(x0),Z(z0),(x1-x0)*k,(z1-z0)*k);};
  dik(-52.5,-34,52.5,34);g.beginPath();g.moveTo(X(0),Z(-34));g.lineTo(X(0),Z(34));g.stroke();
  g.beginPath();g.arc(X(0),Z(0),9.15*k,0,7);g.stroke();g.fillStyle='#f4f4ee';g.beginPath();g.arc(X(0),Z(0),0.2*k,0,7);g.fill();
  for(const s of[-1,1]){const gx=s*52.5;dik(Math.min(gx,gx-s*16.5),-20.16,Math.max(gx,gx-s*16.5),20.16);dik(Math.min(gx,gx-s*5.5),-9.16,Math.max(gx,gx-s*5.5),9.16);
    g.beginPath();g.arc(X(gx-s*11),Z(0),0.2*k,0,7);g.fill();
    g.beginPath();g.arc(X(gx-s*11),Z(0),9.15*k,s>0?Math.PI-0.93:-0.93,s>0?Math.PI+0.93:0.93);g.stroke();
    for(const t of[-1,1]){g.beginPath();g.arc(X(gx),Z(t*34),1*k,0,7);g.stroke();}}
  return c;}
/* ---- sahne, kamera, ışık ---- */
const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
renderer.setSize(RW,RH,false);canvas.style.width='100vw';canvas.style.height='100vh';canvas.style.objectFit='contain';
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=0.92;
const scene=new THREE.Scene();scene.background=new THREE.Color('#1b4f78');
const camera=new THREE.PerspectiveCamera(+(Q.get('fov')||40),RW/RH,2,1600);
{const hedef=new THREE.Vector3(+(Q.get('hx')||-4),0,+(Q.get('hz')||10)),D=+(Q.get('uzak')||262),el=(+(Q.get('egim')||60))*Math.PI/180,az=(+(Q.get('azimut')||0))*Math.PI/180;
  camera.position.set(hedef.x+D*Math.sin(az)*Math.cos(el),hedef.y+D*Math.sin(el),hedef.z-D*Math.cos(az)*Math.cos(el));camera.lookAt(hedef);}
/* gökyüzü ortam haritası: gradyan + güneş */
{const sky=new THREE.Scene();const m=new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:{},vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'varying vec3 p;void main(){vec3 d=normalize(p);float t=clamp(d.y,0.0,1.0);vec3 c=mix(vec3(0.72,0.80,0.88),vec3(0.20,0.42,0.80),pow(t,0.55));vec3 s=normalize(vec3(0.55,0.62,0.45));float g=pow(max(dot(d,s),0.0),180.0)*6.0+pow(max(dot(d,s),0.0),6.0)*0.35;c+=vec3(1.0,0.92,0.75)*g;if(d.y<0.0)c=vec3(0.22,0.24,0.2);gl_FragColor=vec4(c,1.0);}'});
  sky.add(new THREE.Mesh(new THREE.SphereGeometry(500,32,16),m));const pm=new THREE.PMREMGenerator(renderer);pm.compileEquirectangularShader();scene.environment=pm.fromScene(sky,0.02).texture;}
const AKSAM=Q.get('saat')==='aksam';
const gun=new THREE.DirectionalLight(AKSAM?0xffcf98:0xfff0d6,AKSAM?2.1:1.9);if(AKSAM)gun.position.set(300,150,130);else gun.position.set(230,330,170);gun.castShadow=true;
{const sc=gun.shadow.camera;sc.left=-230;sc.right=230;sc.top=230;sc.bottom=-230;sc.near=10;sc.far=900;gun.shadow.mapSize.set(4096,4096);gun.shadow.bias=-0.00035;gun.shadow.normalBias=0.5;gun.shadow.radius=2.5;}
scene.add(gun);scene.add(gun.target);
scene.add(new THREE.HemisphereLight(AKSAM?0x9fb4d8:0xbfd8ff,AKSAM?0x7a6a48:0x6a7050,AKSAM?0.22:0.18));
/* ---- geometri yardımcıları ---- */
function kutu(w,h,d,mat,x,y,z,golge){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=golge!==false;m.receiveShadow=true;return m;}
function silindir(r1,r2,h,mat,x,y,z,n){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n||12),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m;}
function kiris(a,b,w,h,y,mat,golge){const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);const m=kutu(L,h,w,mat,(a[0]+b[0])/2,y+h/2,(a[1]+b[1])/2,golge);m.rotation.y=Math.atan2(-dz,dx);return m;}
function levha(P,y,mat){const g=new THREE.BufferGeometry();const v=[];const ters=((P[1][0]-P[0][0])*(P[2][1]-P[0][1])-(P[1][1]-P[0][1])*(P[2][0]-P[0][0]))>0;for(const i of(ters?[0,2,1,0,3,2]:[0,1,2,0,2,3]))v.push(P[i][0],y,P[i][1]);
  g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,0,1,1,0,1],2));g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;return m;}
function kutle(noktalar,derinlik,ust,mat,delikler){const s=new THREE.Shape(noktalar.map(p=>new THREE.Vector2(p[0],p[1])));
  if(delikler)for(const d of delikler)s.holes.push(new THREE.Path(d.map(p=>new THREE.Vector2(p[0],p[1]))));
  const g=new THREE.ExtrudeGeometry(s,{depth:derinlik,bevelEnabled:false});const m=new THREE.Mesh(g,mat);m.rotation.x=Math.PI/2;m.position.y=ust;m.castShadow=true;m.receiveShadow=true;return m;}
/* ---- ortak malzemeler ---- */
const TAS=tasBlokDoku(),KALD=kaldirimDoku();
const MAT={
  beton:STD({map:doku(betonDoku('#b4ada0',false,1),[1,1]),roughness:0.95}),
  betonKoyu:STD({map:doku(betonDoku('#8e887c',true,2),[1,1]),roughness:0.95}),
  celik:STD({color:0x5c6168,roughness:0.55,metalness:0.6}),
  celikAcik:STD({color:0x9aa0a6,roughness:0.5,metalness:0.6}),
  beyaz:STD({color:0xf2f2ee,roughness:0.6}),
  ahsap:STD({color:0x7a5a3a,roughness:0.85}),
  tas:STD({map:doku(TAS.renk,[1,1]),roughness:0.92}),
  kaldirim:STD({map:doku(KALD.renk,[1,1]),roughness:0.9}),
  cam:STD({color:0x9fc0d8,roughness:0.15,metalness:0.1,transparent:true,opacity:0.55}),
  kaya:[0x3e3a35,0x4a443e,0x33302c,0x554c42].map(c=>STD({color:c,roughness:1})),
  camYesil:[0x2f4a28,0x3a5a30,0x2a4224,0x456a38].map(c=>STD({color:c,roughness:0.9})),
  yaprak:[0x6f8f3e,0x7f9a48,0x5f8238].map(c=>STD({color:c,roughness:0.9})),
  govde:STD({color:0x4a3625,roughness:0.95})
};
/* ---- saha ---- */
function tanjantli(geo){geo.computeTangents();return geo;}
function sahaKur(){const cim=doku(cimDoku());const cimN=normalHaritasi(gurultuKaro(256,16,31),0.6);cimN.repeat.set(60,40);
  const m=new THREE.Mesh(tanjantli(new THREE.PlaneGeometry((SAHA.x+SAHA.pay)*2,(SAHA.z+SAHA.pay)*2)),STD({map:cim,normalMap:cimN,normalScale:new THREE.Vector2(0.35,0.35),roughness:0.88,vertexTangents:true}));
  m.rotation.x=-Math.PI/2;m.position.y=0.06;m.receiveShadow=true;scene.add(m);
  /* ağ dokusu */
  const ac=tuval(64,64),ag=ac.getContext('2d');ag.clearRect(0,0,64,64);ag.strokeStyle='rgba(255,255,255,0.9)';ag.lineWidth=1.2;for(let i=0;i<=64;i+=8){ag.beginPath();ag.moveTo(i,0);ag.lineTo(i,64);ag.stroke();ag.beginPath();ag.moveTo(0,i);ag.lineTo(64,i);ag.stroke();}
  const agM=new THREE.MeshStandardMaterial({map:doku(ac,[14,5]),transparent:true,side:THREE.DoubleSide,roughness:0.8,alphaTest:0.2});
  for(const s of[-1,1]){const gx=s*52.5,g=new THREE.Group();scene.add(g);
    for(const t of[-1,1])g.add(silindir(0.06,0.06,2.44,MAT.beyaz,gx,1.22,t*3.66,8));
    g.add(kutu(0.12,0.12,7.32,MAT.beyaz,gx,2.44,0));
    const d=2.2;const ust=new THREE.Mesh(new THREE.PlaneGeometry(d,7.32),agM);ust.rotation.x=-Math.PI/2;ust.rotation.z=Math.PI/2;ust.position.set(gx+s*d/2,2.35,0);g.add(ust);
    const arka=new THREE.Mesh(new THREE.PlaneGeometry(7.32,2.3),agM);arka.rotation.y=Math.PI/2;arka.position.set(gx+s*d,1.15,0);g.add(arka);
    for(const t of[-1,1]){const yan=new THREE.Mesh(new THREE.PlaneGeometry(d,2.3),agM);yan.position.set(gx+s*d/2,1.15,t*3.66);g.add(yan);}
    for(const t of[-1,1]){g.add(silindir(0.025,0.025,1.5,MAT.beyaz,gx,0.75,t*34,6));const b=kutu(0.45,0.3,0.02,STD({color:0xc8281e,side:THREE.DoubleSide}),gx+0.25,1.3,t*34,false);g.add(b);}}
  /* yedek kulübeleri: çelik çerçeve, pleksi çatı, koltuklar */
  const z=-SAHA.z-4.2;for(const s of[-1,1]){const g=new THREE.Group();g.position.set(s*10,0,z);scene.add(g);
    g.add(kutu(6,0.1,2,MAT.kaldirim,0,0.05,0,false));
    for(const x of[-2.9,2.9])for(const zz of[-0.9,0.9])g.add(kutu(0.1,2.1,0.1,MAT.celik,x,1.05,zz));
    g.add(kutu(6.2,0.08,2.1,MAT.cam,0,2.1,0,false));g.add(kutu(6.2,0.08,0.12,MAT.celik,0,2.14,-1,false));
    for(let i=0;i<7;i++){g.add(kutu(0.5,0.08,0.45,STD({color:0x24405a,roughness:0.6}),-2.6+i*0.85,0.5,0.2));g.add(kutu(0.5,0.45,0.08,STD({color:0x24405a,roughness:0.6}),-2.6+i*0.85,0.72,0.42));}}
  /* tünel ağzı */
  const T=A.tribunler.ana;scene.add(kutu(3.4,2.1,2.8,MAT.betonKoyu,-19,1.05,-SAHA.z-T.mesafe+1.4));scene.add(kutu(2.6,1.8,0.1,STD({color:0x15161a}),-19,0.9,-SAHA.z-T.mesafe+0.02));
}
/* ---- pullar: oyuncu pulları değil, 2D oyun için ölçek; burada gerçek görüntü hedefi olduğundan oyuncular küçük figürlerle (kutu gövde + baş) ---- */
function oyuncular(){const r2=rastgele(99),j=()=>(r2()*2-1)*2.2;
  const ev=[[-46,0],[-32,-14],[-30,-4],[-30,6],[-33,15],[-14,-10],[-16,2],[-10,11],[4,-17],[10,0],[2,16]];
  const dep=[[47,0],[33,-13],[31,-3],[31,7],[34,15],[20,-15],[21,-2],[18,8],[23,17],[6,6],[12,-6]];
  const kisi=(x,z,renk,sort)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=r2()*6.28;scene.add(g);
    const govde=kutu(0.42,0.5,0.24,STD({color:renk,roughness:0.8}),0,0.95,0);g.add(govde);g.add(kutu(0.38,0.3,0.22,STD({color:sort,roughness:0.8}),0,0.58,0));
    for(const s of[-1,1])g.add(kutu(0.12,0.45,0.12,STD({color:0xd9b58f,roughness:0.8}),s*0.1,0.22,0));
    const bas=new THREE.Mesh(new THREE.SphereGeometry(0.12,10,8),STD({color:0xc99a72,roughness:0.8}));bas.position.y=1.33;bas.castShadow=true;g.add(bas);};
  ev.forEach((p,i)=>kisi(p[0]+j(),p[1]+j(),i?0xc8281e:0x1f8a3f,0xf2ede2));dep.forEach((p,i)=>kisi(p[0]+j(),p[1]+j(),i?0x22347a:0x7a2a9a,0xeef0f3));
  kisi(8,-8,0x222222,0x222222);
  const top=new THREE.Mesh(new THREE.SphereGeometry(0.22,12,10),STD({color:0xffffff,roughness:0.5}));top.position.set(9.5,0.22,1.5);top.castShadow=true;scene.add(top);
}
/* ---- kademeler ---- */
const ASAMALAR=[
 {ad:'Bugün — 3. Lig',doluluk:0.42,direk:18,reklam:'seyrek',
  tribunler:{ana:{tip:'oturma',sira:8,mesafe:6.7,uzunluk:100,koltuk:['#b7b1a4','#b7b1a4','#c8281e']},karsi:{tip:'ayakta',sira:6,mesafe:5,uzunluk:96},
             kale1:{tip:'set',sira:4,mesafe:5.5,uzunluk:44},kale2:{tip:'ayakta',sira:4,mesafe:6,uzunluk:44}}},
 {ad:'1. Lig',doluluk:0.9,direk:30,reklam:'tam',
  tribunler:{ana:{tip:'oturma',sira:14,mesafe:6.7,uzunluk:104,koltuk:['#c8281e','#c8281e','#f2ede2'],cati:0},karsi:{tip:'oturma',sira:12,mesafe:5,uzunluk:104,koltuk:['#c8281e','#f2ede2','#c8281e'],cati:0.78},
             kale1:{tip:'oturma',sira:9,mesafe:5.5,uzunluk:60,koltuk:['#f2ede2','#c8281e','#f2ede2']},kale2:{tip:'ayakta',sira:9,mesafe:6,uzunluk:60}}},
 {ad:'Şampiyonlar Ligi düzeyi',doluluk:0.97,direk:44,reklam:'led',kose:true,
  tribunler:{ana:{tip:'oturma',sira:16,mesafe:6.7,uzunluk:96,koltuk:['#c8281e','#c8281e','#f2ede2'],cati:0.8,ust:{sira:12,koltuk:['#f2ede2','#c8281e','#f2ede2']}},
             karsi:{tip:'oturma',sira:16,mesafe:5,uzunluk:96,koltuk:['#c8281e','#f2ede2','#c8281e'],cati:0.8,ust:{sira:12,koltuk:['#c8281e','#c8281e','#f2ede2']}},
             kale1:{tip:'oturma',sira:16,mesafe:5.5,uzunluk:56,koltuk:['#f2ede2','#c8281e','#f2ede2'],cati:0.8,ust:{sira:12,koltuk:['#c8281e','#f2ede2','#c8281e']}},
             kale2:{tip:'oturma',sira:16,mesafe:6,uzunluk:56,koltuk:['#c8281e','#f2ede2','#c8281e'],cati:0.8,ust:{sira:12,koltuk:['#f2ede2','#c8281e','#f2ede2']}}}}
];
const A=ASAMALAR[ASAMA];
const SIRA={oturma:{d:0.8,h:0.42},ayakta:{d:0.55,h:0.3},set:{d:1.0,h:0.38}};
const SON=ASAMALAR[2],derinlikHesap=t=>0.6+t.sira*SIRA[t.tip].d+(t.ust?2.4+t.ust.sira*SIRA[t.tip].d:0)+1.5;
const STAT_DIS={x:52.5+SON.tribunler.kale1.mesafe+derinlikHesap(SON.tribunler.kale1),z:34+SON.tribunler.ana.mesafe+derinlikHesap(SON.tribunler.ana)};
const SIMDI_DIS={x:52.5+A.tribunler.kale1.mesafe+derinlikHesap(A.tribunler.kale1),z:34+A.tribunler.ana.mesafe+derinlikHesap(A.tribunler.ana)};
/* ---- tribünler: sıra kütleleri, koltuk ve seyirci örnekleri, korkuluk, çatı ---- */
const YARIM={ana:34,karsi:34,kale1:52.5,kale2:52.5};
function cerceve(yer,mesafe){const on=YARIM[yer]+mesafe;return{ana:{C:[0,-on],A:[-1,0],N:[0,-1]},karsi:{C:[0,on],A:[1,0],N:[0,1]},kale1:{C:[-on,0],A:[0,1],N:[-1,0]},kale2:{C:[on,0],A:[0,-1],N:[1,0]}}[yer];}
const KOLTUKLAR=[],KISILER=[];
const GIYSI_EV=['#c8281e','#c8281e','#c8281e','#b02018','#d83a2e','#f2ede2','#f2ede2','#e8e2d4','#2a2a2e','#3b3f48','#8a5a3a','#f2ede2','#c8281e'];
const GIYSI_DEP=['#22347a','#22347a','#1a2a66','#3a4a9a','#eef0f3','#2a2a2e','#444a55','#8a5a3a'];
const TEN=['#c99a72','#b07d58','#e2b995','#8a5c3c','#d9a982'],SAC=['#1f1a16','#3a2a1c','#6b4a2c','#2a2420','#a08060'];
function secH(L,j,i){return L[Math.floor(hash(j+11,i+5)*L.length)];}
function basamakMat(tip,L){if(tip==='set')return STD({map:doku(cayirDoku(),[L/6,1]),roughness:0.95});const c=tip==='ayakta'?betonDoku('#a39c8f',true,3):betonDoku('#b4ada0',false,1);return STD({map:doku(c,[L/8,0.2]),roughness:0.95});}
function tribunKur(T){
  const S=SIRA[T.tip],g=new THREE.Group();scene.add(g);const satir=[];let z=0;
  satir.push({z0:0,z1:0.6,top:1.0,duvar:true});z=0.6;const taban=1.0;
  for(let i=0;i<T.sira;i++){satir.push({z0:z,z1:z+S.d,top:taban+(i+1)*S.h,tip:T.tip,kat:0,i});z+=S.d;}
  const topAlt=taban+T.sira*S.h;
  if(T.ust){satir.push({z0:z,z1:z+2.4,top:topAlt,duvar:true,yol:true});z+=2.4;const t0=topAlt+2.6;
    for(let i=0;i<T.ust.sira;i++){satir.push({z0:z,z1:z+S.d,top:t0+(i+1)*S.h,tip:'oturma',kat:1,i,balkon:i===0});z+=S.d;}}
  T.derinlik=z;T.tepe=satir[satir.length-1].top;
  /* arka duvar ve yan duvarlar */
  g.add(kiris(T.P(z),T.Q(z),0.5,T.tepe+1.1,0,MAT.beton));
  if(!T.kose)for(const uc of[T.P,T.Q])g.add(kiris(uc(0.1),uc(z),0.5,T.tepe+0.6,0,MAT.beton));
  {const Pb=T.P(z+0.45),Qb=T.Q(z+0.45),L=Math.hypot(Qb[0]-Pb[0],Qb[1]-Pb[1]),n=Math.max(2,Math.round(L/6));
    for(let i=0;i<=n;i++){const t=i/n,p=[Pb[0]+(Qb[0]-Pb[0])*t,Pb[1]+(Qb[1]-Pb[1])*t];g.add(kutu(0.7,T.tepe+1.3,0.7,MAT.betonKoyu,p[0],(T.tepe+1.3)/2,p[1]));
      if(i%3===1){const q=[Pb[0]+(Qb[0]-Pb[0])*(t+0.5/n),Pb[1]+(Qb[1]-Pb[1])*(t+0.5/n)];g.add(kutu(2.4,2.6,0.5,STD({color:0x1b1c20,roughness:0.9}),q[0]+T.N[0]*0.1,1.3,q[1]+T.N[1]*0.1,false));}}
    g.add(kiris(T.P(z+0.5),T.Q(z+0.5),0.2,0.35,T.tepe*0.55,MAT.betonKoyu,false));}
  let onceki=0;
  for(const s of satir){const a0=T.P(s.z0),b0=T.Q(s.z0),a1=T.P(s.z1),b1=T.Q(s.z1),L=Math.hypot(b0[0]-a0[0],b0[1]-a0[1]);
    const mat=s.duvar?MAT.beton:basamakMat(s.tip,L);
    const ust=levha([a0,b0,b1,a1],s.top,mat);ust.castShadow=true;g.add(ust);
    g.add(kiris(a0,b0,0.16,s.top-onceki,onceki,s.balkon?MAT.betonKoyu:MAT.beton));
    if(s.balkon&&A.reklam==='led')panoSerit(T.P(s.z0-0.2),T.Q(s.z0-0.2),s.top-1.2,T.N,4,0.9);
    onceki=s.top;
    if(!s.tip)continue;
    const n=Math.floor(L/0.5),satirPay=s.kat?0.85:1-0.2*(s.i/T.sira);
    const koltukRenkler=s.kat?T.ust.koltuk:T.koltuk;
    for(let j=0;j<n;j++){const u=(j+0.5)/n-0.5,t=(j+0.5)/n,zc=(s.z0+s.z1)/2,P=T.P(zc),Qp=T.Q(zc);
      const x=P[0]+(Qp[0]-P[0])*t,zz=P[1]+(Qp[1]-P[1])*t;
      const dep=T.deplasman&&u>T.deplasman[0]&&u<T.deplasman[1];
      if(s.tip==='oturma'){/* koltuk rengi: bölümler (mozaik) */
        const blok=Math.floor((u+0.5)*koltukRenkler.length*1.0);let renk=koltukRenkler[Math.min(koltukRenkler.length-1,blok)];
        if(dep)renk='#2d3f8a';KOLTUKLAR.push({x,z:zz,y:s.top,renk,N:T.N});}
      let dolu=A.doluluk*(1.15-Math.abs(u)*0.5)*satirPay*(0.6+0.8*gurultu(u*6+s.i*0.2+T.tohum,s.i*0.35+T.tohum));
      if(T.deplasman&&!dep&&Math.min(Math.abs(u-T.deplasman[0]),Math.abs(u-T.deplasman[1]))<0.03)dolu=0;
      if(hash(j*7+s.i,s.kat*100+T.tohum)>dolu)continue;
      KISILER.push({x:x+(hash(j,s.i+9)-0.5)*0.1,z:zz+(hash(j+3,s.i)-0.5)*0.1,y:s.top,ayakta:s.tip!=='oturma',N:T.N,giysi:dep?secH(GIYSI_DEP,j,s.i):secH(GIYSI_EV,j,s.i),ten:secH(TEN,j+1,s.i),sac:secH(SAC,j+2,s.i)});}
  }
  /* ön korkuluk */
  g.add(kiris(T.P(-0.1),T.Q(-0.1),0.05,0.06,1.1,MAT.celikAcik,false));{const L=Math.hypot(T.Q(0)[0]-T.P(0)[0],T.Q(0)[1]-T.P(0)[1]),n=Math.round(L/2.5);for(let i=0;i<=n;i++){const t=i/n,p=[T.P(-0.1)[0]+(T.Q(-0.1)[0]-T.P(-0.1)[0])*t,T.P(-0.1)[1]+(T.Q(-0.1)[1]-T.P(-0.1)[1])*t];g.add(silindir(0.03,0.03,1.1,MAT.celikAcik,p[0],0.55,p[1],6));}}
  /* çatı: arkada kolonlar, eğik kirişler, trapez sac, ön alın ve projektör sırası */
  if(T.cati){const D=T.derinlik,zb=D+1.0,zf=D*(1-T.cati),yArka=T.tepe+6.5,yOn=T.tepe+4.2;
    const Pf=T.P(zf),Qf=T.Q(zf),Pb=T.P(zb),Qb=T.Q(zb),L=Math.hypot(Qf[0]-Pf[0],Qf[1]-Pf[1]);
    /* sac: dört köşeli eğik levha */
    const ters=((Qf[0]-Pf[0])*(Qb[1]-Pf[1])-(Qf[1]-Pf[1])*(Qb[0]-Pf[0]))>0,K=[[Pf[0],yOn,Pf[1]],[Qf[0],yOn,Qf[1]],[Qb[0],yArka,Qb[1]],[Pb[0],yArka,Pb[1]]],sg=new THREE.BufferGeometry(),v=[];for(const i of(ters?[0,2,1,0,3,2]:[0,1,2,0,2,3]))v.push(...K[i]);
    sg.setAttribute('position',new THREE.Float32BufferAttribute(v,3));sg.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,0,1,1,0,1],2));sg.computeVertexNormals();
    const olukC=tuval(64,64),og=olukC.getContext('2d');og.fillStyle='#c3c8cd';og.fillRect(0,0,64,64);for(let i=0;i<64;i+=8){og.fillStyle='#aeb3b8';og.fillRect(i,0,3,64);og.fillStyle='#d6dadd';og.fillRect(i+4,0,2,64);}
    const sac=new THREE.Mesh(sg,STD({map:doku(olukC,[L/1.2,1]),roughness:0.6,metalness:0.25,side:THREE.DoubleSide}));sac.castShadow=true;sac.receiveShadow=true;g.add(sac);
    const n=Math.max(2,Math.round(L/6));
    for(let i=0;i<=n;i++){const t=i/n,pf=[Pf[0]+(Qf[0]-Pf[0])*t,Pf[1]+(Qf[1]-Pf[1])*t],pb=[Pb[0]+(Qb[0]-Pb[0])*t,Pb[1]+(Qb[1]-Pb[1])*t];
      /* kolon ve eğik kiriş (kolon tepesinden öne, aşağı eğimli) */
      g.add(silindir(0.32,0.4,yArka,MAT.celik,pb[0],yArka/2,pb[1],10));
      const dx=pf[0]-pb[0],dz=pf[1]-pb[1],dl=Math.hypot(dx,dz),dy=yOn-yArka,len=Math.hypot(dl,dy);
      const k=kutu(len,0.5,0.35,MAT.celik,(pf[0]+pb[0])/2,(yOn+yArka)/2-0.3,(pf[1]+pb[1])/2);k.rotation.y=Math.atan2(-dz,dx);k.rotation.z=Math.atan2(dy,dl)*(dx>=0?1:-1);k.rotation.order='YZX';g.add(k);}
    g.add(kiris(Pf,Qf,0.35,1.0,yOn-1.0,STD({color:0x3a3e44,roughness:0.6,metalness:0.4})));
    g.add(kiris(Pb,Qb,0.5,0.6,yArka-0.2,MAT.celik));
    const nl=Math.round(L/4);for(let i=0;i<nl;i++){const t=(i+0.5)/nl;g.add(kutu(0.9,0.5,0.35,STD({color:0xe8e8e0,roughness:0.4,metalness:0.3}),Pf[0]+(Qf[0]-Pf[0])*t-T.N[0]*0.2,yOn-0.5,Pf[1]+(Qf[1]-Pf[1])*t-T.N[1]*0.2,false));}
  }
  return T;
}
function koltuklarKur(){if(!KOLTUKLAR.length)return;const gruplar={};for(const k of KOLTUKLAR)(gruplar[k.renk]=gruplar[k.renk]||[]).push(k);
  const M=new THREE.Matrix4(),E=new THREE.Euler(),P=new THREE.Vector3(),S=new THREE.Vector3(1,1,1),Qn=new THREE.Quaternion();
  for(const renk in gruplar){const L=gruplar[renk],mat=STD({color:renk,roughness:0.5});
    const oturak=new THREE.InstancedMesh(new THREE.BoxGeometry(0.44,0.06,0.42),mat,L.length),sirt=new THREE.InstancedMesh(new THREE.BoxGeometry(0.44,0.34,0.06),mat,L.length);
    L.forEach((k,i)=>{const yaw=Math.atan2(-k.N[0],-k.N[1]);E.set(0,yaw,0);Qn.setFromEuler(E);
      P.set(k.x+k.N[0]*0.12,k.y+0.4,k.z+k.N[1]*0.12);M.compose(P,Qn,S);oturak.setMatrixAt(i,M);
      P.set(k.x+k.N[0]*0.32,k.y+0.6,k.z+k.N[1]*0.32);M.compose(P,Qn,S);sirt.setMatrixAt(i,M);});
    oturak.castShadow=sirt.castShadow=true;oturak.receiveShadow=sirt.receiveShadow=true;scene.add(oturak);scene.add(sirt);}}
function kalabalikKur(){if(!KISILER.length)return;const n=KISILER.length;
  const govde=new THREE.InstancedMesh(new THREE.BoxGeometry(0.42,1,0.3),STD({color:0xffffff,roughness:0.85}),n),bas=new THREE.InstancedMesh(new THREE.SphereGeometry(0.12,8,6),STD({color:0xffffff,roughness:0.8}),n),sac=new THREE.InstancedMesh(new THREE.SphereGeometry(0.125,8,6),STD({color:0xffffff,roughness:0.9}),n);
  const M=new THREE.Matrix4(),c=new THREE.Color(),E=new THREE.Euler(),P=new THREE.Vector3(),S=new THREE.Vector3(),Qn=new THREE.Quaternion();
  KISILER.forEach((k,i)=>{const h=k.ayakta?1.05:0.62,yaw=Math.atan2(-k.N[0],-k.N[1])+(hash(i,3)-0.5)*0.5;E.set(0,yaw,0);Qn.setFromEuler(E);
    const y0=k.ayakta?k.y:k.y+0.42;P.set(k.x,y0+h/2,k.z);S.set(1,h,1);M.compose(P,Qn,S);govde.setMatrixAt(i,M);c.set(k.giysi);govde.setColorAt(i,c);
    P.set(k.x,y0+h+0.08,k.z);S.set(1,1,1);M.compose(P,Qn,S);bas.setMatrixAt(i,M);c.set(k.ten);bas.setColorAt(i,c);
    P.set(k.x-k.N[0]*0.02,y0+h+0.12,k.z-k.N[1]*0.02);S.set(1,0.75,1);M.compose(P,Qn,S);sac.setMatrixAt(i,M);c.set(k.sac);sac.setColorAt(i,c);});
  for(const m of[govde,bas,sac]){m.castShadow=true;m.receiveShadow=true;scene.add(m);}}
function tribunler(){const T=A.tribunler,cer={};for(const yer in T)cer[yer]=cerceve(yer,T[yer].mesafe);
  const uc=(F,Lx,z,s)=>[F.C[0]+F.N[0]*z+F.A[0]*s*Lx/2,F.C[1]+F.N[1]*z+F.A[1]*s*Lx/2];let tohum=0;
  for(const yer in T){const t=T[yer],F=cer[yer];const spec=Object.assign({},t,{yer,N:F.N,tohum:tohum++,P:z=>uc(F,t.uzunluk,z,-1),Q:z=>uc(F,t.uzunluk,z,1),deplasman:yer==='kale1'?[-0.2,0.2]:null});
    tribunKur(spec);t.derinlik=spec.derinlik;t.tepe=spec.tepe;}
  if(A.kose)for(const yan of['ana','karsi'])for(const kale of['kale1','kale2']){const ty=T[yan],tk=T[kale],Fy=cer[yan],Fk=cer[kale];const sx=kale==='kale1'?-1:1,ez=yan==='ana'?-1:1;
    const ucY=z=>{const a=uc(Fy,ty.uzunluk,z,-1),b=uc(Fy,ty.uzunluk,z,1);return Math.sign(a[0])===sx?a:b;};const ucK=z=>{const a=uc(Fk,tk.uzunluk,z,-1),b=uc(Fk,tk.uzunluk,z,1);return Math.sign(a[1])===ez?a:b;};
    tribunKur(Object.assign({},ty,{yer:'kose',kose:true,koltuk:tk.koltuk,N:[sx*0.707,ez*0.707],tohum:tohum++,P:ucY,Q:ucK,deplasman:null}));}
  koltuklarKur();kalabalikKur();}
/* ---- reklam panoları ---- */
const PANO_ADLAR=[['SÜT','#1d2d8a','#ffffff'],['BANKA','#c8281e','#ffffff'],['SİGORTA','#ffb530','#222222'],['LASTİK','#f2ede2','#1d1d1d'],['ENERJİ','#1f8a3f','#ffffff'],['TELEKOM','#222222','#ffb530'],['HAVAYOLU','#2a7fa6','#ffffff'],['BOYA','#7a2a9a','#ffffff'],['MOBİLYA','#8a5a3a','#ffffff'],['SU','#3fa3b8','#ffffff']];
const PANO_DOKU={};
function panoDoku(i){if(PANO_DOKU[i])return PANO_DOKU[i];const [ad,ar,yz]=PANO_ADLAR[i%PANO_ADLAR.length],c=tuval(1024,180),g=c.getContext('2d');
  g.fillStyle=ar;g.fillRect(0,0,1024,180);g.fillStyle=yz;g.beginPath();g.arc(110,90,52,0,7);g.fill();g.fillStyle=ar;g.beginPath();g.arc(110,90,28,0,7);g.fill();
  g.fillStyle=yz;g.font='bold 112px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(ad,600,96);return PANO_DOKU[i]=doku(c);}
function pano(a,b,y,N,i,h){const t=panoDoku(i),mat=STD({map:t,roughness:0.5}),H=h||1.0;
  const m=kiris(a,b,0.1,H,y,[MAT.celik,MAT.celik,MAT.celik,MAT.celik,mat,mat]);m.rotation.order='YXZ';const phi=m.rotation.y,zd=[Math.sin(phi),Math.cos(phi)],s=Math.sign(zd[0]*N[0]+zd[1]*N[1])||1;m.rotation.x=s*0.14;m.position.y=y+H/2*Math.cos(0.14)+0.02;scene.add(m);}
function panoSerit(a,b,y,N,baslangic,h){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/6));
  for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n;pano([a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0],[a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1],y,N,baslangic+i,h);}}
function panolar(){const mod=A.reklam,pay=2.8,boy=6,r2=rastgele(5);
  const kenar=[{N:[0,-1],z:-(34+pay)},{N:[0,1],z:34+pay},{N:[-1,0],x:-(52.5+pay)},{N:[1,0],x:52.5+pay}];let i=0;
  for(const k of kenar){const seg=[];
    if(k.z!==undefined){for(let x=-48;x<=48;x+=boy){if(k.z<0&&Math.abs(x)<4)continue;seg.push({c:x,a:[x-boy/2+0.1,k.z],b:[x+boy/2-0.1,k.z]});}}
    else{for(let z=-30;z<=30;z+=boy)seg.push({c:z,a:[k.x,z-boy/2+0.1],b:[k.x,z+boy/2-0.1]});}
    for(const s of seg){i++;if(mod==='seyrek'){if(k.x!==undefined)continue;const liste=k.z<0?[-42,-30,-18,24,36]:[-36,-12,12,30];if(!liste.includes(s.c))continue;}
      else if(mod==='tam'){if(r2()<0.06)continue;}
      pano(s.a,s.b,0,k.N,i);}}
}
/* ---- projektör direkleri: kafes gövde, lamba bankı ---- */
function projektor(x,z,h){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  const r0=1.2,r1=0.45;for(let k=0;k<3;k++){const a=k/3*Math.PI*2;const alt=[Math.cos(a)*r0,Math.sin(a)*r0],ust=[Math.cos(a)*r1,Math.sin(a)*r1];
    const dx=ust[0]-alt[0],dz=ust[1]-alt[1],len=Math.hypot(dx,dz,h);const m=silindir(0.09,0.12,len,MAT.celikAcik,(alt[0]+ust[0])/2,h/2,(alt[1]+ust[1])/2,6);
    m.lookAt(new THREE.Vector3(ust[0]+x,h,ust[1]+z));m.rotateX(Math.PI/2);g.add(m);}
  for(let y=2;y<h-1;y+=2.5){const rr=lerp(r0,r1,y/h);for(let k=0;k<3;k++){const a=k/3*Math.PI*2,b=(k+1)/3*Math.PI*2;g.add(kiris([Math.cos(a)*rr,Math.sin(a)*rr],[Math.cos(b)*rr,Math.sin(b)*rr],0.06,0.06,y,MAT.celikAcik,false));}}
  const kafa=new THREE.Group();kafa.position.y=h;kafa.rotation.y=Math.atan2(-x,-z);kafa.rotation.x=0.6;g.add(kafa);
  kafa.add(kutu(5.2,3.0,0.15,MAT.celik,0,1.4,0));for(let i=0;i<8;i++)for(let j=0;j<3;j++){const l=silindir(0.26,0.3,0.25,STD({color:0xe8e8e0,roughness:0.3,metalness:0.4}),-2.3+i*0.66,0.55+j*0.85,0.2,10);l.rotation.x=Math.PI/2;kafa.add(l);}
}
function projektorler(){const T=A.tribunler,dx=52.5+T.kale1.mesafe+T.kale1.derinlik+4,dz=34+T.ana.mesafe+T.ana.derinlik+4;for(const p of[[-dx,-dz],[dx,-dz],[-dx,dz],[dx,dz]])projektor(p[0],p[1],A.direk);}
/* ---- tabela ---- */
function tabela(){const T=A.tribunler.karsi,z=34+T.mesafe+T.derinlik+2.5,x=-22,c=tuval(1024,320),g=c.getContext('2d');g.fillStyle='#23262b';g.fillRect(0,0,1024,320);
  g.fillStyle='#f2ede2';g.font='bold 150px Arial';g.textAlign='center';g.fillText('1 - 0',512,185);g.font='bold 64px Arial';g.fillText("63'",512,280);
  for(const s of[-1,1])scene.add(silindir(0.2,0.25,7,MAT.celik,x+s*6,3.5,z,8));
  const m=kutu(13,4,0.3,[MAT.celik,MAT.celik,MAT.celik,MAT.celik,STD({map:doku(c),roughness:0.5}),STD({map:doku(c),roughness:0.5})],x,7.2,z);m.rotation.y=Math.PI;m.rotation.order='YXZ';m.rotation.x=-0.18;scene.add(m);}
/* ---- çevre: burun (yarımada) ---- */
function blobR(rx,rz,n,genlik,tohum){return th=>{const c=Math.abs(Math.cos(th)),s=Math.abs(Math.sin(th));const r=Math.pow(Math.pow(c/rx,n)+Math.pow(s/rz,n),-1/n);
  return r*(1+genlik*(0.6*Math.sin(3*th+tohum)+0.3*Math.sin(7*th+2*tohum)+0.15*Math.sin(13*th+3*tohum)+0.1*Math.sin(23*th+tohum)));};}
function sdBlob(x,z,B){const dx=x-B.c[0],dz=z-B.c[1];return Math.hypot(dx,dz)-B.r(Math.atan2(dz,dx));}
function sdKutu(x,z,cx,cz,hx,hz){const dx=Math.abs(x-cx)-hx,dz=Math.abs(z-cz)-hz;return Math.hypot(Math.max(dx,0),Math.max(dz,0))+Math.min(Math.max(dx,dz),0);}
function sdCizgi(x,z,a,b,w){const px=x-a[0],pz=z-a[1],bx=b[0]-a[0],bz=b[1]-a[1],t=clamp((px*bx+pz*bz)/(bx*bx+bz*bz||1),0,1);return Math.hypot(px-bx*t,pz-bz*t)-w;}
function sdYol(x,z,P,w){let d=1e9;for(let i=0;i+1<P.length;i++)d=Math.min(d,sdCizgi(x,z,P[i],P[i+1],w));return d;}
function blobCokgen(B,n){const P=[];for(let i=0;i<n;i++){const th=i/n*Math.PI*2,r=B.r(th);P.push([B.c[0]+Math.cos(th)*r,B.c[1]+Math.sin(th)*r]);}return P;}
const ZEMIN={w:420,h:340,px:6};
const BURUN=(()=>{const B={c:[0,6],r:blobR(106,88,3.4,0.045,1.7)},MEND=[[-94,54],[-124,64],[-134,86],[-122,106]],KOY={c:[124,-66],r:blobR(20,15,2.2,0.08,3)},neck={cx:0,cz:-125,hx:17,hz:60};
  function sd(x,z){let d=sdBlob(x,z,B);d=Math.min(d,sdKutu(x,z,neck.cx,neck.cz,neck.hx,neck.hz));d=Math.min(d,sdYol(x,z,MEND,3.6));d=Math.max(d,-sdBlob(x,z,KOY)-1);return d;}
  function korunakli(x,z){return (x<-80&&z>40&&z<120)||(z<-70&&Math.abs(x)<26);}
  return{B,MEND,KOY,neck,sd,korunakli};})();
/* deniz: renk haritası (derinlik, köpük) piksel piksel; normal haritası karo */
function denizKur(){const W=ZEMIN.w*ZEMIN.px,H=ZEMIN.h*ZEMIN.px,c=tuval(W,H),g=c.getContext('2d'),im=g.createImageData(W,H),d=im.data;
  const DERIN=[22,84,138],ORTA=[40,124,168],SIG=[86,176,190],KUMALTI=[160,184,160];
  for(let cy=0;cy<H;cy++){const z=(cy+0.5)/ZEMIN.px-ZEMIN.h/2;for(let cx=0;cx<W;cx++){const x=(cx+0.5)/ZEMIN.px-ZEMIN.w/2;const o=(cy*W+cx)*4;let dd=BURUN.sd(x,z);
    const koyda=sdBlob(x,z,BURUN.KOY)<12;if(koyda)dd*=0.4;const t=clamp(dd/40,0,1);let r,gg,b;
    if(t<0.25){const f=t/0.25;r=lerp(KUMALTI[0],SIG[0],f);gg=lerp(KUMALTI[1],SIG[1],f);b=lerp(KUMALTI[2],SIG[2],f);}else if(t<0.6){const f=(t-0.25)/0.35;r=lerp(SIG[0],ORTA[0],f);gg=lerp(SIG[1],ORTA[1],f);b=lerp(SIG[2],ORTA[2],f);}else{const f=(t-0.6)/0.4;r=lerp(ORTA[0],DERIN[0],f);gg=lerp(ORTA[1],DERIN[1],f);b=lerp(ORTA[2],DERIN[2],f);}
    const n=fbm(x*0.05,z*0.05);const kat=1+(n-0.5)*0.12;r*=kat;gg*=kat;b*=kat;
    const maruz=koyda?0.1:BURUN.korunakli(x,z)?0.25:clamp(0.45+0.55*((z+40)/120),0.3,1);
    if(dd>0&&dd<3){const f=(1-dd/3)*(0.25+0.75*gurultu(x*1.1,z*1.1))*(0.3+0.7*maruz);r=lerp(r,238,f);gg=lerp(gg,244,f);b=lerp(b,246,f);}
    else if(dd>=3&&dd<9&&maruz>0.3){const f=(1-(dd-3)/6)*Math.max(0,gurultu(x*0.8,z*0.8)-0.68)*2.2*maruz;r=lerp(r,232,f);gg=lerp(gg,240,f);b=lerp(b,242,f);}
    else if(dd>5){const u=x*0.055+z*0.02,v=z*0.16-x*0.05;const w=fbm(u,v),rid=Math.pow(1-Math.abs(2*w-1),5),w2=fbm(u*2.3+9,v*2.3+4),rid2=Math.pow(1-Math.abs(2*w2-1),7);const f=(rid*0.22+rid2*0.1)*(0.5+0.5*maruz);r=lerp(r,210,f);gg=lerp(gg,230,f);b=lerp(b,238,f);}
    d[o]=r;d[o+1]=gg;d[o+2]=b;d[o+3]=255;}}
  g.putImageData(im,0,0);
  const nm=dalgaNormal();nm.repeat.set(ZEMIN.w/9,ZEMIN.h/9);
  const m=new THREE.Mesh(tanjantli(new THREE.PlaneGeometry(ZEMIN.w,ZEMIN.h)),STD({map:doku(c),normalMap:nm,normalScale:new THREE.Vector2(0.7,0.7),roughness:0.5,metalness:0.0,envMapIntensity:0.3,vertexTangents:true}));
  m.rotation.x=-Math.PI/2;m.position.y=-2.4;m.receiveShadow=true;scene.add(m);
  const uzak=new THREE.Mesh(tanjantli(new THREE.PlaneGeometry(3000,3000,8,8)),STD({color:0x1a5a90,normalMap:nm,normalScale:new THREE.Vector2(0.7,0.7),roughness:0.5,envMapIntensity:0.3,vertexTangents:true}));uzak.rotation.x=-Math.PI/2;uzak.position.y=-2.6;scene.add(uzak);}
/* kara: yol temelli boyama (hızlı): çimen deseni, plaza (kaldırım), kıyı bandı taş; üstüne patikalar */
function desen(g,tile,metre){const pt=g.createPattern(tile,'repeat');const k=metre*ZEMIN.px/tile.width;pt.setTransform(new DOMMatrix().scale(k,k));return pt;}
function karaKur(){const W=ZEMIN.w*ZEMIN.px,H=ZEMIN.h*ZEMIN.px,c=tuval(W,H),g=c.getContext('2d'),X=x=>(x+ZEMIN.w/2)*ZEMIN.px,Z=z=>(z+ZEMIN.h/2)*ZEMIN.px,M=ZEMIN.px;
  const P=blobCokgen(BURUN.B,360);const yol=()=>{g.beginPath();g.moveTo(X(P[0][0]),Z(P[0][1]));for(const p of P)g.lineTo(X(p[0]),Z(p[1]));g.closePath();
    const n=BURUN.neck;g.rect(X(n.cx-n.hx),Z(n.cz-n.hz),2*n.hx*M,2*n.hz*M);};
  g.clearRect(0,0,W,H);
  /* kara: çimen */
  yol();g.fillStyle=desen(g,cayirDoku(),18);g.fill();
  /* kıyı bandı: taş (yol çevresine kalın çizgi) */
  yol();g.lineWidth=5*M;g.strokeStyle=desen(g,TAS.renk,9.6);g.stroke();
  /* koy: kum */
  {const K=blobCokgen(BURUN.KOY,80);g.beginPath();g.moveTo(X(K[0][0]),Z(K[0][1]));for(const p of K)g.lineTo(X(p[0]),Z(p[1]));g.closePath();g.save();g.clip();g.fillStyle='#d6c69a';g.fillRect(0,0,W,H);g.globalAlpha=0.3;g.fillStyle=desen(g,gurultuKaro(256,6,41),14);g.fillRect(0,0,W,H);g.restore();
    /* koyun suyu kara tuvalinde şeffaf kalır (deniz altta) */
    const K2=blobCokgen({c:BURUN.KOY.c,r:th=>BURUN.KOY.r(th)-3.5},80);g.save();g.beginPath();g.moveTo(X(K2[0][0]),Z(K2[0][1]));for(const p of K2)g.lineTo(X(p[0]),Z(p[1]));g.closePath();g.clip();g.clearRect(0,0,W,H);g.restore();}
  /* mendirek: taş */
  {g.save();g.lineCap='round';g.lineJoin='round';g.lineWidth=7.2*M;g.strokeStyle=desen(g,TAS.renk,9.6);g.beginPath();g.moveTo(X(BURUN.MEND[0][0]),Z(BURUN.MEND[0][1]));for(const p of BURUN.MEND)g.lineTo(X(p[0]),Z(p[1]));g.stroke();
    g.lineWidth=4.5*M;g.strokeStyle=desen(g,KALD.renk,4);g.stroke();g.restore();}
  /* plaza: bugünkü stadın çevresi + sahil gezinti yolu */
  g.save();yol();g.clip();g.fillStyle=desen(g,KALD.renk,2.4);g.fillRect(X(-SIMDI_DIS.x-6),Z(-SIMDI_DIS.z-6),(2*SIMDI_DIS.x+12)*M,(2*SIMDI_DIS.z+12)*M);
  yol();g.lineWidth=7*M;g.strokeStyle=desen(g,KALD.renk,2.4);g.stroke();
  /* patikalar ve yol */
  g.strokeStyle='#bdb49f';g.lineCap='round';g.lineWidth=4*M;const ciz=(a,b)=>{g.beginPath();g.moveTo(X(a[0]),Z(a[1]));g.lineTo(X(b[0]),Z(b[1]));g.stroke();};
  ciz([0,-SIMDI_DIS.z+2],[0,-STAT_DIS.z-14]);ciz([0,SIMDI_DIS.z-2],[0,STAT_DIS.z+14]);ciz([-SIMDI_DIS.x+2,0],[-STAT_DIS.x-14,0]);ciz([SIMDI_DIS.x-2,0],[STAT_DIS.x+14,0]);
  g.fillStyle='#55575a';g.fillRect(X(-4.5),Z(-200),9*M,(200-62)*M);g.strokeStyle='rgba(240,240,230,0.5)';g.setLineDash([2.5*M,2.5*M]);g.lineWidth=0.2*M;g.beginPath();g.moveTo(X(0),Z(-62));g.lineTo(X(0),Z(-200));g.stroke();g.setLineDash([]);
  g.restore();
  g.clearRect(X(-SAHA.x-SAHA.pay+0.3),Z(-SAHA.z-SAHA.pay+0.3),(2*SAHA.x+2*SAHA.pay-0.6)*M,(2*SAHA.z+2*SAHA.pay-0.6)*M);
  const t=doku(c);const m=new THREE.Mesh(new THREE.PlaneGeometry(ZEMIN.w,ZEMIN.h),STD({map:t,transparent:true,alphaTest:0.5,roughness:0.92}));m.rotation.x=-Math.PI/2;m.receiveShadow=true;scene.add(m);
  /* kara kütlesi: taş duvar yanlar */
  const tasYan=STD({map:doku(TAS.renk,[1,1]),roughness:0.92});tasYan.map.repeat.set(1/4,1/2.6);
  scene.add(kutle(P,2.5,-0.05,tasYan));scene.add(kutu(BURUN.neck.hx*2,2.5,BURUN.neck.hz*2,tasYan,BURUN.neck.cx,-1.3,BURUN.neck.cz));
  for(let i=0;i+1<BURUN.MEND.length;i++){scene.add(kiris(BURUN.MEND[i],BURUN.MEND[i+1],7.2,2.6,-2.65,tasYan));scene.add(silindir(3.6,3.6,2.6,tasYan,BURUN.MEND[i+1][0],-1.35,BURUN.MEND[i+1][1],14));}
}
/* kayalar: çentikli ikosahedron, kendi geometrisi */
function kaya(x,z,r,y,tohum){const g=new THREE.IcosahedronGeometry(1,2),p=g.attributes.position;const rr=rastgele(tohum);const sx=0.8+rr()*0.6,sz=0.8+rr()*0.6,sy=0.55+rr()*0.35;
  for(let i=0;i<p.count;i++){const v=new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i));const n=fbm(v.x*1.7+tohum,v.y*1.7+v.z*1.3)*0.8+0.6;v.multiplyScalar(n);p.setXYZ(i,v.x*sx,v.y*sy,v.z*sz);}
  g.computeVertexNormals();const m=new THREE.Mesh(g,MAT.kaya[tohum%4]);m.position.set(x,y,z);m.scale.setScalar(r);m.rotation.y=rr()*6.28;m.castShadow=true;m.receiveShadow=true;scene.add(m);}
function agacCam(x,z,b){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=R()*6.28;scene.add(g);const s=b||1;g.add(silindir(0.18*s,0.3*s,3*s,MAT.govde,0,1.5*s,0,7));
  const mat=sec(MAT.camYesil);for(let i=0;i<4;i++){const r=(2.6-i*0.55)*s,y=(2.4+i*1.7)*s;const k=new THREE.Mesh(new THREE.ConeGeometry(r,2.6*s,9),mat);k.position.y=y+1.3*s;k.rotation.y=i*0.4;k.castShadow=true;k.receiveShadow=true;g.add(k);}}
function agacYuvarlak(x,z,b){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const s=b||1;g.add(silindir(0.16*s,0.26*s,2.2*s,MAT.govde,0,1.1*s,0,7));
  const geo=new THREE.IcosahedronGeometry(2.2*s,2),p=geo.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i));v.multiplyScalar(0.85+fbm(v.x+x,v.z+z)*0.35);p.setXYZ(i,v.x,v.y*0.8,v.z);}geo.computeVertexNormals();
  const k=new THREE.Mesh(geo,sec(MAT.yaprak));k.position.y=3.4*s;k.castShadow=true;k.receiveShadow=true;g.add(k);}
function lambaDiregi(x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);g.add(silindir(0.07,0.11,6.5,MAT.celik,0,3.25,0,8));g.add(kutu(0.6,0.26,0.4,STD({color:0x3a3d42,roughness:0.5,metalness:0.5}),0,6.6,0,false));g.add(kutu(0.5,0.05,0.3,STD({color:0xfff2cc,roughness:0.3}),0,6.46,0,false));}
function fener(x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  g.add(silindir(4.4,4.8,1.6,MAT.tas,0,0.8,0,16));g.add(silindir(2.0,2.7,14,STD({color:0xf4f2ec,roughness:0.6}),0,8.6,0,20));g.add(silindir(2.36,2.5,2.4,STD({color:0xc8281e,roughness:0.6}),0,8.3,0,20));
  g.add(silindir(2.9,2.9,0.35,STD({color:0x3a3d42,roughness:0.5,metalness:0.5}),0,15.8,0,20));for(let i=0;i<14;i++){const a=i/14*6.28;g.add(silindir(0.04,0.04,1.1,MAT.celikAcik,Math.cos(a)*2.7,16.5,Math.sin(a)*2.7,5));}
  g.add(silindir(1.35,1.35,2.4,STD({color:0xd8eeff,roughness:0.1,metalness:0.2,transparent:true,opacity:0.7}),0,17.2,0,14));for(let i=0;i<6;i++){const a=i/6*6.28;g.add(silindir(0.05,0.05,2.4,MAT.celik,Math.cos(a)*1.36,17.2,Math.sin(a)*1.36,5));}
  const kap=new THREE.Mesh(new THREE.ConeGeometry(1.7,1.5,14),STD({color:0xc8281e,roughness:0.5}));kap.position.y=19.1;kap.castShadow=true;g.add(kap);
  for(let i=0;i<3;i++)g.add(kutu(0.7,0.9,0.1,STD({color:0x2a2f38}),0,4+i*4,-2.4,false));}
function tekne(x,z,aci,renk){const g=new THREE.Group();g.position.set(x,-2.0,z);g.rotation.y=aci;scene.add(g);
  const s=new THREE.Shape();s.moveTo(-3.2,0);s.quadraticCurveTo(-3.3,1.1,-1.5,1.2);s.lineTo(2.2,1.0);s.quadraticCurveTo(3.4,0.6,3.9,0);s.quadraticCurveTo(3.4,-0.6,2.2,-1.0);s.lineTo(-1.5,-1.2);s.quadraticCurveTo(-3.3,-1.1,-3.2,0);
  const hull=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:1.1,bevelEnabled:true,bevelThickness:0.3,bevelSize:0.3,bevelSegments:3}),STD({color:renk,roughness:0.5}));hull.rotation.x=-Math.PI/2;hull.position.y=0;hull.castShadow=true;hull.receiveShadow=true;g.add(hull);
  g.add(kutu(5.4,0.08,1.8,STD({color:0xd8cfb8,roughness:0.8}),-0.2,1.15,0,false));g.add(kutu(1.7,0.9,1.4,STD({color:0xf2ede2,roughness:0.6}),-1.5,1.65,0));g.add(kutu(1.5,0.3,1.2,STD({color:0x3a4048}),-1.5,2.2,0,false));
  g.add(silindir(0.06,0.08,6,MAT.govde,0.8,4.1,0,6));}
function cevreKur(){const B=BURUN.B;karaKur();denizKur();fener(BURUN.MEND[3][0],BURUN.MEND[3][1]);
  let kt=0;for(let i=0;i<70;i++){const th=i/70*Math.PI*2+ara(-0.03,0.03),r=B.r(th),x=B.c[0]+Math.cos(th)*r,z=B.c[1]+Math.sin(th)*r;if(BURUN.korunakli(x,z)||sdBlob(x,z,BURUN.KOY)<6||R()<0.25)continue;
    const n=2+Math.floor(R()*6);for(let j=0;j<n;j++){const d=ara(-1,7),yan=ara(-4,4);const px=x+Math.cos(th)*d-Math.sin(th)*yan,pz=z+Math.sin(th)*d+Math.cos(th)*yan;const boy=d<2?ara(1.6,3.4):ara(0.8,2.2);kaya(px,pz,boy,d<1?ara(-1.6,-0.6):ara(-2.6,-1.4),kt++);}}
  for(let i=0;i<24;i++){const t=ara(0,3),p=BURUN.MEND[Math.floor(t)],q=BURUN.MEND[Math.min(3,Math.floor(t)+1)],f=t-Math.floor(t);kaya(p[0]+(q[0]-p[0])*f-ara(3,6),p[1]+(q[1]-p[1])*f+ara(-2,2),ara(1,2.4),-2.0,kt++);}
  tekne(-112,84,ara(0,6),0x2e4f8a);tekne(-104,94,ara(0,6),0xd8d4c8);tekne(-116,98,ara(0,6),0xb33a2e);tekne(-99,72,ara(0,6),0xf2ede2);
  scene.add(kutu(2.2,0.3,16,MAT.ahsap,-97,0.1,80));for(let i=0;i<4;i++)scene.add(silindir(0.18,0.2,2.8,MAT.govde,-98,-1,73+i*4.5,6));
  for(let i=0;i<40;i++){const th=i/40*Math.PI*2,r=B.r(th)-7.5,x=B.c[0]+Math.cos(th)*r,z=B.c[1]+Math.sin(th)*r;if(Math.abs(x)<SIMDI_DIS.x+6&&Math.abs(z)<SIMDI_DIS.z+6)continue;lambaDiregi(x,z);}
  for(let i=0;i<14;i++)agacCam(ara(-14,14)+(i%2?23:-23),ara(-120,-66),ara(0.9,1.3));
  for(let i=0;i<12;i++){const th=ara(0.8,2.3),r=B.r(th)-ara(16,26),x=B.c[0]+Math.cos(th)*r,z=B.c[1]+Math.sin(th)*r;if(Math.abs(x)<SIMDI_DIS.x+8&&Math.abs(z)<SIMDI_DIS.z+8)continue;agacCam(x,z,ara(0.8,1.2));}
  for(let i=0;i<7;i++)agacCam(ara(98,126),ara(-52,-30),ara(0.7,1));
  for(let i=0;i<12;i++){const x=ara(-STAT_DIS.x-2,STAT_DIS.x+2),z=(i%2?1:-1)*ara(SIMDI_DIS.z+12,STAT_DIS.z+6);if(Math.abs(x)<SIMDI_DIS.x+7&&Math.abs(z)<SIMDI_DIS.z+7)continue;agacYuvarlak(x,z,ara(0.7,1.1));}
  for(const s of[-1,1])scene.add(kutu(0.6,1.2,118,MAT.tas,s*16.5,0.6,-125));
  /* park: plaza kenarında çit sırası, çimde çalı kümeleri */
  {const cit=STD({color:0x2f4f26,roughness:0.95});const hx=SIMDI_DIS.x+7,hz=SIMDI_DIS.z+7;
    for(const s of[-1,1]){scene.add(kutu(2*hx-16,0.9,0.8,cit,0,0.45,s*hz));scene.add(kutu(0.8,0.9,2*hz-16,cit,s*hx,0.45,0));}
    const r3=rastgele(77);for(let i=0;i<90;i++){const x=(r3()*2-1)*(STAT_DIS.x+18),z=(r3()*2-1)*(STAT_DIS.z+22);if((Math.abs(x)<hx+2&&Math.abs(z)<hz+2)||BURUN.sd(x,z)>-14||Math.abs(x)<5||Math.abs(z)<5)continue;
      const b=0.5+r3()*0.8,geo=new THREE.IcosahedronGeometry(1,1),pp=geo.attributes.position;for(let k=0;k<pp.count;k++){const v=new THREE.Vector3(pp.getX(k),pp.getY(k),pp.getZ(k));v.multiplyScalar(0.8+fbm(v.x*2+i,v.z*2)*0.5);pp.setXYZ(k,v.x*b*1.3,v.y*b*0.8,v.z*b*1.3);}geo.computeVertexNormals();
      const m=new THREE.Mesh(geo,sec(MAT.camYesil));m.position.set(x,b*0.6,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);}}
  /* bayrak direkleri (ana giriş) */
  for(let i=0;i<5;i++){const x=-12+i*6,z=-SIMDI_DIS.z-11;scene.add(silindir(0.06,0.08,9,MAT.celikAcik,x,4.5,z,6));const b=kutu(2.2,1.4,0.02,STD({color:i%2?0xc8281e:0xf2ede2,side:THREE.DoubleSide,roughness:0.8}),x+1.1,8.2,z,false);b.rotation.y=0.3;scene.add(b);}
}
/* ---- kurulum ve çizim ---- */
sahaKur();oyuncular();tribunler();projektorler();panolar();tabela();cevreKur();
document.getElementById('bilgi').textContent='Burun · '+A.ad+' — kalabalık '+KISILER.length+' kişi, koltuk '+KOLTUKLAR.length;
/* ---- sonrası-işleme (tarayıcıda, 2D tuvalde): derinlik karartması (SSAO yaklaşığı), hafif bloom, vinyet, renk; isteğe bağlı retro ızgara.
   Yazılım WebGL'de kare-tamponu (EffectComposer) yolunda normal haritalı yüzeyler satır satır bozulduğu için çizim doğrudan MSAA'lı tuvale, işleme piksel dizisinde. */
function kutuBulanik(src,W,H,r,out){const tmp=new Float32Array(W*H);const n=2*r+1;
  for(let y=0;y<H;y++){let s=0;const o=y*W;for(let i=-r;i<=r;i++)s+=src[o+Math.min(W-1,Math.max(0,i))];
    for(let x=0;x<W;x++){tmp[o+x]=s/n;const ekle=Math.min(W-1,x+r+1),cik=Math.max(0,x-r);s+=src[o+ekle]-src[o+cik];}}
  for(let x=0;x<W;x++){let s=0;for(let i=-r;i<=r;i++)s+=tmp[Math.min(H-1,Math.max(0,i))*W+x];
    for(let y=0;y<H;y++){out[y*W+x]=s/n;const ekle=Math.min(H-1,y+r+1),cik=Math.max(0,y-r);s+=tmp[ekle*W+x]-tmp[cik*W+x];}}
  return out;}
function gaussYaklasik(src,W,H,r){let a=new Float32Array(W*H),b=new Float32Array(W*H);kutuBulanik(src,W,H,r,a);kutuBulanik(a,W,H,r,b);kutuBulanik(b,W,H,r,a);return a;}
function sonIsle(){const W=RW,H=RH,N=W*H;
  const bc=tuval(W,H),bg=bc.getContext('2d');bg.drawImage(renderer.domElement,0,0);const B=bg.getImageData(0,0,W,H).data;
  /* derinlik */
  const rt=new THREE.WebGLRenderTarget(W,H),dm=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking});
  const arka=scene.background,tm=renderer.toneMapping,oe=renderer.outputEncoding;scene.overrideMaterial=dm;scene.background=new THREE.Color(0,0,0);renderer.shadowMap.enabled=false;renderer.toneMapping=THREE.NoToneMapping;renderer.outputEncoding=THREE.LinearEncoding;
  renderer.setRenderTarget(rt);renderer.render(scene,camera);const px=new Uint8Array(N*4);renderer.readRenderTargetPixels(rt,0,0,W,H,px);renderer.setRenderTarget(null);
  scene.overrideMaterial=null;scene.background=arka;renderer.shadowMap.enabled=true;renderer.toneMapping=tm;renderer.outputEncoding=oe;
  const Z=new Float32Array(N),near=camera.near,far=camera.far,TAVAN=700;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const o=((H-1-y)*W+x)*4;const z=Math.min(0.99999,(px[o+3]/255+px[o+2]/65280+px[o+1]/16711680+px[o]/4278190080)*255/256);
    Z[y*W+x]=Math.min(TAVAN,(near*far)/(far-z*(far-near)));}
  /* derinlik karartması */
  const ao=new Float32Array(N),k=W/1920;
  for(const [r,w,olcek] of[[2,0.35,0.9],[5,0.35,1.8],[12,0.2,3.2],[28,0.1,6.5]]){const bl=gaussYaklasik(Z,W,H,Math.max(1,Math.round(r*k)));for(let i=0;i<N;i++){const f=(Z[i]-bl[i])/olcek;ao[i]+=w*(f<0?0:f>1?1:f);}}
  const aoB=gaussYaklasik(ao,W,H,Math.max(1,Math.round(1.5*k)));
  /* bloom */
  const parR=new Float32Array(N),parG=new Float32Array(N),parB=new Float32Array(N);
  for(let i=0;i<N;i++){const r=B[i*4]/255,g=B[i*4+1]/255,b=B[i*4+2]/255,l=Math.max(r,g,b),t=Math.min(1,Math.max(0,(l-0.86)/0.14));parR[i]=r*t;parG[i]=g*t;parB[i]=b*t;}
  const rb=Math.round(16*k),blR=gaussYaklasik(parR,W,H,rb),blG=gaussYaklasik(parG,W,H,rb),blB=gaussYaklasik(parB,W,H,rb);
  /* birleştirme: ao, bloom, vinyet, kontrast, sıcaklık */
  const out=bg.createImageData(W,H),D=out.data,GUC=+(Q.get('ao')||0.55);
  for(let y=0;y<H;y++){const vy=(y-H/2)/(H/2);for(let x=0;x<W;x++){const i=y*W+x,o=i*4,vx=(x-W/2)/(W/2),d=Math.hypot(vx,vy),vt=Math.min(1,Math.max(0,(d-0.55)/0.9)),vin=1-Math.pow(vt,1.6)*0.22,kar=1-Math.min(1,aoB[i])*GUC;
    let r=(B[o]/255*kar+blR[i]*0.22)*vin,g=(B[o+1]/255*kar+blG[i]*0.22)*vin,b=(B[o+2]/255*kar+blB[i]*0.22)*vin;
    r=(r-0.5)*1.1+0.5;g=(g-0.5)*1.1+0.5;b=(b-0.5)*1.1+0.5;{const l=0.299*r+0.587*g+0.114*b;r=l+(r-l)*1.18;g=l+(g-l)*1.18;b=l+(b-l)*1.18;}r*=1.02;b*=0.96;
    D[o]=Math.min(255,Math.max(0,r*255));D[o+1]=Math.min(255,Math.max(0,g*255));D[o+2]=Math.min(255,Math.max(0,b*255));D[o+3]=255;}}
  bg.putImageData(out,0,0);
  const OW=1920,OH=1440,oc=document.createElement('canvas');oc.id='out';oc.width=OW;oc.height=OH;oc.style.cssText='position:fixed;left:0;top:0;width:'+OW+'px;height:'+OH+'px';document.body.appendChild(oc);const og=oc.getContext('2d');og.imageSmoothingQuality='high';
  if(Q.get('son')==='retro'){const kc=tuval(960,720),kg=kc.getContext('2d');kg.imageSmoothingQuality='high';kg.drawImage(bc,0,0,960,720);const id=kg.getImageData(0,0,960,720),P=id.data,BAY=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
    for(let y=0;y<720;y++)for(let x=0;x<960;x++){const o=(y*960+x)*4,t=(BAY[y&3][x&3]/16-0.5)*0.7;for(let c=0;c<3;c++){P[o+c]=Math.min(31,Math.max(0,Math.floor(P[o+c]/255*31+t+0.5)))/31*255;}}
    kg.putImageData(id,0,0);og.imageSmoothingEnabled=false;og.drawImage(kc,0,0,OW,OH);}
  else og.drawImage(bc,0,0,OW,OH);
  canvas.style.display='none';document.getElementById('bilgi').style.display='none';}
let kare=0;function ciz(){renderer.render(scene,camera);if(++kare===2){if(Q.get('post')!=='0')sonIsle();window.__hazir=true;}if(kare<2)requestAnimationFrame(ciz);}
requestAnimationFrame(ciz);
