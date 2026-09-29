# Chairman — oyun tasarımı

Son güncelleme: 2026-09-29. Bu belge hedef oyunu tanımlar; burada anlatılan sistemlerin çoğu henüz uygulanmamıştır. Çalışan özellikler ve geliştirme sırası [yol haritasındadır](YOL_HARITASI.md). Uygulama yaklaşımı [teknik plandadır](TEKNIK_PLAN.md).

## 1. Amaç ve kararların durumu

Oyuncu, bir futbol kulübünün geleceğine karar verir; sonra tribünde oturup kararlarının sonucunu yaşar. Başkanlık hissi; insanlarla ilişkilerden, mali sorumluluktan, verilen sözlerden, maç heyecanından ve yıllar boyunca biriken geçmişten gelir.

- **Kesin karar:** Kullanıcının belirlediği ürün yönü; aşağıdaki temel çerçeve.
- **Onaylı tasarım yaklaşımı:** Bu yönü uygulamak için kabul edilen plan. Ayrıntılı sayılar ve denge değerleri testlerle belirlenecek.
- **Açık karar:** Henüz seçilmemiş ayrıntı. Belgenin sonundaki tabloda takip edilir; varsayım kesin karar gibi uygulanmaz.
- **Örnek:** Bir sistemin davranışını anlatır; yazılmış veya tamamlanmış oyun içeriği değildir.

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

Ana döngü:

> Ajandayı ve kulübün durumunu gör → bilgi topla ve insanlarla görüş → karar ver veya yetki devret → gelişmeleri yaşa → maçı izle → sonuçlar, ilişkiler ve yeni gündemle devam et.

Oyuncu; kararın konusunu, bilinen maliyetini, verilen taahhüdü ve belirsiz kalan noktaları anlayabilmelidir. Her kararın hemen olumlu veya olumsuz sonucu çıkması gerekmez. Bazı sonuçlar haftalar ya da yıllar sonra hatırlanır.

## 3. Kulübün geçmişi ve başlangıç hikâyesi

Kulübün sabit bir geçmişi hazırlanır: kuruluş, önemli eski başkanlar ve oyuncular, başarılar, kırılmalar, gelenekler, taraftar alışkanlıkları ve şehirle ilişkisi. Bu geçmişten gelecekteki olaylar üretilir. Geçmiş kayıtları ile oyuncunun kariyerinde oluşan yeni geçmiş ayrılır.

Başlangıç ayrı sahnelerle gelişir:

1. Taraftar olarak maçlara gider, tanıdıklarla konuşur ve kötü gidişe verilen tepkileri görürsün.
2. Gazetelerden ve çevrenden gelişmeleri takip edersin; kulübün insanlarını tanırsın.
3. Adaylık fikri çevrenden gelen görüşmelerle büyür. Aday olma isteğin ve karakterin konuşmalarla şekillenir.
4. Adaylığını açıklarsın; ilk röportaj, ekip arayışı ve kampanya başlar.

Girişe sabit bir kısa süre sınırı konmaz. Buna rağmen oyuncu erken aşamada anlamlı seçimler yapabilmelidir. Ardışık sahneler ve maç izleme süreleri oynanış testinde değerlendirilir; tekrarlanan geçişler zorunlu beklemeye dönüşmez.

## 4. Yönetim ekibi, vaatler ve seçim

### Yönetim havuzu

Adaylar finansal güç, bağlantılar, futbol geçmişi, yönetim deneyimi, kişilik ve kendi beklentileri bakımından farklıdır. Havuz ilerledikçe yeni kişilerle genişleyebilir. İlk karşılaşmada aşırı sayıda kişiyi ezberleme yükü oluşturulmaz.

Tek bir özellik bütün bir problemi çözmez. Paralı üyenin desteğinin miktarı, zamanı, şartı ve güvenilirliği ayrı konulardır. Eski futbolcu oyunculara ulaşabilir ama mali konularda zorlanabilir. Her kişi yalnızca bir avantaj ve bir ceza taşıyan kalıba indirgenmez.

### Kampanya

- Ekip ile vaatler ve öncelikler hazırlanır; bütçeyle ve birbirleriyle ilişkileri bulunur.
- Rakip adaylarla karşılaşmalar, yerel röportajlar, kulis ve hazırlıksız yakalanılan olaylar yaşanır.
- Seçim günü konuşmalar, bekleyiş, oy sayımı ve sonuç sahneleri vardır.
- İlk seçim makul hazırlıkla çoğunlukla kazanılabilir; kötü hazırlık ve nadir olumsuz gelişmelerle kaybedilebilir. İlk seçim için hedef başarı oranı henüz belirlenmemiştir.
- Sonuç; adayın inandırıcılığı, ekibi, ilişkileri, vaatleri ve rakiplerden oluşur. Belirsizlik bulunur, fakat tek bir açıklanamayan zar bütün hazırlığı değersizleştirmez.
- Sonraki seçimler gerçek görev geçmişini ve rakiplerin alternatiflerini değerlendirir. İyi yönetmek destek sağlar; otomatik yeniden seçilme garantisi vermez.

Oy kullanacak grubun yapısı, yönetim koltukları, dönem süresi ve erken seçim/görevden alınma koşulları uygulanmadan önce kararlaştırılacaktır.

## 5. Görev dışında geçen dönem

Seçim kaybedilince kulüp ve lig yaşamaya devam eder. Yeni başkan kendi ekibiyle yönetir; başarısız olup eski başkana yol açması zorunlu değildir.

- Kulüp parasını kullanma, kadro kararlarına müdahale ve iç belgelere erişim yetkisi sona erer.
- Daha hızlı takvim akışıyla gelişmeleri takip eder, önemli konularda durabilir ve eylem seçebilirsin.
- Maçlara başkan koltuğundan farklı bir üye/davetli bölümünde veya uygun bir locada gidebilirsin. Kesin mekân düzeni ileride tasarlanacak.
- Açıklama yapmak, eski ekiple görüşmek, destek toplamak ve yeni seçime hazırlanmak mümkündür.
- İlişkiler devam eder; bazı insanlar yanında kalır, bazıları yeni yönetime yaklaşır.
- Kulübü desteklemekle yeniden seçilmek istemek arasındaki gerilim sahnelerde hissedilir.

Hızlandırma önemli olayları sessizce atlamamalıdır. Yeniden adaylık veya seçilmek garanti değildir; kupasız bir kariyer sonuna ulaşılması da mümkündür.

## 6. Zaman, ajanda ve tempo

Üç süre birbirinden ayrılır:

| Süre | Anlamı |
|---|---|
| Takvim | İnşaat, ödemeler, fikstür, sözleşme, transfer ve seçim tarihleri |
| Gün içi zaman | Görüşmenin, yolculuğun veya maçın ajandada kapladığı zaman |
| Gerçek oynama süresi | Oyuncunun sahnede düşündüğü, konuştuğu, izlediği ve vakit geçirdiği süre |

İki oyun haftalık stat geliştirmesi, takvim iki hafta ilerleyince tamamlanır. Bu haftaların gerçek süresi gündeme göre değişebilir. Bir ekranı açık bırakmak kendiliğinden günleri tüketmez; zamanın hangi eylemle ilerlediği anlaşılır olur.

Ajanda; zorunlu, ertelenebilir ve isteğe bağlı işleri ayırır. Günü bitirme ve sonraki önemli gelişmeye ilerleme davranışı tasarlanır. Bekleyen görüşmenin veya süresi dolacak teklifin atlanacağı önceden anlaşılır.

Antrenman, boş stat veya kulüp odası gibi isteğe bağlı alanlarda vakit geçirilebilir. Telefon ve haberler bu ortamların içinde gelebilir. Uzun süre beklemek zorunlu bir yetenek veya bilgi kazancına dönüşmez.

Transfer gibi uzun olaylar farklı günlere yayılır: hazırlık, görüşme, haber bekleme, karşı teklif ve sonuç. İçerik temposu gerçek oynama süresi ölçülerek ayarlanır. Yoğun günleri kısaltmak için otomatik bir hedef konmaz; tekrarlar ve amaçsız bekleme azaltılır.

## 7. Ekonomi, yetki devri ve kişisel katkı

Oyuncu; mevcut nakdi, gelecek ödemeleri ve yaptığı taahhütleri görebilir. Nakit, dönem bütçesi ve ileri tarihteki yükümlülükler aynı değer değildir.

Gelir/gider alanları: bilet ve doluluk, sponsor, yayın geliri, maaş, transfer ve menajer bedelleri, sözleşme primleri, tazminat, tesis ve stat yatırımları. Ayrıntı düzeyi başkanın kararını değiştirdiği ölçüde artırılır.

Başkan oyundaki mali kurallar çerçevesinde sınırlı kişisel katkı yapabilir. Şirketi yönetilmez. Katkının biçimi, sınırı, geri ödemesi olup olmadığı ve kulübün mali değerlendirmesine etkisi açıkça gösterilir. Bunlar henüz seçilmemiş oyun kurallarıdır; güncel gerçek düzenlemelerin birebir uygulandığı iddia edilmez.

Ekonomik daralma; taraftarın alım gücü, sponsorun ödeme gücü ve kulüp giderleri gibi birkaç anlaşılır bağlantıyla hissedilir. Ayrı bir ülke ekonomisi simülasyonu kurulmaz.

Yetki devrinde kişi, iş, bütçe tavanı, süre ve başkana dönülecek durumlar belirlenir. İyi ekip hem fırsat üretir hem iş yükünü azaltır. Bir üyeyi almak veya kişisel para koymak ekonomi sorununu kalıcı biçimde çözmez.

## 8. Görüşmeler ve futbol yapılanması

### Transfer ve sponsor görüşmeleri

Başkan önemli anlaşmalara doğrudan katılabilir; rutin işler ekibe bırakılabilir. Araştırma, ilk temas, koşullar, karşı teklif, son tarih ve imza aşamaları gerektiği kadar kullanılır. Her transfer bütün aşamalarda kriz üretmez.

Örnek gelişmeler: menajerin ek talebi, oyuncunun aile veya rol beklentisi, rakibin teklifi, basına sızma, ücret artışı, sağlık değerlendirmesi veya sorunsuz imza. Gelişmeler ilgili kişilerin çıkarları ve mevcut şartlarla bağlantılıdır.

Sponsor görüşmelerinde para kadar ödeme tarihi, taahhüt edilen haklar, taraftarın yorumu ve gelecekteki hareket alanı önemlidir. Kabul, bekleme, yeniden pazarlık ve çekilme seçeneklerinin maliyeti bulunabilir.

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

Taraftar, seçmenler, yönetim, oyuncular, hoca, sponsorlar, rakip başkanlar, gazeteciler ve federasyon çevresi farklı beklentilere sahiptir. Tek bir genel popülerlik değeri bütün davranışları açıklamaz.

Verilen sözün sahibi, muhatabı, konusu, şartı, son tarihi ve kimler tarafından bilindiği tutulur. Sözün tutulması, yeniden görüşülmesi veya bozulması hatırlanır. Söylenen her cümle otomatik olarak bağlayıcı söz sayılmaz; oyuncu taahhüt verdiğini anlayabilmelidir.

Medya ve TV katılımları, taraftar talepleri, hakem atamaları ve tartışmalı kararlara tepkiler kulübün görünürlüğüyle değişir. Resmî itiraz, kamuoyu açıklaması, temsilci gönderme veya sessiz kalmanın farklı sonuçları olabilir. Kanıtlanmış olay, yorum ve söylenti birbirinden ayrılır; sistem başkanı gizlice cezalandıran bir kurguya dönüşmez.

Olay kaynakları: kararların sonuçları, dünyadaki gelişmeler ve sınırlı sürprizler. Olay sıklığı, tekrar aralığı ve aynı anda açık kalan konular denetlenir. İyi yönetimin rahat dönemler üretmesine izin verilir. Başarı, teşekkür, geçmişten gelen dostluk ve kulübe aidiyet sahneleri de içeriktir.

### Süreli cevaplar

Özel röportaj ve acil karar anlarında kısa cevap süresi olabilir; yaklaşık beş saniye bir örnektir, sabit genel kural değildir. Soru ve seçenekler anlaşılmadan sayaç başlamaz. Süre bitince oluşacak susma/geçiştirme gibi davranış sahneye uygundur. Normal görüşmelerde düşünmeye zaman vardır.

Okuma süresi, flaş ve sarsıntı için erişilebilirlik seçenekleri planlanır. Baskıyı öncelikle kararın önemi, ortam ve insanların tepkileri taşır.

## 11. Maçlar, mekânlar ve kulübün büyümesi

Maçlar karakterin bulunduğu yerden izlenir. Görevdeyken ev sahibi veya deplasman başkan bölümündesin; yanında yöneticiler ve rakip başkan bulunabilir. İlişkiler selamlaşma, oturma düzeni, kısa konuşma ve katılmama gibi ayrıntılara yansır. Görev dışında farklı izleme konumu kullanılır.

Az sayıda anlamlı mekân zaman içinde değişir: kulüp odası, görüşme alanı, basın alanı, antrenman ve stat. Eski personel, fotoğraflar, kupalar ve nesneler yaşanan geçmişi görünür kılar. Gerektikçe yeni mekân eklenir; her konuşma için ayrı mekân yapılmaz.

Üç ligin kulüp kimlikleri sabittir; bulundukları kademe yükselme/düşmeyle değişir. Oyuncular, başkanlar, hocalar, hakemler ve medya insanları yenilenir. Üçüncü ligin alt sınırında ne olacağı açık karardır.

Avrupa rakipleri ve yabancı oyuncu kaynakları için yeterli bir dış dünya temsili kurulur. Bütün yabancı liglerin maçlarını ayrıntılı simüle etmek gerekmez. Avrupa deplasmanları görkemli statları ve ortamıyla kariyerin ilerlemesini hissettirir. Kendi stadın da para, zaman ve yatırımlarla gelişir.

## 12. Başkanın yaşlanması ve kariyer sonları

Başkanın dayanma gücü, uyumu ve bazı becerileri yaşla gerileyebilir; tecrübesi, insan tanıması ve kulüpteki ağırlığı artabilir. Değişim herkes için tek bir yaş çizelgesine indirgenmez. Yeni adaylar ve değişen beklentiler baskı oluşturur.

Yaşlanma; hazırlık, iş yükü ve ekibe ihtiyaç üzerinden oynanışa yansır. Kullanıcının seçtiği cevabın rastgele başka cevaba çevrilmesiyle anlatılmaz. Somut beceri modeli, sağlık ve emeklilik koşulları henüz açık karardır.

Avrupa hedefi başlangıçta büyük final görevi olarak söylenmez. Üst ligdeki ilerlemeyle doğar ve kariyer bitmeden önce anlamı anlaşılır hâle gelir. En büyük kupanın adı, formatı ve bu hedefin açıklanma sahnesi ayrıca belirlenecek.

Kupaya ulaşmak; doğru ekip, mali devamlılık, uygun hoca, kadro gelişimi ve futbol belirsizliğinin bir araya gelmesini gerektirir. Çok zor olması hedeflenir; sabit bir kazanma yüzdesi veya yapay biçimde güçlendirilen final rakibi belirlenmez. Başarının yalnız tekrar denemeye ya da boş bekleme süresine dayanması önlenir.

Başarı finali kutlama, şehre dönüş, insanlarla veda ve bırakmayla tamamlanır. Kupasız finaller de kulübün mali durumu, gelişimi, yetişen oyuncular ve ilişkilerle farklılaşır. Seçim kaybı ile kariyerin kalıcı bitişi ayrı durumlardır.

## 13. Kapsam ve açık kararlar

İlk ticari hedefe dahil değildir: seçilebilir çok sayıda kulüp, başkanın şirketini yönetme, bütün dünya liglerini ayrıntılı oynatma, çevrimiçi çok oyunculu yapı, her kişiye haftalık zorunlu görüşme ve her olaya ayrı mekân. Tam seslendirme gibi içerik maliyeti yüksek işler temel oynanış kanıtlandıktan sonra değerlendirilir.

| Açık konu | Karar verilmesi gereken aşama |
|---|---|
| Kulübün nihai adı, şehir, kuruluş ve geçmiş kişiler | Hikâye içeriği; Aşama 5 öncesi |
| Seçmen yapısı, yönetim koltukları, dört/beş yıl, erken seçim | Ekip için Aşama 2; seçim kuralları için Aşama 5 öncesi |
| Kişisel katkı biçimi, sınırları ve mali kurallar | Aşama 4 öncesi |
| Takım sayıları, sezon ve transfer takvimi, alt lig sınırı | Aşama 6 öncesi; yükselme/düşme ayrıntısı Aşama 8 öncesi |
| Başkanın başlangıç yaşı, becerileri, kupasız final koşulları | Veri alanları Aşama 1; davranış kararı Aşama 7 öncesi |
| Avrupa kupalarının sayısı, formatı ve katılım kuralları | Aşama 9 öncesi |
| Maç günü toplam süresi, geçiş/atlama seçenekleri, olay yoğunluğu | Aşama 2–3'ten itibaren oynanış testleri |
| Kesin para tutarları, yaş etkileri, seçim/transfer olasılıkları | İlgili sistemin oynanış testleri; önceden kesin denge sayılmaz |

Geliştirme aşamaları ve açık işlerin tek takip yeri [YOL_HARITASI.md](YOL_HARITASI.md) dosyasıdır.
