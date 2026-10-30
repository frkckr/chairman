# RN — Kullanıcı notları: telefon, yürüyüş, ekran ölçüsü (uygulama planı)

Durum: **onaylandı (kullanıcı, 2026-10-30: “A ile başla”; yürüyüş seçenek A); uygulandı ve kapandı (2026-10-30, dizüstü; `tur/rn-notlar`).** Sapmalar ve denetim sonuçları en sonda. `main`'e kullanıcının isteğiyle (“push et, main'e al”) RB'yi beklemeden alındı; büyük kapı dizüstünde koşabildiği kadarıyla (en sonda). Dal `claude/rn-notlar` (taban `main` a7a3489), etiket `tur/rn-notlar`. Uygulama Opus 5.5. Sohbette “R-not” diye anıldı.

Kaynak: kullanıcının 2026-10-30 notları (yedi madde; oyunu açıp Ayarlar › Geliştirici'de “Balkonda her saat antrenman (TEST)” ile balkona baktıktan sonra), Claude'un kodla ve tarayıcıda (1366×650, 1366×768, 1536×740, 1536×864 ve geniş pencere) doğruladığı inceleme ve kullanıcının sıra onayı (“Onayla, planla”; YOL_HARITASI karar 68). Antrenman araştırması ayrı kayıttadır: [antrenman-arastirma.md](antrenman-arastirma.md).

## 0. Program revizyonu (karar 68; belge, bu planın ilk commit'i)

| Not | Bulgu (kod ve tarayıcı, 2026-10-30) | Tur |
|---|---|---|
| 1. Balkonda antrenman izlenemiyor; bir gruba, oyuncuya ya da bölgeye bakmak, yakınlaşmak | Balkon kamerası sabit (göz ana tribünün arkasında, bakış saha ortasına, 46°); gruplar sahanın dört yanında, 50–100 m uzakta figür ~10 px; iş açılınca sol yarıda yalnız koşu turu; dar karede iş tam genişlik ve saha hiç görünmüyor; antrenman kâğıdı odak başlığıyla çakışıyor | **RB** (bakış ve yakınlık); çakışma **RN-c** |
| 2. Antrenman çeşitliliği; bireysel, küçük grup, maç, koşu, orta-kafa; ekip ve personel kalitesi; aşırı yüklenme | Beş canlandırma, üç gün türü, sabit grup sayıları; personelin ve tesisin antrenmana etkisi yok | **R6b-2** (araştırma kaydı `antrenman-arastirma.md`) |
| 3, 7. Telefonu alma, dönme ve odaya dönüş robotik | Altı evre arka arkaya, 12,3 sn; bakış ele ve yere kilitli; görüş açısı yürürken değişiyor | **RN-b** |
| 4. Dizüstünde düğme ve menüler iç içe | Oyun alanı pencerenin altında 190 px boş bırakıyor; dizüstünde alan 640–733 px, yazı 14 px tabanında | **RN-c**; 16:9 pencerenin yanları **RB** |
| 5. Telefonda Bekleyenler gereksiz; telefon önce ortada, iş olunca sola | Odada telefon hep iki sütun, konuşma dışında sağ panel Bekleyenler; aynı bilgi ana ekranın bildirim kartlarında, listedeki etiketlerde ve Sonra yığınında var | **RN-a** |
| 6. Transferde oyuncu arama; başkanın görebildiği bilgi; kulüple ve menajerle temas, gözlemci raporu | Arama yok; oyuncu kâğıdında yalnız beş kaynaklı bilgi; temas ve rapor yok; veri yalnız 16 kulüp ve 24 serbest | **R6b-1** |

**Sıra:** RN → RB → R6b-1 → R6b-2 → R6b-3 (kriz, sözleşme pazarlığı, satış; pilot P01 ve P07) → R7 genel kurul; sonra H3. Her tur kendi başında planlanır ve onaylanır (karar 12). RN ve RB birlikte, büyük kapıdan sonra (masaüstünde) `main`'e alınır (karar 63).

**Sonraki turlara kalan kullanıcı kararları:** RB — geniş pencere düzeni (3B sahne solda 4:3, kâğıt işleri sağdaki bantta; 4:3 ya da dar pencerede bugünkü örtü düzeni; STIL_REHBERI §1'i değiştirir). R6b-1 — tahmini piyasa değeri kamuya açık sayı olarak görünsün mü; üst lig oyuncu havuzu için kulüp adları kullanıcıdan mı, “1. Lig'de bir kulüp” etiketli TEST havuz mu.

## Kapsam

### RN-a — telefon: önce ortada, iş olunca sola kayar; Bekleyenler kalkar (kullanıcı isteği)

**Bugün:** odada telefon her zaman iki sütundur (`js/ekran-oda.js` `telIkiSutun`: balkon dışında hep), odak boyu `telefon` (%92); konuşma dışındaki her ekranda sağ panel Bekleyenler'dir (`js/ekran-telefon.js` `telBekleyenler`: cevabını bekleyen karar, gelecek cevap, yeni mesaj). Aynı bilgi ana ekranın bildirim kartlarında (“Cevap bekliyor”), Mesajlar listesinin etiket ve rozetlerinde ve masadaki Sonra yığınında vardır.

**Yapılacak:**

- Bekleyenler kalkar (`telBekleyenler` silinir). Sağ panel yalnız iş varken açılır: konuşmada karar kartı, cevap bekleme satırı, açık konu menüsü ya da oyuncu seçimi, dosyada bekleyen karar bağlantısı; Canlı Skor'da açık sayfa (maç, takım, oyuncu). `telefonIsPaneli` iş yokken boş döner.
- İş yokken telefon odak kabının ortasında tek cihazdır: ana ekran, Mesajlar listesi, Canlı Skor listesi ve işsiz konuşma. Konuşmada “Yeni konu aç” telefonun altında kalır; basınca konu menüsü panelde açılır ve telefon sola kayar.
- Geçiş: odak kabının genişliği (`telefon`, %92) ve Kapat düğmesi yerinde kalır, yalnız iç düzen değişir. Telefon yeni yerine kayar: çizimden önceki ve sonraki konum farkı ölçülüp ters dönüşümle başlatılır ve sıfıra çekilir (~0,28 sn, yumuşak çıkış). Panel ilk görünüşünde ~0,22 sn soluktan ve biraz sağdan belirir. Panel kapanınca telefon ortaya döner. Geçiş görüntü içindir; Duraklat okumayı ve gezinmeyi engellemediği gibi bunu da engellemez (2.8B).
- Balkonda ve maçta tek telefon değişmez (balkon RB'de).
- Klavye ve odak bugünkü gibi: Tab sırası telefon, sonra panel; Esc zinciri aynı.

**Kabul:** ana ekranda, Mesajlar'da ve Canlı Skor listesinde panel yok, telefon kabın yatay ortasında (fark ≤ 2 px). Konuşmada karar ya da bekleme varsa iki sütun (telefonun sağ kenarı panelin solunda). İşsiz konuşmada “Yeni konu aç” → panel açılır, telefon sola; Esc menüyü kapatınca telefon ortaya. Canlı Skor'da maç satırı → sayfa panelde, ‹ ile listeye dönünce telefon ortada. Geçiş sırasında tıklama kaybolmaz. R2'nin öbür kuralları (okuma yeri, tek bekleme satırı, eşik ipucu, oyuncu seçimi, 800×600 büyük yazı) aynen.

### RN-b — yürüyüş: kısa, örtüşen, ilgi noktasına bakan (notlar 3 ve 7)

**Bugün (ölçüldü):** odadan balkona ve geri her biri 12,3 sn: telefonu al 0,85 → baş yola 0,5 → kalk 1,6 → 7,0 m yürü 6,3 → otur 2,2 → telefonu koy 0,85. Evreler arka arkaya, hiçbiri örtüşmüyor. Telefonu alırken ve koyarken bakış ele dönüyor (%55); telefon görüşten çıkınca bir anda kayboluyor. Yürürken bakış yolun 2,5 m ilerisine ve biraz aşağı kilitli. Görüş açısı yürüyüş boyunca 56°'den 46°'ye kayıyor; yürürken yakınlaşma hissi veriyor. Adım temposu kusursuz eşit.

**Seçenek A (Claude'un önerisi): kısa ve insani yürüyüş.** 2026-10-04 kararı (adım adım, insan gibi yürüyüş) sürer, şikâyetin kaynağı olan mekanik his giderilir:

1. **Örtüşen evreler.** Telefonu alma kalkışın başıyla, baş dönüşü kalkışla, ilk adım kalkışın sonuyla, oturma son adımlarla, telefonu koyma oturmanın son kısmıyla birlikte olur. Evreler zaman penceresidir; örtüşmede komşu evrelerin konumu ve bakışı yumuşak geçişle karışır (konum, hız ve ivme sürekli).
2. **Kısa ritüel.** El hareketi 0,85 → ~0,55 sn; bakış ele dönmez (%55 → ~%10). Kalkarken telefon elle aşağı iner ve görüşten çıkar (cebe girdiği an görünmez); varışta oturmanın içinde masaya bırakılır.
3. **Bakış ilgi noktalarına.** Yürürken bakış yolun önüne değil, sırayla ilgi noktalarına döner: odadan çıkarken kapı, kapıdan geçince saha, son metrede oturulacak yer; dönüşte kapı, masa, koltuk. Hedef yol metresine bağlı yumuşak geçişle değişir (durum tutmaz; duraklatmada ve kare saatiyle aynı sonuç). Bakış göz hizasındadır, yere değil; baş dönüşünün açısal hızı sınırlıdır.
4. **Görüş açısı yürürken sabit.** Oda (56°) ile balkon (46°) arasındaki fark kalkışın ve oturmanın içinde kapanır.
5. **Küçük pürüzler.** Kapı eşiğinde hız düşer (~0,7 m/sn, yol planlayıcısında hız sınırlı bölge); ilk iki adım kısadır; adım boyu her yürüyüşte birkaç yüzde değişir (sunumun kendi sayacından, belirlenimci; kayda ve kurala girmez).
6. **Süre.** Toplam 7–8,5 sn (bugün 12,3); tıklayınca atlama aynen. Değerler TEST (`STIL.yuruyus`, `STIL.oda.yol`).
7. **Ortak işlevler** (`js/yuruyus.js`) locaya girişle paylaşılır: yeni davranış isteğe bağlı parametrelerle gelir, locaya girişin varsayılanı değişmez (N11 ölçüsü aynen).

**Seçenek B: kalkış ve yumuşak kesme.** Başkan kalkar ve kapıya döner (~1,5 sn), 0,4 sn'lik kararma geçişiyle balkon sandalyesinde oturur (~0,6 sn); toplam ~2,5 sn. Hızlıdır ama 2026-10-04 kararını (adım adım yürüyüş) değiştirir ve oda ile balkon arasındaki mekân hissi kaybolur.

**Kabul (A):** `python araclar/yuruyus-yakala.py` (kare saatli; dizüstünde koşar): gözün ivmesi ≤ 6 m/sn² ve kareler arası hız sıçraması ≤ 0,1 m/sn (N6 eşikleri aynen); toplam 7–8,5 sn; 8–12 adım; bakışın açısal hızı ≤ 150°/sn (yeni ölçü); yürürken bakışın yatayla açısı ≥ −12° (yere bakmıyor); kapıdan geçtikten 1 m sonra bakış saha yönünde; el her uçta ≤ 0,6 sn görünür; yürüme evresinde görüş açısı sabit. Akış §15 (doğal yürüyüş) ve §12 (yürüyüş ortasında Duraklat) yeni eşiklerle; bu dizüstünde gerçek zaman beklemesiyle düştükleri için masaüstünde koşar. Film şeridi önce ve sonra (`--onek once`, `--onek rn`).

### RN-c — ekran ölçüsü: oyun alanı pencereyi kullanır (not 4) ve balkon kâğıdı

**Bugün (ölçüldü):** oyun alanı `(100svh − 190px) × 4/3` genişliğindedir (`index.html` `.screen`). Odada alanın altında yalnız geliştirici satırı (30 px) var; 190 px'in çoğu boş. Maçta alt şerit 52 px. Yazı R1 kararıyla 14 px'in altına inmediği için küçük alanda her şey sıkışıyor.

| Pencere | Bugün | Sonra (beklenen) |
|---|---|---|
| 1366×650 (1366×768 dizüstü, tarayıcı ve görev çubuğu düşülmüş) | 640×480 | ~819×614 |
| 1536×740 (1920×1080, %125 ölçekli dizüstü) | 733×550 | ~939×704 |
| 1920×950 (masaüstü) | 1013×760 | ~1219×914 |

**Yapılacak:**

- **Pay ölçülür.** Odada yalnız sayfa kenarı (~36 px); bültende ve maçta alt şeridin gerçek yüksekliği eklenir (şeridin boyu değişince güncellenen `--ekran-pay`). Geliştirici alanı payın dışında kalır (aşağıda, kaydırınca). En küçük 640 px ve pencere genişliği sınırı aynen.
- **Yazı tabanı değişmez** (gövde 14, metin 12 px; R1). Alan büyüdüğü için oranlar kendiliğinden açılır.
- **Çizim maliyeti:** iç çizim 1920×1440'ta sabittir; büyüyen yalnız son işlem (tek doku okuması). Dizüstünde çizim katı 1'den 2'ye çıkabilir; kare süresi ölçülür.
- **Balkon kâğıdı odakla çakışmaz.** Bugün kâğıt sağ üstte, iş de sağ yarıda açılınca başlıkla üst üste biniyor. Odak açıkken kâğıt sola, tarih kutusunun altına geçer ve daralır (zaten etkileşimsiz; yalnız okunur). Kalıcı yerleşim RB'de.
- 16:9 pencerenin yanlarındaki boşluk ve dar karede (< 820 px) balkonun yarım odağı RB'nin konusudur.

**Kabul:** üç pencerede oda ve maçta alan beklenen ölçüde (±4 px); sayfa dikey kaymıyor (geliştirici alanı hariç); maçta alt şerit tam görünür. `okunurluk.py` bütün sahneler eşikte: pencere tablosu yeni formüle göre yeniden hesaplanır (kutular 640/800/1186 aynı kalır, karşılaştırma bozulmaz), iki dizüstü penceresi (1366×650, 1536×740) eklenir. Balkonda dosya, ajanda ve telefon açıkken kâğıt ile odak kabının dikdörtgenleri kesişmez ve kâğıt tarih kutusunu örtmez. Akışın pencere boyuna bağlı denetimleri (800×600, 1180×700, 1100×810) yeni formülle yeniden ölçülür; dar kare (< 820) bekleyen denetimin penceresi gerekirse küçültülür.

### RN-d — belgeler

- Plan başında (ilk commit): bu plan, YOL_HARITASI karar 68 (sıra ve notların eşlemesi) ve devam notu, CLAUDE.md “Program” maddesinin sırası, `araclar/plan/OKU.md`, araştırma kaydı `antrenman-arastirma.md`.
- Kapanışta: OYUN_TASARIMI §2 tablosunun telefon satırı ve §6 balkona yürüyüş cümlesi; STIL_REHBERI §1 (oyun alanının payı), §7 (telefonun açılışı ve geçişi, balkon kâğıdı); CLAUDE.md “Bugün çalışan” (telefon ve Bekleyenler cümlesi); TEKNIK_PLAN §10 gerekirse; KAPILAR (yürüyüş satırına yeni ölçüler, telefon satırında Bekleyenler kalkar); YOL_HARITASI karar 69 (RN'nin Claude kararları), tamamlanan turlar tablosu ve devam notu; BORCLAR gerekirse.

### RN-e — denetimler (karar 63; motor ve kural dosyası değişmez)

- Hızlı: `node araclar/hizli.js` (ad denetimi; motor ve kural dosyası değişmediği için maç ve kariyer denemesi koşmaz).
- Akış bölümleri: 30, 3, 21, 19, 27 (telefon), 23 ve 34 (balkon kâğıdı), 26 (yazı), 1; 15 ve 12 (yürüyüş; masaüstünde).
- `python araclar/yuruyus-yakala.py` önce ve sonra; `python -X utf8 araclar/okunurluk.py` (yeni pencere tablosu); `python -X utf8 araclar/kontrol.py`; görüntüleri incele.
- Büyük kapı: RN tek başına `main`'e alınmaz; RB ile birlikte masaüstünde (akışın tamamı, iki sezon tabanı `--ayni`, oturum sonu `--ayni --seyrek`, `kontrol.py`, `akis-2d.py`, `okunurluk.py`; motor değişmediği için hız ölçümü R4'teki gibi).

## Yapılmayacaklar

- Balkon kamerası, gruba ve oyuncuya bakış, yakınlaşma, geniş pencere düzeni (RB); antrenman çeşitleri, ekip ve yük (R6b-2); transfer arama ve bilgi akışı (R6b-1).
- Odakta kameranın masadaki nesneye eğilmesi (perde bulanık, etkisi görünmüyor; dokunulmaz).
- Motor, kural, kayıt biçimi, ses, yeni içerik.

## Claude kararları (onayla değişebilir)

- **Panel yalnız iş varken açılır;** kabın genişliği sabit kalır, yalnız telefon kayar (Kapat düğmesi yerinden oynamaz).
- **Yürüyüşte bakış ilgi noktalarına,** görüş açısı yürürken sabit; ritüel kısalır ama telefon taşınır (tek telefon kuralı).
- **Ekran payı ölçülür,** yazı tabanı aynen; büyüyen alan sıkışmanın asıl ilacıdır.
- **Balkon kâğıdı odakta sola geçer** (geçici; RB yeniden kurar).

## Kullanıcının cevabı

- Yürüyüş: **A** kısa ve insani (~7–8,5 sn; adım adım, örtüşen, ilgi noktasına bakan) — kullanıcı, 2026-10-30: “A ile başla”. B (kalkış ve yumuşak kesme) uygulanmaz.

## Tahmin

RN-a 2–3 sa, RN-b 3–4 sa, RN-c 1–2 sa, belgeler ve denetim 1–2 sa; toplam ~8–10 sa (dizüstü). Sıra: c → a → b → d → e (c en küçük ve öbürlerinin ölçüsünü değiştirir).

## Sapmalar

1. **Yürüyüşte konumlar ağırlıkla karıştırılmadı, üst üste eklendi.** İlk sürüm örtüşen evreleri ağırlıkla karıştırıyordu; geçişte gözün ivmesi 8 m/sn²'ye çıktı (eşik 6). Kalkış, yürüyüş ve oturma artık yolun uçlarına göre öteleme olarak toplanır: her biri kendi hız profiliyle, toplam hız ve ivme sürekli (5,9 m/sn²).
2. **Dönüşte son metrede bakış masaya değil yolun ilerisine.** Masanın yanından geçerken ona bakmak başı 175°/sn döndürüyordu; masaya dönüş oturmanın içinde, yumuşak (en çok ~142°/sn). Baş dönüşü telefona uzanmayla başlar, kalkışın sonunda biter.
3. **Süre 8,49 sn** (planda 7–8,5; eskiden 12,34): yol 7 m ve iki keskin dönüş; beş ayar seti denendi, daha kısası ivme eşiğini aştı. Yürüme hızı 1,5 → 1,6 m/sn, dönüşte yavaşlama 0,35 → 0,2, ivme 1,1 → 1,3; kapı eşiğinde en çok 1,05 m/sn.
4. **Telefon geçişine güvenlik süresi.** Tarayıcı kare işleyemediğinde (başsız deneme, gizli pencere, yavaş makine) CSS geçişi “bekliyor” kalıp telefon ötelenmiş, panel saydam duruyordu; süre dolunca (0,36 sn) geçiş kesilir. Başsız Chromium'da geçişin kendisi gözlenemedi; akış 30 başlangıçtaki ötelemeyi ve sondaki yeri denetler.
5. **Ekran ölçüleri** planın tahmininden biraz büyük (pay 32 px): 1366×650 → 825×618, 1536×740 → 944×708, 1920×950 → 1225×918; maçta 1536×740 → 852×639. Bülten için şeridin varsayılan boyu ölçülen 52 px (“Maça geç”te sıçrama yok).
6. **Akış denemesinin pencereleri:** dar kare (640 px) denetimleri 800×600 yerine 672×600'de (yeni payla 800×600 penceresi 757 px kare verir); 1180×700 (680 px kare) → 1180×540. 3. bölümün yerleşim ölçümü panelsiz ekranda telefonun ortada olmasını bekler ve kayma geçişinin bitmesini bekler. 30 ve 34'te balkona yürüyüş tıklayarak atlanır (`balkona_atla`; yürüyüşün kendisi §15'te — dizüstünde gerçek zaman beklemesi B42).
7. **Okunurluk aracı** pencere tablosu yeni formüle göre (kareler 640, 800, 1186 aynı) ve iki dizüstü penceresi (1366×650, 1536×740) eklendi; **yürüyüş ölçüm aracı** örtüşen pencereleri okur, bakışın açısal hızını, yürürken eğimi ve görüş açısını, elin görünme süresini ölçer.

8. **Büyük kapıda bulunan:** dar karede ortadaki telefon iki sütundakinden farklı boydaydı (tek sütun bütün genişliği alıyordu); ortadaki sütun artık iki sütundaki telefon sütunuyla aynı genişlikte (en az 17 em, %42) — telefon iki düzende aynı boyda, kayarken boyu sıçramaz. Akış 24'ün okuma yeri denetimi Playwright'ın tıklamadan önce listeyi kendisi kaydırmasına takılıyordu (gerçek tıklama kaydırmaz): okuma yeri artık tıklama anındaki yerden ölçülür. 31'de de balkona yürüyüş tıklayarak atlanır.

**Denetim sonuçları (dizüstü, 2026-10-30):**

| Denetim | Sonuç |
|---|---|
| `hizli.js` | geçti (ad denetimi; motor ve kural dosyası değişmedi) |
| `yuruyus-yakala.py` | gidiş ve dönüş 8,49 sn (önce 12,34); ivme 5,88 / 5,98 m/sn² (önce 3,6); hız sıçraması 0,088 m/sn; 11 adım; baş dönüşü 37 / 142°/sn; yürürken eğim −12,9° / −10,6°; görüş açısı yürürken sabit; el her uçta 0,55 sn |
| `akis-deneme.py` 1, 3, 19, 21, 23, 26, 27, 30, 34 | geçti |
| `akis-deneme.py` 15, 12 (yürüyüş, gerçek zaman) | dizüstünde koşmaz (B42); masaüstünde büyük kapıda |
| `okunurluk.py` | beş pencerede bütün sahneler eşikte |
| `kontrol.py` | geçti (sayfa ve betik hatası yok; görüntü incelendi) |
