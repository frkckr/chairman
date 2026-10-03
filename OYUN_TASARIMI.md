# Chairman — oyun tasarımı

Son güncelleme: 2026-10-02. Bu belge hedef oyunu tanımlar; burada anlatılan sistemlerin çoğu henüz uygulanmamıştır. Çalışan özellikler ve geliştirme sırası [yol haritasındadır](YOL_HARITASI.md). Uygulama yaklaşımı [teknik plandadır](TEKNIK_PLAN.md). **2026-10-02 iki seçenekli karar ve sade ekran yenilemesi 2.8G–2.8K ile uygulandı (TEST içerik; ilgili bölümlerdeki “Bugünkü uygulama” notları).**

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
- Maç deneyimi için yaklaşık 10–15 dakika hedeflenir. Törenler ve toplam maç günü süresi ayrıca ölçülür; bunlar birbirine karıştırılmaz.
- Başarı finali, **Avrupa'nın en büyük kulüp kupasını kazanmak ve ardından başkanlığı bırakmaktır**. Daha küçük bir kupa bu finali tetiklemez.
- Kupasız kariyer sonları mümkündür. Sabit sezon sayısı sınırı konmaz; yaş, görev ve kariyer koşulları doğal bir sınır oluşturabilir. Kesin sonlandırma şartları açıktır.

## 2. Başkanın rolü ve ana döngü

Başkan teknik direktörü ve yönetimini seçer, bütçe ve öncelikleri belirler, önemli anlaşmaları yapar, kulübü temsil eder ve sonuçların sorumluluğunu taşır. Teknik direktör kadro, taktik, antrenman ve maç içi futbol kararlarından sorumludur.

Başkan hocayla oyuncu tercihleri hakkında görüşebilir. Müdahale, hocanın otoritesi ve ilişki üzerinde sonuç doğurur; günlük oyun bir teknik direktör kadro ekranına dönüşmez. Rutin araştırma ve pazarlıklar, bütçe ve yetki sınırlarıyla ekibe bırakılabilir.

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
| Telefon / Mesajlar | Kişi listesinden tek konuşmayı açmak, varsa iki cevaptan biriyle karar vermek; ek bilgi için bağlı dosyayı okumak |
| Telefon / Canlı Skor | Maç gününde karşılaşmaları ve kendi maçının gerçek istatistiklerini incelemek |
| Ayarlar | Okunabilirlik, kayıt ve geliştirici seçeneklerini düzenlemek; hareket azaltma seçeneği bulunmaz |

Dosyada kategori, kısa olay özeti, ilgili kişi, mevcut durum ve başkandan beklenen adım önce gelir. Bilinen maliyet, süre, taahhüt, son tarih ve önemli risk karar verilmeden görülebilir; bunlar ayrıntı çekmecesine saklanmaz. Uzun geçmiş ve ek belgeler gerektiğinde açılır. “Önceki dosya” ve “Sıradaki dosya” ile gezilir; toplam açık, cevap bekleyen ve takipteki konu sayıları kısa sayaçlarla anlaşılır. Kapanmış meseleler ayrı arşivden incelenebilir.

Karardan sonra kısa bir sonuç ve beklenen sonraki haber gösterilir. Oyuncu sıradaki dosyaya kendisi geçer; gelen haber okumakta olduğu konuyu değiştirmez veya sırayı kaydırmaz. Mesajdan dosyaya gidip geri dönünce aynı konuşma ve okuma konumu korunur. Gezmek, ayrıntı açmak ve test verisine bakmak süre tüketmez veya yeni sonuç çekmez.

Ajandada kasa, finans tablosu, bütün karar seçenekleri ve geçmişteki bütün sözler yığılmaz. Ödeme ya da mali teklifin gerçek son tarihi ajandada kısa hatırlatma olarak kalır; mali bilgi sayman görüşü veya ilgili dosyada erişilebilir olur. Ajandadaki randevu kendi konusuna bağlanır. Boş gün anlaşılır ve sakin gösterilir; boşluğu doldurmak için yeni görev üretilmez.

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

**Bugünkü uygulama (2.8H, 2026-10-02; TEST içerik):** Yeni kariyerin bütün kararları iki cevaplıdır; hangi ikilinin geleceği o anki koşuldan çıkar (ör. sayman yetişiyorsa “Kendin görüş / Sayman görüşsün”, yetişmiyorsa “Kendin görüş / Tribün onarımını ertelet”). Aday seçimi **sıralı görüşmedir** (kullanıcı kararı): adaylar tek tek dinlenir, [Göreve al] / [Sıradaki adayı dinle (+30 dk)]; son adayda [Göreve al] / [Koltuğu boş bırak]. Geri çevrilen aday kulüp üyesi olarak kalır. İlgili koltuktaki kişinin görüşü karar gelirken hazır bilgi olarak dosyaya düşer; “Görüş iste” düğmesi yoktur, saymanın konuşması gibi yeni çalışma yalnız anlamlı olduğu kararda iki cevaptan biridir. Hocayla görüşme karar değil, katılınan randevudur. Eski çok seçenekli konular yalnız eski kayıtlarda kendi biçimleriyle sürer.

**İçerik sıfırlama (kullanıcı kararı, 2026-10-02; 2.8L ile uygulandı):** Oyundaki bütün senaryolar, kişiler (başkan dışında), mesajlar, olaylar, başlangıç seçenekleri ve ajanda içeriği silindi. Ajanda, telefon, dosya, kasa, yönetim koltukları, söz/haber ve gözlem sistem olarak çalışır; içeriği kullanıcı tek tek yazar. Yukarıdaki iki cevap kuralı, koşula bağlı olay sözleşmesi ve kalıcı hafıza ilkeleri yeni içerik için de geçerlidir. Aşağıdaki “Bugünkü uygulama (2.8H)” ve “İçerik geçişi” tarihsel kayıttır. Eski kayıtlar açılmaz.

**İçerik geçişi:** Yeni düzene uymayan bütün mevcut oyuncu senaryoları, seçenek akışları ve sonuçsuz görevler envantere alınarak yeniden yazılır veya yeni kariyer yolundan kaldırılır. Üzerine yalnız iki düğmelik görünüm kaplamak yeterli değildir. Uyumlu konu ailesi/oyun kuralı korunabilir; eski çok seçenekli senaryo normal yeni oyunda paralel yaşamaz. Katalogdaki henüz uygulanmamış çok yollu taslaklar da hazır senaryo kabul edilmez. Kapsam [OLAY_KUTUPHANESI §7](OLAY_KUTUPHANESI.md#7-mevcut-içerikten-geçiş), kayıt koruması [TEKNIK_PLAN §6](TEKNIK_PLAN.md#eski-içerikten-geçiş-ve-kayıt-uyumu) içindedir.

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

### Kampanya

- Ekip ile vaatler ve öncelikler hazırlanır; bütçeyle ve birbirleriyle ilişkileri bulunur.
- Rakip adaylarla karşılaşmalar, yerel röportajlar, kulis ve hazırlıksız yakalanılan olaylar yaşanır.
- Seçim günü konuşmalar, bekleyiş, oy sayımı ve sonuç sahneleri vardır.
- İlk seçim makul hazırlıkla çoğunlukla kazanılabilir; kötü hazırlık ve nadir olumsuz gelişmelerle kaybedilebilir. İlk seçim için hedef başarı oranı henüz belirlenmemiştir.
- Sonuç; adayın inandırıcılığı, ekibi, ilişkileri, vaatleri ve rakiplerden oluşur. Belirsizlik bulunur, fakat tek bir açıklanamayan zar bütün hazırlığı değersizleştirmez.
- Sonraki seçimler gerçek görev geçmişini ve rakiplerin alternatiflerini değerlendirir. İyi yönetmek destek sağlar; otomatik yeniden seçilme garantisi vermez.

Oy kullanacak grubun yapısı, ilk üç koltuğun ötesindeki yönetim yapısı, dönem süresi ve erken seçim/görevden alınma koşulları uygulanmadan önce kararlaştırılacaktır.

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
| Maç izlemek | Maçın izleme temposu ve takvimde kapladığı süre ayrı hesaplanır |
| Maçta telefonu açmak | Maç durur; telefon kapatılınca diğer duraklatma nedenleri yoksa aynı andan sürer |
| Genel “Duraklat” | Takvim ilerlemesi, maç ve sahnedeki bütün hareket/süreler durur; bilgi incelenebilir |
| Sonraki önemli gelişmeye ilerlemek | Rutin işler işlenir; gerekli karar, randevu veya önemli gelişmede durulur |
| Oyundan çıkmak | Takvim durur; kayıtlı durumdan devam edilir |

Mevcut bilgiyi tekrar incelemek yeni araştırma sayılmaz. Yeni bilgi toplamak ise insan ve zaman gerektirir. Bu ayrım, kararları rahatça düşünmeye izin verirken son tarihten önce sınırsız araştırma yapılmasını önler.

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

### İlk tempo ölçümleri ve oturum devamlılığı

**Onaylı ölçüm yaklaşımı (2026-09-30):** Aşağıdaki aralıklar ilk oynanış denemelerinin hedefleridir; ölçülmüş sonuç, zorunlu süre veya kesin denge değildir. Yoğun günlerin yaklaşık bir saat veya daha uzun yaşanabilmesi korunur.

| Deneyim | Gerçek oynama süresi için ilk hedef |
|---|---|
| Sakin gün | 1–5 dakika veya boş günleri birlikte ilerleme |
| Olağan yönetim günü | 5–15 dakika |
| Yoğun gün | 30–60 dakika; gerektiğinde daha uzun |
| Maç | Mevcut 10–15 dakika hedefi |
| Toplam maç günü | Yaklaşık 20–35 dakika; tören ve çevresindeki içerik ayrıca ölçülür |
| Normal sezon | Yaklaşık 20–35 saat; fikstür, yetki devri ve katılım tercihleriyle birlikte sınanır |

İçerik, bir süre kotasını doldurmak için üretilmez. Kariyerin uzunluğu anlamlı sezonlardan, sonuçlardan ve gelişimden gelir; boş bekleme veya gerçek dünyada bekleme şartı konmaz. Her günü bir saate uzatmak hedeflenmez. Kesin maç sayısı ve kariyer uzunluğu bu tablodan çıkarılmaz. Tablo zorunlu süre değil ölçüm hedefidir: gerçek sezon süresi tekrarlar, karar yoğunluğu ve oyuncunun sıkıldığı noktalarla birlikte ölçülür; uzun kariyerin toplam süresi ayrıca değerlendirilir.

Kısa bir oturumda bir mesele ilerletilebilmeli; yoğun bir gün birkaç oturuma bölünebilmelidir. İlk hedef, tamamlanan kararların ve güvenli sahne geçişlerinin gün içinde kaydıdır. Dönüşte son karar, beklenen haberler ve yaklaşan önemli tarih kısa biçimde hatırlatılır. Maç veya görüşmenin tam ortasından devamın kapsamı [teknik planda](TEKNIK_PLAN.md#5-kayıt-ve-yükleme) ayrı tutulur. Bugünkü uygulama her tamamlanan kararın ardından kaydeder (2.4); maç sınırında kayıt yapılmaz. **Kullanıcı kararı (2026-10-02):** telefondaki “Kaldığın yer” dönüş özeti kaldırıldı (2.8L); dönüşte oyun kaldığı yerden, odada sakin açılır.

## 7. Ekonomi, yetki devri ve kişisel katkı

Oyuncu; mevcut nakdi, gelecek ödemeleri ve yaptığı taahhütleri görebilir. Nakit, dönem bütçesi ve ileri tarihteki yükümlülükler aynı değer değildir.

Sayman bir anlaşmanın gelecek ödeme günlerine etkisini anlaşılır biçimde açıklar: örneğin yeni taksidin maaş günüyle çakışması. Özetin dayandığı tutar ve tarihler ayrıntıda görülebilir; gelecekteki belirsiz gelir kesin para gibi sunulmaz.

Gelir/gider alanları: bilet ve doluluk, sponsor, yayın geliri, maaş, transfer ve menajer bedelleri, sözleşme primleri, tazminat, tesis ve stat yatırımları. Ayrıntı düzeyi başkanın kararını değiştirdiği ölçüde artırılır.

Başkan oyundaki mali kurallar çerçevesinde sınırlı kişisel katkı yapabilir. Şirketi yönetilmez. Katkının biçimi, sınırı, geri ödemesi olup olmadığı ve kulübün mali değerlendirmesine etkisi açıkça gösterilir. Bunlar henüz seçilmemiş oyun kurallarıdır; güncel gerçek düzenlemelerin birebir uygulandığı iddia edilmez.

Ekonomik daralma; taraftarın alım gücü, sponsorun ödeme gücü ve kulüp giderleri gibi birkaç anlaşılır bağlantıyla hissedilir. Ayrı bir ülke ekonomisi simülasyonu kurulmaz.

Yetki devrinde kişi, iş, bütçe tavanı, süre ve başkana dönülecek durumlar belirlenir. İyi ekip hem fırsat üretir hem iş yükünü azaltır. Bir üyeyi almak veya kişisel para koymak ekonomi sorununu kalıcı biçimde çözmez.

**Onaylı tasarım yaklaşımı (2026-09-30):** Tavsiye istemek karar sorumluluğunu başkanda bırakır; yetki devri, kişinin tanımlı sınırlar içinde işi yürütmesini sağlar. Tek iş yanında kalıcı sorumluluklar da tanımlanabilir. Ekibin kapasitesi ve bekleyen işi anlaşılır olmalı; yetkili olduğu rutin adımlar için tekrar tekrar onay istenmemelidir.

İşe uygun yönetici uzmanlığı veya ilişkileri sayesinde bazı işleri başkandan daha iyi çözebilir. Başkanın şahsen katılması da bazı görüşmelerde özel ağırlık taşıyabilir. Bütün işlerde en iyi sonucu kişisel katılıma bağlamak oyuncuyu her işi yapmaya yöneltir; denge testleri bunu özellikle kontrol eder. Bugünkü sponsor denemesinin sonuçları bu dengeyi kanıtlamaz.

## 8. Görüşmeler ve futbol yapılanması

### Transfer ve sponsor görüşmeleri

Başkan önemli anlaşmalara doğrudan katılabilir; rutin işler ekibe bırakılabilir. Araştırma, ilk temas, koşullar, karşı teklif, son tarih ve imza aşamaları gerektiği kadar kullanılır. Her transfer bütün aşamalarda kriz üretmez.

Örnek gelişmeler: menajerin ek talebi, oyuncunun aile veya rol beklentisi, rakibin teklifi, basına sızma, ücret artışı, sağlık değerlendirmesi veya sorunsuz imza. Gelişmeler ilgili kişilerin çıkarları ve mevcut şartlarla bağlantılıdır.

Sponsor görüşmelerinde para kadar ödeme tarihi, taahhüt edilen haklar, taraftarın yorumu ve gelecekteki hareket alanı önemlidir. Kabul, bekleme, yeniden pazarlık ve çekilme seçeneklerinin maliyeti bulunabilir.

Kaçan transfer, bozulan anlaşma veya geciken gelir sonrasında şartlara uygun alternatif arayışı, yeniden planlama ya da ilişkiyi telafi girişimi bulunabilir. Başarısızlığın bedeli ve verilen sözler korunur; her sorun kariyeri kapatan bir çıkmaza dönüşmez. Sorunsuz anlaşma yolu da çalışır.

### Teknik direktör

Hoca; geçmiş kariyeri, oyun anlayışı, kadroyla uyumu, gençlerle çalışması, iletişimi ve kriz davranışı üzerinden değerlendirilir. Gizli yetenekleri çok boyutludur. Ün veya tek bir toplam değer en doğru seçim anlamına gelmez.

Hoca gözlemine ve bilgisine göre kadro/taktik seçer; hataları eksik bilgi, tercih, baskı ve değerlendirme kabiliyetiyle açıklanabilir. Gerçek oyuncu özelliklerini kusursuz bilen bir seçim makinesi veya sürekli rastgele hata yapan biri olmaz.

## 9. Puan göstermeyen oyuncu sistemi

Üç katman korunur:

1. Oyuncunun gerçekte sahip olduğu gizli özellikler ve mevcut durumu.
2. Hoca ve gözlemcilerin onun hakkında bildikleri veya tahmin ettikleri.
3. Başkanın gördüğü rapor ve kanıtlar.

Yetenek ve potansiyel için sayısal puan, yıldız, güç çubuğu veya bunların harf notu karşılığı kullanılmaz. Yaş, boy, dakika, gol, maaş, sözleşme ve sakatlık geçmişi gibi gözlenebilir sayılar gösterilebilir.

Rapor; belirgin özellik, gözlem tarihi, gözlem kaynağı ve belirsizliği anlatır. Örnek: “Hava toplarında etkili; dar alanda dönüşü ağır. İki maç izlendiği için baskı altındaki kararları hakkında yeterli bilgi yok.”

Gelişim; teknik, fiziksel ve zihinsel alanlarda farklı ilerler. Yaş, oynama süresi, antrenör, tesis, çalışma alışkanlığı, sakatlık ve uyum etkilidir. Form, yorgunluk ve moral ile kalıcı yetenek değişimi birbirine karıştırılmaz. Altyapı yatırımı yıldız çıkma ihtimalini ve gelişim ortamını iyileştirir; garanti yıldız üretmez.

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

Maçlar karakterin bulunduğu yerden izlenir. Görevdeyken ev sahibi veya deplasman başkan bölümündesin; yanında yöneticiler ve rakip başkan bulunabilir. İlişkiler selamlaşma, oturma düzeni, kısa konuşma ve katılmama gibi ayrıntılara yansır. Görev dışında farklı izleme konumu kullanılır.

Az sayıda anlamlı mekân zaman içinde değişir: kulüp odası, görüşme alanı, basın alanı, antrenman ve stat. Eski personel, fotoğraflar, kupalar ve nesneler yaşanan geçmişi görünür kılar. Gerektikçe yeni mekân eklenir; her konuşma için ayrı mekân yapılmaz.

İlk uygulama oda/görüşme ve isteğe bağlı antrenman örneğine odaklanır. Mekânlar aynı meseleye farklı yerlerden erişim sağlar; yer değiştirmek konuyu veya karar geçmişini sıfırlamaz. Küçük bir yatırımın veya tutulmuş sözün ortamdaki izi erken gösterilir; kapsamlı tesis ve stat gelişimi daha sonra tamamlanır. Antrenmana gitmek ya da uzun süre izlemek günlük zorunlu ödül toplama işine dönüşmez.

Üç ligin kulüp kimlikleri sabittir; bulundukları kademe yükselme/düşmeyle değişir. Oyuncular, başkanlar, hocalar, hakemler ve medya insanları yenilenir. Üçüncü ligin alt sınırında ne olacağı açık karardır.

Avrupa rakipleri ve yabancı oyuncu kaynakları için yeterli bir dış dünya temsili kurulur. Bütün yabancı liglerin maçlarını ayrıntılı simüle etmek gerekmez. Avrupa deplasmanları görkemli statları ve ortamıyla kariyerin ilerlemesini hissettirir. Kendi stadın da para, zaman ve yatırımlarla gelişir.

### Ortak stat ve maç günü sunumu

**Onaylı hedef (2026-10-01; şehir stadının kaldırılması ve ortak stat 2.8D ile uygulandı, etaplı gelişim 8.3'te):** Ayrı “1. Lig şehir stadı” tarifi ve seçimi kaldırılır. Kulübün başlangıç stadı korunur; üst ölçeğe aynı stadın tribün, zemin, aydınlatma ve tesislerinin para/zaman/yatırımla gelişmesiyle ulaşılır. Lig atlamak kendiliğinden stat değiştirmez. Oda penceresindeki, balkondaki ve ev sahibi maçındaki saha/tribün yerleşimi aynı kulüp stadına aittir; saat, ışık, doluluk ve antrenman durumu farklı olabilir. Kapsamlı yatırım sistemi Aşama 8'dedir; şimdi ortak fiziksel temel kurulur.

Balkona odadaki kapıya tıklayarak çıkılır. Başkan doğal biçimde ayağa kalkar, yönelir, kısa adımlı yürüyüşle yerine oturur. **2026-10-02 kararı:** bütün oyunda sakin hareket standarttır; kamera sallantısı ve dekoratif hareketler kaldırılır, hareket azaltma ayarı sunulmaz. Kalkış ve kısa yürüyüş korunur; eski ayarın doğrudan geçiş davranışı yeni standart değildir. Futbol/top ve gerekli karakter hareketleri ile klavye erişimi sürer. Ev sahibi maçındaki başkan yeri daha yüksekte, altında tribün sıraları görülecek biçimdedir. Çay kaldırılmıştır.

**2026-10-02 hedefi (2.8J ile uygulandı; görünüm [STIL_REHBERI §5](STIL_REHBERI.md#5-stat-ve-tribün)):** Başlangıç stadı daha mütevazı, çatısız bir kasaba/ilçe stadı olur; küçük tribünler ve yıpranmış çevre gelişime alan bırakır. Çatı ve diğer kapsamlı yatırımlar sonra yapılır. Tek mevcut tabela, başkan açısından okunur konumda direkler üzerinde armalar, skor ve dakika gösterir. Balkon, pencere ve maç aynı değişiklikleri taşır; olmayan çatıya bakım izi bağlanmaz.

Maç öncesi açık tonlarda **tek kompakt ekran** sunulur: armalar/karşılaşma, lig/hafta/saat, kısa form/sıra bilgisi ve tek cümle bağlam. Stat resmi, ayrı kadro/lig sayfaları ve yoğun tablolar kaldırılır. En az **10 saniyelik hazırlık**, dolan bir çubukla görünür; bu gerçek dosya yükleme yüzdesi diye sunulmaz. Süre tamamlanıp gerekli kaynaklar hazır olunca “Maça geç” etkinleşir, oyuncu kendisi geçer. Duraklat çubuğu da durdurur. Bekleme takvimde süre tüketmez ve maçı başlatmaz; §6'daki süre hedefleri bekleme kotasına dönüştürülmez.

Yazılı maç spikeri/radyo akışı kaldırılır. Skor ve dakika stat tabelasında; ayrıntılar masadaki telefondaki Canlı Skor uygulamasında görülür. Kendi maçının istatistikleri mevcut motorun ürettiği verilerdir. Diğer lig maçları gerçek fikstür, maç kimlikleri, kadrolar ve sonuç temeli kurulduğunda bağlanır (Aşama 3); o zamana kadar veri eksikliği açıkça gösterilir, uydurma canlı skor üretilmez.

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
| Seçmen yapısı, dört/beş yıl, erken seçim (ilk üç koltuk seçildi, §4) | Seçim kuralları için Aşama 6 öncesi |
| Yönetim adaylarının katkılarının gösterimi | **Karar verildi (2026-09-30):** nihai üründe profil metni görünür, katkı seviyeleri gizlidir. Geliştirme aşamasında seviyeler, gizli koşullar ve futbolcu özellikleri “Test bilgileri” ayarıyla görünür; yayından önce kaldırılır |
| Kişisel katkı biçimi, sınırları ve mali kurallar | Aşama 4 öncesi |
| Takım sayıları, sezon ve transfer takvimi, alt lig sınırı | Aşama 3 temeli için seçilmeli veya açık TEST tarifi kullanılmalı; tam sezon için Aşama 5 öncesi kesinleşmeli; yükselme/düşme ayrıntısı Aşama 8 öncesi |
| Başkanın başlangıç yaşı, becerileri, kupasız final koşulları | Veri alanları Aşama 1; davranış kararı Aşama 7 öncesi |
| Avrupa kupalarının sayısı, formatı ve katılım kuralları | Aşama 9 öncesi |
| Kesin günlük/sezonluk tempo, maç günü toplam süresi, geçiş/atlama seçenekleri, olay yoğunluğu | §6'daki başlangıç aralıklarıyla Aşama 2–3'ten itibaren, tam sezonda Aşama 5'te ölçülür |
| Kesin para tutarları, yaş etkileri, seçim/transfer olasılıkları | İlgili sistemin oynanış testleri; önceden kesin denge sayılmaz |
| Değişken başlangıç alanları, uyumluluk sınırları ve zorluk dengesi | 2.4A'da dar TEST örnekleri; tam devralma koşulları ve giriş için Aşama 6 öncesi |
| Olay paketlerinin ayrıntılı seçenekleri, katkı/hak koşulları ve tekrar aralıkları | İlgili yol haritası adımında; katalog uygulama veya kesin denge sayılmaz. P03'ün ilk örneği hisse/yatırımcı sistemi kurmaz |

Geliştirme aşamaları ve açık işlerin tek takip yeri [YOL_HARITASI.md](YOL_HARITASI.md) dosyasıdır.
