/* ============ Gerçekçilik planı T0 senaryosu: aynı sahne, farklı oyuncu profili ============
   Tohumlu maçlarda bir kanat oyuncusu (iki takımdan) rakip yarıda topu ayağında karar vermek üzereyken (kararT bitiyor) maç dondurulur; aynı sahnede
   oyuncunun özellikleri sırayla iki profile çevrilir ve motorun kendi kararVer'i (js/mac-karar.js) K kez örneklenir, sonra özellikler geri konur.
   Profiller (hız seçimi etkilemez: maxSpd ve hareket sabitleri değiştirilmez; bugün seçimde yalnız sürüş, pas, şut, görüş ve karar rol oynar):
   hızlı kanat (hız 0,92, sürüş 0,85, pas 0,50, görüş 0,45, karar 0,45) ve oyun kurucu kanat (0,55 / 0,60 / 0,88 / 0,90 / 0,85); şut 0,55.
   Çıktı: seçim dağılımı ve toplam değişim uzaklığı (TVD = ½·Σ|p−q|). Kabul (T3, bilgi): dağılımlar belirgin farklı — T0 eşiği TVD ≥ 0,15
   (planın sayısal hedefi yok; T3'te gözden geçirilir). Kullanım: node araclar/mac-deneme.js --senaryo p-tip [N=60 sahne] [tohum] */
'use strict';
const PT_PROFIL=[['hızlı kanat',{hiz:0.92,surus:0.85,pas:0.5,sut:0.55,gorus:0.45,karar:0.45}],['oyun kurucu kanat',{hiz:0.55,surus:0.6,pas:0.88,sut:0.55,gorus:0.9,karar:0.85}]];
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||60,K=30,t0=Date.now(),kararVer=vm.runInContext('kararVer',ctx);
  const kur=vm.runInContext(`(tohum)=>{const m=new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const D=PT_PROFIL.map(()=>({})),turlar=new Set();let sahne=0,mac=0;
  while(sahne<n&&mac<n*3){const m=kur((tohum||1)*1000+mac++),b=m.ball;let son=-9;
    for(let k=0;k<60*300&&sahne<n&&m.phase!=='fulltime';k++){
      const p=b.sahip;
      if(m.phase==='play'&&p&&p.mevki&&p.mevki.kanat&&!p.eylem&&p.kararT<=1/60&&b.x*m.dir[p.team]>0&&b.y<0.5&&Math.hypot(b.x-p.x,b.z-p.z)<1.1&&m.t-son>4){
        son=m.t;sahne++;const eski=Object.assign({},p.oz);
        PT_PROFIL.forEach(([,pr],i)=>{Object.assign(p.oz,pr);for(let j=0;j<K;j++){const s=kararVer(m,p),tr=s.tur||'koru';turlar.add(tr);D[i][tr]=(D[i][tr]||0)+1;}});
        Object.assign(p.oz,eski);}
      m.step(1/60);}}
  const T=[...turlar].sort(),top=D.map(d=>Object.values(d).reduce((a,c)=>a+c,0)||1),pay=(i,t)=>(D[i][t]||0)/top[i];
  console.log(`\nT0 · aynı sahne, farklı profil · ${sahne} sahne (${mac} maç), sahne başına profil başına ${K} karar · ${((Date.now()-t0)/1000).toFixed(1)} sn\n`);
  console.log('  Seçim'.padEnd(14)+PT_PROFIL.map(([a])=>a.padStart(20)).join('')+'   fark (puan)');
  let tvd=0;for(const t of T){const a=pay(0,t),c=pay(1,t);tvd+=Math.abs(a-c)/2;
    console.log('  '+t.padEnd(12)+PT_PROFIL.map((_,i)=>(100*pay(i,t)).toFixed(1).padStart(19)+'%').join('')+((a-c>=0?'+':'')+(100*(a-c)).toFixed(1)).padStart(13));}
  const ok=tvd>=0.15;
  console.log((ok?'  ':'! ')+`Kabul (T3, bilgi): hızlı kanat ile oyun kurucu kanadın seçim dağılımı belirgin farklı (TVD ≥ 0,15) → TVD ${tvd.toFixed(3)}`);
  return 0;
}};
