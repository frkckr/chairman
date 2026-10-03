/* ============ C akışı senaryosu: varış süresi modeli (varisZamani) ile moveP'nin karşılaştırılması ============
   Rastgele başlangıçlar (konum, hız, yön, bakış, yorgunluk, sprint enerjisi) ve hedefler üretilir; oyuncu önce tepki süresince eski hızıyla
   gider, sonra hedefe karşılayan gibi (koşarak varış) koşar. Gerçek varış (menzile giriş) anı ile varisZamani tahmini karşılaştırılır.
   Kabul: mutlak hata ortancası ≤ 0,10 sn, %90'lık ≤ 0,25 sn, ortalama hata (yanlılık) |·| ≤ 0,04 sn.
   Kullanım: node araclar/mac-deneme.js --senaryo c-hareket [N=2000] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  N=N||2000;const dt=1/60;
  const m=vm.runInContext('new Match(()=>{},{kadro:MAC_KADRO,tohum:1,tunel:{x:0,z:-6}})',ctx);m.macaGec();
  m.phase='play';m._hrkOyun=true;m.kare=0;m.t=0;
  const r=vm.runInContext('tohumluRastgele',ctx)((tohum||1)*7919+13),VZ=vm.runInContext('varisZamani',ctx),tepeF=vm.runInContext('hrkTepe',ctx);
  const ornek=[];
  for(let i=0;i<N;i++){
    const p=m.players[1+(i%21)];
    Object.assign(p,{eylem:null,kickCd:0,yuk:0,zipla:null,tavir:null,yonHedef:null,bak:null,denge:1,surus:null,
      yorgunluk:r()*0.4,enerji:0.5+0.5*r(),x:-30+60*r(),z:10+48*r()});
    const vm0=tepeF(p),duran=r()<0.3,sp=duran?r()*0.4:(0.15+0.85*r())*vm0,a=r()*2*Math.PI;
    p.vx=Math.cos(a)*sp;p.vz=Math.sin(a)*sp;p.spd=sp;p.yon=duran?r()*2*Math.PI-Math.PI:a+(r()-0.5)*0.6;
    let b=r()*2*Math.PI,D=0.5+35*Math.pow(r(),1.5),tx=p.x+Math.cos(b)*D,tz=p.z+Math.sin(b)*D;if(tz<2||tz>66){b=-b;tz=p.z+Math.sin(b)*D;}
    const menzil=[0.45,0.6,0.75,1.0][Math.floor(r()*4)],tepki=[0.05,0.1,0.15,0.22,0.25][Math.floor(r()*5)];
    const tahmin=VZ(p,tx,tz,menzil,tepki),bas={sp,aci:Math.abs(Math.atan2(Math.sin(b-a),Math.cos(b-a))),D,duran};
    /* tepki: eski hızıyla düz devam */
    p.tx=p.x+p.vx*100;p.tz=p.z+p.vz*100;p.hizOran=sp/p.maxSpd;if(duran){p.tx=p.x;p.tz=p.z;p.hizOran=0;}
    let t=0,vardi=null;
    while(t<12){
      if(t>=tepki-1e-9){p.tx=tx;p.tz=tz;p.hizOran=1;}
      m.kare++;m.t+=dt;if(t>=tepki-1e-9){p._varisHiz=0.8*p.maxSpd;p._varisKare=m.kare;}
      m.moveP(p,dt);t+=dt;
      if(Math.hypot(p.x-tx,p.z-tz)<=menzil){vardi=t;break;}}
    if(vardi==null)vardi=12;
    ornek.push(Object.assign(bas,{hata:tahmin-vardi,gercek:vardi,tahmin}));}
  const yuz=(L,q)=>{const S=L.slice().sort((a,b)=>a-b);return S[Math.min(S.length-1,Math.floor(q*S.length))];};
  const ozet=(ad,L)=>{if(!L.length)return;const ab=L.map(o=>Math.abs(o.hata)),ort=L.reduce((s,o)=>s+o.hata,0)/L.length;
    console.log('  '+ad.padEnd(34)+String(L.length).padStart(6)+(yuz(ab,0.5).toFixed(3)).padStart(9)+(yuz(ab,0.9).toFixed(3)).padStart(9)+((ort>=0?'+':'')+ort.toFixed(3)).padStart(9));return{med:yuz(ab,0.5),p90:yuz(ab,0.9),ort};};
  console.log(`\nC · varış süresi senaryosu: ${N} başlangıç (tahmin − moveP benzetimi, sn)\n`);
  console.log('  '+'Grup'.padEnd(34)+'adet'.padStart(6)+'ortanca'.padStart(9)+'%90'.padStart(9)+'yanlılık'.padStart(9));
  const H=ozet('hepsi',ornek);
  ozet('duran',ornek.filter(o=>o.duran));
  ozet('koşarken, hedef önde (<45°)',ornek.filter(o=>!o.duran&&o.aci<Math.PI/4));
  ozet('koşarken, hedef yanda (45–100°)',ornek.filter(o=>!o.duran&&o.aci>=Math.PI/4&&o.aci<1.75));
  ozet('koşarken, hedef arkada (>100°)',ornek.filter(o=>!o.duran&&o.aci>=1.75));
  ozet('kısa (<5 m)',ornek.filter(o=>o.D<5));ozet('orta (5–15 m)',ornek.filter(o=>o.D>=5&&o.D<15));ozet('uzun (≥15 m)',ornek.filter(o=>o.D>=15));
  const ok=H.med<=0.10&&H.p90<=0.25&&Math.abs(H.ort)<=0.04;
  console.log('\n'+(ok?'  ':'! ')+`Kabul (ortanca ≤0,10 · %90 ≤0,25 · |yanlılık| ≤0,04): ${ok?'geçti':'GEÇMEDİ'}`);
  if(process.env.C_HAREKET_JSON)require('fs').writeFileSync(process.env.C_HAREKET_JSON,JSON.stringify(ornek));
  return ok?0:1;
}};
