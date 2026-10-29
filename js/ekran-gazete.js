/* ============ Chairman — gazete sayfası: yerel gazetenin bir sayısı (görüntü katmanı; U5, 2026-10-28) ============
   Kural içermez: sayı js/gazete.js gazeteSayisi'nden (kayıttan kurulur). Odak kabında geniş kâğıt (js/ekran-oda.js gazetePaneli):
     künye     gazetenin adı büyük; altında ince çizgiler arasında “Sayı n / N · gün” (N son sayı)
     manşet    türün etiketi (Maç, Lig, Sakatlık…) ve büyük başlık; konusu varsa dosya bağlantısı
     sütunlar  öbür haberler iki sütunda, her biri etiketiyle
     yan       kutular (puan durumu, gol krallığı) sağda çerçeveli; kutu manşet olmaz (js/gazete.js, U5)
     kısa/boş  yalnız kutu varsa ya da haber yoksa sayı sakin ve kısadır (manşet küçük, sütun yok)
     eski      geçmiş bir sayı yaşıyla sararır (en çok GAZETE_SARARMA gün); son sayı beyaz kâğıt
     gezinti   ◂ Önceki sayı · Sayı n / N · Sonraki sayı ▸ ([ ve ] da)
   Seçiciler denemelerle sözleşmedir: .gz-sayi(.gz-kalin|.gz-ince|.gz-kisa|.gz-bos), .gz-kunye small (“Sayı n”), .gz-manset, .gz-haber, .gz-kutu
   (metinleri gazeteSayisi'ninkiyle birebir; etiketler ayrı öğede), .gz-gezinti [data-yon]. Renkler gazete kâğıdı (STIL.kagit.gazete).
     gazeteGorunumu(k, G, y) → html. y: {yaz, tarihYazi, konu(meseleId) → html, son (son sayının tarihi), sonNo, onceVar, sonraVar} */
const GAZETE_SARARMA=10;
(function gazeteStili(){
  if(typeof document==='undefined'||document.getElementById('gazeteStili'))return;
  const Z=STIL.kagit.gazete,st=document.createElement('style');st.id='gazeteStili';
  st.textContent=`
.gz-sayi{--gz-yas:0;display:grid;gap:.55em;padding:.7em .9em .6em;color:${Z.murekkep};background:color-mix(in srgb,${Z.sari} calc(var(--gz-yas) * 100%),${Z.kagit});
  border:1px solid ${Z.cizgi};box-shadow:inset 0 0 2.5em rgba(120,95,40,calc(var(--gz-yas) * .35))}
.gz-sayi p{margin:0}
.gz-ust{display:grid;justify-items:center;gap:.2em}
.oda .gz-sayi h4.gz-kunye,.gz-kunye{margin:0;display:grid;justify-items:center;gap:.25em;width:100%;font-family:var(--display);font-weight:400;font-size:2.4em;line-height:1;letter-spacing:.06em;text-transform:uppercase;color:${Z.murekkep}}
.oda .gz-sayi h4.gz-kunye small,.gz-kunye small{display:block;width:100%;padding:.25em 0 .2em;border-top:.12em solid ${Z.murekkep};border-bottom:1px solid ${Z.murekkep};font-family:var(--govde);font-size:max(var(--k-enKucuk,12px),.34em);
  letter-spacing:.08em;text-align:center;color:${Z.soluk}}
.gz-govde{display:grid;grid-template-columns:minmax(0,1fr);gap:.8em}
.gz-govde.gz-yanli{grid-template-columns:minmax(0,1fr) minmax(0,32%)}
.gz-ana{display:grid;gap:.6em;align-content:start;min-width:0}
.gz-etiket{display:block;font-size:max(var(--k-enKucuk,12px),.74em);font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${Z.kirmizi}}
.gz-manset{font-family:var(--govde);font-weight:700;font-size:1.7em;line-height:1.15;letter-spacing:-.005em}
.gz-sutunlar{column-count:2;column-gap:1.2em;column-rule:1px solid ${Z.cizgi};padding-top:.5em;border-top:1px solid ${Z.cizgi}}
.gz-yazi{break-inside:avoid;margin:0 0 .7em}
.gz-haber{font-size:max(var(--k-enKucuk,12px),.98em);line-height:1.4}
.gz-yan{display:grid;gap:.6em;align-content:start;min-width:0}
.gz-kutuKap{padding:.45em .6em;border:.12em solid ${Z.murekkep};background:rgba(255,255,255,.35)}
.oda .gz-sayi .gz-kutuKap h5,.gz-kutuKap h5{margin:0 0 .25em;font-size:max(var(--k-enKucuk,12px),.78em);font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.gz-kutu{font-size:max(var(--k-enKucuk,12px),.9em);line-height:1.35;font-variant-numeric:tabular-nums}
.gz-kisa .gz-manset,.gz-bos .gz-manset{font-size:1.25em;font-weight:600;font-style:italic;color:${Z.soluk}}
.gz-gezinti{display:flex;align-items:center;justify-content:space-between;gap:.6em;padding-top:.4em;border-top:1px solid ${Z.cizgi}}
.gz-gezinti span{color:${Z.soluk};font-size:max(var(--k-enKucuk,12px),.9em);font-variant-numeric:tabular-nums}
.gz-konu{font-size:max(var(--k-enKucuk,12px),.88em);color:${Z.soluk}}
`;
  document.head.appendChild(st);
})();
function gazeteGorunumu(k,G,y){
  const yaz=y.yaz,H=G.haberler.slice(1),D=H.filter(h=>!h.kutu),K=H.filter(h=>h.kutu),tur=G.kalin?'gz-kalin':G.bos?'gz-bos':G.kisa?'gz-kisa':'gz-ince';
  const yas=y.son&&G.tarih<y.son?Math.min(GAZETE_SARARMA,(anDakika(y.son,0)-anDakika(G.tarih,0))/1440)/GAZETE_SARARMA:0;
  const etiket=h=>h.etiket?'<small class="gz-etiket">'+yaz(h.etiket)+'</small>':'';
  const konu=m=>m&&y.konu?y.konu(m):'';
  return'<article class="od-gazete gz-sayi '+tur+'" style="--gz-yas:'+yas.toFixed(2)+'"'+(yas?' data-eski="1"':'')+' aria-label="Gazete">'+
    '<header class="gz-ust"><h4 class="gz-kunye">'+yaz(GAZETE_TEST.ad)+'<small>Sayı '+G.no+(y.sonNo?' / '+y.sonNo:'')+' · '+yaz(y.tarihYazi(G.tarih))+'</small></h4></header>'+
    '<div class="gz-govde'+(K.length?' gz-yanli':'')+'"><div class="gz-ana">'+etiket(G.manset)+'<p class="gz-manset">'+yaz(G.manset.metin)+'</p>'+konu(G.manset.meseleId)+
      (D.length?'<div class="gz-sutunlar">'+D.map(h=>'<article class="gz-yazi">'+etiket(h)+'<p class="gz-haber">'+yaz(h.metin)+'</p>'+konu(h.meseleId)+'</article>').join('')+'</div>':'')+'</div>'+
      (K.length?'<aside class="gz-yan">'+K.map(h=>'<section class="gz-kutuKap"><h5>'+yaz(h.etiket||'Kutu')+'</h5><p class="gz-kutu">'+yaz(h.metin)+'</p></section>').join('')+'</aside>':'')+'</div>'+
    '<div class="gz-gezinti"><button type="button" data-eylem="gazeteSayi" data-yon="geri" data-tarih="'+tarihEkle(G.tarih,-1)+'"'+(y.onceVar?'':' disabled')+'>◂ Önceki sayı</button>'+
      '<span>Sayı '+G.no+(y.sonNo?' / '+y.sonNo:'')+'</span>'+
      '<button type="button" data-eylem="gazeteSayi" data-yon="ileri" data-tarih="'+tarihEkle(G.tarih,1)+'"'+(y.sonraVar?'':' disabled')+'>Sonraki sayı ▸</button></div></article>';
}
