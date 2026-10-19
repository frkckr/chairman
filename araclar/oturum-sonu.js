#!/usr/bin/env node
/* ============ Chairman — oturum sonu kontrolü (M0, 2026-10-07; CLAUDE.md "Kontrol", orta kademe; Z1, 2026-10-19: çekirdek/seyrek senaryo ayrımı) ============
   Yerel commit'ten önce tek komutla: ad ve sınır denetimi, N maç tabanla karşılaştırma (sağlık aralığı, ilkel ve örüntü satırları) ve çekirdek
   senaryolar. Arka planda çalıştırılabilir; geliştirme sürerken biter. Tam rapor araclar/son-oturum.txt'ye yazılır (Git dışında), ekrana özet basılır.
   Kullanım: node araclar/oturum-sonu.js [taban, varsayılan araclar/taban/z1.json] [--mac N, varsayılan 40; dizüstünde 24] [--seyrek] [--senaryo a,b,…] [--ayni]
     taban      turun tabanı (YOL_HARITASI devam notu yazar); varsayılan her tur kapanışında güncellenir
     --seyrek   seyrek senaryoları da koşar (SEYREK listesi: korudukları dosyalar seyrek değişir, süreleri uzundur — sahibi dosya değiştiğinde ya da
                tur kapanışında; FUTBOL_KUTUPHANESI §11.2)
     --senaryo  yalnız bu senaryolar (varsayılan: araclar/senaryolar/ içindeki çekirdekler; --seyrek ile hepsi)
     --ayni     karşılaştırma tohum başına parmak iziyle (sonucu değiştirmemesi gereken düzenlemede)
   Çıkış kodu: herhangi bir adım sıfır dışı döndüyse 1. Senaryoların "!" satırları kapı (kabul dışı) satırlarıdır ve çıkış kodunu 1 yapar; bilgi satırları
   "!" basmaz. Maç adımının "!" satırları sağlık aralığı dışı ya da Node sürüm uyarısıdır (çıkış kodu değişmez; parmak izi farkı --ayni'de çıkış 1).
   Bu kademe denge onayı değildir; denge 80 maçlık tur kapanışında değerlendirilir. */
'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const KOK=path.join(__dirname,'..');
const ARG=process.argv.slice(2);
function secenek(ad,degerli){const i=ARG.indexOf(ad);if(i<0)return null;if(!degerli){ARG.splice(i,1);return true;}return ARG.splice(i,2)[1];}
const MAC=parseInt(secenek('--mac',true)||'40',10),SECILI=secenek('--senaryo',true),AYNI=!!secenek('--ayni',false),SEYREKLER=!!secenek('--seyrek',false);
const TABAN=ARG[0]||path.join('araclar','taban','z1.json');   /* Z1 kapanışı: z1.json (plan 0 + cizgiKoru 0 için t23.json elle verilir); T23 kapanışı: t23.json; T23-0: t22.json (T19–T22'de t19.json silinmişti); T19: t19.json (M3'te t18.json); M3: varsayılan taban güncel tura (A4'te a4.json — T18'de silinmişti, varsayılan boşa düşüyordu; T16'da t16.json, T16-0'da h1.json, T15-0'da t14.json; eskiden t8.json, 10 dakikalık maç) */
const RAPOR=path.join(__dirname,'son-oturum.txt');
/* Z1 (2026-10-19; FUTBOL_KUTUPHANESI §11.2): seyrek senaryolar — korudukları dosyalar 2026-10-04'ten beri 1–4 kez değişti, senaryo toplamının yarısı */
const SEYREK=['d-duran','d-topcu','m-isinma','m-fotograf','p-tip','o-sakatlik','d-penalti'];
const SENARYOLAR=SECILI?SECILI.split(','):fs.readdirSync(path.join(__dirname,'senaryolar')).filter(f=>f.endsWith('.js')).map(f=>f.slice(0,-3)).filter(s=>SEYREKLER||!SEYREK.includes(s)).sort();

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
  console.log(`Oturum sonu kontrolü başladı · ${MAC} maç (taban ${TABAN}${AYNI?', --ayni':''}) · ${SENARYOLAR.length} senaryo (${SECILI?'seçili':SEYREKLER?'çekirdek + seyrek':'çekirdek; seyrekler --seyrek ile'}) · rapor ${path.relative(KOK,RAPOR)}`);
  const ad=await calistir('ad-denetimi',[path.join('araclar','ad-denetimi.js')]);
  const mac=await calistir(`mac-deneme ${MAC}`,[path.join('araclar','mac-deneme.js'),String(MAC),'1','--karsilastir',TABAN].concat(AYNI?['--ayni']:[]));
  /* havuz mantıksal çekirdeğin yarısı kadar — iki iş parçacıklı işlemcide fiziksel çekirdek sayısı (mac-deneme.js --isci ölçümü: dizüstü işlemcide bütün
     iş parçacıkları yüklenince güç sınırı) */
  const sen=await havuz(SENARYOLAR.map(s=>()=>calistir('senaryo '+s,[path.join('araclar','mac-deneme.js'),'--senaryo',s])),Math.max(1,Math.floor(os.cpus().length/2)));
  const hepsi=[ad,mac,...sen];
  /* özet: her adımın süresi, çıkış kodu ve "!" satırları */
  const unlem=r=>r.cikti.split('\n').filter(L=>/^\s*!/.test(L)).map(L=>L.trim());
  const ozet=[];let hata=0;
  ozet.push(`Oturum sonu kontrolü · ${new Date().toISOString()} · toplam ${((Date.now()-t0)/1000).toFixed(0)} sn`);
  for(const r of hepsi){const U=unlem(r);if(r.k!==0)hata++;
    ozet.push(`${r.k===0?'  ':'! '}${r.ad.padEnd(26)} ${String(r.k).padStart(2)}  ${r.sure.toFixed(0).padStart(4)} sn  ${U.length?U.length+(r===mac?' "!" satırı (sağlık aralığı dışı ya da uyarı)':' kabul dışı satır'):''}`);}
  const satir=(re)=>{const L=mac.cikti.split('\n').find(x=>re.test(x));return L?L.trim():'—';};
  ozet.push('',`Maç: ${satir(/Sağlık aralığı dışında:/)} · ${satir(/Tekrarlanabilirlik:/)}${AYNI?' · '+satir(/Birebir aynılık:/):''}`);
  ozet.push(`Ad denetimi: ${ad.cikti.trim().split('\n')[0]}`);
  const senU=sen.filter(r=>unlem(r).length);
  if(senU.length){ozet.push('','Senaryolarda kabul dışı satırlar:');for(const r of senU)for(const L of unlem(r))ozet.push(`  ${r.ad.slice(8)}: ${L}`);}
  const metin=ozet.join('\n');
  fs.writeFileSync(RAPOR,metin+'\n\n'+hepsi.map(r=>`==================== ${r.ad} (çıkış ${r.k}, ${r.sure.toFixed(1)} sn) ====================\n${r.cikti}`).join('\n'));
  console.log(metin);
  console.log(`\n${hata?'! '+hata+' adım başarısız':'Bütün adımlar çıkış kodu 0'} · tam rapor: ${path.relative(KOK,RAPOR)}`);
  process.exitCode=hata?1:0;
})().catch(e=>{console.error(e.stack||e.message);process.exit(1);});
