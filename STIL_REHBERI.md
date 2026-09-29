# Chairman — stil rehberi

Bu belge mevcut maç prototipinin görsel dilini ve planlanan kariyer sahnelerinin sunum ilkelerini tanımlar. **Gelecek sahnelere ilişkin kurallar, o sahnelerin bugün yapıldığı anlamına gelmez.** Oyun kapsamı [OYUN_TASARIMI.md](OYUN_TASARIMI.md), yapım sırası [YOL_HARITASI.md](YOL_HARITASI.md) içindedir.

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
- Ofis, toplantı alanı, basın alanı ve antrenman izleme yeri tekrar kullanılabilir. Kesin mekân listesi ilgili aşamada belirlenir.
- Fotoğraflar, kupalar ve tanıdık çalışanlar kulüp hafızasını taşır. Geçmişe ait bir nesne, bağlı olduğu olay gerçekleşmeden varmış gibi gösterilmez.

## 7. Arayüz ve bilgi

- Stat içindeki pano, pankart ve skor tabelalarında mevcut Türkçe karakterli 3×5 piksel yazı kullanılır.
- Maç görüntüsünde TV yayın bandı, radar veya oyuncu etiketi bulunmaz. Dürbün maskesi vardır; skor ve dakika stat tabelasından, ayrıca görüntünün dışındaki radyo satırından izlenir.
- Planlanan yönetim ekranlarında uzun metinler okunabilir yazıyla, açık seçenekler ve belirgin sonuç bilgisiyle sunulur. Bütün arayüzü 3×5 yazıya sıkıştırma.
- Mevcut ilk yönetim ekranı maç öncesi bültenidir (`js/ekran-mac-oncesi.js`). 4:3 oyun karesinde açılır; stat arkada donuk kalır ve koyu panelle büyük ölçüde örtülür. Ölçüler oyun karesiyle birlikte değişir, kaydırma kullanılmaz ve ana eylem sağ altta belirgindir.
- Bülten başlıklarında piksel görünümlü `Jersey 10`, metinlerde `IBM Plex Mono`; ana vurguda tabela amberi, takım ayrımında kırmızı ve lacivert kullanılır. Olası 11 küçük sahada forma renkli ve numaralı işaretlerle gösterilir. Menü renkleri `STIL.menu` içindedir.
- Futbolcu ve teknik direktörün gizli yetenek/potansiyel puanları gösterilmez. Yıldız, harf notu veya renkli genel güç çubuğu da aynı bilginin dolaylı gösterimi olamaz.
- Yaş, boy, ücret, sözleşme süresi, maç istatistiği, tarih ve bütçe gibi başkanın öğrenebileceği bilgiler gösterilebilir. Görüş ile doğrulanmış olgu ayrılır.
- Telefon bildirimleri ve gündem, sahneyi sürekli kapatmadan erişilebilir olmalıdır. Aynı anda birden çok zorunlu karar penceresi açılmaz.

## 8. Baskı ve erişilebilirlik

- Zaman sınırlı cevap, flaş ve kamera sarsıntısı yalnızca uygun sahnelerde kullanılır. Sürekli stres efekti temel oyun ritmi değildir.
- Süre soru okunabilir olduktan sonra başlar. Süreyi uzatma, flaş ve sarsıntıyı azaltma seçenekleri planlanan sunumun parçasıdır.
- Erişilebilirlik ayarı gizlice sportif zorluk cezasına dönüştürülmez. Oyuncu bilgiye yetişemediği için yanlış seçeneğe zorlanmamalıdır.
- Yeni atmosfer ayrıntıları ve ses çalışmaları, başkanlık döngüsü ile kayıt sistemi kurulduktan sonra yol haritasındaki sırasıyla ele alınır.
