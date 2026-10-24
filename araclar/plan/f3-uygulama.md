<!-- Durum (2026-10-24, masaüstü, oto mod): F3 uygulanıyor; dal claude/f3-hoca. Kapanınca sonuç birkaç satıra iner. -->
# F3 — Hoca, kadro seçimi ve maçın okunması (+ F3-0 “Santraya geç”)

## Bağlam

F2 kapandı (`tur/f2`): hafta → maç → sonuç → sonraki hafta döngüsü kayıtla çalışıyor. Eksik olanlar: kariyerde hoca yok (kadro sabit ilk 11'den, tarz maç tohumundan), maçın başkan için okunacak hiçbir izi yok (beklenen gol, yorum, not). Kullanıcı 2026-10-24'te 7–8 saat dışarıdayken oto mod istedi: F3 → F7 (ligin öbür maçları) → F6-a (hoca değişimi ve P12 TEST taslağı); görsel işe takılmadan oyun mantığı; F4 tek kart ve F5 antrenman ertelendi. Onaylı plan: `C:\Users\herna\.claude\plans\giti-kontrol-et-lokal-modular-starfish.md` (makineye bağlı; özeti burada).

## Kullanıcı kararları (2026-10-24)

1. “Santraya geç” düzeltilir: basılan an maçı değiştirmez.
2. Her tur kapanınca `main`'e alınır ve push edilir.
3. Sıra F3 → F7 → F6-a; F4 ve F5 ertelenir.

## Claude'un kararları

- **F3-0:** “Santraya geç” maç öncesini görüntüsüz doğal sonuna oynatır (`js/mac-sahnesi.js` `santraHizliAdim`, kare başına 30 ms; ikiz her adımda birlikte). Masaüstünde maç öncesinin tamamı ~0,65 sn (22 561 kare, ikizle). `mac.macaGec` motorda kalır (araçlar ve F7'nin görüntüsüz maçları).
- **Hoca kişidir** (`rol:'teknikDirektor'`, `hoca:{tarz, bilgi, israr}`, `kulup.hocaId`; `js/hoca.js`). Demirkapı Şükrü Hoca direkt, Akdeniz Nuri Hoca konumsal (kadrolar.js'ten), öbürleri tohumdan (tarz motorun `TARZ_DAGILIM` paylarıyla). Bilgi ve ısrar gizli (TEST kutusu hariç).
- **Kadro seçimi** (`hocaKadroSec`): yuva rolleri (`HOCA_YUVALAR`: bek, stoper, kanat, merkez, forvet; taraf), rol ağırlıkları + tarz tercihi + kalıcı yanılgı ((1 − bilgi) × 12) + günün farkı (±1,5) + ısrar (aynı yuvada × 6) + ayak ve boy; en yüksek oyuncu–yuva çifti sırayla. İlk denemede hat başına ağırlık Oğuz'u (hızlı sağ kanat) kulübeye aldı → yuva rolüne geçildi; iki tohum kadrosunun on biri korunuyor. Gerçek hocalarla 16 kulübün 6'sında on bir kusursuzdan bir oyuncu farklı (bilgisiz hocada 16/16).
- **Kadronun `ilk11`'i “son maçın on biri”dir:** sonuç komutu maçın on birini (motorun girdisinden, `sonucKaydi().ilk11`) iki kulübün kadrosuna yazar; hocanın ısrarı buna bakar. Planda `ilk11/yedekler` kaldırılacaktı; anlamı değişerek kaldı (kayıt değişikliği küçük).
- **Tarz maça `secenek.tarz=[ev, konuk]` ile girer** (eski `'dagilim'` kariyerde kalktı). `m.hoca` taban yaması kullanılmadı: tarz vektörü varken `etkinTaktik` tabanın direkt/pres/tempo/sakin alanlarını götürüyor (keşifte bulundu, koddan; maçla doğrulanmadı).
- **Motorun salt kayıt dokunuşları:** `kayit.sutlar` (şut, konum xG'si `xgYer`, penaltı, kafa), `kayit.uzunPas` takım başına, `sonucKaydi()`'ye `sutlar`, `ilk11`, `ist.pas/pasTamam/uzunPas`. `ist`'in biçimi değişmedi (taban özeti): `d.json`'a 10/10 birebir.
- **Kayıt sürümü 8:** hoca kişileri, `maclar` girdisinde `sutlar`, `xg`, `ilk11`, `hocalar`, `tarz`; `macOkundu`. Sürüm 7 nedeni söylenerek açılmaz (`araclar/ornekler/kayit-eski-s7.json` `tur/f2` koduyla üretildi). TEST kişileri `kisi-91…93`'e taşındı (`kisi-2…17` hocalar).
- **Maçın okunması** (`js/mac-okuma.js`, saf; metin kayda yazılmaz): `macOkumasi` (skor, beklenen gol — penaltı 0,76 —, istatistik, tarz izi: uzun pas payı ↔ tarzın bandı `TARZ_UZUN_PAY`, şans sınıfı: şanssız / şanslı / haklı / dengeli, eşik 0,5 beklenen gol, öne çıkan oyuncu), `macYorumu` (hocanın telefondaki sözlü yorumu; ısrarı ≥ 0,6 olan hoca açık yenilgiyi şansa bağlar — başkan beklenen golle karşılaştırır), `macGozlemNotu` (başkanın deftere düşen notu, gözlenebilir sayılarla). Metinler TEST (karar 35). Telefonda meseleye bağlı olmayan mesaj kaynağı `MESAJ_KAYNAKLARI` (js/mesajlar.js); okundu `k.macOkundu`.
- **Ekran (metin düzeyinde):** bültende hocanın tarzı; maç sonu kartında beklenen gol ve şut; odada Canlı Skor “Son maç” satırı dokununca istatistik (beklenen gol, pas isabeti dahil); telefonda hocanın yorumu; defterde maç gününün sağ sayfasında “Maçtan not”.

## Denetimler (yapılanlar)

- `kariyer-deneme`: 3.3 (hoca ve kadro), 3.2 (okuma), 3.4–3.5 güncel; hepsi geçti. Gerçek motorla kısa maç tohum 25 (hocaların tarzıyla tohum 3 0–0 bitti; 1–2, kendi kalesine dahil).
- `mac-deneme 4` sonuç aynı; `--ayni d.json` 10/10; ad denetimi temiz (78 betik); `ikiz-deneme 4` 4/4; `sezon-deneme 2` belirlenimci.
- Tarayıcı: aynı tohumla “Santraya geç”e farklı anlarda basmak aynı sonuç kaydı (elle ve `akis-deneme` §19 üçüncü sayfa).

## Kapanış (2026-10-24)

- `TARZ_UZUN_PAY` ölçüyle yazıldı (36 tam maç, `MAC_KADRO`, tarz başına 12 takım-maç; %10–%90 bandı). Ölçü betiği makineye bağlı (scratchpad); yeniden ölçmek için: her tarz için iki kadroyla tam maç, takım başına `sonucKaydi().ist.uzunPas[t] / ist.pas[t]`.
- Kayıttaki golcü düzeltmesi (inceleme sırasında kartta görüldü: kaleciye üç kendi kalesine gol): 12 maçta motorun `own` saydığı 5 golün 5'i kayıtta şutu atana geçti.
- `oturum-sonu d.json --ayni --seyrek`: 40/40 birebir, sağlık dışı 0; senaryolarda F2'deki bilinen borçlar. Hız `tur/f2`'ye +%2,2 (34,6 ms). `akis-deneme`, `akis-2d`, `kontrol.py`: devam notunda.

## Yapılmayacaklar

Maç içi tarz değişikliği (Z7-2); hoca değişimi (F6-a); öbür maçlar (F7); tek kart (F4); motor anahtarı; `varlik`'e alan; görsel tasarım.
