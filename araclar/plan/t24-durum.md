# T24 ara durumu (2026-10-18 gece, masaüstü)

Bu not T24'ün yarıda kaldığı yerdir. Tur kapanmadı, `main`'de değil; dal `claude/motor-t24`. Turun planı gerçekçilik planı “### T24 —”, uygulama planı `araclar/plan/t24-uygulama.md`.

## Yapılanlar (dalda commit'li)

- **T24-0 ölçüm** (47fa28a; sonucu değiştirmez, `t23.json`'a `--ayni` 40/40):
  - d-penalti'de direğe çarpıp oyunda kalan top kaçırmaya sayılıyor (kaçırma %3,3 → 5,4, bant 4–8; borç 8 tanımla kapanır).
  - Kafa şutunda kalecinin tahmini fiziksel.
  - v-verim'de tür × mesafe ve blok kalibrasyonu; a-akis'te penaltı ve serbest vuruş hariç şut türü satırları (aSutA_*) ve stil değişimi.
  - s-sut'ta rol × mesafe ve kaynak; t-kanat, k-duran, d-duran dökümleri; r-karne'de FBref mesafesi ve direk.
- **İskelet** (ecbf993): MOTOR_AYAR bildiriminde ve ayar bloklarında `/*T24x*/` işaret satırları. Kapanışta temizlenecek.
- **a–g birleşimi** (8af0732). Her alt adım 40 maçta ayrı ölçüldü; değerler:
  - a: `ilkHamle` 1, `sutHamleUzak` 12. Tek başına blok / şut 20,3 → 24,3.
  - b: `basSiyirma` 0,25. Bloktan sonra 8 sn'de gol d-duran'da %14,4 / 14,8 → 10,6 / 12,6. `kaleciSapmaTepki` denendi, 0.
  - d: `stilHazirlik` 1 (gelişine şutta stil değişimi %31,9 → 0), `asirtmaOnde` [2,7] (aşırtma %1,4 → 2,5), `sutDusen` 20, `dusenTahmin` 1, `kaleciDusen` 0,06.
  - e: `gecGirisPas` 1, `gecKosu` 0,6. Forvet dışı şut %23,8 → 27,2, hedef ≥ 30 tutmadı.
  - f: `barajPerde` 0,2 (18 m merkezde gol / şut %27 → 19). `barajKaleciYan` denendi, 0.
  - g: `bosKale` 1, `trivelaEsik` 0,55. `burunKarambol` denendi, 0: maçta hiç tetiklenmedi.
- **T24c ve sutPlase** (99a96cc):
  - `blokTahmin` 0,6: planlayıcı uzak hamleciyi ve erişimi biliyor.
  - `ilkSutBlok` 1: gelişine şutta blok hesaba katılıyor.
  - `sutPlase` eklendi, 0'da kapalı.

## Sorun: birleşimin dengesi

160 maç, aynı tohumlar; önce = bütün T24 anahtarları 0 (T23 davranışı):

| Satır | Hedef | T23 (önce) | a–g + c (şimdi) | a–g + c, `ilkSutBlok` 0 |
|---|---|---|---|---|
| Gol | 2,2–3,3 | 2,52 | 2,99 (+0,48 ± 0,36) | 3,1 |
| Şut | 16–28 | 17,2 | 15,8 (bant altı) | 15,7 |
| Gerçekleşen ÷ konum xG (havuz) | 0,85–1,20 | 1,12 | 1,37 | 1,32 |
| Blok / şut | 24–32 | 20,1 | 20,5 | 21,1 |
| Ceza sahası içinden kurtarış | 50–65 | 64,6 | 53,6 | 54,7 |
| Korner | ≥ 4 | 4,8 | 4,2 | 4,0 |

- Fazla gol gelişine şuttan geliyor. Önce 604 şut, kurtarış %66, gol / şut %11,6. Şimdi 378 şut, kurtarış %48, gol / şut %21,7.
- Yerleşik şutta da artış var. Kalecinin tahmini kurtarışı 71'den 64'e indi; şutlar daha zor köşelere gidiyor. Yerleşik şutta gol / şut %9,4 → 12,9.
- `ilkSutBlok` kapalıyken gelişine şut sayısı geri geliyor ama verim yüksek kalıyor. Yani verim artışı a–g birleşiminden geliyor; şut sayısındaki düşüş T24c'nin `blokTahmin`'inden (a–g'de 80 maçta şut 17,3 idi).
- 80 maçta tek tek alt adım kapatmak (ablasyon) gol ve ÷ xG'yi ±0,4 oynattı. Bu, gürültüyle aynı büyüklükte; ayırt etmek için 160 maç gerekiyor.

**Oturum sonu (99a96cc, `t23.json`'a göre):** 23 senaryonun 22'si geçti (`c-temas` [2], borç 29); ad denetimi bulgusuz; 40 maçta hedef dışı üç satır — gol 3,4, şut 15,6, korner 3,9 (yukarıdaki denge sorunu).

## Sıradaki adımlar (yarın)

1. 160 maçlık ayırma koşuları, her biri birleşimin üstünde tek değişiklik:
   - `stilHazirlik` 0;
   - `trivelaEsik` 0 ve `asirtmaOnde` 0;
   - `blokTahmin` 0 (şut sayısı);
   - `sutSapma` 1,4 (T24h2).

   Önce değerleri `--json` ile scratchpad'e, karşılaştırma `kiyas.py` kalıbıyla (tohum eşleşmeli ortalama) yapılır. Gelişine şutun verim artışının kaynağı bulunur: kalecinin hazır olmayışı mı, stil mi, nişan mı.
2. **T24h:** ÷ xG ≤ 1,20 ve şut ≥ 16 olacak biçimde `sutSapma`, `sutPlase` ve `blokTahmin` ayarı; kurtarıştan korner ≥ 0,07 için `kaleciNiyetEsik`. Soru başına en çok iki değer.
3. **Kapanış (CLAUDE.md listesi):**
   - 80 maç ve yeni taban `t24.json`;
   - bütün senaryolar; d-penalti 4 × 1600; d-duran iki tohum;
   - duyarlılık karnesi; hız (`tur/a9` ağacıyla);
   - vuruş stili satırı için `animasyon-olcum.py --karsilastir araclar/taban/a9-anm.json`;
   - işaret satırlarının temizliği; “T24 — Sonuç” ve borç defteri.
4. Sonra T25, T26 ve T27. Uygulama planları `araclar/plan/t25-uygulama.md`, `t26-uygulama.md`, `t27-uygulama.md`. Bunlar Claude'un salt okuma haritalarıdır (kod satır numaraları T23/T24-0 koduna göre), onaylı plan gerçekçilik planındadır.
