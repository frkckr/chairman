<!-- T26 uygulama planı: Claude'un salt okuma kod haritalarının sentezi (2026-10-18 gece, masaüstü). Onaylı tur planı gerçekçilik planındadır; burası uygulayıcının çalışma notudur. Satır numaraları yazıldığı andaki koda göredir; scratchpad yolları (C:/Users/herna/AppData/...) yerel ve geçicidir. -->

**T26 uygulama planı: yorgunluk ve ikinci yarı**

## 0. Çerçeve

- **Dal ve taban.** Dal `claude/motor-t26`, T25'in ucundan açılır. Taban `araclar/taban/t25.json`.
- **Satır numaraları.** Aşağıdaki satırlar bugünkü HEAD 8af0732'ye göredir (T24a–g birleşimi; okuma sırasında ecbf993'ten ilerledi). T24c/h ve T25'ten sonra satırlar kayar; yer işlev adıyla yeniden bulunur.
- **Ortak kurallar:**
  - `varlik`'e alan eklenmez. Bütün öneriler yalnız şu mevcut alanları okur: `p.yorgunluk`, `p.gorevAd`, `p._kipI`, `p.efor`, `N.yorgun`, `N.yorgunPay`, `hrkTepe(p)`. Ölçüm yan tablolara (Map, Set) ve maç alanı `_kov`'a yazar.
  - Hiçbir öneri yeni rastlantı çekmez. Anahtar 0'da kod yolu eskisiyle aynıdır. Her adımda anahtarlar kapalıyken `t25.json`'a `--ayni` uygulanır.
  - Denge kararı 80 maçla verilir. İkinci yarının gol payı 240 maçla okunur. Tarama soru başına en çok iki değerdir.
- **Çizim.** Animasyon dosyasına dokunulmaz, animasyon ölçümü gerekmez. Kip dağılımı değiştiği için kapanışta Claude kendi incelemesi için `an-yakala` ile önce/sonra şeridi alır.

## 1. Alt adımlar (bağımlılık sırasıyla)

### T26-0 — ölçüm (sonucu değiştirmez; tek ajan; ilk iş)

**`araclar/olcumler/y-yari.js`** (`yeni` 26–76, dilim tablosu `ozet` 95–99):
- (i) **Kimin koştuğu.**
  - İlk santrada oyundaki saha oyuncuları bir Set'e alınır. Oyuncu başına dilim sayaçları Map'te tutulur. Son karenin `m`'i saklanır, maçı bitirenler oradan seçilir.
  - Dilim tablosuna iki sütun eklenir: maçı bitiren ilk 11'in HŞK'si, yedeğin örnek payı ve HŞK'si.
  - Yeni bilgi satırları: "HŞK son ÷ ilk: takım · ilk 11 bitiren".
- (ii) **HŞK'nin kaynağı.**
  - HŞK'nin görev payı, 1. ve 6. dilimde, ilk 8 görev.
  - HŞK'nin efor bandına göre payı: < 0,5 · 0,5–0,8 · 0,8–0,95 · 1.
  - Kip "hızlı" koşusunun hedef uzaklığı: 16–20 · 20–25 · 25–30 · > 30 m. T26a'nın dozu buradan çıkar.
- (iii) Ortalama `enerji`, dilime göre (bilgi).
- (iv) **Yarıya göre hatlar:**
  - savunma ile orta saha hattı arası (DEF ve OS'un ortalama u'su);
  - savunmacının hedefinin önünde ya da gerisinde > 1,5 m (geç çekilme, geç çıkış).
- (v) **Yarıya göre dönüşüm** (borç 4'ün r₂/r₁ teşhisi): gol ÷ `pPg`, blok / şut, kötü vuruş payı, çerçevedeki şutta kurtarış.

**`araclar/olcumler/r-karne.js`** (89, 148–152, 189): taşıma epizoduna yarı, rol ve başlangıç bölgesi yazılır (kendi yarısı / orta / son 35 m). Bunlar bilgi satırı olur.

**Kovalama seçimi** (`js/mac-dizilis.js:84–101`): ikinci en erken aday ve süresi `_kov`'a yazılır (`ikinci`, `ikinciT`). Döngü bunu zaten hesaplıyor, ek maliyeti yok.
- `r-ivme.js` yeni satırı: yerden serbest topta, alıcısız kararlarda ikinci adayın ≤ 0,3 sn yakın olma payı ve bunların içinde ikincinin daha dinç olma payı (yarıya ve son dilime göre).
- Bu satır T26b'nin kabul ölçüsüdür.

**Kabul tanımı önerisi** (Claude'un motor kararı; Sonuç'ta ve borç 3'te görünür yazılır):
- HŞK'nin ana satırı: maçı bitiren ilk 11, etkin süre, son ÷ ilk **0,86–0,93**.
- Gerekçe:
  - U1 duruşları sıkıştırdığı için toplam süreyle (0,80–0,90) kıyas kurulamaz;
  - Linke 2018'in etkin süre değeri −%7…−14;
  - yedekler oranı şişiriyor: son dilimdeki örneklerin %28,5'i yedek, 4 maçta ilk 11'in oranı 0,82, takımınki 0,90.
- Takımın (yedekli) oranı ve eski bant bilgi olarak kalır.
- "Literatür maçı bitirenleri ölçer" bilgisi bellekten; doğrulanır, doğrulanamazsa "bellekten" diye yazılır.

**Kapılar:**
- `mac-deneme.js 4` "sonuç aynı";
- `ad-denetimi.js`;
- `40 --karsilastir t25.json --ayni` 40/40.

**Okuma:**
- 80 maç, `t25.json`'ın tohumlarıyla;
- 240 maç arka planda: ikinci yarının gol payının tabanı. T25'in etkisini de belgeler.

**Karar kapısı:** maçı bitiren ilk 11'in oranı > 0,93 ise T26a açılır. 0,86–0,93 içindeyse T26a yapılmaz; borç 3 tanımla kapanır, gerekçesi yazılır. < 0,86 ise motor değişmez, kayda geçer.

### T26 iskeleti (sonucu değiştirmez; T26-0'dan sonra)

- T24'ün kalıbı kullanılır: `/*T26a*/ … /*T26f*/` işaret satırları.
- Satırların yeri: `js/mac-motoru.js` `MOTOR_AYAR` (T25 bloğunun altına) ve sahiplerin `ayarEkle`'leri:
  - C: `mac-hareket.js`;
  - T: `mac-takim.js`;
  - B: `mac-topla.js`.
- Bütün değerler 0. Kapı: `--ayni` 10/10. Paralel ajanlar bu commit'ten dallanır; her ajan yalnız kendi işaret satırını düzenler.

### T26a `yorgunHizli` (C) — koşullu · PARALEL P1

- **Nerede:** `js/mac-hareket.js:563–571` `kipSec`; kip 4 dalı 567.
- **Ne:** kip 4'ün eşiği yorgunlukla uzar: `d > 2·kipKos·(1 + yorgunHizli·pay)`.
  - pay = clamp((y − 0,1)/0,25; 0; 1), y oyuncunun kendi yorgunluğu.
  - Yalnız `ef < 0,6` ve `gorevAd ∈ {bolge, uzakKanat}` için.
  - `hat` ve T25'in kanat rolü `genis` dışarıda.
  - Gerekçe: tavanı düşürmek 5,5 m/sn'nin üstünde kaldıkça HŞK süresini azaltmaz; etki eşikle gelir. Yorgunlukta zorunlu olmayan koşu azalır (pacing).
- **Anahtar ve tarama:** `yorgunHizli`, varsayılan 1 (0 = eski). Tarama 1 ve 0,5.
- **Kabul (80 maç):**
  - maçı bitiren ilk 11'in oranı 0,86–0,93;
  - ivmelenme ≤ taban + 0,2;
  - ceza sahasında boşta rakip σ içinde;
  - PPDA ≤ 7, ofsayt bantta;
  - gol, xG ve şut bantları.
- **Kapı:** `c-hareket`, `c-kanat`, `c-1v1`; "Dilimlere göre hareket" tablosu.

### T26b `kovalaYorgun` + `presYorgun` (T) · PARALEL P2

Onaylı "kim kovalar" maddesi; metrikten çok görünür gerçekçilik için.

**Kovala** (`js/mac-dizilis.js:88`, `:101`):
- Seçim ölçütü k.t + ek + min(0,3; kovalaYorgun·max(0; y − N.yorgun)), N = `this._niyet[t]`.
- Ceza almayanlar: pasın alıcısı (ek ≠ 0), yüksek top, dönen top (ceza sahasında sahipsiz top). Kaleci zaten aday değil.
- **Ek kural (T18a dersi):** ceza yalnız rakibin en erken varışından önce varan adaylar arasında işler. Bunun için iki geçiş yapılır: önce iki takımın cezasız en erkeni, sonra cezalı seçim.
- `sure[t]` cezasız varış olarak kalır; `kovalaPay` eforu fiziksel kalsın.

**Pres** (`:159`):
- Puana min(3; presYorgun·max(0; y − NY[t].yorgun)) eklenir.
- Karşı pres üçlüsü ve çalımın hedefi (`ch`) değişmez.

**Anahtarlar ve tarama:**

| Anahtar | Varsayılan | Tarama |
|---|---|---|
| `kovalaYorgun` | 1,5 (sn / birim yorgunluk) | 1,5 ve 3 |
| `presYorgun` | 10 (m / birim) | 10 ve 20 |

**Kabul:**
- Son dilimde ≤ 0,3 sn'lik çiftlerde dinç olanın seçilme payı ≥ %50 (T26-0 satırı).
- Yüksek eforlu görev değişimi ≤ 15 / oyuncu·dk (`MAC_DENEME_IVME=1`, 12 maç).
- 80 maçta (birleşimde) σ içinde: pas isabeti, hava topu, PPDA, gol, kurtarış oranı, ivmelenme.

**Kapı:** `c-1v1`, `c-koru`, `c-donen`, `c-hava`, `c-orta`, `d-duran`.

### T26c `tasiYorgun` (B) · PARALEL P3, sıra 1

- **Nerede:** `js/mac-karar.js:312` `tasimaSecenekleri`, vC.
- **Ne:** vC ×= `hrkTepe(p)/p.maxSpd`. Bu bir fizik tutarlılığı düzeltmesi: rakipler zaten `hrkTepe` ile tartılıyor.
  - Sürükleme (`:330`) T25'in alanıdır, dokunulmaz.
  - T25 ortak bir vC yardımcısı yazdıysa çarpan yalnız taşıma yoluna konur.
- **Anahtar:** `tasiYorgun` 1, tek değer.
- **Kabul:** ikinci yarıda taşıma > 5 m payı ≤ ilk yarının.
- **Kapı:** `c-1v1`, `c-koru`, `c-kanat`.

### T26d `yorgunSabir` + `sabirKendi` (B) · P3, sıra 2 (aynı ajan, aynı ölçü)

**Nerede:** `js/mac-karar.js:805` `sabirEsigi`; `:816` `kararVer0`'ın "tut" eki.

**`yorgunSabir`:**
- Eşik ×(1 − k·N.yorgunPay). Takımın payıyla, çünkü madde "yorgun takımda" diyor.
- Yalnız u < PL − 35'te: son 35 m'ye dokunmaz, şut hacmi korunur.

**`sabirKendi`:**
- u < −15'te yalnız `s.tur === 'tasi'`'nin eşiği ×(1 − k). Koru ve bekle değişmez; `c-koru` korunur.
- Yorgunluktan bağımsızdır, ama gerekli: ilk yarı tek başına %40,4.

**Rastlantı:** "tut" grubunun Gumbel çekilişi aynı anahtarla kalır; çekilişin sayısı ve sırası değişmez.

**Anahtarlar ve tarama:**

| Anahtar | Varsayılan | Tarama |
|---|---|---|
| `yorgunSabir` | 0,5 | 0,5 ve 1 |
| `sabirKendi` | 0,3 | 0,3 ve 0,5 |

**Kabul (80 maç):**
- taşıma > 5 m %25–35 (karne);
- top ayakta ortanca 1,2–2,0;
- sahiplik başına pas 2,5–4;
- PPDA ≤ 7;
- şut 16–28, gol 2,2–3,3;
- forvet şutunun taşımadan gelen payı σ içinde;
- duyarlılık karnesinde "sürüş → taşıma (> 5 m)" geçer.

**Kapı:** `c-1v1`, `c-koru`, `c-kanat`, `b-pas`, `p-tip`.

### T26e `yorgunAra` (T) · PARALEL P4, sıra 1

Onaylı "aradaki boşluklar" maddesi; borç 4'ün ana kaldıracı.

- **Nerede:** `js/mac-dizilis.js:52` `dizilisKonumu`, savunma dalı (`!sahip && m.cizgi === 'OS'`): u += yorgunAra·N.yorgunPay.
  - Forvetin üst sınırı (`:61`) ve DEF hattı (`savunmaCizgisi`) değişmez.
- **Neden:** motorda ikinci yarıda hatlar arası 17,8 → 17,0 m daralıyor. Gerçekte takım boyu +1,4 m artar (Praça 2020).
- **Anahtar ve tarama:** `yorgunAra` 3 m. Tarama 3 ve 1,5; T25'in tabanında gol ≥ 3,0 ise önce 1,5.
- **Kabul:**
  - hatlar arası 2. yarı ≥ 1. yarı;
  - savunan takımın boyu 2. − 1. yarı +1…+2 m;
  - ikinci yarının xG payı artar;
  - ikinci yarının gol payı ≥ %50 (240 maç, birleşimde);
  - gol ≤ 3,3; ÷ konum xG 0,85–1,20; şut 16–28; ofsayt bantta; boşta rakip σ içinde.
- **Kapı:** `c-kanat`, `c-hareket`, `c-1v1`; "Y:" satırları; dilim tablosu (80 maç).

### T26f `yorgunCikis` (T) — koşullu · P4, sıra 2

- **Nerede:** `js/mac-dizilis.js:271` `savunmaCizgisi`: `hatCik` ×(1 − k·N.yorgunPay).
- **Koşul:** T26e'den sonra ikinci yarının payı < %50 ve ofsayt ≥ 1,0 ise yapılır.
  - Yoksa yapılmaz. Gerekçe: T26-0 çıkış ihtiyacını örneklerin %6–10'unda görüyor, etki küçük; T18d'de çizginin derinleşmesi ofsaytı 2,0 → 0,8'e indirmişti.
- **Anahtar ve tarama:** `yorgunCikis` 0,5, ikinci değer 1.
- **Kapı:** `o-ofsayt`, `c-hareket`, `c-1v1`.

### T26g `yorgunKotu` (B) — varsayılan olarak YAPILMAZ

- **Koşul:** 240 maçta r₂/r₁ < 0,9 olmalı ve T26-0'ın (v) satırları farkı kötü vuruş ya da sapmayla açıklamalı.
- **Ne:** kötü vuruşun yorgunluk çarpanı (1 + y) → (1 + 0,5·y).
- **Kapı:** `v-sut`, `d-sut`.
- Koşul tutmazsa borç defterine girer (T24 şut modelinin sahibidir; §6: ayarla zorlanmaz).

## 2. Paralel dağıtım ve birleştirme

- **Sıra:** T26-0 → iskelet → 80 maç okuması ve karar kapısı. Sonra dört akış paralel:

  | Akış | İş | Dosya |
  |---|---|---|
  | P1 | T26a (yalnız kapı açtıysa) | `mac-hareket.js` |
  | P2 | T26b | `mac-dizilis.js`: seçim ve pres bölümü |
  | P3 | T26c → T26d | `mac-karar.js` |
  | P4 | T26e → T26f | `mac-dizilis.js`: `dizilisKonumu` ve `savunmaCizgisi` |

- **Çakışma.** P2 ile P4 aynı dosyanın ayrı işlevlerine dokunur; çakışma riski düşük. Anahtarlar ayrı işaret satırlarında.
- **Her ajanın teslimi:**
  - kendi çalışma ağacında diff;
  - anahtarı 0'dayken `--ayni` 10/10;
  - iki tarama değeri için 40 maç `--karsilastir t25.json` (yön);
  - senaryo çıkış kodları;
  - kendi 10 maçlık parmak izi (birleşimin doğrulaması için).
- **İşlemci.** Ajanlar maç denemelerini `--isci` ile bölüşür (çekirdek ÷ ajan sayısı). Paralel evrede hız ölçümü ve akış denemesi koşturulmaz.
- **Birleştirme sırası:** T26b → T26a → T26c/d → T26e/f.
  - Her birleşimden sonra öteki anahtarlar 0'dayken akışın kendi parmak izine `--ayni`.
  - Sonra hepsi açık: 80 maç `--karsilastir t25.json`. Değer seçimi burada yapılır; tutmazsa ikinci tarama değeriyle bir 80 maç daha.
  - En sonda 240 maç (ikinci yarının gol payı).

## 3. Çakışan önerilerde seçimler

- **Borç 3.** Önce tanım ölçülür (T26-0); T26a koşulludur.
  - Kim kovalar (T26b) onaylı madde olduğu için yapılır, ama HŞK'ye etkisi < %0,5 sayılır. Borç defterindeki "kaynak kovalayan ve 1. adam" teşhisi ölçüyle düzeltilir: HŞK'nin %51'i efor < 0,8 görevlerde.
- **Borç 4.** `yorgunAra` seçildi, `yorgunHizliHat` reddedildi.
  - Hat zaten ikinci yarıda %79 geç çekiliyor; daha fazla gecikme ara pası ve ofsaytı belirsiz biçimde oynatır.
  - `yorgunAra` ölçülen kusuru doğrudan hedefliyor (hatlar ikinci yarıda daralıyor) ve onaylı maddeyle aynı.
- **Kovalamanın devri.** `kovalaYorgun` seçildi, `enerjiHsk` (sprint enerjisinin HŞK eşiğinden harcanması) reddedildi.
  - Etkisi geniş: `hrkTepe` kararda da kullanılıyor, gol, çalım ve şut oynar.
  - Yerine yeni borç satırı: "sprint enerjisi ölü (0,987–1,0; geçici yorgunluk yok)", aday, ayrı tur.
- **"Sabırla kazanan tut" karşı-olgusu** (`kararVer0`'a salt okunur alan): yapılmaz. İki tarama değeri doğrudan okur; motor dosyasına ölçüm yazılmaz.
- **Borç 1–2 (ivmelenme).** T26'da zorlanmaz.
  - İvmelenmenin 5,13 / 5,62'si efor ≥ 0,8 görevlerde; bu turun kaldıraçları onu oynatmaz.
  - Satırlar "bilgi / ölçüm" durumuna geçer. Bulgu (yarıya göre kovala tetik sayısı, T26b'nin etkisi) Sonuç'a yazılır.
- **Gol payının kabulü.** Mutlak ≥ %50, 240 maçla kalır. 2./1. yarı oranları bilgi satırıdır.

## 4. En büyük riskler ve geri dönüş

- **Gol 2,2–3,3:** T26e ve T26a savunmada boşluk açar. T18d'de `yorgunPres` 0,4 + `yorgunKosu` 0,8 golü 3,8'e çıkarmıştı.
  - Önlem: T25'in tabanı ≥ 3,0 ise T26e 1,5 ile başlar. Bant aşılırsa önce T26e kapanır.
- **÷ konum xG 0,85–1,20:** T24 kalibre eder, T26 şut modeline dokunmaz (T26g koşullu). T26e'nin zon 14 şutları ve açılan alan oranı oynatabilir; birleşimde izlenir.
- **Şut 16–28:** forvet şutlarının %74'ü ≥ 5 m taşımadan geliyor. `sabirKendi` yalnız u < −15'te, `yorgunSabir` yalnız u < PL − 35'te çalışır. Bant aşılırsa önce `sabirKendi` 0,3'e ya da 0'a iner.
- **İvmelenme (5,84; korunur):**
  - T26d daha çok pas, yani daha çok kovala ve pres tetiği doğurabilir;
  - T26b kovalayanı değiştirir;
  - sınır: ivmelenme ≤ taban + 0,2, eşzamanlı ivmelenme ≤ taban + 0,1.
- **PPDA ≤ 7** (bugün 6,3–6,5): `sabirKendi` kendi yarısında pası artırır.
- **Ofsayt:** T26e/f ve T18d dersi.
- **HŞK'nin bandın altına inmesi:** T25'in değiştirdiği görev dağılımıyla T26a'nın dozu birleşince oran 0,86'nın altına düşebilir. Doz T26-0'ın dağılımından seçilir; 0,5 yedekte.
- **Gürültü:** ikinci yarının payı 80 maçta ±4–5 puan oynar; karar yalnız 240 maçla.
- **Geri dönüş:** her anahtar 0 = eski, motor `t25.json`'a `--ayni`. Her alt adım ayrı yerel commit; en kötü durumda iskelet commit'ine dönülür. Bant aşılırsa kapatma sırası: T26e → `sabirKendi` → T26a → `yorgunSabir` → T26b.

## 5. Kapanış (CLAUDE.md tur kapanışı)

- **Motor:**
  - 80 maç `--karsilastir t25.json` ve robotluk karnesi;
  - 240 maç ikinci yarı payı;
  - bütün senaryolar ve `ad-denetimi.js`;
  - duyarlılık karnesi: `oyuncu-karnesi.js 80 1 --duyarlilik` (B kararları değişti).
- **Hız:**
  - `tur/t25` ağacıyla üç sıralı çift `hiz-olcum.js 3 --tekrar 5`;
  - aynı süreçte `2 --tekrar 8 --kok`;
  - gol değişirse `hiz-evre.js`.
- **Ekran:** `kontrol.py` maç sayfası; `an-yakala` önce/sonra (Claude'un kendi incelemesi). `ikiz-deneme.js` gerekmez: modül düzeyi durum değişmiyor, `_kov` maç başına.
- **Taban:** yeni `t26.json`; çalışma ağacında `t25` ve `t26` kalır, `t24.json` silinir. Yerel `tur/t26` etiketi.
- **Belgeler:**
  - gerçekçilik planına "T26 — Sonuç", kabul tanımı değişikliğinin gerekçesiyle;
  - borç defteri: 1–4, karne taşıma satırı ve yeni sprint enerjisi satırı;
  - TEKNIK_PLAN §8 anahtar listesi;
  - YOL_HARITASI devam notu.
- **Kullanıcıya bildirim:** HŞK kabulünün yeniden tanımlanması kapanış özetinde açıkça bildirilir; iki sayı yan yana verilir (takım ve maçı bitiren ilk 11).

## 6. Sonuç tablosunun kabul satırları

| Ölçü | Hedef |
|---|---|
| HŞK son ÷ ilk, maçı bitiren ilk 11, etkin süre | 0,86–0,93 (takım ve eski 0,80–0,90 bandı bilgi) |
| İkinci yarının gol payı | ≥ %50 (240 maç) |
| Top taşıma > 5 m | %25–35 |
| Devredilen kovalama | ≥ %50 |
| Takım boyu, 2. − 1. yarı | +1…+2 m |
| İvmelenme | ≤ taban + 0,2 |
| Gol · ÷ konum xG · şut | 2,2–3,3 · 0,85–1,20 · 16–28 |
| PPDA | ≤ 7 |
| Ofsayt | bantta |

İlgili dosyalar (hepsi `C:/Users/herna/Desktop/chairman/` altında):
- `MAC_MOTORU_GERCEKCILIK_PLANI.md`
- `js/mac-hareket.js`, `js/mac-dizilis.js`, `js/mac-karar.js`, `js/mac-takim.js`, `js/mac-topla.js`, `js/mac-motoru.js`
- `araclar/olcumler/y-yari.js`, `araclar/olcumler/r-karne.js`, `araclar/olcumler/r-ivme.js`
