# Chairman — yol haritası

Son güncelleme: 2026-10-01. Bu dosya iş sırasının ve tamamlanma durumunun ana kaynağıdır. Oyun kuralları [OYUN_TASARIMI.md](OYUN_TASARIMI.md), mimari yaklaşım [TEKNIK_PLAN.md](TEKNIK_PLAN.md), sunum kuralları [STIL_REHBERI.md](STIL_REHBERI.md) içindedir.

## Şu an neredeyiz?

Çalışan ürün bir maç günü prototipi, kariyer temeli (Aşama 1), ilk ajanda haftası (2.1), sayman/sponsor denemesi (2.2'nin ilk adımı), sponsor konusunun tek mesele olarak takibi ve “İlerle” ile durma noktalarına ilerleme (2.3) ile gün içi kayıt ve dönüş özetidir (2.4). 2.3–2.4 kodu PR #8 ile `main` dalına birleşti. Değişken başlangıcın ve koşula bağlı olayın dar ilk örneği (2.4A) ile aydınlık başkan odası (2.5) çalışır: oyun odayla açılır, gündem masadaki telefon, ajanda ve dosyadan izlenir. Üstüne tavsiye/yetki devri/ekip (2.6) ile sözler, gazete ve odadaki izler (2.8) eklendi. Bu adımlar PR #9 ile `main` dalına birleşti. Balkon ve antrenman gözlemi (2.7) çalışır: odadan balkona yürünür, takım sahadayken isteğe bağlı gözlem yapılır, telefon kararında gözlem durur; bu adım PR #10 ile `main` dalına birleşti. Tam devralma koşulları, kalan olay paketleri ve kişi/görüşme sahneleri henüz uygulanmadı. Git'teki kaynak durumuyla Pages/masaüstü dağıtım sürümü ayrı doğrulanır.

- [x] Maç motoru '99 sahnesine bağlı; maç baştan sona oynanıyor.
- [x] Başkan bakışı, dürbün, başkanın elleri/masası ve olaylara tepkiler var.
- [x] Kadro verisi, tohumlu maç mantığı, top fiziği, oyuncu kararları ve topsuz oyun var.
- [x] Taç, korner, aut, faul, kart, ofsayt, oyuncu değişikliği, top toplayıcılar ve uzatma sunumu var.
- [x] Isınma, çıkış, tören, tokalaşma, fotoğraf, yazı tura, devre arası ve maç sonu akışı var.
- [x] İki stat tarifi var: 3. Lig kasaba ve 1. Lig şehir. Avrupa arenası şu an mevcut değil.
- [x] Zemin, seyirci doluluğu, koltuklar ve tribün tepkilerinin görsel temeli var; değerler geçici deneme panelinden geliyor.
- [x] Tarayıcı kontrolü ve görüntüsüz maç ölçüm araçları var. Her ortamda bağımlılıklarının hazır olduğu varsayılmaz.
- [x] Sabit lig/kadro verisiyle çalışan maç öncesi bülteni var: lig durumu, form, olası 11'ler, eksikler ve son maçlar; “İlerle” ile maç gününe geçiliyor.
- [x] Maçtan önceki TEST haftası (2.4A'dan beri üç başlangıçtan biriyle, 2.5'ten beri başkan odasında) oynanıyor, her tamamlanan komuttan sonra kaydediliyor (maç sınırı hariç), Cumartesi “Stada git” bültene geçiyor. Maç sonucu kariyere işlenmiyor.
- [x] Kariyer verisi, takvim, para hareketleri ve gelecekteki ödemeler için temel; tarayıcı/masaüstü kayıt ve önceki sağlam kayda dönüş var.
- [x] Üç yönetim koltuğu havuzdan kuruluyor; sayman ve basın sözcüsü seçimi, tavsiye, yetki devri, kalıcı sorumluluk ve başkanın girişimleri var (2.2, 2.6). Kapsamlı ekip sistemi (bütçe tavanları, anlaşmalar) Aşama 4'te.
- [x] Windows/Electron ile çevrimdışı masaüstü denemesi var; ticari paket tamamlanmadı.
- [x] Ortak mesele geçmişi (sponsor örneği), durma noktalarına ilerleme ve gün içi karar kaydı ile dönüş özeti mevcut ajanda ekranında var (2.3–2.4).
- [x] Üç TEST başlangıcı, koşula göre açılan/açılmayan/önlenen ödeme sıkışması olayı (P01'in dar örneği) ve eski sabit haftanın yeni kariyer yolundan çıkarılması (2.4A).
- [x] Aydınlık başkan odası: masadaki telefon, ajanda ve dosya; açık renkli paneller, ses düzeyi ve yazı büyüklüğü ayarı (2.5).
- [x] Hoca talebi, basın sorusu ve koşullu destek paketleri; söz kaydı, Cuma gazetesi, teşekkür ve odadaki görünür izler (2.6, 2.8).
- [x] Balkon ve antrenman kenarı, gözlem sırasında telefon ve kontrollü gözlem (2.7).
- [ ] Kişi/görüşme sahneleri (kişi modelleriyle yüz yüze görüşme).
- [ ] Tam devralma koşulları ve kalan olay paketleri (bugün P01, P03 ve P13'ün dar örnekleri ile hoca/basın örnekleri var).
- [ ] Tam yönetim, sözleşme/ekonomi, seçim, sezon, uzun kariyer ve Avrupa sistemleri; maç sonucunun kariyere bağlanması.
- [ ] Ticari masaüstü paketi ve uzun kariyer doğrulaması.

**Onaylanan yenileme henüz kodda yok (2026-10-01):** Yukarıdaki iki stat, ses ayarı, mevcut paneller ve prototip kontrolleri bugün çalışan uygulamayı anlatır. Yeni 2.8A–2.8F işleri bu düzeni yenileyecek; tarihsel tamamlanma kayıtları korunur. Sıradaki iş 2.8A'dır.

## Güncel karar özeti

- **2026-09-26/27, geçerli:** Görseller kodla üretilir. Mevcut '99 görünümü, karakterin gözünden maç izleme ve kurgusal kulüp/kişi kimlikleri korunur. Reddedilen konsept denemeleri ürüne alınmaz.
- **2026-09-29, geçerli:** Proje adı Chairman; mevcut kulüp Demirkapı SK. Nihai kimlik açık karar.
- **2026-09-29, kullanıcı kararları:** Türkiye, Türkçe ilk içerik, tek kulüp, taraftar iş insanından adaylığa hikâye, tekrarlanan seçimler ve görev dışında yeniden adaylığa hazırlanma dönemi.
- **2026-09-29, kullanıcı kararları:** Yetenek puanları görünmez; insanlar ve başkan yaşlanır. Uzun oyun günleri ve ağır kariyer temposu hedeflenir. Kişisel katkı sınırlı kurallarla mümkündür; şirket yönetimi yoktur.
- **2026-09-29, kullanıcı kararları:** Üç lig kademesi ve Avrupa kupaları. Başarı finali en büyük Avrupa kupasını kazanıp bırakmaktır; kupasız sonlar mümkündür. Seçim kaybı tek başına kariyer sonu değildir.
- **2026-09-29, onaylı plan:** Öncelik başkanlık döngüsüdür. Kayıt ve masaüstü denemesi başlangıca alınır. Eski görsel işler ilgili aşamalara taşınır. Belge düzenlemesi, sonraki kod aşamalarının uygulanmış olduğu anlamına gelmez.
- **2026-09-29, mevcut uygulama:** Maç öncesi bülteni `js/lig.js` ve kadro verilerinden lig durumu, form, olası 11, eksikler ve son maçları gösterir. Bu sabit verinin kariyerle bağlantısı Aşama 3'te kurulacaktır.
- **2026-09-29, uygulanan temel (1.1):** İlk kariyer veri sözleşmesi ve TEST örnek kariyer eklendi (`js/kariyer.js`, `js/kariyer-ornek.js`, `araclar/kariyer-deneme.js`). Başlangıç görevdeki başkandır; başkan yaşı ve kişi adları test değeridir, açık kararlar kesinleşmedi. Temel, daha sonra 2.1 ile oyun ekranına bağlandı. Ayrıntı [TEKNIK_PLAN §3](TEKNIK_PLAN.md#3-kalıcı-dünya-verisi).
- **2026-09-29, uygulanan temel (1.2–1.4):** Takvim ve bir kez tamamlanan bekleyen işler (`js/takvim.js`), kuruş tamsayılı para kaydı ve gelecekteki ödemeler (`js/maliye.js`), sağlamalı ve önceki kayda dönebilen kayıt/yükleme (`js/kayit.js`, `js/depo-tarayici.js`) eklendi. Tarayıcıda kaydet → sayfayı yenile → yükle → devam et denemesi geçti. 2.1 ile ajandaya bağlandı; tutarlar ve gün başlangıcı saati TEST değeridir. Ayrıntı [TEKNIK_PLAN §3–5](TEKNIK_PLAN.md#3-kalıcı-dünya-verisi).
- **2026-09-29, kullanıcı kararı ve deneme (1.5):** Masaüstü hedefi önce yalnız Windows, paketleme Electron. `masaustu/` denemesinde oyun çevrimdışı açıldı, 3B maç günü çizildi, Türkçe karakterli yollarda kayıt yazıldı ve uygulama kapatılıp açılınca kariyer sürdü; paketlenmiş `Chairman.exe` ile de doğrulandı. Kurulum, imzalama ve Steam bağlantısı yok. Ayrıntı ve sınırlar [TEKNIK_PLAN §10](TEKNIK_PLAN.md#10-sunum-metin-ve-masaüstü).

- **2026-09-29, ilk akış kararı (2.1–2.2):** Ajandayla açılış bugünkü uygulamadır; hedef ana deneyim 2026-09-30 kararıyla mekânlara taşınmıştır. Ajandanın zorunlu/ertelenebilir/isteğe bağlı iş ve çakışma kuralları korunur. Yönetim ekibinin ilk kapsamı üç koltuktur: sayman, futbol şube sorumlusu, basın sözcüsü. Ayrıntı [OYUN_TASARIMI §4 ve §6](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo).
- **2026-09-29, 2.1 uygulama kaydı:** Ajanda kuralları `js/ajanda.js`, ekran `js/ekran-ajanda.js`, TEST haftası `KARIYER_BASLANGIC` (`js/kariyer-ornek.js`). Kariyer dosyaları `index.html`'e bağlandı. O tarihte kayıt gün sınırında `oyun-1` yuvasına yapılıyordu; 2.4 bunu gün içi komut kaydına genişletti. Maç sınırında kayıt hâlâ yoktur. Metinler, saatler ve tutarlar TEST değeridir. Ayrıntı [TEKNIK_PLAN §3–5](TEKNIK_PLAN.md#4-zamanın-ilerlemesi).

- **2026-09-29, mevcut uygulama (2.2 ilk adım):**
  - Yönetim kuralları ve karar türleri `js/yonetim.js` dosyasında. Ajandaya karar işi eklendi (`KARAR_TURLERI`); takvime yapılmadan iptal edilen iş kaydı eklendi (`isIptal`).
  - Aday profilleri metin olarak gösterilir, katkı seviyeleri gizlidir. Sonuçlar olasılıksız ve tekrarlanabilirdir.
  - Aday katkılarının oyuncuya gösterim biçimi açık karardır ([OYUN_TASARIMI §13](OYUN_TASARIMI.md#13-kapsam-ve-açık-kararlar)).
  - Ayrıntı: [TEKNIK_PLAN §3 ve §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi).

- **2026-09-30, onaylı tasarım ve belge güncellemesi:** Öncelik yaşayan kulüp deneyimidir: aydınlık oda/görüşme ortamı, aynı meseleyi takip eden telefon ve ajanda, tavsiye/kalıcı yetki devri, kontrollü antrenman gözlemi ve kararların görünür sonuçları. Ayrıntı [OYUN_TASARIMI §2](OYUN_TASARIMI.md#2-başkanın-rolü-ve-ana-döngü) ve [STIL_REHBERI §7](STIL_REHBERI.md#7-arayüz-ve-bilgi).
- **2026-09-30, onaylı zaman yaklaşımı:** Eylemle ilerleyen takvim; okuma ve düşünmede durma; sonraki önemli gelişmede durarak ilerleme; gün içinde güvenli kayıt ve dönüş özeti. Gün/sezon süreleri ölçüm hedefidir, kesin denge değildir; tek kaynak [OYUN_TASARIMI §6](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo).
- **2026-09-30, onaylı iş sırası:** Basit sezon takvimi Aşama 3'e alınır. Tam sezon eski Aşama 6'dan yeni Aşama 5'e, kapsamlı adaylık hikâyesi eski Aşama 5'ten yeni Aşama 6'ya taşınır. Temel kayıt ve okunabilirlik Aşama 2'nin kabul koşuludur; o tarihteki erken ortam sesi koşulu 2026-10-01 kararıyla kaldırıldı. Tamamlanan işler korunur; bu kararlar oyun kodunun uygulandığı anlamına gelmez.

- **2026-09-30, uygulanan (2.3–2.4) ve alınan kararlar:**
  - “İlerle” günü bitirmekten ayrı bir işlemdir: sıradaki durma noktasına gider. Gelecekteki zorunlu iş ilerlemeyi engellemez; sabah 08:00'de yalnız günün işleri çakışıyorsa durulur.
  - Saati serbest karar yalnız başkana dönen zorunlu kararlar içindir (geliş anı, son cevap anı); bütün mesajlara uygulanacak genel kural değildir. Bekleyen karar başka işe katılmayı kilitlemez.
  - Bir konuya tek mesele, gerektiği kadar bağlı iş bağlanır. Devredilen iş, görevlendirilen kişide kalır; kişi ayrılırsa başkana döner. Komutlar kariyerin kopyasında uygulanır.
  - Maç sonrası devam öne çekilmedi: kariyer maç sınırında durur; boş günler ve uzun meseleler ayrı test takvimleriyle sınanır. Mesele olayları anahtar + parametre olarak saklanır; mevcut diğer metinler dönüştürülmedi.
  - Sezon süresi hedefi zorunlu süre değildir; tekrar, karar yoğunluğu ve sıkılma noktalarıyla ölçülecek hedeftir. 30 dakikalık süre uzaması, 30 günlük ilerleme sınırı ve 09:30 haber saati TEST değeridir.

- **2026-09-30, onaylı içerik yönü ve belge güncellemesi:** Sabit kulüp geçmişi + tutarlı değişken başlangıç + koşula bağlı yazılmış olaylar + sınırlı adil belirsizlik + kalıcı hafıza. Sezon için zorunlu hikâye sırası seçilmez; önlenen kriz geri zorlanmaz, iyi yönetim rahatlık sağlar. Kurallar [OYUN_TASARIMI §3 ve §10](OYUN_TASARIMI.md#3-kulübün-geçmişi-ve-başlangıç-hikâyesi), teknik sınırlar [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi) içindedir.
- **2026-09-30, yeni öncelik:** Tamamlanan 2.3–2.4 korunur. 2.5 öncesine yeni, tamamlanmamış 2.4A eklenir. İlk içerik P01'in dar ödeme/sponsor örneğidir; sınırlı P03 2.6'da, P13'ün söz/hafıza izi 2.8'de genişler. Eski sabit oyuncu akışı yeni örnek doğrulanınca değiştirilir. [Olay kütüphanesi](OLAY_KUTUPHANESI.md) 23 tarihsel esin, 14 paket ve 6 koşullu birleşim içerir; bunlar 14 tamamlanmış özellik veya 6 sabit kampanya değildir. Bu güncelleme yalnız belgelerdir; kodun değiştiği anlamına gelmez.

- **2026-09-30, uygulanan (2.4A) ve alınan kararlar:**
  - Yeni kariyer tohumla üç TEST başlangıcından birini kurar (`sikisik`, `rahat`, `duzenli`); oyuncuya başlangıç menüsü sunulmaz. Geliştirici ve denemeler için adres parametreleri vardır (`?baslangic=`, `?sponsor=`, `?sayman=`, `?dunya=`).
  - Sponsorun erteleme talebi takvimde gizli bir dış gelişmedir; ne doğuracağı o günkü deftere bağlıdır: kasa yetmiyorsa zorunlu kriz kararı, yetiyorsa acil olmayan ertelenebilir karar. Talep hiç gelmeyebilir ya da erken teyitle önlenebilir; önlenen konu yeniden açılmaz.
  - Sponsorun gerçek durumu başlangıçta bir kez seçilir ve kaydedilir; oyuncuya dökülmez, kaynağı belli kanıtlar gösterilir. Rastlantı yalnız başlangıçta çekilir; sonuçlar seçilen yol × gerçek durum × saymanın katkısıyla olasılıksızdır.
  - Kayıt sürümü 3'tür. Eski kayıtlar için veri dönüşümü yerine sınırlı uyumluluk davranışı seçildi: eski sponsor kararları `js/uyum-sponsor.js` içinde durur ve yalnız sürüm 1–2 kayıtlarındaki işleri tamamlar (içerik sürümü 0); bu kayıtlarda yeni olay açılmaz.
  - Karşılığı olmayan sabit toplantı, röportaj, zemin turu, antrenman ve hoca görüşmesi işleri yeni kariyer yolundan çıkarıldı. Eski sabit hafta yalnız kural denemelerinin örneğidir.
  - Yoğunluk denetçisi, söz/ilişki kaydı, ekip kapasitesi ve kişisel katkı bu adımda kurulmadı. Tutarlar, süreler ve üç başlangıç TEST değeridir; normal tempoda oynanış değerlendirmesi 2.9'dadır.
- **2026-09-30, uygulanan (2.5) ve alınan kararlar:**
  - Yerleşim ve etkileşim önce `prototipler/4-aydinlik-baskan-odasi.html` ile gösterildi ve kullanıcı onayıyla oyuna bağlandı.
  - Oyun başkanın masasından görülen aydınlık odayla açılır. Gündem üç nesneden açılır: telefon (haberler, karar bekleyen konu, dönüş özeti), ajanda (günün işleri, önümüzdeki günler, kasa), dosya (mesele, bilinenler, karar). Aynı üçünün etiketli düğmesi ve klavye kısayolu vardır; nesne aramak gerekmez.
  - Haber paneli kendiliğinden açmaz: telefon yanar ve alt şeritte yazılır. Aynı anda tek panel açıktır. Açık mesele yoksa masada dosya yoktur.
  - Oda yalnız sunumdur; aynı kariyer komutlarını kullanır. Depo, açılış ve komut yolu `js/oyun-oturumu.js`'te ortaklaştı. Eski koyu ajanda `?ekran=ajanda` ile geliştirici görünümü ve akış denemelerinin kural yolu olarak kalır; oyuncuya ikinci yol olarak sunulmaz.
  - Ortam sesi kodla üretilir (WebAudio); harici ses dosyası yoktur. Ses ve yazı büyüklüğü ayarı kariyer kaydına girmez.
  - Oda renkleri, kamera, panel ölçüsü, yazı boyları ve sesler TEST değeridir.

- **2026-09-30, kullanıcı kararı (test görünümü):** Gizli değerler geliştirme ve test aşamasında görünür, yayından önce kaldırılır. Yönetici katkı seviyeleri, gizli koşullar, seçeneklerin üreteceği sonuç ve futbolcu özellikleri tek bir “Test bilgileri” ayarına bağlıdır (`js/test-gorunum.js`). Nihai üründe puan göstermeme kuralı değişmez; katkının nihai sunumu profil metnidir. Bu karar 2.2'yi kapatmayı engelleyen açık kararı çözer.
- **2026-09-30, uygulanan (2.6, 2.8) ve alınan kararlar:**
  - Tavsiye ile devir ayrıdır: tavsiyede karar başkanda kalır, kişi konuyu inceler ve görüşü 120 dakika (TEST) sonra dosyaya kaynağıyla düşer; dünya değişmez. Zayıf görüş yanıltmaz, belirsiz kalır.
  - Kapasite: bir kişi aynı anda tek iş ya da tavsiye yürütür. Kalıcı sorumluluk: tahsilat takibi saymana bırakılırsa yetkisi içindeki görüşmeler başkana sorulmadan yürür; aşan konu döner.
  - Girişim: başkan saymanla nakit takvimi ve hocayla görüşmeyi kendisi başlatabilir.
  - Acil olmayan kararlar (destek teklifi, hoca talebi) günlere yayılan cevap süresiyle gelir; bu kararlar beklerken ilerlenebilir ve ilerleme en geç son cevap anında durur. Kriz ve basın sorusu gibi kararlar ilerlemeyi önceki gibi engeller.
  - Hoca talebi yalnız bütçe kararıdır; kadro ve taktik hocada kalır. Basın yalnız yaşanmış bir sonucu sorar. Destek teklifi tek seferlik ve süreli pano hakkıyla sınırlıdır; hisse, yatırımcı ve kişisel katkı yoktur. Tek pano iki tarafa söz verilemez.
  - Söz yalnız açık taahhütten doğar; tutulması ya da bozulması gerçek kayıttan türetilir. Gazete manşeti kayıtlı olaydan seçilir ve ölçülebilir bir etkisi yoktur. Teşekkür para ya da moral puanı üretmez.
  - Kasa açığı başka yoldan kapanırsa bekleyen kriz kararı kendiliğinden düşer.
  - Bu adımda kayıt sürümü 4, içerik sürümü 2 oldu (2.7 ile kayıt sürümü 5). Sürüm 1–3 kayıtları kendi içerikleriyle sürer; sonradan eklenen paketler onlarda açılmaz.
  - Haftaya birden çok konu sığabildiği için yoğunluk arttı (sıkışık başlangıçta en çok dört mesele); tempo ve yoğunluk değerlendirmesi 2.9'dadır. Bütün tutarlar, süreler, kişiler ve metinler TEST'tir.
- **2026-09-30, kullanıcı kararı (antrenman sahnesi):** Antrenman ayrı bir mekân değildir: başkan odasındaki kapıdan balkona yürünür, masaya oturulur; gündüz bütün saha görünür, tribünler boştur, futbolcular çalışır. Antrenman kulübün kendi sahasında yapılır.
- **2026-09-30, uygulanan (2.7) ve alınan kararlar:**
  - Gözlem takvimde bir aralıktır (`gozlem: {tarih, bas, bitis}`), süre tüketen ayrı bir iş değildir. Karar gerektiren haberde ya da beklenen görüşte durur, kalan süre korunur; karar verilirken zaman ilerlemez.
  - Gözlem sürerken 15 dakikayı (TEST) aşmayan iş aralığın içinde geçer, süre iki kez harcanmaz. Daha uzun iş tam dikkat ister: seçenek kapalı gelir ve nedeni yazar; önce gözlem bırakılır.
  - Antrenman takvim işi değildir (TEST: hafta içi 15:00–17:00, maç günü yok). İzlenmezse hiçbir kayıt düşmez. En az 30 dakika (TEST) izlenirse geçmişe tek cümlelik bir not yazılır; para, moral ya da gizli bilgi kazandırmaz.
  - Saatli iş ve son cevap anı gözlemi önceden kısaltır; kimse sessizce kaçırılmaz. “İlerle” açık gözlemi kapatır.
  - Kayıt sürümü 5'tir (`gozlem` alanı). Sürüm 1–4 kayıtları açılır. Antrenman canlandırması sunumdur; antrenman simülasyonu, oyuncu gelişimi ve rapor değildir (Aşama 3.2, 8).

- **2026-10-01, onaylı ekran ve öncelik yenilemesi; yalnız belge güncellemesi:** Açılış oda olarak kalır; dosya/ajanda/telefon/ayarlar açık tonlarda tek konuya odaklanır. Dış prototip notları, renk kutuları, masalardaki çay ve yazılı maç spikeri kaldırılacaktır. Test verileri küçük simgeyle açılan bilgi kutusuna taşınacaktır. Genel Duraklat bütün sahne hareketi ve süreleri donduracaktır; maç telefonu açıkken maç duracaktır. Kapıya tıklama, doğal kalkış/adımlar, aynı stat ve daha yüksek başkan yeri kurulacaktır. Maç öncesi açık maç programında en az 10 saniye hazırlık sonrası kullanıcı “Maça geç” ile devam edecektir. Ayrıntı [OYUN_TASARIMI §2/6/11](OYUN_TASARIMI.md#2-başkanın-rolü-ve-ana-döngü), [STIL_REHBERI §5–8](STIL_REHBERI.md#7-arayüz-ve-bilgi) ve [TEKNIK_PLAN §4/10](TEKNIK_PLAN.md#4-zamanın-ilerlemesi) içindedir.
- **2026-10-01, ses ve stat kararı:** Ses sistemi, çağrıları ve ses ayarları 2.8A'da kaldırılacaktır; ana oyun/ekranlar tamamlanıp Aşama 10'a gelinene kadar ses çalışması yapılmaz. Ayrı şehir stadı 2.8D'de kaldırılacaktır; kulübün mevcut stadı yatırımla etap etap gelişir (8.3). Bu kararlar bugünkü kodun değiştiği anlamına gelmez.
- **2026-10-01, onaylı iş sırası:** Tamamlanan 2.1–2.8 ve 2.4A korunur. 2.9'dan önce yeni 2.8A–2.8F eklenir. Maç telefonunun kendi maç verisi 2.8F'de, gerçek diğer maç bağlantısı yeni 3.8'de yapılır; 5.2 bunun tam sezon performansını tamamlar. Olay kütüphanesi ve uzun kariyer yönü korunur; bu paket yeni senaryo motoru kurmaz.

Eski kararların kronolojisi Git geçmişinde korunur. Bu dosyada geçerli kararlar ve gerekli gerekçeler tutulur.

## Çalışma biçimi

Her iş çalışan, incelenebilir bir sonuçla biter. İş sırası bağımlılıkları izler; küçük doğrulama işleri gerekirse öne alınır ve nedeni yazılır. İç test için kısa dönemler kurulması, ticari oyunun uzun kariyer hedefini daraltmaz.

**Aşama 1 ve 2.1–2.8 (2.4A dahil) tamamlandı. Sıradaki geliştirme: 2.8A — oyun çerçevesini temizleme.** Yeni 2.8A–2.8F tamamlanmamıştır; tek konu ekranları ve maç günü sunumu önce kurulur, ardından 2.9'da normal oynanışın temposu, yoğunluğu ve okunabilirliği ölçülür. Açık isimler, tutarlar ve denge sayıları TEST olarak işaretlenir. Ses değerlendirmesi Aşama 10'a taşınmıştır.

İlk bütünleşik örnek: koşulları uygunsa ofiste başlayan sponsor meselesi ekibe verilir; sonraki gün antrenmanda haber gelir; yetkiyi aşan konu başkana döner ve kararın sonucu kulüpte görülür. Sorunsuz, önlenmiş ve hiç açılmayan mesele örnekleri de sınanır; bu örnek her kariyerin zorunlu açılışı değildir. Bütünleşik sunum Aşama 2 sonunda hedeflenir; ilk alt adımda bütün sahneler birden yapılmaz.

### Sonraki uygulama için çalışma çerçevesi

Claude veya başka bir geliştirme aracı “sıradaki adımı planla” isteğinde önce **2.8A**'yı ele almalı. Kodun güncel hâlini okuyup [stil rehberindeki onaylı ekran düzenlerini](STIL_REHBERI.md#onaylı-ekran-düzenleri-ve-etkileşim) ve [teknik plandaki yenileme sınırlarını](TEKNIK_PLAN.md#hedef-ekran-yenilemesi-ve-ortak-stat) kullanarak küçük uygulama planı çıkarmalı. Hangi HTML öğeleri, betik çağrıları, ses ayarları ve çay hareketleri temizlenecek; hangi geliştirici kontrolleri taşınacak; maç olayları ve eski kayıtlar nasıl korunacak açıkça gösterilir. 2.8B ve sonraki adımların kapsamı tek işe yığılmaz. Bu belge onayı oyun kodunu kendiliğinden uygulama izni değildir; sonraki kod çalışmasının kapsamı kullanıcı isteğinden alınır.

2.8A–2.8F'nin dışında: bütün 14 paket, kapsamlı seçim/adaylık, hisse veya yatırımcı sistemi, tam ilişki/hafıza sistemi, ek mekân, kapsamlı stat inşaatı, diğer lig maçlarının simülasyonu, maç sonucunu kariyere bağlama ve mevcut motoru yeniden yazma. Ortak mevcut stat ve menüler yenilenir; yeni bir dünya sistemi kurulmaz. Metinler ile denge sayıları küçük TEST tarifleri olabilir; gerçek mali/lig kuralları sessizce kesinleştirilmez.

### 2026-09-30 madde eşlemesi

| Önceki madde | Yeni yeri |
|---|---|
| 1.1–1.5 ve 2.1 | Numarası ve tamamlanma durumu korunur |
| 2.2 | Kısmi uygulama korunur; kalan işler 2.5 sonrasında 2.6 ile yürür |
| 2.3 hoca görüşmesi | 2.6 |
| 2.4 söz/ilişki ve olay zinciri | 2.3 mesele temeli ve 2.8 sonuç/hafıza |
| 2.5 sakin gözlem | 2.7 |
| 2.6 tempo denemesi | 2.9 |
| 3.1–3.6 | 3.2–3.7; önlerine 3.1 sezon takvimi temeli eklenir |
| 4.5 yetki devri | Temeli 2.6'ya alınır; anlaşmalara genişletilmesi 4.5'te kalır |
| 5.1–5.6 adaylık hikâyesi | 6.1–6.6 |
| 6.1–6.6 tam sezon | 5.1–5.6; erken yaşam döngüsü denemesi 5.7 olarak eklenir |
| 8.3/8.5 yatırım ve hafıza | Küçük ilk örnek 2.8; kapsamlı gelişim Aşama 8'de kalır |
| Aşama 10 temel kullanım kalitesi | Gün içi kayıt 2.4; okunabilirlik 2.5–2.9; 2026-10-01 kararıyla bütün ses tasarımı Aşama 10'a taşındı |

### 2026-10-01 madde eşlemesi

| Önceki iş | Güncel karşılık |
|---|---|
| Doğrudan 2.9'a geçiş | Önce 2.8A → 2.8B → 2.8C → 2.8D → 2.8E → 2.8F, sonra 2.9 |
| Erken ortam sesi/ses kontrolü | Kaldırma 2.8A; sesin tasarlanması Aşama 10 |
| Ayrı kasaba/şehir stat seçimi | Tek ortak kulüp stadı 2.8D; etaplı yatırım 8.3 |
| 5.2'nin diğer maçları üretme temeli | Dar maç günü bağlantısı 3.8; tam sezon maliyet/tutarlılık 5.2 |

## Aşama 0 — Plan ve belge düzeni

- [x] Kullanıcıyla ana tasarımı ve belge güncelleme planını kesinleştir.
- [x] Oyun tasarımı ve teknik planı ayır; ana belgeleri sorumluluklarına göre düzenle.
- [x] Mevcut uygulama, hedef sistem ve açık kararları ayır; eski çelişkileri gider.
- [x] Bağlantı, kapsam ve tutarlılık kontrolünü tamamla.

**Bitiş ölçütü:** Yeni oturum mevcut durumu, sıradaki işi ve açık kararları aynı şekilde yorumlayabiliyor.

## Aşama 1 — Kariyer temeli

**Bağımlılık:** Aşama 0.

- [x] **1.1** Kalıcı kulüp/kişi kimlikleri, tarih, görev durumu ve başlangıç verisi için küçük örnek kariyer oluştur; çizimden bağımsız oku/doğrula.
- [x] **1.2** Gün ve gün içi zaman ilerlemesini kur; bir bekleyen işi belirtilen tarihte yalnız bir kez tamamlat.
- [x] **1.3** Para hareketi ve gelecekteki ödeme için temel kayıt kur; mevcut para ile taahhütleri ayır.
- [x] **1.4** Sürümlü yerel kayıt/yükleme, önceki sağlam kayıt ve hatalı kayıt bildirimi ekle; bekleyen işin yükleme sonrası iki kez çalışmadığını doğrula.
- [x] **1.5** Hedef işletim sistemi ve paketleme için küçük deneme yap; gerekli kaynakları çevrimdışı açılışa hazırla, kayıt yolunu ve Türkçe karakterli yolları dene.

**Bitiş ölçütü:** Birkaç gün ilerleyen küçük kariyer kaydediliyor, kapatılıp aynı durumdan devam ediyor. Erken masaüstü denemesinin seçimi veya somut engeli belgelenmiş durumda.

## Aşama 2 — Yaşayan kulüpte günlük başkanlık

**Bağımlılık:** Aşama 1. Ekip koltuklarının ilk kapsamı seçildi (2026-09-29): sayman, futbol şube sorumlusu, basın sözcüsü.

- [x] **2.1** Ajanda ve kulüp durumunu göster; zorunlu/ertelenebilir işleri ve günü bitirmeyi anlaşılır yap. Tamamlanan bu prototip, yeni mekân akışının kural temelidir.
- [x] **2.2** Sınırlı aday havuzundan yönetim ekibi kur; farklı katkıları ve yetki sınırlarını bir örnek işte göster.
  - *İlk adım uygulandı (2026-09-29, TEST içerik):* Üç koltuk tanımlandı. Boş sayman koltuğu için üç aday arasından seçim yapılıyor. Perşembe sponsor ödemesi işi başkan tarafından yürütülebiliyor ya da saymana devredilebiliyor; sonuç saymanın gizli katkısına göre değişiyor, yetkiyi aşan indirim talebi başkana dönüyor.
  - *Tamamlandı (2026-09-30, TEST içerik):* Koltuklar `YONETIM_HAVUZU`'ndan kurulur (`js/baslangic.js`): sıkışık başlangıçta sayman, rahat başlangıçta basın sözcüsü seçilir. Futbol koltuğunun örnek işi hoca talebindeki tavsiye, basın koltuğunun örnek işi gazetenin sorusundaki açıklamadır. Aday katkısının sunumu kararı alındı: nihai üründe profil metni görünür, seviyeler gizlidir; geliştirme aşamasında test görünümünde görünür.
- [x] **2.3 — Mesele ve zaman temeli.** Mevcut sponsor örneğini tek kimlikli meseleye bağla; sorumlu kişi, durum, son tarih, beklenen haber ve karar geçmişini göster. Eylem süreleri ile okuma/düşünme ayrımını ve sonraki önemli gelişmede durmayı kur. Önce mevcut arayüzde küçük bir örnekle doğrula.
  - *Bitiş:* Aynı konu tekrar görev üretmiyor; rutinler ilerlerken yeni karar gerektiğinde duruluyor; zorunlu iş ve son tarih korumaları çalışıyor. Beklenen haber veya yapılabilir sonraki adım anlaşılır.
  - *Uygulandı (2026-09-30, TEST içerik):* Forma sponsoru konusu tek mesele (`js/mesele.js`): birden çok bağlı iş (karar, ekip işi, ödemeler), yürüten kişi, durum, beklenen haber ve olay geçmişi. Ajandada tek ana düğme “İlerle”: sıradaki durma noktasına gider (karar gerektiren haber, randevu, çakışan günün başı); rutin ödemeler ve ekip sonuçları arada işlenir. Başkana dönen karar saati serbesttir. Devredilen iş ertesi sabah, görevlendirilen kişinin katkısına göre sonuçlanır. Ayrıntı [TEKNIK_PLAN §3–4](TEKNIK_PLAN.md#3-kalıcı-dünya-verisi). Okuma ve düşünmede zaman durur; gerçek bir antrenman gözlemi henüz yoktur (2.7).
- [x] **2.4 — Gün içi kayıt ve dönüş.** Tamamlanan kararları ve güvenli sahne geçişlerini kaydet; mesele, bekleyen iş ve yetki durumu yüklenince sürsün. Son karar, beklenen haber ve yaklaşan tarihten kısa dönüş özeti üret.
  - *Bitiş:* Gün bitmeden kapatıp açınca son tamamlanan karar korunuyor; ödeme/karar ikinci kez uygulanmıyor. Kayıt sınırı ve varsa başarısız kayıt doğru bildiriliyor; eski kayıt davranışı doğrulanıyor. Maç ortasından kayıt bu adımın koşulu değildir.
  - *Uygulandı (2026-09-30):* Her tamamlanan komut kariyerin kopyasında uygulanıp doğrulanır (`kariyerKomut`) ve kaydedilir (`kayitOturumu`). Yazım başarısızsa “karar uygulandı, kaydedilemedi” bildirilir; yeniden kaydetme kararı tekrarlamaz. “Stada git” bilinçli istisnadır (maç sonucu kariyere bağlı olmadığı için maç sınırında kayıt yoktur; yüklenen oyuncu maç geçişini kaybetmez). Kayıttan devamda ajandada “Kaldığın yer” özeti açılır. Kayıt sürümü 2'dir; sekiz gerçek sürüm 1 kaydı (`araclar/ornekler/`) açılır, dönüşür ve oynanmaya devam eder. Doğrulama: `node araclar/kariyer-deneme.js`, `python3 araclar/akis-deneme.py`, `python3 araclar/kontrol.py`, masaüstü `node deneme.js`.
- [x] **2.4A — Değişken başlangıç ve koşula bağlı olay denemesi.** Mevcut mesele, takvim, para ve kayıt temelinde P01'in dar ödeme/sponsor örneğini kur. Paket tarifi ile kariyerdeki olay örneğini ayır; koşula göre açılma, seçenek, sonuç ve tekrar sınırı kullan. Ayrıntı [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi).
  - *İlk kapsam:* En az üç tutarlı TEST başlangıcı: ödeme tarihleri sıkışan; acil nakit baskısı olmadan mevcut anlaşmayı değerlendiren; ilgili sorunu önceden çözmüş veya o sorunu taşımayan. Sonuncusunda kriz doğmaması beklenir. Yalnız metin ve miktar değişimi yeterli değildir. Bu sayı nihai başlangıç sayısı veya bütün yolların çözülebilirlik kanıtı değildir.
  - *Karar örneği:* Koşula göre başkanın müdahalesi, mevcut saymana devretme ve geçerli başka ödeme planı farklı sonuç verebilsin. Uygun şartlarda ret/önleme veya sorunsuz sonuç bulunsun; yeni araştırma/kapasite sistemi 2.6'ya kadar kurulmak zorunda değildir. Aynı aday her koşulda aynı sonucu veya hep üstün cevabı üretmesin.
  - *Geçiş:* Yeni örnek doğrulanınca sabit TEST haftasını ve eski sponsor seçeneklerini normal Yeni kariyer yolundan çıkar; karşılığı olmayan sabit toplantı/röportaj görevlerini temizle. Rol/karar/takvim temelini, maç geçişini ve eski kayıt uyumluluğunu koru. Ayrıntılı geçiş listesi teknik plandadır; eski içerik ikinci normal oyun yolu olarak kalmaz.
  - *Bitiş:* Yeni kariyerde koşullar, gündem ve seçenekler ayrışıyor; önlenen/oluşmayan kriz zorla açılmıyor. Aynı başlangıç, seçim, içerik sürümü ve kayıtlı rastlantı ile devam tutarlı. Okuma, önizleme, ekran açma ve yükleme yeniden sonuç çekmiyor. Ödeme/karar bir kez işleniyor; yoğunluk gerçek vadeyi değiştirmiyor. Sürüm 1 ve 2 kayıtları para/geçmiş kaybı olmadan devam ediyor. Değişen kapsamın CLAUDE.md kontrolleri geçiyor; gerçek ekran akışı da sınanıyor.
  - *Sınır:* Maç sonucu bağlantısı Aşama 3'te kalır. Deneme maç sınırında bitebilir; farklı başlangıçlar ve parça parça ilerleme için geliştirici takvimleri kullanılabilir. Paket kataloğunun geri kalanı bu adımın şartı değildir.
  - *Uygulandı (2026-09-30, TEST içerik):* Üç başlangıç `js/baslangic.js`, olay katmanı `js/olay.js`, P01'in dar tarifi `js/paket-odeme.js` içindedir. Sıkışık başlangıçta sayman seçilir, isteğe bağlı nakit takvimi görüşmesi önleme imkânı verir, sponsorun haberi maaş gününden önce zorunlu karar açar (kendin görüş, saymana devret, bakım taksitini ertelet, maaşı beklet). Rahat başlangıçta aynı haber acil olmayan bir karar açar; düzenli başlangıçta mesele açılmadan tek “İlerle” ile maç gününe gelinir. Devir sonucu sponsorun gerçek durumuna ve saymanın katkısına göre değişir; hiçbir aday iki koşulda da en iyi değildir. Yetkiyi aşan teklif ve çözülemeyen açık başkana döner. Ayrıntı [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi).
  - *Doğrulama:* `node araclar/kariyer-deneme.js` (2.4A bölümleri: 260 karar yolunun tamamında kasa eksiye düşmüyor ve maç sınırına varılıyor; sekiz sürüm 1 ve altı sürüm 2 kayıt açılıp tamamlanıyor), `python3 araclar/akis-deneme.py`, `python3 araclar/kontrol.py`, `python3 araclar/kontrol.py araclar/kayit-deneme.html`, masaüstü `node deneme.js`. Masaüstü paketi yeniden üretilmedi. Normal tempoda oynayarak okunabilirlik ve karar kalitesi değerlendirmesi yapılmadı (2.9).
- [x] **2.5 — Aydınlık başkan odası.** 2.4A'daki gündemi oda içinde telefon, ajanda ve ilgili dosyayla sun; bir meseleye odaklanan açık renkli düzen kullan. Okunabilir metin ve o tarihteki plana göre temel ortam sesi/ses kontrolü eklendi; ses 2.8A'da kaldırılacak ve Aşama 10'da tasarlanacak. Önce küçük oda prototipini gösterip yerleşim/etkileşim onayından sonra oyuna bağla.
  - *Bitiş:* Oyuncu gündemi bulup konuyu açabiliyor, kapatıp ortama dönebiliyor; gerekli bilgi için nesne aramaya zorlanmıyor. Oda değişimi veya paneli yeniden açma zamanı ve karar geçmişini değiştirmiyor.
  - *Uygulandı (2026-09-30, TEST sunum):* Oda sahnesi `js/oda.js`, oda ekranı `js/ekran-oda.js`, ses `js/ses.js`, ortak oturum `js/oyun-oturumu.js`; renkler `STIL.oda` ve `STIL.kagit`. Oyun odayla açılır; telefon yeni haberde yanar, ajanda defteri günün tarihini, duvar saati oyun saatini gösterir, gün ışığı saate göre değişir. Dosya yalnız mesele varken masadadır ve karar seçenekleri dosyanın içindedir. Ayarlar: ses düzeyi/sessiz, yazı büyüklüğü (normal/büyük). “Stada git” bülteni ve 3B maçı açar. Ayrıntı [STIL_REHBERI §7](STIL_REHBERI.md#7-arayüz-ve-bilgi).
  - *Doğrulama:* `python3 araclar/akis-deneme.py` (9. bölüm: nesneye tıklama, panelde gezmenin durumu değiştirmemesi, haberin paneli açmaması, yenilemede aynı durum ve ayar, maç geçişi, düzenli başlangıç), `python3 araclar/kontrol.py` (oda, `?ekran=ajanda`, `?ekran=bulten`, `?ekran=mac`), `node araclar/kariyer-deneme.js`, kayıt denemesi sayfası, masaüstü `node deneme.js`. Ses başsız tarayıcıda duyularak doğrulanamadı; o tarihteki kulakla değerlendirme yapılmadı (artık Aşama 10), normal tempoda okunabilirlik değerlendirmesi 2.9'dadır. Dört seçenekli kararda ve büyük yazıda panel içinde kaydırma gerekir. Masaüstü paketi yeniden üretilmedi.
- [x] **2.6 — Görüşme, tavsiye ve ekip.** Hoca görüşmesi ve bütçe önceliğini ekle. Tavsiye ile yetki devrini ayır; kişi, bütçe, süre, kapasite ve başkana dönüş koşullarını belirle. Bir kalıcı sorumluluk ve başkanın başlattığı bir görüşme/araştırma örneği kur; 2.2'nin kalan işlerini tamamla.
  - *İçerik:* P01'i ekip bilgisiyle zenginleştir; P03'ün belirli katkı, süre ve görünürlük hakkıyla sınırlı bir örneğini kullan. Tam hisse/yatırımcı veya seçim sistemi kurma. Onaylanmamış katkı kurallarına ihtiyaç varsa uygulamadan önce açıkça ayır.
  - *Bitiş:* Yetki içindeki rutin adımlar ek onay istemiyor; sınır aşılınca başkana dönülüyor. İşe uygun yönetici bazı işleri daha iyi çözebiliyor; şahsen katılım her işte otomatik en iyi seçenek olmuyor. Hoca futbol kararlarının sahibi olarak kalıyor.
  - *Uygulandı (2026-09-30, TEST içerik):* Tavsiye, kapasite, kalıcı sorumluluk ve girişim `js/yonetim.js`'te; P01'e uygulanması `js/paket-odeme.js`'te. Hoca talebi `js/paket-hoca.js`, gazetenin sorusu `js/paket-basin.js`, koşullu destek (P03'ün dar örneği) `js/paket-destek.js`. Odada Dosya'dan görüş istenir, Ajanda'dan girişim başlatılır. Uygun yönetici işi başkandan iyi çözebilir (bağlantısı güçlü sayman pazarlık arayan sponsoru karşılıksız çözer; başkan giderse pano hakkı istenir); şahsen katılım her işte en iyi seçenek değildir. Ayrıntı [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi).
  - *Sınır:* Kişi modelleri ve görüşme sahnesi yoktur; görüşmeler panelde yürür. Bütçe tavanı ve süre sınırı sayısal olarak tanımlı değildir; yetki sınırı koltuk tanımındaki kurallardır. Araştırma türü girişim yalnız tavsiyeyle temsil edilir.
- [x] **2.7 — Antrenman ve telefon.** İsteğe bağlı gözlem sırasında haber alma, cevaplama, tavsiye isteme veya yönlendirmeyi dene. Mevcut ısınma görsellerinden yararlanılabilir; ayrı antrenman simülasyonunun hazır olduğu varsayılmaz.
  - *Bitiş:* Kontrollü gözlemde mesaj kararı zamanı durduruyor; uyumlu eşzamanlı işler süreyi iki kez tüketmiyor. Uzun görüşmede gözlemden ayrılınıyor; aynı mesele ofiste ve telefonda devam ediyor. Katılmamak zorunlu bilgi/ödül kaybına dönüşmüyor.
  - *Uygulandı (2026-09-30, TEST sunum ve değerler):* Kurallar `js/gozlem.js`, sahne `js/balkon.js` (oda sahnesinin dışına kurulu balkon, saha, boş tribünler, çalışan takım), yürüyüş `js/oda.js`. Önce `prototipler/5-balkon-ve-antrenman.html` gösterildi, sonra oyuna bağlandı. Telefon, ajanda ve dosya balkondan açılır.
  - *Doğrulama:* `kariyer-deneme.js` 2.7 bölümü (tek parça/parçalı gözlem aynı sonuç, kesilme ve sürdürme, kısa iş çifte sayılmıyor, uzun iş kapalı, izleyen ile izlemeyenin dünyası aynı, gözlem ortasında kaydet–yükle, sekiz gerçek sürüm 4 kaydı); `akis-deneme.py` 10. bölüm (balkona yürü, izle, telefonla kesil, dosyadan kısa karar, devam et, odaya dön, yenile).
  - *Sınır:* Hocayla ya da başka biriyle balkonda yüz yüze görüşme sahnesi yoktur. Yürüyüş ve canlandırma normal tempoda kullanıcı tarafından değerlendirilir (yenileme 2.8D, akış değerlendirmesi 2.9); ses değerlendirmesi Aşama 10'dadır. Hedef donanımda performans ölçülmedi.
- [x] **2.8 — Sonuçlar ve kulüp hafızası.** Bir söz/ilişki kaydı, önceki kararın dönüşü, ilk taraftar veya medya tepkisi ve olumlu kulüp anı ekle. Tamamlanan küçük bir iş/yatırımın ya da tutulmuş sözün izini ortamda göster; daha sonraki tesis sisteminin tamamını burada kurma.
  - *İçerik:* P13'teki küçük söz/teşekkür örneği yaşanmış olaydan doğsun. Para harcayıp günlük moral toplama döngüsü veya her kutlamanın arkasından kriz üretme kuralı kurulmasın.
  - *Bitiş:* Oyuncu sonucun hangi karardan geldiğini anlayabiliyor; ilgili insanlar ve geçmiş hatırlanıyor. Görünür değişim gerçekten kaydedilmiş olaya dayanıyor, yükleme sonrası korunuyor.
  - *Uygulandı (2026-09-30, TEST içerik):* Söz kaydı, haberler ve izler `js/soz.js`'te. Sözler: hocaya kamp ödemesi (hafta içinde tutulur), personele geciken maaş günü, sponsora ve destekçiye pano. Cuma günü Demirkapı Postası'nın manşeti o haftanın kayıtlı olayından ve verilen cevaptan seçilir. Sıkışma atlatılıp maaş gününde yattıysa personelden kısa teşekkür gelir (P13'ün dar örneği). Odada izler: masada gazete ve teşekkür kartı, pencerede tribün çatısında iskele (bakım taksiti ödendiyse), duvarda pano sözünün notu.
  - *Doğrulama (2.6 ve 2.8 birlikte):* `node araclar/kariyer-deneme.js` (yeni bölümler; bütün içerikle 5.800'den fazla karar yolu, başlangıç başına 1.200 yoldan sonra örnekleme: kasa eksiye düşmüyor, her yol maç sınırına varıyor; sürüm 1, 2 ve 3 örnekleri açılıp kendi içerikleriyle tamamlanıyor), `python3 araclar/akis-deneme.py` (odada test anahtarı, girişim, görüş isteme, basın sorusu, gazete, sözler, izlerin yenilemede korunması), `python3 araclar/kontrol.py` (oda, ajanda, bülten, maç, kayıt denemesi), masaüstü `node deneme.js`. Masaüstü paketi yeniden üretilmedi. Normal tempoda elle oynanış ve yoğunluk değerlendirmesi yapılmadı (2.9); o tarihteki ses değerlendirmesi de yapılmadı, artık Aşama 10'dadır.
- [ ] **2.8A — Oyun çerçevesini temizleme.** `index.html` dış başlık/notlarını, alt açıklamaları ve renk kutularını kaldır; açılış başkan odası olarak kalsın. Oda ve maç masasındaki çayı, buharı ve içme hareketlerini temizle. Ses betiğini, yükleme/çağrı/zamanlayıcılarını ve ses ayarlarını kaldır; bu aşamadan Aşama 10'a kadar ses ekleme. Yazılı maç spikeri/radyo satırını ve yalnız ona ait metin yolunu kaldır. Diğer prototip araçlarını küçük Geliştirici alanına taşı; satır içi TEST metinlerini küçük, gerektiğinde açılan bilgi kutusuna taşıma temeli kur.
  - *Bitiş:* Oyun temiz oda çerçevesiyle açılıyor; ses çalışmıyor, çay ve yazılı spiker yok. Maç olayları, gol tepkileri ve istatistikler çalışıyor; kaldırılmış HTML öğelerine erişim hatası yok. Mevcut kayıt/ayarlar yeni kariyer gerektirmeden açılıyor. Ekran, akış ve etkilenen kariyer/masaüstü kontrolleri [CLAUDE.md](CLAUDE.md) uyarınca tamamlanır; test verisinin son yerleşimi 2.8C'de sınanır.
- [ ] **2.8B — Genel duraklatma.** Oda, yürüyüş, balkon/antrenman, program ve maç için tek duraklatma yönetimi kur. Elle duraklatma ve maç telefonu gibi nedenleri ayrı tut; bütün motor/sahne hareketi ve çalışan sayaçları dondur. Mevcut bilgide gezinmeye izin ver, süre ilerleten/dünyayı değiştiren komutları engelle. Gözlemde görünen zaman ile gerçek kariyer/kayıt durumunu eşleştir; yalnız saat animasyonunu dondurma.
  - *Bitiş:* Kalkışın/adımın, antrenmanın ve maçın ortasında durdurup beklemek durum değiştirmiyor. Devamda zaman sıçramıyor, olay/ödeme iki kez uygulanmıyor. Duraklatma nedenleri birbirini kaldırmıyor; maç telefonu ve 10 saniyelik program sayacının bütünleşik kontrolleri eklendikleri 2.8F/2.8E adımlarında tamamlanıyor. Antrenman durma noktası ve kayıttan devam [TEKNIK_PLAN §4](TEKNIK_PLAN.md#hedef-genel-duraklatma-ve-gözlemin-gerçek-zamanı) kabul örneklerini geçiyor.
- [ ] **2.8C — Başkanlık ekranları.** Önce tek dosya düzenini kur; ardından ajanda, mesajlar ve ayarları aynı açık, okunabilir dilde yenile. Dosyada önceki/sıradaki, açık/cevap bekleyen/takipte sayaçları, kısa sonuç ve ayrı arşiv olsun. Ajanda randevu ve son tarihlere odaklansın; finans ilgili dosya/saymanda erişilsin. Telefon tek konuşmayla ilgilenmeyi ve bağlı dosyadan aynı konuşmaya dönüşü sağlasın. Ayarlar sade bölümlerle ve ses seçeneği olmadan açılsın; TEST verisi küçük simge/bilgi kutusunda kalsın. Geliştirici alanına “Görüntüyü kaydet” ekle.
  - *Bitiş:* Normal/büyük yazıda sakin ve yoğun başlangıçlar okunabiliyor; bilinen maliyet/son tarih/kritik risk saklanmıyor. Yeni haber okunan dosyayı değiştirmiyor, karar otomatik sonraki dosyaya geçirmiyor. Gezinti zamanı/sonucu değiştirmiyor; mesaj–dosya–geri bağlamı korunuyor. Finansın taşınması ödeme/teklif tarihini gizlemiyor. Fare ve klavyeyle menü/test kutusu erişimi ve boş durumlar inceleniyor.
- [ ] **2.8D — Ortak stat ve mekân hareketi.** Ayrı şehir stadını, seçicisini ve ona ait canlı uygulama yollarını kaldır. Oda penceresi/balkon/ev sahibi maçı tek stat tarifini kullansın. Kapı tıklanabilir olsun; balkon düğmesi kaldırılsın, klavye erişimi sürsün. Doğal kalkış, yönelme, adım ve oturma hareketlerini kur. Maç başkan koltuğunu/masasını gerçek tribünde daha yükseğe taşı; altında sıralar görünsün.
  - *Bitiş:* Aynı saha, tribün ve yapı iki görünümde tanınıyor; değişen yalnız saat/ışık/doluluk/etkinlik. Şehir stadı oyun seçeneği veya tarif olarak dönmüyor; eski URL tercihi güvenli ortak varsayılana düşüyor. Yürüyüş kayma hissi vermiyor, hareket azaltma ve Duraklat çalışıyor. Yeni açı saha, eller ve dürbünle inceleniyor. İnşaat ekonomisi bu işin parçası değildir; gelişim 8.3'tedir.
- [ ] **2.8E — Maç programı.** Yoğun koyu bülteni açık tonlarda kısa programla değiştir: karşılaşma kapağı, isteğe bağlı kadro/lig sayfaları, kodla çizilmiş küçük stat resmi. En az 10 saniye etkin hazırlık ve gerçek kaynak hazır olma koşulundan sonra “Maça geç” etkinleşsin; geçiş oyuncunun eylemiyle olsun.
  - *Bitiş:* Programda maç/tören/takvim ilerlemiyor; sayfa değişimi sayacı sıfırlamıyor, otomatik maça geçilmiyor, sahte yükleme yüzdesi yok. Duraklat ve büyük yazı çalışıyor. Kaynak hazır değilse erken geçiş olmuyor; hata anlaşılır gösteriliyor. Gerçek maç günü verisi henüz yoksa mevcut TEST veri dürüstçe kullanılıyor.
- [ ] **2.8F — Maç telefonu.** Masadaki telefon tıklanınca Mesajlar ve Canlı Skor uygulamaları açılsın. Kendi maçına tıklayınca gerçek motor istatistikleri görülsün. İlk maça özgü mesajlar boş olabilir; mevcut kariyer mesajları silinmez. Telefon açıkken maç ve çevresi durur; kapanınca başka duraklatma nedeni yoksa aynı andan sürer.
  - *Bitiş:* Telefon ön plan kamerasına uygun tıklanıyor; fare/klavye aç-kapa ve uygulama geri dönüşü çalışıyor. Skor, dakika ve istatistik aynı motor anına ait; olmayan veri uydurulmuyor. Gol, devre arası ve maç sonunda aç-kapa olay/sonucu tekrar üretmiyor. Diğer lig maçları 3.8'e kadar açık veri-eksikliği durumudur; telefon için başka maç sistemi peşinen kurulmaz.
- [ ] **2.9 — Günlük akışın sınanması.** 2.8A–2.8F sonrasında önce birkaç günlük tek meseleyi, sonra sakin/olağan/yoğun günleri içeren bir haftayı oyna. [Tempo hedefleriyle](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo) gerçek süreyi, tekrarları, kesintileri, kararların anlaşılmasını ve yetki devrinin faydasını değerlendir.
  - *Tekrar oynama:* Aynı küçük dönemi farklı başlangıç ve kararlarla karşılaştır; temkinli, büyüme odaklı ve yetki devreden yaklaşımların koşullara göre ayrışmasını incele. Video veya önceki oyundan öğrenilmiş sabit cevabın her koşulu çözmediğini, başarının gerçek rahatlık ürettiğini ve önlenen sorunun geri zorlanmadığını değerlendir. Otomatik tutarlılık denemesi normal tempoda oynama yerine geçmez.
  - *Bitiş:* Kısa oturumda mesele ilerliyor; yoğun gün bölünebiliyor; iyi yönetim rahat dönem üretebiliyor. Yeni dosya/ajanda/telefon düzeni, yazı/hareket seçenekleri, Duraklat ve dönüş özeti kullanılabilir. On saniyelik maç programı, doğal yürüyüş ve yüksek maç açısı kullanıcıyla incelenir. Eksik örnekler ve ölçüm sonuçları yazılır; yalnız toplam süreye bakılarak aşama kapatılmaz. Ses bu aşamanın kabul koşulu değildir.

**Uygulama sırası:** 2.2–2.8 tamamlandı → **2.8A → 2.8B → 2.8C → 2.8D → 2.8E → 2.8F → 2.9**. 2.8 geçmişte 2.7'ye bağlı olmadığı için öne alındı (kullanıcı kararı, 2026-09-30); yeni ekler 2026-10-01 onayıdır. Her alt adım kendi kontrolüyle tamamlanır; bir sonrakinin gerektirdiği dar bağlantı kurulabilir ama bütün paket tek uygulama sayılmaz. Başlangıç görevdeki TEST başkanı olabilir.

Bu aşamada kariyer maç sonucu uydurulmaz; ajanda maç sınırında durabilir. Tam maç bağlantısı Aşama 3'tedir.

**Bitiş ölçütü:** Ofiste başlayan mesele ekibe veriliyor, antrenmanda gelen haber aynı konuyu sürdürüyor, yetkiyi aşan konu karara bağlanıyor ve sonucu kulüpte görülüyor. Gün içinde güvenle bırakıp devam edilebiliyor; sakin ve yoğun günler farklı hissediliyor.

## Aşama 3 — Futbol ve yönetimin bağlanması

**Bağımlılık:** Aşama 2. İlk takvim için seçilmiş kurallar veya açıkça etiketlenmiş TEST tarifi gerekir; kesin lig formatı bu örnekten türetilmez.

- [ ] **3.1** Basit fikstür, maç kimlikleri, sezon ve transfer dönemi tarihlerini kur; yaklaşan maçlar ve bilinen mali yükümlülükler aynı takvimde görülsün. Tam sezon geçişi 5.1'de tamamlanır.
- [ ] **3.2** Gizli özelliklerden kaynağı/tarihi/belirsizliği olan rapor üret; yetenek sayısı/yıldızı göstermeden karar verilebildiğini kontrol et.
- [ ] **3.3** Hocanın bilgisi ve tercihleriyle kadro/taktik seçiminin ilk sürümünü kur.
- [ ] **3.4** Kariyerin kadro ve koşullarını mevcut Match girdisine dönüştür.
- [ ] **3.5** Maç sonucunu kariyere kimliğiyle yalnız bir kez uygula; istatistik ve geçmiş kaydını bağla. Maç öncesi/sonrası güvenli kayıt sınırlarını doğrula.
- [ ] **3.6** Tohum tutarlılığını, izleme hızının etkisini ve görüntüsüz maçların maliyetini ölç.
- [ ] **3.7** Birkaç haftalık yönetim bölümünü maçlarla tamamla; maç günü süresini ve mevcut atlama seçeneklerini ağır kariyer temposuyla değerlendir. Aynı olayların tekrarı, sonuçların yeni gündeme dönüşmesi ve kısa oturumdan devam da sınanır.
  - P12 hoca değerlendirmesinin erken örneği gerçek rapor/sonuçlardan doğabilir. Hikâye amacıyla skor değiştirilmez; kupa tabanlı P10 ilgili kupa sistemi hazır olana kadar açılmaz.
- [ ] **3.8 — Gerçek diğer maçlar ve canlı skor bağlantısı.** 2.8F telefonu ile 3.1/3.4–3.6 fikstür, maç kimliği, kadro/girdi ve bir kez sonuç temellerini kullan. Aynı maç gününün diğer karşılaşmalarını görüntüsüz üret; kendi maçının ortak oyun zamanına göre gerçek skor/dakika/durumunu Canlı Skor'a ver. Farklı başlangıç saatleri, duraklatma, sonuç kaydı ve yeniden açılış tutarlı olsun. Tam sezon işlem maliyeti ve bütün fikstür 5.2'de genişler.
  - *Bitiş:* Rastgele arayüz skorları yok; aynı kimlik/tohum aynı sonucu veriyor. Telefon/elle duraklatmada diğer maçların gösterilen zamanı da sabit. Tekrar açma maçı yeniden çekmiyor veya sonucu iki kez uygulamıyor; çalışma arayüzü kilitlemiyor. Kadrosu/verisi olmayan kulüp hazır sayılmıyor; dar TEST fikstürü açıkça etiketleniyor.

**Bitiş ölçütü:** Hoca ve kadro kararları sahaya giriyor; maç sonucu yeni gündem ve geçmiş üretiyor. Kayıt yükleme sonucu tekrar uygulamıyor.

## Aşama 4 — Transfer, sözleşme ve mali anlaşmalar

**Bağımlılık:** Aşama 3. Kişisel katkı ve ilk mali kurallar seçilmiş olmalı.

- [ ] **4.1** Sözleşmeler, maaşlar, taksitler, primler ve sponsor ödeme takvimini kur; saymanın değerlendirmesi mevcut nakit ile gelecek ödeme yükünü ayırsın, belirsiz gelir kesin para sayılmasın.
- [ ] **4.2** Bir transferi aynı mesele içinde araştırma, temas, karşı teklif ve imzayla bitir; basit/sorunsuz yol da çalışsın. Kaçan transfer sonrası alternatif arayışı ve anlaşmadan çekilmenin sonuçlarını dene.
- [ ] **4.3** Menajer talebi, rakip teklif ve sızıntı gibi koşula bağlı dallar ekle; aynı olayın durmadan tekrarlanmasını önle.
- [ ] **4.4** Sponsor görüşmesi ve sınırlı kişisel katkıyı mali kayıtlarla bağla.
- [ ] **4.5** Aşama 2'deki yetki devrini transfer ve mali anlaşmalara genişlet; bütçe/süre sınırları ve önemli eşikte başkana dönüş ortak kurallarla çalışsın.
- [ ] **4.6** Geciken gelir veya artan giderin birden çok güne yayılan etkisini ve yeniden planlamayı dene; sürekli kriz, açıklanamayan çıkmaz ve kolay sınırsız para yollarını değerlendir. Başarısızlığın bedeli ve verilen sözler korunsun.
  - P01/P03'ü gerçek sözleşmelerle genişlet; P07'nin satış/elde tutma örneğini yalnız mevcut oyuncu ve transfer sistemiyle bağla. Katalogdaki altyapı geçmişi veya tam yatırımcı sistemi hazır varsayılmaz.

**Bitiş ölçütü:** Anlaşmalar yalnız konuşma sonucu olmaktan çıkıp kulübün gelecekteki parasına, kadrosuna ve ilişkilerine işleniyor.

## Aşama 5 — Bir tam sezon

**Bağımlılık:** Aşama 4. İlk lig formatı ve sezon takvimi seçilmiş olmalı. Kapsamlı adaylık hikâyesi bu aşamanın koşulu değildir; görevdeki TEST başkanıyla sınanabilir.

- [ ] **5.1** Aşama 3'teki fikstür/takvim temelini diğer kulüpler, puan durumu ve transfer dönemleriyle tamamla; sezon geçişini kur.
- [ ] **5.2** 3.8'deki diğer maç/canlı skor temelini bütün sezon ve fikstüre genişlet; arayüzü kilitlemeden toplam maliyeti, puan tablosunu ve sonuç tutarlılığını ölç. Aynı maç kimliği yeniden simüle edilmez veya ikinci kez uygulanmaz.
- [ ] **5.3** Ev/deplasman kimliklerini, taraftar dağılımını ve başkan bölümündeki komşu kişileri bağla.
- [ ] **5.4** İlk taraftar/medya tepkilerini sezon ölçeğine genişlet; medya/TV, hakem-federasyon gündemi ve rakip başkan ilişkilerini sezon olaylarına bağla.
- [ ] **5.5** Bilet, doluluk ve yayın/sponsor gelirlerini takvime bağla; ekonomik şartların ilk etkilerini ekle.
- [ ] **5.6** Sezonu baştan sona oyna; dönem sonu ödemeler, sözleşmeler, geçmiş ve yeni sezon hazırlığını doğrula. Günlük akışın tekrarını ve sezon süresini ölç; yalnız hızlandırılmış deneme tempo onayı sayılmaz.
  - Farklı başlangıçları sezon ölçeğinde karşılaştır; olayların bazı kariyerlerde hiç oluşmamasını, zor dönem sonrası toparlanmayı ve iyi yönetimin azalttığı iş yükünü değerlendir. P10/P11 yalnız ilgili kupa/kademe kuralları ve gerçek sportif sonuçlar hazırsa açılır; bunlar için sahte başarı üretilmez.
- [ ] **5.7** Küçük geliştirici örneklerinde kişinin ayrılması/emekliliği, yerine yeni kişi gelmesi ve sezonlar arası kulüp/kademe değişimini sınayarak uzun kariyerin veri temelini doğrula. Seçilmemiş kurallar TEST diye işaretlenir; kapsamlı yaşam döngüsü Aşama 7'de, üç lig ve gelişim Aşama 8'de tamamlanır.

**Bitiş ölçütü:** Bir sezon boyunca hem maç hem yönetim ilerliyor; son tarihler, para ve sonuçlar tutarlı kalıyor. Yeni sezona ve küçük dünya değişimlerine kayıt bozulmadan geçiliyor; sakin dönem ve toparlanma yolları oynanabiliyor.

## Aşama 6 — Taraftarlıktan adaylığa hikâye

**Bağımlılık:** Aşama 5. Kulüp geçmişi ve ilk seçim kuralları seçilmiş olmalı. Temel kişiler ve kulüp kimliği daha önce hazırlanabilir; burada kapsamlı giriş tamamlanır.

- [ ] **6.1** Kulüp/şehir geçmişini ve tekrar karşılaşılacak temel kişileri tamamla; 2.4A'nın dar örneğini devralınan koşulların tutarlı birleşimlerine genişlet. Temel gerçekleri adaylıktan önce kur; sezonun olay sırasını yazma. Değişken koşullar sabit kimlik/geçmişle çelişmesin.
- [ ] **6.2** Tribün, gazete, çevreyle görüşme ve adaylığa davet sahnelerini kur; oyuncuya girişte anlamlı seçimler ver.
- [ ] **6.3** Adaylık açıklaması, yönetim havuzu, ekipçe vaat hazırlama ve rakip aday karşılaşmaları ekle.
- [ ] **6.4** Röportaj, hazırlıksız yakalanma ve seçim günü akışını kur; ilk seçim çoğunlukla ulaşılabilir olsun fakat kaybetme yolu bulunsun.
- [ ] **6.5** Nadir süreli cevap, süre dolması ve okuma/flaş/sarsıntı seçeneklerini ilgili sahnelerde birlikte dene; erken aşamadaki okunabilirlik ve ayar temelini kullan.
- [ ] **6.6** Kazanma ve kaybetme geçişlerini kaydet; görev dışı takip için temel giriş sun. Uzun görev dışı yıllar Aşama 7'de tamamlanır.
  - P02 vaat ve P14 destek ittifakı örneklerini gerçekten verilmiş sözler ve seçilmiş seçim kurallarıyla bağla. Girişteki aynı sahne dizisi veya kaçınılmaz transfer başarısızlığı zorunlu olmaz.

**Bitiş ölçütü:** Gerçek oyun başlangıcından kampanyaya ve seçimin iki sonucuna gidiliyor. Seçilen ekip ve verilen vaatler sınanmış sezon döngüsüne taşınıyor.

## Aşama 7 — Uzun kariyer, görev kaybı ve yaşlanma

**Bağımlılık:** Aşama 6. Yaş modeli ve kupasız kariyer sonlarının ilk şartları seçilmiş olmalı.

- [ ] **7.1** Tekrar seçimde görev geçmişini, vaatleri ve rakipleri kullan.
- [ ] **7.2** Görev kaybında yetkileri kaldır; yeni yönetimin kulübü yönetmesini ve erişilebilir önemli gelişmelerde duran daha hızlı takip takvimini çalıştır. Yeni yönetimin başarısızlığı veya eski başkanın dönüşü garanti olmasın.
- [ ] **7.3** Kulis, açıklama, farklı koltuktan maç izleme ve yeniden adaylığa hazırlanmayı ekle.
- [ ] **7.4** Başkanın yaşlanmasını, tecrübesini ve ekip ihtiyacını zamanla değiştir; kullanıcının seçimini rastgele değiştirme.
- [ ] **7.5** 5.7'de sınanan temel üzerinden insanların geçmişini, ayrılmasını, emekliliğini ve yerine yenilerinin gelmesini kariyer ölçeğine genişlet.
- [ ] **7.6** Kupasız son koşullarını ve geçmişe göre kapanışın temelini kur; görev kaybıyla karıştırma.
- [ ] **7.7** Birkaç seçim döngüsünü geliştirici hızında ve seçilen bölümleri normal tempoda doğrula.

**Bitiş ölçütü:** Aynı dünya görevde ve görev dışında sürüyor; yeniden adaylık, kuşak değişimi ve olası kariyer sonu kayıttan devam edebiliyor.

## Aşama 8 — Kulübün büyümesi

**Bağımlılık:** Aşama 7. Üç kademe arasındaki geçişler ve alt sınır seçilmiş olmalı.

- [ ] **8.1** Üç ligin kulüp kimliklerini, yükselme/düşme ve sezon geçişlerini tamamla.
- [ ] **8.2** Altyapıdan yeni oyuncu, gelişim, sakatlık sonrası dönüş ve yaş etkilerini uzun kariyere bağla.
- [ ] **8.3** 2.8'in küçük görünür izi ve 2.8D'nin ortak stat temelini kapsamlı tesis/stat yatırımına genişlet. Başlangıçtaki kendi stadın etap etap gelişsin: maliyet, takvim, bakım, kapasite ve tamamlanan iş görüntüye yansısın. Lig atlayınca hazır şehir stadına geçilmez; balkon ve maç görünümü aynı yatırım durumunu kullansın.
- [ ] **8.4** Kulüp büyüdükçe kadro, yönetim havuzu, sponsorluk ve kamuoyu ölçeğini değiştir.
- [ ] **8.5** Erken hafıza ve gözlem örneklerini odalardaki kupalar, fotoğraflar ve kişisel geçmişle genişlet; isteğe bağlı antrenman ve kulüp ortamlarını geliştir.
  - P04/P06 tesis ve topluluk desteği, P08 yetiştirme, P09 geri dönüş ve P11 büyüme örneklerini hazır sistemlerle genişlet. P09 için kişinin kulüple bağı ve ayrılışı gerçekten bulunmalı; her kariyere zorunlu efsane dönüşü eklenmez.

**Bitiş ölçütü:** Kulüp ilerliyor veya geriliyor; insanlar ve mali yapı bu değişimi taşıyor. Gelişim ve yatırım otomatik başarı garantisi vermiyor.

## Aşama 9 — Avrupa ve finaller

**Bağımlılık:** Aşama 8. Kupa formatları, katılım şartları ve başarı finalinin özel durumları seçilmiş olmalı.

- [ ] **9.1** Avrupa kupaları, dış rakipler ve yabancı oyuncu kaynaklarının gerekli temsilini kur.
- [ ] **9.2** Büyük Avrupa statları, deplasman ortamları ve başkan ilişkilerini ekle.
- [ ] **9.3** Üst ligde doğan Avrupa hayalini ve bırakma hedefini hikâyeye bağla.
- [ ] **9.4** Yalnız en büyük kupanın uygun kariyer sonucuyla başarı finalini tetiklemesini doğrula; küçük kupa ve görev dışı durumları ayrı değerlendir.
- [ ] **9.5** Kutlama, dönüş, veda ve geçmişe göre farklılaşan kupasız finalleri tamamla.
- [ ] **9.6** Kupaya giden birden fazla zor ama mümkün yolu test et; yapay rakip güçlendirmesi ve açıklanamayan engeller kullanma.
  - Olaylar Avrupa başarısının mali/insani sonuçlarını işler; kura veya skor senaryo gereği zorlanmaz. Kütüphanedeki birleşimler zorunlu final yolları sayılmaz; sınırlı testler her başlangıç ve karar dizisine başarı garantisi vermez.

**Bitiş ölçütü:** Kariyerin başarı ve başarısızlık yolları tamamlanabilir; final geçmişi yansıtır ve aynı kayıtta tekrar tetiklenmez.

## Aşama 10 — Ürünü tamamlama

**Bağımlılık:** Ana kariyer yolları ve ekranların çalışması. Gün içi kayıt, temel okunabilirlik, hareket seçenekleri ve dönüş özeti erken aşamalarda sınanır; burada bütün ürün ölçeğinde tamamlanır. **Bütün ses tasarımı bu aşamadadır (2026-10-01 kararı); önceki aşamalarda ses eklenmez.**

- [ ] Olay ve karakter çeşitliliği, tekrar kontrolü, ekonomi/seçim/Avrupa dengesi ve uzun oturum testleri.
- [ ] İlk aydınlık kulüp sahnelerinden sonra kapsamlı hava/saat değişimleri ve gölgeler; ayakların yere basması; VAR incelemesinin sunumu; ikinci yarı kenar ısınması.
- [ ] Yakın seyirciler, yüz/atkı ayrıntıları, erken ayrılma, tezahürat ve koreografi; sesle uyum.
- [ ] Ses tasarımını bu aşamada kur: oda/balkon ortamı, bildirim, tribün, düdük ve tören; ses/sessiz ayarları ve okunabilir görsel karşılıkları birlikte tasarlanır. Konuşma/seslendirme kapsamı ayrıca değerlendirilir. Sürekli baskı ve tekrarlayan uğultu normal tempoda dinlenerek sınanır.
- [ ] Erken ayar ve okunabilirlik temelini bütün sahnelere uygula; süreli karar erişilebilirliği ve desteklenecek dil kapsamını tamamla.
- [ ] Dolu büyük statlar, arka plan maçları, uzun kariyer kayıt boyutu ve hedef donanım performansı.
- [ ] 2.8A/2.8C'de ayrılan geliştirici panelini, TEST bilgi kutularını ve deneme yollarını yayın paketinden çıkar; ekonomiyle yönetilen değerler gerçek sistemden gelsin.
- [ ] Masaüstü paketi, çevrimdışı çalışma, güncelleme/kayıt uyumluluğu ve seçilen Steam özelliklerini tamamla.
- [ ] Mağaza anlatımını çalışan sürümden oluştur; fiyat, yayın ve dağıtım kararlarını kullanıcıyla kesinleştir.

**Bitiş ölçütü:** Hedeflenen kariyer yolları tamamlanıyor; kayıtlar, paket ve içerik uzun oyunlarda güvenilir. Yayın yalnız doğrulanmış kapsamla yapılır.

## Açık kararların takibi

Oyun kararlarının listesi ve son karar tarihleri [OYUN_TASARIMI.md](OYUN_TASARIMI.md) içindedir. Platform, kayıt ayrıntıları ve uygulama tercihleri [TEKNIK_PLAN.md](TEKNIK_PLAN.md) içinde açık olarak işaretlidir. Bir karar alındığında ana belgesine işlenir ve yukarıdaki güncel karar özetine kısa, tarihli kayıt eklenir.

Kesin para tutarları, olay aralıkları, başarı olasılıkları ve yaş etkileri oynanış testi gerektirir. Planlanmış olmak tamamlanmış olmak değildir; yalnız uygulanıp doğrulanan işler işaretlenir.
