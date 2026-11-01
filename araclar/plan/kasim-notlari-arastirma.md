# Kasım notları — kullanıcının 14 maddesi: araştırma, teşhis ve öneriler (tartışma turu 1, 2026-11-01, masaüstü)

Durum: **tartışma kaydı; kod değişmedi, yol haritası değişmedi.** Kullanıcı 2026-11-01'de 14 maddelik not bıraktı ve “hemen somut plan değil, araştır, önümüzdeki adımlara bak, fikir sun, birkaç tur konuşalım” dedi. Bu belge o turun kaydıdır: kodda teşhis, dört araştırma (gerçek kulüplerde transfer takibi; yüz üretimi, köken, yaşlanma ve boy; kâğıt arayüzü okunurluğu ve geçişler; ekran görüntülerinin incelenmesi) ve Claude'un önerileri. Kararlar kullanıcıdan sonra YOL_HARITASI “Geçerli kararlar”a ve ilgili plana yazılır. Kaynak listesi sondadır; “(tahmin)” etiketi kaynaksız türetimdir.

## 0. Çerçeve ve çevre kontrolü

- Depo `main`'de, temiz, `origin/main` ile eşit (beace6b); makine satırı “boşta”. Son kapanış: RK paketleri 1–2 (RK1, RK2, RK4-a, RK6, RK7, RK8-a) büyük kapıdan geçti.
- Programda sırada duranlar ([rk-program.md](rk-program.md) §5, §“Sonrası”): **RK3** arayüz dili ve taslaklar (tasarım turu), **RK5** ekranların yeni dile geçişi, **RK8-b** TV'nin kalanı, **RK9** antrenman canlandırması; sonra **R6b-1** transfer bilgi akışı, R6b-3 kriz/sözleşme/satış, R7 genel kurul, H3 yeni sezon. Oyuncu nüfusu üretimi (altyapı, yaşlanma, emeklilik) H3 kapsamı dışında, Aşama 7'de.
- Kullanıcının 14 maddesinin hepsi bu sıradaki turlardan birine düşer; yeni bir alan açmaz. Maddelerin çoğu ya zaten planlı bir turun kapsamını değiştirir (RK3/RK5 arayüz, RK4-b yüzler, R6b-1 transfer, RK8-b TV, RK1/RK2 balkon ve telefon) ya da bir saatlik düzeltmedir.
- Yerel sunucu `.claude/launch.json` (`chairman-yerel`, 8765). Ekran görüntüleri `araclar/son-akis-*.png` ve `son-okunurluk-*-*.png` (2026-10-31) teşhiste kullanıldı; `son-kontrol-portre-galerisi.png` yüz tartışmasının dayanağı.

## 1. Maddelerin kodda teşhisi

| # | Kullanıcının notu | Bugün (kod) | Kök neden / sınır | En küçük değişiklik | Tur |
|---|---|---|---|---|---|
| 1 | Telefonu alıp bırakırken ekrana bakma kalksın; kol doğal görünsün | `js/oda.js` `odaYolKur` 292–295: bak → al → **ekran** (0,32 sn, telefon yüze kalkar ve ekran göze döner) → cep; varışta cikar → **ekran2** → koy. Parametreler `STIL.oda.yuru.rituel`. Kol `js/yuruyus.js` `yrElKur`: yalnız ön kol kütüğü + manşet + avuç + tek parmak bloğu; dirsek ve üst kol yok; görünürlük `visible` ile **anlık** açılıp kapanıyor (karenin içinde pat diye beliriyor) | Tasarım: ekran evresi bilinçli konmuştu (RK2); kol modeli asgari | `ekran`/`ekran2` 0; `al`'ın son parçası masadan `W.bas`'a (bel hizası); `cikar`→`koy` `W.bas`'tan; `odaElYuzPayi` 0; `elBak`/`koyBak` düşer. Kol karenin alt kenarından **girip çıkar** (görünürlük yerine yol), üst kol bloğu eklenir. `araclar/yuruyus-yakala.py` `ekran` anlarını örnekliyor, güncellenir | RK-D (düzeltme paketi) |
| 2 | Antrenman sahasında fareyle istediğim yere yaklaşıp uzaklaşayım, kaydırayım | `js/balkon.js` `balkonBakis`: hedef türleri saha/yer/grup/oyuncu, üç kademe 46°/20°/9°; `js/ekran-oda.js`: tık = bakış (geniş bakışta gruba, yakında oyuncuya, boş zeminde o yere), tekerlek = kademe (yalnız geniş bakıştan ilk adım imlecin altına), Z, Esc, ←/→, Enter. **Sürükleme yok, imlece doğru sürekli yakınlaşma yok** | RB'de kademeli bakış tercih edilmişti | Sürükle = baş döner; tekerlek = imlecin altındaki noktaya kademesiz yakınlaşma; kademeler Z için kalır (§3) | RK1-b |
| 3 | Balkonda tarih-saatin altındaki “Toparlanma 15–17 · saha boş” kalksın | `ekran-oda.js` `gozlemSeridi` 452–465 → `.od-antrenman` (gün, saat, durum, **Gördüklerin · n ▸ düğmesi**); yalnız balkonda | Gördüklerin'e tek giriş burada | Şerit kalkar; Gördüklerin alt şeride (İZLE düğmelerinin yanına). Akış denemesinin 1050, 3757–3790, 3840 ve `okunurluk.py` 229 beklentileri güncellenir | RK-D |
| 4 | Balkonda tarih-saat de kalksın | `.od-tarih` odada ve balkonda aynı (`ekran-oda.js` 769) | Üst çubukta zaten “KAYDEDİLDİ · 23 KAS PAZ 08:00” var; odada 3B masa takvimi ve duvar saati de var → tarih üç yerde | Balkonda `.od-tarih` gizlenir (`data-yer="balkon"`); saat alt şeridin ilk satırında küçük (“Pzt 15:20”) — bkz. §2 itiraz. Ayrıca üst çubuktaki kısaltma “PAZ” Pazar ile Pazartesi'yi ayırmıyor (“PZT” olmalı) | RK-D |
| 5 | Antrenman izlerken oyuncuya tıklayınca dosyası açılmalı; açılmıyor | Tek tık **hiçbir zaman** dosya açmaz: 1. tık gruba, 2. tık oyuncuya (takip, 9°), takip edilene 3. tık hiçbir şey. Dosya yalnız: takip etiketi `.od-takip` (her karede yeniden konumlanan düğme — koşan oyuncuyla imlecin altından kayıyor, akış denemesi bu yüzden JS'ten tıklıyor), Enter, Gördüklerin. İmleç etiketi `.od-isaret` `pointer-events:none` | Tasarım çatışması: tık “bakış” için ayrılmıştı (RB) | Takip edilen oyuncuya tık ve çift tık → `oyuncuDosyasiAc`; `.od-takip` `pointerdown`'da açılır (kaymaya dayanıklı); imleç etiketi de tıklanabilir | RK-D |
| 6 | “Yeni konu aç” değil, “Yeni mesaj” | `js/ekran-telefon.js` 415–417 düğme, 459 panel başlığı “Yeni konu”; denemeler metne bakmıyor (sınıf ve `data-eylem`) | Yalnız sözcük | §2'de öneri: düğme mesaj kutusu biçiminde | RK-D |
| 7 | Oyuncu arama, klavyeyle; veri büyüdükçe genişlesin | Oyunda hiç metin arama yok (tek `<input>` kayıt dosyası yükleme). Oyuncuya ulaşma: transfer listeleri, Canlı Skor kulüp → kadro, Dosya Kadro | R6b-1'in kapsamıydı (RN eşlemesi 6. madde) | §5: kamu künyesi üzerinde arama (ligdeki 352 + 24 serbest; sonra üst ligler ve yurt dışı havuzu) | R6b-1' |
| 8 | Gelenler/gidenler iyi, “kaçanlar” kalksın | `js/transfer-alim.js` 534–538 kapanmış alım dosyalarından (`rakibe`, `kopma`, `anlasamama`, `istek`, `kacti`, `saglik`) | Veri değerli (hafıza), bölüm gereksiz | Bölüm kalkar; aynı veri oyuncunun dosyasına tarihli not (“Pazarlık koptu, Yıldıztepe'ye gitti”) ve gazeteye düşer | RK-D |
| 9 | Piyasa ekranı gerçekçi değil; gerçek kulüpler nasıl yapıyor, araştır | `js/piyasa.js` `piyasaListesi`: serbestler (24 TEST), “forma bulamayanlar” (`satilikSinyali`: ≥2 aynı mevki yedek, ilk 12), sözleşmesi bitecekler (ilk 12) | Üç liste iki farklı bilgi türünü karıştırıyor (§5) | Piyasa kalkar; Liste / Gelenler / Ara düzeni (§5) | R6b-1' |
| 10 | Teletext haberlerinde goller vs. olmasın, büyük haberler | `js/haber.js` `tvHaberleri`: her maç sonucu (`hb.sonuc`), kırmızı kart, sakatlık (≥7/14 gün), yaklaşan maçımız, erteleme, sezon sonu, transfer, hoca değişimi, kayıt haberleri; gol haberi yok ama **her maç sonucu bir satır** | 200 Skorlar zaten sonuçları taşıyor | 100'den `sonuc` ve `kirmizi` çıkar; gazetenin önem eşiğiyle aynı ölçek (transfer, hoca, erteleme, uzun sakatlık, ceza/kriz, sezon sonu) | RK8-b |
| 11 | Skorlarda “bugün lig maçı yok” yerine tarihler; “bugün/yarın” ibaresi değil | `js/ekran-tv.js` 64–73: “Bugün” kümesi + `TEST: Bugün lig maçı yok.` + haftanın kalanı yalnız saatle; 300'de gün adı + saat, ay günü yok | Canlı Skor'un hafta görünümü gün başlıklarını zaten yapıyor (`.tel-skor h5`) | 200: gün başlıkları (“Cumartesi 5 Aralık”), oynananlar skorla, gelecekler saatle, canlı kırmızı; bugünün başlığı yalnız işaretli; 300'e tarih | RK8-b |
| 12 | Yüzler: Türkler hafif esmer, kökene ve yaşa uygun, saç dökülmesi, sakal; kaş–göz birbirine giriyor; tekniği gerekirse baştan kur | `js/kariyer-kadro.js` `oyuncuUret`: **`ten: Math.floor(r()*5)`** → beş tondan düz rastgele, `STIL.tenler`'in iki koyu tonu %40; köken/uyruk alanı yok; `js/portre.js` 24×24, yaş **sabit 2026** yılından (yaşlanma donuk), 30+/34+ iki çizgi ve kır şakak; kaş ile göz arasında zorunlu boşluk yok | Üreteç kimlik kavramı olmadan kuruldu; 24 px'te kaş+göz+burun+ağız birlikte güvenilir değil (araştırma §4) | Kimlik katmanı (köken, ten rampası, saç/göz, kellik ve kır yatkınlığı, boy), 32 px yüz, yaş katmanı; 3B baş aynı kaynaktan (§4) | RK4-b |
| 13 | Boy olsun: profilde ve antrenmanda | `boy` **kayıtta var** ama ölçek (0,92–1,09; kaleci ve stoper 1,00–1,09); motorda kütle ve baş yüksekliği, 3B figürde `root.scale`; **hiçbir ekranda yok** | Yalnız gösterim ve üretim dağılımı eksik | cm alanı (mevkiye göre dağılım), kartta ve Kadro'da; figürde baş sabit, gövde ve bacak ölçekli | RK4-b |
| 14 | Arayüzü sıfırdan düşün: raporlar okunaksız, düğme yerleri, ara geçişler, renkler, simgeler | U turu odak modelini kurdu; RK3 (taslaklar) ve RK5 (giydirme) planlandı ama **henüz yapılmadı** | Tasarım turu kullanıcı kararı bekliyordu | §6: somut sorun listesi, ölçüler, iki varyant, yöntem | RK3 → RK5 |

## 2. Küçük düzeltmeler paketi (RK-D; bir günlük tur)

Tartışmasız gördüklerim ve tek tek itirazlarım:

- **Telefon ritüeli (1).** Katılıyorum. Ekrana bakma kalkar; telefon masadan alınıp bel hizasına iner ve karenin altından çıkar (cebe), varışta aynı yoldan gelip masaya konur. Her yön ~0,9–1,1 sn, bugünkü bakış ağırlığı sıfıra yakın. Asıl iş kol: bugün kol karenin içinde aniden beliriyor; doğal görünmesi için kol **karenin alt kenarından girer ve oraya döner** (yol), ön kola üst kol ve dirsek eklenir (üç kutu daha; ucuz). “Kolumuzun doğal şekilde ortaya çıktığı” isteğinin karşılığı budur. Toplam yürüyüş süresi 0,6 sn kısalır.
- **Balkon metinleri (3, 4).** Künye kalkar, Gördüklerin düğmesi alt şeride taşınır. Tarih kutusu için küçük itiraz: izleme süresini seçerken (10/30/60 dk) saati görmek işe yarıyor ve telefonu açmak balkonda bir iş açmak demek. Önerim: balkonda kutu yok, saat **alt şeridin ilk satırında** küçük yazı (“Pzt 15:20 · Sıradaki durak …”); üst çubuk zaten tarihi gösteriyor. Aynı mantıkla odadaki kutu da gereksiz (§7).
- **Oyuncuya tıklama (5).** Çatışma gerçek: tık bakış için ayrılmış. Önerim: tek tık bugünkü gibi odaklar (gruba, sonra oyuncuya), **takip edilen oyuncuya tık ve her yerde çift tık dosyayı açar**; başın üstündeki ad etiketi tıklanabilir ve `pointerdown`'da açılır (koşan oyuncuyla kaysa da tutar). Alternatif (daha sert): tek tık doğrudan dosya, bakış yalnız sürükleme ve tekerlekle (fare kontrolü §3 gelince mümkün). Kullanıcı kararı.
- **“Yeni konu aç” (6).** Katılıyorum ama tek kelime değişikliğinden fazlasını öneririm: düğme yerine telefonun altında **mesaj kutusu görünümü** (“Mesaj yaz…” alanı ve kalem simgesi); dokununca hazır konular klavye yerine hızlı cevap listesi olarak açılır (konuşma açıkken alıcı zaten belli; “Yeni mesaj” alıcı seçmeyi çağrıştırır). Panel başlığı “MESAJ”. Kelime olarak “Yeni mesaj” da olur; “Mesaj yaz” daha doğal.
- **Kaçanlar (8).** Bölüm kalkar. İtiraz: veri atılmasın — gerçek kulüpler kaçırdıklarını hatırlar ve gazete yazar. Aynı kayıt oyuncunun dosyasına tek satır not olur (“Pazarlık koptu; 12 Ocak'ta Yıldıztepe'ye gitti”) ve gazeteye “Kulis” olarak düşer; Geçmiş'te yalnız gelen ve giden.
- **Teletext (10, 11).** Katılıyorum. 100 Haberler'den maç sonucu ve kırmızı kart satırları çıkar (200'de zaten var); kalan haber türleri gazetenin önem eşiğiyle süzülür, boş günde “Bugün önemli haber yok”. 200 Skorlar Canlı Skor'un hafta görünümüyle aynı gün başlıklarını alır (“Cuma 4 Aralık”), oynananlar skor, gelecekler saat, canlı kırmızı dakika; “bugün/yarın” kelimesi yok, bugünün başlığı yalnız vurgulu. 300 Program'a da ay günü. Teletext kısıtı (40 sütun, blok renk) korunur.

## 3. Balkonda fare kontrolü (RK1-b)

- **Model:** başkan oturur, gözü sabittir; fare **başı döndürür**, tekerlek **yakınlaşır** (dürbün yok, görüş alanı daralır). Yatayda ±70°, dikeyde −35°…+10° sınır (sahanın dışına bakılmaz).
- **Sürükle** = baş döner (hız bakış hızıyla sınırlı, bırakınca yumuşak durur). **Tekerlek** = imlecin altındaki noktaya doğru kademesiz yakınlaşma (46° → 9° arası; imlecin altındaki saha noktası sabit kalır, klasik “imlece yakınlaş”). **Tık** = oyuncuya odak ve takip (bugünkü), **çift tık** = dosya (§2). **Z** üç kademeyi döndürür (klavye kullananlar için kalır), **Esc** zinciri aynı, **←/→** gruplar ve oyuncular arasında. Takipteyken sürükleme takibi bırakır (serbest bakışa döner).
- Kayda girmez; yalnız görüntü. Risk: 9°'de figürlerin kabalığı daha çok görünür; RK9 (antrenman canlandırması) bunu giderir, sıra buna göre (§8).
- Ölçü: 46°'de bütün saha; 9°'de tek oyuncu dizden başa karenin ~%60'ı; 60 kare/sn'de baş dönüşü ≤140°/sn.

## 4. Oyuncu kimliği: köken, ten, yüz, yaş, boy (RK4-b)

### 4.1 Araştırmanın özü

- **Başkaları:** FM veritabanında kişi başına etnisite kodu (0–10), ten tonu 1–20 ve saç rengi var; regen'ler bunları ulustan çeker (ulus→etnisite yüzdeleri kamuya açık değil). Topluluk aracı NewGAN **Türkiye'yi Mağrip'le aynı gruba (MENA) koyar** — kullanıcının “fazla koyu” şikâyetinin aynısı. OOTP (FaceGen) yüzü 130 sayıyla tutar, **yaş ayrı bir vektör** olarak eklenir ve yüzler sezonla yaşlanır. CK3'te yaş ayrı katman. Piksel üreticiler (DiceBear 16×16, BitmapPunks 24×24) katmanlı parça kütüphanesi; **hiçbir başarılı oyun 24 px'te kaş+göz+burun+ağız taşımıyor** (Stardew 64, Fire Emblem GBA 96×80, Pokémon 80, FM 180).
- **Türkiye verisi:** ten (Manisa, n=960, öz bildirim) Fitzpatrick I %9 · II %25 · III %24 · IV %22 · V %20, VI yok; göz (İstanbul, n=149) kahverengi %61, ela/yeşil %26, mavi %13; saç kahverengi ~%65, siyah %15, açık %14–19, kızıl %3. Yani Türk oyuncu çoğunlukla açık-orta zeytuni, saçı koyu, gözü kahve; dörtte biri açık gözlü.
- **Süper Lig yabancı karışımı (2025-26, 571 oyuncu, 318 yabancı):** Brezilya 28, Portekiz 17, Fildişi 14, Senegal 12, Fransa 11, Nijerya 11, Gana 9, Mali 9, Polonya 9, Romanya 9, Bosna 7, Hırvatistan 7 … Gruplanınca: Sahra altı Afrika ~%31, Batı Avrupa ~%24 (bir kısmı Afrika kökenli), Doğu Avrupa ~%13, Balkan ~%13, Güney Amerika ~%13, Mağrip/Orta Doğu ~%4, Asya ~%2. **Alt liglerde yabancı sınırı çok daha dar** (TFF 2. ve 3. Lig'de yabancı oynatılamadığı yönünde kural; 1. Lig'de sınırlı sayı; **kesin metin doğrulanacak**) — Demirkapı 3. Lig'de olduğuna göre kadro bugün neredeyse tamamen yerli olmalı, çeşitlilik ligle birlikte açılır. Bu gerçek, köken sisteminin “büyüme”yle bağını kurar.
- **Yaşlanma:** Norwood III+ (belirgin açılma) 18–29 yaş %16, 40–49 %53 (ABD); Türkiye'de erkek AGA %48 (Avrupa'ya benzer). Kırlaşma Avrupa/Türkiye'de ~35'te başlar, Afrika ve Asya kökende ~10 yıl sonra; “50'de %50 gri” efsanesi, gerçekte %6–23. Sakal 18–39 yaş erkeklerde %60–70 (Britanya/Fransa anketleri; futbolcuya özel veri yok). Yüz dokusu (göz altı, nazolabial) 24 px'te okunmaz; **24 px'te yaşın güvenilir üç taşıyıcısı saç çizgisi, saç rengindeki gri ve sakaldır.**
- **Boy:** Dünya Kupası 2018 ortalama 182,4 (kaleci 188,8; savunma 183,2; orta saha 179,7; forvet 181,4; uçlar 165–201); Premier Lig 182,8 (kaleci 190,6). Türk yetişkin erkek ortalaması 173–174 (TÜİK), futbolcu kadroları 1,79–1,82. Önerilen üretim (tahmin; tablolardan): kaleci 189±5, stoper 186±4, bek 177±5, merkez orta saha 180±6, kanat 176±5, santrfor 182±6; yerli −1 cm; pratik sınır 1,62–2,02.

### 4.2 Teşhis (kod)

Bugünkü sistemde köken yok; ten beş tondan düz rastgele; yaş 2026'dan sabit (oyuncu sezonlar geçse de yüzü değişmez); kaş–göz boşluğu zorunlu değil (galeride bir grup yüzde bitişik); `boy` var ama cm değil ve gösterilmiyor; 3B figürde ten/saç/sakal aynı kayıttan ama baş dahil bütün figür ölçekleniyor.

### 4.3 Öneri: “kimlik” katmanı (bir kez kurulur, her şey ondan türer)

1. **Kimlik vektörü** oyuncu üretilirken belirlenir: köken grubu, ten rampası indeksi (7 rampa), saç ve göz rengi, kafa şekli, kaş kalınlığı, burun/ağız varyantı, **boy (cm)**, kellik yatkınlığı, kırlaşma yatkınlığı, sakal eğilimi. Kayda yazılan yalnız **sert veri** olanlar: `koken` (ve ileride `uyruk`), `boy` cm — ikisi de gözlenebilir, Canlı Skor'da görünür, içerik referans verebilir. Kalanı RK4-a'daki gibi kimlikten türetilir (kayda alan yok). Eski kayıtlarda geçiş: köken Türkiye, cm = bugünkü ölçekten (1,00 ≈ 180 cm).
2. **Köken tabloları** (NewGAN'ın iki aşamalı mantığı, ama Türkiye ayrı): Türkiye, Balkan, Doğu Avrupa, Batı/Kuzey Avrupa, İberya/İtalya, Mağrip, Batı Afrika, Brezilya, Arjantin/Uruguay, Doğu Asya. Her köken için ten rampası ağırlıkları, saç ve göz rengi ağırlıkları, kellik ve kırlaşma ofseti. Türkiye merkezi Monk 2–6 (tahmini ağırlık: açık %25, açık zeytuni %45, orta zeytuni %25, koyu %5). Bölgesel klişe yok; dağılım yeter.
3. **Ten = rampa, renk değil:** 7 rampa × 4 ton (ışık, orta, gölge, çizgi); kaş ve saç rengi tenden en az iki kademe koyu; en koyu iki rampada kaş ten gölgesiyle çizilir (siyah üstüne siyah okunmaz).
4. **Izgara 32×32** (kartta 3× = 96 px, listede 1× = 32 px; satır yüksekliği buna göre): göz 2×2, kaş 3×1, arada zorunlu 1 px ten, burun 1×2, ağız 3×1. Çizim bugünkü gibi parametrik (sabit şablon noktaları), yalnız saç ve sakal katman. Alternatif: 24'te kalıp burnu atmak — tercih etmem; 32 yaş izlerine de yer açar.
5. **Yaş katmanı ayrı işlev:** yaş kayıt tarihinden (bugünkü 2026 sabiti düzeltilir) → saç çizgisi aşaması 0–4 (yatkınlık × yaş; 25'te %15, 35'te %35, 40'ta %50 belirgin), gri oranı (temel renk → gri rampası karışımı; başlangıç yatkınlıkla 28–45, Afrika/Asya +10), sakal durumu (sezon içinde sabit, sezon geçişinde tohumlu küçük değişim), gençte saç hacmi +1 px, 30+ göz altı 1 px gölge. Kimlik korunur: aynı oyuncu 19'unda ve 34'ünde aynı adam olarak okunur.
6. **3B baş aynı kaynaktan:** rampa → malzeme rengi; saç çizgisi aşaması → saç halkalarının tepe/şakak kesimi; gri → saç rengi karışımı; **boy → gövde ve bacak ölçeği, baş sabit** (yüzler aynı okunurlukta kalır). Figürde üç boy sınıfı okunur (24 px figürde 1 px ≈ 7,5 cm); altısı okunmaz.
7. **Boy her yerde:** oyuncu kartında “1,86 m”, Kadro'da sütun, Canlı Skor oyuncu sayfasında (kamu). Motor bugün `boy` ölçeğini kütle ve baş yüksekliğinde kullanıyor; cm'den aynı ölçek türetilir, **motor sonucu değişmez** (`--ayni` ile doğrulanır).
8. **Doğrulama:** üretilen 500 yerli + 200 yabancı oyuncuda ten/saç/göz/kellik histogramlarını hedeflerle karşılaştıran Node aracı (`portre-denetimi.js` genişler); galeri PNG'de 19/26/33/38 yaşlarında aynı kimlik dört yüz yan yana; kaş–göz ayrımı ve üç boy sınıfı için kontrol listesi. Kullanıcı tarzı galeriden onaylar.

Kapsam: `js/kariyer-kadro.js` (üretim), yeni `js/kimlik.js` (saf tablolar ve türetim), `js/portre.js` (32 px yeniden çizim), `js/oyuncular.js` (baş sabit ölçek, saç çizgisi), `js/oyuncu-karti.js`, `js/kadro-dosyasi.js`, `js/canli-skor.js`, kayıt geçişi (sürüm 13). Kişi portreleri (16×16) ayrıca: aynı üreteçle 32'ye geçerler (hoca, kaptan, gazeteci) — RK4-b'nin ikinci dilimi.

## 5. Transfer bilgi akışı ve arama (R6b-1 yeniden)

### 5.1 Araştırmanın özü (kaynaklar §10)

- İki ayrı bilgi var ve FM tarzı “Piyasa” bunları karıştırıyor. **Kamu bilgisi anında ve herkese açık:** yaş, kulüp, uyruk, boy, kariyer, sözleşme bitişi, piyasa değeri tahmini, menajer adı (Transfermarkt ve benzerleri; İngiltere'de PFA sözleşmesi bitenlerin listesini kulüplere açar). “Sözleşmesi bu yaz bitecek 25 yaş altı sol bekler” listesi gerçekten bir dakikada çıkar — ama kalite, uyum ve isteklilik söylemez. **Kapalı bilgi emekle kurulur:** kim gerçekten satılık, kaça, oyuncu ister mi, hocanın sistemine uyar mı, karakteri — scout hunisi, menajer telefonları, kulüpler arası konuşma.
- **“Forma bulamayanlar / satılıklar” diye evrensel pano yoktur.** En yakını TransferRoom: satan kulüp **kendi beyan ettiği** oyuncuyu listeler, alan kulüp **ihtiyaç ilanı** verir (mevki, yaş, azami bedel), eşleşen ajanslar “pitch” atar (dakikalar içinde); büyük kulüpler çoğunlukla satmak ve kiralamak için kullanır.
- **Huni (Galatasaray 2014, rakamlı):** havuza adlar menajerlerden, teknik heyetten, idarecilerden ve basından girer; haftada ~100 yeni ad → 40 incelenir → 15–20 → hoca ~5'e indirir; hedef **her mevki için en az beş hazır oyuncu**; elenenler veritabanında kalır. FC Utrecht: veri sıralaması → 10–12 kişilik kısa liste → **menajerleri arayıp şartları ve istekliliği sorma** → canlı izleme kararı (“bir ay İspanya'da her maçı izleyecek bütçemiz yok”). Alt liglerde tipik yapı hoca + bir recruitment şefi + başkan; herkesin video paketi var; en büyük risk işin tek kişinin rehberine bağlı kalması.
- **Türkiye:** Wyscout 2016'dan beri TFF 2. ve 3. Lig'de (68 kulüp) → 1. Lig kulübü için abonelik gerçekçi. Menajer “restoran menüsü gibi listeleri” (Beşiktaş 2. başkanı), “öneriler sürekli gelir, önemli olan ne kadar bağımlı olduğunuz” (Giresunspor scout şefi), “transferleri artık menajerler yapıyor, scout yok, plan yok” (eski hoca, 2026). **Transfer komitesi** somut örnek (Kocaelispor 2026): başkan, başkanvekili, teknik asbaşkan, futbol direktörü, sportif direktör + hoca; havuz birlikte kurulur. Anadolu'da sportif direktör işini çoğu zaman “idari menajer” yürütür. Süper Lig 2025-26 net −217 M€, üç büyük −240 M€ → **ligin geri kalanı yapısal olarak satıcı, kiralayıcı ve bedelsiz alıcı.**
- **“25 yaş altı, bütçeye uygun sol bek” nasıl aranır:** içeride veri filtresi (saatler–1 gün) + dışarıda menajerlere soru ve/veya ihtiyaç ilanı (dakikalar–günler); ham liste 1–3 gün, güvenilir kısa liste canlı izleme ve menajer teyidiyle 2–4 hafta. Pencere içinde sıkışan kulüp menajer kanalına yaslanır.
- Kanıtın zayıf olduğu yerler: günlük gelen menajer teklifi sayısı; Türk kulüplerinde kısa liste büyüklüğü (yalnız GS 2014); Süper Lig kiralık oranı.

### 5.2 Bugünkü Piyasa'nın yanlışı ve doğrusu

- **Doğru:** serbestler ve sözleşmesi bitecekler kamu bilgisi; listelerde olmaları gerçekçi. Serbest listesinin düşüşteki ve dağınık adlarla dolu olması da gerçekçi (R4 öyle yaptı).
- **Yanlış:** (a) “forma bulamayanlar” bir pano değil, scout gözlemi ya da karşı tarafın beyanıdır — oyunda **not ya da mesaj** olarak gelmeli; (b) listeler kaliteyi, uyumu, istekliliği ve fiyatı söylüyormuş gibi duruyor; (c) başkan kendi başına filtre kurup sonuç alan kişi değil — filtre sportif ekibin işi, başkana iki aday olarak döner (R4'ün hoca→bütçe→araştırma→iki aday akışı tam da bu yüzden doğru yerde).

### 5.3 Öneri: Pano · Liste · Ara · Geçmiş (Piyasa kalkar)

- **Pano** (bugünkü): dönem sayacı, kasa, açık işler aşamasıyla, **gelen teklif ve öneriler**. Yeni: menajer “menüleri” (3–8 adlık kâğıt, haftada 0–2; dönemde sık, dışında seyrek), kulüp beyanları (“X müsait, kiralık da olur”), ihtiyaç ilanına gelen cevaplar. Çoğu gürültü; kime güvenileceği kişiye göre öğrenilir (OYUN_TASARIMI §9 kaynak güvenilirliği). Dosya sınıfı fırsat/rutin; cevap tek kart.
- **Liste** (bugünkü Takip'in büyümüş hâli): **kulübün kısa listesi** — hocanın, yardımcının, gözlemcinin ve menajer önerilerinin doldurduğu, mevki başına 3–5 ad, her adın yanında kaynak ve tek satır kanaat, haftada bir süzülen; elenenler soluk kalır (hafıza). Başkan listeyi **kurmaz, sorar ve ekletir** (“Takibe al” kalır). Liste büyüklüğü personelle (scout slotu) büyür: 3. Lig'de hocanın kafasındaki birkaç ad + menajer telefonları; 1. Lig'de scout ve video.
- **Ara**: kamu künyesi üzerinde **klavyeyle arama** (ad, kulüp; filtre çipleri mevki, yaş, sözleşme bitişi, boy, uyruk). Hazır filtreler “Sözleşmesi bitenler” ve “Serbestler” buradadır (Transfermarkt gerçekliği). Sonuç kartı kamu bağlamında (yetenek yok); karttan **“Araştırt”** (hoca/scout, 1–3 gün, dosya açar) ve **“Menajerini ara”** (isteklilik ve fiyat ancak sorarak; telefon konusu). Bugün 376 oyuncu; üst ligler ve yurt dışı havuzu geldikçe aynı arama, sonuç 20 ile sınırlı. Odadaki Transfer ekranı dışında Canlı Skor'da da aynı arama (kamu uygulaması), tek motor.
- **İhtiyaç ilanı:** telefondaki “<Hat> hattına oyuncu bulalım” zaten var; ona “menajerlere de duyur” seçeneği eklenir → sonraki günlerde Pano'ya gelen öneriler (kalite değişken, sızıntı riski: gazete yazar).
- **Geçmiş:** gelen ve giden (bu sezon süzgeciyle); kaçanlar dosya notu ve gazete (§2).
- Kıtlık ilkesiyle bağ (karar 60): bilgi personelle açılır; 3. Lig başkanı menajer menüleri ve kamu listeleriyle yetinir, bu da gerçekçidir.

## 6. Arayüz: sıfırdan baksaydım (RK3 → RK5)

### 6.1 Dürüst cevap

Yapı (masa → nesne → kâğıt, en çok iki derinlik, tek kart, tanıdık telefon, tarafsız Canlı Skor) sıfırdan kursam yine böyle olurdu; U araştırmasının dört yönü ve gerekçeleri geçerli. **Giydirme, hiyerarşi ve ayrıntı ise baştan ele alınmalı** — kullanıcının “okeyleme, yeniden düşün” isteği burada haklı: RK3 planlandı ama yapılmadı, bu yüzden ekranlar hâlâ iskelet dilinde. Aşağıdaki liste ekran görüntülerinden (2026-10-31 akış ve okunurluk setleri) ve araştırma ölçülerinden çıktı.

### 6.2 Somut sorunlar (ekran görüntülerinden)

1. **Beş yatay katman:** üst durum çubuğu, başlık + Kapat ×, sekmeler, kâğıt, iki satırlık alt şerit, geliştirici şeridi. Kâğıda yüksekliğin ~%55'i kalıyor. Alt şeritteki yardım cümlesi (“Okurken zaman durur · Esc: geri · Kapat: masaya bırak”) her ekranda, sürekli.
2. **Kalın kırmızı dosya çerçevesi + bulanık kahverengi oda** = loş ve kirli his; kâğıt odadan kopmuş gibi.
3. **Raporlar:** düz etiket–değer dizisi; “5.200.000,00 ₺” kuruş gürültüsü; aylık raporda hareket listesi tek sütun ve uzun; önceki rapora göre ne değişti yok; giriş–çıkış ayrımı yok. (Kullanıcının “okunaksız” dediği bu.)
4. **Düğme yerleri:** Kapat × kâğıttan uzakta ekranın köşesinde; ana eylemler (Katıl / Ertele) kâğıttan kopuk alt şeritte; İlerle büyük amber + kırmızı çerçeve, oyuncak gibi; masa şeridindeki metin düğmeleri 3B nesnelerle aynı şeyi iki kez söylüyor.
5. **Tipografi:** piksel yazı (Jersey 10) başlıklarda (“Dosya”, “Ajanda”, “Mali işler”, “Demirkapı SK”) Türkçe harflerde ve küçük boyda kaba; Plex ile yan yana iki dünya.
6. **Simge yok:** her şey kelime; haber türleri, konular, rapor kalemleri, sekmeler düz metin — kuru.
7. **Tarih üç yerde:** üst çubuk (“23 KAS PAZ 08:00” — kısaltma Pazar/Pazartesi'yi ayırmıyor), sol üst kutu, 3B masa takvimi ve duvar saati.
8. **Kadro tablosu:** 1× yüzler satırda gürültü; tek genişlikli yazıda sayılar okunuyor ama tablo ağır.
9. **Telefon + sağ panel:** cihaz içindeki uygulama (Canlı Skor) sağda kâğıda taşınınca dil karışıyor (cihaz mı, kâğıt mı?).
10. **Ara geçişler:** iş açılınca oda anında bulanıyor; mekân geçişi yürüyüşle var; İlerle'de zaman sahnesi var; gün başı için “ne oldu” özeti yok (gazete + telefon + dosya ayrı ayrı).

### 6.3 Araştırmadan alınan ölçüler

- Gövde 15–25 px, satırda 45–90 karakter, satır aralığı %120–145; kontrast ≥4,5:1 (krem kâğıtta gri ikincil yazı ve damga kırmızısı ölçülmeli). Tablolarda **eşit genişlikli rakam, sayılar sağa, tek renk tek satır zebra** (A List Apart denemesi: doğruluğu artırıyor, en az şikâyet), satır yüksekliği ~2× punto; etiket–değer için tanım listesi, yanında çizgi (büyütenler satırı çizgiyle bulur).
- Nakit sunumu kalıbı: üstte üç rakam — **bugün kasa / 90 günde en düşük nokta ve tarihi / 90 gün sonra** (runway bağlı ödemeler düşülerek) — altında ayrıntı; Simple bankasının “Safe-to-Spend” tek rakamı.
- Kâğıt arayüzlerinin ortak araçları: okunur bir çekirdek yazı + süs yazısı yalnız fazladan katman (Pentiment); belge statik ve ortada, **kontrol nesnenin üstünde ya da alt kenarda**; geçiş = kamera geri çekilip ekranı belgeye dönüştürmek; ses + tek kısa animasyon (damga, kepenk), uzun animasyon yok (Papers, Please; Strange Horticulture); okunurluk için kontur ve az dithering (Obra Dinn).
- Simge: 16–24 px'te en tanınır dil **1-bit piktogram** (Kare, Windows kılavuzu: siyah-beyaz başla, küme olarak tasarla, fiil değil ad, yüz ve harf kullanma); etiketli simgede doğru tahmin %88, etiketsiz %60 → **simgenin yanında kelime**; damga yalnız durum için; teletext mozaiği yalnız TV'de.
- Geçiş eşikleri: ≤1 sn doğrudan; 1–4 sn durağan dünya üstünde küçük gösterge; >4 sn sayaçlı çubuk ve kesme yolu; bitince **oyuncu tuşa basana kadar bekle**; görülmemiş içerik gösterme; ipucu yeri değil. Anlamlı arayı yükleme ekranından ayıran: ilerleyen gösterge, oyuncunun bitirdiği geçiş, **o anın gerçek verisi**, kesilebilirlik.

### 6.4 Öneri: ilkeler ve iki varyant

**Değişmeyen:** odak modeli, tek kart, telefon kalıbı, Canlı Skor kalıbı, tuşlar, koyu tema yok, amber yalnız ana eylem.

**İlkeler (RK3'ün dil bölümüne girecek):**
1. **Tek krom çubuk:** üstte kulüp · tarih ve saat · Duraklat; işin başlığı kâğıdın kendi üstünde; Kapat × kâğıdın köşesinde. Alt şerit tek satır: durum ve ana eylem; yardım cümlesi ilk üç açılışta, sonra yok. Geliştirici şeridi yalnız Test bilgileri açıkken. Tarih kutusu kalkar (3B takvim, duvar saati ve üst çubuk yeter).
2. **Kâğıt öne, oda geriye:** çerçeve ince, perde daha açık (%20 karartma); kâğıt odadan açık kenarla ayrılır. İş açılırken oda hafif geri çekilir, kâğıt masadan yaklaşır (220 ms kalır); kapanışta damga ya da kâğıt bırakma sesi (ses Aşama 10'da; şimdilik yalnız hareket).
3. **Birincil eylem belgenin alt kenarında sabit şerit** (Katıl / Ertele, Odaya dön); ikincil eylemler nesnenin üstünde; İlerle sağ altta sade, çerçevesiz.
4. **Rapor dili:** üstte üç büyük rakam, yanında önceki rapora göre değişim oku; altında etiket–değer; en altta hareketler üç sütunlu tablo (tarih · açıklama · tutar; giriş ve çıkış ayrı sütun ya da renk), tek renk zebra, eşit genişlikli rakam; kuruş yok, metinde “5,2 milyon ₺”, tabloda tam. 90 günün ödeme takvimi küçük çubuk şeridi (sparkline yalnız seyir için).
5. **Yazı:** gövde ve başlık Plex Sans; piksel yazı yalnız cihaz göstergelerinde (skorbord, saat, TV); gazeteye serif manşet, deftere el yazısı (RK3 adayları PNG ile).
6. **Simge seti:** 16 px 1-bit piktogramlar, 1 px çizgi, mürekkep rengi, kodla çizilir; her simgenin yanında kelime; masa şeridi, telefon konuları, haber türleri, rapor kalemleri, dosya sekmeleri, kart cevap yüzleri. Damgalar yalnız durum (KABUL, RED, ÖDENDİ, TESCİL), kâğıda hafif çarpık.
7. **Geçişler:** İlerle'de süre eşikleri (≤1 sn doğrudan; 1–4 sn bulanık oda + ilerleyen saat + tek satır; >4 sn “Öbür maçlar oynanıyor n/t” sayaçlı çubuk + Esc); durak özeti Enter'a kadar kalır; mekân geçişi 0,5–0,8 sn, atlanabilir. **Gün başı:** 08:00 durağının özeti zenginleşir — dünün sonucu ya da manşet, bugünkü ajanda, bekleyen kararlar, kasa tek rakam; masadaki bir kâğıt gibi (asistanın notu), ayrı ana ekran değil (RK §4 kural 1 korunur).
8. **Renk disiplini:** krem kâğıt, kahve mürekkep, mürekkep mavisi, kulüp kırmızısı yalnız kimlik (arma, damga, kart kenarı), amber yalnız ana eylem ve seçili. Kırmızı çerçeveler kalkar.

**İki varyant (RK3 taslakları, statik HTML → PNG, üç pencere genişliği):**
- **V1 “Kırtasiye”:** bugünkü yönün temiz hâli — tek krom, ince çerçeve, piktogramlar, tabular rakamlar, sade damga. Düşük risk, okunurluk en yüksek.
- **V2 “Kulüp evrakı 1999”:** antetli kâğıt (kulüp adı ve arma başlıkta), daktilo başlıkları, mühür ve paraf, karbon kopya renkli kâğıtlar (pembe makbuz, sarı not), teleks şeridi, faks başlığı; daha güçlü imza, okunurluk riski daha yüksek. Aynı ölçülerle (14/16 px, 4,5:1) kurulur; okunurluk aracı ikisine de koşar.
- İlk üç ekran: **mali rapor, oyuncu kartı (32 px yüzle), transfer panosu (Liste/Ara düzeniyle)**; sonra tek kart, gazete, gün başı kâğıdı, TV. Kullanıcı ekran başına seçer ya da karıştırır; seçilen taslak RK5'in ölçüsüdür.

## 7. Kullanıcının önermediği, yakışır dediklerim

- **Tarih kutusu odadan da kalksın** (üst çubuk + 3B takvim + saat yeter); üst çubukta gün kısaltması “PZT/PAZ” düzeltilsin.
- **Gün başı kâğıdı** (§6.4 madde 7): kullanıcının “ara geçiş ekranları, bilgileri” isteğine en ucuz ve en işlevsel karşılık.
- **Kaçanlar dosya notu + gazete** (§2): hafıza kaybolmaz, bölüm kalkar.
- **Portre yaşı kayıt tarihinden** (bugün 2026 sabit): oyuncu sezonlar geçtikçe yaşlanır; RK4-b'nin içinde.
- **Lig kademesiyle açılan çeşitlilik:** 3. Lig'de yabancı yok (TFF kuralı doğrulanacak), 1. Lig'de sınırlı, Süper Lig'de %56 — köken sistemi ve transfer havuzu buna göre; kulüp büyüdükçe kadro görünür biçimde değişir.
- **Arama Canlı Skor'da da** (kamu uygulaması); tek arama motoru.
- **Teletext 400 Transfer sayfası** (RK8-b): basın kulisi ve söylenti kanalı — menajer menülerinden ayrı, kamusal; gazetenin “Kulis” etiketiyle aynı kaynak.
- **Menajer kişileri:** R6b-1' için 2–3 menajer gerekir (güven öğrenilir). İçerik kuralı gereği Claude yalnız TEST yer tutucu yazar, kullanıcı değiştirir — onay ister.
- **Boy antrenmanda okunur** (baş sabit, gövde/bacak ölçekli); kaleci ve stoperler göze çarpar.
- **Hafta sonu özeti tek kart** (Papers, Please gün sonu gibi): sekiz sonuç, puan durumundaki yerimiz, kasaya giren bilet geliri — İlerle'nin hafta sonu geçişinin sonunda.

## 8. Sıra önerisi (taslak; kullanıcı kararı)

| Sıra | Tur | Maddeler | Not |
|---|---|---|---|
| 1 | **RK-D düzeltmeler** | 1, 3, 4, 5, 6, 8, 10, 11 (+ PZT/PAZ, tarih kutusu) | Bir günlük; akış ve okunurluk beklentileri güncellenir |
| 2 | **RK3 taslaklar** | 14 | Tasarım turu, kod değişmez; üç ekran × iki varyant PNG; kullanıcı seçer (bekleme süresi var, 3. sıradaki işle paralel yürür) |
| 3 | **RK4-b kimlik ve yüz** | 12, 13 | Köken, 7 rampa, 32 px, yaş katmanı, boy cm, 3B baş; kayıt sürümü 13; galeri PNG |
| 4 | **RK5 ekranlar** | 14 | Seçilen varyant; raporlar, kart, transfer, gün başı kâğıdı, simge seti, geçişler |
| 5 | **RK1-b balkon fare** | 2 | RK9'dan önce ya da onunla birlikte (yakın bakış figürü gösterir) |
| 6 | **R6b-1' transfer bilgi akışı** | 7, 9 | Liste/Ara düzeni, menajer menüleri, ihtiyaç ilanı, araştırt/menajerini ara |
| 7 | RK9 antrenman canlandırması | — | Kimlik ve boy üstüne |
| 8 | RK8-b TV kalanı | (10, 11 RK-D'de) | 400 Transfer, bildirim kartı, tartışma programı |

Alternatif: RK4-b'yi RK3'ten önce almak (yüz ızgarası karttan bağımsız) — ama kartın yeni dili yüz boyunu etkilediği için taslak önce çıkarsa iki kez çizilmez.

## 9. Kullanıcıya sorular (tercihim önde)

1. **Yüz ızgarası:** 32×32 (listede 32 px satır) — *tercih*; alternatif 24'te burunsuz.
2. **Köken ve boy kayda yazılsın mı** (sert veri; Canlı Skor'da uyruk ve boy görünür) — *evet*; alternatif yalnız kimlikten türetme.
3. **Lig kademesine göre yabancı kuralı** (3. Lig'de yok, 1. Lig'de sınırlı) oyuna girsin mi — *evet*; oyun kuralı sayılır, kullanıcı kararı.
4. **Piyasa yerine Pano · Liste · Ara · Geçmiş;** “forma bulamayanlar” ve “satılıklar” yalnız beyan/gözlem olarak — *evet*.
5. **Balkonda saat:** alt şeritte küçük — *tercih*; alternatif tamamen yok.
6. **Tıklama:** tek tık bakış, takip edilene tık ve çift tık dosya — *tercih*; alternatif tek tık doğrudan dosya.
7. **Arayüz:** iki varyant (Kırtasiye / Kulüp evrakı 1999), önce mali rapor, oyuncu kartı, transfer — *evet*; başka ekran öncelikli mi?
8. **Gün başı kâğıdı** (asistanın notu olarak masada) — *evet*.
9. **Menajer kişileri** TEST taslak olarak Claude yazsın mı — kullanıcı kararı.
10. **Sıra** §8 gibi mi, yoksa yüz/kimlik önce mi?

## 10. Kaynaklar (seçme; ajan raporlarının tamamı sohbettedir)

- Transfer: ESPN TransferRoom içeriden; Hudl “Discovery to deal” ve FC Utrecht; MRKT Insights “modern recruitment department”; Training Ground Guru PFA serbest listesi ve loan manager; Milliyet “Galatasaray'da scout devrimi” (2014); AA “Değişen transferler ve scouting” paneli; Goal TR Giresunspor scout söyleşisi; Hürriyet Wyscout TFF 2./3. Lig (2016); Kocaeli Gazetesi transfer komitesi (2026); Football Benchmark Süper Lig 2025/26; TFF Futbol Menajerleri Talimatı.
- Yüz ve köken: NewGAN Manager kaynak kodu (ulus→grup tablosu, `mapper.py`); sortitoutsi FM24 regen rehberi; FaceGen SSS; DiceBear pixel-art şeması; PMC HIrisPlex İstanbul (göz/saç); PMC Manisa Fitzpatrick; UK Biobank ten dağılımı; IBGE 2022; Avena 2012; Monk Skin Tone hex; nefes.com.tr Süper Lig yabancılar 2025-26; AA 2022-23.
- Yaşlanma ve boy: Rhodes 1998 (Norwood); Tokat AGA; Panhard 2012 (gri); YouGov sakal; topendsports Dünya Kupası 2018 antropometri; PMC İspanya yedek takım boyları; TÜİK boy haberleri; national-football-teams kulüp ortalamaları.
- Arayüz: Practical Typography; WCAG 1.4.3; GOV.UK table ve summary list; NN/g data tables, icon usability, response times, progress indicators; A List Apart zebra; Tufte sparkline; Lettermatic Pentiment; PlayStation Blog Obra Dinn; Game Developer Papers Please ve Strange Horticulture; 80.lv Disco Elysium UI; Microsoft icon guidelines; Pixelarticons; Game Developer “loading screens”; TRT Telegün.
