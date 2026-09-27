# Demirkapı '99 — yol haritası

Her aşama küçük adımlardan oluşur. Her adım çalışan bir sonuçla biter; bitince kutusu işaretlenir.

## Şu an neredeyiz
- [x] Görsel yön seçildi: Demirkapı '99 (FIFA 99 / PS1 dönemi).
- [x] Tek kare sahne hazır: başkan locası, dürbün, TV açısı, ayırt edilebilir oyuncular (`index.html`).
- [x] Görünüş ayarları tek dosyada toplandı (`js/stil-99.js`).
- [x] Maç motoru var (`js/mac-motoru.js`), ama '99 sahnesine bağlı değil. Retro ve 3B prototiplerde çalışıyor (`prototipler/`).
- [x] Bulutta test için kontrol aracı hazır (`araclar/kontrol.py`).

## Kararlar
- 2026-09-26: Görsel yön Demirkapı '99 (FIFA 99 / PS1 dönemi). Tüm görseller kodla üretilir.
- 2026-09-26: Ana açı başkan locası; TV yayını açısı ikinci seçenek.
- 2026-09-26: Kariyer 3. Lig'den başlar, 1. Lig ve Avrupa kupalarına uzanır; iç saha ve deplasman maçları var.
- 2026-09-26: Oyuncular uzaktan tanınır olmalı: boy, yapı ve saç farkı; belirgin numara; locadan bakarken kendi oyuncularında numara etiketi.
- 2026-09-26: Görünüş ayarları tek dosyada (`js/stil-99.js`); stil değişikliği önce oradan yapılır.
- 2026-09-27: Çalışma ortamı Claude Code bulut oturumları + GitHub (depo: github.com/frkckr/demirkapi-99); oyun GitHub Pages'ten izlenir.

## Açık kararlar
- Oyun hangi dönemde geçiyor? 90'larda mı (VAR yok), bugünde mi (VAR var, görünüm retro)?
- Hangi platform: tarayıcı, mobil, bilgisayar (Steam)?
- Kulüp ve lig isimleri tamamen kurgusal mı kalacak? (Öneri: evet.)
- Numara etiketleri tüm oyuncularda mı, yalnızca yeni transferlerde mi, yoksa başkanın seçtiği oyuncularda mı görünsün?

## Aşama 1 — Stadyum üretici
- [ ] Stadyumu tarif olarak tanımla: tribün sayısı ve boyu, çatı, pist, tel örgü, kapasite, renkler.
- [ ] Üç örnek stat: 3. Lig kasaba statı, 1. Lig şehir stadı, Avrupa arenası.
- [ ] Zemin kalitesi: kel alanlar, çamur, çizgi aşınması, biçme deseni.
- [ ] Hava ve saat: gündüz, gün batımı, gece; yağmur, kar, sis.
- [ ] Deplasman: ev sahibinin renkleri ve taraftar dağılımı.

## Aşama 2 — Maçı hareketlendir
- [ ] Maç motorunu '99 sahnesine bağla: oyuncular ve top motora göre hareket etsin.
- [ ] Loca kamerası topu takip etsin; dürbün ve TV açısı çalışsın.
- [ ] Oyuncu verisi: boy, yapı, saç, numara ve yetenek değerleri tek kayıtta dursun.

## Aşama 3 — Yönetim çekirdeği
- [ ] Kadro, transfer, bütçe.
- [ ] Lig yapısı: 3. Lig → 2. Lig → 1. Lig → Avrupa.
- [ ] Maç sonuçlarının motordan gelmesi; diğer maçların görüntüsüz hızlı oynatılması.

## Aşama 4 — Hareket
- [ ] Poz kütüphanesi ve pozlar arası yumuşak geçiş.
- [ ] Şut, pas, kafa, kayarak müdahale, kaleci uçuşu, sevinç.
- [ ] Ayakların yere düzgün basması.

## Aşama 5 — Maç sahneleri
- [ ] Sahaya çıkış ve seremoni.
- [ ] Yedek kulübesi, teknik direktör, kenarda ısınma, oyuncu değişikliği.
- [ ] İtiraz ve (karara göre) VAR incelemesi.

## Aşama 6 — Tribün
- [ ] Doluluğa göre tribün: boş koltuklar, deplasman tarafının büyüklüğü.
- [ ] Taraftar havası: gol sevinci, erken çıkış, tezahürat, koreografi.
- [ ] Sesin tribünle birlikte değişmesi.

## Aşama 7 — Ses ve yayın
- [ ] Tribün uğultusu, düdük, spiker satırları (prototiplerde örnekleri var).

## Aşama 8 — Yayına hazırlık
- [ ] Seçilen platforma göre paketleme, kayıt sistemi, ayarlar menüsü (görünüm dönemi seçimi dahil).
