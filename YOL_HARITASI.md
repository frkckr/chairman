# Chairman — yol haritası

Son güncelleme: 2026-09-29. Bu dosya iş sırasının ve tamamlanma durumunun ana kaynağıdır. Oyun kuralları [OYUN_TASARIMI.md](OYUN_TASARIMI.md), mimari yaklaşım [TEKNIK_PLAN.md](TEKNIK_PLAN.md), sunum kuralları [STIL_REHBERI.md](STIL_REHBERI.md) içindedir.

## Şu an neredeyiz?

Çalışan ürün bir maç günü prototipidir. Aşağıdaki kariyer aşamaları henüz uygulanmamıştır.

- [x] Maç motoru '99 sahnesine bağlı; maç baştan sona oynanıyor.
- [x] Başkan bakışı, dürbün, başkanın elleri/masası ve olaylara tepkiler var.
- [x] Kadro verisi, tohumlu maç mantığı, top fiziği, oyuncu kararları ve topsuz oyun var.
- [x] Taç, korner, aut, faul, kart, ofsayt, oyuncu değişikliği, top toplayıcılar ve uzatma sunumu var.
- [x] Isınma, çıkış, tören, tokalaşma, fotoğraf, yazı tura, devre arası ve maç sonu akışı var.
- [x] İki stat tarifi var: 3. Lig kasaba ve 1. Lig şehir. Avrupa arenası şu an mevcut değil.
- [x] Zemin, seyirci doluluğu, koltuklar ve tribün tepkilerinin görsel temeli var; değerler geçici deneme panelinden geliyor.
- [x] Tarayıcı kontrolü ve görüntüsüz maç ölçüm araçları var. Her ortamda bağımlılıklarının hazır olduğu varsayılmaz.
- [x] Sabit lig/kadro verisiyle çalışan maç öncesi bülteni var: lig durumu, form, olası 11'ler, eksikler ve son maçlar; “İlerle” ile maç gününe geçiliyor.
- [ ] Kalıcı kariyer, kayıt, ekonomi, seçim, yönetim, sezon ve Avrupa sistemleri.
- [ ] Ticari masaüstü paketi ve uzun kariyer doğrulaması.

## Güncel karar özeti

- **2026-09-26/27, geçerli:** Görseller kodla üretilir. Mevcut '99 görünümü, karakterin gözünden maç izleme ve kurgusal kulüp/kişi kimlikleri korunur. Reddedilen konsept denemeleri ürüne alınmaz.
- **2026-09-29, geçerli:** Proje adı Chairman; mevcut kulüp Demirkapı SK. Nihai kimlik açık karar.
- **2026-09-29, kullanıcı kararları:** Türkiye, Türkçe ilk içerik, tek kulüp, taraftar iş insanından adaylığa hikâye, tekrarlanan seçimler ve görev dışında yeniden adaylığa hazırlanma dönemi.
- **2026-09-29, kullanıcı kararları:** Yetenek puanları görünmez; insanlar ve başkan yaşlanır. Uzun oyun günleri ve ağır kariyer temposu hedeflenir. Kişisel katkı sınırlı kurallarla mümkündür; şirket yönetimi yoktur.
- **2026-09-29, kullanıcı kararları:** Üç lig kademesi ve Avrupa kupaları. Başarı finali en büyük Avrupa kupasını kazanıp bırakmaktır; kupasız sonlar mümkündür. Seçim kaybı tek başına kariyer sonu değildir.
- **2026-09-29, onaylı plan:** Öncelik başkanlık döngüsüdür. Kayıt ve masaüstü denemesi başlangıca alınır. Eski görsel işler ilgili aşamalara taşınır. Belge düzenlemesi, sonraki kod aşamalarının uygulanmış olduğu anlamına gelmez.
- **2026-09-29, mevcut uygulama:** Maç öncesi bülteni `js/lig.js` ve kadro verilerinden lig durumu, form, olası 11, eksikler ve son maçları gösterir. Bu veri henüz kalıcı kariyer kaydı değildir; Aşama 1 ve 3'te yeni yapıya bağlanacaktır.
- **2026-09-29, mevcut uygulama (1.1):** İlk kariyer veri sözleşmesi ve TEST örnek kariyer eklendi (`js/kariyer.js`, `js/kariyer-ornek.js`, `araclar/kariyer-deneme.js`). Başlangıç görevdeki başkandır; başkan yaşı ve kişi adları test değeridir, açık kararlar kesinleşmedi. Oyunda henüz görünmez. Ayrıntı [TEKNIK_PLAN §3](TEKNIK_PLAN.md#3-kalıcı-dünya-verisi).
- **2026-09-29, mevcut uygulama (1.2–1.4):** Takvim ve bir kez tamamlanan bekleyen işler (`js/takvim.js`), kuruş tamsayılı para kaydı ve gelecekteki ödemeler (`js/maliye.js`), sağlamalı ve önceki kayda dönebilen kayıt/yükleme (`js/kayit.js`, `js/depo-tarayici.js`) eklendi. Tarayıcıda kaydet → sayfayı yenile → yükle → devam et denemesi geçti. Oyun ekranına bağlı değildir; tutarlar ve gün başlangıcı saati TEST değeridir. Ayrıntı [TEKNIK_PLAN §3–5](TEKNIK_PLAN.md#3-kalıcı-dünya-verisi).
- **2026-09-29, kullanıcı kararı ve deneme (1.5):** Masaüstü hedefi önce yalnız Windows, paketleme Electron. `masaustu/` denemesinde oyun çevrimdışı açıldı, 3B maç günü çizildi, Türkçe karakterli yollarda kayıt yazıldı ve uygulama kapatılıp açılınca kariyer sürdü; paketlenmiş `Chairman.exe` ile de doğrulandı. Kurulum, imzalama ve Steam bağlantısı yok. Ayrıntı ve sınırlar [TEKNIK_PLAN §10](TEKNIK_PLAN.md#10-sunum-metin-ve-masaüstü).

Eski kararların kronolojisi Git geçmişinde korunur. Bu dosyada geçerli kararlar ve gerekli gerekçeler tutulur.

## Çalışma biçimi

Her iş çalışan, incelenebilir bir sonuçla biter. İş sırası bağımlılıkları izler; küçük doğrulama işleri gerekirse öne alınır ve nedeni yazılır. İç test için kısa dönemler kurulması, ticari oyunun uzun kariyer hedefini daraltmaz.

**Aşama 1 tamamlandı. Sıradaki iş: 2.1 — ajanda ve kulüp durumu.** Kariyer durumu, takvim, para ve kayıt ilk kez oyuncuya bir ekranda gösterilir; günü bitirme ve gün sınırında kayıt buraya bağlanır. 2.2'den önce yönetim ekibi koltuklarının ilk kapsamı kullanıcıyla seçilmelidir. Seçim veya ekonomi sistemi topluca yazılmaz. Açık isimler ve denge sayıları için yalnız açıkça etiketlenmiş test verileri kullanılır.

## Aşama 0 — Plan ve belge düzeni

- [x] Kullanıcıyla ana tasarımı ve belge güncelleme planını kesinleştir.
- [x] Oyun tasarımı ve teknik planı ayır; mevcut beş belgeyi yeni sıraya göre düzenle.
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

## Aşama 2 — İlk oynanabilir başkanlık dönemi

**Bağımlılık:** Aşama 1. Ekip koltuklarının ilk kapsamı bu aşamadan önce seçilir.

- [ ] **2.1** Ajanda ve kulüp durumunu göster; zorunlu/ertelenebilir işleri ve günü bitirmeyi anlaşılır yap.
- [ ] **2.2** Sınırlı aday havuzundan yönetim ekibi kur; farklı katkıları ve yetki sınırlarını bir örnek işte göster.
- [ ] **2.3** Hoca görüşmesi ve bütçe önceliği kararı ekle; şimdilik test başlangıcı görevdeki başkan olabilir.
- [ ] **2.4** Bir söz/ilişki kaydı ve günlere yayılan olay zinciri kur; önceki kararın sonucu geri gelsin.
- [ ] **2.5** Sakin zaman ve isteğe bağlı gözlem alanının ilk örneğini ekle. Mevcut ısınma görselleri kullanılabilir; ayrı antrenman simülasyonunun hazır olduğu varsayılmaz.
- [ ] **2.6** Kısa bir yönetim döneminde gerçek oynama süresi, tekrarlar ve kriz yoğunluğunu değerlendir.

Bu aşamada kariyer maç sonucu uydurulmaz; ajanda maç sınırında durabilir. Tam maç bağlantısı Aşama 3'tedir.

**Bitiş ölçütü:** Oyuncu bilgi alıyor, karar veriyor, günleri ilerletiyor ve önceki kararın anlaşılır sonucuyla karşılaşıyor. İyi yönetim rahatlık sağlayabiliyor.

## Aşama 3 — Futbol ve yönetimin bağlanması

**Bağımlılık:** Aşama 2.

- [ ] **3.1** Gizli özelliklerden kaynağı/tarihi/belirsizliği olan rapor üret; yetenek sayısı/yıldızı göstermeden karar verilebildiğini kontrol et.
- [ ] **3.2** Hocanın bilgisi ve tercihleriyle kadro/taktik seçiminin ilk sürümünü kur.
- [ ] **3.3** Kariyerin kadro ve koşullarını mevcut Match girdisine dönüştür.
- [ ] **3.4** Maç sonucunu kariyere kimliğiyle yalnız bir kez uygula; istatistik ve geçmiş kaydını bağla.
- [ ] **3.5** Tohum tutarlılığını, izleme hızının etkisini ve görüntüsüz maçların maliyetini ölç.
- [ ] **3.6** Birkaç haftalık yönetim bölümünü maçlarla tamamla; maç günü süresini ve mevcut atlama seçeneklerini ağır kariyer temposuyla değerlendir.

**Bitiş ölçütü:** Hoca ve kadro kararları sahaya giriyor; maç sonucu yeni gündem ve geçmiş üretiyor. Kayıt yükleme sonucu tekrar uygulamıyor.

## Aşama 4 — Transfer, sözleşme ve mali anlaşmalar

**Bağımlılık:** Aşama 3. Kişisel katkı ve ilk mali kurallar seçilmiş olmalı.

- [ ] **4.1** Sözleşmeler, maaşlar, taksitler, primler ve sponsor ödeme takvimini kur.
- [ ] **4.2** Bir transferi araştırma, temas, karşı teklif ve imzayla bitir; basit/sorunsuz yol da çalışsın.
- [ ] **4.3** Menajer talebi, rakip teklif ve sızıntı gibi koşula bağlı dallar ekle; aynı olayın durmadan tekrarlanmasını önle.
- [ ] **4.4** Sponsor görüşmesi ve sınırlı kişisel katkıyı mali kayıtlarla bağla.
- [ ] **4.5** Yetki devrini bütçe ve süre sınırlarıyla çalıştır; önemli eşikte başkana geri dön.
- [ ] **4.6** Geciken gelir veya artan giderin birden çok güne yayılan etkisini dene; sürekli kriz ve kolay sınırsız para yollarını değerlendir.

**Bitiş ölçütü:** Anlaşmalar yalnız konuşma sonucu olmaktan çıkıp kulübün gelecekteki parasına, kadrosuna ve ilişkilerine işleniyor.

## Aşama 5 — Taraftarlıktan adaylığa hikâye

**Bağımlılık:** Aşama 4. Kulüp geçmişi ve ilk seçim kuralları seçilmiş olmalı.

- [ ] **5.1** Kulüp/şehir geçmişini ve tekrar karşılaşılacak temel kişileri yaz; geçmiş ile kariyerde oluşacak olayları ayır.
- [ ] **5.2** Tribün, gazete, çevreyle görüşme ve adaylığa davet sahnelerini kur; oyuncuya girişte anlamlı seçimler ver.
- [ ] **5.3** Adaylık açıklaması, yönetim havuzu, ekipçe vaat hazırlama ve rakip aday karşılaşmaları ekle.
- [ ] **5.4** Röportaj, hazırlıksız yakalanma ve seçim günü akışını kur; ilk seçim çoğunlukla ulaşılabilir olsun fakat kaybetme yolu bulunsun.
- [ ] **5.5** Süreli cevap, süre dolması ve okuma/flaş/sarsıntı seçeneklerinin ilk sürümünü dene.
- [ ] **5.6** Kazanma ve kaybetme geçişlerini kaydet; görev dışı takip için temel giriş sun. Uzun görev dışı yıllar Aşama 7'de tamamlanır.

**Bitiş ölçütü:** Gerçek oyun başlangıcından kampanyaya ve seçimin iki sonucuna gidiliyor. Seçilen ekip ve verilen vaatler devam eden kariyere taşınıyor.

## Aşama 6 — Bir tam sezon

**Bağımlılık:** Aşama 5. İlk lig formatı ve sezon takvimi seçilmiş olmalı.

- [ ] **6.1** Fikstür, diğer kulüpler, puan durumu ve transfer dönemlerini kur; sezon geçişini tamamla.
- [ ] **6.2** Diğer maçları arayüzü kilitlemeden üret; toplam maliyeti ve sonuç tutarlılığını ölç.
- [ ] **6.3** Ev/deplasman kimliklerini, taraftar dağılımını ve başkan bölümündeki komşu kişileri bağla.
- [ ] **6.4** Taraftar, medya/TV ve hakem-federasyon gündeminin temelini sezon olaylarına bağla; rakip başkan ilişkilerini kullan.
- [ ] **6.5** Bilet, doluluk ve yayın/sponsor gelirlerini takvime bağla; ekonomik şartların ilk etkilerini ekle.
- [ ] **6.6** Sezonu baştan sona oyna; dönem sonu ödemeler, sözleşmeler, geçmiş ve yeni sezon hazırlığını doğrula.

**Bitiş ölçütü:** Bir sezon boyunca hem maç hem yönetim ilerliyor; son tarihler, para ve sonuçlar tutarlı kalıyor.

## Aşama 7 — Uzun kariyer, görev kaybı ve yaşlanma

**Bağımlılık:** Aşama 6. Yaş modeli ve kupasız kariyer sonlarının ilk şartları seçilmiş olmalı.

- [ ] **7.1** Tekrar seçimde görev geçmişini, vaatleri ve rakipleri kullan.
- [ ] **7.2** Görev kaybında yetkileri kaldır; yeni yönetimin kulübü yönetmesini ve daha hızlı takip takvimini çalıştır.
- [ ] **7.3** Kulis, açıklama, farklı koltuktan maç izleme ve yeniden adaylığa hazırlanmayı ekle.
- [ ] **7.4** Başkanın yaşlanmasını, tecrübesini ve ekip ihtiyacını zamanla değiştir; kullanıcının seçimini rastgele değiştirme.
- [ ] **7.5** İnsanların geçmişini, ayrılmasını, emekliliğini ve yerine yenilerinin gelmesini çalıştır.
- [ ] **7.6** Kupasız son koşullarını ve geçmişe göre kapanışın temelini kur; görev kaybıyla karıştırma.
- [ ] **7.7** Birkaç seçim döngüsünü geliştirici hızında ve seçilen bölümleri normal tempoda doğrula.

**Bitiş ölçütü:** Aynı dünya görevde ve görev dışında sürüyor; yeniden adaylık, kuşak değişimi ve olası kariyer sonu kayıttan devam edebiliyor.

## Aşama 8 — Kulübün büyümesi

**Bağımlılık:** Aşama 7. Üç kademe arasındaki geçişler ve alt sınır seçilmiş olmalı.

- [ ] **8.1** Üç ligin kulüp kimliklerini, yükselme/düşme ve sezon geçişlerini tamamla.
- [ ] **8.2** Altyapıdan yeni oyuncu, gelişim, sakatlık sonrası dönüş ve yaş etkilerini uzun kariyere bağla.
- [ ] **8.3** Tesis/stat yatırımını maliyet, takvim ve aşamalı sonuçla çalıştır; tamamlanan iş görüntüye yansısın.
- [ ] **8.4** Kulüp büyüdükçe kadro, yönetim havuzu, sponsorluk ve kamuoyu ölçeğini değiştir.
- [ ] **8.5** Odalardaki kupalar, fotoğraflar ve kişisel geçmişi güncelle; isteğe bağlı antrenman ve kulüp ortamlarını genişlet.

**Bitiş ölçütü:** Kulüp ilerliyor veya geriliyor; insanlar ve mali yapı bu değişimi taşıyor. Gelişim ve yatırım otomatik başarı garantisi vermiyor.

## Aşama 9 — Avrupa ve finaller

**Bağımlılık:** Aşama 8. Kupa formatları, katılım şartları ve başarı finalinin özel durumları seçilmiş olmalı.

- [ ] **9.1** Avrupa kupaları, dış rakipler ve yabancı oyuncu kaynaklarının gerekli temsilini kur.
- [ ] **9.2** Büyük Avrupa statları, deplasman ortamları ve başkan ilişkilerini ekle.
- [ ] **9.3** Üst ligde doğan Avrupa hayalini ve bırakma hedefini hikâyeye bağla.
- [ ] **9.4** Yalnız en büyük kupanın uygun kariyer sonucuyla başarı finalini tetiklemesini doğrula; küçük kupa ve görev dışı durumları ayrı değerlendir.
- [ ] **9.5** Kutlama, dönüş, veda ve geçmişe göre farklılaşan kupasız finalleri tamamla.
- [ ] **9.6** Kupaya giden birden fazla zor ama mümkün yolu test et; yapay rakip güçlendirmesi ve açıklanamayan engeller kullanma.

**Bitiş ölçütü:** Kariyerin başarı ve başarısızlık yolları tamamlanabilir; final geçmişi yansıtır ve aynı kayıtta tekrar tetiklenmez.

## Aşama 10 — Ürünü tamamlama

**Bağımlılık:** Ana kariyer yollarının çalışması. Gereken kalite işleri daha erken aşamalarda da yapılır.

- [ ] Olay ve karakter çeşitliliği, tekrar kontrolü, ekonomi/seçim/Avrupa dengesi ve uzun oturum testleri.
- [ ] Hava ve saat; ayakların yere basması; VAR incelemesinin sunumu; ikinci yarı kenar ısınması.
- [ ] Yakın seyirciler, yüz/atkı ayrıntıları, erken ayrılma, tezahürat ve koreografi; sesle uyum.
- [ ] Tribün, düdük, tören ve konuşma sunumunun sesleri. Temel sesler daha erken oynanabilir bölümde eklenebilir.
- [ ] Ayarlar, okunabilirlik, süreli karar erişilebilirliği ve desteklenecek dil kapsamı.
- [ ] Dolu büyük statlar, arka plan maçları, uzun kariyer kayıt boyutu ve hedef donanım performansı.
- [ ] Ekonomiyle yönetilen değerler bağlandıkça geçici deneme panelini oyuncu akışından çıkar; geliştirici araçlarını ayrı tut.
- [ ] Masaüstü paketi, çevrimdışı çalışma, güncelleme/kayıt uyumluluğu ve seçilen Steam özelliklerini tamamla.
- [ ] Mağaza anlatımını çalışan sürümden oluştur; fiyat, yayın ve dağıtım kararlarını kullanıcıyla kesinleştir.

**Bitiş ölçütü:** Hedeflenen kariyer yolları tamamlanıyor; kayıtlar, paket ve içerik uzun oyunlarda güvenilir. Yayın yalnız doğrulanmış kapsamla yapılır.

## Açık kararların takibi

Oyun kararlarının listesi ve son karar tarihleri [OYUN_TASARIMI.md](OYUN_TASARIMI.md) içindedir. Platform, kayıt ayrıntıları ve uygulama tercihleri [TEKNIK_PLAN.md](TEKNIK_PLAN.md) içinde açık olarak işaretlidir. Bir karar alındığında ana belgesine işlenir ve yukarıdaki güncel karar özetine kısa, tarihli kayıt eklenir.

Kesin para tutarları, olay aralıkları, başarı olasılıkları ve yaş etkileri oynanış testi gerektirir. Planlanmış olmak tamamlanmış olmak değildir; yalnız uygulanıp doğrulanan işler işaretlenir.
