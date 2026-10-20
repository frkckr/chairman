# BÖLÜM J — BEDEN DİLİ: VURUŞ, PAS VE DÜŞÜŞ (Body language: kicking, passing, falling)

Amaç: pasların ve vuruşların locadan "dümdüz, sabit, mekanik" görünmesini ve düşüşlerin "tahta gibi devrilme"sini gidermek için bilgi tabanı — gerçek futbolda hangi teknikler vardır, her biri bedende nasıl görünür, ne sıklıkla kullanılır, fiziksel sınırları nedir, oyun motorları bunu nasıl çözüyor. Kaynak: kullanıcının 2026-10-20 izleme notları (2, 3, 4, 6, 8, 9) ve o günün araştırması (üst belge [FUTBOL_KUTUPHANESI.md](../FUTBOL_KUTUPHANESI.md) §12.13). Vuruş biyomekaniğinin bitirişe özgü sayıları [C-bitiris.md](C-bitiris.md) §1.5'te durur ve burada yinelenmez; sahne protokolleri (hakem, baraj, penaltı, gol sonrası) [L-sahne-protokolleri.md](L-sahne-protokolleri.md)'dedir. Çizim programı [MAC_MOTORU_GERCEKCILIK_PLANI.md](../MAC_MOTORU_GERCEKCILIK_PLANI.md) Ek G2 ve G4'tür; bu bölüm oradaki dilin kaynağı ve ölçüsüdür.

## J.0 Okuma kılavuzu ve kaynak durumu

İşaretler [C-bitiris.md](C-bitiris.md) §0 ile aynıdır: `[Kn]` okunan kaynak (liste en altta), `(hesap)`, `(tahmin)`, `(bulunamadı)`, `(genel bilgi)`. Biyomekanik literatürünün büyük kısmı laboratuvarda, duran topa, azami güçle vuruşu ölçer; **maç içi pas hızı ve teknik payları için çok az yayımlanmış sayı vardır** — tabloda "tahmin" etiketli her sayı motor kalibrasyonunun ilk değeridir, kanıt değildir. Oyun motorları için en verimli kaynak Google Research Football'un (GameplayFootball; Apache-2.0) kaynak kodu oldu; EA, Konami ve SI'ın iç yöntemleri yalnız basın notlarından okunabildi.

## J.1 Vuruşun ortak mekaniği (bütün tekniklerin paylaştığı gerçekler)

- **Zincir** proksimalden distale gider: pelvis dönüşü → uyluk (açısal hız tepesi 516–573°/sn) → diz açılır → baldır temasa dek doğrusal hızlanır (1.891°/sn'ye kadar). Geri salınımda kalça 29°'ye kadar ekstansiyona gider, diz 745–860°/sn ile bükülür; azami diz bükülmesi ~105° [K1] [K4].
- **Temas** 8–9 ms sürer (üst 8,3–8,8; ayak içi 9,3 ms); ayak topla birlikte top çapının ~2/3'ü kadar yol alır; top hızı / ayak hızı 1,06–1,65 (profesyonelde ~1,4) [K1] [K6].
- **Yaklaşma:** oyuncunun kendi seçtiği açı ortalama 30,3 ± 15,2°, 3–5 adım [K7]. 0° / 45° / 90° yaklaşmada top hızı 18,7 / 20,1 / 19,1 m/sn [K1]. Yaklaşma hızı top hızıyla güçlü ilişkilidir; son adımın uzunluğu değil, son adımda ağırlık merkezinin frenlenmesi belirleyicidir. **Tek adımla** ayak içi vuruşta ayak hızı ~12,2 m/sn, koşarak 18,3–19,1 m/sn [K5] [K13] — yerinden vuruş koşarak vuruşun kabaca üçte ikisidir.
- **Destek ayağı:** ölçülmüş değer topun ~30 cm yanı, ~10 cm gerisi [K7]; koçluk klasiği (Hay 1993) 5–10 cm geri, 5–28 cm yan — deneysel olarak doğrulanmamış [K1].
- **Gerilim yayı (tension arc)** [K8]: sert vuruşta vuruş tarafı kalçanın aşırı ekstansiyonu + dizin fleksiyonu + gövdenin vurmayan tarafa burulması + **vurmayan kolun yukarı-geri açılması** tek bir yay oluşturur; boşalmada bacak kırbaç gibi gelir, gövde öne eğilip vuruş tarafına döner, kol iner. Kalça ekstansiyonunun tepesi omuz ekstansiyonunun tepesiyle aynı andadır. Kol sallamalı vuruş sallamasıza göre ≈ +%4 top hızı verir [K9]. Beceriklilerde gövde eksenel dönüşü %53 daha geniş ve %62 daha hızlıdır; gövde dönüş hızı ile top hızı r = 0,57 [K8].
- **Doğruluk–hız ödünleşmesi:** hedefli vuruşta diz açısal hızı 1.175°/sn, azami güçte 1.364°/sn → hedefli vuruş azaminin ~%86'sı (hesap) [K2]. Ayak içi pasta 20 m'ye doğruluk "maç hızında" azami hızdan daha iyidir [K14]. Bitirişe özgü hız–isabet varyansı C §1.5'te.
- **Yorumu (motor için):** her vuruşta *geri salınım genliği* (hedef hız ÷ azami), *gövde yönü ile hedef arasındaki açı* (ayar adımı ve pelvis dönüşüyle kapanır) ve *gövde eğimi + karşı kol* ayrı ayrı belirlenir; aynı pozu her mesafede kullanmak "mekanik" izlenimin kaynağıdır (J.8).

## J.2 Teknik envanteri (tablo J-1)

TY temas yüzeyi; GS geri salınım; Hız topun çıkış hızı (m/sn); Pay profesyonel maçtaki yaklaşık pay.

| Teknik | TY | Yaklaşma / ayar | GS | Gövde / kol / baş | Hız | Yol | Kullanım | Pay |
|---|---|---|---|---|---|---|---|---|
| **Ayak içi itme pası** (push pass) | ayak içi; bilek 90° dışa dönük, sabit | düz ya da 0–20°; 1–2 ayar adımı; destek ayağı topun hemen yanında, burnu hedefe | küçük: diz ~30–50° (tahmin) | dik, hafif öne; karşı kol hafif açık; baş topta | tek adım, 2 m hedef 12,6–15,2 [K13]; maçta kısa pas 8–14 (tahmin) | yerden, düz | 5–15 m, açık oyuncuya | ayak içi toplam %59,6 (Euro 2012, 28.271 pas) [K15] |
| **Sert ayak içi** | ayak içi (kemik-ark); bazen iç-üst karışımı ("hibrit", temas açısı 142° ↔ tam yan 174°) | 20–45°, koşarak | orta–büyük: ayak hızı 18,5–21,8 | pelvis ve uyluk vuruş tarafına döner; ayağa 8,4 m/sn yana hız bileşeni [K4]; karşı kol belirgin açık | pro azami 26,0 ve 31,5 [K6]; deneyimli 21,4 ↔ acemi 16,0 [K10] | yerden/alçak, hafif iç falso olabilir | 15–30 m, ara pas, kenar değiştirme, plase şut | — |
| **Üst (laces) sürülmüş pas** | ayak sırtı; bilek plantar fleksiyonda kilitli | 30–45°, 3–5 adım; destek ~30 cm yan, ~10 cm geri | büyük: kalça ~29°, diz ~105° | gerilim yayı tam; gövde topun üstündeyse alçak kalır; karşı kol yukarı-geri | pro 29,9 ± 2,9; 32–35 (DK 1990); 30,8 ve 33,8 [K1] [K6] | alçak-sert, 0–1,5 m | 20–40 m sert, uzun çapraz, şut | üst %9,1 (Euro 2012) [K15] |
| **Havadan uzun top** (lofted drive) | sırt–iç yanı, topun alt yarısı | daha açılı 45°; destek ayağı yanı ve **biraz gerisi** | büyük | göğüs yukarı, "neredeyse geriye yatık"; yüksek bitiriş; kol yukarı | 20–28 (tahmin; kalecinin punt'ı 22–28 ölçülmüş [K17]) | 25–45° çıkış | 30–60 m, arkaya top, uzun değiştirme | Opta uzun pas (≥ 32 m, orta/korner hariç): PL %19,4 (2006-07) → %10,5 (2024-25); takımlar %6,0–16,3 [K20] |
| **Aşırtma / chip** (toe under) | burun–iç üç parmak topun altına "saplanır" | kısa ayar, 1–2 adım | kısa, dik aşağı inen hızlı hareket | hafif geriye yatık; **bitiriş yok / çok kısa**; baş erken yukarı | 10–18 (tahmin) | dik 40–60°, backspin, kısa yay | 10–30 m, savunmacı/kaleci üzerinden | (bulunamadı); nadir, < %2 (tahmin) |
| **Dış ayak** (trivela) | dış kenar, 4–5. metatars | gövde açılmaz; top hafif önde-dışta | fiskeden tam salınıma | kalça abdüksiyon + iç rotasyon, diz iç rotasyon, bilek inversiyonu büyür [K16]; gövde hedefe bakmaz (aldatıcı) | gençlerde 18,6 (üst 19,6) → üstün ~%95'i [K16] | dışa doğru falso | baskı altında hızlı, aldatmalı pas; kapalı açıdan orta | (bulunamadı); "diğer" %16,7 içinde (dış + burun + kafa) [K15]; genel **%2–5 (tahmin)**, oyuncuya göre %0–20; Modrić Euro 2020'de hat kıran 23 pasın 5'i [K21] |
| **Ayak içi falsolu** (inner-instep curve) | ayak iç-üst (in-front) | dar açı; destek ayağı yanı, burnu topun önüne | büyük | gövde hafif yana, kol açık | 27,1 (ayak 24,2), 7,8 dev/sn, temas açısı 35,4° [K11]; tek adımlık 12–14, 5,9 dev/sn [K13] | eğri; ~100 mm'lik merkez dışı temas en verimli | rakip etrafından pas, korner, orta, falsolu şut | iç-üst %14,6 (Euro 2012; falso payı ayrı değil) [K15] |
| **Uç** (toe-poke) | burun | yok; duruşta | minimal | dik, kol serbest | ayak hızı < 15 m/sn'de geri verme katsayısı üstten yüksek; > 15'te fark yok [K12] | düz, seken | son anda şut/pas | (bulunamadı); nadir |
| **Topuk** | topuk | yok; top arkada | öne kısa bacak itişi | gövde ileri; baş çoğu kez hedefe bakmaz | 8–12 (tahmin) | yerden kısa | ceza sahası civarı, aldatma | < %1 (tahmin; StatsBomb `backheel` bayrağı var) |
| **Bakmadan pas** (no-look) | çoğu ayak içi | normal | normal | **baş ve gövde hedeften başka yöne**; kalça yine hedefe | ayak içi değerleri | — | yakın oyuncuya aldatma | (bulunamadı); nadir |
| **Vole / yarım vole** | sırt | topa göre 1–2 ayar adımı; yan vole 45° | orta; bacak yatay süpürülür | **gövde yana yatar**: top yüksekliğiyle 3,7° → 13,8° → 23,8° → 31,3° (yer / 25 / 50 / 75 cm); pelvis dönüşü 21,6° → 54,9° [K18] | 24,0 (yer) → 19,6 (75 cm) [K18]; salınım 0,13–0,16 sn [K19] | alçak-sert ya da yükselen | temizleme, gelişine şut/pas | (bulunamadı) |
| **Uzun çapraz** (switch) | sırt / iç-üst | 45°, 3–4 adım | büyük | lofted gibi; kol yukarı | 22–28 (tahmin) | 15–30° | 40–60 m kanat değiştirme | uzun pasa dahil |
| **Kale vuruşu (yerden)** | sırt | 3–5 adım, 30–45° | büyük | geriye yatık | mutlak değer (bulunamadı); 60–70 m için ~27–30 (tahmin); azami mesafe 25–30° çıkışta [K22] | 25–30° | uzun kale vuruşu | PL 2019/20 kale vuruşlarının %21,9'u kısa [K23]; U17 DK kısa %17 (2023) → %39 (2025) |
| **Kaleci punt / drop kick / yan vole** | sırt | 2–3 adım, topu elden bırakır | büyük | geriye yatık, kol yukarı | punt 22–28; tercih edilen açı 40–44°, ~39,5 m [K17] | punt ~45°; drop kick daha düz | hızlı uzun dağıtım | League Two kalecisi: elden vuruş %21–22, kale vuruşu %14–16, geri pas %24–29 [K24] |
| **Kaleci fırlatma** (yuvarlama / yan "cirit" / üstten / yan vole atışı) | el | adım + gövde dönüşü | kol geri | yuvarlama kısa; cirit orta, alçak; üstten orta-uzun; yan en uzun | (bulunamadı); üstten 15–20 (tahmin) | yuvarlama yerden; üstten 20–30° | kısa/orta hızlı dağıtım | fırlatma %2–5 [K24]; PL kaleci paslarının uzun payı %79,3 (2014/15) → %46,6 (2023/24) → %51,9 (2025/26 başı) [K25] |

Bitirişe özgü türler (plase, aşırtma, dış ayak bitiriş, vole) C2.0–C2.5'te; burada yalnız beden şeması ortaktır.

## J.3 Fiziksel sınırlar (kullanıcının üç sorusu)

**J.3.1 Sağ ayaklı oyuncu, gövdesi ileri bakarken kendi sağına pas atacaksa ne yapar?** Üç çözüm; seçim mesafeye ve zamana bağlıdır.
1. **Kalçayı açıp sağ ayak içi (en yaygın; 5–25 m).** Son ayar adımını (sol ayak) hedefe doğru atarak pelvisi 60–90° döndürür; ayak içi vuruşta pelvis zaten vuruş tarafına döner ve ayağa 8,4 m/sn'lik yana hız bileşeni eklenir [K4]. Yani "sağa pas" aslında **sol adım + pelvis dönüşü + ayak içi** üçlüsüdür; dönüşsüz, dümdüz bir bacak hareketi değildir. Yarım saniye dolayında bir ayar adımı ister (tahmin).
2. **Sol ayak içi (zayıf ayak; kısa).** Top solda/önde ise ayar adımsız. Sağ ayaklılar paslarının ~%87'sini baskın ayakla atar, %13'ü zayıf ayakla [K26]; bu %13'ün önemli kısmı tam böyle yan kısa paslardır (çıkarım).
3. **Sağ dış ayak (trivela / fiske; baskı altında).** "Gövdeyi açmak gerekmediği için daha hızlı ve daha aldatıcı" [K27]; kapanan savunmacı varken. 30–40 m'lik trivela orta mümkündür ama **tam geri salınım ve kalça açısı ister**; fiske değildir.

Kullanıcının gördüğü "dönüp hiç gerilmeden dış ayakla sağa pas" gerçekte yalnız 3'ün kısa hâlidir (≤ ~10 m, aşağıda); stoperden beke 15–25 m'lik pas 1'dir.

**J.3.2 Geri salınımsız dış ayak fiskesi en çok kaç metre gider? (fizik tahmini)** Tek adımla ayak hızı 10–13 m/sn [K13]; dış ayakta top/ayak oranı düşük → top ~10–13 m/sn. Çimde pasın yavaşlaması ~7,9 m/sn² (takip verisi) [K28]. Alıcıya 5 m/sn ile varması gereken pas için menzil (13² − 5²) / (2 · 7,9) ≈ **9 m** (hesap); durana dek ~10–11 m. **Sonuç: fiske dış ayak yerden 8–12 m; daha uzunu tam salınım ister.**

**J.3.3 Sıkışan oyuncu hazırlık adımı olmadan 30–40 m havadan vurabilir mi?** Gerçekçi değil (tahmin, dolaylı kanıt): tek adımlı vuruşta ayak hızı koşarak vuruşun ~2/3'ü [K5] [K13]; yaklaşma hızı top hızıyla güçlü ilişkili [K1]. Buna karşılık **bir ayar adımı + gövdeyi geriye/yana yatırma + kol** ile üniversiteli bile yerden/alçak toplarda 20–24 m/sn üretir [K18]; 20 m/sn ve 35° çıkış sürüklemeyle ~28–30 m taşır, 23 m/sn ~35–40 m (hesap, sürükleme [K17]'nin punt modeliyle). Aceleyle vuruşta beden şunu yapar: kısa geri salınım (diz bükülür, kalça az gider), **gövde geriye ve topun ters tarafına yatar** (vole çalışmalarında 14–31° [K18]), pelvis yatay döner (36–55°), vurmayan kol yukarı-dışa açılır, bitiriş yüksek, çoğu kez destek ayağı yerden kalkar/sıçrar. Profesyonelde **bir adımla 30 m havadan temizleme mümkün; sıfır adımla 15–25 m** (tahmin). Oyundaki "gerilmeden kalçadan auta" görüntüsü ne beden ne menzil bakımından gerçeğe uyar.

## J.4 Gerçek dağılımlar (tablo J-2)

| Ölçü | Değer | Kaynak |
|---|---|---|
| Pas tekniği (Euro 2012, 28.271 pas) | ayak içi %59,6; iç-üst %14,6; üst %9,1; diğer (dış ayak, burun, kafa) %16,7 | [K15] |
| Pas uzunluğu (DK 2014, 499,7 pas/maç) | kısa %25,0; orta %59,4; uzun %15,9; başarı %76,4 / %79,6 / %56,5 (eşikler özette yok) | [K29] |
| Uzun pas payı (Opta, ≥ 32 m, orta/korner hariç) | PL %19,4 (2006-07) → %10,5 (2024-25); Everton %16,3, Man City %6,0 | [K20] |
| Ortalama pas uzunluğu | takımlar 15,9 m (PSG) – 23,4 m (Rotherham); ligler 18,9–21,1 m | [K30] |
| Yerden / alçak / yüksek payı | (bulunamadı; StatsBomb yalnız sıralama veriyor). **Tahmin:** yerden %65–75, alçak %10–15, yüksek %15–20; `statsbomb/open-data` `pass.height` ile sayılabilir — lisans gereği ürüne giremez (I §2.1) | [K26] |
| Pas çıkış hızı (takip verisi) | ortalama **16,2 m/sn**, yavaşlama 7,93 m/sn² (tek kulüp, İsveç); dağılım/sd yok. **Tasarım tahmini:** kısa itme 8–14, sert ayak içi 14–20, sürülmüş 18–25, havadan uzun 20–28, şut 25–35 m/sn | [K28] |
| Pas ayağı | pasların ~2/3'ü sağ ayak; baskın ayak payı sağ ayaklıda %87, sol ayaklıda %85; oyuncuların ~3/4'ü sağ ayaklı; PL maçında ~870 pas | [K26] |
| Falsolu / eğri pas payı | (bulunamadı; StatsBomb yalnız ortalar için inswing/outswing tutar) | — |
| Şut yerleşimi | köşeye isabetli şut %50–60 gol, alçak-orta %12–13; isabetli şut dönüşümü %28,4 (12.736 şut), alçak-merkez en düşük, üst köşe en yüksek (~%40,5) | [K31] [K32] |
| Bire bir (kaleciye karşı) | Opta "büyük şans" takım dönüşümü %28–59, tipik ~%40; teknik seçimi (uzak köşe plase / yakın direk sert / aşırtma / çalım) ve dönüşümleri (bulunamadı); StatsBomb `one_on_one` bayrağı var. **Tahmin:** alçak uzak köşe plase %50–60, yakın direk sert %30–40, aşırtma %25–40, çalım %40–50; La Liga 2019-20 (2.238 şut): gollerin %72,7'si ilk dokunuş, ilk dokunuş şutlarının %57'sinde kaleci eylemsiz | [K33] [K34] |
| Kaleci dağıtımı | PL kaleci paslarında uzun payı %79,3 → %46,6 → %51,9; kale vuruşlarının %21,9'u kısa (2019/20); League Two: ayakla %69–70 (kale vuruşu 14–16, geri pas 24–29, elden vuruş 21–22, sürüş 6–7), elle %30–31 | [K23] [K24] [K25] |

## J.5 Uzaktan (locadan 60–100 m) en okunur ipuçları

Penaltı öngörü literatürü soruyu doğrudan cevaplar: acemiler gövde/kol/kalçaya (büyük parçalara) bakar, uzmanlar bacak ve topa; temasa 150 ms kala vurmayan ayağın açısı, vuran dizin açısı ve ayak hızı; temas anında ayak açısı, kalça açısı ve ayak yönü bilgi taşır; vurmayan ayak topun gideceği yönü %80 gösterir [K35] [K36]. Oyuncu ekranda 20–40 piksel boyunda olacağından **siluet değiştiren büyük genlikli hareketler** önceliklidir:

1. **Karşı kolun yukarı-dışa açılması** (gerilim yayı): siluetin genişliğini değiştirir; sert/uzun vuruşta büyük, itme pasında küçük. Hız sınıfının en ucuz göstergesi.
2. **Geri salınım açısı** (uyluk gövdenin arkasında): sert vuruşta kalça ~29° + diz ~105°; itme pasında bacak yürüyüş genliğinde. Yandan tek karede okunur.
3. **Ayar adımı / sekme:** sert vuruş öncesi uzayan son adım ve frenleme; pas öncesi küçük "hop". Zamanlama ipucu.
4. **Gövdenin yatması:** geriye = havaya; topun üstünde = alçak; yana = vole/temizleme (14–31°).
5. **Bitiriş (follow-through) yüksekliği:** havadan topta ve şutta diz göğüs hizasına; sürülmüşte alçak; chip'te yok (saplama); dış ayakta kısa "kamçı".
6. **Pelvis/gövde yönü ≠ pas yönü:** dış ayak ve bakmadan pasın okunabilirliği tam bu uyumsuzluktan gelir; ayak içi pasta ise önce sol adım + gövde dönüşü, sonra pas.
7. **Baş:** vuruşta aşağı (topta), chip ve aşırtmada erken yukarı; bakmadan pasta başka yöne.

**Motor için pratik çıkarım:** her pasta en az üç ayrı parametre türetilir — (a) geri salınım genliği (hedef hız ÷ azami; hedefli vuruş ~%86 diz hızı), (b) gövde yönü ile pas yönü arasındaki açı (ayak içi sıfıra yakın ama bir ayar adımı ve pelvis dönüşüyle; dış ayak 30–60°; bakmadan baş ayrı), (c) gövde eğimi (öne/arkaya/yana) + karşı kol. Tek "pas animasyonu" yerine **en az yedi beden şeması** gerekir: itme / sert ayak içi / sürülmüş / lofted / chip / dış ayak / vole.

## J.6 Düşüş ve temas dili

**Gerçek düşüş (Ek G4'teki kaynaklı dil ile uyumlu):** takılmada iki strateji — yükseltme (adımı tamamlar) ya da alçaltma (ayağı erken koyar, diğeriyle aşar) → 1–3 tökezleme adımı, gövde öne, kollar öne; kurtarma adımı kısa kalırsa düşüş 0,4–0,6 sn: **önce eller/ön kollar, sonra kalça**, gövde kuvvet yönünde katlanır; yerde yatış (yüzüstü/sırtüstü/yan); kalkış sırtüstünden 1,5–3 sn, elle basılı yandan 1–1,5 sn; iniş dengesi tek ayakta ~1,9 sn. Gerçek düşüşte kollar aşağı/öne koruyucudur; simülasyonların "okçu yayı" (iki kol omuz üstünde) gerçekte olmaz (Ek G4'ün kaynakları).

**Faulün türüne göre düşüş aileleri (tasarım; kaynaklı ilkelerden türetildi, oran (tahmin)):**

| Temas | Beden | Yön ve süre | Kalkış |
|---|---|---|---|
| Arkadan takılma (ayağa) | takılan bacak geride kalır, gövde öne katlanır, eller önce yere | koşu yönünde; sert koşuda 1–2 tökezleme adımı sonra düşüş | yüzüstünden dizlere, 1,5–2 sn |
| Omuz omuza / yandan itme | kalça yana kayar, uzak bacak çapraz adım atar; yetmezse yana düşüş, üst kol koruyucu | temas normali yönünde; çoğu kez yalnız sendeleme (düşüş yok) | yandan elle basarak 1–1,5 sn |
| Kayan müdahale (bacaklar alınır) | iki bacak altından süpürülür, gövde havada döner (kalça önde), sırt/yan iniş; bazen yuvarlanma | rakibin kayma yönü + kendi hızı | sırtüstünden 2–3 sn; sakatlık riski |
| Önden itme / göğüs teması | gövde geriye, bir adım geri, kollar denge; sert ise sırtüstü | geriye | sırtüstünden |
| Forma çekme | çekilen gövde öne ve çekenin yanına, kol geride uzanır; tökezler | çekenin yönüne | kısa |
| Hava düellosu inişi (dengesiz) | tek ayağa iniş, diz çöker, yana yuvarlanma | iniş hızı | 1–1,5 sn |

**Oyun motorlarının çözümü (J.7 D5):** GameplayFootball üç kademeli bir "hassasiyet" skalası kullanır — yüz dönüklüğü, hız, topun sende olması, denge niteliği (×3), iç içe girme (^0,4 × 6), topa yakınlık, 15'e bölünür; 0,48 üstü **sendeleme**, 0,58 üstü **düşme**; kayan müdahalede gövde kutusu rakibin ayak/baldırına değerse **kayarak düşürülme**; yön = kendi hızı × 0,1 + rakibin hızı × 0,06 + itme normali; kalkış "idle"dan başlar; hakem aynı olayı alır [K40]. Madden 25'in BOOM tekniği ragdoll'u fiziksel sürer, sonuca göre düşme/sendeleme/toparlanma animasyonu seçer ve aynı temasta yeniden seçebilir [K41]. Uzaktan bakışta önemli olan **düşüşün yönü ve ilk 300 ms'deki gövde kırılması**dır; kalkışın türü (yüz/yan/sırt) ve süresi ikinci sırada.

## J.7 Oyun motorlarındaki desenler (kodla üretilen bir motor için)

Bağlam: harici model ve mocap klibi yok; yalnız sayı tabloları (`js/hareket-egrileri.js`), retro 2× ızgara, loca bakışı. EA (HyperMotion, ML-Flow: topa yaklaşırken adım uzunluğu, kadans ve poz geçişlerini sinir ağı üretir; FC 26'da kısa pasta "minimal wind-up") [K42] [K43], Konami (Motion Matching; "stunning" pas daha büyük adım ister) [K44] ve SI (FM24 Motion Matching + IK, Hawk-Eye iskelet verisi) [K45] klip veritabanlarına dayanır ve burada uygulanamaz; GameplayFootball'un **klip seçimi mantığı** ise klipsiz de uygulanır [K40]:

- **D1 — Çeyreklik "vuruş tarifi" tablosu.** GRF ~190 animasyonu "gelen hız sınıfı (idle/dribble/walk/sprint) × gelen gövde açısı (0/20/45/90/135/180) × varyant" diye adlandırır; her klibin metaverisi dokunuş karesi, gelen/çıkan top yönü ve toleransı, dokunan ayak, zorlanan ayak, güç tavanı, zorluk çarpanı. Klip yerine her satırı `{işlev, gelen hız sınıfı, gelen gövde açısı, çıkış top açısı, ayak, dokunuş karesi, ayak önü ofseti, güç tavanı, zorluk, yüzey}` olan bir tablo; satırdan 3–5 anahtar poz parametresi (geri salınım, diz, gövde dönüşü, kol) üretilir; seçim GRF gibi kararlı sıralamalarla (hareket benzerliği → ayak → gövde yönü → hız). Maliyet düşük; risk az satırın robotik görünmesi (D2 ve tohumlu küçük sapmayla kırılır).
- **D2 — Ayar adımı = planlı dokunuş karesi + "smuggle" + adım fazı modülasyonu.** Vuruş kararında dokunuş anı T ve istenen ayak–top konumu (ayak önü ofseti 0,34 m + v·Δt; yüksek topta kısalır) belirlenir; gövdenin T'deki tahmini konumu ile top arasındaki fark kalan karelere yayılır (GRF: ≤ 1,6 m/sn ek, ileri bileşen sınırlı, kalabalıkta × 0,7, bir kısmı bilerek atılır — "görsel dokunma ile doğru hareket arasında hep ödünleşim"). Mevcut Fourier yürüyüşün **faz hızı** öyle ölçeklenir ki vuran ayağın salınımı T'de topa denk gelsin (ML-Flow'un hedefi tam budur); sınır ±%25, kalanı smuggle. Kısa mesafede ve baskıda "minimal wind-up" tarifi.
- **D3 — Ayak ve yüzey karar tablosu.** Ayak: salınım fazı T'ye uyan ayak + güçlü ayak önyargısı + hedefin gövdeye göre yanı. Yüzey: iç ≤ ~45° pas; sırt şut ve uzun top; **dış yalnız hedef vuran ayağın dış tarafında, gövde hedefe dönük değilken ve zaman/baskı dönüşe izin vermezken**, kabiliyet kapısı geçerse (EA: "gövde hizası uygunsa" + oyun stili; Konami "Outside Curler"). Yüzey → spin işareti → top eğrisi (D6). Uzaktan yüzey farkı görünmez; görünür ayrım bacak salınımının yönü ve topun eğrisidir.
- **D4 — Vuruş pozu: anahtar pozlar + IK ile ayağı topa kilitleme.** Vuran bacak için [T − 0,30 sn, T + 0,25 sn] penceresinde taban yürüyüşe toplamsal katman: kalça/diz açıları 3–5 anahtar pozdan, dokunuş karesinde ayak ucu iki-kemik IK ile temas noktasına, basma ayağı yere kilitli, omurga karşı dönüş, kollar denge. Tek "güç" skaları geri salınım genliğini ve süresini ölçekler; stiller (plase/sert/yarım vole) diz–bilek farkı olarak. Harmanlama yay-sönümle (Rosen: az anahtar poz + prosedürel katman) [K46]. Risk: IK'da diz "pop"u, harman uçlarında sıçrama (temas açıklığı ≤ 0,15 m ölçüsü var).
- **D5 — Düşüş/faul: üç kademe + yönlü hassasiyet + küçük verlet ragdoll + kalkış pozları.** Motor: J.6'daki skala ve iki eşik → sendeleme/düşme; kayan müdahalede bacak–ayak kesişimi → kayarak düşürülme; yön formülü; `(tip, yön, süre)` çizim sözleşmesine. Çizim: kademe 1 sendeleme klipsiz — leğen ve gövdeye temas yönünde toplamsal yay dönüşü (sertlik/sönüm, kemik başına açı sınırı, uzaklıkla sönme) [K47] + 2–3 toparlanma adımı; kademe 2/3 düşme — 10–12 parçacıklı verlet ragdoll (Jakobsen: `x += x − x_eski + a·dt²`, çubuk kısıtları 3–4 gevşetme, eşitsizlik çubuklarıyla açı sınırı) [K48], mevcut pozun hızıyla başlatılır, ilk 150–250 ms eklem hedefleri "korunma" pozuna (kollar öne) çekilir, sonra serbest; 0,6–0,9 sn'de yerde durur; **kalkış** yerleşen ragdoll pozundan 2–3 anahtar poza harman. Risk: 60 m'den ragdoll "ölü" görünür → kısa tut, korunma hedefi; determinizm için sabit adım + tohum; motor yalnız tip/yön/süre üretir, çizim ragdolu tohumlu ve yan etkisiz hesaplar (ikiz motor denetimi etkilenmez).
- **D6 — Pas hızı/yükseklik/eğri seçimi (yapay zekâ; güç çubuğu yok).** GRF: güç ∝ (d/60)^1,4 × 1,8; yüksek pasta × 1,15, yükseklik ofseti yerde 0,11, havada 0,45 − 0,15·(d/60); alıcı öne alma = alıcı hızı × (0,3 + 0,05·d)^0,7 × 0,7. Bağlam: yol açıksa lob yerine sert düz top (FC 26), baskı altında/boşlukta daha alçak-hızlı varyant (Konami), dar açıda ters ayak yerine dış ayak (D3). **Yerde eğri:** GRF Magnus'u her yükseklikte uygular ama yerde dönüşü yuvarlanmaya zorlar (en çok π rad/sn değişim) → yan spin ~1 sn içinde söner: yerden eğri var ama kısa ömürlü, abartısız.
- **D7 — Düşmeyen temaslar için toplamsal vuruş tepkisi.** Omuz çarpması, itilme, topun gövdeye çarpması: temas yeri/yön/şiddet → kemik zinciri boyunca sönen yay, üst gövde maskesiyle koşu sürer (8 yön + merkez) [K47] [K49]. Sönüm kritik ve üstü, açı sınırı.
- **D8 — "Topa görsel dokunma" ile "doğru hareket" ödünleşimi.** 60–100 m'de doğru hareket görsel dokunuştan önemlidir: 0,10–0,20 m temas hilesi kabul, fazlası yerine D2'nin faz ayarı.
- **Önerilmeyenler:** PD sürücülü tam aktif ragdoll (fizik motoru ister), öğrenilmiş denetleyiciler (DeepMimic/Wobbledoll; günlerce eğitim, harici veri), motion matching veritabanı (mocap gerektirir; proje kuralına aykırı — A7 istisnası yalnız sayı tablolarıdır).

## J.8 Bugünkü motor ve çizimle fark (2026-10-20 teşhisi; satırlar FUTBOL_KUTUPHANESI §12.13'te)

- **Yüzey ve ayak:** `vurusBaslat` yüzeyi *o anki* gövde yönüne göre tek zarla seçer — hedef vuran ayağın dış tarafında ve 26–80° açıdaysa yerden pasta %30–80 dış ayak; "ayar adımı + pelvis dönüşü + iç ayak" seçeneği tartılmaz; dış ayakta gövde 35–50° dönmeden vurur; iç ayak pasta gövde hedeften 45°'ye dek sapık kalabilir. J.3.1'in tersi.
- **Hazırlık:** gerilme (≥ 0,4 sn hazırlık, ayar adımı) yalnız baskısız ≥ 28 m pasta; uzaklaştırma ve baskılı havadan top 0,03–0,15 sn hazırlıkla, çizimde 0,3–0,4 sn'lik pencereyle çıkar. J.3.3'ün tersi.
- **Uzaklaştırma:** hedef kasıtla saha dışı (kendi kenarına 18–38 m), alıcı yok; kaleciye pas baskıdayken aday bile değil; amaç terimi yok.
- **Pas hızı ve yolu:** tek hız ailesi (7 + 0,15·L, 8–12 m/sn); yerden pas hiç havalanmaz; iç ayak yerden eğrisi 0,1–0,3 m (görünmez), dış ayak 0,5–1 m ters yöne; yumuşak/sert ayrımı yalnız "bırakma". J.4'teki üç aile ve J.7 D6'nın tersi.
- **Çizim:** iç ayak tek poz; güç/eğri poza girmez; karşı kol yalnız geri salınımda 0,2–0,35 sn; uzun yerden pas da üst pozuyla. J.5'teki yedi şemanın tersi.
- **Düşüş:** tek genel devrilme (3 yön), `f²` eğrisiyle 0,45 sn, çarpmada ~6,4 rad/sn ve yerde aniden 0; neden/şiddet/kaynak/bacak çizimde kullanılmaz; ragdoll yok. J.6'nın tersi.
- **Pas isteme:** motorun istek sinyali (Z1) 'cagir' (el ağızda, katlı dirsek, 0,8 sn) ile çizilir — uzaktan silüeti değiştirmez; iki el açık / tam kol kaldırma açık oyunda yok (yalnız ofsayt ve taç).

## J.9 Motor için notlar (turların girdisi; program §12.13)

1. **Üç parametre, yedi şema (J.5).** Her vuruş eylemi `salınım` (0–1; hedef hız ÷ azami × teknik), `dönüş` (gövde–hedef açısı ve kapanma yolu: ayar adımı / pelvis / dış ayak) ve `eğim` (öne/geriye/yana + karşı kol) taşır; çizim yedi şemayı bu üçlüden seçer. Bugünkü `stil` alanı korunur, üçlü eklenir.
2. **Yüzey kararı (D3) zaman ve mekânla:** dış ayak yalnız (hedef dış tarafta) ∧ (gövde dönmemiş) ∧ (dönüşe zaman yok: baskı ya da gelişine) ∧ (menzil ≤ 12 m fiske ya da tam salınım) ∧ kabiliyet; aksi hâlde ayar adımı + iç ayak. Kaleci kale vuruşunda aynı kural.
3. **Hazırlık modeli:** hazırlık süresi ve geri salınım teknik × mesafe × baskıdan; sıfır hazırlıkla 30+ m havadan top yok (menzil ve isabet cezası); uzaklaştırmada en az bir ayar adımı; aceleyle vuruşta gövde geriye/yana yatar.
4. **Pas hızı üç aile:** itme 8–14, sert 14–20, sürülmüş 18–25 m/sn; aile alıcının mesafesi, baskısı ve koşusundan; havadan kısa pas (0,5–1,5 m alçak) ve yerden pasın hafif havalanması; yerde eğri görünür düzeye (0,3–0,8 m) ama sönümlü (D6).
5. **Uzaklaştırma amaçlı:** alternatifler aynı listede (kaleciye pas baskıda açık, geri pas, taca kısa, arkadaşa uzun kurtarış); hedef saha dışı yalnız kendi ceza sahası çevresinde ve gerçek tehlikede.
6. **Düşüş sözleşmesi:** motor `(tip: sendele | düş | kayarak, yön, şiddet, neden, kaynak, bacak)` verir; çizim J.6 ailelerini ve D5'i uygular.
7. **İstek jesti:** tam kol kaldırma (170°) ve iki el açık pozları; sinyal pastan hemen önce de verilebilir; kamera çerçevesindeki alıcıda öncelik.

## J.10 Ölçüler (öneri; test rejimi K)

- `b-olcum` genişlemesi: yüzey × (hedef vuran ayak tarafında mı) × |gövde–hedef| dağılımı; hazırlık+geri süresinin teknik ve mesafeye göre dağılımı (sıfıra yakın pay); pas çıkış hızının üç ailesi (%10/%50/%90); yerden pasta havalanma payı; eğri büyüklüğü (m, 20 m'de).
- Uzaklaştırma: maç başına sayı, hedefin saha dışı payı, 5 sn içinde oyun dışı payı, kendi 30 m'si dışındaki pay, en iyi alternatifin değeri.
- Düşüş: neden × kaynak × şiddet dağılımı; çizimde çarpma anındaki gövde açısal hızı, kare başına en büyük Δθ, el/diz yere değme zamanı.
- Jest: tür bazlı sayı (oyunda) ve "görünür jest saniyesi" (kamera kesitinde, silüeti değiştiren).
- Animasyon ölçümü: "A: vuruş stili" + gerilme süresi, karşı kol açısı, bitiriş yüksekliği; "A: düşüş" satırı.

## J.11 Bulunamayanlar

StatsBomb yer/alçak/yüksek pas payları; şut tekniği payları; bire bir bitiriş tekniği dönüşümleri; dış ayak ve topuk pas payları; profesyonel pas hızı dağılımı (Bundesliga/PL); chip ve kaleci fırlatma hız ölçümleri; kale vuruşu m/sn; EA/Konami düşüş animasyon kategorileri ve ayak/yüzey seçim mantığı; FM26 geçişlerinin teknik anlatımı. Kestirme yol `statsbomb/open-data` (`pass.height`, `pass.backheel`, `shot.technique`, `shot.one_on_one`, `pass.body_part`) — yalnız okuma hedefi, ürüne giremez (I §2.1); indirme kullanıcı onayı ister.

## Kaynaklar

- [K1] Kellis E, Katis A (2007). Biomechanical characteristics and determinants of instep soccer kick. J Sports Sci Med 6:154–165. https://pmc.ncbi.nlm.nih.gov/articles/PMC3786235
- [K2] Lees A, Nolan L (2002). Three-dimensional kinematic analysis of the instep kick under speed and accuracy conditions (Lees & Nolan 1998 derlemesiyle). https://www.sfbtr8.spatial-cognition.de/aigaion/index.php/publications/show/1687.html
- [K3] Lees A, Asai T, Andersen TB, Nunome H, Sterzing T (2010). The biomechanics of kicking in soccer: a review. J Sports Sci 28:805–817. https://lida.sport-iat.de/dfb/Record/4018653
- [K4] Levanon J, Dapena J (1998). Comparison of the kinematics of the full-instep and pass kicks in soccer. MSSE 30:917–927. https://www.bisp-surf.de/Record/PU199807303122
- [K5] Nunome H ve diğ. (2002). Three-dimensional kinetic analysis of side-foot and instep soccer kicks. MSSE 34:2028–2036. https://sfbtr8.spatial-cognition.de/aigaion/index.php/publications/show/1931.html
- [K6] Shinkai H, Nunome H ve diğ. (2008). Comparison of ball impact characteristics between side-foot and instep kicking. ISBS. https://ojs.ub.uni-konstanz.de/cpa/article/view/1999/1867
- [K7] Scurr J, Hall B (2009). The effects of approach angle on penalty kicking accuracy and kick kinematics. JSSM 8:230–234. https://jssm.org/jssm-08-230.xml-Fulltext
- [K8] Shan G, Westerhoff P (2005). Full-body kinematic characteristics of the maximal instep soccer kick. Sports Biomech 4:59–72; Shan & Zhang (2011) derleme. https://pmc.ncbi.nlm.nih.gov/articles/PMC3224572/
- [K9] Chen Y, Chang J-H. Soccer ball velocity on instep kick with and without arm swaying. ISBS. https://ojs.ub.uni-konstanz.de/cpa/article/view/4449/4138
- [K10] Kinetic comparison of a side-foot kick between experienced and inexperienced players (2007). Sports Biomech. https://lida.sport-iat.de/ta/Record/4013190
- [K11] Asai T ve diğ. Curve kick çalışmaları. https://shura.shu.ac.uk/2206/ ; Whiteside D ve diğ. "Bend it like Beckham": ball rotation in the curved kick. ISBS. https://ojs.ub.uni-konstanz.de/cpa/article/view/4446
- [K12] Andersen TB, Kristensen LB, Sørensen H (2008). Biomechanical differences between toe and instep kicking. Football Science 5. https://www.shobix.co.jp/jssf/tempfiles/journal/2008/024.pdf
- [K13] Ozaki H, Aoki K (2008). Kinematic and EMG analysis of infront curve soccer kick. Football Science 5:26–36 (Kawamoto 2006 ve Nunome 2002 aktarımı). https://www.shobix.co.jp/jssf/tempfiles/journal/2008/019.pdf
- [K14] Nunome H ve diğ. (2020/2025). Side-foot kicking with varied effort levels; dynamic adjustment of submaximal side-foot kicks. https://commons.nmu.edu/isbs/vol38/iss1/29 ; https://pubmed.ncbi.nlm.nih.gov/37357794/
- [K15] Mitschke C, Milani TL (2014). Detailed analysis of played passes in UEFA Euro 2012. Int J Sports Sci Coaching 9(5):1019–1032. https://lida.sport-iat.de/dfb/Record/4034768?lng=en
- [K16] 3-D kinematics during instep and outstep kicks in pubertal players. https://lida.sport-iat.de/ta/Record/4017545?lng=de
- [K17] Linthorne NP, Patel DS (2011). Optimum projection angle for a soccer punt kick. JSSM 10:203–214. https://jssm.org/jssm-10-203.xml-Fulltext
- [K18] Sugi S, Nunome H ve diğ. Kinematics of low, middle and high volley kicking in soccer. ISBS. https://ojs.ub.uni-konstanz.de/cpa/article/view/6957/6252
- [K19] Chiu Y-H ve diğ. (2005). Angular momentum of side-volley soccer shots at three ball heights. ISBS. https://ojs.ub.uni-konstanz.de/cpa/article/view/787/710
- [K20] The Analyst / Opta: Premier League long balls. https://theanalyst.com/articles/premier-league-long-balls-pressing-errors-stats
- [K21] The Trivela (Substack): the data behind Luka Modrić's trivela. https://thetrivela.substack.com/p/the-data-behind-luka-modrics-trivela
- [K22] Goal kicks by elite youth goalkeepers (2026). Int J Sports Sci Coaching, DOI 10.1177/17479541261452984
- [K23] University of Chichester tezi: Premier League 2019/20 kale vuruşları. https://eprints.chi.ac.uk/id/eprint/5522/
- [K24] Elleray A, Jones G (2012). English professional goalkeeper match actions. https://lida.sport-iat.de/dfb/Record/4027112?lng=en
- [K25] Sky Sports / Opta: kaleci pas tarzının değişimi. https://www.skysports.com/football/news/11661/11523344/
- [K26] StatsBomb: pass height & footedness case study; pass footedness in the Premier League. https://blogarchive.statsbomb.com/news/statsbomb-data-case-studies-passing-height-and-passing-footedness/ ; https://blogarchive.statsbomb.com/articles/soccer/pass-footedness-in-the-premier-league/
- [K27] England Football: different passing techniques in football. https://learn.englandfootball.com/articles-and-resources/coaching/resources/2023/Different-passing-techniques-in-football
- [K28] Pfaff C ve diğ. (2022). Controlling ball progression in soccer (pas çıkış hızı 16,2 m/sn, yavaşlama 7,93 m/sn²). arXiv:2210.16474. https://arxiv.org/pdf/2210.16474
- [K29] Characteristic of passes, World Cup 2014. Slobozhanskyi Herald 2016, 1(51):45–48. https://journals.uran.ua/sport_herald/article/view/67656/62892
- [K30] CIES Football Observatory: length of passes. https://football-observatory.com/Length-of-passes-the-best-like-it-short
- [K31] StatsBomb: the enigma of shot placement. https://blogarchive.statsbomb.com/articles/soccer/the-enigma-of-shot-placement/
- [K32] Tomkins Times: shot placement (12.736 isabetli şut). https://tomkinstimes.com/?p=15111
- [K33] Premier League / Opta: big chance dönüşümü. https://www.premierleague.com/en/news/2910303
- [K34] Perez-Arroniz ve diğ. (2025). Shooting and goalkeepers' response analysis. Apunts Sports Medicine 60:100480. https://apunts.org/en-download-pdf-S2666506925000045
- [K35] Causer J, Smeeton NJ, Williams AM (2017). Expertise differences in anticipatory judgements during a temporally and spatially occluded task. PLoS ONE. https://researchonline.ljmu.ac.uk/id/eprint/5418/5/journal.pone.0171330.pdf
- [K36] Franks IM, Harvey T. Cues for goalkeepers (138 Dünya Kupası penaltısı; BrianMac aktarımı). https://www.brianmac.co.uk/football/penalty.htm
- [K37] Soccer Coach Weekly: how to chip the ball. https://www.soccercoachweekly.net/coaching-advice/how-to-chip-the-ball
- [K38] Almeida C ve diğ. (2016). Penaltı yüksekliği (Twelve Yards özeti). https://twelveyards.substack.com/p/high-or-low-where-to-aim
- [K39] Isokawa M, Lees A (1988). A biomechanical analysis of the instep kick motion in soccer (Kellis & Katis 2007 aktarımı).
- [K40] Google Research Football / GameplayFootball kaynak kodu (Apache-2.0; `third_party/gfootball_engine/src/onthepitch/player/humanoid/`, `AIsupport/AIfunctions.cpp`, `ball.cpp`, `data/media/animations/`). https://github.com/google-research/football ; makale https://arxiv.org/abs/1907.11180
- [K41] EA: BOOM Tech (Madden NFL 25) — Driven Ragdoll, N-Teract, PTM. https://www.ea.com/technology/news/boom-tech-ea-sports-madden-nfl-25
- [K42] EA: FC 26 Pitch Notes gameplay deep dive. https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive ; FIFA 22 ML-Flow: https://80.lv/articles/ea-uses-machine-learning-for-animations-in-fifa-22
- [K43] EA: FIFA 12 Player Impact Engine. https://ea.com/news/fifa12-player-impact-engine-01
- [K44] Konami: eFootball new controls; motion matching (gamescom 2021). https://www.konami.com/efootball/en-us/page/new_controls ; https://www.mynewsdesk.com/uk/bastion-uk/pressreleases/new-efootball-gameplay-details-revealed-by-konami-at-gamescom-2021-3123618
- [K45] Sports Interactive: FM24 motion matching + IK; Hawk-Eye × SI. https://www.footballmanager.com/node/777 ; https://www.hawkeyeinnovations.com/news/4369378/hawkeye-and-sports-interactive-team-up-to-power-football-managers-new-era
- [K46] Rosen D (GDC 2014). Animation Bootcamp: an indie approach to procedural animation. https://www.gdcvault.com/play/1020583/Animation-Bootcamp-An-Indie-Approach ; Unity "procedural character animation: soccer". https://discussions.unity.com/t/procedural-character-animation-soccer/769433
- [K47] Kettunen: easy procedural hit reactions (UE). https://forums.unrealengine.com/t/kettunen-easy-procedural-hit-reactions/2741781
- [K48] Jakobsen T. Advanced character physics. https://www.gamedeveloper.com/programming/advanced-character-physics ; verlet ragdoll: https://code.tutsplus.com/simulate-tearable-cloth-and-ragdolls-with-simple-verlet-integration--gamedev-519t
- [K49] Direction-based hit reaction (devlog). https://swearsoft.itch.io/jackmclantern/devlog/76709/direction-based-hit-reaction ; aktif ragdoll: https://github.com/sergioabreu-g/active-ragdolls ; Wobbledoll: https://80.lv/articles/wobbledoll-developing-an-advanced-full-body-ragdoll-system/
- [K50] Dini D (GDC Europe 2013). Kick Off postmortem. https://gamedeveloper.com/audio/video-postmortem-of-dino-dini-s-classic-i-kick-off-i-
