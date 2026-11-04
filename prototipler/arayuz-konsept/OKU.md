# Arayüz konsepti — önizleme (2026-11-04)

Oyun kodu değildir; oyuna dokunmaz. Tartışma ve tespitler: [araclar/plan/arayuz-inceleme.md](../../araclar/plan/arayuz-inceleme.md).

## Açmak

Yerel sunucu açıkken (`.claude/launch.json` › `chairman-yerel`, 8765) tarayıcıda:

    http://127.0.0.1:8765/prototipler/arayuz-konsept/index.html

Dosyadan çift tıklayarak da açılır (veri `veri.js` içinde, sunucu gerekmez). Yazı tipleri Google Fonts'tan gelir.

## Üstteki gri çubuk (oyunun parçası değil)

| Seçenek | Ne gösterir |
|---|---|
| Görünüm: Koyu (CM) / Kâğıt | İçerik alanının dili. Koyu: lacivert yarı saydam paneller, sarı başlık, beyaz yazı, arkada soluk oda (CM'nin fotoğraflı arka planı gibi). Kâğıt: krem panel, mürekkep yazı, düz zemin. Çerçeve (sol şerit, sekme satırı) ikisinde de lacivert. |
| Menü: Düğme / Düz | Sol şeridin düğmeleri. Düğme: kabartmalı dikdörtgen, seçili sarı. Düz: CM'nin metin menüsüne yakın, seçili solda sarı çizgi. |
| Geçiş: Anında / Kayma / Solma | Menü ve sekme değişince içerik nasıl gelir. Başlık ve şerit hiç kıpırdamaz. |
| Kare: Pencereyi doldur / 4:3 | Ekranlar pencereyi doldurur ya da bütün oyun 4:3 kalır. |
| Düzen: 1 / 2 | Haberler, Lig › Puan durumu, Finans › Durum, Kulüp › Kadro ve Transfer › Durum için iki ayrı yerleşim. |
| Saat: 14:30 / 23:40 | Gündüz ve gece. Gece: tarih kutusu koyu, ekip ulaşılamaz (menajer açar), Çağır yarına kalır, sabah 10:00'da başlanır. |
| Not | O ekranın kısa açıklaması. |

Adres çubuğu seçimi tutar (`#g=kagit&b=lig&dz=2` gibi); bir görünümü yer imi olarak saklamak mümkün.

## Ekranlar

Ofis · Haberler · Kulüp (Kadro, Teknik ekip, Sözleşmeler, Stat ve tesis, İlişkiler) · Finans (Durum, Raporlar, Müdürlük, Bütçe) · Lig (Puan durumu, Fikstür, Gol krallığı, İstatistik, Kulüpler) · Transfer (Durum, Hedefler, Ara, Teklifler, Geçmiş) · Ajanda (Hafta, Ay) · Telefon · Gazete · Balkon (yalnız açıklama). Alt sayfalar: kulüp sayfası (başlık o kulübün renginde), oyuncu sayfası (bizim oyuncuda sicil fişi), maç sayfası (Demirkapı maçında; başlık iki kulübün renginde).

Tuşlar: 1–9 ve 0 şeritteki sırayla bölümler · `[` `]` sekme · Esc bir üst seviye · Backspace geri · Haberler'de N sonraki okunmamış · kart açıkken ← → bak, Enter ver (kart sürüklenerek de verilir).

## Kararları gösteren yerler (karar 91, 2026-11-04)

- **Görüşme sahnesi ve kartla akan saat:** Kulüp › Teknik ekip'te “Çağır” (Tahsin, Şükrü Hoca), Finans › Müdürlük'te “Çağır” (Nusret Bey), Transfer › Teklifler'de “Ara” (Kocadere başkanı: ilk arama açılmaz, 20 dk sonra geri arar) ve “Git” (Karaova'nın ofisi: yol 90 dk, dört kart). Her kart kendi dakikasını ekler; şeritteki saat ve günün doluluğu ilerler; sahne bitince özet ve Haberler'e satır; süre kişinin geçmişine yazılır ve bir sonraki tahmin daralır (düğme etiketinde görünür).
- **Kesinti:** Tahsin görüşmesinin ikinci kartında Tarık Yener arar, Karaova'da Şükrü Hoca arar: köşede anlık kart, Bak / Bakma; bakmazsan Haberler'de “ulaşılamadı” satırı.
- **Kademe ve bedel:** her kişi düğmesinde Mesaj yaz / Ara · ~5–15 dk / Çağır · tahmin · kaynak / Git · yarım gün · ₺.
- **Eskiyen sayı:** Finans › Durum'da “Belirsiz gelir” 16 Kasım tarihli: sararmış, “taze rapor iste”.
- **Personel yükü ve yetkiler:** Finans › Müdürlük (yük sayısı; üç yetki kartı) ve Kulüp › Teknik ekip (her kişide “n iş”, özel kalem).
- **İlişkiler:** Kulüp › İlişkiler (on kurum ve kişi; satır: kişi sayfası, “tanıdığın kadarı”, üç kademe).
- **Haberler'de kanal:** randevu satırı “Kapı · yüz yüze” sahnesi (Buyursun), Kocadere teklifi “Belge”, hocanın mesajı “Telefon” balonu, rapor “Belge”.
- **Telefon:** solda ekip ve rehber (menajerler, rakip başkanlar), “Ara” düğmesi, gece ulaşılamayanlar soluk.

## Veri

`veri.js` oyunun 14. hafta örnek kaydından (`araclar/ornekler/kayit-s12-hafta14.json`, 4 Aralık 2026) oyunun kendi kural işlevleriyle çıkarıldı: puan durumu, fikstür, maç sayfası, kadro, 352 oyuncunun sayaçları ve yüzleri, armalar, mali raporlar, gelişmeler. Çıkarma betiği oturumun geçici klasöründeydi; yeniden üretmek gerekirse oyun açıkken aynı işlevler (`sezonTablosu`, `kadroSatirlari`, `gelismeListesi`, `maliRaporlari`, `macSayfasi`, `portreUrl`, `armaSvg`) çağrılır. `oda.jpg` aynı kayıtta odanın 3B karesidir.

“örnek” işaretli her şey önizleme için uyduruldu (TEST): cevap bekleyen üç iş ve randevu, Finans'ın Eylül–Kasım hareketleri (örnek kayıt 23 Kasım'da başlıyor), rapor istekleri ve görevler, transfer dosyaları ve menajer teleksleri, bütçe tablosu, telefon konuşmaları, gazete metni. Oyunun TEST metinlerindeki “TEST:” öneki listede gösterilmez.

## Önizlemede olmayanlar

Zaman akmaz (İlerle yalnız bilgi verir). Ayarlar ekranı, 3B balkon, 2D maç, maç öncesi ve maç sonu yok. Oda canlı değil, durağan kare. Kartın verdiği sonuç kayda yazılmaz; sayfa yenilenince her şey baştan.
