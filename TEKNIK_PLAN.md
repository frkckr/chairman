# Chairman — teknik plan

Son güncelleme: 2026-09-29. Bu belge mevcut prototipten hedef kariyer oyununa geçiş planıdır. “Hedef” bölümleri uygulanmış özellik anlamına gelmez. Oyun kuralları [OYUN_TASARIMI.md](OYUN_TASARIMI.md), iş sırası [YOL_HARITASI.md](YOL_HARITASI.md) içindedir.

## 1. Bugünkü yapı

| Alan | Mevcut dosyalar ve durum |
|---|---|
| Açılış | `index.html`; klasik betikler sırayla yüklenir, derleme aracı yok |
| Veri ve ortak araçlar | `js/ortak.js`, `js/kadrolar.js`, `js/lig.js`, `js/mac-senaryo.js`, `js/stadyum-tarifleri.js` |
| Maç mantığı | `js/mac-motoru.js`, `js/mac-dizilis.js`, `js/mac-karar.js`, `js/mac-kurallar.js` |
| Maç günü akışı | `js/mac-oncesi.js`; maç öncesi, devre arası, maç sonu |
| Görsel temel | `js/stil-99.js`, `js/goruntu.js`; Three.js r128, kodla üretilen görseller |
| Stat ve insanlar | `js/stadyum.js`, `js/seyirci.js`, `js/oyuncular.js`, `js/golgeler.js` |
| Bağlantı ve sunum | `js/mac-sahnesi.js`, `js/ekran-mac-oncesi.js`, `js/baskan.js`, `js/efektler.js`, `js/arayuz.js` |
| Kontrol | `araclar/kontrol.py` tarayıcı kontrolü; `araclar/mac-deneme.js` görüntüsüz maç ölçümleri |

Motor sahneye bağlıdır. Kadrolarda gizli yetenek değerleri, motorda tohumlu rastgelelik ve sabit zaman adımı bulunur. Bu, kariyer için bir başlangıçtır; takvim, kalıcı sözleşme, seçim, kayıt, oyuncu gelişimi ve kariyer yöneten hoca sistemi henüz yoktur.

Three.js ve sayfa fontları dış kaynaklardan yüklenir. Masaüstünde çevrimdışı ürün henüz doğrulanmamıştır. Üst düzey tanımlar betikler arasında paylaşılır; yeni adlar ve yükleme sırası bu yüzden dikkat gerektirir.

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

## 4. Zamanın ilerlemesi

Takvim/gün içi saat kariyer mantığına aittir. Maçın sabit adımı ve ekrandaki animasyon zamanı ayrı çalışır. Görüşmede düşünmek, oyunu duraklatmak veya antrenman görüntüsünü açık bırakmak takvimi belirsiz biçimde ilerletmez.

Bir eylem, takvimde ne kadar yer kapladığını ve hangi işi başlattığını bildirir. Takvim ilerlemesi; ödemeler, son tarihler, maçlar ve yatırımları belirlenmiş sırayla işler. Aynı tarihteki olayların sırası tutarlı olur.

Başkanlık dışındaki hızlı takip de aynı takvim işlemlerini kullanır; ayrı ve çelişen bir dünya simülasyonu kurulmaz. Önemli gelişmelerde durur. Geliştirici testlerinde yıllar hızlı geçilebilir; bu test aracı oyuncunun kariyer temposuyla karıştırılmaz.

## 5. Kayıt ve yükleme

Kayıt erken aşama işidir. Hedefler:

- Sürümlü kayıt biçimi; eski kayıtlar için gerektiğinde açık dönüşüm adımları.
- Otomatik kayıt ve önceki sağlam kayda dönüş. Yeni yazım tamamlanmadan eski sağlam kayıt kaybedilmez.
- Kimlikler, tarih, para hareketleri ve ilişkiler için yükleme doğrulaması. Bozuk veya desteklenmeyen kayıt açıklanabilir hata üretir.
- Rastgele üreticilerin devam durumu, bekleyen işler ve uygulanmış işlem kimlikleri kaydedilir.
- Ödeme, transfer, seçim ve maç sonucu yükleme sonrası ikinci kez uygulanmaz.
- Kayıt sınırları açık olur. İlk çalışan sürümde gün/karar sınırlarında kayıt yeterlidir; maç veya görüşmenin ortasından devam hedefi ayrıca değerlendirilir ve arayüzde doğru anlatılır.
- Tarayıcı ve masaüstü depolaması ortak bir kayıt arayüzünün farklı uygulamalarıdır; kariyer kuralları dosya yolunu bilmez.

Bulut kaydı düşünülürken kullanıcıya ait kayıt konumu ve çakışma davranışı planlanır. İlk adım yerel kaydın güvenilirliğidir. Steam Cloud seçeneği bu temelin üstünde değerlendirilir; uygulanmış sayılmaz. Kaynak: [Steam Cloud belgeleri](https://partner.steamgames.com/doc/features/cloud).

## 6. Karar, olay ve ilişki sistemi

Bir olay tarifi şu alanları taşıyabilir: kimlik, önkoşullar, katılımcılar, bilgi kaynakları, seçenekler, süre, doğrudan etkiler, ertelenmiş etkiler, tekrar aralığı ve kapanış koşulu.

Oyuncu seçeneği seçtiğinde kariyer mantığı yetki, bütçe ve son tarihi yeniden doğrular. Geçerli karar, sonuçlarıyla birlikte kayda girer. Ekrandaki düğmeye iki kez basmak aynı sözleşmeyi iki kez oluşturmaz.

Olayların görevleri ayrılır:

- Kulübün başlangıç geçmişinden gelen yazılmış sahneler.
- Geçerli dünya durumundan doğan fırsatlar ve sorunlar.
- Oyuncunun önceki kararlarının dönüşleri.

Tekrar sınırı ve eşzamanlı gündem yoğunluğu izlenir. Sahne seçicisi, iyi yönetimin sağladığı rahatlığı sürekli kriz üreterek ortadan kaldırmaz. Seçeneklerin görünür metni ile uyguladığı etki ayrı veri olarak bulunur.

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
- Steam'e özgü bulut, başarımlar ve diğer özellikler ürün kapsamına göre eklenir. Mağazada yalnız mevcut sürümün sunduğu özellikler vaat edilir; konsept çizimleri oynanış ekran görüntüsü gibi sunulmaz. Kaynak: [Steamworks inceleme süreci](https://partner.steamgames.com/doc/store/review_process).

Kaynak bağlantıları 2026-09-29 planlamasında referans alınmıştır; yayın aşamasında güncel koşullar yeniden kontrol edilir. Yayın tarihi, fiyat ve işletim sistemi desteği henüz belirlenmiş değildir.

## 11. Doğrulama ve performans yaklaşımı

Kontrol, değişen sistemin gerçek riskini hedefler:

| Değişiklik | Anlamlı kontrol |
|---|---|
| Belgeler | Bağlantılar, dosya adları, durum/karar tutarlılığı ve kapsam farkı |
| Görüntü/arayüz | Başsız tarayıcı, konsol hataları, ekran görüntüsü, değişen etkileşim |
| Maç mantığı/kadro | Mevcut maç deneme aracı, tohum tutarlılığı ve değişen futbol davranışı |
| Kariyer/kayıt | Kaydet-yükle devamlılığı, tekrar uygulama, tarih/kimlik ve para tutarlılığı |
| Sezon/dünya | Hızlandırılmış çok sezon, nüfus/sözleşme devamlılığı, yükselme/düşme ve görev geçişleri |
| Masaüstü | Çevrimdışı paket, kayıt yolu, yeniden açılış ve hedef donanım ölçümü |

Uzun kariyerde geçmiş kayıtlarının sınırsız şişmesi, arka plan maçlarının ana ekranı kilitlemesi ve dolu stat çiziminin maliyeti ölçülür. Önemli anılar saklanırken ayrıntılı maç verisinin saklama düzeyi ayrıca seçilir. Donanım hedefi ölçümden sonra belirlenir.

Oynanış testleri; bir oyun gününün gerçek süresi, tekrarlanan olaylar, kararların anlaşılması, kriz/rahatlık dengesi ve kupaya giden yolları izler. Kullanıcı tarafından talep edilmedikçe harici telemetri hizmeti eklenmez; başlangıçta yerel test kayıtları yeterlidir.

Bu planın uygulanma sırası ve sıradaki somut iş [YOL_HARITASI.md](YOL_HARITASI.md) dosyasındadır.
