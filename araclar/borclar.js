/* ============ Chairman — borç defterinin okuyucusu (R1-d, 2026-10-29) ============
   Borç defteri araclar/BORCLAR.md'dir (tek kaynak; tablo insan için yazılır). Bu modül tablonun "Eşleşme" sütununu okur ve bir denetim satırının
   bilinen bir borca ait olup olmadığını söyler. Kullananlar: araclar/oturum-sonu.js; aynı kuralla araclar/akis-deneme.py (kendi okuyucusu).
   Eşleşme hücresi ters tırnaklı parçalardır: ilki kapsam (oturum | akis), kalanlar düzenli ifade (JavaScript ve Python'da aynı anlamda; '|' yazılmaz,
   tablo sütunu bozulur). Yalnız durumu "açık" olan satırlar eşleşir; kapanan satır tabloda "kapandı (tur)" olarak kalır.
     borclar()            → [{no, konu, tur, durum, kapsam, kaliplar:[RegExp]}]
     bilinenBorc(kapsam, satir) → eşleşen ilk açık satır ya da null
   oturum kapsamında satır "<adım>: <satır>" biçimindedir: senaryo adı ya da "mac" (ör. "c-orta: ! Erken orta …"). */
'use strict';
const fs=require('fs'),path=require('path');
const DOSYA=path.join(__dirname,'BORCLAR.md');
let ONBELLEK=null;
function borclar(){
  if(ONBELLEK)return ONBELLEK;
  const L=fs.existsSync(DOSYA)?fs.readFileSync(DOSYA,'utf8').split(/\r?\n/):[];
  const R=[];
  for(const s of L){
    if(!/^\|\s*B\d+\s*\|/.test(s))continue;
    const h=s.split('|').slice(1,-1).map(x=>x.trim());
    const es=h[h.length-1],parca=[...es.matchAll(/`([^`]+)`/g)].map(m=>m[1]);
    const durum=h[3]||'';
    R.push({no:h[0],konu:h[1],tur:h[2],durum,kapsam:parca[0]||'',kaliplar:parca.slice(1).map(x=>new RegExp(x)),acik:/^açık/i.test(durum)});
  }
  return ONBELLEK=R;
}
function bilinenBorc(kapsam,satir){
  for(const b of borclar())if(b.acik&&b.kapsam===kapsam&&b.kaliplar.length&&b.kaliplar.every(k=>k.test(satir)))return b;
  return null;
}
module.exports={borclar,bilinenBorc,DOSYA};
