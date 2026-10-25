# Arayüz mimarisi ve görsel yön — tartışma kaydı (2026-10-25, masaüstü; dal `claude/stat-gorsel`)

Durum: **tartışma sürüyor, karar yok.** Bu dosya oturumun bütün bulgularını ve Claude'un önerisini tutar; kullanıcı açık kararları verince
ilgili ana belgelere (OYUN_TASARIMI §2 ve §13, STIL_REHBERI §3, §5, §7, CLAUDE.md) işlenir, program sırası YOL_HARITASI'na yazılır.
Kullanıcının sözü (2026-10-25): önce oyun mantığı ve ekran akışı planlanır, görsel düzenleme sonra; "önce şunu düşünelim: menüler hep odadan
mı yürüyecek, ara ekranlar neler, başkan puan görmez ama istatistik görebilir; nasıl görür; görevler telefonda mı, birine mi paslanır".

## 1. Stat konsept turu (kapandı, seçim yok)

- Görev (üst oturumdan): maçı tepeden izlerken stat ve çevresi de okunsun; dört görsel konsept, tribün büyümesi ve pano katmanıyla.
- Yapılan: `prototipler/stat-konsept/` — dört konsept (1 burun/yarımada, 2 kaya çanağı/arazi yükseklik haritası, 3 nehir adası, 4 sur içi),
  üç gelişim kademesi (bugün 3. Lig çatısız; 1. Lig kısmi çatı ve tam pano; ŞL düzeyi iki katlı kapalı çanak, led şerit, balkon panosu, çatı
  yazısı, ekran), gece hâli; ortak tarif genişlemesi (sıra, üst kat, çatı payı, köşe kamaları, projektör, reklam katmanı; "stat kendi arsasına
  büyür"). 16 görüntü verildi. **Kullanıcı hepsini reddetti: "yapmacık, çekiciliği yok".**
- Ardından tek sahne gerçekçi deneme (`gercekci.html`/`gercekci.js`): eğik kamera, MeshStandard malzeme, güneş gölgesi, gökyüzü ortam haritası,
  üretilmiş dokular (çim, beton, taş blok, kaldırım, dalga normal haritası), 6.500 koltuk ve 5.900 kişi örneği, oluklu sac çatı, kafes direkler,
  kayalık kıyı, fener, tekneler; tarayıcıda 2D tuvalde sonrası-işleme (derinlik karartması, bloom, vinyet, retro ızgara). Üç kare verildi
  (gündüz, akşam, 960×720 retro ızgara). Kullanıcı beğenip beğenmediğini söylemedi; tarz tartışmasına geçti.
- Teknik not: yazılım WebGL'de (Playwright/swiftshader) EffectComposer yolunda normal haritalı yüzeyler satır satır çizgileniyor; doğrudan MSAA
  çizim temiz. Sonrası-işleme bu yüzden piksel dizisinde. `lib/` içindeki dosyalar three r128 `examples/js` kopyalarıdır (MIT).
- Sonuç: oyun kodu değişmedi; prototipler dalda referans olarak kalır (`prototipler/stat-konsept/OKU.md`). "Kabul sahnesi üretilmez"
  kuralına kullanıcı isteğiyle istisna: görsel kararlarda kullanıcı PNG istedi, verildi (SendUserFile).

## 2. Görsel yön ve dış varlık (karar açık)

Kullanıcının söyledikleri: kodla üretilen flat 3B görüntüleri sevmedi; gönderdiği taslaklar (piksel sanatı hub, retro terminal arayüzü,
izometrik az poligon oda, önden bakış piksel oda, telefon ve maç sonu kartları) yönünü gösteriyor; **kendisi çizmeyecek, dış destek alınabilir,
parası ödenebilir, başka yapay zekâ modelleriyle çalışılabilir** ("her şey kodla olmasın").

Claude'un değerlendirmesi:
- Taslakların iki katmanı var: arayüz (bitmap font, pencere, tablo, CRT) kodla ve ucuz; resim katmanı (masa üstü hub, piksel stat) dış varlık.
- Taslakların çoğu teknik direktör bakışından (Kadro/Taktik/Antrenman menüleri, karşıda konuşan "Başkan", Hız 72 çubukları); bizden yapı
  alınır, içerik alınmaz; puan çubuğu yasağı kesin.
- En uyumlu tarz: **izometrik az poligon diorama** — sahne kodla kurulur (büyüme, kalabalık, maç koordinatları için şart), eşya ve figür
  dışarıdan (yapay zekâ 3B: Meshy, Tripo, Rodin, Hunyuan3D, Trellis; Mixamo iskelet ve hareket; Synty/Kenney/Quaternius paketleri), üstüne
  isteğe bağlı piksel ızgarası ve sabit palet süzgeci (320×240 ya da 480×360, 32–64 renk). Mevcut motor, oda ve stat işi korunur.
- Piksel sanatı hub için yol: yapay zekâ 2B resim (Midjourney, ChatGPT görsel, Flux/SD, Retro Diffusion, PixelLab); stat tamamen resim olamaz —
  saha ve pullar kodla, çevre ve tribünler kademe başına katman resmi (inpainting).
- Sanatçı: Fiverr/Upwork/ArtStation; brif ve referans tahtasını Claude yazar.
- Oyuna girecek altyapı: `varliklar/` klasörü, GLB ve resim yükleyici, palet ve boyut düzeltme, **lisans defteri**; Steam'in yapay zekâ içerik
  bildirimi. Claude resim üretemez; stil rehberi ve istem paketini yazar, çıkanları eler ve bağlar; API anahtarı varsa üretim betiklenir.
- Teklif: **bir haftalık tek sahne pilotu** (başkan odası üç yolla: yapay zekâ piksel resmi, yapay zekâ 3B eşyalarla diorama, hazır paket),
  oyunun içinde aynı akışla karşılaştırma. İskeleti Claude kurar; kullanıcı araçlarda üretip dosyayı bırakır.

Açık kararlar: tarz (piksel/bitmap mi, diorama mı, melez mi); dış varlık kabulü ve kapsamı (CLAUDE.md ve STIL_REHBERI §3 kuralı); pilot.

## 3. Bilgi mimarisi önerisi (Claude, tartışmada)

**İlke:** bilgi panodan değil kaynağından gelir; her bilginin kaynağı, tarihi ve güvenilirliği vardır (OYUN_TASARIMI §9 üç katman, §7 "görüş
ile olgu ayrılır"). Gösterge paneli ve sürekli yan menü yok; bilgisayar nesnesi yok (telefon zaten akıllı).

| Kanal | Nesne | Ne taşır | Nasıl gelir |
|---|---|---|---|
| Belge | Dosya | Karar bekleyen mesele; raporlar (maç raporu, gözlemci, saymanın aylık özeti, haftalık rapor); kadro kaydı; sözleşme ve teklifler | Birisi yazar, kaynağı ve tarihi var; istenen rapor zaman alır |
| Hafıza | Defter | Takvim, verilen sözler, başkanın notu, geçmiş kararların izi | Oyun yazar, defter yalnız gösterir |
| Kişi | Telefon | Mesajlar; Kişiler ve aramalar (soru sormak, girişim, randevu istemek); Canlı Skor (lig, fikstür, maç istatistiği, kamuya açık oyuncu sayıları, gol krallığı) | Anlık ve kısa; karar tek kart |
| Yüz yüze | Kapı | Ziyaretçi ya da randevu: hoca, sayman, menajer, oyuncu, basın, yönetim üyesi, taraftar temsilcisi | Ajandadan; süre tüketir; konu listesi serbest, karar tek kart |
| Gözlem | Pencere, balkon, stat, maç | Antrenman, statın hâli, taraftar, maçın kendisi | Başkanın gözü, yorumsuz; zaman tüketir |

**İstatistik üç katmanda, puan hiçbirinde:**
- Herkese açık sayılar (lig, fikstür, skor, maç istatistiği ve beklenen gol, oyuncu maç/dakika/gol/asist/kart/sakatlık) → Canlı Skor.
- Kulüp kaydı (kadro listesi: numara, yaş, mevki, sözleşme bitişi, maaş, durum; mali tablo) → Dosya'nın yeni **Kadro** ve **Mali** sekmeleri;
  odadaki Kasa düğmesi saymanın özeti olarak Mali'ye taşınır.
- Görüş (hoca, gözlemci, basın) → kaynaklı ve tarihli cümleler; yanlı olabilir. Oyuncu dosyası sekmeleri: Genel bilgi, İstatistikler, Maç
  raporları, Sakatlık geçmişi, Sözleşme, Teklifler, Notlar — çubuk yok.
- Birine sormak: telefondan kişi ve konu seçmek (menü, karar değil); cevap zaman alır ve kişinin bilgisiyle gelir (§6 kuralı).

**Görevler:** kaynak dört (dosya, telefon, kapı, ajanda) + başkanın girişimi; iş geldiği kanalda tek kartla çözülür ve aynı meselenin geçmişine
yazılır; devretmek üçüncü düğme değil, anlamlı kartta iki cevaptan biri; kalıcı yetki görüşme kartıyla; cevapsız → yazılı sonuç; zorunlu →
İlerle durur. Odanın tek satır özeti "şimdi ne var" göstergesidir; görev listesi paneli yok.

**Haftalık ritim (öneri):** Pazartesi haftalık rapor dosyaya (gözlenebilir şeyler), hafta içi meseleler ve görüşmeler, Cuma gazete masaya ve maç
programı, Cumartesi maç ve okumaları (kart, Canlı Skor, hoca yorumu, defter notu), ay başı saymanın özeti; sezon: transfer dönemi, sezon sonu,
seçim.

**Ekran envanteri:** Oda (Dosya, Defter, Telefon, Pencere/Balkon, **Kapı** yeni, İlerle, Duraklat, Ayarlar; Kasa düğmesi kalkar) · Dosya (Bekleyen,
Raporlar, **Kadro**, **Mali**, Arşiv) · Defter (takvim, sözler, notlar) · Telefon (Mesajlar, **Kişiler**, Canlı Skor genişler) · **Görüşme sahnesi**
(odada ziyaretçi) · Balkon ve antrenman, stat, maç öncesi, maç, maç sonu kartı (+ Özet sekmesi: önemli anlar çizgisi, sakatlık süreleri) ·
Geçişler: İlerle durakları, ay başı özeti, transfer dönemi açılışı, sezon sonu, seçim, kariyer sonu.

**Geçiş kuralı:** hiçbir ekran odadan bir adımdan uzak değil, her yol odaya döner, zaman yalnız odadan (İlerle) ve kontrollü olarak balkon ve
statta akar. Oda → Dosya/Defter/Telefon: üstte açılır, oda kararır, Esc kapatır; Telefon ↔ bağlı dosya aynı konuşmaya döner; Oda → Kapı:
ziyaretçi odaya girer; İlerle → durak: karar (dosya/telefon açılır), randevu (kapı), maç günü (Stada git → program → maç → kart → oda 21:00).

| Konu | Nereden görülür | Nerede karar | Kim yürütür |
|---|---|---|---|
| Maç sonucu | Canlı Skor, maç sonu kartı, hoca yorumu, defter notu | Maç akşamı sabır/değişim dosyası | Hoca |
| Kadro | Dosya/Kadro, hocaya soru, antrenman gözlemi | Hocanın isteği (telefon kartı), gelen teklif (dosya kartı), sezon sonu yenileme | Hoca, sportif direktör |
| Para | Dosya/Mali (saymanın özeti, 90 gün), ay başı özeti | Mali teklif kartları | Sayman |
| Stat ve tesis | Pencere, stat, Dosya/Mali yatırım teklifi | Yatırım kartı | Ekip |
| Basın ve taraftar | Telefon, Cuma gazetesi, kapıda temsilci | Röportaj kartı, süreli karar anı | Başkan |
| Yönetim kurulu | Kapı görüşmesi | Kart; seçim sahnesi | Başkan |

**Taslaklardan alınanlar:** mesajdan randevuya ("yüz yüze görüşelim" girişimi → ajanda → kapı); oyuncu dosyası sekmeleri; önemli anlar
çizgisi ve sakatlık süreleri; maç gecesi odası (akşam ışığı, pencereden ışıklı stat); soyunma odasına inmek (olay kütüphanesine aday: "Soyunma
odasına in / Odana dön", hocanın otoritesine etkisi); tesis haritası (stat çevresiyle aynı sahne, Aşama 8); telefon kişi grupları (kişi sayısı
artınca). **Alınmayanlar:** sürekli yan menü, "Görevler" listesi, çok seçenekli diyalog ağacı, gizli değer grafikleri, hoca araçları.

## 4. Açık kararlar (kullanıcı)

> **2026-10-26:** görsel tarz ve dış varlık (7) görsel tura kadar ertelendi (YOL_HARITASI 49). Kullanıcı istekleriyle kapananlar (karar 50, H2'de uygulanır): 2'nin mali yarısı — Kasa düğmesi kalkar, mali bilgi mali işler müdürünün raporuyla dosyaya gelir (Kadro sekmesi açık); 3 — kişiye (hoca, yardımcı, müdür) soru ve görüşme isteği zaman bedelli girişim. Öbürleri açık.

1. Bilgisayar nesnesi yok (öneri: yok).
2. Kadro ve Mali dosyada; Kasa düğmesi Mali sekmesine taşınır.
3. Kişiye soru sormak serbest ama zaman bedelli girişim (konu seçmek karar değil).
4. Ziyaretçi odaya gelir (ayrı görüşme mekânı yok).
5. Oyuncu satırında yalnız gözlenebilir sayılar; "form" gibi türetilmiş değer yok.
6. Haftalık ritim kabul mü; gazete masaya mı telefona mı; kapı sahnesinde konu listesi serbest mi, yalnız açık meselelerle sınırlı mı.
7. Görsel: tarz (piksel / diorama / melez), dış varlık kabulü ve kapsamı, pilot.

## 5. Sıradaki

- Yeni oturumda konuşma: haftalık ritim → gazetenin yeri → kapı sahnesi → yedi karar.
- Kararlar verilince: OYUN_TASARIMI §2 tablosu ve §13, STIL_REHBERI §3/§5/§7, CLAUDE.md kuralı güncellenir; program sırası (öneri):
  F4 tek kart → Kadro ve Mali sekmeleri → Kişiler ve soru → Kapı ve görüşme → haftalık rapor ve gazete; görsel yön pilotu paralel ayrı tur.
- F5 antrenman, F6-b 2.9 ve 5.1 yeni sezon bu sıranın arkasında (f-program.md).
