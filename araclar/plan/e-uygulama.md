<!-- Durum (2026-10-23, masaüstü, oto mod): E KAPANDI (`tur/e`). E0–E3 yapıldı; E4 (deplasman statı) F'nin fikstürüne kaldı (kariyerde yalnız iç saha maçı). Sonuç FUTBOL_KUTUPHANESI §12.4 E. -->
# E — 2D görüntü ve kopuş: uygulama planı (masaüstü, 2026-10-23; oto mod)

## Bağlam

Program FUTBOL_KUTUPHANESI §12.1 E: olay simgeleri (kart, sakatlık, değişiklik), top taşıyanın ad etiketi, pas isteğinin 2D işareti, kalabalık kutuda pul boyu; deplasman stadı ikinci tarif ve statın maç gününe bağlanması; pul motor alanlarından beslenir, 2D'de figür animasyonu ve loca kamera hesabı çalışmaz (çizim süresi düşer). Kabul: `akis-2d.py` genişler; çizim süresi önce/sonra; `?pul=0` hâlâ çalışır; motor `--ayni`.

Bugün (kod okuması): 2D'de her kare `aktorGuncelle` (js/animasyon.js) bütün aktörlerin pozunu, kemiklerini ve kökünü hesaplıyor; pullar (js/pul.js `pulKare`) bunun yan ürünlerini okuyor (a.x/a.z, a.yaw, adım evresi a.ph, yatış a.lth, kökün görünürlüğü). Kart, defter, sprey ve bayrak kemiklere bağlı 3B nesneler; 2D'de figür gizli olduğundan elde asılı görünüyorlar. Motor olayları: `kart` {p, renk}, `sakatlik` {p}, `tedaviBasladi`, `sedye`, `degisiklik` {cikan, giren}, `ofsayt` {p}. Jest: `jestVer` (js/mac-takim.js), oyuncuda `p.jest {tur, …}`.

## Sıra (öncelik; her adım kendi commit'i, motor dosyasına dokunulmaz)

1. **E0 ölçü.** `akis-2d.py`'ye 2D maçta kare süresi (rAF geri çağırmasının JS süresi, ortanca ve p95; `kontrol.py`'nin ölçüsünün aynısı) ve yeni öğelerin denetimleri; önce sayısı alınır.
2. **E1 kopuş ve olay simgeleri.** 2D'de `aktorGuncelle` yerine hafif güncelleme (`pulAktor`: konum, görünürlük — tünel, sağlıkçı, yedeğin eşofmanı —, yön, adım evresi hızdan, yatış motorun eylemiyle; kemik ve poz yok); kemik yardımları (`anmYardimIK`) 2D'de çalışmaz; kart, defter, sprey, bayrak 2D'de gizli. Olay simgeleri (`STIL.pul.simge`): kart (sarı ya da kırmızı dikdörtgen, cezalının pulunun üstünde ~3 sn), sakatlık (beyaz zeminde kırmızı artı, sakat yerdeyken), değişiklik (giren yeşil ↑, çıkan kırmızı ↓), ofsayt (yan hakemin üstünde küçük bayrak); hepsi ekranda dik, uzakta en küçük boy. `?pul=0`'da hiçbiri yok, figür yolu aynen.
3. **E2 ad etiketi ve pas isteği.** Top taşıyanın adı pulun üstünde küçük etiket (oyunun 3×5 piksel yazısı; soyadı ya da kısa ad), sahip değişince yumuşak geçiş; pas isteği (jest `kol`, `cagir`, `isaret`) pulun yanında küçük işaret.
4. **E3 kalabalık kutu.** Pullar birbirine pul çapından yakınsa yerel olarak küçülür (en çok %25), korner ve kutu kalabalığında numaralar okunur kalır.
5. **E4 deplasman stadı** (zaman kalırsa): ikinci tarif (tarif v2: başka yerleşim, renk, tribün biçimi) ve maç gününün ev/deplasmana göre statı seçmesi. Kalmazsa sonraki tura (belgeye yazılır).
6. **E-son.** `akis-2d.py`, `kontrol.py`, `akis-deneme.py` (ekran dosyası değiştiyse tamamı; yalnız masaüstünde), motor `--ayni` (d.json, 40 maç), ad denetimi; çizim süresi önce/sonra; belgeler (kutuphane/M, STIL_REHBERI, FUTBOL_KUTUPHANESI §12.4 E, YOL_HARITASI); `tur/e`, `main`, push.

## Kabul

- 2D'de figür animasyonu çalışmıyor; çizimin JS süresi önce/sonra (beklenen: belirgin düşüş).
- Olay simgeleri olay anında görünüyor ve süresi bitince kayboluyor (akis-2d denetimi), `?pul=0` figürlü loca bakışı aynen.
- Top taşıyanın etiketi yalnız top taşıyanda; pas isteği işareti jest süresince.
- Kalabalık kutuda pullar iç içe geçmiyor (en yakın iki pulun ekran uzaklığı ≥ pul çapının %75'i), numara okunur.
- Motor `--ayni` (d.json), sayfa hatası yok, `kontrol.py` görüntüsü incelendi.

## Yapılmayacaklar

Motor davranışı; figür çizimi (antrenman serisi); yeni ses; oyun içeriği (stat adı, kulüp adı yazılmaz).
