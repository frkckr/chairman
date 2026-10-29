# R1 — Güvence: kayıt çakışması, kayıt taşıma, araç girişleri, borç defteri, katı kip, okunurluk tabanı (uygulama planı)

Durum: **onaylandı (kullanıcı, 2026-10-29: “Onayla, başla”); uygulama Opus 5.5, masaüstü.** Dal `claude/r1-guvence` (taban `main` 86e3d66), etiket `tur/r1-guvence`. `main`'e alma ve push kullanıcının sözüyle.

Kaynak: kullanıcının ChatGPT ile hazırladığı inceleme raporu (2026-10-29, sohbette), Claude'un madde madde değerlendirmesi ve kullanıcının “T1 planına geç” cevabı. Değerlendirmede önerilen yedi turluk sıra bu turun ilk commit'inde belgeye yazılır (§0). Tur harfi **R**'dir (revizyon programı): T harfi motor turlarındadır (`tur/t0-t1` … `tur/t23`), sohbetteki “T1” bu planın R1'idir.

Başlangıç ölçüsü (2026-10-29, temiz `main`, bu makine): `kariyer-deneme` geçti, 85 sn; `ad-denetimi` temiz, 1 sn; `mac-deneme 4` “sonuç aynı”, 19 sn.

## 0. Program revizyonu (belge; ilk commit)

Kullanıcının önceliği: **önce tek sezon uçtan uca, her ayrıntı çalışsın; yeni sezon, yeni senaryolar ve olaylar sonra.** Buna göre H3 sona gider, Y1 küçülerek öne gelir.

| Tur | Somut sonuç | Eski programdaki karşılığı |
|---|---|---|
| R1 güvence | Bu plan | Raporun 1. sırası; 7. maddenin H3 dışı kısmı |
| R2 telefon | Sol telefon, sağda konular ve geniş tek kart, bekleme tek satır, “X'i nasıl görüyorsun?” konusu, kullanıcının U bulguları | Raporun 2. sırası |
| R3 Canlı Skor | Hafta görünümü, dört bölümlü maç sayfası (Özet, İstatistikler, Kadrolar, Puan durumu), takım ve oyuncu sayfası, öbür maçlara kadro ve değişiklik kaydı | Raporun 4. sırası |
| R4 Y1 küçük | Dosya şablonu motoru, transfer alımının kısa zinciri, pazarlık kartı; ardından kullanıcının altı soruyla oynama denemesi | Y1'in yarısı; Y4'ün ilk oynanışı öne alındı |
| R5 balkon | Sağ çalışma alanı, kadro bağlantısı, hocanın programına göre grup düzeni, TEST “her saat antrenman” anahtarı | Raporun 5–6. sıraları (çalışma çeşitleri hariç) |
| R6 zincirler | Sözleşme, kriz, kurumsal (sponsor) zincirleri; Y1'in kalanı (kişi modeli, slot); maaşın gizli kabiliyetten kopması; rakip gündemi gazetede; aralarda oynama | Y1 kalanı, Y2, Y3 |
| R7 sezon sonu | Genel kurul güven oyu (TEST); bir sezon uçtan uca kapanır | Y5 |

Sonra: H3 yeni sezon ve kayıt büyümesi (arşiv, IndexedDB ölçümü), görsel tur, antrenman çalışma çeşitleri, ek özellikler (raporun 10. maddesi). Her tur kendi başında ayrıca planlanır ve onaylanır (karar 12). Belgeye YOL_HARITASI **karar 56** olarak yazılır; `y-program.md`, `h3-uygulama.md` ve `h-program.md` başına yönlendirme notu düşer, gövdeleri değişmez (H3'ün gövdesi H3 planlanırken yeniden yazılır).

## Kapsam

### R1-a — kayıt çakışması: tek yazan oturum

**Sorun (kodla doğrulandı):** kayıt tarayıcıda localStorage'da, oturum kimliği yok, `storage` olayı dinlenmiyor. İki sekme aynı kaydı açarsa geride kalan sekmenin ilk komutu öbürünün ilerlemesinin üstüne yazar; yazım yine “Kaydedildi” der.

**Çözüm: karşılaştırarak yaz.** Kayda yazan tek yol `kayitOturumu`dur (`js/kayit.js`; `js/oyun-oturumu.js` dışında yazan yok, 2026-10-29 tarandı).

- `kariyerYukle` yüklediği metni de döndürür. Oturum `beklenenAna` tutar: açılışta ana yuvanın o anki metni (yoksa `null`; `.onceki`'den açıldıysa bozuk ana metin), her başarılı yazımdan sonra yazılan metin.
- `kariyerKaydet` yazmadan önce ana yuvayı okur; `beklenenAna` ile aynı değilse yazmaz, `{tamam:false, cakisma:true}` döner. Karşılaştırma metin eşitliğidir (500 KB'ta milisaniyenin altında); zarf biçimi ve kayıt sürümü değişmez (biçim 1, sürüm 11).
- `oturum.uygula` komutu uygulamadan önce aynı denetimi yapar: çakışmada komut **uygulanmaz**, bellekteki kariyer de ilerlemez (yoksa ekran kayıttan ayrışırdı).
- Tarayıcıda `storage` olayı: başka sekme ana yuvaya yazınca oturum hemen çakışmaya düşer; oyuncu bir şeye dokunmadan önce görür.
- Ekran: çakışmada oda, bülten ve maç sayfasında örtü kartı: “Bu kariyer başka bir pencerede ilerledi” + kayıttaki an (zarfın `ozet`'inden: tarih, saat) + tek düğme **Yeniden yükle**. Üstüne yazma seçeneği yoktur. Örtü Genel Duraklat gibi bütün sahneyi dondurur.
- Maç sayfasında çakışma “Odaya dön”de görünür: sonuç yazılamaz, örtü aynı.
- Masaüstünde tek örnek kilidi zaten var (`masaustu/ana.js` `requestSingleInstanceLock`); karşılaştırarak yazma orada da geçerlidir (aynı klasöre yazan başka süreç).

**Denetim:** `kariyer-deneme` yeni **1.6 “iki oturum”** (`bellekDeposu`): A ve B aynı kaydı açar; A yazar; B'nin komutu uygulanmaz, `cakisma`, ana yuvada A'nın metni, `.onceki` bozulmadı; B yeniden yüklenince A'nın anında; `.onceki`'den açılan oturum ve bozuk kayıt üstüne yeni kariyer yolu çakışma sanılmaz. `akis-deneme` yeni **§28 “İki pencere”**: aynı tarayıcı bağlamında iki sayfa; 1. sayfada İlerle → 2. sayfada örtü kendiliğinden belirir; 2. sayfada komut denenir → localStorage değişmez; Yeniden yükle → 2. sayfa 1.'nin anında.

### R1-b — kaydı dışa ve içe aktarma

- Ayarlar › Kayıt'a iki düğme: **Kaydı dışa aktar** ve **Kayıt dosyası yükle**.
- Dışa aktarma ana yuvanın zarfını olduğu gibi indirir (sağlamalı JSON): `chairman-<kulüp>-<oyun tarihi>.json`.
- İçe aktarma: dosya seçilir; en çok 20 MB; yalnız `JSON.parse`, ardından `kayitCoz` (sağlama, biçim, sürüm, eski sürüm geçişi, `kariyerDogrula`). Geçersiz dosyada depo değişmez, neden yazılır. Geçerliyse onay: dosyadaki kariyer (başkan, kulüp, oyun tarihi) ve şimdiki kariyer yan yana; **Yükle / Vazgeç**. Bu bir ayar onayıdır, başkanlık kararı değil (yeni kariyer onayının emsali; tek kart kuralı başkanlık kararları içindir).
- Yüklemede şimdiki ana kayıt `oyun-1.ice-oncesi` adıyla saklanır (bozuk kayıt saklamanın kalıbı), dosya ana yuvaya `kariyerKaydet` ile yazılır, sayfa yeniden açılır. Çakışma denetimi bu bilinçli yazımda atlanır; öbür sekme `storage` olayıyla örtüye düşer.
- Kural kısmı saf işlevdir (`kayitIceAktar(depo, yuva, metin)`); ekran yalnız dosyayı okur ve sonucu gösterir.
- Masaüstü: Electron'da indirme kaydetme penceresiyle çalışıyorsa ek iş yok; çalışmıyorsa `ana.js`'e kaydetme penceresi köprüsü (tek IPC). `node masaustu/deneme.js` ile denenir.

**Denetim:** `kariyer-deneme` yeni **1.7**: geçerli kayıt yazılır ve önceki ana `.ice-oncesi`'nde; bozuk sağlama, başka oyun, yeni sürüm, 20 MB üstü ve tutarsız kariyer reddedilir, depo değişmez; sürüm 10 örneği geçişle yüklenir. `akis-deneme` yeni **§29**: dışa aktarılan dosya localStorage'daki ana metinle birebir; `kayit-s10-*` örneği yüklenir, onay sonrası oda örneğin tarihinde açılır.

### R1-c — araçların girişleri

- **Güncel taban tek yerde.** `araclar/taban/GUNCEL.json`: `{"motor":"g1.json","sezon":{"t7":"sezon-s-t7.json","t3":"sezon-s-t3.json"},"cizim":["s1-anm.json","a5-anm-kaleci.json"]}`. `oturum-sonu.js`'in varsayılanı buradan gelir (bugün var olmayan `p2.json`'u arıyor); tur kapanışında yalnız bu dosya değişir. CLAUDE.md “Taban” maddesi buraya bağlanır.
- **Hızlı kademenin tek komutu:** `node araclar/hizli.js`. Değişen dosyaları git'ten okur (çalışma ağacı, hazırlananlar ve izlenmeyenler; `--taban <ref>` ile bir commit'e göre) ve KAPILAR'ın hızlı satırlarına göre seçer:
  - her zaman `ad-denetimi` (~1 sn);
  - motor dosyası (`js/mac-*.js` motor listesi, `js/kadrolar.js`) → `mac-deneme 4`; “sonuç aynı” satırı yoksa çıkış 1 (~20 sn);
  - kural dosyası (`kariyer-deneme`'nin yüklediği liste) → `kariyer-deneme` (~85 sn);
  - ekran ya da çizim dosyası → koşmaz, ilgili tarayıcı denetimini yazar (KAPILAR'daki bölüm numaralarıyla).
  
  İşler paralel koşar; sonunda tek tablo. `--hepsi` üçünü birden koşar. CLAUDE.md “Hızlı” satırı bu komuta iner.

### R1-d — borç defteri

- **`araclar/BORCLAR.md`**: bilinen her kabul dışı satırın, zaman aşımına düşen denetimin ve ertelenen işin tek tablosu. Sütunlar: no · satır ya da konu · tür (**kusur** / **zaman aşımı** / **kabul edilmiş borç** / **ertelenen iş** / **metni eskimiş**) · ilk görüldüğü tur · son değer ve tur · gerekçe · kapanış koşulu ya da sahibi olan tur · eşleşme kalıbı.
- İlk içerik devam notunun “Bilinen borçlar” paragrafından ve tur kayıtlarından gelir; raporun ayrıca istediği satırlar da girer: motorun `own` sınıflandırması (golün ~%15'i kendi kalesine sayılıyor, takım güvenini ve sevinci etkiliyor), tarayıcı ile Node maç girdisinin farkı (stat alanı, santra anı), 19b'nin eskimiş “kayıt sürümü 10” metni, 15b, dizüstündeki 14/14b/16 zaman aşımları, maaşın gizli kabiliyetten türemesi (R6), kayıt büyümesi ve arşiv (H3), hocanın görüşme önerisinin antrenman saatine düşebilmesi, motor ve ekran dosyalarının katı kibi (R1-e).
- **`oturum-sonu.js`** kabul dışı satırları defterin kalıplarıyla eşler: özet “bilinen borç N (değerleriyle) · yeni kabul dışı M”. Çıkış kodu yalnız **yeni** kabul dışı satırda 1 olur; bilinen satırın bugünkü değeri defterdeki son değerin yanında basılır (kötüleşme gözle görünür). Bugün her oturum sonunun çıkış kodu bilinen borçlar yüzünden 1'dir, yani çıkış kodu bilgi taşımıyor.
- `akis-deneme.py` özeti düşen bölümü aynı kalıplarla “bilinen” ya da “yeni” diye ayırır.
- Devam notundaki borç paragrafı defterin bağlantısına iner. Her tur kapanışında defter güncellenir; kapanan satır silinmez, “kapandı (tur)” olur.

### R1-e — katı kip: sessiz başarısızlık hata olur

**Sorun (kodla doğrulandı):** `kariyerKomut` paylaşılan alanları (`sezon`, `fikstur`, `oyuncular`, `maclar`) dondurur. Katı kipte dondurulmuş nesneye yazmak hata fırlatır ve komut düşer; gevşek kipte yazım sessizce yutulur ve komut başarılı görünür. 98 betiğin 68'i gevşek kipte. Kural katmanının çekirdeği bunların arasında: `kariyer`, `kayit`, `takvim`, `maliye`, `ajanda`, `mesele`, `yonetim`, `olay`, `soz`, `mesajlar`, `gozlem`, `baskan`, `baslangic`, `lig`, `kariyer-ornek`, `mac-girdi`, `adlar-test`, `oyun-oturumu`, `depo-tarayici`, `depo-masaustu`.

- Bu 20 dosyanın başına `'use strict'`. Ön tarama (2026-10-29): bu dosyalarda blok içinde işlev bildirimi yok, yani katı kip global ad sızıntısını değiştirmez. Uygulamada ayrıca bildirilmemiş ada atama, üst düzey `this` ve `arguments.callee` taranır.
- Açığa çıkan her gizli yazım ayrı commit'te düzeltilir ve “Sapmalar”a yazılır. Karar her biri için ayrıdır: yazım amaçlıysa kopyala-yaz ile gerçekten yazılır (sonuç değişebilir: yeni sezon tabanı ve gerekçe), amaçsızsa satır kalkar.
- **`ad-denetimi` (g):** `js/` altındaki her dosya `'use strict'` ile başlar; istisna yalnız gerekçeli izin listesi: motor dosyaları (`mac-motoru`, `mac-karar`, `mac-kurallar`, `mac-dizilis`, `mac-takim`, `mac-oncesi`, `mac-senaryo`, `kadrolar`, `hareket-egrileri`: katı kip `--ayni` 40 maç ve hız ölçümüyle ayrı küçük motor işidir, borç defterine), ekran ve çizim dosyaları (kariyere yazmazlar; borç defterine). Yeni dosya varsayılan olarak katıdır.
- **`kariyer-deneme` yeni 1.8:** dondurulmuş alana yazan bir deneme komutu (`k.sezon.ad='x'`) düşer; oturumun kariyeri ve depo değişmez; hata yazısı komutu adlandırır.

### R1-f — okunurluk tabanı

**Sorun (kodla doğrulandı):** bütün HTML yazısı karenin genişliğinin %1,5'idir (`STIL.kagit.yaziBoyu`, `cqw`); kare en az 640 px olduğundan gövde 9,6 px'e, `.74em` etiketler ~7 px'e iner. 768 satırlık dizüstü ekranında kare ~770 px'tir (gövde 11,6 px).

- **Ölçü aracı önce:** `araclar/okunurluk.py` (Playwright). Kare genişliği 640, 800 ve 1186 px'te oda, odak kabındaki işler (dosya, defter, telefonun ana ekranı, konuşma ve Canlı Skor, gazete, ayarlar, kadro, oyuncu dosyası), karar kartı, bülten, maç telefonu ve maç sonu kartı. Her görünür metin düğümünün hesaplanan boyu; görünür alanın dışında kalan ya da kırpılan metin (bilinçli üç nokta listesi hariç). Rapor: en küçük boy, eşik altı düğüm sayısı ve yerleri, taşma sayısı. Bugünkü değerler turun ilk ölçüsü olarak yazılır.
- **Eşikler (Claude kararı, aşağıda):** her kare genişliğinde gövde ≥ 14 px, hiçbir okunan metin < 12 px (simge ve süs, `aria-hidden`, sayılmaz), kırpılan metin yok.
- **Uygulama:**
  - `--k-yaziBoyu` = `max(14px, 1.5cqw)` (büyük yazı `max(16px, 1.8cqw)`). Geniş karede bugünkü boy aynen kalır; yalnız dar kare değişir.
  - Küçük göreli boylar (`.74em`–`.84em` arası 30'a yakın kullanım) tek basamağa toplanır (`STIL.kagit.yaziBasamak`: ikincil `.86em` → 14 px tabanda 12 px). Yeni boy uydurulmaz.
  - Dar kare düzeni (`@container`, kare < 820 px): odak kabı tam genişlik; göz atmada yan kâğıt işin yanına değil yerine açılır (‹ Geri aynı); masa şeridi iki satıra iner; uzun içerik kendi kâğıdında kayar.
  - Telefon: bu turda yalnız taşma önlenir (içerik kayar); sol–sağ düzen R2'nin işidir, şimdi iki kez yapılmaz.
- **Denetim:** `okunurluk.py` üç genişlikte eşikleri geçer; `kontrol.py` hatasız ve görüntüler üç genişlikte incelenir (PNG kullanıcıya verilmez, kabul sahnesi üretilmez); `akis-deneme` U bölümleri (1, 3, 19, 21–27) ve tamamı masaüstünde.

## Yapılmayacaklar

- Kayıt büyümesi, sezon arşivi, IndexedDB ve sıkıştırma (H3 ile; tek sezonda kayıt ~500 KB, localStorage sınırı ~5 MB).
- Motor dosyalarına dokunmak, motorun ve ekranların katı kibi (borç defterinde), `MOTOR_AYAR`, taban üretimi.
- Tip denetimi aracı, modüllere bölme, paketleme aracı, animasyon kütüphanesi (değerlendirmede gerekçesiyle reddedildi).
- Telefonun sol–sağ düzeni ve büyük kart (R2), Canlı Skor (R3), yeni içerik, yeni metin (yalnız örtü, onay ve hata yazıları; TEST değil, düz işlev metni).
- Kayıt sürümü ve zarf biçimi değişmez (11 ve 1).

## Claude kararları (belgeye görünür yazılır; itiraz serbest)

- Çakışmada **üstüne yazma seçeneği yoktur**: veri kaybını oyuncunun tek tıklamasına bırakmamak için. Yeniden yükle her zaman güvenlidir; daha yeni ilerleme kayıttadır.
- Çakışmanın tek doğruluk kaynağı yazmadan önceki karşılaştırmadır; `storage` olayı yalnız erken uyarıdır (masaüstünde ve aynı süreçte olay yoktur).
- Web Locks kullanılmaz: açılış zaman uyumlu, kilit zaman uyumsuz; `file://` açılışında güvenli bağlam belirsiz. Karşılaştırarak yazma her ortamda çalışır.
- İçe aktarma **Yükle / Vazgeç** onayıyla: ayar onayıdır, başkanlık kararı değildir.
- Dışa aktarılan dosya kayıt zarfının kendisidir: ayrı biçim yok, aynı doğrulama.
- Borç defteri `araclar/BORCLAR.md`'de, KAPILAR'ın yanında: denetim aracıdır, oyun belgesi değil. Kalıp sütunu sayesinde tek kaynak.
- Katı kip varsayılandır; gevşek kalan her dosya izin listesinde gerekçeli durur.
- Okunurluk eşikleri 14 px gövde ve 12 px en küçük metin: masaüstü arayüzlerin alışılmış alt sınırı. Kesin değerler ölçüden sonra kullanıcıya gösterilir.

## Kabul

- `node araclar/kariyer-deneme.js` çıkış 0: 1.6, 1.7 ve 1.8 geçer; bütün eski bölümler geçer.
- `node araclar/ad-denetimi.js` temiz, (g) dahil.
- `node araclar/hizli.js --hepsi` çıkış 0; `node araclar/hizli.js` değişen dosyaya göre doğru denetimi seçer (her türden bir dosyayla denenir).
- Motor dosyaları değişmedi: `node araclar/oturum-sonu.js --ayni --seyrek` varsayılan tabanla (GUNCEL.json'dan) 40/40 birebir; özet “yeni kabul dışı 0”, bilinen borçlar defterle eşleşir; çıkış 0.
- `node araclar/sezon-deneme.js 18 7 --karsilastir araclar/taban/sezon-s-t7.json --ayni` birebir. Katı kip gizli bir yazımı açığa çıkarıp düzeltme sonucu değiştirdiyse: fark gerekçesiyle Sapmalar'a, yeni sezon tabanı.
- `python -X utf8 araclar/okunurluk.py` üç genişlikte eşikleri geçer.
- `python -X utf8 araclar/akis-deneme.py 1 2 3 19 21 22 23 24 25 26 27 28 29` geçer; tamamı masaüstünde (bilinenler defterde).
- `python -X utf8 araclar/kontrol.py` hatasız; `python -X utf8 araclar/kontrol.py araclar/kayit-deneme.html` (kayıt yolu değişti); görüntüler incelendi.
- Masaüstü: `node masaustu/deneme.js` (kayıt yolu, dışa ve içe aktarma).
- Belgeler aşağıdaki gibi; `git diff --check`; etiket; `main`'e alma ve push kullanıcının sözüyle.

## Belgeler

- **YOL_HARITASI:** karar 56 (program revizyonu, §0), karar 57 (R1 Claude kararları); devam notu yeniden yazılır ve kısalır (kapanmış turların paragrafları etiketlerde kalır; borçlar BORCLAR.md'ye); Tamamlanan turlar.
- **CLAUDE.md:** Kontrol (hızlı kademe `hizli.js`; Taban `GUNCEL.json`; oturum sonunun yeni çıkış kodu), Program (R sırası), Bugün çalışan (kayıt çakışması örtüsü, dışa ve içe aktarma, yazı tabanı).
- **TEKNIK_PLAN:** §1 araçlar satırı; §5 karşılaştırarak yazma, çakışma, dışa ve içe aktarma; §11 `hizli.js`, borç defteri, `okunurluk.py`.
- **STIL_REHBERI §7:** yazı tabanı, basamak ve dar kare düzeni.
- **araclar/KAPILAR.md:** kayıt yolu, içe aktarma, yazı ölçeği satırları; hızlı kademe `hizli.js`.
- **araclar/plan:** `OKU.md` satırı; `y-program.md`, `h3-uygulama.md`, `h-program.md` başına R programı notu.

## Riskler

- **Katı kip gizli hata açar.** İstenen sonuç budur; ama düzeltme sonucu değiştirebilir. Her biri ayrı commit, gerekçe ve sezon tabanıyla.
- **Yanlış çakışma.** Aynı pencerede oturum dışından yazan bir yol olursa oyuncu boşuna örtü görür. Bugün yok (taranmış); `ad-denetimi`'ne bir satır daha: ana yuva adına `OYUN_DEPO.yaz` yalnız `js/kayit.js`'te.
- **Bilinçli üstüne yazma yolları:** bozuk kaydın yerine yeni kariyer ve içe aktarma. İkisi de çakışma denetimini açıkça atlar; 1.6 ve 1.7 sınar.
- **Okunurluk tabanı dar karede düzeni bozar.** Ölçü aracı önce gelir; akış denemesinin U bölümleri yeniden koşar. Telefon taşarsa bu turda yalnız kaydırma, düzen R2'de.
- **Electron'da indirme.** Çalışmazsa tek IPC köprüsü; masaüstü denemesi koşar.
- **Akış denemesinin süresi.** Yeni iki bölüm kısa; tamamı yine masaüstünde.

## Tahmin

8–12 saat. Sıra: §0 belge → R1-c ve R1-d (araçlar önce, sonraki denetimler onlarla koşar) → R1-e → R1-a → R1-b → R1-f → kapanış.

## Sapmalar

(boş — uygulama sırasında doldurulur)
