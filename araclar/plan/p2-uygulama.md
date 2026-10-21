# P2 — 2D maç kesinleşti: kompakt kasaba stadı, 2D ölçek ve top ipuçları, falso, akış ve temizlik (2026-10-21 gece, dizüstü)

**Durum (2026-10-21 gece):** P2-0, P2-A–P2-H ve P2-J yapıldı (commit'ler 4a1bd93, 51ba201, c7594f5, 6536436 ve kapanış), P2-I (demo büyük tarif) yapılmadı. §6'daki akış denemesi 2D bloğu yerine ayrı araç `araclar/akis-2d.py`; akış denemesi bütünüyle `?pul=0`. Kullanıcı isteğiyle `main`'e alındı (`tur/p2`); gece listesi YOL_HARITASI devam notunda ve FUTBOL_KUTUPHANESI §12.18'de.

## Bağlam

- **Karar (kullanıcı, 2026-10-21 gece, kesin):** maç 2D tepeden izlenir; figürlü motor antrenman sahneleri içindir. Bu tur kararın gerektirdiği düzenleme ve temizliği yapar, görüntüyü kullanıcının istediği yöne çeker. **Görsel turdur:** adım sonlarında yalnız hızlı denetimler; 40/80 maçlık karşılaştırmalar, bütün senaryolar ve tam akış denemesi **gece oturumuna** ertelenir (liste aşağıda). Kullanıcı görüntüyü izleyip yeniden not verir.
- **Kullanıcının istekleri:** (1) stat tepeden devasa duruyor, oyuncular ve top küçük: daha kompakt, samimi kasaba stadı; üç tarafta tribün, kale arkalarından birinde Braga gibi yamaç; yan tribünler çatısız ama **uzun** (orta blok değil); bir tık daha yakından. (2) Tribünler zamanla gelişir: bir bölüm kapanır, inşaat maçta görünür. (3) Aynı modelden başka kulüplere stat üretilecek (1. ligde büyük, dolu statlar). (4) Topun havada olduğu daha iyi okunmalı; daha çok falsolu pas olmalı ki izlemesi keyif versin.
- **Kullanıcı cevapları (bu planın soruları):** locaya giriş sahnesi şimdilik atlanır (maç öncesi ekranından doğrudan 2D stat; rakip başkan karar anı 2D üstünde kart olarak kalır); toprak pist kalkar, tribünler çizgiye 5–6,5 m; yamaç tarafında kayaya oyulmuş insan boyu basamaklarda ayakta taraftar (kalabalık ve kapı yolu).
- **Git:** dal `claude/motor-p1` üstünde sürer (P1 commit'i 0d2c235); alt adım sonlarında commit, `main`'e alma ve push yok (kullanıcı izleyip söyleyince). Motor tabanı `araclar/taban/s1.json`.

## Kararlar (bu planda Claude'un verdiği; belgeye yazılır)

- **Program:** figür çizim turları A10 ve A11 maç için kapanır, kapsamları antrenman serisine ("E"; balkon yenilemesiyle) devredilir; V1 (motorun vuruş ve pas dili) kalır; Z programı P2'den sonra sürer. Antrenman sahnesi bugün `js/balkon.js`'te eski poz karışımıyla çalışır; `js/animasyon.js`'in oraya bağlanması E1'in işidir.
- **Loca bakışı** maçta kullanıcı görünümü olmaktan çıkar; araçlar (animasyon ölçümü, an yakalama, akış denemesinin giriş bölümleri) ve geliştirici için `?pul=0` ve Ayarlar > Geliştirici "Maçta loca bakışı (TEST)" ile kalır.
- **Yamaç tarafı:** kale2 (doğu, +x). Ana tribün (−z) kulüp binasıyla, karşı tribün (+z) meşale ve pankartla, kale1 (batı) deplasman bölümüyle kalır.
- **Falso:** tek yeni anahtar `pasEgriKat` (eğri büyüklüğü çarpanı; 1 → eski sonuçlar birebir). V1c-2'nin aile tablosu gelince dış çarpan olarak kalır ya da tabloya katlanır; "daha çok falso" isteği kullanıcınındır, gerçekçilik dengesi gece ölçümüyle açılır.

## Mimari

### 1. Tarif v2 ve kompakt stat (`js/stadyum-tarifleri.js`, `js/stadyum.js`, `js/stadyum-cevre.js`, `js/seyirci.js`)

- **Yeni tarif alanları (tribün başına):** `mesafe` (çizgi → tribün önü, m), `uzunluk` (tam kenar), `sira`, `bolumler[{from,to,taraftar,durum:'acik'|'kapali'|'insaat'}]`; yeni tip **`'yamac'`** (kayaya oyulmuş ayakta basamaklar; `SIRA.yamac={derinlik:1.8,egim:1.4,kisi:0.45}`). Pist alanı `'yok'`. Panolar, tel örgü, projektör direkleri (`konumlar` verilmezse köşelerden türetilir), çevre duvarı, kapı yolları, tabela dönüşü ve tünel körüğü **ölçülerden türetilir** (`STIL.stadyum.reklamPay 1.2`, `telPay 0.5`).
- **Kompakt sayılar (saha merkezi orijin; taç z=±34, kale çizgisi x=±52,5):**
  - `ana`: oturma, mesafe 6,5 (ön z −40,5), uzunluk 100, sira 9, baskanSira/protokol/loca aynı (kutu ve balkon geometrisi aynı kalır → göz 12–15 m testi tutar).
  - `karsi`: ayakta, mesafe 5 (ön +39), uzunluk 100, sira 7, taraftar ev, meşale; **demo inşaat bölümü** `bolumler:[{from:32,to:50,taraftar:'bos',durum:'insaat'}]`, `bakim:{yer:'karsi',u:0.41}` (balkon iskelesi aynı yerde).
  - `kale1`: set, mesafe 5,5 (ön −58), uzunluk 40, sira 4, `bolumler:[{from:-17,to:17,taraftar:'deplasman'}]` (deplasman yeri değişmez).
  - `kale2`: **yamac**, mesafe 6 (ön +58,5), uzunluk 44, sira 5 (D 9 m, tepe 7,2 m), taraftar ev; kaya W.dogu'dan 30 m'ye yükselir, altta terasların güney ucunda kaya merdiveni (kapı yolu `kapilar: {tribun:'kale2',u:-0.5}`; 6 kapı korunur).
  - Türetilenler: panolar ana −39,3 / karşı +37,8 / kaleler ±56,8–57,3; tel örgü tribün önünün 0,5 m önünde; direkler ≈ (∓57,5, −41) ve (±57,5, +39,5); tabela `[-20,47]`.
  - **Motor sözleşmesi sabit (`--ayni` tutsun):** `TUNEL` z −39,8 ve x −19, `KULUBELER` z −39,2 / alan −36,4, `tribunOnu` noktaları, `MAC_SECENEK` değişmez. Motorun sabit noktaları sığıyor: top toplayıcı PW+2,9 = 36,9 < pano 37,8; top silme PL+4 = 56,5 < 57,3, PW+3 = 37 < 37,8; kulübe arka duvarı −40,1 > tribün önü −40,5.
- **Değişen işlevler:** `YAN_MESAFE/KALE_MESAFE/PISTLI` → `STAT_OLCU` (`{on:{ana,karsi,kale1,kale2},arka,duvar}`, `tribunOn(yer)`); `tribunOlcu` kapasiteden kapalı/inşaat uzunluğunu düşer; `tribunYeri` ölçülerden; `stand()` `yamac` basamakları kaya rengi (SK.kaya) ve yan/arka duvarsız, bölüm döngüsünde `durum`: `kapali` → bölüm 'bos', `insaat` → koltuk ve yer yok, branda düzlemi + boru/kalas (balkon.js:37-44 kalıbı); panolar/tel/loca `arka`/yedek koltuk/tabela/tünel körüğü `STAT_OLCU`'dan. `stadyum-cevre.js`: `W` ölçülerden (`dogu` = teras arkası + 0,5), `kok.userData.duvar=W`; yamaç `x0=W.dogu`, ilk kaya basamağının tepesi ≥ teras tepesi; doğu teli kalkar (tribün teli önde); yamaç kapı yolu güney uçtan; set duvarı yamaca uygulanmaz; bina `zT` türetilir. `seyirci.js`: yamaç ayakta dalını kullanır (değişiklik yok); `balkon.js:19` `STAT_OLCU.on.ana`. Kapasite ≈ 4100 (bugün ~1750), hedef ≈ 1230 seyirci; duman sürüklenmesi (−z, karşıdan sahaya) olduğu gibi.
- **İsteğe bağlı demo (P2-I):** `STADYUM_DEMO.buyuk` ayrı sabit (`Object.keys(STADYUMLAR)` 'kulup' kalır), yüklemede `?stat=buyuk` ile seçilir (ana sira 18, cati 0,5, `direk` direkler, dört taraf tribün, uzun kenarlar 105 m); oda ve balkon da aynı tarifi gösterir (demo, kabul edilir). Yalnız genelleme ucuz çıkarsa.

### 2. 2D ölçek ve top ipuçları (`js/stil-99.js` STIL.pul, `js/pul.js`, `js/kamera.js`, `js/okunurluk.js`, `js/golgeler.js`)

- `STIL.pul.tepe`: `genislik:[34,46,70]`, `seviye:1` (46 m dikey → 1 m ≈ 15,7 px; pul çapı ≈ 27 px), `yaricapKat:1.7`; `sinir` ve maç öncesi "bütün stat" genişliği tariften türetilir (`pulKur`: `sinir=[kale1On+D+22, max(anaOn+D,karsiOn+D)+18]`, `statE=2·max(…)+8`; `tepeKamera` sabit `G[son]` yerine `PUL.statE`).
- `STIL.pul.top` (yeni): `{kat:2.0, yukseklik:0.6, tepe:6, golge:{opak:0.35,boy:2.0,kay:[0.3,-0.3],enCok:4}, iz:{sayi:24,aralik:0.05,sure:0.7,hiz:8,y:0.3,yaricap:[0.6,0.15],renk:'#f4f4ee'}, inis:{acik:true,yaricap:1.0,opak:0.45}}`.
- `pul.js` `pulTopKare()` (okunurluk.js `okunurlukKare` başında `if(pulTepe()){OKN_LEKE.visible=false;pulTopKare();return;}` — kamera bilinir, `topCiz` konumu yazmıştır): **yükseklik ölçeği** `s=kat·(1+yukseklik·clamp(h/tepe,0,1))`, en az `enAzPx`; **yumuşak gölge** kendi diski (radyal doku), yükseldikçe ekranda sağ-aşağı kayar (`kay·min(h,enCok)`) ve solar; **iz** `InstancedMesh(CircleGeometry, 24)`: hız > 8 m/sn ya da y > 0,3 iken 50 ms'de bir örnek, yaşla küçülür ve çim rengine söner (eğriyi görünür kılar); **iniş halkası** (isteğe bağlı, varsayılan açık): kamera.js:73-79 kalıbıyla özel top kopyası `topFizikAdim` ile 0,1 sn'de bir ileri sarılır, top havadayken (y > 0,4 ya da vy > 1,5, taşıyan yokken) iniş noktasına halka. `GOLGE.topGizli` (golgeler.js:36,57): 2D'de projektör gölgeleri (onlarca metre uzağa düşer, yanıltıcı) kapanır; `pulUygula` yazar.
- Sadeleşme: `?tepe`, `?pulEgim`, `egim`, `sayiKameraya` kalkar (`pulTepe()` = `PUL.acik`); `enAzPx`/`?pulEnAz` kalır.

### 3. Falso anahtarı (`js/mac-motoru.js` bildirim, `js/mac-topla.js` atama ve kullanım, `araclar/olcumler/a-akis.js`)

- `MOTOR_AYAR.pasEgriKat` (B satırı; `ayarEkle('B',…)`), varsayılan **1,6**: `mac-topla.js:535` yerden pas `eg·(L≥18?pasEgriKat:1)`, `:553` orta/korner `·pasEgriKat`, `:555` uzun havadan pas `·pasEgriKat`; şut (:494) dışında; rast çekimi yok; `x·1` bit-aynı → `pasEgriKat` 1 ile s1'e `--ayni`. Telafi (`yerEgriSapma` :541-543, `havadanCoz` mac-motoru.js:571-576) aynı eğriyle çözdüğü için top yine hedefe iner.
- Ölçüm: `a-akis.js`'e bilgi satırı "Eğri: |egri| ort. ×100 (pas ve orta)" (sayım satırı değişmez: |egri|>0,02).
- **Risk:** kesme ortada 0,22'ye çıkan eğride 3 iterasyonlu telafi yetmeyebilir → gece `d-duran` (korner 3200) ve `c-orta` karar verir; gerekirse orta/korner için ayrı üst sınır.

### 4. Akış: 2D'de giriş atlanır (`js/ekran-mac-oncesi.js`, `js/loca-giris.js`)

- `ilerle()` (:114-115; "Beklemeden geç" :118 aynı yol): `pulTepe()?tepeAnBaslat():locaGirisBaslat()`.
- `loca-giris.js`'e `TEPE_AN={aktif,bekle,acildi}`: `tepeAnBaslat()` `MAC_PROTOKOL.rakipBaskan` kalıbını (:151) kurar; rakip varsa ve karar yoksa 2 sn sonra (stat önce görünsün) `kararAniAc(kayit,{kim,bitince:tepeAnBitti})`, `ON_EKRAN.sayfa='loca'` (telefon kilidi aynen); `locaGirisKare` (:177) başında `TEPE_AN` dalı (`kararAniKare(dt)`; tokalaşma ve `baskanEylem` yok); `tepeAnBitti`: `lgKararBitti`'nin karar kaydı ayrılır (`lgKararYaz`), `ON_EKRAN.sayfa=null`, bekleyen "Santraya geç" varsa `G.atla()`. "Santraya geç" (:277-285): `TEPE_AN.aktif` ise bekler. Geç gelen rakip yolu (:181-183) 2D'de kapalı (`G.kuruldu` false). `?pul=0`: `locaGirisBaslat` aynen (araçlar ve akış denemesi §14/14b).

### 5. Ayar göçü ve geliştirici satırı (`js/oyun-oturumu.js`, `js/pul.js`, `js/ekran-oda.js`)

- `pul` → `locaBakisi:false` (TEST; true = figürlü loca bakışı); yüklemede `a.locaBakisi===true`, eski `'pul' in a` 'ses' gibi yeniden yazılıp düşer (P1'den beri her kayıt `pul:false` yazdığı için göç şart). `pul.js`: `pulUygula(PUL_PARAM!=null?PUL_PARAM:!OYUN.ayarlar.locaBakisi)`; G tuşu `locaBakisi=!PUL.acik`. Ayarlar > Maç'taki satır ve not kalkar (§18 yalnız "Maç hızı" ve "Önemli anlarda normal hız" arar); Geliştirici sekmesine "Maçta loca bakışı (TEST)" satırı ve işleyici; oyun içi `details.gelistirici` dokunulmaz (§11).

### 6. Araçlar (gece koşabilsin diye asgari)

- `araclar/akis-deneme.py`: §14 adreslerine `&pul=0` (:496,:581,:595,:616,:646,:662,:681); yeni **§14c** (2D, `?ekran=mac&tohum=4&rakipBaskan=yerinde`): giriş yok (`LOCA_GIRIS.aktif` false, `camera.up.z==1`), karar anı ≤ 3 sn'de açılır, `ON_EKRAN.sayfa=='loca'`, Digit1 → `MAC_PROTOKOL.karar.secim`, sonra sayfa null; açıkken "Santraya geç" bekler; `rakipBaskan=yok` → açılmaz. §15 (:708) duvar koordinatları `scene.userData.duvar`'dan, kurulum sırası korunur. §15b (:805) `&pul=0`, `YAN_MESAFE` → `STAT_OLCU.on.ana`. §17 (:993) `&pul=0` + yeni 2D blok (`?ekran=mac&tohum=5`, 30 sn / 0,25 sn örnek): top NDC içinde ≥ %99, `fov ≈ 2·atan(E/2/H)`, görünür pul ≥ 25, pul ≥ 10 px, top çizim ≥ 6 px, `GOLGE.topGizli`, figür malzemesi görünmez. Belge dizesi güncellenir.
- `araclar/an-yakala.py`: varsayılan `&pul=0` (figürlü animasyon anları), `--2d` bayrağı kaldırır ve OLCU_JS'e `pul:{adet,px}` ekler; `--giris` pul=0 zorlar. `araclar/animasyon-olcum.py` (:1239) ve `araclar/animasyon-karsilastir.html` (:149) `&pul=0`. `araclar/cevre-yakala.py`: görüntülerden önce `pulUygula(false)`, yeni `gece-tepe` görünümü (kamera `up` +z, 110 m, E 46, pullar açık), `gece-yakin-yamac` hedefi `[74,10,0]`. `araclar/kontrol.py` yalnız belge dizesi.

## Alt adımlar (tek görsel oturum; her adımda yalnız hızlı denetim)

### P2-0 — önce görüntüleri
`PYTHONUTF8=1 python araclar/an-yakala.py santra korner sut --onek p2-once- --ek "&pul=1"` (kendi incelemem); `node araclar/mac-deneme.js 4 --karsilastir araclar/taban/s1.json --ayni` (4/4).

### P2-A — tarif v2, `STAT_OLCU`, yamaç tribünü, bölüm durumu, türetilmiş kenar öğeleri
**Dosyalar:** `js/stadyum-tarifleri.js`, `js/stadyum.js`, `js/stil-99.js` (`STIL.stadyum` payları, `SK.kaya` varsa), `js/balkon.js:19`.
**Denetim:** `node araclar/ad-denetimi.js`; `PYTHONUTF8=1 python araclar/kontrol.py "index.html?ekran=mac&tohum=3"` ve `"…&pul=0"` (hata 0; görüntü: üç tribün uzun, yamaç, inşaat bölümü); `node araclar/mac-deneme.js 4 --karsilastir araclar/taban/s1.json --ayni` (motor noktaları sabit → 4/4).

### P2-B — çevre: duvar, yamaç kayası ve kapı yolu, `userData.duvar`; akış denemesi §15/§15b satırları
**Dosyalar:** `js/stadyum-cevre.js`, `araclar/akis-deneme.py` (§15, §15b).
**Denetim:** `kontrol.py "index.html?dunya=7"` (oda/balkon hata 0); `PYTHONUTF8=1 python araclar/cevre-yakala.py --onek p2-` (ufukta boşluk 0; görüntüler); `an-yakala santra korner --onek p2-stat- --ek "&pul=1"` (tepeden kompakt görünüm; kendi incelemem). **Commit 1:** "P2a: kompakt kasaba stadı — tarif v2, yamaç tribünü, inşaat bölümü, türetilmiş kenar öğeleri".

### P2-C — 2D ölçek (yakınlık, pul boyu, türetilmiş sınır ve bütün stat)
**Dosyalar:** `js/stil-99.js`, `js/pul.js`, `js/kamera.js`.

### P2-D — top ipuçları (yükseklik ölçeği, yumuşak gölge, iz, iniş halkası; projektör top gölgesi 2D'de kapalı)
**Dosyalar:** `js/pul.js`, `js/okunurluk.js`, `js/golgeler.js`, `js/stil-99.js`.
**Denetim (C+D):** `mac-deneme 4 … --ayni`; `an-yakala korner sut uzun-top orta-kafa --onek p2-top- --ek "&pul=1"` ve `--kare 6 --aralik 0.12` şeridi (uzun topta top büyüyor, gölge ayrılıyor, iz eğriyi gösteriyor mu); `kontrol.py` maç. **Commit 2:** "P2b: 2D ölçek ve top ipuçları".

### P2-E — `pasEgriKat` ve ölçü satırı
**Dosyalar:** `js/mac-motoru.js`, `js/mac-topla.js`, `araclar/olcumler/a-akis.js`.
**Denetim:** `MAC_DENEME_AYAR='{"pasEgriKat":1}' node araclar/mac-deneme.js 4 --karsilastir araclar/taban/s1.json --ayni` (4/4); varsayılanla `node araclar/mac-deneme.js 4` (yeni satır ve tekrarlanabilirlik "sonuç aynı"); `an-yakala uzun-top korner-vurus --onek p2-egri- --ek "&pul=1" --kare 8 --aralik 0.12` (eğri görünüyor mu). **Commit 3:** "P2c: pasEgriKat — görünür falso (gece dengesi bekliyor)".

### P2-F — akış: 2D'de giriş atlanır, karar anı 2D üstünde
**Dosyalar:** `js/ekran-mac-oncesi.js`, `js/loca-giris.js`.

### P2-G — ayar göçü, Geliştirici satırı, `?tepe` ve eğim kaldırma
**Dosyalar:** `js/oyun-oturumu.js`, `js/pul.js`, `js/ekran-oda.js`.
**Denetim (F+G):** `kontrol.py "index.html?ekran=bulten"` (maç öncesi ekranı), `kontrol.py` oda; başsız tarayıcı betiğiyle: "Maça geç" → giriş yok, kamera tepede, karar kartı açılır, 1 tuşu kaydeder; `?pul=0` ile giriş sahnesi çalışır; G tuşu `locaBakisi` yazar; eski `pul` anahtarı düşer. İsteğe bağlı `PYTHONUTF8=1 python araclar/akis-deneme.py 14 18`. **Commit 4:** "P2d: 2D varsayılan, loca bakışı TEST, giriş 2D'de atlanır, karar anı 2D üstünde".

### P2-H — araçlar (§6), P2-I — isteğe bağlı demo tarif, P2-J — belgeler
**Denetim:** `an-yakala sut --onek p2-fig-` (varsayılan figürlü, `--2d` pullu); `animasyon-olcum.py --karsilastir araclar/taban/s1-anm.json` yalnız kısa koşu değil, gecede; belgeler `git diff --check`. **Commit 5:** "P2e: araçlar 2D'ye göre, (demo tarif), belgeler".

## Gece oturumu (kullanıcı kararı: görsel turda yapılmaz)
`node araclar/oturum-sonu.js araclar/taban/s1.json --seyrek --mac 24` (40 yerine 24; `--ayni` değil — `pasEgriKat` sonucu değiştirir; `pasEgriKat` 1 ile ayrıca `--ayni` 24/24); 80 maç `--karsilastir araclar/taban/s1.json` (sağlık aralığı, "Eğri" satırları, korner ve orta isabeti, gol); `d-duran` (korner 3200), `c-orta`, `c-kanat`, `b-pas`, `t-top`; `PYTHONUTF8=1 python araclar/akis-deneme.py` tam; `animasyon-olcum.py --karsilastir araclar/taban/s1-anm.json` (pul=0 zorlu → 46/46 birebir beklenir); `hiz-olcum 2 --tekrar 8 --kok <tur/s1 ağacı>` (motor yalnız çarpan); `titreme-olc`. Sonuçlar §12.18'e; `pasEgriKat` dengesi kullanıcıya sunulur.

## Kabul (görsel tur)
- Pul kapalı değil, 2D varsayılan; `?pul=0` ile figürlü loca bakışı ve giriş sahnesi aynen çalışır; motor `pasEgriKat` 1 ile s1'e birebir.
- Tepeden bakışta: üç uzun tribün, yamaçta ayakta taraftar, inşaat bölümü, kalabalık, meşale dumanı sahaya doğru; stat ekranda kompakt (bütün stat seviyesinde saha genişliğin ≥ %70'i); pul çapı orta seviyede ≥ 24 px, top ≥ 8 px ve havada büyüyüp gölgesi ayrılıyor; iz eğriyi gösteriyor.
- `kontrol.py` oda, maç (2D ve `pul=0`), maç öncesi hatasız; `ad-denetimi` bulgu yok; `cevre-yakala` ufukta boşluk 0; `git diff --check` temiz.

## Belgeler (karar kesin; grup grup)
- `CLAUDE.md`: :33 tek stat cümlesi (kompakt kasaba stadı, yamaç); :38 "yalnız loca bakışı" → 2D kural, loca bakışı TEST; :39 P1 maddesi → karar kesin, `locaBakisi`, `?pul`; :40 program (A10/A11 → E serisi, V1 kalır); Kontrol :89/:104/:107 araçlara `&pul=0` ve `--2d`, `akis-deneme` §14c/§17 2D.
- `OYUN_TASARIMI.md` §5 :165, §11 :354/:368/:370/:378: maç tepeden 2D; karar anı kart; giriş sahnesi beklemede; antrenman figürlü.
- `STIL_REHBERI.md` §4 :49/:53 (figür ayrımları antrenmanda), §5 :73/:74/:84 (tarif v2, kompakt stat, yamaç, inşaat, tepeden kimlik), §6 :90/:92/:115-118 (tarihsel), :126/:130 "Deneme" → kural (pul ve top ipuçları, yakınlık, loca bakışı TEST).
- `TEKNIK_PLAN.md` §8 :395/:396 (A satırı 2D kamera ve top ipuçları, E satırı `pul.js`), §10 :493/:525/:537 (tarif v2 alanları, `STAT_OLCU`, giriş sahnesi beklemede); motor sözleşmesi: `pasEgriKat` (B).
- `YOL_HARITASI.md` :3, devam notu (P2 durumu, gece listesi, nasıl izlenir), "Önce P1 kararı" paragrafı → karar verildi, karar özeti 2026-10-21 gece maddesi, program satırı (A10/A11 → E).
- `FUTBOL_KUTUPHANESI.md` §0 :18, §12 :243 sıra, §12.13 :476/:480, §12.15 (A10/A11 → E; V1c-2 ile `pasEgriKat`), §12.17 kapanış notu, **yeni §12.18 P2** (plan ve sonuç).
- `MAC_MOTORU_GERCEKCILIK_PLANI.md` Ek G :1610/:1612/:1701/:1721 (hareket dili antrenman sahnesi için; loca ölçüleri tarihsel).
- `kutuphane/M-pul-gorunumu.md` :9/:26/:36 + §M.5 "P2: karar ve uygulama".
- Kod yorumları: `arayuz.js:2-3`, `pul.js:1,10-11`, `kamera.js:160`, `stadyum-tarifleri.js:10-37` (v2 alanları), `oyun-oturumu.js:15`.
- `araclar/plan/p2-uygulama.md`: bu planın kopyası (P2-0'da).

## Riskler ve açık noktalar
- Kalabalık ~2,3 kat (yükleme süresi, `YURUYEN_HAVUZ`); gerekirse doluluk eğrisi aynı kalıp havuz büyütülür.
- Yamaç kapı yolunun (kaya merdiveni) inandırıcılığı ancak görüntüde görülür; ilk sürümde düz basamak bloğu.
- `havadanCoz` büyük eğride telafi; gece ölçülür.
- Demo büyük tarif `STAT`'ın yüklemede sabitlenmesi yüzünden oda ve balkonu da değiştirir; yalnız demo.
- Karar anı 2D üstünde tokalaşma görseli olmadan kart olarak gelir; başkan sahneleri yenilenirken yeniden ele alınır.
- Belge satır numaraları keşiften; düzenlemede yeniden bakılır.
