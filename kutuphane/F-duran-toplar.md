# Bölüm F — Duran toplar, taç, penaltı, santra

Futbol Kütüphanesi'nin bu bölümü, maç motorunun "ilkel × bağlam × rol" diliyle çalıştırabileceği duran top (set piece) bilgisini toplar. Kurallar bugünün kurallarıdır (IFAB Laws of the Game 2026/27, VAR dahil); yalnız görüntü retrodur. Motor kapsamı ve kabiliyet ekonomisi başka belgelerdedir; burada rutinler, gerçek sayılar ve sahne akışları vardır.

İşaretler:
- **(tahmin)** — kaynak bulunamayan, yazarın futbol bilgisine ya da basit hesaba dayanan değer; motor için başlangıç değeri olarak kullanılabilir, ölçümle değiştirilir.
- **(bulunamadı)** — aranan sayı bu turda kaynaklı bulunamadı.
- **(ikincil aktarım)** — birincil veri sahibi (Opta, Stats Perform, IFAB) değil, onu aktaran haber/analiz sayfası.
- **(sezon başı anlık görüntü)** — birkaç haftalık örneklem; denge kararı için kullanılmaz.
- Bu turda web araması kotası dolduğu için birkaç başlık (Jordet'in düdük-zamanlaması sayıları, Palacios-Huerta'nın doğal taraf matrisi, Pulling 2013'ün tam özeti, kaleci kurtarış/çıkış oranları) birincil kaynaktan doğrulanamadı; ilgili yerde belirtildi.

Sayfa yapısı: F.0 kurallar ve gerçek duruş süreleri → F.1 korner → F.2 serbest vuruş → F.3 taç → F.4 penaltı → F.5 santra → F.6 kale vuruşu (çapraz referans) → F.7 hoca tarzı ve uzmanlar → F.8 Motor için notlar → F.9 Ölçüler → F.10 Kaynaklar.

---

## F.0 Kurallar, ölçüler ve gerçek duruş süreleri

### F.0.1 Saha ölçüleri (IFAB Law 1)

| Ölçü | Değer | Kaynak |
|---|---|---|
| Penaltı noktası | kale çizgisinin orta noktasından 11 m | [IFAB Law 1](https://www.theifab.com/laws/latest/the-field-of-play/) |
| Ceza sahası | direk içinden 16,5 m | aynı |
| Kale sahası (6 pas) | direk içinden 5,5 m | aynı |
| Penaltı yayı | penaltı noktasından 9,15 m yarıçap | aynı |
| Orta yuvarlak | 9,15 m yarıçap | aynı |
| Korner yayı | bayrak direğinden 1 m yarıçaplı çeyrek daire | aynı |
| İsteğe bağlı işaret | korner yayından 9,15 m, kale çizgisine dik | aynı |
| Kale | 7,32 m × 2,44 m | aynı |
| Uluslararası saha | 100–110 m × 64–75 m | aynı |

### F.0.2 Yeniden başlatma kuralları (özet)

- **Korner (Law 17):** top en yakın korner alanına konur; bayrak direği oynatılmaz; rakipler top oyuna girene kadar korner yayından en az 9,15 m uzakta; top vurulup açıkça hareket edince oyundadır (korner alanını terk etmesi gerekmez); doğrudan gol yalnız rakibe karşı; vurucu ikinci kez dokunursa endirekt. [IFAB Law 17](https://www.theifab.com/laws/latest/the-corner-kick/)
- **Serbest vuruş (Law 13):** rakipler toptan en az 9,15 m (kendi kale çizgisinde direkler arasında durmadıkça); **üç ya da daha fazla savunmacının kurduğu barajın 1 m yakınında hücumcu duramaz** (ihlal: savunmaya endirekt) — 2019/20 değişikliği; top vurulup açıkça hareket edince oyundadır; hızlı kullanılan vuruşu 9,15 m'den yakın bir rakip keserse oyun devam eder; endirekt işareti kol yukarıda; rakip hızlı vuruşu kasten engellerse sarı kart. [IFAB Law 13](https://www.theifab.com/laws/latest/free-kicks/); 1 m kuralının 2 Mart 2019 AGM gerekçesi ("barajdaki hücumcuların taktik meşruiyeti yoktur") [ThePapare](https://www.thepapare.com/ifab-football-laws-changes-2019-20/), yalnız 3+ kişilik barajda geçerli olduğu [Ask A Soccer Referee](https://askasoccerreferee.com/category/2019-2020-law-changes).
- **Taç (Law 15):** atıcı sahaya dönük, iki ayağın bir kısmı çizgide ya da dışarıda, iki elle arkadan başın üstünden, topun çıktığı noktadan; rakipler taç noktasından en az 2 m; top sahaya girince oyundadır; taçtan doğrudan gol olmaz; taçtan gelen topta ofsayt yok. **2026/27:** taç haksız yere geciktirilirse hakem düdük çalar, kolunu kaldırıp **beş saniyeyi görünür sayar**; süre bitince taç rakibe geçer; kart yalnız sonraki aşırı gecikmede. [IFAB Law 15](https://www.theifab.com/laws/latest/the-throw-in/)
- **Kale vuruşu (Law 16):** top vurulup açıkça hareket edince oyundadır (ceza sahasını terk etmesi gerekmez, 2019'dan beri); rakipler top oyuna girene kadar ceza sahası dışında; **2026/27 beş saniye geri sayımı:** süre bitince rakibe korner. [IFAB Law 16](https://www.theifab.com/laws/latest/the-goal-kick/)
- **Penaltı (Law 14):** topun bir kısmı penaltı noktasına değer ya da üstünden taşar; vurucu açıkça belirlenir; kaleci vuruşa kadar çizgide, vurucuya dönük, direkler arasında; vuruş anında **en az bir ayağın bir kısmı çizgiye değer, hizasında ya da gerisindedir** (2019/20); diğer oyuncular penaltı noktasından 9,15 m, noktanın gerisinde, ceza sahası dışında; **koşuda aldatma serbest, koşu tamamlandıktan sonra vuruş aldatması yasak** (sarı kart + endirekt); vurucu başka oyuncu dokunmadan tekrar oynayamaz; **kazara ikinci dokunuş** (örn. destek ayağının kayması) IFAB SSS'ye göre vuruşun tekrarını gerektirir. [IFAB Law 14](https://www.theifab.com/laws/latest/the-penalty-kick/) (Bu SSS maddesinin hangi yıl eklendiği sayfada yazmıyor; 2025'teki tartışmalı Şampiyonlar Ligi penaltısından sonra eklendiği yaygın bilgidir — **doğrulanmadı**.)
- **Santra (Law 8):** vurucu dışında herkes kendi yarısında; rakipler toptan 9,15 m; top orta noktada durağan; vurulup açıkça hareket edince oyundadır; **herhangi yöne oynanabilir** (2016/17 değişikliği: "The kick-off can be played in any direction", [Premier League 2016/17 değişiklikleri](https://www.premierleague.com/news/66192)); santradan doğrudan gol olur; kendi kalesine girerse rakibe korner. Hakem atışında (dropped ball) diğer oyuncular 4 m uzakta. [IFAB Law 8](https://www.theifab.com/laws/latest/the-start-and-restart-of-play/)
- **Kalecinin 8 saniyesi (Law 12, 2025/26):** kaleci topu elinde 8 saniyeden uzun tutarsa rakibe korner; hakem son beş saniyeyi elle sayar. 2024/25 denemesi ve IFAB'ın ölçümü: hızlı kontrada 6 sn altı, meşru gecikmede 6–8 sn, kasıtlı zaman geçirmede 20 sn+ [ESPN 2024](https://global.espn.com/football/story/_/id/39954456/ref-body-trials-giving-corners-throw-ins-gk-wasting), [ESPN 2025](https://global.espn.com/football/story/_/id/44068077/corners-given-combat-gk-wasting-refs-body-says).
- **IFAB Genelge 32 (28 Şubat 2026 AGM; 1 Temmuz 2026'dan geçerli):** taç ve kale vuruşunda beş saniye geri sayımı; oyundan çıkan oyuncunun 10 saniyede sahayı terk etmesi; tedavi gören oyuncunun bir dakika dışarıda kalması; **VAR'ın yanlış verilen korneri de inceleyebilmesi** (müsabaka seçeneği, restart gecikmeden düzeltilebiliyorsa); "yalnız kaptan" protokolü 1 Temmuz 2027'de zorunlu. [IFAB Circular 32](https://downloads.theifab.com/downloads/circular-32?l=en)
- **Kaybolan sprey:** 2000'de Brezilya'da geliştirildi, 2014 Dünya Kupası'nda ve 2014/15 Premier Lig açılış gününde kullanıldı; hakem topun yerini işaretler, 9,15 m'yi adımlayıp çizgi çeker; işaret bir dakika içinde kaybolur. [Wikipedia: Vanishing spray](https://en.wikipedia.org/wiki/Vanishing_spray)
- Hakemin düdük/pozisyon kılavuzu (IFAB "Practical guidelines") bu turda açılamadı → **(bulunamadı)**; genel uygulama: mesafe ayarlanan ("törensel") serbest vuruş, penaltı ve santra düdükle başlar, hızlı vuruş düdüksüz kullanılabilir **(tahmin, yaygın hakem uygulaması)**.

### F.0.3 Gerçek duruş süreleri (top dışarıdayken geçen süre)

Premier Lig 2026/27, ilk 5 hafta (50 maç), The Analyst/Opta; parantezde 2025/26: [The Analyst, yeni kurallar](https://theanalyst.com/articles/premier-league-rules-throw-ins-goal-kicks-ball-in-play)

| Yeniden başlatma | Ortalama duruş |
|---|---|
| Taç | 15,3 sn (17,8) |
| Kale vuruşu | 27,7 sn (30,4) |
| Korner | 33,9 sn (36,1) |
| Serbest vuruş (genel) | 33,3 sn |
| Doğrudan şut serbest vuruşu | 74,5 sn (önceki sezondan 11 sn+ hızlı) |
| Penaltı | 117,4 sn (164,7) — VAR dahil |
| Oyuncu değişikliği | 64,3 sn (76,1) |
| Top oyunda | %57,7; maç başına 56 dk 35 sn (55:23) |

Ek sayılar: 2025/26 Ocak itibarıyla taç başına 17,9 sn, 55 sn+ duruşlar atılınca 15,4 sn; kale vuruşu 30,1 sn (ilk yarı 27,5, ikinci yarı 32,4); maç başına taç duruşu 10:50, kale vuruşu 7:42; golle biten taçlar öncesi ortalama 28,1 sn duruş [The Analyst, zaman kaybı](https://theanalyst.com/articles/premier-league-football-time-throw-ins-goal-kicks-substitutions-stats). Dünya Kupası 2022 → 2026: kale vuruşu 27,7 → 23,7 sn, taç 15,7 → 13,2 sn; 2026'da 4 kale vuruşu kornere, 12 taç rakibe çevrildi [The Analyst, yeni kurallar](https://theanalyst.com/articles/premier-league-rules-throw-ins-goal-kicks-ball-in-play).

### F.0.4 Duran topların gol payı

- Premier Lig 2025/26: penaltı dışı duran toplardan gelen gollerin payı **%27,4** (34 sezonun ikinci en yükseği; önceki sezon %20,6); yalnız kornerler **%18** (önceki %12,1) [The Analyst FPL 2026/27](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27).
- 2022/23: gollerin %13,9'u kornerden, şutların %15,1'i korner sonrası [The Analyst 2022/23 korner](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending). 2024/25 (sezon içi): gollerin %11,8'i korner durumlarından, kornerlerin %3,0'ı gol [The Analyst Championship](https://theanalyst.com/articles/championship-corners-2024-25-goals-stats-opta).
- Championship 2024/25: 1.932 korner, 712'sinde (%36,8) ilk akışta şut, 56'sında gol (%2,9), kornerlerin gol payı %12,4; ortalanan kornerlerin %62'si içe dönen; Hull kornerlerinin %59,5'ini kısa kullandı [aynı kaynak](https://theanalyst.com/articles/championship-corners-2024-25-goals-stats-opta).
- Brentford yardımcı antrenörü Brian Riemer: "her maçta yaklaşık 60 duran top durumu" (santra, taç, korner, kenar ve merkez serbest vuruşlar dahil oyun kitabı) [Training Ground Guru 2021](https://archive.trainingground.guru/articles/brentford-bring-their-set-piece-prowess-to-the-premier-league).

---

## F.1 KORNER (corner kick)

### F.1.0 Genel sayılar

**Teslimat türü payları.** Premier Lig 2025/26: 2.643 içe dönen (inswinging) korner, 541 dışa dönen (outswinging) — ortalananların yaklaşık %83'ü içe dönen (hesap) [The Analyst FPL](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27). 2022/23'te takımlar kutuplaşmıştı: Arsenal 165 ortalanan kornerin 154'ünü içe, Liverpool 212'nin 155'ini dışa dönen attı [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending). Arsenal'de dışa dönen payı %0,7 (Şubat 2024) [Training Ground Guru](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners); 2024/25'te Arsenal %96, Brentford %98 içe dönen; Bournemouth 2025/26'da %96,4 [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525), [The Analyst FPL](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27).

**Kısa korner payı (ligi).** 2015/16–2020/21 arası %16–18, 2021/22 %14, 2022/23 %17,7, 2023/24 ilk 5 hafta %20,6 [The Analyst, Arsenal–Tottenham](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners). Takım uçları: Man Utd %34,2 (2022/23), Tottenham %36,6 ve Man City %33,9 (2024/25), Arsenal %5 (2024/25, ligin en düşüğü), Everton %95,4 ortalanan (2022/23) [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending), [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525).

**Verim (2022/23, Premier Lig).** İlk temastan şut: içe dönen %16,9, dışa dönen %25,1; ilk şutun ortalama xG'si: içe 0,14, dışa 0,08; doğrudan gol: içe %1,32, dışa %1,25; akış içinde şut: içe %34,9, dışa %44,4; akış içinde gol: içe %4,2, dışa %4,1. Ortalanan vs kısa: doğrudan şut %20,8 vs %2,8; akışta şut %38,5 vs %32,6; akışta gol %4,1 vs %3,3. Hedef bölge (6 pas içine ortalananlar): ön direk — korner başına şut %13,2, gol %1,6, şut başına xG 0,12; merkez — %12,2, %1,5, xG 0,27; arka direk — %25,8, %3,1, xG 0,17 [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending).

**Gol oranı.** 2025/26 (Mart 2026, 301 maç): kutuya ortalanan 2.564 kornerden 123 gol, **her 20,8 ortalanan kornerde bir gol** (yaklaşık %4,8; ikinci aşama dahil olabilir, tanım makalede açık değil) [The Analyst, uzun taç](https://theanalyst.com/articles/premier-league-long-throws-waste-of-time). 2024/25: kornerlerin %3,0'ı gol [The Analyst Championship](https://theanalyst.com/articles/championship-corners-2024-25-goals-stats-opta). 2023/24: Arsenal 16,4 kornerde bir gol (ligin en iyisi), Man Utd 67'de bir [The Analyst, Man Utd](https://theanalyst.com/articles/are-manchester-united-really-that-bad-at-corners). 2011/12 verili eski çalışmada kornerlerin %2,2'si gol (Harvard Sports Analysis, 2014 — sayfa açılamadı, arama özetinden; **ikincil aktarım**) [Harvard](https://harvardsportsanalysis.org/2014/09/spatial-analysis-of-corners/). 2025/26 sezon başı anlık görüntü: 14 korner golü 19,2 xG'den; korner xG'si maç başına 0,38 (önceki 0,46) [The Analyst insight feed](https://theanalyst.com/articles/premier-league-insight-feed/) **(sezon başı anlık görüntü)**.

**İlk temas (first contact).** Hücumun ilk topu kazanma oranı takım aralığı: Arsenal %21,1 (2022/23; Villa %17,5 ile tek daha düşük), Tottenham %27,4 (2022/23) → %47,1 (2023/24 başı) [The Analyst, Arsenal–Tottenham](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners). Savunma tarafı: Man Utd'un karşılaştığı kornerlerin %50,4'ünde ilk temas rakibin; Bournemouth %54, Everton %59,5; içe dönenlerde Man Utd %33,9, West Ham %37,3 (2023/24) [The Analyst, Man Utd](https://theanalyst.com/articles/are-manchester-united-really-that-bad-at-corners). Oyuncu: Gabriel 2024/25'te 11 ilk temas (%13,4, ligin en çoğu), Tarkowski %15,8 oran [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525).

**Kutudaki oyuncu sayısı.** Arsenal korner başına 6 pas içinde ortalama 3,31 oyuncu (Şubat 2024), başka hiçbir takım 2,93'ü geçmiyor [Training Ground Guru](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners); 2022/23 Arsenal 3,23, Tottenham 2,71 [The Analyst, Arsenal–Tottenham](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners). Brentford genelde 10 saha oyuncusunu ileri taşır: 6 kutuda, 3 "çember" (ringing) geriden geç koşu ve kontra örtüsü [Training Ground Guru 2021](https://archive.trainingground.guru/articles/brentford-bring-their-set-piece-prowess-to-the-premier-league).

**Vurucu ayağı ve dönüş yönü (geometri).** İçe dönen korner, sağ köşeden solak, sol köşeden sağ ayaklı vurucuyla atılır; dışa dönen tersidir. Örnek: Arsenal'de Saka (solak) sağdan, Rice (sağ ayak) soldan içe dönen atar [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525); Liverpool dışa dönen takımıydı (2022/23) [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending).

**Korner savunma sistemleri.** 2013 çalışması (436 korner, 50 Premier Lig maçı): kornerlerin %90,1'inde bire bir (man-to-man), %9,9'unda bölge; bölge takımları daha az gol ve şut yedi ama sistem ile şut sayısı arasında anlamlı ilişki bulunmadı (Pulling et al., 2013; özet arama sonucundan, sayfa açılamadı — **ikincil aktarım**) [IngentaConnect](https://www.ingentaconnect.com/content/uwic/ujpa/2013/00000013/00000001/art00012). Bugün çoğu kulüp karma (hybrid) oynar: West Ham 6 pas boyunca 5 bölge + 3 adam + 2 serbest; Liverpool 6 pas içinde 6 bölge (biri kaleci önünde çizgiye yakın) + kenarda 2; Tottenham ön direkte üçgen + 6 pas kenarında 4–5 bölge, 11 oyuncu ceza sahasında; Man City kaleci etrafında 5 kişilik yay + 4 agresif bire bir + 1 serbest; Arsenal 6 pas içinde 4 bölge (ön direkte 2, merkez 1, arka 1) + diğerleri adam; Forest ve Bournemouth ağırlıklı adam (Bournemouth 9 gol yedi) [Premier League, korner savunması](https://www.premierleague.com/news/2982222) (sezon makalede belirtilmemiş). Bloklara karşı: dörtlü/beşli düz hat (Newcastle), "blokçuyu blokla", serbest adam bırak, hakemi önceden uyar [Training Ground Guru](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners).

**Kaleci.** Kaleci çıkış/yumruk oranları için güncel lig tablosu **(bulunamadı)**; 6 pas kalabalığının "kalecinin çıkıp yumruklama imkânını kısıtladığı" Opta yorumu var [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525).

---

### F.1.1 İçe dönen korner, 6 pas merkezine (Inswinging corner to the centre of the six-yard box)

- **Tür ve bağlam:** korner; her skor/dakikada; önde olan takım kutuya daha az adam yollar **(tahmin)**. Arsenal/Jover ve Brentford okulunun varsayılanı (%96–98 içe dönen).
- **Sahne akışı (saniye saniye):** 0 s top dışarı, hakem korner işareti; 0–10 s vurucu köşeye yürür, top toplayıcı topu verir (ortalama toplam duruş 33,9 sn; alt evreler **tahmin**); 10–25 s kutu yerleşimi: hücum bir "küme" (cluster) ile arka direkte ya da penaltı noktasında toplanır, savunma bölge/adam dizilir, kaleci çizgiden 1–2 m önde, ön direğe yakın durur **(tahmin)**; vurucu bayrağın yanında topu yaya koyar, kutuya bakar, kolunu kaldırır (işaret: hedef bölge); 25–28 s vurucu 3–5 adım geri, 30–45° açıyla koşu **(tahmin)**; vuruş; top 1,2–2,0 sn havada **(tahmin; 35–40 m, 20–25 m/sn)**; ilk temas 6 pas çizgisi civarında; 2–8 sn ikinci top.
- **Roller ve hareket:** hedef (target) oyuncu geç ve momentumlu gelir, başlangıç noktasını değiştirme serbestliği ondadır (Gabriel); diğerleri aldatma (decoy) ve blokçu; küme korner atılırken merkeze kayar [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525). Kenarda 2–3 "çember" oyuncusu ikinci top ve kontra örtüsü (Brentford) [TGG 2021](https://archive.trainingground.guru/articles/brentford-bring-their-set-piece-prowess-to-the-premier-league).
- **Topun yolu:** içe dönen, kale çizgisine doğru kıvrılan, 6 pasın ortasına, kaleci ile savunma arasına; sağ köşeden solak, sol köşeden sağ ayak.
- **Başarı ölçüsü:** içe dönende ilk temastan şut %16,9 ama şut başına xG 0,14; merkez bölgesine kornerlerde şut başına xG 0,27 (ilk temasta gol %12,5) [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending). Arsenal 2023/24: 10 korner golü (lig birincisi), 16 ile West Brom 2016/17 rekoruna eşitlendi; Jover'dan beri (2021–) 46 korner golü [Premier League Talking Tactics](https://premierleague.com/news/3865986), [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners), [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525).
- **Panzehir:** 6 pas çizgisinde düz ve güçlü bölge hattı, kaleci önünde çizgi oyuncusu (Liverpool), en iyi kafacıyı serbest bırakıp topa gitme hakkı; kalecinin çıkış alanını boşaltacak şekilde kalabalığı itme; hakeme blok uyarısı [Premier League, korner savunması](https://www.premierleague.com/news/2982222), [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners).
- **Kabiliyet eşiği (öneri):** vurucu: orta/falso ve tutarlılık yüksek; hedef: kafa, zıplama, güç ve zamanlama; blokçular: güç ve denge; kaleci: çıkış cesareti. Sayısal eşikler motorun kabiliyet ekonomisinde tanımlanır.
- **Hoca tarzı ve uzman etkisi:** uzman antrenör (Jover, Cueva) bu rutinin varsayılan oranını yükseltir; Arsenal örneğinde xG beklentisinin üstünde gol (13 gol/11,0 xG, 2022/23) [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending).
- **Ünlü örnek:** Gabriel'in West Ham'a ön direğe dalarak attığı eğilerek kafa golü (Saka'dan içe dönen), Timber'ın Paquetá'yı topun altına itmesi [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525).
- **Kaynaklar:** yukarıdaki bağlantılar.

### F.1.2 Dışa dönen korner, penaltı noktası / ikinci 6 pas bölgesi (Outswinging corner to the penalty spot)

- **Tür ve bağlam:** korner; topu kaleciden uzaklaştırıp koşarak gelen kafacıya vermek isteyen takımlar (Liverpool 2022/23: 212 ortalanan kornerin 155'i dışa dönen; ilk temasların %54,0'ı ikinci 6 pas bölgesinde) [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending).
- **Sahne akışı:** F.1.1 ile aynı; fark koşu başlangıcıdır: kafacılar ceza sahası çizgisi / penaltı yayı yakınından başlayıp topa doğru koşar (koşuyla kafa), savunma geri geri giderken topa ulaşmak zordur **(tahmin)**.
- **Roller ve hareket:** 3–4 koşucu: penaltı noktasına, ön direk gerisine, arka direk gerisine; bir oyuncu kaleci önünde çizgide (perde); 2 oyuncu kenarda ikinci top.
- **Topun yolu:** kaleden dışarı kıvrılan, 6 pas çizgisinin 2–4 m önüne; sağ köşeden sağ ayak, sol köşeden solak.
- **Başarı ölçüsü:** ilk temastan şut %25,1 (içe dönenden fazla) ama şut başına xG 0,08; akışta şut %44,4, gol %4,1 — toplam gol verimi içe dönenle hemen hemen aynı [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending). 2025/26'da ligde yalnız 541 dışa dönen var (azınlık) [The Analyst FPL](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27).
- **Panzehir:** koşu yollarını kesen adam markajı + 6 pas kenarında bölge; kaleci çizgide kalır (top kendisinden uzaklaşır); ikinci top için kenarda 2 oyuncu.
- **Kabiliyet eşiği (öneri):** kafacıların koşarak sıçrama ve zamanlama; vurucunun mesafe tutarlılığı; savunmada geri geri sıçrama zayıflığı modellenir.
- **Hoca tarzı:** içe/dışa seçimi hocanın yapısal tercihidir; Tottenham rakibin bölge/adam oynamasına göre karıştırır (2023/24: 14 içe, 9 dışa) [The Analyst, Arsenal–Tottenham](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners).
- **Ünlü örnek:** Liverpool 2022/23 (12 korner golü) [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending).

### F.1.3 Ön direk sıyırma (Near-post flick-on)

- **Tür ve bağlam:** korner; alçak/sert içe dönen ya da düz (straight) teslimat; rakibin ön direğe tek bölge oyuncusu koyduğu durumlar.
- **Sahne akışı:** yerleşme sırasında bir "sıyırıcı" (flicker) 6 pas köşesinin biraz önünde, markajcısının önünde pozisyon alır; vurucu kol işaretiyle ön direği gösterir **(tahmin: takım kodları)**; vuruş; top ~1 sn'de ön direğe gelir **(tahmin)**; sıyırıcı kafayla arka direğe ya da kale önüne yön değiştirir; arka direkte 1–2 bitirici bekler.
- **Roller ve hareket:** sıyırıcı (uzun boylu olmak zorunda değil, zamanlama); arka direk bitiricisi; penaltı noktasında geri sekme oyuncusu; kenarda 2 ikinci top.
- **Topun yolu:** sert, alçak yay, ön direğe; çizgiye yakın.
- **Başarı ölçüsü:** ön direk hedefli kornerlerde korner başına şut %13,2, gol %1,6 (2022/23); Tottenham kornerlerinin %19'u ön 6 pas bölgesine (%29 dışarısı dahil) [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending). Sıyırmanın sonraki temasa dönüşme oranı **(bulunamadı)**.
- **Panzehir:** ön direk üçgeni (Tottenham), ön direkte iki bölge oyuncusu (Arsenal), kalecinin ön direğe yakın başlangıcı [Premier League, korner savunması](https://www.premierleague.com/news/2982222).
- **Kabiliyet eşiği (öneri):** sıyırıcının kafa yönlendirme ve zamanlama; vurucunun alçak-sert teslimat hassasiyeti.
- **Ünlü örnek:** Richarlison'ın Sheffield United'a Perišić'in içe dönen ön direk ortasından attığı kafa golü (doğrudan bitiriş; sıyırma değil) [The Analyst, Arsenal–Tottenham](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners). Klasik sıyırma örneği kaynaklı **(bulunamadı)**.

### F.1.4 Arka direk yığılması / uzak direk aşırı yüklemesi (Back-post overload)

- **Tür ve bağlam:** korner; rakip ön direğe ve 6 pas merkezine çok bölge oyuncusu koyuyorsa.
- **Sahne akışı:** yerleşmede 3–4 hücumcu arka direk hizasında, markajcılarıyla birlikte; koşu anında işaretli oyuncular 6 pas boyunca öne koşup markajcılarını sürükler, serbest oyuncu arkada kalır (4v2 / 4v3 tuzağı); top uzak direğe gelir; kontrol-şut ya da kafa.
- **Roller ve hareket:** sürükleyiciler (3), serbest bitirici (1, arkada "bölgede kalır"), penaltı noktasında geri top için 1.
- **Topun yolu:** içe ya da dışa dönen derin orta, 6 pasın arka köşesinin ötesine.
- **Başarı ölçüsü:** arka direk hedefli kornerlerde korner başına şut %25,8, gol %3,1 (ligdeki en yüksek bölge oranı, 2022/23) [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending).
- **Panzehir:** arka direk bölgesinde bir "serbest" savunmacı (City'nin 5'li yayı), sürüklenmeyen adam markajı (markajcı koşuyu bırakıp bölgede kalır).
- **Kabiliyet eşiği (öneri):** vurucunun uzun mesafe ve yükseklik kontrolü; bitiricinin hava/gelişine vuruş.
- **Ünlü örnek:** Rice'ın Man Utd'a uzak direkten golü (Jesus ve Gabriel Evans'ı sürükleyip 4v2 yarattı); Jesus'un Brighton'a 4v3 tuzağından golü (van Hecke'nin istemsiz sıyırması) [Premier League Talking Tactics](https://premierleague.com/news/3865986).

### F.1.5 Perdeleme / blok ile serbest kafacı (Blocking and screening)

- **Tür ve bağlam:** korner; adam markajı ya da karma savunmaya karşı; hedef kafacıyı rakibin en iyi savunmacısından ve kaleciden ayırmak.
- **Sahne akışı:** blokçu, hedef markajcının görmediği yerde (arkasında) başlar, "üstünde durmaz" ki blok anlaşılmasın; korner atılırken markajcının koşu yoluna yan dönerek girer, alçak gövde, güçlü taban, hafif eğilerek temas (itme değil, duruş) [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners); ikinci blokçu kaleci önüne durur (perde); hedef 2–3 m serbest kalır.
- **Roller ve hareket:** 2–4 blokçu, 1 hedef, 1 aldatma koşucusu (ön direğe sürükleme), 1 kenar ikinci top.
- **Topun yolu:** içe dönen, 6 pas merkezine (perdelenen kalecinin önüne).
- **Başarı ölçüsü:** doğrudan oran **(bulunamadı)**; Arsenal'in 2023/24 Premier Lig'de 16 korner golü (rekor eşiti), 2024/25'te 6 pas içinde ortalama 3,31 oyuncu [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners). Hakem toleransı: "şu an hakemler büyük ölçüde bırakıyor" (Coulston) [aynı].
- **Panzehir:** düz hat 4–5 bölge (bloklanması zor), "blokçuyu blokla", serbest adam, hakemi maçtan önce uyarma [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners); VAR: bloklar faul sayılırsa gol iptali riski (motor için: blok şiddeti ile faul olasılığı bağlanır).
- **Kabiliyet eşiği (öneri):** blokçuda güç/denge/zeka (zamanlama), hedefte kafa; hakem profiliyle faul olasılığı.
- **Hoca tarzı:** Jover'ın imzası; eski Brentford koçları (Jover, Cueva, Georgson) Premier Lig'e yayıldı [Sky Sports](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree).
- **Ünlü örnek:** Gabriel'in Tottenham'a golünde White ve Saliba'nın Vicario'nun önünde Maddison ve van de Ven'i kesmesi (6 m'den serbest kafa); Palace 5-0'da Trossard'ın Andersen'i, White'ın Henderson'ı bloklaması; Forest maçında 4 blokla Gabriel'in arka direkte yalnız kalması [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525), [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners).

### F.1.6 "Tren" / küme koşusu (The train / cluster run)

- **Tür ve bağlam:** korner; adam markajına karşı; küme olarak başlayıp farklı yönlere dağılan koşular markajcıları birbirine dolar. Basında "tren" ya da benzeri adlarla anılan bu kalıbın adlandırması kaynakla **doğrulanmadı**; West Brom 2016/17 sezonunun 16 korner golüyle rekor kırdığı kaynaklı [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners).
- **Sahne akışı:** 4–5 hücumcu penaltı noktası civarında art arda / yan yana dizilir; vurucu kolunu indirince (ya da koşuya başlayınca) öndeki ön direğe, ikinci merkeze, üçüncü arka direğe koşar, sonuncu penaltı noktasında kalır; markajcılar aynı anda farklı yönlere açılmak zorunda kalır; top koşuların kesişim bölgesine gelir.
- **Roller ve hareket:** tren başı (ön direk sürükleme), gövde (merkez), kuyruk (penaltı noktası, geri top), arka direk bitiricisi.
- **Topun yolu:** genelde içe dönen, 6 pas merkezi/arkası.
- **Başarı ölçüsü:** doğrudan ölçüm **(bulunamadı)**; Arsenal'in Burnley'e "ön direk hücumu" (küme arka direkte toplanıp orta gelirken ön direğe fırladı, Saliba Trafford'un arkasından yay çizerek 1 m'den kafa) ve Sheffield United'a benzer rutin [Premier League Talking Tactics](https://premierleague.com/news/3865986); Atlético maçında Arsenal'in kümeyle savunmayı sürükleyip Martinelli'nin blokuyla Gabriel'e serbest kafa [UEFA](https://it.uefa.com/uefachampionsleague/news/029e-1f09b4c02fc6-e335dc1d5848-1000--champions-league-performance-insights-arsenal-s-set-piece-s/).
- **Panzehir:** karma sistem — küme karşısında adam yerine bölge (koşuya bakmaz, alana bakar); ön direkte sabit üçgen.
- **Kabiliyet eşiği (öneri):** koordinasyon (takım antrenman düzeyi) ve koşu hızı; hedefin sıçrama zamanlaması.
- **Hoca tarzı:** çok çalışılmış rutin; uzman antrenörü olmayan takımda başarısızlık (yanlış zamanlama, ofsayt yok ama çarpışma) olasılığı artar **(tahmin)**.

### F.1.7 Penaltı noktasına geç koşu (Late run to the penalty spot)

- **Tür ve bağlam:** korner; savunma 6 pasa yığıldığında ikinci dalga; sıklıkla orta saha oyuncusu.
- **Sahne akışı:** koşucu ceza sahası çizgisinin dışında ya da penaltı yayında "ilgisiz" durur; vurucu koşuya başlayınca 3–4 adımla penaltı noktasına girer; top ya doğrudan oraya gelir (dışa dönen) ya da ilk kafadan geri seker; gelişine vuruş ya da kafa.
- **Roller ve hareket:** geç koşucu, önde sürükleyici 3–4 oyuncu, kenarda 1 örtü.
- **Topun yolu:** dışa dönen penaltı noktasına ya da içe dönenden ikinci top.
- **Başarı ölçüsü:** korner sonrası ikinci aşama golleri Arsenal 2023/24'te 2 (toplam 13 duran top golünün) [Premier League Talking Tactics](https://premierleague.com/news/3865986); ligi oranı **(bulunamadı)**.
- **Panzehir:** kenarda 2 serbest oyuncu (Liverpool, West Ham düzeni), penaltı noktasını kapatan bölge oyuncusu [Premier League, korner savunması](https://www.premierleague.com/news/2982222).
- **Kabiliyet eşiği (öneri):** gelişine vuruş ve uzaktan şut; ofsayt yok (kornerden gelen topta ofsayt olmaz), ikinci topta ofsayt var.
- **Ünlü örnek:** Gabriel'in Palace'a golünde penaltı noktasından başlayıp Richards'tan sıyrılarak uzak direğe gitmesi (ters yönde geç koşu) [Premier League Talking Tactics](https://premierleague.com/news/3865986).

### F.1.8 Kısa korner ile açı değiştirme (Short corner / two-man corner)

- **Tür ve bağlam:** korner; hava topunda zayıf, ayakta güçlü takımlar; rakibin kalabalık 6 pas bölgesini kıpırdatmak; skor önde ve zaman geçirme (kısa korner topu tutma seçeneğidir).
- **Sahne akışı:** ikinci oyuncu korner yayına 5–8 m yaklaşır; savunmadan 1–2 oyuncu çıkmak zorunda kalır (çıkmazsa 2v1); kısa pas; geri pas vurucuya (açı değişir, vurucu şimdi iki ayağıyla da ortalayabilir) ya da çapraz sürüş ve ceza sahası kenarına geri çekme (cut-back); ortalama kutuya 4–8 sn sonra gelir **(tahmin)**.
- **Roller ve hareket:** vurucu + kısa seçenek; kutuda 3–4 oyuncu yeniden yerleşir (ikinci dalga), kenarda şutör.
- **Topun yolu:** yer pası → geri → farklı açıdan yüksek orta; ya da alçak kesme.
- **Başarı ölçüsü:** kısa kornerde doğrudan şut %2,8, akışta şut %32,6, gol %3,3 (ortalanan: %4,1); 2022/23'te 124 korner golünün 24'ü kısa kornerden; Man Utd 2023/24'te kısa kornerlerin %37'sinde şut (ortalananlarda %34,7) [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending), [The Analyst, Arsenal–Tottenham](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners), [The Analyst, Man Utd](https://theanalyst.com/articles/are-manchester-united-really-that-bad-at-corners). Championship'te Hull %59,5 kısa kornerle korner xG'si 1,92 (dördüncü en düşük) [The Analyst Championship](https://theanalyst.com/articles/championship-corners-2024-25-goals-stats-opta).
- **Panzehir:** kısa kornere 2 oyuncu çıkar (2v2), kalan kutu yeniden dizilir; UEFA gözlemi: kısa korner savunmanın düzenini bozar [UEFA Atlético](https://www.uefa.com/uefachampionsleague/news/0270-13ed100a034f-407ca37ea8f5-1000--in-the-zone-porto-1-3-atletico-performance-analysis).
- **Kabiliyet eşiği (öneri):** pas/ilk kontrol, sürüş; ikinci dalga zamanlaması.
- **Hoca tarzı:** Ten Hag dönemi Man Utd, Guardiola City, Postecoglou Tottenham yüksek kısa korner; Arteta Arsenal 2022/23'te %24,7 iken 2024/25'te %5'e indi (Jover'ın yön değişimi) [The Analyst, Arsenal–Tottenham](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners), [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525).
- **Ünlü örnek:** Trossard'ın Everton'a kısa kornerden galibiyet golü (2023/24) [The Analyst, Arsenal–Tottenham](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners).

### F.1.9 Ceza sahası dışına kesme ve ikinci top düzeni (Cut-back to the edge / second-ball structure)

- **Tür ve bağlam:** korner; rakip 11 oyuncuyla ceza sahasında (Tottenham tipi düşük blok) ve uzaktan şut iyi olduğunda; her kornerde "ikinci top" planı zaten olmalı.
- **Sahne akışı:** kutudaki küme savunmayı 6 pasa çeker; top alçak ve sert şekilde penaltı yayına/ceza sahası çizgisine kesilir (ya da ilk kafa geri çevrilir); yaydaki şutör gelişine vurur; 2 çember oyuncusu kontra örtüsü için hazırdır.
- **Roller ve hareket:** 3 çember (ring) oyuncusu — ikisi geç koşu, biri örtü; kutuda 6 (Brentford düzeni) [TGG 2021](https://archive.trainingground.guru/articles/brentford-bring-their-set-piece-prowess-to-the-premier-league).
- **Topun yolu:** alçak, düz, 16–20 m'ye; ya da kafayla geri.
- **Başarı ölçüsü:** doğrudan oran **(bulunamadı)**; korner sonrası tüm şutlar: Championship'te korner durumlarından 809 şut = şutların %18,6'sı [The Analyst Championship](https://theanalyst.com/articles/championship-corners-2024-25-goals-stats-opta); Brentford 2021/22 başında korner başına 0,07 xG ile lig birincisi (en az kornerle) [TGG 2021](https://archive.trainingground.guru/articles/brentford-bring-their-set-piece-prowess-to-the-premier-league).
- **Panzehir:** kenarda 2 serbest oyuncu ve uzaklaştırma sonrası hızlı çıkış (kontra): Brentford'un 2021 play-off yarı finalinde kontradan gol yemesi tek istisna olarak anılır [aynı].
- **Kabiliyet eşiği (öneri):** uzaktan şut, gelişine vuruş; örtü oyuncularında hız.

### F.1.10 Kaleciyi perdeleme ve 6 pas kalabalığı (Goalkeeper screening / crowding the keeper)

- **Tür ve bağlam:** korner; kaleci çıkışı güçlü olan rakiplere; VAR çağında faul sınırında.
- **Sahne akışı:** bir hücumcu kalecinin 1 m önünde, kale çizgisine paralel durur; korner anında kaleciyi tutmaz ama yolunu kapatır (temas varsa faul riski); kalabalık 6 pasın içinde 3+ hücumcu [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners); top kaleci önüne, elinin ulaşamayacağı yüksekliğe değil, kafa yüksekliğine gelir.
- **Roller ve hareket:** perde (1), hedef (1), blokçular (2), aldatma (1).
- **Topun yolu:** içe dönen, kaleci çizgisine yakın.
- **Başarı ölçüsü:** Opta: Arsenal 6 pas kalabalığıyla "rakip kalecinin çıkıp yumruklama imkânını kısıtlıyor" [Premier League, Gabriel](https://www.premierleague.com/en/news/4183525); oran **(bulunamadı)**.
- **Panzehir:** kalecinin önüne kendi savunmacısı (Liverpool'un çizgi oyuncusu), perdeyi iten değil pozisyon alan savunmacı; hakem/VAR uyarısı.
- **Kabiliyet eşiği (öneri):** kalecinin çıkış ve yumruk; perde oyuncusunun disiplin (faul olasılığı hakem profiline bağlanır).
- **Ünlü örnek:** White'ın Foderingham'a baskısıyla Nketiah'ın Sheffield United'a attığı dönen top golü; White'ın Vicario'yu rahatsız etmesi sonrası Havertz'in kafa golü [Premier League Talking Tactics](https://premierleague.com/news/3865986), [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners).

### F.1.11 Alçak sert içe dönen korner, ön direk dalışı (Low driven inswinger, near-post dive)

- **Tür ve bağlam:** korner; ön direkte zayıf savunma ya da kalecinin çizgide beklediği durumlar; rüzgâr yoksa.
- **Sahne akışı:** vurucu daha düz (10–20°) açıyla gelir, topun alt-ortasına değil ortasına vurur **(tahmin)**; top 1–1,5 m yükseklikte, ~1 sn'de ön direğe **(tahmin)**; ön direğe dalan oyuncu kafayla kaleye ya da kale önüne yönlendirir; ikinci oyuncu kale ortasında dokunuşa hazır.
- **Roller ve hareket:** dalış kafacısı (ön direk), bitirici (kale ortası, 2 m), sürükleyici arka direkte.
- **Topun yolu:** düz, alçak, hızlı içe dönen.
- **Başarı ölçüsü:** ön direk bölgesi korner başına gol %1,6, ilk temasta gol %11,8 [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending).
- **Panzehir:** ön direk üçgeni/ikilisi, kalecinin ön direk yakını başlangıcı.
- **Ünlü örnek:** Arsenal–Chelsea 2022/23: Saka'nın alçak içe dönen kornerine Saliba'nın ön direk dalış kafası, Chelsea savunması çekilince Gabriel'in kale ortasından tamamlaması [The Analyst, Arsenal–Tottenham](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners).

### F.1.12 Karma korner savunması (Hybrid corner defence) — savunma rutini

- **Tür ve bağlam:** savunma; bugün Premier Lig'de norm; saf bölge ya da saf adam istisna.
- **Sahne akışı:** korner işaretinden 10–20 sn içinde yerleşme: 4–6 bölge oyuncusu 6 pas çizgisi boyunca (en iyi kafacılar merkez ve ön direk), 2–4 adam markajcısı rakibin en tehlikeli koşucularında, 1–2 serbest/kenar oyuncusu, kaleci çizgiden 1–1,5 m önde ön direk tarafında **(tahmin)**; kısa kornere 1 (gerekirse 2) oyuncu çıkar; vuruşla birlikte bölge hattı topa doğru adım atar ve sıçrar; uzaklaştırmadan sonra hat çıkar (ofsayt tuzağı ikinci topta).
- **Roller ve hareket:** bölge (zonal), adam (man), direk oyuncusu (post player — bugün nadir, çoğu takımda yok **(tahmin)**), kenar (edge), kısa korner oyuncusu, kontra çıkış oyuncusu.
- **Başarı ölçüsü:** West Ham 0 gol/18 şut/1,1 xG; Liverpool 0/14/1,4; Tottenham 2/23/1,2; Man City 1/14/1,3; Arsenal 1/20/1,4; Bournemouth 9 gol (sezon belirtilmemiş) [Premier League, korner savunması](https://www.premierleague.com/news/2982222). 2023/24: korner sonrası en az bir şuta izin verme — Chelsea %44,9, Luton %44,1, Tottenham %42,7, Man Utd %40,7; korner başına yenilen şut xG'si Man Utd 0,091 (orta sıra); Arsenal 58 kornerden 5 gol yedi (%8,6, en kötü oran) [The Analyst, Man Utd](https://theanalyst.com/articles/are-manchester-united-really-that-bad-at-corners). Pulling 2013: bölge takımları daha az gol yedi ama fark anlamlı değil **(ikincil aktarım)**.
- **Panzehir (hücum açısından):** bölgeye karşı koşuyla gelen kafa ve blok; adama karşı tren/küme ve sürükleme; karma sisteme karşı kısa korner ve açı değişimi.
- **Kabiliyet eşiği (öneri):** bölge oyuncularında kafa/zıplama/pozisyon alma, adam markajcılarında güç ve takip, kalecide çıkış; takımın savunma antrenman düzeyi (ilk temas yüzdesini kaydırır).

---

## F.2 SERBEST VURUŞ (free kick)

### F.2.0 Genel sayılar

**Doğrudan şut dönüşümü (Premier Lig):**

| Sezon | Şut | Gol | Oran | Kaynak |
|---|---|---|---|---|
| 2005/06 | 600 | 28 | %4,7 | [PL 2018](https://www.premierleague.com/news/693397) |
| 2008/09 | 682 | 33 | %4,84 | aynı |
| 2011/12 | 553 | 29 | %5,2 | aynı |
| 2014/15 | 441 | 27 | %6,1 | aynı |
| 2017/18 | 339 | 16 | %4,72 | aynı |
| 2018/19 | 354 | 23 | %6,49 | [PL 2024](https://www.premierleague.com/news/4029342) |
| 2019/20 | 380 | 26 | %6,84 | aynı |
| 2020/21 | 359 | 13 | %3,62 | aynı |
| 2021/22 | 337 | 19 | %5,64 | aynı |
| 2022/23 | 302 | 18 | %5,96 | aynı |
| 2023/24 | 283 | 11 (rekor düşük) | %3,88 | aynı |
| 2025/26 | 251 (2003/04: 621) | — | — | [The Analyst FPL](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27) |

StatsBomb'un 2013 ölçütü: beş sezonda ~2.300 doğrudan serbest vuruş, 15'te 1 (%6,6), sezonlara göre %5,2–8,5 [StatsBomb, shot benchmarks](https://blogarchive.statsbomb.com/articles/soccer/premier-league-shot-benchmarks/). Son on yılın çalışma oranı ~%4–6; motorda başlangıç değeri %5 (merkez yakın, 18–25 m) **(tahmin; bölgeye göre ayrışmış xG bulunamadı)**.

**Neden azalıyor:** daha az şut (hocalar hızlı serbest vuruş ve ortayı teşvik ediyor), daha az ceza sahası yakını faul; gollerin çoğu sapmalı; 2023/24'te yalnız üç oyuncu sapmasız falsolu şutla barajın üstünden attı ve hiçbiri solak değildi; tek kaleci kendi tarafından yenildi (Vicario, Eze) [PL 2024](https://www.premierleague.com/news/4029342), [PL 2018](https://www.premierleague.com/news/693397). Ward-Prowse 2023/24'te 16 denemede 0 gol (Southampton'da 17 serbest vuruş golü) [PL 2024](https://www.premierleague.com/news/4029342); Szoboszlai 2025/26'da 14 denemede 4 gol [The Analyst FPL](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27).

**Baraj ve kaleci (bilim):** QUB sanal gerçeklik çalışması: top barajın arkasından geç görününce kaleci geç hareket eder ve daha az kurtarır; barajsızda kaleci ellerini topa daha çok yaklaştırır; baraj hızlı ve tüm gövde hareketi gerektiren şutlarda "daha faydalı"; öneri: kalecinin topu görmesi önceliklidir, hücum için kalecinin görüşünü kapatmak kazançtır [The Conversation](https://theconversation.com/football-the-wall-can-make-it-harder-to-save-free-kicks-new-research-151869). Baraj sayısı kuralları (mesafeye göre 2–5 kişi) kaynaklı **(bulunamadı)**; yaygın öğreti: 16–20 m merkezde 4–5, 25 m+ 2–3, kenarda 1–2 **(tahmin)**.

**Yatan oyuncu:** 2013 Brezilya Serie B'de Figueirense'li Ricardinho'nun Valdivia'nın vuruşuna karşı barajın arkasına yatması; 2018'de Brozović'in Barcelona'ya karşı "timsah" hareketi; IFAB'a göre yasal (9,15 m'de durmak koşuluyla), yerde el riski [Bolavip](https://bolavip.com/en/world-cup/2026-world-cup-why-do-players-lay-down-behind-the-wall-during-free-kicks).

**Knuckleball fiziği:** Ronaldo tarzı vuruş ~60 mph (~27 m/sn) modellemesi; ~5 devir/sn ile top önce kaleden uzaklaşıp geri kıvrılır, ~3,5 m sapma; dönüşsüz topta Magnus kuvveti olmadığından düzensiz akış ayrılması hareketi öngörülemez kılar [SciTePress 2018](https://www.scitepress.org/Papers/2018/72360/72360.pdf), [Scientific American](https://www.scientificamerican.com/blog/observations/physics-of-free-kicks-the-hidden-advantage-of-long-distance-soccer-shots/). Uzun mesafede hız dönüşten hızlı düştüğü için eğri geç ve ani açılır [aynı].

---

### F.2.1 Merkez yakın: falsolu şut barajın üstünden (Curled free kick over the wall)

- **Tür ve bağlam:** doğrudan serbest vuruş, 18–25 m, merkez ya da yarı merkez; vurucunun ters ayağına açı (sağ ayak için solun biraz sağı) **(tahmin)**.
- **Sahne akışı (saniye saniye; toplam ortalama 74,5 sn [The Analyst, yeni kurallar](https://theanalyst.com/articles/premier-league-rules-throw-ins-goal-kicks-ball-in-play)):** 0 s faul düdüğü; 0–20 s itiraz/kart/tedavi; hakem topu işaretler, 9,15 m'yi adımlar ve sprey çeker (10–15 sn **(tahmin)**); kaleci barajı kurar (direk hizasını elle gösterir, 4–5 oyuncu, en uzun dış tarafta **(tahmin)**); hücum barajın yanına değil 1 m dışına 1–2 oyuncu koyar (kural); vurucular topun başında konuşur, geri çekilir (5–8 adım, 20–45° açı **(tahmin)**); hakem "bekle" işareti, sonra düdük; vurucu 2–4 sn'de koşar; vuruş; top 0,8–1,2 sn havada **(tahmin: 20–25 m, 22–28 m/sn)**; kaleci baraj kenarından açılan topa dalar; sekme/korner/gol.
- **Roller ve hareket:** vurucu (1–2 aday), barajın ucunda açılan/perde yapan 1–2 hücumcu (1 m kuralı), kale önünde sekme için 2–3 oyuncu, ofsayt hattı ceza sahası dışında, arkada 3–4 örtü.
- **Topun yolu:** barajın üstünden ya da dış ucundan, kalecinin uzak üst köşesine; sağ ayakla sağdan sola kıvrılan (kalecinin sağ üstü), solakla tersi.
- **Başarı ölçüsü:** doğrudan şutlarda %3,6–6,8 (sezon); sapmasız falsolu gol 2023/24'te üç tane [PL 2024](https://www.premierleague.com/news/4029342).
- **Panzehir:** doğru baraj hizası (dış direk kapatma), sıçrayan baraj ve altına yatan oyuncu; kaleci açık tarafta 1 adım önde, topu görür **(tahmin + QUB bulgusu)**.
- **Kabiliyet eşiği (öneri):** vurucuda falso/duran top ve güç; kalecide refleks ve pozisyon.
- **Hoca tarzı:** şutu azaltıp hızlı/ortaya çeviren hocalar çoğunlukta [PL 2024](https://www.premierleague.com/news/4029342).
- **Ünlü örnek:** Foden'ın Villa barajındaki boşluktan geçen şutu; Alvarez, Sterling ve Alexander-Arnold'un sapmasız falsoları (2023/24) [PL 2024](https://www.premierleague.com/news/4029342).

### F.2.2 Düşen top / knuckleball (Dipping, low-spin free kick)

- **Tür ve bağlam:** doğrudan vuruş, 25–35 m merkez; güçlü vurucu; barajın üstünden geçecek yükseklikte başlayıp düşen top.
- **Sahne akışı:** F.2.1 gibi; vurucu daha düz açıyla (10–20°) ve geniş duruşla gelir, ayak üstüyle topun ortasına vurur **(tahmin)**; top az dönüşle çıkar; uçuşta sapma düzensiz; kaleci son 10 m'de sapmayı okuyamaz.
- **Roller:** kale önünde 2–3 oyuncu — knuckleball kurtarışları sıklıkla öne sekiyor **(tahmin)**.
- **Topun yolu:** 27 m/sn civarı, 5 dev/sn ya da az; 3,5 m yana sapma örneği [SciTePress 2018](https://www.scitepress.org/Papers/2018/72360/72360.pdf).
- **Başarı ölçüsü:** türe özel oran **(bulunamadı)**; uzun mesafe doğrudan vuruş gol oranı mesafeyle düşer **(tahmin)**.
- **Panzehir:** kaleci topun arkasında kalıp sekmeyi öne vermemeye çalışır; baraj sıçramaz (yüksek top) ya da tek sıçrar **(tahmin)**.
- **Kabiliyet eşiği (öneri):** güç ve özel teknik (nadir); kaleci refleksi.
- **Ünlü örnek:** Ronaldo'nun Telstar/Jabulani ile modellenen vuruşu [SciTePress 2018](https://www.scitepress.org/Papers/2018/72360/72360.pdf).

### F.2.3 Barajın altından alçak şut ve yatan oyuncu (Under-the-wall shot; lying defender)

- **Tür ve bağlam:** doğrudan vuruş 18–24 m; sıçrayan baraj alışkanlığına karşı; bugün yatan oyuncu yüzünden nadir.
- **Sahne akışı:** vurucu normal yay koşusu; baraj sıçrarken top yerden 0–0,5 m yükseklikte barajın altından geçer; kaleci görüşü kapalı; savunma yatan oyuncu koyduysa top yatana çarpar.
- **Roller:** savunmada yatan oyuncu barajın hemen arkasında, 9,15 m'de **(kural)**; kol gövdede.
- **Topun yolu:** yerden/alçak, sert.
- **Başarı ölçüsü:** "barajın altı" gollerinin yatan oyuncuyla geçmişte kaldığı yorumu [Bolavip](https://bolavip.com/en/world-cup/2026-world-cup-why-do-players-lay-down-behind-the-wall-during-free-kicks); oran **(bulunamadı)**.
- **Panzehir:** yatan oyuncu; ya da baraj sıçramaz (QUB: baraj kalecinin görüşünü kapatır, barajsız seçenek de masada) [The Conversation](https://theconversation.com/football-the-wall-can-make-it-harder-to-save-free-kicks-new-research-151869).
- **Kabiliyet eşiği (öneri):** vurucuda alçak sert vuruş hassasiyeti; yatan oyuncuda disiplin (el faulü riski).
- **Ünlü örnek:** Ricardinho 2013; Brozović 2018 "crocodile" [Bolavip](https://bolavip.com/en/world-cup/2026-world-cup-why-do-players-lay-down-behind-the-wall-during-free-kicks).

### F.2.4 İki vurucu ve aldatma (Two takers and the dummy)

- **Tür ve bağlam:** doğrudan vuruş; sağ ve sol ayaklı iki aday topun başında; kaleci hangi köşeyi kapatacağını bilemez.
- **Sahne akışı:** iki vurucu farklı açılarda geri çekilir; düdük; birinci koşar ve topun üstünden geçer (dummy), ikinci vurur; ya da birinci topa hafif dokunur (oyun başlar, baraj hareket eder, 9,15 m kuralı düşer) ve ikinci şut çeker; hücum "ikinci baraj" kurarak kalecinin görüşünü kapatabilir.
- **Roller:** vurucu A (sağ), vurucu B (sol), ikinci baraj (2–3 hücumcu, savunma barajının 1 m dışında).
- **Topun yolu:** dokunuş + şut ya da doğrudan.
- **Başarı ölçüsü:** **(bulunamadı)**; Eze'nin Tottenham'a golü takım arkadaşlarının "ikinci baraj" kurmasıyla geldi [PL 2024](https://www.premierleague.com/news/4029342).
- **Panzehir:** baraj sıçrama kararını vuruşa göre verir, ikinci barajın savunma barajına 1 m'den yakın olmadığını hakem denetler; kaleci "ikinci baraj"ın yanına kayar.
- **Kabiliyet eşiği (öneri):** iki vurucunun kabiliyeti; aldatma zekâsı.
- **Hoca tarzı:** Vio tarzı çok sayıda şema (4.000–4.830 rutin iddiası, basın) [Wikipedia Vio](https://en.wikipedia.org/wiki/Gianni_Vio), [Squawka](https://www.squawka.com/en/tottenham-gianni-vio-set-piece-specialist-analysis/).

### F.2.5 Kenar serbest vuruş: içe dönen orta uzak direğe, ofsayttan dönüş (Wide free kick, inswinger to the far post, offside-line return)

- **Tür ve bağlam:** endirekt/direkt kenar serbest vuruş, 25–40 m, kale çizgisine 10–25 m; savunma hattı ceza sahası çizgisinde ofsayt tuzağı.
- **Sahne akışı:** hücumcular kasten ofsayt pozisyonunda (hattın 2–3 m önünde) durur; vurucu koşuya başlarken geri koşup hattın hizasına gelirler; vuruş anında onside; savunma geri koşarken hücum ileri koşar (momentum farkı); top uzak direğe ya da penaltı noktasına; kafa.
- **Roller:** 3–4 koşucu (ön direk sürükleme, merkez, uzak direk), 1 kaleci perdesi, kenarda 2.
- **Topun yolu:** içe dönen, kale çizgisine kıvrılan (sağ kenardan solak, sol kenardan sağ ayak).
- **Başarı ölçüsü:** Arsenal 2023/24: 2 gol kenar serbest vuruştan (13 duran top golünün) [Premier League Talking Tactics](https://premierleague.com/news/3865986); lig oranı **(bulunamadı)**.
- **Panzehir:** hattı 2–3 m geri çekip ofsayt tuzağını bırakmak; kalecinin erken çıkışı; VAR ofsayt kontrolü (yarı otomatik ofsayt) rutinin gerçekleşme marjını daraltır **(tahmin)**.
- **Kabiliyet eşiği (öneri):** koşucuların zamanlama/zeka, vurucunun orta mesafe hassasiyeti.
- **Ünlü örnek:** Ben White (Bournemouth) ve Gabriel (Liverpool) golleri, ofsayttan dönüş rutiniyle [Premier League Talking Tactics](https://premierleague.com/news/3865986).

### F.2.6 Kenar serbest vuruş: dışa dönen orta (Wide free kick, outswinger)

- **Tür ve bağlam:** kenar serbest vuruş; kaleci çıkışı güçlü rakiplere; koşarak gelen kafacı.
- **Sahne akışı:** F.2.5 ile aynı yerleşim; top kaleden uzaklaşarak penaltı noktası/ikinci 6 pas bölgesine; kafacı koşuyla gelir; ikinci top kenarda.
- **Topun yolu:** dışa dönen (sağ kenardan sağ ayak).
- **Başarı ölçüsü:** **(bulunamadı)**; korner karşılığı: dışa dönende ilk temas şutu daha sık, xG daha düşük [The Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending).
- **Panzehir:** adam markajı koşucularda, kaleci çizgide, penaltı noktası bölge oyuncusu.
- **Kabiliyet eşiği (öneri):** orta mesafe ve kafacı zamanlaması.

### F.2.7 Uzak serbest vuruş: uzun orta ya da oyunu sürdürme (Deep free kick: long delivery vs. keep possession)

- **Tür ve bağlam:** kendi yarı sahası/orta saha serbest vuruşları; skor ve dakika belirleyici: geride ve son 15 dakikada uzun top kutuya (kaleci bile çıkar), öndeyken kısa oynayıp topu tutma.
- **Sahne akışı:** 5–15 sn hızlı yerleşim; uzun toplarda 4–6 oyuncu kutuya yürür, hat ceza sahası çizgisinde; top 40–60 m havada 2–3 sn **(tahmin)**; ilk kafa ve ikinci top.
- **Roller:** hedef kafacı(lar), ikinci top oyuncuları, örtü.
- **Topun yolu:** yüksek, uzun, penaltı noktasına.
- **Başarı ölçüsü:** **(bulunamadı)**; 2025/26'da uzun top eğilimi: kaleci uzun paslarının payı %46,6 (2023/24) → %51,9 (2025/26 başı) [The Analyst, eğilimler](https://theanalyst.com/articles/premier-league-2025-26-trends-tactics-long-throws-long-balls-kick-offs).
- **Panzehir:** hat yüksek tutulur, ilk kafa savunmaya, ikinci top için 6'lı orta saha.
- **Kabiliyet eşiği (öneri):** uzun pas, hava topu.

### F.2.8 Hızlı serbest vuruş (Quick free kick)

- **Tür ve bağlam:** her bölge; savunma dizilmeden; kural: hakem düdük çalmadan kullanılabilir, 9,15 m'den yakın rakip kesse de oyun devam eder [IFAB Law 13](https://www.theifab.com/laws/latest/free-kicks/); rakip kasten engellerse sarı kart.
- **Sahne akışı:** faulden 2–5 sn içinde top durağan hale getirilir ve oynanır; hakem avantaj/kart gerekmiyorsa izin verir; savunma geri koşarken boş alan.
- **Roller:** en yakın oyuncu vurucu, kanatlar derinlik koşusu.
- **Başarı ölçüsü:** **(bulunamadı)**; hocaların hızlı serbest vuruşu teşvik ettiği not [PL 2024](https://www.premierleague.com/news/4029342).
- **Panzehir:** topun başına geçip zaman kazanma (sarı kart riski; "delaying the restart"), hakeme itiraz **(oyun gerçeği)**.
- **Kabiliyet eşiği (öneri):** karar hızı/zekâ ve pas.
- **Motor notu:** hızlı vuruş olasılığı skor-geriye, faul yerinin ilerisinde boş alan ve kart/tedavi yokluğuna bağlanır.

### F.2.9 Baraj dizimi, sıçrama ve kaleci konumu (Wall formation, jump and goalkeeper placement) — savunma rutini

- **Tür ve bağlam:** merkez yakın doğrudan vuruşlar; kaleci yönetir.
- **Sahne akışı:** kaleci ön direğe gidip barajın dış ucunu hizalar (yakın direğin 0,5–1 m dışına taşar **(tahmin)**), 4–5 oyuncu omuz omuza, en uzunlar dış uçta; bir oyuncu barajın arkasına yatar; kaleci açık tarafa (uzak direk) 2–3 m kayar, 1 adım önde, topu baraj kenarından görür; düdük; vuruş anında baraj sıçrar (yüksek top) ya da sıçramaz (knuckleball/alçak) — karar vurucu profiline göre; yatan oyuncu kollarını gövdede tutar.
- **Roller:** baraj (4–5), yatan (1), 1 m kuralını zorlayan hücumcuları izleyen savunmacı, ceza sahasında markaj (3–4), kontra adamı (1).
- **Başarı ölçüsü:** doğrudan vuruşların %94–97'si gol olmuyor (sezon oranları) [PL 2024](https://www.premierleague.com/news/4029342); kötü baraj örnekleri gol üretiyor (Foden/Villa) [aynı].
- **Panzehir (hücum için):** barajın ucunu zorlamak, ikinci baraj, alçak-sert, yatan oyuncu yoksa altından.
- **Kabiliyet eşiği (öneri):** kalecinin organizasyon/iletişim, barajdakilerin cesaret (yüzünü dönmemek) **(tahmin, model parametresi)**.
- **Kaynak:** QUB VR çalışması baraj/kaleci görüşü [The Conversation](https://theconversation.com/football-the-wall-can-make-it-harder-to-save-free-kicks-new-research-151869); 1 m kuralı [IFAB Law 13](https://www.theifab.com/laws/latest/free-kicks/).

---

## F.3 TAÇ (throw-in)

### F.3.0 Genel sayılar

- **Sayı:** maç başına 40–60 taç (Grønnemark) [Sports Gazette](https://sportsgazette.co.uk/?p=28044), [Flashscore](https://www.flashscore.com/news/long-quick-or-clever-the-art-of-the-throw-in-how-football-teams-turned-it-into-a-weapon/GE7KsjjA); Premier Lig toplamı 17.596 (2015/16) → 12.502 (2024/25), neredeyse üçte bir düşüş [The Analyst, uzun taç istatistikleri](https://theanalyst.com/articles/long-throw-ins-premier-league-stats); 2025/26 Ocak'a kadar 8.007 tacın %71,4'ü 8 sn'den uzun duruştan sonra [The Analyst, zaman kaybı](https://theanalyst.com/articles/premier-league-football-time-throw-ins-goal-kicks-substitutions-stats).
- **Süre:** 15,3 sn (2026/27), 17,8–17,9 sn (2025/26), 55 sn+ atılınca 15,4 sn; Dünya Kupası 2026'da 13,2 sn; golle biten taçlar öncesi 28,1 sn (uzun taç kurulumu); Brentford'un üç taç golü 21,2 / 23,4 / 32,3 sn duruştan sonra; Sunderland'ın Chelsea'ye golü 52,4 sn [The Analyst, zaman kaybı](https://theanalyst.com/articles/premier-league-football-time-throw-ins-goal-kicks-substitutions-stats), [The Analyst, yeni kurallar](https://theanalyst.com/articles/premier-league-rules-throw-ins-goal-kicks-ball-in-play). Hızlı taç 15–20 sn'lik alan yaratma penceresi verir (Grønnemark) [Flashscore](https://www.flashscore.com/news/long-quick-or-clever-the-art-of-the-throw-in-how-football-teams-turned-it-into-a-weapon/GE7KsjjA).
- **Tutma (retention):** takımlar genelde "%50 oranında" topu tutar; Liverpool Grønnemark öncesi baskı altında taçta %45,4 (18.), ilk sezonda %68,4 (1.); kayıp kaynağı: beklerin 10–15 m'ye başa/göğse attığı toplar [Sports Gazette](https://sportsgazette.co.uk/?p=28044), [These Football Times](https://thesefootballtimes.co/2020/03/23/liverpools-throw-in-coach-thomas-gronnemark-shares-some-of-his-insights/). Soruda geçen "%48 ortalama" rakamı bu turda kaynaklı **(bulunamadı)**; Grønnemark'ın "%50" ifadesi en yakın değer.
- **Grønnemark'ın sınıflaması — uzun / hızlı / akıllı (long / fast / clever):** uzun taç korner gibidir ve dünya klasmanında atıcı ister; hızlı ve akıllı taçlar "yarı açık oyun"a yakındır; alan yaratma ilhamı basketboldan [Flashscore](https://www.flashscore.com/news/long-quick-or-clever-the-art-of-the-throw-in-how-football-teams-turned-it-into-a-weapon/GE7KsjjA), [Sports Gazette](https://sportsgazette.co.uk/?p=28044). Dünya rekoru 51,33 m (Grønnemark); iyi atıcı en az 34 m; "6 pasa atamıyorsa kullanma" [Flashscore](https://www.flashscore.com/news/long-quick-or-clever-the-art-of-the-throw-in-how-football-teams-turned-it-into-a-weapon/GE7KsjjA), [Sky Sports](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree). Çalıştığı kulüpler: Midtjylland, Liverpool (2018–2023), Brentford, Viborg, Silkeborg, Horsens; şimdi Arsenal [Wikipedia Grønnemark](https://en.wikipedia.org/wiki/Thomas_Gr%C3%B8nnemark), Trabzonspor'da görev fotoğraf altyazısında [Flashscore](https://www.flashscore.com/news/long-quick-or-clever-the-art-of-the-throw-in-how-football-teams-turned-it-into-a-weapon/GE7KsjjA).
- **Uzun taç (Opta tanımı: ≥20 m ve rakip ceza sahasında biten):** maç başına 0,89 (2020/21) → 1,52 (2024/25) → 3,03 (2025/26 başı) → 3,92 (Mart 2026); goller 5 (2023/24), 14 (2024/25; 15,9 xG), 24 (Mart 2026; 1.179 denemede, **her 49,1 uzun taçta bir gol**, korner 20,8'de bir); Tottenham 74 uzun taç 0 gol [The Analyst, uzun taç](https://theanalyst.com/articles/premier-league-long-throws-waste-of-time), [The Analyst, eğilimler](https://theanalyst.com/articles/premier-league-2025-26-trends-tactics-long-throws-long-balls-kick-offs). Brentford 2024/25: taçtan 5 gol, 48 şans, 7,2 xG; 2024/25'te taç durumlarından 19 gol (on yılın en yükseği) [The Analyst, uzun taç istatistikleri](https://theanalyst.com/articles/long-throw-ins-premier-league-stats). Eski Opta tanımı (≥90 ft ≈ 27,4 m): 2012'de taçların %19,4'ü uzun (İngiltere), uzun taç isabeti %69,5; Stoke 399 uzun taçla lider (2012/13) [MLS/Opta](https://mlssoccer.com/news/opta-spotlight-long-throw-ins-are-en-vogue-mls-and-doesnt-figure-slow-down-anyti).

---

### F.3.1 Hızlı taç (Fast throw-in)

- **Tür ve bağlam:** her bölge; rakip dizilmeden; skor gerideyken ve hücum yarı sahasında daha sık **(tahmin)**.
- **Sahne akışı:** top çıkar; en yakın oyuncu 2–4 sn'de topu alır (top toplayıcı/yedek top); rakip 2 m kuralı; atış ileriye koşan ayağa; alan 15–20 sn açık [Flashscore](https://www.flashscore.com/news/long-quick-or-clever-the-art-of-the-throw-in-how-football-teams-turned-it-into-a-weapon/GE7KsjjA).
- **Roller:** atıcı (en yakın), derinlik koşucusu, destek.
- **Başarı ölçüsü:** tutma oranı yüksek **(tahmin)**; hızlı atmanın rakip düzenliyse "yapılabilecek en kötü şey" olabileceği uyarısı [Sports Gazette](https://sportsgazette.co.uk/?p=28044).
- **Panzehir:** taç noktasına ilk savunmacı 2 m'de durur, hat düşer.
- **Kabiliyet eşiği (öneri):** zekâ/karar hızı.

### F.3.2 Akıllı taç: gel-git, çizgi boyu, beke geri, içe (Clever throw-in: come-and-go, down the line, back to the full-back, inside)

- **Tür ve bağlam:** baskı altındaki taçlar (kendi yarı sahası ve orta); amaç topu tutmak.
- **Sahne akışı:** atıcı 4–6 sn'de hazır; üç alıcı üçgen kurar: biri çizgi boyunca derine gidip geri gelir (gel-git), biri içe (orta saha), biri atıcının gerisinde bek; markajcıların arkasına dönüş koşusu; atış gelen ayağa, ilk dokunuş atıcıya geri (duvar pası) ya da içeri; atıcı hemen sahaya girip ikinci pas seçeneği olur.
- **Roller:** atıcı, gel-git koşucusu, içe alıcı, geri bek, üçüncü adam.
- **Başarı ölçüsü:** Liverpool %45,4 → %68,4 [Sports Gazette](https://sportsgazette.co.uk/?p=28044); Robertson'un boş alanı görmeyi öğrenmesi [These Football Times](https://thesefootballtimes.co/2020/03/23/liverpools-throw-in-coach-thomas-gronnemark-shares-some-of-his-insights/).
- **Panzehir:** taç presi (F.3.5).
- **Kabiliyet eşiği (öneri):** takım antrenman düzeyi (rutin bilgisi), ilk kontrol, hareket zekâsı.

### F.3.3 Uzun taç kutuya (Long throw into the box)

- **Tür ve bağlam:** hücum üçüncü bölgesinde taç; en az 34 m'ye düz atabilen atıcı [Sky Sports](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree); skor gerideyken/berabere; rakibin hava gücü zayıfsa.
- **Sahne akışı (20–32 sn):** top çıkar; atıcı havluyla topu kurutur (gol öncesi Brentford duruşları 21–32 sn) [The Analyst, zaman kaybı](https://theanalyst.com/articles/premier-league-football-time-throw-ins-goal-kicks-substitutions-stats); 4–6 hücumcu 6 pas hizasında dizilir, 2 oyuncu penaltı noktası/ceza sahası çizgisinde ikinci top; atıcı 5–10 m geriden koşar (ya da takla — nadir), iki elle; top 1,5–2,5 sn havada **(tahmin; 30–38 m, ~17–20 m/sn)**, düz ve alçak yay; ön direkte sıyırma ya da doğrudan kafa; ikinci top için ceza sahası çizgisi kapalı; kaleci yumruklarsa ikinci dalga.
- **Roller:** atıcı (Kayode, Pinnock, Jensen, Schade, Onyeka — Brentford "5–7 dünya klasmanı atıcı") [Sky Sports](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree); ön direk sıyırıcı; kale önü bitirici (2); ikinci top (2); örtü (2).
- **Topun yolu:** düz, alçak yay, 6 pasa (ön direk tercih); Delap 30–40 m, ortalama ~38 m, 37 mph'a kadar [Analytics FC](https://analyticsfc.co.uk/blog/2024/06/18/long-throw-ins-scouting-to-find-marginal-gains/) **(ikincil aktarım)**.
- **Başarı ölçüsü:** 49,1 denemede bir gol (2025/26); Brentford 2024/25–2025/26'da uzun taçtan 7 gol (başka takım en çok 2); Midtjylland bu yıl 11 gol; Delap'ın taçları 2008/09–2009/10'da 24 gole doğrudan yol açtı (Stats Perform, **ikincil aktarım**) [The Analyst, uzun taç](https://theanalyst.com/articles/premier-league-long-throws-waste-of-time), [Sky Sports](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree), [Football365](https://www.football365.com/news/nine-greatest-long-throw-ins-liverpool-world-record-holder-chelsea). Süreç felsefesi: "10 uzun taçta şans yaratmasak da sonraki maçta yine yaparız" (Orti Esteban) [Sky Sports](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree).
- **Panzehir:** ön direğe en iyi kafacı, kaleci çizgiden önde yumruk, ikinci top için 3 oyuncu ceza sahası çizgisinde, atıcıya 2 m'de perde (atış açısını daraltma), 5 saniye kuralı havlu süresini kısaltır (2026/27) [IFAB Law 15](https://www.theifab.com/laws/latest/the-throw-in/).
- **Kabiliyet eşiği (öneri):** atıcıda özel "uzun taç" niteliği (mesafe + düz yay); kafacılar; ikinci top oyuncularında gelişine vuruş.
- **Hoca tarzı:** Brentford/Midtjylland okulu; Tuchel'in İngiltere'de düşünmesi; Grønnemark Liverpool'da uzun taç kullanmadı ("tarza uymuyor") [These Football Times](https://thesefootballtimes.co/2020/03/23/liverpools-throw-in-coach-thomas-gronnemark-shares-some-of-his-insights/).
- **Ünlü örnek:** Schade'nin tacı → Sánchez'in çeldiği şut → Ajer sıyırma → Carvalho (Chelsea, 2025); Hickey'nin Villa'ya volesi; Damsgaard'ın presiyle Shaw'ın kendi kalesine golü [Sky Sports](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree).

### F.3.4 Uzun taçta ön direk kafa sıyırması ve ikinci top (Long throw near-post flick and second ball)

- **Tür ve bağlam:** F.3.3'ün alt dalı; kaleci çıkışı iyi rakiplere ya da atıcının 6 pasa ulaşamadığı durumlarda (top ceza sahası çizgisine düşüyorsa taktik seçenek daralır [Flashscore](https://www.flashscore.com/news/long-quick-or-clever-the-art-of-the-throw-in-how-football-teams-turned-it-into-a-weapon/GE7KsjjA)).
- **Sahne akışı:** sıyırıcı ön direğin 2–3 m önünde; top gelirken markajcısının önüne adım atar; kafayla arka direğe/penaltı noktasına; bitirici arka direkte; uzaklaştırılan top ceza sahası çizgisinde şutöre.
- **Roller:** sıyırıcı, bitirici, ikinci top şutörü (2).
- **Başarı ölçüsü:** ilk kafa kazanma / ikinci top oranları **(bulunamadı)**; "agresif olmak, ikinci toplara yakın durmak, topun gideceği alanı kalabalıklaştırmak" (Brentford) [Sky Sports](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree); derin taçlarda savunmacıların enerjisiz kafaları ceza sahası üstünde alan açar [Analytics FC](https://analyticsfc.co.uk/blog/2024/06/18/long-throw-ins-scouting-to-find-marginal-gains/).
- **Panzehir:** ön direğe iki savunmacı, ikinci top bölgesine 3.

### F.3.5 Taç presi ve tutma (Throw-in press)

- **Tür ve bağlam:** savunma; rakip kendi yarı sahasında taç kullanırken; bugün Premier Lig'de yaygın.
- **Sahne akışı:** top çıkar çıkmaz 4–5 oyuncu taç noktası etrafında 10–15 m'lik "baskı bölgesi" kurar; her alıcı adam adama, atıcıya 2 m'de bir oyuncu; atış geldiğinde ilk dokunuşa baskı, geri pas yolunu kesme; top kazanılırsa 10–15 sn içinde kaleye.
- **Roller:** atıcı perdesi, 3 alıcı markajcısı, kesici (geri pas yolu), kontra ucu.
- **Başarı ölçüsü:** baskı altında taçta ortalama tutma ~%50; en kötü takımlar %45 civarı [Sports Gazette](https://sportsgazette.co.uk/?p=28044). Pres sonrası gol oranı **(bulunamadı)**.
- **Panzehir:** akıllı taç (F.3.2), kaleciye geri, uzun taç çizgi boyu.
- **Kabiliyet eşiği (öneri):** pres şiddeti takım niyetine (OYUN_TASARIMI'ndaki hoca tarzı) bağlanır; oyuncu dayanıklılığı.

---

## F.4 PENALTI (penalty kick)

### F.4.0 Genel sayılar

- **Dönüşüm:** Avrupa ligleri 2008/09–2021/22: %76,5 (La Liga) – %79,8 (Eredivisie); Bundesliga 1963–2004: %74,25; Dünya Kupası seri penaltıları %69,4 (Wikipedia'nın aktardığı van Hemert 2024/2025 ve Dohmen 2008) [Wikipedia: Penalty kick](https://en.wikipedia.org/wiki/Penalty_kick_(association_football)). Premier Lig: 2023/24 **%89,6** (rekor; önceki 2013/14 %83,9), 106 penaltı, %7,5 kurtarıldı (rekor düşük); 2022/23 %74,8; 2020/21–2023/24 dört sezon %81,9; ilk dört sezon %74,2; 2017/18 %26,3 kurtarma (21/80); penaltı xG'si 0,78; 2023/24'te penaltıların %41,5'i solak [The Analyst, penaltı](https://theanalyst.com/articles/premier-league-penalties-like-free-goal). Bar-Eli örnekleminde ~%80 gol [Bar-Eli vd. 2007](https://mpra.ub.uni-muenchen.de/4477/1/MPRA_paper). 2025/26: Igor Thiago 9'da 8 [The Analyst FPL](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27); Palmer 12/12, Y. Touré 11/11, Le Tissier 25/26 (Opta, ≥10) [The Analyst, Palmer](https://theanalyst.com/articles/cole-palmer-penalty-record-chelsea).
- **Yön ve kaleci davranışı (Bar-Eli vd., 286 penaltı):** vuruş yönü — kalecinin solu %32,2, orta %28,7, sağı %39,2; kaleci — sola %49,3, ortada kalma %6,3, sağa %44,4; kurtarma olasılığı — doğru tarafa dalışta sol %29,6 / sağ %25,4, ortada kalıp orta gelen topta %60,0, yanlış tarafa dalışta %0; kaleci ortada kalınca toplam %33,3, dalınca %14,2 / %12,6; genel kurtarma %14,7; vuruş ve dalış yönü %43 eşleşiyor (rastgele %33,3) — kaleciler zayıf ipucu okuyor; yazarlar "eylem yanlılığı" (action bias) diyor [Bar-Eli vd. 2007](https://mpra.ub.uni-muenchen.de/4477/1/MPRA_paper). 2009'daki Bundesliga (1.043 penaltı) karşı çalışması kalecilerin optimale yakın oynadığını savunur [LIDA kaydı](https://lida.sport-iat.de/twm/Record/4019956?lng=en).
- **Zaman:** top 11 m'yi "yaklaşık 0,2–0,3 sn"de alır (Bar-Eli, Chiappori/Palacios-Huerta'ya atıfla) [Bar-Eli vd. 2007](https://mpra.ub.uni-muenchen.de/4477/1/MPRA_paper); "yarım saniyeden az" [Science News](https://www.sciencenews.org/article/goalkeepers-deceive-themselves-when-facing-penalty-kicks). Hesap: 25–30 m/sn'lik vuruşta 11 m ≈ 0,37–0,44 sn **(hesap)**. Yüksek düzey kaleciler dalış başlangıcını vurucunun destek ayağının topun yanına basmasıyla eşler; fiziksel sınırlarına daha yakın çalışırlar [LIDA 2021](https://lida.sport-iat.de/ta/Record/4069797?lng=en), [Science News](https://www.sciencenews.org/article/goalkeepers-deceive-themselves-when-facing-penalty-kicks).
- **Hafıza:** UCL: kaleciler art arda üç aynı yöne vuruştan sonra %69 ters tarafa dalıyor (kumarbaz yanılgısı), vurucular bunu kullanmıyor [UCL 2014](https://www.ucl.ac.uk/news/news-articles/0714/310714-Goalkeepers-prone-to-gamblers-fallacy) **(sayfa açılamadı, arama özeti)**.
- **Strateji:** kaleciden bağımsız (keeper-independent: hedef önceden) vs kaleciye bağımlı (keeper-dependent: dalışı bekleyip ters köşe); Noël & van der Kamp 2012'de bağımsız strateji topu kaleciden daha uzağa yerleştirdi, daha az kurtarıldı; bağımlı vurucular kaleciye daha çok, topa daha az bakar; daha yavaş koşu, duraklamalar, düşük top hızı bağımlı stratejiyle ilişkili; 2021 derlemesinde iki stratejinin gol oranı anlamlı farklı değil [IJSP](https://ijsp-online.com/abstract/view/41/293), [Frontiers 2021](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.674511/pdf). Jordet'in "Pressure" kitabı 1970–2023 arası 718 seri penaltısını kapsar; kaçıranların %53'ü kaçınma beden dili gösteriyor [The Star/Reuters](https://www.thestar.com.my/sport/football/2026/07/03/soccer-world-cup-penalty-spot-becomes-football039s-newest-classroom); Jordet'in düdük-tepki süresi/skor yüzdeleri bu turda birincil kaynaktan **doğrulanamadı**; bir 2026 özetinde "düdükten sonra 2 sn'den fazla beklemek performansı iyileştiriyor" [Lecturas EFDeportes](https://www.efdeportes.com/efdeportes/index.php/EFDeportes/article/download/9016/2684?inline=1). Duraklı koşunun (stutter) dönüşümü ~%80 vs ~%76 iddiası hobi sitesinden, **doğrulanmadı** [Ingenuity Fantasy](https://ingenuityfantasy.com/?p=10306).
- **Kural etkisi:** 2019/20 "bir ayak çizgide" + VAR sonrası kurtarma payı düştü (2016/17–2019/20 %19,1 → 2020/21–2023/24 %11,7) [The Analyst, penaltı](https://theanalyst.com/articles/premier-league-penalties-like-free-goal). Penaltı duruşu 117,4 sn (2026/27) vs 164,7 (2025/26) [The Analyst, yeni kurallar](https://theanalyst.com/articles/premier-league-rules-throw-ins-goal-kicks-ball-in-play).

---

### F.4.1 Kaleciye bakmadan köşe seçimi (Keeper-independent penalty)

- **Tür ve bağlam:** maç içi penaltı; vurucunun önceden seçtiği köşe; seri penaltılarda baskı altında tercih edilen.
- **Sahne akışı (ortalama duruş 117 sn, VAR dahil):** 0 s düdük/VAR işareti; VAR kontrolü 20–90 sn **(tahmin; değişken)**; vurucu topu noktaya koyar (10–20 sn), geri çekilir (4–8 adım, 20–45° açı **(tahmin)**); kaleci çizgide zaman geçirir/konuşur (kart riski); hakem düdüğü; vurucu 0–3 sn bekler (uzun bekleme lehine kanıt [Lecturas](https://www.efdeportes.com/efdeportes/index.php/EFDeportes/article/download/9016/2684?inline=1)); koşu 2–3 sn; destek ayağı topun yanına basarken kaleci dalış başlatır [LIDA 2021](https://lida.sport-iat.de/ta/Record/4069797?lng=en); vuruş; top ~0,4 sn; sonuç; sekme için ceza sahası dışından koşan 2–3 oyuncu.
- **Roller:** vurucu; sekme koşucuları (yay çizgisinden, vuruş anında girer); kaleci; savunmada sekmeye 2–3 oyuncu, ofsayt yok.
- **Topun yolu:** köşeye sert, orta yükseklik ya da üst köşe; doğal taraf (sağ ayak için kalecinin sağı, iç ayakla) **(yaygın bilgi; Palacios-Huerta matrisi bulunamadı)**.
- **Başarı ölçüsü:** %76–80 Avrupa ortalaması, Premier Lig son yıllarda %82–90 [Wikipedia](https://en.wikipedia.org/wiki/Penalty_kick_(association_football)), [The Analyst, penaltı](https://theanalyst.com/articles/premier-league-penalties-like-free-goal).
- **Panzehir:** kaleci doğru tarafı tahmin etse bile köşeye sert vuruş kurtarılamaz; kaleci ortada kalma seçeneğini unutmamalı (%28,7 orta) [Bar-Eli](https://mpra.ub.uni-muenchen.de/4477/1/MPRA_paper).
- **Kabiliyet eşiği (öneri):** vurucuda penaltı/soğukkanlılık ve vuruş hassasiyeti; kaçırma direkt/ üstten dağılımı.

### F.4.2 Kaleciye bakarak ve duraklı koşu (Keeper-dependent penalty, stutter run-up)

- **Tür ve bağlam:** erken dalan kalecilere karşı; vurucunun kaleci okuma becerisi; kural: koşuda aldatma serbest, koşu bittikten sonra vuruş aldatması yasak [IFAB Law 14](https://www.theifab.com/laws/latest/the-penalty-kick/).
- **Sahne akışı:** yavaş koşu, 1–2 duraklama ("hop"), bakış kalecide; kaleci ağırlığını bir yana verince ters köşe ya da ortaya yumuşak vuruş; kaleci beklerse vuruş kalitesi düşer (düşük top hızı).
- **Başarı ölçüsü:** bağımlı strateji daha çok kurtarılıyor (Noël & van der Kamp 2012) ama derlemede fark anlamsız [IJSP](https://ijsp-online.com/abstract/view/41/293), [Frontiers 2021](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.674511/pdf).
- **Panzehir:** kaleci son ana kadar bekler (2019 kuralıyla erken çıkış azaldı), ortada kalır; "duraklı koşu"da kalecinin ipucu okuması güçleşir.
- **Kabiliyet eşiği (öneri):** vurucuda zekâ/soğukkanlılık; kalecide sabır (erken dalış eğilimi parametresi).
- **Ünlü örnek:** Jordet'in Kane'in iki yaklaşım arasında geçiş yaptığını anlatması (podcast, **ikincil**) [Podcast Rex](https://podcastrex.com/shows/the-high-performance-podcast/are-england-now-the-best-penalty-takers-world-leading-penalty-expert-explains-geir-jordet-e419/transcript).

### F.4.3 Kaleci stratejileri: bekleme, erken dalış, hafıza (Goalkeeper strategies: wait, early dive, memory)

- **Tür ve bağlam:** savunma rutini; kural: bir ayak çizgide; sarı kart/ tekrar riski.
- **Sahne akışı:** kaleci topun yerleşmesini geciktirir (konuşma, eldiven), çizgide yanlara küçük adımlar/kollar; vurucunun koşusunu izler; dalış başlangıcı destek ayağına eşlenir; ya da bekleyip tepki (yalnız yavaş/orta vuruşlarda yetişir).
- **Karar:** vurucunun geçmişi (son 3 vuruş aynı yöne → %69 ters dalış, hatalı sezgi [UCL](https://www.ucl.ac.uk/news/news-articles/0714/310714-Goalkeepers-prone-to-gamblers-fallacy)); kalecinin kendi normu dalmak (%93,7) [Bar-Eli](https://mpra.ub.uni-muenchen.de/4477/1/MPRA_paper); kurtarılan penaltı payı sezon ~%7,5–26 [The Analyst, penaltı](https://theanalyst.com/articles/premier-league-penalties-like-free-goal).
- **Panzehir:** vurucu için köşeye sert, bağımsız strateji.
- **Kabiliyet eşiği (öneri):** kalecide refleks, zıplama uzunluğu, okuma; motorda kalecinin "ortada kalma olasılığı" düşük (≈%6) başlangıç değeri.

---

## F.5 SANTRA (kick-off)

### F.5.0 Genel

- Kural 2016/17: her yöne; tek oyuncuyla santra mümkün [Premier League 2016/17](https://www.premierleague.com/news/66192).
- 2025/26 eğilimi: ilk 30 maçta 3 santra doğrudan rakip taç olacak şekilde son üçte birde dışarı atıldı (önceki beş sezon toplamı kadar; önceki 1.900 maçta bir kez); ikinci pasın dışarı atılması 7 (0,23/maç) vs 42 (0,11/maç, çoğu kazara); ilham PSG'nin 2025 Şampiyonlar Ligi finalinde santrayı Inter'e vermesi; gerekçe: rakip kalesine yakın taç vermek topu tutmaktan daha olası şans üretiyor [The Analyst, eğilimler](https://theanalyst.com/articles/premier-league-2025-26-trends-tactics-long-throws-long-balls-kick-offs), [Premier League, dört eğilim](https://www.premierleague.com/en/news/4407434/analysis-four-tactical-trends-redefining-the-premier-league).
- Santra süreleri **(bulunamadı)**; devre başı/gol sonrası yerleşme 30–60 sn **(tahmin)**.

### F.5.1 Geri pas ve uzun diyagonal (Back pass and long diagonal)

- **Tür ve bağlam:** maç/devre başı ve gol sonrası; topu güvenle hücum üçte birine taşımak.
- **Sahne akışı:** santra oyuncusu topu geri (stoper/orta saha) oynar; 1–2 sn içinde uzun diyagonal kanada ya da rakip ceza sahası köşesine; kanat oyuncusu ve 2 orta saha ikinci top için; savunma hattı orta sahaya çıkar.
- **Roller:** santra oyuncusu, geri alıcı (uzun pas), kanat hedefi, ikinci top (2), hat.
- **Başarı ölçüsü:** **(bulunamadı)**; yaygın uygulama **(tahmin)**.
- **Panzehir:** santra presi (ilk pasa baskı), kanat hedefine önceden markaj.
- **Kabiliyet eşiği (öneri):** uzun pas, hava topu.

### F.5.2 Taç için çizgiye atma / PSG tarzı (Kick-off out of play for a deep throw-in)

- **Tür ve bağlam:** santra; derin taç presi iyi takımlar; rakibin kendi kalesine yakın taç kullanmasını zorlamak.
- **Sahne akışı:** geri pas; stoper topu rakip son üçte bire, taç çizgisinin dışına uzun vurur (ya da doğrudan santradan); takım 5–8 sn'de taç presi düzenine (F.3.5) geçer; rakip taç atmak için 15–20 sn harcar, hat kendi ceza sahası yakınında.
- **Başarı ölçüsü:** 2025/26'da nadir ama artan (yukarıdaki sayılar); gol çıktısı **(bulunamadı)**.
- **Panzehir:** hızlı taç (5 sn), kaleciye geri, çizgi boyu uzun taç.
- **Kabiliyet eşiği (öneri):** takım pres niyeti; stoperin uzun vuruşu.
- **Ünlü örnek:** PSG–Inter 2025 finali [The Analyst, eğilimler](https://theanalyst.com/articles/premier-league-2025-26-trends-tactics-long-throws-long-balls-kick-offs).

### F.5.3 Santra presi (Kick-off press trap)

- **Tür ve bağlam:** savunma; rakibin geri pasını bekleyip ilk alıcıya 2–3 oyuncuyla baskı; santranın ilk 10 saniyesi.
- **Sahne akışı:** düdükle 2 forvet geri pasa, orta saha ikinci pasa; kazanılan top kaleye 2 pasla.
- **Başarı ölçüsü:** **(bulunamadı)**; santradan doğrudan gol kural olarak mümkün [IFAB Law 8](https://www.theifab.com/laws/latest/the-start-and-restart-of-play/).
- **Panzehir:** F.5.1'in uzun diyagonali ya da F.5.2.

---

## F.6 KALE VURUŞU (goal kick) — çapraz referans

Kale vuruşu düzenleri (kısa kurulum, uzun top, stoperin rakip yarı sahaya vuruşu) Bölüm A'da işlenir. Burada yalnız kural ve süre: top vurulup hareket edince oyundadır, rakipler ceza sahası dışında, 2026/27'de beş saniye geri sayımı (ihlal: korner) [IFAB Law 16](https://www.theifab.com/laws/latest/the-goal-kick/); duruş 27,7 sn (2026/27), 30,1–30,4 sn (2025/26), ikinci yarı 32,4 sn; 2025/26'da saha oyuncusunun rakip yarıya kale vuruşu 0,27/maç (önceki 0,04; Van Dijk 8'in 4'ü) [The Analyst, zaman kaybı](https://theanalyst.com/articles/premier-league-football-time-throw-ins-goal-kicks-substitutions-stats), [The Analyst, eğilimler](https://theanalyst.com/articles/premier-league-2025-26-trends-tactics-long-throws-long-balls-kick-offs).

---

## F.7 Hoca tarzı ve uzman etkisi

| Uzman | Yol | Kaynaklı iz | Kaynak |
|---|---|---|---|
| Nicolas Jover | Montpellier/Brentford → Man City → Arsenal (2021) | Arsenal 2021'den beri 46 korner golü (ligin en çoğu); 6 pas kalabalığı 3,31; %96 içe dönen, %5 kısa; bloklar ve aldatma koşuları | [PL Gabriel](https://www.premierleague.com/en/news/4183525), [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners), [Yahoo](https://ca.sports.yahoo.com/news/arsenal-become-deadly-set-piece-080000229.html) |
| Gianni Vio | Catania (17/44 gol duran toptan), Fiorentina, Brentford 2015/16 (İngiltere'nin ilk uzmanı), İtalya 2020–21 (Euro 2020 şampiyonu), Tottenham, Watford | Galler maçında Pessina golü: Bastoni ve Bonucci ofsayttan savunmayı çekti, Bernardeschi aldatma; final golü kornerden; "4.000–4.830 rutin" | [Wikipedia](https://en.wikipedia.org/wiki/Gianni_Vio), [TGG](https://trainingground.guru/articles/vio-appointed-as-tottenhams-first-set-piece-coach), [StatsBomb](https://blogarchive.statsbomb.com/articles/soccer/how-italy-became-euro-2020-champions/), [Squawka](https://www.squawka.com/en/tottenham-gianni-vio-set-piece-specialist-analysis/) |
| Austin MacPhee | Hearts/St Mirren, K. İrlanda, Midtjylland → Aston Villa 2021–26 (ilk uzman), Portekiz yardımcısı (2025–), Chelsea (Ağustos 2026) | Villa 2025/26'da 18 duran top golü (ortak 4.), dört sezon ilk yedi | [TGG Chelsea](https://trainingground.guru/chelsea-confirm-macphee-as-set-piece-coach-as-alonso-names-staff/), [Express & Star](https://expressandstar.com/sport/football/aston-villa/2021/08/04/villa-appoint-austin-macphee-as-dedicated-set-piece-coach) |
| Thomas Grønnemark | Taç antrenörü; Midtjylland, Liverpool 2018–23, Brentford, Arsenal, Trabzonspor | Liverpool %45,4 → %68,4; uzun/hızlı/akıllı; 34 m ölçütü; Midtjylland dört sezonda uzun taçtan 35 gol | [Sports Gazette](https://sportsgazette.co.uk/?p=28044), [These Football Times](https://thesefootballtimes.co/2020/03/23/liverpools-throw-in-coach-thomas-gronnemark-shares-some-of-his-insights/), [Wikipedia](https://en.wikipedia.org/wiki/Thomas_Gr%C3%B8nnemark) |
| Bernardo Cueva | Chivas → Brentford (Eylül 2020, "taktik istatistikçi") → Chelsea (2024) → teknik analist | Brentford %98 içe dönen; 2021/22 başı korner başına 0,07 xG; imza rutini "özel bir orta tekniği" istiyor (ayrıntı kaynakta yok) | [TGG 2021](https://archive.trainingground.guru/articles/brentford-bring-their-set-piece-prowess-to-the-premier-league), [Total Football Analysis](https://totalfootball.beehiiv.com/p/bernardo-cueva-corner-tactics-at-chelsea-2024-2025-kevin-schade-scout-report-at-brentford), [Jobs in Football](https://jobsinfootball.com/blog/brentford-fc-coaching/) |
| Keith Andrews / Andreas Georgson | Brentford'un sonraki duran top sorumluları; Georgson Man Utd/City hattı | "Bize yeni değil" (Andrews); eski Brentford koçları Arsenal, Chelsea, iki Manchester, Spurs'te | [Sky Sports](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree) |

**Motor için hoca/uzman ölçeklemesi (öneri):** uzman antrenörü olan takım (1) rutin çeşitliliğini (kaç rutin bilindiği), (2) koordinasyon hatasını (yanlış zamanlama olasılığı), (3) içe dönen/kısa/uzun taç tercihlerini ve (4) ikinci top dizilimini değiştirir; vurucu ve kafacı kabiliyeti teslimat sapması ve ilk temas olasılığını ölçekler. Gerçek aralıklar: ilk temas %17,5–47 (takım), korner başına gol %1,5–8 (takım-sezon), uzun taç başına gol ~%2, kısa korner payı %5–60.

---

## F.8 Motor için notlar — sahne durum makinesi

Aşağıdaki evreler motorun `mac-kurallar.js` / `mac-senaryo.js` tarafındaki duran top akışının hedef tanımıdır; süreler gerçek ortalamalara (F.0.3) ve alt evrelerde tahmine dayanır. Bütün süreler oyun saati değil gerçek saniyedir ve gerçek dünya hedefleridir. *(Düzeltme, Claude 2026-10-19: motorda duruş süreleri gerçek saniyeyle tanımlıdır ve U1'den beri `sureOlcek` ile ölçeklenmez — `js/mac-motoru.js:114-117`; bugünkü değerler taç 5,6, kale vuruşu 8,2, korner 12,3, barajsız serbest vuruş 5,6 sn. Bu tablolardaki gerçek sürelerin hangi sıkıştırmayla oynanacağı Z2 başında kullanıcı kararıdır — FUTBOL_KUTUPHANESI §0 "Tempo".)* Her evre için "kim ne yapar" ilkel–bağlam–rol üçlüsüyle yazılmalıdır.

### F.8.1 Korner (hedef toplam 30–36 sn; ortalama 33,9 / 36,1)

| Evre | Süre (sn) | İçerik |
|---|---|---|
| K0 Karar | 0–2 | top dışarı, hakem köşeyi gösterir; VAR 2026/27'de hatalı korneri hızlıca düzeltebilir (nadir) |
| K1 Top ve yürüyüş | 6–12 **(tahmin)** | top toplayıcı en yakın topu verir; vurucu(lar) köşeye yürür; topu yaya koyar |
| K2 Yerleşme | 10–16 **(tahmin)** | savunma: bölge/adam/karma dizilimi, kısa korner çıkışı, kaleci konumu; hücum: küme/tren/arka direk/kısa seçenek, çember oyuncuları; hakem ceza sahası kenarı, yardımcı kale çizgisi |
| K3 İşaret | 1–3 | vurucu kol kaldırır (rutin kodu); kısa korner için ikinci oyuncu yaklaşır |
| K4 Koşu ve vuruş | 2–4 | 3–5 adım, 20–45° yay **(tahmin)**; içe/dışa/alçak/kısa |
| K5 Uçuş | 1,2–2,0 **(tahmin)** | içe dönen 6 pas merkezi, dışa dönen penaltı noktası; bloklar bu evrede gerçekleşir |
| K6 İlk temas | anlık | olasılık: hücum %17–47 (takım), savunma kalan; kaleci çıkışı kalabalığa bağlı |
| K7 İkinci top / dağılma | 2–8 | şut, kesme, uzaklaştırma → kontra; ofsayt ikinci topta devreye girer |

Karar olasılıkları (başlangıç): kısa %18 (lig 2022–24), içe dönen %83 (ortalananların, 2025/26), hedef bölge takım profiline göre (ön 15–20 / merkez 25–30 / arka 10–25 / penaltı noktası kalan **(tahmin dağılımı; takım verileri F.1.0)**), ilk temastan şut içe %17 / dışa %25, akışta şut %35–44, akışta gol %4, ortalanan korner başına gol %3–5.

### F.8.2 Serbest vuruş (merkez yakın doğrudan: 60–80 sn; diğer: 25–40 sn; hızlı: 2–6 sn)

| Evre | Süre (sn) | İçerik |
|---|---|---|
| S0 Faul | 0–20 | düdük, kart, tedavi (tedavi uzarsa oyuncu 1 dk dışarı, 2026/27) |
| S1 Hızlı karar | 0–5 | hücum hızlı kullanabilir (düdüksüz); savunma engellerse sarı |
| S2 Sprey | 8–15 **(tahmin)** | hakem topu işaretler, 9,15 m adımlar, çizgi; işaret ≤ 60 sn kalır |
| S3 Baraj | 10–20 **(tahmin)** | kaleci hizalar (4–5 merkez, 2–3 uzak, 1–2 kenar **(tahmin)**); yatan oyuncu; hücum 1 m dışında ikinci baraj |
| S4 Vurucular | 5–10 | 1–2 aday, konuşma, geri çekilme; hakem "bekle" |
| S5 Düdük ve koşu | 2–4 | törensel düdük; yay koşusu |
| S6 Uçuş | 0,8–1,3 **(tahmin)** | falso/knuckleball/alçak/orta; baraj sıçrama kararı vurucu profiline |
| S7 Sonuç | 0–6 | gol %4–6 (merkez yakın), kurtarış/korner, blok, sekme ikinci top |

Kenar vuruşlarda S3–S4 yerine kutu yerleşimi (korner K2 gibi) ve ofsayt hattı yönetimi; derin vuruşlarda 5–15 sn ve uzun top/kısa karar skor-dakikaya bağlı.

### F.8.3 Taç (hedef 13–17 sn; uzun taç 20–32 sn; 5 sn kuralı)

| Evre | Süre (sn) | İçerik |
|---|---|---|
| T0 Çıkış | 0–2 | yardımcı bayrak; top toplayıcı/yedek top |
| T1 Atıcıya ulaşım | 3–8 | en yakın oyuncu ya da bek; uzun taçta uzman atıcı gelir (+5–10) |
| T2 Hazırlık | 2–6 | havlu (uzun taç), alıcı üçgeni kurulur; savunma presi dizilir (2 m kuralı) |
| T3 Geri sayım | 5 | yalnız kasıtlı gecikmede: düdük + el; bitince taç rakibe |
| T4 Atış | 1 | arkadan başın üstünden; uzun taçta 5–10 m koşu |
| T5 Uçuş | 0,5–2,5 | kısa 0,5–1; uzun 1,5–2,5 **(tahmin)** |
| T6 Sonuç | 2–10 | tutma ~%50 (baskı altında), aralık %45–68; uzun taçta ilk kafa/ikinci top; taçtan ofsayt yok, taçtan doğrudan gol yok |

### F.8.4 Penaltı (hedef 90–150 sn; 117 ortalama)

| Evre | Süre (sn) | İçerik |
|---|---|---|
| P0 Karar | 0–10 | düdük, VAR işareti |
| P1 VAR | 0–90 **(değişken)** | kontrol/ monitör; iptal olasılığı |
| P2 Top | 10–20 | vurucu topu noktaya koyar; kaleci oyalama; kart riski |
| P3 Dizilim | 5–10 | diğerleri yay dışında; hakem bir ayak çizgide uyarısı |
| P4 Düdük–bekleme | 0–3+ | uzun bekleme lehine kanıt |
| P5 Koşu | 2–4 | düz / duraklı; koşuda aldatma serbest |
| P6 Vuruş ve uçuş | 0,3–0,45 | kaleci dalışı destek ayağına eşlenir; ortada kalma ≈%6 |
| P7 Sonuç | 0–5 | gol %76–90 (lig/çağ), kurtarış %7–26, direk/dış kalan; sekme koşuları |

### F.8.5 Santra (hedef 10–60 sn yerleşme; oyun 2–10 sn)

Evreler: dizilim (devre başı 30–60, gol sonrası 15–40 **(tahmin)**) → düdük → ilk pas (geri) → ikinci pas (uzun diyagonal / kutuya / çizgi dışına) → pres ya da taç düzeni. 2025/26'da kasıtlı dışarı 3/30 maç; model olasılığı takım niyetiyle (pres iyi, skor berabere/geride) açılır.

### F.8.6 Kale vuruşu (çapraz: Bölüm A) — 24–32 sn; 5 sn kuralı; kısa/uzun karar kaleci ve hoca tarzına.

### F.8.7 Ortak kurallar

- Her duran topta "ikinci top" (second ball) planı zorunlu: hücumda 2–3 çember oyuncusu, savunmada 2 kenar; kontra geçişi bu oyunculardan.
- Blok/perde temas şiddeti ile faul olasılığı hakem profiline bağlanır; VAR golü iptal edebilir (2026/27'de kornerin kendisi de düzeltilebilir).
- Kabiliyet ölçekleri: vurucu teslimat sapması (hedef bölgeye düşme yarıçapı), kafacı ilk temas olasılığı ve kafa yönü, kaleci çıkış/ kurtarış, atıcı mesafe/ yay; takım koordinasyon hatası uzman antrenörle düşer.
- Zaman kaybı kuralları (8 sn kaleci, 5 sn taç/kale vuruşu, 10 sn değişiklik) motorun duruş sürelerini kısaltır; skor önde ve son 10 dakikada duruş uzar ama tavan kurallarla sınırlıdır.
- Retro görünüm sahnenin akışını değiştirmez; hareket dili gerçekçilik planı Ek G'de.

### F.8.8 İlkel × bağlam × rol sözlüğü (öneri)

Rutinler ezber sahne değil, aşağıdaki ilkellerin rol ve bağlamla birleşimidir; aynı ilkel kümesi bütün duran toplarda kullanılır. Adlar öneridir, motor adlandırması TEKNIK_PLAN §8'e göre kesinleşir.

| İlkel (primitive) | Parametre | Kullanıldığı rutinler |
|---|---|---|
| KOŞ (run) | başlangıç bölgesi, hedef bölge, zamanlama (vuruşa göre −2…+1 sn), yay/düz | F.1.1–F.1.7, F.2.5, F.3.3 |
| SÜRÜKLE (decoy) | sürüklenecek markajcı, yön | F.1.4, F.1.6, F.2.5 (Bernardeschi örneği) |
| BLOKLA (block) | hedef markajcı, temas şiddeti → faul olasılığı | F.1.5, F.1.6 |
| PERDELE (screen) | kaleci / baraj görüşü | F.1.10, F.2.4 (ikinci baraj), F.2.9 (hücum tarafı) |
| BEKLE (hold zone) | bölge, süre | F.1.4 (serbest bitirici), F.1.7, F.1.9 (çember) |
| SIÇRA / KAFA (jump/head) | yön (kaleye / arka direğe / dışarı), kuvvet | F.1.3, F.1.11, F.3.4, F.1.12 |
| TESLİM ET (deliver) | tür (içe/dışa/alçak/düz/knuckle/uzun taç), hedef bölge, sapma yarıçapı | bütün vurucu/atıcı rolleri |
| KISA OYNA (short option) | mesafe, geri pas/kesme | F.1.8, F.2.8, F.3.2 |
| PRES (press) | baskı bölgesi, oyuncu sayısı | F.3.5, F.5.3 |
| DİZİL (set wall / set zone) | kişi sayısı, hiza, sıçra/sıçrama, yatan oyuncu | F.2.9, F.1.12 |
| OYALA (delay) | süre tavanı (5 sn / 8 sn / 10 sn kuralları) | taç, kale vuruşu, penaltı kalecisi |

| Rol (role) | Tipik kabiliyet | Örnek |
|---|---|---|
| vurucu / atıcı | duran top, orta, uzun taç | Saka (solak, sağdan içe dönen), Rice, Kayode |
| hedef (target) | kafa, zıplama, güç, zamanlama | Gabriel (başlangıcı değiştirme serbestliği) |
| blokçu | güç, denge, zekâ | Trossard (alçak gövde, arkadan gelen blok) |
| perde | disiplin (faul riski) | White (Vicario/Foderingham) |
| sıyırıcı | kafa yönlendirme | ön direk, uzun taç |
| çember / ikinci top | gelişine vuruş, uzaktan şut, hız (örtü) | Brentford'un 3 çember oyuncusu |
| kısa seçenek | pas, ilk kontrol | Ødegaard (2022/23) |
| bölge savunmacısı / adam markajcısı / kenar / kısa korner çıkışı | kafa, pozisyon, takip | F.1.12 |
| kaleci | çıkış, refleks, organizasyon, sabır | F.2.9, F.4.3 |

| Bağlam (context) | Etkilediği karar |
|---|---|
| skor ve dakika | kısa korner/zaman geçirme, uzun top, kutuya giden oyuncu sayısı, hızlı serbest vuruş |
| rakibin savunma sistemi (bölge/adam/karma, ön direk üçgeni) | içe/dışa, tren vs blok, arka direk yüklemesi |
| rakip kalecinin çıkış gücü | perde, dışa dönen tercih |
| vurucu ayağı ve köşe | içe/dışa geometrisi |
| atıcının mesafesi (≥34 m?) | uzun taç izni |
| hakem profili / VAR | blok şiddeti tavanı, 1 m kuralı denetimi |
| kurallar (5/8/10 sn) | duruş tavanları |
| hoca/uzman düzeyi | rutin çeşitliliği, koordinasyon hatası, tercih ağırlıkları |

Örnek kodlama — F.1.5 (perdeleme ile serbest kafacı): TESLİM ET(içe dönen, 6 pas merkezi) + hedef: KOŞ(arka direk → merkez, −1 sn) + blokçu1: BLOKLA(hedefin markajcısı, orta şiddet) + blokçu2: PERDELE(kaleci) + aldatma: SÜRÜKLE(ön direk) + çember×2: BEKLE(ceza sahası çizgisi); bağlam: rakip adam/karma, kaleci çıkışı güçlü. Savunma cevabı F.1.12: DİZİL(4 bölge düz hat) + adam×3 + kenar×2 + kaleci çizgiden 1 m önde; "blokçuyu blokla" tetikleyicisi rakibin blok geçmişine bağlanır.

---

## F.9 Ölçüler (kalibrasyon tablosu)

| Ölçü | Değer | Not / kaynak |
|---|---|---|
| Korner duruşu | 33,9 sn (2026/27), 36,1 (2025/26) | [Analyst](https://theanalyst.com/articles/premier-league-rules-throw-ins-goal-kicks-ball-in-play) |
| Serbest vuruş duruşu | 33,3 sn; doğrudan şut 74,5 sn | aynı |
| Taç duruşu | 15,3 sn (2026/27), 17,8–17,9 (2025/26), DK 2026 13,2 | aynı; [Analyst zaman](https://theanalyst.com/articles/premier-league-football-time-throw-ins-goal-kicks-substitutions-stats) |
| Kale vuruşu duruşu | 27,7 sn (2026/27), 30,1–30,4 (2025/26) | aynı |
| Penaltı duruşu | 117,4 sn (2026/27), 164,7 (2025/26) | aynı |
| Top oyunda | %57,7 / 56:35 | aynı |
| Taç/maç | 40–60 | Grønnemark |
| Uzun taç/maç | 3,92 (2025/26), 1,52 (2024/25), 0,89 (2020/21) | [Analyst](https://theanalyst.com/articles/premier-league-long-throws-waste-of-time) |
| Uzun taç gol oranı | 1/49,1 (~%2) | aynı |
| Ortalanan korner gol oranı | 1/20,8 (~%4,8, 2025/26); %3,0 (2024/25) | aynı; [Championship](https://theanalyst.com/articles/championship-corners-2024-25-goals-stats-opta) |
| İçe dönen payı | ~%83 (2025/26) | [FPL](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27) |
| Kısa korner payı | %14–21 lig; takım %5–60 | [Analyst](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners) |
| İlk temastan şut | içe %16,9 / dışa %25,1 | [Analyst 2022/23](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending) |
| İlk şut xG | içe 0,14 / dışa 0,08; bölge ön 0,12 / merkez 0,27 / arka 0,17 | aynı |
| Korner başına gol (bölge) | ön %1,6 / merkez %1,5 / arka %3,1 | aynı |
| Akışta şut / gol | ortalanan %38,5 / %4,1; kısa %32,6 / %3,3 | aynı |
| Hücum ilk temas | %17,5–47 (takım) | [Analyst](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners) |
| 6 pas içindeki hücumcu | 3,31 en çok; diğerleri ≤2,93 | [TGG](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners) |
| Duran top gol payı | %27,4 (pen. dışı, 2025/26); korner %18 | [FPL](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27) |
| Doğrudan SV dönüşümü | %3,6–6,8 (2018–24); %6,6 (2013 ölçütü) | [PL](https://www.premierleague.com/news/4029342), [StatsBomb](https://blogarchive.statsbomb.com/articles/soccer/premier-league-shot-benchmarks/) |
| Doğrudan SV deneme/sezon | 621 (2003/04) → 251 (2025/26) | [FPL](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27) |
| Penaltı dönüşümü | %76,5–79,8 Avrupa; PL %74,8 (2022/23) – %89,6 (2023/24) | [Wikipedia](https://en.wikipedia.org/wiki/Penalty_kick_(association_football)), [Analyst](https://theanalyst.com/articles/premier-league-penalties-like-free-goal) |
| Penaltı kurtarma | %7,5 (2023/24) – %26,3 (2017/18) | aynı |
| Penaltı yön dağılımı | sol %32,2 / orta %28,7 / sağ %39,2 (kaleci bakışı) | [Bar-Eli](https://mpra.ub.uni-muenchen.de/4477/1/MPRA_paper) |
| Kaleci dalış | %93,7 dalar, %6,3 ortada | aynı |
| Kurtarma (doğru taraf) | %25–30 yan, %60 orta | aynı |
| Top uçuşu (penaltı) | 0,2–0,3 sn (Bar-Eli aktarımı); 0,37–0,44 sn (hesap) | |
| Taç tutma | ~%50; %45,4–68,4 aralığı | [Sports Gazette](https://sportsgazette.co.uk/?p=28044) |
| Uzun taç mesafe | 34 m ölçüt; Delap ~38 m; rekor 51,33 m | [Sky](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree), [Flashscore](https://www.flashscore.com/news/long-quick-or-clever-the-art-of-the-throw-in-how-football-teams-turned-it-into-a-weapon/GE7KsjjA) |
| Santra dışarı | 3 / 30 maç (2025/26) | [Analyst](https://theanalyst.com/articles/premier-league-2025-26-trends-tactics-long-throws-long-balls-kick-offs) |
| Kaleci 8 sn; taç/KV 5 sn; değişiklik 10 sn | kural | IFAB |
| Baraj 1 m, 9,15 m, taç 2 m, hakem atışı 4 m | kural | IFAB |

Bulunamayanlar (ileride ölçülecek): kaleci korner çıkış/yumruk oranı; kısa korner sonrası orta oranı; uzun taçta ilk kafa kazanma; doğrudan serbest vuruşta bölgeye göre xG; santra rutin dağılımı; Jordet düdük-tepki yüzdeleri; Palacios-Huerta doğal taraf matrisi; "tren" rutininin ölçülmüş verimi.

---

## F.10 Kaynaklar

Kurallar
- IFAB Laws of the Game 2026/27: [Law 1](https://www.theifab.com/laws/latest/the-field-of-play/), [Law 8](https://www.theifab.com/laws/latest/the-start-and-restart-of-play/), [Law 13](https://www.theifab.com/laws/latest/free-kicks/), [Law 14](https://www.theifab.com/laws/latest/the-penalty-kick/), [Law 15](https://www.theifab.com/laws/latest/the-throw-in/), [Law 16](https://www.theifab.com/laws/latest/the-goal-kick/), [Law 17](https://www.theifab.com/laws/latest/the-corner-kick/); [Circular 32 (31 Mart 2026)](https://downloads.theifab.com/downloads/circular-32?l=en)
- 2019/20 değişiklikleri: [ThePapare](https://www.thepapare.com/ifab-football-laws-changes-2019-20/), [Ask A Soccer Referee](https://askasoccerreferee.com/category/2019-2020-law-changes), [Premier League](https://www.premierleague.com/en/news/1292424); 2016/17: [Premier League](https://www.premierleague.com/news/66192)
- Kaleci 8 saniye denemesi ve kuralı: [ESPN 2024](https://global.espn.com/football/story/_/id/39954456/ref-body-trials-giving-corners-throw-ins-gk-wasting), [ESPN 2025](https://global.espn.com/football/story/_/id/44068077/corners-given-combat-gk-wasting-refs-body-says)
- Kaybolan sprey: [Wikipedia](https://en.wikipedia.org/wiki/Vanishing_spray)

Opta / The Analyst
- [Korner: içe/dışa, kısa/ortalanan, bölgeler (2022/23)](https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending)
- [Arsenal ve Tottenham kornerleri (2023/24)](https://theanalyst.com/articles/why-arsenal-and-tottenham-are-so-good-at-corners)
- [Man Utd kornerleri, ilk temas (2023/24)](https://theanalyst.com/articles/are-manchester-united-really-that-bad-at-corners)
- [Championship kornerleri (2024/25)](https://theanalyst.com/articles/championship-corners-2024-25-goals-stats-opta)
- [Uzun taç: zaman kaybı mı? (Mart 2026)](https://theanalyst.com/articles/premier-league-long-throws-waste-of-time)
- [Uzun taç istatistikleri (Ağustos 2025)](https://theanalyst.com/articles/long-throw-ins-premier-league-stats)
- [2025/26 eğilimleri: uzun taç, uzun top, santra](https://theanalyst.com/articles/premier-league-2025-26-trends-tactics-long-throws-long-balls-kick-offs)
- [Duruş süreleri: taç, kale vuruşu, değişiklik (Ocak 2026)](https://theanalyst.com/articles/premier-league-football-time-throw-ins-goal-kicks-substitutions-stats)
- [Yeni kurallar sonrası duruşlar (2026/27)](https://theanalyst.com/articles/premier-league-rules-throw-ins-goal-kicks-ball-in-play)
- [FPL duran top istatistikleri (2025/26 özeti)](https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27)
- [Penaltılar "bedava gol" (2023/24)](https://theanalyst.com/articles/premier-league-penalties-like-free-goal), [Palmer penaltı rekoru](https://theanalyst.com/articles/cole-palmer-penalty-record-chelsea)
- [Insight feed (2025/26 sezon başı korner xG)](https://theanalyst.com/articles/premier-league-insight-feed/)
- [Opta/MLS uzun taç (2013)](https://mlssoccer.com/news/opta-spotlight-long-throw-ins-are-en-vogue-mls-and-doesnt-figure-slow-down-anyti)

Premier League / kulüp analizleri
- [Gabriel ve Arsenal blokları (2024/25)](https://www.premierleague.com/en/news/4183525)
- [Talking Tactics: Arsenal korner rutinleri (2023/24)](https://premierleague.com/news/3865986)
- [Korner savunma sistemleri](https://www.premierleague.com/news/2982222)
- [Doğrudan serbest vuruşlar (2023/24)](https://www.premierleague.com/news/4029342), [Serbest vuruş golleri azalıyor (2017/18)](https://www.premierleague.com/news/693397)
- [Dört taktik eğilim (2025/26)](https://www.premierleague.com/en/news/4407434/analysis-four-tactical-trends-redefining-the-premier-league)
- [UEFA: Arsenal duran top (Atlético)](https://it.uefa.com/uefachampionsleague/news/029e-1f09b4c02fc6-e335dc1d5848-1000--champions-league-performance-insights-arsenal-s-set-piece-s/), [UEFA: Porto–Atlético kısa korner](https://www.uefa.com/uefachampionsleague/news/0270-13ed100a034f-407ca37ea8f5-1000--in-the-zone-porto-1-3-atletico-performance-analysis)

Uzmanlar
- [Training Ground Guru: Arsenal blok sanatı](https://trainingground.guru/articles/arsenal-and-the-art-of-blocking-at-corners), [Brentford duran top (2021)](https://archive.trainingground.guru/articles/brentford-bring-their-set-piece-prowess-to-the-premier-league), [Vio Tottenham](https://trainingground.guru/articles/vio-appointed-as-tottenhams-first-set-piece-coach), [Vio Leeds](https://archive.trainingground.guru/articles/leeds-hire-set-piece-specialist-gianni-vio), [MacPhee Chelsea](https://trainingground.guru/chelsea-confirm-macphee-as-set-piece-coach-as-alonso-names-staff/)
- [Sky Sports: Brentford uzun taç](https://www.skysports.com/football/news/11748/13433524/long-throws-how-brentford-became-the-premier-league-kings-in-this-department-amid-goal-spree), [Sky Sports: Keith Andrews](https://www.skysports.com/football/news/11095/13226657/brentford-how-ex-sky-sports-pundit-keith-andrews-became-the-brains-behind-the-bees-lightning-starts)
- Grønnemark: [Sports Gazette](https://sportsgazette.co.uk/?p=28044), [These Football Times](https://thesefootballtimes.co/2020/03/23/liverpools-throw-in-coach-thomas-gronnemark-shares-some-of-his-insights/), [Flashscore](https://www.flashscore.com/news/long-quick-or-clever-the-art-of-the-throw-in-how-football-teams-turned-it-into-a-weapon/GE7KsjjA), [Wikipedia](https://en.wikipedia.org/wiki/Thomas_Gr%C3%B8nnemark), [Sporting Life (arama özeti)](https://www.sportinglife.com/football/news/liverpools-throw-in-potential/152030)
- Vio: [Wikipedia](https://en.wikipedia.org/wiki/Gianni_Vio), [Squawka](https://www.squawka.com/en/tottenham-gianni-vio-set-piece-specialist-analysis/), [StatsBomb Euro 2020](https://blogarchive.statsbomb.com/articles/soccer/how-italy-became-euro-2020-champions/)
- Cueva: [Total Football Analysis](https://totalfootball.beehiiv.com/p/bernardo-cueva-corner-tactics-at-chelsea-2024-2025-kevin-schade-scout-report-at-brentford), [Jobs in Football](https://jobsinfootball.com/blog/brentford-fc-coaching/)
- MacPhee: [Express & Star](https://expressandstar.com/sport/football/aston-villa/2021/08/04/villa-appoint-austin-macphee-as-dedicated-set-piece-coach)
- Jover: [Yahoo](https://ca.sports.yahoo.com/news/arsenal-become-deadly-set-piece-080000229.html)
- Uzun taç tarama: [Analytics FC](https://analyticsfc.co.uk/blog/2024/06/18/long-throw-ins-scouting-to-find-marginal-gains/); Delap: [Football365](https://www.football365.com/news/nine-greatest-long-throw-ins-liverpool-world-record-holder-chelsea), [Wikipedia](https://en.wikipedia.org/wiki/Rory_Delap)

Akademik ve bilim
- [Bar-Eli vd. 2007, eylem yanlılığı (MPRA)](https://mpra.ub.uni-muenchen.de/4477/1/MPRA_paper); karşı görüş [LIDA kaydı](https://lida.sport-iat.de/twm/Record/4019956?lng=en)
- [Kaleci dalış zamanlaması (2021)](https://lida.sport-iat.de/ta/Record/4069797?lng=en), [Science News](https://www.sciencenews.org/article/goalkeepers-deceive-themselves-when-facing-penalty-kicks)
- [UCL kumarbaz yanılgısı (2014)](https://www.ucl.ac.uk/news/news-articles/0714/310714-Goalkeepers-prone-to-gamblers-fallacy)
- [Noël & van der Kamp 2012 (IJSP)](https://ijsp-online.com/abstract/view/41/293), [Frontiers 2021 derleme](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.674511/pdf)
- [Pulling vd. 2013, korner savunması](https://www.ingentaconnect.com/content/uwic/ujpa/2013/00000013/00000001/art00012)
- [Harvard Sports Analysis 2014](https://harvardsportsanalysis.org/2014/09/spatial-analysis-of-corners/)
- [QUB sanal gerçeklik baraj çalışması (The Conversation)](https://theconversation.com/football-the-wall-can-make-it-harder-to-save-free-kicks-new-research-151869)
- [Ronaldo serbest vuruş CFD (SciTePress 2018)](https://www.scitepress.org/Papers/2018/72360/72360.pdf), [Scientific American](https://www.scientificamerican.com/blog/observations/physics-of-free-kicks-the-hidden-advantage-of-long-distance-soccer-shots/)
- [Wikipedia: Penalty kick](https://en.wikipedia.org/wiki/Penalty_kick_(association_football)); Jordet "Pressure": [The Star/Reuters](https://www.thestar.com.my/sport/football/2026/07/03/soccer-world-cup-penalty-spot-becomes-football039s-newest-classroom); bekleme süresi özeti: [Lecturas EFDeportes](https://www.efdeportes.com/efdeportes/index.php/EFDeportes/article/download/9016/2684?inline=1)
- Yatan oyuncu: [Bolavip](https://bolavip.com/en/world-cup/2026-world-cup-why-do-players-lay-down-behind-the-wall-during-free-kicks)
- StatsBomb 2013 şut ölçütleri: [blog arşivi](https://blogarchive.statsbomb.com/articles/soccer/premier-league-shot-benchmarks/)
- Duraklı koşu (zayıf kaynak): [Ingenuity Fantasy](https://ingenuityfantasy.com/?p=10306)
