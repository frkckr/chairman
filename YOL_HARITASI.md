# Chairman — yol haritası

Son güncelleme: 2026-10-23 (F2 — maç sonucu kariyere, maç sonu kartı ve TEST “Maçı bitir” kapandı, `tur/f2`; sıradaki F3. F0'da “idare eder” kapısı kullanıcı kararıyla geçti). Bu dosya iş sırasının, geçerli kararların ve tamamlanma durumunun ana kaynağıdır. Oyun kuralları [OYUN_TASARIMI.md](OYUN_TASARIMI.md), mimari [TEKNIK_PLAN.md](TEKNIK_PLAN.md), sunum [STIL_REHBERI.md](STIL_REHBERI.md), motorun ilkeleri ve kararları [MAC_MOTORU_GERCEKCILIK_PLANI.md](MAC_MOTORU_GERCEKCILIK_PLANI.md), motor programı [FUTBOL_KUTUPHANESI §12](FUTBOL_KUTUPHANESI.md#12-program), başkanlık programı [araclar/plan/f-program.md](araclar/plan/f-program.md) içindedir. Kapanmış işlerin ayrıntılı kayıtları git etiketlerindedir (sondaki tablolar).

## Şu an neredeyiz?

Çalışan ürün: başkan odasıyla açılan, içeriğini kullanıcının yazacağı boş kabuk kariyer (kayıt, takvim, para, mesele, iki cevaplı karar, telefon, dosya, defter, balkondan antrenman gözlemi) ve maç günü. F1'den (2026-10-23) beri kariyer ligin 16 kulübünü, kadrolarını (Demirkapı ve Akdeniz `js/kadrolar.js`'ten, öbürleri TEST üretimi) ve 30 haftalık TEST fikstürünü taşır; maç kariyerden kurulur (Stada git sayfayı maçın kimliğiyle açar), deplasmanda ev sahibinin statında oynanır. Maç tepeden 2D izlenir (numaralı pullar, kompakt kasaba stadı, top ipuçları; P2, 2026-10-21); figürlü loca bakışı TEST'tir ve figürlü motor antrenman sahneleri içindir. Maç motoru 2026-10-07'den 2026-10-23'e dek geliştirme odağıydı: gerçekçilik turları (T0–T23, A2–A9, H1, U1, M0–M3), futbol kütüphanesinin Z turlarının birinci bölümleri, K1, S1 ve program A–E tamamlandı. 2026-10-23'te “idare eder” kapısı kullanıcı kararıyla geçti; odak başkanlık ve oyun içi sistemlerdir, motor işi kullanıcının izleme notlarıyla yan hatta sürer. F2'den (2026-10-23) beri maç sonucu kariyere bir kez işlenir: maç bitince “Maç bitti” kartı açılır, “Odaya dön” sonucu kaydeder (puan durumu, son maçlar, oyuncu sayaçları, TEST ceza ve sakatlık), oda 21:00'de sıradaki haftayla açılır; hafta → maç → sonuç → sonraki hafta döngüsü kayıtla çalışır. Maçta “TEST Maçı bitir” kalan maçı görüntüsüz oynatır (yayından önce kalkar). Diğer lig maçları henüz oynanmaz (3.8).

**Program (2026-10-23, kullanıcı onayı):** motor programı A–E kapandı (`tur/a-temizlik`, `tur/b` … `tur/e`; kapsam ve sonuç [FUTBOL_KUTUPHANESI §12](FUTBOL_KUTUPHANESI.md#12-program)), “idare eder” kapısı geçti. **F — başkanlık:** F0 belge ve eşitleme (2026-10-23) → **F1 fikstür, maç kimliği, kadrolar ve deplasman statı** (3.1, 3.4; **kapandı 2026-10-23, `tur/f1`**) → **F2 maç sonucunun kariyere işlenmesi** (3.4–3.6; maç sonu ekranı, görüntüsüz maç ölçümü; **kapandı 2026-10-23, `tur/f2`**) → **F3 hoca, kadro seçimi, rapor ve maçın okunması** (3.2, 3.3; beklenen gol, ekibin yorumu, gözlem notu) → **F4 tek kart** (dosya, karar paneli, telefon, karar anı) → **F5 antrenman sahnesi ve arka planda izleme** → **F6 2.9 ve ilk içerik** (P12, TEST taslak; 3.7'nin ilk kısmı). F2 ile (2026-10-23) hafta → maç → sonuç → sonraki hafta döngüsü kayıtla çalışır (“oyuna başlama” eşiği geçildi). **Yan hat:** kullanıcı arada 2D maç izler, notlarını sohbette yazar; notlar teşhis tablosuna (`araclar/plan/izleme-notlari.md`) alınır, tek anahtarlık ayar tur açmadan yapılır, davranış işi küçük motor turu (İ1, İ2 …) olarak F turlarının arasına girer. Arkada (notlar isterse öne gelir): Z6-2 bitiriş, Z5-2 savunma, Z4-2 ve Z7-2'nin kalanı, Z10 güncel kurallar. Her tur kendi dalında, kendi başında planlanır ve onaylanır, kapanınca durulur. F'nin planı [araclar/plan/f-program.md](araclar/plan/f-program.md).

- [x] Kariyer temeli (Aşama 1): kimlikler, takvim, para, sürümlü kayıt, Windows/Electron çevrimdışı denemesi.
- [x] Günlük başkanlık sistemleri (2.1–2.8W): mesele ve zaman, gün içi kayıt, koşula bağlı olay katmanı, ekip ve yetki devri, iki cevaplı karar, söz ve hafıza, telefon/dosya/defter, genel duraklatma, balkon ve antrenman gözlemi; 2.8L'den beri içeriksiz.
- [x] Tek kulüp stadı (oda penceresi, balkon, maç aynı tariften; tarif v2 kompakt kasaba stadı, yamaç terasları, inşaat bölümü), maç öncesi ekranı, maç telefonu.
- [x] Maç motoru: top fiziği, hareket, temas, hava topu, vuruş, kaleci, duran top sahneleri ve sahne protokolleri, plan katmanı ve iki canlı tarz, savunma ve bitirişin birinci bölümleri; tohumlu, tekrarlanabilir; maç 20 dk oyun saati, ×1/×2/×4 izleme, önemli anlarda normal hız.
- [x] 2D maç görünümü (P1–P2): tepeden kamera ve üç yakınlık, pullar, havadaki topun okunması, falso, karar anı kartı.
- [ ] 2.9 günlük akışın sınanması ve oyun içeriği (F6: ilk paket P12 Claude'un TEST taslağı, metinleri kullanıcı değiştirir; içeriğin geri kalanını kullanıcı yazar).
- [ ] Aşama 3–10: maç–kariyer bağlantısı (F1–F3, F6), transfer ve ekonomi, tam sezon, adaylık, uzun kariyer, büyüme, Avrupa, ürün.

### Devam notu

Bu not yeni sohbetin başladığı yerdir; her oturum kapanışında güncellenir (eskisi silinir, git'te kalır).

**Makine durumu: boşta (2026-10-23, dizüstü).** Etkileşimli oturum, oto mod yok. F2 `claude/f2-sonuc` dalında üç commit ve `tur/f2` etiketiyle kapandı; `main`'e alma ve push kullanıcının sözüyle (henüz yapılmadı). Öbür makinede: `git fetch --prune --tags`; dal push edildiyse `git checkout claude/f2-sonuc`, `main`'e alındıysa `main`'de `git pull --ff-only`.

**2026-10-23, dizüstü: F0 ve F1** (ayrıntı `git show tur/f1:YOL_HARITASI.md`): kapı geçti, başkanlık programı F; lig ve 30 haftalık TEST fikstürü, kariyer kadroları, maç kimliği ve tohumu, maç girdisi kariyerden, maç sınırı sayfa yeniden yüklemesi, deplasman statları.

**2026-10-23, dizüstü: F2 kapandı (`tur/f2`).** Kullanıcı isteği: sıradaki adım planlansın ve maça girince “maçı hızlı bitir” TEST düğmesi olsun (fikstür ve sıradaki maçlar var; maçı bitirip sonraki maça geçerek akışı görmek). Plan `araclar/plan/f2-uygulama.md`; kararlar Geçerli kararlar 38. Üç commit:
- **F2-a kural:** `js/mac-sonuc.js` `macSonucuUygula` — sonuç maç kimliğiyle bir kez (ikinci uygulama, yanlış tohum, bitmemiş maç, bekleyen maç günü, devralınan hafta, kadroyla uyuşmayan kayıt reddedilir); `k.maclar[id]` skor, tohum, kimlikli goller, kartlar, sakatlıklar, değişiklikler, istatistik ve rakip başkanın karar anındaki seçimi (`protokol`); geçmişte `tur:'mac'`; oyuncu sayaçları (gol, sarı), TEST ceza (kırmızı, iki sarı, 4 sarı; oynamayan cezalı çeker) ve sakatlık (tedavi ve çıkış, dönüş günü); zaman 21:00'e (arada ajanda işi varsa orada durur, kaçırılmaz); sıradaki haftanın maç günü işi (30. haftadan sonra yok). Kayıt sürümü 7 kaldı. `kariyer-deneme` 3.5 (redler, kurallar, kaydet–yükle, 14. hafta zinciri, sezon sonu, bozuk girdiler, kısa gerçek maç).
- **F2-b ekran:** “Maç bitti” kartı (`js/ekran-mac-sonu.js`; düdükten 8 sn sonra, hızlı bitince hemen; skor, goller, kartlar, sakatlıklar, TEST ikiz satırı) ve “Odaya dön” (kayıt yazılamazsa sayfa yenilenmez, “Yeniden dene”); şeritte “TEST Maçı bitir” (`js/mac-sahnesi.js` `hizliBitirIste`: kalan maç görüntüsüz, kare başına 30 ms; maç öncesinde santra yolu, karar anı atlanmaz; ikiz `izlemeKapat` ile temiz bırakılır); odada Canlı Skor'da son maç.
- **F2-c araçlar ve belgeler:** `araclar/sezon-deneme.js` (3.6: görüntüsüz haftalar, belirlenimcilik, maç başına süre), `akis-deneme.py` 19, KAPILAR, belgeler.
- **Denetimler:** `kariyer-deneme` hepsi geçti; `mac-deneme 4` “sonuç aynı”; ad denetimi temiz; `ikiz-deneme 4` aynılık 4/4; `kontrol.py` (maç ekranı, düğme) hatasız; `akis-2d` geçti; `akis-deneme 19` geçti; `sezon-deneme 3 --kaydet` belirlenimci. Tarayıcıda (uygulama paneli) iki hafta uçtan uca oynandı: kart, Odaya dön, kayıt hatası yolu, 14. hafta deplasmanı ve bültende önceki maçın cezaları; aynı tohumda hızlı bitirme ile ×16 normal oynatma birebir aynı sonucu verdi (ikiz de aynı). Motor dosyalarına dokunulmadı. Kapanış (`oturum-sonu d.json --ayni --seyrek`, 75 dk; motor dosyalarına dokunulmadı): 40/40 birebir, sağlık aralığı dışı 0, tekrarlanabilirlik aynı; senaryolar 29'un 26'sı — `c-1v1` eğim 14,0, `d-sahne` [3], `d-topcu` 289/290, F1 kapanışındakiyle aynı bilinen borçlar. İnceleme düzeltmelerinden sonra: `kariyer-deneme` geçti, `mac-deneme 4` “sonuç aynı”, ad denetimi temiz, `akis-deneme` 19 (karşılaştırma dahil) geçti; 1, 16, 18 geçti; 11 çerçeve denetimlerini geçip balkon yürüyüşü beklemesinde düştü (bu dizüstünün bilinen zaman aşımı, eski kodla da). Hız bütçesi motor değişmediği için ölçülmedi.
- **Çok ajanlı inceleme (kullanıcı yokken; 38 ajan, bulgu başına biri çürütmeye biri yeniden üretmeye çalışan iki şüpheci):** 16 bulgu. Düzeltilenler: aynı maçta ikinci (daha kısa) sakatlık ilkini eziyordu — en uzun dönüş kalır; sıradaki maç günü işi yalnız bizim maçımızdan sonra kurulur; kadroda olmayan numaralı golcü sessizce kimliksiz kalıyordu — reddedilir; `macSonucDogrula` oyuncunun bugünkü kulübünü denetliyordu (transferde eski maçlar bozulurdu) — yalnız varlığı; kart odağı “Odaya dön”deydi, maç boyu duraklatan Boşluk sonucu uygulayıp çıkıyordu — odak kartta; red sonrası çift tıklama açıklamasız çıkarıyordu — 0,8 sn bekleme; başarılı dönüş Geri tuşunda hata bırakıyordu — `location.replace`; hızlı bitirmede “önemli an” göstergesi yanık kalabiliyordu; `sezon-deneme` 19–30 haftada hata veriyordu — sezonun kalanıyla sınırlı (18 hafta tam koşu geçti); `kariyer-deneme` 3.5'in gerçek motor denetimi 0–0 maçta gol eşlemesini sınamıyordu — dünya tohumu 3 (1–1, kendi kalesine gol dahil); §19 Canlı Skor'un skorunu denetlemiyordu; “Maçı bitir = izlenen maç” iddiası yalnız elle sınanmıştı — §19'a belirlenimli iki sayfalı karşılaştırma eklendi (geçti); belgelerdeki “deep-link tuzağı” yoktu (maç günü işi “bugünün işi değil” diye reddediliyor) — silindi. Çürüyen: bellek deposunda kart döngüsü (maç sayfasına bellek deposuyla gelinemez). İnceleme ayrıca aşağıdaki “Santraya geç” bulgusuna yol açtı.
- **Ölçüler (dizüstü, bilgi):** hızlı bitirme tarayıcıda ~15 sn (motor süresi baskın; planda 6–8 sn tahmini); `sezon-deneme` maç başına ~15–18 sn, 1000 adım ~144–166 ms (D'nin masaüstü ölçüsü 34 ms; bu dizüstü yavaş ve ölçü sırasında başka işler koşuyordu) — haftanın 8 maçı art arda ~2 dk: 3.8'de zaman dilimli yaklaşım (TEKNIK_PLAN §8) gerekli. Tam sezon (18 hafta) kayıt 121 → 155 KB, maç başına ~2 KB.
- **“Santraya geç”in anı maçı değiştirir (F2 incelemesinde bulundu; F1'den beri; karar bekliyor):** motorun tek dış girdisi maç öncesindeki `macaGec`'tir; basıldığı kare farklıysa aynı tohumla maç baştan farklı oynanır (Node'da sınandı: aynı tohum, beş farklı anda beş farklı maç). Basılmazsa maç öncesi doğal akar ve sonuç tohumla belirlidir. Sonuç artık kalıcı olduğu için bu bir açık: maç kötü giderse sayfa “Odaya dön”den önce kapatılıp “Santraya geç”e başka bir anda basılarak sonuç yeniden çekilebilir. Öneri (Claude): “Santraya geç” maç öncesini görüntüsüz doğal sonuna dek oynatsın (`js/mac-sahnesi.js`, “Maçı bitir”in parçalı döngüsüyle; motor dosyası değişmez) — basma anı sonucu değiştirmez, bedeli düğmenin birkaç saniye sürmesi. Kullanıcıya sorulacak (oyun kuralı sayılır).
- **Oyunda görülecek:** mevcut kayıt açılır (yeni kariyer gerekmez). İlerle → Stada git → Maça geç → (karar anı) → “TEST Maçı bitir” → Maç bitti kartı → Odaya dön → oda Cumartesi 21:00, ajandada sıradaki hafta → İlerle → Stada git … Puan durumu ve son 5 maç bültende ilerler, cezalılar ve sakatlar eksiklerdedir, telefonda Canlı Skor son maçı gösterir.

**Sıradaki: F3 — hoca, kadro seçimi, rapor ve maçın okunması** (yeni dal `claude/f3-hoca`, kendi planıyla; `araclar/plan/f-program.md` F3): hoca kişisi ve tarzı kariyerde, `hocaKadroSec`, maçın okunması (Canlı Skor maç sonrası istatistik ve beklenen gol, ekibin yorumu TEST şablon, gözlem notu). F2'nin kartı F3'te maçın okunmasına bağlanır.

**A–E özeti** (ayrıntı FUTBOL_KUTUPHANESI §12.4 ve etiketlerdeki belgeler): D (`tur/d`) pas hızı aileleri, daha çok falso (`pasEgriKat` 2,0), amaçlı uzaklaştırma ve kafa, kalecinin dağıtımı — 40 maç gol 2,85, korner 3,35, sağlık aralığı dışı 0, taban `d.json`; E (`tur/e`) 2D kopuş, olay simgeleri, top taşıyanın adı, pas isteği eli, kalabalıkta pul boyu; motor değişmedi. Son hız ölçümü (D kapanışı, masaüstü): `tur/c` ağacına karşı aynı süreçte ortanca +%3,1, 1000 adım 34 ms. Akış denemesinin tek bilinen düşüşü 15b (TEST loca bakışında kulübenin 1/15 noktası masanın arkasında → F5).

**İzlemede bakılacaklar (yan hat; kullanıcı istedikçe):** iki tarz (`index.html?ekran=mac&tarz=konumsal,direkt`); profiller (Oğuz hızlı kanat, Metin uzun paslı 6, Erdal falsolu 10, Kadir hava 9'u, Cengiz oyun kuran stoper); pasların hızı ve kıvrımı, falsonun büyüklüğü (tek anahtar `pasEgriKat`); uzaklaştırma ve kalecinin dağıtımı; olay simgeleri, ad etiketi, pas isteği eli (boyları `STIL.pul.simge`/`etiket`); görev çalkantısı. C'nin açık soruları 1 (seviye farkının maç düzeyindeki büyüklüğü) ve 4 (hızlı kanadın hızı) izlemeye bağlı. F1'den sonra maç kariyerden de açılır (oda → Stada git).

**Bilinen borçlar** (kapanışı tek başına durdurmaz): `d-duran` korner başına gol (%5,2–5,3, kapı %3–5; Z6-2); `d-topcu` köşe bayrağı yanındaki taçta top toplayıcı teslimi (1/290); `c-1v1` eğim 14,0 (kapı 15; 120 denemede 18); uzaklaştırmanın blok riski (planlanan %11 ↔ gerçekleşen %23) ve U2'de ilk dokunan biz %37; `p-tip` forvet çifti TVD 0,07–0,18; alçak havadan kısa pas ve kaleciye geri pas (kapalı); güç–hata çarpanının oyuncunun tavanına ölçeklenmesi; gol −0,45 ve korner −1,3 (80 maçla denge sorusu); `b-olcum`'daki V1a/V1b bilgi satırlarının budanması ve `kvBekle`'nin kaldırılması (temizlik). F1'den: üretilen kulüplerin hepsi deplasman formasında ve statları TEST (kulüp kimlikleri kullanıcıdan); akış denemesinin 14. bölümündeki TEST loca yürüyüşü bu dizüstünde zaman aşımına düşüyor (eski kodla da; masaüstünde bakılacak); kariyer komutu ~1 ms (F1 öncesi 0,14 ms) — veri büyüdükçe paylaşılan alanlara yenileri eklenir. F2'den: “Santraya geç”in anı maçı değiştirir (sonuç avlama açığı; karar bekliyor, yukarıda); öbür kulüplerin cezaları yalnız bizimle oynayınca düşer (diğer maçlar 3.8'de); diğer maçlar oynanmadığı için puan durumu yalnız bizim maçlarla ilerler (tam sezonda Demirkapı tek başına önde görünür); `sezon-deneme`'nin maçı tarayıcıdakiyle birebir değildir (stat alanları Node'da yok; maliyet ve belirlenim ölçüsü); `akis-deneme` 19 rakip başkan yokken koşar (karar anlı yol 14b ve `akis-2d`'de).

**İki makine:** masaüstünde `akis-2d.py` `-I` olmadan koşar (Playwright kullanıcı paketlerinde; `-I` onları görmez). Tabanlar iki makinede ortaktır (Node v24.15.0 ↔ v24.21.0 `--ayni` tuttu); tutmazsa yerel taban üretilir ve depoya alınmaz. Hız yalnız aynı makinede, aynı oturumda karşılaştırılır (dizüstünde süreçler arası ±%35; aynı süreçte dönüşümlü ölçüm esastır). Git dışı görüntü ve raporlar (`araclar/anlar`, `son-*`) makineye bağlıdır, araçlar yeniden üretir.

## Geçerli kararlar

Her madde tarihli bir özettir; ayrıntı bağlantıdaki belgededir. Daha eski karar metinleri: `git show tur/p2:YOL_HARITASI.md` (“Güncel karar özeti”).

1. **2026-09-26/29 — kimlik.** Proje Chairman; Türkiye'de tek kurgusal kulüp (bugün Demirkapı SK; nihai isim ve şehir açık); Türkçe ilk içerik; kulüpler, kişiler, markalar kurgusal; görseller kodla üretilir, '99 görünümü referanstır, reddedilen konseptler uygulanmaz.
2. **2026-09-29 — kariyer.** Taraftarlıktan adaylığa, başkanlığa, görev dışına ve yeniden adaylığa; üç lig ve Avrupa; başarılı final en büyük Avrupa kupasıyla bırakmak, kupasız sonlar mümkün; seçim kaybı kariyer sonu değil; başkan yaşlanır ([OYUN_TASARIMI §1](OYUN_TASARIMI.md#1-amaç-ve-kararların-durumu)).
3. **2026-09-29 — gizli puan.** Yetenek ve potansiyel puanı gösterilmez; “Test bilgileri” ayarı geçicidir ve yayından önce kalkar (2026-09-30).
4. **2026-09-30 — günlük deneyim.** Aydınlık mekânda tek meseleye odaklanma; telefon, defter, dosya gerektiğinde; tavsiye ve yetki devri; eylemle ilerleyen, okurken duran zaman ([OYUN_TASARIMI §2, §6](OYUN_TASARIMI.md#2-başkanın-rolü-ve-ana-döngü)).
5. **2026-09-30 — içerik yönü.** Sabit kulüp kimliği, tutarlı fakat değişken devralma, mevcut dünyadan doğan olaylar, sınırlı adil belirsizlik, kalıcı hafıza; dünya futbol tarihinin önemli kulüp olaylarından esinlenilir, karıştırılır, kopyalanmaz ([OLAY_KUTUPHANESI](OLAY_KUTUPHANESI.md)).
6. **2026-10-01 — ses.** Ses yok; ses tasarımı Aşama 10'da.
7. **2026-10-02 — kararlar ve içerik.** Bütün başkanlık kararları iki anlamlı cevaplıdır; sakin hareket standarttır; bütün içerik silindi (2.8L), içeriği kullanıcı tek tek yazar, Claude kendiliğinden oyun içeriği eklemez.
8. **2026-10-03 — görüntü standardı.** Oda, balkon ve maç tek 960×720 ızgarada, içeride 2× çizilir ([STIL_REHBERI §1](STIL_REHBERI.md#1-görsel-kimlik-ve-ekran)).
9. **2026-10-07 — motor odağı.** Geliştirme maç motorundadır; 2026-10-22'den beri ölçüsü “idare eder” kapısıdır ([FUTBOL_KUTUPHANESI §11.3](FUTBOL_KUTUPHANESI.md#113-kapı-idare-eder)); içerik yazımı ve 2.9 kapıdan sonra.
10. **2026-10-07 — motor yetkisi.** Motorun kapsamı ve motor kararları Claude'undur, belgeye görünür yazılır; oyun kuralı sayılanlar kullanıcıya sorulur.
11. **2026-10-09 — çalışma.** Dış öneriler ilerletip ilerletmediğine göre değerlendirilir, ilerletmeyene itiraz edilir; kabul sahnesi üretilmez, Claude kendi araçlarıyla doğrular, kullanıcı maçı kendisi izler; iki bilgisayar arasında devam notu tek kaynaktır.
12. **2026-10-10/16 — turlar.** Her tur kendi dalında, kendi başında planlanır ve onaylanır, kapanınca durulur; kapanış `tur/<ad>` etiketi; `main`'e alma ve push kullanıcının sözüyle.
13. **2026-10-11 — maç kuralları.** Maç başına ~1 kısa sakatlık duraklaması ve ~0,3 çıkış; yağmur ve rüzgâr şimdilik gösterilmez.
14. **2026-10-12 — maçın uzunluğu.** Motorun maçı 20 dk oyun saatidir; ×1/×2/×4 izlenir, önemli anlarda kendiliğinden normal hız (ikiz motor).
15. **2026-10-16 — hareket verisi.** Harici hareket verisi yalnız sayı tablosu olarak girer (A7; CMU, Fukuchi CC BY); ham veri Git dışı.
16. **2026-10-19 — zeki ve keyifli oyun.** Kütüphane + takım zekâsı + kabiliyet; ilkel × bağlam × rol; hoca tarzı ve taktik savaşı; dar bantlar yerine geniş sağlık aralığı; kurallar bütünüyle bugünün, 1999 yalnız görüntü; açık veri IDSSE, Wyscout, SkillCorner (StatsBomb ticari kullanıma kapalı) ([FUTBOL_KUTUPHANESI §0](FUTBOL_KUTUPHANESI.md#0-kaynak-ve-kullanıcı-kararları)).
17. **2026-10-19 gece — tempo B.** Duruşlar gerçeğin kabaca yarısı ve bağlama göre değişken; duruşta maç saati 2 kat; maç ×1'de ~28 dk.
18. **2026-10-20 — K1 kesin kararları.** Yorulma görüntüsü yok; sağlıkçılar kulübede ve görünmez; (TEST loca bakışında) küçük kare masa ve 36° sabit açı.
19. **2026-10-21 gece — 2D maç (P2).** Maç FM gibi tepeden izlenir; herkes aynı sade numaralı pul; kulübün farkı statın tepeden görüntüsüdür (tribün gelişimi ve başka kulüplerin statları aynı tarif modelinden); locaya giriş şimdilik atlanır, karar anı 2D üstünde kart; figürlü motor antrenman sahneleri içindir ([kutuphane/M](kutuphane/M-pul-gorunumu.md)).
20. **2026-10-22 — antrenman.** Antrenman 3B figürlerle sürer ve iş yaparken arka planda izlenebilir (ekranın bir yanında antrenman, öbüründe telefon, görüşme ya da dosya; hedef, F'de planlanır); antrenman türleri, seremonileri ve hocaların antrenman portföyleri ileride araştırılır; figürlerde fiziksel mükemmellik maçtaki kadar şart değildir.
21. **2026-10-22 — izlenebilir 2D akış ve atak zihniyeti.** Öncelik istatistik değil oyun akışı: hocaya göre farklı taktik ve plan, amaçsız pas yerine amaçlı hücum; varsayılan takım kazanmak için oynar, kontrollü ve savunmacı hocalar azınlık ve bağlama bağlı; istatistik en son ayarlanır, sağlık aralığı kalır.
22. **2026-10-22 — oyuncu etkisi.** Oyuncu profili sahada davranışıyla görünür (hızlı, uzun pasla hat kıran, falsolu pas atan…); aynı profilin güçlüsü üst ligde daha iyisini yapar, zihniyet aynıdır; gizli puan kuralı değişmez. Kadro profillerini TEST verisi olarak Claude yazar (adlar ve kulüpler kullanıcının).
23. **2026-10-22 — tek kart.** Başkanlık kararları tek karttır: sağa ya da sola kaydırınca üstündeki metin değişir, bırakınca o seçenek uygulanır; mali önerilerde de iki seçenek (ör. öneriyi kabul et / yeniden çalıştır). Hangi ekranların karta döneceği başkanlık planında (F) sorulur ([OYUN_TASARIMI §2](OYUN_TASARIMI.md#başkanlık-kararında-iki-seçenek)).
24. **2026-10-22 — sadelik.** Test rejimi hafifledi (CLAUDE.md “Kontrol”: tur kapanışı 40 maç, 80/160 yalnız bilinçli denge sorusunda, çekirdek 10 senaryo, animasyon ölçümü maç kapanışında yok); ARSIV kalktı, tarih git etiketlerinde; V1 daraltılıp D'de main'den yeniden açılır (V1a/V1b kapandı, `arsiv/v1`).
25. **2026-10-22 — B kararları (Claude, oto mod).** Tarz maç başına seçilir ve maç içinde kademeli değişir (bugün panelde TEST, ileride hocanın kararı); tarzın sabrı konumsal dolaşımı bilerek bırakır; kutu kapısı topun anlık yerinden açılır (Z5-2'den öne alındı); plan bitleri kapı tutmadan açılmadı; tarz kenarı +0,34 ayarsız kabul edildi (ölçü belirsizliği içinde). Ayrıntı MAC_MOTORU §3 (1, 12, 13), FUTBOL_KUTUPHANESI §12.4.
26. **2026-10-22 — makine durumu.** Kullanıcı yokken uzun iş yürüten makine `main`'in devam notuna durum satırı yazar, her adımı push eder, push'tan önce fetch eder; öbür makine “evdeyim”de önce bu satıra ve dalın son push zamanına bakar (CLAUDE.md “Makine durumu”).
27. **2026-10-22 — C kararları (Claude, oto mod).** Test kadrolarında profiller özelliklerin şeklinden çıkar (ad ve kulüp uydurulmaz, seviye dönüşümü yalnız araçların içinde); eğilim ve rol oyuncunun kendi seviyesine göre, eğilim gücü 1,0; tepe hız aralığı geniş; falso, uzun top ve topla çıkış oyuncuya bağlı; seviye isabeti değiştirir, zihniyeti değil (`p-seviye` S2'nin kapısı uzun pasın tamamlanma oranı). Ayrıntı MAC_MOTORU §3 (2, 14), FUTBOL_KUTUPHANESI §12.4.

28. **2026-10-22/23 — D kararları (Claude ve kullanıcı, oto mod).** Kullanıcı: oto mod ve kapanışta `main`; daha da çok falso (`pasEgriKat` 2,0; orta ve korner 1,6'da); kapsam V1c + V1d + V1e. Claude: pas çıkış hızı uzayında dört aileden, planlayıcı gerçekçiliği zorunlu (olmadan aile başına 10 puan iyimser); aile tavanı ortalama vurucu (`pasTavan` 1,0; oyuncuya bağlanınca seviye farkı siliniyordu); uzaklaştırma "başarı × kazanç − kayıp" ile, saha dışı yalnız tehlikede, kurtarış topu pas sayılmaz; alçak havadan kısa pas ve kaleciye geri pasın risk değeri ölçü tutmadığı için kapalı; `p-tip`'in çıkış kodu C'nin yazılı kapısına hizalandı (dört çiftin üçü, kanat şart). Ayrıntı MAC_MOTORU §3 (15), FUTBOL_KUTUPHANESI §12.4 D.
29. **2026-10-22 gece — oto mod (kullanıcı).** "Birkaç tur daha oto modda devam et, `main`'e commit ve push": D'nin kapanışı ve E; F'de durulur (kapı kullanıcının izlemesini ister).

30. **2026-10-23 — E kararları (Claude, oto mod).** 2D'de figür animasyonu çalışmaz (kopuş; figür kodu antrenman için korunur, `?pul=0` ve G tuşuyla TEST loca bakışında aynen); olay simgeleri ve ad etiketi oyunun piksel diliyle, ekranda sabit boyda; deplasman statı F'nin fikstürüyle (kariyerde bugün iç saha maçı tek; tek başına görünür yeri yok). Ayrıntı kutuphane/M M.5, STIL_REHBERI §6.

31. **2026-10-23 — kapı ve iki hat (kullanıcı).** Motor “idare eder” sayıldı (kullanıcı izlemeden kabul etti; [FUTBOL_KUTUPHANESI §11.3](FUTBOL_KUTUPHANESI.md#113-kapı-idare-eder)); geliştirme başkanlık ve oyun içi sistemlere döner (program F). Kullanıcı arada maç izleyip notlarını yazar; notlar teşhis tablosuna alınır, tek anahtarlık ayar tur açmadan, davranış işi küçük motor turu (İ1, İ2 …) olarak F turlarının arasında yapılır. Yol haritası sırası dışında yeni motor işi yok.
32. **2026-10-23 — tek kartın ekranları (kullanıcı).** Tek kart her yerdedir: dosya, karar paneli, telefon konuşması ve maç günü karar anı (F4; [OYUN_TASARIMI §2](OYUN_TASARIMI.md#başkanlık-kararında-iki-seçenek)).
33. **2026-10-23 — rakip adları (kullanıcı; kural değişikliği).** Üretilen kadroların oyuncu ve hoca adlarını Claude TEST verisi olarak yazar (`js/adlar-test.js`, F1); kullanıcı sonra değiştirebilir. Kulüp adları kullanıcınındır (ligdeki 16 ad) ve uydurulmaz.
34. **2026-10-23 — beklenen gol (kullanıcı).** Maçın okunmasında beklenen gol Canlı Skor'da maç sonrası sayı olarak görünür (F3; motorun konum xG'si, sonucu değiştirmez). Yetenek puanı gösterilmez kuralı değişmez.
35. **2026-10-23 — ilk içerik (kullanıcı).** İlk olay paketi (P12 “Hocaya sabır mı, değişim mi?”) Claude'un TEST taslağıdır, kullanıcı metinlerin üstüne yazar (F6); aynı kip F3'ün ekip yorumu ve rapor şablonlarına uygulanır. İçeriğin geri kalanını kullanıcı yazar (karar 7 sürer).
36. **2026-10-23 — F kararları (Claude).** Lig TEST tarifi: 16 takım, çift devreli 30 hafta, her hafta Cumartesi 19:00; 1–12. haftalar devralınan geçmiştir (bugünkü tablo), oyun 13. haftada başlar; kış transfer dönemi 4–31 Ocak yalnız takvim işareti (kesin format Aşama 5 öncesi). Kadro kariyere geçer (`KADROLAR` tohum kadrosu, oyuncu kalıcı kimlikli; kayıt sürümü 7, eski kayıt açılmaz). Maç sınırı sayfa yeniden yüklemesidir (“Stada git” → `?ekran=bulten&mac=<id>`; “Odaya dön” sonuç kaydedildikten sonra); maç kimliği `mac-2627-13-demirkapi-akdeniz` biçiminde, tohumu dünya tohumu ve kimlikten; sonuç kimlikle bir kez uygulanır; maç ortasında kayıt yok, sayfa kapanırsa aynı maç yeniden oynanır. Motor sözleşmesi korunur (takım 0 ev sahibi, “biz” sunumda). F2'de diğer maçlar oynanmaz; 3.8 kullanıcının maçı sürerken zaman dilimli. Ceza TEST kuralı: kırmızı 1 maç, 4 sarı 1 maç. Ayrıntı [araclar/plan/f-program.md](araclar/plan/f-program.md).
37. **2026-10-23 — F1 uygulama kararları (Claude).** Kariyerin büyük ve seyrek değişen alanları (`sezon`, `fikstur`, `oyuncular`, `maclar`) komutlar arasında dondurulup paylaşılır, değiştiren komut kopyala-yaz ile yeni nesne kurar; doğrulama dondurulmuş parçaları önbelleğe alır ama kariyere bağlı denetimleri her seferinde yapar. Kayıt oturumu son yazdığı sağlam metni yeniden çözmez. Maç sınırında oda maç günü işini tüketmez; kayıt yazılamıyorsa maça gidilmez; tarayıcının Geri tuşu sayfayı kayıttan yeniden açar. Hocasız kadro seçimi (F3'e dek): sakat ve cezalının yerine aynı mevkiden ilk uygun yedek, kulübede kaleci ve her hattan oyuncu. Öbür kulüplerin statları aynı kasaba modelinden kulübün kimliğiyle; ev ve deplasman taraftarı forma renginde. Ayrıntı TEKNIK_PLAN §3, §5, §8, STIL_REHBERI §5.
38. **2026-10-23 — F2 kararları (kullanıcı ve Claude).** Kullanıcı: maçta “maçı hızlı bitir” TEST düğmesi, şeritte (“Santraya geç”in yanında). Claude: sonuç komutu `js/mac-sonuc.js`'te, kimlik motor kaydının forma numarasıyla eşlenir (motor kaydına kimlik eklenmez); `k.maclar` girdisi kimlikli goller, kartlar, sakatlıklar ve istatistik taşır, ad saklanmaz; TEST ceza: kırmızı ve iki sarı 1 maç (iki sarının sarıları birikmez), 4 sarı 1 maç, aynı maçta toplanır, oynamayan cezalı çeker (öbür kulüplerinki yalnız bizimle oynayınca: 3.8'e dek); sakatlık tedavi ve çıkışta dönüş günüyle, ağrı ve kramp yazılmaz; maçtan sonra zaman 21:00'e, arada ajanda işi varsa orada durur; kayıt sürümü 7 kalır; maç sonu kartı düdükten 8 sn sonra (hızlı bitince hemen), tek düğme “Odaya dön”, kayıt yazılamazsa sayfa yenilenmez; hızlı bitirme görüntüsüz ve kare başına 30 ms, ikiz temiz bırakılır, aradaki olaylar sunuma verilmez, karar anı atlanmaz. İnceleme sonrası (Claude): aynı maçta birden çok sakatlıkta en uzun dönüş; sıradaki maç günü yalnız bizim maçımızdan sonra; numaralı golcü kadroda olmalı; doğrulama oyuncunun bugünkü kulübüne bakmaz (transfer); kartta odak düğmede değil kartta; dönüş `location.replace`. Ayrıntı TEKNIK_PLAN §3, §8, STIL_REHBERI §7, OYUN_TASARIMI §11.

## Çalışma biçimi

Her iş çalışan, incelenebilir bir sonuçla biter. İş sırası bağımlılıkları izler; küçük doğrulama işleri gerekirse öne alınır ve nedeni yazılır. İç test için kısa dönemler kurulması, ticari oyunun uzun kariyer hedefini daraltmaz. Planlanmış olmak tamamlanmış olmak değildir; yalnız uygulanıp doğrulanan işler işaretlenir.

## Aşama 0 — Plan ve belge düzeni

- [x] Kullanıcıyla ana tasarımı ve belge güncelleme planını kesinleştir.
- [x] Oyun tasarımı ve teknik planı ayır; ana belgeleri sorumluluklarına göre düzenle.
- [x] Mevcut uygulama, hedef sistem ve açık kararları ayır; eski çelişkileri gider.
- [x] Bağlantı, kapsam ve tutarlılık kontrolünü tamamla.

**Bitiş ölçütü:** Yeni oturum mevcut durumu, sıradaki işi ve açık kararları aynı şekilde yorumlayabiliyor.

## Aşama 1 — Kariyer temeli

**Bağımlılık:** Aşama 0.

- [x] **1.1** Kalıcı kulüp/kişi kimlikleri, tarih, görev durumu ve başlangıç verisi için küçük örnek kariyer oluştur; çizimden bağımsız oku/doğrula.
- [x] **1.2** Gün ve gün içi zaman ilerlemesini kur; bir bekleyen işi belirtilen tarihte yalnız bir kez tamamlat.
- [x] **1.3** Para hareketi ve gelecekteki ödeme için temel kayıt kur; mevcut para ile taahhütleri ayır.
- [x] **1.4** Sürümlü yerel kayıt/yükleme, önceki sağlam kayıt ve hatalı kayıt bildirimi ekle; bekleyen işin yükleme sonrası iki kez çalışmadığını doğrula.
- [x] **1.5** Hedef işletim sistemi ve paketleme için küçük deneme yap; gerekli kaynakları çevrimdışı açılışa hazırla, kayıt yolunu ve Türkçe karakterli yolları dene.

**Bitiş ölçütü:** Birkaç gün ilerleyen küçük kariyer kaydediliyor, kapatılıp aynı durumdan devam ediyor. Erken masaüstü denemesinin seçimi veya somut engeli belgelenmiş durumda.

## Aşama 2 — Yaşayan kulüpte günlük başkanlık

**Bağımlılık:** Aşama 1. Ekip koltuklarının ilk kapsamı seçildi (2026-09-29): sayman, futbol şube sorumlusu, basın sözcüsü.

- [x] **2.1** Ajanda ve kulüp durumunu göster; zorunlu/ertelenebilir işleri ve günü bitirmeyi anlaşılır yap. Tamamlanan bu prototip, yeni mekân akışının kural temelidir.
- [x] **2.2** Sınırlı aday havuzundan yönetim ekibi kur; farklı katkıları ve yetki sınırlarını bir örnek işte göster.
- [x] **2.3 — Mesele ve zaman temeli.** Mevcut sponsor örneğini tek kimlikli meseleye bağla; sorumlu kişi, durum, son tarih, beklenen haber ve karar geçmişini göster. Eylem süreleri ile okuma/düşünme ayrımını ve sonraki önemli gelişmede durmayı kur. Önce mevcut arayüzde küçük bir örnekle doğrula.
- [x] **2.4 — Gün içi kayıt ve dönüş.** Tamamlanan kararları ve güvenli sahne geçişlerini kaydet; mesele, bekleyen iş ve yetki durumu yüklenince sürsün. Son karar, beklenen haber ve yaklaşan tarihten kısa dönüş özeti üret.
- [x] **2.4A — Değişken başlangıç ve koşula bağlı olay denemesi.** Mevcut mesele, takvim, para ve kayıt temelinde P01'in dar ödeme/sponsor örneğini kur. Paket tarifi ile kariyerdeki olay örneğini ayır; koşula göre açılma, seçenek, sonuç ve tekrar sınırı kullan. Ayrıntı [TEKNIK_PLAN §6](TEKNIK_PLAN.md#6-karar-olay-ve-ilişki-sistemi).
- [x] **2.5 — Aydınlık başkan odası.** 2.4A'daki gündemi oda içinde telefon, ajanda ve ilgili dosyayla sun; bir meseleye odaklanan açık renkli düzen kullan. Okunabilir metin ve o tarihteki plana göre temel ortam sesi/ses kontrolü eklendi; ses 2.8A'da kaldırılacak ve Aşama 10'da tasarlanacak. Önce küçük oda prototipini gösterip yerleşim/etkileşim onayından sonra oyuna bağla.
- [x] **2.6 — Görüşme, tavsiye ve ekip.** Hoca görüşmesi ve bütçe önceliğini ekle. Tavsiye ile yetki devrini ayır; kişi, bütçe, süre, kapasite ve başkana dönüş koşullarını belirle. Bir kalıcı sorumluluk ve başkanın başlattığı bir görüşme/araştırma örneği kur; 2.2'nin kalan işlerini tamamla.
- [x] **2.7 — Antrenman ve telefon.** İsteğe bağlı gözlem sırasında haber alma, cevaplama, tavsiye isteme veya yönlendirmeyi dene. Mevcut ısınma görsellerinden yararlanılabilir; ayrı antrenman simülasyonunun hazır olduğu varsayılmaz.
- [x] **2.8 — Sonuçlar ve kulüp hafızası.** Bir söz/ilişki kaydı, önceki kararın dönüşü, ilk taraftar veya medya tepkisi ve olumlu kulüp anı ekle. Tamamlanan küçük bir iş/yatırımın ya da tutulmuş sözün izini ortamda göster; daha sonraki tesis sisteminin tamamını burada kurma.
- [x] **2.8A — Oyun çerçevesini temizleme.** `index.html` dış başlık/notlarını, alt açıklamaları ve renk kutularını kaldır; açılış başkan odası olarak kalsın. Oda ve maç masasındaki çayı, buharı ve içme hareketlerini temizle. Ses betiğini, yükleme/çağrı/zamanlayıcılarını ve ses ayarlarını kaldır; bu aşamadan Aşama 10'a kadar ses ekleme. Yazılı maç spikeri/radyo satırını ve yalnız ona ait metin yolunu kaldır. Diğer prototip araçlarını küçük Geliştirici alanına taşı; satır içi TEST metinlerini küçük, gerektiğinde açılan bilgi kutusuna taşıma temeli kur.
- [x] **2.8B — Genel duraklatma.** Oda, yürüyüş, balkon/antrenman, program ve maç için tek duraklatma yönetimi kur. Elle duraklatma ve maç telefonu gibi nedenleri ayrı tut; bütün motor/sahne hareketi ve çalışan sayaçları dondur. Mevcut bilgide gezinmeye izin ver, süre ilerleten/dünyayı değiştiren komutları engelle. Gözlemde görünen zaman ile gerçek kariyer/kayıt durumunu eşleştir; yalnız saat animasyonunu dondurma.
- [x] **2.8C — Başkanlık ekranları.** Önce tek dosya düzenini kur; ardından ajanda, mesajlar ve ayarları aynı açık, okunabilir dilde yenile. Dosyada önceki/sıradaki, açık/cevap bekleyen/takipte sayaçları, kısa sonuç ve ayrı arşiv olsun. Ajanda randevu ve son tarihlere odaklansın; finans ilgili dosya/saymanda erişilsin. Telefon tek konuşmayla ilgilenmeyi ve bağlı dosyadan aynı konuşmaya dönüşü sağlasın. Ayarlar sade bölümlerle ve ses seçeneği olmadan açılsın; TEST verisi küçük simge/bilgi kutusunda kalsın. Geliştirici alanına “Görüntüyü kaydet” ekle.
- [x] **2.8D — Ortak stat ve mekân hareketi.** Ayrı şehir stadını, seçicisini ve ona ait canlı uygulama yollarını kaldır. Oda penceresi/balkon/ev sahibi maçı tek stat tarifini kullansın. Kapı tıklanabilir olsun; balkon düğmesi kaldırılsın, klavye erişimi sürsün. Doğal kalkış, yönelme, adım ve oturma hareketlerini kur. Maç başkan koltuğunu/masasını gerçek tribünde daha yükseğe taşı; altında sıralar görünsün.
- [x] **2.8E — Maç programı.** Yoğun koyu bülteni açık tonlarda kısa programla değiştir: karşılaşma kapağı, isteğe bağlı kadro/lig sayfaları, kodla çizilmiş küçük stat resmi. En az 10 saniye etkin hazırlık ve gerçek kaynak hazır olma koşulundan sonra “Maça geç” etkinleşsin; geçiş oyuncunun eylemiyle olsun.
- [x] **2.8F — Maç telefonu.** Masadaki telefon tıklanınca Mesajlar ve Canlı Skor uygulamaları açılsın. Kendi maçına tıklayınca gerçek motor istatistikleri görülsün. İlk maça özgü mesajlar boş olabilir; mevcut kariyer mesajları silinmez. Telefon açıkken maç ve çevresi durur; kapanınca başka duraklatma nedeni yoksa aynı andan sürer.
- [x] **2.8G — İçerik envanteri ve ilk taslak.** Kütüphane §7'deki başlangıç listesini koddan tamamla: bütün karar türleri, girişimler, başlangıçlar, paket/metin üreticileri, ekran/alternatif girişler ve eski kayıt yolları. Uyumlu/yeniden yazılacak/çıkarılacak/yalnız uyum-test olarak gerekçeli ayır. Tek dosya ve telefon konuşmasında iki büyük cevap, kısa teklif, bilinen bedel ve normal/büyük yazı taslağını hazırla. Nihai üslup ve kompozisyonu uygulayıcı geliştirir.
- [x] **2.8H — İki cevaplı karar ve eski içerikten geçiş.** Mevcut mesele/takvim/para/komut temelinde önce küçük bir konuyu uçtan uca dönüştür; sonra envanterdeki bütün aktif uyumsuz yolları yeniden yaz veya kaldır. Aday seçimi, bütçe, tavsiye/devir ve tek eylemli bilgi işleri dahil; ilk iki düğmeyi göstermek yeterli değildir. Kısa sonuç/beklenen haber, önleme ve sakin yol çalışır. Eski kayıt dönüşümü veya yalıtılmış uyum yolu seçilir; normal yeni kariyerde eski akış kalmaz.
- [x] **2.8I — Telefon, ajanda ve kararın ortak sunumu.** Ana ekran → Mesajlar/Canlı Skor → liste → tek ayrıntı; kişi konuşmaları, gerçek gelen/gönderilen mesaj, iki cevap ve dosyaya isteğe bağlı geçiş. Oda/balkon cevabı ortak komutu kullanır; maçta görünüm aynı, cevap/zaman sınırı teknik plandaki gibidir. Ajanda gün şeridi ve kısa randevu/son tarih satırlarıdır; finans ve geçmiş yığılmaz. Dosya sayaçları/önceki-sonraki/arşiv korunur.
- [x] **2.8J — Sakin hareket, tek maç öncesi ve mütevazı stat.** Kamera sallantısı/süs hareketleri ve hareket ayarını kaldır; doğal kalkış/kısa yürüyüş/gerekli futbol hareketleri kalsın. Üç program sayfası ve stat resmi yerine tek kompakt ekran, dolan 10 saniyelik hazırlık çubuğu ve hazır olunca Maça geç. Ortak başlangıç stadı çatısız/küçük olur; tek mevcut tabela arma/skor/dakikayla başkan açısından okunur. Bakım izi/metni, balkon ve yüksek başkan sıraları yeni geometriyle tutarlı hâle gelir.
- [x] **2.8K — Karakter, mizah ve hafızanın dar denemesi.** Mevcut birkaç kişi ve meseleyle kısa konuşma, açık iki cevap, sonuç haberi ve gerçek geçmişe gönderme dene. Yaklaşık 12–20 karar/tepki metni yalnız başlangıç önerisidir; yeni konu veya zorunlu kart kotası değildir. Her haber karar istemez; karakteri tek şakaya veya iyi/kötü cevap kalıbına indirgeme. Tam ilişki/başkanlık üslubu simülasyonu kurulmaz.

- [x] **2.8L — İçerik sıfırlama ve dönüş özetinin kaldırılması.** Bütün oyun içeriğini sil, sistemleri boş kayıt defterleriyle koru; “Kaldığın yer”i kaldır; kural denemelerini oyundan ayrı TEST içeriğine taşı.
- [x] **2.8M — Masada açık dosya ve iki sayfalı defter.** Dosya ve ajanda sağdaki dar panel yerine odanın ortasında gerçek nesne olarak açılır; oda hafif kararır.
- [x] **2.8N — Maç öncesi ekranı: ilk 11'ler ve son maçlar.**
- [x] **2.8O — Stat sadeleştirme ve başkanın locası.**

- [ ] **2.9 — Günlük akışın sınanması.** 2.8G–2.8K sonrasında önce birkaç günlük tek meseleyi, sonra sakin/olağan/yoğun günleri içeren bir haftayı oyna. [Tempo hedefleriyle](OYUN_TASARIMI.md#6-zaman-ajanda-ve-tempo) gerçek süreyi, tekrarları, kesintileri, kararların anlaşılmasını ve yetki devrinin faydasını değerlendir.
  - *Tekrar oynama:* Aynı küçük dönemi farklı başlangıç ve kararlarla karşılaştır; temkinli, büyüme odaklı ve yetki devreden yaklaşımların koşullara göre ayrışmasını incele. Video veya önceki oyundan öğrenilmiş sabit cevabın her koşulu çözmediğini, başarının gerçek rahatlık ürettiğini ve önlenen sorunun geri zorlanmadığını değerlendir. Otomatik tutarlılık denemesi normal tempoda oynama yerine geçmez.
  - *Yeni kabul:* Sakin/olağan/sıkışık başlangıçlarda konuyu ve bilinen bedeli ilk görünümden anlama, anlamlı iki yaklaşım, gereksiz onay sayısı, tekrar eden espri, baskın ezber cevap, yetki devrinin azalttığı yük ve yeni kariyerde eski içerik sızıntısı değerlendirilir. Otomatik geçiş sayısı veya yalnız metin adedi kalite kanıtı değildir.
  - *Bitiş:* Kısa oturumda mesele ilerliyor; yoğun gün bölünebiliyor; iyi yönetim rahat dönem üretebiliyor. Yeni iki cevaplı dosya/kişi konuşması/ajanda, yazı seçeneği, standart sakin hareket ve Duraklat kullanılabilir. Maç öncesi ekranı (en az 10 sn hazırlık), doğal yürüyüş ve 2D maç izleme kullanıcıyla incelenir. Eksik örnekler ve ölçüm sonuçları yazılır; yalnız toplam süreye bakılarak aşama kapatılmaz. Ses bu aşamanın kabul koşulu değildir.

**Sıra:** 2.1–2.8W tamamlandı (2.8P–2.8W, 2026-10-03: maç bakışı ve netlik, ajanda eylemleri alt şeritte, oda ve insani yürüyüş, iki sayfalı maç öncesi, locaya giriş, saha kenarı, tek ızgara) (alt adımların uygulama ve doğrulama ayrıntıları `git show tur/p2:YOL_HARITASI.md`); 2.9 ve içerik yazımı motorun “idare eder” kapısından (F) sonra. Başlangıç görevdeki TEST başkanı olabilir.

Bu aşamada kariyer maç sonucu uydurulmaz; ajanda maç sınırında durabilir. Tam maç bağlantısı Aşama 3'tedir.

**Bitiş ölçütü:** Ofiste başlayan mesele ekibe veriliyor, antrenmanda gelen haber aynı konuyu sürdürüyor, yetkiyi aşan konu karara bağlanıyor ve sonucu kulüpte görülüyor. Gün içinde güvenle bırakıp devam edilebiliyor; sakin ve yoğun günler farklı hissediliyor.

### Maç motoru ve 2D maç (2026-10-02'den beri; Aşama 2'ye paralel)

Maç motoru MM0–MM4, gerçekçilik planının T0–T23, A2–A9, H1, U1, M0–M3 turları, futbol kütüphanesinin Z0–Z7 birinci bölümleri ve Z5-2'nin ilk parçası (karşı pres denemesi, kapalı), K1, S1, P1–P2 tamamlandı; ekran notları paketleri N1–N14 uygulandı (aşağıdaki “Tamamlanan turlar”). Motorun ilkeleri, kuralları ve geçerli kararları [MAC_MOTORU_GERCEKCILIK_PLANI.md](MAC_MOTORU_GERCEKCILIK_PLANI.md); program A–F, ikinci bölümler ve “idare eder” kapısı [FUTBOL_KUTUPHANESI §11.3 ve §12](FUTBOL_KUTUPHANESI.md#12-program). Askıda kalan eski turlar: T11 (adım evresi; 2D ile kapandı), T24–T27 (şut, kanat, yorgunluk, dram; kalan işleri Z6, Z4, Z5, Z7'nin girdisi, `arsiv/t24`), MM5 (sakatlık ve eksik kadro; T10'da büyük kısmı yapıldı, kalan Aşama 3 kadro bağlantısında). “İdare eder” kapısı 2026-10-23'te kullanıcı kararıyla geçti; motor işi bundan sonra izleme notlarından doğar (karar 31).

## Aşama 3 — Futbol ve yönetimin bağlanması

**Bağımlılık:** Aşama 2. İlk takvim için seçilmiş kurallar veya açıkça etiketlenmiş TEST tarifi gerekir; kesin lig formatı bu örnekten türetilmez.

**F eşlemesi (2026-10-23):** 3.1 → F1; 3.4 → F1 (maç girdisi) ve F2; 3.5, 3.6 → F2; 3.2, 3.3 → F3; 3.7 → F6 (ilk kısım); 3.8 → yaklaşımı F2'de yazılır, uygulaması F2'den sonra ayrı tur. Lig TEST tarifi Geçerli kararlar 36.

- [x] **3.1** Basit fikstür, maç kimlikleri, sezon ve transfer dönemi tarihlerini kur; yaklaşan maçlar ve bilinen mali yükümlülükler aynı takvimde görülsün. Tam sezon geçişi 5.1'de tamamlanır. *(F1-a, 2026-10-23: TEST tarifi, 30 hafta, maç kimlikleri, kış transfer dönemi takvimde; diğer maçlar 3.8'de.)*
- [ ] **3.2** Gizli özelliklerden kaynağı/tarihi/belirsizliği olan rapor üret; yetenek sayısı/yıldızı göstermeden karar verilebildiğini kontrol et.
- [ ] **3.3** Hocanın bilgisi ve tercihleriyle kadro/taktik seçiminin ilk sürümünü kur.
- [x] **3.4** Kariyerin kadro ve koşullarını mevcut Match girdisine dönüştür. *(F1-b, 2026-10-23: `macGirdisi`; hocasız kadro seçimi, hocanın seçimi 3.3'te.)*
- [ ] **3.5** Maç sonucunu kariyere kimliğiyle yalnız bir kez uygula; istatistik ve geçmiş kaydını bağla. Maç öncesi/sonrası güvenli kayıt sınırlarını doğrula. 2.8I telefonunun maç içi iki cevap desteğini gerçek kariyer/maç zamanı bağlantısıyla tamamla: cevap süresi, ödeme/ekip işi ve uzun eylem sınırı açık olsun; telefon açıkken maç ilerlemesin, karar iki kez uygulanmasın. *(F2, 2026-10-23: sonuç kimlikle bir kez, istatistik ve geçmiş kaydı, maç öncesi ve sonrası kayıt sınırları yapıldı (`js/mac-sonuc.js`, maç sonu kartı); açık kalan telefonun maç içi iki cevabı — içerik gelince, F6.)*
- [x] **3.6** Tohum tutarlılığını, izleme hızının etkisini ve görüntüsüz maçların maliyetini ölç. *(F2, 2026-10-23: `araclar/sezon-deneme.js` haftalar boyu belirlenimci; tarayıcıda hızlı bitirme ile ×16 oynatma aynı sonuç, `ikiz-deneme` 4/4; görüntüsüz maç bu dizüstünde ~15 sn, 3.8'e veri.)*
- [ ] **3.7** Birkaç haftalık yönetim bölümünü maçlarla tamamla; maç günü süresini ve mevcut atlama seçeneklerini ağır kariyer temposuyla değerlendir. Aynı olayların tekrarı, sonuçların yeni gündeme dönüşmesi ve kısa oturumdan devam da sınanır.
  - P12 hoca değerlendirmesinin erken örneği gerçek rapor/sonuçlardan doğabilir. Hikâye amacıyla skor değiştirilmez; kupa tabanlı P10 ilgili kupa sistemi hazır olana kadar açılmaz.
- [ ] **3.8 — Gerçek diğer maçlar ve canlı skor bağlantısı.** 2.8F telefonu ile 3.1/3.4–3.6 fikstür, maç kimliği, kadro/girdi ve bir kez sonuç temellerini kullan. Aynı maç gününün diğer karşılaşmalarını görüntüsüz üret; kendi maçının ortak oyun zamanına göre gerçek skor/dakika/durumunu Canlı Skor'a ver. Farklı başlangıç saatleri, duraklatma, sonuç kaydı ve yeniden açılış tutarlı olsun. Tam sezon işlem maliyeti ve bütün fikstür 5.2'de genişler.
  - *Bitiş:* Rastgele arayüz skorları yok; aynı kimlik/tohum aynı sonucu veriyor. Telefon/elle duraklatmada diğer maçların gösterilen zamanı da sabit. Tekrar açma maçı yeniden çekmiyor veya sonucu iki kez uygulamıyor; çalışma arayüzü kilitlemiyor. Kadrosu/verisi olmayan kulüp hazır sayılmıyor; dar TEST fikstürü açıkça etiketleniyor.

**Bitiş ölçütü:** Hoca ve kadro kararları sahaya giriyor; maç sonucu yeni gündem ve geçmiş üretiyor. Kayıt yükleme sonucu tekrar uygulamıyor.

## Aşama 4 — Transfer, sözleşme ve mali anlaşmalar

**Bağımlılık:** Aşama 3. Kişisel katkı ve ilk mali kurallar seçilmiş olmalı.

- [ ] **4.1** Sözleşmeler, maaşlar, taksitler, primler ve sponsor ödeme takvimini kur; saymanın değerlendirmesi mevcut nakit ile gelecek ödeme yükünü ayırsın, belirsiz gelir kesin para sayılmasın.
- [ ] **4.2** Bir transferi aynı mesele içinde araştırma, temas, karşı teklif ve imzayla bitir; basit/sorunsuz yol da çalışsın. Kaçan transfer sonrası alternatif arayışı ve anlaşmadan çekilmenin sonuçlarını dene.
- [ ] **4.3** Menajer talebi, rakip teklif ve sızıntı gibi koşula bağlı dallar ekle; aynı olayın durmadan tekrarlanmasını önle.
- [ ] **4.4** Sponsor görüşmesi ve sınırlı kişisel katkıyı mali kayıtlarla bağla.
- [ ] **4.5** Aşama 2'deki yetki devrini transfer ve mali anlaşmalara genişlet; bütçe/süre sınırları ve önemli eşikte başkana dönüş ortak kurallarla çalışsın. İki cevaplı yönlendirmeyle kalıcı çalışma kuralları ve başkanın çalışma başlatması genişlesin; iyi ekip rutin onayları azaltsın, yeniden çalışma ücretsiz teklif çekilişi olmasın.
- [ ] **4.6** Geciken gelir veya artan giderin birden çok güne yayılan etkisini ve yeniden planlamayı dene; sürekli kriz, açıklanamayan çıkmaz ve kolay sınırsız para yollarını değerlendir. Başarısızlığın bedeli ve verilen sözler korunsun.
  - P01/P03'ü gerçek sözleşmelerle genişlet; P07'nin satış/elde tutma örneğini yalnız mevcut oyuncu ve transfer sistemiyle bağla. Katalogdaki altyapı geçmişi veya tam yatırımcı sistemi hazır varsayılmaz.

**Bitiş ölçütü:** Anlaşmalar yalnız konuşma sonucu olmaktan çıkıp kulübün gelecekteki parasına, kadrosuna ve ilişkilerine işleniyor.

## Aşama 5 — Bir tam sezon

**Bağımlılık:** Aşama 4. İlk lig formatı ve sezon takvimi seçilmiş olmalı. Kapsamlı adaylık hikâyesi bu aşamanın koşulu değildir; görevdeki TEST başkanıyla sınanabilir.

- [ ] **5.1** Aşama 3'teki fikstür/takvim temelini diğer kulüpler, puan durumu ve transfer dönemleriyle tamamla; sezon geçişini kur.
- [ ] **5.2** 3.8'deki diğer maç/canlı skor temelini bütün sezon ve fikstüre genişlet; arayüzü kilitlemeden toplam maliyeti, puan tablosunu ve sonuç tutarlılığını ölç. Aynı maç kimliği yeniden simüle edilmez veya ikinci kez uygulanmaz.
- [ ] **5.3** Ev/deplasman kimliklerini, taraftar dağılımını ve başkan bölümündeki komşu kişileri bağla.
- [ ] **5.4** İlk taraftar/medya tepkilerini sezon ölçeğine genişlet; medya/TV, hakem-federasyon gündemi ve rakip başkan ilişkilerini sezon olaylarına bağla. Gerçek kamuoyu sözleri/özel konuşmalar ve tanıdık kişi tepkileri ayrışsın; 2.8K üslubu sezon içinde tekrar ve karar yükü bakımından sınansın.
- [ ] **5.5** Bilet, doluluk ve yayın/sponsor gelirlerini takvime bağla; ekonomik şartların ilk etkilerini ekle.
- [ ] **5.6** Sezonu baştan sona oyna; dönem sonu ödemeler, sözleşmeler, geçmiş ve yeni sezon hazırlığını doğrula. Günlük akışın tekrarını ve sezon süresini ölç; yalnız hızlandırılmış deneme tempo onayı sayılmaz.
  - Farklı başlangıçları sezon ölçeğinde karşılaştır; olayların bazı kariyerlerde hiç oluşmamasını, zor dönem sonrası toparlanmayı ve iyi yönetimin azalttığı iş yükünü değerlendir. P10/P11 yalnız ilgili kupa/kademe kuralları ve gerçek sportif sonuçlar hazırsa açılır; bunlar için sahte başarı üretilmez.
- [ ] **5.7** Küçük geliştirici örneklerinde kişinin ayrılması/emekliliği, yerine yeni kişi gelmesi ve sezonlar arası kulüp/kademe değişimini sınayarak uzun kariyerin veri temelini doğrula. Seçilmemiş kurallar TEST diye işaretlenir; kapsamlı yaşam döngüsü Aşama 7'de, üç lig ve gelişim Aşama 8'de tamamlanır.

**Bitiş ölçütü:** Bir sezon boyunca hem maç hem yönetim ilerliyor; son tarihler, para ve sonuçlar tutarlı kalıyor. Yeni sezona ve küçük dünya değişimlerine kayıt bozulmadan geçiliyor; sakin dönem ve toparlanma yolları oynanabiliyor.

## Aşama 6 — Taraftarlıktan adaylığa hikâye

**Bağımlılık:** Aşama 5. Kulüp geçmişi ve ilk seçim kuralları seçilmiş olmalı. Temel kişiler ve kulüp kimliği daha önce hazırlanabilir; burada kapsamlı giriş tamamlanır.

- [ ] **6.1** Kulüp/şehir geçmişini ve tekrar karşılaşılacak temel kişileri tamamla; 2.4A'nın dar örneğini devralınan koşulların tutarlı birleşimlerine genişlet. Temel gerçekleri adaylıktan önce kur; sezonun olay sırasını yazma. Değişken koşullar sabit kimlik/geçmişle çelişmesin.
- [ ] **6.2** Tribün, gazete, çevreyle görüşme ve adaylığa davet sahnelerini kur; oyuncuya girişte anlamlı seçimler ver.
- [ ] **6.3** Adaylık açıklaması, yönetim havuzu, ekipçe vaat hazırlama ve rakip aday karşılaşmaları ekle.
- [ ] **6.4** Röportaj, hazırlıksız yakalanma ve seçim günü akışını kur; ilk seçim çoğunlukla ulaşılabilir olsun fakat kaybetme yolu bulunsun.
- [ ] **6.5** Nadir süreli cevap, süre dolması ve okuma/flaş/sarsıntı seçeneklerini ilgili sahnelerde birlikte dene; erken aşamadaki okunabilirlik ve ayar temelini kullan.
- [ ] **6.6** Kazanma ve kaybetme geçişlerini kaydet; görev dışı takip için temel giriş sun. Uzun görev dışı yıllar Aşama 7'de tamamlanır.
  - P02 vaat ve P14 destek ittifakı örneklerini gerçekten verilmiş sözler ve seçilmiş seçim kurallarıyla bağla. Girişteki aynı sahne dizisi veya kaçınılmaz transfer başarısızlığı zorunlu olmaz.

**Bitiş ölçütü:** Gerçek oyun başlangıcından kampanyaya ve seçimin iki sonucuna gidiliyor. Seçilen ekip ve verilen vaatler sınanmış sezon döngüsüne taşınıyor.

## Aşama 7 — Uzun kariyer, görev kaybı ve yaşlanma

**Bağımlılık:** Aşama 6. Yaş modeli ve kupasız kariyer sonlarının ilk şartları seçilmiş olmalı.

- [ ] **7.1** Tekrar seçimde görev geçmişini, vaatleri ve rakipleri kullan. Başkanın üslubu yaşanmış davranışlardan tanınsın; görünür kişilik puanı veya değişmez başlangıç sınıfı kurulmasın. Tam ilişki/hafıza etkilerini gerçek geçmişle genişlet.
- [ ] **7.2** Görev kaybında yetkileri kaldır; yeni yönetimin kulübü yönetmesini ve erişilebilir önemli gelişmelerde duran daha hızlı takip takvimini çalıştır. Yeni yönetimin başarısızlığı veya eski başkanın dönüşü garanti olmasın.
- [ ] **7.3** Kulis, açıklama, farklı koltuktan maç izleme ve yeniden adaylığa hazırlanmayı ekle.
- [ ] **7.4** Başkanın yaşlanmasını, tecrübesini ve ekip ihtiyacını zamanla değiştir; kullanıcının seçimini rastgele değiştirme.
- [ ] **7.5** 5.7'de sınanan temel üzerinden insanların geçmişini, ayrılmasını, emekliliğini ve yerine yenilerinin gelmesini kariyer ölçeğine genişlet.
- [ ] **7.6** Kupasız son koşullarını ve geçmişe göre kapanışın temelini kur; görev kaybıyla karıştırma.
- [ ] **7.7** Birkaç seçim döngüsünü geliştirici hızında ve seçilen bölümleri normal tempoda doğrula.

**Bitiş ölçütü:** Aynı dünya görevde ve görev dışında sürüyor; yeniden adaylık, kuşak değişimi ve olası kariyer sonu kayıttan devam edebiliyor.

## Aşama 8 — Kulübün büyümesi

**Bağımlılık:** Aşama 7. Üç kademe arasındaki geçişler ve alt sınır seçilmiş olmalı.

- [ ] **8.1** Üç ligin kulüp kimliklerini, yükselme/düşme ve sezon geçişlerini tamamla.
- [ ] **8.2** Altyapıdan yeni oyuncu, gelişim, sakatlık sonrası dönüş ve yaş etkilerini uzun kariyere bağla.
- [ ] **8.3** 2.8'in küçük görünür izi ve 2.8D'nin ortak stat temelini kapsamlı tesis/stat yatırımına genişlet. Başlangıçtaki kendi stadın etap etap gelişsin: maliyet, takvim, bakım, kapasite ve tamamlanan iş görüntüye yansısın. Lig atlayınca hazır şehir stadına geçilmez; balkon ve maç görünümü aynı yatırım durumunu kullansın.
- [ ] **8.4** Kulüp büyüdükçe kadro, yönetim havuzu, sponsorluk ve kamuoyu ölçeğini değiştir.
- [ ] **8.5** Erken hafıza ve gözlem örneklerini odalardaki kupalar, fotoğraflar ve kişisel geçmişle genişlet; isteğe bağlı antrenman ve kulüp ortamlarını geliştir. Mesaj ekleri, tanıdık karşılaşmalar ve tamamlanan yatırımlar gerçek geçmişi taşısın; koleksiyon/tıklama kotası olmasın.
  - P04/P06 tesis ve topluluk desteği, P08 yetiştirme, P09 geri dönüş ve P11 büyüme örneklerini hazır sistemlerle genişlet. P09 için kişinin kulüple bağı ve ayrılışı gerçekten bulunmalı; her kariyere zorunlu efsane dönüşü eklenmez.

**Bitiş ölçütü:** Kulüp ilerliyor veya geriliyor; insanlar ve mali yapı bu değişimi taşıyor. Gelişim ve yatırım otomatik başarı garantisi vermiyor.

## Aşama 9 — Avrupa ve finaller

**Bağımlılık:** Aşama 8. Kupa formatları, katılım şartları ve başarı finalinin özel durumları seçilmiş olmalı.

- [ ] **9.1** Avrupa kupaları, dış rakipler ve yabancı oyuncu kaynaklarının gerekli temsilini kur. Motorda eleme maçı: uzatma devreleri ve penaltı atışları (T10'dan ertelendi, 2026-10-11; maç içi penaltı modeli hazır).
- [ ] **9.2** Büyük Avrupa statları, deplasman ortamları ve başkan ilişkilerini ekle.
- [ ] **9.3** Üst ligde doğan Avrupa hayalini ve bırakma hedefini hikâyeye bağla.
- [ ] **9.4** Yalnız en büyük kupanın uygun kariyer sonucuyla başarı finalini tetiklemesini doğrula; küçük kupa ve görev dışı durumları ayrı değerlendir.
- [ ] **9.5** Kutlama, dönüş, veda ve geçmişe göre farklılaşan kupasız finalleri tamamla.
- [ ] **9.6** Kupaya giden birden fazla zor ama mümkün yolu test et; yapay rakip güçlendirmesi ve açıklanamayan engeller kullanma.
  - Olaylar Avrupa başarısının mali/insani sonuçlarını işler; kura veya skor senaryo gereği zorlanmaz. Kütüphanedeki birleşimler zorunlu final yolları sayılmaz; sınırlı testler her başlangıç ve karar dizisine başarı garantisi vermez.

**Bitiş ölçütü:** Kariyerin başarı ve başarısızlık yolları tamamlanabilir; final geçmişi yansıtır ve aynı kayıtta tekrar tetiklenmez.

## Aşama 10 — Ürünü tamamlama

**Bağımlılık:** Ana kariyer yolları ve ekranların çalışması. Gün içi kayıt, temel okunabilirlik ve standart sakin hareket erken aşamalarda sınanır (hareket ayarı 2.8J'de, dönüş özeti 2.8L'de kaldırıldı); burada bütün ürün ölçeğinde tamamlanır. **Bütün ses tasarımı bu aşamadadır (2026-10-01 kararı); önceki aşamalarda ses eklenmez.**

- [ ] Olay ve karakter çeşitliliği, tekrar kontrolü, ekonomi/seçim/Avrupa dengesi ve uzun oturum testleri.
- [ ] İlk aydınlık kulüp sahnelerinden sonra kapsamlı hava/saat değişimleri ve gölgeler; ayakların yere basması; VAR incelemesinin sunumu; ikinci yarı kenar ısınması.
- [ ] Yakın seyirciler, yüz/atkı ayrıntıları, erken ayrılma, tezahürat ve koreografi; sesle uyum.
- [ ] Ses tasarımını bu aşamada kur: oda/balkon ortamı, bildirim, tribün, düdük ve tören; ses/sessiz ayarları ve okunabilir görsel karşılıkları birlikte tasarlanır. Konuşma/seslendirme kapsamı ayrıca değerlendirilir. Sürekli baskı ve tekrarlayan uğultu normal tempoda dinlenerek sınanır.
- [ ] Erken ayar ve okunabilirlik temelini bütün sahnelere uygula; süreli karar erişilebilirliği ve desteklenecek dil kapsamını tamamla.
- [ ] Dolu büyük statlar, arka plan maçları, uzun kariyer kayıt boyutu ve hedef donanım performansı.
- [ ] 2.8A/2.8C'de ayrılan geliştirici panelini, TEST bilgi kutularını ve deneme yollarını yayın paketinden çıkar; ekonomiyle yönetilen değerler gerçek sistemden gelsin.
- [ ] Masaüstü paketi, çevrimdışı çalışma, güncelleme/kayıt uyumluluğu ve seçilen Steam özelliklerini tamamla.
- [ ] Mağaza anlatımını çalışan sürümden oluştur; fiyat, yayın ve dağıtım kararlarını kullanıcıyla kesinleştir.

**Bitiş ölçütü:** Hedeflenen kariyer yolları tamamlanıyor; kayıtlar, paket ve içerik uzun oyunlarda güvenilir. Yayın yalnız doğrulanmış kapsamla yapılır.

## Açık kararların takibi

Oyun kararlarının listesi ve son karar tarihleri [OYUN_TASARIMI.md](OYUN_TASARIMI.md) içindedir. Platform, kayıt ayrıntıları ve uygulama tercihleri [TEKNIK_PLAN.md](TEKNIK_PLAN.md) içinde açık olarak işaretlidir. Bir karar alındığında ana belgesine işlenir ve yukarıdaki “Geçerli kararlar” listesine kısa, tarihli kayıt eklenir.

Kesin para tutarları, olay aralıkları, başarı olasılıkları ve yaş etkileri oynanış testi gerektirir. Planlanmış olmak tamamlanmış olmak değildir; yalnız uygulanıp doğrulanan işler işaretlenir.

## Tamamlanan turlar

Ayrıntılı kayıt: `git tag -n9 'tur/*'` ve etiketteki belgeler (ör. `git show tur/t17:MAC_MOTORU_GERCEKCILIK_PLANI.md`, `git show tur/s1:FUTBOL_KUTUPHANESI.md`). 2026-10-10'dan önceki işler (Aşama 1, 2.1–2.8W, N1–N13, MM0–MM4, MA1) etiketsizdir; `main` geçmişindedir.

| Etiket | Tarih | Ne getirdi |
|---|---|---|
| `tur/t0-t1` | 2026-10-07 | Ölçü ve araçlar (robotluk ve oyuncu karnesi), insan gibi hareket |
| `tur/m0` | 2026-10-07 | Araç ve hız (motor-yukle, hiz-olcum, oturum-sonu) |
| `tur/t2` | 2026-10-07 | Topla oyun: baskı süresi, devam değeri, taşıma, bekleme |
| `tur/t3` | 2026-10-07 | Profil kapısı (`js/mac-profil.js`) |
| `tur/t9a` | 2026-10-07 | Top fiziği (sürükleme, Magnus, sekme, yuvarlanma) |
| `tur/a2a`, `tur/a2b` | 2026-10-08 | Animasyon temeli ve tetiği motorda olan hareketler |
| `tur/t4` | 2026-10-09 | Bire bir: çalım, vuruş hazırlığı, top saklama |
| `tur/t5` | 2026-10-09 | Temas fiziği, temastan faul |
| `tur/t7` | 2026-10-10 | Takım zekâsı: niyet, maç durumu, hoca kapısı, pres |
| `tur/m1` | 2026-10-10 | Hız bakımı, `MOTOR_AYAR` düzeni |
| `tur/t6` | 2026-10-10 | Hava topu |
| `tur/t9b` | 2026-10-11 | Vuruş modeli |
| `tur/t8` | 2026-10-11 | Duran toplar |
| `tur/t10` | 2026-10-11 | Maç olayları ve hakem, sakatlık |
| `tur/u1` | 2026-10-12 | Maç 20 dk, ×1/×2/×4, önemli anlarda normal hız |
| `tur/t12` | 2026-10-12 | Hücum hacmi ve şut profili |
| `tur/t13`, `tur/a3` | 2026-10-13 | İvmelenme ölçümü; fren, dönüş, depar çizimi |
| `tur/t14` | 2026-10-14 | Kanat ve hücum koşuları |
| `tur/t15` | 2026-10-14 | Kaleci: niyetli çelme, tutuşlar, duraklı penaltı |
| `tur/h1`, `tur/a5` | 2026-10-15 | Hareketin robotluğu; kesitli insan modeli |
| `tur/t16`, `tur/a4` | 2026-10-15/16 | İkinci yarı; eksik hareketler |
| `tur/m2` | 2026-10-16 | Temizlik ve çevre kontrolü |
| `tur/t17`, `tur/t18` | 2026-10-16 | Kornerin ikinci evresi; görev bağlılığı ve yorgunluk |
| `tur/m3`, `tur/t19` | 2026-10-17 | Hız bakımı; şutun durumu ve kaleci |
| `tur/a6`, `tur/a7` | 2026-10-17 | Çizim kalanları; hareket verisi (mocap eğrileri) |
| `tur/n14`, `tur/t20`, `tur/t21`, `tur/t22`, `tur/a8` | 2026-10-18 | Telefon ana ekranı; topla oyunun akıcılığı, topun yolu, kanat hızı ve şut kütüphanesi; çizim |
| `tur/t23`, `tur/a9` | 2026-10-18 | Hareketin sakinliği 2; adım ve baş temposu |
| `tur/z0`, `tur/z1` | 2026-10-19 | Futbol kütüphanesi; plan katmanı, ölçü, sabit açılı kamera |
| `tur/z2`, `tur/z3` | 2026-10-19/20 | Duran top sahneleri ve tempo B; oyun kurma ve iki canlı tarz |
| `tur/z4`–`tur/z7`, `tur/z5-2` | 2026-10-20 | İlerletme, savunma, bitiriş, taktik savaşının birinci bölümleri; karşı pres denemesi |
| `tur/k1` | 2026-10-20 | Hızlı düzeltmeler ve kesin kararlar |
| `tur/s1` | 2026-10-21 | Sahne protokolleri (serbest vuruş, kart, penaltı, gol sonrası) |
| `tur/p2` | 2026-10-21 | 2D maç görünümü (P1+P2), kompakt kasaba stadı |
| `tur/a-temizlik` | 2026-10-22 | Temizlik: belgeler sadeleşti, kapalı anahtarlar ve eski dosyalar kalktı, taban `p2.json` |
| `tur/b` | 2026-10-22 | 2D izlenebilirlik: amaçlı geri pas ve tarzın sabrı, iştah ve tempo, maç başına ve maç içi tarz, kutu kapısı (oto mod) |
| `tur/c` | 2026-10-22 | Oyuncu farkı: TEST kadro profilleri, göreli eğilim, geniş hız, falso ve uzun top oyuncuya bağlı, profil ve seviye ölçüleri (oto mod) |
| `tur/e` | 2026-10-23 | 2D görüntü ve kopuş: figür animasyonu 2D'de çalışmaz, olay simgeleri, top taşıyanın adı, pas isteği, kalabalıkta pul boyu (masaüstü, oto mod) |
| `tur/f2` | 2026-10-23 | Başkanlık F2: maç sonucu kariyere bir kez (`js/mac-sonuc.js`; puan durumu, son maçlar, oyuncu sayaçları, TEST ceza ve sakatlık, sıradaki hafta), Maç bitti kartı ve Odaya dön, TEST “Maçı bitir”, Canlı Skor'da son maç, `sezon-deneme` (dizüstü) |
| `tur/f1` | 2026-10-23 | Başkanlık F1: lig ve 30 haftalık TEST fikstürü, kariyer kadroları (16 kulüp, TEST adlar), maç kimliği ve tohumu, maç girdisi kariyerden, maç sınırı sayfa yeniden yüklemesi, deplasman statları, paylaşılan dondurulmuş alanlar (dizüstü) |
| `tur/d` | 2026-10-22/23 | V1 daraltılmış: pas hızı aileleri, aileye bağlı eğri ve plase, daha çok falso, amaçlı uzaklaştırma ve kafa, kale vuruşunda erken plan, dağıtımın bağlamı (masaüstü, oto mod) |
| `arsiv/a11`, `arsiv/t24`, `arsiv/v1` | 2026-10-22 | Birleşmemiş yarım dallar (düşüşler, şut T24, vuruş dili V1) |

## Silinen dosyalar ve geri alma

Silinen her dosya git'te durur: `git show <etiket>:<yol> > <yol>`.

| Ne | Silindiği gün | Geri alma |
|---|---|---|
| Eski maç tabanları (t0–t9a, n10, son, a2*) | 2026-10-10 | `git show tur/t7:araclar/taban/t4.json` |
| Eski dondurulmuş çizimler (once, a2a, a2b, t4v, t4) | 2026-10-10 | `git show tur/t7:araclar/karsilastir/t4v/animasyon.js` |
| Prototip 1–5 | 2026-10-10 | `git show tur/t7:prototipler/4-aydinlik-baskan-odasi.html` |
| Prototip 6 (iki cevap, dosya, telefon) | 2.8L | `git show 7859c4c^:prototipler/6-iki-cevap-dosya-telefon.html` |
| Eski koyu ajanda (`js/ekran-ajanda.js`, `?ekran=ajanda`) | 2026-10-10 | `git show tur/t7:js/ekran-ajanda.js` |
| Tur tabanları ve dondurulmuş kopyalar (t5…t15, a3–a9, z2 …) | 2026-10-16 → 2026-10-21 | ilgili turun ya da bir sonrakinin etiketinde: `git show tur/<ad>:araclar/taban/<ad>.json` |
| 20 eski animasyon tabanı, `k1.json`, `araclar/karsilastir/k1/` | 2026-10-22 | `git show tur/p2:araclar/taban/a9-anm.json`, `git show tur/p2:araclar/karsilastir/k1/animasyon.js` |
| `araclar/titreme-olc.py`, `prototipler/8-telefon.html`, `prototipler/9-a2-yuruyus.html` | 2026-10-22 | `git show tur/p2:<yol>` |
| Tur planları A10, A11, S1, P1, P2 (`araclar/plan/`) | 2026-10-22 | `git show tur/p2:araclar/plan/a10-uygulama.md` |
| Kapalı motor anahtarları `kanatKapat`, `aliciRahat`, `kovalaKalici`, `presKalici`, `gecisKademe`, `gecisDalga`, `kapiFazSav` ve boş `kameraOlay` | 2026-10-22 | `git show tur/p2:js/mac-dizilis.js` (ve `mac-hareket`, `mac-takim`, `mac-topla`, `mac-mudahale`) |
| `ARSIV.md`, `kutuphane/K-test-rejimi.md`; gerçekçilik planının tur kayıtları, Ek H ve Ek I; YOL_HARITASI'nın eski karar özeti ve notlar paketleri | 2026-10-22 | `git show tur/p2:ARSIV.md` (ve ilgili belge) |
