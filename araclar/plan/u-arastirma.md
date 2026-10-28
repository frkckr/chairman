# U — Arayüz: araştırma, odak modeli ve yapılacaklar (düşünme turu, 2026-10-28)

Durum: **düşünme ve araştırma; uygulama ve tur planı yok.** Kullanıcı 2026-10-28'de "hemen plana geçmeyelim, düşünelim; eksikleri ve yapılacakları daha çıkar; futbol ve futbol dışı sevilen arayüzlere bak" dedi. `u-arayuz.md`'deki U0–U6 sırası bu belgeden sonra yeniden yazılacak. Oyun kodu ve ana belgeler değişmedi.

Kullanıcının çekirdek isteği (kendi sözleriyle, özet): **"O anda ne yapıyorsam yalnız onunla ilgileniyor olayım."** Mesajlaşıyorsam mesaja ve karta odaklanayım, ikisi ekranda büyük olsun, arka plan bulanıklaşsın. Görüşme isteğine saat önerisi geldiğinde geri dönüp ajandama bakabileyim, kabul edeyim, etmeyeyim, başka tarih diyelim ya da biz önerelim; ama hep tek işe bakıp geri döneyim: halledip ya da erteleyip öbürüne geçeyim, gerekirse öbür işe yeniden döneyim. Oyunu doğru yapacak şey bu. Oda ve renkler dahil her şey yeniden düşünülsün; "zaten en iyisi bu" olan yerler savunulsun; ara ekranlar, düğmeye basınca olanlar, bekleme ekranları ve bugün olmayan şeyler de planlansın.

## 1. Odak modeli: "Masa → İş → Masa"

*(Araştırmadan sonra değişen ayrıntılar §6.4'te: bulanıklık statik ve hafif, "Sonra" yığını masada görünür, durak özeti kartı, İlerle durak sıklığı ayarı, kart metni tavanı.)*

Bugünkü oyun zaten "tek meseleye odaklanma" kararıyla kuruldu (OYUN_TASARIMI §2, 2026-09-30) ama ekranlar bunu yarım yapıyor: telefon sağda dar bir cihaz, karar sağ panelde boş bir kâğıdın üstünde, dosya ve defter ortada büyük, gazete yine sağda. Oda hep görünür ama odak hep yarım. Kullanıcının isteği bu yarımlığı bitirmek.

### 1.1 Üç katman, en çok iki derinlik

| Katman | Ne | Nasıl görünür |
|---|---|---|
| **Masa** (oda) | Bekleyen işlerin hepsi nesne olarak masada: yanan telefon, açık dosya, gazete, defter, kapıdaki ziyaretçi (Y2), pencere | 3B oda, bugünkü gibi; görev listesi paneli yok (karar 47/50) |
| **İş** (odak) | Tek bir iş ekranın ortasında büyük: konuşma + kart, dosya + kart, gazete sayısı, defter, bülten | Oda arkada bulanık ve %35 karartılmış; iş kâğıdı karenin ~%78 genişliği, ~%88 boyu; 180 ms belirme |
| **Göz atma** (peek) | Odaktaki işi bırakmadan bir başka nesneye bakmak: ajanda, kasa özeti, oyuncu dosyası, puan durumu | İş sola kayıp küçülür (%55), sağda bakılan nesne açılır (%40); Geri ile iş eski boyuna döner. Üçüncü derinlik yok: göz atmanın içinden yeni iş açılmaz, "oraya git" seçilirse odak değişir ve eski iş masaya döner |

Kurallar:

- **Odakta zaman durur** (okuma kuralı aynen). Kartı uygulamak ya da bir girişim başlatmak zaman harcarsa bedeli kartın yüzünde yazar (bugünkü gibi).
- **Odaktan üç çıkış vardır:** *Halle* (kartı kaydır / Enter), *Masaya bırak* (Esc ya da Kapat: iş masada kalır, kartın sınıfına göre ömrü işler — bu "ertelemek"tir, üçüncü düğme değildir; OYUN_TASARIMI §2 kart sınıfları), *Göz at* (işin yanında açılan ikinci kâğıt).
- **İş kendi bağlamını getirir.** Göz atmaya gerek kalmasın diye odaktaki kâğıt, işin ihtiyaç duyduğu bilgiyi kendi üstünde taşır: randevu önerisinde o günün ajanda şeridi (boş saatler, çakışan randevu), para kararında kasanın 90 günlük en düşük bakiyesi, sözleşme kartında oyuncunun künyesi ve sezonu, transfer teklifinde hocanın görüşü. Bugün bunların çoğu "Bilinenler" olarak dosyada var; telefondaki kartta yok. Kural: **bağlam odaktaki kâğıtta, ayrıntı göz atmada.**
- **Geri hep aynı yere döner.** Göz atmadan dönünce kaydırma yeri, önizlenen kart yüzü ve seçili sekme korunur. Masaya bırakılan iş yeniden açılınca aynı yerden açılır.
- **Odak tek yerde çizilir.** Telefon, dosya, defter, gazete, bülten, karar anı aynı "odak kabı"nı kullanır: başlık çubuğu (‹ Geri · başlık · Kapat ×), kâğıt, alt eylem şeridi. Bugün beş ayrı yerleşim var.
- **Masa görünür kalır** ama okunmaz: bulanıklık 6–8 px, karartma %35, odak kapanınca 120 ms'de geri gelir. Kamera bugün nesneye doğru eğilip görüş açısını 56°'den 52°'ye indiriyor ve sağdaki panel için nesneyi sola kaydırıyor (`STIL.oda.odakKayma` 0,5 m; `js/oda.js:342-350`); odak ortada olunca kayma sıfırlanır, eğilme kalır ve açı biraz daha daralır (~46°): "nesneye yaklaşma" hissi kameradan, netlik bulanıklıktan gelir. Balkonda odak "yarım"dır: antrenman arkada net kalır, iş kâğıdı ekranın yarısına çekilir (karar 20: iş yaparken antrenman izlenir).

### 1.2 Kullanıcının örneği: randevu önerisi

1. Telefon yanar: "Şükrü Hoca · Görüşme: Perşembe 11:00 olur mu?". Telefona dokununca **odak**: cihaz değil, konuşma kâğıdı büyür (cihaz çerçevesi ince bir ipucu olarak kalır); üstte son mesajlar, altta kart.
2. Kartın yüzünde: önerilen saat, süresi (45 dk), **o günün ajanda şeridi** (08–20 arası boş/dolu kutucuklar, çakışan iş kırmızı) ve bilinen bedel. Çoğu durumda göz atmaya gerek kalmaz.
3. Yine de bakmak istersen: kartın altında "Defter ▸" — **göz atma**: konuşma sola küçülür, sağda defter o haftaya açılır; haftayı gezersin; "‹ Konuşma" ile geri; kartın önizlemesi durduğu yerde.
4. İki cevap: **Kabul et** / **Başka gün iste**. "Başka gün iste" bugünkü gibi karşı tarafın yeni önerisini bekler (H2-c, en çok üç öneri). Kullanıcının "biz önerelim" isteği için ek kalıp: ikinci cevap "Başka gün iste" yerine **"Şu gün olsun: Cuma 15:00"** olabilir — ekibin (asistanın; Y2'ye dek defterin kendisinin) ajandadan bulduğu ilk boş saat. Böylece iki cevap kuralı bozulmaz, rakam/çark girilmez, "biz önerelim" gerçekleşir. *(Plan notu, 2026-10-28: hocanın önerisi zaten başkanın defterindeki ilk boş saat olduğu için "bizim saat" öneriden önceki ilk boş saat diye tanımlandı; karşı taraf anında kabul eder, "üçüncü öneri sonraki kartta" yolu kalktı. Ayrıntı [u-arayuz.md](u-arayuz.md) §3.)*
5. Kart uygulanınca kâğıt **damgalanır** (KABUL / BAŞKA GÜN, 200 ms), konuşmaya giden mesaj düşer, kart kapanır, iş masaya döner; alt şeritte tek satır sonuç.

### 1.3 Masadaki iş yığını

- Masa görev listesi değildir ama **ne kadar iş olduğu masadan okunur**: telefon yanar ve sayı gösterir (var), dosya açık ve sekmeleri görünür (var), gazete masada (var), kapıda biri (Y2), defterde bugünün sayfası kabarık (yeni: bekleyen randevu sayısı defter nesnesinde küçük ayraçlarla). Yönetim omurgasının "sararan dosya, acil damgası" izleri (OYUN_TASARIMI §2 kart sınıfları) bu modelde masadaki nesnenin hâlidir: fırsat kartı sararır, sorun kartı kalınlaşır.
- Alt şeritte "şimdi ne var" tek satırı sürer; ama yığılma yerine **son gelişme + bekleyen sayısı** ("3 iş bekliyor · 1'i bugün cevap ister").
- Odak içinde **sıradaki/önceki iş** yok (karar 2.8M ile kaldırıldı; doğru): her iş masadan açılır, oyuncu sırayı kendi seçer.

### 1.4 Zaman: İlerle ve bekleme

Bugün "İlerle" anında atlar; olanlar alt şeritte üç cümle hâlinde yığılır. Önerim **"zaman geçiyor" ara sahnesi**: İlerle'ye basınca düğme "İlerliyor…" olur, odadaki saatin kolları döner, pencere ışığı değişir (zaten saate bağlı), alt şeritte geçen olaylar tek tek ve sırayla akar ("Salı 10:30 · Berk Deneme yazdı", "Çarşamba 08:00 · gazete geldi"), her satır 0,5 sn, durakta durur; tıklamak atlar. İçerik bugün var (gelişme listesi), sunumu yok. Uzun atlamada (günler) satırlar hızlanır. Bu, FM'in "işleniyor" ekranındaki manşet kalıbının bizdeki karşılığıdır: bekleme bilgi taşır, boş çubuk olmaz.

Mesaj gönderince "gönderildi · cevap ~3 saat sonra" satırı konuşmada görünür (bekleme hissi; cevap gelince İlerle zaten durur). Ekibe devredilen işte dosyanın sekmesinde "Nusret Bey'de · Perşembe'ye kadar" küçük etiketi.

## 2. Sıfırdan yapsaydım: dört yön ve kararım

| Yön | Ne | Lehine | Aleyhine | Karar |
|---|---|---|---|---|
| **A. Masa odağı (evrim)** | Bugünkü 3B oda + kâğıt dili; üstüne odak modeli, tek pencere kabı, tek ölçek | Kararlarla uyumlu (aydınlık oda, nesneler, kâğıt); yatırım korunur; FM'in soğuk panosundan ayrışan sıcak kimlik; mobilde de "tek şey büyük" | 3B oda bugün yer tutucu (karar 49); iki dünya (3B + HTML) tutarlılık ister | **Bu.** |
| B. Tam 2B masa üstü (Papers, Please / Strange Horticulture) | Kamera sabit tepeden masaya; nesneler masada sürüklenir; oda yok | En okunur ve dokunmaya en uygun; tek dil | Pencere, balkon ve yürüyüş kararlarıyla çelişir; 3B stat ve oda işi boşa; "mekânda yaşama" hissi gider | Hayır; ama odak kâğıdının büyüklüğü ve okunurluğu B'den alınır |
| C. Retro işletim sistemi / teleks (Hypnospace, Orwell) | Her şey bir 1999 bilgisayar ekranında | Çok güçlü kimlik, ucuz | "Bilgisayar nesnesi yok" kararı (51); başkan masada kâğıtla çalışır; soğuk | Hayır |
| D. Pano / sekmeli yönetim (FM, Club Soccer Director) | Üst menü, tablolar, inbox | Hızlı gezinti | Açıkça reddedildi (karar 47: yan menü ve görev listesi yok; puan yok) | Hayır |

**Oda ve renkler değişsin mi?** Odanın *rengi* değil *kalitesi* yer tutucu; o karar 49'a göre görsel turda. Arayüz paleti (krem kâğıt, kahve mürekkep, kulüp kırmızısı, amber) doğru ve savunulur: sıcak, okunur, FM'den farklı. Değişmesi gerekenler: (1) **amber her yerde** — düğme, rozet, seçili sekme, vurgu, çubuk; amber yalnız *ana eylem* ve *seçili* için kalmalı, rozetler kulüp kırmızısı ve mürekkep, "yeni" işareti nokta; (2) **Jersey 10** piksel başlık yazısı Türkçe harflerde ve küçük boyda zayıf — yalnız büyük başlık ve sayılarda; (3) gövde yazısı tek genişlikli — orantılı gövdeye geçiş (STIL_REHBERI'nin onaylı hedefi); (4) **kimlik anı eksik**: sevilen arayüzlerin hepsinin bir imzası var (Persona'nın kırmızı-siyah eğik düzeni, Hades'in altın çerçevesi, Balatro'nun tüp ekranı). Bizim imzamız "1999 ilçe kulübü başkanının masası" olmalı: damga, ataş, karbon kopya, sararan kâğıt, el yazısı not, telefon kablosu — **kodla ve ucuz**: damga ve ataş zaten var, geriye kart damgası, sararma ve kâğıt dokusu kalıyor.

**Savunduklarım (dokunulmasın):** masadaki açık karton dosya ve iki sayfalı defter (en iyi iki ekran), tek kart ve "tıklama uygulamaz" kuralı, telefonun tanıdık cihaz kalıbı (odakta büyür ama kalıp aynı), Canlı Skor'un tek satır maç kalıbı ve puan durumu, maç sonu kartının yalınlığı, "az düğme, bilgi kaynağından gelir" ilkesi, odanın gün ışığı.

## 3. Ara ekranlar, düğmeye basınca olanlar, bekleme (bugün olmayanlar dahil)

| An | Bugün | Öneri | Var mı |
|---|---|---|---|
| Nesneye tıklama | Kamera nesneye döner, panel anında belirir | Kamera döner (aynı), oda bulanır, kâğıt 180 ms'de ortaya büyür (nesneden çıkıyormuş gibi: başlangıç ölçeği 0,92, nesnenin yerinden) | Yeni |
| Kapat / Esc | Panel anında yok olur | Kâğıt 120 ms'de nesneye küçülür, bulanıklık kalkar; nesne kısa amber vurgu | Yeni |
| Kartı uygulama | Kart yerine yaylanır, sonuç yeşil kenarlı kutuda | Damga (KABUL ET / SAYMANA DEVRET, kartın metni, −6° eğik, 200 ms), 400 ms sonra kart dosyaya girer (küçülür), sonuç satırı | Yeni |
| İlerle | Anında; şeritte yığın | §1.4 "zaman geçiyor": düğme "İlerliyor…", saat kolu, olaylar sırayla, durakta durur, tıkla atla | Yeni |
| Sabah 08:00 | Gazete masada, rozet | Gün açılışı: pencere ışığı, gazete masaya bırakılır (nesne 300 ms'de iner), telefon bildirimleri sırayla; asistan brifingi Y3 | Yeni (kısa) |
| Mesaj gönderme | Soru konuşmaya düşer | Baloncuk alttan kayar (150 ms), altında "cevap ~3 saat sonra" soluk satır | Kısmen |
| Stada git | Sayfa yenilenir, siyah, bülten | Odada karartma 300 ms; sayfa ilk karesinde **bilet kartı** ("13. hafta · Demirkapı – Akdeniz · Cumartesi 19:00 · İlçe Stadı"; deplasmanda "Değirmenaltı'na gidiş · 2 saat yol") stat arkada kurulurken; bülten üstüne 250 ms'de gelir | Yeni |
| Bülten → maç | Santra öncesi (var) | Aynı; "Maça geç" basınca bülten kâğıdı yukarı kayar (200 ms) | Küçük |
| Maç sonu | Kart 8 sn sonra anında | 250 ms belirme; "Odaya dön"den sonra karartma ve oda akşam ışığında (var) | Küçük |
| Odaya dönüş 21:00 | Oda açılır | Akşam odası + alt şeritte "maçtan dönüldü" tek satır; P12 dosyası varsa masada açık (var) | Küçük |
| Ay başı / transfer dönemi / sezon sonu | Rutin iş, şeritte satır | **Kapak kartı**: tek cümle ve tarih ("1 Aralık · Maaşlar ödendi, kasa 4,9 milyon ₺"; "4 Ocak · Kış transfer dönemi açıldı"), tıkla geç; defterde de yazar | Yeni |
| Ziyaretçi (Y2) | Yok | Kapı vurulur (kapı nesnesi + alt şerit satırı); odak: kişi portresi büyük, konuşma kart zinciri; "sonra gelsin" bir cevap | Y2 ile |
| Balkonda iş | Panel sağda, antrenman arkada | Odak yarım: kâğıt sağ yarıda, antrenman solda net; ağır kartta uyarı "sinyaller kaçabilir" (OYUN_TASARIMI §6 balkon) | Kısmen |
| Yükleme / WebGL yok | Uyarı metni | Aynı, kâğıt dilinde | Küçük |
| Kayıt | Üstte "Kaydedildi" | Aynı; odakta görünmez, gerek yok | Var |
| Düğme basımı | 1 px aşağı | 1 px aşağı + 80 ms koyulaşma; ana düğme basılı kalırken etiketi değişir ("İlerliyor…", "Gönderiliyor…") | Küçük |

Ses yok (Aşama 10); bütün geri bildirim görsel.

## 4. Ekran ekran: odak modelinde ne değişir

- **Oda.** Nesneler menüdür. Sol sütun: ya kalkar (nesne + klavye 1–4 + üzerine gelince etiket) ya da masanın altında ince bir "masa şeridi"ne iner (dört simge + rozet). Tercihim: **masa şeridi** — klavye ve erişilebilirlik için gerekli, ama odayı kesen bir sütun olmasın. Üst şerit: kulüp · başkan · kayıt · Duraklat; tarih bloğu kalır (iyi). Alt şerit: son gelişme + bekleyen sayısı + İlerle.
- **Telefon.** Odakta cihaz ekranın ortasında ve büyük (boyun %88'i); ekranlar aynı (ana, Mesajlar, konuşma, Canlı Skor, kulüp). Konuşmada kart cevap alanında, bağlam şeridiyle (ajanda, kasa). Göz atma: "Defter ▸", "Dosya ▸" kartın altından. Maç telefonu aynı bileşen, maçta odak yarım (maç arkada donuk ama görünür).
- **Kart.** `u-arayuz.md` §3.3 aynen (kaptan çıkmaz, üst etiket, dar kap) + damga + bağlam şeridi.
- **Dosya ve defter.** Zaten ortada ve büyük; odak kabına girerler (başlık çubuğu, bulanık oda). Dosyada "◂ Mesaja dön" göz atma dönüşüdür.
- **Gazete.** Odakta geniş gazete (`u-arayuz.md` §3.5); masaya bırakılış sahnesi sabah.
- **Ayarlar.** Küçük odak (kâğıt %50), aynı kap.
- **Bülten.** Odak kabının "sayfa yüklemesi" hâli: bilet kartı → bülten; sekmeli (`u-arayuz.md` §3.6).
- **Maç.** Değişmez (2D ve şerit); yalnız düğme dili ve maç telefonunun yarım odağı. Skor etiketi sorusu sürer.
- **Karar anı.** Odak kabının süreli hâli; aynı kart.

## 5. Eksikler ve yapılacaklar (envanter; öncelik A oynanabilirlik, B tutarlılık, C cila)

| # | Öncelik | Konu | Bugün | Yapılacak |
|---|---|---|---|---|
| 1 | A | Odak kabı (tek pencere: başlık çubuğu, kâğıt, alt şerit, bulanık oda, belirme/kapanma) | Beş ayrı yerleşim | `js/ekran-odak.js` (yeni); telefon, dosya, defter, gazete, ayarlar, karar paneli, bülten, karar anı bu kaba taşınır |
| 2 | A | Göz atma (peek) ve geri dönüşte yerin korunması | Yok; dosyadan mesaja dönüş var | Odak durumu yığını (en çok 2); "Defter ▸ / Dosya ▸ / Kadro ▸" bağlantıları |
| 3 | A | Kartın kaptan çıkması, üst etiket, dar kap kuralı | Telefonda kırpılıyor | `u-arayuz.md` §3.3 |
| 4 | A | Kartta bağlam şeridi (ajanda günü, kasa, oyuncu künyesi) | Yalnız dosyada "Bilinenler" | `kararKarti` `baglam` kancası: karar türü bağlamı verir (kural değil, okuma) |
| 5 | A | "Zaman geçiyor" ara sahnesi ve İlerle geri bildirimi | Anında, yığın | `js/ekran-zaman.js` (yeni); gelişme listesinden sırayla; atlanabilir |
| 6 | A | Esc ve Geri sözleşmesi (bir adım) | Tutarsız (tablo `u-arayuz.md` §1.1 G4) | Odak kabında tek `esc()` |
| 7 | A | Tek yazı ölçeği, 800 px'te ≥ 12 px; büyük yazı her yerde | Bülten ve maç telefonu dışarıda; telefon 9 px | `--k-yaziBoyu` tek kaynak |
| 8 | A | Telefon odakta büyük; Geri başlığa binmiyor; kulüp ekranında geri yazısı | Dar, çakışma var | Telefon düzeni |
| 9 | B | Gazete tasarımı (künye, manşet, sütun, kutu, sararma, sabah sahnesi) | Düz paragraf | `js/ekran-gazete.js` (yeni) |
| 10 | B | Bülten: sekmeli, otomatik dönüş yok, bilet kartı, belirme | 5 sn döner | `ekran-mac-oncesi.js` |
| 11 | B | Amber diyeti ve rozet dili (kırmızı = karar, nokta = yeni, sayı = adet) | Amber her yerde | STIL.kagit: `vurgu` yalnız ana eylem; rozet renkleri |
| 12 | B | Orantılı gövde yazısı; Jersey yalnız büyük başlık ve sayı | Her yer mono | Yazı kararı (soru) |
| 13 | B | Kart damgası ve dosyaya giriş hareketi | Yeşil kutu | `ekran-kart.js` |
| 14 | B | Kapak kartları (ay başı, transfer dönemi, sezon sonu) | Şerit satırı | Rutin iş sonucu → kapak; tıkla geç |
| 15 | B | Mesajda "cevap ~3 saat sonra" ve devredilen işte "X'te · Perşembe'ye kadar" etiketi | Yok | Okuma; veri var |
| 16 | B | Masadaki iş yükünün görünmesi (defter kabarık, dosya sararmış) | Telefon ışığı, dosya rozeti | 3B nesne hâlleri (küçük) |
| 17 | B | Balkonda yarım odak | Sağ panel | Odak kabının `yarim` kipi |
| 18 | B | Maç telefonu aynı bileşen; "Duraklatıldı" etiketi telefon açıkken gizli | Ayrı dosya, çift etiket | Birleştirme |
| 19 | C | Ölü CSS, sabit renkler, tanımsız değişkenler, çift `.od-panel` | Var | Temizlik |
| 20 | C | Kâğıt dokusu, ince kırışıklık, eski sayı sararması, el yazısı not yazısı (kodla) | Düz renk | STIL.kagit doku ayarı; `prefers-reduced-motion`/düşük cihazda kapalı |
| 21 | C | Düğme basım geri bildirimi ve "İlerliyor…" etiketleri | 1 px | Ortak düğme bileşeni |
| 22 | C | Maç sonu kartı belirme; "Maç hesaplanıyor" örtüsü kâğıt dilinde | Anında | Küçük |
| 23 | C | Masa şeridi (sol sütun yerine) | Sol sütun | Oda kabuğu (soru) |
| 24 | C | Defterde "Kapat" yeri, sağ sayfa bugün vurgusu | Küçükler | Küçük |
| 25 | ? | Maçta köşede küçük skor/dakika etiketi (kural 2.8J) | Yalnız tabela | Kullanıcı kararı |
| 26 | A | "Sonra" yığını: ertelenen kart masada görünür (en çok 3), durağında en üste döner | Dosya sekmesi ve rozet | Masa nesnesi hâli + açılış önceliği |
| 27 | A | Durak özeti kartı (geçen süre, gelen 2–3 şey, sıradaki durak; tek dokunuş) | Şeritte yığın | "Zaman geçiyor" sahnesinin sonu |
| 28 | B | İlerle durak sıklığı ayarı (iki-üç hazır ayar; cevapta durma korunur) | Sabit | Ayarlar > Oyun |
| 29 | B | Kart metni tavanı (üç paragraf, iki cevap); kartta ikinci görüş satırının yeri | Serbest | Kart düzeni; içerik Y2 |
| 30 | B | "Maç hesaplanıyor…" örtüsünde 4/8 maç ve günün manşeti | Dakika | `ekran-mac-sonu.js` |
| 31 | B | Bilet ve kapak kartları tek dokunuşla geçilir, ikinci kez beklettirmez; iskelet ekran yok | — | Geçiş kuralı |
| 32 | C | Defterde mürekkep kuruma mikro hareketi; dosyalarda kademeli açılma hissi (boş başlar) | Düz | STIL.kagit.defter |
| 33 | C | Onay yalnız geri alınamaz nadir eylemde (hoca kovma, satış imzası): kartın ikinci yüzü "vazgeç" | Onay yok | Karar türü bayrağı (kural, kullanıcı onayı) |
| 34 | C | Gazete arşivinde haber önemine göre manşet (var); eski sayı sararması; "Masadaki notlar" ayrı | Var/yok | `ekran-gazete.js` |

Bugün olmayan ve bu turun dışında kalan ama yeri bırakılacaklar: kapı/ziyaretçi odağı (Y2), asistan brifingi (Y3), bültende "beklenti" satırı (Y3), TV ve ev modu (havuz), ses (Aşama 10).

## 6. Araştırma bulguları

Üç ayrı taramanın özeti; tam listeler ve bağlantılar aşağıdaki alt bölümlerde. *(Bu bölüm ajan raporları geldikçe dolduruldu.)*

### 6.1 Futbol ve spor yönetim oyunları

Kaynak: incelemeler, forumlar, geliştirici notları (ajan taraması, 2026-10-28; birçok site doğrudan açılmadı, doğrulanamayanlar işaretli).

**Ofis ve masa metaforlu menajerler (1990'lar)**
- *Ultimate Soccer Manager 98:* stat "odalar"dan oluşur; ofiste dört çekmeceli dolap, **faks** (transfer teklifleri, faturalar), **telefon** (bahis, rüşvet), ilan panosu, teletext TV, maç sonrası masada **gazete**. Bilgi "gerçek hayattaki yerinden" alınır; faks kâğıdının çıkması, çekmecenin açılması, gazetenin hışırtısı sevilmiş; faks pazarlığı günler sürdüğü için gerçeklik hissi veriyor, ama can sıkıcı da olabiliyor (https://www.amigareviews.leveluphost.com/ultisocc.htm, https://fullerfm.com/2022/10/19/retro-review-ultimate-soccer-manager-98/). **Bizim için:** nesne başına tek işlev; gecikmeli cevap (faks) bizim "cevap sonraki kartta" pazarlığımızla aynı ruh.
- *Anstoss 3:* ana menü "Managerbüro"; kasaya tıklayınca maliye, pencereden stada tıklayınca tribün; her menü 2–3 tıkla; seslendirilmiş antrenör konuşmaları kült ama tekrarı yoruyor (https://de.wikipedia.org/wiki/Anstoss_3, https://www.gameswelt.de/anstoss-3/test/anstoss-3-2863). *Anstoss 2022:* nostalji kabuğu, içi boş — "en kötü" eleştirileri (https://www.pcgames.de/Anstoss-2022-Spiel-72844/News/Early-Access-Check-1407055/).
- *Bundesliga Manager Hattrick:* masa düğme paneline dönmüş ("Iconwald"), yalnız kılavuzla kullanılır (http://www.goodolddays.net/game/id%2C795/lang%2Cde/review%2C808/Bundesliga-Manager-Hattrick.html). **Bizim için:** masa = düğme paneli olunca metafor ölür; nesne sayısı sabit kalır.

**Championship Manager → FM26**
- *CM 01/02:* salt metin, az ekran; "bir akşamda bir sezon", rehbersiz "al ve oyna" (https://community.sports-interactive.com/forums/topic/81059-why-is-championship-manager-0102-so-popular/). **Bizim için:** İlerle'nin karar dışı duruşları sayılabilir ve az olmalı.
- *FM26 (yeni arayüz):* "arayüz labirenti" — antrenman 2–3 alt menü derinde, "Portal" ekranında panel yığını, aynı maç üç ayrı yerde, kaydetmeyi bulmak 2 dakika, inbox'ın alanı fazla, takvim "işe yaramaz"; Steam çıkışta çoğunlukla olumsuz (https://www.galaxus.at/en/page/football-manager-26-is-floundering-in-an-interface-labyrinth-40507, https://www.techradar.com/gaming/football-manager-26-review, https://community.sports-interactive.com/forums/topic/594209-fun-game-without-tabbing-back-into-fm26-what-is-on-the-portal-screen-other-than-the-inbox/). **Bizim için:** "her şey tek ekranda" hub'ı tek mesele odasının antitezi; her bilgi en çok iki dokunuşta.
- *Continue ve işleme:* FM23'te Continue sonrası iniş yeri ayarlanabilir, oyun arkada akar; FM27 "Continue Flow" (Streamlined / Balanced / Comprehensive / Custom) ve hareketsizlikte kendiliğinden ilerleme; haberler sezon evresine göre ayrılır (https://www.footballmanager.com/node/1101, https://fmprojects.substack.com/p/speed-up-football-manager). **Bizim için:** İlerle'nin nerede duracağı ve nereye ineceği oyuncunun ayarı olabilir (iki-üç hazır ayar); bekleme boş değil, dünyanın kısa haberi.
- *Maç günü dizisi:* basın → taktik toplantısı → takım konuşması → maç → devre → maç sonu → özet → inbox; basın toplantıları 15 yıldır "sıkıcı", çoğunluk asistana devrediyor (https://www.fmscout.com/match_day.htm, https://www.bit-tech.net/reviews/gaming/pc/football-manager-2012-review/2/). **Bizim için:** devredilebilen şey tasarım hatasıdır; tekrarlı soru yok.
- *FM Touch / Mobile:* basın ve takım konuşmasını atar; FM24 Mobile **Pre-Match Hub** (rakibin gücü, formu, muhtemel 11, tehlikeli adamlar) ve **Match Expectations** (medya tahmini, yönetimin beklentisi, taraftar havası, kadro ruh hali); maçta anahtar anlarda bildirim; **Post-Match Hub** (https://www.footballmanager.com/node/793). **Bizim için:** beklenti paneli hoca olmayan rol için ideal maç öncesi; sayı değil cümle.

**Başkan ve sahip oyunları**
- *Football Chairman Pro:* hoca 11'i seçer, başkan sözleşme, transfer, stat, sponsor, bilet onaylar; "sade ve açık arayüz"; kullanıcılar maçın görsel ve olay bildirimli olmasını istiyor (https://apps.apple.com/app/id992140496). **Bizim için:** 2D maç ve maç telefonu en büyük avantajımız.
- *We Are Football:* haftalık tempo, çok sayıda küçük ve büyük karar, kulüp müzesi; ana ekran "küçük pencerelerle tıka basa", "dağınık" (https://fingerguns.net/reviews/2021/06/10/we-are-football-review-pc-somehow-i-manage/). **Bizim için:** yoğun özet ekran yerine haftalık tempo + az ama ağır karar.
- *New Star Manager:* kısa ikilemler, basın, sponsor, yönetim; "bir maç daha" bağımlılığı; kararlar hemen maça yansır (https://www.pocketgamer.com/new-star-manager/new-star-soccer-manager-review-the-beautiful-game-that-will-become-an-addiction/).
- *Football Drama:* tamamen iki seçenekli anlatı; karikatür ve caz övüldü ama sonuç "bilinmez", seçenekler "aynı seçenekler tekrar tekrar" (https://www.pockettactics.com/football-drama/review). **Bizim için:** iki anlamlı cevap tek başına yetmez; sonucun geçmişe bağlı ve okunur olması şart.
- *Top Eleven:* sabit maç saati "tuhaf biçimde tatmin edici", maç takvimde bir olay (https://www.pocketgamer.com/top-eleven/review/). **Bizim için:** maç gününü takvimde ritüel yap (stada gidiş sahnesi); ama saat zorunluluğu değil.
- *Goal! The Club Manager, Anstoss 2022:* "slick UI" iddiasıyla çoğunlukla olumsuz — nostalji kabuğu boş içle kurtarmıyor.

**Başka spor menajerleri:** Motorsport Manager — antrenman → sıralama → yarış tek okunur akış, "temiz ve akıcı" (https://opencritic.com/game/3566/gabriel-franco/reviews); OOTP — derinliğin yıllar içinde sade menü ve yazı tipiyle sunulması; Basketball GM — tek sol menü, haberlerin puanlanıp yalnız önemlilerin gösterilmesi (https://zengm.com/blog/2020/06/news-feed/); Pro Cycling Manager — açıklamasız veri sayfaları kötü, 2020'deki yardımcı iyi.

**Kesişen kalıplar:** (a) pano kaybettiriyor (FM26 Portal, WAF, Hattrick), azlık seviliyor (CM 01/02, ZenGM, USM'nin yerinden bilgi); (b) zamanı ilerletmede iniş yeri ve duruş sıklığı oyuncuya bırakılıyor; (c) tarih teklif et / kabul et kalıbı hiçbir incelemede öne çıkmadı — bizim randevu kartı alanı boş; (d) sürgüsüz pazarlık: gecikme + gizli sabır işliyor, belirsiz sonuç işlemiyor; (e) basın toplantısı döngüsü ölümcül; (f) hoş ayrıntılar: faks kâğıdı, çekmece, gazete hışırtısı, kupa töreni ve sezon özeti (FM21).

**Ajanın 12 dersi:** nesne = tek işlev; gecikmeli cevap gerilim üretir; bir akşamda bir sezon ölçüsü; iniş yeri seçilebilir; bekleme ekranı dünyanın kısa haberi; beklenti paneli; maç günü takvimde olay; sonucun okunurluğu; haber önemi puanlansın; ritüel sahneler (sezon sonu, kupa); hoca olmayan rolde maçı göster; mizah seyrek. **Kaçınılacak 6:** her şeyi yığan hub; 2–3 alt menü derinlik; aynı soruların döngüsü; masayı düğme paneline çevirmek; belirli saat zorunluluğu; nostalji kabuğu boş iç.

### 6.2 Futbol dışı sevilen arayüzler ve tek odaklı oyunlar

Kaynak: geliştirici blogları, GDC kayıtları, incelemeler (ajan taraması, 2026-10-28; doğrulanamayanlar işaretli). Genel başvuru: Game UI Database (1.341 oyun, 55.000+ ekran; https://www.gameuidatabase.com/about.php).

**İmza kimliği nereden gelir**
- *Persona 5:* her menünün ayrı tasarımı ve geçişi; Hashino "her menü için ayrı program yazılıyor, çok zaman alıyor" (https://kotaku.com/-metaphor-refantazio-persona-5-menu-ui-hashino-1851667088). Sır: üç renk, tek yazı ailesi, seçili öğenin büyümesi, kahramanın menünün içinde durması (https://mechanicsofmagic.com/2022/04/23/visual-design-of-games-persona-5/). Karşı görüş: okunurluk övgülerde kayboldu (https://inverse.com/gaming/persona-5-tactica-user-interface). **Bizim için:** kimlik pahalı animasyondan değil üç renk + tek aile + başkanın (elinin, masasının) her ekranda var olmasından; her menüye ayrı geçiş yazılmaz.
- *Splatoon:* kimliğin çoğu özel yazı tipinden (https://www.nintendo.co.jp/jobs/keyword/18.html). **Bizim için:** 1999 Türk gazete ve dosya tipografisinden tek aile seçilirse kimlik oradan gelir.
- *Hades:* kademeli açılma — codex her karşılaşmada bir satır kazanır, oyuncu boğulmaz (https://benjaminglover.substack.com/p/why-hades-was-a-success). **Bizim için:** oyuncu ve kişi dosyaları boş başlar, her konuşma ve gözlemle bir satır kazanır (S-c'deki notlar tam bu).
- *Balatro:* katmanlı ama küçük geri bildirim; kartlar hiç durmaz, imlece eğilir (https://blakecrosley.com/guides/design/balatro). **Bizim için:** kartı bırakınca "sonuç patlaması" değil, kâğıdın masaya oturması + damga; sarsıntı yok.
- *NieR: Automata:* düz tasarıma bir iki "analog" bordür ve kenar karartması yeter (https://platinumgames.com/official-blog/article/9624). **Bizim için:** kâğıt dilini eskitmeden bir iki dokuyla sahicileştirmek.
- *Dead Space, Alien: Isolation, Firewatch, Metroid Prime:* bilgi dünyanın içindeki nesnede; Alien'da hareket izleyiciye bakınca arka plan bulanır (https://www.engadget.com/2014-10-03-alien-isolation-review-escape-claws.html). **Bizim için:** telefon, dosya ve defter zaten diegetik; eksik olan odak anında odanın bulanması ve her nesnenin fiziksel yerinin belli kalması.
- *Pentiment:* beş el yazısı ailesi, mürekkep önce parlak sonra kurur, hata çizilip düzeltilir (https://lettermatic.com/custom/pentiment, https://www.avclub.com/pentiment-preview). **Bizim için:** defterde tek el yazısı ailesi ve "mürekkep kuruma" mikro hareketi; okunaklı kip şart.
- *Obra Dinn, Tunic, Outer Wilds:* kitap hem günlük hem içindekiler; gemi günlüğü ipuçlarını bağlar. **Bizim için:** oyuncu dosyası aynı zamanda sezonun indeksi olabilir; notlar birbirine bağlı "ipucu" gibi.
- *Disco Elysium:* diyalog akışı taranabilir kısa satırlar; Düşünce Dolabı projeyi az kalsın batıran karmaşıklık (https://80.lv/articles/disco-elysium-working-on-ui-design). **Bizim için:** telefon konuşmaları kısa satırlar; derin sistemi gizli tutma kararı doğru.
- *Shadows of Doubt:* mantar pano hoş ama oyuna etkisi olmadığı için "etkisiz" kaldı (https://colepowered.com/?p=33958). **Bizim için:** görünür bağ mekaniği oyuna etki etmiyorsa koyma.

**Tek şey oyunları**
- *Yes, Your Grace:* dilekçeciler tek tek gelir; verilen söz sonraki haftalarda geri döner (https://store.steampowered.com/app/1115690/Yes_Your_Grace/). Bizim söz ve hafıza sistemiyle aynı.
- *King of Dragon Pass / Six Ages:* olay ekranı = resim + metin + seçenekler, danışmanın görüşü adının altında (https://if50.substack.com/p/1999-king-of-dragon-pass). **Bizim için:** kartta iki kişinin tek satırlık görüşü (asistan, ilgili çalışan).
- *Crusader Kings 3:* olay penceresi en çok üç paragraf ve 3–4 seçenek sığdırır, fazlası ayrı sahne (https://admin-forum.paradoxplaza.com/forum/developer-diary/crusader-kings-3-dev-diary-75-in-the-event-of-court-events.1492792); oyuncular küçük olayların köşe bildirimi olmasını istiyor (açılır pencere yorgunluğu). **Bizim için:** kart metni için üç paragraf / iki cevap tavanı; rutin sınıfı sessiz gelsin.
- *Citizen Sleeper:* saatler bölmeli daireler; bekleyen iş bir liste değil, dolan gösterge (https://howtomakeanrpg.com/r/a/case-study-citizen-sleeper.html). **Bizim için:** dosya kapağında dolan daire ya da kalınlaşan sırt: kart sınıfının ömrü böyle görünür.
- *Papers, Please:* dar masa bir özellik; her belge tek başına okunur (https://mechanicsofmagic.com/2021/06/05/design-details-in-papers-please/).
- *Reigns:* beş dakikada yüz karar, hız kalbi (https://inverse.com/gaming/23117-reigns-francois-alliot-nerial-developer-interview). **Bizim için:** bizim kart daha yavaş ve ağır; Reigns'in temposu alınmaz.
- *Hypnospace, Do Not Feed the Monkeys, Orwell:* pencereli sahte masaüstü bilgi mantığını dağıtır; "tek mesele" ilkesiyle çelişir.
- *Mind Scanners, Not Tonight, Beholder, This Is the Police:* ortak eleştiri tekrar ve mini oyun yorgunluğu. **Bizim için:** rutin kart sınıfı 30 hafta aynı etkileşimle sürerse angaryaya döner.
- Dört sorunun özeti: odak = tek kişi/belge merkezde, dünya görünür ama pasif; yan bilgi = kart kapanmadan bakılan sabit göstergeler; erteleme = kimse "sonraya at" düğmesini güzel çözmemiş, en iyisi kendi kendine dolan gösterge; sonuç = gazete ve sonraki kart.

**Geçiş, bekleme, yükleme**
- Bekleme bilgi versin: Mass Effect asansörleri yüklemeyi gizler, ME2'de eylemlerinin sonucu haber olarak okunur (https://kotaku.com/an-oddly-long-banter-filled-history-of-mass-effect-ele-472630862); FM27 "Continue Flow" manşet ve hikâyelerle sezonun evrelerini farklı hissettirir (https://www.footballmanager.com/fm27/features/deeper-more-immersive-world). **Bizim için:** "Maç hesaplanıyor…" örtüsü ve "zaman geçiyor" sahnesi o günün haberini erken gösterir.
- Bekleme oyun olsun ama isteğe bağlı ve atlanabilir (Bayonetta, Splatoon Squid Jump; Namco patenti 2015'e dek engelledi).
- Ritim ve mola: Hollow Knight bankı, Slay the Spire haritası — tur uzunluğuna ölçülü duraklar.
- "Juice it or lose it" (Jonasson & Purho) ve karşı konuşması: cila daldırmayı bozabilir (https://gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-); Swink: anlık geri bildirim yoksa his yoktur. **Bizim için:** dozunda, tek dil.

**Sakin kâğıt estetiği:** sahicilik doku ve mürekkep davranışından (kuruma, yayılma, damga izi), okunurluk tek belgenin tek başına okunmasından ve metnin tam piksel katında durmasından gelir; çatışırsa okunurluk kazanır (Pentiment, Papers Please, Shadows of Doubt). Strange Horticulture'ın en sık eleştirisi minik yazı ve dağınık gezinme (https://www.nintendolife.com/reviews/switch-eshop/strange-horticulture). Cultist Simulator: masa ekrana ölçeklenir, kamera kenardan öteye gitmez.

**Uygulamalar (ele al / ertele / dön):** Things 3 — Bugün ve Bu Akşam aynı ekranda, sağa kaydırarak ertele, görev kart gibi dışarı fırlar (https://www.macstories.net/reviews/things-3-beauty-and-delight-in-a-task-manager/); Apple Mail — "bana hatırlat" ön ayarları ve ertelenenlerin tek bir geçici kutusu; Tinder — kart yığını "tek şeye odaklanmak" için, profili açınca yığındaki yeri kaybetmek eleştirisi. **Beş kalıp:** erteleme ufku ikiden fazla olmasın; ertelenenin tek ve bilinen yeri olsun; tek hareketle karar; göz atma yeri kaybettirmesin; tarih atamak menü değil hareket olsun.

**Ajanın 15 fikri (sıralı):** sabit göstergeler (kasa, hafta, randevu) kart kapanmadan görünür; bekleyen iş gösterge, liste değil; kartta iki kişi görüşü; üç paragraf / iki cevap tavanı; örtüye haber; mürekkep mikro hareketi; tek yazı ailesi kimlik; odakta bulanıklık; tek belge tek başına okunur; kademeli açılma; erteleme ufukları defterde; göz atma geri döner; katmanlı küçük geri bildirim; dosya = sezon indeksi; tek ortak ritim. **Yapılmaması gereken 5:** her menüye ayrı geçiş; pencereli masaüstü; etkisiz görsel bağ mekaniği; sık açılır pencere ve otomatik duraklama; eskitme uğruna küçük yazı.

### 6.3 Odak, göz atma, bekleme ve geçiş kalıpları

Kaynak: Apple HIG, NN/g, W3C, Chrome ve Material belgeleri, oyun wikileri ve incelemeler (ajan taraması, 2026-10-28; oyunlardaki somut bulanıklık ve süre değerleri doğrulanamadı, kurallardaki sayılar belgelerden).

**Odak görünümleri**
- *Pentiment:* sözlük açılınca oyun donar, kamera geri çekilir, önceki ekran el yazması sayfasında minyatüre döner; aynı malzemeden bir sayfa, dönüş yeri belli (https://www.pcgamesn.com/pentiment/obsidian-rpg-game-ux). Yer imli defter menüsü "biraz hantal" bulundu. **Bizim için:** nesne büyürken oda "arka sayfa" olur; gezinme hızı stile feda edilmez.
- *macOS Quick Look:* aynı tuş açar ve kapar, ok tuşları komşuya geçer (https://support.apple.com/guide/mac-help/view-and-edit-files-with-quick-look-mh14119/mac). **Bizim için:** 1–4 tuşları aç/kapa, `[` `]` komşu sayfa (bugünkü gibi).
- *Apple HIG Materials / Sheets / Modality:* ince malzeme arka planın hatırlatıcısıyla bağlamı korur; parlak zemin üstünde ~%35 karartma; macOS sayfası arkayı karartır, watchOS bulanıklaştırır ve renksizleştirir; bir anda tek modal, "uygulama içinde uygulama" hissi yaratma, kapatma yolu hep belli (https://developer.apple.com/design/human-interface-guidelines/materials, https://developer.apple.com/design/human-interface-guidelines/modality). **Bizim için:** tek odak katmanı; kart içinden ikinci kart açılmaz; %30–35 karartma + az bulanıklık; metin bulanık zemine değil kartın kâğıdına basılır.
- *visionOS Motion:* büyük hareketlerde dünyayı döndürme, sabit referans çerçevesi ver; yön kaybı arka plan hareketinden gelir (https://developer.apple.com/design/human-interface-guidelines/motion). **Bizim için:** odaklanırken nesne hareket eder, oda yerinde durur (bugünkü kamera eğilmesi küçük kalır).
- *Hareket azaltma:* Apple ve WCAG 2.3.3 — etkileşimle başlayan hareket kapatılabilmeli; ölçekleme ve bulanıklık kapsama girer; azaltmada zoom yerine çözülme (https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions, https://support.apple.com/en-us/HT202655). **Bizim için:** "sade hareket" ayarı 150 ms çözülmeye düşer; bulanıklık statik.
- *Performans:* `backdrop-filter` pahalıdır, canlandırılırsa 16 ms bütçesini aşar; çözüm önceden bulanmış kopyaları opaklıkla çaprazlamak (https://web.dev/articles/backdrop-filter, https://developer.chrome.com/blog/animated-blur). **Bizim için:** odak açılınca 3B karesi bir kez alınıp bulanıklaştırılır ya da bulanıklık sabit, yalnız opaklık canlanır; Electron'da ölçülür.

**Göz atma**
- *Outlook / Google Calendar / Apple Calendar:* davet cevabı Evet / Hayır / Belki + "Yeni zaman öner"; organizatör kabul etmezse eski saat kalır; Google'da katılımcılar birbirinin müsaitliğini yan yana görür (https://support.microsoft.com/en-us/office/propose-a-new-meeting-time-in-outlook-c041b2c8-fc3c-43b1-979d-3b40463ac0a9, https://workspaceupdates.googleblog.com/2018/07/propose-new-meeting-time-in-google-calendar.html). *Doodle:* aday saatler Evet / Gerekirse / Hayır. **Bizim için:** öneri yapılırken defterin o haftası yan yana; karşı taraf iki aday saat verirse kartın iki yüzü o iki saattir.
- *Slack thread, Apple split view, popover:* panel yanda açılır, kanal görünür kalır; popover kaynağına ok gösterir, dışına dokununca kapanır (https://developer.apple.com/design/human-interface-guidelines/split-views, https://developer.apple.com/design/human-interface-guidelines/popovers). **Bizim için:** göz atma = kart yerinde, yanında defter sayfası; içinde eylem yok; dışına dokunma kapatır, odak kalır.
- *Yes, Your Grace:* bir anda tek dilekçeci, sonrakini görmeden karar; istek ve sonuçları günlükten takip "ayrı iş" oluyor (https://gamecritics.com/gc-staff/yes-your-grace-review/). **Bizim için:** ilgili sayfa (kasa, kadro, defter) karta yapışık görünmeli; hafıza oyuncuya yüklenmez.

**İş yığını ve eleme**
- *HEY:* "Reply Later" ekranın altında görünür yığın, "Focus & Reply" yığını tek sayfada açar (https://www.hey.com/how-it-works/); eleştiri: Paper Trail'e düşeni hatırlamak gerekir. *Superhuman / Gmail snooze:* ertelenen mesaj kaldırılır, seçilen anda gelen kutusunun üstüne döner (https://support.google.com/mail/answer/7622010). *Things 3:* başlangıç tarihi gelince iş Bugün'e düşer. **Bizim için:** ertelenen kart kaybolmaz, masada "Sonra" yığınında durur; bağlı olduğu durakta masanın üstüne, öbür kartların önüne döner.
- *RimWorld:* olaylar sağ kenarda zarf; renk aciliyeti söyler; yalnız seçim gerektiren olay oyunu durdurur; yığın haritayı kapatınca şikâyet (https://rimworldwiki.com/wiki/Events). *CK3:* hız 5'te sık açılır pencere şikâyeti. **Bizim için:** kenar yığını en çok 3 görünür; renk yerine kâğıt türü; oto-duraklama yalnız karar gerektirende, bilgi kesmez.
- *Papers, Please:* kuyruk tek tek, gün sonunda gider ekranı (https://en.wikipedia.org/wiki/Papers,_Please). **Bizim için:** kuyruk görünmez ama hissedilir; durak sonu özeti geçişin ödülü.

**Zamanı ilerletme ve bekleme**
- *FM27 Continue Flow:* Streamlined / Balanced / Comprehensive / Custom; Continue hep aynı yere dönmez (https://www.footballmanager.com/fm27/features/deeper-more-immersive-world). *Stardew:* yatınca günlük kâr dökümü, kabul edilince gün başlar ve kayıt alınır (https://wiki.stardewvalley.net/Day_Cycle). *Darkest Dungeon:* hafta sefere çıkınca döner, kasabada vakit haftayı ilerletmez. **Bizim için:** İlerle'nin durak sıklığı ayar; her durak kısa, kapatılabilir bir özetle kapanır; kayıt o anda (zaten her kararda).
- *NN/g:* 0,1 s doğrudan hissi, 1 s akış, 10 s dikkat sınırı; 1 s altında dönen gösterge dikkat dağıtır; 2–10 s açıklayıcı metinli döngü; 10 s üstü belirli yüzde; sona doğru hızlanan çubuk kısa hissedilir (https://www.nngroup.com/articles/response-times-3-important-limits/, https://www.nngroup.com/articles/progress-indicators/). *Viget deneyi:* iskelet ekran algılanan süreyi en çok uzatan biçim (https://viget.com/articles/a-bone-to-pick-with-skeleton-screens). **Bizim için:** boş kart iskeleti yok; süreye göre biçim.

**Düğme geri bildirimi ve onay**
- *Nielsen #1 ve #3:* sistem durumu görünür, acil çıkış hep var (https://www.nngroup.com/articles/ten-usability-heuristics/). *Apple Feedback / Alerts:* durum bilgisi pasif (Mail'in okunmamış sayısı); uyarı yalnız beklenmedik ve geri alınamaz kayıp için; düğme adı fiil, Evet/Hayır değil (https://developer.apple.com/design/human-interface-guidelines/alerts). *NN/g onay diyaloğu:* çok uyarı okunmaz, geri al'ı tercih et (https://www.nngroup.com/articles/confirmation-dialog/). **Bizim için:** kart uygulama onaysız (H1 doğru); yalnız hoca kovma ve satış imzası gibi geri alınamazlarda kartın ikinci yüzü "vazgeç".
- *Apple Loading / Material süreleri:* en iyi yükleme fark edilmeden biter; belirli gösterge tercih; M3 jetonları: kısa 50–200 ms, orta 250–400, uzun 450–600 (https://developer.apple.com/design/human-interface-guidelines/loading, https://api.flutter.dev/flutter/material/Durations-class.html). **Bizim için:** basma 100–150 ms, odak açılış 250–300, kapanış 200; "Maç hesaplanıyor…" 8 maçın gerçek adımını yazar.
- *Calm Technology (Case):* çevreyi kullan, gerektiğinde merkeze gelsin (https://www.caseorganic.com/post/principles-of-calm-technology). **Bizim için:** mesaj gelince telefon kenarda bir kez kıpırdar; odak açıkken hiç.
- *Slay the Spire haritası:* önümüzdeki duraklar görünür, sürpriz içerikte. **Bizim için:** defterin haftası = harita; İlerle'nin nerede duracağı önceden okunur (alt şeritte "sıradaki durak" var).

**Ajanın odak için 10 kuralı (özet):** tek odak katmanı; nesne büyür, oda durur; açılış 250–300 ms, kapanış 200, basma 100–150, azaltmada 150 ms çözülme; %30–35 karartma + statik 6–8 px bulanıklık (canlandırılmaz); odakta yalnız gün-saat, Duraklat ve nesnenin masadaki boş yeri görünür; arka plan donar, yeni mesaj kuyruğa; göz atma odaktan çıkmaz ve içinde eylem yok; kartın çıkışları: kaydır (uygula), göz at, masaya bırak; dönüş aynı yoldan aynı noktaya, nesne "işlenmiş" görünür; erteleme görünür ama sayısız (en çok 3 kâğıt, durağında en üste döner). **Bekleme için 8 kural:** 1 s altı gösterge yok; 1–10 s içerikli bekleme; 10 s üstü sayılabilir ilerleme; her durak bir özetle kapanır; atlanabilir, tekrarlanmaz; tek geçiş biçimi; durak sıklığı ayar; onay yalnız kayıp için.

## 6.4 Sentez: araştırmadan sonra değişen ve kesinleşen

Araştırma üç şeyi doğruladı, üç şeyi değiştirdi, üç şey ekledi.

**Doğruladı.** (1) Odak modeli doğru yön: masa metaforlu menajerlerin sevilen yanı "bilginin yerinden alınması" (USM 98), nefret edilen yanı panel yığını (FM26 Portal, We Are Football); tek mesele odası bunun tam karşıtı. (2) Tek kart ve onaysız uygulama (H1) literatürle örtüşüyor: Reigns tanıdık jest, Apple ve NN/g "beklenen sonuç için uyarma". (3) Gecikmeli cevap ve gizli sabır (pazarlık kararı) işliyor; belirsiz sonuç işlemiyor (Football Drama) — her kartın sonucu deftere ve gazeteye okunur biçimde düşmeli.

**Değiştirdi.** (1) Bulanıklık canlandırılmaz, statik ve hafif (6–8 px, %30–35 karartma); 3B kare bir kez alınır. §1'deki 180 ms belirme kalır, açılış ölçeklemesi yerine "nesneden büyüme" yalnız opaklık + küçük ölçekle (0,96→1) yapılır; kamera eğilmesi küçük tutulur, oda dönmez. (2) "Sonra" yığını masada görünür olmalı: ertelenen kart kaybolmaz, en çok üç kâğıt kenarda, bağlı olduğu durakta masanın üstüne döner. Bu, "ertelemek üçüncü düğme değildir" kuralını bozmaz: erteleme yine kartı bırakmaktır, ama bıraktığın şey masada görünür. (3) İlerle'nin durak sıklığı ayar olmalı (FM27 Continue Flow): "yalnız karar gerektirende dur" ile "her gelişmede dur" arası iki-üç hazır ayar; cevap geldiğinde durma kuralı korunur.

**Ekledi.** (1) Her durak kısa bir özet kartıyla kapanır (Stardew'un gün sonu, Papers Please'in gider ekranı): geçen süre, gelen iki-üç şey, sıradaki durak; tek dokunuşla geçilir — §1.4'teki "zaman geçiyor" sahnesinin sonu. (2) Kart metni tavanı: üç kısa paragraf ve iki cevap; fazlası ayrı görüşme sahnesine (CK3 dersi). (3) Kartta iki kişinin tek satırlık görüşü (KoDP): bugün "hazır görüş" var, ikinci görüş (asistan) Y2 ile gelir, yeri şimdiden ayrılır. Ayrıca: kademeli açılma (dosyalar boş başlar, her konuşmada satır kazanır — S-c zaten böyle), mürekkep mikro hareketi (defter notu kururken), "Maç hesaplanıyor…" örtüsünde 8 maçın sayısı ve günün manşeti, bilet ve kapak kartları tek dokunuşla geçilir ve ikinci kez beklettirmez, iskelet ekran yok.

**Kesinleşen kaçınılacaklar:** her menüye ayrı geçiş; pencereli masaüstü; oyuna etkisi olmayan görsel bağ mekaniği (ipli pano); sık açılır pencere ve bilgi için oto-duraklama; eskitme uğruna küçük yazı; masayı düğme paneline çevirmek (nesne sayısı sabit); aynı soruların döngüsü (rutin kart sınıfı 30 hafta aynı etkileşimle sürerse angarya); nostalji kabuğu boş iç.

## 7. Kullanıcıya sorular (tercihim önde)

1. **Odak modeli** (§1) ana çerçeve olsun mu: oda bulanır, iş ortada büyük, göz atma yanda, en çok iki derinlik? — *evet*.
2. **"Biz önerelim"** için kalıp: ikinci cevap "ajandadaki ilk boş saati öner" (asistan/defter bulur) — *evet*; alternatif: üçüncü öneriye dek yalnız karşı taraf önerir (bugünkü).
3. **Sol sütun** → masa şeridi (dört simge + rozet, masanın altında) — *tercih*; alternatif: sütun kalsın.
4. **Yazı:** gövde orantılı (IBM Plex Sans), Jersey yalnız büyük başlık ve sayı — *tercih*.
5. **Amber diyeti:** amber yalnız ana eylem ve seçili; rozetler kırmızı/mürekkep — *tercih*.
6. **"Zaman geçiyor" sahnesi** ve kapak kartları (ay başı, transfer, sezon sonu) — *evet, atlanabilir*.
7. **Kart damgası** (KABUL / RED damgası uygulamada) — *evet*.
8. **Maçta skor etiketi** — kural; *köşede küçük*.
9. **Bulanıklık:** gerçek bulanıklık (`backdrop-filter`) mı, yalnız karartma mı? — *bulanıklık + karartma; düşük cihazda yalnız karartma*. Doğrulandı (2026-10-28, bu makinede Chromium): oyun karesinin üstüne `backdrop-filter: blur(7px)` + %35 karartma katmanı 3B odayı bulanıklaştırıyor; Electron aynı motoru kullanır. Hız ölçümü arka planda yapılamadı (sekme gizliyken kare gelmiyor); uygulamada odak açıkken 3B döngü düşük kareye ya da tek kareye indirilerek bedel sıfırlanabilir (odakta zaman zaten durur).
