# R4 — Transfer: çekirdek, masa, çeşitler ve ilk oynama denemesi (uygulama planı)

Durum: **uygulandı ve kapandı (2026-10-29 gece, `tur/r4-transfer`); onaylandı (kullanıcı, 2026-10-29: “Onayla, başla”); uygulama Opus 5.5, masaüstü.** Dal `claude/r4-transfer` (taban `claude/r3-canli-skor` 9cba63a; karar 63: sonraki tur önceki turun dalından), etiket `tur/r4-transfer`. `main`'e R3 ile birlikte, büyük kapıdan sonra ve kullanıcının sözüyle.

Kaynaklar: R programı (karar 56; [r1-uygulama.md](r1-uygulama.md) §0); ilkelerin uygulama yönü (karar 60); kullanıcının isteği (2026-10-29): transfer oyunun en temel özelliklerinden biri, sıradan dosya değil, ayrı alan, çok çeşitli olay, kademelere göre mekânlar, senaryolara elverişli altyapı. Tasarım önerisi [transfer-tasarim.md](transfer-tasarim.md) (bu planın dayanağı). Kullanıcının cevapları (2026-10-29): odadaki karşılığı **duvarda mantar pano**; R4 **tek büyük tur**; transfer ilerlerken **oyuncu gerçekten rakibe gidebilir** (yalnız kıvrımla); **görüşmeye gitmek oyun zamanı alır**, başkan ofisten uzak kalır. Onaylı hedefler [OYUN_TASARIMI §2](../../OYUN_TASARIMI.md#dosya-şablonları), [TEKNIK_PLAN §6](../../TEKNIK_PLAN.md#hedef-dosya-şablonu-pazarlık-ve-kişi-modeli-y0-2026-10-26-y1y3); kullanıcı kararları (2026-10-26): pazarlıkta çark yok, ekip iki rakam önerir; Y1'in gövdesi ([y-program.md](y-program.md) §5), H4'ün dalları ([h4-uygulama.md](h4-uygulama.md)).

## Bugünkü durum (kodla doğrulandı, 2026-10-29)

- **Transfer (G2, `js/transfer.js`):** kış dönemi 4–31 Ocak. Hocanın isteği 5 Ocak'ta tek kart [Bütçeyi onayla / Reddet]; onayda 5 gün sonra `transferImza` oyuncuyu **kendiliğinden** seçer. Başkan aday görmez; pazarlık, kayıp ve alternatif yoktur. Gelen teklif dönemde üç kez [Sat / Reddet]. Kulüpler arası (bizim dışımızda) transfer yoktur; serbest oyuncu yalnız sözleşmesi biten ya da kadrodan çıkarılandır.
- **Dosya (mesele, `js/mesele.js`):** durum bağlı işlerden türetilir; aşama kavramı yoktur. `EKIP_GOREVLERI` boştur. Personel (TEST yardımcı antrenör, mali işler müdürü) koltuk değildir, gizli yeteneği yoktur.
- **Başkanın girişimi:** yalnız yazışma konuları (R2). Masada transferin yeri yoktur. Zaman alan cevap mevcut: cevabın `sure`'si zamanı ilerletir, kaçırılacak işler kartın yüzünde yazar (H1).
- **Takvim:** kariyer 23 Kasım'da başlar; ilk dönem Ocak'ta. Kayıt sürümü 11. Masa şeridinde 6 tuşu boştur.

## Kapsam

### R4-0 — başlangıç ölçüsü

- `node araclar/hizli.js --hepsi`, `kariyer-deneme` süresi; sezon tabanları t7 ve t3 (KAPILAR komutlarıyla) bu dalda birebir.
- İlk commit `sezon-deneme`'ye R4-j'nin sayaçlarını **davranış değişmeden** ekler; bugünkü akışın ölçüsü taban olarak plana yazılır.

### R4-a — şablon motoru, süreç kaydı ve kıvrım defteri (`js/sablon.js`; kural, katı kip)

- **Şablon** `SABLONLAR[ad] = {kategori, baslangic, asamalar: {[aşamaAdı]: aşama}}`; aşamalar adlı (dallanma), türü üç (TEKNIK_PLAN §6): **kart** (bir `KARAR_TURLERI` türü; `sinif` fırsat / pazarlık / rutin ve `omur` cevapsız davranışı seçer, sonuç kartın yüzünde önceden yazar), **bekleme** (gizli gelişme `sablonAdim`; süre belirlenimci; beklerken dünya kancası), **devir** (görevlendirilen kişi yürütür; sonuç gizli yetenekten iyi / vasat / kötü, onay kartıyla döner).
- **Süreç kaydı (karar 60/7):** şablonun durumu dosyanın kendisidir. Meseleye isteğe bağlı `sablon: {ad, asama, adim, kaynak ('baskan' | 'hoca' | …), sahip, karsi, son, veri, sonuc}`. Ayrı süreç defteri, genel hikâye motoru ya da betik yorumlayıcısı yok.
- **Koşullu uyku:** aşama `uyku: {kanca, kosul, sinir}` ile mevcut kancaya bağlanır (ay başı, maç sonucu, yeni: transfer döneminin başlangıcı); kullanım: dönem dışında açılan dosya dönem başına dek uyur.
- **Kıvrım defteri** `TRANSFER_KIVRIMLARI` ([transfer-tasarim.md](transfer-tasarim.md) §4, §10): `{ad, asamalar, kosul(k, dosya), olasilik(k, dosya), uygula(k, dosya)}` ve metin anahtarları. Aşama geçişlerinde ve beklemelerde denenir; sonuç kart, haber, fiyat değişimi, kayıp, yeni dosya ya da dünyada dar transfer. **Yeni senaryo = yeni kayıt; motor değişmez.** Bütün çekimler belirlenimci (`kadroRastgele(dünyaTohumu, anahtar)`); koşul dünyadaki gerçek durumdan (kasa, tablo, kadro, kişi), sonradan söylenen neden gerçektir (ilke 6).
- **Geçiş komutu** `sablonIlerle(k, meseleId, asama, p)`: olay yazar, aşamanın işini kurar; `adim` sayacıyla bir kez uygulanır, kopyala-yaz, kayıt–yükle ortasında aynı sonuç.
- **Gizli yetenek** `kisiYetenegi(k, kisiId, konu)`: saf, kayda yazılmaz (TEST 0–1); hocada bugünkü `bilgi`. Hiçbir ekranda sayı yok (Test bilgileri kutusu hariç).

### R4-b — pazarlık kartı (`KARAR_TURLERI.pazarlik`; kalemli)

- **Kalem:** bonservis (karşı taraf satan kulüp) ya da maaş ve süre (karşı taraf oyuncu, R4-g). Taksit, pay ve imza parası kalemleri sonra (R6); kart kalemi taşır, yeni kalem yeni tanımdır.
- **Ekip iki rakam önerir** (bonservis: TEST mali işler müdürü; maaş: müdür ya da hoca; kimse yoksa başkanın tahmini). Rakamlar karşı tarafın gizli alt sınırının önerenin tahminidir; sapma önerenin gizli yeteneğiyle daralır (iyi ±%5, zayıf ±%25). Sol yüz **temkinli** (tahmin × 0,90), sağ yüz **güçlü** (× 1,05); yüzde önerenin adı, kasaya etkisi, bağlam (U3 kasa).
- **Karşı taraf:** gizli alt sınır ve sabır (2–3), belirlenimci; gerçek durum oynatır (satanın o mevkide fazlası, rakip ilgisi, oyuncunun ünü ve yaşı) ve bunu bir kişi bir cümleyle söyler (yalnız durum gerçekse).
- **Cevap sonraki kartta** (bekleme 1 gün; dönemin son gününde saatler): kabul / karşı teklif (karşı tarafın rakamı dosyada, ekibin yeni iki rakamı yeni kartta) / kopma (o taraf bu dönem bizimle yeniden oturmaz). Cevapsız pazarlık: ömrü 2 gün, dolunca sabır −1 ve “Hâlâ bekliyorum”, ikinci kez kopma.

### R4-c — transfer alımı şablonu (`js/transfer-alim.js`; kural)

| Aşama | Tür | Ne olur (TEST) |
|---|---|---|
| ihtiyaç | kart (rutin) | Hocanın isteği (5 Ocak) ya da başkanın girişimi (R4-e): **[Bütçeyi onayla / Reddet]** |
| araştırma | bekleme 2–4 gün | Hoca, gizli `bilgi`'sine göre o mevkide bütçeye uyan iki aday seçer (bilgisi zayıf hoca yanılabilir); yardımcı sayıları toplar; havuz başka kulüpler ve serbestler. Aday yoksa “bulunamadı” |
| aday | kart (fırsat, 3 gün) | **[Aday A / Aday B]**: ad, yaş, kulüp ya da “serbest, X aydır”, bu sezonun sayıları, hocanın tek cümlesi, tahmini bonservis ve maaş. Tek aday: [Görüş / Vazgeç] |
| yürütme | kart (rutin) | **[Pazarlığı kendim yürütürüm / Nusret Bey'e bırak]** (serbest oyuncuda atlanır) |
| kulüp pazarlığı | kart zinciri | R4-b, kalem bonservis |
| devir | devir 2 gün | Müdürün gizli yeteneği: iyi (≈ alt sınır × 1,00–1,05) / vasat (× 1,12–1,20) → **[İmzaya gönder / Vazgeç]**; kötü → kopma |
| oyuncu pazarlığı | kart zinciri | R4-g: maaş ve süre; istekler; “Telefonla / Yanına git” (R4-h) |
| sağlık | bekleme 1 gün | Mekân ilçe devlet hastanesi; kıvrım “sağlık raporu” |
| imza | — | Bugünkü imza yolu (oyuncu gelir, bonservis ertesi gün, satan kulüp gençle tamamlanır); hoca teşekkür eder; gazete geçmişten |
| alternatif | kart (fırsat, 2 gün) | **[Öbür adayla görüş / Dosyayı kapat]** (dosya başına bir kez) |

- **Süre doldu:** dönem bitince açık dosya kayıpla kapanır; dönem dışında açılan dosyada araştırma hemen, aday kartı dönem başında (koşullu uyku). Serbest oyuncu dönem dışında da alınabilir (TEST kural; açık soru, kullanıcınındır).
- **Tekrar sınırı:** aynı anda en çok iki açık alım dosyası; dönem başına en çok üç (TEST).
- **Eski kayıt:** bekleyen eski `transferImza` eski yoldan biter. Gelen teklif (satış) bugünkü gibi kalır (satış şablonu R6).
- Bütün sayılar tek yerde: `TRANSFER_ALIM_TEST`.

### R4-d — dünyada dar transfer

- Yalnız bir kıvrımın sonucu olarak oyuncu iki başka kulüp arasında geçer (oyuncu rakibe imza attı): `oyuncuTransfer`; alan kulübün kadrosu 22'yi aşarsa en zayıf genç yedek serbest kalır, satan gençle tamamlanır, iki kaleci kuralı korunur. Geçmişe yazılır, Canlı Skor'da yeni kulübünde görünür, gazete yazar; Transfer masasının Geçmiş bölümü “kaçan”ı izler.
- Tam kulüpler arası piyasa H3'te.

### R4-e — başkanın girişimi

- **Telefondan:** hocanın konuşmasında “Yeni konu aç” › **Transfer** › “Bir hatta oyuncu bulalım” (argümanlı konu; hat seçimi menüdür). Hoca birkaç saat sonra görüşünü ve bütçe önerisini yazar → ihtiyaç kartı.
- **Masadan:** takipteki ya da piyasadaki bir oyuncu için “Hocaya araştırt” (aday aşaması o oyuncuyla başlar) ve “İzlemeye git” (R4-h).
- Dönem dışında da açılır; sezon sonu kaydından sonra açılmaz. Dosyanın `kaynak` alanı girişim payını ölçer.

### R4-f — serbest oyuncu havuzu ve oyuncunun geçmişi

- **Havuz (TEST üretim):** yeni kariyerde ve eski kayıtta eksikse (idempotent, belirlenimci) 20–30 serbest oyuncu, mevkilere dağılmış; her birinin **ne zamandır boşta** olduğu (`serbestTarih`), maaş beklentisi ve gizli kabiliyeti (yaşa göre). Gizli form boşta kaldıkça düşer (S-a'nın formu).
- **Geçmiş ve ün:** öne çıkan oyunculara kısa geçmiş (TEST): en iyi yılı, o yılki gol ya da maç sayısı, eski kulübü — **kulüp adı uydurulmaz:** ligdeki kulüplerden biri ya da genel tarif (“1. Lig'de bir kulüp”, “yurt dışında”). Ün yüksek, yaşı ileri, formu düşük, maaş beklentisi yüksek oyuncu **düşüşteki eski yıldızdır**: bedava ama riskli; imzası gazetede büyük haber.
- Piyasa bölümünde görünür (“serbest · 7 aydır”); hocanın görüşü kaynaklıdır (“eskisi gibi değil ama tecrübesi işe yarar” ya da tersi); gizli değer açılmaz.

### R4-g — oyuncu pazarlığı (maaş, süre, istekler)

- Kulüp pazarlığından (ya da serbest oyuncuda doğrudan) sonra oyuncu tarafı: R4-b kartı, kalem maaş ve süre (1 ya da 2 yıl), karşı taraf oyuncu (menajer kişisi R6'da; şimdilik “oyuncunun temsilcisi” metni).
- **İstekler** gerçek durumdan: lig seviyesi (“3. Lig'e gelmem”: ünü yüksek ya da genç yetenek; olasılık TEST), oynama süresi (hocanın o mevkideki ilk on biri doluysa), şehir ve aile (TEST olasılık). İstek bir kayıp yolu ya da yüz yüze görüşmeyle aşılabilir engeldir.

### R4-h — mekânlar ve görüşmeye gitmek

- **Mekân defteri** `MEKANLAR` (kademe, ad, yolculuk süresi, masraf, etki, sahne anahtarı): 3. Lig için başkanın odası, kulüp lokali, çay bahçesi, rakip kulübün ofisi, ilçe devlet hastanesi, amatör maç tribünü (TEST). 2. ve 1. Lig mekânları tasarımda (Aşama 8); sahneler görsel turda (karar 49).
- **Görüşmeye git:** oyuncu pazarlığında ve rakip başkanla bazı kartlarda iki cevaptan biri **[Telefonla görüş / Yanına git]**. Yüz yüze: zaman (yolculuk + görüşme; cevabın `sure`'si oyun zamanını ilerletir, başkan ofisten uzaktır), masraf (kasadan), etki (oyuncunun alt sınırı ve isteği yumuşar; “3. Lig'e gelmem” aşılabilir). Ofisten uzakken kaçırılacak işler kartın yüzünde yazar (bugünkü kural); zaman sahnesi “yoldasın” der, dönüşte durak özeti.
- **İzlemeye git:** takipteki oyuncunun maçına hocayla gitmek (Pazar, amatör ya da bölge maçı; TEST): zaman ve masraf karşılığında hocanın o oyuncu hakkındaki görüşü isabetlenir ve oyuncunun dosyasına tarihli not düşer (karar 60/1: sakin günün karşılığı bilgi).

### R4-i — kıvrımlar (TEST örnekleri; içerik kullanıcının)

| Kıvrım | Aşama | Koşul (gerçek durum) | Sonuç |
|---|---|---|---|
| Rakip araya girer | kulüp pazarlığı, devir | Üstümüzdeki bir kulübün o mevkide ihtiyacı | Haber; alt sınır yükselir; sabır biterse oyuncu rakibe imza atar (R4-d), alternatif |
| Satan başkan son anda bedeli artırır | kabulden sonra | Satanın kasası ya da tablodaki yeri | Yeni kart: **[Farkı öde / Vazgeç]** |
| Sağlık raporu | sağlık | %10 (yaş ve sakatlık geçmişiyle artar) | **[Riski al / Vazgeç]**; riski alınca gerçek sakatlık |
| Anlaşamamak | oyuncu pazarlığı | İsteği karşılanmadı, sabır bitti | Kayıp; gazete |
| Hocanın itirazı | aday, imza | Başkanın girişimiyle gelen oyuncu hocanın tarzına uymuyor | Hocanın sözü dosyada; gazetede “başkanın transferi” |
| Basına sızıntı | pazarlık | Ünlü oyuncu ya da rakibin oyuncusu | Fiyat artar ya da taraftar coşar (gazete) |
| Son gün | dönemin son günü | — | Kart ömürleri saatlere iner; zaman sahnesi geri sayar |
| Tescil gecikmesi | imza | Son günün akşamı imza | Belge yetişmez: oyuncu sonraki döneme dek oynayamaz (TEST; OLAY_KUTUPHANESI'ndeki tescil örneği) |
| Rakibin oyuncusu | aday, pazarlık | Satan kulüp tabloda yakın rakip | Satan başkan sert; alımda taraftar sevinci, satan kulübün tepkisi gazetede |

Olasılıklar TEST ve tek yerde; kıvrım kotası yok, çoğu transfer sorunsuz ilerler. Metinler TEST yer tutucu; kıvrımların gerçek içeriği kullanıcınındır ve senaryo çalışmasında (OLAY_KUTUPHANESI) çoğalır.

### R4-j — oynama ölçüsü (TEST; karar 60/8)

- `sezon-deneme` sayaçları: hafta başına karar, kararsız hafta, dosya sonuçları (olumlu, olumsuz), girişim payı; transfer: açılan, imzalanan, kaybedilen, rakibe giden, devredilen ve devrin kalitesi.
- Oyunda **“Oynama ölçüsü (TEST)”** (Ayarlar › Geliştirici): her oyun haftasının gerçek süresi (duraklatma hariç), karar ve başlatılan iş sayısı; tarayıcı deposunda, kayda girmez; kopyalanabilir metin; yayından önce kalkar.
- Aralıklar (ölçü, kota değil; OYUN_TASARIMI §6): sakin hafta 5–10 dk, olağan 15–25, yoğun 40–60; transfer dönemi haftasında 3–8 karar; girişim payı %20–50. Bugün içerik yok: dönem dışındaki haftaların çoğu kararsız çıkabilir; serbest oyuncu ve izleme bunu kısmen değiştirir, ölçü gösterir.

### R4-k — Transfer masası (yeni masa nesnesi; ekran, kural içermez)

- Masa şeridinde **Transfer** (tuş 6), aynı odak kabında açılır. Odadaki karşılığı **duvarda mantar pano** (kullanıcı kararı); 3B çizimi görsel turda, şimdi kâğıt düzen (`STIL.kagit`).
- **Bölümler:** **Pano** (dönem sayacı, son gün kırmızı; bütçe ve kasa; ihtiyaçlar; açık işler tek satır ve aşamasıyla; gelen teklifler), **Takip** (izlenen oyuncular, bildiklerimiz ve kaynakları), **Piyasa** (bildiğimiz kadarı: serbestler ve ne zamandır boşta, sözleşmesi bitecekler, satılık sinyali olanlar), **Geçmiş** (gelen, giden, kaçan; kaçanın sonraki sayıları). Satıra dokununca oyuncunun sayfası (R3, kaynaklı notlarla) ya da dosyası.
- **Takip listesi:** kayıtta isteğe bağlı `k.transfer = {takip: [{oyuncuId, tarih, kaynak}]}`; “takibe al / bırak” menüdür. Oyuncu notları (S-c) öbür kulüplerin ve serbest oyunculara uzar.
- Kararlar yine tek kart; dosyada şablonlu konunun üstünde tek satır aşama; kart sınıfı kartın künyesinde (“Fırsat · 3 gün”, “Pazarlık”). Kayıt sürümü 11 kalır (yeni alanlar isteğe bağlı).

### R4-l — denetimler (karar 63; motor dosyası değişmez)

- `node araclar/hizli.js --hepsi` (`mac-deneme 4` “sonuç aynı”).
- `kariyer-deneme` yeni bölümler: şablon motoru (geçiş, bir kez, kopyala-yaz, kayıt–yükle ortasında, bozuk şablon); kıvrım defteri (koşul, olasılık, belirlenimcilik); pazarlık (iki kalem, kabul, karşı teklif, kopma, cevapsız); zincir (tam yol, iki aday, devir üç kalite, oyuncu pazarlığı ve istekler, alternatif, dönem kapanınca kayıp, dönem dışı uyku, tekrar sınırı, eski kayıt); dar transfer (kadro 22, iki kaleci, geçmiş, Canlı Skor); serbest havuz (kurulum, eski kayıtta tamamlama, geçmişte uydurma kulüp adı yok); mekân ve yolculuk (zaman, masraf, kaçırılan iş); izlemeye git (not); tescil gecikmesi (uygunluk); takip listesi; başkanın girişimi; gizli değerin metinde sayı olmaması.
- `sezon-deneme`: politikalar `--aday 1|2`, `--pazarlik temkinli|guclu|devir`, `--oyuncu telefon|git`, `--saglik al|vazgec`, `--girisim <tarih>`, `--serbest <tarih>`. **t3** birebir; **t7** (`--talep onayla`) fark bekler → yeni taban `sezon-r4-t7.json`, gerekçesi Sapmalar'da. Açılan her dosya kapanır; kadro ve kasa tutarlı (dar transfer ve serbest havuz dahil).
- `akis-deneme` yeni **§32 Transfer masası** (bölümler, dönem sayacı, takip, piyasa, geçmiş, Esc) ve **§33 Transfer zinciri** (telefondan girişim → bütçe → aday → pazarlık kartının iki yüzü → karşı teklif → oyuncu pazarlığı ve “Yanına git” → sağlık → imza; rakibe giden oyuncu ve alternatif; dosyada aşama). Etkilenenler: 3 (dosya), 21 (telefon), 27 (Esc tablosu), 30 (iş paneli).
- `okunurluk.py` yeni sahneler: transfer masası (Pano, Piyasa), aday kartı, pazarlık kartı.
- Motor değişmediği için oturum sonu, 40 maç ve hız gerekmez.

### R4-m — oynama denemesi (kullanıcı; turun sonunda)

- Kullanıcı oynar: bir sakin hafta (piyasaya bak, bir serbest oyuncuyu takibe al, izlemeye git), transfer dönemi (hocaya oyuncu iste, pazarlığı bir kez kendin yürüt, bir kez devret, bir görüşmeye git), gelen teklif. Ölçü paneli açık; [OYUN_TASARIMI §1](../../OYUN_TASARIMI.md#başkanlık-deneyiminin-temel-ilkeleri)'in altı sorusu.
- Notlar sohbette; teşhis devam notuna ve R5/R6 planlarına girer. Claude kabul sahnesi üretmez (karar 11).

## Yapılmayacaklar (R4)

- Menajer ve satan kulübün başkanı kişi olarak (gündem, güvenilirlik, hafıza; kişi modeli R6); söylenti kanalı; satış şablonu (P07); taksit, pay ve imza parası (R6).
- Kulüpler arası tam piyasa, yaz dönemi, ön anlaşma (H3); kiralık, yurt dışı, yabancı kontenjanı, 2. ve 1. Lig mekânları ve kuralları (Aşama 8).
- Mekân sahneleri ve panonun 3B çizimi (görsel tur, karar 49); yeni görsel dil, motor, ses, puan.

## Claude kararları (belgeye görünür yazılır; itiraz serbest)

- **Transfer masası ayrı nesne, kararlar yine tek kart:** masa göz atma ve girişim yeridir; başkan listeden “satın al”maz, bir kişiye iş verir.
- **Dosya süreç kaydıdır;** aşamalar adlı ve üç türlü; kıvrımlar ayrı kayıt defterinde, motor değişmeden eklenir.
- **Pazarlık kalemlidir;** önereni ve devrin kişisi TEST mali işler müdürü; gizli yeteneği türetilir, saklanmaz.
- **Yolculuk mevcut zaman kuralıyla:** cevabın süresi zamanı ilerletir, kaçırılacak işler kartta yazar; ayrı bir “konum” durumu kurulmaz.
- **Geçmişte kulüp adı uydurulmaz:** ligdeki kulüpler ya da genel tarif.
- **Kötü sağlık raporu karardır;** riskin karşılığı gerçek sakatlık. **Tescil gecikmesi gerçek uygunluk kuralıdır** (oyuncu sonraki döneme dek oynayamaz).
- **Kayıt sürümü 11 kalır** (yeni alanlar isteğe bağlı). **Hocanın isteği aynı tarihte gelir**, artık zincirin ihtiyaç aşamasıdır.
- **Sayılar TEST** (`TRANSFER_ALIM_TEST`), metinler TEST yer tutucu; senaryoların metni ve kıvrımların içeriği kullanıcınındır.

## Kabul

- `hizli --hepsi` çıkış 0; `kariyer-deneme` yeni bölümleriyle geçer.
- Sezon t3 18/18 birebir; t7 yeni taban, gerekçesiyle; 18 haftada açılan her dosya kapanır, kadro ve kasa tutarlı.
- `akis-deneme` 3, 21, 27, 30, 32, 33 geçer; `okunurluk.py` eşikte; `mac-deneme 4` “sonuç aynı”.
- Transfer masası dönem dışında da işe yarar (takip, piyasa, izleme, serbest oyuncu); oynama ölçüsü kayda girmez; R4-j'nin ölçüsü önce ve sonra plana yazılır.

## Belgeler

- **OYUN_TASARIMI** §2 (dosya şablonları, kıvrımlar, pazarlık: “Bugünkü uygulama (R4)”), §8 (transfer: masa, kapılar, mekânlar, kademeler — onaylanan tasarım buraya taşınır), §6 (oynama ölçüleri).
- **OLAY_KUTUPHANESI:** transfer kapıları ve kıvrım fikirleri senaryo malzemesi ([transfer-tasarim.md](transfer-tasarim.md) §3–§4), §12 bugünkü kaynaklar, §13 R4 satırı.
- **TEKNIK_PLAN** §3 (meseledeki `sablon`, `k.transfer`, serbest oyuncunun alanları, tescil), §6 (şablon motoru, kıvrım ve mekân defterleri: uygulanan), §10 (Transfer masası).
- **STIL_REHBERI** §7 (Transfer masası, aşama satırı, kart sınıfı, pazarlık ve aday kartı).
- **YOL_HARITASI** karar 65, devam notu; **CLAUDE.md** “Bugün çalışan”; **KAPILAR** şablon, kıvrım, mekân ve transfer satırları; `h4-uygulama.md` ve `y-program.md` başına not; `transfer-tasarim.md` onaylı kısımları ana belgelere taşındıktan sonra yönlendirme notuna iner.

## Riskler

- **Genel hikâye motoruna kayma:** aşama türü üç, kıvrım bir kayıt tipi, kancalar mevcut; içerik ayrı.
- **Tur büyüklüğü:** tek büyük tur (kullanıcı kararı); ara commit'ler alt adım alt adım ve her biri kendi denetimiyle; uzarsa kalan devam notuna yazılır.
- **Zincirin uzunluğu:** bir transfer 4–9 kart; yorucu gelirse süreler ve aşamalar TEST, ölçü ve deneme gösterir.
- **Dar transfer ve serbest havuzun yan etkisi:** başka kulüplerin kadrosu ve maç girdisi değişir; kadro 22 ve iki kaleci kuralı, kariyer ve sezon denemeleri sınar.
- **Sezon tabanı t7 değişir:** bilinçli, gerekçeli yeni taban; t3 birebir kalmalı (serbest havuz rastlantı çekmeden ayrı tohumla kurulur).
- **Masa ve rakamlı yüzlerin okunurluğu:** okunurluk sahneleri ve akış §32–33.

## Tahmin

35–44 saat. Sıra: R4-0 → a (motor, kıvrım defteri) → b (pazarlık) → c (zincir) → d (dar transfer) → e (girişim) → k (masa) → f (serbest havuz) → g (oyuncu pazarlığı) → h (mekân, görüşmeye ve izlemeye git) → i (kıvrımlar) → j (ölçü) → l (denetimler) → belgeler ve kapanış → m (kullanıcının oynama denemesi).

## Sapmalar

**R4-0 başlangıç ölçüsü (R4 kodundan önce):** sezon t7 ve t3 18/18 birebir; oynama ölçüsü t7: karar/hafta ort 0,39, en çok 2, kararsız hafta 13/18 (türler hocaKarari 1, hocaAdayi 1, transferButcesi 1, teklifKarari 3, sozlesmeYenile 1); t3: ort 0,28, kararsız 14/18.

1. **Rakip araya girer → oyuncu rakibe gider:** planda oyuncu, kıvrımın kendisinde satanın sabrı biterse rakibe gidiyordu; sabır 2–3 ve kıvrım −1 olduğundan bu yol hiç tetiklenmiyordu. Uygulanan: kıvrım satanı sertleştirir ve rakibi dosyaya yazar; **kulüple pazarlık sonradan koparsa** (karşı teklif reddi, cevapsız kart, devrin kötü sonucu) oyuncu o rakibe gider (`taKopma`). Olasılık 1 iken kariyer denemesi bu yolu bulur.
2. **Rakibin oyuncusu kıvrımı sabrı düşürmez** (yalnız alt sınır ×1,15): ilk teklif hemen koparmasın. Sert teklif eşiği 0,75 (plan 0,8). Ekibin iki rakamı kıvrımlardan sonra, kart kurulurken hesaplanır (karşı tarafın sertleştiği bilinir).
3. **Hoca değişince:** soranı ayrılan hoca olan kart düşer (H2-c kuralı); kartsız kalan dosya kapanır ve sonucu `dustu` olur (`js/mesele.js`; `sablonDogrula` buna izin verir). Bekleyen araştırma ve görüş yeni hocayla sürer (`js/hoca.js` `HOCA_DEGISTI` kancası; planda yoktu).
4. **Serbest havuzun gizli hali** yalnız oyuncunun haftası açıkken yazılır (anahtar kapalı denemesi “hal yazılmaz” kuralıyla tutarlı).
5. **Piyasa'da sözleşme bitişi tarih değil sinyaldir** (“Sözleşmesi bu sezonun sonunda bitiyor”, kaynak “Kulislerden”); tutar ve tarih yok (kamuya açık bilgi sınırı, karar 64).
6. **Transfer masası dört bölüm** (Pano, Takip, Piyasa, Geçmiş); tasarım belgesindeki “Kadromuz” Dosya › Kadro'da kalır.
7. **Kart künyesinde sınıf varken rol yazılmaz** (dar kartta sınıf kesiliyordu; rol yüzde kişinin altında yazar).
8. **Oynama ölçüsü** depo arayüzüyle (`tarayiciDeposu('chairman.olcu:')`, ad denetiminin kayıt yolu kuralı); süre iki çizim arası en çok 2 dk sayılır.
9. **`sezon-deneme` haftada durak sınırı 20 → 60** (transfer zinciri haftaya çok durak ekler); `--girisim`, `--serbest` günü geçen ilk durakta bir kez.
10. **Akış §33** zinciri ekranda kartlarla yürütür; maç günleri ve ana düğmenin “Stada git” olduğu duraklar oyunun komut yoluyla (oyunKomut) geçilir. Rakibe giden oyuncu ve alternatif aday akışta değil, kariyer denemesinde denetlenir.
11. **Mekân sahneleri, 2. ve 1. Lig mekânları** yalnız tasarımda (planla aynı).
12. **Ölçü:** zincirin sonuç dağılımı (12 tohum, yapay haftalar, telefon ve güçlü teklif): 21 dosyada imza 14, oyuncunun isteği 3, anlaşamama 3, rakibe 1. Gerçek maçlı 10 haftalık denemede (`--talep onayla --girisim 2026-12-01:FV --serbest 2026-12-10`) transfer haftası 16 karar — OYUN_TASARIMI §6'nın 3–8 aralığının üstünde; pazarlık turları ayrı kartlar. Oynama denemesinde yorucu gelirse sınır ve süreler TEST'tir.

**Denetim sonuçları:** `kariyer-deneme` geçti; sezon t3 18/18 birebir, t7 yeni taban `sezon-r4-t7.json` (13–19. haftalar birebir, 20'den sonra bilinçli fark: 12 Ocak'ta zincir imzayla bitti); `oturum-sonu --ayni --seyrek` 40/40 birebir, yeni kabul dışı 0; hız ortanca +%1,9 (R2 eki koduna karşı, aynı süreçte); `akis-deneme` 32, 33 ve tamamı (büyük kapı, aşağıda devam notunda); `okunurluk.py` bütün sahneler eşikte; `kontrol.py`, `akis-2d.py` geçti.
