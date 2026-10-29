# Borç defteri — bilinen kusurlar, zaman aşımları, kabul edilmiş borçlar ve ertelenen işler

R1-d (2026-10-29) ile açıldı. Tutmayan her kabul satırının ve ertelenen her işin tek kaydıdır; devam notunun eski “Bilinen borçlar” paragrafının yerine geçer. Kaybolmasın diye yazılır, her satır yapılacak iş demek değildir.

**Okuma.** Tür: **kusur** (davranış ya da araç yanlış; düzeltilmeli), **zaman aşımı** (denetim makinenin yükünde ya da gerçek zaman beklemesinde düşer; kod doğru), **kabul edilmiş borç** (kapı dışı, bilerek kabul edildi; gerekçe yazılı), **ertelenen iş** (yapılacak; sahibi tur ya da koşul yazılı), **metni eskimiş** (denetim geçer, metin yanlış). Durum: **açık** ya da **kapandı (tur)**; kapanan satır silinmez.

**Eşleşme.** Son sütunun ters tırnaklı parçaları: ilki kapsam (`oturum` → `node araclar/oturum-sonu.js`, `akis` → `python -X utf8 araclar/akis-deneme.py`), kalanlar düzenli ifade. Oturum kapsamında satır `<senaryo>: <satır>` biçimindedir. Bir senaryo yalnız defterdeki satırlarla düştüyse oturum sonu onu “bilinen” sayar, çıkış kodunu değiştirmez; defterde olmayan satır **YENİ**dir ve çıkış 1 yapar. Akış denemesinde de aynı (okuyucular `araclar/borclar.js` ve `akis-deneme.py` `borc_defteri`). Kalıpta `|` yazılmaz. Satır kapanınca durumu değişir, kalıp eşleşmez olur.

**Bakım.** Her tur kapanışında: yeni kabul dışı satır ya defterde bir satıra bağlanır ya da düzeltilir; “son değer” sütunu güncellenir; kapanan satır “kapandı (tur)” olur.

## Motor kapıları (oturum sonu ve senaryolar)

| No | Konu | Tür | Durum | İlk | Son değer (tur) | Gerekçe ve kapanış koşulu | Eşleşme |
|---|---|---|---|---|---|---|---|
| B01 | `c-orta` “erken · 3–3” satırı kabul dışı | kusur | açık | H1'den önce | kabul dışı (R1) | Z6/orta ailesinin borcu, `main`'de de aynı. Çıkış kodunu değiştirmez (senaryo bilgi satırı). Orta ve bitiriş motor turunda (Z6-2) | `oturum` `^c-orta: ! erken · 3–3` |
| B02 | `c-1v1` eğim 14,0 (kapı 15) | kabul edilmiş borç | açık | Z5 | 14,0 (R1) | 120 denemede 18; küçük örneklemde kapının altında kalıyor. Savunma turu (Z5-2) | `oturum` `^c-1v1: ! \[1\] Kabul \(T4\)` `beceri farkıyla ARTMIYOR` |
| B03 | `d-sut` “Üst köşe ≥18 m kurtarış” NaN | kusur | açık | G1 | NaN (R1) | Önceki turun motoruyla da aynı. 20 ve 25 m'den üst köşe hücresinde kurtarış ve gol 0: yapay şut üreticisi o hedefe çerçeve dışı atıyor olabilir (araç mı motor mu belirsiz; `h3-uygulama.md` H3-0 teşhis notu). Teşhisten sonra hücre ya da motor | `oturum` `^d-sut: ! Üst köşe ≥18 m kurtarış` |
| B04 | `d-topcu` köşe bayrağı yanındaki taçta top toplayıcı teslimi | kusur | açık | Z2 | 254/255 (R1) | Nadir; maçı bitirmiyor, teslim gecikiyor. Duran top sahnesi turunda | `oturum` `^d-topcu: ! Top atana ulaştı` |
| B05 | `d-duran` korner başına gol %5,2–5,3 (kapı %3–5) | kabul edilmiş borç | açık | Z6 | geçti (R1) | Denge sorusu, 80 maçla karar (Z6-2). R1 tabanında kabul satırı düşmedi; değer izlenir | — |
| B06 | `d-sut` “Alt köşe 16 m kurtarış” %92,9 (hedef 35–60) | kusur | açık | G1 | %92,9 (R1) | B03 ile aynı teşhis | `oturum` `^d-sut: ! Alt köşe 16 m kurtarış` |
| B07 | 40 maçın kalibrasyon satırları: dokuz satırda planlayıcının tahmini gerçekleşenden ±5–13 puan uzak (geri çevirme, boşluğa, P <0,5, asma, çizgiden, erken orta, sürülmüş, uzun ileri pas) | kabul edilmiş borç | açık | D | 9 satır (R1) | Bilgi satırları; maç adımının “!” satırları çıkış kodunu değiştirmez. Kalibrasyon ailesinin turunda (`c-orta` ve `p-kalib` tahmin ↔ gerçek kapısı) | — |

## Motor davranışı (kapısı yok; izleme ve denge)

| No | Konu | Tür | Durum | İlk | Son değer (tur) | Gerekçe ve kapanış koşulu | Eşleşme |
|---|---|---|---|---|---|---|---|
| B10 | Motorun `own` bayrağı golün ~%15'ini kendi kalesine sayıyor | kusur | açık | F3 | ~%15 (F3) | Kaleciye ya da savunmacıya değip giren çerçeve şutu. Kayıt F3'te düzeltildi (golcü atanın), ama takım güveni ve gol sevinci hâlâ `own`'dan etkileniyor. Kullanıcının inceleme raporu ayrıca izlenmesini istedi (2026-10-29). Küçük motor turu (İ): sınıflandırma kayıttaki kurala hizalanır, `--ayni` beklenmez | — |
| B11 | Uzaklaştırmanın blok riski: planlanan %11 ↔ gerçekleşen %23; U2'de ilk dokunan biz %37 | kusur | açık | D | %11 ↔ %23 | Planlayıcı iyimser. Uzaklaştırma ailesinde | — |
| B12 | `p-tip` forvet çifti TVD 0,07–0,18 | kabul edilmiş borç | açık | C | 0,07–0,18 | Dört çiftin üçü geçer, kanat şart (C kapısı) | — |
| B13 | Gol −0,45 ve korner −1,3 maç başına | ertelenen iş | açık | D | — | Denge sorusu: 80 maçla karar | — |
| B14 | Güç–hata çarpanının oyuncunun tavanına ölçeklenmesi | ertelenen iş | açık | C | — | Seviye farkının büyüklüğü izlemeye bağlı (C sorusu 1) | — |
| B15 | Alçak havadan kısa pas ve kaleciye geri pas kapalı | ertelenen iş | açık | D | kapalı | Risk değeri ölçü tutmadı (karar 28) | — |
| B16 | `b-olcum` V1a/V1b bilgi satırlarının budanması, `kvBekle`'nin kaldırılması | ertelenen iş | açık | D | — | Temizlik | — |
| B17 | Hocanın maç içi kararı yok (`m.hoca` kapısı; tarz vektörü varken taban yamasının dört alanı etkisiz) | ertelenen iş | açık | F3 | — | Z7-2 | — |
| B18 | Tedavi duruşu ~1,65 / maç (karar 13 hedefi ~1) | kabul edilmiş borç | açık | G1 | ~1,65 | Sakatlık ölçeği G1'de kadro yeterliliği için seçildi | — |
| B19 | Kariyer maçlarında maç başına gol ~3,6 (MAC_KADRO tabanında 2,88) | ertelenen iş | açık | F6-a | ~3,6 (S) | Üretilen kadroların etkisi; izlemede, denge kararı 80 maçla | — |
| B20 | Motor dosyalarının katı kibi (`mac-motoru`, `mac-karar`, `mac-kurallar`, `mac-dizilis`, `mac-takim`, `mac-oncesi`, `mac-senaryo`, `kadrolar`, `hareket-egrileri`) | ertelenen iş | açık | R1 | gevşek | Küçük motor işi: `--ayni` 40 maç ve hız ölçümüyle (`araclar/dosya-gruplari.js` izin listesi) | — |

## Tarayıcı ile Node, maç girdisi

| No | Konu | Tür | Durum | İlk | Son değer (tur) | Gerekçe ve kapanış koşulu | Eşleşme |
|---|---|---|---|---|---|---|---|
| B30 | `sezon-deneme`'nin maçı tarayıcıdakiyle birebir değil: stat alanları Node'da yok, santra anı farklı (Node ilk adımda, tarayıcı maç öncesi sonunda); öbür maçlar stat alanı olmadan oynar (zemin kuru, atmosfer yok) | ertelenen iş | açık | F3, F7 | — | Ortak, çizimden bağımsız maç girdisi sözleşmesi (kullanıcının inceleme raporu, madde 7). Motor tabanını değiştirir; tek sezon hedefinden sonra | — |
| B31 | Electron'da Web Worker denenmedi | ertelenen iş | açık | G1 | — | Masaüstü denemesinde | — |
| B32 | “Maçı bitir” işçiler bitmeden basılırsa sonuç ana iplikte ~17 sn; `file://` açılışında önden hesap yok (dosyadan ~10–12 sn, Odaya dön ~40–45 sn) | kabul edilmiş borç | açık | H2-a | ~17 sn | Seçenek: bülten ve maç öncesi boyunca dilimli ikiz | — |
| B33 | Hızlı bitirme sekiz maçla ~8 kat uzun | kabul edilmiş borç | açık | F7 | ~8× | İşçili yolda görünmez | — |

## Akış denemesi ve ekran

| No | Konu | Tür | Durum | İlk | Son değer (tur) | Gerekçe ve kapanış koşulu | Eşleşme |
|---|---|---|---|---|---|---|---|
| B40 | 15b: TEST loca bakışında kulübenin 1/15 noktası masanın arkasında (K1i) | kabul edilmiş borç | açık | K1 | 1/15 (U) | Loca bakışı TEST'tir; F5 antrenman ve figür turunda | `akis` `K1i: kulübenin önündeki 15 noktanın` |
| B41 | 15b tam koşuda “Maça geç”ten sonra santrayı 60 sn bekleyemiyor | zaman aşımı | açık | H1 | düştü (U, masaüstü) | Tek başına koşunca geçiyor; yükten | — |
| B42 | Dizüstünde 11, 12, 14, 14b, 15, 15b ve 16'nın gerçek zaman beklemeleri | zaman aşımı | açık | T5 | düştü (U, dizüstü) | i7-8565U yavaş; tam akış denemesi masaüstünde (bellek: iki makine) | — |
| B43 | 21. bölümde “kayıt sürümü 10” yazıyordu, ölçülen 11 (devam notunda 19b denmişti) | metni eskimiş | kapandı (R1) | S | — | Denetim artık `KARIYER_SURUM`'u okur | — |
| B44 | H2-e incelemesinin altı küçük ekran düzeltmesi otomatik denetimsiz: gözlemde rozet, maç telefonunda kaydırma, bekleme satırı, telefon açıkken Maçı bitir, maçta önizleme, görünmez metinler | ertelenen iş | açık | H2 | — | `h2-uygulama.md` H2-e; telefona dokunan R2'de denetim eklenir | — |
| B45 | Ekran ve çizim dosyalarının katı kibi | ertelenen iş | açık | R1 | gevşek | Kariyere yazmazlar; tarayıcı denetimiyle ayrı iş (`araclar/dosya-gruplari.js` izin listesi) | — |
| B46 | Akış 19 kariyer maçında koşar, orada H2-a'dan beri rakip başkan yok; karar anlı yol 14b ve `akis-2d`'de TEST adresiyle | kabul edilmiş borç | açık | H2-a | — | Rakip başkan içerikle döner | — |

## Kariyer, ekonomi ve kayıt

| No | Konu | Tür | Durum | İlk | Son değer (tur) | Gerekçe ve kapanış koşulu | Eşleşme |
|---|---|---|---|---|---|---|---|
| B50 | Maaş gizli kabiliyetten gürültüsüz türüyor; Kadro sekmesinde maaşa göre sıralamak gizli puanı sızdırır (karar 3) | kusur | açık | G2 | — | Kullanıcının inceleme raporu (madde 9). R6: maaş yaşa, kıdeme, sözleşme anına ve gürültüye bağlanır | — |
| B51 | Kayıt büyümesi: sezon sonunda ~500 KB, rapor kayıtları sezonda ~15 KB; arşiv, sıkıştırma ve IndexedDB ölçümü yok | ertelenen iş | açık | F7 | ~506 KB (S) | H3 (yeni sezon) ile; tek sezonda localStorage sınırının (~5 MB) çok altında | — |
| B52 | Hocanın görüşme önerisi hafta içi 15:00 olabilir, antrenman 15:00–17:00 | kusur | açık | U3 | — | TEST tutarsızlığı; bizim önerdiğimiz an antrenmanı dışlar. R2 (telefon) | — |
| B53 | Canlı Skor'da gol bildirimi yok | ertelenen iş | açık | F7 | — | R3 | — |
| B54 | G2 iskeletinin eksikleri: pazarlık, karşı teklif, menajer, sızıntı, AI kulüpler arası transfer, yaz dönemi, öbür kulüplerin kasası; serbest oyuncu yalnız bizim imzamızla kulüp bulur | ertelenen iş | açık | G2 | — | R4 (transfer alımı zinciri, pazarlık) ve R6; yaz dönemi H3 | — |
| B55 | Ekonomi tutarları TEST (maaş ölçeği, bilet, lig payı, tazminat, bonservis); doluluk sabit 0,3 | kabul edilmiş borç | açık | G2 | — | Kullanıcı değiştirir (`SOZLESME_TEST`, `MALI_TEST`, `TRANSFER_TEST`, `MALI_RAPOR_TEST`); değişen doluluk ve sponsor 5.5 | — |
| B56 | P12'nin sınırları: hocanın takıma oturma süresi yok, baskının kaynağı yalnız sonuç, sabır süresinde sözü bozacak yol yok, tazminat sabit | ertelenen iş | açık | F6-a | — | R6 (personel şablonu) | — |
| B57 | Kaleci güvencesiyle kadro bir süre 22'yi aşabilir; çift hükmen 0–0 | kabul edilmiş borç | açık | G1, G2 | — | TEST kuralı | — |
| B58 | Üretilen kulüplerin hepsi deplasman formasında, statları TEST | kabul edilmiş borç | açık | F1 | — | Kulüp kimlikleri kullanıcıdan; görsel tur | — |
