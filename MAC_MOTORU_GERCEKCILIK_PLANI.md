# Chairman — maç motoru gerçekçilik planı

**Durum (2026-10-07):** Motor odağı (kullanıcı kararı; YOL_HARITASI “Güncel karar özeti” 2026-10-07): kullanıcı “tamam” diyene kadar bütün geliştirme bu plandadır; motor kararlarını Claude verir ve görünür yazar. Sıra **M0 → T2 → T3 → T9a → T4 → T5 → T7 → T8 → T6 → T9b → T10 → T11**: M0 (araç ve hız) eklendi, T3 profil kapısına daraltıldı (kabiliyet ekonomisi ileride veritabanıyla), T9 top fiziği (T9a, öne alındı) ve vuruş (T9b) olarak bölündü (§4, §5). §7: 1–2 verilmişti; 3, 4, 5 ve 7 bu tarihte kesinleştirildi (§7'de yazılı); 6 ve 8 T10'da kullanıcıya sorulur. Kontrol üç kademedir (CLAUDE.md “Kontrol”). M0 aynı gün tamamlandı (aşağıda “M0 — Sonuç”); sıradaki T2, taban `araclar/taban/m0.json`.

**Durum (2026-10-04):** T0 ve T1 tamamlandı (ölçümler ve sınırlar YOL_HARITASI T0/T1). §7.2 kararı: yürüme hedefi en az %55 (ulaşılan %55,6). Sıradaki T2; §7.1 kararı verildi (2026-10-04): amaçlı atak. Kullanıcı isteğiyle depoya alındı; turlar [YOL_HARITASI](YOL_HARITASI.md#maç-motoru-gerçekçilik-planı-2026-10-03) “Maç motoru gerçekçilik planı” bölümünde T0–T11 maddeleridir. Uygulama T0 ile başlar. §7'deki diğer kararlar (3–8) açıktır; uygulayıcı bunları sessizce kesinleştirmez, ilgili tura gelince kullanıcıya sorar. Ölçüm araçlarının ilk ikisi eklendi: `araclar/olcumler/r-karne.js` ve `araclar/oyuncu-karnesi.js` (Ek F).

**2026-10-04 ekleri (kullanıcı onayı):** (1) animasyon her turda ölçütlü bir iştir (§4 “Animasyon”); (2) açık oyunda dönen top ve şutu takip açık maddedir (T5 madde 8, T7 madde 11); (3) her turun kapanışında önce/sonra film şeridi kullanıcıya gösterilir (§4 girişi). Gerekçe: aynı gün incelenen başka bir oyunun kısa maç videosunda görünür fark benzetimde değil, iki kişilik temas animasyonunda ve olayların birbirine zincirlenmesindeydi; benzetim tarafında bu planın turları (T2, T4–T6) aynı konuları zaten hedefliyor. Top toplayıcılar geri geldi (YOL_HARITASI N10, 2026-10-04) ve duran top süresini değiştirdi; T2 yeni tabanla (`araclar/taban/n10.json`) karşılaştırılır.

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

Her turun kapanışı: 80 maç `--karsilastir`, ilgili senaryo, robotluk karnesi (Ek F), `ad-denetimi.js`, `an-yakala.py` film şeridi, `akis-deneme.py`; turun animasyon işi aşağıdaki “Animasyon” ölçütleriyle birlikte kapanır; belgeler (YOL_HARITASI, TEKNIK_PLAN §8) güncellenir. **Kullanıcı incelemesi (2026-10-04):** turun önce/sonra film şeridi (başkanın normal bakışı ve dürbün) kullanıcıya gösterilir; ölçüm iyileşip görüntüde fark görünmüyorsa bu, turun “Sınır” notuna yazılır (T1'de böyle oldu). Kontrol üç kademedir (2026-10-07): tur içindeki her düzenlemeden sonra hızlı kademe (4 maç ve kısa tekrarlanabilirlik, ilgili senaryo, gerekirse `ad-denetimi.js`; ≤45 sn), yerel commit'ten önce oturum sonu kademesi (40 maç `--karsilastir`, senaryolar, ad denetimi; tek komut, arka planda), tur kapanışında bu paragraftaki tam kontrol; ayrıntı CLAUDE.md “Kontrol”.

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

### M0 — Araç ve hız (2026-10-07; sonucu değiştirmez)

**Neden.** Bu makinede (Node v24.21.0, win32/x64, 8 mantıksal çekirdek) tek işçiyle 1000 motor adımı 314 ms (T0'da 202 ms yazılmıştı; makine farkı mı T1/N10 yükü mü ayrılmadı), `mac-deneme.js` 8 işçi paralelken 588 ms (sanal çekirdek çekişmesi). 10 maç 1–1,5 dk, 80 maç 6–7 dk sürüyor ve her tur yük ekleyecek; uzun test beklemenin kaynağı bu.

**Yapılacaklar**
1. **Yerel taban.** Değişiklikten önce `node araclar/mac-deneme.js 80 1 --json araclar/taban/m0-once.json`. `t0.json` ve `n10.json` başka ortamda (Node v24.15.0) üretildi; burada `--ayni` tutmaz (YOL_HARITASI 2.8W ve T0 notları).
2. **Profil.** `node --cpu-prof` ile 2 maç; en ağır 10 işlev yazılır. Adaylar: her adımda bütün aşamalarda çalışan `topcuAI` ([js/mac-kurallar.js](js/mac-kurallar.js)), `secenekler`/`pasAnaliz` aday sayısı ve `topTahmin` çağrıları ([js/mac-karar.js](js/mac-karar.js)), `varisZamani`/`enYakinRakip`/`baskiAltinda` döngülerinin kare başına tekrarı, `markajAta`/`bolgeKonumu` sıklığı, oyuncu nesnesinin biçimi (V8 notu TEKNIK_PLAN §8). Sonucu değiştirmeyen yollar: kare içinde aynı sorunun ikinci cevabı için önbellek, rastlantı çekilişine dokunmayan sıklık azaltma. Çekiliş sırasını değiştiren hiçbir düzenleme M0'a girmez.
3. **İşçi sayısı.** `mac-deneme.js` fiziksel çekirdek kadar işçi (mantıksal/2, en az 1; `--isci N` ile ezilir).
4. **Hızlı kademe.** Kısa tekrarlanabilirlik: tam maç yerine tohum 1'in ilk dakikalarının parmak izi iki kez; `node araclar/mac-deneme.js 4` toplam ≤45 sn.
5. **Oturum sonu tek komut.** `node araclar/oturum-sonu.js [taban]`: 40 maç `--karsilastir`, bütün senaryolar, `ad-denetimi.js`; özet ve hedef dışı satırlar `araclar/olcumler/son-oturum.txt`'ye, çıkış kodu bulguya göre. Arka planda çalışırken geliştirme sürer.
6. Hız yeniden ölçülür; yeni taban `araclar/taban/m0.json` (T2 bununla karşılaştırılır).

**Kabul.** `--karsilastir araclar/taban/m0-once.json --ayni` 8/8 aynı; 1000 adım ≤200 ms tek işçi (sağlanamazsa ölçülen değer ve nedeni YOL_HARITASI M0'a yazılır, T2 beklemez); hızlı kademe ≤45 sn; oturum sonu ≤4 dk; bütün senaryolar T1 sonrasındaki sonuçlarını korur.

**M0 — Sonuç (2026-10-07; ayrıntı YOL_HARITASI M0).** Kabulün hepsi tuttu: 80/80 tohum birebir aynı; tek süreçte 1000 adım 250 → ~78 ms; 80 maç 500 → 144 sn; hızlı kademe ~21 sn; oturum sonu 154 sn. İki kaynak: (1) deneme araçları motoru Node'un sarılı `vm` bağlamında yüklüyordu, `Math` ve `function` ile bildirilen üst düzey adlara her erişim yavaş yoldan geçiyordu (`araclar/motor-yukle.js`, `DONT_CONTEXTIFY`); (2) `yakalamaNoktasi` her oyuncu için topun yolundaki her noktada `varisZamani` hesaplıyordu, kanıtlı alt sınırla yetişilemeyecek noktalar atlanıyor. Tarayıcıda (1) zaten yoktu; (2) oyunu da hızlandırır. Profilde sırada `moveP` (~%27) ve gövde çarpışması (`hareketHepsi`, ~%10) var; bütçe aşılırsa sonraki hız bakımının adaylarıdır. Bulgu: `d-sut` senaryosu N10'dan beri düşüyordu (`topcuAI` atanı varsayıyordu); düzeltildi.

### T2 — Topla oyun: tempo, taşıma, devam değeri

**Amaç.** Oyuncu topu alınca bakabilsin, taşıyabilsin, bekleyebilsin; pas en ilerideki adama değil devamı olan adama gitsin.

**2026-10-07 eki.** Hedef tablosu (`araclar/mac-deneme.js`) bu turda gerçek değerlere çekilir: toplam şut 18–28, gol 2–3,2, kurtarış %65–75, xG/şut buna göre ~0,10 (§7.7 kararı). Amaçlı atak daha çok ve daha iyi pozisyon üretmeli; şut sayısı T7'de tamamlanır. Taban `araclar/taban/m0.json`.

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

**2026-10-07 daraltma (kullanıcı çerçevesi).** Oyuncudan oyuncuya kabiliyet ekonomisi (kim neyi yapabilir, puanların karşılığı) ileride veritabanıyla yazılacak. T3 derin bir özellik sistemi değil, o ekonominin tek giriş kapısıdır: aşağıdaki 1–5 korunur ama türetme Ek A'nın başlangıç önerisiyle sınırlı kalır, kadro verisine özellik eklenmez, ağırlıklar ayar değil veri olarak durur (`mac-profil.js` içinde tablo). Büyüklük küçük; kabul ölçütleri aynen.

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
8. **Dönen top (2026-10-04, kullanıcı onayı).** Kurtarıştan, direkten ve bloktan dönen top açık oyunun parçasıdır. Top sahipsizken ona varabilecek iki takımın en yakın oyuncuları varış zamanına göre (`varisZamani`) azami eforla gider; kimse topu seyretmez. Kaleci yerdeyse en yakın savunmacı kale çizgisini kapatır. Bugün “ikinci top” yalnız pas değerindeki bir çarpandır (`MOTOR_AYAR.ikinciTop`, [js/mac-karar.js:196](js/mac-karar.js)) ve kornerde bir bekleme yeridir ([js/mac-dizilis.js:270](js/mac-dizilis.js)). Yeni senaryo `c-donen`: ceza sahasında kurtarıştan dönen top ızgarası (dönüş yönü × hız × en yakın hücumcunun ve savunmacının uzaklığı). Takım tarafı (kimin takip edeceği) T7 madde 11'dedir.

**Kabul.** "İtme" payı faullerin %40'ının altında; toplam faul 8–14; kırmızı en çok 0,2; top gövdeden geçti en çok 1; kayma kaynaklı faulsüz düşüş sıfırdan büyük. `c-donen`: dönen topa ilk dokunan, varış zamanı önde olandır ve olasılık zaman farkıyla düzgün değişir (basamak değil); top ceza sahasında sahipsizken 0,5 sn içinde iki takımdan da en az birer oyuncunun eforu 0,9'un üstündedir. Dönen toptan gol payı karneye bilgi satırı olarak eklenir; hedef aralığı gerçek veri kaynağı bulununca bağlanır (bugün kaynak yok, sayı uydurulmaz).

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
11. **Şutu takip ve dönen topu uzaklaştırma (2026-10-04, kullanıcı onayı).** Şut anında ceza sahasındaki ve yaydaki hücumculardan profili uygun olanlar (fırsatçı, ceza sahasına geç giren) kale ağzına ve uzak direğe takip koşusu yapar; hepsi gitmez, geride kalanlar (madde 7) yerini korur. Savunmada kaleciye en yakın stoper topun düşeceği bölgeyi, uzak taraftaki bek uzak direği tutar; topu alan savunmacı tehlikeye göre uzaklaştırır ya da oynar (MM3'teki uzaklaştırma kararı). Mekaniği T5 madde 8'dedir.

**Kabul.** Stoper + merkez orta sahanın pas payı en az %45; kanat değiştirme başarısı; hızlı hücumdan şut payı; gerideki takımın son 15 dakikadaki şut payı en az %60; savunmada takım boyu 25–32 m; ofsayt 0,3–2. Ceza sahası içinden atılan şutta kale ağzına takip koşusu yapan hücumcu 1–3 (hiç ya da herkes değil); `c-donen` senaryosunda dönen topa ilk dokunuşun takımlara dağılımı karneye yazılır.

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

**2026-10-07 bölme.** **T9a (Top)** T3'ten hemen sonra yapılır: bağımsızdır, orta boydur ve locadan en çok görünen fiziksel şey topun uçuşu ile sekmesidir; pas ve şut tahmini aynı `topFizikAdim`'ı kullandığından karar katmanı kendiliğinden uyar. Koşullar (madde 5) yalnız motor kapısıdır; görünümü §7.8 kararına bağlıdır. **T9b (Vuruş)** T6'dan sonra yapılır; T2'nin güç ve baskı girdilerine dayanır.

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

Mevcut iskelet (11 kemik, bacak IK'sı, eylem yuvaları) yeterlidir. Animasyon her turun ölçütlü bir işidir (2026-10-04, kullanıcı onayı); turun motor işiyle birlikte kapanır, sonraya bırakılmaz.

| Tur | Animasyon işi |
|---|---|
| T1 | Boşta pozlar ve yürüyüş (yapıldı) |
| T2 | Topu taşıma, bakınma, topu ayağının altında bekletme, sırtı dönükken dönme |
| T4 | Çalım hareketlerinin ayak yolları (IK hedefi topun çevresinde; makas, çekme, içe kesme); yutan savunmacının yanlış yöne adımı; top saklarken gövdeyi araya koyma |
| T5 | Önden blok, şut bloğuna atlama, takılıp düşme ve yerden kalkma; omuz omuza itişme; dönen topa hamle |
| T6 | Yer kapma (kolla itişme, tutma), birlikte sıçrama ve havada çarpışma, iniş |
| T7 | Jestler: pas isteme, ofsayt için el kaldırma, işaret, kaçan golde başını tutma |
| T8 | Baraj, zıplama, perdeleme |
| T9 | Kötü vuruş (ıska, topun altına girme) |
| T10 | Sakatlık, tedavi, topallama |

**Kabul ölçütleri (eşikler TEST başlangıç değeridir; ilk ölçümde gözden geçirilir).** Ölçüm `araclar/poz-galerisi.html` ve `an-yakala.py` ile yapılır.
- **Galeri satırı.** Her yeni hareketin poz galerisinde zaman sıralı bir satırı vardır; sayfa hatasız açılır.
- **İki kişilik temas.** Temas pozları (omuz, tutma, birlikte sıçrama, müdahale ve takılma, top saklama) galeride iki oyunculu sahneyle gösterilir. Temas karesinde temas eden noktalar (el–gövde, omuz–omuz, ayak–top, ayak–ayak) arasındaki açıklık en çok 0,15 m; gövde kutuları en çok 0,05 m iç içe girer. Galeri bu iki değeri satırın yanına yazar.
- **Geçiş.** Bir pozdan ötekine geçerken hiçbir eklem açısı 60 Hz'de kare başına 20°'den fazla değişmez (poz atlamaz); düşüşten kalkışa, temastan koşuya geçişler dahil.
- **Ayak.** Yerdeki ayağın kayması adım başına en çok 0,10 m (MA1'in ölçüsü korunur).
- **Zamanlama.** Temas karesi, motorun temas anından en çok bir kare sapar; çizim motora yazmaz (`ad-denetimi.js`).
- **Uzaktan okunurluk.** Başkanın normal bakışında (dürbünsüz film şeridi) hareketin ne olduğu ayırt edilir; bu, kullanıcı incelemesiyle onaylanır (§4 girişi).

**Sınır.** Kodla üretilen pozlar loca mesafesinde ve dürbünde retro üslupla canlı ve okunur olmayı hedefler; yakın plan yayın kamerasında elle ya da hareket yakalamayla üretilmiş animasyonun inceliği hedef değildir. Daha yüksek tavan dış veri gerektirir ve ayrı karardır (CLAUDE.md: harici model ve veri kullanımı).

---

## 5. Sıra, bağımlılık ve büyüklük

| Tur | Bağımlı olduğu | Büyüklük | Uzaktan görünür kazanç |
|---|---|---|---|
| T0 Ölçü | — | küçük | — |
| T1 Hareket | T0 | büyük | çok yüksek |
| M0 Araç ve hız (2026-10-07) | T1 | küçük | — (test süresi) |
| T2 Topla oyun | T0, T1, M0 | büyük | çok yüksek |
| T3 Profil kapısı | T0 | küçük (2026-10-07'de daraltıldı) | orta |
| T9a Top fiziği | T0 | orta | yüksek (uçuş, sekme) |
| T4 Bire bir | T2, T3 | büyük | yüksek |
| T5 Temas | T4 | büyük | orta–yüksek |
| T6 Hava topu | T5 | orta | orta |
| T7 Takım zekâsı | T2, T3 | büyük | çok yüksek |
| T8 Duran toplar | T3 | orta | yüksek |
| T9b Vuruş | T2, T9a | küçük | orta |
| T10 Olaylar | T5 | orta | yüksek (seyrek) |
| T11 Adım evresi | T4 | orta | düşük |

Önerilen sıra (2026-10-03) T0 → T1 → T2 → T3 → T4 → T5 → T7 → T8 → T6 → T9 → T10 → T11 idi. **Sıra (2026-10-07): M0 → T2 → T3 → T9a → T4 → T5 → T7 → T8 → T6 → T9b → T10 → T11.** T8 diğerlerinden bağımsızdır; ayrı oturumda paralel yürüyebilir.

**Hazır tanımı (2026-10-07).** Motor “hazır” sayılır ve kullanıcı “tamam” diyebilir: 80 maçta robotluk karnesinin bütün T-hedefleri ve gerçek değerlere çekilmiş hedef tablosu tutuyor; `araclar/senaryolar/` içindeki bütün senaryolar geçiyor; tek işçide 1000 adım ≤250 ms; kullanıcı her turun önce/sonra film şeridini (loca bakışı ve dürbün) onaylamış. Kabiliyet ekonomisi (veritabanı) bu tanımın dışındadır.

---

## 6. Uygulayıcı için kurallar

- Rastlantı yalnız `this.rast`; `…Tahmin` ve `…Degeri` işlevleri saf.
- Oyuncuya yeni alan `varlik` içinde baştan tanımlanır; yeni ayar `ayarEkle` ile; yeni dosya `index.html` sırasına ve `ad-denetimi.js`'e uygun eklenir. Blok içinde `function` bildirimi kullanılmaz.
- Kişisel sapma ve düşünme anı kaydırması tohumdan ve oyuncu sırasından türetilir.
- Rastlantı çekiliş sırası değişen turda `--ayni` kullanılmaz; `--karsilastir` istatistikle bakılır.
- Mekanik senaryoda doğrulanmadan `MOTOR_AYAR` düğmeleriyle denge aranmaz.
- Süre bütçesi (2026-10-07): M0 sonrası bu makinede tek süreçte 1000 adım ~78 ms (`node araclar/hiz-olcum.js 3`; M0 öncesi 250). Tur başına artış %10'u geçmez, 250 ms aşılırsa bir sonraki turdan önce hız bakımı yapılır. Her tur kapanışında tek süreç süresi YOL_HARITASI'na yazılır; `mac-deneme.js`'in süre satırı paralel süredir, bütçe ölçüsü değildir.
- Motor çizime yalnız alan ekler; her yeni alanın çizimde yedek davranışı olur.
- Bir tur bitmeden ötekine geçilmez.

---

## 7. Kullanıcının karar vermesi gerekenler

1. **Maçın temposu.** Daha az, daha uzun ve amaçlı atak (öneri) mı, bugünkü sık top kaybı mı? Hedef tabloyu etkiler: pas isabeti üst sınırı (%80), top kaybı sayısı. **Karar (kullanıcı, 2026-10-04): amaçlı atak** — daha az ama daha uzun, amaçlı ataklar; T2'nin kabul hedefleri (sahiplik başına 2,5–4 pas, top ayakta 1,2–2 sn, taşıma payı) bu yöndedir; pas isabeti %80 tavanını aşarsa tavan T2'de gözden geçirilir.
2. **Yürüme oranı hedefi.** Önerilen ara hedef %40; gerçek %61.
3. **Özellik listesi.** Alt özellikler türetilsin (öneri) mi, kadro verisine yeni özellik eklensin mi? **Karar (Claude, 2026-10-07; motor kararları kullanıcı tarafından devredildi): türetilir; kadro verisine özellik eklenmez. Kabiliyet ekonomisi ileride veritabanıyla gelir, T3 yalnız kapıdır.**
4. **Çekirdek dosyaların açılması ve yeni dosyalar.** `mac-dizilis.js`, `mac-kurallar.js`, `mac-motoru.js` (top fiziği); yeni `mac-profil.js`, `mac-takim.js`, `mac-durantop.js`. **Karar (Claude, 2026-10-07): açılır; üç yeni dosya gelir, `index.html` sırası ve `ad-denetimi.js` ile.**
5. **Duran top süresi.** Tehlikeli duran toplarda hazırlığın 10–14 saniyeye uzaması. **Karar (Claude, 2026-10-07): 10–14 sn; N10 sonrası ölçülen ortanca 12,5 sn zaten aralıkta, T8 yalnız “görevliler yerinde ya da azami süre” koşulunu kurar.**
6. **Sakatlık sıklığı ve değişiklik hakkı.** Gerçekte maç başına yaklaşık bir süre kayıplı sakatlık olur. Motor bugün 5 değişikliğe izin veriyor ([js/mac-kurallar.js:26](js/mac-kurallar.js)); dönem kuralı kararı. **Oyun kuralıdır; T10'da kullanıcıya sorulur.** Öneri: maç başına ~0,3 tedavi gerektiren sakatlık, 5 değişiklik (günümüz kuralı).
7. **Kurtarış oranı (~%50).** Bu turlarla düzelmez; şut hedefinin yeniden ele alınmasını gerektirir. **Karar (Claude, 2026-10-07): hedef tablosu T2'de gerçek değerlere çekilir — toplam şut 18–28, gol 2–3,2, kurtarış %65–75, xG/şut ~0,10; T7 pozisyon üretimiyle tamamlar.**
8. **Hava koşulları ve görünümü.** Yağmur ve rüzgâr maçta gösterilecek mi? **Görünüm kararıdır; T10'da kullanıcıya sorulur.** T9a yalnız motor kapısını (`kosullar`) kurar, varsayılan kuru ve rüzgârsızdır.

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
