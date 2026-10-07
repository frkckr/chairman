#!/usr/bin/env node
/* ============ Chairman — motor hız ölçümü (M0, 2026-10-07) ============
   Maçları tek süreçte, sırayla ve görüntüsüz oynatır; yalnız motor adımının (m.step) süresini ölçer. Hız bütçesinin ölçüsü budur
   (MAC_MOTORU_GERCEKCILIK_PLANI §6): mac-deneme.js'in "Süre / 1000 motor adımı" satırı paralel işçilerin birbirini yavaşlattığı süredir.
   Ölçüm sırasında makinede başka ağır iş çalışmamalıdır.
   Kullanım: node araclar/hiz-olcum.js [maç, varsayılan 2] [ilk tohum, varsayılan 1] [--profil [N]]
     --profil [N]  V8 işlemci profili (inspector): en çok süre alan N işlev (varsayılan 25), kendi süresi ve içerdikleriyle toplam süresi
   MOTOR_YUKLE_ESKI=1 motoru eski (sarılı) vm bağlamında yükler (araclar/motor-yukle.js). */
'use strict';
const {motorYukle}=require('./motor-yukle');
const vm=require('vm');
const ARG=process.argv.slice(2);
const pi=ARG.indexOf('--profil');let PROFIL=0;
if(pi>=0){const n=parseInt(ARG[pi+1],10);PROFIL=Number.isNaN(n)?25:n;ARG.splice(pi,Number.isNaN(n)?1:2);}
const N=Math.max(1,parseInt(ARG[0]||'2',10)),T0=parseInt(ARG[1]||'1',10);
const {ctx,kip}=motorYukle();
const kur=vm.runInContext('(t)=>{const m=new Match(()=>{},{kadro:MAC_KADRO,tohum:t,tunel:{x:0,z:-6}});m.macaGec();return m;}',ctx);

function oyna(){
  const sureler=[];let ns=0n,adim=0;
  for(let t=T0;t<T0+N;t++){const m=kur(t);let a=0,n0=process.hrtime.bigint();
    while(m.phase!=='fulltime'&&a<60*60*30){m.step(1/60);a++;}
    const d=process.hrtime.bigint()-n0;ns+=d;adim+=a;sureler.push(Number(d)/1e6/(a/1000));}
  return{ms:Number(ns)/1e6,adim,sureler};
}
function rapor(r,ek){
  console.log(`\nChairman motor hız ölçümü · ${N} maç · tohum ${T0}…${T0+N-1} · tek süreç · bağlam ${kip} · Node ${process.version}${ek||''}`);
  console.log(`  Süre / 1000 motor adımı: ${(r.ms/(r.adim/1000)).toFixed(1)} ms  (maç başına: ${r.sureler.map(x=>x.toFixed(0)).join(', ')})`);
  console.log(`  Maç başına motor süresi: ${(r.ms/N/1000).toFixed(1)} sn · ${Math.round(r.adim/N)} adım`);
}
if(!PROFIL){rapor(oyna());}
else{
  const inspector=require('inspector'),S=new inspector.Session();S.connect();
  const post=(m,p)=>new Promise((ok,no)=>S.post(m,p||{},(e,r)=>e?no(e):ok(r)));
  (async()=>{
    await post('Profiler.enable');await post('Profiler.setSamplingInterval',{interval:200});await post('Profiler.start');
    const r=oyna();
    const {profile:P}=await post('Profiler.stop');S.disconnect();
    rapor(r,' · profil açık (süre şişer)');
    /* düğümler: kendi süresi örneklerden (timeDeltas), içerdikleriyle süre üst zincirden (aynı işlev zincirde bir kez sayılır) */
    const dugum=new Map(),ust=new Map();for(const n of P.nodes){dugum.set(n.id,n);for(const c of n.children||[])ust.set(c,n.id);}
    const ad=n=>{const c=n.callFrame,f=(c.url||'').replace(/^.*[\\/](js|araclar)[\\/]/,'$1/');return `${c.functionName||'(anonim)'} ${f?f+':'+(c.lineNumber+1):''}`.trim();};
    const kendi=new Map(),toplam=new Map();let hepsi=0;
    for(let i=0;i<P.samples.length;i++){const dt=(P.timeDeltas[i+1]!=null?P.timeDeltas[i+1]:0)/1000;hepsi+=dt;
      let id=P.samples[i];const k=ad(dugum.get(id));kendi.set(k,(kendi.get(k)||0)+dt);
      const gor=new Set();while(id!=null){const a=ad(dugum.get(id));if(!gor.has(a)){gor.add(a);toplam.set(a,(toplam.get(a)||0)+dt);}id=ust.get(id);}}
    const yaz=(baslik,M)=>{console.log(`\n  ${baslik} (ms · %)`);
      [...M.entries()].filter(([k])=>!/^\((root|program|idle|garbage collector)\)/.test(k)||baslik.startsWith('Kendi')).sort((a,b)=>b[1]-a[1]).slice(0,PROFIL)
        .forEach(([k,v])=>console.log(`  ${v.toFixed(0).padStart(8)}  ${(100*v/hepsi).toFixed(1).padStart(5)}  ${k}`));};
    yaz('Kendi süresi en çok olanlar',kendi);
    yaz('İçerdikleriyle süre en çok olanlar',toplam);
  })().catch(e=>{console.error(e.stack||e.message);process.exit(1);});
}
