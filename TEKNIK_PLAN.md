# Chairman — teknik plan

Son güncelleme: 2026-10-01. Bu belge mevcut prototipten hedef kariyer oyununa geçiş planıdır. “Hedef” bölümleri uygulanmış özellik anlamına gelmez. Oyun kuralları [OYUN_TASARIMI.md](OYUN_TASARIMI.md), iş sırası [YOL_HARITASI.md](YOL_HARITASI.md) içindedir.

## 1. Bugünkü yapı

| Alan | Mevcut dosyalar ve durum |
|---|---|
| Açılış | `index.html`; klasik betikler sırayla yüklenir, derleme aracı yok. Açılış sayfası başkan odasıdır; `?ekran=ajanda` eski koyu ajanda (geliştirici görünümü), `?ekran=bulten`, `?ekran=mac` |
| Veri ve ortak araçlar | `js/ortak.js`, `js/kadrolar.js`, `js/lig.js`, `js/mac-senaryo.js`, `js/stadyum-tarifleri.js` |
| Kariyer durumu | `js/kariyer.js` oluşturma/kimlik/doğrulama ve güvenli komut (`kariyerKomut`); `js/takvim.js` zaman ve bekleyen işler; `js/maliye.js` para kaydı; `js/ajanda.js` ajanda işleri, karar işleri, ilerleme ve günü bitirme; `js/mesele.js` meseleler, ekip işleri ve dönüş özeti; `js/yonetim.js` yönetim koltukları ve koltuk seçimi; `js/uyum-sponsor.js` eski sabit sponsor kararları (yalnız eski kayıt uyumu); `js/olay.js` olay paketleri, olay örnekleri ve dış gelişmeler; `js/paket-odeme.js` ödeme sıkışması paketi (P01'in dar örneği); `js/paket-hoca.js` hocanın talebi; `js/paket-basin.js` gazetenin sorusu ve Cuma gazetesi; `js/paket-destek.js` koşullu destek (P03'ün dar örneği); `js/soz.js` sözler, haberler ve odadaki izler; `js/gozlem.js` antrenman penceresi ve gözlem aralığı (2.7); `js/test-gorunum.js` geçici test görünümü (gizli değerleri okuma); `js/kayit.js` kayıt/yükleme, sürüm geçişi ve kayıt oturumu; `js/kariyer-ornek.js` TEST örnek kariyer (`KARIYER_ORNEK`) ve eski sabit TEST haftası (`KARIYER_BASLANGIC`, yalnız denemeler); `js/baslangic.js` yeni kariyerin üç TEST başlangıcı (`kariyerBaslat`); `js/oyun-oturumu.js` depo seçimi, açılış, yeni kariyer ve komut yolu (oda ve ajanda ekranlarının ortak oturumu) ile ses/yazı ayarları. `index.html`'e `lig.js`'ten sonra yüklenir; sıra: kariyer, takvim, maliye, ajanda, mesele, yonetim, uyum-sponsor, olay, paket-odeme, paket-hoca, paket-basin, paket-destek, soz, gozlem, test-gorunum, kayit, (depolar), kariyer-ornek, baslangic, oyun-oturumu |
| Platform | `js/depo-tarayici.js` tarayıcı (localStorage), `js/depo-masaustu.js` masaüstü kayıt deposu |
| Masaüstü (deneme) | `masaustu/`: Electron ana süreç `ana.js`, köprü `onyukleme.js`, çevrimdışı kopya `hazirla.js`, paket `paketle.js`, iki açılışlı deneme `deneme.js`. Yalnız Windows x64 |
| Maç mantığı | `js/mac-motoru.js`, `js/mac-dizilis.js`, `js/mac-karar.js`, `js/mac-kurallar.js` |
| Maç günü akışı | `js/mac-oncesi.js`; maç öncesi, devre arası, maç sonu |
| Görsel temel | `js/stil-99.js`, `js/goruntu.js`; Three.js r128, kodla üretilen görseller |
| Stat ve insanlar | `js/stadyum.js`, `js/seyirci.js`, `js/oyuncular.js`, `js/golgeler.js` |
| Bağlantı ve sunum | `js/mac-sahnesi.js`, `js/oda.js` (başkan odası sahnesi, balkon kapısı ve yürüyüş), `js/balkon.js` (balkon, saha, boş tribünler ve antrenman canlandırması; `oda.js`'ten sonra yüklenir), `js/ekran-oda.js` (açılış ekranı: telefon, ajanda, dosya, balkonda gözlem şeridi), `js/ses.js` (kodla üretilen ses), `js/ekran-ajanda.js` (koyu ajanda; geliştirici görünümü), `js/ekran-mac-oncesi.js`, `js/baskan.js`, `js/efektler.js`, `js/arayuz.js` |
| Kontrol | `araclar/kontrol.py` tarayıcı kontrolü; `araclar/mac-deneme.js` görüntüsüz maç ölçümleri; `araclar/kariyer-deneme.js` kariyer, takvim, para ve kayıt denetimi; `araclar/kayit-deneme.html` tarayıcıda kayıt/yenileme/yükleme denemesi; `araclar/akis-deneme.py` tarayıcıda gerçek ekranı tıklayarak üç başlangıç, günlük akış, gün içi kayıt, başkan odası ve sürüm 1–4 kayıt denemesi (`araclar/ornekler/` gerçek eski kayıtlardır) |

Motor sahneye bağlıdır. Kadrolarda gizli yetenek değerleri, motorda tohumlu rastgelelik ve sabit zaman adımı bulunur. Kariyer takvimi, para, kayıt ve ajanda çalışır; ancak maç sonucu kariyere bağlı değildir. Kalıcı sözleşme, seçim, oyuncu gelişimi ve kariyer yöneten hoca sistemi henüz yoktur.

2026-09-30'da onaylanan yaşayan kulüp akışının kural katmanı kısmen uygulandı: ortak mesele verisi, durma noktalarına ilerleme (2.3) ve gün içi karar kaydı (2.4) mevcut ajanda ekranında çalışır. Başkan odası, telefon/ajanda/dosya sunumuyla uygulandı (2.5, §10); balkon ve kontrollü antrenman gözlemi de çalışır (2.7). Görüşme/kişi sahneleri hâlâ hedeftir. Bugünkü davranışlar “Uygulanan” başlıklarıyla ayrıca belirtilmiştir.

Aynı gün onaylanan değişken başlangıç ve koşula bağlı olay yönünün dar ilk örneği uygulandı (2.4A): yeni kariyer `kariyerBaslat` ile üç TEST başlangıcından birini kurar, ödeme sıkışması paketi §6 sözleşmesiyle çalışır. Tam devralma koşulları ve kalan paketler henüz yoktur. 2.3–2.4 kodu `main` dalına birleşmiştir (PR #8); 2.4A, 2.5, 2.6 ve 2.8 PR #9, 2.7 PR #10 ile birleşti. Bu bilgi dağıtılmış Pages veya masaüstü paketinin sürümünü doğrulamaz. Sıra [YOL_HARITASI](YOL_HARITASI.md) içindedir.

**Onaylı yenileme (2026-10-01; henüz kodda yok):** Genel duraklatma, gözlemin gerçek zamanla eşleştirilmesi, tek konu ekranları, ortak stat, doğal yürüyüş, açık maç programı ve maç telefonu planlanmıştır (2.8A–2.8F). Mevcut ses/çay/spiker ve şehir stadı bu adımlarda kaldırılacaktır. Bugünkü dosya tablosu kaldırma işleminin yapılmış olduğu anlamına gelmez.

Tarayıcı sürümünde Three.js ve sayfa fontları dış kaynaklardan yüklenir. Masaüstü kopyası bunları yerel dosyalardan yükler ve çevrimdışı açılır (1.5 denemesi, §10). Üst düzey tanımlar betikler arasında paylaşılır; yeni adlar ve yükleme sırası bu yüzden dikkat gerektirir.

## 2. Sorumlulukların ayrılması

Hedef akış:

> Kariyer durumu → hocanın hazırladığı maç girdisi → Match → sonuç ve olaylar → kariyer durumuna tek uygulama.

Görüntü bu akışı gösterir; para, seçim veya kariyer sonucunun kaynağı çizim döngüsü olmaz.

| Sorumluluk | Üreteceği şey |
|---|---|
| Dünya ve takvim | Tarih, kişiler, kulüpler, görevler, fikstür ve bekleyen işler |
| Yönetim | Devam eden meseleler, kararlar, ekip sorumlulukları, bütçe sınırları, ilişkiler, sözler ve sözleşmeler |
| Futbol hazırlığı | Hocanın bilgisine göre kadro/taktik ve geçerli maç koşulları |
| Maç motoru | Sahadaki hareket, kurallar, skor, istatistik ve olaylar |
| Kariyere sonuç uygulama | Puan durumu, para, kullanılabilirlik, geçmiş ve ilgili sonuçlar |
| Sunum | Mekânlar ve odaktaki konu; aynı meseleyi gösteren görüşme, telefon, ajanda ve raporlar |
| Platform ve kayıt | Kaydetme, yükleme, dosyalar, dil ve masaüstü bağlantısı |

Yeni mantık çizimden bağımsız çalıştırılabilir olmalı. Mevcut motoru baştan yazmak başlangıç şartı değildir. Dosya/klasör adları, modül geçişi ve paketleme yöntemi küçük denemelerle seçilir. Bir iş için gerekmeden bütün kod tabanı dönüştürülmez.

Mekânlar ve telefon aynı kariyer komutlarını çağırır. Ortam değiştirmek yeni bir karar, yeni rastgele sonuç veya ikinci bir zaman hesabı üretmez. Mevcut ajanda kuralları ortak akışa taşınırken korunur; yeni sunumun kendi ödeme veya yetki kuralları olmaz.

## 3. Kalıcı dünya verisi

Küçük örnek kariyer temeli kurulmuştur; aşağıdaki hedef alanlar gerektiği aşamada genişletilir. Bugünkü veri biçimi ayrıca listelenmiştir. Bütün sistemleri peşinen uygulamak gerekmez.

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
| `kayitSurumu` | Tamsayı; şu an `4` (2.3'te `meseleler`, 2.4A'da `icerik`/`kosullar`/`rastlanti`/`olaylar`, 2.6–2.8'de `sozler`/`haberler` eklendi; eski kayıtlar `KAYIT_GECISLERI[1]`–`[3]` ile sırayla dönüştürülür). Daha yeni sürüm doğrulamada reddedilir |
| `dunyaTohumu` | Tamsayı |
| `icerik` | `{surum, baslangic}`. `surum` içerik sürümüdür, kayıt sürümünden ayrıdır: `0` eski sabit TEST haftası (yeni paket açılmaz), `1` 2.4A içeriği. `baslangic`: `sikisik`, `rahat`, `duzenli` ya da `null` |
| `kosullar` | Devralınan dünya gerçekleri; başlangıçta bir kez kurulur (bugün `sponsor.durum`: `nakitSikisik`, `pazarlik`, `saglam`). Oyuncuya gösterilmez |
| `rastlanti` | `{durum}`: dünya tohumundan başlayan, durumu kaydedilen üretici (`rastlantiCek`, mulberry32). Yalnız komut içinde çekilir; maç ve görsel rastlantıdan bağımsızdır |
| `olaylar` | Anahtar = `id` (`olay-N`); `paket`, `surum`, `konu` (tekrar sınırı anahtarı), `varyant`, `durum` (`acik`, `kapandi`, `onlendi`), `meseleId`, `acilis`, `kosullar`, `bilgiler` (`{anahtar, p, kaynak, tarih}`; başkanın bildiği kanıtlar), `sonuc` (kararların kalıcı izleri) |
| `sozler` | Anahtar = `id` (`soz-N`); `verenId`, `muhatap` (kişi kimliği ya da `sponsor`/`personel`), `anahtar` + `p` (konu), `sonTarih`, `isId` (sözü yerine getirecek iş), `olayId`, `durum` (`acik`, `tutuldu`, `bozuldu`), `verilis`, `sonuc` |
| `haberler` | Sıralı kayıt: `tur` (`gazete`, `tesekkur`), `tarih`, `dakika`, `anahtar`, `p`, `olayId`, `gorulen` |
| Kulüp `sorumluluklar` (isteğe bağlı) | `{alan: {kisiId}}`; bugün yalnız `tahsilat`. Kişi koltuktan ayrıldıysa kullanılırken düşer |
| `tarih`, `gunIciDakika` | `YYYY-AA-GG` metni (saat diliminden bağımsız); gece yarısından beri dakika, 0–1439 |
| `baskanId`, `gorevDurumu` | Kişi kimliği; `taraftar`, `aday`, `gorevde`, `gorevDisi`, `yenidenAday`, `kariyerSonu` |
| `final` | `null` ya da ileride tanımlanacak nesne |
| `sonrakiNo` | Tür başına sayaç (`kisi`, `is`, `hareket`, `mesele`, `olay`); `kimlikUret` yeni kimliği buradan verir, var olan kimliği vermez |
| `kulupler` | Anahtar = `id`; küçük harf/rakam kimlik (`demirkapi`), `ad`, `kisa`, `kademe` 1–3, `baskanId`, `acilisNakit`, `nakit` (kuruş tamsayı) |
| `kisiler` | Anahtar = `id` (`kisi-N`); `ad`, `rol`, `dogumTarihi`, `kulupId` (ya da `null`), `durum`: `aktif`, `emekli`, `ayrildi`, `vefat` |
| `isler` | Bekleyen işler; anahtar = `id` (`is-N`); `tur`, `tarih`, `dakika`, `veri`. Türler: `hatirlatma`, `odeme`, `ajanda`, `ekip`, `gelisme` (henüz olmamış dış gelişme; zamanı gelene kadar ajanda ve önizleme listelerinde gösterilmez) |
| `gecmis` | Sıralı kayıt. Tamamlanan iş: `tur: 'is'`, `isId`, `isTuru`, `tarih`, `dakika`, `sonuc`. Erteleme: `tur: 'erteleme'`, `isId`, `tarih`, `dakika`, `eski`, `yeni`, `saat`, `baslik`, `otomatik`. Yapılmadan iptal: `tur: 'iptal'`, `isId`, `isTuru`, `tarih`, `dakika`, `baslik`, `neden`. İptal edilen iş tamamlanamaz |
| Kulüp `yonetim` (isteğe bağlı) | `{sayman, futbol, basin}` → kişi kimliği ya da `null`. Oturan kişi aktif, o kulübe bağlı ve `yonetici` rolünde olmalı; bir kişi tek koltukta oturur |
| Kişi `profil`, `katki` (isteğe bağlı) | `profil`: `{meslek, guclu, zayif, beklenti}` metinleri, oyuncuya gösterilir. `katki`: `{mali, baglanti, futbol, iletisim}` → `zayif`/`orta`/`guclu`, gizlidir ve iş sonuçlarını belirler |
| `hareketler` | Para hareketleri: `id` (`hareket-N`), `kulupId`, `tarih`, `dakika`, `tutar` (kuruş; gelir +, gider −), `kalem`, `aciklama`, `kaynak` (işin kimliği ya da `null`) |
| `meseleler` | Anahtar = `id` (`mesele-N`); `tur`, `baslik`, `durum` (`kararBekliyor`, `ekipte`, `haberBekliyor`, `kapandi`), `sorumluId`, `kisiler`, `olaylar` (`{tarih, dakika, anahtar, p}`; metin saklanmaz, gösterimde üretilir), `gorulen` (yalnız “yeni” işareti), `kapanis`. İşler meseleye `veri.meseleId` ile bağlanır |

`kariyerDogrula` sade veri dışı değerleri (fonksiyon, `undefined`, NaN, Date, sınıf örneği), eksik referansları, geçersiz tarihleri, bilinmeyen durumları, sayaç çakışmasını ve görevdeki başkanın kulüp kaydıyla uyumsuzluğunu Türkçe açıklamayla bildirir. Takvim ve para için ayrıca: zamanı geçmiş fakat tamamlanmamış işi, iki kez tamamlanan işi, açılış nakdi ile hareketlerin toplamını tutmayan nakdi, kesirli tutarı ve aynı işten iki kez doğan para hareketini yakalar. Kulüp kimlikleri bugünkü `KADROLAR`/`LIG` anahtarlarıyla aynıdır; bu köprü yol haritası 3.4'te kullanılır.

**Ajanda işi (2.1):** `ajanda` türü bekleyen iştir; `tarih`/`dakika` başlangıcıdır.
- `veri` alanları: `baslik`, `aciklama`, `zorunluluk` (`zorunlu`, `ertelenebilir`, `istege`), `sure` (0–720 dk). İsteğe bağlı olarak `kisiId`, `bilgi` (iş yapılınca öğrenilen metin), `sonTarih` (yalnız ertelenebilir işte) ve `eylem` (`macGunu`) bulunabilir.
- Geçmişteki `sonuc` alanı `{durum: 'yapildi'|'kacirildi', baslik, zorunluluk, gun, saat, sure, bilgi?, eylem?}` biçimindedir. Böylece iş listeden çıktıktan sonra da ajandada gösterilebilir.
- 2.1 eklenirken alanlar eklemeliydi ve `kayitSurumu` 1 kalmıştı. Güncel sürüm 2'dir; eski kayıtlar §5'teki dönüşümle açılır.

`KARIYER_BASLANGIC`, `KARIYER_ORNEK`'in kulüp ve kişileri üzerine kurulu eski sabit TEST haftasıdır (içerik sürümü 0). 23 Kasım 08:00'de başlar, Cumartesi 19:00 maç işinde (`LIG.buMac`) biter. Ekledikleri: yönetim koltukları, üç sayman adayı ve iki karar işi. 2.4A'dan beri oyun bu veriyle açılmaz; kural denemelerinin örneği olarak durur. `KARIYER_ORNEK` değişmez.

**Uygulanan başlangıç (2.4A):** `kariyerBaslat({tohum, baslangic?, sponsor?, sayman?})` (`js/baslangic.js`) aynı kulüp ve kişilerle, aynı haftada üç TEST başlangıcından birini kurar. Tohumdan üç çekiliş yapılır (başlangıç, sponsorun gerçek durumu, görevdeki sayman); elle verilen alan yalnız kendi çekilişinin yerine geçer. Kasa, sayman koltuğu, ödeme takvimi ve gizli dış gelişme birlikte kurulur ve sonuç `kariyerDogrula`'dan geçmeden dönmez. Aynı tohum aynı kariyeri verir.

Sonradan yüklenen kural dosyaları kendi doğrulamasını `EK_DENETIMLER` listesine ekler (`js/yonetim.js` → `yonetimDogrula`). Dosya yüklü olmayan sayfada o alan denetlenmez.

Gelecekteki ödeme ayrı bir liste değil, takvimdeki `odeme` türü iştir; zamanı gelince bir kez para hareketine dönüşür. Böylece mevcut nakit ile henüz ödenmemiş taahhütler ayrı durur (`maliDurum`). Hareket listesi uzun kariyerde büyür; dönem özetlerine sıkıştırma kayıt boyutu ölçüldüğünde ele alınır.

### Hedef: meseleler ve sahneler arası devamlılık

**Onaylı hedef (2026-09-30; yol haritası 2.3):** Bir mesele kendi kimliğiyle katılımcıları, sorumlu kişiyi, geçerli durumu, son tarihi, beklenen haberi ve karar geçmişi referanslarını taşır. Takvim işi, mesaj, söz, anlaşma ve ödeme gerektiğinde bu kimliğe bağlanır. Mesele kaydı takvimdeki ödeme işlerinin ikinci bir kopyasını oluşturmaz.

İlk örnek mevcut sponsor işidir. Karar bekliyor, ekipte, haber bekliyor veya kapandı gibi durumlar 2.3'te aşağıda açıklanan biçimde uygulandı. Telefon, söz, ilişki ve kapasite gibi sonraki genişlemeler henüz bu alanların tamamının bulunduğu anlamına gelmez.

Telefon/ajanda/görüşme aynı meseleyi okur. Mesajı okumak işi tamamlamaz; tekrar açmak yeni sonuç üretmez. Okunma durumu ile işin tamamlanma durumu ayrılır. Sunum; ilgili kişi, bilgi kaynağı, beklenen gelişme ve oyuncuya açık seçenekleri ortak veriden alır.

Kalıcı ekip sorumluluklarında kişi, iş kapsamı, bütçe sınırı, süre ve başkana dönülecek koşullar tutulur. İş yükü ve görev yetkisi yeni iş verilirken doğrulanır. Söz, ilişki, tamamlanan küçük yatırım ve bunların görsel izleri aynı geçmiş kayıtlarına bağlanır; sahneye girip çıkmak geçmişi değiştirmez.

**Uygulanan (2.3, 2026-09-30):** `js/mesele.js` tek konuya tek mesele kurar; ona gerektiği kadar iş bağlanır (karar, `ekip` işi, ödemeler). Mesele işlerin kopyasını tutmaz: durum bağlı bekleyen işlerden türetilir (ajanda işi varsa karar bekliyor, `ekip` işi varsa ekipte, yalnız ödeme varsa haber bekliyor, hiçbiri yoksa kapandı) ve her iş bütün etkileriyle tamamlandıktan sonra (`IS_SONRASI`) yeniden değerlendirilir. İlk taksit gelmesi ya da eski ödemenin iptal edilip yenilerinin kurulması meseleyi kapatmaz. `meseleDogrula`, açık meselenin bekleyen adımı olmasını ve kapalı meseleye bağlı iş bulunmamasını denetler. `KAYIT_GECISLERI[1]`, sürüm 1 kayıtlarındaki sponsor kararlarını, sponsor kalemli bekleyen ödemeleri ve geçmiş karar kayıtlarını `mesele-1`'e bağlar; hiçbir kararı yeniden oynatmaz, para hareketi üretmez. Bugünkü tek mesele türü sponsor ödemesidir; transfer gibi konular sonraki aşamalarda aynı yapıyı kullanır. Olay metinleri anahtar + parametredir (`MESELE_OLAYLARI`); mevcut diğer metinler bu biçime dönüştürülmedi.

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

**Uygulanan (2.7, 2026-09-30) — gözlem aralığı:** `js/gozlem.js` gözlemi süre tüketen bir iş olarak değil, takvimde bir aralık olarak tutar (`k.gozlem = {tarih, bas, bitis}` ya da `null`). `gozlemBaslat` aralığı kurar ve `zamanIlerletAna` + `durakSorgusu` ile bitişe ilerler; karar gerektiren gelişmede ya da beklenen görüşte durur, aralık açık kalır. `gozlemSurdur` kalanı ilerletir, `gozlemBitir` aralığı kapatıp geçmişe `{tur:'gozlem', bas, bitis, izlenen, not?}` yazar. İki küçük kanca vardır: `ZAMAN_SONRASI` (`js/takvim.js`; zaman her ilerleyişinden sonra çağrılır, süresi dolan ya da günü geçen aralığı kapatır) ve `AJANDA_ENGELLERI` (`js/ajanda.js`; gözlem açıkken süresi `KISA_IS` üstündeki iş ve seçenek engellenir, seçenek nedeniyle birlikte kapalı gelir). Kısa iş saati normal ilerletir; aralığın bitişi değişmediği için süre iki kez sayılmaz. `gozlemOnizle` saatli işi ve son cevap anını aşmayacak biçimde süreyi önceden kısaltır. Antrenman penceresi (`antrenmanPenceresi`) takvim işi değildir; gözlem notu tarihe göre belirlenimlidir, rastlantı çekmez.

### Hedef: kontrollü ilerleme ve kesintiler

**Onaylı hedef (2026-09-30):** Oyuncuya görünen davranışların ana kaynağı [OYUN_TASARIMI §6](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo) olur. Takvim, sahne animasyonu ve gerçek oturum süresi ayrı tutulur.

- Okuma/düşünme ve normal panel kullanımı takvime süre eklemez. Yeni araştırma veya görüşme, ilgili takvim işi ve süreyle temsil edilir.
- İlerleme komutu; hedef anı, katılım/yolculuk sürelerini ve mevcut zorunlu işleri denetler. Aradaki işler sırayla işlenir; yeni bir karar işi doğarsa durulacak an yeniden değerlendirilir. Büyük bir sıçrama, sonradan oluşan zorunlu işi atlayamaz.
- Rutin sonuçlar geçmişe ve özete girer. Karar gerektiren gelişme, yetki aşımı ve randevuya hareket zamanı ilerlemeyi durdurur. İsteğe bağlı iş kayıpları ve son tarih engelleri önizlemede görünür.
- Gözlem, oyuncunun başlattığı belirli oyun içi süreyle çalışır. Telefon kararına geçildiğinde kalan gözlem süresi korunur ve takvim durur. Ortam animasyonu devam edebilse de karar anındaki bilgi ve sonuçlar donmuş kariyer durumunu kullanır.
- Uyumlu eşzamanlı eylemler ortak zaman aralığıyla hesaplanır; iki kez süre tüketilmez. Tam dikkat isteyen görüşme gözlemden ayrılmayı gerektirir. Uyumsuz katılımlar önceden engellenir.
- Ekip işleri yalnız ortak takvim ilerledikçe ilerler; uygulama kapalıyken geçen gerçek süre kullanılmaz. Bekleme durumunun haber veya sonraki eylem kaynağı tanımlı olur.

**Kabul:** Tek parça ve bölünmüş ilerleme, aynı kararlar için aynı dünya sonucunu verir. İlerleme sırasında doğan karar, gün aşımı, randevuya hareket, çakışma, rutin ödeme, gözlemin kesilip devam etmesi ve kayıt sonrası sürdürme ayrı örneklerle sınanır. Maç motorunun sabit adımı bu değişikliklerle değiştirilmez.

**Uygulanan (2.3, 2026-09-30):** `zamanIlerletAna` durabilen tek ilerleme döngüsüdür (`zamanIlerlet` onun durmayan biçimidir). `ilerleOnizle`/`duragaIlerle` (`js/ajanda.js`) sıradaki durma noktasına gider: sonucu `dur` taşıyan ya da yeni ajanda işi doğuran gelişme, sıradaki saatli işin başlangıcı, işleri çakışan günün başı; hiç ajanda işi yoksa `ILERLE_SINIRI` (30 gün, TEST) içindeki son rutin işlem. Gelecekteki zorunlu iş engel değildir; şu an başlangıcındaki zorunlu işe katılmadan ilerlenemez. Saati serbest karar (`veri.saatsiz`; işin tarih/dakikası son cevap anıdır): bekleyen karar başka işe katılmayı kilitlemez, yalnız bitişi son cevap anını aşan işe katılınamaz ve ilerleme bu anı geçemez; işin içindeyken dolan süre `SURE_UZATMA` (30 dk, TEST) kadar uzar. `ajandaIsiYap` işe giderken karar gerektiren gelişmede durur (iş bekler), işin kendi süresi içinde kesilmez. `ekip` işi görevlendirilen kişiyi saklar; kişi koltuktan ayrılırsa iş başkana döner. Maç motorunun sabit adımı değişmedi. 2.3 sırasında ekip kapasitesi, yolculuk süresi ve antrenman gözlemi yoktu; kapasite 2.6'da, gözlem 2.7'de eklendi; yolculuk süresinin kapsamı hâlâ hedeftir.

### Hedef: genel duraklatma ve gözlemin gerçek zamanı

**Onaylı hedef (2026-10-01; 2.8B, henüz uygulanmadı):** Bugünkü `DURAKLAT` maç yolunda zaman adımını sıfırlar; oda yolu bu denetimden önce döner ve kamera hareketinin tamamı durmaz. Genel çözüm tüm sahnelerce kullanılan tek duraklatma yönetimidir. Elle duraklatma, maç telefonu ve ilerideki uygun panel nedenleri ayrı tutulur; bir neden kaldırıldığında diğerleri korunur. Normal bilgi okumasında zaten duran kariyer takvimiyle sahne duraklatması karıştırılmaz.

- Maç motoru ve maç günü akışı, oyuncu/seyirci/efektler, kamera takibi, dürbün/el hareketi, oda/kapı/yürüyüş/antrenman, saat ve aktif sunum sayaçları etkin duraklatma varken ilerlemez. `dt = 0` tek başına yeterli sayılmaz; mutlak saat (`performance.now` vb.), kare başına artış ve bağımsız zamanlayıcılar taranır.
- Çizim ve menü etkileşimi sürebilir; durma anındaki değerler çizilir. Bilgi gezintisi/test kutusu/görüntü kaydı açıktır, dünya değiştiren veya süre tüketen komutlar kapalıdır. Devamda geçen duvar saati birikmiş adım olarak motora aktarılmaz.
- Hazırlığın asgari 10 saniyesi duraklatılmamış sunum süresinden sayılır (2.8E). Kaynak yüklenmesi ayrı hazır olma koşuludur; duraklatmayı veya kullanıcının Maça geç eylemini aşamaz.
- Maç telefonu açılması yalnız kendi duraklatma nedenini ekler; kapanması yalnız onu kaldırır (2.8F). Skor, dakika, istatistik ve diğer karşılaşmaların sunumu aynı donmuş maç anına aittir. Diğer maç bağlantısı 3.8'de bu kurala uyar.

**Gözlemde zorunlu düzeltme:** Bugün gözlem komutu kariyeri hedef/durma anına hemen ilerletip kaydeder; oda ekranı geçmiş saatten bu sonuca kısa bir saat animasyonu oynatır (§10). Bu görüntü üzerinde Duraklat'a basmak gelecekteki ödeme/sonuçları geri almaz. 2.8B'de gözlem; kısa ve güvenli ilerleme parçalarıyla ortak `zamanIlerletAna`/durma kurallarını kullanmalı, görünen an gerçekten uygulanmış kariyer anı olmalıdır. Aralık bitişi ve durma sorguları korunur; yalnız sunum hızını kariyer kuralına yığan ikinci bir takvim kurulmaz. Komutlar doğrulanmış kopyada atomik uygulanır; tamamlanan parçalar güvenli kayıttır. Parça büyüklüğü ve kayıt sıklığı dar denemede seçilir, her çizim karesinde disk yazımı yapılmaz. Kullanıcının “İlerle” komutu ayrı, önizlemeli takvim sıçraması olarak kalır.

**Kabul:** Gözlemi iki gelişme arasında durdur → gerçek tarih/saat/para/işleri karşılaştır → yeniden aç → aynı noktadan devam et. Tek parça ve bölünmüş gözlem aynı kararlarda aynı dünya sonucu verir; kısa işin süresi iki kez sayılmaz, uzun iş engeli korunur. Elle duraklat → telefonu aç/kapat → hâlâ duruyor; telefon tek nedenken kapat → aynı andan sürüyor. Yürüyüş/maç/program sırasında beklemek kamera, sayaç veya sonuç değiştirmez. Devamda sıçrama, çift ödeme/olay ve yeniden rastlantı çekimi yoktur. 2.8B mevcut akışa temel kurar; yeni program ve maç telefonu kontrolleri 2.8E/2.8F'de tamamlanır.

## 5. Kayıt ve yükleme

Kayıt erken aşama işidir. Hedefler:

- Sürümlü kayıt biçimi; eski kayıtlar için gerektiğinde açık dönüşüm adımları.
- Otomatik kayıt ve önceki sağlam kayda dönüş. Yeni yazım tamamlanmadan eski sağlam kayıt kaybedilmez.
- Kimlikler, tarih, para hareketleri ve ilişkiler için yükleme doğrulaması. Bozuk veya desteklenmeyen kayıt açıklanabilir hata üretir.
- Rastgele üreticilerin devam durumu, bekleyen işler ve uygulanmış işlem kimlikleri kaydedilir.
- Ödeme, transfer, seçim ve maç sonucu yükleme sonrası ikinci kez uygulanmaz.
- Kayıt sınırları açık olur. Yeni günlük akışın erken hedefi, tamamlanan kararlar ve güvenli sahne geçişlerinde gün içi kayıttır; maç veya görüşmenin tam ortasından devamın kapsamı ayrıca değerlendirilir ve arayüzde doğru anlatılır.
- Tarayıcı ve masaüstü depolaması ortak bir kayıt arayüzünün farklı uygulamalarıdır; kariyer kuralları dosya yolunu bilmez.

**Uygulanan (1.4, 2026-09-29):** `js/kayit.js` kariyeri sağlamalı bir zarf içinde kaydeder: `{oyun, bicim, saglama, ozet, veri}`. Tutarsız kariyer yazılmaz. Yazım sırası `.yeni` → sağlam ana kaydın `.onceki`'ye kopyası → ana kayıt → `.yeni`'nin silinmesidir; her adım geri okunarak doğrulanır. Yükleme ana kayıt, `.yeni`, `.onceki` sırasıyla ilk sağlam kaydı açar ve atlananları açıklamayla bildirir. Daha yeni sürümlü kayıt açılmaz; eski sürümler `KAYIT_GECISLERI` ile sırayla dönüştürülür (1.4 sırasında geçiş yoktu; sonraki dönüşümler aşağıda tarihli uygulama kayıtlarında açıklanır, güncel sürüm 2.7 ile 5'tir). Depo `oku/yaz/sil` arayüzüdür: `bellekDeposu` denemeler için, `tarayiciDeposu` localStorage için.

**Uygulanan (2.1, 2026-09-29):** Oyun kaydı `js/ekran-ajanda.js` tarafından yapılır.
- **Depo:** Önce masaüstü deposu, yoksa tarayıcı deposu (`chairman:` önekiyle) kullanılır. İkisi de yoksa kayıt yalnız bellekte tutulur ve ekranda uyarı gösterilir.
- **Yuva:** `oyun-1`. Deneme sayfasının kullandığı ve temizlediği `kariyer-1` yuvasından ayrıdır.
- **Açılış:** Kayıt varsa oradan devam edilir; önceki kayda dönüldüyse ekranda bildirilir. Yuva boşsa `KARIYER_BASLANGIC` oluşturulur ve kaydedilir.
- **Açılamayan kayıt:** Üzerine yazılmaz. Oyuncu onaylarsa bozuk dosyalar `.bozuk` ekiyle saklanır, ardından yeni kariyer başlar.
- **Otomatik kayıt:** İlk sürümde yalnız gün sınırında yapılırdı; 2.4 ile her tamamlanan komuttan sonra yapılır (aşağıya bakın). Maç sınırında kayıt yoktur; sayfa yenilenirse son karardan devam edilir.
- **Kayıt ekranı:** Kayıt listesi ve birden çok yuva yoktur. “Yeni kariyer” iki adımlı onayla başlar.

### Hedef: gün içinde bırakıp devam etme

**Onaylı hedef (2026-09-30; yol haritası 2.4):** Karar ve etkileri tutarlı biçimde tamamlandıktan sonra güvenli kayıt yapılır. Mesele durumu, ekip yetkisi, bekleyen işler, uygulanan işlem kimlikleri ve devam için gereken sade sunum durumu birlikte korunur. Karar öncesi veri ile karar sonrası para/iş sonuçlarının karıştığı bir kayıt yazılmaz.

Güvenli sahne geçişleri de kayıt noktası olur; son başarılı kayıt kullanıcıya doğru bildirilir. Yazma başarısızsa kayıt varmış gibi gösterilmez ve önceki sağlam kayıt korunur. Dönüş özeti kayıtlı son karar, beklenen haberler ve yaklaşan tarihten üretilir; özetin kendisi yeni olay tetiklemez.

Yeni veri için sürüm geçişi veya geriye uyum davranışı açıkça tanımlanır. Eski örnek kayıt ile gün ortasında alınan yeni kayıt sınanır. Aynı kararın, mesajdan doğan işin ve ödemenin ikinci kez oluşmadığı doğrulanır. Görüşmenin her satırından veya maçın her anından devam bu ilk adımda vaat edilmez; maç öncesi/sonrası kayıt sınırları maç bağlantısında ayrıca tamamlanır.

Bulut kaydı düşünülürken kullanıcıya ait kayıt konumu ve çakışma davranışı planlanır. İlk adım yerel kaydın güvenilirliğidir. Steam Cloud seçeneği bu temelin üstünde değerlendirilir; uygulanmış sayılmaz. Kaynak: [Steam Cloud belgeleri](https://partner.steamgames.com/doc/features/cloud).

**Uygulanan (2.4, 2026-09-30):** `kariyerKomut` (`js/kariyer.js`) komutu kariyerin kopyasında uygular, doğrular ve geçerliyse yeni durumu verir; hata olursa kariyer değişmez. `kayitOturumu` (`js/kayit.js`) komuttan sonra kaydeder. Yazım başarısızsa kariyer yine yeni durumdadır ve oturum bunu bildirir (“karar uygulandı, kaydedilemedi”); yeniden kaydetme yalnız mevcut durumu yazar, kararı tekrarlamaz. `uygula(f, true)` kaydetmeden uygular: “Stada git” bilinçli istisnadır (maç sonucu kariyere bağlı olmadığı için maç sınırında kayıt yoktur; yüklenen oyuncu maç geçişini kaybetmez). `donusOzeti` (`js/mesele.js`) kayıtlı son karar, açık meselelerin beklenen ilk adımı ve yaklaşan zorunlu işten “Kaldığın yer” özetini üretir; kariyeri değiştirmez ve olay tetiklemez. Sürüm 1 kayıtları açılışta dönüştürülür ve yeniden kaydedilir; eski kayıt `.onceki` olarak kalır. Maçın ya da görüşmenin ortasından devam yoktur. Bulut kaydı uygulanmadı.

**Uygulanan (2.4A, 2026-09-30):** Kayıt sürümü 3'tür. `KAYIT_GECISLERI[2]` yalnız boş alan ekler (`icerik.surum = 0`, `kosullar`, `olaylar`, `rastlanti`, `sonrakiNo.olay`); karar oynatmaz, para üretmez. Sürüm 1 kayıtları 1→2→3 zinciriyle açılır. Altı gerçek sürüm 2 kaydı (`araclar/ornekler/kayit-s2-*.json`, kod değişmeden önce üretildi) ve sekiz sürüm 1 kaydı açılır, para/geçmiş/iş/mesele aynı kalır ve eski sponsor işi kaldığı yerden tamamlanır.

**Uygulanan (2.6–2.8, 2026-09-30):** Kayıt sürümü 4'tür. `KAYIT_GECISLERI[3]` yalnız `sozler`, `haberler` ve `sonrakiNo.soz` ekler; içerik sürümünü değiştirmez. İçerik sürümü 2 olan yeni kariyerlerde yeni paketler açılır; sürüm 0 ve 1 içerikli kayıtlar kendi içerikleriyle sürer (paketin `icerik` alanı en küçük içerik sürümünü söyler). Yedi gerçek sürüm 3 kaydı (`araclar/ornekler/kayit-s3-*.json`, kod değişmeden önce üretildi) açılır ve maç sınırına kadar oynanır. Ayarlar (ses, yazı, test) kariyer kaydından ayrı, depoda `ayarlar` adıyla tutulur.

**Uygulanan (2.7, 2026-09-30):** Kayıt sürümü 5'tir. `KAYIT_GECISLERI[4]` yalnız `gozlem: null` ekler. Gözlem ortasında kaydedilen kariyer aynı aralıkla açılır; ekran başkanı balkonda gösterir (yer ayrıca kaydedilmez, açık gözlemden türetilir). Sekiz gerçek sürüm 4 kaydı (`araclar/ornekler/kayit-s4-*.json`, kod değişmeden önce üretildi) açılır ve maç sınırına kadar oynanır.

**Yenilemede uyum hedefi (2026-10-01; 2.8A–2.8F):** Görsel temizlik, ses ayarının kaldırılması veya stat seçiminin değişmesi yeni kariyer gerektirmez. Eski `ses`/`sessiz` ayarları güvenle yok sayılır; okuma/hareket/test ayarları korunur. Sürüm 1–4 örnekleri ve güncel sürüm 5 kayıtları kendi içerikleriyle açılır. Para, iş, söz ve geçmiş yeniden üretilmez. Seçili dosya/konuşma ve geri dönüş yeri aynı oturumda korunur; bu seçimler yeni olay tohumu veya ikinci kariyer verisi değildir. Yeni kalıcı alan gerekirse uygulama aşamasında açık kayıt geçişi seçilir; bu belge sürüm numarasını değiştirmez. Maç içi kayıt henüz yoktur; telefon/duraklatma bunu varmış gibi sunmaz.

## 6. Karar, olay ve ilişki sistemi

### Hedef: koşula bağlı içerik sözleşmesi

**Onaylı yaklaşım (2026-09-30; dar ilk örneği 2.4A ile uygulandı, aşağıda “Uygulanan”):** [OYUN_TASARIMI §3](OYUN_TASARIMI.md#3-kulübün-geçmişi-ve-başlangıç-hikâyesi) ve [§10](OYUN_TASARIMI.md#koşula-bağlı-olaylar-ve-adil-belirsizlik) ürün kurallarını tanımlar. [OLAY_KUTUPHANESI](OLAY_KUTUPHANESI.md) içerik kaynağıdır. İlk uygulama, mevcut karar türleri ve mesele/takvim/para/kayıt komutlarına bağlanan dar bir içerik katmanıdır; genel amaçlı hikâye dili, ikinci ekonomi motoru, çevrimiçi üretim veya bütün katalog için büyük mimari dönüşüm gerektirmez.

Bir paket tarifi ile o kariyerde oluşmuş olay örneği ayrılır. Tarif, hangi koşullarda ne yapılabileceğini anlatır; örnek, gerçek kişi/iş kimlikleri, seçilmiş koşullar ve oluşmuş sonuçları taşır. Alan adları uygulama sırasında seçilebilir; asgari anlamlar:

| Bilgi | Sorumluluk |
|---|---|
| Paket kimliği ve içerik sürümü | Aynı içeriği ve eski kaydın hangi kurallarla devam edeceğini tanımlar; kayıt biçimi sürümünden ayrıdır |
| Açılma, geçersizleşme ve tekrar koşulları | Mevcut dünya ve geçmiş üzerinden denetlenir; paket var diye olay açılmaz |
| Mesele ve ilgili kimlikler | Kişi, kulüp, ödeme ve gerekiyorsa anlaşmaya referans verir; ikinci mali defter oluşturmaz |
| Gerçek koşullar ve başkanın bilgisi | Tarafın amacı/sınırı ile öğrenilen kanıt, kaynak, tarih ve yorumu ayırır |
| Seçenekler | Yetki, mevcut kaynak, bilgi, süre ve son tarih şartı; kesin etkiler ile belirsiz gelişmelerin ayrımı |
| Devam ve kapanış | Bekleyen iş, haber, önleme/ret/telafi imkânı ve sonuç kaydı; zorunlu sonraki paket listesi değildir |
| Sunum ve hafıza | Metin anahtarları, bilgi önceliği ve yaşanmış olaydan türetilen iz; söz/ilişki genişlemesi 2.8'de |

Başlangıç üretimi, sabit kulüp kimliğiyle uyumlu sınırlı koşulları birlikte seçer. İlk deneme görevdeki TEST başkanını kullanır; tam oyunda adaylıktan önce kurulacak devralma koşullarının dar örneğidir. Borç/gelir tutarlılığı ve uygulanabilir seçenekler doğrulanır. Dünya gerçekleri oyuncuya her gösterimde yeniden seçilmez; tamamı zorunlu sezon olay listesine dönüştürülmez.

Olayın açılması ve kararın uygulanması ortak kariyer komutundan geçer. Uygunluk denetimi, önizleme, raporu açma ve çizim yan etkisiz olmalıdır; rastlantı tüketmez veya iş oluşturmaz. Gerçek eylemde güncel şartlar yeniden doğrulanır. Aynı olay örneği tekrar açılmaz; aynı ödeme veya karar ikinci kez uygulanmaz. Önlenen olayın tekrar koşulu bunu dikkate alır.

Yeni içerik için rastlantı kullanılacaksa dünya tohumuna bağlı, devam durumu kaydedilen bir yol kurulur; maç ve görsel rastlantı tüketimi bunu değiştirmez. Oluşmuş gerçekler, seçilmiş olay parametreleri ve çözülmüş sonuçlar kalıcıdır. Aynı tohum, içerik sürümü ve kararlarla yeniden deneme tutarlı olmalıdır. Görüntüleme sıklığı, paneli açma veya kaydet-yükle sonucu değiştiremez. Büyük ve parçalı zaman ilerlemesi aynı koşullarda aynı sonucu verir. Geleceği başlangıçta topluca çekmek gerekmez.

Yoğunluk denetimi yalnız isteğe bağlı yeni içerik seçimini sınırlar; mevcut ödeme/taahhüt, gerçek gelişme ve son tarih ortak takvimde zamanında işlenir. Aynı anda gelen kararlar mevcut çakışma kurallarıyla ele alınır. Haberler birleştirilebilir; gerçek sonuç gizlice ertelenemez. İlk sürüm için öğrenen bir zorluk yöneticisi veya oyuncuya göre ceza üreten mekanizma kurulmaz.

### Uygulanan (2.4A, 2026-09-30)

- **Tarif ve örnek:** `PAKETLER[id] = {surum, degerlendir(k, baglam) → varyant | null, ac(k, olay, baglam)}` koddadır, kayda girmez. `paketDene` paketi o anki koşullarla dener; açılırsa `k.olaylar`'a örnek yazılır ve `ac` meseleyi, bağlı işleri ve kanıtları kurar. İçerik sürümü 0 olan kariyerde ve aynı `konu` için ikinci kez açılmaz; önlenen konu `onlendi` kaydıyla tutulur ve geri açılmaz.
- **Dış gelişme:** takvimde `gelisme` türü gizli iştir. Zamanı gelince `GELISMELER[tur].uygula` dünyayı gerçekten değiştirir (sponsor ödemesi kayar) ve paketi dener. Koşul önizlemede, özet okurken ya da çizimde denetlenmez.
- **Ödeme sıkışması paketi (`js/paket-odeme.js`):** `nakitAcigi` önümüzdeki 7 günü (TEST) mevcut defter ve bekleyen ödemelerden hesaplar; ikinci mali defter yoktur. Açık varsa `kriz` varyantı (saati serbest zorunlu karar; son cevap, kasanın yetmediği ödemeden 60 dk önce), yoksa `degerlendirme` varyantı (ertelenebilir karar) açılır.
  - Karar türleri: `odemeSikismasi` (kendin görüş, saymana devret, bakım taksitini ertelet, maaşı beklet), `odemeTeklifi` (pano hakkı ya da indirim: kabul/ret), `anlasmaDegerlendirme` (kabul, gecikme bedeli, saymana incelet), `nakitTakvimi` (olaydan önceki isteğe bağlı görüşme; önleme buradan doğar).
  - Ekip görevi `tahsilatGorusmesi`: sonuç sponsorun gerçek durumu × görevlendirilen saymanın gizli katkısıdır. Yetki içindeki çözüm (tam ödeme, taksit) ilerlemeyi durdurmaz; indirim teklifi ve kapanmayan açık başkana döner. Denenen yol dönen kararda kapalıdır (`veri.denenen`).
  - Kesin etkiler (ödeme tarihi/tutarı, erteleme farkı, verilen hak, geciken maaş) deftere ve `olay.sonuc`'a yazılır; belirsiz olan seçenek metninde belirsiz diye anlatılır.
- **Bilgi:** dünyanın gerçeği `k.kosullar`'dadır ve hiçbir özet ya da önizleme çıktısında yer almaz. Başkanın bildiği kanıtlar `olay.bilgiler`'dedir (anahtar + parametre + kaynak + tarih) ve `meseleOzeti().bilgiler` ile ekrana gelir (`MESELE_OZET_EKLERI`).
- **Rastlantı:** yalnız `kariyerBaslat` içinde üç kez çekilir. Sonraki sonuçlar olasılıksızdır; kaydet-yükle, önizleme ve görüntüleme `rastlanti.durum`'u değiştirmez.
- **Kurulmayanlar (2.4A sonunda):** yoğunluk denetçisi (gerçek vade ve gelişme zamanında işlenir), araştırma süresi, kişisel katkı. Söz kaydı, kapasite ve tavsiye 2.6–2.8 ile eklendi (aşağıda).

### Uygulanan (2.6 ve 2.8, 2026-09-30)

- **Tavsiye:** karar türü `tavsiye: {koltuk, gorus(k, is, kisi), engel?}` sağlarsa `tavsiyeIste` o koltuktaki kişiye `tavsiye` görevli bir ekip işi kurar (120 dk, TEST). İş dünyayı değiştirmez; zamanı gelince görüş `olay.bilgiler`'e kişinin kimliğiyle yazılır. İş `veri.durak` taşır: `ilerleOnizle` onu durak sayar, böylece karar beklerken de görüş beklenebilir (`neden: 'haber'`).
- **Kapasite:** `kisiMesgul` — bekleyen ekip işi olan kişiye ikinci iş ya da tavsiye verilemez; seçenek engeliyle görünür.
- **Kalıcı sorumluluk:** `kulup.sorumluluklar.tahsilat`. Paket açılırken `sorumluUstlenir` saymanın görüşmesini doğrudan kurar; başkana karar doğmaz ve gelişme ilerlemeyi durdurmaz. Haberi son cevap anına yetişmeyecekse ya da sayman meşgulse karar başkana gelir.
- **Girişim:** `GIRISIMLER[id] = {ad, aciklama, uygun, baslat}`; `girisimBaslat` bugünün ajandasına iş kurar ve geçmişe `{tur: 'girisim'}` yazar. İçerik sürümü 2'den küçük kariyerde liste boştur.
- **Bekleyebilen karar:** `veri.bekleyebilir` taşıyan saati serbest karar ilerlemeyi engellemez; ilerleme en geç onun son cevap anında durur (`neden: 'sonCevap'`) ve orada karar verilmeden geçilmez.
- **Paketler:** `hocaTalebi` (koşul `kosullar.hoca.talep`; onay kasayı maaş gününde eksiye düşürecekse kapalı), `basinSorusu` (konu `basinKonusu` ile kayıttan seçilir; yoksa açılmaz), `kosulluDestek` (koşul: `nakitAcigi().enDusuk` eşiğin altında). Kasa açığı başka yoldan kapanırsa bekleyen kriz kararı `IS_SONRASI`'da iptal edilir.
- **Söz ve haber (`js/soz.js`):** `sozVer` yalnız taahhüt içeren seçeneklerden çağrılır. `sozDegerlendir` her tamamlanan işten sonra çalışır: bağlı iş tamamlandıysa `tutuldu`, yapılmadan kalktıysa ya da tarihi geçtiyse `bozuldu`; sonuç bir kez yazılır ve meselesine olay düşer. `gazete` ve `tesekkur` gelişmeleri `k.haberler`'e yazar. `odaIzleri` odadaki izleri kayıttan türetir; sunum yalnız bunu okur.
- **Test görünümü (`js/test-gorunum.js`, geçici):** `testOnizleme` kararı kariyerin kopyasında uygular ve ekibe verilen iş varsa kopyayı haber anına kadar ilerletir; gerçek kariyer, kayıt ve rastlantı değişmez. Sunum bu işlevleri yalnız `ayarlar.test` açıkken çağırır. Yayından önce dosya ve çağrıları kaldırılacaktır.
- **Kurulmayanlar:** yoğunluk denetçisi, sayısal bütçe tavanı ve süre sınırı, ilişki puanı, kişisel katkı, sözün seçim ya da ilişkiye etkisi. Gazete manşetinin ve pano hakkının başka bir sisteme etkisi yoktur; yalnız kayıt ve görünür izdir.

### Eski içerikten geçiş ve kayıt uyumu

**Uygulanan karar (2.4A):** veri dönüşümü yerine sınırlı uyumluluk davranışı seçildi. `sponsorGecikmesi`, `sponsorIndirimi`, `sponsorGorusmesi` ve `sponsor.*` olay metinleri `js/yonetim.js`'ten davranışı değişmeden `js/uyum-sponsor.js`'e taşındı; yalnız içerik sürümü 0 olan kayıtlarda bekleyen işleri tamamlar. Yeni kariyer bunları üretmez ve `js/ekran-ajanda.js` artık `KARIYER_BASLANGIC`'ı kullanmaz. Karşılığı olmayan sabit toplantı, röportaj, zemin turu, antrenman ve hoca görüşmesi işleri yeni yolda yoktur. Aşağıdaki paragraflar bu kararın dayandığı onaylı sınırlardır.

Yeni oyuncu akışı doğrulanınca `js/kariyer-ornek.js` içindeki sabit `KARIYER_BASLANGIC` haftası ve `js/ekran-ajanda.js` yeni kariyer bağlantısı yeni başlangıca geçirilir. `js/yonetim.js` içindeki sabit sponsor dalları ve aday→sonuç eşleşmesi yeni içerikle değiştirilir. Karşılığı olmayan sabit toplantı/röportaj metinleri oyuncu akışından çıkarılır. Mevcut test verisi ayrı tutulabilir; normal yeni kariyerde eski ve yeni akış birlikte üretilmez.

`KAYIT_GECISLERI[1]`, eski olay anahtarları ve `araclar/ornekler/` altındaki sekiz sürüm 1 kaydı korunur. Sürüm 2–4 örnekleri ve güncel sürüm 5'te devam eden konular da sınanır. Yeni sürüm numarası bu belgeyle değiştirilmez; uygulama sırasında veri sözleşmesine göre seçilir. İçerik sürümü eklenmesi eski kaydı sessizce yeni kariyere dönüştürme gerekçesi olamaz.

Uygulama planı, veri dönüşümü mü yoksa eski işi tamamlayan sınırlı uyumluluk davranışı mı gerektiğini koddan belirlemeli ve belgelemelidir. Ödenmiş para, kabul edilmiş koşul, kişi kimliği ve geçmişte görülmüş sonuç korunur. Eski bekleyen sponsor işinin kapatılabilmesi sağlanır; yeni paket aynı konuya ikinci borç/karar eklemez. Uyumluluk başarısızsa eski kayıt üzerine yazılmaz. `js/mac-senaryo.js`, maç günü işi ve bülten bu içerik temizliğine dahil değildir; gerçek fikstür/sonuç bağlantısı Aşama 3'te kalır.

**Kabul örnekleri:** Farklı koşullarda farklı seçenek/sonuç; hiç açılmayan veya önlenen kriz; aynı kayıttan kararlı devam; yetki devrinin kişi kimliğini koruması; bir kez ödeme; gerçek vadenin yoğunluk nedeniyle kaymaması; eski kayıtların kaldığı yerden tamamlanması. Yol haritası 2.4A dar kapsamı, 2.9 normal tempodaki tekrar/yoğunluk incelemesini tanımlar.

### Mevcut karar altyapısı ve sonraki genişlemeler

Bir olay tarifi şu alanları taşıyabilir: kimlik, önkoşullar, katılımcılar, bilgi kaynakları, seçenekler, süre, doğrudan etkiler, ertelenmiş etkiler, tekrar aralığı ve kapanış koşulu.

Oyuncu seçeneği seçtiğinde kariyer mantığı yetki, bütçe ve son tarihi yeniden doğrular. Geçerli karar, sonuçlarıyla birlikte kayda girer. Ekrandaki düğmeye iki kez basmak aynı sözleşmeyi iki kez oluşturmaz.

Olayların görevleri ayrılır:

- Kulübün başlangıç geçmişinden gelen yazılmış sahneler.
- Geçerli dünya durumundan doğan fırsatlar ve sorunlar.
- Oyuncunun önceki kararlarının dönüşleri.

Tekrar sınırı ve eşzamanlı gündem yoğunluğu izlenir. Sahne seçicisi, iyi yönetimin sağladığı rahatlığı sürekli kriz üreterek ortadan kaldırmaz. Seçeneklerin görünür metni ile uyguladığı etki ayrı veri olarak bulunur.

**Hedef:** Olaylar mesele kimliği üzerinden ilerler. Rutin bilgi özete, tavsiye ilgili konuya, karar gerektiren gelişme oyuncunun odağına yönlendirilir. Tekrar aralığı ve kesinti önceliği aynı haberin birden fazla kanaldan yeni görev gibi açılmasını önler. Ekibe verilmiş işler her adımda başkana dönmez; yetki eşiği ayrıca denetlenir.

Tavsiye alma, yetki devri ve başkanın doğrudan kararı farklı komutlardır. Seçenekler gösterilirken ve uygulanırken sorumluluk, kapasite, bütçe ve son tarih tekrar doğrulanır. Yeni bilgi edinmenin süresi vardır; mevcut raporu yeniden açmak yeni bir değerlendirme üretmez. Uygun kişinin işi daha iyi çözmesi mümkün olacak şekilde sonuçlar sınanır; mevcut TEST sponsor dalları nihai denge sayılmaz.

Mali değerlendirme, aynı defter ve gelecek ödeme işlerinden üretilir; belirsiz gelir ayrı gösterilir. Başarısız anlaşmanın bedeli kayda girerken alternatif arayışı veya yeniden planlama gibi geçerli sonraki adımlar açık kalabilir. Olumlu sonuç, teşekkür ve sakin dönem üretimi de olay denemelerine dahildir.

**Uygulanan ilk karar yapısı (2.2 ilk adım, 2026-09-29):** Karar, ajanda işinin `veri.karar` alanıyla bağlanan bir `KARAR_TURLERI` türüdür (`js/ajanda.js`). Her tür üç işlev sağlar:
- `denetle`: verinin geçerliliği.
- `secenekler(k, is)`: görünür metin, açıklama satırları, isteğe bağlı süre ve engel.
- `uygula(k, is, secim)`: etkiler ve sonuç bilgisi.

Seçim önizlemede, sonra zaman işin başlangıcına geldiğinde yeniden doğrulanır. Etki bir kez uygulanır ve işin geçmiş kaydına `secim`, `secimMetni` ve `bilgi` olarak yazılır; iş kapandığı için ikinci kez uygulanamaz.

İlk üç tür (`koltukSecimi` bugün `js/yonetim.js`'te; iki sponsor türü 2.4A'dan beri yalnız eski kayıtlar için `js/uyum-sponsor.js`'te):
- `koltukSecimi`: adaylardan birini boş koltuğa oturtur.
- `sponsorGecikmesi`: başkan kendisi görüşür (90 dk) ya da işi saymana devreder (15 dk). Devredilen iş anında sonuçlanmaz (2.3): ertesi sabah 09:30'da bir `ekip` işi çalışır ve sonuç, görevlendirilen saymanın gizli katkısına göre o zaman gelir:
  - Bağlantısı güçlü sayman için sponsor indirim ister. İndirim saymanın yetkisini aştığı için haberle birlikte başkana saati serbest zorunlu karar olarak döner; ilerleme o anda durur.
  - Mali deneyimli sayman ödemeyi iki taksite böler.
  - Bağlantısı zayıf sayman ödemenin gecikmesini engelleyemez; sözleşmedeki gecikme bedeli işletilir.
- `sponsorIndirimi`: indirimi kabul (tutar düşer) ya da ret (ödeme iki hafta kayar).

Sonuçlar ödeme işlerini iptal eder, taşır ya da yeni ödeme planlar; olasılık kullanılmaz. Metinler ve tutarlar TEST değeridir. 2.2 sırasında söz/ilişki kaydı yoktu; söz kaydı 2.8'de eklendi, tam ilişki sistemi hâlâ hedeftir. Bu eski sponsor örneğinde adayın beklentisi yalnız metin olarak kalır.

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

**Canlı skor bağlantısı hedefi (2026-10-01):** 2.8F'de kendi maçının `Match` skor/dakika/`ist` verisi salt okunur bir sunum görünümüne alınır; telefon yeni motor kurmaz. Üretilmeyen xG gibi veriler ekranda uydurulmaz. `js/lig.js` bugün sabit tablo/maç geçmişidir; aynı anda oynayan lig maçları ve bütün kulüplerin maç girdileri hazır değildir. Telefonun diğer maç bölümü 3.8'e kadar veri eksikliğini gösterir.

3.8; 3.1 fikstür/maç kimliklerini, geçerli kadro/girdileri ve 3.5 bir kez sonuç uygulamasını kullanarak dar maç gününün diğer karşılaşmalarını üretir. Her maç kimliği ve tohumla tekrar kullanılabilir olay/sonuç kaydı oluşur. Ortak oyun zamanı ve başlama saati hangi gelişmelerin gösterileceğini belirler; hazırlanmış tam sonucun gelecek golleri erken görünmez. Telefon açmak/kapatmak veya sayfa değiştirmek yeniden rastlantı çekmez. Genel/telefon duraklatmasında gösterilen diğer skor ve dakikalar da donar. İşlem kuyruğu/işçi gereksinimi ölçümle seçilir; 5.2 tam sezon ölçeğine genişletir. Kendi maçının skor, kart ve istatistik sonucu tüm ekranlarda aynı kaynaktan gelir.

Son gözlenen kısa ölçüm (2026-09-29, tohum 1–10): 10 maçta ortalama 2,1 gol, 10,1 şut; korner ve geri pas oranı hedef dışında. Bu örneklem tüm motorun dengelendiğini veya uzun kariyerin doğrulandığını göstermez. Kabul hedefleri `araclar/mac-deneme.js` içindedir; eski belgelerdeki yaklaşık 25 şut ifadesi güncel zorunlu hedef değildir.

## 9. Lig, seçim ve yaşam döngüleri

Lig yapısı kulüp kimliğinden ayrılır; sezon geçişinde kademe değişebilir. Fikstür, puan eşitliği, yükselme/düşme, transfer takvimi ve Avrupa hakkı seçilen oyun kurallarına göre veriden okunur. Kesin formatlar seçilmeden gerçek bir lig statüsü varsayılmaz.

**Onaylı uygulama sırası (2026-09-30):** Basit fikstür ve sezon/transfer takvimi Aşama 3'te kurulur; seçilmemiş biçimler açıkça TEST tarifi olur. Tam sezon Aşama 5'te, kapsamlı adaylık hikâyesi Aşama 6'da tamamlanır. Takvim ve gelecekteki yükümlülükler başkanın planlamasına birlikte girdi sağlar.

Avrupa rakipleri ve dış transfer havuzu gereken ölçüde temsil edilir. Ayrıntılı yabancı lig fikstürü başlangıç kapsamı değildir. Kadro eksilmesi ve emeklilik karşısında yeni oyuncu/personel üretimi dünya nüfusunu sürdürebilmelidir.

Tam uzun kariyer içeriğinden önce küçük geliştirici örnekleriyle kişi ayrılması/emekliliği, yerine yeni kişi gelmesi ve sezon/kademe geçişinde kimliklerin korunması sınanır (5.7). Bu denemeler Aşama 7–8 sistemlerinin tamamlandığı anlamına gelmez. Geçmiş kişiler, sözler ve sözleşmeler yeni sezona geçerken referanslarını korur.

Başkanın durumları: taraftar, aday, görevde, görev dışında, yeniden aday ve kariyer sonu. Geçişler yetkileri değiştirir; ekran değiştirmek yetki kazandırmaz. Yeni yönetim görev dışındaki yıllarda da kulübün işlerini yürütür.

Final kontrolü; başkanın kariyer durumu ve tanımlı en büyük Avrupa kupasının sonuç kaydını kullanır. Küçük kupa, rakibin başarısı veya eski başkanın yalnız taraftar olarak izlediği kulüp başarısı kendiliğinden başkanlık zaferi sayılmaz. Ayrıntılı özel durumlar final aşamasında kararlaştırılır. Başarı finali ile kupasız sonun aynı anda tetiklenmesi önlenir.

## 10. Sunum, metin ve masaüstü

- İlk içerik Türkçedir. Yeni metinler anlamlı anahtarlar ve parametrelerle ayrılır; kişi adlarına bağlı dil kuralları oyun mantığına yayılmaz. Mevcut Türkçe yardımcılar aşamalı uyarlanır.
- Oyundaki görseller kodla üretilir. Görsel sabitler stil katmanında; iş kuralları kariyer/motor katmanında kalır.
- Yeni sunumda aydınlık kulüp ortamı, odaktaki konu ve gerektiğinde açılan telefon/ajanda bulunur. Mevcut koyu ajanda/bülten uygulaması ile bu hedef [stil rehberinde](STIL_REHBERI.md#7-arayüz-ve-bilgi) ayrılır. Kesin sahne dosyaları ve yerleşim uygulama sırasında seçilir.
- **Uygulanan (2.5, 2026-09-30):** Oda maç sahnesinden ayrı bir `THREE.Scene`'dir (`js/oda.js`) ve aynı çizim hattını kullanır (640×480, 15 bit renk, titreme). `js/arayuz.js` kare döngüsü sayfa `oda` iken stadı değil odayı çizer; maç zamanı ilerlemez. `js/ekran-oda.js` kural içermez: içerik `ajandaGunu`, `meseleOzeti`, `donusOzeti`, `ilerleOnizle` ve `kulupDurumu`'ndan gelir, değişiklikler `oyunKomut` ile aynı kariyer komutlarına gider; sahneye yalnız `odaDurum` (haber sayısı, dosyanın varlığı, tarih, saat) bildirilir. Paneli açmak yalnız “yeni” işaretini kaldırır. Ses `js/ses.js`'te WebAudio ile üretilir, ilk kullanıcı etkileşiminde başlar, açılamazsa sessizce devre dışı kalır. Ayarlar depoda `ayarlar` adıyla, kariyer kaydından ayrı tutulur.
- **Uygulanan (2.7, 2026-09-30):** Balkon ayrı sahne değildir; `js/balkon.js` oda sahnesindeki `ODA.dis` grubuna kurulur ve yalnız yürüyüşte ve balkonda görünür. Saha dokusu (`pitchCv`), oyuncu modeli (`player`, `kitKaydi`) ve kadro görünüşleri mevcut koddan gelir; maç motoru kullanılmaz, antrenman tekrarlayan bir canlandırmadır. `ODA.yer` (`masa`, `yolda`, `balkon`) yalnız sunumdur; `odaYuru` kamerayı `STIL.oda.yol` noktalarından geçirir, hareket azaltma ayarında doğrudan geçer. Ekran `js/balkon.js` ve `js/gozlem.js` yüklü değilse balkon düğmesini göstermez. Saatin gözlemde akması yalnız gösterimdir: kariyer komut anında güncellenmiş ve kaydedilmiştir.
- Temel yazı büyüklüğü, hareket azaltma, duraklatma ve dönüş özeti Aşama 2'de sınanır. Ses 2.8A'da kaldırılır; bütün ses çalışması Aşama 10'a taşınmıştır (2026-10-01). Nadir süreli cevap sahneleri süre/okuma/flaş/sarsıntı seçenekleriyle birlikte geliştirilir; kullanım kalitesi yalnız son aşamaya bırakılmaz.
- Masaüstü denemesi Aşama 1'de Windows/Electron ile yapıldı; kapsamı aşağıdadır. Ticari paket ve Steam bağlantısı ayrı hedeflerdir; motor değişikliği varsayılmaz.
- Three.js ve fontlar gibi gerekli dış kaynaklar çevrimdışı pakete uygun biçimde yerelleştirilir. Sürümleri ve dağıtım koşulları kayda alınır.
- Tarayıcı/GitHub Pages geliştirme yolu sürerken masaüstü kayıt ve dosya işlemleri ayrı platform katmanına konur.
- Deneme; internet kapalı açılış, Türkçe karakter içeren dosya yolu, kayıt/yükleme, pencere/tam ekran ve gerekli kaynakları kapsar.

### Hedef: ekran yenilemesi ve ortak stat

**Onaylı hedef (2026-10-01; 2.8A–2.8F, henüz uygulanmadı):** Ürün davranışı [OYUN_TASARIMI](OYUN_TASARIMI.md#tek-konu-akışı-ve-ekranların-görevleri), görünüm [STIL_REHBERI](STIL_REHBERI.md#onaylı-ekran-düzenleri-ve-etkileşim), iş sırası [YOL_HARITASI](YOL_HARITASI.md#aşama-2--yaşayan-kulüpte-günlük-başkanlık) içindedir. Kesin yeni dosya adları küçük uygulama planında seçilir; büyük modül dönüşümü bu yenilemenin şartı değildir.

**Temizlik sınırı:** `index.html` dış not/palet/radyo öğeleri kaldırılırken `js/arayuz.js` ve `js/mac-sahnesi.js` içindeki DOM erişimleri güncellenir. `soyle`/spiker metni kaldırılırken gol/maç olayı dinleyicileri, seyirci heyecanı, oyuncu/başkan tepkileri ve istatistik üretimi silinmez; metin sunumu ile olay işleme ayrılır. Oda ve `js/baskan.js` çay geometrisi, buhar, sıvı güncellemesi ve içme hareketi temizlenir; dürbün/alkış/telefon hareketi çalışır. `js/ses.js` yükleme ve bütün çağrı/zamanlayıcı/ayar yolları kaldırılır. Arayüz, kontrol araçları ve masaüstü kopyalama yolları artık olmayan öğe/betiği varsaymamalıdır. Tarihsel prototipler canlı oyuncu yoluna geri bağlanmaz.

**Ekran durumu:** Seçili mesele, konuşma, dosya sırası, arşiv ve geri dönüş bağlamı ortak sunum durumunda takip edilir. Sıra mevcut oturumda kararlı olur; gelen haber aktif dosyayı değiştirmez. Sayaçlar ortak mesele/iş verisinden hesaplanır; yeni ekonomi veya görev listesi yaratılmaz. Ajanda finans yerine randevu/son tarih görünümüdür; ödeme/teklif işi aynı kimlikle dosyaya bağlanır. Test kutuları mevcut `js/test-gorunum.js` okuma/önizleme yolunu kullanır; gizli sonuç önizlemesi gerçek kariyerde karar uygulamaz. Geliştirici görüntü kaydı mevcut görüntüyü alır, kariyer kaydını değiştirmez. Fare/klavye, taşma, büyük yazı ve boş durumlar gerçek ekranla sınanır.

**Ortak stat:** Bugünkü maç `js/stadyum.js` ile `STAT` tarifinden, balkon `js/balkon.js` içinde ayrı ölçülerle kurulur; yalnız saha dokusunun ortak olması yeterli değildir. Saha, tribün, sıra, çatı, projektör, pano ve çevre konumlarını belirleyen tek tarif/kurucu çıkarılır; oda penceresi, balkon ve maç farklı sahne grupları/ışık/dolulukla bunu kullanır. Aynı `THREE.Object3D` örneğini birden çok sahneye bağlamak gerekmez, aynı tariften üretmek gerekir. `sehir` tarifi, seçimi, URL okuması ve varsayımları canlı uygulamadan çıkarılır; eski `?stat=sehir` güvenli kulüp varsayılana düşer. Yeniden kullanılan doku/geometri ve sahne kaynakları geçişte sızıntı yaratmamalıdır. Kariyer yatırımı henüz hazır sayılmaz; 8.3 aynı tarife tamamlanan etapları uygular.

**Kapı ve başkan yeri:** Kapı etkileşimi oda işaret/hedef listesine girer; balkon düğmesi yerine klavye odağı ve mevcut kısayol korunur. Kalkış/adımlar/oturma duraklatılabilir ortak sunum zamanını kullanır. Maç koltuğu gerçek sıra/tribün geometrisinden türetilir; `BASKAN_KOLTUGU`, kamera, masa ve eller aynı konumu izler. Yalnız kamera sabitini yükseltmek yeterli değildir.

**Maç programı ve telefonu:** Programın minimum etkin 10 saniyesi ve gerçek kaynak hazırlığı ayrı koşullardır; ikisi sağlanmadan geçiş yoktur. Sayfalar arasında gezinti sayacı sıfırlamaz, yükleme hatası erken maça geçirmez. Program süreleri kariyere veya maç motoruna eklenmez. `js/baskan.js` masa telefonu ön plan kamerasıyla çizilir; tıklama kendi kamera/hedef alanına göre yapılır, ana sahne raycast'ine körlemesine bağlanmaz. Okuma paneli açınca ortak duraklatma nedeni eklenir. Mesajlar mevcut mesele verisini, Canlı Skor §8'in ortak veri görünümünü kullanır; telefon çizimi oyun mantığını yönetmez.

**Kabul ve eski kayıt:** 2.8A–2.8F'nin her biri değişen ekran için tarayıcı/akış ve görüntü incelemesiyle biter; süre, kariyer veya kayıt davranışı değişirse ilgili kural ve kayıt kontrolleri yapılır. Genel duraklatma §4, uyum §5 örneklerini sağlamalıdır. Maç olaylarının korunması ve telefondaki istatistik aynı motor anında doğrulanır. Sesin/şehir stadının geri dönmediği yeni kariyer, yenileme, URL deneme yolları ve masaüstü geliştirme kopyasında kontrol edilir. Oyun kodu değişmeden bu belgeyi yazmak bu kontrollerin geçtiği anlamına gelmez.

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
| Mesele/zaman/ekip | Aynı konunun farklı sahnelerde devamı; sonradan doğan karar önünde durma; süreyi iki kez saymama; yetki/kapasite sınırı; gün içi kayıt ve eski kayıt devamı. Kural katmanı `node araclar/kariyer-deneme.js`, gerçek ekran `python3 araclar/akis-deneme.py`. Not: Node denemeleri arayüz betiklerini yüklemez; blok içindeki `function` bildirimleri global'e sızdığı için ad çakışmasını yalnız tarayıcı denemesi yakalar |
| Koşula bağlı içerik/başlangıç | Sabit tohum ve kayıtlı devamla tutarlılık; farklı başlangıç/kararlarda anlamlı ayrışma; önlenen olayın doğmaması; gerçek vade, bir kez ödeme ve eski kayıt devamı. Kural katmanı `node araclar/kariyer-deneme.js` (2.4A bölümleri bütün karar yollarını dolaşır), gerçek ekran `python3 araclar/akis-deneme.py`; normal tempoda okunabilirlik ve karar kalitesi ayrıca değerlendirilir |
| Duraklatma/gözlem | Kamera/model/efekt/sayaçların donması; elle ve telefon nedenlerinin bağımsızlığı; devamda sıçrama olmaması; görünen ve kayıtlı kariyer anının eşliği; parçalı gözlem/ödeme tutarlılığı. Yeni telefon ve program senaryoları eklendikleri adımda gerçek ekranla sınanır |
| Ortak stat/tek konu ekranları | Oda/balkon/maç yapı eşliği; şehir tarifi/URL varsayımlarının temizliği; kapı/koltuk/eller/dürbün; normal/büyük yazı, fare/klavye, dosya sırası, sayaçlar, mesaj–dosya dönüşü, test kutusu ve bilgi gezintisinin süre/sonucu değiştirmemesi |
| Sezon/dünya | Hızlandırılmış çok sezon, nüfus/sözleşme devamlılığı, yükselme/düşme ve görev geçişleri |
| Masaüstü | `masaustu` içinde `node deneme.js`; paket için `node paketle.js && node deneme.js --paket`. Çevrimdışı paket, kayıt yolu, yeniden açılış ve hedef donanım ölçümü |

Uzun kariyerde geçmiş kayıtlarının sınırsız şişmesi, arka plan maçlarının ana ekranı kilitlemesi ve dolu stat çiziminin maliyeti ölçülür. Önemli anılar saklanırken ayrıntılı maç verisinin saklama düzeyi ayrıca seçilir. Donanım hedefi ölçümden sonra belirlenir.

Oynanış testleri; bir oyun gününün gerçek süresi, tekrarlanan olaylar, kararların anlaşılması, kriz/rahatlık dengesi ve kupaya giden yolları izler. Kullanıcı tarafından talep edilmedikçe harici telemetri hizmeti eklenmez; başlangıçta yerel test kayıtları yeterlidir.

İlk sıra birkaç günlük tek mesele → sakin/olağan/yoğun günleri içeren hafta → maçlarla birkaç hafta → tam sezondur. [OYUN_TASARIMI §6](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo) süre hedeflerinin tek kaynağıdır. Oyuncunun sonraki adımı anlayabilmesi, kısa oturumda ilerleme, yoğun günü bölme, kesinti sayısı, iyi ekibin iş yükünü azaltması, olumlu sonuçlar ve başarısızlık sonrası devam yolları birlikte değerlendirilir. Hızlandırılmış geliştirici testleri mantık tutarlılığını ölçer; normal tempoda oynanışın yerini almaz.

Bu planın uygulanma sırası ve sıradaki somut iş [YOL_HARITASI.md](YOL_HARITASI.md) dosyasındadır.
