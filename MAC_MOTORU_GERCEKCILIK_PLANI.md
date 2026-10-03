# Chairman — maç motoru gerçekçilik planı

**Durum (2026-10-04):** T0 tamamlandı (ölçümler YOL_HARITASI T0). T1 sürüyor; kullanıcı kararıyla yürüme hedefi en az %55 (§7.2). Kullanıcı isteğiyle depoya alındı; turlar [YOL_HARITASI](YOL_HARITASI.md#maç-motoru-gerçekçilik-planı-2026-10-03) “Maç motoru gerçekçilik planı” bölümünde T0–T11 maddeleridir. Uygulama T0 ile başlar. §7'deki kararlar açıktır; uygulayıcı bunları sessizce kesinleştirmez, ilgili tura gelince kullanıcıya sorar. Ölçüm araçlarının ilk ikisi eklendi: `araclar/olcumler/r-karne.js` ve `araclar/oyuncu-karnesi.js` (Ek F).

**Bu belge kimin için:** Planı uygulayacak model ve kullanıcı. Her tur kendi başına okunabilir: neden gerekli, kodda kök neden nerede, ne yapılacak, neyle ölçülecek.

**Dayanak:** Motorun bütün dosyaları okundu (`js/mac-*.js`, `js/animasyon.js`, `js/oyuncular.js`). Bu makinede (Node v24.15.0) 40 maçlık standart ölçüm, 40 maçlık derin ölçüm, 6 maçlık hız ölçümü ve 6 maçlık karar izi çalıştırıldı (tanımları Ek F'de; aynı ölçümler artık `araclar/olcumler/r-karne.js` ve `araclar/oyuncu-karnesi.js` ile yeniden üretilir). Gerçek futbol verisi ve başka oyunların çözümleri araştırıldı (kaynaklar sonda).

---

## 1. En önemli bulgular

Motorun pas, şut ve kaleci modelleri iyi durumda. "Robot gibi" his üç yerden geliyor: herkes sürekli ve sarsıntılı koşuyor, top kimsenin ayağında durmuyor, oyuncular birbirinin aynısı gibi davranıyor.

| Gösterge | Motor (ölçüm) | Gerçek futbol |
|---|---|---|
| Durma + yürüme süresi | top oyundayken %17, maçın tamamında %32 | maçın tamamında ~%61 |
| Depar süresi | %5,8–7,3 | ~%1,4 |
| Aynı anda 16+ saha oyuncusu koşuyor | anların %72'si | — |
| Topa 25 m'den uzak oyuncunun 4 m/sn üstünde koştuğu süre | %59 | çoğunlukla yürür |
| 3 m/sn² üstü ivmelenme | oyuncu başına dakikada 25 | 2 m/sn² üstü ivmelenme ~14 sn'de bir (≈4/dk) |
| Duruştan ivme tavanı | 9,0–11,6 m/sn² | kuramsal A0 ≈ 7,1–7,4; ölçülen en yüksek ≈ 5,7–5,9 |
| Topun ayakta kalma süresi (ortanca) | 0,65 sn; %74'ü 1 sn'den kısa | oyuncu başına ~2 sn |
| 5 m'den uzun top taşıma | sahipliklerin %7'si | temel eylem |
| Topla karar dağılımı | %86 pas, %6,6 sürme, %0,4 koruma (rakip 6 m'den uzakken bile %93 pas) | — |
| Takım sahipliği | 1,35 pas, 6,5 sn; %42'si pas yapılamadan biter | 9,5 sn; takıma göre 2,9–5,1 pas |
| PPDA (savunma eylemi başına rakip pası) | 3,9 | ~11 |
| Pasın alıcısı | %55 forvet, %5,5 kanat; ortalama pas boyu 24,7 m | — |
| Şutun yeri | %40 ceza sahası içinden; ortanca 18–20 m | %68 içeriden; ortalama 13,6–16,1 m |
| Şutu kim atıyor | neredeyse yalnız iki forvet (orta saha ve kanat ≈ 0) | — |
| Gollerin kaynağı (72 gol) | %50 duran top (serbest vuruş %29, korner %15, penaltı %4) | %20–30 |
| Korner başına gol | %12 (90 kornerde 11) | %1,6–4,1 |
| Barajlı serbest vuruş | %16'sı gol; doğrudan şut başına ≈%23 | doğrudan vuruş ≈%6 |
| Kenardan serbest vuruşta ceza sahasındaki hücumcu | 0 | 4–6 |
| Kornerde çıkan / geride kalan | hep 3–5 / 3 (hız özelliğinden bağımsız) | duruma göre değişir |
| Yetenek–davranış ilişkisi | sürüş↔çalım r = 0,13–0,37; müdahale özelliği↔müdahale sayısı r = −0,2…−0,5; sertlik↔faul ≈ 0 | — |
| Bilinçli çalım manevrası | maç başına ~2 (kanatlar ≈ 0) | — |
| Topun gövdenin içinden geçmesi | maç başına 7,4 | 0 |
| Ortalama şut hızı | 28,8 m/sn (en yüksek 32,6) | azami içüstü vuruş 28–30 m/sn; maç ortalaması bunun altında |

---

## 2. Teşhis: kök nedenler

### 2.1 Hareket
- `moveP` ([js/mac-hareket.js:138](js/mac-hareket.js)) istenen hız ile mevcut hız arasındaki farkı her karede izin verilen en büyük ivmeyle kapatır (itiş 9–11,6, fren 7,5–9, yanal 6–9,5 m/sn²). Küçük bir yer düzeltmesi bile azami ivmeyle yapılır. İnsan azami ivmeyi yalnız gerektiğinde kullanır.
- `bolgeKonumu` ([js/mac-dizilis.js:177](js/mac-dizilis.js)) her oyuncunun hedefini her karede topun yerine göre yeniden hesaplar. Hedef sürekli kaydığı için oyuncu sürekli ayar yapar.
- `hizOran` en az 0,45'tir ([js/mac-dizilis.js:207](js/mac-dizilis.js)). Hedefi 2,5 m'den uzak olan hiç kimse yürümez (0,45 × tepe hız ≈ 3,4 m/sn).
- Savunma bloğu tek bir takım gecikmesiyle (0,4 sn, [js/mac-dizilis.js:106](js/mac-dizilis.js)) kayar; on oyuncu aynı anda tepki verir.
- Yerinde dönüş hızı 11 rad/sn'dir ([js/mac-hareket.js:165](js/mac-hareket.js)); 180° dönüş 0,29 sn sürer.

### 2.2 Topla oyun
- Sürmenin başarı olasılığı, yolunda rakip olmasa bile `0,6 + 0,35·sürüş`'tür ([js/mac-karar.js:358](js/mac-karar.js)); değeri `buradaXT + 2,5` ile sınırlıdır ([:365](js/mac-karar.js)). Boş alanda top taşımak cezalandırılır.
- Topu korumanın değeri her zaman eksidir ([js/mac-karar.js:372](js/mac-karar.js)).
- Pasın değeri tek adımlıktır: alıcının durduğu yerin tehdidi + metre başına ilerleme + hedef forvet ek değeri ([js/mac-karar.js:160](js/mac-karar.js), [:234](js/mac-karar.js)). Alıcının topu aldıktan sonra ne yapabileceği hesaba katılmaz. Sonuç: top hep ulaşılabilen en ilerideki oyuncuya, yani forvete gider.
- Seçilen pasların tahmini başarısı ortalama 0,81, gerçekleşen genel pas isabeti %69. Model iyimser olabilir; hangi pas türünde saptığı ölçülmeli.
- Karar süresi 0,10–0,36 sn'dir ve hemen ardından `kararVer` çalışır.

### 2.3 Bireysellik
- Bütün oyuncular aynı fayda işlevini aynı ağırlıklarla kullanır. Özellikler yalnız başarı olasılığını etkiler, neyin deneneceğini etkilemez.
- `p.surus.cal` hiçbir yerde yazılmaz ([js/mac-topla.js:284](js/mac-topla.js)); çalım rastgele sıklıkla başlar ([js/mac-hareket.js:270](js/mac-hareket.js)).
- İvme, çeviklik, güç, ilk dokunuş, soğukkanlılık, zayıf ayak gibi özellikler ya türetiliyor ya yok.

### 2.4 Takım oyunu
- Destek noktası yalnız topa en yakın üç oyuncuya verilir ([js/mac-topla.js:415](js/mac-topla.js)); derin koşu rastgele sıklıkla ve rastgele hedefe başlar ([:436](js/mac-topla.js)).
- Oyun kurma düzeni, takım niyeti (kur, ilerlet, kontra, tut), skor ve dakika etkisi yoktur.
- Pres konuma bağlıdır ([js/mac-dizilis.js:130](js/mac-dizilis.js)); kötü ilk dokunuş, geri pas ya da sırtı dönük alıcı tetiklemez.

### 2.5 Duran toplar
- Korner: 6 sabit hücum yeri, 7 sabit savunma yeri ([js/mac-kurallar.js:179](js/mac-kurallar.js)); kafası iyi iki stoper çıkar, kalan savunmacılar orta sahaya gider ama hıza göre seçilmez.
- Baraj sayısı yalnız mesafeden ([js/mac-kurallar.js:196](js/mac-kurallar.js)); baraj zıplamaz. Doğrudan vuruş aşırı verimli.
- Kenardan ya da uzaktan serbest vuruşta özel düzen yok ([js/mac-topla.js:455](js/mac-topla.js)).
- Duran top 5–7 saniyede kullanılıyor; stoperin ceza sahasına varmasına süre kalmıyor.

### 2.6 Fizik
- Top: sürükleme katsayısı sabit ([js/mac-motoru.js:22](js/mac-motoru.js)); dönüş iki sayıdan ibaret (`egri`, `ust`); yan dönüşlü top sekince yön değiştirmez; yuvarlanma yavaşlaması 1,2–2,1 m/sn² ([:95](js/mac-motoru.js)).
- Top–beden çarpışması adım sonundaki uzaklığa bakar ([js/mac-mudahale.js:103](js/mac-mudahale.js)). 30 m/sn'lik top bir adımda 0,5 m gider ve gövdenin içinden geçebilir.
- Vuruş hatası yalnız normal dağılımdır ([js/mac-topla.js:148](js/mac-topla.js)); ıska, topun altına girme gibi nadir büyük hatalar yoktur.
- Sert şut hızı `25 + 6·şut` m/sn ([js/mac-karar.js:313](js/mac-karar.js)); neredeyse her şut azami güçte.
- Yarı yarıya top, hava topu ve faullerin üçte ikisi olasılık çekilişiyle çözülür ([js/mac-mudahale.js:67](js/mac-mudahale.js), [:139](js/mac-mudahale.js), [:303](js/mac-mudahale.js)).

### 2.7 Hiç yaşanmayan maç olayları
Sakatlık ve tedavi, elle oynama, çabuk kullanılan serbest vuruş, hakem topu, zaman geçirme, skora göre oyun değiştirme, hocanın maç içi taktik değişikliği, yağmur ve rüzgâr, gol ya da hata sonrası moral değişimi, bayrağı geç kalkan ofsayt, son dakikada kalecinin kornere çıkması, uzatma ve penaltı atışları.

---

## 3. Tasarım ilkeleri

1. **Karar ve uygulama aynı saf işlevi kullanır.** Pas (`pasPlani`) ve kaleci (`kaleciTahmin`) örneği taşıma, çalım, müdahale, hava topu ve duran topa genişler. Saf işlev rastlantı çekmez, önbellek yazmaz.
2. **Sonuç geometri ve zamanlamadan çıkar.** Rastlantı yalnız girdidedir: tepki süresi, vuruş hatası, okuma hatası, hakemin görmesi.
3. **Önce ölçü, sonra kod.** Her tur kendi senaryosu ve karne satırlarıyla başlar ve kapanır.
4. **Efor ölçülü harcanır.** Azami ivme ve depar yalnız mücadele, kovalama ve koşuda kullanılır; yer tutma rahat tempoda yapılır.
5. **Aynı durum, farklı oyuncu, farklı davranış.** Özellik "ne kadar iyi"yi, eğilim "neyi dener"i belirler.
6. **Önce uzaktan görünen.** Başkan geniş açıdan bakar; önce tempo, akış ve yerleşim, sonra dürbünde görünen ayak ayrıntısı.
7. **10 dakikalık maç 90 dakikanın özeti gibi oynar (karar gerekir, bkz. §7).** Bugün olay sıklığı, topun çok sık el değiştirmesiyle sağlanıyor: ataklar gerçeğinden kısa (6,5 sn ve 1,35 pas; gerçekte 9,5 sn ve 3–5 pas). Öneri: daha az, daha uzun ve amaçlı atak; şut sayısı atakların verimiyle korunur.

---

## 4. Turlar

Her turun kapanışı: 80 maç `--karsilastir`, ilgili senaryo, robotluk karnesi (Ek F), `ad-denetimi.js`, `an-yakala.py` film şeridi, `akis-deneme.py`; belgeler (YOL_HARITASI, TEKNIK_PLAN §8) güncellenir.

### T0 — Ölçü ve araçlar (sonucu değiştirmez)

1. **Yerel taban.** `node araclar/mac-deneme.js 80 1 --json araclar/taban/t0.json`. Mevcut `son.json` bu makinede `--ayni` ile eşleşmiyor (2.8W notu); neden büyük olasılıkla Node sürümü, doğrulanmalı ve taban dosyasına sürüm yazılmalı. Bu makinedeki 16 maçlık kısa denemede sarı kart 3,9 çıktı (belgedeki 80 maçlık değer 2,5); küçük örneklem olabilir, 80 maçlık yerel taban netleştirmeli.
2. **Robotluk karnesi — eklendi.** `araclar/olcumler/r-karne.js`: hız bölgeleri, topa uzaklıkta koşu, eşzamanlı koşu, ivmelenme sayısı, top ayakta süre, taşıma, sahiplik zinciri, top kaybı nedeni, PPDA, şut yeri, duran top golleri, korner ve serbest vuruş düzeni, duran top hazırlığı. `mac-deneme.js` her çalıştırmada “R:” satırlarıyla yazar, `--karsilastir` ile kıyaslar. Kalan iş: kalibrasyon ve yeni senaryolarla birlikte kabul hedeflerini satırlara bağlamak.
3. **Karar izi ve bireysellik — eklendi.** `node araclar/oyuncu-karnesi.js [maç] [tohum]`: `kararVer` seçeneklerinin tür başına en iyi değeri, seçilen eylem, alıcının grubu, baskı ve sahadaki yer; ilk 11'lerin oyuncu başına eylem tablosu ve özellik ↔ davranış ilişkisi (Pearson r). "Neden hep forvete" sorusu bununla yanıtlanır.
4. **Pas kalibrasyonu.** Seçilen her pas için tahmin edilen P ile sonuç; tür ve uzunluğa göre tablo. 5 puandan fazla sapan dilim işaretlenir.
5. **Yeni senaryolar** (`araclar/senaryolar/c-hareket.js` kalıbı): `c-1v1`, `c-yariyariya`, `c-hava`, `c-kayma`, `t-top` (top uçuşu ve sekme), `d-duran` (korner ve serbest vuruş ızgarası), `p-tip` (aynı sahne, farklı profil).
6. **Film şeridi koşulları.** `an-yakala.py`'ye 1v1, kayma, hava düellosu, korner, serbest vuruş, oyun kurma anları.
7. "Top gövdeden geçti" sayısının MM1 sonrası 5,5'ten 7,4'e çıkış nedenini bul.

### T1 — İnsan gibi hareket

**Amaç.** Oyuncular çoğu zaman yürüsün ya da beklesin; gerektiğinde kısa ve net patlamalar yapsın; ivmeler yumuşak başlasın ve bitsin.

**Yapılacaklar**
1. **Efor alanı.** `varlik` içine `efor` (0–1), `kip`, `dusunT`, `_hdfX`, `_hdfZ` baştan eklenir. Hedef yazan her yer eforu da yazar: kovalama, pres, markaj, derin koşu, vuruş hazırlığı 1; karşı pres 0,9; destek 0,6; bölge 0,25–0,5 (hedefe uzaklık ve tehlikeye göre); duran top yerleşimi 0,4.
2. **Denetleyici.** `moveP` içinde izin verilen ivme `lerp(a_rahat, a_azami(v), efor^1,5)`; `a_rahat` ≈ 2,5 m/sn² (fren 3). Ayrıca ivme vektörü kare başına en çok `J·dt` değişir (J ≈ 25–40 m/sn³, efor 1'de 80). Hız eğrisi çan biçimli olur (insan hareketinin en az sarsıntı modeli).
3. **Hız kipleri.** dur 0, yürü 1,6, tırıs 3,2, koş 5,0, hızlı 6,5, depar tepe hız. Kip hedefe uzaklık, efor ve kalan süreden seçilir; depar ve duruş dışında en az 0,8 sn sürer.
4. **Kararlı hedef.** Bölge hedefi oyuncunun düşünme anında güncellenir (0,3–0,6 sn; oyuncuya göre kaydırılmış: `(kare + n·7 + team·3) % periyot`). Yeni hedef eskisine `clamp(1 + 0,08·topaUzaklık, 1, 4)` metreden yakınsa eski hedef kalır. Topa 12 m'den yakın ya da eforu 0,8 üstü görevde her kare güncellenir.
5. **Kişisel tepki.** `_topGecmis`'teki tek gecikme yerine oyuncu başına tepki süresi (0,25–0,7 sn; karar, sezgi, yorgunluk). Blok dalga gibi kayar.
6. **İvme–hız profili.** `a(v) = A0·(1 − v/S0)`; A0 = 6,0–7,8 (çabukluk), S0 = 8,6–10,0 (hız). `HRK_KT` tablosu kapalı biçimle değişir: τ = S0/A0, yol(t) = S0·(t − τ·(1 − e^(−t/τ))). `varisZamani` azami eforu modellemeyi sürdürür; `c-hareket` senaryosu efor 1 ile koşar ve geçmelidir.
7. **İvme tipleri.** Boy, yapı ve çeviklikten patlayıcı / dengeli / uzun adımlı: patlayıcıda A0 yüksek ve S0 düşük, uzun adımlıda tersi.
8. **Dönüş.** Yerinde dönüş 5,5–8 rad/sn (çeviklik).
9. **Dinlenme.** Top 30 m'den uzak ve tehdit yokken oyuncu yürür, yüzü topa dönüktür.
10. **Çalışkanlık (geçici).** Dayanıklılık ve rolden efor çarpanı; T3'te profilden gelir.

**Kabul**
- Top oyundayken durma + yürüme en az %40; depar en çok %3.
- Topa 25 m'den uzak oyuncuda 4 m/sn üstü süre en çok %25.
- "16+ oyuncu koşuyor" anları en çok %25.
- 3 m/sn² üstü ivmelenme oyuncu başına dakikada en çok 5.
- Top oyundayken ortalama hız 140–180 m/dk (bugün 257).
- Varış süresi senaryosu geçer; hedef tablo yeniden dengelenmiş olarak korunur.

**Risk.** Savunma daha geç kapanır; gol, şut ve pas isabeti artar. Yorgunluk katsayıları yeniden ayarlanır.

**Çizim.** `kip` sözleşmeye eklenir; yürürken ve beklerken boşta pozlar (eller belde, ağırlık değiştirme).

### T2 — Topla oyun: tempo, taşıma, devam değeri

**Amaç.** Oyuncu topu alınca bakabilsin, taşıyabilsin, bekleyebilsin; pas en ilerideki adama değil devamı olan adama gitsin.

**Yapılacaklar**
1. **Baskı süresi.** Saf `baskiSuresi(m,p)`: en yakın rakibin topa varış süresi (`varisZamani`). Taşıma, bekleme ve dönme kararlarının ortak girdisi.
2. **Taşıma seçeneği.** Bugünkü 5 yön yerine 8 yön × 2 mesafe (5 ve 10 m). Başarı olasılığı, rakiplerin taşıma yoluna varış süresi ile taşıyıcınınki arasındaki farktan (pas analizindeki sigmoid); boş alanda 0,97 üstü. Değer = yeni yerin devam değeri − kayıp.
3. **Devam değeri.** Saf `devamDegeri(m,q,x,z,t)`: oyuncu (x,z)'ye t anında vardığında elinde olacak en iyi seçeneğin ucuz tahmini: şutun xG'si, ön puanı en iyi üç pas (`pasAdayiEkle` U0), önündeki boş taşıma alanı; o andaki baskıyla azalır. Sırtı dönük ve iki rakip arasındaki alıcıda düşük, yüzü oyuna dönük ve önü açık alıcıda yüksek. `pasDegeri` içinde `xT(hedef)` ile karışır. Yalnız tam analize giren ~10 aday için hesaplanır.
4. **Sabır eşiği.** En iyi pas, taşıma ya da beklemeyi `0,1–0,6 puan` aşmıyorsa oyuncu taşır ya da bekler. Eşik takımın `sakin` ve `tempo` ayarından ve oyuncu eğiliminden gelir.
5. **Bekle / koru.** Değer = 0,5–1,0 sn içinde açılacak seçeneğin beklenen değeri (koşusu süren arkadaş, bindiren bek) − baskı süresine göre kayıp riski.
6. **Dönme.** Sırtı dönük alan oyuncu için rakip mesafesine bağlı "dön" seçeneği.
7. **Kalibrasyon.** T0'daki tabloya göre `pasAnaliz` düzeltilir; "hedef forvete uzun top"ta tamamlanma ile ikinci top olasılığı ayrı terimler olur.
8. **Yeniden ayar.** `hedefDeger`, `ilerleme`; uzun top takım `direkt` ayarı yüksekse ve devam değeri destekliyorsa.
9. **Karar ritmi.** Tek seferlik 0,3–0,62 sn zamanlayıcı yerine düşünme anları (5–8 Hz) ve olaylar (rakip hamle yaptı, koşu başladı).

**Kabul**
- Top ayakta süre ortancası 1,2–2,0 sn; 1 sn'den kısa olanların payı en çok %45.
- 5 m'den uzun taşıma %25–35.
- Rahatken (rakip 6 m'den uzak) taşıma seçimi %30–45.
- Sahiplik başına tamamlanan pas 2,5–4; pas yapılamadan biten sahiplik en çok %25; 10+ paslı sahiplik en az %3.
- Forvete giden pas payı en çok %30; kanada en az %15; ortalama pas boyu 16–20 m.
- PPDA 7–12.
- Ceza sahası içinden şut payı en az %55; ortanca şut mesafesi 14–16 m.

**Risk.** Şut sayısı düşebilir; T7 pozisyon üretimini artırır. Pas isabeti hedef tablonun üst sınırını (%80) aşabilir; tablo gözden geçirilir (§7).

### T3 — Oyuncu profili: alt özellikler, roller, eğilimler

**Amaç.** Aynı durumda farklı oyuncular farklı şeyler denesin.

**Yapılacaklar**
1. Yeni dosya `js/mac-profil.js` (yalnız veri ve saf işlev; motor çekirdeğinden önce yüklenir; `index.html` sırası ve `ad-denetimi.js`).
2. **Alt özellikler** (Ek A): mevcut 11 özellik, boy, yapı ve ayaktan türetilir; oyuncunun adının özetinden (FNV) ±0,08 kişisel sapma eklenir. Kadro verisi değişmez.
3. **Rol** (Ek B): mevki başına 3–4 rol; profile en uygun olan seçilir (ileride hoca seçer, Aşama 3.3).
4. **Eğilimler** (Ek B): −1…+1 ağırlıklar; özelliklerden türetilir, kadro kaydındaki isteğe bağlı `egilimler` ile ezilebilir.
5. **Tutarlılık ve gün formu.** Maç başında tohumdan oyuncu başına küçük bir form çarpanı. Kariyerden gelecek moral ve form (Aşama 3) aynı kapıyı kullanır: `p.form`.
6. Kullanım yerleri: T1 çalışkanlık, T2 sabır ve risk, T4 hareket listesi, T7 topsuz rol, T8 duran top görevi, T10 disiplin.

**Kabul**
- Sürüş ↔ çalım ve taşıma r ≥ 0,6; müdahale özelliği ↔ müdahale sayısı (aynı hatta) r ≥ 0,4; sertlik ↔ faul r ≥ 0,4.
- Forvet dışı oyuncuların şut payı en az %30.
- `p-tip` senaryosu: aynı sahnede hızlı kanat ile oyun kurucu kanadın seçim dağılımı belirgin farklı.

### T4 — Bire bir: hareket kütüphanesi, savunma, top saklama

**Yapılacaklar**
1. Saf `birebirTahmin(m,p,o,yon)` ([js/mac-hareket.js](js/mac-hareket.js)): geçme ve kayıp olasılığı. Girdiler: bağıl hız, savunmacının hız yönü, yan boşluk, ikinci savunmacının varış süresi, profil. Katsayılar `c-1v1` benzetimine oturtulur.
2. "Rakibi geç" kararı (`surus.cal` ve taraf yazılır); değeri o savunmacı aşıldıktan sonraki devam değeridir.
3. **Hareket tablosu** (Ek C): her satırda ön koşul (profil), uygun durum, hazırlık süresi, gövde kayması, topun itileceği açı ve hız, yanıltma gücü, hata riski, animasyon adı. Seçim duruma göredir; rastgele değildir.
4. **Savunmacı.** Çalımı yutma olasılığı karar ve sezgiye, çalımın yanıltma gücüne bağlı. Arkasında destek varsa erken girer, yoksa geciktirir. Rakibi zayıf ayağına ya da çizgiye yönlendirir. Sırtı dönük rakibe girmez; dönüşü kapatır.
5. **Top saklama.** Gövde rakiple top arasında; hedef forvet tutup indirir; arkadan gelen temas "adama önce" sayılır (mevcut `kalkan` mantığı).

**Kabul.** `c-1v1` başarı %30–65 ve beceri farkıyla düzgün artar; maçta çalım 10–14, başarı %40–50; koruma 15–40 oyuncu·sn; kanat oyuncuları çalımın en az %40'ını yapar.

### T5 — Temas fiziği: müdahale, yarı yarıya top, faul, top–beden

**Yapılacaklar**
1. Saf `mudahaleTahmin(p,s,tur)`: topa ve adama önce değme olasılığı. Türler: önden blok, yandan dürtme, toparlanma müdahalesi, kayarak müdahale, şut / orta / pas hattına kayarak blok.
2. `ikiliMucadele` iki ayağın varış zamanı farkıyla çözülür; aynı ana yakın varışta top sıkışır ve seker; geç kalan adama basarsa faul.
3. `sirtFaulu`, `havaFaulu` ve yarı yarıyadaki çekilişler kalkar. Faul temasın yönü ve bağıl hızından doğar; tek çekiliş hakemin görmesidir (mesafe, açı, araya giren oyuncu).
4. Sarı kartlı oyuncu ve ceza sahasındaki savunmacı riski tartar.
5. **Top–beden süpürme testi.** Topun bu adımdaki yolu (önceki → şimdiki yer) ile beden kapsülü arasındaki en kısa uzaklık (kalecideki `kaleciSegD` örneği). Hızlı top gövdeden geçmez.
6. Kayma temiz olsa da sürücü takılıp düşebilir.
7. İsteğe bağlı: elle oynama. Top bedene çarptığında kolun açık olduğu pozlarda (blok, sıçrama, kayma) küçük olasılık; hakem takdiri.

**Kabul.** "İtme" payı faullerin %40'ının altında; toplam faul 8–14; kırmızı en çok 0,2; top gövdeden geçti en çok 1; kayma kaynaklı faulsüz düşüş sıfırdan büyük.

### T6 — Hava topu

**Yapılacaklar.** Top inmeden yer kapma (gövde çarpışmasıyla); koşarak sıçrama durarak sıçramadan yüksek; zamanlama hatası sezgiden; kafanın kalitesi temas yüksekliğinden (alın, tepe, ıska); itme faulü geç sıçrayıp havadaki rakibe çarpmaktan.

**Kabul.** `c-hava`: uzun ve iyi kafa vuran %60–75 kazanır; koşarak sıçramanın üstünlüğü ölçülür.

### T7 — Takım zekâsı

**Yapılacaklar**
1. **Takım niyeti.** Durumlar: `kur`, `ilerlet`, `sonBolge`, `kontra`, `tut`. Kontra koşulu: top kazanıldı ve topun önündeki rakip sayısı bizim hücumcu + 1'den az. Her niyet genişliği, derinliği, riski, tempoyu ve kimin çıkacağını belirler. Yeni dosya `js/mac-takim.js` önerilir.
2. **Oyun kurma dizilişi.** Stoperler ceza sahası genişliğine açılır, altı numara aralarına ya da önlerine gelir, bekler yükselir. Rakibin basan oyuncu sayısına göre +1 üstünlük (kaleci dahil); sağlanamıyorsa uzun.
3. **Alan sahipliği.** Saha beş dikey koridora ayrılır (kanat, yarı alan, merkez, yarı alan, kanat). Her koridorda en az bir hücumcu; aynı koridor ve hatta iki kişi olmaz; biri girerse öbürü boşaltır.
4. **Kalıplar** (tetik + roller): üçüncü adam, bindirme ve içten bindirme, bir kanada yüklenip öbürüne çevirme, çizgiye inip geri çevirme, içe kat edip şut ya da ara pası, hedef forvete indirip yerden devam, kontrada üç şerit.
5. **Topsuz koşular.** Derin koşu, `araNoktasi` bir nokta bulduğunda ve pasörün başı yukarıdayken başlar. Türler: arkaya, stoper–bek arasına, ayağa gelme, ön ve arka direk, ceza sahasına geç koşu, aldatma koşusu. Biri gelirse öteki gider. Eşleştirme `markajAta` gibi tekildir.
6. **Şut açısı arama.** Şut bölgesindeki oyuncu, tek dokunuşla güçlü ayağına açınca gol olasılığı artıyor mu diye bakar (T2 taşıma + `sutPlani`).
7. **Geride kalanlar.** Hücumda geride rakip forvet + 1 oyuncu; en hızlı ve pozisyon alması en iyi olanlar; merkez kapalı durur.
8. **Savunma.** Blok yüksekliği taktikten; pres tetikleyicileri (kötü ilk dokunuş, geri pas, sırtı dönük alıcı, çizgiye sıkışma); pres yapan en tehlikeli pas yolunu arkasında bırakır; kademe; koşucu takibi ve devri; ofsayt çizgisi (top üstünde baskı varsa çık, yoksa düş); ortada ön direk, altıpas önü, arka direk ve penaltı noktası sahipliği; kaleci çıkınca çizgiye inen savunmacı.
9. **Maç durumu.** Skor farkı × kalan süre × kırmızı kart → niyet ağırlıkları. Gerideyken son 10 dakika: stoper forvete, daha direkt oyun. Öndeyken: topu tutma, duran topta acele etmeme, taktik faul.
10. **Hoca kapısı.** `taktikDegistir(takim, yeni)` olayı ve değişiklik mantığı (yorgunluk, kart, skor, sakatlık). Kararın kendisi Aşama 3.3'tedir; motor yalnız kapıyı sağlar.

**Kabul.** Stoper + merkez orta sahanın pas payı en az %45; kanat değiştirme başarısı; hızlı hücumdan şut payı; gerideki takımın son 15 dakikadaki şut payı en az %60; savunmada takım boyu 25–32 m; ofsayt 0,3–2.

### T8 — Duran toplar

Yeni dosya `js/mac-durantop.js` önerilir; rutinler tablodan okunur (Ek D). `js/mac-kurallar.js` bugün "donmuş çekirdek"tir; açılması gerekir.

**Yapılacaklar**
1. **Görev dağıtımı profilden.** Kullanan (duran top, orta, uzaktan şut, ayak: içe ya da dışa dönen top); hedefler (kafa, sıçrama, boy); perdeciler (güç); ikinci top (uzaktan şut); geride kalanlar (hız, pozisyon alma); kısa seçenek (teknik).
2. **Sayılar duruma bağlı.** Çıkan sayısı 4–7: taban 5, skor ve dakikayla artar, rakibin ileride bıraktığı oyuncuyla azalır. Son dakikada gerideyse kaleci de çıkar.
3. **Korner savunması.** Karma düzen (3–4 bölge + adam), isteğe bağlı direkte adam, kısa kornere çıkan, kontra için 1–2 hızlı oyuncu ileride.
4. **Baraj.** Kişi sayısı mesafe, açı (kale ağzının görünen genişliği) ve vuranın yeteneğinden. Baraj yakın direği kapatır, kaleci uzak direktedir. Baraj zıplar; altından vuruş seçeneği doğar.
5. **Doğrudan vuruş modeli.** `sutBlokOlasiligi` barajı gerçek geometriyle (yükseklik, zıplama, topun barajı aştığı yükseklik) hesaba katar.
6. **Kenardan ve uzaktan serbest vuruş.** Kafası iyi stoperler çıkar, savunan takım çizgi kurar, yaya ikinci top için adam konur.
7. **Hazırlık süresi.** Tehlikeli duran toplarda 6–7 sn yerine 10–14 sn; kullanım koşulu "görevliler yerinde ya da azami süre".
8. **Taç.** Uzun taç (profil), hızlı taç, gel-git hareketi.
9. **Kale vuruşu.** Kısa oyun kurma düzeni; rakip basıyorsa uzun.
10. **Çabuk kullanılan serbest vuruş.** Rakip dizilmeden; karar özelliği yüksek oyuncuda.
11. **Penaltı.** Ribaund için yaydan koşu.

**Kabul.** Korner başına gol %3–5; barajlı serbest vuruşta doğrudan şut başına gol %6–10; kenar serbest vuruşunda ceza sahasındaki hücumcu 4–6; kornerde geride kalanların hız özelliği takım ortalamasının üstünde; duran top gollerinin payı %25–35.

### T9 — Top fiziği ve vuruş modeli

**Top** (`topFizikAdim`, [js/mac-motoru.js:67](js/mac-motoru.js))
1. **Hıza bağlı sürükleme.** Yavaş topta yüksek (katsayı ≈ 0,025 /m), hızlı topta düşük (≈ 0,012 /m); geçiş 12–15 m/sn çevresinde yumuşak. Aşırtma ve asılan ortalar uçuşun sonunda "ölür".
2. **Dönüş vektörü.** Üç bileşenli açısal hız; Magnus ivmesi dönüş oranına bağlı ve doyar. Mevcut `egri` ve `ust` alanları bu vektörden türetilen okunur alanlar olarak kalır (çizim sözleşmesi bozulmaz).
3. **Sekme.** Dik yönde geri sekme çarpma hızıyla azalır (0,45–0,65). Yatay yönde sürtünme itkisi: top kayıyorsa hız kaybeder ve dönüşü değişir. Yan dönüşlü top sekince yön değiştirir.
4. **Yerde.** Sert vurulan top önce kayar, sonra yuvarlanır. Yuvarlanma yavaşlaması zemin tarifinden; bulunan saha ölçütü 0,45–1,5 m/sn² (kaynak doğrulanmalı), bugünkü aralık 1,2–2,1.
5. **Koşullar.** `secenek.kosullar = {zemin, islak, ruzgar}`: ıslak zeminde ilk sekmede uzun kayma; rüzgârda bağıl hız üzerinden sürükleme.
6. `yerHiz`, `yerIlkHiz`, `yerSure` yuvarlanma evresi için geçerli kalır; `havadanCoz` zaten sayısaldır.

**Vuruş**
1. **Güç seçimi.** Şut hızı = oyuncunun tavanı (24–33 m/sn) × seçilen güç (0,6–1,0).
2. **Hız–isabet ödünleşimi.** Yön hatası güçle büyür: `σ = σ0·(1 + c·güç²)`.
3. **Hazırlık kalitesi.** Hizalanma (var), topun hareketi, acele (baskı süresi hazırlık süresinden kısaysa hata artar), zayıf ayak kalitesi (profil).
4. **Hata kuyruğu.** Küçük olasılıkla büyük hata: topun altına girme, üstüne vurma, ayağın kenarından kaçma, ıska. Olasılık teknik, baskı, yorgunluk, zemin ve top yüksekliğinden. Olay `kotuVurus {tur}`.

**Kabul.** `t-top` senaryosu: 25 m'den falsolu vuruşta 2–4 m yan sapma; 2 m'den bırakılan topun iyi zeminde sekme yüksekliği 0,6–0,8 m; 15 m/sn'lik yerden pasın durma mesafesi zemine göre. Maçta ortalama şut hızı 23–27 m/sn.

### T10 — Maç olayları ve hakem

1. **Sakatlık (yol haritasındaki MM5).** Temaslı: T5'teki temas şiddetinden. Temassız: depar × yorgunluk × yatkınlık. Dereceler: ağrı (yerde kalır, kalkar); tedavi (oyun durur, oyuncu kenara çıkar, takım kısa süre eksik oynar); devam edemez (değişiklik; hak yoksa eksik). Olay `sakatlik {p, tur, derece}` kariyere süre olarak gider.
2. **Hakem kişiliği.** Kart eşiği, avantaj eğilimi, görüş (mesafe, açı, perde); maç tarifinden.
3. **Kural olayları.** İtirazdan sarı, zaman geçirme, hakem topu, bayrağı geç kalkan ofsayt (gol iptali), gol yiyen takımın topu ağdan alıp santraya koşması.
4. **Moral.** Gol ya da hata sonrası kısa süreli güven değişimi (soğukkanlılık çarpanı); seyirci baskısı girdisi (`kosullar.atmosfer`) hakem görüşüne ve rakibin soğukkanlılığına.
5. **Kenar.** Yedeklerin ısınması, hocanın tepkileri, sağlık görevlisi.
6. **Kupa kapısı.** Uzatma ve penaltı atışları (Aşama 9).

### T11 — Adım evresi (isteğe bağlı, en son)

Motor adım evresini ve basan ayağı bilir (`p.adimFaz`, `p.basanAyak`); dokunuş ve vuruş oynayan ayak serbestken olur; ters ayaktaki topa vuruş için ayak ayarı süresi doğar; animasyon aynı evreyi okur. Kazancı çoğunlukla dürbünde görünür.

### Animasyon (her turda, E akışı)

Mevcut iskelet (11 kemik, bacak IK'sı, eylem yuvaları) yeterlidir. Eklenecekler: boşta pozlar ve yürüyüş (T1); taşıma ve bakınma (T2); çalım hareketlerinin ayak yolları (IK hedefi topun çevresinde; makas, çekme, içe kesme) ve yutan savunmacının yanlış yöne adımı (T4); önden blok, şut bloğuna atlama, takılıp düşme (T5); yer kapma ve havada çarpışma (T6); jestler: pas isteme, ofsayt için el kaldırma, işaret, kaçan golde başını tutma (T7); baraj, zıplama, perdeleme (T8); kötü vuruş (T9); sakatlık, tedavi, topallama (T10).

---

## 5. Sıra, bağımlılık ve büyüklük

| Tur | Bağımlı olduğu | Büyüklük | Uzaktan görünür kazanç |
|---|---|---|---|
| T0 Ölçü | — | küçük | — |
| T1 Hareket | T0 | büyük | çok yüksek |
| T2 Topla oyun | T0, T1 | büyük | çok yüksek |
| T3 Profil | T0 | orta | yüksek |
| T4 Bire bir | T2, T3 | büyük | yüksek |
| T5 Temas | T4 | büyük | orta–yüksek |
| T6 Hava topu | T5 | orta | orta |
| T7 Takım zekâsı | T2, T3 | büyük | çok yüksek |
| T8 Duran toplar | T3 | orta | yüksek |
| T9 Top ve vuruş | T0 | orta | orta |
| T10 Olaylar | T5 | orta | yüksek (seyrek) |
| T11 Adım evresi | T4 | orta | düşük |

Önerilen sıra: T0 → T1 → T2 → T3 → T4 → T5 → T7 → T8 → T6 → T9 → T10 → T11. İlk dört tur temeldir; sonrası kullanıcının önceliğine göre yer değiştirebilir. T8 ve T9 diğerlerinden bağımsızdır; ayrı oturumda paralel yürüyebilir.

---

## 6. Uygulayıcı için kurallar

- Rastlantı yalnız `this.rast`; `…Tahmin` ve `…Degeri` işlevleri saf.
- Oyuncuya yeni alan `varlik` içinde baştan tanımlanır; yeni ayar `ayarEkle` ile; yeni dosya `index.html` sırasına ve `ad-denetimi.js`'e uygun eklenir. Blok içinde `function` bildirimi kullanılmaz.
- Kişisel sapma ve düşünme anı kaydırması tohumdan ve oyuncu sırasından türetilir.
- Rastlantı çekiliş sırası değişen turda `--ayni` kullanılmaz; `--karsilastir` istatistikle bakılır.
- Mekanik senaryoda doğrulanmadan `MOTOR_AYAR` düğmeleriyle denge aranmaz.
- Süre bütçesi: bu makinede 1000 adım 202 ms; tur başına artış %25'i geçmez. Düşünme anları (T1) yükü azaltır.
- Motor çizime yalnız alan ekler; her yeni alanın çizimde yedek davranışı olur.
- Bir tur bitmeden ötekine geçilmez.

---

## 7. Kullanıcının karar vermesi gerekenler

1. **Maçın temposu.** Daha az, daha uzun ve amaçlı atak (öneri) mı, bugünkü sık top kaybı mı? Hedef tabloyu etkiler: pas isabeti üst sınırı (%80), top kaybı sayısı.
2. **Yürüme oranı hedefi.** Önerilen ara hedef %40; gerçek %61.
3. **Özellik listesi.** Alt özellikler türetilsin (öneri) mi, kadro verisine yeni özellik eklensin mi?
4. **Çekirdek dosyaların açılması ve yeni dosyalar.** `mac-dizilis.js`, `mac-kurallar.js`, `mac-motoru.js` (top fiziği); yeni `mac-profil.js`, `mac-takim.js`, `mac-durantop.js`.
5. **Duran top süresi.** Tehlikeli duran toplarda hazırlığın 10–14 saniyeye uzaması.
6. **Sakatlık sıklığı ve değişiklik hakkı.** Gerçekte maç başına yaklaşık bir süre kayıplı sakatlık olur. Motor bugün 5 değişikliğe izin veriyor ([js/mac-kurallar.js:26](js/mac-kurallar.js)); dönem kuralı kararı.
7. **Kurtarış oranı (~%50).** Bu turlarla düzelmez; şut hedefinin yeniden ele alınmasını gerektirir.
8. **Hava koşulları ve görünümü.** Yağmur ve rüzgâr maçta gösterilecek mi?

---

## Ek A — Alt özelliklerin türetilmesi (başlangıç önerisi)

Hepsi 0–1; `kütle` boy ve yapıdan (mevcut `kutle`), 0–1'e ölçeklenir. Her birine ad özetinden ±0,08 sapma eklenir.

| Alt özellik | Türetme |
|---|---|
| çabukluk | 0,55·hız + 0,25·(1 − kütle) + 0,20·sürüş |
| çeviklik | 0,50·sürüş + 0,30·hız + 0,20·(1 − kütle) (mevcut `hrkCeviklik`) |
| güç | 0,50·sertlik + 0,50·kütle |
| denge | 0,40·güç + 0,30·çeviklik + 0,30·sertlik |
| sıçrama | 0,60·kafa + 0,20·hız + 0,20·güç |
| ilk dokunuş | 0,55·sürüş + 0,45·pas |
| soğukkanlılık | 0,60·karar + 0,40·(forvette şut, diğerlerinde pas) |
| sezgi | 0,50·karar + 0,50·görüş |
| pozisyon alma | 0,50·müdahale + 0,50·karar |
| topsuz hareket | 0,40·görüş + 0,30·karar + 0,30·hız |
| yaratıcılık | 0,50·görüş + 0,30·sürüş + 0,20·pas |
| çalışkanlık | 0,60·dayanıklılık + 0,20·sertlik + 0,20·karar |
| agresiflik | 0,70·sertlik + 0,30·(1 − karar) |
| zayıf ayak | 0,35 + 0,40·ilk dokunuş (iki ayaklıda 1) |
| duran top | 0,50·pas + 0,30·şut + 0,20·görüş |
| orta | 0,60·pas + 0,20·sürüş + 0,20·görüş |
| şut gücü | 0,60·şut + 0,40·güç |
| tutarlılık | 0,50 + 0,40·karar |

## Ek B — Roller ve eğilimler

**Roller** (profil uyumuyla seçilir)

| Mevki | Rol | Topsuz | Topla |
|---|---|---|---|
| Kaleci | çizgi kalecisi / süpürücü | çizgide / savunma arkasını toplar | uzun / kısa oyun kurar |
| Stoper | sert stoper | öne çıkıp keser | basit oynar, uzaklaştırır |
| Stoper | oyun kuran stoper | çizgiyi tutar | topu taşır, hat kıran pas |
| Bek | savunmacı bek | geride kalır | güvenli pas |
| Bek | bindiren bek | kanattan çıkar | orta, çizgiye iner |
| Orta saha | kesici | savunmanın önünde | basit pas, taktik faul |
| Orta saha | oyun kurucu | derine gelir | yön değiştirir, ara pası |
| Orta saha | iki yönlü | ceza sahasına geç girer | şut, ver-kaç |
| Kanat | çizgi kanadı | kenarda genişlik | topu atıp koşar, orta |
| Kanat | içe kat eden | yarı alana girer | güçlü ayağına alıp şut |
| Kanat | oyun kuran kanat | içe gelir, top ister | ara pası |
| Forvet | hedef forvet | stoperlerin arasında | sırtı dönük alır, indirir, kafa |
| Forvet | fırsatçı | ofsayt çizgisinde | tek vuruş, arkaya koşu |
| Forvet | derine gelen | orta sahaya iner | bağlantı, ara pası |

**Eğilimler** (−1…+1): topu atıp koşar, içe kat eder, çizgiye iner, topu fazla tutar, tek vuruş oynar, öldürücü pas dener, oyunun yönünü değiştirir, uzaktan vurur, plase vurur, kaleciyi aşırtır, sırtı dönük oynar, kanallara koşar, ceza sahasına geç girer, derine gelir, kayarak girer ↔ ayakta kalır, sıkı markaj yapar, tehlikeden oynayarak çıkar ↔ uzaklaştırır, zayıf ayağından kaçınır, hakeme itiraz eder.

## Ek C — Hareket kütüphanesi

| Hareket | Ön koşul | Uygun durum | Mekanik |
|---|---|---|---|
| Topu at, koş | çabukluk ya da hız yüksek | önünde alan var, savunmacı duruyor | top 6–10 m öne; yarış `varisZamani` ile |
| Sağından at, solundan geç | hız ve çeviklik | savunmacı üstüne geliyor | top bir yandan, oyuncu öbür yandan |
| Hız değiştirme | herkes | yan yana koşu | yavaşla, patla (bugün var) |
| Dur-kalk | çabukluk | savunmacı aynı hızda | tam fren, yeniden depar |
| Gövde çalımı | sürüş orta üstü | savunmacı bekliyor | dokunmadan yana yüklenme (bugün var) |
| Makas | sürüş yüksek | karşı karşıya, düşük tempo | ayak topun üstünden döner; yanıltma gücü yüksek |
| İçe / dışa kesme | çeviklik | savunmacı tek yana yüklü | keskin yön değişimi, kısa itme |
| Şut çalımı | şut pozisyonu | savunmacı bloğa atlıyor | vuruş hazırlığı iptal, yana dokunuş |
| Topu çekme | ilk dokunuş | çizgide, sıkışmış | tabanla geri çekme, dönüş |
| Sırtla dönme | güç ya da çeviklik | sırtı dönük, rakip dibinde | rakibin yüklendiği yanın tersine |
| Rulet | sürüş çok yüksek | dar alan | 360° dönüş; hata riski yüksek |
| Bacak arası | sürüş çok yüksek | savunmacının bacakları açık | seyrek |
| Şapka | sürüş çok yüksek | seken top | seyrek |

## Ek D — Duran top rutinleri

| Durum | Hücum | Savunma |
|---|---|---|
| Korner | ön direğe sert + uzatma; arka direğe asma; penaltı noktasına; kısa korner; yaya geri pas; perdeleme ve aldatma koşusu; içe ya da dışa dönen top | karma düzen; isteğe bağlı direkte adam; kısa kornere çıkan; ileride 1–2 hızlı oyuncu |
| Tehlikeli serbest vuruş | barajın üstünden falso; kaleci köşesine sert; barajın altından; kısa pas–şut; topun başında iki kişi | baraj 2–5 (mesafe, açı, vuran); zıplama; kaleci uzak direkte |
| Kenardan serbest vuruş | içe dönen orta; arka direğe; stoperler ceza sahasında; yayda ikinci top | ceza sahası çizgisinde hat; adam paylaşımı |
| Uzak serbest vuruş | uzun top hedef forvete; ya da kısa | blok yerini alır |
| Taç | hızlı; çizgi boyunca; gel-git; uzun taç | atanın önü ve yakın alıcı kapatılır |
| Kale vuruşu | kısa (stoperler açık); uzun (hedef forvet) | pres ya da orta blok |
| Penaltı | atıcı duran top ve soğukkanlılıktan; yaydan ribaund koşusu | kaleci ipucunu okur (bugün var) |
| Santra | geri pas + düzen; gerideyken hızlı | — |

## Ek E — Gerçek değerler (başvuru)

| Konu | Değer |
|---|---|
| Maçta süre dağılımı | durma %19,5, yürüme %41,8, tırıs %16,7, koşu %16,8, depar %1,4 |
| İvme–hız profili (profesyonel erkek) | 1. lig: A0 7,37, S0 9,61, en yüksek ivme 5,94, en yüksek hız 8,91; 2. lig: 7,12 / 9,46 / 5,68 / 8,75 (m/sn², m/sn) |
| İvmelenme sıklığı | ≥2 m/sn²: maç başına ~423, ortalama 14 sn'de bir (üst düzey kadın futbolu); yavaşlamalar ivmelenmelerden sık |
| Top ayakta | oyuncu başına 90 dakikada toplam ~1 dk 49 sn, en çok ~50 dokunuş |
| Sahiplik zinciri | ortalama 9,5–9,6 sn; takıma göre 2,9–5,1 pas |
| PPDA | beş büyük lig ortalaması ~11 |
| Şut | %68'i ceza sahası içinden; takıma göre ortalama 13,6–16,1 m |
| Duran top golleri | %20–30 |
| Korner | %1,6–4,1'i gol; %20,5 kısa, %36 içe, %43 dışa dönen |
| Doğrudan serbest vuruş | ~%6 gol (uzmanlarda ~%13) |
| Baraj | 2–5 kişi; ~32 m ötesinde 0–1 |
| Vuruş hızı | iç ayak ~21 m/sn; azami içüstü 28–30 m/sn; aralık 18–35 |
| Top | sürükleme düşüşü Reynolds 2,2–3,0×10⁵ (yaklaşık 15–22 m/sn; yeni toplarda daha düşük); hızlı topta katsayı ≈ 0,22 |
| Etrafa bakma | iyi oyuncuda saniyede 0,4–0,6 bakış; çok bakanlar %17 daha çok pas tamamlar |
| Skor etkisi | gerideki takım daha çok şut atar ve topa daha çok sahip olur; öndeki geri çekilir |
| Sakatlık | 1000 maç saatinde 25–30 (maç başına yaklaşık bir) |

## Ek F — Robotluk karnesi: ölçüm tanımları

Hepsi top oyundayken (`phase==='play'`), saha oyuncuları için; rastlantı çekmez, önbellek yazan motor yöntemlerini çağırmaz. Uygulama: `araclar/olcumler/r-karne.js` (takım ve maç düzeyi; `mac-deneme.js` ile) ve `araclar/oyuncu-karnesi.js` (karar izi, oyuncu tablosu, yetenek–davranış ilişkisi). Eklenti eklendikten sonra 8 tohumda `--karsilastir --ayni` 8/8 aynı: ölçüm motor sonucunu değiştirmez.

- **Hız bölgeleri:** süre payı; <0,2 dur, <2 yürü, <4 tırıs, <5,5 koş, <7 hızlı, ≥7 depar. Ayrıca topa uzaklığa göre (<10, 10–25, >25 m) ve mevkiye göre.
- **Eşzamanlı koşu:** 0,5 sn'de bir, 2 m/sn üstündeki saha oyuncusu sayısı.
- **İvmelenme:** 0,2 sn pencerede hız büyüklüğü değişimi; 3 m/sn² üstüne çıkış sayısı (1 sn dinlenme aralığıyla), oyuncu başına dakikada. Kilitli eylemler hariç.
- **Top ayakta süre:** oyuncunun `ball.sahip` olduğu andan `pass` ya da `shot` olayına kadar.
- **Taşıma:** bir oyuncunun kesintisiz sahiplik dönemi; süre, katedilen yol, `sonDokunus.tur==='surus'` sayısı.
- **Sahiplik zinciri:** bir takımın oyuncusu `sahip` olduğunda başlar; öbür takım `sahip` olunca ya da oyun durunca biter. Süre, `ist.pasTamam` farkı, şutla bitme.
- **Top kaybı nedeni:** el değiştirme anından önceki olaylara göre: `steal` (1,5 sn) müdahale; `kotuKontrol` (2,5 sn); `header` (2,5 sn) hava topu; kaybeden takımın `pass` olayı (4 sn) kesilen pas; kalan diğer.
- **PPDA:** topu tutan takımın kendi kalesinden itibaren sahanın %60'ında yaptığı paslar ÷ rakibin aynı bölgedeki müdahale + faul + pas kesme sayısı.
- **Pas ağı:** `kararVer` çıktısında alıcının grubu (stoper, bek, merkez, kanat, forvet).
- **Şut yeri:** `shot` anında vuranın ceza sahasında olup olmadığı; `dist`; kafa şutu payı.
- **Gol kaynağı:** `goal` anında `sonKullanim` 10 sn içindeyse o duran top; değilse açık oyun; sahiplik kendi yarıda başlayıp 12 sn içinde gol olduysa hızlı hücum.
- **Duran top düzeni:** duruştan oyuna geçiş anında ceza sahasındaki hücumcu ve savunmacı sayısı, kendi yarısında kalan hücumcular ve hız ortalaması, `barajdakiler.length`, 1,6 sn içinde şut (doğrudan), 8 sn içinde şut ve gol.
- **Yetenek–davranış ilişkisi:** oyuncu başına süreye oranlanmış sayılar ile özellik arasında Pearson r.

---

## Kaynaklar

- Maçta hareket dağılımı: https://jssm.org/jssm-06-63.xml-Fulltext
- İvme–hız profili: https://jhk.termedia.pl/The-Acceleration-Speed-Profile-in-Professional-Soccer-Players-nA-Comparative-Study,220252,0,2.html
- İvmelenme ve yavaşlama sıklığı: https://lida.sport-iat.de/ta/Record/4044737?lng=en · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8471310/
- Yüksek tempolu koşu (Bradley 2009): https://sure.sunderland.ac.uk/3478
- Top ayakta süre: https://www.newsday.co.zw/thestandard/sport/article/200029590/on-the-ball-when-off-the-ball
- Sahiplik zincirleri: https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25 · https://www.premierleague.com/en/news/4426039/opta-analyst-on-long-balls-long-throws-key-tactical-trends-spotted-in-2025-26-season
- PPDA: https://statsbomb.com/?p=10118 · https://www.premierleague.com/en/news/4250153
- Şut verisi: https://theanalyst.com/articles/premier-league-2024-25-shot-data
- Duran top golleri: https://www.fantasyfootballscout.co.uk/2025/10/18/just-how-important-are-set-pieces-in-fpl
- Korner: https://eprints.chi.ac.uk/id/eprint/5013/ · https://www.ingentaconnect.com/content/uwic/ujpa/2013/00000013/00000001/art00012 · https://vu-9.eprints-hosting.org/40479/1/Kubayi-2020-Cornerkicks.pdf
- Serbest vuruş: https://blog.soccerment.com/?p=4905 · https://theanalyst.com/2025/03/free-kick-specialists-celebrating-an-endangered-species
- Baraj: https://keeperstop.com/goalkeeper_guidelines_for_setting_a_wall
- Duran top rutinleri: https://guidetofootball.com/tactics/set-piece-routines/
- Top aerodinamiği: https://www.physics.usyd.edu.au/~cross/TRAJECTORIES/Sports%20Balls.pdf · https://eprints.whiterose.ac.uk/98035
- Zemin ve top: https://digitalhub.fifa.com/m/58aa765dd3e85f26/original/FIFA-natural-pitch-rating-system_EN.pdf · https://www.isss-sportsurfacescience.org/downloads/documents/A7ZD60AH55_Gabrielsen_Ball_Roll.pdf.pdf
- Vuruş hızı: https://pmc.ncbi.nlm.nih.gov/articles/PMC4234773 · https://jssm.org/jssm-06-154.xml-abst
- Çalım araştırması: https://www.tsukuba.ac.jp/en/research-news/20260521110000.html
- Etrafa bakma: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.553813/pdf
- Skor etkisi: https://blogarchive.statsbomb.com/articles/soccer/score-effects/ · https://www.scitepress.org/Papers/2013/46787/
- Pres tetikleyicileri: https://learning.coachesvoice.com/cv/in-focus-high-press/ · https://voor.sport/en/mag/pressing-and-a-quick-guide-to-pressing-triggers
- Sakatlık: https://bjsm.bmj.com/content/45/7/553
- En az sarsıntı modeli: https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/MinimumJerkHypothesis.ipynb
- Güce bağlı hareket gürültüsü: https://www.doi.org/10.1038/29528
- Alan kontrolü ve sahiplik değeri: https://archive.trainingground.guru/articles/william-spearman-how-liverpool-create-pitch-control · https://www.sloansportsconference.com/research-papers/decomposing-the-immeasurable-sport-a-deep-learning-expected-possession-value-framework-for-soccer
- RoboCup HELIOS (eylem zinciri, diziliş): https://staff.fnwi.uva.nl/a.visser/activities/robocup/RoboCup2013/Symposium/TeamDescriptionPapers/SoccerSimulation/Soccer2D/TDP_HELIOS2013.pdf
- Football Manager eğilimleri ve gizli özellikler: https://www.passion4fm.com/football-manager-player-traits/ · https://www.passion4fm.com/football-manager-player-attributes/ · https://www.goal.com/en-gb/news/match-winning-tactics-positional-play-football-manager-2024/blt3a251acbf3d212e8
- EA FC roller ve oyun stilleri: https://www.ea.com/games/ea-sports-fc/fc-25/news/pitch-notes-fc-25-fc-iq-deep-dive · https://www.gamesradar.com/fc-24-playstyles-list · https://ggrecon.com/guides/fifa-23-accelerate-lengthy-controlled-explosive
- FIFA oynanış teknikleri: https://www.ea.com/games/fifa/news/fifa-19-pitch-notes-gameplay · https://www.ea.com/news/pitch-notes-fifa-23-gameplay-deep-dive · https://blog.playstation.com/?p=116374
- PES / eFootball: https://www.fifplay.com/efootball-2026-playing-styles/ · https://pesmastery.com/pes-playing-styles/ · https://www.mynewsdesk.com/uk/bastion-uk/pressreleases/new-efootball-gameplay-details-revealed-by-konami-at-gamescom-2021-3123618 · https://godisageek.com/?p=121204
- Olay türleri (StatsBomb): https://live-data-api-guide.statsbomb.com/api-reference/event-descriptions.html
