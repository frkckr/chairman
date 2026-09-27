/* ============ meşaleler ve duman ============ */
const flares=[],smoke=[];
for(const [u,t] of[[-30,0.3],[-24,0.55],[-17,0.2],[-11,0.45],[-5,0.35],[1,0.6],[-35,0.5]]){
  const p=new THREE.Vector3(64+t*20,1.2+t*13.8+1,u);
  const core=glow(0xffe8d8,1.1,1),hal=glow(0xff4a1e,6,0.8),wash=glow(0xff3a14,16,0.14);core.position.copy(p);hal.position.copy(p);wash.position.copy(p);scene.add(core,hal,wash);
  flares.push({p,core,hal,ph:rnd()*9,sm:rnd()*0.3});
}
function puff(p){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOWT,color:0xcfa8a0,transparent:true,opacity:0,depthWrite:false,fog:false}));s.position.set(p.x,p.y+0.4,p.z);scene.add(s);smoke.push({s,age:0,life:10+rnd()*4,r:1,vx:(rnd()-0.5)*0.3,vy:1.1+rnd()*0.5,vz:-0.5-rnd()*0.3});}
function fx(dt,t){
  for(const F of flares){const I=0.78+0.22*Math.sin(t*29+F.ph)*Math.sin(t*13.7+F.ph*2);F.core.material.opacity=I;F.hal.scale.setScalar(5.4+I*1.4);F.sm-=dt;if(F.sm<=0&&smoke.length<120){F.sm=0.35+rnd()*0.25;puff(F.p);}}
  for(let i=smoke.length-1;i>=0;i--){const S=smoke[i],s=S.s;S.age+=dt;s.position.x+=S.vx*dt;s.position.y+=S.vy*dt;s.position.z+=S.vz*dt;S.vy*=1-dt*0.07;S.r+=dt*(1.0+S.r*0.05);s.scale.setScalar(S.r*2);
    const k=S.age/S.life;s.material.opacity=Math.min(1,S.age*1.5)*0.3*(1-k);if(S.age>S.life){scene.remove(s);s.material.dispose();smoke.splice(i,1);}}
}
