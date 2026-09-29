# Chairman — yol haritası

Her aşama küçük adımlardan oluşur. Her adım çalışan bir sonuçla biter; bitince kutusu işaretlenir.

## Şu an neredeyiz
- [x] Görsel yön seçildi: '99 görünümü (FIFA 99 / PS1 dönemi).
- [x] Tek kare sahne hazır: ayırt edilebilir oyuncular, dürbün (`index.html`).
- [x] Maç başkanın gözünden, açık ana tribündeki başkan koltuğundan izleniyor; TV açısı, kapalı loca ve ekran seçenekleri kaldırıldı.
- [x] Görünüş ayarları tek dosyada toplandı (`js/stil-99.js`).
- [x] Maç motoru var (`js/mac-motoru.js`), ama '99 sahnesine bağlı değil. Retro ve 3B prototiplerde çalışıyor (`prototipler/`).
- [x] Bulutta test için kontrol aracı hazır (`araclar/kontrol.py`); adres parametreleriyle de çalışıyor.
- [x] Maç baştan sona oynanıyor: tünelden çıkış, İstiklal Marşı töreni, yazı tura, iki devre, devre arası, maç sonu (~10 dakika). Skor stadın tabelasında ve ekranın altındaki radyo satırında.
- [x] Stat tariflerden kuruluyor; tribünlerde kutulardan kurulu insanlar ve tek tek koltuklar var. Ekran altındaki geçici deneme panelinden stat, doluluk ve zemin değiştirilebiliyor.
- [x] Maç motoru baştan yazıldı (`js/mac-*.js`): oyuncular hedefe dönüp vuruyor, topu dokunuşlarla sürüyor, seçeneklerini tartarak karar veriyor. Taç, korner, aut, serbest vuruş ve penaltı; top toplayıcılar; faul, kart, avantaj, ofsayt; oyuncu değişikliği ve uzatma tabelası var. Ayarlar `araclar/mac-deneme.js` ile ölçülüyor.
- [x] Maç günü baştan sona gerçek sırayla akıyor (~6 dk, "Maça geç" ile atlanabilir): tribün yavaş yavaş doluyor; kaleciler, hakemler ve takımlar ısınıyor, içeri giriyor; yedekler, antrenörler, 4. hakem, fotoğrafçılar ve en son teknik direktörler çıkıyor; önde üç hakemle çıkış, marş (tribün ayakta), TFF sırasıyla tokalaşma, iki takım fotoğrafı, yazı tura, kenetlenme ve santra. Devre arasında yedekler şut çalışıyor; maç sonunda tokalaşma ve taraftarı alkışlama var.

## Kararlar
- 2026-09-26: Görsel yön Demirkapı '99 (FIFA 99 / PS1 dönemi). Tüm görseller kodla üretilir.
- 2026-09-26: Ana açı başkan locası; TV yayını açısı ikinci seçenek. (2026-09-27'de değişti, aşağıya bak.)
- 2026-09-26: Kariyer 3. Lig'den başlar, 1. Lig ve Avrupa kupalarına uzanır; iç saha ve deplasman maçları var.
- 2026-09-26: Oyuncular uzaktan tanınır olmalı: boy, yapı ve saç farkı; belirgin numara; locadan bakarken kendi oyuncularında numara etiketi. (Numara etiketi 2026-09-27'de iptal edildi.)
- 2026-09-26: Görünüş ayarları tek dosyada (`js/stil-99.js`); stil değişikliği önce oradan yapılır.
- 2026-09-27: Çalışma ortamı Claude Code bulut oturumları + GitHub (depo: github.com/frkckr/demirkapi-99); oyun GitHub Pages'ten izlenir. (Depo adı 2026-09-29'da değişti, aşağıya bak.)
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
- 2026-09-28: Maç izleme "10 dakika, kesintisiz ama sık" kalır: olaylar gerçeğe göre daha sık yaşanır, maç sonu sayıları gerçek maça benzer.
- 2026-09-28: Başkanın bedeni ekranın altında görünür: masa ve eller (çay, program, telefon); eller maça tepki verir.
- 2026-09-28: Maç öncesi ~6 dakika sürer (tribün dolar, ısınmalar, çıkış, marş, tokalaşma, fotoğraf, yazı tura); "Maça geç" ile atlanabilir.
- 2026-09-28: Gölgeler oyuncu silüetinin her projektörden zemine izdüşümüdür; insan modelleri tek parça (kemikli, tek dokulu) çizilir.
- 2026-09-28: Maç motoru dört mantık dosyasına ayrıldı: `mac-motoru.js` (hareket, eylemler, top fiziği, temaslar, kaleci), `mac-karar.js` (topla karar), `mac-dizilis.js` (topsuz oyun), `mac-kurallar.js` (kurallar, duran toplar, hakemler). Kararlar şutun gol beklentisine (xG) ve bölge tehdidine (xT) dayanır; pasın başarısı topun ve rakiplerin varış zamanlarından hesaplanır. Motor tohumlu rastgele sayı kullanır: aynı tohum aynı maçı verir.
- 2026-09-28: Duran toplarda çoklu top sistemi: 12 top toplayıcı sahanın çevresinde yedek topla bekler; top çıkınca en yakını yeni topu verir. Faulde oyun durur (düşme, düdük, itiraz, kart; avantaj kuralı), ofsayt pas anında kontrol edilir ve yan hakem bayrak kaldırır. Uzatma duruşlardan biriken süreyle hesaplanır, 4. hakem tabelayla gösterir; ikinci yarıda her takım 2–4 değişiklik yapar.
- 2026-09-28: Topu süren oyuncudan top ancak müdahaleyle alınır (başarısı ve faul olasılığı var); yalnız uzun kaçan dokunuşta araya girilebilir. Kaleci uzaktan gelen şutta önce yana kayar, top gelmeden hemen önce uçar.
- 2026-09-28: Maç deneme aracının hedef tablosu gözden geçirildi. Oyuncular gerçek hızda koştuğu için 10 dakikalık maçta ~7 dakika oyun oynanır; gerçekçi kararlarla önemli olaylar gerçek maçın dakika başına 2,5–3 katı sıklıkta yaşanır. 40 maçlık ortalama: 1,9 gol, 9,7 şut (%41 isabet), 2,3 korner, 7,3 taç, 9,9 faul, 1,8 sarı kart, 0,4 ofsayt, 130 pas (%69 isabet), uzatma 2,8 / 4,8 dk, takım başına 2,5 değişiklik. Gerçek maçın şut, korner ve taç sayısına ulaşmak için ya maç uzamalı ya da oyun yapaylaşmalı (bkz. Açık kararlar).
- 2026-09-28: Maç günü akışı `js/mac-senaryo.js` (veri) ve `js/mac-oncesi.js` (yürütücü) dosyalarındadır. Sıra Premier League ısınma protokolüne ve TFF statüsüne göre: kaleciler ~45 dk, takımlar ~35 dk önce ısınmaya çıkar; hakemler orta çizgi boyunca koşar; saha ~10 dk önce boşalır; teknik direktörler en son çıkar. Tokalaşmada misafir takım kaptanı önde önce hakemlerle, sonra ev sahibi oyuncularla tokalaşır; ardından hakemler ev sahibiyle. Önce ev sahibi yerinde, misafir kendi yarısında fotoğraf çektirir. Yazı turayı kazanan santrayı ya da kaleyi seçer (Kural 8). Maç öncesinin rastgeleliği ayrı bir tohumdan gelir; maçın kendisini değiştirmez.
- 2026-09-28: Devre arası ~45 sn (yedekler kale önünde şut çalışır, teknik direktörler soyunma odasına gidip döner). Maç sonunda üç düdük, kazananların sevinci, kaybedenlerin yorgunluğu, rakiple tokalaşma, iki takımın kendi taraftarını alkışlaması ve tünele dönüş vardır.
- 2026-09-29: Projenin adı şimdilik "Chairman" (eskiden "Demirkapı '99"). Depo github.com/frkckr/chairman, oyun linki frkckr.github.io/chairman/. Oyuncunun kulübü yine kurgusal Demirkapı SK; statların adı ve kulüp renkleri değişmedi. Görsel yön "'99 görünümü" diye anılır. `prototipler/` eski halleriyle arşiv olarak kalır.

## Açık kararlar
- Maç süresi ve olay sıklığı: 10 dakikada, gerçekçi akışla maç başına ~2 gol ve ~10 şut çıkıyor (gerçek maçta ~2,7 gol, ~25 şut). Daha çok olay istenirse iki yol var: maçı uzatmak (15–20 dakika) ya da oyunu yapaylaştırmak (hücumlar daha kolay sonuçlanır, daha çok uzaktan şut). Şimdilik gerçekçi akış ve 10 dakika kaldı.

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
- [x] Kayarak müdahale ve faul; sarı/kırmızı kart; ofsayt bayrağı.

## Aşama 3 — Yönetim çekirdeği
- [ ] Kadro, transfer, bütçe.
- [ ] Lig yapısı: 3. Lig → 2. Lig → 1. Lig → Avrupa.
- [ ] Maç sonuçlarının motordan gelmesi; diğer maçların görüntüsüz hızlı oynatılması.
- [ ] Stat geliştirme ve doluluğun para ve başarıya bağlanması (stadyum tarifi ve doluluk değerleri ekonomiden gelir).

## Aşama 4 — Hareket
- [x] Poz kütüphanesi ve pozlar arası yumuşak geçiş.
- [x] Şut, pas, kafa, kayarak müdahale, kaleci uçuşu, sevinç.
- [ ] Ayakların yere düzgün basması.

## Aşama 5 — Maç sahneleri
- [x] Sahaya çıkış ve seremoni (ilk sürüm: tünelden çıkış, İstiklal Marşı töreni, yazı tura; marşın müziği Aşama 7'de).
- [x] Yedek kulübesi ve teknik direktör (ilk sürüm: yedekler oturuyor, golde fırlıyor; teknik direktör teknik alanda geziniyor).
- [x] Oyuncu değişikliği ve dördüncü hakemin tabelası (değişiklik ve uzatma).
- [x] Maç günü tam sürüm: ısınma, kulübeler, çıkış, marş, TFF tokalaşması, takım fotoğrafları, yazı tura, kenetlenme; devre arası ve maç sonu.
- [ ] Yedeklerin ikinci yarıda kenar çizgisinde ısınması (maç öncesinde ve devre arasında ısınıyorlar).
- [x] Marş sırasında tribünün ayağa kalkması.
- [x] İtiraz: faul ve kartta oyuncular hakeme, başkan masada itiraz eder.
- [ ] VAR incelemesi.

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
