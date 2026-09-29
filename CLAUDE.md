# Chairman — Claude için proje talimatı

Bu dosyayı her oturumun başında oku. Oturumlar birbirini hatırlamaz; kalıcı bilgi yalnızca bu depodaki dosyalardır. Ardından `YOL_HARITASI.md` dosyasını oku: nerede kaldığımız, alınan kararlar ve sıradaki adım orada.

## Oyun
- Kulüp başkanlığı (futbol yönetim) oyunu. Oyuncu, kurgusal Demirkapı SK'nın başkanıdır.
- Kariyer 3. Lig'den başlar, 1. Lig'e ve Avrupa kupalarına uzanır. İç saha ve deplasman maçları oynanır.
- Maçlar başkanın gözünden izlenir: açık ana tribündeki başkan bölümünden, taraftarın arasından. Kapalı loca ve TV yayını açısı yoktur; dürbün isteğe bağlıdır.
- Oyun bugün geçer (VAR var), görünüm ve his 90'lar futbol nostaljisidir.
- Hedef platform bilgisayardır (Steam). Geliştirme tarayıcıda sürer; paketleme son aşamada yapılır.

## Görsel yön: '99 görünümü
- FIFA 99 / PS1 dönemi 3B görünüm. Kurallar `STIL_REHBERI.md` dosyasındadır; yeni eklenen her şey bu kurallara uyar.
- Tüm görseller kodla üretilir. Harici model, doku ya da fotoğraf dosyası kullanılmaz (bu karar açıkça değişmedikçe).
- Gerçek kulüp, oyuncu, marka ya da logo kullanılmaz. Her şey kurgusaldır.

## Mimari kuralları
- Oyun mantığı (maç motoru, yönetim, veriler) görüntüden ayrı durur. Mantık dosyalarında çizim kodu olmaz.
- Görünüşe dair her sabit `js/stil-99.js` dosyasındadır. Stil değişikliği önce bu dosyadan yapılır.
- Stadyum, oyuncu ve maç senaryosu gibi şeyler veri (tarif) olarak tanımlanır; görüntü katmanı bu tarifleri okur.
- Three.js r128 cdnjs'den yüklenir. Derleme aracı yoktur, dosyalar tarayıcıda doğrudan çalışır. `index.html` açılınca oyun görünür.
- Betikler sırayla yüklenir (bkz. `index.html`). Hepsi klasik betik; dosyalar birbirinin üst düzey tanımlarını paylaşır. Yeni dosya eklenirse doğru sıraya konur ve aynı adı iki dosyada tanımlamaktan kaçınılır.
- Oyun GitHub Pages üzerinden yayınlanır; bu yüzden `index.html` depo kökünde kalır ve dosya yolları görelidir.

## Kullanıcıyla çalışma
- Kullanıcıyla Türkçe konuş. Açıklamaları teknik olmayan, sade bir dille yap; ne değiştiğini oyunda nasıl görüneceğiyle anlat.
- Kullanıcı "düşün", "kafanda ne var" gibi bir şey sorduğunda dosyalara dokunmadan önce fikrini ve gerekçeni anlat. Soru soruyorsa önce cevap ver; açıkça istemedikçe dosya değiştirme.
- Kendin araştırabileceğin ya da kodda bulabileceğin şeyleri kullanıcıya sorma. Yalnızca gerçekten ona ait kararları sor: oyunun dönemi, platform, isimler, lisans, para harcamak gibi.
- `YOL_HARITASI.md`'deki sırayla, küçük adımlarla ilerle. Her adım çalışan bir sonuçla biter. Büyük yeniden yazım yerine mevcut kodu geliştir.
- Adım bitince:
  1. `YOL_HARITASI.md`'de maddeyi işaretle.
  2. Alınan kararları "Kararlar" bölümüne tarihle yaz.
  3. Kullanıcıya kısa bir özet ver ve sonucu nasıl göreceğini söyle: PR birleştikten birkaç dakika sonra GitHub Pages linkinde güncellenir.

## Kontrol
- Her değişiklikten sonra `python3 araclar/kontrol.py` çalıştır. Araç `index.html`'i başsız Chromium'da açar, hataları listeler ve `araclar/son-kontrol-index.png` ekran görüntüsünü alır. Görüntüye bakıp sonucun beklendiği gibi olduğunu doğrula.
- Başka bir sayfayı kontrol etmek için yolunu ver: `python3 araclar/kontrol.py prototipler/1-retro-2b-baskan-locasi.html`.
- Araç Three.js'i cdnjs yerine npm'den indirdiği yerel kopyadan yükler, çünkü bulut ortamı cdnjs'e erişemeyebilir. Depodaki dosyalar değişmez; geçici dosyaları `.gitignore` dışarıda tutar.
- Maç motoru (`js/mac-*.js`) ya da kadrolar değiştiyse ayrıca `node araclar/mac-deneme.js` çalıştır. Araç 40 maçı görüntüsüz, işlemci çekirdekleri kadar paralel oynatır (~1–2 dakika) ve istatistikleri (gol, şut, korner, taç, faul, pas…) hedef tabloyla karşılaştırır; hedef dışındaki satırlar "!" ile işaretlenir. Maç sayısı ve ilk tohum verilebilir: `node araclar/mac-deneme.js 10 5`. Aynı tohum aynı maçı verir.
