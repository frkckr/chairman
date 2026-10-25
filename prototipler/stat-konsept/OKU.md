# prototipler/stat-konsept — stat ve çevre görsel denemeleri (2026-10-25; kapandı, seçim yok)

Oyun kodu değildir ve oyuna yüklenmez; referans olarak dalda durur. Üç bölüm:

**1. Dört konsept, tepeden (`index.html`, `konsept.js`).** Kodla üretilmiş (Three.js r128, dış varlık yok) dört çevre: 1 burun (yarımada, rıhtım,
mendirek, fener), 2 kaya çanağı (arazi yükseklik haritası, çam ormanı, dere), 3 nehir adası (köprüler, kumluklar), 4 sur içi (dört tabya, hendek,
zeytinlik); üç gelişim kademesi ve gece. `index.html?k=1..4&asama=0..2&gece=1` (klavye: 1–4, A, G). **Kullanıcı dördünü de reddetti
(yapmacık, çekiciliği yok).** Değerli kalan parça: ortak tarif genişlemesi (sıra, üst kat, çatı payı, köşe kamaları, pano katmanı; stat kendi
arsasına büyür) — tarz seçilince `js/stadyum-tarifleri.js`'e taşınabilir.

**2. Gerçekçi tek sahne (`gercekci.html`, `gercekci.js`).** Kodla ulaşılabilir çizginin üst sınırını göstermek için: eğik kamera, fiziksel
malzeme, güneş gölgesi, gökyüzü ortam haritası, üretilmiş dokular ve normal haritaları, koltuk ve seyirci örnekleri, oluklu çatı, kafes direk,
kayalık kıyı, fener, tekneler; sonrası-işleme tarayıcıda 2D tuvalde (derinlik karartması, bloom, vinyet, isteğe bağlı 960×720 retro ızgara).
`gercekci.html?asama=1&saat=aksam&son=retro` (`post=0` işlemesiz, `derinlik=1` derinlik karesi). Kullanıcı karar bildirmedi; tarz tartışması
`araclar/plan/ui-mimari-ve-gorsel-yon.md`.

**3. Araçlar.** `yakala.py` başsız Chromium'da görüntü alır (`python -X utf8 prototipler/stat-konsept/yakala.py k=2 asama=2` ya da
`sayfa=gercekci asama=1 w=2560 h=1920 son=retro`), çıktı `cikti/` (Git dışı). `retro.py` ve `post.py` numpy ister (makinede yok; işleme bu
yüzden sayfanın içinde). `lib/` three r128 `examples/js` sonrası-işleme kopyaları (MIT); yazılım WebGL'de EffectComposer yolunda normal
haritalı yüzeyler çizgilendiği için kullanılmıyor, doğrudan çizim temiz.

Eksenler oyundaki gibi: ana tribün ekranın altında, +x ekranın solunda (js/kamera.js tepeKamera).
