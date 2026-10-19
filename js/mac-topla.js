/* ============ Chairman — maç motoru: topla oyuncu — vuruş, pas, şut, ilk dokunuş (mantık, çizimsiz) ============
   Sahibi: B akışı. Vuruş zinciri (hazırlık, geri salınım, temas, takip), şut / yerden pas / havadan vuruş, pas hedefinin tazelenmesi, topla karar
   (js/mac-karar.js seçenekleri), top sürme niyeti (p.surus; dokunuşları mac-hareket.js uygular), erişim türü, ilk dokunuş ve göğüs kontrolü,
   kafa vuruşu, gelişine karar, destek noktası ve derin koşu, korner ve serbest vuruşun ilk topu.
   MM3 (2026-10-03, bireysel karar zekâsı):
   - Tarama (taramaAdim): her oyuncu görüşüne göre ~0,7–2,5 sn'de bir omzunun üstünden bakar (top gelirken daha sık) ve herkesin yerini
     hafızaya alır; p.bakisYon başın yönüdür (çizim okur). Karar bu algıyla yapılır (mac-karar.js algilanan).
   - Vuruş: hedef vuruş anında ortak planla (pasPlani) tazelenir: ayağa buluşma, boşluğa, ara pasında koşucunun savunmacılardan 0,25 sn önce
     vardığı nokta, ortada hücumcunun varışı. Hata yön ve uzunluk olarak ayrıdır: yön hatası teknik, baskı, zayıf ayak, gövde hizası, gelişine
     vuruş, yorgunluk ve mesafeden; uzunluk hatası bununla ve mesafeyle orantılı, baskıda hafif eksik vuruş. Güçlü ayağın dış tarafındaki orta
     açılı hedefe çoğu zaman dış ayak (zayıf ayağı zorlamaz). Şut hedefi kaleciyi ve bloku tartar (sutPlani).
   - Yönlü ilk dokunuş: top gelirken plan yapılır (plan): bir sonraki işi açan boşluğa, koşu içinde dokunulur; hazır planla karar süresi
     0,10–0,20 sn. Hata: ağır dokunuş (top 2–4 m kaçar) ya da sekme. Yüzey topun yüksekliğinden (iç/dış/taban/uyluk; göğüs).
   - Tek vuruşla oyun (gelisineKarar): geri pas, bırakma, ara pası kontrol edip oynamaya karşı tartılır. Ver-kaç: kısa pastan sonra pasör
     baskıcısının arkasındaki boşluğa koşar (vk; topluAI hedefi uygular).
   Oyuncuya özel B verisi (tarama hafızası, plan, ver-kaç) oyuncu nesnesine alan eklemeden yan tabloda (bVeri) tutulur: sonradan eklenen alanlar
   nesnelerin biçimini (V8 gizli sınıfı) bozar ve bütün sıcak döngüleri yavaşlatır.
   Sözleşme alanları (TEKNIK_PLAN §8): vurus.stil/guc/tekDokunus, kontrol.yuzey/yon, kafa.tur, p.bakisYon, p.sonDokunus — rastlantısız. */
'use strict';
ayarEkle('B',{
  kararGecikme:[0.3,0.6],      // topu kontrol ettikten sonra karar süresi (sn): tempo yüksekse kısa (T4-V 2026-10-09: 0,4–0,7 → 0,3–0,6 — vuruş hazırlığı (hazirlikEn + geri) karar süresinin bir kısmıyla örtüşür, top ayakta ortancası 1,2–2 bandında kalır; T2: 0,12–0,36 → 0,4–0,7; top ayakta ortancası 0,85 sn idi)
  ilerleme:0.05,               // topu ileri taşımanın metre başına değeri (puan): oyunun ne kadar dikine aktığı (birleştirme 2026-10-03: 0,036 → 0,027; T1: 0,04; T7g: 0,05 — kompakt savunmaya karşı ileri pas %26,6 → %30,7, bant 30–45)
  risk:1.0,                    // top kaybından çekinme çarpanı (takımın risk ayarıyla çarpılır)
  surusKarar:[0.3,0.62],       // top sürerken yeniden karar aralığı
  vurusHizalama:0.36,          // vuruş için gövdenin hedefe en fazla sapması (rad); gelişine vuruşta 1,05, dış ayakla 0,85
  sutIstegi:5.0,               // şut seçeneğinin değer çarpanı: 14 m'ye kadar tam, 22 m'de etkisiz (birleştirme 2026-10-03: 3 → 5)
  sutIstekMesafe:[11,20],      // T12c: şut isteğinin tam olduğu ve bittiği mesafe (m; kale ortasına; eskiden sabit 14 ve 22 — şutun ortanca mesafesi 18,1 → 17,0)
  xtKanat:[0.01,0.022],        // T12c: son üçte birin kanadında (orta ve geri çevirme bölgesi) alan tehdidinin tabanı ve çizgiye inen artışı (xT)
  ortaIstegi:2.0,              // orta ve geri çevirmenin değer çarpanı (T10a: 4,0 → 2,0 — 4,0 ortanın 5 kat kötümser tahminini telafi ediyordu; değer yalnız ilk temasın xG'sini sayar, ikinci top, geri çevirme ve korner devamını saymaz: c-orta'da ortadan sonra 4 sn'de şut %49, gol %12. 40 maç: 1,0 ile orta 2,3/maç ve başarı %21, 2,0 ile 3,15 ve %34; gol ve pas isabeti ikisinde de değişmedi)
  sutSapma:1.3,                // şut isabet hatası çarpanı (MM1: 0,8 → 0,7; beden blokları ve yorgunluk isabeti düşürdü; T1: 0,75, sakin oyunda şut daha az baskılı;
                               // T12a 2026-10-12: 1,0 — mesafeyle büyüme sutUzak 0,04 → 0,02 ile birlikte: yakın ve orta mesafede hata büyür, 25 m'de ~aynı;
                               // T12c: 1,3 ve sutUzak 0 — açı hatası mesafeden bağımsız, uzakta gücün hatası (gucHataCarpani) büyütür; baskısız şut v-sut'ta
                               // 11 m'den %40, 16 m'den %13 gol (gerçek ~%35–40 ve ~%10–12; 1,0'da %55–62 ve %16–20))
  uzaklastirCizgi:[0.45,0.18], // T8f: kendi ceza sahasında kafayla uzaklaştırmanın kale çizgisi dışına (kornere) gitme payı: kaleye dönükken / değilken (T8f tarama)
  pasSapma:1.0,                // pas yön hatası çarpanı
  sikisma:0.3,                 // pas hedefindeki alıcı sıkışıksa (rakip dibinde) o yerin değerinden düşülen pay
  geriPas:1.8,                 // geri pasın ek değeri (takımın 'sakin' ayarıyla çarpılır): topu tutma isteği (birleştirme 2026-10-03: 1,4 → 1,8)
  kontrolZorluk:0.7,           // ilk dokunuş hatası çarpanı (kontrolOlasiligi)
  tekVurus:0.25,               // tek vuruşla pasın, kontrol edip oynamaya göre ek değeri (puan) (MM3; T20c 2026-10-18: 0 → 0,25 — koni açılınca gelişine pas %17 → 24, tarama 0,25 / 0,4: %24 / 29,5, şut −1,9)
  verKacIstegi:0.6,            // kısa pastan sonra pasörün ver-kaç koşusuna çıkma olasılığı (baskıcısı yakınsa tam) (MM3; Z4b: 0,35 → 0,6 — pas ver ve koş)
  verKacDeger:1.1,             // ver-kaç koşusundaki pasöre dönüş pasının ek değeri (MM3; Z4b: 0,4 → 1,1 — dönüş savunmacıyı geçirir; 24 maçta tamamlanan ver-kaç 0 → 1,3 / maç)
  boslukDeger:0.1,             // alıcının önündeki boşluğa pasın ek değeri (MM3)
  ikinciTop:0.75,              // havadan pasta kaybın bedel çarpanı: kaybedilen hava topu çoğu zaman ikinci top olur (MM3)
  havaDeger:0.0,               // havadan pasın ek değeri (takımın 'direkt' ayarıyla +0–0,4) (MM3: eskiden −0,85; birleştirme 2026-10-03: −0,25 → 0)
  araDeger:0.3,                // ara pasının ek değeri (takımın 'direkt' ayarıyla 0,5–1,5 katı) (MM3)
  araDar:3,                    // dar pencereli ara pasının (alıcı savunmacıdan 0,25 sn'den az önde) değer cezası (puan / sn) (MM3)
  donusDeger:0.2,              // oyunun yönünü değiştiren pasın ek değeri (|Δz| ≥ 25 m) (MM3)
  ofsaytAlgi:1.4,              // ofsayt çizgisini görme hatası (m, görüş düşükse büyür): koşucunun çizgiyi geçip geçmediği yanılgısı (MM3)
  kosuIstegi:2.8,              // savunma arkasına derin koşuya çıkma sıklığı çarpanı (ara pası ve ofsayt; eskiden 1) (MM3; T1: 1,6 → 2,8)
  aliciPay:0.1,                // pas analizinde alıcının varış süresine eklenen pay (sn): varış modeli duran/dönen oyuncuda iyimser (MM3)
  uzaklastirDeger:0.0,         // uzaklaştırmanın taban değeri (baskıyla +1,1, ceza sahası yakınında +0,4; birleştirme 2026-10-03)
  hedefDeger:0.8,              // hedef forvete uzun topun ek değeri (takımın 'direkt' ayarıyla 0,4–1,4 katı; birleştirme 2026-10-03)
  /* T2 (2026-10-07, topla oyun) */
  devamAgirlik:0.6,            // pas değerinde alıcının devam değerinin oranın tehdidinden farkının payı (devamDegeri)
  devamHedef:0.4,              // hedef forvete uzun topta devam farkının ek çarpanı (değeri alan ve ikinci top belirler)
  sabir:[0.3,1.1],             // sabır eşiği (puan): topu tutmanın pasa göre ek değeri, takımın sakin/tempo ayarıyla bu aralıkta
  sabirSure:2.5,               // sabır eşiği topu tuttukça söner, bu kadar (sn) sonra sıfır
  devamPas:0.8,                // devam değerinde ileri pas ön puanının payı (ön puan tam analizden iyimser)
  bekleOran:0.8,               // yerinde bekleyen topun oranın tehdidinden koruduğu pay
  koruDeger:0.9,               // T4e: top saklama seçeneğine kalkanla çarpılan eğilim payı (puan; hedef forvetin "yerleş, bak, indir" alışkanlığı). Seçenek değerleri rakip yarıda 0–3 puan
                               // ölçeğindedir (c-koru dökümü). 40 maç taraması (2026-10-09): koruma süresi 0,45 → 6,8 sn, 0,9 → 10,4, 1,2 → 10,7 (doyar: sınırlayan tutma
                               // durumlarının sayısı, ~10/maç); asıl kol tutma olasılığı (koruSecenegi P0)
  koruSure:2.5,                // T4e: eğilim payının söndüğü tutma süresi (sn; bu sahiplikte topu tutma süresiyle doğrusal iner); 1,5 → 2,5 koruma 10,4 → 11,2
  koruTempo:0.2,               // T4e: tutma süresine bağlı tempo bedeli (puan/sn): top tutuldukça atak söner; uzun tutmayı (3 sn+) bitirir (0,3 → 0,2: PPDA 5,4 → 5,9)
  dusunHz:[5,8],               // topu tutarken düşünme sıklığı (1/sn; karar özelliğiyle): her anda seçenekler yeniden tartılır
  pasTol:[1.2,4,0.5],          // pas hatası toleransı: taban (m) + alıcının rakipten önce varma payı (sn) × katsayı; uzunluk hatasının payı
  pasTolHava:5.5,              // T10a: havadan topta en az tolerans (m) — topun indiği bölge: hücumcu ve savunmacı gerçek inişe birlikte ayar yapar, çekişme yer değiştirir (c-orta: 5 m'ye kadar sapma ilk temas payını değiştirmiyor, ötesinde yarıya iniyor)
  ortaDestek:0.15,             // T10a: ortanın inişine uçuş süresinde yetişebilen her diğer hücumcunun, alıcının kaybettiği toptaki payı (en çok 0,4; c-orta: topa ilk dokunan hücumcu alıcıdan ~8 puan çok)
  ikinciTopHedef:0.3,          // hedef forvete uzun topta kaybedilen düelloda topun takımda kalma olasılığı (kaybın bedelini azaltır)
  araKalib:0.85,               // ara pasının başarı olasılığı düzeltmesi (ölçülen; kök neden savunmacının varış modeli, T5)
  /* T4 (2026-10-08): rakibi geç */
  birebirMenzil:8,             // önündeki (±66°) savunmacı bu uzaklık içindeyse rakibi geç seçeneği tartılır (m; düelloya girmesi ayrıca aranır)
  birebirKayip:1.0,            // rakibi geçerken top kaybının bedel çarpanı
  birebirDeger:4.0,            // adam geçmenin ek değeri (puan; devam değeri onu eksik ölçer: savunma dağılmış, sürücü hızla gelir; araDeger kalıbı).
                               // T4 ölçümü: 3'te maç başına ~6, 4'te ~9 düello; başarı %47–52
  devamBirebir:1.0,            // (1c) alıcının önündeki tek savunmacıyı geçme devamının payı (devamDegeri; 0 kapatır)
  /* T9b (2026-10-10): vuruş modeli (gerçekçilik planı §4 T9 “Vuruş”) */
  gucHata:3.0,                 // yön hatası güçle büyür: çarpan (1 + gucHata·güç⁴), referans güçte 1. Dördüncü kuvvet: hata azami güce yaklaştıkça dikleşir
                               // (van den Tillaar ve Ulvik 2014: azami hıza çıkmak, isabete odaklanan vuruşa göre hatayı ~2 katına çıkarır, hız %20–25 artar)
  sutHiz:[23,9],               // şutun azami hızı (m/sn, uçuşun ortalama hızı) = a + b·sutGucu (23–32; çıkış hızı ~%5–8 fazla); seçilen güç ve stil payıyla çarpılır
  kotuVurus:[0.018,0.003],     // T9b-b: kötü vuruşun taban olasılığı [şut, pas] (duran top, şut/pas becerisi 0,6, baskısız, referans güçte; kotuVurusOlasiligi)
  sutUzak:0,                   // şutun yön hatası 12 m'den sonra metre başına bu kadar artar (1 + sutUzak·(L − 12)); MM-dönemi 0,04 (1/25); T12a: 0,02; T12c: 0 (sutSapma 1,3 ile)
  sutIkinci:1.2,               // T9b-c: gol olmayan şutun değeri (puan): dönen top ve korner (kurtarılan şutun ~%20'si korner, ~%15'i dönen top); kayıp 0,4 düşülür
  duranSapma:0.75,             // T12a: duran topta (serbest vuruş, penaltı) şutun hata çarpanı — açık oyunun sutSapma/sutUzak artışı duran topa uygulanmaz (T8 kapıları)
  duranUzak:0.04,              // T12a: duran topta hatanın mesafeyle büyümesi (eski sutUzak)
  sutDikey:1.0,                // T12a: açık oyunda 1 m ve üstüne nişanın yükseklik hatası, yanal hatanın açısı cinsinden (1: aynı açı — T8c serbest vuruş kuralı; alçak nişan 0,35·ky)
  ortaAyak:1,                  // T14c: ortanın planlayıcısı zayıf ayağın sapmasını bilir (vurusAyakK; 0: ayaksız eski sapma)
  devamOrta:1,                 // T14c: kanattaki alıcının orta devamının payı (devamDegeri; 0: kapalı)
  penaltiDurak:1,              // T15c (2026-10-14): penaltıda duraklı koşu (penaltiAtisi, vurusIlerle; 0: hep düz koşu, T14'ün yolu)
  /* H1a (2026-10-15; gerçekçilik planı §4 H1): taşıma yönleri (js/mac-karar.js tasimaSecenekleri). 0: yalnız 8 kaba yön, bedelsiz */
  tasiInce:1,
  tasiDevam:0.2,               // sürmekte olan yönden 45° (ve üstü) sapan taşımanın bedeli (puan; açıyla orantılı)
  /* H1c (2026-10-15; gerçekçilik planı §4 H1): bakış (taramaAdim). 0: eski — taramada bakış bir karede 100°'ye sıçrar, 0,28 sn kalır, geri sıçrar;
     her oyuncu hep aynı aralıkla, hep öbür yana tarar */
  bakisDinamik:1,
  bakisHiz:7,                  // bakışın gövdeye göre en çok dönüş hızı (rad/sn; ~400°/sn, çizimde başın sınırı STIL.animasyon.bas.hiz ile aynı)
  taramaAralik:[0.75,1.3],     // tarama aralığının tarama başına çarpanı (rastlantısız özet; ortalaması ~1: sıklık aynı, ritim düzensiz)
  taramaGenislik:[1.2,1.9],    // tarama genişliği, gövdeye göre (rad; eskiden hep 1,75)
  taramaTut:[0.12,0.32],       // bakışın taramanın yönüne vardıktan sonra orada kalma süresi (sn; eskiden toplam 0,28)
  taramaYan:0.7,               // taramanın yanının bir öncekinin tersi olma olasılığı (eskiden hep ters)
  bakisDonus:0.5,              // gövdenin hedefine bundan (rad) büyük dönüş kaldıkça bakış gövdenin hedefine bakar (gideceği yere bakma)
  /* T22 (2026-10-18; gerçekçilik planı §4 “2026-10-18 maç notları”): kanat hızı ve şut kütüphanesi */
  aliciRahat:0,                // T23a2 (2026-10-18; denendi, kapalı — 0,8 ile 40 maçta pas isabeti −3,8 ± 1,2 (sabit hızlı varış tahminiyle −10,6), toplam ivmelenme aynı
                               // (alıcınınki −0,2, başka yerde geri geliyor), eşzamanlı +0,18; kod kalır): rakipsiz ayağa yerden pasta (planın rakip payı ≥ bu kadar sn) alıcı en erken noktaya tam eforla fırlamaz: yoldaki
                               // ilk rahat noktaya (0,6 eforla toptan 0,1 sn önce varır, yolda ve orada rakip ≥ payla geride) efor 0,6, tepe hızın %62'siyle gider; 0: eski
  bakisHerKare:1,              // T23c (2026-10-18): kasıtlı büyük dönüşte (p.don.bt penceresi ya da gövdenin önünde bakisDonus'tan büyük dönüş) bakış her karede
                               // işlenir (boyun adımı geçen kare sayısıyla); öbür zamanlar iki karede bir; 0: hep iki karede bir
  gidisBakis:1.95,             // T23b (2026-10-18): gidiş kipinde (p.don.gm; js/mac-hareket.js hrkGidis) topa bakışın boyun sınırı (rad; eskiden ve öbür durumlarda 1,4)
  surukle:1,                   // T22a: sürükleme (basıp gitmek) — 15/22/30 m'lik uzun taşıma seçeneği (mac-karar.js surukleSecenegi), depar, top 2,8 m önde, 1,2 sn bağlılık; 0: yok
  surukleKanat:0.5,            // T22a: kanat oyuncusunun sürüklemesine ek değer (puan; kullanıcı notu: kanadın hızlanıp basıp gitmesi); 0: yok
  sutYeni:1,                   // T22b: şutta isabet–güç ödünleşimi (plase hata çarpanı 0,9 → 0,65, sert 1,0 → 1,15 — 0,55 / 1,3 denendi: sert %59 ama gol +0,6, gerçekleşen ÷ xG 1,35; serbest vuruş hariç) ve 9 m'den (eskiden 14) falso adayı; 0: eski
  /* T21 (2026-10-18; gerçekçilik planı §4 “2026-10-18 maç notları”): topun yolu — eğri, uzun top, orta */
  pasFalso:1,                  // T21b: pasın doğal eğrisi çarpanı — iç ayakla yerden pas 0,01–0,05 (boyla), dış ayakla ters yöne 0,05–0,09, iç ayakla uzun havadan 0,04–0,08; nişan
                               // yerdeki eğriyi telafi eder (yerPasVur). 0: eski (yerden pas ve uzun top dönüşsüz)
  uzunKosu:1,                  // T21c: koşana savunma arkasına havadan (boşluğa) pas adayı (≥ 15 m; eskiden yasak) ve boşluğa pasta yerden ↔ havadan ikili analiz; 0: eski
  verKacKalkis:0.05,           // Z4b (ver-kaç): koşuya çıkan pasörün vuruş takibi bu kadar (sn) sürer — pas verir vermez kalkar (0: eski 0,26)
  verKacTarz:1,                // Z4b: ver-kaç koşusunun sıklığı takımın tarzıyla (duvar pası ağırlığı; konumsal 1, ilişkisel 2, direkt 0,7; 0: tarzsız)
  bindirme:7,                  // Z4c (B.4, B.5): bit maskesi — 1 iç bindirme (tarzın bekIceri ≥ 0,5 iken kanat çizgideyse bek iç koridordan geçer), 2 bindirene pasın değeri
                               // (bindirmeDeger), 4 zamanlı bindirme (kanat rakibiyle yüz yüzeyken geçer, yoksa gerisinde destek); 0: eski (bek hep önde ve dışta, pas payı yok)
  bindirmeDeger:0.35,          // Z4c: bindiren (ya da içten bindiren) ve ileri koşan beke pasın ek değeri (puan; verKacDeger gibi)
  uzunBakis:0.3,               // Z4a (6. not): uzun pasın (≥ 28 m) hazırlığında bakış hedefe; temasa bu kadar (sn) kala topa döner (0: eski — bakış topta)
  uzunHaz:0.55,                // Z4a (6. not): baskısızken (< 0,3) uzun pasın hazırlığı en az bu kadar (sn): hedefe bakış ve 2–3 adımlık yaklaşma (0: eski)
  acmaDokunus:1,               // T21c: baskısızken uzun vuruştan (havadan ≥ 28 m, yerden ≥ 32 m) önce topu vuran ayağın önüne 1–1,5 m açma dokunuşu; 0: eski
  donusBos:0.5,                // T21c: oyunun yönünü değiştiren pasın (|Δz| ≥ 25 m) ek değeri, hedefte en yakın rakip 4 → 12 m uzaklaştıkça 0 → bu (puan; tarama 1,2: uzun havadan pas 7 → 17,6, şut −4; 0,3 / 0,5: 8,1 / 11,2); 0: eski (sabit donusDeger)
  ortaIkinci:0.15,             // T21d: ortanın değerine ikinci top — ilk teması alamayan ortada inişin tehdidinin (xT) bu payı; 0: eski
  ortaErken:1,                 // T21d: kanat ve bek kaleye 40 m'den (eskiden 30) orta seçeneğini tartar (erken orta); 0: eski
  tersKanat:1,                 // T21d: ters ayaklı kanat (sağda sol ayaklı, solda sağ ayaklı) son 35 m'de içe kesen taşımayı bu kadar (puan) daha değerli bulur; 0: eski
  /* T20b–c (2026-10-18; gerçekçilik planı §4 “2026-10-18 maç notları”): alış, vuruşa yaklaşma ve gelişine oyun */
  vurusYaklas:1,               // T20b: vuruş hazırlığında gövde önce gidilen yola bakar, topa yaklaştıkça (1,4 → 0,5 m) vuruş yönüne döner; vuruş yönünün tersine kaçan topu
                               // önce tabanla durdurur. 0: eski (hazırlığın ilk karesinden vuruş yönüne döner, arkaya pasta topu geri geri kovalar)
  pasAcik:2.2,                 // T20b: 30 m'ye dek yerden pasta gövdenin hedefe en çok sapması vurusHizalama × bu (iç ayakla açık beden; eskiden 1,35)
  pasDogal:0.45,               // T20b: yerden pasta isabet bedeli bu açının (rad) ötesinden başlar (iç ayakla 25°'lik açık beden doğal); 0: eski
  alisNiyet:1,                 // T23d1 (2026-10-18; gerçekçilik planı §4 T23, borç 26): iyi kontrolde gövde dokunuşla birlikte topun itildiği yöne döner (kontrol ve
                               // göğüs eylemi boyunca hedef dokunuşun yönü; kötü kontrolde topa bakar). Eskiden eylem boyunca gövde gelen topa — pasçıya — dönük
                               // kalıyor, yarı dönüşlü alışta top arkada kalıyordu (sürüşte top ≥ 0,15 sn arkada epizotlarının yarısı alıştan ≤ 0,5 sn); 0: eski
  alisCizgi:1,                 // T23d1 (2026-10-18): koşan alıcının (dokunuş yönündeki hızı > 1,5 m/sn) iyi kontrolünde top koşu çizgisine onun hızıyla (+0,4, en çok
                               // 6 m/sn) konur; iyi göğüs kontrolünde top dokunuş yönündeki hızıyla (0,8–5,5) düşer ve oyuncu eylem boyunca topu izler. Eskiden
                               // göğüste top 0,8 m/sn ile düşerken oyuncu 3–5 m/sn koşup topu geçiyordu (alış epizotlarının ~%40'ı); 0: eski
  alisYon:1,                   // T20b: yönlü ilk dokunuş (dokunusPlani) sonraki işin yönünü 1,2 ağırlıkla (eskiden 0,6) ve koşu yönünden sapmanın bedelini hızla tartar; 0: eski
  tekKoni:2.1,                 // T20c: gelişine pasın koni yarı açısı (rad) × (0,75 + 0,25·pas) — yönlendirme 90–120°; gelişine boşluğa pas açılır; 0: eski (0,6 + 0,35·pas)
  /* T17c (2026-10-16; gerçekçilik planı §4 T17): ortanın devam değeri — bloklanan orta kornere gidebilir; ortacı baskıdaki ortayı bırakmaz */
  ortaDevam:1,                 // T17c: ortanın değerine bloktan doğan korner eklenir ((1 − açıklık) × ortaBlokKorner × ortaKornerDeger); 0: T14c değeri (yalnız ilk temasın xG'si)
  ortaKornerDeger:3,           // T17c: kornerin değeri (P(gol)·100; gerçek korner xG'si ≈ 0,03, Opta takımları 0,016–0,067)
  ortaBlokKorner:0.4,          // T17c: bloklanan ortanın kornere gitme payı (planlayıcı; TEST — 40 maçta ölçülen değerle güncellenir, T17-0'da %20, n 5)
  ortaEsik:0.05,               // T17c: bu olasılığın (ilk temas + devam) altındaki orta düşünülmez (eskiden 0,1 sabit; bloklanması muhtemel ama kornere açık ortalar elenmesin)
  /* T17d (2026-10-16): geri çevirmenin tetiği ve yerden ortanın alım noktası */
  cizgiyeIn:1,                 // T17d: kanattaki alıcının (ve taşıyanın) devamında geri çevirme — son 22 m'de çizgi açıkken yay ve penaltı noktası önündeki arkadaşa yerden geri pas
                               // değeri (devamDegeri; tasimaYonu bunu okuduğu için çizgiye taşıma kendiliğinden tetiklenir); 0: T14c (yalnız havadan orta devamı)
  yerdenOrtaKesme:0.5          // T17d: yerden orta ve geri çevirmede alım noktasındaki rakibin kesme payının tavanı (pasAnaliz; eskiden bütün yerden paslarda 0,7) —
                               // T17-0: alıcının 1,5 m'inde rakip varken hücumun ilk teması %50, yokken %76; planlayıcı geri çevirmeyi −14,5, alçak sert ortayı −23,5 puan kötümser tahmin ediyordu
});
/* ---- T9b (2026-10-10; gerçekçilik planı §4 T9 “Vuruş”): vuruş modeli — saf, rastlantısız. Şut planı (js/mac-karar.js sutPlani), pas analizi
   (pasAnaliz) ve vuruş (sutVur, yerPasVur, havaPasVur) aynı işlevleri okur. Stilin payı: azami hıza göre hız (iç ayak plase en yavaşı, üst sert
   en hızlısı) ve yön hatası çarpanı ---- */
const VURUS_STIL={ic:{hiz:0.75,sap:1},ust:{hiz:1,sap:1},falso:{hiz:0.85,sap:1},asirtma:{hiz:0.55,sap:1},dis:{hiz:0.8,sap:1.22},burun:{hiz:0.8,sap:1.4},
  vole:{hiz:0.9,sap:1},yarimVole:{hiz:0.95,sap:1}};
/* güç çarpanının 1 olduğu güç: şutta 0,75 (eski plase türünün hatası; eski sert türü ~0,9 güce karşılık gelir), pasta 0,345 (20 m yerden pasın
   eski mesafe çarpanı 1 + L/200) */
const VURUS_GUC_REF={sut:0.75,pas:0.345};
/* yön hatasının güç çarpanı (1 + c·g⁴) / (1 + c·ref⁴) */
/* T12a (2026-10-12): şutun yön hatasının çarpanı — açık oyunda sutSapma·(1 + sutUzak·(L − 12)), duran topta (serbest vuruş, penaltı) duranSapma ve
   duranUzak (açık oyunun hatası T12a'da arttı; hazırlıklı duran topun hatası T8'deki gibi kalır) */
function sutHataK(L,duran){const A=MOTOR_AYAR;return duran?A.duranSapma*(1+Math.max(0,L-12)*A.duranUzak):A.sutSapma*(1+Math.max(0,L-12)*A.sutUzak);}
function gucHataCarpani(g,ref){const c=MOTOR_AYAR.gucHata,g2=g*g,r2=ref*ref;return(1+c*g2*g2)/(1+c*r2*r2);}
/* şutun azami hızı (m/sn; uçuşun ortalama hızı): sutGucu alt özelliğinden; zayıf ayakla azalır */
function sutHizTavani(p,zayif){const H=MOTOR_AYAR.sutHiz;return(H[0]+H[1]*profilAlt(p,'sutGucu',0.5))*(zayif?0.8+0.2*profilAlt(p,'zayifAyak',0.35):1);}
/* yerden ve havadan pasın gücü (0–1): yerden ilk hızın 29 m/sn'ye, havadan çıkış hızının 30 m/sn'ye oranı (e.guc ile aynı tanım) */
const pasGucu=(tip,v0,L,T)=>clamp(tip==='hava'?hyp(L/Math.max(0.3,T),G*T*0.5)/30:v0/29,0,1);
/* vuruşun yön hatası (rad, standart sapma). o: {sut, guc, ref, stil, zayif, hizalanma (rad), baski 0–1, acele 0–1, ilk (gelişine)} — teknik (şutta
   şut, pasta pas), baskı, ayak (dış ayak; zayıf ayak profilden: T9b-b, eskiden sabit 1,7), gövde hizası, gelişine ve havadaki top (vole), acele
   (T9b-b), yorgunluk, güç */
function vurusSapma(p,o){
  const oz=p.oz,tek=o.teknik!=null?o.teknik:o.sut?oz.sut:oz.pas,ayakK=o.stil==='dis'?1.22:o.zayif?1+1.2*(1-profilAlt(p,'zayifAyak',0.35)):1;
  const vole=o.stil==='vole'?(o.sut?1.3:1.5):o.stil==='yarimVole'?(o.sut?1.12:1.2):1,st=VURUS_STIL[o.stil];
  return(0.028+0.075*(1-tek))*(1+(o.baski||0)*0.9)*ayakK*(st&&o.stil!=='dis'?st.sap:1)*(1+(o.hizalanma||0)*0.9)*(o.ilk?1.35:1)*vole*(1+0.5*(o.acele||0))
    *(1+0.35*(p.yorgunluk||0))*gucHataCarpani(o.guc,o.ref)*(1-MOTOR_AYAR.guvenEtki*(p.guven||0));}   /* T10e: güven (js/mac-takim.js) */
/* T9b-b: kötü vuruş olasılığı (saf). Taban (MOTOR_AYAR.kotuVurus) duran topta, beceri 0,6, baskısız ve referans güçte; teknik, acele, baskı, zayıf
   ayak, gelen top (gelişine ×2,5, yarım vole ×6, vole ×7), yorgunluk, kötü ya da ıslak zemin, güç ve burunla vuruş artırır. Türü (altına
   girme, üstüne vurma, ayağın kenarı, ıska) vurusYap aynı zardan seçer */
function kotuVurusOlasiligi(p,o){
  const tek=o.sut?p.oz.sut:p.oz.pas,top=o.stil==='vole'?7:o.stil==='yarimVole'?6:o.ilk?2.5:1,K=MOTOR_AYAR.kotuVurus,g=o.guc==null?0.75:o.guc;
  return clamp((o.sut?K[0]:K[1])*(1.6-tek)*(1+1.5*(o.acele||0)+0.8*(o.baski||0))*(o.zayif?2.2:1)*top*(1+(p.yorgunluk||0))
    *(1+0.6*Math.max(0,0.7-(o.zemin==null?0.7:o.zemin))+0.5*(o.islak?1:0))*(0.6+0.8*g*g)/1.05*(o.stil==='burun'?1.5:1),0,0.5);}
/* vuruş stili (sözleşme: ic/dis/ust/asirtma/vole/yarimVole); vuruş anında topun yüksekliği ve şutun türüyle kesinleşir */
/* T4-V (2026-10-09; gerçekçilik planı §4 T4 madde 6, Ek G2): vuruş türüne göre geri salınım `geri` ve karar anından asgari hazırlık `haz` (sn);
   baskıda acele (kısa). Çizimin son adımı geri'ye, üst gövde hazırlığı haz'a sığar. Karar katmanı (pasSecenekleri t0: vuruşa kalan süre) ve
   vurusBaslat aynı tabloyu okur: pas hattının bu süre içinde kapanacağı karara girer. Gelişine vuruşta temas anını topun varışı belirler */
function vurusSureleri(tur,baski){let geri,haz;
  if(tur==='ilk'){geri=0.2;haz=0;}else if(tur==='ilkSut'){geri=0.24;haz=0;}
  else if(tur==='sut'){geri=0.33;haz=0.1;}else if(tur==='asirtma'){geri=0.3;haz=0.12;}
  else if(tur==='hava'){geri=0.39;haz=0.15;}else if(tur==='uzunYer'){geri=0.34;haz=0.14;}
  else{geri=0.26;haz=0.12;}
  return{geri:geri*(1-0.25*baski),haz:haz*(1-0.8*baski)};}
function vurusStili(sec,y){
  if(sec.yay==='asirtma')return 'asirtma';
  if(sec.ilk&&y>0.45)return 'vole';if(sec.ilk&&y>0.15)return 'yarimVole';
  if(sec.tur==='sut'||sec.tip==='hava'||sec.tur==='uzaklastir')return 'ust';
  return 'ic';}
Object.assign(Match.prototype,{
  /* topu alan oyuncunun karar süresi (sn): hazır planla (yönlü ilk dokunuş) çok kısa; yoksa takımın temposu, karar özelliği ve yorgunluk */
  kararSuresi(p){
    const pl=this.bVeri(p).plan;if(pl&&pl.hazir)return 0.1+0.1*(1-p.oz.karar);
    return lerp(MOTOR_AYAR.kararGecikme[1],MOTOR_AYAR.kararGecikme[0],this.taktik[p.team].tempo)+(1-p.oz.karar)*0.15+(p.yorgunluk||0)*0.12;
  },
  /* etrafa bakma (tarama): her oyuncu 2,5 − 1,8·görüş sn'de bir (top ona gelirken daha sık, topu sürerken daha seyrek) omzunun üstünden bakar,
     herkesin yerini ve hızını hafızaya alır. Baş: taramada gövdeden ±100°, yoksa topa (boyun ±80°). Rastlantısız; takımAI'dan önce.
     H1c (2026-10-15; bakisDinamik): bakış bir durumdur — gövdeye göre açısı hedefe en çok bakisHiz ile döner (eskiden bir karede sıçrıyordu), ±1,95
     rad'ı aşmaz; taramanın aralığı, genişliği, tutma süresi ve yanı tarama başına rastlantısız özetle (h2) değişir (ortalama sıklık aynı); kasıtlı büyük
     dönüşte (js/mac-hareket.js hrkGovdeDon: p.don.bt, hx) bakış önce yeni yöne gider, gövde arkadan gelir */
  taramaAdim(dt){
    const b=this.ball,P=this.players,n=P.length,PI=Math.PI,kare=this.kare||0,A=MOTOR_AYAR,BD=A.bakisDinamik;
    const HK=A.bakisHerKare&&BD;
    for(let i=0;i<n;i++){const p=P[i];if(!p.oyunda)continue;
      /* her oyuncu iki karede bir; T23c (bakisHerKare): kasıtlı büyük dönüşteki her karede */
      if((i+kare)&1){if(!HK)continue;const D=p.don;if(!(D&&D.ok&&(D.bt>this.t||Math.abs(aciFark(D.hx,p.yon))>A.bakisDonus)))continue;}
      let per=2.5-1.8*p.oz.gorus;
      /* topu süren seyrek bakar; topu ayağının altında bekleten (T2) seçenek arar, daha sık bakar */
      if(b.hedefOyuncu===p)per*=0.55;else if(b.sahip===p)per*=p.tavir==='bekle'?0.5:1.25;
      const v=this.bVeri(p);let T=v.tara;
      if(!T){T=v.tara={t:0,bas:-9,yan:p.n%2?1:-1,ok:false,k:0,carp:1,gen:1.75,sure:0.28,r:0,rOk:false,sk:-1,x:new Float64Array(n),z:new Float64Array(n),vx:new Float64Array(n),vz:new Float64Array(n)};
        T.t=this.t-((p.n*0.37+p.team*0.53)%1)*per;this.taramaKaydi(T);}
      if(this.t-T.t>=per*T.carp){this.taramaKaydi(T);T.t=this.t;T.bas=this.t;
        if(BD){const o=(p.team*131+p.n*17+(this.tohum|0)*7919)|0,k=++T.k;
          T.carp=lerp(A.taramaAralik[0],A.taramaAralik[1],h2(o,4*k));T.gen=lerp(A.taramaGenislik[0],A.taramaGenislik[1],h2(o,4*k+1));
          T.sure=T.gen/A.bakisHiz+lerp(A.taramaTut[0],A.taramaTut[1],h2(o,4*k+2));if(h2(o,4*k+3)<A.taramaYan)T.yan=-T.yan;}
        else T.yan=-T.yan;}
      let by;
      if(BD){/* bakış gövdeye göre bir açıdır (boyun: en çok ±1,95 rad, en çok bakisHiz ile döner; dünyadaki hızı gövdeninkiyle toplanır). Gideceği
           yere bakar: kasıtlı büyük dönüşün başında (bt) ve gövdenin önünde bakisDonus'tan büyük dönüş kaldıkça hedef açı gövdenin hedefidir —
           gövdenin döneceği yönde, boyun sınırına kadar (dünyada en kısa yoldan gidince bakış kimi dönüşte gövdenin tersine dönüyor, top arkadayken
           ±80°'de kıstırılıp gövdeyle birlikte dönüyordu; baş öne geçemiyordu) */
        const D=p.don,ve=p.eylem;let rt;
        /* Z4a (uzunBakis; 6. not): uzun pasın hazırlığında bakış hedefe — topu kafayı kaldırıp hedefe bakarak hazırlar, temasa uzunBakis kala topa iner */
        if(A.uzunBakis>0&&ve&&ve.ad==='vurus'&&ve.faz==='hazirlik'&&ve.sec&&ve.sec.tur!=='sut'&&ve.sec.hx!=null&&ve.kalan>A.uzunBakis&&hyp(ve.sec.hx-p.x,ve.sec.hz-p.z)>=28)rt=aciFark(Math.atan2(ve.sec.hz-p.z,ve.sec.hx-p.x),p.yon);
        else if(D.ok&&(D.bt>this.t||Math.abs(aciFark(D.hx,p.yon))>A.bakisDonus))rt=aciFark(D.hx,p.yon);
        else if(this.t-T.bas<T.sure)rt=T.yan*T.gen;
        else{rt=aciFark(Math.atan2(b.z-p.z,b.x-p.x),p.yon);const L=D.gm&&A.gidisGovde?A.gidisBakis:1.4;if(rt>L)rt=L;else if(rt<-L)rt=-L;}   /* T23b: gidisBakis */
        if(rt>1.95)rt=1.95;else if(rt<-1.95)rt=-1.95;
        /* gövdeye göre açı durumu (T.r): boyun en çok bakisHiz ile döner; ilk kez ya da bakış başka yerden yazıldıysa (maç başı) bakıştan alınır */
        if(!T.rOk){const o0=p.bakisYon;T.r=o0==null?rt:aciFark(o0,p.yon);T.rOk=true;}
        let r0=T.r;if(r0>1.95)r0=1.95;else if(r0<-1.95)r0=-1.95;
        let kk=2;if(HK){kk=T.sk>=0?Math.min(2,kare-T.sk):2;T.sk=kare;}   /* T23c: boyun adımı geçen kare sayısıyla */
        const lim=A.bakisHiz*kk*dt,f=rt-r0;T.r=r0+(f>lim?lim:f<-lim?-lim:f);by=p.yon+T.r;}
      else if(this.t-T.bas<0.28)by=p.yon+T.yan*1.75;
      else{let f=Math.atan2(b.z-p.z,b.x-p.x)-p.yon;if(f>PI)f-=2*PI;else if(f<-PI)f+=2*PI;by=p.yon+(f>1.4?1.4:f<-1.4?-1.4:f);}
      if(by>PI)by-=2*PI;else if(by<-PI)by+=2*PI;
      p.bakisYon=by;}
  },
  /* oyuncuya özel B verisi: {tara: tarama hafızası, plan: yönlü ilk dokunuş planı, vk: ver-kaç koşusu, gur: kararın sahiplik boyu sapması (T2),
     yakinR/yakinNo: en yakın rakibin önceki uzaklığı ve sahiplik (T2 olay)} */
  bVeri(p){let M=this._bv;if(!M)M=this._bv=new Map();let v=M.get(p);if(!v){v={tara:null,plan:null,vk:null,gur:null,yakinR:9,yakinNo:-1,vazT:-9,enPas:null};M.set(p,v);}return v;},
  /* düşünme aralığı (T2): topu tutarken seçenekler 5–8 Hz'de yeniden tartılır (karar özelliği yüksek oyuncu daha sık) */
  dusunmeAraligi(p){const H=MOTOR_AYAR.dusunHz;return 1/(H[0]+(H[1]-H[0])*p.oz.karar);},
  taramaKaydi(T){const P=this.players;for(let j=0;j<P.length;j++){const q=P[j];T.x[j]=q.x;T.z[j]=q.z;T.vx[j]=q.vx;T.vz[j]=q.vz;}T.ok=true;},
  /* vuruş zinciri. sec: {tur, hx, hz, tip, alici, ilk (gelişine), mod (hedef tazeleme: ayak/bosluk/ara), varisHizi, T, hy, yay}.
     Önce hazırlık: hedefe dön, topu vuran ayağın önüne al */
  vurusBaslat(p,sec){
    const b=this.ball;let ox=b.x,oz=b.z;
    /* T6d: havadan ortada alıcı ortanın noktasına koşar (vuruş hazırlığı ~0,5 sn; ortayı yapan koşuyu okur, hücumcu ortaya koşar — eskiden alıcı
       ortadan habersiz kendi koşusunu sürdürüp top havalanınca başın hizasındaki noktaya yetişemiyordu). Koşu takım düzeninde (bolgeKonumu) */
    if(sec.tur==='orta'&&sec.tip==='hava'&&sec.alici&&sec.alici.oyunda&&sec.alici.team===p.team){const d=this.dir[p.team];sec.alici.kosu={u:sec.hx*d,w:sec.hz,t:2.0,tur:'orta'};}
    /* T14b: açık oyunda orta ve geri çevirmede forvet dışı oyuncular kutuya geç girer (js/mac-takim.js gecGirisAta) */
    if((sec.tur==='orta'||sec.tur==='geriCevir')&&!sec.duran)this.gecGirisAta(p,sec);
    if(sec.ilk&&hyp(b.vx,b.vz)>2&&hyp(b.x-p.x,b.z-p.z)>1.2){const k=this.yakalamaNoktasi(p,1.0);ox=k.x;oz=k.z;}
    const a=Math.atan2(sec.hz-oz,sec.hx-ox),f=aciFark(a,p.yon),L=hyp(sec.hx-ox,sec.hz-oz),tip=sec.tip||'yer',sut=sec.tur==='sut',uzk=sec.tur==='uzaklastir',
      hava=tip==='hava',baski=baskiAltinda(this,p);
    /* T20b (vurusYaklas): 3 m/sn'den hızlı koşan topun sahibi gidişinden 110°'den çok dönen pas ve uzun topa başlamaz: önce topla yavaşlar (sürüş niyeti
       gidiş yönünde, hız 0,25), 0,2 sn sonra yeniden karar verir. Eskiden gövde pas yönüne dönüyor, oyuncu topu geri geri kovalayıp yetişemiyor ya da topu
       durdurup geçiyordu (T20-0: maç başına ~20 terk edilen hazırlık; şut, gelişine vuruş ve duran top hariç) */
    if(MOTOR_AYAR.vurusYaklas&&!sut&&!sec.ilk&&!sec.duran&&!sec.penalti&&b.sahip===p&&p.spd>3&&Math.abs(aciFark(a,Math.atan2(p.vz,p.vx)))>1.9){
      p.surus={yon:Math.atan2(p.vz,p.vx),hiz:0.25};p.kararT=0.2;return;}
    /* ayak (T4-V, tek zar): hedef güçlü ayağın dış tarafında ve açı orta büyüklükteyse çoğu zaman dış ayak (zayıf ayağı zorlamaz); hedef çok
       yandaysa o yanın iç ayağı (f > 0: hedef sağda → sol ayağın içi) ya da top gövdenin zayıf ayak yanındaysa (≥ 0,18 m) zayıf ayakla vuruş: olasılık
       profilin zayıf ayağına ve kaçınma eğilimine göre, hedef ters yandaysa, baskıda ve şutta değişir; zar tutmazsa güçlü ayak (hazırlık hedefi
       gövdeyi öbür yana kaydırır: ayar adımı kendiliğinden ve zaman alır). İki ayaklı: topun yanındaki ayak, hedef çok yandaysa o yanın içi */
    /* hazırlık süreleri (T4-V): vurusSureleri tablosu; vazgeçmeden 0,6 sn içinde yeniden başlayan vuruş beklemez */
    const vsr=vurusSureleri(sec.ilk?(sut?'ilkSut':'ilk'):sut?'sut':hava&&sec.yay==='asirtma'?'asirtma':hava||uzk?'hava':L>22?'uzunYer':'pas',baski);
    /* T9b-b: acele (açık oyunda şut) — en yakın rakip saha oyuncusu topa (müdahale erimi 0,9 m) vuruşun temasından (asgari hazırlık + geri salınım
       + gövdenin dönüşü) önce varacaksa şutçu aceleyle vurur: geri salınım ve asgari hazırlık kısalır, hizalanma sınırı gevşer (vurusIlerle), yön
       hatası artar ve azami güç düşer (vurusSapma, sutPlani); rakip 0,3 sn içindeyse burunla dürter. Sözleşme: vurus.acele (0–1) */
    let acele=0,tR=9;
    if(sut&&!sec.penalti&&!sec.serbest){for(const o of this.teams[1-p.team]){if(!o.oyunda||o.rol==='GK')continue;const t=varisSuresi(o,ox,oz,0.9);if(t<tR)tR=t;}
      const don=Math.max(0,Math.abs(f)-MOTOR_AYAR.vurusHizalama)/hrkVurusDonus(p);acele=clamp((vsr.haz+vsr.geri+don-tR+0.1)/0.4,0,1);}
    const burun=sut&&!sec.ilk&&acele>0.75&&tR<0.3;
    /* ayak (T4-V, tek zar): hedef güçlü ayağın dış tarafında ve açı orta büyüklükteyse çoğu zaman dış ayak (zayıf ayağı zorlamaz); hedef çok
       yandaysa o yanın iç ayağı (f > 0: hedef sağda → sol ayağın içi) ya da top gövdenin zayıf ayak yanındaysa (≥ 0,18 m) zayıf ayakla vuruş: olasılık
       profilin zayıf ayağına ve kaçınma eğilimine göre, hedef ters yandaysa, baskıda ve şutta değişir; zar tutmazsa güçlü ayak (hazırlık hedefi
       gövdeyi öbür yana kaydırır: ayar adımı kendiliğinden ve zaman alır). İki ayaklı: topun yanındaki ayak, hedef çok yandaysa o yanın içi.
       T9b-b (açık beden, T4f devri): şutta zayıf ayak zamana göre — zaman varsa güçlü ayağa ayar adımı (olasılık × 0,6), acelede zayıf ayak (× 1,4) */
    let ayak=p.ayak,stil=null;const zar=this.rast(),yanU=Math.cos(p.yon)*(b.z-p.z)-Math.sin(p.yon)*(b.x-p.x),yakin=Math.abs(yanU)>0.18?(yanU>0?'sag':'sol'):null;
    if(p.ayak==='iki')ayak=Math.abs(f)>0.9||!yakin?(f>0?'sol':'sag'):yakin;
    else{const dis=p.ayak==='sag'?f>0:f<0,zayif=p.ayak==='sag'?'sol':'sag',geo=Math.abs(f)>0.9?(f>0?'sol':'sag'):null;
      if(dis&&!sut&&!uzk&&tip==='yer'&&Math.abs(f)>0.45&&Math.abs(f)<1.4&&zar<0.3+0.5*p.oz.pas)stil='dis';
      else if(geo===zayif||yakin===zayif){
        let P=clamp(0.1+0.45*profilAlt(p,'zayifAyak',0.35)-0.25*profilEgilim(p,'zayifAyaktanKacinir'),0.05,0.8);
        if(geo===zayif)P*=1.3;if(baski>0.5)P*=1.25;if(sut)P*=0.8*(0.6+0.8*acele);
        if(zar<P)ayak=zayif;}}
    if(sec.ayak)ayak=sec.ayak;   /* Z2b/Z2c: duran topun vurucusu güçlü ayağıyla (sahnenin seçtiği dönüş; zar yine çekildi) */
    const geri=burun?Math.min(0.14,vsr.geri):vsr.geri*(1-0.35*acele);let hazEn=vsr.haz*(1-acele);if(this.t-this.bVeri(p).vazT<0.6)hazEn=0;
    /* planlanan güç (çizim temastan önce okur; uzun yerden pasta gerilme): yerden pasta plandan, temasta kesinleşir (yerPasVur: v > 20 → üst) */
    let gucPlan=sut?0.85:hava||uzk?0.7:0.5,st=stil||vurusStili(sec,b.y),sutPlan=null;
    if(tip==='yer'&&!sut&&!uzk){gucPlan=clamp(pasPlani(this,Math.max(0.5,L),'yer',sec.varisHizi||pasVarisHizi(L)).v0/29,0,1);if(gucPlan*29>20&&st==='ic')st='ust';}
    /* T9b-a: şutun türü ve gücü hazırlığın başında planlanır (sutPlani: hedef × tür × güç); çizim gerilmeyi planın gücünden okur. Hedef temasta aynı
       tür ve güçle tazelenir (sutVur). sec.guc gücü sabitler (senaryo; duran topta T8). Penaltı ayrı (T8). T9b-b: burunla dürtmede tür sert, stil burun */
    if(sut&&!sec.penalti){const zy=p.ayak!=='iki'&&ayak!==p.ayak,R=VURUS_GUC_REF.sut;
      const sd0=vurusSapma(p,{sut:true,guc:R,ref:R,stil:burun?'burun':'ust',zayif:zy,baski,acele,ilk:!!sec.ilk})*sutHataK(L,!!sec.serbest);
      const pl=sutPlani(this,p,ox,oz,sd0,{serbest:sec.serbest,guc:sec.guc,zayif:zy,acele,tur:burun?'sert':null,stil:burun?'burun':null,ayak});
      sutPlan={tur:pl.tur,g:pl.g};gucPlan=pl.g;if(!sec.ilk)st=pl.stil;}
    /* T21c (acmaDokunus): baskısızken uzun vuruştan önce topu vuran ayağın önüne açar (stoper bakar, bir iki adım açar, gerilir, vurur); hazırlık 0,45 sn uzar */
    const acma=MOTOR_AYAR.acmaDokunus&&!sut&&!uzk&&!sec.ilk&&!sec.duran&&!sec.penalti&&(hava&&L>=28||tip==='yer'&&L>=32)&&baski<0.3&&b.sahip===p&&hyp(b.vx,b.vz)<1.5&&hyp(b.x-p.x,b.z-p.z)<0.9?{yapildi:false}:null;
    if(acma)hazEn+=0.45;
    /* Z4a (uzunHaz; 6. not): baskısızken uzun pas (≥ 28 m) aceleyle çıkmaz — hazırlık en az uzunHaz: kafa kalkar, hedefe bakılır, 2–3 adımla gelinir */
    if(MOTOR_AYAR.uzunHaz>0&&!sut&&!sec.ilk&&!sec.duran&&!sec.penalti&&L>=28&&baski<0.3&&hazEn<MOTOR_AYAR.uzunHaz)hazEn=MOTOR_AYAR.uzunHaz;
    /* sözleşme (TEKNIK_PLAN §8): kalan = temasa kalan süre (her adımda motor yazar, çizim okur), hazirlikT = hazırlıktan geri salınıma geçiş anı */
    p.eylem={ad:'vurus',faz:'hazirlik',t:0,ft:0,sec,ayak,stil:st,guc:0,tekDokunus:!!sec.tekDokunus,geri,hazirlikEn:hazEn,hazirlikT:null,kalan:hazEn+geri,baski,gucPlan,sutPlan,
      acele,kotu:null,kotuU:0,kotuP:0,acma};
    p.surus=null;
  },
  vurusIlerle(p,e,dt){
    const b=this.ball,sec=e.sec;e.ft+=dt;
    if(e.faz==='hazirlik'){
      /* hedef hazırlıkta tazelenir (gelişine vuruşta yalnız vuruş anında) */
      if(sec.guncelle&&!sec.ilk)this.hedefGuncelle(p,sec);
      /* gelişine vuruşta yön karşılama noktasından ölçülür */
      const topHiz=hyp(b.vx,b.vz);let k=null;if(sec.ilk&&topHiz>2)k=this.yakalamaNoktasi(p,1.0);
      const a=k?Math.atan2(sec.hz-k.z,sec.hx-k.x):Math.atan2(sec.hz-b.z,sec.hx-b.x),c=Math.cos(a),s=Math.sin(a),yan=e.ayak==='sag'?1:-1;
      /* vuran ayak topun arkasında, destek ayağı yanında: gövde topun biraz gerisinde ve yanında */
      const on=sec.ilk?0.42:0.34;let px=b.x-c*on-(-s)*0.13*yan,pz=b.z-s*on-c*0.13*yan;
      /* T20b (vurusYaklas): duran ya da yavaş topta (≤ 1,2 m/sn) gövdenin yeri vuruş doğrultusunun tam arkası değil, geçerli vuruş yayının (pasta ±0,6, şutta ±0,25 rad)
         oyuncuya en yakın noktası — eskiden 90–110° dönüşte oyuncu topun etrafından tam arkaya yürüyor, bu yürüyüş son yüzüne göre geriye düşüyordu */
      if(MOTOR_AYAR.vurusYaklas&&!sec.ilk&&topHiz<=1.2){const tv=sec.tur==='sut'?0.25:0.6;let en=hyp(px-p.x,pz-p.z);
        for(let i=-3;i<=3;i++){if(!i)continue;const t=a+tv*i/3,ct=Math.cos(t),st=Math.sin(t),qx=b.x-ct*on-(-st)*0.13*yan,qz=b.z-st*on-ct*0.13*yan,dq=hyp(qx-p.x,qz-p.z);if(dq<en){en=dq;px=qx;pz=qz;}}}
      const ax=p.x+Math.cos(p.yon)*0.3,az=p.z+Math.sin(p.yon)*0.3,ayakD=hyp(b.x-ax,b.z-az);
      /* T9b-b (hazırlık kalitesi): önünden kaçan topa (son dokunuşla yuvarlanan; 1,2 m/sn'den hızlı) tam eforla ve topun varacağı yere koşar.
         Eskiden topun 0,12 sn önüne ve baskısızken 0,6 eforla gidiyordu: top ondan hızlı yuvarlanınca yetişemiyor, şut süresi dolup bitiyordu
         (başlayıp vurulmayan şutların yarısı; ayak–top 0,7–1,7 m, gövde hizalı) */
      /* T21c: açma dokunuşu — top vuran ayağın önüne ve biraz o yana 1,2 m itilir, oyuncu peşinden gidip vurur */
      if(e.acma&&!e.acma.yapildi&&ayakD<0.6&&b.y<0.2){e.acma.yapildi=true;const ya=aciNorm(a+(e.ayak==='sag'?0.35:-0.35)),v0=hrkItmeHizi(1.2,0.55,this.R);
        b.vx=Math.cos(ya)*v0;b.vz=Math.sin(ya)*v0;this.dokunus(p,true);p.sonDokunus={t:this.t,tur:'surus',ayak:e.ayak,yuzey:'ic'};}
      const kacan=!k&&topHiz>1.2&&ayakD>0.4,on2=kacan?clamp(ayakD/4,0.12,0.6):0.12;
      if(k){/* gelişine: topun yoluna gir */p.tx=k.x-c*on;p.tz=k.z-s*on;}
      else{p.tx=px+b.vx*on2;p.tz=pz+b.vz*on2;}
      /* T20b (vurusYaklas): yaklaşmada gövde gidilen yola bakar, topa yaklaştıkça (hedefe 1,4 → 0,5 m) vuruş yönüne döner. Eskiden hazırlığın ilk karesinden
         vuruş yönüne dönüyordu: koşarken arkaya verilen pasta oyuncu topu geri geri kovalıyor, yetişemeyip vuruştan vazgeçiyordu (T20-0: maç başına ~20). Vuruş
         yönünün tersine (> 100°) kaçan topa yavaş oyuncu (< 2,2 m/sn) yetişince tabanla durdurur (sonDokunus 'cekme'), sonra döner; hızlı koşan oyuncu böyle bir
         pasa hiç başlamaz (vurusBaslat: önce topla yavaşlar) */
      let yuz=a;
      if(MOTOR_AYAR.vurusYaklas&&!k){const gx=p.tx-p.x,gz=p.tz-p.z,gd=hyp(gx,gz),w=clamp((gd-0.5)/0.9,0,1);if(w>0)yuz=aciNorm(a+aciFark(Math.atan2(gz,gx),a)*w);
        /* büyük dönüşte (> 110° gidişten) önce durur: hızı 0,8 m/sn'nin üstündeyken gövde gidiş yönüne bakar ve tam güçle frenler, sonra döner (eskiden gövde
           0,2 sn'de 100° dönüyor, oyuncu 2 m/sn ile eski yönünde geriye kayıyordu) */
        if(p.spd>0.8&&sec.tur!=='sut'){const vA=Math.atan2(p.vz,p.vx);if(Math.abs(aciFark(a,vA))>1.9){
          /* hazırlık sürerken hızlanan topun sahibi (> 3 m/sn) pası bırakıp topla yavaşlar (vurusBaslat'taki kuralın aynısı; e._yavas ölçüm için) */
          if(p.spd>3&&b.sahip===p&&!sec.duran&&!sec.penalti){e._yavas=true;p.eylem=null;p.yonHedef=null;p.surus={yon:vA,hiz:0.25};p.kararT=0.2;return;}
          const wv=clamp((p.spd-0.8)/1.2,0,1);yuz=aciNorm(yuz+aciFark(vA,yuz)*wv);this.eforVer(p,1);}}
        if(!e.durdu&&topHiz>1.2&&p.spd<2.2&&ayakD<0.6&&b.y<0.3&&Math.abs(aciFark(Math.atan2(b.vz,b.vx),a))>1.75){e.durdu=true;b.vx*=0.15;b.vz*=0.15;this.dokunus(p,true);
          p.sonDokunus={t:this.t,tur:'surus',ayak:e.ayak,yuzey:'taban',donus:true,hareket:'cekme'};}}
      p.hizOran=1;p.yonHedef=yuz;p.bak=null;this.eforVer(p,k||kacan||baskiAltinda(this,p)>0.3?1:0.6);   /* T1: baskısız duran topa sakin yaklaşır */
      /* T20b: topun dibinde büyük dönüş sürerken kısa ve yavaş adımlar (destek ayağına basıp kalçayla döner; eskiden 1,5–2 m/sn ile dönerek kayıyordu) */
      if(MOTOR_AYAR.vurusYaklas&&!k&&!kacan&&hyp(p.tx-p.x,p.tz-p.z)<0.9&&Math.abs(aciFark(a,p.yon))>0.6)p.hizOran=0.35;
      if(kacan){p._varisHiz=0.95*topHiz+0.3;p._varisKare=this.kare;}   /* topun hızıyla varır (sürüşteki gibi; durmak için yavaşlamaz) */
      /* T9b-b: acelede hizalanma sınırı gevşer (gövde tam dönmeden vurur; hata vurusSapma'nın hizalanma çarpanında). T9b-c (30–45° açılı yaklaşma,
         T4-V devri): üst ve falso şutu açıyla yaklaşarak vurulur — sınır 1,6 katı, hatanın hizalanma payı doğal açının (0,3 rad) ötesinden */
      const sutA=sec.tur==='sut'&&(e.stil==='ust'||e.stil==='falso'||e.stil==='dis');
      const yerPas=sec.tur!=='sut'&&sec.tur!=='uzaklastir'&&(sec.tip||'yer')==='yer'&&hyp(sec.hx-b.x,sec.hz-b.z)<=30;   /* T20b: pasAcik yalnız 30 m'ye dek yerden pasta */
      const sapma=Math.abs(aciFark(a,p.yon)),sinir=sec.ilk?(MOTOR_AYAR.tekKoni?1.45:1.05):e.stil==='dis'&&sec.tur!=='sut'?0.85:MOTOR_AYAR.vurusHizalama*(sec.tur!=='sut'&&sec.tur!=='uzaklastir'?(yerPas?MOTOR_AYAR.pasAcik:1.35):(1+0.6*(e.acele||0))*(sutA?1.6:1));
      /* hareketli top: ayağa ne zaman gelir (yol boyunca uzaklık / hız) ve yoldan ne kadar yanda */
      let gelir=false;if(topHiz>1.5){const yol=((ax-b.x)*b.vx+(az-b.z)*b.vz)/topHiz,yan2=Math.abs((ax-b.x)*b.vz-(az-b.z)*b.vx)/topHiz;
        gelir=yol>0&&yol/topHiz<=e.geri+0.03&&yan2<0.45;}
      /* T4-V: temasa kalan süre (çizim okur, tahmin etmez): asgari hazırlığın kalanı, hizalanma süresi ya da ayağa varış süresi + geri salınım */
      const w=hrkVurusDonus(p),donT=sapma>sinir?(sapma-sinir)/w:0,varT=ayakD>0.5&&!(sec.ilk&&gelir)?(ayakD-0.5)/Math.max(0.7,p.spd):0;
      e.kalan=Math.max(e.hazirlikEn-e.t,donT,varT)+e.geri;
      /* T15c: duraklı penaltı koşusu — topa 1,6 m kala vuran durur (e.kosu 'durak'; çizim tereddüt pozunu okur), 0,3–0,5 sn sonra tam eforla
         yeniden koşar (e.kosu 'devam'); duraklama bitince kaleci kalkmışsa ve plan onun yanıysa öbür köşeye döner (penaltiDonus). Kalan süre
         duraklamayı içerir (kaleci okur: kaleciPenaltiErken) */
      if(sec.penalti&&sec.kosu==='durakli'&&!e.durakBitti){
        if(!e.durak&&ayakD<1.6)e.durak={t:0,sure:0.3+0.2*profilAlt(p,'sogukkanlilik',p.oz.karar)};
        if(e.durak){e.durak.t+=dt;e.kosu='durak';p.tx=p.x;p.tz=p.z;p.hizOran=0.2;this.eforVer(p,0.5);e.kalan+=Math.max(0,e.durak.sure-e.durak.t);
          if(e.durak.t>=e.durak.sure){e.durakBitti=true;e.kosu='devam';this.penaltiDonus(p,sec);}else return;}}
      if(e.durakBitti)this.eforVer(p,1);
      if(sapma<sinir&&(ayakD<(sec.ilk?0.62:0.5)||(sec.ilk&&gelir))&&b.y<(sec.tur==='sut'||sec.ilk?1.1:0.6)&&e.t>=e.hazirlikEn){
        /* son an kontrolü: yerden pas hattı bu arada kapandıysa pastan vazgeç, yeniden karar ver (0,6 sn içinde yeniden başlayan vuruş beklemez) */
        if(sec.tip==='yer'&&sec.tur!=='sut'&&!sec.ilk&&this.hatKapali(p,a)){p.eylem=null;p.yonHedef=null;p.kararT=0.05;this.bVeri(p).vazT=this.t;this.on('vazgecti',{p});return;}
        e.faz='geri';e.ft=0;e.hizalanma=sutA?Math.max(0,sapma-0.3):sapma;e.sabit=sec.ilk&&topHiz>1.5;e.hazirlikT=e.t;e.kalan=e.geri;}
      /* T8a: duran topta kullanan 3–7 m geriden koşar (sec.duran; koşuya 2,5 sn ek süre) */
      else if(e.t>(sec.ilk?2.2:1.3+e.hazirlikEn+(sec.duran?2.5:0)+(e.durak?e.durak.sure:0))){p.eylem=null;p.yonHedef=null;p.kararT=0;if(b.sahip===p&&b.hedefOyuncu)b.hedefOyuncu=null;}
    }else if(e.faz==='geri'){
      /* T20b (vurusYaklas): geri salınımda duran ya da yavaş top erişimdeyse oyuncu olduğu yerde basar (eskiden topu önüne almak için geriye adım atıyordu) */
      if(!e.sabit){const ax0=p.x+Math.cos(p.yon)*0.3,az0=p.z+Math.sin(p.yon)*0.3;
        if(MOTOR_AYAR.vurusYaklas&&hyp(b.vx,b.vz)<0.5&&hyp(b.x-ax0,b.z-az0)<0.75){p.tx=p.x;p.tz=p.z;this.eforVer(p,1);}
        else{p.tx=b.x+b.vx*0.1-Math.cos(p.yon)*0.3;p.tz=b.z+b.vz*0.1-Math.sin(p.yon)*0.3;}}
      /* T4-V: geri salınımın temasa 0,12 sn kalana dek olan kısmında yerden pas hattı kapanırsa pasör vuruştan vazgeçer (gerçekte pas o ana dek
         iptal edilebilir). Eski 0,11 sn'lik salınımda bu pencere yoktu; uzayan salınımda hatta giren rakip pası kesiyordu (kesilen pas %34 → 43) */
      if(!e.sabit&&sec.tip==='yer'&&sec.tur!=='sut'&&!sec.ilk&&e.ft<e.geri-0.12&&this.hatKapali(p,Math.atan2(sec.hz-b.z,sec.hx-b.x))){
        p.eylem=null;p.yonHedef=null;p.kararT=0.05;this.bVeri(p).vazT=this.t;this.on('vazgecti',{p});return;}
      /* gelişine: top ayağın hizasını geçerken vur (salınım bitmeden önce gelirse beklemez) */
      let gecti=false;e.kalan=Math.max(0,e.geri-e.ft);
      if(e.sabit){const ax=p.x+Math.cos(p.yon)*0.3,az=p.z+Math.sin(p.yon)*0.3,dot=(ax-b.x)*b.vx+(az-b.z)*b.vz,v2=b.vx*b.vx+b.vz*b.vz;
        if(e.ft>=0.05)gecti=dot<=0;if(dot>0&&v2>2.25)e.kalan=Math.min(e.kalan,dot/v2);}
      if(e.ft>=e.geri||gecti){
        const ayakD=hyp(b.x-(p.x+Math.cos(p.yon)*0.3),b.z-(p.z+Math.sin(p.yon)*0.3));
        if(ayakD<0.85&&b.y<1.2&&!b.tasiyan&&this.phase!=='goal'){this.vurusYap(p,e);e.faz='takip';e.ft=0;e.kalan=0;}
        else{p.eylem=null;p.yonHedef=null;p.kararT=0;}
      }
    }else if(e.ft>=(MOTOR_AYAR.verKacKalkis>0&&this.bVeri(p).vk?MOTOR_AYAR.verKacKalkis:0.26)){p.eylem=null;p.yonHedef=null;}   /* Z4b: ver-kaç koşusu takibi kısaltır */
  },
  /* pas hattının ilk metrelerinde rakip bacağı var mı */
  hatKapali(p,a){const b=this.ball,ux=Math.cos(a),uz=Math.sin(a);
    for(const o of this.teams[1-p.team]){if(!o.oyunda)continue;if(segD(o.x,o.z,b.x,b.z,b.x+ux*4,b.z+uz*4)<0.7)return true;}return false;},
  /* topa vur: hedef son kez tazelenir, gövde hizası ve stil kesinleşir; türüne göre şut, yerden pas ya da havadan vuruş */
  vurusYap(p,e){
    const sec=e.sec,b=this.ball;
    if(sec.guncelle&&sec.tur!=='sut')this.hedefGuncelle(p,sec);
    if(sec.tur!=='sut'){const sap=Math.abs(aciFark(Math.atan2(sec.hz-b.z,sec.hx-b.x),p.yon));
      /* dış ayak ve gelişine iç ayak, gövdeyi tam çevirmeden açılı vurur */
      e.hizalanma=e.stil==='dis'?Math.max(0,sap-0.6):sec.ilk?Math.max(0,sap-0.4):(sec.tip||'yer')==='yer'?Math.max(0,sap-MOTOR_AYAR.pasDogal):sap;}   /* T20b: pasDogal */
    if(e.stil!=='asirtma'&&e.stil!=='dis'&&e.stil!=='burun'){if(b.y>0.45)e.stil='vole';else if(b.y>0.15&&sec.ilk)e.stil='yarimVole';}
    /* T10b: yüksek ayak (tehlikeli oyun): baş hizasındaki topa (≥ 1,3 m) ayakla vurulurken rakip 1 m içindeyse ve hakem görürse vuruş olmaz,
       rakibe dolaylı serbest vuruş (js/mac-mudahale.js yuksekAyak) */
    if(b.y>=1.3&&this.yuksekAyak(p))return;
    /* T9b-b: kötü vuruş (tek zar; gerçekçilik planı §4 T9 “Vuruş” 4): olasılık kotuVurusOlasiligi'ndan, türü aynı zarın içinden — gelen ya da
       havadaki topta ıska %25, altına girme %35, üstüne vurma %15, ayağın kenarı %25; duran topta altına %40, üstüne %30, kenar %30. Etkisi vuruş
       işlevlerinde (sutVur, yerPasVur, havaPasVur); ıskada top değmez. Sözleşme: vurus.kotu, olay 'kotuVurus' {p, tur, sut} */
    {const sut=sec.tur==='sut',zy=p.ayak!=='iki'&&e.ayak!==p.ayak,g=sut?(e.sutPlan?e.sutPlan.g:0.85):e.gucPlan||0.5;
      const Pk=kotuVurusOlasiligi(p,{sut,acele:e.acele||0,baski:baskiAltinda(this,p),zayif:zy,stil:e.stil,ilk:!!sec.ilk,guc:g,zemin:this.zemin,islak:this.kosullar.islak}),r=this.rast();
      e.kotu=null;e.kotuP=Pk;   /* kotuP salt okunur (ölçüm: araclar/senaryolar/v-sut.js) */
      if(r<Pk){const u=r/Pk,hareketli=!!sec.ilk||e.stil==='vole'||e.stil==='yarimVole';
        e.kotu=hareketli?(u<0.25?'iska':u<0.6?'alt':u<0.75?'ust':'kenar'):(u<0.4?'alt':u<0.7?'ust':'kenar');e.kotuU=(u*7.31)%1;
        this.on('kotuVurus',{p,tur:e.kotu,sut});
        if(e.kotu==='iska'){p.kickCd=0.3;p.sonDokunus={t:this.t,tur:'iska',ayak:e.ayak,yuzey:e.stil||'ic'};return;}}}
    if(sec.tur==='sut')this.sutVur(p,e);
    else if((sec.tip||'yer')==='yer')this.yerPasVur(p,e);
    else this.havaPasVur(p,e);
    p.sonDokunus={t:this.t,tur:'vurus',ayak:e.ayak,yuzey:e.stil||'ic'};
  },
  /* vuruşun yön hatası (rad, standart sapma): teknik, baskı, zayıf ayak (dış ayak daha az), gövde hizası, gelişine ve havada vuruş, yorgunluk.
     T9b-a: saf vurusSapma'dan; g vuruşun gücü (pasta yerden ilk hız / havadan çıkış hızından, eski mesafe çarpanı 1 + L/200 yerine); şutta g
     verilmez (çarpan 1: şut planı türün ve gücün çarpanını ayrıca uygular) */
  vurusHatasi(p,e,L,g){
    const sec=e.sec,sut=sec.tur==='sut',R=sut?VURUS_GUC_REF.sut:VURUS_GUC_REF.pas;
    /* T8b: duran topun servisi (korner, serbest vuruşun ortası) ortadan ve duran top becerisinden (eskiden pastan) */
    const tek=sec.duran&&(sec.tur==='korner'||sec.tur==='orta')?0.5*profilAlt(p,'orta',p.oz.pas)+0.5*profilAlt(p,'duranTop',p.oz.pas):sec.duran&&sec.serbest?serbestTeknik(p):undefined;   /* T8c: doğrudan serbest vuruş */
    return vurusSapma(p,{sut,guc:g==null?R:g,ref:R,stil:e.stil,zayif:p.ayak!=='iki'&&e.ayak!==p.ayak,hizalanma:e.hizalanma||0,baski:baskiAltinda(this,p),acele:e.acele||0,ilk:!!sec.ilk,teknik:tek});
  },
  /* şut: hedef ve tür sutPlani'ndan (kaleci, blok, isabet olasılığı); penaltıda seçilen köşe. b.sut'a hedef, tür ve vurucunun gövde
     ipucu yazılır (ipucu.yan: gövdenin gösterdiği taraf, z'nin işareti; guven: ne kadar okunur — iyi şutçu az belli eder, bazen aldatır) */
  sutVur(p,e){
    const b=this.ball,sec=e.sec,oz=p.oz,d=this.dir[p.team],bx=b.x,bz=b.z,gx=d*PL;
    const L=hyp(gx-bx,MZ-bz)||1;
    let sd=this.vurusHatasi(p,e,L)*sutHataK(L,!!(sec.serbest||sec.penalti));
    let hz,hy,v,egri=0,tur,kz=1,ky=1,fg=1,g,plPg=null,plPon=null;
    /* T8d: penaltı planın hedefi, yüksekliği, gücü ve türüyle (penaltiAtisi); hata baskısız, soğukkanlılıkla (penaltiSapmaK) */
    if(sec.penalti){sd*=penaltiSapmaK(p)*(sec.kosu==='durakli'?1.1:1)*(sec.donus?1.15:1);hz=sec.hz;   /* T15c: duraklı koşu ×1,1, son anda öbür köşeye dönüş ×1,15 */hy=sec.pHy;v=sec.pV;tur=sec.pTur;g=sec.pG;const TT=SUT_TUR[tur];kz=TT.kz;ky=TT.ky;fg=gucHataCarpani(g,VURUS_GUC_REF.sut);}
    /* T9b-a: hazırlığın başında planlanan tür ve güçle hedef tazelenir (planı olmayan vuruş burada planlanır) */
    else{const sp=e.sutPlan,pl=sutPlani(this,p,bx,bz,sd,{serbest:sec.serbest,tur:sp&&sp.tur,guc:sp?sp.g:sec.guc,zayif:p.ayak!=='iki'&&e.ayak!==p.ayak,acele:e.acele||0,
        stil:e.stil==='burun'?'burun':null,ayak:e.ayak});
      hz=MZ+pl.zt;hy=pl.yt;v=pl.v;tur=pl.tur;kz=pl.kz;ky=pl.ky;fg=pl.fg;g=pl.g;plPg=pl.Pg;plPon=pl.Pon;
      /* falso: top kalenin dışından içeri döner (T9b-c: yanı vuran ayaktan, sutEgriYani; dış ayakla trivela biraz daha az döner) */
      if(tur==='falso')egri=-(Math.sign(pl.zt)||1)*d*(0.08+oz.sut*0.05);else if(tur==='trivela')egri=-(Math.sign(pl.zt)||1)*d*(0.06+oz.sut*0.04);}
    if(b.y>0.4)v*=0.9;
    /* T9b-b: kötü vuruş — altına girme (top yükselir, yavaşlar), üstüne vurma (yerde, yavaş), ayağın kenarı (vuran ayağın dışına 20–40°, yavaş) */
    const ku=e.kotuU||0;if(e.kotu==='alt'){hy+=1.6+1.6*ku;v*=0.85;}else if(e.kotu==='ust'){hy=0;v*=0.55;}else if(e.kotu==='kenar')v*=0.7;
    const hz0=hz,hy0=hy,T=(hyp(gx-bx,hz-bz)||1)/v*1.06*(tur==='falso'||tur==='trivela'?1.08:1);
    /* alçak sert şutta üst dönüş (top yere doğru iner), yüksek şutta az; düşen serbest vuruşta güçlü üst dönüş, aşırtmada hafif kesik */
    const ust=tur==='dusen'?0.09:tur==='asirtma'?-0.02:hy<0.9?0.05+clamp((v-16)/14,0,1)*0.05:0.02;
    /* hata: yön (atış hattı etrafında dönme) ve yükseklik; uzaktan şut biraz yükselir */
    const ah=this.normal()*sd*kz*fg+(e.kotu==='kenar'?(e.ayak==='sol'?-1:1)*(0.35+0.35*ku):0),ca=Math.cos(ah),sa=Math.sin(ah),rx=gx-bx,rz=hz-bz;
    const hx=bx+rx*ca-rz*sa;hz=bz+rx*sa+rz*ca;
    hy+=this.normal()*sd*ky*fg*L*0.35+Math.max(0,L-18)*0.01;
    const c=this.havadanCoz(bx,Math.max(b.y,0.11),bz,hx,hy,hz,T,egri,ust);
    b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.y=Math.max(b.y,0.11);b.egri=egri;b.ust=ust;
    /* T9b-e: burunla dürtmenin stili temasta korunur (çizim ve ölçüm okur; eskiden 'ust'e dönüyordu) */
    if(e.stil!=='vole'&&e.stil!=='yarimVole'&&e.stil!=='burun')e.stil=(SUT_TUR[tur]||SUT_TUR.plase).stil;
    e.guc=g;
    const aldat=this.rast()<0.08+0.25*oz.sut,ip0=sec.penalti&&sec.ipucu;   /* T8d: penaltıda ipucu planda (kaleci koşuyu okur) */
    /* T12-0 (2026-10-12): kalecinin tahmini — hatası uygulanmış nişanın kale çizgisindeki yerine ve uçuş süresine kaleciTahmin (saf); planın seçtiği
       adayın gol ve çerçeve olasılığı. Salt okunur, ölçüm araclar/olcumler/v-verim.js; sonucu değiştirmez */
    const gk=this.kaleci(1-p.team),zc=Math.abs(hx-bx)>0.5?bz+(hz-bz)*(gx-bx)/(hx-bx):hz;
    const pKurt=gk&&gk.oyunda&&!sec.penalti?kaleciTahmin(this,gk,zc,hy,T,tur==='falso'||tur==='trivela'?MOTOR_AYAR.kaleciEgri:0).P:null;
    /* T9b-0: nisanZ/nisanY — hatası uygulanmış nişan (kale çizgisinde; salt okunur, ölçüm araclar/olcumler/v-vurus.js) */
    const xgYer=xG(bx*d,bz,'ayak',0),gkTepki=gk&&gk.oyunda?kaleciTepkiSuresi(this,gk,bx,bz):null;   /* T12-0: konum xG'si (baskısız, bloksuz) ve kalecinin tepkisi (perde dahil) */
    this.vurusSon(p,e,{hx,hz,L,bx,bz,tip:'sut',sut:{hedefZ:hz0,hedefY:hy0,nisanZ:hz,nisanY:hy,tur,pKurt,pPg:sec.penalti?null:plPg,pPon:sec.penalti?null:plPon,xgYer,gkTepki,
      ipucu:ip0||{yan:(Math.sign(hz0-MZ)||1)*(aldat?-1:1),guven:clamp(0.85-0.7*oz.sut,0.15,0.8)}}});
  },
  /* yerden pas: ortak plandaki varış hızından ilk hız; yön hatası ve uzunluk hatası (mesafe oranı; baskıda hafif eksik) */
  yerPasVur(p,e){
    const b=this.ball,sec=e.sec;
    const bx=b.x,bz=b.z;let hx=sec.hx,hz=sec.hz;
    const L=hyp(hx-bx,hz-bz)||1,varis=sec.varisHizi||pasVarisHizi(L),baski=baskiAltinda(this,p);
    const sd=this.vurusHatasi(p,e,L,pasGucu('yer',pasPlani(this,Math.max(0.5,L),'yer',varis).v0))*MOTOR_AYAR.pasSapma;   /* T9b-a: güç planın ilk hızından */
    /* T9b-b: kötü vuruş — ayağın kenarı (vuran ayağın dışına 17–34°), altına girme (top havalanır), üstüne vurma (yavaş) */
    const ku=e.kotuU||0,ah=this.normal()*sd+(e.kotu==='kenar'?(e.ayak==='sol'?-1:1)*(0.3+0.3*ku):0),ca=Math.cos(ah),sa=Math.sin(ah),rx=hx-bx,rz=hz-bz;
    hx=bx+rx*ca-rz*sa;hz=bz+rx*sa+rz*ca;
    const eL=this.normal()*sd*(1+L/40)-0.035*baski;let v=pasPlani(this,Math.max(0.5,L*(1+eL)),'yer',varis).v0;
    if(e.kotu==='alt')v*=0.8;else if(e.kotu==='ust')v*=0.55;else if(e.kotu==='kenar')v*=0.75;
    b.vx=(hx-bx)/L*v;b.vz=(hz-bz)/L*v;b.vy=e.kotu==='alt'?2.5+2*ku:0;b.y=Math.min(b.y,0.02);b.egri=0;b.ust=0;
    /* T21b (pasFalso): pasın doğal eğrisi — iç ayakla sağ ayak sola, sol ayak sağa kıvırır (orta ve kornerle aynı işaret), dış ayakla ters yöne ve daha çok;
       nişan yerdeki kıvrılmayı telafi eder (topun kopyası L kadar yürütülür, yanal sapma kadar döndürülür) */
    if(MOTOR_AYAR.pasFalso&&!e.kotu&&L>=6&&MOTOR_AYAR.yerFalso){const dis=e.stil==='dis',isr=(e.ayak==='sol'?1:-1)*(dis?-1:1);
      const eg=isr*MOTOR_AYAR.pasFalso*(dis?0.05+0.04*this.rast():0.01+0.04*clamp(L/30,0,1)*this.rast());b.egri=eg;
      const D=this.yerEgriSapma(bx,bz,b.vx,b.vz,eg,L),ac=-Math.atan2(D,L),c2=Math.cos(ac),s2=Math.sin(ac),vx0=b.vx;b.vx=vx0*c2-b.vz*s2;b.vz=vx0*s2+b.vz*c2;}
    e.guc=clamp(v/29,0,1);if(v>20&&e.stil==='ic')e.stil='ust';
    this.vurusSon(p,e,{hx,hz,L,bx,bz,tip:'yer'});
  },
  /* T21b: yerden eğrili pasın L metredeki yanal sapması (m; işaret: sola +). Topun kopyası top fiziğiyle yürütülür (en çok 4 sn); saf, rastlantısız */
  yerEgriSapma(bx,bz,vx,vz,egri,L){const s={x:bx,y:0,z:bz,vx,vy:0,vz,egri,ust:0},v=hyp(vx,vz)||1,ux=vx/v,uz=vz/v;
    for(let i=0;i<240;i++){topFizikAdim(s,1/60,false,this.R,this.kosullar);const on=(s.x-bx)*ux+(s.z-bz)*uz;if(on>=L||hyp(s.vx,s.vz)<0.3)break;}
    return -(s.x-bx)*uz+(s.z-bz)*ux;},
  /* havadan: pas, aşırtma, uzun top, orta, korner, uzaklaştırma, degaj. Uçuş süresi ortak plandan */
  havaPasVur(p,e){
    const b=this.ball,sec=e.sec;
    const bx=b.x,bz=b.z;let hx=sec.hx,hz=sec.hz,hy=0;
    const L=hyp(hx-bx,hz-bz)||1,baski=baskiAltinda(this,p);let egri=0,ust=0;
    const T=sec.T||(sec.tur==='orta'?0.95+L/32:sec.tur==='uzaklastir'?1.3+L/30:pasPlani(this,L,'hava',0,sec.yay).T);
    const sd=this.vurusHatasi(p,e,L,pasGucu('hava',0,L,T));   /* T9b-a: güç uçuş süresinden (çıkış hızı) */
    /* orta ve korner hedefteki oyuncunun baş (kesmede göğüs-baş) yüksekliğine gönderilir */
    hy=sec.hy!=null?sec.hy:(sec.tur==='orta'||sec.tur==='korner')?1.7:0;
    if(sec.tur==='orta'||sec.tur==='korner')egri=(e.ayak==='sag'?-1:1)*(sec.yay==='kesme'?0.08+this.rast()*0.06:0.05+this.rast()*0.07);
    /* T21b (pasFalso): iç ayakla uzun havadan pas ve uzun top kıvrılarak gider (havadanCoz eğriyi bilir, top hedefe iner) */
    else if(MOTOR_AYAR.pasFalso&&L>=25&&sec.tur!=='uzaklastir'&&sec.tur!=='degaj'&&sec.yay!=='asirtma'&&e.stil!=='dis')egri=(e.ayak==='sag'?-1:1)*(0.04+0.04*this.rast())*MOTOR_AYAR.pasFalso;
    /* havadan pas ve orta kesik dönüşle gider: havada biraz asılı kalır, yerde frenlenir */
    ust=sec.tur==='uzaklastir'||sec.tur==='degaj'?0:sec.yay==='asirtma'?-0.06:-0.04;
    const ah=this.normal()*sd*1.6,ca=Math.cos(ah),sa=Math.sin(ah),rx=hx-bx,rz=hz-bz;
    hx=bx+rx*ca-rz*sa;hz=bz+rx*sa+rz*ca;
    const eL=this.normal()*sd*1.3-0.03*baski;
    hx=bx+(hx-bx)*(1+eL);hz=bz+(hz-bz)*(1+eL);
    const c=this.havadanCoz(bx,Math.max(b.y,0.11),bz,hx,hy,hz,T,egri,ust);
    /* T9b-b: kötü vuruş — altına girme (top şişer: dik ve kısa), üstüne vurma (alçak ve kısa), ayağın kenarı (vuran ayağın dışına 17–34°) */
    if(e.kotu){const ku=e.kotuU||0;
      if(e.kotu==='alt'){c.vy*=1.35;c.vx*=0.75;c.vz*=0.75;}else if(e.kotu==='ust'){c.vy*=0.35;c.vx*=0.6;c.vz*=0.6;}
      else if(e.kotu==='kenar'){const a2=(e.ayak==='sol'?-1:1)*(0.3+0.3*ku),c2=Math.cos(a2),s2=Math.sin(a2),vx=c.vx;c.vx=(vx*c2-c.vz*s2)*0.8;c.vz=(vx*s2+c.vz*c2)*0.8;}}
    b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.y=Math.max(b.y,0.11);b.egri=e.kotu?0:egri;b.ust=e.kotu?0:ust;
    e.guc=clamp(hyp3(c.vx,c.vy,c.vz)/30,0,1);
    this.vurusSon(p,e,{hx,hz,L,bx,bz,tip:'hava'});
  },
  /* vuruşun sonu: top ayaktan çıktı; dokunuş, pas/şut kaydı ve olaylar; kısa pastan sonra ver-kaç koşusu */
  vurusSon(p,e,k){
    const b=this.ball,sec=e.sec,{hx,hz,L,bx,bz,tip}=k;
    b.sahip=null;b.tasiyan=null;p.kickCd=0.3;p.surus=null;
    this.dokunus(p,true);
    b.hedefOyuncu=sec.alici||null;b.pasHedef=sec.alici?{x:hx,z:hz,tur:sec.tur,mod:sec.mod||null,marj:sec.marj!=null?sec.marj:null,tip:tip||null,rahat:null}:null;   /* T23a2: mod, marj, tip salt okunur */
    const tur=sec.tur;
    if(tur==='sut'){b.sut={team:p.team,by:p,gkDone:false,cerceve:this.cerceveyeGider(p.team),xg:sec.xg||0,t:this.t};if(k.sut)Object.assign(b.sut,k.sut);this.ist.sut[p.team]++;
      this.ofsaytPasAni(p);this.on('shot',{p,dist:L,xg:sec.xg||0});this.sutTakipAta(p,sec.xg);}   /* T7e: şutu takip ve dönen top (js/mac-takim.js) */
    else if(tur==='pas'||tur==='ara'||tur==='uzun'||tur==='orta'||tur==='geriCevir'||tur==='kisa'){
      this.pasSay(p,sec.hx,sec.hz,L,tur);this.ofsaytPasAni(p);
      this.on(tur==='orta'?'cross':'pass',{p,q:sec.alici,long:L>=32,tur,L,x0:bx,z0:bz,hx,hz,tip,ilk:!!sec.ilk});
      if(tur==='orta'||tur==='geriCevir')this.ortaBlok(p);
      if(tur==='pas'&&tip==='yer'&&sec.alici&&L>=5&&L<=22&&p.rol!=='GK'&&!(this._pln&&(MOTOR_AYAR.plan&1)))this.verKacBaslat(p,sec.alici);}   /* Z1 (H4): plan&1'de ver-kaç duvar pası ilkelinin */
    else if(tur==='uzaklastir'||tur==='degaj')this.on(tur==='degaj'?'gkkick':'clear',{p});
    else if(tur==='serbest'||tur==='korner'||tur==='kaleVurusu'){this.pasSay(p,sec.hx,sec.hz,L,tur);this.ofsaytPasAni(p);}
  },
  /* ver-kaç: pasör baskıcısının arkasındaki boşluğa 8–12 m koşar (baskıcı yakınsa daha istekli) */
  verKacBaslat(p,q){
    const d=this.dir[p.team],pu=p.x*d;if(pu<-25||pu>PL-14)return;
    const yr=enYakinRakip(this,p.x,p.z,p.team),yakin=yr.o&&yr.d<6;
    const tw=MOTOR_AYAR.verKacTarz>0?1+MOTOR_AYAR.verKacTarz*(tarzAgirlik(this,p.team,'duvarPasi')-1):1;   /* Z4b: tarz */
    if(this.rast()>=MOTOR_AYAR.verKacIstegi*(0.5+0.5*p.oz.karar)*(yakin?1:0.4)*tw)return;
    const wz=yakin?(p.z-yr.o.z)/(yr.d||1)*2.5:0,u=Math.min(pu+8+this.rast()*4,ofsaytCizgisi(this,p.team)+2,PL-8);
    this.bVeri(p).vk={q,x:u*d,z:clamp(p.z+wz,3,PW-3),son:this.t+2.8};this.on('kosu',{p,verKac:true});
  },
  /* ver-kaç koşusunu sürdür: top arkadaşta ya da aralarında yoldayken (takimAI'dan sonra hedefi uygular); dönüş pası gelirken kovala yönetir */
  verKacAdim(){
    const b=this.ball;
    const M=this._bv;if(!M)return;
    for(const p of this.players){const bv=M.get(p),v=bv&&bv.vk;if(!v)continue;
      const devam=p.oyunda&&this.t<v.son&&!(p.eylem&&p.eylem.kilit)&&(b.sahip===v.q||(!b.sahip&&!b.tasiyan&&b.sonTakim===p.team&&(b.sonDokunan===p||b.sonDokunan===v.q)));
      if(!devam||hyp(p.x-v.x,p.z-v.z)<1.2){bv.vk=null;continue;}
      if(b.hedefOyuncu===p||(p.eylem&&p.eylem.ad==='vurus'))continue;
      p.tx=v.x;p.tz=v.z;p.hizOran=1;p.bak=b;p.yonHedef=null;this.eforVer(p,1);}
  },
  /* pasın hedefi hazırlıkta ve vuruş anında tazelenir (ortak plan: aynı varış hızı / uçuş süresi). ayak: alıcının koşusunu ~1 sn sürdürdüğü
     buluşma noktası; bosluk: onun önündeki boşluk; ara: koşu çizgisinde alıcının her savunmacıdan 0,25 sn önce vardığı ilk nokta.
     Havadan orta ve korner tazelenmez: hedef karar anında hücumcunun koşusunun sonuna konur, gövde oynayan hedefi kovalamaz */
  hedefGuncelle(p,sec){
    const q=sec.alici,b=this.ball;if(!q||!q.oyunda)return;
    const mod=sec.mod||'ayak',d=this.dir[p.team];
    if(mod==='ara'){const h=araNoktasi(this,q,b.x,b.z,0,sec.varisHizi,ofsaytCizgisi(this,p.team),d);if(h){sec.hx=h.x;sec.hz=h.z;}return;}
    const mt=bulusmaNoktasi(this,q,b.x,b.z,0,sec.tip||'yer',sec.varisHizi,sec.yay),es=mod==='bosluk'?(sec.es||0):0;
    sec.hx=clamp(mt.x+(sec.ex||0)*es,-PL+0.5,PL-0.5);sec.hz=clamp(mt.z+(sec.ez||0)*es,0.8,PW-0.8);
    if(sec.tip==='hava'&&sec.T)sec.T=havaSure(hyp(sec.hx-b.x,sec.hz-b.z),sec.yay);
  },
  /* ============ topla oyuncu: karar, top sürme, koruma ============ */
  topluAI(dt){
    this.calimDenetle();   /* T4: önceki karede sürülmeyen çalım denemesi kapanır (mac-hareket.js) */
    this.verKacAdim();
    const b=this.ball,p=b.sahip;if(!p||b.tasiyan)return;
    if(!p.oyunda){b.sahip=null;return;}
    const d=hyp(b.x-p.x,b.z-p.z),C=p.calim,kacis=!!C&&C.faz===2;
    /* T4: çalımın kaçışında (top savunmacının ötesine itildi) sahiplik ancak top 5 m'den uzaksa düşer */
    if(d>(kacis?5:3.2)||(!kacis&&d>1.6&&hyp(b.vx,b.vz)>9)){b.sahip=null;p.surus=null;return;}
    if(p.eylem)return;
    p.kararT-=dt;
    /* T2 olay: rakip 2,5 m'ye girdi — bir sonraki düşünme anını beklemeden yeniden bak (yeni sahiplikte ilk karede yalnız kaydedilir; T4: çalım
       sürerken bakılmaz, rakibin gelmesi beklenendir) */
    const v=this.bVeri(p),yr=enYakinRakip(this,p.x,p.z,p.team).d;
    if(yr<2.5&&v.yakinR>=2.5&&v.yakinNo===this.sahiplikNo&&p.kararT>0&&!C)p.kararT=0;
    v.yakinR=yr;v.yakinNo=this.sahiplikNo;
    /* T4: çalımın hazırlığı ve kaçışı sürerken yeni karar yok (bağlılık); kaçışta savunmacı 0,6 sn'den sonra topa 3,5 m'den uzaksa düello yoktur,
       sürücü yeniden düşünür (şut, pas; eskiden 2,5 sn boyunca düşünmeden koşuyordu) */
    const bagli=C&&(C.faz===1||C.faz===2&&(C.ft<0.6||hyp(C.o.x-b.x,C.o.z-b.z)<=3.5));
    if(p.kararT<=0&&d<1.1&&b.y<0.5&&!bagli){const s=kararVer(this,p);this.secenekUygula(p,s);if(p.eylem)return;}
    this.surusIlerle(p,dt);
  },
  secenekUygula(p,s){
    const b=this.ball,A=MOTOR_AYAR;
    /* T4: çalım sürerken başka bir iş seçildi (savunmacı uzaktayken yeniden düşündü): deneme şimdiki duruma göre kapanır (sonraki pasın kesilmesi
       çalımın kaybı sayılmasın) */
    if(p.calim&&s.tur!=='gec')this.calimBitir(p,this.calimSonucu(p,p.calim));
    switch(s.tur){
      case 'sut':this.vurusBaslat(p,{tur:'sut',hx:this.dir[p.team]*PL,hz:MZ,xg:s.xg,pBlok:s.pBlok});break;   /* T19a: pBlok salt okunur (v-verim) */
      case 'pas':case 'ara':case 'uzun':case 'orta':case 'geriCevir':
        this.vurusBaslat(p,{tur:s.tur,hx:s.hx,hz:s.hz,tip:s.tip,alici:s.alici,varisHizi:s.varis,T:s.T,hy:s.hy,yay:s.yay,mod:s.mod,ex:s.ex,ez:s.ez,es:s.es,guncelle:!!s.mod,
          P:s.P,Pk:s.Pk,alt:s.alt,ortaTuru:s.ortaTuru,marj:s.marj});break;   /* P, Pk, alt, ortaTuru: karar anındaki tahmin, salt okunur (ölçüm: araclar/olcumler/p-kalib.js) */
      case 'uzaklastir':{/* uzağa ve kanada, çoğu zaman hedefsiz; baskı altında ayağın kenarından kaçıp taça ya da kornere gidebilir */
        const d=this.dir[p.team],yan=p.z<MZ?-1:1,kacti=this.rast()<0.25+baskiAltinda(this,p)*0.25;
        let hx=clamp(p.x+d*(28+this.rast()*22),-PL+4,PL-4),hz=p.z+yan*(10+this.rast()*26);
        if(kacti){hx=p.x+d*(this.rast()*14-4);hz=p.z+yan*(18+this.rast()*20);}
        /* T12b (2026-10-12): kendi ceza sahasında, direğin en az 1 m dışındaki topu baskı altındaki savunmacı kale çizgisinin dışına (kornere)
           atar — kafadaki kuralın payıyla (uzaklastirCizgi: kaleye dönükken / değilken; T8f), baskı 0,2'nin üstündeyken. Eskiden ayakla uzaklaştırma kornere
           yalnız kazayla gidiyordu (T12-0: uzaklaştırmadan sonra korner %2,5) */
        const b0=this.ball,dz0=Math.abs(b0.z-MZ),bas=baskiAltinda(this,p);
        if(this.kendiCezaSahasinda(p,b0.x,b0.z)&&dz0>GW2+1&&bas>0.2){const kd=Math.cos(p.yon)*d<-0.3,U=MOTOR_AYAR.uzaklastirCizgi;
          if(this.rast()<(kd?U[0]:U[1])){const gx=-d*PL,u=Math.max(0.5,Math.abs(b0.x-gx)),zc=MZ+(b0.z<MZ?-1:1)*(dz0+1.5+this.rast()*6),s=1+3/u;
            hx=b0.x+(gx-b0.x)*s;hz=b0.z+(zc-b0.z)*s;}}
        this.vurusBaslat(p,{tur:'uzaklastir',hx,hz,tip:'hava'});break;}
      /* T4e: top saklama — gövde rakiple top arasında (yön rakipten uzağa), seçeneğin süresi boyunca sürer (düşünme aralığında bozulmaz;
         destek gelince bırakma pası ya da dönüş yeniden tartılır) */
      case 'koru':{const o=s.o||enYakinRakip(this,p.x,p.z,p.team).o;const a=o?Math.atan2(p.z-o.z,p.x-o.x):p.yon;p.surus={yon:A.cizgiKoru?hrkCizgiYon(b.x,b.z,a,this.dir[p.team]).a:a,hiz:0.22,koru:true};   /* Z1c: çizgiye doğru koruma yok */
        p.kararT=Math.max(this.dusunmeAraligi(p),(s.sure||0.5)*0.85);break;}
      /* T2: taşıma — yön ve uzunluk seçimden; uzun taşıma daha hızlı. Bekleme — top ayağın altında, baş yukarıda */
      case 'tasi':p.surus={yon:s.yon,hiz:clamp(0.55+0.035*s.mesafe,0.55,0.92)};p.kararT=this.dusunmeAraligi(p);break;
      /* T22a: sürükleme — depar, uzun itiş; 1,2 sn bağlılık (rakip 2,5 m'ye girerse karar yine açılır: topluAI olayı) */
      case 'surukle':p.surus={yon:s.yon,hiz:1,surukle:this.t+1.5};p.kararT=Math.max(this.dusunmeAraligi(p),1.2);break;
      /* T4: rakibi geç — çalım niyeti (hareket, yan, tahmin); yaklaşma süresince karar bağlı (yürütücü yaklaşmanın sonunda yeniden tartar) */
      case 'gec':p.surus={yon:s.yon,hiz:HRK_HAREKET[s.i].yakHiz,cal:{o:s.o,i:s.i,taraf:s.taraf,P:s.P}};p.kararT=Math.max(this.dusunmeAraligi(p),s.tYak-HRK_HAREKET[s.i].haz+0.2);break;
      case 'bekle':p.surus={yon:A.cizgiKoru?hrkCizgiYon(b.x,b.z,p.yon,this.dir[p.team]).a:p.yon,hiz:0.1,bekle:true};p.kararT=this.dusunmeAraligi(p);break;   /* Z1c */
      default:{p.surus={yon:s.yon!=null?s.yon:p.yon,hiz:s.hiz||0.88};p.kararT=lerp(A.surusKarar[0],A.surusKarar[1],this.rast());}
    }
  },
  /* oyuncu topa ne ile erişir: ayak, göğüs, kafa ya da (kaleci) el. T6a: beden yükseklikleri sıçramayla kalkar (y − p.yuk). T6b: kafa teması
     adım içinde baş ile topun geometrisinden (js/mac-hava.js hvTemas; kesir ve dikey fark oyuncuya yazılır) */
  erisim(p,d){
    const b=this.ball,y=b.y,yb=y-(p.yuk||0);
    if(this.elErisimi(p,d,y))return 'el';
    /* T19a: şutu kapatmak için hatta atılan savunmacı (sutHamleYap; damga 0,35 sn) bacağını uzatır — ayağın erişimi blokErisim */
    if(MOTOR_AYAR.sutHamle&&b.sut&&b.sut.team!==p.team&&p.rol!=='GK'&&this.t-p._ortaBlokT<0.35&&d<MOTOR_AYAR.blokErisim&&yb<0.8&&yb>-0.1)return 'ayak';
    if(d<0.6&&yb<0.8&&yb>-0.1)return 'ayak';   /* T8c: havadaki oyuncunun ayağının altından geçen top (sıçrayan baraj) */
    if(d<0.5&&yb>=0.8&&yb<1.55)return 'gogus';
    if(b.vy<3&&hvTemas(this,p)){
      /* ceza sahaları dışında, rakipsiz ve yavaşça düşen topu kafayla oynamaz: göğse ya da ayağa indirir (T6c: rakipsiz kafa uzaklaştırma değil,
         arkadaşa gider — js/mac-karar.js kafaKarari) */
      if(b.vy<0&&hyp(b.vx,b.vz)<9&&!(Math.abs(b.x)>PL-CEZA_U-2&&Math.abs(b.z-MZ)<CEZA_W+2)){
        let rakip=false;for(const o of this.teams[1-p.team])if(o.oyunda&&hyp(o.x-b.x,o.z-b.z)<2.5){rakip=true;break;}
        if(!rakip)return null;}
      return 'kafa';}
    /* T14e (2026-10-14; gerçekçilik planı §4 T14, Ek G4): tam plonjon kafa — rakip ceza sahasında koşan (≥ plonjonHiz m/sn) hücumcu, ayağının ve
       göğsünün erişemediği (0,5–1,25 m), başının altında kalan (0,45 m ile alnın 0,3 m altı arası) uçan topa önündeyse (koşu yönünün ±50°'si) gövdesiyle
       uzanır: erişim 'kafa', alnın tam ortası (havaTopu'nun temas alanları). Dalan oyuncu maçta tutulur (this._plonjon; oyuncu nesnesine alan
       eklenmez — varlik 128 alan sınırı): kafaVur kilitli kısa kafa eylemi yapar, ardından yüzüstü yere iner (EYLEM_ADIM.kafa, js/mac-hava.js) */
    if(MOTOR_AYAR.plonjon&&p.rol!=='GK'&&!p.zipla&&p.spd>=MOTOR_AYAR.plonjonHiz&&d>=0.5&&d<1.25&&yb>=0.45&&yb<=hvAlinDur(p)-0.3&&!b.sahip&&hyp(b.vx,b.vz)>5&&
      (b.x-p.x)*p.vx+(b.z-p.z)*p.vz>0.64*d*p.spd&&Math.abs(b.x-this.dir[p.team]*PL)<CEZA_U+2&&Math.abs(b.z-MZ)<CEZA_W+2){
      p._hv.Ts=0.5;p._hv.Ty=0;p._hv.Td=0;const P=this._plonjon||(this._plonjon={p:null,k:-1});P.p=p;P.k=this.kare;return 'kafa';}
    return null;
  },
  /* temasın sonu: topa erişen oyuncu dokunur (kontrol, göğüs; sert gelen rakip topu bacaktan seker) */
  topaDokun(kazanan){
    const b=this.ball;
    const p=kazanan.p,e=p.eylem;
    if(e&&e.ad==='vurus'&&e.faz!=='takip')return; /* vuruş zinciri topu kendisi alacak */
    /* sert gelen topa uzanan rakip çoğu zaman kontrol edemez: top bacağından seker */
    const hiz=hyp(b.vx,b.vz),rakipTopu=b.sonTakim!==p.team&&b.hedefOyuncu!==p;
    if(rakipTopu&&hiz>8&&kazanan.d>0.28&&kazanan.tur==='ayak'&&this.rast()<clamp(0.35+(hiz-8)*0.05,0,0.8)){this.sekme(p);return;}
    if(kazanan.tur==='gogus')this.gogusKontrol(p);else this.kontrolEt(p);
  },
  /* dokunan ayak ve yüzey (rastlantısız): topun gövdeye göre yanı, yüksekliği ve dokunuş yönü. Sağ yön (−sin, cos) */
  kontrolYuzeyi(p,a,h){
    const b=this.ball,c=Math.cos(p.yon),s=Math.sin(p.yon),yan=(b.x-p.x)*-s+(b.z-p.z)*c,tl=Math.cos(a)*-s+Math.sin(a)*c;
    const ayak=Math.abs(yan)<0.05?(p.ayak==='sol'?'sol':'sag'):yan>0?'sag':'sol';
    const yuzey=b.y>=0.5?'uyluk':h<1.3&&Math.abs(aciFark(a,p.yon))>2.2?'taban':(ayak==='sag'?tl>0.35:tl<-0.35)?'dis':'ic';
    return{ayak,yuzey};
  },
  /* ilk dokunuş: top ayağa gelir. Planlıysa (gelisineKarar) bir sonraki işi açan boşluğa, koşu içinde; değilse boşluğa ve hücum yönüne.
     Başarı kontrolOlasiligi'ndan (hız, yükseklik, baskı, dönüş açısı, teknik). Hata: ağır dokunuş (top 2–4 m kaçar) ya da sekme */
  kontrolEt(p){
    const b=this.ball,v=hyp3(b.vx,b.vz,b.vy),baski=baskiAltinda(this,p),teknik=p.oz.surus*0.55+p.oz.pas*0.45;
    const bv=this.bVeri(p),pl=bv.plan&&bv.plan.surum===b.surum?bv.plan:null;
    const a=pl?pl.yon:this.kontrolYonu(p),gx=b.vx,gz=b.vz,aci=v>1?Math.abs(aciFark(a,Math.atan2(gz,gx))):0;
    const P=kontrolOlasiligi(p,v,b.y,baski,aci),r=this.rast();
    if(r<P){
      /* iyi dokunuş: planlı ve gidiş yönündeyse koşu içinde (top bir adım önde), değilse yumuşak; gelen hızın bir kısmı kalır */
      const ayni=Math.abs(aciFark(a,p.yon))<1.2,h0=pl&&ayni?clamp(p.spd*0.85+0.6,1.0,5.5):clamp(p.spd*0.75,0,4.5)*(pl?0.6:1)+0.5;
      /* T23d1 (alisCizgi): koşan alıcı topu kendi koşu çizgisine onun hızıyla koyar — top koşucunun önünde kalır */
      const vAl=p.vx*Math.cos(a)+p.vz*Math.sin(a),h=MOTOR_AYAR.alisCizgi&&vAl>1.5?Math.max(h0,Math.min(6,vAl+0.4)):h0;
      const k=clamp((1-teknik)*0.18+baski*0.05+(1-P)*0.4,0.02,0.3),y=this.kontrolYuzeyi(p,a,h);
      b.vx=Math.cos(a)*h+gx*k;b.vz=Math.sin(a)*h+gz*k;b.vy=0;b.y=Math.min(b.y,0.05);b.egri=0;b.ust=0;this.govdedenGecmesin(p);
      if(pl)pl.hazir=true;
      this.dokunus(p,true);this.sahipYap(p);p.eylem={ad:'kontrol',t:0,sure:pl?0.15:0.22,yuzey:y.yuzey,yon:a};p.kickCd=0.06;
      p.sonDokunus={t:this.t,tur:'kontrol',ayak:y.ayak,yuzey:y.yuzey};
      this.on('ilkDokunus',{p,iyi:true,tur:'ayak',plan:!!pl});
      /* T5: topu alana arkadan itme artık gövde çarpışmasından doğar (govdeTemasi, mac-mudahale.js; eski zar sirtFaulu kalktı) */}
    else{/* kötü dokunuş: ağır (top istenen yöne 2–4 m kaçar) ya da sekme (gelen hızın bir kısmı sürer, ayaktan rastgele yöne) */
      const agir=r<P+(1-P)*0.6,y=this.kontrolYuzeyi(p,a,3);
      if(agir){const ra=a+this.normal()*0.45,h=Math.sqrt(2*(this.R+0.3)*(2+this.rast()*2));b.vx=gx*0.12+Math.cos(ra)*h;b.vz=gz*0.12+Math.sin(ra)*h;b.vy=0;b.y=Math.min(b.y,0.05);}
      else{const ra=a+this.normal()*1.3,h=1.2+v*0.12;b.vx=gx*0.3+Math.cos(ra)*h;b.vz=gz*0.3+Math.sin(ra)*h;b.vy=b.y>0.3?1+this.rast()*2:0;}
      b.ust=0;b.egri=0;this.govdedenGecmesin(p);
      this.dokunus(p,false);if(b.sahip===p)b.sahip=null;p.eylem={ad:'kontrol',t:0,sure:0.3,kotu:true,agir,yuzey:y.yuzey,yon:a};p.kickCd=agir?0.24:0.32;
      p.sonDokunus={t:this.t,tur:'kontrol',ayak:y.ayak,yuzey:y.yuzey};
      this.on('kotuKontrol',{p,agir});this.on('ilkDokunus',{p,iyi:false,tur:'ayak',agir});}
    bv.plan=null;
  },
  /* dokunuş topu gövdenin içinden geçirecekse (gövde topun yolunun hemen üstünde) top yavaş kalır: taban ya da iç ayakla yanından çekilir */
  govdedenGecmesin(p){
    const b=this.ball,v=hyp(b.vx,b.vz);if(v<2.6)return;
    const rx=p.x-b.x,rz=p.z-b.z,on=(rx*b.vx+rz*b.vz)/v,yan=Math.abs(rx*b.vz-rz*b.vx)/v;
    if(on>0&&yan<0.35){const k=2.6/v;b.vx*=k;b.vz*=k;}
  },
  gogusKontrol(p){
    const b=this.ball,baski=baskiAltinda(this,p),iyi=this.rast()<clamp(0.9-baski*0.2+(p.oz.surus-0.6)*0.3,0.4,0.97);
    const bv=this.bVeri(p),pl=bv.plan&&bv.plan.surum===b.surum?bv.plan:null,a=pl?pl.yon:this.kontrolYonu(p);
    /* T23d1 (alisCizgi): iyi göğüs kontrolünde top dokunuş yönündeki koşu hızıyla düşer (0,8–5,5 m/sn) */
    const vAl=p.vx*Math.cos(a)+p.vz*Math.sin(a),hG=iyi?(MOTOR_AYAR.alisCizgi?clamp(vAl,0.8,5.5):0.8):2.5;
    b.vx=Math.cos(a)*hG+(iyi?0:this.normal()*1.5);b.vz=Math.sin(a)*hG+(iyi?0:this.normal()*1.5);b.vy=iyi?-0.5:1.2;
    if(pl&&iyi)pl.hazir=true;
    this.dokunus(p,true);if(iyi)this.sahipYap(p);else if(b.sahip===p)b.sahip=null;
    p.eylem={ad:'gogus',t:0,sure:0.4,yuzey:'gogus',yon:a};p.kickCd=iyi?0.18:0.35;
    p.sonDokunus={t:this.t,tur:'gogus',ayak:null,yuzey:'gogus'};this.on('ilkDokunus',{p,iyi,tur:'gogus'});
    bv.plan=null;
  },
  /* ilk dokunuşla top nereye (plan yoksa): boşluğa ve hücum yönüne, en yakın rakipten uzağa */
  kontrolYonu(p){
    const d=this.dir[p.team],{o,d:od}=enYakinRakip(this,p.x,p.z,p.team);
    let x=d*1.0,z=(MZ-p.z)*0.01;
    if(o&&od<6){x+=(p.x-o.x)/od*1.2*(6-od)/6;z+=(p.z-o.z)/od*1.2*(6-od)/6;}
    const a=Math.atan2(z,x),f=aciFark(a,p.yon);let y=aciNorm(p.yon+clamp(f,-1.2,1.2));
    /* T20b (alisYon): koşan (> 1,5 m/sn) alıcının plansız kontrolü koşu yönünden en çok 1 rad sapar (eskiden yalnız gövdeye göre: koşu yönüne 110–150° yönlendirilen
       topu oyuncu kendi hızıyla geçiyordu) */
    if(MOTOR_AYAR.alisYon&&p.spd>1.5){const vA=Math.atan2(p.vz,p.vx),g=aciFark(y,vA);if(Math.abs(g)>1)y=aciNorm(vA+Math.sign(g));}
    return y;
  },
  /* yönlü ilk dokunuş planı: karşılama noktasından 8 yön; boşluk (rakiplerin oraya varışı, dokunuştan sonra), ilerleme, kontrol sonrası en iyi
     pasın yönü ve dokunuşun zorluğu (kontrolOlasiligi) tartılır */
  dokunusPlani(p,k,s,hedef){
    const b=this.ball,d=this.dir[p.team],gelA=Math.atan2(b.vz,b.vx),v=s.v||hyp(b.vx,b.vz),rakip=this.teams[1-p.team];
    let dd=99;for(const o of rakip)if(o.oyunda)dd=Math.min(dd,hyp(o.x-k.x,o.z-k.z)-o.maxSpd*k.t*0.6);
    const baski=clamp((4.5-dd)/3.5,0,1),hA=hedef?Math.atan2(hedef.z-k.z,hedef.x-k.x):null;
    /* T20b (alisYon): sonraki işin yönü daha ağır (0,6 → 1,2) ve koşan alıcının dokunuşu koşu yönünden saptıkça bedel (hızla): eskiden 4 m/sn koşan oyuncu topu
       yana ya da geriye yavaşça yönlendirip kendi hızıyla geçiyordu (T20-0: top arkada kalan anların ~%40'ı alıştan hemen sonra) */
    const AY=MOTOR_AYAR.alisYon,hW=0.6+0.6*AY,vY=AY&&p.spd>1?AY*1.2*clamp(p.spd/4,0,1):0,vA=Math.atan2(p.vz,p.vx);
    let en=null,enP=-1e9;
    for(let j=0;j<8;j++){const a=(d>0?0:Math.PI)+j*Math.PI/4,x=k.x+Math.cos(a)*1.8,z=k.z+Math.sin(a)*1.8;
      if(Math.abs(x)>PL-0.6||z<0.6||z>PW-0.6)continue;
      let bos=1.5;for(const o of rakip){if(!o.oyunda)continue;const t=varisZamani(o,x,z,0.75,0.2)-(k.t+0.45);if(t<bos)bos=t;}
      const pk=kontrolOlasiligi(p,v,s.y,baski,Math.abs(aciFark(a,gelA)));
      const puan=Math.max(-1,bos)+Math.cos(a)*d*0.5+(hA!=null?Math.cos(aciFark(a,hA))*hW:0)-(1-pk)*3-(z<3||z>PW-3?0.5:0)-(vY?vY*(1-Math.cos(aciFark(a,vA))):0);
      if(puan>enP){enP=puan;en=a;}}
    return en==null?null:{surum:b.surum,t:this.t,yon:aciNorm(en),hazir:false};
  },
  /* T6c: cek — hava düellosundan; yüzey temasın geometrisinden (js/mac-hava.js hvYuzey, HV_YUZEY): isabet ve güç yüzeye ve çekişmeye göre;
     tepeyle sıyırmada top gelişini büyük ölçüde korur (uzatma), yukarı kalkar. Sözleşme: kafa.yuzey, kafa.cek; 'header' olayında yuzey, cek */
  kafaVur(p,cek){
    const b=this.ball,k=kafaKarari(this,p),yz=hvYuzey(p),Q=HV_YUZEY[yz];
    /* kendi kalesine dönük savunmacının kafası çoğu zaman topu çizgiden dışarı atar (korner) */
    const d=this.dir[p.team],kaleyeDonuk=Math.cos(p.yon)*d<-0.3,kendiCeza=this.kendiCezaSahasinda(p,b.x,b.z);
    /* T8b (2026-10-11): yalnız direğin en az 1 m dışındaki topta; nişan kale çizgisini topun kendisinden de dışarıda keser (çizgi kaleden
       uzaklaşır). Eskiden her yerde 12 m geriye ve 4–12 m yana nişan alınırdı: kale ağzının önündeki topta bu çizgi kalenin içinden geçiyor,
       savunmacı kendi kalesine kafa atıyordu (400 kornerde ~5 gol) */
    const dz0=Math.abs(b.z-MZ);
    if(k.tur==='uzaklastir'&&kendiCeza&&dz0>GW2+1&&this.rast()<(kaleyeDonuk?MOTOR_AYAR.uzaklastirCizgi[0]:MOTOR_AYAR.uzaklastirCizgi[1])){const gx=-d*PL,u=Math.max(0.5,Math.abs(b.x-gx)),zc=MZ+(b.z<MZ?-1:1)*(dz0+1.5+this.rast()*6),s=1+3/u;
      k.hx=b.x+(gx-b.x)*s;k.hz=b.z+(zc-b.z)*s;k.vy=3+this.rast()*3;}
    const L=hyp(k.hx-b.x,k.hz-b.z)||1,sig=(0.05+0.1*(1-p.oz.kafa))*(1+baskiAltinda(this,p)*0.5)*Q[0]*(cek?1.4:1)*(1+MOTOR_AYAR.kafaDonus*hvDonus(b.vx,b.vz,k.hx-b.x,k.hz-b.z)),gelen=hyp(b.vx,b.vz);
    /* kafa vuruşu gelen topun hızının bir kısmını kullanır: sert gelen orta sert gider */
    let a=Math.atan2(k.hz-b.z,k.hx-b.x)+this.normal()*sig;
    if(yz==='tepe'&&gelen>1){const ag=Math.atan2(b.vz,b.vx);a=ag+aciFark(a,ag)*0.35;}
    const v=Math.min(22,(k.v*(0.85+this.rast()*0.15)+gelen*(k.tur==='sut'?0.12:0.2))*Q[1]*(cek?0.9:1));
    b.vx=Math.cos(a)*v;b.vz=Math.sin(a)*v;b.vy=(yz==='tepe'?Math.max(k.vy,2+gelen*0.12):k.vy)+this.normal()*sig*6;b.egri=0;b.ust=0;
    /* T14e: tam plonjon kafa (erisim) — kilitli kısa eylem, ardından yere iniş (EYLEM_ADIM.kafa) */
    const PJ=this._plonjon,plonjon=!!(PJ&&PJ.p===p&&PJ.k===this.kare);
    b.sahip=null;p.kickCd=0.4;p.eylem=plonjon?{ad:'kafa',t:0,sure:0.3,tur:k.tur,yuzey:yz,cek:!!cek,plonjon:true,kilit:true,fren:3}:{ad:'kafa',t:0,sure:0.5,tur:k.tur,yuzey:yz,cek:!!cek};
    p.sonDokunus={t:this.t,tur:'kafa',ayak:null,yuzey:yz};
    this.dokunus(p,true);b.hedefOyuncu=k.alici||null;
    if(k.tur==='sut'){b.sut={team:p.team,by:p,gkDone:false,cerceve:this.cerceveyeGider(p.team),kafa:true,t:this.t,hedefZ:k.hz,hedefY:k.hy,tur:'kafa',
      ipucu:{yan:Math.sign(k.hz-MZ)||1,guven:clamp(0.8-0.5*p.oz.kafa,0.2,0.8)}};this.ist.sut[p.team]++;
      /* T12-0: kalecinin tahmini; salt okunur, sonucu değiştirmez (v-verim). T24-0 (2026-10-18): topun kale çizgisine varışı (süre, yer, yükseklik)
         topun bir kopyasının yolundan — topFizikAdim ile, sürükleme ve sekme dahil (topYolu'nun kopyası gibi; önbelleğe dokunmaz, rastlantı çekmez).
         Eskiden hızdan sürüklemesiz parabol (tg = Δx/vx): kafa top planlanandan alçak ve geç gidiyor, tahmin kafada %53, gerçekleşen %71 (T23, 80
         maç). 5 sn içinde çizgiye varmayan topta eski yaklaşık kalır */
      const gk=this.kaleci(1-p.team),gxa=d*PL;if(gk&&gk.oyunda&&b.vx*d>0.5){let tg=(gxa-b.x)/b.vx,zc=b.z+b.vz*tg,yc=b.y+b.vy*tg-0.5*G*tg*tg;
        const s={x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:b.egri,ust:b.ust||0,wYan:b.wYan,wUst:b.wUst,sw:b.sw,surum:b.surum,_donSurum:b._donSurum};
        for(let i=1;i<=300;i++){const px=s.x,py=s.y,pz=s.z;topFizikAdim(s,1/60,false,this.R,this.kosullar);
          if((px-gxa)*(s.x-gxa)<=0){const f=(gxa-px)/((s.x-px)||1);tg=(i-1+f)/60;zc=pz+(s.z-pz)*f;yc=py+(s.y-py)*f;break;}
          if(s.vx*d<=0.05)break;}
        b.sut.nisanZ=zc;b.sut.nisanY=yc;b.sut.pKurt=kaleciTahmin(this,gk,zc,Math.max(0.05,yc),tg,0).P;b.sut.gkTepki=kaleciTepkiSuresi(this,gk,b.x,b.z);}
      b.sut.xgYer=xG(b.x*d,b.z,'kafa',0);}
    else if(k.tur==='indirme'||k.tur==='pas'){this.pasSay(p,k.hx,k.hz,L,'kafa');this.ofsaytPasAni(p);}
    this.on('header',{p,shot:k.tur==='sut',tur:k.tur,xg:k.xg||0,yuzey:yz,cek:!!cek});if(k.tur==='sut')this.sutTakipAta(p,k.xg);
  },
  /* gelişine karar (C'nin kovala'sından her karede, karşılama noktası k: {x,z,t}); top başına bir kez, topa ~0,6 sn kala:
     arkadaştan gelen topta gelişine şut ya da tek vuruşla pas (kontrol edip oynamaya karşı); seçilmezse yönlü ilk dokunuş planı */
  gelisineKarar(p,k){
    const b=this.ball;
    if(p.eylem||!(k.t>=0)||k.t>0.6||p.ilkSoruldu===b.surum)return;
    p.ilkSoruldu=b.surum;
    const s=this.topTahmin(k.t);
    if(b.sonTakim===p.team){
      const sut=p.rol!=='GK'&&ilkDokunusSutu(this,p,k.x,k.z,s.y);if(sut){this.vurusBaslat(p,sut);return;}
      const tk=tekVurusKarari(this,p,k,s,hyp(p.x-k.x,p.z-k.z)<=3.0);if(tk.sec){this.vurusBaslat(p,tk.sec);return;}
      this.bVeri(p).plan=this.dokunusPlani(p,k,s,tk.hedef);}
    else this.bVeri(p).plan=this.dokunusPlani(p,k,s,null);
  },
  /* destek noktası (Buckland): topun çevresinde 9–18 m halkada, pas yolu açık, ileride ve boşta olan yer */
  destekNoktasi(p,s,dt){
    if(p.destek&&this.t-p.destek.t<0.5)return p.destek;
    const d=this.dir[p.team],su=s.x*d,sw=s.z,ofs=this._ofs[p.team],rakip=this.teams[1-p.team];
    const ku=p.x*d,kw=p.z;let en=null,enP=-1e9;
    for(let i=0;i<14;i++){
      const a=(-1.35+i*0.21)+(this.rast()-0.5)*0.12,r=9+((i*7)%5)*2.2;
      const u=su+Math.cos(a)*r,w=sw+Math.sin(a)*r*(p.z>sw?1:-1)*(i%2?1:-1);
      if(u>ofs-0.6||u<-PL+4||w<2||w>PW-2)continue;
      let yol=99,bos=99;for(const o of rakip){if(!o.oyunda)continue;const ox=o.x*d;
        yol=Math.min(yol,segD(ox,o.z,su,sw,u,w));bos=Math.min(bos,hyp(ox-u,o.z-w));}
      /* T7c: son üçte birde orta saha ceza sahası önüne (zon 14) gelir: geri çevirme ve indirmenin alıcısı, uzaktan şut */
      const z14=p.rol==='OS'&&su>PL-40&&u>PL-26&&u<PL-15&&Math.abs(w-MZ)<11?MOTOR_AYAR.zon14:0;
      const puan=Math.min(yol,5)*1.1+Math.min(bos,8)*0.5+(u-su)*0.22-hyp(u-ku,w-kw)*0.1+z14;
      if(puan>enP){enP=puan;en={u,w};}}
    p.destek=en?{u:en.u,w:en.w,t:this.t}:null;return p.destek;
  },
  derinKosu(p,s,ofs,dt){
    const d=this.dir[p.team],su=s.x*d;
    if(p.kosu&&p.kosu.tur==='takip')p.kosu=null;   /* T7e: şutu takip koşusu top birinin ayağına geçince biter */
    if(p.kosu&&p.kosu.tur==='gecGiris')return null;   /* T14b: kutuya geç giriş bolgeKonumu'nda yürür */
    if(p.kosu){const k=p.kosu;k.t-=dt;
      if(k.t<=0||this.ball.sahip!==s||p.x*d>PL-6){p.kosu=null;return null;}
      return k;}
    /* Z1 (H3): plan&4'te derin koşuyu plan katmanı da başlatır (js/mac-ilkeller.js derinKosu); eski arka plan koşuları planArka oranında sürer —
       çekilişler aynı yerde, plan 0'da çarpan 1 (birebir) */
    const pk=this._pln&&(MOTOR_AYAR.plan&4)?MOTOR_AYAR.planArka:1;
    if(!(p.rol==='FV'||p.mevki.kanat||(p.rol==='OS'&&!p.mevki.derin&&su>5)))return null;
    const ileriBakar=Math.cos(s.yon)*d>0.2,serbest=baskiAltinda(this,s)<0.8,pu=p.x*d,A=MOTOR_AYAR,N=this._niyet&&this._niyet[p.team];
    /* T7c: tetikli koşu (plan T7 madde 5) — taşıyanın son kararında bu oyuncu için savunma arkasında bir ara noktası bulunduysa (0,5 sn içinde;
       pasSecenekleri kaydeder) ve taşıyanın başı yukarıdaysa (bakışı hücum yönünün ±60°'sinde) koşu o noktaya doğru başlar; sıklık topsuz
       hareketten ve kanallara koşma eğiliminden. Aynı anda en çok kosuEs koşu (js/mac-takim.js kosuBaslat; ortak koşu kosuOrtak) */
    const AK=this._araKayit&&this._araKayit[p.team].get(p),kos=this.kosuSayisi(p.team);
    if(AK&&this.t-AK.t<0.5&&serbest&&su>=-18&&kos<A.kosuEs){
      const bas=Math.abs(aciFark(s.bakisYon!=null?s.bakisYon:s.yon,d>0?0:Math.PI))<1.05;
      if(bas&&this.rast()<dt*A.kosuTetik*(0.5+profilAlt(p,'topsuzHareket',0.5))*(1+0.3*profilEgilim(p,'kanallaraKosar'))*(N?N.kosu:1)*pk)
        return this.kosuBaslat(p,s,Math.min(PL-8,AK.x*d+4),clamp(AK.z,4,PW-4),'arkaya');}
    if(!ileriBakar||!serbest||su<-18||Math.abs(pu-ofs)>4||kos>=A.kosuEs||this.rast()>dt*(p.rol==='FV'||A.kanatRol&&p.mevki.kanat?3.2:1.3)*A.kosuIstegi*A.kosuRastgele*(N?N.kosu:1)*pk*(1-(A.yorgunKosu||0)*clamp(((p.yorgunluk||0)-0.1)/0.25,0,1)))return null;   /* T18d: yorgun oyuncu daha seyrek koşar */   /* T7a: niyetin koşu çarpanı; T14a: kanat forvet sıklığında koşar (rolü savunma arkasıdır) */
    const hedefU=Math.min(PL-8,ofs+10+this.rast()*8),r2=this.rast()-0.5;
    /* T14a: kanadın koşusu çizgi boyunca ('genis'; içe kat eğilimi çaprazlama içeri alır), forvetin ve orta sahanınki kaleye doğru (eski);
       çekiliş sayısı ve sırası aynı */
    if(MOTOR_AYAR.kanatRol&&p.mevki.kanat){const f=clamp(0.1+0.3*profilEgilim(p,'iceKatEder'),0,0.45);
      return this.kosuBaslat(p,s,hedefU,clamp(p.z+(MZ-p.z)*f+r2*6,3,PW-3),f<0.2?'genis':'arkaya');}
    const hw=clamp(p.z+(MZ-p.z)*0.35+r2*10,8,PW-8);
    /* T2 olay: koşu başladı — topu tutan bir sonraki düşünme anını beklemeden yeniden bakar (kosuBaslat) */
    return this.kosuBaslat(p,s,hedefU,hw,'arkaya');
  },
  /* korner: kısa korner ya da orta ile aynı hedef mantığı (kafa vuranlar, koşular, ön direk ve penaltı noktası bölgesi); sıcaklıklı seçim */
  kornerSecenegi(du,tk){
    const d=this.dir[du.takim];
      const yan=Math.sign(du.z-MZ)||1;
      /* T8b: rutin (js/mac-durantop.js kornerGorev) — kısa kornerde kısa seçeneğe yerden (eski %13'lük zar kalktı; 20 m içinde arkadaş olmadığı için
         oluşmuyordu); ortada hedef görevlilerin koşu noktalarından değerle */
      if(du.rutin==='kisa'&&du.gorev)for(const [q,g] of du.gorev)if(g.rol==='kisa'&&q.oyunda&&q!==tk)return{tur:'pas',hx:q.x,hz:q.z,tip:'yer',alici:q};
      /* A4-2: yaya geri pas — ceza sahası kenarına geç koşan alıcının koşu noktasına yerden (js/mac-durantop.js kornerGorev) */
      if(du.rutin==='geri'&&du.gorev)for(const [q,g] of du.gorev)if(g.rol==='geri'&&q.oyunda&&q!==tk)return{tur:'pas',hx:g.kx,hz:g.kz,tip:'yer',alici:q};
      const Z2=!!(MOTOR_AYAR.sahne&2),S=kornerSecenekleri(this,tk,du.x,du.z,Z2?'kornerHizli':'korner');
      /* Z2b: rutinin hedef koşucusuna giden orta öncelikli (kornerOncelik); vurucu güçlü ayağıyla, iki ayaklı içe dönenle */
      if(Z2&&du.hedefQ)for(const s of S)if(s.q===du.hedefQ)s.deger*=MOTOR_AYAR.kornerOncelik;
      if(S.length){let en=-1e9;for(const s of S)en=Math.max(en,s.deger);
        const tau=0.6+0.8*(1-tk.oz.karar);let top=0;for(const s of S){s.a=Math.exp((s.deger-en)/tau);top+=s.a;}
        let x=this.rast()*top,c=S[S.length-1];for(const s of S){x-=s.a;if(x<=0){c=s;break;}}
        const sc={tur:'korner',hx:c.hx,hz:c.hz,tip:'hava',T:c.T,hy:c.hy,yay:'korner',alici:c.q};
        if(Z2){sc.ayak=tk.ayak==='iki'?this.kornerIceAyak(du):tk.ayak;
          /* alçak sert içe dönen (ön direğe dalış): baş hizasının altında, kısa uçuş */
          if(du.teslim==='alcak'&&c.q===du.hedefQ){sc.hy=1.1;sc.T=havaSure(hyp(c.hx-du.x,c.hz-du.z),'alcak');sc.yay='alcak';}}
        return sc;}
      const hedefler=[[PL-5.5,MZ+yan*2.2],[PL-7,MZ-yan*3.2],[PL-11,MZ],[PL-6,MZ]],h=hedefler[Math.floor(this.rast()*hedefler.length)];
      let al=null,ed=1e9;for(const p of this.sahadakiler(du.takim)){if(p===tk||p.rol==='GK')continue;const dd=hyp(p.x-d*h[0],p.z-h[1]);if(dd<ed){ed=dd;al=p;}}
      return{tur:'korner',hx:d*h[0],hz:h[1],tip:'hava',T:1.15+hyp(d*h[0]-du.x,h[1]-du.z)/30,alici:al};
  },
  /* T15c: duraklamanın sonunda kaleci erken kalkmışsa (penaltiTahmin: uçtuğu yan; kalkmadıysa 0) ve plan onun yanıysa vuran öbür köşeye döner
     (karar; köşe aynalanır, ortaya nişan değişmez) */
  penaltiDonus(p,sec){
    const gk=this.kaleci(1-p.team),yan=gk&&gk.oyunda?gk.penaltiTahmin||0:0,zt=sec.hz-MZ;
    if(yan&&Math.abs(zt)>0.5&&Math.sign(zt)===yan&&this.rast()<0.85*(0.5+0.5*p.oz.karar)){sec.hz=MZ-zt;sec.donus=true;}
  },
  /* T8d: penaltı planından (penaltiPlani; eskiden yan zarla, yükseklik ve güç vuruşta zarla): hedef, yükseklik ve güç sıcaklıklı seçilir (kararlı
     vurucu daha tutarlı); vurucunun gövdesinin gösterdiği yan (ipucu) burada belirlenir — kaleci koşuyu okuyup temastan önce kalkar (Ek G5) */
  penaltiAtisi(du,tk){
    const gx=this.dir[du.takim]*PL,d=this.dir[du.takim],gk=this.kaleci(1-du.takim),A=MOTOR_AYAR,oz=tk.oz;
    const sd=vurusSapma(tk,{sut:true,guc:VURUS_GUC_REF.sut,ref:VURUS_GUC_REF.sut,stil:'ic'})*A.duranSapma*penaltiSapmaK(tk);
    const X=penaltiPlani(this,tk,gk,sd),tau=Math.max(0.004,(0.06+0.18*(1-oz.karar))*X.en);let top=0;for(const c of X.Ls){c.a=Math.exp((c.Pg-X.en)/tau);top+=c.a;}
    let r=this.rast()*top,c=X.Ls[X.Ls.length-1];for(const c2 of X.Ls){r-=c2.a;if(r<=0){c=c2;break;}}
    const aldat=this.rast()<0.08+0.25*oz.sut,yan=(Math.sign(c.zt)||(this.rast()<0.5?-1:1))*(aldat?-1:1);
    /* T15c (2026-10-14; Ek G5): koşunun türü — duraklı koşu (topa 1,6 m kala 0,3–0,5 sn duraklama; vuranın soğukkanlılığı ve plase eğilimiyle,
       kullananların ortalaması ~%20 — gerçekte bugün penaltıların ~%15–25'i; penaltıyı soğukkanlı oyuncular kullandığından ilk katsayılar %33 veriyordu) ya da düz */
    const pD=clamp(0.2*profilAlt(tk,'sogukkanlilik',oz.karar)+0.08*profilEgilim(tk,'plaseVurur'),0.02,0.4),kosu=A.penaltiDurak&&this.rast()<pD?'durakli':'duz';
    return{tur:'sut',hx:gx,hz:MZ+c.zt,penalti:true,xg:c.Pg,pHy:c.yt,pV:c.v,pG:c.g,pTur:c.tur,ipucu:{yan,guven:clamp(0.85-0.7*oz.sut,0.15,0.8)},kosu};
  }
});
EYLEM_ADIM.vurus=function(p,e,dt){this.vurusIlerle(p,e,dt);return true;};
/* kontrol: iyi dokunuşta oyuncu topun arkasından koşusunu sürdürür (top bir adım önde) */
EYLEM_ADIM.kontrol=function(p,e){const b=this.ball;if(!e.kotu&&b.sahip===p&&e.yon!=null){p.tx=b.x+b.vx*0.2-Math.cos(e.yon)*0.3;p.tz=b.z+b.vz*0.2-Math.sin(e.yon)*0.3;p.hizOran=1;this.eforVer(p,1);
    if(MOTOR_AYAR.alisNiyet)p.yonHedef=e.yon;}   /* T23d1 (alisNiyet): gövde dokunuşun yönüne */
  else if(MOTOR_AYAR.alisNiyet&&e.kotu)p.yonHedef=null;   /* T23d1: kötü kontrolde topa (p.bak) bakar */
  return false;};
/* T23d1 (alisNiyet): iyi göğüs kontrolünde top düştükten sonra (0,2 sn) gövde dokunuşun yönüne döner */
EYLEM_ADIM.gogus=function(p,e){const b=this.ball;if(MOTOR_AYAR.alisNiyet&&e.t>=0.2&&b.sahip===p&&e.yon!=null)p.yonHedef=e.yon;
  /* T23d1 (alisCizgi): iyi göğüs kontrolünde oyuncu topun ardından gider (kontroldeki gibi; eskiden eski karşılama noktasına koşup topu geçiyordu) */
  if(MOTOR_AYAR.alisCizgi&&b.sahip===p&&e.yon!=null){p.tx=b.x+b.vx*0.2-Math.cos(e.yon)*0.3;p.tz=b.z+b.vz*0.2-Math.sin(e.yon)*0.3;p.hizOran=1;this.eforVer(p,1);}
  return false;};
