# Demirkapı '99 — yol haritası

Her aşama küçük adımlardan oluşur. Her adım çalışan bir sonuçla biter; bitince kutusu işaretlenir.

## Şu an neredeyiz
- [x] Görsel yön seçildi: Demirkapı '99 (FIFA 99 / PS1 dönemi).
- [x] Tek kare sahne hazır: ayırt edilebilir oyuncular, dürbün (`index.html`).
- [x] Maç başkanın gözünden, açık ana tribündeki başkan koltuğundan izleniyor; TV açısı, kapalı loca ve ekran seçenekleri kaldırıldı.
- [x] Görünüş ayarları tek dosyada toplandı (`js/stil-99.js`).
- [x] Maç motoru var (`js/mac-motoru.js`), ama '99 sahnesine bağlı değil. Retro ve 3B prototiplerde çalışıyor (`prototipler/`).
- [x] Bulutta test için kontrol aracı hazır (`araclar/kontrol.py`).

## Kararlar
- 2026-09-26: Görsel yön Demirkapı '99 (FIFA 99 / PS1 dönemi). Tüm görseller kodla üretilir.
- 2026-09-26: Ana açı başkan locası; TV yayını açısı ikinci seçenek. (2026-09-27'de değişti, aşağıya bak.)
- 2026-09-26: Kariyer 3. Lig'den başlar, 1. Lig ve Avrupa kupalarına uzanır; iç saha ve deplasman maçları var.
- 2026-09-26: Oyuncular uzaktan tanınır olmalı: boy, yapı ve saç farkı; belirgin numara; locadan bakarken kendi oyuncularında numara etiketi. (Numara etiketi 2026-09-27'de iptal edildi.)
- 2026-09-26: Görünüş ayarları tek dosyada (`js/stil-99.js`); stil değişikliği önce oradan yapılır.
- 2026-09-27: Çalışma ortamı Claude Code bulut oturumları + GitHub (depo: github.com/frkckr/demirkapi-99); oyun GitHub Pages'ten izlenir.
- 2026-09-27: Oyun bugün geçer; VAR var. Görünüm yine '99 tarzı.
- 2026-09-27: Hedef platform bilgisayar (Steam). Geliştirme tarayıcıda sürer, GitHub Pages test linki olarak kalır; Steam paketi son aşamada yapılır.
- 2026-09-27: Kulüp, lig, oyuncu ve marka isimleri tamamen kurgusal.
- 2026-09-27: Numara etiketi özelliği iptal; ekranda hiçbir oyuncunun üstünde etiket yok. Formadaki numaralar kalır.
- 2026-09-27: Maç başkanın gözünden izlenir. Başkan kapalı bir locada değil, açık ana tribündeki başkan bölümünde oturur; etrafında tribünler ve seyirci var. Tek açı budur; dürbün isteğe bağlı.
- 2026-09-27: TV yayını açısı iptal.
- 2026-09-27: Ekran seçenekleri (tüplü TV, renk titremesi düğmeleri) kaldırıldı. TV çerçevesi, tarama çizgileri ve kavisli köşeler yok; '99 piksel görünümü ve dönemin renkleri sabit. Ekran oranı 4:3.
- 2026-09-27: Kariyer 3. Lig'de kötü bir statta (az seyirci, kötü zemin) başlar; para harcandıkça ve başarı geldikçe stat gelişir, tribünler dolar. Grafik bu değerlere göre ayarlanabilir olmalı. Tribündeki seyirciler insan gibi görünmeli.

## Açık kararlar
- Şu an açık karar yok.

## Aşama 1 — Stadyum üretici
- [ ] Stadyumu tarif olarak tanımla: tribün sayısı ve boyu, çatı, pist, tel örgü, kapasite, renkler.
- [ ] Üç örnek stat: 3. Lig kasaba statı, 1. Lig şehir stadı, Avrupa arenası.
- [ ] Zemin kalitesi: kel alanlar, çamur, çizgi aşınması, biçme deseni.
- [ ] Hava ve saat: gündüz, gün batımı, gece; yağmur, kar, sis.
- [ ] Deplasman: ev sahibinin renkleri ve taraftar dağılımı.

## Aşama 2 — Maçı hareketlendir
- [ ] Maç motorunu '99 sahnesine bağla: oyuncular ve top motora göre hareket etsin.
- [ ] Başkanın bakışı topu izlesin (baş çevirme); dürbün çalışsın.
- [ ] Oyuncu verisi: boy, yapı, saç, numara ve yetenek değerleri tek kayıtta dursun.

## Aşama 3 — Yönetim çekirdeği
- [ ] Kadro, transfer, bütçe.
- [ ] Lig yapısı: 3. Lig → 2. Lig → 1. Lig → Avrupa.
- [ ] Maç sonuçlarının motordan gelmesi; diğer maçların görüntüsüz hızlı oynatılması.
- [ ] Stat geliştirme ve doluluğun para ve başarıya bağlanması (stadyum tarifi ve doluluk değerleri ekonomiden gelir).

## Aşama 4 — Hareket
- [ ] Poz kütüphanesi ve pozlar arası yumuşak geçiş.
- [ ] Şut, pas, kafa, kayarak müdahale, kaleci uçuşu, sevinç.
- [ ] Ayakların yere düzgün basması.

## Aşama 5 — Maç sahneleri
- [ ] Sahaya çıkış ve seremoni.
- [ ] Yedek kulübesi, teknik direktör, kenarda ısınma, oyuncu değişikliği.
- [ ] İtiraz ve VAR incelemesi.

## Aşama 6 — Tribün
- [ ] Doluluğa göre tribün: boş koltuklar, deplasman tarafının büyüklüğü.
- [ ] Taraftar havası: gol sevinci, erken çıkış, tezahürat, koreografi.
- [ ] Sesin tribünle birlikte değişmesi.

## Aşama 7 — Ses ve yayın
- [ ] Tribün uğultusu, düdük, spiker satırları (prototiplerde örnekleri var).

## Aşama 8 — Yayına hazırlık
- [ ] Steam için bilgisayar paketi, kayıt sistemi, ayarlar menüsü.
