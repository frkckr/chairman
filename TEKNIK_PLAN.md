# Chairman — teknik plan

Son güncelleme: 2026-09-29. Bu belge mevcut prototipten hedef kariyer oyununa geçiş planıdır. “Hedef” bölümleri uygulanmış özellik anlamına gelmez. Oyun kuralları [OYUN_TASARIMI.md](OYUN_TASARIMI.md), iş sırası [YOL_HARITASI.md](YOL_HARITASI.md) içindedir.

## 1. Bugünkü yapı

| Alan | Mevcut dosyalar ve durum |
|---|---|
| Açılış | `index.html`; klasik betikler sırayla yüklenir, derleme aracı yok |
| Veri ve ortak araçlar | `js/ortak.js`, `js/kadrolar.js`, `js/lig.js`, `js/mac-senaryo.js`, `js/stadyum-tarifleri.js` |
| Kariyer durumu | `js/kariyer.js` oluşturma/kimlik/doğrulama; `js/takvim.js` zaman ve bekleyen işler; `js/maliye.js` para kaydı; `js/ajanda.js` ajanda işleri, karar işleri ve günü bitirme; `js/yonetim.js` yönetim koltukları ve karar türleri; `js/kayit.js` kayıt/yükleme; `js/kariyer-ornek.js` TEST örnek kariyer (`KARIYER_ORNEK`) ve oynanabilir TEST haftası (`KARIYER_BASLANGIC`). `index.html`'e `lig.js`'ten sonra yüklenir |
| Platform | `js/depo-tarayici.js` tarayıcı (localStorage), `js/depo-masaustu.js` masaüstü kayıt deposu |
| Masaüstü (deneme) | `masaustu/`: Electron ana süreç `ana.js`, köprü `onyukleme.js`, çevrimdışı kopya `hazirla.js`, paket `paketle.js`, iki açılışlı deneme `deneme.js`. Yalnız Windows x64 |
| Maç mantığı | `js/mac-motoru.js`, `js/mac-dizilis.js`, `js/mac-karar.js`, `js/mac-kurallar.js` |
| Maç günü akışı | `js/mac-oncesi.js`; maç öncesi, devre arası, maç sonu |
| Görsel temel | `js/stil-99.js`, `js/goruntu.js`; Three.js r128, kodla üretilen görseller |
| Stat ve insanlar | `js/stadyum.js`, `js/seyirci.js`, `js/oyuncular.js`, `js/golgeler.js` |
| Bağlantı ve sunum | `js/mac-sahnesi.js`, `js/ekran-ajanda.js` (açılış ekranı, kayıt bağlantısı), `js/ekran-mac-oncesi.js`, `js/baskan.js`, `js/efektler.js`, `js/arayuz.js` |
| Kontrol | `araclar/kontrol.py` tarayıcı kontrolü; `araclar/mac-deneme.js` görüntüsüz maç ölçümleri; `araclar/kariyer-deneme.js` kariyer, takvim, para ve kayıt denetimi; `araclar/kayit-deneme.html` tarayıcıda kayıt/yenileme/yükleme denemesi |

Motor sahneye bağlıdır. Kadrolarda gizli yetenek değerleri, motorda tohumlu rastgelelik ve sabit zaman adımı bulunur. Kariyer takvimi, para, kayıt ve ajanda çalışır; ancak maç sonucu kariyere bağlı değildir. Kalıcı sözleşme, seçim, oyuncu gelişimi ve kariyer yöneten hoca sistemi henüz yoktur.

Tarayıcı sürümünde Three.js ve sayfa fontları dış kaynaklardan yüklenir. Masaüstü kopyası bunları yerel dosyalardan yükler ve çevrimdışı açılır (1.5 denemesi, §10). Üst düzey tanımlar betikler arasında paylaşılır; yeni adlar ve yükleme sırası bu yüzden dikkat gerektirir.

## 2. Sorumlulukların ayrılması

Hedef akış:

> Kariyer durumu → hocanın hazırladığı maç girdisi → Match → sonuç ve olaylar → kariyer durumuna tek uygulama.

Görüntü bu akışı gösterir; para, seçim veya kariyer sonucunun kaynağı çizim döngüsü olmaz.

| Sorumluluk | Üreteceği şey |
|---|---|
| Dünya ve takvim | Tarih, kişiler, kulüpler, görevler, fikstür ve bekleyen işler |
| Yönetim | Kararlar, bütçe sınırları, ilişkiler, sözler ve sözleşmeler |
| Futbol hazırlığı | Hocanın bilgisine göre kadro/taktik ve geçerli maç koşulları |
| Maç motoru | Sahadaki hareket, kurallar, skor, istatistik ve olaylar |
| Kariyere sonuç uygulama | Puan durumu, para, kullanılabilirlik, geçmiş ve ilgili sonuçlar |
| Sunum | Maç sahnesi, görüşmeler, ajanda, raporlar ve bildirimler |
| Platform ve kayıt | Kaydetme, yükleme, dosyalar, dil ve masaüstü bağlantısı |

Yeni mantık çizimden bağımsız çalıştırılabilir olmalı. Mevcut motoru baştan yazmak başlangıç şartı değildir. Dosya/klasör adları, modül geçişi ve paketleme yöntemi küçük denemelerle seçilir. Bir iş için gerekmeden bütün kod tabanı dönüştürülmez.

## 3. Kalıcı dünya verisi

İlk aşamada küçük bir örnek kariyer kurulacak; aşağıdaki alanlar gerektiği aşamada doldurulacak. Bütün sistemleri peşinen uygulamak gerekmez.

- **Kimlik:** Kulüp, kişi, sezon, maç, sözleşme, olay, söz ve yatırım için kalıcı kimlik. İsim değişse veya kişi emekli olsa kimliği değişmez.
- **Kariyer:** Kayıt sürümü, dünya tohumu, tarih, gün içi konum, başkanın kimliği/yaşı, görev durumu, hedef ve final durumu.
- **Kulüp:** Kademe, tesis ve stat durumu, yönetim, mali defter, kadro ve kimlik/geçmiş referansları.
- **Kişiler:** Rol, doğum tarihi, geçmiş, kulüp bağlantıları, ilişkiler, özel özellikler ve aktif/emekli/ayrılmış gibi durumlar.
- **Taahhütler:** Maaş, taksit, prim, sponsorluk hakkı, verilen söz ve teslim tarihi.
- **Devam eden işler:** Kampanya, görüşme, inşaat, gözlem, beklenen yanıt ve tetiklenecek olay.
- **Geçmiş:** Önemli kararlar, sonuçlar, görev değişimleri, kupalar ve tekrar kullanılacak sahne anıları.

Kulübün başlangıç tarihi ile oyuncunun oluşturduğu kariyer geçmişi ayrılır. Yeni kişiler üretilirken mevcut kişilerle kimlik çakışması olmaz. Bir kişinin ölmesi veya emekli olması geçmiş referanslarını silmez.

Kalıcı kayıtta Three.js nesneleri, DOM öğeleri ve canlı fonksiyonlar bulunmaz. Sayısal para değerleri tanımlı en küçük para biriminde tutulur; kayan nokta hataları ödeme birikimine dönüşmez.

### Uygulanan ilk sözleşme (1.1–1.3, 2026-09-29)

Kariyer durumu tek bir sade veri nesnesidir; kurallar `js/kariyer.js`, `js/takvim.js` ve `js/maliye.js`, TEST örneği `js/kariyer-ornek.js` içindedir.

| Alan | Biçim |
|---|---|
| `kayitSurumu` | Tamsayı; şu an `1`. Farklı sürüm doğrulamada reddedilir (dönüşüm adımları 1.4'te) |
| `dunyaTohumu` | Tamsayı |
| `tarih`, `gunIciDakika` | `YYYY-AA-GG` metni (saat diliminden bağımsız); gece yarısından beri dakika, 0–1439 |
| `baskanId`, `gorevDurumu` | Kişi kimliği; `taraftar`, `aday`, `gorevde`, `gorevDisi`, `yenidenAday`, `kariyerSonu` |
| `final` | `null` ya da ileride tanımlanacak nesne |
| `sonrakiNo` | Tür başına sayaç (`kisi`, `is`, `hareket`); `kimlikUret` yeni kimliği buradan verir, var olan kimliği vermez |
| `kulupler` | Anahtar = `id`; küçük harf/rakam kimlik (`demirkapi`), `ad`, `kisa`, `kademe` 1–3, `baskanId`, `acilisNakit`, `nakit` (kuruş tamsayı) |
| `kisiler` | Anahtar = `id` (`kisi-N`); `ad`, `rol`, `dogumTarihi`, `kulupId` (ya da `null`), `durum`: `aktif`, `emekli`, `ayrildi`, `vefat` |
| `isler` | Bekleyen işler; anahtar = `id` (`is-N`); `tur`, `tarih`, `dakika`, `veri`. Türler: `hatirlatma`, `odeme`, `ajanda` |
| `gecmis` | Sıralı kayıt. Tamamlanan iş: `tur: 'is'`, `isId`, `isTuru`, `tarih`, `dakika`, `sonuc`. Erteleme: `tur: 'erteleme'`, `isId`, `tarih`, `dakika`, `eski`, `yeni`, `saat`, `baslik`, `otomatik`. Yapılmadan iptal: `tur: 'iptal'`, `isId`, `isTuru`, `tarih`, `dakika`, `baslik`, `neden`. İptal edilen iş tamamlanamaz |
| Kulüp `yonetim` (isteğe bağlı) | `{sayman, futbol, basin}` → kişi kimliği ya da `null`. Oturan kişi aktif, o kulübe bağlı ve `yonetici` rolünde olmalı; bir kişi tek koltukta oturur |
| Kişi `profil`, `katki` (isteğe bağlı) | `profil`: `{meslek, guclu, zayif, beklenti}` metinleri, oyuncuya gösterilir. `katki`: `{mali, baglanti, futbol, iletisim}` → `zayif`/`orta`/`guclu`, gizlidir ve iş sonuçlarını belirler |
| `hareketler` | Para hareketleri: `id` (`hareket-N`), `kulupId`, `tarih`, `dakika`, `tutar` (kuruş; gelir +, gider −), `kalem`, `aciklama`, `kaynak` (işin kimliği ya da `null`) |

`kariyerDogrula` sade veri dışı değerleri (fonksiyon, `undefined`, NaN, Date, sınıf örneği), eksik referansları, geçersiz tarihleri, bilinmeyen durumları, sayaç çakışmasını ve görevdeki başkanın kulüp kaydıyla uyumsuzluğunu Türkçe açıklamayla bildirir. Takvim ve para için ayrıca: zamanı geçmiş fakat tamamlanmamış işi, iki kez tamamlanan işi, açılış nakdi ile hareketlerin toplamını tutmayan nakdi, kesirli tutarı ve aynı işten iki kez doğan para hareketini yakalar. Kulüp kimlikleri bugünkü `KADROLAR`/`LIG` anahtarlarıyla aynıdır; bu köprü 3.3'te kullanılır.

**Ajanda işi (2.1):** `ajanda` türü bekleyen iştir; `tarih`/`dakika` başlangıcıdır.
- `veri` alanları: `baslik`, `aciklama`, `zorunluluk` (`zorunlu`, `ertelenebilir`, `istege`), `sure` (0–720 dk). İsteğe bağlı olarak `kisiId`, `bilgi` (iş yapılınca öğrenilen metin), `sonTarih` (yalnız ertelenebilir işte) ve `eylem` (`macGunu`) bulunabilir.
- Geçmişteki `sonuc` alanı `{durum: 'yapildi'|'kacirildi', baslik, zorunluluk, gun, saat, sure, bilgi?, eylem?}` biçimindedir. Böylece iş listeden çıktıktan sonra da ajandada gösterilebilir.
- Alanlar eklemelidir; `kayitSurumu` 1 kalır. Bu tür olmadan yapılmış kayıtlar olduğu gibi açılır.

`KARIYER_BASLANGIC`, `KARIYER_ORNEK`'in kulüp ve kişileri üzerine kurulu oynanabilir TEST haftasıdır. 23 Kasım 08:00'de başlar, Cumartesi 19:00 maç işinde (`LIG.buMac`) biter. Ekledikleri: yönetim koltukları, üç sayman adayı ve iki karar işi. `KARIYER_ORNEK` değişmez.

Sonradan yüklenen kural dosyaları kendi doğrulamasını `EK_DENETIMLER` listesine ekler (`js/yonetim.js` → `yonetimDogrula`). Dosya yüklü olmayan sayfada o alan denetlenmez.

Gelecekteki ödeme ayrı bir liste değil, takvimdeki `odeme` türü iştir; zamanı gelince bir kez para hareketine dönüşür. Böylece mevcut nakit ile henüz ödenmemiş taahhütler ayrı durur (`maliDurum`). Hareket listesi uzun kariyerde büyür; dönem özetlerine sıkıştırma kayıt boyutu ölçüldüğünde ele alınır.

## 4. Zamanın ilerlemesi

Takvim/gün içi saat kariyer mantığına aittir. Maçın sabit adımı ve ekrandaki animasyon zamanı ayrı çalışır. Görüşmede düşünmek, oyunu duraklatmak veya antrenman görüntüsünü açık bırakmak takvimi belirsiz biçimde ilerletmez.

Bir eylem, takvimde ne kadar yer kapladığını ve hangi işi başlattığını bildirir. Takvim ilerlemesi; ödemeler, son tarihler, maçlar ve yatırımları belirlenmiş sırayla işler. Aynı tarihteki olayların sırası tutarlı olur.

Başkanlık dışındaki hızlı takip de aynı takvim işlemlerini kullanır; ayrı ve çelişen bir dünya simülasyonu kurulmaz. Önemli gelişmelerde durur. Geliştirici testlerinde yıllar hızlı geçilebilir; bu test aracı oyuncunun kariyer temposuyla karıştırılmaz.

**Uygulanan (1.2, 2026-09-29):** `zamanIlerlet(k, dakika)` takvimi yalnız tam dakika ve ileri yönde ilerletir; arada zamanı gelen işleri önce en erken an, aynı anda önce eklenen sırasıyla bir kez tamamlar ve `gecmis`'e yazar. Zamanı tek seferde ya da parça parça ilerletmek aynı sonucu verir. `sonrakiGuneGec` ertesi günün başlangıcına (TEST: 08:00) gider. Geçmiş bir ana iş kurulamaz.

**Uygulanan (2.1, 2026-09-29):** Takvime üç ekleme yapıldı.
- Bir iş türü `pay` bildirebilir; iş, zamanından o kadar dakika sonra tamamlanır. Ajanda işi `pay: 1` kullanır: başlangıç dakikasında hâlâ katılınabilir, o dakika geçince takvim işi “kaçırıldı” diye kapatır.
- `isTamamla(k, id, sonuc)` bekleyen işi şu anda tamamlayıp geçmişe yazar. Hem takvim hem ajanda katılımı bunu kullanır; iş yine bir kez tamamlanır.
- `isTasi(k, id, tarih, dakika)` işi kimliğini koruyarak ileri taşır.

`js/ajanda.js` işlevleri:
- `ajandaOnizle`: işin başlangıcını ve bitişini, araya girip kaçırılacak işleri, arada gerçekleşecek ödemeleri ve engelleri bildirir. Engeller: araya giren zorunlu iş, başka günün işi, gün içinde bitmeyen iş.
- `ajandaIsiYap`: zamanı başlangıca getirir, işi “yapıldı” diye kapatır, sonra süresi kadar ilerler.
- `ajandaErtele`: ertelenebilir işi ertesi güne taşır; son tarih aşılamaz.
- `gunuBitirOnizle` / `gunuBitir`: bekleyen zorunlu iş ya da son günü gelmiş ertelenebilir iş varsa gün bitmez. Diğer ertelenebilir işler ertesi güne taşınır, isteğe bağlılar kaçırılır; ardından `sonrakiGuneGec` çağrılır.
- `ajandaGunu`, `yaklasanlar`, `kulupDurumu`: ekranın okuduğu özetleri üretir.

`GUN_BASLANGICI` hâlâ TEST değeri olan 08:00'dir.

## 5. Kayıt ve yükleme

Kayıt erken aşama işidir. Hedefler:

- Sürümlü kayıt biçimi; eski kayıtlar için gerektiğinde açık dönüşüm adımları.
- Otomatik kayıt ve önceki sağlam kayda dönüş. Yeni yazım tamamlanmadan eski sağlam kayıt kaybedilmez.
- Kimlikler, tarih, para hareketleri ve ilişkiler için yükleme doğrulaması. Bozuk veya desteklenmeyen kayıt açıklanabilir hata üretir.
- Rastgele üreticilerin devam durumu, bekleyen işler ve uygulanmış işlem kimlikleri kaydedilir.
- Ödeme, transfer, seçim ve maç sonucu yükleme sonrası ikinci kez uygulanmaz.
- Kayıt sınırları açık olur. İlk çalışan sürümde gün/karar sınırlarında kayıt yeterlidir; maç veya görüşmenin ortasından devam hedefi ayrıca değerlendirilir ve arayüzde doğru anlatılır.
- Tarayıcı ve masaüstü depolaması ortak bir kayıt arayüzünün farklı uygulamalarıdır; kariyer kuralları dosya yolunu bilmez.

**Uygulanan (1.4, 2026-09-29):** `js/kayit.js` kariyeri sağlamalı bir zarf içinde kaydeder: `{oyun, bicim, saglama, ozet, veri}`. Tutarsız kariyer yazılmaz. Yazım sırası `.yeni` → sağlam ana kaydın `.onceki`'ye kopyası → ana kayıt → `.yeni`'nin silinmesidir; her adım geri okunarak doğrulanır. Yükleme ana kayıt, `.yeni`, `.onceki` sırasıyla ilk sağlam kaydı açar ve atlananları açıklamayla bildirir. Daha yeni sürümlü kayıt açılmaz; eski sürümler `KAYIT_GECISLERI` ile sırayla dönüştürülür (henüz geçiş yok, sürüm 1 ilk kalıcı sürümdür). Depo `oku/yaz/sil` arayüzüdür: `bellekDeposu` denemeler için, `tarayiciDeposu` localStorage için.

**Uygulanan (2.1, 2026-09-29):** Oyun kaydı `js/ekran-ajanda.js` tarafından yapılır.
- **Depo:** Önce masaüstü deposu, yoksa tarayıcı deposu (`chairman:` önekiyle) kullanılır. İkisi de yoksa kayıt yalnız bellekte tutulur ve ekranda uyarı gösterilir.
- **Yuva:** `oyun-1`. Deneme sayfasının kullandığı ve temizlediği `kariyer-1` yuvasından ayrıdır.
- **Açılış:** Kayıt varsa oradan devam edilir; önceki kayda dönüldüyse ekranda bildirilir. Yuva boşsa `KARIYER_BASLANGIC` oluşturulur ve kaydedilir.
- **Açılamayan kayıt:** Üzerine yazılmaz. Oyuncu onaylarsa bozuk dosyalar `.bozuk` ekiyle saklanır, ardından yeni kariyer başlar.
- **Otomatik kayıt:** Yalnız gün sınırında, yani günü bitirince ve yeni kariyerde yapılır. Maç sınırında kayıt yoktur; sayfa yenilenirse son gün başından devam edilir.
- **Kayıt ekranı:** Kayıt listesi ve birden çok yuva yoktur. “Yeni kariyer” iki adımlı onayla başlar.

Bulut kaydı düşünülürken kullanıcıya ait kayıt konumu ve çakışma davranışı planlanır. İlk adım yerel kaydın güvenilirliğidir. Steam Cloud seçeneği bu temelin üstünde değerlendirilir; uygulanmış sayılmaz. Kaynak: [Steam Cloud belgeleri](https://partner.steamgames.com/doc/features/cloud).

## 6. Karar, olay ve ilişki sistemi

Bir olay tarifi şu alanları taşıyabilir: kimlik, önkoşullar, katılımcılar, bilgi kaynakları, seçenekler, süre, doğrudan etkiler, ertelenmiş etkiler, tekrar aralığı ve kapanış koşulu.

Oyuncu seçeneği seçtiğinde kariyer mantığı yetki, bütçe ve son tarihi yeniden doğrular. Geçerli karar, sonuçlarıyla birlikte kayda girer. Ekrandaki düğmeye iki kez basmak aynı sözleşmeyi iki kez oluşturmaz.

Olayların görevleri ayrılır:

- Kulübün başlangıç geçmişinden gelen yazılmış sahneler.
- Geçerli dünya durumundan doğan fırsatlar ve sorunlar.
- Oyuncunun önceki kararlarının dönüşleri.

Tekrar sınırı ve eşzamanlı gündem yoğunluğu izlenir. Sahne seçicisi, iyi yönetimin sağladığı rahatlığı sürekli kriz üreterek ortadan kaldırmaz. Seçeneklerin görünür metni ile uyguladığı etki ayrı veri olarak bulunur.

**Uygulanan ilk karar yapısı (2.2 ilk adım, 2026-09-29):** Karar, ajanda işinin `veri.karar` alanıyla bağlanan bir `KARAR_TURLERI` türüdür (`js/ajanda.js`). Her tür üç işlev sağlar:
- `denetle`: verinin geçerliliği.
- `secenekler(k, is)`: görünür metin, açıklama satırları, isteğe bağlı süre ve engel.
- `uygula(k, is, secim)`: etkiler ve sonuç bilgisi.

Seçim önizlemede, sonra zaman işin başlangıcına geldiğinde yeniden doğrulanır. Etki bir kez uygulanır ve işin geçmiş kaydına `secim`, `secimMetni` ve `bilgi` olarak yazılır; iş kapandığı için ikinci kez uygulanamaz.

`js/yonetim.js` üç tür tanımlar:
- `koltukSecimi`: adaylardan birini boş koltuğa oturtur.
- `sponsorGecikmesi`: başkan kendisi görüşür (90 dk) ya da işi saymana devreder (15 dk). Devredilen işin sonucu saymanın gizli katkısına göre değişir:
  - Bağlantısı güçlü sayman için sponsor indirim ister. İndirim saymanın yetkisini aştığı için ertesi gün başkana zorunlu karar olarak döner.
  - Mali deneyimli sayman ödemeyi iki taksite böler.
  - Bağlantısı zayıf sayman ödemenin gecikmesini engelleyemez; sözleşmedeki gecikme bedeli işletilir.
- `sponsorIndirimi`: indirimi kabul (tutar düşer) ya da ret (ödeme iki hafta kayar).

Sonuçlar ödeme işlerini iptal eder, taşır ya da yeni ödeme planlar; olasılık kullanılmaz. Metinler ve tutarlar TEST değeridir. Söz ve ilişki kaydı (2.4) henüz yoktur; adayın beklentisi yalnız metin olarak kalır.

Sözler için muhatap, şart, son tarih, bilinirlik ve durum tutulur. İlişkiler tek bir herkesin paylaştığı popülerlik sayısı değildir; gerektiği kadar kişiye/gruba özgü tutulur.

## 7. Gerçek özellik ile bilgi arasındaki sınır

Gizli futbolcu/teknik direktör değerleri motor ve değerlendirme mantığında kullanılabilir. Sunum katmanı rapor üretimi üzerinden bilgi alır; gizli toplam puan doğrudan arayüze taşınmaz.

Gözlem kaydı: gözlemci, tarih, bağlam, gözlem sayısı, tahmin ve belirsizlik. Hoca seçim mantığı bu bilgiyle ve kendi kabiliyet/tercihleriyle çalışır. Oyuncunun gerçek değerini kusursuz görmez. Aynı bilgiyi içeren bir rapor ekranını tekrar açmak yeni bir rastgele değerlendirme üretmez.

Gelişim, yaşlanma, sakatlık ve geçici form etkileri ayrı saklanır. Motor girdisine dönüştürülürken aynı etki iki kez uygulanmaz. Yeni özellikler, sahadaki bir davranışa veya yönetim kararına anlamlı etkisi varsa eklenir.

## 8. Mevcut maç motoruyla bağlantı

Kariyer maç girdisini hazırlar: maç kimliği, kadro, hoca taktiği, taraflar, zemin/maç günü koşulları, tohum ve o maç için oyuncu durumu. Mevcut `Match` arayüzüne bir dönüştürücüyle bağlanır; yeni parametre gerektiren yerler ayrı işler olarak açılır.

Maç sonucu sabit bir kayıt hâline gelir: skor, istatistikler, olaylar ve kariyere aktarılacak durumlar. Lig ve ekonomi bu kaydı maç kimliğiyle bir kez uygular. Hikâye, kazanılması gerektiği için maç sonucunu sonradan değiştirmez.

Hızlandırılmış ve görüntülü çalıştırma aynı mantık adımlarını kullanır. İzleme hızı, çizim kare sayısı veya ekrandaki rastgele efektler sonucu değiştirmemelidir. Mevcut tohumlu motor bu hedef için temel sağlar; kariyer bağlantısında tekrar doğrulanır.

Diğer maçların işlem süresi ölçülür. Gerekirse arka plan işçileri, işlem kuyruğu ve sonuçların yeniden kullanılmasına gidilir. Daha ucuz ayrı bir maç modeli ancak ölçümle ihtiyaç kanıtlanırsa ve denge etkisi karşılaştırılırsa değerlendirilir; başlangıçta otomatik kabul edilmez.

Son gözlenen kısa ölçüm (2026-09-29, tohum 1–10): 10 maçta ortalama 2,1 gol, 10,1 şut; korner ve geri pas oranı hedef dışında. Bu örneklem tüm motorun dengelendiğini veya uzun kariyerin doğrulandığını göstermez. Kabul hedefleri `araclar/mac-deneme.js` içindedir; eski belgelerdeki yaklaşık 25 şut ifadesi güncel zorunlu hedef değildir.

## 9. Lig, seçim ve yaşam döngüleri

Lig yapısı kulüp kimliğinden ayrılır; sezon geçişinde kademe değişebilir. Fikstür, puan eşitliği, yükselme/düşme, transfer takvimi ve Avrupa hakkı seçilen oyun kurallarına göre veriden okunur. Kesin formatlar seçilmeden gerçek bir lig statüsü varsayılmaz.

Avrupa rakipleri ve dış transfer havuzu gereken ölçüde temsil edilir. Ayrıntılı yabancı lig fikstürü başlangıç kapsamı değildir. Kadro eksilmesi ve emeklilik karşısında yeni oyuncu/personel üretimi dünya nüfusunu sürdürebilmelidir.

Başkanın durumları: taraftar, aday, görevde, görev dışında, yeniden aday ve kariyer sonu. Geçişler yetkileri değiştirir; ekran değiştirmek yetki kazandırmaz. Yeni yönetim görev dışındaki yıllarda da kulübün işlerini yürütür.

Final kontrolü; başkanın kariyer durumu ve tanımlı en büyük Avrupa kupasının sonuç kaydını kullanır. Küçük kupa, rakibin başarısı veya eski başkanın yalnız taraftar olarak izlediği kulüp başarısı kendiliğinden başkanlık zaferi sayılmaz. Ayrıntılı özel durumlar final aşamasında kararlaştırılır. Başarı finali ile kupasız sonun aynı anda tetiklenmesi önlenir.

## 10. Sunum, metin ve masaüstü

- İlk içerik Türkçedir. Yeni metinler anlamlı anahtarlar ve parametrelerle ayrılır; kişi adlarına bağlı dil kuralları oyun mantığına yayılmaz. Mevcut Türkçe yardımcılar aşamalı uyarlanır.
- Oyundaki görseller kodla üretilir. Görsel sabitler stil katmanında; iş kuralları kariyer/motor katmanında kalır.
- Görüşme süresi, yazı büyüklüğü, flaş/sarsıntı ve ses seçenekleri okunabilirlik ve erişilebilirlik ihtiyacına göre planlanır.
- Masaüstü denemesi Aşama 1'de yapılır. İşletim sistemi kapsamı ve paketleme yöntemi o denemede seçilir; yalnız Steam hedefi var diye motor değişmez.
- Three.js ve fontlar gibi gerekli dış kaynaklar çevrimdışı pakete uygun biçimde yerelleştirilir. Sürümleri ve dağıtım koşulları kayda alınır.
- Tarayıcı/GitHub Pages geliştirme yolu sürerken masaüstü kayıt ve dosya işlemleri ayrı platform katmanına konur.
- Deneme; internet kapalı açılış, Türkçe karakter içeren dosya yolu, kayıt/yükleme, pencere/tam ekran ve gerekli kaynakları kapsar.

### Masaüstü denemesi ve seçim (1.5, 2026-09-29)

**Kullanıcı kararı:** önce yalnız Windows; paketleme Electron ile. Linux/Steam Deck ve macOS sonra değerlendirilir.

**Uygulanan:** `masaustu/` klasörü (Electron 44.4.5, Chromium 152, @electron/packager 20.3.0; sürümler `masaustu/package.json`'da sabit).
- `hazirla.js` depodaki oyunu değiştirmeden `masaustu/oyun/` kopyasını kurar. Three.js r128 (MIT) ile IBM Plex Mono ve Jersey 10 (OFL-1.1, Türkçe harfler için latin-ext dahil) npm paketlerinden yerele alınır; `index.html` bağlantıları yerel dosyalara çevrilir; lisanslar ve sürümler `kutuphane/` altına yazılır. Kopyada dış adres kalırsa durur.
- `ana.js` pencereyi açar (F11 tam ekran), `file:` dışındaki bütün ağ isteklerini engeller ve sayar, izin isteklerini reddeder, tek kopya çalıştırır. Sayfa Node.js'e erişemez (`contextIsolation`, `sandbox`); kayıt işlemleri `onyukleme.js` köprüsüyle ana sürece gider.
- Kayıtlar `%APPDATA%\Chairman\kayitlar\<ad>.json` dosyalarındadır. Her yazım geçici dosyaya yapılır, diske işlenir (`fsync`), sonra yerine taşınır; üstünde `js/kayit.js`'in `.yeni`/`.onceki` düzeni çalışır.
- `paketle.js` `cikti/Chairman-win32-x64/Chairman.exe` üretir (asar arşivi).

**Doğrulanan (geliştirme kopyasında ve paketlenmiş exe'de):** ağ isteği olmadan açılış; açılışta ajanda ve masaüstü kayıt deposu, oyunun kendi kaydı (`oyun-1.json`) diske yazılıyor (2.1'de eklendi, 2026-09-29); sayfa/betik hatası yok; Three.js ve yazı tipleri yerel kopyadan; bülten ve İlerle sonrası 3B maç günü (WebGL) çiziliyor. Uygulama yolu (`C:\Users\FarukÇAKIR\...`) ve kayıt klasörü (`...\Kayıt Şükrü Çağ İğne Ö\kayitlar`) Türkçe harf ve boşluk içeriyor; kayıt diske yazılıyor, Türkçe metin bozulmuyor. Uygulama kapatılıp yeniden açılınca kariyer aynı yerden sürüyor, ödenmiş maaş tekrarlanmıyor; bozuk ana kayıtta önceki kayda dönülüyor.

**Sınırlar ve açık işler:**
- Paket açılmış hâlde 370 MB; 235 MB'ı Electron çalıştırıcısı, 49 MB'ı Chromium dil dosyaları (Türkçe/İngilizce dışındakiler çıkarılabilir). Sıkıştırılmış dağıtım boyutu ölçülmedi.
- Kurulum sihirbazı, kod imzalama (imzasız exe Windows SmartScreen uyarısı verebilir), otomatik güncelleme ve Steamworks bağlantısı yok.
- Varsayılan `%APPDATA%` yolu doğrudan denenmedi (deneme kayıt klasörünü değiştirir). F11 tam ekran ve pencere boyutları elle denenmedi. İkinci bir bilgisayarda ve gerçekten internetsiz makinede açılış denenmedi; ağ uygulama içinde engellendi.
- Paket geliştirici kayıt denemesi sayfasını (`araclar/kayit-deneme.html`) içerir; yayın paketinden çıkarılacak.
- `npm install` bu makinede Electron'un indirme betiğini çalıştırmadı; `electron.exe` yoksa `node node_modules/electron/install.js` gerekir.
- Steam'e özgü bulut, başarımlar ve diğer özellikler ürün kapsamına göre eklenir. Mağazada yalnız mevcut sürümün sunduğu özellikler vaat edilir; konsept çizimleri oynanış ekran görüntüsü gibi sunulmaz. Kaynak: [Steamworks inceleme süreci](https://partner.steamgames.com/doc/store/review_process).

Kaynak bağlantıları 2026-09-29 planlamasında referans alınmıştır; yayın aşamasında güncel koşullar yeniden kontrol edilir. Yayın tarihi, fiyat ve işletim sistemi desteği henüz belirlenmiş değildir.

## 11. Doğrulama ve performans yaklaşımı

Kontrol, değişen sistemin gerçek riskini hedefler:

| Değişiklik | Anlamlı kontrol |
|---|---|
| Belgeler | Bağlantılar, dosya adları, durum/karar tutarlılığı ve kapsam farkı |
| Görüntü/arayüz | Başsız tarayıcı, konsol hataları, ekran görüntüsü, değişen etkileşim |
| Maç mantığı/kadro | Mevcut maç deneme aracı, tohum tutarlılığı ve değişen futbol davranışı |
| Kariyer/kayıt | `node araclar/kariyer-deneme.js`; tarayıcı deposu değişirse `python3 araclar/kontrol.py araclar/kayit-deneme.html`; kaydet-yükle devamlılığı, tekrar uygulama, tarih/kimlik ve para tutarlılığı |
| Sezon/dünya | Hızlandırılmış çok sezon, nüfus/sözleşme devamlılığı, yükselme/düşme ve görev geçişleri |
| Masaüstü | `masaustu` içinde `node deneme.js`; paket için `node paketle.js && node deneme.js --paket`. Çevrimdışı paket, kayıt yolu, yeniden açılış ve hedef donanım ölçümü |

Uzun kariyerde geçmiş kayıtlarının sınırsız şişmesi, arka plan maçlarının ana ekranı kilitlemesi ve dolu stat çiziminin maliyeti ölçülür. Önemli anılar saklanırken ayrıntılı maç verisinin saklama düzeyi ayrıca seçilir. Donanım hedefi ölçümden sonra belirlenir.

Oynanış testleri; bir oyun gününün gerçek süresi, tekrarlanan olaylar, kararların anlaşılması, kriz/rahatlık dengesi ve kupaya giden yolları izler. Kullanıcı tarafından talep edilmedikçe harici telemetri hizmeti eklenmez; başlangıçta yerel test kayıtları yeterlidir.

Bu planın uygulanma sırası ve sıradaki somut iş [YOL_HARITASI.md](YOL_HARITASI.md) dosyasındadır.
