/* ============ Chairman — maç işçisi: maçı arkada baştan sonuna oynatan Web Worker (G1-e, 2026-10-24; çizim yok) ============
   index.html yüklemez; maç sayfasının düzeni (js/mac-arka.js) new Worker('js/mac-isci.js') ile kurar. İletiler:
     {tur:'kur', dosyalar:[mutlak adres]} → importScripts (js/lig-maclari.js arkaDosyalari: ortak, kadrolar, lig, motor dosyaları, lig-maclari)
       → {tur:'hazir'} ya da {tur:'hata', mesaj}
     {tur:'oyna', anahtar, surum, secenek, oncesi, komutlar} → arkaMacOynat (saf; js/lig-maclari.js) → {tur:'son', anahtar, surum, son, ornekler, adim, bitti}
       ya da {tur:'hata', anahtar, surum, mesaj}
   Motor dosyalarında DOM yoktur; yüklenen kariyer dosyası yalnız lig-maclari'dır (üst düzeyde yalnız tanım). Aynı seçenek ve tohumla sonuç ana
   iplikteki ve Node'daki maçla birebir aynıdır (araclar/kariyer-deneme.js 3.8, araclar/akis-deneme.py --http 20). */
'use strict';
let ISCI_HAZIR=false;
onmessage=e=>{
  const M=e.data||{};
  if(M.tur==='kur'){
    try{importScripts(...M.dosyalar);ISCI_HAZIR=true;postMessage({tur:'hazir'});}
    catch(x){postMessage({tur:'hata',mesaj:String(x&&x.message||x)});}
    return;
  }
  if(M.tur==='oyna'){
    if(!ISCI_HAZIR){postMessage({tur:'hata',anahtar:M.anahtar,surum:M.surum,mesaj:'işçi kurulmadı'});return;}
    try{const R=arkaMacOynat(Match,M.secenek,{oncesi:!!M.oncesi,komutlar:M.komutlar||[]});
      postMessage({tur:'son',anahtar:M.anahtar,surum:M.surum,son:R.son,ornekler:R.ornekler,adim:R.adim,bitti:R.bitti});}
    catch(x){postMessage({tur:'hata',anahtar:M.anahtar,surum:M.surum,mesaj:String(x&&x.message||x)});}
  }
};
