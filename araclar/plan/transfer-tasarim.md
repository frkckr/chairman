# Transfer — oyunun ana sistemlerinden biri (tasarım önerisi)

Durum: **R4 planıyla onaylandı (kullanıcı, 2026-10-29: “Onayla, başla”); R4 kapanışında onaylı kısımlar ana belgelere taşınır.** Kaynak: kullanıcının isteği (2026-10-29, R4 planına cevap): “transfer sıradan bir dosya olmasın, ayrı bir sekme olsun; dedikodular, transfer çalımları, rakibin oyuncusunu almak, bedava ama uzun zamandır boşta düşüşteki yıldız, transfer ilerlerken birden rakibe gitmek, anlaşamamak, sakat çıkmak…; 1. Lig'de yurt dışına gitmek, uçak, otel; her lig kademesi için ayrı mekânlar ve ortamlar; çok senaryo üreteceğiz, altyapı çok şeye elverişli olsun.” Bu belge Claude'un önerisiyle genişletilmiş tasarımdır. Onaylanan kısımlar sonra ana belgelere dağılır: oyun kuralları [OYUN_TASARIMI §8](../../OYUN_TASARIMI.md#transfer-ve-sponsor-görüşmeleri), senaryo ve olay fikirleri [OLAY_KUTUPHANESI](../../OLAY_KUTUPHANESI.md) (karar 58: senaryo çalışmasının tek ana dosyası), teknik sözleşme [TEKNIK_PLAN §6](../../TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi). Uygulama sırası §11'de ve [r4-uygulama.md](r4-uygulama.md)'de.

## 1. Neden ayrı bir sistem

Transfer, başkanın en çok seçim yaptığı, en çok hikâyenin doğduğu ve oyunun ilkelerinin birleştiği yerdir:

- **Kıtlık (ilke 3):** para (bonservis, maaş), zaman (dönem kapanıyor), dikkat (aynı anda birkaç peşinde koşmak) aynı anda daralır.
- **Futbolla bağ (ilke 7):** gelen oyuncu sahada görülür; hata ya da isabet Canlı Skor'da, maçta, hocanın sözünde okunur. Gizli puan açılmaz, karşılık sahadan gelir.
- **Kararın izi (ilke 2, oynama sorusu 2):** kaçırılan oyuncunun rakipte parlaması, bedava bulunan cevher, pahalı hata, kırılan ilişki yıllarca hatırlanır.
- **Merak (ilke 1, 6):** piyasayı tanımak, söylentinin peşine düşmek, bir oyuncu hakkında bilgiyi parça parça toplamak.

Hedeflenen duygular: av (birinin peşine düşmek), pazarlığın gerilimi, son gün heyecanı, kaçırmanın acısı, bulunmuş cevherin sevinci, “daha iyisi olabilirdi” sezgisi, bir menajere ya da başkana karşı biriken güven ya da kin.

## 2. Transfer masası: kendi alanı

Transfer sıradan bir dosya olarak kalmaz; masada **Transfer** adlı kendi nesnesi olur (şerit: Telefon · Ajanda · Dosya · Gazete · **Transfer**; tuş 6). Aynı odak kabında açılır. Kararlar yine tek karttır (odak modeli); masa göz atma ve girişim yeridir.

**Odadaki karşılığı (öneri):** duvarda mantar pano. Üstünde iğneyle tutturulmuş oyuncu kartları, ipler, notlar ve dönem takvimi. Görsel tur gelene kadar (karar 49) kâğıt düzende açılır; panonun 3B çizimi o tura kalır.

**Bölümler:**

| Bölüm | İçerik |
|---|---|
| Pano | Dönem sayacı (“Kış dönemi · 12 gün kaldı”, son gün kırmızı), bütçe (bonservis kalan, maaş tavanı, kasa), ihtiyaçlar (hocanın ve başkanın, hat hat), açık işler (her transfer tek satır: oyuncu, karşı taraf, aşama, sıradaki an), gelen teklifler |
| Takip listesi | Başkanın, hocanın ve (varsa) gözlemcinin izlediği oyuncular; her birinde bildiklerimiz ve kaynakları (söylenti, sayılar, hocanın görüşü, rapor, yüz yüze izlenim, sağlık) |
| Piyasa | Bildiğimiz kadarı: serbest oyuncular (ne zamandır boşta), sözleşmesi bitecekler, satılık söylentisi olanlar, kiralık verilebilecek gençler. Bilgi tanışıldıkça büyür; her satır kaynaklı ve tarihlidir |
| Kadromuz | Satış gözüyle: kime ilgi var, kimin sözleşmesi bitiyor, kim mutsuz (Dosya'nın Kadro sekmesiyle bağlı) |
| Geçmiş | Bu ve önceki dönemler: gelenler, gidenler, kaçanlar, bedeller; kaçanın sonraki hayatı (rakipte kaç gol attı) |

**Başkanın fiilleri** (OYUN_TASARIMI §2'nin beş fiili transfer diliyle): **araştır** (hocaya, gözlemciye iş ver), **takibe al**, **ara** (menajeri, satan kulübün başkanını), **görüşmeye git** (mekân, §6), **teklif hazırlat** (ekip iki rakam getirir), **bırak** (devret). Başkan listeden “satın al” düğmesine basmaz; her adım bir kişiye iş vermektir, böylece ekibin kalitesi hep devrededir.

## 3. Giriş kapıları: bir transfer nasıl başlar

| Kapı | Örnek | En erken kademe |
|---|---|---|
| Hocanın isteği | “Sol beke oyuncu lazım” (bugün çalışıyor) | 3. Lig |
| Başkanın girişimi | Hat için iş verir ya da takipteki bir oyuncu için harekete geçer | 3. Lig |
| Serbest oyuncu | Sözleşmesi feshedilmiş, aylardır boşta; **düşüşteki eski yıldız**: bedava ama yaşlı, formsuz, maaşı yüksek, adı taraftarı coşturur | 3. Lig |
| Amatör ve bölge | Amatör ligde parlayan genç, komşu ilçenin golcüsü (hoca ya da yerel tanıdık haber verir) | 3. Lig |
| Kiralık | Büyük kulübün forma bulamayan genci; satın alma opsiyonu | 2. Lig |
| Menajer önerisi | Menajer arar, oyuncu önerir; bazen “paket” (iyisinin yanında işe yaramazı), bazen blöf | 2. Lig |
| Söylenti ve gazete | “X kulübü nakit sıkıntısında, oyuncularını satacak”, “Y mutsuz, ayrılmak istiyor” | 3. Lig |
| Rakibin oyuncusu | Rakip kulübün yıldızını almak: hem güçlenmek hem rakibi zayıflatmak; rakip başkanla ilişki, taraftar tepkisi | 3. Lig |
| Ön anlaşma | Sözleşmesi bitecek oyuncuyla dönem dışında bonservissiz anlaşma | 2. Lig |
| Yurt dışı | Gözlem gezisi, yabancı kontenjanı, tercüman, uyum | 1. Lig |
| Takas | Oyuncu + para | 2. Lig |
| Satış tarafı | Gelen teklif (bugün çalışıyor), oyuncu gitmek ister, mali baskıyla satış (P07), son gün paniği | 3. Lig |

## 4. Kıvrımlar: süreç ilerlerken olabilecekler

Kıvrım, bir transferin aşamasına takılan olaydır: **ne zaman** (aşama ve koşul), **neden** (dünyadaki gerçek durum: rakip ilgisi, kasa, oyuncunun isteği, kişinin gündemi), **ne olur** (yeni kart, haber, fiyat değişimi, kayıp, yeni dosya). Kıvrımlar senaryo yazarının ana malzemesidir; sistem onları bir kayıt defterinden okur (§10).

| Aşama | Kıvrım örnekleri |
|---|---|
| Araştırma | Hocanın gözü bir başkasına kayar; rapor çelişir (hoca “ağır” der, sayılar iyi); söylenti yanlış çıkar; bulunan oyuncu aslında başka mevkide parlıyor |
| Temas | Oyuncu “3. Lig'e gelmem” der; ailesi şehri istemez; eski kulübünden alacağı var; menajer başka teklif olduğunu söyler (doğru ya da blöf) |
| Kulüp pazarlığı | Satan başkan son anda bedeli artırır; rakip kulüp araya girer ve teklifi yükseltir; satan kulübün kasası boşalır, birden ucuzlar; taksit ya da sonraki satıştan pay ister |
| Oyuncu pazarlığı | Maaşta anlaşılamaz; imza parası ister; oynama garantisi ister; hocayla konuşmak ister |
| Sağlık | Menisküs, eski sakatlığın izi: riski al, indirim iste ya da vazgeç |
| İmza ve tescil | Basına sızıntı (fiyat artar ya da taraftar coşar); belge gecikir ve oyuncu dönemin son saatine kalır (OLAY_KUTUPHANESI'ndeki tescil örneği); oyuncu imza gününde rakibe imza atar |
| Sonrası | Hoca başkanın getirdiği oyuncuyu oynatmaz; oyuncu formsuz gelir ya da patlar; kaçırılan oyuncu rakipte parlar ve gazete hatırlatır; menajer bir sonraki dönemde kin ya da kolaylık getirir |

Her kıvrımın olağan, olumlu ve zor yolu olabilir; kıvrım kotası yoktur, çoğu transfer sorunsuz ilerler. Sonradan öğrenilen bilgi gerçek nedene dayanır (ilke 6).

## 5. Taraflar

- **Oyuncu:** istekleri (maaş, süre, oynama süresi, şehir, lig seviyesi, aile) ve gizli tutumu; ünü ve geçmişi (eski kulüpleri, en iyi yılı) — “düşüşteki yıldız” buradan doğar.
- **Menajer:** kişi; gündemi, güvenilirliği (gizli) ve hafızası; aynı menajer birçok oyuncunun kapısıdır, ilişki taşınır.
- **Satan kulübün başkanı:** kişi; kulübünün kasası ve tablodaki yeri; bizimle ilişkisi (rakip mi, dost mu).
- **Hoca:** ihtiyaç, görüş, itiraz; başkanın getirdiği oyuncuya tavrı.
- **Ekip:** mali işler müdürü (pazarlık), gözlemci ve sportif direktör (kademe büyüdükçe), doktor (sağlık raporunun isabeti).
- **Kamuoyu:** gazete, taraftar (isim beklentisi, rakipten alımın sevinci, yıldız satışının öfkesi).

Kişi modeli (gündem, hafıza, tutum; R6) transferin ilk büyük kullanıcısıdır. Transfer onu beklemeden başlar, kişiler geldikçe derinleşir.

## 6. Mekânlar ve ortamlar

Görüşme, gözlem ve sağlık kontrolü bir yerde olur. Mekân yalnız görüntü değildir; üç şey taşır: **zaman** (yolculuk oyun zamanında geçer; başkan ofiste değilken masadaki işler bekler, telefon çalar — dikkat kıtlığı), **etki** (yüz yüze görüşme ikna eder; telefon ucuzdur ama zayıftır) ve **masraf** (yol, otel, yemek kasadan).

| Kademe | Görüşme | Gözlem | Sağlık | Yolculuk |
|---|---|---|---|---|
| 3. Lig | Başkanın odası, kulüp lokali, çay bahçesi, rakip kulübün mütevazı ofisi | Amatör maç tribünü, komşu ilçe | İlçe devlet hastanesi | Başkanın arabası; birkaç saat |
| 2. Lig | Şehir otelinin lobisi, menajerin ofisi (Ankara, İzmir, İstanbul) | Bölge maçları | Anlaşmalı özel klinik | Otobüs ya da yurt içi uçak; yarım gün–bir gün |
| 1. Lig | İstanbul'da akşam yemeği, kamp oteli, havaalanında karşılama | Yurt dışı gözlem gezisi: uçak, otel, yabancı stat, tercüman | Özel hastane | Yurt dışı; iki–dört gün |
| Avrupa | Yabancı kulüp ofisi, imza töreni ve basın toplantısı | Avrupa maçları | Kulübün sağlık merkezi | Özel uçak |

Mekân bir kayıt defterinde veridir (ad, kademe, süre, masraf, etki, sahne anahtarı). **Bugün metin ve süre olarak çalışır;** uçak penceresi, otel lobisi, hastane koridoru gibi sahneler görsel turda çizilir (karar 49). Yeni 3B sahne şimdi yapılmaz; yapı sahneye hazırdır.

## 7. Lig kademesine göre transfer dünyası

| | 3. Lig | 2. Lig | 1. Lig | Avrupa |
|---|---|---|---|---|
| Bütçe | Küçük; bonservis nadir | Küçük bonservisler | Büyük paralar, taksit | Çok büyük |
| Kaynaklar | Serbestler, amatörler, büyük kulüplerden kiralık genç, rakipler | + menajerler, ön anlaşma | + yabancılar, menajer ağları | + uluslararası piyasa |
| Kurallar (TEST) | Yabancı yok | Yabancı yok | Yabancı kontenjanı | — |
| Ekip | Hoca kendi bakar | İlk gözlemci | Gözlemci ağı, sportif direktör | Büyük yapı |
| Tipik kıvrımlar | “3. Lig'e gelmem”, aile, devlet hastanesinde sağlık | Menajer blöfü, rakip araya girer | Yurt dışı, tercüman, uyum, basın | Medya, rekabet |

## 8. Bilgi ve belirsizlik

Bir oyuncu hakkındaki bilgi kat kat birikir: söylenti → kayıttaki sayılar → hocanın izlemesi → gözlemci raporu → yüz yüze izlenim → sağlık raporu. Her kat zaman, para ya da dikkat ister; isabeti kaynağın gizli yeteneğine bağlıdır. Gizli puan hiçbir zaman açılmaz; doğruluk sahada sonradan görülür. Az araştırmayla hızlı imza da makul bir yoldur, bedeli belirsizliktir.

## 9. Zaman ve takvim

- Yaz dönemi (Haziran–Ağustos) ve kış dönemi (Ocak). Dönem dışında araştırma, takip ve ön anlaşma; serbest oyuncunun dönem dışında kaydı TEST kural.
- **Son gün:** dönemin son günü saat saat ilerler; zaman sahnesi geri sayar, kararların ömrü saatlere iner.
- Dönem kapanınca açık transferler kaybolur ya da sonraki döneme “ön anlaşma” olarak kalır.

## 10. Altyapı: senaryolara elverişli olmak için ne gerekir

1. **Transfer dosyası = şablon** (durum makinesi): aşamalar (kart, bekleme, devir) ve kapıya göre çeşitler; dosya süreç kaydıdır (karar 60/7).
2. **Kıvrım kayıt defteri** (`TRANSFER_KIVRIMLARI`): `{ad, asamalar, kosul(k, dosya), olasilik(k, dosya), uygula(k, dosya)}` ve metin anahtarları. Yeni senaryo = yeni kayıt; motor değişmez. Senaryo yazarının ana aracı.
3. **Çok kalemli pazarlık:** bonservis, maaş, süre, taksit, sonraki satıştan pay, imza parası, kiralık opsiyonu; kalemler sırayla açılır, her kart iki yüz.
4. **Piyasa okumaları (saf):** satılık, serbest (ne zamandır), düşüşte, sözleşmesi bitiyor, kiralık uygun, rakip ilgisi.
5. **Oyuncunun geçmişi ve ünü** (TEST üretim: eski kulüpleri, en iyi yılı): düşüşteki yıldız, eski kulübe dönüş, tanınmış isim.
6. **Takip listesi ve kaynaklı oyuncu notları** (bugünkü oyuncu dosyası notları öbür kulüplerin oyuncularına uzar).
7. **Mekân kayıt defteri ve yolculuk komutu** (zaman, masraf, ofisten uzaklık).
8. **Dünyada dar transfer:** bir kıvrımın sonucu olarak oyuncu başka kulübe geçebilir (rakibe imza attı); kulüpler arası tam piyasa sonra.
9. **Tescil ve kurallar:** dönem, kontenjan, belge gecikmesi.
10. **Transfer masası ekranı** (§2).
11. **Haber kancaları:** söylenti (gazete, telefon), sızıntı, imza haberi, kaçanın parlaması.
12. **Ölçü ve deneme politikaları** (`sezon-deneme` transfer kararları, oynama ölçüsü).

## 11. Aşamalandırma önerisi

| Ne zaman | Kapsam |
|---|---|
| **R4 — transfer çekirdeği, masası ve çeşitleri** (tek tur, kullanıcı kararı; tek sezon, 3. Lig, kış dönemi) | Şablon motoru, kıvrım defteri ve süreç kaydı; Transfer masası (Pano, Takip, Piyasa, Geçmiş); kapılar: hocanın isteği, başkanın girişimi, serbest oyuncu ve düşüşteki eski yıldız; zincir: ihtiyaç → araştırma → aday → yürütme (kendim / devret) → kulüp pazarlığı → oyuncu pazarlığı (maaş, süre, istekler) → sağlık → imza, alternatif; dünyada dar transfer (oyuncu rakibe gider); 3. Lig mekânları, “Yanına git” ve “İzlemeye git”; TEST kıvrımlar (rakip araya girer, bedel artırma, sağlık, anlaşamamak, hocanın itirazı, sızıntı, son gün, tescil gecikmesi, rakibin oyuncusu); oynama ölçüsü; sonunda kullanıcının oynama denemesi. Plan [r4-uygulama.md](r4-uygulama.md) |
| R6 (kişi modeliyle) | Menajer ve satan kulübün başkanı kişi olarak (gündem, güvenilirlik, hafıza); söylenti kanalı; rakibin oyuncusu; satış şablonu (P07); taksit ve pay |
| H3 (yeni sezon) | Yaz dönemi, kulüpler arası tam piyasa, ön anlaşma, sözleşmesi bitenler |
| Lig atlayınca (Aşama 8) ve görsel tur | 2. Lig ve 1. Lig kademeleri, yurt dışı gezisi, yabancı kontenjanı, kiralık; mekân sahneleri (uçak, otel, hastane) |

Senaryo metinleri ve kıvrımların içeriği kullanıcınındır; Claude altyapıyı ve onu sınayan az sayıda TEST örneğini yazar (karar 35 kipi).

## 12. Kullanıcının cevapları (2026-10-29) ve açık kalan

1. Transfer masasının odadaki karşılığı: **duvarda mantar pano** (3B çizimi görsel turda).
2. R4: **tek büyük tur** (çekirdek, masa ve çeşitler birlikte).
3. Kıvrımla oyuncunun başka kulübe gitmesi (dünyada dar transfer): **evet**.
4. Görüşmeye gitmek: **oyun zamanı alır, başkan ofisten uzak kalır** (3. Lig'de saatler, 1. Lig'de günler).
5. *Açık:* serbest oyuncu dönem dışında kaydedilebilsin mi? R4'te TEST kural olarak evet (sakin dönemde de transfer masasının işe yaraması için); kullanıcı değiştirebilir.
