#!/usr/bin/env node
/* ============ Chairman — sezon denemesi: görüntüsüz haftalar, maç sonucu kariyere (F2, 2026-10-23; yol haritası 3.6) ============
   Yeni kariyer kurulur; her hafta oyuncunun yolu izlenir: İlerle (duragaIlerle) → maç günü işi (ajandaIsiYap) → maç girdisi (macGirdisi) →
   görüntüsüz maç (Match, macaGec, 1/60 sn adımlarla sonuna dek) → sonuç komutu. F7 (2026-10-24): haftanın öbür yedi maçı da oynanır
   (js/lig-maclari.js digerMacSecenegi — tarayıcıdaki LIG_CANLI ile aynı seçenek) ve sekiz sonuç tek komutla uygulanır (haftaSonuclariUygula).
   Ölçülenler: bizim maçın ve haftanın sekiz maçının süresi, sayaçlar (gol, kart, sakatlık, cezalı ve sakat), puan durumundaki yerimiz,
   bütün kulüplerin oynadığı maç sayısının eşitliği ve kayıt boyu. Aynı tohumla ikinci koşu birebir aynı kariyeri vermelidir (belirlenimcilik); --kaydet her haftadan sonra kariyeri
   bellek deposuna yazıp geri yükler ve yüklenenle sürer.
   Not: maç tarayıcıdaki maçla birebir aynı değildir — tarayıcı Match seçeneğine stadın zemin, atmosfer, kulübe ve tribün alanlarını da verir
   (js/mac-sahnesi.js MAC_SECENEK; stat tarifleri motor yükleyicinin dışındadır). Bu araç maliyet ve belirlenim ölçüsüdür, denge ölçüsü değildir
   (denge: araclar/mac-deneme.js).
   F6-a (2026-10-24): kötü gidişte P12 "Hocaya sabır mı, değişim mi?" açılır (js/icerik-p12.js); İlerle maç gününe dek birkaç kez durabilir.
     --p12 cevapsiz (varsayılan; karar cevapsız kalır) | sabir | degisim (adaylarla görüşülür, ilk aday göreve alınır): oyuncunun cevabı.
   Kullanım:  node araclar/sezon-deneme.js [hafta=3] [tohum=7] [--kaydet] [--tek] [--p12 cevapsiz|sabir|degisim] [--json DOSYA]   (hafta en çok sezonun kalanı: 18)
     --tek   ikinci (belirlenimcilik) koşusunu atlar.   Çıkış kodu: fark ya da doğrulama hatası 1, kullanım hatası 2. */
'use strict';
const fs=require('fs'),vm=require('vm');
const {motorYukle}=require('./motor-yukle');
const A=process.argv.slice(2),bayrak=a=>A.includes(a),deger=a=>{const i=A.indexOf(a);return i>=0?A[i+1]:null;};
const sayilar=A.filter((a,i)=>/^\d+$/.test(a)&&A[i-1]!=='--json').map(Number),P12=deger('--p12')||'cevapsiz';
if(!['cevapsiz','sabir','degisim'].includes(P12)){console.error('--p12 cevapsiz | sabir | degisim olmalı');process.exit(2);}
const HAFTA=sayilar[0]||3,TOHUM=sayilar[1]!=null?sayilar[1]:7,KAYDET=bayrak('--kaydet'),TEK=bayrak('--tek'),JSON_DOSYA=deger('--json');
if(HAFTA<1){console.error('hafta en az 1 olmalı');process.exit(2);}
const MAKS=60*60*60;   /* güvenlik sınırı: 60 dakikalık adım (20 dakikalık maç ~23 dakikada biter) */

function sezon(){
  const {ctx}=motorYukle(),G=a=>vm.runInContext(a,ctx);
  const [kariyerBaslat,KK,duragaIlerle,ajandaIsiYap,macGirdisi,dogrula,sezonTablosu,kariyerKaydet,kariyerYukle,bellekDeposu,kulupOyunculari,Match,haftaninDigerMaclari,digerMacPlani,haftaUygula,hukmenSonucu]=
    ['kariyerBaslat','kariyerKomut','duragaIlerle','ajandaIsiYap','macGirdisi','kariyerDogrula','sezonTablosu','kariyerKaydet','kariyerYukle','bellekDeposu','kulupOyunculari','Match','haftaninDigerMaclari','digerMacPlani','haftaSonuclariUygula','hukmenSonucu'].map(G);
  const oyna=sec=>{const m=new Match(()=>{},sec);m.macaGec();let n=0;while(m.phase!=='fulltime'&&n<MAKS){m.step(1/60);n++;}return{m,n};};
  let k=kariyerBaslat({tohum:TOHUM});
  const biz=k.kisiler[k.baskanId].kulupId,satirlar=[],hatalar=[];let hukmenToplam=0;
  /* sezonun oynanacak haftaları (TEST tarifi: 13–30, 18 hafta); fazlası istenirse sezon sonunda durulur (F2 incelemesi) */
  const kalan=k.sezon.haftaSayisi-k.sezon.ilkHafta+1,N=Math.min(HAFTA,kalan);
  for(let h=0;h<N;h++){
    const is=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
    if(!is){hatalar.push('maç günü işi yok ama sezon bitmedi');break;}
    /* maç gününe dek İlerle; P12 kararı, aday görüşmesi ve aday kartı --p12'ye göre cevaplanır (F6-a) */
    for(let g=0;g<20&&!(k.tarih===is.tarih&&k.gunIciDakika===is.dakika);g++){
      const B=t=>Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.karar===t),ad=B('hocaAdayi'),kr=B('hocaKarari');
      const rd=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.etki==='hocaAdayGorusmesi'&&x.tarih===k.tarih&&x.dakika===k.gunIciDakika);
      if(ad){k=KK(k,x=>ajandaIsiYap(x,ad.id,'al')).kariyer;continue;}
      if(rd){k=KK(k,x=>ajandaIsiYap(x,rd.id)).kariyer;continue;}
      if(kr&&P12!=='cevapsiz'){k=KK(k,x=>ajandaIsiYap(x,kr.id,P12)).kariyer;continue;}
      k=KK(k,x=>duragaIlerle(x)).kariyer;
    }
    if(!k.isler[is.id]||k.tarih!==is.tarih||k.gunIciDakika!==is.dakika){hatalar.push(`İlerle maç gününe gitmedi (${k.tarih} ${k.gunIciDakika})`);break;}
    /* maç girdileri ve haftanın planı (G1-a: 11 uygun oyuncu çıkaramayan tarafın maçı hükmen; motor oynamaz) — beklenmeyen hata çökmeden raporlanır */
    let Gi,D;
    try{Gi=macGirdisi(k,is.veri.macId);D=haftaninDigerMaclari(k,Gi.macId).map(f=>digerMacPlani(k,f));}
    catch(e){hatalar.push(`${k.tarih}: hafta kurulamadı — ${e.message}`);break;}
    k=KK(k,x=>ajandaIsiYap(x,is.id)).kariyer;
    const t0=process.hrtime.bigint(),{m,n}=Gi.hukmen?{m:null,n:0}:oyna({kadro:Gi.kadro,tohum:Gi.tohum,tunel:{x:0,z:-6},tarz:Gi.tarz.slice()});
    const ms=Number(process.hrtime.bigint()-t0)/1e6;
    const O=D.map(d=>d.hukmen?{d,m:null,sonuc:hukmenSonucu(d.hukmen)}:Object.assign({d},oyna(d.secenek))),msHafta=Number(process.hrtime.bigint()-t0)/1e6;
    if(m&&m.phase!=='fulltime'||O.some(o=>o.m&&o.m.phase!=='fulltime')){hatalar.push(`${Gi.macId}: haftanın bir maçı ${MAKS} adımda bitmedi`);break;}
    const S=Gi.hukmen?hukmenSonucu(Gi.hukmen):m.sonucKaydi();
    for(const o of O)if(o.m)o.sonuc=o.m.sonucKaydi();
    hukmenToplam+=(Gi.hukmen?1:0)+O.filter(o=>!o.m).length;
    k=KK(k,x=>haftaUygula(x,Gi.macId,S,Gi.tohum,{},O.map(o=>({macId:o.d.macId,sonuc:o.sonuc,tohum:o.d.tohum})))).kariyer;
    if(KAYDET){const d=bellekDeposu();kariyerKaydet(d,'s',k);const y=kariyerYukle(d,'s');
      if(!y.tamam||JSON.stringify(y.kariyer)!==JSON.stringify(k)){hatalar.push(`${Gi.macId}: kaydet–yükle farklı`);break;}k=y.kariyer;}
    const tb=sezonTablosu(k),sira=tb.findIndex(t=>t.id===biz)+1,Op=kulupOyunculari(k,biz);
    if(new Set(tb.map(t=>t.O)).size!==1){hatalar.push(`${Gi.hafta}. hafta: kulüplerin oynadığı maç sayısı eşit değil`);break;}
    satirlar.push({hafta:Gi.hafta,mac:Gi.macId,ev:k.kulupler[Gi.ev].kisa,konuk:k.kulupler[Gi.konuk].kisa,skor:S.skor.join('-'),adim:n,ms:Math.round(ms),msHafta:Math.round(msHafta),
      haftaGol:S.goller.length+O.reduce((a,o)=>a+o.sonuc.skor[0]+o.sonuc.skor[1],0),
      gol:S.goller.length,kart:S.kartlar.length,sakatlik:S.sakatliklar.length,cezali:Op.filter(p=>p.ceza).length,sakat:Op.filter(p=>p.sakat).length,
      sira,puan:tb[sira-1].P,an:`${k.tarih} ${String(Math.floor(k.gunIciDakika/60)).padStart(2,'0')}:${String(k.gunIciDakika%60).padStart(2,'0')}`,kayit:JSON.stringify(k).length});
  }
  if(N===kalan&&!hatalar.length&&Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'))hatalar.push('sezon bitti ama maç günü işi duruyor');
  const h=dogrula(k);if(h.length)hatalar.push('kariyer geçersiz: '+h.slice(0,3).join('; '));
  const p12=Object.values(k.olaylar).filter(o=>o.paket==='hocaDegerlendirme').map(o=>`${o.acilis.tarih} ${o.varyant} (${o.durum})`);
  const degisim=k.gecmis.filter(g=>g.tur==='hocaDegisimi').map(g=>`${g.tarih} ${k.kisiler[g.eskiId].ad} → ${k.kisiler[g.yeniId].ad} (${k.kisiler[g.yeniId].hoca.tarz})`);
  return{k,satirlar,hatalar,kalan,p12,degisim,hukmen:hukmenToplam,metin:JSON.stringify(k)};
}

const t0=Date.now();
console.log(`Chairman sezon denemesi · ${HAFTA} hafta · dünya tohumu ${TOHUM}${KAYDET?' · her hafta kaydet–yükle':''}`);
const R=sezon();
if(HAFTA>R.kalan)console.log(`  (sezonun oynanacak haftası ${R.kalan}; ${HAFTA} yerine ${R.kalan} hafta oynandı, sezon sonunda maç günü işi kalmadı)`);
console.log('  hafta  maç            skor   adım    ms  hafta ms  hafta gol  gol kart sakat · bizde cezalı/sakat · sıra puan · oda an            kayıt');
for(const s of R.satirlar)console.log(`  ${String(s.hafta).padStart(5)}  ${(s.ev+'–'+s.konuk).padEnd(13)} ${s.skor.padEnd(6)} ${String(s.adim).padStart(6)} ${String(s.ms).padStart(5)} ${String(s.msHafta).padStart(8)} ${String(s.haftaGol).padStart(9)}  ${String(s.gol).padStart(3)} ${String(s.kart).padStart(4)} ${String(s.sakatlik).padStart(5)} · ${String(s.cezali).padStart(6)}/${s.sakat}        · ${String(s.sira).padStart(4)} ${String(s.puan).padStart(5)} · ${s.an} ${String(Math.round(s.kayit/1024)).padStart(5)} KB`);
const ms=R.satirlar.map(s=>s.ms),ort=ms.length?ms.reduce((a,b)=>a+b,0)/ms.length:0,adim=R.satirlar.reduce((a,s)=>a+s.adim,0),hOrt=R.satirlar.length?R.satirlar.reduce((a,s)=>a+s.msHafta,0)/R.satirlar.length:0;
console.log(`  Bizim maç ${Math.round(ort)} ms (${R.satirlar.length} hafta; 1000 adım ${adim?(ms.reduce((a,b)=>a+b,0)/adim*1000).toFixed(1):'—'} ms) · haftanın 8 maçı ${(hOrt/1000).toFixed(1)} sn · hafta başına gol ${(R.satirlar.reduce((a,s)=>a+s.haftaGol,0)/Math.max(1,R.satirlar.length)).toFixed(1)}`);
console.log(`  Hükmen (G1-a): ${R.hukmen} maç`);
console.log(`  P12 (--p12 ${P12}): ${R.p12.length?R.p12.join(' · '):'açılmadı'}${R.degisim.length?' · hoca değişimi: '+R.degisim.join(' · '):''}`);
let ayni=null;
if(!TEK&&!R.hatalar.length){const R2=sezon();ayni=R2.metin===R.metin&&!R2.hatalar.length;
  console.log(ayni?'  Belirlenimcilik: aynı tohumla ikinci koşu birebir aynı kariyer':'! Belirlenimcilik: ikinci koşu farklı'+(R2.hatalar.length?' ('+R2.hatalar.join('; ')+')':''));}
for(const h of R.hatalar)console.log('! '+h);
if(JSON_DOSYA)fs.writeFileSync(JSON_DOSYA,JSON.stringify({hafta:HAFTA,tohum:TOHUM,kaydet:KAYDET,satirlar:R.satirlar,ortMs:Math.round(ort),haftaMs:Math.round(hOrt),ayni,hatalar:R.hatalar},null,1));
console.log(`  Süre ${((Date.now()-t0)/1000).toFixed(1)} sn`);
process.exit(R.hatalar.length||ayni===false?1:0);
