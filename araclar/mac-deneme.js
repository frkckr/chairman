#!/usr/bin/env node
/* ============ Demirkapı '99 — maç deneme aracı ============
   Maç motorunu görüntüsüz, hızlıca oynatır ve maç istatistiklerini hedef tabloyla karşılaştırır.
   Kullanım:  node araclar/mac-deneme.js [maç sayısı, varsayılan 40] [ilk tohum, varsayılan 1]
   - Motor dosyaları index.html'deki sırayla yüklenir: js/goruntu.js'ten önceki mantık dosyaları
     (stil ve stat tarifleri hariç; motor onlara bağlı değildir).
   - Her maç santradan başlar (maç öncesi atlanır). Tohum aynıysa maç da aynıdır.
   - Hedef dışında kalan satırlar "!" ile işaretlenir. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
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

/* ---- hedef tablo (10 dakikalık maç, "kesintisiz ama sık"; bkz. YOL_HARITASI.md kararları) ---- */
const HEDEF=[
  ['Gol','gol',2.4,2.9],
  ['Şut','sut',16,22],
  ['İsabetli şut oranı %','isabetOran',30,40],
  ['Korner','korner',6,9],
  ['Taç','tac',16,24],
  ['Kale vuruşu','kaleVurusu',8,12],
  ['Faul','faul',10,14],
  ['Sarı kart','sari',2,3.5],
  ['Kırmızı kart','kirmizi',0,0.15],
  ['Ofsayt','ofsayt',2,3],
  ['Pas','pas',220,320],
  ['Pas isabeti %','pasOran',74,82],
  ['İleri pas %','ileriOran',27,43],
  ['Yan pas %','yanOran',27,43],
  ['Geri pas %','geriOran',22,38],
  ['Uzun pas %','uzunOran',8,15],
  ['Hava topu mücadelesi','havaTopu',12,20],
  ['Uzatma 1. yarı (dk)','uzatma1',1,4],
  ['Uzatma 2. yarı (dk)','uzatma2',3,7],
  ['Değişiklik (takım başına)','degisiklik',2,4],
  ['Top oyunda %','oyundaOran',55,65]
];

/* ---- bir maç ---- */
function macOyna(tohum){
  const olaylar={};let sonSut=null;
  const on=(ad,v)=>{olaylar[ad]=(olaylar[ad]||0)+1;if(ad==='shot')sonSut=v;};
  const m=vm.runInContext('(on,tohum)=>new Match(on,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}})',ctx)(on,tohum);
  if(typeof m.macaGec==='function')m.macaGec();else m.setupKickoff(0,true);
  let adim=0,oyunda=0,toplam=0;const MAKS=60*60*30;
  while(m.phase!=='fulltime'&&adim<MAKS){
    m.step(1/60);adim++;
    if(m.phase!=='halftime'&&m.phase!=='fulltime'){toplam++;if(m.phase==='play')oyunda++;}
  }
  const s={sure:adim/60,bitmedi:m.phase!=='fulltime'};
  if(m.ist){/* yeni motor: istatistikleri kendi tutar */
    const I=m.ist,top=a=>a[0]+a[1];
    Object.assign(s,{gol:top(m.score),sut:top(I.sut),isabet:top(I.isabet),korner:top(I.korner),tac:top(I.tac),kaleVurusu:top(I.kaleVurusu),
      faul:top(I.faul),sari:top(I.sari),kirmizi:top(I.kirmizi),ofsayt:top(I.ofsayt),pas:top(I.pas),pasTamam:top(I.pasTamam),
      ileri:I.pasYon.ileri,yan:I.pasYon.yan,geri:I.pasYon.geri,uzun:I.uzunPas,havaTopu:I.havaTopu,
      uzatma1:I.uzatma[0],uzatma2:I.uzatma[1],degisiklik:top(I.degisiklik)/2,oyunda:I.oyunda,toplam:I.toplam});
  }else{/* eski motor: olaylardan say */
    const o=k=>olaylar[k]||0;
    Object.assign(s,{gol:m.score[0]+m.score[1],sut:m.shots[0]+m.shots[1],isabet:o('save')+m.score[0]+m.score[1],korner:o('corner'),tac:o('throw'),kaleVurusu:o('goalkick'),
      faul:0,sari:0,kirmizi:0,ofsayt:0,pas:o('pass'),pasTamam:NaN,ileri:NaN,yan:NaN,geri:NaN,uzun:NaN,havaTopu:o('header'),
      uzatma1:Math.ceil(m.added[0]/60),uzatma2:Math.ceil(m.added[1]/60),degisiklik:0,oyunda,toplam});
  }
  s.isabetOran=s.sut?100*s.isabet/s.sut:0;
  s.pasOran=s.pas?100*s.pasTamam/s.pas:NaN;
  const yonToplam=s.ileri+s.yan+s.geri;
  s.ileriOran=100*s.ileri/yonToplam;s.yanOran=100*s.yan/yonToplam;s.geriOran=100*s.geri/yonToplam;
  s.uzunOran=s.pas?100*s.uzun/s.pas:NaN;
  s.oyundaOran=100*s.oyunda/s.toplam;
  return s;
}

/* ---- çalıştır, özetle ---- */
const t0=Date.now(),sonuclar=[];
for(let i=0;i<MAC_SAYISI;i++)sonuclar.push(macOyna(ILK_TOHUM+i));
const ort=k=>{const v=sonuclar.map(s=>s[k]).filter(x=>!Number.isNaN(x));return v.length?v.reduce((a,b)=>a+b,0)/v.length:NaN;};
const sap=k=>{const v=sonuclar.map(s=>s[k]).filter(x=>!Number.isNaN(x)),o=ort(k);return v.length?Math.sqrt(v.reduce((a,b)=>a+(b-o)*(b-o),0)/v.length):NaN;};
const f=(x,n)=>Number.isNaN(x)?'—':x.toFixed(n);
console.log(`\nDemirkapı '99 maç deneme aracı · ${MAC_SAYISI} maç · tohum ${ILK_TOHUM}…${ILK_TOHUM+MAC_SAYISI-1} · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
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
