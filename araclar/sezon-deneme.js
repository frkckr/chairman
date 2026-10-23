#!/usr/bin/env node
/* ============ Chairman — sezon denemesi: görüntüsüz haftalar, maç sonucu kariyere (F2, 2026-10-23; yol haritası 3.6) ============
   Yeni kariyer kurulur; her hafta oyuncunun yolu izlenir: İlerle (duragaIlerle) → maç günü işi (ajandaIsiYap) → maç girdisi (macGirdisi) →
   görüntüsüz maç (Match, macaGec, 1/60 sn adımlarla sonuna dek) → sonuç komutu (macSonucuUygula). Ölçülenler: maç başına süre ve adım,
   haftanın 8 maçının tahmini süresi (3.8 "diğer maçlar" kararı için veri), sayaçlar (gol, kart, sakatlık, cezalı ve sakat), puan durumundaki
   yerimiz ve kayıt boyu. Aynı tohumla ikinci koşu birebir aynı kariyeri vermelidir (belirlenimcilik); --kaydet her haftadan sonra kariyeri
   bellek deposuna yazıp geri yükler ve yüklenenle sürer.
   Not: maç tarayıcıdaki maçla birebir aynı değildir — tarayıcı Match seçeneğine stadın zemin, atmosfer, kulübe ve tribün alanlarını da verir
   (js/mac-sahnesi.js MAC_SECENEK; stat tarifleri motor yükleyicinin dışındadır). Bu araç maliyet ve belirlenim ölçüsüdür, denge ölçüsü değildir
   (denge: araclar/mac-deneme.js).
   Kullanım:  node araclar/sezon-deneme.js [hafta=3] [tohum=7] [--kaydet] [--tek] [--json DOSYA]   (hafta en çok sezonun kalanı: 18)
     --tek   ikinci (belirlenimcilik) koşusunu atlar.   Çıkış kodu: fark ya da doğrulama hatası 1, kullanım hatası 2. */
'use strict';
const fs=require('fs'),vm=require('vm');
const {motorYukle}=require('./motor-yukle');
const A=process.argv.slice(2),bayrak=a=>A.includes(a),deger=a=>{const i=A.indexOf(a);return i>=0?A[i+1]:null;};
const sayilar=A.filter((a,i)=>/^\d+$/.test(a)&&A[i-1]!=='--json').map(Number);
const HAFTA=sayilar[0]||3,TOHUM=sayilar[1]!=null?sayilar[1]:7,KAYDET=bayrak('--kaydet'),TEK=bayrak('--tek'),JSON_DOSYA=deger('--json');
if(HAFTA<1){console.error('hafta en az 1 olmalı');process.exit(2);}
const MAKS=60*60*60;   /* güvenlik sınırı: 60 dakikalık adım (20 dakikalık maç ~23 dakikada biter) */

function sezon(){
  const {ctx}=motorYukle(),G=a=>vm.runInContext(a,ctx);
  const [kariyerBaslat,KK,duragaIlerle,ajandaIsiYap,macGirdisi,uygula,dogrula,sezonTablosu,kariyerKaydet,kariyerYukle,bellekDeposu,kulupOyunculari,Match]=
    ['kariyerBaslat','kariyerKomut','duragaIlerle','ajandaIsiYap','macGirdisi','macSonucuUygula','kariyerDogrula','sezonTablosu','kariyerKaydet','kariyerYukle','bellekDeposu','kulupOyunculari','Match'].map(G);
  let k=kariyerBaslat({tohum:TOHUM});
  const biz=k.kisiler[k.baskanId].kulupId,satirlar=[],hatalar=[];
  /* sezonun oynanacak haftaları (TEST tarifi: 13–30, 18 hafta); fazlası istenirse sezon sonunda durulur (F2 incelemesi) */
  const kalan=k.sezon.haftaSayisi-k.sezon.ilkHafta+1,N=Math.min(HAFTA,kalan);
  for(let h=0;h<N;h++){
    const is=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
    if(!is){hatalar.push('maç günü işi yok ama sezon bitmedi');break;}
    k=KK(k,x=>duragaIlerle(x)).kariyer;
    if(!k.isler[is.id]||k.tarih!==is.tarih||k.gunIciDakika!==is.dakika){hatalar.push(`İlerle maç gününe gitmedi (${k.tarih} ${k.gunIciDakika})`);break;}
    const Gi=macGirdisi(k,is.veri.macId);
    k=KK(k,x=>ajandaIsiYap(x,is.id)).kariyer;
    const m=new Match(()=>{},{kadro:Gi.kadro,tohum:Gi.tohum,tunel:{x:0,z:-6},tarz:'dagilim'});
    const t0=process.hrtime.bigint();m.macaGec();let n=0;
    while(m.phase!=='fulltime'&&n<MAKS){m.step(1/60);n++;}
    const ms=Number(process.hrtime.bigint()-t0)/1e6;
    if(m.phase!=='fulltime'){hatalar.push(`${Gi.macId}: maç ${MAKS} adımda bitmedi`);break;}
    const S=m.sonucKaydi();
    k=KK(k,x=>uygula(x,Gi.macId,S,Gi.tohum)).kariyer;
    if(KAYDET){const d=bellekDeposu();kariyerKaydet(d,'s',k);const y=kariyerYukle(d,'s');
      if(!y.tamam||JSON.stringify(y.kariyer)!==JSON.stringify(k)){hatalar.push(`${Gi.macId}: kaydet–yükle farklı`);break;}k=y.kariyer;}
    const tb=sezonTablosu(k),sira=tb.findIndex(t=>t.id===biz)+1,O=kulupOyunculari(k,biz);
    satirlar.push({hafta:Gi.hafta,mac:Gi.macId,ev:k.kulupler[Gi.ev].kisa,konuk:k.kulupler[Gi.konuk].kisa,skor:S.skor.join('-'),adim:n,ms:Math.round(ms),
      gol:S.goller.length,kart:S.kartlar.length,sakatlik:S.sakatliklar.length,cezali:O.filter(p=>p.ceza).length,sakat:O.filter(p=>p.sakat).length,
      sira,puan:tb[sira-1].P,an:`${k.tarih} ${String(Math.floor(k.gunIciDakika/60)).padStart(2,'0')}:${String(k.gunIciDakika%60).padStart(2,'0')}`,kayit:JSON.stringify(k).length});
  }
  if(N===kalan&&!hatalar.length&&Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'))hatalar.push('sezon bitti ama maç günü işi duruyor');
  const h=dogrula(k);if(h.length)hatalar.push('kariyer geçersiz: '+h.slice(0,3).join('; '));
  return{k,satirlar,hatalar,kalan,metin:JSON.stringify(k)};
}

const t0=Date.now();
console.log(`Chairman sezon denemesi · ${HAFTA} hafta · dünya tohumu ${TOHUM}${KAYDET?' · her hafta kaydet–yükle':''}`);
const R=sezon();
if(HAFTA>R.kalan)console.log(`  (sezonun oynanacak haftası ${R.kalan}; ${HAFTA} yerine ${R.kalan} hafta oynandı, sezon sonunda maç günü işi kalmadı)`);
console.log('  hafta  maç            skor   adım    ms   gol kart sakat · bizde cezalı/sakat · sıra puan · oda an            kayıt');
for(const s of R.satirlar)console.log(`  ${String(s.hafta).padStart(5)}  ${(s.ev+'–'+s.konuk).padEnd(13)} ${s.skor.padEnd(6)} ${String(s.adim).padStart(6)} ${String(s.ms).padStart(5)}   ${String(s.gol).padStart(3)} ${String(s.kart).padStart(4)} ${String(s.sakatlik).padStart(5)} · ${String(s.cezali).padStart(6)}/${s.sakat}        · ${String(s.sira).padStart(4)} ${String(s.puan).padStart(5)} · ${s.an} ${String(Math.round(s.kayit/1024)).padStart(5)} KB`);
const ms=R.satirlar.map(s=>s.ms),ort=ms.length?ms.reduce((a,b)=>a+b,0)/ms.length:0,adim=R.satirlar.reduce((a,s)=>a+s.adim,0);
console.log(`  Maç başına ${Math.round(ort)} ms (${R.satirlar.length} maç; 1000 adım ${adim?(ms.reduce((a,b)=>a+b,0)/adim*1000).toFixed(1):'—'} ms) · haftanın 8 maçı art arda ~${(8*ort/1000).toFixed(1)} sn (3.8 için bilgi)`);
let ayni=null;
if(!TEK&&!R.hatalar.length){const R2=sezon();ayni=R2.metin===R.metin&&!R2.hatalar.length;
  console.log(ayni?'  Belirlenimcilik: aynı tohumla ikinci koşu birebir aynı kariyer':'! Belirlenimcilik: ikinci koşu farklı'+(R2.hatalar.length?' ('+R2.hatalar.join('; ')+')':''));}
for(const h of R.hatalar)console.log('! '+h);
if(JSON_DOSYA)fs.writeFileSync(JSON_DOSYA,JSON.stringify({hafta:HAFTA,tohum:TOHUM,kaydet:KAYDET,satirlar:R.satirlar,ortMs:Math.round(ort),ayni,hatalar:R.hatalar},null,1));
console.log(`  Süre ${((Date.now()-t0)/1000).toFixed(1)} sn`);
process.exit(R.hatalar.length||ayni===false?1:0);
