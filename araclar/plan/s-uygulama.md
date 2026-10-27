# S — Sezonun içi: oyuncunun haftası, antrenman ve balkon, Kadro sekmesi, Canlı Skor'da lig, günlük gazete (uygulama planı)

Durum: **planlandı 2026-10-27; uygulama oto mod 5'te (dizüstü i7-8565U, Opus 5.5).**

- **Kaynak:** plan üç bağımsız tasarım önerisinin birleşimidir. Temel Tasarım 3'tür: gazete kullanıcı kararına en sadık biçimde kurulur, bütünlük parmak iziyle ölçülür. Tasarım 1'den kondisyon tarifinin iskeleti, koşullu ısrar ve saf form alındı. Tasarım 2'den yaşa ve dayanıklılığa bağlı yorgunluk, sakatlık eksiği, hoca tarzıyla gelişim ve gazetenin hafta ritmi alındı. Puanlar sondadır.
- **Kullanıcı onayı (2026-10-27):** “onaylıyorum başla oto modda”. Sıra S → H3 → Y1.
- **Dal ve etiket:** dal `claude/s-sezon-ici`, tabanı `main` 449dd1e (`tur/h2-istekler` ve makine durumu satırı). Etiket `tur/s-sezon-ici`; eski `tur/s1` ile karışmaz.
- **Yapılan:** S-0'ın ilk parçası. Üç sürüm 10 sigorta örneği 459ebfe'de.
- **Satır numaraları** 459ebfe'deki koddan okundu. Kayabilirler; uygulayıcı işlev adlarıyla çalışır.

| Kapsam (kullanıcı, 2026-10-27) | Alt adım |
|---|---|
| Dal, plan, sürüm 10 sigorta örnekleri, sezon tabanları (oyun kodu değişmeden) | S-0 |
| Oyuncunun haftası: kondisyon, form, gelişim, rotasyon, maç girdisinde küçük çarpan | S-a (antrenman programı da burada; S-b görünür kılar) |
| Antrenman ve balkon: günün türü, gerçek durumdan sinyal, dosyaya not | S-b |
| Dosya'da Kadro sekmesi ve oyuncu dosyası | S-c |
| Canlı Skor'da puan durumu, fikstür, kulüp ekranı | S-d |
| Günlük gazete | S-e |
| Belgeler, iki bağımsız inceleme, kapanış | S-f |

## Kullanıcı kararları (2026-10-27; turun bağlayıcı kapsamı)

- **Oyuncunun haftası (S-a)**
  - Kondisyon oynanan dakikayla düşer, günlerle toparlanır; yaş ve dayanıklılık etkiler.
  - Form gizlidir, maçtan maça yavaş değişir ve hocanın maç başı form zarının yerini alır.
  - Gelişim haftalık, küçük ve kalıcıdır: gençler yükselir, 30+ yavaş düşer, tavan gizlidir, garanti yoktur.
  - Bütün kulüplerde geçerlidir.
  - Hoca yorgun oyuncuyu dinlendirir ve formu tartar (rotasyon).
  - Maç girdisinde kondisyon ve form özelliklere küçük çarpan olarak girer (en çok ~%5 ve ~%3).
  - Motor dosyaları değişmez.
- **Antrenman ve balkon (S-b)**
  - Hocanın haftalık programı tarzına ve maç takvimine göredir: maç ertesi toparlanma, hafta ortası yoğun, maç öncesi hafif.
  - Yoğunluk kondisyonu ve gelişimi etkiler.
  - Balkondan izleyen başkan o günün gerçek durumundan sinyal görür: yorulan, parlayan genç, formu düşen, sakatlıktan dönen.
  - Her sinyal oyuncunun dosyasına tarihli not olarak düşer; cümleler TEST yer tutucusudur.
  - İzlemeyen bir şey kaybetmez.
  - Antrenman saatleri 15:00–17:00 kalır.
- **Kadro sekmesi (S-c)**
  - Sekme Dosya'dadır.
  - Satırda yalnız gözlenebilir sayılar durur: mevki, yaş, maç, dakika, gol, kart, sakatlık ve ceza, sözleşme bitişi, maaş.
  - Oyuncu dosyasında sert veri ve kaynaklı, tarihli notlar bulunur (antrenman, maç olayları, hocanın sözleri).
  - Puan, çubuk ya da form değeri yoktur.
- **Lig (S-d)**
  - Telefondaki Canlı Skor'a puan durumu ve fikstür gelir.
  - Kulübe dokununca sıra, puan, son beş, goller, hoca, tarz ve stat görünür.
  - Odaya düğme eklenmez.
- **Günlük gazete (S-e; Y0'daki haftalık kararının yerine)**
  - Her sabah 08:00'de masadadır ve önceki günden derlenir.
  - Manşet en önemli haberdir.
  - Kaynaklar: maç sonuçları, puan durumu, gol krallığı, sakatlıklar, transferler, hoca değişimi, yaklaşan maç.
  - Maçın ertesi sabahı en kalın sayıdır. Durgun günde tek sütun ya da “TEST: bugün haber yok”.
  - Okumak zaman almaz.
  - Masada yalnız son sayı “yeni”dir; eski sayılar arşivdedir.
  - Gazete kayda yazılmaz; her sayı maç ve geçmiş kayıtlarından saf işlevle yeniden kurulur. Kayda yalnız son okunan sayı girer.
  - İçerik paketleri kayıt defteriyle haber ekleyebilir; P12 hoca değişimi haberi bugünden girer.
  - Kullanıcı: “şu an illa içerik üreteceğiz diye uğraşmayalım, gerekirse her içerik TEST yazsın boş kalsın yeter ama bir gazete gerçekten de görelim.”
- **Belgeler ve kapanış (S-f)**
  - OYUN_TASARIMI §6'ya günlük gazete.
  - Kanal aciliyet sırası: gazete dün, TV bugün, telefon kişisel, kapı yüz yüze.
  - YOL_HARITASI karar 54; y-program ve h3 notları.
  - İki bağımsız inceleme; kapanış denetimleri.
- **Kararlar**
  - Moral yok (Y0).
  - Kondisyon ve form hiçbir yerde sayı olarak görünmez. Yalnız hocanın sözü ve antrenman notu vardır; gizli değer yalnız TEST panelindedir.
  - Sonuçlar bilerek değişir; S-0'da yeni sezon tabanı üretilir.
  - Motor tabanı `araclar/taban/g1.json` değişmez; `oturum-sonu --ayni` 40/40 kalır.
  - Kayıt sürümü 11 (eski kayıtta tam kondisyon ve nötr form); H3 12, Y1 13.
  - Bütün yeni metinler kısa TEST yer tutucusudur. Yeni kişi ve olay paketi yoktur.
- **Makine:** dizüstü. `akis-deneme`'nin gerçek zamanlı bölümleri burada zaman aşımına düşer. Tarayıcı denemeleri tek yürütücüyle, sırayla koşar.

## Sınırlar ve çalışma biçimi

- **Motor dosyaları değişmez.** Her commit'ten önce şu fark boş olmalı:
  `git diff --exit-code main -- js/kadrolar.js js/mac-motoru.js js/mac-profil.js js/mac-hareket.js js/mac-mudahale.js js/mac-hava.js js/mac-topla.js js/mac-kaleci.js js/mac-dizilis.js js/mac-takim.js js/mac-tarz.js js/mac-ilkeller.js js/mac-plan.js js/mac-karar.js js/mac-kurallar.js js/mac-durantop.js js/mac-sakatlik.js js/mac-sahne.js js/mac-senaryo.js js/mac-oncesi.js js/mac-izleme.js`
  - Liste `index.html`'de `js/mac-motoru.js` ile `js/mac-izleme.js` arasıdır.
  - Değişen `js/mac-*` dosyaları kariyer tarafındadır: `js/mac-girdi.js` (`macKaydi`), `js/mac-sonuc.js` (kanca ve `disarida`). KAPILAR'ın motor satırı yine koşar (`mac-deneme 4`). `ad-denetimi` (d) bu dosyalarda tohumsuz rastlantıyı yasaklar.
  - `MOTOR_AYAR`, motorun `kayit.form`/`rol`/`egilimler` kapıları, `varlik` ve işçinin dosya listesi (`arkaDosyalari`) değişmez.
- **Oto mod 5.** Makine durumu satırı `main`'de yazılı (449dd1e).
  - Her alt adım kendi kabulünü geçmeden commit edilmez.
  - Commit'ten sonra `git fetch` yapılır. Uzak dal başka makineden ilerlemişse push edilmez; durulur ve devam notuna yazılır. Zorla push yok.
  - Kesilirse son push'tan devam edilir.
- **Tek denetim yürütücüsü.** Ağır Node denemeleri (`sezon-deneme 18 …`, `oturum-sonu`) ile tarayıcı denemeleri aynı anda koşmaz. Uzun koşular arka planda yürür. H2'de uykuda bir koşu ~10 saat donup sürdü; sonuç geçerli kaldı.
- **Beklenen kırılmalar.** Her alt adımda `kariyer-deneme` ve `akis-deneme` çıktısındaki `!`/BAŞARISIZ satırları o adımın “Kabul”deki listesiyle karşılaştırılır. Listede olmayan düşüş düzeltilir ya da “Sapmalar”a gerekçesiyle yazılır.
- **Bütünlük ölçüsü.**
  - `OYUNCU_HAFTA_TEST.kapali` araç anahtarı S'nin sonuca etkisini kapatır.
  - Anahtar kapalıyken `sezon-deneme --karsilastir <S-0 tabanı> --ayni` her commit'te birebir tutmalıdır.
  - Anahtar açıkken fark bilgidir.

## Kapsam ve sıra

- **Sıra:** araç ve tabanlar (S-0) → oyuncu verisi ve rotasyon (S-a; kayıt sürümü 11 burada açılır) → balkon (S-b) → Kadro sekmesi (S-c) → Canlı Skor'da lig (S-d) → gazete (S-e) → belgeler ve kapanış (S-f).
- **Geri alınabilirlik:** her alt adım ayrı commit'tir. Yeni kod ayrı dosyalarda durduğu için adım tek başına geri alınabilir.
- **Tahmini makine süresi (dizüstü), toplam 22–27 saat:**

| Adım | Süre (saat) |
|---|---|
| S-0 | 1–1,5 |
| S-a | 5–6 |
| S-b | 2,5–3 |
| S-c | 2,5–3 |
| S-d | 3–3,5 |
| S-e | 3 |
| S-f | 4–6 |

### S-0 — plan, sezon-deneme aracı ve sezon tabanları (oyun kodu değişmez)

**Yapılan (459ebfe).** Üç sürüm 10 sigorta örneği H2 koduyla, H2-0 tarifiyle ve üç ayrı koşuyla üretildi:
- `araclar/ornekler/kayit-s10-hafta14.json`: 2026-11-28 21:00.
- `kayit-s10-ocak.json`: 2027-01-09 21:00, açık `teklifKarari`.
- `kayit-s10-sezonsonu.json`: `sezon.sonuc` var, İlerle engelli.

Bunlar yeniden üretilmez; yalnız kısa `node -e` ile denetlenir.

**Kalan işler**
1. `git fetch --prune --tags`; uzak dal ilerlemişse durulur. Bu plan `araclar/plan/s-uygulama.md` olarak commit'e girer.
2. `araclar/sezon-deneme.js`'te yalnız araç değişir:
   - **(a) Parmak izi.** Her satıra `iz` eklenir. Değeri `saglamaHesapla(JSON.stringify(…))`'dir. Girdi, haftanın 8 maçının fikstür sırasıyla `[macId, skor, goller [id,dk,kk], kartlar [id,renk,dk], sakatliklar [id,derece,gun], ilk11]` listesidir. Liste `haftaUygula`'dan sonra `k.maclar`'dan alınır. Oyuncu ve kayıt alanları (`hal`, sayaçlar, gazete) ize girmez.
   - **(b) Özet.** JSON'a `ozet:{p12, degisim, transferler, para, hukmen, sezonSonu, raporlar}` girer; bugün bunlar yalnız ekrana basılıyor (satır 112–149). Ayrıca `ayar` (uygulanan `SEZON_DENEME_AYAR`) yazılır.
   - **(c) `--karsilastir DOSYA [--ayni]`.**
     - Ortak haftaların şu alanları karşılaştırılır: `skor, adim, haftaGol, gol, kart, sakatlik, cezali, sakat, sira, puan, kasa, an, iz`.
     - `ms`, `msHafta` ve `kayit` yalnız bilgidir.
     - Hafta sayısı eşitse `ozet` de karşılaştırılır.
     - Farklar “! fark: hafta N alan: eski → yeni” satırı olarak basılır (ilk 10, ardından toplam).
     - `--ayni` ile fark çıkış 1 verir.
     - Sayı süzgeci (29) `--karsilastir`'ın değerini de dışlar.
   - **(d) `SEZON_DENEME_AYAR`.** Ortam değişkenidir, JSON biçimi `{"GLOBAL_AD":{alan:değer}}`.
     - Her `sezon()` çağrısında `motorYukle()`'den hemen sonra `Object.assign(G(AD), değer)` uygulanır.
     - Ad tanımlı değilse kullanım hatası verir (çıkış 2).
     - `MAC_DENEME_AYAR`'dan ayrıdır; `ayarUygula` yalnız `MOTOR_AYAR`'a yazar (motor-yukle 39–46).
     - S-0'da kullanılmaz; S-a'nın anahtarı içindir.
   - Başlık yorumu güncellenir.
3. **Tabanlar** H2 oyun koduyla üretilir; sırayla, arka planda, tarayıcı denemesiyle aynı anda değil:
   - `node araclar/sezon-deneme.js 18 7 --tek --teklif sat --talep onayla --p12 degisim --json araclar/taban/sezon-h2-t7.json` (~20–25 dk). Satış, hocanın isteği ve imza, P12 değişimi yollarını kapsar; P12 açılmazsa bilgi olarak yazılır.
   - `node araclar/sezon-deneme.js 18 3 --tek --kaydet --json araclar/taban/sezon-h2-t3.json` (~25 dk). Her hafta kaydet–yükle yapar; tohum farklıdır.
   - İki dosya depoya girer ve iki makinede ortaktır. Öbür makinede tutmazsa yerel taban üretilir, depoya alınmaz (CLAUDE.md taban kuralı). `g1.json` değişmez.
4. Commit: “S-0: plan, sezon-deneme parmak izi ve karşılaştırma, sezon tabanları (oyun kodu değişmeden)”. Ardından fetch ve push.

### S-a — oyuncunun haftası: kondisyon, form, gelişim, antrenman programı ve rotasyon; kayıt sürümü 11

Antrenman programı bu adımda gelir, çünkü kondisyonun toparlanması ve gelişimin yükü ona bağlıdır. S-b programı görünür kılar.

**Yeni dosya `js/oyuncu-hafta.js`** (`'use strict'`, DOM yok)
- **Yükleme yeri:** `index.html`'de `js/lig-maclari.js`'ten sonra, `js/sozlesme.js`'ten önce. `araclar/kariyer-deneme.js` `OYUN_DOSYALARI`'na aynı sırayla eklenir.
- **Araçlar:** `motor-yukle` ve `sezon-deneme` dosyayı kendiliğinden yükler (`js/goruntu.js`'ten önce).
- **İşçi:** işçinin listesi değişmez; çarpan girdiye ana iplikte işlenir.
- **Üst düzey:** yalnız tanım ve kayıt defterine ekleme bulunur: `MAC_KAYDI_EKLERI`, `EK_DENETIMLER`, `MESELE_OLAYLARI`, S-b'de `GOZLEM_SINYALLERI`. `oyuncuYasi` (sonra yüklenir) ve `kulupHocasi` yalnız çalışma anında çağrılır.

**TEST değerleri.** Tek nesnedir; kullanıcı değiştirir, `SEZON_DENEME_AYAR` ile taranır:
```
OYUNCU_HAFTA_TEST={kapali:false,
  konEsik:90, konAralik:40, konEnCok:0.05, konYuva:[0,9],
  formOlcek:50, formEnCok:0.03, formYuva:[1,2,3,4,5,6,7], formAr:0.75, formSok:25,
  dusus90:26, kaleciPay:0.35, sakatEksik:15, uzunCapa:60,
  toparlanma:{mac:3,dinlenme:6,toparlanma:4.6,hafif:4.2,yogun:6}, yogunKesinti:0.6,
  yuk:{toparlanma:0.4,hafif:0.5,yogun:1},
  gelEgri:{18:60,19:60,20:60,21:50,22:40,23:30,24:20,25:12,26:6,27:0,28:0,29:-8,30:-15,31:-22,32:-30,33:-40,34:-50},
  gelSok:40, gelYukNominal:3.9, gelYukSinir:[0.8,1.2], gelOynama:[0.7,0.3], gelYuvaEk:0.03, gelAlt:10,
  potansiyel:[[21,20],[24,10],[27,4],[99,0]], tavanEn:95,
  dususYuva:[[0,0.4],[9,0.35],[4,0.1],[5,0.1],[3,0.05]], dususYuvaKL:[[8,0.5],[0,0.3],[9,0.2]]};
ANTRENMAN_TARZ_YUK={dengeli:0.9,konumsal:1,iliskisel:1,kanatOrta:1,dikey:1.15,direkt:1.1};   // yalnız yoğun günü ölçekler
```
- `oyuncuHaftasiAcik=()=>!OYUNCU_HAFTA_TEST.kapali`.
- `kapali` araç anahtarıdır; kayda girmez, tarayıcıda hep açıktır.
- `gelEgri`'de yaş 18–34 arasına kırpılır.

**Veri.** Oyuncu kaydı `k.oyuncular` paylaşılan alandır, kopyala-yaz ile değişir.
- **`hal:{kon, gun, form, gel, tav}`** (isteğe bağlı):
  - `kon`: son maç kaydı anındaki kondisyon, tamsayı 0–100.
  - `gun`: o maçın günü.
  - `form`: −100…100.
  - `gel`: gelişim birikimi (yuva puanının yüzdesi), −99…99.
  - `tav`: gizli tavan, 1–99; ilk yazımda kurulur.
- **`mac`, `dk`:** bu sezonun sayaçlarıdır (gol ve sarı gibi); H3 sıfırlar.
- **Alan yoksa:** kondisyon 100, form 0, birikim 0; sayaç bilinmiyor sayılır.
- **`oz` ile ilişki:**
  - Kondisyon ve form `oz`'a yazılmaz; böylece maaşa, transfer değerine ve hocanın değerlendirmesine sızmaz (TEKNIK_PLAN §7).
  - Gelişim `oz`'a yalnız tamsayı adımla yazılır; `kadroDogrula`'nın 11 tamsayı (1–99) şartı aynen geçer.

**Antrenman programı (saklanmaz)**
- `kulupMacGunleri(k,kulupId)`: kulübün fikstür günlerini (devralınan haftalar dahil) artan sırayla verir.
  - Önbellek dondurulmuş `k.fikstur`'a bağlı bir `WeakMap`'tir (`FIKSTUR_DENETIMI` kalıbı).
  - Fikstür yoksa `[]`.
- `antrenmanProgrami(k,kulupId,tarih)` → `{tur, yuk}`. Kurallar sırayla uygulanır:
  1. O gün kulübün maçı varsa `{mac,0}`.
  2. Cumartesi ya da Pazar ise (`gunNo`) `{dinlenme,0}`.
  3. Sonraki maç yoksa `{hafif,0.5}`.
  4. Ertesi gün maç varsa `{hafif,0.5}`.
  5. Önceki maçtan bu yana hafta içi antrenman günü geçmediyse `{toparlanma,0.4}`.
  6. Kalan günlerde `{yogun, ANTRENMAN_TARZ_YUK[tarz]||1}`. Tarz `kulupHocasi`'ndan okunur; hoca yoksa dengeli.
- Bugünkü fikstürde hafta şöyle olur: Pazar dinlenme, Pazartesi toparlanma, Salı–Perşembe yoğun, Cuma hafif, Cumartesi maç.
- Hafta ortası hoca değişirse geçmiş günler bugünkü hocanın tarzıyla okunur (TEST; P12 değişimi çoğunlukla Pazar).
- `antrenmanYuku(k,kulupId,bas,bit)`: (bas, bit] günlerinin yük toplamı.

**Kondisyon (saf)**
- `oyuncuKondisyonu(k,p,tarih)`:
  - `hal` yoksa 100; `tarih ≤ hal.gun` ise `hal.kon`; aradaki gün sayısı `uzunCapa`'yı aşarsa 100.
  - Öbür durumda `hal.gun`'ün ertesinden `tarih`'e kadar her gün `kon=min(100, kon+R)` uygulanır.
  - R = `toparlanma[tür] × çarpan`. Yoğun günde taban `6×(1−0.6×yük)`'tür.
  - Sakatken (`p.sakat` ve gün < dönüş) R = 0.
  - Çarpan = `max(0.5, 1+(d−0.65)·0.6−max(0,yaş−28)·0.04+max(0,23−yaş)·0.02)`. Burada d = `oz[9]/100`, yaş `oyuncuYasi(p,gün)`.
  - Sonuç `Math.round` ile tamsayıya çevrilir. Program oyuncunun bugünkü kulübünden okunur.
- `kondisyonDususu(p,dk,tarih)` = `dusus90 × dk/90 × (1+(0.65−d)·0.8+max(0,yaş−29)·0.03)`; kalecide ayrıca × `kaleciPay`.
- **Ölçüm** (bu planın kontrolü; `node -e`, tohum 7; her hafta 90 dk oynandığı varsayıldı; 160 saha ilk 11 oyuncusu):
  - Haftalık net medyan −1,0.
  - Maç anında 75'in altına inen: 6 haftada 18, 9 haftada 42. 18 haftada hiç inmeyen 90.
  - 23 yaş ve altının 44/58'i hiç yorulmaz; 30+'nın 15/35'i 6 hafta içinde yorulur.
  - Yorgunluk yaştan ve dayanıklılıktan gelir.
  - `dusus90:28` ile medyan −3,0 olurdu (6 haftada 47).

**Form**
- `oyuncuFormu(p)` = `hal.form` ya da 0.
- `formAdim(k,p,macId)` = `clamp(round(0.75·f + 25·hocaZar(k.dunyaTohumu, \`${p.id}:form:${macId}\`)), −100, 100)`.
- Kulübün bütün oyuncuları her maç kaydında güncellenir. Durağan sapma ~15'tir.
- Form maç olayından beslenmez (Claude kararı 4).

**Maç girdisi çarpanı.** `macOzu(k,p,tarih)`:
- Anahtar kapalıysa ya da iki çarpan da tam 1 ise `p.oz.slice()` döner. Böylece nötr durumda kopya birebir aynıdır (3.4'ün metin eşitliği).
- Kondisyon çarpanı `ck = 1 − konEnCok·clamp((konEsik−kon)/konAralik, 0, 1)` hız ve dayanıklılığa uygulanır. kon ≥ 90'da 1, 50'de 0,95.
- Form çarpanı `cf = 1 + formEnCok·clamp(form/formOlcek, −1, 1)` pas, şut, kafa, sürüş, müdahale, görüş ve karara uygulanır; kalecide kaleciliğe de. Etki ±%3.
- Değerler 2 ondalığa yuvarlanır; motor `oz/100` okur (`mac-motoru.js:154`).
- `oz`'a yazılmaz. Motorun `kayit.form` kapısı açılmaz (`mac-profil.js:138`).

**Dakikalar.** `macDakikalari(k,f,x)` → `Map(id→dk)`. `x.ilk11` null ise (hükmen, yapay sonuç) boş döner.
- On bir 0. dakikada başlar. Olaylar dakika sırasıyla işlenir:
  - **Değişiklik:** `cikan` o takımın sahadaki oyuncuları arasında, `giren` kulübün on bir dışındaki ve henüz girmemiş oyuncuları arasında tekil adla eşlenir. Tekil değilse değişiklik atlanır (TEST sınırı).
  - **Kırmızı ya da ikinci sarı:** oyuncu o dakikada çıkar.
  - **Değişikliksiz `cikis` sakatlığı:** oyuncu o dakikada çıkar.
- Çıkış en çok 90'dır; uzatma bilinmez. Giren oyuncu en az 1 dakika alır.

**Gelişim.** Her maç kaydında iki kulübün bütün oyuncuları için çalışır.
- `gelisimOrt(p)`: sahada kalecilik dışı 10 özelliğin ortalaması; kalecide `0.6·oz[8] + 0.4·öbürlerinin ortalaması` (`maasTahmini`'nin tarifi).
- `tavanKur(k,p,tarih)`: ilk yazımda `tav = min(tavanEn, round(gelisimOrt + G(yaş)·u²))`.
  - u = `kadroRastgele(k.dunyaTohumu, \`${p.id}:tavan\`)()`.
  - G = `potansiyel` tablosundan: 21 yaş ve altı 20, 24 yaş ve altı 10, 27 yaş ve altı 4, üstü 0.
  - u² çoğu oyuncunun payını küçük tutar; garanti yoktur.
- **Haftalık adım:** `Δ = gelEgri[yaş] + gelSok·hocaZar(dünya, \`${p.id}:gel:${f.id}\`)`.
  - Δ > 0 ise iki çarpan uygulanır:
    - Yük çarpanı: `clamp(yük/3,9; 0,8; 1,2)`. Yük, kulübün önceki maç gününden bu maça kadar `antrenmanYuku`'dur; önceki maç yoksa f.tarih − 7.
    - Oynama çarpanı: `(0,7 + 0,3·min(1, dk/90))`.
  - `gelisimOrt ≥ tav` ise Δ en çok 0 olur.
- **`gel += round(Δ)`:**
  - `gel ≥ 100` ise bir yuva +1 artar ve `gel −= 100` olur.
    - Yuva `agirlikliSec` ile seçilir; rastlantı `kadroRastgele(dünya, \`${p.id}:yuva:${f.id}\`)`.
    - Ağırlık: `HOCA_ROL[HOCA_HAT_ROLU[mevki]].w[j]` + `HOCA_TARZ_AGIRLIK[tarz][j]` (yalnız sahada) + `gelYuvaEk`.
    - Saha oyuncusunda kalecilik (8) ve 99'daki yuva seçilmez.
  - `gel ≤ −100` ise `dususYuva`'dan (kalecide `dususYuvaKL`) bir yuva −1 azalır, en az `gelAlt`; `gel += 100` olur.
  - Haftada en çok bir adım atılır; `gel` [−99, 99] aralığına kırpılır.

**Yazım: tek yer, tek kopya (`js/mac-sonuc.js`)**
- **`MAC_KAYDI_EKLERI=[]`** (`MAC_SONUCU_EKLERI`'nin yanında, 43): biçim `(k,f,x)=>void`.
  - Her maç kaydında çağrılır (kısa ve hükmen dahil), `macKaydiYaz`'ın oyuncu bloğunun sonunda, `k.oyuncular=` atamasından (152) önce.
  - Kanca rastlantı çekmez; oyuncuya yalnız `x.al` ile yazar.
  - `x={kisa, hukmen, ilk11, degisiklikler, kartlar, sakatliklar, yeniSakat:buMac, al}`.
- **`oyuncuHaftasiYaz(k,f,x)`** bu deftere kaydolur. İki kulübün her oyuncusu için `p` önceki kayıttır (`k.oyuncular[id]`; girdinin okuduğu, maç öncesi sakatlık durumu). `q=x.al(id)`.
  - `dk = dakikalar.get(id)||0`. `dk > 0` ise ve sayaç alanı varsa `q.mac += 1`, `q.dk += dk`.
  - Anahtar açıksa ayrıca:
    - `kon0 = oyuncuKondisyonu(k,p,f.tarih)`.
    - `kon = dk ? max(0, kon0 − düşüş) : kon0`.
    - Oyuncu bu maçta sakatlandıysa `kon −= min(sakatEksik, gün)`.
    - `form = formAdim(...)`.
    - Gelişim işlenir; `oz` yeni dizi olur.
    - `q.hal = {kon, gun:f.tarih, form, gel, tav}`.
  - Haftanın 352 oyuncusu yeni kayıt alır. `al` kopyası bu blokta zaten var; bugün yalnız değişen oyuncu kopyalanıyordu.
  - Hafta içinde kulüpler ayrık olduğu için yazım sırası (önce öbür maçlar, sonra bizimki) sonucu değiştirmez.
- **`disarida`:**
  - 129'daki on bir güncellemesinden önce iki kulübün önceki on biri alınır.
  - Bizim maçın geçmiş kaydına (131, yalnız `!kisa`) başkanın kulübü için `önceki on bir ∩ maç günü uygun ∖ bu maçın on biri` yazılır; liste boşsa alan yok.
  - S-c'nin “on birde yoktu” notu bunu okur.
- 24–25'teki eskimiş not düzeltilir: öbür kulüplerin cezaları F7'den beri her maçta düşer.

**Maç girdisi (`js/mac-girdi.js`)**
- `macKaydi(p,k,tarih)`: `oz: k&&tarih&&typeof macOzu==='function' ? macOzu(k,p,tarih) : p.oz.slice()`.
- `macKadrosu` 36 ve 40'ta `k, tarih` geçirir. Bizim maç, öbür maçlar (`digerMacSecenegi`), işçi, kilit adım yolu ve `sezon-deneme` aynı girdiyi alır.
- Kondisyon maç gününden saf okunur. Tarayıcı girdiyi `ajandaIsiYap`'tan önce sabah kursa da (`mac-gunu.js:45–47`) sonuç Node'un 19:00 girdisiyle aynıdır.

**Hoca (`js/hoca.js`)**
- Yeni sabitler: `HOCA_FORM_PAYI=3`, `HOCA_YORGUN=0.5`, `HOCA_YORGUN_ESIK=85` (TEST). `HOCA_FORM` anahtar kapalı yol için kalır.
- `hocaDegeri(k,h,p,Y,tohum,yer,durum)`: `durum` verilirse 98'deki satır şöyle olur: `HOCA_FORM_PAYI·clamp(durum.form/50,−1,1) − HOCA_YORGUN·max(0, HOCA_YORGUN_ESIK − durum.kon)`. Verilmezse bugünkü zar kalır.
- `hocaKadroSec`: anahtar açıksa uygun oyuncuların `{kon, form}` değeri bir kez `Map`'e alınır. On bir (121) ve kulübe (126) aynı durumu kullanır.
- Uygunluk (`oyuncuUygunMu`) ve hükmen kuralı değişmez; dinlendirme hocanın tercihidir.
- Israr değişmez. Kulübe kilidi S-a kabulünde ölçülür. Kilit görülürse “bir önceki maçın on birindeyse 0,5 yer payı” eklenir; anahtar kapalıyken eski davranış sürer; karar “Sapmalar”a yazılır.
- Başlık yorumu güncellenir.

**Kurulum (`js/kariyer-kadro.js`)**
- `oyuncuUret` ve `oyuncuKaydi` `mac:0, dk:0` yazar; rastlantı çekmez.
- **`devralinanSayaclar(k,kulupId,oynanan)`** (TEST üretimi, gol ve sarı gibi):
  - `kadrolariKur`'un ilk döngüsünde, her kulübün kadrosundan hemen sonra ve gençler eklenmeden çağrılır.
  - Ayrı akış kullanır: `kadroRastgele(k.dunyaTohumu, \`${kulupId}:sayac\`)`. Böylece öbür üretimler birebir aynı kalır.
  - Kaleci yuvası: maç = oynanan, dk = 90 × maç.
  - Öbür on bir: maç = oynanan − (0–2); devralınan sakatsa 2 daha düşülür. dk = maç × (78–90).
  - Yedekler: maç 0–5, maç başına 10–35 dk.
  - Her oyuncuda maç ≥ sarı; gol > 0 ise maç ≥ 1; dk ≤ 90 × maç.
- `kadroDogrula` (kapıdan sonra): `mac` ve `dk` ya yoktur ya da tamsayıdır (0–99 ve 0–9999); `dk ≤ 90 × mac`.

**Doğrulama: `oyuncuHaftaDogrula` (`EK_DENETIMLER`)**
- Kayda ait denetimler kendi `WeakSet`'iyle, dondurulmuş oyuncu başına bir kez yapılır (`OYUNCU_DENETLENDI` kalıbı): `hal` yok ya da düz nesne; `kon` 0–100, `form` −100…100, `gel` −99…99, `tav` 1–99 tamsayı; `gun` geçerli tarih.
- Tarihe bağlı denetim her seferinde yapılır: `hal.gun ≤ k.tarih`.

**Hocanın sözü (`js/yazisma.js` `takimGoruntusu`, 101–106)**
- Görüntüye isteğe bağlı iki kimlik listesi eklenir:
  - `yorgun`: bugünkü kondisyonu 80'in altında olan en düşük üç oyuncu.
  - `formda`: formu 25 ve üstü olan en yüksek üç oyuncu.
- Sayı girmez; liste cevap anında kayda alınır.
- TEST metinleri:
  - Hoca (rakamsız): “X ve Y biraz yorgun; gerekirse dinlendiririm.” / “Z iyi günlerinde.”
  - Yardımcı: “Koşu verilerinde düşüş: X.”

**TEST görünümü**
- `js/test-gorunum.js` `testKadro`: bugünkü kondisyon, form, tavan, birikim ve günün programı eklenir; 8'deki “sabittir” notu kalkar.
- `js/ekran-oda.js` `kadroPaneli` (234–241): Kon ve Form sütunları; 238'deki not güncellenir.
- Yalnız “Test bilgileri” açıkken görünür.

**Araçlar**
- `kariyer-deneme`: yeni bölümler 3.10, 3.3b ve 1.4d (Kabul).
- `sezon-deneme`: yeni satır “Oyuncunun haftası (S-a; gizli, TEST)”. Anahtar kapalıyken de basılır. JSON'a `oyuncuHaftasi` girer. İçerik:
  - Maç anında ilk 11'in kondisyon ortalaması ve en düşüğü (her hafta, girdiden).
  - Dinlenen: önceki on birde olup maç günü uygun ve on birde olmayan oyuncular; toplam ve kulüp-maç başına.
  - Dinlenen düzenli oyuncunun art arda dışarıda kalma rekoru.
  - Yaş grubuna göre (≤21, 22–29, 30+) `gelisimOrt` farkı.
  - Form standart sapması.
  - Sakatlık toplamı ve hükmen.

**Yeni üst düzey adlar** (grep'te boş): `OYUNCU_HAFTA_TEST`, `ANTRENMAN_TARZ_YUK`, `oyuncuHaftasiAcik`, `kulupMacGunleri`, `antrenmanProgrami`, `antrenmanYuku`, `oyuncuKondisyonu`, `kondisyonDususu`, `oyuncuFormu`, `formAdim`, `macOzu`, `macDakikalari`, `gelisimOrt`, `tavanKur`, `oyuncuHaftasiYaz`, `oyuncuHaftaDogrula`, `MAC_KAYDI_EKLERI`, `devralinanSayaclar`, `HOCA_FORM_PAYI`, `HOCA_YORGUN`, `HOCA_YORGUN_ESIK`.

**Ölçüm (bu planın kontrolü, tohum 7)**
- Nötr formda (zarsız) 13. hafta:
  - Demirkapı ve Akdeniz'in on biri `KADROLAR` ile aynı.
  - Yalnız eskiharman, kocadere ve sogutlu'nun on biri, camlibel ve kuyulu'nun kulübesi değişir.
- 3.3'ün sayımı:
  - Kusursuzdan farklı 8/16, bilgisizde 13/16. Sınır 2–12 ve bilgisizde daha çok şartı tutuyor.
  - 3.3'ün ısrar ve sakat/cezalı satırları ile 3.4'ün K1 satırı aynen geçer.
- 16 kulübün hiçbirinde aynı adlı iki oyuncu yok.
- Açılışta Demirkapı'nın tek sakatı Nail'dir (dönüş 7 Aralık).

### S-b — antrenman ve balkon: günün türü, gerçek durumdan sinyal, dosyaya tarihli not

Program S-a'nındır (`antrenmanProgrami`). `ANTRENMAN_SAATI` (15:00–17:00) ve `antrenmanPenceresi` değişmez: örnek kariyerde fikstür yoktur ve 2.7 bu işleve dayanır; bugünkü fikstürde iki kural aynı günleri verir.

**Mekanizma (`js/gozlem.js`)**
- **`GOZLEM_SINYALLERI={}`:** `tur → {oncelik, gunler, sec(k,p,tarih,gun) → null|{siddet, alt?}}`. İçerik paketleri yeni tür ekleyebilir.
- **Sabitler:** `GOZLEM_SINYAL_EN_COK=3`, `GOZLEM_TEKRAR_GUN=7` (TEST).
- **`antrenmanSinyalleri(k,tarih)`** → `[{oyuncuId, tur, alt?, dk}]`. Saftır; yalnız başkanın kulübüne bakar.
  - Pencere ya da kadro yoksa `[]`.
  - Günün türü, sinyal türünün `gunler` listesinde olmalı.
  - Tekrar engeli: önceki 7 günün gözlem kayıtlarında aynı (oyuncu, tür) varsa atlanır. Aynı günün kayıtları sayılmaz; tarama tarih sınırında durur.
  - Sıra öncelik → şiddet → kimlik; ilk 3 alınır.
  - Dakika: `dk = bas + 5 + floor(kadroRastgele(k.dunyaTohumu, \`gozlem:${tarih}:${id}:${tur}\`)()·(bit − bas − 10))`. Liste dk sırasıyla döner; `k.rastlanti` çekilmez.
  - Üst sınır ve tekrar engeli gün düzeyinde olduğu için parçalı gözlemlerin birleşimi tek parça gözlemle aynıdır.
- **`gozlemAc`** (83–88): `k.gozlem.sinyaller` = adaylar ∩ [bas, bitis); liste boşsa alan yazılmaz. Liste açılışta dondurulur: aradaki ay başı, transfer ya da gün aşan kapanış onu değiştirmez.
- **`gozlemBitir`** (58–67):
  - Kayda `sinyaller:[{oyuncuId, tur, alt?, dk}]` yazılır: yalnız dk < bit olanlar ve hâlâ başkanın kulübündeki oyuncular. Liste boşsa alan yok.
  - Ayrı geçmiş kaydı açılmaz; akış 12 tek kayıt bekler.
  - Süre eşiği yoktur; 15 dakikalık gözlem de kendi aralığındaki sinyali yazar.
  - `not` alanı ve `GOZLEM_NOT_ESIGI` içerik notu için aynen kalır.
- **`gozlemKaydiMetni(k,kayit)`:** içerik notu varsa onu verir; yoksa ilk sinyalin metni ve “(n not dosyalara düştü)”; ikisi de yoksa null.
  - `gozlemBitir` ve `gozlemAdim`'in `not`'u bunu kullanır.
  - Dönüş biçimi değişmez; ekran-oda'nın 457, 469 ve 586. satırları yapısal olarak aynı kalır.
- **`gozlemAdim` dönüşüne `yeni`:** bu adımda geçilen sinyaller (önceki an ≤ dk < şimdi). Durdurmaz; `durakSorgusu`'na dokunulmaz.
- **`gozlemDogrula`** (98–104): `k.gozlem.sinyaller` (dizi, en çok 3, bilinen tür, dk [bas, bitis) içinde, oyuncu var) ve geçmişteki gözlem kayıtlarının `sinyaller` alanı denetlenir.
- **`gozlemNotlari(k,oyuncuId)`** → `[{tarih, dakika, kaynak:'Antrenman (balkon)', anahtar:'gozlem.'+tur, p:{oyuncuId, alt}}]`. Geçmişten okunur; S-c kullanır.
- **Başlık yorumu (11–12):** sinyal gözlenebilir davranıştır, sayı değildir. İzleyen o günün gerçek durumundan bilgi alır, izlemeyen bir şey kaybetmez. Para, moral ya da sonuç değişmez.

**Çekirdek türler (`js/oyuncu-hafta.js`; TEST eşikleri)**

| Tür | Öncelik | Gün | Koşul |
|---|---|---|---|
| `donus` | 4 | her antrenman günü | `p.sakat` var ve dönüşle gün farkı ≤ 3. Dönüş geldiyse “takımla çalıştı”, gelmediyse `alt:'ayri'` ile “ayrı çalıştı”. |
| `yorgun` | 3 | toparlanma ve yoğun gün | `oyuncuKondisyonu < 80`; şiddet 80 − kon. |
| `parlayan` | 2 | her antrenman günü | Yaş ≤ 21, `gelisimOrt < tav` ve (form ≥ 20 ya da gel ≥ 50). |
| `formDusuk` | 1 | her antrenman günü | Form ≤ −20 ve kadronun son on birinde. |

- Metinler `MESELE_OLAYLARI['gozlem.donus'|'gozlem.donusAyri'|'gozlem.yorgun'|'gozlem.parlayan'|'gozlem.formDusuk']` anahtarlarındadır ve okurken üretilir. Örnek: “TEST: X koşularda geride kaldı.”
- Kayda metin yazılmaz. `GOZLEM_NOTLARI` boş kalır.

**Ekran (`js/ekran-oda.js`; kural yok)**
- `gozlemSeridi` (286–303):
  - Satır “Antrenman sürüyor · yoğun gün (TEST)” olur.
  - İzlerken ya da gözlem dururken “Gördüklerin” listesi çıkar: `k.gozlem.sinyaller` içinden dk < şimdi olanların metni.
- `izlemeKare`: `r.yeni` doluysa şerit mesajı yazılır (aria-live, 354).
- `gozlemSonucu` (467): “Antrenmanı izledin.” ve ardından `gozlemKaydiMetni`.
- Test bilgileri açıkken şeritte günün adayları `testKutu` içinde görünür.
- `balkon.js` ve 3B sahne değişmez; `balkonDurum`'a anahtar eklenmez.

**Yeni üst düzey adlar:** `GOZLEM_SINYALLERI`, `GOZLEM_SINYAL_EN_COK`, `GOZLEM_TEKRAR_GUN`, `antrenmanSinyalleri`, `gozlemKaydiMetni`, `gozlemNotlari`. Bunlar `mac-okuma.js`'teki `GOZLEM_NOTU_METIN` ve `macGozlemNotu` ile çakışmaz.

### S-c — Dosya'da Kadro sekmesi ve oyuncu dosyası

**Yeni dosya `js/kadro-dosyasi.js`** (`'use strict'`, DOM yok; `mali-rapor.js`'in okuma sözleşmesi: kayda yalnız sayı girer, metin okurken kurulur)
- **Yükleme yeri:** `index.html`'de `js/mali-rapor.js`'ten sonra, `js/test-gorunum.js`'ten önce. `OYUN_DOSYALARI`'na aynı sırayla eklenir.
- **`kadroVar(k)`:** başkan görevde ve kulübünün kadrosu var.
- **`kadroSatirlari(k,kulupId)`** → `[{id, no, ad, mevki, yas, mac, dk, gol, sari, kirmizi, sakat:{neden,donus,belirsiz?}|null, ceza:{mac,neden}|null, bitis|null, maas|null}]`.
  - Sıra: önce mevki (KL, DEF, OS, FV), sonra forma numarası.
  - Anahtar kümesi tam olarak budur. `oz`, `hal`, kondisyon, form, tavan, bilgi ve ısrar yoktur.
  - `mac`/`dk` alanı yoksa null (ekranda “—”).
  - `kirmizi` `k.maclar` kartlarından tek geçişte sayılır (kırmızı ve ikinci sarı; 13. haftadan).
  - `sakat` yalnız dönüş gelecekteyse doludur.
  - Sözleşmesiz oyuncuda bitiş ve maaş null.
- **`OYUNCU_NOT_KAYNAKLARI=[]`** (`MESAJ_KAYNAKLARI` kalıbı): öğe `{ad, kaynakAd, notlar:(k,id)→[{tarih,dakika,anahtar,p}]}`. Çekirdek kaynaklar:
  1. **Antrenman:** `gozlemNotlari`.
  2. **Maç:**
     - Kaynak `k.maclar` kayıtlarıdır: oyuncunun gol, kart ve sakatlık olayları (derece ve gün).
     - Bizim maçların geçmiş kaydındaki `disarida` listesi “on birde yoktu” notunu verir.
     - Takım ve rakip maçtaki tarafından alınır; transferden sonra da değişmez.
  3. **Hoca:** geçmişteki `sonuc.yazisma` konu `takim` cevapları. Oyuncunun adı `sakat`, `cezali`, `yorgun` ya da `formda` listesinde geçiyorsa not düşer. Kaynak kişinin adıdır; not cevap anının görüntüsüdür.
  - Metinler `MESELE_OLAYLARI['not.*']` anahtarlarındadır (TEST). Gizli değerin sayısı hiçbir notta yoktur.
- **`oyuncuNotlari(k,id)`** → `[{tarih, dakika, kaynak, metin}]`.
  - Sıra: yeniden eskiye; eşitlikte kaynak sırası, sonra kayıt sırası.
  - En çok 30 not.
- **`oyuncuDosyasi(k,id)`** → `{kunye:{ad,no,mevki,yas,dogumTarihi,ayak,kulupAd}, sezon:{mac,dk,gol,sari,kirmizi}, durum:{sakat,ceza}, sozlesme:{bitis,maas}|null, notlar}`. Saf ve belirlenimcidir; kayda yazılmaz.

**`js/ekran-dosya.js` `dosyaGorunumu`** (87–146)
- **Sözleşme:** `D`'ye `kadro:boolean` ve `seciliOyuncu` eklenir. Koruma: `typeof kadroSatirlari==='function'&&kadroVar(k)`.
- **Sekme:**
  - `button.dsy-sekme.dsy-kadroSekme role=tab data-eylem="kadroSekme"`, yazısı “Kadro”; sayaçsızdır, Raporlar'ın solunda durur.
  - `margin-left:auto` bu sekmeye geçer (30, 33–34); Raporlar ve Arşiv'de 0 olur. Sekmeye `flex:none` verilir (27).
  - Konu, Raporlar ve Arşiv sekmelerinin `aria-selected` koşullarına `&&!D.kadro` eklenir (94, 98, 100).
  - Dal sırası: `if(D.kadro){…}else if(raporGor)…` (103).
- **Kadro listesi** tek geniş sayfadır (`grid-column:1/-1`, `table-layout:fixed`).
  - Sütunlar: No · Futbolcu · Mvk · Yaş · M · Dk · G · Kart (S/K) · Durum · Bitiş · Maaş.
  - Kısaltmalar `abbr title` taşır. Ad üç noktayla kısalır. Maaş `tlYazi` ile ve `nowrap`.
  - Ad düğmesi `data-eylem="oyuncuAc" data-oyuncu` kullanır; `data-is` taşımaz.
  - Tablonun altında not: “M ve Dk bu sezonun; devralınan haftalar TEST üretimi; eski kayıtta —.”
- **Oyuncu dosyası** iki sayfadır:
  - Sol sayfa: “◂ Kadro” (`kadroDon`), künye (`dsy-kunye`), “Bu sezon” (`od-dl`), durum ve sözleşme.
  - Sağ sayfa: “Notlar” (`dsy-notlar`; “metin — kaynak · tarih”; not yoksa “Henüz not yok.”).
  - Test bilgileri açıkken künyede `testKutu` görünür.
- **Stil:** modülün enjekte bloğunda; `STIL.kagit` kullanılır, yeni renk yoktur. Görünmez metin `.dsy-gizli` kalıbıyla yazılır.

**`js/ekran-oda.js`**
- **Durum:** `dosyaKadro` ve `seciliOyuncu` (157). `yeniEvet` sıfırlaması bu iki alanı da sıfırlar.
- **Korumalar:** dosya korumaları (104, 365, 387, 423) `||kadroVar(k)` alır. Açılış önceliği değişmez; Kadro yalnız konu ve rapor yokken son çaredir.
- **Eylemler:** `kadroSekme`, `oyuncuAc`, `kadroDon`. Okuma oldukları için `DURAKLATMADA_KAPALI`'ya girmez. `raporlar`, `arsiv` ve `dosyaAc` Kadro'yu kapatır.
- **Klavye:** Esc oyuncu dosyasında önce listeye döner, sonra kapatır. `[` ve `]` oyuncu dosyasında önceki ve sonraki oyuncuya geçer.
- **Kaydırma:** geri yükleme görünüm anahtarıyla yapılır (376–377, 411). Bugünkü rapor–konu kayması da düzelir.

**Yeni üst düzey adlar:** `kadroVar`, `kadroSatirlari`, `oyuncuDosyasi`, `oyuncuNotlari`, `OYUNCU_NOT_KAYNAKLARI`.

### S-d — Canlı Skor'da lig: puan durumu, fikstür ve kulüp ekranı (odada ve maçta)

Bu adım saf okumadır; kayda alan eklemez ve odaya düğme koymaz.

**Saf okumalar**
- **`js/fikstur.js`:**
  - `sezonTablosu(k,sonAn)`: isteğe bağlı ikinci parametre yalnız `anDakika(f.tarih,f.dakika) < sonAn` olan maçları sayar; verilmezse davranış bugünküyle aynıdır.
  - `canliTablo(tablo,sonuclar)`: `sezonTablosu` ya da `bulten.tablo` ile `[{ev,konuk,skor}]` listesinden `puanDurumu` biçiminde tablo verir; yerinde yazmaz.
  - `haftaFiksturu(k,hafta)` → `[{f, s|null}]`.
  - `ligBolgesi(bolgeler,sira)` → `'cikma'|'playoff'|'dusme'|''`. Bültenin kuralıyla aynıdır; bülten değişmez.
  - `golSiralamasi(k,{kulupId,sonAn,enCok})` → `[{id,ad,kulupId,gol}]`, çoktan aza.
    - `sonAn` verilirse o andan sonraki goller düşülür (kendi kalesine sayılmaz).
    - Kulüp o ana göre `oyuncuKulubuTarihte` ile bulunur.
  - `kulupOzeti(k,kulupId,tablo?)` → `{id, ad, kisa, sira, P, O, G, B, M, A, Y, AV, son, golculer:[≤3], hoca:{ad,tarz,tarzAdi}|null, stat:{ad,kapasite}, siradaki}`.
    - Boş son beş `[]` olarak kalır; uydurulmaz.
    - Bilgi ve ısrar yoktur.
- **`js/kulup-mali.js`:** `kulupStatTarifi(k,kulupId)`. Başkanın kulübünde `STADYUMLAR.kulup`, öbürlerinde `statTarifiUret` döner. `kulupKapasitesi` ve `mac-gunu.js` değişmez.
- **`js/transfer.js`:** `oyuncuKulubuTarihte(k,oyuncuId,an)`. Geçmişteki `transfer`/`ayrilis` kayıtları sondan geriye sarılarak o anki kulüp bulunur.

**Telefon görünümü (`js/ekran-telefon.js`, `skor` dalı 258–288)**
- **Sekmeler:** başlığın altında Maçlar · Puan durumu · Fikstür (`data-eylem="skorSekme" data-sekme`).
  - Yalnız etkin sekme DOM'a çizilir.
  - Maçlar varsayılandır ve bugünkü içerikle aynıdır.
  - Yeni öğeler `.tel-mac`, `.tel-ist` ve `skorAc` kullanmaz.
- **`telPuanTablosu`:**
  - 5 sütun (#, Takım, O, AV, P), `table.tel-tablo` fixed.
  - Bizim satır vurgulu; bölge sol kenarda; altta bültenin lejantı.
  - Takım hücresinde `data-eylem="kulupAc" data-kulup`.
- **`telFikstur`:**
  - Gezinti `‹ N. hafta ›` (`fiksturHafta`; `ilkHafta` ile `haftaSayisi` arasında).
  - Oynanmış maç bugünkü kalıpla dokunulur ve `macAyrintisi` ile açılır; gelecek maç saat ve “–” gösterir.
  - Varsayılan hafta odada bekleyen maç gününün haftası, yoksa son oynanan hafta; maçta bugünün haftası.
- **`telKulupEkrani(oz,{canli})`:** yeni `kulup` ekranı; geri düğmesi `skorGeri`. Gösterilenler:
  - sıra, puan ve G-B-M;
  - goller: atılan, yenilen ve AV;
  - ilk üç golcü;
  - son beş maç;
  - sıradaki maç;
  - teknik direktör ve tarzı;
  - stat ve kapasitesi.
- **`telGezinti(T,b)`:** iki ev sahibinin ortak geçişidir. Stil `.tel-sekmeler`, `.tel-sekme`, `.tel-tablo`, `.tel-kulup`; `--k-*` değişkenleri kullanılır.

**Oda (`js/ekran-oda.js`)**
- `tel` nesnesine `skorSekme:'maclar', hafta:null, kulup:null` eklenir.
- Sıfırlama yerleri: `telUyg`, `telAnaEkran`, `panelAc`, yeni kariyer.
- Eylemler `telGezinti` ile yönlenir.
- Kaydırma koruması ekran ve sekme anahtarıyla çalışır.
- Esc: kulüp ekranından Canlı Skor'a, oradan ana ekrana, sonra kapatır.

**Maç telefonu (`js/ekran-mac-telefon.js`)**
- `macVerisi` ve `digerVerisi` satırlara `evId`, `depId` ve sayısal skor ekler; santradan önce skor null'dır.
- `M.tablo = canliTablo(MAC_GUNU.bulten.tablo, skorlu satırlar)`; oyun sürerken küçük bir “Canlı” notu görünür. Telefon açıkken maç durduğu için gösterilen, donmuş anın tablosudur.
- Kulüp ekranında son beş “önceki haftalar” etiketiyle görünür.
- Kariyersiz adreste yalnız tablo vardır; dokunulmaz ve Fikstür sekmesi yoktur.

**Yeni üst düzey adlar:** `canliTablo`, `haftaFiksturu`, `ligBolgesi`, `golSiralamasi`, `kulupOzeti`, `kulupStatTarifi`, `oyuncuKulubuTarihte`, `telGezinti`, `telLigSekmeleri`, `telPuanTablosu`, `telFikstur`, `telKulupEkrani`.

### S-e — günlük gazete: her sabah 08:00, saf olarak yeniden kurulan sayı

**Kayıt defteri (`js/soz.js`)**
- `GAZETE_KAYNAKLARI=[]`: öğe `{ad, haberler:(k,P)=>[{onem, an, anahtar, p, kutu?, meseleId?}]}`; `P={tarih, bas, son, biz}`.
- `odaIzleri` eski alanlarını aynen korur. İki ucuz alan eklenir:
  - `sayi`: son sayının tarihi.
  - `gazeteYeni`: `sayi > (k.gazeteOkunan||'')`.

**Yeni dosya `js/gazete.js`** (`'use strict'`, DOM yok; `js/kadro-dosyasi.js`'ten sonra, `js/test-gorunum.js`'ten önce)
- `GAZETE_TEST={ad:'Yerel Gazete (TEST)', enCok:6, kalinEnCok:8, yaklasan:3}`. Arşivin başı `BASLANGIC_TARIHI`'dir.
- `gazetePenceresi(tarih)` = [dün 08:00, bugün 08:00).
- `gazeteSonTarihi(k)`: 08:00 geçtiyse bugün, geçmediyse dün.
- `haberAkisi(k,bas,son)`: kaynakların haberlerini önem ↓ → an → kaynak sırası → kaynak içi sırayla verir.
- `gazeteSayisi(k,tarih)` → `{tarih, no, gunAdi, manset, haberler, kalin, ince, bos}`; aralık dışında null.
  - Manşet ilk haberdir. Haber sayısı en çok 6, kalın sayıda 8.
  - `kalin`: pencerede başkanın kulübünün maçı var.
  - `bos`: haber yok; tek satır `gz.bos` “TEST: bugün haber yok”.
  - `ince`: öbür durumlar.
- **Çekirdek kaynaklar** (önemler TEST):

| Kaynak | Ne zaman | Önem |
|---|---|---|
| `mac` | Penceredeki bizim maç | 100 |
| `mac` | Öbür sonuçlar (tek haber) | 50 |
| `tablo` | Maç ertesi | 45 |
| `tablo` | Pazartesi | 25 |
| `golcu` | Maç ertesi | 35 |
| `sakat` | Bizim oyuncu, ≥ 7 gün | 60 |
| `sakat` | Öbür kulüp, ≥ 14 gün | 25 |
| `yaklasan` | Maç günü | 80 |
| `yaklasan` | 1–3 gün kala | 20 |
| `sezonSonu` | Sezon sonu kaydı pencerede | 120 |
| `kayit` | `k.haberler` gazete kayıtları (`GAZETE_ESKI_ANAHTAR` hariç) | 40 |

- **İçerik paketleri:**
  - `js/icerik-p12.js`, `hocaDegisimi` geçmişinden `p12.haber` üretir (önem 90); 195'teki `haberEkle` kalkar.
  - `js/transfer.js`, `transfer` geçmişinden `tr.haber` üretir (önem 70); 137 ve 208'deki `haberEkle` kalkar.
- `gazeteOkundu(k,tarih)`: yalnız son sayı için `k.gazeteOkunan=tarih` yazar.
- `gazeteDogrula`: `gazeteOkunan` ya yoktur, ya null'dır, ya da `k.tarih`'ten ileri olmayan bir tarihtir.

**Ekran (`js/ekran-oda.js`)**
- `gazetePaneli` yeniden yazılır: künye, manşet, haberler, kutular, gezinti (`gazeteSayi`) ve masadaki not.
- Masada gazete: `gazeteVar = !!iz.sayi || !!iz.kart`.
- `panelAc('gazete')` son sayı yeniyse `gazeteOkundu`'yu çağırır.
- `ilerleOzeti`: “Masada yeni gazete var.” yalnız sayı değiştiyse yazılır.
- Klavye: `[` ve `]` sayılar arasında gezinir.

**Kayıt:** tek alan `k.gazeteOkunan`.

**Yeni üst düzey adlar:** `GAZETE_KAYNAKLARI`, `GAZETE_TEST`, `GAZETE_ESKI_ANAHTAR`, `gazetePenceresi`, `gazeteSonTarihi`, `haberAkisi`, `gazeteSayisi`, `gazeteOkundu`, `gazeteDogrula`.

### S-f — belgeler, KAPILAR, iki bağımsız inceleme ve kapanış

**Belgeler**
- **OYUN_TASARIMI:**
  - §6: günlük gazete; Y0'ın “haftalık, Pazartesi” kararının yerine geçtiği notu.
  - §6: kanal aciliyet sırası (gazete dün, TV bugün, telefon kişisel, kapı yüz yüze).
  - §6: balkon sinyalleri.
  - §8: rotasyon.
  - §9: kondisyon, form, gelişim; Kadro sekmesi.
  - §2 ekran tablosu; §13.
- **TEKNIK_PLAN:**
  - §3: sürüm 11 tablosu ve zincir S 11, H3 12, Y1 13.
  - §6: yeni kayıt defterleri.
  - §7: `hal`.
  - §8: `macKaydi` çarpanı.
  - §10: telefon ve gazete paneli.
  - §11: kayıt boyu.
- **STIL_REHBERI §7:** gazete her sabah; Canlı Skor sekmeleri; Kadro tablosu; balkon şeridi.
- **YOL_HARITASI:** karar 54 (karar 51 ve 52'nin gazete satırlarının yerine geçtiği notuyla); devam notu; tamamlanan turlar tablosu.
- **CLAUDE.md:** “Bugün çalışan” (kayıt sürümü 11), “Program”, “İçerik”.
- **Plan dosyaları:** `y-program.md`, `h-program.md`, `OKU.md`.
- **`h3-uygulama.md` notu:**
  - sürüm 12;
  - geçiş bölümü 1.4e ve akış §26;
  - s11 sigorta örnekleri S koduyla;
  - sezon geçişinde `mac`/`dk` da sıfırlanır;
  - `hal` yeni sezona taşınır;
  - gazete arşivi sezona bağlanır.
- **Kod yorumları:** `mac-sonuc.js`, `test-gorunum.js`, `ekran-oda.js`, `gozlem.js`, `kariyer.js`.
- **KAPILAR:** her alt adımın satırı kendi commit'inde eklenir; burada gözden geçirilir.

**İnceleme.** H2 kalıbı uygulanır:
- Bir inceleme kural, veri ve kayıt; öbürü ekran, akış ve erişilebilirlik.
- Her bulgu için bir doğrulayıcı.
- Her düzeltmeye bir denetim eklenir.

**Kapanış**
- Yeni sezon tabanları üretilir: `araclar/taban/sezon-s-t7.json` ve `sezon-s-t3.json`.
- Etiket `tur/s-sezon-ici` dalda konur; dal ve etiket push edilir.
- `main`'e alma ve push (GitHub Pages yayını) kullanıcının sözüyle yapılır. Söz gelmezse H3 dalı `tur/s-sezon-ici`'den açılır.
- Makine durumu satırı oto mod bitince “boşta” olur.

## Kayıt sürümü

- **Sürüm 11, bütün tur için tek geçiş.** S-a'da açılır:
  - `js/kariyer.js`: `KARIYER_SURUM=11` ve sürüm notu.
  - `js/kariyer-ornek.js`: `kayitSurumu:11`.
- **`KAYIT_GECISLERI[10]`** (`js/kayit.js`, [9]'un ardından): yalnız `v.kayitSurumu=11`. Düz veri dönüşümüdür: kural işlevi çağırmaz; para hareketi, iş ya da haber üretmez. Açık kararlar ve açık gözlem olduğu gibi kalır.
- **Neden geçiş var:** yeni kod şunları yazar:
  - oyuncuya `hal` ile `mac`/`dk`;
  - gözlem kaydına `sinyaller`;
  - geçmiş `mac` kaydına `disarida`;
  - kariyere `gazeteOkunan`.

  Ayrıca gazete haber kayıtlarını artık yazmaz. Sürüm 10 kodu yeni alanları sessizce yok sayardı; sürüm numarası 11'lik kaydı eski kodda doğru yoldan (“daha yeni sürüm”) reddettirir.
- **Alan yok kuralı** (veri dönüştürülmez):

| Alan yoksa | Anlamı |
|---|---|
| `hal` | Kondisyon 100, form 0, birikim 0 (kullanıcının “eski kayıtta tam kondisyon ve nötr form” kararı); tavan ilk maç kaydında kurulur. |
| `mac`/`dk` | Bilinmiyor; ekranda “—”, sayılmaz; yeni sezonda H3 sıfırlar. |
| `sinyaller` | Sinyalsiz gözlem. |
| `disarida` | Not yok. |
| `gazeteOkunan` | Okunmamış. |

  Eski `k.haberler`'deki gazete kayıtları kalır; `p12.haber` ve `tr.haber` gazetede geçmişten kurulur.
- **Doğrulama:**
  - `oyuncuHaftaDogrula` (`hal`; kayda ait denetim bir kez, `hal.gun ≤ k.tarih` her seferinde);
  - `kadroDogrula` (`mac`, `dk`);
  - `gozlemDogrula` (`sinyaller`);
  - `gazeteDogrula` (`gazeteOkunan`).
- **Zincir ve sigorta:**
  - `ESKI_KAYIT_SINIRI` 8 kalır (8→9→10→11); içerik sürümü 5 kalır.
  - Sigorta örnekleri 459ebfe'de.
  - Yeni 1.4d üç örneği açar.
  - 1.4, 1.4b, 1.4c, 2.8L ve akış 21'in sürüm satırları 11 olur.
  - `python -X utf8 araclar/kontrol.py araclar/kayit-deneme.html` koşar.
- **Ara sürüm:** S-a sürümü 11 yapar; S-b, S-c ve S-e aynı sürüme isteğe bağlı alan ekler. Dal içindeki ara sürüm 11 kayıtları yalnız denemelerdedir ve desteklenmez; yayına tek geçiş çıkar.
- **Kayıt boyu (tahmin):**
  - açılış ~160 KB → ~167 KB (`mac`/`dk`);
  - ilk maçtan sonra `hal` ~+23 KB (bir kez; zamanla büyümez);
  - gözlem sinyali kayıt başına ~40–120 B;
  - `disarida` maç başına birkaç kimlik;
  - gazete sayısı kayda girmez (`gazeteOkunan` ~25 B);
  - P12 ve transfer haber kayıtları artık yazılmaz.

  `sezon-deneme`'nin kayıt sütunu izler.
- **Sonraki turlar:** H3 sürüm 12 (`KAYIT_GECISLERI[11]`, s11 sigorta örnekleri S koduyla, 1.4e, akış §26), Y1 sürüm 13.

## Kabul

**Her alt adımın commit'inden önce (S-a…S-e; S-0'da ilk dördü)**
- `node araclar/mac-deneme.js 4` → “sonuç aynı”.
- `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni` (dizüstünde `--mac 24`; arka planda, ~8 dk) → birebir. Kabul dışı satırlar yalnız bilinen borçlar: `c-1v1` eğim, `d-sut` iki satır, `c-orta` “erken · 3–3”.
- `node araclar/ad-denetimi.js` temiz: yeni betikler ve adlar, blok içi `function` sızıntısı yok, `js/mac-*`'te tohumsuz rastlantı yok.
- `node araclar/kariyer-deneme.js` çıkış 0 (o adımın beklenen kırılmaları güncellendikten sonra).
- Motor dosyalarının `main` farkı boş.
- Bütünlük (S-a'dan sonra): `SEZON_DENEME_AYAR='{"OYUNCU_HAFTA_TEST":{"kapali":true}}' node araclar/sezon-deneme.js 6 7 --tek --teklif sat --talep onayla --p12 degisim --karsilastir araclar/taban/sezon-h2-t7.json --ayni` → çıkış 0 (~8 dk). PowerShell'de `$env:SEZON_DENEME_AYAR='…'; node …`.
- Tarayıcı bölümleri tek tek koşar, ağır Node işiyle aynı anda değil.

**S-0**
- S-0 commit'i `js/` ve `index.html`'e dokunmaz; `kariyer-deneme` çıkış 0.
- Üç `kayit-s10-*.json` kısa `node -e` ile denetlenir:
  - sürüm 10;
  - hafta14 2026-11-28 21:00;
  - ocak 2027-01-09 21:00, açık `teklifKarari`, son cevap 10 Ocak 18:00;
  - sezonsonu `sezon.sonuc` var ve `ilerleOnizle` engeli `SEZON_SONU_METNI`.
- İki taban:
  - 18 satırlı, her satırda `iz`, dosyada `ozet`;
  - `hatalar` boş;
  - t3'te `raporlar` H2 kapanışındaki değerlerle aynı (16 haftalık, 4 aylık).
- Öz denetim:
  - `node araclar/sezon-deneme.js 2 7 --tek --teklif sat --talep onayla --p12 degisim --karsilastir araclar/taban/sezon-h2-t7.json --ayni` → çıkış 0;
  - tabanın scratch kopyasında bir haftanın `iz`'i bozulunca → çıkış 1;
  - `SEZON_DENEME_AYAR='{"YOK_BOYLE":{}}'` → çıkış 2.

**S-a**
- Yeni `kariyer-deneme` **3.10 — oyuncunun haftası.**
  - Kurulum: tohum 7; motor yok. Yapay hafta: sekiz maç `macGirdisi`/`digerMacPlani` kadrolarının gerçek on biriyle oynanır. Her takımda 60. dakikada bir değişiklik olur, bir oyuncuya 70. dakikada kırmızı verilir, skor 0–0'dır; sonuçlar `haftaSonuclariUygula` ile uygulanır.
  - (a) **Dakikalar:**
    - on bir 90, çıkan 60, giren 30, kırmızılı 70;
    - kulübede kalanın sayacı artmaz;
    - 16 kulübün ilk 11'inde `mac` +1;
    - bilinmeyen ad ve iki adaylı ad dakika yazmaz.
  - (b) **Düşüş:**
    - oynayanın `hal.kon` değeri `kon0 − düşüş`, oynamayanınki `kon0`; `gun` maç günü;
    - aynı dakikada dayanıksız ve yaşlı oyuncu daha çok düşer;
    - yeni sakatlıkta eksik en çok 15;
    - sakatken toparlanma yok.
  - (c) **Toparlanma:**
    - günle artar ve 100'ü aşmaz;
    - kopyada dayanıklılığı düşürülen ya da yaşı büyütülen oyuncu daha yavaş toparlanır;
    - dikey tarzın haftası dengeliden az toparlar.
  - (d) **Zamanın parçalanması:** Pazar 08:00'den Cumartesi 08:00'e tek adım ≡ 576 × 15 dk: `oyuncular` metni ve `oyuncuKondisyonu` aynı. Dakikalık komut oyuncuları paylaşmayı sürdürür.
  - (e) **Form**, 18 yapay haftada:
    - maç başına sınırlı (|Δ| ≤ 0,25·|f| + 25);
    - dağılır (sd > 5);
    - ardışık korelasyonu > 0.
  - (f) **Gelişim**, 18 yapay haftada:
    - 21 yaş ve altının `gelisimOrt` ortalaması artar, 30+'nınki azalır;
    - tavanını bir adımdan çok aşan yok;
    - `oz` 11 tamsayı, 1–99;
    - saha oyuncusunda kalecilik 5;
    - en az bir genç hiç ya da çok az gelişir.
  - (g) **Çarpan:**
    - açılışta girdinin `oz`'u `p.oz` ile metin olarak aynı;
    - kopyada kon 50 ile hız ve dayanıklılık ×0,95, form +50 ile form yuvaları ×1,03, öbür yuvalar aynı;
    - aynı oyuncu bizim maçın ve `digerMacSecenegi`'nin girdisinde aynı `oz`'u taşır;
    - kariyer değişmez.
  - (h) **Kopyala-yaz ve kayıt:**
    - eski nesne değişmez;
    - kaydet–yükle aynı;
    - ikinci uygulama reddedilir;
    - `rastlanti.durum` değişmez;
    - aynı tohum aynı `hal`.
  - (i) **Anahtar kapalı:**
    - `hal` yazılmaz;
    - `macKaydi` düz kopya;
    - `hocaKadroSec` eski zarla 13. ve 14. haftada birebir.
  - (j) **Bozuk kopyalar yakalanır:** kon 120, form 300, gel 150, tav 0, gelecekteki `gun`, `mac` −1, `dk > 90×mac`.
  - (k) **Devralınan sayaçlar:**
    - gol > 0 ise maç ≥ 1; maç ≥ sarı; dk ≤ 90 × maç;
    - gençlerde 0;
    - öbür üretilmiş alanlar sayaçlar eklenmeden önceki kodla aynı.
  - (l) **`disarida`:** on birinden bir oyuncu çıkarılan kopyada o oyuncu bizim maçın geçmiş kaydında; sakat ve cezalı listede yok.
  - (m) **Hocanın sözü:**
    - `takim` cevabında `yorgun` ve `formda` kimlik listeleri var;
    - hoca metni `/\d/` içermez;
    - sonradan kondisyon değişse de metin aynı kalır.
- Yeni **3.3b — rotasyon:**
  - kopyada `hal`'i {kon 55, gun maç günü} olan on bir oyuncusu dinlenir, benzer yedek girer;
  - kon 95'te oynar;
  - değeri eşitlenmiş iki oyuncudan formu +50 olan seçilir;
  - anahtar kapalıyken seçim eski seçimle aynı.
- Yeni **1.4d — kayıt 10 → 11:**
  - üç s10 örneği `["10→11"]` ile açılır;
  - oyuncular, `oz`, hareketler ve kişiler aynı;
  - bütün oyuncularda kondisyon 100, form 0;
  - `kariyerDogrula` temiz;
  - ikinci açılış geçiş yapmaz;
  - Ocak örneğinde teklif kartı cevaplanabilir;
  - sezon sonu örneğinde engel `SEZON_SONU_METNI`;
  - hafta14 örneğinden bir yapay haftadan sonra `hal` yazılır, `mac`/`dk` yok kalır.
- **Beklenen kırılmalar** (bilinçli güncellenir):
  - `kariyer-deneme` 1.4 (220);
  - 2.8L (239);
  - 1.4b (927–929);
  - 1.4c (956);
  - `akis-deneme` 21 (2000: `surum == 11`).

  3.3 ve 3.4 aynen geçmeli (ölçüldü).
- **Bütünlük:** anahtar kapalı t7 ve `6 3 --tek --kaydet --karsilastir araclar/taban/sezon-h2-t3.json --ayni` → çıkış 0. Anahtar açık `node araclar/sezon-deneme.js 6 3 --kaydet` → belirlenimci.
- **Kalibrasyon** (commit'ten sonra arka planda; değer düzeltmesi ayrı küçük commit):
  - Koşular: `18 7 … --karsilastir sezon-h2-t7.json` ve `18 3 --tek --karsilastir sezon-h2-t3.json` (bilgi).
  - Bantlar (TEST):

| Ölçü | Bant |
|---|---|
| Dinlenen, kulüp-maç başına | 0,2–1,5 |
| Maç anı ilk 11 kondisyonu | ortalama ≥ 80, en düşük ≥ 50 |
| Dinlendirilen düzenli oyuncunun art arda dışarıda kalması | en çok 4 maç |
| `gelisimOrt` farkı, 21 yaş ve altı | +0,3…+2 |
| `gelisimOrt` farkı, 30+ | −0,1…−1 |
| Form standart sapması | 8–25 |
| Sakatlık toplamı | tabanın ±%30'u |
| Hükmen | taban + 2'ye kadar |

  - Bant dışında: soru başına en çok iki tarama değeri, iki tohumla. 4–10 maçla karar verilmez.
- **Tarayıcı:** `akis-deneme` 1, 2, 3, 19, 21; `kontrol.py`. “Odaya dön” süresi bilgi olarak yazılır.

**S-b**
- 2.7 ve 2.8L'nin “gözlem içeriksiz çalışır, not bırakmaz” satırı aynen geçer: açılışta `hal` yok ve Nail'in dönüşü 14 gün sonra, yani sinyal yok.
- Yeni **2.7b — antrenman programı ve balkon sinyalleri:**
  - **Program:** 23–29 Kasım toparlanma, yoğun, yoğun, yoğun, hafif, maç, dinlenme. Demirkapı (direkt) yoğun gün yükü 1,1. Kopyada tarz değişince yük değişir. Örnek kariyerde hafta içi hafif.
  - **Sinyaller:**
    - kondisyonu 60 yapılan oyuncu Salı “yorgun”;
    - dönüşü 3 gün içinde olan sakat “donus” (önce “ayrı”, dönüşte “takımla”);
    - günde en çok 3, öncelik sırasıyla;
    - 7 gün içinde tekrar yok;
    - dk [905, 1015) aralığında.
  - **Parçalama:** tek parça ≡ 4 × 30 ≡ 1 dakikalık adımlar ≡ araya kaydet–yükle; geçmişteki sinyallerin birleşimi ve bütün kariyer aynı.
  - **Kenar durumlar:** 15 dakikalık gözlem yalnız kendi aralığındaki sinyali yazar; satılan oyuncunun sinyali kayda düşmez.
  - **Yan etki yok:** sinyal iş, mesele, söz ya da haber açmaz; `rastlanti.durum` aynı; antrenmanda sakatlık yok.
  - **İzlemeyen kaybetmez:** her gün izleyen ve hiç izlemeyen iki kariyerde `oyuncular`, `maclar` ve sonraki maç girdisi birebir aynı.
  - **Kayıt:** kayıtta metin yok; bozuk `sinyaller` yakalanır; sürüm 10'da açık kalmış gözlem sinyalsiz kapanır.
- Yeni **`akis-deneme` §23 “Balkon sinyalleri”** (yürüyüşsüz, gerçek zaman beklemesiz):
  1. `oda_ac ?dunya=7`.
  2. `oyunKomut` ile düşük kondisyonlu bir `hal` yazılır ve Salı 15:00'e geçilir.
  3. `gozlemAc(120)` ve `gozlemAdim(45)`.
  4. `oda_yenile`: oda balkonda açılır.
  5. Şeritteki metin sayfa içinde hesaplanan `antrenmanSinyalleri` ile aynı.
  6. `gozlemBirak`; geçmiş kaydında `sinyaller` var.

  Digit5, `gozlem` düğmesi ve “Gözleme devam et” kullanılmaz.

**S-c**
- Yeni **3.11:**
  - **Satır:** anahtar kümesi tam liste (gizli değerler yok); 22 satır, mevki ve numara sırasıyla.
  - **Sayaçlar:**
    - devralınan M/Dk gol ve sarıyla tutarlı;
    - yapay haftadan sonra başlayan +1/+90, giren +1/+30, kırmızı 1;
    - Nail sakat ve Yusuf cezalı Durum sütununda;
    - sözleşmesiz oyuncuda bitiş ve maaş null;
    - göçmüş s10'da `mac`/`dk` null.
  - **Notlar:**
    - yeniden eskiye sıralı; kaynaklar antrenman, maç ve hoca;
    - `disarida` notu var;
    - transfer olan oyuncunun eski maç notları eski takımıyla kalır;
    - antrenman ve hoca notlarında `/\d/` yok.
  - **Saflık:** okumak kariyeri değiştirmez; görev dışında `[]`.
- Yeni **`akis-deneme` §22 “Kadro sekmesi”:**
  - Digit3 → Kadro; 22 satır.
  - `TASMA_JS` 0: normal ve büyük yazıda, 800 px'te.
  - Ada dokununca oyuncu dosyası açılır; Esc önce listeye, sonra kapatır; `[` ve `]` gezinir.
  - Duraklat'ta açılır.
  - TEST kutusu yalnız Test bilgileri açıkken görünür.
  - s10 kaydı yüklenince M/Dk “—”.
- **Korunanlar:** §21'in dar sekme denetimi `.dsy-kadroSekme`'yi de kapsar; §1'in “Raporlar ile açar” satırı ve §3 aynen geçer.
- **Görüntü:** `kontrol.py` ve `prototipler/7-dosya-defter.html` (hata listesi `main` ile aynı).

**S-d**
- Yeni **3.8c:**
  - **Tablolar:**
    - `canliTablo` ile Odaya dön'den sonraki `sezonTablosu` birebir aynı;
    - `sezonTablosu(k, maç anı)` maçtan önceki tabloya eşit;
    - `ligBolgesi` bültenle aynı.
  - **`golSiralamasi`:** elle sayımla aynı; `sonAn` ile o hafta düşülür; transferden sonra o anki kulüp.
  - **`kulupOzeti`:**
    - sıra, puan, A ve Y tabloyla; son beş `sonBesMac` ile aynı;
    - hoca ve tarz doğru (P12 kopyasında yeni hoca);
    - stat kapasitesi `kulupKapasitesi` ile eşit (Demirkapı İlçe Stadı, 3823);
    - bilgi, ısrar ve `oz` yok.
  - **Fikstür:** `haftaFiksturu(k,13)` 8 maç.
  - **Korunanlar:** 3.8, 3.8b ve 3.9 aynen.
- Yeni **`akis-deneme` §24:**
  - Canlı Skor'da varsayılan sekme Maçlar; §1'in denetimleri aynen.
  - Puan durumu 16 satır.
  - Kulüp ekranı: Esc → Canlı Skor → ana ekran.
  - Fikstür ‹ › ile gezilir.
  - `TEL_TASMA_JS` ≤ 1.
  - Duraklat'ta açık.
  - Kariyersiz maçta yalnız tablo.
- **§20'ye ek:** maç bitince maç telefonundaki canlı tablo odadaki tabloyla birebir aynı.
- **Tarayıcı:** 16 (bilinen iki satır dışında), 19 ve 20.

**S-e**
- Yeni **5.2:**
  - **Sayının saati:** 07:59'da son sayı dünün, 08:00'de bugünün.
  - **Takvim:**
    - açılış sayısı ince ve “yeni”;
    - 29 Kasım kalın: manşet bizim maç, öbür sonuçlar, tablo, golcüler;
    - 30 Kasım ince;
    - 1 Aralık boş;
    - 2–4 Aralık yaklaşan maç;
    - 5 Aralık manşeti “Bugün …”.
  - **İçerik paketleri:** P12 hoca değişimi ve transfer ertesi sabahki sayıda.
  - **Belirlenimcilik ve arşiv:** belirlenimci; üç hafta, bir transfer ve bir hoca değişimi sonra 29 Kasım sayısı birebir aynı.
  - **Kayıt ve okuma:**
    - okumak zamanı ve geçmişi değiştirmez;
    - kayıtta yalnız `gazeteOkunan` değişir;
    - yalnız son sayı “yeni”;
    - eski kayıttaki haber kayıtları gazetede çift çıkmaz.
  - **Bozuk kopya:** gelecek tarihli `gazeteOkunan` yakalanır.
- **Beklenen kırılmalar:** 4.2 (1054) ve 3.7a (1194). 4.1c (885, 899–901) ve 2.2 (1319) aynen geçer.
- Yeni **`akis-deneme` §25:**
  - Açılışta gazete masada ve “yeni”; Digit4 açar, rozet söner.
  - s10 kaydı yüklenir, 29 Kasım 08:00'e geçilir; manşet 13. haftanın bizim maçı.
  - Önceki sayıya gezinti.
  - Sayfadaki metin sayfa içinde hesaplanan `gazeteSayisi` ile aynı.
  - Taşma ≤ 1.
- **Ayrıca:** bütünlük denetimi t7 ve t3 ile; `kontrol.py`.

**Tur kapanışı (S-f)**
- **Belgeler:** `git diff --check` temiz; yerel bağlantılar çalışıyor; belgeler arası tutarlılık.
- **Motor:** `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni --seyrek` → 40/40. Sağlık aralığı dışı satır 0; kabul dışı satırlar yalnız bilinen borçlar.
- **Hızlı denetimler:** `kariyer-deneme`, `ad-denetimi`, `mac-deneme 4`; motor farkı boş.
- **sezon-deneme:**
  - anahtar kapalı 18 hafta, t7 ve t3'e karşı `--ayni`;
  - anahtar açık yeni tabanlar: `sezon-s-t7.json` ve `sezon-s-t3.json` (t3 belirlenimci).
- **akis-deneme**, bölüm bölüm:
  - Geçmesi gerekenler: 1, 2, 3, 17, 18, 19, 19b, 20, 21, 22, 23, 24, 25.
  - Bu dizüstünün bilinen düşüşleri: 11, 12, 14, 14b, 15, 15b ve 16'nın iki satırı.
  - Tamamı masaüstü borcudur.
- **Görüntü:** `kontrol.py`; `akis-2d.py` bir kez.
- **İnceleme:** iki incelemenin bulguları kapandı ya da borç listesinde.
- **Hız:** hız bütçesi ölçülmez; “Odaya dön” süresi bilgi olarak yazılır.

## Riskler

- **Rotasyon görünmeyebilir ya da aşırı olabilir.** Ölçüsü `sezon-deneme`'nin oyuncunun haftası satırıdır. Seçilen oyuncu ile en iyi dışarıdaki arasındaki değer farkı medyan 7,8; kon 70'te yorgunluk bedeli 7,5.
- **Israrın geri beslemesi.** Dinlendirilen oyuncu ısrar payını kaybedebilir. Kilit “art arda dışarıda” sayacıyla ölçülür; görülürse iki maçlık ısrar devreye girer.
- **Dayanıklılık çarpanının ikinci etkisi.** Çarpan maç içi yorgunluğu, sakatlık yatkınlığını ve değişiklik seçimini de etkiler. Etki en çok %5'tir. Sakatlık artarsa kondisyon çarpanı yalnız hıza iner.
- **Dakika eşlemesi** yalnız adla yapılır; transfer aynı adı getirebilir. Uzatma bilinmediği için 90 tavanı vardır.
- **Gelişim maaşa ve transfere sızar.** Bu istenen etkidir; para satırı izlenir. P12'nin açılışı değişebilir.
- **Komut maliyeti.** “Odaya dön” ~10–12 ms ağırlaşır.
- **Sezon sonu.** Sezon bittikten sonra form ve gelişim durur.
- **Hafta ortası hoca değişimi.** Geçmiş günler yeni hocanın tarzıyla okunur (TEST).
- **Sinyal ödül havası taşıyabilir.** Metinler kısa ve belirsiz tutulur.
- **Görsel tutarsızlık** (kabul edilen borç): balkonun 3B sahnesi tohum kadrosunu çizer.
- **Taşma.** Sekme şeridi ve tablolar taşabilir; §21, §22 ve §24 ölçer.
- **Akış seçicileri** gizli sekme yüzünden kırılabilir; yalnız etkin sekme çizilir.
- **Canlı tablo tutarlılığı.** Kural “skor gösteren her satır sayılır”; §20 kilitler.
- **Arşivin kararlılığı.** Sayı canlı durumdan kurulursa eski sayı değişir; bu yüzden yalnız kalıcı kayıtlar kullanılır. H3'te sezon arşivi gerekir.
- **Her sabah “yeni” ışığı** gürültü olabilir.
- **Haber kayıtlarının kalkması** iki denetimi ve “Konu” bağlantısını etkiler.
- **Belge çelişkisi.** Karar 51 ve 52 ile OYUN_TASARIMI, STIL_REHBERI ve y-program'daki gazete satırları S-f'de düzeltilir.
- **Dizüstü süresi ve uyku.** Uzun koşular arka planda yürür.
- **Kayıt sürümü 11 geri dönüşsüzdür.**
- **Kesilme.** Her alt adım ayrı commit'tir; dal push'ludur.

## Claude kararları (belgeye görünür yazılır)

1. **Saklama yeri:** oyuncu kaydının kendisi. `hal` ile `mac`/`dk` buraya girer. Yeni üst düzey alan yalnız `gazeteOkunan`; yeni iş türü yok.
2. **Kondisyon saf türetilir.** Yazım tek yerde yapılır: `MAC_KAYDI_EKLERI`.
3. **Kondisyon tek değerdir.** Ağırlığı yaştan ve dayanıklılıktan gelir (`dusus90:26`). Kalecide düşüş ×0,35. Sakatken toparlanma yok; yeni sakatlıkta en çok 15 eksik.
4. **Form AR(1) yürüyüşüdür;** maç olayından beslenmez (moral yok kararı).
5. **Motora giriş yalnız `macKaydi` kopyasındadır;** `kayit.form` kapısı açılmaz.
6. **Hoca** kayıtlı formu ve yorgunluk bedelini tartar.
7. **Israr değişmez;** iki maçlık ısrar yalnız koşullu yedektir.
8. **Gelişim:** yaş, yük, oynama, u² tavan, rol ve tarz ağırlığı.
9. **Antrenman programı S-a'dadır;** üç tür ve maç ile dinlenme. Taktik günü yok.
10. **Dakikalar** uygulama anında hesaplanır; 90 tavanı.
11. **Sayaçlar:** yeni kariyerde devralınan haftalar TEST üretimi; eski kayıtta “—”. Kırmızı kart türetilir.
12. **Rastlantı** yalnız tohumlu akışlardan.
13. **TEST anahtarı** ve `SEZON_DENEME_AYAR`.
14. **Balkon sinyalleri dört türdür;** liste dondurulur.
15. **Hocanın sözü:** `yorgun` ve `formda` listeleri.
16. **Kadro sekmesi** Dosya'da; satır mevki ve numara sırasıyla; notlar türetilir.
17. **Canlı Skor'da lig** hem odada hem maçta; maçta tablo canlıdır.
18. **Günlük gazete** kalıcı kayıtlardan kurulur; haber kayıtları yazılmaz; hafta ritmi; arşiv bu sezon.
19. **Kanal aciliyet sırası** belgeye yazılır.
20. **Kayıt sürümü 11,** tek geçiş.
21. **Tabanlar:** t7 ve t3; kapanışta `sezon-s`.
22. **Dosyalar ve sıra:** üç yeni dosya; denetim numaraları.
23. **Hız bütçesi** ölçülmez.
24. **`main`'e alma** kullanıcının sözüyle.

## Yapılmayacaklar

- TV, kapı ve ziyaretçi (Y2); sinyalden açılan kart (Y3).
- Antrenmanda sakatlık; gözlemci; rakip kadronun ayrıntısı.
- Moral.
- Motor değişikliği; 80 ve 160 maçlık denge koşuları.
- Yeni görsel dil.
- Antrenman saatlerinin değişmesi.
- Kondisyonun uygunluğa girmesi; gizli değerlerin TEST dışında görünmesi.
- Bültende “dinlendirildi” satırı.
- Yaz arası ve sezon geçişi (H3).
- AI transfer.
- Yeni içerik metni.
- Gazetenin kayda yazılması; kayıt sıkıştırma.
- Eski kayıtta sayaç üretilmesi.
- Çoklu `--kayit-yaz` (H3-0).
- Ses.

## Kullanıcıya sorular (bloklamayan)

1. Gazetenin adı ne olsun?
2. Haber olmayan günde de “yeni” işareti yansın mı?
3. Form gol ve sonuçla beslensin mi?
4. Rotasyon ve gelişim hızı uygun mu?
5. Parlayan genç sinyali gizli tavanı ne kadar sezdirsin?
6. Eski kayıtta M ve Dk “—” mi kalsın?
7. Kulüp ekranındaki “Goller”de atılan–yenilen ve golcülerin ikisi de olsun mu?
8. Bültende “dinlendirildi” satırı ister misin?
9. `main`'e alma ne zaman yapılsın?
10. TEST metinlerini sen değiştireceksin.

## Sapmalar

### S-0

- **Uygulandı (oto mod 5, dizüstü, Opus 5.5).** Üç sürüm 10 sigorta örneği (459ebfe; üç ayrı koşu, H2-0 tarifi); plan dosyası (5fc1dc1; altı okuyucunun haritası, üç tasarım, yargıç); `sezon-deneme` parmak izi, `ozet`, `ayar`, `--karsilastir [--ayni]` ve `SEZON_DENEME_AYAR` (0e8eb36); iki taban `araclar/taban/sezon-h2-t7.json` ve `sezon-h2-t3.json` H2 oyun koduyla.
- **Denetimler:** örnekler — hafta14 2026-11-28 21:00, ocak 2027-01-09 21:00 açık `teklifKarari` (son cevap 10 Ocak 18:00), sezonsonu `sezon.sonuc` var ve İlerle engeli “Sezon tamamlandı”; tabanlar 18 satır, her satırda `iz`, `hatalar` boş, raporlar 16 haftalık · 4 aylık (H2 kapanışıyla aynı); t7'de satış, hocanın isteği ve imza, P12 değişimi (2027-01-10 Şükrü Hoca → Suat Hoca); t3'te her hafta kaydet–yükle. Öz denetim (S-0 ağacında): 2 hafta t7'ye `--ayni` çıkış 0; bozuk `iz` çıkış 1 (“! fark: hafta 14 iz”); `SEZON_DENEME_AYAR='{"YOK_BOYLE":{}}'` çıkış 2. Oyun kodu değişmedi.
- **Sapma:** tabanlar birlikte (paralel) üretildi; t7 ve t3 birer koşu ~52 dk sürdü (dizüstü, yük altında).

### S-a

- **Uygulandı:** `js/oyuncu-hafta.js` (antrenman programı ve yükü, kondisyon, form, gelişim ve tavan, maç girdisi çarpanı, maç dakikaları; `MAC_KAYDI_EKLERI` kancası `js/mac-sonuc.js`'te); hocanın seçimi kondisyonu ve formu tartar (`js/hoca.js`); `mac`/`dk` sayaçları ve devralınan haftaların TEST üretimi (`js/kariyer-kadro.js`); geçmiş maç kaydında `disarida`; hocanın ve yardımcının “Takım ne durumda?” cevabında yorgun ve formda listeleri (rakamsız); TEST panelinde Kon ve Frm; kayıt sürümü 11 (10 → 11 düz geçiş).
- **Denetimler:** `kariyer-deneme` geçti (yeni 1.4d, 3.10 (a)–(m), 3.3b; beklenen kırılmalar 1.4, 2.8L, 1.4b, 1.4c güncellendi; 3.3 ve 3.4 aynen); `ad-denetimi` temiz (89 betik); motor dosyaları `main` ile aynı; `mac-deneme 4` “sonuç aynı”; `oturum-sonu g1.json --ayni --mac 24` 24/24, kabul dışı yalnız bilinen borçlar. Bütünlük: anahtar kapalıyken `6 7 … --karsilastir sezon-h2-t7.json --ayni` ve `6 3 --tek --kaydet --karsilastir sezon-h2-t3.json --ayni` çıkış 0 (6 ortak hafta birebir); anahtar açık `6 3 --kaydet` belirlenimci. `akis-deneme` 1, 2, 3, 19, 21 geçti; `kontrol.py` hatasız. “Odaya dön” bilgi: işçisiz dosya adresinde 14,0 sn (doğal bitiş); “öbür maçlar tamamlanıyor” beklemeli yolda 136,9 sn (H2'deki gibi bu makinenin işçisiz yolu).
- **İlk ölçüm (6 hafta, tohum 3; bilgi):** maç anı ilk 11 kondisyonu ort 96,9, en düşük 65; dinlenen kulüp-maç başına 0,47 (anahtar kapalıyken eski ısrar kuralıyla 0,39); art arda dışarıda en çok 2; gelişim farkı ≤21 +0,22, 22–29 +0,06, 30+ −0,11; form sd 15,5; sakatlık 162 (kapalı 190); hükmen 0. 18 haftalık kalibrasyon arka planda koşar; bant dışı çıkarsa ayrı küçük commit.
- **Sapma:** kulübe kilidi görülmedi (dinlenen düzenli oyuncu en çok 2 maç art arda dışarıda), “0,5 yer payı” eklenmedi. 3.10 (c)'nin tarz satırı dikey 71 · dengeli 74 (dikey daha az toparlar).

### S-b

- **Uygulandı:** `js/gozlem.js` sinyal defteri (`GOZLEM_SINYALLERI`, günde en çok 3, 7 gün tekrar yok, dakika tarihten tohumlu), açılışta dondurulan `k.gozlem.sinyaller`, kapanışta gözlem kaydına `sinyaller`, `gozlemKaydiMetni`, `gozlemNotlari`, doğrulama; çekirdek türler (dönüş, yorgun, parlayan, form düşük) ve TEST metinleri `js/oyuncu-hafta.js`'te; balkon şeridinde günün türü (TEST), “Gördüklerin”, TEST adayları, izlerken görülen sinyal şeritte.
- **Denetimler:** `kariyer-deneme` geçti (yeni 2.7b; 2.7 ve 2.8L aynen); `ad-denetimi` temiz; `mac-deneme 4` “sonuç aynı”; motor dosyaları aynı → `oturum-sonu g1.json --ayni --mac 24` 24/24 birebir, kabul dışı yalnız bilinen borçlar (`c-1v1` eğim 14,0; `d-sut` iki satır; `c-orta` “erken · 3–3”); `akis-deneme` 23, 1, 3 geçti.
- **Sapmalar:** planın “örnek kariyerde hafta içi hafif” satırı tutmadı — örnek kariyerin iki maçlık fikstürü var (24 Kasım yoğun); denetim fikstürsüz kopyayla yapıldı. “Günde en çok üç” satırının beklentisi düzeltildi: en yorgun iki oyuncu kondisyonu en düşük olanlardır (55 ve 56). Şeritteki gün türü değişkeni `gunTuru` (odadaki `gunAdi` işlevini gölgelemesin).

### S-c

- **Uygulandı:** `js/kadro-dosyasi.js` (`kadroVar`, `kadroSatirlari`, `oyuncuDosyasi`, `oyuncuNotlari`, `OYUNCU_NOT_KAYNAKLARI`: antrenman, maç, hoca; TEST metinleri `not.*`); dosyada Raporlar'ın solunda “Kadro” sekmesi, tek geniş sayfada liste, ada dokununca iki sayfalı oyuncu dosyası; konu ve rapor yokken dosya Kadro ile açılır (masada dosya hep var); Esc önce listeye, `[`/`]` oyuncular arasında; sayfaların okuma yeri görünüm anahtarıyla korunur (konu ↔ rapor kayması da kalktı).
- **Denetimler:** `kariyer-deneme` geçti (yeni 3.11); `ad-denetimi` temiz (90 betik); `mac-deneme 4` “sonuç aynı”; `oturum-sonu g1.json --ayni --mac 24` 24/24 birebir, kabul dışı yalnız bilinen borçlar; `akis-deneme` 22, 1, 3, 21 geçti (§3 ve §21'in sekme seçicileri Kadro sekmesini konu sekmesi saymaz, dar şerit denetimi Kadro'yu da kapsar); `kontrol.py` hatasız; `prototipler/7-dosya-defter.html` tek hata (`hocalariKur is not defined`) `main`'de de aynı.
- **Sapmalar:** listede sözleşme bitişi yalnız yıl (hepsi 31 Mayıs; tam tarih oyuncu dosyasında), dönüş günü kısa ayla — ilk ekran görüntüsünde “May 20…” ve “7 Ara…” kesiliyordu. Test bilgileri geliştirmede varsayılan açık olduğundan §22 önce açıkken künyede TEST kutusunu, kapatınca yokluğunu denetler. `kadroVar` görev durumuna da bakar (`gorevDurumu==='gorevde'`).

### S-d

- **Uygulandı:** `js/fikstur.js` saf okumalar (`sezonTablosu(k, sonAn)`, `canliTablo`, `haftaFiksturu`, `ligBolgesi`, `golSiralamasi`, `kulupOzeti`; ortak `tabloMacIsle`), `js/kulup-mali.js` `kulupStatTarifi`, `js/transfer.js` `oyuncuKulubuTarihte`; telefonda Canlı Skor'un üç sekmesi (Maçlar eski içerik · Puan durumu · Fikstür), takıma dokununca kulüp ekranı (Esc → Canlı Skor → ana ekran), maç telefonunda canlı tablo (kariyersiz adreste yalnız tablo, dokunulmaz); odaya düğme ve kayda alan eklenmedi.
- **Denetimler:** `kariyer-deneme` geçti (yeni 3.8c; 3.8, 3.8b, 3.9 aynen); `ad-denetimi` temiz; `oturum-sonu g1.json --ayni --mac 24` 24/24 birebir (S-e kopyasında, S-d'yi de içerir), kabul dışı yalnız bilinen borçlar; `akis-deneme` 24 ve 19 geçti; 20 sessiz makinede geçti (maç bitince telefondaki canlı tablo odadaki tabloyla birebir); 16'da yalnız bu dizüstünün bilinen iki zamanlama satırı düştü.
- **Sapmalar:** ilk ekran görüntüsünde “Puan durumu” sekmesi kesiliyordu; sekme yazısı küçüldü ve §24'e “sekme yazıları kesilmez” denetimi eklendi. §20'de kart ve “Maçı bitir” perdesi açıkken maç telefonu açılmadığından denetim iki kilidi bir anlığına kaldırıp tabloyu okur. Kulüp ekranında devralınan son maçı olmayan TEST kulüplerinin “Son 5”i boş (“—”; uydurulmaz).

### S-e

- **Uygulandı:** `js/gazete.js` (sayı penceresi [dün 08:00, bugün 08:00), `haberAkisi`, `gazeteSayisi`, `gazeteOkundu`, `gazeteDogrula`, çekirdek kaynaklar ve TEST metinleri `gz.*`); `js/soz.js` `GAZETE_KAYNAKLARI`, `odaIzleri`'nde `sayi` ve `gazeteYeni`; P12 hoca değişimi (`js/icerik-p12.js`) ve transfer (`js/transfer.js`) haber kaydı açmaz, geçmişten kurulan kaynaktır; odada gazete her sabah masada, panelde künye, manşet, haberler, kutular, sayılar arası gezinti ve `[`/`]`; İlerle özeti yalnız sayı değişince “Masada yeni gazete var” der.
- **Denetimler:** `kariyer-deneme` geçti (yeni 5.2; 4.2 ve 3.7a'nın haber satırı gazetenin kaynağına bakar; 4.1c ve 2.2 aynen); `ad-denetimi` temiz (91 betik); `mac-deneme 4` “sonuç aynı”; `oturum-sonu g1.json --ayni --mac 24` 24/24 birebir, kabul dışı yalnız bilinen borçlar; `akis-deneme` 25, 1, 3 geçti; `kontrol.py` hatasız (masada gazete “yeni”).
- **Sapmalar:** tarayıcı denemesi bir arşiv hatası yakaladı — maç günü sayısı (“Bugün …”) maç oynandıktan sonra geriye bakınca boş çıkıyordu, çünkü yaklaşan maç kaynağı “oynanmamış” maça bakıyordu; kaynak artık sayının anından sonra başlayan ilk maçı alır ve 5.2 ile §25 bunu denetler. Masadaki notlar listesi gazete kayıtlarını tekrar göstermez (sayının içindedirler).

### S-a kalibrasyonu

- **Ölçüm (18 hafta, tohum 7 ve 3, anahtar açık):** tohum 7'de iki ölçü bant dışıydı — maç anı ilk 11'in en düşük kondisyonu 33 (bant ≥ 50) ve dinlendirilen düzenli oyuncunun art arda dışarıda kalması 6 maç (bant ≤ 4); tohum 3'te hepsi bantta. Sakatlık tabana göre −%18 / −%13, hükmen 0.
- **Tarama (soru başına iki değer, iki tohum; `SEZON_DENEME_AYAR` ile `OYUNCU_HAFTA_TEST.toparlanma`):** ×1,25 → en düşük kondisyon 56 / 70, art arda en çok 4 / 4, dinlenen kulüp-maç başına 0,45 / 0,53, gelişim ≤21 +0,70 / +0,71 ve 30+ −0,53 / −0,52, form sd 15,3 / 15,7, sakatlık −%9 / +%19, hükmen 0; ×1,5 → bantta ama ortalama kondisyon ~99,5 (kondisyon neredeyse etkisiz). **Karar (Claude, TEST):** günlük toparlanma değerleri ×1,25 (`{mac 3,75, dinlenme 7,5, toparlanma 5,75, hafif 5,25, yoğun 7,5}`).
- **Testler:** iki beklenti değerden bağımsız yazıldı — 2.7b'nin “günde en çok üç” satırı en yorgun ikiyi o günkü kondisyondan bulur; 3.11'in hoca notu için kopyadaki kondisyon 60 yerine 50. `kariyer-deneme` geçti.

### İnceleme (S-f)

İki bağımsız inceleme (kural, veri ve kayıt; ekran, akış ve erişilebilirlik) 10 bulgu getirdi; her birini ayrı bir doğrulayıcı çürütmeye çalıştı, 10'u da gerçek bulundu (2 orta, 8 düşük; hiçbiri kaydı ya da maç sonucunu bozmuyor). Hepsi düzeltildi, dokuzuna denetim eklendi:
1. **(orta)** Yardımcının “Takım ne durumda?” cevabı oyuncu dosyasına onun söylemediği “İyi günlerinde.” ve hocanın cümlesini düşürüyordu → not kaynağı kişinin rolüne bakar; yardımcı yalnız sakat, cezalı ve yorgun listesinden, kendi sözüyle (“Koşu verilerinde düşüş.”) not bırakır (3.11).
2. Sakat oyuncu hocanın “formda” listesine girebiliyordu → yorgun listesindeki sakatlık süzgeci formda listesinde de (3.11).
3. Önce alınıp sonra satılan oyuncunun gazetedeki satış haberi alım dosyasını açıyordu → dosya transferin yönüne ve anına göre bulunur (3.11).
4. **(orta)** Fikstürde › ile ilerleyince odak ‹ okuna atlıyordu → odak aynı yöndeki okta kalır, sezonun ucunda öbür oka geçer (§24).
5. Büyük yazıda balkon şeridi “Gördüklerin” listesiyle uzayıp masadaki düğmelerin altına giriyordu → listede yalnız son görülen sinyal ve kaç not düştüğü (§23: 1180 ve 800 px'te kesişme yok).
6. Oyuncu dosyasından listeye dönünce liste başa sarıyordu → okuma yeri geri gelir, odaktaki satır görünür (§22).
7. Kulüp ekranından Puan durumuna dönünce tablo başa sarıyordu (oda ve maç telefonu) → okuma yeri geri gelir (§24, büyük yazıda 84 → 84).
8. Gazetede sayı değişince odak kayboluyordu → odak gezinti düğmesinde kalır, uçta öbür düğmeye geçer (§25).
9. Maç telefonunun kulüp ekranında canlı ve maç öncesi veriler karışıktı → golcüler “(önceki haftalar)”, goller “(canlı)”, “Sıradaki” yerine “Bugün” (§24, saf çizimle).
10. İzlerken görülen balkon sinyali ekran okuyucuya duyurulmuyordu → `metinDuyur` (H2-e kalıbı; denetimsiz — gerçek zamanlı izleme bu dizüstünde kararlı denenemiyor).

## Tasarım panelinin puanları

Ölçütler 1–10. Risk sütununda yüksek puan düşük risk demektir.

| Tasarım (açı) | Sadakat | Doğruluk | Risk | Denetlenebilirlik | Oyuna katkı | Toplam | Not |
|---|---|---|---|---|---|---|---|
| 1 — en az risk, en küçük kod | 7 | 8 | 9 | 9 | 7 | 40 | Kondisyon tarifinin iskeleti, koşullu ısrar, saf form ve `odaIzleri` uyumu alındı. Gazete haber kayıtlarını tutuyor, maç telefonunu kapsam dışı bırakıyor. Rotasyon ölçümü kontrolde daha düşük çıktı. |
| 2 — futbol gerçekliği | 6 | 7 | 5 | 8 | 9 | 35 | Yaşa bağlı yorgunluk, sakatlık eksiği, tarzla gelişim ve gazetenin hafta ritmi alındı. Formun maç olaylarıyla beslenmesi, taktik günü ve iki parçalı kondisyon alınmadı. |
| 3 — denetlenebilirlik, kayıt, hız | 8 | 9 | 7 | 9 | 8 | 41 | Temel. Gazetenin geçmişten kurulması, parmak izi, `MAC_KAYDI_EKLERI`, `disarida`, devralınan sayaçlar ve canlı tablo alındı. Ölçümleri kontrolde birebir tuttu. |
