# Kasım paketi (oto mod 6): RK-D → RK1-b → RK4-b → RK3 → R6b-1' (plan, 2026-11-01, masaüstü)

**Onay (2026-11-01, kullanıcı: “Onayla, başla”):** plan ve §1'in varsayılanları onaylandı (soru 1–9 ve 11 varsayılanla). Soru 10 (`main`'e alma) için ayrı söz gelmedi: paket büyük kapıya kadar yürür, `main`'e alma kullanıcının sözünü bekler.

Kaynak: kullanıcının 14 maddesi ve tartışma kaydı [kasim-notlari-arastirma.md](kasim-notlari-arastirma.md). Bu belge onay için çıkarılan paket planıdır; kullanıcı onaylayınca oto modda uygulanır (CLAUDE.md “Makine durumu”, karar 26). Onaydan önce kod değişmez. §1'deki varsayılanlar kullanıcının cevabıyla kesinleşir; cevap gelmeyen madde varsayılanla gider.

## 0. Bir bakışta

| Sıra | Tur | Dal | Ne verir | Tahmin |
|---|---|---|---|---|
| 1 | **RK-D düzeltmeler** | `claude/rkd-duzeltme` (main'den) | Telefon ritüelinde ekrana bakma yok ve kol doğal; balkonda tarih kutusu ve künye yok; oyuncuya tıklayınca dosya; “Mesaj yaz…”; Kaçanlar yok (dosya notu); teletext 100 yalnız büyük haber, 200 tarihli; odada tarih kutusu yok, üst çubukta gün adı tam | ~4 sa |
| 2 | **RK1-b balkonda fare** | `claude/rk1b-fare` (1'den) | Sürükle = baş döner; tekerlek = imlece doğru kademesiz yakınlaşma; tık/çift tık; Z, Esc, oklar kalır | ~3 sa |
| 3 | **RK4-b kimlik ve yüz** | `claude/rk4b-kimlik` (2'den) | Köken tabloları, 7 ten rampası, 32×32 yüz, yaş katmanı (saç çizgisi, kır, sakal), boy santim her yerde, 3B başta aynı kaynak ve sabit baş ölçüsü; galeri PNG | ~9 sa |
| 4 | **RK3 arayüz taslakları** | `claude/rk3-taslak` (3'ten) | Kod değişmez. İki varyant (Kırtasiye / Kulüp evrakı 1999) × dört ekran (mali rapor, oyuncu kartı, transfer, gün başı kâğıdı) × üç genişlik PNG + dil bölümü taslağı; kullanıcı dönünce seçer | ~4 sa |
| 5 | **R6b-1' transfer bilgi akışı** (zaman kalırsa; soru 9) | `claude/r6b1-transfer` (4'ten) | Piyasa kalkar: Pano · Liste · Ara · Geçmiş; klavyeyle arama; menajer menüleri (TEST kişiler); “menajerlere duyur”; karttan Araştırt ve Menajerini ara | ~8 sa |
| — | **Büyük kapı** ve `main` | — | Akışın tamamı, sezon t7/t3 birebir, oturum sonu `--ayni --seyrek`, okunurluk, kontrol, akis-2d, hız bütçesi; `main`'e alma yalnız kullanıcının bu pakete verdiği izinle (soru 10) | ~2 sa |

Dallar zincirde (karar 63). Her turun sonunda `tur/<ad>` açıklamalı etiket, devam notu, commit ve push. Bir tur kapanmadan sonrakine geçilmez; bir turun kabulü tutmazsa o tur dalında bırakılır, notu yazılır, sonraki tur önceki **geçen** turun dalından açılır.

## 1. Bu paketle kesinleşecek kararlar (varsayılanlar; kullanıcı cevabı önce gelir)

1. **Yüz ızgarası 32×32**; kartta 3× (96 px), kadro listesinde 1× (32 px, satır yüksekliği buna göre); alternatif 24'te burunsuz — tercih edilmedi.
2. **Köken ve boy kayda yazılmaz, türetilir** (RK4-a mantığı): köken oyuncunun kimliğinden ve kulübün ligine göre (bugün bütün lig yerli); kayıtta isteğe bağlı `koken` alanı varsa o geçerli (içerik ve ileride transfer havuzu için). Boy santim = `round(180 × boy)`; `boy` ölçeği değişmez → **motor birebir**. Kayıt sürümü yalnız ten yeniden türetimi için 13'e çıkar (aşağıda).
3. **Lig kademesine göre yabancı kuralı:** bu pakette yalnız üretim dağılımı — 3. Lig'deki 16 kulüp ve serbest havuz Türkiye kökenli (Türkiye içi çeşitlilik tablodan); öbür dokuz köken tablosu hazır durur, yabancı oyuncu girişi H3/büyüme ve transfer havuzuyla gelir. TFF'nin alt lig yabancı kuralının kesin metni ayrıca doğrulanır, OYUN_TASARIMI'na “açık karar” olarak yazılır.
4. **Tıklama:** tek tık bakış (gruba, sonra oyuncuya), takip edilen oyuncuya tık ve her yerde çift tık dosya; ad etiketi basıldığı anda açar.
5. **Balkonda saat alt şeritte** küçük (“Pzt 15:20”); tarih kutusu balkonda ve **odada** kalkar; üst çubukta gün adı tam (“23 Kasım Pazartesi · 08:00”).
6. **Telefonda “Mesaj yaz…”** kutusu (kalem simgesi); dokununca hazır konular hızlı cevap listesi; panel başlığı “Mesaj”.
7. **Kaçanlar** bölümü kalkar; aynı olay oyuncunun dosyasına tarihli not ve gazeteye “Kulis”.
8. **Teletext 100** maç sonucu ve kırmızı kart satırları yok; gazetenin önem eşiği; **200** gün başlıklı; **300**'e ay günü.
9. **RK3 varyantları** Kırtasiye ve Kulüp evrakı 1999; ekranlar mali rapor, oyuncu kartı (32 px yüzle), transfer panosu (Liste/Ara düzeniyle), gün başı kâğıdı.
10. **R6b-1'** bu pakette (zaman kalırsa) ve menajer kişileri Claude'un **TEST** taslağı (üç kişi, metinler yer tutucu, kullanıcı değiştirir).
11. **`main`'e alma:** büyük kapı geçince paket birlikte `main`'e alınır (paket 1 ve 2 gibi; her push GitHub Pages'e yayındır).
12. **Eski dal `claude/stat-gorsel`** dokunulmaz (kullanıcı söylerse silinir; tartışma kaydı `main`'de).

## 2. Oto mod kuralları

- Başlarken `main`'in devam notuna “**Makine durumu: masaüstü çalışıyor, dal claude/rkd-duzeltme** (Kasım paketi)” yazılır ve push edilir. Her turun kapanışında dal push edilir; push'tan önce `git fetch`, uzak dal ilerlemişse push edilmez ve durulur. Bitince satır “boşta”.
- Her düzenlemeden sonra `node araclar/hizli.js`; kural dosyası değişen turda `kariyer-deneme`; ekran değişen turda ilgili `akis-deneme.py` bölümleri ve `okunurluk.py` sahneleri; 3B değişince `kontrol.py`. Motor dosyalarına dokunulmaz (`mac-motoru.js` ve motor klasörü); `boy` ölçeği değişmediği için sezon tabanı `--ayni` tutmalıdır — tutmazsa durulur.
- **Durma koşulları:** beklenmeyen kabul dışı (YENİ borç), sezon tabanı farkı, akışın tamamında bilinen B40 dışında çökme, kayıt geçişinde veri kaybı. Durunca o turun notu yazılır, sonraki tura geçilmez; büyük kapı geçen turlarla koşar.
- Kullanıcı kararına bakan her şey varsayılanla yapılır ve devam notunda “kullanıcıya bakılacaklar” listesine girer.
- İçerik kuralı: yeni kişi ve metinler yalnız TEST yer tutucu (menajerler, menü metinleri, gün başı kâğıdı cümleleri).

## 3. Tur planları

### RK-D — düzeltmeler

**Oyunda.** (a) Telefon ritüeli: ekran evreleri sıfır; telefon masadan alınır, bel hizasına iner, karenin alt kenarından çıkar; varışta aynı yoldan gelir, masaya konur; her yön ~1,0 sn; bakış telefona dönmez. Kol: üst kol ve dirsek blokları eklenir, kol görünürlük anahtarı yerine karenin altından girip çıkan yolla gelir. (b) Balkon: `.od-antrenman` künyesi kalkar; Gördüklerin alt şeritte İZLE düğmelerinin yanında (“Gördüklerin · n”); `.od-tarih` balkonda ve odada kalkar; alt şeridin ilk satırının başında küçük saat; üst çubukta tam gün adı. (c) Tık: takip edilene tık / çift tık / etiket `pointerdown` → dosya. (d) Telefon: “+ Yeni konu aç” → mesaj kutusu “Mesaj yaz…”, panel başlığı “Mesaj”. (e) Transfer Geçmiş: Kaçanlar bölümü kalkar; kapanan alım dosyasının sonucu oyuncu dosyasına not (`oyuncuNotlari` kaynak `transfer`) ve gazeteye Kulis. (f) TV: 100'den `sonuc`/`kirmizi` çıkar, boş günde “Bugün önemli haber yok”; 200 gün başlıkları, oynanan skor, canlı dakika, gelecek saat; 300'e ay günü. (g) Üst çubuk gün kısaltması: PZT/SAL/ÇAR/PER/CUM/CMT/PAZ.

**Kapsam.** `js/oda.js` (`odaYolKur`, `odaElKare`, `odaElYuzPayi`, bakış ağırlığı), `js/yuruyus.js` (`yrElKur`), `js/stil-99.js` (`STIL.oda.yuru.rituel`, `STIL.yuruyus.el`), `js/ekran-oda.js` (tarih, künye, alt şerit, tık), `index.html` (CSS), `js/ekran-telefon.js`, `js/ekran-transfer.js`, `js/transfer-alim.js` (kaçan verisi not kaynağına), `js/kadro-dosyasi.js` (not kaynağı), `js/gazete.js`/`js/soz.js` (Kulis kaynağı), `js/haber.js` (`tvHaberleri` süzgeci), `js/ekran-tv.js`, `araclar/yuruyus-yakala.py` (ekran anları kalkar), `araclar/akis-deneme.py` (balkon 1050, 1055, 3757–3790, 3840; telefon 640–649, 3269–3340; TV 37/39; transfer 32), `araclar/okunurluk.py` (229, sahne listesi).

**Yapılmayacaklar.** Yeni poz, yeni figür, ritüel süresi dışında yürüyüş değişikliği; haber türü ekleme; Kadro ve kart düzeni (RK4-b).

**Kabul.** Ritüelde telefon hiçbir karede göz hizasına çıkmaz; kol karenin içinde anlık belirmez (ilk görünür karede kolun en az yarısı karenin altında); balkonda `.od-tarih` ve `.od-antrenman` yok; takip edilen oyuncuya tık dosyayı açar, çift tık geniş bakıştan da açar; 100'de `MAÇ SONUCU` satırı yok; 200'de her maç bir gün başlığı altında; `hizli.js`, `kariyer-deneme` (not kaynağı), akış 3, 12, 15, 21, 22, 32, 34, 36, 37, 39 ve okunurluk balkon, telefon, TV, transfer sahneleri beş genişlikte eşikte.

**Belgeler.** STIL_REHBERI §7 (RK1/RK2/RK8-a satırlarına düzeltme notu), OYUN_TASARIMI §2 telefon konuları cümlesi, CLAUDE.md “Bugün çalışan” (telefon ritüeli, balkon, TV), YOL_HARITASI karar satırı.

### RK1-b — balkonda fare

**Oyunda.** Sürükleme başı döndürür (yatay ±70°, dikey −35…+10°; hız 140°/sn sınırında; bırakınca yumuşak durur). Tekerlek imlecin altındaki saha noktasına doğru kademesiz yakınlaşır (46°→9°; nokta sabit kalır; 220 ms gecikme kalkar, adım %12). Tık ve çift tık RK-D'deki gibi; takipteyken sürükleme takibi bırakır. Z üç kademeyi döndürür, Esc zinciri ve ←/→ aynen. İmleç: sürüklerken el kapalı, zeminde büyüteç, figürde el.

**Kapsam.** `js/balkon.js` (`balkonBakis` hedef türüne `serbest` ve sürekli `fov`), `js/ekran-oda.js` (pointerdown/move/up, wheel), `js/oda.js` (`odaKare` bakış lerp'i sürekli fov ile), `STIL.balkon` (sınırlar, hızlar; TEST). Kayda girmez.

**Kabul.** 46°'de bütün saha, 9°'de tek oyuncu dizden başa karenin ~%60'ı; tekerlekte imlecin altındaki nokta ekranda ≤8 px kayar; sürüklemede saha dışına bakılmaz; `kontrol.py` balkon karesi p95 ≤4 ms; akış 34, 36 ve `okunurluk` balkon sahneleri geçer.

**Belgeler.** STIL_REHBERI §7 balkon (RB ve RK1 satırlarına ek), OYUN_TASARIMI §6 balkon cümlesi, CLAUDE.md “Bugün çalışan”.

### RK4-b — kimlik ve yüz

**Oyunda.** Her oyuncunun yüzü 32×32 ve kökenine, yaşına uygun: ten yedi rampadan (Türkiye merkezi açık ve orta zeytuni), saç ve göz rengi kökene göre, kaş ile göz arasında zorunlu boşluk; yaş kayıt tarihinden gelir ve yüz sezonlarla değişir (saç çizgisi geri çekilir, kır karışır, sakal değişebilir; genç saçı dolgun; 30+ göz altı gölgesi). Boy santim oyuncu kartında, Kadro'da ve Canlı Skor oyuncu sayfasında. 3B figürde ten, saç çizgisi ve kır aynı kaynaktan; boy gövde ve bacağı ölçekler, baş sabit (üç boy sınıfı balkondan okunur). Galeri PNG'de aynı kimlik dört yaşta.

**Üreteç (Claude kararı).** Yeni `js/kimlik.js` (saf, Node'da da): `kokenTablosu` (10 köken: ten rampası, saç ve göz rengi ağırlıkları, kellik ve kır ofseti; sayılar `kasim-notlari-arastirma.md` §4.1'den, TEST), `kimlikTuret(p, kulupLigi)` → {koken, rampa, sacRenkIdx, gozRenk, kellikYatkinlik, kirYatkinlik, sakalEgilim, kafa, kas, burun, agiz} (FNV-1a + murmur3, RK4-a karıştırıcısı; `p.koken` varsa o), `yasKatmani(kimlik, yas)` → {sacCizgisi 0–4, griOrani 0–1, sakal}, `boyCm(p)`. `js/portre.js`: 32 ızgara, rampadan dört ton, kaş ≥2 kademe koyu (en koyu iki rampada ten gölgesi), göz 2×2, kaş 3×1, 1 px boşluk, burun 1×2, ağız 3×1; saç ve sakal katman; yaş katmanı uygulanır; önbellek anahtarına yaş bandı girer. `STIL.tenler` 7 rampa (ışık/orta/gölge/çizgi); 3B `kitKaydi` rampanın orta tonunu alır. **Üretim:** `oyuncuUret` içinde `ten` çekimi aynı tek `r()` çağrısıyla ağırlıklı tabloya döner (çekim sırası değişmez → `boy`, `oz`, `sac` aynı → motor birebir); kimliğin kalanı id'den türer. **Kayıt sürümü 13:** `KAYIT_GECISLERI[12]` bütün oyuncuların ve hocaların `ten`ini yeni palet indeksine yeniden türetir (kozmetik; motor okumaz); `kadrolar.js`'teki elle yazılmış `ten` değerleri eski→yeni eşlemeyle. **3B:** `js/oyuncular.js` `root.scale` gövde için kalır, baş kemiği 1/h ile sabitlenir; saç halkaları saç çizgisi aşamasına göre (tepe ve şakak kesimi), kır karışımı malzeme rengine. Kişi portreleri (16×16) **ikinci dilim, zaman kalırsa:** hoca, kaptan, gazeteci, yardımcı, mali müdür aynı üreteçle 32'ye.

**Kapsam.** `js/kimlik.js` (yeni), `js/portre.js`, `js/stil-99.js` (`STIL.tenler`, `STIL.portre`), `js/kariyer-kadro.js`, `js/hoca.js` (hoca ten çekimi), `js/kayit.js` (sürüm 13), `js/oyuncu-karti.js` (boy satırı, 96 px yüz), `js/kadro-dosyasi.js` ve `js/ekran-dosya.js` (Boy sütunu, 32 px satır), `js/canli-skor.js`/`js/ekran-canli.js` (oyuncu sayfasında boy), `js/oyuncular.js`, `araclar/portre-denetimi.js` (histogramlar: ten/saç/göz/kellik hedefleri; aynı tohum aynı yüz; 3B ile rampa eşitliği), `araclar/portre-galerisi.html` (dört yaş sütunu), `index.html` (yükleme sırası: `kimlik.js` `portre.js`'ten önce).

**Yapılmayacaklar.** Motor dosyaları; `boy` ölçeğinin üretimi; uyruk alanı ve yabancı oyuncu girişi; yaşlanmanın kayıt dışı başka etkisi; kişi portreleri (zaman kalmazsa).

**Kabul.** 500 yerli üretilmiş oyuncuda en koyu iki rampa ≤%6, açık+açık zeytuni ≥%60, açık göz %20–30 (histogram aracı); 32 px'te hiçbir yüzde kaş ile göz bitişik değil (denetim pikselle sayar); aynı kimlik 19/26/33/38 yaşlarında aynı adam (galeri, kullanıcı onayı); sezon t7 18/18 birebir (`sezon-rk7-t7`, `--ayni`); kayıt 12→13 geçişinde oyuncu sayısı ve bütün sayaçlar aynı; `kontrol.py` galeri ve balkon; akış 22, 24, 31, 32, 34, 36; okunurluk kadro, oyuncu dosyası, canlı oyuncu, transfer oyuncu beş genişlikte; `hiz-olcum` gerekmez (motor değişmedi), balkon karesi p95 ≤4 ms.

**Belgeler.** STIL_REHBERI §7 “Oyuncu kartı ve yüzler” (32 px, rampa, yaş katmanı), §4 insanlar (boy ve baş ölçüsü), OYUN_TASARIMI §9 (boy görünür; köken; yabancı kuralı açık karar), TEKNIK_PLAN §6 (kimlik katmanı, kayıt sürümü 13), YOL_HARITASI karar satırı, CLAUDE.md “Bugün çalışan”.

### RK3 — arayüz dili ve taslaklar (kod değişmez)

**Çıktı.** `araclar/taslak/rk/` altında statik HTML (oyunun CSS değişkenleri ve yazı aileleriyle, gerçek veriden alınmış örnek içerik) ve PNG: iki varyant × dört ekran × üç genişlik (640, 944, 1186) = 24 PNG (her biri ≤250 KB; Git'e girer). **V1 Kırtasiye:** tek krom çubuk, ince çerçeve, kâğıt öne (perde %20), 16 px 1-bit piktogramlar (kodla SVG), eşit genişlikli rakam, tek renk zebra, üç büyük rakam + değişim oku, ana eylem kâğıdın alt kenarında, Plex başlıklar, sade damga. **V2 Kulüp evrakı 1999:** antetli kâğıt (arma ve kulüp adı), daktilo başlık, mühür ve paraf, karbon kopya renkli kâğıt (pembe makbuz, sarı not), teleks şeridi; aynı ölçüler. **Ekranlar:** mali rapor (aylık, hareketli), oyuncu kartı (32 px yüz, boy), transfer panosu (Pano ve Liste/Ara düzeni), gün başı kâğıdı (asistanın notu: dünün sonucu veya manşet, bugünkü ajanda, bekleyen kararlar, kasa tek rakam). Ek: 16 px piktogram seti taslağı tek sayfada (masa şeridi, telefon konuları, haber türleri, rapor kalemleri, dosya sekmeleri, kart cevapları, durum damgaları). **Dil bölümü taslağı:** STIL_REHBERI §7 için “Arayüz dili” (ilkeler §6.4 `kasim-notlari-arastirma.md`), onaylanana kadar `araclar/taslak/rk/DIL.md`.

**Denetim.** `okunurluk.py` mantığı taslaklara (yazı tabanı 14, en küçük 12, kontrast ≥4,5:1 ölçülür); PNG'ler `kontrol.py` kalıbıyla.

**Kabul.** 24 PNG ve DIL.md hazır; kullanıcı dönünce ekran başına seçer; seçim RK5'in ölçüsü.

### R6b-1' — transfer bilgi akışı (zaman kalırsa; soru 9)

**Oyunda.** Transfer sekmeleri Pano · Liste · Ara · Geçmiş. **Pano:** dönem, kasa, açık işler, gelen teklifler ve **gelen öneriler** (menajer menüsü: 3–8 ad, kâğıt; kulüp beyanı “X müsait”; dönemde haftada 0–2, dışında ayda 0–1; TEST). **Liste:** kulübün kısa listesi (eski Takip + hocanın ve yardımcının önerdikleri + kabul edilen menü satırları), mevki başına kümeli, her adın yanında kaynak ve tek satır kanaat, elenenler soluk; “Takibe al” kalır. **Ara:** kamu künyesinde klavyeyle arama (ad, kulüp; çipler mevki, yaş, sözleşme bitişi, boy), hazır süzgeçler “Sözleşmesi bitenler” ve “Serbestler”; sonuç kartı kamu bağlamında; karttan **Araştırt** (hoca/yardımcı, 1–3 gün, dosya) ve **Menajerini ara** (telefon konusu; isteklilik ve fiyat ancak böyle öğrenilir; menajer abartır). **Geçmiş:** gelen ve giden (bu sezon). Telefonda “<Hat> hattına oyuncu bulalım” kartına üçüncü yol değil, cevabın yüzünde seçenek: “menajerlere de duyur” → sonraki günlerde Pano'ya öneri; sızıntı olursa gazete yazar. Canlı Skor'da aynı arama (kamu). Piyasa sekmesi ve `satilikSinyali` kalkar; “forma bulamayan” bilgisi yalnız hocanın/menajerin sözü olarak Liste'ye not düşer.

**Kapsam.** `js/piyasa.js` → `js/arama.js` (saf arama ve süzgeçler) ve `js/liste.js` (kısa liste kuralı), yeni `js/menajer.js` (TEST üç menajer: ad, uzmanlık, gizli abartı ve isabet; menü üretimi kayıttan), `js/transfer.js`, `js/transfer-alim.js` (“menajerlere duyur” kıvrımı, Araştırt kısa yolu), `js/ekran-transfer.js` (sekmeler, `<input>`), `js/ekran-canli.js` (arama), `js/yazisma.js` (Menajerini ara konusu), `js/gazete.js` (sızıntı), `js/kayit.js` (yeni alanlar varsayılanla; sürüm 13 içinde ek geçiş yok, alanlar yoksa boş kurulur), `araclar/kariyer-deneme.js` (liste ve menü belirlenimci), `araclar/akis-deneme.py` §32 (yeni sekmeler), `okunurluk.py` (transfer sahneleri).

**Yapılmayacaklar.** Üst lig ve yurt dışı havuzu; gözlemci personeli (slotlar Y'de); menajer ücreti ve komisyon kuralı; kiralık.

**Kabul.** Arama 376 oyuncuda ad ve kulüp eşleşmesini ≤50 ms'de döndürür ve 20 ile sınırlar; aynı tohumda aynı menüler aynı günde gelir; Liste'de her satırın kaynağı var; Piyasa sekmesi yok; `kariyer-deneme`, akış 32 (+ telefon 21), okunurluk transfer sahneleri; sezon t7 birebir (menüler kayıttan türer, maçı etkilemez).

**Belgeler.** OYUN_TASARIMI §2 transfer (Piyasa yerine Liste/Ara; menajer menüleri), §9 kaynak güvenilirliği (menajer), TEKNIK_PLAN §6 kayıt defterleri (menajer), `transfer-tasarim.md` §12 ek, CLAUDE.md “Bugün çalışan”, YOL_HARITASI karar.

## 4. Büyük kapı ve kapanış

Paketin son turundan sonra bir kez: `python -X utf8 araclar/akis-deneme.py` tamamı (yalnız bilinen B40), sezon tabanları `sezon-rk7-t7` ve `sezon-rk7-t3` (`--ayni`, kaydet–yükleli), `node araclar/oturum-sonu.js --ayni --seyrek`, `kontrol.py`, `akis-2d.py`, `okunurluk.py` tamamı beş genişlikte, hız bütçesi (`tur/rk8-tv`'ye göre, motor değişmediği için bilgi). Geçince (soru 10 evetse) paket `main`'e alınır, birleşen dallar silinir, etiketler kalır, makine satırı “boşta”. Geçmezse `main`'e alınmaz, devam notunda nedeni ve kalan iş yazılır.

## 5. Temizlik ve belge güncellemeleri (paket boyunca)

- `araclar/plan/OKU.md`'ye Kasım notları ve paket planı satırı; `rk-program.md` §“Sonrası”na bu paketin bağlantısı.
- YOL_HARITASI: devam notu (makine satırı, her tur sonunda kısa durum), “Geçerli kararlar” (paket kararları 78–8x), tamamlanan turlar tablosu; başta “Son güncelleme” cümlesi.
- CLAUDE.md “Bugün çalışan” ve “Program” paragrafları (RK-D, RK1-b, RK4-b, RK3 çıktısı, R6b-1'); “Oyun yönü › Maç 2D”deki eski “Piyasa” sözcükleri.
- STIL_REHBERI §7'deki “Yeni konu aç”, tarih kutusu, künye, 24×24 cümleleri tarihsel nota döner; OYUN_TASARIMI §2 ve §9; TEKNIK_PLAN §6 ve §8 (motor → çizim sözleşmesine `boyCm` eklenmez, türetilir).
- Kod temizliği: `yrElYolu` (çağrılmıyor) ve `STIL.yuruyus.el`'in ölü alanları; `TEST: Bugün lig maçı yok` dizgesi; `satilikSinyali` (R6b-1' yapılırsa); `portre.js`'te sabit 2026; `piyasa.js` adı değişirse `index.html` yükleme sırası ve `araclar/dosya-gruplari.js`.
- Etiket açıklamaları: her `tur/<ad>` etiketi bir paragraf (ne değişti, kabul, bilinen sınır); commit mesajları Türkçe, tur öneki.
- Git dışı: `araclar/son-*.png` yeniden üretilir (yoksayılı); `araclar/taslak/rk/` PNG'leri Git'e girer (küçük).

## 6. Dikkat edilecekler

- **Motor birebirliği:** `oyuncuUret` ve `kadroUret` içindeki `r()` çağrı sırası ve sayısı değişmez; yeni kimlik çekimleri id'den ayrı karıştırıcıyla. Sezon t7 ilk kabul; tutmazsa durulur.
- **Kayıt geçişi 13:** yalnız `ten` yeniden türetimi ve hocalar; sayaçlar, para, geçmiş dokunulmaz; `kayit-s12-*` örnekleri geçişle açılır ve `kariyer-deneme` sayar; `ESKI_KAYIT_SINIRI` 8 kalır.
- **`varlik` sınırı:** motor kariyer kaydından yalnız seçili alanları kopyalar (`mac-motoru.js` 336); kimlik alanları kayda yazılmadığı için varlik değişmez.
- **Yükleme sırası:** klasik betikler; `kimlik.js` `portre.js` ve `oyuncular.js`'ten önce, `stil-99.js`'ten sonra; `ad-denetimi` üst düzey ad çakışmasını yakalar, blok içi `function` sızıntısına dikkat.
- **Akış denemesinin beklentileri** görünüşe göre güncellenir, akışa göre değil (Esc zinciri, tuşlar, komut sayıları aynı).
- **Ritüel süresi** kısalınca `akis-deneme` 12 ve 15'teki süre beklentileri (10,46 sn) güncellenir; `yuruyus-yakala.py` ekran anlarını kaybeder.
- **Kadro satırı 32 px:** dar karede tablo yatay kayar; okunurluk 640'ta sınanır; sığmazsa listede yüz 24 px'e küçültülmez, yüz kaldırılır (piksel sanatı küçültülmez).
- **Oto mod süresi:** sıra en değerliden başlar; bağlam ya da zaman biterse R6b-1' bir sonraki pakete kalır ve notu yazılır.
- **Her push'tan önce fetch;** dizüstünden paralel iş yoksa çakışma beklenmez.

## 7. Kullanıcıya sorular (cevap gelmezse varsayılan)

1. Yüz ızgarası 32×32 mi? — *varsayılan evet*.
2. Köken ve boy türetilsin, kayda yazılmasın (isteğe bağlı `koken` alanı) — *evet*.
3. 3. Lig'deki herkes Türkiye kökenli (yabancı kökenler tablo olarak hazır, büyümeyle gelir) — *evet*.
4. Tıklama: tek tık bakış, takip edilene tık ve çift tık dosya — *evet*.
5. Tarih kutusu odadan da kalksın, saat alt şeritte — *evet*.
6. “Mesaj yaz…” kutusu — *evet*.
7. Kaçanlar dosya notu ve gazete — *evet*.
8. RK3 varyant ve ekran seçimi (§1 madde 9) — *evet*.
9. R6b-1' bu pakette ve üç TEST menajer — *evet (zaman kalırsa)*.
10. Büyük kapı geçince paket `main`'e alınsın mı — **açık onay ister.**
11. `claude/stat-gorsel` silinsin mi — *hayır, kalsın*.

## 8. Durum (2026-11-01 akşam; paket bitti, `main`'e alınmadı)

Beş tur kapandı, her biri kendi dalında ve etiketinde (`tur/rkd-duzeltme`, `tur/rk1b-fare`, `tur/rk4b-kimlik`, `tur/rk3-taslak`, `tur/r6b1-transfer`); büyük kapı zincirin ucunda geçti (sonuçlar devam notunda). Plandan sapmalar:

- **RK-D:** balkonun durum satırı uzayınca okunurluk ölçüsü kesilmeyi buldu: balkonda iki satıra sarılır; masa takviminin dokusunda da gün kısaltması düzeldi (Pzt). Kaçan transfer gazeteye ayrı “Kulis” olarak eklenmedi: rakibe gidiş zaten `tr.dunya` haberidir.
- **RK1-b:** ilk ölçümde tekerlekte imlecin altındaki nokta 43–102 px kayıyordu (kamera yoldayken art arda adımlar); çapa çözümü ve izdüşüm düzeltmesiyle 0,4–1,8 px. Sürükleme de aynı çözümle tam tut ve çek.
- **RK4-b:** kayıt geçişi (sürüm 13) yapılmadı: ten kayıttaki eski alandan değil kimlikten türetilir, kayıt sürümü 12 kaldı ve motor birebir. Galeri incelemesinden sonra Türkiye kökeni koyu zeytuniye kadar (kahve ve daha koyusu başka kökenlerden), kıvırcık saç dokulu. Baş sabit ölçek ve kimlikten ten yalnız balkonda (maçın TEST figürleri ve çizim tabanları değişmedi). Kişi portreleri (16×16) ikinci dilimi yapılmadı. Kadro tablosunda Boy sütunu için sütun genişlikleri daraldı (dar pencerede ad sütunu sıfıra iniyordu).
- **RK3:** taslak sayfası yüz ve armayı oyunun işlevleriyle çizer; ölçü aracı bir sınıf çakışmasını (transfer tablosunun yazısı beyaz) ve düşük kontrastlı “B” kutucuğunu buldu, düzeldi.
- **R6b-1':** ilk dilim — arama, menajer önerileri (TEST üç menajer; kişi kaydı değil), kısa liste. Menajeri telefonla aramak, ihtiyaç ilanı (“menajerlere duyur”) ve Canlı Skor'da arama sonraki adım. Öneriler kariyerin başladığı günden önceye gitmez.
- **Araç notu:** `araclar/KAPILAR.md` ve CLAUDE.md'deki `python -I -X utf8 araclar/akis-2d.py` bu makinede Playwright'ı bulamıyor (yalıtık kip kullanıcı site-packages'ını görmez); `-I`'sız koştu ve geçti.
