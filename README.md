# Chairman

Geliştirme aşamasındaki futbol kulübü başkanlığı oyunu: Türkiye'de geçen, tek kurgusal kulüpte (bugünkü adıyla Demirkapı SK) uzun bir başkanlık kariyeri. Oyuncu başkanı yönetir; maçları Football Manager'daki gibi tepeden 2D izler — numaralı pullar, '99 dönemini anımsatan kodla çizilmiş kompakt bir kasaba stadı. Maç 20 dakikalık oyun saatidir (×1'de ~28 dakika); maçın altındaki şeritten (ya da 1, 2, 4 tuşlarıyla) ×2 ya da ×4 hızlandırılabilir, gol, şut, faul gibi önemli anlar kendiliğinden normal hızda izlenir. Z tuşu yakınlığı değiştirir. Figürlü üç boyutlu oyuncular antrenman sahneleri içindir.

## Açmak

- Tarayıcı, http üzerinden (birincil yol): GitHub Pages'teki yayın (`main`'in yayını) ya da depo kökünde `python -m http.server` çalıştırıp `http://127.0.0.1:8000/` adresi (Three.js ve yazı tipleri internetten yüklenir). Haftanın öbür maçları ve bizim maçın sonuç ikizi yalnız http'de arka planda (Web Worker) hesaplanır: işçiler bittikten sonra (maç sayfası açıldıktan ~20 sn sonra) “Maçı bitir” sonucu hemen gösterir; daha önce basılırsa ya da TEST “Maçı izleme” ile sonuç ~17 sn'de gelir.
- Dosyadan açmak (`index.html`'e çift tıklamak) ikinci yoldur: tarayıcı dosyadan açılan sayfada Web Worker çalıştırmaz, maçlar sayfanın içinde hesaplanır. “Maçı bitir” ya da “Maçı izleme” sonucu ~10–12 sn'de gelir; “Odaya dön” öbür yedi maçı ~40–45 sn bekler (sayfa donmaz). Kayıt adrese bağlıdır: tarayıcı deposu adres başına ayrıdır, dosyadan açılan oyunun kaydı http adresinde görünmez (tersi de).
- Süreler bu masaüstünde başsız Chromium'da ölçüldü (H2-a, 2026-10-26; `araclar/akis-deneme.py` 19, 19b, 20); başka makinede ve gerçek tarayıcıda farklı olabilir. Adres seçenekleri: `?ekran=mac` doğrudan maç, `?ekran=bulten` maç öncesi ekranı, `?pul=0` geliştirme için figürlü loca bakışı (TEST; maçta G tuşu).
- Windows çevrimdışı denemesi (Electron) ve geliştirme kontrolleri [teknik planda](TEKNIK_PLAN.md#10-sunum-metin-ve-masaüstü) ve [çalışma talimatında](CLAUDE.md#kontrol) anlatılır.

## Bugün

Başkan odasıyla açılan kariyerin sistemleri (kayıt, takvim, para, mesele ve iki cevaplı kararlar) boş kabuk olarak çalışır; oyun içeriği kullanıcı tarafından yazılacaktır. Geliştirme 2026-10-07'den beri maç motorundadır; hedef zeki, atak zihniyetli ve izlenebilir bir 2D futbol ile sahada görünen oyuncu farkıdır. Program [FUTBOL_KUTUPHANESI §12](FUTBOL_KUTUPHANESI.md#12-program)'de; güncel durum, geçerli kararlar, sıradaki iş ve açılış notu [yol haritasındadır](YOL_HARITASI.md#devam-notu).

## Belgeler

- [Yol haritası](YOL_HARITASI.md) — iş sırası, geçerli kararlar, devam notu, tamamlanan turlar ve silinen dosyaların geri alınışı
- [Oyun tasarımı](OYUN_TASARIMI.md) — onaylı oyun yönü ve açık kararlar
- [Görsel ve arayüz kuralları](STIL_REHBERI.md)
- [Teknik plan](TEKNIK_PLAN.md) — mimari, motor dosyaları ve motor → çizim sözleşmesi
- [Maç motoru: ilkeler, kurallar ve kararlar](MAC_MOTORU_GERCEKCILIK_PLANI.md) — bağlayıcı ilkeler, geçerli kararlar, gerçek futbol değerleri
- [Futbol kütüphanesi](FUTBOL_KUTUPHANESI.md) — oyun zekâsının bilgi tabanı, ölçüler, “idare eder” kapısı ve program (ayrıntılar `kutuphane/`)
- [Olay kütüphanesi](OLAY_KUTUPHANESI.md) — tarihten esinler ve kurgusal olay paketleri
- [Ortak çalışma talimatı](CLAUDE.md) · [Araç girişi](AGENTS.md) · [Denetim kapıları](araclar/KAPILAR.md)

Kapanmış işlerin ayrıntılı kaydı git etiketlerindedir (`git tag -n9 'tur/*'`). Yerel değişiklik yayınlanmış sürüm anlamına gelmez; GitHub Pages ya da masaüstü paketinin güncel olduğu ayrıca doğrulanır.
