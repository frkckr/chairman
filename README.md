# Chairman

Türkiye'de tek bir kurgusal futbol kulübünde, taraftarlıktan başkanlığa uzanan uzun kariyer oyunu. Yönetim ekibini kurmak, seçimlere girmek, teknik direktörü seçmek, mali kararlar almak ve baskıyla yaşamak üzerine kurulur. Nihai başarı Avrupa'nın en büyük kulüp kupası ve ardından vedadır; kariyer bu başarıya ulaşmadan da bitebilir.

**Onaylı deneyim hedefi:** Başkanın odasında gündemi öğrenmek, insanlarla görüşmek, balkondan antrenmanı izlerken gelen telefona cevap vermek ve işleri ekibe devrederek kulübü yaşamak. Günlere yayılan meseleler aynı geçmişle takip edilir; ajanda ve raporlar gerektiğinde açılır. Aydınlık kulüp ortamları ve açık renkli yönetim sunumu, mevcut '99 görsel diliyle geliştirilir. Zaman eylemlerle ilerler, okurken ve düşünürken durur; sakin dönemler önemli gelişmelere ilerleyerek geçilebilir. Bu akışın kural katmanı, aydınlık başkan odası, tavsiye/ekip, sözler/gazete ve balkon/antrenman gözlemi çalışır. Kişi modelleriyle görüşme sahneleri henüz uygulanmadı.

**Bugünkü uygulama bir 3B maç günü prototipi, kariyer temeli, başkan odası ve ilk haftadır.** Oyun başkanın odasıyla açılır; maçtan önceki hafta oynanır, her karardan sonra kaydedilir ve Cumartesi maçına gidilir. Yeni kariyer üç TEST başlangıcından biriyle kurulur; koşullara göre sayman seçimi, sponsorun erteleme talebi, saymana devir ve ödeme planı kararları oynanabilir ya da hafta sakin geçer. Tam yönetim/ekonomi, sözleşme, seçim ve sezon sistemleri tamamlanmadı; maç sonucu kariyere işlenmez. Hedef bilgisayarda Steam üzerinden oynanan bir oyundur; tarayıcı geliştirme yolu ve Windows/Electron çevrimdışı denemesi bulunur. Görseller kodla üretilir.

**Onaylı içerik yönü:** Kulübün kimliği ve geçmişi korunurken devralınan koşullar değişebilir. Yazılmış olaylar mevcut durumdan, insanlardan ve kararlardan doğar; bütün sezonun olay sırası önceden belirlenmez. Önlenen sorunlar geri zorlanmaz, iyi yönetim sakin dönem ve daha az iş yükü sağlayabilir. Bu modelin dar ilk örneği uygulandı (üç başlangıç ve ödeme sıkışması olayı); eski sabit TEST haftası yeni kariyer yolundan çıkarıldı, eski kayıtlar kaldıkları yerden sürer. P03/P13'ün dar örnekleri de çalışır; tam devralma koşulları ve kalan olay paketleri henüz yoktur. Tarihsel esinler ve içerik taslakları [olay kütüphanesindedir](OLAY_KUTUPHANESI.md).

**Ekran yenilemesi (2026-10-01; 2.8A–2.8F uygulandı):** Açılış odası dış yazı/renk kutusu/ses/çay/yazılı spiker olmadan açılır. Genel Duraklat oda, yürüyüş, gözlem, program ve maçı dondurur. Dosya, ajanda, telefon ve ayarlar açık tonlarda tek konuya odaklanır. Oda penceresi, balkon ve maç aynı kulüp stadını gösterir; balkona kapıya tıklayıp doğal bir yürüyüşle çıkılır; maçta başkan daha yüksek sırada oturur. Maç öncesinde açık tonlu program en az 10 saniye hazırlıktan sonra “Maça geç” ile kapanır. Maçta masadaki telefon Canlı Skor ve Mesajlar'ı açar; açıkken maç durur. Gerçek diğer lig maçları Aşama 3'te bağlanacak. Ayrı şehir stadının yerine mevcut stadın etaplı gelişimi Aşama 8'de, bütün ses tasarımı Aşama 10'da yapılacak. Ayrıntılar ve kabul koşulları [yol haritasında](YOL_HARITASI.md#aşama-2--yaşayan-kulüpte-günlük-başkanlık).

## Oyunu açmak

- [GitHub Pages adresi](https://frkckr.github.io/chairman/): yayınlanan sürüm için depo adresi; yerel değişiklikler otomatik olarak yayına çıkmaz.
- Yerelde depoyu indirip `index.html` dosyasını aç. Mevcut sürüm Three.js ve yazı tipini internetten yüklediği için internet bağlantısı gerekir.
- Windows masaüstü denemesi (geliştiriciler için): `masaustu` klasöründe `npm install`, sonra `npm run baslat`; paket için `node paketle.js`. Bu kopya internetsiz açılır. Kurulum, imza ve Steam bağlantısı henüz yoktur; ayrıntı [teknik plan §10](TEKNIK_PLAN.md#10-sunum-metin-ve-masaüstü).
- Eski görsel denemeler `prototipler/` klasöründedir. Güncel geliştirme kökteki `index.html` üzerinden yürür.

## Şu anda çalışanlar

- Başkan odası: oyun başkanın masasından görülen aydınlık odayla açılır. Masadaki telefon (Mesajlar: her konu bir konuşma, dönüşte “Kaldığın yer”; Canlı Skor), ajanda (gün seçici, randevular, girişimler ve sözler ayrı bölümlerde; kasa ayrı panelde) ve dosya (tek konu: kategori, “Ne oldu?”, bilinenler, karar; önceki/sıradaki dosya, sayaçlar, arşiv) gündemi açar; aynı adlı düğmeler ve 1/2/3 tuşları da çalışır. Ayarlar dört bölümdür: Görüntü ve hareket (hareket azaltma), Okuma (yazı büyüklüğü), Kayıt, Geliştirici (test bilgileri, görüntüyü kaydet). Ses yoktur (Aşama 10'a kadar). Adres sonuna `?ekran=ajanda` eklenirse eski koyu ajanda açılır.
- Genel Duraklat: odanın üst şeridindeki düğme, maçtaki Duraklat, P ya da boşluk tuşu. Duraklatınca oda, yürüyüş, antrenman gözlemi, maç programının hazırlık sayacı ve maç olduğu yerde durur; paneller okunabilir, süre harcayan komutlar kapalıdır. Ekranın üstünde küçük “Duraklatıldı” etiketi görünür.
- Balkon ve antrenman (TEST): odadaki kapıya tıklayınca (ya da 5 tuşu) başkan kalkıp balkona yürür; balkondan kulübün maçta görülen stadı gündüz görünür. Hafta içi 15:00–17:00 arasında takım sahada çalışır; istenirse 15 dakika, 30 dakika ya da sonuna kadar izlenir. İzlerken saat gerçek zamanlı akar ve her dakika kariyere işlenir (duraklatılabilir, ortasında kaydedilir). Telefon çalarsa gözlem durur, karar balkondan verilir ve gözleme devam edilir; uzun görüşme için önce gözlem bırakılır. İzlemek isteğe bağlıdır, bir şey kazandırmaz ya da kaybettirmez.
- Tavsiye ve ekip (TEST): karar verirken ilgili yöneticiden görüş istenebilir (görüş dosyaya kaynağıyla düşer), iş devredilebilir, tahsilat takibi kalıcı olarak saymana bırakılabilir; başkan saymanla nakit takvimi ve hocayla görüşmeyi kendisi başlatabilir. Koşulu varsa hocanın kamp talebi, gazetenin sorusu ve bir kulüp üyesinin destek teklifi açılır.
- Sözler ve hafıza (TEST): verilen sözler kaydedilir ve gerçek kayıtla tutulur ya da bozulur. Cuma günü gazete o haftanın olayından manşet atar; sıkışma atlatıldıysa kısa bir teşekkür gelir. Masada gazete, pencerede iskele gibi izler yalnız yaşanan olaydan doğar.
- Test bilgileri (geçici): Ayarlar > Geliştirici'deki anahtar açıkken ilgili satırlarda küçük TEST simgesi belirir; üzerine gelince ya da tıklayınca yönetici katkıları, gizli koşullar, seçeneklerin üreteceği sonuç ve futbolcu özellikleri görünür. Yayından önce kaldırılacak.
- Başkanın haftası (TEST): günün zorunlu, ertelenebilir ve isteğe bağlı işleri; işe katılma, erteleme, kaçırılacak işlerin önceden gösterilmesi; kulüp parası, bekleyen ödemeler ve yaklaşan işler; “İlerle” ile sıradaki durma noktasına gitme (boş günler geçilir; haber ve randevuda durulur), her karardan sonra otomatik kayıt ve kayıttan dönüşte “Kaldığın yer” özeti (tarayıcıda bu tarayıcıya, masaüstünde kullanıcı klasörüne). Cumartesi 19:00'da “Stada git” maç programını açar. Adres sonuna `?ekran=bulten` ya da `?ekran=mac` eklenirse oda atlanır.
- Yönetim ekibinin ilk adımı (TEST): üç koltuk (sayman, futbol şube sorumlusu, basın sözcüsü). Sayman koltuğu boş devralındıysa üç aday arasından seçim yapılır.
- Değişken başlangıç ve koşula bağlı ilk olay (TEST): yeni kariyer aynı kulüple üç başlangıçtan birini kurar (kasa dar ve sayman yok; kasada pay var; ödemeler düzenli). Sponsor taksiti ertelemek isterse sonuç o günkü kasaya bağlıdır: maaş günü kasa yetmiyorsa zorunlu karar (kendin görüş, saymana devret, bakım taksitini ertelet, maaşı beklet), yetiyorsa acil olmayan bir değerlendirme. Düzenli başlangıçta mesele açılmaz; erken teyit krizi önleyebilir. Devrin sonucu ertesi sabah, saymana ve sponsorun gerçek durumuna göre gelir; yetkisini aşan teklif başkana döner. Konu “Meseleler” panelinden, kaynağı belli “Bilinenler” ile takip edilir. Geliştirici için adres sonuna `?baslangic=sikisik|rahat|duzenli` eklenebilir (yeni kariyer kurulurken geçerlidir).
- Maç motoruna bağlı, başkanın gözünden 3B maç izleme ve isteğe bağlı dürbün.
- Sabit lig ve kadro verisiyle çalışan maç programı (açık tonlu kitapçık): kapakta karşılaşma, saat, yer ve kodla çizilmiş stat planı; ayrı sayfalarda hocanın olası 11'leri, eksikler, son maçlar ve puan durumu. “Maça geç” en az 10 saniye hazırlıktan sonra etkinleşir; geçiş yalnız oyuncunun tıklamasıyla olur.
- Maç öncesi törenler, maç, devre arası ve maç sonu akışı.
- Oyuncular, hakemler, teknik ekip, seyirciler ve maç olaylarına tepkiler.
- Tek kulüp stadı tarifi (oda penceresi, balkon ve maç aynı yapı), doluluk ve zemin ayarları. Ayrı şehir stadı kaldırıldı; gelişim ileride yatırımla olacak. Avrupa arenası henüz yoktur.
- Maçta oyuncu düğmeleri: dürbün, Duraklat, Telefon (Canlı Skor ve istatistik; T tuşu ya da masadaki telefona tıklama) ve töreni atlayan “Santraya geç”. Maç hızı, doluluk ve zemin ayarları oyun alanının altındaki kapalı “Geliştirici” alanındadır.

Mevcut kulüp adı **Demirkapı SK**. Nihai ad ve şehir ayrıca seçilecek. Ayrıntılı kod haritası [teknik planda](TEKNIK_PLAN.md).

## Belgeler

| Belge | İçerik |
|---|---|
| [OYUN_TASARIMI.md](OYUN_TASARIMI.md) | Yaşayan kulüp, meseleler, zaman/tempo, ekip, uzun kariyer ve açık tasarım konuları |
| [OLAY_KUTUPHANESI.md](OLAY_KUTUPHANESI.md) | Kaynaklı 23 tarihsel örnek, 14 olay paketi, 6 koşullu birleşim ve bağımlılıklar; P01/P03/P13'ün dar örnekleri uygulandı, diğer kapsamlar taslaktır |
| [TEKNIK_PLAN.md](TEKNIK_PLAN.md) | Mevcut mimari, ortak mesele verisi, kontrollü zaman, gün içi kayıt ve Steam hazırlığı |
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
python3 araclar/akis-deneme.py
```

İlk araç tarayıcı hatalarını ve ekran görüntüsünü kontrol etmek içindir; Python, Playwright/Chromium ve npm/tar gerektirir. İkinci araç Node.js ile maç motorunu görüntüsüz çalıştırır ve istatistiklerini raporlar. Raporun hedef dışı satırları ayrıca değerlendirilir. Üçüncü araç kariyer verisini, takvimi, para kaydını, kayıt/yüklemeyi, meseleleri, ilerlemeyi, üç başlangıcı ve olayın karar yollarını tarayıcısız dener. Dördüncü araç gerçek ekranı tıklayarak üç başlangıcı, günlük akışı, gün içi kaydı, başkan odasını, sürüm 1–4 kayıtlarının açılışını, sesin/çayın/spikerin kaldırılmasını, genel duraklatmayı, yeni dosya/ajanda/telefon/ayar ekranlarını, maç programını, ortak stat/kapı/yürüyüşü ve maç telefonunu dener. Yalnızca belge değişikliklerinde bağlantı ve tutarlılık kontrolü yapılır.

**Sıradaki geliştirme:** [yol haritası Aşama 2](YOL_HARITASI.md#aşama-2--yaşayan-kulüpte-günlük-başkanlık), **2.9 — günlük akışın sınanması**: tempo, yoğunluk ve okunabilirlik normal tempoda oynanarak değerlendirilecek. Ayrıntılı sıra ve kabul koşullarının tek kaynağı yol haritasıdır.

Aşama 1, 2.1–2.8 (2.4A dahil) ve 2.8A–2.8F tamamlandı. Bu adımların uygulama ve doğrulama kaydı yol haritasındadır. 2.3–2.4 kodu [PR #8](https://github.com/frkckr/chairman/pull/8) ile `main` dalına birleşti; 2.4A, 2.5, 2.6 ve 2.8 [PR #9](https://github.com/frkckr/chairman/pull/9), balkon/antrenman (2.7) [PR #10](https://github.com/frkckr/chairman/pull/10) ile birleşti. Tam sezon Aşama 5'te, kapsamlı adaylık hikâyesi Aşama 6'da sınanacak. Yerel değişiklik Pages dağıtımını veya masaüstü paketini güncellemiş sayılmaz.
