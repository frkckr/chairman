# BÖLÜM B — İLERLETME VE SON ÜÇTE BİR HÜCUM İLKELLERİ (açık oyun)

Taslak: 2026-10-19. Futbol kütüphanesi için; motorun "ilkel × bağlam × rol" diliyle çalıştıracağı bilgi tabanı.
Kurallar bugünün kuralları (VAR ve yarı otomatik ofsayt dahil); yalnız görüntü retro.

Okuma kılavuzu:
- Her ilkel aynı şablonla yazıldı. Sayılar kaynak bağlantısıyla; kaynak bulunamayan sayı "bulunamadı", benim çıkarımım "tahmin" diye işaretli.
- "Kabiliyet eşiği" üç eksende verilir: Görme (algı/tarama), Karar (seçim/zamanlama), Yürütme (teknik/fiziksel). Düzeyler 1–5 ölçeğinde **tahmin**dir (1: amatör, 3: profesyonel lig ortalaması, 5: dünya sınıfı); motorun `mac-profil.js` kapısına ölçeklenmek üzere yazıldı, ölçülmüş eşik değildir.
- Terimlerin İngilizcesi parantezde. Koşu türü adları SkillCorner/Driblab/Opta Vision sınıflamalarıyla uyumlu tutuldu.
- Bölüm sonunda: B.0 ortak veri tabanı (koşu türleri, zamanlama, alan değeri), B.25–B.26 iki tarz (konumsal / ilişkisel), "Motor için notlar" ve "Ölçüler".

---

## B.0 Ortak veri tabanı: koşu türleri, zamanlama ve alan değeri

### B.0.1 Koşu türleri sınıflaması (off-ball run taxonomy)

**SkillCorner Game Intelligence** 10 topsuz koşu türü tanımlar ve top oyuncuya verilmese de sayar: dropping off (geri düşme), coming short (kısaya gelme), pulling wide (dışa açılma), pulling half-space (yarım alana çekilme), support (destek), run ahead (topun önüne koşu), overlap (bindirme), underlap (iç bindirme), run in behind (arkaya/derine koşu), cross receiver (orta için kutuya koşu). Koşu sayma eşiği: **>15 km/sa hız, en az 0,7 sn** (CIES'in SkillCorner verisiyle verdiği tanım).
- Kaynak: https://skillcorner.com/blog/game-intelligence-off-ball-run-types ; eşik: https://football-observatory.com/IMG/sites/b5wp/2023/wp433/en/

**Driblab** tanımları (aynı aileden, açık metin): overlap = kanat koridorunda top taşıyanın dışından geçen koşu; underlap = kanat koridorunda içinden geçen koşu (merkez koridorda top taşıyanı geçen her ileri koşu underlap sayılır); run ahead = zaten topun önündeki oyuncunun son savunmacının önünde kalan ileri koşusu; run in behind = son savunma hattını delip savunma ile kaleci arasına giren koşu; cross receiver = kutu içinde orta almak için koşu; support = top taşıyanla hizaya gelip kısa pas seçeneği sunma; coming short = top taşıyana yaklaşıp kaleye uzak kısa pas hattı açma.
- Kaynak: https://www.driblab.com/blog/arrigo-off-ball-runs

**Gradient Sports** (yayın verisinden izleme) koşu başlangıcı: >15 km/sa ve ≥2,5 m/s² ivme, ya da ivmeye bakmadan >20 km/sa; bitiş: <15 km/sa'ya düşme, sert yavaşlama, topu alma ya da top kaybı; 0,5 sn'den kısa aralıkla ayrılan koşular birleştirilir. Hiyerarşik tipler: overlap, underlap, far side (uzak taraf), advance (önde kalan), support (arkada kalan), forward (topu geçen genel ileri koşu). Eklenebilir nitelikler: "in behind" (son savunmacının ötesinde biten), kutuya/son üçte bire giren, mesafe bantları (kısa <12 m, orta 12–24 m, uzun >24 m), hızlı (ortalama >25 km/sa), **koşu bittikten sonra 1 sn içinde top alındı**. Premier Lig'de bindirmelerin %68'i beklerden; "advance" koşuların %34'ü santrforlardan.
- Kaynak: https://www.gradientsports.com/blog/measuring-off-ball-movement-using-broadcast-tracking-event-data

**Santrfor koşu payları** (SkillCorner; 5 büyük lig 2022/23, 202 santrfor, ≥8 maç 60+ dk): run in behind %32, cross receiver %23, run ahead %22, coming short %8; üç merkezi tehdit tipi toplam %77. Sezonlar arası kararlılık: aynı kulüpte kalanlarda bağlantı koşuları r=0,75, transfer olanlarda 0,48. Toplam örneklem 1.293 santrfor, 30 lig, 2018/19–2022/23.
- Kaynak: https://skillcorner.com/blog/forward-off-ball-runs ; http://archive.trainingground.guru/articles/skillcorner-analysing-centre-forwards-off-ball-runs

**Opta Vision, Premier Lig 2024/25** (bütün sezon, izleme + olay verisi):
- Overlap tanımı: top taşıyanın dışından, taç çizgisine yakın koşu (çoğunlukla bekler). Underlap: top taşıyanın içinden, sahanın ortasına yakın koşu.
- Newcastle 277 bindirme (ikinciden ≥79 fazla), toplam bindirme+iç bindirme 498 (en çok). Tottenham 259 iç bindirme (en çok). Man City 76 bindirme (**maç başına ~2**), toplam 202. Ipswich 176 (en az).
- Bryan Mbeumo: sezonda 891 topsuz koşu, takım toplu 418 derine koşu, 462 sprint koşusu. Daniel Muñoz 960 topsuz koşu.
- Koşunun xT katkısı: başlangıç ve bitiş noktaları arasında **sonraki 10 sn içinde şut olasılığı farkı**. Toplamda Enzo Fernández 46,1; koşu başına en yüksek Curtis Jones 0,072. (Not: xT, koşucunun topu alıp almadığına bakmaz.)
- Kaynak: https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league

**CIES/SkillCorner, 27 lig, 2023 (WP433):** "kısa/geri pas seçeneği için koşular" (drop off + coming short) toplam koşuların %25–31'i (Raków %31,1; Man City %29,6; PSG %28,5; Frankfurt %27,5; Girona %26,5; Milan %25,9). Mutlak değer: PSG **maç başına 7,13** kısa/geri koşu. MR88 (3.261 maç) sekiz koşu kategorisini "boşluğa" (topun önünde almak) ve "ayağa" (yanında/arkasında almak) diye ikiye ayırır; en yüksek "boşluğa" payı Liga MX ve Cercle Brugge, en yüksek "ayağa" payı Serie A ve Burnley. Kategori başına maç ortalaması PDF'te; metin çıkarılamadı → **bulunamadı**.
- Kaynak: https://football-observatory.com/IMG/sites/b5wp/2023/wp433/en/ ; https://football-observatory.com/Call-for-the-ball-runs-worldwide-analysis ; PDF: https://www.football-observatory.com/IMG/pdf/mr88en.pdf

### B.0.2 Koşunun zamanlaması: pastan kaç sn önce?

Doğrudan "koşu ortalama X sn önce başlar" ölçümü **bulunamadı**. Dolaylı veriler:
- Gradient'in Dünya Kupası 2022 (64 maç, 25 fps) çalışması kutuya her pas için **pastan önceki 3 sn penceresinde** koşuları arar; kutuya 963 pasta 3.142 nitelikli koşu, **pas başına ortalama 3,3 koşucu** (mod 3–4). Koşuların **%12,9'u "nedensel"** (örten savunmacıyı alıcıdan ≥1 m uzaklaştıran). Nedensel koşudan sonra tamamlanan pasın şans yaratma oranı **%19,2**, nedensel koşu yoksa **%14,8**. Nedensel koşuda anahtar savunmacı ortalama ~3 m uzaklaşır. Oyuncu örnekleri (küçük örneklem): Messi'nin koşularının %30'u nedensel; Kane %25; Mbappé'nin ortalama yer değiştirtmesi 10,82 m.
  - Kaynak: https://the-cutback.beehiiv.com/p/off-ball-movement-football-tracking-data
- PAUSA makalesi (Bundesliga 2023/24, 55 maç, 25 Hz): pasçının topu tutma evresi için **3 sn'lik geri pencere açık oyun paslarının %80'inden fazlasını kapsar**; ileri pencere 1 sn. Bekleme kendiliğinden değerli değildir; takım düzeyinde PAUSA ile puan/maç r=0,733, oyun hızıyla r=−0,033.
  - Kaynak: https://thexgfootballclub.substack.com/p/what-makes-a-pass-well-timed
- SkillCorner koşu eşiği ≥0,7 sn; Gradient "top koşu bittikten sonra ≤1 sn içinde alındı" niteliği.
- Antrenörlük kaynakları koşunun **pasçının ipucuna** bağlandığını söyler: kör taraf koşusu "pas oynanırken" yapılır, "saniyenin kesri" zamanlama; forvet koşusunun ipuçları pasçının ilk dokunuşu, gövde duruşu, açık hat ve iletişim, ipucundan sonra hız değişimi.
  - Kaynak: https://elitesoccercoaching.net/attacking/blind-side-running ; https://footballgpt.co/guides/perfect-striker-runs-timing-for-goalscoring-success
- **Tahmin (motor için):** arkaya koşu pas çıkışından 0,5–1,5 sn önce başlar (pasçı topu kontrol ettiğinde başlar, vuruş anında koşucu tam hızda olur); bindirme 1,5–3 sn önce (daha uzun mesafe); kısaya gelme 0,5–1 sn önce. 3 sn'lik penceredeki koşuların çoğu bu banda düşer; kesin dağılım bulunamadı.
- **Z1 ölçümü (2026-10-19; açık veri, kullanıcı kararıyla indirildi; `python -I -X utf8 araclar/veri-z1.py araclar/veri`; yalnız yuvarlanmış özet, ham veri Git dışı; atıf FUTBOL_KUTUPHANESI "Kaynaklar — Z1"):** tahmin bandı tutuyor.
  - *SkillCorner açık verisi* (A-League 2024/25, 20 maç, yayın takibi 10 Hz, MIT): hedeflenen (pas yapılan) koşuda **koşu başı − pas çıkışı** (pasçının sahipliğinin bittiği kare) ortancası: savunma arkasına (behind) **−0,8 sn** (%10 −3,9 · %90 +0,2; n 339), topun önüne −1,3, kısaya gelme −1,4, destek −1,4, geri düşme −1,9, ceza sahasına (cross receiver) −1,9, dışa açılma −1,7, yarım alan −1,5, iç bindirme −1,9, **bindirme −2,7** (n 119); bütün hedeflenen koşularda −1,5 sn, %85'i pastan en az 0,3 sn önce başlıyor.
  - *Sıklık* (takım·90 dk): topun önüne 67,9 · destek 41,3 · kısaya gelme 31,9 · geri düşme 27,4 · ceza sahasına 23,4 · **savunma arkasına 18,7** · dışa açılma 16,1 · bindirme 7,5 · yarım alan 7,3 · iç bindirme 5,8. Oyun dakikası başına (iki takım; maçın sahiplik süresi ~53 dk) savunma arkasına **0,71**, topun önüne 2,56. Hedeflenme payı %28–45, savunma arkasına koşunun alınma payı %52 (bindirme %92).
  - *IDSSE* (iki Bundesliga maçı, resmî 25 Hz takip, CC BY 4.0; pasın çıkışı topun yörüngesinden — olay saatleri ±2 sn kayık): alıcısı koşan (≥ 15 km/sa, ≥ 0,7 sn) ileri paslarda koşu başı − pas çıkışı ortancası **−1,18 sn** (%10 −4,2 · %90 +0,7; n 112; erken ≤ −0,3 sn %74); alıcının pas anında ofsayt çizgisine ≤ 3 m ya da ötesinde olduğu derin paslarda **−0,64 sn** (n 23; erken %61).
  - *Wyscout / Pappalardo 2019* (1.941 maç olay verisi, CC BY 4.0; takım·maç başına): A→B→A dönüşü 3 sn içinde 24,2 (B'nin tek dokunuşu 23,8; olay verisi koşuyu göstermediği için gerçek ver-kaçın üst sınırı), hızlı üçlü A→B→C ileri 23,9 (üçüncü adamın olay verisindeki yaklaşığı), **geri çevirme 0,73** (kanattan, kale çizgisine ≤ ~12 m'den geriye ve ortaya; 3 sn içinde şut 0,36), akıllı pas (ara) 2,4.
  - *Motor için:* derin koşu planının zamanlaması (js/mac-ilkeller.js) ortanca ~0,9 sn, 0,4–1,6 sn aralığı; 20 dakikalık maç ~14,5 dk oyun içerdiği için gerçek sıklığın maç eşdeğeri: savunma arkasına ~10, topun önüne ~37, geri çevirme ~0,4.

### B.0.3 Alan değeri sayıları

**xT ızgarası (Karun Singh, açık veri, 8 satır × 12 sütun; satırlar sahanın enini 8'e böler, sütun 12 rakip kalenin dibi):**

| Satır (en) | S9 | S10 | S11 | S12 |
|---|---|---|---|---|
| 1 ve 8 (taç kenarı) | 0,021 | 0,028 | 0,035 | 0,038 |
| 2 ve 7 (kanat/yarım alan sınırı) | 0,024 | 0,030 | 0,041 | 0,046 |
| 3 ve 6 (yarım alan) | 0,024 | 0,029 | 0,055 | 0,064 |
| 4 ve 5 (merkez) | 0,024 | 0,035 | 0,108 | 0,257 |

Okuma: kale önü merkez hücre 0,257; onun bir gerisi 0,108; aynı derinlikte yarım alan 0,064, kanat 0,038. Yani **son çizgide merkez, yarım alanın ~4 katı, kanadın ~7 katı değerde**; bir sütun geride (ceza sahası ön yarısı) merkez 0,108 ↔ yarım alan 0,055 ↔ kanat 0,035. Kendi yarı sahasında bütün değerler 0,006–0,015. Pas/sürüşün değeri = bitiş hücresi − başlangıç hücresi. (Izgara 2017/18 Premier Lig olay verisinden; satır genişliği 8,5 m olduğundan "yarım alan" eşlemesi yaklaşıktır.)
- Kaynak: https://karun.in/blog/data/open_xt_12x8_v1.json ; açıklama: https://karun.in/blog/expected-threat.html

**EPV (Fernández, Bornn, Cervone):** anlık "sıradaki golü kim atar" tahmini; pas, sürüş ve şut bileşenlerine ayrışır; 22 oyuncunun konumunu kullandığı için topsuz koşu dolaylı değerlenir. Hücre değerleri yayında yok → motor için xT ızgarası pratik taban, EPV ise hedef biçim.
- Kaynak: https://arxiv.org/pdf/2011.09426 ; https://www.sloansportsconference.com/research-papers/decomposing-the-immeasurable-sport-a-deep-learning-expected-possession-value-framework-for-soccer

**Bölge 14 (Zone 14; ceza sahası önü merkez):** Championship 2010/11, 12 maç: 280 bölge-14 pozisyonu = hücumların %45,1'i (~23/maç); başarılı takımlar bu pozisyonların %43,2'sini şuta çevirdi, başarısızlar %28,8 (p<0,05). Atıfla: bölge 14'ten ceza sahasına pas, kanattan yatay pasın **~4 katı** gol üretir (Horn, Williams & Ensum 2002); başarılı takımlar bu bölgeye daha çok pas atar (Grant ve ark. 1998). Dünya Kupaları 2002–2014 açık oyun golleri: çoğunluk "Zone 14+" (orta saha çizgisi ile ceza sahası arası) kaynaklı; 12 turnuvanın 11'inde en verimsiz kategori orta.
- Kaynak: https://repository.mdx.ac.uk/item/832y5 ; https://researchprofiles.canberra.edu.au/en/publications/a-strategic-analysis-of-goals-scored-in-open-play-in-four-fifa-wo/

**Zone 17 (American Soccer Analysis; ceza sahası merkezi):** açık oyun + duran top gollerinin **%82'si** buradan. Zone 17'ye 100 pas denemesi başına gol: **ara pası 13,2; geri çevirme 6,4; ilerletici pas 4,5; orta ~2,5** (yaklaşık 40 denemede 1). Ortanın anahtar pas dönüşümü %14 (normal pasa yakın); ilerletici anahtar pas %20.
- Kaynak: https://www.americansocceranalysis.com/home/2021/3/11/where-goals-come-from-putting-balls-into-the-box

**Yarım alandan girişin değeri:** xT tablosunda S11 sütununda yarım alan 0,055 ↔ kanat 0,041 ↔ merkez 0,108; Spielverlagerung'un gerekçesi: yarım alandaki oyuncu merkezdeki kadar seçeneğe sahiptir ama bakışını kaleden çevirmez; rakip hem yönünü hem yüksekliğini düzeltmek zorunda kalır. Ayrı bir "yarım alan girişi başına xG" ölçümü **bulunamadı**.
- Kaynak: https://spielverlagerung.com/?p=339

---

## B.1 İlerletme ilkelleri

### B.1 Üçüncü adam (third man) — ve "yukarı-geri-ara" (up-back-through)
- **Evre:** kurma → ilerletme; son üçte birde de (savunma arkasına).
- **Bağlam ve tetik:** Rakip top taşıyana doğru çekildiğinde. Tanım (Coaches' Voice): "top sahibi takım bir rakibi topa doğru çeker; iki oyuncu pas alışverişi yapar, üçüncüsü topsuz koşuyla boşluğa girip alır." Değeri: doğrudan pasla bulunamayan oyuncuyu bulmak. Lillo'nun kuralı: "dönüp oyuna yüzünü dönebilsin diye üçüncü adamı (serbest adamı) ara." Varyant: hatlar arasındaki oyuncu ilk pası alır, topu rakibin kör tarafına kaymış arkadaşına aktarır. Tetikler: top taşıyanın ileri hareketi bir rakibi yerinden çıkarır; boşalan alana üçüncü adam girer; yakındaki arkadaş oraya pas verir.
- **Roller ve hareket:** A (pasçı, derin) → B (duvar/hedef; sırtı kaleye, hatlar arasında) → A ya da C'ye bırakış → C (üçüncü adam) B'nin markajcısının kör tarafından ileri. Up-back-through: dikey pas (up), geri bırakış (back), üçüncü adama ara pası (through). C'nin koşusu B'nin ilk dokunuşuyla başlar; pas B'den çıkarken C tam hızda (B.0.2 tahmini: 0,5–1,5 sn). Mesafe: A–B 10–20 m dikey, B–C 5–12 m çapraz (**tahmin**; Cruyff'un "10 m'den uzun pas atmazlardı" sözü ölçek verir).
- **Topun yolu:** yerden sert dikey pas; tek dokunuş bırakış (topuk ya da iç ayak); ara pası yerden, savunmanın arkasına, koşucunun önüne. Toplam 2–3 dokunuş.
- **Zamanlama:** 2–4 sn'lik dizi (tahmin). Bağlılık: B pası alamazsa plan düşer; C koşusunu 1–2 sn sürdürür, sonra yeniden konumlanır (SkillCorner koşu tanımında koşu ≥0,7 sn sayılır).
- **Başarı ölçüsü ve sıklık:** üçüncü adam koşusunun olay verisinden sayımı denenmiş (Lamberts), ama sonuç ücretli → **bulunamadı**. Dolaylı: ASA'da ara pasının anahtar pas dönüşümü ~%30 xG/şut (0,05–0,5 aralık), ikincil anahtar pas olarak ~%40; üçüncü adam dizisinin çoğu ara pasıyla biter.
- **Panzehir:** alçak blokta üçgenler ve pas hatları kurulamaz (Coaches' Voice); B'yi "sırtından" sıkıştıran önleyici orta saha; B'nin markajcısı topa değil C'nin koşusuna bakar; C'nin koşusuna ofsayt hattı.
- **Kabiliyet eşiği (tahmin):** Görme 3 (B için ters taramayla C'yi görme), Karar 3 (bırakış/dönüş seçimi), Yürütme 3 (tek dokunuş bırakış doğruluğu). Dünya sınıfında C'nin kör taraf okuması 4–5.
- **Hoca tarzı:** konumsal oyun (Guardiola — "her oyuncu için en az iki pas hattı"), Gasperini'nin ters üçgeni (Atalanta), Barcelona geleneği; bazı kaynaklar "up-back-through" etiketini Bielsa'ya bağlar (arama özeti; birincil doğrulama **bulunamadı**).
- **Ünlü örnek:** Arjantin 6–0 Sırbistan-Karadağ, 16 Haziran 2006, Cambiasso'nun golü: 24 paslık dizi, sonunda Crespo'nun topukla bırakışı ve Cambiasso'nun gelişine vuruşu (Wikipedia 24 pası doğrular; topuk ayrıntısı ve dakika yaygın anlatım, kaynakta yok). Man City'nin Chelsea stoperlerinin arkasına üçüncü adamla girişi (Coaches' Voice örneği).
- **Kaynaklar:** https://m.allfootballapp.com/news/Serie-A/Third-man-runs-football-tactics-explained--how-coaches-like-Guardiola-use-it/2749753 ; https://spielverlagerung.com/2014/12/25/juego-de-posicion-under-pep-guardiola/ ; https://www.sportsessionplanner.com/s/Cggli/Creating-third-man-run-opportunities-and-numerical-advantage.html ; https://en.wikipedia.org/wiki/Esteban_Cambiasso ; https://www.americansocceranalysis.com/home/2021/10/8/where-goals-come-from-playing-the-killer-final-ball ; https://marclamberts.substack.com/p/calculating-triangular-third-man

### B.2 Duvar pası / ver-kaç (wall pass, one-two, give-and-go; Port. tabela)
- **Evre:** ilerletme, son üçte bir.
- **Bağlam ve tetik:** Top taşıyanın önünde tek rakip, 3–8 m'de yüzü dönük bir arkadaş var ve rakibin arkasında boşluk. Tetik: rakibin top taşıyana bir adım yaklaşması (ağırlığı öne).
- **Roller ve hareket:** A pası verir ve **aynı anda** rakibin diğer tarafından koşar; B (duvar) tek dokunuşla A'nın koşu yoluna bırakır. A'nın koşusu pasla eşzamanlı başlar (gecikme ~0 sn); duvarın bırakışı 0,3–0,6 sn içinde (tahmin). Mesafe A–B 4–8 m, toplam kazanılan derinlik 8–15 m (tahmin).
- **Topun yolu:** yerden, orta sert; iki dokunuş (A'nın pası, B'nin bırakışı); A gelişine alır.
- **Zamanlama:** 1–2 sn. Bağlılık: B bırakmazsa A koşusunu derin koşuya çevirir (aldatma etkisi kalır).
- **Başarı ölçüsü:** rakip eleme (A rakibin arkasında topla). Lig sıklığı/başarı oranı **bulunamadı**.
- **Panzehir:** rakip A'yı değil pas hattını kapatıp duvarın alışını bozar; ikinci savunmacı A'nın koşusunu devralır ("pas et, devret" uyarısı sessiz iletişim gerektirir).
- **Kabiliyet eşiği (tahmin):** Görme 2, Karar 2–3 (zamanlama), Yürütme 3 (duvarın tek dokunuş açısı).
- **Hoca tarzı:** ilişkisel oyunun temel taşı (tabela, "toco y me voy"); konumsal oyunda da yarım alanda sık.
- **Ünlü örnek:** Brezilya futbolunun "tabela"sı — Flamengo 1980'ler (Zico, Júnior) "toco y me voy"un cisimleşmiş hali (Hamilton). Maç-dakika düzeyinde kaynaklı örnek **bulunamadı**.
- **Kaynaklar:** https://medium.com/@stirlingj1982/what-is-relationism-c98d6233d9c2 (erişim 403; arama özetinden) ; https://espndeportes.espn.com/futbol/copa-libertadores/nota/_/id/12779404/fluminense-el-equipo-invertebrado-que-disputa-la-hegemonia-tactica-europea ; https://www.elgrafico.com.ar/articulo/1088/33820/1965-toco-y-me-quedo

### B.3 Dikey pastan sonra bırakma (lay-off / set)
- **Evre:** ilerletme (hatlar arası), son üçte bir (forvetin önüne gelen dikey top).
- **Bağlam ve tetik:** Sırtı kaleye dönük alıcı (forvet ya da 10 numara) markajlı; önünde dönmeye yetecek alan yok ama 3–10 m gerisinde yüzü kaleye dönük arkadaş var. Tetik: dikey pasın çıkışı; bırakış için "kim yüzü dönük" bilgisi pastan önce tarama ile alınır.
- **Roller ve hareket:** A dikey pas; B gövdesiyle markajcıyı sabitler (kol uzatıp hisseder, ön kolla iter — antrenörlük notu), tek dokunuşla geriye/çapraza bırakır; C bırakışı gelişine alır ve ara pası / şut / çevirme. B'nin öncelik sırası (antrenman notu): önce dönüp kaleye git, olmazsa topu tut, olmazsa "set edip" oyna.
- **Topun yolu:** sert yerden dikey; bırakış yumuşak, C'nin önüne; 2 dokunuş.
- **Zamanlama:** 1,5–3 sn. Bağlılık: B dönebilirse plan değişir (sırtla dönme ilkeli).
- **Başarı ölçüsü:** C'nin topu rakip hattın gerisinde, yüzü kaleye dönük alması. Oran **bulunamadı**.
- **Panzehir:** stoper B'ye yapışır ama "önce top" kuralıyla; önleyici orta saha C'nin alış noktasını önceden kapatır; dikey pas hattını kapatan kompakt hatlar (hat arası 10 m: Spielverlagerung örneğinde 10 m'lik hat aralığı).
- **Kabiliyet eşiği (tahmin):** Görme 3 (sırtla tarama), Karar 2, Yürütme 3 (temas altında tek dokunuş).
- **Hoca tarzı:** hemen her ekol; hedef adamlı sistemlerde ikinci top için, konumsal oyunda üçüncü adam zinciri için.
- **Ünlü örnek:** 1970 finali 86': Pelé, Jairzinho'nun ortasından sonra topu tutup İtalyan savunmasını merkeze çekti ve sağ kanattan gelen Carlos Alberto'nun önüne bıraktı (Wikipedia).
- **Kaynaklar:** https://www.sportsessionplanner.com/s/9Fjlb/Pin-and-Spin-to-finish.html ; https://www.sportsessionplanner.com/s/0KUZ/Scoring-Tactics-for-Striker-2.0.html ; https://en.wikipedia.org/wiki/1970_FIFA_World_Cup_final ; https://spielverlagerung.com/?p=339

### B.4 Bindirme (overlap)
- **Evre:** ilerletme → son üçte bir (kanat).
- **Bağlam ve tetik:** Kanat oyuncusu topla içe dönük ya da rakip bekle karşı karşıya; dış koridor boş. Tetik: kanat oyuncusunun içe kesmesi ya da topu içe alışı; rakip bekin topa odaklanması.
- **Roller ve hareket:** Bek (ya da uzak orta saha) kanat oyuncusunun **dışından** geçerek taç çizgisine doğru ileri koşar (Opta tanımı: top taşıyanın dışından, taç çizgisine yakın). Kanat oyuncusu içe sürerek rakip beki kendine çeker (sabitler). Koşu pastan 1,5–3 sn önce başlar (tahmin; mesafe 15–30 m, Gradient'in "uzun" koşu bandı >24 m). Dünya sınıfı veri: bindirmelerin %68'i beklerden (Premier Lig, Gradient).
- **Topun yolu:** içe sürüş sonrası dış ayağın tersine yerden pas koşucunun önüne ya da hiç pas yok (aldatma); bindirenin ortası/geri çevirmesi.
- **Zamanlama:** 3–5 sn. Bağlılık: kanat oyuncusu içe kesip şut/pas tercih ederse bindiren orta için uzak direğe devam eder (koşu boşa gitmez).
- **Başarı ölçüsü ve sıklık:** Premier Lig 2024/25: Newcastle 277 bindirme (sezon), Man City 76 (~2/maç); takımlar arası fark 3,5 kat. Pas alma oranı Opta makalesinde yok → **bulunamadı**. Gradient'te bindiren bek Djed Spence 30 dk hücum süresinde 2,7 bindirme.
- **Panzehir:** kanat oyuncusu geri koşup bindireni takip eder ("bek-kanat devri"); rakip bek içe kesen oyuncuyu bırakmaz, bindireni stoperin kaydırmasına bırakır; bindirme sonrası ortaya karşı kutu savunması.
- **Kabiliyet eşiği (tahmin):** Görme 2 (bek için), Karar 2, Yürütme: hız/dayanıklılık 3, orta kalitesi 3.
- **Hoca tarzı:** geleneksel 4-3-3/4-4-2 kanat oyunu; ters ayaklı kanatlarla eşleşmiş bekler (Robben–Lahm tipi; Wikipedia Robben/Ribéry'yi ters kanatlarda eşleşmiş sayar).
- **Ünlü örnek:** 1970 finali 86', Carlos Alberto'nun sağdan "buharlı tren gibi" gelişi ve Pelé'nin bırakışı; Tostão'nun Pelé'ye "sağdan geliyor" uyarısı (Wikipedia).
- **Kaynaklar:** https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league ; https://www.gradientsports.com/blog/measuring-off-ball-movement-using-broadcast-tracking-event-data ; https://en.wikipedia.org/wiki/1970_FIFA_World_Cup_final ; https://en.wikipedia.org/wiki/Forward_(association_football)

### B.5 İç bindirme (underlap)
- **Evre:** ilerletme → son üçte bir (yarım alan).
- **Bağlam ve tetik:** Kanat oyuncusu çok açık, taç çizgisinde; rakip bek dışa çekilmiş ve bek–stoper arası açık. Tetik: kanat oyuncusunun topu geniş alması ve rakip bekin ona çıkması; iç koridor boş.
- **Roller ve hareket:** Bek ya da 8 numara kanat oyuncusunun **içinden**, bek–stoper kanalına çapraz koşar (Opta: top taşıyanın içinden, sahanın ortasına yakın). Koşu kanat oyuncusu topu alırken başlar (1–2 sn önce, tahmin); mesafe 10–20 m.
- **Topun yolu:** yerden çapraz pas kanala; iç bindiren geri çevirme (cut-back) ya da yakın direğe alçak orta oynar; bazen tek dokunuşla şut.
- **Zamanlama:** 2–4 sn. Bağlılık: pas gelmezse koşucu kutu içine "cross receiver" olarak devam eder.
- **Başarı ölçüsü ve sıklık:** Premier Lig 2024/25 Tottenham 259 iç bindirme (en çok, ikinciden 37 fazla). FourFourTwo: iç bindirme kanat oyuncularının çok açık durmasıyla gelişti; "ters bek"ten beklenen koşudur.
- **Panzehir:** stoper kanala kaymaz, önleyici orta saha koşucuyu takip eder (markaj devri); rakip bek kanat oyuncusuna geç çıkar, kanalı kapalı tutar.
- **Kabiliyet eşiği (tahmin):** Görme 3 (kanalın açıldığını okuma), Karar 3, Yürütme 3 (dar alanda alçak orta/geri çevirme).
- **Hoca tarzı:** konumsal oyun (geniş kanatlar + içe giren bek/8), Postecoglou'nun Tottenham'ı (veriyle), Arteta.
- **Ünlü örnek:** kaynaklı maç-dakika **bulunamadı**; sezon verisiyle Tottenham 2024/25 örneği.
- **Kaynaklar:** https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league ; https://fourfourtwo.com/features/football-tactics-overlap (metin üye duvarı; arama özetinden) ; https://www.driblab.com/blog/arrigo-off-ball-runs

### B.6 Kör taraf koşusu (blindside run)
- **Evre:** son üçte bir; ilerletmede hatlar arasına.
- **Bağlam ve tetik:** Savunmacı topa bakıyor; koşucu onun hem topu hem kendisini göremeyeceği açıdan (sırtının arkası/kör omzu) başlar. Tetik: pasçının başı kalkar / topu önüne alır; savunmacının gövdesi topa döner.
- **Roller ve hareket:** Koşucu savunmacının arkasından çapraz, stoper–bek arasına ya da stoperler arasına; "toplar stoperlerin yanlarından ve bekin iç tarafından kaydırılır" (Elite Soccer Coaching). Koşu pasla aynı anda ya da hemen önce (0–1 sn, tahmin); ofsayt hattını kırmamak için kavisli koşu (B.9).
- **Topun yolu:** yerden ya da hafif yükseltilmiş, savunmacının arkasına; koşucu gelişine ya da tek kontrol.
- **Zamanlama:** 1–2 sn. Bağlılık: pas gelmezse koşucu hattı germiş olur (aldatma değeri), 2 sn içinde geri toparlanır.
- **Başarı ölçüsü:** markajcının görüşünden çıkıp pası savunmasız alma. Oran **bulunamadı**. Antrenman kuralı: "altı pas tamamlamadan kör taraf koşusu denemeyin" (rakibi önce topa çekmek).
- **Panzehir:** savunmacının "top ve adam" görecek yan duruşu; yanındaki savunmacının sözlü uyarısı; derin savunma hattı (koşacak alan kalmaz).
- **Kabiliyet eşiği (tahmin):** Görme 4 (savunmacının bakış yönünü okuma), Karar 3, Yürütme 2–3.
- **Hoca tarzı:** her ekol; "Raumdeuter" (alan yorumcusu) tipi oyuncularla belirgin — Thomas Müller'in lakabı (Wikipedia: "interpreter of space").
- **Ünlü örnek:** Müller'in Bayern ve Almanya'daki ikinci direk/kör taraf golleri (genel; maç-dakika kaynaklı **bulunamadı**). Messi'nin Dünya Kupası 2022 koşularının %30'u savunmacıyı yerinden oynatan "nedensel" koşu (Gradient).
- **Kaynaklar:** https://elitesoccercoaching.net/attacking/blind-side-running ; https://en.wikipedia.org/wiki/Thomas_M%C3%BCller ; https://the-cutback.beehiiv.com/p/off-ball-movement-football-tracking-data

### B.7 Çift hareket (double movement; check-to-receive then spin)
- **Evre:** son üçte bir (forvet), ilerletme (10 numara).
- **Bağlam ve tetik:** Markajcı sıkı, pasçı topla yüzü dönük ve iki seçenek var (ayağa / arkaya). Tetik: pasçının topu önüne alması; markajcının ilk harekete tepki verip ağırlığını aktarması.
- **Roller ve hareket:** Forvet önce kaleye doğru 2–3 m uzaklaşır (markajcıyı derine iter), sonra topa doğru patlar ("check"); markajcı takip edince topu almadan ya da tek dokunuş geri pasla **döner (spin)** ve arkaya koşar. Antrenman akışı: "topa doğru patla, kolu uzatıp savunmacıyı hisset, gövdeyle onu geri it, tek dokunuş geri pastan sonra arkaya dön." İpucu kodlaması: forvet bir yöne hareket ederse arka pas, diğerine ederse ayağa pas (Bielsa antrenman örneği, arama özeti).
- **Topun yolu:** birinci hareket için yerden ayağa (verilirse), ikincisi için arkaya ara pası; toplam 1–3 dokunuş.
- **Zamanlama:** 2–3 sn (ilk hareket 1 sn, dönüş + koşu 1–2 sn). Bağlılık: ikinci hareket pas gelmese de sürdürülür (hat gerilir).
- **Başarı ölçüsü:** markajcıyla 1–2 m ayrışma anında pas. Oran **bulunamadı**. SkillCorner: santrfor koşularının %8'i "kısaya gelme", %32'si "arkaya".
- **Panzehir:** markajcı ilk harekete gövdeyle değil adımla tepki verir (mesafeyi korur); stoper "topa değil adama" yerine "arkaya bak" önceliği; önleyici orta saha ayağa pas hattını keser.
- **Kabiliyet eşiği (tahmin):** Görme 3, Karar 3 (hangi hareketin gerçek olduğunu geç belli etme), Yürütme 3 (patlayıcılık, dönüş hızı).
- **Hoca tarzı:** klasik forvet antrenmanı (her ekol); Bielsa'nın koşu zamanlaması çalışmaları.
- **Ünlü örnek:** kaynaklı maç-dakika **bulunamadı**.
- **Kaynaklar:** https://www.sportsessionplanner.com/s/0KUZ/Scoring-Tactics-for-Striker-2.0.html ; https://footballgpt.co/guides/perfect-striker-runs-timing-for-goalscoring-success ; https://skillcorner.com/blog/forward-off-ball-runs

### B.8 Aldatma koşusu (decoy run / dummy run)
- **Evre:** son üçte bir; duran top dışında açık oyunda orta ve ara pası öncesi.
- **Bağlam ve tetik:** Asıl alıcıyı örten savunmacı var; onu yerinden oynatacak ikinci bir koşucu var. Tetik: pasçının topu kontrol etmesi (3 sn penceresi).
- **Roller ve hareket:** Aldatıcı, savunmacıyı kendisiyle birlikte götürecek yönde (çoğunlukla yakın direğe ya da dışa) koşar; asıl alıcı boşalan alana (çoğunlukla penaltı noktası / uzak direk) gecikmeli girer. Gradient'in ölçüsü: bir koşu "nedensel"dir eğer savunmacı koşucuyla aynı yönde (kosinüs benzerliği ≥0,7, mesafenin ≥%50'si) hareket edip alıcıdan ≥1 m uzaklaşırsa.
- **Topun yolu:** aldatıcıya değil, boşalan alana; pas türü duruma göre (ara pası, geri çevirme, orta).
- **Zamanlama:** 1–3 sn; aldatıcı pasın 1–2 sn öncesinde başlar, asıl alıcı 0,5–1 sn sonra (tahmin).
- **Başarı ölçüsü ve sıklık:** Dünya Kupası 2022'de kutuya pas başına 3,3 koşucu; koşuların %12,9'u nedensel; nedensel koşu sonrası şans yaratma %19,2 ↔ %14,8. Oyuncu bazında Messi %30, Kane %25, Giroud %20, Kimmich %7,7, Eriksen %0 nedensel (küçük örneklem).
- **Panzehir:** bölge savunması (adam değil alan takibi) aldatmayı etkisizleştirir; savunmacı "topu ve alanı" tutar, koşucuyu teslim eder; iletişimle markaj devri.
- **Kabiliyet eşiği (tahmin):** Görme 3, Karar 4 (aldatmanın inandırıcı olması, zamanlaması), Yürütme 2.
- **Hoca tarzı:** her ekol; özellikle orta ağırlıklı ve kalabalık kutu giren takımlar.
- **Ünlü örnek:** 1970 finali 86': Pelé'nin topu tutup savunmayı merkeze çekmesi (Wikipedia) ve yaygın anlatımda Jairzinho'nun içe koşusunun sol beki içeri çekmesi (ikincisi kaynakta yok, "yaygın anlatım").
- **Kaynaklar:** https://the-cutback.beehiiv.com/p/off-ball-movement-football-tracking-data ; https://en.wikipedia.org/wiki/1970_FIFA_World_Cup_final

### B.9 Hattı germe, derine koşu ve ofsayt çizgisiyle oyun (stretching the line, run in behind, playing the offside line)
- **Evre:** ilerletme (hattı derine itmek için) ve son üçte bir (bitirici koşu).
- **Bağlam ve tetik:** Rakip savunma hattı yüksek ve/veya pasçı baskısız, topla yüzü dönük. Tetik: pasçının başı kalkar / topu açık ayağına alır; savunma hattının ileri adımı (hat çıkarken koşu başlatmak hattı yakalar).
- **Roller ve hareket:** Koşucu hattın hizasında yan dururken kavisli koşuyla (önce yana, sonra derine) ofsaytta kalmadan hız kazanır: "kavisli koşu: savunma hattıyla hizada kalır, sonra hızlanır" (footballgpt); "ofsayt tuzağını yenmek için koşuyu bük" (Elite Soccer Coaching). Çeşitler: düz (hat açıkken), çapraz (stoperin önünden geçerek), kavisli, topa doğru (arka kapalıysa). Koşu pastan 0,5–1,5 sn önce (tahmin; vuruş anında koşucu hat hizasında ya da bir adım geride olmalı). Hattı germe amaçlı koşu pas gelmese de hatları 5–10 m açar (tahmin).
- **Topun yolu:** yerden ara pası (en değerli: ASA'da ~0,3 xG/şut, 100 denemede 13,2 gol) ya da havadan aşırtma; koşucu 1 kontrol + şut ya da gelişine.
- **Zamanlama:** koşu 1–3 sn, toplam 2–4 sn. Bağlılık: koşu başladıysa pas gelmese de 1–2 sn sürdürülür; ofsayt pozisyonuna düşen koşucu hemen geri döner (VAR'da milimetrik ofsayt: kavis ve "hatla hizalı başla" disiplini daha önemli — sayısal etkisi **bulunamadı**).
- **Başarı ölçüsü ve sıklık:** santrfor koşularının %32'si arkaya koşu (SkillCorner). Mbeumo 2024/25 takım toplu 418 arkaya koşu (~11/maç). Opta: Alexander-Arnold → Salah 146 hat kıran pas, 37'si Salah'ı arkaya attı. Ara pası sıklığı düşük ama en verimli pas türü (ASA).
- **Panzehir:** düşük hat (alan yok); ofsayt tuzağı (hattı bir adım çıkarma — koordinasyon ister); pasçıya baskı (uzun topu zorla); kaleci-libero.
- **Kabiliyet eşiği (tahmin):** Görme 3 (hattı ve pasçıyı aynı anda), Karar 4 (zamanlama; ofsayt payı), Yürütme: hız 3–4, kontrol 3.
- **Hoca tarzı:** geçiş takımları (Klopp, Simeone kontra), dikey takımlar; konumsal oyunda sahte 9 ile birlikte kanatların derin koşusu (Guardiola 2009).
- **Ünlü örnek:** 2 Mayıs 2009 Bernabéu, Real Madrid 2–6 Barcelona: Henry'nin iki golü de savunma arkasına ara paslarından (biri derine düşen Messi'den, biri Xavi'nin uzun pasından) (Barca Universal).
- **Kaynaklar:** https://footballgpt.co/guides/perfect-striker-runs-timing-for-goalscoring-success ; https://elitesoccercoaching.net/attacking/blind-side-running ; https://skillcorner.com/blog/forward-off-ball-runs ; https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league ; https://www.americansocceranalysis.com/home/2021/3/11/where-goals-come-from-putting-balls-into-the-box ; https://barcauniversal.com/the-best-of-barca-tactical-analysis-of-the-real-madrid-2-6-barcelona/

### B.10 Oyunu çevirme (switch of play)
- **Evre:** kurma, ilerletme; son üçte birde "yığ ve yalnız bırak"ın son adımı.
- **Bağlam ve tetik:** Rakip blok top tarafına kaymış (5–6 oyuncu topun 20–25 m'sinde — tahmin), uzak kanat oyuncusu 1v1 ya da boş. Tetik: top tarafında pas hattı kapanır, top yarım alandaki yüzü dönük oyuncuya gelir.
- **Roller ve hareket:** Çeviren oyuncu tercihen **yarım alandan** çevirir — Spielverlagerung: yarım alandan diğer yarım alana "üç bölge üzerinden" çevirme "oyunu çevirmek için muhtemelen en uygun yer"; merkez oyuncusu kanada oynamak için bakışını kaleden çevirmek zorundadır, yarım alandaki değildir. Uzak kanat oyuncusu genişlikte bekler, bek bindirme için hazırlanır; çevirme havadayken 1–2 oyuncu uzak kanadın altına destek koşusu yapar (ikinci dalga).
- **Topun yolu:** Analytics FC tanımı: "sahanın en az yarısı genişliğinde, bir kanat koridorundan karşı kanat koridoruna pas." Havadan sürülmüş (driven) çapraz 35–55 m ya da iki kısa pasla "dolaylı çevirme" (yarım alan → merkez → uzak yarım alan). Çevirme havada 1,5–2,5 sn (tahmin).
- **Zamanlama:** çevirme sonrası 3–5 sn'lik hücum penceresi (rakip blok kaymadan). Bağlılık: alan kapanırsa top tekrar içeri (yeniden yığma).
- **Başarı ölçüsü ve sıklık:** maç başına çevirme ve tamamlanma oranı **bulunamadı** (Opta tanımlarında "switch" yok; Analytics FC metriğinde değer kale farkına etkiyle ölçülür). Spielverlagerung'un gerekçesi: çapraz pas hem alan kazanır hem oyunu kaydırır, "top çaprazda daha uzağa ve daha hızlı gider".
- **Panzehir:** kompakt blok (uzak kanat oyuncusu içe yaklaşır, çevirmeyi stoper değil bek karşılar); çevirme havadayken sprintle kayma; pasçıya baskı (uzun top kalitesini düşür).
- **Kabiliyet eşiği (tahmin):** Görme 4 (uzak tarafı tarama), Karar 3, Yürütme 4 (40+ m isabetli sürülmüş pas).
- **Hoca tarzı:** konumsal oyun ("rakibi hareket ettir, topu değil"; top tarafını yığ, uzak tarafı az bırak, çevir), Ancelotti/Mourinho tipi kanat 1v1 takımları, Bayern'in Robben–Ribéry çağı.
- **Ünlü örnek:** Liverpool'un Alexander-Arnold'dan Robertson/Mané'ye çaprazları (Analytics FC örneği; maç-dakika yok).
- **Kaynaklar:** https://analyticsfc.co.uk/blog/2021/05/24/developing-new-metrics-switching-the-play/ ; https://spielverlagerung.com/?p=339 ; https://spielverlagerung.com/2014/12/25/juego-de-posicion-under-pep-guardiola/ ; https://theanalyst.com/articles/opta-football-stats-definitions

### B.11 Yığ ve yalnız bırak (overload to isolate)
- **Evre:** ilerletme → son üçte bir.
- **Bağlam ve tetik:** Takımda nitel üstünlüğü olan kanat oyuncusu var (1v1 kazanan); rakip bek yalnız kalabilir. Tetik: top tarafında 4v3/5v4 kurulup rakip orta saha kaydığında.
- **Roller ve hareket:** Bir kanatta bek + 8 + kanat + forvetin yanaşmasıyla yığılma (Opta ölçüsü: Tottenham ilerletme süresinin %5,1'ini "top sahibi yığılmada" geçirdi, lig birincisi); uzak kanat oyuncusu taç çizgisinde, bekinden 5–10 m içeride değil tam açık (tahmin); çevirme (B.10) ile top ona gelir; o anda uzak taraf beki iç bindirme/bindirme için başlar, forvet yakın direğe.
- **Topun yolu:** 3–6 kısa pasla yığ (rakibi çek), bir uzun çapraz; sonra 1v1 sürüş ve orta/geri çevirme.
- **Zamanlama:** 8–15 sn'lik dizi (Guardiola'nın "15 pas" anlayışı yapının oturmasını bekler). Bağlılık: çevirme yapılamazsa yığın içinden üçüncü adam denenir.
- **Başarı ölçüsü ve sıklık:** 1v1'e ulaşma sayısı ve sonucu; lig ölçümü **bulunamadı**. Analytics FC: çevirme "yığıp yalnız bırakmayı" destekler — kanat oyuncusu rakip bekle 1v1 kalır.
- **Panzehir:** uzak kanat oyuncusunun içe kapanmaması (çevirmeyi beklemesi), çift kanat savunması (kanat + bek), çevirmeyi havada kesen yüksek orta saha.
- **Kabiliyet eşiği (tahmin):** takım düzeyinde ortak niyet; çeviren Görme 4 / Yürütme 4; yalnız kalan kanat için sürüş 4+.
- **Hoca tarzı:** konumsal oyun (açıkça: "top tarafını yığ, uzak tarafı az bırak, rakip kayınca serbest adama çevir"); Mourinho'nun kanat 1v1 kullanımı (kaynaksız, yaygın anlatım).
- **Ünlü örnek:** kaynaklı maç-dakika **bulunamadı**; sezon verisiyle Tottenham 2024/25 (yığılma süresi lig birincisi, dribling başarısı lig sonuncusu %39,0 — yığmanın bitirmeye dönmediği örnek).
- **Kaynaklar:** https://spielverlagerung.com/2014/12/25/juego-de-posicion-under-pep-guardiola/ ; https://analyticsfc.co.uk/blog/2021/05/24/developing-new-metrics-switching-the-play/ ; https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league

### B.12 Yarım alan kullanımı ve beş koridor (half-space, five lanes)
- **Evre:** kurma, ilerletme, son üçte bir — alan ilkesi, bütün evrelerde.
- **Bağlam:** Saha boyuna beş koridora bölünür: iki kanat, iki yarım alan (ceza sahası çizgisi ile kale sahası çizgisi arasındaki şerit uzantısı), merkez. Konumsal oyunun kuralları (Spielverlagerung): **aynı yatay çizgide en çok 3, aynı dikey koridorda en çok 2 oyuncu** (tavsiye, katı değil); iç koridorlar "rakibi eleyip kaleye çapraz ilerlemek için anahtar bölge".
- **Neden değerli (Spielverlagerung):** yarım alandaki oyuncu merkezdeki kadar seçeneğe sahiptir ama kaleye bakışını kaybetmez; hem merkez hem kanat seçenektir (merkezdeki oyuncunun yalnız iki yarım alanı vardır); sırttan baskı riski az ("yeterli alanım var" ile "görmediğim şey önemli değil" kesişimi); rakip hem yönünü hem yüksekliğini düzeltmek zorundadır, savunmacılar farklı hareket eder → hata; çapraz pas hem alan kazanır hem oyunu kaydırır. Geometri örneği: 10 m aralıklı iki hat arasında 5 m'lik ara bantta duran kanat, rakip beki 5 yerine 7,07 m (√50) yol yürümeye zorlar. Barcelona'nın yarım alandaki üçlüsü 4 rakibi bağlar; Messi'nin bek–stoper arası tehdidi 2–4 oyuncuyu bağlar.
- **Roller ve hareket:** 8/10 numaralar yarım alanda yüzü yarı dönük; kanatlar genişlikte (Guardiola: "kanatlar içeriyi açmak için açık kalmalı"); bekler içeri ya da dışarı duruma göre; forvet stoperleri sabitler.
- **Topun yolu:** yarım alana giren dikey/çapraz pas, oradan ara pası, geri çevirme ya da çevirme.
- **Zamanlama:** sürekli; yarım alanda alış sonrası 1–2 sn içinde karar (rakip kapanmadan).
- **Başarı ölçüsü:** xT tablosunda ceza sahası ön yarısı: merkez 0,108, yarım alan 0,055, kanat 0,035; bölge 14'ten ceza sahasına pas kanattan yatay pasın ~4 katı gol üretir (Horn 2002).
- **Panzehir:** 4-4-2 kompakt blokta yarım alanı kapatan kanat orta sahası + bek ikilisi; 5'li savunma (yarım alana karşı ek stoper); hat arası 8–10 m'de tutulur.
- **Kabiliyet eşiği (tahmin):** yarım alan oyuncusu Görme 4 (180–200° görüş alanını kaleye çapraz kullanma), Karar 4, Yürütme 3–4.
- **Hoca tarzı:** konumsal oyun (Guardiola, Lillo, Arteta, Alonso), Alman "Halbraum" okulu (Nagelsmann, Tuchel).
- **Ünlü örnek:** De Bruyne/Müller tipi yarım alan oyunu (genel). Spielverlagerung'un Barcelona örneği (2010–12).
- **Kaynaklar:** https://spielverlagerung.com/?p=339 ; https://spielverlagerung.com/glossary/pitch-zones/half-space/ ; https://spielverlagerung.com/2014/12/25/juego-de-posicion-under-pep-guardiola/ ; https://karun.in/blog/data/open_xt_12x8_v1.json ; https://repository.mdx.ac.uk/item/832y5 ; https://www.antoinebuteau.com/lessons-from-pep-guardiola/

### B.13 Geri çevirme (cut-back; Opta: pull-back) — "en tehlikeli pas"
- **Evre:** son üçte bir → bitiriş.
- **Bağlam ve tetik:** Top kale çizgisine yakın, ceza sahası içinde kanat/yarım alanda; savunma kaleye dönük geri koşmuş; penaltı noktası civarı boş. Tetik: top taşıyan kale çizgisine inince savunmanın gövdesi kaleye döner.
- **Roller ve hareket:** Çizgiye inen (kanat, bindiren bek ya da iç bindiren 8) yerden geriye pas; alıcılar üç dalgada: yakın direk (savunmacıyı çeker — çoğu kez aldatma), penaltı noktası/"Golden Zone" (kale sahası genişliği × ceza sahası uzunluğu şeridi), ceza sahası yayı (ikinci top). Kutuya pas başına ortalama 3,3 koşucu (Gradient). Alıcı koşusu pastan 1–2 sn önce, **geç gelen** oyuncu en serbesttir (tahmin + antrenörlük).
- **Topun yolu:** yerden, orta sert, geriye 30–60° açı; alıcı **tek dokunuş** şut (Analytics FC: ilk dokunuş şut, yakın mesafe, savunma kendi kalesine dönük → yüksek değer).
- **Zamanlama:** 1–2 sn. Bağlılık: Golden Zone kapalıysa yay'a geri çevirme ya da yeniden kurma.
- **Başarı ölçüsü ve sıklık:** ASA (6 lig): **maç başına ~1,56 geri çevirme, %32 tamamlanma, tamamlananların ~%25'i şut**; ikincil anahtar pas olarak dönüşüm %14; Zone 17'ye 100 denemede 6,4 gol (ortanın ~2,5 katı). Analytics FC: Golden Zone'a geri çevirme **%25 dönüşüm**; şutların ~%50'si ve gollerin %82'si Golden Zone'dan. Opta tanımı (pull-back): ceza sahasında kale çizgisine ulaşıp topu geriye kesen pas.
- **Panzehir:** "çizgiyi savunma" — stoper çizgiye inene çıkmaz, önleyici orta saha penaltı noktasını kapatır ("geri çevirme bölgesini koru"); kanat oyuncusu/bek kutuya geri koşar; kaleci yakın direkte değil orta kalır.
- **Kabiliyet eşiği (tahmin):** Görme 3 (sırtı kaleye dönük taraması), Karar 3, Yürütme 3 (dar açıdan yerden sert pas); alıcı için zamanlama 3, ilk dokunuş bitiriş 3–4.
- **Hoca tarzı:** Guardiola'nın Man City'si (2018/19: Sané ve Sterling çizgiye inerdi), Klopp'un Liverpool'u (bek ortaları + yarım alan koşuları), genel olarak kanatları çizgiye indiren takımlar.
- **Ünlü örnek:** Man City 2018/19 Sané/Sterling kalıbı (Analytics FC); maç-dakika kaynaklı **bulunamadı**.
- **Kaynaklar:** https://www.americansocceranalysis.com/home/2021/10/8/where-goals-come-from-playing-the-killer-final-ball ; https://www.americansocceranalysis.com/home/2021/3/11/where-goals-come-from-putting-balls-into-the-box ; https://analyticsfc.co.uk/blog/2021/04/28/developing-new-metrics-cutbacks/ ; https://theanalyst.com/articles/opta-football-stats-definitions ; https://the-cutback.beehiiv.com/p/off-ball-movement-football-tracking-data

### B.14 Erken orta (early cross)
- **Evre:** ilerletme → bitiriş (savunma yerleşmeden).
- **Bağlam ve tetik:** Top kanatta, ceza sahası hizasının 10–25 m gerisinde; rakip savunma geri koşuyor (geçiş) ya da stoperler forvetle 1v1; kaleci ile savunma hattı arasında alan var. Tetik: savunma hattının geri koşarken kaleye dönük olması; forvetin stoperin kör tarafına koşusu.
- **Roller ve hareket:** Orta açan ilk/ikinci dokunuşta; forvet uzak stoperin arkasından yakın direğe ya da stoper–kaleci arasına; uzak kanat uzak direğe; 8 numara penaltı noktasına. Koşular pastan 1–2 sn önce (tahmin).
- **Topun yolu:** havadan, savunma ile kaleci arasına kıvrılan (in-swing) ya da düz sürülen; bazen yerden sert.
- **Zamanlama:** 1–2 sn (karar hızı esas). Bağlılık: açı yoksa topu tut, geç ortaya geç (B.13).
- **Başarı ölçüsü ve sıklık:** Stats Perform "The Art of Crossing": derinden (ceza sahası arkasından) açılan ortalar **~%0,5** gol dönüşümü, daha ileriden açılanlar bunun ~3 katı; en iyi orta türü ~%11,8, en kötü ~%0,2 (erişim 403; arama özetinden). Premier Lig 2024/25 ilk 7 hafta: açık oyun ortası **22,4/maç**, başarı %21,7 (10 sezon ortalaması %19,48). Soccerment (WhoScored): orta başına ~%1,6 gol ≈ 64 orta/gol. ASA: Zone 17'ye orta, ~40 denemede 1 gol. Dünya Kupaları 2002–2014: orta 12 turnuvanın 11'inde en verimsiz gol kaynağı.
- **Panzehir:** savunma hattının geri koşarken derin değil "kaleci-önü" alanını kapatması; kaleciye orta tutma yetkisi; kanat oyuncusunun açıya baskısı (ortayı zorlaştır).
- **Kabiliyet eşiği (tahmin):** Görme 3 (koşuyu erken görme), Karar 3 (bekleme–açma seçimi), Yürütme 4 (hareket halinde kıvrılan orta).
- **Hoca tarzı:** geçiş ve kanat takımları; İngiliz geleneği; Ancelotti'nin kanatlı 4-4-2'si.
- **Ünlü örnek:** kaynaklı maç-dakika **bulunamadı**.
- **Kaynaklar:** https://www.statsperform.com/resource/the-art-of-crossing ; https://www.premierleague.com/en/news/4148090 ; https://soccerment.com/?p=2967 ; https://www.americansocceranalysis.com/home/2021/3/11/where-goals-come-from-putting-balls-into-the-box ; https://researchprofiles.canberra.edu.au/en/publications/a-strategic-analysis-of-goals-scored-in-open-play-in-four-fifa-wo/

### B.15 İçe kesen ters ayaklı kanat (inverted winger)
- **Evre:** son üçte bir; ilerletmede yarım alana taşıma.
- **Bağlam ve tetik:** Sol ayaklı sağ kanat (ya da tersi) topu kanatta alır; rakip bek dış ayağı kapatmıyor ya da yalnız; yarım alan boş (B.11 yalnız bırakma sonrası). Tetik: bekin topa yaklaşması, içe kesiş için çaprazın açılması.
- **Roller ve hareket:** Kanat topu içe, yarım alana sürer; bek dıştan bindirir (dış koridoru boşaltan kanat için doğal eş); 8 numara iç bindirme ya da kutuya geç giriş; forvet yakın direk/stoperi sabitler. Sürüş 10–20 m çapraz (tahmin).
- **Topun yolu:** güçlü ayakla uzak köşeye şut, güçlü ayakla ara pası ("açılı ara pası") ya da içe kıvrılan orta. Spielverlagerung (2015, 20+20 kanat): ters ayaklı kanatlar daha çok güçlü ayakla ve ceza sahası dışından şut atar; orta isabeti ve ortadan anahtar pas iki grupta aynı; klasik kanatlar daha çok orta dener ve **ara pasından 4 kat fazla anahtar pas** üretir (ölçüm etkisi olabilir); yazarın sonucu: "fark felsefe değil, kanadı nasıl kullandığın".
- **Zamanlama:** 2–4 sn. Bağlılık: içe kesiş kapanırsa dışa dönüş (çift ayaklılık) ya da bindirene pas.
- **Başarı ölçüsü:** şut/pas sonucu; kalıp belirginleştikçe "önceden kestirilebilir" (Spielverlagerung'un uyarısı).
- **Panzehir:** bek güçlü ayağı kapatan açıyla durur (içe kesişi dış hatta yönlendirir), önleyici orta saha yarım alanı çifte kapatır, stoper çıkmaz; "önceden kestirilebilirlik" (aynı kaynak).
- **Kabiliyet eşiği (tahmin):** Görme 3, Karar 3, Yürütme 4 (hareket halinde sürüş + güçlü ayak şut/ara pası); çift ayaklılık tahmin edilebilirliği kırar.
- **Hoca tarzı:** 2000'lerden beri yaygın (Pires, Messi, Robben); Bayern Robben–Ribéry; Klopp'un Salah–Mané'si.
- **Ünlü örnek:** Robben'in sağdan içe kesip sol ayakla uzak köşeye şutu "en etkileyici ters kanat" kalıbı (Spielverlagerung; tek maç-dakika kaynaklı **bulunamadı**). Rijkaard'ın Messi'yi sağ kanada alması (Wikipedia).
- **Kaynaklar:** https://spielverlagerung.com/?p=3930 ; https://en.wikipedia.org/wiki/Forward_(association_football)

### B.16 Sahte 9 ve düşen forvet (false 9, dropping striker)
- **Evre:** kurma/ilerletme (hatlar arasına düşüş), son üçte bir (açılan alana kanat koşuları).
- **Bağlam ve tetik:** Rakip stoperler adam takip eğilimli, orta saha hatlar arasını kapatmıyor; takımda derine koşacak hızlı iki kanat var. Tetik: topun kendi 8/6 numarasına yüzü dönük gelmesi; forvet o anda 10–15 m geriye, orta daireye doğru düşer.
- **Roller ve hareket:** Forvet stoperlerin önüne düşer (Messi: "fikir, Madrid stoperlerinin beni takip etmesi ve iki hızlı kanadın arkadan dolanmasıydı"); kanatlar geniş başlayıp stoper–bek arasından derine (Guardiola Henry ve Eto'o'ya "sürekli kanatlardan arkaya koşun" dedi); 8'ler ikinci dalga. Stoperin ikilemi (Wikipedia): takip edersen arkan açılır, takip etmezsen forvet dönüp sürer/pas verir.
- **Topun yolu:** forvete ayağa dikey pas; forvet dönüp ara pası (2009'da Messi'den Henry/Eto'o'ya 12 pasın 6'sı boşluğa, 4'ü ileri çapraz — StatsBomb); ya da bırakış + üçüncü adam.
- **Zamanlama:** düşüş 1–2 sn, ara pası 1 sn, kanat koşusu düşüşle eşzamanlı başlar. Bağlılık: stoper takip etmezse forvet topla döner (B.22'ye geçiş).
- **Başarı ölçüsü ve sıklık:** 2 Mayıs 2009: Messi 2 gol, 1 asist, 7 şut, 3 anahtar pas; şutların çoğu ceza sahası içi merkez. Messi penaltısız gol: 2008/09 20 → 2009/10 33 → 2010/11 27 → 2011/12 40 (rol değişiminin etkisi). Lig genelinde sahte 9 sıklığı **bulunamadı**.
- **Panzehir:** stoperler takip etmez, önleyici orta saha forveti devralır ("teslim"); orta sahayı kalabalıklaştırma (Wikipedia: Mourinho'nun "otobüsü park etmesi" sahte 9'un alanını yok etme); kanat koşularına karşı düşük hat.
- **Kabiliyet eşiği (tahmin):** sahte 9 için Görme 5, Karar 5, Yürütme 4 (dar alanda dönüş, sürüş, ara pası); kanatlar için hız 4 ve koşu zamanlaması 3–4.
- **Hoca tarzı:** Hidegkuti/Macaristan 1953; Spalletti'nin Totti'si (4-6-0); Guardiola–Messi; del Bosque–Fàbregas (Euro 2012); Cruyff okulunun tamamı.
- **Ünlü örnek:** Real Madrid 2–6 Barcelona, 2 Mayıs 2009, Bernabéu: Messi 7. dakikada Eto'o ile yer değiştirip merkeze geçti; Henry 2 gol (ikisi de savunma arkasına ara paslarından), Messi 2 gol; Guardiola rolü maç hazırlığında tasarladı.
- **Kaynaklar:** https://blogarchive.statsbomb.com/articles/soccer/messi-moments-with-alex-delmas-real-madrid-2-6-barcelona-may-2009/ ; https://barcauniversal.com/the-best-of-barca-tactical-analysis-of-the-real-madrid-2-6-barcelona/ ; https://en.wikipedia.org/wiki/Forward_(association_football) ; https://www.antoinebuteau.com/lessons-from-pep-guardiola/

### B.17 Sabitle ve dön (pin and spin)
- **Evre:** ilerletme → son üçte bir (dikey topla).
- **Bağlam ve tetik:** Forvet stoperle sırt sırta, dikey pas geliyor; stoper yapışık. Tetik: pasçının dikey pas için gövdesini açması; stoperin forvete tam temasla gelmesi.
- **Roller ve hareket:** Forvet topu "çağırır", gövdesiyle stoperi **sabitler** (pinning: rakibi akıllı konumlanma ve alan işgaliyle hareketsiz bırakma — FourFourTwo tanımı), topu almadan ya da ilk dokunuşla stoperin temas ettiği tarafın tersine **döner** ve arkaya koşar; pas ya ayağına gelip dönüşle sürülür ya da dönüşün önüne arkaya oynanır. Antrenman ipuçları: "savunmacıyı yasal şekilde tut, sırtın kaleye dönük güçlü kal, dönüşü gizle, düz mü yan mı duracağına karar ver."
- **Topun yolu:** yerden sert dikey; dönüş için ayağa ya da hemen arkaya; 1–2 dokunuş.
- **Zamanlama:** 1–2 sn. Bağlılık: dönüş kapanırsa bırakış (B.3).
- **Başarı ölçüsü:** stoperi geçmiş halde yüzü kaleye dönük alış. Oran **bulunamadı**.
- **Panzehir:** stoper tam temas yerine yarım adım geride durur ("top ile adam arasında kal"), dönüş tarafını kapatır; ikinci stoper örtme; faul riski için hakem yorumu (bugünün kuralları: kol kullanımı faul).
- **Kabiliyet eşiği (tahmin):** Görme 2–3, Karar 3 (dönüş zamanlaması), Yürütme 4 (güç + dönüş tekniği).
- **Hoca tarzı:** fiziksel santrfor okulu (Lukaku, Haaland, Zlatan örnekleri antrenman notlarında).
- **Ünlü örnek:** antrenman kaynağı Lukaku'nun Carragher'a karşı "pin" videosuna gönderir (maç-dakika yok).
- **Kaynaklar:** https://www.fourfourtwo.com/features/pinning-football-tactics-explained (arama özeti; metin üye duvarı) ; https://www.sportsessionplanner.com/s/9Fjlb/Pin-and-Spin-to-finish.html

### B.18 Kanatta 2v1 kurma (creating a 2v1 wide)
- **Evre:** ilerletme → son üçte bir.
- **Bağlam ve tetik:** Rakip bek yalnız (kanat orta sahası geride kalmış ya da içe kaymış). Tetik: topun kanat oyuncusuna gelmesiyle bekin/8'in koşuya başlaması; bekin ikilemi (topa mı koşucuya mı).
- **Roller ve hareket:** Üç kalıp: (a) bindirme (B.4), (b) iç bindirme (B.5), (c) kanat + forvetin dışa açılması (pulling wide; SkillCorner tipi). Top taşıyan rakip beki **kendine çekip** (1–2 m yaklaşmasını bekleyip) sonra pas verir; erken pas 2v1'i boşa çıkarır. Koşucu top taşıyanın 5–8 m yanında, hafif geride başlar; koşu 1,5–2,5 sn önce (tahmin).
- **Topun yolu:** yerden pas koşucunun önüne; ya da sürüşle beki geçme (koşucu aldatma).
- **Zamanlama:** 2–4 sn. Bağlılık: bek koşucuya kayarsa içe sürüş; topa kalırsa pas.
- **Başarı ölçüsü ve sıklık:** 2v1 ulaşma sayısı; Opta "top sahibi yığılma" süresi (%5,1 Tottenham lig birincisi) ölçü olabilir. FIFA Training Centre "Creating and exploiting overloads" belgesi birincil antrenör kaynağı (PDF metni çıkarılamadı → içerik aktarılmadı).
- **Panzehir:** kanat orta sahasının geri koşması (2v2), bekin "topu geciktir" duruşu (koşucuyu stoper devralır), uzak tarafın daralması.
- **Kabiliyet eşiği (tahmin):** Görme 2–3, Karar 3 (bekleme/pas anı), Yürütme 3.
- **Hoca tarzı:** her ekol; kanat ağırlıklı 4-3-3 ve 3-5-2 (kanat bek + kanat).
- **Ünlü örnek:** kaynaklı maç-dakika **bulunamadı**.
- **Kaynaklar:** https://www.fifatrainingcentre.com/media/native/test/Creating%20and%20exploiting%20overloads.pdf ; https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league ; https://skillcorner.com/blog/game-intelligence-off-ball-run-types

### B.19 Üçgen ve eşkenar dörtgen mesafeleri (triangles, diamonds; 8–15 m)
- **Evre:** kurma, ilerletme — yapı ilkesi.
- **Bağlam:** Top sahibi oyuncunun her an en az iki, tercihen üç pas seçeneği olmalı (Spielverlagerung: "üçgenler, tercihen eşkenar dörtgenler"; Guardiola: "her oyuncu için en az iki pas hattı"). Oyuncular farklı yüksekliklerde, **asla aynı pas hattında değil**; tam genişlik kullanılır.
- **Mesafeler:** Cruyff'un Barcelona için sözü "10 m'den uzun pas atmazlardı" (Spielverlagerung'daki alıntı). Motor için **tahmin**: baskı altında 6–10 m, baskısız kurmada 12–18 m, rakip bloğun hat aralığı ~10 m (Spielverlagerung örneği) olduğundan hatlar arası alıcı 5 m'lik ara bantta durur. Çok yakın (<5 m) duruş tek savunmacının iki oyuncuyu kapatmasına, çok uzak (>20 m) pasın havada kesilmesine yol açar (antrenörlük bilgisi; sayısal kaynak **bulunamadı**).
- **Roller ve hareket:** Top hareket ettikçe üçgen yeniden kurulur ("topa göre kurallar": Guardiola); alıcı pas hattını rakibin **örtme gölgesi** dışına çıkararak açar (Spielverlagerung).
- **Topun yolu:** yerden kısa/orta; tek-iki dokunuş.
- **Zamanlama:** sürekli; pas sonrası 1 sn içinde yeni açı (toco y me voy).
- **Başarı ölçüsü:** top sahibinin ≥2 açık pas hattı olan kare payı; pas uzunluğu dağılımı. Lig sayıları **bulunamadı** (Diniz'in Fluminense'si çok kısa ortalama pas mesafesiyle anılır — tiempoar, sayı vermiyor).
- **Panzehir:** örtme gölgesiyle pres (bir oyuncu iki hattı kapatır), tetikli pres (geri pas, kötü kontrol), adam markajı.
- **Kabiliyet eşiği (tahmin):** Görme 3 (sürekli tarama), Karar 2, Yürütme 2–3.
- **Hoca tarzı:** konumsal oyun (sabit üçgen yapısı), ilişkisel oyun (topun çevresinde akışkan üçgenler), rondo kültürü.
- **Ünlü örnek:** Barcelona 2008–12 (Spielverlagerung'un analizi).
- **Kaynaklar:** https://spielverlagerung.com/2014/12/25/juego-de-posicion-under-pep-guardiola/ ; https://m.allfootballapp.com/news/Serie-A/Third-man-runs-football-tactics-explained--how-coaches-like-Guardiola-use-it/2749753 ; https://www.sportsessionplanner.com/s/Cggli/Creating-third-man-run-opportunities-and-numerical-advantage.html ; https://www.tiempoar.com.ar/ta_article/potrero-calle-y-juego-relacional-una-alternativa-en-el-futbol-tardomoderno/amp/

### B.20 Yarım dönüşle alış ve açık beden (receiving on the half-turn, open body shape)
- **Evre:** kurma, ilerletme (hatlar arası alış).
- **Bağlam ve tetik:** Alıcı hatlar arasında, markajcı 2–4 m geride; pas kendi 6/stoperinden geliyor. Tetik: pasın çıkışından **önce** omuz üstünden tarama (son bakış pas çıkarken).
- **Roller ve hareket:** Alıcı gövdesini sahaya açar (kaleye yarı dönük, yaklaşık 45°), topu uzak ayakla alıp ilk dokunuşla ileriye/çapraza yönlendirir; markajcı yakınsa tek dokunuş geri bırakış (B.3), uzaksa dönüp sür (B.22). Lillo'nun kuralı: üçüncü adamın "dönüp oyuna yüzünü dönebilmesi" amaçtır.
- **Topun yolu:** yerden, alıcının uzak ayağına (açık tarafa); ilk dokunuş 1–2 m ileri.
- **Zamanlama:** tarama pas çıkmadan 0,5–1 sn önce; alış + dönüş 0,8–1,5 sn (tahmin).
- **Başarı ölçüsü:** alıştan sonra yüzü kaleye dönük ve ilk dokunuşu ileri olan alış payı. Lig sayısı **bulunamadı**. Opta: baskı altında pas isabeti (2 m içinde rakip) Curtis Jones %92,8 — "baskı altında" ölçüsünün tanımı motor için kullanılabilir.
- **Panzehir:** markajcı alış anında sırttan temas ("dönme izni verme"), pas hattına önleyici orta saha, alıcının açık tarafını kapatan açı.
- **Kabiliyet eşiği (tahmin):** Görme 4 (tarama sıklığı), Karar 3, Yürütme 3 (uzak ayakla yönlü ilk dokunuş).
- **Hoca tarzı:** Cruyff/Guardiola okulu, bütün modern akademi müfredatları.
- **Ünlü örnek:** Xavi/Iniesta'nın hatlar arası alışları (genel; maç-dakika kaynaklı **bulunamadı**).
- **Kaynaklar:** https://spielverlagerung.com/2014/12/25/juego-de-posicion-under-pep-guardiola/ ; https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league

### B.21 Tempo değişimi — yavaşlat-hızlan (tempo change, la pausa)
- **Evre:** ilerletme, son üçte bir girişi.
- **Bağlam ve tetik:** Top hatlar arasında, taşıyanın 2–3 m alanı var, koşucular henüz hazır değil ya da savunmacı kararsız. Tetik: savunmacının "çıkayım mı kalayım mı" tereddüdü; koşucunun başlaması.
- **Roller ve hareket:** Taşıyan yürüme hızına düşer ya da "hiçbir şey yapmıyormuş" gibi durur, savunmacıyı topa çeker; savunmacı adım atınca pas/hızlanma onun bıraktığı yöne. Göz aldatması (bir yana bak, öbür yana oyna) markajcıları yanlış hedefe çeker. "La pelopina" (360° dönüş) baskı altında varyant. Ne değildir: fazladan dokunuş ya da genel yavaş oyun; "doğru anı bekleme"dir. Kendi yarı sahasında "neredeyse hiç" yapılmaz; hatlar arasında yapılır.
- **Topun yolu:** bekleme sonrası tek sert pas ya da ani sürüş.
- **Zamanlama:** PAUSA makalesi: 1 sn'lik gecikme örnek pozisyonda değeri 0,523 → 0,690'a çıkardı; başka pozisyonda 2,12 sn **erken** pas daha iyiydi — bekleme kendiliğinden iyi değildir. Oyuncu düzeyinde PAUSA ile oyun hızı r=−0,286; takım düzeyinde PAUSA ile puan/maç r=0,733.
- **Başarı ölçüsü:** pas anındaki alıcı açıklığı ↔ 1 sn önce/sonra (karşı-olgusal); şans yaratma farkı.
- **Panzehir:** pres tetiğini tutarlı uygulama (bekleyene hemen çıkma ya da hiç çıkmama — ara durum yok), koşucuların markajını topa bakmadan sürdürme.
- **Kabiliyet eşiği (tahmin):** Görme 5 (bekleme sırasında tarama), Karar 5, Yürütme 3 (top koruma).
- **Hoca tarzı:** İspanyol/Arjantin okulu (Bochini kökeni iddiası, Xavi, Busquets, Silva, Modrić); konumsal oyunun ritim aracı; ilişkisel oyunda "pausa" (Diniz'in yavaş-kısa pas örgüsü).
- **Ünlü örnek:** Xavi'nin Pedro'ya pası — Pedro Vidić'ten uzaklaşana kadar beklemesi, Villa ve Messi markajsız (themastermindsite; maç adı kaynakta yok, ayrıntılar 2011 Wembley finaliyle örtüşür — doğrulanmadı).
- **Kaynaklar:** https://themastermindsite.com/2019/09/22/la-pausa-tactical-analysis ; https://thexgfootballclub.substack.com/p/what-makes-a-pass-well-timed

### B.22 Top sürerek rakip çekme (drive to commit, carrying to engage)
- **Evre:** kurma → ilerletme (stoper/6'nın sürüşü), ilerletme → son üçte bir (8/kanat).
- **Bağlam ve tetik:** Top taşıyanın önünde 8–15 m boş alan, en yakın rakip bir arkadaşı markajlıyor. Tetik: ilk pres hattının geçilmesi; önündeki rakibin "topa mı adama mı" kararsızlığı.
- **Roller ve hareket:** Taşıyan topu **rakibe doğru** sürer (yana değil), rakip çıkmak zorunda kalınca onun bıraktığı oyuncuya pas; Coaches' Voice üçüncü adam tanımı bununla başlar: "önce bir oyuncu topla ileri giderek bir rakibi yerinden çıkarmalı." Sürüş hızı orta (rakip tepki verebilsin), son 2–3 m'de karar.
- **Topun yolu:** 5–20 m sürüş (Opta "ilerletici taşıma": topu ≥5 m ileri taşıyan sürüş), sonra yerden pas serbest kalan adama.
- **Zamanlama:** 2–4 sn. Bağlılık: rakip çıkmazsa sürüşe devam (şut mesafesine kadar); çıkarsa pas.
- **Başarı ölçüsü ve sıklık:** "rakip çekme" ölçümü (sürüş sırasında bir savunmacının markajını bırakıp top taşıyana ≥x m yaklaşması) için yayımlanmış lig sayısı **bulunamadı**; ASA'da taşıma öncesi xG ile şut xG farkı toplamda ~0,01 (taşımaların şut kalitesine katkısı küçük — yani değer pas sonrası doğar).
- **Panzehir:** "çıkma, geciktir" disiplini (savunmacı markajını bırakmaz, taşıyanı bir sonraki hat karşılar); hattan çıkan yerine arkadan dolduran örtme; taşıyana erken faul (bugünün kurallarında taktik faul sarı kart).
- **Kabiliyet eşiği (tahmin):** Görme 4 (sürerken başı kaldırma), Karar 4 (bırakma anı), Yürütme 3 (hız altında kontrol).
- **Hoca tarzı:** top süren stoper/6 kullanan takımlar (Cruyff/Guardiola okulu, modern "ilerletici taşıma" verisiyle değerlenen bekler).
- **Ünlü örnek:** 1970 finali 86', golün başlangıcı: Clodoaldo kendi yarı sahasında dört İtalyan'ı sürüşle geçti, sonra Rivellino'ya pas (Wikipedia).
- **Kaynaklar:** https://m.allfootballapp.com/news/Serie-A/Third-man-runs-football-tactics-explained--how-coaches-like-Guardiola-use-it/2749753 ; https://theanalyst.com/articles/opta-football-stats-definitions ; https://www.americansocceranalysis.com/home/2021/10/8/where-goals-come-from-playing-the-killer-final-ball ; https://en.wikipedia.org/wiki/1970_FIFA_World_Cup_final

### B.23 Kanat değişimi (wing swap; wingers switching flanks)
- **Evre:** ilerletme; genelde top kendi takımındayken, duran top ya da duruş sonrası.
- **Bağlam ve tetik:** Ters ayaklı iki kanat; bir bek kanada karşı zorlanıyor ya da yorgun; rakip bekin ayak/hız profili. Tetik: hoca işareti, duran top sonrası ya da kanat oyuncusunun kendi okuması (3–5 dk'lık bloklar — tahmin).
- **Roller ve hareket:** Kanatlar yer değiştirir; bu, (a) rakip bekin alışık olmadığı içe/dışa kesiş yönünü değiştirir, (b) kanadı "yalnız bırak" için yorgun bekin karşısına koyar. Spielverlagerung'un ters kanat uyarısı: "klasik ve ters rol arasında dönüşümlü oynamak" öngörülebilirliği kırar.
- **Topun yolu:** değişimin kendisi topsuz; sonraki ilkeller (B.15, B.4, B.10) uygulanır.
- **Zamanlama:** değişim 5–10 sn'de tamamlanır (top uzak taraftayken). Bağlılık: etkisizse geri dönüş.
- **Başarı ölçüsü:** değişim sonrası 1v1 kazanma/orta/şut farkı; lig verisi **bulunamadı**.
- **Panzehir:** beklerin iki yönlü (iç/dış) kapatma eğitimi; savunma kanatlarının da yer değiştirmesi (eşleşmeyi koruma — Spielverlagerung'un genel "adam-odaklı kaydırma" mantığı).
- **Kabiliyet eşiği (tahmin):** kanat için çift yönlü yetkinlik (Yürütme 4 çift ayak), takım için ortak niyet.
- **Hoca tarzı:** Bayern Robben–Ribéry (Wikipedia zıt kanatlarda eşleştiklerini söyler); Klopp, Guardiola.
- **Ünlü örnek:** kaynaklı maç-dakika **bulunamadı**.
- **Kaynaklar:** https://spielverlagerung.com/?p=3930 ; https://en.wikipedia.org/wiki/Forward_(association_football)

### B.24 Kutuya giriş düzeni ve orta için koşular (box-entry runs, cross receiver)
- **Evre:** son üçte bir → bitiriş.
- **Bağlam ve tetik:** Top kanatta/yarım alanda orta ya da geri çevirme pozisyonunda. Tetik: top taşıyanın başını kaldırması; orta için ayak hazırlığı.
- **Roller ve hareket:** Standart dört hedef: yakın direk (savunmacıyı çeker; sürat), penaltı noktası (çoğu kez geç gelen 8/forvet), uzak direk (uzak kanat), ceza sahası yayı (ikinci top/geri çevirme). Koşular çaprazlanır (yakın direğe koşan uzak direkten gelir — markaj devri zorlaşır). Pas başına ortalama 3,3 koşucu (Gradient). Santrfor koşularının %23'ü "cross receiver" (SkillCorner). Koşu pastan 1–2 sn önce başlar, son 1 sn'de yön değişimi (tahmin + çift hareket).
- **Topun yolu:** B.13 geri çevirme (en verimli), B.14 erken orta, yerden sert orta; alıcı tek dokunuş.
- **Zamanlama:** 2–3 sn. Bağlılık: orta gelmezse yeniden konumlanma 2 sn.
- **Başarı ölçüsü ve sıklık:** Zone 17'ye 100 pasta gol: ara pası 13,2 / geri çevirme 6,4 / ilerletici 4,5 / orta ~2,5. Arama özetine göre SkillCorner'da servis edilen cross-receiver koşuları arkaya koşuların ~2 katı gol üretmiş ve "100 servis edilen koşu başına gol" ölçüsü kullanılmış (sayfa metninde doğrulanamadı → **doğrulanmadı**).
- **Panzehir:** bölge + adam karışık kutu savunması; penaltı noktasını kapatan önleyici orta saha; kalecinin orta hâkimiyeti; ikinci direk savunmasının "top ve adam" duruşu.
- **Kabiliyet eşiği (tahmin):** Görme 3, Karar 3–4 (zamanlama/aldatma), Yürütme 3–4 (kafa/gelişine).
- **Hoca tarzı:** her ekol; orta ağırlıklı takımlarda kutuya 4–5 oyuncu, konumsal takımlarda 3 + yay.
- **Ünlü örnek:** kaynaklı maç-dakika **bulunamadı**.
- **Kaynaklar:** https://the-cutback.beehiiv.com/p/off-ball-movement-football-tracking-data ; https://skillcorner.com/blog/forward-off-ball-runs ; https://www.americansocceranalysis.com/home/2021/3/11/where-goals-come-from-putting-balls-into-the-box ; https://landing.skillcorner.com/articles/game-intelligence-analysing-off-ball-runs

---

## B.25 Tarz olarak konumsal oyun (positional play, juego de posición)

**Tanım ve kurallar (Spielverlagerung'un Guardiola analizi):** temel ilke "her baskı hattının arkasında üstünlük üretmek". Üç (Lillo'da dört/beş) üstünlük türü:
- **Sayısal (numerical):** belirli alanda rakipten çok oyuncu → serbest adam. Guardiola: "üç adam gönderirlerse dörtle kurarız", "her zaman markajsız oyuncuyu bulmalısın."
- **Konumsal (positional):** farklı yükseklik ve derinliklerde kademeli dizilişle, sayıca az olsa da iyi konumla serbest adam; hatlar arası, örtme gölgesi dışı.
- **Nitel (qualitative):** en iyi oyuncunu zayıf rakibe karşı 1v1'e getirmek (yığ ve yalnız bırak).
- **Dinamik (dynamic) ve sosyo-duygusal (socio-affective)** (Lillo/Seirul·lo kaynaklı sınıflama; Coaches' Voice Lillo yazısı sosyo-duygusalı "birbirini neredeyse bakmadan bulan oyuncular" diye verir): hareketle (üçüncü adam, zamanlama) ve ortak hafızayla üretilen üstünlük.

**Yapı kuralları:** beş koridor; aynı yatayda ≤3, aynı dikeyde ≤2 oyuncu (tavsiye); kanatlar açık ("içeriyi açmak için"); "herkes kutuya girebilir, kimse kutuda duramaz" (Tola Coaching aktarımı); üçgen/eşkenar dörtgen, her oyuncuya ≥2 pas hattı; "amaç topu değil rakibi hareket ettirmek"; top tarafını yığ, uzak tarafı az bırak, çevir; top kaybında hemen karşı pres.

**"15 pas" kuralı:** Perarnau'nun *Pep Confidential* kitabından aktarılan söz: "önce 15 paslık bir dizi yoksa savunma ile hücum arasındaki geçişi düzgün yapmak imkânsızdır." Okuması: 15 pas, hücum yapısının (mesafeler, karşı pres için konumlar) oturması için gereken süredir; sayı sihirli değil, yapının göstergesidir. Birincil kaynak kitap; çevrimiçi aktarımlar ikinci el.

**İlkel ağırlıkları (motor için önerilen):** B.19 üçgen mesafeleri ve B.12 beş koridor yapı olarak sabit; B.1 üçüncü adam, B.20 yarım dönüş, B.10 çevirme, B.11 yığ-yalnız bırak, B.13 geri çevirme ve B.16 sahte 9 yüksek; B.14 erken orta düşük; koşu türlerinde "coming short/drop off" payı yüksek (CIES: Man City %29,6, PSG %28,5 — kısa/geri koşu payı lig üstü).

**Ünlü örnekler:** Barcelona 2008–12; Bayern 2013–16; Man City 2016–. (Maç-dakika için B.16'daki 2 Mayıs 2009.)

- Kaynaklar: https://spielverlagerung.com/2014/12/25/juego-de-posicion-under-pep-guardiola/ ; https://learning.coachesvoice.com/cv/juanma-lillo-pep-guardiola-manchester-city/ ; https://www.antoinebuteau.com/lessons-from-pep-guardiola/ ; https://ofpitchandpage.com/2014/11/25/pep-confidential/ ; https://football-observatory.com/IMG/sites/b5wp/2023/wp433/en/

## B.26 Tarz olarak ilişkisel oyun (relationism; Dinizismo; "toco y me voy")

**Tanım:** Jamie Hamilton'ın Diniz'in futbolu için türettiği ad: "alan işgalinden çok birlikte oynamayı değerli bulduğu için 'relacionismo'" (ESPN Deportes). "Bütün olası konumlar ilişkilerin doğrudan sonucudur" — konumsalcılıkta ilişkiler sabit konumlardan doğar, ilişkiselcilikte konumlar ilişkilerden (Extra Time Talk özeti). Arjantin'de "juego relacional / aposicional / funcional" (tiempoar: "işlevi ilişkiyle bağlamaya çalışır"; Scaloni: "merkez toptur, topa göre hareket ederler").

**İlkeleri (kaynaklarda geçen adlarla):**
- **Yakınlaşma (aproximação/approximation):** öncelik alan kaplamak değil, topun yanında olabildiğince çok oyuncu (ESPN); 6–7 oyuncu 20 m'lik şeritte toplanabilir (The Market for Ideas, risk olarak), sahanın diğer yarısı boş kalır.
- **Toco y me voy ("oynar giderim"):** pası verir vermez hareket; İngilizcede "pass and move". Arjantin futbol dilinde 1965'te bile "toco y me quedo" (oynar kalırım) eleştirisiyle karşıt kavram (El Gráfico).
- **Tabela:** duvar pası (B.2); sokak futbolu kökenli.
- **Escadinha ("merdiven"):** ileriye dikey-yatay pas zincirleri, kademeli diziliş; rugby'den ödünç "kademeli" duruş pas atılınca alan açar (Market for Ideas).
- **Yana yatma (tilting):** kanatlar ters kanada kayar, bir tarafta sayısal üstünlük; şekil "tahmin edilemez" biçimde değişir; durmak yasaktır (ESPN).
- **Corta-luz (ışığı kesme, dummy/let it run):** Hamilton'ın yazısında geçtiği aktarılır; eriştiğim kaynaklarda açıklaması **bulunamadı**.
- **Serbest roller:** sabit 4-2-3-1/4-3-3 başlangıcı, sonra "organize kaos"; klasik 10 numaranın (Ganso) geri dönüşü; futsal etkisi (dar alanda sayısal üstünlük, kısa pas ve dribling); top kaybında karşı pres (The Blizzard).

**Konumsal oyunla farkı:** konumsalda oyuncu alanı işgal eder, top ona gelir; ilişkiselde oyuncular topa yaklaşır, alan hareketle doğar. Konumsalcılar boş bırakılan yarı sahayı "neredeyse sapkınlık" sayar (ESPN). Motor için: ilişkisel tarzda B.2 duvar pası, B.1 üçüncü adam, B.21 pausa, B.22 sürerek çekme ve B.10 çevirme (yığılmanın karşıtı olarak ani uzun top) yüksek; B.12/B.19 mesafe kuralları gevşek (5–8 m yakınlık); koşu türlerinde "support/coming short" çok yüksek, "pulling wide" düşük.

**Takımlar:** Fluminense (Diniz) — 4 Kasım 2023 Maracanã, Libertadores finali Boca 1–2 Fluminense (uzatmada John Kennedy); Malmö (Rydström), Bologna (Motta), NEC, Racing Santander (Market for Ideas listesi). Brezilya millî takımında kısa dönem başarısız (Kasım 2023 üç yenilgi, Ocak 2024 görevden alma — The Blizzard).

- Kaynaklar: https://espndeportes.espn.com/futbol/copa-libertadores/nota/_/id/12779404/fluminense-el-equipo-invertebrado-que-disputa-la-hegemonia-tactica-europea ; https://theblizzard.co.uk/the-nostalgia-principle/featured/ ; https://www.themarketforideas.com/when-chaos-becomes-a-playing-system-is-a-new-football-unorder-smiling-around-the-corner-a1135/ ; https://www.tiempoar.com.ar/ta_article/potrero-calle-y-juego-relacional-una-alternativa-en-el-futbol-tardomoderno/amp/ ; https://www.elgrafico.com.ar/articulo/1088/33820/1965-toco-y-me-quedo ; https://medium.com/@stirlingj1982/what-is-relationism-c98d6233d9c2 (erişim 403) ; https://extratimetalk.com/what-is-wrong-with-brazils-national-team/

---

## Motor için notlar

Amaç: yukarıdaki ilkelleri ezber senaryo olarak değil, **algı × ortak niyet × bağlılık × işaret × zamanlama** bileşenleriyle üretmek. Mevcut motorla (`js/mac-karar.js` niyet/kip, `niyetAdim`, `kapat*` görev kalıcılığı, `bakis*` tarama, `kosuSil`, `gecGirisAta`, `markajAta`) örtüşen kavramlar işaretlendi.

1. **Algı (perception):** her oyuncunun kendi görüş alanı (Spielverlagerung: ~180–200° yatay; göz hareketiyle ~270°) ve tarama anları vardır (`bakis*`, `tarama*`). Kör taraf (B.6) ancak savunmacının bakış yönü modellenirse var olur: savunmacı topa dönükken gövdesinin arkasındaki 120°'lik dilim "görünmez"; oradaki koşu geç fark edilir (tepki gecikmesi 0,3–0,6 sn — tahmin). Yarım dönüş alışı (B.20) için alıcının pas çıkmadan 0,5–1 sn önce omuz üstü tarama yapmış olması "dönebilir" bayrağını verir; yapmamışsa bırakış zorunlu.
2. **Ortak niyet (shared intention / joint plan):** ilkellerin çoğu 2–3 oyunculuk küçük planlardır. Önerilen temsil: `Plan{tur, roller:{A,B,C}, tetik, t0, bağlılık, iptal koşulu}`. Plan top taşıyanın değil **ilk hareket edenin** (çoğu kez koşucunun) teklifiyle açılır; top taşıyan kabul ederse pas, etmezse plan "aldatma" olarak değer üretir (B.8: nedensel koşu %12,9, şans +4,4 puan). Aynı anda en çok 2 plan (yakın ve uzak kanat) açık olur; aynı koridora ikinci koşu konumsal kurallarla (dikeyde ≤2) bastırılır.
3. **Bağlılık (commitment):** her planın süresi vardır (B.0.2: koşu ≥0,7 sn; tipik plan 2–4 sn; yığ-yalnız bırak 8–15 sn). Bağlılık süresince roller görev değiştirmez (mevcut `kapatKalici`/`kovalaKalici` kalıbı hücuma aktarılır: yüksek eforlu görev değişimi ≤15/oyuncu·dk ölçüsü aynı kalır). İptal koşulları: top kaybı (`kosuSil` zaten var), tetikleyen oyuncunun topu başka yöne oynaması, ofsayt riski (>0,5 m önde).
4. **İşaret (cue):** planın "git" anı pasçının gözlemlenebilir durumundan türetilir: ilk dokunuş, gövde açısı, başın kalkması, açık hat (footballgpt listesi). Motor için en ucuz işaret: pasçının `kontrolEt` bitişi + yüzünün hedefe dönük olması. Koşucu işaretten sonra 0,2–0,4 sn tepkiyle başlar (tahmin). Kodlanmış işaretler (B.7: "bir koniye hareket = arkaya, diğerine = ayağa") takım kimyasıyla (sosyo-duygusal üstünlük) açılır: aynı kulüpte geçen sezon sayısı plan başarısını ölçekler (SkillCorner: bağlantı koşuları aynı kulüpte r=0,75, transferde 0,48).
5. **Zamanlama (timing):** her plan için `koşu_başı − pas_çıkışı` hedef penceresi: arkaya koşu 0,5–1,5 sn, bindirme 1,5–3 sn, kısaya gelme 0,5–1 sn, kutuya giriş 1–2 sn (hepsi tahmin; 3 sn'lik gözlem penceresi veriyle uyumlu). Pasçı tarafında "pausa" (B.21): pas kararı her karede değil, alıcının açıklığı ileriye 1 sn öngörülerek verilir (PAUSA'nın 1 sn ileri penceresi); açıklık artıyorsa bekle, azalıyorsa oyna. Mevcut `tutEtki`/`niyetDeger` bu karşı-olgusal karşılaştırmaya bağlanabilir.
6. **Alan değeri (space value):** pas ve sürüş seçeneklerinin önceliği xT ızgarasıyla (B.0.3 tablosu; 8×12 açık veri) başlatılır; geri çevirme ve ara pasına tür bonusu (ASA: 100 denemede 6,4 ve 13,2 gol ↔ orta ~2,5). Yarım alan değeri xT'de merkez ile kanat arasında (0,055 ↔ 0,108/0,035); "bakışı kaleden çevirmeme" avantajı algı modelinde kendiliğinden doğar (yarım alandaki oyuncunun görüş alanına hem merkez hem kanat girer).
7. **Rol ve kabiliyet ölçeği:** her ilkelin Görme/Karar/Yürütme eşikleri (1–5 tahmin) `mac-profil.js` kapısından okunur. Eşik altı oyuncu ilkeli "denemez" değil, **geç/yanlış zamanlar** (koşu 0,5 sn geç → ofsayt ya da kapanmış hat; pas erken → 2v1 boşa). Hoca tarzı, plan tiplerinin önsel ağırlıklarını ve bağlılık süresini (konumsal: uzun, 15 pas sabrı; ilişkisel: kısa, yakın mesafe) ayarlar.
8. **Savunma karşı modeli:** her ilkel için panzehir savunmanın okuma yetisiyle ölçeklenir: koşuyu "görüp" devretme (markaj devri gecikmesi), çıkma/geciktirme kararı (B.22), hat disiplini (B.9). Bu, savunma tarafında ayrı bir "görme/karar" profilidir; mevcut `markajAta`/`kutuSavunmaAta` ve `kapiFaz*` eşikleriyle örtüşür.
9. **VAR ve ofsayt:** bugünün kuralları: yarı otomatik ofsaytla koşunun başlangıç konumu kritik; kavisli koşu (B.9) motorda "hat hizasında başla, pas çıkınca derine kır" olarak kodlanır; ofsayt payı kabiliyetle daralır (Karar 5: ±0,3 m; Karar 2: ±1 m — tahmin).
10. **Üretilmeyecekler:** ezber "kombinasyon kütüphanesi" (sabit pas dizileri) yok; ilkeller küçük planlardır ve sahadaki bağlamdan tetiklenir. Örnek sayıları kota değildir.

## Ölçüler (simüle maçta ilkelin görünmesi ve başarısı)

Mevcut ölçüm altyapısına (`araclar/olcumler/a-akis.js`, `w-yuruyus.js`, `h-hareket.js`, `MAC_DENEME_IVME=1` görev tablosu) eklenecek sayaçlar; hedefler gerçek veriden, "tahmin" olanlar kalibrasyon başlangıcı.

| Ölçü | Tanım (motorda) | Gerçek referans | Hedef |
|---|---|---|---|
| Koşu sayısı/tür | >15 km/sa ve ≥0,7 sn koşular; tür: in behind / cross receiver / run ahead / coming short / drop off / overlap / underlap / support / pulling wide / half-space | SkillCorner eşiği; santrfor payları %32/%23/%22/%8 | Santrfor dağılımı ±8 puan |
| Kısa/geri koşu payı | drop off + coming short ÷ toplam | Üst kulüpler %25–31; PSG 7,13/maç | Tarza göre %15–30 |
| Bindirme/iç bindirme | Gradient geometrisi (top taşıyanı dışından/içinden geçiş) | Man City ~2 bindirme/maç; Newcastle ~7; Spurs ~7 iç bindirme/maç (259/38) | Takım başına 2–7/maç |
| Koşucu/pas (kutuya) | Kutuya pas anında 3 sn penceresinde koşan hücumcu sayısı | 3,3 (mod 3–4) | 2,5–4 |
| Nedensel koşu payı | Koşu bitiminde örten savunmacı alıcıdan ≥1 m uzaklaşmış | %12,9; sonrası şans %19,2 ↔ %14,8 | %8–18; fark ≥ +3 puan |
| Koşu–pas zamanlaması | Koşu başı − pas çıkışı (sn), tür başına dağılım | Veri yok (3 sn penceresi) | Tahmin bantları; ofsayt oranıyla birlikte izlenir |
| Üçüncü adam | A→B→C dizisi: B'nin ≤2 dokunuşu, C'nin B'nin alışından ≤1,5 sn önce başlayan koşusu, C alımı A'nın pasından ≤3 sn sonra | Lig sayısı yok | Maç başına ≥3 deneme (tahmin), başarılı (C yüzü dönük alır) ≥%40 (tahmin) |
| Duvar pası | A pas → A koşu → B ≤1 dokunuş → A alır, 2 sn içinde; rakip eleme | Yok | Tarza göre 3–10/maç (tahmin) |
| Geri çevirme | Opta pull-back: kutu içinde kale çizgisine yakın geri pas | 1,56/maç, %32 tamamlanma, tamamlananların %25'i şut; Golden Zone dönüşüm %25 | 1–2/maç, tamamlanma %25–40, şut payı %20–30 |
| Zone 17'ye pas türü verimi | 100 pasta gol: ara pası / geri çevirme / ilerletici / orta | 13,2 / 6,4 / 4,5 / ~2,5 | Sıralama korunur; ±%40 |
| Orta | Açık oyun ortası sayısı ve isabet | 22,4/maç, %21,7 (PL 2024/25); %19,5 on yıl | 15–30/maç, %17–25 |
| Çevirme | Sahanın ≥yarısı genişliğinde kanat→kanat pas | Sayı yok | Takım başına 4–12/maç (tahmin); tamamlanma %60–80 (tahmin) |
| Yığılma süresi | İlerletme süresinin top çevresinde sayısal üstünlükle geçen payı | Spurs %5,1 (lig en yüksek) | %2–6 |
| Yarım alan girişi | Son üçte birde yarım alan hücresine alış sayısı; sonrası 5 sn'de şut payı | xT 0,055/0,064 hücreleri | Merkez < yarım alan < kanat giriş sıklığı; şut payı merkez > yarım alan > kanat |
| Bölge 14 kullanımı | Bölge 14 pozisyonu/maç ve şuta dönüşüm | ~23/maç; %43 (başarılı) ↔ %29 | 15–30/maç, %30–45 |
| Sahte 9 düşüşü | Forvetin top kendi 6/8'indeyken stoper hattından ≥10 m geriye düşmesi ve stoperin ≥5 m takibi | 2009 örneği; lig sayısı yok | Tarz bayrağıyla açılır; takip oranı savunma profiline bağlı |
| Pausa | Pas anındaki alıcı açıklığı ↔ 1 sn önce/sonra | PAUSA: takım r=0,733 puanla | Doğru zamanlanmış pas payı Karar puanıyla artar |
| Ters kanat şutu | Ters ayaklı kanadın güçlü ayakla ceza sahası dışı şutu | Spielverlagerung 2015 (yön) | Ters kanatlarda güçlü ayak şut payı > klasik kanat |
| Görev değişimi | Hücum planı içinde rol değişimi | `MAC_DENEME_IVME=1` ≤15/oyuncu·dk | Aynı eşik |
| Ofsayt | Derine koşu başına ofsayt | Lig ortalaması ~2/maç (genel bilgi; kaynak eklenmedi) | 1–3/maç |

Ölçüm notları: koşu türleri tek sınıflamaya (Gradient hiyerarşisi + nitelikler) oturtulur ki `mac-deneme.js` satırları SkillCorner/Opta sayılarıyla karşılaştırılabilsin; "tahmin" hedefleri ilk 80 maçlık ölçümden sonra bu belgede güncellenir (denge kararı 4/10 maçla verilmez).

## Ek B-1: Bağlam matrisi — hangi ilkel ne zaman?

Motorun plan seçicisi için önsel tablo (satır: evre × rakip düzeni; hücre: öncelikli ilkeller). Ağırlıklar tahmindir; hoca tarzı (Ek B-2) ve oyuncu profili bunları çarpar.

| Evre | Rakip düzeni | Birincil ilkeller | İkincil | Kaçınılan |
|---|---|---|---|---|
| Kurma | Yüksek pres, adam-odaklı | B.22 sürerek çekme, B.3 bırakış + B.1 üçüncü adam, B.9 hattı germe (uzun top için) | B.20 yarım dönüş, B.10 çevirme | B.2 duvar pası (kalabalık), B.13/B.14 |
| Kurma | Orta blok, bölge | B.19 üçgenler, B.12 beş koridor, B.20 yarım dönüş | B.10 çevirme, B.21 pausa | Erken derin koşu (alan yok) |
| İlerletme | Orta blok 4-4-2 | B.12 yarım alan alışı, B.1 üçüncü adam, B.10/B.11 yığ-yalnız bırak | B.4/B.5 bindirmeler, B.22 | B.14 erken orta |
| İlerletme | Alçak blok 5-4-1 | B.11 yığ-yalnız bırak, B.5 iç bindirme, B.13 geri çevirme hazırlığı, B.21 pausa | B.6 kör taraf, B.8 aldatma, uzak direğe B.14 | B.9 derin koşu (alan yok), B.16 sahte 9 (stoper takip etmez) |
| İlerletme | Yüksek hat, topa baskısız | B.9 derin koşu, B.16 sahte 9 + kanat koşuları, B.7 çift hareket | B.1 üçüncü adam (arkaya), B.17 sabitle-dön | Yavaş kurma |
| Son üçte bir | Yerleşmiş savunma | B.13 geri çevirme, B.24 kutuya giriş düzeni, B.15 ters kanat, B.6 kör taraf, B.8 aldatma | B.2 duvar pası, B.18 kanat 2v1 | B.14 derinden orta (%0,5 dönüşüm) |
| Son üçte bir | Geri koşan savunma (geçiş) | B.14 erken orta, B.9 derine koşu, B.22 sürüş | B.4 bindirme (ikinci dalga) | B.21 pausa (tempo kaybı) |
| Geçiş (top kazanımı) | Rakip dağınık | B.9 ilk 3 sn'de derine koşu, B.22 sürüş, B.14 erken orta | B.2 duvar pası | B.19 kurma mesafeleri (zaman yok) |
| Oyun durumu: önde, son 15 dk | Rakip baskılı | B.19/B.21 top saklama, B.10 çevirme | B.22 (zaman geçirme sürüşü) | Riskli B.9/B.13 |

Okuma notları: "kaçınılan" hücreler yasak değildir, önsel ağırlığı düşüktür; bağlam değişince (ör. alçak blokta stoperin çıkması) ilgili ilkel anında açılır. Geçiş evresinin ayrıntısı Bölüm C'dedir (burada yalnız ilerletme ilkelleriyle kesişen üç satır).

## Ek B-2: Hoca tarzı × ilkel ağırlıkları

Tarz, ilkel önseline çarpan ve bağlılık süresine katsayı verir. Değerler 0,5–2,0 arası çarpanlar, **tahmin**; her tarzın dayanağı yanında.

| İlkel | Konumsal (Guardiola/Lillo) | İlişkisel (Diniz) | Dikey/geçiş (Klopp tipi) | Kanat-orta (klasik 4-4-2) | Dayanak |
|---|---|---|---|---|---|
| B.1 üçüncü adam | 1,8 | 1,5 | 1,0 | 0,8 | CV: "konumsal oyun için kritik" |
| B.2 duvar pası | 1,0 | 2,0 | 1,2 | 0,8 | tabela / toco y me voy |
| B.4 bindirme | 1,0 | 0,8 | 1,3 | 1,8 | PL 2024/25 Newcastle 277 ↔ City 76 |
| B.5 iç bindirme | 1,6 | 0,9 | 1,0 | 0,6 | Spurs 259; "ters bek"ten beklenir |
| B.9 derine koşu | 1,0 | 0,8 | 2,0 | 1,2 | CIES: "boşluğa" ↔ "ayağa" lig farkları |
| B.10 çevirme | 1,6 | 1,4 (yığılmadan ani) | 1,0 | 1,2 | Spielverlagerung JdP |
| B.11 yığ-yalnız bırak | 1,8 | 1,2 | 0,8 | 1,0 | Analytics FC |
| B.12 yarım alan | 2,0 | 1,0 | 1,2 | 0,7 | Spielverlagerung |
| B.13 geri çevirme | 1,8 | 1,2 | 1,2 | 1,0 | Man City 2018/19 |
| B.14 erken orta | 0,5 | 0,6 | 1,5 | 2,0 | PL orta sayısı düşüyor |
| B.16 sahte 9 | 1,6 | 1,2 | 0,8 | 0,5 | Guardiola–Messi |
| B.19 mesafe kuralı | sabit 8–15 m | 5–8 m yakınlık | esnek | 10–20 m | Cruyff 10 m; Diniz kısa pas |
| B.21 pausa | 1,6 | 1,6 | 0,6 | 0,8 | PAUSA: hızla r=−0,286 |
| B.22 sürerek çekme | 1,4 | 1,6 | 1,2 | 0,8 | CV üçüncü adam tetiği |
| Kısa/geri koşu payı | %28–30 | %30+ (tahmin) | %18–22 (tahmin) | %15–20 (tahmin) | CIES: City %29,6, PSG %28,5 |
| Plan bağlılığı (sn) | uzun (8–15) | kısa (2–4) | kısa (2–3) | orta (4–6) | "15 pas"; "durmak yasak" |

## Ek B-3: Opta pas tanımları (motor sayaçları için ortak dil)

- **Orta (cross):** geniş alandan, kaleye yakın merkezdeki arkadaşı hedefleyen top.
- **Geri çevirme (pull-back):** ceza sahasında kale çizgisine ulaşıp topu geriye kesen pas.
- **Ara pası (through ball):** savunmayı yararak arkadaşın koşusuna atılan pas.
- **İlerletici pas (progressive pass):** hücum üçte ikisinde topu kaleye en az %25 yaklaştıran tamamlanmış pas.
- **İlerletici taşıma (progressive carry):** topu 5 m'den fazla ileri taşıyan sürüş.
- **Çalım denemesi (take-on):** top sahibinin rakibi geçme girişimi.
- **Büyük şans (big chance):** oyuncunun makul olarak gol atması beklenen durum (1v1 ya da çok yakın mesafe, düşük-orta baskı; penaltılar dahil).
- **Yüksek top kazanımı (high turnover):** rakip kaleye ≤40 m'de başlayan açık oyun pozisyonu.
- **Yoğun baskı altında pas:** en az bir rakip 2 m içinde (Opta Vision ölçüsü).
- Opta'da "switch of play" ve "line-breaking pass" tanımı yayımlanmış sözlükte yok; çevirme için Analytics FC tanımı (B.10), hat kıran pas için Opta Vision kullanımı (Alexander-Arnold → Salah 146; 123 tek hat, 20 iki hat, 3 üç hat) referans alınır.
- Kaynaklar: https://theanalyst.com/articles/opta-football-stats-definitions ; https://theanalyst.com/articles/opta-vision-stats-tracking-data-premier-league ; https://analyticsfc.co.uk/blog/2021/05/24/developing-new-metrics-switching-the-play/

---

## Yöntem notu

- Araştırma 2026-10-19'da WebSearch + WebFetch ile yapıldı; paylaşımlı arama bütçesi dolduğundan son tur yalnız doğrudan sayfa okumayla tamamlandı.
- Erişilemeyen/okunamayan kaynaklar: Stats Perform "The Art of Crossing" (403; sayılar arama özetinden), Jamie Hamilton "What is Relationism" (403; arama özetinden), FIFA Training Centre "Creating and exploiting overloads" ve CIES MR88 PDF'leri (metin çıkarılamadı), FourFourTwo "pinning"/"overlap" (üye duvarı), Marc Lamberts üçüncü adam ölçümü (ücretli).
- Depoda hiçbir dosya değiştirilmedi; yalnız bu dosya yazıldı.
