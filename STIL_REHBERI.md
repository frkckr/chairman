# Chairman — stil rehberi

Son güncelleme: 2026-09-30. Bu belge mevcut maç prototipinin görsel dilini ve planlanan kariyer sahnelerinin sunum ilkelerini tanımlar. **Gelecek sahnelere ilişkin kurallar, o sahnelerin bugün yapıldığı anlamına gelmez.** Oyun kapsamı [OYUN_TASARIMI.md](OYUN_TASARIMI.md), yapım sırası [YOL_HARITASI.md](YOL_HARITASI.md) içindedir.

Ortak görsel ayarlar `js/stil-99.js` üzerinden yönetilir. İlgili dosyalarda kalan sabitler değiştirilirken uygun ortak ayarlara taşınır. Bu belge bütün sayısal değerleri tekrar eden bir envanter değildir.

## 1. Görsel kimlik ve ekran

- Mevcut referans FIFA 99 / PS1 dönemi 3B futbol görünümüdür. Önceki reddedilmiş görsel konseptler bu yönün yerine geçmez.
- Maç görüntüsü 4:3 ve 640×480 iç çözünürlüktedir. Büyütmede en yakın komşu kullanılır; pikseller yumuşatılmaz.
- Başkanın gözünden bakıldığı için TV kasası, tarama çizgisi veya yayın çerçevesi eklenmez.
- Kanal başına 5 bit renk ve ekrana sabit 4×4 Bayer titremesi kullanılır; mevcut titreme şiddeti %70'tir.
- Köşe titremesi kapalıdır (`koseTitremesi:false`). Retro görünüm, hareketin piksel piksel zıplamasını gerektirmez.
- Uzun metinli gelecek yönetim ekranları için okunabilirlik esastır. Maçın 640×480 sınırı bütün menüleri aynı düşük çözünürlükte yazmaya zorlamaz; genel pencere düzeni ayrıca sınanır.

## 2. Renk, ışık ve gölge

Gece sahnesinde sıcak projektör sarısı, gece laciverti ve sis kullanılır. Mevcut aydınlatma Lambert/Gouraud yaklaşımındadır.

| Kullanım | Mevcut renk |
|---|---|
| Demirkapı kırmızısı / beyazı | `#c8281e` / `#f2ede2` |
| Çim koyu / açık | `#2f7a2a` / `#3a8c33` |
| Saha çizgisi | `#f2f2ea` |
| Atletizm pisti | `#8c3f2f` |
| Sis | `#0c1322` |
| Meşale / tabela amberi | `#ff4a1e` / `#ffb530` |
| Akdeniz FK beyazı / laciverti | `#eef0f3` / `#22347a` |

- Mevcut gece gölgeleri, oyuncunun kemiklerine bağlı kutuların projektörden zemine izdüşümüdür (`js/golgeler.js`). Kol ve bacaklarla hareket eder; top da gölge verir.
- Aynı ışığın gölgesi stencil ile aynı pikseli bir kez koyulaştırır; farklı ışıklar üst üste gelebilir.
- Gündüz, hava durumu ve bunlara uygun gölge düzenleri gelecekteki iştir. Bugünkü gece sahnesinin tamamlanmış alternatifleri sayılmaz.

**Onaylı hedef (2026-09-30):** Kulüp odası, görüşme ve antrenman ortamları ilk kapsamda aydınlık sunulur. Yönetim arayüzünde açık zemin, koyu okunabilir metin, sıcak kâğıt/ahşap tonları ve ölçülü kulüp renkleri kullanılır. Ajanda, raporlar, telefon ve maç öncesi bültenin yönetim sunumu bu yöne uyarlanır. Kesin renk değerleri ilk sahnede sınanır; bugünkü renk tablosu yeni açık paletin tamamlandığı anlamına gelmez.

Maçın mevcut gece atmosferi kendi bağlamında kalır. İlk aydınlık oda ve gözlem örneği, bütün statlara gündüz/hava sistemi eklenmesini beklemez; kapsamlı saat, hava ve gölge çeşitliliği sonraki iştir.

## 3. Kodla üretilen görseller

- Geometri az poligonludur. İnsanlar kutu temelli kemikli modellerle, top 20 yüzlü geometriyle çizilir.
- Oyun görselleri kodla üretilir. Harici model, fotoğraf gerçekliğinde doku, gerçek marka ve logo kullanılmaz.
- Oyuncu atlası 64×64'tür. Küçük desenler düşük çözünürlüklüdür; saha ve pano gibi üretilen yüzeyler için bütün dokulara tek bir 64 piksel üst sınırı konmaz.
- Oyuncu ve bayrak dokularında keskin piksel görünümü korunur. Seyirci, reklam panosu ve çimde uzak titreşmesini azaltan mipmap kullanılabilir.
- Yeni sahneler aynı malzeme, insan modeli ve tarif yaklaşımını yeniden kullanır. Her olay için ayrı bir mekân üretmek gerekmez.

## 4. İnsanlar ve hareket

- Oyuncular boy, vücut yapısı, saç, yüz kılları, krampon ve forma ayrıntılarıyla ayırt edilir. Numara sırtta büyük, göğüste küçüktür; kaleci kıyafeti farklıdır.
- Hareketler mevcut `POSE` sistemine eklenir. Ayrıntılı poz listesi kodda tutulur; bu belge ikinci bir liste oluşturmaz.
- Model motorun gerçek bakış yönünü izler. Sol ayaklı futbolcunun vuruşu doğru bacağa aynalanır.
- Koşu hızla uyumludur; poz geçişleri, dönüşler ve sabit motor adımları arasındaki çizim yumuşaktır.
- Yedekler, teknik direktör, saha personeli, top toplayıcılar, hakemler ve fotoğrafçılar işlevlerine uygun görünür. Yeni görevlerde var olan modeller ve pozlar geliştirilir.
- Uzun kariyerde aynı kişinin tanınması korunur. Yaşlanma ve değişen görevlerin görünüşe etkisi gelecekte eklenir; rastgele yeni görünüm verilmez.

## 5. Stat ve tribün

- Statlar `js/stadyum-tarifleri.js` içindeki tariflerden kurulur. Bugün kasaba ve şehir tarifleri vardır; Avrupa arenası gelecekte yapılacaktır.
- Küçük statta yıpranmış zemin, daha sınırlı aydınlatma, seyrek reklam ve çevredeki yerleşim kulübün ölçeğini hissettirir.
- Zemin kalitesi çimin rengini, kel/çamurlu alanları, çizgileri ve biçme desenini etkiler. İnşaat ve stat gelişimi henüz kariyer sistemine bağlı değildir.
- Seyirciler mesafeye göre ayrıntısı azalan küçük insan modelleridir. Boş koltuklar ve düşük doluluk gerçekten görünür.
- Tepkiler maç olayına ve taraftara bağlıdır. Herkes sürekli zıplamaz; sakin anlar, gelişler, marş ve goller farklı hissedilir.
- Ev sahibi, deplasman ve başkan bölümü kıyafetleri ayrışır. Meşale, duman, pankart, tel örgü ve tabelalar aynı görsel dilde kalır.
- Gelecekte stat yatırımları ve Avrupa deplasmanları ölçek farkını göstermeli; bütün statların yalnızca renk değiştirmiş kopyası gibi görünmesi önlenmelidir.

## 6. Kamera ve başkanın bulunduğu yer

### Mevcut maç prototipi

- Kamera açık ana tribündeki başkan koltuğunda, göz hizasındadır. Dürbün isteğe bağlı yakınlaştırmadır; TV kamerası kullanılmaz.
- Bakış topu ve maç günündeki dikkat çekici olayları yumuşak geçişlerle izler.
- Ön planda başkanın kolları, saat, masa, çay, program ve telefon görünür (`js/baskan.js`). Eller maç olaylarına tepki verir; dürbün elle kaldırılır.

### Planlanan kariyer sahneleri

- Hikâyenin başındaki taraftar yeri, görevdeki başkanın yeri, deplasman protokolü ve seçimi kaybetmiş kişinin misafir/loca konumu birbirinden ayrılır. Mevcut açık tribün kuralı bütün kariyeri aynı koltuğa hapsetmez.
- Deplasmanda ev sahibi yöneticiler ve ilişkiler oturma düzenini etkileyebilir. Kimin yanında oturduğu veriyle belirlenir; her ilişki için yeni stat üretilmez.
- İlk kapsam başkan odası/görüşme alanı ve antrenman kenarıdır; mevcut stat deneyimine bağlanır. Basın alanı ve diğer yerler ihtiyaç oluştuğunda genişletilir. Aynı oda farklı görüşmelerde yeniden kullanılır; her konu için yeni mekân gerekmez.
- Telefon, ajanda ve ilgili dosya bulunduğun ortamdan erişilebilir olur. Etkileşimler görünür ve anlaşılırdır; oyuncu gerekli bilgiye ulaşmak için gizli nesne aramaya veya uzun geçişleri tekrar izlemeye zorlanmaz.
- Ortam değişiminde aynı mesele, insanlar ve önceki kararlar devam eder. Kamera ve küçük çevre hareketleri dikkati o anki konu üzerinde tutar.
- Fotoğraflar, kupalar ve tanıdık çalışanlar kulüp hafızasını taşır. Geçmişe ait bir nesne, bağlı olduğu olay gerçekleşmeden varmış gibi gösterilmez.

## 7. Arayüz ve bilgi

### Bugünkü uygulama

- Stat içindeki pano, pankart ve skor tabelalarında mevcut Türkçe karakterli 3×5 piksel yazı kullanılır.
- Maç görüntüsünde TV yayın bandı, radar veya oyuncu etiketi bulunmaz. Dürbün maskesi vardır; skor ve dakika stat tabelasından, ayrıca görüntünün dışındaki radyo satırından izlenir.
- Maç öncesi bülteni (`js/ekran-mac-oncesi.js`) 4:3 oyun karesinde açılır; stat arkada donuk kalır ve koyu panelle büyük ölçüde örtülür. Ölçüler oyun karesiyle birlikte değişir, kaydırma kullanılmaz ve ana eylem sağ altta belirgindir.
- Ajanda ekranı (`js/ekran-ajanda.js`) oyunun açılış ekranıdır ve bültenin düzenini izler: aynı 4:3 kare, `cqw` ölçüleri, panel başlıkları ve `STIL.menu` renkleri, kaydırma yok, ana eylem (“İlerle”, maç günü “Stada git”) sağ altta.
  - Zorunluluk etiketlerinde zorunlu kırmızı, ertelenebilir amber, isteğe bağlı soluk renkle gösterilir.
  - Kaçırılacak işler ve engeller ilgili düğmenin yanında kırmızı metinle önceden yazılır; kaçırtan eylem satır içi onay ister.
  - Tutarlar kuruşsuz yazılır, giderler kırmızıdır.
  - Karar işlerinde seçenekler ayrıntı panelinde alt alta listelenir; seçilen seçenek amber kenarla işaretlenir, seçim yapılmadan ana düğme kapalı kalır.
  - Yönetim adayları meslek, güçlü ve zayıf yanlar ve beklenti metniyle tanıtılır; katkı için sayı, seviye ya da çubuk gösterilmez.
  - Sağ kolonda “Meseleler” listesi durum ve “yeni” işaretiyle gösterilir. Bir mesele seçilince ayrıntı panelinde önce yürüten kişi, bekleyen adım ve “Şimdi” satırı, sonra kısa geçmiş görünür. Kayıttan dönüşte ayrıntı panelinde “Kaldığın yer” özeti açılır ve “Devam” ile kapanır. Alt şeritte sıradaki durak ve arada olacaklar yazılır; kayıt yazılamazsa üst şeritte kırmızı bildirilir.
- Bülten başlıklarında piksel görünümlü `Jersey 10`, metinlerde `IBM Plex Mono`; ana vurguda tabela amberi, takım ayrımında kırmızı ve lacivert kullanılır. Olası 11 küçük sahada forma renkli ve numaralı işaretlerle gösterilir. Menü renkleri `STIL.menu` içindedir.

### Onaylı hedef: mekân içinde tek konuya odaklanma

**2026-09-30 tasarım kararı; henüz uygulanmadı.** Yukarıdaki koyu paneller, kaydırmasız düzen ve ajandayla açılış mevcut prototipi anlatır. Yeni akış aşağıdaki kurallarla geliştirilir:

- Ortam görünür kalır; görüşme veya karar sırasında odaktaki kişi/konu öne çıkar. Kulübün bütün göstergeleri sürekli aynı ekrana yığılmaz.
- Telefon, ajanda, rapor ve mali ayrıntılar gerektiğinde açılır, kapatıldığında bulunulan ortama dönülür. Aynı mesele başka kanaldan açıldığında geçmişi ve durumu korunur.
- Ekranda meselenin kısa özeti, ilgili kişi, başkandan beklenen karar ve varsa son tarih anlaşılır olur. Ayrıntılar isteğe bağlı açılır; bilgi saklamak için küçük yazı veya belirsiz nesne kullanılmaz.
- Rutin haberler kısa özette toplanır. Önemli mesaj sahneyi sürekli kapatmadan fark edilir; oyuncu mesajı açıp cevaplayabilir, tavsiye isteyebilir veya yetki devredebilir. Aynı anda birden fazla zorunlu karar penceresi açılmaz.
- Görüşmede tavsiye, taahhüt ve karar farklı anlamlarıyla gösterilir. Süre ve bilinen sonuç/çakışmalar eylemden önce anlaşılır olur. Bir mesajın okunması işi bitirmiş gibi sunulmaz.
- Uzun metinler okunabilir yazıyla, açık zemin üzerinde yeterli kontrastla gösterilir. Maçın 640×480 iç çözünürlüğü veya bugünkü menü ölçüleri yeni metin düzenini zorunlu olarak sınırlamaz; pencere boyutu ve yazı büyüklüğü birlikte sınanır.
- Tarih/saat, zamanın durduğu an ve başlatılan ilerleme görünür biçimde anlaşılır. Oyun kuralları [OYUN_TASARIMI §6](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo) içinde tutulur.
- Oyuna dönüşte son karar, beklenen haberler ve yaklaşan önemli tarih kısa özetle hatırlatılır. Gün içi kayıt sınırı ve son başarılı kayıt doğru anlatılır. Bu ilke mevcut ajanda ekranında uygulanmıştır (2.4); aydınlık oda sunumu henüz yoktur.

### Koşula bağlı olayların sunumu

**Onaylı hedef (2026-09-30; henüz uygulanmadı):** Aynı olay ailesi farklı kariyerlerde farklı koşullarla sunulabilir. Ekran şablonu yeniden kullanılabilir; yalnız kişi adı, renk veya tutar değiştirerek içerik çeşitliliği sağlandığı varsayılmaz. Mevcut koşullar, bilgi ve seçenekler ortak mesele verisinden gelir.

- Yeni kariyerin gündemi gerçekte oluşmuş işlerden çıkar; her açılışta aynı kriz kartı zorla gösterilmez. Sakin anda oda ve isteğe bağlı girişimler erişilebilir kalır.
- Mesajda gönderen, haberin zamanı, neyin doğrulanmış bilgi, neyin yorum olduğu ve varsa cevap son tarihi anlaşılır olur. Bilginin kaynağı görünürdür; gizli dünya gerçeği veya gelecekteki olay zinciri oyuncuya dökülmez.
- Olay ailesinin veya test başlangıcının geliştirici kodu oyuncuya gösterilmez. “P01”, tohum, içerik sürümü ve teknik tetikleme gerekçesi oyun arayüzünün parçası değildir.
- Seçenek, bilinen maliyeti ve taahhüdü anlatır; belirsiz sonuç kesin başarı gibi veya her durumda doğru seçenek vurgusuyla sunulmaz. Kararın ardından gerçekten oluşan sonuç ile beklenen haber ayrılır.
- Yetki içinde çözülen rutinler özette görünür. Haber gelişini fark ettirmek sürekli açılan pencere, zorunlu mekân değiştirme veya her mesajda onay isteme gerektirmez.
- Tutulan küçük söz, teşekkür, fotoğraf ve tamamlanan bakım gibi izler gerçek geçmişe bağlanır. İyi yönetimin sağladığı sakinlik görsel/sesli kriz efektleriyle doldurulmaz. Ayrıntılı örnekler [olay kütüphanesindedir](OLAY_KUTUPHANESI.md); ilk kalıcı iz yol haritası 2.8'dedir.

### Bilginin sınırları

- Futbolcu ve teknik direktörün gizli yetenek/potansiyel puanları gösterilmez. Yıldız, harf notu veya renkli genel güç çubuğu da aynı bilginin dolaylı gösterimi olamaz.
- Yaş, boy, ücret, sözleşme süresi, maç istatistiği, tarih ve bütçe gibi başkanın öğrenebileceği bilgiler gösterilebilir. Görüş ile doğrulanmış olgu ayrılır.
- Yönetim adaylarının bugünkü metin profilleri TEST sunumudur; katkının nihai gösterimi açık karardır. Futbolcu ve teknik direktör puanlarını gizleme kuralı kesindir.

## 8. Baskı ve erişilebilirlik

- Zaman sınırlı cevap, flaş ve kamera sarsıntısı yalnızca uygun sahnelerde kullanılır. Sürekli stres efekti temel oyun ritmi değildir.
- Süre soru okunabilir olduktan sonra başlar. Süreyi uzatma, flaş ve sarsıntıyı azaltma seçenekleri planlanan sunumun parçasıdır.
- Erişilebilirlik ayarı gizlice sportif zorluk cezasına dönüştürülmez. Oyuncu bilgiye yetişemediği için yanlış seçeneğe zorlanmamalıdır.
- Temel okunabilirlik, yazı büyüklüğü ve ortam sesi/ses kontrolü ilk yaşayan kulüp bölümünün kabul koşuludur. Kapsamlı seslendirme, kalabalık çeşitliliği ve atmosfer ayrıntıları sonraki aşamalarda geliştirilir.
- Takvim dururken küçük ortam hareketleri veya sesleri devam edebilir; saat ve karar durumu bununla karıştırılmaz. Antrenman gözleminde telefon kararına geçiş anlaşılır olur, bilgi karar okunurken değişmez.
- Bildirimler ve temel sesler sürekli baskı üretmez. Sakin kulüp anları ve iyi yönetimin sağladığı rahatlık sunumda da hissedilir.
