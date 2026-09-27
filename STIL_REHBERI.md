# Demirkapı '99 — stil rehberi

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
- Pozlar: şut, koşu (iki kare), kayarak müdahale, kaleci uçuşu, bekleme. Yeni hareketler aynı poz sistemine eklenir.

## 6. Işık ve gölge
- Gece maçında her projektör için bir soluk, uzun gölge (90'ların dörtlü gölgesi).
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
- Paletler (üst giysi): ev sahibi, karışık, deplasman, başkan bölümü (koyu takım elbise).
- Başkan bölümü: ana tribünün ortasında dört sıra koyu kırmızı döşemeli koltuk. Başkan ön sıradadır; önünde boş bir geçit ve metal korkuluk vardır.
- Meşale: parlak çekirdek, kırmızı hale ve yükselen duman. Tel örgü, pankart, ampullü skor tabelası, projektör parıltısı.

## 8. Arayüz
- 3×5 piksel yazı (Türkçe karakterli), tek font. Stattaki yazılar (reklam panosu, pankart, skor tabelası) bu yazıyla yazılır.
- Maç ekranında ekran üstü grafik yoktur: yayın bandı, radar ya da oyuncu etiketi gösterilmez. Tek istisna dürbün maskesidir.

## 9. Kameralar
- Tek açı başkanın gözüdür: açık ana tribünün ortasındaki başkan koltuğunda, göz hizası. Dürbün isteğe bağlı yakınlaştırmadır. Konumlar stil dosyasındadır.

## 10. Sınırlar
- Gerçek kulüp, marka ya da logo kullanılmaz.
- Fotoğraf gerçekliğinde doku kullanılmaz.
- Ekran oranı 4:3 dışına çıkmaz.
