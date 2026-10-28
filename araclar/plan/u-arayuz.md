# U — Arayüz turu: odak modeli (tur planı, 2026-10-28)

Durum: **tur planı; kullanıcı onayı bekliyor.** Kod değişmedi. Çerçeve kullanıcı kararıdır (2026-10-28, "Evet, bu çerçeve"): odak modeli ve [u-arastirma.md](u-arastirma.md) §7'deki dokuz tercih. Tespitler, araştırma ve 34 maddelik envanter o belgededir; bu dosya yalnız uygulama planıdır. Planın ayrıntıları kodun altı alanlık haritasından çıktı (dosya:satır kanıtlı; bu oturumun çalışma kaydı).

Dal `claude/u-arayuz`, kapanışta etiket `tur/u-arayuz`; `main`'e alma ve push kullanıcının sözüyle. Onaylanınca YOL_HARITASI'na karar 55 olarak yazılır (karar 49'un arayüz yapısı yarısı öne alınır; 3B oda, stat ve tarz kararı 46 kapalı kalır).

## 1. Odak modeli: uygulama sözleşmesi

- **Üç katman.** Masa (oda) → İş (tek iş ortada büyük) → Göz atma (işin yanında okuma). En çok iki derinlik; göz atmanın içinden yeni iş açılmaz, içinde eylem yoktur.
- **Tek kap.** Telefon, dosya, defter, gazete, ayarlar, karar paneli ve kadro (TEST) aynı odak kabında açılır: başlık çubuğu (solda ‹ Geri, ortada başlık, sağda Kapat ×; dosyada sekmeler ortada), kâğıt, altta bugünkü eylem şeridi. Boylar: geniş %78 (dosya, defter, gazete), orta %60 (karar), küçük %50 (ayarlar), cihaz (telefon, karenin boyunun ~%88'i).
- **Arka plan.** Oda statik 7 px bulanık ve %33 karartılmış; bulanıklık hiç canlandırılmaz, yalnız perdenin opaklığı 150 ms'de gelir. Düşük cihazda ve "saydamlığı azalt" tercihinde yalnız %50 karartma. Odak açıkken 3B döngü tek kareye iner (bültendeki kalıp), kamera kıpırdamaz.
- **Geçişler.** Kâğıt 220 ms'de belirir (opaklık + 0,96→1 ölçek, nesnenin yerinden), 160 ms'de kapanır. "Hareketi azalt" tercihinde yalnız 150 ms opaklık. Her ekran aynı dili kullanır; ekran başına ayrı animasyon yok.
- **Esc tek zincir.** Önizleme → onay adımı → göz atma → işin iç geri adımı → kaynak (Ajanda) → masaya bırak. ‹ Geri aynı zinciri yürür ve etiketi hedefin adıdır (‹ Mesajlar, ‹ Canlı Skor, ‹ Kadro, ‹ Ajanda). Kapat × doğrudan masaya bırakır. Bülten, maç sonu ve "Maç hesaplanıyor"da Esc bilerek yoktur.
- **Odakta İlerle görünmez.** Zaman masadan ilerler; odakta okurken zaman zaten durur.
- **Masaya bırakmak ertelemektir.** Ertelenen karar kaybolmaz: masada "Sonra" yığını en çok üç kâğıt gösterir, bağlı olduğu durakta en üste döner. Üçüncü düğme yok.
- **İş kendi bağlamını getirir.** Kartın yüzünde tek satırlık bağlam şeridi: randevu önerisinde o günün defter şeridi, para kararında kasa ve 90 günlük en düşük bakiye, sözleşmede oyuncu künyesi. Bağlam yalnız okumadır; ayrıntı göz atmadadır.
- **Balkonda yarım odak.** Perde yok, antrenman canlı, kâğıt sağ yarıda.

## 2. Alt turlar

Sıra kullanıcının en çok istediğini öne alır: önce okunurluk ve test zemini, sonra odak kabı, hemen ardından telefon ve kart. Her alt tur oyunda görülebilir bir fark bırakır ve tek başına doğrulanır. Süreler masaüstü içindir; dizüstünde denetimler uzar.

| Alt tur | Oyunda ne görürsün | Kapsam (envanter maddesi) | Dosyalar | Süre |
|---|---|---|---|---|
| **U0 Zemin** | Yazı her yerde aynı ölçekte ve okunur; gövde orantılı yazı; amber yalnız ana düğmede | Tek ölçek 1,5/1,8 cqw ve büyük yazı her yerde (7); IBM Plex Sans, Jersey yalnız büyük başlıkta (12); renk değişkenleri ve amber diyeti (11, değişken kısmı); ölü CSS, tanımsız değişkenler, çift tanımlar (19); yazı tipleri masaüstü kopyasına yerel; deneme yardımcıları | `index.html`, `js/stil-99.js`, ekran betiklerinin CSS'i, `masaustu/`, `araclar/akis-deneme.py` | 5–6 sa |
| **U1 Odak kabı** | Bir nesneye dokununca oda bulanır, iş ortada büyür; Geri ve Kapat hep aynı yerde; Esc hep bir adım geri | §1'in kab, arka plan, geçiş ve Esc kuralları (1, 6); dosya ve defter kâğıdı doldurur; odakta İlerle gizli; 3B tek kare | yeni `js/ekran-odak.js`, `js/ekran-oda.js`, `js/ekran-dosya.js`, `js/ekran-defter.js`, `js/arayuz.js` | 8–10 sa |
| **U2 Telefon ve kart** | Telefon ortada büyük; kart sürüklenince hiç kırpılmaz, cevabın adı kartın üstünde belirir, bırakınca damga basılır | Kart: yaylı sınırlı kayma (eşik yine işaretçide), üst etiket, üç yüz aynı hücrede (kenarlar kıpırdamaz), dar kap kuralı, damga, metin tavanı ve ikinci görüş yeri (3, 13, 29); telefon: uygulama başlık çubuğu, Geri çakışması, Esc = Geri, büyük yazı (8); maç telefonu ve karar anı aynı bileşen, telefon açıkken "Duraklatıldı" gizli (18) | `js/ekran-kart.js`, `js/ekran-telefon.js`, `js/ekran-mac-telefon.js`, `js/ekran-an.js`, `js/stil-99.js` | 7–9 sa |
| **U3 Göz at, bağlam, biz önerelim** | Randevu örneği uçtan uca: kartta o günün şeridi, "Defter ▸" ile bak ve dön, "Şu gün olsun" ile kendi saatini öner; ertelenenler masada | Göz atma ve dönüşte yerin korunması (2); bağlam kancası (4); "Sonra" yığını (26); "cevap ~3 saat sonra" ve "X'te · Perşembe'ye kadar" etiketleri (15); **kural:** biz önerelim (§3) | `js/ekran-odak.js`, `js/ekran-oda.js`, `js/ekran-kart.js`, `js/ajanda.js` (yalnız kanca), `js/mesajlar.js` (saf okuma), `js/yazisma.js` (kural) | 7–9 sa |
| **U4 Zaman ve ara ekranlar** | İlerle'de saat kolu döner, olanlar sırayla akar, durak özeti kartıyla biter; sabah gazete masaya iner; ay başı ve transfer için kapak; Stada git'te bilet kartı | Zaman geçiyor sahnesi (≤ 2,5 sn, tıkla atla, Duraklat'ta atlar ve durur) ve durak özeti (5, 27); kapak kartları (14); bilet kartı ve maçtan dönüş karartması; "Maç hesaplanıyor" n/7 (30); maç sonu belirme (22); düğme basım ve "İlerliyor…" (21); tek dokunuş, iskelet yok (31) | yeni `js/zaman-ozeti.js` (saf, Node'da sınanır), yeni `js/ekran-zaman.js`, `js/oda.js`, `js/ekran-oda.js`, `index.html` (ilk boyama örtüsü), `js/ekran-mac-sonu.js` | 8–10 sa |
| **U5 Gazete, bülten, maç** | Gerçek bir yerel gazete sayfası; bülten okurken kaymaz; maçta köşede skor | Gazete odak kâğıdı: künye, manşet, sütunlar, yan kutular, kısa boş gün, sararan eski sayı, "Sayı n / N" (9, 34); gazete verisine etiket ve kutu düzeltmesi; bülten sekmeli, otomatik dönüş yok, başlıkta iki takım, `--k-*` paleti, beklenti yuvası boş (10); maç şeridi ortak düğme dili; 2D köşe skoru HTML katmanında (25) | yeni `js/ekran-gazete.js`, `js/gazete.js`, `js/ekran-mac-oncesi.js`, yeni `js/ekran-mac-skor.js`, `js/arayuz.js`, `index.html` | 7–9 sa |
| **U6 Oda kabuğu ve cila** | Sol sütun yerine masanın altında ince şerit; rozetler tek dilde; balkonda iş yarım ekranda; kâğıtta hafif doku | Masa şeridi (23); rozet dili ve üst/alt şerit sadeleşmesi (11); ayarlar küçük kart; defter küçükleri (24); balkon yarım odak (17); masadaki iş yükü yalnız mevcut veriden (16); kâğıt dokusu, eski sayı sararması, mürekkep kuruma (20, 32) | `js/ekran-oda.js`, `js/ekran-defter.js`, `js/balkon.js`, `js/oda.js`, `js/stil-99.js` | 5–7 sa |
| **U7 Kapanış** | — | Tam denetim; belgeler: STIL_REHBERI §7 "Bugünkü uygulama (U)" (eski notlar tarihsel), OYUN_TASARIMI §2/§6/§8, TEKNIK_PLAN §10 (odak kabı ve kart sözleşmesi), YOL_HARITASI karar 55 ve devam notu, CLAUDE.md "Bugün çalışan", KAPILAR satırları | belgeler | 4–6 sa |

Toplam yaklaşık 50–65 saat. Oto mod istenirse U0 → U1 → U2 birlikte yürür; U3'ün kural adımı ve U5'in gazete düzeltmesi kullanıcı onayıyla.

## 3. Kural değişiklikleri (yalnız ikisi; ikisi de küçük ve kayıt sürümü 11 kalır)

1. **Biz önerelim (U3; onaylı tercih 2, ayrıntısı yeni).** Kod haritası önemli bir şey gösterdi: hocanın önerdiği saat zaten başkanın defterindeki ilk boş 11:00 ya da 15:00 saatidir. "Ajandadaki ilk boş saat" olduğu gibi yazılırsa iki cevap aynı saate düşer. Bu yüzden önerim: ikinci cevap **"Şu gün olsun: <gün saat>"**, saati şimdiden en az 60 dakika sonra, 30 dakikalık adımlarla, maç günü ve antrenman saati dışında, **hocanın önerisinden önceki** ilk boş saat. Kabul et seçilemiyorsa (o saatte iş varsa) 14 gün içindeki ilk boş saat. Karşı taraf anında kabul eder (TEST; hocanın kendi ajandası Y2'de gelince değişir), deftere 45 dakikalık randevu yazılır, konuşmada "Olur başkanım." (TEST) görünür. Boş saat yoksa bugünkü "Başka gün iste" geri gelir. **Bedeli:** "daha geç bir gün iste" yolu doğal oyunda neredeyse hiç görünmez; geç gün isteyen oyuncu kartı cevapsız bırakır. Denetim: `kariyer-deneme` 3.2c ve `akis-deneme` §21.
2. **Gazetede tablo manşet olmaz (U5).** Bugün olağan bir Pazartesi sayısında tek haber puan tablosu olduğu için manşet tablo metni oluyor. Kutular (puan, gol, haftanın sonuçları) manşet olmaz; kutusuz haber yoksa sayı "kısa" çıkar. S-e'nin "manşet en önemli haberdir" kuralını inceltir. Ayrıca haberlere tür etiketi eklenir. Sayı yine kayıttan her seferinde aynı kurulur. Denetim: `kariyer-deneme` 5.2 ve `akis-deneme` §25.

Bilinen TEST tutarsızlığı, bu turda düzeltilmez: hoca hafta içi 15:00'i öneriyor ama antrenman 15:00–17:00. "Biz önerelim" saati antrenmanı dışlar.

## 4. Önceki kullanıcı kararlarını değiştiren üç sunum ayrıntısı (onayına sunuluyor)

1. **Telefonda Esc bir adım geri** (N7, 2026-10-04: "Esc bir uygulamadan ana ekrana döner"). Odak modelinde konuşmadan Esc Mesajlar'a, oradan ana ekrana döner; Geri düğmesiyle aynı.
2. **Karar panelinde Kapat masaya bırakır, ‹ Ajanda geri götürür** (2.8Q: "Kapat'tan sonra deftere dönülür").
3. **Bülten sayfaları kendiliğinden dönmez** (2.8S, 2026-10-03: "5 etkin saniyede bir döner"). Kadrolar açılışta, Lig sekmeyle; okurken tablo kaybolmaz. Bu, dokuz soruda yoktu; ilk plan taslağında tercih olarak yazılmıştı.

## 5. Denetim stratejisi

- **Seçiciler korunur.** Bugünkü sınıflar (`.od-panel`, `.od-telefonPanel`, `.od-icerik`, `.od-nesne[data-panel]`, `.od-perde`, `.kk-yuz`, `.gz-kunye`, `.prg-gosterge`) yeni kapta takma ad olarak yaşar; yeni işaretler öznitelikle (`data-odak`, `data-rozet`) gelir.
- **U0'da deneme yardımcıları:** masaya dönüş (Esc sayısını da denetler), nesne açma (1–4 aç/kapa tuzağı), Ayarlar > yazı akışı tek yerde (bugün 12 tekrar), geçişin bitmesini bekleme, yazı tiplerini bekleme. Çift Esc + Digit1 kalıpları (§3, §19, §21) buna taşınır.
- **Yeni bölümler:** Esc tablosu (her geçiş için Esc sayısı, beklenen ekran, Geri'nin aynı sonuca vardığı); odak (bulanıklık 6–8 px, karartma 0,30–0,35, canlandırılmadığı, iki derinlik sınırı, dönüşte yerin korunması); kartın %10/%25/%55/%120 sürüklemede kabın içinde kalması (telefon, dosya, panel, karar anı; 1180 ve 800 px; normal ve büyük yazı); 800×600'de gövde yazısı ≥ 12 px; gazetenin üç sayısı (boş, olağan, kalın); bülten sekmeleri (§14 ikiye bölünür, loca kısmı ayrı); 2D köşe skoru (`akis-2d.py`).
- **Her alt turda hızlı kademe:** `node araclar/mac-deneme.js 4` ("sonuç aynı"; motor değişmez), yeni betik varsa `node araclar/ad-denetimi.js`, saf işlev ya da kural değiştiyse `node araclar/kariyer-deneme.js`, değişen ekranın `akis-deneme` bölümleri (KAPILAR). Oturum sonunda `kontrol.py` ve görüntüler incelenir.
- **Kapanışta:** `node araclar/oturum-sonu.js g1.json --ayni --seyrek` (motor aynı), `akis-deneme` tamamı masaüstünde bir kez (dizüstünde 11, 12, 14, 14b, 15, 15b ve 16'nın iki satırı bilinen düşüşler), `akis-2d.py`, `kontrol.py`, iki bağımsız inceleme (ultracode'un değdiği yer burası).
- **Yazı tipi riski:** masaüstü kopyası yalnız Plex Mono ve Jersey 10'u yerele alıyor; Plex Sans eklenmezse oyun sessizce sistem yazısına düşer. U0'da yerel kopya ve araçlarda `document.fonts.ready` beklemesi.

## 6. Bu turda olmayanlar

| Konu | Neden |
|---|---|
| İlerle durak sıklığı ayarı | OYUN_TASARIMI §6'nın kesin durma kurallarına dokunur; bugün içerik azken ihtiyacı ölçülemez. Y4 tempo ölçümüne |
| Geri alınamaz eylemde "vazgeç" yüzü | H1'in onaysız kartına ve "yapay seçim ağacı yok" kuralına aykırı; reddedildi. Güvenlik zaten kartta: yüz sonucu gösterir, %40 eşik, tıklama uygulamaz |
| Kart sınıfına göre sararan ve kalınlaşan dosya | Kayıtta kart sınıfı yok; Y1 ile gelir. Bu turda yalnız son cevap ve cevapsız sonuç metni görünür |
| "Maç hesaplanıyor" örtüsünde günün manşeti | Sonuç yazılmadan kurulamaz; yalnız n/7 ve dakika |
| Kapı ve ziyaretçi odağı, asistan brifingi, bültende beklenti içeriği | Y2 ve Y3; yerleri bırakılır, içerik yazılmaz |
| 3B oda ve stat görselleri, tarz | Karar 46 ve 49 |
| Ses | Aşama 10 |

## 7. Riskler

- **En riskli nokta:** oda ekranı her eylemde bütün kabı yeniden kuruyor; geçiş, göz atma ve kart sürüklemesi bunun üstüne oturacak. U1'de önce davranışsız kab (yalnız çerçeve), sonra Esc, sonra geçiş sırasıyla gidilir; geçiş yeniden çizimde tekrarlamasın diye yalnız açılışın ilk çiziminde verilir.
- **Bulanıklığın bedeli** başsız tarayıcıda ve Electron'da ölçülmeden eşik konmaz; 3B tek kareye indiği için canlı maliyet beklenmez.
- **Kart önizleme sözleşmesi değişir** (yüz değişince ev sahibi yeniden çizmez); TEKNIK_PLAN §10'a yazılır, `YUZ_JS` yalnız görünen yüzü okur.
- **640 px'te bülten** 1,5 cqw ile 9,6 px yazıya iner; büyük yazıda sığma ölçülür.
