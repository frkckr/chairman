# G. Hoca tarzları, panzehirler ve kadro uyumu

Futbol Kütüphanesi'nin G bölümü. Amaç: motorun "ilkel × bağlam × rol" diliyle çalıştırabileceği, hocaya bağlı bir **tarz** (style) katmanı için bilgi tabanı. Hocanın gizli beceri puanı, ekibinin katkısı ve ısrar ettiği oyun planları; rakibin tarzının sahada okunması; tarzlar arası "kenar" (edge) ilişkileri; kadro ile tarzın uyumu.

Yazım kuralları:
- Her sayısal iddianın yanında köşeli kaynak numarası vardır: [K12]. Kaynak listesi bölüm sonundadır.
- Kaynak bulunamayan ama motor için gereken değerler **tahmin** diye işaretlidir; bunlar motorda ayar anahtarı olur, belge değeri değildir.
- Arama bütçesi bu oturumda tükendiği için bazı sorular **bulunamadı** olarak bırakıldı; devam notunda sıralıdır (G8).
- Oyundaki kişiler kurgusaldır. Buradaki gerçek hoca ve takım adları yalnız arketip ve kaynak içindir; oyuna isim girmez.
- İlkel adları: "üçüncü adam", "yükle–yalıt (overload–isolate)", "uzun top + ikinci top", "karşı pres (counterpress)" bu belgenin ortak çerçevesinden alınmıştır; A–F bölümleri henüz okunamadığı için diğer ilkel adları açıklayıcıdır ve A–F ile eşlenirken yeniden adlandırılabilir (işaret: *A–F ile eşle*).

İçindekiler: G1 tarz taksonomisi · G2 panzehir ilişkileri · G3 hoca değişikliği ve kadro uyumu · G4 hoca becerisi ve ekip · G5 taktik savaşın görünürlüğü · G6 motor için notlar · G7 ölçüler · G8 bulunamayanlar · Kaynaklar.

---

## G1. Tarz taksonomisi

### G1.0 Ortak parametre seti ve ölçüm sözlüğü

Bütün arketipler aynı on eksenle tarif edilir. Her eksen 0–1 aralığında bir motor anahtarıdır; aşağıdaki sözel değerler (düşük/orta/yüksek) kaynaklı sayı yoksa **tahmin**dir.

| Eksen | Anlamı | Sahadaki ölçüsü (veri sağlayıcı tanımı) |
|---|---|---|
| Tempo (tempo) | Topu ilerletme hızı | Opta "direkt hız" (direct speed, m/sn): 2024-25 PL'de en hızlı Nottingham Forest 2,1 m/sn, en yavaş Manchester City 1,4 m/sn [K1] |
| Risk (risk) | Pas seçiminde ileri/dikey tercih, top kaybına tolerans | İleri pas payı (forward play) [K3]; dizi başına pas (City 5,1, lig ikincisi Southampton 4,4) [K1] |
| Pres yüksekliği (press height) | Topu nerede kazanmaya çalıştığı | "Yüksek top kazanma" (high turnover: rakip kalesine 40 m içinde başlayan sahiplik; 2024-25 City 300, Bournemouth 298) [K1]; PPDA (passes per defensive action: rakibe izin verilen pas / savunma eylemi; düşük = yoğun pres). Lig çapında PPDA değer tablosu **bulunamadı** (G8) |
| Hat yüksekliği (line height) | Savunma hattının kaleye uzaklığı | Opta "başlangıç mesafesi" (start distance: sahipliğin kendi kalesinden başladığı ortalama uzaklık; City 46,2 m, Forest 39,6 m, Ipswich 39,5 m) [K1]; savunma hattı yüksekliği metriği için kaynak **bulunamadı** |
| Genişlik (width) | Kanat kullanımı, saha genişliği | Opta/StatsBomb "merkezilik" (centrality: son üçte birdeki tamamlanan pasların ortadan payı) [K3] |
| Direktlik (directness) | Uzun pas ve ikinci top oyunu | Uzun pas payı: Burnley (Dyche) bir sezonda 2.251 uzun top, lig birincisi, isabet %57,1 (lig ort. %55,7) [K7]; başka bir ölçümde pasların %19,5'i 35 yarda üstü [K8] |
| Karşı pres eğilimi (counterpress) | Top kaybından sonra anında baskı | StatsBomb "pressure" olayları; yüksek top kazanmadan şut oranı (Bournemouth %20,8, City %13,7) [K1] |
| Duran top ağırlığı (set-piece weight) | Gol üretiminde duran topun payı | Lig geneli: 2024-25 PL'de gollerin %22,0'ı duran toptan; 2025-26 başında %30,0 (tarihî ikinci; rekor 2009-10 %31,0) [K20]; 2020-21 rekor düşük %19,2 [K21] |
| Savunma şeması (defensive scheme) | Bölgesel / adam adama / karma | Köşe vuruşunda 436 kornerlik PL örnekleminde yaklaşık %90 adam adama [K24] |
| Oyun kurma şekli (build-up) | Kaleciden kısa / uzun / karma | Kale vuruşunun kendi ceza sahasında bitme payı (Southampton 2024-25 ligde ikinci) [K10] |

Tarz sınıflamasında tek metrik yetmez: UEFA Şampiyonlar Ligi takımlarını kümeleyen bir çalışma, topa sahip olma oranının tek başına yalnız kaba bir sınıflama verdiğini, birden çok gösterge ve k-ortalama (k-means) kümelemesinin gerektiğini söyler [K4]. StatsBomb'un takım tarzı modeli 32 olay türünün (pas, taşıma, şut; baskı, müdahale, kesme) konum ısı haritalarını kullanır; takımın savunma profiline rakibin ona karşı yaptığı hücum olayları da girer; bölünmüş-takım testinde doğru takımı %90 civarı ilk sırada bulur (MRR 0,918) [K2]. Beş büyük ligin 2016-17 sezonundan 3 milyon olayla yapılan derin gömülü kümeleme (DEC) çalışması oyunu dört evreye (toplu, topsuz, iki geçiş) ayırıp evre başına kümeler ve kümelerin maç sonucunu tahminde farklı güçte olduğunu bulur [K5]. Opta'nın eski "takım kişilikleri" (team personas) kümelemesi beş bileşen kullanmıştı: yüksek sahiplik, inatçı savunma, uzun toplar, hızlı hücum, orta [K6] (sayfa artık erişilemiyor; arama özetinden).

Opta'nın bu belgede kullanılan dizi tanımları [K1]: **direkt hücum** (direct attack) kendi yarı sahasının hemen içinde başlayıp rakip kaleye doğru mesafesinin en az %50'sini kat eden ve şutla ya da ceza sahasında dokunuşla biten açık oyun dizisi; **kurma hücumu** (build-up attack) 10+ paslı ve şut ya da ceza sahasında dokunuşla biten dizi; **yüksek top kazanma** rakip kaleye 40 m içinde açık oyunda başlayan sahiplik; **başlangıç mesafesi** takımın açık oyun dizilerinin kendi kalesinden başladığı ortalama uzaklık. Motorun ölçüm araçları (G7) bu tanımları birebir kullanırsa gerçek lig değerleriyle karşılaştırma mümkün olur.

Motor için çıkarım: tarz, dört evrenin her birinde ayrı bir ağırlık vektörüdür; "tek etiket" değildir (G6).

### G1.1 Konumsal top oyunu (positional play, juego de posición)

- **Parametreler:** tempo düşük, risk orta (pas güvenliği yüksek, son üçte birde yüksek), pres yüksek, hat yüksek, genişlik yüksek (kanat açıcılar), direktlik düşük, karşı pres yüksek, duran top orta, savunma bölgesel, oyun kurma kısa.
- **İlkeller:** üçüncü adam; yükle–yalıt; çizgi arası alma (*A–F ile eşle*); yarım alan (half-space) işgali; dinlenme savunması (rest defence) 2-3 / 3-2; karşı pres; kalecinin oyun kurucu olması.
- **Kadro gereksinimi:** topla rahat iki stoper, baskı altında dönebilen pivot, iki ayaklı iç orta sahalar, bire bir kazanan geniş kanatlar, topla oynayabilen kaleci. Eksikse: stoperler baskı altında uzun topa döner, "başlangıç mesafesi" düşer ve tarz çöker; pivot yoksa üçüncü adam kurulamaz; kanat yalıtması bire bir kazanan yoksa boşa gider.
- **Tipik sayılar:** Manchester City 2024-25: dizi başına 5,1 açık oyun pası, 656 adet 10+ paslı dizi (Forest 192), ortalama dizi süresi 15,7 sn (en yakın rakibinden 3 sn uzun), dizi başına ilerleme 14,4 m, başlangıç mesafesi 46,2 m, direkt hız 1,4 m/sn [K1]. Promosyonla çıkan Southampton 2023-24 Championship'te %66,1 sahiplik, maç başına 666,7 pas, %89,7 isabet (2013-14'ten beri rekor) [K10]. Burnley (Kompany) Championship 2022-23: %64,6 sahiplik, 744 adet 10+ paslı dizi (Dyche'ın Premier Lig 2021-22'sinde %39,1 ve 112) [K11].
- **Temsilciler:** Guardiola (Barcelona 2008-12, Bayern, City), De Zerbi (Brighton), Kompany (Burnley 2022-23), Russell Martin (Southampton 2023-24).
- **Türkiye karşılığı (esin):** G1.12.

### G1.2 Yüksek pres + dikey oyun (high press & verticality, "gegenpressing")

- **Parametreler:** tempo yüksek, risk yüksek, pres çok yüksek, hat yüksek, genişlik orta, direktlik orta-yüksek (kazanır kazanmaz ileri), karşı pres çok yüksek, duran top orta, savunma bölgesel-yönelimli (adam yönelimli baskı tetikleyicileriyle), oyun kurma karma.
- **İlkeller:** karşı pres (top kaybından sonra 5–6 saniye); pres tetikleyicisi (geri pas, kötü kontrol, kenara pas; *A–F ile eşle*); kazanımdan sonra ilk pas ileri; üçüncü adam koşusu; kanat üçgeni.
- **Kadro gereksinimi:** yüksek tekrarlı sprint kapasitesi, arkaya koşan hızlı kanatlar, uzun topla başa çıkan ve hız açığı vermeyen stoperler, kaleci-libero. Eksikse: hat yüksek kalırken arkası açılır (G2.3), pres aşıldığında sayıca eksik savunma; yorgunluk ikinci yarıda tarzı yarı yolda bırakır (Coaches' Voice, Bielsa için: bu yoğunluğu sezon boyu sürdürmek çoğu kez zor olmuştur [K16]).
- **Tipik sayılar:** 2024-25 PL'de yüksek top kazanma City 300, Bournemouth 298, Tottenham 287, Arsenal 285; bu kazanımlardan şuta çevirme Forest %21,3, Liverpool %21,1, Bournemouth %20,8 [K1]. Atalanta–Liverpool (Avrupa Ligi 2024 çeyrek final): Liverpool pres eylemlerinin %69'unda topu geri kazandı, Atalanta %50; buna rağmen maç 0-3 Atalanta (Atalanta kazanımdan sonra daha kararlıydı) [K17]. Bu örnek motor için önemlidir: pres verimi tek başına sonuç vermez; kazanımdan sonraki ilk üç saniye (geçiş ilkeli) ayrıca puanlanmalıdır.
- **Temsilciler:** Klopp (Dortmund, Liverpool), Rangnick okulu (RB takımları), Bielsa (G1.9 ile kesişir), Tuchel'in Dortmund'u.
- **Panzehiri:** uzun top + ikinci top (G2.3, G2.6).

### G1.3 Geçiş / kontra oyunu (transition / counter-attack)

- **Parametreler:** tempo çok yüksek (kazanınca), risk yüksek, pres orta (orta blok tuzakları), hat orta, genişlik orta, direktlik yüksek, karşı pres düşük-orta, duran top orta, savunma bölgesel kompakt 4-4-2, oyun kurma karma/uzun.
- **İlkeller:** kazanımdan sonra ara pas (through-ball) ve arkaya koşu; "iki pasta kale" (*A–F ile eşle*); yükle–yalıt yerine boş alana koşu; ikinci top; orta blok tuzağı (rakibi kenara itip kazanma).
- **Kadro gereksinimi:** hızlı santrfor ve kanat, ara pas verebilen en az bir oyuncu, ikinci topu toplayan iki orta saha, derin oynayabilen stoperler. Eksikse: kontra hızı düşer ve takım alçak bloğa (G1.4) ya da direkt oyuna (G1.5) kayar; kaybı kalite yetersizliğinden değil ilkel seçiminden ölçmek için StatsBomb "hızlı sahiplik" (>5 m/sn) payı izlenir.
- **Tipik sayılar:** Leicester 2015-16 (şampiyon): sahiplik %42,43, PL şampiyonları arasında en düşük [K12]; şutlarının hızlı sahiplikten payı %27,5 → %32,1, kontra payı %20,1, açık oyun xG'si maç başına 0,70 → 0,94, kontra şutlarının %27'si ara paslı (önceki yıl %11) [K13]. Atlético 2013-14: sahiplik %46,8, 61 maçta 108 hızlı kontra (maç başına 1,8; 2015-16'da 0,4, 2019-20'de 0,5) [K14]; 90 puan, 26 gol yedi [K15].
- **Temsilciler:** Ranieri'nin Leicester'ı, Simeone'nin erken Atlético'su, Mourinho'nun Inter 2010'u (alçak blokla kesişir), Ancelotti'nin 2022 ve 2024 Real Madrid'i (G1.8).
- **Panzehiri:** kontrayı başlatacak kazanımı vermemek (düşük risk, dinlenme savunması), uzun top (ikinci topu kazanan takım kontrayı kesmeden gelir).

### G1.4 Alçak blok + kontra (low block)

- **Parametreler:** tempo düşük (topsuz), risk düşük, pres düşük, hat alçak, genişlik düşük (dar iki hat), direktlik yüksek (çıkışta), karşı pres düşük, duran top yüksek, savunma bölgesel 4-4-2 / 5-4-1, oyun kurma uzun.
- **İlkeller:** iki kompakt hat ve kaydırma; ceza sahası önünü kapatma (StatsBomb "nullifiers" ailesi: merkezden neredeyse hiç oyun izni yok, maç başına 10'un altında şut) [K3]; temizlemeden sonra ikinci top; sayı üstünlüğüyle blok (şut bloğu); kontra için tek hedef adam.
- **Kadro gereksinimi:** hava topu kazanan stoperler, disiplinli kanat orta sahalar, topu tutabilen fiziksel forvet, iyi kaleci. Eksikse: blok delinmez ama çıkış olmaz ("sonuç 0-0 ya da tek duran top"), yorulma ve geç gol.
- **Tipik sayılar:** Inter–Barcelona 2010 yarı final rövanşı: Sky Sports'ta sahiplik 86,4–13,6 [K26]; Jonathan Wilson'ın yazısında %19 [K27] (kaynaklar farklı; tam maç verisi için UEFA raporu teyit edilmeli). Chelsea–Barcelona 2012 yarı finali, iki maç toplamı: Barcelona %73 sahiplik, 1.537 pas (Chelsea 329), 46 şut (Chelsea 12), 18 korner (Chelsea 2); tur Chelsea'nin (3-2) [K28]. Atlético 2013-14: yukarıda [K14][K15].
- **Temsilciler:** Mourinho (Inter 2010, Chelsea 2014-15'in büyük maçları), Di Matteo'nun Chelsea'si 2012, Simeone, Pulis'in Stoke'u (duran topla birlikte, G1.10), Dyche'ın Burnley'i (direkt oyunla birlikte).
- **Panzehiri:** sabırlı konumsal oyun + yüksek kaliteli orta/duran top; gol erken gelirse blok açılmak zorunda kalır (G2.1 koşulları).

### G1.5 Direkt oyun + ikinci top (direct play & second balls)

- **Parametreler:** tempo yüksek (topa), risk orta (uzun top kayıp sayılmaz, ikinci top planlıdır), pres orta (ikinci top çevresinde), hat orta-alçak, genişlik orta, direktlik çok yüksek, karşı pres yüksek (yalnız ikinci top bölgesinde), duran top yüksek, savunma bölgesel, oyun kurma uzun.
- **İlkeller:** uzun top + ikinci top (hedef adam, geriye doğru ikinci top için katmanlı yapı); taç ve kale vuruşunun hücum silahı olması; yükle–yalıt yerine "düşen top bölgesine yükleme"; Spielverlagerung'un ayrımı: ölü toptan uzun top en isabetli, "seçilmiş" uzun top (zaman varken) güvenilir, "zorlanmış" uzun top en kötü [K30].
- **Kadro gereksinimi:** hava topu kazanan santrfor, ikinci topa inen iki orta saha, uzun topu doğru atan stoper/kaleci. Eksikse: ikinci top rakibe kalır, takım hem topsuz hem düzensiz olur.
- **Tipik sayılar:** Burnley (Dyche) 2018-19: 2.251 uzun top, lig birincisi, isabet %57,1 (lig %55,7) [K7]; başka sezon 1.737 ile birinci [K9]. FIFA Kulüp Dünya Kupası 2025 teknik çalışma grubu: yüksek pres yapan baskın takıma karşı daha direkt oynayan rakipler, arkadan kurmaya çalışanlardan daha başarılı oldu; Benfica Bayern'i prese davet edip uzun oynadı, ilk ve ikinci topu kazandı; Ulsan ilk yarıda sabırlı kurup 10 top kaybı yaşadı, ikinci yarıda uzun oyuna geçince daha etkili oldu [K31].
- **Temsilciler:** Dyche (Burnley, Everton), Pulis (Stoke), Allardyce, eski İngiliz ikinci lig geleneği; modern karışımı: Brentford (Frank) duran topla birlikte.
- **Panzehiri:** hava topu güçlü ve derin savunan stoperler + katmanlı ikinci top yapısı; yüksek hat burada tehlikelidir (G2.3).

### G1.6 Kanat ve orta ağırlıklı oyun (wing play & crossing)

- **Parametreler:** tempo orta, risk orta, pres orta, hat orta, genişlik çok yüksek, direktlik orta (kanada uzun diyagonal), karşı pres orta, duran top yüksek (orta yapan takım korner üretir), savunma bölgesel, oyun kurma karma.
- **İlkeller:** yükle–yalıt (kanatta bire bir); bindirme (overlap/underlap); erken orta ve ters kanat; kesme orta (cut-back); ceza sahasında üç koşu (ön direk, penaltı noktası, arka direk); korner kazanma.
- **Kadro gereksinimi:** bire bir geçen kanatlar ya da iyi orta açan bekler, kafası iyi forvet, arka direğe gelen kanat. Eksikse: orta sayısı artar ama kalite düşer; rakip stoperler kafayı kazanınca kontra yenir.
- **Tipik sayılar:** StatsBomb tarz modelinde "kutuya pas" bileşenleri: kesme/dar orta, geniş orta ve kafa devamı (flick-on), merkezden pas [K2]. Lig çapında orta/gol verimi için kaynak **bulunamadı** (G8).
- **Temsilciler:** klasik 4-4-2 kanat oyunu (Ferguson'un bazı dönemleri), Atalanta'nın kanat bekleri (G1.9 ile), Dyche–Pulis karışımları.
- **Panzehiri:** ceza sahasında hava topu üstünlüğü ve kanatta ikili kapatma; kompakt alçak blok ortayı en iyi savunan şemadır (tahmin; blok ailesinde "kutuya pas izni düşük" gruplar [K3]).

### G1.7 İlişkisel / serbest oyun (relationism, "a-positional")

- **Parametreler:** tempo orta-yüksek (top çevresinde), risk yüksek, pres yüksek (top kaybında yakın olduğu için), hat yüksek, genişlik düşük (bir kanada yığılma, lopsided), direktlik düşük, karşı pres çok yüksek (doğal olarak yakınlar), duran top düşük, savunma adam yönelimli (yakınlık), oyun kurma kısa.
- **İlkeller:** yakınlık (top sahibine 3–4 yakın seçenek); ikili (tabela / one-two); rondo mantığıyla ilerleme; üçüncü adam (en çok kullanan tarz); rotasyon; karşı pres.
- **Kadro gereksinimi:** dar alanda top tutabilen teknik oyuncular, tüm hat boyunca top sahibi olabilen stoperler, serbest rolde yaratıcı "10". Eksikse: yığılma sayıca üstünlük yerine kalabalık olur; top kaybında uzak kanat tamamen boştur (zayıf dinlenme savunması).
- **Tipik sayılar:** Sky Sports'un Diniz/Fluminense yazısı tarzı anlatır ama sayı vermez [K32]; Maric'e göre etiket değil ilke önemlidir: Fluminense "topu tutmaya odaklanır ama mekânsal yöne daha az bakar" [K32]. Man City–Fluminense 4-0 (2023 Kulüp Dünya Kupası finali) tarzın en üst düzeyde çıkışının sınırını gösterir [K33]. Sayısal tarz profili **bulunamadı**.
- **Temsilciler:** Diniz (Fluminense 2022-23), Brezilya geleneği; Avrupa'da Maric'in de belirttiği gibi De Zerbi ve Guardiola'nın bazı ilkeleriyle akraba [K32].
- **Panzehiri:** uzak kanada hızlı taraf değiştirme (switch) ve boş kanada koşu; kalabalık bölgeyi bırakıp bölgesel kompakt savunma (G2.7).

### G1.8 Pragmatik / kontrol oyunu (pragmatic control — Ancelotti arketipi)

- **Parametreler:** bütün eksenler orta ve **maça göre oynar**: tempo orta, risk düşük-orta, pres orta (büyük maçta düşük), hat orta, genişlik orta, direktlik orta, karşı pres orta, duran top orta, savunma bölgesel, oyun kurma karma.
- **İlkeller:** dinlenme savunması; kontrollü sahiplik (skor öndeyken tempo düşürme); kontra (büyük rakibe karşı); kaliteli bireye alan açma (yalıt); duran top disiplini.
- **Kadro gereksinimi:** tarz kadroya uyar; asıl gereksinim yıldızların uyumu ve savunma disiplinidir. Eksik yıldız yoksa "kimliksiz" kalır (eleştiri: pasiflik sınırında pragmatizm [K34]).
- **Kanıt:** Ancelotti kariyerine Sacchi etkisiyle katı 4-4-2 ve yoğun presle başladı; Parma'da Baggio'yu dışarıda bırakmasından pişman olduğunu söyledi; Juventus'ta Zidane için 3-4-1-2'ye, Milan'da Pirlo için elmas ortaya ve 4-3-2-1 "yılbaşı ağacı"na geçti; Chelsea'de şekli öngörülemezlik için değiştirdi; Real Madrid'de 4-3-3'te karar kılıp sonra kontraya kaydı; 2023-24'te forvetsiz 4-3-1-2 ve City'ye karşı alçak blok [K34]. Şampiyonlar Ligi: 2003, 2007 (Milan), 2014 (Real Madrid) ve iki kez daha (toplam beş) [K34].
- **Temsilciler:** Ancelotti, Heynckes, Zidane, bazı dönemlerinde Mourinho (2010 sonrası), Deschamps.
- **Panzehiri:** belirgin yok; zayıf yanı kalite farkı kapandığında kimlik eksikliğidir (tahmin). Motorda bu arketipin "panzehir" değil "panzehirsiz, kenarsız" olması tasarım kararıdır (G6).

### G1.9 Adam adama agresif oyun (aggressive man-to-man — Bielsa / Gasperini)

- **Parametreler:** tempo yüksek, risk yüksek, pres çok yüksek (adam yönelimli), hat yüksek, genişlik yüksek (kanat bekleri), direktlik orta, karşı pres çok yüksek, duran top orta, savunma **adam adama + bir fazla adam** (Bielsa) ya da **tüm saha adam adama** (Gasperini), oyun kurma kısa (Bielsa) / karma (Gasperini).
- **İlkeller:** adam adama takip ve "fazla adam" (spare man); bire bir kazanma; üçüncü adam koşusu (Pašalić'in Barcelona'ya golü üçüncü adam koşusuyla [K19]); yükle–yalıt yerine "her yerde bire bir"; rotasyon (Bielsa'nın orta sahası sıkı adam adama rakiplere karşı döner [K16]).
- **Kadro gereksinimi:** bire bir kaybetmeyen savunmacılar, koşu kapasitesi yüksek bütün kadro, uzun topu kazanacak stoper. Eksikse: bir adamın geçilmesi bütün yapıyı açar (Coaches' Voice: bire bir kaybı en yakın oyuncuyu adamını bırakmaya zorlar [K16]); yorgunluk sezon içinde yoğunluğu düşürür [K16].
- **Tipik sayılar:** Atalanta 2020-21: maç başına 14 top kesme (Serie A birincisi), 15,9 müdahale (üçüncü), 15,3 faul (ikinci en çok) [K18]. Atalanta–Liverpool 2024: Liverpool'un yarı sahasındaki 50 savunma anının 37'si adam adama yüksek blokla; Liverpool pres kazanımı %69, Atalanta %50; Atalanta pres evrelerinin %10'unda dörtten fazla pres eylemi yaptı [K17]. Barcelona–Atalanta 2024-25 (2-2): ilk yarıda Barcelona'nın paslarının yalnız %8'i hücum üçte birinde (ikinci yarı %20); son üçte birde 32 pas (önceki iç saha maçında 97); uzun top 16 → 9 [K19].
- **Temsilciler:** Bielsa (Leeds 2018-22, Marsilya, Athletic), Gasperini (Atalanta 2016-25), Marsch, Rangnick'in bazı dönemleri; StatsBomb savunma ailelerinde "Bielsa müritleri" grubu (Marsilya, Celta, Rayo): yüksek sahiplik, çok yüksek pres, en yüksek merkezilik ve ileri pas [K3].
- **Panzehiri:** rotasyon ve düşerek sürükleme (G2.4).

### G1.10 Duran top ağırlıklı oyun (set-piece heavy — Brentford / Stoke / Arsenal-Jover)

- **Parametreler:** tempo düşük-orta, risk düşük, pres orta, hat orta-alçak, genişlik yüksek (korner ve taç kazanmak için kanat), direktlik yüksek, karşı pres orta, duran top **çok yüksek**, savunma bölgesel/karma, oyun kurma uzun/karma.
- **İlkeller:** korner ve serbest vuruş rutinleri (perdeleme/blok, ön direk, geri pas; *A–F ile eşle: D bölümü duran toplar*); uzun taç; ceza sahasına 20 m üstü taç; korner "kazanma" davranışı (ortayı rakip ayağına çarptırma); savunma duran topunda bölgesel + karma.
- **Kadro gereksinimi:** boy ve hava topu, iki iyi vurucu (sağ/sol ayak), uzun taç atan bir oyuncu, rutinleri ezberleyecek sabit kadro. Eksikse: korner sayısı aynı kalır ama xG düşer; takım açık oyunda da üretmediği için gol kaynağı kurur.
- **Tipik sayılar:** Stoke 2008-09: lig gollerinin dokuzu (38'in yaklaşık dörtte biri) Delap'ın taçlarından; sonraki sezonlarda 5 ve 4; saha kurallar elverdiğince daraltıldı [K22]. Arsenal: Jover'den önceki sezon 6 duran top golü ve %11 pay; ilk sezonunda %26; 2023-24'te penaltı hariç 22 duran top golü, lig birincisi (Everton 18, City 16, Liverpool 15) [K23]; 2023-24'te kornerden 16 gol, tek sezon PL rekoru [K21]; 2025-26 başında 16 golün 11'i (%69) duran toptan [K20]. Brentford 2024-25: 13 duran top golü, duran top xG'si 16,71 (ligde üçüncü) [K25]; Jover Brentford'dayken ilk 18 maçta 9 duran top golü; 2024-25'te Aralık sonuna kadar duran toptan yalnız 1 gol yediler [K29]. Lig geneli: 2025-26 başında maç başına 4,0 uzun taç (20 m+) ceza sahasına, 2014-15'ten beri herhangi bir sezonun iki katından fazla; kornerden gol payı %19 (45/241), PL rekoru [K20].
- **Temsilciler:** Pulis (Stoke 2008-11), Frank (Brentford 2018-25; Tottenham'da Danso ile uzun taç [K20]), Arteta + Jover (Arsenal 2021-), Dyche; duran top antrenörleri (G4.2).
- **Panzehiri:** hava topu üstünlüğü ve kaliteli bölgesel savunma — kanıt karışıktır (G2.5).

### G1.11 Parametre matrisi (özet; sözel değerler tahmin)

| Arketip | Tempo | Risk | Pres yük. | Hat | Genişlik | Direktlik | Karşı pres | Duran top | Şema | Kurma |
|---|---|---|---|---|---|---|---|---|---|---|
| Konumsal | D | O | Y | Y | Y | D | Y | O | bölgesel | kısa |
| Yüksek pres + dikey | Y | Y | ÇY | Y | O | O-Y | ÇY | O | bölgesel/adam yön. | karma |
| Geçiş/kontra | ÇY | Y | O | O | O | Y | D-O | O | bölgesel 4-4-2 | karma/uzun |
| Alçak blok | D | D | D | A | D | Y | D | Y | bölgesel | uzun |
| Direkt + ikinci top | Y | O | O | O-A | O | ÇY | Y (yerel) | Y | bölgesel | uzun |
| Kanat/orta | O | O | O | O | ÇY | O | O | Y | bölgesel | karma |
| İlişkisel | O-Y | Y | Y | Y | D (yığılma) | D | ÇY | D | yakınlık/adam | kısa |
| Pragmatik | O | D-O | O | O | O | O | O | O | bölgesel | karma |
| Adam adama agresif | Y | Y | ÇY | Y | Y | O | ÇY | O | adam adama | kısa/karma |
| Duran top ağırlıklı | D-O | D | O | O-A | Y | Y | O | ÇY | bölgesel/karma | uzun |

D düşük, O orta, Y yüksek, ÇY çok yüksek, A alçak. Kaynaklı sayılar yalnız arketip metinlerindedir; matristeki her hücre motor anahtarı olarak başlangıç değeridir ve 80 maçlık karşılaştırmayla ayarlanır (G7).

### G1.12 Türkiye'de görülen karşılıklar (yalnız esin; isimler oyuna girmez)

Taktik analiz kaynağı bulunamadığı için (arama bütçesi) buradaki tarz eşlemeleri **yaygın yorum**dur; sonuçlar Wikipedia sezon sayfalarındandır.

- **Yüksek tempolu hücum / kanat oyunu:** Galatasaray 1996-2000 dört üst üste şampiyonluk ve 2000 UEFA Kupası [K35]. Tarz eşlemesi: G1.2 + G1.6 karışımı (yorum).
- **Geçiş oyunu ve hızlı kanat:** Trabzonspor 2010-11: 82 puan, 69-23 averaj, ikinci (averajla) [K36]. Tarz eşlemesi: G1.3 (yorum).
- **Kontrol ve sabırlı pas oyunu:** Başakşehir 2016-19: ikinci, üçüncü, ikinci [K37]; aynı kadro temeliyle 2019-20 şampiyonluğu (69 puan, 65-34; o yıl en çok gol atan Trabzonspor 76) [K38]. Tarz eşlemesi: G1.1 ile G1.8 arası (yorum). Aynı hocanın Trabzonspor 2021-22 şampiyonluğu (81 puan) [K37] farklı kadro–tarz birleşimine örnektir.
- **Alçak blok + kontra ve direkt oyun:** Anadolu kulüplerinin büyük maç planı olarak yaygındır (yorum; kaynak bulunamadı).
- Oyunda bu örnekler yalnız "hangi arketip Türkiye liglerinde sık görülür" sorusuna esin verir: alt liglerde direkt oyun ve alçak blok sık, konumsal oyun seyrek (tahmin; G6'da lig düzeyine göre tarz dağılımı anahtarı).

---

## G2. Panzehir ilişkileri (kenarlar)

### G2.0 İlke: taş-kâğıt-makas değil, koşullu kenar

Hiçbir kaynak "tarz A tarz B'yi X oranla yener" biçiminde bir matris vermez; bulunan kanıtlar maç ve dönem örnekleridir. Bu yüzden kenar şöyle yazılır: **koşul → mekanizma → büyüklük (varsa) → kadro kalitesi farkını ne zaman aşar**. Motor için kenar, ilgili ilkellerin başarı olasılığına çarpan olarak girer; maç sonucuna doğrudan eklenmez (G6). Kalite farkı için ölçü: iki kadronun gizli yetenek ortalaması farkı (Δ). Aşağıdaki "Δ eşiği" değerleri **tahmin**dir ve 80 maçlık benzetimle kalibre edilir (G7).

### G2.1 Alçak blok ↔ konumsal oyun

- **Mekanizma:** konumsal takım sahipliği alır ama ceza sahası önü kapalıdır; şut uzaklığı artar, xG/şut düşer; tek top kaybı kontraya döner; duran top eşitleyicidir.
- **Kanıt:** Inter–Barcelona 2010 (sahiplik %13,6–%19 aralığı, Inter 10 kişi, tur Inter'in) [K26][K27]; Chelsea–Barcelona 2012 (iki maçta 46'ya 12 şut, 18'e 2 korner, tur Chelsea'nin; Chelsea'nin üç golü de uzatma dakikalarında) [K28]; Atlético 2013-14 (%46,8 sahiplik, 26 gol yedi, şampiyon) [K14][K15]. StatsBomb "nullifiers" ailesi (Atlético, Napoli…): merkezden oyun izni yok, maç başına 10'dan az şut izni, maç başına bir golün biraz üstü [K3].
- **Koşul:** blok erken gol yemezse. Erken gol yerse çıkmak zorunda kalır ve tarz çöker (Inter 2010'da Inter ilk maçı 3-1 kazanmıştı; rövanşta tek gol yetmedi).
- **Büyüklük:** maç bazında sahipliğin %73'e karşı tur kaybı [K28]; kenar sezonluk değil **tek maçlıktır** (varyans artar). Tahmin: Δ'nın bir "kademe"sini (ör. 3. ligle 2. lig arası kadro farkını) tek maçta kapatabilir, sezon boyunca kapatamaz.
- **Motor:** alçak blokta "ceza sahası önü işgali" ilkeli yüksekken konumsal takımın "çizgi arası alma" başarı olasılığı düşer; şut mesafesi artar; duran top ağırlığı iki yönde de yükselir.

### G2.2 Yüksek pres ↔ zayıf oyun kurma

- **Mekanizma:** kısa kurmaya ısrar eden ama baskı altında teknik yetersiz kadro, yüksek top kazanma verir; kazanımlar kaleye 40 m içinde başlar.
- **Kanıt:** Southampton 2024-25: ilk 7 maçta %57,4 sahiplik (ligde 5.), kale vuruşlarının kendi ceza sahasında bitme payında ligde 2., 7 maçta 1 puan [K10]; ilk üç maçta yenilen 5 golün 3'ü arkadan kurarken top kaybından [K39]; 16. haftada en altta, kümeye 9 puan uzakta, hoca gönderildi [K40]. Lig geneli: yüksek top kazanmalardan şut oranı %10,7 (Southampton) ile %21,3 (Forest) arasında değişir [K1] — aynı kazanım sayısı iki kat farklı tehdit üretir.
- **Koşul:** rakibin oyun kurma kalitesi (stoper + pivot + kaleci) pres yoğunluğunun altında kaldığında. Rakip kaliteliyse pres aşılır ve G2.3'e döner.
- **Büyüklük:** tek takım örneği; lig çapında büyüklük **bulunamadı**. Tahmin: kurma kalitesi pres kalitesinin bir kademe altında kaldığında maç başına +0,3–0,5 beklenen gol presleyene (G7'de ölçülür).
- **Motor:** "kurma kalitesi" kadro ilkel puanıdır (stoper topla, pivot dönüş, kaleci ayak); hoca ısrarı bu puan düşükken kısa kurmayı zorlarsa kayıp olasılığı artar; akıllı hoca (beceri puanı) karma kurmaya geçer.

### G2.3 Direkt oyun / uzun top ↔ yüksek hat

- **Mekanizma:** hat yüksekken arkadaki alan büyür; uzun top ve ara pas hızlı forvete işler; stoper hava topunu kazansa bile ikinci top yarı sahada düşer.
- **Kanıt:** Leicester 4-2 Manchester City (10 Aralık 2016): 5. dakikada 2-0, devrede 3-0; ilk gol uzun topla Slimani–Vardy; City'nin yüksek hattı Mahrez ve Vardy'nin hızıyla açıldı; Guardiola: "kontrada ve ikinci toplarda çok iyiler" [K41][K42]. Spielverlagerung: yüksek hatta "seçilmiş" uzun top koşucuya avans verir, kafayı kazanmak zorunda kalan savunmacının arkasındaki alan büyür [K30]. FIFA KDK 2025: yüksek prese karşı direkt oyun daha başarılı [K31].
- **Koşul:** uzun topu atacak zaman (zorlanmış uzun top en kötüsüdür [K30]), hedef adam ve arkaya koşan hız. Rakibin stoperi hızlıysa ve kaleci libero ise kenar küçülür.
- **Büyüklük:** maç bazında dört gol; sezon bazında Leicester 2015-16 %42 sahiplikle şampiyon [K12][K13]. Tahmin: kadro hızı rakibin stoper hızını geçiyorsa Δ bir kademeyi tek maçta sık, sezon boyunca seyrek kapatır.
- **Motor:** "uzun top + ikinci top" ve "arkaya koşu" ilkellerinin başarı olasılığı rakibin hat yüksekliğiyle artar; "zorlanmış uzun top" bayrağı pres altındaki pasörde isabeti düşürür.

### G2.4 Adam adama ↔ hareketli / rotasyonlu hücum

- **Mekanizma:** marker adamını takip ettiği için düşen forvet stoperi, içeri giren kanat beki, dönen orta saha boşluk açar; "fazla adam" sistemi ileri çıkan stoperi tutamaz; bire bir kaybı zinciri bozar.
- **Kanıt:** Swansea–Leeds 2018: Leeds orta sahaları adamlarına bağlıyken stoperlere yalnız Roofe çıkabildi, Swansea stoperleri 2'ye 1'de sürdü; McBurnie derin inince Ayling/Berardi takip etti, arkası açıldı [K43]. Coaches' Voice: bire bir kaybı en yakın oyuncuyu adamını bırakmaya zorlar; Bielsa'nın orta sahası adam adama rakiplere karşı döner [K16]. UEFA: Konaté De Ketelaere'yi bire birde geçip orta sahaya girince Atalanta'nın markerları adamlarını bırakmak zorunda kaldı [K17]; Raphinha düşerek Djimsiti'yi sürükledi, De Jong boşluğa girdi; "adam adamaya karşı anahtar adamından kopmaktır" [K19]. Roma–Inter: orta saha pivota çıkınca stoper zincirde bir üst halkaya sıçrar, arkada boşluk kalır [K44]. Leeds: ilk sezon parlak, sonra iki sezon küme mücadelesi ve 2023'te düşüş [K10].
- **Koşul:** hücum eden takımın rotasyon ve üçüncü adam ilkellerini oynayabilecek teknik kalitesi; adam adama takımın bire bir kazanma oranı.
- **Büyüklük:** maç içinde ölçülebilir (Barcelona ilk yarı %8 → ikinci yarı %20 son üçte bir pas payı [K19]). Tahmin: rotasyon kalitesi yüksek takıma karşı adam adama takımın yenilen gol beklentisi +0,4/maç; teknik zayıf takıma karşı ise adam adama kenarlıdır (uzun topa zorlar, Atalanta 14 kesme/maç [K18]).
- **Motor:** "rotasyon" ve "düşerek sürükleme" ilkelleri adam adama şemaya karşı boşluk üretir; bire bir kayıp bayrağı adam adama şemada komşu markerın görevini bozar (mevcut markaj kalıcılığı ayarları `markajKalici`, `kapatKalici` ile uyumlu).

### G2.5 Duran top ağırlığı ↔ küçük / bölgesel savunma

- **Mekanizma:** boy ve hava topu üstünlüğü ile perdeleme (blocking) rutinleri, savunma şemasından bağımsız üretir; kanıt şema değil uygulama kalitesine işaret eder.
- **Kanıt:** PL 436 korner: %90 adam adama; bölgesel savunanlar daha az gol ve şut yedi ama fark istatistiksel olarak anlamlı değil [K24]. 2018 Dünya Kupası: bölgesel savunmada yenilen gol oranı %6,0, karma savunmada %3,7 [K45]. FIFA teknik grubu (plaj futbolu 2024 ve KDK 2025): hiçbir yapı tek başına üstün değil; bireysel roller belirleyici [K46]. Arsenal'ın perdeleme rutinleri ve rakibin olası tepkilerini hesaplayan planlama [K23]. Stoke'un saha daraltması ve "ceza sahasında kargaşa" yaklaşımı [K22].
- **Koşul:** boy farkı, iki vurucu kalitesi, rutin ezberi için kadro sabitliği.
- **Büyüklük:** duran top payı takım bazında %11 → %26 (Arsenal) [K23]; Stoke gollerinin dörtte biri taçtan [K22]. Küçük kulüp için en ucuz kenar: The Analyst duran topların Brentford gibi kulüplerin zenginlerle rekabet aracı olduğunu yazar [K20].
- **Motor:** mevcut duran top motoru (D bölümü; `d-duran` kapısı) üzerine "duran top antrenörü puanı × rutin bilgisi" çarpanı; savunmada "hava topu toplamı" ve "perdelemeye direnç" puanı; bölgesel/adam adama seçimi sonuç farkı değil **görünüm** farkı olarak modellenir (kanıt karışık).

### G2.6 Karşı pres ↔ uzun temizleme

- **Mekanizma:** karşı pres top kaybının çevresinde yoğunlaşır; rakip ilk dokunuşta uzun temizlerse pres boşa çıkar ve topun düştüğü yerde sayı üstünlüğü rakibe geçer; ama kötü temizleme ikinci topu karşı presleyene verir.
- **Kanıt:** Spielverlagerung: kompakt alanda uzun toplar ardışık düellolar üretir, ikinci top üstünde organize karşı pres yaygındır; karşı pres tetikleyicileri: seken toplar, kaleye sırtı dönük alan oyuncu, kenarda top alan bek [K30]. Benfica–Bayern: prese davet, uzun top, ilk ve ikinci top kazanımı, sonra presin arkasında sayı eksikliği olan geniş alana oyun [K31]. Liverpool 2025-26: ligde en çok uzun pasa maruz kalan takım (571; sorun ikinci toplarda) — taraftar sitesi, zayıf kaynak [K47].
- **Koşul:** temizleyen takımın ikinci top yapısı (katmanlı 2-3/3-2) [K30]; karşı presleyen takımın dinlenme savunması.
- **Büyüklük:** **bulunamadı**. Tahmin: ikinci topu kazanan tarafa göre işaret değiştirir; kenar yalnız ikinci top yapısı olan direkt takıma aittir.
- **Motor:** "uzun temizleme" seçeneği pres şiddeti yüksekken değer kazanır; ikinci top kazanma olasılığı "katmanlı yapı" ilkelinden ve hava topu toplamından gelir; karşı pres tetikleyicileri (seken top, sırtı dönük, kenar) mevcut `kovala*` ve `pres*` ayarlarına girdidir.

### G2.7 Diğer çiftler (kısa)

- **İlişkisel/yığılma ↔ bölgesel kompakt savunma + hızlı taraf değiştirme:** yığılma bırakıldığında uzak kanat boştur; kanıt: City–Fluminense 4-0 [K33] (tek maç; mekanizma tahmini).
- **Konumsal ↔ adam adama:** konumsal takımın sabit konumları markaja kolay hedef verir; çözüm rotasyon ve düşme (Barcelona ikinci yarı [K19]). Kenar, kalite farkı küçükken adam adama tarafta; büyükken konumsal tarafta (tahmin).
- **Kanat/orta ↔ alçak blok:** blok ceza sahasını kalabalık tutar; orta kalitesi düşükse kenar bloktadır; kaliteliyse korner ve duran top üretir (G2.5'e bağlanır).
- **Geçiş/kontra ↔ geçiş/kontra:** iki tarafın da riski yüksek; açık maç, varyans en yüksek (tahmin).
- **Pragmatik ↔ her şey:** kenarsız; sonuç kadro kalitesi ve hoca becerisiyle belirlenir (tasarım kararı; G6).

### G2.8 Kenar matrisi (başlangıç değerleri; tamamı tahmin)

Satır: bizim tarz; sütun: rakibin tarzı. Değer: ilkel çarpanları toplandığında beklenen gol farkına eşdeğer kenar (maç başına, kadro kalitesi eşitken). Pozitif = satırın lehine.

| ↓ biz / rakip → | Konumsal | Yük. pres | Kontra | Alçak blok | Direkt | Kanat | İlişkisel | Pragmatik | Adam adama | Duran top |
|---|---|---|---|---|---|---|---|---|---|---|
| Konumsal | 0 | 0 | +0,1 | −0,2 | +0,1 | +0,1 | 0 | 0 | +0,2* | 0 |
| Yüksek pres | +0,2** | 0 | −0,1 | 0 | −0,3 | 0 | +0,1 | 0 | 0 | −0,1 |
| Kontra | +0,2 | +0,3 | 0 | −0,2 | 0 | 0 | +0,2 | 0 | +0,1 | 0 |
| Alçak blok | +0,2 | 0 | +0,1 | 0 | −0,1 | +0,1 | +0,2 | 0 | +0,1 | −0,2 |
| Direkt | 0 | +0,3 | 0 | 0 | 0 | 0 | +0,1 | 0 | +0,2 | 0 |
| Kanat | 0 | 0 | 0 | −0,1 | 0 | 0 | 0 | 0 | +0,1 | 0 |
| İlişkisel | 0 | 0 | −0,2 | −0,2 | −0,1 | 0 | 0 | 0 | +0,2 | 0 |
| Pragmatik | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Adam adama | −0,2* | 0 | −0,1 | 0 | −0,2 | 0 | −0,2 | 0 | 0 | 0 |
| Duran top | 0 | +0,1 | 0 | +0,2 | 0 | 0 | 0 | 0 | 0 | 0 |

**Ölçülen (B, 2026-10-22; `araclar/tarz-kenar.js konumsal direkt 80`):** konumsal → direkt +0,34 gol/maç [%95 0,07–0,62] (Z7: +0,43); B'nin hedefi +0,2–0,3, fark ölçü belirsizliğinin altında olduğu için tablo değiştirilmedi. Matrisin öbür hücreleri tahmin.

\* işaret kalite farkına göre döner (G2.7). \*\* yalnız rakibin kurma kalitesi düşükse (G2.2). Matris simetrik değildir; çapraz 0'dır. Bu değerler motorda doğrudan gol eklemez, ilgili ilkellerin olasılık çarpanlarına dağıtılır ve 80 maçlık benzetimle ölçülüp düzeltilir (G7). Kaynaklı tek matris olmadığı için ilk sürüm "küçük ve sönük" tutulur; kullanıcı gözlemiyle büyütülür.

### G2.9 Kadro kalitesi farkını ne zaman aşar

- Kanıtlar tek maç ve tek sezon örnekleridir: Leicester 2015-16 (sezon) [K12][K13], Inter 2010 ve Chelsea 2012 (eleme turu) [K26][K28], Benfica–Bayern (tek maç) [K31]. Sezon boyu bütçeyi yenen örnek seyrek; Leicester'ın StatsBomb'daki yıl-yıl korelasyonları kontra xG'sinin kararsız (0,55), açık oyun xG'sinin kararlı (0,91) olduğunu gösterir [K13] — yani kontra kenarı gürültülüdür, sezon içinde geri döner.
- Kural (tahmin, motor anahtarı): doğru panzehir, bir kademelik Δ'yı tek maçta %35–45 galibiyet/beraberlik ihtimaline çıkarabilir; iki kademeyi çıkaramaz. Sezon toplamında panzehir, puan beklentisini en çok 3–5 puan oynatır (Bundesliga'da hoca kalitesinin 80.–20. yüzdelik farkı 0,30 puan/maç = sezonda ~10 puan [K48]; panzehir bunun yarısından az olmalıdır, çünkü rakip de uyum sağlar).
- Kadro–tarz uyumu bu kenardan önce gelir: tarz kadroya uymuyorsa kenar sıfırlanır ve eksi olur (G3.3).

---

## G3. Hoca değişikliği ve kadro uyumu

### G3.1 "Yeni hoca etkisi" (new manager bounce) gerçek mi?

- **Sistematik derleme (24 çalışma, 94 başlıktan; 22'si Avrupa üst ligleri):** sezon içi hoca değişikliği çoğu kez kısa bir iyileşme getirir, ama tutarsızdır ve genelde söner; görevden alma "başarıyı garanti etmez" [K49]. Tek tek bulgular [K49]:
  - Heuer ve ark. (Bundesliga, 14.018 maç): sezon içi görevden almanın sonraki performansa etkisi yok denecek kadar az; fiziksel değişimler geçici.
  - Besters ve ark. (Premier Lig, 84 değişiklik): ortalamada iyileşme yok; bazıları yaradı, bazıları zarar verdi.
  - Flores ve ark. (Arjantin, 420 değişiklik): net etki negatif; evde daha az belirgin.
  - Gómez ve ark. (beş büyük lig, 411 değişiklik): kısa vadede puan anlamlı arttı, **10 maçtan sonra söndü**; hoca deneyimine ya da eski yıldız olmasına bağlı değil.
  - Lago-Peñas (İspanya): kısa kazanım, sonra kademeli kötüleşme, uzun vadede etki yok.
  - Radzimiński ve ark.: koşu performansındaki kısa kazanım **yaklaşık 5 maçta** söndü. Zart ve Güllich: değişiklikten sonraki **ilk maçta** anlık güçlü iyileşme.
- **Erasmus (van Ours, 2017-18–2024-25, beş büyük lig):** görevden almalar çoğunlukla kötü sonuçları izledi, altta yatan performans (xG, bahis temelli beklenen puan) güçlü olsa bile; değişiklikten sonraki iyileşme ortalamaya dönüştür (regression to the mean) — düşük performanslı takımlar hoca değişsin değişmesin toparlandı; hoca değiştiren kulüpler sezonu değiştirdikleri gündeki kadar zayıf kümülatif performansla bitirdi [K50].
- **Soccernomics ölçüsü:** ortalama kulüp maç başına ~1,3 puan alır, hocalar ~1,0 puanda gönderilir; sonraki yükseliş büyük ölçüde dipten dönüştür [K51]. Ter Weel (Eredivisie 1986–2004): düşüş–toparlanma deseni, hoca değişmeyen takımlarda da aynı [K51].
- **Ekstraklasa (Stachniak ve Wolak):** değişiklikten sonra hafif iyileşme, ama krizde hocasını tutan takımlar da benzer iyileşti [K52]. **Eredivisie 2000–2023 (lisans tezi):** genelde etki yok; "isabetli" (wise) görevden almalarda nedensel etki işareti [K53]. **PL ve Ligue 1 (Economies 2020):** görevden alma beklenen performansın altına düşmeyi izler; yalnız önceden düşük performans varsa işe yarayabilir [K54].
- **Fiziksel yan:** sezon ortası hoca değişikliği sonrası yüksek şiddetli koşu, sprint ve yavaşlama sayısı bazı çalışmalarda düştü; etkiler geçici [K49][K55].

**Motor için sonuç:** "yeni hoca etkisi" ayrı bir bonus olarak modellenmez. Model: (a) takımın kısa dönem form bileşeni ortalamaya döner (hoca değişsin değişmesin); (b) ilk 1–5 maçta küçük moral/efor artışı (tahmin: ilkel efor çarpanı +%3–5, 5 maçta sönümlenir); (c) 10 maç sonra yalnız hoca beceri puanı ve kadro–tarz uyumu kalır. Oyuncu "hoca değiştirince düzelir" yanılgısına düşmemeli; düzelme çoğu kez zaten gelecektir (OYUN_TASARIMI'ndaki "adil belirsizlik" ilkesiyle uyumlu).

### G3.2 Tarz değişiminin oturma süresi

- Nicel çalışma: Hudl Performance Insights 2025'te Sean Hooker'ın "The Manager Bounce: From Immediate Shock to Tactical Identity" başlıklı araştırması tam bu soruyu (taktik kimliğin ne zaman ölçülebilir olduğu) ele alır; PDF metni bu oturumda çıkarılamadı, bulgular **okunamadı** [K56] (G8).
- Dolaylı kanıtlar: Gómez'in 10 maçlık kısa dönem penceresi [K49]; Meulensteen'in Amorim için "tarzın yerleşmesi ~18 ay" tahmini (görüş, ölçüm değil) [K57]; De Boer'in Palace'ta 4 lig maçı / 77 gün sonra gönderilmesi ve "tek transfer penceresi yetmez" yorumu [K58]. StatsBomb'un Leeds örneği: 2020-21 ile 2021-22 arasındaki benzerlik en çok topsuz oyundaydı; toplu oyun daha çok değişti ve yazar bunu hoca değişiklikleri ve sakatlıklarla ilişkilendirir [K2] — yani **topsuz kimlik daha yapışkan, toplu kimlik daha oynak** (tek vaka).
- Bundesliga 1993-94–2013-14 (6.426 maç, 103 hoca, 29 takım): hocalar takımın oyun tarzını (ofansiflik: puan başına atılan gol) anlamlı biçimde etkiler; performans etkisi ile ofansif tarz etkisi arasında **negatif** korelasyon var (başarılı hocalar daha az ofansif tarz) [K48].

**Motor için sonuç (tahmin, ayar anahtarı):** yeni tarzın ilkel ağırlıkları eskiyle harmanlanır: topsuz ilkeller (blok, pres yüksekliği) 6–10 maçta, toplu ilkeller (kurma, rotasyon, üçüncü adam) 15–25 maçta, duran top rutinleri 4–8 antrenman haftasında hedefe yaklaşır; hız hoca becerisi, ekip (analist) ve kadro uyumuyla ölçeklenir. Sezon arası + ön hazırlık dönemi oturma süresini yarıya indirir.

### G3.3 Kadro–tarz uyumsuzluğu örnekleri

- **Yükselen takımın tarzı üst ligde tutmadı:**
  - Burnley (Kompany): Championship 2022-23 şampiyonu 101 puan [K59]; %64,6 sahiplik, 744 adet 10+ paslı dizi [K11]; Premier Lig 2023-24: ilk 11 maçta 4 puan, ligin en az gol atanı [K59]; sezon sonu 19., 24 puan, 41-78 [K60]. Önceden uyarılmıştı: "daha kaliteli takımlara karşı aynı şekilde oyunu dayatmak zor olacak" [K11].
  - Southampton (Martin): Championship'te görülmüş en uç sahiplik oyunu [K10]; Premier Lig'de 7 maçta 1 puan [K10], 16 maçta kümeye 9 puan uzak, hoca gönderildi [K40].
  - Leeds (Bielsa): ilk sezon parlak (2020-21 %57,8 sahiplik, yükselenler arasında rekor), iki sezon küme mücadelesi, 2023'te düşüş [K10].
  - Karşı örnek: The Analyst'e göre 2003-04'ten beri yükselen takımlar arasında ilk sezonunda **en yüksek sahipliğe sahip altı takımın hepsi kaldı**, 7.–12. sıradakilerin hepsi düştü; yazar %49,8'e karşı %50 farkını belirleyici bulmaz ve "sihirli formül yok" der; Brighton'ın kademeli geçişi (ilk dört sezon en iyi 15., sonra 6.) örnek gösterilir [K10].
- **Bir tarz için kurulmuş kadroyu devralan hoca:** Burnley'de Dyche'ın direkt kadrosu → Kompany'nin sahiplik oyunu (Championship'te işledi, kadro yenilenmişti) [K11]; Ancelotti'nin tam tersi yaklaşımı: sistemi kadroya uydurmak (Zidane için 3-4-1-2, Pirlo için elmas) [K34].
- **Oyun kuralı olarak:** kadro–tarz uyumu iki yönlü puandır: (i) tarzın gerektirdiği roller kadroda var mı (G1'deki "kadro gereksinimi" satırları), (ii) rakip kalitesi arttıkça gereksinim eşiği yükselir (3. ligde yeten stoper 2. ligde pres altında yetmez). Bu, kullanıcının "3. ligde oturmuş takım 2. ligde tutmayabilir" isteğinin doğrudan karşılığıdır: aynı kadro, aynı tarz, daha yüksek eşik → uyum puanı düşer → tarz ilkelleri daha sık başarısız olur.

### G3.4 Israr / esneklik ekseni

- **Israrcı uç (Bielsa, Martin, Kompany):** tarz değişmez; kazanımı kimlik ve uzun vadeli oturma, bedeli uyumsuz dönemde çöküş (yukarıdaki örnekler). Bielsa'nın orta sahası 27. dakikada yapısal değişiklikle (Phillips → Baker, 4'e 2 orta saha üstünlüğü) maçı toparlamıştı [K43] — ısrarcı hocalar da maç içinde yapı değiştirir; değişmeyen **ilke**dir, **şekil** değil.
- **Esnek uç (Ancelotti):** şekil kadroya ve rakibe göre; City'ye karşı alçak blok, forvetsiz 4-3-1-2 [K34]. Eleştiri: kimliksizlik [K34].
- **Maç içi değişiklik kanıtı:** Myers'ın kuralı (2009-10 dört büyük lig + MLS + Dünya Kupası): geride olan takım ilk değişikliği 58., ikinciyi 73., üçüncüyü 79. dakikadan önce yaparsa en az bir gol bulma oranı ~%36, uymayanlarda ~%18,5 [K61] (bir 2025 çalışması aynı kuralı %42,27'ye karşı %20,52 diye aktarır; iki kaynak uyuşmuyor) [K62]. Swartz ve ark. bu kuralı sorgular: dengeli takımlarda geride olanın ikinci yarıda gol avantajı var, ama değişikliğin özel olarak yaradığı bir dakika bulunamadı [K63]. Euro 2024 (51 maç, 466 değişiklik): en etkili pencere 60.–85. dakika, en etkisiz 45.–60. [K62].
- **Sezon içi plan değiştirme:** Ancelotti'nin Real Madrid'de 4-3-3'ten kontraya kayması [K34]; Ulsan'ın devre arasında kısa kurmadan uzun oyuna geçişi [K31].

**Motor için sonuç:** hocanın **ısrar** parametresi (0–1) iki yerde çalışır: (a) sezon içinde kadro uyum puanı düşükken tarzı değiştirme olasılığı (ısrarcı hoca değiştirmez, uyumsuzluk bedelini öder; esnek hoca ikinci plana geçer, kimlik oturma süresi uzar); (b) maç içinde skor/dakika durumuna göre plan değiştirme (geride ve 60+ dakikada değişiklik ve risk artışı; öndeyken tempo düşürme). Her hocanın **birincil ve ikincil planı** vardır; ısrar yüksekse ikincil plana geçiş eşiği yüksektir.

---

## G4. Hoca becerisi ve ekip

### G4.1 Hocanın etkisinin büyüklüğü

- Bundesliga 1993-94–2013-14 (6.426 maç; takım ve hoca sabit etkileri; sık hoca hareketinden yararlanır): 80. yüzdelikteki hoca 20. yüzdeliktekine göre maç başına **0,30 puan** fazla kazandırır, bu ortalama puanın %18'i; (IZA özetinde 75.–25. yüzdelik için 0,25 puan) [K48][K64]. Klopp medyan hocaya göre maç başına +0,46 puan (tek istatistiksel anlamlı birey) [K48]; IZA özetinde Klopp'lu takım sezonda ~15,6 puan fazla, Möhlmann'lı ~11,2 eksik [K65]. Tahmin edilen hoca yetenekleri gelecekteki performansı anlamlı biçimde öngörür [K48][K64]. Eski profesyonel futbolcu hocaların takımları ortalamada daha kötü performans gösterir [K48].
- **Motor için:** gizli hoca beceri puanı, lig puan beklentisini maç başına en çok ±0,15 puan civarı oynatmalı (80.–20. yüzdelik farkının yarısı iki yöne); bunun kaynağı doğrudan gol eklemek değil, (i) tarz–kadro uyumunun hızı, (ii) ilkel seçiminin bağlama uygunluğu (doğru anda doğru plan), (iii) maç içi plan değişikliğinin zamanlaması, (iv) ekip katkısıdır.

### G4.2 Duran top antrenörü (set-piece coach)

- Arsenal (Jover, 2021-): önceki sezon 6 duran top golü, %11 pay → ilk sezon %26; 2023-24'te 22 duran top golü, lig birincisi; aynı sezon yenilen duran top golü 6 (yalnız City daha az, 2) [K23]; 2023-24'te kornerden 16 gol, PL tek sezon rekoru [K21]. Jover, Montpellier'de analist, Hırvatistan ve Brentford'da duran top uzmanı, City'de Guardiola yanında iki sezon (ilk sezonunda City en çok duran top golü atan, en az ikinci yiyen takım) [K23]. Yöntem: rakibin olası tepkilerini hesaba katan ayrıntılı planlama, markerları perdeleme, kaliteli vuruş [K23].
- Brentford: Jover döneminde ilk 18 maçta 9 duran top golü [K29]; 2024-25'te 13 gol, 16,71 duran top xG (ligde 3.) [K25]; duran top antrenörü Keith Andrews 2025'te teknik direktör yapıldı [K25] — kulüpte duran top işinin ağırlığının göstergesi.
- Stoke (Pulis–Delap 2008-09): 38 lig golünün 9'u taçtan; sonraki yıllarda 5 ve 4 (rakipler uyum sağladı) [K22].
- **Motor için:** duran top antrenörü puanı, hücum duran top xG'sini ve savunma duran topunda yenilen golü ölçekler; etkinin **söndüğü** (Stoke 9 → 5 → 4) modellenir: rakipler aynı rutini gördükçe başarı düşer; yeni rutin öğrenimi antrenman haftası ister.

### G4.3 Taç antrenörü (throw-in coach)

- Grønnemark'ın anlatımıyla Liverpool'un taçta top tutma oranı ilk sezonunda %45,4'ten %68,4'e çıktı, baskı altındaki taçta ligde 18.'den 1.'e; maçta 40–60 taç olur; üç tür: uzun, hızlı, akıllı taç [K66]. The Analyst'in verisi: Liverpool'un taçta top kaybetme payı 2017-18'de %15 (ligde 6. en iyi) → 2020-21'de %8,5; lig geneli 2017-18'de %20'ye yakın, 2020-21'de %16'nın biraz altı; en düşük City %6,9; yazar sahiplik baskın takımların taç oranlarının zaten yüksek olduğunu, iyileşmenin yalnız antrenöre bağlanamayacağını not eder [K67]. Midtjylland %70,2 ile Avrupa birincisi gösterilmişti [K68] (ikinci el aktarım).
- **Motor için:** taç, mevcut `d-duran` kapısının taç hücresiyle ölçülür; antrenör puanı taçta top tutma olasılığını %45 → %68 aralığında ölçekler (tahmin: antrenörsüz alt sınır %45–50, tam etkili %65–70).

### G4.4 Analist, kaleci antrenörü, kondisyoner — kanıt durumu

- **Analist:** rakip tarzını okuma ve duran top planı analistin işidir (Jover analist kökenli [K23]); doğrudan "analist = X puan" ölçümü **bulunamadı**. Motorda analist puanı: rakip tarzının doğru teşhis olasılığı ve maç öncesi planın isabetini ölçekler (G5, G6).
- **Kaleci antrenörü:** etki büyüklüğü için kaynak **bulunamadı**. Motorda kaleci ilkelleri (`js/mac-kaleci.js`: tutma olasılığı, planlı çelme, dağıtım) üzerinden küçük çarpan; penaltı ve duran topta dağıtım kalitesi.
- **Kondisyoner:** hoca değişikliği çalışmaları koşu performansının değiştiğini ve geçici olduğunu gösterir [K49][K55]; kondisyoner puanı yorgunluk eğrisini (T18'deki `yorgun*` ayarları) ve sakatlık sıklığını ölçekler (tahmin; büyüklük için kaynak **bulunamadı**).
- **Ekip toplam katkısı (tahmin):** hocanın beceri puanının en çok %30'u kadar (ör. hoca 0,6 ise ekip ±0,18); duran top ve taç antrenörü en ölçülebilir kalemlerdir ve ayrı tutulur.

---

## G5. Taktik savaşın görünürlüğü

### G5.1 Locadan okunabilen işaretler

Başkan maçı locadan, bakış topta izler (OYUN_TASARIMI §11). Tarz, topu izleyen bakışın çevresinde bile şu işaretlerle okunur:

| İşaret | Ne söyler | Veri karşılığı |
|---|---|---|
| Kale vuruşunda stoperlerin ceza sahası köşelerine açılması, kalecinin kısa oynaması | kısa kurma, konumsal/ilişkisel | kale vuruşunun kendi ceza sahasında bitme payı [K10] |
| Kalecinin uzun vurması ve orta sahanın ikinci topa yığılması | direkt oyun | uzun pas payı [K7][K8] |
| Rakip stoper topu aldığında forvetin hemen çıkıp çıkmaması; çıkışın hangi çizgide başladığı | pres yüksekliği | yüksek top kazanma sayısı [K1]; PPDA |
| Savunma hattının orta çizgiye yakın durması ve kalecinin öne çıkması | yüksek hat | başlangıç mesafesi [K1] |
| Her rakibin yanında bir adam, forvetin stopere kadar takip etmesi | adam adama şema | Atalanta: 50 savunma anının 37'si adam adama [K17] |
| Topun kanatta sık olması, beklerin yukarıda olması, orta sayısı | kanat/orta ağırlığı | merkezilik [K3] |
| Kornerde ceza sahasına 7–8 adam, uzun taç için hazırlık, stoperin taça gelmesi | duran top ağırlığı | duran top golü payı [K20] |
| Top kaybından sonra ilk 3 saniyede kaç oyuncunun topa koştuğu | karşı pres eğilimi | StatsBomb pressure olayları [K2] |
| Topu kazandıktan sonra ilk pasın yönü (ileri/geri) | geçiş/kontra vs kontrol | hızlı sahiplik payı (>5 m/sn) [K13] |
| Öndeyken topu arkada çevirme, tempo düşürme | kontrol/pragmatik; macDurumu | dizi süresi [K1] |

Motor bu işaretlerin hepsini zaten ya üretiyor ya ölçebiliyor (`a-akis`, `h-hareket`, `y-yari`, görev tablosu). Görünürlük işi, (a) bu işaretleri rakip tarzının parametrelerinden türetmek, (b) maç telefonundaki/maç sonrası özetteki "rakip bugün ne yaptı" satırını bu ölçülerden yazmaktır (ekran işi, motor "tamam" sonrası).

### G5.2 Oyun motorlarında tarz modellemesi — genel ilkeler

Bu oturumda oyun motorlarında tarz modellemesi üzerine akademik ya da sektörel kaynak taranamadı (arama bütçesi; G8). Başka oyunların mekanikleri kopyalanmaz; aşağıdakiler bu projenin mimarisinden ve G1–G4 kanıtlarından türeyen ilkelerdir:

1. **Tarz bir etiket değil, ilkel ağırlık vektörüdür** (StatsBomb ve DEC çalışmalarının dört evre mantığı [K2][K5]): toplu, topsuz, pozitif geçiş, negatif geçiş için ayrı ağırlıklar.
2. **Tarz niyet üretir, sonuç üretmez:** ağırlıklar ilkel **seçim sıklığını** değiştirir; başarı olasılığı oyuncu kabiliyeti, bağlam ve rakip şemasından gelir (`js/mac-profil.js` kapısı ile uyumlu).
3. **Kenar, ilkel düzeyinde girer:** G2'deki panzehirler ilgili ilkellerin başarı olasılığına çarpandır; maç sonucuna doğrudan eklenmez; böylece zayıf kadro doğru tarzla "fırsat" üretir, "gol" garantilemez.
4. **Uyum eksikliği görünür başarısızlık üretir:** kısa kurmada top kaybı, uzun topta ikinci top kaybı, yüksek hatta arkaya top — oyuncu locadan "neden olmuyor"u görmeli.
5. **Israr parametresi ve ikincil plan:** her hocada vardır; maç durumu ve kadro uyumuyla tetiklenir (G3.4).
6. **Sönümlenme:** duran top rutini, pres tuzağı gibi "sürpriz" kenarları rakipler gördükçe küçülür (Stoke 9 → 5 → 4 [K22]); lig içinde tekrar sayısıyla azalan çarpan.
7. **Tekrarlanabilirlik:** bütün tarz kararları tohumlu rastlantıdan gelir (`ad-denetimi.js` kuralı); ikiz motor (`mac-izleme.js`) aynı tarz kararlarını üretmelidir.

---

## G6. Motor için notlar

### G6.1 Veri modeli (öneri)

```
Hoca {
  beceri: 0..1            // gizli; G4.1 ölçeğinde puan etkisi ±0,15/maç
  israr: 0..1             // G3.4
  tarzBirincil: TarzId    // G1 arketiplerinden biri ya da karışım ağırlıkları
  tarzIkincil: TarzId
  ekip: { duranTop, tac, analist, kaleci, kondisyon: 0..1 }
}
Tarz {
  eksen: { tempo, risk, presYuk, hat, genislik, direktlik, karsiPres, duranTop, sema, kurma } // 0..1
  ilkelAgirlik: { toplu: {...}, topsuz: {...}, pozGecis: {...}, negGecis: {...} }           // ilkel adı → ağırlık
  kadroGereksinim: [ { rol, esikLigeGore } ]                                                // G1 "kadro gereksinimi"
}
TakımPlanı (maç başı) = harman(tarzBirincil, tarzIkincil, israr, macDurumu, kadroUyum, rakipTarzOkuma)
```

### G6.2 Tarz → ilkel ağırlıkları → takım planı

- Her arketip için G1'deki "tercih ettiği ilkeller" listesi başlangıç ağırlıklarıdır (ör. konumsal: üçüncü adam 0,8, yükle–yalıt 0,7, uzun top + ikinci top 0,1; direkt: uzun top + ikinci top 0,9, üçüncü adam 0,2). Ağırlık, mevcut karar katmanında (`js/mac-karar.js`, `niyetDeger`) seçeneğin değerine çarpan olarak girer; seçenek kalitesi sıfırsa ağırlık onu seçtirmez (uyumsuzluk görünür olur).
- **Kadro uyumu** `uyum = Π min(1, kadroPuan(rol) / esik(lig))`: 1'in altındaysa tarz ilkellerinin başarı olasılığı düşer, hoca ısrarı düşükse ikincil plana geçiş olasılığı artar.
- **Israr:** sezon içinde `uyum < u0` iken plan değiştirme olasılığı `(1 − israr) × k`; maç içinde geride/öndeyken plan değişikliği eşiği `israr`'la yükselir. Değişiklik zamanı Euro 2024 ve Myers verisiyle uyumlu: 58–79 arası ilk değişiklikler [K61][K62].
- **Hoca değişince başka şey denenir:** yeni hocanın tarzı harmanla devreye girer (G3.2 süreleri); topsuz ilkeller hızlı, toplu ilkeller yavaş yaklaşır; "yeni hoca etkisi" yalnız ortalamaya dönüş + 1–5 maçlık küçük efor çarpanıdır (G3.1).
- **Lig düzeyine göre tarz dağılımı:** alt liglerde direkt/alçak blok/duran top arketipleri sık, konumsal/ilişkisel seyrek (tahmin; kaynak bulunamadı); yukarı çıktıkça rakip tarzları çeşitlenir ve eşikler yükselir (3. lig → 2. lig uyumsuzluğunun motor kaynağı budur).

### G6.3 Rakip tarzını okuma

- **Maç öncesi:** analist puanına göre rakibin tarz vektörü gürültülü tahminle verilir (`okuma = gerçek + gürültü × (1 − analist)`); hoca becerisi bu okumayla ikincil plan seçer (panzehir arayışı). Düşük analist + düşük hoca becerisi: rakip ne olursa olsun birincil plan.
- **Maç içi:** ilk 15–20 dakikada görünür işaretler (G5.1) birikir; hoca becerisine göre okuma güncellenir; plan değişikliği ısrar eşiğini geçerse olur. Böylece "zayıf ama doğru tarzlı" rakip bizi yenebilir (G2.9 sınırları içinde) ve iyi hoca bunu maç içinde kısmen onarabilir.
- **Başkanın gördüğü:** okuma sonuçları oyuncuya puan olarak gösterilmez (yetenek puanı gizli kuralı); hoca sohbetinde ve maç özetinde dilsel olarak gelir ("bugün bizi uzun toplarla açtılar").

### G6.4 Uygulama sırası (öneri; YOL_HARITASI kararı kullanıcınındır)

1. Tarz vektörü ve ilkel ağırlık çarpanı (yalnız iki arketiple: konumsal ve direkt + ikinci top) → 80 maç `--karsilastir`, tarzların görünür olduğunun ölçümü (G7.1).
2. Kadro uyumu ve lig eşiği → 3. lig / 2. lig kadrosuyla aynı tarzın karşılaştırması.
3. Israr, ikincil plan, maç içi geçiş → `y-yari` satırları ve değişiklik zamanı dağılımı.
4. Kenar çarpanları (G2.8) küçük değerlerle → panzehir kenarı ölçümü (G7.2).
5. Ekip puanları (duran top ve taç önce; kanıtı en güçlü olanlar).
6. Rakip okuma ve görünürlük metinleri (ekran işi; motor "tamam" sonrası).

---

## G7. Ölçüler

### G7.1 Tarz sahada görünür mü?

- **Tarz ayrımı testi:** aynı iki kadro, her arketip çiftiyle 80'er maç; her maçtan şu ölçüler çıkar: sahiplik, direkt hız (m/sn), dizi başına pas, 10+ paslı dizi sayısı, başlangıç mesafesi, yüksek top kazanma sayısı ve şuta çevirme oranı, uzun pas payı, orta sayısı, korner sayısı, duran toptan gol payı, karşı pres eylemi (top kaybından 5 sn içinde baskı), hat yüksekliği (savunma hattının kaleye ortalama uzaklığı, toplu/topsuz ayrı). Kabul: iki arketip arasındaki fark, aynı arketipin iki tohum kümesi arasındaki farkın en az 3 katı (etki büyüklüğü d ≥ 0,8; tahmin).
- **Gerçeklik aralığı:** ölçüler G1'deki kaynaklı değerlerle aynı mertebede olmalı: sahiplik %40–%65 bandı [K1][K12]; direkt hız 1,4–2,1 m/sn [K1]; uzun pas payı %10–%20 [K8]; duran top gol payı %20–%30 [K20][K21]; kornerden gol payı %10–%19 [K20]; yüksek top kazanmadan şut %10–%21 [K1]. 20 dakikalık maç ölçeğinde (`macSuresiDk`) oranlar korunur, sayılar ölçeklenir.
- **Kümeleme sağlaması:** 10 arketip × 80 maçın ölçü vektörleri k-ortalama ile kümelenir; doğru arketipe düşme oranı ≥ %80 (StatsBomb bölünmüş-takım testinin ~%90'ı [K2] üst sınırdır; tahmin).
- **Görünürlük (başkan gözü):** G5.1 işaretlerinin her biri için maç başına sayım: kale vuruşunda kısa/uzun oranı, forvetin pres başlangıç çizgisi, adam adama takip olayları, kornerde ceza sahasındaki hücumcu sayısı. Bunlar `a-akis` ve görev tablosuna satır olarak eklenir.

### G7.2 Panzehirin kenarı ne kadar?

- **Kenar ölçümü:** kadro kalitesi eşit iki takım, tarz çifti (A, B), 80 maç → beklenen gol farkı ve puan farkı; aynı çiftin ters sırası (ev/deplasman dengelenir). Kenar = (A vs B gol farkı) − (A vs A gol farkı). G2.8 matrisi bu ölçümle doldurulur; başlangıç değerleri yalnız işaret ve mertebe verir.
- **Kalite farkı eşiği:** Δ kademeleri (0, 1, 2) × tarz çifti → galibiyet/beraberlik/mağlubiyet dağılımı; "doğru tarzla bir kademe üstünü yenebilme" oranı G2.9'daki %35–45 bandına ayarlanır; iki kademede ≤ %20 (tahmin). Denge kararı 80 maçla, yön 40 maçla (CLAUDE.md kuralı).
- **Uyumsuzluk bedeli:** aynı kadro, aynı tarz, lig eşiği 3 → 2 → 1: tarz ilkellerinin başarı oranı ve puan beklentisi düşmeli; düşüş kullanıcı kararıyla kalibre edilir (Burnley/Southampton örnekleri mertebe verir: Championship'te şampiyon kadro Premier Lig'de 24 puan [K59][K60]; motorda bu kadar sert olması gerekmez, tahmin: bir lig yukarıda puan beklentisi %25–35 düşer).
- **Israr ve değişiklik zamanı:** maç içi plan değişikliği dakika dağılımı 58–79 bandına yakın [K61][K62]; geride olan takımın plan değişikliğinden sonra gol bulma oranı değişmeyen kontrol grubuna göre yüksek ama Myers'ın iki katı kadar değil (Swartz'ın itirazı [K63]); tahmin: +%20–30 göreli.
- **Yeni hoca etkisi:** hoca değişikliğinden sonraki 10 maçın puan ortalaması ile değişmeyen kontrol takımlarının (aynı dipten) 10 maçı karşılaştırılır; fark ≤ 0,1 puan/maç olmalı (ortalamaya dönüş baskın) [K49][K50]; 5 maç sonra efor çarpanı sıfırlanmış olmalı.
- **Hoca becerisi:** 80.–20. yüzdelik hoca farkı sezon boyu 0,25–0,30 puan/maç bandını aşmamalı [K48][K64]; ekip toplamı bunun %30'unu geçmemeli (tahmin).
- **Duran top antrenörü:** antrenör puanı 0 → 1 arasında duran top gol payı %11 → %26 bandında hareket etmeli [K23]; rakibin aynı rutini görmesiyle sönümlenme (Stoke 9 → 5 → 4 [K22]) `d-duran` kapısında tekrar sayısına bağlı eğri olarak ölçülür.
- **Taç:** taçta top tutma %45 → %68 bandı [K66]; lig ortalaması %80–84 (kayıp %16–20) [K67] — not: iki kaynağın tanımı farklı (baskı altındaki taç vs bütün taçlar); motorda ikisi ayrı ölçülür.
- **Tekrarlanabilirlik:** tarz katmanı eklendikten sonra `mac-deneme.js 4` "sonuç aynı", `ikiz-deneme.js` "Aynılık N/N", `ad-denetimi.js` temiz.

---

## G8. Bulunamayanlar ve devam notu

Arama bütçesi (oturum başına ortak sınır) bu bölümün ortasında tükendi; aşağıdakiler bir sonraki oturumda aranmalıdır:

- PPDA'nın lig çapında dağılımı (Understat/StatsBomb sezon tabloları; Understat sayfası JS ile yüklendiği için okunamadı). Şimdilik PPDA yalnız tanım olarak var; değerleri tahmin.
- Opta "savunma hattı yüksekliği" metriği ve lig dağılımı.
- Hudl Performance Insights 2025 — Sean Hooker, "The Manager Bounce: From Immediate Shock to Tactical Identity": PDF indirildi, metin çıkarılamadı (pypdf/poppler yok); taktik kimliğin kaç maçta ölçülebilir olduğu sorusunun tek nicel kaynağı budur [K56].
- CIES Football Observatory'nin hoca görev süresi / istikrar raporları (ilk arama CIES yayını vermedi).
- Twenty First Group / Omar Chaudhuri'nin hoca etkisi payı tahminleri.
- Analist ve kaleci antrenörü etkisinin nicel kanıtı; kondisyonerin sakatlık üzerindeki etkisi.
- Türkiye liglerinde tarz dağılımı ve örnek hocaların taktik analizleri (Türkçe kaynaklar: taktik blogları, Socrates vb.).
- Oyun motorlarında tarz modellemesi üzerine akademik çalışma (çok etmenli benzetim, "Google Research Football", TacticAI türü işler) — kopyalamak için değil, modelleme ilkeleri için.
- Kanat/orta oyununun lig çapında verimi (orta başına gol/xG).
- FourFourTwo "How to beat Bielsa" ve Holding Midfield Leeds–Liverpool vaka analizi (sayfalar üyelik/HTTP 401 ile kapalı; arama özetinden kullanıldı).

---

## Kaynaklar

- [K1] The Analyst (Opta), "Analysing Premier League Playing Styles 2024-25": https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25
- [K2] StatsBomb, "Modelling Team Playing Style": https://blogarchive.statsbomb.com/articles/soccer/modelling-team-playing-style/
- [K3] StatsBomb, "A Family Tree of European Defenses": https://blogarchive.statsbomb.com/articles/soccer/a-family-tree-of-european-defenses/
- [K4] Biology of Sport, "Data-driven classification of playing styles and match outcome prediction in UEFA Champions League teams": https://www.termedia.pl/Data-driven-classification-of-playing-styles-and-match-outcome-r-nprediction-in-UEFA-Champions-League-teams,78,56932,1,1.html
- [K5] Demir, Şahin, Üre, "How Do Football Teams Play? A Deep Embedded Clustering Approach to Reveal Playing Styles" (İTÜ): https://research.itu.edu.tr/en/publications/how-do-football-teams-play-a-deep-embedded-clustering-approach-to/
- [K6] Sky Sports (2020), Opta "team personas" özeti (sayfa HTTP 410; arama özetinden): https://www.skysports.com/football/news/11661/11802620/football
- [K7] Fantasy Football Scout, Dyche'ın Everton'ı için Opta uzun top verileri (Burnley 2018-19: 2.251 uzun top, %57,1): https://www.fantasyfootballscout.co.uk/2023/01/31/what-can-fpl-managers-expect-from-sean-dyches-everton
- [K8] Burnley'nin 35 yarda üstü pas payı %19,5 (980 uzun pas; sezon belirsiz) — arama özetinde geçen Opta temelli analiz; sayfa bu oturumda doğrulanamadı, en olası kaynak: https://lastwordonsports.com/football/2020/02/24/burnley-finding-consistency-with-unique-style-of-play/ (teyit edilecek)
- [K9] Pendle Today, "Burnley top of the long passes table" (1.737 uzun top): https://pendletoday.co.uk/sport/football/burnley-top-of-the-long-passes-table-200000
- [K10] The Analyst, "Southampton struggles: should promoted teams play possession football?": https://theanalyst.com/2024/10/southampton-struggles-should-promoted-teams-play-possession-football
- [K11] Premier League, "Promoted clubs: How Kompany has transformed Burnley": https://www.premierleague.com/news/3566923
- [K12] Premier League, şampiyonların sahiplik tablosu (Leicester %42,43): https://m.premierleague.com/news/2748139
- [K13] StatsBomb, "Leicester City: Need for Speed?": https://blogarchive.statsbomb.com/articles/soccer/leicester-city-need-for-speed/
- [K14] FotMob (Opta verisiyle), Atlético'nun Simeone dönemleri: https://www.fotmob.com/el/news/q63s9udsh67v1nbgqvhqh97z8/atletico-madrid-v-liverpool-how-have-simeones-side-toiled-since-champions-league-challenges
- [K15] LaLiga, "Special mention: Atlético Madrid 2013-14 champions": https://www.laliga.com/en-ES/news/special-mention-atletico-madrid-2013-14-liga-bbva-champions
- [K16] The Coaches' Voice, "Coach Watch: Marcelo Bielsa": https://learning.coachesvoice.com/coach-watch-marcelo-bielsa-leeds-guardiola/
- [K17] UEFA Performance Insights, Atalanta–Liverpool (Avrupa Ligi 2024): https://it.uefa.com/uefaeuropaleague/news/028c-1aa8b95a0bda-bbbf978b7f3f-1000--europa-league-performance-insights-how-atalanta-s-high-b
- [K18] The Mastermind Site, "Gian Piero Gasperini – Atalanta – Tactical Analysis (2020-21)": https://themastermindsite.com/2021/05/11/gian-piero-gasperini-atalanta-tactical-analysis-2020-21/
- [K19] UEFA Performance Insights, Barcelona–Atalanta 2-2 (ŞL 2024-25), adam adama markaj: https://fr.uefa.com/uefachampionsleague/news/0295-1cf23f131450-a7fbf2264d6a-1000--champions-league-performance-insights-man-marking-and-ho
- [K20] The Analyst, Premier Lig duraklamalar, duran top ve taç istatistikleri (2025-26): https://theanalyst.com/articles/premier-league-delays-set-piece-throw-in-stats
- [K21] The Analyst, "Premier League 2024-25 data trends": https://theanalyst.com/articles/premier-league-2024-25-data-trends-stats
- [K22] Sky Sports, Rory Delap ve Stoke'un uzun taçları: https://skysports.com/football/news/11095/13213297
- [K23] Sky Sports, "Nicolas Jover: Arsenal's set-piece genius…": https://www.skysports.com/football/news/11661/13125688/nicolas-jover-arsenals-set-piece-genius-has-transformed-premier-league-title-challengers-threat-from-free-kicks-and-corners
- [K24] "Defending Corner Kicks: Analysis from the English Premier League" (2013): https://www.ingentaconnect.com/content/uwic/ujpa/2013/00000013/00000001/art00012
- [K25] Sky Sports, Keith Andrews'un Brentford'a teknik direktör yapılması (2024-25 duran top sayıları): https://www.skysports.com/football/news/11661/13384423/keith-andrews-brentford-promote-set-piece-coach-to-replace-thomas-frank-as-head-coach
- [K26] Sky Sports, Barcelona–Inter 2010 maç sayfası (sahiplik 86,4–13,6): https://www.skysports.com/football/barcelona-vs-inter/212464
- [K27] Jonathan Wilson'ın yazısı (Goodreads yeniden yayını; %19): https://www.goodreads.com/author_blog_posts/25708306-psychodrama-of-jos-mourinho-s-most-beautiful-defeat-changed-game-for?tab=book
- [K28] Catalan News, "Chelsea vs FC Barcelona: 12 shots to 46 over both legs": https://catalannews.com/sports/item/chelsea-vs-fc-barcelona-12-shots-to-46-over-both-legs
- [K29] Brentford FC, Frank'in Arsenal maçı öncesi duran top açıklamaları: https://www.brentfordfc.com/en/news/article/first-team-thomas-frank-brentford-v-arsenal-premier-league-set-pieces-nicolas-jover-01-01-2025
- [K30] Spielverlagerung, "The Art of the Long Ball": https://spielverlagerung.com/2020/08/13/the-art-of-the-long-ball/
- [K31] FIFA Training Centre, KDK 2025 TSG yuvarlak masa: yüksek prese karşı çözümler: https://www.fifatrainingcentre.com/en/game/tournaments/fcwc/2025/team-analyses/tsg-roundtable-analysing-solutions-against-teams-that-press-high.php
- [K32] Sky Sports, Fernando Diniz'in Fluminense'si ve ilişkisel oyun: https://www.skysports.com/football/news/11096/12997384/fernando-dinizs-innovative-tactics-with-fluminense-can-he-win-the-copa-libertadores-and-change-football-too
- [K33] Between the Posts, Manchester City–Fluminense 4-0: https://betweentheposts.net/manchester-city-fluminense-manchester-city-position-themselves-as-world-champions-4-0
- [K34] Wikipedia, "Carlo Ancelotti" (Style of management bölümü): https://en.wikipedia.org/wiki/Carlo_Ancelotti
- [K35] Vikipedi, "Fatih Terim": https://tr.wikipedia.org/wiki/Fatih_Terim
- [K36] Vikipedi, "Şenol Güneş": https://tr.wikipedia.org/wiki/%C5%9Eenol_G%C3%BCne%C5%9F
- [K37] Vikipedi, "Abdullah Avcı": https://tr.wikipedia.org/wiki/Abdullah_Avc%C4%B1
- [K38] Vikipedi, "2019-20 Süper Lig": https://tr.wikipedia.org/wiki/2019-20_S%C3%BCper_Lig
- [K39] Vavel, Southampton Ağustos 2024 değerlendirmesi: https://www.vavel.com/en/football/2024/09/05/southampton/1195175-an-error-ridden-return-to-the-premier-league-southamptons-august-review.amp.html
- [K40] NBC Sports, Southampton'ın Russell Martin'i göndermesi: https://nbcsports.com/soccer/news/southampton-fire-russell-martin-the-reality-of-our-situation-is-clear
- [K41] FourFourTwo, "Leicester City 4 Manchester City 2": https://www.fourfourtwo.com/us/news/leicester-city-4-manchester-city-2-vardy-back-business-champions-upset-city
- [K42] Manchester City, Guardiola'nın maç sonrası açıklamaları: https://www.mancity.com/news/first-team/first-team-news/2016/december/leicester-v-man-city-pep-guardiola-reaction
- [K43] Spielverlagerung, "Potter's Swansea hold Bielsa's Leeds": https://spielverlagerung.com/2018/08/24/potters-swansea-hold-bielsas-leeds/
- [K44] Between the Posts, Roma–Inter 0-1 (Gasperini): https://betweentheposts.net/?p=79006
- [K45] "Analysis of teams' corner kicks defensive strategies at the FIFA World Cup 2018": https://lida.sport-iat.de/dfb/Record/4063705
- [K46] FIFA Training Centre, "Defending corners: zonal or player-to-player?": https://www.fifatrainingcentre.com/en/game/game-analysis/set-plays/defending-corners-zonal-or-player-to-player.php
- [K47] Empire of the Kop (taraftar sitesi; zayıf kaynak), Liverpool'un uzun top zaafı 2025-26: https://www.empireofthekop.com/2025/10/29/liverpools-long-ball-weakness-slots-open-admission-sums-up-a-worrying-new-trend/
- [K48] Muehlheusser, Schneemann, Sliwka, Wallmeier, "The Contribution of Managers to Organizational Success: Evidence from German Soccer" (çalışma kâğıdı PDF; J. Sports Economics 2018): https://www.wiso.uni-hamburg.de/fachbereich-vwl/professuren/muehlheusser/archiv/footballmanagersmuehlheusser2411.pdf
- [K49] "Effects of changing the head coach on soccer team's performance: A systematic review" (PMC): https://pmc.ncbi.nlm.nih.gov/articles/PMC10955743/
- [K50] Erasmus School of Economics, van Ours, "For What It's Worth: Outcome Bias in Managerial Decisions" özeti: https://www.eur.nl/en/ese/news/irrational-managerial-changes-remain-norm-europes-top-football-leagues
- [K51] Soccer Analytics (Substack), "Is the 'new manager bounce' really all a myth?": https://socceranalytics.substack.com/p/is-the-new-manager-bounce-really
- [K52] Stachniak, Wolak, Ekstraklasa'da hoca değişikliği: https://managementpapers.polsl.pl/wp-content/uploads/2025/04/218-Stachniak-Wolak.pdf
- [K53] Erasmus lisans tezi, Eredivisie 2000–2023 hoca değişiklikleri: https://thesis.eur.nl/pub/67973/Bachelor-Thesis-512812md.pdf
- [K54] Economies 2020, 8(4), 82 — PL ve Ligue 1'de hoca görevden alma (Monte Carlo): https://www.mdpi.com/2227-7099/8/4/82 (bu oturumda görülen kopya bir ayna sayfaydı: https://p.gyb.elementfx.com/2227-7099/8/4/82)
- [K55] "The effect of mid-season coach turnover on running match performance…" (PMC): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9226040/
- [K56] Hudl Performance Insights 2025, Sean Hooker, "The Manager Bounce: From Immediate Shock to Tactical Identity" (PDF; metin çıkarılamadı): https://static.hudl.com/craft/performance-insights-research-stage/2025/The-Manager-Bounce_-From-Immediate-Shock-to-Tactical-Identity-Sean-Hooker.pdf
- [K57] Goal, Meulensteen'in Amorim için "18 ay" görüşü: https://www.goal.com/en-ca/lists/ruben-amorim-style-man-utd-training-sessions/blt0ce3d9d96da96e8e
- [K58] AP / Washington Times, De Boer'in 4 maç sonra gönderilmesi: https://www.washingtontimes.com/news/2017/sep/11/crystal-palace-fires-de-boer-after-4-premier-leagu/
- [K59] Goal, Kompany'nin Burnley'de ne yanlış gitti (101 puan; ilk 11 maçta 4 puan): https://www.goal.com/en-ke/lists/where-gone-wrong-vincent-kompany-burnley/blt0ac6ff3742c64093
- [K60] Wikipedia, "2023–24 Premier League" (puan tablosu): https://en.wikipedia.org/wiki/2023%E2%80%9324_Premier_League
- [K61] Freakonomics, Myers'ın değişiklik kuralı (JQAS 2012): https://freakonomics.com/2011/02/when-should-a-soccer-manager-insert-his-subs/
- [K62] Frontiers in Sports and Active Living (2025), Euro 2024 değişiklikleri: https://www.frontiersin.org/articles/10.3389/fspor.2025.1573823/full
- [K63] Swartz ve ark., JQAS, değişiklik zamanlamasına Bayesçi bakış: https://www.degruyterbrill.com/document/doi/10.1515/jqas-2015-0114/html
- [K64] IZA Discussion Paper 8560 özeti: https://www.iza.org/publications/dp/8560
- [K65] IZA Newsroom, "The coach matters: evidence from the Bundesliga": https://newsroom.iza.org/en/archive/research/the-coach-matters-evidence-from-the-bundesliga
- [K66] Sports Gazette, Thomas Grønnemark söyleşisi: https://sportsgazette.co.uk/?p=22066
- [K67] The Analyst, İngiltere'nin taç rutinleri ve Liverpool'un taç verileri: https://theanalyst.com/articles/england-throw-in-routines-croatia/
- [K68] This Is Anfield, Tifo/Ben Jacobs aktarımı (Midtjylland %70,2): https://www.thisisanfield.com/?p=214055
