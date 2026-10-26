# H2 — Kullanıcı istekleri: az düğme, kişiye yazmak, mali rapor, izlemeden sonuç, Canlı Skor ayrıntısı (uygulama planı)

Durum: planlandı 2026-10-26; eleştiri turundan sonra son hâli (üç bağımsız eleştiri; kabul edilenler metne işlendi, reddedilenler sonda “Eleştiriden reddedilenler”de). Kullanıcı onayı (2026-10-26): “istekler turunu bu varsayımlarla planla ve H1 kapanınca başlat”. Kullanıcının istekleri ve onayladığı varsayımlar YOL_HARITASI karar 50'de. H1 kapandı (`tur/h1-kart`, `main` d31ea81). Uygulama Opus 5.5, çok ajanlı, masaüstü. Dal `claude/h2-istekler`, tabanı `main` (d31ea81 = `tur/h1-kart` + etiket adı commit'i). Etiket `tur/h2-istekler`: `tur/h1` 2026-10-15 motor turunun etiketi olduğu için H serisi ekli etiket kullanır (`h-program.md` durum notu). Program `araclar/plan/h-program.md`; oradaki doğrulama kuralları bu tur için de geçerlidir, sınırlarından üçü karar 50 ile değişti (aşağıda). Görsel iş en sonda (karar 49): bugünkü kâğıt ve telefon dili korunur. Bilgi mimarisinde bu turda kapanan iki açık karar `ui-mimari-ve-gorsel-yon.md` §4'te: mali bilgi dosyada rapor olarak gelir; kişiye soru zaman bedelli bir girişimdir.

| Kullanıcı isteği (2026-10-26) | Alt adım |
|---|---|
| 4. Maç öncesi rakip başkan kartı kalksın | H2-a |
| 5. “Maçı bitir” maçı izletmesin, sonuç gelsin | H2-a (ek olarak TEST “Maçı izleme”) |
| 6. Canlı Skor'da beklenen gol; öbür maçların golleri, kartları ve istatistiği | H2-b |
| 3. Otomatik hoca mesajı kalksın; hoca ve yardımcıya yazılsın, görüşme istensin | H2-c (H1 incelemesinin düşük bulgusu da) |
| 1–2. Kasa düğmesi kalksın; bilgi kaynağından gelsin, az düğme olsun | H2-d (kural yazımı H2-e) |

## h-program sınırlarından bu turda değişenler (karar 50)

- **Sınır 1** (karar 47'nin yedi noktası uygulanmaz): iki nokta kullanıcı kararıyla kapandı ve bu turda uygulanır — mali bilgi dosyada rapor (Kasa düğmesi kalkar; Kadro/Mali sekmesi açılmaz, rapor Arşiv'in yanındaki “Raporlar” sekmesidir) ve kişiye soru (zaman bedelli girişim). Kalan beş nokta (bilgisayar, Kadro sekmesi, kapı/ziyaretçi, oyuncu satırı, haftalık ritim ve gazetenin yeri) yine uygulanmaz.
- **Sınır 2** (yeni kişi yok): iki TEST çalışan istisnadır — yardımcı antrenör ve mali işler müdürü (karar 50). Başka kişi, olay paketi ve gazete haberi eklenmez.
- **Sınır 5** (motor dosyaları): “motor dosyası” TEKNIK_PLAN §8'deki motor dosyalarıdır, `js/mac-*.js`'in tamamı değil. Değişmeyecek dosyalar (her commit öncesi boş fark):
  `git diff --exit-code main -- js/kadrolar.js js/mac-motoru.js js/mac-profil.js js/mac-hareket.js js/mac-mudahale.js js/mac-hava.js js/mac-topla.js js/mac-kaleci.js js/mac-dizilis.js js/mac-takim.js js/mac-tarz.js js/mac-ilkeller.js js/mac-plan.js js/mac-karar.js js/mac-kurallar.js js/mac-durantop.js js/mac-sakatlik.js js/mac-sahne.js js/mac-senaryo.js js/mac-oncesi.js js/mac-izleme.js`
  (liste `index.html`'de `js/mac-motoru.js` ile `js/mac-izleme.js` arasıdır; sıra değişirse liste elle güncellenir). Değişmesine izin verilen sunum ve akış dosyaları: `js/mac-sahnesi.js`, `js/mac-gunu.js`, `js/mac-okuma.js`, `js/mac-sonuc.js` (yalnız gerekirse), `js/mac-arka.js`, `js/lig-maclari.js`, `js/arayuz.js`, `js/ekran-*.js`. `js/mac-isci.js`'in değişmesi beklenmez. KAPILAR'ın “Her motor değişikliği (`js/mac-*.js`)” satırı yine uygulanır (`mac-deneme 4`).

## Çalışma biçimi

- **Oto mod değil.** Kullanıcı “planla ve başlat” dedi, oto mod istemedi (CLAUDE.md “Turlar ve main”). Alt adım commit'leri dalda kalır; dal push'u kullanıcının sözüyle ya da “bugün kapatıyorum”da yapılır. “Makine durumu” satırı ve her adımda push yalnız kullanıcı H2 için oto mod derse uygulanır (o zaman CLAUDE.md'nin kuralı aynen: `main`'e satır, her adımda fetch ve push, uzak dal ilerlemişse durulur).
- **Tek denetim yürütücüsü.** Ajanlar dosya düzenler; denetimleri tek yürütücü sırayla koşar. Tarayıcı denetimleri (`akis-deneme.py`, `kontrol.py`, `akis-2d.py`) birbiriyle ve ağır Node denetimleriyle (`oturum-sonu.js`, `sezon-deneme.js 18 …`) aynı anda koşmaz (akis 20 sabit 8766 portunu kullanır; süre eşikleri yük altında düşer; `son-akis-*.png` ortaktır).
- **Beklenen kırılmalar.** Her alt adımda `kariyer-deneme` ve `akis-deneme` çıktısındaki her `!`/BAŞARISIZ satırı “Kabul”deki o adımın beklenen kırılma listesiyle karşılaştırılır; listede olmayan düşüş düzeltilir ya da “Sapmalar”a gerekçesiyle yazılır.

## Kapsam

Alt adımların sırası: önce düşük riskli akış işi (H2-a), sonra Canlı Skor (H2-b), sonra kişiler ve yazışma (H2-c; kayıt sürümü 10 burada açılır), sonra mali rapor ve Kasa'nın kalkması (H2-d), en son belgeler ve kapanış (H2-e). Her alt adım ayrı bir commit'tir ve kendi denetiminden (“Kabul”) geçmeden commit edilmez. Kayıt işi H2-0'daki sigorta örnekleriyle başlar. Tahmini makine süresi 11–14 saat: H2-0 1; H2-a 2,5; H2-b 2; H2-c 3–4; H2-d 2–3; H2-e 1,5–2.

### H2-0 — dal, sigorta ve tabanlar (ilk commit; oyun kodu değişmez)
- `git fetch --prune --tags`, `main` yalnız ileri sarılır (`git pull --ff-only`), ardından `git checkout -b claude/h2-istekler main`. Belgeler başka oturumda da değişebilir; satır numaraları kayabilir, uygulayıcı işlev adlarıyla çalışır.
- Bu plan dosyası dalın ilk commit'ine girer.
- `araclar/sezon-deneme.js`'e `--kayit-yaz DOSYA@hafta=N|DOSYA@sezonSonu` seçeneği eklenir (H3-0'dan öne alındı). Tek anlam: **`@hafta=N` = N. fikstür haftasının sonuç komutundan sonra** (o Cumartesi 21:00); `@sezonSonu` = bugünkü sezon sonu döngüsünden sonra. Seçenek `kayitMetni(k)` zarfını yazar ve yazdığı anı (`tarih dakika`) ile açık karar türlerini (`veri.karar` taşıyan bekleyen işler) ekrana basar.
- Bugünkü kodla üç sürüm 9 örneği (dosya adları G2'nin `kayit-s8-hafta14.json` kalıbında: “14. haftayı bekleyen kayıt”):
  - `node araclar/sezon-deneme.js 1 7 --tek --kayit-yaz araclar/ornekler/kayit-s9-hafta14.json@hafta=13` → 2026-11-28 21:00, 13. haftanın sekiz sonucu yazılı, ilk ay başı (1 Aralık 10:00) bekliyor.
  - `node araclar/sezon-deneme.js 7 7 --tek --teklif cevapsiz --kayit-yaz araclar/ornekler/kayit-s9-ocak.json@hafta=19` → 2027-01-09 21:00; 7 Ocak gelen teklifin kartı (`teklifKarari`) açık, son cevap 10 Ocak 18:00. Hocanın isteği (5 Ocak 11:00, son cevap 8 Ocak 18:00) bu anda kapanmış olur; bu örnek yalnız teklif içindir (hocanın isteği 4.2'de kariyer-deneme içinde 7 Ocak 12:00'ye ilerletilmiş kariyerle sınanır).
  - `node araclar/sezon-deneme.js 18 7 --tek --kayit-yaz araclar/ornekler/kayit-s9-sezonsonu.json@sezonSonu` → `sezon.sonuc` var, İlerle engeli “Sezon tamamlandı”.
  - Üç dosya için kısa `node -e` denetimi (an, açık karar türleri, `sezon.sonuc`); tutmazsa örnek yeniden üretilir. Kod değiştikten sonra gerekirse örnekler `tur/h1-kart` ayrı ağacından (`git worktree add --detach <depo dışı klasör> tur/h1-kart`) aynı komutla yeniden üretilir.
- **Tabanlar (scratch klasörüne, depoya girmez; ağır işle aynı anda koşmaz):**
  - `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni` `main` üzerinde bir kez; çıkan `!` satırları `h2-oturum-taban.txt`'ye. Sonraki koşular bu dosyayla karşılaştırılır.
  - `node araclar/sezon-deneme.js 18 7 --tek --teklif sat --talep onayla --p12 degisim --json …/h2-sezon-degisim.json`, aynısı `--p12 sabir` ile (`h2-sezon-sabir.json`) ve `node araclar/sezon-deneme.js 3 7 --json …/h2-sezon-3.json`.
- `node araclar/kariyer-deneme.js` çıkış 0 (oyun kodu değişmedi).

### H2-a — maç akışı: rakip başkan kapalı, “Maçı bitir” perdeyle, TEST “Maçı izleme” (istek 4 ve 5)

**Rakip başkan.**
- `js/mac-gunu.js`: kariyer dönüşüne `protokol:{rakipBaskan:'yok'}` eklenir (kullanıcı 2026-10-26, “şimdilik”). `rakipBaskanDurumu` (`js/loca-giris.js`) önce `?rakipBaskan=`'a, sonra `MAC_GUNU.protokol`'e bakıyor; bu içerik kancası bugüne dek boştu. Sonuç: kariyerde karar anı açılmaz, `MAC_PROTOKOL.karar` null kalır, `k.maclar[id].protokol` null olur (biçim bunu kabul ediyor).
- Değişmeyenler: `?rakipBaskan=` TEST parametresi ve kariyersiz `?ekran=mac` yolu (tohumdan “yerinde” ya da “sonra”). `js/karar-ani.js`, `js/ekran-an.js`, `js/loca-giris.js` silinmez; yalnız yorumları güncellenir.

**“Maçı bitir” perdeyle (`js/mac-sahnesi.js`).**
- `HIZLI_BITIR`'e üç alan: `perde:false`, `perdeButce:250` (TEST, ms), `sonuc:null`.
- `hizliBitirIste`: `perde=true` yapar ve ikizi hemen `izlemeKapat(MAC_IZLEME)` ile kapatır (maç öncesinde de: izleme bitti, ikizi adımlamak ana iplikte iki kat iş olur).
- Perde açıkken `santraHizliAdim` ve `hizliBitirAdim`, kip ne olursa olsun `perdeButce` kadar adım atar.
- **Yarış:** perde açıkken `santraHizliAdim` ve `hizliBitirAdim` her karenin başında `arkaIkizHazir()`'e bakar (karar anı, tepe anı ya da loca girişi açık değilse). İkiz hazırsa `hizliBitirHazir`'deki anlık dala geçilir — maç öncesinde de. Anlık dal ikizin sonucunu `HIZLI_BITIR.sonuc`'a JSON kopyası olarak alır; kart (`msAc`), tabela (`tabelaGuncelle`) ve maç telefonu bu kopyadan okur (sonradan `arkaDus` `MAC_ARKA.ikiz`'i null yapsa da). Maç öncesinde anlık bitince `MAC_ARKA.T0` null kalır; öbür maçların okuması son örnekten yapılır.
- **İşçisiz yolda önce bizim maç:** `hizliBitirAdim`'deki `ligCanliAdim(1)` kalkar; kart bizim maç biter bitmez açılır. Öbür maçların sonucu değişmez (her biri yalnız kendi seçeneğine ve tohumuna bağlı, santrayı ilk adımda alıyor; adım sayısı yalnız Canlı Skor'un anını etkiler).
- **Öbür maçları bitiren sürücü genişler:** `ligCanliHizli` koşulu `HIZLI_BITIR.bitti||HIZLI_BITIR.anlik||MAC_SONU.acik||MAC_SONU.bekliyor` olur (kart açıldıysa ya da Odaya dön bekliyorsa; bizim maç hükmense kart hemen açık olduğu için o da kapsanır); `macKare`'nin anlık dalında da çağrılır; bütçe perde ya da `MAC_SONU.bekliyor` iken `perdeButce`, aksi hâlde `butce` (30 ms). Böylece doğal izlenen maçta, hükmen maçta ve işçi düştükten sonra da öbür maçlar kartın arkasında donmadan biter.
- **İşçi düşünce donma yok:** `MAC_ARKA.dusus=()=>ligCanliKur(HIZLI_BITIR.bitti||HIZLI_BITIR.anlik||HIZLI_BITIR.perde||mac.phase==='fulltime'?0:Math.max(0,(mac.kare||0)-MAC_ARKA.T0))` (T0 null ise 0). Bizim maç bittiyse ya da hesaplanıyorsa motorlar sıfır adımla kurulur, kalanı `ligCanliHizli` bütçeyle bitirir. Maç izlenirken işçi düşerse bugünkü kısa yetişme (kilit adım) kalır.
- `js/arayuz.js` `frame()`: `HIZLI_BITIR.perde` iken `kameraUygula`, `okunurlukKare`, `baskanKare` ve iki `render` çağrısı atlanır; son kare donuk kalır. `macKare`, `macSonuKare`, `locaGirisKare` (karar anı ve tepe anı onunla ilerler) ve `hizliBitirGosterge` sürer. `mac.*` çağrısı eklenmez (ad denetimi (c)).
- `js/ekran-mac-sonu.js` (kartın sahibi; değişiklik bloğun içinde, yeni üst düzey ad yok):
  - `#macHesap` örtüsü bugünkü `.ms-kararti` / `.ms-kart` kâğıt dilindedir. Metni “Maç hesaplanıyor…”; işçisiz yolda yanında `mac.minuteLabel()`, duraklatmada “Duraklatıldı”. Görünürlük: `HIZLI_BITIR.perde && !MAC_SONU.acik && !KARAR_ANI.acik && !TEPE_AN.aktif` (karar anı açıksa örtü onun altında kalmaz, gizlenir).
  - “Odaya dön” (`msOdayaDon`) iki kipte de `ligCanliSuruyor()` sürdükçe sayfayı dondurmadan bekler (`S.bekliyor`); durum satırı “Öbür maçlar tamamlanıyor… n/7”. İşçi yolunda zaman aşımı `MAC_SONU.isciBekle` (60000 ms, TEST; bugün 20 sn). Aşılırsa eşzamanlı `ligCanliBitir` yerine `arkaDus('zaman aşımı')` çağrılır, kalanı `ligCanliHizli` bitirir. `ligCanliBitir` yalnız son çaredir (bekleme bittiği hâlde motoru ve sonucu olmayan maç kaldıysa).
- `js/ekran-mac-telefon.js`: `ac()` perde açıkken telefonu açmaz (“kart açıkken telefon açılmaz” kuralının eşi).
- Değişmeyen davranış: duraklatma kare süresini sıfırladığı için hesap da durur; adım hep 1/60 sn, `macaGec` yok, olaylar sunulmaz; sonuç izlenen maçla aynıdır.

**“Maçı izleme” (TEST; yayından önce kalkar).**
- `js/ekran-oda.js`:
  - `isSeridi`: maç günü kaydında “Stada git ▸”in yanına `od-ikinci` sınıflı `<small>TEST</small> Maçı izleme` düğmesi (`data-eylem="yapIzlemesiz"`). Yalnız engel ve kaçırılacak iş onayı yokken görünür; onaylı akış Stada git'te kalır.
  - `yapIzlemesiz` `DURAKLATMADA_KAPALI`'ya eklenir.
  - Akış: `isiYap(id,undefined,{izle:false})` → `oyun.macaGit(macId,{izle:false})` → adres `?ekran=mac&izle=0&mac=<kimlik>`. Kayıt koşulu Stada git'inkiyle aynı; F1-b gereği kaydedilmez.
- `js/mac-gunu.js`: kariyer dönüşüne `izlemesiz: q.get('izle')==='0'` (sabit ve hata yolunda false).
- `js/ekran-mac-sonu.js`'in sonunda başlatma (son yüklenen betik; `btnMacaGec` sarmalayıcısı o anda kurulmuş olur). `MAC_GUNU.izlemesiz && !MAC_GUNU.hata` ise: `#baskanDugmeleri` gizlenir; bizim maç hükmense hiçbir şey yapılmaz (kart ilk karede açılır); değilse `hizliBitirIste()`: perde ilk kareden açık, santra doğal maç öncesiyle gelir, ikiz hazırsa sonuç anında (yarış), değilse ana iplikte.
- Sahne ve stat kurulur ama çizilmez. Gerekçe: `MAC_SECENEK` stat tarifine bağlı; sahnesiz kurulum sonucu değiştirirdi.

**README (bu commit'te, ölçülen değerlerle).** “Açmak” bölümünde http birincil yol olur: GitHub Pages (`main`'in yayını) ya da depo kökünde `python -m http.server` ve `http://127.0.0.1:8000/`. `index.html`'i dosyadan açmak ikinci sıraya iner: “Maçı bitir”in bekleme süresi (ölçülen) ve kaydın adrese bağlı olduğu notu (dosyadan açılan oyunun kaydı http'de görünmez; tarayıcı deposu adres başına ayrıdır).

### H2-b — Canlı Skor ayrıntısı (istek 6)

**Ortak saf okuma (`js/mac-okuma.js`).**
- `macIstSatirlari(ist,xg)` 10 satır döndürür; gövdesi bugünkü `macOkumaSatirlari`'dır (o ince sarmalayıcı olarak kalır ya da tek kullanıcısıyla birlikte kalkar).
- `macAyrintisi(s,adBul)` → `{hukmen, skor, goller:[{t,dk,ad,kk}], kartlar:[{t,dk,ad,renk}], sakat:[{t,dk,ad,derece,gun}], satirlar}`:
  - `s` iki biçimden biri: motorun `sonucKaydi()` biçimi (`ad`, `dakika`, `kendiKalesine`) ya da `k.maclar` biçimi (`id`, `dk`, `kk`).
  - Oyuncu adı önce `g.ad`'dan, yoksa `adBul(id)`'den; ikisi de yoksa '—'.
  - xG: `Array.isArray(s.sutlar)` ise `macBeklenenGol(s.sutlar)`, değilse `s.xg`.
  - Hükmende listeler ve tablo boş, yalnız tek not.
  - Kendi kalesine gol, golü kazanan takımın sütununda “ad (k.k.)”. İkinci sarı maç sonu kartındaki gibi; ağrı yazılmaz.

**İşçi örneği (`js/lig-maclari.js`).**
- `macOrnek` tek bir `sonucKaydi()` çağrısıyla genişler: `{kare, skor, dk, faz, n:[goller, kartlar, sutlar, sakatliklar uzunlukları], ist}`.
- Yeni saf `arkaMacAnlik(son,o)`: işçinin bitmiş kaydının o örneğe kadarki önekini (`slice(0,n[i])`) ve `o.ist`'i verir.
- Dakikayla süzülmez: ilk yarı uzatmasındaki gol ile ikinci yarının başı aynı 46. dakikayı taşır. Motorun kayıt listeleri yalnız eklenir; varsayım 3.8b'de kilitlenir.
- `x.son` değişmez; örnekler yalnız bellekte durur. `macBeklenenGol` işçide yüklü olmadığı için xG ana iplikte önekten hesaplanır.

**Maç telefonu (`js/ekran-mac-telefon.js`).**
- `macVerisi` sayıları tek kaynaktan okur (tabelanın kalıbı): `S = MAC_GUNU.hukmen ? hukmenSonucu(…) : HIZLI_BITIR.anlik ? HIZLI_BITIR.sonuc : mac.sonucKaydi()`.
- Bizim maçın ayrıntısı öbür maçlarla aynı görünümdür: `telMacAyrinti(macAyrintisi(S,…))` — goller, kartlar, sakatlıklar ve `macIstSatirlari(S.ist, macBeklenenGol(S.sutlar))` tablosu. Beklenen gol maç sırasında canlı; isabetli şut `isabetEk`'li (maç sonu kaydıyla aynı); santradan önce topa sahip olma '—'.
- `digerVerisi` her satıra `macId` ekler. Ayrıntı yalnız açık satır için hesaplanır: hükmen maçta `x.son`; kilit adım yolunda `x.m.sonucKaydi()`; işçi yolunda `arkaMacAnlik(x.son, arkaMacDurum(x.ornekler, mac.kare−MAC_ARKA.T0))`; anlık bittiyse ya da `T0` null ise son örnek. Bizim santramızdan önce öbür maçların satırları dokunulmaz.

**Telefon görünümü (`js/ekran-telefon.js`).**
- Öbür maçların satırları dokunulur olur: `data-eylem="skorAc" data-mac aria-expanded`.
- Ortak ayrıntı görünümü `telMacAyrinti(A, evKisa, depKisa)`: Goller, Kartlar ve Sakatlıklar iki sütunda (ev solda); her satırda dakika, ad ve kart rengi kutucuğu; olay yoksa tek soluk satır (“Gol yok.”); altında bugünkü `.tel-ist` tablosu. Uzun satırlar kesilir (ellipsis, `min-width:0`); yatay taşma yok.
- N2 korunur: her karşılaşma tek satırdır, beklenen gol ayrıntıdadır.
- Odada “Son maç” ve “N. haftanın öbür sonuçları” satırlarının hepsi dokunulur; ayrıntı `macAyrintisi(k.maclar[id], id=>(k.oyuncular[id]||{}).ad)`'dan. Bizim satır da bu yoldan geçer: `macOkumasi` bağımlılığı ve ters dönüşüm kalkar; tablo bugünkü 10 satırla aynıdır. Onaylı varsayımın “odada geçmiş haftalar için kayıttan” ifadesi bu turda şöyle yorumlanır: odada oynanmış son haftanın bütün maçları kayıttan; daha eski haftalar arasında gezinti yok (kullanıcıya soru 3).

**Diğer.**
- `js/ekran-oda.js` ve `js/ekran-mac-telefon.js`: `T.skorAc` boolean'dan maç kimliğine ya da null'a döner. Bizim maç `MAC_GUNU.macId`, kariyersiz sayfada `'biz'`. Odak seçicisi `[data-eylem="skorAc"][data-mac="…"]`.
- Kart rengi sabitleri `js/ekran-mac-sonu.js`'ten `STIL.kagit.kartRenk`'e (`js/stil-99.js`) taşınır; maç sonu kartı ve telefon ortak kullanır. Yeni renk yok.
- Kayıt biçimi değişmez. Kısa kayıtta kimlikli goller, kartlar, sakatlıklar, `ist` ve `xg` zaten var; adlar `k.oyuncular`'dan çözülür (karar 38).

### H2-c — kişiler, kişiye yazmak ve görüşme isteği; kayıt sürümü 10 (istek 3 ve H1 bulgusu)

**Kişiler (`js/yazisma.js`, yeni dosya).**
- Yükleme sırası: `index.html`'de `js/icerik-p12.js`'ten sonra, `js/test-gorunum.js`'ten önce. Elle güncellenen tek liste `araclar/kariyer-deneme.js`'in `OYUN_DOSYALARI`'dır; `sezon-deneme`, `mac-deneme`, `hiz-olcum` ve `oyuncu-karnesi` `araclar/motor-yukle.js` ile `js/goruntu.js`'ten önceki bütün mantık dosyalarını kendiliğinden yükler. Bu yüzden dosyanın üst düzeyi DOM'suzdur (yalnız tanım ve kayıt defterine ekleme). İşçinin dosya listesi (`arkaDosyalari`) değişmez. `hiz-olcum --kok` karşılaştırmasında farklı dosya kümesi beklenen bir durumdur.
- `PERSONEL_TEST={yardimciAntrenor:{ad,dogumTarihi}, maliMudur:{ad,dogumTarihi}}`: iki TEST çalışan. Adlar `js/adlar-test.js` havuzundan elle seçilmiş sabit TEST değeri (karar 33 kipi); kullanıcı değiştirir. Mali müdürün kişisi burada kurulur, işi H2-d'dedir.
- `personelKur(k)`: idempotent, rastlantı çekmez. Başkan görevdeyse ve başkanın kulübünde o rolde aktif kişi yoksa `kimlikUret(k,'kisi')` ile `{id, ad, rol, dogumTarihi, kulupId, durum:'aktif'}` kurar. Yönetim koltuğu değildir; sözleşmesi ve maaşı yoktur (TEST; `sozlesmeleriTamamla` yalnız oyuncu ve teknik direktöre dokunur, nakit ufku değişmez). `kariyerBaslat`'ta `hocalariKur`'dan hemen sonra; yeni kariyerde kimlikler `kisi-18` ve `kisi-19`.
- `personelKisisi(k,rol)`: `teknikDirektor` için `kulupHocasi(k,biz)`; öbür roller için başkanın kulübünün o roldeki aktif kişisi; yoksa null. `kisiAktif(k,id)`: `!!(k.kisiler[id]&&k.kisiler[id].durum==='aktif')`.
- Rol adları: `MESAJ_ROL` (`js/mesajlar.js`) `yardimciAntrenor:'Yardımcı antrenör'`, `maliMudur:'Mali işler müdürü'`; `js/ekran-oda.js` `ROL` sözlüğüne aynı iki rol küçük harfle.
- `yazismaDogrula` (`EK_DENETIMLER`): kulüp başına her personel rolünde en çok bir aktif kişi; kişide `okunan` alanı varsa tamsayı ve `simdikiAn(k)`'dan büyük değil.

**Konular.** Konu seçmek karar değil, menüdür (OYUN_TASARIMI §2: “Menüde kişi/gün seçmek … karar sayılmaz”).
- `YAZISMA_KONULARI[konu]={ad, roller, aralik, uygun?, goruntu?(k,veri)→p, metin:{[rol]:(k,y)→metin}}`.
- `yazismaKonusuEkle(konu,tanim)` konuyu kaydeder ve her rol için `GIRISIMLER['yaz.<rol>.<konu>']` kurar: `{ad, aciklama, kisi, aralik, uygun, baslat}`.
- Bu adımın konuları (metinler TEST): `mac` “Maçı nasıl gördün?” (hoca ve yardımcı; aralık 0 gün); `takim` “Takım ne durumda?” (hoca ve yardımcı; aralık 1 gün = günde bir); `gorusme` “Görüşelim” (hoca ve yardımcı; aralık 0 gün). `kasa` “Kasa ne durumda?” konusunu H2-d `js/mali-rapor.js` kaydeder (yalnız müdür).
- `uygun` dönüşleri:
  - **false** (listede yok): kişi yoksa; `mac` konusunda başkanın kulübünün oynanmış son maçı yoksa, hoca o maçı yönetmediyse (`maclar[id].hocalar`) ya da bu kişiye bu maç zaten sorulduysa.
  - **engel metni**: o kişiden bekleyen cevap ya da bekleyen görüşme önerisi varsa bütün konular kapalı (“Önceki mesajının cevabını bekliyorsun.”); gelecekte o kişiyle görüşme randevusu varsa yalnız `gorusme` kapalı (“Görüşme ayarlandı: <gün saat>.”).
  - Öbür durumlarda **true**.
- `js/yonetim.js`'te iki küçük genelleme: `girisimYapildi` girişimin kendi `aralik`'ını kullanır, yoksa `GIRISIM_ARALIGI` (7; bugün tanımlı girişim yok, davranış değişmez). `girisimBaslat`, `baslat`'ın `{bilgi, kayit}` dönüşündeki `kayit`'i (`{kisiId, konu, isId, macId?}`) geçmişteki `{tur:'girisim', id, tarih, dakika}` kaydına ekler ve yine `bilgi` metnini döndürür; düz metin dönüşü eskisi gibi çalışır.
- Gösterim hazır yollardan: kişinin konuşmasında `.tel-oneri` (`js/mesajlar.js` girişim dalı, `js/ekran-telefon.js`, `js/ekran-oda.js` `girisim` eylemi); Duraklat'ta kapalı, maç telefonunda gizli.
- Bu üç kişi girişimleri olduğu için Mesajlar listesinde her zaman durur. N14'ün “konuşma yoksa liste boş” kuralı böylece değişir; belgeye yazılır.
- Gönderince konuşma alta kayar (`telAlta`); şeritte “Mesaj gitti: <ad>. Cevap birkaç saat içinde gelir.” (ek almayan kalıp; Türkçe yönelme eki addan seçilmez). Soru başkanın zamanını harcamaz (0 dk); bedeli cevabı beklemektir.

**Cevap: gizli gelişme.**
- `yazismaSor(k,rol,konu)`: `isEkle(k,{tur:'gelisme', tarih/dakika: yazismaCevapAni(k,rol), veri:{gelisme:'yazismaCevap', muhatap, konu, soru:{tarih,dakika}, macId?, deneme?, durak:true}})`; `{bilgi, kayit}` döndürür.
- `yazismaCevapAni`: şimdi + `YAZISMA_TEST.gecikme[rol]` (TEST dakika: hoca 180, yardımcı 120, müdür 90). Sonuç 09:00–18:30 dışına düşerse sonraki 09:30'a kayar (`YAZISMA_TEST.mesai`). Böylece cevap maç akşamına (19:00–21:00) düşmez. Belirlenimcidir, rastlantı çekmez.
- `GELISMELER.yazismaCevap`:
  - `denetle`: kişi, konu, soru anı ve `macId`'nin fikstürde olması.
  - `uygula`: kişi aktif değilse `{yazisma:{…, cevapYok:'ayrildi'}}`; değilse `{yazisma:{kisiId, konu, soru, macId?, p?, oneri?}}`.
  - `bilgi` yok (defterde satır kalmaz); `dur` ve `haber` de yok. `mac`, `takim` ve `kasa` cevabı katılımı ve antrenman gözlemini kesmez; yalnız telefon yanar. `gorusme` cevabı yeni bir ajanda kararı doğurduğu için `durakSorgusu` onda durur (katılıma giden yol, gözlem ve maç günü yürüyüşü “karar” nedeniyle kesilir) — bilinçli fark.
  - Anlık durum gerektiren konularda kayda sayı ve kimlik görüntüsü (`p`) girer, metin girmez: `takim`: `{sira, puan, son5, sakat:[{id,donus}], cezali:[{id,mac}], sonrakiMacId}`; `kasa`: H2-d'nin `maliOzet`'i; `mac`: yalnız `macId` (metin maç kaydından okunur).
- `js/ajanda.js` `ilerleOnizle`: “haber” durağı genelleşir — `x.tur==='ekip'&&x.veri.durak` yerine `x.veri&&x.veri.durak`; İlerle cevap anında durur. Dönüşe beklenen iş ayrı bir alanda eklenir (`haberIsi`; `durak` null kalır ki bugünkü davranış bozulmasın). Bugün `veri.durak` yalnız tavsiyenin ekip işinde var; o davranış korunur.

**Cevap metinleri** (`metin`; TEST, kullanıcı değiştirir; okuma anında şablondan):
- Hoca, `mac`: `macYorumu(k,macId).metin` (F3 şablonu; ısrarcı hoca kendi lehine çevirir; rakam yok).
- Yardımcı, `mac`: rakamla — şut a–b, isabetli c–d, beklenen gol x – y, topa sahip olma %z, öne çıkan oyuncunun şutu, beklenen golü ve golü. Kaynak `macOkumasi`; `oneCikan`'a yalnız okuma için `sut` ve `xg` alanları eklenir.
- Hoca, `takim`: sözlü ve rakamsız (form, sakatların adları, sıradaki rakip).
- Yardımcı, `takim`: rakamlı (sıra, puan, son 5 maç, sakatların dönüş tarihi, cezalı maç sayısı).
- `cevapYok` ve iptal: not satırı “Cevap gelmedi.”
- Gizli bilgi, ısrar ve oyuncu özellikleri hiçbir metinde sayı olarak geçmez.

**Konuşmada gösterim** (`js/mesajlar.js`, `MESAJ_KAYNAKLARI`).
- Kaynak öğesi yönünü kendisi taşır: `x.yon||'gelen'`.
- `js/yazisma.js` kaynağı: geçmişte `kisiId` taşıyan girişim kaydı → giden mesaj (konunun soru cümlesi); `sonuc.yazisma` taşıyan tamamlanmış gelişme → gelen mesaj, yeni sayılması `an > kisi.okunan` ile; `cevapYok` ya da iptal edilmiş soru (girişim kaydının `isId`'si geçmişte `iptal`) → not “Cevap gelmedi.” Geçmiş tek geçişte taranır (gözlem her oyun dakikasında `haberSayisi`'nı çağırıyor).
- Okundu bilgisi `kisi.okunan`: kişinin konuşmasının en son açıldığı an (`anDakika`). Komut `yazismaGoruldu(k,kisiId)`. `js/ekran-oda.js` `konusmaAc`, `macOkunduIsaretle` yerine yazışma kaynağında okunmamış varsa bunu çağırır.

**Görüşme isteği.**
- `gorusme` konusunun cevabı bir saat önerisidir. `gorusmeAniBul(k,kisiId,enErkenGun)`: cevap gününün ertesinden başlar, başkanın kulübünün maç gününü atlar; 11:00'ü, o saat doluysa 15:00'ü seçer (bekleyen saatli ajanda işiyle 45 dakikalık çakışmaya bakar); ikisi de doluysa sonraki güne geçer; en çok 14 gün (TEST). Belirlenimcidir. **Yer bulunamazsa** cevap “Uygun olduğunuzda yazın başkanım.” olur ve kart kurulmaz.
- Öneri, mesele açmayan bir ajanda kararıdır: `{zorunluluk:'zorunlu', saatsiz:true, bekleyebilir:true, gelis:şimdi, tarih/dakika = öneri − 60 dk (son cevap), karar:'gorusmeOnerisi', soran:kisiId, muhatap:kisiId, kisiId, oneri:{tarih,dakika}, deneme, baslik:'Görüşme: <ad>', aciklama:'<gün> <saat> öneriyor (45 dk).', sure:0}`. Yeni ajanda işi doğduğu için `durakSorgusu` İlerle'yi durdurur; oda özeti “Telefon: karar gerektiren bir haber geldi.” der.
- `KARAR_TURLERI.gorusmeOnerisi` iki cevaplıdır ve tek kartta verilir (H1):
  - **Kabul et** (0 dk). Engeli: öneri saatinde artık başka saatli iş varsa. Sonucu isteğe bağlı randevu: `{tarih/dakika: oneri, baslik:'Görüşme: <ad>', aciklama:'45 dk görüşme (TEST)', zorunluluk:'istege', sure:45, kisiId, muhatap, etki:'ekipGorusmesi'}` (`IS_TURLERI.ajanda.denetle` açıklamayı metin olarak ister); defterde görünür.
  - **Başka gün iste** (0 dk). Yeni `yazismaCevap`: `konu:'gorusme'`, `deneme+1`, en erken gün önerilen günün ertesi. Üçüncü retten sonra cevap “Uygun olduğunuzda yazın başkanım.” ve kart kurulmaz (`YAZISMA_TEST.gorusme.enCokOneri` 3).
  - `zamanAsimi`: “Cevap vermezsen görüşme olmaz.” / “Görüşme ayarlanmadı.”
- `KATILIM_ETKILERI.ekipGorusmesi`: katılınca kısa TEST özeti `bilgi` olarak döner (kişinin `takim` görüntüsü ve “ayrıntılı görüşme sahnesi sonra gelir”); defterde “Öğrendiklerin”de. Görüşme sahnesi (kapı) bu turda yok (karar 47).
- `js/mesajlar.js` iki ekleme: mesele açmayan ama `soran` taşıyan bekleyen ajanda kararı soranın konuşmasında `kararlar`'a girer (yalnız soran aktifse; `cevapBekliyor`); böyle bir kararın sonucu giden mesaj ya da “Cevap vermedin.” olarak yazılır (`meseleId:null`, sıra `anDakika`; `ekle` null mesele itmez).
- Kart telefonun cevap alanındadır (H1 `kararKarti`). Odada alt şeritte “Karar ver ▸” karar panelini açar (mevcut yol). Uygulama tek komuttur: `ajandaIsiYap`.

**Hoca değişince ve H1 bulgusu.**
- `js/hoca.js` `hocaDegistir`'in iptal süzgeci genişler: `x.veri.hocaSuresi===eski.id || x.veri.muhatap===eski.id || x.veri.soran===eski.id`.
  - Eski hocaya bekleyen soru, görüşme önerisi ve görüşme randevusu iptal edilir (`isIptal`, neden “<ad> görevden ayrıldı”). Sorulan mesaj geçmişte kalır; konuşmada “Cevap gelmedi.”
  - **Soranı ayrılan hoca olan bekleyen karar düşer** — bugün yalnız hocanın transfer isteği (`transferButcesi`, `soran:b.hocaId`). OYUN_TASARIMI §2: “Şartları değişmiş veya geçersiz bir karar … güncel koşula uygun karar ya da bilgi durumuna geçirilir”; isteğin dayanağı ayrılan hocanın tercihiydi. Konusu varsa `meseleOlay(k,meseleId,'kisiAyrildi',{kisiId,baslik})` (yeni genel olay anahtarı `js/mesele.js`'te, TEST metni “<ad> görevden ayrıldı; “<başlık>” düştü.”), ardından mevcut `sozDegerlendir`/`meseleDegerlendir`/`olayDurumGuncelle` çağrısı (konu kapanır). Onaylanmış istekten doğan bekleyen imza (`transferImza`) G2 kuralıyla sürer (kulüp bütçe kararını uygular, teşekkürü görevdeki hoca eder).
  - Yardımcı kulübe bağlıdır ve kalır (TEST). Yeni hoca `kulupHocasi` üzerinden konulara kendiliğinden girer.
- Soransız gelen teklif (`teklifKarari`) kulübün kararıdır, dosyada sürer; H1 bulgusu gösterimde düzeltilir (`js/mesajlar.js`): karar soranın konuşmasına yalnız soran aktifse girer; “karar dosyada” bağlantısı yalnız konunun ana konuşması aktifse görünür; `kararTelefondaMi` aynı kuralı izler. Ayrılan hocanın konuşmasında açık teklifin bağlantısı görünmez; eski mesajlar eski konuşmada kalır.

**Otomatik hoca yorumu kalkar** (`js/mac-okuma.js`).
- Silinenler: `MESAJ_KAYNAKLARI.push`, `macOkunduIsaretle`, `macOkumaDogrula` ve `EK_DENETIMLER` kaydı, `MAC_OKUNDU_EN_COK`, başlık yorumu.
- Kalanlar: `macOkumasi`, `macYorumu`, `macGozlemNotu`, `YORUM_METIN` (defter notu, Canlı Skor ve sorulunca gelen cevap bunları kullanır). P12'nin kötü gidiş mesajları (`p12.hoca`) değişmez.

**Kayıt ve ekran.**
- Kayıt sürümü 10 bu adımda açılır (“Kayıt sürümü”): `js/kariyer.js` `KARIYER_SURUM=10`; `js/kayit.js` `KAYIT_GECISLERI[9]`; `js/baslangic.js` ve `js/kariyer-ornek.js`'te `macOkundu` kalkar, `kayitSurumu:10`.
- `js/ekran-oda.js`: `ilerleOzeti` biten kayıtlar içinde `sonuc.yazisma` taşıyanı arar (son kayda bakmaz) → “Cevap geldi; telefonda.” (bugünkü “Beklediğin görüş geldi; dosyada.” tavsiye için kalır); durak yazısı `haberIsi`'ne göre “beklediğin cevap gelecek” / “beklediğin görüş gelecek”. Gözlem metni değişmez (yazışma cevabı gözlemi durdurmaz; görüşme önerisi “karar” olarak durdurur ve `kararYeri` telefonu söyler).

### H2-d — mali işler müdürünün raporu ve Kasa düğmesinin kalkması (istek 1 ve 2)

**Rapor kuralları (`js/mali-rapor.js`, yeni dosya; `js/yazisma.js`'ten sonra yüklenir; üst düzeyi DOM'suz).**
- `nakitUfku(k,kulupId,gun,haricIsId)` (`js/kulup-mali.js`): isteğe bağlı dördüncü parametre, ay başı zincirinin başını seçerken o işi dışarıda bırakır. Gerekçe: takvim işi `uygula` döndükten sonra siler (`zamanIlerletAna` → `isTamamla(k,id,uygula(k,is))`); ay başının içinde hesaplanan ufuk o anda işlenen ay başını yeniden sayar (bu ayın maaşı ve lig payı hareketlere yazılmışken bir kez daha).
- `maliOzet(k,kulupId,haricIsId)`: saf, rastlantı çekmez. `{nakit, bekleyenGelir, bekleyenGider, maasYuku, enDusuk, enDusukTarih, son90, belirsiz}`; kaynakları `maliDurum`, `nakitUfku(k,id,90,haricIsId)`, `aylikMaas(k,id,true)`. Bugünkü kasa panelinin bütün sayıları bunlardır.
- `maliRaporBirak(k,kulupId,tur,haricIsId)` (komut içinde): müdür yoksa ya da başkan görevde değilse null; yoksa `haberEkle(k,{tur:'rapor', anahtar:'mali.'+tur, p:{kaynak:mudurId, kulupId, ...maliOzet}})`. `aylik`'ta `p`'ye ayrıca `odemeler` girer (ilk 8 bekleyen ödeme, `{tarih, tutar, kalem}`). Kayda yalnız sayılar ve tarih girer; metin ve hareket listesi saklanmaz.
- `maliRaporKur(k,kulupId)`: bugünden sonraki ilk Pazartesi (`Date.UTC` ile saf), 09:00 (`MALI_RAPOR_TEST.saat` 540). O Pazartesi ayın 1'iyse bir hafta sonrası (o gün aylık rapor gelir; sezonda 1 Şubat ve 1 Mart 2027). Sezon sonu kaydı varsa iş kurulmaz.
- `IS_TURLERI.maliRapor`: görünür rutin iş; `pay` yok, başlığı “Haftalık mali özet”. İlerle'yi durdurmaz (OYUN_TASARIMI §6). `uygula`: `maliRaporBirak(…,'haftalik')`, ardından `maliRaporKur`; her durumda metin döner (“Mali işler müdürü haftalık özeti dosyaya bıraktı.” ya da “Haftalık özet gelmedi.”).
- Ay başı: `js/kulup-mali.js`'e `AY_BASI_EKLERI=[]`; `ayBasi.uygula` bu listeyi sonraki ayın işi kurulduktan sonra, dönüşten hemen önce `(k,is)` ile çağırır ve dönen metni kendi metnine ekler. `mali-rapor.js` listeye `maliRaporBirak(k,is.veri.kulupId,'aylik',is.id)`'yi ekler (“aylık rapor dosyada”). Yeni iş türü yok; zincir ay başıyla aynı kuralla durur.
- **Eksi kasa uyarısı** (G2 kararı 44'ün “eksi kasa işaretlenir” güvencesi; Kasa düğmesinin kırmızı rozeti kalktığı için): `IS_SONRASI` dinleyicisi — başkanın kulübünün nakdi 0'ın altındaysa ve son mali raporun `p.nakit`'i 0 ya da üstündeyse (rapor yoksa da) `maliRaporBirak(k,biz,'uyari')`. Durumsuz kural: aynı eksi dönemde ikinci uyarı yazılmaz; kasa toparlanıp yeni rapor yazıldıktan sonra yeniden düşerse yine yazılır. Kriz içeriği değildir (P01 kullanıcının).
- Yeni kariyer: `kariyerBaslat` (`js/baslangic.js`) `BASLANGIC_EKLERI`'nden sonra ilk haftalık özeti açılış anında bırakır (23 Kasım Pazartesi 08:00) ve zinciri kurar; sıradaki rapor 30 Kasım 09:00.
- `MESELE_OLAYLARI['mali.haftalik'|'mali.aylik'|'mali.uyari']`: `haberMetni` ve doğrulama için tek satırlık TEST metin, ör. “Kasada X; 90 gün içinde en düşük Y (tarih).”
- Okuma (dosya ekranı kural içermez):
  - `maliRaporlari(k)` → `[{i,h}]`, yeniden eskiye.
  - `maliRaporOkumasi(k,h)` → `{baslik, kaynakAd, tarih, dakika, satirlar, hareketler, uyari}`.
  - **Haftalık rapor kısadır, hareket listesi yoktur:** kasa, 90 gün içindeki en düşük bakiye ve tarihi, 90 gün sonrası, belirsiz gelir.
  - **Aylık rapor ayrıntılıdır:** bunlara ek olarak maaş yükü, bekleyen gelir ve gider, ödeme takvimi ve hareketler — `k.hareketler`'den türetilir (liste yalnız eklenir), önceki ayın 1'i 10:00'dan raporun anına (o ayın maaşı ve lig payı dahil).
  - Uyarı raporu: kasa ve tarih (“Kasa eksiye düştü.”).
  - `enDusuk<0` ise uyarı satırı: “Kasa <tarih> eksiye düşüyor.”
- `raporGoruldu(k,i)` yalnız o raporu görüldü işaretler.
- Telefon: `yazismaKonusuEkle('kasa',…)` müdüre “Kasa ne durumda?” konusunu ekler (aralık 1 gün). Cevabın `p`'si cevap anındaki `maliOzet`'tir. Metni `kasaCevapMetni` (TEST): “Kasada X. 90 gün içinde en düşük Y (tarih). Aylık maaş yükü Z. Ayrıntısı Pazartesi özetinde.” Dosyaya ayrı rapor bırakmaz. Müdürle görüşme konusu yok.

**Gazete ve haberlerle ayrım (`js/soz.js`).**
- `HABER_TURLERI.rapor='Rapor'`.
- `odaIzleri().yeniHaber` raporu saymaz; `haberlerGoruldu` raporu işaretlemez. Gazetenin ışığı ve “Masada gazete var” raporla yanmaz.

**Oda (`js/ekran-oda.js`).**
- Kalkanlar: `NESNE.kasa`, Kasa düğmesi ve eksi rozeti, `kasa` paneli ve başlığı, `Digit6`, `kasaPaneli`, `telefonCiz`'e giden `kasa:`/`saymanVar`. `kasaPaneli`'nin gövdesi `js/ekran-dosya.js`'e rapor görünümü olarak taşınır. `kulupDurumu`'nun kullanıcısı kalmazsa o da silinir.
- Gazete paneli rapor türünü listelemez.
- Dosya masada açık konu ya da rapor varken durur (3B nesne `odaDurum` ile, düğme, `panelAc` koruması); yeni kariyerde ilk andan.
- Dosya düğmesinin rozeti önce “karar”, karar yoksa görülmemiş raporda “yeni”.
- Dosya masadan açılınca öncelik: cevap bekleyen konu > görülmemiş rapor > açık konu > seçili ya da son konu (kapanmış dahil; bugünkü “Kapandı” davranışı) > en son rapor.
- Yeni eylemler `raporlar` ve `raporAc`. `raporAc` `raporGoruldu`'yu çalıştırır; zaman ilerlemez, Duraklat'ta da açıktır. `dosyaRapor`/`seciliRapor` durumları `dosyaArsiv` ile birbirini dışlar.
- `ilerleOzeti`: `maliRapor` ve `ayBasi` metinlerini şeride yazar; görülmemiş rapor varsa “Dosyada yeni rapor var.” ekler.
- Odada kalanlar: telefon, ajanda (defter), dosya, gazete (yalnız haber varken, bugünkü gibi), balkon kapısı; şeritte İlerle, Duraklat ve Ayarlar. Geliştiricinin Kadro (TEST) paneli Ayarlar'da kalır.

**Dosya (`js/ekran-dosya.js`).**
- Arşiv'in yanına `button.dsy-sekme.dsy-raporSekme` “Raporlar (n)”; görülmemiş raporda ayrı işaret sınıfı `dsy-yeniRapor` (görünüşü `.dsy-nokta` ile aynı CSS kuralından; konu sekmelerinin `dsy-nokta` seçicileri raporla karışmaz).
- Sol sayfa: tarih, başlık ve yeni işaretiyle liste (`data-eylem="raporAc" data-rapor=i`). Sağ sayfa: seçili rapor; biçim bugünkü kasa panelinin `dl`/`ul` düzeni, `STIL.kagit` renkleri; eksi tutar kırmızı. Yeni görsel dil yok.
- Mali kategorili konudaki “Para durumu: Kasa ▸” bağlantısı “Son mali özet ▸” olur (`data-eylem="raporlar"`).
- Koruma: `typeof maliRaporOkumasi==='function'` (`prototipler/7-dosya-defter.html` bu dosyayı yüklemez).

**Telefon (`js/ekran-telefon.js`).** Saymanın konuşmasındaki “Kasaya bak ▸” kalkar; yerine bağlantı konmaz. Sayman koltuğu içerik için kalır.

**Kayıt geçişine ek (`js/kayit.js` `KAYIT_GECISLERI[9]`).** Başkan görevdeyse ve sezon sonu kaydı yoksa kaydın anına `{tur:'maliRapor', veri:{kulupId}}` işi konur (G2 incelemesine göre kaydın anındaki iş geçerlidir); ilk ilerlemede ilk rapor gelir ve zincir başlar. Geçmiş haftalar için rapor uydurulmaz.

**`araclar/sezon-deneme.js`'e rapor sayacı** (bu adımın kapsamı): haftalık, aylık ve uyarı rapor sayısı ve son raporun tarihi; tabloya ve `--json`'a.

### H2-e — belgeler, KAPILAR, inceleme ve kapanış
- Belgeler aşağıdaki “Belgeler” bölümüne göre güncellenir. KAPILAR satırları ilgili alt adımın commit'inde eklenir; burada yalnız gözden geçirilir.
- İnceleme H1 kalıbıyla: iki bağımsız inceleme (biri kural, veri ve kayıt; öbürü ekran, akış ve erişilebilirlik), her bulgu için bir doğrulayıcı. Her düzeltmeye `kariyer-deneme` ya da `akis-deneme` denetimi eklenir; sonuç “Sapmalar”a.
- Kapanış: “Kabul” bölümündeki kapanış denetimleri; `git tag -a tur/h2-istekler` dal üzerinde (yerel). `main`'e alma, etiketin ve `main`'in push'u kullanıcının sözüyle (CLAUDE.md “Turlar ve main”; H1'in oto mod izni bu tura uzanmaz); birleşen dal silinir. Oto mod verildiyse “Makine durumu” satırı H0 kalıbıyla `main`'e yalnız devam notunu değiştiren bir belge commit'iyle “boşta (masaüstü, tarih); dal claude/h2-istekler kapanış denetimlerini geçti, main'e alma kullanıcıda” olur (fetch, ileri sarma, push).

## Yapılmayacaklar

- Yeni görsel dil, renk, yazı tipi ya da dış varlık (karar 46 ve 49). Yalnız kart rengi sabitleri `STIL`'e taşınır.
- Bilgi mimarisinin açık kalan kararları (karar 47, `ui-mimari` §4): Kadro sekmesi, oyuncu dosyası, kapı ve ziyaretçi sahnesi, görüşmenin içerikli sahnesi, haftalık ritim (Cuma gazetesi vb.), gazetenin yeri, bilgisayar nesnesi, telefonda Kişiler uygulaması.
- Günlük rapor (kullanıcıya soru), saymanın değerlendirmesi (4.1), sponsor ve yatırım raporu; mali TEST tutarlarının dengelenmesi; eksi kasa kriz içeriği (P01, kullanıcının).
- Yardımcının ve müdürün sözleşmesi, maaşı, işten ayrılması ve ilişki puanı; öbür kulüplerin personeli; serbest metinli mesaj (yalnız hazır konular); müdürle görüşme; konu menüsünün karar kartına çevrilmesi.
- Canlı Skor'da geçmiş haftalar arasında gezinti (onaylı varsayımın bu turdaki yorumu: odada son hafta; daha eskisi kullanıcıya soru 3), gol bildirimi, şut haritası, oyuncu değişiklikleri; öbür maçların kısa kaydına şut listesi eklenmesi.
- Rakip başkanın karar anı kodunun ve `?rakipBaskan=` parametresinin silinmesi; “Maçı bitir” ve “Maçı izleme”nin kalıcılaşması (ikisi de TEST, yayından önce kalkar); `file://` için önden hesap (borç).
- Motor (yukarıdaki dosya listesi), `MOTOR_AYAR`, taban, 80 ve 160 maç, hız ölçümü.
- Ses ve yetenek puanı. Yeni kişi (iki TEST çalışan dışında) ve yeni olay paketi yok.
- Yeni sezon (H3) ve transfer dalları (H4).

## Kayıt sürümü

**Sürüm 10, bütün tur için tek geçiş.** Gerekçeler: eski kayda iki yeni kişi eklenmeli; yeni iş, gelişme, karar ve katılım türleri (`maliRapor`, `yazismaCevap`, `gorusmeOnerisi`, `ekipGorusmesi`) ve yeni haber türü (`rapor`) geliyor — eski kod bunları “bilinmeyen tür” diye tutarsız sayardı, sürüm numarası kaydı doğru yoldan (“daha yeni sürüm”) reddettirir; `macOkundu` kalkıyor.

**`KAYIT_GECISLERI[9]`** düz veri dönüşümüdür (G2'nin `[8]` kalıbı): kural işlevi çağırmaz, para hareketi ve rapor üretmez.
1. `v.kayitSurumu=10`; `delete v.macOkundu`.
2. Başkan görevdeyse ve başkanın kulübünde o rolde aktif kişi yoksa yardımcı antrenör ve mali işler müdürü eklenir. Kimlik `v.sonrakiNo.kisi`'den, sayaç artar, kopyala-yaz. Ad ve doğum tarihi `PERSONEL_TEST`'in `js/kayit.js` içindeki donmuş kopyasından.
3. (H2-d) Başkan görevdeyse ve sezon sonu kaydı yoksa kaydın anına `maliRapor` işi.
- `kisi.okunan` yoksa 0 sayılır; alan eklenmez.
- Açık kararlar geçişte değişmez (hocanın isteğinin düşmesi yalnız hoca değişiminde, kuralla).
- `ESKI_KAYIT_SINIRI` 8 kalır: sürüm 8 kaydı 8→9→10 zinciriyle açılır. İçerik sürümü 5 kalır.

**Ara durum.** H2-c sürümü 10 yapar; H2-d aynı geçişe rapor işini ekler. Dal içinde H2-c koduyla yazılmış ara sürüm 10 kayıtları (yalnız denemeler) desteklenmez; yayına tek geçiş çıkar.

**Sigorta.** Üç s9 örneği H2-0'da kod değişmeden üretilir. Ayrıca `kayit-s8-hafta14.json` zincirle açılır, `kontrol.py araclar/kayit-deneme.html` koşulur ve geçişle açılan bir s9 kaydı tarayıcıda odaya kadar açılır (akis 21).

**Kayıt boyu.** Haftalık rapor ~320 B, aylık ödeme takvimiyle ~1 KB; sezonda ~15 KB. Girişim ve cevap kayıtları küçük. `k.haberler` paylaşılan alan değildir, her komutta derin kopyalanır; 20 sezonda ~400 KB'a varabilir — sınır ve sıkıştırma 5.2'nin sorusu; `sezon-deneme`'nin kayıt KB sütunuyla izlenir.

**H3 ve H4'e etkisi.** H3 sürüm 11'e ve `KAYIT_GECISLERI[10]`'a kayar, kendi s10 örneklerini H2 koduyla üretir; H3'ün geçiş bölümü `kariyer-deneme` 1.4d olur (1.4c H2'nin). H4 sürüm 11 kalır.

## Kabul

**Her commit öncesi:**
- `node araclar/mac-deneme.js 4` → “sonuç aynı”.
- `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni` → 40/40 birebir; `!` satırları H2-0'daki `h2-oturum-taban.txt` ile aynı. Bilinen kabul dışı satırlar: `c-1v1` eğim, `d-sut` köşe kurtarış satırları, `c-orta` “erken · 3–3”; seyrek kümede ayrıca `d-topcu` köşe bayrağı yanındaki taç teslimi ve `d-duran` korner başına gol.
- `node araclar/ad-denetimi.js` temiz. Yeni üst düzey adlar: `macIstSatirlari`, `macAyrintisi`, `arkaMacAnlik`, `telMacAyrinti`, `PERSONEL_TEST`, `YAZISMA_TEST`, `YAZISMA_KONULARI`, `yazismaKonusuEkle`, `personelKur`, `personelKisisi`, `yazismaSor`, `yazismaCevapAni`, `yazismaGoruldu`, `yazismaDogrula`, `gorusmeAniBul`, `kisiAktif`, `MALI_RAPOR_TEST`, `maliOzet`, `maliRaporBirak`, `maliRaporKur`, `maliRaporlari`, `maliRaporOkumasi`, `raporGoruldu`, `kasaCevapMetni`, `AY_BASI_EKLERI`. Blok içi `function` sızıntısı yok.
- `node araclar/kariyer-deneme.js` çıkış 0.
- Motor dosyaları: “h-program sınırlarından bu turda değişenler”deki `git diff --exit-code main -- …` boş.

**H2-0:** üç `kayit-s9-*.json` bugünkü kodla üretildi, anları ve açık kararları tutuyor (hafta14 2026-11-28 21:00; ocak 2027-01-09 21:00 ve açık `teklifKarari`, `transferButcesi` yok; sezonsonu `sezon.sonuc`), commit'lendi; taban dosyaları scratch'te; `kariyer-deneme` çıkış 0.

**H2-a:**
- Beklenen kırılmalar: akis 19 ve 20'nin `&rakipBaskan=yok` yeniden yüklemesi ve 19'un `HIZLI_JS` ile sürülen kariyer sayfası; akis 1'in şerit düğmesi sayımı.
- `node araclar/ikiz-deneme.js 4` yalnız gerileme denetimidir (Node'da `js/mac-sahnesi.js` yüklenmez); erken `izlemeKapat` akis 19 ve 20'de sınanır.
- `akis-deneme.py 14b` değişmeden geçer; ek adım: `?ekran=mac&tohum=4&rakipBaskan=yerinde`, maç öncesinde Maçı bitir → karar anı görünür ve `#macHesap` gizli; cevaplanınca örtü görünür, maç `fulltime`'a varır.
- `akis-deneme.py 19` (`file://`, işçisiz yol):
  - `&rakipBaskan=yok` ile yeniden yükleme kalkar; Maça geç'ten hemen sonra `TEPE_AN.aktif===false && MAC_PROTOKOL.rakipBaskan==='yok'`, santraya dek her yoklamada `KARAR_ANI.acik` hiç true olmaz.
  - Maç öncesinde Maçı bitir'e basar basmaz `MAC_IZLEME.kapali===true && MAC_IZLEME.ikiz===null && MAC_ONCESI.includes(mac.phase)`.
  - Basıştan sonra `HIZLI_JS` çağrılmaz; doğal `requestAnimationFrame` ile `wait_for_function` (zaman aşımı ≥ 180 sn). Arada `#macHesap` görünür ve iki yoklama arasında `renderer.info.render.frame` artmaz; basıştan kartın açılmasına kadar duvar saati ve kare farkı yazılır.
  - Kart skorla açılır; `KeyT` telefonu açmaz. Odaya dön → “Öbür maçlar tamamlanıyor” → oda 21:00 (zaman aşımı ≥ 240 sn; süre ayrı yazılır); `ligCanliBitir` casusla sarılır ve çağrılmaz; sekiz sonuç yazılmış, `k.maclar[id13].protokol` null.
  - Doğal bitiş: ikinci kariyer sayfası Maçı bitir'e basmadan `SONA_JS` ile sonuna dek oynanır → kart → Odaya dön → oda ölçülen sürede (≤ 120 sn) açılır, `ligCanliBitir` çağrılmaz.
  - Kariyersiz üç sayfa (izle, bitir, geç) birebir aynı sonuç kaydını verir (bu eşitlik denetiminde `HIZLI_JS` kalır).
- Yeni `akis-deneme.py 19b` (`file://`, “Maçı izleme”):
  - Oda `?dunya=7` → İlerle → şeritte TEST “Maçı izleme” → adres `ekran=mac&izle=0&mac=…`; `#onEkran` ve şerit gizli, `#macHesap` görünür, karar anı açılmaz, kart açılır.
  - Perde açıkken `KeyT` → `MAC_TELEFON.acik===false`; `KeyP` → `#macHesap` “Duraklatıldı” der ve 1 sn sonra `mac.kare` aynı; tekrar `KeyP` ile sürer.
  - `MAC_SONU.sonuc`, aynı kayıttan Stada git → Beklemeden geç → Maça geç → `SONA_JS` ile sonuna dek izlenen maçın `sonucKaydi`'siyle birebir aynı. Odaya dön sekiz sonucu yazar.
  - Odada Duraklat açıkken `[data-eylem="yapIzlemesiz"]` kapalı.
  - Hükmen: ayrı bağlamda `oyunKomut` ile Demirkapı'nın 12 oyuncusu sakat yapılır (kopyala-yaz) → Maçı izleme → kart hemen hükmen 0–3 ile açılır.
- `akis-deneme.py 20` (http, işçiler):
  - Yeniden yükleme kalkar.
  - Maçı izleme: kart T sn içinde açılır; `MAC_SONU.sonuc`, işçinin ikiz sonucu ve aynı tohumla doğal oynanan canlı maçın kaydı birebir aynı; kazanan yol (`HIZLI_BITIR.anlik`) yalnız bilgi satırı, süre yazılır.
  - Sayfa açılışından hemen sonra basılan Maçı bitir'de örtü görünür; kart yarışı kazanan yolun sonucuyla açılır; sonuç aynı.
  - Anlık dal bugünkü “işçiler bittikten sonra Maçı bitir” denetimiyle sınanmaya devam eder (kart ≤ 5 sn, `anlik`).
  - Kart açıldıktan sonra `arkaDus('deneme')` çağrılır: rAF zaman damgaları arasında 1 sn'den uzun boşluk yok; Odaya dön biter; sekiz sonuç `arkaMacOynat` sonuçlarıyla aynı; `ligCanliBitir` çağrılmaz. `MAC_SONU.isciBekle ≥ 60000`.
- `akis-deneme.py 1`: “Stada git” `.od-ana`'da, “Maçı izleme” `.od-ikinci`'de.
- `python -X utf8 araclar/kontrol.py`; `kontrol.py "index.html?ekran=mac&tohum=4&rakipBaskan=yerinde"` (TEST karar anı hâlâ açılır); `python -X utf8 araclar/akis-2d.py` (masaüstünde `-I` olmadan).
- README'ye ölçülen `file://` ve http süreleri yazıldı.

**H2-b:**
- Beklenen kırılmalar: akis 16'nın maç telefonu tablosu (8 → 10 satır); akis 19'un Canlı Skor tıklama seçicisi (`data-mac`).
- `kariyer-deneme` 3.8: kısa kayıtta `macAyrintisi`'nin gol satırı sayısı skor toplamına eşit; bütün adlar `k.oyuncular`'dan çözülür ('—' yok); xg kayıttakiyle aynı; 10 tablo satırı. Bizim tam kayıtta `macBeklenenGol(sutlar)===xg`.
- `kariyer-deneme` 3.9: hükmen kayıtta `hukmen`, boş listeler, tek not.
- `kariyer-deneme` 3.8b: `arkaMacOynat` örneklerinde `n` ve `ist`; iki öbür maçta üç örnek karesi için `arkaMacAnlik(R.son,o)`, aynı kareye kilit adımla getirilen motorun `sonucKaydi`'siyle JSON düzeyinde eşit (skor, goller, kartlar, sakatlıklar, şutlar, ist); son örnekte önek `R.son`'la eşit; işçi bağlamı eşitliği yeni örnek biçimiyle de geçer.
- `node araclar/sezon-deneme.js 3`: kısa kayıt ve belirlenimcilik aynı; H2-0'daki `h2-sezon-3.json` ile skor ve tablo aynı.
- `akis-deneme.py 16` (kariyersiz; yalnız bizim maç): “Beklenen gol” satırı `macBeklenenGol(mac.sonucKaydi().sutlar)`'a eşit (Türkçe, 2 ondalık); “İsabetli şut” `isabetEk`'li; ekranda “xG” yazısı yok; N2 tek satır ölçümü geçer.
- `akis-deneme.py 19` (`file://`): santradan birkaç saniye sonra maç telefonunda bir öbür maç satırına dokununca ayrıntı açılır, gol satırı sayısı satırdaki skor toplamına eşit, değerler `x.m.sonucKaydi()` ile aynı; odada 13. haftanın sekiz satırı dokunulur, öbür sonuçta adlar ve kayıttaki xg görünür; büyük yazıda ve 800×600'de “Son maç” ve bir öbür maçın ayrıntısı açıkken `.tel-skor`, `.tel-olay`, `.tel-ist` yatay taşması ≤ 1 (ölçüm sayısı yazılır).
- `akis-deneme.py 20`: santradan ~2,5 sn sonra öbür maç satırının ayrıntısı `arkaMacAnlik(x.son, arkaMacDurum(…))` ile aynı, tabloda “Beklenen gol”.
- `kontrol.py`.

**H2-c:**
- Beklenen kırılmalar: `kariyer-deneme` 2.8L (sürüm, kişi sayısı, tanımlı adlar, “Telefonda konuşma yok”), 1.4 (zincir), 1.4b, 2.2 (tek konuşma varsayımı), 3.2 (hoca yorumu ve `macOkundu`), 3.7a, 4.2, bozuk kopyalardaki `macOkundu` satırları; `akis-deneme` 1 (N14 boş liste), 3 (Mesajlar sırası), 19 (hoca yorumu ve `macOkundu`); `sezon-deneme` kayıt metni parmak izi.
- `kariyer-deneme` 2.8L: kayıt sürümü 10; kişiler 19 (başkan, 16 hoca, yardımcı, müdür); tanımlı adlar `GELISMELER.yazismaCevap`, `KARAR_TURLERI.gorusmeOnerisi`, `KATILIM_ETKILERI.ekipGorusmesi`; `GIRISIMLER` yalnız `yaz.*` (bu adımda 6, H2-d'den sonra 7); “Telefonda konuşma yok” şuna döner: listede hoca ve yardımcı (H2-d'den sonra müdür de) var, mesaj yok, okunmamış 0, konular öneri olarak duruyor; İlerle yine doğrudan maç gününe.
- `kariyer-deneme` 2.2: personel ve hoca rolleri süzüldüğünde tek konuşma Berk Deneme'nin; geri kalan TEST akışı aynen.
- `kariyer-deneme` 1.4: zincirde 9→10; 1.4b: s8 örneği 8→9→10.
- Yeni `kariyer-deneme` 1.4c: üç s9 örneği 9→10 açılır — kişiler bir kez eklenir, `macOkundu` yok; hareket sayısı aynı; ikinci açılış yeniden geçiş yapmaz; Ocak örneğinde teklif kartı yerinde ve cevaplanabilir; `kariyerDogrula` temiz.
- `kariyer-deneme` 3.2 (yeniden yazılır): maçtan sonra hocanın konuşmasında gelen mesaj yok; hocaya “Maçı nasıl gördün?” → `ilerleOnizle` nedeni 'haber', `haberIsi` cevap işi, hedef cevap anı (21:00 sonrası soruda ertesi gün 09:30) → gelen metin `macYorumu(k,id13).metin`'e eşit ve `/\d/` içermez; yardımcının cevabı rakamlı (“Beklenen gol”, şut); aynı maç ikinci kez listede yok; `yazismaGoruldu` sonrası okunmamış 0; kaydet–yükle sonrası metin aynı; `rastlanti.durum` değişmez; konu seçmek karar kaydı yazmaz.
- Yeni `kariyer-deneme` 3.2c (yazışma ve görüşme): bekleyen soru varken o kişinin bütün konuları engelli; `mac`/`takim` cevabı katılımı ve gözlemi kesmez; “Takım ne durumda?” cevabı sonradan sakatlık ya da tablo değişse de aynı metni verir, aynı gün ikinci kez sorulamaz; Görüşelim → öneri maç gününü atlar, 11:00 ya da 15:00; `gorusme` cevabı katılıma giderken “karar” nedeniyle durdurur; öneri mesele açmayan bir karardır, soranın konuşmasındaki `kararlar`'da, `kararTelefondaMi` true, iki seçenek; Kabul → 45 dakikalık isteğe bağlı randevu (`kisiId`, `etki`, `aciklama`), katılınca `bilgi`; randevu beklerken yalnız `gorusme` konusu engelli, “Maçı nasıl gördün?” açık; öneri saati doluysa Kabul engelli; 14 gün boyunca yer yoksa “Uygun olduğunuzda yazın başkanım.” ve kart yok; Başka gün iste üç kez → zincir biter, kart kurulmaz; cevapsız kalırsa `zamanAsimi` bir kez işler, ikinci uygulama reddedilir.
- `kariyer-deneme` 3.7a (P12 hoca değişimi): eski hocaya bekleyen soru, görüşme önerisi ve randevu iptal (geçmişte `iptal`); konuşmada “Cevap gelmedi.”; yardımcı aynı kişi; yeni hocanın konuları listede, eski hocanın konuşmasında konu yok; `hocaSuresi` davranışı aynı.
- `kariyer-deneme` 4.2 (H1 bulgusu ve hocanın isteği): kariyer 7 Ocak 12:00'ye ilerletilir (teklif ve istek ikisi de açık) → `hocaDegistir` → hocanın isteği iptal (geçmişte `iptal`, konuda `kisiAyrildi`, konu kapalı, bekleyen imza yok); gelen teklif dosyada iki cevapla verilebilir; eski hocanın konuşmasında `dosyaKarar` ve `kararlar` boş, `kararTelefondaMi(teklif)` false. Onaylanmış istekten sonra hoca değişirse imza sürer ve teşekkürü görevdeki hoca eder (G2 aynen). `kayit-s9-ocak.json` üstünde yalnız teklif kısmı.
- `node araclar/sezon-deneme.js 3 7`: belirlenimcilik ve diziliş tutarlı; kariyer metninin parmak izi bilerek değişir.
- `node araclar/sezon-deneme.js 18 7 --tek --teklif sat --talep onayla --p12 sabir --json …`: H2-0'daki `h2-sezon-sabir.json` ile 18 hafta boyunca skor, sıra, puan, kasa ve an alanlarında birebir (kayıt KB sütunu hariç; yeni hoca kurulmadığı için kimlik kayması yok).
- `node araclar/sezon-deneme.js 18 7 --tek --teklif sat --talep onayla --p12 degisim --json …`: `h2-sezon-degisim.json` ile hoca değişiminin haftasına dek aynı alanlarda birebir; sonrası bilgi (yeni hocanın kimliği kaydı, kadro yanılgısı kimliğe bağlı; motorla ilgisi yok) ve sonuca yazılır.
- `akis-deneme.py 1`: Mesajlar listesinde hoca ve yardımcı; önizlemede konu açıklaması; bildirim yok; maç günü ana ekranda bildirim yok kabulü aynen.
- `akis-deneme.py 3`: TEST bildirimi yine ilk sırada, Mesajlar sırasında cevap bekleyen önce; 13 yerleşim ölçümü aynen.
- `akis-deneme.py 19`: maçtan sonra hoca yorumu yok; odada “Maçı nasıl gördün?” → giden balon → İlerle → “Cevap geldi; telefonda.” → cevap `macYorumu`'na eşit; defterdeki “Maçtan not” aynen.
- Yeni `akis-deneme.py 21` (kişiye yazmak ve görüşme): Görüşelim → İlerle (karar) → telefonda tek kart, kenarlar “Kabul et” / “Başka gün iste”; sürükleyip Kabul → defterde öneri gününde “Görüşme: <ad>”; İlerle randevuda durur → Katıl → “Öğrendiklerin”; “Başka gün iste” yolu; Duraklat'ta öneri düğmeleri kapalı; maç telefonunda konular gizli; hocanın konuşması konu satırları görünürken normal ve büyük yazıda, 1180 ve 800 px'te yatay taşma ≤ 1 (ölçüm sayısı yazılır).
- `kontrol.py` ve `kontrol.py araclar/kayit-deneme.html` (kayıt sürümü 10).

**H2-d:**
- Beklenen kırılmalar: `kariyer-deneme` 2.2 (`haberler[0]`), 2.8L (haber yok, iş 8), 4.1 (kasa paneli yorumu), 5.1a/5.1b; `akis-deneme` 1 (Kasa düğmesi, 6 tuşu, dosya kapalı, iş 8, haber yok), 3 (sekme sayımı, `.dsy-nokta`, “Kapandı” adımı).
- `kariyer-deneme` 2.2: gazete haberi `odaIzleri(c).gazete` ile seçilir; `yeniHaber===1` (rapor sayılmaz).
- `kariyer-deneme` 2.8L: haberlerde yalnız ilk özet (tür 'rapor', anahtar 'mali.haftalik', `p.kaynak` müdür, `p.nakit` açılış nakdi); iş sayısı 8'den 9'a (+ `maliRapor` 30 Kasım 09:00); 7 `yaz.*` girişimi; listede müdür de var.
- Yeni `kariyer-deneme` 4.1c (mali rapor): açılış özeti var; 30 Kasım haftalık rapor gelir; 1 Aralık 10:00 aylık rapor maaştan sonra yazılır, okumasında Aralık maaşı ve lig payı hareketleri ve ödeme takvimi var; aylık raporun `enDusuk` ve `son90`'ı, ay başı tamamlandıktan sonra aynı anda hesaplanan `maliOzet` ile eşit (çift sayım yok); 1 Şubat 2027 Pazartesi haftalık rapor yok, aylık var; haftalık raporun okumasında hareket listesi yok; raporun sayıları sonradan değişmez (Cumartesi bilet geliri eklendikten sonra 23 Kasım raporunun okuması aynı); `raporGoruldu` yalnız o raporu işaretler; `yeniHaber` ve `haberlerGoruldu` raporlara dokunmaz; nakit deneme içinde düşürülünce bir kez `mali.uyari`, toparlanmadan ikinci uyarı yok; müdür yoksa rapor yok ama zincir sürer; kaydet–yükle aynı; `kariyerDogrula` temiz; bozuk kopyalar yakalanır (rapor `p`'si nesne değil, bilinmeyen anahtar).
- `kariyer-deneme` 3.2c'ye ek: “Kasa ne durumda?” cevabı 90 dk sonra müdürün konuşmasında; sayıları cevap anındaki `maliOzet`'le aynı; aynı gün ikinci soru kapalı.
- `kariyer-deneme` 1.4c'ye ek: hafta14 ve Ocak örneklerinde kaydın anında `maliRapor` işi var; sezon sonu örneğinde yok ve İlerle engeli korunuyor.
- `kariyer-deneme` 5.1a ve 5.1b: sezon sonu kaydından sonraki ilk Pazartesi raporundan sonra bekleyen `maliRapor` yok; İlerle yine “Sezon tamamlandı” der.
- `node araclar/sezon-deneme.js 18 3 --kaydet`: haftalık rapor sayısı Pazartesi sayısına (ayın 1'leri hariç) eşit; aylık rapor sayısı ay başı sayısına eşit; zincir sezon sonunda durur; belirlenimcilik “aynı”; kayıt KB sütunu yazılır. `--p12 sabir` karşılaştırması H2-0 tabanıyla yine birebir.
- `akis-deneme.py 1`: Kasa düğmesi yok; 6 tuşu panel açmaz; dosya düğmesi açık ve “yeni” rozetli; 3 tuşu dosyayı Raporlar ile açar (“Kasadaki para”, en düşük bakiye, “90 gün”, “Belirsiz gelir”); zaman değişmez; kapatınca rozet kalkar; iş 9, haber 'mali.haftalik'; görüntü `son-akis-1-dosya-rapor.png`.
- `akis-deneme.py 3`: sekme sayımı `.dsy-sekme[role="tab"]:not(.dsy-arsivSekme):not(.dsy-raporSekme)`; nokta denetimleri `.dsy-sekme:not(.dsy-raporSekme) .dsy-nokta`; (a) cevap bekleyen konu yine önce açılır; (a)'dan sonra açılış raporu Raporlar sekmesinden bir kez açılır (görüldü), böylece “Kapandı” adımı bugünkü beklentiyle (dosya son konuyu “Kapandı” damgasıyla açar) kalır; tek kart denetimleri aynen.
- `akis-deneme.py 21`'e ek: müdüre “Kasa ne durumda?” → cevap telefonda; `kayit-s9-ocak.json` bölüm 2'nin kalıbıyla (`add_init_script` → `localStorage`) yüklenir: oda hatasız, kayıt sürümü 10, telefonda hoca, yardımcı ve müdür, teklif kartı tek kartla cevaplanabilir, ilk İlerle'den sonra “Raporlar (1)”.
- `kontrol.py` (oda kasasız); `python -X utf8 araclar/kontrol.py prototipler/7-dosya-defter.html`: hata listesi `main`'dekiyle aynı (bugünkü bilinen F3 hatası; bu tur yeni hata eklemez).

**Tur kapanışı (H2-e):**
- `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni --seyrek` → 40/40, sağlık aralığı dışı 0; `!` satırları bilinen listeyle aynı.
- `node araclar/kariyer-deneme.js`; `node araclar/sezon-deneme.js 3 7` ve `18 3`.
- `node araclar/ikiz-deneme.js 4`.
- `python -X utf8 araclar/akis-deneme.py` tamamı, masaüstünde, tek yürütücüyle ve ağır CPU işiyle aynı anda değil. Bilinen tek düşüş 15b; “Sayfa ve betik hatası yok”.
- `kontrol.py` (index, rakip başkan adresi, `kayit-deneme.html`); `akis-2d.py`.
- İncelenecek görüntüler: `araclar/son-akis-1-*.png`, `-16`, `-19`, `-19b`, `-21`, `-3-telefon*`. Bunlar Claude'un kendi incelemesi içindir; kabul sahnesi üretilmez.
- `file://` ve http süreleri (bizim maç; Odaya dön beklemesi; Maçı izleme) devam notuna ve README'ye yazılır.
- Belgeler: `git diff --check` temiz, yerel bağlantılar çalışıyor.

## Riskler

- **Kayıt sürümü 10 geri dönüşsüz bir geçiştir.** Sigortası: s9 örnekleri önce üretilir, geçiş düz veridir, 1.4c 8→9→10 zincirini sınar, akis 21 geçişle açılan kaydı tarayıcıda açar. H3 ve H4 sürüm 11'e kayar; `h3-uygulama.md` güncellenmezse iki geçiş aynı numarayı yazar.
- **İki makine.** Sürüm 10 kaydı, pull edilmemiş öbür makinede “daha yeni sürüm” diye açılmaz (beklenen; “evdeyim / devam”da önce pull).
- **`k.haberler`'in anlamı genişliyor.** Üç filtre (`yeniHaber`, `haberlerGoruldu`, gazete paneli) unutulursa gazete raporla yanar. Kilit: 2.2'de `yeniHaber===1`, 4.1c ve akis 1.
- **Ay başı raporunun ufku.** İşlenen ay başı işi `uygula` sırasında takvimde durduğu için ufuk onu iki kez sayabilir; `haricIsId` ve 4.1c'nin eşitlik denetimi kilitler.
- **Rapor zinciri sezon sonu kaydından sonra sürerse** İlerle “Sezon tamamlandı” engeline varmaz (G2'nin ay başı tuzağı). Kilit: 5.1a, 5.1b, `sezon-deneme 18 3`.
- **Genel durak.** `veri.durak` her iş türünde geçerli; çok soru İlerle'yi sık durdurur. Kişi başına tek bekleyen soru bunu sınırlar; durak yazısı nedeni söyler.
- **Maç akşamı.** Cevap ya da görüşme önerisi maç akşamına düşerse maç sonucunun 21:00'e ilerlemesi durur. Önlem: mesai 09:00–18:30, öneri maç gününü atlar. Görüşme önerisi maç günü 18:30'dan önce gelirse İlerle orada “karar” nedeniyle durur; karar bekleyebilir olduğu için Stada git engellenmez.
- **Kişi kimlikleri kayar** (`kisi-18`, `kisi-19`). P12'de kurulan yeni hocanın kimliği değişir ve kadro yanılgısı kimliğe bağlıdır; `--p12 sabir` karşılaştırması kaymayı dışlar.
- **Mesele açmayan karar telefonda yeni bir yol.** `kararBekleyen` bu kararı saymaz; oda özeti `kararTelefondaMi` ile doğru yeri söyler.
- **Hocanın isteğinin düşmesi** G2'nin açık kararını değiştirmez ama yeni bir kural yoludur (§2 kuralının uygulaması); kullanıcıya bilgi olarak sorulur.
- **Dosya artık hep masada.** Açılış önceliği ve `akis-deneme` seçicileri kırılgan; rapor işareti ayrı sınıfta; prototip 7 `typeof` korumasıyla.
- **`file://` beklemesi.** Oyun dosyadan açılınca Web Worker yoktur; tahmin: bizim maç santradan ~7–15 sn (+ maç öncesi ~2–3 sn), öbür yedi maç kartın arkasında ~50–100 sn. `requestAnimationFrame` arka sekmede durur; Electron'da Worker denenmedi. Süreler ölçülüp yazılır; README'de http birincil yol. Kayıt adres başına ayrıdır: dosyadan açılan oyunun kaydı http'de görünmez.
- **Yarış ve izleme ikizi.** `izlemeKapat` erken çağrılır; TEST tarz komutu (B4b) ikizi yeniden başlatır, o durumda ana iplik kazanır, sonuç yine aynıdır. İşçi sayısı çekirdek−1 olduğu için ana iplik kendi çekirdeğinde koşar; tek çekirdekli makinede yarış işçiyi yavaşlatabilir. Kilit: akis 20'nin yoldan bağımsız eşitliği.
- **Perde.** Hükmen maçta kart doğrudan açılmalı; perde açıkken telefon kapalı; karar anı açıkken örtü gizli; duraklatmada “Duraklatıldı” görünmezse kullanıcı takıldı sanabilir (19b kilitler).
- **İşçi örneği büyüyor.** Boyu ~4 kat (postMessage ~0,7 MB); dizüstünde işçinin bitiş süresi ölçülür. Önek yöntemi kayıt listelerinin yalnız eklendiği varsayımına dayanır; ileride gol silen bir VAR iptali bunu bozar (3.8b kilitler).
- **N2 ve karar 34.** Canlı beklenen gol ayrıntı tablosunda, satırın kendisinde değil; karar 34'ün “maç sonrası” sınırı kullanıcının yeni isteğiyle açılır, kullanıcı kararı olarak yazılır.
- **İçerik kuralı.** TEST kişiler ve metinler CLAUDE.md'nin “İçerik” istisnasına yazılmazsa kuralla çelişir. Yardımcının rakamları gizli değerleri sızdırmamalı; hoca şablonları rakamsız (3.2'de `/\d/`).
- **Dar telefon.** İki sütunlu olay listeleri ve konu satırları taşabilir; kilit 19 ve 21'in taşma ölçümleri.
- **Kesilme.** Tur büyük (beş istek). H2-a ve H2-b kendi başına anlamlıdır; H2-c ve H2-d birbirine bağlıdır (müdür H2-c'de kurulur). Kesilirse dal yerelde kalır (kullanıcı “bugün kapatıyorum” derse push edilir), `main` değişmez, yapılmayan devam notuna yazılır.

## Claude kararları (belgeye görünür yazılır)

1. **Sıra.** Akış → Canlı Skor → kişiler ve yazışma → mali rapor → belgeler. Her alt adım ayrı commit; kayıt işi sigorta örneğinden sonra; denetimleri tek yürütücü sırayla koşar.
2. **Rakip başkan.** Kariyerde maç gününün protokolüne “yok” yazılır (içerik kancası). Kod, `?rakipBaskan=` ve denetim adresleri aynen kalır; geri açmak tek satırdır.
3. **“Maçı bitir”.** Maçı izletmez: perde açılır, çizim atlanır, son kare donuk, bütçe 250 ms (TEST). İkiz hazırsa sonuç anında gelir (maç öncesinde de); ana iplikle ikiz yarışır. İşçisiz yolda önce bizim maç, öbürleri kartın arkasında. Öbür maçları kart açıldıktan ya da Odaya dön beklerken hep aynı bütçeli sürücü bitirir; işçi düşünce sıfır adımla yeniden kurulur. “Odaya dön” sayfayı dondurmadan bekler; eşzamanlı tam maç yalnız son çaredir.
4. **“Maçı izleme” (TEST).** Aynı mekanizmayı (`HIZLI_BITIR`) ve aynı ikizi kullanır, adres parametresi `izle=0`. Sahne kurulur ama çizilmez; sonuç izlenen maçla birebir aynıdır. Ayar ya da kayıt alanı eklenmez.
5. **`file://`.** Anında sonuç vaat edilmez; süre ölçülür ve yazılır, README'de http birincil yol; önden hesap borç (seçenek: bülten ve maç öncesi boyunca ana iplikte dilimli ikiz hesabı).
6. **Canlı Skor.** Bütün sayılar `sonucKaydi`'den (isabetli şut `isabetEk`'li; telefon, kart ve kayıt aynı sayıyı söyler); canlı beklenen gol ayrıntı tablosunda (N2); öbür maçların canlı ayrıntısı işçinin bitmiş kaydının örnek sayaçlarıyla kesilmiş önekidir; ayrıntıda goller, kartlar, sakatlıklar ve 10 satırlık tablo (bizim maç dahil aynı görünüm); oyuncu değişiklikleri, şut haritası, gol bildirimi ve geçmiş hafta gezintisi yok; kart rengi sabitleri `STIL.kagit.kartRenk`'e.
7. **Kişiler.** Yardımcı antrenör ve mali işler müdürü TEST kişi kaydıdır: yönetim koltuğu değil, sözleşmesiz, yalnız bizim kulüpte. Yardımcı hoca değişince kalır.
8. **Konular.** `GIRISIMLER` üzerinden; konu seçmek menüdür. Soru 0 dk. Kişi başına tek bekleyen soru ya da öneri; gelecek randevu yalnız “Görüşelim”i kapatır; “Maçı nasıl gördün?” maç başına bir kez (hocaya yalnız kendi yönettiği maç); “Takım ne durumda?” ve “Kasa ne durumda?” günde bir. Müdürle görüşme konusu yok. Şerit metni ek almayan kalıptır.
9. **Cevap.** Gizli bir dış gelişme. Gecikme kişiye göre (TEST), mesai 09:00–18:30; rastlantı çekilmez. Düz cevap katılımı ve gözlemi kesmez; İlerle genel `veri.durak` kuralıyla cevap anında durur; görüşme cevabı karar doğurduğu için keser.
10. **Kayda metin yazılmaz.** Cevap anahtar ve parametredir; değişen durum cevap anında sayı ve kimlik görüntüsü olarak saklanır; metin okuma anında TEST şablondan.
11. **Görüş ve olgu ayrılır.** Hoca görüşle (F3 şablonu, ısrarcı hoca yanlı, rakamsız), yardımcı rakamla. Gizli değer hiçbir metinde yok.
12. **Mesaj kaydı.** Giden mesaj geçmişteki girişim kaydıdır; gelen mesaj gelişmenin sonucudur; okundu bilgisi kişi başına tek andır (`kisi.okunan`). `k.macOkundu` kalkar.
13. **Görüşme isteği.** Mesele açmayan bir karardır; öneri belirlenimcidir (ertesi günden, 11:00 ya da 15:00, maç günü atlanır, 14 günde yer yoksa “uygun olduğunuzda yazın”). Tek kartta [Kabul et / Başka gün iste]; en çok üç öneri. Kabul edilen görüşme 45 dakikalık isteğe bağlı randevudur (2.8H); içeriği TEST özet.
14. **Hoca değişince** muhatabı ya da soranı eski hoca olan bekleyen işler iptal edilir; böylece hocanın transfer isteği düşer (OYUN_TASARIMI §2 geçersiz karar kuralı; konuya `kisiAyrildi` olayı). Onaylanmış istekten doğan imza G2 kuralıyla sürer. Soransız gelen teklif kulübün kararı olarak dosyada kalır; H1 bulgusu gösterimde etkin kişi kuralıyla düzelir.
15. **Mali rapor `k.haberler`'de `rapor` türüdür, mesele değildir.** Bağlı işi olmayan mesele hemen kapanır, açık mesele bekleyen bir adım ister; haber kaydı zaten kaynaklı, tarihli, görüldü işaretli kalıcı belgedir. Raporun sayıları yazıldığı anın görüntüsüdür; hareket listesi yalnız aylık raporda ve türetilir.
16. **Rapor ritmi.** Haftalık rapor görünür bir rutin iştir (Pazartesi 09:00, TEST), kısadır ve İlerle'yi durdurmaz. Aylık rapor ay başına bağlı kancadır, ufku işlenen ay başını dışarıda bırakarak hesaplanır. Yeni kariyerde ilk özet açılış anında; geçişle açılan kayıtta ilk ilerlemede. Zincir sezon sonunda durur; yeni sezonda yeniden kurmak H3'ün işidir.
17. **Kasa'ya giden bütün yollar kalkar.** Düğme, 6 tuşu, saymanın “Kasaya bak” bağlantısı ve dosyadaki “Kasa ▸”. Dosyada Arşiv'in yanında “Raporlar” sekmesi; masadan açılış önceliğinde karar öndedir, kapanmış seçili konu bugünkü gibi açılır. Odaya yeni düğme eklenmez.
18. **Eksi kasa.** Rozetin yerine mali işler müdürünün kısa uyarı raporu: kasa eksiye düşünce bir kez (durumsuz kural: son raporun nakdi eksi değilse). Kriz içeriği değildir; karar 44'ün “işaretlenir” güvencesi korunur.
19. **Kayıt sürümü 10, tek düz veri geçişi.** Rapor sayısına sınır konmaz (5.2'nin sorusu). Odadaki “Ajanda” etiketi ve gazete aynen kalır.
20. **Çalışma biçimi.** H2 oto modda değildir; commit'ler dalda kalır, push kullanıcının sözüyle; makine durumu satırı yalnız oto modda.

## Kullanıcıya sorular (devam notuna yazılır)

1. “Günlük durum çıktısı” dedin; onaylanan varsayım haftalık kısa ve ay başı ayrıntılı rapor. Günlük rapor istersen ritim değişir (dosya çabuk dolar).
2. Onaylı metin “bizim maçın satırında canlı beklenen gol” diyordu; N2 tek satır kararı nedeniyle satıra dokununca açılan tabloda. Satırın kendisinde de görmek ister misin?
3. Onaylı metin “odada geçmiş haftalar için kayıttan” diyordu; bu turda odada son haftanın sekiz maçı dokunulur. Daha eski haftaları görmek istersen odaya düğme eklenmez, Canlı Skor uygulamasının içinde hafta seçimi olur.
4. Yardımcı antrenör hoca değişince kulüpte kalıyor (TEST). Gerçekte çoğu zaman hocayla gider; nasıl olsun?
5. Oyunu nasıl açıyorsun: dosyadan mı, GitHub Pages'ten mi, yerel sunucudan mı? Dosyadan açınca Maçı bitir sonucu <ölçülen> sn, Odaya dön beklemesi <ölçülen> sn; http'de <ölçülen> sn. Dikkat: kayıt adres başına ayrıdır, dosyadan açtığın oyunun kaydı http adresinde görünmez.
6. TEST adlar (yardımcı, müdür) ve cevap ile rapor metinleri senin değiştirmen için yer tutucu.
7. Bilgi: hocanın transfer isteği cevaplanmadan hoca değişirse istek düşüyor (geçersiz karar kuralı). İstersen yeni hocaya taşınır.
8. Bilgi: eksi kasa artık Kasa düğmesinin kırmızı rozetiyle değil, mali işler müdürünün dosyaya bıraktığı kısa uyarıyla görünüyor.
9. Bilgi: “az düğme” kuralının belgeye yazılan metni onaylı varsayımdan biraz geniş: gazete yalnız haber varken masada kalıyor (yeri açık karar) ve TEST düğmeleri (Maçı izleme, Kadro TEST) yayından önce kalkacak istisnalar olarak yazıldı; bilgi kaynakları kişi, belge, gözlem ve Canlı Skor'un kamuya açık sayıları.
10. Bilgi: kötü gidişte (P12) hoca yine kendiliğinden yazıyor; her maçtan sonra değil, yalnız o koşulda.

## Belgeler

- **OYUN_TASARIMI:**
  - §2'ye kural paragrafı (kullanıcı, 2026-10-26): “Az düğme, bilgi kaynağından gelir: odada nesneler durur — dosya, defter, telefon, pencere/balkon; gazete yalnız haber varken (yeri açık karar, `ui-mimari` §4.6) — ve İlerle, Duraklat, Ayarlar; TEST düğmeleri (Maçı izleme, Kadro TEST) yayından önce kalkar. Yeni bilgi için düğme eklenmez; bilgi kaynağından gelir: onu bilen kişiden (soru; zaman alır), tarihli ve kaynaklı belgeden (dosyadaki rapor), gözlemden (pencere, balkon, maç) ya da kamuya açık sayılardan (Canlı Skor).”
  - §2 ekran tablosuna satırlar: Dosya / Raporlar (okuma, karar değil); Telefon / Mesajlar (hazır konudan yazmak; menü, cevap saatler sonra); Telefon / Canlı Skor (canlı beklenen gol, öbür maçların ayrıntısı).
  - §2'deki “mali bilgi sayman görüşü veya ilgili dosyada” → “mali işler müdürünün dosyadaki raporunda ve ona sorulan soruda”.
  - §2 F3 notunun (2) maddesi: maç akşamı otomatik yorum → “başkan sorarsa”.
  - §6: kişiye yazmak zaman tüketmez, cevap saatler sonra gelir ve İlerle orada durur; rapor İlerle'yi durdurmaz.
  - §7: G2 paragrafındaki Kasa paneli cümlesi → mali işler müdürünün haftalık ve ay başı raporu, eksi kasa uyarısı.
  - §8 “Teknik direktör”: soru, görüşme isteği, randevu, yardımcı antrenör; hoca değişince açık işler (bekleyen soru ve görüşme iptal, hocanın isteği düşer, gelen teklif kulübün kararı).
  - §10: TEST çalışanlar.
  - §11: N12 paragrafına “kariyerde kapalı (2026-10-26)”; Maç sonu paragrafına Maçı bitir perdesi ve Maçı izleme (TEST); F7 paragrafına öbür maçların ayrıntısı ve “takım güçlerine göre” bugünkü hâl (hocanın kadrosu ve tarzı; TEST: stat alanı yok); beklenen gol satırına “maçta canlı”.
  - §13: bilgi mimarisi satırında iki karar kapandı.
- **STIL_REHBERI §7:** odanın nesneleri (2.8C maddesindeki “kasa ayrı panel” kalkar); dosyada Raporlar sekmesi, `dsy-yeniRapor` işareti ve dosyanın masada her zaman durması; N14 notu (personel ve hoca hep listede); konuşmada hazır konular; Canlı Skor ayrıntısı (F7 maddesindeki “dokunulmaz” düzeltilir); Maçı bitir perdesi; N12 notu; oda şeridinde TEST “Maçı izleme”.
- **TEKNIK_PLAN:**
  - §3 “Uygulanan (H2): sürüm 10” tablosu: personel rolleri ve `kisi.okunan`; haber türü `rapor` ve `p`; iş `maliRapor`, gelişme `yazismaCevap`, karar `gorusmeOnerisi`, etki `ekipGorusmesi`, `veri.muhatap`; geçmişte girişim kaydının alanları ve `sonuc.yazisma`; mesele olayı `kisiAyrildi`. F3 tablosundaki `macOkundu` satırı kalkar.
  - §4: genel `veri.durak` ve `ilerleOnizle`'nin `haberIsi` alanı.
  - §5: 9→10 geçişi ve örnekler (`--kayit-yaz` tanımı).
  - §6: `MESAJ_KAYNAKLARI` yönü; `GIRISIMLER` aralık, kişi ve kayıt; mesele açmayan soranlı kararın telefondaki yeri; etkin kişi kuralı; `AY_BASI_EKLERI`; `nakitUfku`'nun `haricIsId`'si; hoca değişiminde iptal süzgeci (muhatap, soran).
  - §8: perde, yarış, izlemesiz kip, rakip başkan protokolü, örnek biçimi (`n`, `ist`) ve `arkaMacAnlik`, `ligCanliHizli`'nin genişleyen koşulu, `dusus`'un sıfır adımı, “Odaya dön” beklemesi ve `MAC_SONU.isciBekle`, `file://` süresi.
  - §10: Canlı Skor ayrıntısı; kasa paneli yerine rapor görünümü.
- **YOL_HARITASI:**
  - karar 51 “H2 kararları (Claude)”;
  - devam notu (kullanıcı soruları, ölçülen süreler, “az düğme” metninin onaylı varsayımdan farkı);
  - Tamamlanan turlar: `tur/h2-istekler`;
  - Bilinen borçlar: H1 bulgusu, `macOkundu`, F7'nin “öbür maçların olay akışı yok” (ayrıntı var, bildirim yok), G1'in “~20 sn içinde basılırsa” ve “akis 19 rakip başkan yokken koşar” satırları kalkar ya da güncellenir; yeni borçlar: `file://` için önden hesap (seçenek: dilimli ikiz), Electron'da işçi, rapor kaydının sıkıştırılması (5.2);
  - 4.1'e kısmi not (mali özet müdürden).
- **CLAUDE.md:** “Bugün çalışan” (Kasa düğmesi yerine mali rapor, eksi kasa uyarısı ve müdüre soru; hocanın yorumu yerine kişiye soru ve görüşme isteği; karar anı kariyerde kapalı; Maçı bitir perdesi; Maçı izleme; Canlı Skor ayrıntısı; kayıt sürümü 10); “İçerik” istisnası (TEST çalışanlar, yazışma ve rapor metinleri Claude'un TEST taslağı, kullanıcı değiştirir); “Maç 2D” rakip başkan notu; “Maçın süresi” Maçı bitir.
- **README:** “Açmak” bölümü H2-a'da (http birincil, dosyadan açmanın süresi, kaydın adrese bağlı olduğu).
- **`araclar/plan/ui-mimari-ve-gorsel-yon.md`:** §4'te 2 (mali yarısı) ve 3 için “H2'de uygulandı”; §3 tablosunun Para satırı.
- **`araclar/KAPILAR.md`:**
  - yeni satır “Kişiye yazmak, görüşme, personel (`js/yazisma.js`; `js/mesajlar.js` kaynak yönü, soranlı karar, etkin kişi; `js/yonetim.js` aralık; `js/ajanda.js` genel durak; `js/hoca.js` muhatap ve soran iptali)” → `kariyer-deneme` (2.2, 2.8L, 1.4c, 3.2, 3.2c, 3.7a, 4.2), `sezon-deneme 18 7 … --p12 sabir` (H2-0 tabanıyla), `akis-deneme` 1 3 19 21, `kontrol.py`;
  - yeni satır “Mali rapor (`js/mali-rapor.js`, `AY_BASI_EKLERI`, `nakitUfku` `haricIsId`, `js/soz.js` rapor türü, `js/ekran-dosya.js` Raporlar)” → `kariyer-deneme` (2.2, 2.8L, 4.1c, 5.1a, 5.1b), `sezon-deneme 18 3`, `akis-deneme` 1 3 21;
  - G2 satırı: “kasa paneli `js/ekran-oda.js`” yerine rapor sayfası;
  - F3 satırı: `MESAJ_KAYNAKLARI` ve okundu yerine yazışma;
  - “Maçı bitir anında” satırına perde, yarış, izlemesiz kip, `ligCanliHizli`/`dusus`, `js/mac-gunu.js` protokol → akis 14b 19 19b 20 (ikiz-deneme yalnız gerileme);
  - F7 satırına `macAyrintisi`, `arkaMacAnlik` → akis 16 19 20, `kariyer-deneme` 3.8 3.8b;
  - tek kart satırına `gorusmeOnerisi`;
  - geçiş satırına `kayit-deneme.html` ve akis 21'in s9 açılışı;
  - genel not: tarayıcı denetimleri tek yürütücüyle sırayla.
- **`kutuphane/M`:** rakip başkan karar anı kariyerde kapalı notu.
- **`araclar/plan/h3-uygulama.md`:** kayıt sürümü 11 ve `KAYIT_GECISLERI[10]`; s10 örnekleri H2 koduyla; `--kayit-yaz` H2-0'da geldi ve `@hafta=N` = N. haftanın sonuç komutundan sonra (H3-0'da yalnız `--bilesim` ve tempo kalır); `macOkundu` maddeleri düşer; `maliRapor` zinciri ay başı zinciriyle birlikte yaz ve yeni sezonda da sürer; geçiş bölümü 1.4d; akis §21 → §22; kişi kimlikleri (`kisi-18`, `kisi-19`) ve kayan karar numarası.
- **`araclar/plan/h4-uygulama.md`:** sürüm 11.
- **`araclar/plan/h2-uygulama.md`:** “Sapmalar” bölümü.

## Eleştiriden reddedilenler

- **`ligCanliHizli`'nin `mac.phase==='fulltime'` ve `MAC_GUNU.hukmen` koşulları** (eleştiri 2/1'in öneri kısmı): bizim maç biter bitmez hızlandırmak, kart açılmadan önceki sekiz saniyede Canlı Skor'un canlı akışını bozar ve izlenen maçın sonunda ana ipliği yorar. Koşul kart açıkken ya da Odaya dön beklerken genişler (`MAC_SONU.acik||MAC_SONU.bekliyor`); hükmen maçta kart zaten hemen açık olduğu için kapsanır. Sorunun kendisi (bekleme hiç bitmeyebilir) kabul edildi ve çözüldü.
- **İşçi kipinde ana ipliğin ikizi bekleyip adım atmaması** (eleştiri 2/4'ün önerilen akışı): işçi sayısı çekirdek−1 olduğu için ana iplik kendi çekirdeğinde koşar; perdede çizim yoktur; beklemek ikiz yeni başladıysa kartı geciktirir, yarış iki yolun kısasını verir. Yarış korunur, maç öncesine de genişletilir; kabul yoldan bağımsız yazıldı.
- **Yarışta ikizin kazandığı dalı sınamak için yeni TEST adres parametresi** (`&perdeButce=1`, eleştiri 3/2): yalnız deneme için yeni parametre gerekmez; anlık dal bugünkü “işçiler bittikten sonra Maçı bitir” denetimiyle sınanıyor.
- **Prototip 7'nin hatasız açılması** (eleştiri 3/14): sayfa F3'ten beri bozuk (`hocalariKur`); düzeltmesi bu turun kapsamı dışında. Bu tur yalnız yeni hata eklemediğini denetler (hata listesi `main`'dekiyle aynı).
- **Akis 20'nin portunu işletim sisteminden almak** (eleştiri 3/11'in ek önerisi): tek yürütücü kuralı yeterli; araç değişikliği gerekmez.
- **Motor denetiminde `awk` ile `index.html`'den liste çıkarmak** (eleştiri 3/8): açık dosya listesi yazıldı; aynı sonucu kabuktan bağımsız verir, sıra değişirse elle güncellenir.

## Sapmalar

(Uygulama sırasında alt adım başlıklarıyla yazılır.)

### H2-0

- **`oturum-sonu` tabanı `main` yerine dalda koşuldu** (yürütücünün adım talimatı). Gerekçe: dalın `main`'den farkı yalnız bu plan ve `araclar/sezon-deneme.js`; oyun ve motor kodu aynı, `oturum-sonu` sezon denemesini koşmaz. Sonuç: 40/40 tohum birebir, sağlık aralığı dışı 0; kabul dışı satırlar bilinen listeyle aynı (`c-1v1` eğim 14,0, `c-orta` “erken · 3–3”, `d-sut` üst köşe ≥18 m `NaN%` ve alt köşe 16 m %92,9); öbür `!` satırları `mac-deneme`'nin ilkel ve örüntü bilgi satırları (9). `!` satırları scratch'te `h2-oturum-taban.txt`'de.
- **`--kayit-yaz` ekrana iki bilgi daha basar:** sezon sonucunun varlığı ve İlerle engeli (plan yalnız anı ve açık karar türlerini istiyordu; sezon sonu örneğinin kabulünü aynı satırdan okumak için). İstenen an oynanmadıysa (`@hafta=N` sezonun haftalarında değil ya da 18 hafta oynanmadan `@sezonSonu`) “!” satırı ve çıkış 1; kayıt metni yazılamazsa (doğrulama hatası) da öyle. Yazım yalnız ilk koşudan (belirlenimcilik koşusu yazmaz).
- **Bilgi:** sezon sonu örneği 452 KB (hafta14 176 KB, ocak 271 KB; G2'nin s8 örneği 145 KB) — kayıt 18 hafta boyunca ~16 KB/hafta büyüyor (`k.maclar` ve geçmiş). Örneğin anı 2027-04-24 18:01: `@sezonSonu` sözleşme kartlarının cevapsız geçildiği döngüden sonradır.

### H2-a

- **Uygulandı, gün sonunda kullanıcının isteğiyle durduruldu (2026-10-26 akşam).** Kod ve araç değişiklikleri tamam: rakip başkan kariyerde `MAC_GUNU.protokol={rakipBaskan:'yok'}`; “Maçı bitir” perdeyle (`HIZLI_BITIR.perde`/`perdeButce`/`sonuc`, `js/arayuz.js` `frame` çizimi atlar, `#macHesap` “Maç hesaplanıyor…” örtüsü, ikiz yarışı, işçisiz yolda önce bizim maç, `ligCanliHizli`, `MAC_ARKA.dusus`, Odaya dön beklemesi `MAC_SONU.isciBekle`); TEST “Maçı izleme” (`?ekran=mac&izle=0`, `MAC_GUNU.izlemesiz`, odada `yapIzlemesiz`); README açılış yolları ve ölçülen süreler; KAPILAR satırı; `akis-deneme` 1, 14b, 19, 19b, 20 denetimleri.
- **Denetimler (geçti):** `mac-deneme 4` “sonuç aynı”; `ad-denetimi` temiz; motor dosyaları değişmedi (Sınır 5); `kariyer-deneme` çıkış 0; `oturum-sonu g1.json --ayni` 40/40, kabul dışı satırlar H2-0 tabanıyla aynı; `akis-deneme` 1, 3, 12, 14b, 16, 19, 20 geçti; `akis-2d` geçti. Koşulmayanlar: `akis-deneme` tamamı, `kontrol.py` görüntü incelemesi, `ikiz-deneme` (kapanışta).
- **Ölçülen süreler (başsız Chromium, bu masaüstü; README):** http'de işçiler bitince “Maçı bitir” anında, işçiler bitmeden ya da “Maçı izleme” ile ~17 sn; dosyadan açınca ~10–12 sn, “Odaya dön” öbür maçlar için ~40–45 sn bekler (sayfa donmaz).

### H2-b

- **Uygulandı (oto mod 4, dizüstü, Opus 5.5).** `macIstSatirlari`, `macAyrintisi` (`js/mac-okuma.js`; `macOkumaSatirlari` tek kullanıcısıyla kalktı); `macOrnek` tek `sonucKaydi()` ile `n` ve `ist` taşır, `arkaMacAnlik` (`js/lig-maclari.js`); `telMacAyrinti` ve dokunulur satırlar (`js/ekran-telefon.js`); maç telefonu sayıları tek kaynaktan, ayrıntı yalnız açık satır için (`js/ekran-mac-telefon.js`); `T.skorAc` maç kimliği (oda ve maç); kart renkleri `STIL.kagit.kartRenk`'te. Ayrıntıda bölüm başına olay yoksa tek soluk satır (“Gol yok.”, “Kart yok.”, “Sakatlık yok.”); hükmende tek not (kısa ad ve TEST).
- **Denetimler:** `kariyer-deneme` çıkış 0 (3.8, 3.8b 8/8 örnek karesi, 3.9 yeni satırları); `ad-denetimi` temiz; `mac-deneme 4` “sonuç aynı”; motor dosyaları değişmedi; `sezon-deneme 3 7` H2-0 tabanıyla skor, sıra, puan, kasa, an ve kayıt boyunda birebir (yalnız süre alanları farklı); `oturum-sonu --ayni --mac 24` (dizüstü kuralı) aşağıdaki gibi; `kontrol.py` hatasız; `akis-deneme 20` çıkış 0; `akis-deneme 16` ve `19`'un H2-b satırlarının hepsi geçti.
- **Dizüstü sapmaları (araç; davranış değişmedi):** (1) bölüm 16 ve 20'de görüntüsüz ya da doğal maç öncesinin santraya varma beklemesi 60 → 240 sn: bu makinede 60 sn'ye sığmıyor, `main`'in kodu da aynı yerde düştü (bekleme sınırı, hız ölçümü değil). (2) Bölüm 16'nın “telefon kapanınca maç aynı andan sürdü” ve “Devam: maç sürüyor” satırları bu makinede düşer: 4 sn'lik beklemede santra düdüğü daha çalmamış (maç saati 00:00); `main`'in kodu birebir aynı iki satırda düştü — makine düşüşü. (3) Bölüm 19'un elle saatli belirlenimli sayfalarında “Maçı bitir”e Playwright tıklaması zaman aşımına düştü (öğenin kararlılığını bekler, rAF elle akar; aynı bölümün “geç” sayfası bu yüzden zaten sayfa içinden tıklıyordu): “bitir” de sayfa içinden tıklanır; bu kısım H2-c'nin bölüm 19 koşusunda doğrulanır.
- **Görüntüler (Claude'un incelemesi):** `son-akis-16-canli-skor.png` (maç telefonu, ayrıntı ve 10 satır), `son-akis-19-ayrinti-dar.png` (800×600 büyük yazı, taşma yok).

## Durum (2026-10-26 akşam, kullanıcı “bitirelim, yarın devam”)

H2-0 ve H2-a dalda commit'li (`claude/h2-istekler`), dal push edildi; `main`'e alınmadı. Kalan: H2-b Canlı Skor ayrıntısı, H2-c kişiler ve yazışma (kayıt sürümü 10), H2-d mali rapor ve Kasa'nın kalkması, H2-e belgeler, inceleme ve kapanış kapıları. Yarın: `git fetch --prune --tags`, `git checkout claude/h2-istekler`, `git pull --ff-only`, H2-b'den sürülür (tabanlar scratch'teydi; gerekirse H2-0'daki komutlarla yeniden üretilir).

**2026-10-26 gece (Y0, dizüstü):** dal `main`'i aldı (`tur/y0-omurga`: yönetim omurgası belgeleri, YOL_HARITASI kararları 51–52). Bu turun kapsamı değişmedi; Kadro sekmesi, kapı sahnesi ve şablonlar Y turlarındadır. Sıra (H2 → H3 → Y1–Y5) ve kayıt sürümü zinciri (H2 10, H3 11, Y1 12) `y-program.md`'de. H2-0'ın scratch tabanları dizüstünde yok; H2-b başında H2-0'daki komutlarla bu makinede yeniden üretilir.

## Oto mod 4 planı (2026-10-26 gece, dizüstü; H2'nin kalanı)

Durum: **onaylandı (kullanıcı, 2026-10-26 gece: “H2-b'den başla, beni bekleme; kapanış denetimlerini geçerse etiketi at, main'e al ve push et”).** Plan Fable 5.1'in, uygulama Opus 5.5. Kullanıcı en az beş saat uzakta; “birkaç adım için plan çıkar, onaylarsam oto modda beni beklemeden devam et.” Bu bölüm o oto modun kapsamı, dizüstü uyarlamaları ve durma kurallarıdır; alt adımların içeriği ve kabul koşulları yukarıdaki plandır, değişmez. Uygulama Opus 5.5 (kullanıcı modeli değiştirdi); ajanlar dosya düzenler, denetimleri tek yürütücü sırayla koşar (“Çalışma biçimi”).

**Kapsam ve sıra (yalnız H2):** H2-b Canlı Skor ayrıntısı → H2-c kişiler, yazışma ve görüşme isteği (kayıt sürümü 10) → H2-d mali rapor ve Kasa'nın kalkması → H2-e belgeler, inceleme ve kapanış denetimleri. Her alt adım kendi “Kabul” listesini geçmeden commit edilmez; geçince commit edilir, `git fetch` yapılır, uzak dal ilerlememişse push edilir (ilerlemişse push yok, durulur, devam notuna yazılır; zorla push yok). Tahmin (dizüstü, denetimler masaüstünden yavaş): H2-b 2,5 sa, H2-c 4 sa, H2-d 3 sa, H2-e 2 sa; beş saatte H2-b ve H2-c beklenir, H2-d başlayabilir. **Yeni tur açılmaz:** H2 kapanırsa durulur; H3 ve Y1 kullanıcı dönünce kendi planlarıyla.

**Makine durumu (CLAUDE.md kuralı):**
1. Başta `main`'in devam notuna (öbür ağaç `../chairman-main`) “Makine durumu: dizüstü çalışıyor, dal `claude/h2-istekler` (oto mod 4, 2026-10-26 gece; H2-b'den)” satırı; commit, fetch, push (`main`'e yalnız bu satır; Pages'e belge gider). Aynı satır H2 dalının devam notunda da tutulur ve her alt adım commit'inde güncellenir (“H2-b bitti, H2-c sürüyor” gibi).
2. Bitişte (H2 kapanır ya da süre biter): dalın devam notu “Sıradaki” ve yarım iş satırıyla güncellenir, push; `main`'deki satır “boşta (dizüstü, <tarih saat>)” olur — H2 `main`'e alındıysa birleştirmeyle, alınmadıysa yalnız o satırı değiştiren küçük bir commit'le.
3. Yarım kalan alt adımın işi dalda commit'siz kalmaz: oto mod bir alt adımın ortasında kesilmez; kullanıcı dönüp durdurursa o anki alt adımın denetimi tamamlanır ya da değişiklik “WIP (H2-x, denetimsiz)” etiketli ayrı commit olarak push edilir ve devam notuna yazılır.

**Dizüstü uyarlamaları (bu makinede; masaüstü kuralları değişmez):**
- Tabanlar scratch'te yeniden üretilir, `main`'in kodu olan `../chairman-main` ağacında: `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni --mac 24` → `!` satırları `h2-oturum-taban.txt`; `sezon-deneme 18 7 --tek --teklif sat --talep onayla --p12 degisim --json`, aynısı `--p12 sabir`, `sezon-deneme 3 7 --json` → `h2-sezon-*.json`. Oturum sonu her commit öncesi `--mac 24 --ayni` ile (24/24 birebir); tur kapanışında `--seyrek` ile aynı 24 maç (40 maç masaüstünde, kapanış notuna yazılır).
- `akis-deneme.py` bölümleri ayrı ayrı koşulur (bellek notu: §11, §12, §14, §14b, §15, §15b gerçek saatli beklemelerde bu makinede düşer, §16 titreyebilir). Kural: bir bölüm burada düşüyorsa aynı bölüm `../chairman-main`'de (main'in kodu) de koşulur; orada da aynı yerde düşüyorsa makine düşüşüdür, gerileme değildir ve devam notuna yazılır; orada geçiyorsa gerilemedir, düzeltilir. Tur kapanışındaki “tamamı masaüstünde” koşusu kalır: H2 bu dizüstünde kapanırsa devam notuna “akis-deneme tamamı masaüstünde bir kez daha” borcu yazılır, `main`'e alma bunu beklemez (önceki emsal: A2a, T4h, U1).
- `akis-2d.py` ve `kontrol.py` burada `-X utf8` ile, `-I` olmadan ya da olsun fark etmez (Playwright sistem paketlerinde, Chromium yüklü); tarayıcı denetimleri birbiriyle ve ağır Node denetimleriyle aynı anda koşmaz (8 iş parçacığı; akis 20 sabit 8766 portu).
- Hız ölçümü yok (motor dosyası değişmez; `git diff --exit-code main -- <motor listesi>` her commit öncesi boş).
- `file://` ve http süreleri bu makinede ölçülür ve “dizüstü” etiketiyle yazılır; README'deki masaüstü süreleri silinmez.

**Durma ve karar kuralları:**
- Kabul listesinde olmayan bir düşüş ya da plandan sapma gerektiren bir durum çıkarsa kural: düzeltme küçük ve plan metnine uygunsa yapılır ve “Sapmalar”a yazılır; kapsamı genişletecek ya da OYUN_TASARIMI kuralını değiştirecekse yapılmaz, alt adım orada durur, soru devam notuna yazılır ve sıradaki bağımsız alt adıma geçilir (H2-d H2-c'ye bağlı değildir; H2-e hepsine bağlıdır).
- Yeni oyun içeriği yazılmaz (karar 7); eklenen her metin TEST yer tutucudur; yeni kişi yalnız yardımcı antrenör ve mali işler müdürü (karar 50). Yönetim omurgası (Y) bu turda uygulanmaz: Kadro sekmesi, kapı sahnesi, şablonlar, gündem ve tutum Y1–Y3'tedir.
- Kayıt sürümü 10 H2-c'de açılır; H2-0'ın üç sürüm 9 örneği zaten depodadır.
- `main`'e alma: **kullanıcının sözüyle** (aşağıdaki soru). İzin verilirse kapanış denetimleri geçince `tur/h2-istekler` etiketi, `main` ileri sarılır (`../chairman-main`), `main` ve etiket push edilir, dal silinir; izin yoksa etiket yerel kalır, dal push'lu bekler, kullanıcı dönünce bakar.

**Kullanıcı dönünce bulacakları:** YOL_HARITASI devam notunda alt adım alt adım ne bitti, ne yarım, hangi düşüş makine düşüşü sayıldı, ölçülen süreler; bu dosyanın “Sapmalar” ve “Durum” bölümleri; oyunda bakmak için `git checkout claude/h2-istekler` (ya da `main`'e alındıysa `main`), http'den açılış (README).

**Cevap (kullanıcı):** kapanış denetimlerini geçerse etiket atılır, `main`'e alınır ve push edilir.
