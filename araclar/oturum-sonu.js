#!/usr/bin/env node
/* ============ Chairman — oturum sonu kontrolü (M0, 2026-10-07; CLAUDE.md "Kontrol", orta kademe) ============
   Yerel commit'ten önce tek komutla: ad ve sınır denetimi, 40 maç tabanla karşılaştırma ve bütün senaryolar. Arka planda çalıştırılabilir;
   geliştirme sürerken biter. Tam rapor araclar/son-oturum.txt'ye yazılır (Git dışında), ekrana özet basılır.
   Kullanım: node araclar/oturum-sonu.js [taban, varsayılan araclar/taban/m0.json] [--mac N, varsayılan 40] [--senaryo a,b,…] [--ayni]
     --senaryo  yalnız bu senaryolar (varsayılan: araclar/senaryolar/ içindeki hepsi)
     --ayni     karşılaştırma tohum başına parmak iziyle (sonucu değiştirmemesi gereken düzenlemede)
   Çıkış kodu: herhangi bir adım sıfır dışı döndüyse 1. Senaryoların "!" satırları kabul dışı ölçümlerdir; T0 senaryolarında çıkış kodunu
   bozmazlar ama özette sayılır. Bu kademe denge onayı değildir; denge 80 maçlık tur kapanışında değerlendirilir. */
'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const KOK=path.join(__dirname,'..');
const ARG=process.argv.slice(2);
function secenek(ad,degerli){const i=ARG.indexOf(ad);if(i<0)return null;if(!degerli){ARG.splice(i,1);return true;}return ARG.splice(i,2)[1];}
const MAC=parseInt(secenek('--mac',true)||'40',10),SECILI=secenek('--senaryo',true),AYNI=!!secenek('--ayni',false);
const TABAN=ARG[0]||path.join('araclar','taban','m0.json');
const RAPOR=path.join(__dirname,'son-oturum.txt');
const SENARYOLAR=SECILI?SECILI.split(','):fs.readdirSync(path.join(__dirname,'senaryolar')).filter(f=>f.endsWith('.js')).map(f=>f.slice(0,-3)).sort();

const calistir=(ad,arg)=>new Promise(tamam=>{const t0=Date.now();let cikti='';
  const c=spawn(process.execPath,arg,{cwd:KOK,env:Object.assign({},process.env,{PYTHONUTF8:'1'})});
  c.stdout.on('data',d=>cikti+=d);c.stderr.on('data',d=>cikti+=d);
  c.on('close',k=>tamam({ad,k,sure:(Date.now()-t0)/1000,cikti}));});
/* havuz: en çok n iş aynı anda */
async function havuz(isler,n){const sonuc=[];let i=0;
  await Promise.all(Array.from({length:Math.min(n,isler.length)},async()=>{while(i<isler.length){const j=i++;sonuc[j]=await isler[j]();}}));return sonuc;}

(async()=>{
  const t0=Date.now();
  if(!fs.existsSync(path.resolve(KOK,TABAN))){console.error(`Taban yok: ${TABAN} (önce: node araclar/mac-deneme.js 80 1 --json ${TABAN})`);process.exit(2);}
  console.log(`Oturum sonu kontrolü başladı · ${MAC} maç (taban ${TABAN}${AYNI?', --ayni':''}) · ${SENARYOLAR.length} senaryo · rapor ${path.relative(KOK,RAPOR)}`);
  const ad=await calistir('ad-denetimi',[path.join('araclar','ad-denetimi.js')]);
  const mac=await calistir(`mac-deneme ${MAC}`,[path.join('araclar','mac-deneme.js'),String(MAC),'1','--karsilastir',TABAN].concat(AYNI?['--ayni']:[]));
  /* havuz fiziksel çekirdek kadar (mac-deneme.js --isci ölçümü: dizüstü işlemcide bütün iş parçacıkları yüklenince güç sınırı) */
  const sen=await havuz(SENARYOLAR.map(s=>()=>calistir('senaryo '+s,[path.join('araclar','mac-deneme.js'),'--senaryo',s])),Math.max(1,Math.floor(os.cpus().length/2)));
  const hepsi=[ad,mac,...sen];
  /* özet: her adımın süresi, çıkış kodu ve "!" satırları */
  const unlem=r=>r.cikti.split('\n').filter(L=>/^\s*!/.test(L)).map(L=>L.trim());
  const ozet=[];let hata=0;
  ozet.push(`Oturum sonu kontrolü · ${new Date().toISOString()} · toplam ${((Date.now()-t0)/1000).toFixed(0)} sn`);
  for(const r of hepsi){const U=unlem(r);if(r.k!==0)hata++;
    ozet.push(`${r.k===0?'  ':'! '}${r.ad.padEnd(26)} ${String(r.k).padStart(2)}  ${r.sure.toFixed(0).padStart(4)} sn  ${U.length?U.length+' "!" satırı':''}`);}
  const satir=(re)=>{const L=mac.cikti.split('\n').find(x=>re.test(x));return L?L.trim():'—';};
  ozet.push('',`Maç: ${satir(/Hedef dışında:/)} · ${satir(/Tekrarlanabilirlik:/)}${AYNI?' · '+satir(/Birebir aynılık:/):''}`);
  ozet.push(`Ad denetimi: ${ad.cikti.trim().split('\n')[0]}`);
  const senU=sen.filter(r=>unlem(r).length);
  if(senU.length){ozet.push('','Senaryolarda kabul dışı satırlar:');for(const r of senU)for(const L of unlem(r))ozet.push(`  ${r.ad.slice(8)}: ${L}`);}
  const metin=ozet.join('\n');
  fs.writeFileSync(RAPOR,metin+'\n\n'+hepsi.map(r=>`==================== ${r.ad} (çıkış ${r.k}, ${r.sure.toFixed(1)} sn) ====================\n${r.cikti}`).join('\n'));
  console.log(metin);
  console.log(`\n${hata?'! '+hata+' adım başarısız':'Bütün adımlar çıkış kodu 0'} · tam rapor: ${path.relative(KOK,RAPOR)}`);
  process.exitCode=hata?1:0;
})().catch(e=>{console.error(e.stack||e.message);process.exit(1);});
