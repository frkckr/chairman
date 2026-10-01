/* ============ Chairman — sunum durumu: genel duraklatma ve hareket azaltma (çizim yok, kariyer kuralı yok; yol haritası 2.8B) ============
   Duraklatma bütün sahnelerin ortak yönetimidir. Nedenler ayrı tutulur: 'elle' (oyuncunun Duraklat'ı), ileride 'telefon' (maç telefonu, 2.8F).
   Bir nedenin kalkması diğerlerini kaldırmaz; herhangi bir neden varken oda, yürüyüş, balkon/antrenman, gözlem, program sayacı ve maç durur.
   Duraklatma kariyeri değiştirmez ve kaydedilmez: kariyer takvimi zaten yalnız komutla ilerler.
     duraklatmaEkle(neden) · duraklatmaKaldir(neden) · duraklatmaVar(neden?) · duraklatmaDinle(f)  — f(aktif) her değişimde çağrılır
     hareketAz()  hareket azaltma: ayar (SUNUM.hareketAz, js/ekran-oda.js ayarlardan yazar) ya da işletim sistemi tercihi */
const SUNUM={nedenler:new Set(),dinleyiciler:[],hareketAz:false};
function duraklatmaVar(neden){return neden?SUNUM.nedenler.has(neden):SUNUM.nedenler.size>0;}
function duraklatmaBildir(){const a=duraklatmaVar();for(const f of SUNUM.dinleyiciler)try{f(a);}catch(e){console.error(e);}}
function duraklatmaEkle(neden){if(SUNUM.nedenler.has(neden))return;SUNUM.nedenler.add(neden);duraklatmaBildir();}
function duraklatmaKaldir(neden){if(!SUNUM.nedenler.has(neden))return;SUNUM.nedenler.delete(neden);duraklatmaBildir();}
function duraklatmaDinle(f){SUNUM.dinleyiciler.push(f);}
const SUNUM_HAREKET_SORGU=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
function hareketAz(){return SUNUM.hareketAz||!!(SUNUM_HAREKET_SORGU&&SUNUM_HAREKET_SORGU.matches);}
