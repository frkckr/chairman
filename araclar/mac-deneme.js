#!/usr/bin/env node
/* ============ Chairman — maç deneme aracı ============
   Maç motorunu görüntüsüz, hızlıca oynatır ve maç istatistiklerini hedef tabloyla karşılaştırır.
   Kullanım:  node araclar/mac-deneme.js [maç sayısı, varsayılan 40] [ilk tohum, varsayılan 1]
   - Motor dosyaları index.html'deki sırayla yüklenir: js/goruntu.js'ten önceki mantık dosyaları
     (stil ve stat tarifleri hariç; motor onlara bağlı değildir).
   - Her maç santradan başlar (maç öncesi atlanır). Tohum aynıysa maç da aynıdır.
   - Maçlar işlemci çekirdeği sayısı kadar paralel oynatılır (bir maç ~7 sn).
   - Hedef dışında kalan satırlar "!" ile işaretlenir. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),os=require('os'),{spawn}=require('child_process');
const KOK=path.join(__dirname,'..');
const MAC_SAYISI=Math.max(1,parseInt(process.argv[2]||'40',10));
const ILK_TOHUM=parseInt(process.argv[3]||'1',10);

/* ---- motoru yükle ---- */
const html=fs.readFileSync(path.join(KOK,'index.html'),'utf8');
const sira=[...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m=>m[1]);
const DISARIDA=new Set(['js/stil-99.js','js/stadyum-tarifleri.js']);
const mantik=sira.slice(0,sira.indexOf('js/goruntu.js')).filter(f=>!DISARIDA.has(f));
const ctx=vm.createContext({console,Math,Date});
for(const f of mantik)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),ctx,{filename:f});

/* ---- hedef tablo: 10 dakikalık, kesintisiz maç (2026-09-28'de gözden geçirildi; bkz. YOL_HARITASI.md kararları) ----
   Oyuncular gerçek hızda koştuğu için bir maçta ~7 dakika (≈400 sn) oyun oynanır; gerçek bir maçta bu ~55 dakikadır.
   Gerçekçi kararlarla motor şut ve gol gibi önemli olayları gerçeğin dakika başına 2,5–3 katı sıklıkta üretir:
   gol sayısı gerçeğe yakındır; şut, korner, taç ve pas gibi sık tekrarlanan olaylar gerçek maçın yarısından azdır.
   Oranlar (isabet, pas isabeti, pas yönleri, uzun pas) gerçek maçlara göre tutulur. */
const HEDEF=[
  ['Gol','gol',1.8,3.0],
  ['Şut','sut',8,14],
  ['İsabetli şut oranı %','isabetOran',30,45],
  ['Korner','korner',2,6],
  ['Taç','tac',5,12],
  ['Kale vuruşu','kaleVurusu',2.5,8],
  ['Faul','faul',8,14],
  ['Sarı kart','sari',1.5,3.5],
  ['Kırmızı kart','kirmizi',0,0.2],
  ['Ofsayt','ofsayt',0.3,2],
  ['Pas','pas',110,200],
  ['Pas isabeti %','pasOran',65,80],
  ['İleri pas %','ileriOran',30,45],
  ['Yan pas %','yanOran',35,58],
  ['Geri pas %','geriOran',10,25],
  ['Uzun pas %','uzunOran',10,24],
  ['Hava topu mücadelesi','havaTopu',6,15],
  ['Uzatma 1. yarı (dk)','uzatma1',1,4],
  ['Uzatma 2. yarı (dk)','uzatma2',3,7],
  ['Değişiklik (takım başına)','degisiklik',2,4],
  ['Top oyunda %','oyundaOran',58,72]
];

/* ---- bir maç ---- */
function macOyna(tohum){
  const m=vm.runInContext('(tohum)=>new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}})',ctx)(tohum);
  m.macaGec();
  let adim=0;const MAKS=60*60*30;
  while(m.phase!=='fulltime'&&adim<MAKS){m.step(1/60);adim++;}
  const I=m.ist,top=a=>a[0]+a[1];
  const s={sure:adim/60,bitmedi:m.phase!=='fulltime',gol:top(m.score),sut:top(I.sut),isabet:top(I.isabet),korner:top(I.korner),tac:top(I.tac),
    kaleVurusu:top(I.kaleVurusu),faul:top(I.faul),sari:top(I.sari),kirmizi:top(I.kirmizi),ofsayt:top(I.ofsayt),pas:top(I.pas),pasTamam:top(I.pasTamam),
    ileri:I.pasYon.ileri,yan:I.pasYon.yan,geri:I.pasYon.geri,uzun:I.uzunPas,havaTopu:I.havaTopu,
    uzatma1:I.uzatma[0],uzatma2:I.uzatma[1],degisiklik:top(I.degisiklik)/2,oyunda:I.oyunda,toplam:I.toplam};
  s.isabetOran=s.sut?100*s.isabet/s.sut:0;
  s.pasOran=s.pas?100*s.pasTamam/s.pas:0;
  const yonToplam=s.ileri+s.yan+s.geri||1;
  s.ileriOran=100*s.ileri/yonToplam;s.yanOran=100*s.yan/yonToplam;s.geriOran=100*s.geri/yonToplam;
  s.uzunOran=s.pas?100*s.uzun/s.pas:0;
  s.oyundaOran=100*s.oyunda/(s.toplam||1);
  return s;
}

/* ---- işçi: kendisine verilen tohum aralığını oynatır, sonuçları JSON olarak yazar ---- */
if(process.env.MAC_DENEME_TOHUMLAR){
  const [a,b]=process.env.MAC_DENEME_TOHUMLAR.split(',').map(Number),out=[];
  for(let t=a;t<b;t++)out.push(macOyna(t));
  process.stdout.write(JSON.stringify(out));
}else{
  /* ---- maçları çekirdeklere dağıt, sonuçları topla, özetle ---- */
  const t0=Date.now(),isci=Math.max(1,Math.min(os.cpus().length,MAC_SAYISI)),parca=Math.ceil(MAC_SAYISI/isci),isler=[];
  for(let i=0;i<isci;i++){const a=ILK_TOHUM+i*parca,b=Math.min(ILK_TOHUM+MAC_SAYISI,a+parca);if(a>=b)break;
    isler.push(new Promise((tamam,hata)=>{
      const c=spawn(process.execPath,[__filename],{env:Object.assign({},process.env,{MAC_DENEME_TOHUMLAR:a+','+b})});let s='';
      c.stdout.on('data',d=>s+=d);c.stderr.on('data',d=>process.stderr.write(d));
      c.on('close',k=>k===0?tamam(JSON.parse(s)):hata(new Error(`tohum ${a}–${b-1} oynatılamadı (çıkış kodu ${k})`)));}));}
  Promise.all(isler).then(p=>{
    const sonuclar=[].concat(...p);
    const deger=k=>sonuclar.map(s=>s[k]).filter(x=>typeof x==='number'&&!Number.isNaN(x));
    const ort=k=>{const v=deger(k);return v.length?v.reduce((a,b)=>a+b,0)/v.length:NaN;};
    const sap=k=>{const v=deger(k),o=ort(k);return v.length?Math.sqrt(v.reduce((a,b)=>a+(b-o)*(b-o),0)/v.length):NaN;};
    const f=(x,n)=>Number.isNaN(x)?'—':x.toFixed(n);
    console.log(`\nChairman maç deneme aracı · ${MAC_SAYISI} maç · tohum ${ILK_TOHUM}…${ILK_TOHUM+MAC_SAYISI-1} · ${isler.length} çekirdek · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
    console.log(`Motor dosyaları: ${mantik.join(', ')}\n`);
    console.log('  '+'Ölçüm'.padEnd(28)+'Ortalama'.padStart(10)+'  ±'.padEnd(8)+'Hedef'.padStart(12));
    let disarida=0;
    for(const [ad,k,a,b] of HEDEF){
      const o=ort(k),dis=!Number.isNaN(o)&&(o<a||o>b);if(dis)disarida++;
      console.log((dis?'! ':'  ')+ad.padEnd(28)+f(o,1).padStart(10)+('  '+f(sap(k),1)).padEnd(8)+`${a}–${b}`.padStart(12));
    }
    const bitmeyen=sonuclar.filter(s=>s.bitmedi).length;
    console.log(`\nOrtalama maç süresi: ${f(ort('sure')/60,1)} dakika (gerçek zaman)${bitmeyen?` · BİTMEYEN MAÇ: ${bitmeyen}`:''}`);
    console.log(`Hedef dışında: ${disarida} satır`);
  }).catch(e=>{console.error(e.message);process.exit(1);});
}
