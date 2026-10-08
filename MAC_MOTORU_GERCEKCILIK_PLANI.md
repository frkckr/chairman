# Chairman — maç motoru gerçekçilik planı

**Durum (2026-10-07):** Motor odağı (kullanıcı kararı; YOL_HARITASI “Güncel karar özeti” 2026-10-07): kullanıcı “tamam” diyene kadar bütün geliştirme bu plandadır; motor kararlarını Claude verir ve görünür yazar. Sıra **M0 → T2 → T3 → T9a → T4 → T5 → T7 → T8 → T6 → T9b → T10 → T11**: M0 (araç ve hız) eklendi, T3 profil kapısına daraltıldı (kabiliyet ekonomisi ileride veritabanıyla), T9 top fiziği (T9a, öne alındı) ve vuruş (T9b) olarak bölündü (§4, §5). §7: 1–2 verilmişti; 3, 4, 5 ve 7 bu tarihte kesinleştirildi (§7'de yazılı); 6 ve 8 T10'da kullanıcıya sorulur. Kontrol üç kademedir (CLAUDE.md “Kontrol”). M0 aynı gün tamamlandı (aşağıda “M0 — Sonuç”); T2 de tamamlandı (aşağıda “T2 — Sonuç”; kullanıcı onayıyla kapandı, M0 ile birlikte `main`'e alındı), T3 ve T9a aynı gece tamamlandı (aşağıda “T3 — Sonuç” ve “T9a — Sonuç”; `main`'de). **2026-10-07 gece (kullanıcı kararı):** T4'ten önce **A2 — animasyon temeli ve hareket dili** turu eklendi (§4 A2, Ek G; karşılaştırma sayfası `prototipler/9-a2-yuruyus.html`); sıradaki A2, ardından T4; taban `araclar/taban/t9a.json`.

**Durum (2026-10-08):** A2a uygulandı ve `main`'de; A2b uygulandı (`claude/motor-a2`, commit edilmedi; “A2b — Sonuç”), kullanıcının karşılaştırma sayfası ve loca şeritleri incelemesi bekliyor; onaydan sonra A2 tur kapanışı ve `main`, ardından T4.

**Durum (2026-10-07 akşam):** Kullanıcı kararıyla dürbün tamamen kaldırıldı (YOL_HARITASI N13): tur kapanışındaki önce/sonra film şeritleri yalnız başkanın loca bakışıyla (oyunda 21–26°) alınır; animasyon ve ayak ayrıntısı bu mesafede okunmalıdır. T11'in kazancı dürbüne bağlıydı: **T11 sıradan ve “hazır” tanımından çıkarıldı** (ileride ayrı karar). T3–T10 için bitirme planı (kapsam, kabul, büyüklük) onaylandı (YOL_HARITASI “Güncel karar özeti” 2026-10-07 akşam); sıra **T3 → T9a → A2 → T4 → T5 → T7 → T8 → T6 → T9b → T10** (A2 aynı gece eklendi).

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
6. **Önce uzaktan görünen.** Başkan locadan bakar (dürbün yok, 2026-10-07); önce tempo, akış ve yerleşim, sonra bu mesafede okunabilen ayak ayrıntısı.
7. **10 dakikalık maç 90 dakikanın özeti gibi oynar (karar gerekir, bkz. §7).** Bugün olay sıklığı, topun çok sık el değiştirmesiyle sağlanıyor: ataklar gerçeğinden kısa (6,5 sn ve 1,35 pas; gerçekte 9,5 sn ve 3–5 pas). Öneri: daha az, daha uzun ve amaçlı atak; şut sayısı atakların verimiyle korunur.

---

## 4. Turlar

Her turun kapanışı: 80 maç `--karsilastir`, ilgili senaryo, robotluk karnesi (Ek F), `ad-denetimi.js`, `an-yakala.py` film şeridi, `akis-deneme.py`; turun animasyon işi aşağıdaki “Animasyon” ölçütleriyle birlikte kapanır; belgeler (YOL_HARITASI, TEKNIK_PLAN §8) güncellenir. **Kullanıcı incelemesi (2026-10-04):** turun önce/sonra film şeridi (başkanın loca bakışı; dürbün 2026-10-07'de kaldırıldı) kullanıcıya gösterilir; ölçüm iyileşip görüntüde fark görünmüyorsa bu, turun “Sınır” notuna yazılır (T1'de böyle oldu). Kontrol üç kademedir (2026-10-07): tur içindeki her düzenlemeden sonra hızlı kademe (4 maç ve kısa tekrarlanabilirlik, ilgili senaryo, gerekirse `ad-denetimi.js`; ≤45 sn), yerel commit'ten önce oturum sonu kademesi (40 maç `--karsilastir`, senaryolar, ad denetimi; tek komut, arka planda), tur kapanışında bu paragraftaki tam kontrol; ayrıntı CLAUDE.md “Kontrol”.

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

**2026-10-07 eki.** Hedef tablosu: §7.7'nin düzeltilmiş kararı (şut 8–14, gol 1,8–3,0 kalır; kurtarış oranı bilgi satırı). Taban `araclar/taban/m0.json`.

**T2 — Sonuç (2026-10-07; ayrıntı YOL_HARITASI T2; kullanıcı onayıyla kapandı).** Uygulanan: baskı süresi, devam değeri, 8 yön × 5/10 m taşıma, bekle/koru, sabır eşiği (takım ayarından; baskıda, son üçte birde ve topu tuttukça azalır), topu tutarken 5–8 Hz düşünme ve olay tetikleri, sahiplik boyu kişisel karar sapması, pas kalibrasyonu (vuruş hatası toleransı, ofsayt riski, hedef forvette kazanma/ikinci top ayrı, ara pası çarpanı 0,85). 80 maçta: top ayakta ortanca 0,85 → 1,19 sn, sahiplik başına pas 1,65 → 3,17, forvete pas %61 → 29,5, pas boyu 26,6 → 20,9 m, PPDA 5,3 → 9,9, Brier 18,5 → 11,2. Kabulde dışarıda: taşıma %22, boş sahiplik %27, kanada pas %11,5, pas boyu, şutun yeri (%36 içeriden, 19,9 m); hedef tablosunda pas isabeti %86, faul 5,2, hava topu 1,8, korner, taç. Bunlar T4 (bire bir), T5–T6 (ikili mücadele), T7 (yerleşim, pres tetikleri, koşular) ile ele alınır; ara pası çarpanının kök nedeni (geriye koşan savunmacının varışı) T5'tedir.

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

**T3 — Sonuç (2026-10-07 akşam; ayrıntı YOL_HARITASI T3; `claude/motor-t3`, `main`'e alındı).** Uygulanan: `js/mac-profil.js` (Ek A tablosu, roller ve eğilimler veri; ad özetinden ±0,08; gün formu tohum özetinden, `m.rast` tüketmez), `p.profil = {alt, rol, egilim, form, grup}`; kullanım yerleri çalışkanlık, seçim (Gumbel ölçeği tutarlılıktan, eğilim puanı), sabır, uzak şut, tek vuruş, çalım sıklığı, müdahale isteği, faul çekilişleri (agresiflik; T5'e kadar), duran top görevlileri. Kabul ölçümü duyarlılık kipiyle (`oyuncu-karnesi.js --duyarlilik`: aynı mevki grubundaki iki oyuncuya ±0,2; kabul = sıklık oranı ≥ 1,25 ve GA alt ucu > 1; doğal kadroda r gürültüden ibaret): sürüş → çalım 1,97×, sürüş → taşıma 1,71×, müdahale → müdahale 1,38×, sertlik → faul 1,56× (80 maç); aynı kipte hat içi r 0,68 / 0,59 / 0,46 / 0,52. `p-tip` TVD 0,068 → 0,369. Forvet dışı şut %8 (≥%30 kabulü T7'ye devredildi: orta saha ve kanat son üçte bire girmiyor). Hedef tablosu T2 ile aynı; top ayakta ortanca 1,28 sn (hedefte). Hız 35,9 ms / 1000 adım (T2 37,3). Taban `araclar/taban/t3.json`. Bulgu: top toplayıcının koşan atana uzaktan attığı top (`d-topcu`) düzeltildi.

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

### A2 — Animasyon temeli ve hareket dili (2026-10-07 gece, kullanıcı kararı; T4'ten önce; kapsam 2026-10-08'de genişletildi)

**Neden.** T1–T3 ve T9a'dan sonra robot hissinin kalan kaynağı hareketin kendisi. 2026-10-08 ölçümü (`araclar/poz-galerisi.html?sayfa=olcum`, bugünkü kod, başsız Chromium): düz yolda kadans gerçek bantların içinde (1,5 m/sn'de 1,7 adım/sn, 4 m/sn'de 3,0, 7 m/sn'de 4,0) ve yerdeki ayağın kayması adım başına ortalama 0,006 m (en kötü 0,017); 60 aktör karede 1,02 ms. Yani eksik düz koşuda değil, şuralardadır: dönüş yerinde döndürme (adım evresi dönüş hızıyla ilerliyor ama basma adımı ve kilitli ayak yok), poz nesnesi değişince sıçrama (yuva ağırlıkları hız sınırlı, pozun içeriği değil), koşuda uçuş evresi yok, ivme ve frende duruş değişmiyor, bekleyiş iki sabit pozdan ibaret, 22 oyuncu aynı yürüyor, bakış başın dönme hızını ve sınırını bilmiyor, kol salınımı hızla büyümüyor, eylemler arasında üst gövde için ortak bir jest katmanı yok. Karşılaştırma sayfası `prototipler/9-a2-yuruyus.html` (A2'siz / A2 / başka kimlik; oyuncak figür — “A2'siz” satırındaki sabit kadans oyun kodunu değil en kötü hâli gösterir) farkı gösterdi ve kullanıcı yöntemi benimsedi. Bütün pozlar kodla üretilir; hareket verisi ayrı karardır (§7.9).

**Kapsam kararı (Claude, 2026-10-08; kullanıcı “bütün olasılıkları değerlendir ve plana ekle” dedi).** Üç kaynaklı araştırmadan (saha oyuncusu biyomekaniği, kaleci/hakem/kenar prosedürleri, prosedürel animasyon teknikleri; Ek G ve “Kaynaklar — Ek G”) sonra A2 iki alt tura ayrıldı; ikisi aynı dalda (`claude/motor-a2`) ard arda yapılır ve ikisi de motor sonucunu değiştirmez (`--ayni` 80/80; motora yalnız sonucu değiştirmeyen okunur alan eklenebilir, T1'deki `p.kip` gibi).
- **A2a — Temel (sistem katmanı; Ek G0, G1, G9).** Bundan sonraki her hareketin üstüne bineceği altyapı: evreli adım döngüleri, ataletli geçiş, ayak kilidi ve basma adımlı dönüş, bakış zinciri, kimlik ve canlı bekleyiş, üst gövde jest katmanı, ölçüm aracı ve oyun iskeletine bağlı karşılaştırma sayfası.
- **A2b — Tetiği bugün var olan hareketler (Ek G'de “A2b” etiketli maddeler).** Kural: bir hareket, motor tetiğini bugün üretiyorsa A2b'de yapılır; tetiği henüz yoksa tetiği doğuran turda (T4–T10) yapılır. Bugün tetiği olanlar: vuruş hazırlığı, gerilme ve takip (`vurus` evreleri, `stil`, `guc`, `tekDokunus`, pasın uzunluğu); uzun topta ve ortada izleme, omuz üstünden ve yukarı bakış (`pass`/`cross` olayı, topun uçuşu, `bakisYon`); ilk dokunuş pozlarının ataletli sürümleri (`kontrol` + `yuzey`); hakem, yan hakem ve 4. hakem işaret setinin tamamlanması (`faul`, `goal`, `ofsayt {p}`, `durus.tur`, `degisiklik`, `kart`, uzatma tabelası); kalecinin set duruşu, split-step ve küçük açı adımları (`tavir='hazir'`, `cross`, şutçunun `vurus.faz`), dağıtım çeşidinin görünüşü (`degaj`, `elleAtis.stil`); barajın zıplaması (`durus.barajdakiler`, vuranın `vurus` takibi); eller dizde/belde ve duruşta esneme (`enerji`, `kip`, duruş süresi); top toplayıcı, yedek ve kenar kişilerinin bekleyişleri. Tetiği olmayanlar ilgili turdadır: çalım ayak yolları T4, temas ve gerçek kalkış süresi T5, sıçrama ve kafa T6, topsuz koşu işaretleri ve savunma hattı T7, duran top hazırlıkları T8, kötü vuruş ve dalış evreleri T9b, sakatlık, sevinç çeşitleri, kenar prosedürleri ve dönem işaretleri T10 (§7.6).

**A2a kapsamı (E akışı, `js/animasyon.js`; motor yalnız okunur; ayrıntı ve sayılar Ek G0–G1):**
1. **Adım döngüleri evreyle.** Aktör başına tek evre (ayak basışına bağlı); hız → kadans ve adım boyu (yürüyüşte adım ≈ 0,75·(v/1,25)^0,42 m, 96–134 adım/dk; koşuya geçiş ≈ 2,0–2,1 m/sn; 5 m/sn'de ≈ 2,9 adım/sn, 7,3 m/sn'de ≈ 3,9); döngü dört anahtar pozdan (geçiş ve uzanma, iki yan) açısal ara değerle; yürüyüş, tırıs, koşu, depar, geri koşu (ileri tepe hızın en çok %70'i, kısa ve sık adım, dik gövde) ve yana kayma adımı ayrı eğrilerle; uçuş evresi yalnız koşuda; kol bacakla ters fazda, genlik ve dirsek açısı hızla; pelvis inip kalkma ve yana salınım, kalça–omuz ters burulma. `p.kip` döngüyü seçer, hız eğrileri karıştırır; `p.enerji` yorgun koşuyu verir (temas uzar, kadans düşer, bob artar, adım aynı).
2. **İvme, fren ve viraj.** Hızlanırken öne eğilme tanθ ≈ a/g (ilk adımlarda daha dik), frende ayak kütle merkezinin önünde, kalça alçalır, gövde geriye, kısa kesik adımlar, kollar açık; virajda içe yatış tanθ = v²/(r·g), iç kol alçak.
3. **Ayak kilidi ve basma adımlı dönüş.** Yerdeki ayak dünyaya kilitli (bugünkü çivileme korunur, kilit açma eşiği ölçütle); dönüş açıya göre: ≤ 45° yatış ve kalça gecikmesi, 60–135° iki adım (sondan bir önceki fren adımı), 180° iki–üç adım ve uzun basma; durarak dönüşte baş önce, ayaklar evre tıklarıyla; yerinde kayarak dönüş kalkar.
4. **Ataletli geçiş.** Bütün kanallar ve yuva değişimleri (kip, eylem başı/sonu, kilit aç/kapa, kalkış) hedefe hız sürekliliğiyle (kritik sönümlü yay ya da beşinci derece eğri); karede tek poz değerlendirmesi (çapraz karışım yok); süreler Ek G9.
5. **Bakış zinciri.** Hedef → baş (öncü, ~200 ms) → gövde (gecikmeli) → kalça (hız yönü); baş–gövde dönüşü sınırlı, hızlı yeniden hedefleme süreli; omuz üstünden bakışta gövde döner; yüksek topa baş kalkar, yakın topa iner.
6. **Kimlik.** `p.profil` (boy, yapı, çabukluk, çalışkanlık, rol, agresiflik) ve ad özetinden: adım boyu/kadans oranı, kol genliği, bob, duruş eğimi, dirsek açısı, bekleyiş tarzı, nefes temposu, evre kayması; yorgunlukla değişir. Aynı sahnede iki oyuncu ölçülebilir biçimde farklı yürür.
7. **Bekleyiş ve düşük efor.** Nefes, ağırlık aktarımı, aralıklı küçük kıpırtı ve bakınma, eller belde ya da dizlerde (efor sonrası), gevşek duruş; aktör başına evre kayması (iki aktör aynı anda aynı şeyi yapmaz); kaleci, hakem, top toplayıcı ve yedekler için ayrı kümeler.
8. **Jest katmanı.** Bacaktan bağımsız üst gövde pozları (kol kaldırma, işaret, avuç açık itiraz, alkış, el ağızda çağırma, eller başta) ve bunları isteyen sözleşme alanı `p.jest {tur, t, sure, hedef}` (A2a'da alan ve çizim; yazan motor işi T7 ve T10); A2b hakem işaretleri bu katmanı kullanır.
9. **Araç.** `araclar/animasyon-karsilastir.html` (önce/sonra iki iframe, aynı tohum ve sanal saat, sahne seçici, üçüncü sütun farklı kimlik), `araclar/animasyon-olcum.py` (maç içinde ölçütler, Ek G9), poz galerisine yeni satırlar, `an-yakala.py` yeni anlar.

**Kabul.** Ek G9 ölçüt tablosu (ayak kayması oranı ve adım başına yol, kadans–hız bantları ve uçuş evresi, SPARC düzgünlüğü ve eklem sıçraması, baş–gövde sınırları ve baş öncülüğü, dönüşte basma adımı, kimlik farkı, geçiş tamamlanması, kare süresi ≤ 2 ms / 60 aktör) A2a kapanışında tutar; A2b'nin her hareketi karşılaştırma sayfasında önce/sonra ve farklı kimlikle gösterilir, galeri satırı vardır, işaret olayla aynı karede başlar; kullanıcı karşılaştırma sayfasını ve loca bakışı film şeridini onaylar; motor sonucu değişmez (`--ayni` 80/80, `ad-denetimi.js` temiz).

**Büyüklük.** A2a 1–1½ oturum, A2b 1–1½ oturum (önceki tahmin toplam 1–1½ idi; genişleme 2026-10-08 kullanıcı isteğiyle). Ek G'nin G0–G1 bölümü A2a, “A2b” etiketli maddeler A2b'dir; kalan bölümler ilgili T turlarına dağıtılmıştır (§4 “Animasyon” tablosu).

**A2a — Sonuç (2026-10-08, `claude/motor-a2`; kullanıcı karşılaştırma sayfasını gördü: “güzel olmuş”).** Önce ölçüm aracı kuruldu, sonra her düzenleme maç içinde ölçüldü. İlk maç ölçümü düz yoldaki galeri ölçümünden çok farklıydı: yavaş yürüyüşte havadaki ayak yerde süzülüyordu (adım başına net 10 cm), hızlı yürüyüşte geride kalan ayak kalçayı her adımda 15–23 cm çökertip geri fırlatıyordu (dakikada 42 kalça sıçraması), baş topu izlerken saniyede 2000°'ye varan hızla öbür omza fırlıyordu, yana kayarken adım kısalıp kadans 5 adım/sn'yi aşıyordu.
- *Uygulandı (`js/animasyon.js`, `STIL.animasyon`):* adım boyu ve kadans hızdan ve boydan (`anmAdimBoyu`; duruş payı yürüyüşte 0,55–0,62, koşuda 0,25–0,40, yana kaymada 0,42; geri adım 0,75×; yana adım 0,3 + 0,08·v, en çok 0,5 m; çaprazda yana payın karesi); kadans ve duruş payı yumuşatılır. Salınan ayak 1 − (2g−1)⁴ eğrisiyle (uçlarda eğim sonlu; en az 6 cm, adımın yarısını geçmez; koşuda tepe öne kayar); durunca havadaki ayak adımını tamamlar; yerdeki ayak gövdeden 0,28 m uzaklaşınca adım tetiklenir. Yerinde dönüş: ayakların yönü yalnız basışta köke %85 yaklaşır, aradaki fark ve dönüş hızı basma ister (3,2 adım/sn'ye kadar), kalça ayaklarla kök arasında (en çok 29°) gecikir, gövde ve baş kökle önden döner; kök yönü en çok 9 rad/sn (motorun ani yön atlaması tek karede dönmez), ilk karede yön oturur. Kalça yüksekliği: yerdeki ayağa uzanma ve koşuda yaylanma (4 → 2,2 cm), kritik sönümlü yayla; iniş sınırı yürüyüşte 9, koşuda 10 cm; geride kalan ayağın tabanı kalkar; yumuşak IK (uzanma %96'dan sonra üstel sıkışır, diz düzlükte kilitlenmez). Eğilme atan(a/g)·0,8 (toplam ≤ 0,6 rad), virajda içe yatış (≤ 0,35 rad, yavaşta az). Kalça adımla salınır, omuz ters döner; tam yana harekette kalça kare kalır. Kollar evreden kosinüsle (genlik 0,16 + 0,74·koşu payı, kimlikle), geri koşuya geçiş sürekli. Bakış zinciri: arkada kalan hedefte baş döndüğü omuzda kalır, motorun dönüş hızının 0,32 sn ilerisine bakar, kritik sönümlü yay (ivme ≤ 90 rad/sn², hız ≤ 7 rad/sn), 70°'yi aşan kısmı gövde alır. Kimlik (`anmKimlik`): profilden (çabukluk, güç) ve numara/takım özetinden adım, kol, dirsek, yaylanma, duruş eğimi, nefes, ayak kaldırma, bekleyiş tarzı, kıpırtı aralığı. Bekleyiş (`anmBekleyis`): eller belde ↔ gevşek, 8–15 sn'de yumuşak geçiş; sert koşudan sonra durunca 2–4 sn eller dizlerde; 14–36 sn'de bir bakınma ya da çorap çekme; nefes (sert koşudan sonra hızlı ve derin). Yuva ağırlıkları kritik sönümlü yayla (kapalı biçim). Jest katmanı: sözleşme alanı `p.jest {tur: kol | isaret | itiraz | cagir | basEl | alkis, t, sure, kol, hedef}` (motorda `varlik`'ta `null`; yazan iş T7/T10), giriş 0,15 / çıkış 0,25 sn, işarette gövde hedefe döner.
- *Araçlar:* `araclar/animasyon-olcum.py` (Ek G9; `aktorGuncelle` ve `macKare` dışarıdan sarılır, animasyon koduna ölçüm girmez; `--once`, `--json`, `--karsilastir`); `araclar/karsilastir/dondur.js` (turun başında “önce”yi sabitler: `once/animasyon.js`, POSE ve `STIL.animasyon` o anki değerleriyle), `once-yukle.js` (dondurulmuş animasyonu aynı maç sayfasında bir işlevin içinde çalıştırır; motor aynı); `araclar/animasyon-karsilastir.html` (iki çerçeve, aynı tohum, ortak kare saati, sahne seçici, loca/yakın/orta kamera; yerel sunucu ister, `.claude/launch.json` “chairman-yerel”; `js/ortak.js`'teki geliştirme kancası oyunda etkisiz); `an-yakala.py --anm once` (önce/sonra şeridi git stash'siz); poz galerisi `?sayfa=a2hareket` ve `?sayfa=a2bekle`.
- *Doğrulama (tohum 3, 180 sn, aynı araçla önce → A2a; Ek G9 tablosu):* ayak kayması yürüyüşte %11,7 → 3,6, adım başına net 0,101 → 0,022 m; yürüyüş kadansı 3,19 [1,80–5,36] → 2,57 [1,88–3,46]; uçuş koşuda %15 → 35, depar %52 → 57; sıçrama (oyuncu·dk) üst gövde 86 → 7,5, kalça > 3 cm 42 → 1,1, kök > 10° 1,45 → 0, bacak > 20° 86 → 63; kırılma üst gövde 132 → 10, bacak 358 → 189 (%82'si basma/kalkma anında); baş gövdeye göre p99 745 → 313°/sn, dünyada en çok 2032 → 816°/sn, baş–gövde > 70° %9,2 → 5,6; kimlik adım boyu CV %11 → 17; süre 0,78 → 0,82 ms/kare. Motor sonucu aynı (oturum sonu: 40/40 tohum `--ayni` t9a, 14 senaryo geçti). `ad-denetimi.js` temiz; poz galerisi `a2hareket`, `a2bekle`, `olcum` hatasız; `akis-deneme.py` sonuçları YOL_HARITASI A2'de (bu makinedeki gerçek zamanlı bekleme düşüşleri değişiklik öncesi kodda da aynı).
- *Sınır:* baş öncülüğü ortanca 67 ms (hedef ≥ 150) ve dünyadaki baş hızı (p99 625°/sn) motorun yerinde dönüş hızına bağlıdır (5,5–8 rad/sn; kök p99 382°/sn); A2 motoru değiştirmez — motor dönüşü T4/T7'de insan gibi (daha yavaş, basma adımlı) ele alınırsa yeniden ölçülür. Maçtaki yürüme bandının kadansı (ortalama 2,57) düz yürüyüşün (1,6–2,2) üstündedir: band ayar adımlarını, yana/geri adımları ve dönüş basmalarını içerir. Yürüyüşte “uçuş” %6: geride kalan ayağın tabanı kalkışta 2,5 cm'yi geçer (burun yerde sayılır; ayak bileği yok). Koşu bantlarında yerdeki ayağın kayan kare payı arttı (koşu %1 → 4, hızlı %0 → 7, depar %0 → 9; hedef içinde) ama adım başına net kayma ≤ 1,1 cm (yumuşak IK'nın kısa bıraktığı ayak). SPARC baş hızında −2,36 → −2,54 (daha çok yaylanma ve salınım; kapı değil). Kollar kavuşuk bekleyiş tarzı kutu kollarla okunmadı, kaldırıldı. Yerinde 180° dönüşün ortasında kalça gecikmesi bacakları kısa süre burkulmuş gösterir (tasarım gereği; gövde önden döner).

**A2b — Sonuç (2026-10-08, `claude/motor-a2`; kullanıcı incelemesi bekliyor).** Motor değişmedi, motora alan da eklenmedi: bütün hareketler bugünkü motor alanlarından ve olaylarından tetiklenir (TEKNIK_PLAN §8 “A2b”). Önce A2a hâli ikinci “önce” olarak donduruldu (`araclar/karsilastir/a2a/`), böylece A2b'nin farkı A2a'ya göre ayrı görülür.
- *Vuruş (Ek G2; `js/animasyon.js` vuruş katmanı):* temasa kalan süre motorun kendi ölçüsüyle tahmin edilir (hazırlıkta ayak noktası–top uzaklığı ve yaklaşma hızı, hizasız gövdeye dönüş süresi; geri salınımda kalan süre; gelişine vuruşta topun ayağa varışı). Hazırlığın son ~0,2 sn'sinde karşı kol açılmaya, gövde burulmaya başlar; **son adım** temastan tB önce (pas 0,27 · şut 0,33 · uzun top 0,39 sn): vuran ayak IK ile geri salınımın tepesine çıkar (ayak 0,3–0,4 m geride ve yukarıda, diz ~90°), destek ayağı tahmini temas yerinin yanına (topun 0,12 m gerisi, 0,22–0,27 m yanı) uzanır ve aşağı salınımın başında (temastan tD = 0,09–0,11 sn önce) basıp dünyaya kilitlenir; gövde vuruş yönünde 0,15 m öne kayar (motor gövdeyi topun 0,34 m gerisinde tutar; çizimde kalça destek ayağının üstüne gelir, vuran bacak temasta dikleşir). Aşağı salınım alttan (ayak 6 cm yüksekten geçer) topa iner ve ayak, motorun `takip`e geçtiği karede topta olur. Takip stile ve güce göre: iç ayakta uç dışa, alçak ve kısa; dış ayakta dışa; sert üst vuruşta ayak bel hizasına (~0,75 m), uzun topta gövde geride; aşırtmada kısa ve alçak. Sert vuruşta (güç ≥ 0,6) **iniş sıçraması**: destek ayağı temastan 0,04 sn sonra yerden kesilir, kök 4–8 cm kalkar, vuran ayak temastan ~0,32 sn sonra öne basar; adım döngüsü o ayaktan yeniden başlar (0,16 sn ataletli geçiş). Üst gövde: geri salınımda karşı kol ~80° açılıp geriye uzar (gerilme yayı), kalça vuruş tarafına, göğüs ters burulur; aşağı salınımla kollar ve gövde ters döner. Tek vuruş ve kesme ortada salınım kısa, zayıf ayakla dar. Motor stili temasta kesinleştirdiğinde (şutta sert/plase/aşırtma) takip yeni stilden, üst gövde pozu değişmeden. Vuruş kesilirse (motor vazgeçer, top kaçar, başka eylem) basan ayaktan adım döngüsüne dönülür.
- *Uzun top ve orta (G3):* top havadayken herkes taramayı bırakıp topa bakar, baş topun yükselme açısıyla kalkar (en çok ~48°, kritik sönümlü yay), çok yüksekte gövde de geriye yaslanır; arkadaki topa omuz üstünden bakış A2a zincirinden gelir. İnen top 0,4–1,5 sn içinde 7 m yakına düşecekse ikinci top hazır duruşu (dizler bükük, kollar dengede).
- *İlk dokunuş (G2):* dokunan ayak motorun son dokunuşundan; temas pozu (iç ayakta uç dışa, dış ayakta içe, tabanda ayak topun üstünde, uylukta yatay) eylemin ilk karesinde yükselir, sürenin %60'ında yumuşatma pozuna geçer (ayak geri çekilir, uyluk düşer); göğüste önce 10–20° geriye yaslanma ve dışarıda dirsekler, sonra inen topa öne eğilme.
- *Hakem, yan hakem, 4. hakem (G7):* işaretler motor olaylarından kurulan sırayla, olayla aynı karede başlar. Hakem: faulde düdük (el ağızda) → serbest vuruşta kol atak yönüne (20° yukarı) ya da penaltıda kol aşağı noktaya; avantajda iki kol öne; ofsaytta düdük → endirekt için kol başın üstünde (top başka oyuncuya değene dek); kornerde köşeyi, kale vuruşunda kale alanını, taçta (yan hakemin çizgisi değilse) atak yönünü gösterir; golde 0,8 sn sonra santrayı gösterir; kartta uzaktaysa oyuncuyu gösterip çağırır, kartı başının üstünde tutar (ikinci sarıda önce sarı, sonra kırmızı); santra ve yeniden başlama düdükleri; ölü topta eller arkada bekler, 22–40 sn'de bir saatine bakar. Yan hakem: ofsaytta bayrak dik (0,6 sn) → oyuncunun uzaklığına göre 45° aşağı / yatay / 45° yukarı; kornerde bayrak köşe bayrağına aşağı; kale vuruşunda kale alanına; kendi çizgisindeki taçta 45° yukarı atak yönüne; değişiklikte iki eliyle başının üstünde; bayrak sahaya yakın elde, işaret öbür yana gerekiyorsa el değiştirir. 4. hakem tabelaları (mevcut) ve eller önde bekleyiş. Kol yönü gövde çerçevesinde (kol önce öne kalkar, sonra yana açılır), gövde hedefe yarı yarıya döner, baş bakar. **Bulgu:** motor faulde ve ofsaytta hakeme `duduk`/`penaltiGoster` eylemini verip aynı adımda duran topu başlatırken `yon` ile ezer; düdük ve penaltı işareti A2a'ya dek hiç çizilmiyordu — çizim sırayı olaydan kurduğu için artık görünür (motor değişmeden).
- *Kaleci (G6):* rakibin şut/orta/korner/serbest vuruşu temasa 0,32 sn kala ~7 cm'lik split-step, şutçunun destek ayağı basarken (~0,07–0,09 sn önce) set duruşuna iniş (ayaklar daha geniş, kalça 7 cm daha alçak, göğüs dizlerin üstünde, eller önde); vuruş bitene ya da dalışa dek tutar. Dağıtım: degajda bacak topun altından yükselir (bel hizasının üstüne), kollar açılır, gövde geride, 6 cm sıçrama; omuzdan atışta kol baştan öne iner, ters ayak önde; yuvarlamada çömelip kol yerden öne. Top motorda eylemin ilk karesinde çıktığı (ve dağıtımın türü önceden bilinemediği) için hazırlık gösterilmez, pozlar bırakış/temas anından takibe gider. Bekleyişte eldiven düzeltme.
- *Baraj (G5):* barajdakiler elleri önde kapanmış bekler; vuranın temasından 0,06 sn önce 0,30–0,40 m sıçrar (havada ~0,55 sn, dizler toplanır, kimi başını çevirir; motorun kendi sıçraması varsa çizim sıçratmaz).
- *Bekleyiş ve kenar (G0.7, G7):* ölü topta yorgun oyuncular arka uyluk ya da arka bacak esnetir; kulübede oturanlar öne eğilir (dirsekler dizlerde) ya da yaslanır (18–30 sn'de bir); teknik direktör ayaktayken eller belde, arada işaret eder ya da eli ağzında bağırır, takımı aleyhine faul ve kartta itiraz eder; top toplayıcıların bir kısmı (12'de 7) topu kucağında çömelir. Yeri sabit kişilerin kimliğine ev yeri katıldı (top toplayıcıların hepsi aynı kimliği paylaşıyordu).
- *Araçlar:* `node araclar/karsilastir/dondur.js [ad]` (A2b öncesi `a2a/`); karşılaştırma sayfasında “Önce: A2a / A2 öncesi” seçici ve 14 A2b sahnesi (şut, gelişine vuruş, uzun top, pas, ilk dokunuş, faul, ofsayt, korner, taç, kaleci set, dağıtım, baraj, uzun topta başlar, kenar; sahne başına arama süresi `en`); `animasyon-olcum.py --once [once|a2a]`, `A: zamanlama` satırı ve eylem başına sıçrayan kanal dökümü; yeni taban `araclar/taban/a2b.json`; `an-yakala.py --anm once|a2a` ve anlar `gerilme`, `uzun-top-savunma`, `baraj`, `hakem-faul`, `hakem-kart`, `yan-hakem-ofsayt`, `kaleci-set`, `dagitim`, `bekleyis`; poz galerisi `a2vurus`, `a2hakem`, `a2kaleci`, `a2bekle2`, `a2dokunus` (34 satır; `sabitY` sıçramayı gösterir).
- *Doğrulama (tohum 3, 180 sn; `animasyon-olcum.py --karsilastir araclar/taban/a2a.json`):* **zamanlama: 10 hakem olayının 10'unda işaret olayla aynı karede başlar; 29 vuruş temasının 29'unda çizimin temas evresi motorun temas karesindedir.** Eylemsiz ölçütler A2a ile aynı (ayak kayması yürüyüş %3,6 → 3,7, depar %9,4 → 8,7; sıçrama üst gövde 7,5 → 7,5, kalça 1,05 → 1,09, kök 0; kırılma üst gövde 10,4 → 11,2; baş gövdeye göre p99 313°/sn; kimlik CV %17,2; bekleyiş ikiz %0,34); süre 0,95 ms/kare (p99 2,7; A2a aynı makinede 0,82–1,01; bütçe 2). Galeride (sayısal): temas karesinde taban–top merkezi 0,17–0,19 m; destek ayağı temastan 0,05–0,13 sn önce basar; sert şutta kök 8 cm kalkar, vuran ayağa temastan 0,32 sn sonra inilir; baraj sıçraması 0,385 m, kalkış temastan 0,06 sn önce; kaleci split-step temastan 0,09 sn önce iner. Motor: oturum sonu (40 maç `--karsilastir araclar/taban/t9a.json --ayni`) 40/40 tohum aynı, 14 senaryo çıkış 0. `ad-denetimi.js` bulgu yok; poz galerisi sayfaları, oda ve maç sayfası hatasız; `akis-deneme.py` 1, 2, 3, 16, 17 geçti.
- *Sınır:* “eylemde > 20° sıçrama” 108 → 171 /eylemli oyuncu·dk: vuruşun diz ve kalça kanalları (gerçek vuruşta diz açısal hızı 1500–2000°/sn, karede 25–33°); eylemsiz ölçütler değişmedi. Dağıtımın hazırlığı gösterilmez (yukarıda). Uzaktan (loca, 20–50 px) okunanlar: gerilme yayı (açılan kol), yüksek takip, hakemin omuz üstüne çıkan kolu, bayrak; kaleci set/split-step ve baraj sıçraması uzak tarafta 3–5 px'lik değişimdir, karşılaştırma sayfasının yakın/orta kamerasında incelenir. Yakın taraftaki yan hakem loca bakışında çoğu zaman rafın altında kalır. Hakem işaret verirken motor onu yürütmeye devam eder (gerçekte de sık görülür). Karşılaştırma sayfasında “farklı kimlik” aynı sahnenin başka tohumla açılmasıdır; galeride vuruş ve barajın ayrı kimlik satırları vardır.

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

**T9a — Sonuç (2026-10-07 gece; ayrıntı YOL_HARITASI T9a; `main`'de).** Aşağıdaki “Top” maddelerinin tamamı `js/mac-motoru.js`'te (`TOP_FIZIK` tablosu): hıza bağlı sürükleme (0,025 → 0,012 /m, geçiş ~14 m/sn); dönüş iki açısal hızla (düşey ve enine; vuruşun `egri`/`ust` girdilerinden, okunur alanlar her adımda yeniden yazılır — vektör gerekmedi, boylamsal bileşenin uçuşta etkisi yok) ve doyan Magnus (C_L = 0,33·S/(S + 0,18)); sekmede e = 0,65 − 0,0105·(vn − 2), sürtünme itkisi ve eğik eksenli yan dönüşün yön değiştirmesi; yerde kayma (μg) → 5/7 hızda yuvarlanma (R + c·v²), R zeminden 1,5 → 0,6; `kosullar = {zemin, islak, ruzgar}` kapısı (varsayılan kuru/rüzgârsız; görünüm §7.8, T10). Planlayıcı `yerHiz`/`yerIlkHiz`/`yerSure` aynı modelle (fizikten ≤ %2,3 sapma). Kabul (`t-top`): falso 3,46 m (2–4), sekme 0,67 m (0,6–0,8), durma 41–63 m zemine göre azalan; 80 maçta gol, şut, pas isabeti ve Brier aynı, pas hızı +1,4 m/sn; hız 35,1 ms / 1000 adım. Sınır: isabet ve kurtarış +3–4 puan (T9b), top ayakta 1,17 sn ve taşıma %21 (sürüş dokunuşu kayan topla; T4). Taban `araclar/taban/t9a.json`.

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

### T11 — Adım evresi (2026-10-07 akşam sıradan çıkarıldı)

Motor adım evresini ve basan ayağı bilir (`p.adimFaz`, `p.basanAyak`); dokunuş ve vuruş oynayan ayak serbestken olur; ters ayaktaki topa vuruş için ayak ayarı süresi doğar; animasyon aynı evreyi okur. Kazancı çoğunlukla dürbünde görünecekti. **2026-10-07 akşam:** dürbün kaldırıldığı için kazancı locadan görünmez; isteğe bağlı olan bu tur sıradan ve “hazır” tanımından çıkarıldı, ileride ayrı karardır.

### Animasyon (her turda, E akışı)

Mevcut iskelet (11 kemik, bacak IK'sı, eylem yuvaları) yeterlidir (2026-10-08 araştırmasıyla doğrulandı: locadan uzuv 2–3 px; ayak, el ve boyun kemiği eklenmez, ayrıntı pozla değil zamanlamayla okutulur). Animasyon her turun ölçütlü bir işidir (2026-10-04, kullanıcı onayı); turun motor işiyle birlikte kapanır, sonraya bırakılmaz.

| Tur | Animasyon işi (ayrıntı Ek G; 2026-10-07 gece genişletildi) |
|---|---|
| T1 | Boşta pozlar ve yürüyüş (yapıldı) |
| T2 | Topu taşıma, bakınma, topu ayağının altında bekletme, sırtı dönükken dönme (yapıldı 2026-10-07: taşıma duruşu, bekletme pozu tabanla topun üstünde, bakınırken baş kalkar, dönüş dokunuşu `sonDokunus.donus`; poz galerisinde üç satır) |
| A2a | Temel sistem: evreli adım döngüleri (yürüyüş/tırıs/koşu/depar, geri ve yana adım; kadans ve adım hızdan, uçuş evresi, yorgun koşu), pelvis/omuz/baş, ivme–fren–viraj, ayak kilidi ve basma adımlı dönüş, ataletli geçiş, bakış zinciri, kimlik, canlı bekleyiş, jest katmanı `p.jest`; karşılaştırma sayfası ve ölçüm aracı (Ek G0, G1, G9) |
| A2b | Tetiği bugün var olan hareketler: vuruş hazırlığı, gerilme ve takip (karşı kolun açılması, iniş sıçraması), uzun topta izleme ve omuz üstünden/yukarı bakış, ilk dokunuş pozları, hakem/yan hakem/4. hakem işaret seti, kaleci set duruşu ve split-step, dağıtım görünüşü, baraj zıplaması, eller dizde/belde ve esneme, kenar bekleyişleri (Ek G2, G3, G5, G6, G7 “A2b” maddeleri) — uygulandı 2026-10-08 (“A2b — Sonuç”; kullanıcı incelemesi bekliyor) |
| T4 | Çalım hareketlerinin ayak yolları (IK hedefi topun çevresinde; makas, çekme, içe kesme); yutan savunmacının yanlış yöne adımı; top saklarken gövdeyi araya koyma; pas, ara pası ve ilk dokunuş hazırlıkları, taşımada dokunuş sıklığı (2,3–3,0/sn) ve bakınma; açık beden ve yüzey seçimi; makas ≈ 0,45 sn, rulet 2 × 0,4 sn (Ek G2; vuruş hazırlığı A2b'de) |
| T5 | Önden blok, şut bloğuna atlama, takılıp düşme (aktif ragdoll) ve yerden kalkma; omuz omuza itişme ve forma çekme (kol IK'sı); dönen topa hamle; faul tepkileri; tökezleme adımları (1–3), gerçek kalkış süresi (sırtüstünden 1,5–3 sn, yandan 1–1,5 sn; motor `kalkis.sure`), verlet mini ragdoll, simülasyon pozu (okçu yayı), arkadaşın yerden kaldırması (Ek G4) |
| T6 | Yer kapma (kolla itişme, tutma), birlikte sıçrama ve havada çarpışma, iniş; kafa vuruşu türleri (sıçrama 0,40–0,45 m, tepeye 0,3 sn, gövde yay → öne kırılma, plonjon); kalecinin orta tutuşu (tek ayak sıçrama, serbest diz, en yüksek nokta) ve yumruklaması (Ek G4, G6) |
| T7 | Jestler: pas isteme, ofsayt için el kaldırma, işaret, kaçan golde başını tutma; topsuz koşu başlangıcı; savunma kayma adımı, geri koşu ve jokey duruşu; pres koşusu; jestler `p.jest` ile (A2a katmanı); uzun topta geri koşu → dönüş eşiği (motor); koşu başlangıcı kol işaretiyle, çift hareket, hattın birlikte çıkışı (Ek G3) |
| T8 | Duran top hazırlıkları: top yerleştirme, geri adımlar, bakış ve el kaldırma, korner/serbest vuruş koşusu, baraj ve zıplama, perdeleme ve itişme, taç atışı (uzun taçta 3–5 adım koşu ve gerilme), kale vuruşu, penaltı (duraklı koşu, kalecinin çizgi hareketi); hakemin 9,15 m adımlaması; baraj zıplaması A2b'de yapılmış olur (Ek G5) |
| T9b | Vuruş hazırlıkları ve takipleri: sert, plase, falso, aşırtma, vole; uzun topta ve yön değiştirmede gerilme; kötü vuruş (ıska, topun altına girme, üstüne vurma); kaleci dalışının üç evresi (yana adım, uzak ve yakın bacak itişi; ≈ 1,0 sn + 0,2 sn tepki), çökme dalışı, 1v1 K-blok / yıldız, dağıtım türleri (motor); set duruşu A2b'de (Ek G2, G6) |
| T10 | Sakatlık (kramp, topallama 0,6–0,7 basma oranı, sedye, ≈ 90 sn durma), tedavi; hakem kişiliği ve yorgunluğu, endirekt işaret; kenar prosedürleri (değişiklik ≈ 45 sn, sağlıkçı, ısınan yedekler, hoca); sevinç çeşitleri (gol → santra 60–90 sn), tepki ve beden dili; dönem işaretleri (§7.6, Ek G10) (Ek G7, G8) |

**Kabul ölçütleri (eşikler TEST başlangıç değeridir; ilk ölçümde gözden geçirilir).** Ölçüm `araclar/poz-galerisi.html` ve `an-yakala.py` ile yapılır.
- **Galeri satırı.** Her yeni hareketin poz galerisinde zaman sıralı bir satırı vardır; sayfa hatasız açılır.
- **İki kişilik temas.** Temas pozları (omuz, tutma, birlikte sıçrama, müdahale ve takılma, top saklama) galeride iki oyunculu sahneyle gösterilir. Temas karesinde temas eden noktalar (el–gövde, omuz–omuz, ayak–top, ayak–ayak) arasındaki açıklık en çok 0,15 m; gövde kutuları en çok 0,05 m iç içe girer. Galeri bu iki değeri satırın yanına yazar.
- **Geçiş.** Bir pozdan ötekine geçerken hiçbir eklem açısı 60 Hz'de kare başına 20°'den fazla değişmez (poz atlamaz); düşüşten kalkışa, temastan koşuya geçişler dahil. A2 hedefi temas kareleri dışında 10° ve SPARC düzgünlüğü (Ek G9).
- **Ayak.** Yerdeki ayağın kayması adım başına en çok 0,10 m (MA1'in ölçüsü korunur); A2'den sonra Ek G9 tablosu geçerlidir (kayma oranı ≤ %5 yürüyüş/koşu, ≤ %15 depar; adım başına ≤ 0,03 / 0,08 m; bugün düz yolda 0,006 m).
- **Zamanlama.** Temas karesi, motorun temas anından en çok bir kare sapar; çizim motora yazmaz (`ad-denetimi.js`).
- **Uzaktan okunurluk.** Başkanın loca bakışında (film şeridi; dürbün yok) hareketin ne olduğu ayırt edilir; bu, kullanıcı incelemesiyle onaylanır (§4 girişi).

**Sınır.** Kodla üretilen pozlar loca mesafesinde retro üslupla canlı ve okunur olmayı hedefler; yakın plan yayın kamerasında elle ya da hareket yakalamayla üretilmiş animasyonun inceliği hedef değildir. Daha yüksek tavan dış veri gerektirir ve ayrı karardır (CLAUDE.md: harici model ve veri kullanımı).

---

## 5. Sıra, bağımlılık ve büyüklük

| Tur | Bağımlı olduğu | Büyüklük | Uzaktan görünür kazanç |
|---|---|---|---|
| T0 Ölçü | — | küçük | — |
| T1 Hareket | T0 | büyük | çok yüksek |
| M0 Araç ve hız (2026-10-07) | T1 | küçük | — (test süresi) |
| T2 Topla oyun | T0, T1, M0 | büyük | çok yüksek |
| T3 Profil kapısı | T0 | küçük (2026-10-07'de daraltıldı) | orta |
| A2 Animasyon temeli ve hareket dili (2026-10-07 gece; A2a temel + A2b tetiği hazır hareketler, 2026-10-08) | T1, T3 | büyük (2–3 oturum) | çok yüksek (robot hissinin kalan kaynağı) |
| T9a Top fiziği | T0 | orta | yüksek (uçuş, sekme) |
| T4 Bire bir | T2, T3 | büyük | yüksek |
| T5 Temas | T4 | büyük | orta–yüksek |
| T6 Hava topu | T5 | orta | orta |
| T7 Takım zekâsı | T2, T3 | büyük | çok yüksek |
| T8 Duran toplar | T3 | orta | yüksek |
| T9b Vuruş | T2, T9a | küçük | orta |
| T10 Olaylar | T5 | orta | yüksek (seyrek) |
| T11 Adım evresi (2026-10-07 akşam sıradan çıkarıldı) | T4 | orta | — (dürbünsüz görünmez) |

Önerilen sıra (2026-10-03) T0 → T1 → T2 → T3 → T4 → T5 → T7 → T8 → T6 → T9 → T10 → T11 idi. **Sıra (2026-10-07): M0 → T2 → T3 → T9a → A2 → T4 → T5 → T7 → T8 → T6 → T9b → T10** (T11 aynı gün akşam sıradan çıkarıldı; A2 aynı gece eklendi). T8 diğerlerinden bağımsızdır; ayrı oturumda paralel yürüyebilir. Bitirme planı (2026-10-07 akşam, kullanıcı onayı): tur başına dal, üç kademeli kontrol, kapanışta loca bakışıyla önce/sonra film şeridi ve karşılaştırma sayfası; büyüklükler kabaca T3 ½–1, T9a ½–1, A2 2–3 (A2a 1–1½ + A2b 1–1½; 2026-10-08 genişlemesi), T4 1–1½, T5 1–1½, T7 1½–2, T8 1, T6 ½, T9b ½, T10 1 oturum (Ek G'nin tur başına animasyon işi her tura yaklaşık yarım oturum ekler) (M0+T2 = 1 oturum ölçeğinde); pas isabeti tavanı T7 sonunda, kurtarış oranı T9b sonunda hedef tablosunda gözden geçirilir; §7.6 ve §7.8 T10 başında sorulur.

**Hazır tanımı (2026-10-07).** Motor “hazır” sayılır ve kullanıcı “tamam” diyebilir: 80 maçta robotluk karnesinin bütün T-hedefleri ve gerçek değerlere çekilmiş hedef tablosu tutuyor; `araclar/senaryolar/` içindeki bütün senaryolar geçiyor; tek işçide 1000 adım ≤250 ms; kullanıcı her turun önce/sonra film şeridini (loca bakışı; dürbün yok) ve karşılaştırma sayfasındaki hareketleri onaylamış; A2'nin animasyon ölçütleri (Ek G9) tutuyor. Kabiliyet ekonomisi (veritabanı), mocap eğrileri (§7.9) ve T11 bu tanımın dışındadır.

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
- Yeni her hareket karşılaştırma sayfasında aynı sahnede önce/sonra ve farklı kimlikle gösterilir (2026-10-07 gece, kullanıcı kararı; kalıp `prototipler/9-a2-yuruyus.html`); hareket motor durumundan tetiklenir, motora yazmaz, pozlar kodla üretilir.
- A2'de (A2a ve A2b) motora yalnız sonucu değiştirmeyen okunur alan eklenir (T1'deki `p.kip` gibi); `--ayni` 80/80 kabul koşuludur. Bir hareket, tetiğini motor bugün üretiyorsa A2b'de, üretmiyorsa tetiği doğuran turda yapılır (Ek G tur etiketleri); sayısal ölçütler Ek G9 tablosundadır (2026-10-08).

---

## 7. Kullanıcının karar vermesi gerekenler

1. **Maçın temposu.** Daha az, daha uzun ve amaçlı atak (öneri) mı, bugünkü sık top kaybı mı? Hedef tabloyu etkiler: pas isabeti üst sınırı (%80), top kaybı sayısı. **Karar (kullanıcı, 2026-10-04): amaçlı atak** — daha az ama daha uzun, amaçlı ataklar; T2'nin kabul hedefleri (sahiplik başına 2,5–4 pas, top ayakta 1,2–2 sn, taşıma payı) bu yöndedir; pas isabeti %80 tavanını aşarsa tavan T2'de gözden geçirilir.
2. **Yürüme oranı hedefi.** Önerilen ara hedef %40; gerçek %61.
3. **Özellik listesi.** Alt özellikler türetilsin (öneri) mi, kadro verisine yeni özellik eklensin mi? **Karar (Claude, 2026-10-07; motor kararları kullanıcı tarafından devredildi): türetilir; kadro verisine özellik eklenmez. Kabiliyet ekonomisi ileride veritabanıyla gelir, T3 yalnız kapıdır.**
4. **Çekirdek dosyaların açılması ve yeni dosyalar.** `mac-dizilis.js`, `mac-kurallar.js`, `mac-motoru.js` (top fiziği); yeni `mac-profil.js`, `mac-takim.js`, `mac-durantop.js`. **Karar (Claude, 2026-10-07): açılır; üç yeni dosya gelir, `index.html` sırası ve `ad-denetimi.js` ile.**
5. **Duran top süresi.** Tehlikeli duran toplarda hazırlığın 10–14 saniyeye uzaması. **Karar (Claude, 2026-10-07): 10–14 sn; N10 sonrası ölçülen ortanca 12,5 sn zaten aralıkta, T8 yalnız “görevliler yerinde ya da azami süre” koşulunu kurar.**
6. **Sakatlık sıklığı ve değişiklik hakkı.** Gerçekte maç başına yaklaşık bir süre kayıplı sakatlık olur. Motor bugün 5 değişikliğe izin veriyor ([js/mac-kurallar.js:26](js/mac-kurallar.js)); dönem kuralı kararı. **Oyun kuralıdır; T10'da kullanıcıya sorulur.** Öneri: maç başına ~0,3 tedavi gerektiren sakatlık, 5 değişiklik (günümüz kuralı). **2026-10-08 eki (aynı soruda; Ek G10):** dönem kuralları ve işaretleri birlikte sorulur — 3 ya da 5 değişiklik ve aynı anda ısınan yedek sayısı; çıkan oyuncunun orta çizgiden mi (1999 geleneği) en yakın çizgiden mi (2019) çıkışı; iki kollu / tek kollu avantaj; VAR, sprey, kale çizgisi teknolojisi, 8 saniye sayımı, yatan barajcı, barajdan 1 m, hocaya kart, forma çıkarmaya sarı, yalnız kaptan protokolü, çoklu top ve koniler, kale vuruşunun ceza sahasını terk etmesi, her yöne santra. Varsayılan (karar gelene dek): motorun bugünkü kuralları (5 değişiklik, her yöne santra, kale vuruşu sahada oynanabilir) + görünüşte 1999 biçimleri (iki kollu avantaj; VAR, sprey, 8 sn, yatan barajcı yok; çıkan oyuncu orta çizgiden).
7. **Kurtarış oranı (~%50).** Bu turlarla düzelmez; şut hedefinin yeniden ele alınmasını gerektirir. **Karar (Claude, 2026-10-07; aynı gün T2 sırasında düzeltildi):** ilk verilen "toplam şut 18–28, gol 2–3,2, kurtarış %65–75" 10 dakikalık maçla çelişir: top ~420 sn oyunda, amaçlı atakta ~45 sahiplik olur; 18–28 şut için sahipliklerin yarısı şutla bitmeli (gerçekte ~%10–12). **Şut 8–14 ve gol 1,8–3,0 kalır** (maç 90 dakikanın özetidir: önemli olaylar gerçeğin dakika başına 2,5–3 katı). Kurtarış oranı şutun kalitesinin sonucudur, bilgi satırı olarak izlenir (gerçekte ceza sahası içi isabetli şutta %55–65, dışarıdan %75–85); T2 sonunda %55,6. T7 ve T9b sonunda yeniden ele alınır.
8. **Hava koşulları ve görünümü.** Yağmur ve rüzgâr maçta gösterilecek mi? **Görünüm kararıdır; T10'da kullanıcıya sorulur.** T9a yalnız motor kapısını (`kosullar`) kurar, varsayılan kuru ve rüzgârsızdır.
9. **Hareket verisi (mocap eğrileri; 2026-10-07 gece).** Kodla üretilen pozların tavanı sınırlıdır: '99 dönemi oyunların doğal hareketi düşük poligonla ama hareket yakalamadan türetilmiş anahtar karelerle geldi. Kamu malı / CC0 hareket yakalama verisinden (ör. CMU veritabanı) türetilmiş eklem açısı eğrileri sayı tablosu olarak koda gömülebilir (model, doku ya da fotoğraf değil; retro görünüm aynı kalır). CLAUDE.md'deki harici veri kuralına girer; **açık karar, kullanıcıya sorulur.** Öneri: A2 veri olmadan yapılır, karşılaştırma sayfasında fark yetmezse bu seçenek açılır. **Araştırma notu (2026-10-08):** Overgrowth 13 anahtar kare ve prosedürel ara değerle akıcı hareket aldı; Sensible Soccer 12 piksellik figürü 3 kareyle okutuyordu; Actua Soccer 3 (1998) ~200 hareket kullanıyordu — locadan 20–40 ayrı eylem yeter. Öneri korunur ve güçlenir: A2 verisiz yapılır; karşılaştırma sayfasında fark yetmezse CC0 eğriler (CMU) açılır. Overgrowth'un kaynak kodu (Apache 2.0) yalnız yöntem için okunabilir; veri ya da model değildir.

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

**Uygulama (T3, 2026-10-07):** `js/mac-profil.js` `PRF_ALT` bu tabloyu veri olarak tutar (çeviklik `hrkCeviklik` ile aynı, sapmasız; kütle01 = (kütle − 55)/45). Ek B'ye `topuSurer` eğilimi eklendi (sürüş 0,6, çabukluk 0,2, pas −0,2; taşıma kararı ve çalım sıklığı); `uzaktanVurur` tabanı şut 0,3 + şut gücü 0,3'tür ve rol belirler (iki yönlü +0,5, içe kat eden +0,4, hedef forvet −0,3, fırsatçı −0,4). Roller: KL çizgi kalecisi / süpürücü; stoper sert / oyun kuran; bek savunmacı / bindiren; merkez kesici / oyun kurucu / iki yönlü; kanat çizgi / içe kat eden / oyun kuran; FV hedef / fırsatçı / derine gelen. Eğilim = clamp(3·Σ w·(değer − 0,5) + rolün varsayılanı, −1, 1).

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

## Ek G — Hareket dili: animasyon programı (2026-10-07 gece, kullanıcı kararı; 2026-10-08'de araştırmayla genişletildi)

Amaç: gerçek futbolcunun, kalecinin, hakemin ve kenardakilerin yaptığı her görünür hareketin oyunda bir karşılığı olsun; hepsi kodla üretilir, motorun durumundan tetiklenir (çizim motora yazmaz), locadan okunur, kimlikle çeşitlenir. 2026-10-08'de kullanıcı isteğiyle kapsam “bütün olasılıklar” için araştırıldı: saha oyuncusu biyomekaniği ve maç analizi, kaleci tekniği, IFAB kuralları ve hakem/yan hakem/4. hakem prosedürleri, kenar ve duruş davranışları, prosedürel animasyon teknikleri ve 1999 oyunlarının gerçekte gösterdikleri (kaynaklar belgenin sonunda “Kaynaklar — Ek G”). Her madde **tetik** (motor alanı/olayı) → **hareket** (ne görünür) → **ölçüt** düzenindedir ve bir **tur etiketi** taşır: **A2a** (temel sistem), **A2b** (tetiği bugün var olan hareketler), T4–T10 (tetiği o turda doğan hareketler), **§7.6** (dönem kararına bağlı). Yeni her hareket karşılaştırma sayfasında önce/sonra ve farklı kimlikle gösterilir (G9). Sayılar araştırmadan gelen gerçek değerlerdir; kabul eşikleri TEST başlangıç değeridir ve ilk ölçümde gözden geçirilir.

**Okunurluk çerçevesi (ölçülü, 2026-10-08).** Locadan oyuncu boyu ortanca 41–51 px, uzak tarafta ~20 px; uzuv genişliği 2–3 px; top 6–8 px. Bu uzaklıkta okunan: duruş durumu (ayakta / çömelmiş / sıçramış / yerde), kadans ve kol genliği (yürüyüş–koşu–depar), eğilmenin yönü ve açısı, omuz çizgisinin üstüne çıkan kol, bacak salınımının yüksekliği, ≥ 60° ve ≥ 0,2 sn tutulan baş dönüşü, iki bedenin birbirine yaslanması, koşunun biçimi (düz / eğri / dur-kalk). Okunmayan: ayağın hangi yüzeyinin kullanıldığı, parmak, göz, 30°'den küçük baş dönüşü, eldiven biçimi, bağcık. Kural: okunmayan tek pozla ya da hiç; okunan abartılır (baş dönüşü, kol genliği, gerilme) ama **zamanlama gerçek kalır** — ritim (kadans, duraklama, patlama) her uzaklıkta okunur; Sensible Soccer 12 piksellik figürü üç kareyle okutuyordu, Actua Soccer 3 (1998) ~200 hareketle övünüyordu; locadan 20–40 ayrı eylem yeter, binlerce değil.

**Ortak ilkeler**
- **Hazırlık → vuruş → takip → toparlanma:** hiçbir vuruş tek karede olmaz; hazırlık süresi motorun karar ve vuruş süresinden okunur (B akışı `vurus` evreleri), takipte denge adımı; temas tek karedir, top temastan bir kare sonra ayrılır.
- **Bakış niyeti önceler:** baş gövdeyi ~200 ms önceler (dönüşte bakış 400 ms, baş 200 ms önden); pas vermeden önce alıcıya bakış, aldatmada ters bakış (profil: yaratıcılık); şutta kaleye kısa bakış; baş–gövde dönüşü 70–80°'yi aşmaz, ötesini gövde alır.
- **Ağırlık ve temas:** destek ayağı topun yanında basar (≈ 30 cm yanda, 10 cm geride), gövde ağırlığı destek ayağında; iki bedenli hareketlerde temas noktaları IK ile buluşur (≤ 0,15 m).
- **Kimlik:** adım, duruş, kol, vuruş stili tercihi (iç/dış/üst), sevinç ve itiraz tarzı profilden; yorgunluk görünür. İnsan yürüyüşten kişiyi, cinsiyeti, kiloyu ve ruh hâlini okur; farklılık klip değil parametredir.
- **Tek poz, ataletli geçiş:** her aktör karede tek poz değerlendirir; her değişim (kip, eylem, kilit, kalkış) hız sürekliliğiyle hedefe gider; çapraz karışım yoktur.
- **Motor sınırı:** A2'de motora yalnız sonucu değiştirmeyen okunur alan eklenir (`--ayni` 80/80); tetiği olmayan hareket, tetiği doğuran turun motor işiyle birlikte gelir.
- **Ölçüm:** G9 tablosu; galeri satırı, geçiş sınırı, ayak kayması, temas açıklığı, zamanlama (TEKNIK_PLAN §8 sözleşmesi, §4 “Animasyon” kabulü).

### G0 — Temel sistem (A2a)
1. **Evreli döngü.** Aktör başına tek evre değişkeni (0–2π, ayak basışlarına bağlı); hız → kadans ve adım boyu: yürüyüşte adım ≈ 0,75·(v/1,25)^0,42 m, 96–134 adım/dk (rahat yürüyüş 1,3 m/sn, 115 adım/dk, 0,68 m); koşuya geçiş Froude 0,5 ≈ 2,0–2,1 m/sn (bacak 0,9 m); 2,5–4 m/sn'de 150–180 adım/dk; 5,1 m/sn'de ≈ 2,9 adım/sn ve 1,8 m (temas ≈ 0,19 sn, uçuş ≈ 0,16 sn); 7,3 m/sn'de ≈ 3,9 adım/sn ve 1,9 m (temas ≈ 0,13 sn); tepe hız yaklaştıkça adım uzamaz, kadans artar; **geri koşu** ileri tepe hızın en çok %70'i (5,1'e 7,3 m/sn), 4,1 adım/sn, 1,23 m adım, temas %18 daha uzun, eklem açıları küçük, gövde dik; **yana kayma** 1,6–2,0 m/sn, ayaklar çaprazlanmaz, çapraz adım daha hareketli. Döngü dört anahtar pozdan (geçiş ve uzanma, iki yan; Overgrowth'un 13 kare ilkesi) açısal ara değerle (kemik dönüşleri kalçadan dışa yayılır, konum karışımı yok). Kol bacakla ters fazda; 0,8 m/sn altında kol 2:1, üstünde 1:1; yürüyüşte omuz genliği ~25°, koşuda dirsek 90°'ye kapanır ve itiş artar; uçuş evresi yalnız koşuda (destek payı 5 m/sn'de %26–27); dikey bob yürüyüşte ~3–4 cm, koşuda daha çok; pelvis yana salınır, kalça–omuz ters burulur. `p.kip` döngüyü seçer, hız eğrileri karıştırır. **Yorgunluk** (`p.enerji`): tekrarlı deparda temas %13 uzar, kadans %7 düşer, dikey yaylanma düşer ve bob artar, adım boyu aynı — geç maç koşusu “ağır” görünür.
2. **İvme, fren, viraj.** Hızlanırken öne eğilme tanθ ≈ a/g (3 m/sn² → 17°, 5 → 27°; ilk adımlarda 40–50°'ye dek, sekizinci adımda 5–10°; omuzlar kalçaya ters döner); **fren** ayak kütle merkezinin önünde, kalça alçalır, gövde geriye, kısa kesik adımlar, kollar açık; sert frenler sert ivmelenmelerden çok (maçta oyuncu başına 51–65 sert fren, 27–35 sert ivmelenme; bek ve forvetlerde en çok); **viraj** içe yatış tanθ = v²/(r·g) (4 m/sn, 4 m → 22°; 6 m/sn, 5 m → 36°), iç kol alçak, iç bacak kalçadan daha çok çalışır; tepe hızlı eylemlerin ~%85'i eğri koşudur.
3. **Ayak kilidi ve basma adımlı dönüş.** Yerdeki ayak sıfır hızla dünyaya kilitli (bugünkü çivileme), kilit sapma eşiğinde açılır ve açma/kapama da ataletlidir (ölçüt: ayak 0,05 m'nin altındayken hızı 0,2 m/sn'yi aşarsa kaymadır). Dönüş açıya göre: ≤ 45° yalnız yatış ve kalça gecikmesi (tek basma, temas ≈ 0,15 sn); 60–135° sondan bir önceki adım fren adımı (temas 0,18–0,23 sn), gövde öne %56'ya dek eğilir ve yana yatar, dış ayak basar iç ayak döner; 180° iki–üç adım, uzun basma 0,30–0,33 sn, gövde alçalır, kol savrulur; durarak dönüşte baş önce, ayaklar 2–3 evre tıkıyla (yerinde kayarak dönüş kalkar); savunmacının **düşme adımı** (arka ayak geri/açılır, kalça döner). Sıklık gerçek: oyuncu başına maçta ~700 dönüş (~600'ü 0–90°, ~100'ü 90–180°); dönüş yönü değişiminin öncüsü kalça değil baştır (G0.5).
4. **Ataletli geçiş.** Bütün kanallar ve yuva değişimleri hedefe hız sürekliliğiyle: kritik sönümlü yay (yarı ömürle; kare hızından bağımsız) ya da poz ve hız farkını eşleyen beşinci derece eğri (Bollo); kip/yön değişiminde 0,15–0,25 sn, topla temas eylemlerinde 0,08–0,12 sn, bekleyişten bekleyişe 0,3–0,5 sn; hedefe “1,5× süre içinde” varılması tamamlanma denetimidir; aniden beliren yakın hedefte ivme sınırı (0,1 m'lik fark için süre ≥ 0,15 sn). Yuva ağırlıklarının bugünkü doğrusal hız sınırı yerine geçer; karede tek poz değerlendirmesi (çift akış yok).
5. **Bakış zinciri.** Hedef → baş (öncü, ~200 ms) → gövde (gecikmeli) → kalça (hız yönü); baş–gövde yaw ≤ 80° (yumuşak 70°), pitch ±45°; üstel takip hızı 3–15 (donuk–çevik; profil); 90° yeniden hedefleme ≥ 0,25 sn; omuz üstünden bakışta gövde 90°'ye dek döner; yüksek topa baş kalkar, yakın topa iner (bugün var); dönüşe başlarken baş yeni yöne kalçadan ≥ 150 ms önce varır.
6. **Kimlik.** `p.profil` (boy, yapı, çabukluk, çalışkanlık, rol, agresiflik) ve ad özetinden sabit parametreler: adım boyu/kadans oranı (±%10), kol genliği (±%25), dirsek açısı, bob, duruş eğimi, koşu stili (uzun adımlı / çabuk), bekleyiş tarzı (eller belde / gevşek / dizlerde), nefes temposu, evre ve kıpırtı sayaçlarının kayması; yorgunlukla değişir; kaleci, hakem ve top toplayıcı kendi kümelerinde. Aynı hızda iki oyuncu ölçülebilir biçimde farklı yürür (G9).
7. **Bekleyiş ve düşük efor.** Nefes 15–20/dk (tetikte 20–25), göğüs 1–2 cm; ağırlık aktarımı 4–8 sn'de bir; küçük kıpırtı 30–60 sn'de bir (çorap/tekmelik düzeltme, eldiven, bakınma, el bele); **eller dizlerde** efor sonrası toparlanma duruşudur (eller başta değil), `enerji` düşükken ve son 10 sn'de yüksek efordan sonra; eller belde ayakta sürümü; sakin yürüyüş; dinlenme: amaçlı hareket maç süresinin ~%41'i, hareket bölümü ortalama 13 sn, arası 20 sn; aktör başına evre kayması ve tempo çarpanı (iki aktör aynı nefes fazında olmaz); kaleci (çizgide ağırlık aktarımı, eldiven düzeltme, direğe dokunma), hakem (eller arkada, saat kontrolü), top toplayıcı (çömelme, topu kucakta tutma), yedekler (oturma, ayağa kalkma, ısınma) için ayrı kümeler.
8. **Jest katmanı.** Bacaktan bağımsız üst gövde pozları: kol tam kaldırma (170°; ofsayt, top isteme), işaret (kol 90°, ön kol uzatılmış, gövde hedefe döner), avuç açık itiraz (kollar açık, avuçlar yukarı), alkış (eller göğüs üstünde), el ağızda çağırma, eller başta, baş ellerde; sözleşme alanı `p.jest {tur, t, sure, hedef}` (A2a'da alan ve çizim; yazan motor işi: T7 topsuz koşu ve savunma işaretleri, T10 tepkiler; hakem işaretleri A2b'de bu katmanla). Uzaktan yalnız omuz üstüne çıkan kol ve uzatılmış kol okunur; ≥ 1 sn tutulur.
9. **Düşüş ve kalkış zamanlaması (çizim tarafı).** Bugünkü düşüş 0,45 sn gerçek aralıkta (0,4–0,6 sn; kütle merkezi 1 m'den 0,45 sn'de iner; önce eller/ön kollar, sonra kalça); kalkış motorda 0,6 sn, gerçekte sırtüstünden 1,5–3 sn (yana dön → el/diz → ayak basar → kalk), elle basılı yan yatıştan 1–1,5 sn, kaleci 0,5–1 sn — motor `kalkis.sure` T5'te uzatılır; A2a yalnız geçişleri ataletli yapar ve yerde yatışa küçük hareket (nefes, baş) ekler. Yerde kalanın **arkadaşının gelip elinden tutup kaldırması** T5 (iki bedenli).
10. **Hız bütçesi ve seviye.** Aktör başına tek poz değerlendirmesi; 60 aktörde ≤ 2 ms/kare (bugün 1,02 ms; ölçüm başsız yazılım GPU'da `poz-galerisi?sayfa=olcum`), aktör başına ortanca ≤ 33 µs, p99 ≤ 80 µs; `kucukPiksel` altındaki aktörde baş/jest/nefes katmanı atlanır (bugün var); bütçe aşılırsa topa 25 m'den uzak aktörler 30 Hz güncellenip ara değerlenir. Atlanan yöntemler (gerekçeyle): hareket eşleme (veri ister; az pozla durum makinesine düşer), PFNN/ML, Euphoria tarzı aktif ragdoll (kontrol ve maliyet), kumaş/saç, parmak/yüz/göz, tam gövde IK çözücü.

### G1 — Yürüyüş, koşu ve beden (A2a)
G0 maddeleri 1–7. Koşu türleri: yer tutma tırısı (gövde dik, kısa adım), hücum koşusu (öne eğik, kol itişi), savunma geri koşusu (geri geri; hız 3,5–4 m/sn'yi ya da gerekli mesafe birkaç metreyi aşınca dönüp koşma), kaleciye dönüş yürüyüşü (ağır), depar (yüksek diz, 90° kol, gövde öne, ilk 5 m'de en büyük hız kazancı), toparlanma koşusu (depar duruşu, baş topa dönük), eğri koşu (G0.2), dur-kalk ve sekme adımları (kesme ve penaltı öncesi kısa hızlı adımlar). Hız bölgeleri (gerçek): yürüyüş 0–7 km/sa, tırıs 7–15, koşu 15–20, yüksek tempo 20–25, depar 25–30, tepe > 30 (maç tepe hızı ~33 km/sa, dünya sınıfı ~37,5); oyuncu başına maçta 16–17 depar (~213 m), ortalama depar 2,3 sn / 15 m; amaçlı hareketin %49'u dik ileri, %21'i yerinde (durma, yerinde dönme), %6'sı çapraz/eğri; savunmacılar en çok geri ve yan hareket yapar. Dinlenme: eller belde, gevşek duruş, dizlere dayanma (G0.7). **Ölçüt:** G9 (kadans bantları, uçuş evresi, ayak kayması, dönüşte basma adımı, kimlik, düzgünlük).

### G2 — Topla oyun: vuruş, ilk dokunuş, taşıma, bakınma
- **Vuruş evreleri (A2b çizim; kötü vuruş ve güç–isabet T9b).** Tetik `vurus` (`faz` geri/takip, `ft`, `geri`, `stil`, `guc`, `tekDokunus`, pas uzunluğu). Yaklaşma 3–5 adım ve 30–45° açı (sert vuruşta ayar adımları); destek ayağı topun ≈ 30 cm yanına, 10 cm gerisine basar ve kilitlenir; geri salınımda kalça 29° geriye, diz 90–110° bükük (döngünün %64'ünde), gövde vuruş tarafının tersine burulur ve **karşı kol açılıp geriye uzar (“gerilme yayı”; uzaktan en okunur vuruş ipucu)**; ileri salınım 100–150 ms, basmadan temasa 0,3–0,4 sn (sert), kısa pasta ≤ 0,25 sn; temas tek kare (gerçekte 9–16 ms), top bir kare sonra ayrılır; takip 0,2–0,3 sn, sert vuruşta vuruş ayağına **iniş sıçraması** ve bir denge adımı; uzun top ve yön değiştirmede **gerilme**: iki ayar adımı, geniş basış, gövde geriye, ayak topun altına, kalçadan geniş salınım, yüksek takip (hazırlık ≥ 0,4 sn, salınım açısı kısanın ≥ 2 katı). Stiller: iç ayak pas (kısa düz yaklaşma, ayak dik, dar takip, gövde alıcıya), sert üst (uzun salınım, destek ayağı sabit, gövde topun üstüne, baş aşağı), plase (kısa salınım, dik gövde, düşük ayak hızı), uzun/asma orta (gövde geriye, yüksek takip, iniş sıçraması), falso (geniş yaklaşma, ayak topu sarar, takip çapraz), aşırtma (dizi kapalı kısa saplama, bacak alçakta durur), vole / yarım vole (diz daha kapalı, kalça dönüşü ve gövde yatışı top yüksekliğiyle; destek parmak ucunda), dış ayak (ayak gövdeyi çaprazlar, burun içe), topuk (kalça geriye, diz bükük), burun (salınımsız düz bacak jabı; en hızlı), zayıf ayak (profil `zayifAyak`: çarpık gövde, dar salınım), tek vuruş (hazırlık 0,6×), baskıda acele (kısa, dik), kesme orta (kısa salınım) / asma (uzun, dik). Ara pasında kısa hazırlık, boşluğa bakış, bir önceki karede omuz aldatması (profil `oldurucuPas`). Kötü vuruş (T9b): ıska, topun altına girme (ayak çimi kazır), üstüne vurma, ayağın kenarından kaçma. **Ölçüt:** evre süreleri motorun `vurus` süreleriyle aynı; stil–poz eşleşmesi galeri satırında; uzun topta gerilme ve karşı kolun açılması görünür; top ayrılma karesi = temas + 1.
- **İlk dokunuş (pozların ataletli sürümü A2b; motor yüzey seçimi ve açık beden T4).** Tetik `kontrol` + `yuzey`, `yon`, `sonDokunus`. Açık beden: pas çizgisine 45° dönük kalça/gövde, top gelmeden omuz kontrolü (G2 bakınma), ilk dokunuş iç ayakla boşluğa, ikinci dokunuş oyun; iç ayak yumuşatma (diz dışa, ayak temasta geri çekilir), dış ayak yönlü, taban durdurma (ayak topun üstünde), uyluk (yatay kalkar, temasta düşer; forvetler en çok göğüs ve uyluk kullanır), göğüs (havadan gelene 10–20° geriye yatış, dirsekler dışarıda eller göğüsten uzak, temasta göğüs geri çekilir; seken topa belden öne eğilme), kafayla indirme (G4 kafa geometrisi, yumuşak boyun); kontrol sonrası ilk adım yöne; **la pausa** ≥ 0,5–1 sn hareketsiz top, dik gövde, baş yukarıda bakınarak (T2 `bekle` var). Koşarken havadan gelen uzun topu alma: omuz üstünden bakış (baş 90°+, gövde döner), koşu bozulmaz, göğüs/uyluk/ayakla kontrol.
- **Bakınma (A2a zincir; sıklık motor T2).** Gerçek: 0,44 ± 0,30 bakış/sn ve 3 bakış/sahiplik; orta saha en çok, forvet en az; pastan önce 0,45/sn, şuttan önce 0,27/sn, son saniyede 1,4 baş dönüşü/sn; rakip 0–1 m'deyse düşer, 4 m'ye dek artar; çok bakanlar daha çok döner ve ileri pas verir. Çizim abartır: baş ≥ 60°, ≥ 0,2 sn; sırtı dönükken omuz üstünden.
- **Taşıma ve çalım (T4; dokunuş sıklığı A2b).** Dokunuş sıklığı hızlı sürücüde 3,0/sn, yavaşta 2,3/sn (yürürken her adım, koşarken 2–3 adımda bir); kalça alçak (5–10 cm), adım 0,6–0,8 m, topa bakış ile önüne bakışın değişimi; hız değiştirme adımı; makas ≈ 0,45 sn (çift makas 0,9 sn; ayak topun üstünden silüetin dışına, ≥ 0,4 m yana abartılır), gövde çalımı (omuz/kalça düşmesi, dokunmadan), Cruyff (şut/pas aldatması, destek ayağı topun önüne, iç ayakla destek bacağının arkasına çekiş, ters yöne patlama), topu çekme (taban, geri, dönüş), içe/dışa kesme (keskin kısa itme), sırtla dönme, rulet (iki taban dokunuşu, iki kez 180° kalça dönüşü, her biri ≈ 0,4 sn), bacak arası, top-at-koş (3–5 m itme sonra depar), şut çalımı (hazırlık iptal, yana dokunuş). Yutan savunmacı: ağırlık aldatmaya kayar (kalça yana), geç çapraz adım ya da düşme adımı; taban dışına yüklenirse düşer (G4 tökezleme). Topla koşu topsuzdan ~%10 yavaş (ölçüm boşluğu, TEST).
- **Top saklama (T4).** Tetik `koru`: gövde yan, dizler bükük, geniş duruş, yakın kol rakibi tutar (itmez; tutma faul), uzak kol denge, top uzak ayakta ve taban/iç/dışla hareket hâlinde, baş ikisini görür; çıkış uzak boşluğa pivotla.
**Ölçüt:** vuruş evrelerinin süresi motorla aynı; stil–poz eşleşmesi; uzun topta gerilme; dokunuş sıklığı hıza bağlı; omuz kontrolü sıklığı motorun bakınmasıyla aynı.

### G3 — Topsuz koşular ve savunma
- **Uzun top ve orta (A2b görsel; motor T7).** Tetik `pass`/`cross` (`L`, `tip` havadan), topun uçuşu, `bakisYon`. Savunmacı: top havadayken geri geri (hız sınırı ileri tepenin %70'i, ~3,5–4 m/sn), düşme adımıyla dönüp koşu, koşarken baş yukarıda ve omuz üstünde (90°+), inişi okuma (baş topa kalkık), hat birlikte çıkar/düşer (T7 ofsayt çizgisi; lider stoper pasörün vuruş hazırlığını okur), ofsayt için kol kaldırma 1–2 sn (jest; T7); ikinci top için hazır duruş (dizler bükük, baş topta). Alıcı: omuz üstünden bakış, koşuyu bozmadan kontrol (G2). **Ölçüt:** uçuş sırasında savunmacının başı topa dönük süre payı; geri koşu → dönüş eşiği hızla ölçülür; dönüşte basma adımı.
- **Kapatma ve jokey (T4, T7).** “Hızlı yaklaş, yavaş var”: depar, ~2 m kala kısa adımlarla fren, yan varış; jokey (“sörf tahtası”): rakibe 45° yan, bir ayak önde, dizler 30–45° bükük, ağırlık ayak ucunda, ~1 m (kol boyu), ayaklar çaprazlanmaz, yön değişiminde düşme adımı, göz rakibin gövdesinde; yönlendirme (zayıf ayağa/çizgiye), “geciktir, yıkma”; kapatma (bacak uzatma, gövde yana); çizgi tutma; pres koşusu (kollar geniş, gövde öne); forvetler en çok kapatma koşusu yapar.
- **Müdahale ve blok (T5).** Blok müdahale (destek ayağı sabit, iç ayak topun ortasına, ağırlık arkada, diz ve bilek kilitli, baş topun üstünde; sıkışırsa topu kaldırma), dürtme (yandan/arkadan, en yakın ayakla burun), kayarak (yandan, top ayaktan ayrılınca, uzak bacakla, diğer bacak kıvrık, kalça/dış uyluk üstünde kayma, bağcıkla topun üst yarısı, topu geri çengelleme; kalkış), şut bloku (öne hamle, gövde dönük, kollar yanda/arkada), kesme uzanışı; maçta 31–35 müdahale, en çalışkanı 3,5–4,5.
- **Koşucu takibi ve toparlanma (T7).** Baş top ile koşucu arasında ~1/sn; toparlanma koşusu depar duruşuyla baş topa dönük, eğri koşu; stoperler en çok 0–90° dönüş yapar.
- **Topsuz koşular (T7).** Türler: arkaya, kısa gelme, geniş açılma, yarı alana açılma, destek, önde koşu, bindirme, içten bindirme, orta alıcı (ön direk 45° sert koşu, arka direk geç varış, ceza sahası çizgisine geç giriş); forvet koşularının %32'si arkaya, %23'ü orta alıcı, %22'si önde, %8'i kısa; çağırma koşusu > 0,7 sn ve > 15 km/sa; çift hareket (kısa gel–uzun git), yavaşla–patla (zamanlama pasörün hazırlığına), aldatma koşusu; koşu başlangıcı kol işaretiyle (kol kaldırma, yere işaret; elit sözsüz davranışların %57'si kol hareketi) iki patlama adımı, baş pasöre; varışta ofsayt için omuz üstünden bakış. **Ölçüt:** savunmacının yüzü topa dönük süre payı; geri koşuda dönüş eşiği; koşu başlangıcı `kosu` olayından ≤ 1 kare; raised-arm jesti ≥ 1 sn.
- **Markaj (T7):** rakibe hafif el teması, kornerde itişme (G5); adam paylaşımında işaret.

### G4 — İkili mücadele, hava topu, düşüş ve sakatlık
- **Omuz omuza, itme, tutma (T5).** Tetik `omuz`, faul neden itme/tutma: kol gövdeye yakın, iki beden birbirine yaslanır, dış kollar denge için açık; kaybeden sendeler (`sendele`), kazanan gövdeyi sokar; forma çekmede çekenin kolu geride uzanır, çekilenin gövdesi öne ve tökezler; itilen tökezler (aşağıda).
- **Tökezleme ve düşüş (T5).** Takılmada iki strateji: yükseltme (adımı tamamlar) ya da alçaltma (ayağı erken koyar, diğeriyle aşar) → 1–3 tökezleme adımı, gövde öne, kollar öne; kurtarma adımı kısa kalırsa düşüş: 0,4–0,6 sn (önce eller/ön kollar, sonra kalça), gövde kuvvet yönünde katlanır; **aktif ragdoll**: 11 noktalı verlet çubuk figürü (~14 çubuk, 2–3 açı sınırı) yalnız düşüş/kayma durumunda, hedef poza çekilerek (animasyonun sürdüğü fizik), kalkışa ataletli dönüş; yerde yatış (yüzüstü/sırtüstü/yan), **kalkış** sırtüstünden 1,5–3 sn, elle basılı yandan 1–1,5 sn (motor `kalkis.sure` T5'te), takılmada birkaç topal adım; iniş dengesi (tek ayak inişte toparlanma ~1,9 sn). Simülasyon (T5 mekanik, T10 profil): “okçu yayı” (iki kol omuz üstünde, avuçlar açık, göğüs önde, dizler bükük — gerçek düşüşte olmaz), yere değince fazla yuvarlanma, temastan önce kontrollü adımlar, dokunulmayan yeri tutma; gerçek düşüşte kollar aşağı/öne koruyucu.
- **Hava topu (T6).** Yer kapma (kolla itişme, tutma); sıçrama tek ayak (koşarak; serbest bacak savrulur) ya da çift ayak (karşı hareketle), yükseklik 0,40–0,45 m (kol salınımı %12 katkı), tepeye ≈ 0,3 sn (vuruş tepede, kalkış temastan 0,3 sn önce); kafa: dizler bükük, sırt yay, boyun sert, gözler açık, alın; gövde yaydan öne kırılır (toplam ~30°, abartılı), iyi kafacı dirsekleri bükük tutar; savunma kafası yukarı ve dışa (bacaklar iter, kollar denge), hücum kafası aşağı; yana kafa/uzatma (gövde açılır, baş yönlendirir); plonjon kafa (gövde yatay, kollar öne, göğüs/ön kollara iniş, kalkış); iki bedenin birlikte yükselmesi ve havada çarpışma, iniş; kaybeden ikinci topa döner. Gerçek: maçta 80–140 kafa, oyuncu başına 3,7–5,7, %77'si alınla, %66'sı savunmada, %71'i düelloda ve bunların %72'sinde beden teması; stoperler kafaların %35'i; kafa vuruşundan önce en sık: uzun pas, uzaklaştırma, taç, korner, orta.
- **Faul ve tepki (T5, T10).** Faul yapanın eli açık itirazı, faul yiyenin yerde kıvranması ya da çabuk kalkışı (profil `hakemeItiraz`, agresiflik), hakemin gelişi (G7), yere düşenin arkadaşı tarafından kaldırılması.
- **Sakatlık (T10).** Kramp (baldır > arka uyluk > ön uyluk): oturur/yatar, bacak düz, arkadaş ya da sağlıkçı ayak ucunu iter / bacağı kaldırır; topallama (ağrıyan bacakta kısa basma 0,6–0,7, hız −%25, gövde iyi bacağa); diz/bilek tutma, yatış; maçta ~3,4 sakatlık durması, ortalama 89 sn (yalnız %17'si oyunu bitirir); sağlıkçı 20–50 sn değerlendirme, sedye; oyuncu kenara çıkar, hakem işaretiyle girer; kanamada forma/çıkış.
**Ölçüt:** temas açıklığı ≤ 0,15 m, gövde kutuları iç içe ≤ 0,05 m, düşüşte kök hızı sürekli, temas karesi motor anından ≤ 1 kare sapar; kalkış süresi gerçek aralıkta; sıçrama tepesi motorun temas anında.

### G5 — Duran toplar (T8; baraj zıplaması A2b)
- **Korner.** Top köşe yayına yerleştirilir (eğilme), geri geri 4–6 adım, bir an durma ve bakış, **el kaldırma** (işaret; profil ve takım kalıbı), koşu ve içe/dışa dönen vuruş (G2 asma/kesme); ceza sahasında bekleyenler küçük yavaş adımlarla bekler, serviste patlar, itişir, perdeler, kol tutar (hakem önce uyarır: G7); kaleci ön direkte işaret verir, başlama yeri yakın ortada çizgiye yakın ve yakın direk, derin ortada yüksek ve ortada; yan hakem köşe bayrağının arkasında kale çizgisi hizasında.
- **Serbest vuruş.** Top yerleştirme, geri adımlar (vuruşçuya göre 3–7), baraja, kaleye ve hakeme bakış (düdük bekleme), kısa koşu ve vuruş (G2 falso/sert/aşırtma); **baraj** 2–5 kişi (motorda var: `durus.barajdakiler`), dirsek kenetleme, eller önde kapanma, baş çevirme, **vuruşla birlikte zıplama** 0,3–0,4 m (A2b: tetik vuranın `vurus` takip anı; çizim yalnız okur), yatan barajcı (2013+; §7.6); hücumcular barajdan ≥ 1 m (2019+; §7.6); kaleci barajı kol işaretiyle kurar (sayı; bir barajcı kaleciye döner), uzak direk tarafında topu barajın kenarından görür; hakem 9,15 m'yi adımlayıp çizgiyi gösterir (sprey 2013+; §7.6), mesafe zorlanıyorsa düdük bekletir; çabuk kullanımda hiçbiri yok (T8 madde 10).
- **Taç.** Topu alma, çizgiye geliş (iki ayak çizgide/arkasında), geri adım, iki el baş üstünden; uzun taçta 3–5 adım koşu, büyük son adım, gövde geriye gerilme, kollar başın arkasında, kamçı, ayak sürüme (çıkış ~14–15 m/sn, 20–23 m, açı ~30°); alıcılar çizgiye yaklaşır; yan hakem yönü gösterir (G7). Hakemin 5 sn el işareti (2025+; §7.6).
- **Kale vuruşu.** Kaleci topu altıpasa koyar, geri adım, uzun vuruş gerilmesi ya da kısa oyun kurma; 1999'da top ceza sahasını terk etmeli (§7.6).
- **Penaltı.** Top yerleştirme, geri adımlar (3–7; altıdan uzun koşu daha başarılı), duraklı koşu (profil; başarı ~%80 vs %76, 2026'da düştü), bekleme (nefes, bakış), koşu ve vuruş; kaleci çizgide (bir ayak çizgide ya da arkasında; 1997'den beri çizgi boyunca hareket), kol sallama, yanlara dalış (%90'dan çok yana dalar; hareket başlangıcı temastan −145…+9 ms, destek ayağı ipucu −160 ms; topun uçuşu 0,5–0,7 sn, köşeye ulaşma ≈ 0,6 sn, üst köşeye ≈ 1 sn; dalış zarfı kalenin ~%70'i); bekleyenler yay dışında eğilmiş, düdükle içeri, ribaund koşusu.
- **Santra.** Düdük, topa dokunuş ve geri pas (2016'dan beri her yöne; §7.6); gol sonrası yenen takımın topu ağdan alıp santraya koşması (T10); gol → santra 60–90 sn.
**Ölçüt:** hazırlık süreleri motorun duran top süresiyle aynı (tehlikelide 10–14 sn); el kaldırma ve bakış evreleri galeri satırında; barajın zıplaması vuruş karesinde; itişmede temas ölçütü.

### G6 — Kaleci
- **Set duruşu ve küçük adımlar (A2b).** Tetik `tavir='hazir'`, `cross`, şutçunun `vurus.faz`. Set: duruş genişliği bacak boyunun ~%33'ü (en hızlı dalış %75'te), diz ~55–62°, göğüs dizlerin üstünde, dirsekler önde, eller ayakların önünde, omuzlar topa; **set anı şutçunun destek ayağı basınca** (ya da temasta); ortadan önce **split-step** (iki ayağa kısa yaylı iniş, sonra topa doğru küçük adım); açı oyunu kısa açık adımlarla (sıçrama değil), “top hareket ederse hareket, dururken dur”, göbekten topa çizgi, yakın direk önceliği; çıkış derinliği (motor D, bilgi): rakip ceza sahasındayken ceza sahası çizgisi, orta sahada ~11 m, 30–35 m'de 3–5,5 m, yaklaştıkça çizgiye.
- **Dalış (çizim evreleri bugün var; zamanlama ve 1v1 T9b, hava topu T6).** Üç evre: yakın bacakla yana adım (genişlik %33 → %83), uzak bacağın itişi (%16–75), yakın bacağın itişi (%52–100); hareket süresi yüksek dalışta ≈ 1,05 sn, alçakta ≈ 0,97 sn, tepki ≈ 0,2 sn; çökme dalışı (yakın bacak çöker, eller topun arkasında ve üstünde, yer tutuşu kilitler), alçak topa 45° atak ve yana iniş (asla sırt/karın), uzanma dalışı, W eller öne, parmak ucuyla direğin üstünden çıkarma, parry dışa (asla ortaya), kurtarış sonrası topu güvene alıp kalkış; tutuş türleri: kepçe (diz altı; ayaklar geniş, avuçlar rampa), kucak/sepet (göğüs; dirsekler koridor), W (baş; parmaklar açık, baş parmaklar bitişik, 38–46 cm önde), göğse çekme ve sarma. 1v1: öne adım, eller önde, “büyüme”; K-blok (çok yakın: bir ayak basılı diğer bacak kıvrık), yıldız/spread (kol boyu: bacak ve ayak dışa; tetik rakibin dokunuşu), eller önce (büyük dokunuşta), ayakla kapatma, süpürücü çıkış ve kayarak uzaklaştırma. Orta: başlama yeri (G5), “KALECİ!/ÇIK!” çağrısı (jest: kol), kısa adımlar + uzun son adım, top tarafındaki ayakla sıçrama, serbest diz yukarıda, kolların itişi, en yüksek noktada tutuş; yumruklama çift yumruk (geldiği yöne) / tek yumruk (uzak direğe devam), gelmeme kararı. Kalecinin kalkışı 0,5–1 sn.
- **Dağıtım (A2b çizim; motor T9b).** Tetik `degaj`, `elleAtis.stil`, kale vuruşu: punt (yükseklik ve uzaklık; koşu ve yüksek atış), düşürme vuruşu (drop kick; kısa sekmeden sonra), yan vole (top yana atılır, kalça topa döner), yerden yuvarlama, omuzdan/javelin (kol geriye, avuçta top, kulağın yanından), üstten (sling); hedef: duran arkadaşa ayağa, koşana önüne; topu yere koyup oyun kurma (kısa). 6 sn (1997) + 4 adım (2000'e dek) / 8 sn (2025) → §7.6.
- **Penaltı (T8):** G5. **Baraj (T8):** G5. **Bekleyiş ve ritüel (A2a/A2b):** çizgide ağırlık aktarımı, eldiven düzeltme/çekme, direğe dokunarak yönelme, şişe (kale arkasında; eldivene su), gol yedikten sonra ağdan topu alma (T10), zaman geçirme (kale vuruşunda yavaş; sarı — T10).
**Ölçüt:** dalış evreleri `ucus` sözleşmesiyle; el–top teması ≤ 0,1 m; set duruşundan dalışa geçiş kare sınırında; set anı şutçunun basma karesinde; split-step orta vuruşundan önce.

### G7 — Hakem, yan hakem, 4. hakem ve kenar (işaret seti ve hareket A2b; kişilik ve kural olayları T10; dönem §7.6)
- **Orta hakem işaretleri (A2b).** Tetik `faul`, `avantaj`, `goal`, `ofsayt`, `durus.tur`, `kart`, `degisiklik`, aşama olayları; bugünkü `duduk`/`yon`/`avantaj`/`kart`/`penaltiGoster` eylemleri korunur, biçimleri tamamlanır: **düdük** (el ağızda; gerekli hâller: başlama, faul ve penaltı, kart/sakatlık/değişiklik sonrası yeniden başlama, devre ve maç sonu — uzun ya da üç kısa; taç, korner, kale vuruşu ve golde genelde yok), **avantaj** (iki kol öne, avuçlar aşağı; tek kollu biçim §7.6), **direkt serbest vuruş** (kol yukarı, sonra yöne), **endirekt** (kol başın üstünde, top başka oyuncuya değene dek tutulur; motor endirekti ayırmıyorsa T10), **penaltı** (noktayı gösterme, sert düdük), **kale vuruşu** (kale alanına), **korner** (köşe yayına), **kart** (oyuncuya yaklaşma ~1,6 m, oyuncuyu gösterme/bakma, kartı başın üstünde; ikinci sarıda sarı sonra kırmızı; deftere yazma), **gol** (düdük yok; santrayı gösterir, oyuncular ayrılınca geri geri santraya), **oyuncuyu çağırma** (parmak), **9,15 m** (adımlama ve çizgiyi gösterme), sakatlıkta sağlıkçıyı çağırma (kol sallama), devre/maç sonu tünele işaret (gelenek), 8 sn geri sayımı ve VAR TV işareti (modern; §7.6). Beden dili kararı açıklamak için değil otorite içindir (kısa, net).
- **Orta hakem hareketi (çizim A2b; motor bugün çapraz).** Çapraz sistem (oyun hakemle aktif yan hakem arasında), topa ortalama 18–19 m (sürenin %80'i 5–30 m'de), faulleri 11–15 m'den en doğru görür (ceza sahasında < 10 m'de %83, > 20 m'de %50 doğru); geri geri koşu (maçta ~0,9 km; sürenin ~%5'i), maçta 10–12 km, yüksek tempo ~1,9 km; pas hattını kapatmaz; kornerde ve serbest vuruşta kendi yeri, penaltıda ceza alanı–kale çizgisi kesişimi (yan hakem), yan hakemle konuşma (ikisi de sahaya dönük, yan hakem 2–3 m içeri). Yorgunluk: son 15 dakikada geri/yan koşu yarıya iner, hata %23'e çıkar (T10 hakem kişiliği).
- **Yan hakem (A2b).** Tetik `ofsayt {p}`, `durus.tur`, `goal`, `degisiklik`, `faul` (görüş dışı). Sondan ikinci savunmacı ya da top hizası (motorda var; hizalanma hatası gerçekte 0,7–1 m), yüzü hep sahaya, kısa mesafede yan adım (maçta ~1,5 km yan), uzunda yan koşu; bayrak sahaya yakın elde, yön değişince el değiştirir, hep açık ve görünür; işaret mekaniği: dur, sahaya dik dön, göz teması, bayrağı hakemden uzak elle dik kaldır, sonra göster: **ofsayt** yakın/orta/uzak (düdükten sonra bayrak 45° aşağı / yatay / 45° yukarı; oyuncunun yan hakeme uzaklığından), **taç** (bayrak çizgi boyunca yöne), **kale vuruşu** (kale alanına), **korner** (bayrak köşeye aşağı), **değişiklik** (iki elle yatay baş üstünde, ilk duruşta), **faul** (bayrak sallama, sonra yön), **gol** (bayraksız orta çizgiye 25–30 m depar; ucu ucuna geçtiyse önce bayrak); “bekle ve gör” gecikmesi (ofsayttaki oyuncu oyuna karışana dek); kornerde köşe bayrağı arkası, penaltıda kale çizgisi–ceza alanı kesişimi.
- **4. hakem (A2b, T10).** İki teknik alan arasında, orta çizgi hizasında, ayakta; **değişiklik tabelası** (numaralar; giren ancak çıkan çizgiyi geçince ve hakem işaretiyle; çıkan 10 sn içinde — 2019+; §7.6), **uzatma tabelası** 45' ve 90'ın son dakikasında, kulübe uyarısı (teknik alan dışına çıkan, aynı anda talimat veren birden çok kişi), sağlıkçı girişi hakem işaretiyle, yedek top kontrolü.
- **Kenar (T10; bekleyişler A2a).** Hoca teknik alanda (1 m şeritler; aynı anda tek kişi talimat; dışarı çıkınca uyarı/kart 2019+), ayakta/oturarak, işaret, itiraz, kollar kavuşuk, çömelme; kaleci antrenörü, kondisyoner; yedeklerin ısınması (koşu, esneme, yelekli; aynı anda 3 ya da 5 kişi — §7.6), top toplayıcılar (var; koniler ve çoklu top modern — §7.6), fotoğrafçılar (var); sağlıkçı ve sedye (hakem işaretiyle, 20–50 sn değerlendirme, ≈ 90 sn durma), su molası 1 dk / soğuma 90 sn–3 dk (sıcakta; T10 §7.8); **değişiklik prosedürü** (tabela → çıkan en yakın çizgiden 10 sn içinde (1999'da orta çizgiden; §7.6) → el çakma (gelenek) → giren orta çizgiden hakem işaretiyle; toplam ≈ 45 sn), maç sonu tokalaşma ve tünel, ısınma pencereleri (saha oyuncuları ≈ 30 dk, kaleciler 45 dk, herkes 10 dk kala içeri; devre arasında ≈ 2,6 dk yeniden ısınma), halka/huddle (kol kola 5–15 sn).
**Ölçüt:** işaret olayla aynı karede başlar, süresi motorun olay süresiyle; hakemin topa ortalama uzaklığı 12–22 m (ölçülür); yan hakemin ofsayt hizası ≤ 1 m; bayrak her an görünür ve sahaya yakın elde; tabela ve değişiklik sırası kurala uygun.

### G8 — Sevinç, tepki ve beden dili (T10; bekleyiş ve jest katmanı A2a)
Gol sevinci türleri profil ve kişilikten: koşu ve kollar açık, diz kayması, yumruk, göğe işaret, arma öpme, parmak dudakta, kulak, köşe bayrağına koşu, takım yığını/kucaklaşma, sakin yürüyüş (forma çıkarma sarı kart 2004+; §7.6); gol → santra 60–90 sn (erkeklerde sevinç ≈ 1 dk); yenen takım: eller başta/belde, baş önde, gerideyken topu ağdan hızlı alma; kaçan pozisyonda baş tutma, dizlere çökme, göğe bakış; yorgunluk (dizlere dayanma, eller belde, yavaş yürüyüş; G0.7); hakeme itiraz (eller açık, yaklaşma; profil `hakemeItiraz`; yalnız kaptan — 2025+; §7.6); takım arkadaşına işaret/kızma; devre ve maç sonu yürüyüşleri, tokalaşma, taraftarı alkışlama; sakatlık tepkileri (G4). **Ölçüt:** sevinç süresi maç olay süresiyle aynı; aynı tohumda farklı oyuncu farklı sevinç; başkanın tepkileriyle zamanlama (js/baskan.js) korunur.

### G9 — Araçlar ve ölçüm (A2a)
- **Karşılaştırma sayfası** `araclar/animasyon-karsilastir.html` (A2a'da geldi): iki çerçeve yan yana, aynı maç sayfası (`index.html`); “önce” çerçevesinde dondurulmuş `araclar/karsilastir/once/animasyon.js` `once-yukle.js` ile bir işlevin içinde çalışır (üst düzey ad çakışması yok); aynı tohum, ortak kare saati (`js/ortak.js` kancası), sahneye iki motor birlikte ilerler; yerel sunucu ister (`.claude/launch.json` “chairman-yerel”); sahne seçici (yürüyüş, hızlanma–fren, 45°/90°/180° dönüş, geri koşu ve yana kayma, bekleyiş, kısa pas / uzun top / şut / vole / aşırtma, orta, ilk dokunuş türleri, korner ve serbest vuruş hazırlığı, baraj, kaleci set / split-step / dalış, hakem ve yan hakem işaretleri, düşüş–kalkış, sevinç…), üçüncü sütun farklı kimlik; her yeni hareket burada gösterilir ve kullanıcı onaylar. `prototipler/9-a2-yuruyus.html` tarihsel örnek olarak kalır.
- **`araclar/animasyon-olcum.py`** (A2a'da geldi): başsız Chromium, sanal saat, tohumlu maç; araç `aktorGuncelle`'yi ve `macKare`'yi dışarıdan sarar (animasyon koduna ölçüm girmez), her karede pozu, ayak tabanını ve baş/kök yönünü okur; `--once` dondurulmuş “önce” animasyonunu ölçer, `--json`/`--karsilastir` tabanla yan yana; sonuçlar `A:` satırları olarak tur kapanışında YOL_HARITASI'na yazılır, tam rapor `araclar/son-animasyon.txt` (Git dışında). Ölçütler (TEST başlangıç değerleri; 2026-10-08'de ilk ölçümle gözden geçirildi):

| Ölçüt | Tanım | Hedef | Önce → A2a (tohum 3, 180 sn) |
|---|---|---|---|
| Ayak kayması oranı | taban 0,02 m altında (2,5 m'de kalkar; ilk iki temas karesi sayılmaz) iken yatay hızı 0,2 m/sn'yi aşan eylemsiz temas karesi payı | yürüyüş/koşu ≤ %5, hızlı/depar ≤ %15 | yürüyüş %11,7 → 3,6 · koşu 1,1 → 3,8 · hızlı 0,05 → 7,1 · depar 0,2 → 9,4 |
| Adım başına kayma | yerdeki ayağın bir temas boyunca net yer değiştirmesi (ve yolu) | yürüyüş ≤ 0,03 m, depar ≤ 0,08 m; locada ≤ 1 px | yürüyüş 0,101 → 0,022 m · depar 0,000 → 0,005 m |
| Kadans–hız | 2 sn'lik kararlı hız pencerelerinde basma/sn | düz yürüyüş 1,6–2,2; koşu (2–5 m/sn) 2,5–3,0; hızlı 3,0–3,6; depar 3,5–4,2 (maçtaki yürüme bandı ayar ve dönüş adımlarını içerir: bilgi) | yürüyüş 3,19 [1,8–5,4] → 2,57 [1,9–3,5] · koşu 3,11 → 2,90 · hızlı 3,67 → 3,63 · depar 3,99 → 4,21 |
| Uçuş evresi | iki ayak da temas dışında (eylemsiz kare) | koşuda var, yürüyüşte ~0 (kalkıştaki taban yükselmesi sayılır) | koşu %15 → 35 · depar %52 → 57 · yürüyüş %0,2 → 6 |
| Sıçrama | eylemsiz karede kanal değişimi: üst gövde > 10°, bacak > 20°; kalça > 3 cm; kök > 10° | üst gövde ≤ 10, kalça ≤ 2, kök 0 /oyuncu·dk; bacak bilgi | üst gövde 86 → 7,5 · kalça 42 → 1,1 · kök 1,45 → 0 · bacak 86 → 63 |
| Kırılma | ikinci fark (hız süreksizliği): üst gövde > 0,06 rad, bacak > 0,2 rad | üst gövde ≤ 15 /oyuncu·dk; bacakta basma/kalkma dışı azalır | üst gövde 132 → 10 · bacak 358 → 189 (%82 basma/kalkma anında) |
| Baş | |baş–gövde|; gövdeye göre ve dünyada dönüş hızı; dönüşte başın öncülüğü | ≤ 80°; gövdeye göre p99 ≤ 400°/sn; dünyada ve öncülük motor dönüşüne bağlı (bilgi; T4/T7) | > 70° %9,2 → 5,6 · gövdeye göre p99 745 → 313°/sn · dünyada en çok 2032 → 816 · öncülük 17 → 67 ms |
| Dönüş | 90°+ dönüşte basma sayısı; yerinde dönerken iki ayağın yerde olduğu kare payı | her dönüşte basma; yerinde dönüşte gövde önden, ayaklar basarak (bilgi) | basma 2,66 → 2,31 · basmasız %5,7 → 6,0 · iki ayak yerde %49 → 55 |
| Kimlik | koşu bandında oyuncuların adım boyu ortalamasının değişim katsayısı; bekleyişte ikiz poz payı | ≥ %8; ikiz ~0 | adım boyu CV %11 → 17 · ikiz %0,05 → 0,36 |
| Düzgünlük | SPARC (baş hızı, 3 sn eylemsiz pencere) | bilgi (yaylanma ve salınım da düşürür; kapı değil) | −2,36 → −2,54 |
| Süre | bütün aktörlerin `aktorGuncelle` süresi, kare başına (başsız tarayıcı) | ≤ 2 ms | 0,78 → 0,82 ms (p99 2,6 → 2,9) |
| Temas (T5+) | temas noktaları açıklığı; gövde kutuları iç içe; kare sapması | ≤ 0,15 m; ≤ 0,05 m; ≤ 1 kare | — |
| Zamanlama | işaret/eylem olayla aynı karede; vuruş evreleri motorla | sapma 0; aynı | A2b: hakem işareti 10/10 olay aynı karede · vuruş teması 29/29 aynı karede |

- **Poz galerisi** (`araclar/poz-galerisi.html`): her hareketin zaman sıralı satırı, iki bedenli sahneler, temas açıklığı ve geçiş ölçüleri satırda; A2'de yeni satırlar (dönüş türleri, geri koşu ve yana kayma, gerilme ve uzun top, set ve split-step, hakem ve yan hakem işaretleri, baraj zıplaması, eller dizlerde); `?sayfa=olcum` kalır.
- **`an-yakala.py`:** loca bakışıyla film şeridi; önce/sonra `--onek`; A2 anları `donus`, `uzun-top-savunma`, `gerilme`, `baraj`, `hakem-kart`, `yan-hakem-ofsayt`, `bekleyis`.

### G10 — Dönem uyumu: 1999 görünüm, bugünün kuralları (§7.6 ile T10'da sorulur)
Oyun '99 görünümündedir ama Türkiye bugündür; motor bugün 5 değişikliğe izin verir. Görünüşü etkileyen kural farkları (1999 → bugün): yan hakem adı ve bayrak (1996'dan beri aynı), 4. hakem ve tabela (1991), kartlar (1970); kaleci 4 adım + 6 sn (4 adım 2000'de kalktı; 8 sn ve hakemin el sayımı 2025); kaleci penaltıda çizgi boyunca hareket (1997); santra ileriye (2016'ya dek) → her yöne; yazı turayı kaybeden santra (1997–2018); hakem topu çekişmeli (2019'a dek) → bırakma; kale vuruşunda top ceza sahasını terk eder (2019'a dek); 3 değişiklik (1995) → 5 (2020); çıkan oyuncu orta çizgiden (gelenek) → en yakın çizgiden 10 sn içinde (2019); avantaj iki kolla (tek kollu biçim 2019 öncesinde eklendi); hücumcu barajın içinde/dibinde durabilir → ≥ 1 m (2019); yatan barajcı (2013+); sprey yok (2013/14), kale çizgisi teknolojisi yok (2012), ek yan hakem yok (2012), VAR yok (2018), çoklu top ve koniler yok (2006/07; Premier Lig 2022), soğuma molası yok, hocaya kart yok (2019), forma çıkarmaya sarı yok (2004), yalnız kaptan konuşur protokolü yok (2025). **Varsayılan (karar gelene dek):** motorun bugünkü kuralları (5 değişiklik, her yöne santra, kale vuruşu ceza sahasında oynanabilir) kalır; görünüşte 1999 biçimleri (iki kollu avantaj, VAR/sprey/8 sn/yatan barajcı yok, çıkan oyuncu orta çizgiden). Karar §7.6 ile birlikte T10'da.

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
- Yürüyüşte kadans ve adım (Froude ilişkisi): https://en.wikipedia.org/wiki/Froude_number#Walking_Froude_number · ataletli karışım (inertialization; GDC 2018): https://www.gdcvault.com/play/1025165/Inertialization-High-Performance-Animation-Transitions · CMU hareket yakalama veritabanı (kamu malı; §7.9): http://mocap.cs.cmu.edu/


### Kaynaklar — Ek G (2026-10-08 araştırması)

- Maçta hareket sınıfları, dönüş ve topla eylem sayıları (Bloomfield 2007): https://jssm.org/jssm-06-63.xml-Fulltext · yön değiştirme biyomekaniği ve 600/100 dönüş: https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.594567/full · açı–hız ödünleşimi: https://salford-repository.worktribe.com/output/1378901/the-effect-of-angle-and-velocity-on-change-of-direction-biomechanics-an-angle-velocity-trade-off · kesmede gövde eğimi: https://www.jssm.org/jssm-10-112.xml-Fulltext
- Depar sayıları ve mesafeleri: https://pubmed.ncbi.nlm.nih.gov/25005777/ · ivmelenme/fren sayıları: https://termedia.pl/The-positional-demands-of-explosive-actions-in-elite-soccer-r-nComparison-of-English-Premier-League-and-French-Ligue-1,78,54014,1,1.html · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9474351/ · hız bölgeleri: https://support.scisports.com/en/articles/3376037-speed-zones-and-thresholds · tepe hız: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11694206/
- Yürüyüş kadansı ve adımı: https://pmc.ncbi.nlm.nih.gov/articles/PMC1628350/table/T1 · https://pmc.ncbi.nlm.nih.gov/articles/PMC6029645 · adım boyu ∝ v^0,42 ve yürüyüş–koşu geçişi (Froude): https://en.wikipedia.org/wiki/Effect_of_gait_parameters_on_energetic_cost · https://en.wikipedia.org/wiki/Transition_from_walking_to_running · ileri ve geri koşu (kadans, adım, temas): https://pages.uoregon.edu/btbates/backward/alan2.htm · kol salınımı: https://en.wikipedia.org/wiki/Arm_swing_in_human_locomotion · yorgun depar: https://www.springermedicine.com/repeated-sprinting-on-natural-grass-impairs-vertical-stiffness-b/21069190 · ivmede öne eğilme: https://researchers.westernsydney.edu.au/en/publications/transition-from-upright-to-greater-forward-lean-posture-predicts-/ · eğri koşu: https://ariasmontano.uhu.es/entities/publication/4792933c-20fe-47d5-9fe3-84863fecb557 · yana kayma: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11812171/ · dönüşte bakış–baş–gövde sırası: https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2015.00312/full · boyun hareket açıklığı: https://boneandspine.com/range-motion-cervical-spine/
- Vuruş biyomekaniği (evreler, açı, destek ayağı, hızlar): https://www.jssm.org/jssm-06-154.xml>Fulltext · https://www.jssm.org/jssm-08-230.xml-Fulltext · evre zamanlaması: https://lida.sport-iat.de/dfb/Record/4043225 · gerilme yayı (karşı kol): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3224572/ · iç ayak ve üst: https://ojs.ub.uni-konstanz.de/cpa/article/view/1999/1867 · falso: https://shura.shu.ac.uk/2127 · vole: https://lida.sport-iat.de/dfb/Record/4045570 · burun vuruşu: https://ejournal.upsi.edu.my/index.php/JSSPJ/article/view/3900 · aşırtma: https://mojo.sport/coachs-corner/how-to-chip-the-soccer-ball · uzun pas: https://www.soccercoachweekly.net/drills-and-games/drills/practice-the-lofted-pass · penaltı koşusu ve duraklama: https://ingenuityfantasy.com/?p=10306 · https://www.skysports.com/football/news/11095/13559248/world-cup-2026-is-the-penalty-stutter-run-up-that-cost-germany-and-netherlands-at-the-end-of-its-lifespan
- Bakınma (Jordet): https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.553813/full · baş dönüşü sıklığı: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.02520/full · açık beden: https://themastermindsite.com/2018/10/14/the-importance-of-receiving-the-ball-on-the-half-turn/ · iç ayak yumuşatma: https://lida.sport-iat.de/dfb/Record/4026379 · göğüs kontrolü: https://soccerxpert.com/tips/details/chest-traps · top saklama: https://www.soccerxpert.com/tips/details/soccer-shielding · makas süresi: https://lida.sport-iat.de/dfb/Record/4024586 · dokunuş sıklığı: https://re.public.polimi.it/handle/11311/1120034 · aldatma okuma: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4123942/
- Kafa vuruşu sayıları ve tekniği: https://epub.uni-regensburg.de/52665/ · https://pure.ulster.ac.uk/en/publications/the-incidence-and-mechanism-of-heading-in-european-professional-f/ · https://www.soccerxpert.com/tips/details/id1230 · sıçrama yüksekliği ve kol katkısı: https://www.scitepress.org/Papers/2018/69001/ · gövde katkısı: https://pmc.ncbi.nlm.nih.gov/articles/PMC6873131
- Savunma tekniği (jokey, kapatma, müdahaleler): https://www.icoachfootball.net/1v1-defending-drills-jockeying/ · https://www.soccercoachweekly.net/practiceplans/three-tackles/ · https://www.sportsessionplanner.com/s/0Lllb/Defending-technique.html · ofsayt tuzağı: https://guidetofootball.com/tactics/offside-trap/ · müdahale sayıları: https://www.premierleague.com/news/2641889 · topsuz koşu türleri: https://skillcorner.com/blog/game-intelligence-off-ball-run-types · http://archive.trainingground.guru/articles/skillcorner-analysing-centre-forwards-off-ball-runs · sözsüz işaretler: https://nih.brage.unit.no/nih-xmlui/handle/11250/3089725 · çift hareket: https://elitesoccercoaching.net/attacking/attacking-movement-and-interplay
- Tökezleme stratejileri: https://researchportal.bath.ac.uk/en/publications/the-role-of-strategy-selection-limb-force-capacity-and-limb-posit/ · simülasyon ipuçları (okçu yayı): https://www.sciencedaily.com/releases/2009/09/090915202242.htm · yerden kalkma: https://www.sralab.org/rehabilitation-measures/supine-stand-test · inişte toparlanma: https://pmc.ncbi.nlm.nih.gov/articles/PMC4851129 · sakatlık durmaları: https://avesis.ankara.edu.tr/yayin/9ab6c4f1-700a-4006-a36f-2aa45a72e573/evaluation-of-stoppage-time-due-to-field-injuries-in-professional-football-games-do-players-really-need-medical-help-so-often · topallama: https://orthopaedicprinciples.com/painful-and-antalgic-gait/ · kramp: https://repository.up.ac.za/items/271f29d6-de26-413f-9034-aec7a5728328 · eller dizlerde: https://www.outsideonline.com/running/training/science/hands-on-knees-is-best-recovery-posture/ · uzun taç: https://lida.sport-iat.de/dfb/Record/4024326 · https://arxiv.org/abs/physics/0601149
- Kaleci: set duruşu ve dalış süreleri: https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2019.00015/full · https://pmc.ncbi.nlm.nih.gov/articles/PMC7739716 · set anı: https://sprinz.aut.ac.nz/__data/assets/pdf_file/0008/202985/109_1496_Numazu.pdf · temel teknik ve tutuşlar: https://superleagueldn.com/blog/beginners-goalkeeping · http://www.fifatrainingcentre.com/en/environment/fifa-goalkeeper-training/sessions/goalkeeping-fundamentals-defending-the-goal.php · çökme dalışı: https://www.sportsessionplanner.com/s/HeDYh · 1v1 bloklar: https://www.sportsessionplanner.com/s/a33Lh/Dealing-With-1v1-s-Using-Blocks-Spreads-or-Hands-and-Communication.html · açı ve derinlik: https://www.keeperstop.com/goalkeeper_drills-angles_positioning-how_far_off_the_line_should_the_goalkeeper_be · ortalar: https://www.keepersport.net/keeperzone/keepertraining/catching-crosses-with-confidence-technique-timing-and-drills-for-the-modern-goalkeeper.html · https://www.keeperstop.com/goalkeeper_drills-corner_kicks_crosses_high_balls-goalkeepers_tactical_considerations_when_dealing_crosses · dağıtım: https://www.socceramerica.com/?p=25380 · baraj kurma: https://sportsessionplanner.com/s/7baib/Setting-Wall-When-Defending-Free-Kicks.html · penaltıda kaleci: https://bath.ac.uk/announcements/taking-the-perfect-penalty · https://frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1356340/full · https://en.wikipedia.org/wiki/Penalty_kick_(association_football)
- Kurallar ve hakem: IFAB Kural 5 (hakem ve işaretler): https://www.theifab.com/laws/latest/the-referee/ · beden dili ve düdük: https://theifab.com/laws/latest/guidelines/body-language-communication-and-whistle · konumlanma ve çapraz sistem: https://www.theifab.com/laws/latest/guidelines/positioning-movement-and-teamwork/ · Kural 6 ve bayrak işaretleri: https://www.thefa.com/-/media/files/thefaportal/governance-docs/laws-of-the-game/2024-25/law-6---the-other-match-officials.ashx · https://folsomlakesurf.org/assistant-referee-flag-signals/ · yan hakem talimatları: https://www.guernseyfa.com/referees/refereeing-support/assistant-referee-instructions · işaret biçimleri: https://www.fifplay.com/football-referee-signals/ · 4. hakem rehberi: https://thefa.com/-/media/cfa/global/files/referees/fourth-official-guidance.ashx · hakemin topa uzaklığı: https://pmc.ncbi.nlm.nih.gov/articles/PMC8038568 · faul görme hatası ve mesafe: https://lida.sport-iat.de/dfb/Record/4026286?lng=en · hakem iş yükü: https://www.bisp-surf.de/Record/PU201409008604 · Kural 3 değişiklik: https://www.theifab.com/laws/latest/the-players/ · Kural 13 baraj: https://www.theifab.com/laws/latest/free-kicks/ · Kural 14 penaltı: https://theifab.com/laws/latest/the-penalty-kick/ · sakatlık tedavisi: https://www.thefa.com/-/media/cfa/global/files/referees/treatment-of-injuries-guidance.ashx · 2019/20 değişiklikleri: https://downloads.theifab.com/downloads/changes-to-the-laws-of-the-game-2019-20_en?l=en · 2025/26 değişiklikleri: https://downloads.theifab.com/downloads/changes-to-the-laws-of-the-game-2025-26?l=en · sprey tarihi: https://www.guinnessworldrecords.com/world-records/116661-first-football-soccer-fifa-world-cup-to-use-vanishing-spray · yatan barajcı: https://www.aol.com/sports/world-cup-mystery-solved-why-202153843.html
- Kenar ve duraklamalar: değişiklik ve sevinç süreleri: https://www.sciencedaily.com/releases/2011/06/110629132548.htm · maçta kaybedilen süre: https://www.frontiersin.org/articles/10.3389/fpsyg.2022.907336/full · ısınma pencereleri: https://premierleague.com/news/4079853 · https://research.edgehill.ac.uk/en/publications/warm-up-strategies-of-professional-soccer-players-practitioners-p/ · çoklu top: https://en.wikipedia.org/wiki/Multiball_system · gol sevinci türleri: https://en.wikipedia.org/wiki/Goal_celebration · boşta hareket tasarımı (nefes, ağırlık aktarımı, kıpırtı): https://mocaponline.com/blogs/mocap-news/idle-animation-design-guide
- Animasyon teknikleri: Overgrowth (13 kare, prosedürel; GDC 2014): https://www.gdcvault.com/play/1020583/Animation-Bootcamp-An-Indie-Approach · https://discussions.unity.com/t/an-indie-approach-to-procedural-animation-gdc-video-talk/538228 · açısal karışım: https://www.wolfire.com/blog/2010/04/Angular-and-linear-keyframe-blending/ · Overgrowth kaynak kodu (Apache 2.0; yalnız yöntem için): https://www.wolfire.com/blog/2022/04/Overgrowth-Open-Source-Announcement/ · ataletli geçiş (Bollo): https://history.siggraph.org/wp-content/uploads/2022/09/2017-Talks-Bollo_High-Performance-Animation-in-Gears-of-War-4.pdf · yaylar ve yarı ömür (Holden): https://theorangeduck.com/page/spring-roll-call · https://theorangeduck.com/page/inertial-easing · ayak kilidi ve dönüş duyarlılığı: https://theorangeduck.com/page/code-vs-data-driven-displacement · ayak kayması ölçütü: https://research.nvidia.com/labs/sil/projects/kimodo/docs/benchmark/metrics.html · bakış zinciri: https://docs.vulkan.org/tutorial/latest/Advanced_glTF/Procedural_Animation_IK/05_look_at.html · hareket eşleme (neden atlandı): https://gdcvault.com/play/1022985/Motion-Matching-and-The-Road · https://docs.o3de.org/blog/posts/blog-motionmatching/ · FIFA'da zamanlamaya göre hareket bükme (GDC 2010): https://gdcvault.com/play/1012342/Animation-Warping-for-Responsiveness-in · verlet ragdoll (Jakobsen): https://www.gamedeveloper.com/programming/advanced-character-physics · yürüyüşten kimlik (Troje): https://www.biomotionlab.ca/walking/ · düzgünlük ölçütleri (SPARC, LDLJ): https://pmc.ncbi.nlm.nih.gov/articles/PMC4674971 · yürüyüşte SPARC değerleri: https://pmc.ncbi.nlm.nih.gov/articles/PMC6006701 · animasyon seviye ve bütçe: https://mocaponline.com/blogs/mocap-news/animation-lod-performance-guide · https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-budget-allocator-in-unreal-engine
- 1999 oyunları ve modern ölçekler: FIFA 99: https://en.wikipedia.org/wiki/FIFA_99 · https://www.gamerevolution.com/?p=33133 · FIFA 2000: https://psxdatacenter.com/games/P/F/SLES-02319.html · FIFA 2001 (karışım ve dönüşler yeni): https://rawg.io/games/30270 · ISS Pro Evolution: https://en.wikipedia.org/wiki/ISS_Pro_Evolution · PES 4'te ilk hakem: https://en.wikipedia.org/wiki/Pro_Evolution_Soccer_4 · Actua Soccer 3 (200 hareket): https://psxdatacenter.com/games/P/A/SLES-01210.html · Sensible Soccer (3 kare): https://community.swosunited.com/forum/swos-related/3058-edge-the-making-of-sensible-soccer · kayan ayak eleştirisi: https://www.dsogaming.com/?p=158186 · FIFA 22 makine öğrenmesi (yaklaşma adımları): https://80.lv/articles/ea-uses-machine-learning-for-animations-in-fifa-22
