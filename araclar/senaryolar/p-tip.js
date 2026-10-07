/* ============ Gerçekçilik planı T0/T3 senaryosu: aynı sahne, farklı oyuncu profili ============
   Tohumlu maçlarda belirli bir mevkideki oyuncu topu ayağında karar vermek üzereyken (kararT bitiyor) maç dondurulur; aynı sahnede oyuncunun
   özellikleri sırayla iki profile çevrilir (T3: profilKur ile alt özellikler, rol ve eğilimler de yeniden türetilir) ve motorun kendi kararVer'i
   (js/mac-karar.js) K kez örneklenir, sonra özellikler ve profil geri konur. Hız seçimi etkilemez (maxSpd ve hareket sabitleri değişmez).
   Deneyler: (1) kanat, rakip yarıda: hızlı kanat (hız 0,92, sürüş 0,85, pas 0,50, görüş 0,45, karar 0,45) ↔ oyun kurucu kanat (0,55 / 0,60 /
   0,88 / 0,90 / 0,85), şut 0,55 — KABUL (T3): TVD ≥ 0,15 (T0'da 0,068). (2) stoper, kendi yarısında: sert stoper (müdahale 0,85, sertlik 0,85,
   pas 0,45, görüş 0,40, karar 0,50) ↔ oyun kuran stoper (0,60 / 0,50 / 0,85 / 0,80 / 0,75) — bilgi.
   Çıktı: seçim dağılımı ve toplam değişim uzaklığı (TVD = ½·Σ|p−q|). Kullanım: node araclar/mac-deneme.js --senaryo p-tip [N=60 sahne] [tohum];
   kabul dışıysa çıkış kodu 1 */
'use strict';
const DENEYLER=[
  {ad:'kanat, rakip yarıda',kosul:(p,u)=>p.mevki&&p.mevki.kanat&&u>0,kabul:0.15,
    profiller:[['hızlı kanat',{hiz:0.92,surus:0.85,pas:0.5,sut:0.55,gorus:0.45,karar:0.45}],['oyun kurucu kanat',{hiz:0.55,surus:0.6,pas:0.88,sut:0.55,gorus:0.9,karar:0.85}]]},
  {ad:'stoper, kendi yarısında',kosul:(p,u)=>p.rol==='DEF'&&p.mevki&&!p.mevki.bek&&u<0,kabul:null,
    profiller:[['sert stoper',{mudahale:0.85,sertlik:0.85,pas:0.45,gorus:0.4,karar:0.5}],['oyun kuran stoper',{mudahale:0.6,sertlik:0.5,pas:0.85,gorus:0.8,karar:0.75}]]}
];
module.exports={calistir({ctx,vm,N,tohum}){
  const K=30,t0=Date.now(),kararVer=vm.runInContext('kararVer',ctx),profilKur=vm.runInContext('profilKur',ctx);
  const kur=vm.runInContext(`(tohum)=>{const m=new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  let kod=0;
  DENEYLER.forEach((dn,di)=>{
    const n=di?Math.round((N||60)/2):(N||60),D=dn.profiller.map(()=>({})),turlar=new Set();let sahne=0,mac=0;
    while(sahne<n&&mac<n*3){const m=kur((tohum||1)*1000+di*500+mac++),b=m.ball;let son=-9;
      for(let k=0;k<60*300&&sahne<n&&m.phase!=='fulltime';k++){
        const p=b.sahip;
        if(m.phase==='play'&&p&&!p.eylem&&p.kararT<=1/60&&dn.kosul(p,b.x*m.dir[p.team])&&b.y<0.5&&Math.hypot(b.x-p.x,b.z-p.z)<1.1&&m.t-son>4){
          son=m.t;sahne++;const eski=Object.assign({},p.oz),eskiProfil=p.profil;
          dn.profiller.forEach(([,pr],i)=>{Object.assign(p.oz,pr);profilKur(p,m.tohum);for(let j=0;j<K;j++){const s=kararVer(m,p),tr=s.tur||'koru';turlar.add(tr);D[i][tr]=(D[i][tr]||0)+1;}});
          Object.assign(p.oz,eski);p.profil=eskiProfil;}
        m.step(1/60);}}
    const T=[...turlar].sort(),top=D.map(d=>Object.values(d).reduce((a,c)=>a+c,0)||1),pay=(i,t)=>(D[i][t]||0)/top[i];
    console.log(`\n${di?'   ':'T3 ·'} aynı sahne, farklı profil · ${dn.ad} · ${sahne} sahne (${mac} maç), sahne başına profil başına ${K} karar\n`);
    console.log('  Seçim'.padEnd(14)+dn.profiller.map(([a])=>a.padStart(20)).join('')+'   fark (puan)');
    let tvd=0;for(const t of T){const a=pay(0,t),c=pay(1,t);tvd+=Math.abs(a-c)/2;
      console.log('  '+t.padEnd(12)+dn.profiller.map((_,i)=>(100*pay(i,t)).toFixed(1).padStart(19)+'%').join('')+((a-c>=0?'+':'')+(100*(a-c)).toFixed(1)).padStart(13));}
    if(dn.kabul!=null){const ok=tvd>=dn.kabul;if(!ok)kod=1;
      console.log((ok?'  ':'! ')+`Kabul (T3): ${dn.profiller[0][0]} ile ${dn.profiller[1][0]} seçim dağılımı belirgin farklı (TVD ≥ ${String(dn.kabul).replace('.',',')}) → TVD ${tvd.toFixed(3)}`);}
    else console.log(`  Bilgi: TVD ${tvd.toFixed(3)}`);
  });
  console.log(`  ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  return kod;
}};
