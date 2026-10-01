# Chairman — proje çalışma talimatı

Bu talimatlar bütün geliştirme araçları için geçerlidir. Kalıcı proje bilgisi depodaki belgelerdir.

## Okuma sırası ve bilgi kaynakları

Oturum başında bu dosyayı, ardından [YOL_HARITASI.md](YOL_HARITASI.md) ve [STIL_REHBERI.md](STIL_REHBERI.md) dosyalarını oku. Oyun davranışı veya içerik çalışmadan önce [OYUN_TASARIMI.md](OYUN_TASARIMI.md), kod veya mimari çalışmadan önce ayrıca [TEKNIK_PLAN.md](TEKNIK_PLAN.md) içindeki ilgili bölümleri oku.

Başlangıç, olay veya karar içeriği üzerinde çalışırken ayrıca [OLAY_KUTUPHANESI.md](OLAY_KUTUPHANESI.md) dosyasındaki ilgili paketleri ve durum/bağımlılık tablosunu oku. Katalogdaki her fikir uygulanacak sıradaki iş değildir.

- [README.md](README.md): projenin kısa tanıtımı, bugün çalışanlar ve açılış bilgileri.
- OYUN_TASARIMI: onaylı oyun yönü, tasarım ilkeleri ve açık ürün kararları.
- TEKNIK_PLAN: mevcut mimari, hedef altyapı ve teknik kabul koşulları.
- YOL_HARITASI: iş sırası, bağımlılıklar, tamamlanma durumu ve sıradaki adım.
- STIL_REHBERI: mevcut görsel dil ve yeni sahnelerin sunum kuralları.
- OLAY_KUTUPHANESI: kaynaklı tarihsel esinler, kurgusal olay paketleri ve koşula bağlı birleşim örnekleri. Oyun ilkeleri OYUN_TASARIMI'nda, geliştirme sırası YOL_HARITASI'nda kalır.

Bir kararın ayrıntısını tek belgede tut, diğerlerinden bağlantı ver. Bugün çalışan özellik, onaylı hedef, uygulama önerisi ve açık karar birbirinden ayrılmalıdır. Kullanıcının güncel açık kararı önceliklidir; açık kararları sessizce kesinleştirme.

## Oyun yönü

- Türkiye'de geçen, tek kurgusal kulüpte uzun bir başkanlık kariyeri. Taraftarlıktan adaylığa, başkanlığa, seçim kaybında kulübü dışarıdan takip etmeye ve yeniden adaylığa uzanır.
- Başarılı final, Avrupa'nın en büyük kulüp kupasını kazanıp görevi bırakmaktır. Kupa kazanılmadan da kariyer bitebilir. Ayrıntılar OYUN_TASARIMI'ndadır.
- Oyuncu başkanı yönetir; teknik direktörün kadro ve saha kararları ona aittir. Futbolcu ve teknik direktör yetenek puanları kullanıcıya gösterilmez. Geçici istisna (kullanıcı kararı, 2026-09-30): geliştirme aşamasında “Test bilgileri” ayarı açıkken gizli değerler görünür (`js/test-gorunum.js`); yayından önce kaldırılacaktır, nihai kural değişmez. Uzun satır içi TEST kutuları 2.8A/2.8C'de küçük simgeyle açılan bilgi kutusuna taşındı; ayrıntı STIL_REHBERI §7'dedir.
- Onaylı günlük deneyim (2026-09-30): aydınlık kulüp mekânlarında tek meseleye odaklanma; gerektiğinde açılan telefon/ajanda; tavsiye ve yetki devri; eylemle ilerleyen, okurken duran zaman. Kurallar OYUN_TASARIMI, sunum STIL_REHBERI içindedir. Süre aralıkları ölçüm hedefidir, kesin denge değildir.
- Onaylı yenileme (2026-10-01; 2.8A–2.8F uygulandı): Açılış oda olarak kalır. Dosya/ajanda/telefon/ayarlar açık tonlarda tek konuyla ilgilenmeyi sağlar; dış prototip açıklamaları, renk kutuları, çay ve yazılı maç spikeri kaldırılır. Genel Duraklat bütün sahne hareketi ve süreleri dondurur; maç telefonu açıkken maç durur, kapatılması elle duraklatmayı kaldırmaz. Ayrı şehir stadı kaldırılır; oda/balkon/ev sahibi maçı aynı stat tarifini kullanır, gelişim yatırım etaplarıyla olur. Kapıya tıklama, doğal kalkış/adımlar, yüksek başkan koltuğu ve en az 10 saniye hazırlıktan sonra kullanıcıyla geçilen açık maç programı hedeflenir. Ayrıntı OYUN_TASARIMI §2/6/11, STIL_REHBERI §5–8 ve TEKNIK_PLAN §4/10'dadır.
- Ses kararı (2026-10-01): Ses sistemi, çağrıları ve ayarları 2.8A'da kaldırıldı. Ana oyun ve ekranlar tamamlanıp Aşama 10'daki ses tasarımına gelinene kadar hiçbir yerde ses ekleme veya tasarlama. Eski erken ortam sesi kabul koşulları geçersizdir; tarihli uygulama kayıtları bugünkü kodu anlatır.
- Onaylı içerik yönü (2026-09-30): sabit kulüp kimliği/geçmişi, tutarlı fakat değişken devralma koşulları, mevcut dünyadan ve kararlardan doğan yazılmış olaylar, sınırlı adil belirsizlik ve kalıcı hafıza. Sezonun olay sırası başlangıçta yazılmaz; paket birleşimleri zorunlu hikâye yolları değildir. Önlenen sorun geri zorlanmaz, iyi yönetim sakin dönem ve daha az iş yükü sağlayabilir. Ayrıntı OYUN_TASARIMI §3 ve §10'dadır; yalnız dar ilk örneği kodda uygulandı (2.4A).
- Mevcut uygulama; 3B maç günü, kariyer/takvim/para/kayıt temeli, ilk ajanda haftası, üç TEST başlangıcı, koşula göre açılan ödeme sıkışması olayı (sayman seçimi, devir, ödeme planı), konunun mesele olarak takibi, “İlerle” ile durma noktalarına ilerleme, gün içi karar kaydı ve oyunun açılış ekranı olan aydınlık başkan odasıdır (telefon, ajanda, dosya; `?ekran=ajanda` eski koyu ajanda). Genel Duraklat (`js/sunum-durumu.js`), gerçek zamanlı gözlem, tek konu dosya/ajanda/telefon/ayar ekranları, tek kulüp stadı (`statKur`; oda penceresi, balkon ve maç), tıklanan kapı ve doğal yürüyüş, açık tonlu maç programı ve maç telefonu çalışır (2.8A–2.8F). Eski sabit sponsor içeriği yalnız eski kayıt uyumu için durur (`js/uyum-sponsor.js`). Maç sonucu kariyere bağlı değildir. Üstünde tavsiye, yetki devri, kalıcı sorumluluk ve girişim; hoca talebi, gazetenin sorusu ve koşullu destek örnekleri; söz kaydı, Cuma gazetesi ve odadaki izler çalışır (2.6, 2.8). Odadan balkona yürüme, antrenman gözlemi ve gözlem sırasında telefon çalışır (2.7). Kişi modelleriyle görüşme sahneleri henüz hedeftir.
- Mevcut kulüp adı Demirkapı SK'dır; nihai isim ve şehir açık karardır. Türkiye gerçektir; kulüpler, kişiler ve markalar kurgusaldır. İlk içerik dili Türkçedir.

## Mevcut kod ve mimari

- Oyun mantığı, veriler ve görüntü ayrı tutulur. Mantık dosyalarında çizim kodu olmaz.
- Mevcut maç motorunu koruyarak küçük adımlarla ilerle. Kariyer ile motor arasına açık bir veri bağlantısı kur; yönetim sistemlerini sahne dosyalarına yığma.
- Ortak görsel ayarlar `js/stil-99.js` üzerinden yönetilir (oda renkleri `STIL.oda`, açık arayüz paleti `STIL.kagit`, maç programı `STIL.program`). Ekranlar kural içermez; oda ve ajanda aynı oturumu (`js/oyun-oturumu.js`) ve aynı kariyer komutlarını kullanır. Dağınık görsel sabitler değiştirildikçe uygun yere taşınır. Stadyum ve maç günü gibi içerikler tariflerden okunur.
- Three.js r128 bugün CDN'den yüklenir. Derleme aracı yoktur. Betikler `index.html` içinde sırayla yüklenen klasik betiklerdir; yükleme sırasını ve paylaşılan üst düzey adları kontrol et. Blok içindeki `function` bildirimleri de global'e sızar (bir `ilerle` çakışması yaşandı); Node denemeleri arayüz betiklerini yüklemediği için çakışmayı yalnız tarayıcı denemesi yakalar.
- Kayıt/yükleme ve Windows/Electron çevrimdışı masaüstü denemesi yapılmıştır; oyun her tamamlanan karardan sonra kaydeder (maç sınırı hariç) ve dönüşte “Kaldığın yer” özetini gösterir. Modül veya paketleme değişikliği somut gereksinime göre yapılır; motor değişikliği varsayılmaz.
- Tarayıcı prototipinde `index.html` depo kökünde, yollar göreli kalır. Steam hedefi için platform işlemleri oyun mantığından ayrılır.
- Mevcut '99 görsel dili referanstır. Tüm oyun görselleri kodla üretilir; harici model, doku veya fotoğraf kullanımı ayrıca kararlaştırılmalıdır. Reddedilen görsel konseptler uygulanmaz.

## Kullanıcıyla çalışma

- Türkçe ve sade anlat. Değişikliğin oyundaki karşılığını, doğrulama sonucunu ve önemli sınırlamasını belirt.
- Fikir veya plan talebi dosya değiştirme izni değildir. Kullanıcının onayladığı kapsamı uygula; belge onayı kendiliğinden oyun kodu geliştirme izni sayılmaz.
- Depodan öğrenilebilecek şeyleri kullanıcıya sorma. Gerçek tercih ve kapsam kararlarını gerektiğinde sor.
- İşe başlamadan Git durumunu kontrol et, mevcut kullanıcı değişikliklerini koru. İstenmeden commit, push veya yayın yapma.
- Yol haritasındaki sırayla, küçük ve doğrulanabilir adımlarla ilerle. Yalnızca tamamlanan ve kontrol edilen maddeleri işaretle. Yeni kararları ilgili ana belgeye, yön değişikliklerinin tarihli özetini yol haritasına yaz.
- Güncel öncelik yaşayan kulüpte günlük başkanlıktır. Tam sezon, kapsamlı adaylık hikâyesinden önce sınanır. Sıradaki somut iş ve bütün bağımlılıklar YOL_HARITASI'nda tutulur; bu kısa özet ikinci bir iş listesi değildir.
- Sonraki işi planlarken yol haritasının güncel “Sıradaki geliştirme” bölümünü esas al. Yeni içerik, mevcut mesele/takvim/para/kayıt temelini kullanır; bütün olay kataloğunu veya büyük bir hikâye motorunu tek adımda uygulama. Eski sabit oyuncu içeriği doğrulanmış yeni akışla değiştirilir; eski kayıt uyumluluğu ve test örnekleri bu temizlikte korunur.
- 2026-10-01 yenilemesinde 2.8A–2.8F tamamlandı; sıradaki iş **2.9**'dur; tamamlanan eski adımlar geri açılmaz. Ekran/mekân çalışmasında STIL_REHBERI'nin onaylı düzenlerini ve TEKNIK_PLAN'ın yenileme/duraklatma sınırlarını birlikte oku. Gelecek telefon/program kabulü ilgili adımda tamamlanır. Görevlerin ayrıntılı sırası ikinci bir liste olarak burada tutulmaz.
- Yerel değişiklik, yayınlanmış değişiklik değildir. Doğrulanmadan GitHub Pages veya Steam sürümünün güncellendiğini söyleme.

## Kontrol

### Yalnızca belge değişikliği

Yerel bağlantıları, mevcut durum ile hedef ayrımını, belgeler arası tutarlılığı ve `git diff --check` sonucunu kontrol et. Değişen dosyaların onaylı kapsamda kaldığını doğrula. Oyun kodu değişmediyse tarayıcı ve maç simülasyonu çalıştırmak gerekmez.

### Oyun kodu veya görsel değişikliği

- `python3 araclar/kontrol.py` çalıştır. Araç sayfayı başsız Chromium'da açar, hataları ve `araclar/son-kontrol-index.png` ekran görüntüsünü üretir. Görüntüyü incele; yalnızca komutun bitmesini başarı sayma.
- Başka bir sayfa için yolu ver: `python3 araclar/kontrol.py prototipler/1-retro-2b-baskan-locasi.html`.
- Araç Python, Playwright/Chromium ve yerel Three.js kopyasını hazırlamak için npm/tar gerektirir. Three.js kontrol sırasında yerel kopyadan yüklenir; geçici dosyalar Git dışında tutulur. Eksik bağımlılık varsa bildir; eşdeğer kontrol kullanıldıysa ne yapıldığını açıkla.
- Maç motoru (`js/mac-*.js`) veya kadrolar değişirse ayrıca `node araclar/mac-deneme.js` çalıştır. Varsayılan 40 maçtır. Hedef dışındaki `!` satırlarını değerlendir; başarılı çıkış kodu tek başına denge onayı değildir.
- `node araclar/mac-deneme.js 10 5` gibi küçük denemeler hızlı inceleme içindir; tam örneklem yerine geçtiğini söyleme. Aynı başlangıç verisi ve tohumla tekrarlanabilirlik korunmalıdır.
- Kariyer verisi veya kuralları (`js/kariyer*.js`, `js/takvim.js`, `js/maliye.js`, `js/ajanda.js`, `js/mesele.js`, `js/yonetim.js`, `js/uyum-sponsor.js`, `js/olay.js`, `js/paket-*.js`, `js/soz.js`, `js/gozlem.js`, `js/test-gorunum.js`, `js/baslangic.js`, `js/oyun-oturumu.js`, `js/kayit.js`) değişirse `node araclar/kariyer-deneme.js` çalıştır; `!` satırı veya sıfır dışı çıkış kodu başarısızlıktır. Tarayıcı deposu (`js/depo-tarayici.js`) veya kayıt biçimi değişirse ayrıca `python3 araclar/kontrol.py araclar/kayit-deneme.html` çalıştır.
- Ekran (`js/ekran-oda.js`, `js/oda.js`, `js/balkon.js`, `js/ekran-ajanda.js`, `js/ekran-mac-oncesi.js`, `js/baskan.js`, `js/arayuz.js`, `js/sunum-durumu.js`, `js/ekran-mac-telefon.js`, `js/stadyum.js`, `js/stadyum-tarifleri.js`), duraklatma, ses kaldırma yolları, kayıt oturumu, yeni üst düzey adlar veya `index.html` yükleme sırası değişirse ayrıca `python3 araclar/akis-deneme.py` çalıştır ve `araclar/son-akis-*.png` görüntülerini incele. Araç gerçek ekranı tıklar, üç başlangıcı `?baslangic=` parametresiyle kurar, sayfayı yeniler ve `araclar/ornekler/` altındaki sürüm 1–4 kayıtları açar. Başlangıç, olay paketi veya karar içeriği değişirse kariyer ve akış araçlarını birlikte çalıştır. Yeni ekran/etkileşim senaryoları araçta yoksa ilgili adımın gerçek davranışını ayrıca doğrula; sesin kaldırılması eski ses kontrolüne takılmadan gerçekten sessiz kaldığı ve çağrı hatası üretmediği için sınanır.
- Masaüstü katmanı (`masaustu/`, `js/depo-masaustu.js`), `index.html`'in dış bağlantıları veya kayıt biçimi değişirse `masaustu` klasöründe `npm install` sonrası `node deneme.js` çalıştır; paket etkileniyorsa `node paketle.js && node deneme.js --paket`. Üretilen `masaustu/cikti/deneme*/oyun.png` ve `mac-gunu.png` görüntülerini incele. Araç Windows ve Electron indirmesi gerektirir; `masaustu/oyun/` ve `masaustu/cikti/` Git dışındadır.
- Kariyer sistemleri eklendikçe para, takvim, bir kez uygulanması gereken sonuçlar, kayıt/yükleme ve uzun kariyer tutarlılığı ilgili değişikliğin riskine göre sınanır. Kabul koşulları TEKNIK_PLAN ve YOL_HARITASI'ndadır.
