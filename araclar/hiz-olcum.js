#!/usr/bin/env node
/* ============ Chairman — motor hız ölçümü (M0, 2026-10-07) ============
   Maçları tek süreçte, sırayla ve görüntüsüz oynatır; yalnız motor adımının (m.step) süresini ölçer. Hız bütçesinin ölçüsü budur
   (MAC_MOTORU_GERCEKCILIK_PLANI §6): mac-deneme.js'in "Süre / 1000 motor adımı" satırı paralel işçilerin birbirini yavaşlattığı süredir.
   Ölçüm sırasında makinede başka ağır iş çalışmamalıdır.
   Kullanım: node araclar/hiz-olcum.js [maç, varsayılan 2] [ilk tohum, varsayılan 1] [--tekrar N] [--profil [N]]
     --tekrar N    aynı maçları aynı süreçte N kez oynatır; her tekrarın süresi, ortancası ve en azı yazılır (M1, 2026-10-10). Tur kabulü:
                   önceki turun kodu (MOTOR_KOK ile ayrı çalışma ağacından) ve şimdiki kod aynı oturumda sırayla `3 --tekrar 5` (CLAUDE.md "Kontrol")
     --profil [N]  V8 işlemci profili (inspector): en çok süre alan N işlev (varsayılan 25), kendi süresi ve içerdikleriyle toplam süresi
     --ayarlar JSON  (T15-00, 2026-10-14) ayarların maliyetini aynı süreçte ayırır: JSON {ad: {anahtar: değer, …}, …}; "varsayılan" her zaman
                   eklenir. Her turda (--tekrar N tur) bütün ayarlar sırası döndürülerek aynı maçları oynar (tur r, r. ayardan başlar);
                   her ayarın turdaki süresi aynı turdaki varsayılana oranlanır (eşleştirilmiş oran: makinenin ısıl kayması iki tarafa
                   da düşer). Yazılanlar: ayar başına ortanca ve en az ms/1000 adım, oranın ortancası ve aralığı. Süreçler arası
                   karşılaştırma (önceki tur, MOTOR_KOK) yine `3 --tekrar 5` çiftleriyle yapılır; bu kip aynı kodun anahtarları içindir
     --kok KLASÖR  (T15-00) iki motoru aynı süreçte karşılaştırır: bu depo (ya da MOTOR_KOK) ve KLASÖR'deki çalışma ağacı (git worktree add
                   --detach KLASÖR tur/<önceki>); her turda (--tekrar N) ikisi de aynı maçları oynar, sıra tur tur değişir; KLASÖR'ün süresi aynı
                   turdaki bu deponunkine oranlanır. Dizüstünde süreçler arası gürültüyü (ısıl kayma, sıra etkisi) iki taraf birlikte yaşar
   MOTOR_YUKLE_ESKI=1 motoru eski (sarılı) vm bağlamında yükler, MOTOR_KOK=<klasör> motoru o çalışma ağacından yükler, MAC_DENEME_AYAR
   mac-deneme.js'teki gibi çalışır (araclar/motor-yukle.js). */
'use strict';
const {motorYukle,ayarUygula,KOK}=require('./motor-yukle');
const vm=require('vm'),os=require('os');
const ARG=process.argv.slice(2);
const pi=ARG.indexOf('--profil');let PROFIL=0;
if(pi>=0){const n=parseInt(ARG[pi+1],10);PROFIL=Number.isNaN(n)?25:n;ARG.splice(pi,Number.isNaN(n)?1:2);}
const ti=ARG.indexOf('--tekrar');let TEKRAR=1;
if(ti>=0){TEKRAR=Math.max(1,parseInt(ARG[ti+1],10)||1);ARG.splice(ti,2);}
const ki=ARG.indexOf('--kok');let KOK_B=null;
if(ki>=0){KOK_B=ARG[ki+1];ARG.splice(ki,2);}
const ai=ARG.indexOf('--ayarlar');let AYARLAR=null;
if(ai>=0){try{AYARLAR=JSON.parse(ARG[ai+1]);}catch(e){console.error('--ayarlar geçerli JSON değil: '+e.message);process.exit(2);}ARG.splice(ai,2);}
const N=Math.max(1,parseInt(ARG[0]||'2',10)),T0=parseInt(ARG[1]||'1',10);
const {ctx,kip}=motorYukle();
ayarUygula(ctx,process.env.MAC_DENEME_AYAR);
const KUR='(t)=>{const m=new Match(()=>{},{kadro:MAC_KADRO,tohum:t,tunel:{x:0,z:-6}});m.macaGec();return m;}',kur=vm.runInContext(KUR,ctx);
const gitAl=k=>{try{return require('child_process').execSync('git rev-parse --short HEAD',{cwd:k,stdio:['ignore','pipe','ignore']}).toString().trim()||'?';}catch(e){return'?';}};
const GIT=gitAl(KOK);

function oyna(kurF){
  const sureler=[];let ns=0n,adim=0;
  for(let t=T0;t<T0+N;t++){const m=(kurF||kur)(t);let a=0,n0=process.hrtime.bigint();
    while(m.phase!=='fulltime'&&a<60*60*30){m.step(1/60);a++;}
    const d=process.hrtime.bigint()-n0;ns+=d;adim+=a;sureler.push(Number(d)/1e6/(a/1000));}
  return{ms:Number(ns)/1e6,adim,sureler};
}
const binde=r=>r.ms/(r.adim/1000);
function baslik(ek){
  console.log(`\nChairman motor hız ölçümü · ${N} maç · tohum ${T0}…${T0+N-1} · tek süreç · bağlam ${kip} · Node ${process.version}${ek||''}`);
  console.log(`  İşlemci: ${(os.cpus()[0]||{model:'?'}).model.trim()} · motor git ${GIT}${process.env.MAC_DENEME_AYAR?' · MAC_DENEME_AYAR '+process.env.MAC_DENEME_AYAR:''}`);
}
function rapor(r,ek){
  baslik(ek);
  console.log(`  Süre / 1000 motor adımı: ${binde(r).toFixed(1)} ms  (maç başına: ${r.sureler.map(x=>x.toFixed(0)).join(', ')})`);
  console.log(`  Maç başına motor süresi: ${(r.ms/N/1000).toFixed(1)} sn · ${Math.round(r.adim/N)} adım`);
}
if(KOK_B){
  const B=motorYukle(null,KOK_B);ayarUygula(B.ctx,process.env.MAC_DENEME_AYAR);const kurB=vm.runInContext(KUR,B.ctx),gitB=gitAl(require('path').resolve(KOK_B));
  oyna();oyna(kurB);   /* ısınma (sayılmaz) */
  const SA=[],SB=[];
  for(let r=0;r<TEKRAR;r++){if(r%2){SB.push(binde(oyna(kurB)));SA.push(binde(oyna()));}else{SA.push(binde(oyna()));SB.push(binde(oyna(kurB)));}
    process.stderr.write(`  tur ${r+1}/${TEKRAR} bitti
`);}
  const ort=x=>{const s=x.slice().sort((p,q)=>p-q);return s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2;};
  const o=SA.map((a,i)=>a/SB[i]-1),y=v=>(v>=0?'+':'')+(100*v).toFixed(1)+'%';
  baslik(` · iki motor × ${TEKRAR} tur (aynı süreç, sıra tur tur değişir)`);
  console.log(`  Bu depo (git ${GIT})`.padEnd(40)+`ortanca ${ort(SA).toFixed(1)} ms · en az ${Math.min(...SA).toFixed(1)} ms · turlar: ${SA.map(x=>x.toFixed(0)).join(', ')}`);
  console.log(`  ${KOK_B} (git ${gitB})`.padEnd(40)+`ortanca ${ort(SB).toFixed(1)} ms · en az ${Math.min(...SB).toFixed(1)} ms · turlar: ${SB.map(x=>x.toFixed(0)).join(', ')}`);
  console.log(`  Bu depo ÷ ${KOK_B} (aynı tur): ortanca ${y(ort(o))} [${y(Math.min(...o))} … ${y(Math.max(...o))}] · en azların oranı ${y(Math.min(...SA)/Math.min(...SB)-1)}`);
}
else if(AYARLAR){
  /* varsayılan değerler (dizi değerler JSON kopyasıyla); her ayardan önce geri yüklenir */
  const adlar=['varsayılan',...Object.keys(AYARLAR).filter(a=>a!=='varsayılan')],tum=new Set();
  for(const a of adlar.slice(1))for(const k of Object.keys(AYARLAR[a]))tum.add(k);
  const yok=[...tum].filter(k=>!vm.runInContext(`Object.prototype.hasOwnProperty.call(MOTOR_AYAR,${JSON.stringify(k)})`,ctx));
  if(yok.length){console.error('--ayarlar: MOTOR_AYAR içinde olmayan anahtar: '+yok.join(', '));process.exit(2);}
  const taban=JSON.parse(vm.runInContext(`JSON.stringify(Object.fromEntries(${JSON.stringify([...tum])}.map(k=>[k,MOTOR_AYAR[k]])))`,ctx));
  const ayarKur=ad=>vm.runInContext(`Object.assign(MOTOR_AYAR,${JSON.stringify(taban)},${JSON.stringify(ad==='varsayılan'?{}:AYARLAR[ad])})`,ctx);
  ayarKur('varsayılan');oyna();   /* ısınma (sayılmaz) */
  const S={};for(const a of adlar)S[a]=[];
  for(let r=0;r<TEKRAR;r++){for(let j=0;j<adlar.length;j++){const a=adlar[(r+j)%adlar.length];ayarKur(a);S[a].push(binde(oyna()));}
    process.stderr.write(`  tur ${r+1}/${TEKRAR} bitti\n`);}
  ayarKur('varsayılan');
  const ort=x=>{const s=x.slice().sort((p,q)=>p-q);return s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2;};
  baslik(` · ${adlar.length} ayar × ${TEKRAR} tur (aynı süreç, sıra döner)`);
  console.log('  Ayar'.padEnd(26)+'ortanca ms'.padStart(12)+'en az'.padStart(9)+'   ÷ varsayılan (aynı tur): ortanca [en az … en çok]');
  for(const a of adlar){const o=S[a].map((x,i)=>x/S['varsayılan'][i]-1),y=v=>(v>=0?'+':'')+(100*v).toFixed(1)+'%';
    console.log('  '+a.padEnd(24)+ort(S[a]).toFixed(1).padStart(12)+Math.min(...S[a]).toFixed(1).padStart(9)+(a==='varsayılan'?'':`   ${y(ort(o))} [${y(Math.min(...o))} … ${y(Math.max(...o))}]`));}
}
else if(!PROFIL&&TEKRAR>1){
  const R=[];for(let i=0;i<TEKRAR;i++)R.push(oyna());
  const S=R.map(binde),sirali=S.slice().sort((a,b)=>a-b),ortanca=sirali[Math.floor((sirali.length-1)/2)];
  baslik(` · ${TEKRAR} tekrar`);
  R.forEach((r,i)=>console.log(`  Tekrar ${i+1}: ${S[i].toFixed(1)} ms  (maç başına: ${r.sureler.map(x=>x.toFixed(0)).join(', ')})`));
  console.log(`  Süre / 1000 motor adımı: ${ortanca.toFixed(1)} ms ortanca · en az ${sirali[0].toFixed(1)} ms`);
  console.log(`  Maç başına motor süresi: ${(R[S.indexOf(ortanca)].ms/N/1000).toFixed(1)} sn · ${Math.round(R[0].adim/N)} adım`);
}
else if(!PROFIL){rapor(oyna());}
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
