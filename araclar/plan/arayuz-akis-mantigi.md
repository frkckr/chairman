# Pano, kanal, görüşme ve zaman — ana mantık tartışması (tartışma turu 2, 2026-11-04, dizüstü)

Durum: **tartışma; plan yok; kod ve önizleme değişmedi.** Kullanıcının 4 Kasım sözü (konsept önizlemesinden sonra): görsel konsept ve menüler doğru yolda, koyu görünüm ve düğme menü kesin; ama bizim CM/FM'den farkımız unutulmasın — finans, transfer, oyuncu ve menajer işleri yalnız panodan yürümez; görüşmeler, kartlar ve senaryolar kilit olacak; her bilgiye her an ulaşılamaz, rapor istenir, işler müdüre ya da başkalarına yaptırılır, banka ve federasyonla ilişkiler olur; bir haber telefona gelir, oradan sürer, takip için panoya da yansır; zaman hep durmamalı, görüşme ve pazarlığın zamana etkisi olmalı ki oyuncu önceliklendirsin, devretsin, iş kaçırsın, doğru zamanda doğru işin başarısı olsun. İstek: hemen plan değil, uzun düşünme, araştırma, öneri ve sorular; ana mantık kurulsun, senaryolar ve görüşme ekranları (dışarıda, federasyonda) sonra eklensin.

Bu belge önce depodaki kesin kararları hatırlatır (§1), sonra önerdiğim ana mantığı yedi kuralda kurar (§2), üç örnek akışla sınar (§3), kararın pano konseptine ne yaptığını söyler (§4), dış örneklerden alınanları (§5) ve soruları (§6) listeler; ikinci turda kullanıcının zaman itirazına cevap olan **model C** (§7: sahnede akan saat, belirsiz bedel, bedelli gece, kesinti) eklendi. Kararlar verilince OYUN_TASARIMI §2, §6, §7, §10 ve STIL_REHBERI §7 güncellenir, önizleme buna göre düzeltilir, uygulama planı ondan sonra çıkar.

## 0. Geçiş seçeneğinin anlamı ve önerim

Önizlemedeki “Geçiş” menüden ya da sekmeden bir ekrana geçerken içeriğin nasıl geldiğidir; şerit ve başlık hiç kıpırdamaz:

- **Anında:** içerik aynı karede değişir (CM böyledir; sıfır bekleme).
- **Kayma:** yeni içerik sağdan 16 piksel kayarak 160 ms'de yerleşir (ekran değiştiğini göze söyler, “sayfa çevirme” hissi).
- **Solma:** yeni içerik 120 ms'de belirir (en yumuşak, en az dikkat dağıtan).

Önerim: **menü ve sekmelerde Anında.** Sebep: CM'nin keskinliği buradan gelir; günde yüzlerce geçiş olur, 160 ms bile birikince yavaşlık hissi verir; ve oyunun “fiziksel” hareketleri (odada telefonu ele almak, balkona yürümek, kapıdan giren kişi) zaten var — o hareketler anlam taşıdığı için değerli, menü geçişinin anlamı yok. Tek istisna: bir alt sayfaya (kulüp, oyuncu, maç) ya da bir sahneye (kapı, görüşme) girişte 120 ms solma — “başka bir yere girdim” işareti. Bu sadece benim tercihim; kullanıcı kayma hissini sevdiyse kayma ekran seviyesinde kalır, sekmelerde anında olur.

## 1. Elimizde olan (kesin kararlar; değişmez)

- **Beş katman:** dünya → kişiler → dosyalar → kartlar → sonuç; oyuncu yalnız karta dokunur (karar 51). **Beş fiil:** ara, çağır, görevlendir, teklif et, bekle.
- **Dosya şablonu:** aşamalar kart / bekleme / devir; her aşamadan kayıp; bekleme pasif değil (dünya çalışır); devredilen iş iyi / vasat / kötü döner; altı şablon (transfer alımı, satışı, sözleşme, personel, kriz, kurumsal). **Kart sınıfı × bekleme:** fırsat ömrü işler ve sessizce kaybolur, sorun büyür ve ağır kart olarak döner, rutin birikir ve varsayılan işler, pazarlıkta sabır düşer ve kopar. Cevapsız sonuç kartın yüzünde önceden yazar.
- **Kişi modeli:** gündem, hafıza, gizli tutum (asla sayı ya da çubuk), konu başına güvenilirlik; rehber tanışıldıkça büyür; kapıdaki konular açık meselelerle sınırlı, serbest soru telefondan.
- **Zaman:** okumak bedava, yeni bilgi toplamak kişi ve zaman ister; telefon kısa, görüşme uzun, yolculuk sürer; İlerle yalnız karar, randevu, beklenen cevap ve maç gününde durur; zorunlu iş yapılmadan gün bitmez; anlık kart nadir; Genel Duraklat her şeyi dondurur.
- **Bilgi:** kaynağı ve tarihi belli; görüş ile olgu ayrılır; gizli puan yok; kamu sayıları (lig, maç, oyuncu sayaçları) herkese açık.
- **Kanal aciliyeti:** gazete dün, TV bugün, telefon şimdi (mesaj bugün, arama şimdi), kapı yüz yüze.
- **Arayüz (bu hafta):** düğme = ekran; tek krom; CM koyu görünüm, düğme menü; Haberler bütün kanalların tek listesi; Finans, Lig, Kulüp, Transfer bölümleri.

Kullanıcının bugünkü endişesi bunların hiçbirini bozmuyor; endişe **pano ile bu kuralların aynı karede nasıl duracağı.** Aşağıdaki mantık ikisini birbirine bağlar.

## 2. Önerilen ana mantık: yedi kural

### K1. Pano gösterir, kanal konuşur, dosya ilerler

Her şeyin üç yüzü vardır ve üçü ayrı yerde yaşar:

| Yüz | Nerede | Ne yapar |
|---|---|---|
| **Konuşma** (olayın geldiği ve cevaplandığı an) | Kanal: telefon mesajı ya da arama, kapı, dışarıda görüşme, mektup/belge, gazete kupürü, TV | Kart burada açılır; kişinin sözü, üslubu, hafızası burada görünür |
| **Durum** (dosya hangi aşamada, kimde, ne bekliyor) | Bölüm: Transfer, Finans, Kulüp, Kurumsal | Aşama satırı, sahip, sıradaki adım, son tarih; buradan yeni konuşma başlatılır (mesaj, çağır, git) |
| **Kayıt** (ne oldu, ne zaman) | Haberler (gelen kutusu + günlük) | Her konuşma ve her sonuç bir satırdır; satır konuşmayı **kendi kanalının görünüşüyle** açar |

Kural: **hiçbir şey panodan başlamaz; pano hiçbir şeyi bitirmez.** Gelen her iş bir kişiden ya da bir belgeden gelir (telefon, kapı, mektup, gazete); pano yalnız yansıtır ve yeni konuşma başlatır. Rutin belgeler (haftalık özet, ay başı raporu) buna istisna gibi görünür ama değildir: onlar da bir kişinin ürünüdür, kaynaklı ve tarihli gelir.

Önizlemede bunun karşılığı zaten var: Haberler'de satıra dokununca ayrıntı panelinde hocanın kartı açılıyor; Telefon'da aynı kart damgalı duruyor; Transfer'de dosya beliriyor. Eksik olan şu: Haberler'in ayrıntı paneli **kanalın görünüşünü** taşımıyor — telefon mesajı balonla, gazete kupürü serifle, kapı ziyareti “karşında oturuyor” sahnesiyle gelmeli. Düz pano riski böyle önlenir.

### K2. Bilgi iki türlüdür: her an olan ve zamanla gelen

| Her an (panoda, bedava) | Zamanla (kişiden, bedelli) |
|---|---|
| Kamu: puan durumu, fikstür, maç kayıtları, oyuncu sayaçları, kulüplerin hocası ve statı | Görüş: oyuncu iyi mi, hoca kadroyu nasıl görüyor, rakip kulüp satar mı, oyuncu gelir mi |
| Kulübün kendi defteri: kadro ve sözleşmeler, kasa bakiyesi (banka ekstresi), takvim, verilen sözler, geçmiş | Tahmin ve analiz: 90 günlük nakit ufku, maaş yükü dökümü, bütçe sapması, sponsor piyasası, kredi şartları |
| Olmuş olan: dünkü gazete, bugünkü haber | Olacak olan: federasyonun kararı, bankanın cevabı, rakibin niyeti, taraftarın sabrı |

Panodaki her “zamanla gelen” sayının **kaynağı ve tarihi** yazılır ve eskir: Finans › Durum'da “90 günde en düşük: 3,85 milyon ₺ — Nusret Bey, 1 Aralık” durur; üç hafta sonra aynı sayı sararmış durur, altında “taze rapor iste ▸” olur. Taze bilgi istemek bir mesajdır (K4), cevabı gecikmeli ve kişinin kalitesinde gelir; acele istenen rapor kaba olur (önizlemede var). Böylece “her bilgiye her an ulaşamıyoruz” pano üstünde görünür bir şeye dönüşür: pano boş değildir, ama panodaki sayıların yarısı **birinin sözüdür** ve eskir.

Sınır sorusu: kasa bakiyesi her an mı? Önerim: evet (banka ekstresi bugünün gerçeğidir; onu saklamak yapay olur). Ama taahhütler, alacaklar ve ufuk müdürün işidir.

### K3. Kişiyle temasın üç kademesi vardır; her bölüm düğmesi bir kademeye bağlıdır

| Kademe | Fiil | Bedel | Etki | Nereden |
|---|---|---|---|---|
| 1. **Mesaj / arama** | ara | Başkanın zamanı 0; bedel beklemektir (cevap saatler sonra, kişinin mesaisinde) | Bilgi, küçük istek, rapor isteme, görev verme, randevu isteme | Telefon; bölümlerdeki “Mesaj yaz”, “Rapor iste”, “Görev ver” |
| 2. **Odada görüşme** | çağır | 30–60 dk ajandada; kişinin uygun saati; aynı anda tek görüşme | Pazarlık, kriz, ikna, söz; kişinin hafızasına çift ağırlıkla yazılır | Ajanda; bölümlerdeki “Çağır / Görüşme ayarla”; kapı (gelen) |
| 3. **Dışarıda görüşme** | git | Yarım gün + yol masrafı; o gün başka iş düşer | Yalnız yüz yüze olanı açar: banka kredisi, federasyon lisans görüşmesi, rakip başkanla transfer, oyuncunun şehrinde ikna, sponsorun ofisi | Bölümlerdeki “Git ▸”; mekân sahneleri (`js/mekan.js` sekiz yer var) |

Panodaki her kişi düğmesi hangi kademeye ait olduğunu ve bedelini yazar: “Çağır · 45 dk · bugün 16:15'e kadar” ya da “Bankaya git · yarım gün · 1.200 ₺”. Oyuncu bedeli görerek seçer; **bazı kapılar yalnız 3. kademeyle açılır** (banka müdürü telefonla kredi vermez; federasyonda “dosyayı elden götürmek” fark eder). Bu, görüşme sahnelerini panonun dekoru değil, oyunun kilidi yapar.

Finans › Müdürlük'teki “rapor iste / görev ver” 1. kademedir (mesaj); “görüşme ayarla” 2. kademedir; bankaya ya da sponsorun ofisine gitmek 3. kademedir ve kart zinciri başkanın sahnesinde oynar.

### K4. İki kapasite: başkanın günü, personelin yükü

Önceliklendirme ancak iki kıt şey varsa doğar:

- **Başkanın günü:** 08:00–20:00 (dönemde 23:00). Her 2. ve 3. kademe temas gün içinde yer kaplar; ajanda doluluğu şeritteki tarih kutusunun altında görünür (“bugün 2 sa 40 dk boş”). Günü dolduran başkan bir şeyi yarına bırakır; yarın başka şeyler gelir.
- **Personelin yükü:** her çalışanın yürüttüğü iş sayısı görünür (“Nusret Bey · 3 iş”). Dördüncü iş hepsini yavaşlatır ve kalitesini düşürür (gizli yetenek × yük). Kalıcı yetki (K5) yükü azaltır. Personel slotu lig kademesiyle büyür; boş koltuğun işi başkana ya da yanlış kişiye düşer (karar 52).

Dünyanın saati ise hiçbirine bakmaz (K6). Üç şey aynı öğleden sonrayı isterse oyuncu birini kendi yapar, birini devreder, birini bekletir; bekletmenin bedeli kartın sınıfından okunur. Bu Citizen Sleeper'ın “hiçbir zaman yeterli zar yok” hissidir, zar yerine saat ve insanla.

### K5. Devretmek sahibi değiştirir; görünürlüğü azaltır, kontrolü değil

- Devredilen dosya bölümünde kalır: “Sponsor arayışı · Nusret Bey · Görüşme 2/4 · dönüş Perşembe”. Kart gelmez; sonuç kartı gelir (iyi / vasat / kötü).
- Başkan ara sorabilir (1. kademe: “Ne durumda?”) — bedeli beklemek; sık sormak kişinin tutumuna yazılır (mikro yönetim).
- **Kalıcı yetki:** “müdür 50 bin ₺'ye kadar ödemeleri kendi yapar”, “yardımcı antrenör genç oyuncu raporlarını hocaya değil bana getirir”. Kurulunca rutin kartlar kesilir; eşik üstü başkana düşer. Yetki de bir karttır (verilir, geri alınır), kişinin hafızasına yazılır.
- Devredilen işin vasat sonucu sonradan sezdirilir (gazete: rakip aynı profili ucuza aldı) — mevcut karar. Başkan bunu okuyup bir dahaki sefere kendisi yapar ya da kişiyi değiştirir: personel kararı buradan doğar.

### K6. Dünyanın saati durmaz; her dosyanın bir saati vardır, bazısı görünür

- Her dosyada bir **saat** işler (Blades in the Dark / Citizen Sleeper'ın ilerleme saati): fırsatın ömrü, karşı tarafın sabrı, sorunun büyümesi, rutinin birikmesi, federasyonun son günü, transfer döneminin kapanışı. Saat takvimle ilerler; başkan ne yaparsa yapsın.
- **Görünürlük bilgiyle gelir:** karşı taraf söylediyse (“Pazartesiye kadar”) ya da takvimse (dönem kapanışı, lisans son günü) saat panoda yazar; söylemediyse yalnız “sabrı belirsiz” yazar ve kişinin güvenilirliğiyle tahmin edilir (menajer “bir hafta” der, üç gün sabreder). Bilgi saatleri görünür kılar; bu da bilgi toplamayı değerli yapar.
- **Zaman akışı:** okurken durur (kesin karar, değişmez). Ama **bedava eylem yoktur**: mesaj yazmak cevabı beklemektir, görüşme saat yer, yolculuk gün yer, İlerle günü kapatır. Gün 20:00'de biter; bitince isteğe bağlı işler kaçar, kartlar sınıfına göre işler, sabah yeni şeyler gelir. Kullanıcının “zaman hep durmamalı” sözünü böyle okuyorum: ofiste boş boş akan bir saat değil (o CK3'ün sürekli kesilen oyunu olur ve okuma bedava kuralıyla çelişir), **her eylemin saati olan ve günün biten bir oyun**. Alternatif (B) §6'da soru olarak duruyor.
- **Doğru zamanın ödülü içeriktendir, mekanik ona zemin verir:** dönemin son günü fiyat düşer ama rakip de iner; sorunu küçükken yakalamak küçük kart, geç kalmak büyük kart; sponsoru kurul toplantısından önce bağlamak kurulda güven; lisans dosyasını son güne bırakmak ceza. Şablonun aşama eşikleri sınıfı değiştirir; senaryo yazarı eşikleri yazar.

### K7. Haberler gelen kutusudur, kanal değil; kanal kimliği satırda ve ayrıntıda kalır

Kullanıcının “haber telefona gelir, oradan sürer ama takip için panoya da yansır; nasıl dengeleriz” sorusunun cevabı:

- **Her şey Haberler'e düşer** (tek liste, CM'nin News'i) — ama satır kaynağını ve kanalını taşır (yüz, arma, kurum; “telefon”, “kapı”, “gazete”, “belge”), ayrıntı paneli de **o kanalın görünüşünü** gösterir: mesaj balonu, gazete kupürü, resmî yazı, “karşında oturuyor” sahnesi. Kart ayrıntıda cevaplanır.
- **Telefon, Gazete, Kapı ayrı ekran ve sahne olarak kalır:** Telefon konuşmanın tamamı ve yeni konuşma başlatma yeridir (konu menüsü), Gazete arşiv ve dünya yüzeyidir, kapı sahnedir. Haberler'den açılan konuşma Telefon'a gitmez; aynı kart iki yerde aynı durumu gösterir (önizlemede böyle).
- **Hangi kanaldan gelir:** kişiden gelen → telefon (mesaj) ya da kapı (kendiliğinden gelen, en acil); kurumdan gelen → belge (mektup, resmî yazı, rapor; Finans ve Kurumsal'ın Raporlar'ına da düşer); dünyadan gelen → gazete (dün) ve TV (şimdi). Aciliyet kanaldan okunur (mevcut karar).
- **Haberler'in Cevap bekliyor bloğu** görev listesi değildir: yalnız kart, randevu ve son tarihi gelen dosya; devredilmiş işler orada değil, bölümünde (K5). Böylece “görev toplama” hissi doğmaz, ama “ne yapmam gerek” tek bakışta görünür.

## 3. Üç örnek akış (mantığı sınamak için; metinler uydurma)

**A. Sponsor (kurumsal, pazarlık).** Pazartesi 10:40 telefon: Nusret Bey “Göğüs sponsoru Mart'ta bitiyor; iki firma ilgili, biri yeni, biri eski sponsor” (1. kademe, mesaj; Haberler'e satır, Finans › Durum'da “Sponsor: Mart sonu” saati görünür). Kart: *Sen yürüt / Nusret'e bırak*. **Bırakırsan:** Finans'ta “Sponsor arayışı · Nusret · Görüşme” satırı, Perşembe sonuç kartı (iyi: iki teklif; vasat: tek teklif; kötü: eski sponsor küstü). **Sen yürütürsen:** Çarşamba 14:00 firmanın ofisine git (3. kademe; yarım gün; o gün hocayla görüşme düşer — ajanda uyarır). Dışarıda görüşme sahnesi: 3 kart (rakam, süre, şart); firmanın gizli üst sınırı ve sabrı; “Cuma'ya kadar cevap” derse saat panoda görünür. Cuma gazetesinde “X firması Y kulübüyle de görüşüyor” (dünya çalışır). Cevap kartı telefonla gelir; imza Finans › Raporlar'da sözleşme belgesi; kasa her ayın 1'inde; Haberler'e kapanış satırı.

**B. Federasyon lisansı (kurumsal, son tarih).** 24 Haziran mektup (belge kanalı): “Üç kalem eksik, 23 Temmuz son gün” — Kurumsal/Finans › Raporlar'da resmî yazı, Haberler'e satır, Ajanda'da son gün kırmızı, Finans › Durum'da saat “Lisans · 29 gün”. Kalemler: SGK borcu (Finans: öde kartı), altyapı belgesi (belediyeden — belediye başkanını ara, 1. kademe; cevabı yavaş; tutumu geçmişe bağlı), personel belgesi (müdüre görev). 15 Temmuz'da hâlâ eksik varsa federasyon yetkilisi telefonla uyarır (kişi, hafızası var). Son haftada iki yol: Ankara'ya git (3. kademe, bir tam gün, hazırlık maçı kaçar — ajanda söyler) → sahnede “ek süre iste” kartı, yetkilinin tutumuna göre; ya da gitme, cezayı ye (gazete yazar, kurul not düşer). Doğru zaman ödülü: erken halleden hiç bu kartı görmez.

**C. Oyuncu huzursuzluğu (kriz, kişisel).** Maç gecesi 23:10 kaptan mesajı: “Oğuz soyunma odasında bağırdı, hoca karşılık verdi.” Sorun sınıfı: beklerse büyür. Sabah gazetede yok (henüz sızmadı), Haberler'de kırmızı. Seçenekler: hocayı çağır (2. kademe, 30 dk, bugün 11:00), Oğuz'u çağır, kaptana sor (1. kademe, bedava ama bir saat bekle), bekle. Her yolun sahnesi kart zinciri; Oğuz'un hafızası (geçen ay Kocadere teklifini reddettiğini bilir). Üç gün beklersen gazeteye sızar (dünya), kart ağırlaşır, transfer listesine “satmak ister” düşer. Doğru zamanda kaptana sorup sonra Oğuz'u çağırmak en ucuz yol; önce hocayı çağırmak hocanın otoritesine yazılır. Pano bunu yalnız yansıtır: Kulüp › Kadro'da Oğuz'un durumunda “huzursuz · 3 Ara” (gözlenebilir), Transfer › Teklifler'de hiçbir şey yok (henüz).

Üç akışta da pano hiçbir şeyi başlatmadı ve bitirmedi; her dönüm bir kişiyle bir kademede geçti; saatler takvimle işledi; devretmek görünürlüğü düşürdü; bilgi kaynaklı geldi.

## 4. Mantığın pano konseptine yaptığı değişiklikler (önizlemeye sonra işlenir)

1. **Haberler ayrıntı paneli kanal görünüşü taşır** (balon, kupür, resmî yazı, “karşında” sahnesi); kart orada.
2. **Bölümlerdeki kişi düğmeleri kademe ve bedel yazar:** “Mesaj yaz”, “Çağır · 45 dk”, “Git · yarım gün · ₺”.
3. **Zamanla gelen her sayıda kaynak ve tarih; eskiyince sararır ve “taze rapor iste”.** Finans › Durum'un dört sayısından ikisi (en düşük, belirsiz gelir) böyle; kasa ve maaş yükü her an.
4. **Şeritte günün doluluğu** (tarih kutusunun altında) ve ajandada saatli iş blokları.
5. **Personel yükü görünür** (Kulüp › Teknik ekip ve Finans › Müdürlük: “3 iş”); kalıcı yetki satırları.
6. **Dosya saatleri** bölümlerde: görünürse gün, değilse “belirsiz”.
7. **Kulüp › İlişkiler sekmesi** (yeni): kurumlar ve kişiler — kurul üyeleri, federasyon yetkilisi, belediye, banka, basın, taraftar derneği, menajerler, rakip başkanlar — her satırda son temas, açık dosya, verilen söz; tutum yok (gizli), ama “bir aydır konuşulmadı” gibi olgular var. Rehber (telefon) aynı listenin kişi yüzüdür.
8. **Kurumsal dosyalar için yer:** federasyon, belediye, banka, kurul dosyaları Finans'ta değil; önerim Kulüp › İlişkiler altında dosya satırları ya da ayrı “Kurumsal” bölümü (soru 5).
9. **Haberler › Cevap bekliyor** yalnız kart, randevu ve son tarihli dosya; devredilmişler bölümünde.

## 5. Dış örneklerden alınan ve alınmayan

- **Citizen Sleeper / Blades in the Dark saatleri:** her işte görünür ya da gizli ilerleme saati; dünya saatleri başkana bakmaz; “yeterli zar yok” hissi önceliklendirmeyi doğurur. Alındı (K4, K6). Zar alınmadı (bizde kıt olan saat ve insan).
- **Persona takvimi:** gün bütçesi ve kaçan sosyal fırsatlar; “her şeyi yapamazsın” kasıtlı. Alındı (K4 gün doluluğu). Katı iki slot alınmadı (bizim saatli ajanda daha esnek).
- **FM yetki devri:** her sorumluluk bir personele devredilebilir, kurul işleri hariç; Director of Football kurulla aradaki halka. Alındı (K5 kalıcı yetki). FM'in sorunu: devredince sonuç görünmez; bizde vasat sonuç sezdirilir, iş bölümde izlenir.
- **CK3 konsey görevleri:** sadakat ve beceri ayrımı (sadık ama beceriksiz / becerikli ama sadakatsiz). Alındı (gizli yetenek × tutum; küskün personel az rapor getirir — karar 52). CK3'ün sürekli kesen olay pencereleri alınmadı.
- **This Is the Police:** günün çağrıları, öncelik, tekrarlayan içerik şikâyeti. Ders: mekanik iskelet tekrar üretir, içerik aileleri derin ve az olmalı (karar 60).
- **CM 01/02:** haber ekranı tek liste; her şey panoda. Alındı (K7 gelen kutusu). Alınmadı: panodan her şeyi halletmek — bizde pano başlatır, kanal bitirir (K1).
- **Football Chairman (mobil):** kulüp başkanı oyunu var ve “finans bilgisi yetersiz, tekrar ve şans” şikâyetleri alıyor; bizim ayrımımız tam da görüşme, kişi ve zaman. Rakip olarak not.
- **Democracy 4 bakanlar, Suzerain kabine:** kişilerin kendi gündemi ve küsmesi; alındı (kişi modeli zaten var).

## 6. Sorular (tercihim önde)

1. **Zaman modeli.** İlk yazımda A (eylem bedeli, gün 20:00'de biter) ve B (ofiste akan saat) vardı. **Kullanıcı (2026-11-04, ikinci tur):** ikisi de değil — CM gibi oyunu durdurup saatlerce iş yapmak olmasın, ama katı gün sonu da olmasın (gece yarısı operasyonu olabilmeli); görüşmenin masrafı, süresi ve sonrasının yükü önceden kesin bilinmesin; kendin yaptığın işle devrettiğin iş ikisi de bozulabilsin ya da ikisi de tutsun; zor, keyifli, bağımlılık yapan bir zaman yönetimi. Cevap: **model C (§7)** — sahnede akan saat, belirsiz bedel, bedelli gece, kesintiler, zaman içinde öğrenilen insanlar. A ve B kapandı.
2. **Gün doluluğu görünür mü** (şeritte “bugün 2 sa 40 dk boş”, ajandada bloklar)? Tercihim evet; oyuncu bedeli görmeden önceliklendiremez.
3. **Üç kademe ve bedel etiketi** (Mesaj / Çağır · dk / Git · yarım gün · ₺) kabul mü? Hangi işler yalnız 3. kademeyle açılsın: banka kredisi, federasyon ek süre, rakip başkanla transfer, oyuncunun şehrinde ikna, sponsor imzası? Tercihim bu beşi.
4. **Bilginin eskimesi:** panodaki “zamanla gelen” sayılar kaynak ve tarihle durur, eskiyince sararır, taze istemek bedelli. Kasa bakiyesi her an mı (tercihim evet), yoksa o da ekstre günüyle mi?
5. **Kurumların yeri:** federasyon, belediye, banka, kurul, basın, taraftar derneği → (a) Kulüp › İlişkiler sekmesi + dosyalar orada (tercihim: az bölüm, ilişki tek yerde); (b) ayrı “Kurumsal” bölümü; (c) Finans'ta banka, Kulüp'te gerisi.
6. **Haberler gelen kutusu + kanal görünüşlü ayrıntı** (K7) kabul mü? Alternatif: Haberler yalnız indeks, konuşma hep kendi ekranında açılır (bir tık daha, ama kanal hissi daha güçlü).
7. **Kalıcı yetki** (“50 bin ₺'ye kadar müdür öder”) ilk sürümde var mı? Tercihim evet, iki üç yetkiyle (ödeme eşiği, rapor sıklığı, genç raporu).
8. **Personel yükü** görünür ve kaliteyi düşürür — kabul mü? Sayılar TEST.
9. **Dışarıda görüşme sahneleri** için mekânlar var (`js/mekan.js`: sekiz yer); banka ve federasyon eklenir; sahnenin görseli görsel turda, mantığı şimdi. Kabul mü?
10. **Devredilen işin ara sorgusu** (“ne durumda?”) tutuma yazılsın mı (mikro yönetim bedeli)? Tercihim evet, hafif.

## 7. Zaman modeli C: sahnede akan saat, belirsiz bedel, bedelli gece (ikinci tur, 2026-11-04)

Kullanıcının üç itirazı (CM gibi donmuş oyun olmasın; katı gün sonu olmasın; bedel önceden kesin bilinmesin) ve dört isteği (zor, keyifli, bağımlılık yapan, insan yönetimini hissettiren) tek modelde toplanır. İlke: **zamanı sen akıtırsın ama ne kadar akacağını sen belirlemezsin.** Okumak ve düşünmek bedava kalır (kesin karar); zamanı harcayan tek şey insanlarla temastır ve her temasın süresi, bedeli ve ardı önceden yalnız tahmin edilir.

### 7.1 Sahnede akan saat

- Her 2. ve 3. kademe temas bir **sahnedir** (odada görüşme, telefon araması, dışarıda görüşme, maç). Sahnede saat görünür biçimde akar; ama sabit hızda değil, **kartla akar:** her cevaplanan kart sahneye kendi ağırlığında dakika ekler (selamlaşma 2 dk, rakam pazarlığı 10–15 dk, kriz konuşması 20 dk; TEST). Sahnenin uzunluğu kart zincirinden çıkar: karşı taraf diretirse zincir uzar, kapıyı çarparsa 5 dakikada biter, “bugünlük bu kadar” dersen sen bitirirsin (bazı kartlarda iki cevaptan biri budur). **Görüşmenin süresini önceden kesin bilemezsin; bittiğinde öğrenirsin.**
- Sahne dışında (masada, panoda) saat durur. Okumak, aramak (Transfer › Ara), düşünmek bedava. Ama masada yapılan her şey ya bir sahne açar ya bir mesaj gönderir (bedeli beklemek) ya da İlerle'dir. CM'nin “dondurup saatlerce iş yapma”sı burada şöyle sınırlanır: yapılabilecek şeylerin sayısı sınırlı değildir, **her birinin sonucu zamanla gelir ve personelin yükünden geçer** (K4). Yirmi oyuncuya bakabilirsin; üçü için hocadan rapor istersen hoca üçünü sırayla, haftada ikisini bakar.
- Telefon **araması** (mesajdan ayrı, yeni): kısa canlı sahne (3–15 dk), kişi açmayabilir (mesai, tutum, meşguliyet), sonra geri arayabilir (anlık kart: “Şakir arıyor”). Mesaj yazmak bedava ve yavaş, aramak bedelli ve hızlı; ikisi arasındaki seçim günün ritmini oyuncuya verir.

### 7.2 Belirsiz bedel, öğrenilen tahmin

Her düğme bedel yazar (K3) ama bedel bir **tahmindir** ve kaynağı bellidir:

| Bedel | Önceden ne bilinir | Nereden öğrenilir | Kim iyileştirir |
|---|---|---|---|
| Süre | Aralık (“~30–60 dk”) | Kişinin geçmişi: oyun her kişiyle yapılan sahnelerin gerçek süresini hatırlar (“Şükrü Hoca: son üç görüşme 50, 70, 40 dk”); ilk görüşmede yalnız rol tahmini | Özel kalem (randevuyu “kısa tutalım” diye ayarlar), tecrübe |
| Para | Yol ve ağırlama kalemi; pazarlıkta rakam aralığı | Mekân ve kişi; önceki pazarlıklar | Mali müdür (tahmini daraltır), menajer (fiyatı söyler, doğru söylemeyebilir) |
| Ardı (sonradan doğan yük) | Kartın yüzünde “olası sonuç” satırı; bazı kartlarda “bilinmez” | Yaşanınca; aynı kişiyle ikinci seferde daha az sürpriz | Özel kalem ön eleme (“firma stat turu ve loca da isteyecek”), tecrübeli personel |
| Karşı tarafın sabrı | Söylediyse tarih, söylemediyse “belirsiz” | Kişinin güvenilirliği (menajer “bir hafta” der, üç gün sabreder; oyun bunu kişinin geçmişine yazar) | İlişki: tanıdık karşı taraf daha açık konuşur |

Yani **bilgi iki yerden gelir: insanlardan ve tecrübeden.** İlk sezonda her şey belirsizdir, oyuncu insanları tanıdıkça tahminler daralır; bu, “tanıştığın insanlar ve önceki görüşmelerin etkisi” isteğinin mekanik karşılığıdır. İyi özel kalem ve iyi müdür belirsizliği azaltır: personel kalitesi yalnız sonuçta değil, **ne kadar görebildiğinde** fark yapar.

### 7.3 Gün bitmez, gece pahalıdır

- Katı gün sonu yok. İlerle sıradaki durağa gider; bugün durak kalmadıysa sabaha gider (gece dünya çalışır, sabah reveal). Ama durak varken **gece de çalışılabilir:** canlı bir pazarlık, dönemin son gecesi, kriz. Gece çalışmanın bedeli üç yerden gelir:
  1. **Ulaşılabilirlik:** mesai dışı mesaj sabah okunur; aramak bazılarını kızdırır (hoca, müdür), bazılarını sevindirir (menajer gece yaşar), bazısı hiç açmaz (federasyon). Kişiye göre, kişinin gündemine ve tutumuna göre.
  2. **Ertesi sabah:** gece 01:00'e kadar çalışan başkanın sabahı 10:00'da başlar — gazete ve kapının sabah saati kaçar, özel kalemin brifingi geç gelir. Yorgunluk sayısı yok (karar: çubuk yok); yalnız kayan sabah ve odanın hâli (karanlık, lamba, boş çay bardakları — görsel turda).
  3. **Aile/ev:** ev modu havuzda; şimdilik gece çalışmak yalnız kulüp içi bedel taşır.
- **Gece yarısı operasyonu** böylece mümkün ve nadir: dönem kapanış gecesi menajerle 23:40'ta son teklif, kriz gecesi kaptanla telefon. Doğal yerinde olur, kota yok (anlık kart kuralıyla uyumlu).

### 7.4 Kesinti: sahnedeyken dünya kapıyı çalar

- Bir sahnedeyken telefon çalabilir ya da kapı vurulabilir (anlık kart, “nadir ve doğal yerinde” kuralıyla; dönemde ve kriz günlerinde daha sık). İki cevap: **bak** (sahne durur; karşı taraf bekler, sabrı işler, bazısı bunu saygısızlık sayar) ya da **bakma** (arayan mesaj bırakır ya da bırakmaz; fırsatsa kaçabilir; sonra Haberler'de “saat 15:12'de Şakir aradı, ulaşamadı”).
- Bu, “bir işi kendin hallederken diğerinin de hallolmaması” durumunun ana motorudur: sponsorun ofisindeyken müdür transferin imzası için onay ister (yetki eşiğini aşan rakam); açmazsan müdür bekler, karşı kulüp başka alıcıya döner → **ikisi de olmadı** (sponsor da senin dalgınlığını gördü). Kalıcı yetki verseydin (K5) müdür kendi kapatırdı → **ikisi de oldu**. Doğru delegasyon = doğru kişi + doğru yetki + doğru zamanlama; üçü de oyuncunun elindedir, hiçbiri garanti değildir.

### 7.5 Zorluk nereden gelir (kolay oyun istemiyorum)

1. **Kıtlık:** gün, personel yükü, para; hepsi görünür ama tam dolmaz.
2. **Belirsizlik:** süre, bedel, ardı, sabır aralıkla gelir; kesinlik tecrübe ve iyi personelle alınır.
3. **Hafıza:** her kişi her teması hatırlar; gece araması, kaçırılan randevu, tutulan söz sonraki sahnede karta döner (kartın sorusu değişir).
4. **Eşzamanlılık:** iki sahne aynı anda olmaz; dünya iki dosyayı aynı öğleden sonraya düşürmekten çekinmez.
5. **Tersine çevrilemezlik:** kaçan fırsat gazetede okunur; kopan pazarlık o kişiyle bir sonraki sezona kadar kapalı.
6. **Kademeyle büyüme:** 3. Lig'de üç kişi ve haftada iki dosya; 1. Lig'de on kişi, kurul, federasyon, basın, haftada sekiz dosya. Zorluk ayarı yok, zorluk takvimden ve kademeden gelir (mevcut karar).

### 7.6 Keyif ve bağımlılık nereden gelir

- **Sabah reveal'ı:** gece dünya çalıştı; gazete, Haberler ve odanın hâli “ne oldu?” sorusunu her sabah yeniler (Papers, Please ve This Is the Police'in günü).
- **Bekleyiş gerilimi:** “cevap Perşembe” yazısı; Perşembe sabahı Haberler'i açmak. Cevabı bilmemek bağlar, bilmek rahatlatır; ikisi de ödül.
- **İnsanları çözmek:** menajerin yalan sabrı, hocanın uzun görüşmeleri, federasyon yetkilisinin Ankara'da yumuşaması; tecrübe tahmine dönüşür. Bu, FM'in “atribüt” hazzının bizdeki karşılığıdır: sayı yok, kişi var.
- **Set-piece geceler:** dönem kapanışı, genel kurul arifesi, kriz gecesi; oyun bunları seyrek tutar ki her biri hatırlansın.
- **Delegasyonun kumarı:** devretmek rahatlatır ve risk alır; sonucu birkaç gün sonra öğrenmek, vasatlığı gazetede okumak, iyi personeli bulunca “artık bunu o yapsın” rahatlığı.
- **Tek kart hep iki cevap:** konuşma uzar ama her an tek karar; FM'in onlarca seçeneği yok (kullanıcı kesin kararı). Zincirin uzunluğu belirsiz olduğu için her kart “bu son mu?” gerilimi taşır.

### 7.7 Pano konseptine ek dokunuşlar (§4'ün üstüne)

10. Düğmelerde bedel **aralık ve kaynakla** (“Çağır · ~40–70 dk · Şükrü Hoca'nın geçmişinden”).
11. Kişi sayfalarında (Kulüp › İlişkiler, Telefon) **“tanıdığın kadarı”:** görüşme süreleri, sabır gözlemi, ulaşılabilir saatleri — olgu olarak (“gece aramasına iki kez cevap verdi”), tutum olarak değil.
12. Şeritteki saat sahnedeyken döner; sahne dışında durur; gece saatlerinde tarih kutusu koyulaşır (“gece · ertesi sabah 10:00”).
13. Anlık kart sahnenin üstünde köşeden gelir (arayan kişinin yüzü, iki cevap); sahne kartı arkada bekler.
14. Haberler'de kaçanlar ayrı satır sınıfı (“ulaşılamadı”, “cevapsız kaldı”) — kaçanı görmek de bilgidir.

### 7.8 Modelin kesin kararlarla uyumu

Okuma bedava (2026-09-30) korunur. Zorunlu iş yapılmadan gün bitmez korunur (gece çalışmak bunu çiğnemez, tersine olanak verir). Anlık kart nadir ve doğal yerinde korunur; dönem ve kriz “doğal yer”dir. Kart sınıfı × bekleme tablosu korunur; sahne saati onun üstüne gelir. Tutum sayı değil korunur; yorgunluk da sayı değildir (kayan sabah). Y3'ün gün ritmi (08:00 gazete, 10–12 antrenman, 12–14 kapı, 14–18 telefon ve dosya, akşam davet) korunur; gece ona eklenir. Değişen tek şey: §6'daki “gün 20:00'de biter” cümlesi “normal gün 20:00'de biter, gece bedelle sürer” olur.

### 7.9 Sorular (ikinci tur)

11. **Sahne saati kartla aksın** (sabit hız yok, süre zincirden çıkar) — kabul mü? Alternatif: sahne girişinde süre çekilir (gizli), kartlar onu doldurur.
12. **Gece modeli:** kayan sabah + ulaşılabilirlik; yorgunluk sayısı yok. Kabul mü? (Ev modu havuzda kalır.)
13. **Kesinti:** sahnedeyken anlık kart (bak / bakma); dönemde ve krizde sıklaşır. Kabul mü?
14. **Telefon araması** mesajdan ayrı canlı sahne olarak girsin mi (açmama, geri arama)? Tercihim evet; telefon ekranında “Ara” ve “Mesaj yaz” ikisi de olur.
15. **Tahminlerin kaynağı:** özel kalem (bugün adsız TEST kişi) tahmin ve ön eleme yapan gerçek personel olsun mu; kalitesi tahmin doğruluğunu belirlesin mi? Tercihim evet — ilk kademede bile anlamlı bir personel kararı doğar.

Cevaplar gelince: K1–K7 ve model C OYUN_TASARIMI'na (§2 beş fiil ve kademeler, §6 sahne saati, gece, kesinti ve dosya saatleri, §7 kalıcı yetki ve personel yükü, §10 kurumlar, İlişkiler ve öğrenilen tahmin), önizlemeye §4 ve §7.7'nin on dört maddesi, sonra uygulama planı.
