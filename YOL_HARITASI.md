# Chairman — yol haritası

Son güncelleme: 2026-09-30. Bu dosya iş sırasının ve tamamlanma durumunun ana kaynağıdır. Oyun kuralları [OYUN_TASARIMI.md](OYUN_TASARIMI.md), mimari yaklaşım [TEKNIK_PLAN.md](TEKNIK_PLAN.md), sunum kuralları [STIL_REHBERI.md](STIL_REHBERI.md) içindedir.

## Şu an neredeyiz?

Çalışan ürün bir maç günü prototipi, kariyer temeli (Aşama 1), ilk ajanda haftası (2.1) ve sayman/sponsor denemesidir (2.2'nin ilk adımı). Yaşayan kulüp sahneleri ve aşağıdaki yeni işler henüz uygulanmamıştır. 2026-09-30 güncellemesi yalnız belgeleri ve geliştirme planını değiştirir.

- [x] Maç motoru '99 sahnesine bağlı; maç baştan sona oynanıyor.
- [x] Başkan bakışı, dürbün, başkanın elleri/masası ve olaylara tepkiler var.
- [x] Kadro verisi, tohumlu maç mantığı, top fiziği, oyuncu kararları ve topsuz oyun var.
- [x] Taç, korner, aut, faul, kart, ofsayt, oyuncu değişikliği, top toplayıcılar ve uzatma sunumu var.
- [x] Isınma, çıkış, tören, tokalaşma, fotoğraf, yazı tura, devre arası ve maç sonu akışı var.
- [x] İki stat tarifi var: 3. Lig kasaba ve 1. Lig şehir. Avrupa arenası şu an mevcut değil.
- [x] Zemin, seyirci doluluğu, koltuklar ve tribün tepkilerinin görsel temeli var; değerler geçici deneme panelinden geliyor.
- [x] Tarayıcı kontrolü ve görüntüsüz maç ölçüm araçları var. Her ortamda bağımlılıklarının hazır olduğu varsayılmaz.
- [x] Sabit lig/kadro verisiyle çalışan maç öncesi bülteni var: lig durumu, form, olası 11'ler, eksikler ve son maçlar; “İlerle” ile maç gününe geçiliyor.
- [x] Oyun ajandayla açılıyor: maçtan önceki TEST haftası gün gün oynanıyor, gün sonunda kaydediliyor, Cumartesi “Stada git” bültene geçiyor. Maç sonucu kariyere işlenmiyor.
- [x] Kariyer verisi, takvim, para hareketleri ve gelecekteki ödemeler için temel; tarayıcı/masaüstü kayıt ve önceki sağlam kayda dönüş var.
- [x] Üç yönetim koltuğu, sayman seçimi ve sponsor işini saymana devretme denemesi var; ekip sisteminin tamamı bitmedi.
- [x] Windows/Electron ile çevrimdışı masaüstü denemesi var; ticari paket tamamlanmadı.
- [ ] Mekânlarda günlük başkanlık, ortak mesele geçmişi, telefon/görüşme akışı, kontrollü gözlem ve gün içi karar kaydı.
- [ ] Tam yönetim, sözleşme/ekonomi, seçim, sezon, uzun kariyer ve Avrupa sistemleri; maç sonucunun kariyere bağlanması.
- [ ] Ticari masaüstü paketi ve uzun kariyer doğrulaması.

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
- **2026-09-29, mevcut uygulama (2.1):** Ajanda kuralları `js/ajanda.js`, ekran `js/ekran-ajanda.js`, TEST haftası `KARIYER_BASLANGIC` (`js/kariyer-ornek.js`). Kariyer dosyaları artık `index.html`'e yüklenir. Kayıt gün sınırında `oyun-1` yuvasına yapılır; maç sınırında kayıt yoktur. Metinler, saatler ve tutarlar TEST değeridir. Ayrıntı [TEKNIK_PLAN §3–5](TEKNIK_PLAN.md#4-zamanın-ilerlemesi).

- **2026-09-29, mevcut uygulama (2.2 ilk adım):**
  - Yönetim kuralları ve karar türleri `js/yonetim.js` dosyasında. Ajandaya karar işi eklendi (`KARAR_TURLERI`); takvime yapılmadan iptal edilen iş kaydı eklendi (`isIptal`).
  - Aday profilleri metin olarak gösterilir, katkı seviyeleri gizlidir. Sonuçlar olasılıksız ve tekrarlanabilirdir.
  - Aday katkılarının oyuncuya gösterim biçimi açık karardır ([OYUN_TASARIMI §13](OYUN_TASARIMI.md#13-kapsam-ve-açık-kararlar)).
  - Ayrıntı: [TEKNIK_PLAN §3 ve §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi).

- **2026-09-30, onaylı tasarım ve belge güncellemesi:** Öncelik yaşayan kulüp deneyimidir: aydınlık oda/görüşme ortamı, aynı meseleyi takip eden telefon ve ajanda, tavsiye/kalıcı yetki devri, kontrollü antrenman gözlemi ve kararların görünür sonuçları. Ayrıntı [OYUN_TASARIMI §2](OYUN_TASARIMI.md#2-başkanın-rolü-ve-ana-döngü) ve [STIL_REHBERI §7](STIL_REHBERI.md#7-arayüz-ve-bilgi).
- **2026-09-30, onaylı zaman yaklaşımı:** Eylemle ilerleyen takvim; okuma ve düşünmede durma; sonraki önemli gelişmede durarak ilerleme; gün içinde güvenli kayıt ve dönüş özeti. Gün/sezon süreleri ölçüm hedefidir, kesin denge değildir; tek kaynak [OYUN_TASARIMI §6](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo).
- **2026-09-30, onaylı iş sırası:** Basit sezon takvimi Aşama 3'e alınır. Tam sezon eski Aşama 6'dan yeni Aşama 5'e, kapsamlı adaylık hikâyesi eski Aşama 5'ten yeni Aşama 6'ya taşınır. Temel kayıt, okunabilirlik ve ortam sesi Aşama 2'nin kabul koşuludur. Tamamlanan işler korunur; bu kararlar oyun kodunun uygulandığı anlamına gelmez.

Eski kararların kronolojisi Git geçmişinde korunur. Bu dosyada geçerli kararlar ve gerekli gerekçeler tutulur.

## Çalışma biçimi

Her iş çalışan, incelenebilir bir sonuçla biter. İş sırası bağımlılıkları izler; küçük doğrulama işleri gerekirse öne alınır ve nedeni yazılır. İç test için kısa dönemler kurulması, ticari oyunun uzun kariyer hedefini daraltmaz.

**Aşama 1 ve 2.1 tamamlandı; 2.2'nin ilk adımı uygulandı. Sıradaki geliştirme: 2.3 — mevcut sponsor örneği üzerinden mesele ve zaman temeli.** Ardından gün içi kayıt ve aydınlık oda gelir. 2.2'nin kalan işleri, yeni görüşme/ekip adımıyla tamamlanır. Açık isimler ve denge sayıları için yalnız açıkça etiketlenmiş TEST verileri kullanılır.

İlk bütünleşik örnek: ofiste başlayan sponsor meselesi ekibe verilir; sonraki gün antrenmanda haber gelir; yetkiyi aşan konu başkana döner ve kararın sonucu kulüpte görülür. Bu örnek yeni Aşama 2'nin sonunda hedeflenir; ilk alt adımda bütün sahneler birden yapılmaz.

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
| Aşama 10 temel kullanım kalitesi | Gün içi kayıt 2.4; okunabilirlik/ortam sesi 2.5–2.9; kapsamlı tamamlama Aşama 10'da kalır |

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
- [ ] **2.2** Sınırlı aday havuzundan yönetim ekibi kur; farklı katkıları ve yetki sınırlarını bir örnek işte göster.
  - *İlk adım uygulandı (2026-09-29, TEST içerik):* Üç koltuk tanımlandı. Boş sayman koltuğu için üç aday arasından seçim yapılıyor. Perşembe sponsor ödemesi işi başkan tarafından yürütülebiliyor ya da saymana devredilebiliyor; sonuç saymanın gizli katkısına göre değişiyor, yetkiyi aşan indirim talebi başkana dönüyor.
  - *Kalan işler:* Futbol ve basın koltuklarının örnek işleri ile birden çok koltuğun havuzdan kurulması. 2.5 sonrasında 2.6 ile yürütülür; aday katkısının sunumuna ilişkin açık karar kapanmadan bu madde tamamlandı sayılmaz.
- [ ] **2.3 — Mesele ve zaman temeli.** Mevcut sponsor örneğini tek kimlikli meseleye bağla; sorumlu kişi, durum, son tarih, beklenen haber ve karar geçmişini göster. Eylem süreleri ile okuma/düşünme ayrımını ve sonraki önemli gelişmede durmayı kur. Önce mevcut arayüzde küçük bir örnekle doğrula.
  - *Bitiş:* Aynı konu tekrar görev üretmiyor; rutinler ilerlerken yeni karar gerektiğinde duruluyor; zorunlu iş ve son tarih korumaları çalışıyor. Beklenen haber veya yapılabilir sonraki adım anlaşılır.
- [ ] **2.4 — Gün içi kayıt ve dönüş.** Tamamlanan kararları ve güvenli sahne geçişlerini kaydet; mesele, bekleyen iş ve yetki durumu yüklenince sürsün. Son karar, beklenen haber ve yaklaşan tarihten kısa dönüş özeti üret.
  - *Bitiş:* Gün bitmeden kapatıp açınca son tamamlanan karar korunuyor; ödeme/karar ikinci kez uygulanmıyor. Kayıt sınırı ve varsa başarısız kayıt doğru bildiriliyor; eski kayıt davranışı doğrulanıyor. Maç ortasından kayıt bu adımın koşulu değildir.
- [ ] **2.5 — Aydınlık başkan odası.** Oda içinde telefon, ajanda ve ilgili dosyaya erişimi kur; bir meseleye odaklanan açık renkli sunum kullan. Okunabilir metin ve temel ortam sesi/ses kontrolü ekle.
  - *Bitiş:* Oyuncu gündemi bulup konuyu açabiliyor, kapatıp ortama dönebiliyor; gerekli bilgi için nesne aramaya zorlanmıyor. Oda değişimi veya paneli yeniden açma zamanı ve karar geçmişini değiştirmiyor.
- [ ] **2.6 — Görüşme, tavsiye ve ekip.** Hoca görüşmesi ve bütçe önceliğini ekle. Tavsiye ile yetki devrini ayır; kişi, bütçe, süre, kapasite ve başkana dönüş koşullarını belirle. Bir kalıcı sorumluluk ve başkanın başlattığı bir görüşme/araştırma örneği kur; 2.2'nin kalan işlerini tamamla.
  - *Bitiş:* Yetki içindeki rutin adımlar ek onay istemiyor; sınır aşılınca başkana dönülüyor. İşe uygun yönetici bazı işleri daha iyi çözebiliyor; şahsen katılım her işte otomatik en iyi seçenek olmuyor. Hoca futbol kararlarının sahibi olarak kalıyor.
- [ ] **2.7 — Antrenman ve telefon.** İsteğe bağlı gözlem sırasında haber alma, cevaplama, tavsiye isteme veya yönlendirmeyi dene. Mevcut ısınma görsellerinden yararlanılabilir; ayrı antrenman simülasyonunun hazır olduğu varsayılmaz.
  - *Bitiş:* Kontrollü gözlemde mesaj kararı zamanı durduruyor; uyumlu eşzamanlı işler süreyi iki kez tüketmiyor. Uzun görüşmede gözlemden ayrılınıyor; aynı mesele ofiste ve telefonda devam ediyor. Katılmamak zorunlu bilgi/ödül kaybına dönüşmüyor.
- [ ] **2.8 — Sonuçlar ve kulüp hafızası.** Bir söz/ilişki kaydı, önceki kararın dönüşü, ilk taraftar veya medya tepkisi ve olumlu kulüp anı ekle. Tamamlanan küçük bir iş/yatırımın ya da tutulmuş sözün izini ortamda göster; daha sonraki tesis sisteminin tamamını burada kurma.
  - *Bitiş:* Oyuncu sonucun hangi karardan geldiğini anlayabiliyor; ilgili insanlar ve geçmiş hatırlanıyor. Görünür değişim gerçekten kaydedilmiş olaya dayanıyor, yükleme sonrası korunuyor.
- [ ] **2.9 — Günlük akışın sınanması.** Önce birkaç günlük tek meseleyi, sonra sakin/olağan/yoğun günleri içeren bir haftayı oyna. [Tempo hedefleriyle](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo) gerçek süreyi, tekrarları, kesintileri, kararların anlaşılmasını ve yetki devrinin faydasını değerlendir.
  - *Bitiş:* Kısa oturumda mesele ilerliyor; yoğun gün bölünebiliyor; iyi yönetim rahat dönem üretebiliyor. Temel yazı/ses seçenekleri ve dönüş özeti kullanılabilir. Eksik örnekler ve ölçüm sonuçları yazılır; yalnız toplam süreye bakılarak aşama kapatılmaz.

**Uygulama sırası:** 2.3 → 2.4 → 2.5 → 2.2'nin kalanları ve 2.6 → 2.7 → 2.8 → 2.9. Her alt adım kendi kontrolüyle tamamlanır. Başlangıç görevdeki TEST başkanı olabilir.

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

**Bitiş ölçütü:** Hoca ve kadro kararları sahaya giriyor; maç sonucu yeni gündem ve geçmiş üretiyor. Kayıt yükleme sonucu tekrar uygulamıyor.

## Aşama 4 — Transfer, sözleşme ve mali anlaşmalar

**Bağımlılık:** Aşama 3. Kişisel katkı ve ilk mali kurallar seçilmiş olmalı.

- [ ] **4.1** Sözleşmeler, maaşlar, taksitler, primler ve sponsor ödeme takvimini kur; saymanın değerlendirmesi mevcut nakit ile gelecek ödeme yükünü ayırsın, belirsiz gelir kesin para sayılmasın.
- [ ] **4.2** Bir transferi aynı mesele içinde araştırma, temas, karşı teklif ve imzayla bitir; basit/sorunsuz yol da çalışsın. Kaçan transfer sonrası alternatif arayışı ve anlaşmadan çekilmenin sonuçlarını dene.
- [ ] **4.3** Menajer talebi, rakip teklif ve sızıntı gibi koşula bağlı dallar ekle; aynı olayın durmadan tekrarlanmasını önle.
- [ ] **4.4** Sponsor görüşmesi ve sınırlı kişisel katkıyı mali kayıtlarla bağla.
- [ ] **4.5** Aşama 2'deki yetki devrini transfer ve mali anlaşmalara genişlet; bütçe/süre sınırları ve önemli eşikte başkana dönüş ortak kurallarla çalışsın.
- [ ] **4.6** Geciken gelir veya artan giderin birden çok güne yayılan etkisini ve yeniden planlamayı dene; sürekli kriz, açıklanamayan çıkmaz ve kolay sınırsız para yollarını değerlendir. Başarısızlığın bedeli ve verilen sözler korunsun.

**Bitiş ölçütü:** Anlaşmalar yalnız konuşma sonucu olmaktan çıkıp kulübün gelecekteki parasına, kadrosuna ve ilişkilerine işleniyor.

## Aşama 5 — Bir tam sezon

**Bağımlılık:** Aşama 4. İlk lig formatı ve sezon takvimi seçilmiş olmalı. Kapsamlı adaylık hikâyesi bu aşamanın koşulu değildir; görevdeki TEST başkanıyla sınanabilir.

- [ ] **5.1** Aşama 3'teki fikstür/takvim temelini diğer kulüpler, puan durumu ve transfer dönemleriyle tamamla; sezon geçişini kur.
- [ ] **5.2** Diğer maçları arayüzü kilitlemeden üret; toplam maliyeti ve sonuç tutarlılığını ölç.
- [ ] **5.3** Ev/deplasman kimliklerini, taraftar dağılımını ve başkan bölümündeki komşu kişileri bağla.
- [ ] **5.4** İlk taraftar/medya tepkilerini sezon ölçeğine genişlet; medya/TV, hakem-federasyon gündemi ve rakip başkan ilişkilerini sezon olaylarına bağla.
- [ ] **5.5** Bilet, doluluk ve yayın/sponsor gelirlerini takvime bağla; ekonomik şartların ilk etkilerini ekle.
- [ ] **5.6** Sezonu baştan sona oyna; dönem sonu ödemeler, sözleşmeler, geçmiş ve yeni sezon hazırlığını doğrula. Günlük akışın tekrarını ve sezon süresini ölç; yalnız hızlandırılmış deneme tempo onayı sayılmaz.
- [ ] **5.7** Küçük geliştirici örneklerinde kişinin ayrılması/emekliliği, yerine yeni kişi gelmesi ve sezonlar arası kulüp/kademe değişimini sınayarak uzun kariyerin veri temelini doğrula. Seçilmemiş kurallar TEST diye işaretlenir; kapsamlı yaşam döngüsü Aşama 7'de, üç lig ve gelişim Aşama 8'de tamamlanır.

**Bitiş ölçütü:** Bir sezon boyunca hem maç hem yönetim ilerliyor; son tarihler, para ve sonuçlar tutarlı kalıyor. Yeni sezona ve küçük dünya değişimlerine kayıt bozulmadan geçiliyor; sakin dönem ve toparlanma yolları oynanabiliyor.

## Aşama 6 — Taraftarlıktan adaylığa hikâye

**Bağımlılık:** Aşama 5. Kulüp geçmişi ve ilk seçim kuralları seçilmiş olmalı. Temel kişiler ve kulüp kimliği daha önce hazırlanabilir; burada kapsamlı giriş tamamlanır.

- [ ] **6.1** Kulüp/şehir geçmişini ve tekrar karşılaşılacak temel kişileri tamamla; geçmiş ile kariyerde oluşacak olayları ayır.
- [ ] **6.2** Tribün, gazete, çevreyle görüşme ve adaylığa davet sahnelerini kur; oyuncuya girişte anlamlı seçimler ver.
- [ ] **6.3** Adaylık açıklaması, yönetim havuzu, ekipçe vaat hazırlama ve rakip aday karşılaşmaları ekle.
- [ ] **6.4** Röportaj, hazırlıksız yakalanma ve seçim günü akışını kur; ilk seçim çoğunlukla ulaşılabilir olsun fakat kaybetme yolu bulunsun.
- [ ] **6.5** Nadir süreli cevap, süre dolması ve okuma/flaş/sarsıntı seçeneklerini ilgili sahnelerde birlikte dene; erken aşamadaki okunabilirlik ve ayar temelini kullan.
- [ ] **6.6** Kazanma ve kaybetme geçişlerini kaydet; görev dışı takip için temel giriş sun. Uzun görev dışı yıllar Aşama 7'de tamamlanır.

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
- [ ] **8.3** 2.8'deki küçük görünür değişim örneğini kapsamlı tesis/stat yatırımına genişlet; maliyet, takvim ve aşamalı sonuç çalışsın, tamamlanan iş görüntüye yansısın.
- [ ] **8.4** Kulüp büyüdükçe kadro, yönetim havuzu, sponsorluk ve kamuoyu ölçeğini değiştir.
- [ ] **8.5** Erken hafıza ve gözlem örneklerini odalardaki kupalar, fotoğraflar ve kişisel geçmişle genişlet; isteğe bağlı antrenman ve kulüp ortamlarını geliştir.

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

**Bağımlılık:** Ana kariyer yollarının çalışması. Gün içi kayıt, temel okunabilirlik, ortam sesi/ses kontrolü ve dönüş özeti Aşama 2'nin kabul koşullarıdır; burada bütün ürün ölçeğinde tamamlanır.

- [ ] Olay ve karakter çeşitliliği, tekrar kontrolü, ekonomi/seçim/Avrupa dengesi ve uzun oturum testleri.
- [ ] İlk aydınlık kulüp sahnelerinden sonra kapsamlı hava/saat değişimleri ve gölgeler; ayakların yere basması; VAR incelemesinin sunumu; ikinci yarı kenar ısınması.
- [ ] Yakın seyirciler, yüz/atkı ayrıntıları, erken ayrılma, tezahürat ve koreografi; sesle uyum.
- [ ] Erken ortam sesi temelini tribün, düdük, tören ve konuşma sunumuyla tamamla.
- [ ] Erken ayar ve okunabilirlik temelini bütün sahnelere uygula; süreli karar erişilebilirliği ve desteklenecek dil kapsamını tamamla.
- [ ] Dolu büyük statlar, arka plan maçları, uzun kariyer kayıt boyutu ve hedef donanım performansı.
- [ ] Ekonomiyle yönetilen değerler bağlandıkça geçici deneme panelini oyuncu akışından çıkar; geliştirici araçlarını ayrı tut.
- [ ] Masaüstü paketi, çevrimdışı çalışma, güncelleme/kayıt uyumluluğu ve seçilen Steam özelliklerini tamamla.
- [ ] Mağaza anlatımını çalışan sürümden oluştur; fiyat, yayın ve dağıtım kararlarını kullanıcıyla kesinleştir.

**Bitiş ölçütü:** Hedeflenen kariyer yolları tamamlanıyor; kayıtlar, paket ve içerik uzun oyunlarda güvenilir. Yayın yalnız doğrulanmış kapsamla yapılır.

## Açık kararların takibi

Oyun kararlarının listesi ve son karar tarihleri [OYUN_TASARIMI.md](OYUN_TASARIMI.md) içindedir. Platform, kayıt ayrıntıları ve uygulama tercihleri [TEKNIK_PLAN.md](TEKNIK_PLAN.md) içinde açık olarak işaretlidir. Bir karar alındığında ana belgesine işlenir ve yukarıdaki güncel karar özetine kısa, tarihli kayıt eklenir.

Kesin para tutarları, olay aralıkları, başarı olasılıkları ve yaş etkileri oynanış testi gerektirir. Planlanmış olmak tamamlanmış olmak değildir; yalnız uygulanıp doğrulanan işler işaretlenir.
