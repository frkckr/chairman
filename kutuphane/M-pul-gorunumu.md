# M — 2D maç görünümü ve pullar (P1 denemesi 2026-10-21 akşam; P2 kararı 2026-10-21 gece)

Bu bölüm maçı FM'deki gibi tepeden 2D izleme denemesinin bilgi tabanıdır: neden düşünüldü, araştırma ne dedi, bugün ne uygulandı ve neyin açık karar olduğu. Kural değildir. Yön kararı P2 ile kesinleşti (kullanıcı, 2026-10-21 gece): maç 2D, figür antrenman içindir. Program ve tur sırası [YOL_HARITASI](../YOL_HARITASI.md), turların özeti [FUTBOL_KUTUPHANESI §12.4](../FUTBOL_KUTUPHANESI.md#124-tamamlanan-turlar-ve-açık-kalanları) (P1–P2 satırı; ayrıntı `git show tur/p2:FUTBOL_KUTUPHANESI.md` §12.17–§12.18).

## M.1 Neden

- Kullanıcı (2026-10-21): figürlü maç izlemenin bütün çalışmalardan sonra istenen akıcılığa ve güzelliğe ulaşamama ihtimaline karşı radikal bir seçenek istedi. A1–A9 boyunca dokuz çizim turu, mocap eğrileri ve yeni insan modeline rağmen iki izleme noktasında 10 ve 21 not geldi; his hâlâ "robotik".
- Claude'un değerlendirmesi: klipsiz, kodla üretilen pozla vuruş, düşüş ve dalış gibi anlarda yanlış kare hep kalır ve her yeni motor davranışı yeni poz ister. Pullarda akıcılık bedavadır: konumlar saniyede 60 kez motordan gelir, basit şekil yanlış poz üretmez. Zekâ katmanı (plan, ilkeler, tarz, duran top sahneleri) çizimden bağımsızdır ve disklerle daha hızlı okunur.
- Kullanıcının kararı (2026-10-21 akşam): **maç FM 2D gibi tepeden izlenir; başkanın loca bakışı maçta kalkar.** Oyuncular sade, aynı numaralı pullar (ayak çizgi olarak; boy, saç, yapı ayrımı yok). Fark yaratacak şey **stat ve saha görüntüsü**: tepeden izlerken sahamızı beğenelim, deplasmanda başka bir statta olduğumuzu anlayalım; tribünlerden meşale yanar, duman sahaya doğru hafifçe gelir; tribünler, saha kenarı ve reklamlar zamanla geliştirilir. Figürler silinmez: ileride antrenman sahnesinde (yakından, az kişi; orta, kafa, şut, pas çalışmaları) kullanılır.

## M.2 Araştırma özeti (2026-10-21; üç tarama)

**Football Manager'ın 2D'si.** CM4 (2003) 2D motoru getirdi, FM09 3D'yi; 2D bütün seride kaldı. FM26 (Unity, Kasım 2025) 2D'yi bıraktı sanıldı ama kalitesi düştü: top havada aynı boyda, diskler büyük, kornerde okunmuyor, yön okları "çirkin". FM27'nin 16 Ekim 2026 tanıtımı: daha küçük disk ve top, topa daha güçlü gölge, saydam ağ ve **oklar yerine ayaklar**; forumda tepki olumlu. SI 2013 anketinde (349 oy) 3D %46, 2D %44.

**İnsanların 2D'de sevdiği:** bütün sahayı görmek, taktik hatayı anında yakalamak, hayal gücünün boşluğu doldurması, hızlı izlemede okunurluk, performans. **Sevmediği:** topun yerde mi havada mı olduğunu anlayamamak, hangi ayakla vurulduğunu görememek, "saatlerce yuvarlak izlemek". Türk forumlarında da aynı: "normal maçlarda 2D, derbide 3D", "3D'de oyuncular böcek gibi".

**Diğer oyunlar.** Motorsport Manager'ın noktalarla yarış görünümü çok sevildi; çünkü görünüm bir karar yüzeyiydi (pit, lastik, yağmur, kazalar). Top Eleven'ın 2D'si hoşgörüldü ("golü kırmızı yuvarlak atsa da gol"), sonra 3D en çok istenen özellik oldu. Soccer Manager 2023'te "yuvarlakları izlemek çabuk sıkıyor, herkes anında simülasyona basıyor". 90 Minute Fever'da "izleyecek bir şey yok". Başkan oyunlarının hepsi metinle idare ediyor; kullanıcılar "sahada küçük oyuncular" istiyor; incelenmiş diskli bir başkan oyunu yok.

**Ders:** pullar, izlenen şeyin okunacak bilgisi ve sonucu varsa işler; yalnız seyirlikse sıkar. Bizim karşılıklarımız: telefon, karar anı, rakip başkan, önemli anda kendiliğinden yavaşlama (ikiz motor), ileride akış/baskı göstergesi ve olay işaretleri.

**Teknik ipuçları (kaynaklı).** Yükseklik için gölge ayrılması ana ipucudur, top en çok ~1,5 kat büyür; uzak pullar için ekranda en küçük boy; yön için çentik ya da ayak; sürüşte top ayağa yapışmaz (Kick Off öğretisi); izleme verisi görselleştirmelerinde (SkillCorner, Metrica, mplsoccer) top taşıyan ayrı renk ve kısa iz.

**P2 (kullanıcı kararı, 2026-10-21 gece, kesin):** maç 2D izlenir; figürlü motor antrenman içindir. Aşağıdaki M.3 P1'in kaydıdır; bugünkü uygulama M.5'te.

## M.3 P1 denemesinin uygulaması (2026-10-21 akşam; tarihsel)

- **Açma:** Ayarlar > Maç > "2D maç görünümü (deneme)", maçta G tuşu, adres `?pul=1` (`?pul=0` ayarı ezer). Z tuşu yakınlık (yakın 40 m, orta 60 m, bütün stat 100 m; `?tepeSeviye=0|1|2`). Maç öncesinde kendiliğinden bütün stat görünür.
- **Kamera** (`js/kamera.js` `tepeKamera`): 110 m yukarıdan dik aşağı, saha yatay, ana tribün altta (locadakiyle aynı sol–sağ). Kamera topu yumuşakça izler, statın dışına taşmaz. Başkanın ön planı (masa, eller) çizilmez. Locaya giriş sahnesi şimdilik aynen.
- **Pullar** (`js/pul.js`): sahadaki herkes (oyuncu, kaleci, hakemler, yedekler, kenar personeli, top toplayıcılar) aynı pul. Üst yüz forma rengi, forma süsünün renginde kenar halkası ve numara (ekranda dik). Önde iki ayak çizgisi gövde yönünde döner, adım temposuyla salınır; vuran ayak temas anında amber parlar. Yatan oyuncu düz ve koyu. Pulun altında yere düşen leke havadayken yerde kalır (sıçrama ve kafa ipucu). Kulübedekiler koltuk yüksekliğinde.
- **Stat** bugünkü 3B stattır: tribünler ve kalabalık, meşale dumanı, reklam panoları, tel örgü, projektörler, kale arkaları, çevre (yamaç, evler). Topun projektörlerden dört yöne gölgesi ve havadaki topun altındaki leke aynen.
- **Motor ve figür çizimi değişmedi:** iskelet ve animasyon arka planda çalışmaya devam eder (kart, bayrak, defter, sprey kemiklere bağlı olduğu için görünür kalır); 2D kapalıyken oyun S1 ile aynıdır.

## M.4 Açık sorular ve sonraki adımlar (P1 sırasında yazıldı; kalanlar E turunda)

- **Karar:** P2'de verildi (maç 2D); A10 ve A11 maç için kapandı, V1 D turuna daraltıldı, program FUTBOL_KUTUPHANESI §12.1 A–F.
- **Statın tepeden kimliği (kullanıcının "farkımız" dediği yer):** tepeden okunan tribün dokusu ve kalabalık, meşale ve dumanın sahaya sürüklenmesi, pankartlar, reklam panolarının tepeden okunması, zemin ve biçme deseni, hava (yağmur, rüzgâr, gölgeler), deplasman statlarının ayrışması (tarif başına çevre, tribün biçimi, renkler), maç günü ışığı.
- **Pul dili:** olay işaretleri (kart, sakatlık, değişiklik simgeleri), top taşıyanın ad etiketi, kısa top izi, gol sonrası ve seremoni sahnelerinin tepeden okunuşu, kalabalık kutuda pul boyu.
- **Locaya giriş ve karar anı:** 2D'de locaya giriş ve rakip başkanla karar anı ayrı tasarlanır (bugün giriş atlanır, karar anı 2D üstünde kart; M.5).
- **Hız:** pullarda figür animasyonu gereksizdir; pul motor alanlarından beslenince 2D'de figür güncellenmez ve çizim süresi düşer (E turu; bugün figür arka planda çalışmaya devam ediyor).

## M.5 Bugünkü uygulama (P2, 2026-10-21 gece)

- **Görünüm:** 2D varsayılan. Kamera 110 m'den dik aşağı, saha yatay, ana tribün altta; üç yakınlık (dikey 34, 46, 70 m; Z tuşu), maç öncesinde bütün stat; kamera statın sınırında kalır (tribün arkalarından türetilir). Loca bakışı TEST: Ayarlar > Geliştirici "Maçta loca bakışı (TEST)", maçta G tuşu, `?pul=0`.
- **Pullar:** 1,7 kat (orta seviyede çap ~27 px), numara 32 piksellik dokuda 3 kat, ayaklar çizgi, vuran ayak amber, yatan oyuncu düz ve koyu.
- **Top:** 2 kat boy, havada büyür; yumuşak gölgesi yükseldikçe sağ-aşağı kayar ve solar; ardında sönen iz (eğri görünür); havadaki topun ineceği yerde halka; projektör top gölgeleri kapalı.
- **Stat:** kompakt kasaba stadı — üç tarafta uzun, çatısız tribün; doğu kale arkasında kayaya oyulmuş ayakta teraslar ve yamaç; karşıda demo inşaat bölümü. Tarif v2 (mesafe, uzunluk, sıra, bölüm durumu, tip yamac) başka kulüplerin statları ve tribün gelişimi içindir.
- **Falso:** `pasEgriKat` 1,6 (kullanıcı, P2: “daha çok falsolu pas”). A turunda 40 maç (`araclar/taban/p2.json`): sağlık aralığında; s1'e göre gol 2,88 → 2,40, gerçekleşen ÷ konum xG 1,51 → 1,02 — yön, denge kararı verilmedi. Falsonun oyuncunun pas özelliğine bağlanması C'de, V1c eğri tablosuyla birleşmesi D'de (FUTBOL_KUTUPHANESI §12.1).
- **Akış:** locaya giriş şimdilik atlanır; rakip başkanın karar anı 2D üstünde kart.
- Sonuç ve denetimler [FUTBOL_KUTUPHANESI §12.4](../FUTBOL_KUTUPHANESI.md#124-tamamlanan-turlar-ve-açık-kalanları) (P1–P2 satırı; ayrıntı `git show tur/p2:FUTBOL_KUTUPHANESI.md` §12.18).

## Kaynaklar — M

- FM27 2D tanıtımı (16 Ekim 2026): https://www.footballmanager.com/fm27/features/fm27-2d-match-engine-game-editor-and-deeper-world-upgrades ; forum tepkisi: https://community.sports-interactive.com/forums/topic/612208-fm27-2d-match-engine-in-game-editor-and-deeper-world-upgrades/
- FM26 2D eleştirileri: https://community.sports-interactive.com/forums/topic/594339-2d-match-engine-poor-quality/ , https://community.sports-interactive.com/forums/topic/593877-2d-camera/ ; 26.1.0 yaması: https://www.fmscout.com/a-fm26-update-26.1.0.html
- 2D ↔ 3D anketi ve tartışmalar: https://community.sports-interactive.com/forums/topic/296331-2d-classic-vs-3d-match-engine/ , https://community.sports-interactive.com/forums/topic/411123-how-many-of-you-still-use-2d-classic/
- Türk toplulukları: https://forum.donanimhaber.com/hangi-mac-motorunu-kullaniyorsunuz-2d-3d--54584674 , https://eksisozluk.com/football-manager-2024--3493947 , https://eksisozluk.com/football-manager-2026--3543000?p=7
- Motorsport Manager: https://steamcommunity.com/app/415200/reviews/?browsefilter=toprated , https://www.stuff.tv/game-reviews/motorsport-manager/review
- Top Eleven: https://www.pocketgamer.com/top-eleven/review/ ; Soccer Manager 2023: https://www.taptap.io/post/4754497 ; 90 Minute Fever: https://indieranger.com/review-90-minute-fever
- Başkan oyunları: https://apps.apple.com/us/app/football-chairman-pro/id992140496 , https://www.cubed3.com/games/reviews/pc/club-soccer-director-pro-2020 ; Mini Soccer Manager: https://store.steampowered.com/app/4993050/
- Teknik: top yüksekliği ve gölge https://yal.cc/top-down-bouncing-loot-effects/ ; Kick Off postmortem https://gdcvault.com/play/1019341/Classic-Game-Postmortem-Kick ; SkillCorner görselleştirme https://skillcorner.com/articles/skillcorner-open-data-5-visualising-football-tracking-data ; mplsoccer animasyon https://mplsoccer.readthedocs.io/en/latest/gallery/pitch_plots/plot_animation.html
