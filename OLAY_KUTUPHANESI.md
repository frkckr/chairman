# Chairman — senaryo haritası ve olay kütüphanesi

Son güncelleme: 2026-10-29 (başkanlık deneyiminin temel ilkelerini yazım ve incelemeye bağlama; karar 59; yalnız belge). Önceki: 2026-10-29 (kullanıcının senaryo çalışması: tek ana belge, uzun süreçler, koşula bağlı birleşimler, gündelik akış ve görev dışında devam; karar 58). Önceki: 2026-10-26 gece (Y0: paket ve dosya şablonu). **Senaryo araştırmasının, olay ailelerinin, ara akışların ve aralarındaki bağlantıların ana çalışma dosyası budur.** Yeni bir paralel senaryo haritası açılmaz; dosya adı ve S/P/K kimlikleri korunur. Ortak oyun kuralları [OYUN_TASARIMI](OYUN_TASARIMI.md), teknik sözleşme [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi), uygulama sırası [YOL_HARITASI](YOL_HARITASI.md) içinde kalır. Bu belgeyi genişletmek oyuna içerik eklenmiş veya altyapı tamamlanmış olduğu anlamına gelmez.

Katalog bugün 73 kaynaklı tarihsel örnek (S01–S23 çekirdek, §14'te S24–S73 geniş araştırma), 14 olay ailesi ve 12 koşula bağlı birleşim taslağı içerir (K01–K06 çekirdek, §16'da K07–K12 araştırma adayları). Uzun vadeli içerik hedefi yaklaşık 50 büyük hikâye ailesi, bunların ara akışları, olağan işler ve küçük kulüp anlarıdır; bu sayı yazılmış içerik veya aynı kariyerde oynatılacak olay kotası değildir. Tarihsel dayanak ile oyun için kurgu ayrılır. Hikâyeler haftalara, aylara veya sezonlara yayılabilir; kısa ve tek kararda sonuçlanan işler de bulunur.

**Bugünkü uygulama:** oyun bu Markdown dosyasını okumaz. Çalışan tarifler JavaScript kayıt defterlerindedir: P12 TEST taslağına ek olarak gelen transfer teklifi ve hocanın transfer talebi de kayıtlıdır. Düzenli ödemeler, sözleşmeler, yazışmalar, gözlem ve gazete ayrıca kendi kurallarından ilerler. Ayrıntılı kaynak haritası [§12](#12-bugünkü-uygulamada-olaylar-nereden-geliyor), uzun hikâye hedefi [§11](#11-senaryo-haritası-ve-yaşayan-süreçler), yol haritasıyla eşleme [§13](#13-uygulama-yol-haritasıyla-eşleme) içindedir.

## 1. Kataloğun kullanımı

Bir paket bir mesele ailesidir. Önce §8'deki bağımlılıklar, sonra kartın açılma koşulu ve oyuncunun elde edebileceği kanıt okunur. İlgili sistem hazır değilse yalnız metnini eklemek paketi uygulanmış yapmaz. Kesin olay sırası, final veya her duruma uyan doğru cevap yazılmaz.

Kartlarda kaynak, insan, gelecekteki hareket alanı ve kulüpte görünür iz düşünülür; her küçük olayın dört alanda da büyük etkisi gerekmez. Bazı olumlu anlar yalnız aidiyet ve hafıza sağlar. Bu dosya, ortak kuralları kullanan senaryo yapısını ve içeriğini tutar; kişi, ekonomi veya seçim sisteminin ikinci bir teknik tanımı kurulmaz.

**2026-10-01 sunum yenilemesi:** Paketler [tek konu akışını](OYUN_TASARIMI.md#tek-konu-akışı-ve-ekranların-görevleri) ve [onaylı ekran düzenlerini](STIL_REHBERI.md#onaylı-ekran-düzenleri-ve-etkileşim) kullanır. Aynı mesele mesaj, ajanda ve dosyada çoğaltılmaz; kritik bilgi/son tarih saklanmaz, haber açık dosyayı değiştirmez. Güncel uygulama önceliği R programıdır (YOL_HARITASI karar 56); eski örneklerin sırası yeni iş sırası sayılmaz. Tarihsel kaynaklar korunur, uyumsuz oyuncu senaryoları §7 kapsamında yeniden yazılır veya kaldırılır.

**2026-10-02 onayı:** [İki seçenekli karar](OYUN_TASARIMI.md#başkanlık-kararında-iki-seçenek) ve [karakter/mizah yönü](OYUN_TASARIMI.md#tanıdık-kişiler-başkanlık-üslubu-ve-mizah) bütün yeni içerikte geçerlidir. Aşağıdaki **Yollar** bir mesele ailesinin farklı şartlardaki tasarım olanaklarıdır; tek kartta üç/dört düğme veya zorunlu ardışık menüler olarak uygulanamaz. Aynı anda iki anlamlı yaklaşımı, doğal takipleri ve metinleri uygulayıcı tasarlar. K01–K12 koşul ilişkileridir, oynatılacak senaryo dizileri değildir.

**2026-10-26 (Y0; hedef):** bir paket, bir [dosya şablonunun](OYUN_TASARIMI.md#dosya-şablonları) (transfer alımı, transfer satışı, sözleşme yenileme, personel, kriz, kurumsal) aşamalarına yazılmış koşul, kişi ve metindir. Şablon mekanik iskelettir (kart, bekleme ve devir aşamaları, kayıp çıkışları, kart sınıfı); paket ne zaman açıldığını, kimin konuştuğunu ve neyin söylendiğini belirler. Aynı şablonu birçok paket kullanır; bir paket birden çok şablonla dosya açabilir; küçük anlar şablonsuz tek kart olabilir. Paketin kişileri [kişi modelini](OYUN_TASARIMI.md#kişi-modeli) kullanır (gündem, hafıza, gizli tutum). §8 tablosundaki “Şablon” sütunu ilk eşlemedir; kesin eşleme paket uygulanırken yazılır.

## 2. Tarihsel kaynak kütüphanesi

Bu bölüm çekirdek S01–S23 kaynaklarını tutar. Futbol dışı alanları da kapsayan 2026-10-29 araştırması, kaynak türü ve özgün oyun önerileriyle [§14](#14-geniş-araştırma-yönetim-başarı-ve-kriz-örnekleri) içindedir; S24–S73 de aynı kaynak kimliği dizisine dahildir.

Aşağıdaki kısa olgular 2026-09-30 tarihli araştırmadaki kaynaklara dayanır. Sonraki bölümlerdeki seçenekler, sonuçlar ve kişiler Chairman için özgün tasarım önerileridir; gerçek kulüplerin veya kişilerin yaşadığı iddia edilmez. Kulüp ve başkan anlatıları ilgili tarafın bakışını da taşır. Yabancı ülkelerin mülkiyet ve lisans kuralları Türkiye'ye doğrudan aktarılmaz. Kaynak bağlantıları tarihsel esin içindir; güncel mevzuat veya lisans kuralı uygulama öncesinde ayrıca doğrulanır.

| Kod | Gerçek örnek ve dönem | Doğrulanmış çekirdek | Oyun için kullanılabilecek gerilim |
|---|---|---|---|
| S01 | Union Berlin, 2004–2009 | Dirk Zingler taraftar ve sponsor olarak başlayıp 2004'te başkan oldu; mali açığı ve taraftar katkısıyla stat yenilemeyi anlatıyor. [Başkanın kulüp röportajı](https://www.fc-union-berlin.de/en/news/a-conversation-with-the-boss-eH6Sta) | Birlikte kurtarma, kişisel taahhüt, uzman ekip, kulübün evi. |
| S02 | Dortmund, 2005 ve sonrası | Kulüp 2005'te iflasın önlenmesini sonraki toparlanmanın dönüm noktası olarak anıyor. [BVB](https://www.bvb.de/de/de/aktuelles/news/news.html/News/Uebersicht/Watzke-erinnert-an-den-Tag-der-Rettung.html) | Nakit takvimi, alacaklılarla görüşme, sportif gücü koruyarak küçülme. |
| S03 | Eibar, 2014 | Sportif yükseliş döneminde sermaye artırımı şartını sağlayamama, idari düşme riski taşıyordu. [Dönemin resmi açıklaması](https://www.sdeibar.com/noticias/el-eibar-sigue-necesitando-nuevos-accionistas) | Başarının gerektirdiği hazırlık, son tarih, topluluk finansmanı. |
| S04 | Beşiktaş, Süleyman Seba dönemi | 1984–2000 başkanlığı sportif başarılar yanında kulübe kazandırılan tesislerle anılıyor. [Beşiktaş biyografisi](https://www.bjk.com.tr/tr/cms/tarihce/2/105/) | Bugünkü transfer ile yıllarca kullanılacak yatırım arasında tercih. |
| S05 | Bursaspor, 2009–2010 | Ertuğrul Sağlam'ın gelişi sonrası genç ve deneyimli oyuncuların bulunduğu takım 2010'da ilk lig şampiyonluğunu aldı. [UEFA](https://www.uefa.com/uefachampionsleague/news/01e9-0e7554a06d86-7779cdc42164-1000--bursaspor-make-breakthrough/) | Beklenenden hızlı yükseliş, kadroyu koruma ve yeni beklentiler. |
| S06 | Brighton, 1997 | Goldstone'un satılması ve Gillingham'da oynanan dönemle birlikte, taraftar Dick Knight'ın başkanlığı devralması kulüp tarihinin önemli kırılmasıydı. [Kulüp tarihçesi](https://www.brightonandhovealbion.com/media-article/On-this-day%3A-Dick-Knight-finally-takes-control) | Sahasız kalma, geçici çözüm, taraftar güveni, uzun vadeli dönüş sözü. |
| S07 | AFC Wimbledon, 2002–2020 | 2002'de kurulan kulüp 2020'de taraftar katkılarının desteklediği yeni Plough Lane'e döndü. [Kulüp](https://www.afcwimbledon.co.uk/club/), [taraftar finansmanı](https://ploughlanebond.com/about-the-bond/) | Evine dönüşün bedeli, yönetim yetkisi ile finansmanı dengeleme. |
| S08 | Hearts, 2013–2021 | 2013 krizi sonrasında Ann Budge ile Foundation of Hearts arasındaki süreç, 2021'de çoğunluk hisselerinin taraftar kuruluşuna devriyle sonuçlandı. [Foundation of Hearts](https://www.foundationofhearts.org/pages/we-are) | Kurtarma desteği, uzun vadeli söz, şeffaflık ve yönetim katılımı. |
| S09 | St. Pauli, 2003 | Taraftar kampanyası ve Bayern'le yardım maçı mali kurtarma sürecine katkı sağladı; Bayern maç gelirinden pay almadı. [Bundesliga](https://www.bundesliga.com/de/bundesliga/news/fc-st-pauli-uli-hoeness-genosse-fc-bayern-munchen-31480), [Bayern müzesi](https://fcbayern.com/museum/en/news/2010/07/be-successful-but-never-forget-the-weak) | Rakiple dayanışma, ilişkilerin ekonomik değeri, yardımın sonradan hatırlanması. |
| S10 | Cardiff, 2015 | Taraftarlarla görüşme ardından ana formanın maviye dönmesi ve armada Bluebird'ün öne çıkması açıklandı. [Başkanın açıklaması](https://www.cardiffcityfc.co.uk/news/2015/january/statement-from-tan-sri-vincent-tan) | Ticari istek ile kulübün kimliği; yanlış karardan dönmenin bedeli ve değeri. |
| S11 | Barcelona, 2003 | Laporta'nın Beckham hedefi gerçekleşmedi; aynı yaz Ronaldinho transfer edildi. [UEFA: Beckham süreci](https://www.uefa.com/uefachampionsleague/news/025a-0eaae3768353-1e74cd3cd611-1000--beckham-offers-star-attraction/), [UEFA: sonraki yapılanma](https://www.uefa.com/uefaeuropaleague/news/019b-0e6acdd6d39b-1f809f45c98c-1000--bouncing-barca-await-brondby/) | Adaylık vaadi, oyuncunun kendi tercihi, kaçan hedeften sonra alternatif plan. |
| S12 | Brentford, 2016 ve 2022 | 2016'da akademi kapatılıp B takımına odaklanıldı; 2022'de akademi B takımıyla birlikte işleyecek şekilde yeniden açıldı. [Brentford](https://www.brentfordfc.com/en/news/article/brentford-to-open-academy) | Kaynağa uygun yetiştirme modeli; stratejiyi yeni koşullarda değiştirebilme. |
| S13 | Gençlerbirliği, İlhan Cavcav dönemi | Kulübün kendi anma metni tesisleri, yetişen oyuncuları ve transfer başarısını Cavcav'ın mirası olarak vurguluyor. [Kulüp açıklaması](https://genclerbirligi.org.tr/haberler/onursal-baskanimiz-ilhan-cavcav-icin-olumunun-8-yilinda-kabri-basinda-toren-duzenlendi) | Oyuncu keşfi, satışla sürdürülebilirlik, sportif beklentiyle gerilim. |
| S14 | Altınordu, yetiştirme yaklaşımı | Seyit Mehmet Özkan'ın yazısı sistemli oyuncu yetiştirmeye yatırım ve kulübün bu yöndeki tercihini anlatıyor. [Altınordu](https://www.altinordu.org.tr/yazi/159/HER-YERDE-OZ-KAYNAK-SISTEMI) | Geciken yatırım karşılığı, sabır, hazır oyuncu baskısı. |
| S15 | Independiente del Valle, 2007 sonrası | Michel Deller dönemi projesi yetiştirme ve oyuncu ihracatıyla; 2016 Libertadores finali, 2019 ve 2022 Sudamericana başarılarıyla öne çıkıyor. [CONMEBOL](https://gol.conmebol.com/libertadores/es/news/independiente-del-valle-la-fabrica-de-cracks-que-suena-con-la-gloria-eterna) | Yetiştirdiğini satmak ve yarışmaya devam etmek; tek yıldız yerine devam eden düzen. |
| S16 | Racing, Diego Milito'nun 2014 dönüşü | Kulüpte yetişen Milito 2014 ortasında geri döndü ve aynı yılki şampiyon takımın önemli ismiydi. [Racing biyografisi](https://www.racingclub.com.ar/idolos/diego-milito/) | Efsanenin dönüşü, nostalji, gerçek katkı, ücret ve rol beklentisi. |
| S17 | Villarreal, Fernando Roig dönemi | 1997'de başlayan başkanlık döneminde yükselişler ve gerilemeler yaşandı; kulüp 2021'de ilk Avrupa Ligi kupasını kazandı. [Kulüp tarihçesi](https://villarrealcf.es/en/24-years-since-the-arrival-of-fernando-roig/), [2021 kupası](https://villarrealcf.es/en/the-rfef-honours-villarreal-after-a-historic-season/) | Küçük kulüpte uzun yapılanma, gerileme sonrası toparlanma, Avrupa ölçeğine geçiş. |
| S18 | Yokohama FC, 1998–1999 | Yokohama Flügels'in sona ermesinin ardından kuruldu; amblemin mavi kurdelesi taraftarların yaşatma hareketine dayanıyor. [J.League profili](https://www.jleague.jp/sp/club/yokohamafc/stadium/), [kulüp kronolojisi](https://yokohamafc.com/club/history/) | Kurumsal karar karşısında aidiyet; kimliğin nesnelere ve geleneğe yerleşmesi. |
| S19 | Columbus Crew, 2017–2018 | Save the Crew hareketi şehirde kalma mücadelesi yürüttü; 2018 sonunda yeni yerel sahiplik çözümü şekillendi. [MLS](https://www.mlssoccer.com/news/hell-is-real-fc-cincinnati-columbus-crew-embrace-ohio-vs-everybody-spirit) | Yerel ittifaklar, kamuoyu, şehirle bağlantılı sponsor desteği. |
| S20 | Ventforet Kofu, 2022 | J2 ekibi İmparatorluk Kupası'nı kazandı; yarı finale ligde kötü bir seri içindeyken çıkmıştı. [JFA turnuva arşivi](https://www.jfa.jp/eng/match/emperorscup_2022/), [yarı final raporu](https://www.jfa.jp/eng/match/news/00030713/) | Kötü lig gidişiyle eşzamanlı kupa fırsatı; tek göstergeden hoca değerlendirmeme. |
| S21 | TP Mazembe, 2010 | Internacional'i geçerek Dünya Kulüpler Kupası finaline çıkan ilk Afrika kulübü oldu. [CAF](https://www.cafonline.com/news/stat-attack-tp-mazembe/) | Beklenmeyen uluslararası görünürlük; kurumun yeni ölçeğe hazırlanması. |
| S22 | Leicester, 2015–2016 | Ranieri'nin gol yemeyen maç için pizza sözü takımın hatırlanan anlarından oldu; şampiyonluk kutlamasında Bocelli sahne aldı. [Fuchs'un kulüp röportajı](https://www.lcfc.com/media-article/leicester-city-2016-premier-league-champions-christian-fuchs-5000-1-anniversary-charity-match-tickets), [kutlama](https://www.lcfc.com/media-article/Strange-But-True%3A-Andrea-Bocelli-Performs-On-Filbert-Way) | Küçük ortak ritüeller, oyuncu-personel bağı, hak edilmiş kutlama. |
| S23 | Athletic Club, devam eden kulüp felsefesi | Kulüp oyuncu politikasını Bask bölgesinde doğmuş veya orada yetişmiş oyuncular üzerinden tanımlıyor. [Resmi felsefe](https://www.athletic-club.eus/en/philosophy/what-is-it/) | Kimlikle uyumlu kadro politikası, daralan pazarın iyi yetiştirmeyi değerli kılması. |

Bu listede yalnız zaferlere bakıp aynı kararın başarı garantisi verdiği sonucu çıkarılmaz. Özellikle para koyma, genç yetiştirme veya hocaya sabretme her koşulda kazandıran reçetelere dönüşmemeli. Gerçek olayların sonuçlarını oyunda zorunlu tekrar etmeyiz.

## 3. Olay paketleri

Her paket bir mesele ailesidir. Bütün seçenekler her durumda görünmez: bir teklif yapabilmek için gerçek yetki, kaynak, ilişki veya bilgi gerekebilir. Rutin işler paket üretmeden de takvimde devam eder; her maaş ödemesi bir kriz veya karar ekranı değildir.

### P01 — Kasada para var, maaş gününde yok

**Dayanak:** S02, S03. **Açılma:** Vadesi gelen yükümlülüklerle güvenilir gelirlerin tarihleri uyuşmaz. **Kanıt:** Nakit takvimi, tahsilat geçmişi, sözleşme ve saymanın açıklaması.

**Yollar:** Sponsor avansı karşılığında sınırlı hak vermek; alacak ve ödemeleri yeniden görüşmek; ertelenebilir yatırımı küçültmek; uygun aşamada oyuncu satışı araştırmak. Kişisel katkı ancak daha sonra seçilecek kurallar içinde seçenek olur.

**Sonuçlar:** Hızlı nakit ilerideki gelir alanını azaltabilir. Yeniden takvimleme ilişkiyi ve güveni etkiler. Yatırım erteleme sportif bütçeyi korur ama tesis sorununu sürdürür. **Toparlanma:** Anlaşmayı yeniden görüşme ve sonraki dönem bütçesini düzeltme mümkündür; bedeller silinmez. **Önleme:** Erken tahsilat takibi ve nakit tamponu. **İz:** Maaşın zamanında yatması, personelin tavrında ve dosyadaki ödeme kaydında görülür.

**Kullanılan alt kapsam (2.4A, TEST içerik):** Forma sponsorunun taksit erteleme talebi. Açılma yalnız kasa önümüzdeki günlerde gerçekten yetmiyorsa kriz olarak; yetiyorsa acil olmayan değerlendirme olarak. Yollar: sponsorla yüz yüze görüşme (taksit ya da pano hakkı karşılığı tam ödeme teklifi), saymana devir (taksit, tam ödeme, gecikme bedeli ya da yetkiyi aşan indirim teklifi), bakım taksitini bedeliyle erteleme, maaşı bekletme. Önleme: erken tahsilat teyidi ve kasada pay bırakma. Kanıt: tahsilat geçmişi, sözleşmedeki gecikme maddesi, defterdeki açık, saymanın görüşü. Kurulmayanlar: alacak/ödemelerin genel yeniden görüşülmesi, oyuncu satışı, kişisel katkı, tesis sistemi, personelin tavrı ve pano hakkının sonraki etkisi (yalnız kayda yazılır).

### P02 — İmza gelmeden verilen söz

**Dayanak:** S11. **Açılma:** Kampanyada veya kamuoyu önünde belirli bir futbolcu, hoca ya da yatırım sözü verilmiştir. **Kanıt:** Oyuncunun isteği, hoca raporu, pazarlık durumu; söylenti ile imzalanmış anlaşma ayrılır.

**Yollar:** Hedefi makul sınırlarla takip etmek; önceden açıklanan koşul üzerinden alternatif sunmak; sözü değiştirdiğini açıkça anlatmak. **Sonuçlar:** Hedef gerçekleşse bile ücret dengesi veya hoca uyumu sorun olabilir. Kaçan hedef, iyi hazırlanmış alternatifle telafi edilebilir. **Toparlanma:** İlgili kişilere doğrudan açıklama, ölçülebilir yeni taahhüt. **Önleme:** Henüz imzalanmamış ismi kesin vaat olarak kullanmamak. **İz:** Basın eski sözünü doğru biçimde hatırlar; sonraki başarı vaadi kendiliğinden silmez.

### P03 — Destek geliyor, koşulları da geliyor

**Dayanak:** S01, S08; oyundaki çıkar çatışmaları kurgusaldır. **Açılma:** Destekçi veya yatırım ortağı kaynak, uzmanlık ya da erişim sunar. **Kanıt:** Paranın tarihi, destek kapsamı, talep edilen haklar ve kişinin geçmiş ilişkileri.

**Yollar:** Süre ve sınırları belli ortaklık; katkıyı bölerek birkaç tarafla çalışma; şeffaf denetim koşuluyla kabul; talebi reddetme. **Sonuçlar:** Büyük destek tek tarafa bağımlılığı artırabilir; çok ortak daha fazla koordinasyon gerektirir. Destekçinin makul talebi de olabilir; her yardımcı gizli kötü karakter değildir. **Toparlanma:** Yetkiyi yeniden görüşme, başka gelir geliştirme. **Önleme:** Belirsiz söz yerine açık koşul. **İz:** Masadaki kişiler, kulüpteki görünürlük ve söz kayıtları değişir.

### P04 — Kulübün evi

**Dayanak:** S01, S06, S07. **Açılma:** Kullanım anlaşması, kapasite veya bakım ihtiyacı mevcut sahayı sorunlu hâle getirir; takvim dışında bir gelişme şart değildir. **Kanıt:** Yapı ve bakım raporu, teklifler, gelir hesabı, taraftarın erişimi.

**Yollar:** Mevcut yeri aşamalı yenilemek; geçici başka saha kullanmak; uzun vadeli yatırım için kaynak toplamak. **Sonuçlar:** Aşamalı iş daha uzun sürer; taşınma günlük erişimi ve geliri etkiler; büyük yatırım yeni yükümlülük doğurur. **Toparlanma:** Etap küçültme ve geçici kullanım anlaşması. **Önleme:** Bakımı ve süreleri önceden takip etmek. **İz:** Gerçekten biten tribün, soyunma odası veya antrenman alanı sahnede değişir. Taraftar emeği profesyonel güvenlik işlerinin yerine geçirilmez.

### P05 — Armanın karşılığı kaç para?

**Dayanak:** S10, S18, S19. **Açılma:** Ticari ortak veya yönetici isim, görünüm ya da kullanım hakkı değişikliği ister. **Kanıt:** Teklifin kapsamı, taraftarın farklı görüşleri, alternatif gelirler ve daha önce verilen sözler.

**Yollar:** Kimliği koruyan sınırlı kullanım; geçici etkinlik veya ikinci ürün üzerinden anlaşma; danışma sürecinden sonra karar; reddetme. **Sonuçlar:** Daha yüksek bedel daha güçlü tepki yaratabilir ama bütün taraftarlar tek görüşte değildir. Geri adım anlaşma maliyeti taşıyabilir. **Toparlanma:** Açık özür veya açıklama, yeni koşullar, kimliğin geri verilmesi. **Önleme:** Ticari hakları baştan sınırlamak. **İz:** Gerçekten kabul edilen tabela, arma öğesi veya isim değişir; kulübün sabit tarihi rastgele yeniden yazılmaz.

### P06 — Şehir elini uzatıyor

**Dayanak:** S03, S08, S09, S19. **Açılma:** Açıklanabilir bir ihtiyaç ve onu destekleyebilecek topluluk vardır; başkan da girişim başlatabilir. **Kanıt:** Hedef bütçe, masraf, katılabilecek kuruluşlar ve güven durumu.

**Yollar:** Küçük bağış/ürün kampanyası; yardım maçı; sponsorun eş katkısı; mevcut destekçileri yormamak için aşamalı hedef. **Sonuçlar:** Tahsil edilen net gelir önemlidir; brüt vaat para sayılmaz. Kampanya lojistik yük oluşturur; her seferinde aynı coşkuyu üretemez. **Toparlanma:** Toplanan kaynakla daha küçük işi tamamlama ve hesabını verme. **Önleme:** Her giderde taraftara başvurmayan mali düzen. **İz:** Katılan insanlar ve gerçekten tamamlanan iş kaydedilir; yıllar sonra karşılaşmaların konusu olur.

### P07 — Yetiştirdiğin oyuncuya gelen teklif

**Dayanak:** S13, S14, S15. **Açılma:** Oyuncu ilgi görür veya kulüp satış araştırması başlatır. **Kanıt:** Hoca ve gözlemci raporları, oyuncunun isteği, teklifin tahsilat koşulları, alternatif kadro planı.

**Yollar:** Hemen satış; sezon sonuna bırakma; imkân varsa kiralık kalma ve sonraki satış payı pazarlığı; uygun koşullarla elde tutma. **Sonuçlar:** Yüksek toplam bedel geç tahsil edilebilir. Tutmak yarış şansını koruyabilir ama sözleşme veya ilişki riskini artırabilir. **Toparlanma:** Yeni rol/sözleşme görüşmesi veya satış gelirini ölçülü kullanma. **Önleme:** Tek oyuncuya bütçe bağımlılığını azaltma. **İz:** Eski oyuncunun haberi, geri gelişi ve altyapıya ayrılan gerçek kaynak. Satış payı garanti gelecek gelir sayılmaz.

### P08 — Futbolcu yetiştirme modelini seçmek

**Dayanak:** S12, S14, S15, S23. **Açılma:** Yetiştirme programının maliyeti, sonuçları veya erişebildiği oyuncu havuzu yeniden değerlendirilir. **Kanıt:** Personel, saha ve gelişim raporları; mezunların gerçek kariyerleri.

**Yollar:** Yerel yaş gruplarına yatırım; geç gelişen oyunculara odaklı küçük gelişim grubu; uygun kulüplerle işbirliği; kaynaklar elverdiğinde karma model. **Sonuçlar:** Daha fazla para otomatik yıldız üretmez; doğru uzmanlık ve zaman gerekir. Erken kesinti bir kuşağın yolunu daraltabilir. **Toparlanma:** Yeni kaynakla modeli değiştirme; eski yatırımı sihirli biçimde geri almama. **İz:** Kullanılan saha, eğitim ekibi, yetişen insanların gerçek devamı. Bu modeller futbol formatları seçildikten sonra uyarlanır.

### P09 — Efsane geri dönmek istiyor

**Dayanak:** S16. **Açılma:** Kulüple geçmiş bağı olan bir kişi gerçekten ayrılmış, yaş almış ve geri dönmeye uygun durumdadır. **Kanıt:** Güncel hoca raporu, sağlık/oynama geçmişi, ücret ve rol beklentisi.

**Yollar:** Hoca uygun görürse oyuncu olarak anlaşmak; koşulları uygunsa yetiştirme/temsil rolü; yalnız veda veya özel buluşma; saygılı ret. **Sonuçlar:** İsim heyecan yaratabilir ama otomatik performans getirmez. Belirsiz rol soyunma odasını zorlayabilir. **Toparlanma:** Açık rol görüşmesi ve uygun ayrılık. **Önleme:** Nostaljiyi raporun yerine koymamak. **İz:** Karşılanma, eski çalışanla buluşma, yalnız gerçekten hak edilmiş yeni anı. Birinci sezon sırf paket var diye efsane dönüşü üretilmez.

### P10 — Lig kötü, kupa rüyası gerçek

**Dayanak:** S20, S21, S05. **Açılma:** Maç sistemi gerçekten beklenmeyen bir tur veya hedef fırsatı üretir. **Kanıt:** Fikstür, hoca değerlendirmesi, primler, deplasman ve kapasite ihtiyacı.

**Yollar:** Kontrollü prim ve lojistik destek; bütçeyi koruma; personel ve organizasyon gücünü geçici artırma. Hoca dinlendirme ve kadro kararını verir. **Sonuçlar:** İlgi yeni gelir fırsatı yaratabilir; taahhüt edilen primler gerçek yükümlülük olur. **Toparlanma:** Elenince otomatik kriz yerine normal bütçeye dönüş. **Önleme:** Kazanılmamış kupa gelirini harcamamak. **İz:** Deplasman, kalabalık, şehirde kutlama veya iyi mücadeleye teşekkür. Hiçbir skor paket tarafından zorlanmaz.

### P11 — Kulüp büyüdü, düzen yetişemedi

**Dayanak:** S03, S05, S17, S21. **Açılma:** Yükselme veya Avrupa hakkı gerçek sonuçla kazanılır ya da yaklaşan şartlar hazırlık gerektirir. **Kanıt:** Önceden bilinen oyun kuralları, tesis ihtiyacı, personel kapasitesi ve gelecek bütçe.

**Yollar:** Çekirdeği koruyup seçici güçlenme; organizasyon ve tesis önceliği; büyük gelir beklentisini uzun vadeli yükümlülüğe çevirmeden bekleme. **Sonuçlar:** Aynı anda kadro, maaş ve tesis büyütmek kırılganlık yaratabilir. Fazla tutuculuk fırsat kaçırabilir. **Toparlanma:** Büyümeyi etaplara bölmek. **Önleme:** Yükseliş kesinleşmeden bilgi toplama. **İz:** Yeni ziyaretçiler, profesyonelleşen ekip, genişleyen stat. Lisans şartı son gün sürpriz ceza olarak icat edilmez.

### P12 — Hocaya sabır mı, değişim mi?

**Dayanak:** S05, S17, S20; seçenek yapısı kurgusal tasarımdır. **Açılma:** Sonuçlar, ilişkiler veya sözleşme kararı gerçek değerlendirme gerektirir. **Kanıt:** Hoca açıklaması, oyuncuların farklı görüşleri, sakatlık/uyum durumu, oyun raporları ve maliyet.

**Yollar:** Açık hedef ve makul değerlendirme zamanı; belirli destek ihtiyacını karşılama; piyasayı sessizce araştırma; mevcut kurallarla ayrılık. **Sonuçlar:** Her sabır şampiyonluk, her değişiklik toparlanma getirmez. Yedek plan olmadan ayrılık daha zor olabilir. **Toparlanma:** Teknik yapılanmayı gözden geçirme; gerçek öğrenilen bilgiyi kullanma. **Önleme:** Hoca seçerken kadro uyumu ve beklentileri konuşma. **İz:** Basında verdiğin destek sözü, hoca ve ekiple görüşmenin tonu.

**Bugünkü uygulama (F6-a, 2026-10-24; TEST taslağı, karar 35 ve 42):** `js/icerik-p12.js` oyunda yüklenir. Açılma yalnız sonuçtan (bugünkü hocayla son 3 maçta en çok 1 puan ya da 5 maç galibiyetsiz); kanıt puan durumu ve maç raporları (beklenen gol, tarzın izi), hocanın mesajı. Yollar iki cevaplı: sabır (açık süre: 3 maç, söz) / değişim (ertesi gün sıralı iki aday görüşmesi; göreve al, sıradaki aday ya da mevcut hocayla devam); cevapsız kalırsa hoca görevde kalır. Ayrıntı OYUN_TASARIMI §8; borçlar `araclar/plan/f6a-uygulama.md`. Kartın öbür yolları (destek ihtiyacı, piyasayı sessizce araştırma) ve kanıtları (oyuncuların görüşü, sakatlık ve uyum, maliyet) kullanıcının içeriğiyle gelir.

### P13 — Küçük söz, kalıcı hatıra

**Dayanak:** S04, S01, S22. **Açılma:** Gerçek başarı, emek veya tutulabilecek küçük taahhüt vardır. **Kanıt:** Katılan kişilerin geçmişi ve tamamlanan iş.

**Yollar:** Hoca ile uyumlu sade ekip buluşması; personeli de kapsayan teşekkür; bütçeye uygun taraftar günü; kutlamayı temsilciye bırakma. **Sonuçlar:** Her olumlu an gizli büyük sorun çıkarmaz. Etkinliğin maliyeti ve takvimde yeri vardır; günlük moral puanı toplama işi değildir. **Toparlanma:** Verilen küçük söz ertelenirse sebebini açıklama. **İz:** Fotoğraf, anı nesnesi, tanıdık konuşma veya tesis açılışı. Bunlar yaşanmış olaydan üretilir; sonradan uydurulmaz.

### P14 — Kurtaran ittifakla birlikte yönetmek

**Dayanak:** S08, S19. **Açılma:** Kampanyada veya kriz döneminde birden çok grubun desteği alınmıştır; farklı beklentiler artık aynı bütçeyi etkiler. **Kanıt:** Verilmiş sözler, temsil biçimi, tarafların öncelikleri ve gerçek gelir.

**Yollar:** Öncelikleri ve sırasını ortaklaştırma; denetim ve açık raporlama; görevleri yeteneklere göre bölme; uzlaşılamayan konuda gerekçeli karar ve siyasi bedeli kabul. **Sonuçlar:** Herkesi aynı anda memnun etmek mümkün olmayabilir; iyi sonuç muhalefeti otomatik yok etmez. **Toparlanma:** Yeniden görüşme ve sonraki seçimde hesap verme. **Önleme:** Birbirini dışlayan vaatleri baştan görme. **İz:** Yönetim masasında kimlerin bulunduğu, desteğin açık gerekçesi, görevden ayrılınca süren ilişkiler. Kesin seçmen ve kurul modeli ayrı ürün kararıdır.

## 4. Birleşik akışlar: koşula bağlı olası yollar

Bu örneklerde ok işareti zorunlu bir sonraki sahne anlamına gelmez. İlgili koşullar oluşursa yeni mesele doğar. Önleme, vazgeçme, sorunsuz sonuç ve hiç yaşanmama yolları korunur.

### K01 — Transfer vaadi, ödeme sıkışması, alternatif başarı

P02: Adaylıkta belirli isim sözü → oyuncu başka tercihe yönelir veya şartları ağırlaşır → P01: bütçe yeniden değerlendirilir → P07/P08: hazır alternatif ya da gelişim yatırımı.

Üç olası devam: bütçeye uygun alternatif sportif karşılık verir; vaat açıklanarak hedef ertelenir ve güvenin bir kısmı korunur; isimde ısrar ücret dengesini bozar ve P12 değerlendirmesi doğar. Hedef oyuncunun gelmesi de mümkündür. Sürpriz, oyuncunun/rakibin kendi şartlarından gelir; kesin anlaşma sonradan sebepsiz iptal edilmez.

### K02 — Şehrin yaptığı tribün

P04: Bakım/kapasite ihtiyacı → P06: şeffaf kampanya veya yardım maçı → P03: eş katkı sunan destekçi → P13: gerçekten tamamlanan etabın açılışı.

Üç olası devam: küçük etap tamamlanır; yeterli kaynak gelmez ve açıkça daha küçük hedefe dönülür; destekçinin koşulları P05 kimlik tartışması doğurur. Kampanya hiç açılmadan normal bütçeyle onarım da geçerli yoldur. Ziyaretçi rakip başkanla ilişki daha sonraki bir olaya kaynak olabilir; karşılık garantisi yoktur.

### K03 — Akademiden Avrupa'ya, oradan eve

P08: Yetiştirme düzeni → yıllar içinde gerçekten gelişen oyuncu → P07: satış veya tutma → koşullara bağlı sportif ilerleme → yıllar sonra uygun kişi için P09 dönüş.

Üç olası devam: satış yeni kuşağı finanse eder; oyuncu takımın omurgası olur; gelişim beklentisi karşılanmaz ve model düzeltilir. Satılmış her oyuncu yıldız olmaz, geri dönmez veya kulübü zengin etmez. Geri dönüş geçmişin sonucu olarak anlam kazanır.

### K04 — Kupada ilerlerken ligde sıkışmak

P10: Gerçek kupa başarısı → prim/lojistik kararı → P12: hocayı yalnız lig sırasıyla değerlendirmeme → P11: başarı sürerse büyüme hazırlığı.

Üç olası devam: kontrollü destekle fırsat kovalanır; lig için hazırlık önceliği konuşulur, saha tercihini hoca yapar; kazanılmamış gelir harcanırsa P01 ödeme sıkışması ortaya çıkar. Kupa elenmesi otomatik görev kaybı değildir.

### K05 — Bizi kurtaran ortak, kulübün kimliği

P03: Koşullu destek → P05: ticari görünürlük talebi → P14: taraftar ve yönetimle uzlaşma → P06: gerekirse alternatif kaynak.

Üç olası devam: kimliği koruyan daha küçük anlaşma; yüksek bedelli kapsamlı anlaşma ve açıklanabilir tepki; anlaşmayı reddedip daha yavaş büyüme. Her ortak kötü, her taraftar talebi doğru sayılmaz. Başta net sözleşme kurmak tartışmayı önleyebilir.

### K06 — Başarıdan sonra rahat dönem

P01'in sağlıklı çözümü + P08/P12'de tutarlı düzen → rutin işlerin ekipçe sürmesi → P13 sakin kulüp anları → oyuncunun isteğiyle yeni P04/P07 girişimi.

Bu akışta büyük kriz çıkmak zorunda değildir. Başarı daha iyi tekliflere, daha az takip yüküne ve daha fazla seçenek hakkına dönüşür. Oyuncu büyümeyi seçerse yeni yükümlülük alır. Eski bir rakip başkanın tebriki veya personelin hatırladığı küçük söz yeterli gelişme olabilir.

## 5. Tasarım sınırlarına başvuru

**Deneyim ilkeleri (2026-10-29, kullanıcı onayı):** senaryo ve küçük içerik yazımında [OYUN_TASARIMI §1 — Başkanlık deneyiminin temel ilkeleri ve oynama değerlendirmesi](OYUN_TASARIMI.md#başkanlık-deneyiminin-temel-ilkeleri) esas alınır. Ayrıntılar orada tek kaynaktır. Paketin değeri, gündelik başkanlık içinde oyuncunun insanlara, işlere ve kendi kararlarının sonuçlarına bağlanmasına katkısıyla değerlendirilir; yeni vaka veya dal sayısı tek başına yeterli değildir. Bu onay aşağıdaki taslakları uygulanmış içeriğe dönüştürmez.

Başlangıç ve adil belirsizlik kuralları [OYUN_TASARIMI §3](OYUN_TASARIMI.md#3-kulübün-geçmişi-ve-başlangıç-hikâyesi) ve §10'da tutulur. Önleme, sakin dönem, maliyetli toparlanma ve öğrenilebilir kurallar bütün kartlara uygulanır. Paketler bu ilkeleri aşan özel kader kuralları ekleyemez. Kesin yoğunluk sayıları [§6 tempo denemeleriyle](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo) ölçülür; katalogdaki paket sayısından günlük görev kotası çıkarılmaz.

## 6. Paketin asgari yazım biçimi

Uygulamaya alınacak sahne önce karar, konuşma, haber, ekip çalışması veya sonuç olarak ayrılır. Gerçek kararda iki açık cevabın anlamı, bilinen bedeli, kısa etkisi ve beklenen sonraki gelişme belirlenir; hazır görüş ile yeni araştırma ayrılır. Nihai ifadeler ve doğal takip yapısı uygulayıcının alanıdır. Her ailede aşağıdaki bilgiler tamamlanır; kısa işlerde gerekmeyen alanın nedeni belirtilir.

| Alan | Yazılacak bilgi |
|---|---|
| Kimlik ve dayanak | Paket kimliği/sürümü, kaynaklar, doğrulanmış olay ile kurgu ayrımı, taslak/uygulandı durumu |
| Deneyime katkı | Oyuncunun bu insanı veya işi neden önemseyeceği, kendi yönetiminin hangi farkını yaşayabileceği ve sıradaki teması neden bekleyeceği; §5'te başvurulan temel ilkelerle ilişki |
| Doğuş ve açılmama | Gerçek şartlar, önceki kararlar, takım durumu veya dış gelişme; önleme, iptal ve tekrar koşulları |
| Kişiler ve bilgi | Tarafların hedefleri, sınırları, bildikleri; başkanın öğrenebileceği kaynaklı kanıtlar; özel ve kamuya açık sözler |
| Zaman içinde yaşanış | İlk temas, görüşmelerdeki ara göndermeler, ekip çalışması, beklenen haber ve sonraki temasın koşulu; gerekçeli süreler |
| Kararlar | Her anda iki anlamlı cevap, kaynak/yetki/süre şartları, kesin etki ve belirsiz devam, tavsiye ve devir |
| Görüşme gündemi | Olağan bir görüşmede konunun ne zaman açıldığı, başka konularla ilişkisi, önceki konuşmalara göre değişen cümleler |
| Bağlantılar | Başka ailelere açılan veya onları önleyen gerçek şartlar, kullanılan ortak kayıt, bağlantının açılmadığı örnek |
| Olağan ve olumlu yol | Sorunsuz ilerleme, emek karşılığı, rahatlama, kutlama veya iyi ilişkinin yeni imkâna dönüşmesi |
| Kriz ve toparlanma | Küçük gerilimden ağır krize gidebilen koşullar, ani dış şok varsa dayanağı, telafi ve kayıp çıkışları |
| Kapanış ve sonraki hayat | Operasyonun bitişi, kalan yükümlülükler, ileride hatırlanabilecek geçmiş; görev kaybında yetki ve bilgi sınırı |
| Uygulama ve kabul | Gereken mevcut/hedef sistem, kodda sahibi, kaydet/yükle devamı ve farklı yolları sınayacak örnekler |

Bu alanlar bütün sahnelerin sırayla oynatılacağı bir liste oluşturmaz. İlk örneğin gerektirmediği bütün alt sistemler peşinen kodlanmaz; kütüphanenin yazımı geliştirme programının önüne yeni kod işi koymaz.

Örnek ayrım: sponsorun avansı nakdi kesin artırır ve kabul edilen hakkı bağlar. Taraftar algısı, ilerideki teklif ve sportif başarı aynı kesinlikte değildir. Kart bu farkı anlatır; kesin ödeme kuralı yalnız hikâye metnine bırakılmaz. Kalıcı veri ve komut sözleşmesi [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi) içindedir.

## 7. Mevcut içerikten geçiş

**Tarihsel durum (2026-10-02 akşam, kullanıcı kararı; 2.8L):** o tarihte kodda kalan bütün konu içeriği silindi (`js/paket-*.js`, `js/uyum-*.js`, başlangıçlar, kişiler, mesaj/hatıra/gözlem metinleri). Daha sonra F6-a, G2, H2 ve S ile sınırlı TEST içerikleri eklendi; bugünkü kaynaklar §12'dedir. “Paket yok” ve eski kayıt/içerik sürümü notları bugünkü uygulama için geçerli değildir. Yeni içerik [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi)'daki kayıt defterlerine eklenir; `araclar/test-icerik.js` yalnız denemelerin yüklediği tarihsel ödeme örneğidir, oyunun senaryo kaynağı değildir.

Geçişin envanteri, sonuç matrisi ve doğrulaması (2.8G–2.8H) tarihseldir: `git show tur/p2:OLAY_KUTUPHANESI.md` §7. Yeni içerikte kural aynıdır: her başkanlık kararı tam iki anlamlı cevaptır (2026-10-22'den beri tek kart sunumuyla, [OYUN_TASARIMI §2](OYUN_TASARIMI.md#başkanlık-kararında-iki-seçenek)); eski çok seçenekli akış yeni kariyerde paralel yaşamaz.

## 8. Paket durumu ve bağımlılıkları

**Durum (2026-10-29, kod incelemesi):** P12'nin §3'te açıklanan dar TEST taslağı oyundadır. Gelen transfer teklifi ve hocanın transfer isteği de çalışan iskeletlerdir; P02/P07'nin bütün tarihsel ve insani yollarının uygulanmış olduğu anlamına gelmez. P01, P03 ve P13'ün 2.8L öncesindeki dar örnekleri kaldırılmıştır. Gazete bugün gerçek kayıtlardan haber kurar; tam medya/TV, kişi gündemi, uzun görüşmeler ve birbirine bağlı hikâyeler hazır değildir. Aşağıdaki tablo bağımlılık haritasıdır; tarihsel “uygulandı” notları yanında silinme durumu korunur. Güncel iş sırası yalnız [YOL_HARITASI](YOL_HARITASI.md) içindedir; R programına eşleme §13'tedir.

| Paket | Şablon (Y0) | İlk kullanım veya gerekli temel | Kapsam sınırı |
|---|---|---|---|
| P01 | Kurumsal (sponsor), kriz | 2.4A dar ödeme/sponsor denemesi (uygulandı, 2.8L'de silindi; kartta “Kullanılan alt kapsam”); Aşama 4 sözleşmelerle genişleme | İlk adımda transfer, kişisel katkı veya tesis sistemi kurulmaz; karttaki bütün yollar aynı anda uygulanmaz |
| P02 | Transfer alımı; kurumsal (vaat) | Aşama 6 adaylık ve vaat; ilgili transfer/yatırım sistemi | Verilmemiş söz veya kesinleşmemiş transfer sonradan oldu diye yazılmaz |
| P03 | Kurumsal | 2.6 sınırlı katkı/görünürlük hakkı (uygulandı, 2.8L'de silindi: tek seferlik destek, süreli pano, çıkar çatışması ve tek pano kuralı); Aşama 4 anlaşmalar | Tam hisse, yatırımcı ve seçim sistemi ilk örneğe dahil değildir; açık mali kararlar ayrıca çözülür |
| P04 | Kurumsal (stat) | 2.8D ortak stat temeli; Aşama 8 tesis/stat yatırımı | Kulübün mevcut stadı etap etap gelişir; lig değişimi ayrı hazır şehir stadı getirmez. Ortak tarif ve 2.8'deki küçük görünür iz bütün inşaat sisteminin hazır olduğu anlamına gelmez |
| P05 | Kurumsal; kriz (taraftar) | Aşama 4 sonrası ticari hak ve ilgili kamuoyu sistemi | Kulüp kimliği, kurgusal marka ve anlaşmanın sınırları gerekir; her kariyere arma krizi eklenmez |
| P06 | Kurumsal | Aşama 4–5 mali/etkinlik temeli; Aşama 8 tesisle genişleme | Yardım maçı için gerçek maç/takvim gerekir; brüt destek vaadi nakit sayılmaz |
| P07 | Transfer satışı | Aşama 4 transfer; Aşama 8 yetişmiş oyuncuyla genişleme | İlk satış örneği mevcut oyuncuyu kullanabilir; akademi varmış gibi geçmiş icat edilmez |
| P08 | Personel; kurumsal | Aşama 8 gelişim, personel ve tesis | Aşama 3–5 rapor/oyuncu temeli hazırlıktır; tam akademi döngüsü değildir |
| P09 | Transfer alımı | Aşama 7–8 yaşam döngüsü ve gerçek kişi geçmişi | Zorunlu ilk sezon dönüşü yoktur; mevcut transfer/rol kuralları gerekir |
| P10 | Kriz | Maç sonucu bağlantısı (3.5) ve ayrıca ilgili kupa/fikstür sistemi | Yalnız lig fikstürünün bulunması kupanın hazır olduğu anlamına gelmez; sonuçlar zorlanmaz |
| P11 | Personel; kurumsal | Aşama 5–8 sezon/kademe; Avrupa ölçeği Aşama 9 | Yeni ihtiyacın sportif ve kurumsal dayanağı bulunmalı |
| P12 | Personel | Aşama 3 rapor/hoca/sonuç (**TEST taslağı oyunda, F6-a 2026-10-24: `js/icerik-p12.js`**); Aşama 4 sözleşmeyle genişleme | Başkan günlük kadro/taktik yöneticisine dönüşmez |
| P13 | Şablonsuz tek kart; kriz | 2.8 küçük söz, teşekkür ve kalıcı görünür iz (uygulandı, 2.8L'de silindi: söz kaydı, maaş sonrası teşekkür, odadaki izler) | Günlük zorunlu moral toplama veya kutlama sonrası zorunlu kriz yoktur |
| P14 | Kurumsal | Aşama 6 seçim/vaat; Aşama 7 görev geçmişi | Seçmen ve kurul yapısı seçilmeden kesin yönetim modeli kurulmaz |

İlk P01 denemesi üç farklı mali bağlamı karşılaştırır: ödeme zamanlaması sıkışan, acil nakit baskısı olmadan anlaşma değerlendiren ve ilgili sorunu önceden çözmüş/taşımayan. Sonuncusunda krizin hiç açılmaması başarı ölçütüdür. Tam koşullar, geçiş ve bitiş ölçütleri yol haritası 2.4A'dadır. P03 ve P13 bu adımın önkoşulu değildir.

## 9. İçerik inceleme soruları

Kart geliştirilirken önce §7 uyum kararı ve iki cevap sözleşmesi, sonra aşağıdaki sorular cevaplanır; çalışma zamanı ve kayıt kontrollerinin ana kaynağı teknik plan, aşama kabulünün ana kaynağı yol haritasıdır. Aile ve olağan içerik birlikte [temel ilkelerin oynama değerlendirmesiyle](OYUN_TASARIMI.md#başkanlık-deneyiminin-temel-ilkeleri) de incelenir; her küçük anın bütün ilkeleri tek başına karşılaması beklenmez:

- Hangi gerçek durum bu meseleyi anlamlı kılıyor; hangi durumda hiç açılmıyor?
- Oyuncu aynı cevabı ezberlemek yerine hangi bilgiye bakacak? Fark yalnız ad/tutar değişimi mi?
- Kişinin talebi ve tepkisi kendi geçmişi ve imkânlarıyla tutarlı mı?
- Önleme, ret, sorunsuz ilerleme veya bedelli toparlanmadan hangileri gerçekten uygulanabilir?
- Olumsuz sonucun riski veya doğan dış gelişme anlaşılabilir mi; gerekçe sonradan mı ekleniyor?
- Oyuncunun girişimi ve iyi ekibi iş yükünü azaltabiliyor mu?
- Olumlu sonuç ve hatıra hak edilmiş mi; sakin dönem zorunlu yeni işle mi dolduruluyor?
- Aynı para, iş veya söz başka sistemde zaten kayıtlı mı?
- Kartın gerektirdiği sistemler gerçekten hazır mı; kalan yollar açıkça sonraya mı bırakılmış?
- Konu olağan görüşmeye katılabiliyor mu; önceki konuşmalar sonraki temasın içeriğini değiştiriyor mu?
- Aradaki günlerde ne yaşanıyor; bir kart ilgili adımı mı değiştiriyor, sonraki görüşmeleri ve beklemeleri gereksizce atlatıyor mu?
- Başka aileye geçişin ortak kayıtta gerçek nedeni var mı; hiç bağlanmayan ve sorunsuz kapanan yol da yazılmış mı?
- Görev değişince konu kimde kalıyor; eski başkan hangi bilgiye erişebiliyor ve hangi eylemleri artık yapamıyor?

## 10. Açık kararlar ve bakım

Kulübün nihai kimliği, seçmen yapısı, kişisel katkı kuralları ve lig/kupa formatları bu tarihsel örneklerle kendiliğinden kesinleşmez; [OYUN_TASARIMI §13](OYUN_TASARIMI.md#13-kapsam-ve-açık-kararlar) izlenir. Olay oranı, kesin para ve kişi özellikleri oynanış denemesi gerektirir. Birkaç başarılı otomatik koşu bütün başlangıçların dengeli veya her yolun kazanılabilir olduğunu kanıtlamaz.

Yeni tarihsel örnek eklenirken kaynak, olgu ve oyun yorumu ayrı tutulur. Gerçek olaylar oyuna uyarlanırken karakterler ve kurumlar kurgusallaştırılır; kaynakların bütün metni kopyalanmaz. Uygulama tamamlanınca kartın kullanılan alt kapsamı belirtilir ve yol haritasındaki ilgili madde ancak doğrulandıktan sonra işaretlenir.

**Araştırma kapsamı (kullanıcı, 2026-10-29):** futbol tarihinin yanında şirketler, dernekler, topluluklar ve başka spor dallarındaki belgelenmiş yönetim, ilişki, büyüme, başarı ve kriz süreçleri de esin kaynağı olabilir. Kaynağın kendi bağlamı belirtilir; olgu doğrulanmadan kaynak listesine kesin bilgi olarak eklenmez. Uyarlama başkanın yetkilerine ve oyundaki kulübün ölçeğine uyar. Yaklaşık 50 büyük aile hedefi, ilk sürüme yeni bir içerik kotası veya bütün aileleri şimdi kodlama kararı getirmez.

## 11. Senaryo haritası ve yaşayan süreçler

**Kullanıcı yönü (2026-10-29; içerik hedefi, henüz kodlanmadı):** oyuncu; başarılı yönetimi, kriz yönetimini, stresi, mutluluğu, keyfi, heyecanı ve bekleyişi aynı kariyer içinde yaşar. Büyük hikâyeler kararlar ve gelişmeler silsilesidir. Tek kararda kapanan işler ile nadir süre baskılı cevaplar da bu hayatın parçasıdır. Hikâye süresi şartlardan doğar; her aile için aynı kart sayısı veya zorunlu hafta sayısı belirlenmez.

### 11.1 Katmanlar ve doğal giriş

| Katman | Senaryodaki görevi |
|---|---|
| Olağan süreç | Ödeme, rapor, sözleşme, görüşme ve ekip işi normal biçimde ilerler; başarı burada da hissedilir. Her işlem karar istemez. |
| Küçük temas | Bir mesaj, olağan görüşmede bir cümle, geciken yanıt veya kamuya açık haber dikkat çeker. Bir bölümü büyümeden kalır. |
| Ara akış | Yeni bilgi, kişilerin girişimleri ve gerçek şartların değişmesi konuyu geliştirir; başkan başka işleri de yürütür. |
| Büyük aile | Birden fazla karar, bekleme ve görüşme haftalar/aylar içinde farklı yollara açılır. |
| Hatıra ve devam | Tamamlanan iş, verilen söz ve değişen ilişki ileride başka bağlamda anlam kazanabilir; sürekli yeni görev üretmez. |

İlk temas ilgili kişinin normal iletişimi içinde görünür. Oyuncuya kritik bilgi ve son tarihler anlaşılır biçimde sunulur; gelecekte hangi büyük hikâyeye dönüşebileceğini duyuran etiket gerekmez. Başlangıçta bütün sezonun olay sırası seçilmez. Başkanın girişimi, geçmiş kararı, gerçek takım durumu, kişinin hedefi, vade veya dış gelişme uygun koşulları oluşturabilir. Yalnız yeni kariyer rastlantısıyla olay seçmek çeşitlilik için yeterli değildir.

Ani bir dış gelişme de mümkündür. Önceden ipucu bulunmayan gerçek bir şokun etkisini mevcut kaynaklar, ekip ve ilişkiler değiştirir. Bir süre sakin gitti diye zorunlu şok yazılmaz. İyi gidiş; daha iyi teklifler, yeni bağlantılar, büyüme girişimleri ve başarıyı birlikte yaşama sahneleri de doğurabilir.

### 11.2 Zaman, görüşmeler ve kanallar

Bir karar kendi doğrudan etkisini uygular ve varsa sonraki işi başlatır. Araştırma, karşı tarafın cevabı, randevu ve sözleşme aşamaları kendi zamanlarında yaşanır. Oyuncu bu arada maça gider veya başka dosyayla ilgilenir. Yalnız süreci uzatmak için tekrar arama, günlük onay veya boş bekleme eklenmez. Bir müdahale konuyu erken çözebilir.

Hoca ile olağan buluşmada son maç, takımın durumu ve devam eden transfer sırayla konuşulabilir. Açık veya geçmişte kalmış konu, kişinin bildikleri ve beklentisi nedeniyle gündeme katılır. Önceki konuşma, verilen söz ve yeni bilgi cümleyi değiştirir. Her cümle kart değildir; gerçek başkanlık kararında tek kartın iki cevabı korunur. Ayrı meselelerin kayıtları ve mali etkileri karışmaz.

| Kanal | Hikâyeye katkısı |
|---|---|
| Telefon/mesaj | Kısa temas, soru, takip ve ilişkiyi hissettiren karşılık |
| Yüz yüze görüşme | Farklı gündemlerin sırayla konuşulması, açıklama ve anlaşmazlığı ele alma |
| Dosya/rapor | Kaynağı ve tarihi belli bilgi, sözleşme, beklenen gelişme ve önceki karar |
| Gazete | Gerçekten bilinebilen olayın kamuoyundaki anlatımı; özel konuşmayı kendiliğinden öğrenmez |
| TV/röportaj | Başkanın kendi açıklaması ve kamuya verdiği söz; bu kanal henüz hedeftir |
| Kulüp hayatı | Antrenman, maç, açılış ve tanıdık insanlarla karşılaşmada yaşanan sonucun hissedilmesi |

Süre baskılı bir maç sonu cevabı uzun bir ilişki veya medya meselesinin başlangıcı olabilir. Sorunun bağlamı, iki cevabın anlamı ve cevapsız kalmanın davranışı anlaşılır olmalı; sayaç seçenekler okunur olmadan başlamaz (OYUN_TASARIMI §10). Tepki, gerçekten söylenen sözden, kimlerin duyduğundan ve tarafların hedeflerinden doğar. Tek cümlenin bütün kariyeri otomatik bitirdiği gizli kural kurulmaz.

### 11.3 Aileler arasında bağlantı

Birleşim; kaynak, söz, ödeme tarihi, yetki, sözleşme, kişi ilişkisi veya kamuya açıklama gibi ortak gerçeğin değişmesine dayanır. Bağlantının kaynağı geçmişte bulunabilmelidir. Sıradaki paket kimliğini koşulsuz çağıran zorunlu hikâye dizisi yazılmaz.

| Bağlantı | Yazılacak örnek |
|---|---|
| Yeni imkân açar | Gerçekleşen satış gelirinin kurumsal yatırımı mümkün kılması |
| Risk oluşturur | Gelecek sponsor tahsilatına dayanarak yapılan harcamanın nakit tamponunu azaltması |
| Önler/hafifletir | Alternatif gelir ve açık rol anlaşmasının bazı kriz yollarını hiç açtırmaması |
| Gündemleri karşılaştırır | Aynı bütçeyi isteyen transfer ve tesis işinde tarafların ayrı beklentileri |
| Sonradan hatırlanır | Gerçekten verilen kamuoyu sözünün sonraki röportajda sorulması |
| Görev dönemlerini bağlar | Başlatılan yatırımın yeni yönetimde tamamlanması ve eski başkanın açılıştaki konumu |

**Bağlantı örneği (kurgu; sabit kampanya değil):** transfer vaadi (P02) ve destek anlaşması (P03), ödeme/maaş takvimini etkiler. Tahsilat düzenliyse iş olağan biçimde sürer; başarı ve emek P13'e konu olabilir. Tahsilat aksar ve tampon yetersiz kalırsa P01 anlam kazanabilir. Çözüm için oyuncu satışı düşünülürse P07'de hocanın beklentisi önem kazanır. Uzlaşı varsa konu kapanır; gerçek sözler bozulur ve kurul desteği azalırsa P14 ve genel kurul gündemi oluşabilir. Hiçbir ok zorunlu maç sonucu, sıradaki kriz veya seçim yenilgisi yaratmaz. Aynı para ve söz farklı dosyalarda ikinci kez üretilmez.

### 11.4 Tempo ve tekrar

İçerik seçimi ilgili değişiklik veya planlanmış gelişme anında yapılır; sahne çizilirken sürekli yeni kriz arama kuralı kurulmaz. Gerçek vade ve karar sonuçları ortak takvimde zamanında işler. Yoğunluk denetimi yalnız uygun yeni içeriğin sunumunu etkiler; borcu, sözü veya gerçekleşen dış gelişmeyi gizlice ertelemez (OYUN_TASARIMI §10, TEKNIK_PLAN §6).

Normal, olumlu, gerilimli ve ağır süreçler birlikte yazılır. İyi yönetim önlemeyi, daha az müdahaleyi ve rahat dönemi sağlayabilir. Sakinlikten sonra ilerleme; başkanın yeni hedefi, büyüyen kulübün ihtiyacı, olumlu fırsat veya dış gelişmeden doğabilir. Her rahat dönemin sonunda kriz şartı ve günlük olay kotası yoktur. Hikâye sırf uzun görünsün diye çözülen konu tekrar açılmaz.

Aynı aile farklı gerçek şartlarda farklı karar anlamları taşır. Yalnız ad, tutar ve tarih değiştirmek yeterli çeşitlilik sayılmaz. Yakın tekrar, daha önce yaşanmış birleşimler ve eşzamanlı dikkat yükü içerik kabulünde incelenir; kesin oranlar normal tempoda oynanarak seçilir. Kayıt yüklemek veya aynı konuşmayı tekrar açmak yeni rastlantı üretmez.

### 11.5 Görev kaybı ve yeniden hazırlanma

Senaryo haritası adaylık, başkanlık, genel kurul, seçim, görevi bırakma/aday olmama, görev dışında takip ve yeniden hazırlanmayı kapsar. Başkanın seçim geçmişi, istifa gerekçesi ve gerçek ilişkileri devam eder. Görev dışında kulübün yönetim yetkisi ve iç belge erişimi sona erer; yeni yönetim aynı kulübün yükümlülüklerini devralır. Başkanın kişisel ilişkileri ve kamuya açık geçmişi yaşamayı sürdürür.

Bir tesis yeni başkan döneminde tamamlanabilir; eski çalışan yeni yönetimde kalabilir; önceki kararlar kamuoyunda farklı yorumlanabilir. Oyuncu haberleri ve maçları takip eder, erişebildiği insanlarla görüşür, açıklama yapar ve yeni ekip hazırlayabilir. Başka başkanın başarısızlığı, geri dönüş veya yeniden seçilme garanti edilmez. Kesin istifa işlemi, seçmen modeli ve ekran akışları ilgili kariyer aşamalarında tasarlanır; senaryo metni bunları uygulanmış saymaz ([OYUN_TASARIMI §4–5](OYUN_TASARIMI.md#4-yönetim-ekibi-vaatler-ve-seçim)).

## 12. Bugünkü uygulamada olaylar nereden geliyor?

**Kod incelemesi: 2026-10-29.** Bu bölüm mevcut uygulamayı gösterir; §11'in tamamlandığı anlamına gelmez. Markdown kataloğu çalışma zamanında yüklenmez. Paket tarifleri, takvim işleri, kararlar, girişimler ve sunum kaynakları kendi JavaScript kayıt defterlerine eklenir; yeni içeriğin tasarımı bu dosyada, çalışan karşılığı sahip kodunda tutulur.

| Kaynak | Bugünkü başlatma ve davranış | Kütüphaneyle ilişkisi |
|---|---|---|
| [js/icerik-p12.js](js/icerik-p12.js) | Maç sonucu kancası 21:30 değerlendirmesini planlar. `hocaDegerlendirme`, mevcut hocanın son 3 maçta en çok 1 puanı veya 5 maç galibiyetsizliği koşuluyla açılır; açık dosya ve 14 günlük tekrar aralığı denetlenir. | P12'nin dar TEST uygulaması; ilişki ve kurul baskısı henüz tetik kaynağı değil. |
| [js/transfer.js](js/transfer.js) | `gelenTeklif` ve `hocaTalebi` paketleri. TEST kış döneminde 7/16/26 Ocak teklif, 5 Ocak hoca talebi planlanır; koşullar o anda değerlendirilir. Talep onayından 5 gün sonra imza girişimi gelir. | Çalışan satış/alım iskeletleri; tarihsel ailelerin bütün yolları uygulanmış değil. Tarihler nihai içerik kuralı değil. |
| [js/sozlesme.js](js/sozlesme.js) | Sezon sonu kancası biten sözleşmeleri bulur; tek mesele içinde sırayla Yenile/Bırak kararlarını kurar. | Genel sözleşme akışı; `PAKETLER` üzerinden açılmıyor. |
| [js/kulup-mali.js](js/kulup-mali.js), [js/mali-rapor.js](js/mali-rapor.js) | Ay başı maaş/lig payı, iç saha maçından bilet geliri; haftalık/aylık rapor ve eksi kasa uyarısı. | Olağan mali hayat var. Eksi kasa uyarısı, P01'in uzun kriz hikâyesi değil. |
| [js/yazisma.js](js/yazisma.js) | Başkanın sorusu gecikmeli `yazismaCevap` gelişmesi kurar. Görüşme önerisi randevuya gider; katılım bugün kısa TEST takım özeti verir. | Girişimden doğan iletişim var. Birden çok yaşayan gündemin ayrıntılı görüşmeye katılması henüz yok. |
| [js/oyuncu-hafta.js](js/oyuncu-hafta.js), [js/gozlem.js](js/gozlem.js) | Gerçek oyuncu durumundan antrenman sinyali ve tarihli gözlem notu çıkar. | Bugün gözlem/rapor kaynağı; her sinyal yeni senaryo veya karar açmıyor. |
| [js/gazete.js](js/gazete.js), [js/soz.js](js/soz.js) | Gazete, kayıtlı maç/transfer/hoca değişimi ve diğer kaynaklardan sayıyı kurar; sözler ilgili gerçek sonuçla değerlendirilir. | Haberleri okumak yeni kriz veya geçmişe yeni olay üretmez. Kaynaklı haberin sonraki karara bağlanması ayrıca içerik ister. |
| [js/karar-ani.js](js/karar-ani.js), [js/ekran-an.js](js/ekran-an.js) | Süreli iki cevap altyapısı ve rakip başkanla tokalaşma TEST örneği var. Bu örnek kariyerin normal maçında kapalı; seçimi uzun kariyer etkisi taşımıyor. | Röportaj cevabından uzun krize giden hikâye henüz yok; yalnız süreli ekranın varlığı o hikâyeyi hazır yapmaz. |

**Ortak çalışma biçimi:** [js/olay.js](js/olay.js) içindeki `paketDene`, kendisine verilen aileyi komut sırasında değerlendirir. Gizli takvim gelişmesi zamanı geldiğinde `GELISMELER` kaydını çalıştırır. Çizim, özet ve önizleme paket açmaz. Bütün paketleri her karede tarayan sürekli bir kriz seçici yoktur; genel içerik yoğunluğu denetimi de henüz kurulmamıştır.

**Uzun süreç için önemli sınır:** [js/mesele.js](js/mesele.js), bağlı bekleyen işi kalmayan meseleyi kapatır. Olay örneği tek meseleye bağlanır; mevcut doğrulama aynı meseleyi iki olayın paylaşmasını kabul etmez. Bu yüzden haftalarca sessiz duran hikâye ile operasyon dosyasının kapanışı, aynı görüşmede farklı meselelerin gündemi ve aileler arası bağlantı sahipliği sonraki uygulama planında açıkça ele alınmalıdır. Sahte bekleyen işler koyarak dosya sonsuza dek açık tutulmaz; kapanan işin kayıtlı geçmişi sonraki konuya dayanak olabilir. Bu belge yeni kayıt alanını veya şema değişimini peşinen kesinleştirmez.

## 13. Uygulama yol haritasıyla eşleme

**İş sırası değişmedi:** geçerli program R1–R7, ardından H3 ve sonraki kariyer aşamalarıdır (YOL_HARITASI karar 56; [R programı §0](araclar/plan/r1-uygulama.md#0-program-revizyonu-belge-ilk-commit)). Eski [Y programı](araclar/plan/y-program.md) teknik ayrıntı ve bağımlılık başvurusudur; başındaki R yönlendirmesiyle okunur. Aşağıdaki eşleme planlanan turlarda incelenecek içerik ihtiyaçlarını gösterir; onaylı turun kapsamına sessizce yeni özellik eklemez.

| Programdaki yer | Bu haritaya katkısı ve sınırı |
|---|---|
| R1 güvence | Kayıt ve komut güvenliği, yazılmış olayın bir kez uygulanmasının temeli. Uzun senaryo sistemi bu turun kapsamında değil. |
| R2 telefon | Konuşma, konular ve geniş karar kartının sunumu. Bu ekranın tamamlanması yaşayan çok konulu görüşmeleri tamamlamaz. |
| R3 Canlı Skor | Takım ve maç durumunun okunabilir zemini; bu verilere bağlı senaryolar ayrıca yazılır. |
| R4 transfer | Şablon motoru ve kıvrım defteri (`js/sablon.js`): transfer alımı zinciri ve yedi TEST kıvrımı (rakip araya girer → rakibe gider, bedel artar, sağlık raporu, hocanın itirazı, sızıntı, tescil gecikmesi, rakibin oyuncusu); serbest oyuncular ve düşüşteki eski yıldız; mekânlar. Yeni transfer olayları `SABLON_KIVRIMLARI.transferAlim`'e kıvrım olarak eklenir (aşama, an, koşul, olasılık, uygula); metinleri `MESELE_OLAYLARI` 'ta.*'. Fikir kaydı [araclar/plan/transfer-tasarim.md](araclar/plan/transfer-tasarim.md) §3–§4. |
| R4 küçültülmüş Y1 | İlk kısa transfer zinciri, bekleme/devir ve pazarlık zemini. Normal ilerleyen yol ve bir kararın sonraki aşamaları atlatmaması ilk oynama denemesinde incelenebilir. |
| R5 balkon | Kulüp hayatını izlerken iş yürütme. Gözlem, bütün senaryolar için zorunlu gelişme açma işlemi yapılmaz. |
| R6 zincirler ve kişiler | Kişi gündemi/hafıza, diğer dosya zincirleri ve görüşmeler için temel. §11'deki sessiz devam, ortak gündem ve bağlantı ihtiyaçları tur planlanırken mevcut kapsamla karşılaştırılır; tamamı otomatik olarak bu tura atanmaz. Kullanıcının telefon görsellerindeki “alıntıla ve hatırlat” (kişinin eski sözünü alıntılayıp hatırlatmak; R2 eki notu, 2026-10-29) kişi hafızasıyla birlikte burada değerlendirilir. |
| R7 genel kurul | Sezon sonu güven değerlendirmesi. Tam seçim, istifa ve görev dışı hayatın uygulanmış olduğu anlamına gelmez. |
| H3 ve Aşama 5–7 | Yeni sezon/arşiv; medya/TV ve sezon ölçeği; adaylık/seçim; görev kaybında yetkiler, dışarıdan takip ve yeniden hazırlanma. Ayrıntı [YOL_HARITASI](YOL_HARITASI.md) Aşama 5, 6 ve 7. |

### 13.1 İlk birleşik örneğin kabulü

İçerik koduna geçildiğinde kapsamı ilgili turda seçilecek küçük bir birleşimle aşağıdaki yollar sınanır. Bu liste yeni bir sabit kampanya veya tur sırası değildir.

- Olağan bir iş sorunsuz sürer; her rapor, ödeme ve sohbet yeni karar üretmez. Emek, sonuç ve rahatlama yaşanabilir.
- Küçük temas gerçek şartlarla önem kazanır; aynı giriş başka şartlarda büyümeden kalır. Önlenen kriz başka adla zorla dönmez.
- Günler sonra yapılan normal görüşmede ilgili konu başka gündemlerle birlikte, önceki söze uygun biçimde açılır. Her cümle ayrı görev sayılmaz.
- Bir karar yalnız ilgili etkiyi ve sonraki işi başlatır. Kaydet/yükle beklemeyi, konuşma geçmişini ve kesinleşmiş sonucu korur; aynı ödeme iki kez uygulanmaz.
- Bir aile diğerinin koşullarını değiştirir; bağlantı açılan ve açılmayan yolların gerçek nedeni gösterilebilir. Skor ve kupalar senaryo için zorlanmaz.
- Süre baskılı cevap kullanılıyorsa süre, iki cevabın anlamı, cevapsız davranışı ve sonraki tepkinin nedeni anlaşılırdır. Uzun devam, gerçek açıklama kaydına dayanır.
- Operasyon dosyası kapanınca geçmişi korunur; sonraki hatırlatma işi geri almaz. Sessiz devam ve bağlantı sahipliği mevcut veri modeliyle ayrıca doğrulanır.
- Görev kaybı örneği ancak ilgili kariyer sistemi hazırsa sınanır: iç yetkiler kaldırılır, kulüp devam eder, erişilebilir bilgilerle yeniden hazırlanılır; rakibin çöküşü ve geri dönüş zorunlu değildir.

### 13.2 Kütüphaneyi büyütme yöntemi

Araştırma ve taslak yazımı bu dosyada yürür. Önce ailelerin kaynakları, farklı doğuşları ve ortak gerçekler üzerinden bağlantıları çıkarılır; birkaç temsilci aile §6 biçiminde ayrıntılandırılır. Normal, olumlu ve ağır yollar birlikte incelenir. İlk uygulamalar oynanıp tempo ve eksik ortak yetenekler görüldükçe yaklaşık 50 ailelik hedef genişletilir. Yalnız aile sayısı veya teorik dal çarpımı tekrar oynanabilirlik kanıtı değildir.

Kodlama sırasında aile, mevcut mesele/takvim/para/söz temelini ve gerekli ortak dosya şablonunu kullanır. Aynı veri bütün kanallarda okunur; senaryo başına ayrı ekonomi, ilişki veya zaman sistemi kurulmaz. Yeni ekran ve mekanik ihtiyacı ailede görünür yazılır, ilgili turda ayrıca ele alınır. Bu çalışma dokümanı senaryoları oyuna kendiliğinden aktaran bir dosya biçimi değildir.

## 14. Geniş araştırma: yönetim, başarı ve kriz örnekleri

**Araştırma tarihi: 2026-10-29. Durum: kaynaklı araştırma ve kurgusal uyarlama adayları; oyun içeriği uygulanmadı.** Çekirdekteki S01–S23 korunarak 50 yeni inceleme (S24–S73) eklendi: 18 futbol, 5 diğer spor, 23 işletme/kurum ve 4 kültür/topluluk örneği. Böylece kaynaklı örnek sayısı 73 oldu; bu, 73 ayrı oynanabilir paket veya 50 büyük senaryonun tamamlandığı anlamına gelmez. Birden çok tarihsel olay aynı aileyi besleyebilir.

Her kayıtta **tarihsel çekirdek ve kaynak** ile **bizim oyun için önerilen süreç** ayrıdır. Uyarlama, olası gelişme ve sonuç yolları kurgudur; gerçek kişi veya kurumun bunları yaptığı ileri sürülmez. Kişi/kurum anlatısı, dönemin açıklaması, haber ve kişisel anı kaynak türüyle belirtilir. Kurumun kendi başarı açıklaması tek başına tartışmasız neden–sonuç kanıtı sayılmaz. İncelemede erişimi bozulan eski bağlantılar için kullanılabilir alternatifler seçildi; bazı dinamik sayfalarda arama dizinindeki metin de kullanıldı.

**Okuma yolu:** [futbol](#141-futbol), [diğer sporlar](#142-diğer-sporlar), [işletmeler ve kurumlar](#143-i̇şletmeler-ve-kurumlar), [kültür ve topluluk](#144-kültür-ve-topluluk). İlk derinleştirme seçimi §15'te; aileler arasında olası bağlar ve olağan hayat örnekleri §16'da.

Buradaki akışlar bir sonraki sahneye zorunlu geçiş değildir. Aşamalar gerçek şartlara göre açılır, erken çözülebilir veya hiç yaşanmayabilir. Haftalara/aylara yayılacak görüşme ve beklemeler, seçilen adaylar §6 biçiminde yazılırken somutlaştırılır. Her oyuncunun bütün örneklerle karşılaşması, bütün olumlu süreçlerin krize dönmesi veya aynı sayıda kart görmesi hedeflenmez.

### 14.1 Futbol

#### S24 — Brentford — başarı sürerken çalışma modeli ayrılığı (2015)

**Tarihsel çekirdek:** Brentford, yükselme mücadelesi sürerken Warburton ve ekibiyle sezon sonunda ayrılacağını açıkladı. Yeni transfer ve yönetim yapısı konusunda görüşler uzlaşmadı; açıklama tarafların dostça ayrıldığını da belirtiyor. [Kaynak: Brentford'un dönem açıklaması; birincil](https://www.brentfordfc.com/en/news/club-statement_70169).

**Oyun fikri:** Başarılı hoca ile kulübün kişiden bağımsız çalışma düzenini kurmak isteyen yönetim arasında meşru bir yetki anlaşmazlığı.

**Olası gelişme:** İyi sonuçlar → olağan toplantıda transfer yetkisi konusu → birkaç görüşmede farklı beklentiler → sezon sonu çalışma şartlarını belirleme. Başkan verdiği yetki sözlerini değiştirecekse bunu açıkça konuşur.

**Yollar ve karşılık:** Uzlaşı, sınırlı yetki paylaşımı veya planlı ayrılık mümkün. İyi sonuçlar sürerken de ilişki zorlanabilir; ayrılık otomatik sportif çöküş yaratmaz.

**Bağlantı ve ihtiyaç:** P12, P14; kişi gündemi, yetki ve söz hafızası. Yakın uyarlama.

#### S25 — Newcastle–Keegan — verilen yetki sözünün bedeli (2008–2009)

**Tarihsel çekirdek:** Tahkim heyeti, Keegan'ın transferlerde son söz uyuşmazlığı sonrasında kulüp tarafından sözleşmesinin esaslı biçimde ihlal edildiğine karar verdi; 2 milyon sterlin tazminat hükmetti. Metin Ignacio González transferini inceliyor. [Kaynak: Tahkim kararının yayımlanmış metni; birincil belgenin kopyası](https://studylib.net/doc/8623164/in-the-premier-league-manager-s-arbitration).

**Oyun fikri:** Başkan, hoca ve transfer sorumlusunun aynı yetki anlaşmasını farklı anlaması; ticari ilişki uğruna alınan oyuncunun kurumsal bedeli.

**Olası gelişme:** İşe alımda verilen söz → yöneticiye sonradan açılan alan → hocanın itirazı → belge ve önceki görüşmelerin gündeme gelmesi → anlaşmayı düzeltme veya ayrılık.

**Yollar ve karşılık:** Söz baştan açık kurulmuşsa anlaşmazlık önlenebilir. Ticari fayda, kadro kullanımı ve tazminat ayrı değerlendirilir; başkan oyuncuyu oynatamaz.

**Bağlantı ve ihtiyaç:** P03, P12, P14; yetki sınırı ve sözleşme. Yabancı hukuktaki tutar/sonuç oyuna kural olarak taşınmaz.

#### S26 — Leicester–Adrien Silva — anlaşma var, tescil yok (2017–2018)

**Tarihsel çekirdek:** Leicester, Silva'nın transferine ilişkin tescili tamamlayamadığını ve oyuncunun ocak ayına kadar seçilemeyeceğini açıkladı. Kulüp işlemlerin zamanında yapıldığını savunuyordu; tarafların süre konusundaki görüşü aynı değildi. [Kaynak: Leicester'ın tescil kararı açıklaması; birincil](https://www.lcfc.com/media-article/Adrien-Silva:-Fifa-Registration-Decision-Upheld).

**Oyun fikri:** Transferin farklı aşamalarının ayrı risk taşıması; imza duyurusuyla oyuncunun kullanılabilirliğinin karıştırılması.

**Olası gelişme:** Birbirine bağlı satış ve alım → son tarihe yaklaşan evrak/ödeme → ekibin uyarıları → tescil sonucu → gerekiyorsa aylar süren geçiş dönemi ve hocayla görüşmeler.

**Yollar ve karşılık:** Erken hazırlıkla sorunsuz tamamlanabilir, sonraki döneme anlaşılabilir veya transfer kaçabilir. Belirsiz arayüz ve saniyelik oyuncu refleksi cezası kurulmaz.

**Bağlantı ve ihtiyaç:** Transfer alımı/satışı, P02; gerçek dönem ve tescil kuralları gerekir. Yakın uyarlama.

#### S27 — Barcelona–Neymar — rekor gelirle gelen yeniden yapılanma (2017)

**Tarihsel çekirdek:** Barcelona, Neymar'ın temsilcilerinin oyuncu adına 222 milyon avroluk sözleşme fesih bedelini ödediğini duyurdu. Bu olgu, sonradan yapılan bütün harcamaların nedenini tek başına açıklamaz. [Kaynak: Barcelona'nın ödeme açıklaması; birincil](https://www.fcbarcelona.com/en/football/first-team/news/748497/fc-barcelona-communique-on-neymar-jr).

**Oyun fikri:** Önemli oyuncunun beklenmedik ayrılışı ile çok büyük nakit girişinin aynı anda yaşanması.

**Olası gelişme:** Önceden bilinen sözleşme maddesi → oyuncunun tercihi → mali müdür, hoca ve yatırım sorumlularının farklı talepleri → transfer görüşmeleri → sonraki sözleşmelerde oluşan beklentiler.

**Yollar ve karşılık:** Borç azaltmak, seçici güçlenmek veya pahalı bir hedefe yönelmek farklı devamlar açar. Gelen para zorunlu kriz üretmez; sağlıklı yeni dönem de mümkündür.

**Bağlantı ve ihtiyaç:** P07, P01, P11, P12; sözleşme maddesi ve tahsilat. Ölçeğe göre uyarlanır.

#### S28 — AZ–DSB — saha dışındaki iflasın kulübe ulaşması (2009–2010)

**Tarihsel çekirdek:** AZ'nin 2009 şampiyonluğunun ardından DSB grubundaki şirketler iflas etti. 2010'daki çözüm, kulüp hisselerinin devrini, borçların yeniden düzenlenmesini ve stat işlemlerini kapsadı. [Kaynak: İşlemi yürüten hukuk firmasının duyurusu; birincil taraf kaynağı](https://cms.law/en/nld/news-information/cms-advises-bankruptcy-receivers-of-dsb-group-on-the-sale-of-football-club-az).

**Oyun fikri:** Başarılı kulübün tek bir destekçinin kendi işlerine fazla bağımlı olması.

**Olası gelişme:** Yenileme görüşmesinin ertelenmesi → doğrulanabilir dış haber → gelecek tahsilatın belirsizleşmesi → mevcut kaynaklarla geçiş planı → başka destekçilerle aylar süren yeniden düzenleme.

**Yollar ve karşılık:** Tahsil edilmiş para kaybolmaz. Gelirleri çeşitlendiren kulüp daha az etkilenebilir; hazırlıksız kulüp küçülme veya koşullu desteği tartışır.

**Bağlantı ve ihtiyaç:** P01, P03, P14; sponsor sözleşmesi, nakit takvimi. Hisse devri ayrıca açık ürün kararıdır.

#### S29 — Leeds — gelecekteki gelire dayanarak bugünü büyütmek (2000–2004)

**Tarihsel çekirdek:** Leeds'in yüksek harcamaları, beklenen Şampiyonlar Ligi gelirlerinin devam etmemesiyle ağır mali baskıya dönüştü; değerli oyuncular elden çıkarıldı. Kaynak, bu süreci çok yıllı bir gelişme olarak anlatıyor. [Kaynak: UEFA'nın dönem değerlendirmesi](https://www.uefa.com/news-media/news/0199-0e6a9470caed-9a010034d387-1000--leeds-paying-a-heavy-price/).

**Oyun fikri:** Yükselme veya Avrupa ihtimalinin bütçede kesinleşmiş para gibi kullanılması.

**Olası gelişme:** Sportif fırsat → harcama/finansman kararı → gerçek maç sonuçları → gelir gerçekleşirse kapasiteyi koruma, gerçekleşmezse vadelere hazırlık → satış veya yeni anlaşma.

**Yollar ve karşılık:** Risk alınan yol başarıya da ulaşabilir. Daha temkinli bütçe fırsat maliyeti taşır. Senaryo başarısızlık yaratmak için skoru değiştirmez.

**Bağlantı ve ihtiyaç:** P01, P07, P11; çok sezon, finansman ve gelir belirsizliği. Orta/ileri aşama.

#### S30 — Exeter — elenilen eşleşmenin mali mirası (2005)

**Tarihsel çekirdek:** Exeter, Manchester United'la Old Trafford'da 0–0 kaldı. Kulübün anlatımına göre seyirci geliri borçları neredeyse kapattı; tekrar maçında elenmelerine rağmen eşleşmenin kalıcı katkısı oldu. [Kaynak: Exeter'ın kulüp tarih anlatımı; birincil](https://www.exetercityfc.co.uk/news/2023/march/10-years-on-man-utd-0-0-exeter-city).

**Oyun fikri:** Sportif zafer olmadan da başkanın kulüp için çok değerli bir süreç yönetebilmesi.

**Olası gelişme:** Gerçek kura → bilet ve personel kapasitesi → gider/prim görüşmeleri → maç → gerçekleşen net gelirin kullanımı → çalışanlara ve şehre teşekkür.

**Yollar ve karşılık:** Borç azaltımı, küçük kalıcı yatırım veya ölçülü kadro desteği mümkün. Türkiye'deki kupa formatında olmayan tekrar maçı kuralı taşınmaz.

**Bağlantı ve ihtiyaç:** P10, P01, P13; kupa ve gerçek gelir sistemi. Güçlü olumlu süreç adayı.

#### S31 — Barcelona–Messi — iki tarafın isteği uygulama sınırına takılıyor (2021)

**Tarihsel çekirdek:** Barcelona, Messi'yle anlaşmaya ve imza niyetine rağmen finansal/yapısal engeller ve LaLiga tescil düzeni nedeniyle sözleşmenin gerçekleşemediğini açıkladı. Bu, kulübün dönemdeki açıklamasıdır. [Kaynak: Barcelona'nın ayrılık açıklaması; birincil taraf kaynağı](https://www.fcbarcelona.com/en/news/2207655/leo-messi-not-staying-at-fc-barcelona).

**Oyun fikri:** Sözleşmeyi yenileme niyetinin mali ve idari uygulanabilirlikle sınanması.

**Olası gelişme:** Erken mali değerlendirme → oyuncuyla temas → diğer sözleşmelerin etkisi → kamuoyu beklentisi → mümkün çözüm veya ayrılığın açıklanması.

**Yollar ve karşılık:** Bilinen sınırlar baştan yönetilirse kriz önlenebilir. Son gün icat edilen gizli lisans şartı kullanılmaz; koşul oyunda önceden öğrenilebilir olmalıdır.

**Bağlantı ve ihtiyaç:** Sözleşme, P01, P02, P09; seçilecek oyun içi kayıt/lisans kuralları gerekir. İleri aşama.

#### S32 — Dortmund–Lewandowski — ayrılacağı bilinen oyuncuyla son sezon (2013–2014)

**Tarihsel çekirdek:** Lewandowski, Ocak 2014'te Bayern'le sezon sonrasına yönelik anlaşma yaptı. Dortmund'daki son sezonunu tamamladı ve sözleşme sonunda bedelsiz ayrıldı; son sezonunda lig gol kralı oldu. [Kaynak: Bundesliga'nın kariyer incelemesi](https://www.bundesliga.com/en/bundesliga/news/robert-lewandowski-borussia-dortmund-klopp-bayern-munich-barcelona-18081).

**Oyun fikri:** Gelecekte ayrılacağı belli olan kişinin bugünkü katkısını ve ilişkilerini yönetmek.

**Olası gelişme:** Yenileme belirsizliği → ayrılık niyetinin açıklanması → hoca, kaptan ve taraftarın tepkileri → birlikte geçirilecek sezon → halef hazırlığı ve veda.

**Yollar ve karşılık:** Profesyonel, verimli bir son sezon mümkündür. Her ayrılık niyeti huzursuzluk yaratmaz; bazı durumlarda açık konuşma beklentiyi azaltır.

**Bağlantı ve ihtiyaç:** P07, P09, P12, P13; sözleşme ve kişi hafızası. Yakın uyarlama.

#### S33 — Dortmund–Götze — önemli maç öncesi kesinleşen ayrılık haberi (2013)

**Tarihsel çekirdek:** Dortmund, Götze'nin çıkış maddesini kullanarak Bayern'e geçmek istediğini bildirdi; oyuncuyla temsilcisinin sözleşmeye uygun davrandığını vurguladı. Açıklama, ertesi günkü Şampiyonlar Ligi yarı finali öncesindeydi. [Kaynak: Dortmund'un dönem açıklaması; birincil](https://www.bvb.de/de/de/aktuelles/news/news.html/News/Uebersicht/Stellungnahme-von-Borussia-Dortmund.html).

**Oyun fikri:** Hukuken bilinen bir ayrılığın kamuoyuna geliş zamanı, sportif gündemi ve vedayı etkileyebilir.

**Olası gelişme:** Gizli görüşmeler → doğrulanmış haber → kısa basın cevabı → hocayla ve oyuncuyla ayrı görüşmeler → sezonun kalanında davranışların izlenmesi.

**Yollar ve karşılık:** Sakin ve saygılı geçiş, taraftarla açıklama veya ilişkiyi zorlayan üslup mümkün. Haberin etkisi maç sonucunu zorlamaz; sözleşmeye uygun davranış ihanet diye sabitlenmez.

**Bağlantı ve ihtiyaç:** P07, P02, P13; kamuoyu bilgisi, açıklama ve zaman bağlamı.

#### S34 — Southampton — başarı sonrası toplu ayrılığa rağmen düzen kurmak (2014–2016)

**Tarihsel çekirdek:** Pochettino'nun ve önemli oyuncuların ayrılışından sonra Koeman göreve geldi. Yeni oyuncularla kulüp 2014–15'i yedinci, sonraki sezonu altıncı tamamladı; birçok kaybın ardından toparlanma mümkün oldu. [Kaynak: Southampton'ın dönem tarihçesi; birincil](https://www.southamptonfc.com/en/2010s-to-present-day).

**Oyun fikri:** Başarının kadro ve personeli piyasada daha görünür yapması; birden fazla ayrılığın birlikte yönetilmesi.

**Olası gelişme:** İlk iyi teklif → kişiyle gelecek görüşmesi → başka ayrılıkların belirginleşmesi → halefler ve bütçe öncelikleri → yeni ekibe zaman tanıma → sezon değerlendirmesi.

**Yollar ve karşılık:** Ayrılıklar sırayla ve hazırlıkla karşılanabilir. Herkesin kaldığı dal da mümkündür. Önceki başarı zorunlu parçalanma veya yeni başarısızlık üretmez.

**Bağlantı ve ihtiyaç:** P07, P11, P12; birden fazla dosya ve gerçek kadro değişimi. Güçlü yeniden kurma adayı.

#### S35 — Schalke–Gazprom — kaynağı değiştirmek ve sürekliliği korumak (2022)

**Tarihsel çekirdek:** Schalke, Gazprom ortaklığını erken bitirdi. Kulüp açıklaması bu kararın mali hareket kabiliyetini etkilemediğini özellikle belirtiyor; olay doğrudan iflas öyküsü olarak sunulamaz. [Kaynak: Schalke'ın ortaklığı bitirme açıklaması; birincil](https://schalke04.de/verein/update-2802/).

**Oyun fikri:** Dış dünyadaki gelişme ticari ortağın kulüple birlikte anılmasını sorunlu kılabilir; hazırlık geçişi kolaylaştırır.

**Olası gelişme:** Dış gelişme → kurulda değerlendirme → sponsorla görüşme → kamuya açıklama → alternatif partner arayışı ve sözleşme yenileme.

**Yollar ve karşılık:** Nakit tamponu ve alternatifler varsa sakin geçiş mümkündür. Her sponsor değişimi mali kriz yaratmaz; baskı farklı gruplardan gelebilir.

**Bağlantı ve ihtiyaç:** P03, P05, P14; sponsor sözleşmesi ve kamuoyu. Gerçek savaşın ayrıntıları oyun eğlencesi olarak kopyalanmaz.

#### S36 — Chelsea Pitch Owners — çoğunluk var, gereken onay yok (2011)

**Tarihsel çekirdek:** Stamford Bridge mülkiyetine ilişkin öneriler yaklaşık yüzde 62 destek aldı, fakat gereken yüzde 75'e ulaşamadı. CPO yönetimi kuruluşun kulübün statla bağını koruma amacını hatırlattı. [Kaynak: CPO başkanının açıklaması; birincil](https://www.chelseafc.com/en/news/article/statement-from-cpo-chairman-regarding-new-directors-and-agm-date).

**Oyun fikri:** Başkanın iyi bulduğu yatırımın, başka paydaşların meşru hakları ve farklı öncelikleriyle karşılaşması.

**Olası gelişme:** Proje araştırması → destekçilerin koşulları → görüşmeler → önceden bilinen yetki/onay süreci → proje revizyonu veya devam.

**Yollar ve karşılık:** Daha küçük etap, güvencelerle yeni uzlaşı veya mevcut statta kalmak mümkün. İngiliz mülkiyet yapısı ve yüzdeler doğrudan oyun kuralı yapılmaz.

**Bağlantı ve ihtiyaç:** P04, P05, P14; seçmen ve tesis hakları açıklığa kavuşmalı. İleri aşama.

#### S37 — Parma — ağır kayıptan sonra kurumun yeniden kurulması (2015–2018)

**Tarihsel çekirdek:** Parma, 2015 iflasından sonra yerel ortaklarla yeniden kuruldu ve Serie D'den başlayarak üç sezonda Serie A'ya döndü. Tarihçe, taraftar bağının devamını vurguluyor. [Kaynak: Parma'nın kulüp tarihçesi; birincil](https://www.parmacalcio1913.com/en/history-of-the-club/).

**Oyun fikri:** Kurumsal kayıp sonrasında insanları, güveni ve daha mütevazı bir çalışma düzenini yeniden bir araya getirme.

**Olası gelişme:** Kayıpların ortaya çıkması → neyin korunabileceğini konuşma → yeni sorumluluklar → küçük ama gerçekleşen işler → zaman içinde güveni toplama.

**Yollar ve karşılık:** Buradan yeniden örgütlenme ve aidiyet alınabilir. Oyunun tek kulüp kimliği, iflas ve alt kademe sınırı açıkken doğrudan yeniden kuruluş kampanyası eklenmez.

**Bağlantı ve ihtiyaç:** P06, P14 ve uzun kariyer. Araştırma değeri yüksek; doğrudan uygulanabilirliği sınırlı.

#### S38 — Liverpool — kurtarma kararının yönetim yetkisiyle çatışması (2010)

**Tarihsel çekirdek:** Liverpool'un 2010 satışı açıklandığında satın alma borcunun kaldırıldığı ve finansman yükünün düştüğü duyuruldu. [Kaynak: Yayımlanmış ortak açıklama](https://www.theguardian.com/sport/2010/oct/15/liverpool-statement-nesv-new-england).

**Oyun fikri:** Kulübün sürekliliğini savunan ekip ile yetkiyi elinde tutmak isteyen tarafların ayrışması.

**Olası gelişme:** Finansman baskısı → alternatif destekçi → kurulda yetki tartışması → kamuoyu ve belgeler → anlaşma ve görev devri.

**Yollar ve karşılık:** Karşılıklı anlaşma ile geçiş veya uzun uyuşmazlık mümkün. Aynı İngiliz şirket/hukuk modeli aktarılmaz; görevden ayrılan başkanın dışarıdan takibine bağlanabilir.

**Bağlantı ve ihtiyaç:** P01, P03, P14; sahiplik modeli ve görev geçişi gerekir. İleri aşama.

#### S39 — Athletic–Bielsa — tesis meselesinin güven meselesine dönüşmesi (2012)

**Tarihsel çekirdek:** Bielsa ile Athletic yönetimi, Lezama'daki tesis işleri üzerinden anlaşmazlık yaşadı; birlikte çalışmayı sürdürdüler. [Kaynak: Guardian dönem değerlendirmesi](https://www.theguardian.com/football/blog/2012/aug/28/athletic-bilbao-impotent-marcelo-bielsa).

**Oyun fikri:** Tesis teslimi ve iş kalitesi konusundaki anlaşmazlığın hoca, yönetici ve yüklenici arasındaki güveni etkilemesi.

**Olası gelişme:** Olağan tesis şikâyeti → teknik rapor → teslim tarihi görüşmesi → kamuya konuşulursa açıklama → düzeltme ve çalışma ilişkisinin devamı.

**Yollar ve karşılık:** Erken inceleme ve etaplama sorunu çözebilir; görüş ayrılığı devam ederken birlikte çalışmak da mümkün. Her gerilim ayrılıkla bitmez.

**Bağlantı ve ihtiyaç:** P04, P12, P14; tesis ve gündemli görüşme. Çok güçlü gündelikten büyüme adayı.

#### S40 — Arsenal–David Dein — bağlantıları taşıyan yöneticinin ayrılığı (2007)

**Tarihsel çekirdek:** Dein, 2007'de Arsenal'dan ayrıldı; kulüp başkanı, kurul ile uzlaştırılamayan görüş ayrılıklarını gerekçe gösterdi. [Kaynak: Guardian dönem haberi](https://www.theguardian.com/football/2007/apr/19/newsstory.sport5).

**Oyun fikri:** Kulübün bazı ilişkilerinin kurumsallaşmadan tek bir yönetici üzerinden yürümesi.

**Olası gelişme:** Yöneticinin rol tartışması → ayrılık ihtimali → devam eden görüşmelerin kime devredileceği → kişisel ve kurumsal bağlantıların ayrışması → yeni sorumluya alışma.

**Yollar ve karşılık:** İyi devir teslim ilişkileri koruyabilir. Ayrılan kişi kişisel dost olarak kalabilir; her bağlantı kaybolmaz veya yeni yönetime düşman olmaz.

**Bağlantı ve ihtiyaç:** P12/personel, P14; rehber, görev sahipliği ve hafıza. Esinin ayrıntıları kurgusal genişletmedir.

#### S41 — Bayern–Allianz — kaynak girişini kalıcı yükü azaltmak için kullanmak (2014)

**Tarihsel çekirdek:** Allianz, 2014'te Bayern şirketinin yüzde 8,33'ünü 110 milyon avroya aldı. Tarafın tarihçesine göre gelir stat borcunun kalanını ödemek ve gençlik tesisine yatırım için kullanıldı. [Kaynak: Allianz'ın ortaklık tarihçesi; birincil taraf kaynağı](https://www.allianz.com/en/mediacenter/news/commitment/sponsorship/230321_Allianz-What-you-need-to-know-about-partnership-with-FC-Bayern.result.html/7.html).

**Oyun fikri:** Büyük kaynağın yıllar süren ödeme yükünü azaltıp daha serbest bir gelecek oluşturması.

**Olası gelişme:** Destek görüşmeleri → verilecek hakların değerlendirilmesi → borç azaltımı ve yatırım önceliği → yıllık mali raporlarda rahatlamanın görülmesi → açılış ve teşekkür.

**Yollar ve karşılık:** Daha küçük ticari anlaşmayla yavaş ilerlemek de mümkün. Olumlu kurumsal hikâye zorunlu gizli ihanet taşımaz; hisse modeli ayrıca kararlaştırılır.

**Bağlantı ve ihtiyaç:** P03, P04, P08, P13; finansman/hak sözleşmesi. İleri aşama için olumlu örnek.

### 14.2 Diğer sporlar

#### S42 — Brawn GP — desteğini kaybeden hazır ekibin geçiş yılı (2008–2009)

**Tarihsel çekirdek:** Honda'nın çekilmesinden sonra Brawn ve Fry ekibi devraldı; Mercedes motor anlaşmasıyla 2009'da yarışabildiler. Başarı, önceki dönemde geliştirilmiş altyapının da devamına dayanıyordu. [Kaynak: Formula 1'in ekip üyeleriyle retrospektifi](https://www.formula1.com/en/latest/article/brawn-gp-engineers-thought-wed-got-our-sums-wrongs-ahead-of-fairytale-start.F0Dk8F2qr7T7LGzeJC3sd).

**Oyun fikri:** Ana destekçi ayrılırken mevcut insan ve yatırımı koruyup bir geçiş düzeni kurmak.

**Olası gelişme:** Çekilme haberi → eldeki kaynakların gerçek envanteri → ekibe açık konuşma → süreli yeni ortaklık → sezon boyunca ölçülü destek arayışı.

**Yollar ve karşılık:** Küçülerek devam, hazırlıklı yeni ortaklık veya bazı personelin ayrılışı mümkün. Sıfır kaynaktan garantili şampiyonluk masalı kurulmaz.

**Bağlantı ve ihtiyaç:** P01, P03, P12, P14; kulüp kimliği korunarak uyarlanır. Yeniden başlama hissi güçlü.

#### S43 — McLaren–Honda — itibarlı ortaklıktan planlı ayrılık (2015–2018)

**Tarihsel çekirdek:** McLaren, 2017'de Renault'yla 2018–2020 için motor tedarik ortaklığı duyurdu. Ayrı açıklamasında Honda ortaklığını 2017 sonunda karşılıklı anlaşmayla bitireceğini belirtti. [Kaynak: McLaren'ın Renault anlaşması; birincil](https://www.mclaren.com/racing/latest-news/mclarenracing/article/mclaren-racing-and-renault-sport-racing-confirm-partnership/). [Diğer dönem açıklaması](https://www.mclaren.com/racing/latest-news/mclarenracing/article/mclaren-and-honda-agree-to-conclude-formula-1-partnership/).

**Oyun fikri:** Prestijli bir tedarikçi veya teknik ortakla beklentiler karşılanmazken ilişkinin ve alternatif arayışının yönetilmesi.

**Olası gelişme:** Tekrarlayan küçük sorunlar → tarafların farklı teşhisleri → bağımsız rapor → sözleşme yenileme öncesi görüşmeler → devam veya geçiş.

**Yollar ve karşılık:** Ortak iyileştirme planı çalışabilir; alternatif de risksiz değildir. Yeni sözleşmenin uygulanması ve çalışanların uyumu ayrıca zaman alır.

**Bağlantı ve ihtiyaç:** P03, P04, kurumsal şablon; hizmet seviyesi ve tedarikçi ilişkisi. Futbolda saha/ulaşım/ekipman ölçeği.

#### S44 — Rosberg — başarıdan hemen sonra kişisel ayrılık kararı (2016)

**Tarihsel çekirdek:** Rosberg, dünya şampiyonluğundan birkaç gün sonra emekliliğini duyurdu; kişisel hedefini tamamladığını ve bunun kendisi için doğru zaman olduğunu söyledi. [Kaynak: Formula 1'in emeklilik duyurusu](https://www.formula1.com/en/latest/article/rosberg-announces-his-retirement-from-f1-racing.5ZWcPPPCsc3kpreN6tKdqs.5ZWcPPPCsc3kpreN6tKdqs).

**Oyun fikri:** Kulüpte her şey iyi giderken önemli bir kişinin kendi hayatı için ayrılmak istemesi.

**Olası gelişme:** Kutlama → kişisel görüşmede niyet → aile/gelecek beklentisini dinleme → görev devri ve halef → saygılı veda veya gelecekte farklı rol.

**Yollar ve karşılık:** Başkan hazırlıkla boşluğu karşılayabilir. Kalması için görüşmek mümkün olsa da kişinin kendi isteği önemlidir; her ayrılık yönetim hatası değildir.

**Bağlantı ve ihtiyaç:** P09, P12/personel, P13; yaş ve kişi yaşam döngüsü. Başarı ile burukluğu bir araya getirir.

#### S45 — Chicago Bulls — şampiyon çekirdeğin son dönemi (1997–1998)

**Tarihsel çekirdek:** Phil Jackson, 1998'de Bulls'tan ayrıldı; başarılı dönemin sonunda yönetimle ilişkisi gerilmişti. [Kaynak: Bulls'un Phil Jackson söyleşisi; birincil anlatı](https://www.nba.com/bulls/history/phil-jackson-jerry-krause-master-many-talents).

**Oyun fikri:** Birlikte başarı kazanmış kişilerin sözleşme, gelecek ve yetki beklentilerinin aynı dönemde değişmesi.

**Olası gelişme:** Sonraki sezon görüşmeleri → çekirdekteki kişilerin ayrı talepleri → belirsizliğin olağan toplantılara girmesi → birlikte son dönem veya kademeli yenilenme.

**Yollar ve karşılık:** Veda başarılı bir sezonla birlikte yaşanabilir. Gençleştirme kadar mevcut ekibi bir süre daha korumak da makul olabilir; tek kötü kişi bütün sonucu açıklamaz.

**Bağlantı ve ihtiyaç:** P07, P12, P13; sözleşme takvimi ve birden fazla kişinin geleceği. Anlatıdaki taraf bakışı korunur.

#### S46 — Oakland Athletics — alışılmış değerlendirmeyi sorgulamak (2002)

**Tarihsel çekirdek:** Oakland'ın 2002 sezonundaki 20 maçlık galibiyet serisi, sonradan Moneyball kitabı ve filminde anlatılan dönemin parçasıdır. [Kaynak: MLB'nin kulüp zaman çizelgesi](https://www.mlb.com/athletics/history/timeline-2000s).

**Oyun fikri:** Pahalı ve tanınmış adaylar yerine raporlar ve gözlenebilir performans üzerinden farklı adaylara güvenme.

**Olası gelişme:** Bütçe sınırı → hoca ve gözlemciden çelişen adaylar → farklı kaynaklardan takip → seçilen kişilere zaman tanıma → raporların isabetini yaşananlardan öğrenme.

**Yollar ve karşılık:** Alışılmadık yöntem her transferi başarılı yapmaz. Filmdeki sahneler tarihsel kanıt sayılmaz; futbolda gizli yetenek puanları açılmaz ve saha kararını hoca verir.

**Bağlantı ve ihtiyaç:** P07, P08, P12; kaynak güvenilirliği ve ekip değerlendirmesi. Doğrudan beyzbol formülü aktarılmaz.

### 14.3 İşletmeler ve kurumlar

#### S47 — LEGO — dağınık büyümeden odağa ve mali düzene dönüş (2003–2005)

**Tarihsel çekirdek:** LEGO, 2004 raporunda tarihinin o güne kadarki en ciddi mali krizine karşı köklü adımlar gerektiğini açıkladı. Rapor yeni yönü, iş modelini ve kaynak kullanımını ele alıyor. [Kaynak: LEGO 2004 yıllık raporu; birincil](https://www.lego.com/cdn/cs/aboutus/assets/blt07abb4b8a3da3f39/Annual_Report_2004_ENG.pdf).

**Oyun fikri:** Kulübün aynı anda çok sayıda yatırım ve ticari girişime dağılması; odağı yeniden belirleme.

**Olası gelişme:** Birçok küçük projenin giderleri → birimler arası farklı hesaplar → gerçek kaynak incelemesi → öncelik seçimi → yarım işleri azaltıp çekirdek işi güçlendirme → aylarda görülen karşılık.

**Yollar ve karşılık:** Bazı projeleri durdurmak ilişki bedeli taşıyabilir; etaplamak da mümkündür. Sadeleşme güven ve çalışma rahatlığı kazandırabilir; kadroyu otomatik güçlendirmez.

**Bağlantı ve ihtiyaç:** P01, P04, P08, P11, P14; kurumsal bütçe ve ekip kapasitesi. Güçlü uzun süreç adayı.

#### S48 — LEGO Ideas — taraftarın fikrini ortak üretime çevirmek (2008–2014 ve sonrası)

**Tarihsel çekirdek:** LEGO, 2008'de CUUSOO'yla Japonya'da başlattığı fikir toplama deneyini büyüttü; 2014'te LEGO Ideas markasıyla sürdürdü. Topluluk önerileri inceleme sürecinden geçerek ürün olabiliyordu. [Kaynak: LEGO'nun Ideas tarihçesi; birincil](https://www.lego.com/en-in/history/articles/j-lego-ideas).

**Oyun fikri:** Taraftarın önerdiği küçük bir ürün veya kulüp projesinin uzman incelemesi ve gerçek bütçeyle gelişmesi.

**Olası gelişme:** Bir taraftar fikri → uygulanabilirlik görüşmesi → küçük deneme → üretim/satış veya kullanım → katkı sahibine görünür teşekkür.

**Yollar ve karşılık:** Fikir tutabilir, küçültülebilir veya saygıyla reddedilebilir. En çok destek alan fikir otomatik en doğru karar olmaz; başkanlık sürekli oylama menüsüne dönüşmez.

**Bağlantı ve ihtiyaç:** P05, P06, P13; kulüp ürünü/topluluk girişimi. Olumlu ve gündelik akışa uygun.

#### S49 — Nintendo Wii — mevcut yarışın dışında yeni kitle bulmak (2006–2009)

**Tarihsel çekirdek:** Iwata, Wii'nin çıkışında oyunlara az veya hiç deneyimi olmayan insanların katılımını ve oyun oynayan kitleyi genişletme hedefini anlattı. Strateji yalnız mevcut kullanıcı beklentilerine odaklanmıyordu. [Kaynak: Iwata'nın dönem konuşması; birincil](https://www.nintendo.co.jp/event/061207/en/index.html).

**Oyun fikri:** Kulübün sürekli aynı dar taraftar kitlesine satış yapmak yerine yeni insanlara ulaşması.

**Olası gelişme:** Seyirci profilini dinleme → ailelerin/ilk kez gelenlerin engellerini öğrenme → küçük erişim veya etkinlik denemesi → hizmeti düzenleme → sezon içinde katılımı gözleme.

**Yollar ve karşılık:** Yeni kitle kazanılırken eski taraftarın alışkanlıkları da korunabilir. Büyük kampanya otomatik dolu stat yaratmaz; küçük düzenli gelişme de iyi sonuçtur.

**Bağlantı ve ihtiyaç:** P05, P06, P11, P13; bilet/etkinlik ve topluluk ilişkisi. Sahadaki futbol tarzı başkana verilmez.

#### S50 — Nintendo 3DS — yeni müşteriye indirim, eski destekçiye karşılık (2011)

**Tarihsel çekirdek:** Nintendo, 3DS'nin çıkışından altı ay dolmadan önemli fiyat indirimi yaptı. İlk alanların güveninin etkilenebileceğini belirterek onlara 20 indirilebilir oyun sundu. [Kaynak: Nintendo'nun Ambassador duyurusu; birincil](https://www.nintendo.com/en-gb/News/2011/Nintendo-3DS-Ambassador-programme-253337.html).

**Oyun fikri:** Yeni taraftar çekmek için yapılan indirimden, kulübü daha önce destekleyenlerin kendini dışlanmış hissetmesi.

**Olası gelişme:** Kombine/üyelik kampanyası → eski alıcılardan mesajlar → maliyet ve adalet görüşmesi → mevcut hakları koruyan telafi → sonraki yenileme döneminde ilişkinin karşılığı.

**Yollar ve karşılık:** Erken planlama huzursuzluğu önleyebilir. Telafi para iadesi, ek hak veya küçük teşekkür biçiminde tasarlanabilir; pahalı telafi her durumda üstün seçenek olmaz.

**Bağlantı ve ihtiyaç:** P05, P06, P13, sözleşme; bilet/üyelik hakları. Küçük ticari karardan uzun ilişkiye güçlü aday.

#### S51 — IBM–Gerstner — bölünen kurumu birlikte çalışır hâle getirmek (1993 ve sonrası)

**Tarihsel çekirdek:** IBM, Gerstner'in göreve geldiği 1993 dönemini şirketin bütün kalmasının tartışıldığı bir kriz olarak anıyor; müşteriye odaklanma ve birimler arasındaki ayrımı azaltma yaklaşımını vurguluyor. [Kaynak: IBM'nin Gerstner anması; birincil kurum anlatısı](https://newsroom.ibm.com/2025-12-28-Remembering-Lou-Gerstner).

**Oyun fikri:** Kulüpte kendi hedefini izleyen birimlerin aynı plan ve gerçek ihtiyaç etrafında çalışması.

**Olası gelişme:** Birbiriyle çelişen raporlar → başkanın çalışanları dinlemesi → yetki ve öncelikleri birlikte belirleme → ortak işlerin küçük sonuçları → yeni çalışma düzeni.

**Yollar ve karşılık:** Bütün ekibi değiştirmek tek yol değildir. Var olan uzmanların daha açık işbirliğiyle iyi sonuç alması mümkündür; eski alışkanlıkların değişmesi zaman alır.

**Bağlantı ve ihtiyaç:** P11, P12/personel, P14; gündemli görüşme ve yetki devri. Kurumun kendi başarı anlatısı olarak okunur.

#### S52 — Disney–Pixar — güçlü ekibi getirirken çalışma kültürünü korumak (2006)

**Tarihsel çekirdek:** Disney, Pixar alımında özgün kültürünü benimsediğini belirtti; Pixar liderlerine geniş roller verildi ve iki stüdyonun mevcut yerleriyle faaliyetlerinin korunacağı açıklandı. [Kaynak: Disney'in satın alma açıklaması; birincil](https://thewaltdisneycompany.com/press-releases/disney-to-acquire-pixar/).

**Oyun fikri:** Başarılı hocayı kendi yardımcıları ve çalışma alışkanlıklarıyla getirirken kulübün mevcut çalışanlarıyla uyum kurmak.

**Olası gelişme:** İlk görüşmede ekip koşulları → mevcut personelin geleceği → görevlerin açıklanması → ilk ortak işler → ortaya çıkan uyuşmazlıkları özel görüşmelerde ele alma.

**Yollar ve karşılık:** Yeni ve eski ekip birlikte gelişebilir. Tam serbestlik veya katı standartlaşma otomatik doğru cevap olmaz; anlaşılmış sınırlar sonraki görüşmelerin dayanağıdır.

**Bağlantı ve ihtiyaç:** P12, P14; personel sözleşmeleri ve rol hafızası. Şirket satın alma sistemi gerekmeden uyarlanabilir.

#### S53 — Steve Jobs — görevden uzaklaşma, öğrenme ve geri dönüş (1985–1997)

**Tarihsel çekirdek:** Jobs, 2005 konuşmasında Apple'dan uzaklaşmasını, sonrasında NeXT ve Pixar'da çalışmasını ve Apple'ın NeXT'i almasıyla geri dönmesini anlattı. Ayrılığın dili kendi bakışını yansıtıyor. [Kaynak: Jobs'un Stanford konuşması; birincil kişisel anlatı](https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says).

**Oyun fikri:** Eski başkanın görev dışında yaşadıkları ve kurduğu yeni ilişkilerle daha farklı bir aday olarak geri gelebilmesi.

**Olası gelişme:** Görev kaybı → kulübü dışarıdan takip → eski hatalar hakkında konuşmalar → yeni ekip ve yaklaşım hazırlığı → şartlar uygunsa yeniden adaylık.

**Yollar ve karşılık:** Yeni yönetim başarılı olabilir; dönüş zorunlu değildir. Oyuncuya dışarıda şirket kurdurmak gerekmez; kulüp çevresindeki erişilebilir faaliyetler yeterlidir.

**Bağlantı ve ihtiyaç:** P14 ve uzun kariyer; seçim, yetki kaybı, rehber ve hafıza. İleri aşama için güçlü çerçeve.

#### S54 — New Coke — araştırmanın göremediği aidiyet ve geri adım (1985)

**Tarihsel çekirdek:** Coca-Cola 1985'te ana ürün formülünü değiştirdi; yoğun tepki sonrasında eski formül 79 gün içinde geri geldi. Kurumun anlatımı tüketicinin duygusal bağını vurguluyor. [Kaynak: Coca-Cola'nın olay tarihçesi; birincil kurum anlatısı](https://www.coca-colacompany.com/about-us/history/new-coke-the-most-memorable-marketing-blunder-ever).

**Oyun fikri:** Ticari açıdan mantıklı görünen yeniliğin kulübün alışkanlık ve kimlik bağlarını zedelemesi.

**Olası gelişme:** Araştırma ve öneri → taraftarın farklı kesimlerinden görüş → değişiklik → beklenenden farklı tepkiler → düzeltme veya sınırlı uygulama.

**Yollar ve karşılık:** Küçük pilot ya da gelenekle birlikte yeni seçenek sunmak sorunu önleyebilir. Geri adım güveni onarabilir; önceki maliyetleri silmez.

**Bağlantı ve ihtiyaç:** P05, P13, P14; ürün, tören veya taraftar deneyimi. Her yenilik tepki doğurmaz.

#### S55 — Netflix–Qwikster — aynı anda çok şey değiştirmek (2011)

**Tarihsel çekirdek:** Netflix, DVD hizmetini Qwikster adlı ayrı hizmete taşıma planını duyurduktan kısa süre sonra geri çekti. Kullanıcıların iki ayrı siteyle uğraşması eleştiriliyordu. [Kaynak: SEC'de yayımlanmış Netflix dönem belgesi; birincil](https://www.sec.gov/Archives/edgar/data/1065280/000119312511318595/d259710ds3asr.htm).

**Oyun fikri:** Tek tek makul görünen ticari değişikliklerin üst üste gelerek taraftarda yorgunluk ve güvensizlik oluşturması.

**Olası gelişme:** Yeni paket → isim/işlem düzeni değişikliği → çalışanların anlatmakta zorlanması → şikâyetler → sadeleştirme ve açıklama.

**Yollar ve karşılık:** Etaplamak veya eski kullanım yolunu korumak işe yarayabilir. Geri alma tüm önceki fiyat kararlarını kendiliğinden iptal etmez; oyun kayıtlarında neyin değiştiği açık kalır.

**Bağlantı ve ihtiyaç:** P05, P11, P14; taraftara dönük kulüp hizmetleri. Tarafsız Canlı Skor uygulaması bu kulüp ürününe çevrilmez.

#### S56 — Domino's — eleştiriyi kabul edip hizmeti gerçekten değiştirmek (2009–2010)

**Tarihsel çekirdek:** Domino's, 2009 sonunda temel pizza tarifini değiştirdiğini duyurdu. Yeni ürünü 2010'da geniş biçimde tanıttı; sonraki şirket raporları ürün ve iletişim çalışmalarını birlikte değerlendiriyor. [Kaynak: Domino's dönem duyurusu ve yatırımcı anlatısı; birincil](https://ir.dominos.com/news-releases/news-release-details/celebrating-50th-year-dominos-pizza-gives-itself-makeover).

**Oyun fikri:** Taraftarın eleştirdiği hizmeti savunmak yerine sorunu sahiplenip ölçülebilir düzeltme yapmak.

**Olası gelişme:** Tekrarlayan stada giriş/ürün şikâyeti → kullanıcı ve personeli dinleme → sorumlu ve bütçe belirleme → küçük uygulama → insanların gerçekten değişiklik görmesi.

**Yollar ve karşılık:** İyi açıklama ancak yapılan işle desteklenince güven kazanır. İş sorunsuz tamamlanıp teşekkürle kapanabilir; her düzeltme yeni kriz üretmez.

**Bağlantı ve ihtiyaç:** P04, P05, P13; hizmet ve kamuoyu. Sportif sonuçlar iletişim kampanyasıyla garanti edilmez.

#### S57 — Ford–Mulally — kötü haberi erken getiren çalışana yaklaşım (2006 ve sonrası)

**Tarihsel çekirdek:** Mulally, Ford'daki toplantılarda gerçek sorunu kırmızı raporla gösteren Mark Fields'ı alkışladığını ve ekibi çözüm için birlikte çalışmaya çağırdığını anlatıyor. [Kaynak: Mulally ile doğrudan söyleşi; birincil kişisel anlatı](https://antonionietorodriguez.com/alan-mulally-interview/).

**Oyun fikri:** Başkanın kötü haber getiren kişiye davranışının, gelecekte ne kadar erken ve açık bilgi alacağını etkilemesi.

**Olası gelişme:** Rahatsız edici ilk rapor → başkanın tepkisi → sonraki görüşmelerde insanların açıklığı → sorunun erken görülmesi veya geç haber alınması → ekibin ortak çözümü.

**Yollar ve karşılık:** İyi çalışanı desteklemek daha az acil müdahale sağlayabilir. Beceriksizlikle dürüst uyarı ayrı değerlendirilir; herkesi otomatik yalancı yapan puan sistemi kurulmaz.

**Bağlantı ve ihtiyaç:** P01, P12/personel, P14; bilgi güvenilirliği ve hafıza. Çok güçlü gündelik yönetim adayı.

#### S58 — Market Basket — çalışanların ayrılan yöneticiye sahip çıkması (2014)

**Tarihsel çekirdek:** Market Basket'ta Arthur T. Demoulas'ın uzaklaştırılması sonrası çalışan protestoları ve müşteri boykotu haftalar sürdü. Hisse alım anlaşmasıyla geri dönüş yolu açıldı; süreç aile ve yönetim anlaşmazlığı içeriyordu. [Kaynak: WBUR'nin dönem haberi ve söyleşileri](https://www.wbur.org/radioboston/2014/08/28/demoulas-market-basket).

**Oyun fikri:** Seçimde veya kurulda kaybeden başkanın çalışanlarla geçmiş ilişkisinin görev sonrasında da yaşaması.

**Olası gelişme:** Eski dönemdeki gerçek davranışlar → görev değişimi → farklı insanların taraf seçmesi → kamuoyu açıklamaları → yeni yönetimle görüşme veya sonraki adaylık hazırlığı.

**Yollar ve karşılık:** Destek kendiliğinden ve farklı yoğunluklarda gelebilir; her çalışan eski başkana bağlı kalmaz. Geri dönüş ve yeni yönetimin başarısızlığı zorunlu değildir.

**Bağlantı ve ihtiyaç:** P14 ve görev dışı kariyer; ilişki geçmişi, medya ve seçim. Oyundaki çoğunluk/hisse kuralları ayrıca tasarlanır.

#### S59 — WeWork — başkanın kendisinin ana gündeme dönüşmesi (2019)

**Tarihsel çekirdek:** WeWork, Eylül 2019'da Adam Neumann'ın CEO görevinden çekildiğini ve iki yeni eş CEO atandığını açıkladı. Neumann, kendi etrafındaki incelemenin dikkat dağıttığını belirtti. [Kaynak: WeWork yönetim kurulu açıklaması; birincil taraf kaynağı](https://www.wework.com/ideas/newsroom-landing-page/weworks-board-of-directors-announces-leadership-changes).

**Oyun fikri:** Kulübün işi yerine başkanın üslubunun veya yaşanmış kişisel kararlarının tartışılması.

**Olası gelişme:** Gerçek bir açıklama/çıkar ilişkisi → sorular → kurulun bilgi istemesi → başkanın sorumluluk ve yetkiyi ele alması → devam, görev paylaşımı veya ayrılık.

**Yollar ve karşılık:** Şeffaf açıklama ve gerçek düzeltme konuyu yatıştırabilir. Tek röportaj sözüyle otomatik istifa olmaz; kamuoyuna yayılan bilginin kaynağı belirli olmalıdır.

**Bağlantı ve ihtiyaç:** P03, P14; özel/kamu bilgisi, yönetim yetkisi. Somut suçlamalar kurguda ayrıca kanıtlandırılır.

#### S60 — Patagonia — kurumu kişinin sonrasına hazırlamak (2022)

**Tarihsel çekirdek:** Patagonia'nın kurucuları 2022'de mülkiyeti amaç ve çevresel hedefler için kurulan yapılara devretti. Kurucunun mektubu kararın gerekçesini ve kontrol/gelir ayrımını anlatıyor. [Kaynak: Kurucunun mülkiyet dönüşümü mektubu; birincil](https://www.patagonia.com/ownership/).

**Oyun fikri:** Başkanın kendi görev süresinden sonra kulübün hangi ilkeler ve yatırımlarla devam etmesini istediğini düşünmesi.

**Olası gelişme:** Uzun yönetim dönemi → devir ve miras görüşmeleri → kişiye bağlı işlerin kurumsallaştırılması → güvenilir ekiple hazırlık → ayrıldıktan sonra sonucu izleme.

**Yollar ve karşılık:** Başkanın bıraktığı düzen yeni yönetimce korunabilir veya yasal/yönetimsel sınırlar içinde değişebilir. Kurguda bağış ya da vakıf modeli kendiliğinden kesinleştirilmez.

**Bağlantı ve ihtiyaç:** P03, P14, uzun kariyer; mülkiyet ve final kuralları açık. Doğrudan mekanik olarak ileri aşama.

#### S61 — REI — kısa gelirden vazgeçip insanlara zaman ayırmak (2015)

**Tarihsel çekirdek:** REI, 2015 Black Friday gününde mağazalarını kapatıp çalışanlarına ücretli izin verdi; insanları aileleri ve arkadaşlarıyla dışarıda zaman geçirmeye çağırdı. [Kaynak: REI'nin dönem mektubu; birincil](https://www.rei.com/blog/social/a-letter-to-our-affiliates).

**Oyun fikri:** Kulüpte sürekli gelir veya görünürlük peşinde koşmadan çalışanlarla ve toplulukla anlamlı bir gün yaşamak.

**Olası gelişme:** Yoğun dönemin sonu → uygun takvim ve gerçek maliyet → personelin ihtiyacını dinleme → sade etkinlik/izin düzeni → daha sonra hatırlanan teşekkür.

**Yollar ve karşılık:** Daha küçük, düşük maliyetli bir buluşma da değerli olabilir. Maç, zorunlu hizmet veya hocanın antrenman kararı başkan tarafından iptal ettirilmez; destek personeli ve kulüp etkinliği ölçeğinde uyarlanır.

**Bağlantı ve ihtiyaç:** P13, P06; personel takvimi. Sakin ve olumlu içerik için güçlü kaynak.

#### S62 — Mondragon–Fagor — bir faaliyeti koruyamamak, insanları korumaya çalışmak (2013–2014)

**Tarihsel çekirdek:** Fagor'un tarihçesi, Fagor Electrodomésticos'un 2013'te kapanmasını ve çalışanların başka işlere yerleştirilme sürecinin başlamasını kaydediyor. [Kaynak: Fagor'un kapanış ve çalışan geçişi tarihçesi; birincil](https://www.fagor.eus/en/history/).

**Oyun fikri:** Başarısız bir kulüp faaliyetini sürdürmek ile çalışanlara karşı sorumluluğu farklı kararlar olarak ele almak.

**Olası gelişme:** Gider ve talep sorunu → faaliyet raporu → küçültme/kapatma görüşmesi → uygun çalışanları gerçek başka görevlere hazırlama → devir ve takip.

**Yollar ve karşılık:** Her iş kurtarılamayabilir; saygılı ve uygulanabilir geçiş de başkanın mirasına girer. Çalışanların becerisine uymayan görevler sihirli çözüm olmaz.

**Bağlantı ve ihtiyaç:** P01, P11, P14; personel görevleri ve kurumsal faaliyetler. Ağır fakat insani bir ileri aşama adayı.

#### S63 — NUMMI — aynı insanlarla farklı çalışma ilişkisi (1984 ve sonrası)

**Tarihsel çekirdek:** Toyota'nın NUMMI anlatısı, üretim sisteminin yanında işçi–yönetim ilişkilerini, sendikayla anlaşmayı, eğitim ve görev düzenini önemli meseleler olarak ele alıyor. [Kaynak: Toyota'nın NUMMI tarihçesi; birincil taraf kaynağı](https://www.toyota-global.com/company/history_of_toyota/75years/text/leaping_forward_as_a_global_corporation/chapter1/section3/item2_a.html).

**Oyun fikri:** Sorunlu görünen çalışanları topluca değiştirmeden önce iş düzenini ve iletişimi incelemek.

**Olası gelişme:** Bir işin tekrar aksaması → çalışan ve amirin farklı anlatımları → gerçek sorumlulukların açıklanması → eğitim veya görev uyarlaması → birkaç ayda görülen değişim.

**Yollar ve karşılık:** Mevcut ekibin gelişmesi, kısmi değişim veya uygun ayrılık mümkün. Tek konuşmayla yetenek artışı olmaz; işbirliği ile kişinin kapasitesi ayrı tutulur.

**Bağlantı ve ihtiyaç:** P12/personel, P11, P14; yetki devri ve kişi hafızası. Ford örneğiyle güçlü birleşim.

#### S64 — KFC–DHL — yeni tedarik düzeninin açılışta aksaması (2018)

**Tarihsel çekirdek:** KFC'nin Britanya'da dağıtım anlaşmasını DHL'ye geçirmesinden sonra teslimat sorunları yaşandı; yüzlerce şube geçici kapandı. Taraflar operasyon sorunlarını kabul eden açıklamalar yaptı. [Kaynak: Reuters'ın dönem haberi](https://www.marketscreener.com/news/latest/KFC-closes-most-of-its-UK-stores-due-to-chicken-shortage-26017732/).

**Oyun fikri:** Yeni forma, ulaşım veya stat hizmeti anlaşmasının kâğıt üzerinde iyi görünürken gerçek kullanımda aksaması.

**Olası gelişme:** Yeni anlaşma → devir planı → ilk küçük gecikme → maç/etkinlik yaklaşırken eksik teslimat → geçici çözüm ve tedarikçiyle sonraki görüşmeler.

**Yollar ve karşılık:** Kademeli geçiş ve yedek kaynak sorunu azaltabilir. Kendi yetersiz planını tedarikçiye yüklemek ilişkileri etkiler; iyi toparlanma ekibin başarısı olarak yaşanabilir.

**Bağlantı ve ihtiyaç:** P03, P04, P01, P13; kurumsal anlaşma ve takvim. Çok güçlü kısa girişten uzun sürece aday.

#### S65 — Samsung Note7 — ilk düzeltmenin yeterli çıkmaması (2016)

**Tarihsel çekirdek:** Samsung ilk değişim sürecinin ardından Ekim 2016'da Note7'nin satış ve değişimini dünya çapında durdurmasını ortaklarından istedi. İnceleme ve müşteriye çözüm süreci devam ediyordu. [Kaynak: Samsung'un satış/değişim durdurma açıklaması; birincil](https://news.samsung.com/us/official-statement-global-stop-sale-and-exchange-of-galaxy-note7/).

**Oyun fikri:** Ekipman veya tesis sorununun ilk onarımdan sonra tekrarlaması ve önceki güvencelerin yeniden değerlendirilmesi.

**Olası gelişme:** Somut arıza → uzman incelemesi → güvenli geçici çözüm → ilk düzeltmenin kontrolü → gerekirse bağımsız inceleme ve sözleşmenin geleceği.

**Yollar ve karşılık:** Sorun kalıcı biçimde düzeltilebilir veya tedarikçi değiştirilebilir. Güvenli alternatiflerin maliyet/takvim tercihleri oynanır; oyuncudan sağlık riskini kumar gibi seçmesi istenmez.

**Bağlantı ve ihtiyaç:** P04, P03, P01; uzman raporu ve hizmet kabulü. Ürün tekniği yerine yönetim süreci uyarlanır.

#### S69 — Marvel — değerin kullanım biçimini değiştirmek (2005)

**Tarihsel çekirdek:** Marvel, kendi filmlerini üretmek için 2005'te 525 milyon dolarlık bir finansman düzeni açıkladı. Dönem belgeleri daha yüksek getiri ihtimaliyle birlikte üretim ve takvim kontrolünü vurguluyor. [Kaynak: SEC'de yayımlanmış şirket duyurusu; birincil](https://www.sec.gov/Archives/edgar/data/933730/000111667905002263/ex99-1.htm).

**Oyun fikri:** Kulübün değerli bir ticari hakkını dışarıya sabit bedelle vermesi ile işi kendi kapasitesiyle yürütmesi arasındaki tercih.

**Olası gelişme:** Mevcut gelir raporu → dış teklif ve kendi planı → uzman/sermaye ihtiyacı → küçük uygulama → gelir ve iş yükünün yıllık karşılığı.

**Yollar ve karşılık:** Ortak üretim veya daha küçük pilot da mümkün. Belirli bir haktan gelir ummak garanti para değildir; Marvel'ın finansman sözleşmesi doğrudan kopyalanmaz.

**Bağlantı ve ihtiyaç:** P03, P11, P01; ürün, etkinlik veya ticari hizmet. Büyük ek sistem gerektirirse havuzda tutulur.

#### S70 — Ben & Jerry's — anlaşmaya değerleri koruyan yetki koymak (2000 ve sonrası)

**Tarihsel çekirdek:** Ben & Jerry's, 2000 satın alma anlaşmasının sosyal misyon ve marka bütünlüğüne ilişkin bağımsız kurul gözetimi içerdiğini 2020 raporunda anlatıyor. Bu kayıt güncel sahiplik hakkında iddia değildir. [Kaynak: 2020 sosyal etki raporu; birincil geçmiş anlatımı](https://www.benjerry.com/about-us/sear-reports/2020-sear-report).

**Oyun fikri:** Büyük destek gelirken kulübün hangi konularda kendi kararını koruyacağını anlaşmaya açık yazmak.

**Olası gelişme:** Finansman teklifi → korunacak amaçlar ve yetki sınırı → kurulda değerlendirme → sözleşme → yıllar sonra yeni talebin o sınırla karşılaştırılması.

**Yollar ve karşılık:** Açık kapsam ilişkiyi koruyabilir; belirsiz söz ileride görüş ayrılığı doğurabilir. Her büyük ortak amacı bozmak istemez.

**Bağlantı ve ihtiyaç:** P03, P05, P14; sözleşme ve yetki hafızası. Mülkiyet modeli yerine sınırlı ticari anlaşmayla da uyarlanabilir.

#### S71 — New York Times — gelir modelini eski haklarla birlikte değiştirmek (2011)

**Tarihsel çekirdek:** New York Times, 2011'de belirli sayıda yazıyı ücretsiz bırakıp daha yoğun kullanım için abonelik isteyen modelini duyurdu. [Kaynak: Columbia Journalism Review dönem haberi](https://www.cjr.org/the_news_frontier/nyt_announces_paywall_details.php).

**Oyun fikri:** Kulüp üyelik veya bilet paketini yenilerken mevcut destekçilerin haklarını ve yeni katılımın önündeki engelleri birlikte düşünmek.

**Olası gelişme:** Gelir ihtiyacı → taraftar kullanımını dinleme → yeni paket denemesi → mevcut hakların anlatılması → yenilemeler ve geri bildirim.

**Yollar ve karşılık:** Kademeli geçiş, eski hakları koruma veya daha sınırlı paket mümkündür. Tarafsız Canlı Skor bir kulüp abonelik ürününe dönüştürülmez.

**Bağlantı ve ihtiyaç:** P05, P06, P11; üyelik/bilet modeli gerekir. Nintendo 3DS örneğiyle birleşebilir.

#### S73 — Adobe — yeni modele geçerken eski sözleşmeyi ayırmak (2013)

**Tarihsel çekirdek:** Adobe, Mayıs 2013'te yeni yaratıcı ürün yeniliklerini Creative Cloud abonelerine sunacağını açıkladı; CS6'nın kalıcı lisanslar için son büyük sürüm olacağını raporladı. [Kaynak: Adobe 2013 yıllık raporu; birincil](https://www.adobe.com/content/dam/cc/en/investor-relations/pdfs/ADBE-10K-FY13-FINAL.pdf).

**Oyun fikri:** Kulübün yeni ticari modelini kurarken eski sözleşmeden doğan hakları ve yeni taahhütleri açıkça ayırması.

**Olası gelişme:** Yeni paket teklifi → mevcut anlaşmaların incelenmesi → ortaklarla görüşme → geçiş takvimi → sonraki dönemde yenileme ve şikâyetlerin ele alınması.

**Yollar ve karşılık:** Yeni anlaşmalar aşamalı kurulabilir; eski haklar keyfî silinmez. Abonelik fikri sadece oyunun ticari kulüp faaliyetleri için adaydır; oyuncuya ek görev yükü getirmek amaçlanmaz.

**Bağlantı ve ihtiyaç:** P03, P05, P11; ticari haklar ve sözleşme sistemi. Doğrudan uygunluğu orta, araştırma havuzunda.

### 14.4 Kültür ve topluluk

#### S66 — Royal Shakespeare Company–BP — desteği alan kitlenin itirazı (2019)

**Tarihsel çekirdek:** RSC, gençlere ucuz bilet sağlayan BP ortaklığını 2019 sonunda bitireceğini açıkladı. Aylar süren görüşmelerde gençlerin itirazı etkiliydi; genç bilet programının öncelik olarak kalacağı belirtildi. [Kaynak: RSC'nin ortaklığı bitirme açıklaması; birincil](https://www.rsc.org.uk/news/archive/we-are-to-conclude-our-partnership-with-bp).

**Oyun fikri:** İyi bir sosyal programa kaynak sağlayan ortağın, o programdan yararlanan insanlarca sorgulanması.

**Olası gelişme:** Başarılı erişim programı → farklı taraftar görüşleri → yararlanıcılarla ve sponsorla görüşme → devam şartları veya yeni kaynak → programın sürdürülebilirliği.

**Yollar ve karşılık:** Güvencelerle sürdürmek, daha küçük kapsam veya başka partner mümkün. Kaynağı kesmek ile yardım edilen insanlara ne olacağını çözmek ayrı sorumluluklardır.

**Bağlantı ve ihtiyaç:** P03, P05, P06, P14; sponsor ve bilet/topluluk programı. Çok güçlü değer–kaynak gerilimi.

#### S67 — Minnesota Orchestra — sözleşme çözülünce güven hemen düzelmiyor (2012–2014)

**Tarihsel çekirdek:** Uzun iş durmasının ardından müzisyenler 2014'te döndü; daha önce ayrılan şef Osmo Vänskä için ayrıca görüşmeler yapıldı ve yeni anlaşma sağlandı. Kaynak çalışan tarafının bakışını taşır. [Kaynak: Müzisyen örgütünün dönem anlatısı; birincil taraf kaynağı](https://www.icsom.org/senzasordino/2014/05/minnesota-returns/).

**Oyun fikri:** Mali anlaşmanın imzalanmasından sonra çalışma ilişkilerini, liderliği ve gündelik düzeni yeniden kurmak.

**Olası gelişme:** Görüşmelerde gerilim → faaliyetlerin etkilenmesi → anlaşma → ayrı kişilerle güven görüşmeleri → ortak ilk işler ve zamanla normalleşme.

**Yollar ve karşılık:** Bazı kişiler döner, bazıları ayrılır. Küçük bir maaş gecikmesi otomatik toplu iş durmasına dönüşmez; bu ağır yol için gerçek birikim ve ilgili kurallar gerekir.

**Bağlantı ve ihtiyaç:** P01, P12, P14, P13; iş ilişkileri ve personel. Kriz sonrasındaki ayları yazmak için değerli.

#### S68 — San Diego Opera — kapanış kararından daha küçük bir geleceğe (2014)

**Tarihsel çekirdek:** San Diego Opera'nın kapanış kararı ertelendi, destek kampanyaları yürütüldü ve Mayıs 2014'te devam edeceği açıklandı. Topluluk desteği, yeni sezonun planlanmasını mümkün kıldı. [Kaynak: Times of San Diego dönem haberi; kurum açıklamasını aktarıyor](https://timesofsandiego.com/arts/2014/05/19/san-diego-opera-wont-close-after-all-major-donors-saved-the-day/).

**Oyun fikri:** Kurulun umudunu kestiği bir faaliyetin, çalışanlar ve küçük destekçilerle daha uygulanabilir ölçekte devamını araştırmak.

**Olası gelişme:** Faaliyet raporu → kapanış/küçülme tartışması → gerçek gelir hedefli kampanya → yeni bütçe → verilen desteklerin hesabı ve sonraki sezon.

**Yollar ve karşılık:** Daha küçük plan tutabilir, hedef küçültülebilir veya kaynak yetmeyebilir. Toplanan para bütün gelecek giderleri karşılamış sayılmaz; taraftar sonsuz kaynak değildir.

**Bağlantı ve ihtiyaç:** P01, P06, P11, P14; topluluk finansmanı ve raporlama. Olumlu kurtarma ile sorumluluğu bağlar.

#### S72 — Pixar–Toy Story — projeyi büyütmeden önce yönünü düzeltmek (1993–1995)

**Tarihsel çekirdek:** Toy Story'nin erken gösterimi projeyi neredeyse durdurdu; ekip kısa bir süre içinde temel sorunları ele aldı. Disney retrospektifinde ekip üyeleri bu dönüm noktasını anlatıyor. [Kaynak: Disney'in ekip üyeleriyle retrospektifi; birincil anlatılar](https://thewaltdisneycompany.com/news/toy-story-30th-anniversary/).

**Oyun fikri:** Yeni bir kulüp projesinin ilk denemesinde sorun görülünce daha çok para harcamadan yönünü yeniden değerlendirmek.

**Olası gelişme:** Küçük deneme → ekipten ve kullanıcılardan geri bildirim → sorun tanımı → yeniden çalışma veya daha küçük kapsam → ikinci değerlendirme ve uygulama.

**Yollar ve karşılık:** Revizyon iyi bir sonuç verebilir; zamanında durmak da kaynak korur. Futbol taktiğini başkanın tasarladığı bir akış kurulmaz; tesis/iletişim/topluluk projesi ölçeğinde kullanılır.

**Bağlantı ve ihtiyaç:** P04, P06, P11; proje ve ekip kapasitesi. Kriz önlemenin tatminini verebilir.

## 15. Araştırmadan çıkan öncelikler ve sınırlar

**Öneri; uygulama sırası değil.** Kaynak sayısını artırmakla birlikte, ayrıntılı senaryo yazımında aşağıdaki odakları önce ele almak değerli görünüyor. Bunlar yeni P paketleri olarak onaylanmış veya kodlanmış değildir. Çoğu mevcut aileleri derinleştirir; yeni aile gerekip gerekmediği §6 biçiminde yazılırken anlaşılır.

| Araştırma odağı | Esinler | Oyuncuya yaşatabileceği süreç | Önce gerekli temel |
|---|---|---|---|
| Kötü haberi erken getiren ekiple güven | S57 Ford, S63 NUMMI | İnsanları tanıma, doğru teşhis, rahatlama; personel değişmeden de düzenin iyileşmesi | Kişi hafızası, rapor/görüşme ve yetki devri |
| Eski destekçiyi unutmadan yeni taraftar kazanmak | S50 Nintendo 3DS, S71 NYT | Ticari fırsat, adalet tartışması, açıklama ve sonraki yenilemede güven | Bilet/üyelik hakları, kaynaklı kamuoyu |
| Görev dışındayken de yaşayan destek | S58 Market Basket, S53 Jobs | Kaybetme, dışarıdan izleme, farklı insanların tutumu, yeni yaklaşım ve hazırlık | Seçim, yetki kaybı ve görev dışı kariyer |
| Yardımı alanların sponsora itirazı | S66 RSC, S35 Schalke | Yararlı programı sürdürmek, farklı tarafları dinlemek, kaynak ve değerleri birlikte düşünmek | Sponsor sözleşmesi ve topluluk gündemi |
| Başarıdan sonra kişisel ayrılık | S44 Rosberg | Mutluluk, şaşkınlık, buruk veda, halef hazırlığı ve iyi ilişkinin devamı | Kişinin gelecek hedefi, sözleşme/yaşam döngüsü |
| İyi giderken çalışma yetkisi | S24 Brentford, S25 Keegan, S45 Bulls | Başarıyı sürdürme isteği, sözler, rol sınırı ve birlikte çalışma | Personel, yetki ve söz hafızası |
| Yeni ekibin kültürünü kulübe katmak | S52 Disney–Pixar, S34 Southampton | İki ekibin birbirini tanıması, küçük ortak başarılar, meşru anlaşmazlıklar | Personel rolleri ve olağan çok konulu görüşme |
| Tedarikçi değişiminin günlük karşılığı | S64 KFC, S65 Samsung, S39 Athletic | Gecikme, koordinasyon, uzmanı dinleme, geçici çözüm ve telafi | Kurumsal sözleşme, hizmet/tesis ve takvim |
| Aynı anda fazla iş açmak | S47 LEGO, S51 IBM | Öncelik seçme, yarım işlerle yüzleşme, daha düzenli çalışma ve zamanla gelen karşılık | Kapasite, birden fazla dosya ve bütçe |
| Başarılı kulübe dışarıdan gelen mali şok | S28 AZ, S29 Leeds | Erken hazırlık, stres, anlaşma veya küçülme; hazırlıklı kulüpte daha sakin geçiş | Nakit, tahsilat, söz ve mali anlaşmalar |
| Toplulukla daha uygulanabilir bir gelecek | S68 San Diego Opera, S62 Fagor | Gerçek sınırları açıklama, emek ve kaynak toplama, verilen desteğin hesabı | Kampanya, personel ve kurumsal bütçe |
| Küçük ortak üretim ve başarıyı paylaşmak | S48 LEGO Ideas, S61 REI, S72 Pixar | Merak, bekleyiş, küçük deneme, açılış, teşekkür ve aidiyet | Başkanın girişimi, küçük proje ve hatıra |

### 15.1 Doğrudan alınmayacak parçalar

- **Parma (S37):** iflas sonrası farklı tüzel yapıyla yeniden kuruluş, oyunun tek kulüp kimliği ve alt kademe sınırını kendiliğinden değiştirmez. Buradan dayanışma ve yeniden örgütlenme alınabilir; tam yeniden kuruluş şimdilik havuzdadır.
- **Marvel (S69), Patagonia (S60), CPO (S36), Liverpool (S38):** film finansmanı, vakıf/hisse yapısı veya yabancı mülkiyet hukuku yeni bir alt oyun olarak kurulmaz. Oyuncunun kulübündeki somut ticari hak, söz ve yönetim yetkisine uyarlanabilen bölüm seçilir.
- **Moneyball (S46):** filmin dramatik çatışmaları gerçek tarih sayılmaz. Gizli yetenekleri gösteren kusursuz analiz ekranı veya başkana saha dizilişi yetkisi getirilmez.
- **RSC (S66), Schalke (S35):** gerçek dünyadaki siyasi gelişme bütün ayrıntılarıyla kopyalanmaz. Kurgusal tarafların tutarlı amaçları, kamusal gerekçeleri ve meşru farklı görüşleri yazılır.
- **Samsung (S65):** teknik arıza teşhisini başkanın tahmin etmesi beklenmez. Uzman raporu ve güvenli çalışma sınırı içinde gerçek mali/takvim tercihleri yazılır.
- **NYT (S71), Adobe (S73):** aynı ticari model değişikliğinin benzer varyantları olabilirler; ayrı büyük paket sayısını doldurmak için iki kez sayılmazlar. Tarafsız Canlı Skor'un kulübe ait ticari uygulamaya dönüşmesi önerilmez.
- **Bütün örnekler:** başarı yalnız tek karizmatik kişiye bağlanmaz; bir tarafın anısı bütün gerçeğin yerine geçirilmez. Geçmişte yaşanmış bir sonucun oyundaki aynı kararı veren herkes için zorunlu sonuç olması gerekmez.

## 16. Yeni kaynaklardan koşula bağlı birleşim adayları

**Araştırma taslakları:** K07–K12, §4'teki K01–K06'yı genişleten olası bağlantılardır. Okların gerçekleşmesi ayrı şart ister. Birleşimler sırayla oynanacak kampanyalar, günlük görevler veya kodlanmış zincirler değildir.

### K07 — Haberi erken veren ekip, daha sakin geçen mali sarsıntı

S57/S63'ten: mali müdür veya çalışan ilk sorunu açıklar; başkanın somut tepkisi sonraki iletişimi etkiler. S28'den esinlenen dış tahsilat riski oluşursa geçmişte kurulan takip ve yedek kaynaklar önem kazanır. P01 yalnız gerçek açık varsa krize dönüşür. Açık yoksa konu normal sözleşme değerlendirmesi olarak geçebilir. İyi yönetilen geçiş, P13'te personelin emeğini tanıma veya yeni yatırım imkânına bağlanabilir.

Bu birleşimde başkanın aynı üslubu her insanda aynı sonucu doğurmaz; kişinin bilgisi ve amacı da önemlidir. Çalışanın dürüst uyarısı otomatik beceriksizlik sayılmaz. Krizden çıkmak için aynı parayı iki kez tahsil etme veya başka adla yeni zorunlu kriz üretme yolu yoktur.

### K08 — Daha çok insan gelsin derken ilk destekçiyi unutmamak

S49/S71'den esinlenen erişim veya bilet girişimi yeni insanlara ulaşabilir. İndirim eski haklarla karşılaşırsa S50'nin adalet/telafi meselesi anlam kazanır. S66'daki gibi bir destekçi programı finanse edebilir; programdan yararlananların farklı görüşleri, gerçekten ortaya çıkarsa görüşmeye katılır. S48'deki taraftar önerisi veya S61'deki sade kulüp günü, topluluğun sürece katkısı olarak doğabilir.

Başkan hakları baştan açıklamış ve maliyeti karşılayabiliyorsa normal büyüme, teşekkür ve sonraki yenileme yeterli kapanıştır. Sponsorla değer anlaşmazlığı ve eski destekçi huzursuzluğu her seferinde birlikte oluşmaz. Kaynağı reddetmek programın giderini ortadan kaldırmaz; verilen söz ve gerçek gelir birlikte takip edilir.

### K09 — Birlikte yükselen ekip, geleceği farklı zamanlarda istiyor

S24/S52'den: hoca ve yardımcılarıyla çalışma sınırları belirlenir, mevcut çalışanların rolleri konuşulur. Gerçek sportif iyi gidiş yeni teklifler ve farklı gelecek beklentileri doğurabilir. S44'teki gibi bir kişi kendi hedefini tamamladığı için ayrılmak isteyebilir; S34'teki gibi birkaç ayrılık aynı döneme denk gelirse halef hazırlığı önem kazanır. Başkanın verdiği sözler ve önceki devir teslimler yeni görüşmeleri etkiler.

Bütün ekibin kalması, kademeli değişim, iyi bir veda ve yeni insanlarla yavaş alışma geçerli yollardır. Önceki başarı zorunlu parçalanma getirmez. Yeni hocanın kadro kararları kendisindedir; başkan yeni ekibin kaynak ve çalışma şartlarını yönetir. İnsanların ayrılığı başarısızlık puanı olarak otomatik yazılmaz.

### K10 — Ucuz veya iyi görünen anlaşmanın gerçek teslim günü

S64'ten: yeni tedarikçiyle sözleşme, geçiş planı ve ilk teslimatlar vardır. Aksama olursa mevcut yedek kaynaklar ve kimin neyi bildiği görüşülür. S65'teki gibi ilk çözümün yeterliliği gerçek kontrolle anlaşılır; sorun çözülmüşse tekrar arıza zorlanmaz. Kamuya verilmiş hizmet sözü etkilenirse S56'daki somut düzeltme yaklaşımı veya S54'teki kapsamı geri alma gündeme gelebilir.

Doğru erken hazırlıkla sorunsuz teslim ve teşekkür mümkündür. Geçici kiralama, daha küçük açılış veya anlaşmayı yeniden görüşmek farklı kaynak/takvim bedelleri taşır. Güvenliği atlatmak seçim olarak sunulmaz. Başkanın sonradan yaptığı açıklama, belgelenmiş gerçek sorumluluklarla karşılaştırılır; sırf dramatik olsun diye yeni kusurlu taraf icat edilmez.

### K11 — Görev sona eriyor, aynı insanlar ve yarım işler kalıyor

P14 ve gerçek genel kurul/seçim süreci, görev değişimine götürebilir. S58/S53'ten alınan yaklaşımda eski başkanın çalışanlarla, üyelerle ve destekçilerle geçmişi devam eder. Yeni başkan bazı işleri doğru yönetebilir. Eski başkanın başlattığı tesis tamamlanabilir; çalışanı yeni yönetimde kalabilir; eskiden dinlemediği biri şimdi bir görüşme önerebilir.

Oyuncu ulaşabildiği haberleri ve maçları takip eder, gerçek tanışıklıklarla konuşur, kendi hataları hakkında açıklama yapar ve yeni ekip hazırlayabilir. Bu çalışmalar gelecek adaylığı etkiler; geri dönüş garanti edilmez. İç bütçe ve yönetim yetkisi kullanılamaz. Yeni başkanın mutlaka kulübü batırdığı veya eski ekibin topluca geri döndüğü sabit senaryo yazılmaz. Bu birleşim görev dışı sistem hazır olduğunda uygulanabilir.

### K12 — Çok büyüyen planı küçültmek ve bitmiş işin sevincini yaşamak

S47/S72'den esinlenen proje, ilk rapor veya küçük denemede kaynak ve kapsam sorunu gösterebilir. Başkan birimleri dinler, etapları belirler. S68'deki topluluk desteği ancak gerçek ihtiyaç ve uygulanabilir bütçe varsa anlam kazanır. S41'deki gibi gelen kaynak, bitmemiş bütün işleri açmak yerine mevcut yükü azaltabilir veya seçilen etabı tamamlayabilir.

Planı baştan karşılanabilir kurmak, daha küçük bir işi zamanında açmak, bir hedefi ertelemek veya projeden vazgeçmek mümkündür. Tamamlanan iş sahnede görünür ve S48/S61'in ortak emek/teşekkür anlarına bağlanabilir. Kutlama sonrasında yeni bir kriz şartı yoktur. Gelecek girişim, başkanın yeni hedefinden veya gerçekten değişen ihtiyaçtan doğar.

### 16.1 Büyük olaylar arasındaki olağan hayat

Aşağıdakiler **özgün küçük içerik önerileridir; tarihsel olgu veya bugün çalışan özellik olarak sunulmaz.** Ayrı büyük paket açmadan, gerçek kayıt ve kişiler üzerinden yazılabilir:

- Mali işler müdürünün düzenli ödemelerin tamamlandığını bildirmesi; yeni onay istemeden rahat bir ayın hissedilmesi.
- Daha önce sorun yaşanan tedarikçinin bu kez sözünü zamanında tutması; konunun eski sitem yerine kısa teşekkürle kapanması.
- Hoca görüşmesinde ana gündemden önce yeni çalışanın ilk haftası veya tamamlanan küçük işin anılması; ilerideki konuşmalarda bu insanın tanınması.
- Kulüpten ayrılmış bir çalışanın gönüllü olarak haber vermesi; eski ilişkinin sürekli iş veya kriz talebi üretmeden sürmesi.
- Sezon başında tanışılan taraftarın biten projeyi kullanırken karşılaşılması; oyuncunun geçmiş emeğin karşılığını görmesi.
- Eski oyuncunun başarı haberi veya saygılı vedası; başkanın küçük bir karşılık verip vermemesinin sonraki kişisel konuşmalara girmesi.
- Olağan röportajda iyi giden işin nasıl yapıldığının sorulması; ekipten söz etme veya kendi sorumluluğunu anlatma üslubunun hatırlanması.
- Uygun takvimde personelle sade buluşma; pahalı organizasyon veya zorunlu moral toplama görevi oluşturmadan aidiyet.

Olağan içerik, açık vade ve krizleri gizlemez; her yeni gün kesinti üretmek için doldurulmaz. Bu anların bir kısmı yalnız yaşanır ve geçmişe küçük iz bırakır.

### 16.2 Sonraki yazımın somut işi

**Pilot aileler (2026-10-29, kullanıcı onayı; karar 60):** ilk tam yazım P01 (ödeme takvimi), P12 (hocaya sabır) ve P07 (yetiştirilen oyuncuya teklif) ile başlar; üçü de bugünkü sistemlere en yakın ailelerdir ve R4–R6 geldiğinde hazır olur. Metinleri kullanıcı yazar; gündelik doku bu ailelerle değil gerçek veriden okuyan sistemlerle kurulur ([OYUN_TASARIMI §1 — İlkelerin uygulama yönü](OYUN_TASARIMI.md#i̇lkelerin-uygulama-yönü)).

Önce §15'ten seçilecek birkaç odak, §6'nın tam biçimine indirilir: kaynak ayrımı, kişilerin amaçları, doğal ilk temas, günler arasındaki gerçek işler, normal görüşmelere katılan cümleler, her kararın iki cevabı, farklı koşullardaki yollar ve kapanıştan sonra hatırlanacak izler. İlgili kod sistemi hazır değilse bağımlılık görünür tutulur. Bir erken önleme yolu, bir sorunsuz/olumlu yol ve uygun adayda zor ama sürdürülebilir toparlanma birlikte yazılır; bunlar her sahneyi sırayla oynatma kotası değildir.

Bu araştırma R programının sırasını değiştirmez, mevcut kod turuna yeni özellik eklemez ve 50 ayrı sistemi peşinen kurmayı gerektirmez. Yeni kaynak eklemekle yeni oyun ailesi açmak ayrı değerlendirilir; tarihsel çekirdeği benzer örnekler aynı aileyi zenginleştirebilir.
