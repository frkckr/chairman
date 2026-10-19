#!/usr/bin/env node
/* ============ Chairman — evreye göre motor hızı (M3, 2026-10-17) ============
   İki motoru (bu depo ya da MOTOR_KOK, ve KLASÖR'deki çalışma ağacı: git worktree add --detach KLASÖR tur/<önceki>) aynı süreçte, aynı
   tohumlarla, sıra tur tur değişerek oynatır ve adım süresini maçın evresine (m.phase: play, durus, kickoff, goal, halftime) göre ayırır.
   Neden: hız bütçesinin ölçüsü (hiz-olcum.js) bütün adımların ortalamasıdır; açık oyun adımı santra, sevinç ve devre arası adımından birkaç
   kat pahalıdır. Gol ya da duruş sayısını değiştiren bir tur, kod yavaşlamadan ms / 1000 adımı değiştirir (M3: T18'de gol 3,11 → 2,63,
   T18 ÷ T17 aynı süreçte +%3,8, evre payları eşitlenince +%1,9). "Evre payları eşitlenince" satırı kodun maliyetidir, "TOPLAM" ikisinin
   toplamıdır. Ölçüm sırasında makinede başka ağır iş çalışmamalıdır; adım başına iki hrtime çağrısı iki tarafa da eşit düşer.
   Kullanım: node araclar/hiz-evre.js KLASÖR [maç, varsayılan 8] [tur, varsayılan 2] [ilk tohum, varsayılan 1] */
'use strict';
const vm=require('vm');
const {motorYukle,ayarUygula,KOK}=require('./motor-yukle');
const [KOK_B,NS,TS,T0S]=process.argv.slice(2);
if(!KOK_B){console.error('Kullanım: node araclar/hiz-evre.js KLASÖR [maç] [tur] [ilk tohum]');process.exit(2);}
const N=Math.max(1,parseInt(NS||'8',10)),TEKRAR=Math.max(1,parseInt(TS||'2',10)),T0=parseInt(T0S||'1',10);
const KUR='(t)=>{const m=new Match(()=>{},{kadro:MAC_KADRO,tohum:t,tunel:{x:0,z:-6}});m.macaGec();return m;}';
const kurAl=k=>{const {ctx}=motorYukle(null,k);ayarUygula(ctx,process.env.MAC_DENEME_AYAR);return vm.runInContext(KUR,ctx);};
const A=kurAl(KOK),B=kurAl(KOK_B);
function oyna(kur){
  const E={};
  for(let t=T0;t<T0+N;t++){const m=kur(t);let a=0;
    while(m.phase!=='fulltime'&&a<60*60*45){const ph=m.phase,n0=process.hrtime.bigint();m.step(1/60);const d=Number(process.hrtime.bigint()-n0);
      const e=E[ph]||(E[ph]={n:0,ns:0});e.n++;e.ns+=d;a++;}}
  return E;
}
oyna(A);oyna(B);   /* ısınma (sayılmaz) */
const SA=[],SB=[];
for(let r=0;r<TEKRAR;r++){if(r%2){SB.push(oyna(B));SA.push(oyna(A));}else{SA.push(oyna(A));SB.push(oyna(B));}process.stderr.write(`  tur ${r+1}/${TEKRAR} bitti\n`);}
const ort=x=>{const s=x.slice().sort((p,q)=>p-q);return s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2;};
const yuzde=v=>(v>=0?'+':'')+(100*v).toFixed(1)+'%';
const top=o=>Object.values(o).reduce((s,e)=>({n:s.n+e.n,ns:s.ns+e.ns}),{n:0,ns:0});
const binde=e=>e.n?e.ns/1e6/(e.n/1000):0;
const evreler=[...new Set([...SA,...SB].flatMap(o=>Object.keys(o)))];
console.log(`\nChairman motor hızı evreye göre · ${N} maç · tohum ${T0}…${T0+N-1} · ${TEKRAR} tur (aynı süreç, sıra tur tur değişir) · Node ${process.version}`);
console.log(`  Bu depo: ${KOK} · KLASÖR: ${KOK_B}`);
console.log('  Evre'.padEnd(13)+'adım payı (bu depo / KLASÖR)'.padEnd(32)+'ms / 1000 adım, ortanca'.padEnd(28)+'bu depo ÷ KLASÖR (aynı tur)');
for(const ph of [...evreler,'TOPLAM']){
  const g=(L,i)=>ph==='TOPLAM'?top(L[i]):(L[i][ph]||{n:0,ns:0});
  const pa=g(SA,0).n/top(SA[0]).n,pb=g(SB,0).n/top(SB[0]).n;
  const ma=SA.map((_,i)=>binde(g(SA,i))),mb=SB.map((_,i)=>binde(g(SB,i))),o=ma.map((x,i)=>mb[i]?x/mb[i]-1:0);
  console.log('  '+ph.padEnd(11)+`${(100*pa).toFixed(1).padStart(5)} / ${(100*pb).toFixed(1).padStart(5)} %`.padEnd(32)+`${ort(ma).toFixed(1).padStart(6)} / ${ort(mb).toFixed(1).padStart(6)}`.padEnd(28)+yuzde(ort(o)));
}
/* KLASÖR'ün evre payları bu deponun evre başına süresiyle tartılır: içerik (gol, duruş sayısı) farkı ayrılır, kodun maliyeti kalır */
const sabit=SA.map((_,i)=>{let ns=0,n=0;for(const ph of evreler){const ea=SA[i][ph],eb=SB[i][ph];if(!ea||!eb)continue;ns+=ea.ns/ea.n*eb.n;n+=eb.n;}
  return (ns/1e6/(n/1000))/binde(top(SB[i]))-1;});
console.log(`  Evre payları KLASÖR'ünkine eşitlenince bu depo ÷ KLASÖR: ${yuzde(ort(sabit))} (kodun maliyeti; aralık ${yuzde(Math.min(...sabit))} … ${yuzde(Math.max(...sabit))})`);
