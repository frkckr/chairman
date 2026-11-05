# Arayüz güncellemesi — kullanıcının maddeleri

Başlangıç: 2026-11-05 (kullanıcı: “adım adım gideceğiz, sen benim onayladıklarımı kaydedeceksin, sonra en son büyük plan şeklinde uygulayacaksın”). Her madde tek tek gelir. Claude maddeyi inceler, buraya yazar, kullanıcı onaylar, sonra sıradaki maddeye geçilir. **Maddeler bitene dek oyun kodu değişmez.** Maddeler bitince hepsi tek bir uygulama planına dönüşür; o plan ayrıca onaylanır.

Durum: **1. ve 2. madde onaylandı ve uygulandı (2026-11-05 akşam, kullanıcı: “3. madde yok, bu iki maddeyle bir güncelleme yap, önce son hâlini göreyim”; karar 96; dal `claude/arayuz-guncelleme`). Uygulama notu en altta. Kullanıcının bakışı bekleniyor.**

| # | Madde | Kaynak | Durum |
|---|---|---|---|
| 1 | Rafine klasik krom: düz düğmeler, tek yazı tipi (Rubik), daha geniş şerit, daha yüksek başlık | kullanıcının tasarımı `1 · Klasik (rafine)` | onaylandı 2026-11-05 |
| 2 | Haberler tamamen kart: her habere tepki, Reigns gibi tek kart destesi | kullanıcının fikri ve tasarımı `1 · Tek kart odak`; seçim Simge kartı · 1 Rafine | onaylandı 2026-11-05 |

---

## 1. Rafine klasik krom (genel yapı) — onaylandı 2026-11-05

**Kaynak.** Kullanıcının tasarım aracında hazırladığı Ofis ekranı (1440×810). Dışa aktarılan dosya [prototipler/arayuz-guncelleme/01-klasik-rafine/R01-Klasik.dc.html](../../prototipler/arayuz-guncelleme/01-klasik-rafine/R01-Klasik.dc.html); görüntüsü [gorunum-1440.png](../../prototipler/arayuz-guncelleme/01-klasik-rafine/gorunum-1440.png). Ölçüler dosyanın satır içi stillerindedir.

**Kullanıcının kararı.** Bu, bugünkü Ofis ekranının rafine edilmiş hâlidir ve **bütün arayüzün genel yapısı** olarak uygulanır. Yerleşim aynı kalır: solda tam boy şerit, sağda üstte kulüp renginde başlık şeridi, ortada sahne, altta krem durum şeridi. Değişen şey görünüş: yazı tipi, düğmelerin biçimi, renk tonları, ölçüler ve aralıklar.

### Değişmeyenler

- Yerleşim ve sıra: şeritte tarih, ‹ Geri · İleri ›, İlerle, on bölüm düğmesi (Ofis … Balkon, tuşlar 1–9, 0), en altta Haber var ve Ayarlar. Başlıkta ekranın adı, “bekliyor” rozeti, kulüp · başkan, sağda KAYDEDİLDİ ve DURAKLAT. Altta tek satır durum şeridi.
- Ana renkler aynı aile: lacivert şerit, sarı seçili düğme ve İlerle, kulüp kırmızısı başlık, krem alt şerit.
- Oda sahnesi 4:3, içerik alanının ortasında; iki yanı koyu lacivert boşluk.

### Farklar (bugün → yeni)

**Yazı tipi**
- Bugün iki aile karışık: kromda Nunito (yuvarlak, 800 kalınlık), tarih ve küçük yazılarda IBM Plex Sans.
- Yeni: kromun tamamında tek aile, **Rubik** (400, 500, 600, 700). Düğmeler 600, başlık ve İlerle 700. Daha az “oyuncak”, daha düzgün ve okunaklı.

**Sol şerit**
- Genişlik: bugün 1440 pencerede 130 piksel (en çok 148) → yeni **184 piksel** (pencerenin ~%12,8'i). Kenar boşluğu 12, öğeler arası 8 piksel.
- Tarih kutusu: köşeleri 8 piksel yuvarlatılmış koyu kutu. Gün adı sarı (16, 600), tarih açık gri (14), **saat büyük ve beyaz (28, 700)**. Bugün saat küçük ve sarı.
- ‹ Geri · İleri ›: çerçeveli küçük kutular yerine **dolu, çerçevesiz** iki düğme (32 piksel yükseklik, 6 piksel köşe).
- İlerle: altında koyu gölge kenarı olan düğme yerine **düz dolu sarı** büyük düğme (44 piksel, yazı 20/700), yanında çizilmiş üçgen ok.
- Bölüm düğmeleri en büyük değişiklik:
  - Bugün: degrade, ince koyu çerçeve, iç gölgeli kabartma; bütün yazılar sarı, 15 piksel 800.
  - Yeni: **düz dolu** (#1E2E66), çerçevesiz, gölgesiz, 6 piksel köşe, 38 piksel yükseklik. Yazı **krem beyazı** (#F6F1E1), 17 piksel 600. Tuş numaraları sağda soluk mavi-gri (13 piksel). Seçili düğme dolu sarı, yazısı lacivert.
  - “yasaklı” etiketi (Transfer altında) açık kırmızı (#FF8A8A). Bugünkü koyu kırmızı lacivert üstünde zor okunuyor.
  - Balkon'un üstündeki ayraç çizgisi yok; on düğme tek liste.
- Haber var: 8 piksel köşeli kırmızı kutu, iki satır (“Haber var” 17/700, “1 cevap · 2 yeni” 13).
- Ayarlar: ince çerçeveli, içi boş düğme (34 piksel).

**Başlık şeridi**
- Yükseklik: bugün ~42 → yeni **64 piksel**.
- Ekranın adı **büyük** (32 piksel, 700, beyaz). Bugün ~21 piksel.
- “1 bekliyor” rozeti: **beyaz zemin üstünde kırmızı yazı**. Bugünkü kırmızı rozet kırmızı şeritte kayboluyor.
- Kulüp · başkan satırı 15 piksel, açık pembe-beyaz.
- KAYDEDİLDİ küçük, aralıklı büyük harf. DURAKLAT **beyaz dolu düğme**, kırmızı yazı, 36 piksel, 6 piksel köşe. Bugünkü küçük köşeli kutunun yerine.

**Alt durum şeridi**
- Yükseklik: bugün iki satır (~58 piksel) → yeni **tek satır, 48 piksel**.
- Kalın etiket ve değer yan yana: “**Sıradaki durak:** 22 Haz Pzt 11:30 · beklediğin cevap gelecek” (15 piksel, koyu gri).

**Genel dil**
- Düz yüzeyler: kabartma, degrade ve iç gölge yok. Derinliği renk tonu verir.
- Köşe dili iki ölçü: küçük düğmelerde 6, kutularda 8 piksel. Rozet tam yuvarlak.
- Aralık ölçeği 4 / 6 / 8 / 12 / 16 / 24 piksel.
- Ekran kenardan kenara; dış çerçeve ya da boşluk yok.

### Renk değerleri

| Görev | Bugün (`STIL.cerceve.palet.cm`) | Yeni |
|---|---|---|
| Şerit zemini | `#14214f` | `#14214F` (aynı) |
| Düğme zemini | degrade `#24387d` → `#1a2b63` | düz `#1E2E66` |
| Kutu (tarih) | `#0d1736` | `#0E1838` |
| Çizgi | `#2c3d78` | `#2C3D7A` |
| Düğme yazısı | sarı `#f2cd4b` | krem `#F6F1E1` |
| Soluk yazı (tuş no.) | `#8f98b8` | `#8E9BC9` |
| Açık yazı (tarih, Geri) | `#cfc596` | `#DDE3F5` |
| Sarı (seçili, İlerle) | degrade `#ffe37e` → `#f1c847` | düz `#F2C230` |
| Sarının üstündeki yazı | `#0c1638` | `#14214F` |
| Kırmızı (başlık, Haber var) | `#c8281e` | `#C8202F` |
| Başlıkta soluk yazı | — | `#FFE3E3` |
| Uyarı yazısı (yasaklı) | `#c8281e` | `#FF8A8A` |
| Sahnenin yan boşluğu | `#070b1c` | `#0A1230` |
| Alt şerit zemini / yazısı | `#f6f0e2` / koyu | `#F6F0E2` / `#3A3A48` |

### Uygulamada dikkat edilecekler (büyük planda çözülecek; şimdi karar değil)

- **Ölçekleme.** Tasarım 1440×810'da sabit piksel. Oyunda krom pencereyle büyüyüp küçülüyor. Değerler 1440 genişliğe oranlanır; şimdiki alt sınırlar korunur (her metin en az 12, gövde en az 16 piksel). Şeridin en çok 148 piksel sınırı kalkar ya da yükselir. Alçak pencere kuralı (oyun alanı ~670 pikselin altındaysa sıkışan şerit) yeni ölçülerle yeniden ayarlanır.
- **Kulüp rengi.** Başlık bugün kulübün renginden geliyor, yazı rengi parlaklığa göre seçiliyor. Yeni kırmızı (#C8202F) Demirkapı'nın rengi olarak okunur. Başka kulüp renklerinde rozetin ve DURAKLAT'ın “beyaz zemin + kulüp rengi yazı” kuralı aynen işler.
- **Yazı tipi kapsamı.** Tasarım yalnız kromu gösteriyor. Rubik'in bölümlerin içine de (Haberler, Lig, Finans tabloları) yayılıp yayılmayacağı ve belgelerdeki serif'in kalıp kalmayacağı sonraki maddelerde netleşir. Varsayılan öneri: krom ve koyu paneller Rubik, belge ve gazete serif'i kalır.
- **Kâğıt görünümü.** Ayarlar › Okuma › Görünüm'deki açık “Kâğıt” paleti aynı düz düğme diline uyarlanır.
- **Masaüstü (Steam).** Rubik de öbür yazı tipleri gibi pakete gömülür (borç B49 ile birlikte).
- **Denetim.** Uygulama turunda okunurluk aracı (beş pencere) ve krom değen akış bölümleri koşar.

---

## 2. Haberler tamamen kart (onaylandı 2026-11-05)

**Kaynak.** Kullanıcının 2026-11-05 mesajı ve tasarımı [prototipler/arayuz-guncelleme/02-tek-kart/H01-TekKart.dc.html](../../prototipler/arayuz-guncelleme/02-tek-kart/H01-TekKart.dc.html), görüntüsü [gorunum-1440.png](../../prototipler/arayuz-guncelleme/02-tek-kart/gorunum-1440.png).

**Kullanıcının fikri (kendi sözleriyle özet).**
- Haberler'e tıklayınca tek kart odağı açılır. Dışarıdan gelen haber de, cevap bekleyen karar da karttır. Düz okuyup geçmek yok: her habere sağa ya da sola kaydırarak bir tepki verilir, “boş tepki de olsa”.
- Cevaplar kaydırınca belirir; “aynı Reigns'i kopyalıyoruz burada”.
- Tasarımdaki yan düğmeler (seçeneği düğmeyle seçmek) ve kaç haber kaldığının sayısı olmayacak. Kartlar üst üste görünebilir. Bir karta verilen cevabın devamı kart olarak gelebilir.
- Oyuncunun hangi kartlarla ilgilendiği, hangilerini “sallamadığı” zamanla öğrenilir; ilgisini çeken kartlara ağırlık verilir, yeni şeyler denenir.
- Kart hafızası (kütüphanesi) senaryolarla birlikte büyür.
- Amaç: CM/FM'deki gibi haberi hızla geçip okumamak olmasın; oyun klasik “panelden habere cevap verme” oyunlarından ayrışsın.
- Kullanıcı emin değil; Claude'un fikrini ve Reigns'e ne kadar yaklaşılabileceğini sordu.

**Ölçüm (2026-11-05, bugünkü oyun; yapay 0–0 maçlarla hızlı ilerleme, tohum 7).**
- Sezon öncesi 20 gün: 27 karar kartı, ~21 kulübe dair haber, 5 arka plan satırı. Günde ~2,5 kart.
- Sezon içi 14 gün: 8 karar, 8 kulübe dair haber, 13 arka plan satırı (çoğu öbür maçların sonucu). Öbür maçlar haftada tek karta inerse günde ~1,3 kart.
- Sınır: yapay maçlarda gol, kart ve sakatlık yok; gerçek maçlarda sezon içi sayı biraz yükselir.
- Sonuç: hacim az. “Her haber kart” oyuncuyu boğmaz; asıl risk destenin ince kalmasıdır.

**Reigns nasıl çalışıyor (araştırma).**
- Ekran: ortada tek kart (yüzünde kişinin sade çizimi), üstünde soru, altında kişinin adı. En üstte dört gösterge (kilise, halk, ordu, hazine).
- Kart yana eğilince cevabın kısa metni kartın üst köşesinde belirir. Aynı anda etkilenecek göstergelerin üstünde nokta çıkar: büyük nokta büyük etki; yönü söylemez.
- Bırakınca kart düşer, sıradaki kart desteden dönerek gelir.
- Kart seçimi “torba” yöntemi: bütün kartlardan duruma uymayanlar çıkar, yeni oynananlar çıkar, kalanlara ağırlık verilir, biri çekilir. Bir olay sürerken (savaş gibi) ona bağlı kartların ağırlığı büyür. Bazı cevaplar desteye yeni kart ekler, kısa zincirler kurar.
- Koşula bağlı olmayan şakacı kartlar (soytarı) arada dolgu olur. Bazı anlatı kartlarında iki cevap da aynıdır.
- Kaynaklar: [Game Developer — adaptive narrative in Reigns](https://gamedeveloper.com/design/game-design-deep-dive-creating-an-adaptive-narrative-in-i-reigns-i-), [GDC — The Casual (but Regal) Swipe](https://gdcvault.com/play/1024278/The-Casual-(but-Regal)-Swipe), [lochrist — Reigns and emerging narrative](https://lochrist.github.io/blog/2017-04-03-reigns-and-emerging-narrative). Ekranın ayrıntıları (köşede beliren cevap, noktalar, dönen kart, aynı cevaplı kartlar) Claude'un oyun bilgisinden; bu kaynaklarda doğrulanamadı.

**Claude'un ilk görüşü: evet, yapılmalı; beş koşulla** (kullanıcının cevabı aşağıda “Kullanıcının kararları”nda; koşul 4 değişti).

Neden evet:
- Oyunda kart zaten Reigns gibi çalışıyor (karar 62). Bugün Haberler'de iki ayrı dil var: liste okumak ve kart kaydırmak. Tek dile inmek oyunu sadeleştirir.
- Hacim az (yukarıdaki ölçüm). Sakin günde yapacak küçük ama anlamlı bir şey olur.
- Karar 95'in ilkesiyle uyumlu: tepki vermek bedelsizdir, bedel yine yalnız gerçek kararlardadır.
- AR2'nin emeği boşa gitmez: tek gelişme kaydı, kaynak (kim söyledi), kanal görünüşleri ve gruplama aynen kullanılır. Yalnız liste düzeni kalkar.
- AR3-a'nın metin seçicisi Reigns'in torbasıyla aynı fikirdir (koşul, tekrar etmeme). Kart kütüphanesi onun üstüne kurulur.

Koşullar:
1. **Boş tepki tamamen boş olmasın.** Her tepki üç şeyden en az birini yapar: başkanın sesini verir (karakter, mizah), ilgi işareti bırakır, bazen bir tohum eker (devam kartı, birinin hatırlaması, takibe alma). AR3-a'nın anı kaydı buna hazır: “Başkan geçen ay buna gülmüştü.” On tepkiden yedisi hiçbir şey yapmazsa oyuncu körlemesine kaydırmayı öğrenir.
2. **Haber kartında tuzak olmaz.** Sıradan bir habere verilen tepki gizlice büyük sonuç doğurmaz. Ağırlık karar kartlarındadır ve kart bunu belli eder. Yoksa oyuncu her kartta uzun uzun düşünmek zorunda kalır.
3. **Kaydırırken “neye dokunuyor” ipucu.** Reigns'te bunu noktalar yapar. Bizde gösterge çubuğu yok ve olmayacak. Karşılığı: kart eğilince etkilenecek tarafın küçük simgesi belirir (kasa, hoca, tribün, basın, bir kişinin yüzü). Sayı ve yön yok.
4. **Uzun içerik kartın arkasında.** Mali rapor, maç sayfası, gazete yazısı karta sığmaz. Kart başlığı taşır; karta dokununca belge kendi bölümünde açılır, dönünce tepki verilir.
5. **Öbür maçlar ve küçük satırlar tek kartta toplanır.** Haftanın yedi sonucu yedi kart olmaz; “Haftanın sonuçları” tek karttır.

**Reigns'e ne kadar yaklaşılır.**
- Mekanik alınır: tek kart, sağa-sola kaydırma, cevabın kaydırınca belirmesi, deste hissi, zincir, torba. Bu mekanik başka kart oyunlarında da kullanılıyor.
- Görünüş alınmaz: Reigns'in düz geometrik portreleri, üstteki dört gösterge ve noktaları, kart arkası. Bunlar o oyunun kimliği.
- Kendi tarzımız: **kartın gövdesi geldiği kanalın biçimini alır.** Telefon mesajı kartı (kişinin yüzü ve balon), gazete kupürü kartı, resmî yazı kartı (antet), skor tabelası kartı, menajer teleksi, kapı kartı. AR2'de bu görünüşlerin hepsi çizildi. Bırakınca damga basılması da (U2) bizim imzamız.
- Yazı disiplini Reigns'ten: soru en çok iki satır, cevap birkaç kelime.

**Kullanıcının kararları (2026-11-05, ikinci mesaj).**
- **Kartlı sisteme geçiliyor**, hacim ne olursa olsun. Senaryolar arka plandaki mekaniktir, kartlar oyunun görünen yüzüdür; hacim senaryolarla artacak.
- Koşul 1 (boş tepki tamamen boş olmasın), 2 (haber kartında tuzak yok), 3 (kaydırırken “neye dokunuyor” ipucu) ve 5 (küçük satırlar tek kartta): kabul.
- **Koşul 4 değişti:** uzun içerik kartın arkasında durmaz. Kartın **ekleri** olur (posta eki gibi); karta ilişkin dosya varsa kaydırmadan önce incelenir. Tasarıma yedirilecek.
- Kartın gövdesi geldiği kanalın biçimini alır: kabul (“çok beğendim”).
- **Kartlar bitmeden İlerle çalışmaz.**
- **Sayı yok.** Destenin kalınlığı görünür, o kadar.
- Klavye kalır (←/→ önizler, Enter uygular).
- İlgi profili şimdi yok: her kart gelir. Oyunun son ayarında düşünülür.
- Tepki metinleri TEST olarak yazılır; önce ekran ve kartlar görülsün.
- Sonraya bırakma ve arşiv: kullanıcı nötr, Claude yeniden düşündü (aşağıda).

**Sonraya bırakma — Claude'un yeniden düşünülmüş önerisi (onay bekliyor).**
- *Önceki önerinin zayıflığı:* “yalnız izin verilen kartlarda” demek ayrı bir izin listesi tutmayı gerektirirdi; oyuncu da neden birinin beklediğini, öbürünün beklemediğini anlamazdı.
- *Yeni kural, liste yok, kurgudan çıkar:* **kâğıt bekler, insan beklemez.** Masana gelen yazı, teklif, mesaj bekleyebilir. Kapıdaki ziyaretçi, karşında oturan kişi ve son günü gelmiş iş bekleyemez. Haber kartı zaten bekletilmez (tepki bedelsiz, bekletmenin anlamı yok).
- *Hareket:* kartı aşağı çekmek. Aşağı çekince de bir yüz belirir ve bu yüz karta göredir: danışılacak biri varsa **“Hocaya danışayım”** / **“Nusret Bey baksın”**, yoksa **“Bir gece düşüneyim”**. Kart masaya iner; deste bitmiş sayılır, İlerle açılır.
- *Kazancı:* kart geri döndüğünde daha zengindir. Danıştıysan o kişinin görüşü karta **ek** olarak takılmıştır (ek fikrini kullanır). Bu, karar 95'teki “yarına bırakmanın sebebi ve kazancı vardır” kuralının kendisi.
- *Bedeli:* kartın sınıfından gelir; bu sınıflar oyunda zaten var (fırsat, sorun, rutin, pazarlık). Fırsat beklerken kaçabilir, sorun büyüyebilir, rutin hiçbir şey olmaz, pazarlıkta karşı taraf yumuşar ya da sabrı tükenir. Dönen kart ne değiştiğini söyler: “Beklerken teklif 115'ten 119'a çıktı” ya da “Beklerken başka kulüp araya girdi.”
- *Hatırlatma:* masada unutulan işi bir kişi kendi sesiyle hatırlatır; bu da bir tepki kartıdır (mizahın yeri). Sayaç ya da kırmızı uyarı yok.
- *Son gün:* kart son gününün sabahı kendiliğinden destenin üstüne döner ve artık aşağı inmez. Böylece “cevapsız kaldı, kaçtı” diye sessiz bir kayıp olmaz.
- *Sınır:* aşağı çekme yalnız karar kartlarında. Bedelsiz erteleme oyunu “her şeyi yarına at”a çevirirse sınıfların bedeli sıkılaştırılır (oynama denemesinde bakılır).

**Geçmişe bakma — Claude'un yeniden düşünülmüş önerisi (onay bekliyor).**
- *Önceki öneri (“ayrı arşiv yok”) neden eksikti:* iki gerçek ihtiyacı karşılamıyordu. Biri “az önce ne dedi, hızlı geçtim”. Öbürü “ben buna ne cevap vermiştim”. Gazete ve telefon içeriği tutar ama senin cevabını tek yerde göstermez.
- *Yeni öneri: oynanmış kartlar yığını.* Destenin yanında, cevaplanan kartların üst üste konduğu ikinci yığın. En üstteki kart damgasıyla görünür. Yığına dokununca kartlar geriye doğru tek tek çevrilir; yalnız okunur, cevap değişmez. Liste, sekme ya da sayı yok; deste metaforunun içinde kalır.
- *Eski işler:* yığın yakın geçmişi tutar (kaç kart: TEST). Daha eskisi ait olduğu yerde durur: kişinin konuşması Telefon'da, dosya Kulüp'te, basın Gazete'de.
- *Geçmişin asıl taşıyıcısı kartın kendisi:* haftalar sonra gelen devam kartı eski kararı ek olarak getirir (“3 hafta önce sabır demiştin”). Oyuncu aramaz, kart hatırlatır.

**Claude'un verdiği küçük kararlar (itiraz yoksa plana böyle girer).**
- Destenin sırası: olay sırası (eski önce); bir cevabın hemen doğurduğu devam kartı üste gelir.
- Masadaki bekleyen kartlar İlerle'yi kilitlemez; yalnız destedekiler kilitler.
- Telefon bölümü kalır: konuşmanın geçmişi ve başkanın kendi başlattığı mesaj oradadır. Gelen mesaj kart olarak düşer.
- Ek açılınca kartın yanında kâğıt olarak durur; kart yerinde kalır, kaydırmak için eki kapatmak gerekmez.

**Kart görünüşü: on önizleme (2026-11-05; seçim kullanıcıda).** Etkileşimli sayfa [prototipler/arayuz-guncelleme/02-tek-kart/secenekler/index.html](../../prototipler/arayuz-guncelleme/02-tek-kart/secenekler/index.html) (`?t=1`…`10`, `?hepsi=1` hepsi küçük), genel görüntü [genel.png](../../prototipler/arayuz-guncelleme/02-tek-kart/secenekler/genel.png). Hepsinde aynı TEST destesi: Nusret Bey'in sponsor teklifi (karar, iki ek, masaya bırakılabilir), Şükrü Hoca'nın kamp mesajı (“Antalya olmaz mı?” devam kartı doğurur), gazete kupürü, haftanın sonuçları tek kartta, Federasyon yazısı (iki ek, masaya bırakılabilir), kapıdaki Cemil Usta (bekletilemez). Kartlar sürüklenir ya da ←/→ ile önizlenip Enter ile uygulanır, ↓ masaya bırakır; deste bitince İlerle açılır ve masadaki kartlar ertesi gün ekiyle döner; oynananlar yığınına dokununca geriye doğru çevrilir. Sayı yok; destenin kalınlığı görünür. Çerçeve 1. maddenin.
1. *Klasik kart* — kremsi kart, üstte kanal rengi; cevap üstten sarı şerit olarak iner; ekler kartın altında, açılınca yanında kâğıt.
2. *Simge kartı* — Reigns düzeni: soru kartın üstünde sabit, kartta kişinin büyük yüzü ya da kurumun simgesi, ad ve ekler altta; cevap kartın üst yarısına yazılır.
3. *Manila dosya* — kart dosya, daktilo yazısı; ekler kenardan çıkan sekmeler; cevap lastik damga (iki mürekkep rengi).
4. *Bildirim* — koyu cam kart; kaydırınca arkasından cevabın rengi ve metni açılır; deste bildirim yığını.
5. *Kâğıt kolaj* — her kanal kendi kâğıdında (kupür, not, resmî yazı), bantlı; cevap köşeye yapışan not kâğıdı; ekler ataşlı.
6. *Teletext* — CM 01/02 ve TV sayfası dili, piksel başlık; cevap alt satırda yanıp söner.
7. *Koleksiyon kartı* — dikey oyun kartı, çerçeve kanal renginde, ad plakası ve resim penceresi; cevap kurdele; ekler yanında küçük kartlar.
8. *Büyük yazı* — çerçevesiz, yazı büyük, zemin kanalın rengine bürünür; cevap köşede dev kelime.
9. *Masa üstü* — kart masada yatar, tutunca doğrulup kalkar; deste solda, oynananlar sağda; ekler kartın altından taşar.
10. *İş masası* — kart solda; sağda hep açık sütun (kartın ekleri, son oynananlar); cevabın yüzü kartın altında ayrıntılı.

Önizlemenin sınırları: metinler TEST; yüzler oyunun piksel portresinin kaba benzeri; ses ve gerçek kayıt yok; kart sayısı az (yoğun günün hissini vermez).

**Kullanıcının seçimi (2026-11-05, üçüncü mesaj).**
- **2 · Simge kartı seçildi** (Reigns düzeni: soru üstte sabit, kartta büyük yüz ya da kurum simgesi). Bunun üstünde on varyant istendi.
- **Damga yok.** Kart bırakılınca kırmızı damga basılmaz; kart cevabın yönünde uçar. (Bugünkü oyundaki U2 damgası da bu maddeyle kalkar.)
- **Oynananlar yığını iptal (şimdilik).** Sağ alttaki yığın ve geriye doğru çevirme kalkar; Claude'un “geçmişe bakma” önerisi bu aşamada uygulanmaz. Geçmiş, ait olduğu yerde (Telefon, Gazete, dosyalar) ve devam kartının ekinde kalır.
- **Kaynak satırı okunmuyor.** “Nusret Bey · Mali işler müdürü · bugün 10:00” küçük ve soluk; yeri ve boyu değişir. Varyantlar bunun farklı yerlerini dener (kartın içinde ad plakası, konuşma balonu, sorunun üstünde imza, kartın altında büyük ad).

**Simge kartı: on varyant (2026-11-05; seçim kullanıcıda).** Etkileşimli sayfa [prototipler/arayuz-guncelleme/02-tek-kart/simge/index.html](../../prototipler/arayuz-guncelleme/02-tek-kart/simge/index.html) (`?v=1`…`10`, `?hepsi=1`), genel görüntü [genel.png](../../prototipler/arayuz-guncelleme/02-tek-kart/simge/genel.png). Aynı TEST destesi; damga ve oynananlar yok; yeni kart desteden dönerek gelir. Kaynak satırı her varyantta en az 19–24 piksel ad ve 13–15 piksel açık renkli görevle.
1. *Rafine* — 2'nin kendisi; ad plakası kartın içinde altta, krem zeminde koyu yazı (kartla birlikte gider); ekler kartın altında.
2. *Ad üstte, cevap sorunun yerinde* — kartın tepesinde koyu ad şeridi; kaydırınca üstteki soru söner, yerine büyük sarı cevap gelir.
3. *Konuşma balonu* — soru kişinin balonu; ad ve görevi balonun başında, ekler balonun altında; cevap kartın köşesinde.
4. *Kanal zemini* — sahne haberin rengine bürünür; kart beyaz çerçeveli; cevap alttan sarı yükselir; görev etiket içinde.
5. *Fotoğraf kart* — yüz kartın tamamını kaplar; ad kartın altında koyu geçişin üstünde; çerçevesiz.
6. *Yan yana* — kart solda; sağda ad, soru ve “Sen:” cevabın yeri; ekler sözün altında.
7. *Hepsi kartta* — büyük kart: üstte soru, ortada yüz, altta ad; cevap sorunun üstüne sarı gelir; ekler kartın sağında.
8. *Kâğıt ve kartvizit* — krem kâğıt kart, yüz oval çerçevede; soru serif; ad kartvizitte; cevap kartın üst kenarında sekme.
9. *Kenar cevabı* — kart ışık altında; cevap kartın gittiği yanda büyük yazıyla; ad kartın altında.
10. *Sade* — çerçevesiz kare yüz; üstte imza satırı (ad · görev · saat) ve büyük soru; cevap kartın yanında hap; deste alttaki çizgiler.


**Etkilenecek kararlar.** Karar 87 (tek liste, Cevap bekliyor sekmesi), karar 90 ve 94'ün Haberler düzeni (üstte liste altta ayrıntı, N tuşu) yerini bu maddeye bırakır. Kayıt, kaynak ve kanal görünüşleri kalır. Karar 95'in “yarına bırak”ı bu maddenin aşağı çekme hareketiyle uygulanır (AR3-e'nin kapsamı buna göre yeniden yazılır).


**Seçim (2026-11-05, kullanıcı: “1 Rafine olsun”).** Haberler'in kart görünüşü **Simge kartı · 1 Rafine**: [simge/index.html?v=1](../../prototipler/arayuz-guncelleme/02-tek-kart/simge/index.html). Uygulamada esas alınacaklar:
- Soru kartın üstünde, sabit; üstünde küçük sarı tür etiketi (“SPONSOR TEKLİFİ”). Soru en çok iki satır.
- Kart dikey (önizlemede 350×410), krem çerçeveli; zemini haberin kanalının renginde; ortada kişinin büyük yüzü, kurumun kutusu (GZT, LİG, TFF) ya da kulübün arması; sol üstte kanal etiketi (Teklif, Mesaj, Gazete, Lig, Resmî yazı, Kapı).
- **Ad plakası kartın içinde, altta:** krem zeminde koyu, büyük ad (21 piksel) ve altında görev · saat (14 piksel). Kartla birlikte gider.
- Ekler kartın altında, hap düğmeler; açılınca kâğıt kartın yanında, kart sola kayar.
- Cevap kaydırınca kartın üst yarısında koyu bantta: cevabın adı, kısa sonucu ve “neye dokunuyor” simgeleri (kasa, tribün, basın, iş, kişinin yüzü). Sayı ve yön yok.
- Deste kartın arkasında kart sırtlarıyla, kalınlığı görünür; sayı yok. Yeni kart desteden dönerek gelir; bırakılan kart cevabın yönüne uçar. Damga ve oynananlar yığını yok.
- **1. maddeyle ilişkisi:** 1. maddenin tasarımındaki sayılar (“1 bekliyor” rozeti, “Haber var · 1 cevap · 2 yeni”) bu maddeyle kalkar: Haber var yalnız yanar, başlıkta rozet yok.

**Erteleme yok (2026-11-05, kullanıcı: “şimdilik erteleme olmasın kartlarda, her şeyle anlık ilgilenmek zorunda olalım; zamanla kartları oturttukça ertelemeyi tekrar düşünürüz”).**
- Her kart geldiği anda cevaplanır; aşağı çekme, “masada kalsın”, danışma için bekletme ve “Masada · yarın döner” yeri yok. Claude'un “kâğıt bekler, insan beklemez” önerisi kayıtta durur, uygulanmaz.
- Deste bitmeden İlerle çalışmaz kuralıyla birlikte: her İlerle'nin arasında gelen kartların hepsi o an cevaplanır. Bu yüzden “cevap bekliyor”, “son cevap” ve cevapsız kalıp kaçan karar kalmaz.
- Ekler ve danışma ihtiyacı kartın içinde karşılanır: kişinin görüşü gerekiyorsa karta baştan ek olarak takılı gelir.
- **Karar 95 ile ilişkisi:** karar 95'teki “yarına bırak” (sebebi ve kazancı olan erteleme; AR3-e) kartlarda şimdilik uygulanmaz; kartlar oturunca yeniden düşünülür. Dosyanın sahibi, devret/devral ve çakışma bu karardan etkilenmez.
- Önizleme buna göre güncellendi: aşağı çekme kalktı.

---

## Uygulama notu (2026-11-05 akşam; karar 96)

Kullanıcı başka madde getirmedi; iki madde tek güncelleme olarak uygulandı. Claude'un uygulama kararları (kesin kullanıcı kararını değiştirmez):
- **Krom:** palet `STIL.cerceve.palet.cm` (düz düğme: `dugmeUst` = `dugmeAlt`; yeni `tus`, `kilit`), şerit oranı karenin genişliğinin 0,17'si (1440×810'da 184 px), oyun CM çerçevesinde kenardan kenara (sayfa kenarı ve kare gölgesi yok), ölçüler tasarımın pikselinden şeridin 15 px yazısına oranlı (`js/ekran-cerceve.js`). Kâğıt görünümü aynı düz dile geçti. Başlık şeridinin rengi yine kulübün armasından.
- **Deste:** kural `js/gelismeler.js` `haberDestesi` (saf) ve `gelismeTepki` (komut): kararlar (iki cevaplı, bekleyen) ve son üç günün okunmamış haberleri olay sırasıyla; aynı günün arka satırları tek kart; bir kararın konusuna ait telefon mesajı ayrı kart olmaz (karar verilince konu görüldü yazılır). Tepki okundu yazar, başka etkisi yok (TEST; İB7). Kayıt değişmedi.
- **Ekran:** `js/ekran-haberler.js` `haberDestesiGorunumu`; kaydırma ve klavye bugünkü tek kart bileşeniyle (`kartEtkilesimKur`, damga kapalı — dosyada ve telefonda da). Ekler: Ayrıntı (haberde kanalın görünüşü, kararda hazır görüş ve bağlam) kartın yanında kâğıt; öbür ekler gideceği yeri açar, ‹ Geri desteye döner.
- **Kapı:** destede kart varken İlerle soluk durur, basınca Haberler açılır; alt şeritte “Önce Haberler’deki kartlar.” Ayarlar › Geliştirici'de TEST anahtarı (“Kartlar bitmeden İlerle kapalı”); akış denemeleri eski bölümlerde kapıyı kapatır.
- **Kalkanlar:** Haberler'in sekmeleri, listesi, ayrıntı paneli, N ve [ ] tuşları, Bugün satırı, Takipte (devredilen iş dosyada izlenir), başlıktaki “n bekliyor”, Haber var'daki sayılar, İlerle özetindeki “Haberler: n cevap · n yeni”.
- **Denetim (dizüstü):** hızlı kademe; akış §42 (yeni: kart destesi) ve §45 geçti. Uyarlanan ama koşmayan bölümler ve okunurluk gece kapısında (B65).
- **Sınırlar:** tepki metinleri kanal başına bir-iki çift (TEST); ilgi profili yok; “neye dokunuyor” simgeleri haberde kanaldan, kararda yok (cevabın simgesi var); yoğun günde deste uzayabilir (oynama denemesinde bakılır).
