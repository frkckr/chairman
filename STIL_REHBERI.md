# Chairman — stil rehberi

Son güncelleme: 2026-10-03. Bu belge mevcut maç prototipinin görsel dilini ve planlanan kariyer sahnelerinin sunum ilkelerini tanımlar. **2.8A–2.8F ilk uygulamadır; 2026-10-02 iki seçenekli sade sunum yenilemesi 2.8G–2.8K ile uygulandı (aşağıdaki “Bugünkü uygulama” notları).** Oyun kapsamı [OYUN_TASARIMI.md](OYUN_TASARIMI.md), yapım sırası [YOL_HARITASI.md](YOL_HARITASI.md) içindedir. Hedefler okunabilirlik ve etkileşim çerçevesidir; kesin ölçü, ikon, portre kompozisyonu ve kısa metin uygulayıcının tasarım alanıdır.

Ortak görsel ayarlar `js/stil-99.js` üzerinden yönetilir. İlgili dosyalarda kalan sabitler değiştirilirken uygun ortak ayarlara taşınır. Bu belge bütün sayısal değerleri tekrar eden bir envanter değildir.

## 1. Görsel kimlik ve ekran

- Mevcut referans FIFA 99 / PS1 dönemi 3B futbol görünümüdür. Önceki reddedilmiş görsel konseptler bu yönün yerine geçmez.
- Maç görüntüsü 4:3 ve 640×480 iç çözünürlüktedir. **2026-10-03 (kullanıcı kararı):** maç sahnesi içeride 2× (1280×960) çizilir, her 2×2 blok ortalanarak 640×480 ızgaraya iner; 5 bit renk ve titreme bu ızgarada aynen uygulanır (`STIL.ekran.ornekleme`). Oda ve balkon 640×480'de çizilir. Ekrana büyütmede tuval görünen boyu karşılayan tam sayı katında çizilir, tarayıcı küçültürken yumuşatır (keskin çift doğrusal); pikseller eşit genişlikte kalır.
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

- **2026-10-03:** maçta sıcak ana ışık başkanın locası tarafından gelir (`STIL.isik.ana.konum`), soğuk karşı ışık uzak taraftan; oyuncular locadan arkadan aydınlanmış görünmez. Oyuncu malzemelerine kendi dokusundan hafif ışıma eklenir; saha çizgileri her zaman en az bir piksel çizilen ayrı bir katmandır, top ekranda en az ~3,3 piksel görünür ve havadayken altında koyu bir leke vardır (`STIL.okunurluk`, `js/okunurluk.js`). İsteğe bağlı 1 piksellik koyu dış çizgi denemesi vardır, varsayılanı kapalıdır (`STIL.okunurluk.disCizgi`).
- Mevcut gece gölgeleri, oyuncunun kemiklerine bağlı kutuların projektörden zemine izdüşümüdür (`js/golgeler.js`). Kol ve bacaklarla hareket eder; top da gölge verir.
- Aynı ışığın gölgesi stencil ile aynı pikseli bir kez koyulaştırır; farklı ışıklar üst üste gelebilir.
- Gündüz, hava durumu ve bunlara uygun gölge düzenleri gelecekteki iştir. Bugünkü gece sahnesinin tamamlanmış alternatifleri sayılmaz.

**Onaylı hedef (2026-09-30; oda 2.5, balkon/antrenman 2.7 ile uygulandı; kişi/görüşme sahneleri henüz yok):** Kulüp odası, görüşme ve antrenman ortamları ilk kapsamda aydınlık sunulur. Yönetim arayüzünde açık zemin, koyu okunabilir metin, sıcak kâğıt/ahşap tonları ve ölçülü kulüp renkleri kullanılır. Ajanda, raporlar, telefon ve maç öncesi sunum bu yöne uyarlanır. Başkan odasının 3B renkleri ve gün ışığı `STIL.oda`, açık arayüz paleti `STIL.kagit`, maç programının paleti `STIL.program` içindedir (krem kâğıt zemin, koyu metin, ahşap çizgi, bordo ve amber vurgu); bunlar TEST değeridir. Maç öncesi koyu bülten 2.8E'de açık tonlu maç programına dönüştü; yalnız geliştirici görünümü olan koyu ajanda `STIL.menu` ile kalır.

Maçın mevcut gece atmosferi kendi bağlamında kalır. İlk aydınlık oda ve gözlem örneği, bütün statlara gündüz/hava sistemi eklenmesini beklemez; kapsamlı saat, hava ve gölge çeşitliliği sonraki iştir.

## 3. Kodla üretilen görseller

- Geometri az poligonludur. İnsanlar kutu temelli kemikli modellerle, top 20 yüzlü geometriyle çizilir.
- Oyun görselleri kodla üretilir. Harici model, fotoğraf gerçekliğinde doku, gerçek marka ve logo kullanılmaz.
- Oyuncu atlası 64×64'tür. Küçük desenler düşük çözünürlüklüdür; saha ve pano gibi üretilen yüzeyler için bütün dokulara tek bir 64 piksel üst sınırı konmaz.
- Oyuncu ve bayrak dokularında keskin piksel görünümü korunur. Seyirci, reklam panosu ve çimde uzak titreşmesini azaltan mipmap kullanılabilir.
- Yeni sahneler aynı malzeme, insan modeli ve tarif yaklaşımını yeniden kullanır. Her olay için ayrı bir mekân üretmek gerekmez.

## 4. İnsanlar ve hareket

- Oyuncular boy, vücut yapısı, saç, yüz kılları, krampon ve forma ayrıntılarıyla ayırt edilir. Numara sırtta büyük, göğüste küçüktür; kaleci kıyafeti farklıdır. Deplasman kalecisinin forması çimde kaybolmasın diye mordur (2026-10-03; kullanıcı incelemesine açık).
- Hareketler mevcut `POSE` sistemine eklenir. Ayrıntılı poz listesi kodda tutulur; bu belge ikinci bir liste oluşturmaz.
- **2026-10-03 (`js/animasyon.js`):** iskelette kalçanın altında bir gövde kemiği vardır (insan başına yine tek çizim). Koşu yönü gövdeye göre ileri, geri ve yan adım olarak karışır; yerdeki ayak kaymaz (iki kemikli bacak uzanması). Kalça harekete döner, gövde ters döner; ivmede eğilir, dönüşte yatar. Baş topa ya da oyuncunun etrafa bakma yönüne döner. Vuruş biçimi (iç, dış, üst, aşırtma, vole) ve gücü ayrı görünür; omuz mücadelesi, sendeleme, jokey ve top koruma duruşları vardır. Düşüşün yönü temastan gelir; kalkış aynı yönden olur (ters dönme yok). Kalecinin uçuşu itiş, havada yay ve iniş evrelerinden oluşur. Sevinçler dört çeşittir ve oyuncular aynı anda hareket etmez; gol yiyen takım üzgün durur. Top falso ve üst dönüşüyle döner, elde dönmez. Görünüş ayarları `STIL.animasyon`; denemesi `araclar/poz-galerisi.html`.
- Model motorun gerçek bakış yönünü izler. Sol ayaklı futbolcunun vuruşu doğru bacağa aynalanır.
- Koşu hızla uyumludur; poz geçişleri, dönüşler ve sabit motor adımları arasındaki çizim yumuşaktır.
- Yedekler, teknik direktör, saha personeli, top toplayıcılar, hakemler ve fotoğrafçılar işlevlerine uygun görünür. Yeni görevlerde var olan modeller ve pozlar geliştirilir.
- Uzun kariyerde aynı kişinin tanınması korunur. Yaşlanma ve değişen görevlerin görünüşe etkisi gelecekte eklenir; rastgele yeni görünüm verilmez.

## 5. Stat ve tribün

- Statlar `js/stadyum-tarifleri.js` içindeki tariflerden kurulur. Bugün yalnız kulübün kendi stadı vardır (`kulup`; 2.8D öncesindeki ayrı şehir stadı kaldırıldı); Avrupa arenası gelecekte yapılacaktır.
- **2.8D uygulaması (tarihsel):** Ayrı şehir stadı kalktı; ana tribün çatısız, karşı tribün kısmen çatılıydı ve iskele izi oradaydı. Oda penceresi, balkon ve ev sahibi maçı aynı tariften kurulur. Gündüz boş tribün ile gece dolu tribün aynı yapının farklı hâlleridir. Etaplı gelişim ileride bu ortak yapıya uygulanır (8.3); lig değişimi otomatik stat değiştirmez.
- **Onaylı yenileme (2026-10-02; 2.8J ile uygulandı):** Başlangıç çatısız, küçük ve yıpranmış kasaba/ilçe stadıdır: kısa beton tribünler, az koltuk, alçak kale arkası/set, seyrek reklam ve sade çevre. Çatı, koltuk ve diğer kapsamlı iyileştirmeler yatırımla gelir. Başkanın yüksek konumu ve altında görünen sıralar, küçültülen tribünle birlikte çözülür; saha okunabilir kalır. Mevcut bakım iskelesi olmayan çatıya bağlanmaz, gerçek bakımın uygun yapısal izine dönüşür.
- **Bugünkü uygulama (2.8J):** Stadın hiçbir yerinde çatı yoktur. Ana tribün 9 sıralı ve kısadır; ortasında 1,5 m yükseltilmiş beton protokol locası vardır: başkan eski yüksekliğinde oturur, altında dört sıra ve geçit görünür. Karşı tribün 5 sıralı ayakta tribündür (meşaleler oradadır), kale arkaları alçak setlerdir; reklam panoları seyrek, projektörler alçaktır. Tribün onarımı karşı tribünün basamaklarında iskele, mavi branda, çimento torbaları ve bariyerle görünür (yalnız onarım başladıysa). Oda penceresinin denizliği küçük tribün görünsün diye alçaltıldı.
- **Tek tabela:** Mevcut tabela yenilenir; ikinci tabela eklenmez. Direkler üzerinde sade fiziksel tabela iki arma, skor ve dakika gösterir. Konum/yükseklik/yazı boyu başkanın normal bakışında okunarak seçilir, sahayı kapatmaz; balkon ve maç aynı yapıyı görür. Maç öncesi/devre/maç sonu durumu gerektiğinde dakika alanında kısaca belirtilir. Gösterişli arena donanımı başlangıca eklenmez. *Bugün (2.8J):* tabela karşı tribünün arkasında iki direk üstündedir; iki piksel arma, büyük skor ve altta “DAKİKA n” ya da “MAÇ ÖNCESİ”/“DEVRE ARASI”/“MAÇ SONU”. Balkon ve pencerede yalnız kulüp arması ve adı görünür; hayalî skor yoktur.
- **Başkanın locası (2.8O, kullanıcı kararı 2026-10-02):** Başkan maçı ana tribünün arkasındaki kulüp binasında, odanın balkonunun bir kat üstündeki beton locadan izler (alçak ön bordür, yan duvarlar, iki ayak; masası korkuluk işini görür). Tribündeki protokol bölümü diğer yöneticilerindir. Yedek kulübeleri orta çizgiye 7 m'dedir. Oda penceresi ve balkon görünümü değişmedi.
- Küçük statta yıpranmış zemin, daha sınırlı aydınlatma, seyrek reklam ve çevredeki yerleşim kulübün ölçeğini hissettirir.
- Zemin kalitesi çimin rengini, kel/çamurlu alanları, çizgileri ve biçme desenini etkiler. İnşaat ve stat gelişimi henüz kariyer sistemine bağlı değildir.
- Seyirciler mesafeye göre ayrıntısı azalan küçük insan modelleridir. Boş koltuklar ve düşük doluluk gerçekten görünür.
- Tepkiler maç olayına ve taraftara bağlıdır. Herkes sürekli zıplamaz; sakin anlar, gelişler, marş ve goller farklı hissedilir.
- Ev sahibi, deplasman ve başkan bölümü kıyafetleri ayrışır. Meşale, duman, pankart, tel örgü ve tabelalar aynı görsel dilde kalır.
- Gelecekte stat yatırımları ve Avrupa deplasmanları ölçek farkını göstermeli; bütün statların yalnızca renk değiştirmiş kopyası gibi görünmesi önlenmelidir.

## 6. Kamera ve başkanın bulunduğu yer

### Mevcut maç prototipi

- Kamera başkanın locasında, göz hizasındadır (2.8O). Dürbün elle açılan yakınlaştırmadır; TV kamerası kullanılmaz. Bugünkü bakış ve yakınlaşma kuralı aşağıdaki 2026-10-03 maddesindedir.
- Bakış topu ve maç günündeki dikkat çekici olayları yumuşak geçişlerle izler.
- Ön planda başkanın kolları, saat, masa, program ve telefon görünür (`js/baskan.js`; çay 2.8A'da kaldırıldı). Eller maç olaylarına tepki verir; dürbün elle kaldırılır. Sakin anda başkan programa ya da telefonuna bakar.

### Planlanan kariyer sahneleri

- Hikâyenin başındaki taraftar yeri, görevdeki başkanın yeri, deplasman protokolü ve seçimi kaybetmiş kişinin misafir/loca konumu birbirinden ayrılır. Mevcut açık tribün kuralı bütün kariyeri aynı koltuğa hapsetmez.
- Deplasmanda ev sahibi yöneticiler ve ilişkiler oturma düzenini etkileyebilir. Kimin yanında oturduğu veriyle belirlenir; her ilişki için yeni stat üretilmez.
- İlk kapsam başkan odası/görüşme alanı ve antrenman kenarıdır; mevcut stat deneyimine bağlanır. Oda ve balkon uygulanmıştır (§7); kişi modelleriyle görüşme alanı hedeftir. Basın alanı ve diğer yerler ihtiyaç oluştuğunda genişletilir. Aynı oda farklı görüşmelerde yeniden kullanılır; her konu için yeni mekân gerekmez.
- Telefon, ajanda ve ilgili dosya bulunduğun ortamdan erişilebilir olur. Etkileşimler görünür ve anlaşılırdır; oyuncu gerekli bilgiye ulaşmak için gizli nesne aramaya veya uzun geçişleri tekrar izlemeye zorlanmaz.
- Ortam değişiminde aynı mesele, insanlar ve önceki kararlar devam eder. 2026-10-02 hedefinde sakin kamera ve gerekli hareketler dikkati konu üzerinde tutar; dekoratif sallantı/tekrarlı süs hareketleri kullanılmaz.
- Fotoğraflar, kupalar ve tanıdık çalışanlar kulüp hafızasını taşır. Geçmişe ait bir nesne, bağlı olduğu olay gerçekleşmeden varmış gibi gösterilmez.

### Onaylı kamera ve hareket yenilemesi

**2026-10-01; çay kısmı 2.8A, kapı/hareket/koltuk 2.8D, sakin hareket standardı 2.8J ile uygulandı:** Oda açılışı başkanın masasından kalır. Oda, balkon ve maç masasındaki çay, buhar ve içme hareketi kaldırıldı; ellerin diğer işlevleri ve maç tepkileri sürer. Genel duraklatma (2.8B) bugünkü yürüyüşü ve kamerayı da dondurur.

- Balkona çıkışın ana hedefi kapının kendisidir; “Balkona çık” menü düğmesi kaldırılır. Kapının tıklanabilir alanı rahatça seçilir; üzerinde kısa etiket/ışık ve klavye odağı bulunur. Geri dönüş de anlaşılır olur.
- **2026-10-02 ile güncellendi:** Kalkış → kapıya yönelme → kısa doğal yürüyüş → oturma hissi korunur; kamera sallantısı ve süs hareketleri kaldırılır. Yalnız düz kamera kayması veya eski hareket azaltmadaki doğrudan geçiş yeni yürüyüşün yerine geçmez. Başlangıçta tam bacak modeli gerekmez; uygulayıcı gerekli hareketi sakin hız/beden/kapı ipuçlarıyla çözer. Bu bütün oyunun standardıdır, Ayarlar'da hareket azaltma seçeneği kalmaz. Maç/top ve gerekli karakter hareketleri devam eder; Duraklat ayrı işlevdir. *Bugün (2.8J):* kamera nefesi, yürüyüş yalpası, gol sarsıntısı, dürbün titremesi, parmak vurma ve yanıp sönen ışıklar kalktı; adımda çok küçük dikey hareket kalır; yürüyüş tıklayınca atlanır.
- Maç koltuğu gerçek tribün geometrisiyle birlikte daha yükseğe alınır. Başkanın altında tribün sıraları, önünde saha görünür; saha bütünü izlenebilir. Kamera yalnız havaya kaldırılmaz; koltuk, masa ve başkan bölümünün konumu tutarlı olur. Dürbün ve eller bu açıyla yeniden kontrol edilir.
- Genel duraklatmada kalkış, adım, kapı, kamera bakışı ve başkan hareketi bulundukları anda donar; devamda sıçrama olmaz. Serbest inceleme için menü gezintisi açık kalır.
- **Topa odaklı bakış ve yakınlaşma (kullanıcı kararı 2026-10-03; 2.8O'daki “atak bölgesini izle, baş az döner” kuralının yerini alır):** Oyun sürerken bakış topa odaklıdır: topu taşıyanın biraz önüne, serbest topta kısa bir öngörüyle topun gideceği yere, uzun havadan topta iniş yerine doğru, son üçte birde kale ağzını da kadraja alacak kadar kaleye kayar; top ekranın ortasına yakın kalır. Sapma ve eğim ayrı, kritik sönümlü yaylarla izlenir (en çok ~100°/sn, top yavaşken küçük ölü bölge); maç zamanıyla ilerlediği için 2–8× hızda geride kalmaz, Duraklat'ta donar. Dikey görüş açısı oyunda oyunun yayılımına göre 36–40° arasında yumuşakça değişir; duran topta kısa bir beklemeden sonra, maç öncesi, devre arası, törende ve maç sonunda 52° geniş açıya döner (kulübeler ve tabela o anlarda görünür). Kart, gol sevinci ve maç günü anlarında ilgi noktası seçimi sürer. Dürbün elle açılır (düğme ya da D tuşu), açıkken bakış topa kilitlenir (9–13°), açılıp kapanırken görüş açısı yumuşak geçer. Boşta telefona bakma yalnız top oyun dışındayken olur. Ayarlar `STIL.kameralar` (`oyunAci`, `aciSure`, `oluGecikme`, `yayOyun`, `top`, `genislik`, `durbun`), kod `js/kamera.js`.
- **Tarihsel (2.8O, kullanıcı kararı 2026-10-02):** Bakış daha yukarıdan ve geniştir: göz ≈12,5 m yüksekte, kenar çizgisinden ≈22 m geride, dikey görüş açısı 52°. Orta sahaya bakarken iki yedek kulübesi, sahanın büyük kısmı, karşı tribün ve tabela görünür; baş sürekli sağa sola dönmez. Bakış topun anlık yerini değil, sahanın ortasına sıkıştırılmış (x payı 0,6, en çok ±30 m; z payı 0,45) ve ~1,3 sn'de yumuşayan atak bölgesini izler; yay yumuşaktır (`STIL.kameralar.baskan.takip`). Masadaki beyaz maç programı ve ona bakma hareketi kaldırıldı; masada sümen ve telefon kalır, sakin anda başkan telefonuna bakar. Saha kenarında top toplayıcı yoktur; kenar boyunca, köşelerde ve kale arkalarında konilerin üstünde yedek toplar durur. Dürbün aynıdır.

## 7. Arayüz ve bilgi

### Bugünkü uygulama

Bu bölüm 2.8A–2.8F kodunu anlatır; 2.8I–2.8J ile değişen yerler ilgili maddede ve aşağıdaki “Onaylı ekran düzenleri” altındaki “Bugünkü uygulama (2.8I)” notunda yazılıdır. Çok seçenekli dosya, “Görüş iste” ve hareket ayarı yalnız eski içerikli kayıtlarda/eski kodda kalır.

- **Başkan odası (`js/oda.js`, `js/ekran-oda.js`) oyunun açılış ekranıdır (2.5).** Başkanın masasından bakılır: pencerede uzakta kulübün tribünü, duvarda flama ve oyun saatini gösteren saat, iki ziyaretçi koltuğu, dosya dolabı. Gün ışığı oyun saatine göre değişir. Kupa ve fotoğraf yoktur: yaşanmamış geçmiş gösterilmez.
  - Masada telefon, ajanda defteri ve dosya vardır; aynı üçünün etiketli düğmesi solda durur (klavye 1/2/3, Esc). İmleç nesnenin üzerindeyken amber çerçeve yanar. Telefon yeni haberde amber yanar ve sayıyı gösterir; ajanda defteri günün tarihini taşır; dosya yalnız mesele varken masadadır.
  - Panel açık renkli kâğıt görünümündedir, karenin sağında açılır; oda solda görünür kalır ve bakış nesneye döner. Aynı anda tek panel açıktır. Haber paneli kendiliğinden açmaz.
- **Balkon ve antrenman (`js/balkon.js`, 2.7, 2.8D).** Odanın uzak duvarındaki kapıya tıklanınca (amber çerçeve, üstünde “BALKON” levhası; klavye 5 ya da odakta beliren düğme) başkan kalkar, kapıya döner, adım adım yürür ve balkonda oturur (yaklaşık 6 sn; tıklayınca atlanır; 2.8J'den beri hareket ayarı yoktur). Balkon ana tribünün en üst sırasının arkasındadır; kulübün maçta görülen stadının aynısı gündüz ve boş görünür. Oda penceresinden de aynı stat (çatısız karşı tribün, tabela, projektörler, apartmanlar) görünür. Işık oyun saatine göre değişir. Antrenman saatinde takım kadrodaki görünüşüyle sahadadır: ısınma koşusu, pas çemberi, kaleye şut, kenarda teknik ekip. Saat dışında saha boştur.
  - Sol altta gözlem şeridi durur: antrenmanın durumu, “İzle” süreleri, gözlem durduğunda kalan süre, “Gözleme devam et” ve “Gözlemi bırak”. Gözlemde saat birkaç saniyede akar; telefon çalınca o anda durur ve telefon yanar.
  - Telefon, ajanda, dosya ve gazete balkondan da aynı panellerle açılır. Gözlem sürerken tam dikkat isteyen seçenek kapalı görünür ve nedenini yazar. Renkler ve kamera `STIL.balkon`, yürüyüş `STIL.oda.yol` içindedir.
  - Üstte kulüp/başkan ve kayıt durumu, solda tarih ve saat, altta son gelişme, sıradaki durak ve “İlerle” (maç günü “Stada git”) her zaman görünür.
  - Dosyada başlık ve durum, yürüten, “Bilinenler” (kaynağıyla), karar seçenekleri ve kısa geçmiş bulunur. Seçenekler kararın bilinen maliyetini ve belirsizliğini yazar.
  - Yazı büyüklüğü karenin genişliğine orantılıdır (normal ve büyük); uzun içerikte panel kendi içinde kaydırılır. Ses yoktur (2.8A'da kaldırıldı; Aşama 10).
  - **2.8C ile (2026-10-01):** panel içerikleri aşağıdaki “Onaylı ekran düzenleri”ne göre yenilendi: dosya (önceki/sıradaki, sayaçlar, arşiv), kasa ayrı panel, ajanda gün seçici ve bölümleri, telefon Mesajlar/Canlı Skor, dört bölümlü ayarlar, TEST simgesi. Üst şeritte Duraklat düğmesi; duraklatmada ekranın üstünde küçük “Duraklatıldı” etiketi (2.8B).
  - *(İçerik ≤2 kayıtlarında; yeni kariyerde 2.8H ile kalktı)* Dosyada karar seçeneklerinin altında “Görüş iste” düğmesi vardır: kimin inceleyeceği ve görüşün ne zaman geleceği yazılır; görüş “Bilinenler”e kişinin adıyla düşer. Dosyada o konuda verilen sözler, ajandada başkanın başlatabileceği girişimler ve verdiği bütün sözler (açık/tutuldu/bozuldu) listelenir.
  - Gazete yalnız çıkmış bir haber varken masadadır (dördüncü nesne ve düğme, klavye 4); yeni haberde amber yanar. Panelde manşet büyük başlık yazısıyla ve bağlı olduğu konuyla gösterilir.
  - Kayıtlı olaydan doğan izler: masada teşekkür kartı, pencerede karşı tribünün basamaklarında iskele (onarım başladıysa; 2.8J'ye kadar çatıdaydı), duvarda pano sözünün notu. Olay yaşanmadıysa iz de yoktur.
  - Koyu ajanda ekranı (`?ekran=ajanda`) geliştirici görünümü olarak durur.

- Stat içindeki pano, pankart ve skor tabelalarında mevcut Türkçe karakterli 3×5 piksel yazı kullanılır.
- Maç görüntüsünde TV yayın bandı, radar veya oyuncu etiketi bulunmaz. Dürbün maskesi vardır; skor ve dakika stat tabelasından izlenir. Görüntünün dışındaki yazılı radyo/spiker satırı 2.8A'da kaldırıldı. Maçta masadaki telefon (tıkla, “Telefon” düğmesi ya da T) sağda açılır; 2.8I'dan beri odadakiyle aynı telefondur (ana ekran, kişiler, konuşmalar, Canlı Skor). Konuşmalar okunur ama cevap verilmez (“Maç sürerken cevap verilmez…”); açıkken maç durur.
- *(2.8E, tarihsel; 2.8J'de tek ekrana geçti, aşağıdaki “Onaylı maç programı”)* Maç programı (`js/ekran-mac-oncesi.js`, 2.8E) 4:3 oyun karesinde açılır; stat arkada donuk ve hafif karartılmış kalır, önde açık kâğıt tonlu kitapçık durur (Kapak, Kadrolar, Lig sayfaları). Ölçüler oyun karesiyle birlikte değişir; uzun sayfa kendi içinde kayar. “Maça geç” sağ altta, hazırlık durumu solunda yazar.
- Koyu ajanda ekranı (`js/ekran-ajanda.js`; 2.5'ten beri yalnız `?ekran=ajanda`) eski bültenin düzenini izler: aynı 4:3 kare, `cqw` ölçüleri, panel başlıkları ve `STIL.menu` renkleri, kaydırma yok, ana eylem (“İlerle”, maç günü “Stada git”) sağ altta.
  - Zorunluluk etiketlerinde zorunlu kırmızı, ertelenebilir amber, isteğe bağlı soluk renkle gösterilir.
  - Kaçırılacak işler ve engeller ilgili düğmenin yanında kırmızı metinle önceden yazılır; kaçırtan eylem satır içi onay ister.
  - Tutarlar kuruşsuz yazılır, giderler kırmızıdır.
  - Karar işlerinde seçenekler ayrıntı panelinde alt alta listelenir; seçilen seçenek amber kenarla işaretlenir, seçim yapılmadan ana düğme kapalı kalır.
  - Yönetim adayları meslek, güçlü ve zayıf yanlar ve beklenti metniyle tanıtılır; katkı için sayı, seviye ya da çubuk gösterilmez.
  - Sağ kolonda “Meseleler” listesi durum ve “yeni” işaretiyle gösterilir. Bir mesele seçilince ayrıntı panelinde önce yürüten kişi, bekleyen adım ve “Şimdi” satırı, sonra kısa geçmiş görünür. Kayıttan dönüşte ayrıntı panelinde “Kaldığın yer” özeti açılır ve “Devam” ile kapanır. Alt şeritte sıradaki durak ve arada olacaklar yazılır; kayıt yazılamazsa üst şeritte kırmızı bildirilir.
  - Koşula bağlı olayın meselesinde (2.4A) “Bilinenler” listesi başkanın elindeki kanıtları kaynağıyla gösterir (ör. “Muhasebe kayıtları”, “Sponsorluk sözleşmesi”, görüş bildiren kişinin adı). Başkanın bilmediği henüz olmamış dış gelişme ajandada ve önümüzdeki günlerde görünmez. Başlangıcın, paketin ve tohumun geliştirici adları ile dünyanın gizli gerçeği ekrana yazılmaz. Son cevap anı bugün değilse günüyle birlikte yazılır.
- Program ve ajanda başlıklarında piksel görünümlü `Jersey 10`, metinlerde `IBM Plex Mono`; takım ayrımında kırmızı ve lacivert kullanılır. Olası 11 küçük sahada forma renkli ve numaralı işaretlerle gösterilir. Program renkleri `STIL.program`, koyu ajanda renkleri `STIL.menu` içindedir.

### Onaylı hedef: mekân içinde tek konuya odaklanma

**2026-09-30 tasarım kararı; oda (2.5) ve balkon/antrenman (2.7) uygulandı, kişi/görüşme sahneleri henüz yok.** Yukarıdaki “Bugünkü uygulama” maç programını ve geliştirici ajandasını da anlatır. 2026-10-01'de onaylanan ekran yenilemesinin oyun çerçevesi, dosya/ajanda/telefon/ayarlar, test bilgisi ve maç programı kısımları uygulandı (2.8A, 2.8C, 2.8E); maç telefonu 2.8F'dedir. Akış aşağıdaki kurallarla geliştirilir:

- Ortam görünür kalır; görüşme veya karar sırasında odaktaki kişi/konu öne çıkar. Kulübün bütün göstergeleri sürekli aynı ekrana yığılmaz.
- Telefon, ajanda, rapor ve mali ayrıntılar gerektiğinde açılır, kapatıldığında bulunulan ortama dönülür. Aynı mesele başka kanaldan açıldığında geçmişi ve durumu korunur.
- Ekranda meselenin kısa özeti, ilgili kişi, başkandan beklenen karar ve varsa son tarih anlaşılır olur. Ayrıntılar isteğe bağlı açılır; bilgi saklamak için küçük yazı veya belirsiz nesne kullanılmaz.
- Rutin haberler kısa özette toplanır. Önemli mesaj sahneyi sürekli kapatmadan fark edilir; oyuncu mesajı açıp cevaplayabilir, tavsiye isteyebilir veya yetki devredebilir. Aynı anda birden fazla zorunlu karar penceresi açılmaz.
- Görüşmede tavsiye, taahhüt ve karar farklı anlamlarıyla gösterilir. Süre ve bilinen sonuç/çakışmalar eylemden önce anlaşılır olur. Bir mesajın okunması işi bitirmiş gibi sunulmaz.
- Uzun metinler okunabilir yazıyla, açık zemin üzerinde yeterli kontrastla gösterilir. Maçın 640×480 iç çözünürlüğü veya bugünkü menü ölçüleri yeni metin düzenini zorunlu olarak sınırlamaz; pencere boyutu ve yazı büyüklüğü birlikte sınanır.
- Tarih/saat, zamanın durduğu an ve başlatılan ilerleme görünür biçimde anlaşılır. Oyun kuralları [OYUN_TASARIMI §6](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo) içinde tutulur.
- Gün içi kayıt sınırı ve son başarılı kayıt doğru anlatılır. *Tarihsel:* dönüş özeti telefonda açılıyordu (2.4, 2.5); kullanıcı kararıyla 2.8L'de kaldırıldı (2026-10-02).

### Onaylı ekran düzenleri ve etkileşim

**2026-10-02 hedefi; 2.8I ile uygulandı:** 2.8A–2.8F ilk sunumunun üstüne yeni düzen gelir. Açık krem/kâğıt tonları, koyu okunabilir yazı ve ölçülü kulüp renkleri korunur. Tek dosya ve tek telefon konuşması önce görsel taslakla sınanır; bütün ekranlar aynı anda yeniden tasarlanmış sayılmaz. Karar kuralları [OYUN_TASARIMI §2](OYUN_TASARIMI.md#başkanlık-kararında-iki-seçenek) içindedir.

**Oyun çerçevesi:** Oda açılışı, kısa tarih/saat, kayıt durumu, gerekli ana eylem ve Duraklat korunur. Kaldırılmış dış prototip açıklamaları, renk kutuları, çay, şehir stadı, ses ve yazılı maç spikeri geri gelmez. Geliştirici araçları küçük kapalı alandadır; metin yığını oyuncu sahnesine taşmaz.

**Dosya:** Kategori simgesi ve kısa başlık → ilgili kişinin kodla üretilmiş portresi/görevi → yaklaşık iki kısa cümle teklif/konu → gerekiyorsa tutar, süre, taahhüt ve kritik risk → altta yan yana iki büyük cevap. Metin boyu içerikle sınanır; anlaşılması gereken bedel sırf kısa olsun diye çıkarılmaz. Geçmiş/ek belge ayrı açılır; ilk görünüm olay günlüğü değildir. İkonlar metne eşlik eder; yalnız renk/ikon anlam taşımaz, sol/sağ sürekli doğru/yanlış veya yeşil/kırmızı olarak kodlanmaz. Fare ve klavye temel kontroldür; kaydırma zorunlu değildir. Büyük yazıda iki cevap ve kritik bilgi okunabilir kalır.

Alt kenarda önceki/sıradaki dosya ve kısa açık/cevap bekleyen/takipte sayaçları bulunur; arşiv ayrıdır. Sonuç aynı konuda kısa görünür; sıradaki dosyaya oyuncu geçer. Hazır danışman görüşü kısa ve kaynaklı olabilir; yeni çalışma isteme üçüncü bir karar düğmesine dönüşmez.

**Ajanda:** Hafif defter görünümü, küçük haftalık gün şeridi, seçili günün kısa saat–simge–konu satırları. Tek kayda dokununca kişi, yer, süre ve durum açılır. Yaklaşan gerçek son tarihler küçük hatırlatmadır; önemli tarih kaydırmada kaybolmaz. Finans tablosu, bütün söz/geçmiş ve uzun görev açıklamaları burada bulunmaz. Ödeme tarihi kısa hatırlatma olarak dosyaya bağlanır. Tamamlanan kaydın işareti ve bugünün vurgusu canlılık verir; süs animasyonu gerekmez. Boş gün boş kalır. Girişim başlatma ilgili kişiye/konuya götüren küçük bir erişimdir, yeni dashboard değildir.

**Telefon ana ekranı:** Telefon nesnesine tıklayınca açık tonlu bir cihaz ekranı açılır; saat ve yalnız iki büyük uygulama simgesi: Mesajlar, Canlı Skor. Masaüstünde okumaya uygun boyut seçilir; çok dar gerçek telefon ölçeğine zorlanmaz. Uygulama içindeki geri dönüş ve ana ekran erişimi anlaşılırdır. Dosyadan geri dönünce aynı konuşma/okuma konumu korunur.

**Mesajlar:** iPhone'daki tanıdık kişi listesi yaklaşımı kullanılır: portre/isim, son mesaj önizlemesi, zaman ve okunmamış işareti; sonra tek konuşma. Gelen/gönderilen baloncuklar ayrılır. Aynı kişi birden fazla konuyu konuşabilir, mesele bağlantısı kaybolmaz. Aktif kararın iki cevabı altta görünür; seçim gönderilmiş cevap olarak kalır. Bilgi/sonuç mesajına gereksiz cevap düğmesi üretilmez. Dosya ek bilgi içindir, uygun cevabı vermenin zorunlu geçidi değildir. Yeni bildirim açık konuşmayı değiştirmez. Ayrı okundu ve cevap bekliyor durumları vardır. Kurgusal kişiler/uygulama kimliği ve mevcut kodla üretilen görseller kullanılır; gerçek marka arayüzü birebir kopyalanmaz. Referans: [Apple'ın konuşma listesi ve mesaj akışı](https://support.apple.com/guide/iphone/send-and-reply-to-messages-iph82fb73ba3/ios).

**Canlı Skor:** Günün karşılaşmaları kısa arma/takım–skor–dakika/durum satırlarıyla açılır; seçilen karşılaşmanın ayrıntısı tek görünüm olur. Kendi maçının gerçek şut, isabet, topa sahip olma, korner ve kart verisi okunur. Maç dışı saatlerde gerçek sonraki karşılaşma veya sakin boş durum vardır. Üretilmeyen değer/simüle edilmeyen maç uydurulmaz; oyuncu ekranına motor açıklamaları dökülmez, geliştirme ayrıntısı test alanında kalır. Diğer maçların veri bağlantısı 3.8'dir; maç içi kariyer cevabının sınırı teknik plandadır. Telefon açıkken maç durur, kapanış elle duraklatmayı kaldırmaz.

**Ayarlar:** Açık tonlarda kısa, tutarlı satırlar; Okuma, Kayıt, Geliştirici gibi gerekli gruplar. Hareket azaltma seçeneği ve boş kalan hareket kategorisi kalkar; sakin hareket bütün oyunun standardıdır (§6). Yazı büyüklüğü, gerçek kayıt durumu ve iki adımlı Yeni kariyer anlaşılırdır. Ses bölümü yoktur.

**Test bilgisi:** Test ayarı açıkken küçük TEST simgesi; üzerine gelince, odaklanınca veya tıklayınca kısa bilgi kutusu. Gizli değerler normal metne eklenmez; yayından önce test görünümü kaldırılır. Görüntü kaydı bugün yalnız 3B sahneyi alır; panelleri de içerdiği iddia edilmez. Not almak için genel Duraklat bütün hareketi dondurur.

**Bugünkü uygulama (2.8I, 2026-10-02):** Dosya: kategori ve başlık, ilgili kişinin 16×16 piksel portresi ve görevi, kısa konu, iki yan yana büyük cevap (altında süre ya da “zaman almaz” ve bilinen sonuç), gerekiyorsa “Son cevap” ve cevapsız kalırsa olacak olan; seçilen cevap “Onayla” ile ikinci adımda uygulanır. Hazır görüş “Bilinenler”de kaynağıyla durur; geçmiş ayrı bölümdedir. Telefon: ana ekranda saat ve Mesajlar/Canlı Skor; kişi listesinde portre, rol, son mesaj, saat, okunmamış sayısı ve kırmızı “CEVAP BEKLİYOR”; konuşmada gelen/giden baloncuklar, altta aynı iki cevaplı kart ve “Dosyayı aç”; dosyadan dönüş aynı konuşmaya olur. Ajanda: gün şeridi ve saat–simge–konu satırları, tek kayıt ayrıntısı, telefondaki kişilere götüren küçük bağlantı; kasa/söz/girişim bölümleri yoktur (kasa mali dosyadan ve saymanın konuşmasından açılır). Ayarlar: Okuma, Kayıt, Geliştirici. Görsel taslak: `prototipler/6-iki-cevap-dosya-telefon.html`.

**Okunabilirlik ve karakter:** Uzun metinde Türkçe karakterleri iyi gösteren orantılı gövde yazısı, retro başlıklarda ölçülü vurgu. Tanınır portre, mesaj baloncuğu, tamamlandı işareti ve küçük gerçek geçmiş izleri görsel keyif sağlar. Kamera sallantısı, kart savurma, zorunlu yazı yazılıyor beklemesi ve tekrar eden süs hareketleri eklenmez. Dinamik görünüm güncel bilgi ve değişen durumdan gelir. Normal/büyük yazı, klavye, dar pencere, boş durum ve iki cevabın okunması sınanır.

**Bugünkü uygulama (2.8M, kullanıcı kararı 2026-10-02):** Dosya ve ajanda sağ panel değildir; odanın ortasında (sol menü görünür kalır) büyük nesne olarak açılır, oda hafif kararır, perdeye tıklamak kapatır. *Dosya — masada açık karton dosya:* kırmızı kapak; üst kenarda açık konuların sekmeleri (kategori simgesi, kısa başlık, cevap bekleyende kırmızı nokta), sağda Arşiv sekmesi ve Kapat; sol sayfada kategori, büyük başlık, hafif eğik durum damgası (CEVAP BEKLİYOR / TAKİPTE / KAPANDI), yürüten ve son tarih, ataşlı küçük kâğıtlarda kanıtlar (kaynağıyla), sözler ve açılır geçmiş; sağ sayfada ilgili kişinin portresi ve görevi, alıntı biçiminde konu, iki büyük cevap ve “Onayla”, karardan sonra yeşil kenarlı sonuç. *Ajanda — iki sayfalı açık defter:* koyu kapak, spiral sırt; sol sayfada ay ve hafta, 7 gün satırı (bugün kırmızı el çizimi daire, geçmiş günler soluk; bekleyen randevu sayısı, son tarih “!”, ödeme ₺, kırmızı “MAÇ” etiketi), hafta okları (en çok iki hafta ileri), altta yaklaşan son tarihler; sağ sayfada seçili günün 08–22 saat çizgileri, saat aralığına yerleşmiş mürekkep renginde eğik yazılı randevu blokları (zorunluda kırmızı kenar, çakışanlar yan yana, tamamlananın üstü çizili), şimdi çizgisi, tıklanan kaydın kartı (süre, kişi, durum, açıklama, Katıl/Ertele ya da “Dosyada karar ver”). Boş gün “Boş gün.” yazar. Renkler `STIL.kagit.dosya`, `STIL.kagit.defter`. Taslak: `prototipler/7-dosya-defter.html`. Önceki/sıradaki dosya alt şeridi kalktı; [ ve ] tuşları sürer.

### Onaylı maç programı

**2026-10-02 hedefi; 2.8J ile uygulandı:** Üç sayfalı kitapçık tek kompakt açık ekranla değiştirilir. Armalar ve takım adları, lig/hafta/saat, kısa sıra/form karşılaştırması ve tek cümle bağlam yeterlidir. Stat resmi, ayrı Kapak/Kadrolar/Lig sayfaları ve yoğun tablolar kaldırılır. Kesin görsel kompozisyon uygulayıcıya açıktır; ekran başkanın kadro seçtiği izlenimi vermez.

Altta dolan çubuk **Maç öncesi hazırlık** süresini gösterir: en az 10 etkin saniye, gerçek kaynak hazırlığından ayrı koşuldur. Sahte dosya yükleme yüzdesi değildir. Süre dolup kaynaklar da hazır olunca Maça geç etkinleşir; oyuncu kendi geçer. Kaynak bekleniyorsa bu kısa ve doğru gösterilir. Duraklat çubuğu dondurur; sayfa arka plana gidip geldiğinde atlama olmaz. Bekleme kariyer/maç/tören zamanını ilerletmez. *Bugün (2.8J):* üst satırda lig, hafta, stat ve hakem; ortada iki arma ve saat; altında sıra/puan/averaj ve son beş maç; tek cümle bağlam; altta çubuk ve durum yazısı (“Takımlar ısınıyor…”, duraklatmada “Duraklatıldı · hazırlık bekliyor”), sağda Maça geç.

**Bugünkü uygulama (2.8N, kullanıcı kararı 2026-10-02):** Gereksiz bilgi yoktur: üst satırda lig · hafta · gün ve saat · stat; iki takım sütununda arma, ad, sıra ve puan; “İlk 11” başlığı altında dizilişe göre küçük sahada forma renkli numaralar ve adlar (kaptan “K”), altında “Teknik direktör: …”; “Son 5 maç” satırları (hafta, iç/dış saha, rakip, skor, renkli G/B/M). Ortada büyük başlama saati. Hakem, averaj, bağlam ve golcü cümlesi kalktı. Hazırlık çubuğu ve “Maça geç” aynıdır.

Tarihsel referanslar: [SEGA'nın takım kâğıdı ve maç öncesi görüşme açıklaması](https://sega.prezly.com/football-manager-2021-new-headline-features-revealed), [EA'nın maç girişlerine yaklaşımı](https://www.ea.com/games/ea-sports-fc/fc-25/news/fc-25-community-update). Referanslar önceki araştırma kaydıdır; güncel tek ekran kararının yerine geçmez.

### Koşula bağlı olayların sunumu

**Onaylı hedef (2026-09-30; ilk örnek ajanda ve oda dosyalarında kısmen uygulandı, yukarıdaki “Bugünkü uygulama”; 2.8C ilk tek konu düzenini kurdu; 2026-10-02 yenilemesi 2.8H–2.8K ile uygulandı):** Aynı olay ailesi farklı kariyerlerde farklı koşullarla sunulabilir. Ekran şablonu yeniden kullanılabilir; yalnız kişi adı, renk veya tutar değiştirerek içerik çeşitliliği sağlandığı varsayılmaz. Mevcut koşullar, bilgi ve seçenekler ortak mesele verisinden gelir.

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
- Temel okunabilirlik, yazı büyüklüğü ve hareket ilk yaşayan kulüp bölümünde sınanır (dönüş özeti 2.8L'de kaldırıldı). **2026-10-01 kararı:** Mevcut sesler ve ayarlar 2.8A'da kaldırıldı; ana oyun/ekranlar tamamlanıp Aşama 10'a gelinene kadar ses geliştirilmez. Erken ortam sesi kabul koşulu kaldırılmıştır. 2.8C'nin hareket ayarı 2.8J'de kaldırıldı; sakin hareket standarttır, doğal kalkış ve kısa yürüyüş korunur.
- Takvim dururken gerekli ortam hareketleri devam edebilir; yeni standartta süs hareketleri yoktur, genel Duraklat gerekli hareketleri de durdurur. Maç telefonu açıkken maç ve maç ortamı donar. Antrenman kararında bilgi ve kariyer zamanı sabittir; durma anı ekranda doğru gösterilir.
- Bildirimler sürekli baskı üretmez. Sakin kulüp anları ve iyi yönetimin sağladığı rahatlık sunumda da hissedilir. Ses tasarımı Aşama 10'da bu ritme uygun olarak yapılır.
