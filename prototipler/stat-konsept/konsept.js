/* ===== prototipler/stat-konsept/konsept.js — maç izleme sahnesi için stat + çevre görsel denemeleri (2026-10-25) =====
   Oyun kodu değildir; yalnız görsel deneme. Her şey kodla üretilir (harici model, doku, fotoğraf yok). Adres parametreleri:
     k=1..4      konsept (1 burun/deniz, 2 kaya çanağı, 3 nehir adası, 4 sur içi)
     asama=0..2  tribün gelişim kademesi (0 bugün 3. Lig, 1 1. Lig, 2 Şampiyonlar Ligi düzeyi)
     gece=1      gece, projektörler yanar
     E=…         ekranda görünen dikey uzunluk (m; konseptin kendi değeri); yuk=240 kamera yüksekliği (m); cz kamera merkezinin z'si
   Eksenler oyundaki gibi: x saha boyu, z saha eni; ana tribün −z'de ve ekranın altında, kameranın üstü dünya +z (js/kamera.js tepeKamera;
   bu yüzden +x ekranın SOLUDUR, locadan bakışla aynı sol–sağ). */
'use strict';
const Q=new URLSearchParams(location.search);
const KONSEPT=Math.min(4,Math.max(1,+(Q.get('k')||1))),ASAMA_NO=Math.min(2,Math.max(0,+(Q.get('asama')||0))),GECE=Q.get('gece')==='1';
const RW=+(Q.get('w')||1920),RH=+(Q.get('h')||1440),YUK=+(Q.get('yuk')||240),MERKEZ_Z=+(Q.get('cz')||0);
function rastgele(t){return function(){t|=0;t=t+0x6D2B79F5|0;let r=Math.imul(t^t>>>15,1|t);r=r+Math.imul(r^r>>>7,61|r)^r;return((r^r>>>14)>>>0)/4294967296;};}
const R=rastgele(1234+KONSEPT*7);
const ara=(a,b)=>a+R()*(b-a),sec=L=>L[Math.floor(R()*L.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
function hash(i,j){let h=(i*374761393+j*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
function gurultu(x,y){const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return lerp(lerp(hash(i,j),hash(i+1,j),u),lerp(hash(i,j+1),hash(i+1,j+1),u),v);}
function fbm(x,y){return 0.53*gurultu(x,y)+0.27*gurultu(2*x+7.3,2*y+3.1)+0.13*gurultu(4*x+11.7,4*y+5.2)+0.07*gurultu(8*x+1.9,8*y+9.4);}
function karistir(h1,h2,t){const a=new THREE.Color(h1),b=new THREE.Color(h2);return '#'+a.lerp(b,t).getHexString();}
const hexRgb=h=>{const c=new THREE.Color(h);return[c.r*255,c.g*255,c.b*255];};
/* ---- renkler (STIL ile uyumlu; STIL burada yüklü değil) ---- */
const RENK={
  cimK:'#2f7a2a',cimA:'#3a8c33',cizgi:'#f2f2ea',ev:'#c8281e',evSus:'#f2ede2',dep:'#22347a',depSus:'#eef0f3',
  beton:'#b8b2a4',betonKoyu:'#9e988a',basamak:'#a7a195',setCim:'#7d8c4c',toprak:'#8d7a5a',
  cati:'#aeb8c4',catiKiris:'#5e656d',direk:'#6a6e74',lamba:'#fff2cc',cam:'#3f5a32',camAcik:'#4f6f3c',govde:'#5a4232',
  kaya:['#a39a8a','#958c7c','#b0a796','#8a8272','#9c9080'],cali:'#6c7a40',kavak:'#5d7a3c',zeytin:'#7f8c5a',sogut:'#8aa05a',
  rihtim:'#b7b0a0',kum:'#d9c9a0',plaza:'#c9c2b2',cakil:'#b3ab98',asfalt:'#5e5e60',cayir:'#8da45a',cayirKoyu:'#7a9148',
  surTas:'#a89f8c',surUst:'#bdb4a0',ahsap:'#8a6a44'
};
const DENIZ=[[22,63,102],[29,90,134],[42,127,166],[70,168,186]];
/* ---- gelişim kademeleri (ortak tarif modelinin genişlemesi: sıra, üst kat, çatı payı, köşeler, projektör, reklam katmanı) ---- */
const ASAMALAR=[
 {ad:'Bugün — 3. Lig',doluluk:0.3,direk:17,reklam:'seyrek',tabela:'elle',
  tribunler:{ana:{tip:'oturma',sira:8,mesafe:6.7,uzunluk:100,koltuk:'#b8b2a4'},karsi:{tip:'ayakta',sira:6,mesafe:5,uzunluk:96},
             kale1:{tip:'set',sira:4,mesafe:5.5,uzunluk:44},kale2:{tip:'ayakta',sira:4,mesafe:6,uzunluk:44}}},
 {ad:'1. Lig',doluluk:0.66,direk:30,reklam:'tam',tabela:'elle',
  tribunler:{ana:{tip:'oturma',sira:14,mesafe:6.7,uzunluk:104,koltuk:'#c8281e',cati:0.6},karsi:{tip:'oturma',sira:12,mesafe:5,uzunluk:104,koltuk:'#c8281e',cati:0.5},
             kale1:{tip:'oturma',sira:8,mesafe:5.5,uzunluk:60,koltuk:'#f2ede2'},kale2:{tip:'ayakta',sira:9,mesafe:6,uzunluk:60}}},
 {ad:'Şampiyonlar Ligi düzeyi',doluluk:0.96,direk:44,reklam:'led',tabela:'ekran',kose:true,catiIsik:true,
  tribunler:{ana:{tip:'oturma',sira:16,mesafe:6.7,uzunluk:96,koltuk:'#c8281e',cati:0.8,ust:{sira:12,koltuk:'#f2ede2'}},
             karsi:{tip:'oturma',sira:16,mesafe:5,uzunluk:96,koltuk:'#c8281e',cati:0.8,ust:{sira:12,koltuk:'#c8281e'}},
             kale1:{tip:'oturma',sira:16,mesafe:5.5,uzunluk:56,koltuk:'#f2ede2',cati:0.8,ust:{sira:12,koltuk:'#c8281e'}},
             kale2:{tip:'oturma',sira:16,mesafe:6,uzunluk:56,koltuk:'#c8281e',cati:0.8,ust:{sira:12,koltuk:'#f2ede2'}}}}
];
const A=ASAMALAR[ASAMA_NO];
const SIRA={oturma:{d:0.8,h:0.42},ayakta:{d:0.55,h:0.3},set:{d:1.0,h:0.38}};
/* stadın dış sınırı (son kademedeki ayak izi; çevre tarifi buna göre yer bırakır) */
const SON=ASAMALAR[2],sonDerinlik=t=>0.6+t.sira*SIRA[t.tip].d+(t.ust?2.4+t.ust.sira*SIRA[t.tip].d:0)+1.5;
const STAT_DIS={x:52.5+SON.tribunler.kale1.mesafe+sonDerinlik(SON.tribunler.kale1),z:34+SON.tribunler.ana.mesafe+sonDerinlik(SON.tribunler.ana)};
/* bugünkü kademenin ayak izi: plaza ve yollar buna göre; kalan rezerv alan çimen/çakıl kalır ("stat kendi arsasına büyür") */
const SIMDI_DIS={x:52.5+A.tribunler.kale1.mesafe+sonDerinlik(A.tribunler.kale1),z:34+A.tribunler.ana.mesafe+sonDerinlik(A.tribunler.ana)};
const smoothstep=(a,b,t)=>{t=clamp((t-a)/(b-a),0,1);return t*t*(3-2*t);};
/* ---- sahne ---- */
const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
renderer.setSize(RW,RH,false);canvas.style.width='100vw';canvas.style.height='100vh';canvas.style.objectFit='contain';
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
const LAM=o=>new THREE.MeshLambertMaterial(o);
const MAT={beton:LAM({color:RENK.beton}),betonK:LAM({color:RENK.betonKoyu}),direk:LAM({color:RENK.direk}),govde:LAM({color:RENK.govde}),
  rihtim:LAM({color:RENK.rihtim}),ahsap:LAM({color:RENK.ahsap}),beyaz:LAM({color:0xf4f4f0}),kiris:LAM({color:RENK.catiKiris}),basamakYuz:LAM({color:0x8e887a})};
function isiklar(){
  if(!GECE){
    scene.add(new THREE.HemisphereLight(0xcfe3ff,0x6b7a50,0.55));
    const gun=new THREE.DirectionalLight(0xfff0d8,1.0);gun.position.set(130,190,110);gun.castShadow=true;
    const sc=gun.shadow.camera;sc.left=-210;sc.right=210;sc.top=210;sc.bottom=-210;sc.near=1;sc.far=700;
    gun.shadow.mapSize.set(4096,4096);gun.shadow.bias=-0.0006;gun.shadow.normalBias=0.6;gun.shadow.radius=2;scene.add(gun);scene.add(gun.target);
  }else{
    scene.add(new THREE.HemisphereLight(0x2c3a58,0x0c1014,0.2));
    const ay=new THREE.DirectionalLight(0x8aa0d0,0.1);ay.position.set(-100,160,-60);scene.add(ay);
  }
}
/* ---- doku ve geometri yardımcıları ---- */
function tuval(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function doku(c,tekrar){const t=new THREE.CanvasTexture(c);t.anisotropy=4;if(tekrar){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(tekrar[0],tekrar[1]);}return t;}
function kutu(w,h,d,mat,x,y,z,golge){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=golge!==false;m.receiveShadow=true;return m;}
function silindir(r1,r2,h,mat,x,y,z,n){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n||10),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m;}
/* a→b arasına yatay kiriş (w: kalınlık, h: yükseklik; y: taban) */
function kiris(a,b,w,h,y,mat,golge){const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);const m=kutu(L,h,w,mat,(a[0]+b[0])/2,y+h/2,(a[1]+b[1])/2,golge);m.rotation.y=Math.atan2(-dz,dx);return m;}
/* dört köşeli yatay levha (xz'de p0..p3, y yükseklik; uv: p0→p1 u, p0→p3 v) */
function levha(P,y,mat){const g=new THREE.BufferGeometry();const v=[];for(const i of[0,1,2,0,2,3])v.push(P[i][0],y,P[i][1]);
  g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,0,1,1,0,1],2));g.computeVertexNormals();
  const m=new THREE.Mesh(g,mat);m.receiveShadow=true;return m;}
/* xz çokgeninden aşağı doğru (derinlik) kütle; üst yüzü y=ust */
function kutle(noktalar,derinlik,ust,mat,delikler){const s=new THREE.Shape(noktalar.map(p=>new THREE.Vector2(p[0],p[1])));
  if(delikler)for(const d of delikler)s.holes.push(new THREE.Path(d.map(p=>new THREE.Vector2(p[0],p[1]))));
  const g=new THREE.ExtrudeGeometry(s,{depth:derinlik,bevelEnabled:false});const m=new THREE.Mesh(g,mat);m.rotation.x=Math.PI/2;m.position.y=ust;m.castShadow=true;m.receiveShadow=true;return m;}
/* ---- saha ---- */
const SAHA={x:52.5,z:34,pay:7};
function sahaDoku(){const k=20,W=(SAHA.x+SAHA.pay)*2*k,H=(SAHA.z+SAHA.pay)*2*k,c=tuval(W,H),g=c.getContext('2d');
  const X=x=>(x+SAHA.x+SAHA.pay)*k,Z=z=>(z+SAHA.z+SAHA.pay)*k;
  const n=14,sw=W/n;for(let i=0;i<n;i++){g.fillStyle=i%2?RENK.cimA:RENK.cimK;g.fillRect(i*sw,0,sw+1,H);}
  const yip=[0.7,0.35,0.1][ASAMA_NO];
  const leke=(x,z,r,a)=>{const gr=g.createRadialGradient(X(x),Z(z),0,X(x),Z(z),r*k);gr.addColorStop(0,'rgba(132,110,60,'+a+')');gr.addColorStop(1,'rgba(132,110,60,0)');g.fillStyle=gr;g.fillRect(X(x)-r*k,Z(z)-r*k,2*r*k,2*r*k);};
  leke(0,0,10,0.5*yip);leke(-48,0,9,0.6*yip);leke(48,0,9,0.6*yip);leke(-28,-10,7,0.3*yip);leke(26,12,7,0.3*yip);
  const r2=rastgele(77);for(let i=0;i<2600*yip;i++){const x=(r2()*2-1)*SAHA.x,z=(r2()*2-1)*SAHA.z;g.fillStyle='rgba(120,100,55,'+(0.08+0.2*r2()).toFixed(2)+')';g.beginPath();g.arc(X(x),Z(z),(0.3+r2()*1.2)*k,0,7);g.fill();}
  g.strokeStyle=RENK.cizgi;g.lineWidth=0.14*k;
  const dik=(x0,z0,x1,z1)=>{g.strokeRect(X(x0),Z(z0),(x1-x0)*k,(z1-z0)*k);};
  dik(-52.5,-34,52.5,34);g.beginPath();g.moveTo(X(0),Z(-34));g.lineTo(X(0),Z(34));g.stroke();
  g.beginPath();g.arc(X(0),Z(0),9.15*k,0,7);g.stroke();g.fillStyle=RENK.cizgi;g.beginPath();g.arc(X(0),Z(0),0.25*k,0,7);g.fill();
  for(const s of[-1,1]){const gx=s*52.5;dik(Math.min(gx,gx-s*16.5),-20.16,Math.max(gx,gx-s*16.5),20.16);dik(Math.min(gx,gx-s*5.5),-9.16,Math.max(gx,gx-s*5.5),9.16);
    g.beginPath();g.arc(X(gx-s*11),Z(0),0.25*k,0,7);g.fill();
    g.beginPath();g.arc(X(gx-s*11),Z(0),9.15*k,s>0?Math.PI-0.93:-0.93,s>0?Math.PI+0.93:0.93);g.stroke();
    for(const t of[-1,1]){g.beginPath();g.arc(X(gx),Z(t*34),1*k,0,7);g.stroke();}}
  return doku(c);}
function sahaKur(){const m=new THREE.Mesh(new THREE.PlaneGeometry((SAHA.x+SAHA.pay)*2,(SAHA.z+SAHA.pay)*2),LAM({map:sahaDoku(),emissive:GECE?0x0c2a0a:0x000000}));
  m.rotation.x=-Math.PI/2;m.position.y=0.02;m.receiveShadow=true;scene.add(m);
  const ag=LAM({color:0xffffff,transparent:true,opacity:0.35,side:THREE.DoubleSide});
  for(const s of[-1,1]){const gx=s*52.5,g=new THREE.Group();scene.add(g);
    for(const t of[-1,1])g.add(silindir(0.06,0.06,2.44,MAT.beyaz,gx,1.22,t*3.66,8));
    g.add(kutu(0.12,0.12,7.32,MAT.beyaz,gx,2.44,0));
    const d=2.0,agUst=new THREE.Mesh(new THREE.PlaneGeometry(d,7.32),ag);agUst.rotation.x=-Math.PI/2;agUst.position.set(gx+s*d/2,2.3,0);g.add(agUst);
    const agArka=new THREE.Mesh(new THREE.PlaneGeometry(7.32,2.3),ag);agArka.rotation.y=Math.PI/2;agArka.position.set(gx+s*d,1.15,0);g.add(agArka);
    for(const t of[-1,1]){const yan=new THREE.Mesh(new THREE.PlaneGeometry(d,2.3),ag);yan.position.set(gx+s*d/2,1.15,t*3.66);g.add(yan);}
    for(const t of[-1,1]){g.add(silindir(0.03,0.03,1.5,MAT.beyaz,gx,0.75,t*34,6));g.add(kutu(0.5,0.35,0.02,LAM({color:0xc8281e}),gx+0.25,1.3,t*34,false));}}
  /* yedek kulübeleri (ana tribün önünde, panoların arkasında) ve tünel ağzı */
  const z=-SAHA.z-4.6;for(const s of[-1,1]){const g=new THREE.Group();g.position.set(s*9.5,0,z);scene.add(g);
    g.add(kutu(5.2,0.45,1.3,LAM({color:0x2b3a4a}),0,0.4,0.2));
    g.add(kutu(5.6,0.12,1.9,LAM({color:0x9fb6c8,transparent:true,opacity:0.6}),0,1.9,0,false));
    for(const x of[-2.7,2.7])for(const zz of[-0.9,0.9])g.add(kutu(0.1,1.9,0.1,LAM({color:0x3a4048}),x,0.95,zz));
    for(let i=0;i<6;i++)g.add(kutu(0.5,0.6,0.5,LAM({color:0x2b3a4a}),-2.1+i*0.85,0.3,0.3));}
  scene.add(kutu(3.2,1.8,2.4,LAM({color:0x8c8678}),-19,0.9,-SAHA.z-A.tribunler.ana.mesafe+1.4));
}
/* ---- pullar (oyundaki gibi: forma rengi üst yüz, süs renginde halka, numara) ---- */
function pulDoku(renk,sus,no){const c=tuval(64,64),g=c.getContext('2d');g.fillStyle=renk;g.fillRect(0,0,64,64);
  g.strokeStyle=sus;g.lineWidth=5;g.beginPath();g.arc(32,32,27,0,7);g.stroke();
  g.save();g.translate(64,0);g.scale(-1,1);g.fillStyle=sus;g.font='bold 30px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(String(no),32,34);g.restore();return doku(c);}
function pulKur(x,z,renk,sus,no){const r=0.5*1.7,yan=LAM({color:karistir(renk,'#000000',0.45)});
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,0.12,24),[yan,LAM({map:pulDoku(renk,sus,no)}),yan]);m.position.set(x,0.08,z);m.castShadow=true;scene.add(m);
  const leke=new THREE.Mesh(new THREE.CircleGeometry(r*0.9,16),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.3}));
  leke.rotation.x=-Math.PI/2;leke.position.set(x-0.14,0.03,z-0.14);scene.add(leke);}
function oyuncular(){const r2=rastgele(99),j=()=>(r2()*2-1)*2.2;
  const ev=[[-46,0],[-32,-14],[-30,-4],[-30,6],[-33,15],[-14,-10],[-16,2],[-10,11],[4,-17],[10,0],[2,16]];
  const dep=[[47,0],[33,-13],[31,-3],[31,7],[34,15],[20,-15],[21,-2],[18,8],[23,17],[6,6],[12,-6]];
  ev.forEach((p,i)=>pulKur(p[0]+j(),p[1]+j(),i?RENK.ev:'#1f8a3f',RENK.evSus,i+1));
  dep.forEach((p,i)=>pulKur(p[0]+j(),p[1]+j(),i?RENK.dep:'#7a2a9a',RENK.depSus,i+1));
  pulKur(8,-8,'#222222','#ffd34a','');pulKur(-20,-35.6,'#222222','#ffd34a','');pulKur(30,35.6,'#222222','#ffd34a','');
  const top=new THREE.Mesh(new THREE.IcosahedronGeometry(0.44,1),LAM({color:0xffffff}));top.position.set(9.5,0.44,1.5);top.castShadow=true;scene.add(top);
}
/* ---- tribünler ----
   Her tribün P(z) ve Q(z) ile tanımlanır: derinlik z'deki sıranın iki ucu (dünya xz). Düz tribünde uçlar paralel kayar; köşe tribününde P yan
   tribünün, Q kale tribününün ucudur (kama). Sıra = üst levha + ön basamak duvarı; üst kat yürüyüş yolu ve balkon duvarıyla; çatı arkadan
   cati payı kadar yarı saydam levha, kirişler, ön kiriş, arka kolonlar. */
const YARIM={ana:34,karsi:34,kale1:52.5,kale2:52.5};
function cerceve(yer,mesafe){const on=YARIM[yer]+mesafe;
  return{ana:{C:[0,-on],A:[-1,0],N:[0,-1]},karsi:{C:[0,on],A:[1,0],N:[0,1]},kale1:{C:[-on,0],A:[0,1],N:[-1,0]},kale2:{C:[on,0],A:[0,-1],N:[1,0]}}[yer];}
const KALABALIK_EV=['#c8281e','#c8281e','#c8281e','#b02018','#d83a2e','#f2ede2','#f2ede2','#2a2a2e','#3b3f48','#6b6b6b','#d8d4c8','#8a5a3a','#223355','#e0b080'];
const KALABALIK_DEP=['#22347a','#22347a','#22347a','#1a2a66','#3a4a9a','#eef0f3','#eef0f3','#2a2a2e','#444a55','#8a5a3a'];
const KISILER=[];
const BASAMAK_DOKU={};
function basamakDoku(tip,koltuk){const k=tip+(koltuk||'');if(BASAMAK_DOKU[k])return BASAMAK_DOKU[k];
  const c=tuval(64,64),g=c.getContext('2d');
  if(tip==='oturma'){g.fillStyle=RENK.beton;g.fillRect(0,0,64,64);g.fillStyle=karistir(koltuk,'#000000',0.35);g.fillRect(5,6,54,14);g.fillStyle=koltuk;g.fillRect(5,20,54,26);
    g.fillStyle='rgba(0,0,0,0.18)';g.fillRect(0,60,64,4);}
  else if(tip==='ayakta'){g.fillStyle=RENK.basamak;g.fillRect(0,0,64,64);g.fillStyle='rgba(255,255,255,0.22)';g.fillRect(0,58,64,6);g.fillStyle='rgba(0,0,0,0.12)';g.fillRect(0,0,64,5);
    for(let i=0;i<30;i++){g.fillStyle='rgba(60,50,40,'+(0.05+0.1*hash(i,3)).toFixed(2)+')';g.fillRect(hash(i,1)*64,hash(i,2)*64,3,3);}}
  else{g.fillStyle=RENK.setCim;g.fillRect(0,0,64,64);for(let i=0;i<40;i++){g.fillStyle=i%3?'rgba(120,100,60,0.35)':'rgba(70,95,40,0.5)';g.fillRect(hash(i,5)*64,hash(i,6)*64,4+hash(i,7)*6,3);}
    g.fillStyle='rgba(0,0,0,0.15)';g.fillRect(0,0,64,4);}
  return BASAMAK_DOKU[k]=c;}
function basamakMat(tip,koltuk,L){const c=basamakDoku(tip,koltuk);const t=doku(c,[L/(tip==='oturma'?0.5:tip==='ayakta'?2:3),1]);return LAM({map:t});}
function secH(L,j,i){return L[Math.floor(hash(j+11,i+5)*L.length)];}
function tribunKur(T){
  const S=SIRA[T.tip],g=new THREE.Group();scene.add(g);
  const satir=[];let z=0;
  satir.push({z0:0,z1:0.6,top:1.0,mat:MAT.beton});z=0.6;
  const taban=1.0;
  for(let i=0;i<T.sira;i++){satir.push({z0:z,z1:z+S.d,top:taban+(i+1)*S.h,tip:T.tip,koltuk:T.koltuk,kat:0,i});z+=S.d;}
  const topAlt=taban+T.sira*S.h;
  if(T.ust){satir.push({z0:z,z1:z+2.4,top:topAlt,mat:MAT.betonK,yol:true});z+=2.4;const t0=topAlt+2.6;
    for(let i=0;i<T.ust.sira;i++){satir.push({z0:z,z1:z+S.d,top:t0+(i+1)*S.h,tip:'oturma',koltuk:T.ust.koltuk,kat:1,i,balkon:i===0});z+=S.d;}}
  T.derinlik=z;T.tepe=satir[satir.length-1].top;T.topAlt=topAlt;
  /* arka duvar (tribünün dış sınırı; gölgesi dışarı düşer) ve yan duvarlar */
  g.add(kiris(T.P(z),T.Q(z),0.4,T.tepe+0.9,0,MAT.betonK));
  if(!T.kose)for(const uc of[T.P,T.Q])g.add(kiris(uc(0.2),uc(z),0.4,T.tepe+0.5,0,MAT.betonK));
  let onceki=0;
  for(const s of satir){const a0=T.P(s.z0),b0=T.Q(s.z0),a1=T.P(s.z1),b1=T.Q(s.z1),L=Math.hypot(b0[0]-a0[0],b0[1]-a0[1]);
    const mat=s.mat||basamakMat(s.tip,s.koltuk,L);
    const ust=levha([a0,b0,b1,a1],s.top,mat);ust.castShadow=true;g.add(ust);
    g.add(kiris(a0,b0,0.14,s.top-onceki,onceki,s.balkon?MAT.betonK:MAT.basamakYuz));
    if(s.balkon&&A.reklam==='led')panoSerit(T.P(s.z0-0.25),T.Q(s.z0-0.25),s.top-1.35,T.N,4);
    onceki=s.top;
    if(s.tip){const n=Math.floor(L/0.5),satirPay=s.kat?0.8:1-0.3*(s.i/T.sira);
      for(let j=0;j<n;j++){const u=(j+0.5)/n-0.5;let dolu=A.doluluk*(1.22-Math.abs(u)*0.8)*satirPay*(0.55+0.9*gurultu(u*5+s.i*0.17+(T.kose?3:0),s.i*0.31+T.tohum));
        if(T.kose)dolu*=0.85;
        if(hash(j*7+s.i,s.kat*100+T.tohum)>dolu)continue;
        const dep=T.deplasman&&u>T.deplasman[0]&&u<T.deplasman[1];
        if(T.deplasman&&!dep&&Math.min(Math.abs(u-T.deplasman[0]),Math.abs(u-T.deplasman[1]))<0.035)continue;
        const t=(j+0.5)/n,zc=(s.z0+s.z1)/2+0.1,P=T.P(zc),Qp=T.Q(zc);
        const x=P[0]+(Qp[0]-P[0])*t+(hash(j,s.i+9)-0.5)*0.12,zz=P[1]+(Qp[1]-P[1])*t+(hash(j+3,s.i)-0.5)*0.12;
        KISILER.push({x,z:zz,y:s.top,h:s.tip==='oturma'?0.5:0.72,renk:dep?secH(KALABALIK_DEP,j,s.i):secH(KALABALIK_EV,j,s.i)});}}
  }
  /* çatı */
  if(T.cati){const D=T.derinlik,zb=D+1.4,zf=D*(1-T.cati),y=T.tepe+4.2;
    const slab=levha([T.P(zf),T.Q(zf),T.Q(zb),T.P(zb)],y,LAM({color:RENK.cati,transparent:true,opacity:0.64,side:THREE.DoubleSide}));slab.receiveShadow=false;g.add(slab);
    const Pf=T.P(zf),Qf=T.Q(zf),Pb=T.P(zb),Qb=T.Q(zb),L=Math.hypot(Qf[0]-Pf[0],Qf[1]-Pf[1]),n=Math.max(2,Math.round(L/5));
    for(let i=0;i<=n;i++){const t=i/n;g.add(kiris([Pf[0]+(Qf[0]-Pf[0])*t,Pf[1]+(Qf[1]-Pf[1])*t],[Pb[0]+(Qb[0]-Pb[0])*t,Pb[1]+(Qb[1]-Pb[1])*t],0.3,0.5,y+0.05,MAT.kiris));}
    g.add(kiris(Pf,Qf,0.6,0.8,y-0.5,MAT.kiris));g.add(kiris(Pb,Qb,0.5,0.6,y+0.05,MAT.kiris));
    const nk=Math.max(2,Math.round(L/8));for(let i=0;i<=nk;i++){const t=i/nk,p=[Pb[0]+(Qb[0]-Pb[0])*t,Pb[1]+(Qb[1]-Pb[1])*t];g.add(silindir(0.35,0.45,y,MAT.direk,p[0],y/2,p[1],8));}
    if(A.catiIsik){g.add(kiris(T.P(zf+0.3),T.Q(zf+0.3),0.6,0.35,y-0.9,LAM({color:0x2a2c30,emissive:new THREE.Color(RENK.lamba),emissiveIntensity:GECE?1.3:0.35}),false));}
    T.catiY=y;T.catiZ=[zf,zb];
    if(A.reklam==='led'&&(T.yer==='ana'||T.yer==='karsi'))catiYazi(T,T.yer==='ana'?['DEMİRKAPI SK','#c8281e']:['TRİBÜN SİGORTA','#1d2d8a']);
  }
  return T;
}
function catiYazi(T,yazi){const c=tuval(1024,160),g=c.getContext('2d');g.fillStyle=yazi[1];g.font='bold 120px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(yazi[0],512,84);
  const zc=(T.catiZ[0]+T.catiZ[1])/2,P=T.P(zc),Qp=T.Q(zc),m=new THREE.Mesh(new THREE.PlaneGeometry(46,7.2),LAM({map:doku(c),transparent:true}));
  m.position.set((P[0]+Qp[0])/2,T.catiY+0.4,(P[1]+Qp[1])/2);m.rotation.set(-Math.PI/2,0,Math.PI);scene.add(m);}
function kalabalikKur(){if(!KISILER.length)return;const geo=new THREE.BoxGeometry(0.36,1,0.3),m=new THREE.InstancedMesh(geo,LAM({color:0xffffff}),KISILER.length);
  const M=new THREE.Matrix4(),c=new THREE.Color();KISILER.forEach((k,i)=>{M.makeScale(1,k.h,1);M.setPosition(k.x,k.y+k.h/2,k.z);m.setMatrixAt(i,M);c.set(k.renk);m.setColorAt(i,c);});
  m.castShadow=true;m.receiveShadow=true;scene.add(m);}
function tribunler(){
  const T=A.tribunler,cer={};for(const yer in T)cer[yer]=cerceve(yer,T[yer].mesafe);
  const uc=(F,Lx,z,s)=>[F.C[0]+F.N[0]*z+F.A[0]*s*Lx/2,F.C[1]+F.N[1]*z+F.A[1]*s*Lx/2];
  let tohum=0;
  for(const yer in T){const t=T[yer],F=cer[yer];
    const spec=Object.assign({},t,{yer,N:F.N,tohum:tohum++,P:z=>uc(F,t.uzunluk,z,-1),Q:z=>uc(F,t.uzunluk,z,1),deplasman:yer==='kale1'?[-0.18,0.18]:null});
    tribunKur(spec);t.derinlik=spec.derinlik;t.tepe=spec.tepe;t.catiY=spec.catiY;}
  if(A.kose)for(const yan of['ana','karsi'])for(const kale of['kale1','kale2']){const ty=T[yan],tk=T[kale],Fy=cer[yan],Fk=cer[kale];
    const sx=kale==='kale1'?-1:1,ez=yan==='ana'?-1:1;
    const ucY=z=>{const a=uc(Fy,ty.uzunluk,z,-1),b=uc(Fy,ty.uzunluk,z,1);return Math.sign(a[0])===sx?a:b;};
    const ucK=z=>{const a=uc(Fk,tk.uzunluk,z,-1),b=uc(Fk,tk.uzunluk,z,1);return Math.sign(a[1])===ez?a:b;};
    tribunKur(Object.assign({},ty,{yer:'kose',kose:true,koltuk:tk.koltuk,N:[sx*0.707,ez*0.707],tohum:tohum++,P:ucY,Q:ucK,deplasman:null}));}
  kalabalikKur();
}
/* ---- projektör direkleri ---- */
function lambaDoku(){const c=tuval(128,64),g=c.getContext('2d');g.fillStyle='#2a2c30';g.fillRect(0,0,128,64);
  for(let i=0;i<8;i++)for(let j=0;j<4;j++){g.fillStyle=GECE?'#fff8dc':'#d9d2b8';g.beginPath();g.arc(8+i*16,8+j*16,5.5,0,7);g.fill();}return doku(c);}
function projektor(x,z,h){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  g.add(silindir(0.45,0.75,h,MAT.direk,0,h/2,0,8));
  for(const s of[-1,1])g.add(silindir(0.12,0.12,h*0.92,MAT.direk,s*0.9,h*0.46,0,6));
  for(let y=4;y<h-2;y+=4)g.add(kutu(2.2,0.14,0.14,MAT.direk,0,y,0,false));
  const kafa=new THREE.Group();kafa.position.y=h;kafa.rotation.y=Math.atan2(-x,-z);kafa.rotation.x=0.65;g.add(kafa);
  const lt=lambaDoku(),lm=LAM({map:lt,emissive:new THREE.Color(RENK.lamba),emissiveMap:lt,emissiveIntensity:GECE?1.1:0.15}),k=kutu(4.8,2.6,0.5,[MAT.direk,MAT.direk,MAT.direk,MAT.direk,lm,lm],0,1.2,0.4);kafa.add(k);
  if(GECE){/* ışık konisi sahaya yüksekten iner (alçak direkte koni yere yatıp bütün çevreyi aydınlatıyordu) */
    const sp=new THREE.SpotLight(0xfff0d0,0.55,0,0.6,0.75,0);sp.position.set(x*0.8,Math.max(h,95),z*0.8);sp.target.position.set(-x*0.15,0,-z*0.15);scene.add(sp);scene.add(sp.target);
    const par=new THREE.Mesh(new THREE.PlaneGeometry(10,6),new THREE.MeshBasicMaterial({color:0xfff6dc,transparent:true,opacity:0.35,depthWrite:false}));par.position.set(0,1.2,0.6);kafa.add(par);}}
function projektorler(C){const h=A.direk;let yer=C.direkYeri;
  if(!yer){const T=A.tribunler,dx=52.5+T.kale1.mesafe+T.kale1.derinlik+3.5,dz=34+T.ana.mesafe+T.ana.derinlik+3.5;yer=[[-dx,-dz],[dx,-dz],[-dx,dz],[dx,dz]];}
  for(const p of yer)projektor(p[0],p[1],h);}
/* ---- reklam panoları: saha kenarı şeridi (seyrek → tam → sürekli led), balkon şeridi, çatı yazısı ---- */
const PANO_ADLAR=[['SÜT','#1d2d8a','#ffffff'],['BANKA','#c8281e','#ffffff'],['SİGORTA','#ffb530','#222222'],['LASTİK','#f2ede2','#1d1d1d'],['ENERJİ','#1f8a3f','#ffffff'],
  ['TELEKOM','#222222','#ffb530'],['HAVAYOLU','#2a7fa6','#ffffff'],['BOYA','#7a2a9a','#ffffff'],['MOBİLYA','#8a5a3a','#ffffff'],['SU','#3fa3b8','#ffffff']];
const PANO_DOKU={};
function panoDoku(i){if(PANO_DOKU[i])return PANO_DOKU[i];const [ad,ar,yz]=PANO_ADLAR[i%PANO_ADLAR.length],c=tuval(512,96),g=c.getContext('2d');
  g.fillStyle=ar;g.fillRect(0,0,512,96);g.fillStyle=yz;g.beginPath();g.arc(60,48,30,0,7);g.fill();g.fillStyle=ar;g.beginPath();g.arc(60,48,16,0,7);g.fill();
  g.fillStyle=yz;g.font='bold 62px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(ad,300,52);
  if(GECE){g.fillStyle='rgba(255,255,255,0.12)';g.fillRect(0,0,512,48);}
  return PANO_DOKU[i]=doku(c);}
const PANO={h:1.1,egim:0.85};
/* a→b arasında, dış normali N olan, tabanı y'de eğik pano; i doku sırası */
function pano(a,b,y,N,i){const t=panoDoku(i),mat=LAM({map:t,emissive:GECE?new THREE.Color(0xffffff):new THREE.Color(0x000000),emissiveMap:t,emissiveIntensity:GECE?0.9:0});
  const m=kiris(a,b,0.08,PANO.h,y,[MAT.direk,MAT.direk,MAT.direk,MAT.direk,mat,mat]);m.rotation.order='YXZ';
  const phi=m.rotation.y,zd=[Math.sin(phi),Math.cos(phi)],s=Math.sign(zd[0]*N[0]+zd[1]*N[1])||1;m.rotation.x=s*PANO.egim;m.position.y=y+PANO.h/2*Math.cos(PANO.egim)+0.04;scene.add(m);}
function panoSerit(a,b,y,N,baslangic){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/6));
  for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n;pano([a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0],[a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1],y,N,baslangic+i);}}
function panolar(){const mod=A.reklam,pay=2.6,boy=6,r2=rastgele(5);
  const kenar=[{N:[0,-1],z:-(34+pay)},{N:[0,1],z:34+pay},{N:[-1,0],x:-(52.5+pay)},{N:[1,0],x:52.5+pay}];
  let i=0;
  for(const k of kenar){const seg=[];
    if(k.z!==undefined){for(let x=-48;x<=48;x+=boy){if(k.z<0&&Math.abs(x)<4)continue;seg.push({c:x,a:[x-boy/2+0.1,k.z],b:[x+boy/2-0.1,k.z]});}}
    else{for(let z=-30;z<=30;z+=boy)seg.push({c:z,a:[k.x,z-boy/2+0.1],b:[k.x,z+boy/2-0.1]});}
    for(const s of seg){i++;
      if(mod==='seyrek'){if(k.x!==undefined)continue;const liste=k.z<0?[-42,-30,-18,24,36]:[-36,-12,12,30];if(!liste.includes(s.c))continue;}
      else if(mod==='tam'){if(r2()<0.08)continue;}
      pano(s.a,s.b,0,k.N,i);}}
}
/* ---- tabela ---- */
function tabela(){const T=A.tribunler.karsi;
  if(A.tabela==='elle'){const z=34+T.mesafe+T.derinlik+3,x=-20,c=tuval(512,160),g=c.getContext('2d');g.fillStyle='#2a2c30';g.fillRect(0,0,512,160);
    g.fillStyle='#f2ede2';g.font='bold 70px Arial';g.textAlign='center';g.fillText('1 - 0',256,90);g.font='bold 34px Arial';g.fillText("63'",256,140);
    for(const s of[-1,1])scene.add(silindir(0.2,0.2,6.5,MAT.direk,x+s*6,3.25,z,6));
    const m=kutu(13,4,0.3,[MAT.direk,MAT.direk,MAT.direk,MAT.direk,LAM({map:doku(c)}),LAM({map:doku(c)})],x,6.5,z);m.rotation.x=0.35;scene.add(m);}
  else{const Tk=A.tribunler.kale2,x=52.5+Tk.mesafe+Tk.derinlik-4,y=(Tk.catiY||Tk.tepe)+1,c=tuval(512,288),g=c.getContext('2d');g.fillStyle='#101418';g.fillRect(0,0,512,288);
    g.fillStyle='#f2ede2';g.font='bold 90px Arial';g.textAlign='center';g.fillText('1 - 0',256,150);g.font='bold 44px Arial';g.fillText("63'",256,230);
    const lm=LAM({map:doku(c),emissive:0xffffff,emissiveMap:doku(c),emissiveIntensity:GECE?0.9:0.3});
    const m=kutu(16,9,0.8,[MAT.direk,MAT.direk,MAT.direk,MAT.direk,lm,lm],x,y+4.5,0);m.rotation.y=-Math.PI/2;m.rotation.order='YXZ';m.rotation.x=0.5;scene.add(m);
    for(const s of[-1,1])scene.add(silindir(0.3,0.3,y+2,MAT.direk,x,(y+2)/2,s*7,6));}
}
/* ---- çevre: ortak altyapı ----
   Zemin bir tuvalde piksel piksel boyanır (C.boya(x,z,PX): PX.r,g,b ve PX.su); su olan pikseller kara katmanında saydamdır, su katmanı
   C.suDerinlik metre aşağıdadır (kıyı duvarları kütle olarak ayrıca kurulur, gölgeleri suya düşer). Üstüne tuval çizimleri (yol, çizgi) C.ustCiz ile. */
const ZEMIN={w:360,h:280,px:6};
const PX={r:0,g:0,b:0,su:false};
function sdKutu(x,z,cx,cz,hx,hz){const dx=Math.abs(x-cx)-hx,dz=Math.abs(z-cz)-hz;return Math.hypot(Math.max(dx,0),Math.max(dz,0))+Math.min(Math.max(dx,dz),0);}
function sdCizgi(x,z,a,b,w){const px=x-a[0],pz=z-a[1],bx=b[0]-a[0],bz=b[1]-a[1],t=clamp((px*bx+pz*bz)/(bx*bx+bz*bz||1),0,1);return Math.hypot(px-bx*t,pz-bz*t)-w;}
function sdYol(x,z,P,w){let d=1e9;for(let i=0;i+1<P.length;i++)d=Math.min(d,sdCizgi(x,z,P[i],P[i+1],w));return d;}
function sdCokgen(x,z,P){let d=1e9,ic=false;for(let i=0,j=P.length-1;i<P.length;j=i++){d=Math.min(d,sdCizgi(x,z,P[j],P[i],0));
  if((P[i][1]>z)!==(P[j][1]>z)&&x<(P[j][0]-P[i][0])*(z-P[i][1])/(P[j][1]-P[i][1])+P[i][0])ic=!ic;}return ic?-d:d;}
function blobR(rx,rz,n,genlik,tohum){return th=>{const c=Math.abs(Math.cos(th)),s=Math.abs(Math.sin(th));const r=Math.pow(Math.pow(c/rx,n)+Math.pow(s/rz,n),-1/n);
  return r*(1+genlik*(0.6*Math.sin(3*th+tohum)+0.3*Math.sin(7*th+2*tohum)+0.15*Math.sin(13*th+3*tohum)+0.1*Math.sin(23*th+tohum)));};}
function sdBlob(x,z,B){const dx=x-B.c[0],dz=z-B.c[1];return Math.hypot(dx,dz)-B.r(Math.atan2(dz,dx));}
function blobCokgen(B,n){const P=[];for(let i=0;i<n;i++){const th=i/n*Math.PI*2,r=B.r(th);P.push([B.c[0]+Math.cos(th)*r,B.c[1]+Math.sin(th)*r]);}return P;}
function renkYaz(c,k){PX.r=c[0]*k;PX.g=c[1]*k;PX.b=c[2]*k;}
function renkKaris(a,b,t){PX.r=lerp(a[0],b[0],t);PX.g=lerp(a[1],b[1],t);PX.b=lerp(a[2],b[2],t);}
const GECE_KAT=GECE?0.6:1;
/* deniz/göl rengi: d kıyıdan uzaklık (m), maruz: dalga ve köpük şiddeti 0..1 */
const NEHIR=[[24,66,84],[34,92,106],[52,120,126],[96,152,146]];
function suRenk(x,z,d,maruz,akisAci,palet){const P=palet||DENIZ,t=clamp(d/42,0,1),n=fbm(x*0.06,z*0.06);
  const i=Math.pow(t,0.65)*3,k=Math.min(2,Math.floor(i)),f=i-k;renkKaris(P[3-k],P[2-k],f);
  const kat=1+(n-0.5)*0.2;PX.r*=kat;PX.g*=kat;PX.b*=kat;
  if(akisAci!==undefined){const s=Math.sin((x*Math.cos(akisAci)+z*Math.sin(akisAci))*0.05+(z*Math.cos(akisAci)-x*Math.sin(akisAci))*1.1+fbm(x*0.05,z*0.25)*9);
    if(s>0.9){const q=(s-0.9)/0.1*0.22*(0.5+gurultu(x*0.3,z*0.3));PX.r+=40*q;PX.g+=48*q;PX.b+=48*q;}}
  else{const w=Math.sin((x*0.5+z*0.3)*0.9+n*14+d*0.04),kir=gurultu(x*0.12,z*0.12);
    if(w>0.955&&kir>0.42){const q=(w-0.955)/0.045*maruz*0.55;PX.r+=70*q;PX.g+=70*q;PX.b+=60*q;}}
  if(d<3.2){const f=(1-d/3.2)*(0.35+0.65*gurultu(x*0.6,z*0.6))*(0.4+0.6*maruz);PX.r=lerp(PX.r,240,f);PX.g=lerp(PX.g,247,f);PX.b=lerp(PX.b,248,f);}
  else if(d<9&&maruz>0.3){const f=(1-(d-3.2)/5.8)*Math.max(0,gurultu(x*0.4,z*0.4)-0.55)*1.4*maruz;PX.r=lerp(PX.r,235,f);PX.g=lerp(PX.g,242,f);PX.b=lerp(PX.b,244,f);}
  PX.su=true;}
const KAYA_RGB=RENK.kaya.map(hexRgb),CAYIR=hexRgb(RENK.cayir),CAYIRK=hexRgb(RENK.cayirKoyu),PLAZA=hexRgb(RENK.plaza),CAKIL=hexRgb(RENK.cakil),KUM=hexRgb(RENK.kum),RIHTIM=hexRgb(RENK.rihtim),ASFALT=hexRgb(RENK.asfalt);
function kayaRenk(x,z){const n=fbm(x*0.12,z*0.12),m=gurultu(x*1.6,z*1.6),k=Math.floor(fbm(x*0.04,z*0.04)*KAYA_RGB.length)%KAYA_RGB.length;renkYaz(KAYA_RGB[k],0.72+0.4*n+0.12*m);}
function cayirRenk(x,z,asinma){const n=fbm(x*0.08,z*0.08),f=gurultu(x*1.7,z*1.7);renkKaris(CAYIR,CAYIRK,n);const k=0.95+0.1*f;PX.r*=k;PX.g*=k;PX.b*=k;
  if(asinma){const a=gurultu(x*0.25,z*0.25);if(a>0.72)renkKaris([PX.r,PX.g,PX.b],[150,135,95],(a-0.72)*2.2*asinma);}}
function plazaRenk(x,z){const n=gurultu(x*0.5,z*0.5);renkYaz(PLAZA,0.93+0.1*n);const kx=Math.abs(((x%6)+6)%6-0.08),kz=Math.abs(((z%6)+6)%6-0.08);if(kx<0.16||kz<0.16){PX.r*=0.9;PX.g*=0.9;PX.b*=0.9;}}
function cakilRenk(x,z){const n=gurultu(x*0.9,z*0.9);renkYaz(CAKIL,0.88+0.22*n);}
/* stadın çevresi: bugünkü kademenin ayak izi + pay (plaza, çakıl); statRezerv: son kademenin ayak izi (ileride stadın büyüyeceği arsa) */
function statCevresi(x,z,pay){return Math.abs(x)<SIMDI_DIS.x+pay&&Math.abs(z)<SIMDI_DIS.z+pay;}
function statRezerv(x,z,pay){return Math.abs(x)<STAT_DIS.x+pay&&Math.abs(z)<STAT_DIS.z+pay;}
/* tribün kapılarından dışarı giden yollar (tuval üstüne) */
function yollar(g,X,Z,M,renk){g.strokeStyle=renk||'rgba(206,197,172,0.95)';g.lineWidth=4*M;g.lineCap='round';
  const ciz=(a,b)=>{g.beginPath();g.moveTo(X(a[0]),Z(a[1]));g.lineTo(X(b[0]),Z(b[1]));g.stroke();};
  ciz([0,-SIMDI_DIS.z+2],[0,-STAT_DIS.z-12]);ciz([0,SIMDI_DIS.z-2],[0,STAT_DIS.z+12]);ciz([-SIMDI_DIS.x+2,0],[-STAT_DIS.x-12,0]);ciz([SIMDI_DIS.x-2,0],[STAT_DIS.x+12,0]);}
function zeminKur(C){
  const W=ZEMIN.w*ZEMIN.px,H=ZEMIN.h*ZEMIN.px,kara=tuval(W,H),su=tuval(W,H),gk=kara.getContext('2d'),gs=su.getContext('2d');
  const ik=gk.createImageData(W,H),is=gs.createImageData(W,H),dk=ik.data,ds=is.data;
  for(let cy=0;cy<H;cy++){const z=(cy+0.5)/ZEMIN.px-ZEMIN.h/2;for(let cx=0;cx<W;cx++){const x=(cx+0.5)/ZEMIN.px-ZEMIN.w/2;PX.su=false;C.boya(x,z);const o=(cy*W+cx)*4;
    const r=clamp(PX.r*GECE_KAT,0,255),g=clamp(PX.g*GECE_KAT,0,255),b=clamp(PX.b*(GECE?0.72:1),0,255);
    if(PX.su){dk[o+3]=0;ds[o]=r;ds[o+1]=g;ds[o+2]=b;ds[o+3]=255;}else{dk[o]=r;dk[o+1]=g;dk[o+2]=b;dk[o+3]=255;ds[o]=r*0.6;ds[o+1]=g*0.6;ds[o+2]=b*0.6;ds[o+3]=255;}}}
  gk.putImageData(ik,0,0);gs.putImageData(is,0,0);
  const X=x=>(x+ZEMIN.w/2)*ZEMIN.px,Z=z=>(z+ZEMIN.h/2)*ZEMIN.px;
  if(C.ustCiz)C.ustCiz(gk,X,Z,ZEMIN.px);
  let karaGeo;
  if(C.yukseklik){karaGeo=new THREE.PlaneGeometry(ZEMIN.w,ZEMIN.h,360,280);const p=karaGeo.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,C.yukseklik(p.getX(i),-p.getY(i)));karaGeo.computeVertexNormals();}
  else karaGeo=new THREE.PlaneGeometry(ZEMIN.w,ZEMIN.h);
  const karaM=new THREE.Mesh(karaGeo,LAM({map:doku(kara),transparent:true,alphaTest:0.5}));karaM.rotation.x=-Math.PI/2;karaM.receiveShadow=true;karaM.castShadow=!!C.yukseklik;scene.add(karaM);
  if(C.suDerinlik){const suM=new THREE.Mesh(new THREE.PlaneGeometry(ZEMIN.w,ZEMIN.h),LAM({map:doku(su)}));suM.rotation.x=-Math.PI/2;suM.position.y=-C.suDerinlik;suM.receiveShadow=true;scene.add(suM);}
}
/* ağaçlar: toplanır, türüne göre tek InstancedMesh */
const AGACLAR=[];
function agac(x,z,tip,boy,y){AGACLAR.push({x,z,tip,boy:boy||1,y:y||0});}
function agaclarKur(){const tipler={cam:{geo:new THREE.ConeGeometry(2.4,7,7),y:5.2,renk:[RENK.cam,RENK.camAcik,'#36502c'],govde:2.2},
  cam2:{geo:new THREE.ConeGeometry(1.7,4.5,7),y:8.5,renk:[RENK.camAcik,RENK.cam,'#4a6a3a'],govde:0},
  yuvarlak:{geo:new THREE.IcosahedronGeometry(2.4,1),y:3.4,renk:[RENK.zeytin,'#6f7c4a','#8a9664'],govde:1.6,olcek:[1,0.75,1]},
  kavak:{geo:new THREE.IcosahedronGeometry(1.4,1),y:7.5,renk:[RENK.kavak,'#4f6c30','#6a8848'],govde:2.5,olcek:[1,3.2,1]},
  sogut:{geo:new THREE.IcosahedronGeometry(3.2,1),y:3,renk:[RENK.sogut,'#7a9450','#9ab066'],govde:1.4,olcek:[1,0.7,1]},
  selvi:{geo:new THREE.ConeGeometry(1.1,9,6),y:5.5,renk:['#2f4a2a','#3a5a32'],govde:0.8}};
  const say={};for(const a of AGACLAR){say[a.tip]=(say[a.tip]||0)+1;if(a.tip==='cam')say.cam2=(say.cam2||0)+1;}
  const M=new THREE.Matrix4(),c=new THREE.Color(),ix={};
  const mesh={};for(const t in say){mesh[t]=new THREE.InstancedMesh(tipler[t].geo,LAM({color:0xffffff}),say[t]);mesh[t].castShadow=true;mesh[t].receiveShadow=true;scene.add(mesh[t]);ix[t]=0;}
  const govdeler=AGACLAR.filter(a=>tipler[a.tip].govde>0);
  const gm=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22,0.3,1,6),MAT.govde,govdeler.length);gm.castShadow=true;scene.add(gm);
  let gi=0;
  for(const a of AGACLAR){const yaz=(t,boyKat)=>{const T=tipler[t],o=T.olcek||[1,1,1],s=a.boy*(boyKat||1);M.makeScale(o[0]*s,o[1]*s,o[2]*s);M.setPosition(a.x,a.y+T.y*s,a.z);mesh[t].setMatrixAt(ix[t],M);
      c.set(T.renk[Math.floor(hash(Math.round(a.x*3),Math.round(a.z*3))*T.renk.length)]);mesh[t].setColorAt(ix[t],c);ix[t]++;};
    yaz(a.tip);if(a.tip==='cam')yaz('cam2');
    const T=tipler[a.tip];if(T.govde>0){const h=T.govde*a.boy;M.makeScale(a.boy,h,a.boy);M.setPosition(a.x,a.y+h/2,a.z);gm.setMatrixAt(gi++,M);}}
}
/* kayalar: üç çentikli taban geometri */
const KAYA_GEO=[0,1,2].map(k=>{const g=new THREE.IcosahedronGeometry(1,1),p=g.attributes.position;for(let i=0;i<p.count;i++){const j=0.72+0.5*hash(i,k);p.setXYZ(i,p.getX(i)*j,p.getY(i)*(0.55+0.3*hash(i,k+7)),p.getZ(i)*j);}g.computeVertexNormals();return g;});
const KAYALAR=[];
function kaya(x,z,r,y){KAYALAR.push({x,z,r,y:y||0});}
function kayalarKur(){if(!KAYALAR.length)return;const M=new THREE.Matrix4(),c=new THREE.Color(),E=new THREE.Euler();
  for(let k=0;k<3;k++){const L=KAYALAR.filter((_,i)=>i%3===k);if(!L.length)continue;const m=new THREE.InstancedMesh(KAYA_GEO[k],LAM({color:0xffffff}),L.length);m.castShadow=true;m.receiveShadow=true;scene.add(m);
    L.forEach((a,i)=>{E.set(0,hash(i,k)*6.28,0);M.makeRotationFromEuler(E);M.scale(new THREE.Vector3(a.r,a.r*0.8,a.r*(0.8+0.5*hash(i,9))));M.setPosition(a.x,a.y,a.z);m.setMatrixAt(i,M);c.set(RENK.kaya[Math.floor(hash(i,k+3)*5)]);m.setColorAt(i,c);});}}
function lambaDiregi(x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);g.add(silindir(0.1,0.14,7,MAT.direk,0,3.5,0,6));
  g.add(kutu(0.7,0.3,0.5,LAM({color:0x3a3d42,emissive:new THREE.Color(RENK.lamba),emissiveIntensity:GECE?1.2:0}),0,7.1,0,false));}
function fener(x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  g.add(silindir(4.2,4.6,1.6,MAT.rihtim,0,0.8,0,12));g.add(silindir(2.0,2.6,14,MAT.beyaz,0,8.6,0,12));g.add(silindir(2.35,2.45,2.6,LAM({color:0xc8281e}),0,8.5,0,12));
  g.add(silindir(2.9,2.9,0.4,LAM({color:0x3a3d42}),0,15.8,0,12));g.add(silindir(1.3,1.3,2.4,LAM({color:0xcfe8ff,emissive:GECE?0xfff2cc:0x000000,emissiveIntensity:1.2,transparent:true,opacity:0.85}),0,17.2,0,10));
  g.add(new THREE.Mesh(new THREE.ConeGeometry(1.6,1.4,10),LAM({color:0xc8281e}))).position.y=19.1;
  if(GECE){const pl=new THREE.PointLight(0xfff2cc,1.2,90);pl.position.set(0,17,0);g.add(pl);}}
function tekne(x,z,aci,renk){const g=new THREE.Group();g.position.set(x,-2.2,z);g.rotation.y=aci;scene.add(g);
  const gov=LAM({color:renk});g.add(kutu(6,1.1,2.2,gov,0,0.55,0));const bur=new THREE.Mesh(new THREE.ConeGeometry(1.1,2.6,4),gov);bur.rotation.z=-Math.PI/2;bur.rotation.y=Math.PI/4;bur.position.set(4.2,0.55,0);bur.castShadow=true;g.add(bur);
  g.add(kutu(5.2,0.1,1.7,LAM({color:0xd8cfb8}),-0.2,1.12,0,false));g.add(kutu(1.6,0.9,1.4,LAM({color:0xf2ede2}),-1.4,1.6,0));g.add(silindir(0.08,0.08,6,MAT.govde,0.8,4,0,5));}
/* ---- KONSEPT 1: burun — denize uzanan kayalık yarımada, taş rıhtım, mendirek ve fener ---- */
const KONSEPTLER={};
KONSEPTLER[1]=(()=>{const B={c:[0,4],r:blobR(104,86,3.4,0.045,1.7)};const MEND=[[-92,52],[-122,62],[-132,84],[-120,102]];const KOY={c:[122,-66],r:blobR(20,15,2.2,0.08,3)};
  const neck={cx:0,cz:-120,hx:16,hz:56};
  function sd(x,z){let d=sdBlob(x,z,B);d=Math.min(d,sdKutu(x,z,neck.cx,neck.cz,neck.hx,neck.hz));d=Math.min(d,sdYol(x,z,MEND,3.6));d=Math.max(d,-sdBlob(x,z,KOY)-1);return d;}
  function korunakli(x,z){return (x<-80&&z>40&&z<120)||(z<-70&&Math.abs(x)<24);}
  const C={ad:'1 · Burun — denize uzanan yarımada',E:236,suDerinlik:2.6,arka:'#163f66',
    boya(x,z){const d=sd(x,z);
      if(d>0){const koyda=sdBlob(x,z,KOY)<10;const maruz=koyda?0.15:korunakli(x,z)?0.25:clamp(0.45+0.55*((z+40)/120),0.3,1);suRenk(x,z,koyda?d*0.35:d,maruz);return;}
      if(sdYol(x,z,MEND,3.6)<0){renkYaz(RIHTIM,0.95+0.1*gurultu(x*0.8,z*0.8));if(((x+z+400)%3)<0.3){PX.r*=0.85;PX.g*=0.85;PX.b*=0.85;}return;}
      if(sdBlob(x,z,KOY)<4){renkYaz(KUM,0.95+0.1*gurultu(x,z));return;}
      if(d>-3.4){if(korunakli(x,z)){renkYaz(RIHTIM,0.95+0.1*gurultu(x*0.8,z*0.8));const kx=((x+200)%4),kz=((z+200)%2);if(kx<0.25||kz<0.2){PX.r*=0.85;PX.g*=0.85;PX.b*=0.85;}}else kayaRenk(x,z);return;}
      if(statCevresi(x,z,8)||d>-11){plazaRenk(x,z);return;}
      if(Math.abs(x)<4.5&&z<-60){renkYaz(ASFALT,1);return;}
      cayirRenk(x,z,0.6);},
    ustCiz(g,X,Z,M){yollar(g,X,Z,M);g.strokeStyle='rgba(255,255,255,0.35)';g.setLineDash([2*M,2*M]);g.lineWidth=0.25*M;g.beginPath();g.moveTo(X(0),Z(-60));g.lineTo(X(0),Z(-140));g.stroke();g.setLineDash([]);},
    kur(){const P=blobCokgen(B,320);scene.add(kutle(P,2.6,-0.05,MAT.rihtim));
      scene.add(kutu(neck.hx*2,2.6,neck.hz*2,MAT.rihtim,neck.cx,-1.35,neck.cz));
      for(let i=0;i+1<MEND.length;i++){scene.add(kiris(MEND[i],MEND[i+1],7.2,2.6,-2.65,MAT.rihtim));scene.add(silindir(3.6,3.6,2.6,MAT.rihtim,MEND[i+1][0],-1.35,MEND[i+1][1],12));}
      fener(MEND[3][0],MEND[3][1]);
      /* kıyı kayaları: korunaklı yerler dışında, suyun içinde ve kenarda */
      for(let i=0;i<360;i++){const th=i/360*Math.PI*2,r=B.r(th),x=B.c[0]+Math.cos(th)*r,z=B.c[1]+Math.sin(th)*r;if(korunakli(x,z)||sdBlob(x,z,KOY)<6)continue;
        if(R()<0.6)kaya(x+ara(0,3)*Math.cos(th),z+ara(0,3)*Math.sin(th),ara(1.0,2.4),ara(-1.8,-0.9));if(R()<0.3)kaya(x+ara(3,10)*Math.cos(th),z+ara(3,10)*Math.sin(th),ara(0.8,2.0),-2.0);}
      for(let i=0;i<30;i++){const t=ara(0,3),p=MEND[Math.floor(t)],q=MEND[Math.min(3,Math.floor(t)+1)],f=t-Math.floor(t),x=p[0]+(q[0]-p[0])*f,z=p[1]+(q[1]-p[1])*f;kaya(x-ara(3,6),z+ara(-2,2),ara(1,2.4),-1.8);}
      /* koy: küçük iskele ve tekneler */
      tekne(-112,86,ara(0,6),'#2e4f8a');tekne(-104,96,ara(0,6),'#d8d4c8');tekne(-116,100,ara(0,6),'#b33a2e');tekne(-98,72,ara(0,6),'#f2ede2');
      scene.add(kutu(2,0.4,16,MAT.ahsap,-96,0.1,80));for(let i=0;i<4;i++)scene.add(silindir(0.2,0.2,2.6,MAT.govde,-96.8,-1,73+i*4.5,6));
      /* rıhtım boyunca lambalar, köşelerde çamlar */
      for(let i=0;i<40;i++){const th=i/40*Math.PI*2,r=B.r(th)-6,x=B.c[0]+Math.cos(th)*r,z=B.c[1]+Math.sin(th)*r;if(statCevresi(x,z,4))continue;lambaDiregi(x,z);}
      for(let i=0;i<14;i++)agac(ara(-14,14)+(i%2?22:-22),ara(-118,-64),'cam',ara(0.9,1.3));
      for(let i=0;i<10;i++){const th=ara(0.9,2.2),r=B.r(th)-ara(14,24);const x=B.c[0]+Math.cos(th)*r,z=B.c[1]+Math.sin(th)*r;if(!statCevresi(x,z,6))agac(x,z,'cam',ara(0.8,1.2));}
      for(let i=0;i<6;i++)agac(ara(96,124),ara(-52,-30),'cam',ara(0.7,1));
      for(let i=0;i<10;i++){const x=ara(-STAT_DIS.x-4,STAT_DIS.x+4),z=(i%2?1:-1)*ara(SIMDI_DIS.z+10,STAT_DIS.z+4);if(!statCevresi(x,z,6)&&statRezerv(x,z,6))agac(x,z,'yuvarlak',ara(0.7,1));}
      for(const s of[-1,1])scene.add(kutu(0.6,1.2,110,MAT.rihtim,s*15.5,0.6,-120));}};
  return C;})();
/* ---- KONSEPT 2: kaya çanağı — eski taş ocağının basamaklı kaya duvarları arasında (arazi yükseklik haritası), üstte çam ormanı, bir yanda dere ve şelale ---- */
KONSEPTLER[2]=(()=>{const r0=blobR(STAT_DIS.x+16,STAT_DIS.z+15,3,0.035,2.4);const ACIK=[-0.42,3.5];/* kaya yayı (rad): alt taraf açık, vadiye iner */
  const DERE=[[-114,56],[-101,36],[-99,0],[-100,-50],[-88,-90],[-74,-126],[-70,-150]],YOL=[[0,-72],[16,-92],[-12,-112],[8,-140]];
  function aci(x,z){let a=Math.atan2(z,x);if(a<ACIK[0])a+=2*Math.PI;return a;}
  function yuk(x,z){const a=aci(x,z),ro=Math.hypot(x,z),rk=r0(a);
    if(a<ACIK[1]){const t=ro-rk;if(t<0)return 0;const kenar=smoothstep(0,0.45,Math.min(a-ACIK[0],ACIK[1]-a));
      const k=Math.floor(t/9),f=t/9-k;let h=Math.min(k,4)*8+(k<4?smoothstep(0.5,1,f)*8:(t-36)*0.22);
      h+=(fbm(x*0.03,z*0.03)-0.5)*7*clamp(t/8,0,1)+(gurultu(x*0.3,z*0.3)-0.5)*2*clamp(t/5,0,1);return h*kenar;}
    const t=ro-(rk-4);if(t<0)return 0;const kenar=smoothstep(0,0.5,Math.min(a-ACIK[1],ACIK[0]+2*Math.PI-a));
    return(-Math.min(24,t*0.4)+(fbm(x*0.04,z*0.04)-0.5)*3*clamp(t/10,0,1))*kenar;}
  const C={ad:'2 · Kaya çanağı — eski taş ocağı, üstte çam ormanı',E:232,arka:'#3f5a32',yukseklik:yuk,
    boya(x,z){const h=yuk(x,z),egim=Math.hypot(yuk(x+1.5,z)-h,yuk(x,z+1.5)-h)/1.5;
      const dd=sdYol(x,z,DERE,2.2);if(dd<0){renkKaris([60,100,120],[130,175,190],clamp(gurultu(x*0.7,z*0.7)*1.3,0,1));if(dd>-0.8||egim>0.45){PX.r+=55;PX.g+=50;PX.b+=40;}return;}
      if(z<-116+fbm(x*0.03,0)*8&&h<-14){suRenk(x,z,Math.max(0.5,-z-114),0.15,0,NEHIR);PX.su=false;return;}
      if(dd<1.6){renkYaz([150,140,118],0.9+0.2*gurultu(x,z));return;}
      if(sdYol(x,z,YOL,2.4)<0){renkYaz([158,140,108],0.92+0.16*gurultu(x*0.6,z*0.6));return;}
      if(h>0.5){if(egim>0.65){kayaRenk(x,z);PX.r*=0.9;PX.g*=0.9;PX.b*=0.9;return;}
        if(h>28){renkYaz([72,88,50],0.85+0.3*gurultu(x*0.2,z*0.2));return;}
        const n=gurultu(x*0.2,z*0.2);if(n>0.5){renkYaz([108,122,64],0.9+0.2*n);}else kayaRenk(x,z);return;}
      if(h<-0.5){cayirRenk(x,z,0.3);if(gurultu(x*0.12,z*0.12)>0.6){PX.r*=0.9;PX.g*=0.95;}return;}
      if(statCevresi(x,z,8)){cakilRenk(x,z);return;}
      cayirRenk(x,z,0.9);const n=gurultu(x*0.15,z*0.15);if(n>0.62){renkKaris([PX.r,PX.g,PX.b],CAKIL,(n-0.62)*2);}},
    ustCiz(g,X,Z,M){yollar(g,X,Z,M,'rgba(180,168,145,0.9)');},
    kur(){const r2=rastgele(21);
      /* kaya yüzlerinde çamlar (teras üstleri, eğim az) ve kaya parçaları (teras kenarları) */
      for(let i=0;i<2600;i++){const x=(r2()*2-1)*ZEMIN.w/2,z=(r2()*2-1)*ZEMIN.h/2,h=yuk(x,z);if(h<4)continue;const e=Math.hypot(yuk(x+1.5,z)-h,yuk(x,z+1.5)-h)/1.5;
        if(e<0.45&&r2()<0.55)agac(x,z,'cam',0.6+r2()*0.6,h);else if(e>0.4&&e<1.0&&r2()<0.25)kaya(x,z,0.9+r2()*1.6,h);}
      /* vadi: dere kıyısında kavak ve söğüt, çayırda tek tük ağaç, yolda selviler */
      for(let i=0;i<24;i++){const p=DERE[3+Math.floor(r2()*4)],x=p[0]+(r2()-0.5)*18,z=p[1]+(r2()-0.5)*18;if(sdYol(x,z,DERE,3)<0)continue;agac(x,z,r2()<0.5?'kavak':'sogut',0.7+r2()*0.4,yuk(x,z));}
      for(let i=0;i<14;i++){const x=(r2()-0.5)*160,z=-96-r2()*50;if(sdYol(x,z,YOL,4)<0||sdYol(x,z,DERE,4)<0)continue;agac(x,z,'yuvarlak',0.7+r2()*0.5,yuk(x,z));}
      for(let i=0;i<10;i++){const x=YOL[1][0]+(i-5)*6,z=-100-i*3;agac(x,z,'selvi',0.8+r2()*0.3,yuk(x,z));}
      /* şelale sisi, dere üstünde üç tahta köprü, plato kenarında lambalar */
      const sis=new THREE.Mesh(new THREE.CircleGeometry(6,16),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.35}));sis.rotation.x=-Math.PI/2;sis.position.set(DERE[1][0]+2,yuk(DERE[1][0],DERE[1][1])+0.4,DERE[1][1]-2);scene.add(sis);
      for(const z of[24,-20,-66]){const x=-99.5,y=yuk(x,z);scene.add(kutu(8,0.5,3,MAT.ahsap,x,y+0.6,z));for(const s of[-1,1])scene.add(kutu(8,0.9,0.15,MAT.ahsap,x,y+1.3,z+s*1.5));}
      for(let i=0;i<26;i++){const a=ACIK[0]+(ACIK[1]-ACIK[0])*(i+0.5)/26,r=r0(a)-7,x=Math.cos(a)*r,z=Math.sin(a)*r;if(statCevresi(x,z,4)||sdYol(x,z,DERE,4)<0)continue;lambaDiregi(x,z);}
      for(let i=0;i<10;i++){const x=ara(-STAT_DIS.x-4,STAT_DIS.x+4),z=(i%2?1:-1)*ara(SIMDI_DIS.z+10,STAT_DIS.z+4);if(!statCevresi(x,z,6)&&statRezerv(x,z,6))agac(x,z,'cam',ara(0.7,1));}}};
  return C;})();
/* ---- KONSEPT 3: nehir adası — iki yakası kavaklı nehrin ortasındaki adada, taş köprü ve tahta yaya köprüsü ---- */
KONSEPTLER[3]=(()=>{const ADA={c:[0,2],r:blobR(112,78,2.8,0.04,0.9)},KIYI=98;
  function sd(x,z){return Math.min(sdBlob(x,z,ADA),KIYI-Math.abs(z));}
  const KUMLUK=[{c:[-96,96],r:blobR(14,5,2.4,0.1,4)},{c:[120,-92],r:blobR(18,5,2.4,0.1,5)},{c:[-150,-10],r:blobR(10,16,2.4,0.1,6)}];
  const zk=ADA.c[1]-ADA.r(-Math.PI/2),zu=ADA.c[1]+ADA.r(Math.PI/2);
  const C={ad:'3 · Nehir adası — iki yakası kavaklı nehir, taş köprü',E:236,suDerinlik:2.0,arka:'#1a4a5e',
    boya(x,z){let d=sd(x,z);for(const K of KUMLUK)d=Math.min(d,sdBlob(x,z,K));
      if(d>0){suRenk(x,z,d*0.8,0.2,0,NEHIR);const t=clamp(1-d/6,0,1);PX.r=lerp(PX.r,110,t*0.3);PX.g=lerp(PX.g,110,t*0.25);PX.b=lerp(PX.b,70,t*0.3);return;}
      if(d>-2.4){renkYaz([196,182,140],0.9+0.2*gurultu(x,z));return;}
      if(d>-7){const n=gurultu(x*0.25,z*0.25);if(n>0.5){cayirRenk(x,z,0);renkKaris([PX.r,PX.g,PX.b],[176,160,78],(n-0.5)*1.6);return;}}
      if(Math.abs(z)>KIYI+2){if(Math.abs(z)>KIYI+9&&Math.abs(z)<KIYI+13&&z<0){renkYaz([150,135,100],0.95+0.1*gurultu(x,z));return;}cayirRenk(x,z,0.3);return;}
      if(statCevresi(x,z,8)){cakilRenk(x,z);return;}
      if(Math.abs(x)<5&&z<-50){renkYaz([150,135,100],1);return;}
      cayirRenk(x,z,0.5);const s=Math.sin(z*0.9+x*0.02);if(s>0.3&&statRezerv(x,z,30)){PX.r+=8;PX.g+=10;}},
    ustCiz(g,X,Z,M){yollar(g,X,Z,M,'rgba(190,178,150,0.9)');},
    kur(){scene.add(kutle(blobCokgen(ADA,320),2.2,-0.05,LAM({color:0x8a7a58})));
      for(const s of[-1,1])scene.add(kutu(ZEMIN.w,2.2,(ZEMIN.h/2-KIYI),LAM({color:0x8a7a58}),0,-1.15,s*(KIYI+(ZEMIN.h/2-KIYI)/2)));
      for(const K of KUMLUK)scene.add(kutle(blobCokgen(K,60),1.6,-0.4,LAM({color:0xc4b68c})));
      /* taş köprü (güney, ana yol): tabliye, korkuluklar, iki ayak; tahta yaya köprüsü (kuzey) */
      const Lk=KIYI-(-zk)+8;scene.add(kutu(10,1.4,Lk,LAM({color:0xc2bba8}),0,0.6,(zk-KIYI)/2));
      for(const s of[-1,1])scene.add(kutu(0.5,1.0,Lk,MAT.rihtim,s*4.8,1.8,(zk-KIYI)/2));
      for(const zz of[zk-8,zk-17])scene.add(kutu(12,2.4,3.2,MAT.rihtim,0,-1.2,zz));
      for(let i=0;i<4;i++)for(const s of[-1,1])lambaDiregi(s*4.4,zk-3-i*7);
      const Lu=KIYI-zu+6;scene.add(kutu(3,0.4,Lu,MAT.ahsap,-24,0.6,(zu+KIYI)/2));for(const s of[-1,1])scene.add(kutu(0.12,1.1,Lu,MAT.ahsap,-24+s*1.4,1.3,(zu+KIYI)/2));
      for(let i=0;i<3;i++)for(const s of[-1,1])scene.add(silindir(0.25,0.25,3.4,MAT.ahsap,-24+s*1.4,-0.8,zu+4+i*7,6));
      /* söğütler ada kıyısında, kavak sıraları yakalarda, kıyı yolunda lambalar */
      for(let i=0;i<40;i++){const th=i/40*Math.PI*2+ara(-0.04,0.04),r=ADA.r(th)-ara(5,9),x=ADA.c[0]+Math.cos(th)*r,z=ADA.c[1]+Math.sin(th)*r;if(R()<0.35||statCevresi(x,z,5)||Math.abs(x)<8)continue;agac(x,z,R()<0.7?'sogut':'kavak',ara(0.8,1.2));}
      for(let i=-24;i<=24;i++)for(const s of[-1,1]){if(Math.abs(i*7)<7&&s<0)continue;agac(i*7+ara(-1,1),s*(KIYI+6)+ara(-1,1),'kavak',ara(0.85,1.15));}
      for(let i=0;i<12;i++)agac(ara(-170,170),ara(KIYI+14,135),'yuvarlak',ara(0.8,1.2));
      for(let i=0;i<24;i++){const th=i/24*Math.PI*2,r=ADA.r(th)-12,x=ADA.c[0]+Math.cos(th)*r,z=ADA.c[1]+Math.sin(th)*r;if(statCevresi(x,z,4)||Math.abs(x)<8)continue;lambaDiregi(x,z);}
      for(let i=0;i<10;i++){const x=ara(-STAT_DIS.x-4,STAT_DIS.x+4),z=(i%2?1:-1)*ara(SIMDI_DIS.z+10,STAT_DIS.z+4);if(!statCevresi(x,z,6)&&statRezerv(x,z,6))agac(x,z,'yuvarlak',ara(0.7,1));}
      for(const K of KUMLUK)for(let i=0;i<14;i++){const p=blobCokgen(K,14)[i];scene.add(silindir(0.08,0.12,2.2,LAM({color:0xa89a50}),p[0]*0.85+K.c[0]*0.15,0.8,p[1]*0.85+K.c[1]*0.15,4));}
      tekne(-132,-80,0.4,'#d8d4c8');tekne(140,88,2.5,'#2e4f8a');}};
  return C;})();
/* ---- KONSEPT 4: sur içi — dört tabyalı eski kale surlarının içinde; projektörler tabyalarda, hendek, dışarıda zeytinlik ---- */
KONSEPTLER[4]=(()=>{const hx=STAT_DIS.x+12,hz=STAT_DIS.z+11,KAL=8,HEN=15;
  function tabya(sx,sz){const c=[sx*hx,sz*hz];const p=[[-30,0],[-22,9],[13,13],[9,-22],[0,-30]];return p.map(q=>[c[0]+sx*q[0],c[1]+sz*q[1]]);}
  /* dış çokgen: her tabya kendi duvarından girer, komşu duvardan çıkar (sıra: sol-alt → sağ-alt → sağ-üst → sol-üst) */
  const DIS=[...tabya(-1,-1).reverse(),...tabya(1,-1),...tabya(1,1).reverse(),...tabya(-1,1)];
  const IC=[[-hx+KAL,-hz+KAL],[-hx+KAL,hz-KAL],[hx-KAL,hz-KAL],[hx-KAL,-hz+KAL]];
  function dis(x,z){return sdCokgen(x,z,DIS);}
  const KAPI={x:0,z:-hz},YOL=[[0,-hz-2],[0,-hz-HEN-30],[12,-hz-HEN-60],[-6,-hz-HEN-100]];
  /* tarla sınırları (çit/çalı sırası): düzensiz aralıklı, hafif kıvrımlı */
  const CIT_X=[-168,-118,-64,-22,36,88,142,186],CIT_Z=[-146,-98,-52,-8,44,96,140];
  function cit(x,z){const wx=Math.sin(z*0.05)*2.5,wz=Math.sin(x*0.04)*2.5;for(const c of CIT_X)if(Math.abs(x+wx-c)<1.3)return true;for(const c of CIT_Z)if(Math.abs(z+wz-c)<1.3)return true;return false;}
  const C={ad:'4 · Sur içi — dört tabyalı kale, hendek ve zeytinlik',E:252,suDerinlik:3,arka:'#8da45a',direkYeri:[tabya(-1,-1)[2],tabya(1,-1)[2],tabya(-1,1)[2],tabya(1,1)[2]].map(p=>[p[0]*0.96,p[1]*0.96]),
    boya(x,z){const d=dis(x,z);
      if(d<=0){if(d>-KAL){renkYaz([170,160,140],0.95+0.1*gurultu(x*0.8,z*0.8));return;}
        if(statCevresi(x,z,7)||Math.abs(x)<4||Math.abs(z)<4){const n=gurultu(x*1.3,z*1.3);renkYaz([150,142,128],0.86+0.24*n);const kx=((x+300)%2.2),kz=((z+300)%2.2);if(kx<0.18||kz<0.18){PX.r*=0.88;PX.g*=0.88;PX.b*=0.88;}return;}
        cayirRenk(x,z,0.7);return;}
      const kapida=Math.abs(x)<5.5&&z<KAPI.z&&z>KAPI.z-HEN-3;
      if(d<HEN&&!kapida){suRenk(x,z,Math.min(d,HEN-d)*1.4+1,0.1,undefined,NEHIR);PX.r*=0.85;PX.g*=0.95;return;}
      if(sdYol(x,z,YOL,3)<0||kapida){renkYaz([160,145,110],0.92+0.16*gurultu(x*0.6,z*0.6));return;}
      if(d<HEN+10){renkYaz([176,160,120],0.9+0.2*gurultu(x*0.4,z*0.4));return;}
      if(cit(x,z)){renkYaz([70,92,48],0.9+0.2*gurultu(x,z));return;}
      cayirRenk(x,z,0.5);const n=gurultu(x*0.05,z*0.05);if(n>0.55){PX.r*=0.9;PX.g*=0.94;}else if(n<0.35){PX.r*=1.06;PX.g*=1.02;}},
    ustCiz(g,X,Z,M){yollar(g,X,Z,M,'rgba(150,142,128,0.9)');},
    kur(){const tas=LAM({color:RENK.surTas}),ust=LAM({color:RENK.surUst});
      scene.add(kutle(DIS,7,7,tas,[IC]));
      /* dış duvarın üstünde mazgallı siper */
      for(let i=0;i<DIS.length;i++){const a=DIS[i],b=DIS[(i+1)%DIS.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(2,Math.floor(L/3));
        for(let j=0;j<n;j++){if(j%2)continue;const t0=j/n,t1=(j+1)/n;scene.add(kiris([a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0],[a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1],1.2,1.6,7,ust));}}
      /* hendeğin dış yakası (kütle; iç kenarı görünür), kale tabanı, köprü ve kapı kuleleri */
      const H=ZEMIN.w/2,V=ZEMIN.h/2,disKenar=DIS.map(p=>{const th=Math.atan2(p[1],p[0]),r=Math.hypot(p[0],p[1]);return[p[0]+Math.cos(th)*HEN*1.05,p[1]+Math.sin(th)*HEN*1.05];});
      scene.add(kutle([[-H,-V],[-H,V],[H,V],[H,-V]],3,-0.05,LAM({color:0x8a7a58}),[disKenar]));
      scene.add(kutle(DIS,3,-0.05,tas));
      scene.add(kutu(9,3.2,HEN+6,tas,0,-1.5,KAPI.z-HEN/2-1));for(const s of[-1,1])scene.add(kutu(0.6,1.2,HEN+6,ust,s*4.4,0.6,KAPI.z-HEN/2-1));
      for(const s of[-1,1])scene.add(silindir(4.2,4.6,12,tas,s*7.5,6,KAPI.z-1,12));
      scene.add(kutu(6,9,2,LAM({color:0x2a2a2e}),0,4.5,KAPI.z+3));for(let i=0;i<7;i++)scene.add(kutu(0.25,8,0.25,LAM({color:0x3a3a40}),-2.5+i*0.83,4,KAPI.z-1));
      /* iç rampalar, avlu ağaçları, kapı yolunda selviler, dışarıda zeytinlik (tarla parsellerinde, seyrek boşluklu) */
      for(let i=0;i<8;i++){const x=(i%2?1:-1)*ara(SIMDI_DIS.x+6,hx-12),z=ara(-hz+12,hz-12);if(!statCevresi(x,z,6))agac(x,z,'yuvarlak',ara(1.1,1.5));}
      for(let i=0;i<18;i++)for(const s of[-1,1])agac(s*7+ara(-0.6,0.6),KAPI.z-HEN-12-i*6,'selvi',ara(0.85,1.1));
      const r2=rastgele(44);for(let gx=-180;gx<=180;gx+=9)for(let gz=-140;gz<=140;gz+=9){const x=gx+(r2()-0.5)*3,z=gz+(r2()-0.5)*3;if(dis(x,z)<HEN+12||sdYol(x,z,YOL,9)<0||r2()<0.12)continue;
        if(cit(x,z)||cit(x+3,z)||cit(x,z+3))continue;agac(x,z,'yuvarlak',0.5+r2()*0.4);}}};
  return C;})();
/* ---- kurulum ---- */
const CEVRE=KONSEPTLER[KONSEPT];
const GORUS=+(Q.get('E')||CEVRE.E);
const camera=new THREE.PerspectiveCamera(2*Math.atan(GORUS/2/YUK)*180/Math.PI,RW/RH,1,1500);
camera.up.set(0,0,1);camera.position.set(0,YUK,MERKEZ_Z);camera.lookAt(0,0,MERKEZ_Z);
scene.background=new THREE.Color(GECE?'#0c1322':CEVRE.arka);
isiklar();sahaKur();oyuncular();tribunler();projektorler(CEVRE);panolar();tabela();
zeminKur(CEVRE);CEVRE.kur();agaclarKur();kayalarKur();
document.getElementById('bilgi').textContent=CEVRE.ad+' · '+A.ad+(GECE?' · gece':'')+' — kapasite ~'+KISILER.length+' kişi görünür';
let kare=0;function ciz(){renderer.render(scene,camera);if(++kare===3)window.__hazir=true;if(kare<6)requestAnimationFrame(ciz);}
requestAnimationFrame(ciz);
/* klavye: 1–4 konsept, A kademe (0→1→2→0), G gece/gündüz; sayfa parametreyle yeniden yüklenir */
window.addEventListener('keydown',e=>{const q=new URLSearchParams(location.search);let d=false;
  if(e.key>='1'&&e.key<='4'){q.set('k',e.key);d=true;}
  else if(e.key==='a'||e.key==='A'){q.set('asama',String((ASAMA_NO+1)%3));d=true;}
  else if(e.key==='g'||e.key==='G'){q.set('gece',GECE?'0':'1');d=true;}
  if(d){location.search=q.toString();}});
