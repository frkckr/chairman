# Chairman — oyun tasarımı

Son güncelleme: 2026-10-30 (RN kullanıcı notları: §2 telefonda Bekleyenler kalktı, §11 yürüyüş; karar 69). Önceki: 2026-10-30 (R6 zincirler ilk dilim: §2 ikinci teklif ve sponsor zinciri, §9 maaşın piyasa algısı, §6 gazetede rakipler; karar 67). Önceki: 2026-10-30 (R5 balkon: §6 antrenman kâğıdı, sahadakiler kariyerin kadrosu ve hocanın programına göre gruplar, TEST “her saat antrenman”; karar 66). Önceki: 2026-10-29 (R4 transfer: §2 Transfer masası ve transfer alımı zincirinin bugünkü uygulaması — şablon, pazarlık kartı, kıvrımlar, serbest oyuncular, mekânlar, dar transfer; karar 65). Önceki: 2026-10-29 (R3 Canlı Skor: §2 ekran tablosunda tarafsız lig uygulaması — hafta görünümü, maç, takım ve oyuncu sayfası; §9 kamuya açık bilgi; kulüp armaları TEST; karar 64). Önceki: 2026-10-29 (R2 eki: §2 Reigns gibi tek kart — cevaplar kaydırınca; telefonun iş paneli tek iş ve “Yeni konu aç”; karar 62). Önceki: 2026-10-29 (R2 telefon: §2 ekran tablosunda iki sütunlu telefon ve Bekleyenler, §8 görüşme saatleri 11:00 ve 17:30, oyuncu sorusu ve tek bekleme satırı; karar 61). Önceki: 2026-10-29 (§1 ilkelerin uygulama yönü: sakin günün karşılığı, başarı ve büyüme, kıtlık, başkanın girişimi, iki katmanlı içerik ve pilot aileler, futbol ritmi, süreç kavramı, oynama ölçüleri; kullanıcı onayı, karar 60; yalnız belge). Önceki: 2026-10-29 (başkanlık deneyiminin temel ilkeleri ve oynama değerlendirmesi; kullanıcı onayı, karar 59; yalnız belge). Önceki: 2026-10-27 (S: sezonun içi — §2 ekran tablosu: Dosya'da Kadro, Canlı Skor'un üç sekmesi, günlük gazete; §6 günlük gazete Y0'ın “haftalık, Pazartesi” kararının yerine, kanal aciliyet sırası, antrenman programı ve balkon sinyalleri; §8 rotasyon; §9 kondisyon, form, gelişim ve Kadro sekmesi; §13; YOL_HARITASI karar 54; uygulandı, TEST değerler ve metinler). Önceki: 2026-10-26 gece (Y0: yönetim omurgası — §2 beş katman, pazarlık kuralı ve dosya şablonları, §4 personel ve genel kurul, §6 gün ve hafta ritmi, §9 kaynak güvenilirliği ve Kadro sekmesi, §10 kişi modeli ve kapı, §11 maç olayından dosyaya, §13; kaynak kullanıcının sistem tasarım taslağı, YOL_HARITASI kararları 51–52; hepsi hedef, bugünkü uygulama değişmedi). Önceki: 2026-10-24 gece (G2: §7 maaş, ay başı, bilet ve nakit ufku; §8 sözleşme yenileme, gelen teklif ve hocanın transfer isteği — TEST iskelet; G1: §11 hükmen ve sezon sonu). Önceki: 2026-10-24 (F3 ve F6-a: §2 maçın okunması, §8 hoca, hoca değişimi ve P12 TEST taslağı). Önceki: 2026-10-19 gece (Z2, tempo B: duran topların sahnesi ve duruşta 2 kat maç saati — §11). Önceki: 2026-10-12 (U1: maç 20 dakika, izleme hızı ve önemli anlarda normal hız — §1, §6, §11, §13). Bu belge hedef oyunu tanımlar; burada anlatılan sistemlerin çoğu henüz uygulanmamıştır. Çalışan özellikler ve geliştirme sırası [yol haritasındadır](YOL_HARITASI.md). Uygulama yaklaşımı [teknik plandadır](TEKNIK_PLAN.md). **2026-10-02 iki seçenekli karar ve sade ekran yenilemesi 2.8G–2.8K ile uygulandı (TEST içerik; ilgili bölümlerdeki “Bugünkü uygulama” notları).**

## 1. Amaç ve kararların durumu

Oyuncu, bir futbol kulübünün geleceğine karar verir; sonra tribünde oturup kararlarının sonucunu yaşar. Başkanlık hissi; insanlarla ilişkilerden, mali sorumluluktan, verilen sözlerden, maç heyecanından ve yıllar boyunca biriken geçmişten gelir.

- **Kesin karar:** Kullanıcının belirlediği ürün yönü; aşağıdaki temel çerçeve.
- **Onaylı tasarım yaklaşımı:** Bu yönü uygulamak için kabul edilen plan. Ayrıntılı sayılar ve denge değerleri testlerle belirlenecek.
- **Açık karar:** Henüz seçilmemiş ayrıntı. Belgenin sonundaki tabloda takip edilir; varsayım kesin karar gibi uygulanmaz.
- **Örnek:** Bir sistemin davranışını anlatır; yazılmış veya tamamlanmış oyun içeriği değildir.

Belgeler ana çerçeveyi ve kabul koşullarını belirler. Claude veya başka uygulayıcı; bu sınırlar içinde ekran kompozisyonunu, karakterleri, kısa metinleri, uygun iki yaklaşımı, küçük uygulama adımlarını ve teknik çözümü geliştirebilir. Örnek cevaplar nihai senaryo, önerilen adetler kota değildir. Kesin kullanıcı kararını değiştiren öneri ayrıca görünür kılınır; rutin tasarım/uygulama tercihi için her ayrıntıda yeni onay gerekmez.

### Kesin çerçeve

- Bilgisayarda, Steam üzerinden satılması hedeflenen kulüp başkanlığı simülasyonu.
- Türkiye'de geçer; ilk içerik Türkçe ve Türkçe isimlerle hazırlanır. Kulüpler, oyuncular, yöneticiler, medya kişileri ve diğer futbol karakterleri kurgusaldır. Başka dillere uyarlanabilir yapı kurulur.
- Tek kulüple uzun kariyer. Mevcut kulüp adı Demirkapı SK'dır; nihai isim ve şehir ayrıca belirlenecek.
- Başkan adayı şehirde büyümüş, çocukluğundan beri kulübü tutan, iş hayatında başarılı ve maddi durumu iyi biridir. Sınırsız serveti yoktur. Şirket yönetimi oyunun kapsamına girmez.
- Taraftar olarak başlayan hikâye; adaylık, yönetim kurma, vaatler, kampanya ve seçimle ilerler.
- Seçimler yaklaşık dört–beş yılda bir yenilenir; kesin dönem süresi açıktır. Tek seçim kaybı kariyeri bitirmez. Görev dışında takip ve yeniden adaylık dönemi vardır.
- Türkiye'deki oyun düzeninde 3. Lig → 2. Lig → 1. Lig ilerlemesi ve küme düşme bulunur. 1. Lig en üst oyun kademesidir. Bu üç kademe ve Avrupa kupaları dışındaki ligleri ayrıntılı oynatmak hedeflenmez.
- Futbolcuların ve teknik direktörlerin yetenek ve potansiyel puanları kullanıcıya gösterilmez.
- Oyuncular, personel ve başkan yaşlanır. Kuşaklar değişir; emeklilik, ayrılış ve kayıplar dünya geçmişine işlenir.
- Kariyer ağır tempoludur. Yoğun bir oyun günü yaklaşık bir saat, bazı günler daha uzun sürebilir; sakin günler kısa geçebilir. Hızlıca sezon tüketmek hedeflenmez.
- Maç deneyimi için yaklaşık 10–15 dakika hedeflenir. Törenler ve toplam maç günü süresi ayrıca ölçülür; bunlar birbirine karıştırılmaz. **2026-10-12 (kullanıcı kararı, U1):** motorun maçı 20 gerçek dakikadır (eskiden 10; olayların sıkıştırılması yarıya iner). Oyuncu maçı ×1, ×2 ya da ×4 izler; önemli anlarda (gol, şut, faul ve kart, sakatlık, korner ve tehlikeli serbest vuruş, ofsayt) izleme birkaç saniye önceden kendiliğinden normal hıza iner, an geçince seçilen hıza döner. Ölçü (santradan maç sonuna, devre arası hariç): ×1 ~22,5, ×2 ~13, ×4 ~8,5 dakika — 10–15 dakikalık hedef hız seçimiyle tutar. Ayrıntı [§11](#11-maçlar-mekânlar-ve-kulübün-büyümesi).
- Başarı finali, **Avrupa'nın en büyük kulüp kupasını kazanmak ve ardından başkanlığı bırakmaktır**. Daha küçük bir kupa bu finali tetiklemez.
- Kupasız kariyer sonları mümkündür. Sabit sezon sayısı sınırı konmaz; yaş, görev ve kariyer koşulları doğal bir sınır oluşturabilir. Kesin sonlandırma şartları açıktır.

### Başkanlık deneyiminin temel ilkeleri

**Onaylı tasarım ilkeleri (2026-10-29, kullanıcı; YOL_HARITASI karar 59).** Senaryolar, başkanın insanlarla, kaynaklarla ve zamanla kurduğu ilişkinin içinde yaşanır. Oyuncunun kulübü merak etmesi, kendi yönetiminin farkını görmesi ve yıllar içinde bir geçmişe sahip olması ana deneyimdir. Bu bölüm hedef deneyimi ve değerlendirme ölçüsünü tanımlar; sistemlerin veya içeriğin bugün uygulanmış olduğu anlamına gelmez.

1. **Gündelik başkanlık kendi başına merak taşır.** Hocayla konuşmak, raporu anlamak, antrenmanı izlemek, ekibe iş devretmek ve yaklaşan maçı beklemek büyük bir olay açılmadığında da anlamlıdır. Bekleyiş gerçek bir teklif, çalışma, randevu veya beklenen habere dayanır. Sakin günler kısa geçebilir; boş bekletme, zorunlu günlük kontrol ve sürekli yeni kart gereksinimi oluşturulmaz.
2. **Farklı başkanlık yaklaşımlarının karşılığı vardır.** Güvenilen küçük ekiple çalışma, uzmanlara yetki verme, mali güvenliği veya büyümeyi önceleme gibi yaklaşımlar mevcut şartlarla birlikte insanların davranışını, kaynakları ve fırsatları etkiler. Tek ezber cevap dizisi bütün kariyerleri aynı başarıya götürmez; her yaklaşım da aynı sonucu vermez. Üslup yaşanmış kararlardan oluşur, oyuncu zamanla değişebilir; başlangıçta kişilik sınıfı veya görünür kişilik puanı gerekmez.
3. **Karar, devir ve bekleyiş kulüpte yaşanan iz bırakır.** Sonuçlar gerçek kayıtlara bağlı olarak insanların davranışında, bilgiye erişimde, bütçede, yeni imkânlarda ve uygun olduğunda mekânda görülür. Bir çalışanın haberi erken getirmesi veya tamamlanan bir işin kullanılması, geçmiş kararı anlamlı kılabilir. Bazı karşılıklar gecikir; aradaki temaslar yalnız gerçek gelişmeyi taşır. Aynı sonuç kanallarda tekrar karar yüküne dönüşmez; küçük bir anın büyük mekanik ödülü olması gerekmez.
4. **İnsanlar krizlerin dışında da tanınır.** Kişiler olağan görüşmelerde, küçük ortak işlerde, iyi günlerde ve meşru anlaşmazlıklarda kendi gündemleriyle yer alır. Yalnız talep veya sorun getirmek için görünmezler. Oyuncu bir ayrılığı önemsemeden önce o insanla geçmiş kurabilmelidir. Eski çalışanla bağ veya tanıdık birinin hayatındaki değişim sürekli yeni iş istemeden de yaşayabilir.
5. **Başarının, rahatlamanın ve birlikte sevinmenin yeri vardır.** İyi yönetim daha az acil takip, daha fazla hareket alanı, tamamlanan işler ve hak edilmiş takdir sağlayabilir. Oyuncuya bunları yaşama fırsatı verilir. Kutlamanın arkasından zorunlu kriz gelmez; sakinlik ve olumlu anlar görev, moral puanı veya günlük ödül toplama işine çevrilmez. Stres, bekleyiş, mutluluk ve kayıp kariyerin farklı dönemlerinde doğal karşılık bulur; sabit duygu veya olay kotası konmaz.
6. **Belirsizlik merak yaratır, nedenler anlaşılabilir kalır.** İnsanların değişen amaçları, eksik bilgi ve dünyada gerçekten oluşan dış gelişmeler sürpriz yaratabilir. Oyuncu bilinen bedeli ve belirsiz kalan kısmı ayırt edebilir; araştırma ve iyi ekip bazı riskleri erken görünür kılabilir. Sonradan öğrenilen bilgi gerçek nedene dayanır, olumsuz sonuca gerekçe uydurulmaz. Her şokun önceden kestirilmesi veya önlenmesi şart değildir; iyi hazırlık da mutlak başarı garantisi vermez.
7. **Futbol, başkanlık kararlarının güvenilir dayanağıdır.** Başkanın sağladığı kaynak ve çalışma şartları, hocanın ve kadronun imkânlarını zaman içinde etkiler. Maç, gözlem ve kişilerden gelen yorum bu bağı okumaya yardım eder; gizli yetenek puanı açılmaz. Kadro, taktik, antrenman ve maç içi seçimler hocanındır. Futbolun belirsizliği korunur; iyi yönetim her maçı kazandırmaz, senaryo için skor zorlanmaz.
8. **Oyuncu kendi uzun vadeli amacını kurabilir.** Borcu azaltmak, bir hocayla yol almak, verdiği sözü tutmak veya yarım işi bitirmek kariyere kişisel anlam katabilir. Bunlar zorunlu görev listesine dönüşmeden gerçek geçmiş ve sonuçlarla hatırlanır. Mevcut başarı finali korunur. Görev kaybında ilişkiler ve başlamış işler dünyada sürer; oyuncu mevcut yetkisiyle devam eder, yeni yönetimin başarısızlığı veya geri dönüş garanti edilmez.

**Oynama değerlendirmesi:** bu ilkeler tek karta yüklenen zorunlu alanlar değildir; mevcut uygulama sırası içinde temsilî sakin ve yoğun dönemlere, farklı yaklaşımlara ve onların sonuçlarına birlikte bakılır. İçerik sayısı veya teorik dal sayısı tek başına yeterlilik kanıtı sayılmaz:

- Önemli olay açılmayan bir haftada kulübü merak etmenin ve ertesi güne geçmenin anlaşılır bir nedeni var mı?
- Oyuncu geçmişteki bir kararın, yetki devrinin veya hazırlığın sonraki hayattaki izini görebiliyor mu?
- Farklı makul yönetim yaklaşımları insanlar, işler ve imkânlarda anlamlı fark yaratıyor mu?
- En azından bazı insanlar sorun getirmedikleri zaman da tanınıyor ve önemseniyor mu?
- Başarı, rahatlama ve tamamlanan iş hissediliyor mu; tersliklerin bilinen nedeni ile kalan belirsizlik ayırt edilebiliyor mu?
- Oyuncunun kendi sözüne, insanlarına veya kulübün geleceğine bağlı uzun vadeli bir devam nedeni oluşuyor mu?

Bu ölçüler yeni sistemlerin tamamını ilk örneğe yüklemez ve geliştirme sırasını değiştirmez. Senaryo yazımındaki karşılığı [olay kütüphanesi §5–6 ve §9](OLAY_KUTUPHANESI.md#5-tasarım-sınırlarına-başvuru), teknik uygulama ve kayıt sözleşmeleri kendi ana belgelerindedir.

### İlkelerin uygulama yönü

**Onaylı yön (2026-10-29, kullanıcı: “evet işle”; YOL_HARITASI karar 60; Claude'un değerlendirmesinden).** Yukarıdaki ilkeler yazıyla değil mekanikle kurulur. Aşağıdakiler hedeftir, bugün uygulanmış değildir; ilgili R turları planlanırken okunur.

1. **Sakin günün karşılığı bilgi ve ilişkidir.** Olaysız bir haftada yapılan görüşme, balkondan izleme, rapor okuma ya da küçük ortak iş sonraki bir kararı daha iyi verdirir: bir sorunu önceden gösterir, bir fırsatı erken haber verir, bir insanı tanıtır. “Merak etmek işe yarıyor” hissi sakin günü boş bekleyiş olmaktan çıkarır. Bilgi yine kaynaklı ve tarihlidir; gizli değer açılmaz.
2. **Başarı görünür birikim ve yeni hedef üretir.** İyi yönetimin karşılığı daha az acil iş, daha iyi teklifler ve büyüme için boş alandır; kutlama kartı tek başına yetmez. O alanı başkanın kendi projeleri doldurur (stat, altyapı, gelir, insanlar). Kariyerin doğal yayı: ayakta kal, toparla, kur, daha yükseğe bak. Rahat dönem boş kalmaz, büyüme dönemine açılır.
3. **Gerilim kıtlıktan doğar, kotadan değil.** Para (özellikle başta dar), dikkat (tek odak, aynı anda tek iş) ve zaman gerçek kıtlıklardır. Rahatlık bunlarla uğraşarak kazanılınca anlam taşır. Kriz ya da olay kotası konmaz.
4. **Başkanın başlattığı işler birinci sınıftır.** Hikâyelerin önemli bir kısmı oyuncuya gelmez, oyuncunun girişiminden doğar; yönetimi tattırmanın en güçlü yolu budur. Dosya şablonları (R4, R6) başkanın açtığı işi de taşıyacak biçimde tasarlanır.
5. **İçerik iki katmanlıdır.** Gündelik doku gerçek veriden okuyan sistemlerden gelir (gazete, mali rapor, hocanın ve çalışanların yorumları, balkon sinyalleri, maç okuması): ucuz, tükenmez ve tutarlıdır; “hayat gibi” hissin omurgası bunlardır. Elle yazılan aileler az ve derin olur: önce üç pilot aile (P01 ödeme takvimi, P12 hocaya sabır, P07 yetiştirilen oyuncuya teklif) olağan, olumlu ve zor yollarıyla tam yazılır, sonra genişlenir. Pilot ailelerin metni kullanıcınındır.
6. **Futbol oyunun kalp atışıdır.** Haftanın ritmi maç etrafında kurulur: hazırlık, maç, sonrası. Senaryoların çoğu bu ritme takılır (maç öncesi gerginlik, maç sonrası tepkiler, bir oyuncunun yükselişi). Maç izlemek ve antrenman “gözlemle öğren” döngüsünün parçasıdır; yeni ekranlar bu döngüye bilgi ya da eylem yeri olarak eklenir, dağınık uygulamalar olarak değil.
7. **Uzun hikâye için küçük bir süreç kavramı gerekir.** Haftalarca uyuyup koşul gelince uyanan ve geçmişini taşıyan hikâye bugünkü dosya yapısına sığmıyor ([TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi) açık teknik soru). R4'ün dosya şablonu motoru tasarlanırken bu küçük kayıt birlikte düşünülür; genel hikâye motoru kurulmaz.
8. **Ölçü belge değil oynanıştır.** İlk oynama denemesi (R4 sonu) şunlara bakar: haftada kaç karar çıktığı, kaç haftada hiç karar çıkmadığı, bir haftanın gerçek süresi, olumlu ve olumsuz sonuçların dağılımı ve başkanın kendi başlattığı işlerin payı. Aralıklar R4 planında yazılır; `sezon-deneme` bunların bir kısmını sayar. Kota ya da tavan değil, ölçüdür.

## 2. Başkanın rolü ve ana döngü

Başkan teknik direktörü ve yönetimini seçer, bütçe ve öncelikleri belirler, önemli anlaşmaları yapar, kulübü temsil eder ve sonuçların sorumluluğunu taşır. Teknik direktör kadro, taktik, antrenman ve maç içi futbol kararlarından sorumludur.

Başkan hocayla oyuncu tercihleri hakkında görüşebilir. Müdahale, hocanın otoritesi ve ilişki üzerinde sonuç doğurur; günlük oyun bir teknik direktör kadro ekranına dönüşmez. Rutin araştırma ve pazarlıklar, bütçe ve yetki sınırlarıyla ekibe bırakılabilir.

**Maç başkanın bilgi kaynağıdır (2026-10-22, kullanıcı).** Başkan maça dokunmaz; maçı izler, okur ve yönetim hamlesi çıkarır: hocanın tarzı kadroya uyuyor mu, kadroda hangi profil eksik, kötü sonuç şanssızlık mı beceri farkı mı, sabır mı değişiklik mi. Bunun için tarz ve uyum, oyuncu kalitesi, şans ile beceri farkı sahada ayırt edilebilir olmalıdır. Futbolun belirsizliği korunur: her plan tutmayabilir, kalite ortalamayı kaydırır ama garanti vermez (motordaki karşılığı [FUTBOL_KUTUPHANESI §1](FUTBOL_KUTUPHANESI.md#1-i̇lkeler) madde 9). Maçın okunmasına yardım eden gözlem notu, ekibin yorumu ve istatistik başkanlık programının F3 turunda tasarlanır; beklenen gol maç sonrası Canlı Skor'da sayı olarak görünür (kullanıcı kararı, 2026-10-23), ekibin yorumu ve rapor şablonları Claude'un TEST taslağıdır, kullanıcı metinleri değiştirir.

**Bugünkü uygulama (F3, 2026-10-24; TEST metinler, karar 35):** maçtan sonra üç okuma vardır ve hiçbiri yetenek puanı göstermez. (1) Odada Canlı Skor'da son maçın satırına dokununca istatistik (R3'ten beri maç sayfasının İstatistikler bölümü): şut, isabet, **beklenen gol** (motorun şut başına konum xG'si; karar 34), topa sahip olma, pas isabeti, korner, faul, kartlar, ofsayt; maç sonu kartında da beklenen gol ve şut. (2) Hocanın kısa yorumu — H2'den (2026-10-26) beri kendiliğinden gelmez, başkan telefonda “Maçı nasıl gördün?” diye sorarsa birkaç saat sonra gelir: sonuç ve şans (pozisyonlarda öndeyken kaybetmek şanssızlık, gerideyken kazanmak şans, sonuç pozisyonlarla aynı yöndeyse haklı), takımın tarzını oynayıp oynamadığı (uzun pas payı hocanın tarzının bandında mı) ve öne çıkan oyuncu. Hoca kendi sesiyle yazar: ısrarcı hoca açık yenilgiyi de şansa bağlayabilir; başkan bunu beklenen golle karşılaştırır. (3) Başkanın deftere düşen notu: maç gününün sayfasında skor, beklenen gol, şut, topa sahip olma ve sayıların ne dediği. Metinler kayda yazılmaz, kayıttaki veriden okunur ([TEKNIK_PLAN §7](TEKNIK_PLAN.md#7-gerçek-özellik-ile-bilgi-arasındaki-sınır)).

### Yaşayan kulüp ve devam eden meseleler

**Onaylı tasarım yaklaşımı (2026-09-30):** Günlük başkanlık, karakterin bulunduğu mekânda ve o an ilgilendiği konuya odaklanarak yaşanır. Başkanın odası, görüşme alanı, antrenman kenarı ve stat farklı durumlara ev sahipliği yapar. Telefon, ajanda, raporlar ve mali bilgiler gerektiğinde açılır; bütün kulüp göstergeleri sürekli aynı ekranda tutulmaz. Ajanda, işleri ve zamanı takip etme görevini sürdürür. Açık renkli sunumun kuralları [stil rehberindedir](STIL_REHBERI.md#7-arayüz-ve-bilgi).

Hedef ana döngü:

> Bulunduğun yerde gündemi öğren → bir meseleye odaklan veya girişim başlat → görüş, tavsiye al, karar ver veya yetki devret → gelişmeleri kulüpte yaşa → maçı izle → sonuçlar, ilişkiler ve yeni gündemle devam et.

Bir sponsorluk, transfer veya yatırım; günlere yayılan tek bir mesele olarak takip edilir. Telefon mesajı, toplantı, ekip çalışması ve sonuç aynı meselenin geçmişine bağlanır. Mesaj gelmesi aynı işi ayrı bir görev olarak çoğaltmaz.

Meselede oyuncunun anlayacağı bilgiler:

- Şu an ne olduğu ve bilginin kaynağı.
- Kimlerin ilgili olduğu ve işi kimin yürüttüğü.
- Başkanın kararının gerekip gerekmediği.
- Son tarih, verilmiş sözler ve geçerli yetki sınırları.
- Sonraki adım veya beklenen haber; zamanı bilinmiyorsa bu belirsizlik.
- Önceki kararlar ve bunların bilinen sonuçları.

Bekleyen veya ekibe devredilmiş konular arka planda takip edilir. Rutin gelişmeler kısa özette toplanır; yeni karar gerektiren haber öne çıkar. Başkan görüşme ayarlama, sponsor arayışı açma, araştırma isteme ve yatırım ihtiyacını inceletme gibi girişimler başlatabilir. Bu girişimler ilgili sistem hazır oldukça eklenir.

Oyuncu; kararın konusunu, bilinen maliyetini, verilen taahhüdü ve belirsiz kalan noktaları anlayabilmelidir. Her kararın hemen olumlu veya olumsuz sonucu çıkması gerekmez. Bazı sonuçlar haftalar ya da yıllar sonra hatırlanır.

### Tek konu akışı ve ekranların görevleri

**Onaylı hedef (2026-10-02):** 2.8A–2.8F ilk sunumu kurdu; aşağıdaki yeni düzen 2.8I ile uygulandı (sunum ayrıntısı [STIL_REHBERI §7](STIL_REHBERI.md#onaylı-ekran-düzenleri-ve-etkileşim)). Açılış başkanın odası olarak kalır. Günlük işlerde oyuncu sırayla tek konuyla ilgilenir. Dosya, ajanda, telefon ve ayarlar kendi görevlerini taşır; ekranların ayrıntılı görünümü [STIL_REHBERI §7](STIL_REHBERI.md#7-arayüz-ve-bilgi) içindedir.

| Ekran | Oyuncunun yaptığı iş |
|---|---|
| Dosya | Tek meseleyi anlamak, bilinen kanıtı görmek, tavsiye almak, karar vermek veya devretmek |
| Ajanda | Tarihi, randevuyu, ayrılmış süreyi, yaklaşan son tarihi ve uygun girişimi takip etmek |
| Dosya / Raporlar | Mali işler müdürünün tarihli raporlarını okumak (H2-d); okuma karar değildir, zaman almaz |
| Dosya / Kadro | Kadronun yalnız gözlenebilir sayılarını görmek (forma, mevki, yaş, bu sezonun maç ve dakikası, gol, kart, durum, sözleşme bitişi ve maaş); ada dokunup oyuncunun dosyasını ve tarihli, kaynaklı notlarını okumak (S-c, [§9](#9-puan-göstermeyen-oyuncu-sistemi)); konu ve rapor yokken dosya bununla açılır; okuma zaman almaz |
| Telefon / Mesajlar | Kişi listesinden tek konuşmayı açmak, varsa iki cevaptan biriyle karar vermek; ek bilgi için bağlı dosyayı okumak; ekipten birine hazır bir konudan yazmak (H2-c; konu seçmek menüdür, karar değil; cevap saatler sonra gelir). **R2'den (2026-10-29) beri odada iki sütun:** solda telefon yalnız konuşmayı taşır; sağdaki iş paneli tek iş gösterir (R2 eki): karar varsa yalnız kart (cevaplar kaydırınca, bağlam cevabın yüzünde), yoksa cevap beklenirken tek bekleme satırı ya da telefonun altındaki “Yeni konu aç”la açılan başlıklı konu menüsü (oyuncu seçimi içinde); konuşma dışındaki telefon ekranlarında panel Bekleyenler'dir (cevabını bekleyen kararlar, gelecek cevaplar, yeni mesajlar; üç ayrı işaret). *RN-a (2026-10-30, kullanıcı: “gerçekte böyle bir şey yok”):* Bekleyenler kalktı; telefon önce kabın ortasında tek cihazdır, iş çıkınca (karar, bekleme, konu menüsü, Canlı Skor sayfası) sola kayar ve panel açılır; bekleyen ve yeni olan ana ekranın bildirimlerinde ve Mesajlar listesinde görülür. Konuşma yeniden açılınca okunan yer geri gelir, arada yeni mesaj geldiyse ilk yenisine gider. Balkonda ve maç telefonunda tek telefon sürer |
| Telefon / Canlı Skor | Tarafsız lig uygulaması (R3, 2026-10-29; S-d'nin üç sekmesinin yerine, [YOL_HARITASI karar 64](YOL_HARITASI.md#geçerli-kararlar)). İki sekme. **Maçlar:** ‹ N. hafta ›, günü ve o haftanın sekiz maçı aynı satır kalıbıyla (Demirkapı ayrıcalıksız; geçmiş ve gelecek haftalar aynı yerde; maç günü ve sonraki iki gün o hafta, sonra sıradaki). **Puan durumu:** 16 kulüp, armalı, vurgusuz; maç telefonunda o anki skorlarla canlı. Satıra dokununca **maç sayfası:** başlıkta iki kulüp, skor, devre arası skoru, hafta ve stat; Özet (gol, kart, oyuncu değişikliği, sakatlık ve devreler tek akışta, “45+2'” biçimi), İstatistikler (10 satır, beklenen gol), Kadrolar (diziliş, ilk on bir, yedekler, değişiklikler, maç öncesi eksikler), Puan durumu (o haftanın sonu); oynanmamış maçta önizleme (son beş, hocalar). Kulübe dokununca **takım sayfası** (Genel, Maçlar, Kadro, İstatistik), oyuncuya dokununca **oyuncu sayfası** (künye, bu sezon, maç maç, maçta görülen sakatlıklar). Odada sayfalar telefonun sağındaki panelde, balkonda ve maçta telefonun içinde; maçta bugünkü haftanın maç sayfaları canlı. Kamuya açık bilgi sınırı [§9](#9-puan-göstermeyen-oyuncu-sistemi). Kulüp armaları kodla çizilmiş TEST yer tutucudur. Odaya düğme eklenmedi |
| Transfer masası | Duvardaki mantar pano (R4, 2026-10-29; 3B çizimi görsel turda, bugün kâğıt düzen; masada 6). **Pano:** transfer döneminin sayacı (son gün kırmızı), kasa, açık transfer dosyaları tek satır ve aşamasıyla, cevap bekleyen gelen teklifler, takiptekiler. **Takip**, **Piyasa** (bildiğimiz kadarı: serbestler ve ne zamandır boşta oldukları, kulübünde forma bulamayanlar, sözleşmesi bitecekler) ve **Geçmiş** (gelen, giden, kaçan; kaçanın bugünkü kulübü ve sayıları). Oyuncuya dokununca kâğıdı: künye, bu sezon, kaynaklı bildiklerimiz; **Takibe al** (menü, zaman almaz), **Hocaya araştırt** (dosya açılır), **İzlemeye git** (defterde randevu; yol masrafı). Kararlar yine tek karttır; masa göz atma ve girişim yeridir ([§2 Transfer alımı](#transfer-alımının-bugünkü-uygulaması-r4-2026-10-29)) |
| Gazete | Her sabah 08:00'de çıkan sayıda dünü okumak: manşet, sonuçlar, puan durumu, sakatlıklar, yaklaşan maç; önceki sayılar arasında gezinmek (S-e, [§6](#gün-ve-hafta-ritmi)); okuma zaman almaz |
| Ayarlar | Okunabilirlik, kayıt ve geliştirici seçeneklerini düzenlemek; hareket azaltma seçeneği bulunmaz |

**Az düğme, bilgi kaynağından gelir (kullanıcı, 2026-10-26; YOL_HARITASI karar 50; H2'de uygulandı).** Odada nesneler durur — dosya, defter, telefon, pencere ve balkon; gazete S-e'den (2026-10-27) beri her sabah yeni sayıyla masada (yeri Y0'da kapandı, karar 51; [§6](#gün-ve-hafta-ritmi)) — ve İlerle, Duraklat, Ayarlar; TEST düğmeleri (Maçı izleme, Maçı bitir) yayından önce kalkar. Yeni bilgi için düğme eklenmez; bilgi kaynağından gelir: onu bilen kişiden (soru; cevap zaman alır), tarihli ve kaynaklı belgeden (dosyadaki rapor, oyuncu dosyasının notları), gözlemden (pencere, balkon, maç) ya da kamuya açık sayılardan (Canlı Skor, gazete, Kadro sekmesi). Kasa düğmesi bu kuralla kalktı.

Dosyada kategori, kısa olay özeti, ilgili kişi, mevcut durum ve başkandan beklenen adım önce gelir. Bilinen maliyet, süre, taahhüt, son tarih ve önemli risk karar verilmeden görülebilir; bunlar ayrıntı çekmecesine saklanmaz. Uzun geçmiş ve ek belgeler gerektiğinde açılır. “Önceki dosya” ve “Sıradaki dosya” ile gezilir; toplam açık, cevap bekleyen ve takipteki konu sayıları kısa sayaçlarla anlaşılır. Kapanmış meseleler ayrı arşivden incelenebilir.

Karardan sonra kısa bir sonuç ve beklenen sonraki haber gösterilir. Oyuncu sıradaki dosyaya kendisi geçer; gelen haber okumakta olduğu konuyu değiştirmez veya sırayı kaydırmaz. Mesajdan dosyaya gidip geri dönünce aynı konuşma ve okuma konumu korunur. Gezmek, ayrıntı açmak ve test verisine bakmak süre tüketmez veya yeni sonuç çekmez.

Ajandada kasa, finans tablosu, bütün karar seçenekleri ve geçmişteki bütün sözler yığılmaz. Ödeme ya da mali teklifin gerçek son tarihi ajandada kısa hatırlatma olarak kalır; mali bilgi mali işler müdürünün dosyadaki raporunda ve ona sorulan soruda bulunur (H2-d, 2026-10-26). Ajandadaki randevu kendi konusuna bağlanır. Boş gün anlaşılır ve sakin gösterilir; boşluğu doldurmak için yeni görev üretilmez.

Telefon bildirimleri yeni haberi fark ettirir; açık dosya veya her takipteki konu sürekli yeni bildirim sayılmaz. Telefon kendi ana ekranıyla açılır: Mesajlar ve Canlı Skor. Mesajlarda kişi listesi → konuşma → gerekiyorsa iki cevap akışı vardır. Aynı kişi birden fazla meseleyi konuşabilir; bütün mesele olayları o kişinin gönderdiği mesajmış gibi sunulmaz. Uygun cevap konuşmadan verilir; dosyaya zorunlu gidiş yoktur. Karar, haber ve sonuç ayrılır; yalnız bilgi veren mesaj için yapay iki cevap üretilmez. Maçta telefon açıkken maç durur; henüz bağlanmamış kariyer/diğer maç verisi veya maç içi cevap çalışıyormuş gibi gösterilmez. Bu bağlantının sınırı [TEKNIK_PLAN §10](TEKNIK_PLAN.md#10-sunum-metin-ve-masaüstü) içindedir.

### Başkanlık kararında iki seçenek

**Onaylı çerçeve (2026-10-02; 2.8H ile uygulandı, aşağıdaki “Bugünkü uygulama”):** Dosya, mesaj, görüşme, bütçe, atama ve diğer başkanlık kararlarında aynı anda **tam iki anlamlı cevap** sunulur. Bunlar yalnız evet/hayır değildir: teklif, öncelik, sorumluluk, ilişki, kamuoyu ve küçük kulüp anları farklı ikilemler taşır. Her seçimin büyük ekonomik bedeli olması gerekmez. Menüde kişi/gün seçmek, ayrıntı okumak veya dosyalar arasında gezinmek karar sayılmaz; oyun menüsündeki her düğme sayısı ikiye indirilmeyecek.

- Ekip somut tutar, ödeme takvimi, kapsam ve sınırlarla teklif getirir. Başkan serbest fiyat/rakam girmek yerine iki açık yaklaşım arasından yön verir. Yeniden çalışma isteniyorsa neyin değişeceği anlaşılırdır; zaman ve ekip kapasitesi kullanılır, sınırsız ücretsiz teklif yenileme yoktur.
- İki cevabın yanında üçüncü karar olarak tavsiye/devir/erteleme düğmesi saklanmaz. Hazır görüşü okumak ücretsiz bilgidir; yeni araştırma, yetki devri veya bekletme uygun kararda iki cevaptan biri olabilir. Dosyayı kapatmak ret veya onay sayılmaz; gerçek son tarih sürer.
- Dört seçeneği iki menüye saklayan yapay seçim ağaçları kurulmaz. Yeni bilgi veya karşı teklif gerçekten doğduğunda kısa bir sonraki karar gelebilir. Aday seçimi gibi mevcut çok seçenekli konular da gerekçeli teklif/görüşme akışına dönüştürülür; geçerli adaylar rastgele atılarak ikiye düşürülmez.
- Teklifin bilinen bedeli, süresi, taahhüdü ve kritik riski seçimden önce görünürdür. Belirsiz gelecek kesin sonuç gibi gösterilmez. Mizahlı cevap da neye izin verildiğini açıkça anlatır.
- Şartları değişmiş veya geçersiz bir karar, sahte/çalışmayan ikinci cevapla tamamlanmaz; güncel koşula uygun karar ya da bilgi durumuna geçirilir. Metni farklı iki aynı eylem, stratejik çeşitlilik sayılmaz; yalnız üslup farkı taşıyan küçük anların kapsamı açık olabilir.
- Karardan sonra kısa gerçek sonuç ve varsa kimden/ne zaman haber beklendiği gösterilir. Otomatik sıradaki konuya atlanmaz. Aynı karar telefonda ve dosyada ikinci kez uygulanmaz.
- Başkan uygun kişiler üzerinden girişim başlatabilir; yalnız gelen istekleri beklemek zorunda değildir. Tam araştırma, transfer ve kalıcı çalışma kuralları ilgili sistemlerle genişler. İyi ekip rutin işi azaltır; yetki içinde kalan her adım yeniden onaylatılmaz.

Reigns'ten kısa konuşma, iki açık cevap ve koşula bağlı devam alınır; dört kaynak çubuğu, hızlı ölüm/yeniden başlama, her cevapla yıl atlama veya sürekli süre baskısı alınmaz. Kulüp takvimi ve §6'daki eylemle ilerleme korunur. Aynı kulüp, farklı koşullarda birden fazla makul başarı yolu taşıyabilir; tek ezber cevap dizisi hedeflenmez.

**Tek kart (kullanıcı kararı, 2026-10-22; sunum başkanlık planında, YOL_HARITASI program F):** başkanlık kararı tek bir karttır. Kart sağa ya da sola kaydırıldıkça üstündeki metin o yönün cevabına döner; bırakınca o cevap uygulanır. Reigns'in iki ayrı kartlı selamlaşma sahnesi örnek alınmaz; bütün senaryolarda aynı tek kart dili kullanılır. Mali konularda da iki seçenek vardır (ör. ekibin önerisini kabul et / yeniden çalıştır; ya da iki teklif arasında seçim). Bilinen bedel, süre ve risk seçmeden önce görünür; R2 eki’nden beri kart o cevaba kaydırılınca (yukarıdaki kurallar). **Ekranlar (kullanıcı kararı, 2026-10-23):** tek kart her yerdedir — dosya, karar paneli, telefon konuşması ve maç günü karar anı (F4). **Bugünkü uygulama (H1, 2026-10-26; davranış Claude'un önerisidir, kullanıcı görür):** dosya, karar paneli, telefon konuşması ve karar anı aynı kartı kullanır. Kartın nötr yüzünde konu, hazır görüş, son cevap ve cevapsız kalırsa olacak olan durur; altında iki kenar etiketi cevapların adını ve süresini yazar (sol `secenekler[0]`, sağ `secenekler[1]`). Sürüklerken yüz o yönün cevabına döner: metin, süre, bilinen sonuç, varsa engel, o cevabın süresiyle kaçırılacak randevular ve bu arada cevapsız kalacak işler. Kart genişliğinin %40'ını geçip bırakmak uygular, altında kart yerine yaylanır; engelli cevaba bırakmak da yaylanır. Klavyede ←/→ önizler, Enter uygular, Esc önizlemeyi bırakır (önizleme yoksa paneli kapatır). Kenar etiketine dokunmak yalnız önizler, tıklama uygulamaz (kaza önleme; seç-onayla kalıbı geri gelmez). Ayrı “Onayla” adımı karar kartından kalktı; randevu, Stada git ve İlerle'nin onayı karar olmadığı için sürer (§6). Duraklatmada ve maç telefonunda kart kilitlidir: önizlenir, uygulanmaz, nedeni kartın yüzünde yazar. Karar anında aynı kart süre çubuğuyla gelir; ←/→ ve Enter'a ek olarak 1/2 doğrudan seçer (süreli an; TEST alışkanlık); süre dolarsa kayıttaki cevapsız sonuç işler. Sol ve sağ doğru/yanlış diye kodlanmaz; hareket sakin ve kısadır (0,2 sn). Görünüm seçenek kesmez ya da seçmez: seçenekler ve uygulama aynı kuraldan gelir (`KARAR_TURLERI`, `ajandaIsiYap`). Eşik ve ölçüler TEST'tir (`STIL.kagit.kart`); sunum [STIL_REHBERI §7](STIL_REHBERI.md#7-arayüz-ve-bilgi) “Bugünkü uygulama (H1)”. **R2 eki (kullanıcı kararı, 2026-10-29; [YOL_HARITASI karar 62](YOL_HARITASI.md#geçerli-kararlar)): Reigns gibi.** Cevaplar kartta görünmez: kenar etiketi yoktur, üst etiket yalnız künyedir. Nötr yüzde soranın künyesi, kararın sorusu, portresi, adı ve görevi, son cevap ve cevapsız kalırsa olacak olan durur; cevaplardan biri bir işi kaçırtacaksa yalnız “Cevaplardan biri zaman alır.” yazar (hangisi olduğunu söylemez). Kart sağa ya da sola kaydırılınca (←/→) yüz o cevaba döner: cevabın türünü gösteren simge, adı, süresi, bilinen sonuçları, uyarıları ve o cevabın bağlam şeridi; eşik geçilince kart amber kenarlanır, bırakınca uygulanır. Hazır görüş kartın üstünde, dışındadır. Sol ve sağ yine renkle ayrılmaz (simge cevabın türünü gösterir, iyi ya da kötü değil). Karar anında 1/2 artık doğrudan seçmez, önizler; Enter seçer. Yukarıdaki H1 cümlelerinden kenar etiketi ve 1/2 ile doğrudan seçim tarihseldir.

**Odak modeli (kullanıcı kararı, 2026-10-28; U ile uygulandı):** oyuncu o anda tek işle ilgilenir: iş ortada büyür, oda bulanır; iş kendi bağlamını kartta taşır (o günün defteri, kasa, künye), ayrıntıya göz atılır ve geri dönülür; masaya bırakmak ertelemektir, ertelenen karar masada “Sonra” yığınında durur (üçüncü düğme yoktur). Kart uygulanınca damgalanır. Ayrıntı [STIL_REHBERI §7](STIL_REHBERI.md#bugünkü-uygulama-u-2026-10-28), [araclar/plan/u-arayuz.md](araclar/plan/u-arayuz.md).

**Pazarlık (kullanıcı kararı, 2026-10-26; hedef, Y1):** rakam çarkı yoktur, başkan rakam girmez. Pazarlıkta ekip (konuya göre sportif direktör, hoca ya da mali işler müdürü; o görevde kimse yoksa başkanın kendi tahmini) iki rakam önerir; kartın sol ve sağ yüzü bu iki tekliftir, yüzde kimin önerdiği ve bilinen bedel yazar. Karşı tarafın kabul etmeyeceği gizli bir alt sınırı (rezervasyon fiyatı) ve her zayıf teklifle azalan gizli sabrı vardır; ikisi de gösterilmez. Cevap sonraki kartta gelir: kabul, karşı teklif (yeni iki rakamla yeni kart), teklif dışı hamle (taksit, sonraki satıştan pay, ek oyuncu; kabul / ret kartı) ya da kopma. Sabır bitince pazarlık kopar, dosya kayba gider ve karşı taraf bunu hatırlar. İpuçları kişilerden gelir (“kulübün borcu var, satmak zorundalar”; “başka kulüp de arıyor”). Önerilen iki rakamın isabeti önerenin gizli yeteneğine bağlıdır: iyi ekip daha iyi iki rakam getirir. Yarıda bırakılan pazarlıkta karşı tarafın sabrı düşer ([kart sınıfları](#dosya-şablonları)).

**Bugünkü uygulama (2.8H, 2026-10-02; TEST içerik):** Yeni kariyerin bütün kararları iki cevaplıdır; hangi ikilinin geleceği o anki koşuldan çıkar (ör. sayman yetişiyorsa “Kendin görüş / Sayman görüşsün”, yetişmiyorsa “Kendin görüş / Tribün onarımını ertelet”). Aday seçimi **sıralı görüşmedir** (kullanıcı kararı): adaylar tek tek dinlenir, [Göreve al] / [Sıradaki adayı dinle (+30 dk)]; son adayda [Göreve al] / [Koltuğu boş bırak]. Geri çevrilen aday kulüp üyesi olarak kalır. İlgili koltuktaki kişinin görüşü karar gelirken hazır bilgi olarak dosyaya düşer; “Görüş iste” düğmesi yoktur, saymanın konuşması gibi yeni çalışma yalnız anlamlı olduğu kararda iki cevaptan biridir. Hocayla görüşme karar değil, katılınan randevudur. Eski çok seçenekli konular yalnız eski kayıtlarda kendi biçimleriyle sürer.

**İçerik sıfırlama (kullanıcı kararı, 2026-10-02; 2.8L ile uygulandı):** Oyundaki bütün senaryolar, kişiler (başkan dışında), mesajlar, olaylar, başlangıç seçenekleri ve ajanda içeriği silindi. Ajanda, telefon, dosya, kasa, yönetim koltukları, söz/haber ve gözlem sistem olarak çalışır; içeriği kullanıcı tek tek yazar. Yukarıdaki iki cevap kuralı, koşula bağlı olay sözleşmesi ve kalıcı hafıza ilkeleri yeni içerik için de geçerlidir. Aşağıdaki “Bugünkü uygulama (2.8H)” ve “İçerik geçişi” tarihsel kayıttır. Eski kayıtlar açılmaz.

**İçerik geçişi:** Yeni düzene uymayan bütün mevcut oyuncu senaryoları, seçenek akışları ve sonuçsuz görevler envantere alınarak yeniden yazılır veya yeni kariyer yolundan kaldırılır. Üzerine yalnız iki düğmelik görünüm kaplamak yeterli değildir. Uyumlu konu ailesi/oyun kuralı korunabilir; eski çok seçenekli senaryo normal yeni oyunda paralel yaşamaz. Katalogdaki henüz uygulanmamış çok yollu taslaklar da hazır senaryo kabul edilmez. Kapsam [OLAY_KUTUPHANESI §7](OLAY_KUTUPHANESI.md#7-mevcut-içerikten-geçiş), kayıt koruması [TEKNIK_PLAN §6](TEKNIK_PLAN.md#eski-içerikten-geçiş-ve-kayıt-uyumu) içindedir.

### Yönetim omurgası: beş katman

**Hedef (2026-10-26; kullanıcının sistem tasarım taslağından, YOL_HARITASI karar 51):** başkanlığın bütün işleri beş katmandan geçer. Oyuncu yalnız kart katmanına dokunur; üstteki üç katman kartları üretir, sonuç dünyayı değiştirip yeni kartlar doğurur.

| Katman | Görevi | Bugünkü karşılığı |
|---|---|---|
| 1. Dünya | Lig, kulüpler, oyuncular, rakip başkanlar ve takvim; zaman akar, rakipler de hamle yapar; gazete, telefon ve maç bu katmandan haber taşır | Fikstür, öbür maçlar, gizli gelişmeler, olay paketleri |
| 2. Kişiler | Her kişinin gündemi, hafızası ve gizli tutumu; gündemler çatışır ([§10 “Kişi modeli”](#kişi-modeli)) | Kişi kaydı, hocanın tarzı ve gizli değerleri, söz kaydı |
| 3. Dosyalar | Her iş bir şablonun aşamalarından geçer (aşağıda); kişinin gündeminden ya da başkanın girişiminden açılır | Mesele |
| 4. Kartlar | Dosyanın o anki aşaması tek kart olarak gelir; her kartta iki cevap (yukarıda) | Karar türleri ve tek kart |
| 5. Sonuç | Dosya ilerler ya da kapanır, kişilerin tavrı değişir, para ve geçmiş yazılır, dünya güncellenir | Geçmiş, söz, para hareketleri |

Bu ayrım içerik yazmayı kolaylaştırır: yeni bir olay, bir şablonun aşamalarına koşul ve metin yazmaktır ([OLAY_KUTUPHANESI §1](OLAY_KUTUPHANESI.md#1-kataloğun-kullanımı)). Genel amaçlı hikâye motoru kurulmaz ([TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi)).

Başkanın beş fiili vardır: **ara** (telefonda kısa konuşma; bilgi ister ya da dosya başlatır), **çağır** (kişi odaya gelir; yüz yüze, daha uzun, daha etkili, daha pahalı), **görevlendir** (dosyanın sahibi değişir, sonuç kartı döner), **teklif et** (pazarlık kartı) ve **bekle** (kartı bırakıp başka işe geçmek; kartın ömrü işler). Başkan oyuncu listesinden doğrudan transfer başlatmaz; bir kişiye iş verir (“bana sol bek bul”), böylece personelin kalitesi hep devrededir. Kişi seçmek ve konu seçmek menüdür, karar sayılmaz (yukarıdaki kural). Başkanın tepki verdiği işle kendi başlattığı iş arasındaki denge gözlenir: tamamen tepkisel oyun itfaiyeciliğe, tamamen girişimci oyun gösterge paneline döner; transfer dönemlerinde girişim, kriz haftalarında tepki artar.

### Dosya şablonları

**Hedef (2026-10-26; Y1–Y3):** her dosya sıralı aşamalardan geçen bir durum makinesidir. Aşama üç türlüdür: **kart** (başkana karar düşer), **bekleme** (dosya bekler, sonuç haber ya da kart olarak gelir) ve **devir** (aşamayı görevlendirilen kişi yürütür). Her aşamadan **kayıp** çıkışı mümkündür: rakip kulüp kaptı, oyuncu reddetti, süre doldu, pazarlık koptu, sağlık raporu kötü. Ortak alanlar: şablon, aşama, sahip (başkan ya da görevlendirilen kişi), karşı taraf, son tarih ve geçmiş (gelen kartlar, verilen kararlar). İlk set altı şablondur:

| Şablon | Tetikleyici | Tipik süre | Kritik kart |
|---|---|---|---|
| Transfer alımı | Hocanın isteği, gözlemci raporu, haber, başkanın girişimi | 1–4 hafta | Pazarlık zinciri |
| Transfer satışı | Gelen teklif, mali baskı | 1–2 hafta | “Hocaya nasıl söylerim?” |
| Sözleşme yenileme | Bitişe altı ay kala, oyuncunun talebi | 1–3 hafta | Maaş pazarlığı |
| Personel | İstifa, görevden alma, kurul baskısı | 1–2 hafta | Aday görüşmesi |
| Kriz (soyunma odası, basın, taraftar) | Maç sonucu, ertelenmiş sorun, dedikodu | 2–7 gün | Yüz yüze görüşme |
| Kurumsal (sponsor, federasyon, stat, genel kurul) | Takvim, dış teklif | 2–8 hafta | Yönetim kurulu oylaması |

Transfer alımının aşamaları: ihtiyaç (kart) → araştırma (bekleme, 2–5 gün) → aday seçimi (kart; iki aday, kaynaklı ve çoğu zaman çelişen görüşlerle) → temas (bekleme, 1–3 gün) → kulüp pazarlığı (kart zinciri) → oyuncu pazarlığı (kart; maaş, menajer, süre) → sağlık kontrolü (bekleme, 1 gün) → imza. Bugünkü sorunsuz yol ([§8](#transfer-ve-sponsor-görüşmeleri), G2) bu şablonun en kısa yoludur; ikinci teklif, kaçan transfer ve alternatif arayışı onun doğal çıkışlarıdır. Süreler ve aşama sayıları TEST'tir; her dosya her aşamada kriz üretmez.

#### Transfer alımının bugünkü uygulaması (R4, 2026-10-29)

Kullanıcının isteği (2026-10-29): transfer oyunun en önemli süreçlerinden biridir, sıradan bir dosya değildir; dedikodu, rakibin oyuncusu, uzun süredir boşta düşüşteki yıldız, oyuncunun birden rakibe gitmesi, anlaşamamak, sakat çıkmak gibi keyifli ve keyifsiz olaylar; altyapı çok senaryoya elverişli olsun. Tasarım ve fikir kaydı [araclar/plan/transfer-tasarim.md](araclar/plan/transfer-tasarim.md); plan ve sapmalar [araclar/plan/r4-uygulama.md](araclar/plan/r4-uygulama.md); [YOL_HARITASI karar 65](YOL_HARITASI.md#geçerli-kararlar).

- **Şablon motoru** (`js/sablon.js`): dosya bir şablonun aşamalarında yürür (kart, bekleme, devir, uyku, son); her aşamadan kayıp çıkışı; kıvrımlar (dünyanın olayları) aşamaya girişte ya da bitişte, koşul ve olasılıkla, belirlenimci. Dosyada konunun üstünde tek satır aşama (“Kulüple pazarlık”), kapanınca sonuç (“Oyuncu başka kulübe gitti”).
- **Zincir** (`js/transfer-alim.js`, TEST süreler): ihtiyaç kartı (hocanın isteğinde soran hoca; başkanın girişiminde de) → araştırma (2–4 gün) → aday kartı (iki aday, hocanın kanaati çoğu zaman yanılabilir; izlenen oyuncuda yanılmaz) → pazarlığı kim yürütecek (Kendim / mali işler müdürüne bırak: iyi, vasat ya da kötü döner) → kulüple pazarlık kartı (iki rakam; karşı teklifte yeni iki rakam; sabır biterse kopma) → oyuncuyla görüşme (telefon ya da Yanına git: zaman ve yol masrafı, yüz yüze ağırlık) → maaş pazarlığı → sağlık kontrolü (rapor kartı) → imza; kayıpta alternatif aday kartı. Kart sınıfı künyede (Fırsat · n gün, Pazarlık, Sorun; rutin yazılmaz).
- **Kıvrımlar (TEST örnekleri; içerik kullanıcının):** rakip araya girer (satan sertleşir; pazarlık koparsa oyuncu rakibe gider — dünyada dar transfer), satan son anda bedeli artırır, sağlık raporu (yaşla artar), hocanın itirazı, basına sızıntı, tescil gecikmesi, rakibin oyuncusu (satan sertleşir).
- **Serbest oyuncular** (`js/piyasa.js`): 24 sözleşmesiz oyuncu, ne zamandan beri boşta oldukları ve düşük gizli formları; öne çıkanların en iyi yılı (ligdeki bir kulüp ya da genel tarif; kulüp adı uydurulmaz). Serbest oyuncu dönem dışında da alınabilir (TEST kural).
- **Başkanın girişimi:** telefonda hocaya “<Hat> hattına oyuncu bulalım” (konu menüsünde Transfer başlığı), masada Hocaya araştırt ve İzlemeye git. Aynı anda en çok 2, dönemde en çok 3 dosya (TEST).
- **Mekânlar** (`js/mekan.js`): 3. Lig'in sekiz yeri (başkan odası, kulüp lokali, çay bahçesi, karşı kulübün ofisi, oyuncunun şehri, amatör tribün, karşı tesis, devlet hastanesi); süre ve masraf; sahneleri görsel turda.
- **Hoca değişince** soranı ayrılan hoca olan kart düşer (dosya “düştü”); bekleyen araştırma ve görüş yeni hocayla sürer.

#### Zincirlerin bugünkü uygulaması (R6 ilk dilim, 2026-10-30; [YOL_HARITASI karar 67](YOL_HARITASI.md#geçerli-kararlar); TEST sayılar)

- **İkinci teklif:** gelen teklifi reddetmek sert pazarlık hamlesidir — alıcı TEST olasılıkla (oyuncunun değeri bedelin üstündeyse daha olası) 2–3 gün sonra bedeli artırarak (×1,12–1,25) yeni bir dosyayla döner; kartın künyesinde Pazarlık. İkinci ret son sözdür; cevapsız teklif geri çekilir, yeniden gelmez; dönem kapanmışsa gelmez.
- **Sponsor zinciri** (`js/sponsor.js`; şablon motorunun ilk kurumsal kullanıcısı): sezonda bir kez, Şubat ay başında stattaki TEST tabela markalarından biri forma göğüs reklamı önerir (tablonun üst yarısındaki kulübe daha güçlü). Teklif kartı (Fırsat; mali işler müdürü telefonda): Görüşelim / İlgilenmiyoruz → pazarlık kartı (tahsil yönü: ekibin iki aylık rakamı, makul ve iddialı; markanın gizli üst sınırı ve sabrı; karşı teklif) → cevap → imza: sezon sonuna dek her ayın 1'inde kasaya. Kayıp: ret, cevapsızlık, kopma.
- Kalan zincirler (kriz, sözleşme pazarlığı, satış şablonu P07, menajer ve satan başkan kişileri, taksit ve pay) ile kişi modeli ve personel slotu R6b'dedir.

**Bekleme pasif değildir.** Dosya beklerken dünya çalışır: rakip kulüp aynı oyuncuya teklif yapar, haber çıkar, menajer başka kulüpten aldığı teklifle fiyatı yükseltir. Bekleme dolunca sonuç kart ya da haber olarak gelir (“Gözlemci raporu hazır”, “Kulüp görüşmeye açık”, “Sağlık raporu: menisküs”).

**Yetki devri ve üç kalite.** Devredilebilir aşamada kart “Kendim ilgilenirim / X'e bırak” iki cevabıdır. Devredilen aşamalar kişinin o konudaki gizli yeteneğine göre çözülür ve başkana yalnız sonuç, onay kartı olarak döner: **iyi** (“Anlaştım, imzaya hazır”), **vasat** (anlaşma olur; birkaç gün sonra rakibin aynı profili daha ucuza aldığı duyulur, başkan “daha iyisi olabilirdi” sezgisini kendisi kurar) ya da **kötü** (menajer görüşmeyi keser, dosya kaybolur; o kişiye sonraki işte daha az güvenilir). Bir kişi transferde iyi, sponsor pazarlığında vasat olabilir. İyi personel daha az kart ve daha iyi sonuç demektir; iş yükünü yönetmenin ana aracıdır. Kişisel katılımın bazı görüşmelerde özel ağırlığı ([§7](#7-ekonomi-yetki-devri-ve-kişisel-katkı)) korunur.

**Kart sınıfları ve bekleme.** Erteleme üçüncü düğme değildir: başkan kartı bırakıp başka işe geçer, kartın ömrü işler. Ne olacağı kartın sınıfına bağlıdır:

| Sınıf | Örnek | Beklerse | Cevapsız kalırsa |
|---|---|---|---|
| Fırsat | Transfer teklifi, sponsor, boştaki hoca | Ömrü işler | Sessizce kaybolur; sonra haber olarak duyulur (“X, Y kulübüne gitti”) |
| Sorun | Oyuncu huzursuzluğu, basına sızıntı, bütçe uyarısı | Büyür | Bir hafta içinde daha ağır bir kart olarak döner |
| Rutin | İmza, onay, küçük cevap | Birikir | Yazılı varsayılan sonucu işler; birikince asistan uyarır, kurul “başkan işleri takip etmiyor” demeye başlar |
| Pazarlık | Zincirin ortasında bırakılan teklif | Karşı tarafın sabrı düşer | “Hâlâ bekliyorum” kartı, sonra kopma |

Bu tablo [§6](#ajanda-ve-son-tarihler)'nın cevapsız kalma kuralının sınıf bazında tamamlanmış hâlidir: cevapsız sonuç yine kartın yüzünde önceden yazar, zorunlu kriz kararları (maaş günü gibi) karar verilmeden geçilmez. Beklemek bazen doğru hamledir: transfer döneminin son günlerinde fiyat düşer; bir krize hemen cevap vermek yerine önce kaptandan bilgi almak daha iyi sonuç verebilir; bir kurul üyesinin “kendi adamı” önerisini sessizce bekletmek reddetmekten daha az düşman yaratır. Oyuncu hangi kartın beklemeyi kaldırdığını zamanla öğrenir. Masanın boşalması bir uyarı değildir; iyi yönetim sakin dönem üretebilir ([§10](#koşula-bağlı-olaylar-ve-adil-belirsizlik)).

## 3. Kulübün geçmişi ve başlangıç hikâyesi

Kulübün sabit bir geçmişi hazırlanır: kuruluş, önemli eski başkanlar ve oyuncular, başarılar, kırılmalar, gelenekler, taraftar alışkanlıkları ve şehirle ilişkisi. Geçmiş kayıtları ile oyuncunun kariyerinde oluşan yeni geçmiş ayrılır. Bu kimlik, yeni kariyer açıldığında rastgele başka bir kulübe dönüşmez.

### Değişken devralma koşulları

**Onaylı tasarım yaklaşımı (2026-09-30; dar ilk örneği uygulandı: aynı kulüple üç TEST başlangıcı, yol haritası 2.4A; tam devralma koşulları henüz yok):** Sabit kimlik üzerine tutarlı fakat değişken mali, sportif ve insani koşullar kurulur. Vadesi gelen yükümlülükler, tahsilat imkânları, mevcut anlaşmalar, ekip ilişkileri ve tarafların alternatifleri birlikte değerlendirilir. Yalnızca isim, tutar veya olay günü değiştirmek yeterli çeşitlilik sayılmaz; gündem, eldeki kanıt, uygulanabilir seçenek ve sonraki etki değişebilmelidir.

Kulübü zor bir dönemde devralma yönü korunur; zorluğun kaynağı ve birleşimi değişebilir. Her kariyerin aynı sponsor kriziyle veya aynı erken seçim gerekçesiyle başlaması gerekmez. Bir alandaki sorunun yokluğu, bütün kulübün sorunsuz olduğu anlamına gelmez. İlk dar prototipte sakin mali başlangıç da sınanır.

Tam oyunda devralınacak temel gerçekler adaylık başlamadan kurulur ve kariyer boyunca korunur. Borç, gizli anlaşma veya kişinin geçmişi, oyuncunun kararından sonra onu zorlamak için geriye dönük icat edilmez. Oyuncunun bunları öğrenmesi zaman alabilir; dünyanın gerçeği ile başkanın bilgisi farklıdır. Yeni kişiler ve koşullar sabit tarihle çelişmemelidir.

Başlangıç, bütün sezonun olaylarını veya finalini seçen bir senaryo paketi değildir. Sonraki gelişmeler §10'daki koşullarla doğar. Uyumlu koşulların hangi aralıklardan seçileceği ve başlangıç zorluğunun dengesi testlerle belirlenecek; bu karar oyuncuya bir senaryo seçme menüsü eklenmesini zorunlu kılmaz.

### Taraftarlıktan adaylığa giriş

Girişin taşıyabileceği sahne türleri şunlardır; bunlar her kariyerde aynı sırayla oynanacak zorunlu bir zincir değildir:

1. Taraftar olarak maçlara gider, tanıdıklarla konuşur ve kötü gidişe verilen tepkileri görürsün.
2. Gazetelerden ve çevrenden gelişmeleri takip edersin; kulübün insanlarını tanırsın.
3. Adaylık fikri çevrenden gelen görüşmelerle büyür. Aday olma isteğin ve karakterin konuşmalarla şekillenir.
4. Adaylığını açıklarsın; ilk röportaj, ekip arayışı ve kampanya başlar.

Girişe sabit bir kısa süre sınırı konmaz. Buna rağmen oyuncu erken aşamada anlamlı seçimler yapabilmelidir. Ardışık sahneler ve maç izleme süreleri oynanış testinde değerlendirilir; tekrarlanan geçişler zorunlu beklemeye dönüşmez.

Geliştirmede kulüp kimliği ve tekrar karşılaşılacak temel kişiler erken hazırlanabilir. Kapsamlı taraftarlık ve adaylık girişi, bir sezonluk başkanlık döngüsü sınandıktan sonra tamamlanır. Bu geliştirme sırası, bitmiş oyunun taraftar olarak başlama hedefini değiştirmez.

Tarihsel esinler ve kurgusal olay aileleri [OLAY_KUTUPHANESI.md](OLAY_KUTUPHANESI.md) içindedir. Gerçek kulüplerin yaşadığı sonuçlar oyunda zorunlu tekrar edilmez. Eski sabit TEST haftası oyuncuya açık yeni kariyer yolundan çıkarıldı (2.4A); eski kayıtlar kaldıkları yerden sürer.

## 4. Yönetim ekibi, vaatler ve seçim

### Yönetim havuzu

Adaylar finansal güç, bağlantılar, futbol geçmişi, yönetim deneyimi, kişilik ve kendi beklentileri bakımından farklıdır. Havuz ilerledikçe yeni kişilerle genişleyebilir. İlk karşılaşmada aşırı sayıda kişiyi ezberleme yükü oluşturulmaz.

**Kesin karar (2026-09-29): ilk kapsamda üç yönetim koltuğu vardır.**

- Sayman: mali işler.
- Futbol şube sorumlusu: hoca ve transfer teması.
- Basın sözcüsü: medya ve taraftar.

Koltuk sayısı sonraki aşamalarda genişleyebilir; seçmen yapısı ve yönetim kurulunun seçimdeki biçimi hâlâ açıktır.

Tek bir özellik bütün bir problemi çözmez. Paralı üyenin desteğinin miktarı, zamanı, şartı ve güvenilirliği ayrı konulardır. Eski futbolcu oyunculara ulaşabilir ama mali konularda zorlanabilir. Her kişi yalnızca bir avantaj ve bir ceza taşıyan kalıba indirgenmez.

Hoca sportif ihtiyacı, sayman ödeme gücünü, futbol şube sorumlusu görüşmenin yapılabilirliğini, basın sözcüsü kamuoyuna anlatımını değerlendirebilir. Tavsiyenin kaynağı ve belirsizliği anlaşılır olur; bütün ekip aynı bilgiye ve aynı görüşe sahip sayılmaz. Tavsiye ile işi üstlenme arasındaki fark [§7'de](#7-ekonomi-yetki-devri-ve-kişisel-katkı) tanımlıdır.

### Personel ve çekirdek kişiler

**Hedef (2026-10-26; Y1–Y2):** üç yönetim koltuğu (seçilmiş kurul; yukarıdaki kesin karar) ile kulübün **personeli** (çalışanlar) ayrıdır. Kulübün 3. Lig'deki çekirdek kişileri: teknik direktör; yardımcı antrenör ve mali işler müdürü (H2); takım kaptanı (kadrodaki bir oyuncu, soyunma odasının sesi); asistan ya da genel sekreter (sabah brifingi, biriken işler, federasyon yazışması; hiçbir şey istemez, başkanın düzenini korur); koltuklardan birinde oturan, kendi gündemi olan bir yönetim kurulu üyesi. Dışarıdan kişiler (menajer, rakip başkan, gazeteci, federasyon yetkilisi) aynı kişi modelini daha kısa hafızayla kullanır ([§10](#kişi-modeli)).

| Rol | Gündemi | Başkana getirdiği | Başkandan istediği |
|---|---|---|---|
| Teknik direktör | Sonuç, kadro kalitesi, otorite | Oyuncu değerlendirmesi, transfer isteği, soyunma odası sinyali | Transfer, maaş kararı, destek |
| Sportif direktör (üst ligde) | Transfer piyasası, gözlemci ağı | Aday listesi, piyasa bilgisi, menajer teması | Bütçe, yetki, hızlı karar |
| Mali işler müdürü | Nakit akışı, kurallara uyum | Mali rapor, bütçe uyarısı, sponsor teklifi | Harcama freni, sözleşme onayı |
| Takım kaptanı | Soyunma odası, kendi sözleşmesi | Oyuncu huzursuzluğu, hoca hakkında görüş | Sözleşme, saygı, sözün tutulması |
| Asistan / genel sekreter | Düzen, takvim | Sabah brifingi, biriken iş uyarısı, federasyon yazışması | — |
| Yönetim kurulu üyesi | Kendi nüfuzu, bazen kendi adamı | Siyasi baskı, “benim tanıdığım biri var” | Taviz, görünürlük |

**Personel slotları.** Her lig kademesi bazı görevleri “beklenen” yapar: 3. Lig'de gözlemci yoktur, hoca oyuncuya kendisi bakar (bugünkü hocanın transfer isteği); 1. Lig'de gözlemci ağı, basın birimi, altyapı koordinatörü ve hukuk müşaviri beklenir. Başkan bir görevi liginden önce açabilir; maaşı kasadan çıkar, bu bir yatırım kararıdır (erken gözlemci daha iyi transfer, daha dar bütçe). Beklenen görev boş kalırsa işler başkana ya da yanlış kişiye düşer: basın birimi yoksa basın kartlarını başkan cevaplar, hukukçu yoksa federasyon dosyası mali müdürün elinde sürünür. Her personel aynı kişi modelini, gizli yeteneklerini, kendi sözleşmesini ve ayrılma riskini taşır (“Personel” şablonu, [§2](#dosya-şablonları)). Kulübün büyümesi yeni sistem değil, slot açılmasıdır (Aşama 8). Geliştirmede kişiler, adları ve metinleri Claude'un TEST taslağıdır, kullanıcı değiştirir (kullanıcı kararı, 2026-10-26).

**Gündem çatışması** başkanın asıl işidir: hoca tecrübeli bir forvet ister, sportif direktör genç adayı önerir, mali müdür ikisine de “bütçe yok” der, kaptan “asıl sol bek lazım” diye yazar. Her biri ayrı kart olarak gelir; başkan kimi dinleyeceğine karar verir, dinlemedikleri bunu hatırlar.

### Kampanya

- Ekip ile vaatler ve öncelikler hazırlanır; bütçeyle ve birbirleriyle ilişkileri bulunur.
- Rakip adaylarla karşılaşmalar, yerel röportajlar, kulis ve hazırlıksız yakalanılan olaylar yaşanır.
- Seçim günü konuşmalar, bekleyiş, oy sayımı ve sonuç sahneleri vardır.
- İlk seçim makul hazırlıkla çoğunlukla kazanılabilir; kötü hazırlık ve nadir olumsuz gelişmelerle kaybedilebilir. İlk seçim için hedef başarı oranı henüz belirlenmemiştir.
- Sonuç; adayın inandırıcılığı, ekibi, ilişkileri, vaatleri ve rakiplerden oluşur. Belirsizlik bulunur, fakat tek bir açıklanamayan zar bütün hazırlığı değersizleştirmez.
- Sonraki seçimler gerçek görev geçmişini ve rakiplerin alternatiflerini değerlendirir. İyi yönetmek destek sağlar; otomatik yeniden seçilme garantisi vermez.

Oy kullanacak grubun yapısı, ilk üç koltuğun ötesindeki yönetim yapısı ve dönem süresi uygulanmadan önce kararlaştırılacaktır. Erken seçimin yolu genel kuruldur (aşağıda; karar 2026-10-26).

### Genel kurul ve güven oyu

**Hedef (2026-10-26; Y5; seçim sahnesi Aşama 6):** her sezon sonunda olağan genel kurul toplanır ve yönetime güven oylaması yapar; ağır bir krizde olağanüstü genel kurul toplanabilir. Güven oyu kaybedilirse erken seçime gidilir; seçmen yapısı ve seçim sahnesi Aşama 6'dadır, dört–beş yıllık olağan seçim (§1) sürer. Oylamanın havası dört grubun durumundan çıkar:

| Grup | Neyi anlatır | Odada nasıl hissedilir | Dibe vurursa |
|---|---|---|---|
| Kasa | Nakit, borç, bütçeye uyum | Mali müdürün tonu, sponsorların ilgisi, gazetede “mali kriz” | Transfer yasağı, federasyon dosyası, olağanüstü genel kurul |
| Taraftar | Tribün desteği, kamuoyu | Pencereden gelen ses, gazete manşeti | Protesto, boş tribün, panikleyen kurul |
| Soyunma odası | Oyuncu ve hoca huzuru | Kaptanın mesajları, antrenmandaki tartışmalar, hocanın kapıyı çalma sıklığı | Hoca istifası, oyuncu isyanı, sonuçların çökmesi |
| Yönetim kurulu | Kurul üyelerinin desteği | Davet sıklığı, “kendi adamı” baskısı, asistanın “kurul sizi görmek istiyor” notu | Olağanüstü genel kurul, güvensizlik oyu |

Dört grup ayrı ana veri ya da çubuk değildir: kişilerin ve grupların tutumundan ve kulübün kayıtlarından türetilen gizli bir özettir, hiçbir yerde sayı olarak görünmez (Reigns'in dört göstergesi alınmaz, §2). Başkan bir grubun ne durumda olduğunu merak ederse ilgili kişiye sorar; cevap o kişinin dürüstlüğüne ve tutumuna bağlıdır. Sportif başarı doğrudan bir grup değildir, dördünü dolaylı etkiler: şampiyon olup kasayı batıran başkan düşebilir, küme düşüp kulübü mali olarak kurtaran başkan kalabilir. Genel kurul bir ara sınavdır; başkanın uzun vadeli hedefleri (Avrupa'ya çıkmak, borcu sıfırlamak, altyapıdan oyuncu yetiştirmek, statı bitirmek) orada “miras” olarak okunur. Başarı finali (§1) ve seçim kaybının kariyeri bitirmemesi (§5) değişmez.

## 5. Görev dışında geçen dönem

Seçim kaybedilince kulüp ve lig yaşamaya devam eder. Yeni başkan kendi ekibiyle yönetir; başarısız olup eski başkana yol açması zorunlu değildir.

- Kulüp parasını kullanma, kadro kararlarına müdahale ve iç belgelere erişim yetkisi sona erer.
- Daha hızlı takvim akışıyla gelişmeleri takip eder, önemli konularda durabilir ve eylem seçebilirsin.
- Maçlara başkan koltuğundan farklı bir üye/davetli bölümünde veya uygun bir locada gidebilirsin. Kesin mekân düzeni ileride tasarlanacak.
- Açıklama yapmak, eski ekiple görüşmek, destek toplamak ve yeni seçime hazırlanmak mümkündür.
- İlişkiler devam eder; bazı insanlar yanında kalır, bazıları yeni yönetime yaklaşır.
- Kulübü desteklemekle yeniden seçilmek istemek arasındaki gerilim sahnelerde hissedilir.

Hızlandırma önemli olayları sessizce atlamamalıdır. Yeniden adaylık veya seçilmek garanti değildir; kupasız bir kariyer sonuna ulaşılması da mümkündür.

Görev dışındaki takip, başkanın erişebildiği haberleri ve katılabileceği gelişmeleri öne çıkarır. Boş günler birlikte ilerletilebilir; bu sırada yeni yönetimin kararları ve kulübün takvimi işlemeye devam eder. Oyunun kapalı olduğu gerçek sürede takvim ilerlemez.

## 6. Zaman, ajanda ve tempo

Üç süre birbirinden ayrılır:

| Süre | Anlamı |
|---|---|
| Takvim | İnşaat, ödemeler, fikstür, sözleşme, transfer ve seçim tarihleri |
| Gün içi zaman | Görüşmenin, yolculuğun veya maçın ajandada kapladığı zaman |
| Gerçek oynama süresi | Oyuncunun sahnede düşündüğü, konuştuğu, izlediği ve vakit geçirdiği süre |

İki oyun haftalık stat geliştirmesi, takvim iki hafta ilerleyince tamamlanır. Bu haftaların gerçek süresi gündeme göre değişebilir. Bir ekranı açık bırakmak kendiliğinden günleri tüketmez; zamanın hangi eylemle ilerlediği anlaşılır olur.

Ajanda; zorunlu, ertelenebilir ve isteğe bağlı işleri ayırır. Bekleyen görüşmenin veya süresi dolacak teklifin atlanacağı önceden anlaşılır.

### Ajanda ve son tarihler

**Kesin karar (2026-09-29; yeni akışta da korunur):**

- Zorunlu iş yapılmadan gün bitmez.
- Ertelenebilir iş ileri güne alınabilir. Gün bitince ertesi güne kendiliğinden kalır, ancak son günü geçilemez; son gününde yapılmadıkça gün bitmez.
- İsteğe bağlı iş yapılmazsa kaçırılır ve geçmişe yazılır.
- **Cevapsız kalma (kullanıcı kararı, 2026-10-02; 2.8H ile uygulandı):** Acil olmayan bir karar, cevabı gelmeden son tarihine ulaşırsa kartta önceden yazılı sonuç işler (ör. muhabir elindekiyle yazar, sponsorun erteleme isteği bedelsiz kabul edilmiş sayılır, hoca talebi reddedilmiş sayılır). İlerleme son cevap anında bir kez durup bunu gösterir; oyuncu yine ilerlerse sonuç bir kez işler ve “cevapsız” diye geçmişe yazılır. Zorunlu kriz kararlarının (maaş günü gibi) böyle bir sonucu yoktur; karar verilmeden geçilmez. Cevapsız kalma üçüncü düğme değildir, zamanın gerçek sonucudur.
- Bir işe katılmak başka işleri kaçırtacaksa bu önceden gösterilir. Zorunlu bir işle çakışan işe katılınamaz.

### Zamanın ilerleme kuralları

**Onaylı tasarım yaklaşımı (2026-09-30; ajanda ekranında kısmen uygulandı: okumada zaman durur, “İlerle” ile durma noktalarına gidilir, ekip işleri takvimle çalışır; balkondan antrenman gözlemi kontrollü ilerler ve telefon kararında durur, kısa iş gözlemin içinde geçer, uzun iş için gözlem bırakılır — 2.7):** Takvim, oyuncunun başlattığı eylemlerle ilerler. Sabah, öğle ve akşam ortamda ve insanların bulunabilirliğinde hissedilir; kısa telefon ile uzun görüşme aynı süreyi tüketmez.

| Durum | Takvimin davranışı |
|---|---|
| Mesaj, mevcut rapor veya karar seçeneklerini okumak | Durur; okuma ve düşünme hızı takvimi etkilemez |
| Görüşme, telefon veya yolculuk yapmak | Önceden belirtilen oyun içi süre geçer; çakışmalar önceden anlaşılır |
| Yeni araştırma veya pazarlık istemek | İlgili kişinin çalışma kapasitesi ve takvimde süre gerekir |
| Ekibe iş vermek | Ekip takvim ilerledikçe çalışır; başkan başka işlerle ilgilenebilir |
| Antrenman izlemek | Oyuncunun başlattığı gözlem süresince kontrollü ilerler; mesajı açıp karar verirken durur |
| Uyumlu işleri birlikte yapmak | Ortak zaman aralığı iki kez tüketilmez; iki yüz yüze görüşmeye aynı anda katılınamaz |
| Maç izlemek | Maçın izleme temposu ve takvimde kapladığı süre ayrı hesaplanır; izleme hızı (×1, ×2, ×4) oyuncunundur, önemli anlarda kendiliğinden normal hıza iner (U1, 2026-10-12) |
| Maçta telefonu açmak | Maç durur; telefon kapatılınca diğer duraklatma nedenleri yoksa aynı andan sürer |
| Genel “Duraklat” | Takvim ilerlemesi, maç ve sahnedeki bütün hareket/süreler durur; bilgi incelenebilir |
| Sonraki önemli gelişmeye ilerlemek | Rutin işler işlenir; gerekli karar, randevu veya önemli gelişmede durulur |
| Oyundan çıkmak | Takvim durur; kayıtlı durumdan devam edilir |

Mevcut bilgiyi tekrar incelemek yeni araştırma sayılmaz. Yeni bilgi toplamak ise insan ve zaman gerektirir. Bu ayrım, kararları rahatça düşünmeye izin verirken son tarihten önce sınırsız araştırma yapılmasını önler.

**Bugünkü uygulama (H2, 2026-10-26; TEST süreler):** kişiye yazmak başkanın zamanını harcamaz; bedeli cevabı beklemektir. Cevap gecikmeyle gelir (hoca 3 saat, yardımcı antrenör 2 saat, mali işler müdürü 90 dakika; mesai 09:00–18:30, dışına düşen cevap ertesi 09:30'a kayar, maç akşamına düşmez) ve İlerle cevabın anında durur; aynı kişiye cevabı gelmeden yeni soru sorulmaz. Görüşme önerisi bir karardır (aşağıda §8). Mali işler müdürünün raporu görünür rutin iştir, İlerle'yi durdurmaz; ilerleme özeti “Dosyada yeni rapor var.” der.

“Sonraki önemli gelişmeye ilerle” şu kurallara uyar:

- Ödemeler ve yetki içindeki rutin ekip işleri sırayla işlenir; her biri ayrı kesinti oluşturmaz, sonuçları özette görünür.
- Başkanın kararı gereken gelişmede veya ekip yetkisinin aşıldığı anda durulur. İlerleme sırasında doğan yeni işler de dikkate alınır.
- Randevuya yetişmek için gereken hareket saati ve yolculuk süresi hesaba katılır; son tarih ve zorunlu iş korumaları aşılmaz.
- Atlanacak isteğe bağlı işler ve kaçırılacak fırsatlar önceden gösterilir. Ret, erteleme veya yetki devri yalnız işin kendi kuralları izin veriyorsa kullanılabilir.
- Beklemede olan meselenin hangi haberi beklediği veya sıradaki mümkün eylem anlaşılır olur. Oyuncu aynı boş günü tekrar tekrar kapatmaya zorlanmaz.

**Uygulanan ilk kurallar (2.3, TEST değerleriyle):** Tek “İlerle” işlemi günü bitirmekle aynı değildir; bir sonraki durma noktasına gider. Durma noktaları: başkanın kararını gerektiren gelişme, sıradaki saatli işin başlangıcı, işleri birbiriyle çakışan günün başı. Gelecekteki zorunlu iş ilerlemeyi engellemez; ilerleme onun başlangıcında durur ve katılınmadan geçilmez. Başkana dönen kararlar saati serbesttir: geldikleri andan son cevap anına kadar istenen an verilir, bekleyen karar başka işe katılmayı kilitlemez; yalnız bitişi son cevap anını aşan işe katılınamaz ve ilerleme bu anı geçemez. Başkan bir işin içindeyken dolan zorunlu kararın süresi işin bitişinden 30 dakika sonrasına uzar. Bu, bütün telefon mesajlarına uygulanacak genel bir kural değildir; normal haberler işten sonra gösterilir.

Antrenman gözlemi sırasında kısa bir telefon işi aynı zaman aralığına sığabilir. Uzun ve tam dikkat isteyen görüşme için gözlemden ayrılınır. Mekânın atmosferi, takvimin durduğunu anlamayı güçleştirmemelidir; ayrıntılı sunum [stil rehberinde](STIL_REHBERI.md#8-baskı-ve-erişilebilirlik) tanımlanır.

**Genel duraklatma kararı (2026-10-01; 2.8B ve 2.8F ile uygulandı):** “Duraklat” oda, yürüyüş, balkon/antrenman, maç öncesi ve maç boyunca erişilebilir olur. Kamera, başkan, futbolcular, seyirciler, kapı, ışık/efekt hareketleri ve çalışan sunum sayaçları aynı anda donar. Menülerde gezinip mevcut bilgi okunabilir; zaman ilerleten veya dünyayı değiştiren komutlar devam edilene kadar kapalıdır. Açık maç telefonu maçı durdurur; telefon kapatmak oyuncunun elle duraklatmasını kaldırmaz. Antrenman gözlemi durdurulduğunda görünen saat ile kayıtlı kariyer zamanı aynı noktada olmalıdır; yalnızca önceden uygulanmış ilerlemenin saat animasyonunu durdurmak yeterli değildir. Teknik sınırlar [TEKNIK_PLAN §4](TEKNIK_PLAN.md#4-zamanın-ilerlemesi) içindedir.

Antrenman, boş stat veya kulüp odası gibi isteğe bağlı alanlarda vakit geçirilebilir. Telefon ve haberler bu ortamların içinde gelebilir. Uzun süre beklemek zorunlu bir yetenek veya bilgi kazancına dönüşmez.

Transfer gibi uzun olaylar farklı günlere yayılır: hazırlık, görüşme, haber bekleme, karşı teklif ve sonuç. İçerik temposu gerçek oynama süresi ölçülerek ayarlanır. Yoğun günleri kısaltmak için otomatik bir hedef konmaz; tekrarlar ve amaçsız bekleme azaltılır.

**Zaman geçiyor (kullanıcı tercihi, 2026-10-28; U4, bugünkü uygulama):** İlerle komutu hemen uygulanır; ardından kısa bir sahne geçen zamanı gösterir (saat kolları döner, olanlar saati gelince sırayla belirir: ödemeler, kaçırılan işler, hatırlatmalar, ay başı, gelen cevaplar, her sabahın gazetesi; en çok 2,5 sn) ve durak özeti kartıyla biter: yeni an, geçen süre, gelen birkaç şey, şimdiki ve sıradaki durak; ay başı, transfer dönemi ve sezon sonu kartın üstünde kapaktır. Sahne beklettirmez (tıkla, Enter, Esc, ya da bir düğmeye basmak). Durma kuralları değişmedi.

### Gün ve hafta ritmi

**Hedef (2026-10-26; Y3; saatler TEST):** gün 08:00'de masadaki günlük gazete (aşağıda; S-e ile uygulandı) ve asistanın brifingiyle (“bugün üç konu var”) ve gece gelen mesajlarla açılır. 10:00–12:00 antrenmandır, balkon isteğe bağlıdır. 12:00–14:00 kapı en çok bu saatlerde çalar, yüz yüze görüşmeler olur. 14:00–18:00 telefon, pazarlık ve dosya işleridir. Akşam ara sıra davet vardır (sponsor yemeği, rakip başkanla görüşme, taraftar derneği), kart zinciri olarak oynanır. Gün 20:00'de biter, transfer dönemlerinde 23:00'e kayar; gece dünya katmanı çalışır, sabah yeni kartlar düşer. Günü bitirmek ayrı bir düğme değildir: İlerle durakları ve yukarıdaki kesin kurallar sürer (zorunlu iş yapılmadan gün bitmez).

Hafta: Pazartesi maç sonrasıdır, oda sonuca göre şekillenir (yoğun); Salı–Perşembe antrenman ve asıl iş günleridir; Cuma maç öncesi basın toplantısı kartı ve hocanın kadro notu gelir; Cumartesi maç günüdür (az iş, yüksek duygu); Pazar boştur. Transfer dönemlerinde (yaz, kış) yapı sıkışır: iş çoğalır, gece mesajları artar; zorluk takvimden gelir, ayardan değil. Gazete günlüktür (aşağıda); Y0'ın “gazete haftalıktır ve Pazartesi sabahı masaya gelir” kararı (2026-10-26) 2026-10-27'de kalktı.

**Günlük gazete (kullanıcı kararı, 2026-10-27; S-e ile uygulandı; [YOL_HARITASI karar 54](YOL_HARITASI.md#geçerli-kararlar)).** Gazete haftalık değil günlüktür. Her sabah 08:00'de yeni sayı masadadır ve önceki günü anlatır (dün 08:00'den bu sabaha); manşet en önemli haberdir, maçın ertesi sabahı en kalın sayıdır, durgun günde sayı kısadır ya da “TEST: bugün haber yok” der. Okumak zaman almaz. Masada yalnız son sayı “yeni”dir; önceki sayılar arşivdedir ve aralarında gezilir. Gazete dünyanın büyük haberlerini taşır; akışın gerisi sonraki kanallardan gelir — TV, telefonla gelen haber ve gelip konuşanlar (bu turda yok; aşağıdaki aciliyet sırası). İçerik üretmek için uğraşılmaz: bütün metinler kısa TEST yer tutucusudur, kullanıcı değiştirir; Claude kendiliğinden oyun içeriği eklemez.

**Bugünkü uygulama (S-e, 2026-10-27; TEST önemler, eşikler ve metinler):** sayının kaynakları bizim maç (maç ertesi manşet), haftanın öbür sonuçları, puan durumu (maç ertesi ve Pazartesi), gol sıralaması (maç ertesi), sakatlıklar (bizim oyuncu en az bir hafta, öbür kulüpten en az iki hafta yoksa), yaklaşan maç (maç sabahı “Bugün …”, üç gün kalaya dek), sezon sonu, hoca değişimi (P12) ve transferdir; içerik paketleri kendi haberlerini kayıt defteriyle ekler. Olağan sayı en çok 6, kalın sayı en çok 8 haber taşır. Sayı kayda yazılmaz: her sayı kariyerin kayıtlı geçmişinden (maçlar, fikstür, geçmiş kayıtları) her açılışta aynı kurulur, eski sayı sonradan değişmez; kayda yalnız son okunan sayının tarihi girer. P12'nin hoca değişimi ve transfer artık ayrı haber kaydı değildir, ertesi sabahın sayısında geçmişten kurulur. Arşiv kariyerin başlangıç gününden başlar (sezona bağlanması H3'te). Gazetenin adı (bugün “Yerel Gazete (TEST)”) ve haber olmayan günde de “yeni” işaretinin yanıp yanmayacağı (bugün yanar) kullanıcıya açık sorudur ([§13](#13-kapsam-ve-açık-kararlar)). Teknik ayrıntı [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi) ve [araclar/plan/s-uygulama.md](araclar/plan/s-uygulama.md) (S-e).

**Aciliyet kanaldan anlaşılır (2026-10-27, Claude kararı; Y0'ın sırasını günlük gazeteye göre günceller):** gazete dünü anlatır (her sabah, acil değil) → TV bugünü anlatır (havuzda, [§13](#13-kapsam-ve-açık-kararlar)) → telefon kişiseldir (mesaj bugün, arama şimdi) → kapı yüz yüzedir (şimdi; Y2, [§10](#kişi-modeli)). Bugün yalnız gazete ve telefon mesajı çalışır. Odanın hâli de bilgi taşır: kötü sonuçtan sonra iş çoktur, telefon yanar; iyi sonuçtan sonra masa sakindir. Boş gün sakin gösterilir; iş yükü kotası yoktur (§10).

**Balkon:** antrenman izlenirken gelen kartlar zaman harcamaz, çünkü antrenmanın süresi zaten geçer; bu balkonun ödülüdür. Her kart balkonda açılabilir; ağır kartların (pazarlık, yüz yüze görüşme) dikkat bedeli vardır: kişi yanına gelir, antrenmandaki sinyaller (topallayan oyuncu, parlayan genç, hocayla tartışan kaptan) o sırada kaçar. Bir sinyale dokunmak küçük bir kart düşürür (“Doktora sorayım mı?”). Bugünkü kural (kısa iş gözlemin içinde geçer, uzun iş için gözlemden ayrılınır) bunun ilk hâlidir; ekranın yarısında antrenmanın görünüşü görsel turdadır.

**Bugünkü uygulama: antrenman programı ve balkon sinyalleri (S-a ve S-b, 2026-10-27; TEST eşikler ve metinler, kullanıcı değiştirir).** Hocanın haftalık programı tarzına ve maç takvimine göredir; saklanmaz, takvimden okunur: maç günü maç, hafta sonu dinlenme, maç ertesi ilk hafta içi günü toparlanma, maçtan önceki gün hafif, öbür hafta içi günleri yoğun (yoğun günün yükü hocanın tarzından: dikey ve direkt daha ağır, dengeli daha hafif). Bugünkü fikstürde hafta Pazar dinlenme, Pazartesi toparlanma, Salı–Perşembe yoğun, Cuma hafif, Cumartesi maçtır. Yoğunluk kondisyonun toparlanmasını ve gelişimi etkiler ([§9](#9-puan-göstermeyen-oyuncu-sistemi)). Antrenman saatleri 15:00–17:00 kalır (kullanıcı, 2026-10-27; yukarıdaki 10:00–12:00 Y3 hedefinin TEST saatidir). Balkondan izleyen başkan o günün gerçek durumundan **sinyal** görür: sakatlıktan dönen (dönüşüne üç gün kala takımdan ayrı, döndükten sonra takımla çalışır), yorulan (toparlanma ve yoğun günde), parlayan genç (21 yaş ve altı, henüz tavanında değil; gelişiyor ya da iyi gününde) ve formu düşen (son on birden). Günde en çok üç sinyal çıkar, aynı oyuncunun aynı sinyali yedi gün içinde tekrarlanmaz; sinyal izlenen aralıkta belirir, balkon şeridinde “Gördüklerin” listesinde durur ve oyuncunun dosyasına tarihli not olarak düşer (Kadro sekmesi, [§9](#9-puan-göstermeyen-oyuncu-sistemi)); şeritte günün türü de yazar (TEST). Sinyal gözlenebilir davranıştır, sayı değildir; para, moral ya da sonuç değiştirmez, iş ya da kart açmaz (sinyalden açılan kart Y3). **İzlemeyen bir şey kaybetmez:** oyuncular, maçlar ve hocanın seçimi izlesen de izlemesen de aynıdır; balkon bilgiyi erken ve başkanın kendi gözünden verir. Antrenmanda sakatlık yoktur; balkonun 3B sahnesindeki figürler bugün kariyerin kadrosu değildir (görsel tur).

**Bugünkü uygulama: balkon (R5, 2026-10-30; [YOL_HARITASI karar 66](YOL_HARITASI.md#geçerli-kararlar); TEST sayılar).** Balkonda sağ üstte **antrenman kâğıdı** durur: günün türü düz yazıdır (hocanın programı gözlenebilir bilgidir: “Bugün yoğun çalışma”, “Bugün toparlanma: maçta çok oynayanlar esniyor, yavaş koşuyor”, “Bugün hafif çalışma: maç arifesi”, dinlenme ve maç günü), gözlemin durumu ve düğmeleri, **Gördüklerin** (o gün görülen bütün sinyaller; ada dokununca oyuncunun dosyası sağ yarıda açılır). Sahadakiler kariyerin bugünkü kadrosudur (transferle gelen ertesi antrenmanda sahada, sakat sahada yok, dönüşüne üç gün kalan sakat fizyoterapistle ayrı koşuda); gruplar hocanın programına göredir: yoğun günde ısınma koşusu, pas çemberi ve şut; toparlanmada son maçta 60 dakikadan çok oynayanlar esneme ve yavaş koşu, öbürleri pas ve şut; hafif günde koşu yok. Kaleci kalede, ikinci kaleci kenarda. Düzen kayda yazılmaz, saf okumadır (`antrenmanDuzeni`); sinyaller ve gözlem kuralı değişmedi. Ayarlar › Geliştirici'de **“Balkonda her saat antrenman (TEST)”** yalnız görüntüdür: saha her saat dolu görünür, gözlem ve sinyal yine antrenman saatindedir. Balkonda iş sağ yarıda açılır, saha solda canlı kalır (U6; dar karede iş geniş).

**Anlık kart:** gerçek zamanda kısa cevap isteyen kart (çalan telefon, canlı yayın sorusu, antrenmanda kavga) yalnız doğal yerinde ve nadiren gelir; günlük kota yoktur. Süre dolunca sonuç nötr değil, kartta yazılı varsayılandır (“başkana ulaşılamadı”). [§10 “Süreli cevaplar”](#süreli-cevaplar) kuralları geçerlidir; süre göstergesinin görünüşü görsel turda, sesi Aşama 10'dadır.

### İlk tempo ölçümleri ve oturum devamlılığı

**Onaylı ölçüm yaklaşımı (2026-09-30):** Aşağıdaki aralıklar ilk oynanış denemelerinin hedefleridir; ölçülmüş sonuç, zorunlu süre veya kesin denge değildir. Yoğun günlerin yaklaşık bir saat veya daha uzun yaşanabilmesi korunur.

| Deneyim | Gerçek oynama süresi için ilk hedef |
|---|---|
| Sakin gün | 1–5 dakika veya boş günleri birlikte ilerleme |
| Olağan yönetim günü | 5–15 dakika |
| Yoğun gün | 30–60 dakika; gerektiğinde daha uzun |
| Hafta (2026-10-26) | Sakin hafta 5–10 dakika, olağan hafta 15–25 dakika, yoğun ya da transfer haftası 40–60 dakika; olay yoğunluğundan çıkar |
| Maç | Mevcut 10–15 dakika hedefi (U1, 2026-10-12: motorun maçı 20 dk; ×2 ile ~13, ×4 ile ~8,5 dk izlenir — önemli anlar normal hızda) |
| Toplam maç günü | Yaklaşık 20–35 dakika; tören ve çevresindeki içerik ayrıca ölçülür |
| Normal sezon | Yaklaşık 20–35 saat; fikstür, yetki devri ve katılım tercihleriyle birlikte sınanır |

İçerik, bir süre kotasını doldurmak için üretilmez. Kariyerin uzunluğu anlamlı sezonlardan, sonuçlardan ve gelişimden gelir; boş bekleme veya gerçek dünyada bekleme şartı konmaz. Her günü bir saate uzatmak hedeflenmez. Kesin maç sayısı ve kariyer uzunluğu bu tablodan çıkarılmaz. Tablo zorunlu süre değil ölçüm hedefidir: gerçek sezon süresi tekrarlar, karar yoğunluğu ve oyuncunun sıkıldığı noktalarla birlikte ölçülür; uzun kariyerin toplam süresi ayrıca değerlendirilir. **Kullanıcı kararı (2026-10-26):** sezon süresi kısılmaz; sistem tasarım taslağındaki “sezon yaklaşık 10 saat” hedefi alınmadı. Süre eğlenceden ve olaylardan çıkar, 10 saati geçebilir; tablo alt ya da üst sınır değildir, dengeyi Y4'teki ölçüm kurar.

Kısa bir oturumda bir mesele ilerletilebilmeli; yoğun bir gün birkaç oturuma bölünebilmelidir. İlk hedef, tamamlanan kararların ve güvenli sahne geçişlerinin gün içinde kaydıdır. Dönüşte son karar, beklenen haberler ve yaklaşan önemli tarih kısa biçimde hatırlatılır. Maç veya görüşmenin tam ortasından devamın kapsamı [teknik planda](TEKNIK_PLAN.md#5-kayıt-ve-yükleme) ayrı tutulur. Bugünkü uygulama her tamamlanan kararın ardından kaydeder (2.4); maç sınırında kayıt yapılmaz. **Kullanıcı kararı (2026-10-02):** telefondaki “Kaldığın yer” dönüş özeti kaldırıldı (2.8L); dönüşte oyun kaldığı yerden, odada sakin açılır.

## 7. Ekonomi, yetki devri ve kişisel katkı

Oyuncu; mevcut nakdi, gelecek ödemeleri ve yaptığı taahhütleri görebilir. Nakit, dönem bütçesi ve ileri tarihteki yükümlülükler aynı değer değildir.

Sayman bir anlaşmanın gelecek ödeme günlerine etkisini anlaşılır biçimde açıklar: örneğin yeni taksidin maaş günüyle çakışması. Özetin dayandığı tutar ve tarihler ayrıntıda görülebilir; gelecekteki belirsiz gelir kesin para gibi sunulmaz.

Gelir/gider alanları: bilet ve doluluk, sponsor, yayın geliri, maaş, transfer ve menajer bedelleri, sözleşme primleri, tazminat, tesis ve stat yatırımları. Ayrıntı düzeyi başkanın kararını değiştirdiği ölçüde artırılır.

Başkan oyundaki mali kurallar çerçevesinde sınırlı kişisel katkı yapabilir. Şirketi yönetilmez. Katkının biçimi, sınırı, geri ödemesi olup olmadığı ve kulübün mali değerlendirmesine etkisi açıkça gösterilir. Bunlar henüz seçilmemiş oyun kurallarıdır; güncel gerçek düzenlemelerin birebir uygulandığı iddia edilmez.

Ekonomik daralma; taraftarın alım gücü, sponsorun ödeme gücü ve kulüp giderleri gibi birkaç anlaşılır bağlantıyla hissedilir. Ayrı bir ülke ekonomisi simülasyonu kurulmaz.

Yetki devrinde kişi, iş, bütçe tavanı, süre ve başkana dönülecek durumlar belirlenir. İyi ekip hem fırsat üretir hem iş yükünü azaltır. Bir üyeyi almak veya kişisel para koymak ekonomi sorununu kalıcı biçimde çözmez.

**Onaylı tasarım yaklaşımı (2026-09-30):** Tavsiye istemek karar sorumluluğunu başkanda bırakır; yetki devri, kişinin tanımlı sınırlar içinde işi yürütmesini sağlar. Tek iş yanında kalıcı sorumluluklar da tanımlanabilir. Ekibin kapasitesi ve bekleyen işi anlaşılır olmalı; yetkili olduğu rutin adımlar için tekrar tekrar onay istenmemelidir.

İşe uygun yönetici uzmanlığı veya ilişkileri sayesinde bazı işleri başkandan daha iyi çözebilir. Başkanın şahsen katılması da bazı görüşmelerde özel ağırlık taşıyabilir. Bütün işlerde en iyi sonucu kişisel katılıma bağlamak oyuncuyu her işi yapmaya yöneltir; denge testleri bunu özellikle kontrol eder. Bugünkü sponsor denemesinin sonuçları bu dengeyi kanıtlamaz. Devredilen işin üç kalitede dönüşü ve personelin konu başına yeteneği [§2 “Dosya şablonları”](#dosya-şablonları) içindedir (hedef, 2026-10-26).

**Bugünkü uygulama (G2, 2026-10-24 gece; TEST tutarlar, kullanıcı değiştirir; YOL_HARITASI karar 44):** her oyuncunun ve hocanın sözleşmesi vardır (aylık maaş ve bitiş: bu sezonun, bir ya da iki yıl sonrasının 31 Mayıs'ı). Maaş oyuncunun gizli kabiliyetinden gelir (genç ×0,6, 32 yaş üstü ×0,85); Demirkapı'nın 22 oyuncusu ve hocası ayda ~490 bin ₺. **Ay başı** (her ayın 1'i 10:00, takvimde görünen rutin iş): maaşlar ödenir, lig yayın payı (100 bin ₺) gelir. **Maç günü geliri:** iç saha maçından sonra bilet (stat kapasitesi × doluluk × 150 ₺; Demirkapı'da ~1.150 seyirci, ~172 bin ₺); deplasmanda ve hükmende yok. Kasa yavaş erir: sürekli kriz de bedava para da yok; kasa eksiye düşebilir; raporda kırmızı görünür ve müdür uyarır (kriz içeriği kullanıcının, P01). **Mali rapor** (H2-d, 2026-10-26; odadaki Kasa düğmesi ve 6 tuşu kalktı, kullanıcı istekleri 1–2): TEST mali işler müdürü her Pazartesi 09:00 kısa özet bırakır — kasadaki para, kesin ödemelerle 90 gün içindeki en düşük bakiye ve tarihi, 90 gün sonraki kesin bakiye, bilet tahmini “belirsiz gelir” olarak ayrı (kesin para sayılmaz). Ayın 1'inde maaş ve lig payından sonra ayrıntılı rapor gelir: aynı satırlara ek aylık maaş yükü, bekleyen gelir ve gider, ödeme takvimi ve geçen ayın hareketleri; o Pazartesi ayın 1'iyse kısa özet yazılmaz. Raporlar dosyanın Raporlar sekmesindedir; sayıları yazıldıkları anındır, sonradan değişmez. Kasa eksiye düşünce müdür bir kez kısa uyarı bırakır (yeniden eksiye düşene dek ikinci uyarı yok). Müdüre telefonda “Kasa ne durumda?” diye sorulur (günde bir; cevap 90 dakika sonra, cevap anının sayılarıyla). Sezon sonu kaydından sonraki ilk Pazartesi raporundan sonra zincir durur (yeni sezon H3). Öbür kulüplerin sözleşmeleri vardır, kasaları yoktur. Sponsor, prim, taksitli transfer ve sayman değerlendirmesi sonraki işlerdir (4.1, 4.4, 5.5).

## 8. Görüşmeler ve futbol yapılanması

### Transfer ve sponsor görüşmeleri

Başkan önemli anlaşmalara doğrudan katılabilir; rutin işler ekibe bırakılabilir. Araştırma, ilk temas, koşullar, karşı teklif, son tarih ve imza aşamaları gerektiği kadar kullanılır. Her transfer bütün aşamalarda kriz üretmez.

Örnek gelişmeler: menajerin ek talebi, oyuncunun aile veya rol beklentisi, rakibin teklifi, basına sızma, ücret artışı, sağlık değerlendirmesi veya sorunsuz imza. Gelişmeler ilgili kişilerin çıkarları ve mevcut şartlarla bağlantılıdır.

Sponsor görüşmelerinde para kadar ödeme tarihi, taahhüt edilen haklar, taraftarın yorumu ve gelecekteki hareket alanı önemlidir. Kabul, bekleme, yeniden pazarlık ve çekilme seçeneklerinin maliyeti bulunabilir.

Kaçan transfer, bozulan anlaşma veya geciken gelir sonrasında şartlara uygun alternatif arayışı, yeniden planlama ya da ilişkiyi telafi girişimi bulunabilir. Başarısızlığın bedeli ve verilen sözler korunur; her sorun kariyeri kapatan bir çıkmaza dönüşmez. Sorunsuz anlaşma yolu da çalışır.

**Bugünkü uygulama (G2, 2026-10-24 gece; transfer iskeleti, TEST metinler ve tutarlar; YOL_HARITASI karar 44):** yalnız sorunsuz yol vardır; araştırma, karşı teklif, menajer, sızıntı ve pazarlık (4.2–4.3) yoktur. Kış transfer dönemi 4–31 Ocak. **Gelen teklif:** dönemde üç kez (7, 16 ve 26 Ocak 11:00) tabloda üstümüzdeki bir kulüp en değerli altı saha oyuncumuzdan birine teklif yapar (bedel oyuncunun TEST değerinin 0,9–1,2 katı); dosyada oyuncunun sözleşmesi, sezonu ve hocanın görüşü; **[Sat] / [Reddet]**, cevapsız kalırsa teklif geri çekilir. H1'den (2026-10-26) beri hocanın görüşü telefonda da hocanın mesajıdır (dosyadaki cümlenin birinci tekil eşi, TEST): hocanın konuşmasında “Bu konuda karar dosyada bekliyor · Dosyayı aç ▸” durur, telefon karar gerektiren haberi bildirir; karar dosyada kalır, cevaptan sonra konuşmaya giden mesaj yazılmaz. Satışta oyuncu karşı kulübe geçer, bedel ertesi gün kasaya girer, kadro gençle 22'ye tamamlanır, ilk on birdeki yeri yedekten dolar. **Hocanın isteği:** 5 Ocak'ta hoca telefonda ligin aynı hattına göre en zayıf hattı için takviye ister (bonservis bütçesi ve maaş tavanı); **[Bütçeyi onayla] / [Reddet]**; onayda 5 gün sonra imza: serbest oyuncu varsa bedelsiz, yoksa tabloda altımızdaki kulüpten bütçeye uyan en iyi oyuncu, yoksa “bulunamadı”; hoca teşekkür eder. **Sözleşme sonu:** sezon sonunda sözleşmesi biten her oyuncu için sırayla kart: **[Yenile]** (iki yıl, maaş en az eskisi ve bugünkü değeri, ×1,1) / **[Bırak]** (oyuncu serbest kalır); bir hafta beklenebilir, cevapsız kalırsa imza yoktur ve oyuncu ayrılır. Öbür kulüplerin ve hocaların sözleşmeleri kendiliğinden bir yıl uzar. Kulüpler arası (bizim dışımızda) transfer, yaz dönemi ve yeni sezon yoktur (5.1). Hoca değişiminde tazminat görevden alınan hocanın sözleşmesinden gelir (kalan ay × maaş).

**Görüşme önerisinde “biz önerelim” (kullanıcı tercihi, 2026-10-28; U3, bugünkü uygulama):** hoca ya da yardımcı görüşme saati önerince kartın ikinci cevabı “Şu gün olsun: <gün saat>”tır: başkanın defterinden, şimdiden en az bir saat sonra, yarım saat adımla, mesai içinde, maç günü ve antrenman saati dışında, hocanın önerisinden önceki ilk boş an (öneri kabul edilemiyorsa 14 gün içindeki ilk boş an). Karşı taraf hemen kabul eder (TEST; kişinin kendi ajandası Y2 ile gelir). Böyle bir an yoksa eski “Başka gün iste” kalır (masada bekleyen kartta zaman geçtikçe an kalmazsa ikinci cevap buna döner). Bedeli: “daha geç bir gün iste” yolu doğal oyunda neredeyse görünmez. R2'den (2026-10-29) beri hocanın kendi önerisi de antrenmanla çakışmaz: saatler 11:00 ve 17:30 (eskiden 15:00; borç defteri B52).

### Teknik direktör

Hoca; geçmiş kariyeri, oyun anlayışı, kadroyla uyumu, gençlerle çalışması, iletişimi ve kriz davranışı üzerinden değerlendirilir. Gizli yetenekleri çok boyutludur. Ün veya tek bir toplam değer en doğru seçim anlamına gelmez.

Hoca gözlemine ve bilgisine göre kadro/taktik seçer; hataları eksik bilgi, tercih, baskı ve değerlendirme kabiliyetiyle açıklanabilir. Gerçek oyuncu özelliklerini kusursuz bilen bir seçim makinesi veya sürekli rastgele hata yapan biri olmaz.

**Bugünkü uygulama (F3, 2026-10-24; TEST değerler):** her kulübün bir hocası vardır (kişi): adı, tarzı (konumsal, ilişkisel, dengeli, dikey, kanat ve orta, direkt) ve gizli iki değeri — bilgi (oyuncuları ne kadar doğru tanıdığı) ve ısrar (son on bire bağlılığı). Maç kadrosunu hoca seçer: yuvadaki role göre değerlendirir (kanatta hız ve sürüş, stoperde kafa ve müdahale, merkezde pas ve görüş…), tarzının istediği oyuncuya hafif yönelir, bilgisi düşükse bazı oyuncular hakkında kalıcı yanılgı taşır, ısrarcıysa son on biri korur; sakat ve cezalı oynamaz. Takım maçta hocanın tarzıyla oynar; bültende hocanın adı ve tarzı yazar. Başkan kadroya ve tarza dokunmaz; maç içi hoca kararları (tarz değişikliği) ve hocayla görüşme sonraki işlerdir (Z7-2, F6-a). Demirkapı'nın hocası Şükrü Hoca direkt, Akdeniz'inki Nuri Hoca konumsal oynar; öbür kulüplerinkiler TEST üretimidir.
**Bugünkü uygulama (H2-c, 2026-10-26; TEST metinler ve süreler, kullanıcı değiştirir; YOL_HARITASI karar 50):** hoca ve TEST yardımcı antrenör telefonda Mesajlar'da her zaman durur; başkan onlara hazır konulardan yazar: “Maçı nasıl gördün?” (son oynanan maç; hoca sözlü ve kendi lehine yorumlayabilir, yardımcı rakamla: şut, isabet, beklenen gol, topa sahip olma, öne çıkan oyuncu), “Takım ne durumda?” (günde bir; hoca rakamsız, yardımcı sıra, puan, son beş maç, sakatların dönüşü, cezalılar) ve “Görüşelim”. Görüşme isteğine kişi ertesi günden başlayarak 14 gün içinde maç günü olmayan ilk uygun saati (11:00 ya da 17:30; R2'den önce 15:00) önerir; öneri tek karttır [Kabul et / Şu gün olsun] (U3; yukarıda); kabul deftere 45 dakikalık isteğe bağlı randevu yazar, katılınca kısa TEST özet; en çok üç öneri; yer yoksa “Uygun olduğunuzda yazın başkanım.” Hoca değişince eski hocaya bekleyen soru, görüşme önerisi ve randevu düşer (“Cevap gelmedi.”); hocanın isteği düşer, gelen teklif kulübün kararı olarak kalır. Gizli değerler hiçbir cevapta sayı olarak geçmez.

**Bugünkü uygulama: oyuncu sorusu ve tek bekleme satırı (R2, 2026-10-29; TEST metinler ve eşikler, kullanıcı değiştirir; [YOL_HARITASI karar 61](YOL_HARITASI.md#geçerli-kararlar)).** Karar 60'ın ilk somut örneği: sakin günde merak bilgi verir. Hocaya ve yardımcı antrenöre “Oyuncu hakkında sor” yazılır; oyuncu telefonun yanındaki iş panelinde kadrodan (mevkiye göre; yalnız forma ve ad) seçilir ya da oyuncunun dosyasında “Hocaya sor ▸” ile aynı soru doğrudan gider. Cevap birkaç saat sonra gelir, İlerle cevapta durur. **Hoca kendi gözüyle konuşur:** kalıcı görüşüyle (günlük fark yok) oyuncuyu mevkisindekiler arasında tartar; seçtiği on birdeki oyuncu “ilk tercihlerimden”, ona yakın olan “rotasyonda”, öbürü “şimdilik planımda değil”; sakat ve cezalı için dönüşü; yorgunluk, form ve gençlik izlenimi. Hoca yanılabilir, ama sözü seçtiği on birle tutarlıdır; başkan sonraki maçlarla karşılaştırabilir. **Yardımcı rakamla konuşur:** bu sezon maç, dakika ve gol; son beş maçta kaç maçta, kaç dakika oynadığı; sakatlık dönüşü, ceza, koşu verisinde düşüş. Cevap oyuncunun dosyasına tarihli not olarak düşer (kaynak kişinin adı). Gizli değer, puan ya da sıra numarası metinde geçmez. Kişiye yazılmışken cevap gelene dek o kişiye ikinci soru yoktur (başka oyuncu için de); bu bekleme iş panelinin üstünde bir kez yazılır (“Şükrü Hoca'dan cevap bekleniyor. Yarın 09:30 civarı.”), konular kapalı görünür ve altlarında yalnız açıklamaları kalır; konuya özgü engel (ör. ayarlanmış görüşme) o konunun satırındadır.
**Bugünkü uygulama (F6-a, 2026-10-24; P12 TEST taslağı, YOL_HARITASI karar 35 ve 42; metinler ve eşikler TEST, kullanıcı değiştirir):** kötü gidişte (bugünkü hocayla son 3 maçta en çok 1 puan ya da son 5 maçta galibiyet yok) maç akşamı 21:30'da “Hocaya sabır mı, değişim mi?” dosyası açılır. Kanıt puan durumu ve maç raporlarıdır (beklenen gol, tarzın sahadaki izi); hoca telefonda zaman ister. İki cevap: **sabır** — hocaya 3 maç süre, söz verilir (üçüncü maçın akşamı süre dolar; söz tutulur, kötü gidiş sürüyorsa konu yeniden açılır); **değişim** — ertesi gün iki adayla sırayla görüşülür (adayın tarzı ve kendi cümlesi; gizli değerleri görünmez), biri göreve alınır ya da mevcut hocayla devam edilir. Yeni hoca kadroyu ve tarzı sonraki maçtan başlayarak belirler; eski hocaya tazminat ödenir, yerel gazetede haber çıkar (S-e'den beri ertesi sabahın sayısında, geçmişten kurulur; [§6](#gün-ve-hafta-ritmi)). Cevapsız kalırsa hoca görevde kalır, söz verilmez. Hocanın takıma oturma süresi ve baskının yönetim ve taraftar kaynakları F6-b ve Aşama 4'tedir; tazminat G2'den beri sözleşmeden gelir (§8 transfer notu).

**Bugünkü uygulama: rotasyon (S-a, 2026-10-27; TEST değerler, kullanıcı değiştirir; [YOL_HARITASI karar 54](YOL_HARITASI.md#geçerli-kararlar)).** Hoca on biri seçerken oyuncunun o günkü kondisyonunu ve formunu da tartar ([§9](#9-puan-göstermeyen-oyuncu-sistemi)): yorgun oyuncuyu dinlendirir, yerine benzer bir yedek girer; formu iyi olanı öne alır (eski maç başı form zarının yerine kayıtlı form). Bütün kulüplerde geçerlidir. Dinlendirmek hocanın tercihidir, uygunluk kuralı değildir: yorgun oyuncu oynayabilir, sakat ve cezalı yine oynamaz, 11 uygun oyuncu ve hükmen kuralı değişmez; bilgi ve ısrar aynen işler. Başkan rotasyona dokunmaz, ondan haberdar olur: “Takım ne durumda?” sorusuna hoca kimin yorgun, kimin iyi günlerinde olduğunu rakamsız söyler, yardımcı antrenör koşu verilerindeki düşüşü adıyla yazar (H2-c, yukarıda); önceki maçın on birinde olup uygunken oynamayan oyuncunun dosyasına “on birde yoktu” notu düşer (Kadro sekmesi). İlk ölçüm (6 hafta, bilgi; denge kararı değil): kulüp-maç başına ~0,5 dinlenen oyuncu, aynı oyuncu en çok iki maç üst üste dışarıda. Maç bülteninde “dinlendirildi” satırı yoktur; istenip istenmediği ve rotasyonun hızı kullanıcıya açık sorudur ([§13](#13-kapsam-ve-açık-kararlar)).

## 9. Puan göstermeyen oyuncu sistemi

Üç katman korunur:

1. Oyuncunun gerçekte sahip olduğu gizli özellikler ve mevcut durumu.
2. Hoca ve gözlemcilerin onun hakkında bildikleri veya tahmin ettikleri.
3. Başkanın gördüğü rapor ve kanıtlar.

Yetenek ve potansiyel için sayısal puan, yıldız, güç çubuğu veya bunların harf notu karşılığı kullanılmaz. Yaş, boy, dakika, gol, maaş, sözleşme ve sakatlık geçmişi gibi gözlenebilir sayılar gösterilebilir.

Rapor; belirgin özellik, gözlem tarihi, gözlem kaynağı ve belirsizliği anlatır. Örnek: “Hava toplarında etkili; dar alanda dönüşü ağır. İki maç izlendiği için baskı altındaki kararları hakkında yeterli bilgi yok.”

**Kaynak güvenilirliği ve oyuncu dosyası (hedef, 2026-10-26; Y1–Y2).** Bilgi iki türlüdür. **Sert veri** dosyadadır ve kesindir: yaş, mevki, uyruk, maç, gol, asist, dakika, sözleşme bitişi, maaş, serbest kalma bedeli, sakatlık geçmişi, menajerin adı. **Yumuşak veri** insanlardan gelir ve belirsizdir: ne kadar iyi olduğu, karakteri ve soyunma odasına uyumu, gerçek piyasa değeri, gelecek potansiyeli, kulübünün onu satmaya ne kadar istekli olduğu. Oyunun stratejik derinliği bu ikisi arasındaki boşluktan doğar. Her kişinin her konuda farklı, gizli bir isabeti vardır: gözlemci gençlerde iyi, tecrübelilerde kötü olabilir; hoca kendi istediği oyuncuyu abartır; menajer hep abartır. İsabet gösterilmez; başkan birkaç transferden sonra kime güveneceğini kendisi öğrenir. Çelişen görüşler kuraldır, uyum istisnadır. Bilgi almanın bedeli vardır: gözlemci göndermek gün ve para ister, hocaya sormak beklenti yaratır (“madem sordun, al”), rakip başkanla yemek bilgi verir ama sızar.

**Kadro sekmesi** Dosya'dadır (karar, 2026-10-26). Oyuncu dosyası sert veriyi ve kartlardan biriken tarihli, kaynaklı notları taşır (ör. “[Gözlemci, 14 Ağustos] Ofansif katkısı iyi, bire bir savunmada zayıf.” / “[Hoca, 3 Eylül] Bana tam uyar.”); dosya zamanla kalınlaşır ve başkanın kendi arşivi olur. Oyuncu satırında yalnız gözlenebilir sayılar durur; “form” gibi türetilmiş değer, çubuk ya da yıldız yoktur. Oyuncu dosyasından o kişiyle ilgili girişim açılabilir (menajeri ara, hocaya sor, gözlemci gönder).

**Bugünkü uygulama: Kadro sekmesi (S-c, 2026-10-27; TEST metinler).** Dosya'da Raporlar'ın solunda Kadro sekmesi vardır; konu ve rapor yokken dosya Kadro ile açılır, böylece masada dosya hep durur. Liste tek sayfadır ve yalnız gözlenebilir sayıları taşır: forma, ad, mevki, yaş, bu sezonun maç ve dakikası, gol, kart (sarı / kırmızı), durum (sakatlık ve dönüş günü, ceza), sözleşme bitişi ve aylık maaş. Ada dokununca iki sayfalı oyuncu dosyası açılır: solda künye, bu sezon, durum ve sözleşme; sağda yeniden eskiye tarihli, kaynaklı notlar — antrenman (balkon sinyali, [§6](#gün-ve-hafta-ritmi)), maç (gol, kart, sakatlık, “on birde yoktu”) ve hoca (“Takım ne durumda?” cevabında adı geçtiyse). Notlar okurken kayıttan kurulur, kaynaklarını içerik paketleri kayıt defteriyle genişletebilir; gizli değerin sayısı hiçbir notta yoktur. Okumak zaman almaz, karar değildir; oyuncular arasında gezilir. Devralınan 1–12. haftaların maç ve dakikası TEST üretimidir; sürüm 10 kaydında bu iki sütun “—” kalır (kullanıcıya açık soru). Hedefin gözlemci ve menajer notları ile dosyadan girişim açma kısmı Y1–Y2'dedir.

**Maaş piyasanın algısıdır (R6-a, 2026-10-30; TEST).** Maaş oyuncunun gizli yeteneğinden doğrudan türemez: piyasanın algısı (gizli ortalama + oyuncuya özgü kalıcı ±8 puanlık sapma + eski yıldıza ün payı) ve yaş. Maaş yeteneğin kaba göstergesi kalır, sırası değildir (yaştan arınmış sıra korelasyonu 0,997'den 0,75'e indi): “pahalı ama vasat”, “ucuz ama iyi” oyuncular vardır; gerçek yetenek gözlemle, izlemeyle ve hocanın görüşüyle ayrılır. Kayıtlı sözleşmeler değişmez.

**Kamuya açık bilgi: Canlı Skor (R3, 2026-10-29; [YOL_HARITASI karar 64](YOL_HARITASI.md#geçerli-kararlar)).** Canlı Skor herkesin görebildiği lig bilgisidir; ligin her kulübü ve oyuncusu aynı biçimde görünür. Gösterilenler: skor ve olaylar (gol, kart, oyuncu değişikliği, maçta görülen sakatlık ve bölgesi; dakikasıyla), maç istatistiği ve beklenen gol, dizilişler, ilk on bir ve yedekler, maç öncesi eksiklerin türü (sakat, cezalı); oyuncunun künyesi (forma, mevki, yaş, ayak, kulüp), bu sezonun maç, dakika, gol ve kartı, maç maç dökümü; kulübün tablodaki yeri, sonuçları, kadrosu (gözlenebilir sayılarla), hocası ve stadı. Gösterilmeyenler: maaş, sözleşme, sakatlığın dönüş tarihi ve doktor notu (başkanın kendi kulübü için Dosya'dadır) ile gizli değerler (yetenek, kondisyon, form ya da bunların yerine geçen puan).

Gelişim; teknik, fiziksel ve zihinsel alanlarda farklı ilerler. Yaş, oynama süresi, antrenör, tesis, çalışma alışkanlığı, sakatlık ve uyum etkilidir. Form, yorgunluk ve moral ile kalıcı yetenek değişimi birbirine karıştırılmaz. Altyapı yatırımı yıldız çıkma ihtimalini ve gelişim ortamını iyileştirir; garanti yıldız üretmez.

**Bugünkü uygulama: oyuncunun haftası (S-a, 2026-10-27; TEST değerler, kullanıcı değiştirir; [YOL_HARITASI karar 54](YOL_HARITASI.md#geçerli-kararlar)).** Bütün kulüplerin oyuncularında üç gizli durum vardır; hiçbiri hiçbir ekranda sayı, çubuk ya da harf olarak görünmez (yalnız geliştirmedeki Test bilgileri panelinde):

- **Kondisyon** oynanan dakikayla düşer, günlerle toparlanır. Yaşlı ve dayanıksız oyuncu daha çok düşer ve daha yavaş toparlanır; kalecide düşüş azdır; sakatken toparlanma olmaz, yeni sakatlık ayrıca eksik bırakır. Toparlanma antrenman gününün türüne bağlıdır: dinlenme günü en çok, yoğun gün en az toparlar ([§6](#gün-ve-hafta-ritmi)).
- **Form** maçtan maça yavaş değişir; gol ya da sonuçla beslenmez, moral yoktur (Y0; beslenip beslenmeyeceği kullanıcıya açık soru).
- **Gelişim** haftalık, küçük ve kalıcıdır: gençler yükselir, 30 yaş üstü yavaş düşer. Antrenman yükü ve oynama süresi hızı, hocanın tarzı ve oyuncunun rolü hangi özelliğin geliştiğini belirler. Her oyuncunun gizli bir tavanı vardır; garanti yoktur, bazı gençler hiç gelişmez. Gelişim gerçek özelliğe yazılır, bu yüzden sözleşme yenilemede maaşa ve transfer değerine de yansır.

Maçta kondisyon ve form oyuncunun özelliklerine küçük çarpan olarak girer (kondisyon en çok ~%5, form en çok ~%3); maç motoru değişmedi. Hoca bu iki durumu tartar ([§8 rotasyon](#teknik-direktör)). Başkan bunları sayıdan değil kaynaktan öğrenir: hocanın ve yardımcının sözü, balkondaki sinyal, maçın kendisi ve oyuncu dosyasının notları. Sürüm 10 kaydında oyuncular tam kondisyon ve nötr formla açılır. Moral, antrenmanda sakatlık ve kondisyonun uygunluk kuralına girmesi yoktur. Ayrıntı [araclar/plan/s-uygulama.md](araclar/plan/s-uygulama.md) (S-a), gizli değerin sınırı [TEKNIK_PLAN §7](TEKNIK_PLAN.md#7-gerçek-özellik-ile-bilgi-arasındaki-sınır).

## 10. İlişkiler, medya ve olayların hafızası

### Tanıdık kişiler, başkanlık üslubu ve mizah

**Onaylı yön (2026-10-02; küçük deneme önce, tam ilişki sistemi sonraki aşamalarda):** Mevcut tavsiye, söz, gazete ve görünür iz temeli genişletilir. Önce az sayıda mevcut kişi tanınır hâle getirilir: kişinin neyi önemsediği, konuşma biçimi ve başkanla gerçekten yaşadığı önemli geçmiş ayrışır. Sabit bir şaka/kişilik kalıbı bütün davranışının yerine geçmez; görüşü bilgi ve kendi öncelikleriyle tutarlıdır. Farklı uzman görüşleri kısa ve kaynakları belli olabilir; gizli yetenek puanı veya her şeyi bilen danışman sunulmaz.

Mizahın yönü samimi kasaba kulübü hayatıdır: mütevazı imkânlar ve büyük hedefler, küçük alışkanlıklar, önceki olaylara yeni bağlamda göndermeler. Kısa metin karakteri, durumu ve kararın anlamını birlikte taşır. Herkes sürekli espri yapmaz; ciddi meselelerin ağırlığı korunur. Komik cevaba saklı ağır ceza veya belirsiz mali taahhüt yüklenmez. Aynı şaka yeni görev adıyla tekrar edilmez; küçük olumlu anlar sırf moral/puan toplama işine çevrilmez. Nihai cümleler ve karakter ayrıntıları uygulayıcının tasarım alanıdır.

Başkanlık üslubu ileride yaşanmış davranışlar üzerinden insan tepkilerine yansıyabilir; başlangıçta değişmez karakter sınıfı veya görünür kişilik çubuğu seçilmez. Oyuncu yaklaşımını değiştirebilir. Özel konuşma ile kamuya verilmiş söz ayrılır; medya gerçekte söylenmemiş bir cümleyi eski vaat diye üretmez. Mesaj eki, fotoğraf, maçtaki tanıdık komşu ve oda hatırası ancak gerçek geçmişe bağlanır; görseller mevcut kodla üretim kuralını izler. Kulüp büyüdükçe kararların ölçeği artar, rutin onay yükü artmak zorunda değildir.

**Bugünkü uygulama (2.8K, 2026-10-02; TEST metin):** Telefonda kişiler kendi sesleriyle yazar: forma sponsorunun işi babasından devralan oğlu, titiz sayman, “kadroyu ben bilirim” diyen eski usul hoca, yerel gazetenin muhabiri, destekçi esnaf. Kasa yetmediğinde hocanın uzlaşma cevabı takımın kulüp lokalinde toplanmasıdır. Hafta sonuna doğru birkaç cevapsız hatıra mesajı yalnız gerçekten verilmiş karara gönderme yapar (lokal kampı, istenen bedel, pano sözü, cevapsız bırakılan muhabir, geciken maaş sözü) ve bir kez gelir; para, puan veya yeni iş üretmez. Kişilik/ilişki puanı yoktur.

Tasarım dayanakları: [Reigns'in karakter ve koşula bağlı olay yaklaşımı](https://gamingtrend.com/interviews/one-night-with-the-king-reigns-developer-interviewed-on-games-success/), [Her Majesty'nin kısa kart yazımı ve oyuncu girişimi](https://gamesbeat.com/building-reigns-her-majestys-queendom/), [Wildermyth geçmiş kaydı](https://wildermyth.com/wiki/History), [Yes, Your Grace geliştiricilerinin bağlam ve küçük sunumlarla önem yaratması](https://www.gamedeveloper.com/business/deep-dive-the-subtle-art-of-building-tension-in-i-yes-your-grace-i-). Bunlar araştırma dayanaklarıdır; oyunların bütün mekanikleri veya sabit hikâyeleri benimsenmez.

Taraftar, seçmenler, yönetim, oyuncular, hoca, sponsorlar, rakip başkanlar, gazeteciler ve federasyon çevresi farklı beklentilere sahiptir. Tek bir genel popülerlik değeri bütün davranışları açıklamaz.

Verilen sözün sahibi, muhatabı, konusu, şartı, son tarihi ve kimler tarafından bilindiği tutulur. Sözün tutulması, yeniden görüşülmesi veya bozulması hatırlanır. Söylenen her cümle otomatik olarak bağlayıcı söz sayılmaz; oyuncu taahhüt verdiğini anlayabilmelidir.

Medya ve TV katılımları, taraftar talepleri, hakem atamaları ve tartışmalı kararlara tepkiler kulübün görünürlüğüyle değişir. Resmî itiraz, kamuoyu açıklaması, temsilci gönderme veya sessiz kalmanın farklı sonuçları olabilir. Kanıtlanmış olay, yorum ve söylenti birbirinden ayrılır; sistem başkanı gizlice cezalandıran bir kurguya dönüşmez.

Olay kaynakları: kararların sonuçları, dünyadaki gelişmeler ve sınırlı sürprizler. Olay sıklığı, tekrar aralığı ve aynı anda açık kalan konular denetlenir. İyi yönetimin rahat dönemler üretmesine izin verilir. Başarı, teşekkür, geçmişten gelen dostluk ve kulübe aidiyet sahneleri de içeriktir.

**Bugünkü uygulama (H2-c, 2026-10-26; TEST kişiler, kullanıcı değiştirir):** iki TEST çalışan vardır — yardımcı antrenör Tahsin ve mali işler müdürü Nusret Bey (karar 50'nin tek yeni kişileri). Yönetim koltuğu değildirler; sözleşmeleri, maaşları ve ilişki puanları yoktur. Yeni kariyerde ve sürüm 9 kaydının geçişinde kurulurlar.

### Kişi modeli

**Hedef (2026-10-26; Y1–Y2):** dosyalar kişilerin gündeminden doğar; başkanın işi çatışan gündemler arasında hakemlik yapmaktır. Her kişinin üç bileşeni vardır:

1. **Gündem:** ne istediği. Hoca forvet ister, mali müdür maaş bütçesini kısmak ister, kaptan sözleşme yenilemesi bekler. Gündem sezon boyunca değişir: hoca üç maç kaybedince savunma ister.
2. **Hafıza:** başkanın kendisiyle ilgili son kararları ve verdiği sözler. “Forvet alacağım” deyip almazsan hoca hatırlar. Hafıza ayrı bir defter değildir; geçmiş kaydından ve söz kaydından okunur.
3. **Tutum:** hafızadan türetilen gizli değer. Kayda ayrıca yazılmaz, hiçbir yerde sayı ya da çubuk olarak görünmez. Mesajın üslubunda, kapıyı çalma sıklığında ve getirdiği bilginin kalitesinde kendini belli eder: küskün sportif direktör daha az rapor getirir.

Kişinin bir de konu başına gizli **güvenilirliği** vardır ([§9](#9-puan-göstermeyen-oyuncu-sistemi)). Dışarıdan kişiler (menajer, rakip başkan, gazeteci, federasyon yetkilisi) aynı modeli daha kısa hafızayla kullanır; bir pazarlıkta yaşanan sonrakine taşınır. İlk sürüm az sayıda kişiyle kurulur ([§4](#personel-ve-çekirdek-kişiler)); tam ilişki simülasyonu başlangıç şartı değildir ve tek bir genel popülerlik değeri kurulmaz (yukarıda). Geliştirmede kaptan, asistan, kurul üyesi, gazeteci ve menajer gibi kişiler, adları ve metinleri Claude'un TEST taslağıdır; kullanıcı değiştirir (kullanıcı kararı, 2026-10-26; kulüp adları yine kullanıcınındır).

**Rehber.** Telefonda “ara” yalnız rehberdeki kişiler için açıktır. Rehber tanışıldıkça büyür: pazarlık yapılan menajerin numarası kalır, yemekte tanışılan rakip başkan eklenir. Rehber başkanın ilişki ağıdır; H2'nin kişi listesi (hoca, yardımcı antrenör, mali işler müdürü) ilk hâlidir.

**Kapı ve ziyaretçi (karar, 2026-10-26).** Yüz yüze görüşme odada olur; ayrı görüşme mekânı yoktur. Ziyaretçi randevuyla (ajandadan; telefonda kabul edilen görüşme isteği) ya da kendiliğinden gelir; kendiliğinden gelen en yüksek aciliyettir ve “sonra gelsin” de bir cevaptır. Başkan birini çağırabilir: görüşme daha uzun, daha etkili ve daha pahalıdır (TEST, 60 dakika civarı). Kapıdaki konular açık meselelerle sınırlıdır, serbest soru telefondan sorulur (Claude'un kararı; kullanıcı genişletebilir). Görüşme kart zinciridir; görsel düzeni görsel turdadır.

**Televizyon ve ev modu (havuz).** Akşam evde telefon ve televizyon, kulübü konuşan programa canlı bağlanmak, gece telefonu ve hafif tonlu sahneler temel oda ve kart döngüsü oturduktan sonra ayrıca tasarlanır ([§13](#13-kapsam-ve-açık-kararlar)).

### Koşula bağlı olaylar ve adil belirsizlik

**Onaylı tasarım yaklaşımı (2026-09-30; ilk dar örnek sabit sponsor örneğinin yerini aldı: ödeme sıkışması, yol haritası 2.4A, TEST içerik):** Yazılmış olaylar mevcut koşullarda anlamlı oldukları zaman açılır. Olay aileleri ve birleşim örnekleri [olay kütüphanesinde](OLAY_KUTUPHANESI.md) tutulur; birinin yaşanması bir sonrakini zorunlu kılmaz. Bazı olaylar hiç yaşanmayabilir, bazıları sorunsuz tamamlanabilir. Her maaş ödemesi yeni bir mesele değildir.

- **Kararların gerçek etkisi vardır.** Para harcamak, ödeme tarihini değiştirmek veya hak vermek tanımlı doğrudan sonuç doğurur. Gelecek teklif, insan tepkisi ve sportif başarı aynı kesinlikte değildir. Bir karar gelecekteki koşulları değiştirebilir; zorunlu sonraki sahneyi seçmekle eşdeğer değildir.
- **Tarafların kendi gerekçeleri bulunur.** Sponsor, yönetici veya futbolcu; amacı, sınırı, bilgisi ve mevcut alternatifleri üzerinden davranır. Her destekçi gizli düşman değildir; aynı kişinin amacı sırf sürpriz için değişmez. Tam bağımsız insan simülasyonu başlangıç şartı değildir.
- **Bilgi karar vermeye yarar.** Kaynağı ve tarihi belli rapor, görüşme veya araştırma belirsizliği azaltabilir; her bilgiyi kusursuzlaştırmaz. Büyük olumsuz sonuç için anlaşılır risk, edinilebilir ipucu veya gerçekten doğan dış gelişme bulunur. Sonradan gerekçe uydurulmaz. Okuma ücretsizdir; yeni bilgi toplama §6'daki kişi/zaman kurallarına tabidir.
- **Rastlantı sınırlandırılır.** Dış teklif veya gelişme değişebilir; kesinleşmiş gerçek, görülmüş haber ve çözülmüş sonuç kaydı açınca yeniden üretilmez. Aynı koşul ve kararların kayıtlı rastlantı durumuyla tekrarlanabilmesi test içindir; oyuncunun geleceği önceden bilmesi anlamına gelmez.
- **Önleme ve sakinlik geçerli sonuçtur.** Önlenen sorun başka adla zorla geri gelmez. Başarıyı dengelemek için açıklanamayan ceza veya rakip güçlendirmesi uygulanmaz. İyi ekip ve iyi mali düzen iş yükünü azaltır; oyuncu yeni girişim başlatmayı seçebilir.
- **Yoğunluk, gerçeği değiştiremez.** İsteğe bağlı yeni içerik yoğun dönemde bekletilebilir veya açılmayabilir; mevcut vade, taahhüt ve karar sonucu sessizce ertelenemez. Yeni olay için boş zaman doldurma kotası yoktur. Yakın krizlerin birlikte oluşabilmesi önceden anlaşılabilir koşullara dayanır.
- **Toparlanma bedellidir.** Yeniden anlaşma, daha küçük hedef, başka kaynak veya ekip değişimi mümkün olabilir. Bazı haklar ve fırsatlar geri gelmez. Başlangıçlar kasıtlı gizli çıkmazlarla kurulmaz; her karar dizisinin ya da her şans sonucunun Avrupa kupasına ulaşması garanti edilmez. Birden fazla zor ama makul başarı yolu hedeflenir.
- **Tekrar oynanabilirlik sınırsız içerik vaadi değildir.** Oyuncu olay ailelerini ve kuralları öğrenebilir. Amaç; üçüncü kariyerde veya video izledikten sonra aynı seçenek dizisini uygulamak yerine mevcut kanıtlara yeniden bakmasıdır. Farklı koşullarda hep üstün gelen bir seçenek varsa denge ve karar tasarımı incelenir.

**Uygulanan ilk örnek (2.4A, TEST değerleriyle):** Sponsorun erteleme talebi ancak o günkü kasa maaşı karşılamıyorsa zorunlu karara dönüşür; kasa yetiyorsa acil olmayan bir değerlendirmedir, talep hiç gelmeyebilir ya da erken teyitle önlenebilir. Sponsorun gerçek durumu başlangıçta seçilir ve gösterilmez; tahsilat geçmişi gibi kaynağı belli kanıtlar gösterilir. Başkanın görüşmesi, saymana devir ve başka ödeme planı koşula göre farklı sonuç verir; bu küçük örnek denge veya olay yoğunluğu onayı değildir.

**Uygulanan (2.6 ve 2.8, TEST değerleriyle):** Tavsiye istemek kararı başkanda bırakır ve görüş dosyaya kaynağıyla düşer; devir işi kişiye verir; tahsilat takibi kalıcı olarak saymana bırakılabilir. Hoca saha dışı bir harcama isteyebilir (karar yalnız bütçedir), gazete yaşanmış bir sonucu sorabilir, bir kulüp üyesinin firması süreli pano karşılığı destek önerebilir. Açık taahhütler söz olarak kaydedilir ve gerçek kayıtla tutulur ya da bozulur. Cuma gazetesi ve kısa teşekkür yaşanan olaydan doğar; odada izleri görünür. Düzenli başlangıçta bunların hiçbiri açılmaz.

Bu kuralların teknik karşılığı [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi), kapsamı ve doğrulama sırası [YOL_HARITASI](YOL_HARITASI.md) içindedir. Paket sayısı, bütün paketlerin ilk sürümde veya aynı kariyerde bulunacağı anlamına gelmez.

Rutin haber, tavsiye ve karar gerektiren gelişme farklı önceliklerle sunulur. Aynı meseleye gelen haber geçmişi günceller; bildirim sayısı yapay görev yükü oluşturmaz. İlk örneklerde bir sözün dönüşü, taraftar veya medya tepkisi, olumlu bir kulüp anı ve tamamlanmış küçük işin görünür izi birlikte sınanır. Oyuncu sonucun hangi kararla ilişkili olduğunu anlayabilmelidir.

### Süreli cevaplar

Özel röportaj ve acil karar anlarında kısa cevap süresi olabilir; yaklaşık beş saniye bir örnektir, sabit genel kural değildir. Soru ve seçenekler anlaşılmadan sayaç başlamaz. Süre bitince oluşacak susma/geçiştirme gibi davranış sahneye uygundur. Normal görüşmelerde düşünmeye zaman vardır.

Okuma süresi, flaş ve sarsıntı için erişilebilirlik seçenekleri planlanır. Baskıyı öncelikle kararın önemi, ortam ve insanların tepkileri taşır.

## 11. Maçlar, mekânlar ve kulübün büyümesi

**P2 (kullanıcı kararı, 2026-10-21 gece; kesin):** maç FM gibi tepeden 2D izlenir; oyuncular sade numaralı pullardır, topun havada olduğu gölge, boy ve izle okunur. Başkanın maçtaki yeri (başkan bölümü, rakip başkan, karar anı) içerik olarak sürer ama görüntü locadan değildir: locaya giriş sahnesi şimdilik atlanır, rakip başkanın karar anı 2D üstünde kart olarak gelir; kariyerin maçında H2'den (2026-10-26) beri kapalıdır (rakip başkan yok; içerikle döner), adresle açılan TEST maçında durur. Kulübün kimliği statın tepeden görüntüsüdür: başlangıçta kompakt kasaba stadı (üç tarafta uzun tribün, bir kale arkası kaya yamaç); tribünlerin gelişimi (kapanan bölüm, inşaat) maçta görünür; başka kulüplerin statları aynı modelden üretilir, büyük kulübün statı tepeden de büyük ve dolu görünür. Figürlü insan modeli antrenman ve kişi sahneleri içindir. **Antrenman (kullanıcı, 2026-10-22; hedef):** antrenman 3B figürlerle izlenir ve başkan iş yaparken arka planda sürebilir — ekranın bir yanında antrenman, öbüründe telefon, görüşme ya da dosya; her zaman değil, sahnesi uygun olduğunda. Antrenman türleri (şut, koşu, kuvvet, orta ve kafa, gelişine vuruş, sakat oyuncunun antrenör eşliğinde düz koşusu, çift kale maç, mücadele) ve hocaların antrenman portföyleri ileride araştırılır; ekran düzeni başkanlık planında. Bu bölümdeki loca ve bakış cümleleri maçın izlenme biçimi bakımından tarihseldir. Ayrıntı [kutuphane/M](kutuphane/M-pul-gorunumu.md), [STIL_REHBERI §5–§6](STIL_REHBERI.md).

Maçlar karakterin bulunduğu yerden izlenir. Görevdeyken ev sahibi veya deplasman başkan bölümündesin; yanında yöneticiler ve rakip başkan bulunabilir. İlişkiler selamlaşma, oturma düzeni, kısa konuşma ve katılmama gibi ayrıntılara yansır. Görev dışında farklı izleme konumu kullanılır.

Az sayıda anlamlı mekân zaman içinde değişir: kulüp odası, görüşme alanı, basın alanı, antrenman ve stat. Eski personel, fotoğraflar, kupalar ve nesneler yaşanan geçmişi görünür kılar. Gerektikçe yeni mekân eklenir; her konuşma için ayrı mekân yapılmaz.

İlk uygulama oda/görüşme ve isteğe bağlı antrenman örneğine odaklanır. Mekânlar aynı meseleye farklı yerlerden erişim sağlar; yer değiştirmek konuyu veya karar geçmişini sıfırlamaz. Küçük bir yatırımın veya tutulmuş sözün ortamdaki izi erken gösterilir; kapsamlı tesis ve stat gelişimi daha sonra tamamlanır. Antrenmana gitmek ya da uzun süre izlemek günlük zorunlu ödül toplama işine dönüşmez.

Üç ligin kulüp kimlikleri sabittir; bulundukları kademe yükselme/düşmeyle değişir. Oyuncular, başkanlar, hocalar, hakemler ve medya insanları yenilenir. Üçüncü ligin alt sınırında ne olacağı açık karardır.

Avrupa rakipleri ve yabancı oyuncu kaynakları için yeterli bir dış dünya temsili kurulur. Bütün yabancı liglerin maçlarını ayrıntılı simüle etmek gerekmez. Avrupa deplasmanları görkemli statları ve ortamıyla kariyerin ilerlemesini hissettirir. Kendi stadın da para, zaman ve yatırımlarla gelişir. **Uygulandı (F1-c, 2026-10-23; TEST):** ligin öbür kulüplerinin statları aynı kompakt kasaba stadı modelinden kulübün kimliğiyle üretilir (her kariyerde aynı); deplasman maçı ev sahibinin statında oynanır, ev ve deplasman taraftarı kendi takımının renklerindedir, pankart ev sahibinin adıyla. Adlar, renkler ve ölçüler kullanıcı kulüp kimliklerini yazana dek TEST'tir.

**Bugünkü uygulama (G1, 2026-10-24; TEST kuralları, kullanıcı kararı 43):** kadrolar 22 oyuncudur (her kulübe 18–21 yaşında, kadronun geri kalanından belirgin zayıf dört genç yedek; acil durum derinliği). Bir kulüp maç günü 11 uygun oyuncu çıkaramazsa maçı 0–3 hükmen kaybeder (iki taraf da çıkaramazsa 0–0); hükmen maç oynanmaz, Canlı Skor'da “hükmen” yazar, cezalılar maçı çekmiş sayılır. Sezonun son maçından sonra sezon sonu kaydı yazılır (son tablo, şampiyon, bizim sıra ve puan; ertesi sabah hatırlatma); yeni sezon bu sürümde yoktur, İlerle “Sezon tamamlandı” der. Maçta “TEST Maçı bitir” sonucu arkada önceden hesaplanmış maçla hemen gösterir. Sakatlıkta oyundan çıkış eskisinin yarısıdır (motor kararı 18).

### Ortak stat ve maç günü sunumu

**Onaylı hedef (2026-10-01; şehir stadının kaldırılması ve ortak stat 2.8D ile uygulandı, etaplı gelişim 8.3'te):** Ayrı “1. Lig şehir stadı” tarifi ve seçimi kaldırılır. Kulübün başlangıç stadı korunur; üst ölçeğe aynı stadın tribün, zemin, aydınlatma ve tesislerinin para/zaman/yatırımla gelişmesiyle ulaşılır. Lig atlamak kendiliğinden stat değiştirmez. Oda penceresindeki, balkondaki ve ev sahibi maçındaki saha/tribün yerleşimi aynı kulüp stadına aittir; saat, ışık, doluluk ve antrenman durumu farklı olabilir. Kapsamlı yatırım sistemi Aşama 8'dedir; şimdi ortak fiziksel temel kurulur.

Balkona odadaki kapıya tıklayarak çıkılır. Başkan doğal biçimde ayağa kalkar, yönelir, kısa adımlı yürüyüşle yerine oturur. *RN-b (2026-10-30, kullanıcı: “çok robotik”, seçenek A):* evreler üst üste biner, telefon ritüeli kısadır, bakış ilgi noktalarına (kapı, saha ya da pano, oturulacak yer) gider, görüş açısı yürürken sabittir; her yön ~8,5 sn (eskiden 12,3), tıklayınca atlanır (görünüş STIL_REHBERI §5). **2026-10-02 kararı:** bütün oyunda sakin hareket standarttır; kamera sallantısı ve dekoratif hareketler kaldırılır, hareket azaltma ayarı sunulmaz. Kalkış ve kısa yürüyüş korunur; eski ayarın doğrudan geçiş davranışı yeni standart değildir. Futbol/top ve gerekli karakter hareketleri ile klavye erişimi sürer. Ev sahibi maçındaki başkan yeri daha yüksekte, altında tribün sıraları görülecek biçimdedir. Çay kaldırılmıştır.

**2026-10-02 hedefi (2.8J ile uygulandı; görünüm [STIL_REHBERI §5](STIL_REHBERI.md#5-stat-ve-tribün)):** Başlangıç stadı daha mütevazı, çatısız bir kasaba/ilçe stadı olur; küçük tribünler ve yıpranmış çevre gelişime alan bırakır. Çatı ve diğer kapsamlı yatırımlar sonra yapılır. Tek mevcut tabela, başkan açısından okunur konumda direkler üzerinde armalar, skor ve dakika gösterir. Balkon, pencere ve maç aynı değişiklikleri taşır; olmayan çatıya bakım izi bağlanmaz.

Maç öncesi açık tonlarda **tek kompakt ekran** sunulur: armalar/karşılaşma, lig/hafta/saat, kısa form/sıra bilgisi ve tek cümle bağlam. Stat resmi, ayrı kadro/lig sayfaları ve yoğun tablolar kaldırılır. En az **10 saniyelik hazırlık**, dolan bir çubukla görünür; bu gerçek dosya yükleme yüzdesi diye sunulmaz. Süre tamamlanıp gerekli kaynaklar hazır olunca “Maça geç” etkinleşir, oyuncu kendisi geçer. Duraklat çubuğu da durdurur. Bekleme takvimde süre tüketmez ve maçı başlatmaz; §6'daki süre hedefleri bekleme kotasına dönüştürülmez.

**Duran topların temposu (kullanıcı kararı, 2026-10-19 gece; Z2 ile uygulandı — FUTBOL_KUTUPHANESI §0, `tur/p2` §12.6).** Duran toplar gerçek bir sahnedir: top gelir, kullanan yürüyüp yerleştirir, kutuya bakar, işaret verir, açıyla koşar; hakem barajda topun yerini ve 9,15 m'yi spreyle işaretler; taçta alıcılar boşa çıkar, savunma tutar. Süreler gerçeğin kabaca yarısıdır ve bağlama göre değişir (tempo B: korner ~18, barajlı serbest vuruş ~24, taç ~7, kale vuruşu ~11, penaltı ~40 sn (S1, 2026-10-21; Z2'de ~27); önde son dakikalarda uzar ve kuralın sayımıyla sınırlanır, gerideyken kısalır; çabuk serbest vuruş ve hızlı taç beklemez). Duruşta maç saati oyundakinin yarısından da yavaş (2 kat) akar: oyunun maç dakikası azalmaz, maç ×1'de ~28, ×2'de ~16, ×4'te ~10 dakika sürer; duran topun hazırlığı seçilen hızda geçer, kullanım anı (korner, tehlikeli serbest vuruş, penaltı) normal hızdadır. **Maçın uzunluğu ve izleme hızı (kullanıcı kararı, 2026-10-12; U1 ile uygulandı).** Oyuncular gerçek hızda koştuğu için 90 dakika gerçek zamanda oynanamaz; motorun maçı 20 gerçek dakikadır (maç saati 4,5 kat akar; eskiden 10 dakika ve 9 kat). Olayların maç başına sayısı iki katına çıkar: gol, şut ve kart gerçek maç değerine yaklaşır, pas ve faul gibi sık olaylar yine gerçeğin altında kalır. Oyuncu izleme hızını maçın altındaki şeritte (×1, ×2, ×4; 1/2/4 tuşları) ya da Ayarlar > Maç'ta seçer; seçim saklanır, varsayılan ×1'dir. **Önemli anlarda normal hız** (varsayılan açık, Ayarlar'da kapatılabilir): gol, şut, faul ve kart, sakatlık (düşüş ve hakemin durdurması), korner ve tehlikeli serbest vuruş (penaltı dahil) ve ofsayt bayrağında izleme birkaç saniye önce yumuşakça normal hıza iner; an normal hızda izlenir, sonra seçilen hıza döner. Taç, kale vuruşu, değişiklik, hakem topu, zaman geçirme, tedavi, sedye, gol sonrası santraya yürüyüş ve duran topun hazırlığı seçilen hızda geçer. Önceden bilmek için oyun aynı maçı birkaç saniye önden oynayan ikinci bir motor kullanır (maç tohumlu ve belirlenimcidir); maçın sonucu izleme hızından etkilenmez. Hız seçimi geçicidir: ileride maçın kariyerdeki yeri (atlama, yalnız özet) Aşama 3.7'de ayrıca değerlendirilir.

Yazılı maç spikeri/radyo akışı kaldırılır. Skor ve dakika stat tabelasında; ayrıntılar masadaki telefondaki Canlı Skor uygulamasında görülür. Kendi maçının istatistikleri mevcut motorun ürettiği verilerdir; maç sonrası beklenen gol de sayı olarak görünür (kullanıcı kararı 2026-10-23; F3). Diğer lig maçları gerçek fikstür, maç kimlikleri, kadrolar ve sonuç temeli kurulduğunda bağlanır (Aşama 3); o zamana kadar veri eksikliği açıkça gösterilir, uydurma canlı skor üretilmez.

**Kullanıcı kararları (2026-10-04; [YOL_HARITASI N1–N12](YOL_HARITASI.md#tamamlanan-turlar)).** *Uygulandı (N2, N4):* Canlı Skor'daki veri eksikliği notu kalktı: maçlar bağlandığında listede görünür, bağlanmayan için uyarı yazılmaz; uydurma skor yine üretilmez. Maçta bakış hep topu izler; elle bakış kalktı. Top toplayıcılar geri geldi (N10): oyuncu topu almaya saha dışına gitmez. *Uygulandı (N9, N11, N12):* seyirci kapıdan girip yerine yürür; aşağıdaki varış, loca ve karar anı uygulandı (karar anının seçimi henüz kariyere işlenmez; ilk kayıt TEST). *Önceki plan metni:* Stada varış karanlıktan açılan bir sahnedir ve statta olunduğunu gösterir. Loca kalabalıktır; rakip başkan yerinde olabilir, sonra gelebilir ya da hiç gelmeyebilir (ilişkiye bağlı; yazılmış içerikten gelir, uydurulmaz). Tokalaşma anında iki büyük seçenekli, yaklaşık beş saniyelik bir karar anı açılır; [§10 “Süreli cevaplar”](#süreli-cevaplar) kuralları geçerlidir (süre seçenekler okunur olduktan sonra başlar; süre dolunca sahneye uygun susma). Maç günü kariyere bağlanana kadar (3.5) bu seçim yalnız sahnede karşılık bulur; F2'den (2026-10-23) beri maçın kaydında (`protokol`) saklanır, etkisi içerikle (F6) gelir.

**Maç sonu (F2, 2026-10-23; uygulandı, TEST değerleri).** Maç bitince düdükten birkaç saniye sonra (sevinç ve çöküş izlenir) maçın üstünde açık bir “Maç bitti” kartı açılır: hafta, iki kulüp ve skor, goller, kartlar, sakatlıklar. Arkada maç sonu sürer (tokalaşma, alkış, tünel). Tek eylem “Odaya dön”: sonuç kariyere bir kez işlenir — puan durumu, son maçlar, oyuncunun gol ve sarı sayaçları, ceza (TEST: kırmızı ve iki sarı 1 maç, 4 sarı 1 maç) ve sakatlık (dönüş günüyle) — ve başkan odaya Cumartesi akşamı 21:00'de döner; ajandada sıradaki haftanın maçı durur. Skor hikâye için değiştirilmez. Geliştirme aşamasında maç şeridinde “TEST Maçı bitir” kalan maçı izlemeden oynatıp maç sonuna geçer (sonuç izlenen maçla aynıdır); yayından önce kalkar. H2'den (2026-10-26) beri “Maçı bitir” izletmeden sonuca gider: sahne çizilmez, “Maç hesaplanıyor…” örtüsünün altında kalan maç hesaplanır ve kart açılır (arkada önceden hesaplanmış ikiz hazırsa hemen); “Odaya dön” öbür maçlar bitene dek sayfayı dondurmadan bekler. Odada maç gününün şeridinde TEST “Maçı izleme” Stada git'in yanında durur: maç aynı yoldan izlenmeden oynanır, sonuç aynıdır (yayından önce kalkar). Maçın kariyerdeki yeri (atlama, yalnız özet) Aşama 3.7'de ayrıca değerlendirilir.

**Ligin öbür maçları (F7, 2026-10-24; 3.8).** Haftanın öbür yedi maçı bizim maçımızla aynı anda oynanır: maçta Canlı Skor'da canlı skor ve dakikayla görünürler (bizim santramızdan önce “başlamadı”), maç bitince puan durumu 16 kulüpte ilerler, odada Canlı Skor'da haftanın öbür sonuçları vardır. Uydurma skor yoktur: her maç kendi kimliği ve tohumuyla motorda oynanır. H2'den (2026-10-26) beri Canlı Skor'da her maçın satırına dokunulur (odada son haftanın bütün maçları, maçta bizim maç ve santradan sonra öbür maçlar): goller, kartlar, sakatlıklar ve beklenen golü olan 10 satırlık istatistik; maçta bizim maçın beklenen golü canlıdır.

**“Santraya geç” (kullanıcı kararı 2026-10-24; F3-0 ile uygulandı).** Düğme maç öncesini (ısınma, tören, tokalaşma, fotoğraf, yazı tura) görüntüsüz doğal sonuna dek oynatır, birkaç saniye sürer. Ne zaman basılırsa basılsın, basılmasa da maç aynıdır: sayfayı kapatıp başka bir anda basarak sonuç yeniden çekilemez.

**Maç olaylarından dosyaya (hedef, 2026-10-26; Y1–Y3).** Maç motoru yönetimi bilmez; maçın kaydını (dakika, tür, oyuncu, ayrıntı) verir. Yönetim bir eşleme tablosuyla olayları dosyaya ya da karta çevirir: sakatlık → kriz dosyası (doktor raporu, bir gün bekleme); kırmızı kart → disiplin dosyası (kurumsal şablon); üst üste yenilgiler → hoca krizi (bugün P12); gencin ilk golü → menajeri arar (sözleşme yenileme). Böylece motor değişse de yönetim değişmez. Bugünkü maç sonucu kancası (P12) bu tablonun tek satırıdır ([TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi)). Maç gününün loca kartları (sponsor, rakip başkan, menajer mesajı) içerikle gelir.

## 12. Başkanın yaşlanması ve kariyer sonları

Başkanın dayanma gücü, uyumu ve bazı becerileri yaşla gerileyebilir; tecrübesi, insan tanıması ve kulüpteki ağırlığı artabilir. Değişim herkes için tek bir yaş çizelgesine indirgenmez. Yeni adaylar ve değişen beklentiler baskı oluşturur.

Yaşlanma; hazırlık, iş yükü ve ekibe ihtiyaç üzerinden oynanışa yansır. Kullanıcının seçtiği cevabın rastgele başka cevaba çevrilmesiyle anlatılmaz. Somut beceri modeli, sağlık ve emeklilik koşulları henüz açık karardır.

Avrupa hedefi başlangıçta büyük final görevi olarak söylenmez. Üst ligdeki ilerlemeyle doğar ve kariyer bitmeden önce anlamı anlaşılır hâle gelir. En büyük kupanın adı, formatı ve bu hedefin açıklanma sahnesi ayrıca belirlenecek.

Kupaya ulaşmak; doğru ekip, mali devamlılık, uygun hoca, kadro gelişimi ve futbol belirsizliğinin bir araya gelmesini gerektirir. Çok zor olması hedeflenir; sabit bir kazanma yüzdesi veya yapay biçimde güçlendirilen final rakibi belirlenmez. Başarının yalnız tekrar denemeye ya da boş bekleme süresine dayanması önlenir.

Başarı finali kutlama, şehre dönüş, insanlarla veda ve bırakmayla tamamlanır. Kupasız finaller de kulübün mali durumu, gelişimi, yetişen oyuncular ve ilişkilerle farklılaşır. Seçim kaybı ile kariyerin kalıcı bitişi ayrı durumlardır.

## 13. Kapsam ve açık kararlar

İlk ticari hedefe dahil değildir: seçilebilir çok sayıda kulüp, başkanın şirketini yönetme, bütün dünya liglerini ayrıntılı oynatma, çevrimiçi çok oyunculu yapı, her kişiye haftalık zorunlu görüşme ve her olaya ayrı mekân. Tam seslendirme gibi içerik maliyeti yüksek işler temel oynanış kanıtlandıktan sonra değerlendirilir.

**Ses kararı (2026-10-01; uygulandı):** Ses sistemi, çağrıları ve ses ayarları 2.8A'da kaldırıldı. Ana oyun ve ekranlar tamamlanıp Aşama 10'daki ses tasarımına gelinene kadar hiçbir yerde yeni ses çalışması yapılmaz. Önceki erken ortam sesi kabul koşulları geçersizdir; geçmiş uygulama kayıtları tarihsel bilgidir.

| Açık konu | Karar verilmesi gereken aşama |
|---|---|
| İki cevaplı sahnelerin nihai metni, kişi üslubu, teklif adımları, görsel kompozisyon ve denge | 2026-10-02 çerçevesi içinde uygulayıcı tasarlar; iki cevap ve sade sunum kesin, örnekler/12–20 metin önerisi kota değildir |
| Kulübün nihai adı, şehir, kuruluş ve geçmiş kişiler | Temel kişiler erken hazırlanabilir; kapsamlı hikâye için Aşama 6 öncesi |
| Seçmen yapısı, dört/beş yıl (ilk üç koltuk seçildi, §4) | Seçim kuralları için Aşama 6 öncesi. **Erken seçim (karar, 2026-10-26):** yolu genel kuruldur; güven oyu kaybedilirse erken seçim ([§4](#genel-kurul-ve-güven-oyu)) |
| Yönetim adaylarının katkılarının gösterimi | **Karar verildi (2026-09-30):** nihai üründe profil metni görünür, katkı seviyeleri gizlidir. Geliştirme aşamasında seviyeler, gizli koşullar ve futbolcu özellikleri “Test bilgileri” ayarıyla görünür; yayından önce kaldırılır |
| Kişisel katkı biçimi, sınırları ve mali kurallar | Aşama 4 öncesi |
| Takım sayıları, sezon ve transfer takvimi, alt lig sınırı | Aşama 3 temeli için seçilmeli veya açık TEST tarifi kullanılmalı; tam sezon için Aşama 5 öncesi kesinleşmeli; yükselme/düşme ayrıntısı Aşama 8 öncesi. **Aşama 3 TEST tarifi (2026-10-23, Claude; YOL_HARITASI karar 36):** 16 takım, çift devreli 30 hafta, her hafta Cumartesi 19:00, oyun 13. haftada başlar (1–12 devralınan geçmiş), kış transfer dönemi 4–31 Ocak yalnız takvim işareti |
| Üretilen kadroların oyuncu ve hoca adları | **Karar verildi (2026-10-23, kullanıcı):** Claude TEST verisi olarak yazar (`js/adlar-test.js`, F1), kullanıcı sonra değiştirebilir; kulüp adları kullanıcınındır, uydurulmaz |
| Başkanın başlangıç yaşı, becerileri, kupasız final koşulları | Veri alanları Aşama 1; davranış kararı Aşama 7 öncesi |
| Avrupa kupalarının sayısı, formatı ve katılım kuralları | Aşama 9 öncesi |
| Kesin günlük/sezonluk tempo, maç günü toplam süresi, geçiş/atlama seçenekleri, olay yoğunluğu | §6'daki başlangıç aralıklarıyla Aşama 2–3'ten itibaren, tam sezonda Aşama 5'te ölçülür. **2026-10-26 (kullanıcı):** sezon süresi kısılmaz, 10 saatlik hedef alınmadı; hafta aralıkları §6'da, ölçüm Y4'te |
| Kesin para tutarları, yaş etkileri, seçim/transfer olasılıkları | İlgili sistemin oynanış testleri; önceden kesin denge sayılmaz |
| Değişken başlangıç alanları, uyumluluk sınırları ve zorluk dengesi | 2.4A'da dar TEST örnekleri; tam devralma koşulları ve giriş için Aşama 6 öncesi |
| Olay paketlerinin ayrıntılı seçenekleri, katkı/hak koşulları ve tekrar aralıkları | İlgili yol haritası adımında; katalog uygulama veya kesin denge sayılmaz. P03'ün ilk örneği hisse/yatırımcı sistemi kurmaz |
| Maçta sakatlık sıklığı, değişiklik hakkı (3 ya da 5) ve dönem kuralları ile işaretleri ([maç motoru §3 madde 4–5](MAC_MOTORU_GERCEKCILIK_PLANI.md#3-geçerli-kararlar), kutuphane/J §J.12 G10) | **Karar verildi (2026-10-11, T10 başı):** maç başına ~1 kısa sakatlık duraklaması ve ~0,3 oyundan çıkma (kariyere süre kaybı olarak, Aşama 3); bugünün kuralları (5 değişiklik, çıkan oyuncu en yakın çizgiden, hakem topu bırakılır, hücumcu barajdan 1 m, hocaya ve forma çıkarmaya kart); avantaj iki kolla; en çok 3 yedek ısınır. **Üstüne yazan karar (kullanıcı, 2026-10-19):** kurallar bütünüyle bugünün kurallarıdır (VAR, iptal, avantaj dahil), 1999 yalnız görüntüdür; sprey ve yatan barajcı Z2'de uygulandı, VAR, kale çizgisi teknolojisi, çoklu top, kaptan protokolü ve kalecinin 8 sn sayımı Z10'da ([FUTBOL_KUTUPHANESI §12.1](FUTBOL_KUTUPHANESI.md#121-turlar)) |
| Yağmur ve rüzgârın maçta gösterilmesi ([maç motoru §3 madde 7](MAC_MOTORU_GERCEKCILIK_PLANI.md#3-geçerli-kararlar)) | **Karar verildi (2026-10-11, T10 başı):** şimdilik gösterilmez; motor kapısı (T9a) kalır, maç kuru ve rüzgârsız; görünüm stadın gündüz/ışık/gölge işiyle birlikte |
| Maçın gerçek uzunluğu ve izleme hızı | **Karar verildi (2026-10-12, U1):** motorun maçı 20 dakika; ×1, ×2, ×4 izleme ve önemli anlarda (gol, şut, faul ve kart, sakatlık, korner ve tehlikeli serbest vuruş, ofsayt) kendiliğinden normal hız ([§11](#11-maçlar-mekânlar-ve-kulübün-büyümesi)); maç atlama ya da yalnız özet seçenekleri Aşama 3.7'de |
| Görsel üretim: yalnız kodla mı, dış varlıkla mı (yapay zekâ 2B/3B, paket, sanatçı); tarz (piksel/bitmap, izometrik diorama, melez) | **Ertelendi (2026-10-26, kullanıcı; YOL_HARITASI 49):** önce oyun mantığı ve içerik, görsel tur en sonda; o zamana dek bugünkü görseller yer tutucu. Kayıt: kodla üretilmiş stat konseptleri beğenilmedi (45), kullanıcı dış varlığa açık (46), istem paketi ve piksel çıktı denemesi `araclar/plan/gorsel-istem-paketi.md`, `araclar/piksel-kare.py` |
| Bilgi mimarisi ve ekran envanteri: bilgisayar nesnesi, Kadro ve Mali sekmeleri, Kişiler, kapı sahnesi, haftalık ritim, oyuncu satırının sayıları | **Karar verildi (2026-10-25/26; YOL_HARITASI 47, 50, 51):** bilgisayar nesnesi yok; mali bilgi mali işler müdürünün raporuyla dosyada ve kişiye soru zaman bedelli girişim (H2); Dosya'da Kadro sekmesi ve oyuncu dosyası, satırda yalnız gözlenebilir sayılar ([§9](#9-puan-göstermeyen-oyuncu-sistemi); S-c ile uygulandı, 2026-10-27); ziyaretçi odaya gelir, kapıda konular açık meselelerle sınırlı ([§10](#kişi-modeli)); gün ve hafta ritmi ([§6](#gün-ve-hafta-ritmi)). **Gazete (kullanıcı, 2026-10-27; YOL_HARITASI karar 54):** haftalık ve Pazartesi değil, günlüktür (her sabah 08:00; S-e ile uygulandı); kanal aciliyet sırası §6'da. Görsel düzenleri görsel turda |
| Pazarlık ve bilginin gizli değerleri: rezervasyon fiyatı, sabır, yetki devrinin kalitesi, konu başına güvenilirlik | TEST değerlerle Y1–Y2; oynanış testiyle ayarlanır, önceden kesin denge sayılmaz |
| Personel slotlarının lig kademesine göre listesi, açma ücretleri ve maaş ölçeği | TEST tarifle Y1; kesin tablo lig atlama tasarımıyla Aşama 8 öncesi |
| Genel kurulun eşikleri, dört grubun türetilme kuralı, olağanüstü kurul koşulu | TEST kurallarla Y5; seçim kurallarıyla birlikte Aşama 6 öncesi |
| Televizyon, ev modu (akşam telefonu, canlı yayına bağlanma), uyku ve yorgunluk | Havuzda; temel oda ve kart döngüsü oturduktan sonra (Y4'ten sonra). TV, telefonla gelen haber ve gelip konuşanlar gazeteden sonraki haber kanallarıdır (kullanıcı, 2026-10-27; aciliyet sırası [§6](#gün-ve-hafta-ritmi)) |
| Sezonun içinin ayrıntıları (S, 2026-10-27): gazetenin adı; haber olmayan günde “yeni” işareti; formun gol ve sonuçla beslenmesi; rotasyon ve gelişim hızı; parlayan genç sinyalinin gizli tavanı ne kadar sezdirdiği; eski kayıtta maç ve dakikanın “—” kalması; kulüp ekranında gollerin gösterimi; bültende “dinlendirildi” satırı | Kullanıcıya açık sorular (bloklamayan); bugün TEST değerlerle çalışır ([§6](#gün-ve-hafta-ritmi), [§8](#teknik-direktör), [§9](#9-puan-göstermeyen-oyuncu-sistemi); [araclar/plan/s-uygulama.md](araclar/plan/s-uygulama.md) “Kullanıcıya sorular”) |

Geliştirme aşamaları ve açık işlerin tek takip yeri [YOL_HARITASI.md](YOL_HARITASI.md) dosyasıdır.
