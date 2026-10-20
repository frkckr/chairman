'use strict';
/* ============ Z7 (2026-10-20 gece): tarz kenarı ölçüsü — FUTBOL_KUTUPHANESI §7, kutuphane/G-hoca-tarzlari.md G7.2 ============
   İki tarzın aynı iki kadroyla, aynı tohumlarda iki sırada maçı: A ev sahibiyken (kadro sırası değişmez, yalnız tarzlar takas) ve B ev sahibiyken.
   Kadronun ve ev sahipliğinin payı iki sırada aynıdır; tarzın kenarı tohum başına eşleştirilmiş farkın yarısıdır:
     kenar(A üstüne B) = ortalama[(ev − konuk)_{A,B} − (ev − konuk)_{B,A}] / 2   (gol / maç; ± %95 güven aralığı)
   G2.8'in kenar matrisi (tahmin) bu sayıyla doldurulur; denge kararı 80 maçla (CLAUDE.md). Kullanım:
     node araclar/tarz-kenar.js A B [N=80] [ilk tohum=1]   (A, B: js/mac-tarz.js arketip adları; MAC_DENEME_AYAR geçer) */
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path'),os=require('os');
const [A,B,N0,T0]=process.argv.slice(2);if(!A||!B){console.error('kullanım: node araclar/tarz-kenar.js A B [N] [tohum]');process.exit(2);}
const N=+N0||80,T=+T0||1,arac=path.join(__dirname,'mac-deneme.js'),gec=fs.mkdtempSync(path.join(os.tmpdir(),'tarz-kenar-'));
const kos=(x,y)=>{const j=path.join(gec,`${x}-${y}.json`);execFileSync(process.execPath,[arac,String(N),String(T),'--tarz',`${x},${y}`,'--json',j],{stdio:['ignore','ignore','inherit'],env:process.env,maxBuffer:1<<26});
  const S=JSON.parse(fs.readFileSync(j,'utf8')).sonuclar,M=new Map();for(const s of S)M.set(s.tohum,s);return M;};
const t0=Date.now(),AB=kos(A,B),BA=kos(B,A),dd=[];let gAB=[0,0],gBA=[0,0],n=0;
for(const [t,s] of AB){const r=BA.get(t);if(!r||s.bitmedi||r.bitmedi)continue;n++;gAB[0]+=s.golEv;gAB[1]+=s.golDep;gBA[0]+=r.golEv;gBA[1]+=r.golDep;dd.push(((s.golEv-s.golDep)-(r.golEv-r.golDep))/2);}
const ort=dd.reduce((a,b)=>a+b,0)/n,sd=Math.sqrt(dd.reduce((a,b)=>a+(b-ort)*(b-ort),0)/Math.max(1,n-1)),se=sd/Math.sqrt(n);
const f=x=>x.toFixed(2);
console.log(`Tarz kenarı · ${A} ↔ ${B} · ${n} eşleştirilmiş tohum (${T}…${T+N-1}) · ${((Date.now()-t0)/1000).toFixed(0)} sn${process.env.MAC_DENEME_AYAR?' · ayar '+process.env.MAC_DENEME_AYAR:''}`);
console.log(`  ${A} ev sahibi: gol ${f(gAB[0]/n)} – ${f(gAB[1]/n)} · ${B} ev sahibi: gol ${f(gBA[0]/n)} – ${f(gBA[1]/n)}`);
console.log(`  kenar (${A} üstüne ${B}): ${ort>=0?'+':''}${f(ort)} gol / maç  [%95: ${f(ort-1.96*se)} … ${f(ort+1.96*se)}]`);
fs.rmSync(gec,{recursive:true,force:true});
