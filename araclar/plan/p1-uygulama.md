# P1 — pul görünümü denemesi: uygulama planı (2026-10-21 akşam, dizüstü)

**Durum (2026-10-21 akşam):** P1-0, P1-1, P1-2, P1-4 ve P1-K yapıldı; P1-3 (göz yüksekliği) kullanıcı düzeltmesiyle düştü. Sonuç FUTBOL_KUTUPHANESI §12.17, araştırma kutuphane/M. Dal `claude/motor-p1`; `main`'e alma ve push yok (kullanıcı izleyip karar verir).

**Kullanıcı düzeltmesi (uygulama sırasında, aynı akşam):** "Ben tepeden bir görüntü istemiştim, FM 2D motoru gibi; şu anki görüntüye pul yerleştirme değil." Maç tepeden 2D izlenir, başkanın loca bakışı ve ön planı maçta kalkar; kulübün farkı tribün ve saha görüntüsüdür (meşale, duman, reklamlar, deplasmanda başka stat; zamanla geliştirilir). Plana göre değişenler:
- Kamera: loca bakışı yerine `js/kamera.js` `tepeKamera` (110 m'den dik aşağı, saha yatay, ana tribün altta, topu izler, üç yakınlık — Z tuşu, maç öncesinde bütün stat); `js/arayuz.js` 2D'de `baskanCiz` çağırmaz. Pullar tepeden düz, numara ekranda dik, leke yana kayık, pul 1,5 kat (`STIL.pul.tepe`).
- Anahtar tek: "2D maç görünümü (deneme)" = tepeden kamera + pullar; maç tuşu D yerine **G** (D eski dürbünündü, `akis-deneme` §17 sınıyor); `?tepe=0` pulları loca bakışında gösterir (yalnız karşılaştırma).
- P1-3 (`?pulGoz`) yapılmadı: loca bakışı içindi. Eğim (`egim`, `?pulEgim`) yalnız `?tepe=0`'da anlamlı.
- Görünüm ayarları uygulamada değişti: doku 32 piksel, numara 3 kat, halka 2,5; ayak `en 0,12 · boy 0,24 · yan 0,2 · on 0,02`, vuran ayak amber (`#ffb530`; beyaz krem süslü formada seçilmiyordu).

Aşağıdaki metin onaylanan ilk plandır (tarihsel).

## Bağlam

- **Neden:** Kullanıcı bugün, figürlü maç izlemenin akıcılığa ulaşamama ihtimaline karşı FM'nin 2D motoru gibi **pul (disk) görünümünü** denemeye karar verdi: stat, loca, hava, kamera ve motor aynen kalır; sahadaki her insan aynı sade pul olur (takım rengi, üstünde numara, önde çizgi hâlinde iki ayak; boy/saç/yapı ayrımı yok, ad etiketi yok). Figürler silinmez; ileride antrenman sahnesinde (E1, balkon yenilemesiyle) yakından kullanılır. **Yön kararı bu denemeyle verilir**; Z programı ve V1 → A10 → A11 sırası bu turda değişmez, sonuç belgeye yazılır.
- **Araştırma özeti (bu oturum, üç tarama):** FM27 (16 Ekim 2026 tanıtımı) 2D'de oklar yerine ayak, küçük disk, güçlü top gölgesi getirdi; FM26 2D'de topun yüksekliği okunmadığı ve diskler büyük olduğu için eleştirildi. 2D'nin sevilen yanı bütün sahayı okumak, hız, hayal gücü; sevilmeyen yanı top yüksekliği ve "saatlerce yuvarlak". Token görünümü, izlenen şeyin sonucu ve okunacak bilgisi varsa işliyor (Motorsport Manager), yalnız seyirlikse sıkıyor (Soccer Manager → anında simülasyon). Kaynaklar ve ayrıntı turun belge adımında `kutuphane/M-pul-gorunumu.md`'ye yazılır.
- **Kullanıcı cevapları (plan soruları):** (1) sahadaki herkes pul (oyuncu, kaleci, hakemler, yedekler, kenar personeli, top toplayıcılar; tribün ve başkanın masası aynı); (2) deneme için **göz yüksekliği ayarı** `?pulGoz=N` eklenir (kamera.js); (3) Git: `claude/motor-p1` dalında alt adım sonlarında commit, **`main`'e alma ve push yok** (kullanıcı maçı izleyip karar verince).
- **Git durumu (doğrulandı):** çalışma ağacı temiz; `claude/motor-s1` = `main` = `origin/main` = 54176d3; etiket `tur/s1` var; `main` `../chairman-main` ağacında açık olduğundan dal `git switch -c claude/motor-p1 main` ile açılır.

## Mimari (kesin)

- **Yeni dosya `js/pul.js`** (çizim; yalnız okur, `p.*`/`mac.*` yazmaz, `rnd()`/`Math.random` çağırmaz). `index.html`'de `js/mac-sahnesi.js`'ten sonra, `js/kamera.js`'ten önce yüklenir (`AKTORLER`, `scene`, `camera`, `LAM/BAS/mk/tx`, `GOLGE`, `STIL`, `OYUN.ayarlar`, `ctxText/textW` yüklenmiş olur; `ekran-oda.js` daha sonra yüklendiği için `pulUygula`'yı görür).
- **İskelet ve animasyon çalışmaya devam eder.** Pul açıkken insan modeli `a.m.mesh.material.visible=false` (ve `a.esofman.mesh.material.visible=false`) ile gizlenir — `root.visible=false` kullanılmaz, çünkü r128'de kök görünmezse kemiklerdeki kart, bayrak, defter ve sprey kutusu da kaybolur (bunlar çocuk nesneler; `material.visible` yalnız çizimi atlar, iskelet güncellenir). `ekParcalar` (fotoğraf makinesi, çanta) deriye birleşik olduğu için kendiliğinden kaybolur. **`js/animasyon.js`, `js/oyuncular.js`, `js/mac-*.js` değişmez** → `dondur.js` gerekmez, motor parmak izi aynı.
- **İnsan gölgeleri** pul açıkken kapanır: `GOLGE.insanGizli` bayrağı (`js/golgeler.js:35`), `golgeleriGuncelle` içinde `for(const m of GOLGE.insanlar)` döngüsü bayrak açıkken atlanır (`n=0` → `I.im.count=0`; topun gölgesi kendi geçidinde kalır; stencil her kare temizlenir).
- **Pul geometrisi:** paylaşılan `CylinderGeometry(1,1,1,12,1)` (r128 grupları: 0 yan, 1 üst, 2 alt) → malzeme dizisi `[yan, ust, yan]`; `yan` = formanın koyusu (Lambert), `ust` = canvas dokulu `MeshBasicMaterial` (ışıksız, tam renk: forma zemini, `trim` renginde kenar halkası, ortada `trim` renginde numara — 3×5 piksel yazı `ctxText`/`textW`, `tx(cv,'n')` Nearest; doku 16 px, iki haneli numara çapın ~%44'ü; `doku:24,sayiOlcek:2` seçeneği STIL'de). Renkler her modelin kendi atlasındaki düz renk karelerinden okunur (`m.mesh.material.map.image`, forma (4,36), trim (60,36)): kaleci, hakem, eşofman, kenar personeli ve top toplayıcı renkleri kendiliğinden doğru gelir; `anmYelek` bu kareleri bozmaz.
- **Ayaklar:** pulun önünde iki ince kutu (`en 0,08 × boy 0,32 m`, ±0,22 m yanda, trim renginde Lambert), `ayak` grubunun `rotation.y=a.yaw` (gövde yönü; çizimdeki yumuşatılmış açı). Hareketteyken `a.ph` (çizim tarafı adım fazı, A7 eğrileri) ile öne/arkaya salınır (`adim 0,12 m`, genlik hızla 0→1). **Vuran ayak:** `p.eylem.ad==='vurus'&&faz==='takip'` ya da `p.sonDokunus.tur==='vurus'&&mac.t−sonDokunus.t<0,15` iken `eylem.ayak`/`sonDokunus.ayak` olan ayak parlak malzeme ve 1,4 ölçek.
- **Konum ve durum:** her pul kendi modelinin kökünü izler: `x,z = m.root.position` (anmKok'un kafa/kayma/kaleci kaymaları dahil), `y = p.oturuyor ? STIL.pul.oturmaY : max(0, m.root.position.y)` (sıçrama `p.yuk`, kaleci dalış yayı kökten gelir); görünürlük `m.root.visible && m.root.parent` ile birebir (tünel, kulübe, sağlıkçı gizleme). **Yatan oyuncu:** `yat=clamp(a.lth/STIL.animasyon.dusus.aci,0,1)` (çizim durumu) → pul düzleşir ve `yatDim` kadar kararır.
- **Eğim ve en küçük boy:** pul normali `N = normalize(up·1 + (kameraya birim yön)·egim·(1−yat))`, `root.quaternion.setFromUnitVectors(UP,N)` (dönme ekseni yatay, burulma yok); disk üst yüzü yerel Y'de kameraya doğru döndürülür ki numara ekranda dik dursun (`sayiKameraya`), ayak grubu yerel Y'de `a.yaw`. Ekrandaki çap `px = 2·r·(RH/2)/(d·tan(fov/2))` (okunurluk.js:73 formülü); `s=clamp(2·enAzPx/px,1,enCokKat)` ile `root.scale`; eğik pulun yakın kenarı çime girmesin diye `y += r·s·sqrt(1−N.y²)`.
- **Anahtarlar:** `STIL.pul` bloğu `js/stil-99.js`'te (`STIL.animasyon` dışında; `dondur.js` dondurmaz): `{yaricap:0.5, yukseklik:0.12, egim:0.5, enAzPx:6, enCokKat:3, doku:16, sayiOlcek:1, halka:1, yanKoyu:0.55, yatDim:0.4, oturmaY:0.55, topcuOran:0.75, ayak:{en:0.08,boy:0.32,yan:0.22,adim:0.12,parlak:'#ffffff'}, sayiKameraya:true, topUstte:false}` — tarihli TEST yorumu ile.
- **Açma yolları:** adres `?pul=1|0` (yükleme sabiti `PUL_PARAM`, oyuncular.js:48 `MODEL_PARAM` kalıbı), `?pulEgim=0..1`, `?pulEnAz=2..20` (STIL'i değiştirmez, yerel `PUL.egim/enAz`); ayar `OYUN.ayarlar.pul` (varsayılan `false`; `?pul` varsa adres kazanır); Ayarlar > Maç satırı "Pul görünümü" (canlı); maçta **D tuşu** canlı açar/kapar (TEST; `arayuz.js:20` kalıbı: INPUT/TEXTAREA'da, tekrar ve değiştirici tuşla, oda açıkken çalışmaz; P ve T tuşları dolu).
- **Kamera denemesi:** `js/kamera.js:25 kameraGoz()` → `BASKAN_KOLTUGU.y + KAM_B.goz + KAM_GOZ_EK`; `KAM_GOZ_EK` adresten `?pulGoz=N` (0–20 m, varsayılan 0; aynı try/catch kalıbı). Parametre yokken kamera birebir eskisi gibi. Ön plan (masa, eller) kameraya bağlı katmanda kaldığından etkilenmez; loca korkuluğu ve çatı kesiti değişebilir (deneme, kabul edilir).

## Dosyalar ve kancalar

- `js/pul.js` (yeni, ~140 yoğun satır): `PUL_PARAM`, `PUL_EGIM_PARAM`, `PUL_ENAZ_PARAM`, `PUL={acik,liste,geo,ayakGeo,parlak,egim,enAz}`, `pulKur()`, `pulEkle(a,m,no)` (her aktör için `a.m`, varsa `a.esofman` için ikinci giriş), `pulDoku(forma,trim,no)`, `pulUygula(acik)`, `pulKare(dts)`, D tuşu dinleyicisi; yüklemede `pulKur(); pulUygula(PUL_PARAM!=null?PUL_PARAM:!!(OYUN.ayarlar&&OYUN.ayarlar.pul))`.
- `index.html`: `js/mac-sahnesi.js` ile `js/kamera.js` arasına `<script src="js/pul.js"></script>`.
- `js/mac-sahnesi.js:179` `anmYardimIK(AKTORLER);` satırından sonra `pulKare(dts);` (kökler kesinleştikten sonra, `golgeleriGuncelle()` :218'den önce); başlık yorumuna tek cümle.
- `js/golgeler.js:35` `insanGizli:false`; `:50` döngü bayrakla atlanır.
- `js/stil-99.js`: `okunurluk` bloğundan sonra (439–440) `pul:{…}`.
- `js/oyun-oturumu.js:17-18`: `pul:false` ve `kaydet()`'e `pul:this.pul`; `:29` yükleme beyaz listesi `if(a.pul===true)OYUN.ayarlar.pul=true;`; başlık yorumuna `pul`.
- `js/ekran-oda.js:258`: `otoYavas` satırından sonra `'<div class="od-ayarSatir"><span>Pul görünümü</span>'+ac('pul',!!ayarlar.pul)+'</div>'` ve kısa `od-not` ("Deneme: sahadaki herkes numaralı pul olarak çizilir; maçta D tuşu da açar/kapar."); `:541` `otoYavas` kalıbında `else if(ey==='pul'){ayarlar.pul=!ayarlar.pul;ayarlar.kaydet();if(typeof pulUygula==='function')pulUygula(ayarlar.pul);ciz('[data-eylem="pul"]');}`. `details.gelistirici` paneline **dokunulmaz** (akis-deneme §11 içeriği sabit).
- `js/kamera.js:25`: `KAM_GOZ_EK` ve `kameraGoz()` eki (başka yerde `BASKAN_KOLTUGU.y+KAM_B.goz` kullanılıyorsa aynı ek; uygulamada `grep kameraGoz\|KAM_B.goz` ile doğrulanır).
- `araclar/ad-denetimi.js:95` `CIZIM` listesine `'js/pul.js'` (kural (c): çizim motora yazmaz).
- `araclar/plan/p1-uygulama.md`: bu planın depo kopyası (P1-0'da).
- Belgeler (P1-K): `YOL_HARITASI.md` (karar özeti 2026-10-21 akşam + devam notu), `FUTBOL_KUTUPHANESI.md` §12.17 "P1 — pul görünümü denemesi", `kutuphane/M-pul-gorunumu.md` (araştırma özeti ve kaynaklar, disk dili), `TEKNIK_PLAN.md` §8 dosya tablosu (E/A satırına `js/pul.js`, sözleşme değişmez) ve §10 kısa not, `STIL_REHBERI.md` §4 ya da §6'ya "Deneme: pul görünümü" paragrafı, `CLAUDE.md` "Oyun yönü"ne tek madde (TEST: `?pul=1`, D tuşu, `?pulEgim`, `?pulGoz`; karar bekliyor).

## Alt adımlar

### P1-0 — dal ve başlangıç (sonucu değiştirmez)
1. `git switch -c claude/motor-p1 main`; planı `araclar/plan/p1-uygulama.md`'ye kopyala.
2. Önce görüntüleri (figürlü, kendi incelemem için; kullanıcıya sunulmaz): `python araclar/an-yakala.py santra korner sut gol penalti golKume --onek p1-once-`.
**Denetim:** `git status` temiz dal; görüntüler `araclar/anlar/` (Git dışı).

### P1-1 — pul iskeleti: STIL.pul, pul.js (kur, uygula, kare: konum ve görünürlük), yükleme, kanca, gölge bayrağı
**Dosyalar:** `js/stil-99.js`, `js/pul.js`, `index.html`, `js/mac-sahnesi.js`, `js/golgeler.js`, `araclar/ad-denetimi.js`.
1. `STIL.pul` bloğu.
2. `pul.js`: parametreler, geometri, `pulEkle` (atlas renkleri, silindir + üst doku + ayaklar), `pulUygula` (malzeme görünürlüğü, `GOLGE.insanGizli`, pullar), `pulKare` (görünürlük, konum, kök y, oturma yüksekliği).
3. `index.html` yükleme sırası, `mac-sahnesi.js` kancası, `golgeler.js` bayrağı, `ad-denetimi.js` listesi.
**Denetim:** `node araclar/ad-denetimi.js` (bulgu 0); `PYTHONUTF8=1 python araclar/kontrol.py "index.html?ekran=mac&tohum=3&pul=1"` ve `"index.html?ekran=mac&tohum=3"` (konsol hatası 0; iki ekran görüntüsü incelenir: pul açıkken figür ve insan gölgesi yok, pul kapalıyken görüntü eskisi gibi).

### P1-2 — görünüm: numara dokusu, ayak çizgileri ve temposu, vuran ayak, eğim ve en küçük boy, yatan oyuncu, ayar parametreleri
**Dosyalar:** `js/pul.js`, gerekirse `js/stil-99.js` değerleri.
1. `pulDoku` (halka + numara), `sayiKameraya` dönüşü, `egim`/`enAzPx` (`?pulEgim`, `?pulEnAz`), ayak salınımı (`a.ph`, hız genliği), vuran ayak parlaması, yatma düzleşmesi ve kararma, top toplayıcı oranı, kulübe oturma yüksekliği.
2. Topun pul kenarının arkasında kalması görülürse `topUstte` seçeneği (varsayılan kapalı) denenir; karar yoruma yazılır.
**Denetim:** `PYTHONUTF8=1 python araclar/an-yakala.py santra korner sut gol penalti golKume --onek p1-sonra- --ek "&pul=1"`, ayrıca `--onek p1-e0- --ek "&pul=1&pulEgim=0"` ve `--onek p1-e1- --ek "&pul=1&pulEgim=1"` (kendi incelemem: uzak taraf okunuyor mu, numara seçiliyor mu, ayaklar yönü gösteriyor mu, düşen oyuncu belli mi); `kontrol.py` pul açık (hata 0). **Commit:** "P1a: pul görünümü — …" (dalda).

### P1-3 — göz yüksekliği denemesi (`?pulGoz=N`)
**Dosyalar:** `js/kamera.js`.
1. `KAM_GOZ_EK` (adres, 0–20, varsayılan 0) ve `kameraGoz()` eki; başka kullanım varsa aynı ek.
**Denetim:** `an-yakala.py sut korner --onek p1-goz6- --ek "&pul=1&pulGoz=6"` (bilgi); parametre yokken kamera aynı: `an-yakala.py sut korner --onek p1-kam-` görüntüleri `p1-once-` ile `python araclar/titreme-olc.py --karsilastir p1-once- p1-kam-` ya da JSON ölçüleriyle birebir; `PYTHONUTF8=1 python araclar/akis-deneme.py 15b 17` (bilinen dizüstü düşüşleri dışında yeni hata yok; §17 oyuncu boyu kapısı pul kapalıyken aynı).

### P1-4 — ayar, Ayarlar > Maç satırı, D tuşu
**Dosyalar:** `js/oyun-oturumu.js`, `js/ekran-oda.js`, `js/pul.js`.
1. `OYUN.ayarlar.pul` (kaydet/yükle beyaz listesi), satır ve işleyici, D tuşu (maç ekranında, oda kapalıyken).
**Denetim:** `PYTHONUTF8=1 python araclar/akis-deneme.py 17 18` (§18 "Maç hızı" ve "Önemli anlarda normal hız" satırları yerinde; yeni satır bozmaz); `PYTHONUTF8=1 python araclar/kontrol.py` (oda; hata 0); elle: ayar açıkken sayfa yenilenince maç pullu açılır, `?pul=0` ayarı ezer. **Commit:** "P1b: pul ayarı, Ayarlar > Maç satırı, D tuşu, göz yüksekliği denemesi" (dalda).

### P1-K — kapanış (çizim turu; motor değişmedi)
1. **Bütünlük:** `node araclar/mac-deneme.js 4 --karsilastir araclar/taban/s1.json --ayni` (4/4 aynı; motor dosyası değişmediği için beklenir), `node araclar/ad-denetimi.js`.
2. **Oturum sonu (commit öncesi, arka planda):** `node araclar/oturum-sonu.js araclar/taban/s1.json --ayni --mac 24` (özet: hepsi çıkış 0, `--ayni` 24/24).
3. **Çizim:** `PYTHONUTF8=1 python araclar/animasyon-olcum.py --karsilastir araclar/taban/s1-anm.json` pul **kapalı** → bütün satırlar birebir (animasyon.js değişmedi); pul açıkken ölçü anlamsız (gizli iskeleti ölçer), yalnız "A: süre" bilgi: `--ek "&pul=1"`.
4. `kontrol.py` maç (pul açık ve kapalı) ve oda: hata 0; `git diff --check` temiz.
5. **Belgeler** (yukarıdaki liste); `YOL_HARITASI` devam notuna izleme talimatı: oyunu aç → Ayarlar > Maç > Pul görünümü **ya da** `index.html?ekran=mac&pul=1`; maçta D tuşu; `?pulEgim=0|0.5|1`, `?pulEnAz=8`, `?pulGoz=4|6|8` denemeleri; karar sorusu: "pul mu, figür mü, karma mı".
6. **Git:** dalda kapanış commit'i ("P1: pul görünümü denemesi kapanışı — belgeler"); `main`'e alma, etiket ve push **yok** (kullanıcı kararı); dal `origin`'e itilmez (kullanıcı "kapatıyorum" derse iki bilgisayar kuralı gereği itilir).

## Kabul

- Motor: `mac-deneme 4 --ayni` 4/4 ve `oturum-sonu --ayni --mac 24` 24/24 (motor dosyası dokunulmadı).
- Çizim: `kontrol.py` maç (pul açık/kapalı) ve oda hatasız; `animasyon-olcum --karsilastir s1-anm.json` pul kapalı birebir; `ad-denetimi` 0 bulgu; `akis-deneme 15b 17 18` bilinen dizüstü düşüşleri dışında temiz; `git diff --check` temiz.
- Görünüm (kendi incelemem, an görüntüleri): pul açıkken sahada figür ve insan gölgesi yok; yakın tarafta numara okunur; uzak tarafta pul en az `enAzPx` çapında ve eğimle elips; ayak çizgileri gövde yönünde; vuruş anında vuran ayak parlar; düşen oyuncu düz ve soluk; kulübedekiler koltuk yüksekliğinde; top toplayıcılar küçük pul; hakem kartı pulun üstünde görünür.
- Pul kapalıyken oyun her bakımdan S1 ile aynı (görüntü, kamera, ölçüler).

## Riskler ve bilinen sınırlar

- Kemiklere bağlı kart, bayrak, defter ve sprey kutusu görünmez elin yüksekliğinde "asılı" durur (deneme için kabul; kart görünür kalması istenen bir yan etki). Uzatma tabelası ve çocukların elindeki toplar pulun üstünde havada kalır.
- Uzak tarafta numara 2×2 örnekleme ve 5 bit titremede yumuşar; `pulEnAz` 8 ile okunur, boy birörnekliği bozulur. `egim` 1'de pullar ayakta kart gibi görünebilir; 0'da uzak taraf 12×2 px'e iner. Varsayılan 0,5, adresle denenir.
- Eğik pulun kenarı top taşıyanın topunu örtebilir (`topUstte` seçeneği hazır, varsayılan kapalı).
- Animasyon çalışmaya devam ettiği için hız kazancı yok (deneme amacı görünüm). Çizim çağrısı ~70 × 3 ağ, ihmal edilir.
- `an-yakala` ve `animasyon-olcum` `a.m.root.visible` okuduğundan sayımlar değişmez; pul açıkken kemik ölçüleri gizli iskeleti ölçer (bilgi).
- Kamera `pulGoz` ile yükselince loca korkuluğu ve çatı kesiti görüntüye farklı girebilir; yalnız deneme.
- Ad çakışması: `pul`/`PUL_` ön ekli adlar depoda yok (doğrulandı); "P1" belgelerde yalnız değişken kısaltması olarak geçiyor, tur adı değil.

## Bu turda yapılmayanlar (karar sonrası)

Ad etiketi, olay simgeleri (kart/sakatlık ikonları), top izi, gol sonrası ve seremoni sahnelerinin pul işaretleri, antrenman sahnesi (E1), kamera/loca kalıcı değişikliği, figür çiziminin motor çağrılarından çıkarılması (hız), Z programındaki sıra değişikliği ve A10/A11'in kaderi. Kullanıcı denemeyi izleyip karar verince ayrı planlanır.
