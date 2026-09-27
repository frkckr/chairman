/* ============ Demirkapı '99 — oyuncular: model, pozlar, donmuş an dizilimi, top ============ */
/* ============ oyuncular: kutulardan kurulu az poligonlu modeller, 16 piksellik dokular ============ */
function dk(hex,f){const n=parseInt(hex.slice(1),16);return 'rgb('+(((n>>16)&255)*f|0)+','+(((n>>8)&255)*f|0)+','+((n&255)*f|0)+')';}
function numText(g,s,x,y,col,out,sc){if(out)for(const d of[[-1,0],[1,0],[0,-1],[0,1]])ctxText(g,s,x+d[0],y+d[1],out,sc);ctxText(g,s,x,y,col,sc);}
function shirtFront(k){const cv=mk(16,16),g=cv.getContext('2d');g.fillStyle=k.shirt;g.fillRect(0,0,16,16);
  if(k.sash){g.fillStyle=k.sash;for(let i=0;i<16;i++)g.fillRect(i,13-i,1,4);}
  g.fillStyle=k.trim;g.fillRect(5,0,6,1);g.fillRect(6,1,1,1);g.fillRect(9,1,1,1);g.fillRect(7,2,2,1);g.fillRect(3,4,2,2);
  if(k.num&&!k.sash){const s=String(k.num);numText(g,s,13-textW(s,1),4,k.trim,k.out,1);}
  g.fillStyle=dk(k.shirt,0.78);g.fillRect(0,15,16,1);return cv;}
function shirtBack(k){const cv=mk(16,16),g=cv.getContext('2d');g.fillStyle=k.shirt;g.fillRect(0,0,16,16);g.fillStyle=k.trim;g.fillRect(5,0,6,1);
  if(k.num){const s=String(k.num);numText(g,s,(16-textW(s,2))>>1,1,k.trim,k.out,2);}return cv;}
function headMats(k){
  const bald=k.style==='bald',curly=k.style==='curly',longH=k.style==='long'||k.style==='mullet',hr=k.hair,sk=k.skin;
  const F=mk(16,16),g=F.getContext('2d');g.fillStyle=sk;g.fillRect(0,0,16,16);g.fillStyle=hr;
  if(bald){g.fillRect(0,5,2,3);g.fillRect(14,5,2,3);}else{g.fillRect(0,0,16,curly?5:4);g.fillRect(0,4,2,4);g.fillRect(14,4,2,4);}
  if(k.beard){g.fillRect(1,10,14,6);g.fillStyle=sk;g.fillRect(4,10,8,1);}
  g.fillStyle='#16110d';g.fillRect(4,7,2,2);g.fillRect(10,7,2,2);g.fillStyle=dk(sk,0.82);g.fillRect(7,8,2,3);
  if(k.mus){g.fillStyle=hr;g.fillRect(4,11,8,1);}g.fillStyle='#7a3c30';g.fillRect(6,13,4,1);
  const S=mk(16,16),s=S.getContext('2d');s.fillStyle=sk;s.fillRect(0,0,16,16);s.fillStyle=hr;
  if(bald)s.fillRect(0,6,16,3);else s.fillRect(0,0,16,longH?9:5);
  if(k.beard)s.fillRect(0,11,16,5);
  s.fillStyle=dk(sk,0.8);s.fillRect(7,7,2,3);
  const Bk=mk(16,16),b=Bk.getContext('2d');b.fillStyle=sk;b.fillRect(0,0,16,16);b.fillStyle=hr;
  if(bald)b.fillRect(0,6,16,5);else b.fillRect(0,0,16,longH?16:11);
  const side=LAM({map:tx(S,'n')});
  return[side,side,LAM({color:bald?sk:hr}),LAM({color:sk}),LAM({map:tx(F,'n')}),LAM({map:tx(Bk,'n')})];
}
function player(k){
  const c=col=>LAM({color:col}),sS=c(k.shirt),skin=c(k.skin),ls=k.gk||k.ls,hairM=c(k.hair);
  const B=(w,h,d,m,p,x,y,z)=>{const me=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);me.position.set(x,y,z);p.add(me);return me;};
  const root=new THREE.Group(),hip=new THREE.Group();hip.position.y=0.95;root.add(hip);
  B(0.34,0.22,0.21,c(k.shorts),hip,0,0.02,0);
  B(0.42,0.54,0.23,[sS,sS,sS,sS,LAM({map:tx(shirtFront(k),'n')}),LAM({map:tx(shirtBack(k),'n')})],hip,0,0.39,0);
  B(0.1,0.08,0.1,skin,hip,0,0.7,0);
  const head=new THREE.Group();head.position.y=0.84;hip.add(head);B(0.22,0.26,0.24,headMats(k),head,0,0,0);
  if(k.style==='long')B(0.23,0.26,0.07,hairM,head,0,-0.12,-0.13);
  if(k.style==='mullet')B(0.2,0.2,0.06,hairM,head,0,-0.15,-0.13);
  if(k.style==='curly'){B(0.28,0.11,0.28,hairM,head,0,0.16,0);B(0.26,0.12,0.06,hairM,head,0,0.04,-0.14);}
  const arm=sx=>{const a=new THREE.Group();a.position.set(sx*0.27,0.6,0);hip.add(a);B(0.12,0.15,0.12,sS,a,0,-0.06,0);B(0.1,0.3,0.1,ls?sS:skin,a,0,-0.15,0);
    const e=new THREE.Group();e.position.y=-0.3;a.add(e);B(0.09,0.27,0.09,ls?sS:skin,e,0,-0.135,0);B(0.09,0.09,0.08,k.glove?c(k.glove):skin,e,0,-0.3,0);return[a,e];};
  const leg=sx=>{const l=new THREE.Group();l.position.set(sx*0.1,-0.04,0);hip.add(l);B(0.17,0.2,0.18,c(k.shorts),l,0,-0.08,0);B(0.15,0.44,0.16,skin,l,0,-0.22,0);
    const kn=new THREE.Group();kn.position.y=-0.44;l.add(kn);
    if(k.rolled){B(0.12,0.2,0.13,skin,kn,0,-0.1,0);B(0.14,0.05,0.15,c(k.socks),kn,0,-0.21,0);B(0.12,0.22,0.13,c(k.socks),kn,0,-0.33,0);}
    else B(0.12,0.44,0.13,c(k.socks),kn,0,-0.22,0);
    B(0.12,0.08,0.26,c(k.boots||'#18181a'),kn,0,-0.46,0.05);return[l,kn];};
  const[aL,eL]=arm(-1),[aR,eR]=arm(1),[lL,kL]=leg(-1),[lR,kR]=leg(1);
  root.scale.set(k.w||1,k.h||1,k.w||1);
  return{root,hip,head,aL,eL,aR,eR,lL,kL,lR,kR};
}
function pose(r,P){
  r.hip.rotation.set(P.lean||0,0,0);r.hip.position.y=0.95+(P.dy||0);r.head.rotation.x=P.hx||0;
  r.lL.rotation.set(P.lL||0,0,0);r.kL.rotation.x=P.kL||0;r.lR.rotation.set(P.lR||0,0,0);r.kR.rotation.x=P.kR||0;
  r.aL.rotation.set(P.aL||0,0,P.aLz||0);r.aR.rotation.set(P.aR||0,0,P.aRz||0);r.eL.rotation.x=P.eL||0;r.eR.rotation.x=P.eR||0;
}
const POSE={
  shoot:{lean:-0.22,lR:-1.35,kR:0.25,lL:0.3,kL:0.35,aL:-0.35,aLz:-1.05,aR:0.55,aRz:0.8,eL:-0.3,eR:-0.4,hx:0.15},
  runA:{lean:0.2,lL:-0.75,kL:0.35,lR:0.6,kR:1.35,aL:0.65,aR:-0.7,eL:-1.1,eR:-1.1,aLz:-0.1,aRz:0.1},
  runB:{lean:0.2,lL:0.6,kL:1.35,lR:-0.75,kR:0.35,aL:-0.7,aR:0.65,eL:-1.1,eR:-1.1,aLz:-0.1,aRz:0.1},
  slide:{lean:-1.05,dy:-0.5,lR:-1.5,kR:0.05,lL:-0.55,kL:1.5,aL:0.3,aLz:-0.9,aR:0.6,aRz:0.6,eL:-0.2,eR:-0.4,hx:0.5},
  dive:{lL:0.25,kL:0.5,lR:-0.35,kR:0.2,aLz:-2.9,aRz:2.9,eL:-0.1,eR:-0.1},
  ready:{lean:0.25,dy:-0.08,lL:-0.2,kL:0.45,lR:0.15,kR:0.4,aL:-0.3,aR:-0.3,aLz:-0.35,aRz:0.35,eL:-0.6,eR:-0.6}
};
const KIT={home:STIL.formalar.ev,away:STIL.formalar.deplasman,agk:STIL.formalar.deplasmanKaleci,ref:STIL.formalar.hakem};
const SKIN=STIL.tenler;
const LIGHTS=STIL.golge.projektorler,SHADOW=BAS({color:0x000000,transparent:true,opacity:STIL.golge.opaklik,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
function shadows(x,z,h){for(const L of LIGHTS){const dx=x-L[0],dz=z-L[1],d=Math.hypot(dx,dz),len=1.85*(h||1)*d/(STIL.golge.projektorYuksekligi-2),g=new THREE.Group();g.position.set(x,0.04,z);g.rotation.y=Math.atan2(dx,dz);
  const p=new THREE.Mesh(new THREE.PlaneGeometry(0.36,len),SHADOW);p.rotation.x=-Math.PI/2;p.position.z=len/2;g.add(p);scene.add(g);}}
const radarDots=[],actors=[];
function put(o,x,z,face,P,air){
  const K={...KIT[o.kit],num:o.num,skin:SKIN[o.si||0],hair:o.hc||'#241a12',mus:o.mus,beard:o.beard,style:o.style||'short',h:o.h||1,w:o.w||1,boots:o.boots,rolled:o.rolled,ls:o.ls};
  const r=player(K);
  r.root.position.set(x,air?air.y:0,z);r.root.rotation.set(0,Math.atan2(face[0]-x,face[1]-z),air?air.tilt:0);pose(r,P);scene.add(r.root);
  shadows(x,z,o.h);radarDots.push([x,z,o.kit]);actors.push({x,z,top:2.02*(o.h||1)+(P.dy||0),kit:o.kit,num:o.num,signed:!!o.signed});
  return r;
}
/* donmuş an: 89. dakika, Kadir uzak köşeye vuruyor, kaleci uçuyor. Her oyuncunun boyu, yapısı ve saçı farklı. */
put({kit:'home',num:9,si:1,hc:'#241a12',mus:true,h:1.02,w:1.06},38.6,-0.4,[52.5,-3],POSE.shoot);
put({kit:'home',num:10,si:4,hc:'#dcb660',style:'mullet',h:1.09,w:0.93,boots:'#f2f2f2',signed:true},45.2,7.6,[50,2],POSE.runB);
put({kit:'home',num:7,si:3,hc:'#141212',style:'curly',h:0.9,w:1.08,rolled:true},35.5,-13.5,[45,-8],POSE.runA);
put({kit:'agk',num:1,si:0,hc:'#141212',style:'bald',h:1.1},51.2,-0.5,[40,-0.5],POSE.dive,{y:0.8,tilt:1.35});
put({kit:'away',num:4,si:2,hc:'#3c2616',beard:true,w:1.12},41.0,1.8,[38.6,-0.6],POSE.slide);
put({kit:'away',num:5,si:4,hc:'#5a4028',style:'long',h:1.06},46.8,-7.4,[52,-2],POSE.runA);
put({kit:'away',num:6,si:1,hc:'#241a12',style:'bald',mus:true,h:0.93,w:1.05},48.6,3.6,[38.6,-0.4],POSE.ready);
put({kit:'away',num:8,si:0,hc:'#a0522d',rolled:true},34.2,3.2,[38.6,-0.4],POSE.runB);
put({kit:'ref',num:0,si:1,hc:'#8a8680',style:'bald',mus:true,w:1.06},29.5,-9.6,[40,-6],POSE.runA);
{const lin=put({kit:'ref',num:0,si:4,hc:'#3c2616'},42,-35.3,[50,-35.3],POSE.runB);box(0.3,0.2,0.02,LAM({color:0xf2c11d}),0,-0.36,0.12,lin.eR);}
for(const [x,z,k] of[[-51,0,'hgk'],[-30,-12,'home'],[-24,10,'home'],[-6,-20,'home'],[-4,18,'home'],[12,-2,'home'],[20,22,'home'],[24,-24,'home'],
  [16,-8,'away'],[26,14,'away'],[22,-16,'away'],[6,6,'away']])radarDots.push([x,z,k]);
const ballM=new THREE.Mesh(new THREE.IcosahedronGeometry(0.13,0),LAM({color:0xf6f6f2}));ballM.position.set(43.6,1.05,-1.25);scene.add(ballM);
{const s=new THREE.Mesh(new THREE.CircleGeometry(0.15,8),SHADOW);s.rotation.x=-Math.PI/2;s.position.set(43.6,0.04,-1.25);scene.add(s);}
