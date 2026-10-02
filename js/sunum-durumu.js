/* ============ Chairman — sunum durumu: genel duraklatma (çizim yok, kariyer kuralı yok; yol haritası 2.8B, 2.8J) ============
   Duraklatma bütün sahnelerin ortak yönetimidir. Nedenler ayrı tutulur: 'elle' (oyuncunun Duraklat'ı), ileride 'telefon' (maç telefonu, 2.8F).
   Bir nedenin kalkması diğerlerini kaldırmaz; herhangi bir neden varken oda, yürüyüş, balkon/antrenman, gözlem, program sayacı ve maç durur.
   Duraklatma kariyeri değiştirmez ve kaydedilmez: kariyer takvimi zaten yalnız komutla ilerler.
     duraklatmaEkle(neden) · duraklatmaKaldir(neden) · duraklatmaVar(neden?) · duraklatmaDinle(f)  — f(aktif) her değişimde çağrılır
   Hareket azaltma ayarı yoktur (2.8J, 2026-10-02 kararı): sakin hareket bütün oyunun standardıdır. Kamera sallantısı ve süs hareketleri
   kaldırıldı; kalkış, kısa yürüyüş, futbol ve gerekli karakter hareketleri sürer. İşletim sisteminin tercihi de yürüyüşü atlatmaz */
const SUNUM={nedenler:new Set(),dinleyiciler:[]};
function duraklatmaVar(neden){return neden?SUNUM.nedenler.has(neden):SUNUM.nedenler.size>0;}
function duraklatmaBildir(){const a=duraklatmaVar();for(const f of SUNUM.dinleyiciler)try{f(a);}catch(e){console.error(e);}}
function duraklatmaEkle(neden){if(SUNUM.nedenler.has(neden))return;SUNUM.nedenler.add(neden);duraklatmaBildir();}
function duraklatmaKaldir(neden){if(!SUNUM.nedenler.has(neden))return;SUNUM.nedenler.delete(neden);duraklatmaBildir();}
function duraklatmaDinle(f){SUNUM.dinleyiciler.push(f);}
