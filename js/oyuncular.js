/* ============ Demirkapı '99 — oyuncular: kutulardan kurulu model ve pozlar. Maçtaki hareketi js/mac-sahnesi.js verir ============ */
/* ============ oyuncular: kutulardan kurulu az poligonlu modeller, 16 piksellik dokular ============ */
function dk(hex,f){const n=parseInt(hex.slice(1),16);return 'rgb('+(((n>>16)&255)*f|0)+','+(((n>>8)&255)*f|0)+','+((n&255)*f|0)+')';}
function numText(g,s,x,y,col,out,sc){if(out)for(const d of[[-1,0],[1,0],[0,-1],[0,1]])ctxText(g,s,x+d[0],y+d[1],out,sc);ctxText(g,s,x,y,col,sc);}
/* ---- doku atlası: her insanın 64x64'lük tek dokusu. 16'lık kareler: forma önü/arkası, yüz, başın yanı ve arkası; altta düz renk kareleri ---- */
const ATLAS=64,KARE={formaOn:[0,0],formaArka:[16,0],yuz:[32,0],basYan:[48,0],basArka:[0,16]};
const RENK_KARE=['shirt','shorts','socks','skin','hair','boots','glove','trim','ek1','ek2','ek3','ek4'];
function shirtFront(g,k,ox,oy){g.fillStyle=k.shirt;g.fillRect(ox,oy,16,16);
  if(k.sash){g.fillStyle=k.sash;for(let i=0;i<16;i++)g.fillRect(ox+i,oy+13-i,1,4);}
  g.fillStyle=k.trim;g.fillRect(ox+5,oy,6,1);g.fillRect(ox+6,oy+1,1,1);g.fillRect(ox+9,oy+1,1,1);g.fillRect(ox+7,oy+2,2,1);g.fillRect(ox+3,oy+4,2,2);
  if(k.num&&!k.sash){const s=String(k.num);numText(g,s,ox+13-textW(s,1),oy+4,k.trim,k.out,1);}
  g.fillStyle=dk(k.shirt,0.78);g.fillRect(ox,oy+15,16,1);}
function shirtBack(g,k,ox,oy){g.fillStyle=k.shirt;g.fillRect(ox,oy,16,16);g.fillStyle=k.trim;g.fillRect(ox+5,oy,6,1);
  if(k.num){const s=String(k.num);numText(g,s,ox+((16-textW(s,2))>>1),oy+1,k.trim,k.out,2);}}
function headTiles(g,k){
  const bald=k.style==='bald',curly=k.style==='curly',longH=k.style==='long'||k.style==='mullet',hr=k.hair,sk=k.skin;
  let [x,y]=KARE.yuz;g.fillStyle=sk;g.fillRect(x,y,16,16);g.fillStyle=hr;
  if(bald){g.fillRect(x,y+5,2,3);g.fillRect(x+14,y+5,2,3);}else{g.fillRect(x,y,16,curly?5:4);g.fillRect(x,y+4,2,4);g.fillRect(x+14,y+4,2,4);}
  if(k.beard){g.fillRect(x+1,y+10,14,6);g.fillStyle=sk;g.fillRect(x+4,y+10,8,1);}
  g.fillStyle='#16110d';g.fillRect(x+4,y+7,2,2);g.fillRect(x+10,y+7,2,2);g.fillStyle=dk(sk,0.82);g.fillRect(x+7,y+8,2,3);
  if(k.mus){g.fillStyle=hr;g.fillRect(x+4,y+11,8,1);}g.fillStyle='#7a3c30';g.fillRect(x+6,y+13,4,1);
  [x,y]=KARE.basYan;g.fillStyle=sk;g.fillRect(x,y,16,16);g.fillStyle=hr;
  if(bald)g.fillRect(x,y+6,16,3);else g.fillRect(x,y,16,longH?9:5);
  if(k.beard)g.fillRect(x,y+11,16,5);
  g.fillStyle=dk(sk,0.8);g.fillRect(x+7,y+7,2,3);
  [x,y]=KARE.basArka;g.fillStyle=sk;g.fillRect(x,y,16,16);g.fillStyle=hr;
  if(bald)g.fillRect(x,y+6,16,5);else g.fillRect(x,y,16,longH?16:11);
}
function atlasCiz(k,ekRenkler){
  const cv=mk(ATLAS,ATLAS),g=cv.getContext('2d');
  shirtFront(g,k,...KARE.formaOn);shirtBack(g,k,...KARE.formaArka);headTiles(g,k);
  const renk={shirt:k.shirt,shorts:k.shorts,socks:k.socks,skin:k.skin,hair:k.hair,boots:k.boots||'#18181a',glove:k.glove||k.skin,trim:k.trim,...(ekRenkler||{})};
  RENK_KARE.forEach((ad,i)=>{g.fillStyle=renk[ad]||'#ff00ff';g.fillRect((i%8)*8,32+Math.floor(i/8)*8,8,8);});
  return cv;
}
/* atlas içinde bir yüzün uv dikdörtgeni: doku karesi ya da düz renk karesinin ortası */
function uvKare(ad){const [x,y]=KARE[ad];return[x/ATLAS,1-(y+16)/ATLAS,(x+16)/ATLAS,1-y/ATLAS];}
function uvRenk(ad){const i=RENK_KARE.indexOf(ad),x=(i%8)*8+4,y=32+Math.floor(i/8)*8+4;return[x/ATLAS,1-y/ATLAS,x/ATLAS,1-y/ATLAS];}

/* ---- insan modeli: kutular tek bir kemikli modelde (SkinnedMesh) birleşir; her kutu tek kemiğe bağlıdır.
   Dönen nesne eski arayüzle aynıdır: root, hip, head, aL, eL, aR, eR, lL, kL, lR, kR (hepsi kemik) ---- */
const YUZ_SIRASI=['px','nx','py','ny','pz','nz'];
function player(k,ekRenkler){
  const ls=k.gk||k.ls,uv={};
  const R=ad=>uv[ad]||(uv[ad]=uvRenk(ad));
  const kemik=(ad,parent,x,y,z)=>{const b=new THREE.Bone();b.name=ad;b.position.set(x,y,z);if(parent)parent.add(b);return b;};
  const hip=kemik('hip',null,0,0.95,0),head=kemik('head',hip,0,0.84,0);
  const aL=kemik('aL',hip,-0.27,0.6,0),eL=kemik('eL',aL,0,-0.3,0),aR=kemik('aR',hip,0.27,0.6,0),eR=kemik('eR',aR,0,-0.3,0);
  const lL=kemik('lL',hip,-0.1,-0.04,0),kL=kemik('kL',lL,0,-0.44,0),lR=kemik('lR',hip,0.1,-0.04,0),kR=kemik('kR',lR,0,-0.44,0);
  const kemikler=[hip,head,aL,eL,aR,eR,lL,kL,lR,kR];
  const parcalar=[];
  const kutu=(kem,w,h,d,x,y,z,yuzler)=>parcalar.push({kem,w,h,d,x,y,z,yuzler});
  const tek=ad=>{const u=R(ad);return[u,u,u,u,u,u];};
  kutu(hip,0.34,0.22,0.21,0,0.02,0,tek('shorts'));
  {const f=R('shirt');kutu(hip,0.42,0.54,0.23,0,0.39,0,[f,f,f,f,uvKare('formaOn'),uvKare('formaArka')]);}
  kutu(hip,0.1,0.08,0.1,0,0.7,0,tek('skin'));
  {const yan=uvKare('basYan');kutu(head,0.22,0.26,0.24,0,0,0,[yan,yan,R(k.style==='bald'?'skin':'hair'),R('skin'),uvKare('yuz'),uvKare('basArka')]);}
  if(k.style==='long')kutu(head,0.23,0.26,0.07,0,-0.12,-0.13,tek('hair'));
  if(k.style==='mullet')kutu(head,0.2,0.2,0.06,0,-0.15,-0.13,tek('hair'));
  if(k.style==='curly'){kutu(head,0.28,0.11,0.28,0,0.16,0,tek('hair'));kutu(head,0.26,0.12,0.06,0,0.04,-0.14,tek('hair'));}
  for(const [a,e] of[[aL,eL],[aR,eR]]){
    kutu(a,0.12,0.15,0.12,0,-0.06,0,tek('shirt'));kutu(a,0.1,0.3,0.1,0,-0.15,0,tek(ls?'shirt':'skin'));
    kutu(e,0.09,0.27,0.09,0,-0.135,0,tek(ls?'shirt':'skin'));kutu(e,0.09,0.09,0.08,0,-0.3,0,tek(k.glove?'glove':'skin'));}
  for(const [l,kn] of[[lL,kL],[lR,kR]]){
    kutu(l,0.17,0.2,0.18,0,-0.08,0,tek('shorts'));kutu(l,0.15,0.44,0.16,0,-0.22,0,tek(k.pant?'shorts':'skin'));
    if(k.rolled){kutu(kn,0.12,0.2,0.13,0,-0.1,0,tek('skin'));kutu(kn,0.14,0.05,0.15,0,-0.21,0,tek('socks'));kutu(kn,0.12,0.22,0.13,0,-0.33,0,tek('socks'));}
    else kutu(kn,0.12,0.44,0.13,0,-0.22,0,tek('socks'));
    kutu(kn,0.12,0.08,0.26,0,-0.46,0.05,tek('boots'));}
  if(k.ekParcalar)for(const e of k.ekParcalar)kutu({hip,head,aL,eL,aR,eR,lL,kL,lR,kR}[e.kemik],e.w,e.h,e.d,e.x,e.y,e.z,tek(e.renk));
  /* geometri: kutuların köşeleri kemiklerin bağlanma (düz duruş) konumuna yerleşir */
  hip.updateMatrixWorld(true);
  const pos=[],nor=[],uvs=[],si=[],sw=[],idx=[],V=new THREE.Vector3();
  for(const pc of parcalar){
    const g=new THREE.BoxGeometry(pc.w,pc.h,pc.d),P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv,o=pos.length/3,bi=kemikler.indexOf(pc.kem);
    for(let i=0;i<P.count;i++){
      V.set(P.getX(i)+pc.x,P.getY(i)+pc.y,P.getZ(i)+pc.z).applyMatrix4(pc.kem.matrixWorld);pos.push(V.x,V.y,V.z);
      nor.push(N.getX(i),N.getY(i),N.getZ(i));
      const r=pc.yuzler[Math.floor(i/4)];uvs.push(r[0]+U.getX(i)*(r[2]-r[0]),r[1]+U.getY(i)*(r[3]-r[1]));
      si.push(bi,0,0,0);sw.push(1,0,0,0);}
    for(const j of g.index.array)idx.push(o+j);g.dispose();}
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geo.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(si,4));geo.setAttribute('skinWeight',new THREE.Float32BufferAttribute(sw,4));geo.setIndex(idx);
  geo.computeBoundingSphere();geo.boundingSphere.radius+=0.6;
  const mesh=new THREE.SkinnedMesh(geo,LAM({map:tx(atlasCiz(k,ekRenkler),'n'),skinning:true}));
  mesh.add(hip);mesh.bind(new THREE.Skeleton(kemikler));
  const root=new THREE.Group();root.add(mesh);root.scale.set(k.w||1,k.h||1,k.w||1);
  return{root,mesh,hip,head,aL,eL,aR,eR,lL,kL,lR,kR,kemikler};
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
  ready:{lean:0.25,dy:-0.08,lL:-0.2,kL:0.45,lR:0.15,kR:0.4,aL:-0.3,aR:-0.3,aLz:-0.35,aRz:0.35,eL:-0.6,eR:-0.6},
  otur:{dy:-0.4,lL:-1.45,kL:1.45,lR:-1.45,kR:1.45,aL:-0.35,aR:-0.35,eL:-0.9,eR:-0.9,aLz:-0.05,aRz:0.05},
  sevinc:{aLz:-2.6,aRz:2.6,eL:-0.2,eR:-0.2,hx:-0.25},
  kafa:{hx:-0.45,dy:0.25,aLz:-0.5,aRz:0.5,lL:-0.2,kL:0.5},
  tac:{aL:-2.8,aR:-2.8,eL:-0.5,eR:-0.5,lean:-0.15},
  tutus:{aL:-1.1,aR:-1.1,eL:-0.8,eR:-0.8},
  mars:{aR:-0.55,eR:-1.95,aRz:0.3,aL:0.02,aLz:-0.05},
  isaret:{aR:-2.2,eR:-0.1,aRz:0.4},
  /* maç eylemleri. Modelde L harfli kemikler (yerel −x) oyuncunun sağ tarafıdır; aşağıdakiler sağ ayak/kol içindir,
     sol ayaklı oyuncuda aynala() ile çevrilir */
  vurusGeri:{lean:0.06,lL:0.8,kL:1.3,lR:-0.12,kR:0.3,aL:0.35,aLz:-0.55,aR:-0.4,aRz:0.7,eL:-0.4,eR:-0.3,hx:0.18},
  vurusTakip:{lean:-0.28,lL:-1.35,kL:0.12,lR:0.22,kR:0.35,aL:-0.35,aLz:-0.9,aR:0.5,aRz:1.0,eL:-0.4,eR:-0.3,hx:0.2},
  pasGeri:{lean:0.04,lL:0.45,kL:0.7,lR:-0.08,kR:0.25,aL:0.2,aLz:-0.35,aR:-0.2,aRz:0.4,eL:-0.4,eR:-0.4,hx:0.2},
  pasTakip:{lean:-0.12,lL:-0.75,kL:0.2,lR:0.12,kR:0.3,aL:-0.2,aLz:-0.5,aR:0.3,aRz:0.55,eL:-0.4,eR:-0.4,hx:0.2},
  kontrol:{lean:0.12,lL:-0.35,kL:0.55,lR:0.05,kR:0.25,aLz:-0.35,aRz:0.35,hx:0.35},
  gogus:{lean:-0.32,aL:-0.4,aR:-0.4,aLz:-0.85,aRz:0.85,eL:-0.3,eR:-0.3,hx:0.3,lL:-0.1,kL:0.3,lR:0.1,kR:0.3},
  mudahale:{lean:-0.12,dy:-0.12,lL:-1.05,kL:0.15,lR:0.35,kR:0.95,aL:0.35,aR:-0.4,aLz:-0.6,aRz:0.6,eL:-0.5,eR:-0.5},
  blok:{lean:0.05,aL:0.15,aR:0.15,aLz:-0.12,aRz:0.12,eL:-2.3,eR:-2.3,lL:-0.2,kL:0.3,lR:0.2,kR:0.3},
  dusus:{aL:-2.2,aR:-2.2,eL:-0.2,eR:-0.2,lL:0.2,lR:-0.1,kL:0.4,kR:0.3,hx:-0.4},
  yerde:{aL:-2.6,aR:-0.4,aLz:-0.4,aRz:0.3,eL:-0.4,eR:-0.6,lL:0.1,kL:0.6,lR:-0.2,kR:0.2,hx:-0.3},
  yumruk:{aL:-3.0,aR:-3.0,eL:-0.05,eR:-0.05,dy:0.18,hx:-0.35,lL:-0.3,kL:0.6},
  elleAtis:{lean:0.15,aL:-2.2,eL:-0.2,aR:0.4,aRz:0.3,lL:0.2,lR:-0.4,kR:0.3},
  tacAt:{lean:0.25,aL:-1.1,aR:-1.1,eL:-0.4,eR:-0.4,lL:0.25,lR:-0.35,kL:0.2,kR:0.4},
  tasi:{aL:-0.85,aR:-0.85,eL:-0.9,eR:-0.9,aLz:0.15,aRz:-0.15},
  itiraz:{aL:-0.5,aR:-0.5,aLz:-0.7,aRz:0.7,eL:-1.25,eR:-1.25,hx:-0.15},
  hakemDuduk:{aL:-2.5,eL:-0.2,aLz:-0.15,hx:-0.1},
  hakemYon:{aL:-1.55,eL:0,aLz:0},
  hakemAvantaj:{aL:-1.35,aR:-1.35,eL:0,eR:0,aLz:0.25,aRz:-0.25},
  hakemKart:{aL:-3.0,eL:0,aLz:-0.1,hx:-0.15},
  hakemPenalti:{aL:-1.0,eL:0,aLz:0},
  bayrak:{aR:-3.0,eR:0,aRz:0.05},
  tabela:{aL:-2.9,aR:-2.9,eL:-0.3,eR:-0.3,aLz:0.2,aRz:-0.2}
};
/* sağ ayak/kol pozunu sol tarafa çevir */
const AYNA={lL:'lR',lR:'lL',kL:'kR',kR:'kL',aL:'aR',aR:'aL',eL:'eR',eR:'eL',aLz:'aRz',aRz:'aLz'},AYNA_ONBELLEK=new Map();
function aynala(P){let A=AYNA_ONBELLEK.get(P);if(A)return A;A={};for(const k in P){const h=AYNA[k]||k;A[h]=(k==='aLz'||k==='aRz')?-P[k]:P[k];}AYNA_ONBELLEK.set(P,A);return A;}
/* formalar: kadrodaki forma adı → STIL.formalar */
const KIT=STIL.formalar;
const SAC_STILI={kisa:'short',kel:'bald',uzun:'long',mullet:'mullet',kivircik:'curly'};
/* kadro kaydından (js/kadrolar.js) model tarifi */
function kitKaydi(forma,k,num){return{...KIT[forma],num,skin:STIL.tenler[k.ten||0],hair:k.sacRenk||'#241a12',mus:k.biyik,beard:k.sakal,style:SAC_STILI[k.sac]||'short',h:k.boy||1,w:k.yapi||1,boots:k.krampon,rolled:k.sirik};}
