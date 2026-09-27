# Demirkapı '99

Kulüp başkanlığı oyunu. Kurgusal Demirkapı SK'nın başkanı olarak 3. Lig'den Avrupa kupalarına uzanan bir kariyer. Maçlar başkanın gözünden, açık tribündeki başkan koltuğundan, 90'ların futbol oyunlarını hatırlatan bir görünümle izlenir. Tüm görseller kodla üretilir.

## Oyunu açmak
- **GitHub Pages açıksa:** `https://frkckr.github.io/demirkapi-99/`
- **Pages yoksa:** Bu sayfada **Code → Download ZIP** ile indir, zip'i aç, `index.html`'e çift tıkla. İnternet bağlantısı gerekir; 3B kütüphanesi ve yazı tipi internetten yüklenir.
- Eski denemeler `prototipler/` klasöründe: retro 2B sahne (maç motoru çalışıyor), 3B sahne ve '99 tek karenin ilk hali.

## Dosyalar
| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Açılış sayfası: '99 sahnesi, başkanın gözünden görünüm, dürbün |
| `CLAUDE.md` | Claude'un her oturumda okuduğu proje talimatı |
| `STIL_REHBERI.md` | Görsel kurallar |
| `YOL_HARITASI.md` | Yapılacaklar, alınan ve bekleyen kararlar |
| `js/stil-99.js` | Görünüşe dair bütün ayarlar: renkler, çözünürlük, kameralar |
| `js/stadyum-tarifleri.js` | Stat tarifleri (3. Lig kasaba, 1. Lig şehir, Avrupa arenası) ve maç günü doluluğu; yalnızca veri |
| `js/goruntu.js` | Ekran, renk titremesi, ışık, gökyüzü |
| `js/stadyum.js` | Seçili tarife göre stadı kurar: zemin, tribünler, reklam panoları, projektörler, kaleler |
| `js/seyirci.js` | Tribündeki insanlar: doluluğa göre koltuklara oturur, iki kareyle sallanır |
| `js/oyuncular.js` | Oyuncu modelleri, pozlar, top |
| `js/efektler.js` | Meşale ve duman |
| `js/arayuz.js` | Kamera, dürbün, düğmeler, çizim döngüsü |
| `js/ortak.js` | Ortak araçlar: piksel yazı, kulüpler, Türkçe ekler |
| `js/mac-motoru.js` | Maç motoru (henüz '99 sahnesine bağlı değil) |
| `araclar/kontrol.py` | Sayfayı görünmez bir tarayıcıda açıp hata ve ekran görüntüsü kontrolü yapar |
| `AGENTS.md` | Codex gibi başka araçları `CLAUDE.md`'deki talimatlara yönlendirir |

## Claude ile çalışma döngüsü
1. [claude.ai/code](https://claude.ai/code) adresinde yeni oturum aç. Depo olarak `demirkapi-99`'u, dal olarak `main`'i seç.
2. Ne istediğini yaz. Büyük işlerde **Plan** modunu seç; Claude önce ne yapacağını anlatır ve onayını bekler.
3. Claude bitirince değişiklikleri ayrı bir dala gönderir. Değişiklik göstergesine (`+42 -18` gibi) tıklayıp bak, sonra **Create PR** de.
4. GitHub'da açılan PR sayfasında **Merge pull request → Confirm merge** de.
5. Birkaç dakika sonra oyun linkinde yeni hali görürsün.

**Önemli:** Yeni oturum açmadan önce bir önceki PR'ı birleştir. Her oturum `main` dalından başlar; birleştirilmemiş iş yeni oturumda görünmez. Aynı işe devam edeceksen aynı oturumda yazmaya devam edebilirsin.

Oturumlar birbirini hatırlamaz. Kalıcı olan her şey bu depodaki dosyalardır; alınan kararlar `YOL_HARITASI.md`'ye yazılır.

## Örnek mesajlar
- **İlk oturum:** "Merhaba! Bu depo, kulüp başkanlığı oyunum Demirkapı '99'un başlangıç paketi. Önce CLAUDE.md, STIL_REHBERI.md ve YOL_HARITASI.md dosyalarını oku, sonra kodu incele. Ardından projenin şu anki durumunu bana sade bir dille kısaca özetle ve YOL_HARITASI'ndaki açık kararları tek tek sor. Şimdilik hiçbir dosyayı değiştirme."
- **Kararlardan sonra:** "Kararlarımı YOL_HARITASI.md'ye yaz. Sonra Aşama 1'in ilk adımına başla: stadyum tarifini kur ve 3. Lig kasaba statını üret."
- **Maçı hareketlendirmek:** "Aşama 2'ye geç: mac-motoru.js'i '99 sahnesine bağla, başkanın bakışı topu izlesin."
- **Sadece fikir almak:** "Kalecinin uçuşunu nasıl daha akıcı yapabiliriz? Önce düşün, dosyalara dokunma."

## Oyun linki (GitHub Pages)
Depoda **Settings → Pages** → Build and deployment altında **Deploy from a branch** → dal `main`, klasör `/ (root)` → **Save**. Birkaç dakika sonra link aynı sayfanın üstünde görünür. Public depoda ücretsizdir; Private depoda ücretli GitHub Pro gerekir.

## Başka bir Claude hesabından devam etmek
Her şey bu depoda durduğu için hesap değiştirmek hiçbir şeyi kaybettirmez.
1. Yeni Claude hesabı Pro, Max, Team ya da Enterprise planında olmalı; ücretsiz planda bulut oturumları yok.
2. [claude.ai/code](https://claude.ai/code) adresinde GitHub ile bağlan. Claude GitHub App'i kurmayı önerirse kabul et ve bu depoyu seç.
3. Yeni oturumda depoyu seç ve kaldığın yerden devam et.

## Başka bir yapay zekâ aracıyla devam etmek
Codex gibi araçlar `AGENTS.md` dosyasını okur; o da onları `CLAUDE.md`'deki talimatlara yönlendirir. Depoyu o araca bağlaman yeterli.
