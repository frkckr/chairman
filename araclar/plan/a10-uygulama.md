<!-- Üretildi 2026-10-21: Claude'un 2026-10-20 oto mod oturumunda tasarım ajanlarının çıkardığı ve birleştirdiği uygulama planı. Kaynak JSON'u aynı klasörde (<tur>-tasarim.json: alan tasarımları). Kabul ve sıra kullanıcı onaylı programın (FUTBOL_KUTUPHANESI §12.13) içindedir; bu dosya uygulayıcı için ayrıntıdır, belge değildir. -->

# A10 — uygulama planı (2026-10-20; Claude'un tasarımı, kullanıcı onaylı program §12.13)

**Durum (2026-10-21 sabah, dizüstü):** Henüz başlamadı; V1'in sözleşmesi (`p.eylem.dil`) uygulandıktan sonra, V1 dalının ucundan açılır. "a10 tabanı" / "--once s1" yerine o günkü güncel taban ve önce kopyası.

## Plan

A10 — vuruş, pas ve istek çizimi: birleşik uygulama planı (E akışı; motor sonucu değişmez)

ÇERÇEVE
- Sıra K1 → S1 → V1 → A10 → A11. A10, V1 `main`'e alındıktan sonra `claude/motor-a10` dalında açılır (main'den, yani V1'in ucundan).
- Oto mod (kullanıcının 2026-10-20 izni): her alt adımın sonunda dalda commit atılır. Kapanışta 'A10 main'e alındı' commit'i, ff `main`, `tur/a10` etiketi ve push.
- Motor tabanı `araclar/taban/v1.json`; devam notunda yazan ad esastır. Yeni motor tabanı yazılmaz.
- A10'un dokunmadıkları: `js/mac-*.js`, `MOTOR_AYAR`, `index.html` yükleme sırası. Her alt adımda 40 maç `--ayni` tutar.
- Değişen ürün dosyaları yalnız `js/animasyon.js` ve `js/stil-99.js` (`STIL.animasyon.a10`).
- Değişen araçlar: `animasyon-olcum.py`, `poz-galerisi.html`, `an-yakala.py`, `animasyon-karsilastir.html` (önce listesi) ve `araclar/karsilastir/s1/`.
- S1 şu an çalışma ağacında uygulanıyor; V1 de aynı işlevlere dokunacak. Satır numarası değil, işlev adı esastır.
- A10-0'da V1'in uygulanmış sözleşmesi okunur (`vurusDili`, `dagitim` eylemi, TEKNIK_PLAN §8). Plandaki adlarla fark varsa eşleme yalnız `anmVkDil`'e yazılır.
- Kullanıcıya sahne üretilmez. Galeri, film şeridi ve ölçü yalnız Claude'un kendi doğrulamasıdır.

DÖRT TASARIMIN BİRLEŞTİRİLMESİ (Claude kararları; §12.16'ya görünür yazılır)

1. Tek anahtar ağacı: `STIL.animasyon.a10` (a9'dan sonra, a8/a9 yorum kalıbında).
- Ana anahtar `acik`. 0 iken bütün A10 çizimi eski yoldan gider; önceye birebir eşitlik yalnız bununla sınanır. Kullanım: `--anm '{"a10":{"acik":0}}'`, galeride `&a10=0`.
- Parça anahtarları: `sema`, `gerilme`, `egim`, `bakis` (A10a), `ayar.acik` (A10b), `istek.acik` (A10c), `dagitim` (kaleci). Her biri 0 iken o parça eski yoldan çizilir.
- Tablolar: `tarif` (D1, 7 satır), `stil`, `kol`, `vurKol`, `haz`, `egimPay`, `yanPay`, `bas`, `sicra`, `jitter`, `inis`, `kapaTemas`, `ayar{}`, `istek{}`, `dag{}`.
- Ölçü eşikleri STIL'e girmez, araçta durur.
- Çözülen çakışmalar:
  - A10d'nin `a10.acik`'i, A10a'nın parça anahtarları, A10b'nin `ayar.acik`'i ve A10c'nin `istek.acik`'i tek ağaçta toplandı.
  - A10b'nin `ayar.sal` anahtarı (destek adımı süresi) `ayar.adimSure` oldu; `dil.sal` ile karışmasın.

2. dil'in tek okuyucusu: `anmVkDil(a,p,vur,an)`.
- Üç anda okur: E1 hazırlığın başı, E2 son adım, E3 temas. Değer kopyası alır. A10b'nin planı da sema, don, adim ve mod'u buradan okur.
- Çizim dil türetmez. A10b'nin "dil null ise V1a konileriyle yedek çıkarım"ı ve A10a prototipindeki `anmDilSim` ürüne girmez.
- dil yoksa (vurusDil 0, galerinin eski satırları, dondurulmuş kopya) bütün vuruş katmanı bugünkü yoldan gider: şema, gerilme, ayar adımı, dönüş.
- Yaklaşık şema eşlemesi yalnız ölçü aracında kalır (dil'siz sayım).

3. Durum iki alt nesnede.
- `vk.a10` (A10a): R/M tarif kopyası, Qs/Q, tepe, sal, kol, egOn/egYan/egD, ac, sicra, wV/wK, ofs, dS/dG, hT, basKalk, j1/j2.
- `vk.ay` (A10b).
- vk'ya yalnız `a10`, `ay` ve `no` eklenir. vk bugün ~83 alandır; A3'ün 128 sınırından uzak durur.
- `vk.pk` şema adını taşır.
- Ortak adlar:
  - A10a'nın `vk.hyEk`'i = `vk.ay.hyP`;
  - A10a'nın `vk.adimF`'i ve A10d'nin `vk.fazOran`'ı = `vk.ay.k`;
  - A10d'nin `vk.tPlan`'ı = `vk.a10.tepe`.

4. Tek zaman çizgisi; sahibi A10b.
- `anmVkPlan` şu anları yazar: tO, tS, tPl, tG, tD, tE. tD tariften gelir (tD(sal)).
- A10a'nın gerilme penceresi, geri salınım eğrisi g ve baş bakışı zamanı `anmVkSaat(vk)`'den okur. ay açıkken bu `ay.tG`'dir (vuran ayağın gerçek kalkışı), değilse `vk.tB`.
- A10-1'de `anmVkSaat` tB döner; A10-2 onu tG'ye bağlar.
- Karşı kolun ve kalçanın tepesi aynı karededir (tD; J.1).

5. Destek ayağının basış yeri tek tablodur: `tarif.<şema>.destek = [geri, yan]` (m).
- Değerler: itme [0,08; 0,22], sertIc [0,09; 0,25], surulmus [0,10; 0,27], lofted [0,18; 0,30], chip [0,08; 0,21], dis [0,14; 0,20], vole [0,08; 0,35].
- Ekler: volede yana +0,5·max(0, topY − 0,2); sert0'da yana +0,02.
- A10a'nın [yan, geri] sütunu ile A10b'nin `basis` tablosu burada ortalandı (J.1: ~0,10 m geri, ~0,30 m yan).
- Yön kd'dir; dış yolda `dil.don.hedef`. Sahibi `anmVkBasisYeri`.

6. Kök kaymasının tek mekanizması A10b'nin iki eksenli kaçağıdır.
- İleri pay şemadan gelir (`tarif.ofs`): itme 0,15, sertIc 0,15, surulmus 0,18, lofted 0,08, chip 0,10, dis 0,12, vole 0,05, degaj −0,20. Basıştan temasa (1 − tc/tPl) ile büyür.
- Düzeltme ≤ 0,12 m, toplam ≤ 0,20 m, hız ≤ 1,5 m/sn, kalabalıkta ×0,7.
- A10a'nın degaj değeri −0,25'ti; tavana, −0,20'ye çekildi.
- `ayar.acik` 0 iken A10-1'in tek eksenli, işaretli ofs'u kalır.

7. Pelvis üç katmandır ve tek sırayla uygulanır.
- Sıra:
  - Z2e `yayKalca` (yayA);
  - A10a poz burulması: G'de `burul`, yay varsa max(0, burul − yayA); T'de `kapa`;
  - A10b `ay.hyP`: pelvis yolunda c·kalan, |·| ≤ 0,3; adım yolunda kalça gecikmesi basışla çözülür; dışta gövde tutulan yönde kalır.
- Toplam köke göre ±1,0 rad (A10a). A10b'nin 0,6'sı volede J.2'nin 55°'lik pelvis dönüşünü keserdi.
- Temasta T'nin kalça payı `kapaTemas` 1'dir. Dönüş kapısında p50 > 15° çıkarsa tek tarama olarak 0,5 denenir.

8. Karşı kolun tek eşlemesi A10a'nınkidir.
- Açılma = lerp(0,3; 1,65; kol^1,3), geri = lerp(0; 0,45; kol) + kolYon.
- A10d'nin "15° + 95°·kol" başvurusu bırakıldı. Araç başvuruyu `STIL.animasyon.a10.kol`'dan hesaplar (açılma ile gerinin bileşke açısı); önce kopyasında araçtaki aynı sabitler kullanılır.
- V1'in VURUS_TEK kol değerleriyle (taban + sal payı) beklenen tepeler: itme 25–41°, dis ~38°, chip ~39°, sertIc ~53°, sürülmüş 69–85°, lofted 84–90°, vole ~77°.
- Kabul bantları bu eşlemeyle ve A10a ile A10d bantlarının kesişimiyle konur. Lofted kapısı tutmazsa kol.abd[1] 1,75'e çıkarılır (tek tarama); V1'e dokunulmaz.

9. Bitiriş A10a'nın tarifinden gelir.
- Sürülmüş şeması hem pası hem şutu taşır (V1). J.5.5'e göre sürülmüş pasta bitiriş alçak, şutta yüksektir; tk(sal) bunu sal'dan verir.
- Kapı ikiye ayrılır: yerden pas 0,30–0,55 m; şutta uyluk ≥ 70°.

10. Ölçü satırları tek takımdır, A10d kalıbında: 'A: <ad> (A10)'.
- Satırlar: vuruş şeması, vuruş ayrımı, dil uyumu, ayar adımı (A10b'nin satırı ile A10d'nin vuruş ayağı birleşir), dönüş yolu, baş, istek, dağıtım.
- A10a'nın 'A: şema' ve 'A: gerilme' satırları 'vuruş şeması'nın içindedir.
- 'A: vuruş stili' dil.sema ile karşılaştırır; 'A: vuruş (T4-V)' tepe/plan oranını `vk.a10.tepe`'den okur.
- Kayma tanımındaki çakışma (A10b kare hızı payı ↔ A10d yol) şöyle çözüldü: kare hızı payı yalnız yerde kilitli ayakta sayılır (vk.yer = 1, sAd ≥ 1 ya da çapa). Kilitli ayağın yolu p90 ayrıca ölçülür.
- Ölçüm kodu animasyon dosyasına girmez: `aktorGuncelle` dışarıdan sarılır; temas görülen eylemler WeakSet'te tutulur.

11. Yapay kipler tek kurulumu (VURUS_JS, KOSU_JS kalıbı) paylaşır.
- `--vurus N`: 7 şema senaryosu × 7 yön × 3 geliş; 196'da baskı değişkesi eklenir.
- `--vurus-zorla SEMA[,YOL]`: dil'i vurusBaslat'tan sonra ezer; motor dil'i okumadığı için sonuç değişmez.
- `--adim N`: duran / 1,4 / 4 m/sn × 7 yön × L {8, 18, 30}.
- `--dagitim N`: kalecinin 5 stili.
- Şema eşikleri yapay kipte kabul edilir. Maç satırları alt adımlarda tohum 7 × 600 sn'de bilgi, kapanışta tohum 3 ve 7 × 600 sn'de kapı ya da bilgidir.

12. Galeride dört sayfa:
- `a10vurus`: 13 satır (A10a ve A10d listelerinin birleşimi);
- `a10adim`: 7 satır (A10b);
- `a10istek` (A10c);
- `a10kaleci`: 7 satır (A10a ve A10d dağıtım satırları).
Ortak sayısal denetim `a10Denetim`'dir; aykırılığı console.error ile yazar, kontrol.py yakalar.

13. İstek jestleri motorsuz kalır (A10c).
- Tür adları 'cagir' ve 'isaret' kalır. Biçim, tutma süresi, pastan önceki jest ve kurma jesti çizimde türetilir.
- A10d'nin an-yakala istek seçicileri motorun türünü değil, çizimin `ANM_IST` kaydını okur.
- Motorun bu jestleri görmesi Z'ye borçtur (öneri: plan&32 'istekGec').

14. Önce kopyası: `node araclar/karsilastir/dondur.js s1`.
- Ad, kopyadaki çizimin turudur; V1 çizime dokunmaz. S1 çizimi değiştirmediyse önce k1 olur.
- A10b'nin `--once a9`'ı ve §12.13'teki 'dondur.js a9' ifadesi güncel değil.
- 'Önce' ölçüleri V1 motoruyla `--once s1` alınır. s1-anm.json S1 motorundandır, karşılaştırma tabanı olamaz.
- Kapanışta M2 uygulanır: karsilastir'da yalnız s1 kalır. A11 `dondur.js a10` ile başlar.

15. Sıra: A10-0 ölçü altyapısı ve önce → A10-1 şema çekirdeği → A10-2 son adım ve faz → A10-3 gerilme zamanlaması, eğim ve baş → A10-4 dönüş yolu ve kaçak → A10-5 istek → A10-6 kaleci → A10-7 kapanış. Gerekçe:
- A10b'nin basış tablosu ve tD'si A10a tarifinden okunur; önce tarif gelir.
- A10a'nın gerilme penceresi A10b'nin tG'sini okur; önce zaman çizgisi gelir.
- Dönüş katmanı ve kaçak hem pozları hem zamanlamayı ister.
- İstek ve kaleci bağımsızdır; kaleci en çok yere dokunan ve en riskli parçadır, en sona kalır.
- Her adımdan sonra çizim çalışır ve her parça kendi anahtarıyla kapatılabilir.

16. Hız.
- Karede ayırma yok; vuruş başına bir FK.
- 'A: süre' (aktorGuncelle ms/kare) aynı oturumda `--once s1` ile karşılaştırılır:
  - alt adım başına ≤ +%5 (dizüstü gürültüsü);
  - kapanışta ≤ önce × 1,10 ve ≤ 2 ms.
- Motorun hızı değişmez; hiz-olcum kapanışta yine koşulur.

17. Test kademeleri (her alt adımda).
- Hızlı:
  - `node araclar/mac-deneme.js 4` (sonuç aynı);
  - yeni ad eklendiyse `node araclar/ad-denetimi.js`;
  - `python araclar/animasyon-olcum.py --sure 60` ve ilgili kip.
- Alt adım sonu:
  - `node araclar/oturum-sonu.js araclar/taban/v1.json --ayni --mac 40` (40 maç --ayni ve çekirdek senaryolar; arka planda);
  - `animasyon-olcum` tohum 3, 180 sn, `--once s1` karşılaştırması ve eski yol eşitliği;
  - ilgili yapay kip;
  - `kontrol.py`: index ve ilgili galeri sayfası;
  - sonuç okunduktan sonra dalda commit.
- Windows'ta Python için `PYTHONUTF8=1`.
- Prototipler yalnız rehberdir; anlamları ürüne girer, kodları girmez. Yerleri (scratchpad): a10a/yama.py, a10b/kok/araclar/a10b-olc.py, a10c/fk2.js ve x-istek.js, a10d/kok/araclar/a10olc.py.

## Alt adımlar

### A10-0 — Açılış, önce kopyası ve ölçü altyapısı (çizim değişmez)

**Dosyalar:** `araclar/animasyon-olcum.py`, `araclar/poz-galerisi.html`, `araclar/an-yakala.py`, `araclar/animasyon-karsilastir.html`, `araclar/karsilastir/s1/animasyon.js (yeni)`, `FUTBOL_KUTUPHANESI.md (§12.16 plan)`, `YOL_HARITASI.md (devam notu: A10 açıldı)`

Açılış:
- `git fetch --prune --tags` ve `git status`; kullanıcının değişiklikleri korunur. V1 `main`'de olmalı. Dal `claude/motor-a10`, main'den açılır.
- Motor tabanı denetimi: `node araclar/mac-deneme.js 4 --karsilastir araclar/taban/v1.json --ayni` tutmalı. Tutmazsa yerel taban üretilir, depoya alınmaz.
- V1'in uygulanmış sözleşmesi okunur: `vurusDili`, `dagitim` eylemi, TEKNIK_PLAN §8. Alan adı, birim ya da eksik alan farkı varsa `anmVkDil`'in eşleme listesine not edilir. dil'in maçta her vuruş eyleminde yazıldığı (penaltı, duran top, kale vuruşu dahil) ölçüyle doğrulanır.
- Önce kopyası:
  - `git diff tur/k1 tur/s1 -- js/animasyon.js js/stil-99.js js/oyuncular.js` boş değilse `node araclar/karsilastir/dondur.js s1`; boşsa kopya alınmaz ve 'önce' k1 olur.
  - `git diff tur/s1 tur/v1 -- <aynı dosyalar>` boş olmalı; değilse ad v1 olur.
  - araclar/animasyon-karsilastir.html'in önce listesine s1 eklenir.
- Plan belgeye yazılır: FUTBOL_KUTUPHANESI §12.16 'A10 — plan' (belgeNotu).

Ölçü altyapısı (araclar/animasyon-olcum.py):
- OLCUM_KUR_JS'e eklenen ölçüler:
  - `vurusA10Olc`: kayıt eyleme bağlanır, temas görülen eylem WeakSet'e girer. Temastan önce: karşı kol açısı, bilek − omuz, yanal uzanım, uyluk ve diz, ayak tepe geriliği ve yüksekliği, yatış. Temasta: yatış, pelvis/omuz ↔ kd ve dil.don.hedef, destek ayağının yeri ve burnu, temas açıklığı, baş, dil kopyası. Temastan 0,45 sn sonrasına dek: bitiriş, kilitli ayağın yolu, kök ofseti, vk.ay.k, görünür basışlar.
  - `ayarOlc` (A10b ölçüleri): bant, son adım başında destek yerde mi, doğal iniş ↔ basış, destek yolu ve hızı, iki ayak havada, kilitli ayakta kayma, havada bekleme, dönüşün son adıma payı.
  - `jestOlc`: elin baş tepesine göre yeri, bileklerin yanal uzanımı, süre, kamera kesitinde süre, görünür istek saniyesi.
  - `dagitimOlc`.
- Sekiz yeni satır: 'A: vuruş şeması / vuruş ayrımı / dil uyumu / ayar adımı / dönüş yolu / baş / istek / dağıtım (A10)'.
  - Hedefler köşeli parantezde, değerler p10/p50/p90 ve payla.
  - Piksel karşılığı `STIL.kameralar.baskan.aci`'dan, 100 ve 60 m için.
  - Bugünkü çizimde satırlar bilgi olarak çıkar.
- 'A: vuruş stili': vk.a10 varken beklenen poz dil.sema'dır, temasta şeması değişenler ayrı sayılır; yoksa eski eşleme. 'A: vuruş (T4-V)' tepe/plan oranını vk.a10.tepe varsa ondan okur.
- Yapay kipler (VURUS_JS ortak kurulumu, DAGITIM_JS): `--vurus N`, `--vurus-zorla SEMA[,YOL]`, `--adim N`, `--dagitim N`. Kip seçilince maç süresi 0 olur.
- Kol başvurusu r(kol), STIL.animasyon.a10.kol'dan hesaplanır; yoksa araçtaki aynı sabitler kullanılır. Yaklaşık şema eşlemesi yalnız dil'siz vuruşlar içindir: stil, sec.tur/tip/yay, v0'ın aileSinifi.

Galeri (poz-galerisi.html):
- `vurusSim`, o.dil'i e.dil'e üç anda yazar. 'adim' yolunda gövde adimT içinde döner (o.don; motorun 5 rad/sn'sini taklit eder).
- `cizelge`'ye 'dagitim' adımı eklenir: b.tasiyan = p, e.kalan.
- `&a10=0` parametresi ve `a10Denetim` iskeleti. Sayfaların satırları alt adımlarla gelir.

an-yakala.py HAZIR'a eklenen seçiciler:
- Şema seçicileri dil.sema ve faz 'geri' ile: v-itme, v-sertic, v-surulmus, v-lofted, v-chip, v-dis, v-vole.
- Duruma göre: v-adim (yol 'adim', hazırlık, e.t ≥ adim.t0), v-pelvis, v-acele, v-alcak, v-plase.
- İstek seçicileri ANM_IST kaydından; tanımlı değilse false: istek-iste, istek-ver, istek-goster.
- kv-dagitim.

'Önce' ölçüleri (V1 motoru + s1 çizimi; scratchpad'e yazılır, depoya girmez, sayılar devam notuna):
- `--once s1`: tohum 3 180 sn; tohum 7 600 sn.
- Kipler: `--vurus 147`, `--adim 189`, `--dagitim 40`, `--duran 24`, `--kaleci 96`, `--olay 80`, `--hiz 4`.

**Denetim:** - Araç bütünlüğü: aynı tohumda şimdiki kod ile `--once s1` bütün A: satırlarında birebir çıkar (çizim aynı). Araç iki kez koşulunca da aynı çıkar.
- `--karsilastir araclar/taban/s1-anm.json` yalnız bilgidir; motor farklıdır.
- Maçta dil'siz vuruş 0 olmalı; değilse nedeni devam notuna yazılır.
- `python -m py_compile araclar/animasyon-olcum.py araclar/an-yakala.py`.
- `python araclar/kontrol.py araclar/poz-galerisi.html`: var olan sayfalar (z2kol, a8vurus, t15kaleci) konsol hatasız; dil'siz satırlar aynı.
- Oyun kodu değişmedi; açılıştaki 4 maç `--ayni` yeter.
- Commit: 'A10-0: önce kopyası s1, A10 ölçü altyapısı ve yapay kipler (sonucu değiştirmez)'.

### A10-1 — Şema çekirdeği: D1 tarif tablosu, FK tepesi, karşı kol, takip, temas kilidi

**Dosyalar:** `js/stil-99.js`, `js/animasyon.js`, `araclar/poz-galerisi.html`

js/stil-99.js — `STIL.animasyon.a10` bloğu kurulur:
- acik 1, sema 1.
- tarif: yedi satır, sütunları A10a §3'teki gibi; destek ve ofs sütunları plan kararı 5 ve 6'daki birleşik değerlerle.
- stil: falso {tkYan +0,25, bilek −0,2}; plase {tkYan +0,18, bilek −0,15}; yarimVole {tk −0,12, kpYan ×0,5; on +0,12 A10-3'te}; burun {diz ×0,5, tk ×0,6, tF 0,06, basT 0,42}.
- kol: abd [0,3; 1,65], us 1,3, geri [0; 0,45], dirsek [−0,55; −0,2], ileri [0,15; 0,7], takipAbd [0,75; 0,6].
- vurKol: G [0,12; 0,45], T [0,2; 0,55].
- jitter [0,08; 0,06], inis 0,12, sicra 0,09, kapaTemas 1.

js/animasyon.js:
- ANM_SLOT: 'vK' [40, 8], vG ile vT arasında.
- anmVkYeni: vk.a10 alt nesnesi (bütün alanlar baştan; tepe Float32Array(3), Qs {sağ, sol, M} sabit anahtarlı) ve vk.no.
- Yeni işlevler:
  - anmVkDil: E1 ve E3'ün şema yenilemesi;
  - anmVkFK: iki kemik; uyluk 0,44, baldır 0,5, taban 0,05, kalça 0,91 m; θ = θh − 0,5·egim.on;
  - anmVkQ, anmVkV;
  - anmA10Yaz: AYNA/AYNA_EKSI ile tarafa çevirir. Değişen poz nesneleri aynala önbelleğine ve anmUstPoz'a verilmez;
  - anmVkSaat: bu adımda vk.tB döner.
- anmVkBasla: a10.acik, a10.sema ve vur.dil varsa anmVkDil(E1) çağrılır ve vk.pk = sema olur; değilse vk.a10.R = null ve eski yol birebir sürer.
- anmVurusDurum yeni yol:
  - Evre 1: bugünkü ağırlık (0,4·h); pencere A10-3'te gelir.
  - Geri salınım: kp = lerp(k0, vk.a10.tepe, g), V = G, vG ve vK yuvaları.
  - Aşağı salınım: Bézier orta noktası tarif.bez'den; volede top yüksekliği.
  - Temas (E3): F (tk, tkOn, tkYan; volede + top), Tm = 0,4 + 0,85·sal, tF, tIn = 0,1 + inis·(F[1] − yG). Sert = sal ≥ hop ∨ sicra; sicra'da destek temasla kalkar, hopH 0,09. Kötü vuruş ofsetleri F'nin üstüne eklenir.
  - Kök kayması: tarif.ofs, tek eksen, işaretli.
- anmVkTemas şema ve stile göre: itme ve sertIc iç; surulmus ve lofted üst; chip aşırtma; dis dış; vole vole; falso, plase ve burun bugünkü gibi.
- D4 temas kilidi:
  - Temas karesinde ayağın IK hedefi, çizilen topun o karedeki yerinden (anmVkTop) yeniden kurulur.
  - Önce itme ve dışta açıklığın kaynağı ölçülür (basış yanı mı, C'nin bayatlığı mı) ve kökü düzeltilir.
- anmVkBasisYeri: vk.a10 varken tarif.destek'ten okur.
- anmEylemler: vk.a10.R varken vG ← Q.V, vK ← Q.K, vT ← Q.T.
- anmEkler: vole ve yarım volede destek parmak ucunda (+0,03).

Galeri `a10vurus` (13 satır):
- itme sal 0,3 ve 0,9; sertIc 0,6; sürülmüş yerden 0,85; lofted 0,5 ve 1 (sicra);
- chip; dış ayak fiskesi 9 m; vole (top 0,5 m); yarım vole (0,25 m); plase falsolu;
- acil uzaklaştırma (lofted, acele 0,8, mod kisa, sicra); burun.
- Kareler: ts − 0,25, ts − 0,1, son adım, temas, +0,09, +0,2, +0,36. Kamera destek ayağının yanında.
- a10Denetim: temasta ayak–top ≤ 0,15 m; kol tepesi sırası itme < sertIc < sürülmüş ≤ lofted; bilek farkı (lofted − itme) ≥ 0,35 m.

**Denetim:** Hızlı kademe:
- `node araclar/mac-deneme.js 4`: sonuç aynı.
- `node araclar/ad-denetimi.js`: yeni adlar (anmVkDil, anmVkFK, anmVkQ, anmA10Yaz, anmVkV, anmVkSaat), bulgu 0.

Eski yol eşitliği:
- `python araclar/animasyon-olcum.py --anm '{"a10":{"acik":0}}'` ile `--once s1` (tohum 3, 180 sn) kemik tabanlı A: satırlarında birebir.

Önceyle karşılaştırma (`--once s1`, tohum 3 180 sn) ve `--vurus 147`:
- 'A: vuruş stili' ≥ %95; 'A: zamanlama' vuruş N/N.
- 'A: vuruş (T4-V)' tepe/plan ortancası 0,9–1,05.
- Karşı kol tepesi bantları ve sırası, bitiriş ve geri salınım bantları (kabul).
- Temas açıklığı ≤ 0,15 m her şemada ≥ %90 (kapanışta %95).
- Evre sınırı dışı > 20° sıçrama ≤ önce + 0,05/vuruş. Aşılırsa A10-3'ün rampası ve yarı bükük dirseği öne alınır.
- 'Eylemde > 20°' ≤ önce × 1,10.
- 'A: süre' ≤ +%5.

Ekran:
- `python araclar/kontrol.py` ve `python araclar/kontrol.py "araclar/poz-galerisi.html?sayfa=a10vurus"`: konsol hatası 0; görüntüleri Claude inceler.

Alt adım sonu: `node araclar/oturum-sonu.js araclar/taban/v1.json --ayni --mac 40`, sonuç okunur, commit.

### A10-2 — Son adım dizilimi ve adım fazı denetimi (D2): destek adımı, önce bas sonra salla, faz ±%25, çapa

**Dosyalar:** `js/stil-99.js`, `js/animasyon.js`, `araclar/poz-galerisi.html`, `araclar/animasyon-olcum.py (yalnız gerekirse satır ayarı)`

js/stil-99.js — `STIL.animasyon.a10.ayar`:
- acik 1, faz 0,25, fazYay 10, fazCad 1,2, fazHister 0,1, devral 0,1.
- yavas [0,8; 2,4], basPencere [0,07; 0,18], basGer 0,06, basEn 0,26, topukKalk 0,02.
- adimSure [0,18; 0,35; 0,24], onAdim [0,22; 0,06], basTol 0,18.
- ayakHiz [2,5; 1,6], kalkis 0,12, vuranCapa 0,55, uzanEn 0,06, duranTahmin 2.
- Kaçak ve pelvis anahtarları A10-4'te gelir.

js/animasyon.js:
- vk.ay alt nesnesi (alanlar A10b tasarımındaki gibi), anmVkYeni'de baştan tanımlanır.
- anmVkPlan (yeni): evre 1'de her kare ve evre 2'nin ilk karesinde çalışır.
  - wk çizilen hızdan; tPlY/tPlK, tSal, tS, tG, tO, tE hesaplanır.
  - 'adim' yolunda basış, motorun dönüş penceresinin sonuna düşer (dil.don.adimT, dil.adim.t0).
  - Duran topta kalanCiz ≥ duranTahmin iken kendi tahmini: mesafe/hız + geri.
  - Faz denetimi: D, k_n, histerezisli n*, kHedef ±faz; kritik sönümlü yay (anmAltAdim).
  - Kapanma: j son salınımındaysa ve penceredeyse; açma itişi sürerken (|a.phItme| > 0,05).
- anmYuruyus: cadS yumuşatmasından sonra, evre 1'de cad *= vk.ay.k.
- anmVurusDurum:
  - Evre 1→2 geçişi tc ≤ ay.tE.
  - Doğal kalkışta devralma.
  - Sigorta: `tc > ay.tE + 0,3 || vk.t > (v > 1 ? 0,3 : 0,7) + (ay.tE − vk.tB)`. eSig aynen kalır.
- anmVkSonAdim:
  - tPl planın tPl'idir; vkGec yalnız alt sınır.
  - Vuran ayak yerdeyse dünya çapası ay.kW'ye alınır, vk.yer[i] = 1.
  - Ön adım alt evresi: n 2 iken ya da vuran ayak havadaysa.
- Evre 2, destek ayağı:
  - Kalkış önce dikey (kalkis).
  - Yatay hız tavanı 2,5 + 1,6·v; aşan pay basış yerini kısaltır.
  - vkUzan beklemesi en çok uzanEn sürer; sonra ayak bulunduğu yere basar.
- Evre 2, vuran ayak:
  - tG'ye dek çapadadır.
  - Topukla kalkar: y = g^0,7, yatay smoothstep.
  - vuranCapa'dan uzaksa erken kalkar.
- anmVkCikis: ay sıfırlanır; yerdeki ayaklar, vuran dahil, çapalanır.
- anmVkSaat artık ay.tG döner. A10-1'in geri salınım eğrisi g [tG → tD] olur.
- Basış yeri A10-1'in tarif.destek'inden okunur; dış yolun yönü A10-4'te.

Galeri `a10adim` (7 satır):
- duran sağa 90° (adım yolu); duran 40° sola (pelvis); yürüyerek düz pas (faz);
- koşarak 18 m sert iç (uçuşlu son adım); dış ayakla sağa 50°;
- duran 40 m havadan (ön adım + basış); kale vuruşu koşu çizgisi.
- Kareler: basış, geri salınım tepesi, temas.
- Pelvis ve dış satırları A10-4'ten sonra anlam kazanır.

**Denetim:** Hızlı kademe: `node araclar/mac-deneme.js 4` (sonuç aynı); ad-denetimi (anmVkPlan).

Eski yol:
- `--anm '{"a10":{"ayar":{"acik":0}}}'` A10-1'in satırlarıyla birebir.
- `acik` 0 ile önceye birebir.

'A: ayar adımı (A10)' — kapılar `--adim 189` yapay kipinde; maç satırları (tohum 7, 600 sn) bilgi:
- Son adım başında destek ayağı yerde: yürüyüş ≤ %30, koşu ≤ %20 (önce %61 / %36).
- Doğal iniş ↔ basış ≤ 0,05 sn: ≥ %55 (önce %8–20).
- Destek yolu p90: koşu ≤ 1,3 m, yürüyüş ≤ 0,9 m; 2,5 + 1,6·v tavanını aşan 0.
- v < 1,2 m/sn'de iki ayak birlikte havada 0.
- Son adımda ve hazırlıkta yerde kilitli ayağın kayması ≤ %10; kilitli destek ayağının yolu p90 ≤ 0,05 m.
- Havada bekleme > 0,06 sn: 0.
- Faz oranı vk.ay.k [0,75; 1,25] içinde %100.

`--duran 24`:
- 'A: duran top' satırları korunur.
- Duran topta iki ayak havada ≤ %10; doğal iniş ↔ basış ≥ %80.

Korunanlar:
- 'A: donuk son adım' ≥ 0,5 sn ~0/maç.
- 'A: vuruş (T4-V)': hazırlıksız ≤ %5, kararsız kare 0.
- 'A: zamanlama' N/N.
- 'A: alış': geri basış 0, kaymaE ≤ 15.
- 'A: kadans', 'A: eğri' ve eylemsiz ayak kayması bantları önceden kötü değil.
- `--hiz 4`: kararsız kare 0; ayar satırları 1×'e göre ±5 puan.

Ekran ve son: `kontrol.py` (a10adim); oturum-sonu `--ayni --mac 40`; commit.

### A10-3 — Gerilme yayının zamanlaması, eğim ve baş (kale vuruşu dahil)

**Dosyalar:** `js/stil-99.js`, `js/animasyon.js`, `araclar/poz-galerisi.html (a10vurus denetimine gerilme ve eğim)`

js/stil-99.js — `STIL.animasyon.a10`'a eklenenler:
- gerilme 1, egim 1, bakis 1.
- haz {pencere [0,12; 0,45], kol 0,6, burul 0,4, egim 0,25, acele 0,6, rampa 0,15, dirsek 0,75}.
- egimPay [0,25; 0,5; 1], yanPay [0,35; 0,65], bas 0,3.

js/animasyon.js:
- Gerilme:
  - anmVkQ H pozunu kurar: G'nin kol payı 0,6, burulmanın 0,4'ü, dirsek (dirsek − 0,75)/2.
  - Pencere Hk = lerp(pencere, kol) × (1 − 0,6·acele).
  - Hedef = smoothstep((tG + Hk − tc)/Hk); saat anmVkSaat'ten.
  - vk.a10.wV karede en çok dt/0,15 değişir (rampa).
  - Evre 2'nin geri salınımında V = lerp(H, G, g), wG = lerp(wV, 1, g), wK = g.
  - Rampa ve yarı bükük dirsek zorunludur: prototipte rampasız sıçrama 0,87/vuruştu.
- E2 (anmVkSonAdim):
  - egim ve kol tazelenir; G ve T yeniden kurulur, H değişmez.
  - Destek yeri dil'den.
- E3:
  - Şema değiştiyse ve aşağı salınım başlamadıysa bütün pozlar yeniden kurulur.
  - Aşağı salınım başladıysa yalnız F, tF, tIn ve sıçrama yenilenir.
  - egD (temastaki − planlanan eğim) 0,08 sn'lik yayla vk.lean'e eklenir; sal gerçekleşen hızla tazelenir.
- Eğim:
  - lean = egim.on × egimPay (H / G / T). 'lean' yuvanın ağırlığıyla yürüyüşün koşu ve fren eğimini ezer.
  - Yan eğim: kalça −s·0,35·yan·p, göğüs −s·0,65·yan·p, baş karşı yöne 0,3.
  - Takipte karşı denge: (kLean − karsi·Tm)·s.
  - A8 sutEgim yalnız F yüksekliğine uygulanır.
  - yarimVole: on +0,12.
- Baş:
  - hx tarif.bas'tan [G, T, takip]; basKalk'tan sonra 0,1 sn'lik yayla.
  - bakis: dil.adim.bak > 0 iken hazırlığın ilk bak sn'sinde, tc > tG + 0,2 iken baş hedefe bakar. A8 bakis'in 'uzun ∨ uzunYer' şartının yerine geçer.
- Kale vuruşu normal vuruş yolundan çizilir (sec.duran):
  - uzunu lofted (sal ≥ 0,95'te sicra);
  - kısası itme/sertIc ve plase;
  - yay koşusunda G'nin kalça açılması burul − yayA.
  - Duruş jestleri S1/V1e'nindir.

**Denetim:** Hızlı kademe ve eski yol:
- `node araclar/mac-deneme.js 4`.
- `--anm '{"a10":{"gerilme":0,"egim":0,"bakis":0}}'` A10-2'nin satırlarıyla birebir.

'A: vuruş şeması' (`--vurus 147`) — kolun ≥ 45°'de kaldığı, temastan geriye kesintisiz süre:
- itme ≤ 0,05 sn; sertIc ≥ 0,15; sürülmüş ≥ 0,30; lofted ≥ 0,6.
- |tKol − tAyak| ≤ 0,05 sn: ≥ %90.

'A: dil uyumu':
- Temas karesinde |P.lean − egim.on| ≤ 0,03 rad: ≥ %90.
- İskeletin ön yatışı |· − egim.on| p90 ≤ 8°.
- Vole: |yan − egim.yan| p90 ≤ 6° ve ρ(top yüksekliği, yan) ≥ 0,7 (bugün sabit 31–33°).
- Kısa paslarda takipte eğim ≥ −0,12 rad (bugün −0,25…−0,32).
- sicra N/N.

'A: baş':
- Yerden şemalarda temasta ≥ 15° aşağı: ≥ %80.
- Chip ve lofted temastan 0,15 sn sonra ≤ 0°: ≥ %80.
- bak > 0 iken ilk bak sn'sinde baş–hedef ≤ 25°: ≥ %80.

`--duran 24` (kale vuruşu hücreleri):
- Kısada temasta eğim ≥ −0,05 (önce −0,39).
- Uzunda kol tepesi ≥ 82°, bitiriş ≥ 0,8 m.
- Kısa plasede bitiriş çapraz; 'A: duran top' korunur.

Korunanlar:
- Evre sınırı dışı > 20° sıçrama ≤ önce + 0,05/vuruş.
- 'Eylemde > 20°' ≤ önce × 1,10.
- 'Sıçrama' ve 'kırılma' satırları önceden kötü değil (lean'in ezilmesinden çıkış).
- `--hiz 4` ve `--hiz 8`'de 'A: vuruş' kararlı.

Ekran ve son: `kontrol.py` (a10vurus); oturum-sonu `--ayni --mac 40`; commit.

### A10-4 — Dönüş yolu, dış ayakta tutulan gövde ve iki eksenli kaçak

**Dosyalar:** `js/stil-99.js`, `js/animasyon.js`, `araclar/poz-galerisi.html`

js/stil-99.js — `a10.ayar`'a eklenenler: kacak [0,12; 0,2], kacakHiz 1,5, kacakKalabalik 0,7, pelvis 0,5, pelvisTavan 0,3, pelvisSal 0,08.

js/animasyon.js:
- Dönüş katmanı ay.hyP (anmVurusDurum), yola göre:
  - 'pelvis': basıştan temasa clamp(pelvis·aciFark(kd, kök), ±0,3); göğüs bunun 0,6'sı kadar geride kalır.
  - 'adim': destek adımı dönüş penceresini kaplar. Basışta a.ayakYaw köke pelvisSal'da çekilir; kalça gecikmesi çözülür.
  - 'dis': basış yeri ve kalça dil.don.hedef yönündedir; pelvisin hedefe doğru payı ≤ 0,1 rad.
  - 'hizali': yalnız gecikme çözülür.
  - 'acik': basış yanı +0,03 m.
  - Takipte katman söner.
- anmEkler'de sıra: yayKalca → poz (burul/kapa; temasta kapaTemas) → ay.hyP. Toplam köke göre ±1,0 rad.
- anmVkBasisYeri: dış yolda û = dil.don.hedef.
- Kaçak (vk.ofs'un yerine ay.ofx/ofz):
  - İleri pay tarif.ofs × (1 − tc/tPl).
  - Düzeltme ≤ 0,12 m: basış yeri vkUzan'ın önündeyse; temas erişimi > 0,8 m ise; yanal hata > 0,06 m ise yarısı.
  - Toplam ≤ 0,20 m; hız ≤ 1,5 m/sn; 1 m'de rakip varsa ×0,7 (anmYakinRakip(p, 1)).
  - Evre 5'te kw ile 0,16 sn'de söner.
  - ayar.acik 0 iken A10-1'in tek eksenli ofs'u kalır.
- vkUzan: uzanEn'den sonra ayak bulunduğu yere basar, açığı kaçak kapatır.

Galeri:
- a10adim'in pelvis ve dış satırları;
- a10vurus'a iki satır: 'adim' yoluyla sağa 70° (sol adım + pelvis + iç ayak) ve 'pelvis' 35°.
- a10Denetim: dış satırında pelvis–hedef 25–60°; adım satırında kapanma ≥ %60.

**Denetim:** Hızlı kademe:
- `node araclar/mac-deneme.js 4`.
- Eski yol: `--anm '{"a10":{"acik":0}}'` önceye birebir.

'A: dönüş yolu' — ölçü yerleri: maç (tohum 7, 600 sn), `--adim 189`, `--vurus-zorla dis` ve `--vurus-zorla sertIc,adim`:
- Adım yolunda (yavaş) dönüşün son adıma düşen payı ≥ 0,6 (önce 0,10).
- Gereken dönüş ≥ 1 rad olanlarda son adımda pelvisin dünyadaki dönüşü ≥ 1 rad.
- Basıştan 0,1 sn sonra |hyT| ≤ 0,1.
- 'adim' ve 'pelvis': temasta |pelvis − hedef| p50 ≤ 15°, p90 ≤ 25°; kapanma ≥ %60.
- 'adim'da pencerede basış görüldü ≥ %90; 'hizali' p90 ≤ 15°; omuz hattı pelvisin ±20°'sinde.
- Dış: |pelvis − dil.don.hedef| ≤ 0,15 rad ≥ %80. dil.don.hedef dış yana 25–60° olanlarda ölçülen açı 25–60° ≥ %80 (önce ~0–10°).
- p50 kapısı tutmazsa tek tarama: kapaTemas 1 → 0,5.

'A: ayar adımı' (kaçak ve vuruş ayağı):
- |ofs| ≤ 0,20 m N/N, p90 ≤ 0,15; hız ≤ 1,5 m/sn; 1 m'de rakip varken ≤ 0,14.
- Temas açıklığı ≤ 0,15 m her şemada ≥ %95.
- Destek bandı (yan 0,15–0,35, geri 0–0,20) ≥ %90; lofted geri ≥ 0,08; ortanca tablonun ±0,04'ünde.
- Burun–hedef ≤ 25°: itme ve sertIc ≥ %85.
- Görünür basış = dil.adim.n: ≥ %80, ±1 içinde ≥ %95.

Korunanlar:
- 'A: temas': ayakta gövdeler iç içe ~0 (kaçak).
- A10-2'nin bütün ayar adımı kapıları.

Ekran ve son: `kontrol.py` (a10adim, a10vurus); oturum-sonu `--ayni --mac 40`; commit.

### A10-5 — Pas isteme ve oyun kurma jestleri: tam kol, iki el açık, boşluğu gösterme (motorsuz)

**Dosyalar:** `js/stil-99.js`, `js/animasyon.js`, `araclar/poz-galerisi.html`, `araclar/an-yakala.py (gerekirse istek anlarının ince ayarı)`

js/stil-99.js — `a10.istek`:
- acik 1, sure [1,2; 1,6], isaretSure 1,0, zarf [0,18; 0,3; 0,25], es 2.
- once [0,2; 0,5], kur 0,25, kurAralik 4, kurBaski 2.
- ikiEl [16; 3,5; 0,3], gorus [0,35; 0,85].
- salla [0,16; 1,7; 0,5], pompa [0,16; 0,3; 2,6; 2], supur 0,3, goster [−0,35; 0,1].
- govde [0,6; 0,4], bas 0,4, isaretNisan 1.

js/animasyon.js:
- ANM_POZ'a yeni pozlar: jestIste, jestVer, jestEgik, jestGosterDiger (sayılar A10c §3.1). jestCagir acik 0 yolu için kalır.
- ANM_SLOT: 'jest2' [8, 5], 'jest'in hemen ardına. Kayıt değişince yuva değişir (hkA/hkB kalıbı); eski yolun motor jestleri boştaki yuvayı alır.
- Yeni ANM_IST ve anmIstekHarita: kare başına bir kez, `zaman` anahtarıyla; yalnız 'play' evresinde. Kaynaklar:
  - (i) Motorun 'cagir'/'isaret' jesti çizimde 1,2–1,6 sn tutulur (h2).
  - (ii) Pastan önce: taşıyanın vuruş eyleminin sec.alici'si. Koşullar L ≥ 8 m, çerçevede, sut/uzaklastir/duran/penalti değil, h2 < lerp(once). Bitiş temas + 0,3 sn (kalanCiz ya da kalan). Pasörün dil.adim.bak > 0 ise jest onun bakış penceresinde başlar.
  - (iii) Kurma çağrısı: 0,2 sn'de bir tarama, A10c'de ölçülen koşullarla, h2 < kur.
- İptaller: oyuncunun eylemi başladı; top onda; sahiplik rakipte; pas başkasına gitti; motor başka türde jest verdi; evre değişti. Söniş 0,25 sn.
- Bütçe ve öncelik:
  - Takım başına es (2).
  - Puan = 4·önce + 2·çerçeve + 1·motor − L/40.
  - Çizilmekte olan kayıt bütçe yüzünden kesilmez.
- anmIstekBicim: A10c §3.3'teki sıra; j.bicim varsa o. Kol tarafı kayıt boyunca sabit.
- anmCerceve: kamera varsa izdüşüm ≤ 0,95; yoksa her oyuncu çerçevede.
- anmKolNisan: anmZ2KolHedef'in gövdesi taşınır; Z2e kol jesti aynı sonucu verir.
- anmIstekPoz: göstermede süpürme.
- anmEylemler jest katmanı ve anmEkler jest gövdesi:
  - Gövde taşıyana ya da hedefe döner, baş taşıyana.
  - Salla, pompa ve süpürme τ'dan hesaplanır, `zaman`dan değil; A9 basSon'dan önce uygulanır.
- isaretNisan: motorun 'isaret' jesti her evrede hedefe nişanlanır. S1 sahnelerinde 'A: duran top' kol jesti tutmazsa yalnız 'play' evresine indirilir.
- Bilerek değişmeyenler: js/mac-*.js, tür adları, motorun 0,8 sn'si, pastan önce kapalı sinyal (A10c deneyleri).

Galeri `a10istek`:
- Satırlar: iste (durgun ve salla), ver (pompa), goster (süpürme; sağ önde ve sol yanda), egik.
- Her biri önden, yandan, arkadan ve loca uzaklığında (uzak 12).
- Denetim: tam kolda bilek baş tepesinin ≥ 0,15 m üstünde; ver'de bilekler ≥ 0,5 m yanda.

**Denetim:** Motor birebir:
- `node araclar/mac-deneme.js 4`.
- oturum-sonu `--ayni --mac 40`: z-kalip 'İstek' ve t-takim 'Jest:' satırları aynı.
- ikiz-deneme gerekmez.

ad-denetimi: ANM_IST, anmIstekHarita, anmIstekBicim, anmCerceve, anmKolNisan, anmIstekPoz; çizimin motora yazması 0.

'A: istek' (tohum 3 ve 7):
- Toplam 10–16 jest/dk; biçim × kaynak dağılımı bilgi.
- Topa sahip takımda aynı anda ≥ 2 jest süresi ≤ %15.
- Motor kaynaklı jestte w > 0,5 süresinin ortancası 1,1–1,5 sn (önce ~0,55).
- Silüet (w > 0,7 kareleri, ≥ %90'ında):
  - iste'de bilek baş tepesinin ≥ 0,15 m üstünde;
  - ver'de iki el omzun ≥ 0,15 m üstünde ve her bilek gövde ekseninden ≥ 0,5 m yanda;
  - goster'de el gövde ekseninden ≥ 0,5 m.
- Loca kamerasında eklenen piksel ortancası ≥ 4 px; görünür istek ≥ 25 sn/maç (önce 0).
- Çerçevede doğan ≥ %80; es'i aşan kare 0.
- Kendi eylemiyle çakışma (w > 0,3) 0.
- Pastan önce kapsama: çerçevedeki ≥ 10 m açık oyun paslarının %25–45'i (önce %8,9).
- Baş w > 0,7 karelerinin ≥ %80'inde taşıyana ≤ 35°.
- Kol kanallarında karede > 20° sıçrama 0.
- 'A: süre' ≤ +%2.

Korunanlar:
- `--duran 24` 'A: duran top': yerleştirme ve kol jesti N/N.
- Galeride z2kol satırı aynı.

İnceleme ve son: an-yakala istek anlarında önce/sonra (Claude'un kendi incelemesi); `kontrol.py` (a10istek); commit.

### A10-6 — Kaleci: elden ve ayakla dağıtım pozları, degaj bağdaştırıcısı, top elde

**Dosyalar:** `js/stil-99.js`, `js/animasyon.js`, `araclar/poz-galerisi.html`, `araclar/animasyon-olcum.py (yalnız gerekirse dağıtım satırı)`

js/stil-99.js:
- `a10.dagitim` 1.
- dag {yuvarla [0,55], omuz [0,65; 0,85], ust [0,3; 0,8], birak {punt 0,30, dusurme 0,35}, ofs −0,20, sal [0,6; 0,4], kolOn [0,6; 1,7]}.

js/animasyon.js:
- ANM_SLOT: 'dagH' [14, 8], yumruk ile elleAtis arasında.
- ANM_POZ'a yeni anahtar pozlar (sağ el ve ayak; sol aynalanır; değerler A10a §7.2): yuvarlaGeri, omuzGeri, ustAlt, ustGeri, ustAt, ustTakip, degajTut. Eskileri dil'siz yol için kalır.
- anmDagPoz:
  - Stil zaman çizelgesi f = t/sure. Karışım yalnız stilin anahtar kümesinde; anmPozKaris kullanılmaz.
  - Genlik ×(0,6 + 0,4·sal); kol aR = −lerp(kolOn, kol); bırakıştaki eğim egim.on.
  - Yuvarlamada bacak kanalları yalnız son 0,15 sn'de ve basmayan bacakta.
- anmDagVur bağdaştırıcısı (degaj):
  - Aktör başına kalıcı, vuruşa benzer nesne: faz, kalan, kalanCiz, ft, geri, sec, ayak, stil 'ust', guc, dil.
  - punt → lofted, düşürme → surulmus.
  - Bırakış eylemiyle aynı nesne takipte sürer.
  - Etkinken eski degajTemas/degajTakip yuvaları çizilmez.
  - A10-2'nin zaman çizgisi ve faz denetimi degajın 2–3 adımını bırakışa eşler.
- anmVurusDurum: vur = 'vurus' ∪ bağdaştırıcı. vG/vK/vT, 'dagitim' ve 'degaj'da da çizilir.
- elleAtis dalı:
  - stil 'ust' → ustAt / ustTakip (bugün omuz pozuyla çiziliyor).
  - dil varsa bırakışta lean = egim.on, yan eğim ve kol uzanması.
- 'elde' yuvası dağıtımda çizilmez.
- Top elde (ANM_DAG):
  - aktorGuncelle'de dağıtımdaki kalecinin el noktası hesaplanır; kemik matrisi yalnız bu kalecide güncellenir.
  - Düşürmede top topY'ye ve gövdenin 0,3 m önüne s² ile iner.
  - anmEldeKar ANM_DAG'ı uygular; ANM_ELDE geçişinden 0,15 sn'de devralır.
  - anmTopTut, bırakış karesinde temas karesi tutuşunu yalnız ANM_DAG.p için atlar.

Galeri `a10kaleci` (7 satır): yuvarla, omuz, üst, düşürme, punt, uzun kale vuruşu, kısa plase kale vuruşu.

**Denetim:** Hızlı kademe:
- `node araclar/mac-deneme.js 4`.
- ad-denetimi: anmDagPoz, anmDagVur, ANM_DAG.

Eski yol:
- `--anm '{"a10":{"dagitim":0}}'` A10-5'in satırlarıyla birebir.
- `--ayar '{"dagitimHaz":[0,0]}'`: motor sonucu değişir; yalnız çizimin eski yola hatasız düştüğü sınanır.

'A: dağıtım (A10)' (`--dagitim 40` ve maç):
- Stil → poz N/N; atışta anahtar (geri) poza varış ağırlığı ≥ 0,9: ≥ %90.
- Hazırlıkta el–top p90 ≤ 0,12 m.
- Bırakış karesinde çizilen top motorun bırakış noktasına ≤ 0,05 m.
- Elde topun karede çizim sıçraması ≤ 0,12 m (önce yuvarlamada ~0,95 m).
- Punt ve düşürmede temastan 0,12 sn önce vuran uyluk ≥ 20° geride: ≥ %90. Punt bitirişi ≥ 0,8 m.
- Bırakışta gövde–atış açısı p90 ≤ 20°; V1 kabulü bozulmaz.
- Basış ↔ e.adim ±1.
- Dağıtım karelerinde ayak kayması ≤ %5.

Korunanlar:
- `--kaleci 96 --once s1`: 'A: kurtarış' (T15d tutuş, eldiven ≤ 0,15 m) korunur.
- `--duran 24` ve `--olay 80` korunur.

Ekran ve son: `kontrol.py` (a10kaleci); oturum-sonu `--ayni --mac 40`; commit.

### A10-7 — Tur kapanışı: tam ölçü, tabanlar, belgeler, main

**Dosyalar:** `araclar/taban/a10-anm.json (yeni)`, `araclar/taban/a10-anm-vurus.json (yeni)`, `araclar/taban/a10-anm-kaleci.json (yeni)`, `araclar/karsilastir/a9, z2, k1 (silinir)`, `FUTBOL_KUTUPHANESI.md`, `TEKNIK_PLAN.md`, `MAC_MOTORU_GERCEKCILIK_PLANI.md`, `kutuphane/J-beden-dili.md`, `CLAUDE.md`, `YOL_HARITASI.md`

CLAUDE.md tur kapanışı listesi (A10 motora dokunmadığı için motor satırları birebirliktir):
- 80 maç: `node araclar/mac-deneme.js 80 --karsilastir araclar/taban/v1.json --ayni` → 80/80. Yeni motor tabanı yazılmaz.
- Senaryolar: `node araclar/oturum-sonu.js araclar/taban/v1.json --ayni --seyrek --mac 24` (dizüstü). Bütün senaryolar, z-s3, z-s10 ve z-s14 dahil.
- `kontrol.py`:
  - index;
  - poz-galerisi a10vurus, a10adim, a10istek, a10kaleci;
  - eski sayfalardan z2kol, a8vurus, a6blok, t15kaleci.
- `python araclar/akis-deneme.py` (js/animasyon.js ekran listesinde). Bu dizüstünde §11/12/14/14b/15/15b'nin düşmesi ve §16'nın titremesi bilinen durumdur, gerileme sayılmaz.
- an-yakala önce/sonra: `--anm s1 --onek once-`, v-* ve istek-* anları. Claude'un kendi incelemesidir, kullanıcıya sunulmaz.
- Duyarlılık karnesi: `node araclar/oyuncu-karnesi.js 80 1 --duyarlilik`. Motor aynı olduğu için V1 sonucuyla aynı çıkmalı.
- Hız:
  - `git worktree add --detach <scratchpad>/v1agac tur/v1`;
  - `node araclar/hiz-olcum.js 2 --tekrar 8 --kok <v1agac>` (beklenen ~0, ≤ %10);
  - ağaç silinir.
- Animasyon ölçüsünün tamamı, aynı oturumda `--once s1` ile:
  - tohum 3 ve 7 × 600 sn;
  - `--vurus 196`, `--adim 189`, `--dagitim 40`, `--duran 24`, `--kaleci 96`, `--olay 80`, `--hiz 4` (`--hiz 8` bilgi);
  - eski yol `--anm '{"a10":{"acik":0}}'` birebir.
- Yeni animasyon tabanları:
  - `araclar/taban/a10-anm.json`: tohum 3, 180 sn; A11 okur;
  - `a10-anm-vurus.json`: `--vurus 147`;
  - `a10-anm-kaleci.json`: `--kaleci 96`.
- vk alan sayısı galeride okunur: Object.keys(a.vk), vk.a10 ve vk.ay her biri < 100 (A3 sınırı).
- M2: araclar/karsilastir'da yalnız s1 kalır; a9, z2 ve k1 silinir, Git'te durur.
- Belgeler: belgeNotu.

Kapı tutmazsa:
- Bir düzeltme denemesi yapılır.
- Yine tutmazsa o parçanın anahtarı varsayılanda 0'a iner (eski çizim birebir). Nedeni ve ölçüsü borç olarak yazılır; tur kapanır.

Git:
- 'A10 main'e alındı' commit'i.
- `main` ileri sarılır.
- `tur/a10` açıklamalı etiketi.
- Push: main, dal ve etiket.
- Birleşen dal silinir.
- Devam notu: sıradaki A11, açılışı `dondur.js a10`.

**Denetim:** Bütün kabul maddeleri sayılarıyla karşılanır ve sonuçlar devam notuna ile §12.16 'A10 — Sonuç'a yazılır:
- 80 maç --ayni 80/80.
- Senaryolar çıkış 0.
- kontrol.py ve galeri konsol hatası 0.
- akis-deneme bilinen bölümler dışında hatasız.
- Hız ≤ %10.
- 'A: süre' ≤ önce × 1,10 ve ≤ 2 ms.
- Yeni A10 satırlarının kapıları; korunan satırlar önceden kötü değil.

`git diff --check` temiz. Belgelerde bağlantılar ve tutarlılık denetlenir.

Bunlar geçmeden `main`'e alınmaz.

## Kabul

A10 aşağıdakilerin hepsi sağlanınca kapanır. Şema eşikleri yapay kipte (--vurus 147/196, --adim 189, --dagitim 40) kabul edilir. Maç satırları kapanışta tohum 3 ve 7 × 600 sn ile okunur. Önce ve sonra aynı oturumda, aynı V1 motoruyla ölçülür (--once s1).

BİREBİRLİK VE GÜVENLİK
- Motor her alt adımda 40 maç --ayni tutar, kapanışta 80 maç --ayni 80/80 (taban v1.json). mac-deneme 4 'sonuç aynı'.
- ad-denetimi 0 bulgu: yeni üst düzey adlar çakışmaz, çizim motora yazmaz.
- --anm '{"a10":{"acik":0}}' ile önce kopyasına karşı kemik tabanlı A: satırları birebir.
- dil'siz vuruşta bugünkü yol birebir.
- Çizimin rastlantısı yalnız h2'den gelir (kimlik, vk.no, ⌊mac.t·4⌋). mac.rast kullanılmaz, p.* yazılmaz.
- vk, vk.a10 ve vk.ay alan sayısı < 100.

KARŞI KOL VE GERİLME (ortanca, yapay kip)
- Kol tepesi bantları:
  - itme 25–42°
  - dis 30–50°
  - chip 30–55°
  - sertIc 48–72°
  - sürülmüş 65–88°
  - lofted ≥ 82°
  - vole ≥ 75°
- Sıra itme < sertIc < sürülmüş ≤ lofted.
- |ölçülen − r(dil.kol)| p90 ≤ 15°; r, STIL a10.kol eşlemesidir. ρ(dil.kol, tepe) ≥ 0,85.
- Bilek − omuz: itme ≤ −0,40 m; sürülmüş, lofted ve vole ≥ −0,10 m.
- Ayrım:
  - bilek farkı ≥ 0,35 m (100 m'de ≥ 3,9 px);
  - yanal uzanım farkı ≥ 0,25 m.
- Kolun ≥ 45°'de kaldığı süre: itme ≤ 0,05 sn, sertIc ≥ 0,15, sürülmüş ≥ 0,30, lofted ≥ 0,6. |tKol − tAyak| ≤ 0,05 sn: ≥ %90.
- Önce: kısa pas 47° / 0,03 sn; uzun yerden 82° / 0,27 sn.

GERİ SALINIM
- Sürülmüş ve lofted: uyluk (düşeye göre) −20…−35°, diz 85–115°.
- İtme: uyluk ≥ −15°, diz ≤ 75°.
- Ayak geriliği oranı ((lofted ∪ sürülmüş) ÷ itme) ≥ 2.
- Yapay kipte (tek vurucu) şema içinde ρ(sal, ayak geriliği) ≥ 0,7; maçta bilgi.
- 'A: vuruş (T4-V)' tepe/plan ortancası 0,9–1,05.

BİTİRİŞ (vuran taban, temastan sonraki 0,45 sn'nin tepesi)
- itme 0,15–0,28 m ve uyluk ≤ 50°.
- sertIc 0,25–0,45 m.
- Sürülmüş: yerden pasta 0,30–0,55 m; şutta uyluk ≥ 70°.
- lofted ≥ 0,80 m ve uyluk ≥ 80°.
- chip ≤ 0,25 m ve uyluk ≤ 40° (önce 56°).
- dis: uyluk ≤ 50° (önce 74°) ve ayak vuran yana ≥ 0,10 m.
- lofted − itme ≥ 0,30 m.
- Sıra itme < sertIc < sürülmüş (pas) < lofted.

YATIŞ VE DİL UYUMU
- Temas karesinde |P.lean − dil.egim.on| ≤ 0,03 rad: ≥ %90.
- İskeletin ön yatışı |· − egim.on| p90 ≤ 8°.
- Vole: |yan − egim.yan| p90 ≤ 6° ve ρ(top yüksekliği, yan) ≥ 0,7.
- Kısa paslarda takipte eğim ≥ −0,12 rad.
- Kale vuruşunda kısa temasta eğim ≥ −0,05 (önce −0,39).
- sicra N/N; plasede bitiriş hedefin dışında.
- Mutlak bantlar dil zaten o banttaysa kapıdır, değilse bilgidir (V1'in işi):
  - lofted ve chip ≤ −8°;
  - sürülmüş − lofted ≥ 12°;
  - acelede geriye ≥ 5° ve yana ≥ 8°.

BAŞ
- Yerden şemalarda temasta ≥ 15° aşağı: ≥ %80.
- Chip ve lofted temastan 0,15 sn sonra ≤ 0°: ≥ %80.
- dil.adim.bak > 0 iken ilk bak sn'sinde baş–hedef ≤ 25°: ≥ %80.

AYAR ADIMI VE VURUŞ AYAĞI
- Son adım başında destek ayağı yerde: yürüyüş ≤ %30, koşu ≤ %20 (önce %61 / %36).
- Doğal iniş ↔ basış ≤ 0,05 sn: ≥ %55; duran topta ≥ %80.
- Destek ayağının yolu p90: koşu ≤ 1,3 m, yürüyüş ≤ 0,9 m. Hız tavanını aşan 0.
- İki ayak birlikte havada: v < 1,2 m/sn'de 0; duran topta ≤ %10.
- Yerde kilitli ayağın kayması (son adım ve hazırlık) ≤ %10. Kilitli destek ayağının yolu p90 ≤ 0,05 m.
- Havada bekleme > 0,06 sn: 0. Faz oranı [0,75; 1,25] içinde %100.
- Temas açıklığı ≤ 0,15 m her şemada ≥ %95 (önce itmede %62).
- Destek bandı (yan 0,15–0,35, geri 0–0,20) ≥ %90; ortanca tablonun ±0,04 m'sinde; lofted geri ≥ 0,08.
- Burun–hedef ≤ 25°: itme ve sertIc ≥ %85.
- Kaçak: |ofs| ≤ 0,20 m N/N, p90 ≤ 0,15; hız ≤ 1,5 m/sn; kalabalıkta ≤ 0,14 m.
- Görünür basış = dil.adim.n: ≥ %80, ±1 içinde ≥ %95.
- 'A: alış': kaymaE ≤ 15, geri basış 0.

DÖNÜŞ YOLU
- Adım yolunda dönüşün son adıma düşen payı ≥ 0,6 (önce 0,10). Gereken ≥ 1 rad olanlarda son adımda pelvis ≥ 1 rad döner.
- Basıştan 0,1 sn sonra |hyT| ≤ 0,1.
- 'adim' ve 'pelvis': temasta |pelvis − hedef| p50 ≤ 15°, p90 ≤ 25°; kapanma ≥ %60.
- 'adim'da basış görüldü ≥ %90. 'hizali' p90 ≤ 15°. Omuz hattı pelvisin ±20°'sinde.
- Dış ayak: |pelvis − dil.don.hedef| ≤ 0,15 rad: ≥ %80. dil.don.hedef dış yana 25–60° olanlarda ölçülen açı 25–60°: ≥ %80 (önce ~0–10°).

İSTEK
- Toplam 10–16 jest/dk. Topa sahip takımda aynı anda ≥ 2 jest süresi ≤ %15. es'i aşan kare 0.
- Motor kaynaklı jestin tutma ortancası 1,1–1,5 sn.
- Silüet (≥ %90):
  - tam kolda bilek baş tepesinin ≥ 0,15 m üstünde;
  - iki elde her bilek ≥ 0,5 m yanda ve omzun ≥ 0,15 m üstünde;
  - göstermede el gövde ekseninden ≥ 0,5 m.
- Eklenen piksel ortancası ≥ 4 px. Görünür istek ≥ 25 sn/maç (önce 0).
- Çerçevede doğan ≥ %80.
- Kendi eylemiyle çakışma 0.
- Pastan önce kapsama %25–45 (önce %8,9).
- Baş taşıyana ≤ 35°: ≥ %80.
- Kol kanallarında sıçrama 0.

DAĞITIM VE KALE VURUŞU
- Stil → poz N/N; anahtar poza varış ≥ 0,9: ≥ %90.
- El–top p90 ≤ 0,12 m.
- Bırakışta top motorun noktasına ≤ 0,05 m. Elde topun kare sıçraması ≤ 0,12 m.
- Punt ve düşürmede uyluk temastan 0,12 sn önce ≥ 20° geride: ≥ %90. Punt bitirişi ≥ 0,8 m.
- Bırakışta gövde–atış p90 ≤ 20°. Basış ↔ e.adim ±1. Ayak kayması ≤ %5.
- Uzun kale vuruşunda kol ≥ 82° ve bitiriş ≥ 0,8 m. Kısa plasede bitiriş çapraz.

KORUNANLAR (önceden kötü değil)
- 'A: vuruş stili' ≥ %95 (dil.sema).
- 'A: zamanlama' vuruş teması N/N.
- 'A: vuruş (T4-V)': hazırlıksız ≤ %5, kararsız kare 0.
- 'A: donuk son adım' ≥ 0,5 sn ~0/maç.
- Evre sınırı dışı > 20° sıçrama ≤ önce + 0,05/vuruş.
- 'Eylemde > 20°' ≤ önce × 1,10.
- Eylemsiz ayak kayması bantları ±1 puan.
- 'A: kurtarış', 'A: duran top', 'A: olay', 'A: temas' (iç içe gövde ~0), 'A: eğri', 'A: kadans', 'kimlik' ve 'bekleyiş' korunur.
- --hiz 4'te kararsız kare 0 (8× bilgi).

HIZ
- 'A: süre' ≤ önce × 1,10 ve ≤ 2 ms/kare; alt adım başına ≤ +%5.
- Motor: aynı süreçte eşleştirilmiş oran ≤ %10 (beklenen ~0).

KAPANIŞ LİSTESİ
CLAUDE.md'nin tur kapanışı listesinin tamamı: 80 maç, bütün senaryolar, kontrol.py, akis-deneme, an-yakala (Claude'un incelemesi), duyarlılık, hız, animasyon ölçümü ve yeni tabanlar a10-anm.json, a10-anm-vurus.json, a10-anm-kaleci.json.

KAPI TUTMAZSA
Bir düzeltme denemesi yapılır. Yine tutmazsa o parçanın STIL anahtarı 0'a iner (eski çizim birebir), borç olarak yazılır ve tur kapanır.

## Belge notu

TUR BAŞINDA (A10-0)

FUTBOL_KUTUPHANESI.md'ye yeni §12.16 "A10 — vuruş, pas ve istek çizimi (plan)" yazılır. Numara, V1 §12.14 ve S1 §12.15'in ardından gelir. İçerik:
- amaç: kullanıcı notları 2, 3, 4, 6'nın beden çizimi ve not 8 (istek);
- dört tasarımın birleştirme kararları (plan maddeleri 1–17), özellikle:
  - tek anahtar ağacı STIL.animasyon.a10;
  - çizim dil türetmez, dil yoksa eski yol;
  - vk.a10 ve vk.ay;
  - tek zaman çizgisi (anmVkSaat → ay.tG);
  - birleşik destek tablosu;
  - tek kaçak mekanizması, degaj −0,20;
  - pelvis sırası ve ±1,0 rad;
  - kol eşlemesinin tek kaynağı (15° + 95°·kol bırakıldı);
  - ölçü satırları;
  - yapay kipler;
  - galeri sayfaları;
  - istek motorsuz;
  - önce kopyası s1;
- alt adımlar ve kabul.
§12.13'teki A10 satırı ve not 8 satırı bu bölüme bağlanır. Oradaki "dondur.js a9" ifadesi "s1 (S1'in çizimi; V1 çizime dokunmaz)" olarak düzeltilir.
YOL_HARITASI.md devam notuna "A10 açıldı" yazılır: dal, motor tabanı v1.json, önce kopyası s1.

TUR KAPANIŞINDA

FUTBOL_KUTUPHANESI.md §12.16'ya "A10 — Sonuç":
- önce/sonra sayıları: kol tepesi ve gerilme süresi şema başına, bitiriş, geri salınım, temas açıklığı, ayar adımı (destek yerde, iniş↔basış, yol, iki ayak havada), dönüş yolu, istek (dk başına, tutma, görünür sn, pastan önce kapsama), dağıtım;
- açık ve kapalı parçalar;
- hız;
- borçlar.

TEKNIK_PLAN.md §8:
- E akışı satırına eklenir: STIL.animasyon.a10 (ayar, istek, dag) ve yeni işlevler (anmVkDil, anmVkFK, anmVkQ, anmA10Yaz, anmVkV, anmVkSaat, anmVkPlan, anmDagPoz, anmDagVur, ANM_DAG, ANM_IST, anmIstekHarita, anmIstekBicim, anmCerceve, anmKolNisan, anmIstekPoz).
- "Motor → çizim sözleşmesi"ne eklenir:
  - dil'in çizimde okunduğu üç an (E1/E2/E3);
  - çizim dil türetmez, dil yoksa eski yol;
  - vuruş durumu vk.a10 ve vk.ay alt nesnelerindedir (A3 sınırı);
  - yuva sırası: vK vG ile vT arasında, dagH yumruk ile elleAtis arasında, jest2 jest'in ardında;
  - her vuruşta değişen poz nesnesi aynala önbelleğine ve anmUstPoz'a verilmez;
  - istek jestinin kaynakları: p.jest, eylem.sec.alici, eylem.kalanCiz/kalan ve p.kosu; j.bicim isteğe bağlıdır, motor yazmaz;
  - dagitim eylemi ve top elde (ANM_DAG).

MAC_MOTORU_GERCEKCILIK_PLANI.md:
- Ek G2 "Vuruş evreleri": D1 tablosunun kaynağı ve dil → poz eşlemesi; son adımın iki dizilimi (yavaşta önce bas sonra salla, koşuda uçuşlu); faz denetimi, basış penceresi, basış tablosu, kaçak sınırları; gerilme penceresi ve rampa.
- G0.8 ve G3: tam kol, iki el ve gösterme pozları.
- G9 tablosuna A10 satırları (tanım, hedef, önce → A10): vuruş şeması, ayrım, dil uyumu, ayar adımı, dönüş yolu, baş, istek, dağıtım.

kutuphane/J-beden-dili.md:
- J.7 D1, D2, D4 ve D8: "uygulandı (A10)", uygulanan biçimiyle.
- J.8 çizim ve pas isteme maddeleri: "A10'da kapandı", önce/sonra sayılarıyla.
- J.9 madde 7: "A10'da çizildi; motor tarafı Z'ye borç".
- J.10: "uygulandı (A10)" ve satır adları.

CLAUDE.md "Kontrol" animasyon paragrafı:
- A10 animasyon tabanı a10-anm.json; ayrıca -vurus (--vurus 147) ve -kaleci (--kaleci 96).
- Yapay kipler --vurus N, --vurus-zorla, --adim N, --dagitim N.
- Satırlar ve kapıları: 'A: vuruş şeması / ayrımı / dil uyumu / ayar adımı / dönüş yolu / baş / istek / dağıtım (A10)'.
- Galeri a10vurus, a10adim, a10istek, a10kaleci.
- Sahipler: vuruş katmanı ve STIL.animasyon.a10 → --vurus ve --adim; istek → 'A: istek' ve motor --ayni; dağıtım → --dagitim, --kaleci, --duran.
- "sıradaki çizim turu dondur.js a10 ile başlar"; bugünkü kopya yalnız s1.

YOL_HARITASI.md:
- Güncel karar özetine A10: tarih, sonuç, tabanlar, borçlar.
- Devam notu: sıradaki A11 (dondur.js a10; motor tabanı v1.json, animasyon tabanı a10-anm.json) ve açılış komutları.

BORÇLAR (belgeye yazılır)
- İstek jestlerinin motor tarafı: pastan önce istek, uzun algı penceresi, kurma isteğinin karar girdisi olması, biçime ve görünürlüğe bağlı algı. Öneri plan&32 'istekGec'; sonucu değiştirir, 40 maçla, bir Z turunda.
- CMU vuruşlarında karşı kol kanalı (hareket-egrileri.py --vurus): masaüstünde yapılır, veri bu dizüstünde yok. Kol eşikleri o zamana dek J.1 [K8] ve tahmindir.
- Topuk şeması: motorda kaynağı yok.
- Düşürme vuruşunda sekme yok (topY 0,9).
- Tutmayan kapılar varsa parça anahtarı ve ölçüsüyle.

DEPOYA ALINMAYANLAR
'Önce' ölçü dökümleri, prototip betikleri (scratchpad a10a–a10d) ve geçici JSON'lar. Sayıları devam notunda ve §12.16'da durur.

İLKE
Kabul sahnesi üretilmez. Galeri, an-yakala şeritleri ve ölçüler Claude'un kendi doğrulamasıdır; kullanıcı maçı kendisi izler.
