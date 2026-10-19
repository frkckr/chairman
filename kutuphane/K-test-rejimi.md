# K — Test ve denetim rejiminin envanteri (Z0, 2026-10-19)

Salt okuma envanteri; A9 kapanışı (`main` 9530cb5) ve `araclar/` üzerinden. Hiçbir test koşturulmadı; tek hesap `araclar/taban/t23.json`'daki 80 maçlık sonuçlardan ortalama ve σ ("(hesap)" işaretli). "(tahmin)" işaretli süreler belgede yok, koddan ve deneme sayısından çıkarıldı. Satır numaraları o güne aittir. Öneri ve karar [FUTBOL_KUTUPHANESI §11](../FUTBOL_KUTUPHANESI.md#11-ölçüler-ve-test-rejimi-öneri)'dedir; bu dosya yalnız bulgudur.

## 0. Özet

1. **Rejim üç kademe** (CLAUDE.md "Kontrol"): hızlı (`mac-deneme.js 4` + ilgili senaryo + gerekirse `ad-denetimi`/`kariyer-deneme`, ~20 sn); oturum sonu (`oturum-sonu.js` = ad-denetimi + 40 maç `--karsilastir` + 23 senaryo; belgede ~3 dk — ölçülen masaüstü 182–195 sn, dizüstü 749 sn (T17) ve 1581 sn (T18, 80 maçla eşzamanlı)); tur kapanışı (80 maç, bütün senaryolar, robotluk ve duyarlılık karneleri, hız bütçesi, koşullu Python araçları).
2. **Envanter:** 16 Node aracı/kipi; 23 senaryo (22'sinde kapı, `b-pas` yalnız bilgi); 21 `olcumler/` eklentisi (en az 65 hedef etiketli satır); 8 Python aracı.
3. **Çıkış kodunu yalnız şunlar bozar:** senaryo kapıları; tekrarlanabilirlik ve `--ayni` (mac-deneme.js:335, 350); ad-denetimi, ikiz-deneme, kariyer-deneme. 40/80 maçın `HEDEF` ve eklenti "hedef T…" satırları "!" basar ama çıkış 0 kalır (mac-deneme.js:306-322).
4. **TEKNIK_PLAN §8'de hedef tablosu yok;** bantlar `araclar/mac-deneme.js:62-84`'te (21 satır, U1 kuralı) ve eklentilerin `[alt,üst,'T..']` etiketlerinde; §8 yalnız tur tur düzyazı (TEKNIK_PLAN.md:419-461).
5. **Süre baskın kalemleri** (dizüstü, son-oturum.txt): 40 maç 828 s (toplamın %52'si); `d-duran` 664 s (senaryo toplamının %25'i; havuzun duvar saatinin alt sınırı); `d-topcu` 409 s, `v-sut` 207 s, `p-tip` 193 s.
6. **Örtüşme:** `r-karne` ↔ `k-duran` aynı duran top satırları; `c-surus` ↔ `a-akis` aynı "top arkada" tanımı; `c-yariyariya` ↔ `c-donen` aynı Δ eğrisi; `d-sut` ↔ `v-sut` ↔ `d-penalti` aynı kaleci–şutçu kurulumu.
7. **Pahalı ama seyrek değişeni koruyanlar:** `d-topcu` (12 tam maç); `m-isinma` + `m-fotograf` ~256 s (korudukları `mac-senaryo.js` 2026-10-04'ten beri 1 commit, `mac-oncesi.js` 4); `o-sakatlik` (4 commit), `p-tip` (4 commit). Karşılaştırma: toplam 172 commit, `mac-motoru.js` 66, `mac-topla.js` 47.
8. **Gürültüsü bandından büyük ya da eşit kapılar:** `d-duran` korner %3–5 (1600 kornerde ±0,53, gerçek %4,6–5,2); `d-sut` üst köşe ≤ %25 (σ ≈ 2,5); `c-temas` [2] (SE ~8,7 ↔ tolerans 8); kırmızı kart bandı 40 maçta tek başına ~%23 olasılıkla "!" (hesap); ikinci yarı gol payı 240 maçta σ ≈ 1,9, 40 maçta σ ≈ 5.
9. **Hız bütçesi** (≤ +%10) süreçler arası ±%17 (masaüstü) / ±%35 (dizüstü) oynadığından aynı süreç yöntemi eklendi; T23'te yine [−2,5 … +21,3]. Tam protokol ≈ 12–15 dk makineyi dışlayan süre (tahmin), paralel iş yok.
10. **Yeniden kullanım:** `olcumler/` eklenti sözleşmesi; senaryo kurulum kalıbı (`kur/bosalt/yerlestir`); `p-tip` donmuş sahne karar örnekleme; `oyuncu-karnesi` karar izi; görev etiketi (`p.gorevAd`) ölçümleri; `--dizilis`, `MAC_DENEME_AYAR`. Tam bir olay günlüğü yok: olaylar yalnız `this.on(ad,v)` akışı ve `m.kayit` özeti.

## 1. Tablolar

### 1.1 Kademeler (CLAUDE.md "Kontrol")

| Kademe | Ne koşar | Süre | Kaynak |
|---|---|---|---|
| Hızlı (her düzenlemeden sonra) | `node araclar/mac-deneme.js 4` ("sonuç aynı" olmalı); değişenin senaryosu `--senaryo <ad>`; yeni betik/üst düzey ad/`Match` yöntemi → `ad-denetimi.js`; kariyer kuralı → `kariyer-deneme.js` | ~20 sn (M0 sonucu ~21 sn; hedef ≤ 45 sn) | CLAUDE.md hızlı kademe |
| Oturum sonu (yerel commit öncesi) | `node araclar/oturum-sonu.js [taban] [--ayni]`: ad-denetimi → 40 maç `--karsilastir` → bütün senaryolar (havuz `floor(cpus/2)`). Animasyon/ekran dosyasına dokunulduysa ayrıca `kontrol.py` | ~3 dk (belge). Ölçülen: masaüstü 182 s (T18), 184 s (M3, `--ayni`), 195 s (T19, `--ayni`); dizüstü 749 s (T17 kapanışı), 1581 s (T18 kapanışı, 80 maçla eşzamanlı) | CLAUDE.md oturum sonu |
| Tur kapanışı (`main`'e almadan, bir kez) | 80 maç `--karsilastir` + robotluk karnesi; bütün senaryolar; ekran/kamera/animasyon dokunulduysa `kontrol.py`, `akis-deneme.py`, `an-yakala.py` önce/sonra; `oyuncu-karnesi.js 80 1 --duyarlilik`; hız bütçesi; çizime dokunulduysa animasyon ölçümü + yeni animasyon tabanı | Belgede toplam yok (tahmin: saat mertebesi) | CLAUDE.md tur kapanışı |
| Kural | 4/10 maçla denge kararı verilmez; 40 yön gösterir; denge kararı 80 maçla; 40 maç `--karsilastir` yalnız denge okuması gereken `MOTOR_AYAR`/karar değişikliğinde ve soru başına en çok iki tarama değeriyle; 80 maç yalnız tur kapanışında | | CLAUDE.md test kademeleri |

### 1.2 Node araçları

| Ad | Komut | Ne ölçer / neyi kapı yapar | Koşan (koddan) | Süre | Zorunlu (CLAUDE.md) | Kademe |
|---|---|---|---|---|---|---|
| mac-deneme (kısa) | `node araclar/mac-deneme.js 4` | `HEDEF` tablosu + ~190 bilgi satırı; kapı = tekrarlanabilirlik: ilk tohum ayrı işçide 2× oynatılır, ≤ 10 maçta yalnız ilk 3 dk, 18 kontrol noktası (mac-deneme.js:260, 278-280, 290, 329-335) | 4 maç + 1 tekrar işçisi | ~20 sn (belge) | Maç motoru/kadro değişince; her düzenlemeden sonra | hızlı |
| mac-deneme 40 | `node araclar/mac-deneme.js 40 1 --karsilastir araclar/taban/t23.json [--ayni]` | Eski/yeni ortak tohumda ölçüt farkı ± SE (352-359). `--ayni`: tohum başına FNV parmak izi, farklıysa ilk ayrılan kontrol noktası, çıkış 1 (345-350). Başarılı çıkış denge onayı değildir | 40 maç, her biri ~84 205 adım (23,4 gerçek dk) | Oturum sonu içinde 828 s (dizüstü, eşzamanlı); masaüstü ≈ 1–2 dk (tahmin) | Oturum sonu; denge okuması için seyrek | oturum sonu |
| mac-deneme 80 | `node araclar/mac-deneme.js 80 1 --karsilastir <önceki taban>`; yeni taban `--json araclar/taban/<tur>.json` | Denge kararı + tur kabulü (robotluk karnesi dahil) | 80 maç | M0'da 144 sn (10 dk maç, eski motor); bugün ≈ 2–4 dk masaüstü (tahmin) | Tur kapanışı | tur kapanışı |
| mac-deneme 160/240 | `node araclar/mac-deneme.js 240 1 …` | Seyrek/dar ölçü: ikinci yarı gol payı (T12d, T16c, T26), korner (160) | 240 maç | 80 maçın ~3 katı (tahmin) | Tur kabulünde bir kez | tur kapanışı (özel) |
| mac-deneme senaryo | `node araclar/mac-deneme.js --senaryo <ad> [N] [tohum]` | Bölüm 1.3 | tek süreç, sıralı | Bölüm 1.3 | Senaryo kapıları listesi | hızlı + oturum sonu |
| oturum-sonu | `node araclar/oturum-sonu.js [taban] [--mac N] [--senaryo a,b] [--ayni]` | Özet + `son-oturum.txt` (gitignore'da); "!" satırlarını sayar (oturum-sonu.js:39-48) | ad-denetimi → mac-deneme 40 → 23 senaryo (havuz `floor(cpus/2)`, alfabetik: oturum-sonu.js:19, 36) | Bölüm 1.1 | Commit öncesi | oturum sonu |
| ad-denetimi | `node araclar/ad-denetimi.js` | (a) aynı üst düzey ad/işlev (b) `Match` yöntem çakışması (c) çizim motora yazmıyor (d) motorda `Math.random`/`rnd(` yok (e) `MOTOR_AYAR` bildirim/sahiplik (f) V8 hızlı kip, `varlik` 128 alan sınırı (ad-denetimi.js:3-17) | 64 betik statik tarama + alt süreçte 1200 adım | 2,5–3 sn | Yeni betik/ad/`Match` yöntemi | hızlı + oturum sonu |
| ikiz-deneme | `node araclar/ikiz-deneme.js [maç=4] [tohum=1] [--oncesi N] [--esit]` | Tek başına ↔ ikizli oynatmada parmak izi, olaylar, maç sonu kaydı aynı mı; ikiz sapması 0; ×1/×2/×4 izleme süresi; çıkış 1 = aynılık bozuk | 4 tohum × 2 oynatma | ~30–60 sn masaüstü (tahmin) | `mac-izleme.js`, `macSuresiDk/saatCarpani/sureOlcek`, modül düzeyi ortak durum | koşullu |
| hiz-olcum | `node araclar/hiz-olcum.js 3 --tekrar 5 [--kok KLASÖR] [--ayarlar JSON] [--profil]` | Tek süreç ms/1000 adım; bütçe ≤ +%10, mutlak tavan 250 ms | 3 maç × 5 tekrar sıralı (`--kok`: 2 maç × 8 tur × 2 motor + ısınma ≈ 36 maç) | masaüstü ~32 ms/1000 adım; dizüstü ~97 ms; ölçüm başına ~40 s – 2 dk (tahmin) | Tur kapanışı | tur kapanışı |
| hiz-evre | `node araclar/hiz-evre.js KLASÖR [8] [2]` | İki motorun adım süresi `m.phase` evresine göre; gol/duruş sayısı farkını koddan ayırır | 8 maç × 2 tur × 2 motor + ısınma ≈ 48 maç (tahmin) | ~2 dk masaüstü (tahmin) | Gol/duruş sayısı değiştiren turda | tur kapanışı (koşullu) |
| oyuncu-karnesi | `node araclar/oyuncu-karnesi.js 80 1 --duyarlilik` | Karar izi [1]-[5], [9]; oyuncu tablosu; Pearson r; `--duyarlilik`: ±0,2 özellik → davranış oranı ≥ 1,25 ve alt uç > 1 kapısı (oyuncu-karnesi.js:122-141) | 80 maç tek süreçte, `kararVer` sarılı | ~5–8 dk dizüstü (tahmin) | Tur kapanışı; profil kapısı p-tip ile | tur kapanışı |
| kariyer-deneme | `node araclar/kariyer-deneme.js` | 10 bölüm: veri sözleşmesi, takvim, para, kayıt, içeriksiz kariyer, ajanda/olay/karar (TEST içerik), kayıt oturumu, gözlem, bozuk kopya; "!" veya çıkış ≠ 0 = hata | maç yok | hızlı | Kariyer dosyaları değişince | hızlı |
| motor-yukle (kütüphane) | `require('./motor-yukle')` | `index.html` sırasıyla motor dosyalarını vm bağlamına yükler; `ayarUygula`; `MOTOR_KOK` | – | – | – | altyapı |
| test-icerik (kütüphane) | `araclar/test-icerik.js` | `kariyer-deneme.js` ve `akis-deneme.py` için TEST konusu | – | – | – | altyapı |

**`mac-deneme.js` seçenek ve ortam envanteri:** `[sayı]` (40), `[ilk tohum]` (1); `--karsilastir DOSYA`, `--ayni`, `--json DOSYA`; `--senaryo AD [N]`; `--isci N` / `MAC_DENEME_ISCI` (varsayılan `floor(cpus/2)`); `--tam-tekrar`; `--dizilis A,B` / `MAC_DENEME_DIZILIS`; `MAC_DENEME_AYAR='{"anahtar":değer}'` (bilinmeyen anahtar çıkış 2); teşhis bayrakları `MAC_DENEME_TEMAS=1`, `_IVME=1`, `_FIRSAT=1`, `_GECIS=1`, `_SUTLAR=<dosya>`; dahili `MAC_DENEME_TOHUMLAR`, `MAC_DENEME_TEKRAR`; yükleyici `MOTOR_KOK`, `MOTOR_YUKLE_ESKI=1`, `AD_DENETIMI_KOK`; senaryo içi `KORU_DOK`, `TEMAS_DOK/IZ*`, `SENARYO_AYRINTI`, `C_HAREKET_JSON`.

### 1.3 Senaryolar (23)

Süre: `son-oturum.txt` (2026-10-16, T18 kapanışı, dizüstü i7-8565U, 80 maçla eşzamanlı; 22 senaryo, `c-surus` yok). Yüzde 22 senaryonun toplamına (2635 s) göre. Hepsi oturum sonunda ve tur kapanışında koşar; ilgili kod değişince hızlı kademede de.

| Senaryo | Ne ölçer / kapı | Deneme (koddan) | Süre (dizüstü) | Hangi değişiklikte zorunlu |
|---|---|---|---|---|
| b-pas | Pas tamamlama ızgarası (uzunluk × baskı) + ilk dokunuş ızgarası; **kapı yok** (b-pas.js:79) | 600 pas + 1200 dokunuş | 77 s (%2,9) | Gelişine oyun, santra, pasın eğrisi/uzun top/orta |
| c-1v1 | Bire bir: [1] geçme %30–65, beceri eğimi ≥ 15, hücreler %10–85, vazgeçme ≤ %25; [2] \|tahmin−başarı\| ≤ 10; [4a] aldatılma ≥ 1,5×; [4b] yardımcıyla temiz geçiş ≤ 0,75×; [3], [4c], [5] bilgi | 1800 deneme | 74 s (%2,8) | Bire bir/sürüş/savunmacı, taşıma yönleri, Cruyff/sırtla dönme |
| c-donen | Kurtarıştan dönen top: [1] \|Δ\| > 0,3'te önde olan ≥ %85, düzgün azalma; [2] efor > 0,9 ≥ %95 | 1188 | 38 s (%1,4) | Temas/müdahale/faul/hakem; kapı faz/kovalama; kalecinin tutuşu |
| c-hareket | `varisZamani` ↔ `moveP`: hata ortancası ≤ 0,10 sn, %90 ≤ 0,25, \|yanlılık\| ≤ 0,04 | 2000 örnek + 3 dönüş | 6 s (%0,2) | Beden hareketi; gövde dönüşü/bakış; yürüyüş yönü; bakış öncülüğü |
| c-hava | Hava düellosu, 5 kapı (güçlü×orta %70–88, güçlü×zayıf %75–92, koşarak sıçrayan > %50, eşit %40–60, "kafa yok" ≤ %10) | 1800 | 45 s (%1,7) | Hava topu, kafa, orta, kalecinin orta tutuşu |
| c-kanat | Orta saha → kanat: [1] merkeze ≥ %90 ve tarama ≥ 1,5; [2] kanada pas ≥ %40, 6 sn elde ≥ %55; [A] algı denetimi | 160 | 44 s (%1,7) | Takım düzeni/kanat oyunu, taşıma, kalıcılık |
| c-kayma | Kayarak müdahale: kayma kaynaklı faulsüz düşüş > 0 | 360 | 12 s (%0,5) | Temas/müdahale/faul/hakem |
| c-koru | Top saklama, 5 kapı (tutma ≥ 0,8 sn; indirme+dönüş ≥ %55; kayıp ≤ %35; sırtta girişim ≤ %5; güçlü/zayıf ≥ 1,3×) | 160 | 23 s (%0,9) | Top saklama/kalkanlı müdahale; taşıma yönleri; görev kalıcılığı |
| c-orta | Kanattan orta: tahmin ↔ gerçekleşen; havadan orta \|fark\| ≤ 5, türlerde (n ≥ 100) ≤ 10 | 720 | 154 s (%5,8) | Orta kararı, `pasAnaliz` havadan ortası, `havaDuelloTahmin`, orta devam değeri |
| c-surus | Sürüş/alış, 4 kapı ([1] top önde 1,5 m ≥ %95, arkada ≤ %5; [2] 90° dönüşte ≤ 0,2 sn; [3] geri kayma ≤ %10; [4] ≤ %25) | 360 | 15–25 s (tahmin) | Top sürme/alış/vuruşa yaklaşma; alış niyeti |
| c-temas | Ayakta müdahalenin teması: [1] \|tahmin−gerçek\| ≤ 10; [2] adama değen temasta faul payı hızla düzgün artar (tolerans 8) ve arkadan > önden | 2400 | 57 s (%2,2) | Temas/müdahale/faul/hakem |
| c-yariyariya | Yarı yarıya top: Δ ile azalan kazanma eğrisi (5 puan), Δ ≈ 0'da %35–65 | 720 | 38 s (%1,5) | Temas/müdahale/faul/hakem |
| d-duran | Duran top kapısı: korner gol %3–5, kutuda hücumcu 4–7, kısa %10–25, ilk temas hücumda ≥ %30, iniş ≥ %50; serbest vuruş havuz gol/şut %6–10, 18 m şut %60–90, 30 m %20–50, uzak ≤ %10, kenar orta ≥ %60 / şut ≤ %15 / kutu 4–6, baraj 4–5 ve 2–4; penaltı ribaund ≥ %70; taç uzun ≥ %10; kale vuruşu yerden ≥ %99; bilgi 18–22 m ≤ %15 (kalıcı "!") | 1600 korner + 12 × 80 serbest + 57 penaltı + 57 taç + 80 kale vuruşu = 2754 `Match` | **664 s (%25)** | Duran top kodu; blok/sekme fiziği; markajcı; barajlı ikili, korner perdeleme; yorgun hakem |
| d-penalti | Penaltı gol %70–82 (kabul 76–78, 4 × 1600) | 400 atış | 117 s (%4,4) | Kaleci/penaltı, şut türleri |
| d-sut | Yapay şut ızgarası (kaleci): orta alçak ≤ 20 m ≥ %90, üst köşe ≥ 18 m ≤ %25, alt köşe 16 m %35–60; çelme dışa ≥ %60, kendi kalesine ≤ %5, tehlikeliye ≤ %25; kornere ≥ %40 | 6960 şut (3 `Match`) | 90 s (%3,4) | Kaleci, şut türleri/dönen şut, blok, tutuş |
| d-topcu | Top toplayıcılar: 12 maç, NaN yok, zorla teslim yok, atan ≤ 2 m dışı, çocuklar sahaya girmiyor, eski top geri gelmiyor | **12 tam maç** | 409 s (%15,5) | Duran top/top toplayıcı kodu |
| m-fotograf | Takım fotoğrafı/fotoğrafçı: 7 satır N/N | 12 maç öncesi | 122 s (%4,6) | Maç öncesi/devre arası; santra |
| m-isinma | Isınmada kaleciler: 7 satır N/N | 8 maç öncesi | 134 s (%5,1) | Maç öncesi/devre arası; santra |
| o-ofsayt | Yan hakem: [1] açıkta ≥ %95, [2] ucu ucuna hata %10–40, [3] yanlış bayrak > kaçan, [4] geriden hata > hizada, [5] iptal/geçerli/gecikme | 4800 karar + 160 kurulum | 5 s (%0,2) | Ofsayt, yan hakem, gol iptali; yürüyüş yönü/bakış |
| o-sakatlik | 7 kapı: şiddet → derece monoton; kramp yalnız yorgunlukta; tedavi akışı; çıkış akışı; hak yok; kaleci | 1600 kurulum + akışlar | 119 s (%4,5) | Sakatlık/tedavi/hakem topu/değişiklik |
| p-tip | Aynı sahne, farklı profil: kanat deneyi TVD ≥ 0,15 (kapı); stoper bilgi | 90 sahne × 30 × 2, tam maç içinde | 193 s (%7,3) | Profil kapısı (`mac-profil.js`) |
| t-top | Top fiziği: 25 m falsoda 2–4 m; 2 m'den sekme 0,6–0,8 m; durma 30–60 m; planlayıcı–fizik ≤ %5 | analitik | 7 s (%0,3) | Top fiziği |
| v-sut | Vuruş modeli, 7 kapı (güç sapması ≥ 1,8×, beceri ≥ 1,5× ve gol ≥ 2×, zayıf ayak, acele ≥ 1,3×, mesafe–hız, kötü vuruş bantları, aşırtma) | 27 × 800 = 21 600 | 207 s (%7,9) | Vuruş modeli, şutu kapatma, şut türleri |

### 1.4 Eklentiler `araclar/olcumler/*.js` (21)

Hepsi her `mac-deneme.js` koşusunda yüklenir (mac-deneme.js:53), satır basar, çıkış kodunu etkilemez; `g-*` ve `r-ivme` yalnız ortam bayrağıyla açılır.

| Dosya | Ne ölçer | Hedef etiketli satır |
|---|---|---|
| a-akis | T20–T22 topla oyun akıcılığı: sürüşte top arkada, gövde dönük, geri geri, alış → vuruş, gelişine pas/şut, santra, eğrili pas, orta, kanat taşıması, şut türü | 3 (T23) |
| b-olcum | Pas/şut/ilk dokunuş (MM3) + vuruş zamanlaması (T4-V) | 3 |
| c-beden | Müdahale türü/sonucu, omuz, düşüş, faul kaynağı, kart gerekçesi | 0 |
| d-kaleci | Kaleci: çelme sonu, kurtarışın niyeti/tutma payı, tutuştan dağıtıma süre; `ozet()` | 1 (T15) |
| g-firsat / g-gecis / g-temas | Teşhis (bayrakla) | – |
| h-hareket | H1: taşıma yönü, gövde dönüşü, bakış hızı/öncülük | 6 |
| h-hava | Hava topu: yüksek top kaynağı, iniş, ilk temas, düello, kafa, hava faulü | 1 (T6) |
| k-duran | Duran toplar: hazırlık, korner/serbest vuruş düzeni ve verimi, kale vuruşu | 9 (T8) |
| o-olay | Hakem ve maç olayları | 3 (T10) |
| p-kalib | Pas kalibrasyonu: tahmin P ↔ gerçekleşen; 5 puandan sapan dilim "!" | 0 |
| r-ivme | İvmelenme teşhisi (bayrakla), görev tablosu | – |
| r-karne | Robotluk karnesi (Ek F) | 32 + PPDA |
| s-sut | Şut kaynağı, rol/mesafe payı, orta sonucu | 0 |
| t-kanat | T14 kanat ölçüleri | 0 |
| t-takim | T7 takım zekâsı | 3 (T7) |
| v-verim | Gerçekleşen ÷ konum xG, kalecinin kalibrasyonu, blok/şut; `MAC_DENEME_SUTLAR` | 3 (T15, T19) |
| v-vurus | Vuruş: hız/güç/stil, sapma, çerçeve | birkaç (T9b) |
| w-yuruyus | T23-0: yürüme bandında yan+geri, yengeç epizodu | 1 (T23) |
| y-yari | T16-0: yarıya göre oyun süresi, şut, xG, skor; 15'lik dilimler | 0 |

### 1.5 Python araçları

| Ad | Komut | Ne ölçer / kapı | Zorunlu | Kademe |
|---|---|---|---|---|
| kontrol.py | `python araclar/kontrol.py [sayfa]` | Başsız Chromium: konsol/betik hatası ve ekran görüntüsü; kare süresi bilgi | Oyun kodu/görsel değişikliği; animasyon/ekran dosyası; `kayit-deneme.html`; `poz-galerisi.html` | oturum sonu (koşullu) |
| akis-deneme.py | `python araclar/akis-deneme.py [bölümler]` | Gerçek ekranı tıklar: 12 bölüm; başarısız denetim veya sayfa hatası = çıkış 1 | Ekran/kamera/duraklatma/kayıt/`index.html` sırası; hız/şerit → bölüm 18 | tur kapanışı (koşullu) |
| an-yakala.py | `python araclar/an-yakala.py [anlar] [--onek] [--anm]` | Tohumlu an görüntüsü/film şeridi (loca bakışı); görsel inceleme | Kamera/netlik/animasyon; tur kapanışı önce/sonra | tur kapanışı (koşullu) |
| animasyon-olcum.py | `python araclar/animasyon-olcum.py [--karsilastir …] [--once <ad>] [--kosu/--koru/--blok/--duran/--kaleci/--olay N]` | "A:" satırları: ayak kayması, kadans, sıçrama, kırılma, baş, kimlik, eğri, vuruş stili, blok teması… | Animasyon/`STIL.animasyon`/`hareket-egrileri.js` | tur kapanışı (koşullu) |
| titreme-olc.py | `python araclar/titreme-olc.py --karsilastir <önekler>` | Bayer titremesi izi | İnsan modeli (A5) | koşullu |
| yuruyus-yakala.py | `python araclar/yuruyus-yakala.py [--hedef …]` | Odadan balkona yürüyüş şeridi, göz ivmesi | `yuruyus.js`, `oda.js`, `STIL.yuruyus` | koşullu |
| cevre-yakala.py | `python araclar/cevre-yakala.py [--onek]` | Stad çevresi: "Ufukta boşluk kalan yön: 0", çizim çağrısı/üçgen/süre | `stadyum-cevre.js`, `STIL.cevre` | koşullu |
| hareket-egrileri.py | `python -I araclar/hareket-egrileri.py araclar/veri` | Üretici (test değil) | – | – |

## 2. Hedef tablosu (kabul bantları)

### 2.1 `HEDEF` (mac-deneme.js:62-84): 21 satır

U1 kuralı (plan §7 madde 7 U1 eki): 10 dk bandın 2 katı, gerçek maç değeriyle tavanlı. t23: `araclar/taban/t23.json`, 80 maç; `SE80 = σ/√80`; kenara uzaklık = min(ort−alt, üst−ort) / SE80 (hesap). Yorum: üst/alt ≤ 1,6 "dar", 1,6–2,0 "orta", > 2,0 ya da tek yönlü "sağlık sınırı" (karar değil).

| Ölçü | Bant | Gerekçe | t23 ort (σ) | SE80 | Kenara (SE80) | Yorum |
|---|---|---|---|---|---|---|
| Gol | 2,2–3,3 | gerçek lig 2,5–3,3 | 2,60 (1,52) | 0,17 | 2,35 | dar; kenara en yakın ikinci |
| Şut | 16–28 | 8–14 × 2; gerçek 22–28 | 17,45 (4,33) | 0,48 | 3,0 | orta; alt uca yakın |
| İsabetli şut % | 30–45 | — | 37,8 (11,6) | 1,30 | 5,6 | dar |
| Korner | 4–12 | 2–6 × 2; gerçek ~10 | 5,25 (2,36) | 0,26 | 4,7 | sağlık |
| Taç | 10–24 | 5–12 × 2 | 14,9 (3,6) | 0,40 | 12 | sağlık |
| Kale vuruşu | 5–16 | 2,5–8 × 2 | 9,1 (2,6) | 0,29 | 14 | sağlık |
| Faul | 8–18 | 4–9 × 2; gerçek 20–28 | 10,6 (3,0) | 0,34 | 7,9 | sağlık |
| Sarı | 3–6 | tavan gerçek | 4,38 (2,06) | 0,23 | 6,0 | orta |
| Kırmızı | 0–0,3 | tavan gerçek | 0,24 (0,51) | 0,06 | **1,1** | tek yönlü; gürültüye en açık |
| Ofsayt | 0,6–4 | 0,3–2 × 2 | 1,40 (1,32) | 0,15 | 5,4 | sağlık |
| Pas | 220–400 | 110–200 × 2 | 234 (22,4) | 2,5 | 5,7 | sağlık; alt uca yakın |
| Pas isabeti % | 70–85 | T9b kararı | 81,8 (3,45) | 0,39 | 8,3 | dar |
| İleri pas % | 30–45 | — | 34,2 (3,3) | 0,37 | 11,5 | dar |
| Yan pas % | 35–58 | — | 50,0 (3,3) | 0,36 | 22 | orta |
| Geri pas % | 10–25 | — | 15,8 (1,9) | 0,22 | 27 | sağlık |
| Uzun pas % | 10–24 | — | 16,0 (2,7) | 0,30 | 20 | sağlık |
| Hava topu mücadelesi | 8–20 | 4–10 × 2 | 14,0 (3,6) | 0,40 | 15 | sağlık |
| Uzatma 1. yarı (dk) | 1–4 | — | 3,09 (1,77) | 0,20 | 4,6 | sağlık; üst uca 0,9 dk |
| Uzatma 2. yarı (dk) | 3–7 | — | 6,45 (1,50) | 0,17 | 3,3 | sağlık; üst uca 0,55 dk |
| Değişiklik (takım) | 2–4 | kural bağlı | 2,95 (0,56) | 0,06 | 15 | kural bağlı |
| Top oyunda % | 58–72 | — | 68,3 (4,0) | 0,44 | 8,3 | dar–orta |

### 2.2 Eklenti etiketli hedefler ("hedef T…" satırları; çıkış kodunu etkilemez)

| Grup | Ölçü: bant | Değer / yorum |
|---|---|---|
| T1 hareket | Durma+yürüme ≥ %40; depar ≤ %3; topa > 25 m iken > 4 m/sn ≤ %25; 16+ oyuncu koşuyor ≤ %25 | tek yönlü sağlık sınırları, tutuyor |
| T1 | Ortalama hız 140–180 m/dk | dar (1,29); 146 |
| T1 | İvmelenme > 3 m/sn² ≤ 5 / oyuncu·dk | tutmuyor (T23: 5,84) |
| T23 | Eşzamanlı ivmelenme ≤ 1,0; GPS tanımı ≤ 2,5 | tutmuyor (1,45; 4,21) |
| T2 | Top ayakta ortanca 1,2–2,0 sn; 1 sn'den kısa ≤ %45; taşıma > 5 m %25–35; 10+ paslı ≥ %3; pas boyu 16–20 m | taşıma payı ve pas boyu dar; 10+ paslı sınırda |
| T2 | Alıcı forvet ≤ %30; kanat ≥ %15; ceza sahası içinden şut ≥ %55; ortanca mesafe 14–16 m | kanat ve mesafe tutmuyor (13,0; 16,8) |
| T3 | Forvet dışı şut ≥ %30 | tutmuyor (%22) |
| T4 | Çalım 20–28; başarı %40–50; kanat payı ≥ %40; tahmin−gerçek ±8; top saklama 20–60; dokunuş 2,3–3,0 /sn | kanat payı tutmuyor (%25,6) |
| T4-V | Karar → temas ortanca: pas ≤ 22 m 0,40–0,55; şut 0,50–0,65; uzun 0,55–0,75 sn | dar, tutuyor |
| T5 | İtme+tutma payı ≤ %40 | sağlık |
| T6 | Hava faulü 1,6–5 | sağlık |
| T7 | Sahiplik başına pas 1,6–3; PPDA 3,5–7; stoper+merkez pas payı ≥ %45; geriden son 15 dk şut ≥ %60; şutu takip 1–3 | geriden şut %59,3 ve takip 0,97 tutmuyor (gürültü sınırı) |
| T8 | Hazırlık: korner/barajlı/kenar 10–14 sn; taç 3–6; penaltı 8–12; görevliler yerinde ≥ %80 | dar–orta |
| T8 | Korner kutuda hücumcu 4–7; inişte iki takım ≥ %50; korner 8 sn gol %3–5; kenar doğrudan şut ≤ %15; kenar kutu 4–6; barajlı gol/şut %6–10; kale vuruşu yerden ≥ %99 | korner gol ölçü gürültüsüne en yakın |
| T8 | Duran toptan gol payı %25–35 | dar; 40 maçta %24–46 oynuyor |
| T9b | Gol/şut dışarıdan ÷ içeriden ≤ 0,45 | tek yönlü |
| T10 | Diğer serbest vuruş hazırlığı 3–8; kale vuruşu 4–10; hakem topa uzaklık 12–22; gol → santra 20–35 sn; pas yapılamadan biten sahiplik ≤ %45 | dar–orta |
| T15 / T19 | Gerçekleşen ÷ konum xG 0,85–1,25; ceza içi kurtarış %50–65; blok/şut %24–32; kurtarıştan korner/şut ≥ 0,07 | dar; xG, blok ve korner/şut tutmuyor |
| H1 | Dokunuşta yön değişimi ≤ 20°; niyet değişimi ≤ 25°; gövde dönüş ivmesi p99 ≤ 120; bakış p99 ≤ 410°/sn; > 60° sıçrama ≤ 1 | biyomekanik tavan |
| H1 → T23 | Bakış öncülüğü ≥ 150 ms: ≥ %60 (H1), hizalı ≥ %50 (T23) | T23'te tuttu (%59,4) |
| T23 | Sürüşte top arkada ≤ %1 ve ≤ 5/maç; gövde niyetten dönük ≤ %10; yürüme yan+geri ≤ %30 | sınırda (6,8; %30,6) |

## 3. Gözlemler (bulgu, karar değil)

### 3.1 Örtüşen kapılar
- `r-karne.js` ↔ `k-duran.js`: aynı duran top ölçümleri iki kez (korner 8 sn gol, geride kalanların hızı, kenar kutu, hazırlık); `r-karne.js:46,49,55,56`.
- `d-duran` korner ↔ maç içi korner: aynı bant, farklı örneklem (senaryoda 1600, maçta ~420).
- `c-surus` ↔ `a-akis.js`: "top ≥ 0,15 sn arkada" hem senaryoda hem maçta (borç 26).
- `c-yariyariya` ↔ `c-donen`: aynı Δ eğrisi mantığı; `c-donen` + efor, dönen top kurulumu.
- `d-sut` ↔ `v-sut` ↔ `d-penalti`: aynı şutçu–kaleci kurulumu, kapılar farklı.
- `o-ofsayt` ↔ `o-olay.js` ofsayt satırları; `c-orta` ↔ `p-kalib` orta dilimleri; `c-kayma` ↔ `c-temas` ↔ `c-1v1` müdahale teması.
- Python: `kontrol.py` ↔ `akis-deneme.py` son satırı; `an-yakala.py` ↔ `animasyon-olcum.py` aynı tohumlu maçı ayrı oynatır.

### 3.2 Pahalı ama seyrek değişeni koruyanlar
`git log --since=2026-10-04`: toplam 172 commit. `d-topcu` 409 s → `mac-kurallar.js` (28, top toplayıcı kısmı ayrı sayılmadı); `m-isinma` + `m-fotograf` 256 s → `mac-oncesi.js` 4 / `mac-senaryo.js` 1; `o-sakatlik` 119 s → `mac-sakatlik.js` 4; `p-tip` 193 s → `mac-profil.js` 4. Karşılaştırma: `mac-motoru.js` 66, `mac-topla.js` 47, `mac-karar.js` 33. Bu dördü senaryo toplamının ~%33'ü (877 s) ve her commit öncesi koşuyor.

### 3.3 Havuz ve duvar saati
Oturum sonu havuzu alfabetik (oturum-sonu.js:19, 36); senaryo içi paralellik yok. Duvar saati alt sınırı en uzun senaryo (`d-duran` 664 s); toplam 2635 s / 4 işçi ≈ 659 s — dengeli. 40 maç senaryolardan önce, sıralı (828 s, %52). `macOyna` parametresi her senaryoya geçiyor ama kullanılmıyor.

### 3.4 Gürültüsü bandından büyük ya da eşit kapılar
`d-duran` korner %3–5 (1600'de ±0,53; gerçek %4,6–5,2); `d-sut` üst köşe ≤ %25 (σ ≈ 2,5; tek koşu %21–26); `v-sut` [3] zayıf ayak (400'de −%25…−%47 oynuyordu, 800'e çıkarıldı); `c-orta` (60'ta σ ≈ 6; kapı toplam düzeyinde); `c-temas` [2] (tolerans 8, SE ~8,7); `c-hava` (60'ta ±6, 200'e çıkarıldı); `c-kanat` (kademe başına 40'ta %68–83); `d-penalti` (400'de σ ≈ 2; kabul 4 × 1600); kırmızı kart ≤ 0,3 (40 maçta ~%23 olasılıkla gürültüyle "!"); ikinci yarı gol payı ≥ %50 (240'ta σ ≈ 1,9; 40'ta σ ≈ 5; T16 %49,6); duyarlılık müdahale → girişim 1,24–1,38 (sınırda); gol SE(10) 0,48, SE(40) 0,24, SE(80) 0,17, SE(240) 0,10 — bant yarı genişliği 0,55, 80 maçta 3,2 SE.

### 3.5 Tekrarlanabilirlik ve determinizm denetimlerinin maliyeti
Ucuzdan pahalıya: `ad-denetimi` (d) statik, 0 s; `--ayni` ek maç yok (Node sürümü eşleşmeli); kısa tekrarlanabilirlik (≤ 10 maç, ilk 3 dk × 2); tam tekrarlanabilirlik (> 10 maç, ilk tohum 2 tam maç); `ikiz-deneme` (seed başına ~3 maç süresi); `ikiz --esit`.

### 3.6 40/80/160/240 maç ne için
4/10: yalnız "bozdum mu?". 40: yön. 80: denge kararı, tur kapanışı. 160: korner (maç içi kornerden gol). 240: ikinci yarı payı (σ ≈ 1,9), sakatlığın süre bedeli, yorgunluk. Senaryolarda dar kapı: `d-duran` 1600 korner, `d-penalti` 4 × 1600, `v-sut` 800, `d-sut` 48 tekrar.

### 3.7 Hız bütçesi yönteminin maliyeti
Önceki tur ağacı depo dışına; aynı oturumda sırayla `hiz-olcum.js 3 --tekrar 5` (en az üç çift) + aynı süreçte `2 --tekrar 8 --kok`. Makine dışlanır. Tahmini toplam 12–15 dk (masaüstü). Süreçler arası çiftler ±%17 / ±%35; T23 aynı süreçte +%10,3 [−2,5 … +21,3], en azlar +%9,4, sıralı çift ortancası +%6,9. İçerik etkisi `hiz-evre.js` ile ayrılır. Karar bekleyen: esas ölçünün aynı süreç olması (borç 18).

### 3.8 Belge ve araç tutarsızlıkları
`oturum-sonu.js:9-10` başlığı "T0 senaryolarında çıkış kodunu bozmazlar" der, bugün kapılar açık; gerçekçilik planı §4'ün "film şeridi kullanıcıya gösterilir" satırı 2026-10-09'da kalktı; `oturum-sonu.js:35` yorumu "fiziksel çekirdek", kod `floor(cpus/2)`; `son-oturum.txt` 2026-10-16 tarihli; `d-duran` her koşuda 1 kalıcı "!" (bilgi satırı) basıyor ve özette sayılıyor; 40 maç çıktısında 27 "!" satırı var, çoğu bilinen tutmayanlar — yeni bir "!" aralarında kaybolur; 40 maç çıktısı ≈ 1500 satır.

## 4. Yeni program için yeniden kullanılabilir altyapı

### 4.1 Olay günlüğü ve durum erişimi
`new Match(on, {kadro:MAC_KADRO, tohum, tunel:{x:0,z:-6}})`; motor ~98 noktadan `this.on(ad, v)` yayar (~70 ad: `pass`, `shot`, `goal`, `steal`, `kosu`, `calim`, `kullanim`, `vazgecti` …); kalıcı günlük yok (`m.kayit`, `m.sonucKaydi()` özet; `ikiz-deneme.js:37` akışı karma; `MAC_DENEME_SUTLAR` dosyaya yazan tek örnek). Durum: `m.ist`, `m.teams[t][i]`, `m.players`, `m.ball`, `m.phase`, `m.t`, `m.dir`. Görev etiketi `p.gorevAd`/`_gorevT`/`_gorevOnce` (salt okunur); `m._niyet[t].ad`, `m.taktik`, `p.tavir`, `p.eylem`, `p.surus`, `p.kosu`. Rastlantı yalnız `this.rast`; saf `…Tahmin`/`…Degeri` işlevleri doğrudan çağrılabilir.

### 4.2 `olcumler/` eklenti düzeni
`module.exports = { bilgi:[[ad, anahtar, basamak, [alt|null, üst|null, 'T..']?]], yeni:()=>({dinle(ad,v,m), adim(m), bitir(m)}), ozet?(sonuclar) }` (mac-deneme.js:23). Klasördeki her `.js` otomatik yüklenir; `bitir` sonucu maç satırına birleşir; `ham:{anahtar:[pay,payda]}` ile havuz oranı; `bilgi`nin 4. elemanı hedef etiketi ("!" basar, çıkış değişmez); teşhis kalıbı ortam bayrağıyla; `--json` ve `--karsilastir` ± SE.

### 4.3 Senaryo kurulumu (iskelet)
```js
module.exports={calistir({ctx,vm,N,tohum}){            // araclar/senaryolar/x.js → mac-deneme.js --senaryo x [N] [tohum]
  const n=N||40,dt=1/60;
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,v=0)=>Object.assign(p,{x,z,tx:x,tz:z,vx:Math.cos(yon)*v,vz:Math.sin(yon)*v,spd:v,yon,eylem:null,kickCd:0,surus:null,kosu:null,oyunda:true,denge:1});
  let ok=0;
  for(let i=0;i<n;i++){let son=null;
    const m=kur((tohum||1)*1000+i,(ad,v)=>{if(ad==='pass'&&v.p===A&&!son)son=v;});     // olay akışı = ölçüm kanalı
    const A=m.teams[0][7],D=m.teams[1][3],b=m.ball,d=m.dir[0];bosalt(m,[A,D]);
    yerlestir(A,d*18,34,d>0?0:Math.PI);yerlestir(D,d*24,34,d>0?Math.PI:0);
    m.phase='play';m.phaseT=1;m.durus=null;
    Object.assign(b,{x:A.x+d*0.45,z:34,y:0,vx:0,vy:0,vz:0,egri:0,ust:0,sahip:null,tasiyan:null,sut:null,pas:null,sonTakim:0,sonDokunan:A});
    m.topDegisti();m.sahipYap(A);
    for(let k=0;k<60*6&&!son;k++){A.kararT=99;m.step(dt);if(m.phase!=='play')break;}   // kararT=99: karar katmanı kapalı
    if(son)ok++;}
  console.log((ok/n>=0.9?'  ':'! ')+`Kabul: ${ok}/${n}`);return ok/n>=0.9?0:1;           // çıkış kodu 1 = kapı
}};
```
11'e 11 kurulum için `dizilisKonumu` (c-kanat.js:49-50); karar katmanı açık bırakmak için `kararT=99` satırı kaldırılır; seçeneği zorlamak için `m.secenekUygula(p, sec)`.

### 4.4 Takım zekâsı için doğrudan işe yarayanlar
`p-tip.js:24-29` donmuş sahne karar örnekleme (profil değiştir, `kararVer` K=30 kez, TVD); `oyuncu-karnesi.js:25-36` karar izi (`__kayit`); `--dizilis`, `MAC_DENEME_AYAR`; mevcut takım ölçümleri `t-takim`, `t-kanat`, `y-yari`, `r-ivme`, `a-akis`; `ikiz-deneme.js:35-52` aynı tohumla ikinci `Match`. Kısıtlar: senaryolar tek süreç; `macOyna` kullanılmıyor; parmak izi karar kimliklerini içermez.
