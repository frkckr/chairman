# Chairman — stil rehberi

Oyunun görünüşünü belirleyen kurallar. Sayısal değerlerin hepsi `js/stil-99.js` dosyasında durur; bu rehber o değerlerin ne anlama geldiğini ve neden seçildiğini anlatır.

## 1. Ekran
- 4:3 ekran. İç çözünürlük 640×480 (PS1'in yüksek çözünürlük modu). 400×300'de maç dürbünsüz izlenemiyordu; bu çözünürlükte oyuncular ve reklam yazıları normal bakışta da seçilir.
- Büyütülürken pikseller yumuşatılmaz (en yakın komşu).
- Maç başkanın gözünden görülür; bu yüzden TV kasası, tarama çizgisi ya da kavisli köşe yoktur. '99 görünümü (piksel, renk titremesi, köşe titremesi) sabittir, arayüzden kapatılmaz.

## 2. Renk
- Kanal başına 5 bit (15 bit renk) ve 4×4 düzenli titreme (Bayer). Dönemin ekran kartları gibi. Titreme deseni ekrana sabittir ve şiddeti %70'tir (`titremeGucu`).
- Işık hesabı renk yönetimi olmadan yapılır; köşe başına aydınlatma kullanılır (Lambert/Gouraud).
- Gece maçı paleti: sıcak projektör sarısı, gece laciverti, sis.

| Ad | Değer |
|---|---|
| Demirkapı kırmızısı | `#c8281e` |
| Demirkapı beyazı | `#f2ede2` |
| Çim koyu / açık | `#2f7a2a` / `#3a8c33` |
| Saha çizgisi | `#f2f2ea` |
| Atletizm pisti | `#8c3f2f` |
| Sis | `#0c1322` |
| Meşale | `#ff4a1e` |
| Tabela amberi | `#ffb530` |
| Akdeniz FK beyazı / laciverti | `#eef0f3` / `#22347a` |

## 3. Geometri
- Az poligon. Oyuncu gövdesi kutulardan oluşur; top 20 yüzlü.
- Köşeler ekran piksellerine yapışmaz: PS1 köşe titremesi hareketi piksel piksel zıplattığı için kapalıdır (`koseTitremesi:false`). Görünüm retro, hareket pürüzsüzdür.

## 4. Dokular
- 8 ile 64 piksel arası. Hepsi kodla üretilir.
- Oyuncu ve bayrak dokularında yumuşatma yoktur. Seyirci, reklam panosu ve çimde uzakta titreşmeyi önlemek için mipmap kullanılır.

## 5. Oyuncular
- Her oyuncunun kendine ait görünümü vardır: boy 0,9–1,1, yapı 0,93–1,12 ölçek.
- Saç stilleri: kısa, kel, uzun, mullet, kıvırcık. Bıyık ve sakal. Krampon rengi. Sıyrık çorap. Kalecide uzun kol ve eldiven.
- Numara sırtta büyük (2 kat piksel yazı, koyu kenarlı), göğüste küçük.
- Pozlar: koşu; pas ve şut (hazırlık, geri salınım, temas, takip); ilk dokunuş, göğüs kontrolü, kafa; ayakta ve kayarak müdahale, blok; düşüş, yerde yatma, kalkma; taç; itiraz; sevinç; esneme, tokalaşma, fotoğrafta ayakta ve çömelmiş duruş, kenetlenme, alkış, maç sonunda yorgunluk (eller dizde); kaleci uçuşu, yumruklama, topu tutuş, elle atış ve degaj; marşta el göğüste, oturuş (yedekler), bekleme. Hakem işaretleri (düdük, yön, avantaj, kart, penaltı), yan hakem bayrağı ve dördüncü hakemin tabelası da pozdur. Yeni hareketler aynı poz sistemine (`POSE`) eklenir.
- Gövde motorun gerçek bakış yönüne döner; oyuncu vuruştan önce hedefe döner. Sol ayaklı oyuncuların vuruş pozları aynalanır: vuran bacak gerçekten sol bacaktır.
- Hareket pürüzsüzdür: koşu hıza bağlı sürekli bir dalgayla döner, pozlar birbirine yumuşakça karışır, dönüşler yavaşça yapılır. Motor sabit adımla ilerler, çizim adımlar arasında ara değer alır.
- Yedekler takım renginde eşofmanla, teknik direktör takım elbiseyle görünür. Oyuna giren yedeğin eşofmanı çıkar, forması görünür.
- Top toplayıcı çocuklar sarı forma, lacivert şort ve eşofman altı giyer; boyları yetişkinlerin ~3/4'üdür. Sahanın çevresinde 12 çocuk elinde yedek topla bekler (çoklu top sistemi). Dışarı çıkan top yuvarlanıp panoda durur, bir çocuk onu toplar.
- Dördüncü hakemin tabelası kırmızı ve yeşil ışıklı sayılar gösterir: uzatmada dakika, değişiklikte çıkan (kırmızı) ve giren (yeşil) numara.
- Saha kenarı: kaleci antrenörü ve kondisyoner takımın koyu eşofmanıyla; fotoğrafçılar turuncu yelekli, ellerinde siyah fotoğraf makinesi. Fotoğrafçılar maç boyunca kale arkalarında çömelir; takım fotoğrafında flaşları bir an parlar.
- Isınmada turuncu koniler ve antrenman topları sahada görünür; driller bitince toplanır.

## 6. Işık ve gölge
- Gece maçında her projektör için bir gölge (90'ların dörtlü gölgesi; FIFA 98'in gece maçlarındaki gibi). Gölge, oyuncunun kemiklerine bağlı kutuların ışıktan zemine izdüşümüdür: gerçek silüettir, bacak ve kollarla oynar, ışıktan uzaklaştıkça uzar (`js/golgeler.js`).
- Aynı ışığın gölgesi bir pikseli bir kez koyulaştırır (stencil); farklı ışıkların gölgeleri üst üste binince koyulaşır. Top da gölge verir.
- Gündüz maçı için tek ve kısa gölge (henüz yapılmadı).

## 7. Stat
- Her stat bir tariftir (`js/stadyum-tarifleri.js`): tribünler, çatı, pist, tel örgü, projektörler, skor tabelası, çevre.
- Küçük stat dökük görünür: toprak pist, direkli zayıf projektörler, seyrek reklam panosu, elle değiştirilen skor tabelası, arkada ışıkları yanan apartmanlar.
- Zemin kalitesi (0–1) düştükçe çim sararır, kale ağızlarında ve sahada kel ve çamurlu alanlar çoğalır, çizgiler solar, biçme deseni silikleşir. Çok iyi zeminde çapraz biçme deseni görünür.
- Malzeme renkleri (beton, çatı, toprak pist, çamur) `STIL.stadyum` içindedir.

## 7b. Tribün ve atmosfer
- Her seyirci kutulardan kurulu küçük bir insandır: gövde, kollar, bacak, baş, saç ya da bere (kelleri de var). Boyu ve yapısı kişiden kişiye değişir. Başkana uzak olanlar daha az parçayla çizilir.
- Koltuklu tribünde oturur; beton basamakta ve toprak sette ayakta durur. Ev taraftarının bir kısmı koltukta da ayaktadır.
- Koltuklar tek tek görünür, boş koltuklar seçilir. Doluluk düşükken tribün seyrektir.
- Tribün sakin durur; birkaç kişi ara sıra hafifçe kıpırdar. Maçtaki heyecan arttıkça (giriş, santra, şut, direk, gol, maç sonu) zıplayanlar çoğalır; iki kareli zıplama (0,3 sn). Gol atan tarafın taraftarı zıplar, öbürü susar. Başkanın yakınındakiler ve başkan bölümü daha sakindir.
- Maç öncesi tribün yavaş yavaş dolar: başkan oturduğunda stat beşte bir doludur; ev taraftarı erken, deplasman taraftarı topluca, locadakiler geç gelir, birkaç kişi son dakikada yetişir. İstiklal Marşı'nda tribün ayağa kalkar; golde gol atan tarafın oturanları da kalkar.
- Paletler (üst giysi): ev sahibi, karışık, deplasman, başkan bölümü (koyu takım elbise).
- Başkan bölümü: ana tribünün ortasında dört sıra koyu kırmızı döşemeli koltuk. Başkan ön sıradadır; önünde boş bir geçit ve metal korkuluk vardır.
- Meşale: parlak çekirdek, kırmızı hale ve yükselen duman. Tel örgü, pankart, ampullü skor tabelası, projektör parıltısı.

## 8. Arayüz
- 3×5 piksel yazı (Türkçe karakterli), tek font. Stattaki yazılar (reklam panosu, pankart, skor tabelası) bu yazıyla yazılır.
- Maç ekranında ekran üstü grafik yoktur: yayın bandı, radar ya da oyuncu etiketi gösterilmez. Tek istisna dürbün maskesidir.
- Skor ve dakika stadın skor tabelasında (ampullü ya da elle) yazar. Ekranın hemen altında, oyun görüntüsünün dışında bir radyo satırı skoru ve spikerin cümlesini gösterir.

## 8b. Menü ekranları
- Yönetim ekranları (ilki maç öncesi bülteni, `js/ekran-mac-oncesi.js`) 4:3 oyun karesinin içinde açılır; stat arkada donuk durur, koyu panel onu büyük ölçüde örter (`STIL.menu.ortu`). Zeminde hafif bir damalı titreme deseni vardır.
- Ekran tek bir sabit tasarımdır: bütün ölçüler oyun karesinin genişliğine göre büyür ve küçülür, kaydırma yoktur. Oyun fareyle oynanır; düğmeler büyük, ana eylem (İlerle) sağ altta ve tabela amberi rengindedir.
- Başlıklar piksel görünümlü `Jersey 10`, yazılar `IBM Plex Mono`. Başlık şeritleri amber, takım vurguları kulüp kırmızısı (bizim) ve lacivert (rakip). Form kutucukları: galibiyet yeşil, beraberlik gri, mağlubiyet kırmızı.
- Takım arması formanın renklerinden kurulur (forma rengi, ortada yaka/şerit rengi). Olası 11 küçük bir sahada gösterilir: forma renginde numaralı daire, altında isim; kaptan "K", kart sınırındaki oyuncu küçük sarı kartla işaretlidir.
- Renkler `STIL.menu`'dedir; ekran bunları CSS değişkeni olarak sayfaya yazar.

## 9. Kameralar
- Tek açı başkanın gözüdür: açık ana tribünün ortasındaki başkan koltuğunda, göz hizası. Dürbün isteğe bağlı yakınlaştırmadır. Konumlar stil dosyasındadır.
- Başkanın bedeni ekranın altında her zaman görünür (ön plan katmanı, `js/baskan.js`): ceviz masa, lacivert takım elbise kolları, sol bilekte saat, ince belli bardakta çay, maç programı, telefon. Eller maça tepki verir (gol sevinci ve ayağa kalkma, yenilen golde eller başa, masaya yumruk, itiraz, alkış); dürbün elle kaldırılır.
- Bakış topu ve olan biteni yumuşak bir yayla izler: tünelden çıkışta tünele, törende oyuncu sırasına, yazı turada orta noktaya, golde gol atana bakar. Bakış belli bir açıdan fazla aşağı inmez.
- Maç öncesinde bakış ilgi çeken yerler arasında gezer: önce dolan karşı tribün, sonra kaleciler, hakemler, takımların drilleri; yeni bir şey olunca (takım çıktı, yedekler kulübeye geçti) oraya döner. Tokalaşmada el sıkışanları, fotoğrafta iki takımın fotoğrafını sırayla izler. Devre arasında şut çalışan yedeklere, maç sonunda taraftarını alkışlayan takıma bakar.

## 10. Sınırlar
- Gerçek kulüp, marka ya da logo kullanılmaz.
- Fotoğraf gerçekliğinde doku kullanılmaz.
- Ekran oranı 4:3 dışına çıkmaz.
