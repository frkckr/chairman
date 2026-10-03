/* ============ Gerçekçilik planı T0 senaryosu: duran top ızgarası (korner ve serbest vuruş) ============
   Her deneme ayrı tohumlu maçta, iki takım tam kadro; duran top motorun kendi akışıyla (durusBaslat → yerleşim → durusKullan; d-penalti kalıbı).
   Korner: iki yan, iki takım sırayla; vuruştan sonra 8 sn (ya da oyun durana dek) şut ve gol. Serbest vuruş: kale çizgisine 18 / 22 / 26 / 30 m,
   yana 0 / 8 / 16 m; baraj, doğrudan şut (kullananın 1,6 sn içindeki şutu), 8 sn içinde gol ve doğrudan gol (golde son dokunan kullanan).
   Kabul (T8, bilgi): korner başına gol %3–5; barajlı serbest vuruşta doğrudan şut başına gol %6–10. Ayrıntı plan Ek D, gerçek değerler Ek E.
   Kullanım: node araclar/mac-deneme.js --senaryo d-duran [N=160 korner; serbest vuruşta hücre başına N/8] [tohum] */
'use strict';
/* u: kale çizgisine uzaklık (m), w: kale ortasından yana (m); yer santradan sonraki hücum yönüne göre maçın içinde bulunur */
const KOD=`(function(tohum,tur,t,u,w){
  let sut=0,dogrudan=false,gol=null,su=null,kul=null,baraj=false;
  const m=new Match((ad,v)=>{if(su==null||!v)return;
    if(ad==='shot'&&v.p&&v.p.team===t){sut++;if(v.p===kul&&m.t-su<1.6)dogrudan=true;}
    else if(ad==='header'&&v.shot&&v.p&&v.p.team===t)sut++;
    else if(ad==='goal'&&v.team===t&&!gol)gol={dogrudan:m.ball.sonDokunan===kul||v.scorer===kul};},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});
  m.macaGec();
  const d=m.dir[t],x=d*(PL-u),z=MZ+w;
  m.topuSifirla(x-d*(tur==='korner'?1.2:0),z-(tur==='korner'?Math.sign(w)*0.8:0));m.phase='play';
  m.durusBaslat(tur,t,x,z,tur==='serbest'?{bekle:1.0,duduk:true}:undefined);
  for(let n=0;n<60*25&&m.phase==='durus';n++){if(m.durus){kul=m.durus.kullanan;baraj=!!m.durus.baraj;}m.step(1/60);}
  if(m.phase!=='play')return null;
  su=m.t;
  for(let k=0;k<60*8&&m.phase==='play';k++)m.step(1/60);
  return{sut,dogrudan,gol:!!gol,golDogrudan:!!(gol&&gol.dogrudan),baraj};})`;
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||160,f=vm.runInContext(KOD,ctx),t0=Date.now();let tn=(tohum||1)*1000;
  const y=(a,c)=>c?(100*a/c).toFixed(1).padStart(6)+'%':'     —';
  /* korner: iki yan × iki takım */
  const K={n:0,gol:0,sut:0,yok:0,sutlu:0};
  for(let i=0;i<n;i++){const r=f(tn++,'korner',i%2,0.4,(i%4<2?1:-1)*(34-0.4));if(!r){K.yok++;continue;}K.n++;if(r.gol)K.gol++;K.sut+=r.sut;if(r.sut)K.sutlu++;}
  console.log(`\nT0 · duran top ızgarası · ${((Date.now()-t0)/1000).toFixed(1)} sn (korner)\n`);
  console.log(`  Korner: ${K.n} kullanıldı${K.yok?` (${K.yok} kullanılamadı)`:''} · şutla biten ${y(K.sutlu,K.n).trim()} · şut/korner ${(K.sut/Math.max(1,K.n)).toFixed(2)} · 8 sn içinde gol ${y(K.gol,K.n).trim()}`);
  const kg=100*K.gol/Math.max(1,K.n),kok=kg>=3&&kg<=5;
  console.log((kok?'  ':'! ')+`Kabul (T8, bilgi): korner başına gol %3–5 → %${kg.toFixed(1)}`);
  /* serbest vuruş ızgarası */
  const U=[18,22,26,30],W=[0,8,16],m2=Math.max(4,Math.round(n/8)),S={};let B={dog:0,dogGol:0};
  for(const u of U)for(const w of W){const h=S[u+'|'+w]={n:0,baraj:0,dog:0,dogGol:0,gol:0,yok:0};
    for(let i=0;i<m2;i++){const r=f(tn++,'serbest',i%2,u,(i%4<2?1:-1)*w);if(!r){h.yok++;continue;}h.n++;
      if(r.baraj)h.baraj++;if(r.dogrudan){h.dog++;if(r.baraj)B.dog++;}if(r.golDogrudan&&r.dogrudan){h.dogGol++;if(r.baraj)B.dogGol++;}if(r.gol)h.gol++;}}
  console.log(`\n  Serbest vuruş · hücre başına ${m2} · ${((Date.now()-t0)/1000).toFixed(1)} sn toplam`);
  console.log('  Uzaklık  Yana      n   baraj  doğrudan şut  doğrudan gol / şut   8 sn içinde gol');
  for(const u of U)for(const w of W){const h=S[u+'|'+w];
    console.log('  '+(u+' m').padEnd(8)+(w+' m').padStart(5)+String(h.n).padStart(7)+y(h.baraj,h.n).padStart(8)+y(h.dog,h.n).padStart(14)+(h.dog?y(h.dogGol,h.dog):'     —').padStart(20)+y(h.gol,h.n).padStart(18));}
  const bg=100*B.dogGol/Math.max(1,B.dog),bok=B.dog>0&&bg>=6&&bg<=10;
  console.log((bok?'  ':'! ')+`Kabul (T8, bilgi): barajlı serbest vuruşta doğrudan şut başına gol %6–10 → %${bg.toFixed(1)} (${B.dogGol}/${B.dog})`);
  return 0;
}};
