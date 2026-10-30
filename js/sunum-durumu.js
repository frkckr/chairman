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
/* U0 (2026-10-28): tek yazı ölçeği ve kâğıt paleti. Bütün HTML katmanları (oda, bülten, maç telefonu, karar anı, maç sonu) aynı --k-yaziBoyu'yu
   ve --k-* renklerini okur; ikisi de oyun karesine (#screen) yazılır. Değer STIL.kagit.yaziBoyu ile OYUN.ayarlar.yazi'dan; ayar değişince yeniden çağrılır */
/* R1-f (2026-10-29): piksel tabanlı; geniş karede bugünkü oran, dar karede taban (STIL.kagit.yaziTaban) */
function yaziBoyuDegeri(){const b=typeof OYUN!=='undefined'&&OYUN.ayarlar&&OYUN.ayarlar.yazi==='buyuk',a=b?'buyuk':'normal';
  return`max(${STIL.kagit.yaziTaban[a]}px, ${STIL.kagit.yaziBoyu[a]}cqw)`;}
function yaziBoyuUygula(){
  if(typeof document==='undefined')return;const s=document.getElementById('screen');if(!s)return;
  for(const a in STIL.kagit)if(typeof STIL.kagit[a]==='string')s.style.setProperty('--k-'+a,STIL.kagit[a]);
  s.style.setProperty('--k-yaziBoyu',yaziBoyuDegeri());s.style.setProperty('--k-enKucuk',STIL.kagit.enKucukYazi+'px');
}
/* RN-c (2026-10-30): oyun alanının payı ölçülür. Oyun alanı pencereye sığan en büyük 4:3 karedir (STIL_REHBERI §1); pencerenin yüksekliğinden
   yalnız sayfa kenarı ve maç sayfasında alt şerit (#baskanDugmeleri) düşülür. Bülten açıkken şerit gizlidir ama yeri ayrılır: “Maça geç”te alan
   sıçramaz. Geliştirici alanı payın dışındadır (aşağıda, kaydırınca). Eskiden sabit 190 px (dizüstünde alan 640–733 px'e iniyordu).
     ekranPayGuncelle()  --ekran-pay (px) belge köküne; pencere ve şerit boyu değişince kendiliğinden çağrılır */
const EKRAN_PAY={kenar:32,ara:18,serit:52};
function ekranPayGuncelle(){
  if(typeof document==='undefined')return;
  const d=document.getElementById('baskanDugmeleri'),odada=typeof ON_EKRAN!=='undefined'&&ON_EKRAN.sayfa==='oda';
  if(d&&!d.hidden&&d.offsetHeight>0)EKRAN_PAY.serit=d.offsetHeight;
  const pay=EKRAN_PAY.kenar+(odada?0:EKRAN_PAY.ara+EKRAN_PAY.serit);
  document.documentElement.style.setProperty('--ekran-pay',pay+'px');
}
if(typeof window!=='undefined'){
  addEventListener('resize',ekranPayGuncelle);
  addEventListener('DOMContentLoaded',()=>{ekranPayGuncelle();const d=document.getElementById('baskanDugmeleri');
    if(d&&typeof ResizeObserver!=='undefined')new ResizeObserver(ekranPayGuncelle).observe(d);});
}
