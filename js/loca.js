/* ============ loca içi (Başkan açısı) ============ */
const ov=new THREE.Scene(),ovCam=new THREE.PerspectiveCamera(44,RW/RH,0.02,20);ovCam.rotation.x=-0.06;
ov.add(new THREE.AmbientLight(0x6a6258,0.85));{const d=new THREE.DirectionalLight(0xffd9a8,0.95);d.position.set(-1,2,1);ov.add(d);}
{const cv=mk(32,16),g=cv.getContext('2d');g.fillStyle='#5a3620';g.fillRect(0,0,32,16);for(let y=0;y<16;y++){g.fillStyle=h2(y,3)>0.5?'#4a2c18':'#6a4228';g.fillRect(((h2(y,9)*32)|0),y,8+((h2(y,5)*14)|0),1);}
 const desk=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.06,0.9),LAM({map:tx(cv,'n',[6,2])}));desk.position.set(0,-0.52,-0.95);ov.add(desk);}
box(3.4,0.05,0.12,LAM({color:0x2a2522}),0,-0.465,-1.45,ov);
for(const s of[-1,1])box(0.035,2.4,0.05,LAM({color:0x1c1a19}),s*1.04,0.6,-1.46,ov);
{const tg=new THREE.Group();tg.position.set(0.36,-0.49,-1.2);ov.add(tg);
 const sc=new THREE.Mesh(new THREE.CylinderGeometry(0.062,0.05,0.01,8),LAM({color:0xefece4}));sc.position.y=0.005;tg.add(sc);
 const GP=[[0,0],[0.021,0],[0.018,0.014],[0.0155,0.032],[0.021,0.055],[0.026,0.078],[0.0285,0.097]].map(a=>new THREE.Vector2(a[0],a[1]));
 const gl=new THREE.Mesh(new THREE.LatheGeometry(GP,7),LAM({color:0xdfe8ee,transparent:true,opacity:0.35,side:THREE.DoubleSide,depthWrite:false}));gl.position.y=0.01;gl.renderOrder=2;tg.add(gl);
 const TP=[[0,0.006],[0.017,0.006],[0.0145,0.03],[0.02,0.055],[0.025,0.078],[0,0.078]].map(a=>new THREE.Vector2(a[0],a[1]));
 const tea=new THREE.Mesh(new THREE.LatheGeometry(TP,7),LAM({color:0x9a2a0c}));tea.position.y=0.01;tg.add(tea);}
{const cv=mk(32,20),g=cv.getContext('2d');g.fillStyle='#2b2521';g.fillRect(0,0,32,20);g.fillStyle='#16130f';g.fillRect(1,2,14,16);g.fillStyle='#6e675f';
 for(let y=3;y<17;y+=2)for(let x=2+(y&2?1:0);x<15;x+=2)g.fillRect(x,y,1,1);g.fillStyle='#d09a4c';g.fillRect(17,2,14,6);g.fillStyle='#d8261c';g.fillRect(23,2,1,6);
 g.fillStyle='#b4b2ac';g.fillRect(18,11,4,4);g.fillRect(25,11,4,4);g.fillStyle='#8e8a84';g.fillRect(0,0,32,1);
 const side=LAM({color:0x2b2521}),r=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.2,0.11),[side,side,side,side,LAM({map:tx(cv,'n')}),side]);
 r.position.set(-0.52,-0.41,-1.32);r.rotation.y=0.18;r.scale.setScalar(0.8);ov.add(r);
 const an=new THREE.Mesh(new THREE.BoxGeometry(0.006,0.42,0.006),LAM({color:0xd0d4d8}));an.position.set(0.17,0.26,0);an.rotation.z=-0.7;r.add(an);}
{const red=LAM({color:0xa8261c}),ph=new THREE.Group();ph.position.set(0.62,-0.49,-1.32);ph.rotation.y=-0.35;ph.scale.setScalar(0.85);ov.add(ph);
 box(0.2,0.08,0.18,red,0,0.04,0,ph);const d=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.01,8),LAM({color:0xece4d2}));d.rotation.x=0.9;d.position.set(0,0.07,0.05);ph.add(d);
 box(0.22,0.035,0.05,red,0,0.11,-0.01,ph);box(0.05,0.05,0.06,red,-0.1,0.1,-0.01,ph);box(0.05,0.05,0.06,red,0.1,0.1,-0.01,ph);}
