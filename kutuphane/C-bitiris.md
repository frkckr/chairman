# BÖLÜM C — BİTİRİŞ KÜTÜPHANESİ (Finishing)

Amaç: motorun "ilkel × bağlam × rol" diliyle çalıştırabileceği, ezbersiz bir bitiriş (şut, kafa, penaltı) bilgi tabanı. Kurallar bugünün kurallarıdır (VAR dahil); yalnız görüntü retrodur. Bölüm, oyuncunun *görme / seçme / yapma* kabiliyetiyle ve hocanın şut politikasıyla ölçeklenecek karar kurallarını, gerçek sayıları ve çizime gereken poz bilgisini verir. Üst belge: [FUTBOL_KUTUPHANESI.md](../FUTBOL_KUTUPHANESI.md) §5; duran top ve penaltı sahnesi [F-duran-toplar.md](F-duran-toplar.md) F.2/F.4; ünlü örnekler [H-unlu-ornekler.md](H-unlu-ornekler.md); veri ve lisans [I-veri-ve-kaynaklar.md](I-veri-ve-kaynaklar.md).

## 0. Okuma kılavuzu ve kaynak durumu

**İşaretler (her sayısal iddia birini taşır):**
- `[Kn]` = o sayfa/belge bu oturumda doğrudan okundu; bağlantı en alttaki "Kaynaklar"dadır.
- `(hesap)` = kaynaklı sayılardan yapılan hesap (hesap açıkça yazılı).
- `(tahmin)` = tahmin / tasarım önerisi: kaynaksızdır, motor kalibrasyonunda ilk değerdir, kanıt değildir.
- `(bulunamadı)` = bulunamadı.
- `(genel bilgi)` = genel bilgi (ünlü örnek vb.), bu oturumda kaynağa bağlanamadı; kesin saymadan önce doğrulanmalı.

**Çapraz başvurular.** "H.1", "H.3", "H.4" = [H-unlu-ornekler.md](H-unlu-ornekler.md) bölümleri; "F.2", "F.4" = [F-duran-toplar.md](F-duran-toplar.md); "B.13" = [B-ilerletme.md](B-ilerletme.md); "I §…" = [I-veri-ve-kaynaklar.md](I-veri-ve-kaynaklar.md); "H kabulü" = H'deki sınav sahnesinin kabul ölçütü. Bunlar başka araştırma oturumlarının yazdığı belgelerdir; buradaki sayılar o belgelerden devralınmadı, yalnız ünlü örnekler ve sahne kabulleri ödünç anılır.

**Kaynak durumu (dürüst not).** Çalışma sırasında ortak WebSearch kotası tükendi, sonra kısa bir süre açıldı (yaklaşık on arama); çoğu veri doğrudan sayfa okumayla (WebFetch) toplandı. Sonuçlar: (a) vole, yarım vole, aşırtma, topuk, dürtme, bacak arası gibi **tür düzeyinde** Opta/StatsBomb dönüşüm oranları ve lig geneli büyük-fırsat/bire bir dönüşümü **bulunamadı**; (b) "gol tekniği payları" için yalnız üç turnuva/ŞL çalışması bulundu (1.7); (c) bazı birincil kaynaklara erişilemedi (PubMed Central tarayıcı doğrulamasına takıldı; tandfonline, AEA, Stats Perform, MDPI, Guardian, FIFA Training Centre 403/404 verdi) — bu yüzden Lees ve ark. 2010 biyomekanik derlemesi, Palacios-Huerta penaltı matrisi ve Almeida ve ark. 2016'nın özgün makalesi **okunamadı** (Almeida sayıları ikincil bir yazıdan alındı); (d) StatsBomb blog arşivi, Opta Analyst, American Soccer Analysis (ASA), Analytics FC, arXiv, JSSM, ISBS bildirileri, Frontiers, Premier League'in resmî penaltı tablosu, IFAB Kural 14 ve (yalnız yönlendirme için, ikincil) Vikipedi okundu. Bölüm sonundaki "Boşluklar ve takip aramaları" kota yenilenince çalıştırılacak sorguları listeler.

**Arama özeti ≠ kaynak.** Arama motoru özetleri ayrıntıyı karıştırabiliyor: ör. "250 penaltı, %62,8 gol" ifadesinin kaynağı doğrulanamadı (kullanılmadı); "311" ve "286" aynı çalışmanın sayıları çıktı (Bar-Eli ve ark.: 311 vuruş izlendi, çerçeve dışı 18 ve belirsiz 7 vuruş atılınca 286 analiz edildi), White & O'Donoghue'nun 286 penaltısı ise 2009–10'a ait ayrı bir veridir. Bu bölümde yalnız sayfası/PDF'i okunan sayılar kullanıldı; kalan her sayı `(tahmin)`, `(hesap)` ya da `(genel bilgi)` etiketlidir.

**Lisans ve kullanım notu (I §2.1, FUTBOL_KUTUPHANESI §9).** StatsBomb/Hudl açık verisi ticari kullanıma kapalıdır; bu bölümde StatsBomb blog yazılarındaki ve açık verisinden türetilmiş yayımlanmış sayılar ([K10] [K12] [K13] [K31]) yalnız **okunan hedef değer** olarak anılır. Ürüne giren dağılım tabloları Wyscout/Pappalardo (CC BY 4.0: şut olaylarında vücut parçası ve kale ağzı bölgesi etiketleri var (hafızadan — I §3.1 tablosu; etiket sözlüğü figshare'den doğrulanmalı)), IDSSE ve SkillCorner'dan üretilmelidir.

## 1. Ortak zemin (her türün başvurduğu sayılar)

### 1.1 Şut → gol referansları
| Ölçü | Değer | Not | Kaynak |
|---|---|---|---|
| Açık oyun şutunun gol olma oranı | ≈ %10; tüm veri %11,2 (101.227 şut, 11.328 gol) | StatsBomb açık veri, 80 sezon/24 turnuva (DK, Euro, ŞL, La Liga, PL, kadınlar dahil) | [K31] |
| Ortalama xG / medyan | 0,098 / 0,0526; şutların ≈ %70'i 0,10'un altında | ASA modeli, ≈ 375.000 şut | [K24] |
| 2002 Dünya Kupası | 930 şut → 93 gol (≈ %10) | Ensum ve ark. verisi (ikincil aktarım) | [K45] |
| Uzak mesafe tipik şut | ≈ 0,03 xG (≈ 33 şutta 1 gol) | | [K12] |
| Yakın mesafe, kaleciyle bire bir | **en az 0,40 xG** | "koşan oyuncuya pas → bire bir"; uzak şuta göre 13,3 kat | [K12] |
| "Mavi/siyah çizgi" | normal ayak şutunda %11 ve %6 dönüşüm eşikleri | eğitim sahası çizgileri | [K12] |
| 7 m (8 yd) civarı | dönüşüm "neredeyse kesin"den ≈ %50'ye düşer; 8 yd yarım dairesinde %10–30; ötesi tek hane | uzak mesafede seçilim yanlılığı: bazı 40 m+ şutlar yakından daha iyi dönüşüyor | [K31] |
| Penaltı xG | 0,79 (Opta); 0,78 (Opta Analyst PL yazısı); ≈ 0,77 (ASA kümesi); açık veride %74 | modeller kendi geçmiş oranlarına sabitler | [K23] [K24] [K31] [K47] |
| Penaltı kadar kolay penaltısız şut | PL 2023/24'te xG ≥ 0,78 olan penaltısız şut 81 / 10.189 (%0,8) | | [K47] |
| Altı pas içi (6 yd) | şut %40, kafa < %25 | Big-5, 2012–13 civarı; payda büyük olasılıkla girişim (aşağıdaki not) | [K10] |
| Ceza sahası yan konumları | ≈ %5,6 dönüşüm (alıntı), orta ≈ %5 (kutu içi) | karar modelinin varsayımı | [K21] |
| İsabetli şut payı | şutların ≈ %33'ü, kafaların ≈ %34'ü kaleye gider | Big-5, 2012–13 civarı | [K10] |
| Blok | şutlar kafalardan ≈ 3 kat sık bloklanır | sayı verilmemiş | [K10] |
| Şut/gol ölçütü | ≈ 2 isabetli şut / gol (Wenger); Hollanda 1,6, Polonya 2, Almanya ≈ 4 şut/gol, Belgika 11 | Katar 2022 grup aşaması | [K33] |
| Premier League şut dönüşümü | 2022/23 %11,3 (9.609 şutta 1.084 gol); 2023/24 (Mart) %11,9 (rekor); maç başına şut 27,2, kutu içinde 18,4 / dışında 9,0; ortalama şut mesafesi 14,9 m; kafayla şut 4,0 / maç | Opta | [K58] |
| Golden Zone (kale sahası genişliğinde şerit) | şutların ≈ %50'si, gollerin %82'si; Golden Zone'a geri çevirmede dönüşüm %25 | Analytics FC | [K50] |
| Zone 17 (kutu merkezi) | açık oyun + duran top gollerinin ≈ %82'si; Zone 17'ye 100 pasta gol: ara pası 13,2, geri çevirme 6,4, ilerletici 4,5, normal 4,1, orta ≈ 2,5 ("40 denemede 1" aktarımından hesap) | ASA | [K51] |
| Son pas türüne göre şut değeri | ara pasından şut ortalama ≈ 0,30 xG (0,05–0,5), ikincil anahtar pas olarak %40 gol; ilerletici %20, orta %14, geri çevirme %14; geri çevirme maçta 1,56, %32 tamamlanır, tamamlananın %25'i şuta döner | ASA, 6 lig | [K49] [K51] |
| Opta "büyük fırsat" | "makul biçimde gol beklenen durum; genellikle bire bir ya da çok yakın, önü açık, düşük–orta baskı"; penaltılar her zaman büyük fırsat; şutlar vücut parçasına göre (sağ/sol ayak, kafa, diğer) kayıtlı | tanım | [K48] |
| En yüksek top hızları | maksimal ayak üstü vuruş 18–35 m/sn; 1990 DK'da 32–35 m/sn gözlenmiş | | [K27] |

*Not (kafa/şut payı):* [K10] "12% v 9%" oranlarını "isabetli girişimlerden" diye anlatıyor; ama şutların ≈ %33'ü isabetli ve genel dönüşüm ≈ %9–10 olduğundan bu oranlar sayısal olarak **girişim başına gol** gibi okunur. Kaynağın dili belirsiz (tahmin).

### 1.2 Köşe/merkez farkı (xGOT mantığı)
- **Merkez ve köşe:** isabetli şutlarda tam ortaya gelenin dönüşümü ≈ %12, köşelere ≥ %50 (2012–13 verisi; kaynak "isabetli şut"u tartışıyor, payda açıkça yazılmamış) [K13]. Açık veride sol yarıya ve sağ yarıya yönelen şutlar ≈ %30'ar gol oldu; yazarın özeti: "köşe merkezi yener, alçak yükseği yener, yakın uzağı yener" [K31].
- **Post-shot modelleri:** Opta xGOT, şutun xG'sine ek olarak kale ağzındaki varış noktasını ve kale görünür açısıyla etkileşimini kullanır; şut hızı kullanmaz [K22]. StatsBomb PS xG, şutun yörüngesini, hızını ve kaleye giriş noktasını (y,z; "çoğunlukla en önemli etken") kullanır, kaleci bilgisi kullanmaz [K15] [K16]. Örnek: Sterling'in sağ üst köşe serbest vuruşu 0,10 xG → **0,81 xGOT** [K22].
- **Penaltı bölgeleri (Premier League, 2006/07–Aralık 2024, 1.708 penaltı):** yüksek sağ %97,3 (108/111), yüksek sol %96,6 (113/117), yüksek orta %95,7 (88/92); alçak orta %81,4 (180/221), alçak sağ %80,4 (448/557), alçak sol %78,4 (478/610) [K3]. Hesap: yüksek bölgeler 309/320 = %96,6; alçak bölgeler 1.106/1.388 = %79,7; atışların %81,3'ü alçak bölgelere gitmiş (hesap). **Uyarı:** tablonun toplamı %82,8 (hesap); Opta'ya göre PL'de sezon oranları %74,8–89,6 arasında oynadığından [K47] bu toplam yüksek kalmıştır: tablo çerçeveyi bulmayan penaltıları (zonlanamadıkları için) dışlıyor olabilir — kaynak açıklamıyor (tahmin).

### 1.3 "Büyük fırsat" (Big Chance) ve dönüşüm
- Opta tanımı: "bir oyuncunun makul biçimde gol atması beklenen durum; genellikle bire bir ya da çok yakın, önü açık, düşük–orta baskı"; penaltılar her zaman büyük fırsattır [K41] [K48]. Öznel bir etikettir; ASA bunu **bilerek kullanmaz** (serbest çeviri: aynı şutu, büyük fırsat etiketi taşımıyor diye daha az değerli saymayız); ASA'ya göre Opta xG'sinde büyük fırsat bir çarpan gibi işler [K24] [K68].
- Lig geneli kalıcı büyük-fırsat dönüşümü **bulunamadı**. Tek veri: PL 2017–18'in ilk 6 haftasında takım tablosundan hesaplanan ≈ %43,7 (90/206; yuvarlanmış yüzdelerden, küçük örnek) (hesap) [K42]. Oyuncu örneği (2018–19 ilk haftalar): Kane 8 büyük fırsat (2 penaltı, ikisi de gol; 1 gol daha; 5 kaçırma), Salah en çok (8), Callum Wilson 7 kaçırdı, Gabriel Jesus 247 dakikada 7 kaçırdı [K41].
- Motor için: büyük fırsat ayrı bir dönüşüm tablosu olmamalı; xG eşiğinin (örn. > 0,3 (tahmin)) gözlemci etiketi olarak türetilmeli.

### 1.4 Bitiriş becerisi gerçekten ayrışıyor mu?
- **Evet ama küçük ve gürültüye gömülü.** StatsBomb (182.288 penaltısız şut, 3.906 şutör, Bayesçi sıkıştırma): "ancak bir avuç" oyuncunun becerisi %75 güvenle sıfırdan farklı; Mbappé 57 şutla ilk 30'a girer, Aubameyang ≈ 250. (%62 olasılıkla ortalama üstü), Lewandowski ≈ 550. (%56) [K14].
- **Süreklilik:** gol/xG için ≈ 0,1 (60+ şut aralığında), küçük örnekte sıfıra yakın; xG'nin kendisi 0,6 sürekli (takım değişince 0,4). Örnek: gol/xG = 2 olan oyuncunun sonraki dönemi ≈ 1,1; forvet ortalaması 1'in biraz altında [K25]. Retegui kariyer gol/xG: tabloda 1,33 (53 gol/40 xG), metinde 1,2 (kaynak içinde tutarsız) [K25].
- **Model yanlılığı:** standart xG modeli mükemmel bitiricileri ortalamaya yakın gösterir; yanlılığı gideren model Messi'nin hedef-üstü golünü %17 yukarı çeker, tipik elit yüksek-şutlu forvetten %27 yüksek bulur [K26].
- **Şut uygulama kazancı:** Opta "Shooting Goals Added" (xGOT − xG, PL 2019–20): Kane +3,5, Aubameyang +2,9, Lacazette +2,7, Greenwood +2,3, Shelvey +2,3; tek sezon, savunma bloklarından etkilenir [K22].
- **Turnuva düzeyi (Degrenne & Carling 2024, DK 2018 ↔ 2022; kendi kalesine goller hariç):** gol 157 ↔ xG 171,7 (−14,7) ve gol 170 ↔ xG 175,2 (−5,2); gol − xGOT: −6,9 ve −6,8; xGOT − xG: −7,8 (2018) ve +1,6 (2022); 2022 açık oyununda xGOT − xG = +8,7 [K55]. Yerleştirmenin etkisi bir turnuvada birkaç gol ve işareti değişebiliyor: bitiriş "kabiliyeti" büyük bir hareket değil.
- **Kaleci karşılığı:** Donnarumma 2023/24'te +12,9 gol (beklenen yenilen oran %30 → gerçek %16), Pau López'te beklenen kurtarış %77 → gerçek %71 [K20]; PL 2019–20'de Henderson 7,4 gol önledi, de Gea 1,0 [K22].
- **Motor için sonuç:** bitiriş kabiliyeti sonuç dağılımını yalnız birkaç yüzde puan kaydırmalı; asıl ayrışma xG üretiminde (konum, zamanlama, tür seçimi) olmalı. Bugünkü motor ölçüsü "gerçekleşen ÷ konum xG 0,8–1,35" sağlık aralığı (FUTBOL_KUTUPHANESI §11.1) bu kaynaklarla uyumludur (elit tavan ≈ 1,2–1,35).

### 1.5 Vuruş biyomekaniği: ortak veriler
- **Hız:** maksimal ayak üstü vuruşta top hızı ≈ 18–35 m/sn (seviye, yaş, yaklaşma açısı, baskın ayak); top/ayak hız oranı 1,06–1,65; ayak–top hızı korelasyonu r > 0,74; geri kazanım katsayısı 0,463–0,681 (0,5 → 0,65 top hızını ≈ %10 artırır) [K27]. Shan–Zhang derlemesi ayak hızını ≈ 25 km/sa'ten > 100 km/sa'e, top çıkış hızını ≈ 30 km/sa'ten > 120 km/sa'e aktarır (Lees & Nolan 1998 vd.; seviye etiketi belirsiz) ve V_top = 1,23·V_ayak + 2,72 bağıntısını verir [K28].
- **Yaklaşma ve destek ayağı:** 45°'ye kadar açılı yaklaşma top hızını artırabilir (anlamlı olmayabilir); koşarak yaklaşma durağandan hızlıdır; destek ayağı topun 5–10 cm gerisinde ve 5–28 cm yanında önerilir (deneysel olarak doğrulanmamış) [K27].
- **Kinematik:** diz uzama hızı 860–1.720°/sn; temasta baldırın açısal hızı ≈ 1.891°/sn, uyluk neredeyse durur (proksimalden distale zincir) [K27].
- **Hız–isabet ödünleşimi:** yalnız bir çalışma niceliksel: 20 deneyimli oyuncu, 8.466 vuruş, maksimumun %40–100'ü; **yatay ve dikey hata varyansı hızın kuvvet fonksiyonu olarak artar** (parametreler tekniğe ve hedef yüksekliğine bağlı); **yan ayak (iç) vuruşu ayak üstünden daha isabetli**; **alçak hedef daha hassas**; sağ ayaklılar hedefin sol-altına veya sağ-üstüne kaçırma eğiliminde (solaklarda ayna; yön kaynakta açık değil); dağılımın merkezi hızla kayar [K6]. Hedef küçüldükçe ayak hızı anlamlı düşer; ayak bileğinin katkısı +%24, dizinin −%10, kalçanın −%14 (8 üniversite oyuncusu) [K29]. Derleme: isabetli vuruş genelde daha yavaş, hedefli vuruşun süresi uzun [K27].
- **Zayıf ayak:** Wyscout xG modelinde güçlü ayak / zayıf ayak odds oranları 1,18 / 1,12 (Bundesliga; temel sınıf kaynakta belirtilmemiş) — fark küçük ama güçlü ayak üstün [K32]; ASA da "tercih edilen ayak"ı girdi sayar [K24].
- **İç ayak ↔ ayak üstü azami hız:** 6 kadın + 6 erkek oyuncu, maksimal vuruş: ayak üstü 22,5 ± 1,0 (K) / 27,9 ± 1,3 (E) m/sn; yan ayak (iç) 21,5 ± 1,0 / 26,9 ± 1,3 m/sn — iç ayakla maksimal vuruş ayak üstünün ≈ %96'sı (hesap) [K65]. İki profesyonelle 2000 Hz filmde yan ayakta ayak ve top hızı daha düşük ama temas verimliliği benzer; yan ayakta pasif plantar fleksiyon çok kısıtlı [K66]. Motorda iç ayak plase hızı oranı 0,75 (`VURUS_STIL.ic`) bir **kapasite** değil **seçim** (isabet için bilerek yavaş vurma) olarak okunmalı; kapasite oranı ≈ 0,95.
- **Eğri atış fiziği (Goff 2010, Physics Today):** serbest vuruşta ayaktan çıkış ≈ 35 m/sn ve kaleye varış ≈ 21 m/sn (makaledeki Reynolds sayılarından türetilmiş), Gerrard tipi yan dönüş ≈ 600 dev/dk (10 dev/sn); top için sürükleme krizi ≈ 12 m/sn; Magnus kuvveti başlangıçta topun ağırlığı kadar; iyi vurulmuş serbest vuruş bütün uçuşu türbülanslı rejimde geçirir [K67]. Knuckle örneği ≈ 27 m/sn, ≈ 5 dev/sn: bkz. F.2.2.
- **Penaltıda en iyi hız ve yerleştirme (Liverpool John Moores matematik çalışması; ikincil haber):** 25–29 m/sn (90–104 km/sa), yüksek ve kalecinin bir yanına; daha hızlı vuruş isabetsizlikle, daha yavaşı kaleciyle kaybeder; 4–6 adımlık koşu en başarılı, 10 m'lik koşu en başarısız [K61]. Hunter ve ark. bu ödünleşimi 20+ kişi × 500+ vuruşla (11 m) modelledi; optimum parametreler özette yok [K60].
- **Etiket sözlüğü (açık veri şeması):** `technique` = Normal, Volley, Half Volley, Lob, Backheel, Overhead Kick, Diving Header; `body_part` = Head, Left Foot, Right Foot, Other; bayraklar `first_time`, `follows_dribble`, `aerial_won`, `open_goal`, `deflected`; `end_location [x,y,z]`; `statsbomb_xg`; şut anında `freeze_frame` [K38]. Opta ve ASA modelleri bire bir (1v1) durumunu ayrı girdi sayar [K23] [K24].

### 1.6 Kaleci davranış kuralları (ortak)
- **Set position (hazır duruş):** "ayaklar omuz genişliğinde, parmak uçlarında"; bir sonraki şut gelmeden hazır olmak [K43]. Koçluk: dengeyi ayakların üstünde tut, erken dalma, atağın tipine göre baskıyı ayarla [K39].
- **Bire birde yaklaşma (koçluk müfredatı):** vurucu topu kontrol ederken yavaşça çık, yaklaştıkça alçal; topa ≈ 1 m kala tamamen alçak, eller ayak bileği hizasında önde, bacaklar yakın; vurucu geri çektiği anda "büyük, uzun bir bariyere" patla (wide block); açılı şutta aynı taraftaki bacağı yana at, split'e düşerken üst gövdeyi büyük, kolları açık tut; ağır/kötü dokunuşta hızla kapat; ağır pasa hızla çık; kafa eller/top arkasında, üst diz koruma için yukarıda; top yana kayarsa dışarı adım at, yetişemeyeceksen yere kapan [K40].
- **Erken yatma:** "sabırlı ol, erken dalma", vurucu niyeti okur [K39]. Penaltıda doğru bölgeye gidiş: gol %52,7 (58/110) → gitmezse %90,3 (159/176) (286 penaltı, 2009–10, İngiltere/Almanya/İtalya/İspanya); doğru bölge payı 110/286 = %38,5 (hesap) [K2].
- **Mesafe ve süre:** kaleci–top mesafesi 2–7 m iken gol olasılığı anlamlı yüksek (Scott Peterson araştırması; ham sayı verilmemiş, ikinci elden); çizgide durup 5,5 m'deki topa tepki verebileceğini sanmak "biraz fazla iyimser" [K19].
- **Gerçek bire bir eylemleri (42 örnek):** PL 2013–14'te 20 kaleci, rastgele seçilmiş 42 bire bir doğrudan şut eylemi (20 gol, 22 kurtarış). Kurtaran kaleciler vurucuya kaleye dik eksende **etkin biçimde kapattı**; gol yiyen kalecilerde vurucuya doğru hareket **anlamlı biçimde gecikmişti**; temasa kalan süre, kişilerarası mesafe ve bağıl hız, kaleci–vurucu ikilisini biçimlendiren bilgi kısıtları olarak bulundu [K59]. Kurtarış yüzdesi ve m/sn değerleri özette yok.
- **Ölçülen dalış süresi (küçük örnek):** 6 üniversite oyuncusu, ışık işaretinden hedefe dokunuşa kadar 1,28–1,44 sn (A tipi kalkış) ve 1,65–1,99 sn (B tipi); aşağı dalış yukarıdan hızlı [K30]. Top ise 11 m'den ≤ 0,5 sn'de gelir [K4] — kaleci **önceden karar** vermek zorundadır.
- **Uçuş süresi (hesap)** (t = L/v, sürtünmesiz): 6 m @ 20 m/sn 0,30 sn; 11 m @ 22 / 25 / 30 m/sn → 0,50 / 0,44 / 0,37 sn; 16 m @ 25 → 0,64 sn; 20 m @ 27 → 0,74 sn; 25 m @ 27 → 0,93 sn.
- **Sınıf farkı:** uzun boylu kaleci altı pas merkezinde ve havada üstün (Courtois 3 isabetli şutun 2'sini, Pickford 11'in 1'ini kurtardı; merkez penaltı noktası çevresinde %50 ↔ %64; yan şutlarda Pickford 22'de 19, Courtois 17'de 10) ama agresif pozisyon tepki süresini kısar [K18].

### 1.7 Gol tekniği payları (turnuva ve Şampiyonlar Ligi analizleri)
Tanımlar çalışmadan çalışmaya değişir (gözlemsel kodlama ↔ olay verisi etiketi); sayılar aynı ölçüye zorlanmadan okunmalı. "Plase" = iç ayakla yerleştirme.

| Veri | Plase / iç ayak | "Shot" (ayak üstü, güç) | Kafa | Penaltı | Dış ayak | Diğer vücut | Kendi kalesine | Kaynak |
|---|---|---|---|---|---|---|---|---|
| Dünya Kupası 2018 (64 maç, 169 gol, gözlemsel kodlama) | %35,5 (≈ 60) | %18,3 (31) | %18,3 (31) | %13,0 (22) | %4,1 (7) | %3,6 (6) | %7,1 (12) | [K54] |
| Şampiyonlar Ligi 2009/10 grup (125 maç) | %41,56 | %33,44 | %16,88 | — | — | — | — | [K70] |
| Dünya Kupası 2010 | şut (ayak) 108 gol | | kafa 26 gol (%19,4; 26/134, hesap) | | | | | [K56] |
| Dünya Kupası, kafa gol payı (StatsBomb verisi, NetSI) | | | 2018 %23,7; 2022 %18,4; 2026 (16'lar) %17,9 | | | | | [K57] |

- **Okuma:** iç ayak/plase gollerin ≈ %35–42'si, kafa ≈ %17–24'ü, ayak üstü/güç ≈ %18–33'ü; dış ayak %4. Kafa payı Vergonis'te %18,3, NetSI'de aynı turnuva için %23,7 — tanım farkı olası (PopSci aktarımı "header-assisted" ifadesini kullanıyor) [K54] [K57].
- **Uzaktan şut (DK 2018):** açık oyun gollerinin %19,4'ü (19 gol) uzaktan şuttan, bunların 8'i iç ayakla; orta 19, ileri pas 18, geri çevirme 12 gol. Yazarlar iç ayakla vurmanın ayak üstü/dış ayaktan daha isabetli olduğunu söyleyip uzaktan iç ayak çalışmasını önerir (Nagano ve ark. 2006'ya atıf; o makale okunmadı) [K54].
- **İlk dokunuş:** ŞL 2023/24 grup aşamasında (296 gol) **gollerin %63'ü tek dokunuşla**, %68'i doğrudan baskı altında; asistsiz (sekme/çelme/top kapma) %31, orta %23, ara pası %14, alçak orta/geri çevirme %30; 1–5 pas içinde %53, 10+ pas %16 [K71]. ŞL 2015/16: uzaktan açık oyun golü 25 (bir önceki sezon 36; kayıtların en düşüğü), açık oyun payı %77 [K72].
- **Oyun türü payları (DK 2018 → 2022):** penaltı %13,0 (22) → %9,9 (17); korner %13,6 → %7,6; direkt serbest vuruş %4,1 → %1,2; dolaylı serbest vuruş %7,1 → %5,8; konumsal hücum %46,7 → %68,0; hızlı hücum %7,7 → %6,4; kendi kalesine %7,1 → %1,2; sağ ayak ≈ %50 [K55].
- **Kafa (DK 2026, 16'lara kadar):** isabet %33,5, dönüşüm %11,4 (önceki iki turnuvadan yüksek); kafa gollerinin %57'si her yarının sonunda (31–45+ ve 76–90+); uzun taç maç başına 2,54 (2018'de 1,83); doğrudan kafa şutlarının yerini yönlendirmeler alıyor [K57].
- **Bulunamayanlar:** vole, yarım vole, aşırtma, topuk, dönen şut türlerinin gol payı; iç ayak plase payının Şampiyonlar Ligi'nde güncel değeri; FIFA/UEFA teknik raporlarının şut tekniği tabloları (erişilemedi).

## 2. Bitiriş türleri

## 2.0 Tür kataloğu (ilkel × bağlam × rol)
Her türün şablonu: **Durum · Seçenekler · Yürütme · Gerçek sayılar · Kalecinin cevabı · Hata biçimleri · Kabiliyet eşiği (görme / seçme / yapma) · Ünlü örnek · Motor karşılığı · Kaynaklar**. Motor karşılığı bugünkü kod adlarıdır (`SUT_TUR`, `VURUS_STIL`, eğilimler: `js/mac-karar.js`, `js/mac-topla.js`, `js/mac-profil.js`).

| Kod | Tür | İlkel (vuruş) | Bağlam anahtarı | Rol eğilimi | Bugünkü motor adı |
|---|---|---|---|---|---|
| C1 | Bire bir: uzak köşeye alçak plase | yan ayak itme | kaleci önde/ortada, açı açık | klinik santrfor, kanat | `plase` / `ic` |
| C2 | Bire bir: aşırtma | kepçe | kaleci ≥ 3,5 m önde, set değil, > 9 m | yaratıcı forvet, 10 | `asirtma` |
| C3 | Bire bir: yakın direğe sert | ayak üstü sürücü | kaleci uzak direğe kaymış, süre kısa | güçlü santrfor | `sert` / `ust` |
| C4 | Kaleciyi çalımlama | çalım + itme | kaleci yere/öne atılıyor | dribbler | (çalım 1v1 + boş kale) |
| C5 | Erken vuruş | kısa salınımlı şut | kaleci set değil, savunmacı yetişiyor | pozisyon sezgili santrfor | `sert`/`plase` + `acele` |
| C6 | Kalecinin bacak arası | alçak sert/plase | kaleci split | cesur | `plase` (tür yok) |
| C7 | Geri çevirmeye gelişine | tek vuruş / kontrol+vuruş | alçak cutback, kaleci hareketli | poacher | `ilk` (gelişine) |
| C8 | Kafa: yönlendiren | kafa sıyırma | hızlı orta, savunmacı yakın | hareketli forvet | (kafa) |
| C9 | Kafa: güçlü | kafa vuruşu | altı pas/penaltı noktası, boy üstünlüğü | hedef forvet | (kafa) |
| C10 | Kafa: arka direkte geri | ters yön kafa | kaleci ön/ortada | arka direk koşucusu | (kafa) |
| C11 | Kafa: dalarak | plonjon kafa | alçak orta, 6 pas | cesur forvet | `EYLEM_ADIM.kafa` |
| C12 | Yan vole (gövde yatık) | vole | yan/arka havadan top | teknik kanat, 10 | `vole` |
| C13 | Yarım vole | yarım vole | sekme, diz altı | teknik orta saha/forvet | `yarimVole` |
| C14 | Dış ayak vole / yakın dış ayak | dış ayak | yan koşu, hazırlıksız | Brezilya tarzı kanat | `dis` |
| C15 | Uzaktan falso, uzak köşe | iç ayak bükme | 16–25 m, kaleci set, baraj yok | finesse 10, kanat | `falso` |
| C16 | Düşen sert vuruş | sürücü / knuckle | 20–30 m | güçlü şutör | `dusen` / `ust` |
| C17 | Dış ayak trivela, uzaktan | dış ayak bükme | baraj/savunmacı yanı, ters köşe | beceri ≥ 0,65 | `trivela` |
| C18 | Uzaktan plase | iç ayak plase | 18–25 m, merkez | uzaktan şutör | `plase` |
| C19 | Dar açı: yakın direk | sert / dış ayak | kaleci yakın direği kapatmıyor | kanat | `sert` |
| C20 | Dar açı: uzak direğe kesme | iç bükme | kaleci yakın direkte | kanat, forvet | `falso` |
| C21 | Dar açı: geri pas | cutback pası | arkada boş oyuncu | oyun kurucu kanat | (pas) |
| C22 | Burunla dürtme, topuk | burun / topuk | 1–6 m, hazırlıksız | poacher | `burun` |
| C23 | Kısa mesafe karambol / itme | herhangi yüzey | sekme, kalabalık | poacher | — |
| C24 | Boş kale | iç ayak itme | kaleci yok/yerde | herkes | `plase` |
| C25 | Penaltı: bakmadan (kaleciden bağımsız) | koşu + yerleştirme | 11 m, baskı düzeyi | penaltı atıcısı | `penaltiPlani` |
| C26 | Penaltı: bakarak / duraklı koşu / Panenka | duraklı koşu, kepçe | kaleci erken dalıyor | soğukkanlı usta | `penaltiDurak` |
| C27 | Kötü vuruş biçimleri | — | acele, baskı, zayıf ayak, gelişine | — | `kotuVurusOlasiligi` |

## 2.1 Kaleciyle bire bir

### C1. Bire bir: uzak köşeye alçak plase (Low placed finish to the far corner)
- **Durum:** 6–16 m (tahmin), vurucu ile kale arasında yalnız kaleci; kaleci 2–6 m öne çıkmış ya da set; arkadan yetişen savunmacı; top çoğu kez koşu önünde yerden, 8–18 m/sn (tahmin). Sıklık: Katar 2022 grup aşamasında Güney Amerika takımları maç başına 3,6, Avrupalılar 2,1 bire bir yaşadı (tanım kaynakta yok) [K33]. Opta ve ASA modelleri bire biri ayrı girdi sayar [K23] [K24].
- **Seçenekler:** (1) kaleci öne ve ortada ya da yakın direğe meyilli, uzak köşe açık → **uzak köşeye alçak plase** (varsayılan); (2) kaleci uzak direği örtüyorsa yakın köşe (C3) ya da çalım (C4); (3) kaleci ≥ 3,5 m önde ve 9 m'den uzakta ise aşırtma eklenir (C2; bugünkü motor eşiği); (4) kaleci set ve yakınsa erken vuruş (C5). Gerekçe: köşeler ≥ %50, merkez ≈ %12 [K13]; alçak hedef daha hassas [K6].
- **Yürütme:** yan ayak iç yüzü (side-foot; ayak üstünden daha isabetli [K6]); destek ayağı topun yanında ≈ 5–28 cm [K27]; gövde topun üstünde, baş sabit, bakış topta (hedef hazırlıkta bir kez kontrol edilir); kısa geri salınım; vuruş hızı 14–22 m/sn (tahmin; hız arttıkça hata varyansı kuvvet fonksiyonuyla büyür [K6]); top yerde/yere yakın, direğin 0,3–0,6 m içinden (tahmin); hafif topspin/düz (tahmin).
- **Gerçek sayılar:** bire bir ≥ 0,40 xG [K12]; köşe–merkez farkı bkz. 1.2; seviye farkı: bitirici kabiliyeti sezonda ancak birkaç gol (Kane SGA +3,5 [K22]; gol/xG süreklilik 0,1 [K25]). Bire bir etiketli şutların lig geneli dönüşümü **bulunamadı**; 42 gerçek PL bire biri incelendi (20 gol, 22 kurtarış; örnek dengelenmiş görünüyor, oran çıkarılamaz) [K59].
- **Kalecinin cevabı:** vurucu topu kontrol ederken yavaş çık, topa 1 m kala tam alçal, eller ayak bileğinde, vurucu geri çekince geniş blok [K40]. Vurucuya etkisi: ulaşılabilir hedef, bloğun yanındaki alçak köşelere daralır; kaleci erken yatarsa köşe açılır [K39]. Gerçek PL bire birlerinde kurtaran kaleciler vurucuya dik eksende etkin kapattı, gol yiyenlerin hareketi gecikmişti [K59]. Robben'in Casillas karşısındaki iki denemesi (62' aşırtma, 83' çalım) kalecinin ayakla/zamanında yere inişle kurtardığı örnektir (Bölüm H, H.4).
- **Hata biçimleri:** (1) topu kalecinin bloğuna/bacağına vurmak (merkeze kayma → dönüşüm ≈ %12 [K13]); (2) direk dışı; (3) ağır dokunuşla geç vuruş: kaleci kapatır ("kötü dokunuş = topa saldır" [K40]); (4) baskı altında acele, gövde geride, top yukarı (tahmin); (5) topun altına girme.
- **Kabiliyet eşiği:** *görme* = kalecinin ağırlık yönü ve bacak aralığını tek bakışta okumak (tahmin); *seçme* = açık köşeyi seçmek, `plaseVurur` eğilimi (soğukkanlılık 0,6, şut 0,4); *yapma* = yan ayak isabeti, soğukkanlılık. Tip: "klinik" santrfor/kanat; düşük kabiliyette merkeze ya da kalecinin bacağına kayma.
- **Ünlü örnek:** Maradona 1986 ve Messi 2007 kaleciyi çalımla geçer (C4); plase için Bölüm H'de ayrı kayıt yok; "Henry'nin uzak köşe alçak bitirişi" (genel bilgi).
- **Motor karşılığı:** `SUT_TUR.plase` (stil `ic`, hız oranı 0,75; yatay hata çarpanı 0,65 `sutYeni`); `sutPlani` hücre P(gol) = (1−blok)·Σ P(hücre)·(1−kurtarış).
- **Kaynaklar:** [K6] [K12] [K13] [K22] [K23] [K24] [K25] [K27] [K33] [K39] [K40] [K59]

### C2. Bire bir: aşırtma (Chip / lob over the keeper)
- **Durum:** kaleci çizgiden ≥ 4–5 m dışarı çıkmış ya da çıkış koşusunda, set değil; top vurucunun ayağında/önünde; 9–20 m (tahmin). Bugünkü motorda koşul: kaleci ≥ 3,5 m önde ve > 9 m; maçta şutların ≈ %0,6'sı (`js/mac-karar.js` T9b-c yorumu).
- **Seçenekler:** kaleci çok çıktı ve geriye hamle yapmıyorsa aşırtma; kaleci çizgide/yakın ve set ise yok; kaleci geri kaçıyorsa (backpedal) yer şutu; mantık Panenka ile aynı: kaleci erken hareket etmiş [K34]. Ramires 2012: kaleci erken yatırılmadan dış üstle aşırtma; "kaleci çıkıyorsa aşırtma, bekliyorsa çalım/plase" ayrımı H'nin kabul ölçütüdür (H.1).
- **Yürütme:** ayak üstünün alt kenarı topun alt yarısına ("kepçe"); kısa geri salınım, kısa takip; destek ayağı topun yanında/hafif geride; gövde hafif geride (top yükselsin); hız 7–14 m/sn (tahmin; motor oranı 0,55); kavis tepesi kalecinin erişiminin üstünde, inişte direkler arasında; geri dönüş (backspin) inişi yavaşlatır (tahmin).
- **Gerçek sayılar:** açık oyunda aşırtma dönüşümü **bulunamadı**; açık veride `Lob` etiketi var, sayı yok [K38]. Penaltıda kepçe (Panenka): gerçek Panenka'nın dönüşümü diğer penaltılardan 4–5 puan düşük olabilir (küçük örnek, Palacios-Huerta tahmini) [K3].
- **Kalecinin cevabı:** geri koşarak/uzanarak yakalama, ellerle yukarı kapatma; yatay "geniş blok" aşırtmaya karşı yetersiz [K40]. Etkisi: kaleci ne kadar yakınsa aşırtma o kadar kolay, ama tepe yüksekliği o kadar hassas; Casillas 62'de top yeterince yükselmeyince **ayağıyla** kornere çeler (H.4).
- **Hata biçimleri:** fazla güç → üst direk/dışarı; az güç → kaleci yakalar; topun altına girememe; yön hatası.
- **Kabiliyet eşiği:** *görme* = kalecinin mesafesi + ağırlık yönü; *seçme* = riskli seçenek, `kaleciyiAsirtir` eğilimi (yaratıcılık 0,6, soğukkanlılık 0,4); *yapma* = ince top hissi. Tip: yaratıcı forvet/10.
- **Ünlü örnek:** Ramires, Chelsea–Barcelona 2012 (H.1); Nihat 2008, Čech'e karşı topu üst direğin altına aşırtır/yerleştirir (H.1); penaltıda Totti Euro 2000 [K34].
- **Motor karşılığı:** `SUT_TUR.asirtma` (stil `asirtma`, hız oranı 0,55, kz 0,9→0,75, ky 0,7); hedefler |z| ≤ 2,6 m; blok yalnız ilk 4 m.
- **Kaynaklar:** [K3] [K34] [K38] [K40]; Bölüm H H.1, H.4

### C3. Bire bir: yakın direğe sert vuruş (Power finish at the near post)
- **Durum:** açı dar–orta; kaleci uzak köşeyi kapatmak için kaymış ya da yakın direkte geç; 6–12 m (tahmin); süre çok kısa (savunmacı yetişiyor).
- **Seçenekler:** kaleci uzak direğe yer değiştirmişse ve yakın direk (alt/üst) açıksa; kalecinin yakın bacağı geride/yana açılmışsa → sert vuruş. Kaleci yakın direği kapatıyorsa C1/C20.
- **Yürütme:** ayak üstü sürücü (instep drive) ya da hızlı içten; destek ayağı topun yanında; gövde topun üstünde; kısa-orta geri salınım; 22–30 m/sn (tahmin; kaynak aralığı 18–35 [K27]); düz yol; hız arttıkça hata artar [K6].
- **Gerçek sayılar:** yakın direk bölgesi dönüşümü **bulunamadı**; PS xG hızı kullanır, xGOT kullanmaz [K15] [K22]. Kaleci farkı: Donnarumma alt köşeleri ve direğin hemen içindekileri bile durdurdu [K20]; Courtois Mané'nin yakın köşeye sert şutunu tek elle direğe çeler (H.4).
- **Kalecinin cevabı:** aynı taraftaki bacağı yana at, split'e düş, üst gövde büyük [K40]. Etki: sert ama okunur şut kalecinin eline/bacağına gider; hız tek başına yetmez, köşe seçimi önde.
- **Hata biçimleri:** kalecinin eline/bacağına (ortaya sapma), direk dışı, ayağın kayması (kötü temas), blok.
- **Kabiliyet eşiği:** *görme* = kalecinin yakın direği kapatma durumu; *seçme* = güç ya da yerleştirme (`sutYeni` ödünleşimi); *yapma* = sert + isabetli. Tip: fiziksel, gol hissi güçlü santrfor.
- **Ünlü örnek:** **bulunamadı**.
- **Motor karşılığı:** `SUT_TUR.sert` (stil `ust`, hız oranı 1,0; kz 1,15, ky 1,1).
- **Kaynaklar:** [K6] [K15] [K20] [K22] [K27] [K40]

### C4. Kaleciyi çalımlama (Rounding the keeper)
- **Durum:** kaleci kapatmak için dışarı atılmış ya da yere gidiyor; top vurucuda ve kontrollü; kalecinin yanından geçecek yer var; geri dönen savunmacı.
- **Seçenekler:** kaleci yere yatmaya/atılmaya başladıysa çalım (Maradona 1986 ve Messi 2007 kabulü: kaleciye karşı çalım ancak kaleci erken yattığında seçilir — H.1); kaleci set ve alçak ise şut; çok dışarı çıkmışsa çalım sonrası boş kaleye iç ayak (C24); kaleci "tam anında" yatıyorsa (Casillas 83') çalım kaybeder.
- **Yürütme:** geniş yana dokunuş (dış ya da iç ayak) topu kalecinin 0,5–1 m yanından geçirir; omuz-kalça feinti; ikinci dokunuş/şut; ek süre 0,3–0,6 sn (tahmin); top hızı düşük, kontrollü; kritik: ilk dokunuşun yönü ve top–gövde mesafesi (H kabulü: top ayaktan 1,5 m'den fazla açılmaz).
- **Gerçek sayılar:** çalımlama başarısı ve sonrasında bitiriş dönüşümü **bulunamadı**.
- **Kalecinin cevabı:** "sabırlı ol, erken dalma" [K39]; yavaş kapat, 1 m'de alçal; ağır dokunuşta hızla kapat; top yana kayarsa dışarı adım at, yetişemeyecekse yere kapan [K40]. Çalımın riski = kaleci kapatması + geri dönen savunmacı.
- **Hata biçimleri:** ağır dokunuş → kaleci kapar; çok yana → açı daralır, çizgiye gider; geç karar → savunmacı yetişir; kontrol kaybı.
- **Kabiliyet eşiği:** *görme* = kalecinin ağırlık yönü, yere inme anı; *seçme* = çalım (rakibi geç eğilimi) ya da şut; *yapma* = top sürme/çalım (yüksek). Tip: dribbler-forvet.
- **Ünlü örnek:** Maradona 1986 (Shilton'ı çalımla geçer, sol ayakla bitirir), Messi–Getafe 2007 (kaleciye karşı sağa açılır, sağ ayak) — H.1; olumsuz: Robben–Casillas 2010 (H.4).
- **Motor karşılığı:** ayrı tür yok; `çalım 1v1` + boş kale/plase; H kabulü `c-1v1`.
- **Kaynaklar:** [K39] [K40]; Bölüm H H.1, H.4

### C5. Erken vuruş (Early / snap shot before the keeper sets)
- **Durum:** kaleci henüz set değil (koşuyor); savunmacı yetişiyor; 14–24 m (tahmin; bire birin başlangıcı).
- **Seçenekler:** kontrolü kaybetmeden önce, kaleci yaklaşıp blok oluşturmadan; kaleci çizgide ve set ise gerek yok; bire bir ve baskı varsa tercih; xG düşük (uzak) olduğundan son çare — StatsBomb: bire bir uzak şuta istisnadır [K12].
- **Yürütme:** tek adım, kısa geri salınım; ayak üstü ya da iç ayak üstü; 20–27 m/sn (tahmin); yerde/alçak.
- **Gerçek sayılar:** **bulunamadı**; uzak şut ≈ 0,03 xG [K12]; kompakt savunmada 20–25 yd şut zor [K33].
- **Kalecinin cevabı:** vurucu geri çektiğinde patla [K40] — erken vuruşta kaleci blok kuramaz; set için gereken süre vurucunun yakınlığına bağlı.
- **Hata biçimleri:** blok, çok merkez, kötü temas; kalite düşük.
- **Kabiliyet eşiği:** *seçme* (zamanlama) + *yapma*. Tip: pozisyon sezgisi güçlü santrfor.
- **Ünlü örnek:** **bulunamadı**.
- **Motor karşılığı:** `sutSecenegi` uzak şut kapısı (`sutIstekMesafe`), `acele` çarpanı.
- **Kaynaklar:** [K12] [K33] [K40]

### C6. Kalecinin bacak arası (Through the keeper's legs)
- **Durum:** kaleci bacakları açık (split/geniş blok ya da yan adım sırasında); top alçak; 3–10 m (tahmin).
- **Seçenekler:** yalnız kaleci split'e geçtiği an ya da bacakları ayrıkken; set halinde bacaklar yakın [K40] → seçenek kapalı. Kalecinin bacak aralığı modellenmiyorsa bu seçenek açılmaz (tahmin).
- **Yürütme:** sert-orta yer şutu, hedef bacaklar arası ≈ 0,2–0,4 m (tahmin); ayak üstü ya da iç ayak.
- **Gerçek sayılar:** **bulunamadı**.
- **Kalecinin cevabı:** bacakları yakın tut [K40]; split'te üst gövde büyük ama bacak aralığı açılır.
- **Hata biçimleri:** bacağa çarpma, geç.
- **Kabiliyet eşiği:** *görme* = bacak aralığını okumak (yüksek); *seçme* = riskli/gösterişçi; *yapma* orta (tahmin).
- **Ünlü örnek:** **bulunamadı**.
- **Motor karşılığı:** yok (kaleci gövde modeli kapısı).
- **Kaynaklar:** [K40]

## 2.2 Geri çevirmeye gelişine

### C7. Geri çevirmeye gelişine: ilk dokunuş mu, tek vuruş mu? (First-time finish vs control-then-shoot on a cutback)
- **Durum:** penaltı noktası civarı (≈ 8–12 m, tahmin), top yerden, kenardan geriye çevrilmiş (kale çizgisine paralel alçak pas, 8–16 m/sn, tahmin); kaleci kısmen geri/yana dönüyor; yetişen savunmacı; vurucu gelişine. Tanım: cutback = ceza alanı yan bölgesinden başlayıp merkez bölgede biten alçak/yerden pas [K38].
- **Seçenekler:** kaleci hareketliyse (duraksamadan) ve top vurulabilir yükseklik/hızdaysa → tek vuruş (`first_time`); top zıplıyorsa/çok hızlıysa ya da savunmacı kapatıyorsa → kontrol dokunuşu ve vuruş; ASA, cutback ve through-ball şutlarını ayrı iyi/daha iyi/en iyi sürümlerle modeller; through-ball ortalama ≈ %30 dönüşüm [K24].
- **Yürütme:** tek vuruş: 45°'ye kadar açılı yaklaşma [K27], destek ayağı topun yanında [K27], gövde topun üstünde (top alçak kalsın), yan/iç ayak üstü, 18–26 m/sn (tahmin). Kontrol + vuruş: ilk dokunuş topu vücut dışına 0,3–0,6 m, dokunuş–vuruş arası ≈ 0,3–0,5 sn (tahmin). Silva 2012: geri çevirmeyle gelen topa koşusunu zamanlayıp 8 yd'dan uzak direğe kafa (H.1); Iniesta 2010: tek kontrol, sağ ayak yarım vole (H.1).
- **Gerçek sayılar:** `first_time` etiketi var [K38]; ŞL 2023/24 grup aşamasında (296 gol) gollerin **%63'ü tek dokunuşla**, alçak orta/geri çevirmeden gelen goller %30 [K71]; geri çevirme maçta 1,56, %32 tamamlanır, tamamlananın ≈ %25'i şuta döner, cutback şutlarının %97'si Great/Good/Average xG kümelerinde ve cutback gollerinin %59'u hızlı oyunda (> 3 m/sn) [K49]; Golden Zone'a geri çevirmede dönüşüm %25 [K50]; DK 2018'de 12 gol geri çevirmeden [K54]. Tek vuruş ↔ kontrol+vuruş dönüşüm farkı **bulunamadı**.
- **Kalecinin cevabı:** kaleci–top mesafesi 2–7 m iken gol daha olası [K19]; tek vuruş kalecinin yeniden konumlanma süresini azaltır; çizgideki kalecinin tepki süresi hafife alınır [K19].
- **Hata biçimleri:** topun üstüne kapanamayıp yüksek vurma; sekme zamanlaması (yarım vole); ilk dokunuşta topu savunmacıya bırakma.
- **Kabiliyet eşiği:** *görme* = kaleci + savunmacıyı iki bakışta okumak; *seçme* = tek vuruş mu kontrol mü; *yapma* = zamanlama. Tip: kutu içi "poacher" (hızlı koşu, tek vuruş); kontrol ağırlıklı oyuncuda ilk dokunuş.
- **Ünlü örnek:** Silva 2012, Iniesta 2010, İlhan 2002 (alçak orta, ~8 m'den gelişine yarım vole) — H.1.
- **Motor karşılığı:** `vurusSapma` gelişine (`ilk`) ×1,35; `kotuVurusOlasiligi` gelişine ×2,5; H kabulü: geri çevirmeyle gelen topa iki hücumcu farklı derinlik/zamanda varır.
- **Kaynaklar:** [K19] [K24] [K27] [K38] [K49] [K50] [K54] [K71]; Bölüm H H.1; Bölüm B B.13

## 2.3 Ortaya kafa türleri

### C8. Kafa: yönlendiren (Glancing / flick-on header)
- **Durum:** ortanın hızı yüksek (15–25 m/sn, tahmin), top zaten kaleye doğru gidiyor ya da hafif açıyla çevrilebilir; vurucu hareketli (ön/arka direk koşusu); savunmacı yakın.
- **Seçenekler:** gelen top yeterince hızlı ve küçük bir yön değişimi yetiyorsa yönlendir (temas kısa, az gövde); güç gerekiyorsa C9; arka direkte kalecinin ters ayağına C10. Açık veride `deflected` (yönlendirilen şut) etiketi var [K38].
- **Yürütme:** alın yan/üst; boyun sabit; kafa topa karşı "yüzey" olarak açılır; gövde minimal hareket; çıkış hızı gelen top hızından türer (kaynak **bulunamadı**); hedef alçak köşe, kaleciden uzağa (tahmin). Teknik: boyun kaslarını gerip tüm gövdeyi tek hareketle getirmek, boyun ve gövdeyi sabitlemek; oyuncu başına maçta ortalama 6–12 kafa vuruşu [K53].
- **Gerçek sayılar:** ASA'nın lojistik xG modelinde kafa katsayısı −0,648 (aynı konumda odds ×0,52), orta −0,380 (×0,68), korner −0,622; kaleci modelinde kafa −0,896 [K52]; kafa golü payı Dünya Kupalarında ≈ %17–24 (1.7). Kafa isabeti ≈ %34 (şut ≈ %33); gol oranı kafa %12, şut %9 — aynı konumda kafa dönüşümü şutun yaklaşık yarısı; kafaların ≈ %95'i altı pas genişliğinde merkezde [K10]. Kafaların %72'si baskı altında; ortalama mesafe 9,6 yd (şut 18,8) [K11]. Ortadan goller Katar 2022 grup aşamasında Rusya 2018'e göre %83 fazla [K33]. Seviye: hava düellosu kazanma olasılığı (HOPS) boy etkisi her cm +0,007, boy HOPS varyansının %22'sini açıklar [K17]; Đurić ortalama Serie A stoperine karşı ≈ %73 düello kazanır [K44].
- **Kalecinin cevabı:** Elfvendal: yüksek xG'li kafaları engellemek için yüksek (çizgiden öne) pozisyon; yakın direğe koşuda "8 numara" pozisyonuna geçiş [K19].
- **Hata biçimleri:** temas zamanı (erken/geç), top yukarı yönlenir (kafa üst/yan), savunmacı teması, yön hatası.
- **Kabiliyet eşiği:** *görme* = ortanın uçuşunu okuma; *seçme* = yönlendirme/güç; *yapma* = zamanlama + sıçrama. Tip: ön direk koşucusu/hareketli forvet.
- **Ünlü örnek:** Gakpo'nun Katar 2022 kafası ("muhteşem") [K33].
- **Motor karşılığı:** hava topu (`js/mac-hava.js`: sıçrama, kafa teması, düello); `deflected` bayrağı.
- **Kaynaklar:** [K10] [K11] [K17] [K19] [K33] [K38] [K44] [K52] [K53] [K57]

### C9. Kafa: güçlü (Powered / attacking header)
- **Durum:** ceza sahası merkezi, altı pas/penaltı noktası çevresi; top havada, yükseklik alın hizası; rakip baskısı; ortalama mesafe 9,6 yd [K11].
- **Seçenekler:** top yavaş/yüksek, vurucu havada üstünse → güçlü kafa (gövde yayıyla); kaleci ortada → köşelere; kaleci ön direkteyse arka direğe.
- **Yürütme:** sıçrama tepe noktasında temas; gövde geriye yay → öne "kırılma"; alın düz ve topa karşı; boyun sert; kollar rakibi uzak tutar; çıkış hızı 15–25 m/sn (tahmin, kaynak **bulunamadı**); aşağıya, alçak köşeye (Pelé 1970 ve Zidane 2006'nın "aşağı doğru kafa"ları — H.4).
- **Gerçek sayılar:** bkz. C8. Altı pas içi: şut %40, kafa < %25; altı pas çizgisinin ardında merkez: şut %20, kafa %10; ceza sahası yanlarında ayakla şut kafanın yaklaşık 2 katı dönüşür [K10]; kafa bloklanması çok daha az [K10]. Dünya Kupası 2018'de kafa golü 31 (%18,3) [K54], 2026'da (16'lara kadar) kafa dönüşümü %11,4, isabet %33,5 [K57]. Kariyer rekoru: Jimmy McGrory 162, C. Ronaldo 158 kafa golü (Vikipedi) [K46].
- **Kalecinin cevabı:** çıkma/çıkmama kararı; uzun boylu kaleci altı pas merkezinde üstün (Courtois 3 isabetli şutun 2'sini, Pickford 11'in 1'ini kurtardı) [K18]; Buffon, Zidane'ın 104'teki sert kafasını üst direğin üstünden çıkarır (H.4); Banks, Pelé'nin kafasını üstten çıkarır (H.4).
- **Hata biçimleri:** top üstten gider, yön hatası (kaleciye), temas yerinde değil, rakibe vurma.
- **Kabiliyet eşiği:** *görme/zamanlama*; *yapma* = sıçrama, boyun, sertlik. Tip: uzun/güçlü hedef forvet.
- **Ünlü örnek:** Pelé–Banks 1970, Zidane–Buffon 2006 (kurtarılan kafalar, H.4); Silva 2012 uzak direk kafası (H.1).
- **Motor karşılığı:** `js/mac-hava.js`; `c-hava` kapısı.
- **Kaynaklar:** [K10] [K11] [K17] [K18] [K46] [K54] [K57]; Bölüm H H.1, H.4

### C10. Kafa: arka direkte geri kafa (Back-post header back across goal)
- **Durum:** arka direkte, kaleci ön direğe/ortaya kaymış; top kenardan yüksek geliyor; vurucu topun geliş yönüne ters bir yöne kafa vuruyor.
- **Seçenekler:** kaleci ortayı kapatmak için merkeze çıkmışsa top geri (geliş yönünün tersine) kafa; arka direk boşsa kafayı alçak ve geri çevirme.
- **Yürütme:** alın yan; boyun–gövde dönüşü topun geldiği yönün tersine; zamanlama kritik; çıkış hızı **bulunamadı**; hedef: yere yakın, kalecinin gerisinde (tahmin).
- **Gerçek sayılar:** ortalar ve kafalar ayaktan zor sonuç verir [K12] [K10]; "geri kafa" için sayı **bulunamadı**.
- **Kalecinin cevabı:** topun arka direğe gideceği okunursa geri adım; "yüksek pozisyon" ilkesi [K19].
- **Hata biçimleri:** top yukarı; yön; ortaya yönlendirme (kaleci kurtarır); kalecinin geri dönüşü.
- **Kabiliyet eşiği:** *görme* = kalecinin ağırlığı; *seçme* = ters yön; *yapma* = boyun kontrolü. Tip: arka direk koşucusu.
- **Ünlü örnek:** Silva 2012, uzak direğe kafa (H.1) — yönü "geri" değil uzak direk.
- **Motor karşılığı:** `js/mac-hava.js`; `c-orta`.
- **Kaynaklar:** [K10] [K12] [K19]; Bölüm H H.1

### C11. Kafa: dalarak (Diving header)
- **Durum:** alçak orta (0,3–0,8 m, tahmin), altı pas çevresi; rakip önde; ayak ulaşmıyor.
- **Seçenekler:** top alçak ve ayakla ulaşılamıyorsa; savunmacı/kaleci önüne geçmek için; riskli (sakatlık, tehlikeli oyun).
- **Yürütme:** gövde yatay, baş topun önünde, alın temas; kollar öne/iniş koruması; çıkış hızı gelen topun hızına bağlı; açık veride `Diving Header` etiketi [K38].
- **Gerçek sayılar:** **bulunamadı**.
- **Kalecinin cevabı:** alçak kafaya kısa tepki süresi; yere yakın top.
- **Hata biçimleri:** topu kaçırma, yüze çarpma, yönü kaybetme, rakip ayağına kafa (tehlikeli oyun).
- **Kabiliyet eşiği:** *yapma* ve cesaret. Tip: cesur forvet.
- **Ünlü örnek:** Van Persie, 2014 DK Hollanda–İspanya (genel bilgi).
- **Motor karşılığı:** `EYLEM_ADIM.kafa` plonjon; galeri `t14plonjon`.
- **Kaynaklar:** [K38]

## 2.4 Vole ve yarım vole

### C12. Yan vole, gövde yatık (Side volley, torso leaning away)
- **Durum:** top yan/geriden havadan ya da kornerden; vuruş yüksekliği diz–bel; 6–16 m (tahmin); kaleci hazır; baskı orta.
- **Seçenekler:** top yere inmeden çok kısa zamanda; top vücuda yakın ve yatay ise yan vole (kalça açma); top yüksekse kafa/göğüs.
- **Yürütme:** destek ayağı topun yanı (hafif geride); gövde karşı yana yatık (kalçanın açılması); kalça–diz–ayak zinciri yatay salınım; ayak üstü (laces), parmak ucu aşağı, ayak bileği kilitli, diz topun üzerinde → top aşağı vurulur ve topspin alır [K36]; hız 22–30 m/sn (tahmin).
- **Gerçek sayılar:** vole dönüşümü **bulunamadı**; açık veride `Volley` etiketi [K38]. Motor: vole yön hatası ×1,3, kötü vuruş olasılığı ×7 (mevcut kalibrasyon, kaynaksız).
- **Kalecinin cevabı:** yüksek hız + kısa mesafe → tepki süresi az; PS xG hızı da kullanır [K15].
- **Hata biçimleri:** topun altına (yukarı), üstüne (yerde), yana; zamanlama (erken/geç); gövde fazla yatık → yüksek.
- **Kabiliyet eşiği:** *yapma* çok yüksek; *görme* = top uçuşunun erken okunması. Tip: teknik kanat/10/yetenekli forvet.
- **Ünlü örnek:** Zidane 2002 ŞL finali (sol ayak, gövde kaleye yarı dönük, havadan üst köşe); Van Basten Euro 1988 (kaleye ~8 m, çizgiye 5–6 m'lik dar açıdan sağ ayak topspin vole); Pavard 2018 (dış üst ayakla yan vole); Mbappé 2022 (gelişine sağ ayak yan vole) — H.1.
- **Motor karşılığı:** `VURUS_STIL.vole` (hız 0,9); H kabulü: açı < 20° ve top omuz hizasında gelince "vole" düşük olasılıkla da üretilsin; "uzak direk vole" sınıfı sıfır olmasın.
- **Kaynaklar:** [K15] [K36] [K38]; Bölüm H H.1

### C13. Yarım vole (Half-volley)
- **Durum:** top yere indikten hemen sonra; 6–25 m; yükseklik düşük (diz altı).
- **Seçenekler:** top vole'ye fazla yüksek ve düşüyorsa; sekmenin hemen sonrasını yakalama; vole'den daha doğru olabilir [K36].
- **Yürütme:** ayak sekmeden önce yere yakın, topun üstünde "kapalı" vuruş, temas sekmenin hemen sonrasında (tahmin); ayak üstü; diz topun üzerinde; takip kısa; topspin; hız 22–30 m/sn (tahmin).
- **Gerçek sayılar:** **bulunamadı**; tanım: yerden sekmeden sonra temas [K38]. Motor: yarım vole yön hatası ×1,12, kötü vuruş olasılığı ×6 (kaynaksız).
- **Kalecinin cevabı:** alçak ve sert vuruşa tepki; sekme kalecinin okumasını bozar (tahmin).
- **Hata biçimleri:** sekmeyi erken/geç okuma; topun üstüne/altına; çimen sekmesi.
- **Kabiliyet eşiği:** *yapma/görme* (sekme zamanlaması) yüksek. Tip: teknik orta saha/forvet.
- **Ünlü örnek:** Drogba–Liverpool 2006 (penaltı yayından) [K36]; Iniesta 2010 (116'); İlhan 2002; Vardy 2016 (~25 yd'dan, sekme sonrası üst köşe) — H.1.
- **Motor karşılığı:** `VURUS_STIL.yarimVole` (hız 0,95).
- **Kaynaklar:** [K36] [K38]; Bölüm H H.1

### C14. Dış ayak vole / yakın dış ayak bitiriş (Outside-of-the-foot finish)
- **Durum:** top gövdenin yanında, yan koşuda; hazırlık süresi yok; 8–20 m.
- **Seçenekler:** ayağı topa getirecek süre yoksa dış ayakla dokunuş (zaman kazandırır); kaleciye ters köşe.
- **Yürütme:** dış ayak üstü; ayak bileği sert; dönüş dış tarafa (Magnus) [K37]; hız 18–27 m/sn (tahmin); ayağın vücut dışına dönük geçişi.
- **Gerçek sayılar:** **bulunamadı**. Motor: dış ayak yön hatası ×1,22 (kaynaksız).
- **Kalecinin cevabı:** bükülen/yan dönüşlü top için okuma güçlüğü (tahmin).
- **Hata biçimleri:** ayak teması zayıf (top sönük); fazla bükme; hedefi ıskalama.
- **Kabiliyet eşiği:** *yapma* çok yüksek. Tip: Brezilya tarzı teknik oyuncu (Quaresma örneği) [K37].
- **Ünlü örnek:** Pavard 2018 (dış üst ayakla yan vole, uzak köşe) — H.1.
- **Motor karşılığı:** `VURUS_STIL.dis` (hız 0,8; sap 1,22).
- **Kaynaklar:** [K37]; Bölüm H H.1

## 2.5 Ceza sahası dışından

### C15. Uzaktan falso, uzak köşe (Curled finesse shot to the far corner)
- **Durum:** 16–25 m; yarım merkez; kaleci set; baraj yok ya da yan; savunma baskısı düşük; top kontrollü.
- **Seçenekler:** kaleci yakın direğe kaymışsa ve uzak köşe açıksa; savunmacının arkasından bükme; kaleci merkezdeyse yakın üst köşe; bloğa karşı eğri.
- **Yürütme:** iç ayak (inside of the instep): topun dış-alt kenarı; ayak topu "sarar"; destek ayağı topun yanında/hafif geride; gövde hedefin dışına açık; takip çapraz; hız 20–27 m/sn (tahmin); yatay sapma 1,5–4 m (tahmin). Yan dönüş Gerrard tipi serbest vuruşta ≈ 10 dev/sn, Magnus kuvveti başlangıçta topun ağırlığı kadar [K67].
- **Gerçek sayılar:** köşe ≥ %50, merkez ≈ %12 [K13]; Sterling'in sağ üst köşe serbest vuruşu 0,81 xGOT [K22]; uzak şut 0,03 xG [K12]; sağ ayaklı hata eğilimi: hedefin sol-altı/sağ-üstü [K6]. Serbest vuruş bağlamı: bkz. F.2.0–F.2.1.
- **Kalecinin cevabı:** set + hafif yakın direğe; uzak köşeyi uzanmak için iki adım gerekir; Courtois "reaktif; vurucu topa değdikten sonra kapatır" [K18].
- **Hata biçimleri:** üst direğin üstü (en sık, tahmin), blok (savunmacı/baraj), merkeze sapma, zayıf bükme; baskıda acele.
- **Kabiliyet eşiği:** *yapma* = yüzey tutarlılığı; *görme* = kalecinin yeri; *seçme* = mesafe/açı. Tip: teknik 10/kanat.
- **Ünlü örnek:** Del Piero 2006 (içe kesen falso, üst köşe) — H.1; Beckham 2001 (serbest vuruş) — H.3.
- **Motor karşılığı:** `SUT_TUR.falso` (stil `falso`, hız 0,85); `kaleciEgri` (kaleci dönen topu geç okur); eğri yönü vuran ayaktan (`sutEgriYani`); 9 m'den falso adayı (`sutYeni`).
- **Kaynaklar:** [K6] [K12] [K13] [K18] [K22] [K67]; Bölüm H H.1, H.3; Bölüm F F.2

### C16. Düşen sert vuruş (Dipping power drive / knuckle)
- **Durum:** 20–30 m; kaleci set, ileride; baraj ya da yok.
- **Seçenekler:** kaleci öne çıkmış ya da yüksek/yan köşe erişimi zayıfsa; mesafe uzaksa güçlü ve düşen top; hata maliyeti yüksek.
- **Yürütme:** ayak üstü ve topun merkezine temas (az dönüş → knuckle) ya da bilinçli topspin; vücut topun üstünde; kısa–orta takip; 26–33 m/sn (tahmin; kaynak aralığı 18–35, DK 1990: 32–35 [K27]); yol kararsız (knuckle) ya da son metrelerde düşen (topspin) (tahmin). Juninho "neredeyse dönüşsüz" vuruş (H.3); fizik F.2.2'de (≈ 27 m/sn, ≈ 5 dev/sn, ≈ 3,5 m sapma örneği).
- **Gerçek sayılar:** **bulunamadı**; uzak şut 0,03 xG [K12]; köşeye giderse xGOT yüksek [K22].
- **Kalecinin cevabı:** set; düşen topu yakalama/geri çevirme zor; Courtois'in "güç üretme" zorluğu [K18].
- **Hata biçimleri:** dışarı/üst direk; blok; ayak üstü kayma.
- **Kabiliyet eşiği:** *yapma* (güç + temas). Tip: güçlü şutör (orta saha).
- **Ünlü örnek:** Juninho (spin'siz top), Roberto Carlos 1997 — H.3.
- **Motor karşılığı:** `SUT_TUR.dusen` (stil `ust`, kz 1,05, ky 0,85; hedef yüksekliği 1,9 m).
- **Kaynaklar:** [K12] [K18] [K22] [K27]; Bölüm H H.3; Bölüm F F.2

### C17. Dış ayak trivela, uzaktan (Outside-foot curler from distance)
- **Durum:** 15–30 m; savunmacı/baraj yanından bükme; kaleciye ters köşe.
- **Seçenekler:** hedef taraf iç ayakla çevrilemiyorsa; savunmacıyı dışarıdan dolanmak; beceri ≥ 0,65 (motor kapısı).
- **Yürütme:** dış ayak üstü; topun iç-alt tarafına temas → dış tarafı kıvırır; ayak bileği sert; dönüş dış/Magnus [K37]; hız 18–27 m/sn (tahmin).
- **Gerçek sayılar:** dönüşüm **bulunamadı**. Roberto Carlos'un 1997 serbest vuruşu sol ayağın dışıyla atıldı [K37]; mesafe ≈ 35 m (bazı kaynaklar 30 m) ve fizik açıklaması H.3 kaydında; eğri vuruş fiziği 1.5 ve [K67].
- **Kalecinin cevabı:** topun ilk yönüne göre tepki (yanılgı), geç içe kırılma (H.3 kabulü).
- **Hata biçimleri:** zayıf temas, fazla bükme, baraja çarpma.
- **Kabiliyet eşiği:** *yapma* çok yüksek (dış ayak yön hatası ×1,22 ve toplam ≈ 1,6). Tip: teknik kanat.
- **Ünlü örnek:** Roberto Carlos 1997 (H.3); Quaresma [K37].
- **Motor karşılığı:** `SUT_TUR.trivela` (stil `dis`, kz 1,3, ky 0,9); yalnız şut ≥ 0,65.
- **Kaynaklar:** [K37]; Bölüm H H.3

### C18. Uzaktan plase (Placed low drive from distance)
- **Durum:** 18–25 m; merkez; kaleci set; savunmacılar çevrede (kompakt blok).
- **Seçenekler:** kaleci merkezdeyse alçak köşelere; bloktan kaçınmak için açı arayıp şut penceresi bulunca.
- **Yürütme:** ayak üstü/ayak içi-üstü, topun merkezi/üst yarısı (top yerde kalsın); 22–28 m/sn (tahmin); hedef alçak köşe.
- **Gerçek sayılar:** 0,03 xG [K12]; ASA'da şutların %70'i < 0,10 [K24]; 2002 DK: 930 şut → 93 gol [K45]; Klinsmann: kompakt blokta 20–25 yd'dan şut zor [K33]; alçak hedef daha hassas [K6]; şutların bloklanma oranı kafadan ≈ 3 kat [K10]. DK 2018'de açık oyun gollerinin %19,4'ü uzaktan şuttan (19 gol, 8'i iç ayakla) [K54]; ŞL 2015/16'da uzaktan açık oyun golü 25 — kayıtların en düşüğü, bir önceki sezon 36 [K72]. Bugünkü PL'de şutların 9,0/maçı kutu dışından (kutu içi 18,4) [K58].
- **Kalecinin cevabı:** alçak köşe için dalış; geniş blok yok; reaktif.
- **Hata biçimleri:** blok; merkeze; üst direk.
- **Kabiliyet eşiği:** *görme* = şut penceresi; *yapma*. Tip: uzaktan şutör (orta saha); `uzaktanVurur` eğilimi.
- **Ünlü örnek:** **bulunamadı**.
- **Motor karşılığı:** `SUT_TUR.plase`; `sutSecenegi` uzak şut isteği (`sutIstekMesafe`, `uzaktanVurur`).
- **Kaynaklar:** [K6] [K10] [K12] [K24] [K33] [K45] [K54] [K58] [K72]

## 2.6 Dar açıdan

### C19. Dar açı: yakın direk (Near-post finish from a tight angle)
- **Durum:** kale çizgisine yakın (açı çok dar), kaleci yakın direği kapatır; çoğu kez hızlı geliş.
- **Seçenekler:** kaleci yakın direği kapatmıyorsa (uzak direğe yer değiştirmişse) yakın direğe; yoksa C20 veya C21.
- **Yürütme:** sert ayak üstü ya da dış ayak, yakın direğin üst köşesi; kısa geri salınım.
- **Gerçek sayılar:** ceza sahası yan konumları ≈ %5,6 dönüşüm [K21]; merkez yandan iyidir çünkü yanlar kaleci açısını daraltır [K12]; yan konumlarda ayakla şut kafanın ≈ 2 katı [K10].
- **Kalecinin cevabı:** aynı taraftaki bacağı yana at, split, üst gövde geniş [K40]; yakın direğe öncelik.
- **Hata biçimleri:** kalecinin bacağına/eline; direğin yanı; fazla güç → dışarı.
- **Kabiliyet eşiği:** *yapma*; *seçme* (C20/C21'e karşı). Tip: kanat/forvet.
- **Ünlü örnek:** Van Basten 1988 (dar açı; ancak vole) — H.1.
- **Motor karşılığı:** `SUT_TUR.sert`; dar açı cezası H kabulünde.
- **Kaynaklar:** [K10] [K12] [K21] [K40]; Bölüm H H.1

### C20. Dar açı: uzak direğe kesme (Cut across to the far post)
- **Durum:** dar açı, kaleci yakın direği kapatmış, uzak köşe açık; savunmacı baskısı.
- **Seçenekler:** C19 kapalıysa; uzak köşeye bükme (inswinger) ya da alçak çapraz; kaleci uzak direğe geç kalıyor.
- **Yürütme:** iç ayak ile bükme; yaklaşma açısı kale çizgisine paralele yakın; dış-alt yarı temas; 18–25 m/sn (tahmin); yol: yakın direk dışından iç kıvrılan.
- **Gerçek sayılar:** **bulunamadı**; köşe farkı [K13]; sağ ayaklı hata eğilimi [K6].
- **Kalecinin cevabı:** yakın direği kapatmak uzak direğe erişimi zayıflatır [K40].
- **Hata biçimleri:** yakın direk dışı, kalecinin kapattığı yere, yetersiz bükme.
- **Kabiliyet eşiği:** *yapma* yüksek, *görme*. Tip: teknik kanat/forvet.
- **Ünlü örnek:** **bulunamadı**.
- **Motor karşılığı:** `SUT_TUR.falso`; `sutEgriYani` ayak–taraf eşlemesi.
- **Kaynaklar:** [K6] [K13] [K40]

### C21. Dar açı: geri pas tercihi (Cutback instead of a tight-angle shot)
- **Durum:** dar açı + arkada boş oyuncu + kaleci yakın direkte; savunma geri dönüyor.
- **Seçenekler:** şutun xG'si (≈ 0,05–0,06, [K21]) geri çevirme pasından doğan şansın altındaysa pas; StatsBomb mantığı: koşucuya pas → bire bir ≥ 0,40 (başarı %10 olsa bile pozitif beklenti) [K12].
- **Yürütme:** alçak, yerden, ayak içi; 10–16 m/sn (tahmin); hedef: penaltı noktası–uzak direk hattı; gövde ve bakış kalecinin/savunmanın yönünü yanıltır (tahmin).
- **Gerçek sayılar:** yan konum şutu ≈ %5,6 dönüşüm [K21]; Golden Zone'a geri çevirme %25 dönüşüm [K50]; Zone 17'ye 100 pasta gol: geri çevirme 6,4 ↔ orta ≈ 2,5 [K51]; geri çevirmeden anahtar pas dönüşümü %14 [K49]; ŞL 2023/24 gollerinin %30'u alçak orta/geri çevirmeden [K71]; şutla geri çevirme arasındaki seçimin kaynaklı bir eşiği **bulunamadı**.
- **Kalecinin cevabı:** arkadan gelen oyuncuyu okuyup kaymak; gelen şut yakın direğe.
- **Hata biçimleri:** geç pas, ters pas, savunmacıya.
- **Kabiliyet eşiği:** *görme* + *seçme* yüksek (cömert karar); tip: oyun kurucu kanat.
- **Ünlü örnek:** Fàbregas → Silva 2012 (H.1).
- **Motor karşılığı:** geri çevirme ilkeli (`geri çevirme`, B bölümü); orta/şut seçenek değeri karşılaştırması (`sutSecenegi` ↔ pas değeri).
- **Kaynaklar:** [K12] [K21] [K24] [K49] [K50] [K51] [K71]; Bölüm H H.1

## 2.7 Burunla dürtme, topuk, karambol, boş kale

### C22. Burunla dürtme ve topuk (Toe-poke and backheel)
- **Durum:** 1–6 m; süre çok kısa; top hızlı/yan; ayak hazır değil.
- **Seçenekler:** gelişine vuruş yapılamıyorsa kısa dokunuş: toe-poke (ayak ucu), topuk (ters yön); rakip 0,3 sn içindeyse burunla dürtme (motor kuralı).
- **Yürütme:** toe-poke: geri salınım yok, ayak ucu temas; 8–18 m/sn (tahmin); yön kalecinin dışına; topuk: ayak topun üstünden geriye hafif temas, çıkış hızı düşük (tahmin).
- **Gerçek sayılar:** `Backheel` etiketi var [K38]; dönüşüm **bulunamadı**.
- **Kalecinin cevabı:** kısa mesafede tepki; top ayağa gelir.
- **Hata biçimleri:** ayak ucu yön vermez (sapma), zayıf; topuk: yön ve güç.
- **Kabiliyet eşiği:** *yapma*/refleks. Tip: poacher.
- **Ünlü örnek:** Kluivert 1995 ŞL finali (sol ayakla Rossi'yi geçen dürtme) — H.1.
- **Motor karşılığı:** `VURUS_STIL.burun` (hız 0,8; sap 1,4).
- **Kaynaklar:** [K38]; Bölüm H H.1

### C23. Kısa mesafe karambol / itme (Scramble / poach)
- **Durum:** 1–6 m; kalabalık; sekme/kaleciden dönen top; çoklu vücut.
- **Seçenekler:** ilk ulaşan vücut parçasıyla itme.
- **Yürütme:** tek temas, ayak/göğüs/kafa/diz herhangi yüzey; hız düşük–orta; öncelik yönü kaleye çevirmek (tahmin).
- **Gerçek sayılar:** altı pas içi şut dönüşümü %40 (karambol dahil olabilir; kaynak ayırmıyor) [K10]; through-ball ortalama %30 [K24].
- **Kalecinin cevabı:** yere yatmış/ayakta; ikinci kurtarış güç; kaleci–top 2–7 m [K19].
- **Hata biçimleri:** topa üstten vurma, kaleciye çarpma, ofsayt/savunmacı çıkarması.
- **Kabiliyet eşiği:** *görme* (pozisyon sezgisi) en yüksek; *yapma* düşük. Tip: poacher.
- **Ünlü örnek:** Baggio'nun penaltılarında sekmeden gol (Vikipedi, atıfsız) [K8].
- **Motor karşılığı:** `sutIkinci` (dönen top) ve ikinci top görevlisi (yay + altı pas; B/H bölümleri).
- **Kaynaklar:** [K10] [K19] [K24]

### C24. Boş kale (Open goal)
- **Durum:** kaleci pozisyon dışı/yerde; kale ile vurucu arasında oyuncu yok (StatsBomb `open_goal`: arada oyuncu yok [K16] [K38]).
- **Seçenekler:** iç ayak (yan ayak) ile yavaş ve kontrollü; kalecinin dönüşünden önce güvenli.
- **Yürütme:** yan ayak; bakış topta; destek ayağı topun yanı; 8–15 m/sn (tahmin).
- **Gerçek sayılar:** dönüşüm **bulunamadı**; xG mesafe/açı bağımlı [K16]; penaltısız şutta xG ≥ 0,78 PL'de %0,8 [K47].
- **Kalecinin cevabı:** çizgideki savunmacı varsa "open goal" değildir.
- **Hata biçimleri:** acele, topun üstüne, yan ayak kayması; top sekmesi.
- **Kabiliyet eşiği:** *yapma* (soğukkanlılık); baskı altında hata artar (tahmin). Tip: herkes.
- **Ünlü örnek:** **bulunamadı**.
- **Motor karşılığı:** `plase`; `open_goal` benzeri bayrak ölçümde.
- **Kaynaklar:** [K16] [K38] [K47]

## 2.8 Penaltı

### C25. Penaltı: bakmadan, kaleciden bağımsız strateji (Keeper-independent penalty)
- **Durum:** 11 m, durağan top; kaleci çizgide, vuruşta bir ayağı en az çizgide/üstünde/gerisinde [K9]; maç içi ya da seri penaltı; baskı düzeyi (sıra, tur önemi). Oyuncu hareketi: koşu 4–8 adım, 20–45° açı (tahmin; sahne akışı F.4.1).
- **Seçenekler:** (1) kaleciden bağımsız: hedef ve güç koşudan önce seçilir; (2) kaleciye bağımlı (C26). Seri penaltıda (395 vuruş) bağımsız strateji vuruşların %72,7'si, bağımlı %27,3'ü [K4]. Karar: kendi hassasiyetine güvenen, baskısı yüksek, kaleciyi okuyamayan → bağımsız; kaleci erken dalıyorsa → bağımlı.
- **Yürütme:** iç yan ayak ya da ayak üstü; destek ayağı topun yanı (kalecinin ipucu: destek ayağı yönü > %80 oranında vuruş yönünü verir [K4]); hız 22–30 m/sn (tahmin; uçuş ≈ 0,37–0,50 sn hesabı bkz. 1.6; kaynak "≤ 500 ms" [K4]); alçak köşe (PL penaltılarının %81,3'ü alçak bölgeye, hesap [K3]; Danimarka'da %70,7 [K63]; ŞL/AL'de %75 [K69]). Koşu: 4–6 adım en başarılı, 10 m'lik en başarısız (ikincil haber) [K61].
- **Gerçek sayılar:**
  - *Dönüşüm ve kurtarış:* Avrupa ligleri 2008/09–2021/22 %76,5–%79,8; Bundesliga 1963–2004 %74,25; DK seri penaltı %69,4 [K8]; PL 2023/24 %89,6 (106 penaltı; rekor), 2022/23 %74,8, 2020/21–23/24 %81,9; kurtarılan pay %7,5 (2023/24) – %26,3 (2017/18); xG 0,78 [K47].
  - *Yön ve yerleştirme:* 286 penaltı (2009–10, dört lig): 217 gol (%75,9); alt-sol %36,7, alt-sağ %30,1; yerleştirme sonucu anlamlı etkilemiyor (p = 0,231), kalecinin doğru bölgeye gitmesi etkiliyor [K2]. Bar-Eli: 311 vuruş (286 analiz): vuruş yönü (kaleci gözünden) sol %32,2, orta %28,7, sağ %39,2; kaleci sola %49,3, ortada %6,3, sağa %44,4; kurtarma kalınca %33,3 (orta vuruşta 6/10 = %60), atlayınca %14,2 / %12,6; genel %14,7 [K1].
  - *Seri penaltı ve baskı:* Jordet ve ark. genel %78,9; sıraya göre 1. %86,6, 2. %81,7, 3. %79,3, 4. %72,5, 5. %80,0, 6–9. %64,3; McGarry–Franks maç içi %85,2, seri %75,6; Dalton ve ark. (2002–2010 DK/Euro) seri %73, maç içi %68 (63 maç içi penaltı); "kaçırırsa yenilgi" vuruşlarında %30 daha az gol [K7]. ≈ 50.000 penaltılık son 11 sezon verisinde seri penaltı dönüşümü anlamlı biçimde düşük (vurucunun performansından, kaleciden değil) [K64].
  - *Bölgeler ve çerçeve dışı:* PL bölgeleri: yüksek ≈ %96–97, alçak ≈ %78–81 (1.2). Şampiyonlar/Avrupa Ligi, 536 penaltı (5 yıl; uzatma ve seri hariç): %76 gol, %19 kurtarış, %5 çerçeve dışı; yüksek bölge penaltıların %25'i ve %82 gol, alçak bölge %75'i ve %74 gol; en yüksek dönüşüm üst köşelerde, en düşüğü alçak ortada; kurtarışlar en çok ortaya giden toplarda, en az üst köşelerde; sağ ayaklıda yüksek %84 ↔ alçak %75, solakta yüksek %73 ↔ alçak %69; 31–60. dakikada %71 (öteki dilimlerde %78–79) (Almeida ve ark. 2016; ikincil aktarım) [K69]. Aynı büyüklükte (536) bir çalışmaya göre vurucular üst köşeden kaçınıyor: gol şansından bir puan vermek karşılığında çerçeve dışı riskini üç puan azaltıyorlar [K62]. Danimarka birinci ligi 2015/16–2019/20 (263 penaltı): %74,1 gol, %19,4 kurtarış, %6,5 çerçeve dışı; %70,7 alçak, %29,3 yüksek [K63].
- **Kalecinin cevabı:** doğru bölgeye gidiş: gol %52,7 ↔ %90,3 [K2]; erken dalış (temastan ≥ 200 ms önce) vuruşların %33,9'unda, vurucunun skoru %68,7 ↔ geç dalışta %76,3 [K4]; kaleci ayrılma zamanı ortalama temastan 0,22 ± 0,11 sn önce (330 penaltı, 34 seri) [K5]; çizgiden ayrılma %80 (129 seri penaltısı, Hughes & Wells 2002) [K8]; yalnız %6,3 ortada kalır [K1]. Etki: bağımsız vurucuda kaleci dalışı sorun değil, köşe/güç asıl hata kaynağı; kaleci ortada kalırsa orta vuruş kurtulur.
- **Hata biçimleri:** çerçeve dışı payı %5–6,5 (ŞL/AL %5 [K69]; Danimarka %6,5 [K63]); "yüksek ve orta" en riskli: üst direğin üstü (Vikipedi, atıfsız) [K35]; vurucular üst köşeden kaçınıp daha kurtarılabilir bölgelere vuruyor [K62]; zayıf yerleştirme, kalecinin tarafına yakın orta; baskı altında acele (sıra 4 → %72,5 [K7]); aldatma/çift temas ihlali [K9].
- **Kabiliyet eşiği:** *görme* = (bağımlıda) kalecinin ağırlık geçişi; *seçme* = strateji; *yapma* = yerleştirme + soğukkanlılık (`plaseVurur`, `sogukkanlilik`). Tip: penaltı uzmanı (PL'de penaltıların %41,5'i solak, 2023/24 [K47]).
- **Ünlü örnek:** Cole Palmer, PL'de en çok penaltıyı hiç kaçırmadan atan (12) [K3]; ayrıntı F.4.
- **Motor karşılığı:** `penaltiPlani` (hedef ±2,9 m + `penaltiKose` 0,46 m, yükseklik 0,3/1,0/2,0, güç 0,7/0,85/1,0); `penaltiSapmaK`; `d-penalti` kapısı. Sahne: F.4.1.
- **Kaynaklar:** [K1] [K2] [K3] [K4] [K5] [K7] [K8] [K9] [K35] [K47] [K61] [K62] [K63] [K64] [K69]; Bölüm F F.4

### C26. Penaltı: bakarak, duraklı koşu (paradinha) ve Panenka (Keeper-dependent, stutter run-up, chip)
- **Durum:** kaleci erken dalan; vurucu soğukkanlı; seri penaltı (baskı yüksek) ya da maç içi.
- **Seçenekler:** kaleciye bağımlı: yavaş/duraklı koşu + kaleci ağırlığını verince ters köşe ya da ortaya yumuşak; Panenka (kepçe) kaleci erken dalıyorsa [K34]. Kural: koşu sırasında aldatma serbest, koşu bittikten sonra vuruş aldatması ihlal (vurucuya sarı, savunmaya endirekt) [K9].
- **Yürütme:** yavaş koşu, 1–2 duraklama, bakış kalecide; vuruş topun altına hafif dokunuşla (Panenka), hız düşük, kaleci yetişmeden önce iner [K34]; bağımlı vurucular kaleciye daha çok, topa daha az bakar, koşu daha yavaş, top hızı düşük (F.4.0'da aktarılan Noël & van der Kamp 2012; ikincil).
- **Gerçek sayılar:** 395 seri penaltı: bağımsız %72,0, bağımlı %74,7 (yazarlar arasında anlamlı fark yok). Kaleciye karşı birleşik tablo: bağımlı vuruş erken dalışa %81,8 (36 gol), geç dalışa %63,6 (42 gol); bağımsız vuruş erken dalışa %60,0 (54 gol), geç dalışa %79,7 (157 gol) (tabloda küçük sayı tutarsızlığı ve test istatistiği tutarsızlığı var) [K4]. Hunter ve ark.: temasa yakın tahmin doğruluğu yan ayakta ≈ %90, ayak üstünde ≈ %80; −0,4 sn'de %55–64; yan ayak vuruşu hızlandıkça daha tahmin edilebilir, ayak üstünde hız etkisi az; yazarlar yan ayakla maksimumun altında vurmayı önerir [K5]. Panenka: dönüşüm diğer penaltılardan 4–5 puan düşük olabilir (küçük örnek) [K3]. 2019 kuralı ve VAR sonrası PL'de kurtarma payı %19,1 → %11,7 [K47]. Süre (ikincil haber): düdükten 3 sn içinde atış sürpriz sağlar, 13 sn'den uzun bekleme kaleciyi rahatsız eder, kaleci hareketini bekleyip vurmak şansı artırır [K61].
- **Kalecinin cevabı:** son ana kadar beklemek, ortada kalmak; ipucu = destek ayağı yönü [K4]; kaleciden "dikkat dağıtma" ≈ %10, "oyalama" ≈ %20 daha az gol (Vikipedi, kaynaksız) [K35]; kaleci kaybederken %71 sağa atlıyor, öndeyken %48, berabere %49 (Psychological Science 2011; Vikipedi aktarımı) [K35]. Etki: bekleyen kaleciye karşı zayıf top kurtarılır.
- **Hata biçimleri:** kaygı arttıkça vurucu kaleciye daha çok bakıyor ve vuruşu merkeze kayıyor (Exeter çalışması; ikincil haber) [K61]; duraklı koşuda vuruş kalitesi düşer (düşük top hızı); aldatma kuralı ihlali (koşu bittikten sonra) [K9]; çift temas: kasıtsız → gol olursa tekrar, olmazsa endirekt serbest vuruş [K9]; Panenka'da fazla yükseklik/kaleci beklerse yakalar.
- **Kabiliyet eşiği:** *görme* = kalecinin ağırlık geçişi (yüksek); *seçme* = strateji değişimi (soğukkanlılık); *yapma* = ince. Tip: Pirlo/Totti/Zidane tipi usta.
- **Ünlü örnek:** Panenka 1976, Totti Euro 2000, Zidane 2006 DK finali, Pirlo Euro 2012, Hakimi 2022, Benzema 2022; başarısız: Lineker 1992, Messi 2024 (direk) [K34].
- **Motor karşılığı:** `penaltiDurak` (duraklı koşu hata ×1,1), `penaltiPlani`'nda ters köşeye dönüş ×1,15; kaleci ~%45 aynı yana uçar, ~%10 ortada kalır; `d-penalti`.
- **Kaynaklar:** [K3] [K4] [K5] [K9] [K34] [K35] [K47] [K61]; Bölüm F F.4.2–F.4.3

## 2.9 Kötü vuruş biçimleri

### C27. Kötü vuruş biçimleri (How finishing goes wrong)
- **Durum:** hazırlıksız (acele), baskı altında, zayıf ayakla, gelişine/havadan, kötü/ıslak zeminde.
- **Seçenekler:** zorlamak yerine iç ayak itme, tek dokunuş kontrol, geri pas (C21) — risk–ödül.
- **Yürütme (hata türleri):** (1) *üstüne vurma / ıskalama yukarı* (skied): gövde geride, destek ayağı çok geride, topun merkezinin altına temas (tahmin); topun merkezinden uzak temas hızı düşürür, dönüşü artırır [K27]; (2) *altına girme* (undercut): topun altına, yükselir; (3) *ayağın kenarı* (shank/slice): ayağın kenarı topa, yan yönde; (4) *ıska*; (5) *sekme*: zemin ve çimen.
- **Gerçek sayılar:** biçim dağılımı **bulunamadı**. Yönsel ipucu: sağ ayaklı oyuncular hedefin sol-altına ya da sağ-üstüne kaçırma eğiliminde [K6]. 286 penaltının %24,1'i gol olmadı (kurtarış + kaçırma) (hesap) [K2]; motor yorumu: penaltıların ≈ %7'si dışarı/direk (kaynağı yorumda yok).
- **Kalecinin cevabı:** —
- **Hata biçimleri:** yukarıdaki beş tür; nedenler: acele, baskı, zayıf ayak, yüzey (dış ayak yön hatası ×1,22, burun ×1,4, vole ×1,3, yarım vole ×1,12, gelişine ×1,35 — mevcut motor kalibrasyonu), yorgunluk (×(1+0,35·yorgunluk)), güven.
- **Kabiliyet eşiği:** *yapma* (teknik) ve soğukkanlılık; güven.
- **Ünlü örnek:** Baggio 1994 DK finali seri penaltısı (üstten) (genel bilgi); Lineker 1992 Panenka kaçırma [K34]; Robben 2010 (62' aşırtma yetmedi, H.4).
- **Motor karşılığı:** `kotuVurusOlasiligi` (gelişine ×2,5, yarım vole ×6, vole ×7; türler: altına girme, üstüne vurma, ayağın kenarı, ıska), `vurusSapma`.
- **Kaynaklar:** [K2] [K6] [K27] [K34]; Bölüm H H.4

## 3. Motor için notlar

Bugünkü kodla karşılaştırma (FUTBOL_KUTUPHANESI §10 satır 12–13): `sutSecenegi` seçeneğin değerini xG(konum, baskı)×(1−blok) ile verir ve **kaleciyi görmez**; `sutPlani` köşeyi/türü/gücü şut başladıktan sonra seçer ve kaleciyi tartar (hücre P(gol) = (1−blok)·Σ P(hücre)·(1−kurtarış)); türler yalnız mesafeden seçilir (`SUT_TUR`); `plaseVurur` ve `kaleciyiAsirtir` eğilimleri `js/mac-profil.js`'te tanımlı; açık oyun bitiriş kararında okunmuyor (grep: `plaseVurur` yalnız penaltıda duraklı koşu olasılığında, `js/mac-topla.js` satır 868; `kaleciyiAsirtir` hiçbir yerde). Bu bölümün önerileri bu boşlukları kapatır (Z6).

### 3.1 Kararın kaleciyi görmesi: durumsal bitiriş kümeleri
- **Girdi paketi (her bitiriş kararında):** vurucu→kale mesafesi ve görünür açı; kalecinin (x, z), yönü/ağırlığı, durumu (set / hareketli / yerde), çizgiden uzaklığı; baskı (en yakın savunmacının mesafesi ve yaklaşma hızı); topun geliş biçimi (yerden/havadan/sekerek, hız, yön, dönüş); vurucunun ayağı/yüzeyi ve gövde hizası; oyuncunun kabiliyeti ve hocanın şut politikası. Opta xG modeli aynı girdilerin çoğunu kullanır (mesafe, açı, kaleci konumu, şut türü: ayak/kafa/vole/bire bir; 20+ değişken) [K23]; StatsBomb savunmacıları 2B Gauss ile, kaleci konumunu ayrıca modeller ve kaleci konumunun değerini kaleci olmayan modelle kıyaslayarak ayırır [K16].
- **İki değer ayrılmalı:** *fırsat kalitesi* (xG: kaleci ve savunmacı bağlamı dahil) ve *uygulama kalitesi* (xGOT/PS xG: kaleye giriş noktası y,z ve hız) [K15] [K16] [K22]. Motorda: karar = fırsat kalitesi; yürütme = vuruş hatası dağılımı. Kabiliyet iki yerde ayrı ölçeklenir (seçmek ↔ becermek).
- **Durum kümesi → tür kümesi (karar tablosu; ilk değerler tahmin):**

| Bağlam | Kaleci durumu | Birincil | İkincil | Elenir |
|---|---|---|---|---|
| Bire bir (≤ 16 m, savunmacı arkada) | önde ≥ 3,5 m, set değil, > 9 m | aşırtma (C2) | uzak köşe plase (C1) | sert vuruş |
| | çıkış koşusunda yaklaşıyor | erken vuruş (C5); kaleci yatarsa çalım (C4) | uzak köşe plase | aşırtma |
| | set ve yakın (≤ 2 m) | çalım (C4) / yana geçiş | uzak köşe plase (C1) | aşırtma, bacak arası |
| | yere inmiş | boş kale (C24) | | şut gücü |
| | split'te | bacak arası (C6, nadir) | alçak köşe | |
| Dar açı | kaleci yakın direkte | uzak direğe kesme (C20) ya da geri pas (C21) | yakın direk (C19) yalnız kaleci kapatmıyorsa | |
| Geri çevirme | kaleci hareketli, top vurulabilir | tek vuruş (C7) | kontrol + vuruş | yüksek aşırtma |
| Orta / hava topu | altı pas–penaltı noktası, boy üstünlüğü | güçlü kafa (C9) | yönlendiren (C8), dalarak (C11) | |
| Yan/arka hava topu | diz–bel yüksekliği, baskı orta | vole / yarım vole (C12–C13) | göğüsle indir | |
| Uzak (18–30 m) | set, baraj/blok yok | plase (C18), falso (C15) | düşen (C16), trivela (C17) | |

- **Tür seçimi yumuşak:** ağırlık = beklenen gol + eğilim (`plaseVurur`, `kaleciyiAsirtir`, `uzaktanVurur`) + hoca şut politikası (tam şut isteği mesafesi, bire birde aşırtma/çalım eğilimi), Gumbel gürültüsü; kabiliyet ağırlıkları eşik-altı oyuncuda ilkeli "yapamaz" değil, **geç/yanlış** yaptırır (FUTBOL_KUTUPHANESI §4 madde 7). Gerçekte gollerin %63'ü tek dokunuşla ve %68'i doğrudan baskı altında atıldığından [K71] "tek vuruş" varsayılan, "kontrol et, sonra vur" istisna olmalı.
- **Kaleciyi okuma:** ipucu doğruluğu zamana bağlı — penaltıda destek ayağı yönü > %80 yönü verir [K4]; temasa yakın tahmin yan ayakta ≈ %90, ayak üstünde ≈ %80, −0,4 sn'de %55–64 [K5]. Motor bunu kalecinin karar zamanına (temastan 0,22 ± 0,11 sn önce ayrılma [K5]) ve vurucunun ipucu sızıntısına (yan ayak hızlandıkça tahmin edilebilirlik artar [K5]) bağlayabilir.

### 3.2 Köşe seçimi
- **Izgara:** 3×3 (sol/orta/sağ × alt/orta/üst); penaltı için referans PL'nin 6 bölgesi (1.2) [K3]. Bugünkü motor 9×3 hücreli ızgara kullanır (`SUT_HZ`, `SUT_HY`): doğru.
- **Değer:** değer(bölge) = P(çerçeve | tür, güç, kabiliyet) × P(kurtarılmama | kaleci erişimi) × (1 − P(blok)). Kaleci erişimi = kalecinin hücreye ulaşma süresi < topun uçuş süresi mi (uçuş süreleri 1.6) [K5] [K30]. Köşe/merkez farkı için hedef: isabetli şutta merkez ≈ %12, köşe ≥ %50 [K13].
- **Risk:** yüksek hedeflerin hatası fazla (alçak hedef daha hassas [K6]); penaltıda yüksek bölge çerçevede ≈ %96–97 ama çerçeve dışına gitme riski var (PL tablosu bu riski taşımıyor olabilir, tahmin) [K3]. ŞL/AL verisinde üst köşeler en yüksek dönüşümü, alçak orta en düşüğünü verir ve kurtarışlar en çok ortada olur — buna rağmen vurucular üst köşeden kaçınır (çerçeve dışı korkusu) [K62] [K69]; motorun penaltı planı bu korkuyu `penaltiKose` ve yükseklik hatasıyla zaten taşıyor.
- **Bağlama göre kayma:** kaleci yakın direğe fazla kaymışsa uzak köşe; kaleci ortada ve set ise alçak köşe/köşe üst; bloğun yanındaki bölge tercihi.

### 3.3 Güç–isabet ödünleşimi
- **Model:** iki boyutlu hata (σ_yatay, σ_dikey) hızla kuvvet fonksiyonu olarak artar; yan ayak < ayak üstü; alçak hedef < yüksek hedef; dağılımın merkezi hızla kayar, ayaklılığa göre simetrik bir önyargı vardır [K6]. Yayımlanmış parametreler okunamadı (bulunamadı): ilk değer önerisi (tahmin) σ(v) = σ_100·(v/v_maks)^p, p ∈ [1,5; 2,5]; σ_yan ayak ≈ 0,7·σ_ayak üstü; σ_dikey hedef yüksekliğiyle artar. Bugünkü motor: `gucHataCarpani(g) = (1 + c·g⁴)/(1 + c·ref⁴)` ve stil çarpanları (`ic` 1,0 hız 0,75; `ust` 1,0 hız 1,0) — yön uyumlu; ödünleşimi doğrulayacak sayısal hedef kaynakta yok. Dikkat: maksimal iç ayak vuruşu ayak üstünün ≈ %96'sı hızdadır [K65]; `ic` stilinin 0,75 oranı bir **seçimdir** (isabet için bilerek yavaş), kapasite değil — plase hız oranı kabiliyetle ve baskıyla 0,75–0,95 arasında oynayabilir (tahmin).
- **Hedef küçüldükçe ayak hızı düşer** (bilinçli takas) ve ayak bileği payı artar [K29] [K27]; kabiliyet = aynı σ için daha yüksek hız.
- **Hız tavanı:** top hızı ≈ 1,23·ayak hızı + 2,72 (birimler kaynakta belirsiz) [K28]; motor `sutHizTavani` ve `sutGucu` alt özelliği; elit tavan 32–35 m/sn [K27].

### 3.4 Gövde pozu için çizime gereken bilgi (motor → çizim sözleşmesi)
Her bitiriş için çizime şu alanlar verilmeli: tür, hedef (y,z), güç (hız), vuruş yüzeyi, destek ayağı konumu, yaklaşma açısı, gövde eğimi, temas karesi, takip. Referanslar kaynaklı olmayan satırlarda tahmindir.

| Tür | Yaklaşma | Destek ayağı | Gövde / kalça | Yüzey ve temas | Takip, baş, kollar |
|---|---|---|---|---|---|
| Plase (C1, C18) | 20–30° açılı (tahmin; ≤ 45° [K27]) | topun yanı 5–28 cm, 5–10 cm geride [K27] | topun üstünde, kalça hedefe dik | iç yan ayak, topun ortası | kısa takip hedefe; baş topta sabit; karşı kol dışarı (tahmin) |
| Sert/sürücü (C3, C16) | 30–45° [K27] | topun yanı, hafif geride [K27] | topun üstünde (top alçak kalsın) | ayak üstü (laces), topun ortası | uzun takip; baş sabit; kollar açık (tahmin) |
| Aşırtma (C2) | kısa, yavaşlayan | topun yanı, hafif geride | hafif geride | ayak üstü alt kenar/ayak ucu, topun alt yarısı | kısa yukarı takip; bakış kalecide (tahmin) |
| Falso (C15, C20) | açılı | topun yanı/hafif geride | hedefin dışına açık | iç ayak yüzü, topun dış-alt kenarı | çapraz takip (tahmin) |
| Dış ayak (C14, C17) | yan/öne | topun yanı | ayak vücut dışına dönük | dış ayak üstü, topun iç-alt tarafı | kıvrık takip (tahmin) |
| Tek vuruş (C7) | 30–45° | topun yanı | topun üstünde | yan/iç ayak üstü | kısa; baş sabit |
| Yan vole (C12) | topa göre | yanda, hafif geride | karşı yana yatık, kalça açık | laces, parmak ucu aşağı, ayak bileği kilitli, diz topun üzerinde [K36] | yatay salınım; kollar dengede (tahmin) |
| Yarım vole (C13) | topa göre | sekme noktasının yanı | topun üstünde, öne eğik | ayak üstü, sekmenin hemen sonrasında | kısa takip (tahmin) |
| Kafa (C8–C11) | koşu → sıçrama | tek/çift ayak sıçrama | yay → kırılma; plonjonda yatay | alın; yönlendirmede yan alın | boyun sabit, kollar rakibi uzak tutar (tahmin) |
| Dürtme (C22) | hazırsız | — | — | ayak ucu / topuk | geri salınım yok (tahmin) |
| Penaltı (C25–C26) | 4–8 adım geri, 20–45° (F.4.1) | topun yanı; yönü ele verir [K4] | topa dönük | iç yan ayak ya da ayak üstü | bakış kaleci/top; duraklı koşuda 1–2 duraklama |

Zamanlama anahtarları (mevcut motor): havadan topta hazırlık 0,15 sn + geri salınım 0,39 sn (`vurusSureleri`), hizalanma ≤ 28°; bu bölümün eklediği: çalımda ek 0,3–0,6 sn (tahmin), penaltıda duraklı koşu 1–2 duraklama.

### 3.5 Kaleci tarafı (durum bayrakları ve kurallar)
- **Durumlar:** set, kapatma (close-down), geniş blok (wide block), dalış, toparlanma; bire birde kapatma hızı vurucunun dokunuş aralığına göre (kısa → bekle, uzun → çık; H kabulü). Kaleci hatası: erken yatma, kararsız çıkış (H.4 Rüştü/Čech).
- **Set position:** ayaklar omuz genişliğinde, parmak uçlarında [K43]; bire birde 1 m'de tam alçak, bacaklar yakın, eller ayak bileğinde [K40].
- **Boy/erişim farkı:** uzun kaleci altı pas merkezinde ve havada üstün, agresif pozisyon tepkiyi kısar [K18]; aynı şutu kalecinin kalitesine göre farklı sonuçlandır: Donnarumma beklenen yenilen %30'u %16'ya indirdi [K20].
- **Penaltı:** kural: bir ayak çizgide [K9]; ortada kalma ≈ %6 başlangıç değeri, doğru bölgeye gidiş ≈ %38 (hesap), erken/geç dalış [K1] [K2] [K4].

### 3.6 Kural ve VAR (bugünün kuralları)
- Penaltı: kaleci vuruş anında en az bir ayağı çizgide/üstünde/gerisinde; kaleci ihlali ve gol → gol, kurtarış/kaçırmada ihlal etkiliyse tekrar (ilk ihlalde uyarı, sonra sarı); vurucu koşu sırasında aldatabilir, koşu bittikten sonra aldatırsa sarı + endirekt serbest vuruş; çift temas: kasıtsız ve gol ise tekrar, değilse endirekt serbest vuruş; VAR protokolü ayrı belge, kaynağında yok [K9]. Vikipedi'ye göre Mart 2025'te bir seri penaltıda destek ayağının topa sürtmesi VAR ile kaçırma sayıldı ve IFAB Haziran 2025'te kasıtsız çift temasın tekrar gerektirdiğini açıkladı — **ikincil, K9'la yalnız kısmen uyumlu**: kural metni esastır [K8] [K9].
- Bire bir ve geri çevirmede ofsayt/gol iptali ayrı bölümlerde (D, B).

### 3.7 Hoca ve kabiliyet katmanı
- **Hoca vektörü (bitiriş):** şut isteği ve tam istek mesafesi (`sutIstegi`, `sutIstekMesafe`), "kutuda sabır/erken şut" (C5 ↔ C21), bire birde aşırtma ve çalım eğilimi, uzak şut politikası; bitiriş antrenmanı kabiliyeti yavaşça artırır (süreklilik 0,1 olduğu için yalnızca uzun vadede) [K25].
- **20 dakikalık maç bir kesittir** (FUTBOL_KUTUPHANESI §1 madde 8): bire bir (iki takım ≈ 1–1,6 / maç), penaltı (≈ 1/18 maç), vole (nadir) görünürlüğü gerçeğin ≈ %22'si; bu yüzden kütüphane görünürlük ölçüleri 80 maç üzerinden sayılır (aşağıda).

## 4. Ölçüler

Üst belgenin kararı (§0 ve §11.1): dar kabul bantları yok; geniş *sağlık aralığı* + ilkel görünürlüğü + çeşitlilik + kabiliyet duyarlılığı. Aşağıdaki "gerçek değer" sütunu kaynaklı hedeftir; "sağlık aralığı" ve "sayaç" önerisi tahmindir.

| # | Ölçü | Gerçek değer ← kaynak | Sağlık aralığı / yön (öneri) |
|---|---|---|---|
| 1 | Penaltı dönüşümü | Avrupa ligleri %76,5–79,8 [K8]; PL son 4 sezon %81,9 (2023/24 %89,6) [K47]; ŞL/AL %76 (536) [K69]; Danimarka %74,1 (263) [K63]; 286 penaltı %75,9 [K2]; DK seri %69,4 [K8] | %72–84 (1600 atışla `d-penalti`; 80 maçta ≈ 4–5 penaltı, örnek yetmez) |
| 2 | Penaltı bölge farkı | yüksek (çerçevede) ≈ %96–97; alçak ≈ %78–81 [K3] (kapsam notu 1.2); ŞL/AL: yüksek %82 (penaltıların %25'i) ↔ alçak %74 (%75'i) [K69] | yüksek > alçak; alçak payı %70–80 [K3] [K63] [K69] |
| 2b | Penaltıda çerçeve dışı | ŞL/AL %5 [K69]; Danimarka %6,5 [K63] | %4–9 (`penaltiKose` ≈ %7 ile uyumlu) |
| 3 | Penaltıda kaleci | ortada ≈ %6,3; yana atlama ≈ %94 [K1]; doğru bölgeye gidiş ≈ %38,5 (hesap) [K2]; doğru bölgede gol %52,7 ↔ yanlışta %90,3 [K2]; erken dalışta vurucu %68,7 ↔ geç %76,3 [K4] | yön testi: doğru bölge farkı ≥ 25 puan |
| 4 | Kurtarılan penaltı payı | PL %7,5–26,3 (sezon) [K47]; Bar-Eli genel %14,7 [K1] | %8–25 |
| 5 | Seri penaltı sırası | 1. %86,6 … 4. %72,5, 6–9. %64,3 [K7] | baskı arttıkça düşme (yön) |
| 6 | Açık oyun şut → gol (penaltısız) | %9,8–11,2 [K24] [K31] | %7–16 (üst belge §11.1) |
| 7 | Uzak şut (≥ 20 m) | ≈ %3 (0,03 xG) [K12] | %1–5 |
| 8 | Bire bir şut | ≥ 0,40 xG [K12] | gerçekleşen gol payı %30–60 |
| 9 | İsabetli şutta merkez ↔ köşe | ≈ %12 ↔ ≥ %50 [K13] | merkez %8–20, köşe %40–70 |
| 10 | Kafa ↔ ayak (aynı konum) | kafa ≈ şutun yarısı; altı pasta şut %40 ↔ kafa < %25 [K10] | kafa/şut oranı 0,4–0,8 (aynı bölgede) |
| 11 | Bitiriş duyarlılığı | gol/xG süreklilik ≈ 0,1 [K25]; elit tavan ≈ 1,2–1,35 [K25] [K26] | ±0,2 `sut`/`sogukkanlilik` → gerçekleşen÷xG ±0,05–0,15 |
| 12 | Kaleci duyarlılığı | iyi–kötü kaleci: Donnarumma beklenen yenilen %30 → gerçek %16; López beklenen %23 → gerçek %29 (hesap) [K20] | iyi kalecide ≥ 8 puan düşük yenilen oranı |
| 13 | Bire bir görünürlüğü | takım başına 2,1–3,6 / maç [K33] | ≥ 1 (iki takım) / maç; aşırtma, çalım, plase üçü de 80 maçta ≥ 1 |
| 14 | Kaleci önde → aşırtma | aşırtma payı kaleci ≥ 3,5 m önde iken, set iken payın ≥ 3 katı (tahmin) | bağlam duyarlılığı |
| 15 | Vole + yarım vole | gol payı bulunamadı; Vardy/Zidane/Van Basten tipi sınıflar sıfır olmamalı (H.7) | ≥ 1 / 10 maç |
| 16 | Bitiriş çeşitliliği | — | tür dağılımı entropisi; aynı oyuncuda tür tekrarı payı |
| 17 | Zamanlama | penaltı uçuşu ≈ 0,37–0,50 sn (hesap), kaleci ayrılma −0,22 ± 0,11 sn [K5] | penaltıda kaleci ayrılma ortancası −0,3…−0,1 sn |
| 18 | Kötü vuruş payı | bulunamadı | tür dağılımı bilgi satırı |
| 19 | Gol tekniği dağılımı (gol payı) | iç ayak/plase %35–42; ayak üstü/güç %18–33; kafa %17–24 (DK 2018, ŞL 2009/10, DK 2010) [K54] [K56] [K57] [K70]; dış ayak ≈ %4 [K54] | plase 25–50, kafa 10–28, dış ayak 1–8 (öneri; "kendi kalesine" ve penaltı hariç) |
| 20 | Uzaktan şut (açık oyun gol payı) | DK 2018'de %19,4 (8/19 iç ayak) [K54]; ŞL 2015/16'da 25 gol, kayıtların en düşüğü [K72]; PL'de şutların 9,0/18,4 oranı dışarıdan [K58] | açık oyun golünün %8–22'si |
| 21 | Tek dokunuşla biten gol payı | ŞL 2023/24 grup: %63 [K71] | %45–75 |
| 22 | Geri çevirme verimi | maçta 1,56, %32 tamamlanır, %25'i şut; Golden Zone'a geri çevirme %25 dönüşüm [K49] [K50] | B.13 ölçüleri (tamamlanma %25–40) |
| 23 | Kafa gol payı (turnuva) | %17,9–23,7 (DK 2018–2026), kafa dönüşümü %11,4, isabet %33,5 [K57]; PL'de kafayla şut 4,0/maç [K58] | kafa gol payı %10–28 |

Test eşlemesi: `v-sut`, `d-sut`, `d-penalti`, `c-1v1`, `c-orta`, `c-hava`, `c-surus`; yeni sayaçlar `araclar/olcumler/` eklentisi (FUTBOL_KUTUPHANESI §11.1).

## 5. Boşluklar ve takip aramaları (kota yenilenince)

1. **Tür düzeyinde dönüşümler** (volley, half-volley, lob, backheel, overhead, diving header, bire bir, first-time, follows-dribble, weak-foot): StatsBomb/Hudl yayımlanmış analizleri ve Opta Analyst yazıları; ürüne girecek tablo için **Wyscout/Pappalardo (CC BY 4.0)** şut etiketleri (vücut parçası, kale ağzı bölgesi: etiket sözlüğü figshare kaydından doğrulanmalı) — ham veri indirme izni gerekir (I §5.6).
2. **Gol tekniği payları**: yalnız DK 2018, ŞL 2009/10, DK 2010 bulundu (1.7); güncel ŞL/Euro/Süper Lig payları, FIFA Technical Study Group Katar 2022 ve UEFA EURO/ŞL teknik raporlarının şut tekniği tabloları **erişilemedi** (FIFA Training Centre 404; UEFA sayfaları şut tekniği vermiyor). Metin kopyalanmaz, sayı hedef olarak okunur (I §2.11–2.12). Ayrıca Cerda ve ark. 2021 (Sensors 21:5601; DK 2018 açık oyun golleri, saha bölgesi) bulundu ama okunmadı.
3. **Opta lig geneli büyük fırsat dönüşümü** ve bire bir dönüşümü (ASA/Opta/StatsBomb yayını); bire birde kaleci kapatma mesafesi–kurtarış eğrisi (Shafizadehkenari ve ark. 2016'nın tam metni; "Scott Peterson" 2–7 m araştırması bulunamadı).
4. **Penaltı:** vuruş hızı (m/sn) ve yüksekliğe göre gol oranı için özgün makale (Hunter ve ark. optimum parametreleri; Liverpool John Moores çalışmasının özgün makalesi); Palacios-Huerta (2003) ve Chiappori ve ark. (2002) kicker×keeper matrisi; Wood & Wilson (bakış ve kaleci-bağımlı strateji); Almeida ve ark. 2016'nın özgün makalesi (zon tabloları); van Hemert ve ark. 2024 (ligler, durum); Vollmer ve ark. 2024 (seri ↔ normal oranları).
5. **Biyomekanik:** Lees ve ark. 2010 (J Sports Sci 28:805); Nunome ve ark. 2002/2006 tam metin (yan ayak ↔ ayak üstü momentler); Katis ve ark. 2013 (isabeti belirleyen mekanizmalar); kafa vuruşunda top çıkış hızı; vole ve yarım vole temas biyomekaniği; Nagano ve ark. 2006 (iç ayak isabeti).
6. **Eğri/knuckle aerodinamiği:** Carré ve ark. 2002; Asai ve ark. 2007; Hong & Asai 2014 (Scientific Reports) — knuckle'a özgü ölçülmüş spin/hız yok (Goff 2010 yalnız dönüşlü atışı verir; F.2.2'de ≈ 5 dev/sn, 3,5 m sapma örneği var).
7. **Hareket verisi (yetkili izinle):** SkillCorner Body Pose (MIT) şut/vuruş pozları; I §3.1 sonu. StatsBomb açık veri JSON'u (şut tekniği/bire bir/ilk dokunuş bayrakları) kalibrasyon için kullanılamaz (I §2.1); Wyscout şut etiketleri için indirme izni gerekir.

## Kaynaklar

Bağlantılar bu oturumda doğrudan açılıp okunan sayfalardır; okunamayanlar "Boşluklar"da.

[K1]: https://mpra.ub.uni-muenchen.de/4477/1/MPRA_paper_4477.pdf "Bar-Eli, Azar, Ritov, Keidar-Levin, Schein (2007). Action bias among elite soccer goalkeepers: the case of penalty kicks. J. Economic Psychology 28(5):606–621 (MPRA 4477; 311 vuruş, 286 analiz; Tablo 1–2)"
[K2]: https://lida.sport-iat.de/ta/Record/4024478?lng=en "White & O'Donoghue (2011). Factors influencing penalty kick success in elite soccer. 7th World Congress of Science and Football (özet kaydı; 286 penaltı, 2009–10)"
[K3]: https://www.premierleague.com/en/news/4192814 "Premier League (10 Aralık 2024). The history of the Panenka penalty (1.708 penaltı, bölge tablosu)"
[K4]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7985061 "Noël, van der Kamp & Klatt (2021). The Interplay of Goalkeepers and Penalty Takers Affects Their Chances of Success. Frontiers in Psychology 12:645312"
[K5]: https://pmc.ncbi.nlm.nih.gov/articles/PMC6162804 "Hunter, Murphy, Angilletta & Wilson (2018). Anticipating the Direction of Soccer Penalty Shots Depends on the Speed and Technique of the Kick. Sports 6(3):73"
[K6]: https://doi.org/10.1016/j.jbiomech.2018.03.003 "Hunter, Angilletta, Pavlic, Lichtwark & Wilson (2018). Modeling the two-dimensional accuracy of soccer kicks. J. Biomechanics 72:159–166 (özet: https://lida.sport-iat.de/dfb/Record/4047769)"
[K7]: https://publications.aston.ac.uk/id/eprint/28018/1/Penalty_kicks_in_elite_football_post_1997.pdf "Dalton, Guillon & Naroo. The Importance of the Penalty Kick in the Modern Game of Football (literatür özeti: McGarry–Franks, Jordet ve ark.; 2002–2010 DK/Euro verisi)"
[K8]: https://en.wikipedia.org/wiki/Penalty_kick_(association_football) "Vikipedi: Penalty kick (ikincil; van Hemert ve ark. 2024/2025, Hughes & Wells 2002, Dohmen 2008 aktarımı)"
[K9]: https://www.theifab.com/laws/latest/the-penalty-kick/ "IFAB, Kural 14: Penaltı atışı"
[K10]: https://blogarchive.statsbomb.com/articles/soccer/how-do-headers-compare-to-shots/ "StatsBomb (2013). How do Headers compare to Shots?"
[K11]: https://blogarchive.statsbomb.com/articles/soccer/shots-under-pressure-part-2-headers/ "StatsBomb. Shots Under Pressure Part 2: Headers"
[K12]: https://blogarchive.statsbomb.com/articles/soccer/explaining-and-training-shot-quality/ "StatsBomb. Explaining and Training Shot Quality"
[K13]: https://blogarchive.statsbomb.com/articles/soccer/the-problem-with-shots-on-target-metric/ "StatsBomb. The Problem with Shots on Target Metric"
[K14]: https://blogarchive.statsbomb.com/articles/soccer/quantifying-finishing-skill/ "StatsBomb. Quantifying Finishing Skill"
[K15]: https://blogarchive.statsbomb.com/articles/soccer/a-new-way-to-measure-keepers-shot-stopping-post-shot-expected-goals/ "StatsBomb. A New Way to Measure Keepers' Shot Stopping: Post-Shot Expected Goals"
[K16]: https://blogarchive.statsbomb.com/articles/soccer/upgrading-expected-goals/ "StatsBomb. Upgrading Expected Goals"
[K17]: https://blogarchive.statsbomb.com/articles/soccer/introducing-hops-a-new-way-to-evaluate-heading-ability/ "StatsBomb. Introducing HOPS"
[K18]: https://blogarchive.statsbomb.com/articles/soccer/courtois-and-pickford-the-tall-and-short-of-keeper-styles/ "StatsBomb. Courtois and Pickford: The Tall and Short of Keeper Styles"
[K19]: https://blogarchive.statsbomb.com/articles/soccer/turning-theory-into-practice-paul-riley-meets-swedish-national-goalkeeping-coach-maths-elfvendal/ "StatsBomb. Turning Theory Into Practice: Paul Riley meets Maths Elfvendal"
[K20]: https://blogarchive.statsbomb.com/articles/soccer/a-deep-dive-into-europes-goalkeepers-in-2023-24/ "StatsBomb. A Deep Dive Into Europe's Goalkeepers In 2023/24"
[K21]: https://blogarchive.statsbomb.com/articles/soccer/decision-making-and-expected-value/ "StatsBomb. Decision Making And Expected Value"
[K22]: https://theanalyst.com/2021/03/what-are-expected-goals-on-target-xgot/ "Opta Analyst (2021). What are Expected Goals on Target (xGOT)?"
[K23]: https://theanalyst.com/articles/what-is-expected-goals-xg "Opta Analyst. What is Expected Goals (xG)?"
[K24]: https://www.americansocceranalysis.com/home/2021/8/12/where-goals-come-from-using-past-goals-to-create-future-goals "American Soccer Analysis (2021). Where Goals Come From"
[K25]: https://analyticsfc.co.uk/blog/2025/02/11/are-some-players-consistently-good-finishers/ "Analytics FC (11 Şubat 2025). Are some players consistently good finishers?"
[K26]: https://arxiv.org/abs/2401.09940 "Davis & Robberechts (2024). Biases in Expected Goals Models Confound Finishing Ability. arXiv:2401.09940"
[K27]: https://www.jssm.org/jssm-06-154.xml "Kellis & Katis (2007). Biomechanical characteristics and determinants of instep soccer kick. J. Sports Science & Medicine 6:154–165 (JSSM)"
[K28]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3224572/ "Shan & Zhang (2011). From 2D leg kinematics to 3D full-body biomechanics — the past, present and future of scientific analysis of maximal instep kick in soccer (sayfa tarayıcı doğrulamasına takıldı; metin Europe PMC REST uç noktasından okundu)"
[K29]: https://commons.nmu.edu/isbs/vol39/iss1/84 "Lunn & Spears (2021). The effect of accuracy constraints on lower limb joint contributions during the instep soccer kick. ISBS Proceedings 39(1):84 (özet: https://lida.sport-iat.de/dfb/Record/4076518)"
[K30]: https://ojs.ub.uni-konstanz.de/cpa/article/view/1115/1003 "Tsai (2005). An analysis of goalkeeper diving response time for the penalty kick in soccer. ISBS 2005, Beijing"
[K31]: https://datawrapper.de/blog/football-goals-analysis "Datawrapper blog: football goals analysis (StatsBomb açık veri; yayımlanmış analiz — yalnız okunan hedef değer, bkz. 0. bölüm lisans notu)"
[K32]: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0282295 "Mead, O'Hare & McMenemy (2023). Expected goals in football: Improving model performance and demonstrating value. PLOS ONE"
[K33]: https://inside.fifa.com/talent-development/technical-study-group/news/wenger-and-klinsmann-analyse-the-group-phase "FIFA Technical Study Group: Wenger ve Klinsmann Katar 2022 grup aşamasını değerlendiriyor"
[K34]: https://en.wikipedia.org/wiki/Panenka_(penalty_kick) "Vikipedi: Panenka (penalty kick) (ikincil)"
[K35]: https://en.wikipedia.org/wiki/Penalty_shoot-out_(association_football) "Vikipedi: Penalty shoot-out (ikincil; Psychological Science 2011 aktarımı)"
[K36]: https://en.wikipedia.org/wiki/Volley_(association_football) "Vikipedi: Volley (ikincil, niteliksel teknik betimi)"
[K37]: https://en.wikipedia.org/wiki/Trivela "Vikipedi: Trivela (ikincil, niteliksel)"
[K38]: https://github.com/hudl/open-data/blob/master/doc/Open%20Data%20Events%20v4.0.0.pdf "StatsBomb/Hudl Open Data Events v4.0.0 (şema; veri değil — yalnız etiket sözlüğü olarak okundu)"
[K39]: https://www.primefocusgoalkeeping.com/single-post/5-best-goalkeeping-tips-how-to-master-one-v-one-situations "Prime Focus Goalkeeping: 5 best goalkeeping tips — bire bir durumlar"
[K40]: https://www.sportsessionplanner.com/s/NRMS/Dealing-with-One-on-Ones-4-Week-Syllabus.html "Sport Session Planner: Dealing with One-on-Ones — 4 haftalık müfredat (kaleci koçluğu)"
[K41]: https://www.football365.com/news/salah-kane-lukaku-who-misses-the-most-big-chances "Football365 (3 Ekim 2018). Salah, Kane, Lukaku: who misses the most Big Chances?"
[K42]: https://www.planetfootball.com/quick-reads/ranking-premier-league-teams-shot-big-chance-conversion-rates "Planet Football: PL takımlarının büyük fırsat dönüşüm sıralaması (2017–18 ilk 6 hafta; Opta)"
[K43]: https://en.wikipedia.org/wiki/Goalkeeper_(association_football) "Vikipedi: Goalkeeper (ikincil; set position tanımı)"
[K44]: https://blogarchive.statsbomb.com/articles/soccer/death-of-a-target-man-exploring-the-efficiency-of-route-one-football/ "StatsBomb. Death of a Target Man"
[K45]: https://en.wikipedia.org/wiki/Expected_goals "Vikipedi: Expected goals (ikincil; Ensum ve ark. 2002 DK verisi: 930 şut, 93 gol)"
[K46]: https://en.wikipedia.org/wiki/Header_(association_football) "Vikipedi: Header (ikincil; kafa golü rekorları)"
[K47]: https://theanalyst.com/articles/premier-league-penalties-like-free-goal "Opta Analyst (17 Mayıs 2024), Premier League penaltı yazısı (sezon oranları, kurtarma payı, xG 0,78; adresin sonu: premier-league-penalties-like-free-goal)"
[K48]: https://theanalyst.com/articles/opta-football-stats-definitions "Opta Analyst: Opta football stats definitions (büyük fırsat, penaltı, geri çevirme, vücut parçası kaydı)"
[K49]: https://www.americansocceranalysis.com/home/2021/10/8/where-goals-come-from-playing-the-killer-final-ball "American Soccer Analysis (2021). Where Goals Come From: Playing the Killer Final Ball (ara pası ve geri çevirme sayıları)"
[K50]: https://analyticsfc.co.uk/blog/2021/04/28/developing-new-metrics-cutbacks/ "Analytics FC (2021). Developing new metrics: cutbacks (Golden Zone: şutların %50'si, gollerin %82'si; geri çevirmede %25 dönüşüm)"
[K51]: https://www.americansocceranalysis.com/home/2021/3/11/where-goals-come-from-putting-balls-into-the-box "American Soccer Analysis (2021). Where Goals Come From: Putting Balls into the Box (Zone 17, 100 pasta gol)"
[K52]: https://www.americansocceranalysis.com/explanation "American Soccer Analysis: Expected Goals (xG) açıklaması (lojistik model katsayıları: kafa, orta, korner, penaltı)"
[K53]: https://www.frontiersin.org/articles/10.3389/fneur.2016.00038/full "Rodrigues, Lasmar & Caramelli (2016). Effects of Soccer Heading on Brain Structure and Function. Frontiers in Neurology 7:38 (kafa vuruşu tekniği, maçta 6–12 vuruş)"
[K54]: https://casopisi.junis.ni.ac.rs/index.php/FUPhysEdSport/article/view/5365 "Vergonis ve ark. (2019). Technical and tactical analysis of goal scoring patterns in the 2018 FIFA World Cup in Russia. Facta Universitatis: Physical Education and Sport 17(2):181–193 (Şekil 8: şut türüne göre gol payları; PDF: .../article/download/5365/3218)"
[K55]: https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1394621/full "Degrenne & Carling (2024). Comparison of goalscoring patterns between the 2018 and 2022 FIFA World Cups. Frontiers in Sports and Active Living 6"
[K56]: https://lida.sport-iat.de/dfb/Record/4028289 "Njororai (2013). Analysis of goals scored in the 2010 world cup soccer tournament held in South Africa. J. Physical Education and Sport 13(1):6–13 (özet kaydı; DOI 10.7752/jpes.2013.01002)"
[K57]: https://news.northeastern.edu/2026/07/12/world-cup-headers-2026/ "Northeastern Üniversitesi, NetSI Sport (12 Temmuz 2026). Dünya Kupası kafa golleri (StatsBomb verisi); ayrıca https://www.popsci.com/science/world-cup-2026-header-goal-statistics/"
[K58]: https://theanalyst.com/2024/03/numbers-behind-premier-league-goal-explosion/ "Opta Analyst (Mart 2024), 'numbers behind premier league goal explosion' yazısı"
[K59]: https://shura.shu.ac.uk/11279/ "Shafizadehkenari, Davids, Correia, Wheat & Hizan. Informational constraints on interceptive actions of elite football goalkeepers in 1 v 1 dyads during competitive performance. J. Sports Sciences 34(17):1596–1601 (DOI 10.1080/02640414.2015.1125011)"
[K60]: https://sicb.org/?p=12951 "Hunter, Angilletta, Pavlic & Wilson. Applying optimal performance theory to the soccer penalty: identifying the best strategies for success (SICB özeti)"
[K61]: https://phys.org/news/2010-05-football-penalties-science.html "Phys.org haberi (Mayıs 2010; adres: 2010-05-football-penalties-science): Liverpool John Moores matematik çalışması, Exeter göz izleme çalışması vb. — ikincil, özgün makaleler okunmadı"
[K62]: https://www.stir.ac.uk/news/2025/march-2025-news/stirling-research-on-penalty-kicks-scores-at-global-conference/ "Stirling Üniversitesi (Mart 2025). Penaltı vuruşları araştırması (536 ŞL/AL penaltısı; haber)"
[K63]: https://www.pure.fo/en/publications/executing-penalty-kicks-in-the-danish-top-tier-do-exterior-circum/ "Danimarka birinci ligi penaltı çalışması (başlık adreste kırpık: executing-penalty-kicks-in-the-danish-top-tier-do-exterior-circum…); 263 penaltı, 2015/16–2019/20; özet"
[K64]: https://arxiv.org/abs/2310.04797 "Vollmer, Schoch & Brandes (2023/2024, PLOS ONE). Penalty shootouts are tough, but the alternating order is fair (≈ 50.000 penaltı)"
[K65]: https://lida.sport-iat.de/dfb/Record/4039843 "Sakamoto, Numazu, Hong & Asai (2016). Kinetic analysis of instep and side-foot kick in female and male soccer players. Procedia Engineering 147:214–219 (DOI 10.1016/j.proeng.2016.06.216; özet kaydı)"
[K66]: https://ojs.ub.uni-konstanz.de/cpa/article/view/1999 "Shinkai, Nunome, Suzuki, Suito, Tsujimoto & Ikegami (2008). Comparison of ball impact characteristics between side-foot and instep kicking in soccer. ISBS 2008"
[K67]: https://physicstoday.aip.org/quick-study/power-and-spin-in-the-beautiful-game "Goff (2010). Power and spin in the beautiful game. Physics Today 63(7) (DOI 10.1063/1.3463636)"
[K68]: https://www.americansocceranalysis.com/home/2018/5/9/lowered-expectations-week-10 "American Soccer Analysis (2018). Lowered Expectations: Week 10 (neden büyük fırsat bayrağı kullanılmıyor)"
[K69]: https://twelveyards.substack.com/p/high-or-low-where-to-aim "Twelve Yards (substack). High or low: where to aim (Almeida, Volossovitch & Duarte 2016, Int. J. Performance Analysis in Sport 16(2):508–522 özeti; 536 ŞL/AL penaltısı; ikincil aktarım)"
[K70]: https://lida.sport-iat.de/dfb/Record/4028980?lng=en "Michailidis (2013). Analysis of goals scored in the UEFA Champions League in the period 2009/2010. Serbian J. Sports Sciences 7(2):51–55 (özet kaydı)"
[K71]: https://uefa.com/uefachampionsleague/news/0288-19b96c4e5e82-9840d33dc723-1000--champions-league-group-stage-goals-analysis "UEFA.com (18 Aralık 2023). Şampiyonlar Ligi 2023/24 grup aşaması gol analizi"
[K72]: https://www.uefa.com/uefachampionsleague/news/0231-0e94e1cc6e38-b0751d4ca431-1000--champions-league-technical-report-4-how-the-goals-were-s "UEFA.com. Şampiyonlar Ligi 2015/16 teknik raporu: goller nasıl atıldı (sayfa adresi kırpık, olduğu gibi açıldı)"
