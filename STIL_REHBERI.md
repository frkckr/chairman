# Chairman — stil rehberi

Son güncelleme: 2026-10-01. Bu belge mevcut maç prototipinin görsel dilini ve planlanan kariyer sahnelerinin sunum ilkelerini tanımlar. **Gelecek sahnelere ilişkin kurallar, o sahnelerin bugün yapıldığı anlamına gelmez.** Oyun kapsamı [OYUN_TASARIMI.md](OYUN_TASARIMI.md), yapım sırası [YOL_HARITASI.md](YOL_HARITASI.md) içindedir.

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

**Onaylı hedef (2026-09-30; oda 2.5, balkon/antrenman 2.7 ile uygulandı; kişi/görüşme sahneleri henüz yok):** Kulüp odası, görüşme ve antrenman ortamları ilk kapsamda aydınlık sunulur. Yönetim arayüzünde açık zemin, koyu okunabilir metin, sıcak kâğıt/ahşap tonları ve ölçülü kulüp renkleri kullanılır. Ajanda, raporlar, telefon ve maç öncesi bültenin yönetim sunumu bu yöne uyarlanır. Başkan odasının 3B renkleri ve gün ışığı `STIL.oda`, açık arayüz paleti `STIL.kagit` içindedir (krem kâğıt zemin, koyu metin, ahşap çizgi, bordo ve amber vurgu); bunlar TEST değeridir. Bülten henüz bu palete uyarlanmadı. 2026-10-01 ekran yenilemesi bu açık tonları korur.

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
- **Onaylı hedef (2026-10-01; 2.8D):** Ayrı şehir stadı ve seçimi kaldırılır. Oda penceresi, balkon ve ev sahibi maçının saha/tribün/çatı/aydınlatma yerleşimi aynı stat tarifinden kurulur. Gündüz boş tribün ile gece dolu tribün aynı yapının farklı hâlleridir. Kariyerdeki etaplı gelişim bu ortak yapıya uygulanır (8.3); lig değişimi otomatik stat değişimi yaratmaz.
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
- İlk kapsam başkan odası/görüşme alanı ve antrenman kenarıdır; mevcut stat deneyimine bağlanır. Oda ve balkon uygulanmıştır (§7); kişi modelleriyle görüşme alanı hedeftir. Basın alanı ve diğer yerler ihtiyaç oluştuğunda genişletilir. Aynı oda farklı görüşmelerde yeniden kullanılır; her konu için yeni mekân gerekmez.
- Telefon, ajanda ve ilgili dosya bulunduğun ortamdan erişilebilir olur. Etkileşimler görünür ve anlaşılırdır; oyuncu gerekli bilgiye ulaşmak için gizli nesne aramaya veya uzun geçişleri tekrar izlemeye zorlanmaz.
- Ortam değişiminde aynı mesele, insanlar ve önceki kararlar devam eder. Kamera ve küçük çevre hareketleri dikkati o anki konu üzerinde tutar.
- Fotoğraflar, kupalar ve tanıdık çalışanlar kulüp hafızasını taşır. Geçmişe ait bir nesne, bağlı olduğu olay gerçekleşmeden varmış gibi gösterilmez.

### Onaylı kamera ve hareket yenilemesi

**2026-10-01; henüz uygulanmadı, 2.8A/2.8D:** Oda açılışı başkanın masasından kalır. Oda ve maç masasındaki çay, buhar ve içme hareketi kaldırılır; ellerin diğer işlevleri ve maç tepkileri sürer.

- Balkona çıkışın ana hedefi kapının kendisidir; “Balkona çık” menü düğmesi kaldırılır. Kapının tıklanabilir alanı rahatça seçilir; üzerinde kısa etiket/ışık ve klavye odağı bulunur. Geri dönüş de anlaşılır olur.
- Kalkış → kapıya yönelme → ritimli adımlar → balkon masasına varma/oturma ayrı hareketler olarak hissedilir. Kamerayı düz çizgide kaydırmak yeterli değildir; adım ritmi hızla uyumlu, küçük ve rahat olmalıdır. Başlangıçta tam bacak modeli gerekmez. Tekrarlı uzun geçiş zorunlu tutulmaz; hareket azaltma seçeneği erişilebilir kalır.
- Maç koltuğu gerçek tribün geometrisiyle birlikte daha yükseğe alınır. Başkanın altında tribün sıraları, önünde saha görünür; saha bütünü izlenebilir. Kamera yalnız havaya kaldırılmaz; koltuk, masa ve başkan bölümünün konumu tutarlı olur. Dürbün ve eller bu açıyla yeniden kontrol edilir.
- Genel duraklatmada kalkış, adım, kapı, kamera bakışı ve başkan hareketi bulundukları anda donar; devamda sıçrama olmaz. Serbest inceleme için menü gezintisi açık kalır.

## 7. Arayüz ve bilgi

### Bugünkü uygulama

- **Başkan odası (`js/oda.js`, `js/ekran-oda.js`) oyunun açılış ekranıdır (2.5).** Başkanın masasından bakılır: pencerede uzakta kulübün tribünü, duvarda flama ve oyun saatini gösteren saat, iki ziyaretçi koltuğu, dosya dolabı. Gün ışığı oyun saatine göre değişir. Kupa ve fotoğraf yoktur: yaşanmamış geçmiş gösterilmez.
  - Masada telefon, ajanda defteri ve dosya vardır; aynı üçünün etiketli düğmesi solda durur (klavye 1/2/3, Esc). İmleç nesnenin üzerindeyken amber çerçeve yanar. Telefon yeni haberde amber yanar ve sayıyı gösterir; ajanda defteri günün tarihini taşır; dosya yalnız mesele varken masadadır.
  - Panel açık renkli kâğıt görünümündedir, karenin sağında açılır; oda solda görünür kalır ve bakış nesneye döner. Aynı anda tek panel açıktır. Haber paneli kendiliğinden açmaz.
- **Balkon ve antrenman (`js/balkon.js`, 2.7).** Odanın uzak duvarındaki kapıdan balkona yürünür (“Balkona çık”, klavye 5; yaklaşık 3 saniyelik kamera yürüyüşü, tıklayınca atlanır, hareket azaltma ayarında doğrudan geçilir). Balkonda korkuluk ve küçük masa vardır; karşıda kulübün sahası bütünüyle görünür, tribünler boştur. Işık oyun saatine göre değişir. Antrenman saatinde takım kadrodaki görünüşüyle sahadadır: ısınma koşusu, pas çemberi, kaleye şut, kenarda teknik ekip. Saat dışında saha boştur.
  - Sol altta gözlem şeridi durur: antrenmanın durumu, “İzle” süreleri, gözlem durduğunda kalan süre, “Gözleme devam et” ve “Gözlemi bırak”. Gözlemde saat birkaç saniyede akar; telefon çalınca o anda durur ve telefon yanar.
  - Telefon, ajanda, dosya ve gazete balkondan da aynı panellerle açılır. Gözlem sürerken tam dikkat isteyen seçenek kapalı görünür ve nedenini yazar. Renkler ve kamera `STIL.balkon`, yürüyüş `STIL.oda.yol` içindedir.
  - Üstte kulüp/başkan ve kayıt durumu, solda tarih ve saat, altta son gelişme, sıradaki durak ve “İlerle” (maç günü “Stada git”) her zaman görünür.
  - Dosyada başlık ve durum, yürüten, “Bilinenler” (kaynağıyla), karar seçenekleri ve kısa geçmiş bulunur. Seçenekler kararın bilinen maliyetini ve belirsizliğini yazar.
  - Yazı büyüklüğü karenin genişliğine orantılıdır (normal ve büyük); uzun içerikte panel kendi içinde kaydırılır. Ses düzeyi ve sessiz ayarı vardır; sesler bilgi taşımaz.
  - Dosyada karar seçeneklerinin altında “Görüş iste” düğmesi vardır: kimin inceleyeceği ve görüşün ne zaman geleceği yazılır; görüş “Bilinenler”e kişinin adıyla düşer. Dosyada o konuda verilen sözler, ajandada başkanın başlatabileceği girişimler ve verdiği bütün sözler (açık/tutuldu/bozuldu) listelenir.
  - Gazete yalnız çıkmış bir haber varken masadadır (dördüncü nesne ve düğme, klavye 4); yeni haberde amber yanar. Panelde manşet büyük başlık yazısıyla ve bağlı olduğu konuyla gösterilir.
  - Kayıtlı olaydan doğan izler: masada teşekkür kartı, pencerede tribün çatısında iskele (onarım başladıysa), duvarda pano sözünün notu. Olay yaşanmadıysa iz de yoktur.
  - Koyu ajanda ekranı (`?ekran=ajanda`) geliştirici görünümü olarak durur.

- Stat içindeki pano, pankart ve skor tabelalarında mevcut Türkçe karakterli 3×5 piksel yazı kullanılır.
- Maç görüntüsünde TV yayın bandı, radar veya oyuncu etiketi bulunmaz. Dürbün maskesi vardır; skor ve dakika stat tabelasından, ayrıca görüntünün dışındaki radyo satırından izlenir.
- Maç öncesi bülteni (`js/ekran-mac-oncesi.js`) 4:3 oyun karesinde açılır; stat arkada donuk kalır ve koyu panelle büyük ölçüde örtülür. Ölçüler oyun karesiyle birlikte değişir, kaydırma kullanılmaz ve ana eylem sağ altta belirgindir.
- Koyu ajanda ekranı (`js/ekran-ajanda.js`; 2.5'ten beri yalnız `?ekran=ajanda`) bültenin düzenini izler: aynı 4:3 kare, `cqw` ölçüleri, panel başlıkları ve `STIL.menu` renkleri, kaydırma yok, ana eylem (“İlerle”, maç günü “Stada git”) sağ altta.
  - Zorunluluk etiketlerinde zorunlu kırmızı, ertelenebilir amber, isteğe bağlı soluk renkle gösterilir.
  - Kaçırılacak işler ve engeller ilgili düğmenin yanında kırmızı metinle önceden yazılır; kaçırtan eylem satır içi onay ister.
  - Tutarlar kuruşsuz yazılır, giderler kırmızıdır.
  - Karar işlerinde seçenekler ayrıntı panelinde alt alta listelenir; seçilen seçenek amber kenarla işaretlenir, seçim yapılmadan ana düğme kapalı kalır.
  - Yönetim adayları meslek, güçlü ve zayıf yanlar ve beklenti metniyle tanıtılır; katkı için sayı, seviye ya da çubuk gösterilmez.
  - Sağ kolonda “Meseleler” listesi durum ve “yeni” işaretiyle gösterilir. Bir mesele seçilince ayrıntı panelinde önce yürüten kişi, bekleyen adım ve “Şimdi” satırı, sonra kısa geçmiş görünür. Kayıttan dönüşte ayrıntı panelinde “Kaldığın yer” özeti açılır ve “Devam” ile kapanır. Alt şeritte sıradaki durak ve arada olacaklar yazılır; kayıt yazılamazsa üst şeritte kırmızı bildirilir.
  - Koşula bağlı olayın meselesinde (2.4A) “Bilinenler” listesi başkanın elindeki kanıtları kaynağıyla gösterir (ör. “Muhasebe kayıtları”, “Sponsorluk sözleşmesi”, görüş bildiren kişinin adı). Başkanın bilmediği henüz olmamış dış gelişme ajandada ve önümüzdeki günlerde görünmez. Başlangıcın, paketin ve tohumun geliştirici adları ile dünyanın gizli gerçeği ekrana yazılmaz. Son cevap anı bugün değilse günüyle birlikte yazılır.
- Bülten başlıklarında piksel görünümlü `Jersey 10`, metinlerde `IBM Plex Mono`; ana vurguda tabela amberi, takım ayrımında kırmızı ve lacivert kullanılır. Olası 11 küçük sahada forma renkli ve numaralı işaretlerle gösterilir. Menü renkleri `STIL.menu` içindedir.

### Onaylı hedef: mekân içinde tek konuya odaklanma

**2026-09-30 tasarım kararı; oda (2.5) ve balkon/antrenman (2.7) uygulandı, kişi/görüşme sahneleri henüz yok.** Yukarıdaki “Bugünkü uygulama” mevcut koyu bülten ve geliştirici ajandasını da anlatır. 2026-10-01'de onaylanan ekran yenilemesi henüz uygulanmadı; yeni akış aşağıdaki kurallarla geliştirilir:

- Ortam görünür kalır; görüşme veya karar sırasında odaktaki kişi/konu öne çıkar. Kulübün bütün göstergeleri sürekli aynı ekrana yığılmaz.
- Telefon, ajanda, rapor ve mali ayrıntılar gerektiğinde açılır, kapatıldığında bulunulan ortama dönülür. Aynı mesele başka kanaldan açıldığında geçmişi ve durumu korunur.
- Ekranda meselenin kısa özeti, ilgili kişi, başkandan beklenen karar ve varsa son tarih anlaşılır olur. Ayrıntılar isteğe bağlı açılır; bilgi saklamak için küçük yazı veya belirsiz nesne kullanılmaz.
- Rutin haberler kısa özette toplanır. Önemli mesaj sahneyi sürekli kapatmadan fark edilir; oyuncu mesajı açıp cevaplayabilir, tavsiye isteyebilir veya yetki devredebilir. Aynı anda birden fazla zorunlu karar penceresi açılmaz.
- Görüşmede tavsiye, taahhüt ve karar farklı anlamlarıyla gösterilir. Süre ve bilinen sonuç/çakışmalar eylemden önce anlaşılır olur. Bir mesajın okunması işi bitirmiş gibi sunulmaz.
- Uzun metinler okunabilir yazıyla, açık zemin üzerinde yeterli kontrastla gösterilir. Maçın 640×480 iç çözünürlüğü veya bugünkü menü ölçüleri yeni metin düzenini zorunlu olarak sınırlamaz; pencere boyutu ve yazı büyüklüğü birlikte sınanır.
- Tarih/saat, zamanın durduğu an ve başlatılan ilerleme görünür biçimde anlaşılır. Oyun kuralları [OYUN_TASARIMI §6](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo) içinde tutulur.
- Oyuna dönüşte son karar, beklenen haberler ve yaklaşan önemli tarih kısa özetle hatırlatılır. Gün içi kayıt sınırı ve son başarılı kayıt doğru anlatılır. Bu ilke uygulanmıştır: dönüş özeti telefonda açılır (2.4, 2.5).

### Onaylı ekran düzenleri ve etkileşim

**2026-10-01; hedef, henüz uygulanmadı (2.8A–2.8F):** Açık krem/kâğıt tonları korunur. Önce tek dosyanın kullanılabilir düzeni kurulur; ajanda, telefon ve ayarlar aynı okunabilirlik kurallarını izler. Ekranların görev sınırı [OYUN_TASARIMI §2](OYUN_TASARIMI.md#2-başkanın-rolü-ve-ana-döngü) içindedir.

**Oyun çerçevesi:** `index.html` üzerindeki dış “Chairman / Başkanın gözünden / açık tribün / 89. dakika” notları, alttaki Ekran/Renk/Oyuncular açıklamaları ve renk kutuları kaldırılır. Oyuncu alanında kısa tarih/saat, gerçek kayıt durumu, gerekli ana eylem ve Duraklat erişimi kalır. Mevcut stat/hız/doluluk/zemin denemeleri küçük bir Geliştirici alanına taşınır; kaldırılan şehir stadı seçimi geri konmaz. Proje açıklaması README'de yaşar.

**Dosya:** Üstte kategori simgesi ve adı, konu başlığı, durum; ardından ilgili kişi, varsa son tarih ve 2–3 cümlelik “Ne oldu?” bulunur. Birkaç önemli olgu ve gerekiyorsa kısa zaman çizgisi kararı destekler. Başkanın yapabileceği işlemler kısa seçenekler hâlinde sunulur; bilinen maliyet, süre ve kritik risk okunabilir kalır. Ek belge/geçmiş ayrı açılır. Alt kenarda “Önceki dosya”, “Sıradaki dosya” ve açık/cevap bekleyen/takipte sayıları vardır. Arşiv ayrı açılır; bütün meseleler uzun bir düğme listesi olarak üst üste dizilmez. Karar sonrası kısa sonuç aynı konuda görünür; otomatik sonraki dosyaya geçilmez.

**Ajanda:** Açık bir defter/hafta görünümü; seçili günün randevuları kısa saat–kişi–konu satırlarıyla gösterilir. Seçilen kayıtta yer, süre, durum ve uygun katıl/ertele/ilgili dosya eylemi bulunur. Yaklaşan cevap/taahhüt tarihleri küçük hatırlatmadır. Girişim başlatmak uygun ayrı bölümden erişilir. Kasa ve finans tablosu başka dosyadadır; ödeme tarihi görünür kalır. Geçmişteki bütün sözler ve karar metinleri ajandaya doldurulmaz.

**Telefon:** Ortamda görülen telefon tıklanınca okumaya uygun boyutta cihaz/panel açılır. Mesajlar ve Canlı Skor iki açık isimli uygulama simgesidir; gereksiz uygulama eklenmez. Mesajlar bir konuşmayı gösterir; gönderen, zaman, konu ve cevap gerekip gerekmediği anlaşılır. Konuşmalar arasında önceki/sonraki veya kısa seçiciyle gezilir. Cevapla/ilet/görüş iste/devret yalnız gerçek komut varsa görünür. Bağlı dosyadan geri dönünce aynı konuşma ve okuma yeri bulunur. Yeni bildirim mevcut konuyu değiştirmez. Maçta telefondan çıkış maçın durduğu ana döner; elle duraklatma varsa devam etmez.

Canlı Skor'da o maç gününün karşılaşmaları kısa skor/dakika/durum satırlarıdır. Kendi maçı seçilince motorun ürettiği şut, isabet, topa sahip olma, korner ve kart gibi mevcut istatistikler sade karşılaştırmayla görünür. Üretilmeyen xG veya henüz simüle edilmeyen diğer skorlar varmış gibi sunulmaz. Diğer maçların bağlantısı 3.8'de gelir; ilk telefon “Diğer maç verileri henüz bağlı değil” durumunu gösterir. İlk maç mesajlarında içerik yoksa sakin bir boş durum kullanılır.

**Ayarlar:** Açık tonlarda okunabilir satırlar; Görüntü/Hareket, Okuma, Kayıt ve Geliştirici bölümlerinden biri seçilerek düzenlenir. Kontrolün adı ve mevcut değeri yakın durur. Yazı büyüklüğü, hareket azaltma, kayıt durumu ve iki adımlı Yeni kariyer anlaşılırdır. Ses bölümü yoktur. Geliştirici bölümünde test bilgileri ve gerekiyorsa mevcut deneme kontrolleri bulunur.

**Test bilgisi:** Gizli değerler uzun TEST paragrafları olarak oyun metninin arasına yazılmaz. Test ayarı açıkken ilgili konu/aday/seçenekte küçük TEST simgesi belirir; üzerine gelince bilgi kutusu açılır. Aynı bilgi klavye odağı ve tıklama ile de okunabilir; dar alanda panelden taşmaz. Normal oyunda görünmez, yayından önce çıkarılır. Simgeye bakmak dünya durumunu değiştirmez. Geliştirici alanındaki “Görüntüyü kaydet” mevcut ekranı not almak için dışarı kaydeder; kayıt biçimine tam bir not uygulaması eklenmez.

**Okunabilirlik ve süreklilik:** Uzun metinde Türkçe karakterleri iyi gösteren, orantılı ve okunabilir gövde yazısı kullanılır; retro başlıklar ve 3B stil sürer. Kategori simgesi metinle birlikte kullanılır, tek başına anlam yüklenmez. Paragraflar kısa, boşluklar yeterli, tıklama alanları rahat olur. Başlık–özet–işlem sırası normal ve büyük yazıda sınanır. Aç/kapa animasyonu kısa olur ve okumayı bekletmez. Genel duraklatma ekranı karartmaz; küçük “Duraklatıldı” göstergesi vardır. Sessiz/sakin günün boş durumu bilinçli bir tasarımdır; sürekli yanıp sönen uyarı üretilmez.

### Onaylı maç programı

**2026-10-01; hedef, henüz uygulanmadı (2.8E):** Mevcut yoğun koyu bülten açık kâğıt tonlarında kulübün basılı maç programı hissine dönüşür. Kapakta kulüp armaları, karşılaşma adı, tarih/yer, küçük kodla çizilmiş stat resmi ve bir satır maç bağlamı bulunur. Kadrolar ve lig bilgisi isteğe bağlı ayrı sayfalardadır; aynı anda bütün veriler görünmez, sayfalar kendiliğinden dönmez. Başkanın kadroyu seçtiği izlenimi verilmez.

“Maç hazırlanıyor…” durumu en az 10 saniye görünür; kaynaklar da hazır olunca “Maça geç” etkinleşir. Gerçek hazırlık durumu doğru anlatılır, sahte yüzde üretilmez. Oyuncu butonla geçer; program sayfasını değiştirmek sayacı sıfırlamaz. Duraklat hazırlık sayacını da durdurur; arka planda kaynak yüklenmesi tamamlanabilir ama maç başlayamaz. Maç, tören ve takvim zamanı bu sayfada ilerlemez.

Tasarım dayanakları: [SEGA'nın FM21 tanıtımındaki takım kâğıdı ve maç öncesi görüşme](https://sega.prezly.com/football-manager-2021-new-headline-features-revealed), [EA FC25'in maç girişleriyle ilgili açıklaması](https://www.ea.com/games/ea-sports-fc/fc-25/news/fc-25-community-update). Referanslardan maçın önemini hissettiren kısa hazırlık ve isteğe bağlı bilgi katmanı alınır; düzen oyunun başkan bakışına ve açık tonlarına uyarlanır. Bunlar tarihsel tasarım referanslarıdır; güncel ürün özellikleri veya birebir görsel şablon olarak kabul edilmez.

### Koşula bağlı olayların sunumu

**Onaylı hedef (2026-09-30; ilk örnek ajanda ve oda dosyalarında kısmen uygulandı, yukarıdaki “Bugünkü uygulama”; 2026-10-01 tek konu düzeni henüz yok):** Aynı olay ailesi farklı kariyerlerde farklı koşullarla sunulabilir. Ekran şablonu yeniden kullanılabilir; yalnız kişi adı, renk veya tutar değiştirerek içerik çeşitliliği sağlandığı varsayılmaz. Mevcut koşullar, bilgi ve seçenekler ortak mesele verisinden gelir.

- Yeni kariyerin gündemi gerçekte oluşmuş işlerden çıkar; her açılışta aynı kriz kartı zorla gösterilmez. Sakin anda oda ve isteğe bağlı girişimler erişilebilir kalır.
- Mesajda gönderen, haberin zamanı, neyin doğrulanmış bilgi, neyin yorum olduğu ve varsa cevap son tarihi anlaşılır olur. Bilginin kaynağı görünürdür; gizli dünya gerçeği veya gelecekteki olay zinciri oyuncuya dökülmez.
- Olay ailesinin veya test başlangıcının geliştirici kodu oyuncuya gösterilmez. “P01”, tohum, içerik sürümü ve teknik tetikleme gerekçesi oyun arayüzünün parçası değildir.
- Seçenek, bilinen maliyeti ve taahhüdü anlatır; belirsiz sonuç kesin başarı gibi veya her durumda doğru seçenek vurgusuyla sunulmaz. Kararın ardından gerçekten oluşan sonuç ile beklenen haber ayrılır.
- Yetki içinde çözülen rutinler özette görünür. Haber gelişini fark ettirmek sürekli açılan pencere, zorunlu mekân değiştirme veya her mesajda onay isteme gerektirmez.
- Tutulan küçük söz, teşekkür, fotoğraf ve tamamlanan bakım gibi izler gerçek geçmişe bağlanır. İyi yönetimin sağladığı sakinlik görsel/sesli kriz efektleriyle doldurulmaz. Ayrıntılı örnekler [olay kütüphanesindedir](OLAY_KUTUPHANESI.md); ilk kalıcı iz yol haritası 2.8'dedir.

### Bilginin sınırları

- Futbolcu ve teknik direktörün gizli yetenek/potansiyel puanları gösterilmez. Yıldız, harf notu veya renkli genel güç çubuğu da aynı bilginin dolaylı gösterimi olamaz.
- Yaş, boy, ücret, sözleşme süresi, maç istatistiği, tarih ve bütçe gibi başkanın öğrenebileceği bilgiler gösterilebilir. Görüş ile doğrulanmış olgu ayrılır.
- Yönetim adaylarının katkısı nihai üründe profil metniyle anlatılır; seviye, sayı ya da çubuk gösterilmez (karar 2026-09-30). Futbolcu ve teknik direktör puanlarını gizleme kuralı kesindir.
- **Geçici istisna (geliştirme aşaması, kullanıcı kararı 2026-09-30):** “Test bilgileri” ayarı açıkken katkı seviyeleri, gizli koşullar, seçeneklerin üreteceği sonuç ve futbolcu özellikleri kesikli çerçeveli, “TEST” etiketli kutularda gösterilir. Ayar kapalıyken hiçbiri ekrana yazılmaz. Bu gösterimler yayından önce kaldırılacaktır ve nihai arayüzün parçası sayılmaz.
- **Sunum yenilemesi (2026-10-01; hedef, 2.8A/2.8C):** Bu geçici izin korunur; bugünkü satır içi TEST kutuları yukarıdaki küçük simge/bilgi kutusuna taşınır. Normal oyun metniyle geliştirici bilgisi karışmaz.

## 8. Baskı ve erişilebilirlik

- Zaman sınırlı cevap, flaş ve kamera sarsıntısı yalnızca uygun sahnelerde kullanılır. Sürekli stres efekti temel oyun ritmi değildir.
- Süre soru okunabilir olduktan sonra başlar. Süreyi uzatma, flaş ve sarsıntıyı azaltma seçenekleri planlanan sunumun parçasıdır.
- Erişilebilirlik ayarı gizlice sportif zorluk cezasına dönüştürülmez. Oyuncu bilgiye yetişemediği için yanlış seçeneğe zorlanmamalıdır.
- Temel okunabilirlik, yazı büyüklüğü, hareket azaltma ve dönüş özeti ilk yaşayan kulüp bölümünde sınanır. **2026-10-01 kararı:** Mevcut sesler ve ayarlar 2.8A'da kaldırılır; ana oyun/ekranlar tamamlanıp Aşama 10'a gelinene kadar ses geliştirilmez. Erken ortam sesi kabul koşulu kaldırılmıştır; yukarıdaki ses açıklamaları yalnız mevcut uygulamayı anlatır.
- Takvim dururken küçük ortam hareketleri normal okumada devam edebilir; genel Duraklat bütün hareketi durdurur. Maç telefonu açıkken maç ve maç ortamı donar. Antrenman kararında bilgi ve kariyer zamanı sabittir; durma anı ekranda doğru gösterilir.
- Bildirimler sürekli baskı üretmez. Sakin kulüp anları ve iyi yönetimin sağladığı rahatlık sunumda da hissedilir. Ses tasarımı Aşama 10'da bu ritme uygun olarak yapılır.
