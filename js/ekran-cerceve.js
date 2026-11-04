/* ============ Chairman — CM çerçevesi: bölüm kaydı ve içerik alanı (görüntü katmanı; AR1, 2026-11-04, kararlar 90–91) ============
   Kullanıcı kararı (2026-11-04, “Hepsini kabul”; araclar/plan/arayuz-uygulama.md §2): düğme = ekran. Sol şeritteki her düğme bir bölümü açar,
   odadaki nesneler aynı bölüme kısayoldur; tek krom (şerit + kulüp renginde başlık şeridi + sekme satırı), koyu CM görünümü ve kabartmalı düğme
   menü. Odak kabı (U1, js/ekran-odak.js: perde bulanıklığı, Kapat ×, ipucu satırı, göz atma) kalktı; iş başlık şeridinin altındaki içerik alanını
   doldurur. Kural içermez; durum, Esc zinciri ve bölümlerin çizimi js/ekran-oda.js'tedir (bölüm → panel kimliği).
     EKRAN_BOLUMLERI   şeritteki sıra ve tuşlar: [{id, ad, panel (js/ekran-oda.js panel kimliği; Ofis ve Balkon panelsiz), tus (KeyboardEvent.code)}]
                       Tuşlar 1–9 ve 0 şeritteki sırayla (kullanıcı onayı 2026-11-04, §10); eski tuş eşlemesi kalktı, Ayarlar › Okuma'da listelenir
     bolumPaneli(id) → panel kimliği · panelBolumu(panel) → bölüm kimliği (şeritte etkin düğme)
     cmIcerik(s) → html  s: {ad (panel kimliği), boy:'genis'|'orta'|'kucuk'|'cihaz'|'telefon'|'yarim'|'tam', kagit (true: bugünkü açık “kâğıt” ekranı
       ortada kâğıtta — AR2/AR5/AR6 kendi koyu düzenlerine geçene dek ara hâl; false: içerik alanını kendisi doldurur), perde (arkada oda %84 koyu;
       Ofis'teki ziyaret ve balkonda yok), solma (alt sayfa ya da sahne girişi: 120 ms solma), sinif, etiket (aria-label), govde (html)}
   Geçiş (karar 91 tartışması, kullanıcı “Anında” önerisini kabul etti): bölüm ve sekme değişince anında; alt sayfa (kulüp, oyuncu, maç, transfer
   kâğıdı) ve sahne girişinde 120 ms solma; “hareketi azalt” tercihinde anında. Başlık ve şerit kıpırdamaz.
   Renkler --c-* (STIL.cerceve.palet; js/sunum-durumu.js cerceveUygula): cm koyu (panel, çizgi, yazı, sarı başlık), kagit ikinci görünüm
   (Ayarlar › Okuma › Görünüm; tarayıcıda, kayda girmez). Koyu panel bileşenleri .cmp-* (Lig ve Finans; js/ekran-lig.js, js/ekran-finans.js). */
'use strict';
const EKRAN_BOLUMLERI=[
  {id:'ofis',ad:'Ofis',panel:null,tus:'Digit1'},
  {id:'haberler',ad:'Haberler',panel:'haberler',tus:'Digit2'},
  {id:'kulup',ad:'Kulüp',panel:'dosya',tus:'Digit3'},
  {id:'finans',ad:'Finans',panel:'finans',tus:'Digit4'},
  {id:'lig',ad:'Lig',panel:'lig',tus:'Digit5'},
  {id:'transfer',ad:'Transfer',panel:'transfer',tus:'Digit6'},
  {id:'ajanda',ad:'Ajanda',panel:'ajanda',tus:'Digit7'},
  {id:'telefon',ad:'Telefon',panel:'telefon',tus:'Digit8'},
  {id:'gazete',ad:'Gazete',panel:'gazete',tus:'Digit9'},
  {id:'balkon',ad:'Balkon',panel:null,tus:'Digit0'}
];
const bolumPaneli=id=>{const b=EKRAN_BOLUMLERI.find(x=>x.id===id);return b?b.panel:null;};
/* panelin şeritteki bölümü: karar paneli Haberler'in alt sayfası (Cevap bekliyor), TV Lig'in, Gördüklerin Balkon'un */
const PANEL_BOLUM={haberler:'haberler',karar:'haberler',dosya:'kulup',kadro:'kulup',finans:'finans',lig:'lig',tv:'lig',transfer:'transfer',ajanda:'ajanda',
  telefon:'telefon',gazete:'gazete',gorduklerin:'balkon'};
const panelBolumu=p=>PANEL_BOLUM[p]||null;
const yazCm=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
function cmIcerik(s){
  const ic=s.kagit?'<div class="cm-kagit"><div class="od-icerik">'+s.govde+'</div></div>':'<div class="cm-govde">'+s.govde+'</div>';
  return(s.perde?'<div class="cm-perde od-perde" data-perde="1"></div>':'')+
    '<section class="cm-icerik'+(s.sinif?' '+s.sinif:'')+(s.solma?' cm-solma':'')+'" data-odak="'+yazCm(s.ad)+'" data-boy="'+(s.boy||'genis')+'"'+(s.kagit?' data-kagit="1"':'')+
      ' role="region" aria-label="'+yazCm(s.etiket||s.ad)+'">'+ic+'</section>';
}
(function cerceveStili(){
  if(typeof document==='undefined'||document.getElementById('cerceveStili'))return;
  const st=document.createElement('style');st.id='cerceveStili';
  st.textContent=`
/* ---- şerit: kabartmalı bölüm düğmeleri (seçili sarı), ‹ Geri · İleri ›, ayraç, Balkon, altta Haber var ve Ayarlar ---- */
.cm-serit{gap:.26em;padding:.5em .4em .55em}
.cm-gez{display:grid;grid-template-columns:1fr 1fr;gap:.25em;flex:none}
.cm-serit .cm-gez button{text-align:center;font-size:max(12px,.82em);padding:.2em 0;color:var(--c-yazi);background:var(--c-kutu);border:1px solid var(--c-cizgi);border-radius:.18em}
.cm-serit .cm-gez button:disabled{color:var(--c-pasif)}
.cm-serit button.cm-dugme{display:flex;align-items:center;justify-content:space-between;gap:.35em;padding:.42em .5em .4em;font-weight:800;color:var(--c-yazi);
  background:linear-gradient(var(--c-dugmeUst),var(--c-dugmeAlt));border:1px solid var(--c-dugmeKenar);border-radius:.2em;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.15),inset 0 -2px 0 rgba(0,0,0,.22)}
.cm-serit button.cm-dugme:hover:not(:disabled){color:var(--c-etkin);background:linear-gradient(var(--c-dugmeUzerinde),var(--c-dugmeAlt))}
.cm-serit button.cm-dugme[aria-current="true"]{color:var(--c-dugmeSeciliYazi);background:linear-gradient(var(--c-dugmeSeciliUst),var(--c-dugmeSeciliAlt));border-color:var(--c-anaKenar);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.6)}
.cm-serit button.cm-dugme:disabled{opacity:.5}
.cm-serit button.cm-dugme>span{min-width:0;overflow:hidden;text-overflow:ellipsis}
.cm-serit button.cm-dugme kbd{flex:none;font:700 max(12px,.7em) var(--cerceve);opacity:.6}
.cm-serit button.cm-dugme small.cm-kilit{display:block}
.cm-ayrac{flex:none;height:1px;margin:.15em .1em;background:var(--c-cizgi)}
.cm-serit button.cm-ayar{text-align:center;font-size:max(12px,.85em);padding:.2em;color:var(--c-soluk);border:1px solid var(--c-cizgi)}
.cm-serit button.cm-ayar[aria-current="true"]{color:var(--c-etkin);background:var(--c-secili)}
/* ---- başlık şeridi: ‹ Geri (alt sayfada), ipucu (CM2-b alıştırma; kulüp · başkan satırının yerinde) ---- */
.oda .od-ustCm button.od-ustGeri{align-self:center;flex:none;font-family:var(--cerceve);font-weight:800;font-size:max(12px,.86em);padding:.1em .6em;color:inherit;background:rgba(0,0,0,.18);
  border:1px solid rgba(255,255,255,.35);border-radius:.2em;box-shadow:none;max-width:16em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.od-ustCm .od-ustBaslik small.od-ustIpucu{font-style:italic;opacity:1}
/* ---- içerik alanı: başlık şeridinin altından alt şeridin üstüne; arkada oda %84 koyu (bulanıklık yok, kamera durur: odaPanel) ---- */
.oda .od-ust,.oda .od-alt{z-index:3}
.oda .cm-perde{position:absolute;inset:0;z-index:1;background:var(--c-perde)}
.oda section.cm-icerik{position:absolute;z-index:2;left:0;right:0;top:var(--od-ust,2.6em);bottom:var(--od-alt,3em);display:grid;grid-template-rows:minmax(0,1fr);min-width:0;min-height:0;
  padding:.7em .8em;overflow:hidden;color:var(--c-pyazi);--cm-en:74em}
.oda section.cm-icerik[data-boy="orta"]{--cm-en:52em}
.oda section.cm-icerik[data-boy="kucuk"]{--cm-en:40em}
.oda section.cm-icerik[data-boy="cihaz"]{--cm-en:26em}
.oda section.cm-icerik[data-boy="telefon"]{--cm-en:72em}
.oda section.cm-icerik[data-boy="tam"]{--cm-en:100%}
.oda section.cm-icerik>.cm-kagit{justify-self:center;align-self:start;width:min(100%,var(--cm-en));max-height:100%;min-height:0;display:grid;grid-template-rows:minmax(0,1fr);
  color:var(--k-yazi);background:var(--k-zemin);border:1px solid var(--k-cizgi);border-radius:.2em;box-shadow:0 .5em 1.6em rgba(0,0,0,.45)}
.oda section.cm-icerik>.cm-kagit>.od-icerik{min-height:0}
.oda section.cm-icerik>.cm-govde{justify-self:center;width:min(100%,var(--cm-en));min-height:0;min-width:0;display:grid;color:var(--k-yazi)}
.cmp-sayfa{color:var(--c-pyazi)}
.oda .cm-icerik .dsy,.oda .cm-icerik .dft{position:relative;inset:auto;left:auto;right:auto;top:auto;bottom:auto;min-height:0;height:100%;z-index:auto}
.oda .cm-icerik:is([data-boy="cihaz"],[data-boy="telefon"])>.cm-kagit{align-self:stretch;height:100%;background:none;border:0;box-shadow:none}
.oda .cm-icerik:is([data-boy="cihaz"],[data-boy="telefon"]) .od-icerik{display:block;padding:0;overflow:hidden;height:100%}
/* Ofis'te kapı kartı (RK6 ziyaret): perde yok, iş sol yanda; kapı ve karşıdaki koltuk görünür */
.oda section.cm-icerik[data-boy="yarim"]{right:auto;width:min(46%,34em);left:1%}
/* balkonda iş sağ panelde, perde yok: antrenman net ve canlı (bant kalktı) */
.oda[data-yer="balkon"] section.cm-icerik{left:auto;right:0;width:min(52%,46em);--cm-en:100%}
.oda[data-yer="balkon"] section.cm-icerik[data-boy="cihaz"]{width:min(52%,25em)}
.cm-solma{animation:cmSolma 120ms ease-out both}
@keyframes cmSolma{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.cm-solma{animation:none}}
/* ---- koyu panel bileşenleri (.cmp-*; Lig, Finans; önizlemenin dili: prototipler/arayuz-konsept) ---- */
.cmp-sayfa{display:grid;gap:.8em;align-content:start;min-height:0;overflow:auto;padding-right:.15em}
.cmp-iki{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(16em,1fr);gap:.8em;align-items:start}
@container (max-width:900px){.cmp-iki{grid-template-columns:minmax(0,1fr)}}
.cmp-panel{background:var(--c-panel);border:1px solid var(--c-pcizgi);min-width:0;min-height:0;display:flex;flex-direction:column}
.cmp-panel>h2{margin:0;display:flex;align-items:center;justify-content:space-between;gap:.6em;padding:.55em .9em;font:800 max(12px,.8em) var(--cerceve);letter-spacing:.09em;text-transform:uppercase;
  color:var(--c-pbaslik);background:var(--c-panel2);border-bottom:1px solid var(--c-pcizgi)}
.cmp-panel>h2 small{font:600 max(12px,1em) var(--govde);letter-spacing:0;text-transform:none;color:var(--c-psoluk)}
.cmp-ic{padding:.7em .9em;min-height:0}
.cmp-soluk{color:var(--c-psoluk)}
.cmp-not{margin:0;color:var(--c-psoluk);font-size:max(12px,.9em)}
.oda .cmp-tablo{width:100%;border-collapse:collapse;font-family:var(--govde);font-variant-numeric:tabular-nums}
.cmp-tablo th{font:700 max(12px,.78em) var(--cerceve);letter-spacing:.06em;text-transform:uppercase;color:var(--c-psoluk);text-align:right;padding:.45em .5em;border-bottom:1px solid var(--c-pcizgi2);white-space:nowrap}
.cmp-tablo td{padding:.38em .5em;text-align:right;border-bottom:1px solid var(--c-pcizgi);white-space:nowrap}
.cmp-tablo :is(th,td).sol{text-align:left}
.cmp-tablo tbody tr:nth-child(even){background:var(--c-zebra)}
.cmp-tablo tbody tr.cmp-biz{background:var(--c-psecili);color:var(--c-pseciliYazi)}
.cmp-tablo tbody tr.cmp-biz .cmp-soluk{color:inherit;opacity:.8}
.cmp-tablo td.cmp-bolge{border-left:.25em solid transparent}
.cmp-tablo td.cmp-bolge[data-bolge="dusme"]{border-left-color:var(--c-kotu)}
.oda .cmp-bag{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;display:inline-flex;align-items:center;gap:.5em;text-align:left;box-shadow:none}
.oda .cmp-bag:hover{color:var(--c-link);text-decoration:underline;text-underline-offset:.2em}
.cmp-arma{display:inline-block;width:1.25em;height:1.4em;flex:none;vertical-align:middle}
.cmp-arma>*{display:block;width:100%;height:100%}
.cmp-son5{display:inline-flex;gap:.18em}
.cmp-son5 i{display:inline-grid;place-items:center;width:1.3em;height:1.3em;font:800 max(12px,.7em) var(--cerceve);font-style:normal;color:#fff;border-radius:.15em;background:var(--c-orta)}
.cmp-son5 i[data-s="G"]{background:var(--c-iyi)}.cmp-son5 i[data-s="M"]{background:var(--c-kotu)}
.cmp-hafta{display:flex;align-items:center;justify-content:space-between;gap:.6em}
.oda .cmp-dugme{font:600 max(12px,.92em) var(--govde);color:var(--c-pyazi);background:var(--c-panel2);border:1px solid var(--c-pcizgi2);border-radius:.2em;padding:.3em .8em;cursor:pointer;box-shadow:none}
.oda .cmp-dugme:hover:not(:disabled){border-color:var(--c-pvurgu)}
.oda .cmp-dugme:disabled{opacity:.45;cursor:default}
.oda .cmp-dugme[aria-pressed="true"]{background:var(--c-pvurgu);color:var(--c-pvurguYazi);border-color:var(--c-pvurgu)}
.cmp-gun{margin:.6em 0 .2em;font:800 max(12px,.78em) var(--cerceve);letter-spacing:.08em;text-transform:uppercase;color:var(--c-pbaslik)}
.oda .cmp-mac{display:grid;grid-template-columns:4.2em minmax(0,1fr) 4.4em minmax(0,1fr);align-items:center;gap:.5em;width:100%;padding:.45em .5em;font:inherit;color:inherit;text-align:left;
  background:none;border:0;border-bottom:1px solid var(--c-pcizgi);cursor:pointer;box-shadow:none}
.oda .cmp-mac:hover{background:var(--c-puzerinde)}
.oda .cmp-mac.cmp-biz{background:var(--c-psecili);color:var(--c-pseciliYazi)}
.oda .cmp-mac .cmp-ev{justify-self:end;display:inline-flex;align-items:center;gap:.5em;text-align:right;min-width:0}
.oda .cmp-mac .cmp-konuk{display:inline-flex;align-items:center;gap:.5em;min-width:0}
.oda .cmp-mac .cmp-skor{text-align:center;font:800 1.05em var(--cerceve);font-variant-numeric:tabular-nums}
.oda .cmp-mac .cmp-saat{color:var(--c-psoluk);font-size:max(12px,.86em)}
.oda .cmp-mac.cmp-biz .cmp-saat{color:inherit}
.cmp-kulupler{display:grid;grid-template-columns:repeat(auto-fill,minmax(15em,1fr));gap:.6em}
.oda .cmp-kulup{display:grid;grid-template-columns:2.6em minmax(0,1fr);gap:.2em .7em;align-items:center;padding:.6em .7em;font:inherit;color:inherit;text-align:left;background:var(--c-panel);
  border:1px solid var(--c-pcizgi);cursor:pointer;box-shadow:none}
.oda .cmp-kulup:hover{border-color:var(--c-pvurgu)}
.oda .cmp-kulup .cmp-arma{grid-row:span 2;width:2.4em;height:2.7em}
.oda .cmp-kulup b{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.oda .cmp-kulup small{color:var(--c-psoluk);font-size:max(12px,.84em);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cmp-buyuk{font:800 1.9em var(--cerceve);line-height:1.05;font-variant-numeric:tabular-nums}
.cmp-buyuk.cmp-eksi{color:var(--c-kotu)}
.cmp-kutular{display:grid;grid-template-columns:repeat(auto-fit,minmax(13em,1fr));gap:.6em}
.cmp-kutu{background:var(--c-panel);border:1px solid var(--c-pcizgi);padding:.7em .9em;display:grid;gap:.2em;min-width:0}
.cmp-kutu>span{font:700 max(12px,.78em) var(--cerceve);letter-spacing:.07em;text-transform:uppercase;color:var(--c-psoluk)}
.cmp-kutu>small{color:var(--c-psoluk);font-size:max(12px,.84em)}
.cmp-liste{display:grid}
.oda .cmp-satir{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.6em;align-items:baseline;width:100%;padding:.5em .7em;font:inherit;color:inherit;text-align:left;background:none;border:0;
  border-bottom:1px solid var(--c-pcizgi);cursor:pointer;box-shadow:none}
.oda .cmp-satir:hover{background:var(--c-puzerinde)}
.oda .cmp-satir[aria-current="true"]{background:var(--c-psecili);color:var(--c-pseciliYazi)}
.oda .cmp-satir[aria-current="true"] .cmp-soluk{color:inherit;opacity:.8}
.oda .cmp-satir b.cmp-yeni::before{content:'';display:inline-block;width:.5em;height:.5em;border-radius:50%;background:var(--c-haber);margin-right:.4em;vertical-align:middle}
.cmp-kagitSayfa{min-height:0;overflow:auto;color:var(--k-yazi);background:var(--k-zemin);border:1px solid var(--k-cizgi);border-radius:.2em;box-shadow:0 .5em 1.6em rgba(0,0,0,.45);padding:.6em .8em}
`;
  document.head.appendChild(st);
})();
