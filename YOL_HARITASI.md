# Demirkapı '99 — yol haritası

Her aşama küçük adımlardan oluşur. Her adım çalışan bir sonuçla biter; bitince kutusu işaretlenir.

## Şu an neredeyiz
- [x] Görsel yön seçildi: Demirkapı '99 (FIFA 99 / PS1 dönemi).
- [x] Tek kare sahne hazır: ayırt edilebilir oyuncular, dürbün (`index.html`).
- [x] Maç başkanın gözünden, açık ana tribündeki başkan koltuğundan izleniyor; TV açısı, kapalı loca ve ekran seçenekleri kaldırıldı.
- [x] Görünüş ayarları tek dosyada toplandı (`js/stil-99.js`).
- [x] Maç motoru var (`js/mac-motoru.js`), ama '99 sahnesine bağlı değil. Retro ve 3B prototiplerde çalışıyor (`prototipler/`).
- [x] Bulutta test için kontrol aracı hazır (`araclar/kontrol.py`); adres parametreleriyle de çalışıyor.
- [x] Maç baştan sona oynanıyor: tünelden çıkış, İstiklal Marşı töreni, yazı tura, iki devre, devre arası, maç sonu (~10 dakika). Skor stadın tabelasında ve ekranın altındaki radyo satırında.
- [x] Stat tariflerden kuruluyor; tribünlerde kutulardan kurulu insanlar ve tek tek koltuklar var. Ekran altındaki geçici deneme panelinden stat, doluluk ve zemin değiştirilebiliyor.

## Kararlar
- 2026-09-26: Görsel yön Demirkapı '99 (FIFA 99 / PS1 dönemi). Tüm görseller kodla üretilir.
- 2026-09-26: Ana açı başkan locası; TV yayını açısı ikinci seçenek. (2026-09-27'de değişti, aşağıya bak.)
- 2026-09-26: Kariyer 3. Lig'den başlar, 1. Lig ve Avrupa kupalarına uzanır; iç saha ve deplasman maçları var.
- 2026-09-26: Oyuncular uzaktan tanınır olmalı: boy, yapı ve saç farkı; belirgin numara; locadan bakarken kendi oyuncularında numara etiketi. (Numara etiketi 2026-09-27'de iptal edildi.)
- 2026-09-26: Görünüş ayarları tek dosyada (`js/stil-99.js`); stil değişikliği önce oradan yapılır.
- 2026-09-27: Çalışma ortamı Claude Code bulut oturumları + GitHub (depo: github.com/frkckr/demirkapi-99); oyun GitHub Pages'ten izlenir.
- 2026-09-27: Oyun bugün geçer; VAR var. Görünüm yine '99 tarzı.
- 2026-09-27: Hedef platform bilgisayar (Steam). Geliştirme tarayıcıda sürer, GitHub Pages test linki olarak kalır; Steam paketi son aşamada yapılır.
- 2026-09-27: Kulüp, lig, oyuncu ve marka isimleri tamamen kurgusal.
- 2026-09-27: Numara etiketi özelliği iptal; ekranda hiçbir oyuncunun üstünde etiket yok. Formadaki numaralar kalır.
- 2026-09-27: Maç başkanın gözünden izlenir. Başkan kapalı bir locada değil, açık ana tribündeki başkan bölümünde oturur; etrafında tribünler ve seyirci var. Tek açı budur; dürbün isteğe bağlı.
- 2026-09-27: TV yayını açısı iptal.
- 2026-09-27: Ekran seçenekleri (tüplü TV, renk titremesi düğmeleri) kaldırıldı. TV çerçevesi, tarama çizgileri ve kavisli köşeler yok; '99 piksel görünümü ve dönemin renkleri sabit. Ekran oranı 4:3.
- 2026-09-27: Kariyer 3. Lig'de kötü bir statta (az seyirci, kötü zemin) başlar; para harcandıkça ve başarı geldikçe stat gelişir, tribünler dolar. Grafik bu değerlere göre ayarlanabilir olmalı. Tribündeki seyirciler insan gibi görünmeli.
- 2026-09-27: Statlar `js/stadyum-tarifleri.js`'te tarif olarak durur; maç günü doluluğu (doluluk, deplasman oranı) tariften ayrıdır. Kariyer açılışı 3. Lig kasaba statıdır.
- 2026-09-27: Seyirciler kutulardan kurulu küçük insanlardır; binlerce kişi tek çizimle (InstancedMesh) çizilir, başkana uzak olanlar daha az parçayla. Koltuklar tek tek görünür.
- 2026-09-27: Başkan, ana tribünün ortasındaki başkan bölümünün ön sırasında oturur; önünde geçit ve korkuluk, arkasında ve yanında yöneticiler vardır.
- 2026-09-27: Ekonomi gelene kadar stat, doluluk ve zemin kalitesi ekran altındaki geçici deneme panelinden ya da adres satırından (`?stat=sehir&doluluk=0.8&zemin=0.5`) seçilir. Oyun ekranında seçenek yoktur.
- 2026-09-27: İç çözünürlük 640×480 (PS1 yüksek çözünürlük modu); köşe titremesi kapalı. Görünüm retro, hareket pürüzsüz. Normal bakış 30°, dürbün 11°.
- 2026-09-27: Avrupa arenası şimdilik kaldırıldı; yalnızca 3. Lig kasaba ve 1. Lig şehir statı var. 1. Lig'de başkan 17. sırada oturur.
- 2026-09-27: Başkan bölümünde başkanın önünde küçük bir masa ve çay; iki yanda ahşap bölme, yerde bordo halı. Alan açık kalır.
- 2026-09-27: Tribün sakin durur; seyirci maçtaki heyecana göre (giriş, santra, şut, direk, gol, maç sonu) hareketlenir. Başkanın yakınındakiler daha sakindir.
- 2026-09-27: Bir maç yaklaşık 10 dakika sürer (her devre ~5 dk); tören ve devre arası ayrıca ~1,5 dk. Gol dengesi maç başına ~2,5 gol, ~25 şut.
- 2026-09-27: Ekrana grafik konmaz; skor ve dakika stadın skor tabelasından ve ekranın altındaki radyo satırından okunur.
- 2026-09-27: İstiklal Marşı töreni görsel olarak var; müziği ses aşamasında (Aşama 7) eklenecek.

## Açık kararlar
- Şu an açık karar yok.

## Aşama 1 — Stadyum üretici
- [x] Stadyumu tarif olarak tanımla: tribün sayısı ve boyu, çatı, pist, tel örgü, kapasite, renkler.
- [x] Üç örnek stat: 3. Lig kasaba statı, 1. Lig şehir stadı, Avrupa arenası.
- [x] Zemin kalitesi: kel alanlar, çamur, çizgi aşınması, biçme deseni.
- [ ] Hava ve saat: gündüz, gün batımı, gece; yağmur, kar, sis.
- [ ] Deplasman: ev sahibinin renkleri ve taraftar dağılımı.

## Aşama 2 — Maçı hareketlendir
- [x] Maç motorunu '99 sahnesine bağla: oyuncular ve top motora göre hareket etsin.
- [x] Başkanın bakışı topu izlesin (baş çevirme); dürbün çalışsın.
- [x] Oyuncu verisi: boy, yapı, saç, numara ve yetenek değerleri tek kayıtta dursun (`js/kadrolar.js`).
- [ ] Kayarak müdahale ve faul; sarı/kırmızı kart; ofsayt bayrağı.

## Aşama 3 — Yönetim çekirdeği
- [ ] Kadro, transfer, bütçe.
- [ ] Lig yapısı: 3. Lig → 2. Lig → 1. Lig → Avrupa.
- [ ] Maç sonuçlarının motordan gelmesi; diğer maçların görüntüsüz hızlı oynatılması.
- [ ] Stat geliştirme ve doluluğun para ve başarıya bağlanması (stadyum tarifi ve doluluk değerleri ekonomiden gelir).

## Aşama 4 — Hareket
- [ ] Poz kütüphanesi ve pozlar arası yumuşak geçiş.
- [ ] Şut, pas, kafa, kayarak müdahale, kaleci uçuşu, sevinç.
- [ ] Ayakların yere düzgün basması.

## Aşama 5 — Maç sahneleri
- [x] Sahaya çıkış ve seremoni (ilk sürüm: tünelden çıkış, İstiklal Marşı töreni, yazı tura; marşın müziği Aşama 7'de).
- [x] Yedek kulübesi ve teknik direktör (ilk sürüm: yedekler oturuyor, golde fırlıyor; teknik direktör teknik alanda geziniyor).
- [ ] Kenarda ısınma, oyuncu değişikliği, dördüncü hakemin tabelası.
- [ ] Marş sırasında tribünün ayağa kalkması.
- [ ] İtiraz ve VAR incelemesi.

## Aşama 6 — Tribün
- [x] Doluluğa göre tribün: boş koltuklar, deplasman tarafının büyüklüğü (grafik temeli hazır; değerleri ileride ekonomi verecek).
- [ ] Başkanın yakınındaki seyirciler: yüz, atkı, gol sevincinde ayağa kalkma.
- [ ] Taraftar havası: gol sevinci, erken çıkış, tezahürat, koreografi.
- [ ] Sesin tribünle birlikte değişmesi.

## Aşama 7 — Ses ve yayın
- [ ] Tribün uğultusu, düdük, spiker satırları (prototiplerde örnekleri var).

## Aşama 8 — Yayına hazırlık
- [ ] Steam için bilgisayar paketi, kayıt sistemi, ayarlar menüsü.
- [ ] Performans: dolu büyük statlarda seyirci ve koltuk sayısı yüksek; zayıf ekran kartlarında gerekirse uzak tribünler sadeleştirilir.
- [ ] Geçici deneme panelinin kaldırılması (ekonomi statı ve doluluğu belirlediğinde).
