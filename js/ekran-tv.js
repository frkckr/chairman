/* ============ Chairman — TV sayfası: odadaki TV'nin teletext sayfaları (görüntü katmanı; kural yok; RK8-a, 2026-11-01) ============
   Plan araclar/plan/rk-program.md §11.1 madde 10, §11.3. Odadaki TV tıklanınca ya da 7 ile odak kabında açılır (js/ekran-oda.js tvPaneli).
   TV hiçbir kart açmaz, zamanı değiştirmez; okurken zaman durur (odak kabının genel kuralı). Üç sayfa (düğme ya da ←/→):
     100 Haberler   bugünün haberleri önem sırasıyla (js/haber.js tvHaberleri); satıra dokununca Canlı Skor'un maç, oyuncu ya da kulüp sayfası
     200 Skorlar    bugünün maçları saatleriyle (bitti: skor; oynanıyor: kırmızı dakika ve “İzle ▸”; başlamadı: saat), altında haftanın kalanı
     300 Puan durumu ve program  puan durumu (kısa) ve açıklanmış haftaların gün ve saati, ertelenenler ve yeni tarihleri
   Bir sayfada en çok TV_SAYFA_EN_COK satır, kalanı “…”. Seçiciler denemelerle sözleşmedir: .tv-sayfa[data-sayfa], .tv-sekme[data-tv],
   .tv-satir (data-eylem="tvAc" data-tur data-id), .tv-izle (data-eylem="tvIzle" data-mac), .tv-canli.
     tvSayfasi(k, sayfa, y) → html. y: {yaz}. Canlı maçlar js/lig-takvimi.js oynananLigMaclari'ndan (dakika oda saatinden) */
'use strict';
/* CM1-b (karar 87): 100 Haberler kalktı — haberler tek listede (Haberler ekranı); TV canlı skor ve öbür maçın penceresidir.
   AR1 (2026-11-04, karar 90): 200 Skorlar ve 300 Puan durumu · Program da kalktı (Lig bölümü, js/ekran-lig.js); TV yalnız oda saatinde oynanan maçların
   penceresidir (dakika, İzle ▸). Canlı maç yokken TV'ye dokunmak Lig'i açar (js/ekran-oda.js tvAc) */
const TV_SAYFALAR=[['canli','200','Canlı maçlar']];
const TV_SAYFA_EN_COK=30;
const TV_GUN=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
const tvGun=t=>{const [y,a,g]=t.split('-').map(Number);return TV_GUN[new Date(Date.UTC(y,a-1,g)).getUTCDay()];};
/* RK-D (2026-11-01, kullanıcı: “bugün yarın gibi ibareler değil, maçların tarihleri olsun”): gün başlığı tam gün adı ve tarihle (“Cuma 4 Aralık”) */
const TV_GUN_TAM=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const tvGunBasligi=t=>{const [y,a,g]=t.split('-').map(Number);return TV_GUN_TAM[new Date(Date.UTC(y,a-1,g)).getUTCDay()]+' '+gunAyYazi(t);};
(function tvStili(){
  if(typeof document==='undefined'||document.getElementById('tvStili'))return;
  const Z=STIL.kagit.tv,st=document.createElement('style');st.id='tvStili';
  st.textContent=`
.tv-sayfa{display:grid;gap:.5em;padding:.7em .9em .8em;background:${Z.zemin};color:${Z.yazi};border:.18em solid ${Z.kasa};border-radius:.35em;font-variant-numeric:tabular-nums}
.tv-ust{display:flex;align-items:baseline;justify-content:space-between;gap:.6em;padding:.15em .45em;background:${Z.serit};color:${Z.seritYazi};font-weight:700;letter-spacing:.06em}
.tv-ust small{font-weight:600;letter-spacing:0}
.tv-sekmeler{display:flex;flex-wrap:wrap;gap:.35em}
.tv-sekme{appearance:none;border:1px solid ${Z.cizgi};background:transparent;color:${Z.yazi};padding:.2em .55em;font:inherit;font-size:max(var(--k-enKucuk,12px),.9em);cursor:pointer}
.tv-sekme b{color:${Z.sari};margin-right:.35em}
.tv-sekme[aria-selected="true"]{background:${Z.sari};color:${Z.zemin};border-color:${Z.sari}}
.tv-sekme[aria-selected="true"] b{color:${Z.zemin}}
.oda .tv-sayfa h5,.tv-sayfa h5{margin:.35em 0 0;color:${Z.camgobegi};font-size:max(var(--k-enKucuk,12px),.82em);letter-spacing:.1em;text-transform:uppercase;font-weight:700}
.tv-liste{display:grid;gap:.1em;margin:0;padding:0;list-style:none}
.tv-satir{appearance:none;display:grid;grid-template-columns:3.6em minmax(0,1fr);gap:.55em;width:100%;padding:.2em .25em;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
.tv-satir:hover,.tv-satir:focus-visible{background:${Z.vurgu}}
.tv-satir time{color:${Z.sari}}
.tv-satir span{min-width:0}
.tv-etiket{color:${Z.camgobegi};margin-right:.4em;font-size:max(var(--k-enKucuk,12px),.85em);text-transform:uppercase;letter-spacing:.06em}
.tv-etiket svg.smg{margin-right:.35em}
.tv-mac{display:grid;grid-template-columns:4.2em minmax(0,1fr) 3.4em minmax(0,1fr) auto;align-items:center;gap:.45em;padding:.15em .25em}
.tv-mac .tv-ev{text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tv-mac .tv-dep{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tv-mac b{text-align:center;color:${Z.sari}}
.tv-mac small{color:${Z.soluk}}
.tv-canli small{color:${Z.kirmizi};font-weight:700}
.tv-izle{appearance:none;border:1px solid ${Z.kirmizi};background:transparent;color:${Z.yazi};font:inherit;font-size:max(var(--k-enKucuk,12px),.85em);padding:.05em .45em;cursor:pointer}
.tv-izle:hover,.tv-izle:focus-visible{background:${Z.kirmizi};color:${Z.zemin}}
.tv-tablo{width:100%;border-collapse:collapse}
.tv-tablo td{padding:.1em .3em}
.tv-tablo td:first-child{color:${Z.sari};width:2em}
.tv-tablo td:nth-child(n+3){text-align:right;width:2.6em}
.tv-not{color:${Z.soluk};font-size:max(var(--k-enKucuk,12px),.9em);margin:0}
.oda .tv-sayfa h6,.tv-sayfa h6{margin:.3em 0 0;padding-bottom:.05em;border-bottom:1px solid ${Z.cizgi};color:${Z.yazi};font-size:max(var(--k-enKucuk,12px),.85em);font-weight:700}
.oda .tv-sayfa h6.tv-bugun,.tv-sayfa h6.tv-bugun{color:${Z.sari}}
.tv-devam{color:${Z.soluk};margin:0}
`;
  document.head.appendChild(st);
})();
function tvSayfasi(k,sayfa,y){
  const yaz=y.yaz,ad=id=>((k.kulupler||{})[id]||{ad:id}).ad;
  const ust='<div class="tv-ust"><span>TEST SPOR · TELETEXT</span><small>'+yaz(tvGun(k.tarih)+' '+gunAyYazi(k.tarih))+' '+saatYazi(k.gunIciDakika)+'</small></div>';
  const C=typeof oynananLigMaclari==='function'?oynananLigMaclari(k):[];
  const satir=x=>{const f=x.f,m=(k.maclar||{})[f.id];
    return'<div class="tv-mac tv-canli"><small>'+yaz(x.dk)+'</small><span class="tv-ev">'+yaz(ad(f.ev))+'</span><b>'+(m?m.skor[0]+'–'+m.skor[1]:'–')+'</b><span class="tv-dep">'+yaz(ad(f.konuk))+'</span>'+
      '<button type="button" class="tv-izle" data-eylem="tvIzle" data-mac="'+yaz(f.id)+'">İzle ▸</button></div>';};
  const ic=(C.length?'<h5>Şimdi oynanıyor</h5>'+C.slice(0,TV_SAYFA_EN_COK).map(satir).join(''):'<p class="tv-not">TEST: Şu an oynanan maç yok.</p>')+
    '<p class="tv-not"><button type="button" class="tv-lig od-baglanti" data-eylem="cmBolum" data-bolum="lig">Puan durumu ve fikstür: Lig ▸</button></p>';
  return'<section class="tv-sayfa" data-sayfa="canli">'+ust+ic+'</section>';
}
