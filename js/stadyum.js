/* ============ Demirkapı '99 — stadyum: saha, reklam panoları, tribünler, tel örgü, pankart, bayraklar, skor tabelası, kaleler ============ */
/* ---- saha ---- */
function pitchCv(){
  const S=STIL.saha.pikselMetre,W=132*S,H=92*S,cv=mk(W,H),g=cv.getContext('2d'),X=x=>(x+66)*S,Z=z=>(z+46)*S;
  g.fillStyle=STIL.saha.pist;g.fillRect(0,0,W,H);
  g.fillStyle=STIL.saha.pistCizgi;for(let k=0;k<5;k++){const d=41.2+k*1.22;g.fillRect(0,Z(-d),W,1);g.fillRect(0,Z(d),W,1);g.fillRect(X(-d-20.5),0,1,H);g.fillRect(X(d+20.5),0,1,H);}
  g.fillStyle=STIL.saha.cimKoyu;g.fillRect(X(-60.5),Z(-40.5),121*S,81*S);
  {const SW=STIL.saha.seritGenisligi;g.fillStyle=STIL.saha.cimAcik;for(let x0=-52.5-2*SW;x0<60.5;x0+=2*SW){const p=Math.max(-60.5,x0),q=Math.min(60.5,x0+SW);if(q>p)g.fillRect(X(p),Z(-40.5),(q-p)*S,81*S);}}
  const wear=(cx,cz,r,a)=>{const gr=g.createRadialGradient(X(cx),Z(cz),0,X(cx),Z(cz),r*S);gr.addColorStop(0,'rgba('+STIL.saha.asinma+','+a+')');gr.addColorStop(1,'rgba('+STIL.saha.asinma+',0)');g.fillStyle=gr;g.fillRect(X(cx)-r*S,Z(cz)-r*S,2*r*S,2*r*S);};
  wear(48.5,0,6,0.6);wear(-48.5,0,6,0.6);wear(0,0,5,0.35);wear(41.5,0,3,0.35);
  g.strokeStyle=STIL.saha.cizgi;g.fillStyle=STIL.saha.cizgi;g.lineWidth=2;
  const arc=(cx,cz,r,a0,a1)=>{g.beginPath();g.arc(X(cx),Z(cz),r*S,a0,a1);g.stroke();};
  g.strokeRect(X(-52.5),Z(-34),105*S,68*S);g.beginPath();g.moveTo(X(0),Z(-34));g.lineTo(X(0),Z(34));g.stroke();
  arc(0,0,9.15,0,Math.PI*2);g.fillRect(X(0)-2,Z(0)-2,4,4);
  const th=Math.acos(5.5/9.15);
  for(const sd of[-1,1]){
    g.strokeRect(X(sd>0?36:-52.5),Z(-20.16),16.5*S,40.32*S);g.strokeRect(X(sd>0?47:-52.5),Z(-9.16),5.5*S,18.32*S);
    if(sd>0)arc(41.5,0,9.15,Math.PI-th,Math.PI+th);else arc(-41.5,0,9.15,-th,th);
    g.fillRect(X(sd*41.5)-2,Z(0)-2,4,4);
    for(const t of[-1,1]){const a0=sd>0?(t>0?Math.PI:Math.PI/2):(t>0?1.5*Math.PI:0);arc(sd*52.5,t*34,1,a0,a0+Math.PI/2);}
  }
  return cv;
}
{const gr=new THREE.Mesh(new THREE.PlaneGeometry(132,92,24,16),LAM({map:tx(pitchCv(),'l')}));gr.rotation.x=-Math.PI/2;scene.add(gr);
 const out=new THREE.Mesh(new THREE.PlaneGeometry(600,600),new THREE.MeshLambertMaterial({color:0x36373b}));out.rotation.x=-Math.PI/2;out.position.y=-3;scene.add(out);}

/* ---- reklam panoları (piksel yazı) ---- */
const ADS_CV=(()=>{const cv=mk(1024,16),g=cv.getContext('2d');ADS.forEach((a,i)=>{const x=i*128;g.fillStyle='rgb('+a[1]+')';g.fillRect(x,0,128,16);
  ctxText(g,a[0],x+((128-textW(a[0],2))>>1),1,'rgb('+a[2]+')',2);g.fillStyle='rgba(0,0,0,0.35)';g.fillRect(x,0,1,16);});return cv;})();
function board(len,x,z,rot){const side=LAM({color:0x202226}),face=BAS({map:tx(ADS_CV,'m',[len/64,1])});
  const b=new THREE.Mesh(new THREE.BoxGeometry(len,0.9,0.12),[side,side,side,side,face,side]);b.position.set(x,0.45,z);b.rotation.y=rot;scene.add(b);}
board(112,0,-38.2,0);board(76,57.8,0,-Math.PI/2);board(76,-57.8,0,Math.PI/2);board(112,0,38.2,Math.PI);

/* ---- tribünler: düz dokulu seyirci, iki kareyle sallanıyor ---- */
const PAL_HOME=STIL.seyirci.ev,PAL_MIX=STIL.seyirci.karisik,PAL_AWAY=STIL.seyirci.deplasman;
function crowdCv(pal,seed,frame){
  const cv=mk(128,64),g=cv.getContext('2d');g.fillStyle='#26262b';g.fillRect(0,0,128,64);
  for(let r=0;r<8;r++){g.fillStyle='#4e4e55';g.fillRect(0,r*8+6,128,2);
    for(let c=0;c<32;c++){
      if(h2(c+seed,r+seed*3)>0.94)continue;
      const up=frame&&h2(c+seed,r+77)>0.45?1:0,x=c*4,y=r*8-up,sh=pal[Math.floor(h2(c*3+seed,r*5)*pal.length)];
      g.fillStyle=sh;g.fillRect(x,y+3,3,4);
      g.fillStyle=h2(c,r*3+seed)<0.22?'#8a5a3c':'#d6a27a';g.fillRect(x+(r&1),y+1,2,2);
      if(h2(c+9,r+seed)>0.45){g.fillStyle='#24180f';g.fillRect(x+(r&1),y+1,2,1);}
      if(frame&&h2(c+seed,r+31)>0.72){g.fillStyle=sh;g.fillRect(x,y-1,1,3);g.fillRect(x+2,y-1,1,3);}
    }}
  return cv;
}
const crowdMats=[];
function crowdMat(pal,seed,len,sl){const rep=[len/16,sl/7.2],t0=tx(crowdCv(pal,seed,0),'m',rep),t1=tx(crowdCv(pal,seed,1),'m',rep),m=LAM({map:t0});crowdMats.push({m,t0,t1,ph:rnd()});return m;}
const lamps=[];
function stand(o){
  const g=new THREE.Group(),D=o.d,sl=Math.hypot(o.y1-o.y0,D),ang=Math.atan2(o.y1-o.y0,D);
  for(const s of o.sec){
    const L=s.to-s.from,m=s.pal?crowdMat(s.pal,s.seed,L,sl):LAM({color:0x5c5d62});
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(L,sl,Math.max(2,Math.round(L/8)),4),m);
    pl.rotation.x=-(Math.PI/2-ang);pl.position.set((s.from+s.to)/2,(o.y0+o.y1)/2,-D/2);g.add(pl);
  }
  box(o.len,o.y0,0.4,LAM({color:0x6d6e72}),0,o.y0/2,0.2,g);
  box(o.len,o.y1+1,0.6,LAM({color:0x4d4e53}),0,(o.y1+1)/2,-D-0.3,g);
  for(const sx of[-1,1]){const w=box(0.5,o.y1+1,D,LAM({color:0x5a5b60}),sx*(o.len/2+0.25),(o.y1+1)/2,-D/2,g);w.scale.y=1;}
  if(o.roof){const R=o.roof;box(o.len+4,0.6,R.f-R.b,LAM({color:0x8c9096}),0,R.y,(R.f+R.b)/2,g);
    box(o.len+4,1,0.8,LAM({color:0x3c3f44}),0,R.y-0.7,R.f,g);
    for(let x=-o.len/2;x<=o.len/2+0.1;x+=o.len/6)box(0.5,R.y,0.5,LAM({color:0x4a4d52}),x,R.y/2,R.b+0.5,g);
    for(let x=-o.len/2+4;x<=o.len/2-3.9;x+=8){box(2,0.5,0.4,BAS({color:0xfff4d8}),x,R.y-1.3,R.f+0.3,g);
      const s=glow(0xffe9c0,7,0.55);s.position.set(x,R.y-1.3,R.f+1.2);g.add(s);lamps.push(s);}}
  g.position.set(o.pos[0],0,o.pos[1]);g.rotation.y=o.rot;scene.add(g);return g;
}
stand({len:124,d:22,y0:1.2,y1:17,pos:[0,-44],rot:0,roof:{y:21,f:-10,b:-24},
  sec:[{from:-62,to:34,pal:PAL_MIX,seed:11},{from:34,to:38},{from:38,to:62,pal:PAL_AWAY,seed:23}]});
const endR=stand({len:80,d:20,y0:1.2,y1:15,pos:[64,0],rot:-Math.PI/2,roof:{y:19,f:-9,b:-22},sec:[{from:-40,to:40,pal:PAL_HOME,seed:37}]});
stand({len:80,d:20,y0:1.2,y1:15,pos:[-64,0],rot:Math.PI/2,roof:{y:19,f:-9,b:-22},sec:[{from:-40,to:40,pal:PAL_MIX,seed:53}]});
stand({len:124,d:12,y0:1.2,y1:8.5,pos:[0,44],rot:Math.PI,sec:[{from:-62,to:62,pal:PAL_MIX,seed:71}]});

/* ---- tel örgü, pankart, bayraklar ---- */
const FENCE_CV=(()=>{const cv=mk(8,8),g=cv.getContext('2d');g.fillStyle='rgba(176,182,190,0.95)';for(let i=0;i<8;i++){g.fillRect(i,i,1,1);g.fillRect(7-i,i,1,1);}return cv;})();
function fence(len,x,z,rot){const gr=new THREE.Group();gr.position.set(x,0,z);gr.rotation.y=rot;scene.add(gr);
  const f=new THREE.Mesh(new THREE.PlaneGeometry(len,3,8,1),LAM({map:tx(FENCE_CV,'m',[len/0.4,3/0.4]),transparent:true,depthWrite:false,side:THREE.DoubleSide}));f.position.y=1.5;gr.add(f);
  const pm=LAM({color:0x7a7f86});box(len,0.08,0.08,pm,0,3,0,gr);for(let u=-len/2;u<=len/2+0.1;u+=4)box(0.08,3,0.08,pm,u,1.5,0,gr);}
fence(80,62.6,0,-Math.PI/2);fence(124,0,-42.6,0);
{const s='DEMİRKAPI SENİ SEVİYORUZ',cv=mk(textW(s,1)+6,11),g=cv.getContext('2d');g.fillStyle=STIL.pankart.zemin;g.fillRect(0,0,cv.width,11);g.fillStyle=STIL.pankart.yazi;g.fillRect(0,0,cv.width,1);g.fillRect(0,10,cv.width,1);
 ctxText(g,s,3,2,STIL.pankart.yazi,1);const b=new THREE.Mesh(new THREE.PlaneGeometry(34,3.2),LAM({map:tx(cv,'m')}));b.position.set(-13,2.8,-1.2);b.rotation.x=-0.25;endR.add(b);}
const FLAG_CV=[(()=>{const cv=mk(24,16),g=cv.getContext('2d');g.fillStyle='#d61e24';g.fillRect(0,0,24,16);g.fillStyle='#fff';
   g.beginPath();g.arc(9,8,4.4,0,6.3);g.fill();g.fillStyle='#d61e24';g.beginPath();g.arc(10.3,8,3.5,0,6.3);g.fill();g.fillStyle='#fff';g.fillRect(14,7,2,2);g.fillRect(15,6,1,4);g.fillRect(14,8,3,1);return cv;})(),
  (()=>{const cv=mk(24,16),g=cv.getContext('2d');g.fillStyle='#c8281e';g.fillRect(0,0,24,8);g.fillStyle='#efe9dc';g.fillRect(0,8,24,8);return cv;})()];
const flags=[];
for(const [u,t,k] of[[-30,0.35,1],[-22,0.62,0],[-8,0.28,1],[-1,0.5,0],[-35,0.7,0],[4,0.25,1]]){
  const y=1.2+t*13.8,lz=-t*20,m=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.7,6,1),LAM({map:tx(FLAG_CV[k],'n'),side:THREE.DoubleSide}));
  m.position.set(u+1.3,y+2.4,lz);endR.add(m);box(0.05,2.8,0.05,LAM({color:0x9a9a9a}),u,y+1.6,lz,endR);
  flags.push({m,base:Float32Array.from(m.geometry.attributes.position.array),ph:rnd()*6});}

/* ---- ampullü skor tabelası (köşede) ---- */
const SB_CV=mk(96,24);
{const g=SB_CV.getContext('2d');g.fillStyle=STIL.tabela.zemin;g.fillRect(0,0,96,24);g.fillStyle='#24160a';for(let y=0;y<24;y+=2)for(let x=(y>>1)&1;x<96;x+=2)g.fillRect(x,y,1,1);
 ctxText(g,'DEM 1-1 AKD',(96-textW('DEM 1-1 AKD',2))>>1,0,STIL.tabela.ampul,2);ctxText(g,'DAKİKA 89',(96-textW('DAKİKA 89',1))>>1,16,STIL.tabela.ikincil,1);
 const sb=new THREE.Group();sb.position.set(74,0,-46);sb.rotation.y=Math.atan2(-74,46);scene.add(sb);
 const lm=LAM({color:0x3a3d42});box(0.6,5.6,0.6,lm,-4.5,2.8,0,sb);box(0.6,5.6,0.6,lm,4.5,2.8,0,sb);box(13.4,4.8,1,LAM({color:0x1c1d20}),0,7.6,-0.3,sb);
 const f=new THREE.Mesh(new THREE.PlaneGeometry(12.6,3.9),BAS({map:tx(SB_CV,'n')}));f.position.set(0,7.6,0.22);sb.add(f);
 const s=glow(0xffb530,16,0.28);s.position.set(0,7.6,1.2);sb.add(s);}

/* ---- kaleler ---- */
const NET_CV=(()=>{const cv=mk(8,8),g=cv.getContext('2d');g.fillStyle='rgba(235,235,235,1)';g.fillRect(0,0,8,1);g.fillRect(0,0,1,8);return cv;})();
const POSTM=LAM({color:0xf4f4f0});
function netM(w,h){return LAM({map:tx(NET_CV,'m',[w/0.16,h/0.16]),transparent:true,depthWrite:false,side:THREE.DoubleSide});}
for(const sd of[-1,1]){
  const gx=sd*52.5,bx=sd*54.4;
  for(const z of[-3.72,3.72]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,2.5,6),POSTM);p.position.set(gx+sd*0.07,1.25,z);scene.add(p);
    box(0.05,2.2,0.05,LAM({color:0x8a8e94}),bx,1.1,z);}
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,7.58,6),POSTM);bar.rotation.x=Math.PI/2;bar.position.set(gx+sd*0.07,2.47,0);scene.add(bar);
  const back=new THREE.Mesh(new THREE.PlaneGeometry(7.44,2.2),netM(7.44,2.2));back.rotation.y=Math.PI/2;back.position.set(bx,1.1,0);scene.add(back);
  const top=new THREE.Mesh(new THREE.PlaneGeometry(1.9,7.44),netM(1.9,7.44));top.rotation.x=-Math.PI/2;top.position.set((gx+bx)/2,2.34,0);scene.add(top);
  for(const z of[-3.72,3.72]){const sn=new THREE.Mesh(new THREE.PlaneGeometry(1.9,2.4),netM(1.9,2.4));sn.position.set((gx+bx)/2,1.2,z);scene.add(sn);}
  for(const t of[-1,1]){box(0.04,1.5,0.04,POSTM,gx,0.75,t*34);const fl=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.3),LAM({color:0xd8281e,side:THREE.DoubleSide}));fl.position.set(gx-sd*0.2,1.35,t*34);scene.add(fl);}
}
