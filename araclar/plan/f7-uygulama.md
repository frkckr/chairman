<!-- Durum (2026-10-24, masaüstü, oto mod): F7 kapandı (`tur/f7`). Sonuç YOL_HARITASI devam notunda ve karar 41'de. -->
# F7 — Ligin öbür maçları (yol haritası 3.8)

## Bağlam

F3 kapandı (`tur/f3`): hoca, kadro seçimi ve maçın okunması. Puan durumu yalnız bizim maçlarla ilerliyordu (16 kulüpten yalnız ikisinin O'su artıyordu), öbür kulüplerin cezaları yalnız bizimle oynayınca düşüyordu, Canlı Skor yalnız kendi maçını gösteriyordu. Kullanıcı kararı (2026-10-24, karar 39): oto modda F3'ten sonra F7, sonra F6-a.

## Claude'un kararları

- **Kilit adım, aynı sayfa:** haftanın öbür yedi maçı bizim maç sayfasında görüntüsüz `Match` olarak kurulur (`js/mac-sahnesi.js` `LIG_CANLI`), santrayı ilk adımda alır (maç öncesi yok), bizim santramızdan sonra bizim motorun attığı her adımda birer adım atar. Böylece hepsi 19:00'da birlikte başlamış gibi akar; duraklatma ve telefon onları da durdurur, ×2/×4 ve hızlı bitirme onları da hızlandırır; Canlı Skor'daki dakikalar tutarlıdır. Web Worker `file://` altında açılmadığı için ayrı iş parçacığı yok. Maliyet: bizim maçın adım maliyetinin 8 katı (masaüstünde ×1'de kare başına ~0,6 ms; hızlı bitirme ~8 kat uzun).
- **Seçenek saf ve Node ile aynı:** `digerMacSecenegi(k, f)` (`js/lig-maclari.js`) hocaların kadrosu ve tarzı, maç tohumu, `tunel` — stat alanı yok (zemin kuru, atmosfer yok: TEST sınırı). `araclar/sezon-deneme.js` aynı seçenekle aynı maçları oynar.
- **Tek komut:** “Odaya dön” kalanını tamamlar (`ligCanliBitir`) ve `haftaSonuclariUygula` ile önce yedi öbür maçı (`macKaydiYaz`, kısa kayıt), sonra bizim maçı (`macSonucuUygula`: zaman 21:00, sıradaki hafta) yazar. Eksik ya da fazla öbür maç, yanlış tohum, kimlik uyuşmazlığı → komut düşer, hiçbiri yazılmaz.
- **Kısa kayıt:** öbür maçlarda `sutlar` null (beklenen gol `xg`'de), `degisiklikler` boş, geçmişe yazılmaz. Sezonda ~210 öbür maç; kayıt boyu ölçülür.
- **Kayıt sürümü 8 kalır:** alanlar aynı; F3'ün sürüm 8 kaydında (öbür maçlar oynanmamış haftalar) tablo eşit değildir, kayıt geçerlidir (TEST sınırı; kullanıcıda böyle kayıt yok).
- **Bülten notu yok:** planda yazılan “diğer maçlar oynanmıyor” TEST notu kodda yokmuş.

## Denetimler

- `kariyer-deneme` 3.8: sekiz kayıt, 16 kulüp aynı O, geçmişe yalnız bizim maç, kısa kayıt, son on birler; eksik/fazla/yanlış tohum reddi; aynı tohumla birebir; öbür kulübün cezası düşer; kaydet–yükle sonrası 14. hafta.
- `sezon-deneme 3` (haftanın sekiz maçı, belirlenimci, eşit O, hafta süresi ve kayıt boyu).
- `akis-deneme` 19 (Canlı Skor sekiz satır, Odaya dön sonrası sekiz kayıt), 16, 18; `kontrol.py`; `ikiz-deneme 4`; `--ayni d.json` (motor değişmedi).

## Kapanış (2026-10-24)

- Önemli bulgu: motorda 40 maçta 1 maç taçta sonsuza dek takılıyordu (`d.json` tohum 13 “bitmedi”, D'den beri). Çok ajanlı takılma denetimi aynı ailede altı biçim daha buldu (hepsi Node'da üretildi ve düzeltildi); son çareler: duruş ve gol evresi 180 sn, maçın bütünü motor zamanı 4500 sn. Sağlıklı maçlar değişmedi; yeni taban `f7.json`.
- Çok ajanlı F7 incelemesi: kalıcı kilit kaygısı (öbür maç bitmezse) motorun genel son çaresiyle kapandı; öbür maçların duraklatmada ilerlemesi, taçta eski uzun taç kararı, 3.8'in atomiklik denetimi düzeltildi.
- Denetimler: `kariyer-deneme`, `sezon-deneme 3`, `oturum-sonu f7.json --ayni --seyrek` (40/40, sağlık dışı 0, bilinen senaryo borçları), `ikiz-deneme 4`, hız `tur/f3`'e +%5,6 (en azlar +%0,9), `akis-deneme` tamamı bilinen 15b ile, `akis-2d`, `kontrol.py`.

## Yapılmayacaklar

Sezon sonu ve sezon geçişi (5.1); başka liglerin maçları; öbür maçların olay akışı (gol bildirimi) — Canlı Skor yalnız skor ve dakika; denge.
