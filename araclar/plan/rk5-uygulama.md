# RK5 — Ekranların yeni arayüz diline geçişi (uygulama planı, 2026-11-01; onaylı: kullanıcı “Onayla, başla”, §6'daki dört soru varsayılanla)

Karar 83 (kullanıcı: “Önerdiğin karışım”): iskelet ve yoğun ekranlar **Kırtasiye** (v1), belge niteliğindeki kâğıtlar **Kulüp evrakı 1999** (v2); ortak taban ve ölçüler STIL_REHBERI §7 “Arayüz dili”, taslaklar `araclar/taslak/rk/` (DIL.md, png/). Bu plan RK program §5 RK5'in (iki dilim) bu karara göre kesinleşmiş hâlidir. Kural dosyalarına yalnız iki küçük okuma işlevi ve bir isteğe bağlı kayıt alanı girer; motor ve maç değişmez.

## 0. Bir bakışta

| Dilim | Dal | Oyunda | Tahmin |
|---|---|---|---|
| **RK5-a iskelet, simgeler, belge kâğıtları** | `claude/rk5a-iskelet` (main'den) | Odak kabı ince ve aydınlık (kalın kırmızı çerçeve yok, perde hafif, başlık ve Kapat kâğıdın üstünde); 16 piksellik simgeler masa şeridinde, sekmelerde, telefon konularında, haber ve rapor satırlarında; mali rapor resmî yazı (antet, Sayı, Konu, üç büyük rakam, 90 günün seyri, zebralı hareket tablosu, paraf, ALINDI); dosya manila karton; gazete manşeti serif; yazı ölçeği (gövde 16) | ~8 sa |
| **RK5-b sicil fişi, transfer panosu, gün başı notu, yoğun ekranlar** | `claude/rk5b-belgeler` (a'dan) | Kulübün oyuncu dosyasında sicil fişi (ataşlı fotoğraf, daktilo alanlar, LİSANSLI mührü, notlar sarı kâğıtta; Canlı Skor ve transfer listesinde kart düz kalır); transfer mantar pano (iğneli kartlar, menajer önerileri teleks şeridi); 08:00'de masada sarı gün başı notu (rozetli; tuş 8); kadro, Canlı Skor, telefon, defter ve ayarlarda Kırtasiye ölçüleri | ~8 sa |

İki dilim birlikte büyük kapıdan sonra `main`'e (karar 63; `main`'e alma yine kullanıcının sözüyle).

## 1. Claude'un kararları (itiraz serbest)

1. **Zamanın eylemleri alt şeritte kalır.** İlerle, Katıl / Ertele, Stada git, İzle düğmeleri zamanı ilerletir; masanın değil günün işidir, alt şeritte kalır (oyuncunun kas hafızası ve U4 kararları). **Kâğıdın kendi eylemleri** (dosyada cevap, raporda “Müdüre sor”, sicil fişinde “Hocaya sor”, transferde “Hocaya araştırt”) kâğıdın alt kenarına iner. DIL kuralı 3 bu ayrımla uygulanır.
2. **Dosya manila karton olur.** Odak kabındaki dosya kalın kırmızı kapak yerine manila (kraft) karton, ince koyu kenar ve kırmızı sırt etiketi; masadaki 3B dosya da manila (tek malzeme rengi, `STIL.oda`). Gerekçe: “kalın kırmızı çerçeve yok” kuralı ve nesne dili (dosya = manila, damga). Kırmızı kalır: dosya sırtı, damgalar, kulüp kimliği.
3. **Odak kabı:** perde %22 karartma ve 6 px bulanık (bugün %33, 7 px); başlık kabın üstünde ortada değil kâğıdın sol üstünde (küçük büyük harf üst satır + başlık), Kapat × kâğıdın sağ üst köşesinde; telefon ve dosya kendi nesneleriyle (kâğıtsız) aynı başlık satırını taşır. ‹ Geri kâğıdın sol üstünde, başlığın yanında.
4. **Simge seti oyuna girer:** `js/simge.js` (görüntü; taslaktaki `simge.js`'in oyun hâli), 16×16 1-bit, mürekkep rengi, hep kelimeyle. Masa şeridi: Telefon, Ajanda (defter), Dosya, Gazete, Transfer, Not (yeni), TV, Ayarlar. Konular: Takım, Görüşme, Transfer, Kasa, Maç. Haber türleri: maç, sakatlık, transfer, program, erteleme. Rapor kalemleri ve dosya sekmeleri. Damgalar yalnız durum.
5. **Mali rapor resmî yazıdır (v2):** Sayı (yıl/ay-sıra), tarih, Konu, “BAŞKANLIK MAKAMINA”, iki cümlelik TEST metin, üç büyük rakam (Kasada bugün + önceki rapora göre değişim oku, 90 günde en düşük + tarihi, 90 gün sonra), 90 günün seyri (tek çizgi; rapordaki ödeme takviminden, en düşük nokta kırmızı), etiket–değer (maaş yükü, bekleyen gelir “bilet tahmini, kesin değil”, bekleyen gider), aylık raporda hareketler tablosu (Tarih · Açıklama · Giriş · Çıkış, ay toplamı, zebra, eşit genişlikli rakam), “Bilgilerinize arz ederim.”, paraf (kodla çizilmiş eğri), müdürün adı ve unvanı, ALINDI mührü (raporun açıldığı gün). Haftalık özet aynı belgenin kısa hâli (tablosuz). Kuruş yok: metinde “4,82 milyon ₺”, tabloda tam rakam.
6. **Sicil fişi yalnız kulüp bağlamında:** `oyuncuKarti` tek bileşen kalır; `baglam:'kulup'` görünüşü sicil fişidir (v2), `kamu` ve `transfer` düz kart (v1). Sicil fişinde alanlar daktilo (Plex Mono): Adı, Forma, Mevki, Doğum (yaş), Boy, Ayak, Kulübü, Sözleşme; fotoğraf ataşlı (yüz 3×), LİSANSLI mührü; “Bu sezon” ve son beş maç fişin altında; notlar sarı not kâğıdında, kaynak şeritleri kalır.
7. **Transfer mantar panodur (v2):** masanın zemini mantar (kodla nokta dokusu), kenarı ahşap; dönem sayacı ve sekmeler kâğıt şeritte; Pano'da açık işler iğneli dosya kartları, menajer önerileri **teleks şeridi** (daktilo, büyük harf; satırlar oyuncuya dokunulur, “Listeye al” yanında), listedekiler iğneli kart; Liste mevki başlıklarıyla iğneli kartlar; Ara kâğıt üstünde düz (v1; arama kutusu ve çipler aynen); Geçmiş kâğıt.
8. **Gün başı notu (yeni, v2 sarı bloknot):** her gün 08:00'de masada sarı not (3B: masanın sol önünde küçük sarı kâğıt, `ODA.gunNotu`; rozet “yeni”); tıkla, Not düğmesi ya da **8**. İçerik okumadır, zaman almaz: son maçımız (dün ya da en son; skor, sıra, öne çıkan) · bugünün ajandası (saat ve iş) · cevap bekleyenler (Sonra yığını; sınıf ve kalan gün) · kasa tek rakam ve 90 günde en düşük · gazetenin manşeti. Alt kenarda “Defteri aç” ve “Güne başla” (notu masaya bırakır, rozet söner). Kendiliğinden açılmaz (karar 83). Okunduğu gün kayıtta (`k.notOkunan`, isteğe bağlı alan; kayıt sürümü değişmez, takipOkunan kalıbı). Asistanın adı TEST (bugünkü kişi yoksa “Özel kalem”).
9. **Yazı ve ölçü:** gövdenin piksel tabanı `STIL.kagit.yaziTaban` 14 → 16, büyük yazı 16 → 18 (geniş karede oran `yaziBoyu` aynı ölçüde büyür; en küçük yazı 12 kalır); IBM Plex Serif Google Fonts bağlantısına eklenir (v2 başlıkları, gazete manşeti), Plex Mono v2 rakam alanlarında; Jersey 10 yalnız cihaz göstergelerinde (saat, skorbord, forma numarası, TV). Okunurluk aracının eşiği 14 → 15 px gövde (yeni taban; dar karede taşma denetimi aynı).
10. **Gazete:** künye ve manşet Plex Serif (piksel yazı kalkar), sütunlar ve kutular aynı; eski sayı sararır (var).

## 2. RK5-a — kesin kapsam

- **İskelet:** `js/ekran-odak.js` (başlık satırı kâğıdın içinde; perde; ince kenar), `STIL.kagit.odak` (karartma, bulanık, kenar), `index.html` (genel kâğıt ve düğme CSS'i; yazı tabanı), `js/sunum-durumu.js` `yaziBoyuUygula` (16 px tabanı).
- **Simgeler:** `js/simge.js` (yeni, görüntü; `simgeSvg`, 16'lık 1-bit ızgara), `js/ekran-kart.js` `kartSimgeHtml` yeni sete bağlanır (bugün 24'lük çizgi simgeler `KART_SIMGE_CIZ`; kart yüzü, telefon konuları ve Canlı Skor özeti aynı setten okur, eksik ad yedek çizgiye düşer), `js/ekran-oda.js` masa şeridi `dugme()`, `js/ekran-tv.js` ve `js/ekran-canli.js` haber satırları, `js/ekran-dosya.js` sekmeler.
- **Dosya manila:** `js/ekran-dosya.js` (`dosyaStili`: kapak, sırt etiketi, sayfa), `STIL.kagit.dosya` (renkler), 3B `js/oda.js` dosya nesnesinin rengi (`STIL.oda`).
- **Mali rapor v2:** `js/mali-rapor.js` iki saf okuma işlevi: `maliRaporSeyri(h)` (raporun anındaki kasa + ödeme takviminden haftalık noktalar; yeni kayıt alanı yok) ve `maliRaporOnceki(k, h)` (aynı türün bir önceki raporu; değişim). `js/ekran-dosya.js` rapor sayfası (antet, resmî yazı, üç rakam, seyir SVG, etiket–değer, tablo, paraf, mühür; dar karede tek sütun).
- **Gazete:** `js/ekran-gazete.js` künye ve manşet yazı ailesi.
- **Belgeler:** STIL_REHBERI §7 (uygulanan: iskelet, simge, dosya, mali rapor, gazete), §2 (renk disiplini), TEKNIK_PLAN (simge.js görüntü katmanı), YOL_HARITASI karar ve devam notu, CLAUDE.md “Bugün çalışan”.
- **Kabul:** her işte başlık ve Kapat kâğıdın üstünde, kalın kırmızı çerçeve yok; masa şeridinde ve sekmelerde simge + kelime; mali raporda üç rakam, seyir, tablo ve imza (aylıkta), kuruşsuz metin; gazete manşeti serif; Esc zinciri, tuşlar, odak geçişi, komut sayıları aynen; `okunurluk.py` bütün sahneler (yeni taban 15 px), `akis-deneme` 1 3 21 22 25 26 27 30 32 39 (beklentiler görünüşe göre güncellenir, akışa göre değil), `kontrol.py`, `hizli.js`, `kariyer-deneme` (iki okuma işlevi saf ve belirlenimci).

## 3. RK5-b — kesin kapsam

- **Sicil fişi:** `js/oyuncu-karti.js` (`baglam:'kulup'` kabuğu; alanlar, ataş, mühür, sarı not), `js/ekran-dosya.js` oyuncu dosyası yerleşimi; Canlı Skor ve transfer düz kart (değişmez).
- **Transfer panosu:** `js/ekran-transfer.js` (mantar zemin, iğneli kart sınıfları, teleks şeridi; seçiciler `.tm-*` korunur), `STIL.kagit.transfer` (yeni renkler).
- **Gün başı notu:** kural `js/gun-notu.js` (yeni, saf okuma: `gunNotu(k)` → {sonMac, ajanda, bekleyen, kasa, manset}; `notOkundu(k)` komutu; `k.notOkunan` doğrulaması), görüntü `js/ekran-not.js` (yeni; sarı bloknot) ve `js/ekran-oda.js` (masa şeridinde Not, tuş 8, rozet, odak `not`), 3B `js/oda.js` (`ODA.gunNotu` küçük sarı kâğıt, nesne tıklaması), `index.html` yükleme sırası, `araclar/dosya-gruplari.js`.
- **Yoğun ekranlar v1 ölçüleri:** `js/ekran-dosya.js` kadro tablosu (zebra, eşit genişlikli rakam, başlık altı çizgi), `js/ekran-canli.js` / `js/canli-skor.js` görünüşü (cihaz içinde; yazı ve satır ölçüleri), `js/ekran-telefon.js` (iş paneli kâğıdı ince kenar), `js/ekran-defter.js` (tabular saatler, 16 px), ayarlar.
- **Belgeler:** STIL_REHBERI §7 (sicil fişi, mantar pano, gün başı notu), OYUN_TASARIMI §2 (Not nesnesi ve tuş 8; masa gelen kutusu kuralı korunur) ve §6 (günün başı), TEKNIK_PLAN §6 (`k.notOkunan`), YOL_HARITASI, CLAUDE.md.
- **Kabul:** dosyada oyuncu sicil fişi, Canlı Skor'da düz kart (yasak kelimeler yok); transfer mantar pano, teleks satırından oyuncu kâğıdı ve Listeye al çalışır; 08:00'de Not rozeti, 8 açar, Güne başla bırakır ve rozet söner, kaydet–yükle sonrası okunmuş kalır, zaman ilerlemez; `kariyer-deneme` (gün notu belirlenimci, okundu komutu ve doğrulama), `akis-deneme` tamamı (yeni §40 gün başı notu), `okunurluk.py` (yeni sahneler `not`, `transfer-pano` v2, `oyuncu-dosyasi` v2), `kontrol.py`, sezon tabanları `--ayni` (kural dosyası eklendiği için), büyük kapı.

## 4. Yapılmayacaklar

Odanın 3B yenilemesi (görsel tur; yalnız dosyanın rengi ve gün notunun küçük kâğıdı), ses, el yazısı yazı ailesi (defter bugünkü yazıyla kalır), koyu tema, tuşların yerinin değişmesi, maç ekranları (bülten, köşe skoru, maç sonu kartı RK5 dışı; yalnız yazı tabanından etkilenir), oyun kuralı.

## 5. Riskler

- **Akış ve okunurluk beklentileri** görünüşe bağlı seçicilerde değişir (başlık satırı kâğıdın içine iner): seçiciler takma adla korunur (`.odk-ust`, `.od-kapat`, `.odk-geri` aynı sınıflarla yeni yerde).
- **Yazı tabanı 14 → 16** dar karede taşma yaratabilir: `okunurluk.py` 640 ve 800 px'te sınar; taşan yerde satır yüksekliği ya da dar kare kuralı düzeltilir, yazı küçültülmez.
- **Mantar doku** okunurluğu düşürebilir: kart ve kâğıt zeminleri düz, doku yalnız aralarda (taslakta ölçüldü).
- **Gün notu yeni nesne:** masa nesne sayısı sabit kuralı (U) — Not, gazetenin yanına küçük kâğıt; şeritte bir düğme artar.

## 6. Kullanıcıya sorular (cevap gelmezse varsayılan)

1. Zamanın eylemleri (İlerle, Katıl/Ertele, Stada git) alt şeritte kalsın, kâğıdın kendi eylemleri kâğıda insin — *evet* (§1.1).
2. Dosya manila karton olsun (masadaki 3B dosya da) — *evet* (§1.2); alternatif: kırmızı kalsın, çerçevesi incelsin.
3. Gün başı notu için tuş **8** ve masada küçük sarı kâğıt — *evet* (§1.8).
4. Gövde yazısı 16 px'e çıksın (bugün 14) — *evet* (§1.9).

## 7. Durum

**RK5-a (dal `claude/rk5a-iskelet`, 2026-11-01):** uygulandı; denetimler aşağıda. Plandan sapmalar ve eklemeler (Claude kararı, gerekçeli):

- **Yazı tabanı:** normal 14 → 16 px; büyük yazı 16 → **17** (18 değil): 640 piksellik karede telefonun iş panelindeki kart büyük yazıda 18 ile kaydırmadan görünmüyordu (akış §3, R2'de kapanan B47 ve B48'in ölçüsü). Geniş karede oran (`yaziBoyu` 1,5 / 1,8 cqw) değişmedi: ~1070 piksellik kareden geniş pencerede gövde zaten 16'nın üstünde. Okunurluk eşiği gövde ≥ 15 px.
- **Alt şerit tek satır (DIL kural 1):** odak açıkken şeritte son mesaj varsa yalnız o, yoksa yardım cümlesi yalnız oturumun ilk üç açılışında. Dar karede (< 820 px) odak kabı alt şeridin ölçülen yüksekliğinin hemen üstüne iner (`--od-alt`; masa şeridi zaten perdenin altında).
- **90 günün seyri kayıttaki gerçek noktalardan:** raporun kaydında yalnız sayılar var (rapor anı, en düşük ve tarihi, 90 gün sonrası); ara hareketler saklanmıyor. Çizgi bu üç noktayı birleştirir, noktalar altında yazıyla; kayda alan eklenmedi (`maliRaporSeyri`).
- **Eklemeler:** rapor yazısının altında kâğıdın kendi eylemi “Müdüre sor: Kasa ne durumda? ▸” (telefondaki konu); odak halkası kırmızıdan mürekkep mavisine (renk disiplini); kartın damgası, dosyanın konu damgası daktilo kalın çift çizgi (piksel yazı yalnız cihaz göstergelerinde); TV 100 ve telefonun Takip listesinde haber türünün simgesi (`haberSimgesi`); üst çubukta kulüp ve başkan adı dar karede tek satır, üç noktayla.
- **Ayarlar üst çubukta (DIL kural 1):** okunurluk ölçüsünde 640 piksellik karede masa şeridi (simge + kelime) sığmıyordu; Ayarlar masa nesnesi olmadığı için Duraklat'ın yanına geçti, dar karede şeritte simgeler gizlenir (kelime kalır), “Kaydedildi” dar karede yalnız uyarıda.
- **Simge seti:** taslağın 22 simgesine oyunun ihtiyacı olan 11'i eklendi (ayar, belge, arşiv, değişiklik, devir, konum, kapı, kişi, kar, kurum, nokta); kartın ve telefon konusunun eski 24'lük çizgi simgeleri bu sete bağlandı (`SIMGE_KART`).

**RK5-b (dal `claude/rk5b-belgeler`, 2026-11-01):** uygulandı; denetimler aşağıda. Plandan sapmalar ve eklemeler:

- **Gün başı notu:** kural `js/gun-notu.js` (`gunNotu`, `sonraKararlari`, `notYeni`, `notOkundu`, `notDogrula`), görünüm `js/ekran-not.js`; asistanın adı yerine “Özel kalem” (yeni kişi eklenmedi; plan §1.8'in “bugünkü kişi yoksa” yolu). Kayıt alanı `k.notOkunan` (plandaki `notOkunan` adı; isteğe bağlı). Masadaki “Sonra” yığını da aynı kural işlevini okur (tek kaynak). 3B sarı not masanın sağ önünde, dosyanın önünde.
- **Sicil fişi:** kat satırı “Futbolcu sicil fişi” (eski “Oyuncu dosyası” satırının yeri; TEST kutusu yanında); alanlar fiş darsa tek, genişse iki sütun (adlı kap sorgusu `ok-sicil`; `.ok-alanlar` aynı zamanda `.dsy-kunye` olduğu için kurallar fişe bağlı). Mühür alanların altında, sağda (alanların üstüne binmez).
- **Kadro tablosu:** dar karede (< 820 px) en az 52 em (RK4-b'den beri yüz ve Boy sütunuyla ad görünmüyordu); liste kendi sayfasında yatay kayar.
- **Kategori simgesi:** “Mali” (TEST içeriği) kasa simgesiyle.
- **Büyük kapıda bulunanlar (düzeltildi):** büyük yazıda 640 piksellik karede Canlı Skor maç sayfası 2–3 px taşıyordu (sekme satırının en küçük genişliği; sayfanın sütunu `minmax(0,1fr)`, sekmeler sığmazsa ikinci satır); üst çubukta sağ grup (tarih, Ayarlar, Duraklat) daralmaz, soldaki ad üç noktayla kısalır. Akış §28 (iki pencere): §27'den sonra ikinci pencerenin yüklenmesi bu makinede 20–30 sn (önceki sürümde de 21–29,5 sn; ilk pencerenin 3B çizimi yazılım GPU'sunu tutar) — gezinme DOM hazır olunca biter, odanın hazırlığı 60 sn yoklanır (yalnız deneme aracı).

**`main`'e alındı (2026-11-01, kullanıcı: “Evet, main'e al”):** RK5-a ve RK5-b büyük kapıdan sonra birlikte; ayrıntı YOL_HARITASI devam notu.
