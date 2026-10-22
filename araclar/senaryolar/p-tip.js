/* ============ Gerçekçilik planı T0/T3 senaryosu: aynı sahne, farklı oyuncu profili (C2, 2026-10-22: beş çift, hız, seviye ekseni) ============
   Tohumlu maçlarda belirli bir mevkideki oyuncu topu ayağında karar vermek üzereyken (kararT bitiyor) maç dondurulur; aynı sahnede oyuncunun
   özellikleri sırayla iki profile çevrilir (senaryo-ortak profilDegis: tepe hız, kütle, çeviklik ve hareket önbellekleri tazelenir, profil — alt
   özellikler, rol, eğilimler — yeniden türetilir; C2'den önce hız seçimi etkilemiyordu) ve motorun kendi kararVer'i (js/mac-karar.js) K kez
   örneklenir, sonra her şey geri konur.
   Seçim sınıfı: tür × boy bandı (< 15 / 15–30 / ≥ 30 m) × yön (ileri / geri) — pas, uzun, ara ve orta için; öbür türler yalnız türüyle.
   Çiftler (kapı TVD ≥ 0,15; T3'te yalnız kanat): (1) kanat, rakip yarıda: hızlı kanat ↔ oyun kurucu kanat; (2) merkez, kendi yarısında: uzun paslı 6 ↔
   kesici; (3) forvet, rakip yarıda: falsolu 10 ↔ fırsatçı; (4) stoper, kendi yarısında: sert stoper ↔ oyun kuran stoper (C2'de kapı); (5) forvet:
   hava 9'u ↔ koşucu 9 (bilgi).
   Seviye ekseni (C2): her çiftin ilk profili ±δ (0,12; kalecilik dışındaki 10 özellik) — "seviye TVD ÷ profil TVD" (karar 22: aynı profilin güçlüsü
   işi daha iyi yapar ama aynı zihniyetle oynar; C5 kabulü < 0,5). Gürültü satırı: seçilen seçeneklerin |profilEgilimPuani| ortancası ÷ oyuncunun
   Gumbel sapması (π/√3 · τ, τ = 0,1 + 0,5·(1 − tutarlılık)) — eğilimin karar gürültüsüne oranı (C5 kabulü ≥ 1,0).
   Çıktı: seçim dağılımı ve toplam değişim uzaklığı (TVD = ½·Σ|p−q|). Kullanım: node araclar/mac-deneme.js --senaryo p-tip [N=60 sahne] [tohum];
   kabul dışıysa çıkış kodu 1 */
'use strict';
const DELTA=0.12;
const DENEYLER=[
  {ad:'kanat, rakip yarıda',kosul:(p,u)=>p.mevki&&p.mevki.kanat&&u>0,kabul:0.15,
    profiller:[['hızlı kanat',{hiz:0.92,surus:0.85,pas:0.5,sut:0.55,gorus:0.45,karar:0.45}],['oyun kurucu kanat',{hiz:0.55,surus:0.6,pas:0.88,sut:0.55,gorus:0.9,karar:0.85}]]},
  {ad:'merkez, kendi yarısında',kosul:(p,u)=>p.profil&&p.profil.grup==='merkez'&&u<0,kabul:0.15,
    profiller:[['uzun paslı 6',{pas:0.84,gorus:0.82,karar:0.72,mudahale:0.55,sertlik:0.6,surus:0.6}],['kesici',{mudahale:0.82,sertlik:0.8,pas:0.6,gorus:0.55,karar:0.6,surus:0.55}]]},
  {ad:'forvet, rakip yarıda',kosul:(p,u)=>p.rol==='FV'&&u>0,kabul:0.15,
    profiller:[['falsolu 10',{pas:0.82,gorus:0.82,sut:0.74,surus:0.78,hiz:0.7,kafa:0.45}],['fırsatçı',{sut:0.84,pas:0.55,gorus:0.55,hiz:0.8,surus:0.62,kafa:0.6}]]},
  {ad:'stoper, kendi yarısında',kosul:(p,u)=>p.rol==='DEF'&&p.mevki&&!p.mevki.bek&&u<0,kabul:0.15,
    profiller:[['sert stoper',{mudahale:0.85,sertlik:0.85,pas:0.45,gorus:0.4,karar:0.5}],['oyun kuran stoper',{mudahale:0.6,sertlik:0.5,pas:0.85,gorus:0.8,karar:0.75}]]},
  {ad:'forvet, hava ve koşu',kosul:(p,u)=>p.rol==='FV'&&u>0,kabul:null,
    profiller:[['hava 9',{kafa:0.88,sertlik:0.78,hiz:0.55,surus:0.5,sut:0.7}],['koşucu 9',{hiz:0.9,surus:0.75,kafa:0.5,sertlik:0.5,sut:0.7}]]}
];
const sinif=(m,p,s)=>{const t=s.tur||'koru';if(!s.alici||s.hx==null)return t;const L=s.L!=null?s.L:Math.hypot(s.hx-m.ball.x,s.hz-m.ball.z),il=(s.hx-m.ball.x)*m.dir[p.team];
  return t+(L<15?' <15':L<30?' 15–30':' ≥30')+(il>=0?' ileri':' geri');};
const TVD=(A,B)=>{const ta=Object.values(A).reduce((a,c)=>a+c,0)||1,tb=Object.values(B).reduce((a,c)=>a+c,0)||1,T=new Set([...Object.keys(A),...Object.keys(B)]);
  let v=0;for(const t of T)v+=Math.abs((A[t]||0)/ta-(B[t]||0)/tb)/2;return v;};
module.exports={calistir({ctx,vm,N,tohum}){
  const O=require('../senaryo-ortak')(ctx,vm),K=30,t0=Date.now(),kararVer=vm.runInContext('kararVer',ctx),egP=vm.runInContext('profilEgilimPuani',ctx);
  const kur=vm.runInContext(`(tohum)=>{const m=new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  let kod=0;const ozet=[];
  DENEYLER.forEach((dn,di)=>{
    /* kollar: 0 ve 1 iki profil; 2 ve 3 ilk profilin +δ ve −δ'si */
    const n=di?Math.round((N||60)/2):(N||60),D=[{},{},{},{}],turlar=new Set(),EG=[];let sahne=0,mac=0;
    while(sahne<n&&mac<n*3){const m=kur((tohum||1)*1000+di*500+mac++),b=m.ball;let son=-9;
      for(let k=0;k<60*300&&sahne<n&&m.phase!=='fulltime';k++){
        const p=b.sahip;
        if(m.phase==='play'&&p&&!p.eylem&&p.kararT<=1/60&&p.profil&&dn.kosul(p,b.x*m.dir[p.team])&&b.y<0.5&&Math.hypot(b.x-p.x,b.z-p.z)<1.1&&m.t-son>4){
          son=m.t;sahne++;
          [[0,0],[1,0],[0,DELTA],[0,-DELTA]].forEach(([pi,dl],kol)=>{const geri=O.profilDegis(m,p,dn.profiller[pi][1],dl);
            const tau=0.1+0.5*(1-((p.profil.alt&&p.profil.alt.tutarlilik)||0.5));
            for(let j=0;j<K;j++){const s=kararVer(m,p),c=sinif(m,p,s);turlar.add(c);D[kol][c]=(D[kol][c]||0)+1;if(kol<2)EG.push(Math.abs(egP(m,p,s))/(Math.PI/Math.sqrt(3)*tau));}
            geri();});}
        m.step(1/60);}}
    const T=[...turlar].sort(),top=D.map(d=>Object.values(d).reduce((a,c)=>a+c,0)||1),pay=(i,t)=>(D[i][t]||0)/top[i];
    console.log(`\n${di?'   ':'T3 ·'} aynı sahne, farklı profil · ${dn.ad} · ${sahne} sahne (${mac} maç), sahne başına profil başına ${K} karar\n`);
    console.log('  Seçim'.padEnd(22)+dn.profiller.map(([a])=>a.padStart(20)).join('')+'   fark (puan)');
    for(const t of T){const a=pay(0,t),c=pay(1,t);if(a<0.01&&c<0.01)continue;
      console.log('  '+t.padEnd(20)+[0,1].map(i=>(100*pay(i,t)).toFixed(1).padStart(19)+'%').join('')+((a-c>=0?'+':'')+(100*(a-c)).toFixed(1)).padStart(13));}
    const tvd=TVD(D[0],D[1]),tvdS=TVD(D[2],D[3]),eg=EG.sort((a,b)=>a-b)[EG.length>>1]||0;
    if(dn.kabul!=null){const ok=tvd>=dn.kabul;if(!ok)kod=1;
      console.log((ok?'  ':'! ')+`Kabul: ${dn.profiller[0][0]} ile ${dn.profiller[1][0]} seçim dağılımı belirgin farklı (TVD ≥ ${String(dn.kabul).replace('.',',')}) → TVD ${tvd.toFixed(3)}`);}
    else console.log(`  Bilgi: TVD ${tvd.toFixed(3)}`);
    console.log(`  Seviye (bilgi; C5): ${dn.profiller[0][0]} ±${String(DELTA).replace('.',',')} → seviye TVD ${tvdS.toFixed(3)} · seviye ÷ profil ${(tvdS/Math.max(1e-9,tvd)).toFixed(2)} · eğilim ÷ gürültü (ortanca) ${eg.toFixed(2)}`);
    ozet.push(`${dn.ad}: TVD ${tvd.toFixed(3)} · seviye ÷ profil ${(tvdS/Math.max(1e-9,tvd)).toFixed(2)} · eğilim ÷ gürültü ${eg.toFixed(2)}`);
  });
  console.log('\n  Özet: '+ozet.join('\n         '));
  console.log(`  ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  return kod;
}};
