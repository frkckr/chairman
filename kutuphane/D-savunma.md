# Bölüm D — Savunma İlkelleri (Defensive Primitives)

Futbol Kütüphanesi'nin savunma bölümü. Amaç, maç motorunun "ilkel × bağlam × rol" diliyle çalıştırabileceği, ezbersiz ama zengin bir bilgi tabanı kurmaktır: her ilkel, hangi evrede ve hangi tetikle açıldığını, kimin ne yaptığını, ne kadar sürdüğünü, neyle ölçüldüğünü ve nasıl yenildiğini söyler. Oyuncu ve hoca kabiliyeti bu ilkelleri açıp kapatır ya da kalitesini ölçekler; ilkelin kendisi değişmez.

Okuma anahtarı:

- Kurallar bugünün kurallarıdır (VAR, yarı otomatik ofsayt dahil); yalnız görüntü retrodur.
- Her sayısal iddianın yanında kaynak bağlantısı vardır. Kaynak türü köşeli parantezle işaretlenir: **[A]** akademik makale / takip verisi, **[B]** veri sağlayıcı ya da taktik analiz (Opta/The Analyst, StatsBomb/Hudl, Spielverlagerung, Premier League resmî analizleri), **[C]** antrenörlük sayfası ya da ikincil anlatım (yalnız ilke ve ders planı düzeyinde güvenilir).
- Bulamadığım sayı "**bulunamadı**", kendi çıkarımım "**tahmin**" diye işaretlidir. Tahminler motor için başlangıç değeri önerisidir, ölçülmüş gerçek değildir.
- Tarama tarihi 2026-10-19. Oturumun web arama bütçesi ikinci turda dolduğu için bazı sayılar (takım başına müdahale ve blok adetleri, Arsenal 2022/23 ofsayt toplamı, geri koşu sayıları, Vogelbein 2014'ün tam metni) doğrulanamadı; ilgili yerlerde yazıyor.

Terim dili: 1. adam (first defender: topa çıkan), 2. adam (second defender: örten), 3. adam / denge (third defender: ters tarafı ve derinliği koruyan), hat (line), serbest adam (spare man / +1), erişim (access: topa müdahale edebilecek mesafede olma), örtme gölgesi (cover shadow), blok (block: topsuz takımın bütün şekli).

---

## D.0 Ortak kavramlar

### Blok yüksekliği ve hat yüksekliği (Block height, defensive line height)

- FIFA'nın Katar 2022 "Enhanced Football Intelligence" tanımı: savunma hattı yüksekliği, "takımın kale çizgisi ile en derindeki saha oyuncusu arasındaki mesafe"dir; topsuzken ne kadar derin savunulduğunu, toplu iken hattın ne kadar yukarı itildiğini gösterir. Sayfada sayı yok. [B] https://fifatrainingcentre.com/en/fwc2022/efi-metrics/efi-metric--defensive-line-height-and-team-length.php
- Spielverlagerung sözlüğü üç pres yüksekliği tanımlar: derin pres (deep/defensive press: rakibin ilk yapım paslarına izin verilir, oyun bir tarafa yönlendirilir, baskı top son üçte birlik bölgeye girince başlar, "on saha oyuncusu kendi ceza sahasının önünde kompakt"), orta pres (middle/midfield press: orta saha çizgisi civarında, pas yolları izlenir), yüksek pres (high/offensive press: rakip savunmacılara ve çoğunlukla kaleciye baskı; arka hat agresif ileri çıkar; büyük dayanıklılık ister). Örnekler: Favre'ın Gladbach'ı (derin), Klopp'un Dortmund'u (orta), Roger Schmidt'in Salzburg/Leverkusen'i (yüksek). [B] https://spielverlagerung.com/glossary/tactical-methods/pressing/
- Metre cinsinden hat yüksekliği için birincil Opta/Skillcorner sayısı **bulunamadı**. İkincil bir açıklayıcı (markstat.club grafiğine dayanarak) 2024/25 Premier League'de Arsenal ve Manchester City'nin ortalama savunma eylemi mesafesini ~51 m, Nottingham Forest ve Leicester'ın derin savunurken 35–40 m olduğunu yazar; yazının "48 m yüksek, 38 m derin" örnekleri ise açıkça temsilîdir. Bu sayıları yalnız büyüklük sırası için kullan. [C] https://statsultra.com/?p=1675
- 2010 Dünya Kupası eleme maçlarındaki 804 savunma geçişinde savunma hattı %75,7 yüksek, %19,4 orta, %4,9 derin sınıflanmış (gözlemsel kodlama, metre değil). [A] https://pmc.ncbi.nlm.nih.gov/articles/PMC5968892/

### Kompaktlık (Compactness)

- Opta Vision (takip verisi) tanımı: savunan takımın saha oyuncularının kapladığı alan. **Yüksek kompaktlık: 600 m²'den az; düşük kompaktlık: 900 m²'den fazla.** 2024/25'te Arsenal, rakip yapım oyununa karşı zamanın %47,0'ında yüksek kompaktlıkta (yalnız küme düşen Ipswich ve Leicester daha çok); Chelsea %26,7 ile en az, düşük kompaktlıkta %30,1 ile en çok. Aynı yazı: Arsenal rakip yapımında zamanın %21,2'sinde alçak blokta; City deplasmanında %61,1 (sezonun üçüncü en yüksek maç oranı). [B] https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league
- Sacchi'nin kuralı: "savunma ile hücum hattı arasında en çok 25 metre" (4-4-2). [B] https://inside.fifa.com/news/sacchi-the-revolutionary-turns-75 ve [C] https://guidetofootball.com/history/the-pressing-era/
- Dikey/yatay hat arası mesafeler için takip verisine dayalı güncel lig ortalaması **bulunamadı**. Motor için başlangıç tahmini: yerleşik orta blokta dikey uzunluk 28–35 m, genişlik 35–45 m; alçak blokta uzunluk 20–28 m (**tahmin**, Sacchi'nin 25 m'si ve Opta'nın 600 m² eşiğinden türetilmiştir: 600 m² ≈ 20 × 30 m).

---

## D.1 İlkeller

### D1. Yüksek blok ve yüksek pres (High block / high press)

- **Evre ve bağlam:** Rakibin kaleciden ya da stoperlerden yapım yaptığı an (kale vuruşu, geri pas, kalecide top). Blok rakip yarı sahada; arka hat orta saha çizgisi civarında ya da üstünde. Tetik: kaleciye geri pas, kenara açılan stopere pas, yavaş ya da havadan gelen yan pas, sırtı dönük alıcı (bk. D3).
- **Roller ve hareket:** Ok ucu (forvet) topu bir tarafa yönlendirir (eğri koşu, D4); kanat hücumcusu bekin pas yolunu kapatır; en yakın orta saha rakip pivotu adam alır; arka hat ileri çıkıp alanı kısaltır ("yüksek pres, arka hattın agresif ileri çıkmasını ister", Spielverlagerung). Kaleci arkadaki boş alanın süpürücüsüdür.
- **Zamanlama:** Pres topun yolda olduğu sürede başlar (ilk adım pas çıkarken; "top yoldayken aralığı kapat", [C] icoachfootball). Bağlılık: ilk tetikten sonra 2–3 pas boyunca sürdürülür; rakip baskıyı kırıp dönerse blok geri çekilir (**tahmin**; StatsBomb karşı pres penceresi 5 sn ile uyumlu, bk. D7).
- **Takım kuralı:** Hat, topun 25–30 m gerisinde (**tahmin**, Sacchi'nin 25 m'sinden); bütün takım topun olduğu yarıya kayar; ters kanat içe daralır. Stamina maliyeti yüksek (Spielverlagerung).
- **Başarı ölçüsü ve gerçek sayılar:**
  - PPDA (bk. D22): 2021/22'de en yoğun pres yapan takımlar Barcelona 7,26, Celta 7,91, Köln 8,00, Bayern 8,10, Liverpool 8,62; en az Troyes/Norwich 16,93, Wolves 14,78, Everton 14,63, Newcastle 14,57 (Wyscout). [B] https://www.premierleague.com/news/4250153
  - Guardiola Barcelona'sının altı maçlık kayan PPDA'sı 6–9 aralığında; Pochettino Southampton'ı ilk altı maçtan sonra 8'in altında (2012/13). [B] https://www.hudl.com/blog/defensive-metrics-measuring-the-intensity-of-a-high-press
  - Yüksek top kazanma (high turnover): Opta tanımı "açık oyunda rakip kalesine 40 m ya da daha yakın başlayan topa sahip olma". 2024/25'in 13. haftasında Tottenham 133 (maç başına 10,2; 2023/24'te Manchester City 11,0 ile lider); Spurs PPDA 8,6 ile lig düşüğü. Son üçte birlik bölge baskıları: Spurs 911 (lig birincisi); Spurs'ün baskılarının %37'si son üçte birlik bölgede, City %40. Yüksek top kazanmadan şut: Bournemouth ve Liverpool 25. [B] https://theanalyst.com/articles/bournemouth-vs-tottenham-pressing-chaos-premier-league
  - 2010 DK: top kaybından sonra geri kazanım geçişlerinin %66,3'ü 0–15 sn'de, %23,5'i 16–30 sn'de, %10,2'si 30 sn'den uzun; kısa geçiş başarıyla anlamlı ilişkili (p = 0,007). [A] https://pmc.ncbi.nlm.nih.gov/articles/PMC5968892/
- **Hücumun panzehiri:** Presin arkasına uzun top (yüksek hattın arkası), üçüncü adam kombinasyonuyla pivotun serbest bırakılması, kaleciyi kullanıp +1 yaratmak, presin yönlendirdiği tarafın tersine hızlı değiştirme. Premier League açıklayıcısı: dezavantaj "savunmanın arkasında kalan alan" ve yorgunluk. [B] https://www.premierleague.com/news/4244321
- **Kabiliyet eşiği:** Görme: tetiği ilk gören forvet ve 6 numara. Karar: bütün ön hat aynı anda "git" kararı (tek kişi geç kalırsa gölge delinir). Yürütme: 1. adamın ilk 5 m ivmesi, kanat oyuncularının tekrar depar kapasitesi, stoperlerin açık alanda koşu hızı ve kalecinin alan okuması.
- **Hoca tarzı:** Rangnick/Red Bull okulu, Roger Schmidt, Klopp (Dortmund'da iç maçlarda yüksek, Avrupa'da orta pres — PL açıklayıcısı), Bielsa, Postecoglou.
- **Ünlü örnekler:** Schmidt'in Salzburg'u (Spielverlagerung), Guardiola Barcelona 2008–12 (PPDA 6–9), 2024/25 Tottenham (PPDA 8,6).
- **Kaynaklar:**
  - [B] Premier League, “Passes per defensive action: explained” (2021/22 Wyscout değerleri) — https://www.premierleague.com/news/4250153
  - [B] Hudl/StatsBomb, Trainor, “Defensive Metrics: Measuring the Intensity of a High Press” (2014) — https://www.hudl.com/blog/defensive-metrics-measuring-the-intensity-of-a-high-press
  - [B] The Analyst (Opta), Bournemouth–Tottenham pres yazısı (2024/25) — https://theanalyst.com/articles/bournemouth-vs-tottenham-pressing-chaos-premier-league
  - [A] Casal ve ark. 2016, Sports 4(4):54 — 2010 DK savunma geçişleri — https://pmc.ncbi.nlm.nih.gov/articles/PMC5968892/
  - [B] Spielverlagerung sözlüğü, “Pressing” — https://spielverlagerung.com/glossary/tactical-methods/pressing/
  - [B] Premier League, “Counter-pressing and the gegenpress: football tactics explained” — https://www.premierleague.com/news/4244321

### D2. Orta blok (Mid block)

- **Evre ve bağlam:** Rakip ilk yapımı geçtikten sonra top orta sahada; blok kendi yarı sahasının üst yarısında, ön hat orta çizgide. En sık görülen topsuz evre: Bauer, Anzer & Shaw'ın CNN tabanlı evre sınıflamasında "orta blok, en sık görülen evre" ve orta blok içinde altı ayrı diziliş ayırt edilmiş (F1 0,76). [A] https://lida.sport-iat.de/dfb/Record/4081226?lng=en (Journal of Sports Analytics 9(1), 2023, DOI 10.3233/JSA-220620)
- **Roller ve hareket:** Ön hat (2 ya da 3) rakip stoperleri **yönlendirir**, kovalamaz; orta saha pas yollarını kapatır ("yapımı yönlendir, boştaki takım arkadaşını kapat, pas yollarını izle" — Spielverlagerung orta pres). Pres kapıları: top kenara, sırtı dönük 6 numaraya ya da yarı alana girince ön hat kapanır. Arka hat orta saha ile 10–15 m arayı korur (**tahmin**).
- **Zamanlama:** Blok rakip topu yatay oynattıkça kayar (pas başına 1,5–2,5 m yatay kayma, **tahmin**); tetik görülünce 2–3 sn'lik agresif pencere açılır, kazanılmazsa blok yeniden kurulur.
- **Takım kuralı:** Hat yüksekliği kendi kalesinden ~40–50 m (StatsUltra'nın Arsenal/City 2024/25 için aktardığı ~51 m yüksek ucudur; [C]). Kompaktlık hedefi Opta'nın "yüksek" eşiği 600 m² civarı.
- **Başarı ölçüsü ve gerçek sayılar:** PPDA 9–12 (2021/22 lig ortası takımlar bu banda düşer, PL listesinden çıkarım); orta üçte birlik bölgede top kazanma payı; rakibin hat kırma pası sayısı (FIFA EFI "line breaks" tanımı var, sayı **bulunamadı**).
- **Hücumun panzehiri:** Bloğun önünde sabırlı top dolaştırıp kayma hatası beklemek; bekin iç koridora girmesiyle kanat oyuncusunu ikilemde bırakmak; hatların arasına "yarım dönüş" alıcı sokmak; hızlı taraf değişimi (blok genişliğine bağlı olarak 2–3 sn'lik kayma süresini yenmek, **tahmin**).
- **Kabiliyet eşiği:** Görme: ön hatta rakip stoperin vücut açısını okuma. Karar: 6 numaranın "çık / kal" seçimi. Yürütme: hat kayma hızı ve aynı anda hareket (kolektif).
- **Hoca tarzı:** Klopp'un Dortmund'u (Spielverlagerung örneği), Simeone'nin 4-4-2'si yüksek baskıya çıkmadığı maçlarda, Tuchel, Arteta 2023–26.
- **Ünlü örnek:** Dortmund 2010–13; Arsenal 2024/25 (rakip yapımına karşı zamanın %47'si yüksek kompaktlıkta, [B] The Analyst).
- **Kaynaklar:**
  - [A] Bauer, Anzer & Shaw 2023, J. Sports Analytics 9(1):39–59 (özet) — https://lida.sport-iat.de/dfb/Record/4081226?lng=en
  - [B] Spielverlagerung sözlüğü, “Pressing” — https://spielverlagerung.com/glossary/tactical-methods/pressing/
  - [C] StatsUltra, hat yüksekliği açıklayıcısı (markstat.club grafiğine dayanır) — https://statsultra.com/?p=1675
  - [B] The Analyst (Opta Vision), takip verisi istatistikleri (2024/25) — https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league
  - [B] Premier League, “Passes per defensive action: explained” (2021/22 Wyscout değerleri) — https://www.premierleague.com/news/4250153

### D3. Pres tetikleri (Pressing triggers)

- **Evre ve bağlam:** Her blok yüksekliğinde geçerli; tetik, bloğun "bekle" kipinden "git" kipine geçişini açan olaydır.
- **Tetik listesi (antrenörlük geleneği; birincil taktik analiz kaynağı bu oturumda okunamadı, [C]):** 
  1. kötü kontrol / uzun ilk dokunuş (bad touch);
  2. geri pas, özellikle kaleciye (back pass);
  3. çizgiye yakın alıcı — taç çizgisi "dost savunmacı" (receiver near the touchline);
  4. sırtı dönük alıcı, kendi kalesine bakan (receiver facing own goal);
  5. yavaş ya da havadan gelen pas — topun yolda kalma süresi uzun (slow or lofted pass);
  6. aynı tarafta sıkışmış rakip — taraf değiştirme seçeneği yok (trapped on one side);
  7. pas verenin başı aşağıda (head down).

  Ders planı kaynakları bu listeyi yedi tetik olarak sıralar; "kötü dokunuşta anında pres, geri pasta pres" ifadeleri ortaktır. [C] https://www.sportsessionplanner.com/s/iZDOh/Pressing-Triggers-&amp (sayfa bu oturumda açılamadı; arama özetinden) ve [C] https://footballgpt.co/blog/master-the-4-3-3-press-triggers-for-youth-amateur-football
- **Roller ve hareket:** Tetiği gören en yakın oyuncu 1. adam olur ve **hemen** çıkar; 2. ve 3. adam onun arkasındaki pas seçeneklerini kapatır (örtme gölgesine girer, D4); arka hat ileri adım atar. Tetik yoksa 1. adam yalnız geciktirir (jokey, D9).
- **Zamanlama:** Tetik penceresi kısadır: kötü kontrolde 1–1,5 sn (alıcının topu yeniden kontrol etmesi kadar), geri pasta topun yolda kaldığı süre + alıcının ilk dokunuşu (~1,5–2,5 sn), sırtı dönük alıcıda dönüş süresi (~1 sn). Bu süreler **tahmin**; ölçülmüş kaynak bulunamadı. StatsBomb'un baskı olayı tanımı pratik eşiktir: baskı, savunmacı topa sahip rakibin 5 yarda (≈4,6 m) yarıçapına girdiğinde (kaleciye karşı 10 yardaya kadar) kaydedilir. [B] https://blogarchive.statsbomb.com/articles/soccer/how-statsbomb-data-helps-measure-counter-pressing/ Opta Vision'da "yoğun baskı" eşiği toplu oyuncuya 2 m'den yakın en az bir rakiptir. [B] https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league
- **Takım kuralı:** Tetik kolektiftir: 1. adam çıkıyorsa herkes bir adım ileri; 1. adam çıkmıyorsa kimse çıkmaz. Yorgunlukta tetik listesi daralır (yalnız kötü kontrol ve geri pas kalır, **tahmin**).
- **Başarı ölçüsü ve gerçek sayılar:** Baskı sonrası top kazanma oranı; StatsBomb'un karşı pres örneğinde Burnley'nin maç başına 18 karşı pres pozisyonu, 5 sn içinde 2,5 geri kazanım (%14, ligde 17.), karşı preslerinin %13'ü şutla bitmiş (lig ortalaması %10). [B] StatsBomb karşı pres yazısı (yukarıdaki bağlantı). Bekkers'in "Pressing Intensity" ölçüsü tetiği zaman-kesişim ile tanımlar: savunmacının topa/rakibe ulaşma süresi T = 1,5 sn eşiğinde lojistik olasılığa çevrilir; 2 m/sn'nin altındaki savunmacı pres yapmıyor sayılır. [A] https://arxiv.org/html/2501.04712v1
- **Hücumun panzehiri:** Tetik vermemek: tek dokunuşla oynamak, sırtı dönükken almamak (açık vücutla alış), kenara giderken içeri dönüş pası hazırlamak, kaleciyi pas çıkışı olarak kullanmak.
- **Kabiliyet eşiği:** Görme: tetiği 0,3–0,5 sn içinde fark etme (tepki süresi; **tahmin**). Karar: tetik doğru mu yoksa tuzak mı. Yürütme: ilk 5 m ivme, eğri koşu.
- **Hoca tarzı:** Her okulda var; Red Bull okulu tetikleri yazılı kural yapar, Simeone tetiği kenara çeker (topun kenara gitmesi tek tetik), Bielsa'da tetik adamdır (D6).
- **Ünlü örnek:** Klopp Liverpool'unun kaleci geri pasına üç forvetle kapanışı (yaygın anlatı, sayısal kaynak **bulunamadı**).
- **Kaynaklar:**
  - [C] Sport Session Planner, “Pressing Triggers” ders planı (sayfa açılamadı; arama özeti) — https://www.sportsessionplanner.com/s/iZDOh/Pressing-Triggers-&amp
  - [C] FootballGPT, 4-3-3 pres tetikleri rehberi — https://footballgpt.co/blog/master-the-4-3-3-press-triggers-for-youth-amateur-football
  - [B] StatsBomb, “How StatsBomb Data Helps Measure Counter-Pressing” — https://blogarchive.statsbomb.com/articles/soccer/how-statsbomb-data-helps-measure-counter-pressing/
  - [B] The Analyst (Opta Vision), takip verisi istatistikleri (2024/25) — https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league
  - [A] Bekkers 2024, “Pressing Intensity” (arXiv 2501.04712) — https://arxiv.org/html/2501.04712v1

### D4. Eğri yaklaşma koşusu ve örtme gölgesi (Curved pressing run, cover shadow)

- **Evre ve bağlam:** 1. adamın topa çıkış biçimi; yüksek ve orta preste en kritik, alçak blokta daha az.
- **Tanım:** Örtme gölgesi, "oyuncunun kendi gövdesiyle bir pası engellemesi; top taşıyan ile boştaki rakip arasında durur; çoğunlukla bölge savunmasında kullanılır." [B] https://spielverlagerung.com/glossary/tactical-methods/cover-shadow/ Gölge, savunmacının arkasında kalan koni ya da üçgen biçimli alandır (çizgi değil); kapatılan oyuncu bu koninin içindedir. [C] https://worldclasscoaching.com/slow-the-opposition-build-up/
- **Roller ve hareket:** 1. adam düz değil **yay** çizerek yaklaşır: koşu, topun kapatılmak istenen tarafındaki pas yolundan gelir, böylece hem top taşıyanı dışa (ya da içe) yönlendirir hem de arkasındaki alıcıyı gölgede tutar. Yayın iç yarıçapı 3–5 m (**tahmin**). Varışta hız kesilir (D9'daki "hızlı yaklaş, yavaş var"); son 2 yarda (≈1,8 m) frenlenir. [C] https://www.icoachfootball.net/1v1-defending-drills-jockeying/
- **Zamanlama:** Yay, top yoldayken başlar; alıcı topu kontrol ettiğinde 1. adam 2–3 m'de ve gölge yerleşmiş olmalıdır (**tahmin**). Geç kalınırsa yay düzleşir ve gölge kaybolur: oyuncu o zaman geciktirmeye döner.
- **Takım kuralı:** Gölgeyle kapatılan oyuncu "boş" sayılmaz; 2. adam ona değil, gölgenin dışındaki ilk seçeneğe gider. Takımın yönlendirme yönü önceden kararlıdır: Simeone/çoğu 4-4-2 dışa ("kenar dost savunmacı"), Favre/Red Bull içe (merkezde kalabalığa). Yön tercihi hoca parametresidir.
- **Başarı ölçüsü ve gerçek sayılar:** Takip verisiyle gölge etkinliği ölçen yayınlanmış sayı **bulunamadı**. Yakın vekil: baskı altında pas tamamlama (Opta "pressured pass", lig ortalaması **bulunamadı**); yüksek top kazanma (D1).
- **Hücumun panzehiri:** Gölgeyi kıran üçüncü adam (gölgedeki oyuncuya değil, onun yanına düşen üçüncüye pas), gölgenin dışına "boşa çıkma" hareketi, top taşıyanın yay yönünün tersine ilk dokunuş.
- **Kabiliyet eşiği:** Görme: arkasındaki alıcıyı görmeden gölgeyi doğru koyma (çevresel farkındalık). Karar: hangi tarafı kapatacağı. Yürütme: ivme + frenleme + yan adım.
- **Hoca tarzı:** Bölge savunması yapan her ekol; Spielverlagerung sözlüğü gölgeyi "çoğunlukla bölge savunmasında" konumlandırır. Adam adama ekollerde (Bielsa) gölge yerine adam vardır.
- **Ünlü örnek:** Firmino'nun Liverpool'da rakip 6 numarayı gölgede tutarak stopere çıkışı (yaygın anlatı; sayısal kaynak **bulunamadı**).
- **Kaynaklar:**
  - [B] Spielverlagerung sözlüğü, “Cover shadow” — https://spielverlagerung.com/glossary/tactical-methods/cover-shadow/
  - [C] World Class Coaching, örtme gölgesi ve yapımı yavaşlatma — https://worldclasscoaching.com/slow-the-opposition-build-up/
  - [C] iCoachFootball, 1v1 savunma ve jokey — https://www.icoachfootball.net/1v1-defending-drills-jockeying/

### D5. Pres–örtme–denge üçlüsü (Pressure–cover–balance)

- **Evre ve bağlam:** Topa yakın her savunma anının mikro yapısı; bütün blok yüksekliklerinde ve geçişte.
- **Roller ve hareket:** 1. adam topa (pres/geciktirme), 2. adam 1. adamın arkasına ve iç çaprazına (örtme: 1. adam geçilirse topu alır, pas yolunu kapatır), 3. adam ve kalanlar topun uzak tarafında derinlik ve genişliği tutar (denge: ters kanat ve arkaya koşuları gözler). Mesafeler: 1.–2. adam arası 4–8 m ve ~45° arka çapraz; 3. adam 2. adamın 8–12 m gerisinde (**tahmin**; FA/UEFA metni bu oturumda doğrulanamadı). Youth-coaching kaynakları aynı ilkeyi "cover and recover" diye anlatır. [C] https://www.soccercoachweekly.net/coaching-advice/developing-soccer-skills-covering-and-recovering
- **Zamanlama:** 2. adam, 1. adam topa çıktığı anda değil **çıkmaya karar verdiği anda** yerini alır (eşzamanlı); 1. adam geçilirse 2. adam 1. adam olur ve eski 1. adam toparlanıp 2. adam olur (rol değişimi ≤ 1 sn, **tahmin**).
- **Takım kuralı:** Topa yakın üçgen her zaman dolu; üçgen bozulursa (2. adam yoksa) 1. adam pres yapmaz, geciktirir.
- **Başarı ölçüsü ve gerçek sayılar:** Doğrudan ölçen lig istatistiği **bulunamadı**. Vekiller: 1v1'de geçilme sayısı (dribbled past), örtme sayesinde ikinci müdahale oranı. Casal ve ark. 2010 DK: geçişlerin %57,7'sinde "ısrarcı" savunma yaklaşımı, %42,3'ünde "bekleyen". [A] https://pmc.ncbi.nlm.nih.gov/articles/PMC5968892/
- **Hücumun panzehiri:** 2. adamı yerinden eden hareket (ikinci hücumcunun 2. adamın bölgesine koşusu), 1. ile 2. adamın arasından pas (örtme açısı bozuksa), hızlı taraf değişimiyle denge oyuncusunu 1v1'e düşürmek.
- **Kabiliyet eşiği:** Görme: 2. adamın hem topu hem arkasındaki rakibi görmesi. Karar: rol değişim hızı. Yürütme: yan koşu ve açı tutma.
- **Hoca tarzı:** Evrensel; bölge ekollerinde roller konuma, adam ekollerinde eşleşmeye göre dağılır.
- **Ünlü örnek:** Sacchi Milan'ının "5 düzenli oyuncu 10 düzensiz oyuncuyu yener" antrenman gösterisi (kaleci + dört savunmacı, ona kadar hücumcuya karşı gol yemedi). [B] https://inside.fifa.com/news/sacchi-the-revolutionary-turns-75
- **Kaynaklar:**
  - [C] Soccer Coach Weekly, “covering and recovering” — https://www.soccercoachweekly.net/coaching-advice/developing-soccer-skills-covering-and-recovering
  - [A] Casal ve ark. 2016, Sports 4(4):54 — 2010 DK savunma geçişleri — https://pmc.ncbi.nlm.nih.gov/articles/PMC5968892/
  - [B] FIFA, “Sacchi the revolutionary turns 75” — https://inside.fifa.com/news/sacchi-the-revolutionary-turns-75

### D6. Pres şemaları: 4-4-2 ile üçlü savunmaya, 4-3-3 ok ucu, adam adama her yerde (Pressing schemes)

- **Evre ve bağlam:** Yüksek ve orta preste ön hattın rakip dizilişine göre eşleşme planı. Üç ana şema:
  1. **4-4-2 ile 3 stopere (2v3):** İki forvet dış stoperlere değil, **orta stopere ve pivota** karşı durur; ön hat orta stoperin pas yolunu kapatıp topu dış stopere yönlendirir; o anda kanat orta saha dış stopere çıkar ve kanat bek rakip kanat beke kayar (zincir). Eksik adam (3v2) ters tarafta kabul edilir; "serbest" bırakılan oyuncu topla en rahatsız stoperdir — Bielsa'nın Leeds'inde de ilke buydu: "topla en rahatsız stoperi bul, top onda kalsın, herkes başkasını tutsun" (Dave Adams). [B] https://archive.trainingground.guru/articles/heckingbottom-bielsas-unique-approach-to-defending
  2. **4-3-3 ok ucu (arrowhead):** Santrfor rakip pivotu gölgede tutarak stopere çıkar; kanat hücumcuları bekleri **içten dışa** kapatır (içe pas yolunu gölgede tutup dışa yönlendirir); 8'ler rakip 8'lere, 6 rakip 10'a. Kalan 3v3 arkada (Spielverlagerung'un "adam adama dinlenme savunması"nın simetriği; bk. D14).
  3. **Adam adama her yerde (all-pitch man-marking):** Her oyuncunun bir rakibi vardır, yalnız bir serbest adam kalır. Bielsa Sheffield United deplasmanında (1-0, 1 Aralık 2018) "orta stoper Pontus Jansson dışında herkes adam adama" oynadı; bekler içe giren kanat oyuncusunu sonuna kadar takip etti, kanatlar rakip beklerle geri koştu. [B] trainingground.guru (yukarıdaki bağlantı). Carragher'ın Liverpool 4-3 Leeds (2020) analizi: "sahanın her yerinde adam adama"; Ayling, Mané'yi Liverpool'un sağ bek bölgesine kadar izledi; "bir adam adamını kaybetti mi Liverpool içeride." [B] https://www.skysports.com/football/news/11095/12072320/jamie-carragher-breaking-down-leeds-man-marking-system FourFourTwo: Bielsa arkada hep bir serbest adam tutar (iki stoper bir forvete, üç stoper iki forvete); zayıflık, bu serbest adam düzenini bozan derinden koşular. [B] https://www.fourfourtwo.com/us/features/how-to-beat-bielsa-why-leeds-uniteds-weakness-lies-in-their-spare-man-system Gasperini'nin Atalanta'sı: üçlü savunma adam adama, stoperler (ör. Djimsiti) rakibi orta sahanın derinine kadar izler; savunma evresinde "dinamik beşli": iki savunmacı adam alırken üç savunmacı arkada kalır. [B] https://fussballs-newsletter-4ebdfb.beehiiv.com/p/gasperinis-manoriented-defense Preste topa en yakın oyuncu tetik olur, yakınındakiler "en yakın rakibe yapışır"; kenarda kanat bek + stoper + orta saha üçgeni topu alır. 2020/21 Serie A: maç başına 14 top kesme (lig birincisi), 15,9 müdahale (üçüncü), 15,3 faul (ikinci). [B] https://themastermindsite.com/2021/05/11/gian-piero-gasperini-atalanta-tactical-analysis-2020-21/
- **Roller ve hareket:** Şema, "kim kime" tablosudur; bölge şemalarında eşleşme top yaklaştıkça devralınır (D12), adam şemasında eşleşme sabittir ve oyuncu rakibini pozisyon dışına kadar izler.
- **Zamanlama:** Bölge şemalarında zincir topun hareketiyle 1 pas gecikmeli kurulur; adam şemasında gecikme yoktur ama **birinin 1v1 kaybetmesi** bütün yapıyı açar (Carragher).
- **Takım kuralı:** Serbest adam sayısı hoca parametresi: 0 (tam adam adama, Bielsa Sheffield United maçı), +1 (Bielsa standardı, Yunanistan 2004), +2 (çoğu bölge ekolü).
- **Başarı ölçüsü ve gerçek sayılar:** PPDA, yüksek top kazanma (D1); adam adama ekollerde müdahale ve faul sayıları yüksektir (Atalanta: 15,9 müdahale, 15,3 faul / maç). Adam adamanın üst ligde zayıflaması: Adams'a göre Championship'te işe yarar çünkü oyuncular 1v1'de markajcıyı geçemez; Premier League'de geçerler ve arka açılır; Cardiff sezon başında adam adamayı bırakmak zorunda kaldı. [B] trainingground.guru
- **Hücumun panzehiri:** Bölge şemalarına: zincirin geç kaldığı tarafa hızlı taraf değişimi, dış stoperin topla ilerlemesi (2v3'te "serbest" bırakılanın sürmesi). Adam adamaya: rotasyon ve markajcıyı istemediği alana çekme (City'nin Cardiff'i "altılı savunmaya" çevirmesi, [B] trainingground.guru), derinden koşuyla serbest adamı ikilemde bırakma (FourFourTwo), 1v1 kalitesi.
- **Kabiliyet eşiği:** Bölge şeması: kolektif algı ve kayma disiplini. Adam şeması: bireysel 1v1 savunma, dayanıklılık (Bielsa "hücumcular dahil herkes savunabilen atlet olmalı"), kaybedince toparlanma hızı.
- **Hoca tarzı:** 4-4-2: Simeone, Ranieri, Rangnick/Hasenhüttl (Red Bull 4-4-2 orta pres, [B] PL karşı pres yazısı); 4-3-3 ok ucu: Klopp Liverpool, Guardiola; adam adama: Bielsa, Gasperini, Rehhagel 2004, Warnock Cardiff.
- **Ünlü örnekler:** Leeds 2018–21, Atalanta 2016–25, Liverpool 2017–22.
- **Kaynaklar:**
  - [B] Training Ground Guru, Heckingbottom/Adams: Bielsa’nın savunma yaklaşımı (2018/19) — https://archive.trainingground.guru/articles/heckingbottom-bielsas-unique-approach-to-defending
  - [B] Sky Sports, Carragher: Leeds’in adam adama sistemi (2020) — https://www.skysports.com/football/news/11095/12072320/jamie-carragher-breaking-down-leeds-man-marking-system
  - [B] FourFourTwo, “How to beat Bielsa” (serbest adam; arama özeti, gövde açılamadı) — https://www.fourfourtwo.com/us/features/how-to-beat-bielsa-why-leeds-uniteds-weakness-lies-in-their-spare-man-system
  - [B] Fussball Coaches Newsletter, Gasperini’nin adam yönelimli savunması — https://fussballs-newsletter-4ebdfb.beehiiv.com/p/gasperinis-manoriented-defense
  - [B] The Mastermind Site, Gasperini/Atalanta 2020/21 analizi — https://themastermindsite.com/2021/05/11/gian-piero-gasperini-atalanta-tactical-analysis-2020-21/
  - [B] Premier League, “Counter-pressing and the gegenpress: football tactics explained” — https://www.premierleague.com/news/4244321

### D7. Karşı pres (Counterpressing, Gegenpressing)

- **Evre ve bağlam:** Top kaybının hemen ardından, savunma geçişinin ilk saniyeleri; top rakibin yapımına geçmeden. Rakibin en düzensiz olduğu andır (PL açıklayıcısı: "rakip topu kazandığı ilk anlarda en savunmasızdır"). [B] https://www.premierleague.com/news/4244321
- **Roller ve hareket:** Topa en yakın oyuncu anında baskı; yakındaki 2–3 oyuncu topu kuşatır ve pas yollarını kapatır; uzaktakiler geri koşuya geçer. Spielverlagerung dört yönelim ayırır: **alan yönelimli, pas yolu yönelimli, düello (adam) yönelimli, top yönelimli**. [B] https://spielverlagerung.com/glossary/tactical-methods/counterpressing/ PL açıklayıcısı: Barcelona top kesme ve bölge örtmesine, Bayern (Guardiola) adam markajına, City karışımına dayandı; Bielsa takımları rotasyonla topu sarar.
- **Zamanlama:** Üç ayrı pencere kullanımda:
  - StatsBomb **5 saniye**: karşı baskı, top kaybından sonraki 5 sn içindeki baskı; karşı baskı geri kazanımı, karşı baskı yapan oyuncunun 5 sn içinde topu geri alması;
  - Opta **2 saniye**: "counter-pressure", top kaybından sonraki 2 sn içinde baskı;
  - antrenörlük anlatısı **6 saniye**: Guardiola'nın kuralı (aşağıda).

  Kaynaklar: [B] StatsBomb karşı pres yazısı; [B] The Analyst Bournemouth–Spurs yazısı. Guardiola'nın "6 saniye kuralı" (6 sn içinde kazanılmazsa bloğa dön) yaygın anlatıdır; birincil kaynak **bulunamadı**, ikincil: [C] https://www.passion4fm.com/utilizing-pressing-football-manager/ ve [C] https://www.icoachfootball.net/counter-pressing-soccer-drills-6-second-rule/ Sportplan'ın dinlenme savunması yazısı da "6 sn içinde geri al ya da geciktir" der. [C] https://www.sportplan.net/drills/Football/trends/rest-defence-structure-attacking-2025-05.jsp
- **Takım kuralı:** Karşı pres yalnız topun yakınında yeterli oyuncu (en az 3, **tahmin**) ve arkada dinlenme savunması (D14) varsa yapılır; yoksa bloğa dönüş. Spielverlagerung: karşı pres ikinci hattın (second line) topa "erişimi"ne bağlıdır; birinci hat (2–3 stoper) doğrudan pres yapamaz.
- **Başarı ölçüsü ve gerçek sayılar:**
  - StatsBomb (177 PL maçı): açık oyun pozisyonlarının ortalama **%47**'si 5 sn içinde baskı altında ("karşı pres kesri"); kesir topa sahip olmayla 0,86 korelasyonlu. Burnley: maç başına 18 karşı pres pozisyonu, 2,5 geri kazanım (%14, 17. sıra), karşı preslerinin %13'ü şutla bitti (lig ortalaması %10). Lider City, Spurs, Liverpool. [B] https://blogarchive.statsbomb.com/articles/soccer/how-statsbomb-data-helps-measure-counter-pressing/
  - Opta 2024/25 (13 hafta): Spurs 801 karşı baskı (378'i son üçte birlik bölgede), Bournemouth 788/345. [B] The Analyst.
  - Bauer & Anzer (2021): karşı presi takip + olay verisinde denetimli öğrenmeyle tespit; 134 öznitelik, 97 maçtan 20.000'den fazla elle etiketlenmiş savunma geçişi, AUC %87,4; altı Bundesliga sezonuna uygulanmış. [A] https://link.springer.com/article/10.1007/s10618-021-00763-7 (Data Mining and Knowledge Discovery 35(5):2009–2049; tam metin bu oturumda okunamadı, özet üniversite sayfasından: https://uni-tuebingen.de/en/218844)
  - 2010 DK: top kaybı en çok hücum orta sahasında (%48,9), geri kazanım en çok savunma orta sahasında (%37,1); 0–15 sn'lik geçişler başarıyla ilişkili. [A] Casal ve ark.
- **Hücumun panzehiri:** Top kazanır kazanmaz **ilk pası uzağa** (karşı pres halkasının dışına) oynamak, kazanan oyuncunun ilk dokunuşla baskıdan çıkması, geniş çıkış oyuncusu (kanat) hazır tutmak, kaleciye güvenli pas. Ters yüz: karşı presi geçen takım "en iyi hücum anı"nı yakalar.
- **Kabiliyet eşiği:** Görme: top kaybını ilk fark eden (çoğu zaman kaybeden oyuncu değil). Karar: "git mi dön mü" (erişim var mı). Yürütme: 0–5 m patlayıcı ivme, tekrar depar, ikili mücadele.
- **Hoca tarzı:** Rangnick, Klopp, Tuchel, Nagelsmann, Marsch (PL açıklayıcısı: Frank, Rangnick, Klopp, Tuchel, Nagelsmann soyu); Guardiola (yapısal karşı pres); Hasenhüttl (4-4-2 orta preste geçiş için).
- **Ünlü örnek:** Klopp'un "gegenpressing en iyi oyun kurucudur" sözü (ikincil kaynak, birincil doğrulanamadı, [C] icoachfootball); Dortmund 2011–13, Liverpool 2018–20.
- **Kaynaklar:**
  - [B] Premier League, “Counter-pressing and the gegenpress: football tactics explained” — https://www.premierleague.com/news/4244321
  - [B] Spielverlagerung sözlüğü, “Counterpressing” — https://spielverlagerung.com/glossary/tactical-methods/counterpressing/
  - [B] StatsBomb, “How StatsBomb Data Helps Measure Counter-Pressing” — https://blogarchive.statsbomb.com/articles/soccer/how-statsbomb-data-helps-measure-counter-pressing/
  - [B] The Analyst (Opta), Bournemouth–Tottenham pres yazısı (2024/25) — https://theanalyst.com/articles/bournemouth-vs-tottenham-pressing-chaos-premier-league
  - [C] Passion4FM, pres tarzları (Guardiola 6 sn anlatısı) — https://www.passion4fm.com/utilizing-pressing-football-manager/
  - [C] iCoachFootball, 6 saniye kuralı geçiş oyunu — https://www.icoachfootball.net/counter-pressing-soccer-drills-6-second-rule/
  - [C] Sportplan, “Rest Defence: The Hidden Structure…” (2025) — https://www.sportplan.net/drills/Football/trends/rest-defence-structure-attacking-2025-05.jsp
  - [A] Bauer & Anzer 2021, Data Mining and Knowledge Discovery 35(5):2009–2049 (sayfa bu oturumda açılamadı) — https://link.springer.com/article/10.1007/s10618-021-00763-7
  - [A] Tübingen Üniversitesi yayın listesi (Bauer & Anzer 2021 özeti) — https://uni-tuebingen.de/en/218844
  - [A] Casal ve ark. 2016, Sports 4(4):54 — 2010 DK savunma geçişleri — https://pmc.ncbi.nlm.nih.gov/articles/PMC5968892/

### D8. Kanatta ikili kapatma ve kenar tuzağı (Doubling up, touchline trap)

- **Evre ve bağlam:** Top kenarda, rakip kanat oyuncusu ya da bek topla; blok topun olduğu kenara kaymış. Özellikle orta ve alçak blokta; yüksek preste "kenara yönlendir, sonra kapat" planının son adımı.
- **Roller ve hareket:** Bek 1. adam (içe pas yolunu kapatan açı, dışa sürdürür — "kenar dost savunmacı", [C] icoachfootball); kanat orta saha 2. adam olarak dıştan/arkadan gelir ve geri pası kapatır; yakın 8 numara iç koridoru (yarı alan) kapatır; yakın stoper beke çapraz örtme yapar. Böylece kenarda 2v1, çoğunlukla 3v2 kurulur. Atalanta örneği: "kanat bek, stoper ve orta saha üçgeni topu kazanır." [B] themastermindsite Gasperini. Simeone'nin 4-4-2'si dar durup rakibi dışa iter; bekler (Lodi, Trippier) takımın en çok müdahale yapanlarıdır; stoperler hava topunda güçlü olmak zorundadır çünkü rakip kenara zorlanır (Savić %61, Felipe %67 hava topu kazanma). [B] https://themastermindsite.com/2020/12/18/diego-simeone-atletico-madrid-tactical-analysis-2020-21-edition/
- **Zamanlama:** İkinci adam, top kenara **giderken** hareket eder; top kenarda kontrol edildiğinde kapatma tamamlanmış olmalı (yaklaşık 1,5–2 sn pencere, **tahmin**). Geç kalınan ikili kapatma, rakibe içe kesme açısı verir.
- **Takım kuralı:** Ters kanat ceza sahası genişliğine daralır; ters bek arka direk koşusunu tutar. Kenar tuzağı, bloğun en çok oyuncu yoğunluğuna ulaştığı andır; buna rağmen Spielverlagerung dinlenme savunmasında kenarların genelde boş bırakıldığını hatırlatır (kenar, kalenin en az tehlikeli bölgesidir). [B] https://spielverlagerung.com/?p=12612
- **Başarı ölçüsü ve gerçek sayılar:** Kenardan top kazanma payı; rakibin ortaya dönüş ve ortalama (cross) sayısı. Takım düzeyinde yayınlanmış "kenar tuzağı" istatistiği **bulunamadı**. Vekil: Opta Vision "overload" ölçüsü yalnız hücum için tanımlanmış (top yakınında daha çok hücumcu); savunma tarafı için sayı yok. [B] The Analyst Opta Vision.
- **Hücumun panzehiri:** Kenardan hızlı geri + taraf değişimi (switch), kenardaki 2v1'e karşı üçüncü adam (iç koridora inen 8 ya da içe giren bek), erken orta (ikinci adam gelmeden), topu tutup faul çekme.
- **Kabiliyet eşiği:** Görme: kanat orta sahanın topla birlikte beki de görmesi. Karar: 2. adamın "kapat / içe kal" seçimi. Yürütme: bekin 1v1 geciktirmesi (D9), 2. adamın geri depar kapasitesi.
- **Hoca tarzı:** 4-4-2 alçak/orta blok ekolleri (Simeone, Ranieri), Gasperini'nin üçgeni, yüksek pres ekollerinde "kenara sıkıştırma" (Red Bull).
- **Ünlü örnek:** Atlético 2013–16 (Juanfran–Koke, Filipe Luís–Saúl/Turan ikilileri); Leicester 2015/16 kenar çifti Simpson–Mahrez, Fuchs–Albrighton (sayı **bulunamadı**).
- **Kaynaklar:**
  - [C] iCoachFootball, 1v1 savunma ve jokey — https://www.icoachfootball.net/1v1-defending-drills-jockeying/
  - [B] The Mastermind Site, Gasperini/Atalanta 2020/21 analizi — https://themastermindsite.com/2021/05/11/gian-piero-gasperini-atalanta-tactical-analysis-2020-21/
  - [B] The Mastermind Site, Simeone/Atlético 2020/21 analizi — https://themastermindsite.com/2020/12/18/diego-simeone-atletico-madrid-tactical-analysis-2020-21-edition/
  - [B] Spielverlagerung, dinlenme savunması (Restverteidigung) yazısı — https://spielverlagerung.com/?p=12612
  - [B] The Analyst (Opta Vision), takip verisi istatistikleri (2024/25) — https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league

### D9. Jokey ve geciktirme (Jockeying, delaying)

- **Evre ve bağlam:** 1. adam topa yetişmiş ama müdahale için açı/örtme yok; ya da takım sayıca eksik (karşı atak). Amaç top kazanmak değil **zaman kazanmaktır**.
- **Roller ve hareket (antrenörlük standardı, [C]):** 
  - hızlı yaklaş, yavaş var ("fast approach, slow arrival"); top yoldayken aralığı kapat;
  - son 2 yarda (≈1,8 m) fren;
  - yan duruş ~45°, dizler bükük, bir ayak önde ("surfboard stance"); asla karşıdan düz durma;
  - küçük adımlar, ayakları çaprazlamadan; yön değişiminde geri adım (drop step);
  - rakibi zayıf ayağına ya da kenara sür ("kenar dost savunmacı"), merkezi kapat;
  - "müdahaleye girdin mi gittin": amaç yavaşlatmak, hemen top çalmak değil;
  - 1v2'de müdahale yapar gibi yaparak yardım gelene dek geciktir. [C] https://www.icoachfootball.net/1v1-defending-drills-jockeying/ Benzer kaynak: "dokunma mesafesinde kal ama dokunma." [C] https://www.renderfoot.com/fr/blog/soccer-defending-drills
- **Mesafe ve açı:** Dokunma mesafesi 1,5–2 m; açık alanda ve hızlı rakibe karşı 2,5–3 m (**tahmin**). Açı: rakibin güçlü ayağını ve kale merkezini gövdeyle kapatacak biçimde; kaleye yaklaştıkça açı dikleşir ve mesafe kısalır (**tahmin**).
- **Zamanlama:** Geciktirme süresi, 2. adamın gelme süresidir (3–5 sn, **tahmin**). Rakip topu kendinden 1 m'den fazla açarsa ya da başını eğerse geciktirme müdahaleye döner (D10).
- **Takım kuralı:** 1. adam geciktirirken herkes geri koşar (D11) ve blok yeniden kurulur; geciktirme, sayıca eksikken takım kuralıdır (2v3'te asla müdahale yok, **antrenörlük geleneği**).
- **Başarı ölçüsü ve gerçek sayılar:** 1v1'de geçilme (dribbled past) sayısı, karşı atakta rakibin ceza sahasına varış süresi. Sportplan: üst takımlar topu kazandıktan sonra 7 sn içinde rakip ceza sahasına ulaşabilir. [C] Sportplan dinlenme savunması. Mesafe/açı için takip verili yayın **bulunamadı**.
- **Hücumun panzehiri:** Hız değişimi, yön değişimi (jokey yapanın ağırlığını bir tarafa çekip diğerinden geçme), çalım yerine pas (bindirme ile 2v1), savunmacının yüzüne sürüp temas çekme.
- **Kabiliyet eşiği:** Görme: topun değil kalçanın izlenmesi. Karar: ne zaman "git". Yürütme: yan adım hızı, denge, fren mesafesi.
- **Hoca tarzı:** Evrensel; alçak blok ekollerinde en çok çalışılan birey becerisi.
- **Ünlü örnek:** Maldini'nin "müdahale ediyorsam hata yapmışımdır" anlayışı (yaygın alıntı; birincil kaynak **bulunamadı**).
- **Kaynaklar:**
  - [C] iCoachFootball, 1v1 savunma ve jokey — https://www.icoachfootball.net/1v1-defending-drills-jockeying/
  - [C] Renderfoot, savunma alıştırmaları — https://www.renderfoot.com/fr/blog/soccer-defending-drills
  - [C] Sportplan, “Rest Defence: The Hidden Structure…” (2025) — https://www.sportplan.net/drills/Football/trends/rest-defence-structure-attacking-2025-05.jsp

### D10. Müdahale türleri ve zamanlama (Tackle types and timing)

- **Evre ve bağlam:** 1. adam topa erişimde; geciktirmeden müdahaleye geçiş tetikleri: rakibin topu açması (ilk dokunuş > 1 m), başını eğmesi, çizgiye sıkışması, 2. adamın örtmeyi kurması, ya da topun arayı geçmesinin engellenmesi gereken son an (blok/kayma).
- **Türler:**
  - **Ayakta blok müdahalesi (block/standing tackle):** Gövde dengede, ayak içi topa; en güvenlisi, geri kazanımdan sonra topu kontrol etme şansı en yüksek. Varsayılan.
  - **Dürtme (poke/toe tackle):** Uzak ayakla topu rakibin dokunuşunun hemen sonrasında dürtme; temas azdır, top çoğunlukla ikinci toptur.
  - **Kayarak müdahale (slide tackle):** Ulaşılamayan topa son çare; başarısızsa oyuncu oyun dışıdır ("müdahaleye girdin mi gittin"); yanlış zamanlamada faul ve kart. Youth programı U14'e kadar kayma öğretmez. [C] icoachfootball.
  - **Kalkanlı/omuz temas (shoulder charge, shielding challenge):** Topa oynanabilir mesafede omuz omuza; hakem yorumuna bağlı.
  - **Geri koşuda müdahale (recovery tackle):** Arkadan yetişip topa önden dokunma; arkadan temas faul riski yüksek.
- **Zamanlama kuralı:** Müdahale **rakibin dokunuşundan hemen sonra**, top ayağından ayrıldığı anda (top en uzak noktada, rakibin dengesi öne). Kayma ancak top rakibin gövdesinden ≥ 1 m açıkta ve ayağın topa önce ulaşması kesinse (**antrenörlük geleneği; sayısal kaynak bulunamadı**).
- **Takım kuralı:** Kendi ceza sahası yakınında ve son adam durumunda kayma yok (penaltı/kırmızı riski); kenar çizgisinde kayma kabul edilebilir (top taca çıkar). Hoca parametresi "agresiflik" kayma eşiğini değiştirir.
- **Başarı ölçüsü ve gerçek sayılar:** Takım başına müdahale ve müdahale başarı yüzdesi için güvenilir güncel lig tablosu bu oturumda **bulunamadı** (FBref 403). Eldeki örnekler: Kanté 2015/16'da 175 müdahale ve 156 top kesme (lig birincisi) [B] https://www.premierleague.com/en/news/2748139 ; Atalanta 2020/21 maç başına 15,9 müdahale, 14 top kesme, 15,3 faul [B] themastermindsite. PPDA hesabında müdahale, top kesme, başarısız müdahale girişimi (challenge) ve faul birlikte "savunma eylemi" sayılır. [B] https://www.premierleague.com/news/4250153
- **Hücumun panzehiri:** Müdahale anını geciktiren top koruma (gövde arada), ilk dokunuşu savunmacının uzak tarafına, kayma gelince topu kaldırma/çekme, temas çekip faul kazanma.
- **Kabiliyet eşiği:** Görme: rakibin dokunuş ritmini okuma. Karar: ayakta/kayma/geciktir. Yürütme: ayak hızı, uzanma, denge; kaymada teknik (yan yatış, top önde).
- **Hoca tarzı:** Adam adama ve pres ekollerinde müdahale sayısı yüksek (Atalanta, Bielsa); bölge/alçak blok ekollerinde "önce konum, sonra müdahale" (Maldini ilkesi).
- **Ünlü örnek:** Kanté 2015/16; Gattuso/Makélélé tipleri (sayı **bulunamadı**).
- **Kaynaklar:**
  - [C] iCoachFootball, 1v1 savunma ve jokey — https://www.icoachfootball.net/1v1-defending-drills-jockeying/
  - [B] Premier League, “PL30: How Ranieri masterminded Leicester’s title victory” — https://www.premierleague.com/en/news/2748139
  - [B] The Mastermind Site, Gasperini/Atalanta 2020/21 analizi — https://themastermindsite.com/2021/05/11/gian-piero-gasperini-atalanta-tactical-analysis-2020-21/
  - [B] Premier League, “Passes per defensive action: explained” (2021/22 Wyscout değerleri) — https://www.premierleague.com/news/4250153

### D11. Geri koşu (Recovery run)

- **Evre ve bağlam:** Savunma geçişi ya da pres kırıldıktan sonra; topun gerisine, kaleye doğru, önce **kalenin merkezi**ne. Hedef: top ile kale arasına girmek ve bloğun sayısını tamamlamak.
- **Roller ve hareket:** Topun gerisindeki oyuncular en kısa çizgiden (kaleye doğru, topa değil) koşar; topa en yakın olan geciktirir (D9); orta saha "topun önüne" iner (ceza yayı önü referans). Geri koşan oyuncu, koşuyu top ile kalenin merkez noktası arasındaki hat üzerinde bitirir ve ancak sonra topa yaklaşır (**antrenörlük geleneği**).
- **Zamanlama:** 2010 DK verisi: başarılı geçişler 0–15 sn'de yoğunlaşır (%66,3); savunma hattının başlangıç konumu geçişlerin %43,7'sinde rakip arka hattının önünde, bitişte %48,4'ü kendi arka hattı rakip hücum hattının önünde (yani blok yeniden kurulmuş). [A] Casal ve ark. Bundesliga 2010/11'in 306 maçını kullanan Vogelbein, Nopp & Hökelmann (2014) "savunma tepki süresi"ni ölçtü ve üst takımların topu en hızlı geri kazandığını buldu; tam metin ve saniye değerleri bu oturumda okunamadı (403). [A] https://www.tandfonline.com/doi/abs/10.1080/02640414.2013.843305
- **Takım kuralı:** Geri koşu, karşı pres kararının tersidir: erişim yoksa herkes geri; karar 1 sn içinde ve kolektif olmalıdır (**tahmin**). Yorgunlukta geri koşu kalitesi en çok düşen ilkeldir (kanat oyuncuları ve 8'ler).
- **Başarı ölçüsü ve gerçek sayılar:** Takip sağlayıcılarının "recovery run" sayısı/maç tanımı ve lig ortalaması **bulunamadı**. Vekil: top kaybından sonra rakibin şuta ulaşma oranı (StatsBomb Burnley örneğinde karşı pres pozisyonlarının %13'ü şutla bitti, lig %10), 10 sn içinde kaybedilen gol payı (**bulunamadı**).
- **Hücumun panzehiri:** Geçişte doğrudan derinlik koşusu (geri koşanın önüne değil arkasına), ilk pası 2 sn içinde ileri oynamak, geri koşan beke karşı kanat oyuncusunu geniş tutmak.
- **Kabiliyet eşiği:** Görme: top kaybını hemen fark etme. Karar: koşu hattı (kaleye mi topa mı). Yürütme: tekrar depar, 40–60 m dönüş koşusu dayanıklılığı.
- **Hoca tarzı:** Alçak blok ekollerinde takım kimliği ("herkes geri"); Bielsa'da 1v1 kaybından sonra adamını yakalama koşusu.
- **Ünlü örnek:** Ranieri Leicester'ının 4-4-2 → 4-4-1-1 geri dönüşü; Vardy/Okazaki'nin ön hatta kalıp geri kalan dokuzun blok kurması (biçim, [B] premierleague.com PL30).
- **Kaynaklar:**
  - [A] Casal ve ark. 2016, Sports 4(4):54 — 2010 DK savunma geçişleri — https://pmc.ncbi.nlm.nih.gov/articles/PMC5968892/
  - [A] Vogelbein, Nopp & Hökelmann 2014, J. Sports Sciences (DOI 10.1080/02640414.2013.843305; 403) — https://www.tandfonline.com/doi/abs/10.1080/02640414.2013.843305
  - [B] StatsBomb, “How StatsBomb Data Helps Measure Counter-Pressing” — https://blogarchive.statsbomb.com/articles/soccer/how-statsbomb-data-helps-measure-counter-pressing/
  - [B] Premier League, “PL30: How Ranieri masterminded Leicester’s title victory” — https://www.premierleague.com/en/news/2748139

### D12. Koşucu devri ve koşucunun takibi (Runner hand-over, tracking runners)

- **Evre ve bağlam:** Bölge savunmasında rakip bir bölgeden diğerine koştuğunda (hat arasına inen forvet, üçüncü adam koşusu, bindirme yapan bek, kutuya geç giren 8). Bölge ilkesi: "savunmacı alanı kapsar; rakip alana girerse markaj eder; çıkarsa başka savunmacı devralır." [C] https://en.wikipedia.org/wiki/Zonal_marking
- **Roller ve hareket:** Devir, iki savunmacının **sesli ve görsel** anlaşmasıyla bölge sınırında olur; koşucu top yakınındaysa ve top ona oynanabilecekse takip devam eder, oynanamayacaksa bırakılır. Kural (antrenörlük geleneği, sayısal kaynak **bulunamadı**): koşucu **kaleye doğru ve hattın arkasına** gidiyorsa bırakılmaz (takip), yatay/geri gidiyorsa devredilir. Arka hatta koşucu takibi "hat kırılması" pahasına yapılmaz: hat dışına çıkan tek savunmacı ofsayt tuzağını bozar (D13). Adam ekollerinde devir yoktur; Bielsa'da bek rakip kanadı iç koridora kadar izler, kanat rakip bekle geri koşar (D6).
- **Zamanlama:** Devir topun geliş süresinden önce bitmelidir (koşucu bölge sınırını geçerken, top hâlâ ilk oyuncudaysa). Geç devir = iki savunmacı aynı adamda, bir bölge boş (**tahmin**).
- **Takım kuralı:** Dikey koşuları hat izler, yatay koşuları orta saha devreder; "geç giriş" (late run) kutuya en tehlikeli devirdir: orta sahanın kutuya kadar inmesi istenir. Bu ilkelin oyundaki mevcut anahtarları: `markajKalici`, `kosuSil`, `markajAta`, `kutuSavunmaAta`, `gecGirisAta` (CLAUDE.md senaryo kapıları).
- **Başarı ölçüsü ve gerçek sayılar:** Hatların arasında alınan pas (FIFA EFI "receptions behind lines"/"line breaks" tanımı var, sayı **bulunamadı**); kutuya geç girişten yenilen gol (**bulunamadı**).
- **Hücumun panzehiri:** Üçüncü adam koşusu (devir anında pas), çapraz koşular (iki koşucu yer değiştirir), bloklu koşular (perde), bölge sınırında "durup bekleme".
- **Kabiliyet eşiği:** Görme: çevresel görüş (top + koşucu). Karar: takip/devret. Yürütme: iletişim, dönüş hızı.
- **Hoca tarzı:** Bölge ekollerinin ayırt edici işçiliği (Sacchi'nin dört referans noktası: top, alan, rakip, takım arkadaşı — oyuncu hangisinin hareketini belirleyeceğine kendi karar verir). [B] https://spielverlagerung.com/?p=196
- **Ünlü örnek:** Sacchi Milan'ı, Benítez'in Liverpool'u (sayı **bulunamadı**).
- **Kaynaklar:**
  - [C] Wikipedia, “Zonal marking” — https://en.wikipedia.org/wiki/Zonal_marking
  - [B] Spielverlagerung, Sacchi’nin dört referans noktası — https://spielverlagerung.com/?p=196
  - [B] FIFA Training Centre, EFI “Defensive line height and team length” — https://fifatrainingcentre.com/en/fwc2022/efi-metrics/efi-metric--defensive-line-height-and-team-length.php

### D13. Savunma hattı ve ofsayt tuzağı (Defensive line, offside trap)

- **Evre ve bağlam:** Dört/üç/beşli hattın, topa ve rakip koşucuya göre birlikte hareketi; tuzak, pas çıkmadan hemen önce hattın bilinçli ileri adımıdır. Bugünün kuralı: yalnız topa müdahale eden/oyuna karışan oyuncu için ofsayt; Sacchi döneminde ise "son savunmacıyla aynı hizada olan ofsayttı" ve takım arkadaşının ofsayt konumu da değerlendirilebiliyordu — bugün tuzak o yüzden daha risklidir. [C] https://guidetofootball.com/history/the-pressing-era/ ve FIFA Sacchi yazısı. VAR ve yarı otomatik ofsayt, tuzağın santimetre kararlarını kesinleştirir (yan hakem bayrağını geç kaldırır; motorda `ofsaytPasAni`, `golIptalMi` zaten var).
- **Roller ve hareket:** Hat topa göre yükselir/alçalır — üç kip:
  - **Yüksel (step up):** top ileri (rakibe doğru) oynanınca ya da pas veren baskı altındayken ileri adım;
  - **Tut (hold):** top sırtı dönük alıcıya ya da baskısız oyuncuya gidince;
  - **Düş (drop):** pas veren yüzünü döndürüp başını kaldırınca ve top ayağından çıkmak üzereyken arkaya.
   Tuzakta hat, pasçının ayağı topa gitmeden önceki son anda (0,3–0,5 sn, **tahmin**) ileri adım atar; komut "hat lideri"nden gelir (çoğunlukla orta/sağ stoper). Sacchi: "topa sahipken topun önünde hep beş adam isterim" ve hattın "gölge futbol" antrenmanında hayalî topa göre otomatik hareket etmesi. [B] FIFA Sacchi yazısı.
- **Zamanlama:** Hat kararının referansı **pasçının baskı durumu**: baskı altında (yoğun baskı: 2 m'de rakip, Opta eşiği) → yüksel; serbest → düş (**antrenörlük geleneği**).
- **Takım kuralı:** Hat tek parça hareket eder; bir oyuncu geride kalırsa tuzak yoktur ve sorumluluk o oyuncunundur. Hat yüksekliği oyun durumuna göre: önde ve yorgunken daha derin (**tahmin**, `yariSantra`, `macDurumu` anahtarlarıyla uyumlu).
- **Başarı ölçüsü ve gerçek sayılar:**
  - Ofsayta düşürme (offsides caught): 2024/25 PL'de Liverpool 96, Aston Villa 93, Chelsea 88 ("Chelsea'nin yüksek hattı etkiliydi"). [B] https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league 2022/23 öncesi altı sezonda Liverpool ortalama 118 rakibi ofsayta düşürmüş, hiç 95'in altına inmemiş. [B] https://anfieldindex.com/?p=56998
  - Arsenal 2022/23 toplamı **bulunamadı** (FBref 403, Opta yazılarında yok). Arsenal 2025/26: 26 gol yedi (PL tarihinde ikinci en az), maç başına 0,74 xGA, 8,2 şut ve 2,4 isabetli şut yedi (beş büyük lig en iyisi); hat yüksekliği sayısı yazıda yok. [B] https://theanalyst.com/articles/how-arsenal-won-premier-league-title-10-numbers-stats
  - 2023/24 LaLiga'da Barcelona ve Real Madrid'in 2.413 savunma geçişinde "göreli hat yüksekliği" savunma başarısıyla en güçlü ilişkili gösterge; Barcelona'nın başarısı daha yüksek alan kontrolü ve daha kompakt hat eşgüdümüyle ilişkili (XGBoost AUC 0,724 / 0,698). [A] https://arxiv.org/abs/2511.06191
  - Lig geneli maç başına ofsayt ortalaması **bulunamadı** (tek örnek: Ipswich 2024/25'te 38 maçta 52 ofsayt, 1,4/maç — hücumda yakalanan, [C] https://statz.ai/team/ipswich-town/offsides).
- **Tuzağın riski:** Tek bir geç oyuncu tuzağı bozar; hızlı forvete karşı yüksek hat tek pasla geçilir; VAR ile "aynı hizada" lehe değil santimetreye bağlıdır. Yunanistan 2004 ve Catenaccio'nun çözümü tam tersi: hat yerine **serbest adam** (D19, D20).
- **Hücumun panzehiri:** Topa gelip dönen forvet + arkadan koşan üçüncü adam (zamanlanmış koşu, pas ayaktan çıkarken), topu "hattın üstünden değil arasından" (geri çekilmiş alıcı), hattı sabitleyen koşu + ters tarafa pas, uzun top tuzağına karşı sabır (pasçıyı baskısız bırakmamak hattın görevidir, ama hücum pasçıyı serbest bırakırsa tuzak çalışmaz).
- **Kabiliyet eşiği:** Görme: hat liderinin pasçıyı ve koşucuyu aynı anda görmesi. Karar: yüksel/tut/düş (üç kip). Yürütme: senkron adım, ilk 5 m dönüş hızı, kalecinin süpürme menzili.
- **Hoca tarzı:** Michels/Ajax 1970'ler ("yüksek pres ve hattı yukarıda tutmak için ofsayt tuzağı", [C] guidetofootball), Sacchi, Klopp (van Dijk ile), Arteta, Maresca; tersine Catenaccio, Rehhagel, Simeone (derin hat).
- **Ünlü örnekler:** Milan 1988–90 (196 maçta 114 gol yedi, [C] https://en.wikipedia.org/wiki/Arrigo_Sacchi), Liverpool 2019–22, Arsenal 2022–26.
- **Kaynaklar:**
  - [C] Guide to Football, “The pressing era” — https://guidetofootball.com/history/the-pressing-era/
  - [B] FIFA, “Sacchi the revolutionary turns 75” — https://inside.fifa.com/news/sacchi-the-revolutionary-turns-75
  - [B] The Analyst (Opta Vision), takip verisi istatistikleri (2024/25) — https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league
  - [B] Anfield Index, Liverpool’un ofsayta düşürme ortalaması — https://anfieldindex.com/?p=56998
  - [B] The Analyst, Arsenal 2025/26 şampiyonluk sayıları — https://theanalyst.com/articles/how-arsenal-won-premier-league-title-10-numbers-stats
  - [A] arXiv 2511.06191, dörtlü savunmanın alan kontrolüyle değerlendirilmesi (LaLiga 2023/24) — https://arxiv.org/abs/2511.06191
  - [C] Statz, Ipswich 2024/25 ofsayt sayfası — https://statz.ai/team/ipswich-town/offsides
  - [C] Wikipedia, “Arrigo Sacchi” — https://en.wikipedia.org/wiki/Arrigo_Sacchi

### D14. Dinlenme savunması (Rest defence)

- **Evre ve bağlam:** **Toplu iken** kurulan savunma yapısı: rakip karşı atağını, top kaybı olmadan önce alınmış pozisyonlarla sınırlamak. Terim Almanca "Restverteidigung/Restfeldsicherung" (DFB). [B] https://spielverlagerung.com/?p=12612
- **Roller ve hareket (Spielverlagerung):** İki hat: **birinci hat** (2–3 stoper, orta saha çizgisi civarı; ikinci hattı örter, doğrudan pres yapamaz), **ikinci hat** (hücum hattının hemen arkasında; karşı pres için topa anında erişim, ikinci topları toplar, merkezi kontrol eder; aralıkları "neredeyse kusursuz" olmalı). Dinlenme savunması merkez ve yarı alanları önceler; kenarlar genelde boş bırakılır.
  - **Adam adama:** rakibin dinlenme hücumu (restoffence) sayısına eşit: 3 forvete 3 geri (7v7 ileride), 4'e 4 (6v6). İlk düelloyu kazanmak zorunlu; sıkı markaj çalımı azaltır ama tepkiyi yavaşlatır.
  - **Adam adama +1:** 1 forvete 2 (biri markaj biri örtme, yer değiştirir), 2 forvete 3, 3 forvete 1-2-1 elmas (son hatta 1v1 doğar); örnek İngiltere–Kolombiya 2018.
  - **Bölge 4'lü:** 1-2-1 elmas (merkezde bağlantı iyi, preste tek adam) ya da 2-2 kutu (1 forvete 4v1, 2'ye 4v2; karşı pres erişimi iyi, kenara geç). Örnekler: Fransa–Arjantin 2018 (Arjantin'in düz şekli Griezmann/Mbappé'yi bıraktı), Manchester United–Villarreal 2021 (2-2).
  - **5'li:** 2-3 (yarı alan–merkez–yarı alan üçlüsü + iki stoper; güçlü karşı pres erişimi, az 1v1; Guardiola'da Walker'ın rolü; Brezilya–Belçika 2018) ve 3-2 (üç stoper + iki orta saha; daha güvenli, daha az erişim; Belçika–Fransa 2018'de Witsel Griezmann'ı aldı).
  - **6'lı:** 2-4 ve 3-3, skor korurken.
- **Mesafeler (Sportplan, [C]):** stoperler yanal olarak en çok 15 yarda (≈13,7 m) açık; top yan değiştirince dinlenme savunmacısı ~10 yarda kayar, merkez yüklenince ~5 yarda düşer; "hücumda rakip yarı sahadayken en az dört oyuncu topun arkasında"; hedef 6 sn içinde geri almak ya da geciktirmek; üst takımlar topu kazandıktan 7 sn içinde ceza sahasına ulaşabilir. [C] https://www.sportplan.net/drills/Football/trends/rest-defence-structure-attacking-2025-05.jsp
- **Zamanlama:** Dinlenme savunması top kaybında değil **top ilerlerken** kurulur; her pasla birlikte yeniden konumlanır (top kenara-ileri → ileri sık, top merkeze ve takım ileride → tut ve ekranla, kayıp yaklaşınca → geciktirme kipine düş; [C] Sportplan).
- **Takım kuralı:** Hoca parametresi: sayı (4/5/6) ve tür (adam / +1 / bölge). Karşı pres yapan takımlar 2-3'ü, güvenlik isteyenler 3-2'yi seçer (Spielverlagerung).
- **Başarı ölçüsü ve gerçek sayılar:** Rakibin karşı ataktan şut sayısı; top kaybından sonraki 10 sn'de yenilen xG (**bulunamadı**). Spielverlagerung ve Sportplan sayısal lig verisi vermez; "golerin çoğu geçişte yenir" ifadesi kaynaksızdır (**doğrulanamadı**).
- **Hücumun panzehiri:** Rakip dinlenme savunmasına karşı: kenarlara hızlı çıkış (boş bırakılan alan), ikinci hattın arasına ilk pas, 1v1'e zorlanan stoperlere hız.
- **Kabiliyet eşiği:** Görme: 6 numaranın top ileride iken arkayı tarayıp kaç rakip kaldığını sayması. Karar: kim kalır kim çıkar (bek içeri mi yukarı mı). Yürütme: stoperlerin açık alanda 1v1 ve koşu hızı.
- **Hoca tarzı:** Guardiola (2-3 / 3-2 ters bek), Tuchel, Nagelsmann, Flick; adam adama +1: Bielsa.
- **Ünlü örnek:** City 2017–23 (Walker/Stones ters bek), Belçika–Fransa 2018 (Witsel).
- **Kaynaklar:**
  - [B] Spielverlagerung, dinlenme savunması (Restverteidigung) yazısı — https://spielverlagerung.com/?p=12612
  - [C] Sportplan, “Rest Defence: The Hidden Structure…” (2025) — https://www.sportplan.net/drills/Football/trends/rest-defence-structure-attacking-2025-05.jsp

### D15. Kutu savunması: ortalara karşı açık oyun (Box defence vs crosses)

- **Evre ve bağlam:** Top kenarda, ortaya girmek üzere; blok ceza sahasına inmiş. Savunma, **bölge + adam karması**dır: ön direk, penaltı noktası ve arka direk bölgeleri tutulur, koşucular bölge içinde adam alınır.
- **Roller ve hareket:** 
  - topa en yakın bek ortayı engeller ya da geciktirir (gövde açısı içe, ayak topun yönüne);
  - yakın stoper ön direk–penaltı noktası arasını, uzak stoper arka direği tutar;
  - ters bek arka direğin gerisini (en uzak koşucu);
  - 6 numara penaltı noktası önünü (ceza yayı: ikinci top ve geç giriş);
  - 8'ler kutuya geç girenleri takip eder (D12);
  - kaleci kale alanını ve yakınını sesli ilan eder.
   Vücut hep "top ve adam aynı görüş alanında" olacak biçimde yan (açık duruş). Ortayla birlikte hat **topa göre** düşer: top arkaya çevrilince (cut-back) hat ileri adımla ceza yayını kapatır (**antrenörlük geleneği**).
- **Zamanlama:** Orta yoldayken (0,8–1,5 sn, **tahmin**) savunmacı rakibin önüne değil, top ile adam arasındaki hatta girer; kafa ya da uzaklaştırma temas noktası mümkünse rakibin önünde. Kaleci karar bölgesi (kale alanı ve yakını) sesli ilan edilir.
- **Takım kuralı:** Savunma kompaktlığı burada en yüksektir (Opta "yüksek kompaktlık" < 600 m²: kutu savunmasında bütün blok 40 × 15 m'ye sığar, **tahmin**). Kenardan erken orta, ikili kapatma (D8) gelmeden önce en tehlikelisidir.
- **Başarı ölçüsü ve gerçek sayılar:** Açık oyun ortalarından yenilen gol payı ve orta başına xG için güncel lig ortalaması **bulunamadı**. Vekiller: hava topu kazanma oranı (Atlético stoperleri %61 ve %67, [B] themastermindsite Simeone), ceza sahasında rakip şutu (Arsenal 2025/26 maç başına 8,2 şut yedi — bütün şutlar, [B] The Analyst).
- **Hücumun panzehiri:** Geri pas/cut-back ceza yayına (hat düşerken), ön direğe sert alçak orta (bölge oyuncusunu ters ayağa), arka direk arkası uzun orta (ters bek), perdeleme ve çapraz koşu (adam alan savunmacıyı bloke etme), erken orta ikinci adam gelmeden.
- **Kabiliyet eşiği:** Görme: açık duruşla top ve adam. Karar: önden mi arkadan mı (kafa teması) ve uzaklaştırma yönü (kenara, yukarı, uzağa — D18). Yürütme: sıçrama, hava düellosu, temas gücü.
- **Hoca tarzı:** Alçak blok ekollerinin temel işi (Simeone, Mourinho, Ranieri, Rehhagel — Rehhagel "en az iki güçlü kafa vuran stoper" isterdi, [B] https://thesefootballtimes.co/2019/05/17/the-tactical-achievement-of-the-decade-how-greece-conquered-a-continent-to-win-euro-2004/).
- **Ünlü örnek:** Yunanistan 2004 (çeyrek, yarı ve finaldeki üç galibiyet golü de sağdan ortadan geldi — kendi hücumlarında; savunmada rakip ortalara karşı Dellas–Kapsis ikilisi), Atlético 2013–16 (Godín–Miranda).
- **Kaynaklar:**
  - [B] The Mastermind Site, Simeone/Atlético 2020/21 analizi — https://themastermindsite.com/2020/12/18/diego-simeone-atletico-madrid-tactical-analysis-2020-21-edition/
  - [B] The Analyst, Arsenal 2025/26 şampiyonluk sayıları — https://theanalyst.com/articles/how-arsenal-won-premier-league-title-10-numbers-stats
  - [B] These Football Times, Yunanistan Euro 2004 analizi — https://thesefootballtimes.co/2019/05/17/the-tactical-achievement-of-the-decade-how-greece-conquered-a-continent-to-win-euro-2004/
  - [B] The Analyst (Opta Vision), takip verisi istatistikleri (2024/25) — https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league

### D16. Duran top kutu savunması: bölge / adam / karma (Set-piece box defence: zonal, man, hybrid)

- **Evre ve bağlam:** Korner ve ceza sahası yakını serbest vuruşlar; oyun durduğu için düzen tam kurulur (Carragher: adam adama "en iyi duran toplarda işler, çünkü organize olunabilir"). [B] Sky Sports Carragher.
- **Üç düzen (Premier League 2022/23 analizi, [B] https://www.premierleague.com/news/2982222):**
  - **Bölge ağırlıklı karma (West Ham):** kale alanı çizgisinde beş bölge oyuncusu (Zouma, Souček merkezde), üç adam markajcı, iki serbest oyuncu tehlike bölgesinin kenarında; 11 oyuncu geri; içe dönen ortalarda birim kale çizgisine yaklaşır.
  - **Bölge (Liverpool):** kale alanında altı bölge oyuncusu, biri kalecinin önünde kale çizgisi boyunca devriye; önde iki savunmacı; iki oyuncu ceza sahası kenarı ve kısa korner.
  - **Bölge (Tottenham):** ön direkte üçgen + kale alanı çizgisinde dört–beş bölge oyuncusu; derinden dört koşucuya kadar kabul edilir.
  - **Karma (Man City):** kaleci önünde beş kişilik yay + dört agresif 1v1 + bir serbest oyuncu ceza sahası kenarında.
  - **Bölge + adam (Arsenal):** kale alanında dört bölge (iki ön direk, bir merkez, bir arka direk), kalan herkes adam; vuruş öncesi yatay sıra (kümelenmeyi önlemek için).
  - **Adam (Nottingham Forest, Bournemouth):** perdeleyicilere karşı zorlandılar; Bournemouth en az altı savunmacı rakibe yapışık, kutuda hava topu kaybetti.
- **Gerçek sayılar:** 2022/23 kornerden: West Ham 0 gol (18 şut, 1,1 xGA), Liverpool 0 (14 şut, 1,4), City 1 (14, 1,3), Arsenal 1 (20, 1,4), Spurs 2 (23, 1,2); en kötüler Bournemouth 9, Brentford 7, Forest 5, Chelsea 5. "Çoğu PL kulübü bölge ve adam karışımı kullanır." [B] premierleague.com. Akademik (2011/12 PL, 50 maç, 436 korner): kornerlerin %90,1'i adam adama, %9,9'u bölge ile savunuldu; markaj düzeni ile şut sayısı arasında anlamlı ilişki yok (p > 0,05), ama bölge kullanan takımlar daha az gol ve şut yedi (küçük örneklem). [A] https://www.ingentaconnect.com/content/uwic/ujpa/2013/00000013/00000001/art00012 (Pulling ve ark., Int. J. Performance Analysis in Sport 13(1), 2013; özet arama sonucundan). Wikipedia: bölge savunması duran toplarda boşluk bırakmaya yatkın olduğu için "çoğu takım bu durumlarda adam markajına geçer" (2000'lerin genel gözlemi; bugünkü PL örnekleri bunun tersine karma eğilim gösteriyor). [C] https://en.wikipedia.org/wiki/Zonal_marking
- **Roller ve hareket:** Bölge oyuncuları **alanı** tutar ve topa yalnız kendi bölgesinde çıkar (ileri adım, geri değil); adam markajcılar koşucuyu başlangıçtan izler, perdelere karşı yer değiştirir; serbest oyuncular ikinci top, kısa korner ve ceza yayını alır; kaleci kale alanında karar bölgesini ilan eder; direk oyuncusu hoca tercihidir (bugün çoğu takım direğe oyuncu koymaz; sayı **bulunamadı**).
- **Zamanlama:** Vuruş anında bölge oyuncuları hareketsiz-dengede, topla birlikte **öne** sıçrar; adam markajcılar koşucuya temas eder (kurallar içinde). Ofsayt yoktur; hat düşmez.
- **Takım kuralı:** Hoca parametresi: bölge oyuncusu sayısı (4–6), adam markajcı sayısı, serbest oyuncu sayısı, 11'in hepsinin geri gelip gelmediği, karşı atak için önde kalan (0–1).
- **Hücumun panzehiri:** Bölgeye karşı: bölge sınırına koşu, aynı bölgeye iki koşucu, bölge oyuncusunun önüne alçak sert orta, hareketli bloklar; adama karşı: perdeleme (Forest örneği), çapraz koşu, geç koşu (**oyundaki `kornerPerde`, `kornerGeri`, `serbestIkili` anahtarları bu tarafı taşıyor**).
- **Kabiliyet eşiği:** Görme: perdeyi erken görme. Karar: bölge oyuncusunun "çık / kal" eşiği. Yürütme: hava düellosu, zamanlama, temas direnci.
- **Hoca tarzı:** Bölge: Benítez, Klopp (Liverpool), Postecoglou; karma: Guardiola, Arteta (Jover), Moyes; adam: Cooper (Forest 2022/23), Bournemouth 2022/23.
- **Ünlü örnek:** West Ham 2022/23 (kornerden 0 gol), Brighton 2017/18 (kornerden 16 gol, lig en kötüsü, ağırlıkla adam adama, [B] premierleague.com arama özeti).
- **Kaynaklar:**
  - [B] Sky Sports, Carragher: Leeds’in adam adama sistemi (2020) — https://www.skysports.com/football/news/11095/12072320/jamie-carragher-breaking-down-leeds-man-marking-system
  - [B] Premier League, “Which clubs are best at defending corners and why” (2022/23) — https://www.premierleague.com/news/2982222
  - [A] Pulling ve ark. 2013, Int. J. Performance Analysis in Sport 13(1) — PL kornerleri (403; arama özeti) — https://www.ingentaconnect.com/content/uwic/ujpa/2013/00000013/00000001/art00012
  - [C] Wikipedia, “Zonal marking” — https://en.wikipedia.org/wiki/Zonal_marking

### D17. Şut bloğu (Shot block)

- **Evre ve bağlam:** Rakip şut pozisyonunda ve savunmacı topa müdahale edemeyecek kadar uzak (1,5–4 m, **tahmin**) ama şut hattına girebilecek kadar yakın. Alçak blokta en sık; ceza yayı ve kutu içinde.
- **Roller ve hareket:** Savunmacı top ile kalenin merkezini birleştiren hatta girer, gövdeyi büyütür (kollar yanda ve geride — el-kol penaltı riski), ayak topa doğru uzanmış; yüzü topa dönük, gözler açık. Kalecinin görüşünü kapatmamak için hat üzerinde **kaleciye yakın değil topa yakın** durulur (**antrenörlük geleneği**). İkinci savunmacı sekme topunu (rebound) alır.
- **Zamanlama:** Hamle, vurucunun destek ayağı yere basarken başlar (vuruş temasından ~0,2–0,3 sn önce, **tahmin**); erken hamle vurucuya çalım/yan kayma fırsatı verir ("sutHamle" eşiği), geç hamle ıskalar. Oyundaki ilgili anahtarlar: `sutHamle`, `blokErisim`, `sutHamleYap`, `sutBlokOlasiligi` (T19a).
- **Takım kuralı:** Ceza yayı önündeki 6 numara şut bloğu için konumlanır (şutu kapatma ↔ pas yolunu kapatma ikilemi); kutu içinde stoperler şut hattına girer, bekler arka direk koşusunu bırakmaz.
- **Başarı ölçüsü ve gerçek sayılar:** Blok payı (bloklanan şut / toplam şut) için güncel lig ortalaması bu oturumda **bulunamadı** (FBref 403). Mevcut tur kabulü: ilk kafanın blok payı 15–30 (duran topta, oyunun kendi ölçümü, CLAUDE.md T17). Atalanta 2020/21: "ceza sahası dışından en az şut yedi" (blok ve baskı etkisi, [B] themastermindsite).
- **Hücumun panzehiri:** Şut hilesi (feint) ile bloğu yatırıp yana kayma, bloğu geçen falso, alçak sert şut (bacakların arasından), bloğun sektirmesi için kaleci önüne vuruş, şut yerine pas (bloğa giren savunmacı bir pas yolunu açar).
- **Kabiliyet eşiği:** Görme: vurucunun ayağını ve destek adımını okuma. Karar: hamle zamanı ve "blok mu pas yolu mu". Yürütme: cesaret, gövde büyütme, uzanma.
- **Hoca tarzı:** Alçak blok ekolleri (Simeone, Mourinho, Ranieri); Mourinho 2010 Inter Camp Nou'da "merkezi kapatan dar düzen" ve çok sayıda blok (sayı **bulunamadı**).
- **Ünlü örnek:** Inter 2010 Camp Nou (10 kişi, %14 topa sahip olma, Barcelona'nın "üç–dört gerçek fırsatı"; [B] https://www.tntsports.co.uk/football/champions-league/2009-2010/retro-report-jose-mourinho-mastermind-as-10-man-inter-reach-final-at-barcelonas-expense_sto7737119/story.shtml ve [B] https://thehardtackle.com/2010/fc-barcelona-1-0-inter-milan-resolute-inter-book-their-place-in-the-final-with-a-defensive-masterclass/amp/).
- **Kaynaklar:**
  - [B] TNT Sports retro rapor, Barcelona 1-0 Inter (2010) — https://www.tntsports.co.uk/football/champions-league/2009-2010/retro-report-jose-mourinho-mastermind-as-10-man-inter-reach-final-at-barcelonas-expense_sto7737119/story.shtml
  - [B] The Hard Tackle, Barcelona 1-0 Inter maç analizi (2010) — https://thehardtackle.com/2010/fc-barcelona-1-0-inter-milan-resolute-inter-book-their-place-in-the-final-with-a-defensive-masterclass/amp/
  - [B] The Mastermind Site, Gasperini/Atalanta 2020/21 analizi — https://themastermindsite.com/2021/05/11/gian-piero-gasperini-atalanta-tactical-analysis-2020-21/

### D18. Kale önü temizleme (Clearance)

- **Evre ve bağlam:** Top kendi ceza sahasında ve kontrol etmek riskli (baskı, hava topu, kalabalık). Amaç topu tehlike bölgesinden çıkarmak; ikinci hedef **kenara ve yükseğe** (ceza yayına değil).
- **Roller ve hareket:** Temas eden oyuncu: kafa ise kaşla, yukarı ve kenara; ayak ise ters kanada ya da taca; asla kalenin önünden yatay değil. Ceza yayı önündeki 6 numara ve 8'ler ikinci topu almak için **ileri adım** atar (hat da öne çıkar: temizleme, hattın yükselme tetiğidir — D13). Kaleci, yüksek toplarda alanı ilan ederse temizleme yapılmaz.
- **Zamanlama:** Karar ikilemi "kontrol mü temizleme mi": rakip baskısı 2 m'den yakınsa (Opta yoğun baskı eşiği, [B] The Analyst) ve top havadaysa temizleme; serbestse ve takım arkadaşı açıksa kontrol (**antrenörlük geleneği**). Topu temizledikten sonra hat 1–2 sn içinde 5–10 m yükselir (**tahmin**).
- **Takım kuralı:** Hoca parametresi "riskten kaçınma": alçak blok ekolleri daha erken temizler; yapım ekolleri (Guardiola) kontrol ister. Oyun durumu: öndeyken ve son dakikalarda temizleme eşiği düşer.
- **Başarı ölçüsü ve gerçek sayılar:** Takım başına temizleme sayısı için güncel lig tablosu bu oturumda **bulunamadı** (FBref 403). Yorum kuralı: temizleme sayısı yüksek = çok savunma yapan takım, iyi savunan takım değil.
- **Hücumun panzehiri:** İkinci topu kazanmak için ceza yayında kalabalık (dinlenme hücumu), kötü temizlemeyi (yatay, kısa) bekleyen 8 numara, baskıyı sürdürüp temizlemeyi kenara değil ortaya zorlamak.
- **Kabiliyet eşiği:** Görme: temizleme yönünü bir bakışta seçme. Karar: kontrol/temizle. Yürütme: hava topu, uzun vuruş, zayıf ayakla temizleme.
- **Hoca tarzı:** Alçak blok ustaları; Catenaccio ve 2004 Yunanistan'ında temizleme + uzun forvete çıkış birleşir.
- **Ünlü örnek:** Dellas (Yunanistan 2004), Godín (Atlético), Lucio (Inter 2010; "Ibrahimović, Messi, Xavi ve Pedro'nun hareketlerini önceden okuyan savunma lideri", [B] thehardtackle).
- **Kaynaklar:**
  - [B] The Analyst (Opta Vision), takip verisi istatistikleri (2024/25) — https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league
  - [B] The Hard Tackle, Barcelona 1-0 Inter maç analizi (2010) — https://thehardtackle.com/2010/fc-barcelona-1-0-inter-milan-resolute-inter-book-their-place-in-the-final-with-a-defensive-masterclass/amp/
  - [B] These Football Times, Yunanistan Euro 2004 analizi — https://thesefootballtimes.co/2019/05/17/the-tactical-achievement-of-the-decade-how-greece-conquered-a-continent-to-win-euro-2004/

### D19. Alçak blok ustalığı (Low-block mastery)

- **Evre ve bağlam:** Rakip top üstünlüğünü kabul edip bütün bloğu kendi üçte birlik bölgesine kurma; derin pres (Spielverlagerung "deep press": baskı top son üçte birlik bölgeye girince, on oyuncu kendi ceza sahasının önünde kompakt). Oyun durumu tetikleri: üstün rakip, deplasman, önde olma, sayıca eksiklik.
- **Dört ustalık örneği:**
  - **Simeone Atlético (4-4-2):** "derin, dar ve kompakt" 4-4-2 / 4-4-1-1 ya da 3-5-2 / 5-3-2; rakibi dışa iter, merkezdeki 6 ve 10 numaraya erişimi keser; bekler en çok müdahale yapan oyuncular; stoperler hava topu güçlü; 2020/21 başında 17 maçta 10 gol yemeden kapanış (La Liga + ŞL). [B] https://themastermindsite.com/2020/12/18/diego-simeone-atletico-madrid-tactical-analysis-2020-21-edition/ Between the Posts raporu, Atlético'nun 4-4-2'sini "bölge kontrolünden çok adam yönelimli" tarif eder ve "stoperlerin önündeki alan"ı sezonluk zayıflık sayar (arama özeti; sayfa açılamadı). [B] https://betweentheposts.net/deportivo-alaves-atletico-madrid-compact-hosts-frustrate-winless-atletico-1-1/
  - **Mourinho Inter, Camp Nou 2010:** Motta 28'de kırmızı; Eto'o ve Chivu orta sahaya, Milito tek forvet; "altı kişilik savunma hattı", Eto'o zaman zaman sol bek; topa sahip olma %14 (TNT; Wilson %19, 90min %13,6 yazar — kaynaklar uyuşmaz); Barcelona'nın "üç–dört gerçek fırsatı"; 1-0 kaybedip 3-2 toplamla final; Mourinho: "kariyerimin en güzel yenilgisi", "yetenek değil kan tarzı". [B] TNT ve thehardtackle (D17'deki bağlantılar); [B] https://www.90min.com/posts/jose-mourinho-finally-reveals-what-he-whispered-in-pep-guardiola-s-ear-during-famous-2010-champions-league-clash-01e8xrrxc40m
  - **Ranieri Leicester 2015/16:** 4-4-2 → topsuz 4-4-1-1 (38 maçın 35'inde); iki kompakt dörtlü, geri çekilmiş forvet + hızlı santrfor; ortalama topa sahip olma **%42,43** (veri tutulmaya başlanan 2003/04'ten beri şampiyon en düşüğü); Kanté 175 müdahale + 156 top kesme (ligin en çoğu); Vardy 24 gol 6 asist, Mahrez 17 gol 11 asist; 41 → 81 puan. [B] https://www.premierleague.com/en/news/2748139
  - **Rehhagel Yunanistan 2004:** "kontrollü hücum": en az iki güçlü kafa vuran stoper, önde güçlü bir kafa vurucu, kenardan baskıyla karşı atak; savunma şekli rakibin hücumuna göre, **adam markajcılar + her zaman bir serbest adam**; finalde Portekiz'in tek forvetine karşı dörtlü savunmaya dönüş (serbest adam korunarak); çeyrek, yarı ve finaldeki üç 1-0 galibiyetin golleri sağdan ortadan; turnuva öncesi finallerde 6 maç 0 galibiyet. [B] https://thesefootballtimes.co/2019/05/17/the-tactical-achievement-of-the-decade-how-greece-conquered-a-continent-to-win-euro-2004/
- **Roller ve hareket (ortak):** 
  - iki hat arası 8–12 m (**tahmin**), genişlik ceza sahası + 5 m (**tahmin**);
  - kanat orta sahalar bekle aynı çizgiye iner (dörtlü hat önünde ikinci dörtlü);
  - forvetler rakip 6 numarayı gölgede tutar ve karşı atak çıkışıdır;
  - top kenardayken ikili kapatma (D8), kutuda bölge+adam (D15);
  - temizleme sonrası birlikte 10–15 m yükselme (**tahmin**).
- **Zamanlama:** Alçak blok "sabır" ilkelidir: pres tetiği yalnız top kendi üçte birlik bölgesine girince ve bir kenara sıkışınca; 90 dakika boyunca kolektif konsantrasyon (Carragher'ın adam adama için söylediğinin tersi: bölge bloğunda tek hata değil, tekrarlanan kayma gecikmesi gol yedirir).
- **Takım kuralı:** PPDA yüksek (14–17; 2021/22 PL alt sırası Wolves 14,78, Everton 14,63, Newcastle 14,57, Norwich 16,93, [B] PL PPDA yazısı); Opta kompaktlık "yüksek" (< 600 m²) zamanın büyük payı; alçak blok payı (Arsenal'in City deplasmanındaki %61,1'i sezonun üçüncü en yüksek maç oranıydı, [B] The Analyst).
- **Başarı ölçüsü ve gerçek sayılar:** Yenilen xG / maç, rakibin kutu içi şut sayısı, kontra başına şut (Leicester). Takım düzeyi xGA tabloları bu oturumda **bulunamadı**; Arsenal 2025/26 0,74 xGA/maç bir üst sınır örneğidir (yüksek blokla da ulaşılmış).
- **Hücumun panzehiri:** Uzaktan şut ve ikinci top (6 numara ceza yayında), kenardan hızlı geri + erken orta, hatların arasına yarım dönüş, sabır ve bloğun yorulması (ikinci yarı gol payı), duran top.
- **Kabiliyet eşiği:** Görme: az; karar: az ama sürekli (kayma); yürütme: hava topu, blok, temizleme, konsantrasyon (zihinsel dayanıklılık) ve kontra için önde iki hızlı oyuncu.
- **Hoca tarzı:** Simeone, Mourinho, Ranieri, Rehhagel, Allegri, Dyche; tarihsel: Herrera (D20).
- **Kaynaklar:**
  - [B] The Mastermind Site, Simeone/Atlético 2020/21 analizi — https://themastermindsite.com/2020/12/18/diego-simeone-atletico-madrid-tactical-analysis-2020-21-edition/
  - [B] Between the Posts, Alavés–Atlético 1-1 raporu (sayfa açılamadı; arama özeti) — https://betweentheposts.net/deportivo-alaves-atletico-madrid-compact-hosts-frustrate-winless-atletico-1-1/
  - [B] TNT Sports retro rapor, Barcelona 1-0 Inter (2010) — https://www.tntsports.co.uk/football/champions-league/2009-2010/retro-report-jose-mourinho-mastermind-as-10-man-inter-reach-final-at-barcelonas-expense_sto7737119/story.shtml
  - [B] The Hard Tackle, Barcelona 1-0 Inter maç analizi (2010) — https://thehardtackle.com/2010/fc-barcelona-1-0-inter-milan-resolute-inter-book-their-place-in-the-final-with-a-defensive-masterclass/amp/
  - [B] 90min, Mourinho–Guardiola 2010 (topa sahip olma %13,6 iddiası) — https://www.90min.com/posts/jose-mourinho-finally-reveals-what-he-whispered-in-pep-guardiola-s-ear-during-famous-2010-champions-league-clash-01e8xrrxc40m
  - [B] Premier League, “PL30: How Ranieri masterminded Leicester’s title victory” — https://www.premierleague.com/en/news/2748139
  - [B] These Football Times, Yunanistan Euro 2004 analizi — https://thesefootballtimes.co/2019/05/17/the-tactical-achievement-of-the-decade-how-greece-conquered-a-continent-to-win-euro-2004/
  - [B] Premier League, “Passes per defensive action: explained” (2021/22 Wyscout değerleri) — https://www.premierleague.com/news/4250153
  - [B] The Analyst (Opta Vision), takip verisi istatistikleri (2024/25) — https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league
  - [B] Spielverlagerung sözlüğü, “Pressing” — https://spielverlagerung.com/glossary/tactical-methods/pressing/

### D20. Bölge savunması tarihi: Catenaccio/libero ve Sacchi'nin 25 m kuralı (History: catenaccio, libero, Sacchi's zonal press)

- **Catenaccio ve libero:**
  - **Rappan'ın verrou'su (1930–40'lar, İsviçre):** bir yarı savunmacı hattın gerisine serbest örtücü (verrouilleur) olarak iner, kalanlar sıkı adam markajı; İsviçre 1938 DK çeyrek finali; "alan ve topu savunma sağlamlığıyla takas" ilkesi.
  - **İtalya'ya geçiş:** Nereo Rocco 1947'de Triestina'da daha gevşek bir sürümle Serie A ikinciliği; Helenio Herrera 1960'ta Inter'de markajı sıkılaştırıp hızlı karşı atak ekledi: Serie A 1963, 1965, 1966; Avrupa Kupası 1964, 1965; libero Armando Picchi, sol kanat bek Facchetti hücum çıkışı.
  - **Mekanik:** libero'nun markaj görevi yoktur; okur, örter, araya girer ve karşı atağı başlatır. Öndeki dört savunmacı rakibini her yere izler, modern anlamda hat tutulmaz; markajcıyı geçen hücumcu libero'yu da geçmek zorundadır.
  - **Çöküş:** Celtic 1967 (2-1, genişlik ve tempo), Ajax 1972 (2-0, konum esnekliğiyle markajcıları yerinden etme); 1970'lerin sonunda katı catenaccio azaldı, libero rolü (Beckenbauer, Baresi) kırk yıl daha sürdü.
  - Kaynaklar: [C] https://guidetofootball.com/history/catenaccio/ ve [C] https://en.wikipedia.org/wiki/Helenio_Herrera
- **Sacchi'nin bölge presi (Milan 1987–91):**
  - libero'yu kaldıran 4-4-2; bölge markajı (selefi Liedholm'un getirdiği), yüksek pres ve ofsayt tuzağını yaygınlaştırdı;
  - **savunma ile hücum arasında en çok 25 m**;
  - "gölge futbol" (topsuz antrenman: hayalî topa göre konum alma, otomatikleşene kadar);
  - dört referans noktası: top, alan, rakip, takım arkadaşı — pres, rakip oyuncunun bölgeye girmesiyle tetiklenir ve bütün takım birlikte kayar;
  - "beş düzenli oyuncu on düzensizi yener" gösterisi; "toplu iken topun önünde hep beş adam"; "her zaman sağ ve sol kanatta bir oyuncu olmalı";
  - Milan 196 maç, 109 G 58 B 29 M, 307–114.
  - Kaynaklar: [B] https://inside.fifa.com/news/sacchi-the-revolutionary-turns-75 ; [B] https://spielverlagerung.com/?p=196 ; [C] https://guidetofootball.com/history/the-pressing-era/ ; [C] https://en.wikipedia.org/wiki/Arrigo_Sacchi
- **Ofsayt kuralının rolü:** O dönem "son savunmacıyla aynı hizada ofsayt" sayıldığı ve takım arkadaşının konumu da değerlendirildiği için tuzak bugünkünden güçlüydü (arama özeti, [C] guidetofootball). Bugünün kuralıyla 25 m kompaktlık daha çok pres ve kayma disiplinine dayanır, tuzağa daha az.
- **Yayılma:** 2004 ŞL son 16'sındaki 16 takımın 15'i bölge savunması oynuyordu; adam adama "ölmek üzere" sayılırken Yunanistan 2004 onunla şampiyon oldu. [C] https://en.wikipedia.org/wiki/Zonal_marking
- **Motor için ders:** Libero = +1 serbest adam ilkesi (D6, D14, D19'da hâlâ yaşıyor); Sacchi = hat + kompaktlık + kolektif tetik (D1, D2, D13). İkisi birbirinin alternatifidir; aynı anda hem hat hem libero olmaz.
- **Kaynaklar:**
  - [C] Guide to Football, “Catenaccio” — https://guidetofootball.com/history/catenaccio/
  - [C] Wikipedia, “Helenio Herrera” — https://en.wikipedia.org/wiki/Helenio_Herrera
  - [B] FIFA, “Sacchi the revolutionary turns 75” — https://inside.fifa.com/news/sacchi-the-revolutionary-turns-75
  - [B] Spielverlagerung, Sacchi’nin dört referans noktası — https://spielverlagerung.com/?p=196
  - [C] Guide to Football, “The pressing era” — https://guidetofootball.com/history/the-pressing-era/
  - [C] Wikipedia, “Arrigo Sacchi” — https://en.wikipedia.org/wiki/Arrigo_Sacchi
  - [C] Wikipedia, “Zonal marking” — https://en.wikipedia.org/wiki/Zonal_marking

### D21. Modern karma sistemler: adam yönelimli bölge (Hybrid systems: man-oriented zonal defence)

- **Evre ve bağlam:** Bugünün çoğu üst takımı saf bölge de saf adam da değildir: **bölge referanslı diziliş + top yakınında adam yönelimi**. Yüksek preste adam adama (Guardiola Bayern'inde adam markajlı karşı pres, City'de karışım, [B] PL karşı pres yazısı), orta blokta bölge, kutuda bölge+adam (D15–D16).
- **Örnek karmalar:**
  - **Üçlü savunma + adam yönelimli orta saha (Gasperini):** savunma hattı adam izler ama "dinamik beşli" ile her an üçü arkada kalır; pres şekli 3-4-3 / 3-4-2-1, blok 5-2-1-2 / 5-4-1 / 5-3-2. [B] themastermindsite Gasperini; [B] Gasperini bülteni.
  - **4-4-2 adam yönelimli bölge (Simeone, Alavés örneği):** iki aynalı 4-4-2'nin "bölge kontrolünden çok adam yönelimi" üzerine oynaması. [B] Between the Posts (arama özeti).
  - **Dinlenme savunmasında adam adama +1 (Bielsa) ↔ bölge 2-3 (Guardiola):** D14.
  - **Opta Vision'un gösterdiği esneklik:** Arsenal 2024/25'te rakip yapımında zamanın %21,2'si alçak blok, %47'si yüksek kompaktlık; aynı takım City'ye karşı %61,1 alçak blok — blok yüksekliği rakibe göre maç içinde değişir. [B] The Analyst.
- **Roller ve hareket:** Kural: "bölgede dur, bölgene giren adamı **al ve bırakma** (top yakınındaysa), bölgenden çıkanı devret (top uzaktaysa)". Top yakınlığı yarıçapı 10–15 m (**tahmin**). Bu, Sacchi'nin dört referans noktasının (top, alan, rakip, takım arkadaşı) ağırlıklandırılmasıdır: top yakınında rakip ağırlığı artar, uzağında alan ağırlığı.
- **Zamanlama:** Adam yönelimi tetiklenince markaj 2–4 sn ya da top o bölgeden çıkana kadar sürer (**tahmin**; `kapatKalici`, `markajKalici` anahtarlarının anlamı).
- **Takım kuralı:** Hoca parametreleri: adam yönelimi yarıçapı, serbest adam sayısı, pres yüksekliği, dinlenme savunması türü. Bauer, Anzer & Shaw'ın bulgusu: aynı takım farklı evrelerde farklı diziliş kullanır; tek "4-4-2" kodu yetmez. [A] https://lida.sport-iat.de/dfb/Record/4081226?lng=en
- **Başarı ölçüsü ve gerçek sayılar:** Evre başına PPDA ve kompaktlık (Opta Vision), yüksek top kazanma; Bauer–Anzer karşı pres tespit modeli (AUC %87,4) karşı presin ne sıklıkta ve nerede yapıldığını etiketler. [A] Springer (D7'deki bağlantı).
- **Hücumun panzehiri:** Karma sistemin dikiş yerleri: adam yöneliminin bittiği yarıçapın hemen dışına koşu; bölge devri anında üçüncü adam; serbest adamı ikilemde bırakan iki koşucu.
- **Kabiliyet eşiği:** En yüksek bilişsel yük: oyuncu her an "bölge mi adam mı" kararını verir; antrenman süresi ve oyuncu zekâsı gerektirir.
- **Hoca tarzı:** Guardiola, Tuchel, Nagelsmann, Arteta, De Zerbi, Gasperini, Simeone.
- **Kaynaklar:**
  - [B] Premier League, “Counter-pressing and the gegenpress: football tactics explained” — https://www.premierleague.com/news/4244321
  - [B] The Mastermind Site, Gasperini/Atalanta 2020/21 analizi — https://themastermindsite.com/2021/05/11/gian-piero-gasperini-atalanta-tactical-analysis-2020-21/
  - [B] Fussball Coaches Newsletter, Gasperini’nin adam yönelimli savunması — https://fussballs-newsletter-4ebdfb.beehiiv.com/p/gasperinis-manoriented-defense
  - [B] Between the Posts, Alavés–Atlético 1-1 raporu (sayfa açılamadı; arama özeti) — https://betweentheposts.net/deportivo-alaves-atletico-madrid-compact-hosts-frustrate-winless-atletico-1-1/
  - [B] The Analyst (Opta Vision), takip verisi istatistikleri (2024/25) — https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league
  - [A] Bauer, Anzer & Shaw 2023, J. Sports Analytics 9(1):39–59 (özet) — https://lida.sport-iat.de/dfb/Record/4081226?lng=en
  - [A] Bauer & Anzer 2021, Data Mining and Knowledge Discovery 35(5):2009–2049 (sayfa bu oturumda açılamadı) — https://link.springer.com/article/10.1007/s10618-021-00763-7

### D22. Savunma ölçüleri (Defensive metrics)

- **PPDA (passes per defensive action):** Colin Trainor, 2014. Rakibin pas sayısı ÷ savunma eylemi (müdahale, top kesme, başarısız müdahale girişimi/challenge, faul); alan: Opta x > 40 (rakip kalesine en yakın %60; "x = 50 orta sahayı geçer geçmez yapılan presi kaçırır, x = 33 savunma üçte birliğine girer"); düşük = yoğun pres; sağlayıcıya göre alan ve eylem listesi değişir, StatsBomb ve Opta/Wyscout değerleri bire bir karşılaştırılamaz. Örnekler: Guardiola Barcelona 6–9; Pochettino Southampton < 8; Southampton–Cardiff tek maç 14,5; 2013/14 PL 20 lig-sezon içinde en yüksek PPDA (en az pres). [B] https://www.hudl.com/blog/defensive-metrics-measuring-the-intensity-of-a-high-press ve [B] https://www.premierleague.com/news/4250153 (2021/22 değerleri D1'de). Lig ortalaması için güvenilir yayın **bulunamadı**; 2021/22 uçları 7,3–16,9 olduğuna göre ortalama ~11 (**tahmin**).
- **Baskı (pressure) ve karşı baskı:** StatsBomb: top sahibine 5 yarda (≈4,6 m) yarıçap (kaleciye 10), süre ve yer kaydedilir; karşı baskı: top kaybından sonraki 5 sn; karşı baskı geri kazanımı: 5 sn içinde top. Opta: karşı baskı 2 sn içinde; "yoğun baskı" 2 m. Çıktılar: son üçte birlik bölge baskısı/maç (Chelsea 2024/25 67,6), baskı sonrası top kazanma (turnover), karşı pres kesri (%47 ortalama), geri kazanım oranı (Burnley %14). [B] StatsBomb karşı pres; [B] The Analyst (iki yazı).
- **Yüksek top kazanma (high turnover):** Opta: açık oyunda rakip kalesine ≤ 40 m başlayan sahiplik; lider ~10–11/maç (City 2023/24 11,0; Spurs 2024/25 10,2); şuta dönüşüm (Bournemouth 25 şut / 13 maç). [B] The Analyst Bournemouth–Spurs.
- **Challenge intensity (Wyscout):** rakip topa sahipken dakika başına düello + müdahale + top kesme olarak tanımlandığı biliniyor; bu oturumda tanım sayfası doğrulanamadı (**bulunamadı**; arama bütçesi). Opta'nın aynı adlı ölçüsü yok; Opta "challenge" = başarısız müdahale girişimi (PPDA paydasında). [B] PL PPDA yazısı.
- **Top kazanma yüksekliği / savunma mesafesi:** StatsBomb raporlarında "defensive distance" (savunma eylemlerinin kendi kalesine ortalama uzaklığı) ile yüksek/orta/alçak blok haritaları (ligin ortalamasına göre nerede daha çok/az eylem) kullanılır; sayılar PDF raporda, bu oturumda okunamadı. [B] https://blogarchive.statsbomb.com/articles/soccer/defensive-styles-in-the-bundesliga-a-statsbomb-report/
- **Savunma hattı yüksekliği (takip verisi):** FIFA EFI tanımı (kale çizgisi → en derin saha oyuncusu); Opta Vision kompaktlık (m²; < 600 yüksek, > 900 düşük) ve blok türü zaman payları; LaLiga 2023/24 çalışmasında "göreli hat yüksekliği" savunma başarısının en güçlü göstergesi. [B] FIFA; [B] The Analyst; [A] arXiv 2511.06191.
- **Blok/evre sınıflaması (Bauer ve ark.):** Kullanıcı notundaki "Bauer 2022 blok sınıflaması" olarak bulabildiklerim: (1) Bauer & Anzer 2021, karşı pres tespiti (DMKD 35(5):2009–2049; 134 öznitelik, > 20.000 etiketli geçiş, 97 maç, AUC %87,4, altı Bundesliga sezonu); (2) Bauer, Anzer & Shaw 2023, "Putting team formations in association football into context" (JSA 9(1):39–59): CNN ile maçı evrelere böler (F1 0,76), orta blok en sık evre, orta blokta altı diziliş, Bundesliga'da dizilişlerin verimliliği. 2022 tarihli ayrı bir "yüksek pres / orta blok / alçak blok" sınıflama makalesi **bulunamadı**; muhtemelen (2)'nin ön baskısı. [A] https://uni-tuebingen.de/en/218844 ; [A] https://lida.sport-iat.de/dfb/Record/4081226?lng=en
- **Pressing Intensity (Bekkers 2024/25):** takip verisinde kare kare, her savunmacının her hücumcuya/topa kesişme süresi (tepki süresi + mesafe/azami hız + ters yön cezası) → T = 1,5 sn eşiğinde lojistik olasılık, σ = 0,45; hedef üzerindeki toplam baskı 1 − ∏(1 − p); 2 m/sn altındaki savunmacı pres yapmıyor sayılır. Motor için doğrudan uygulanabilir tanım. [A] https://arxiv.org/html/2501.04712v1
- **Geçiş süresi ve sonucu:** Casal ve ark. 2016 (2010 DK, 804 geçiş): %66,3 0–15 sn; başarı 0–15 sn ile anlamlı; top kaybı en çok hücum orta sahasında (%48,9); hat %75,7 yüksek. [A] PMC5968892. Vogelbein ve ark. 2014 (Bundesliga 2010/11, 306 maç): savunma tepki süresi; üst takımlar en hızlı (tam metin okunamadı). [A] tandfonline DOI 10.1080/02640414.2013.843305.
- **Duran top:** kornerden yenilen gol ve xGA (D16'daki PL tablosu); markaj türü payları (2011/12: %90,1 adam, %9,9 bölge). [B] premierleague.com; [A] Pulling ve ark. 2013.
- **Ofsayta düşürme:** 2024/25 Liverpool 96, Villa 93, Chelsea 88; Liverpool 2016–22 ortalama 118. [B] The Analyst; [B] Anfield Index.
- **Bireysel:** müdahale, top kesme, blok, temizleme, hava topu %, 1v1'de geçilme; örnekler Kanté 175/156 (2015/16), Atalanta 15,9 müdahale ve 14 top kesme/maç (2020/21), Savić %61 ve Felipe %67 hava topu. Lig ortalamaları bu oturumda **bulunamadı**.

---

## Motor için notlar

1. **İlkel × bağlam × rol tablosu.** Her ilkel üç girdiyle çağrılır: (a) bağlam = blok yüksekliği (yüksek/orta/alçak), evre (yerleşik / savunma geçişi / duran top), topun bölgesi, oyun durumu (skor, dakika, yorgunluk); (b) rol = 1. adam / 2. adam / denge / hat / serbest adam / kaleci; (c) tetik = D3 listesi + top kaybı (D7) + kenar (D8) + şut hattı (D17). Çıktı, oyuncunun o an için hedef noktası, hızı ve bağlılık süresidir. Mevcut anahtarlar (`kapatKalici`, `presKalici`, `kovalaKalici`, `markajKalici`, `kutuSavunmaAta`, `gecGirisAta`, `kanatKapat`, `sutHamle`, `blokErisim`, `yorgunPres`, `yorgunBlok`, `kapiFaz`) bu tablonun satırlarıdır; kütüphane, satırların "neden" ve "ne kadar"ını verir.
2. **Blok yüksekliği tek sayı değil, üç kiplik bir durum makinesidir** (D1, D2, D19): yüksek ↔ orta ↔ alçak geçişleri oyun durumuna ve rakibe göre maç içinde değişir (Arsenal'in City deplasmanında %61,1 alçak blok). Hoca profili varsayılan kipi ve geçiş eşiklerini verir; oyuncu kalitesi kipin sürdürülebilirliğini (yorgunluk, hız) sınırlar.
3. **Pres bir "git/dön" kararıdır, süreklilik değil** (D3, D7). Tetik → 2–5 sn'lik agresif pencere → kazanılmazsa bloğa dönüş. StatsBomb'un 5 sn'si ve Opta'nın 2 sn'si iki ayrı eşik olarak modellenebilir: 2 sn "anlık karşı baskı" (en yakın oyuncu), 5 sn "kolektif karşı pres" (3+ oyuncu). Pencere kapanınca geri koşu (D11) başlar; hiçbir oyuncu 5 sn'den uzun "ara durum"da kalmaz.
4. **Erişim (access) ölçüsü olarak Bekkers'in zaman-kesişim modeli** (D22) motorun diline uygundur: oyuncunun topa/rakibe ulaşma süresi = tepki + mesafe/hız + yön cezası; T ≤ 1,5 sn ise pres yapılabilir, değilse geciktir/örten ol. Bu tek formül D3 (tetik), D7 (git/dön), D9 (jokey mesafesi) ve D17 (blok mu pas yolu mu) kararlarını birleştirir.
5. **1. adam asla yalnız gitmez** (D5): 2. adam yoksa 1. adam otomatik olarak jokey kipine (D9) düşer. Bu tek kural, bireysel "dalma" robotluğunu ve savunmanın tek pasla delinmesini azaltır.
6. **Kompaktlık hedefi alan cinsinden** (D2): Opta eşiği (< 600 m² yüksek, > 900 m² düşük) motorun kendi ölçütü olabilir: savunan on oyuncunun dışbükey örtüsü. Hoca profili hedef alanı verir; alan hedefin üstüne çıkarsa oyuncular topa değil bloğa yaklaşır.
7. **Hat üç kipli** (D13): yüksel / tut / düş; referans pasçının baskı durumu (2 m eşiği). Tuzak = "yüksel" kipinin pas anından 0,3–0,5 sn önce (tahmin) tetiklenmesi, yalnız hat lideri komutuyla ve bütün hat aynı karede; bir oyuncu geç kalırsa tuzak yok. VAR altında "aynı hizada" lehe değil; motorun ofsayt kararı santimetreyle çalıştığı için tuzağın risk/kazanç oranı hoca cesaretiyle ölçeklenir.
8. **Serbest adam sayısı (0 / +1 / +2) tek bir hoca parametresi olarak** D6, D14, D19 ve D20'yi birleştirir: 0 = tam adam adama (Bielsa Sheffield United maçı), +1 = Bielsa/Rehhagel/libero, +2 = bölge ekolleri. Adam adama ekollerde 1v1 kaybı doğrudan tehlike üretir (Carragher); bölge ekollerinde ise kayma gecikmesi birikir.
9. **Kutu savunması iki ayrı ilkel** (D15 açık oyun, D16 duran top) ve ikisi de karma: bölge oyuncusu sayısı, adam markajcı sayısı, serbest oyuncu sayısı hoca parametresi. Perdeleme ve geç koşu (`kornerPerde`, `gecGirisAta`) hücum tarafında zaten var; savunma tarafında "bölge oyuncusu kendi bölgesinde öne çıkar, geriye asla" kuralı eklenebilir.
10. **Yorgunluk önce D11 ve D1'i bozar:** geri koşu kalitesi ve yüksek pres tekrarı en çok düşen ilkellerdir; alçak blok (D19) ve şut bloğu (D17) en az etkilenir. Mevcut `yorgunPres`/`yorgunBlok`/`yorgunKosu` ayrımı bu sıraya uyar; ikinci yarı gol payı ölçüsü ("Y:" satırları) kabul ölçütüdür.
11. **Kabiliyet ölçeklemesi üç eksende** (her ilkelin "Kabiliyet eşiği" satırı): görme (tetiği fark etme süresi, çevresel görüş), karar (doğru kip seçimi olasılığı, rol değişim hızı), yürütme (ivme, fren, hava topu, müdahale tekniği). Hoca kabiliyeti ise takım kurallarını (blok kipi, serbest adam, dinlenme savunması türü, kompaktlık hedefi, tuzak cesareti) ve antrenman süresiyle kolektif gecikmeyi ölçekler. Bu bölüm sayıları bu eksenlere bağlamaz; o iş `js/mac-profil.js` kapısının ve veritabanının işidir.
12. **Sayıların güvenilirliği:** [A] ve [B] işaretli sayılar kabul ölçütü olabilir; [C] ve "tahmin" işaretliler yalnız başlangıç değeridir ve 80 maçlık `--karsilastir` ile ayarlanır (CLAUDE.md test kademeleri). "bulunamadı" işaretli ölçüler için önce motorun kendi ölçümü yazılır, sonra dış sayı arandığında karşılaştırılır.

## Ölçüler

Motorun ölçebileceği ve bu bölümün sayılarıyla karşılaştırılabilecek büyüklükler. Sağ sütun dış referanstır; boşsa önce içeriden ölçülür.

| Ölçü | Tanım (motor) | Dış referans | Kaynak türü |
|---|---|---|---|
| PPDA (x > %40) | rakip pas ÷ (müdahale + top kesme + başarısız müdahale + faul), rakip kalesine en yakın %60'ta | 2021/22 uçları 7,26 (Barcelona) – 16,93 (Troyes/Norwich); PL en yoğun Liverpool 8,62 | [B] PL, Hudl |
| Karşı pres kesri | top kaybından 5 sn içinde baskı altına alınan açık oyun sahipliği payı | ortalama 0,47 (PL, 177 maç) | [B] StatsBomb |
| Karşı pres geri kazanımı | 5 sn içinde geri alınan / karşı pres pozisyonu | Burnley %14 (17. sıra); lider City/Spurs/Liverpool (değer yok) | [B] StatsBomb |
| Karşı presten şut yeme | karşı pres pozisyonlarının şutla bitme payı | lig %10, Burnley %13 | [B] StatsBomb |
| Karşı baskı (2 sn) | top kaybından 2 sn içinde baskı sayısı | Spurs 801 / 13 maç (≈62/maç) | [B] The Analyst |
| Yüksek top kazanma | rakip kalesine ≤ 40 m başlayan açık oyun sahipliği / maç | lider 10–11/maç; şuta dönüşüm Bournemouth 25/13 maç | [B] The Analyst |
| Son üçte birlik bölge baskısı | baskı olayı (≤ 5 yarda) sayısı / maç | Chelsea 67,6 (6.), Spurs 911/13 maç | [B] The Analyst |
| Yoğun baskı | top sahibine ≤ 2 m rakip | tanım | [B] The Analyst |
| Kompaktlık | savunan 10 oyuncunun kapladığı alan (m²) | < 600 yüksek, > 900 düşük; Arsenal %47,0 yüksek zaman payı | [B] The Analyst |
| Alçak blok zaman payı | rakip yapımında alçak blokta geçen süre payı | Arsenal %21,2 sezon, %61,1 City deplasmanı | [B] The Analyst |
| Hat yüksekliği | kale çizgisi → en derin saha oyuncusu (m) | tanım FIFA; ~51 m (Arsenal/City 2024/25) ve 35–40 m (Forest/Leicester) ikincil | [B]/[C] |
| Dikey kompaktlık | en derin savunmacı → en ileri forvet (m) | Sacchi ≤ 25 m | [B] FIFA |
| Ofsayta düşürme | sezon başına | 2024/25 Liverpool 96, Villa 93, Chelsea 88; Liverpool 2016–22 ort. 118 | [B] |
| Geçiş süresi | top kaybı → geri kazanım (sn) | %66,3 0–15 sn; başarı 0–15 sn ile ilişkili | [A] Casal 2016 |
| Top kaybı bölgesi | kaybın sahadaki bölgesi | %48,9 hücum orta sahası | [A] Casal 2016 |
| Erişim (pressing intensity) | kesişme süresi ≤ 1,5 sn olasılığı; 2 m/sn altı pres değil | tanım | [A] Bekkers |
| Kornerden gol / xGA | sezon başına | en iyi 0–2 gol, 1,1–1,4 xGA; en kötü 9 | [B] PL 2022/23 |
| Korner markaj türü payı | adam / bölge / karma | 2011/12: %90,1 adam, %9,9 bölge; 2022/23 çoğu karma | [A]/[B] |
| Jokey mesafesi | 1. adam–top sahibi (m) | ~1,8 m fren noktası (2 yarda), 45° yan duruş | [C] |
| Dinlenme savunması | topun arkasındaki oyuncu sayısı ve şekli | ≥ 4 arkada; stoperler ≤ 13,7 m açık; 6 sn hedefi | [C] Sportplan |
| Müdahale / top kesme | takım ve oyuncu başına | Kanté 175/156 (sezon); Atalanta 15,9/14 (maç) | [B] |
| Faul | adam adama ekollerde yüksek | Atalanta 15,3/maç (Serie A 2.) | [B] |
| Hava topu kazanma | stoper % | Savić %61, Felipe %67 | [B] |
| Topa sahip olma (alçak blok) | % | Leicester 2015/16 %42,43; Inter Camp Nou 2010 %14 (kaynaklar %13,6–19 arasında değişir) | [B] |
| Blok payı, temizleme, geri koşu sayısı | motor içi | **bulunamadı** (dış lig ortalaması) | — |

Bu bölümdeki bütün dış bağlantılar 2026-10-19'da okunmuştur; okunamayan sayfalar (403/503/zaman aşımı) ilgili maddede belirtildi ve o sayılar arama özetinden alındıysa yazıldı.
