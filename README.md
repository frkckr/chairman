# Chairman

Geliştirme aşamasındaki futbol kulübü başkanlığı oyunu: Türkiye'de geçen, tek kurgusal kulüpte (bugünkü adıyla Demirkapı SK) uzun bir başkanlık kariyeri. Oyuncu başkanı yönetir; maçları başkanın locasından, '99 dönemini anımsatan kodla çizilmiş üç boyutlu bir statta izler. Maç 20 dakika sürer; maçın altındaki şeritten (ya da 1, 2, 4 tuşlarıyla) ×2 ya da ×4 hızlandırılabilir, gol, şut, faul gibi önemli anlar kendiliğinden normal hızda izlenir.

## Açmak

- Tarayıcı: depo kökündeki `index.html` dosyasını açın (Three.js ve yazı tipleri internetten yüklenir). Adres seçenekleri: `?ekran=mac` doğrudan maç, `?ekran=bulten` maç öncesi ekranı.
- Windows çevrimdışı denemesi (Electron) ve geliştirme kontrolleri [teknik planda](TEKNIK_PLAN.md#10-sunum-metin-ve-masaüstü) ve [çalışma talimatında](CLAUDE.md#kontrol) anlatılır.

## Bugün

Başkan odasıyla açılan kariyerin sistemleri (kayıt, takvim, para, mesele ve iki cevaplı kararlar) boş kabuk olarak çalışır; oyun içeriği kullanıcı tarafından yazılacaktır. Geliştirme 2026-10-07'den beri maç motorundadır: önce gerçekçilik planının turları, 2026-10-19'dan beri futbol kütüphanesinin Z turları ([FUTBOL_KUTUPHANESI §12](FUTBOL_KUTUPHANESI.md#12-program-z-turları-kullanıcı-onayı-2026-10-19-dört-düzeltmeyle)). Güncel durum, sıradaki iş ve açılış notu [yol haritasındadır](YOL_HARITASI.md#devam-notu).

## Belgeler

- [Yol haritası ve güncel durum](YOL_HARITASI.md) — iş sırası, tamamlananlar, devam notu
- [Maç motoru gerçekçilik planı](MAC_MOTORU_GERCEKCILIK_PLANI.md) — motorun turları, kabul hedefleri, gerçek futbol değerleri
- [Oyun tasarımı](OYUN_TASARIMI.md) — onaylı oyun yönü ve açık kararlar
- [Görsel ve arayüz kuralları](STIL_REHBERI.md)
- [Teknik plan](TEKNIK_PLAN.md) — mimari, motor dosyaları ve motor → çizim sözleşmesi
- [Futbol kütüphanesi](FUTBOL_KUTUPHANESI.md) — oyun zekâsının bilgi tabanı: ilkeller, hoca tarzları, ünlü örnekler, motor eşlemesi ve Z programı (ayrıntılar `kutuphane/`)
- [Olay kütüphanesi ve içerik geçişi](OLAY_KUTUPHANESI.md)
- [Ortak çalışma talimatı](CLAUDE.md) · [Araç girişi](AGENTS.md)
- [Arşiv](ARSIV.md) — ana belgelerden taşınan tarihsel notlar ve silinen dosyaların geri alınışı

Yerel değişiklik yayınlanmış sürüm anlamına gelmez; GitHub Pages ya da masaüstü paketinin güncel olduğu ayrıca doğrulanır.
