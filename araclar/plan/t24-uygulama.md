<!-- T24 uygulama planı: Claude'un salt okuma kod haritalarının sentezi (2026-10-18 gece, masaüstü). Onaylı tur planı gerçekçilik planındadır; burası uygulayıcının çalışma notudur. Satır numaraları yazıldığı andaki koda göredir; scratchpad yolları (C:/Users/herna/AppData/...) yerel ve geçicidir. -->

# T24 uygulama planı: dört raporun birleşimi

Hiçbir dosyaya yazılmadı. Satır numaralarının bir kısmını kodda tek tek kontrol ettim: `mac-karar.js` :623, :649–662, :675–710, :733–752, :869–875; `mac-topla.js` :253–254, :291–298, :311–313, :434–466, :772, :785; `mac-hareket.js` :864–871; `mac-dizilis.js` :207, :229, :248–259; `mac-mudahale.js` :263–280; `mac-kaleci.js` :166–179, :212–233; `mac-durantop.js` :203–218; `d-penalti.js` :23/:41. Ölçüm değerleri `t23-80.txt` dosyasından ve raporlardan alındı.

## Çerçeve

- **Dal ve taban:** dal `claude/motor-t24`, `claude/motor-a9`'un ucundan açılır. Motor tabanı `araclar/taban/t23.json`.
- **Anahtarlar:** her yeni anahtar `js/mac-motoru.js`'teki satırında bildirilir:
  - C (mac-hareket) :68–76
  - C (mac-mudahale) :77–79
  - B :82–89
  - D :90–91
  - T :92–98
  - K :102–105

  Değeri sahibi dosyanın `ayarEkle`'si atar. **0 eski davranıştır**; 0'dayken `rast()` çekilmez. Bütün T24 anahtarları 0'dayken motor `t23.json`'a `--ayni` verir. Bu, her alt adımın sonunda ve kapanışta bir kez sınanır.
- **varlik:** yeni alan eklenmez. Yeni durum şu yerlerde tutulur:
  - eylem nesnesi (`e.kx`, `e.kz`, `e.kt`);
  - maç düzeyi harita (`this._gecKosu[t]`);
  - mevcut alanlar (`p.kosu`, `_ortaBlokT`);
  - işlevin döndürdüğü nesne (`yakalamaNoktasi`'nın `y`'si).
- **Test kademeleri:**
  - Her düzenlemeden sonra: 4 maç ve ilgili senaryo.
  - Alt adım sonunda: oturum sonu, yani 40 maç `--karsilastir t23.json`.
  - Tarama `MAC_DENEME_AYAR` ile yapılır, soru başına en çok iki değer.
  - 40 maç yalnız yön gösterir. **Denge kararı kapanışta 80 maçla** verilir.
- **Sıranın gerekçesi:**
  - Önce fiziksel blok gelir. Planlayıcı önce düzeltilirse şutçu bloktan kaçar ve blok / şut düşer (blok raporu, varsayım 5).
  - Blok artışı gerçekleşen ÷ konum xG'yi düşürür, çünkü konum xG bloksuzdur. Bu, plaseye pay açar.
  - Plasenin dengesi en sona, kutuya giriş değişikliğinden sonraya kalır. Kısa mesafeli şutlar plase payını ve ÷ xG'yi kendiliğinden değiştirir; ayar düğmesi son ölçülen tabana göre çevrilir.

---

## T24-0: Ölçüm ve tanım (sonuç değişmez)

**Yapılacaklar:**
1. **Penaltıda kaçırma tanımı:** `araclar/senaryolar/d-penalti.js` :23 ve :41'de direğe çarpıp oyunda kalan top (`direk` ve `'yok'`) kaçırmaya sayılır, ayrı sütunda yazılır.
   - Tohum 1'de kaçırma 3,3 → 5,4 bekleniyor (bant 4–8). Borç 8 motor değişmeden kapanır.
2. **Kafanın kurtarış tahmini:** `js/mac-topla.js` :770–772'de `pKurt` ve `nisanY`, topun bir kopyası `topFizikAdim` ile adımlanarak bulunur (sürükleme ve sekme dahil).
   - `rast()` çekilmez, `topYolu` önbelleği kullanılmaz. Sonucu değiştirmez; yalnız v-verim okur.
   - Modül düzeyinde ortak bir dizi kullanılırsa `ikiz-deneme.js` çalıştırılır.
   - Beklenen: kafada tahmin %53 → ~65–70; P<0,2 dilimindeki +16,8 puanlık fark kapanır. Bunlar varsayım.
3. **`araclar/olcumler/v-verim.js`:**
   - şut türü × mesafe tablosu: adet, çerçeve, kurtarış ve tahmini, blok, gol/şut, hız, planın P(gol)'ü;
   - türe göre kaleci kalibrasyonu;
   - dilimli blok kalibrasyonu (pB 0 / 0–0,1 / >0,1);
   - hamle eden savunmacı olan ve olmayan şutlarda blok (`_ortaBlokT` damgasıyla);
   - gelişine şut için ayrı satır.

   Ayrıca `v-vurus.js` :21'deki `V_STIL`'e falso eklenir.
4. **`a-akis.js` :74–77:** kabul için "Şut:" satırının penaltı ve serbest vuruş hariç sürümü (eski satır bilgi kalır). Ayrıca gelişine şutta hazırlıktan temasa stil değişimi satırı (borç 40).
5. **`s-sut.js`:** rol × mesafe ve rol × kaynak dilimleri. **`t-kanat.js`:** şut anında kutudaki forvet dışı arkadaşın kaynağı (geç giriş, kutu rolü, takip, diğer).
6. **`r-karne.js` :96–97:** "ortanca mesafe (penaltısız, kafa dahil)" satırı.
7. **Duran top dökümleri:**
   - `k-duran.js`: barajlı vuruşun maç içi mesafe dağılımı ve dilim başına gol/şut.
   - `d-duran.js`: bloktan sonra gol olan sapmalarda kalecinin dökümü — tepki yeniden kuruldu mu, t − (tBas + r), erişim payı, topun ve kalçanın yüksekliği, perde.
8. **Direk:** maç başına direğe çarpan şut ve direkten sonraki 4 saniyede ne olduğu (gol, kurtarış, uzaklaştırma, hücum şutu). `r-karne.js` :104'teki `wood` olayından okunur.

**Kapılar:** `--ayni` 40/40, `ad-denetimi.js`, `d-penalti 1600` (kaçırma ~5,4 beklenir), gerekiyorsa `ikiz-deneme.js`. Bu 40 maçlık rapor sonraki adımların "önce" değeridir.

**Tanım seçimleri.** Bunlar Claude'un motor kararıdır ve "Sonuç" bölümüne açıkça yazılır:
- **Şut türü kabulü:** a-akis'in penaltı ve serbest vuruş hariç satırından okunur. Gerekçe: o ikisinin kendi planlayıcıları var; b-olcum satırı maç başına ±12 oynuyor.
- **Ortanca mesafe:** kabul satırı FBref "Dist" tanımına taşınır (penaltısız, kafa dahil); eski satır bilgi kalır.
  - Gerekçe: 14–16 m hedefi bu tanımdan geliyor. 16,7 m'nin ~0,8 m'si yalnız tanım farkı. Bant değişmez.
- **Barajlı doğrudan şutta gol/şut:** kabul, d-duran'ın serbest vuruş hücrelerinden, maç içi mesafe dağılımıyla ağırlıklandırılarak alınır (iki tohum).
  - Maç içi satır bilgi kalır: 80 maçta ≈51 şut var, %95 aralığı kabaca %1–13.
- **Kornerde bloktan sonra 8 sn'de gol:** kabul d-duran'dan, iki tohum × 1600 kornerle (≈270 blok). 80 maçlık satır (n≈34) bilgi kalır.
- **Aşırtma bandı 2–5:** gerçek değer ~%1 (StatsBomb, hafızadan, doğrulanmadı). Eşik değişikliği 2'ye ulaştırmazsa ayarla zorlanmaz (§6); bandın 1–3'e çekilmesi Sonuç'ta gerekçesiyle yazılır.

---

## T24a: Fiziksel blok (C)

**a1. `ilkHamle`** (C, mac-hareket; 0 = eski; önerilen değer 1)
- **Nerede:**
  - `mac-topla.js` :311–313: `vurusIlerle`'de hesaplanan karşılama noktası `k` eyleme yazılır (`e.kx`, `e.kz`, `e.kt`).
  - `mac-hareket.js` :864–871 `sutHamleYap`: `sec.ilk` iken uzaklık, on/yan ve hat (e.kx, e.kz) → (sec.hx, MZ) üzerinden ölçülür.
- **Ne:** kalan süre olarak topun varış süresi + 0,24 sn (ilkSut geri salınımı) kullanılır. `mac-dizilis.js` :207'deki şut algılama aynı kalır.
- **Beklenen:** gelişine şutta blok ~2 katına çıkar, toplamda +1,5–3 puan. Gelişine gol −0,1 civarı düşer (varsayım).

**a2. `sutHamleUzak`** (C, mac-hareket; birim m; 0 = eski; tarama {8, 12})
- **Nerede:** `sutHamleYap` :864–871.
- **Ne:**
  - Topa uzaklığı `sutHamle` ile `sutHamleUzak` arasında olan savunmacı hamleye girebilir.
  - Koşul: yan ≤ blokErisim + maxSpd·0,6·(e.kalan + on/25) + 0,3.
  - Uygun olan, kendi derinliğinde (k = on) şut hattına kayar ve damgayı alır.
- **Sınır:** planlayıcı bu adımda değişmez; o T24c'nin işi.
- **Beklenen:** ceza sahası dışından blok %14,6 → ~25–30; toplam +3–4 puan. Uzak şutun değeri düşünce ortanca mesafe kısalabilir (borç 11'e yardım eder).

**Kabul (40 maç):**
- blok / şut 20,8 → ≥ 24;
- gelişine şutta blok artar;
- dışarıdan blok ≥ 22 (bilgi; gerçek 30–35);
- gol, şut ve ÷ xG bantta kalır;
- > 3 m/sn² ivmelenme en çok T23 + 0,1;
- görev tablosu (`MAC_DENEME_IVME=1 … 12`) ≤ 15 / oyuncu·dk.

"Blok: tahmin ↔ gerçekleşen" farkının büyümesi beklenir; T24c kapatır.

**Kapılar:**
- Standart küme: `v-sut`, `c-1v1`, `c-koru`, `c-temas`, `c-yariyariya`, `c-kayma`, `c-donen`, `d-duran`, `d-sut`.
- a2 için ek olarak `c-orta` (adamını bırakan savunmacı).

---

## T24b: Sekme ve sapan top (C; D koşullu)

Önce T24-0'daki d-duran dökümü okunur. Karar kuralı:
- Gol anında kalecinin tepkisi çoğunlukla hâlâ sürüyorsa → b2.
- Tepki bitmiş ama erişim payı < 0 ve top 1,9·boy üstündeyse → sıçrama gerekir. T24'te yapılmaz, borç defterine yazılır.
- Kaleci yetişiyor ama top hızlı ve yakınsa → b1.

Döküm karışık çıkarsa ilk deneme b1'dir. Gerekçe: iki rapor aynı kaynağı ölçtü (yatay hızın %75'i korunuyor, top %70 kaleye gidiyor, gol 0,8 sn sonra) ve b1 kaleci modelini ve çizimi değiştirmez.

**b1. `basSiyirma`** (C, mac-mudahale; 0 = eski ×0,92; tarama {0,25, 0,4})
- **Nerede:** `mac-mudahale.js` :272–276, `yansit`.
- **Ne:** ny > 0 iken yatay hız ayrıca ×(1 − basSiyirma·ny) olur.
- **Seçim:** blok raporunun ny'ye bağlı biçimi alındı, kutu raporunun sabit çarpanı (`basSurtunme`) değil. Omuzun hemen üstünde eski davranış korunur; T17a-2'nin amacı da bozulmaz (top durmaz, yalnız yavaşlar).
- **Beklenen:** bloktan sonra top hızı 7,3–7,7 → ~5–5,5 m/sn. Bloktan sonra gol %13–15 → 9–10. Korner başına gol havuzu 4,9 → ~4,6.

**b2. `kaleciSapmaTepki`** (D; birim sn; 0 = eski; tek değer 0,15; yalnız döküm gösterirse)
- **Nerede:** `mac-kaleci.js` :221 `kaleciTehdit` ve :334 `kaleciPoz`.
- **Ne:**
  - Kaleci tepkisini bitirmişken topun yolu başkasının dokunuşuyla değişirse yeni tepki 0,15·(1,25 − 0,5·kalecilik) sn olur.
  - Bu sırada eller eski planın noktasında kalır, göğse dönmez.
- **Sınır:** kilitli dalıştaki kaleci için hiçbir şey değişmez. T19b'nin gerekçesi ("gerçekte sapma kaleciyi yener") geç sapmada korunur.

**Kabul (d-duran, iki tohum × 1600):**
- bloktan sonra 8 sn'de gol ≤ 10 (hedef ≤ 8);
- korner başına gol %3–5 (borç 44);
- ilk kafadan gol gürültü içinde değişmez;
- T17 bilgi satırları okunur;
- 80 maçta bloktan veya sekmeden sonra gol 0,23 → ≤ 0,2 / maç (bilgi).

**Kapılar:** `d-duran`, `c-temas`, `c-yariyariya`, `c-kayma`, `c-donen`, `d-sut`, `c-hava`.

---

## T24c: Planlayıcının blok tahmini (B)

**c1. `blokTahmin`** (B; değer, hamle eden savunmacının katkı tavanıdır; 0 = eski 0,6; tarama {0,7, 0,8})
- **Nerede:** `mac-karar.js` :649–662, `t0` dalı.
- **Ne:**
  - kapsama yarıçapı sutHamle + maxSpd·0,6·τ (sutHamleYap'ın erişim formülü);
  - savunmacının yeri o.v·min(τ, 0,3) kadar ileri taşınır;
  - `sutHamleUzak` kümesi de sayılır; τ'ya topun uçuşu on/v eklenir.
- **Sınır:** `devamDegeri` (:244) ve `sutAdaylari` (:694) statik kalır. Gerekçe: hız, ve temas anında savunmacılar zaten hatta.

**c2. `ilkSutBlok`** (B; 0/1)
- **Nerede:** `mac-karar.js` :869–875 imzasına `kt` eklenir; `mac-topla.js` :785 `k.t`'yi geçirir.
- **Ne:** x2 ×= 1 − sutBlokOlasiligi(…, 'sert', …, kt + 0,24). `pBlok` seçeneğe yazılır.

**Kabul:**
- "Blok: kararın tahmini ↔ gerçekleşen" farkı ≤ 2 puan (bugün 9,2 ↔ 19,6);
- gelişine şutta fark ≤ 3 puan;
- blok / şut 24–32 kalır;
- şut ≥ 16,5 (40 maçta alt sınıra pay).

Şut 16,5'in altına inerse önce c1'in küçük değeri seçilir. Yetmezse mevcut `sutIkinci` (bugün 1,2) tek değerle {1,4} denenir.

**Kapılar:** standart küme, `d-sut`.

---

## T24d: Şut türü ve vuruş sözleşmesi (B, D; plase T24h'de)

**d1. `stilHazirlik`** (B; 0/1)
- **Nerede:**
  - `mac-topla.js` :291–298: gelişine şutta da `st = pl.stil`.
  - `mac-dizilis.js` :248–259: `yakalamaNoktasi` dönüşüne `y` eklenir.
  - :404 ve :460 hazırlıkta yazılan stili artık değiştirmez.
- **Ne:** vole ve yarım vole, topun temas anındaki tahmini yüksekliğinden hazırlıkta seçilir.
- **Seçim:** fizik de hazırlıkta yazılan stili kullanır; sözleşme ile fizik aynı olur.
  - Şut raporunun "temasta yalnız fizik için yeniden seç" önerisi alınmadı, çünkü çizimin gösterdiği stil ile fiziğin kullandığı ayrışırdı.
  - Bu yüzden anahtar açıkken `--ayni` değil `--karsilastir` kullanılır.
- **Kabul:**
  - hazırlık → temas stil değişimi 6/22 → 0;
  - vole sınıfı ile temastaki gerçek yükseklik uyumu ≥ %90 (bilgi);
  - "A: vuruş stili" ≥ %90 ve yarım vole örnekleri doğru (borç 40; animasyon-olcum, çizim değişmez);
  - `v-sut` [6].

**d2. `asirtmaOnde`** (B; [kalecinin öndeliği m, mesafe m]; 0 = eski [3,5, 9]; önerilen değer [2, 7])
- **Nerede:** `mac-karar.js` :678–679.
- **Gerekçe:** kaleci şutların %31'inde 2–3,5 m önde, yalnız %2'sinde ≥ 3,5 m önde.
- **Kabul:** aşırtma 0,8 → 2–3; `v-sut` [7].

**d3. Açık oyunda uzaktan düşen sert şut** (üç anahtar, tek adım)
- `sutDusen` (B; asgari mesafe m; 0 = yok; tarama {20, 24}): `mac-karar.js` :679'daki tür listesine eklenir; hedef yüksekliği :697'deki [1,9].
- `dusenTahmin` (D; 0/1): `kaleciTahmin` (`mac-kaleci.js` :166–179) düşen topta g′ = 1,3·G kullanır, `sutBlokOlasiligi` :659 gibi. Çağıranlar `mac-karar.js` :690 ve `mac-topla.js` :466.
- `kaleciDusen` (D; birim sn; 0 = eski; tek değer 0,06): yürütmede `kaleciTehdit` :221'e, tahminde ek gecikme olarak; `kaleciEgri` kalıbı.

**Seçimler:**
- Şut raporunun 5. adayı ile kutu raporunun 4c'si aynı modelin iki yüzü; tek adımda birleştirildi.
- `kaleciDusen` topun türüne bakar (`b.sut.tur === 'dusen'`), `b.ust` değerine değil. Alçak sert şutun üst dönüşü 0,05–0,10 olabiliyor (`mac-topla.js` :447), yani düşeninkinden (0,09) büyük.

**Beklenen:** 20 m ötesindeki sert şutların bir kısmı düşen şuta geçer; sert −3…−6 puan. ≥25 m'den gol 0/53 → %1–3. Serbest vuruşta 26–30 m'den gol 0 → %2–4.

**Kabul:**
- sert ≤ 55 (ara hedef);
- 20–25 m ÷ xG 0,67 → 0,8–1,1 (bilgi);
- `v-sut` [5];
- d-duran serbest vuruş hücreleri.

**Kapılar:** `v-sut` 800, `d-sut` 48, `d-duran`, `d-penalti`. Penaltı sonucu birebir aynı kalmalı; bu bir değişmezlik denetimidir.

---

## T24e: Kutuya giriş ve forvet dışı şut (T)

**e1. `gecGirisPas`** (T; en çok koşucu sayısı; 0 = eski; tarama {1, 2})
- **Nerede:** `mac-topla.js` :253–254'e ikinci bir tetik eklenir; `gecGirisAta` (`mac-takim.js` :284–292) yeni bir yer kümesiyle çağrılır.
- **Koşul:** pas forvete gidiyor, alıcı son 30 m'de ve |z − MZ| < 20.
- **Yer kümesi:** (PL−12, topun ters yarısında MZ∓4) ve (PL−15, MZ).
- **Ne:** rastlantısızdır; T14b'nin denenmiş kodunu kullanır.

**e2. `gecKosu`** (T; sıklık 1/sn; 0 = eski; tarama {0,3, 0,6})
- **Nerede:** yeni bir `Match` yöntemi `mac-takim.js`'e (ör. `gecKosuAta`); çağrısı `mac-topla.js` :814'ten önce, `derinKosu` içinde.
- **Koşul:** derin olmayan merkez orta saha; geride değil; top kaleye ≤ 38 m ve merkezde; oyuncu ofs−4'ün ve topun ≤ 6 m gerisinde.
- **Olasılık:** dt·gecKosu·(0,5 + topsuzHareket)·(1 + 0,5·cezaSahasinaGecGirer)·N.kosu.
- **Koşu:** `p.kosu = {tur:'gecKosu', u:PL−11,5, w:ters yarım alan, t:2,2}`. Takımda aynı anda en çok bir koşu (`this._gecKosu[t]`).
- **Yürütme ve kayıt:**
  - yürütme `mac-dizilis.js` :319–321'in kalıbıyla;
  - `derinKosu` :810'daki gibi atlanır;
  - `kosuSil` listesine eklenir (`mac-dizilis.js` :205);
  - t-kanat sayar.
- **Kural:** anahtar 0'dayken `rast()` çekilmez. Sıra: önce e1 (rastlantısız, ölçümü temiz), sonra e2.

**Kabul:**
- forvet dışı şut %24,4 → ≥ 30;
- ortanca mesafe (yeni tanımla) 14–16 m;
- gol, şut, ÷ xG ve ofsayt bantta;
- ivmelenme en çok T23 + 0,1;
- görev tablosu ≤ 15.

**Kapılar:** `c-kanat`, `c-orta`, `o-ofsayt`, `c-1v1`, `c-koru`, `MAC_DENEME_IVME=1 … 12`, `ad-denetimi.js`.

**Seçimler:**
- `kanatIce` T25'e bırakıldı. Kanadın yeri T25'in kanat değer modeli (xT ızgarası) ve kanat pas alıcısıyla (borç 10) birlikte okunmalı; T24'te yapılırsa T25'in tabanını kaydırır.
- Yapılmayanlar:
  - `takipYay` (ortanca mesafeyi artırır);
  - `zon14`'ü artırmak (orta sahayı kutu dışında tutar);
  - `sutIstekMesafe`'yi tek başına daraltmak (forvet payını artırır, şut alt sınıra iner).

---

## T24f: Barajlı serbest vuruş (K)

**f1. `barajKaleciYan`** (K; kalecinin uzak direğe ek kayması, m; 0 = eski, yani bugünkü 0,3 m; tarama {0,3, 0,6})
- **Nerede:** `mac-durantop.js` :217, `hz: MZ − yan·(0,3 + k)`.
- **Hedef:** 18 m merkezde gol/şut %27,5 → 15–20. Uzak hücreler T24d3'teki `kaleciDusen` ile yükselmiş olur.

**Kabul:**
- d-duran'ın maç dağılımıyla ağırlıklı gol/şut 6–10 (iki tohum);
- "18–22 m merkezde ≤ 15" bilgi satırı;
- 18 m'de doğrudan şut payı %60–90 kapısı;
- maç içi %3,9 satırı bilgi.

**Kapılar:** `d-duran` (serbest vuruş hücreleri 80'er, iki tohum), `d-sut`, `v-sut`.

---

## T24g: Keyifli şutlar (B)

**g1. `bosKale`** (B; 0/1)
- **Nerede:** `mac-karar.js` :623'teki hedeflere (0, ±1) eklenir; `sutAdaylari` :675–710.
- **Koşul:** kaleci şut hattının ≥ 2 m dışında ya da topun gerisinde. O zaman orta hedefler ve 0,4 güçle plase aday olur.
- **Sınır:** bu durum maçta 0/49 şutta oluştu, yani maç içi etki bilgi kalır.
- **Kapı:** v-sut'a yeni hücre [8] "kaleci geçildi": kaleci topun 2 m gerisinde, 12 m'den; plase ≥ %80 seçilir, gol ≥ %90.

**g2. `trivelaEsik` ve `burunKarambol`**
- `trivelaEsik` (B; 0 = eski 0,65; tek değer 0,55): `mac-karar.js` :678.
- `burunKarambol` (B; m; 0 = eski): `mac-topla.js` :274'teki burun koşuluna "L < 8 ve rakip ≤ 1 m" eklenir.
- Gerçek veri yok; pay küçük tutulur (dış ayak ≤ %5, burun ≤ %2; bilgi bandı, varsayım).
- **Kapılar:** `v-sut` [4] [6].

**g3. Direk ve dönen top:** T24-0 satırlarından okunur. Motor yalnız teşhis bir kusur gösterirse değişir (ilerleme kuralı). Gerçek değer ~0,5–0,7 direk / maç (hafızadan, doğrulanmadı).

---

## T24h: Denge — plase, isabet, kurtarıştan korner (B, D)

**h1. `sutPlase`** (B; [kz, hız payı]; 0 = eski 0,65 / 0,75)
- **Nerede:** `mac-karar.js` :684–685; yalnız açık oyundaki plase, serbest vuruş ve penaltı dışında. `VURUS_STIL.ic.hiz` (`mac-topla.js` :148) değişmez, paslar etkilenmez.
- **Tarama:**
  - Soru 1, isabet: kz {0,5, 0,55}, hız payı 0,75.
  - Soru 2, hız: seçilen kz ile hız payı {0,68, 0,72}.
- **Gerekçe:**
  - Hata çarpanı (`fg`) her stilin kendi azami hızından hesaplanıyor. Bu yüzden eşit top hızında yön hatası plasede 1,33, sertte 1,15; plase yalnız ~0,6·vMax'ın altında sertten iyi.
  - T22'de yalnız isabet artırılınca ÷ xG 1,35'e çıkmıştı. İsabet ile hız birlikte değişince yavaş plase kaleciye süre verir.
- **Seçilmeyen alternatif:** `fg`'yi g·hız üzerinden hesaplamak. Bütün türlerin kz değerleri (T9b, T22) yeniden ayarlanmalı; yedek yol olarak saklanır.

**h2. `sutSapma`** (mevcut anahtar, bugün 1,3)
- Yalnız ÷ xG > 1,20 çıkarsa {1,35, 1,4} denenir.
- Gerekçe: 11–16,5 m'de ÷ 1,43; v-sut'ta 16 m'den gol %16 ve 11 m'den %43 (gerçek ~10–12 ve 35–40).

**h3. Borç 12'ye karşı ağırlık:** kurtarıştan korner / şut 0,07'nin altına inerse mevcut `kaleciNiyetEsik[0]` 0,6 → 0,65 (tek değer).

**h4. `sutEgilim`** (B; 0 = eski; tek değer 0,15; isteğe bağlı)
- **Nerede:** `mac-karar.js` :671. Seçim puanı Pg·(1 + k·eğilim); eğilimler `plaseVurur` ve `kaleciyiAsirtir`.
- Toplamları değiştirmez, oyuncu kişiliğini görünür kılar. Kapılar `p-tip` ve duyarlılık karnesi.

**Kabul:**
- şut türü (a-akis, penaltı ve serbest vuruş hariç): sert ≤ 50, plase ≥ 25, aşırtma 2–5 (bant notuyla);
- ÷ konum xG 0,85–1,20;
- gol 2,2–3,3;
- 11–16,5 m ÷ xG ≤ 1,25 (bilgi);
- kurtarıştan korner / şut ≥ 0,07.

**Kapılar:**
- `v-sut` 800 ([2] ve [3] `sutSapma`'ya duyarlı);
- `d-sut` (iyi kalecide korner ≥ 40, kendi kalesine ≤ 5, üst köşe ≤ 25);
- `d-penalti` (değişmemeli).

---

## Tur kapanışı (CLAUDE.md listesi)

- **Maç denemesi:** 80 maç `--karsilastir araclar/taban/t23.json` ve robotluk karnesi. Yeni taban `t24.json`; `t22.json` çalışma ağacından kalkar.
- **Senaryolar:** bütün senaryolar, ayrıca:
  - `d-penalti` 4 × 1600 (gol 76–78, kurtarış 16–20, yeni tanımla kaçırma 4–8);
  - `d-duran` iki tohum × 1600;
  - `d-sut` 48 tekrar;
  - `v-sut` 800 deneme.
- **Diğer denetimler:**
  - `oyuncu-karnesi.js 80 1 --duyarlilik`;
  - `ikiz-deneme.js`;
  - `ad-denetimi.js`;
  - bütün T24 anahtarları 0'dayken `t23.json`'a `--ayni`.
- **Hız:** `tur/a9` ağacıyla (motoru T23'le aynı):
  - sıralı üç çift;
  - aynı süreçte 2 maç × 8 tur;
  - gol ve duruş sayısı değiştiği için `hiz-evre.js`.

  Sınır: ≤ +%10, 250 ms mutlak tavan.
- **Çizim:** çizim dosyaları değişmez. `animasyon-olcum` yalnız "A: vuruş stili" için (d1 sözleşmesi), A9'un animasyon tabanına karşı koşar. `kontrol.py` ve `akis-deneme` gerekmez.
- **Belgeler:**
  - "T24 — Sonuç";
  - borç defteri: 6, 7, 8, 11, 12, 34, 40, 44 güncellenir; yeni satırlar aşağıda;
  - TEKNIK_PLAN §8'deki taban;
  - YOL_HARITASI devam notu.

## Kabul özeti

| Satır | Hedef | T23 | Etkileyen adım |
|---|---|---|---|
| Blok / şut | 24–32 | 20,8 | a1, a2 (+), c1 (−1) |
| Blok tahmini ↔ gerçekleşen | ±2 | 9,2 ↔ 19,6 | c1, c2 |
| Forvet dışı şut | ≥ %30 | 24,4 | e1, e2 |
| Ortanca mesafe (yeni tanım) | 14–16 m | 16,7 (eski tanım; ~15,9 yeni) | a2, e1, e2 |
| Sert · plase · aşırtma | ≤ 50 · ≥ 25 · 2–5 | 62,5 · 21,1 · 0,8 | d2, d3, h1 |
| ÷ konum xG | 0,85–1,20 | 1,10 | a (−), h1/e (+), h2 |
| Gol · şut | 2,2–3,3 · 16–28 | 2,6 · 17,4 | hepsi |
| Barajlı doğrudan şut, gol / şut (ağırlıklı d-duran) | 6–10 | 7,1–9,7 (d-duran) · 3,9 (maç) | d3, f1 |
| Kurtarıştan korner / şut | ≥ 0,07 | 0,085 | h3 |
| Kornerde bloktan sonra gol (d-duran) | ≤ 10 | 12,9–14,8 | b1, b2 |
| Korner başına gol (d-duran) | 3–5 | 5,2 / 4,6 | b1 |
| Penaltıda kaçırma | 4–8 | 3,0 → 5,4 (tanım) | T24-0 |

## En büyük riskler

1. **÷ xG tavanı.** Bugün 1,10, tavan 1,20; payı yalnız 0,10.
   - Yükseltenler: plase (T22'de 1,35'e çıkmıştı), markajsız geç koşucu, düşen şut.
   - Karşı ağırlık: T24a–c'deki blok artışı tahminen −0,05…−0,10 pay açar (varsayım); h2 `sutSapma`.
2. **Şut alt sınıra yakın.** Bugün 17,4, alt sınır 16.
   - c1 ve a2 şutu azaltır (−0,5…−1); e1 ve e2 artırır (+1…+1,8).
   - 40 maçta ≥ 16,5 bekçisi var.
3. **Gol.** Tahmini etkiler (hepsi varsayım):
   - blok −0,15…−0,25;
   - planlayıcı −0,05;
   - kutuya giriş +0,1…+0,2;
   - düşen şut ve plase 0…+0,1.

   Net ~2,5–2,7 bekleniyor.
4. **Korner başına gol (borç 44).** Daha çok blok daha çok korner getirir; b1 bunu karşılar.
5. **d-sut kapıları:** üst köşe bugün %23,2 (kapı ≤ 25), iyi kalecide korner ≥ 40. Kaleci modeline yalnız b2 (koşullu), `dusenTahmin` ve `kaleciDusen` dokunur. Kaleci sıçraması ve kaleci sapması bu yüzden yapılmaz.
6. **Hız (borç 35).**
   - Yeni maliyetler küçük: 20 m ötesinde `sutAdaylari`'na bir tür eklenir, ama şut başına yalnız iki çağrı var.
   - Hamle döngüsü yalnız şut hazırlığında çalışır; `gecKosu` karede birkaç oyuncuya bakar.
   - Kodun payı `hiz-evre` ile ayrılır.
7. **İvmelenme (borç 1).** a2 ve e2 yeni tam eforlu koşular ekler; satır bozulmamalı.

## Geri dönüş yolu

- Her anahtarın 0'ı eski davranıştır; hepsi 0'dayken `t23.json`'a `--ayni` verir.
- Her alt adım ayrı yerel commit'tir. Bir değer kodu değiştirmeden `MAC_DENEME_AYAR` ile kapatılabilir.
- Kapanıştaki 80 maç bant dışı çıkarsa geri adımlar şu sırayla atılır; her geri adım bir kapanış koşusu (80 maç) daha ister:
  - **÷ xG > 1,20 ya da gol > 3,3:**
    1. `sutPlase` hız payı 0,75'e döner;
    2. `gecKosu` 0;
    3. `gecGirisPas` 1 ya da 0;
    4. `sutSapma` +0,05.
  - **÷ xG < 0,85, gol < 2,2 ya da şut < 16:**
    1. `blokTahmin` 0;
    2. `sutHamleUzak` küçük değere ya da 0'a;
    3. `ilkSutBlok` 0.
- Bant dışında kalan satır ayarla zorlanmaz (§6); borç defterine yazılır.

## Ertelenenler ve yapılmayanlar

- **`kafaCoz`** (kafa planlayıcısını sürüklemeyle çözmek): kafada gol artar, korner başına gol zaten sınırda. Borç defterine, T25 (orta ve kafa) ile.
- **`kaleciSicra`:** d-sut üst köşe kapısı sınırda ve kurtarış çizimi değişir. Borç defterine; ancak T24b dökümü açıkça gösterirse yeniden açılır.
- **`kaleciSapma`** (kalecinin erişim belirsizliği): d-sut sınırda, ve `penaltiPlani` de `KL_M.sapma`'yı okuyor. Borç defterine; h1 tutmazsa ikinci yol olarak.
- **Penaltıda T12a'nın dikey kuralı:** penaltı golü %72,6'ya düşüyor, bandın altı. Yapılmaz. Köşe kararlılığına da ölçüm düzeltmesinden sonra gerek kalmıyor.
- **`kanatIce`:** T25'e. **`takipYay`, `zon14`, `sutIstekMesafe`:** yapılmaz.
- **Yeni borç satırları:**
  - Kaleciyi çalımla geçme hamlesi (boş kale durumunu doğuracak olan; `c-1v1`).
  - Penaltı sıklığı: maç başına 0,74, gerçekte ~0,25–0,30. Şutların %4,1'i penaltı; maç başına ~0,5 gol buradan geliyor. Faul turu (T27). Gol bandı aşılırsa gerçekçi kaldıraç budur, ama T24'te dokunulmaz.
- **Yarılara göre ÷ xG** (1,27 / 0,93): T26'ya.

## Gerçek değerler (dayanak)

- **Vuruş hızı:** iç ayak ~21–23 m/sn, üst ayak 28–30 m/sn (Nunome 2002). Azami hıza çıkmak yön hatasını ~2 katına çıkarıyor (van den Tillaar ve Ulvik 2014).
- **Gol tekniği:** Şampiyonlar Ligi 2009/10 gollerinin %41,6'sı iç ayakla plase.
- **Şut tekniği payları:** yarım vole ~%7–8, vole ~%4, aşırtma ~%1 (StatsBomb; hafızadan, doğrulanmadı).
- **Blok:**
  - şutların ~%25–30'u bloklanıyor (FBref);
  - ceza sahası dışından ~%30–35, içinden ~%20–25;
  - saptırılarak gelen gol, golların ~%5'i civarı.
- **Kurtarış (çerçeveye giden şut):** genel ~%70; ceza sahası içinden ~60–66, dışından ~85.
- **Penaltı:**
  - gol %75–78, kurtarış %16–20, kaçırma %4–8;
  - kaleci ortada kalıyor %6,3 (Bar-Eli 2007).
- **Mesafe ve rol:**
  - şut mesafesi (FBref Dist, ortalama) ~15–16 m;
  - ceza sahası içinden şut %60–65;
  - 4-4-2'de forvet dışı şut ~%55–65.
- **Doğrudan serbest vuruş:** gol/şut %5–7; mesafeye göre 16–20 m %10–15, 20–25 m %6–9, 25–30 m %3–5.
- **Korner başına gol:** ~%2,5–3,5.

Bunların bir kısmı hafızadandır ve kaynağıyla doğrulanmadı. Dış ayak ve burunla vuruş için sağlam bir kaynak yok.

**İlgili dosyalar** (hepsi `C:\Users\herna\Desktop\chairman\` altında):
- Motor: `js\mac-karar.js`, `js\mac-topla.js`, `js\mac-hareket.js`, `js\mac-dizilis.js`, `js\mac-mudahale.js`, `js\mac-kaleci.js`, `js\mac-takim.js`, `js\mac-durantop.js`, `js\mac-motoru.js`.
- Ölçüm araçları: `araclar\olcumler\{v-verim,a-akis,v-vurus,s-sut,r-karne,k-duran,t-kanat}.js`.
- Senaryolar: `araclar\senaryolar\{d-penalti,d-duran,v-sut,d-sut}.js`.
- Taban: `araclar\taban\t23.json`.
- Ölçüm raporu: `C:\Users\herna\AppData\Local\Temp\claude\C--Users-herna-Desktop-chairman\827662c7-c8d8-4c2a-be5a-1aeecf62a7ac\scratchpad\t23-80.txt`.
