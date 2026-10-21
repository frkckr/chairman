<!-- Üretildi 2026-10-21: Claude'un 2026-10-20 oto mod oturumunda tasarım ajanlarının çıkardığı ve birleştirdiği uygulama planı. Kaynak JSON'u aynı klasörde (<tur>-tasarim.json: alan tasarımları). Kabul ve sıra kullanıcı onaylı programın (FUTBOL_KUTUPHANESI §12.13) içindedir; bu dosya uygulayıcı için ayrıntıdır, belge değildir. -->

# V1 — uygulama planı (2026-10-20; Claude'un tasarımı, kullanıcı onaylı program §12.13)

**Durum (2026-10-21 sabah, dizüstü):** Dal `claude/motor-v1` (`../chairman-v1`). Yapıldı: V1-0a (aad464d), V1-0b (dde6ec6), V1a-1 (83cdf04), V1a-2 (3036fb6). V1a-3 yarım kaldı (ara durum commit'i). Kaldı: V1a-3, V1c-1…3, V1b-1…3, V1d-1…2, V1e-1…3 (V1e S1 birleşince), V1-son. Sapma: V1 S1 ile paralel açıldı (K1 ucundan); birebirlik tabanı `araclar/taban/k1.json`.

## Plan

Amaç. V1, kullanıcının 2026-10-20 notlarından dördünü motorda kapatır:
- Not 2: paslar dümdüz, tek hızda ve çizgi çizilmiş gibi.
- Not 3: stoperden sağ beke dönmeden, gerilmeden dış ayak.
- Not 4: sıkışan kanat gerilmeden, kalçadan, amaçsızca havadan auta vuruyor.
- Not 6: kaleci kale vuruşunda sağa dış ayakla pas atıyor.

Not 8'in pozları ve bütün beden çizimi A10'a kalır. V1 çizim dosyasına (`js/animasyon.js`, `STIL`) dokunmaz. A10'un çizeceği sözleşmeyi her vuruş eylemine yazar.

Bilgi tabanı: kutuphane/J (J.1–J.5, J.7 D1–D3/D6/D8, J.9). Teşhis: scratchpad `rapor-vurus-pas.md`.

Uygulama S1 kapanınca başlar. K1 (`kalanCiz`) ve S1 (duruş akışı, kullanan rutini) aynı işlevlere dokunduğu için satır numaraları değil işlev adları esastır. V1 başında şunlar okunur: S1'in `vurusBaslat`, `stepDurus`, `duranHazirMi` ve kale vuruşu değişiklikleri; K1'in `kalanCiz`'i.

BEŞ TASARIMIN BİRLEŞTİRİLMESİ (Claude'un motor kararları; FUTBOL_KUTUPHANESI §12.14'e görünür yazılır)

1. Tek sözleşme ve tek yazıcı.
- Çizimin okuyacağı her şey `p.eylem.dil`'dedir. Saf `vurusDili(m,p,e,evre)` dil'i üç anda yazar: başlangıç, geri salınıma geçiş, temas.
- Bu nesnede şunlar birleşir: V1a'nın e.dil'i, V1b'nin e.tarif'i, V1c'nin düz alanları (aile, teknik, v0Plan, salinim, plase, f0) ve V1e'nin vurusSozlesme alanları.
- Motorun kendi V1 durumu ayrı alt nesnededir: `e.vp` (vuruş planı). İçinde V1a'nın yüzey ve dönüş yolu, V1c'nin aile ve plase, V1b'nin hazırlık modu, adımları ve tavanı bulunur.
- Kural: motor dil'i okumaz, çizim vp'yi okumaz. Oyuncu nesnesine alan eklenmez.
- `MOTOR_AYAR.vurusDil` (1) 0 iken dil null olur. Dil V1-0'dan itibaren bugünkü durumdan yazılır; A10 baştan ona güvenebilir.

2. Yedi şema (J.5): itme, sertIc, surulmus, lofted, chip, dis, vole.
- İnce ayrım bugünkü `stil`'de kalır (yarimVole, falso, burun).
- V1e'nin 'uc' ve 'topuk' şemaları eklenmez; burun → itme + stil burun.
- Tek eşleme işlevi `vurusSemasi`dır. V1b'nin hazTeknik'i, V1c'nin pasTeknigi'si ve V1e'nin teknik kuralı bunda birleşir.
- Eşik: `aileSinifi(v0)` → < 8,5 birak, < 14 itme, < 19 sert, ötesi surulmus.

3. Tek teknik tablosu `VURUS_TEK` (B, js/mac-topla.js). V1b'nin VURUS_HAZ'ı ile V1e'nin SOZ_GERI/SOZ_KOL/SOZ_EGIM tabloları birleşir. Sütunlar:
- 0 adım, 1 adım ve tam yaklaşmada azami hız;
- geri salınım süresi;
- eğim tabanı (rad);
- karşı kol;
- güç ailesi.
Salınım şemaya görelidir: sal = hız ÷ şemanın tam azamisi × oyuncu çarpanı (V1b'nin tanımı). V1c'nin mutlak salınımı ve V1e'nin SOZ_VMAKS tablosu bırakılır. Çizim sal'ı şemanın kendi açı aralığına eşler (D1).

4. Tek zaman ölçüsü `zamanButcesi`.
- T9b-b'nin şut döngüsü buna taşınır; şutta sayılar aynı kalır.
- V1a'nın zamanYok'u, V1b'nin bütçesi ve modu, V1d'nin blok riski aynı tR'yi okur.
- Kararda `rakipler()` algısıyla, yürütmede gerçek listeyle çalışır.

5. Adım tek mekanizmadır.
- V1a'nın dönüş adımı ve V1b'nin güç adımları aynı pencerede örtüşür:
  - V1a'nın dönüş adımı: `donusAdim` hızıyla; adimT ≤ 0,35 sn. Tasarımdaki 'ayarAdim' adı, V1b'nin `hazAdim`'ıyla karışmasın diye `donusAdim` oldu.
  - V1b'nin güç adımları: nEk·tAdim.
  - Hazırlık = bakış + max(nEk·tAdim, adimT).
- `kalan` ve K1'in `kalanCiz`'i aynı koni kökenli donT'yi kullanır.
- V1d'nin kendi adım tablosu (uzakAdimL, uzakHaz, uzakGeri) kalkar. VURUS_TEK'in lofted satırı ve `vurusMenzil` aynı sayıları verir: ~20/32/50 m.
- V1d'nin 'gövde hedefini 0,5/1 m geri alma' önerisi uygulanmaz. Geri geri yürüme ve c-hareket riski taşır. Görünür adım A10'un D2 faz ayarıdır. İki adım baskısızken bugünkü açma dokunuşuyla motorda gerçekten atılır.

6. Açık beden ve acele.
- V1a'nın 'acik' yolu vuran yana +0,35 rad tolerans tanır. Hem zamanYok'ta hem V1b'nin 'kisa' ve 'yarida' modlarında geçerlidir.
- Acil uzaklaştırmada koni [−1,0, +1,0] olur (V1d'nin pelvis kancası).
- Şutun T9b-b sınırı değişmez.

7. Sıra: V1a → V1c → V1b → V1d → V1e.
- V1c'nin aile adayları V1b'nin tekniğinin ve tavanının girdisidir. Böylece pasAnaliz'in aynası bir kez, yeni adaylar üstüne yazılır.
- V1d, V1b'nin hazırlığını ve menzilini kullanır.
- V1e, V1a'nın tablosunu ve V1c'nin plase eğrisini kullanır.
- V1c'nin `pasZaman`'ı V1a ve V1b'nin isabet kazancından sonra, V1-son'da yeniden taranır.

8. Kale vuruşu.
- V1a'nın tablosu geçerlidir: duran ⇒ zaman var ⇒ dış ayak yok.
- V1e'nin `kvVurusAyari`'si şunları yazar: sec.ayak güçlü (iki ayaklıda çapraz), sec.stil, kısa yerden pasta sec.plase.
- Plase eğrisi V1c'nin plase satırıdır; V1e'nin yedek falso formülü kalkar.
- V1a'nın bit 8'indeki doğal yandan yaklaşma ile V1e'nin koşu çizgisi aynı işareti kullanır: vurmayan yandan gelinir.

9. Ölçü dosyaları.
- b-olcum genişler (V1a, V1b, V1c).
- Yeni `araclar/olcumler/u-uzak.js` eklenir (V1d).
- Kale vuruşu `k-kurma.js`'e, dağıtım `d-kaleci.js`'e eklenir. V1e'nin önerdiği yeni v-kaleci.js yerine mevcut sahipler kullanılır.
- Yeni senaryolar: v-yuzey (kale vuruşu hücreleri dahil), v-hazirlik ve u-uzak çekirdeğe girer (V1b'nin uzaklaştırma hücresi u-uzak'a taşınır); d-dagitim seyrektir. t-top'a 6–8. bölümler eklenir.

10. Rastlantı.
- V1a bugünkü tek zarı kullanır, çekiliş sayısı aynıdır.
- V1c'de plase ve havalanma h2 ile seçilir; eğrinin büyüklüğü mevcut tek çekilişle kalır.
- V1b rastlantısızdır.
- V1d açıkken kafada tek çekiliş vardır; kacti ve T12b zarları çekilmez.
- V1e açıkken Gumbel çekilişleri plan anına taşınır.
- Her anahtar 0 iken çekiliş dizisi bugünküyle aynıdır.

11. Birebirlik.
- V1 yığınının bütün anahtarları 0 iken motor S1 tabanına `--ayni` tutar. Yığın: yuzeyKarar, pasAile, hazirlik, uzakAmac, kvV1, dagitimHaz [0,0].
- vurusDil 1 tek başına sonucu değiştirmez.
- Her alt adım sonunda yığın denetimi yapılır.
- `MAC_DENEME_AYAR`'a yalnız o ana dek bildirilmiş anahtarlar yazılır; bilinmeyen anahtar çıkış 2 verir.

12. Kapı tutmazsa o bitin varsayılanı 0'a iner (birebir yol), nedeni ve ölçüsü borç olarak yazılır; tur durmaz (Z1 kalıbı). Önceden bilinen geri dönüşler:
- V1a: tempo tutmazsa `donusAdim[0]` 0; gelişine bozulursa gelişine bit 2'nin dışında.
- V1b: c-orta tutmazsa hazirlik 7.
- V1c: yüksek çıkış hızı isabeti bozarsa `pasZaman` düşük kalır, ortanca borçtur.

ANAHTARLAR (M1: bildirim js/mac-motoru.js'te, değer sahibi dosyada `ayarEkle` ile)
- B, js/mac-topla.js:
  - vurusDil 1
  - V1a: yuzeyKarar 15, yuzeyKon, disAyak, donusAdim
  - V1c: pasAile 31, pasAileHiz, pasTavan, pasZaman, pasPasif, pasAsim, pasEgri, pasPlase, pasKalkis, alcakPas
  - V1b: hazirlik 15, hazAdim, hazBak, hazButce, hazRisk, hazAcele, hazGuc
  - V1d: uzakAmac 7, uzakBlok, uzakBlokKay, uzakTac, uzakKorner, uzakTehlike, uzakPay, uzakTarz, uzakIleri, uzakSerit, kaleciHata, kaleciAgiz, uzakKafaVy
- D, js/mac-kaleci.js: kvV1 7, kvGeri (düz dizi [1,6, 2,4, 3,6, 5,0]), kvYay, kvBaglilik, dagitimHaz [0,4, 0,8]. kvBekle artık okunur.
- Yeni üst düzey adlar ad-denetimi'nde ve kapanışta kontrol.py'de (tarayıcı yükleme sırası) denetlenir.
- Modül düzeyi geçici veri (VH, AA_*, UZ_MD) ve duruş akışı değişikliği ikiz-deneme gerektirir.

TEST REJİMİ (dizüstü; CLAUDE.md üç kademe)
- Her ara adımda hızlı kademe: `mac-deneme 4`, ilgili senaryo, ad-denetimi, 10 maçlık yığın `--ayni`.
- Her grup sonunda (V1-0, V1a, V1c, V1b, V1d, V1e):
  - 40 maç `--karsilastir` (aynı tohumla bit açık ↔ 0; soru başına en çok iki tarama değeri);
  - hız: aynı süreçte `hiz-olcum 2 --tekrar 8 --ayarlar`;
  - oturum sonu (`--mac 24`; seyrekler sahibi değiştiyse);
  - sonuç okunduktan sonra dalda commit.
- Denge kararı ve kapanış 80 maçladır.
- Kabul sahnesi üretilmez; doğrulama Claude'un araçlarıyla yapılır.

KAPANIŞ
- CLAUDE.md'nin tur kapanışı listesi uygulanır.
- Yeni taban `araclar/taban/v1.json` (80 maç). Çalışma ağacında yalnız v1.json ve S1 tabanı kalır.
- Belgeler güncellenir; ardından 'V1 main'e alındı' commit'i, ff `main`, `tur/v1` etiketi ve push. Birleşen dal silinir.
- A10 `main`'den açılır ve dil'i çizer.

## Alt adımlar

### V1-0a — Ortak temel: teknik tablosu, zaman bütçesi, şema eşlemesi ve dil yazıcısı (sonucu değiştirmez)

**Dosyalar:** `js/mac-topla.js`, `js/mac-motoru.js`

Hazırlık:
- `git fetch` ve durum denetimi.
- Dal `claude/motor-v1` S1'in ucundan açılır (S1 `main`'e alınmışsa `main`'den).
- S1 ve K1'in vuruş, duruş ve kaleci değişiklikleri işlev adlarıyla okunur.

js/mac-topla.js'te `vurusSureleri`'nin yanına eklenecek saf ve rastlantısız öğeler:

(1) `VURUS_TEK` tablosu (sutGucu 0,5'te).
- v = [0 adım, 1 adım, tam] m/sn:
  - itme [13,15,16]
  - sertIc [14,19,24]
  - surulmus [17,24,30]
  - lofted [17,23,29]
  - chip [13,16,18]
  - dis [12,16,20]
  - vole [18,21,24]
- g = [salınım 0, 1] sn:
  - itme [0,20, 0,28]
  - sertIc [0,20, 0,32]
  - surulmus [0,22, 0,36]
  - lofted [0,24, 0,40]
  - chip [0,18, 0,28]
  - dis [0,14, 0,30]
  - vole [0,13, 0,16]
- Eğim tabanı on/yan (rad):
  - itme +0,05/0
  - sertIc +0,06/0,08
  - surulmus +0,12/0,08 (yüksek hedefte on 0,02)
  - lofted −(0,12 + 0,12·sal)/0,1
  - chip −0,2/0
  - dis +0,04/−0,1
  - vole −0,06/(0,065 + 0,65·min(y, 0,75))
- Kol = [taban, sal payı]:
  - itme [0,15, 0,25]
  - sertIc [0,25, 0,5]
  - surulmus [0,35, 0,55]
  - lofted [0,4, 0,55]
  - chip [0,2, 0,3]
  - dis [0,15, 0,35]
  - vole [0,3, 0,45]
- Güç ailesi: sertIc, surulmus, lofted, vole.

(2) `vurusTekK(p, tek, zayif)` — oyuncu çarpanı.
- Güç ailesinde 0,85 + 0,3·sutGucu.
- Öbürlerinde 0,92 + 0,16·pas.
- Zayıf ayakta ×(0,8 + 0,2·zayifAyak).
- Yorgunlukta ×(1 − 0,1·yorgunluk).
- V1b'de hazGuc anahtarı bu tabanı okur.

(3) `aileSinifi(v0)`: < 8,5 birak, < 14 itme, < 19 sert, ötesi surulmus.

(4) `vurusSemasi(sec, stil, aile, v0)` — sırayla:
- stil dis ya da şut trivela → dis
- vole ya da yarimVole → vole
- yay ya da stil asirtma → chip
- şutta sutPlan.tur (penaltıda sec.pTur): plase/falso → sertIc; sert/dusen → surulmus; burun → itme
- tip hava → lofted
- yerden aileye göre: birak/itme → itme; sert → sertIc; surulmus → surulmus. Aile yoksa aileSinifi(v0).

(5) `zamanButcesi(m, p, x, z)`.
- rakipler(m, p.team) içindeki oyunda olan saha oyuncuları (kaleci hariç) için varisSuresi(o, x, z, 0,9) değerlerinin en küçüğü.
- `vurusBaslat`'taki T9b-b şut döngüsü buna taşınır; şutta aynı sayı çıkar.

(6) `vurusDili(m, p, e, evre)` ve `MOTOR_AYAR.vurusDil` 1 (B; bildirim js/mac-motoru.js'te).
- Çağrı anları:
  - evre 0: `vurusBaslat` sonu;
  - evre 1: `vurusIlerle`'de geri salınıma geçiş;
  - evre 2: `vurusYap` sonu (ıskada da).
- dil alanı eylem literalinde baştan bulunur; `vurusDil` 0'da null.
- Bugünkü durumdan yazılanlar:
  - sema: vurusSemasi ile.
  - sal: vPlan ÷ vTam. vPlan yerden gucPlan·29, havadan pasGucu('hava', 0, L, T)·30, şutta sutPlan.g·sutHizTavani. Gelişinede ×0,8.
  - don.yol: dis → 'dis'; |f| ≤ bugünkü sinir → 'hizali'; değilse 'pelvis'.
  - don.secim ve don.a0: vuran ayağın çerçevesinde.
  - adim: n = acma'da 2, değilse 0; bak 0.
  - mod 'tam'.
  - egim ve kol: tablodan; acele (on −0,15·ac, yan +0,2·ac) ve vole yüksekliği eklenir.
  - aile: aileSinifi ile; plase false; sicra false.
- Motor dil'i okumaz. V1'in motor durumu bundan sonraki adımlarda `e.vp`'dedir (eylem literalinde; bitler kapalıyken null).

**Denetim:** - `node araclar/mac-deneme.js 4`: tekrarlanabilirlik 'sonuç aynı'.
- `node araclar/mac-deneme.js 10 --karsilastir <S1 tabanı> --ayni`.
- `node araclar/ad-denetimi.js`: yeni üst düzey adlar ve bildirim.
- grep: js/mac-*.js içinde `.dil` yalnız vurusDili'de ve eylem literalinde geçer.
- `node araclar/hiz-olcum.js 2 --tekrar 8 --ayarlar` ile vurusDil 0 ↔ 1 (aynı süreç): artış < %1.

### V1-0b — Ölçüler ve senaryo iskeletleri (sonucu değiştirmez); V1-0 commit'i

**Dosyalar:** `araclar/olcumler/b-olcum.js`, `araclar/olcumler/u-uzak.js (yeni)`, `araclar/olcumler/k-kurma.js`, `araclar/olcumler/d-kaleci.js`, `araclar/senaryolar/v-yuzey.js (yeni)`, `araclar/senaryolar/v-hazirlik.js (yeni)`, `araclar/senaryolar/u-uzak.js (yeni)`, `araclar/senaryolar/d-dagitim.js (yeni)`, `araclar/senaryolar/t-top.js`, `araclar/oturum-sonu.js`, `js/mac-topla.js (yalnız salt okunur olay alanları)`

Genel kural: ölçü eklentileri olay anında p.eylem, sec ve toptan okur, rastlantı çekmez. Motor olayına yalnız eklentinin okuyamadığı salt okunur alanlar eklenir (ör. uzaklaştırmanın hedefi ve kacti).

(1) `araclar/olcumler/b-olcum.js` genişlemesi (J.10). Açık oyun yerden pasta:
- yüzey (dış / zayıf / güçlü iç / üst) × hedefin vuran ayağa göre yanı × karar anında |gövde–hedef|;
- geri başında ve temasta yanlış yan > 15° / > 30° (açık yol hariç ve dahil);
- dışta L ≤ 12 ve trivela payı; dışta 'zaman vardı' payı;
- stoperin dış yandaki (> 20°) pası: dış / zayıf / adım;
- zayıf ayak payı;
- karar→temas %10/50/90: sınıf (yerden ≤ 22 / > 22 m, havadan ≥ 28 m, uzaklaştırma) × baskı;
- sıfır hazırlıkla ≥ 28 m havadan vuruş (karar→temas < 0,35 sn ∧ uçuş ≥ 28 m);
- vazgeçme / maç;
- yerden çıkış hızı %10/50/90 ve 2 m/sn histogramı (tepe sayısı);
- aile ve şema payları; aile başına tamamlama ve kötü ilk dokunuş;
- havalanma (vy > 0,3) payı;
- 20 m'ye ölçekli telafisiz eğri ortancası (topun kopyası topFizikAdim ile; plase, sert, itme, sürülmüş, dış) ve kiriş sehimi;
- plase payı; alçak havadan kısa pas / maç;
- dil dağılımları: şema × sal %10/50/90, yol, mod, adim.n, kol, egim;
- sağ ayaklı pasörün sağa / sola pas oranı.

(2) Yeni `araclar/olcumler/u-uzak.js` (V1d'nin ölçü listesi):
- ayakla ve kafayla uzaklaştırma / maç; tür payları;
- karar hedefi ve topun yolu saha dışı %;
- 5 sn içinde oyun dışı ve ilk dokunan; kendi 30 m'si dışı;
- adım payları 0/1/2 ve adımsız menzil; hazırlık ortancası;
- başlayıp vurulamayan % ve bloklanan %;
- çıkış hızı, iniş ve tepe; kafada tepe > 8 m;
- değer − en iyi diğer seçenek;
- kaleciye geri pas / maç ve değeri;
- planlanan Pb ↔ gerçekleşen blok.

(3) `araclar/olcumler/k-kurma.js` (kale vuruşu):
- stil, ayak, karar anı f, temas hizası, karar→temas;
- top başında ve koşu noktasında hareketsiz süre;
- planın kullanımda değişme payı; jest–hedef uyumu;
- kısa vuruşun 20 m eğrisi.

(4) `araclar/olcumler/d-kaleci.js` (elden dağıtım): tür, hazırlık süresi, bırakışta |gövde–atış|, tutuştan bırakışa süre.

(5) Senaryo iskeletleri. Hepsi bugünkü değerleri yazar; kapı satırları ilgili alt adımda açılır.
- `v-yuzey.js`:
  - topla duran güçlü ayaklı oyuncu;
  - alıcı θ ∈ {−135, −90, −45, 0, +45, +90, +135}° (+ = güçlü ayağın dış yanı), L ∈ {8, 18, 30};
  - baskısız / 1,5 m'de rakip; gelişine çeşidi;
  - kale vuruşu sağ/sol stopere; sağ, sol ve iki ayaklı kaleci;
  - hücre başına 24.
- `v-hazirlik.js`: V1b hücreleri [1], [2], [4], [5], [6].
- `u-uzak.js`: U1–U7 (V1b'nin [3]'ü dahil); c-koru kurulum kalıbı; hücre başına 80; 5 sn.
- `d-dagitim.js`: kale vuruşu koşu çizgisi ve bekleyiş; elden dağıtım hücreleri.
- `t-top.js`'e yeni bölümler: (6) yerden eğri bandı, (7) havalanmada plan↔fizik süre farkı, (8) alçak havadan yay. TOP_FIZIK değişmediği için bugünkü fizikle geçerler.

(6) `araclar/oturum-sonu.js`: çekirdeğe v-yuzey, v-hazirlik, u-uzak; seyreğe d-dagitim.

(7) Önce sayıları: S1 koduyla 40 maç yeni ölçülerle (yerel döküm; depoya alınmaz).

**Denetim:** - `mac-deneme 4`.
- 40 maç `--karsilastir <S1 tabanı> --ayni`.
- Yeni senaryolar çıkış 0 verir (henüz kapısız).
- `--senaryo t-top`: eski T9a kapıları ve yeni 6–8. bölümler geçer.
- `node araclar/oturum-sonu.js <S1 tabanı> --ayni --mac 24` okunur.
- Commit: 'V1-0: dil sözleşmesi iskeleti ve ölçüler (sonucu değiştirmez)'.

### V1a-1 — Yüzey ve ayak karar tablosu (yuzeyKarar bit 1) ve planlayıcı aynası

**Dosyalar:** `js/mac-topla.js`, `js/mac-karar.js`, `js/mac-motoru.js`, `araclar/senaryolar/v-yuzey.js`

MOTOR_AYAR (B):
- yuzeyKarar 15
- yuzeyKon [0,70, 0,26, 0,79, 0,17, 0,35]
- disAyak [0,30, 1,25, 12, 28, 0,66, 0,35, 0,5]
- donusAdim [5, 0,35, 0,15, 0,35]

Saf işlevler:
- `disAyakBecerisi(p)` = clamp(0,5·pas + 0,3·yaraticilik + 0,2·ilkDokunus).
- `vurusKoni(aile, ilk, sut, yol, acil)` → [lo, hi, tol]. Koniler:
  - iç [−0,70, +0,26];
  - üst (stil0 ust/falso; uzaklaştırma, orta) [−0,79, +0,17];
  - dış [D0, D1];
  - acele payı +0,35;
  - gelişine: doğal yan −1,45, vuran yan hi + 0,35;
  - acil uzaklaştırma [−1,0, +1,0].
- `yuzeyOlasilik(m, p, o)` → {Pd, Pz, G, Z, zamanYok, beceri, rate}. V1a §2 aynen; tR zamanButcesi'nden, hazGeri bugünkü vsr'den.
  - duran ⇒ zamanYok false ⇒ Pd 0, Pz ×0,4.
  - İki ayaklıda argmin need.

`vurusBaslat` (bit 1):
- gucPlan ve stil0 ayak kararından önce hesaplanır (pasPlani saf). Yerden pasta stil0: V1c gelene dek gucPlan·29 > 20 → ust.
- Dış ve zayıf bloğu aynı tek zarla çalışır:
  - u < Pd → dış;
  - değilse (u − Pd)/(1 − Pd) < Pz → zayıf;
  - değilse güçlü.
- Şut, penaltı ve sec.ayak yolları bugünkü gibi kalır.
- Yol karar anında seçilir: dis / hizali / pelvis / acik / adim.
- adimT = min(need0/rate, donusAdim[3]), yalnız 'adim' yolunda; adimYan.
- `e.vp` = {secim, yol, a0, need0, lo, hi, tol, adimT, adimYan, zy, tR}. vurusDili'nin don alanları vp'den yazılır.

Planlayıcı aynası `vurusAyakK` (js/mac-karar.js), bit 1'de:
- 1 + Pz·1,2·(1 − za)·(1 − Pd) + Pd·0,22.
- tR, zamanButcesi ile algıdan.
- Pas planlayıcısının t0 = 0'ı değişmez.

**Denetim:** - `mac-deneme 4`.
- `--senaryo v-yuzey` kapıları:
  - (+45°, 18 m, baskısız) dış 0;
  - (+45°, 8 m, baskılı) dış ≥ %25;
  - (−45°, 18 m) dış 0;
  - kale vuruşu dış 0.
- `--senaryo c-orta`: |tahmin − gerçek| ≤ 10 (vurusAyakK aynası).
- `ad-denetimi`.
- `MAC_DENEME_AYAR='{"yuzeyKarar":0}'` ile 10 maç `--ayni` S1 tabanına.

### V1a-2 — Asimetrik doğal koni kapısı, dışta tutulan gövde, koniden hizalanma (yuzeyKarar bit 2)

**Dosyalar:** `js/mac-topla.js`, `js/mac-karar.js`

`vurusIlerle`:
- Simetrik `sapma < sinir` yerine kd ≤ tol kapısı. kd = need(fk_şimdi, lo, hi).
- tol: 'acik' yolda yuzeyKon[4]; V1b gelince 'kisa' ve 'yarida' modunda da aynı tolerans; öbür yollarda 0.
- Şutun sınırı (T9b-b) değişmez.
- Gelişine kapısı: doğal yan −1,45, vuran yan hi + 0,35.
- Dış ayakta:
  - koni [D0 − 0,15, D1];
  - gövde tutulur: yuz = a − sg·clamp(fk, D0, D1).
- Kapı geçişinde p.yonHedef son yöne yazılır; vurusDili evre 1 don.kalan'ı yazar.
- donT = kd > tol ? (kd − tol)/rateŞimdi : 0.
  - kalan ve K1'in kalanCiz'i aynı donT'yi kullanır.
  - Aksi hâlde çizim son adıma erken girer; K1'in kapattığı donma geri gelir.

`vurusYap`:
- hizalanma = need(fk_temas).
- Gelişinede max(0, sap − 0,4); şut bugünkü gibi.

`ortaSecenekleri`:
- Hazırlık dönüşü simetrik vurusHizalama·1,35 yerine ((1 − Pz)·needG + Pz·needZ)/rate (üst konisi).

Acil uzaklaştırma konisi burada vurusKoni'de hazırlanır; V1d'de devreye girer.

**Denetim:** - `mac-deneme 4`.
- `v-yuzey`:
  - (+45°, 18 m, baskısız) geri başında yanlış yan > 15° ≤ %2;
  - (−45°) hizalı ya da pelvis ≥ %90.
- `b-pas`, `c-surus`, `c-orta`.
- `mac-deneme 10`'un a-akis 'Gelişine' satırları. Tutmazsa gelişine bit 2'nin dışında bırakılır (borç).
- Yığın 0 → 10 maç `--ayni`.

### V1a-3 — Ayar adımının hızı (bit 4), doğal yandan yaklaşma (bit 8), V1a dengesi ve commit

**Dosyalar:** `js/mac-topla.js`, `araclar/senaryolar/v-yuzey.js`

Bit 4:
- 'adim' yolunda ve kd > 0 iken: p.yonHedef = p.yon + clamp(aciFark(yuz, p.yon), ±r·dt), r = max(donusAdim[0], need0/donusAdim[3]).
- js/mac-hareket.js'e dokunulmaz: eylemIlerle moveP'den önce koşar.

Bit 8:
- vurusYaklas'ın yay adayları (duran ya da ≤ 1,2 m/sn top) iç ve üstte i·sg ≥ 0, dışta i·sg ≤ 0 ile sınırlanır.
- Sonuç: sağ ayaklı topa vurmayan yandan gelir. V1e'nin koşu çizgisiyle ve du.yay ile aynı işaret.

V1a sonu:
- 40 maç `--karsilastir` (yuzeyKarar 15 ↔ 0, aynı tohum).
- Tarama yalnız donusAdim[0] ∈ {5, 0}. Tempo kapısı tutmazsa donusAdim[0] = 0 (yalnız kapı).
- `hiz-olcum --ayarlar` ile yuzeyKarar 0 ↔ 15.
- Oturum sonu ve commit: 'V1a: yüzey ve ayak karar tablosu'.

**Denetim:** Senaryolar:
- `mac-deneme 4`.
- `v-yuzey` bütün kapılar:
  - (0°) karar→temas yuzeyKarar 0'a göre ±0,02 sn;
  - (+90°, 18 m, baskısız) zayıf %10–35, kalanı güçlü ve adım;
  - kale vuruşunda temasta |sapma| ≤ 0,26.
- `c-surus`: 'Alış → vuruş' ve 'Geri geri' satırları.
- `c-1v1`, `c-koru`, `c-kanat`.
- `--seyrek d-duran`: korner ve kenar serbest vuruşu sec.ayak yolu aynı; kale vuruşunda ve kısa duran pasta dış 0.

40 maç:
- dış ayak %2–6;
- zayıf %10–18;
- temasta yanlış yan > 15° ≤ %3;
- karar→temas (yerden ≤ 22 m) ortanca artışı ≤ +0,08 sn;
- vazgeçme/maç artışı ≤ +1;
- sağ/sol yana pas oranı ±3 puan;
- sağlık aralığı S1'den kötü değil.

Son:
- hız artışı < %1.
- `oturum-sonu --mac 24`.
- Yığın 0 → 40 maç `--ayni`.

### V1c-1 — Üç hız ailesi ve planlayıcı gerçekçiliği (pasAile bit 1 + 16)

**Dosyalar:** `js/mac-karar.js`, `js/mac-topla.js`, `js/mac-motoru.js`, `araclar/olcumler/p-kalib.js`

MOTOR_AYAR (B):
- pasAile 31
- pasAileHiz [[5,0,45,5,5,9,0,12],[7,5,0,45,8,14,3,24],[12,0,30,14,20,8,60],[15,0,22,18,25,18,70]] — bırakma, itme, sert, sürülmüş; her satır [a, b, alt, üst, Lmin, Lmax], v0 = clamp(a + b·L, alt, üst)
- pasTavan 0,9
- pasZaman 0,3
- pasPasif [0,6, 0,1, 0,95]
- pasAsim 6
Bit 2, 4 ve 8'in anahtarları kendi adımlarında eklenir.

js/mac-karar.js'e saf işlevler ve modül dizileri:
- AILE_AD;
- AA_V0, AA_VA, AA_F (Float64Array / Uint8Array(4));
- aileV0(f, L);
- aileAdaylari(m, p, L, alt, alici, o). En çok 3 aday; koşullar:
  - Lmin / Lmax;
  - varış hızı bırakmada ≥ 2,5, öbürlerinde 3,5–18;
  - tavan pasTavan·sutHizTavani·(1 − 0,25·baskı);
  - gelişinede sürülmüş yalnız L ≥ 25;
  - uygun aile ikiden azsa itmenin yumuşak eşi eklenir; hiç yoksa pasVarisHizi yedeği.

`pasAnaliz` (pasAile&1, tip yer, o.varislar yok):
- Adaylar ailelerden; v0 doğrudan alınır (yerIlkHiz atlanır).
- Bit 16:
  - pasif erişim (pasPasif);
  - alıcının yanal erişimiyle tolerans: tol_k = min(PT0 + PT1·marj, 0,6 + 2·max(0, T − 0,25)²); döndürülen Pex de bununla;
  - aşım cezası al = clamp(1 − geç·max(3, varış)/pasAsim, 0,1, 1).
- Seçim:
  - U_k = SPT·Pex·(0,7 + 0,3·Pk)·(1 + τ_eff·min(1,5, Tmax − T_k));
  - τ_eff = pasZaman·(0,3 + 0,7·(1 − acik(marj_enYavaş)))·(0,6 + 0,8·tempo); bırakmada 0.
- Dönüşe aile eklenir.
- 1 ve 16 yalnız birlikte açılır: prototipte 16 olmadan isabet −10 puan düştü.

Taşıma:
- pasAdayiTam, tekVurusKarari0 ve secenekUygula sec'e aile ekler (ölçü için P ve Pk).

`vurusBaslat`:
- vp.aile = sec.aile || aileSinifi(gucPlan·29).
- stil: sürülmüş → 'ust', öbürleri 'ic'. pasAile 0'da eski 'v > 20 → ust' kuralı kalır.

`yerPasVur`:
- v aile bandına sınırlanır: [alt − 1,5, üst + 1,5].
- dil.aile ve dil.sema aileden.

Eski yolda kalanlar: o.varislar'lı yerden orta ve geri çevirme, santra, korner kısa, kale vuruşu (V1e'ye dek).

**Denetim:** Senaryolar ve araçlar:
- `mac-deneme 4`.
- `b-pas`.
- `c-orta` (değişmemeli).
- `z-s14` (kapı), `z-s3`, `z-s10`.
- `c-kanat`, `c-1v1`, `c-koru`.
- `ikiz-deneme`: AA_* modül dizileri; Aynılık N/N.
- `ad-denetimi`.

40 maç `--karsilastir`, pasAile 31 ↔ 0 (pasZaman taraması yalnız {0,2, 0,35}):
- pas isabeti ≥ taban − 2 puan;
- P'li pasta aile başına tahmin↔gerçek ±5 (p-kalib);
- bırakma ≥ %4; sert + sürülmüş ≥ %25;
- çıkış hızı %10–%90 ≥ 9 m/sn ve iki tepe;
- ortanca ≥ 14,5 hedefli: tutmazsa V1-son'da yeniden taranır, isabet önceliklidir.

Son:
- `hiz-olcum --ayarlar` ile pasAile 0 ↔ 31: beklenen −%2…+%2.
- Yığın 0 → 10 maç `--ayni`.

### V1c-2 — Aileye bağlı eğri ve plase (bit 2), sert pasta hafif havalanma (bit 4)

**Dosyalar:** `js/mac-topla.js`, `js/mac-motoru.js`

MOTOR_AYAR:
- pasEgri [[0,004, 0,010], [0,02, 0,02], [0,035, 0,03], [0,004, 0,008], [0,05, 0,04]] — sırasıyla itme/bırakma, sert iç, plase, sürülmüş, dış ayak.
- pasPlase [0,3, 0,3, 0,4].
- pasKalkis [0,5, 0,5, 0,4, 0,8, 0,45, 1,25].

Eğri (`yerPasVur`):
- Büyüklük pasEgri tablosundan.
- Mevcut tek this.rast() çekimi kullanılır, çekiliş sayısı aynı.
- İşaret bugünkü kural; nişan telafisi yerEgriSapma ile.

Plase (`vurusBaslat`, vp.plase) — hepsi tutarsa:
- stil 'ic';
- aile ≠ sürülmüş;
- L ≥ 10;
- güçlü ayak;
- vp.a0 > pasPlase[0]: hedef vuran ayağın dış yanında ('kendi sağına ayak içiyle hafif falsolu'). V1a kapalıyken f·sg ile;
- h2(tohum + p.n·131 + p.team·7, ist.pas toplamı·3 + 1) < 0,3 + 0,4·pas.

Havalanma (L ≥ 10 ve kötü vuruş değilken):
- sürülmüş: vy = min(1,25, 0,8 + 0,45·h);
- sert: h2(…, …·3 + 2) < 0,4 iken vy = min(1,25, 0,5 + 0,5·h);
- b.y 0,02.

yerEgriSapma imzasına vy eklenir (kopya y = vy > 0 ? 0,02 : 0). dil.plase yazılır.

**Denetim:** - `mac-deneme 4`.
- `t-top` kapıları:
  - (6) plasede 20 m'de 0,3–0,8 m; itmede v0 10'da ≤ 0,2 m;
  - (7) vy ≤ 1,25'te plan↔fizik süre farkı ≤ %5, tepe ≤ 0,1 m;
  - eski T9a kapıları aynı.
- `b-pas`.
- a-akis 'Eğrili pas %' ~58 → ~45 beklenir (anlam notu; kabul dışı).
- Yığın 0 → 10 maç `--ayni`.

### V1c-3 — Alçak havadan kısa pas (bit 8), V1c dengesi ve commit

**Dosyalar:** `js/mac-karar.js`, `js/mac-topla.js`, `js/mac-motoru.js`, `araclar/olcumler/p-kalib.js`

MOTOR_AYAR: alcakPas [6, 16, 3,5, 0,6, 0,05, 0,8, 1,4].

`havaSure` 'alcakPas' yayı = √(8·clamp(0,6 + 0,05·L, 0,8, 1,4)/G).

Aday:
- `pasAdayiEkle`: tip yer ∧ !ilk ∧ alt ≠ hedef ∧ 6 ≤ L ≤ 16 ∧ ilk metrelerde bacak < 3,5 m → c.alcak.
- `pasSecenekleri`: iki tipten sonra pasAdayiTam(…, 'hava', 'alcakPas') denenir; değeri büyükse o alınır.
- `pasAdayiTam`: pasTurDegeri 0; kayıpta ikinciTop çarpanı 1.
- `pasAnaliz`'in hava yolunda alcakPas için: PA_H < 0,8 noktalarına pasif erişim; inişte ya 0,6.

Yürütme (`havaPasVur`):
- T = sec.T; kesik dönüş −0,03; eğri 0.
- vurusSureleri 'asirtma'.
- stil 'ic'; sema 'lofted'.

V1c sonu:
- 40 maç pasAile 31 ↔ 0.
- Oturum sonu; commit: 'V1c: pas hızı aileleri ve topun yolu'.

**Denetim:** - `mac-deneme 4`.
- `t-top` (8): L 8–16'da tepe 0,8–1,4 m, 2 m'de ≥ 0,5 m, inişte ≤ 12 m/sn (kapı).
- p-kalib alcakPas tahmin↔gerçek ±10. Tutmazsa L ve blok koşulu daraltılır.
- `b-pas`: 1,5 m baskı hücrelerinde alçak havadan görünür; grup tamamlaması tabandan en çok 5 puan düşük.
- 40 maç: alçak havadan 1–4/maç; sağlık aralığı.
- `ikiz-deneme`.
- `oturum-sonu --mac 24`.
- Yığın 0 → 40 maç `--ayni`.

### V1b-1 — Hazırlık ve gerilme modeli: saf işlevler ve motor (hazirlik bit 1)

**Dosyalar:** `js/mac-topla.js`, `js/mac-motoru.js`, `araclar/senaryolar/v-hazirlik.js`

MOTOR_AYAR (B):
- hazirlik 15
- hazAdim [0,22, 0,1]
- hazBak [0,15, 0,1]
- hazButce 0,1
- hazRisk [0,12, 0,12]
- hazAcele 0,4
- hazGuc [0,85, 0,3] (vurusTekK okur)

Saf işlevler:
- VH: paylaşılan çıktı nesnesi.
- havaCikisHizi(m, L, T, hy, ust): havadanCoz'un büyüklüğü. Not defteri m._vhM (Map) Match'te; reset'te null. Modül önbelleği yok.
- vurusMenzil(m, p, tek, n, aile, hy): ikiye bölme, ≤ 7 adım.
- vurusHazirlik(p, o) (V1b §1.6):
  - nG; kredi kr;
  - tAdim = hazAdim[0] + hazAdim[1]·(1 − ceviklik);
  - tBak: ≥ 28 m ve şut değilken;
  - sal(n), geri(n), Tq, B = tR + hazButce;
  - mod tam / adim / kisa;
  - vCap, acele, acma, eğim, kol.
  - don girdisi: 'adim' yolunda V1a'nın vp.adimT'si; zayıfta needZ/rate; öbür yollarda 0.
  - tek = vurusSemasi.

`vurusBaslat`:
- Kapsam: açık oyun pası, uzun pası ve uzaklaştırma. Şut, gelişine, duran top ve penaltı dışında; açık orta V1b-2'de bit 8 ile.
- geri = H.geri; hazEn = H.haz. Vazgeçmeden 0,6 sn içinde hazEn 0 kuralı kalır.
- acma = H.acma (T21c koşulu yerine).
- uzunHaz yalnız 'tam' ∧ L ≥ 28 ∧ bütçe yeterken.
- acele = H.acele, pasta ve uzaklaştırmada da (vurusSapma, kotuVurusOlasiligi).
- e.vp'ye hazırlık alanları yazılır: tek, mod, n, kr, nEk, tBak, tAdim, vIst, vCap, d, tR, acma.

Hız tavanı (yalnız kisa / yarida):
- `yerPasVur`: hatadan önce v = min(v, vCap). Tavan V1c bandından sonra uygulanır; bandın altına düşerse vp.aile ve dil yeniden sınıflanır.
- `havaPasVur`: hedef vurusMenzil'e kısalır, T aileden yeniden alınır.
- vp.kisaldi yazılır.

Uzaklaştırma (`secenekUygula`, V1d gelene dek):
- Hedef vektörü vurusMenzil(lofted, nF)·0,95'e kısalır; aynı rast çağrıları kalır.

Ek adımlar:
- Motorda yerinde süre olarak işler.
- İki adım, baskısızken açma dokunuşuyla gerçek atılır.
- V1d'nin '0,5/1 m geri alma'sı uygulanmaz.

vurusDili'nin sal, adim {n, t0, t1, bak, acma}, mod, egim ve kol alanları H'den yazılır.

**Denetim:** - `mac-deneme 4`.
- `v-hazirlik`:
  - [1] 40 m havadan, rakip > 10 m: karar→temas ≥ 0,6 sn; ek adım ≥ 1 (≥ %90); sal ≥ 0,75; kol ≥ 0,8.
  - [4] koşarak gelen: kredi 2; karar→temas hazirlik 0'a göre ≤ +0,1 sn.
  - [5] duran, 18 m sert: ek adım 1; +0,1–0,25 sn.
- `u-uzak` (bilgi): uzaklaştırma menzili baskıyla azalır.
- `b-pas`, `c-surus`.
- `t-top`: fizik aynı.
- `ikiz-deneme`: VH ve m._vhM.
- `ad-denetimi`.
- Yığın 0 → 10 maç `--ayni`.

### V1b-2 — Planlayıcının aynası (bit 2) ve ortalar (bit 8)

**Dosyalar:** `js/mac-karar.js`, `js/mac-topla.js`

`secenekler0`:
- Karar başına hzB = {tR: zamanButcesi} hesaplanır, pasSecenekleri'nin o'suna eklenir.
- pasAdayiTam bunu pasAnaliz'e geçirir.
- tekVurusKarari0'ın kontrol sonrası dalı: tR karşılama noktasından, k.t + 0,45 düşülerek; kredi 0.
- Gelişinede yok.

`pasAnaliz` (o.hzB varken):
- Yerden her aday (AA_V0) için H hesaplanır. 'kisa'da v0[k] = min(v0[k], vCap), PA_TB'den önce.
- Havadan: v = havaCikisHizi.
  - 'kisa'da kısa kalan yol s = L·(1 − (vCap/v)²); mk = clamp(1 − max(0, s − tol)/6, 0, 1).
  - 'adim'da mk = 1 − 0,5·(1 − mk_kisa(nF)).
- Seçim ve P mk ile çarpılır; sd0 ×(1 + 0,5·acele).
- A.hz salt okunur.
- t0 = 0 kalır (T4-V dersi).

`ortaSecenekleri` (bit 2 + 8):
- 1. adamın t0'ı = max(H.haz, don) + H.geri.

Uzaklaştırma seçeneği:
- {menzil, acele} ve geçici terim −0,6·(1 − clamp(menzil/28)). V1d-1'de kalkar.

Bit 8: açık orta ve geri çevirme, bit 1, 2 ve 4'ün kapsamına girer.

**Denetim:** - `mac-deneme 4`.
- `c-orta`: T10a, geri çevirme ve alçak |tahmin − gerçek| ≤ 10. Tutmazsa hazirlik varsayılanı 7; ortalar bugünkü gibi kalır.
- `v-hazirlik`:
  - [2] rakip 1 m'de, 5 m/sn: planlayıcı pası seçmez (≥ %90); zorlanırsa kisa ya da yarida, iniş ≤ 25 m, acele ≥ 0,5 (N/N).
  - [6] planlayıcının modu motorunkiyle aynı karede N/N.
- `b-pas`, `z-s14`, `c-kanat`.
- Yığın 0 → 10 maç `--ayni`.

### V1b-3 — Yarıda kesme ve uzun vuruşta 1. adam (bit 4); V1b dengesi ve commit

**Dosyalar:** `js/mac-topla.js`, `js/mac-karar.js`, `js/mac-hareket.js`, `js/mac-mudahale.js`

Yarıda kesme (`vurusIlerle`, hazırlık evresi):
- Koşul: kesilebilir süre var ve nEk + tBak > 0. Şut, gelişine ve duran top yok.
- tR_now = zamanButcesi(b.x, b.z) ≤ e.geri + 0,05 ise:
  - hazirlikEn = e.t;
  - nYap = min(nG, kr + ⌊(e.t − tBak)/tAdim⌋); açma yapıldıysa +2;
  - vCap = vAz(nYap);
  - acele = clamp((e.kalan − tR_now)/hazAcele, 0, 1);
  - geri ×(1 − 0,35·acele);
  - mod 'yarida'; olay 'vurusYarida' {p};
  - vurusDili mod, acele ve sal'ı günceller.
- Rastlantı çekmez.

Uzun vuruşta 1. adam:
- `presYap` (js/mac-hareket.js): T12b orta bloğu koşulu vp.blok vuruşlara genişler — havadan ∧ L ≥ 20, ya da uzaklaştırma; yerden pas hariç.
- `vurusSon`: bu vuruşlarda this.ortaBlok(p) çağrılır; b.ortaBlok.uzun → olay 'block' {uzun: true}.
- js/mac-mudahale.js'te yalnız bayrak eklenir.
- Planlayıcı: havadan adayda hzB.tR < 1,5 ise P ×= ortaBlokTahmin(…, t0 = Tq).acik.

V1b sonu:
- 40 maç hazirlik 15 ↔ 0. Tarama en çok iki değer: hazRisk ya da lofted v.
- Oturum sonu; commit: 'V1b: hazırlık ve gerilme modeli'.

**Denetim:** Senaryolar:
- `mac-deneme 4`.
- `c-temas`, `c-yariyariya`, `c-donen`: yeni blok ve yakın temas.
- `v-hazirlik`: bütün kapılar.
- `u-uzak` (bilgi).
- `v-sut`, `d-sut`: şut aynı.
- `ikiz-deneme`.

40 maç:
- sıfır hazırlıkla ≥ 28 m havadan vuruş 0;
- ek adım payları: yerden ≤ 22 m ~%10, yerden > 22 m ~%70, havadan ≥ 28 m ~%95;
- salınım teknik başına üç ayrık bant;
- vazgeçme/maç ≤ 1,5 × taban;
- uzun pas payı ve pas isabeti sağlık aralığında;
- kısa düşen, yarıda kesilen ve uzun vuruş bloğu maç başına (bilgi).

Son:
- `hiz-olcum --ayarlar` ile hazirlik 0 ↔ 15: artış < %3.
- `oturum-sonu --mac 24`.
- Yığın 0 → 40 maç `--ayni`.

### V1d-1 — Amaçlı uzaklaştırma: ayak ailesi ve yürütme (uzakAmac bit 1)

**Dosyalar:** `js/mac-karar.js`, `js/mac-topla.js`, `js/mac-profil.js`, `js/mac-motoru.js`, `araclar/senaryolar/u-uzak.js`, `araclar/olcumler/u-uzak.js`

MOTOR_AYAR (B):
- uzakAmac 7
- uzakBlok 0,6
- uzakBlokKay 0,5
- uzakTac 0,4
- uzakKorner 3,5
- uzakTehlike 1,8
- uzakPay [0,2, 0,3]
- uzakTarz 1,0
- uzakIleri [36, 48]
- uzakSerit [10, 12]
uzakAdimL, uzakHaz ve uzakGeri yoktur: adım, hazırlık, menzil ve geri salınım V1b'den gelir.

`havaSure`'ye yeni yaylar: 'uzak' 1,3 + L/30; 'kurtar' 1,0 + L/32; 'tac' 0,55 + L/30.

Saf `uzaklastirSecenekleri(m, p, o, S)`, `uzakIkinciTop(m, team, x, z, T, haric)` ve UZ_MD (V1d §3–5).
- Bağlam: tehlike = yakinCeza ∧ (rk < uzakTehlike ∨ seken top ∨ kaleye dönük ∧ rk < 3 ∨ dönen top).
- plan(hx, hz): vurusHazirlik(lofted, L) ve Pb = clamp((Tq − tR + 0,1)/0,35)·uzakBlok·yönK; σ vurusSapma biçiminde.
- Adaylar:
  - ileri / ters: 36–48 m; kanat ve yarım alan şeritleri; orta şerit yok; ileri bileşen ≥ 0,5·L; iniş u ≤ PL − 22.
  - acil: zaman yokken; adımsız; 18–20 m; saha içinde.
  - taç: yalnız tehlikede ve kenara < 22 m; ileri çapraz.
  - çizgi: tehlike ∧ ceza sahası ∧ direk dışı ∧ (kaleye dönük ∨ rakip < 1,5).
  - kurtarış topu: en çok 3 alıcı; pasAnaliz 'hava'; tur uzun/pas; yay 'kurtar'; alt 'kurtar'; Gumbel anahtarı 'p'+q.n.
- Pay: uzakPay·(1 + uzakTarz·(0,5 − kisaPay)) + 0,3·koru + dönen + uzaklastirDeger.
- Listeye alıcısız en iyi tek aday ve kurtarışlar girer.

`secenekler0`:
- Kapı aynı: u < −PL + 30 ∧ (baskı > 0,3 ∨ dn).
- Bit 0'da eski satır bit bit aynı.
- V1b'nin geçici menzil terimi kalkar.

Yürütme:
- `secenekUygula`: s.uz varsa hedef sabit; kacti ve T12b zarları yalnız eski yolda. sec'e uz ve T; kurtarış pasına alt ve yay.
- `vurusBaslat`: uzaklaştırmada H lofted ve L ile. Acilde zaman yok ⇒ V1a yolu 'acik', koni [−1, +1], e.acele ≥ 0,5. gucPlan = vIst/29.
- `havaPasVur`: T = sec.T.
- `vurusSon`: 'clear' {uz, L, adim, deger, enDiger}.
- `hedefGuncelle`: kurtarışta havaSure(L, 'kurtar').
- `profilEgilimPuani` (js/mac-profil.js): kurtarışa da −0,6·g·oynayarakCikar.

vurusDili:
- sema lofted; taçta L ≤ 14 sertIc, daha uzunu surulmus.
- sicra: acilde ya da sal ≥ 0,95'te.

**Denetim:** - `mac-deneme 4`.
- `u-uzak`:
  - U1 kanatta sıkışma: L > 30 m havadan saha dışı hedef 0; adımsız vuruş yalnız L ≤ 22; adımlı hazırlık ≥ 0,22 sn.
  - U2: kurtarış + ileri ≥ %60; saha dışı hedef ≤ %5; 5 sn sonunda top bizde ≥ %40.
  - U4: çizgi + taç + acil ≥ %40; kale önünden yatay vuruş 0.
  - U5: 35 m'de ayakla uzaklaştırma 0.
  - U6: kendi kalesine doğru 0; tepe ≤ 15 m.
- `c-koru`, `c-temas`, `c-yariyariya`, `c-donen`, `b-pas`, `c-orta`.
- `--seyrek d-duran`.
- `ikiz-deneme` (UZ_MD), `ad-denetimi`.
- 40 maç uzakAmac 1 ↔ 0. Tarama gerekirse uzakPay[0] ∈ {0,1, 0,4}.
- Yığın 0 → 10 maç `--ayni`.

### V1d-2 — Kaleciye geri pasın değeri (bit 2), kafa uzaklaştırması (bit 4), kalibrasyon ve commit

**Dosyalar:** `js/mac-karar.js`, `js/mac-topla.js`, `js/mac-motoru.js`, `araclar/senaryolar/u-uzak.js`

MOTOR_AYAR: kaleciHata 0,1; kaleciAgiz 0,5; uzakKafaVy [2,5, 9].

Kaleciye geri pas:
- `pasSecenekleri`: bit 2 ve u < −PL + 30 iken kaleci baskı ≥ 0,12'de aday. Z3'ün kaU kapısı ve bölge dışı değişmez.
- `pasAdayiTam` (q.rol GK): kayıp = [(1 − Pt)·pasKaybi(hattın ortası) + Pt·(1 − teknik·Pex)·kaleciHata·pasKaybi(kaleci)]·risk.
- Kale ağzı cezası: pas doğrultusu ±GW2 + 0,5'i kesiyor ve kaleci çizgiye < 4 m ise −kaleciAgiz.

Kafa uzaklaştırması:
- `kafaKarari` panik dalı (kapı aynı); saf `kafaUzakHedef` adayları:
  - arkadaş: 8–20 m; P = σ((tr − tq)/0,4);
  - kenar-yukarı: top tarafı kanada 40°, saha içi; tehlike ∧ ceza sahasında bugünkü ±3 m dış sınır;
  - yarım alan: 15°; iniş orta şeritte ve kendi 30 m'sinde aday değil.
- En yüksek U seçilir; tek m.rast() ile ±2 m sapma.
- Orta sahada hedef hep saha içi; kafa eylemine uz yazılır.
- `kafaVur`: uzaklaştırma kafasında dikey gürültü ±2,5 ile kırpılır, toplam vy ≤ 9. Çizgi kuralı (T8f) aynen.

Kalibrasyon:
- uzakTac, uzakBlok ve uzakTehlike yalnız u-uzak U1 ve U4 hücreleriyle ayarlanır, 40 maçla değil.
- Oturum sonu (--seyrek: d-duran, d-sut); commit: 'V1d: amaçlı uzaklaştırma'.

**Denetim:** Senaryolar:
- `mac-deneme 4`.
- `u-uzak`:
  - U3: kaleci pası kararların ≥ %20'si; kale ağzını kesen 0; kesilen ≤ %5.
  - U7: kafada tepe ≤ 8 m %100; orta sahada saha içi %100.
  - U1 ve U4 kalibrasyonu.
- `c-hava`, `d-duran`, `d-sut`; k-kurma (bilgi).
- `ikiz-deneme`.

40 maç, uzakAmac 7 ↔ 0:
- hedef saha dışı ≤ %15 (önce %63);
- 5 sn içinde oyun dışı (ayak) ≤ %30;
- ilk dokunan biz ≥ %30;
- kendi 30 m'si dışında ≤ %5;
- adımsız ≤ %25, hepsi ≤ 22 m;
- hazırlık ortancası ≥ 0,22 sn;
- kafada tepe > 8 m: 0;
- kaleciye geri pas bölgede ≥ 0,5/maç ve değeri > 0;
- sağlık aralığı. Kurtarış topu 'pass' sayıldığı için pas isabetinin ve uzun pasın kayması belgeye yazılır.

Son:
- `oturum-sonu --seyrek --mac 24`.
- Yığın 0 → 40 maç `--ayni`.

### V1e-1 — Kale vuruşunun yüzeyi ve planın bölünmesi (kvV1 bit 1)

**Dosyalar:** `js/mac-kaleci.js`, `js/mac-topla.js`, `js/mac-motoru.js`, `araclar/senaryolar/v-yuzey.js`

MOTOR_AYAR (D, js/mac-kaleci.js; bildirim js/mac-motoru.js):
- kvV1 7
- kvGeri [1,6, 2,4, 3,6, 5,0]: kısa ve uzun koşu mesafesi
- kvYay [0,25, 0,6]
- kvBaglilik 0,35
- dagitimHaz [0,4, 0,8]
- kvBekle'nin yorumu düzeltilir.

Önce bölünme:
- `kaleVurusuPlani`, saf `kvAdaylar(m, du, tk)` + `kvSec(m, S)` olarak ikiye ayrılır.
- Aday sırası aynı; aday başına bir Gumbel. Sonuç birebir.
- Kısa adayın pasAnaliz sonucundaki varis ve aile sec'e taşınır (V1c; yoksa itme yedeği).

Bit 1: `Match.kvVurusAyari(du, tk, sec)` kaleVurusuSecenegi'nin sonunda çağrılır (kurma&1 açık ya da kapalı). Yazdıkları:
- sec.ayak: güçlü. İki ayaklıda çapraz: f > 0,1 → sol, değilse sağ.
- sec.stil: yerden 'ic', havadan 'ust'. vurusBaslat'a 'if(sec.stil) stil = sec.stil' eklenir; zar koşulsuz çekilmeye devam eder.
- sec.plase: kısa yerden pasta. Eğri V1c'nin plase satırından; pasAile&2 kapalıyken bugünkü eğri. V1e'nin yedek falso formülü yok.
- sec.kosuEfor: kısa 0,6, uzun 0,9. vurusIlerle eforVer bunu okur.

V1a açıkken bu kural onun tablosuyla çakışmaz: duran ⇒ dış yok, secim 'sabit'.

**Denetim:** - `mac-deneme 4`.
- Bölünmeden sonra kvV1 0 ile 40 maç `--ayni`.
- `v-yuzey` kale vuruşu hücreleri (sağ, sol ve iki ayaklı kaleci; iki yana):
  - dış 0;
  - tek ayaklıda zayıf 0;
  - temasta |sapma| ≤ 0,26.
- `--seyrek d-duran`: kale vuruşu hücresi.
- k-kurma (bilgi): kısa pay ~%57, gürültüde.
- `ad-denetimi`.
- Yığın 0 → 10 maç `--ayni`.

### V1e-2 — Kale vuruşunda erken plan, koşu çizgisi ve kvBekle (kvV1 bit 2 ve 4)

**Dosyalar:** `js/mac-kaleci.js`, `js/mac-kurallar.js`, `js/mac-durantop.js`, `araclar/senaryolar/d-dagitim.js`, `araclar/olcumler/k-kurma.js`

Başta S1'in duran top kullanan rutini (koy → geri çekil → işaret → bakış) okunur:
- Varsa kvBekle evreleri onun kale vuruşu parametresi olur; duruş alanları ikiye bölünmez.
- Yoksa aşağıdaki kendi evreleri kurulur.

Bit 2 (kurma&1 gerekir): `Match.kvPlanla(du, tk)`.
- kvAdaylar + kvSec → du.kvPlan {kat, q, uzun}; du.kvAyak.
- Koşu noktası = top − u(r)·gm, r = a ± yay. Vuran ayağın ters yanındandır; du.yay ve V1a bit 8 ile aynı işaret.
- gm kvGeri'den: kısada mesafeyle, uzunda sutGucu ile. Kale çizgisine ≥ 0,5 m ve saha içine kıstırılır.
- Yazılanlar: du.aci, du.geriX/Z, du.bakis = hedef, du.sahneKos (kısa 1,1, uzun 1,5).
- kvIsaret jestinin hedefi plan hedefidir.
- Kullanımda bağlılık:
  - Taze kvAdaylar; kısa plan alıcıyla, uzun plan kategoriyle eşlenir.
  - x'.U ≥ max − kvBaglilik ise taze sec kullanılır.
  - Değilse kvSec ve du.kv.degisti.
  - du.kv'ye erken ve degisti eklenir.

Bit 4 (sahne&1 gerekir). Top konunca:
- kvB = lerp(kvBekle, kisaPay)·(1 ± 0,15·h2).
- kvBasT = yerT + 0,6.
- du.kvGeriT = max(kvBasT + kvB, son − 0,8 − walkT).
- du.kvSon = max(son, kvGeriT + walkT + 0,8).

Evreler:
- Top başı: 0,9 m geride, sahaya dönük; bir kez 'isaret' jesti.
- kvGeriT'de plan (bit 2) ve koşu noktasına geri yürüyüş: hizOran 0,2–0,6, topa dönük.
- Varışta ya da kvSon − 1,0'da 'kol' jesti hedefe.
- duranHazirMi, du.t < kvSon iken false döner.
- sahneKur: zorlaHazir = max(28, kvSon + 10).
- Sayım (zgEk) kuralı aynen.

Plan anı: bit 4 varsa kvGeriT; yoksa yerT + 0,6.

**Denetim:** Senaryolar:
- `mac-deneme 4`.
- `d-dagitim` kale vuruşu hücreleri:
  - Sağ ayaklı kaleci sağ stopere: koşu noktası hedef doğrultusunun 14° solunda, 1,6–2,2 m geride; f ≈ −0,25; sağ ayak içi; 20 m'de 0,3–0,5 m eğri.
  - Uzun 50 m: koşu 3,6–5 m, 0,6 rad, lofted.
  - Presçinin girdiği kısa plan: yeniden plan ve degisti.
- `--seyrek d-duran`, `d-topcu`, `m-isinma`, `m-fotograf`.

k-kurma:
- karar anında |gövde–hedef| 90. yüzdelik ≤ ~25°;
- karar→temas kısada ~0,9–1,3 sn;
- koşu noktasında hareketsiz 90. yüzdelik ≤ 1,0 sn;
- plan değişme ≤ %10–15;
- jest–hedef uyumu %100;
- kısa payı gürültüde;
- kale vuruşundan sonraki 12 sn'de kendi 40 m'sinde kayıp (bilgi).

Son:
- k-sahne tempo.
- `ikiz-deneme`: duruş ve kaleci akışı.
- Yığın 0 → 10 maç `--ayni`.

### V1e-3 — Elden dağıtımın hazırlık evresi (dagitimHaz); V1e dengesi ve commit

**Dosyalar:** `js/mac-kaleci.js`, `js/mac-topla.js`

`kaleciElde`:
- Karar karesinde kaleciDagitim aynen çağrılır; çekilişler aynı yerdedir.
- Ardından `Match.dagitimBaslat(gk, k)`:
  - Stil kesinleşir: yuvarla; elleAtis L > 28 'ust', değilse 'omuz'; degaj koşan arkadaşa < 45 m 'dusurme', değilse 'punt'.
  - Süre: Th = lerp(H0, H1, KV_DAG[stil].w) + 0,12·max(0, |f| − 0,5); kontrada ×0,8; [0,3, H1 + 0,25] aralığına kıstırılır.
  - Adım: KV_DAG[stil].adim (1/1/2/2/3) × 0,7 m.
  - gk.eylem 'dagitim' = {t, sure, kalan, tur, stil, q, hx, hz, adim, x0, z0, dil}.
  - gk.tutus ve b.tasiyan sürer.

`Match.dagitimAdim` (kaleciElde'nin başında):
- Hedef her adımda bugünkü formülle tazelenir.
- gk.yonHedef hedefe.
- Adım hedefi ceza sahasında kalır: u ≤ CEZA_U − 1,0, |z − MZ| ≤ CEZA_W − 0,7.
- hizOran = clamp(yol/Th/maxSpd, 0,15, 0,6).

`Match.dagitimBirak`:
- Bugünkü bırakış gövdesi kullanılır; normal() yön hatası burada çekilir.
- Eylem bugünkü 'elleAtis'/'degaj' {t: 0} olur; dil kopyalanır.

Diğer:
- EYLEM_ADIM.dagitim true döner.
- `taramaAdim`: 'dagitim'de bakış hedefe.
- dagitimHaz [0, 0] → bugünkü yol.

dil (dagitim):
- sal: yuvarla v/22, elle /24, degaj /28.
- egim on (rad): yuvarla 0,55; omuz 0,2; üst 0,25 (yan 0,1); düşürme −0,1; punt −0,2.
- kol: 0,3 / 0,8 / 1 / 0,8 / 1.
- don {a0, yol 'adim' | 'yok'}.
- topY: 0,1 / 1,9 / 0,9.
- Degajda sema: punt → lofted, düşürme → surulmus.

V1e sonu:
- 40 maç kvV1 7 + dagitimHaz ↔ 0.
- Oturum sonu (--seyrek); commit: 'V1e: kale vuruşu ve dağıtım'.

**Denetim:** - `mac-deneme 4`.
- `d-dagitim` dağıtım hücreleri:
  - sol beke yuvarlama ~0,47 sn; bırakışta |gövde–atış| < 15°;
  - kontrada üstten atış ~0,51 sn ve ceza sahası kıstırması;
  - punt 3 adım.
- `d-sut`.
- d-kaleci:
  - bırakışta |gövde–atış| 90. yüzdelik ≤ 20°, en çok ≤ 35°;
  - dağıtımda topun takımda kalması gürültüde.
- `--seyrek d-topcu`, `m-isinma`, `m-fotograf`, `d-penalti`.
- `ikiz-deneme`.
- `ad-denetimi`: yeni Match yöntemleri ve KV_DAG.
- 40 maç: sağlık aralığı ve tempo.
- `oturum-sonu --seyrek --mac 24`.
- Yığın 0 → 40 maç `--ayni`.

### V1-son — Denge, tur kapanışı, belgeler ve main

**Dosyalar:** `js/mac-topla.js (pasZaman değeri)`, `araclar/taban/v1.json`, `FUTBOL_KUTUPHANESI.md`, `TEKNIK_PLAN.md`, `kutuphane/J-beden-dili.md`, `CLAUDE.md`, `YOL_HARITASI.md`, `MAC_MOTORU_GERCEKCILIK_PLANI.md`

(1) pasZaman yeniden taranır.
- V1a ve V1b'nin isabet kazancından sonra, 40 maçta en çok iki değer: bugünkü ve bir üstü (ör. 0,3 ↔ 0,45).
- Önce isabet koşulu, sonra çıkış hızı ortancası ≥ 14,5 (hedef ~16).
- Tutmazsa ortanca borç olarak yazılır. Güç–hata çarpanının oyuncu tavanına ölçeklenmesi ayrı bir bittir, sonraki turun işidir.

(2) CLAUDE.md tur kapanışı listesi:
- 80 maç `--karsilastir <S1 tabanı>`: sağlık aralığı dışında 0 satır; Z ölçüleri; robotluk karnesi.
- Bütün senaryolar: `oturum-sonu --seyrek` (z-s3, z-s10, z-s14 dahil).
- `ikiz-deneme` (kuşkuda `--esit`) ve `ad-denetimi`.
- Duyarlılık karnesi `oyuncu-karnesi.js 80 1 --duyarlilik`. Görünmesi gerekenler:
  - pas ve sutGucu → sert + sürülmüş payı ve isabet;
  - disAyakBecerisi → dış ayak ve trivela payı;
  - sogukkanlilik → 'adim' modu;
  - sutGucu → uzaklaştırma menzili.
- Hız:
  - S1 kodu depo dışına `git worktree add --detach` ile alınır.
  - Aynı süreç `hiz-olcum.js 2 --tekrar 8 --kok`; ortanca artış ≤ %10; 250 ms tavanı.
  - Süreçler arası çiftler bilgi içindir; gerekirse `hiz-evre`.
  - Çalışma ağacı sonra silinir.
- V1 yığını 0 → S1 tabanına 40 maç `--ayni`.

(3) Çizim dosyasına dokunulmadı ama motorun girdisi değişti; Claude'un kendi doğrulaması (kullanıcıya sunulmaz):
- `python araclar/kontrol.py`: yeni üst düzey adlar tarayıcıda.
- `python araclar/an-yakala.py`: vuruş, uzaklaştırma, kale vuruşu ve dağıtım anları, önce/sonra.
- `python araclar/animasyon-olcum.py --karsilastir <K1/S1'in animasyon tabanı>`:
  - 'A: vuruş stili', 'A: zamanlama' ve 'A: kurtarış' gerilemez;
  - 'dagitim' eylemini çizim yok sayar.

(4) Belgeler (belgeNotu) ve yeni taban:
- `araclar/taban/v1.json` (80 maç).
- Çalışma ağacında yalnız v1.json ve S1 tabanı kalır.

(5) Kapanış:
- Commit: 'V1 main'e alındı'.
- `main` ileri sarılır; `tur/v1` açıklamalı etiketi.
- push (kullanıcının açık izni).
- Birleşen dal silinir.
- A10 `main`'den açılır.

**Denetim:** - Yukarıdaki listenin hepsi geçer.
- Kapı tutmayan bit varsayılanda 0'a iner (birebir yol); neden ve ölçü devam notuna borç olarak yazılır.
- Belgelerde yerel bağlantılar denetlenir.
- `git diff --check`.
- 80 maç `--ayni` tekrar okunmaz: tabanı üreten koşudur.

## Sözleşme (motor → çizim)

- *Vuruşun dili (V1, 2026-10-20; `p.eylem.dil`, oyuncunun `vurus` eyleminde):*
  - Motor saf `vurusDili(m,p,e,evre)` ile üç anda yazar:
    - `evre` 0: hazırlığın başı (`vurusBaslat` sonu; plan);
    - `evre` 1: geri salınıma geçiş;
    - `evre` 2: temas (`vurusYap` sonu; ıskada da).
  - Rastlantısızdır; motor kararları okumaz. Motorun kendi planı `e.vp`'dir; çizim `vp`'yi okumaz.
  - `MOTOR_AYAR.vurusDil` 0 iken `null` olur; çizim bugünkü yoluna düşer (`stil`, `gucPlan`, `guc`, `kalan`/`kalanCiz`).
  - Alanlar:
  - `sema` — yedi beden şeması (J.5): `itme` | `sertIc` | `surulmus` | `lofted` | `chip` | `dis` | `vole`.
    - Kaynağı `vurusSemasi`; ince ayrım `stil`'de kalır (`yarimVole`, `falso`, `burun`).
    - Evre 0'da planlanır. Temasta stil değiştiyse yenilenir (vole, burun, yerden pasta tavanla aile değişimi).
    - Eşleme:
      - dış ayak ve trivela → `dis`;
      - vole / yarım vole → `vole`;
      - aşırtma yayı ya da stili → `chip`;
      - şut plase/falso → `sertIc`; sert/düşen → `surulmus`; burun → `itme`;
      - havadan (pas, uzun, orta, korner, uzaklaştırma, kurtarış, `alcakPas`) → `lofted`; yalnız taça kısa uzaklaştırmada L ≤ 14 → `sertIc`, daha uzunu `surulmus`;
      - yerden aileye göre: `birak`/`itme` → `itme`, `sert` → `sertIc`, `surulmus` → `surulmus`.
  - `sal` — 0,1–1, geri salınım genliği.
    - Evre 0'da planlanan, evre 2'de gerçekleşen çıkış hızı ÷ şemanın tam yaklaşmalı azamisi.
    - Azami = `VURUS_TEK[sema].v[2]` × oyuncu çarpanı: güç ailesinde 0,85 + 0,3·sutGucu, öbürlerinde 0,92 + 0,16·pas; zayıf ayakta ×(0,8 + 0,2·zayifAyak).
    - Gelişinede ve tek dokunuşta ×0,8.
    - Şemaya görelidir: çizim şemanın kendi açı aralığına eşler (itme: kalça 0→10°, diz 20→50°; sürülmüş: 10→29°, 60→105°; J.1) ve takip yüksekliğini bundan alır.
    - `ANM_VK_STIL.S` × mesafe × tek dokunuş × baskı sezgisinin yerine geçer; kimlik çarpanı kalır.
  - `don` — `{a0, yol, secim, hedef, kalan, adimT, adimYan}`:
    - `a0`: karar anında gövde–hedef açısı (rad; vuran ayağın çerçevesinde, + = hedef vuran ayağın dış yanında).
    - `yol`, kapanma yolu:
      - `hizali`: düz;
      - `pelvis`: doğal yanda açık beden, pelvis salınımda kapatır;
      - `adim`: ayar adımı; destek ayağı hedefe basar, pelvis döner;
      - `acik`: zaman yok, aceleyle açık bedenle vuruş;
      - `dis`: gövde hedefe dönmez, dış ayakla kısa kamçı.
    - `secim`: `guclu` | `zayif` | `dis` | `sabit` (duran topun `sec.ayak`'ı) | `iki`.
    - `hedef`: hazırlıkta gövdenin hedef yönü (dünya açısı; dışta tutulan açı).
    - `kalan`: evre 1 ve 2'de vuran ayağın çerçevesinde kalan açı, yani pelvisin salınımda kapatacağı. İç ve üstte ≤ 0, açıkta ≤ +0,61, dışta 0,30–1,25.
    - `adimT`: ayar adımıyla dönüşün süresi (sn; 0 adım yok, ≤ 0,35).
    - `adimYan`: −1 | +1 (dünyada dönüş yönü).
  - `adim` — `{n, t0, t1, bak, acma}`:
    - `n`: temastan önceki yerinde ayar ve güç adımı sayısı, 0–2 (dönüş adımı dahil).
    - `[t0, t1]`: adımların penceresi, eylem saatinde (`e.t`).
    - `bak`: hazırlığın başında hedefe bakış (sn; ≥ 28 m vuruşta 0,15–0,25; penceresi [0, bak]).
    - `acma`: adımlar açma dokunuşuyla atılır; motor oyuncuyu gerçekten yürütür.
    - Duran topun koşusu motorun yürüyüşüdür, `n`'e girmez.
    - Çizim D2'nin faz ayarını (±%25) bu pencereye ve `kalanCiz`'e yayar.
  - `egim` — `{on, yan}` (rad):
    - `on`: + öne/topun üstüne, − geriye (havadan, aşırtma, acele).
    - `yan`: + vurmayan tarafa/topun ters yanına (vole 0,065 + 0,65·top yüksekliği, J.3.3; acele; plase +0,1); − vuran tarafa (dış ayak).
    - Temastaki değerdir. Çizim geri salınım tepesinde yarısını, temasta tamamını uygular; pozların gömülü eğiminin yerine geçer.
  - `kol` — 0–1, karşı kolun yukarı-dışa açılması (gerilim yayı; J.1, J.5).
    - Değer: tablo tabanı + salınım payı + 0,25·acele + 0,4·max(0, `egim.yan`).
    - Çizim hazırlıkta yükseltir, geri salınım tepesinde tam açar (kalça ve omuz ekstansiyonu aynı anda), takipte öne süpürür.
  - `mod` — `tam` | `adim` | `kisa` | `yarida`: hazırlığın bütçeye göre biçimi; `yarida`da olay `vurusYarida` gelir.
  - `acele` — 0–1 (= `e.acele`; V1b'den beri pasta ve uzaklaştırmada da).
  - `aile` — `birak` | `itme` | `sert` | `surulmus` | null: yerden pasın hız ailesi.
  - `plase` — iç ayakla falsolu pas: bilek sarılır, gövde hafif yana, bitiriş hedefin dışına.
  - `sicra` — destek ayağı yerden kalkar: acil uzaklaştırmada ve sal ≥ 0,95 havadan vuruşta.
- *Var olan vuruş alanları (anlamı aynı; V1'de değeri değişenler belirtildi):*
  - `stil`, `ayak`, `guc`, `geri`, `hazirlikT`, `kalan`, `kotu`, `tekDokunus`, `acma`, `baski`: değişmez.
  - `gucPlan`: uzaklaştırmada planlanan hız ÷ 29.
  - `hazirlikEn`: bakış + ayar adımlarını içerir.
  - `kalanCiz` (K1): koni ve ayar adımı hızıyla hesaplanır.
  - `acele`: pasta ve uzaklaştırmada da yazılır.
  - `sec`: V1c `aile`; V1d `uz` (`ileri` | `ters` | `acil` | `tac` | `cizgi`), `alt` `kurtar`, `T`; yaylar `alcakPas`, `kurtar`, `uzak`, `tac`.
- *Kaleci (V1e):*
  - Eylem `dagitim`:
    - `t`, `sure`, `kalan`;
    - `tur`: `yuvarla` | `elleAtis` | `degaj`;
    - `stil`: `yuvarla` | `omuz` | `ust` | `dusurme` | `punt`;
    - `q`, `hx`, `hz` (her adımda tazelenir);
    - `adim`: 1/1/2/2/3;
    - `dil`: `{sal, don: {a0, yol: 'adim'|'yok'}, egim: {on, yan}, kol, topY}`; `topY` bırakış yüksekliğidir (0,1 / 1,9 / 0,9).
  - Top `gk.tutus` ve `b.tasiyan` ile eldedir.
  - Çizim stile göre hazırlık pozunu alır; elde taşınan top `kalan` → 0 iken `topY`'ye ve gövdenin 0,3 m önüne iner.
  - Yedek: çizim bilmediği eylemi yok sayar.
  - Bırakışta bugünkü `elleAtis`/`degaj` `{t: 0, stil}` eylemi gelir, `dil` kopyalanır (degajda `sema`: punt → `lofted`, düşürme → `surulmus`).
- *Duruş ve jest (V1e):*
  - Kale vuruşunda `durus.bakis` plan hedefidir (kvV1&2; Z2e'nin hedef↔top bakış sırası).
  - `durus.aci` koşu çizgisidir.
  - Jest `isaret` top başında; `kol` jestinin hedefi planın hedefidir.
  - `durus.kv.erken`, `degisti`, `kvPlan`, `kvGeriT`, `kvSon` ölçü ve motor içindir; çizim okumaz.
- *Kafa (V1d):* `kafa` eyleminde `uz`: `arkadas` | `kenar` | `yarim` | `cizgi`. Panik uzaklaştırmasının yönüdür; çizim boyun ve gövdeyi çevirebilir (öncelik düşük).
- *Top:*
  - `egri` aileye ve plaseye göredir: plase 20 m'de 0,3–0,8 m telafisiz; itme ~0,1; dış ayak ~0,75.
  - `vy`: sert ve sürülmüş yerden pasta ≤ 1,25 m/sn (tepe ≤ 8 cm, sekmesiz).
  - `sec.yay` `alcakPas`: tepe 0,8–1,4 m.
  - Çizim topu konumundan okur.
- *Olaylar (salt okunur):* `vurusYarida {p}`, `clear {p, uz, L, adim, deger, enDiger}`, `pass` `{… alt: 'kurtar'}`, `block {uzun: true}`.

## Kabul

V1 aşağıdakiler sağlanınca kapanır. Ölçüt dar bant değil; görünürlük, çeşitlilik, duyarlılık ve sağlık aralığıdır (FUTBOL_KUTUPHANESI §11). CLAUDE.md'nin tur kapanışı listesi ayrıca geçerlidir.

BİREBİRLİK
- V1'in bütün anahtarları 0 iken (yuzeyKarar, pasAile, hazirlik, uzakAmac, kvV1, dagitimHaz [0,0]) S1 tabanına 40 maç `--ayni` tutar.
- vurusDil 1 tek başına sonucu değiştirmez.
- kvAdaylar/kvSec bölünmesi `--ayni` tutar.
- `ikiz-deneme`: Aynılık N/N.

KULLANICININ NOTLARI SAHADA

Not 3 — stoperden sağ beke dış ayak:
- Açık oyun yerden pasta dış ayak %2–6 (önce %12,2).
- Dışların ≥ %95'i L ≤ 12 ya da becerikli oyuncunun trivelası; dışta 'zaman vardı' 0.
- Stoperin dış yandaki (> 20°) pasında dış ≤ %5; kalanı adım ya da pelvis + iç ayak.
- Geri başında yanlış yan > 15° (açık hariç) ≤ %2 (önce %20,9); temasta ≤ %3 (önce %14,1).
- Zayıf ayak %10–18 (önce %19,3).
- v-yuzey kapıları geçer.

Not 2 — paslar dümdüz:
- Yerden çıkış hızının %10–%90 aralığı ≥ 9 m/sn; histogramda en az iki tepe.
- Ortanca ≥ 14,5 hedeflenir (~16). İsabet önce gelir; tutmazsa borç.
- Aile payları: bırakma ≥ %4; sert + sürülmüş ≥ %25.
- Plase payı ≥ %5; 20 m eğrisi 0,3–0,8 m.
- Yerden pasta havalanma %10–30 (önce %0,9).
- Alçak havadan kısa pas 1–4/maç.
- dil.sal teknik başına üç ayrık bant.
- Yedi şemanın hepsi görülür (chip nadir).

Not 4 — sıkışan kanat kalçadan auta:
- Ayakla uzaklaştırmada hedef saha dışı ≤ %15 (önce %63).
- 5 sn içinde oyun dışı ≤ %30 (önce %60).
- İlk dokunan biz ≥ %30 (önce %17).
- Sıfır hazırlıkla ≥ 28 m havadan vuruş 0.
- Adımsız uzaklaştırma ≤ %25, hepsi ≤ 22 m.
- Hazırlık ortancası ≥ 0,22 sn (önce 0,037).
- Menzil baskıyla tekdüze azalır: rakip ≤ 1 m'deyken ortanca ≤ 24 m.
- Kafa uzaklaştırmasında tepe > 8 m: 0.
- Kaleciye geri pas bölgede ≥ 0,5/maç.
- u-uzak U1–U7 geçer.

Not 6 — kaleci dış ayakla sağa:
- Kısa kale vuruşunda dış ayak 0 (önce %4–6); tek ayaklı kalecide zayıf ayak 0.
- Karar anında |gövde–hedef| 90. yüzdelik ≤ ~25° (önce 87°).
- Koşu noktasında hareketsiz 90. yüzdelik ≤ 1,0 sn (önce 6,7).
- Elden dağıtımda bırakışta |gövde–atış| 90. yüzdelik ≤ 20°, en çok ≤ 35° (önce 71° / 170°).
- d-dagitim kapıları geçer.

DUYARLILIK (oyuncu-karnesi --duyarlilik; görünür ve doğru yönde olmalı)
- Pas ve sutGucu → sert + sürülmüş payı ve isabet.
- disAyakBecerisi → dış ayak ve trivela payı.
- sogukkanlilik → 'adim' modu.
- sutGucu → uzaklaştırma menzili.

TEMPO VE AKIŞ
- Karar→temas (yerden ≤ 22 m) ortanca artışı ≤ +0,1 sn.
- Vazgeçme/maç ≤ 1,5 × taban.
- Pas/maç düşüşü ≤ %8.
- Top oyunda süresi gürültü içinde.
- a-akis 'Alış → vuruş', 'Geri geri' ve 'Gelişine' satırları bozulmaz. Gelişine bozulursa bit 2'nin dışında kalır (borç).

PLANLAYICI KALİBRASYONU
- P'li pasta aile başına tahmin↔gerçek ±5 puan; alçak havadan ±10.
- c-orta |tahmin − gerçek| ≤ 10.
- Uzaklaştırmada planlanan Pb ↔ gerçekleşen blok: bilgi.

SAĞLIK ARALIĞI (80 maç; S1 tabanından kötü değil)
- Gol 1,8–4.
- Şut.
- Pas isabeti 65–90 ve taban − 2 puandan düşük değil.
- Uzun pas %8–30 (gerçek 10–20).
- Gerçekleşen ÷ konum xG 0,8–1,35.
- Z ölçüleri ve robotluk karnesi.

KAPILAR (çıkış 0)
- Mevcut: b-pas, t-top (eski bölümler + 6–8), c-1v1, c-koru, c-kanat, c-orta, c-surus, c-temas, c-yariyariya, c-donen, c-hava, c-hareket, d-duran, d-sut, d-penalti, d-topcu, v-sut, o-ofsayt, o-sakatlik, p-tip, m-isinma, m-fotograf, z-s3, z-s10, z-s14.
- Yeni: v-yuzey, v-hazirlik, u-uzak, d-dagitim.

HIZ
- Aynı süreçte eşleştirilmiş oranın ortancası ≤ %10 (beklenen ≤ %5); 250 ms tavanı.

ÇİZİM (Claude'un kendi doğrulaması)
- kontrol.py, an-yakala ve animasyon-olcum'da 'A: vuruş stili', 'A: zamanlama', 'A: kurtarış' gerilemez.

KAPI TUTMAZSA
- O bit varsayılanda 0'a iner (birebir yol) ve borç olarak yazılır; tur yine kapanır.

## Belge notu

TUR BAŞINDA (V1-0a'dan önce)

FUTBOL_KUTUPHANESI.md'ye §12.14 'V1 — vuruş ve pas dili (plan)' yazılır. İçeriği:
- amaç (notlar 2, 3, 4, 6);
- beş tasarımın birleştirme kararları:
  - tek dil sözleşmesi ve motor tarafında vp;
  - yedi şema ve vurusSemasi;
  - VURUS_TEK;
  - zamanButcesi;
  - dönüş ve güç adımlarının örtüşmesi; V1d'nin kendi adım tablosunun kalkması; '0,5/1 m geri alma'nın uygulanmaması;
  - 'acik' toleransı;
  - sıra V1a → V1c → V1b → V1d → V1e;
  - kale vuruşunda V1a + V1e;
  - ölçü dosyaları;
  - ayarAdim → donusAdim adı;
- anahtar listesi, alt adımlar ve kabul.
§12.13'teki V1 satırı ve tablodaki 'V1' kapsamları bu bölüme bağlanır.

TUR KAPANIŞINDA

FUTBOL_KUTUPHANESI.md, aynı bölüme 'V1 — Sonuç':
- önce/sonra sayıları (S1 tabanının 80 maçı ↔ v1.json);
- açık kalan ve kapatılan bitler;
- hız;
- borçlar: gelişine konisi, pasZaman ortancası, güç–hata çarpanının oyuncu tavanına ölçeklenmesi, temizlemeden sonra hattın yükselmesi (D13), kafanın genel dikey gürültüsü (T6/C), alçak havadan kalibrasyonu ve tutmayan diğer bitler.

TEKNIK_PLAN.md §8:
- Akış tablosu satırları:
  - B: V1a–V1d (yuzeyOlasilik, vurusKoni, vurusSemasi, VURUS_TEK, zamanButcesi, aileAdaylari, vurusHazirlik, havaCikisHizi, vurusMenzil, uzaklastirSecenekleri, kafaUzakHedef, vurusDili);
  - D: V1e (kvAdaylar/kvSec, kvPlanla, kvVurusAyari, dağıtım eylemi; 'kvBekle okunmuyor' ifadesi düzeltilir);
  - C: presYap'ın uzun vuruş bloğu;
  - Kurallar/K: kale vuruşu evreleri.
- 'Motor → çizim sözleşmesi'ne V1'in maddeleri: sozlesme alanındaki liste aynen.
- 'Araçlar'a u-uzak.js ve yeni senaryolar; tabanlar listesi v1.json ve S1 tabanı.

kutuphane/J-beden-dili.md:
- J.8'in yüzey ve ayak, hazırlık, uzaklaştırma ve pas hızı maddelerine 'V1'de kapandı' notu ve ölçülen önce/sonra sayıları.
- Çizim ve düşüş maddeleri A10/A11'e açık kalır.
- J.10'a 'uygulandı (V1)' ve hangi satırın hangi eklentide olduğu.

CLAUDE.md 'Kontrol', senaryo kapıları satırına V1'in sahipleri:
- yuzeyOlasilik / vurusKoni / donusAdim / yuzeyKarar → v-yuzey, b-pas, c-surus, c-orta;
- aileAdaylari / pasAile / pasEgri / pasKalkis / alcakPas → b-pas, t-top (6–8), z-s14, p-kalib;
- vurusHazirlik / haz* → v-hazirlik, c-orta, c-temas, c-yariyariya;
- uzaklastirSecenekleri / uzak* / kaleciHata / kaleciAgiz / kafaUzakHedef → u-uzak, c-hava, d-duran, d-sut;
- kvV1 / kvPlanla / kvBekle / dagitim* → d-dagitim, d-duran, d-sut, k-kurma.
Ayrıca oturum sonu çekirdeğine v-yuzey, v-hazirlik ve u-uzak, seyreğe d-dagitim eklenir; turun tabanı v1.json yazılır.

MAC_MOTORU_GERCEKCILIK_PLANI.md Ek G2: vuruş dilinin motor sözleşmesine (`p.eylem.dil`) bağlantı.

YOL_HARITASI.md:
- Güncel karar özetine V1: tarih, sonuç, taban, borçlar.
- Devam notuna sıradaki A10: dil'i çizer, motora dokunmaz; önce kopyası K1 zincirindeki `dondur.js` ile; animasyon tabanı.

DEPOYA ALINMAYANLAR
- Kalıcı olmayan dökümler: önce sayıları, 40 maçlık taramalar, prototip betikleri.
