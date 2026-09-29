# Chairman

Türkiye'de tek bir kurgusal futbol kulübünde, taraftarlıktan başkanlığa uzanan uzun kariyer oyunu. Yönetim ekibini kurmak, seçimlere girmek, teknik direktörü seçmek, mali kararlar almak ve baskıyla yaşamak üzerine kurulur. Nihai başarı Avrupa'nın en büyük kulüp kupası ve ardından vedadır; kariyer bu başarıya ulaşmadan da bitebilir.

**Bugünkü uygulama bir 3B maç günü prototipi ve ona bağlanan ilk ajanda haftasıdır.** Oyun başkanın ajandasıyla açılır; maçtan önceki hafta gün gün oynanır, gün sonunda kaydedilir ve Cumartesi maçına gidilir. Seçim, yönetim ekibi ve ekonomi sistemleri henüz oynanabilir değil; maç sonucu kariyere işlenmez. Hedef bilgisayarda Steam üzerinden oynanan bir oyundur; geliştirme şu anda tarayıcıda sürer. Görseller kodla üretilir ve mevcut görünüm '99 dönemi futbol oyunlarından esinlenir.

## Oyunu açmak

- [GitHub Pages adresi](https://frkckr.github.io/chairman/): yayınlanan sürüm için depo adresi; yerel değişiklikler otomatik olarak yayına çıkmaz.
- Yerelde depoyu indirip `index.html` dosyasını aç. Mevcut sürüm Three.js ve yazı tipini internetten yüklediği için internet bağlantısı gerekir.
- Windows masaüstü denemesi (geliştiriciler için): `masaustu` klasöründe `npm install`, sonra `npm run baslat`; paket için `node paketle.js`. Bu kopya internetsiz açılır. Kurulum, imza ve Steam bağlantısı henüz yoktur; ayrıntı [teknik plan §10](TEKNIK_PLAN.md#10-sunum-metin-ve-masaüstü).
- Eski görsel denemeler `prototipler/` klasöründedir. Güncel geliştirme kökteki `index.html` üzerinden yürür.

## Şu anda çalışanlar

- Başkanın ajandası (TEST haftası): günün zorunlu, ertelenebilir ve isteğe bağlı işleri; işe katılma, erteleme, kaçırılacak işlerin önceden gösterilmesi; kulüp parası, bekleyen ödemeler ve yaklaşan işler; günü bitirme ve gün başında otomatik kayıt (tarayıcıda bu tarayıcıya, masaüstünde kullanıcı klasörüne). Cumartesi 19:00'da “Stada git” maç bültenini açar. Adres sonuna `?ekran=bulten` ya da `?ekran=mac` eklenirse ajanda atlanır.
- Yönetim ekibinin ilk adımı (TEST): üç koltuk (sayman, futbol şube sorumlusu, basın sözcüsü). Boş sayman koltuğuna üç aday arasından seçim yapılır. Geciken sponsor ödemesi başkan tarafından yürütülebilir ya da saymana devredilebilir; sonuç seçilen saymana göre değişir, yetkisini aşan konu başkana döner.
- Maç motoruna bağlı, başkanın gözünden 3B maç izleme ve isteğe bağlı dürbün.
- Sabit lig ve kadro verisiyle çalışan maç öncesi bülteni: lig durumu, form, olası 11'ler, eksikler ve son maçlar.
- Maç öncesi törenler, maç, devre arası ve maç sonu akışı.
- Oyuncular, hakemler, teknik ekip, seyirciler ve maç olaylarına tepkiler.
- Kasaba ve şehir stat tarifleri, doluluk ve zemin ayarları. Avrupa arenası henüz yoktur.
- Prototip kontrolleri: duraklatma, maça geçme, stat seçimi ve maç hızı gibi deneme araçları.

Mevcut kulüp adı **Demirkapı SK**. Nihai ad ve şehir ayrıca seçilecek. Ayrıntılı kod haritası [teknik planda](TEKNIK_PLAN.md).

## Belgeler

| Belge | İçerik |
|---|---|
| [OYUN_TASARIMI.md](OYUN_TASARIMI.md) | Onaylı oyun yönü, kariyer, seçimler, başkanlık kararları ve açık tasarım konuları |
| [TEKNIK_PLAN.md](TEKNIK_PLAN.md) | Mevcut mimari, hedef veri yapısı, kayıt, zaman ve Steam hazırlığı |
| [YOL_HARITASI.md](YOL_HARITASI.md) | Bağımlılıklara göre geliştirme sırası, kabul koşulları ve sıradaki iş |
| [STIL_REHBERI.md](STIL_REHBERI.md) | Mevcut görsel dil ve yeni sahnelerin sunum ilkeleri |
| [CLAUDE.md](CLAUDE.md) | Bütün geliştirme araçları için çalışma ve doğrulama talimatları |
| [AGENTS.md](AGENTS.md) | Araçları ortak çalışma talimatına yönlendiren giriş |

## Geliştirme kontrolleri

Çalışma kuralları ve bağımlılıklar [CLAUDE.md](CLAUDE.md) içindedir. Kod değişikliklerinde temel komutlar:

```text
python3 araclar/kontrol.py
node araclar/mac-deneme.js
node araclar/kariyer-deneme.js
```

İlk araç tarayıcı hatalarını ve ekran görüntüsünü kontrol etmek içindir; Python, Playwright/Chromium ve npm/tar gerektirir. İkinci araç Node.js ile maç motorunu görüntüsüz çalıştırır ve istatistiklerini raporlar. Raporun hedef dışı satırları ayrıca değerlendirilir. Üçüncü araç kariyer verisini, takvimi, para kaydını ve kayıt/yüklemeyi tarayıcısız dener. Yalnızca belge değişikliklerinde bağlantı ve tutarlılık kontrolü yapılır.

**Sıradaki geliştirme:** yol haritası 2.2'nin kapsamını değerlendirmek (ilk adımı uygulandı), ardından 2.3 — hoca görüşmesi ve bütçe önceliği. Aşama 1 ve 2.1 (ajanda ve kulüp durumu) tamamlandı.
