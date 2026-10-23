<!-- Durum (2026-10-22, dizüstü): C KAPANDI (`tur/c`; oto mod). C0–C8 uygulandı; C9'un 80 maçlık karnesi ve hızın kesin kabulü masaüstüne kaldı. Profil kapısı 4/5 (uzun paslı 6'nın uzun ileri pası tutmadı); sonuç FUTBOL_KUTUPHANESI §12.4 C, kararlar MAC_MOTORU §3 (2, 14). p̄ C4 verisiyle 0,65 (planda 0,62 yazıyordu). -->
# Plan: C — Oyuncu farkı (Z9 öne)

## Bağlam

Kapsam ve kabul FUTBOL_KUTUPHANESI.md:225'te (§12.1, C satırı), ilke karar 22'de (YOL_HARITASI.md:56): oyuncunun profili sahada davranışıyla görünür. Aynı profilin güçlüsü işi daha iyi yapar ama aynı zihniyetle oynar. Puanlar gizli kalır. Üç salt okuma ajanının bulguları ve kod okumasının sonucu:

- **Profiller birbirinden ayırt edilemiyor.** Her şey 11 özellikten türetiliyor (js/mac-profil.js:108-126). Kadro kayıtlarında `rol` ya da `egilimler` yok, oysa motor bunları okuyabiliyor (:118, :121). İki kadro neredeyse birbirinin aynası: 4 kanadın 4'ü `cizgiKanadi` (topuAtipKosar ve cizgiyeIner +1'de), 4 stoperin 4'ü `sertStoper`. Hiçbir oyuncu `oyunKuranStoper` değil.
- **Eğilim seviyeyle karışıyor.** Eğilim şöyle hesaplanıyor: clamp(3·Σw·(değer − 0,5) + rol varsayılanı, −1, 1) (:120). Aynı şeklin 0,15 zayıf kopyası çoğu eğilimde 0,30–0,45 kaybediyor; rol de değişebiliyor (Kadir: firsatci → hedefForvet). Bu, karar 22'nin "zihniyet aynı" şartına ters.
- **Eğilim gürültünün altında kalıyor.** 129 kararda ölçülen |eğilim puanı| ortancası 0,16. İki Gumbel çekilişinin farkının standart sapması ise ~0,40 (τ ≈ 0,22; js/mac-karar.js:857-862). Aynı alıcıya giden kısa pas, uzun pas ve ara pası tek bir Gumbel çekilişini paylaşıyor (:859).
- **Hız aralığı dar.** maxSpd = 6,4 + 2,4·hız (js/mac-motoru.js:333, js/mac-kurallar.js:57). Saha oyuncuları 7,65–8,30 m/sn arasında. hrkSabit'teki A0 ivmesi 7,8 tavanına zaten dayanıyor, S0'ın tavanı 10,0 (js/mac-hareket.js:151).
- **Falso yalnız görüntü, uzun top oyuncuya bağlı değil.**
  - Pasın eğrisi yalnız ayak, `this.rast`, `pasFalso` ve `pasEgriKat`'tan geliyor (js/mac-topla.js:537-539, :556-558). Pas özelliğine ve eğilime bağlı değil; nişan düzeltmesi eğriyi telafi ediyor.
  - Uzun topun değeri geometriden, takımın tarzından ve isabetten geliyor (js/mac-karar.js:448, :486, :514). Eğilim yalnız `yonDegistirir` üzerinden, top yanlamasına 25 m'den fazla gidince (|Δz| ≥ 25) devreye giriyor (js/mac-profil.js:133).
- **Ölçü yetersiz.**
  - p-tip yalnız hangi seçeneğin seçildiğine bakıyor. Hızı değiştirmiyor, önbellekleri sıfırlamıyor (araclar/senaryolar/p-tip.js:4, :27-29).
  - Oyuncu başına sayan bir eklenti yok.
  - Karnenin ±0,2 denemesinde pas, hız ve görüş yok (araclar/oyuncu-karnesi.js:40-47).

**Varsayımlar.**
- Eğilim oyuncunun stilidir ve özelliklerinin şeklinden gelir. Seviye işin ne kadar iyi yapıldığıdır: isabet, hız, kapı.
- Güçlü ve zayıf seviye yalnız araçların içinde ±δ dönüşümüyle kurulur. Yeni ad ya da kulüp yazılmaz.

**Kullanıcının sorunu (dizüstü/masaüstü):** Bu tur CLAUDE.md:56'daki "Makine durumu" kuralına bir nabız ve bir durma protokolü ekleyerek yürür (aşağıda). Masaüstü, dizüstünün çalışıp çalışmadığını ya da kesildiğini en çok 45 dakika eski bir bilgiyle görür.

## Dal, taban, kurallar

- Dal `claude/motor-c`, `tur/b`'den açılır (B `main`'e alındıysa `main`'den). Plan `araclar/plan/c-uygulama.md`'ye kopyalanır; ilk satırı durum satırıdır.
- **Taban.** `b.json` C'nin başlangıcıdır. Kadro verisi C4'te değişince yerel `araclar/taban/c-veri.json` üretilir ve depoya alınmaz. Masaüstü onu `ESKI` değerleriyle (aşağıda) dalın başından yeniden üretir.
- **Yeni anahtarlar** eski değerde motoru bit bit aynı bırakır:
  - `egilimGoreli` 0, `uzunEgilim` 0, `cikisEgilim` 0 (sahibi P, js/mac-profil.js:18);
  - `hizAralik` [6.4, 2.4, 10] (sahibi C, js/mac-hareket.js:20);
  - `falsoProfil` 0 (sahibi B, js/mac-topla.js:20);
  - `egilimGuc` zaten var (0,5).
  - Bildirimler js/mac-motoru.js:69 (P), :71 (C) ve :91 (B, `pasFalso`'nun yanı).
- **Bütünlük ölçüsü:** `ESKI='{"egilimGoreli":0,"egilimGuc":0.5,"hizAralik":[6.4,2.4,10],"falsoProfil":0,"uzunEgilim":0,"cikisEgilim":0}'`. C4'ten önce `b.json`'a, sonra `c-veri.json`'a `--ayni` tutmalı.
- **Motor kuralları.**
  - Rastlantı yalnız `this.rast`; yeni çekiliş yok.
  - `varlik`'e alan eklenmez. Yeni veri `p.profil.egilim` içinde (iki eğilim listenin sonuna eklenir) ve `MOTOR_AYAR`'da durur.
  - Yeni üst düzey ad yalnız `oyuncuTepeHiz`; bu yüzden `ad-denetimi` koşar.
  - Ekrana dokunulmaz.
- **Kademeler** CLAUDE.md "Kontrol"e göre:
  - Hızlı kademe: `mac-deneme 4` ve değişenin KAPILAR satırı.
  - Denge kararı 4 ya da 10 maçla verilmez. Soru başına en çok iki tarama değeri.
- **Kullanıcının hükmü.** Kullanıcı tur sonunda 2D'de izler. "En az üç profil davranışından tanınıyor" hükmü onundur (§11.3 madde 4). Kabul sahnesi üretilmez.
- **Bilinen borç** (kapanışı tek başına durdurmaz): `d-duran` korner başına gol %5,3.

## Makine durumu protokolü (bütün tur boyunca; CLAUDE.md:56'nın uygulanışı)

1. **Başlangıç.** `git fetch --prune --tags`. `main` devam notundaki satır "çalışıyor" diyorsa ve satırdaki dalın son push'u 2 saatten yeniyse dur. Değilse satırı `../chairman-main` ağacında "Makine durumu: dizüstü çalışıyor (<tarih saat>), dal claude/motor-c, adım C0" yap, commit edip `main`'e push et (yalnız belge; Pages yeniden yayımlanır).
2. **Her adımın sonu.** Commit konusu "C<n>/8: …", dal push edilir. Push'tan önce fetch yapılır; uzak dal başka makineden ilerlemişse push edilmez, durulur, not yazılır. Zorla push yapılmaz.
3. **Nabız.** Dal 30 dakikadan uzun commit'siz kalacaksa (uzun ölçüm sürüyorsa) plan dosyasının durum satırı güncellenip commit ve push edilir. Örnek: "C5: 40 maç arka planda, başladı 15:40". Böylece dalın son push'u 45 dakikadan eski olmaz.
4. **Commit'e ne girer.** Yalnız doğrulanmış hâl: ya yeni anahtarlar eski değerde ve `--ayni` tutuyor, ya da adımın kabulü geçti. Commit'siz iş yalnız o adımın içinde kalır. Adım yarıda bırakılırsa ya geri alınır ya da anahtarı eski değerde commit edilir (`--ayni` ile).
5. **Durma.** Bir kapı düşerse, süre biterse ya da kullanıcı keserse:
   - neden plan dosyasına ve devam notuna yazılır, dal push edilir;
   - `main`'deki satır "boşta (<saat>, claude/motor-c <commit>; bitti | C<n>'de durdu: <neden>)" olur ve push edilir;
   - son iş olarak arka planda node ya da python kalmadığı ve `git status`'un temiz olduğu denetlenir.
6. **Masaüstü.** `git fetch --prune --tags; git log -1 --format="%cr %s" origin/claude/motor-c`.
   - "çalışıyor" ve son push 2 saatten yeni: devam edilmez, kullanıcıya söylenir.
   - Daha eski: kesilmiş sayılır. Kesik iş yalnız son "C<n>/8" commit'inden sonraki adımın içindeydi; oradan devam edilir, `c-veri.json` `ESKI` ile yeniden üretilir, satır masaüstüne geçer.

## Alt adımlar

Sıra C0 → C8, kapanış C9. Gerekçesi: önce ölçü, sonra eski değerde kod (bütünlük), sonra veri, sonra davranış (eğilim → hız → falso, uzun top, stoper).

### C0 — Önkoşul, dal, plan dosyası (~10 dk, motor kodu yok)
- `git tag -l tur/b` ve `araclar/taban/b.json` var olmalı. Biri yoksa C başlamaz (MAC_MOTORU_GERCEKCILIK_PLANI.md:30): satır "boşta — C başlamadı, B açık" yapılır, push edilir, durulur.
- Varsa: dal açılır, plan dosyası yazılır, `main`'deki durum satırı güncellenir (protokol 1).
- Ölçü: `node araclar/mac-deneme.js 4 --karsilastir araclar/taban/b.json --ayni`. Kabul: 4/4 aynı, `git status` temiz.

### C1 — Oyuncu görünürlüğü eklentisi ve "önce" tablosu (~40 dk + 13 dk arka planda; yalnız araç)
- Yeni dosya `araclar/olcumler/c-oyuncu.js`. Sözleşme araclar/mac-deneme.js:23 ve `b0-zincir.js` ile aynı: rastlantı yok, motor yöntemi yok, yazma yok.
  - Anahtar `team:n`. Yalnız kadronun kendi adı, `profil.rol` ve `grup` basılır.
  - Okuduğu olaylar: `pass` (js/mac-topla.js:585; `b.egri` olay anında yazılı), `header.cek` (:834), `calim.sonuc` (js/mac-hareket.js:829), `plan` 'basladi' K/A/B/C/R (js/mac-plan.js:140-141), `kosu.verKac`.
  - Adım başına `m.ball.sahip` izlenir (pasın tamamlanması ve taşıma için), oyuncu başına tepe hız ve depar metresi (≥ 7 m/sn) tutulur.
- Profillerin imzaları (top oyundayken 10 dakika başına):

  | Profil | İmza |
  |---|---|
  | Hızlı kanat | 'gecti' sonuçlu çalım ve ≥ 15 m taşıma; tepe hız |
  | Uzun paslı 6 | tamamlanan pas, L ≥ 30 ve ≥ 15 m ileri; tek pasla yön değiştirme (\|Δz\| ≥ 25) |
  | Falsolu 10 | falso endeksi: oyuncunun L ≥ 18 m paslarında ortalama \|egri\| ÷ aynı türün (yerden / havadan) bütün oyunculardaki ortalaması |
  | Hava hâkimi 9 | kazanılan çekişmeli kafa (`cek`) |
  | Oyun kuran stoper | kendi yarısından ≥ 10 m ileri tamamlanan pas ve ≥ 10 m taşıma; top eylemleri içinde uzaklaştırma payı |

- Ortak satırlar:
  - hat kıran pas: tamamlanmış, ≥ 10 m ileri, ve pasın başı ile hedefi arasında derinlikte duran, pas çizgisine yanal uzaklığı ≤ 12 m olan ≥ 2 rakip saha oyuncusu;
  - ilkel başlatma: plan K/R ve ver-kaç;
  - genel falso payı: ortalama |egri| ve |egri| > 0,02 payı.
- Profil kapısı: imzanın oranı aynı grubun profil dışı oyuncularına (iki takımdan) bölünür, Poisson %95 aralığıyla (araclar/oyuncu-karnesi.js:126-127). Hedef oran ≥ 1,5 ve aralığın alt ucu > 1.
- Ölçü:
  - `node araclar/mac-deneme.js 4 --karsilastir araclar/taban/b.json --ayni`;
  - arka planda `node araclar/mac-deneme.js 40 1 --karsilastir araclar/taban/b.json --ayni`. Çıktısı "önce" tablosudur ve plan dosyasına yazılır.
- Kabul: 40/40 aynı. Süre satırı gürültü içinde. Beklenen sonuç: 5 profilin en çok 1'i kapıdan geçer, çünkü bugün roller tekdüze.

### C2 — Sahne ve duyarlılık araçları (~60 dk; yalnız araç)
- **`araclar/senaryo-ortak.js`: `profilDegis(m, p, oz, δ)` yardımcısı** (klasör dışında olduğu için oturum-sonu onu senaryo saymaz).
  - Önce `oz` alanlarını yazar. δ verilmişse kalecilik dışındaki 10 özelliği ±δ kaydırır, sonucu 0,15–0,95 arasında kırpar.
  - `maxSpd`'yi bağlamda `oyuncuTepeHiz` varsa onunla (C3'ten sonra), yoksa `6.4+2.4*hiz` ile kurar.
  - `_kutle=0`, `_cev=null`, `_hk=null` yapar. Maç ortasında `undefined` değil `null`; böylece hrkHazirla çalım durumunu sıfırlamaz (js/mac-hareket.js:145, :149). Sonra `profilKur` çağrılır.
  - Geri yükleme işlevi döner; bu işlev önbellekleri yeniden sıfırlar.
- **`araclar/senaryolar/p-tip.js`.**
  - Takası `profilDegis` ile yapar (bugün hız etkisizdi, önbellekler sıfırlanmıyordu).
  - Seçim kategorisi tür × boy bandı (<15 / 15–30 / ≥30 m) × yön (ileri/geri) olur.
  - Beş çift:

    | Çift | Kapı |
    |---|---|
    | Kanat (bugünkü çift) | TVD ≥ 0,15 |
    | Merkez, kendi yarısında: uzun paslı 6 ↔ kesici | TVD ≥ 0,15 |
    | FV, rakip yarıda: falsolu 10 ↔ fırsatçı | TVD ≥ 0,15 |
    | Stoper (bugünkü çift) | yeni: TVD ≥ 0,15 |
    | FV: hava 9 ↔ koşucu 9 | bilgi |

  - Seviye ekseni: her çiftin A profili δ = 0,12 ile +δ ve −δ'de koşar. Satır "seviye TVD ÷ profil TVD".
  - Gürültü satırı: imza eğilimi taşıyan seçeneklerde ortanca |profilEgilimPuani| ÷ (π/√3)·τ. τ oyuncunun kendi tutarlılığından gelir: 0,1 + 0,5·(1 − tutarlılık).
- **Yeni `araclar/senaryolar/p-seviye.js`** (z-s14 kalıbı: `kur`, `bosalt`, `dizilis`, `yerlestir`, `topVer`, `oyunda`).
  - S1, kanat yarışı: kanat u = 20'de çizgiye 6 m, 4 m/sn hızla; bek 6 m önünde, kale tarafında. Süre 6 sn. Sınıflar: geçti (çalım 'gecti' ya da top ondayken u_W > u_D + 2), pas, kayıp, süre.
  - S2, uzun paslı 6: iki takım `dizilis` ile (topun yerine göre), top kendi yarısında u = −12, w = 22'de 6'nın ayağında. Süre 8 sn. Sınıflar: tamamlanan uzun ileri pas ya da yön değiştirme, kısa pas, tutma, kayıp.
  - Kollar profil {A, B} × seviye {+δ, −δ}, 60 deneme, eşli tohum `tohum·1000+i`. Rakip sabit, orta seviyede.
  - Hava seviyesinin kanıtı mevcut c-hava kapısıdır (güçlü × orta %70–88).
  - 10 ve stoper sahneleri (S3, S4) yalnız süre kalırsa eklenir; kalmazsa ertelenir.
  - Süre ≤ 3 dk; çıkış kodu 0 ya da 1 (oturum-sonu `--seyrek` bütün senaryoları koşar).
- **`araclar/oyuncu-karnesi.js` `--duyarlilik`.**
  - Bugünkü beş işaret (:50-63) aynen kalır.
  - Pas, hız ve görüş eklenir. İşaretleri `profilOzet('duy:'+özellik+':'+t+':'+grup)`'tan gelir, bugünkülerden bağımsız.
  - Hız değişince `maxSpd` = `oyuncuTepeHiz` (yoksa eski formül).
  - Olay sayaçlarına uzun ileri pas, çalım 'gecti', ilkel başlatma (plan K/R ve ver-kaç) eklenir.
  - Yeni [7b] satırları: pas → uzun ileri pas; pas ve görüş → ilkel başlatma; hız → geçti ve ≥ 15 m taşıma.
- Ölçü: `--senaryo p-tip`, `--senaryo p-seviye`, `node araclar/oyuncu-karnesi.js 4 1 --duyarlilik` (çalışıyor mu), `mac-deneme 4 --ayni b.json`.
- Kabul:
  - Bütün araçlar çalışıyor, `git diff js/` boş.
  - Kanat TVD ≥ 0,15 (artık hız da sayılıyor).
  - Bugünkü durum bilgi olarak yazılır. Beklenen: seviye TVD büyük çıkar; bu, C5'te düzeltilecek karışıklığın kaydıdır.

### C3 — Motor anahtarları, eski değerde (~35 dk + 8 dk arka planda)

**(1) `egilimGoreli` (κ).**
- profilKur'da grup KL değilse o = 10 saha özelliğinin ortalaması. Kalecilik `OZ_SIRA` içinde atlanır; yeni üst düzey ad yok.
- r = 0,5 + κ·(o − 0,5).
- Referans ref(a):
  - 0,5: hafiflik, kutle, boy, zayifAyak, tutarlilik;
  - 1 − r: kararTers;
  - r: öteki oz ve alt kaynakları.
- Eğilim döngüsü (js/mac-profil.js:120) ve `profilRolSec` (:105-106; üçüncü argüman `ref`, verilmezse 0,5) `kaynak(a) − ref(a)` ile hesaplar. κ = 0'da eski ifade aynen çalışır (dal `if(κ)`).

**(2) `hizAralik` = [6.4, 2.4, 10].**
- Yeni üst düzey `oyuncuTepeHiz(oz, kl)` js/mac-hareket.js'te: kalecide `6.4+2.4*h`, saha oyuncusunda `A[0]+A[1]*h`. Eski değerde işlem aynıdır, sonuç bit bit aynı.
- Kullanıldığı yerler: js/mac-motoru.js:333 (`rol==='GK'`), js/mac-kurallar.js:57 (`k.mevki==='KL'`), araclar/senaryolar/c-hava.js:30.
- hrkSabit'te S0'ın tavanı `A.hizAralik[2]` olur (js/mac-hareket.js:151). A0'ın 7,8 tavanı kalır.

**(3) İki yeni eğilim, PRF_EGILIMLER'in sonuna** (js/mac-profil.js:93'ten sonra).
- `falsoluPas` {pas .4, duranTop .3, yaraticilik .3}
- `uzunPasAtar` {pas .4, gorus .3, sutGucu .3}
- Sona eklendikleri için önceki 20 eğilim aynı kalır. Kişisel sapma yalnız PRF_ALT sırasına bağlıdır (:100, :114). Bu adımda onları okuyan kod yok.

**(4) `falsoProfil` = 0.**
- Eğri fk ile çarpılır: fk = clamp(1 + falsoProfil·(1,5·(pas − p̄) + 0,4·falsoluPas), 0,5, 1,7).
- Çarpıldığı yerler: yerden pas yerPasVur `eg` (js/mac-topla.js:538) ve uzun hava pası havaPasVur (:558).
- p̄ = 0,62: C4'ten sonraki saha oyuncularının ortalama pas'ı (veri sabiti, anahtar değil).
- Orta ve korner (:556), uzaklaştırma ve degaj dokunulmaz. Çekiliş sayısı ve nişan düzeltmesi (:539) aynı.

**(5) `uzunEgilim`, `cikisEgilim` = 0.**
- profilEgilimPuani'nin 'pas'/'uzun' dalı (:133) bloğa açılır. ileri = (s.hx − m.ball.x)·d, u = m.ball.x·d.
  - `uzunEgilim` açıksa: + g·uzunEgilim·e.uzunPasAtar·clamp((s.L − 28)/12, 0, 1), ileri ≥ 0 ise.
  - `cikisEgilim` açıksa: + g·cikisEgilim·0,5·e.oynayarakCikar, u < −10 ve ileri ≥ 10 ise.
- 'tasi' (:134): + g·cikisEgilim·0,5·e.oynayarakCikar, u < −10 ve s.mesafe ≥ 5 ise.
- `s.L` js/mac-karar.js:514'te, `s.mesafe` :309'da tanımlı. İşlev saf kalır.

**Ölçü ve kabul.**
- Ölçü: `node araclar/mac-deneme.js 4`; `node araclar/ad-denetimi.js`; arka planda `node araclar/oturum-sonu.js araclar/taban/b.json --ayni --mac 24`.
- Kabul: 24/24 aynı; çekirdek 10 senaryo geçiyor; ad denetimi temiz (`varlik` değişmedi); index.html değişmedi.
- Risk: cebirce eşit bir yeniden yazım son haneyi değiştirebilir. Eski yol harfi harfine eski ifadeyi kullanır.

### C4 — TEST kadro profilleri: büyütmeden yeniden şekillendirme (~30 dk + ~25 dk arka planda)

Yalnız js/kadrolar.js'teki `oz` değerleri değişir: 13 oyuncu, Demirkapı satırları 19-27, Akdeniz satırları 47-54. Adlar, numaralar, görünüş, ayak, kaptan, taktik ve yedekler aynı kalır. `kayit.rol`, `kayit.egilimler` ve `kayit.form` yazılmaz; yazılsa p-tip takasını ve ±0,2 denemesini anlamsız kılar. Roller özelliklerin şeklinden gelir.

Hedef değerler (özellik sırası hız, pas, şut, kafa, sürüş, müdahale, görüş, karar, dayanıklılık, sertlik):

| Profil | Demirkapı | Akdeniz (karşı kanat ya da başka yuva) |
|---|---|---|
| Hızlı kanat (`cizgiKanadi`) | Oğuz #7 SĞK: hız 91, sürüş 80, pas 56, görüş 55, şut 55, karar 56, kafa 42 | Yılmaz #11 SLK: hız 91, sürüş 80, pas 56, görüş 55, şut 55 |
| Karşıt kanat | Bülent #11 aynı | Halil #7 → `oyunKuranKanat`: pas 78, görüş 76, hız 68, sürüş 68, dayanıklılık 64, şut 52 |
| Uzun paslı 6 (`oyunKurucu`) | Metin #6 MO derin: pas 78, görüş 74, dayanıklılık 66, kafa 60, müdahale 66, sertlik 69 | Fikret #8 MO: pas 82, görüş 78, müdahale 50, dayanıklılık 66, sürüş 63 |
| Karşıt merkez | Selçuk #8 aynı | Sadi #6 → `kesici`: müdahale 74, sertlik 71, pas 63, görüş 60 |
| Falsolu 10 (`derineGelen`) | Erdal #10: pas 80, görüş 80, şut 75, hız 73, dayanıklılık 58 | Levent #10: pas 78, görüş 78, şut 72, hız 70, kafa 50, dayanıklılık 63 |
| Hava hâkimi 9 (`hedefForvet`) | Kadir #9: kafa 86, sertlik 66, şut 70, karar 63, görüş 57 | Orhan #9: kafa 87, sertlik 66, hız 58, sürüş 52, şut 71 |
| Oyun kuran stoper | Cengiz #5: pas 74, görüş 70, sürüş 58, müdahale 68, kafa 68, sertlik 58, karar 70, dayanıklılık 65, şut 38 | İlyas #5: pas 74, görüş 66, sürüş 52, müdahale 67, kafa 68, sertlik 57, karar 62, dayanıklılık 54, şut 34 |
| Karşıt stoper | Ziya #4 `sertStoper`: hız 49, sertlik 79, müdahale 74 | Turgut #4 aynı |

**Kurallar.**
- Her oyuncunun 10 özelliklik ortalaması bugünküne göre ±1 içinde kalır (hesaplanan farklar −0,6 ile +0,7 arası). Takım gücü ve kariyer kulübünün seviyesi değişmez.
- Saha oyuncularının hız aralığı 0,49–0,91 olur.
- Senaryoların kullandığı yuvalar (Demirkapı 6, 7, 8, 9; Akdeniz 0, 2, 3, 4, 6): yalnız imza özelliği değişir, ötekiler ±3 içinde kalır.
- Roller hesapla doğrulandı, fakat kişisel sapma ±0,08'dir. Rol tutmazsa değer ±3 içinde düzeltilir.

**Ölçü.**
- Bir kerelik profil dökümü (scratchpad'de bir betik; maç kurulur, adım atılmaz): rol ve en belirgin üç eğilim, κ = 0 ve κ = 1 ile.
- `mac-deneme 4`.
- Arka planda `node araclar/mac-deneme.js 40 1 --karsilastir araclar/taban/b.json --json araclar/taban/c-veri.json` (yerel).
- Ardından `node araclar/oturum-sonu.js araclar/taban/c-veri.json --seyrek --mac 8 --ayni`. Veri birçok senaryonun aktörünü değiştirdiği için bütün senaryolar koşar.

**Kabul.**
- Hedef roller iki takımda da şekilden çıkıyor.
- c-veri'de sağlık aralığı dışında 0 satır.
- Senaryo kapıları geçiyor. Veriden düşen kapı için ya veri ±3 içinde düzeltilir, ya da senaryo aktörünün bugünkü özelliklerini kendi içinde sabitler (kapı ve motor değişmez). Hangisi yapıldıysa devam notuna yazılır.

### C5 — Eğilim gürültünün üstünde ve seviyeden bağımsız (~30 dk + 13 dk arka planda)
- `egilimGoreli` 1 yapılır, `egilimGuc` taranır: {1,0, 1,5}. Değerler `MAC_DENEME_AYAR` ile verilir.
- Seçilen değer js/mac-profil.js:19'a yazılır, kararı MAC_MOTORU §3'e.
- `egilimGuc` js/mac-karar.js:894'teki tek vuruşu da ölçekler.
- **Ölçü.**
  - Her iki değerle `--senaryo p-tip` (~3 dk her biri).
  - Profil dökümünde ±0,12 seviye dönüşümü.
  - Bayrak değiştirilmeden önce `ESKI` ile `mac-deneme 4 --karsilastir c-veri.json --ayni`.
  - Seçilen değerle arka planda `node araclar/mac-deneme.js 40 1 --karsilastir araclar/taban/c-veri.json`.
- **Kabul.**
  - Gürültü satırı ≥ 1,0.
  - Kapılı dört çiftin en az üçünde TVD ≥ 0,15; kanat çifti şart.
  - Her kapılı çiftte seviye TVD < ½ × profil TVD.
  - Dökümde aynı şeklin ±0,12'si: ortalama |Δeğilim| ≤ 0,10 ve rol aynı. Bugün bu fark 0,31–0,37.
  - 40 maç: sağlık aralığı dışında 0 satır. B0 satırları (`b0Zincir`, `b0Ileri`) c-veri'den 2 standart hatadan fazla kötü değil.
  - İki değerden geçen daha küçüğü alınır. İkisi de geçmezse sağlığı tutan değer alınır ve sonuç yazılır; üçüncü bir değer denenmez.

### C6 — Geniş hız aralığı (~15 dk)
- `hizAralik` = [5.75, 3.4, 10.6] (js/mac-hareket.js:20).
- 0,65 hızda sonuç bugünküyle aynı (7,96 m/sn). En hızlı oyuncu (hız 0,91) 8,84 m/sn, en yavaş (0,49) 7,42 m/sn. Kaleciler eski eğimle kalır.
- Saha ortalaması +0,015 m/sn değişir (C4 verisinden hesap).
- Hız; yarışlara, sürüklemeye (vC = maxSpd·0,88; js/mac-karar.js:331), pas güvenliğine ve bire bire `varisZamani` ile yayılır. Gerçek referans: 1. ligde ortalama tepe hız 8,91 m/sn (MAC_MOTORU Ek E).
- Ölçü: KAPILAR satır 19 (`c-kanat`, `c-orta`, `c-1v1`, `c-hareket`) ve `c-surus`, `c-hava`; `mac-deneme 4` ve c-oyuncu tepe hızı; önce `ESKI` `--ayni` 4/4.
- Kabul: Oğuz ve Yılmaz tepe hızda ≥ 8,7 m/sn, en yavaş saha oyuncusu ≤ 7,5. Senaryolar geçiyor ya da farkları yazıldı. Sağlık C7'nin birleşik koşusunda ölçülür.

### C7 — Falso, uzun top ve oyun kuran stoper oyuncuya bağlanır (~30 dk + 13 dk arka planda)
- `falsoProfil` 1, `uzunEgilim` 1, `cikisEgilim` 1.
- 2D'de beklenen görüntü:
  - 10 numaraların ara pası belirgin kıvrık iz bırakır;
  - 6'nın 30 m'yi aşan pasları havalanır ve uzak tarafta iniş halkasına düşer;
  - oyun kuran stoper topla orta sahaya çıkar, uzaklaştırmak yerine ileri oynar.
- Hava 9'u yalnız veriyle ve mevcut hedef topu ve düello modeliyle çalışır (js/mac-karar.js:478-485).
- Ölçü: KAPILAR satır 30 (`b-pas`, `c-orta`, `c-kanat`, `t-top`, `d-duran`) ve `z-s14`; arka planda `node araclar/mac-deneme.js 40 1 --karsilastir araclar/taban/c-veri.json` (bütün C anahtarları açık; nabız commit'i atılır).
- **Kabul.**
  - Erdal ve Levent'in falso endeksi ≥ 1,4; pas'ı düşük oyuncularınki ≤ 0,85.
  - Genel ortalama |egri| (L ≥ 18) c-veri'nin ±%10'u içinde. Daha düşükse anahtar kapalı kalır ve kullanıcıya sorulur.
  - c-oyuncu kapısı (oran ≥ 1,5, alt uç > 1) beş profilin en az üçünde geçer: Metin ve Fikret uzun ileri pas, Cengiz ve İlyas ileri pas ile taşıma (uzaklaştırma payı düşük), Oğuz ve Yılmaz geçti ile ≥ 15 m taşıma, Kadir ve Orhan çekişmeli kafa.
  - Sağlık: 0 "!" satırı, uzun pas %8–30, pas isabeti %65–90. B0 satırları kötüleşmemiş.
- Sağlık düşerse, ek 40 maçlık koşu başına bir anahtar kapatılarak suçlu bulunur (en çok iki koşu). Kendi kapısından düşen anahtar 0'da kalır. Öbür anahtarlar telafi için ayarlanmaz.

### C8 — Kabul ölçüleri, belgeler, oturum sonu (~45 dk; karne arka planda ~25 dk)
- **Ölçü.**
  - `--senaryo p-seviye` (bütün kollar).
  - `node araclar/oyuncu-karnesi.js 40 1 --duyarlilik` (tek süreç, arka planda).
  - `node araclar/oturum-sonu.js araclar/taban/c-veri.json --mac 24`.
  - `ESKI` ile `--ayni` 8/8, c-veri'ye karşı.
  - `git diff --stat tur/b..` : `js/ekran-*`, `js/pul.js`, `js/stil-99.js`, `js/test-gorunum.js` ve `index.html` değişmemiş olmalı (ekranda rakam yok).
- **Belgeler.**
  - MAC_MOTORU §3: anahtarlar, değerleri ve gerekçeleri.
  - FUTBOL_KUTUPHANESI §12.1 C satırının durumu ve §12.4 satırı.
  - KAPILAR: satır 18'e `p-seviye`, `c-oyuncu` ve yeni [7b] satırları; hız satırı; satır 30'a `falsoProfil` ve `uzunEgilim`.
  - YOL_HARITASI "Geçerli kararlar" (tarihli özet) ve devam notu.
- Son olarak protokol 5: "boşta" satırı.

### C9 — Kapanış (aynı oturumda yalnız C8 3 sa 30 dk içinde biterse; değilse ayrı oturum, tercihen masaüstü)
- Yeni taban: `node araclar/mac-deneme.js 40 1 --karsilastir araclar/taban/b.json --json araclar/taban/c.json`.
- `node araclar/oturum-sonu.js araclar/taban/c.json --seyrek`.
- Hız bütçesi: `git worktree add --detach <klasör> tur/b` ve `node araclar/hiz-olcum.js 2 --tekrar 8 --kok <klasör>`. Dizüstü sonucu geçicidir, kesin kabul masaüstündedir. Klasör sonra silinir.
- `node araclar/oyuncu-karnesi.js 80 1 --duyarlilik` (KAPILAR:18; ~50 dk, masaüstünde ya da gece).
- `python -X utf8 araclar/kontrol.py`, `python -I -X utf8 araclar/akis-2d.py`.
- `tur/c` etiketi. `main`'e alma yalnız bütün kapılar geçtiyse ve kullanıcının kayıtlı oto mod isteğine göre (YOL_HARITASI.md:23; açık soru 6). Son iş "boşta" satırı.

## Kabul (tur)
1. **±0,2 → ilkel ve davranış sıklığı.**
   - Karne 40 maçta (yön): yeni satırlardan en az ikisi oran ≥ 1,25 ve alt uç > 1 (pas → uzun ileri pas; pas ve görüş → ilkel başlatma; hız → geçti).
   - Eski dört kapı geçiyor.
   - Kesin kapı C9'daki 80 maç.
2. **Aynı sahne, iki profil.** p-tip'te kapılı dört çiftin en az üçünde TVD ≥ 0,15 (kanat şart). p-seviye S1 ve S2'de profil sonuç TVD ≥ 0,15.
3. **Aynı sahne, iki seviye.**
   - p-seviye S1 ve S2: güçlü − zayıf başarı ≥ 10 puan, eşli %95 aralığı > 0.
   - Belirsizlik korunuyor: zayıf ≥ %10, güçlü ≤ %90.
   - c-hava güçlü × orta %70–88.
   - Zihniyet aynı: seviye TVD < ½ × profil TVD.
4. **Oyuncu görünürlüğü.** c-oyuncu kapısı 5 profilin en az üçünde geçer (§11.3 madde 4'ün Claude ölçüsü). Son söz kullanıcının gözünde.
5. **Sağlık ve zihniyet.** 40 maçta sağlık aralığı dışında 0 satır; B0 satırları kötüleşmemiş; falso payı ±%10 içinde.
6. **Bütünlük ve görüntü.** Ekranda rakam yok. Anahtarlar eski değerdeyken `--ayni` tutuyor. Hız bütçesi C9'da.

## Yapılmayacaklar
- **Veri modeli.** 12. özellik yok, `varlik`'e alan yok, PRF_ROLLER'e yeni rol yok, `kayit.rol`, `kayit.egilimler` ve `kayit.form` ile sabitleme yok.
- **Ad ve kulüp.** Hiçbiri uydurulmaz. Güçlü ve zayıf yalnız araçların içinde ±δ'dır. js/kadrolar.js'te yalnız 13 oyuncunun `oz` değeri değişir.
- **Falso ve pas planlayıcısı.**
  - Orta, korner, uzaklaştırma ve degajın eğrisine dokunulmaz (c-orta ve d-duran riski).
  - Şuttaki falso ve trivela eğilimi Z6-2'ye kalır.
  - Pas planlayıcısı eğriyle adam atlatmayı seçmez: pasAnaliz eğriyi bilmiyor, iş D'nin (V1c) eğri tablosuyla birlikte yapılır.
- **Ancak kapı düşerse sonraki iş:** kanat sürüklemesinin profile bağlanması (`surukleKanat`, js/mac-karar.js:338), hava 9'una pasör tercihi, `ILK_KAPI`'nın tablodaki `kapi` alanına bağlanması (js/mac-ilkeller.js:14, :39).
- **Motorda dokunulmayanlar:** hrkSabit'in A0 tavanı; kadro taktiğinin `sakin`, `direkt`, `pres` ve `tempo` değerleri (B3'ten beri etkisiz).
- **F'ye kalanlar:** lig referansları, kariyer bağlantısı, TEST kutusunda rol adı, ekranda herhangi bir etiket.
- **Ayar ve ölçek.** `egilimGuc` iki değerden fazla taranmaz; gol ya da tarz kenarı ayarlanmaz. Oturumda 80 veya 160 maç koşmaz (C9'un karne 80'i hariç).
- **Süreç.** Kabul sahnesi üretilmez. B açıkken C başlamaz.

## Riskler
- **κ = 1 takım çapındaki pozitif kaymayı siler.** Takım ortalamaları bugün oldurucuPas +0,36, topuAtipKosar +0,42, cizgiyeIner +0,53; sonra hepsi ≤ 0,25 olur. B'nin ayarı bu kaymayla yapıldığı için ara pası, taşıma ve orta azalabilir. Eğilim hareket ve müdahalede de okunur (js/mac-takim.js:342; js/mac-mudahale.js:458, :470), bu yüzden faul ve kart satırları kayabilir. Sağlık düşerse κ 0 kalır; telafi edici ayar yapılmaz.
- **Gol tavanı.** B kapanışında gol 4,0'a yakınsa hız ve eğilim gücü sınırı aşabilir. O zaman suçlu anahtar kapalı kalır.
- **Falso planlayıcıda görünmüyor.** Güçlü eğri kesilmeyi artırabilir; 1,7 tavanı ve isabet satırı bunu bekler.
- **Veri senaryoları kaydırıyor.** Senaryolar sabit yuvalar kullanıyor (c-1v1 [0][9]/[1][3], b-pas [0][7]/[0][9], c-yariyariya [0][6]/[1][6]). C4'teki aktör kuralı ve senaryonun aktörünü sabitlemesi bunu sınırlar.
- **Seyrek imzalar.** FV ve stoper imzaları 40 maçta seyrek (çekişmeli kafa maç başına ~0,5–1); 40 maç yalnız yön gösterir.
- **Süre.** Dizüstünde C0–C8 yaklaşık 4,5 saat. Kesme çizgisi: C7 3 sa 30 dk içinde başlamadıysa `cikisEgilim`, p-seviye'nin S3 ve S4'ü ve C9 sonraki oturuma kalır; anahtarları eski değerde commit edilir.

## Doğrulama
- **Her adım.** `mac-deneme 4` ("sonuç aynı"); değişenin KAPILAR satırı; `ESKI` ile `--ayni`. Taban C4'e kadar `b.json`, sonra `c-veri.json`. C1 ve C3'te ayrıca `ad-denetimi`.
- **Oturum sonu (C8).** `oturum-sonu c-veri.json --mac 24`, p-seviye, karne 40.
- **Kapanış (C9).** Yukarıdaki liste. Kullanıcı `index.html?ekran=mac` ile 2D'de izler.

## Kullanıcıya kalan açık sorular

**Durum (2026-10-23, F0):** 1 ve 4 izleme yan hattına (kullanıcı izledikçe); 2 falsonun büyüklüğüyle birlikte izleme notlarına (D'de `pasEgriKat` 2,0 oldu); 3 izlemeye; 5 değişmedi (2 saatlik eşik kaldı); 6 kapandı (C, D ve E `main`'e alındı); 7 F1'de: üretilen kadroların adlarını Claude TEST verisi olarak yazar (YOL_HARITASI karar 33).
1. Seviye etkisinin maç düzeyindeki büyüklüğü bir denge kararıdır (B'deki tarz kenarı gibi). C yalnız sahnede yönü ölçer; maç düzeyindeki farkı bilgi olarak basar. İstenen bir büyüklük var mı?
2. Falso oyuncuya bağlanınca genel falso payı %10'dan fazla düşerse `falsoProfil` kapalı kalır. Yine de bağlansın ve `pasEgriKat` mı artırılsın, yoksa kapalı mı kalsın?
3. Demirkapı'nın profil dağılımı (hızlı kanat Oğuz sağda, uzun paslı 6 Metin, falsolu 10 Erdal, hava 9'u Kadir, oyun kuran stoper Cengiz; adlar ve seviye aynı) uygun mu, yoksa kulübe özel bir tat isteniyor mu?
4. Hızlı kanadın ~%10 daha hızlı olması (8,8 m/sn'ye karşı 8,0) 2D'de doğal mı görünüyor, yoksa "arcade" mi? İzledikten sonra.
5. Nabız en çok 45 dakikada bir atılınca CLAUDE.md:56'daki 2 saatlik "kesildi" eşiği 90 dakikaya insin mi? Bu bir kural değişikliği.
6. C, kullanıcı izlemeden `main`'e alınsın mı (YOL_HARITASI.md:23'teki oto mod isteği bunu söylüyor), yoksa onay gelene kadar dalda mı kalsın?
7. İleride F'nin lig referansları için adlı güçlü ve zayıf test kadroları isteniyor mu? Adlar ve kulüp kullanıcıdan gelir.

Adlar doğrulandı: profilKur, profilRolSec, profilEgilimPuani, profilEgilim, profilOzet, PRF_EGILIMLER (js/mac-profil.js); oyuncuKur (js/mac-motoru.js:330-336), yedekleriKur (js/mac-kurallar.js:51-58); hrkSabit, hrkHazirla, hrkCeviklik (js/mac-hareket.js:142-151); yerPasVur, havaPasVur (js/mac-topla.js:524, :548); pasAdayiTam, kararVer0, tekVurusKarari0 (js/mac-karar.js:497, :854, :871); senaryo-ortak'ın kur, bosalt, yerlestir, topVer, oyunda, dizilis ve ayar işlevleri; olaylar `pass`, `header` (cek), `calim`, `plan`, `kosu` (verKac). Önerilen yeni adlar (henüz yok): `oyuncuTepeHiz`, `profilDegis`, `c-oyuncu.js`, `p-seviye.js`, anahtarlar `egilimGoreli`, `hizAralik`, `falsoProfil`, `uzunEgilim`, `cikisEgilim`.