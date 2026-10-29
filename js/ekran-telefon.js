/* ============ Chairman — telefon ve karar kartı: oda, balkon ve maçta ortak çizim (görüntü katmanı; yol haritası 2.8I, N7) ============
   Kural içermez: içerik js/mesajlar.js (konusmaListesi), js/ajanda.js (ajandaOnizle) ve js/mesele.js okuma işlevlerinden gelir.
   Düğmeler data-eylem taşır; ev sahibi ekran (js/ekran-oda.js, js/ekran-mac-telefon.js) tıklamayı ortak kariyer komutuna çevirir.
   Karar kartı H1'den (F4) beri js/ekran-kart.js'tedir (kararKarti, kararGorusu, yazT; tek kart). Konuşmada kart alttaki cevap alanındadır ve özetsizdir:
     konu ve hazır görüş konuşmanın akışında durur (N7). Aynı karar telefonda ve dosyada bir kez uygulanır (ajandaIsiYap işi kapatır).
   U2 (2026-10-28): Geri'nin yazısı gideceği yerin adıdır (‹ Mesajlar, ‹ Ana ekran, ‹ Canlı Skor); konuşmanın başlığı iki satırdır (başlık çubuğu,
     altında kişi); cevap alanında kartın adı kartın üst etiketindedir. Maçta durum çubuğu ev sahibinin M.durumCubugu'nu yazar (“Durdu · 34'”).
   telefonCiz(k, T, s)      T: {ekran:'ana'|'mesajlar'|'konusma'|'skor', kisi, skorAc (H2-b: açık Canlı Skor satırının maç kimliği ya da null)}. s: {macta, mac, onizleler, kapali, acilis, yeniler, testSecenek} (H2-d: kasa bağlantısı kalktı)
     onizleler: karar başına kartta önizlenen yön ('sol'|'sag'; ev sahibinin görünüm durumu, js/ekran-oda.js). kapali: kart kilitli, nedeni yüzde (maçta)
     Ana ekran: tarih, büyük saat, bildirim kartları (yalnız okunmamış ya da cevap bekleyen konuşmalar; N14, 2026-10-18: maç gününün Canlı Skor
     kartı kalktı), altta sabit sırada iki uygulama (Mesajlar, Canlı Skor). Mesajlar: kişi listesi → tek konuşma (konuşma yoksa boş liste, yazı
     yok). Canlı Skor: günün maçları → ayrıntı. acilis: ekran yeni açıldı
     (kısa büyüyerek belirme; aynı ekran yeniden çizilirken verilmez).
     S-d (2026-10-27): Canlı Skor'da üç sekme — Maçlar (varsayılan, eski içerik) · Puan durumu (#, takım, O, AV, P; bizim satır vurgulu, bölge sol
     kenarda; takıma dokununca kulüp ekranı) · Fikstür (‹ N. hafta ›; oynanmış maç dokunulur). Yalnız etkin sekme çizilir. T: skorSekme, hafta, kulup;
     ekran 'kulup' (kulüp ekranı; geri Canlı Skor'a). s.lig verilirse (maç telefonu: canlı tablo) o, yoksa kariyerden: {tablo, bolgeler, biz, dokunur,
     fikstur, canli, hafta, ozet(id), ad(id)}. telGezinti(T, b) iki ev sahibinin ortak geçişidir.
     Maçta görünüm aynıdır; cevap verilmez (maç içi kariyer cevabı Aşama 3'te). Diğer maçlar F7'den beri bağlıdır (canlı skor ve sonuçlar);
     bağlanınca aynı tek satır kalıbıyla listeye gelirler, eksikleri için uyarı yazılmaz (N2, kullanıcı kararı 2026-10-04).
   R2 (2026-10-29; araclar/plan/r2-uygulama.md): odada iki sütun. s.ikiSutun ile telefon yalnız konuşmanın kendisini taşır (başlık, gün ayraçları, gelen ve
     giden mesajlar, notlar); o kişiyle yapılabilecekler ve kararlar sağdaki iş panelindedir:
     telefonIsPaneli(k, T, s) → html   konuşmada: kişinin başlığı, tek bekleme satırı (“Şükrü Hoca'dan cevap bekleniyor. Yarın 09:30 civarı.”),
       kararlar (konu, hazır görüş, geniş tek kart ipucuyla, yanında bağlam: o günün defteri, kasa ya da künye), dosyada bekleyen karar, konular
       (“Yazabileceklerin”; argümanlı konuda oyuncu seçimi: T.oyuncuSec). R2 eki (2026-10-29, karar 62): panel tek iş gösterir — karar varsa yalnız kart
       (cevaplar gizli, kaydırınca yüzünde; bağlam cevabın yüzünde, yandaki tam bağlam kalktı), karar yoksa bekleme satırı ya da T.konuMenu açıkken başlıklı
       konu menüsü (tlfKonuMenusu; kategori yazışma konusunun alanı), ikisi de yoksa boş durum; telefonun altında “Yeni konu aç” (data-eylem="konuMenu").
       Öbür telefon ekranlarında Bekleyenler: cevap bekleyen kararlar, dosyada
       bekleyen kararlar, beklenen cevaplar ve yeni mesajlar, üç ayrı işaretle. s: {onizleler, testSecenek, kulupId}
     Balkonda (iş sağ yarıda, R5) ve maç telefonunda tek telefon sürer. Ortak bekleme engeli (YAZISMA_BEKLEME_ENGELI) iki kipte de konuların altında
     tekrarlanmaz: konular açıklamalarıyla kapalı görünür, bekleme bir kez yazılır. */
/* bileşenin görünüşü: oda (.oda) ve maç telefonu (.macTelefon) içinde aynı. Renkler STIL.kagit'ten (--k-*), telefonunkiler STIL.kagit.telefon'dan.
   Masaüstü kopyası yalnız js/ klasörünü taşıdığı için stil burada belgeye eklenir.
   N7 (kullanıcı kararı 2026-10-04; onaylı taslak tur/p2'deki prototipler/8-telefon.html): tanıdık akıllı telefon düzeni. Cihaz gövdesi, kamera adası, durum
   çubuğu, büyük saatli ana ekran ve bildirim kartları, altta sabit sırada iki uygulama; konuşmada iki cevap alttaki sabit cevap alanındadır
   (klavyenin yeri). Gerçek marka arayüzü birebir kopyalanmaz; masaüstünde okunur boyut: yazı büyüyünce cihaz da genişler, dar gerçek telefon
   ölçeğine zorlanmaz. Durum çubuğundaki sinyal ve pil süstür, düğme değildir. */
(function telefonStili(){
  if(typeof document==='undefined'||document.getElementById('telefonStili'))return;
  const T=STIL.kagit.telefon,KT=STIL.kagit.kart,st=document.createElement('style');st.id='telefonStili';
  /* H1-b: dar cevap alanında (panelin %41'i) önizleme kayması küçüktür; alanın yan boşluğu ve kartın eğimi ona göre (js/ekran-kart.js kalıbı) */
  const telYan=(KT.telefon.kayma/(1+2*KT.telefon.kayma)*100).toFixed(2),telEgim=(KT.egim*KT.telefon.kayma/KT.esik).toFixed(2);
  st.textContent=`
.od-portre,.tel-portre{image-rendering:pixelated;image-rendering:crisp-edges;border-radius:.25em;flex:none}
.od-portre{width:2.9em;height:2.9em}
.portre-bos{display:inline-grid;place-items:center;width:2.4em;height:2.4em;background:var(--k-zeminKoyu);color:var(--k-soluk);font-weight:600}
.oda .od-panel.od-telefonPanel{width:41%;background:transparent;border:0;box-shadow:none}
/* telefon paneli: kâğıt panel yerine cihazın kendisi; başlık yalnız ekran okuyucu için, sağ üstte “Kapat” */
.od-telefonPanel>header{justify-content:flex-end;padding:0 0 .3em;background:transparent;border:0}
.od-telefonPanel>header h3{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.od-telefonPanel .od-icerik{display:block;padding:0;overflow:hidden}
/* ---- cihaz: yuvarlak köşeli gövde, ince çerçeve, kamera adası, ana ekran çizgisi ---- */
.tel-yer{container-type:size;width:100%;height:100%;min-height:0;display:grid;place-items:center}
.tel{box-sizing:border-box;height:100cqh;width:min(100cqw,max(49cqh,21em));padding:.55em;display:grid;background:${T.kasa};border-radius:2.6em;
  box-shadow:0 1.1em 2.4em rgba(0,0,0,.45),inset 0 0 0 .14em ${T.cerceve};color:var(--k-yazi)}
.tel p{margin:0}
.tel-ekran{position:relative;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;border-radius:2.1em;overflow:hidden;background:${T.ekran}}
.tel-ekran[data-ekran="ana"]{background:linear-gradient(180deg,${T.anaZemin[0]} 0%,${T.anaZemin[1]} 38%,${T.anaZemin[2]} 100%)}
.tel-ada{position:absolute;top:.6em;left:50%;transform:translateX(-50%);width:6em;height:1.75em;border-radius:1em;background:${T.ada};z-index:3}
.tel-durum{display:flex;justify-content:space-between;align-items:center;gap:.5em;min-height:2.95em;padding:.75em 1.55em .25em;font-weight:600;font-size:max(var(--k-enKucuk,12px),.92em);font-variant-numeric:tabular-nums}
.tel-durum>span{display:flex;gap:.35em;align-items:center}
.tel-sinyal{display:flex;gap:.14em;align-items:flex-end;height:.8em}.tel-sinyal i{width:.22em;background:var(--k-yazi);border-radius:.06em}
.tel-sinyal i:nth-child(1){height:30%}.tel-sinyal i:nth-child(2){height:50%}.tel-sinyal i:nth-child(3){height:75%}.tel-sinyal i:nth-child(4){height:100%}
.tel-pil{position:relative;width:1.65em;height:.8em;padding:.08em;border:.1em solid var(--k-yazi);border-radius:.22em}
.tel-pil::after{content:"";position:absolute;right:-.3em;top:.18em;width:.14em;height:.3em;background:var(--k-yazi);border-radius:0 .1em .1em 0}
.tel-pil i{display:block;height:100%;width:72%;background:var(--k-yazi);border-radius:.08em}
.tel-govde{min-height:0;overflow-y:auto;display:grid;gap:.45em;align-content:start;padding:.2em .7em .5em}
.tel-acilis{animation:telAc .18s ease-out}
@keyframes telAc{from{opacity:0;transform:scale(.965)}to{opacity:1;transform:none}}
.tel-alt{display:grid;place-items:center;padding:.25em 0 .45em}
.tel button.tel-ev{width:8em;height:.36em;padding:0;border:0;border-radius:1em;background:var(--k-yazi);opacity:.8}
.tel button.tel-ev:hover:not(:disabled){opacity:1}
/* ---- ana ekran: tarih ve büyük saat, bildirim kartları, altta sabit sıra ---- */
.tel-ekran[data-ekran="ana"] .tel-govde{grid-template-rows:auto 1fr auto;align-content:stretch;padding:0 .8em .2em}
.tel-saatBlok{display:grid;justify-items:center;padding-top:.6em}
.tel-tarih{color:var(--k-soluk);font-weight:500}
.tel-saat{font-family:var(--display);font-size:5.2em;line-height:.9;letter-spacing:.02em;font-variant-numeric:tabular-nums}
.tel-bildirimler{display:grid;gap:.55em;align-content:start;padding-top:.9em}
.tel button.tel-bildirim{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:.1em .7em;align-items:center;width:100%;text-align:left;padding:.6em .75em;
  background:rgba(251,247,236,.92);border:1px solid var(--k-cizgi);border-radius:1.1em;box-shadow:0 .15em .4em rgba(40,28,12,.12)}
.tel-bildirim .tel-simge{grid-row:span 2;width:2.3em;height:2.3em;border-radius:.6em}
.tel-bildirim b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-bildirim time{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.82em);white-space:nowrap}
.tel-bildirim>span:last-child{grid-column:2/-1;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.9em);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-bekliyor{color:var(--k-kirmizi);font-weight:600}
.tel-sabit{display:flex;justify-content:center;gap:1.8em;margin-top:.6em;padding:.65em 1em;border-radius:1.8em;background:${T.sabit}}
.tel button.tel-uyg{display:grid;justify-items:center;gap:.3em;padding:.1em;background:transparent;border:0;font-size:max(var(--k-enKucuk,12px),.8em);font-weight:500}
.tel-uyg .tel-simge{width:4.3em;height:4.3em;border-radius:1.1em}
.tel-simge{position:relative;display:grid;place-items:center;color:#fff;box-shadow:inset 0 -.2em 0 rgba(0,0,0,.18)}
.tel-simge svg{width:58%;height:58%}
.tel-simgeMesaj{background:${T.mesajSimge}}.tel-simgeSkor{background:${T.skorSimge}}
.tel-rozet{font-style:normal;display:inline-grid;place-items:center;min-width:1.55em;height:1.55em;padding:0 .35em;border-radius:1em;background:var(--k-kirmizi);color:#fff;font-size:max(var(--k-enKucuk,12px),.74em);font-weight:600}
.tel-simge .tel-rozet{position:absolute;top:-.35em;right:-.45em;border:.14em solid ${T.ekran};font-size:max(var(--k-enKucuk,12px),.95em)}
/* ---- uygulama başlığı: küçük geri, büyük başlık ---- */
.tel-nav{display:flex;align-items:center;min-height:1.9em}
.tel button.tel-geri{display:inline-flex;align-items:center;gap:.15em;padding:.15em .1em;background:transparent;border:0;color:${T.baglanti};font-weight:500}
.tel button.tel-geri::before{content:"";width:.55em;height:.55em;border-left:.13em solid currentColor;border-bottom:.13em solid currentColor;transform:rotate(45deg);margin:0 .15em 0 .2em}
.tel h4.tel-buyukBaslik{display:block;margin:0;font-family:var(--display);font-weight:400;font-size:2.5em;line-height:1;letter-spacing:.02em;text-transform:none;color:var(--k-yazi);padding:0 .05em .15em}
/* ---- Mesajlar: kişi satırları ---- */
.tel-portre{width:2.5em;height:2.5em}
.tel .tel-portre{border-radius:50%;border:1px solid var(--k-cizgi);background:var(--k-serit)}
.tel-liste{list-style:none;margin:0 -.7em;padding:0;display:grid}
.tel button.tel-kisi{display:grid;grid-template-columns:.6em auto minmax(0,1fr) auto;gap:.1em .6em;align-items:center;width:100%;text-align:left;
  padding:.55em .9em .55em .5em;background:transparent;border:0;border-bottom:1px solid ${T.ayrac};border-radius:0}
.tel-nokta{grid-row:1/span 3;width:.6em;height:.6em;border-radius:50%}.tel-nokta.tel-okunmamis{background:${T.baglanti}}
.tel-kisi .tel-portre{grid-row:1/span 3;width:2.9em;height:2.9em}
.tel-kisi b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-kisi time{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.82em);white-space:nowrap}
.tel-onizle{grid-column:3/-1;display:flex;gap:.5em;align-items:baseline;min-width:0;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.9em)}
.tel-onizle span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-kisi .tel-rozet{flex:none}
.tel-etiket{grid-column:3/-1;font-style:normal;font-size:max(var(--k-enKucuk,12px),.76em);font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--k-kirmizi);white-space:nowrap}
/* ---- konuşma: üstte kişi, baloncuklar; altta sabit cevap alanı ---- */
.tel-ekran[data-ekran="konusma"] .tel-govde{display:flex;flex-direction:column;gap:0;padding-top:0}
/* U2: iki satır — üstte uygulamanın başlık çubuğu (‹ Mesajlar), altında kişi (portre, ad, görev); uzun Geri yazısı kişinin adıyla çakışmaz */
.tel-kisiBas{position:sticky;top:0;z-index:1;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:0 .55em;margin:0 -.7em;padding:0 .9em .4em;background:${T.ekran};border-bottom:1px solid var(--k-cizgi)}
.tel-kisiBas>.tel-geri{grid-column:1/-1;justify-self:start;min-height:1.9em}
.tel-kisiBas>.tel-portre{width:2.3em;height:2.3em}
.tel-kisiBas>div{display:grid;gap:.05em;min-width:0;font-weight:600;line-height:1.2}
.tel-kisiBas>div>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-kisiBas small{font-weight:400;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.86em);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-konusma{margin-top:auto;display:grid;gap:.4em;align-content:end;padding-top:.6em}
.tel-gun{justify-self:center;font-size:max(var(--k-enKucuk,12px),.76em);letter-spacing:.04em;color:var(--k-soluk)}
.tel-not{justify-self:center;max-width:94%;text-align:center;font-size:max(var(--k-enKucuk,12px),.84em);color:var(--k-soluk)}
.tel-balon{max-width:84%;display:grid;gap:.1em;padding:.45em .75em;border-radius:1.1em;line-height:1.35}
.tel-balon small{font-size:max(var(--k-enKucuk,12px),.74em);color:var(--k-soluk)}
.tel-gelen{justify-self:start;background:${T.gelen};border:1px solid var(--k-cizgi);border-bottom-left-radius:.35em}
.tel-giden{justify-self:end;background:${T.giden};border:1px solid ${T.gidenCizgi};border-bottom-right-radius:.35em}
.tel-yeni{box-shadow:0 0 0 .14em var(--k-mavi)}
.tel-gizli{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.tel-dosya{font-style:normal}
.tel-kararOzet{display:grid;gap:.3em;padding:.45em .6em;border:1px dashed var(--k-cizgi);border-radius:.8em;font-size:max(var(--k-enKucuk,12px),.92em)}
.tel-oneri{display:grid;gap:.15em;justify-items:start;padding:.3em .5em;border:1px dashed var(--k-cizgi);border-radius:.5em}
.tel-oneri small{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.84em)}
.tel-bos{color:var(--k-soluk);text-align:center;padding:1em 0}
.tel-bekleme{font-style:italic}
.tel-cevap{display:grid;gap:.45em;max-height:55cqh;overflow-y:auto;padding:.5em .65em .45em;background:var(--k-serit);border-top:1px solid var(--k-cizgi)}
/* tek kart (H1, U2): kartın adı üst etikette (işin başlığı); üç yüz aynı hücrede olduğu için en az yükseklik yok; dar alanda küçük önizleme kayması;
   boşlukların sıkışması ortak bileşenin dar kap kuralıyla (js/ekran-kart.js) */
.tel .tel-cevap .kk-alan{padding:0 ${telYan}%}
.tel .tel-cevap .kk-kart{background:#fff;border-radius:.8em}
.tel .tel-cevap .kk-kart[data-yuz="sol"]{transform:translateX(-${KT.telefon.kayma*100}%) rotate(-${telEgim}deg)}
.tel .tel-cevap .kk-kart[data-yuz="sag"]{transform:translateX(${KT.telefon.kayma*100}%) rotate(${telEgim}deg)}
.tel-cevap .kk-alan+.kk-alan{padding-top:.45em;border-top:1px dashed var(--k-cizgi)}
.tel .tel-cevap .kk-kenar{border-radius:.8em}
.tel-cevap .kk-kart>.kk-not:last-child{text-align:center}
/* ---- Canlı Skor ---- */
.tel-skor{display:grid;gap:.45em}
.tel-skor h5{margin:.3em 0 0;font-size:max(var(--k-enKucuk,12px),.76em);letter-spacing:.1em;text-transform:uppercase;color:var(--k-vurgu);font-weight:600}
/* N2 (2026-10-04): her karşılaşma tek satır: saat ya da dakika/durum · ev sahibi · skor · deplasman; sığmayan ad kesilir, satır kaymaz */
.tel .tel-mac{display:grid;grid-template-columns:3.4em minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:.5em;width:100%;padding:.55em .6em;white-space:nowrap;line-height:1.2;background:var(--k-serit);border:1px solid var(--k-cizgi);border-radius:.8em}
.tel-mac span{overflow:hidden;text-overflow:ellipsis}
.tel-mac .tel-macEv{text-align:right}.tel-mac .tel-macDep{text-align:left}
.tel-mac b{font-family:var(--govde);font-weight:600;font-size:1.1em;line-height:1}
.tel-mac small{color:var(--k-soluk);text-align:left;font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis}
.tel-mac small.tel-macCanli{color:var(--k-kirmizi);font-weight:600}
.tel-ist{width:100%;border-collapse:separate;border-spacing:0;font-variant-numeric:tabular-nums;background:#fff;border:1px solid var(--k-cizgi);border-radius:.8em;overflow:hidden}
.tel-ist th,.tel-ist td{padding:.3em .5em;border-bottom:1px solid ${T.ayrac};text-align:center}
.tel-ist thead th{background:var(--k-zemin);font-size:max(var(--k-enKucuk,12px),.88em)}
.tel-ist tbody tr:last-child>*{border-bottom:0}
.tel-ist tbody th{font-weight:400;color:var(--k-soluk)}
/* H2-b: maçın ayrıntısı — goller, kartlar, sakatlıklar iki sütunda (ev solda), altında tablo; uzun satır kesilir, yatay taşma yok */
.tel-ayrinti{display:grid;gap:.4em;min-width:0}
.tel-olaylar{display:grid;gap:.1em;min-width:0;padding:.35em .55em;background:#fff;border:1px solid var(--k-cizgi);border-radius:.8em}
.tel h6{margin:0;font-size:max(var(--k-enKucuk,12px),.72em);letter-spacing:.1em;text-transform:uppercase;color:var(--k-vurgu);font-weight:600}
.tel-olayIki{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 .8em;min-width:0}
.tel-olayIki ul{margin:0;padding:0;list-style:none;display:grid;align-content:start;gap:.05em;min-width:0}
.tel-olay{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:max(var(--k-enKucuk,12px),.9em)}
.tel-olay small{color:var(--k-soluk)}
.tel-dk{display:inline-block;min-width:2.3em;color:var(--k-soluk);font-variant-numeric:tabular-nums}
.tel-kartRenk{display:inline-block;width:.55em;height:.8em;margin-right:.35em;vertical-align:-.08em;border:1px solid rgba(0,0,0,.35);border-radius:.08em}
.tel-olayYok{margin:0;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.9em)}
/* S-d: Canlı Skor sekmeleri, puan tablosu, fikstür gezintisi ve kulüp ekranı (--k-* değişkenleri) */
.tel-sekmeler{display:flex;gap:.25em;margin:0 0 .5em;border-bottom:1px solid var(--k-cizgi)}
.tel .tel-sekme{flex:1 1 0;min-width:0;padding:.3em .1em;border:0;border-bottom:.18em solid transparent;background:transparent;color:var(--k-soluk);font:inherit;font-size:max(var(--k-enKucuk,12px),.78em);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.tel .tel-sekme[aria-selected="true"]{color:var(--k-yazi);font-weight:600;border-bottom-color:var(--k-vurgu)}
.tel-tablo{width:100%;table-layout:fixed;border-collapse:collapse;font-size:max(var(--k-enKucuk,12px),.86em);font-variant-numeric:tabular-nums}
.tel-tablo th{font-weight:600;color:var(--k-soluk);text-align:right;padding:.15em .25em}
.tel-tablo th:nth-child(2),.tel-tablo td:nth-child(2){text-align:left}
.tel-tablo td{padding:.16em .25em;text-align:right;border-top:1px solid var(--k-cizgi);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tel-tablo td:first-child{border-left:.22em solid transparent}
.tel-tablo td.tel-b-cikma{border-left-color:var(--k-yesil)}.tel-tablo td.tel-b-playoff{border-left-color:var(--k-mavi,var(--k-vurgu))}.tel-tablo td.tel-b-dusme{border-left-color:var(--k-kirmizi)}
.tel-tablo tr.tel-biz td{background:var(--k-zeminKoyu);font-weight:600}
.tel .tel-kulupAd{display:block;width:100%;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.tel-lejant{display:flex;flex-wrap:wrap;gap:.2em .8em;margin:.4em 0 0;font-size:max(var(--k-enKucuk,12px),.78em);color:var(--k-soluk)}
.tel-lejant span{padding-left:.4em;border-left:.22em solid transparent}
.tel-lejant .tel-b-cikma{border-left-color:var(--k-yesil)}.tel-lejant .tel-b-playoff{border-left-color:var(--k-mavi,var(--k-vurgu))}.tel-lejant .tel-b-dusme{border-left-color:var(--k-kirmizi)}
.tel-haftaNav{display:grid;grid-template-columns:2.2em minmax(0,1fr) 2.2em;align-items:center;text-align:center;margin:0 0 .3em}
.tel .tel-haftaOk{padding:.1em 0;border:1px solid var(--k-cizgi);border-radius:.4em;background:transparent;color:var(--k-yazi);font:inherit;cursor:pointer}
.tel .tel-haftaOk:disabled{opacity:.35;cursor:default}
.tel-canliNot{margin:0 0 .3em}
.tel-kulupDl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.25em .7em;margin:.2em 0 0;font-size:max(var(--k-enKucuk,12px),.9em)}
.tel-kulupDl dt{color:var(--k-soluk)}.tel-kulupDl dd{margin:0;overflow-wrap:anywhere}
.tel-sonuc{display:inline-block;width:1.35em;margin-right:.15em;text-align:center;font-style:normal;font-weight:600;border-radius:.2em;color:#fff}
.tel-sG{background:var(--k-yesil)}.tel-sB{background:var(--k-soluk)}.tel-sM{background:var(--k-kirmizi)}
/* ---- R2: odada iki sütun — solda telefon, sağda iş paneli (kâğıt). Telefon sütunu en az 17 em; telefon sütunun sağına yaslanır ---- */
.oda section.odk[data-boy="telefon"]{width:var(--odk-en)}
.oda .tlf{height:100%;min-height:0;display:grid;grid-template-columns:minmax(17em,42fr) minmax(0,56fr);gap:2%}
.oda .tlf-sol{min-width:0;min-height:0}
.oda .tlf-sol .tel-yer{place-items:center end}
.tlf-is{min-height:0;max-height:100%;align-self:start;overflow-y:auto;display:grid;align-content:start;gap:.75em;padding:.85em 1em 1em;color:var(--k-yazi);
  background:var(--k-zemin);border:1px solid var(--k-cizgi);box-shadow:.35em .45em 0 var(--k-golge);container:tlf / inline-size}
.tlf-is p{margin:0}
.tlf-is h4{margin:0;font-family:var(--display);font-weight:400;font-size:1.6em;line-height:1;letter-spacing:.02em}
.tlf-is h5{margin:.15em 0 0;font-size:max(var(--k-enKucuk,12px),.8em);letter-spacing:.1em;text-transform:uppercase;color:var(--k-vurgu);font-weight:600}
.tlf-bekleme{display:grid;gap:.1em;padding:.55em .75em;background:var(--k-serit);border:1px solid var(--k-cizgi);border-left:.3em solid var(--k-mavi)}
.tlf-bekleme b{font-weight:600}
.tlf-not{color:var(--k-soluk)}
.tlf-karar{display:grid;gap:.55em;padding-bottom:.6em;border-bottom:1px dashed var(--k-cizgi)}
.tlf-karar .kk-konu{font-size:1.05em;line-height:1.35}
.tlf-konular,.tlf-satirlar{list-style:none;margin:0;padding:0;display:grid;gap:.35em}
.tlf-is .tlf-konu,.tlf-is .tlf-satir{display:grid;gap:.1em;width:100%;text-align:left;padding:.45em .7em;font:inherit;color:var(--k-yazi);background:var(--k-serit);
  border:1px solid var(--k-cizgi);border-radius:.3em;cursor:pointer}
.tlf-is .tlf-konu small,.tlf-is .tlf-satir small{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.88em);line-height:1.3}
.tlf-is .tlf-konu:disabled{opacity:.55;cursor:default}
.tlf-is .tlf-konu[aria-expanded="true"]{border-color:var(--k-vurgu)}
.tlf-satir{grid-template-columns:auto minmax(0,1fr)!important;column-gap:.6em!important;align-items:center}
.tlf-satir>i{grid-row:1/span 2;width:.75em;height:.75em;border-radius:50%;font-style:normal}
.tlf-satir>span,.tlf-satir>small{grid-column:2;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tlf-iKarar{background:var(--k-kirmizi)}.tlf-iCevap{box-shadow:inset 0 0 0 .16em var(--k-mavi)}.tlf-iYeni{background:var(--k-mavi)}
.tlf-oyuncular{display:grid;gap:.4em;padding:.5em .6em;background:var(--k-serit);border:1px solid var(--k-vurgu)}
.tlf-oyuncular h6{margin:.2em 0 0;font-size:max(var(--k-enKucuk,12px),.8em);color:var(--k-soluk);font-weight:600}
.tlf-oyuncuDiz{display:flex;flex-wrap:wrap;gap:.3em}
.tlf-is .tlf-oyuncuDiz button{padding:.25em .55em;font:inherit;color:var(--k-yazi);background:var(--k-zemin);border:1px solid var(--k-cizgi);border-radius:.3em;cursor:pointer}
.tlf-is .tlf-oyuncuDiz button small{color:var(--k-soluk)}
.tlf-bos{color:var(--k-soluk)}
/* R2 eki: karar varken panel yalnız kartı taşır, kart ortada ve dar (Reigns kartı gibi dik); konu menüsü başlıklı tek liste; telefonun altında “Yeni konu aç” */
.tlf-is.tlf-tekKart{display:flex;flex-direction:column;align-self:stretch;gap:.6em}
.tlf-is.tlf-tekKart::before,.tlf-is.tlf-tekKart::after{content:"";flex:1 1 0}
.tlf-tekKart>.tlf-karar{flex:none;display:grid;gap:.5em;justify-items:center;padding:0;border:0}
.tlf-tekKart .kk-alan{width:min(100%,25em)}
.tlf-tekKart .kk-gorusler{width:min(100%,25em)}
.tlf-tekKart>.tlf-not,.tlf-tekKart>.tlf-bekleme{flex:none}
.tlf-menu{display:grid;gap:.45em}
.tlf-kategori{display:flex;align-items:center;gap:.45em}
.tlf-kSimge{display:grid;place-items:center;flex:none;width:1.7em;height:1.7em;border-radius:50%;border:1px solid var(--k-cizgi);background:var(--k-zemin);color:var(--k-yazi)}
.tel-yeniKonu{padding:.45em .7em .6em}
.tel .tel-yeniKonu button{display:flex;align-items:center;justify-content:center;gap:.45em;width:100%;padding:.55em 1em;font:inherit;font-weight:600;color:${T.ekran};background:${T.kasa};border:0;border-radius:2em;cursor:pointer}
.tel .tel-yeniKonu button i{font-style:normal;font-size:1.25em;line-height:1}
.tel .tel-yeniKonu button[aria-expanded="true"]{box-shadow:0 0 0 .14em var(--k-vurgu)}
.tel .tel-yeniKonu button:disabled{opacity:.45;cursor:default}
`;
  document.head.appendChild(st);
})();
const TEL_GUNLER=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const telGunAdi=t=>{const [y,a,g]=t.split('-').map(Number);return TEL_GUNLER[new Date(Date.UTC(y,a-1,g)).getUTCDay()];};
const telTarih=(k,t)=>t===k.tarih?'Bugün':t===tarihEkle(k.tarih,-1)?'Dün':gunAyYazi(t)+' '+telGunAdi(t);
/* kişi satırı ve bildirim kartındaki kısa an: bugün saat, dün “dün”, son bir haftada gün adı, daha eskisi gün ve ay */
const telKisaAn=(k,t,dk)=>{if(t===k.tarih)return saatYazi(dk);const f=Math.round((anDakika(k.tarih,0)-anDakika(t,0))/1440);
  return f===1?'dün':f>1&&f<7?telGunAdi(t):gunAyYazi(t);};
/* Canlı Skor satırında kulübün kısa adı (N7, onaylı taslaktaki gibi “Demirkapı – Akdeniz”): lig kaydındaki tam addan kadro adına; kadrosu yoksa tam ad.
   Tam ad satırın başlığında (title) kalır. Yalnız görüntü eşlemesidir; kariyer verisi değişmez */
const telKisaAd=ad=>{
  /* F1-b: önce kariyerdeki kulüp kadrosunun kısa adı (bütün lig), yoksa geliştirme verisi (js/lig.js, js/kadrolar.js) */
  const k=typeof OYUN!=='undefined'&&OYUN.kariyer,c=k&&k.kulupler&&Object.values(k.kulupler).find(x=>x.ad===ad);if(c&&c.kadro)return c.kadro.ad;
  const t=typeof LIG!=='undefined'&&LIG.takimlar.find(x=>x.ad===ad);return t&&typeof KADROLAR!=='undefined'&&KADROLAR[t.id]?KADROLAR[t.id].ad:ad;};
/* Canlı Skor satırı (N2): tek satır. m: {sol: saat ya da dakika/durum, canli, ev, orta: skor ya da “–”, dep, durum: okunur durum}; nitelik verilirse satır düğmedir */
function telMacSatiri(m,nitelik){
  const ic='<small'+(m.canli?' class="tel-macCanli"':'')+'>'+yazT(m.sol)+'</small><span class="tel-macEv">'+yazT(telKisaAd(m.ev))+'</span><b>'+yazT(m.orta)+'</b><span class="tel-macDep">'+yazT(telKisaAd(m.dep))+'</span>';
  const baslik=' title="'+yazT(m.ev+' – '+m.dep+' · '+m.durum)+'"';
  return nitelik?'<button type="button" class="tel-mac" '+nitelik+baslik+'>'+ic+'</button>':'<div class="tel-mac"'+baslik+'>'+ic+'</div>';
}

/* H2-b (2026-10-26, kullanıcı isteği 6): maçın ayrıntısı — macAyrintisi çıktısı (js/mac-okuma.js), bizim maç ve öbür maçlar, canlı ya da kayıttan.
   Goller, Kartlar, Sakatlıklar iki sütunda (ev solda; her satırda dakika, ad, kartta renk kutucuğu); olay yoksa tek soluk satır; altında 10 satırlık
   tablo. Hükmende tek not. evKisa, depKisa: tablonun başlığı ve hükmen notunun adı */
const TEL_SAKAT_DERECE={tedavi:'tedavi gördü',cikis:'oyundan çıktı'};
function telMacAyrinti(A,evKisa,depKisa){
  if(!A)return'';
  if(A.hukmen)return'<div class="tel-ayrinti"><p class="tel-not">'+yazT(A.hukmen==='cift'?'İki takım da on bir uygun oyuncu çıkaramadı; maç oynanmadı (hükmen, TEST).'
    :(A.hukmen==='ev'?evKisa:depKisa)+' on bir uygun oyuncu çıkaramadı; maç hükmen (TEST).')+'</p></div>';
  const R=STIL.kagit.kartRenk,dk=x=>'<span class="tel-dk">'+x.dk+'\'</span>';
  const blok=(tur,baslik,L,yok,f)=>'<div class="tel-olaylar" data-tur="'+tur+'"><h6>'+baslik+'</h6>'+(L.length?'<div class="tel-olayIki">'+
    [0,1].map(t=>'<ul>'+L.filter(x=>x.t===t).map(x=>'<li class="tel-olay">'+dk(x)+f(x)+'</li>').join('')+'</ul>').join('')+'</div>':'<p class="tel-olayYok">'+yok+'</p>')+'</div>';
  return'<div class="tel-ayrinti">'+
    blok('gol','Goller',A.goller,'Gol yok.',g=>yazT(g.ad)+(g.kk?' <small>(k.k.)</small>':''))+
    blok('kart','Kartlar',A.kartlar,'Kart yok.',c=>{const ad=c.renk==='sari'?'Sarı kart':c.renk==='ikinciSari'?'İkinci sarıdan kırmızı':'Kırmızı kart';
      return'<i class="tel-kartRenk" style="background:'+(R[c.renk]||R.sari)+'" title="'+ad+'" aria-hidden="true"></i><span class="tel-gizli">'+ad+': </span>'+yazT(c.ad);})+
    blok('sakat','Sakatlıklar',A.sakat,'Sakatlık yok.',x=>yazT(x.ad)+' <small>'+(TEL_SAKAT_DERECE[x.derece]||'')+(x.gun>0?' · ~'+x.gun+' gün':'')+'</small>')+
    '<table class="tel-ist"><thead><tr><th>'+yazT(evKisa||'')+'</th><th></th><th>'+yazT(depKisa||'')+'</th></tr></thead><tbody>'+
      A.satirlar.map(r=>'<tr><td>'+yazT(r[1])+'</td><th scope="row">'+yazT(r[0])+'</th><td>'+yazT(r[2])+'</td></tr>').join('')+'</tbody></table></div>';
}
/* H2-b: dokunulur Canlı Skor satırının niteliği (T.skorAc açık satırın maç kimliği ya da null) */
const telSkorNitelik=(T,id)=>'data-eylem="skorAc" data-mac="'+yazT(id)+'" aria-expanded="'+(T.skorAc===id?'true':'false')+'"';

/* ---- S-d: Canlı Skor'un lig görünümleri ---- */
const TEL_LIG_SEKME=[['maclar','Maçlar'],['tablo','Puan durumu'],['fikstur','Fikstür']];
function telLigSekmeleri(T,L){
  const S=TEL_LIG_SEKME.filter(x=>x[0]!=='fikstur'||L.fikstur),sec=S.some(x=>x[0]===T.skorSekme)?T.skorSekme:'maclar';
  return'<nav class="tel-sekmeler" role="tablist" aria-label="Canlı Skor">'+S.map(([id,ad])=>'<button type="button" class="tel-sekme" role="tab" data-eylem="skorSekme" data-sekme="'+id+'" aria-selected="'+(sec===id?'true':'false')+'">'+ad+'</button>').join('')+'</nav>';
}
function telPuanTablosu(L){
  const a=v=>(v>0?'+':'')+v;
  return(L.canli?'<p class="tel-not tel-canliNot">Canlı: maçların şu anki skoruyla.</p>':'')+
    '<table class="tel-tablo"><colgroup><col style="width:2.1em"><col><col style="width:2.1em"><col style="width:2.8em"><col style="width:2.3em"></colgroup>'+
    '<thead><tr><th>#</th><th>Takım</th><th><abbr title="Oynanan">O</abbr></th><th><abbr title="Averaj">AV</abbr></th><th><abbr title="Puan">P</abbr></th></tr></thead><tbody>'+
    L.tablo.map((t,i)=>{const b=ligBolgesi(L.bolgeler,i+1),ad=yazT(telKisaAd(t.ad));
      return'<tr'+(t.id===L.biz?' class="tel-biz"':'')+'><td'+(b?' class="tel-b-'+b+'"':'')+'>'+(i+1)+'</td><td>'+
        (L.dokunur?'<button type="button" class="tel-kulupAd" data-eylem="kulupAc" data-kulup="'+yazT(t.id)+'" title="'+yazT(t.ad)+'">'+ad+'</button>':'<span title="'+yazT(t.ad)+'">'+ad+'</span>')+
        '</td><td>'+t.O+'</td><td>'+a(t.AV)+'</td><td><b>'+t.P+'</b></td></tr>';}).join('')+'</tbody></table>'+
    '<p class="tel-lejant"><span class="tel-b-cikma">Şampiyon çıkar</span><span class="tel-b-playoff">Play-off</span><span class="tel-b-dusme">Küme düşer</span></p>';
}
/* fikstür: ‹ N. hafta › (sezonun ilk ve son haftası arasında); oynanmış maç bugünkü satır kalıbıyla dokunulur, gelecek maç saat ve “–” */
function telFikstur(k,T,L){
  const S=k.sezon,ilk=S.ilkHafta,son=S.ilkHafta+S.haftaSayisi-1,h=Math.max(ilk,Math.min(son,T.hafta||L.hafta||ilk)),F=haftaFiksturu(k,h);
  const ok=(n,et,yon)=>'<button type="button" class="tel-haftaOk" data-eylem="fiksturHafta" data-hafta="'+n+'" data-yon="'+yon+'" data-ilk="'+ilk+'" data-son="'+son+'" aria-label="'+et+'"'+(n<ilk||n>son?' disabled':'')+'>'+(yon==='geri'?'‹':'›')+'</button>';
  const ad=id=>(k.kulupler[id]||{ad:id}).ad,t=F.length?F[0].f.tarih:null;
  return'<div class="tel-haftaNav">'+ok(h-1,'Önceki hafta','geri')+'<b>'+h+'. hafta</b>'+ok(h+1,'Sonraki hafta','ileri')+'</div>'+(t?'<h5>'+yazT(telGunAdi(t)+' '+gunAyYazi(t))+'</h5>':'')+
    F.map(({f,s})=>s?telMacSatiri({sol:'Bitti',ev:ad(f.ev),orta:s.skor[0]+' – '+s.skor[1],dep:ad(f.konuk),durum:'bitti'},telSkorNitelik(T,f.id))+
        (T.skorAc===f.id&&typeof macAyrintisi==='function'?telMacAyrinti(macAyrintisi(s,id=>(k.oyuncular[id]||{}).ad),k.kulupler[f.ev].kisa||'',k.kulupler[f.konuk].kisa||''):'')
      :telMacSatiri({sol:saatYazi(f.dakika),ev:ad(f.ev),orta:'–',dep:ad(f.konuk),durum:'başlamadı'})).join('');
}
/* kulüp ekranı (o: js/fikstur.js kulupOzeti). ops: {canli (maçta: sıra ve puan canlı, son beş önceki haftalar), ad(id)} */
function telKulupEkrani(o,ops){
  ops=ops||{};if(!o)return'<p class="tel-bos">Kulüp bulunamadı.</p>';
  const ad=ops.ad||(id=>id),a=v=>(v>0?'+':'')+v;
  const son=o.son.map(x=>{const r=x.a>x.y?'G':x.a<x.y?'M':'B';return'<i class="tel-sonuc tel-s'+r+'" title="'+yazT((x.yer==='i'?'':'@ ')+ad(x.rakip)+' '+x.a+'–'+x.y)+'">'+r+'</i>';}).join('');
  const sr=o.siradaki;
  return'<div class="tel-kulup"><h4 class="tel-buyukBaslik">'+yazT(o.ad)+'</h4><dl class="tel-kulupDl">'+
    '<dt>Sıra</dt><dd>'+(o.sira>0?o.sira+'. · ':'')+o.P+' puan'+(ops.canli?' <small>(canlı)</small>':'')+'</dd>'+
    '<dt>G-B-M</dt><dd>'+o.G+'-'+o.B+'-'+o.M+'</dd><dt>Goller'+(ops.canli?' <small>(canlı)</small>':'')+'</dt><dd>'+o.A+' attı, '+o.Y+' yedi · AV '+a(o.AV)+'</dd>'+
    '<dt>Golcüler'+(ops.canli?' <small>(önceki haftalar)</small>':'')+'</dt><dd>'+(o.golculer.length?o.golculer.map(g=>yazT(g.ad)+' '+g.gol).join(', '):'—')+'</dd>'+
    '<dt>Son 5'+(ops.canli?' <small>(önceki haftalar)</small>':'')+'</dt><dd>'+(son||'—')+'</dd>'+
    '<dt>'+(ops.canli?'Bugün':'Sıradaki')+'</dt><dd>'+(sr?yazT((sr.yer==='i'?'':'@ ')+ad(sr.rakip)+' · '+gunAyYazi(sr.tarih)+' '+saatYazi(sr.dakika)):'—')+'</dd>'+
    '<dt>Teknik direktör</dt><dd>'+(o.hoca?yazT(o.hoca.ad)+(o.hoca.tarzAdi?' <small>'+yazT(o.hoca.tarzAdi)+'</small>':''):'—')+'</dd>'+
    '<dt>Stat</dt><dd>'+yazT(o.stat.ad)+' <small>'+yazT(o.stat.kapasite.toLocaleString('tr-TR'))+' kişi</small></dd></dl></div>';
}
/* iki ev sahibinin ortak lig gezintisi: T'yi değiştirir ve odaklanacak seçiciyi döndürür; eylem bunlardan değilse undefined */
function telGezinti(T,b){
  const ey=b.dataset.eylem;
  if(ey==='skorSekme'){T.skorSekme=b.dataset.sekme;T.skorAc=null;return'[data-eylem="skorSekme"][data-sekme="'+T.skorSekme+'"]';}
  /* inceleme: odak aynı yöndeki okta kalır; sezonun ucuna gelindiyse öbür oka geçer */
  if(ey==='fiksturHafta'){const h=Number(b.dataset.hafta),y=b.dataset.yon,uc=y==='ileri'?h>=Number(b.dataset.son):h<=Number(b.dataset.ilk);T.hafta=h;T.skorAc=null;
    return'[data-eylem="fiksturHafta"][data-yon="'+(uc?(y==='ileri'?'geri':'ileri'):y)+'"]';}
  if(ey==='kulupAc'){T.kulup=b.dataset.kulup;T.ekran='kulup';return'.tel-geri';}
  if(ey==='skorGeri'){const id=T.kulup;T.ekran='skor';T.kulup=null;return'[data-eylem="kulupAc"][data-kulup="'+id+'"]';}
  return undefined;
}
/* odadaki telefonun lig verisi (kariyerden; fikstürsüz örnek kariyerde yok) */
function telLigVerisi(k){
  if(!k||!k.sezon||!k.sezon.devralinan||!Array.isArray(k.fikstur)||!k.fikstur.length)return null;
  const biz=(k.kisiler[k.baskanId]||{}).kulupId,mac=bekleyenIsler(k).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'),f=mac&&k.fikstur.find(x=>x.id===mac.veri.macId);
  const son=typeof kulubunSonMaci==='function'?kulubunSonMaci(k,biz):null;
  return{tablo:sezonTablosu(k),bolgeler:k.sezon.bolgeler,biz,dokunur:true,fikstur:true,canli:false,hafta:f?f.hafta:son?son.f.hafta:k.sezon.ilkHafta,
    ozet:id=>kulupOzeti(k,id),ad:id=>(k.kulupler[id]||{ad:id}).ad};
}

/* R2-c: konunun altındaki satır: konuya özgü engel varsa o; ortak bekleme engelinde açıklama (bekleme bir kez, başka yerde söylenir) */
const telKonuAlti=G=>G.engel&&!(typeof YAZISMA_BEKLEME_ENGELI!=='undefined'&&G.engel===YAZISMA_BEKLEME_ENGELI)?G.engel:G.aciklama;
/* ---- telefon ---- */
const TEL_SIMGE={
  mesajlar:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>',
  skor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5l4 3-1.5 4.5h-5L8 10.5z" fill="currentColor" stroke="none"/></svg>'
};
const telSimge=(ad,ek)=>'<span class="tel-simge tel-simge'+(ad==='mesajlar'?'Mesaj':'Skor')+'">'+TEL_SIMGE[ad]+(ek||'')+'</span>';
/* konuşmanın önizleme satırı: son mesaj (giden “Sen: ” ile); yazışma yoksa ilk öneri */
const telOnizle=(c,macta)=>{const son=c.mesajlar[c.mesajlar.length-1];return son?(son.yon==='giden'?'Sen: ':'')+son.metin:!macta&&c.girisimler.length?c.girisimler[0].aciklama:'';};   /* H2-e: maçta öneri yok */
function telefonCiz(k,T,s={}){
  const ekran=T.ekran||'ana',M=s.mac||null;
  /* maçta saat yerine maçın kısa durumu (başlama saati, dakika, Devre, Bitti) */
  const saat=M?M.kisaDurum||M.saat||'':k?saatYazi(k.gunIciDakika):'';
  /* U2: maçta durum çubuğu telefon açıkken maçın durduğunu söyler (“Durdu · 34'”; ev sahibi M.durumCubugu) */
  const cubuk=M&&M.durumCubugu||saat;
  const L=k?konusmaListesi(k):[],okunmamis=L.reduce((t,c)=>t+c.okunmamis,0),cevap=L.filter(c=>c.cevapBekliyor).length;
  /* U2: Geri'nin yazısı gideceği yerin adıdır (‹ Mesajlar, ‹ Ana ekran, ‹ Canlı Skor); ekran okuyucuya “Geri: …” */
  const geri=(ey,ek,etiket)=>'<button type="button" class="tel-geri" data-eylem="'+ey+'"'+(ek||'')+' aria-label="Geri: '+etiket+'">'+etiket+'</button>';
  let ic='',alt='';
  if(ekran==='ana'){
    /* bildirimler: yalnız okunmamış ya da cevap bekleyen konuşmalar (en çok dört). N14 (kullanıcı kararı 2026-10-18): maç gününün Canlı Skor kartı
       kalktı — ana ekranda skor “açık” görünüyordu; Canlı Skor yalnız uygulamasından açılır (odada ve maçta aynı) */
    const B=L.filter(c=>c.okunmamis>0||c.cevapBekliyor).slice(0,4).map(c=>{
      const son=c.mesajlar[c.mesajlar.length-1];
      return'<button type="button" class="tel-bildirim" data-eylem="telKisi" data-kisi="'+yazT(c.anahtar)+'">'+telSimge('mesajlar')+'<b>'+yazT(c.ad)+'</b><time>'+(son?yazT(telKisaAn(k,son.tarih,son.dakika)):'')+'</time>'+
        '<span>'+(c.cevapBekliyor?'<span class="tel-bekliyor">Cevap bekliyor</span> · ':'')+yazT(telOnizle(c,s.macta))+'</span></button>';
    });
    const rozet=cevap?'<i class="tel-rozet">'+cevap+'</i>':okunmamis?'<i class="tel-rozet">'+okunmamis+'</i>':'';
    ic='<div class="tel-saatBlok"><p class="tel-tarih">'+(k?yazT(telGunAdi(k.tarih)+', '+gunAyYazi(k.tarih)):'Maç günü')+'</p><p class="tel-saat">'+yazT(saat)+'</p></div>'+
      '<div class="tel-bildirimler" aria-label="Bildirimler">'+B.join('')+'</div>'+
      '<div class="tel-sabit">'+
        '<button type="button" class="tel-uyg tel-uygMesaj" data-eylem="telUyg" data-uyg="mesajlar" aria-label="Mesajlar'+(cevap?', cevap bekleyen '+cevap:okunmamis?', okunmamış '+okunmamis:'')+'">'+telSimge('mesajlar',rozet)+'Mesajlar</button>'+
        '<button type="button" class="tel-uyg tel-uygSkor" data-eylem="telUyg" data-uyg="skor">'+telSimge('skor')+'Canlı Skor</button></div>';
  }else if(ekran==='mesajlar'){
    ic='<header class="tel-nav">'+geri('telEv','','Ana ekran')+'</header><h4 class="tel-buyukBaslik">Mesajlar</h4>';
    /* N14 (kullanıcı kararı 2026-10-18): konuşma yoksa liste boş kalır, boş durum yazısı yok (eskiden “Mesaj yok. Telefon sessiz.”) */
    if(L.length)ic+='<ul class="tel-liste">'+L.map(c=>{
      const son=c.mesajlar[c.mesajlar.length-1];
      return'<li><button type="button" class="tel-kisi" data-eylem="telKisi" data-kisi="'+yazT(c.anahtar)+'"><i class="tel-nokta'+(c.okunmamis?' tel-okunmamis':'')+'" aria-hidden="true"></i>'+portreHtml(c.kisi,'tel-portre')+
        '<b>'+yazT(c.ad)+'</b><time>'+(son?yazT(telKisaAn(k,son.tarih,son.dakika)):'')+'</time>'+
        '<span class="tel-onizle"><span>'+yazT(telOnizle(c,s.macta))+'</span>'+(!c.cevapBekliyor&&c.okunmamis?'<i class="tel-rozet">'+c.okunmamis+'</i>':'')+'</span>'+
        (c.cevapBekliyor?'<i class="tel-etiket">Cevap bekliyor</i>':'')+'</button></li>';
    }).join('')+'</ul>';
  }else if(ekran==='konusma'){
    const c=L.find(x=>x.anahtar===T.kisi);
    if(!c)return telefonCiz(k,Object.assign(T,{ekran:'mesajlar'}),s);
    ic='<header class="tel-kisiBas">'+geri('telUyg',' data-uyg="mesajlar"','Mesajlar')+portreHtml(c.kisi,'tel-portre')+'<div><span>'+yazT(c.ad)+'</span><small>'+yazT(c.rol)+'</small></div></header><div class="tel-konusma">';
    let gun=null;
    for(const m of c.mesajlar){
      if(m.tarih!==gun){gun=m.tarih;ic+='<p class="tel-gun">'+yazT(telTarih(k,gun))+'</p>';}
      const yeni=m.yeni||!!(s.yeniler&&s.yeniler.has(m.meseleId+':'+m.sira));
      ic+=m.yon==='not'?'<p class="tel-not">'+yazT(m.metin)+'</p>'
        :'<div class="tel-balon tel-'+m.yon+(yeni?' tel-yeni':'')+'"><p>'+yazT(m.metin)+'</p><small>'+saatYazi(m.dakika)+(yeni?' · yeni':'')+'</small></div>';
    }
    if(!c.mesajlar.length)ic+='<p class="tel-bos">Henüz yazışma yok.</p>';
    /* R2: iki sütunda bekleme, kararlar, dosya bağlantısı ve konular sağdaki iş panelindedir (telefonIsPaneli); telefon yalnız konuşmayı taşır */
    if(!s.ikiSutun){
      /* U3 (envanter 15): beklenen cevabın yaklaşık zamanı */
      if(c.bekleyenCevap!==null&&c.bekleyenCevap!==undefined&&typeof cevapBeklemeYazi==='function')ic+='<p class="tel-not tel-bekleme">Cevap '+yazT(cevapBeklemeYazi(k,c.bekleyenCevap))+'</p>';
      /* bekleyen kararın konusu ve hazır görüş akışın sonunda; iki cevap alttaki sabit alanda (klavyenin yeri) */
      for(const id of c.kararlar){const is=k.isler[id],g=is&&is.veri&&is.veri.karar?kararGorusu(k,is.veri):'';if(g)ic+='<div class="tel-kararOzet">'+g+'</div>';}   /* R2 eki: soru kartın yüzünde */
      for(const mid of c.dosyaKarar)ic+='<p class="tel-not tel-dosya">Bu konuda karar dosyada bekliyor. '+(s.macta?'':'<button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+mid+'" data-donus="telefon">Dosyayı aç ▸</button>')+'</p>';
      /* R2-c: ortak bekleme engeli konuların altında tekrarlanmaz (yukarıdaki tek not söyler); konuya özgü engel kalır. Argümanlı konu (oyuncu) yalnız iki sütunda */
      if(!s.macta)for(const G of c.girisimler.filter(x=>!x.argumanli))ic+='<div class="tel-oneri"><button type="button" data-eylem="girisim" data-girisim="'+G.id+'"'+(G.engel?' disabled':'')+'>'+yazT(G.ad)+' ▸</button><small>'+yazT(telKonuAlti(G))+'</small></div>';
    }
    ic+='</div>';
    /* R2 eki: iki sütunda telefonun altında, klavyenin yerinde “Yeni konu aç”; konu menüsü sağdaki panelde açılır (maçta yok). Bütün konular
       kapalıysa düğme de kapalı, nedeni panelde (bekleme satırı ya da kart) */
    if(s.ikiSutun&&!s.macta&&c.girisimler.length){const kapali=c.girisimler.every(G=>G.engel);
      alt='<div class="tel-yeniKonu"><button type="button" data-eylem="konuMenu" aria-expanded="'+(T.konuMenu&&!kapali?'true':'false')+'"'+(kapali?' disabled':'')+'>'+
        '<i aria-hidden="true">+</i> Yeni konu aç</button></div>';}
    const K=s.ikiSutun?[]:c.kararlar.filter(id=>k.isler[id]);
    /* U2: kartın başlığı kartın üst etiketindedir (işin adı; js/ekran-kart.js), alanın üstünde ayrı satır yok */
    if(K.length)alt='<div class="tel-cevap" aria-label="Cevap">'+K.map(id=>
      kararKarti(k,id,{onizle:(s.onizleler||{})[id]||null,ozetsiz:true,kapali:s.kapali||null,dosyaBaglanti:!s.macta,testSecenek:s.testSecenek,gozAt:!s.macta&&!!s.gozAt})).join('')+'</div>';
  }else if(ekran==='kulup'){
    const Lg=s.lig||telLigVerisi(k);
    ic='<header class="tel-nav">'+geri('skorGeri','','Canlı Skor')+'</header>'+telKulupEkrani(Lg&&Lg.ozet&&T.kulup?Lg.ozet(T.kulup):null,{canli:!!(Lg&&Lg.canli),ad:Lg&&Lg.ad});
  }else if(ekran==='skor'){
    /* S-d: lig sekmeleri; Maçlar varsayılandır ve içeriği eskisiyle aynıdır */
    const Lg=s.lig||telLigVerisi(k),sek=Lg&&(T.skorSekme==='tablo'||T.skorSekme==='fikstur'&&Lg.fikstur)?T.skorSekme:'maclar';
    ic='<header class="tel-nav">'+geri('telEv','','Ana ekran')+'</header><h4 class="tel-buyukBaslik">Canlı Skor</h4>'+(Lg?telLigSekmeleri(T,Lg):'')+'<div class="tel-skor">';
    if(sek==='tablo')ic+=telPuanTablosu(Lg);
    else if(sek==='fikstur')ic+=telFikstur(k,T,Lg);
    else if(M){
      /* H2-b: bizim maç ve santramızdan sonra öbür maçlar dokunulur; ayrıntı yalnız açık satır için (ev sahibi hesaplar: M.ayrinti, d.ayrinti) */
      ic+='<h5>Bugün</h5>'+telMacSatiri({sol:M.kisaDurum||M.durum,canli:!!M.canli,ev:M.ev,orta:M.skor,dep:M.dep,durum:M.durum},telSkorNitelik(T,M.id));
      if(T.skorAc===M.id&&M.ayrinti)ic+=telMacAyrinti(M.ayrinti,M.evKisa,M.depKisa);
      /* F7: haftanın öbür maçları, canlı */
      if(M.digerleri&&M.digerleri.length)ic+=M.digerleri.map(d=>telMacSatiri({sol:d.kisaDurum,canli:d.canli,ev:d.ev,orta:d.skor,dep:d.dep,durum:d.durum},d.dokunur?telSkorNitelik(T,d.macId):'')+
        (T.skorAc===d.macId&&d.ayrinti?telMacAyrinti(d.ayrinti,d.evKisa,d.depKisa):'')).join('');
    }else if(k){
      const mac=bekleyenIsler(k).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
      /* F1-b: takımlar fikstürden (maç günü işinin maç kimliği); eski kayıtta başlıktan */
      const f=mac&&k.fikstur&&k.fikstur.find(x=>x.id===mac.veri.macId);
      if(mac){const [ev,dep]=f?[k.kulupler[f.ev].ad,k.kulupler[f.konuk].ad]:mac.veri.baslik.replace(/^Maç: /,'').split(' – '),bugun=mac.tarih===k.tarih;
        ic+=(bugun?'<h5>Bugün</h5>':'<p class="tel-bos">Bugün maç yok.</p><h5>Sıradaki · '+yazT(telGunAdi(mac.tarih)+' '+gunAyYazi(mac.tarih))+'</h5>')+
          telMacSatiri({sol:saatYazi(mac.dakika),ev,orta:'–',dep:dep||'',durum:'başlamadı'});}
      else ic+='<p class="tel-bos">Yaklaşan maç yok.</p>';
      /* F2: kulübün son oynanan maçı (js/mac-sonuc.js kulubunSonMaci); F7'den beri haftanın öbür sonuçları da */
      const son=typeof kulubunSonMaci==='function'&&k.fikstur?kulubunSonMaci(k,(k.kisiler[k.baskanId]||{}).kulupId):null;
      /* H2-b: o haftanın bütün satırları dokunulur; ayrıntı kayıttan (js/mac-okuma.js macAyrintisi; adlar kariyerin oyuncularından, kısa kayıtta
         beklenen gol kayıttaki değer). Oynanmış son haftanın maçları; daha eski haftalar arasında gezinti yok (kullanıcıya soru, h2-uygulama) */
      const satir=f=>{const s=k.maclar[f.id],ac=T.skorAc===f.id;
        return telMacSatiri({sol:'Bitti',ev:k.kulupler[f.ev].ad,orta:s.skor[0]+' – '+s.skor[1],dep:k.kulupler[f.konuk].ad,durum:'bitti'},telSkorNitelik(T,f.id))+
          (ac&&typeof macAyrintisi==='function'?telMacAyrinti(macAyrintisi(s,id=>(k.oyuncular[id]||{}).ad),k.kulupler[f.ev].kisa||'',k.kulupler[f.konuk].kisa||''):'');};
      if(son)ic+='<h5>Son maç · '+yazT(son.f.hafta+'. hafta')+'</h5>'+satir(son.f);
      /* F7: o haftanın öbür sonuçları (ligin bütün maçları oynanır) */
      if(son){const D=k.fikstur.filter(x=>x.hafta===son.f.hafta&&x.id!==son.f.id&&k.maclar[x.id]);
        if(D.length)ic+='<h5>'+yazT(son.f.hafta+'. haftanın öbür sonuçları')+'</h5>'+D.map(x=>satir(x)).join('');}
    }
    ic+='</div>';
  }
  return'<div class="tel-yer"><div class="tel" data-ekran="'+ekran+'"><div class="tel-ekran" data-ekran="'+ekran+'"'+(ekran==='skor'?' data-sekme="'+yazT(T.skorSekme||'maclar')+'"':'')+'><i class="tel-ada" aria-hidden="true"></i>'+
    '<div class="tel-durum"><b>'+yazT(cubuk)+'</b><span aria-hidden="true"><span class="tel-sinyal"><i></i><i></i><i></i><i></i></span><span class="tel-pil"><i></i></span></span></div>'+
    '<div class="tel-govde'+(s.acilis?' tel-acilis':'')+'">'+ic+'</div>'+alt+
    '<div class="tel-alt"><button type="button" class="tel-ev" data-eylem="telEv" aria-label="Ana ekran" title="Ana ekran (Esc)"></button></div></div></div></div>';
}

/* ---- R2: iş paneli (odada telefonun sağı) ---- */
const TLF_MEVKI={KL:'Kaleci',DEF:'Savunma',OS:'Orta saha',FV:'Forvet'};
const tlfSimdi=(k,is)=>!!is&&(!!is.veri.saatsiz||is.tarih===k.tarih);
/* argümanlı konunun oyuncu seçimi: başkanın kulübünün oyuncuları mevkiye göre (yalnız forma, ad, mevki) */
function tlfOyuncuSecici(k,Gid){
  const biz=(k.kisiler[k.baskanId]||{}).kulupId,L=typeof kulupOyunculari==='function'?kulupOyunculari(k,biz):[];
  const sira=['KL','DEF','OS','FV'];
  return'<div class="tlf-oyuncular" role="group" aria-label="Oyuncu seç"><p class="tlf-not">Hangi oyuncuyu soruyorsun?</p>'+sira.map(m=>{const M=L.filter(p=>p.mevki===m).sort((a,b)=>(a.no|0)-(b.no|0));
    return M.length?'<h6>'+TLF_MEVKI[m]+'</h6><div class="tlf-oyuncuDiz">'+M.map(p=>'<button type="button" data-eylem="girisim" data-girisim="'+yazT(Gid)+'" data-arg="'+yazT(p.id)+'">'+
      '<small>'+(p.no|0)+'</small> '+yazT(p.ad)+'</button>').join('')+'</div>':'';}).join('')+
    '<div><button type="button" class="od-baglanti" data-eylem="oyuncuSecKapat">Vazgeç</button></div></div>';
}
/* R2 eki: konu menüsünün başlıkları (yazışma konusunun isteğe bağlı kategori alanı, js/yazisma.js) → başlık ve simge; bilinmeyen kategori “Diğer” */
const TLF_KATEGORI={mac:['Maç','top'],takim:['Takım','takim'],gorusme:['Görüşme','takvim'],kasa:['Kasa','para']};
function tlfKonuMenusu(k,T,c){
  const G=new Map();for(const x of c.girisimler){const kt=TLF_KATEGORI[x.kategori]?x.kategori:'diger';if(!G.has(kt))G.set(kt,[]);G.get(kt).push(x);}
  const konu=x=>{const ac=x.argumanli&&T.oyuncuSec===x.id&&!x.engel;
    return'<li><button type="button" class="tlf-konu" data-eylem="'+(x.argumanli?'oyuncuSec':'girisim')+'" data-girisim="'+yazT(x.id)+'"'+(x.engel?' disabled':'')+(x.argumanli?' aria-expanded="'+(ac?'true':'false')+'"':'')+'>'+
      '<b>'+yazT(x.ad)+(x.argumanli?' …':' ▸')+'</b><small>'+yazT(telKonuAlti(x))+'</small></button>'+(ac?tlfOyuncuSecici(k,x.id):'')+'</li>';};
  return'<section class="tlf-menu" aria-label="Yeni konu"><h4>Yeni konu</h4>'+[...G].map(([kt,L])=>{const [ad,simge]=TLF_KATEGORI[kt]||['Diğer','nokta'];
    return'<h5 class="tlf-kategori">'+(typeof kartSimgeHtml==='function'?kartSimgeHtml(simge,'tlf-kSimge'):'')+'<span>'+yazT(ad)+'</span></h5><ul class="tlf-konular">'+L.map(konu).join('')+'</ul>';}).join('')+
    '<p><button type="button" class="od-baglanti" data-eylem="konuMenu">Kapat</button></p></section>';
}
/* R2 eki: panel tek iş gösterir — karar varsa yalnız kart (hazır görüş üstünde, dosya bağlantısı altında; bağlam cevabın yüzünde); karar yoksa
   bekleme satırı, açıksa konu menüsü, ikisi de yoksa kısa bir boş durum */
function telefonIsPaneli(k,T,s={}){
  const L=k?konusmaListesi(k):[],c=T.ekran==='konusma'?L.find(x=>x.anahtar===T.kisi):null;
  if(!c)return telBekleyenler(k,L);
  let ic='';
  const bekliyor=c.bekleyenCevap!==null&&c.bekleyenCevap!==undefined;
  /* R2-c: tek bekleme satırı (kişiden cevap beklenirken) */
  if(bekliyor&&typeof cevapBeklemeCumlesi==='function'){const B=cevapBeklemeCumlesi(k,c.ad,c.bekleyenCevap);
    ic+='<p class="tlf-bekleme" role="status"><b>'+yazT(B.baslik)+'</b><span>'+yazT(B.an)+'</span></p>';}
  const K=c.kararlar.filter(id=>{const is=k.isler[id];return!!(is&&is.veri&&is.veri.karar);});
  for(const id of K){const is=k.isler[id];
    ic+='<section class="tlf-karar" aria-label="Karar">'+kararGorusu(k,is.veri)+kararKarti(k,id,{onizle:(s.onizleler||{})[id]||null,ozetsiz:true,dosyaBaglanti:true,testSecenek:s.testSecenek})+'</section>';}
  for(const mid of c.dosyaKarar)ic+='<p class="tlf-not">Bu konuda karar dosyada bekliyor. <button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+mid+'" data-donus="telefon">Dosyayı aç ▸</button></p>';
  if(!K.length&&T.konuMenu&&c.girisimler.length&&!c.girisimler.every(G=>G.engel))ic+=tlfKonuMenusu(k,T,c);
  else if(!K.length&&!c.dosyaKarar.length&&!bekliyor)
    ic+='<p class="tlf-bos">'+(c.girisimler.length?yazT(yonelmeEki(c.ad))+' yazmak için “Yeni konu aç”.':yazT(c.ad)+' ile açık bir iş yok.')+'</p>';
  return'<section class="tlf-is'+(K.length?' tlf-tekKart':'')+'" aria-label="'+yazT(c.ad)+' ile işler">'+ic+'</section>';
}
/* Bekleyenler: konuşma dışındaki telefon ekranlarında. Cevap bekleyen karar (kırmızı), beklenen cevap (mavi halka), yeni mesaj (mavi nokta) */
function telBekleyenler(k,L){
  const satir=(isaret,et,kisi,baslik,alt,ek)=>'<li><button type="button" class="tlf-satir" '+(ek||'data-eylem="telKisi" data-kisi="'+yazT(kisi)+'"')+'><i class="'+isaret+'" aria-hidden="true"></i>'+
    '<span><span class="tel-gizli">'+yazT(et)+': </span><b>'+yazT(baslik)+'</b></span><small>'+yazT(alt)+'</small></button></li>';
  const K=[],C=[],Y=[];
  for(const c of L){
    for(const id of c.kararlar){const is=k.isler[id];if(tlfSimdi(k,is))K.push(satir('tlf-iKarar','Cevabın bekleniyor',c.anahtar,c.ad+' · '+(is.veri.baslik||'Karar'),'Cevabın bekleniyor · en geç '+(is.tarih===k.tarih?'bugün ':gunAyYazi(is.tarih)+' ')+saatYazi(is.dakika)));}
    for(const mid of c.dosyaKarar){const m=k.meseleler[mid];if(m)K.push(satir('tlf-iKarar','Cevabın bekleniyor',null,m.baslik,'Karar dosyada bekliyor','data-eylem="dosyaAc" data-mesele="'+yazT(mid)+'" data-donus="telefon"'));}
    if(c.bekleyenCevap!==null&&c.bekleyenCevap!==undefined&&typeof cevapBeklemeCumlesi==='function'){const B=cevapBeklemeCumlesi(k,c.ad,c.bekleyenCevap);C.push(satir('tlf-iCevap','Cevap bekleniyor',c.anahtar,c.ad,'Cevap bekleniyor · '+B.an));}
    if(c.okunmamis>0)Y.push(satir('tlf-iYeni','Yeni mesaj',c.anahtar,c.ad,c.okunmamis+' yeni mesaj'));
  }
  const blok=(bas,X)=>X.length?'<h5>'+bas+'</h5><ul class="tlf-satirlar">'+X.join('')+'</ul>':'';
  return'<section class="tlf-is tlf-bekleyenler" aria-label="Bekleyenler"><h4>Bekleyenler</h4>'+
    (K.length||C.length||Y.length?blok('Cevabın bekleniyor',K)+blok('Gelecek cevaplar',C)+blok('Yeni mesajlar',Y):'<p class="tlf-bos">Bekleyen bir şey yok.</p>')+'</section>';
}
