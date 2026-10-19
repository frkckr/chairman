# BÖLÜM A — Oyun kurma, baskıdan çıkış, kaleci dağıtımı ve kale vuruşu (Build-up, playing out of pressure, goalkeeper distribution, goal kick)

Futbol Kütüphanesi taslağı, Bölüm A. Yazım tarihi 2026-10-19. Kural zemini bugünün kurallarıdır (VAR dahil); yalnız görüntü retrodur. Bu bölüm motorun "ilkel × bağlam × rol" diliyle çalıştırabileceği bilgi tabanıdır: her ilkel bir tetik, roller, topun yolu, süre, başarı ölçüsü, panzehir ve kabiliyet eşiği taşır. Oyun ilkeleri OYUN_TASARIMI'nda, iş sırası YOL_HARITASI'nda kalır; bu bölüm zorunlu içerik kotası değildir.

## 0. Nasıl okunur

- `[Anahtar]` biçimli her bağlantı dosya sonundaki **Kaynak dizini**ne gider (güvenilirlik notuyla). Sayıların yanındaki anahtar, sayının geldiği sayfadır. Bir sayı kaynağında bulunduğu hâliyle aktarılır; yazarın hesabı "(hesap)" ile işaretlidir.
- **(tahmin)** = kaynaksız; yazarın çıkarımı, antrenör normu ya da motor tasarım önerisi. Kaynaklı sayı gibi okunmamalıdır. **bulunamadı** = arandı, kaynak çıkmadı (Bölüm 6'da toplu liste).
- Kabiliyet bantları: **D** düşük, **O** orta, **Y** yüksek, **E** elit; **G/K/Y** = görme (algı, tarama), karar (seçim ve vazgeçme), yürütme (teknik uygulama). Bantlar motor ölçeği için tahmindir; yalnız belirtilen yerde gerçek bir veri dayanağı vardır.
- Kaynak ağırlığı: resmî kural metni (IFAB) ve FIFA Training Centre (TSG) analizleri en güvenilir sınıftır; Opta/StatsBomb verisi PL ve Hudl yazılarından aktarılmıştır; Chichester tezi yayımlanmamış, yarım sezonluk tek çalışmadır; AnalyticsFC, Halfspaces ve hayran blogu niteliksel/orta düzeydedir.
- Veri kapsamı: ağırlıkla Premier League 2019/20–2025/26, FIFA gençlik ve kulüp turnuvaları, tek tek akademik çalışmalar. **Süper Lig ve diğer lig karşılaştırmaları büyük ölçüde bulunamadı** (Bölüm 6). Web arama bütçesi tükendiği için bazı boşluklar kapatılamadı; hangileri olduğu Bölüm 6'da yazılıdır.

## 1. Zemin: kural ve veri

### 1.1 Kurallar (bugün)

- Kale vuruşu, top vurulup açıkça hareket edince oyundadır; rakipler top oyuna girene dek ceza sahası dışında durur; içerideyken ya da erken girip topa dokunan rakip vuruşun tekrarına yol açar [IFAB-K16]. 2019/20'den beri takım arkadaşları da kendi ceza sahasında vuruşu karşılayabilir; FIFA yaklaşık 640 m² ek kurma alanı olduğunu söyler [FIFA-KV].
- Doğrudan kale vuruşundan topu alan oyuncu ofsayt olamaz [IFAB-K11]. Guardiola'nın anlatımı: ofsayt olmadığı için ileri uçlar çok yükselir, kanatlar çizgiye açılır, vuruş uzun gelirse markörden kaçıp topun düşeceği yere koşarlar [SI-Ederson] (2017 haberi; arama özeti, sayfa doğrudan okunmadı).
- Kasıtlı gecikme: hakem 5 saniyelik görsel geri sayım başlatır; süre dolarsa rakibe korner verilir [IFAB-K16]. Bu geri sayımın taç ve kale vuruşuna genişletilmesi IFAB'ın 2026 yıllık toplantısında onaylandı; bir kaynak yürürlüğü "2026 Dünya Kupası ve diğer bütün yarışmalar" diye yazar [GhanaTimes]; başka haberler 2026/27 sezonunu anar (arama özeti; resmî tarih metni okunamadı, **kesin yürürlük tarihi doğrulanamadı**). Sayaç sabit bir 5 saniye sınırı değildir; hakemin "kasıtlı gecikme" yargısı sonrası başlar.
- Kaleci elde tutma: 6 sn + endirekt serbest vuruş yerine 8 sn + 5 sn görsel geri sayım + rakibe korner [IFAB-8sn]. Deneme 2024/25'te 400+ maçta yapıldı: İngiltere'de (PL2) 3 korner, Malta'da 0 [ESPN-Deneme]; ilk ihlalde uyarı, sonrası sarı kart [PL-Deneme].

### 1.2 Kısa / uzun payları ve zaman içindeki değişim

Tanımlar kaynaktan kaynağa değişir (Opta "kısa": kendi kalesine 40 m'den yakın biten pas [PL-KV]; "uzun pas": ≥32 m [PL-Opta25] ya da >35 yarda [Sky-Kaleci]). Sayılar birbirine doğrudan eklenemez.

| Ölçek | Değer | Kaynak |
|---|---|---|
| PL, 40 m içinde biten kale vuruşu payı | %28 (2018/19) → %40 (2019/20, sezon içi) | [StatsPerform] (arama özeti; sayfa 403) |
| PL 2019/20, 292 maç, "yeni kuralla kısa" | 620 vuruş = %21,88 | [Warner] |
| Bu kısa vuruşlardan kısa→kısa / kısa→uzun | %77,6 / %22,4 | [Warner] |
| PL kaleci başına kısa pay, 2019/20 (20 Nisan 2020'ye dek) | Ederson %61 (57), Ryan %54 (107), De Gea %51 (99), Lloris %46, Kepa %45, Leno %43; en az: Henderson %1, Pope %1, Foster %1, Fabianski %3, Patricio %3, Dubravka %3 | [PL-Kaleci] |
| Aynı sezon, uzun oynayan takımlar | 8 takım vuruşların en az %90'ını uzun oynadı (Sheffield United, Wolves dahil); ilk 9 takımın yedisinde ilk kaleci düzenli kısa oynadı | [PL-Kaleci] |
| Yerden / yüksek kale vuruşu (StatsBomb) | 2017'de %80'den çoğu yüksekti; bugün yerden olanlar yükseğe hafifçe fazla | [Hudl-Trend] |
| PL kaleci pasında ≥32 m payı | %79,3 (2014/15) → %46,6 (2023/24) → %47 (2024/25) → %51,9 (2025/26 başı) | [PL-4Trend] |
| PL kale vuruşunun rakip yarıda bitmesi | >%75 (2017/18) → ~%40 (2024/25) → %48,4 (2025/26; Burnley hariç %44,4); 2016/17–2024/25 her sezon düştü, ilk kez yükseldi | [PL-Opta25], [PL-4Trend] |
| EURO 2020, 51 maç, 595 kale vuruşu | uzun vuruş stratejisi başarılı hücum sekansıyla ilişkili (p=0,021); kısa/uzun tanımı ve oranlar sayfada yok | [HumMov] |
| EURO 2024, ikinci pasın ortalama uzunluğu (kısalar dahil tüm kale vuruşları) | 47,9 m | [UEFA-EURO24] (arama özeti; PDF 10 MB sınırını aştığı için okunamadı) |
| Kulüpler Dünya Kupası 2025 (2022 Dünya Kupası'na göre) | kısa vuruş %30 → %50; ≥2 rakip presli vuruş %23 → %40; savunmasız (presiz) vuruş %48 → %31; rakip ortalama ~2 m daha yakın; kale vuruşlarını kaleci Katar'da %95, ABD'de %70 attı | [FIFA-CWC25] |
| U-17 Dünya Kupası 2025 | kısa vuruş %17 (2023) → %39; kaleci uzun vuruşu %45; kenar oyuncunun kaleciye ilk pası sonrası kaleci %54 uzun, %34 orta oynadı | [FIFA-U17-25] |
| Liga MX (sezon kaynakta yok) | Tijuana %73 kısa/orta, Cruz Azul %60 kısa/orta; Puebla >%90 uzun | [CambioJuego] |
| Süper Lig, La Liga, Bundesliga, Serie A kale vuruşu payları | **bulunamadı** | — |

### 1.3 Kısa ve uzun vuruşun sonucu

| Ölçü | Kısa | Uzun | Kaynak |
|---|---|---|---|
| Ort. ilerleme (PL 2019/20, 288 maç) | 49 m (City 61,8 m; Arsenal 40,5 m) | 38 m | [PL-KV] |
| Hücumda şut / gol (PL toplam) | 36 / 5 | 21 / 0 | [PL-KV] |
| Savunmada: vuruş sonrası top kaybından yenen şut / gol | 42 / 9 | 34 / 2 | [PL-KV] |
| 5 olay içinde taç (PL, Ocak 2023 sonrası) | 46 sekans | 285 sekans | [Hudl-Trend] |
| Kaleci karışan açık oyun sekansları (Opta, "bu sezon") | 64 şut, 8 gol | 38 şut, 3 gol | [Sky-Kaleci] |

Chichester tezinde sekansın bittiği yer (kısa vuruşlar içinde; K→K = kısa→kısa, K→U = kısa→uzun) [Warner]:

| Sekansın bittiği yer | K→K (%77,6) | K→U (%22,4) |
|---|---|---|
| Son üçte bire giriş | %18,10 | %8,6 |
| Ceza sahasına giriş | %10,4 | %3,6 |
| Şut | %5,2 | %2,8 |
| Gol | %1,6 (özette "%" işareti yok; varsayım) | %0,7 |

Yorum: PL'in ham sayıları "kısa vuruş ilerletir ama top kaybı pahalıdır" der; yazar net farkı kısa için "altı şut fazla yenen" olarak okuyup riski ödülden büyük bulmuştur [PL-KV] (WebFetch özeti; tablo ham hâliyle doğrulanmadı). Chichester tezi kısa→kısa'yı her ölçüde daha verimli bulur [Warner]. Gerçek veri dünyasında **tek bir "doğru" oran yok**: tanım, seviye ve takım kalitesi sonucu belirler. Şu üç not tasarım için sağlamdır: (1) kısa vuruş daha çok ilerletir, daha çok şut doğurur ve daha pahalı hata verir; (2) uzun vuruş sekansları çok daha sık 5 olay içinde taçla biter (ham sayı: 285 ve 46; vuruş sayısına göre normalize edilmemiş) [Hudl-Trend]; (3) aynı sezon kaleci başına kısa pay %1–%61 arası dağılır [PL-Kaleci] — yani **stil takım kimliğidir**.

Önemli bağlam: tüm turnuvalarda pres kale vuruşuna yaklaştı (≥2 presçi %23→%40; savunmasız vuruş %48→%31) [FIFA-CWC25], StatsBomb da takımların kısa vuruşlara giderek daha çok pres yaptığını yazar [Hudl-Trend]. Chichester/PL 2019/20 sayıları presin henüz yaygın olmadığı yılı yansıtır; bugünün başarı oranları muhtemelen daha düşüktür (tahmin).

Sayı tabanı notu: Chichester'ın 620 kısa vuruş = %21,88 sayısından ~2.834 vuruş ve maç başına ~9,7 kale vuruşu çıkar (hesap); yani takım başına ~4,9. Bu, kaleci/oyun kurma ilkellerinin maç başına örneklem büyüklüğünü verir.

## 2. İlkeller

Özet matris (ayrıntı ve kaynaklar ilgili ilkelin başlığı altındadır):

| Kod | İlkel | Evre | Tetik (kısa) | Ana roller | Karşı pres / panzehir (kısa) |
|---|---|---|---|---|---|
| A1 | kısa-kısa kale vuruşu | kurma | pres zayıf/orta, serbest oyuncu var | kaleci, 2 stoper, çift pivot | yüksek adam adama, çizgi tuzağı, derin blok |
| A2 | kısa→uzun, sahte kısa | kurma → ilerletme | yüksek pres, arkası boş | kaleci, stoper, hedef + koşucu | derin ikinci hat, süpürücü |
| A3 | doğrudan uzun + ikinci top | ilerletme | yüksek pres, hava hedefi var | hedef, koşucu, ikinci top oyuncuları | hava üstün stoper, hedefe ikili |
| A4 | kaleci +1, 3-2 / 2-3-5 taban | kurma | ön ikili/üçlü pres | kaleci, stoperler, bekler | kaleciye pres |
| A5 | lavolpiana (altı iner) | kurma | ön ikili pres, bekler yüksekte | altı, 2 stoper | altıya adam adama |
| A6 | bek içeri | kurma → ilerletme | pres tetiklendi | bek, pivot, kanat | iç koridor adam adama |
| A7 | pres yemleme, pausa | kurma → ilerletme | pres bekliyor ama sıçramıyor | pasör stoper, kaleci, pivot | tam yüksek adam adama / derin blok |
| A8 | üçüncü adam | kurma → ilerletme | A sıkışık, B yakında, C serbest | A, B, C | B'yi gölgeleme |
| A9 | duvar pası | kurma → ilerletme | tek presçiyle yakın temas | pasör, duvar | pas gölgesi |
| A10 | hat arası yarım dönüş, hat kıran pas | ilerletme | pres hatları arasında boşluk | 6/8, kaleci/stoper | geri pres, hat arası kapama |
| A11 | baskı altında çevirme | kurma → ilerletme | pres ilk pasın tarafına kaydı | çeviren oyuncu, bek | kaymayı yavaşlat |
| A12 | kaçış: çizgi bek, geri kaleci | kurma | sıkışma | bek, kaleci | kenara yönlendirme |
| A13 | stoper taşıması | ilerletme | ön hat yan pas bekliyor | stoper | taşıyıcıya pres |
| A14 | kaleci dağıtım kararı | kurma / geçiş | kaleci topta | kaleci, hedefler | pres açısı, ikinci presçi |
| A15 | kale vuruşu yerleşme saati | duran top | top çizgiyi geçti | kaleci, hakem | hakem sayacı |
| A16 | rakip presine göre uyum | kurma → ilerletme | kurma bozuluyor | tüm takım | rakibin uyumu |
| A17 | stoper genişliği | kurma | rakip ön hat sayısı | 2 stoper (+ kaleci) | forvet pas gölgesi |

### A1. Kısa-kısa kale vuruşu (Short-to-short goal kick)

- **Evre:** kurma (duran top → açık oyun).
- **Bağlam ve tetik:** Takım kısa tercihli; rakip ön hat ikili ya da üçlü; kaleci ile iki stoper ve altı(lar) sayısal olarak serbest bir oyuncu üretebiliyor ("her zaman bir serbest oyuncu vardır" [FIFA-Gabriele]). Vuruştan önce herkes yerini alır; bu yüzden kuralın "oyunu hızlandırma" amacı tam tutmadı [FIFA-KV]. Pres işareti: rakibin kaleciye mesafesi ve adam sayısı (İspanya, Fas karşısında her kale vuruşunda restart'a 12,5 m içinde en az bir oyuncu tuttu [FIFA-U20-25]).
- **Roller ve hareket:** Kaleci vuruşu yapar; iki stoper yana açılıp kaleciyle aynı hatta ya da yarım adım önde durur; bekler alçak ve geniş; çift pivot ceza sahası kenarında; kenar orta sahalar rakip bekleri yükseğe sabitler; iki forvet orta sahaya inip sayı ekler (Fas 1-4-4-2 kale vuruşu; kaleciye iki seçenek) [FIFA-U20-25], [FIFA-Oyun-Yuksek-Blok]. De Zerbi çift pivotu kale vuruşunda da derin tutar [CoachesVoice]. Kaleci bazen çizginin biraz gerisine adım atıp seçenek açar ve alanı büyütür [FIFA-KV]. Mesafeler: stoper–kaleci ~8–15 m, pivot ceza sahası kenarında ≈16,5 m (tahmin; ceza sahası ölçüsü Laws of the Game Law 1'den bilinen ölçü, burada okunmadı).
- **Topun yolu:** Yerden, kısa (5–15 m, tahmin), 1–2 dokunuş; "yalnız gerektiği kadar sert, alıcının ön ayağına" [FIFA-Gabriele]. Kaleci güçlü ayağa oynar; ilk pasın tarafı presçinin kayma yönünü belirler (Fas'ın kalecisi sağ ayakla sağ beke oynadı, İspanya'nın sol orta sahası beke pres yapınca merkez pas yolu açıldı [FIFA-U20-25]).
- **Zamanlama:** Kaleci pres şekli oturana kadar bekler; bekleme tipik olarak 2–6 sn (tahmin), Cruz Azul topu kendi alanında tutup pres gelmesini bekler [CambioJuego]. Bağlılık: plan, ilk pas tamamlanıp top çizgi/ pivot hattını geçene dek; rakip hiç gelmiyorsa 8–10 sn sonra planı "ağırlaştır" (tahmin).
- **Başarı ve sıklık:** Kısa→kısa sekansların %18,10'u son üçte bire, %10,4'ü ceza sahasına, %5,2'si şuta, %1,6'sı (özette işaretsiz) golle biter [Warner]. Kısa vuruştan ilerleme ort. 49 m (uzun 38 m) [PL-KV]. Maliyet: vuruş sonrası top kaybından yenen gol 9 (uzun için 2) [PL-KV]. Kaba oran (hesap, tanımlar uyuşmuyor): PL 2019/20'de ~1.100 kısa vuruşa karşı 42 yenen şut ≈ %4, 9 yenen gol ≈ %0,8. Brighton'ın kalecisi Ryan 200 vuruşun 107'sini kısa oynadı ama bunlardan hiçbiri Brighton golüyle bitmedi [PL-Kaleci].
- **Panzehir:** (a) yüksek adam adama pres: kaleciyi doğrudan oyuna zorlar ve düello yaratır; Thomas Frank: "ya tam yüksek adam adama ya da derinde dur, ortada kalma" [AFC-Derin]; River Plate, Monterrey'e karşı iki santrforu D'nin kenarına dizdi [FIFA-CWC25]; (b) derin blok: yatay ve yavaş oyun, tıkanma [AFC-Derin]; (c) tuzak: topu çizgi kenarına çek, çizgiyi ekstra savunmacı yap [CambioJuego].
- **Kabiliyet eşiği:** Kaleci K ve Y: iki ayaklı dağıtım ve karar önemli [FIFA-KV]; kısa pas referansı: Robert Sánchez kısa paslarının %99'unu, orta paslarının %98'ini tamamladı [Mastermind] (elit referans; D–O bandı için %85–92, tahmin). Stoper: iki ayakla ilk dokunuş, baskı altında alma (Y). Pres okuma (G) O+ olmalı.
- **Hoca tarzı:** Guardiola (City ort. 61,8 m kısa ilerleme [PL-KV]), De Zerbi, çoğu pres karşıtı kurmacı hocalar; Arsenal Arteta'dan sonra kısa kale vuruşunu belirgin azalttı [PL-KV].
- **Ünlü örnek:** Hollanda–Paraguay, U-17 Dünya Kupası 2019 (dakika kaynakta yok): kaleci çizginin biraz gerisine çekilip kısa oynayarak seçenek ve alan yarattı [FIFA-KV]. Fas–İspanya, U-20 2025 (dakika yok): çift pivot ve düşen forvetlerle 3v2 kurup hat kırdı [FIFA-U20-25].
- **Kaynaklar:** [Warner], [PL-KV], [PL-Kaleci], [FIFA-KV], [FIFA-U20-25], [FIFA-Gabriele], [FIFA-Oyun-Yuksek-Blok], [AFC-Derin], [CambioJuego], [Mastermind].

### A2. Kısa→uzun kale vuruşu, sahte kısa (Short-to-long goal kick / fake-short decoy)

- **Evre:** kurma → ilerletme.
- **Bağlam ve tetik:** Rakip yüksek ve adam adama pres yapıyor, arkasında boşluk var; kaleci kısa hazırlığı yem olarak kullanır. Ederson: rakip yüksek pres yapınca sahte kısa gösterip uzun oynar, yem ileri hat için yeni boşluk açar [PL-Kaleci]. Guardiola: yüksek preste top karşı ceza sahasına gider ve orta açılır [SI-Ederson].
- **Roller ve hareket:** Kaleci ve stoper ilk kısa pasla presi çeker; top kaleciye geri döner ya da stoperden doğrudan uzun gider (Liverpool–Flamengo: kaleci stopere, geri aldı, sol orta sahaya uzun pas, pres aşıldı [FIFA-KV]). İleri hat vuruştan önce genişler (kanatlar çizgide, santrfor derinde); biri tutar, biri arkaya koşar [FIFA-KV]. Avusturya kalecisi Posch önce uzun vuruş numarası yaptı, sonra diyagonal koşuya uzun pas verdi; pozisyon penaltıyla bitti [FIFA-U17-25]. Mesafe: pres hattı kaleciden ~12,5 m [FIFA-U20-25].
- **Topun yolu:** Kısa yer pası + yüksek ya da yarım yüksek uzun pas; Wenger: "gerektiği kadar yüksek, olabildiğince düz", topun daha hızlı varması için [FIFA-KV]. İlk kısa pas 1 dokunuşlu.
- **Zamanlama:** Yem pasından uzun vuruşa 2–5 sn (tahmin); tetik presçinin sıçramasıdır ("pres ne kadar sertse gelişim o kadar dikey" — De Zerbi [Sky-DeZerbi]). Bağlılık kısa: ilk pres sıçraması gelmezse plan kısa-kısa'ya döner (tahmin).
- **Başarı ve sıklık:** Chichester'da kısa→uzun payı %22,4; sekans sonuçları kısa→kısa'dan düşük: son üçte bir %8,6, ceza sahası %3,6, şut %2,8, gol %0,7 [Warner]. Seçim yanlılığı olası (uzun kısmı zorlayan bağlamda seçilir; tahmin). Man City ort. 61,8 m ilerleme [PL-KV].
- **Panzehir:** Hat arkasını boş bırakmayan derin ikinci hat; ofsayt olmadığı için arka hatta güvenlik adamı (süpürücü); uzun pasın düşeceği yer için orta saha yerleşimi.
- **Kabiliyet eşiği:** Kaleci Y (uzun pas yürütmesi, iki ayak), K (pres şeklini okuma, ne zaman uzuna çevireceği); hedef oyuncu hava ve zıplama yeteneği. Kısa+uzun karışımı kaleci için ayırt edici nitelik: Zuberbühler "çeşitleme, mix, başarının anahtarı" [FIFA-KV].
- **Hoca tarzı:** Guardiola (Ederson), Brighton/De Zerbi (Steele'in baskı üstü toplamaları [AFC-Zamanlama]).
- **Ünlü örnek:** Liverpool–Flamengo, Kulüpler Dünya Kupası 2019 (dakika kaynakta yok): kaleci–stoper–kaleci döngüsü ve sol orta sahaya uzun pas, pres atlatıldı [FIFA-KV]. Japonya–Meksika, U-20 2019 (dakika yok): ortadan kurma görüntüsü, sonra forvete uzun pas ve gol [FIFA-KV].
- **Kaynaklar:** [PL-Kaleci], [SI-Ederson], [FIFA-KV], [FIFA-U17-25], [FIFA-U20-25], [Warner], [PL-KV], [Sky-DeZerbi], [AFC-Zamanlama].

### A3. Doğrudan uzun kale vuruşu ve ikinci top düzeni (Direct goal kick and second-ball structure)

- **Evre:** ilerletme (kurmayı atlama).
- **Bağlam ve tetik:** Rakip yüksek pres yapıyor ya da hat yüksek ve arkası boş; takımın havada güçlü bir hedef oyuncusu var; skor ya da maç sonu koşulları; kısa kurmanın riski kabul edilemiyor. FIFA CWC 2025: yüksek presçi takımlara karşı doğrudan oynayanlar daha başarılıydı; bu takımlar turnuvanın en çok uzun topunu yedi [FIFA-CWC25-Pres], [FIFA-CWC25].
- **Roller ve hareket:** Bir oyuncu tutar (hedef), biri arkaya koşar (hat arkası), kenarlar ve orta saha ikinci topun düşeceği kuşağa vuruştan önce yerleşir. Brentford oyuncuları forvetin indirme toplarını toplayacak şekilde dizer [SB-Hedef]. Benfica–Bayern: önce Bayern'i presle çekti, sonra uzun oynayıp ilk ve ikinci topu kazandı ve kenara çevirdi (Bayern'in geri hat sayısı azdı) [FIFA-CWC25-Pres]. Kenar oyuncular hava hedefi olabilir (İrlanda, havada güçlü kanat oyuncusunu hedef aldı, indirme için yanında oyuncu hazırdı [FIFA-U17-25]). İkinci top kuşağı hedefin 10–15 m çevresi (tahmin).
- **Topun yolu:** Yüksek, düz tutulmaya çalışılan uzun pas; EURO 2024'te ikinci pas ort. 47,9 m [UEFA-EURO24]. Opta uzun pasları ≥32 m [PL-Opta25] ya da >35 yarda [Sky-Kaleci] sayar. Hedefin ilk dokunuşu çoğu kez kafa; kafa pası sonrası top tutma sorunu: Toney'ye yönelen uzun toplardan yalnız 3'ünü göğüs/ayakla kontrol edebildi [SB-Hedef].
- **Zamanlama:** Top havada ~2–3 sn (tahmin); koşular vuruş anında başlar (ofsayt yok [IFAB-K11]); ikinci top mücadelesi düşüşten ~1 sn sonra (tahmin). Bağlılık: tek vuruşluk plan; ikinci top kaybedilirse hemen karşı pres (tahmin).
- **Başarı ve sıklık:** Düello modeli: HOPS 0,83'lük Đurić, ortalama stoperine (0,65) karşı %73 kazanır; kafa pası tamamlama %62 ile top tutma ≈ %45 (0,73×0,62); 75. persentil forvet için düello %40, tutma %25 [SB-Hedef]. Toney, Man City karşısında 19 düelloda 9 kazandı (%47; modelin beklentisi 8,83) [SB-Hedef]. PL 2019/20: uzun vuruş hücumunda 21 şut, 0 gol [PL-KV]. EURO 2020: uzun vuruş stratejisi başarılı sekansla ilişkili [HumMov]. Bedel: Ocak 2023 sonrası uzun kale vuruşlarından 285 sekans 5 olay içinde taçla bitti (kısa vuruşta 46; ham sayı, normalize edilmemiş) [Hudl-Trend]. Brentford (sezon kaynakta yok; muhtemelen 2024/25, tahmin): maç başı 16,6 hava topu kazandı (lig 1.'si), 14 kafa golü [Brentford]; Brentford'un uzun toplarının neredeyse yarısı duran toptan [SB-Hedef].
- **Panzehir:** Hava hakimi stoper çifti, hedefin arkasında süpürücü, ikinci top kuşağında orta saha sıkışması; hedefi ikili markajla yalnız bırakma; hattı yükseltmeme.
- **Kabiliyet eşiği:** Hedef: hava (zıplama, denge, kafa yönlendirme; HOPS) ve tutma (G+Y); ikinci top oyuncuları G (düşüşü okuma) ve temas gücü; kaleci Y (uzun pas isabeti, düz tasarım). Havada güçlü hedef (HOPS ≥0,8) elit; ≈0,65 (Toney, 97. persentil forvet) yüksek [SB-Hedef].
- **Hoca tarzı:** Thomas Frank/Brentford [SB-Hedef], [Brentford]; Puebla (Liga MX) %90+ uzun [CambioJuego]; PL 2025/26'da Burnley (Dubravka'nın rakip yarıya 61 uzun vuruşu, başka herhangi bir takımın iki katından fazla) [PL-Opta25].
- **Ünlü örnek:** Brentford–Man City (StatsBomb analizi; tarih ve dakika kaynakta yok): 238 pasın 60'ı yüksek uzun top; Toney'nin 19 düellosundan 16'sı uzun toplarda [SB-Hedef]. Benfica–Bayern, KDK 2025 grup (skor, dakika yok): ilk ve ikinci top kazanılıp kenara çevrildi [FIFA-CWC25-Pres].
- **Kaynaklar:** [SB-Hedef], [Brentford], [PL-KV], [PL-Opta25], [Hudl-Trend], [HumMov], [UEFA-EURO24], [FIFA-CWC25], [FIFA-CWC25-Pres], [FIFA-U17-25], [Sky-Kaleci], [CambioJuego].

### A4. Kaleciyi +1 yapan taban ve kurma şekilleri (Goalkeeper as extra man; 4-2 / 3-2 / 2-3-5 base)

- **Evre:** kurma.
- **Bağlam ve tetik:** Rakip iki (ya da üç) forvetle yüksek pres yapıyor; takım sayısal üstünlük (kaleci dahil 3v2, 4v3) istiyor; kalecinin ayağı var. FIFA TSG: yüksek preste kaleci "fazladan oyuncu"dur ve presi çekmeye de yarar [FIFA-CWC25-Pres].
- **Roller ve hareket:** "Kaleci zinciri": kaleci iki stoper arasında üçlü bir hat kurar, bekler yükselir, kaleci kurmanın parçası olur; risk: top kaybında kaleci pozisyon dışı, kötü pas kolay gol; bunu çok az kaleci ceza sahası dışında yapar [Fussball-NL]. Brighton: kaleci +1, bekler daralır, çift pivotun biri ya da ikisi iner; küçük alanda 6–7 oyuncu [AFC-Zamanlama]. Stoperler kalecinin yanına gelir (pres davet) [Halfspaces]. Fas: iki stoper kaleciyle aynı hatta, 3v2 [FIFA-U20-25]. Mesafe: üçlü hat içinde ~10–14 m aralık (tahmin).
- **Topun yolu:** Yerden kısa, 1–2 dokunuş; kaleciye geri pas yön değiştirme için kullanılır. Qatar 2022'de (2018'e göre) kalecinin pas teklif etmesi %64, aldığı pas %100 arttı [FIFA-Katar22].
- **Zamanlama:** Tabanın kurulması vuruştan önce (kale vuruşu), açık oyunda kalecinin geri alındığı ilk pas anında. Bekletme: A7.
- **Başarı ve sıklık:** Katar 2022, 2018'e göre: kalecinin ortalama konumu ~4 m yukarıda, orta üçteki savunma hattı ~7 m yukarıda, "çevreleyerek oyna ve destekle" (kısa dağıtım) +%12, "hedefe oyna" −%15 [FIFA-Katar22]. Brighton'da Sánchez pasların %74,4'ünü kendi yarı sahada oynadı (önceki sezon %64,5) [Sky-DeZerbi]; Ederson paslarının %76'sı kısa, maç başı yalnız 6 uzun (Opta, sezon yazıda belirsiz) [Sky-Kaleci]. Bedel: A1.
- **Şekiller ve taban→hücum eşlemesi:**

| Kurma tabanı | Hücum şekli | Kaynak |
|---|---|---|
| nominal 4-2-3-1 → 4-2 / 4-1 kurma (kaleci +1) | küçük alanda 6–7 oyuncu | [AFC-Zamanlama] |
| 2-4-4 oyun kurma | 2-3-5 / 3-2-5 | [Halfspaces], [AFC-Derin] |
| 2-4-4, bek içe, kanat iner | 2-5-3 | [Mastermind] |
| 4-3-3 → 3-4-3 (sol bek içe, sağ bek yüksek) | geri baskıya fazla oyuncu | [Spielv-2011] |
| Fas 1-4-4-2 kale vuruşu, iki stoper kaleciyle yan yana | 3v2 | [FIFA-U20-25] |
| 2-3-1 (antrenman, altı iner) | lavolpiana | [WCC-Pep] |

- **Not:** "Birçok üst takım 3-2-5 kullanır"; Brighton 2-3-5'i yarı sahaya yakın kurar [AFC-Derin]. Şekil adları fazların etiketidir; oyuncuların gerçek konumu pres tipine göre sürekli değişir (tahmin).
- **Panzehir:** Kaleciye adam adama pres ve kaleciyi sıkıştıran ikinci presçi; top kaybında kaleci dışarıdadır. "Ya tam yüksek adam adama ya derin" [AFC-Derin].
- **Kabiliyet eşiği:** Kaleci Y: iki ayaklı, sakin, kısa pas tamamlama (Sánchez %99/%98 elit [Mastermind]); K: serbest oyuncuyu bulma [FIFA-Gabriele]; G: pres şeklini okuma. Düşük ayak yeteneğinde "kaleci zinciri" motorda seçilmemeli (tahmin).
- **Hoca tarzı:** Guardiola, De Zerbi ("kaleci üçüncü stoper" [CoachesVoice]), Arteta; kısa kurmadan kaçınanlar için bu ilkel kapalıdır.
- **Ünlü örnek:** Brighton–Liverpool açılış golü (tarih kaynakta yok): Ferguson Matip'e pres yaptı, Mac Allister Henderson'ın önüne girdi; dört oyuncunun yedi dokunuşuyla gol geldi [Sky-DeZerbi]. Brighton–Everton 5-1 (dakika yok): Dunk topun üstünde ~14–15 sn durup presi çekti [PL-Brighton].
- **Kaynaklar:** [FIFA-CWC25-Pres], [Fussball-NL], [AFC-Zamanlama], [Halfspaces], [FIFA-U20-25], [FIFA-Katar22], [Sky-DeZerbi], [Sky-Kaleci], [Mastermind], [CoachesVoice], [WCC-Pep], [Spielv-2011], [AFC-Derin], [PL-Brighton].

### A5. Altının stoperler arasına inmesi (Salida lavolpiana / dropping pivot)

- **Evre:** kurma.
- **Bağlam ve tetik:** Rakip ön ikili preste (4-4-2, 4-3-1-2); bekler yüksekte, geride yalnız iki stoper var; tetik "bekler çıktı, iki stoper ilk hatta kaldı" [Fussball-NL]. Amaç ikiliye karşı 3v2 [WCC-Pep]. Ad, Arjantinli hoca Ricardo La Volpe'den gelir; Guardiola yaygınlaştırdı (arama özeti, birden çok kaynak; doğrudan okunmadı).
- **Roller ve hareket:** Altı iki stoper arasına iner, stoperler yana açılır (varyant A); ya da altı stoperin yanına, geniş stoper rolüne düşer, stoperler diğer tarafa kayar (varyant B: Kroos, Modrić) [Fussball-NL]. Bekler ileri çıkabilir, genişliği bekler verir [WCC-Pep]. Barcelona 2011 (Spielverlagerung): Busquets uzak yarı koridora gidip Rooney'i merkezden çekti, Xavi savunma hattına düşüp Giggs'i çekti; Messi sahte 9'dan sağ yarı koridora indi [Spielv-2011]. Mesafe: üçlü hattın toplam genişliği ~25–30 m (tahmin).
- **Topun yolu:** Yerden kısa; stoper→altı→iç orta saha ya da bek; 1–2 dokunuş; alıcı yarım dönüşle alır [WCC-Pep].
- **Zamanlama:** Düşüş, pres tetiklenmeden 1–3 sn önce (tahmin); bağlılık: top ilk hat üstünden geçene dek. Altı topu alınca 2–3 sn içinde ilerletir ya da çevirir (tahmin).
- **Başarı ve sıklık:** Kaynaklı oran **bulunamadı**. Nitel: üçlü yapı genişlik sağlar ve bekleri yükseltir [WCC-Pep]. Risk: bekler çıkınca top kaybında iki savunmacı iki forvete karşı kalır [Fussball-NL].
- **Panzehir:** Bir forvet altıyı adam adama takip eder (Barcelona finalinde Rooney, maçın büyük bölümünde Busquets'yi takip etti) [Spielv-2011]; ayrıca üçlü ön hat (tahmin).
- **Kabiliyet eşiği:** Altı: G (tarama, ne zaman inileceği) ve K, Y (yarım dönüş, iki ayak); stoperler genişleme timing'i. Düzey: altı Y, stoperler O+ (tahmin).
- **Hoca tarzı:** Guardiola (Barcelona, Bayern), pozisyon oyunu ekolü [WCC-Pep]; Real Madrid'de Kroos/Modrić varyantı [Fussball-NL].
- **Ünlü örnek:** Barcelona–Manchester United, Şampiyonlar Ligi finali 2011, Wembley, 3-1: United'ın Rooney'i Busquets'yi bırakıp pres yaptığı 30. dk civarında United gol buldu (Rooney koşusu, Giggs pası); sonra Rooney yeniden Busquets'ye döndü [Spielv-2011].
- **Kaynaklar:** [WCC-Pep], [Fussball-NL], [Spielv-2011].

### A6. Bekin içe girmesi (Inverted full-back in build-up)

- **Evre:** kurma → ilerletme.
- **Bağlam ve tetik:** Pres tetiklenince bek pivotun yanına girer ve kısa 1-2 üçgenleri kurar [Halfspaces]; ya da rakip orta saha iç koridoru kapatamıyor. Alternatif çözüm: bekin çizgiye yapışık kalıp dışa seçenek olması (Sassuolo ve Shakhtar'da bekler çizgiye yapışıktı [CoachesVoice]).
- **Roller ve hareket:** Bek içe, pivotla üçgen; kanat dışarıda genişlik; Brighton'da Groß "ters bek" olarak içe girdi, March derine inip alarak 2-5-3 çıktı [Mastermind]. Barcelona 2011'de Abidal içe girip Alves sağ kanatta yükselerek 3-4-3'e kaydı; amaç top kaybında geri baskıya fazla oyuncu [Spielv-2011]. Üçgen kenarı ~8–12 m (tahmin).
- **Topun yolu:** Kısa, tek dokunuş, içe; ardından dikey pas arkadaki boşluğa [Halfspaces].
- **Zamanlama:** Giriş, pres tetik anında (pas oyuncusu topu almadan ~1 sn önce, tahmin); bağlılık: top ilk hattı geçip bek yeniden dışa çıkana ya da kaybedilene dek.
- **Başarı ve sıklık:** Kaynaklı oran **bulunamadı**. Brighton'un bedeli: geri dönüşte kanal ve yarım koridor açık kalır [AFC-Derin]; çıkış pasları baskı altında top kaybı oranı: Caicedo %4,6, Mac Allister %7,3, Gross %8,3, Gilmour %6,8 (2023/24, baskılı dokunuş 25–29/90) [PL-Brighton].
- **Panzehir:** İç koridorda sıkı orta saha adam adamı; kanat forvetlerin içe sıkışması; derin blok.
- **Kabiliyet eşiği:** Bek: G (içe girişte tarama), Y (orta saha seviyesinde ilk dokunuş, iki ayak); K (ne zaman girmeli). Düzey O+/Y; düşük ilk dokunuşlu bek bunu yapınca top kaybını artırır (tahmin).
- **Hoca tarzı:** De Zerbi (Brighton), Guardiola; Sassuolo/Shakhtar'da çizgi bekleri [CoachesVoice].
- **Ünlü örnek:** Brighton (maç/dakika kaynakta yok) ve Barça 2011 [Spielv-2011].
- **Kaynaklar:** [Halfspaces], [Mastermind], [Spielv-2011], [CoachesVoice], [AFC-Derin], [PL-Brighton].

### A7. Baskıyı yemleyip arkasına oynama, "pausa" (Bait the press / waiting on the ball)

- **Evre:** kurma → ilerletme.
- **Bağlam ve tetik:** Rakip pres yüksek ama ısrarla sıçramıyor ya da hazırda bekliyor; takım topu tutup bekler, ilk presçi adım atınca pas oynar. Brighton'da oyuncular tabanlarını topun üstüne koyup durur (Dunk'ın "pausa"sı) [AFC-Zamanlama]; "bazen 10–15 sn" [PL-Brighton]; yem, çoğu kez yavaş ve geriye oynanan bir pastır (yem pası; tahmin); Everton maçında ~14–15 sn [PL-Brighton]. Amaç rakibi çekmek: orta saha oyuncusuna alan ya da "yapay geçiş" [PL-Brighton].
- **Roller ve hareket:** Stoper topun üstünde durur; kaleci +1; çift pivot derin; bekler/kenarlar sabitlenir; kurma oyuncuları pres hattını çektikten sonra çekilen rakiplerin arkasında kayar ve dikey pas alır [Halfspaces]. Buonanotte yana taşıdı, Joelinton müdahaleye çekildi, ilk hatta verdi [AFC-Zamanlama]. Brighton'ın "yapay geçişi" (artificial transition): yavaş geri pasla pres çekilir, ardından hızlı kanat çevirmesiyle kontra benzeri alan açılır [PL-Brighton].
- **Topun yolu:** Kısa yer pası, üçgen; sonra dikey ya da kanat çevirmesi; çekme anındaki pas tek dokunuşlu ("lay-off", Brighton ligde en çok yapan [Sky-DeZerbi]).
- **Zamanlama:** Bekleme 10–15 sn [PL-Brighton]; pres sıçradıktan sonra çıkış 2–5 sn (tahmin). Liverpool golü: dört oyuncu, yedi dokunuş [Sky-DeZerbi]. Bağlılık: pres sıçramazsa ~15 sn sonra planı sonlandır ve ritmi değiştir (tahmin). Maç saati ölçeğinde süreler oyun içi saniye cinsindendir.
- **Başarı ve sıklık:** Brighton 2022/23: 31 maçta 53 şutla biten yüksek top kazanma (Arsenal 34 maçta 55); PPDA'da ikinci (10,3; kaynak "second for PPDA" der, yönü açık değil); açık oyun sekanslarını kalesinden ort. 43,8 m uzakta başlatır (ligin ikinci en yüksek değeri); Dunk 883 ileri paslı lig lideri [PL-Clarke]. 10+ paslık sekanslarda City'nin ardından 2., bu sekanslarda şutta/ceza sahası dokunuşunda da 2. [Sky-DeZerbi]. %70 üzeri topa sahip olduğu 6 lig maçında 1 galibiyet (2023/24) [PL-Brighton] — topa sahiplik başarı değildir.
- **Panzehir:** Thomas Frank: "ya tam yüksek adam adama ya derin, arada kalma, etrafından oynarlar" [AFC-Derin]. Adam adama pres Brighton'ın ilk ilerlemesini siler ve kaleciyi doğrudan oyuna, çoğu kez kenara zorlar (ama düello açar, savunma hattı açığa çıkar); derin blok yem etkisini siler ama yatay kilitlenmeye yol açar [AFC-Derin]. West Ham/Everton karşılaştırması: 4-1-4-1 orta blok + adam odaklı orta saha [AFC-Derin].
- **Kabiliyet eşiği:** Tüm kurma hattı için K (vazgeç/sürdür), baskı altında sakinlik: referans Caicedo baskı altı top kaybı %4,6 [PL-Brighton] ve 2025/26'da baskı altında pasları %89,5 [Football365] (E bandı); %7–8 (Mac Allister, Groß) Y bandı örneği. Düşük kabiliyetli takımda yem bir intihardır (tahmin): bu ilkelin seçim ağırlığı kabiliyet eşiğine bağlanmalı.
- **Hoca tarzı:** De Zerbi (Brighton, Sassuolo, Shakhtar): presi bir kumar sayar, rakibi pres yapmaya teşvik etmeyi tercih eder [Sky-DeZerbi]; Mac Allister: "Onları çekmeye çalışıyor" [Sky-DeZerbi]; Guardiola'nın pozisyon oyunu.
- **Ünlü örnek:** Brighton–Newcastle (AnalyticsFC; tarih/dk yok): Buonanotte'nin yana taşıması Joelinton'ı çekti, Newcastle "toparlanma" kipine düştü [AFC-Zamanlama]. Brighton–Everton 5-1: Dunk ~14–15 sn pausa; üçüncü gol baskı sürerken yapılan lay-off'tan geldi [PL-Brighton], [Sky-DeZerbi].
- **Kaynaklar:** [AFC-Zamanlama], [AFC-Derin], [PL-Brighton], [PL-Clarke], [Sky-DeZerbi], [Halfspaces], [Football365].

### A8. Üçüncü adamla baskıdan çıkış (Third-man combination out of pressure)

- **Evre:** kurma → ilerletme.
- **Bağlam ve tetik:** Pası alan oyuncu (A) presçiyle karşı karşıya ve doğrudan ileri pas yolu kapalı; yakınındaki destek (B) çekilmiş markörü sürükler; C (ileri koşucu) boşa çıkar. "Up, back and through" [FIFA-Hirvatistan]. Gabriele: kaleci serbest oyuncuya doğrudan oynayamıyorsa üçüncü oyuncu serbest olanı bulmaya yardım eder [FIFA-Gabriele].
- **Roller ve hareket:** 1. oyuncu (kaleci/stoper) → 2. oyuncu (alıcı, topa doğru gelir, markörünü çeker) → duvar → 3. oyuncu (ileriye hareket eder, savunmacıların izleyemeyeceği zamanlamayla); topu alınca kaleye dönük olmalı [FIFA-3.Adam]. Hırvatistan'da Modrić 2. oyuncu, Brozović/Kovačić ilerleyen 3. oyuncu; markör 3. adamı tutarsa orta saha rotasyon yapar [FIFA-Hirvatistan]. Mesafe: A–B 6–12 m, B–C 10–20 m (tahmin).
- **Topun yolu:** Yerden; B'nin dokunuşu tek dokunuşlu "sektirme" ya da kontrol dokunuşu [FIFA-3.Adam]; ikinci eylem seçeneği: klasik lay-off, ilk-dokunuş çalım, kontrol dokunuşu (baskıya göre) [FIFA-Hirvatistan].
- **Zamanlama:** Koşu, B topu almadan (B'ye pas çıkarken) başlar; markörün hissedeceği zamandan 0,5–1 sn önce (tahmin). Bütün kombinasyon 2–3 sn (tahmin); kontrol dokunuşu zamanı geciktirir ve zamanlamayı iyileştirir [FIFA-Hirvatistan]. Bağlılık: 3. adam mark edilirse plan 1–2 sn içinde "rotasyon"a döner [FIFA-Hirvatistan].
- **Başarı ve sıklık:** Sayısal oran **bulunamadı**. FIFA: "pres çekmek arkasında boşluk yaratır" [FIFA-Hirvatistan].
- **Panzehir:** Alıcının (B) arkasını gölgeleme; 3. koşucuyu görmek için arkaya bakma; zonal hatta koşu devri; ofsayt çizgisini yakın tutmak (kale vuruşundan sonra açık oyunda geçerli).
- **Kabiliyet eşiği:** B: tek dokunuş yürütme (Y), G; C: öngörü/zamanlama (G+K); A: yönlendirme (K). Tarama: baskı altında (0–1 m) tarama azalır [Jordet20], bu yüzden B'nin taraması topu almadan önce bitmelidir. Düzey: O+ (O için yalnız kolay açıda, tahmin).
- **Hoca tarzı:** Dalić (Hırvatistan) [FIFA-Hirvatistan]; Ferguson, Scholes'u bu şekilde kullanmayı teşvik etti (Figo'ya göre Scholes "sahada bir hayalet") [FIFA-3.Adam]; pozisyon oyunu ekolü.
- **Ünlü örnek:** Hırvatistan–Kanada 4-1, Katar 2022 (dakika yok): Modrić dış ayakla ilk dokunuşta Eustáquio'yu atlattı, Brozović kısa taşıyıp Perišić'e verdi (3v2 orta saha) [FIFA-Hirvatistan]. Hırvatistan–Belçika (grup, dakika yok): Modrić'in geri vermesi (lay-off), Brozović'in çevirmesi, Sosa'nın boş kanadı [FIFA-Hirvatistan].
- **Kaynaklar:** [FIFA-3.Adam], [FIFA-Hirvatistan], [FIFA-Gabriele], [Jordet20].

### A9. Duvar pasıyla çıkış (Wall pass / one-two out of pressure)

- **Evre:** kurma → ilerletme.
- **Bağlam ve tetik:** Top taşıyıcısı tek bir presçiyle yakın temasta (0–1 m); aynı hatta bir destek ve presçinin arkasında boşluk var. Gabriele'nin yüksek pres kırma dört adımı: (1) kısa pasa tam hızla göster, rakipleri bağla; (2) arkada açılan boşluğa koş; (3) hızlı, iyi yönlü ara pas; (4) topla birlikte yukarı çıkıp merkezde ya da kanatta üstünlük kur [FIFA-Gabriele].
- **Roller ve hareket:** Pasör verip arkaya koşar; duvar tek dokunuşla geri sektirir; üçüncü oyuncu hat boyunca açılır. Brighton ligde en çok "lay-off" pası yapan takım (baskı altında tek dokunuşla geriye pas) [Sky-DeZerbi]; Everton'a karşı üçüncü gol baskı sürerken yapılan lay-off'tan geldi [Sky-DeZerbi]. Mesafe: pasör–duvar 3–8 m (tahmin).
- **Topun yolu:** Yerden sert, tek dokunuş; ilk pas ön ayağa [FIFA-Gabriele].
- **Zamanlama:** Tüm hareket ~1–2 sn (tahmin); duvarın dokunuşu pas gelmeden ~0,3 sn önce yönü hazırlanır (tahmin). Bağlılık: tek eylem.
- **Başarı ve sıklık:** Oran **bulunamadı**; Opta'da lay-off sayısı Brighton için lig 1.'si [Sky-DeZerbi].
- **Panzehir:** Presçi pasörü değil duvar oyuncusunu gölgeler (pas gölgesi); ikinci presçi duvarın arkasına girer; duvar oyuncusuna sırt pres.
- **Kabiliyet eşiği:** Duvar: tek dokunuş pas (Y), baskı altı sakinlik; pasör: K ("kaç, aç"). Düzey O.
- **Hoca tarzı:** İsviçre U-18'de Gabriele [FIFA-Gabriele]; De Zerbi'nin Brighton'ı [Sky-DeZerbi].
- **Ünlü örnek:** Brighton–Everton 5-1, üçüncü gol (dakika yok) [Sky-DeZerbi].
- **Kaynaklar:** [FIFA-Gabriele], [Sky-DeZerbi].

### A10. Hatlar arasında yarım dönüşle alış ve hat kıran pas (Receiving between the lines on the half-turn; line-breaking pass)

- **Evre:** ilerletme.
- **Bağlam ve tetik:** 6 veya 8 numara, pres hatları arasındaki boşluğa iner; alıcı geri ayakla alıp hızlı dönebilecek açıda durur [FIFA-Oyun-Yuksek-Blok], [FIFA-Ucluler]. Hat kıran pas, ön presin iki oyuncusu arasından geçer; pas "bakışla gizlenir" (hedefe değil başka yöne bak) [FIFA-Oyun-Yuksek-Blok].
- **Roller ve hareket:** Kaleci/stoper alıcıya hat arası pas gönderir; alıcı yarım dönüşle alır, kaleye dönük çıkar; ön hat forvetleri iki stoperi sabitler, hat arası rakiplerin birini çeker (çift pivottan birine adam adama yapılırsa arkası açılır: Fas–İspanya'da İspanya'nın defansif orta sahası ikinci pivotu markaj yapınca forvetler arkasında alan buldu [FIFA-U20-25]). Rakip hattını tutarsa alıcı dönüp sürebilir [FIFA-Oyun-Yuksek-Blok].
- **Topun yolu:** Yerden sert; alıcının ön ayağına değil güçlü ayağına yönlü; ilk dokunuş dönüşü yapar; 1–2 dokunuş.
- **Zamanlama:** Alıştan önceki 10 sn'de ortalama 0,44 tarama/sn, çoğu tarama 0,66 sn'den kısa; ceza sahası merkezine yakın >0,6 tarama/sn [Jordet20], [Jordet13]. Bağlılık: alıcı topu alamazsa 1,5–2 sn içinde ikinci seçenek (tahmin).
- **Başarı ve sıklık:** Tarama–pas isabeti ilişkisi küçük pozitif: tamamlanan paslar öncesi 0,46, tamamlanmayanlar öncesi 0,40 tarama/sn (d=0,15) [Jordet20]; Jordet'in 2013 verisinde Lampard 0,62, Gerrard 0,61 tarama/sn [Jordet13] (arama özeti). Tarama en düşük rakip 0–1 m'deyken, ~4 m'de düzleşir [Jordet20].
- **Panzehir:** Hatlar arasındaki alıcıya arkadan sıkı marke ("geri pres"); orta saha hattını yüksek ve sıkı tutmak; alıcının dönüşünü kesen "kapı".
- **Kabiliyet eşiği:** G (tarama; yüksek: ≥0,5/sn, tahmin eşik; ortalama oyuncu 0,44 [Jordet20]), Y (ilk dokunuş + dönüş), K (pas seçimi). Düzey: Y.
- **Hoca tarzı:** İsviçre/FIFA oturumları [FIFA-Gabriele], [FIFA-Oyun-Yuksek-Blok]; De Zerbi.
- **Ünlü örnek:** İtalya–Meksika, U-20 2019 (dakika yok): Meksika'nın presi yan pas bekleyerek bölünmüştü, İtalyan stoper orta sahaya fırlayıp doğrudan forvete oynadı, yedi rakibi oyun dışı bıraktı [FIFA-KV].
- **Kaynaklar:** [FIFA-Oyun-Yuksek-Blok], [FIFA-Ucluler], [FIFA-U20-25], [FIFA-KV], [Jordet20], [Jordet13].

### A11. Baskı altında oyunu çevirme (Switching play under pressure)

- **Evre:** kurma → ilerletme.
- **Bağlam ve tetik:** Pres, ilk pasın tarafına kayıp o tarafı kapatır; açık tarafta zaman ve alan vardır. FIFA: baskı altında oyunu karşı tarafa çevirmek şarttır; takım kaleciye geri verir, sonra açık tarafa çevirir [FIFA-KV]. Suudi Arabistan–Fransa U-20 2019: pres kenarı kapattı, top kaleciye döndü, açık tarafa çevrildi [FIFA-KV].
- **Roller ve hareket:** Kaleci/stoper yönlendirir; çeviren oyuncu (altı ya da stoper) açık tarafta zaman bulur; orta sahalar iyi ilk dokunuş ve hızlı dönüş gerektirir [FIFA-KV]; bek açık tarafta. Hırvatistan'da Modrić'in dış ayakla çevirmeleri Sosa'yı serbest bıraktı; Brozović yerini boşaltıp Hazard'ı çekince Modrić fazladan dokunuşla çevirdi [FIFA-Hirvatistan]. Mesafe: yatay çevirme 25–45 m (tahmin).
- **Topun yolu:** Yer ya da hafif havadan, orta-uzun; 1–2 dokunuş; çeviren oyuncunun ilk dokunuşu yönlü.
- **Zamanlama:** Pres kayması ~2–3 sn sürer (tahmin); bağlılık: kaleciye geri verilmiş topta çevirme 3 sn içinde (pres tuzağı kapanmadan, tahmin).
- **Başarı ve sıklık:** Oran **bulunamadı**. Vurgu: hepsi kısa pasla oynamak öngörülebilirdir; kısa ve uzun karışımı anahtardır [FIFA-KV].
- **Panzehir:** Presin kaymasını yavaşlatmak, zayıf taraf için geç sıkışan ikinci kuşak ve çevirmeyi kesen orta saha pres (tahmin).
- **Kabiliyet eşiği:** G (açık tarafı görme, 360° tarama), Y (orta-uzun pas isabeti, dış ayak), K (tuzak kapanmadan çevirme). Düzey Y.
- **Hoca tarzı:** Hırvatistan/Dalić [FIFA-Hirvatistan]; kurma ekolleri.
- **Ünlü örnek:** Hırvatistan–Belçika, Katar 2022 (dakika yok): Modrić'in indiği, Brozović'in çevirdiği, Sosa'nın boş kanadı [FIFA-Hirvatistan]. Suudi Arabistan–Fransa, U-20 2019 [FIFA-KV].
- **Kaynaklar:** [FIFA-KV], [FIFA-Hirvatistan].

### A12. Kaçış yolları: çizgi boyu bek ve geri kaleci (Escape outlets: touchline full-back and back-pass to the goalkeeper)

- **Evre:** kurma.
- **Bağlam ve tetik:** Ön ve iç koridor kapalı; takım sıkışmış; tetik: iki presçi bir taşıyıcıyı bağlar. "Çizgi ekstra bir savunmacıdır" [CambioJuego].
- **Roller ve hareket:** Bek dışta, çizgiye yakın kalır ve çıkış olur (Tijuana'nın beki geniş kaldı [CambioJuego]; Sassuolo/Shakhtar'da bekler çizgiye yapışıktı [CoachesVoice]). Kaleci teklif eder: Katar 2022'de (2018'e göre) kalecinin teklifi +%64, aldığı pas +%100 [FIFA-Katar22]; savunmacılar giderek daha çok kaleciye veriyor [Hudl-Trend]. Kaleci gerektiğinde çizgi gerisine çekilir [FIFA-KV].
- **Topun yolu:** Kısa geri/yan pas, 5–15 m (tahmin); kaleciden sonra çevirme ya da uzun.
- **Zamanlama:** Çıkış 1–2 dokunuş; bağlılık: plan yok, refleks (tahmin).
- **Başarı ve sıklık:** Kurtarır ama kenar bir tuzağa dönüşebilir: Juárez, San Luis'in sağ beküne pas yollarını kapatıp uzun pas ya da vuruşa zorladı [CambioJuego]. Oran **bulunamadı**.
- **Panzehir:** Kenara yönlendirme (rakip presi çizgiye iter); kaleciye geri pas sonrası kaleciye pres.
- **Kabiliyet eşiği:** Bek: ilk dokunuş, dış alan (O); kaleci: iki ayaklı sakinlik (Y).
- **Hoca tarzı:** Birçok pozisyon ekolü; Tijuana/Mier modeli [CambioJuego].
- **Ünlü örnek:** Juárez–San Luis (Liga MX; dakika/sezon yok) [CambioJuego]. Hollanda–Paraguay U-17 2019 [FIFA-KV].
- **Kaynaklar:** [CambioJuego], [CoachesVoice], [FIFA-Katar22], [Hudl-Trend], [FIFA-KV].

### A13. Stoperin taşıyarak ilk hattı kırması (Centre-back carry through the first line)

- **Evre:** ilerletme.
- **Bağlam ve tetik:** Rakip ön hat yan pas bekliyor (Meksika'nın presi bölünmüştü) ve stoperin önünde alan açıldı; FIFA: stoperin sürmesi yüksek riskli, ama giderek daha fazla gerekli [FIFA-KV].
- **Roller ve hareket:** Stoper topla orta sahaya fırlar, ilk hattın en az bir oyuncusunu atlar ve diğerlerini çeker; stoperin yeri etkiler: dar stoper forvetleri içe çeker ve kanatları açar, geniş stoper ortayı açar [FIFA-KV]. Mesafe: taşıma 5–15 m (tahmin).
- **Topun yolu:** Taşıma + pas; taşımadan sonra doğrudan forvete ya da hat arasına.
- **Zamanlama:** 1,5–3 sn taşıma; tetik presçinin yan pas bekleyen duruşu (tahmin).
- **Başarı ve sıklık:** Oran **bulunamadı**; İtalya–Meksika örneğinde stoperin taşıması 7 rakibi oyun dışı bıraktı [FIFA-KV].
- **Panzehir:** Taşıyıcıya pres tetiği ("yan pas bekleme" yerine adım at); hat arası kapama.
- **Kabiliyet eşiği:** Y (sürme, hız), K (ne zaman çıkmalı), risk maliyeti yüksek: yalnız Y bandı stoperler (tahmin).
- **Hoca tarzı:** Hücum odaklı kurma ekolleri; Wenger/FIFA "kalıp yok, riski ölç" yaklaşımı [FIFA-KV].
- **Ünlü örnek:** İtalya–Meksika, U-20 2019 [FIFA-KV].
- **Kaynaklar:** [FIFA-KV].

### A14. Kalecinin dağıtım kararı: beş kategori, bekleme süresi, kontra (Goalkeeper distribution decision)

- **Evre:** kurma / geçiş (kaleci topa sahip olduğu her an).
- **Bağlam ve tetik:** Kaleci topu elle ya da ayakla alır; seçim rakibin pres şekline bağlıdır. FIFA beş kategori: (1) çevrele ve destekle (stoper), (2) içinden oyna (orta saha), (3) içine oyna (yüksek bek, hat arası), (4) üstüne oyna (forvet), (5) ötesine oyna (hat arkası); 2-5 presin şekline bağlıdır, presin arkasında alan bırakması seçenekleri yaratır [FIFA-Katar22], [FIFA-KV]. Seçim kriterleri: hedefin hava gücü, eşleşmesi, güçlü ayağı, baskının geleceği yön, boş alana koşmayı sevip sevmediği [FIFA-U17-25]. Presin açısı orta ya da uzun seçenekleri kapatabilir [FIFA-U17-25].
- **Roller ve hareket:** Kaleci topu aldıktan sonra stoperler genişler, altı seçenek olur, hedef hat arasında ya da üstte konumlanır. Kontra: kaleci topu alınca takım ileri koşar; kaleci hızlı oynar.
- **Topun yolu:** Elle yuvarlama/yerden atış, elle uzun atış, voleybol/yarım voleybol vuruşu (dağılım oranları **bulunamadı**). Kaleci uzun vuruşu ≥32 m [PL-Opta25]; kaleci paslarının ≥32 m payı 2014/15'te %79,3, 2023/24'te %46,6 [PL-4Trend].
- **Zamanlama:** Top yakalama–bırakma süresi (PL 2025/26, The Athletic'ten aktaran Daily Cannon): Raya ort. 3,96 sn (15 kaleci daha yavaş), Lammens 7,68 sn, Verbruggen 6,52 sn, Pickford 6,5 sn, diğer yavaşlar ~5–6 sn [DailyCannon] (ikinci el; resmî veri değil). ESPN'in aktardığı ayrı çalışmalar: hızlı kontra <6 sn, meşru gecikme 6–8 sn, kasıtlı vakit geçirme ≥20 sn [ESPN-Deneme]; kural 8 sn [IFAB-8sn]. Bağlılık: kontra fırsatı ~3 sn'lik "pencere" (tahmin) kaçarsa kurmaya dön.
- **Başarı ve sıklık:** Kaleci karışan sekanslar (Opta; sezon belirsiz, muhtemelen 2018/19): 102 şut, 11 gol (yaklaşık lig golünün %5'i); kısa paslı 64 şut/8 gol, uzun paslı 38 şut/3 gol; Ederson 12 şut/golle biten sekansla lig lideri [Sky-Kaleci]. U-17 2025'te kenar oyuncudan ilk pası alan kaleci %54 uzun, %34 orta oynadı [FIFA-U17-25]. Opta'da kaleci pas isabeti PL'de %57 (aynı kaynak, tarihi belirsiz) [Sky-Kaleci].
- **Panzehir:** Pres açısı ve ikinci presçi seçenekleri daraltır; hedef adam adama; hat arasına koşan oyuncuya kapı.
- **Kabiliyet eşiği:** K (karar: FIFA'ya göre kaleci ve savunmacılar giderek daha hızlı, doğru ve iki ayaklı karar vermek zorunda [FIFA-KV]), Y (kısa, orta, uzun menzil), G (pres şekli ve hedefin okunması). Düzey: Y/E; tek ayaklı kaleciler kısa seçenekte kısıtlanır (tahmin).
- **Hoca tarzı:** Kısa kurmacılar (kaleci "oyun kurucu"); doğrudan oynayanlar (kaleci uzun).
- **Ünlü örnek:** Çekya kalecisi Adam Paar (U-17 Dünya Kupası 2025; rakip ve dakika kaynakta yok): doğrudan baskı altında kalıp orta saha oyuncusuna hat kıran pas verdi [FIFA-U17-25]. Avusturya kalecisi Posch'un sahte uzun vuruşu sonrası diyagonal koşuya pası (penaltı) [FIFA-U17-25].
- **Kaynaklar:** [FIFA-KV], [FIFA-Katar22], [FIFA-U17-25], [PL-Opta25], [PL-4Trend], [DailyCannon], [ESPN-Deneme], [IFAB-8sn], [Sky-Kaleci].

### A15. Kale vuruşu yerleşme süresi ve saati (Goal-kick set-up time and restart clock)

- **Evre:** duran top / kurma.
- **Bağlam ve tetik:** Top çizgiyi geçer; takım vuruştan önce yerini alır (FIFA: bu yüzden kural oyunu tam hızlandırmadı) [FIFA-KV]. Skor ve dakika etkiler (öndeki takım yavaşlar, tahmin).
- **Roller ve hareket:** Kaleci topu kale alanı içinde herhangi bir noktaya yerleştirir [IFAB-K16]; takım kurma şeklini, rakip presini alır; hakem gecikmeyi izler. Top toplayıcı ve hakem tutumu süreyi etkiler (tahmin).
- **Topun yolu:** —
- **Zamanlama (gerçek süre):** Opta (PL 2022/23): "top çizgiyi geçtikten oyun yeniden başlayana kadar" süre; kale vuruşunda ort. yaklaşık 29 sn (Alisson'ın 29 sn'si "lig ortalaması civarı"); Newcastle 36 sn, en yakın takımdan 3 sn'den fazla yavaş; taç ort. ~16 sn; top oyunda süresi 54:46 (%55,8) [Analyst-Zaman]. Hayran blogu (Opta veri atfı net değil): Liverpool 21,5, Aston Villa 29,5, Brentford 32,9, Everton 33,1, Newcastle 36,8 sn; Bazunu 43,7 sn (18 vuruş) [MOMS]. **"24–28 sn" iddiası bulunamadı**; kaynaklı değer ~29 sn, takım aralığı 21,5–36,8. Kural: Law 16'da kasıtlı gecikmede hakem 5 sn görsel geri sayım başlatır, süre dolarsa rakibe korner verilir [IFAB-K16]; bu protokolün taç ve kale vuruşuna genişletilmesi 2026 toplantısında onaylandı, kesin yürürlük tarihi kaynaklarda farklı [GhanaTimes]. Etkisi (yeni ortalama süre) **bulunamadı**. Motor için yorum (tahmin): geri sayım bir üst sınır değil, aşırı yavaşlığı kesen bir fren; ortalama ~29 sn'den ne kadar aşağı çekeceği bilinmiyor.
- **Başarı ve sıklık:** "Başarı" yok; süre ve rakip pres oturumu ilişkisi: yavaş vuruş rakibe yerleşme zamanı verir (tahmin). Kaleci elde tutma: 8 sn [IFAB-8sn].
- **Panzehir:** Rakip hızlı vuruşta henüz yerleşmemiş olabilir (kaleci hızlı restart); hakem sayacı yavaşlatmayı sınırlar.
- **Kabiliyet eşiği:** Karar (K): tempo seçimi; hoca/oyun planıyla belirlenir.
- **Hoca tarzı:** Newcastle ~36 sn, Liverpool ~21,5 sn [MOMS], [Analyst-Zaman]; Arsenal (Raya 3,96 sn, hızlı bırakma [DailyCannon]).
- **Ünlü örnek:** Southampton'ın Arsenal'e deplasmanı (Emirates; sezon kaynakta yok, 2022/23 tahmin): Bazunu'nun 18 kale vuruşu toplam 13 dk 6 sn; Brentford–West Ham 2-0'da Raya'nın kale vuruşları toplam 13 dk 29 sn [MOMS].
- **Kaynaklar:** [Analyst-Zaman], [MOMS], [IFAB-K16], [IFAB-8sn], [GhanaTimes], [FIFA-KV], [DailyCannon].

### A16. Rakibin presine göre rutini değiştirme (In-match adaptation: build versus go direct)

- **Evre:** kurma → ilerletme.
- **Bağlam ve tetik:** Kurma sürekli top kaybıyla bitiyor ya da rakip pres şekil değiştiriyor. Ulsan–Dortmund (KDK 2025): ilk yarı sabırlı kurma, 45 dk'da 10 top kaybı, devre arası 0-1; ikinci yarı en az kurma ve uzun toplar, daha çok sorun yarattı [FIFA-CWC25-Pres]. Fas–İspanya (U-20 2025): İspanya önce altıya adam adama, sonra tüm saha adam adama; Fas önce hat kıran pas, sonra uzun pas [FIFA-U20-25]. Zuberbühler: "çeşitlilik, mix, başarının anahtarıdır" [FIFA-KV].
- **Roller ve hareket:** Hoca sinyali ya da kaptan/kaleci değişimiyle takım planlar arasında geçiş yapar; oyuncular rakip yeniden yerleşmeden yeni şekle girer.
- **Topun yolu:** Kısa→kısa'dan kısa→uzuna; uzunlarda ikinci top düzeni (A3).
- **Zamanlama:** Karar ölçütü: son N kurmadan K'sı top kaybıyla bitti (tahmin; Ulsan 45 dk'da 10); uygulama 1–2 kale vuruşunda. Bağlılık: yeni plan en az ~5 dk sürdürülür (tahmin).
- **Başarı ve sıklık:** FIFA: değişen maç içi uyum ve daha doğrudan stil, süregiden presi aşmaya yardım eder [FIFA-CWC25-Pres]. Oran **bulunamadı**.
- **Panzehir:** Rakibin de uyumu (Fas örneğinde İspanya'nın adam adamı): "alanı mı adamı mı savunayım" ikilemi [FIFA-U20-25].
- **Kabiliyet eşiği:** K (plan değiştirme zamanı; hoca ve kaptan), G (rakip şeklini okuma).
- **Hoca tarzı:** Taktik esnek hocalar; Thomas Frank'in "ya yüksek ya derin" ilkesi [AFC-Derin].
- **Ünlü örnek:** Ulsan–Dortmund, KDK 2025 [FIFA-CWC25-Pres]; Fas–İspanya, U-20 2025 [FIFA-U20-25].
- **Kaynaklar:** [FIFA-CWC25-Pres], [FIFA-U20-25], [FIFA-KV], [AFC-Derin].

### A17. Stoper konumlanma genişliği (Centre-back width in build-up)

- **Evre:** kurma.
- **Bağlam ve tetik:** Rakibin ön hattının sayısı ve nereye durduğu (iki ya da üç forvet, kanat forvetleri). FIFA: stoperlerin konumu boşluğun nerede açılacağını belirler: dar duran stoperler forvetleri içe çeker ve kanatları açar; geniş duran stoperler ortayı açar [FIFA-KV].
- **Roller ve hareket:** Brighton'da stoperler kalecinin neredeyse yanına gelip presi davet eder [Halfspaces]; Fas'ta iki stoper kaleciyle aynı hatta 3v2 kurar [FIFA-U20-25]; lavolpiana'da stoperler altıya yer açmak için yana açılır [Fussball-NL]. Pres, ilk pasın tarafına kayıp o tarafı kapatır [FIFA-KV]; stoperin genişliği o kaymanın ne kadar yük bindireceğini belirler. Mesafe: stoper aralığı dar ~10–15 m, geniş ~25–30 m (tahmin).
- **Topun yolu:** Stoper–stoper yatay kısa pas (pres tetiği), stoper–kaleci geri pas; 1–2 dokunuş.
- **Zamanlama:** Genişlik vuruştan önce ayarlanır; ilk presçi sıçrayınca ~1 sn içinde yeniden ayarlanır (tahmin). Bağlılık: bir pres tipine karşı genişlik planı değişmez, pres tipi değişince değişir (A16).
- **Başarı ve sıklık:** Oran **bulunamadı**; nitel: dar stoper kanat boşluğu, geniş stoper merkez boşluğu açar [FIFA-KV].
- **Panzehir:** Forvetlerin stoperlerden uzak durup yatay pas yolunu gölgeleyerek kapaması (pas gölgesi, tahmin); kanat forvetlerin stoper ve bek arasına sıkışması.
- **Kabiliyet eşiği:** G (presçi konumu ve boşluk okuma), K (genişliği seçme), Y (iki ayak). Düzey O+.
- **Hoca tarzı:** De Zerbi (dar stoper, pres daveti) [Halfspaces]; Guardiola (üçlü hat, geniş stoper) [WCC-Pep]; Gabriele (stoper bölünmesi) [FIFA-Oyun-Yuksek-Blok].
- **Ünlü örnek:** Fas–İspanya, U-20 2025 (dakika yok) [FIFA-U20-25].
- **Kaynaklar:** [FIFA-KV], [FIFA-U20-25], [Halfspaces], [Fussball-NL], [WCC-Pep], [FIFA-Oyun-Yuksek-Blok].

## 3. Baskıya dayanıklılık ölçüleri (PPDA, kurmanın bozulması, kendi üçte birinde kayıp)

- **PPDA (Passes Per Defensive Action):** rakibin pas sayısı ÷ savunma eylemlerimiz (müdahale, pas arası, mücadele ve başarısız müdahale, faul); yalnız rakip kaleye en yakın %60'lık bölgede (rakip yarı sahanın tamamı + kendi yarı sahamızın beşte biri) sayılır [PL-PPDA]. Düşük = yoğun pres. Wyscout tanımı biraz farklıdır (faul, kazanılan savunma düellosu, kayarak müdahale) [Wyscout-PPDA]; sağlayıcılar arasında karşılaştırma yapılmaz.
- **Referans değerler:** PL 2021/22: Liverpool 8,62 (ligin en düşüğü), Wolves 14,78, Everton 14,63, Newcastle 14,57; Avrupa top-5: Barcelona 7,26 (en düşük), Troyes/Norwich 16,93 [PL-PPDA]. Top-5 2018/19 sezon ortalaması 11,01 (en düşük Eibar 6,72, en yüksek Nürnberg 18,21) [Wyscout-PPDA]. Guardiola'nın Barcelona'sı 6–9 aralığında [Trainor14]. Brighton 2022/23: 10,3 (lig ikincisi, yönü açık değil) [PL-Clarke].
- **Çekinceler:** Topa çok sahip olan takım (PSG) düşük PPDA gösterebilir; başarısız müdahaleler sayıldığı için düşük PPDA ile oyun içinden geçilmek mümkündür; PPDA şekli ve mesafeyi ölçmez [PL-PPDA]. Tetikle pres yapan takımları yansıtmaz [Trainor14].
- **Baskı altı top kaybı (oyuncu):** Brighton 2023/24 pivotları: Caicedo %4,6 (495 baskılı dokunuş), Mac Allister %7,3, Gross %8,3, Gilmour %6,8 [PL-Brighton]. 2025/26 baskı altı pas isabeti: Caicedo %89,5, Doku %85,8 (Gradient Sports; lig ortalaması verilmemiş) [Football365]. Pres kavramının kendi tanımı (Stats Perform) okunamadı (403).
- **Kendi üçte birinde top kaybı:** doğrudan oran **bulunamadı**. Yakın göstergeler: PL 2019/20'de kısa vuruş sonrası top kayıplarından 42 şut/9 gol yendi (uzun: 34/2) [PL-KV]; Ulsan ilk yarıda 10 top kaybı yaşadı [FIFA-CWC25-Pres]; KDK 2025'te son üçteki top kayıplarından sonraki denemelerin xG'si 0,171 (tüm denemeler 0,139), dönüşüm %11,6 (%11,3) [FIFA-CWC25].
- **Kurmanın bozulma oranı:** kaynaklı sayı **bulunamadı**. Motor için önerilen tanım (tahmin): kale vuruşu ya da kaleci kaynaklı sekansların ilk 3 pas ya da ilk 8 sn içinde kendi 40 m'sinde top kaybıyla bitme oranı.
- **Doğrudanlık göstergeleri (PL, Opta):** lig ort. sekans 10,4 sn ve 12,6 m ilerleme (2024/25) → 9,6 sn ve 12,1 m (2025/26); City sekans başına 5,12 → 3,97 pas; Brentford en doğrudan (2,84), Chelsea en işlenmiş (4,52) [PL-Opta25]. Pas tamamlama (Big-5) %77, 2015/16'da ortalamanın biraz üstünde, bugün 25. persentil civarında; xPass paralel artmış, yani kolay paslar çoğalmış [Hudl-Trend].
- **Seviye farkı (özet):** gençlik ve kulüp turnuvalarında kısa kale vuruşu payı hızla artıyor (U-17 %17→%39; KDK %30→%50) [FIFA-U17-25], [FIFA-CWC25]; PL'de kaleci başına %1–%61 [PL-Kaleci]; Liga MX'te takım başına >%90 uzun ile %73 kısa/orta arası [CambioJuego]. Kurma kalıbı **seviyeden çok takım kimliğiyle** değişir; Süper Lig verisi **bulunamadı**.

## 4. Motor için notlar (ilkellerin kodda temsili)

Bu bölümdeki her şey tasarım önerisidir (tahmin); yalnız bir anahtar yazılı sayılar kaynaklıdır. Adlandırma ve ayar anahtarları (`MOTOR_AYAR` düzeni) uygulayıcıya bırakılmıştır.

1. **Ortak niyet (joint intention).** Her kale vuruşu ve her kurma anı bir "kurma planı" nesnesi taşımalı: `{ilkel, evre, işaret, roller→hedef noktalar, başlangıç saati, bağlılık süresi, çıkış koşulları, yedek plan}`. Plan vuruştan önce (kale vuruşunda ~5 sn'lik hazırlık, sayaç kuralı bunu sınırlar [IFAB-K16]) oyuncu aralığında paylaşılır; roller herkese aynı anda atanır. Oyuncu plana körü körüne uymaz: kabiliyete göre algı hatası, geç tepki ve "plana bağlılık" ayarı olur.
2. **Algı.** Plan işaretleri oyuncunun gördüğüne bağlıdır. Tarama modeli: ortalama 0,44 tarama/sn, elit ~0,6; çoğu tarama 0,66 sn'den kısa; rakip 0–1 m'deyken tarama en düşük, ~4 m'de düzleşir [Jordet20], [Jordet13]. Önerilen kural: baskı mesafesi <1 m ise bilgi güncelleme oranı düşer (kötü karar), >4 m ise tam. Tarama–pas isabeti etkisi küçüktür (d=0,15 [Jordet20]); bu nedenle algı, yürütmeden daha az ağırlıklı bir kabiliyet olmalıdır.
3. **İşaretler (cues).** Pres sayısı ve mesafesi (≥2 presçi vuruşların %40'ında, rakip ~2 m daha yakın [FIFA-CWC25]; İspanya'nın her vuruşta 12,5 m içinde bir oyuncusu [FIFA-U20-25]), pres tipi (ön ikili / üçlü / adam adama / derin blok; sınıflama [AFC-Derin], [FIFA-U20-25]), serbest oyuncu varlığı (3v2, 4v3), kaleci kaynaklı yön, süre/skor.
4. **Bağlılık ve vazgeçme.** Bekleme planı (A7) için sayaç: ~10–15 sn [PL-Brighton]; pres sıçrayınca "çıkış" fazına geçer. Vazgeçme: alıcıya mesafe <1 m ve çıkış hattı yoksa kaleciye geri/çizgi dışı güvenli seçenek (A12), yedek: uzun top (A2/A3). Plan başarı sayacı: son N kurma bozulursa plan değişimi (A16).
5. **Zamanlama.** Koşu ve açılma pastan önce başlar (3. adam, A8; bek içe girişi, A6): tahmin 0,5–1,5 sn. Duvar pası ve hat kıran pasta ilk dokunuş tek temaslıdır. Tüm süreleri oyun içi (gerçek maç) saniyesiyle tanımla ve maç saati ölçeği değişirse oranlar korunsun.
6. **Rakip modeli.** Pres sınıfı: adam odaklı yüksek, ön ikili zonal, orta blok, derin blok, tuzak (çizgi). Her sınıfın panzehir tablosu A1–A17 "Panzehir" alanlarıdır.
7. **Kaleci modeli.** Dağıtım kararı FIFA'nın beş kategorisinden seçilir (çevrele/içinden/içine/üstüne/ötesine) [FIFA-Katar22]; hedef özellikleri (hava, güçlü ayak, eşleşme, pres yönü) puana girer [FIFA-U17-25]. Kaleci +1 ve "zincir" seçenekleri yalnız ayak kabiliyeti eşiğini aşan kalecide açılır [Fussball-NL]. Bırakma süresi ~3–8 sn dağılımı [DailyCannon].
8. **Kural katmanı.** Kale vuruşunda ofsayt yok [IFAB-K11]; rakipler ceza sahası dışında [IFAB-K16]; kaleci elde tutma 8 sn + sayaç [IFAB-8sn]; gecikme sayacı kale vuruşu ve taça genişletildi [IFAB-K16], [GhanaTimes] (yürürlük tarihi netleşene dek ayara bağlı bir anahtar önerilir).
9. **Risk–ödül.** İlkel puanı: P(başarı)·değer − P(top kaybı)·maliyet(bölge). Maliyet en yüksek kendi 40 m'sinde (kısa vuruşta top kaybı: 42 şut/9 gol, uzun: 34/2 [PL-KV]). Ödül: ilerleme (49 m vs 38 m [PL-KV]).
10. **Kabiliyet eşiği matrisi (tahmin).**

| İlkel | G | K | Y | Not |
|---|---|---|---|---|
| A1 kısa-kısa | O | O | Y (kaleci) | kaleci kısa pas %90+; referans %98–99 [Mastermind] |
| A2 kısa→uzun | O | Y | Y | uzun pas yürütmesi |
| A3 doğrudan uzun | O | O | Y (hedef: hava) | HOPS ≥0,65 yüksek [SB-Hedef] |
| A4 kaleci +1 | Y | Y | Y (kaleci ayağı) | eşik altında kapalı |
| A5 lavolpiana | Y | Y | Y (altı) | |
| A6 bek içeri | Y | O | Y | |
| A7 pres yemleme | Y | Y | E | baskı altı kayıp ≤%5–8 [PL-Brighton] |
| A8 3. adam | Y | Y | Y | B tek dokunuş |
| A9 duvar | O | O | Y | |
| A10 hat arası/yarım dönüş | Y | O | Y | tarama ≥0,5/sn (tahmin) [Jordet20] |
| A11 çevirme | Y | Y | Y | |
| A12 kaçış | O | O | O | |
| A13 stoper taşıması | O | Y | Y | |
| A14 kaleci kararı | Y | Y | Y | |
| A15 kale vuruşu saati | D | O | D | tempo; hoca/oyun planı belirler |
| A16 uyum | Y | Y | D | hoca/kaptan düzeyi |
| A17 stoper genişliği | Y | O | O | |

11. **Hoca vektörü.** Her hoca için: kısa payı (ε), yem süresi, risk toleransı, kaleci +1 eşiği, uyum duyarlılığı (A16). Kaynaklı uç değerler: kaleci başına kısa pay %1–%61 [PL-Kaleci]; Brighton ~10–15 sn yem [PL-Brighton]; Arteta sonrası Arsenal çok az kısa [PL-KV]; Liga MX'te Puebla %90+ uzun [CambioJuego]. Nihai değerleri tasarım verir (kaynaklar tek tek hocayı değil takımı ölçer).
12. **Ofsayt yokluğunun uzun top avantajı.** Kale vuruşu uzunlarında koşular vuruş anında başlar ve ofsayt kontrolü yoktur [IFAB-K11]; ancak açık oyun uzun pasında ofsayt geçerlidir. İki durumu ayrı ilkel bağlamı olarak ayır.

### Sayısal çapa tablosu (yalnız kaynaklı değerler; ayarlarda başlangıç noktası, nihai değil)

| Büyüklük | Değer | Kaynak |
|---|---|---|
| Kale vuruşu yeniden başlama süresi (top çizgiyi geçtikten vuruşa) | ort. ~29 sn; takım aralığı 21,5–36,8 sn | [Analyst-Zaman], [MOMS] |
| Kaleci topu elde tutma → bırakma | ortalama 3,3–7,7 sn (kaleciye göre) | [DailyCannon] |
| Elde tutma yasal sınırı | 8 sn + 5 sn sayaç, ceza korner | [IFAB-8sn] |
| Yem için topun üstünde durma | 10–15 sn | [PL-Brighton] |
| Kale vuruşunda presçinin uzaklığı | restart'a ≤12,5 m'de bir oyuncu | [FIFA-U20-25] |
| Presli vuruş payı | ≥2 presçi: %40; presiz: %31 | [FIFA-CWC25] |
| İlk pas sonrası ikinci pas uzunluğu (tüm vuruşlar) | ort. 47,9 m | [UEFA-EURO24] |
| Kısa/uzun vuruşun ort. ilerlemesi | 49 m / 38 m | [PL-KV] |
| Açık oyun sekansının kaleden başlama uzaklığı (Brighton) | 43,8 m | [PL-Clarke] |
| Tarama sıklığı (pas öncesi 10 sn) | ort. 0,44/sn; elit ~0,6/sn; baskı 0–1 m'de en düşük | [Jordet20], [Jordet13] |
| Baskı altı top kaybı oranı (orta saha pivotu) | %4,6–%8,3 | [PL-Brighton] |
| Kaleci başına kısa vuruş payı | %1–%61 (PL 2019/20) | [PL-Kaleci] |
| Hava düellosu: hedef forvet | %40 (75. persentil) – %73 (elit vs ortalama stoper); top tutma %25–%45 | [SB-Hedef] |
| 5 olay içinde taçla biten sekans sayısı (uzun : kısa; ham sayı, normalize değil) | 285 : 46 | [Hudl-Trend] |

## 5. Ölçüler (simüle maçta ilkel göründü mü, başarısı nasıl sayılır)

Hedefler iki türdür: **gerçek referans** (kaynaklı, aralık verilir) ve **motor kabulü** (tahmin; "gerçeğe benzer olma" ölçüsü). 4/10 maçla denge kararı verilmez; 80 maçta okunur (CLAUDE.md kuralı).

- **Kale vuruşu örneklemi.** Maç başına ~9,7 kale vuruşu (Chichester'dan hesap; takım başına ~4,9). Kısa pay: bugünkü takım başı aralık %1–%61 [PL-Kaleci]; turnuva ortalaması %30–%50 (Dünya Kupası 2022 %30, U-17 2025 %39, KDK 2025 %50) [FIFA-U17-25], [FIFA-CWC25]. Kısa tanım: vuruşun bittiği yer kendi kalesine 40 m'den yakın [StatsPerform]. Kabul: her takımın kısa payı hoca vektörüyle uyumlu; lig ortalaması bantta.
- **Sonuç basamakları (kısa→kısa):** son üçte bire giriş %18,1; ceza sahasına %10,4; şut %5,2; gol %1,6; kısa→uzun: %8,6 / %3,6 / %2,8 / %0,7 [Warner]. Kabul: simüle oranlar bu seviyenin 0,5–1,5 katı içinde (tahmin); yön: K→K > K→U.
- **Maliyet:** kısa vuruş sonrası top kaybından yenen şut/gol ve uzun için aynı: PL 2019/20 örneğinde 42/9 ve 34/2 [PL-KV]. Kabul: kısa vuruşta kendi 40 m'sinde top kaybı payı yüksek olmalı, ama yenen gol uzundan çok olmalı.
- **Uzun vuruş:** 5 olay içinde taçla biten sekans sayısı kısa vuruşunkinin ~6 katı (285:46, ham sayı [Hudl-Trend]); vuruş başına oranı kaynaktan çıkarılamaz, motor kendi taç oranını ölçüp "uzun > kısa" yönünü doğrulasın; hedef düello %40–%73 ve top tutma %25–%45 [SB-Hedef]. Kabul: hava düellosu oranı oyuncu kabiliyetiyle değişir.
- **Pres karşılaşması.** ≥2 presçili vuruş payı %23–%40; presiz vuruş %31–%48 (2022 → 2025 değişimi) [FIFA-CWC25]. Motor ayarı: pres sınıfına göre.
- **Yem (A7):** sayım: kurma bölgesinde bir oyuncuda ≥6 sn sabit top; "yem başarılı" = ilk presçi 5 m içine girince 6 sn içinde top ilk pres hattını geçip orta üçe taşınır; "bozulma" = aynı pencerede kendi üçünde kayıp. Kabul: pres gelmeyince bekleme sürelerinin dağılımı 10–15 sn civarında kuyruk içerir [PL-Brighton]; baskı altı top kaybı oyuncu kabiliyetine göre %4–%9 [PL-Brighton].
- **Kaleci süreleri:** bırakma süresi ~3–8 sn, en uzun ortalamalar ~7,7 sn [DailyCannon]; elde tutma 8 sn'yi aşamaz [IFAB-8sn]. Kale vuruşu saati: ort. ~29 sn, takım bandı 21,5–36,8 sn [Analyst-Zaman], [MOMS].
- **Kaleci dağıtım kategorileri:** beş kategorinin payları ölçülür; Katar 2022'de çevrele/destekle +%12, üstüne oyna −%15 (2018'e göre) [FIFA-Katar22]. Kabul: pres tipine göre kategori kayması gerçekleşmeli.
- **3. adam / duvar / hat kıran pas (A8–A10):** olay sayısı ve başarı **gerçek oranı bulunamadı**; yalnız ilişkisel kabuller: tarama–pas isabeti küçük pozitif [Jordet20]. Kabul: bir maçta 3. adam kombinasyonu, çok kabiliyetli takımda yaklaşık olarak "görünür" (maç başına 3–10, tahmin) ve baskı altında çalışmasının kabiliyetle ölçeklendiğini gösterir.
- **PPDA kalibrasyonu:** rakip presini 6–17 PPDA aralığında sınıflandır (yoğun <9, orta 9–13, düşük >13; eşikler tahmin; aralık [PL-PPDA], [Wyscout-PPDA]'den). Takımın karşılaştığı PPDA ile kurma başarısı arasında ters ilişki beklenir (tahmin).
- **Doğrudanlık:** sekans başına pas ve yukarı doğru hız; hedef bant: 2,8–5,1 pas/sekans ve 1,4–2,0 m/sn [PL-Opta25].
- **Kabiliyet ölçekleme sınaması.** Aynı sahne iki takımla (E vs D) oynatılınca: kısa→kısa son üçte bir girişi E'de belirgin yüksek, D'de A3 ya da A12'ye yönelme; kaleci +1 yalnız eşiği geçen kalecide. 80 maçlık karşılaştırmada `p-tip` kapısına benzer bir duyarlılık satırı (tahmin).

## 6. Bulunamayanlar ve sınırlar

- **Süper Lig**: kale vuruşu payı, PPDA, kurma verisi için güvenilir kaynak çıkmadı (tez ve haberler kurtarış yüzdelerine odaklı). Bundesliga, La Liga, Serie A için kale vuruşu payı **bulunamadı**.
- **"24–28 sn" kale vuruşu süresi**: kaynakla doğrulanamadı; kaynaklı değer ~29 sn (PL 2022/23) [Analyst-Zaman]. 2026 sayacının süreye etkisi **bulunamadı**; kesin yürürlük tarihi kaynaklarda tutarsız [GhanaTimes].
- **Kurmanın bozulma oranı, kendi üçte birinde top kaybı oranı, lavolpiana/3. adam/duvar pası başarı oranları**: kaynaklı sayı **bulunamadı**.
- **PFF "baskı altı pas" makalesi** ve **Stats Perform baskı tanımı** sayfaları açılmadı (404/403). Spielverlagerung, The Athletic ve Coaches' Voice'un lavolpiana/De Zerbi derinlikleri (403 ya da arama bütçesi) okunamadı; Barcelona 2011 örneği Spielverlagerung makalesinden alındı.
- **EURO 2024 teknik raporu** PDF 10 MB sınırını aştığı için içeriği okunamadı; 47,9 m değeri arama özetinden.
- **Chichester tezi**: yayımlanmamış, tek yüksek lisans çalışması, sezonun ilk ~292 maçı; kısa/uzun tanımı ve "gol 1,6" biriminin "%" olduğu varsayımı kaynakta net değil. Tek başına denge kararı için kullanılmamalı; yön göstergesi olarak düşük ağırlık verin.
- **Sky Sports kaleci makalesi**: sayfa tarihi 17 Nisan 2020, ancak metin "bu sezon" der ve 2018/19'a uyar; sezon belirsizdir, oranlar bu yüzden "bilgi" statüsündedir.
- **Daily Cannon/The Athletic kaleci süreleri**: ikinci el; The Athletic'in kendi sayfası okunmadı.
- **Hayran blogu (MOMS) kale vuruşu süreleri**: veri kaynağı yazıda açık değil ve süre tanımı biçimsel değil; yalnız büyüklük mertebesi için.
- **Brentford makalesi** sezonu belirtmiyor; metindeki kaleci adlarına göre 2024/25 olduğu **tahmin**.
- **LJMU (BASES 2024) özeti**: 2022/23 PL'de 2.136 kale vuruşu sekansını inceleyen çalışma planı; sonuçsuz bir özet [LJMU]. Sonuçları yayımlandıysa bu bölüme eklenmeli.

## Kaynak dizini

Güvenilirlik: **Y** yüksek (resmî/FIFA/veri sağlayıcı), **O** orta (analiz yazısı, tek çalışma), **D** düşük (blog, ikinci el, arama özeti).

- [IFAB-K16]: IFAB, Law 16 The Goal Kick — https://www.theifab.com/laws/latest/the-goal-kick/ (Y)
- [IFAB-K11]: IFAB, Law 11 Offside, §11.3 — https://www.theifab.com/laws/latest/offside/ (Y)
- [IFAB-8sn]: IFAB, kaleci vakit geçirme haberi — https://www.theifab.com/news/the-ifab-tackles-goalkeeper-time-wasting (Y)
- [ESPN-Deneme]: ESPN, deneme verileri — https://global.espn.com/football/story/_/id/44068077/corners-given-combat-gk-wasting-refs-body-says (O)
- [PL-Deneme]: Premier League, IFAB deneme sayfası — https://www.premierleague.com/news/4079191 (O)
- [GhanaTimes]: Ghanaian Times, IFAB 2026 kararları (ikinci el; resmî metin okunamadı) — https://ghanaiantimes.com.gh/ifab-approves-new-rules-to-curb-time-wasting/ (D)
- [FIFA-KV]: FIFA Training Centre, Game Insights Ep.1 "Building from goal kicks" — https://www.fifatrainingcentre.com/en/game/game-insights/building-from-goal-kicks.php (Y)
- [FIFA-Katar22]: FIFA Insight Ep.3, kaleci dağıtımı Katar 2022 — https://www.fifatrainingcentre.com/en/fwc2022/fifa-insight/fifa-insight-ep03.php (Y)
- [FIFA-CWC25]: FIFA TC, KDK 2025 yüksek pres kullanımı — https://www.fifatrainingcentre.com/en/game/tournaments/fcwc/2025/team-analyses/increased-use-of-high-press-and-pressing-strategies.php (Y)
- [FIFA-CWC25-Pres]: FIFA TC, KDK 2025 TSG yuvarlak masa, presi aşma — https://www.fifatrainingcentre.com/en/game/tournaments/fcwc/2025/team-analyses/tsg-roundtable-analysing-solutions-against-teams-that-press-high.php (Y)
- [FIFA-U17-25]: FIFA TC, U-17 DK 2025 kısa kale vuruşları — https://www.fifatrainingcentre.com/en/game/tournaments/fu17wc/2025/short-goal-kicks-by-outfielders-and-long-passes.php (Y)
- [FIFA-U20-25]: FIFA TC, Fas (1-4-3-3 kurma) – İspanya (1-4-2-2 pres), U-20 DK 2025 — http://www.fifatrainingcentre.com/en/game/tournaments/fu20wc/2025/morocco-1-4-3-3-build-up-v-spain-1-4-2-2-high-press.php (Y)
- [FIFA-3.Adam]: FIFA TC, üçüncü oyuncu kombinasyonları — https://fifatrainingcentre.com/en/game/game-analysis/in-possession/third-player-combinations.php (Y)
- [FIFA-Hirvatistan]: FIFA TC, Hırvatistan'ın evrilen 3. oyuncu kombinasyonları — https://www.fifatrainingcentre.com/en/game/game-analysis/world-class-tactics/croatia-evolving-third-player-combinations.php (Y)
- [FIFA-Oyun-Yuksek-Blok]: FIFA TC oturum, yüksek bloğa karşı kurma — https://www.fifatrainingcentre.com/en/practice/talent-coach-programme/build-and-progress/possession-game-building-against-a-high-block.php (Y)
- [FIFA-Ucluler]: FIFA TC oturum, üçüncüler boyunca ilerleme — https://www.fifatrainingcentre.com/en/practice/talent-coach-programme/build-and-progress/progressing-through-the-thirds.php (Y)
- [FIFA-Gabriele]: FIFA TC, F. Gabriele (İsviçre U-18) "Playing out from the back" — https://www.fifatrainingcentre.com/en/practice/elite-sessions/in-possession/gabriele-playing-out-from-the-back.php (Y)
- [PL-KV]: Premier League, "Season trends: New goal-kick law offering risks and rewards" — https://www.premierleague.com/news/1657509 (O)
- [PL-Kaleci]: Premier League, kaleci kısa vuruş tabloları (2019/20) — https://www.premierleague.com/news/1657831 (O)
- [PL-4Trend]: Premier League/Opta Analyst, dört taktik eğilim — https://www.premierleague.com/en/news/4407434/analysis-four-tactical-trends-redefining-the-premier-league (O)
- [PL-Opta25]: Premier League/Opta Analyst, uzun toplar ve taçlar 2025/26 — https://www.premierleague.com/en/news/4426039/opta-analyst-on-long-balls-long-throws-key-tactical-trends-spotted-in-2025-26-season (O)
- [PL-PPDA]: Premier League, "Passes per defensive action: explained" — https://www.premierleague.com/en/news/4250153 (O)
- [PL-Brighton]: Premier League, Brighton ve baskı altı top kaybı/pausa — https://premierleague.com/news/3906870 (O)
- [PL-Clarke]: Premier League, Adrian Clarke "Talking Tactics" (2 Mayıs 2023) — https://www.premierleague.com/news/3253465 (O)
- [Warner]: Warner (2020), MSc tezi, Chichester Üniversitesi — https://eprints.chi.ac.uk/id/eprint/5522/ (O; yayımlanmamış)
- [StatsPerform]: Stats Perform, kale vuruşu analizi (%28→%40; arama özeti, sayfa 403) — https://www.statsperform.com/?p=16329 (D)
- [Hudl-Trend]: Hudl StatsBomb, "How football is changing" — https://www.hudl.com/blog/how-football-is-changing (O)
- [Trainor14]: C. Trainor, Hudl StatsBomb, PPDA (2014) — https://www.hudl.com/blog/defensive-metrics-measuring-the-intensity-of-a-high-press (O)
- [Wyscout-PPDA]: Wyscout veri sözlüğü, PPDA — https://dataglossary.wyscout.com/ppda/ (Y)
- [HumMov]: Hum. Mov. 2023;24(3):64–70, EURO 2020 kale vuruşu stratejisi — https://hummov.awf.wroc.pl/Association-between-goal-kick-strategies-and-the-offensive-outcome-in-the-UEFA-Euro,158845,0,2.html (Y)
- [UEFA-EURO24]: UEFA EURO 2024 grup aşaması teknik gözlemci raporu (arama özeti) — https://www.uefa.com/uefaeuro/history/news/028e-1b3f9d965e00-3ec1a6f8adb9-1000--euro-2024-group-stage-uefa-technical-observers-tactical-r/ (O)
- [SB-Hedef]: StatsBomb, "Death of a Target Man" — https://blogarchive.statsbomb.com/articles/soccer/death-of-a-target-man-exploring-the-efficiency-of-route-one-football/ (O)
- [Brentford]: Brentford FC analiz yazısı — https://www.brentfordfc.com/en/news/article/analysis-brentford-tactical-evolution-adding-layers-premier-league-review (O)
- [Sky-Kaleci]: Sky Sports, PL kaleci pas stilleri — https://www.skysports.com/football/news/11661/11523344/premier-league-goalkeepers-assessed-for-passing-style-and-goal-involvement (O; tarihi belirsiz)
- [Sky-DeZerbi]: Sky Sports, De Zerbi/Brighton — https://www.skysports.com/football/news/12040/12810847/roberto-de-zerbis-brighton-tactics-explained-provoking-the-opposition-press-by-becoming-the-possession-kings (O)
- [AFC-Zamanlama]: AnalyticsFC, "Timing is everything: De Zerbi's Brighton" — https://analyticsfc.co.uk/blog/2023/05/27/timing-is-everything-de-zerbis-brighton/ (O)
- [AFC-Derin]: AnalyticsFC, "Should you sit deep against Brighton?" — https://analyticsfc.co.uk/blog/2023/10/16/should-you-sit-deep-against-brighton/ (O)
- [Halfspaces]: Halfspaces, "Brighton under De Zerbi" — https://halfspaces.substack.com/p/brighton-under-de-zerbi-high-risk (D)
- [Mastermind]: The Mastermind Site, De Zerbi/Brighton — https://themastermindsite.com/2022/12/29/roberto-de-zerbi-brighton-tactical-analysis/ (D)
- [CoachesVoice]: Coaches' Voice, De Zerbi kurma ilkeleri — https://learning.coachesvoice.com/?p=59417 (O)
- [Spielv-2011]: Spielverlagerung, 2011 CL finali Barcelona–Manchester United 3-1 — https://spielverlagerung.com/2015/12/24/2011-cl-final-fc-barcelona-manchester-united-31/ (O)
- [WCC-Pep]: D. Carvalho, WorldClassCoaching, "Build from the back the Guardiola way" — https://worldclasscoaching.com/build-from-the-back-the-guardiola-way/ (D)
- [Fussball-NL]: Fussball Coaches bülteni, düşen orta saha ve kaleci zinciri — https://fussballs-newsletter-4ebdfb.beehiiv.com/p/dropping-six-diagonal-pushout-goalkeeper-chain (D)
- [CambioJuego]: Cambio de Juego, Liga MX kale vuruşları — https://cambiodejuegoenglish.beehiiv.com/p/how-do-teams-build-up-from-the-back (D)
- [DailyCannon]: Daily Cannon, Raya bırakma süresi (The Athletic'e atıf, Mart 2026) — https://dailycannon.com/2026/03/arsenal-keeper-restarts/ (D)
- [Analyst-Zaman]: Opta Analyst, "Guide to Premier League time-wasting" (2022/23) — https://theanalyst.com/eu/2023/04/guide-to-premier-league-time-wasting/ (Y)
- [MOMS]: MOMS Podcast/Aston Villa blogu, kale vuruşu süreleri (29 Nisan 2023) — https://myoldmansaid.com/?p=60154 (D)
- [Jordet20]: Jordet ve diğ., Frontiers in Psychology (2020), tarama sıklığı — https://pmc.ncbi.nlm.nih.gov/articles/PMC7573254 (Y)
- [Jordet13]: Jordet ve diğ., Sloan Sports Analytics (2013) — https://sloansportsconference.com/research-papers/the-hidden-foundation-of-field-vision-in-english-premier-league-epl-soccer-players (O; Lampard/Gerrard değerleri arama özetinden)
- [Football365]: Football365/Gradient Sports, baskı altı pas (29 Ocak 2026) — https://www.football365.com/news/premier-league-stats-pressurised-passes-wharton-anderson-man-utd (D)
- [SI-Ederson]: Sports Illustrated, Guardiola/Ederson uzun vuruş (2017; arama özeti) — https://www.si.com/soccer/2017/07/30/guardiola-praises-man-city-goalkeeper-edersons-exceptionally-long-goal-kicks (D)
- [LJMU]: Torkornoo (LJMU), BASES 2024 özeti — https://journals.northumbria.ac.uk/index.php/gjsscmr/article/view/1494 (O; sonuçsuz)

## Bağlantı tanımları (köşeli anahtarların hedefleri)

[IFAB-K16]: https://www.theifab.com/laws/latest/the-goal-kick/
[IFAB-K11]: https://www.theifab.com/laws/latest/offside/
[IFAB-8sn]: https://www.theifab.com/news/the-ifab-tackles-goalkeeper-time-wasting
[ESPN-Deneme]: https://global.espn.com/football/story/_/id/44068077/corners-given-combat-gk-wasting-refs-body-says
[PL-Deneme]: https://www.premierleague.com/news/4079191
[GhanaTimes]: https://ghanaiantimes.com.gh/ifab-approves-new-rules-to-curb-time-wasting/
[FIFA-KV]: https://www.fifatrainingcentre.com/en/game/game-insights/building-from-goal-kicks.php
[FIFA-Katar22]: https://www.fifatrainingcentre.com/en/fwc2022/fifa-insight/fifa-insight-ep03.php
[FIFA-CWC25]: https://www.fifatrainingcentre.com/en/game/tournaments/fcwc/2025/team-analyses/increased-use-of-high-press-and-pressing-strategies.php
[FIFA-CWC25-Pres]: https://www.fifatrainingcentre.com/en/game/tournaments/fcwc/2025/team-analyses/tsg-roundtable-analysing-solutions-against-teams-that-press-high.php
[FIFA-U17-25]: https://www.fifatrainingcentre.com/en/game/tournaments/fu17wc/2025/short-goal-kicks-by-outfielders-and-long-passes.php
[FIFA-U20-25]: http://www.fifatrainingcentre.com/en/game/tournaments/fu20wc/2025/morocco-1-4-3-3-build-up-v-spain-1-4-2-2-high-press.php
[FIFA-3.Adam]: https://fifatrainingcentre.com/en/game/game-analysis/in-possession/third-player-combinations.php
[FIFA-Hirvatistan]: https://www.fifatrainingcentre.com/en/game/game-analysis/world-class-tactics/croatia-evolving-third-player-combinations.php
[FIFA-Oyun-Yuksek-Blok]: https://www.fifatrainingcentre.com/en/practice/talent-coach-programme/build-and-progress/possession-game-building-against-a-high-block.php
[FIFA-Ucluler]: https://www.fifatrainingcentre.com/en/practice/talent-coach-programme/build-and-progress/progressing-through-the-thirds.php
[FIFA-Gabriele]: https://www.fifatrainingcentre.com/en/practice/elite-sessions/in-possession/gabriele-playing-out-from-the-back.php
[PL-KV]: https://www.premierleague.com/news/1657509
[PL-Kaleci]: https://www.premierleague.com/news/1657831
[PL-4Trend]: https://www.premierleague.com/en/news/4407434/analysis-four-tactical-trends-redefining-the-premier-league
[PL-Opta25]: https://www.premierleague.com/en/news/4426039/opta-analyst-on-long-balls-long-throws-key-tactical-trends-spotted-in-2025-26-season
[PL-PPDA]: https://www.premierleague.com/en/news/4250153
[PL-Brighton]: https://premierleague.com/news/3906870
[PL-Clarke]: https://www.premierleague.com/news/3253465
[Warner]: https://eprints.chi.ac.uk/id/eprint/5522/
[StatsPerform]: https://www.statsperform.com/?p=16329
[Hudl-Trend]: https://www.hudl.com/blog/how-football-is-changing
[Trainor14]: https://www.hudl.com/blog/defensive-metrics-measuring-the-intensity-of-a-high-press
[Wyscout-PPDA]: https://dataglossary.wyscout.com/ppda/
[HumMov]: https://hummov.awf.wroc.pl/Association-between-goal-kick-strategies-and-the-offensive-outcome-in-the-UEFA-Euro,158845,0,2.html
[UEFA-EURO24]: https://www.uefa.com/uefaeuro/history/news/028e-1b3f9d965e00-3ec1a6f8adb9-1000--euro-2024-group-stage-uefa-technical-observers-tactical-r/
[SB-Hedef]: https://blogarchive.statsbomb.com/articles/soccer/death-of-a-target-man-exploring-the-efficiency-of-route-one-football/
[Brentford]: https://www.brentfordfc.com/en/news/article/analysis-brentford-tactical-evolution-adding-layers-premier-league-review
[Sky-Kaleci]: https://www.skysports.com/football/news/11661/11523344/premier-league-goalkeepers-assessed-for-passing-style-and-goal-involvement
[Sky-DeZerbi]: https://www.skysports.com/football/news/12040/12810847/roberto-de-zerbis-brighton-tactics-explained-provoking-the-opposition-press-by-becoming-the-possession-kings
[AFC-Zamanlama]: https://analyticsfc.co.uk/blog/2023/05/27/timing-is-everything-de-zerbis-brighton/
[AFC-Derin]: https://analyticsfc.co.uk/blog/2023/10/16/should-you-sit-deep-against-brighton/
[Halfspaces]: https://halfspaces.substack.com/p/brighton-under-de-zerbi-high-risk
[Mastermind]: https://themastermindsite.com/2022/12/29/roberto-de-zerbi-brighton-tactical-analysis/
[CoachesVoice]: https://learning.coachesvoice.com/?p=59417
[Spielv-2011]: https://spielverlagerung.com/2015/12/24/2011-cl-final-fc-barcelona-manchester-united-31/
[WCC-Pep]: https://worldclasscoaching.com/build-from-the-back-the-guardiola-way/
[Fussball-NL]: https://fussballs-newsletter-4ebdfb.beehiiv.com/p/dropping-six-diagonal-pushout-goalkeeper-chain
[CambioJuego]: https://cambiodejuegoenglish.beehiiv.com/p/how-do-teams-build-up-from-the-back
[DailyCannon]: https://dailycannon.com/2026/03/arsenal-keeper-restarts/
[Analyst-Zaman]: https://theanalyst.com/eu/2023/04/guide-to-premier-league-time-wasting/
[MOMS]: https://myoldmansaid.com/?p=60154
[Jordet20]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7573254
[Jordet13]: https://sloansportsconference.com/research-papers/the-hidden-foundation-of-field-vision-in-english-premier-league-epl-soccer-players
[Football365]: https://www.football365.com/news/premier-league-stats-pressurised-passes-wharton-anderson-man-utd
[SI-Ederson]: https://www.si.com/soccer/2017/07/30/guardiola-praises-man-city-goalkeeper-edersons-exceptionally-long-goal-kicks
[LJMU]: https://journals.northumbria.ac.uk/index.php/gjsscmr/article/view/1494
