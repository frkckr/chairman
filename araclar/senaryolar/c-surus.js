/* ============ Gerçekçilik planı T20 senaryosu: sürüş ve alış (T20-0, 2026-10-18; §4 “2026-10-18 maç notları”) ============
   Boş sahada (rakip saha oyuncusu yok, kaleciler kalesinde) karar katmanı kapalı. Kullanıcı notları: “sürerken oyuncu topun önüne geçiyor, topa
   dönüp ayağına gelmesini bekliyor” ve “topu alınca dönerken gövde arkaya kayıyor, toparlanıp pas atıyor”.
   [1] Düz taşıma: orta saha oyuncusu topla, sürüş niyeti hücum yönüne, hız 0,5 / 0,75 / 0,95 (niyetin hızı), başlangıçta duruyor ya da 3 m/sn; 5 sn.
       Ölçü: top gövdenin önünde ve 1,5 m içinde olan kare payı, top ≥ 0,15 sn gövdenin arkasında kalma (epizot), dokunuş / sn, ortalama hız.
       Kabul (T20a): öndeki 1,5 m'de ≥ %95, arkada kalma epizodu denemelerin ≤ %5'inde; dokunuş sıklığı ve hız bilgi.
   [2] 90° dönüş: hız 0,75'te 2 sn düz, sonra niyet 90° sağa ya da sola; dönüşten sonraki 2 sn'de top gövdenin arkasında kaldığı süre ve gövdeye
       göre geri geri yol (> 0,3 m/sn). Kabul (T20a): arkada süre ortancası ≤ 0,2 sn.
   [3] Alış → pas: oyuncu duruyor ya da pasöre 2 m/sn yürüyor; 15 m'den yerden pas gelir; ikinci arkadaş topun geliş yönüne göre 0 / 45 / 90 / 135°
       açıda 14 m ötede (0°: topun gidişi doğrultusunda — tam dönüş). Oyuncu topu alır (motorun karşılaması, gelişine kararı ve kontrolü), sahip olunca
       pas o arkadaşa başlatılır (karar katmanının pası yerine); alıştan pasa gövdeye göre geri geri yol. Kabul (T20b): > 0,3 m geri kayma denemelerin
       ≤ %10'unda; alış → pas süresi bilgi.
   Kabul dışıysa çıkış kodu 1. Kullanım: node araclar/mac-deneme.js --senaryo c-surus [N=24 hücre başına] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||24,dt=1/60,t0=Date.now();let cikis=0;
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,v)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:Math.cos(yon)*v,vz:Math.sin(yon)*v,spd:v,yon,eylem:null,kickCd:0,surus:null,kosu:null,oyunda:true,denge:1,calim:null,yutma:null});};
  const hyp=Math.hypot,ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN,med=L=>{if(!L.length)return NaN;const s=[...L].sort((a,b)=>a-b);return s[Math.floor(s.length/2)];};
  const pc=(a,b)=>b?(100*a/b).toFixed(1):'—';
  let deneme=0;
  /* topla oyuncu ve top hazır: A topun 0,45 m gerisinde, top yerde ve sahibi A */
  const topVer=(m,A,yon,v)=>{const b=m.ball;Object.assign(b,{x:A.x+Math.cos(yon)*0.45,z:A.z+Math.sin(yon)*0.45,y:0,vx:Math.cos(yon)*v,vz:Math.sin(yon)*v,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,
    hedefOyuncu:null,sut:null,pas:null,sonTakim:A.team,sonDokunan:A});m.topDegisti();m.sahipYap(A);};
  /* bir sürüş denemesi: niyet hızı hz, başlangıç hızı v0; donus: 2 sn'de niyet ±90° */
  const surus=(hz,v0,i,donus)=>{deneme++;const m=kur((tohum||1)*1000+deneme,()=>{});const A=m.teams[0][7],b=m.ball,d=m.dir[0],hy=d>0?0:Math.PI;
    bosalt(m,[A]);yerlestir(A,-d*20,34+(i%5-2)*4,hy,v0);m.phase='play';m.phaseT=1;m.durus=null;topVer(m,A,hy,v0);
    let kare=0,onde=0,arkaArd=0,ep=0,dok=0,sonSd=A.sonDokunus,hizT=0,arkaSon=0,geriSon=0,yon=hy;const T=donus?4:5;
    for(let k=0;k<60*T;k++){A.kararT=99;if(donus&&k===120)yon=hy+(i%2?1:-1)*Math.PI/2;
      if(b.sahip===A&&!A.calim)A.surus={yon,hiz:hz};
      m.step(dt);if(m.phase!=='play'||b.sahip!==A)break;
      kare++;const c=Math.cos(A.yon),s=Math.sin(A.yon),on=(b.x-A.x)*c+(b.z-A.z)*s,dd=hyp(b.x-A.x,b.z-A.z);
      if(on>0&&dd<1.5)onde++;if(on<-0.15){arkaArd++;if(arkaArd===9)ep++;if(donus&&k>=120)arkaSon+=dt;}else arkaArd=0;
      if(donus&&k>=120){const vf=A.vx*c+A.vz*s;if(vf<-0.3)geriSon+=-vf*dt;}
      if(A.sonDokunus!==sonSd){if(A.sonDokunus&&A.sonDokunus.tur==='surus')dok++;sonSd=A.sonDokunus;}hizT+=A.spd;}
    return{kare,onde,ep,dok,sure:kare*dt,hiz:kare?hizT/kare:NaN,arkaSon,geriSon,kaybetti:b.sahip!==A};};
  /* [1] */
  console.log(`\nT20 · sürüş ve alış · hücre başına ${n} deneme`);
  console.log('\n[1] Düz taşıma (niyet hızı × başlangıç hızı; 5 sn)');
  console.log('  Niyet  Başlangıç   öndeki 1,5 m   arkada ≥0,15 sn (deneme %)   dokunuş/sn   hız m/sn   sahiplik kaybı');
  let tKare=0,tOnde=0,tEp=0,tN=0;
  for(const hz of[0.5,0.75,0.95])for(const v0 of[0,3]){let K=0,O=0,E=0,D=0,S=0,H=[],kay=0;
    for(let i=0;i<n;i++){const r=surus(hz,v0,i,false);K+=r.kare;O+=r.onde;if(r.ep)E++;D+=r.dok;S+=r.sure;H.push(r.hiz);if(r.kaybetti)kay++;}
    tKare+=K;tOnde+=O;tEp+=E;tN+=n;
    console.log('  '+hz.toFixed(2).padEnd(7)+(v0+' m/sn').padEnd(12)+(pc(O,K)+'%').padStart(13)+(pc(E,n)+'%').padStart(29)+(S?(D/S).toFixed(2):'—').padStart(13)+ort(H).toFixed(2).padStart(11)+String(kay).padStart(17));}
  const ok1=tOnde/tKare>=0.95&&tEp/tN<=0.05;
  console.log((ok1?'  ':'! ')+`[1] Kabul (T20a): top öndeki 1,5 m'de ≥ %95 → %${pc(tOnde,tKare)}; arkada ≥ 0,15 sn kalan deneme ≤ %5 → %${pc(tEp,tN)}`);
  if(!ok1)cikis=1;
  /* [2] */
  {const A2=[],G2=[];let E2=0;for(let i=0;i<n*2;i++){const r=surus(0.75,3,i,true);A2.push(r.arkaSon);G2.push(r.geriSon);if(r.ep)E2++;}
   const ok2=med(A2)<=0.2;
   console.log(`\n[2] 90° dönüş (niyet 0,75, 3 m/sn; ${n*2} deneme): dönüşten sonra top arkada ortanca ${med(A2).toFixed(2)} sn (ort. ${ort(A2).toFixed(2)}) · gövdeye göre geri geri yol ort. ${ort(G2).toFixed(2)} m · ≥ 0,15 sn arkada kalan deneme %${pc(E2,n*2)}`);
   console.log((ok2?'  ':'! ')+`[2] Kabul (T20a): dönüşten sonra top arkada ortanca ≤ 0,2 sn → ${med(A2).toFixed(2)}`);
   if(!ok2)cikis=1;}
  /* [3] */
  {const ACI=[0,45,90,135],R={};let geriTop=0,nTop=0;
   for(const aci of ACI){const L={n:0,pas:0,geri:[],sure:[],tek:0};R[aci]=L;
     for(let i=0;i<n;i++){deneme++;let alT=null,geri=0,bitti=false,tek=false,paslandi=false;
       const m=kur((tohum||1)*1000+20000+deneme,(ad,v)=>{if(ad==='ilkDokunus'&&v.p===A&&alT==null)alT=m.t;
         if(ad==='pass'&&v.p===A){bitti=true;if(v.ilk)tek=true;}});
       const A=m.teams[0][7],P=m.teams[0][6],C=m.teams[0][8],b=m.ball,d=m.dir[0];bosalt(m,[A,P,C]);
       const ax=-d*10,az=34+(i%3-1)*6,yP=(i%4)*0.5-0.75,px=ax-d*15*Math.cos(yP),pz=az-15*Math.sin(yP);
       const uin=Math.atan2(az-pz,ax-px),ac=uin+(i%2?1:-1)*aci*Math.PI/180,cx=ax+Math.cos(ac)*14,cz=Math.min(64,Math.max(4,az+Math.sin(ac)*14));
       const yuru=i%2?2:0;yerlestir(A,ax,az,uin+Math.PI,yuru);yerlestir(P,px,pz,uin,0);yerlestir(C,cx,cz,Math.atan2(az-cz,ax-cx),0);
       m.phase='play';m.phaseT=1;m.durus=null;
       Object.assign(b,{x:px+Math.cos(uin)*0.45,z:pz+Math.sin(uin)*0.45,y:0,vx:0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:P});
       m.topDegisti();m.sahipYap(P);m.vurusBaslat(P,{tur:'pas',hx:ax,hz:az,tip:'yer',alici:A,mod:'ayak',guncelle:true});
       for(let k=0;k<60*7&&!bitti;k++){P.kararT=99;C.kararT=99;
         if(alT!=null&&b.sahip===A&&!A.eylem&&!paslandi){paslandi=true;m.vurusBaslat(A,{tur:'pas',hx:C.x,hz:C.z,tip:'yer',alici:C,mod:'ayak',guncelle:true});}
         m.step(dt);if(m.phase!=='play')break;
         if(alT!=null&&!bitti){const c=Math.cos(A.yon),s=Math.sin(A.yon),vf=A.vx*c+A.vz*s;if(vf<-0.3)geri+=-vf*dt;}
         if(alT!=null&&m.t-alT>3)break;}
       L.n++;if(bitti&&alT!=null){L.pas++;L.geri.push(geri);L.sure.push(m.t-alT);if(tek)L.tek++;nTop++;if(geri>0.3)geriTop++;}}}
   console.log(`\n[3] Alış → pas (15 m'den yerden pas; arkadaş topun gidişine göre açıda 14 m ötede; ${n} deneme / açı)`);
   console.log('  Açı    pas   gelişine   geri kayma > 0,3 m   geri yol ort. (m)   alış → pas (sn)');
   for(const aci of ACI){const L=R[aci];const g=L.geri.filter(x=>x>0.3).length;
     console.log('  '+(aci+'°').padEnd(6)+String(L.pas).padStart(4)+String(L.tek).padStart(11)+(pc(g,L.pas)+'%').padStart(21)+ort(L.geri).toFixed(2).padStart(20)+med(L.sure).toFixed(2).padStart(18));}
   const ok3=nTop>=ACI.length*n*0.6&&geriTop/nTop<=0.10;
   console.log((ok3?'  ':'! ')+`[3] Kabul (T20b): geri kayma > 0,3 m denemelerin ≤ %10'unda → %${pc(geriTop,nTop)} (${nTop} pas)`);
   if(!ok3)cikis=1;}
  console.log(`\n  süre ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  return cikis;
}};
