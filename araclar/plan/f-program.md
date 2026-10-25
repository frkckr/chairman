<!-- Durum (2026-10-24 gece, masaüstü, oto mod 2; kullanıcı kararı 43): G1 yapıldı (`tur/g1`; `araclar/plan/g1-uygulama.md`: kadro 22, sakatlık ölçeği, hükmen, sezon sonu kaydı, Maçı bitir anında). G2 yapıldı (`tur/g2`; `araclar/plan/g2-uygulama.md`: sözleşmeler, ay başı, bilet, nakit ufku, sezon sonu sözleşme kartları, kış transfer dönemi, gelen teklif, hocanın isteği ve imza; kayıt sürümü 9). Sıradaki kullanıcı kararıyla: F4 tek kart, F5 antrenman, F6-b, ya da yeni sezon (5.1). -->
<!-- Önceki durum (2026-10-24, masaüstü, oto mod): F6-a yapıldı (`tur/f6a`; `araclar/plan/f6a-uygulama.md`: hoca değişimi ve P12 TEST taslağı, içerik sürümü 5). Oto mod bitti; sıradaki tur kullanıcıyla — öneri: önce kadro yeterliliği (sezon ortasında 11 uygun oyuncusu kalmayan kulüp sezonu kilitliyor; YOL_HARITASI devam notu), sonra F4 tek kart. -->
<!-- Önceki: F7 yapıldı (`tur/f7`; `araclar/plan/f7-uygulama.md`; motorun bitmeyen maç düzeltmesi ve taban `f7.json` dahil). -->
<!-- Önceki: F3 yapıldı (`tur/f3`; plan ve sapmalar `araclar/plan/f3-uygulama.md`). Kullanıcı kararı (2026-10-24): sıra F3 → F7 ligin öbür maçları (3.8) → F6-a hoca değişimi ve P12 TEST taslağı; F4 tek kart, F5 antrenman ve F6-b (2.9) sonra — önce oyun mantığı, arayüz ileride değişecek. F7 ve F6-a aşağıda kısa; kendi planları f7-uygulama.md, f6a-uygulama.md. -->
<!-- Durum (2026-10-23, dizüstü): F2 yapıldı (`tur/f2`; plan ve sapmalar `araclar/plan/f2-uygulama.md`). Sıradaki F3, kendi planıyla. -->
<!-- Önceki durum: F0 ve F1 yapıldı (`tur/f1`; F1-a, F1-b, F1-c ayrı commit; ayrıntı YOL_HARITASI devam notu). Uygulamada plandan sapmalar: kadro kuralları `js/kariyer-kadro.js`'te (planda kadro-uret.js); fikstür bütün 30 haftayı tutar (planda 13–30); maç günü işi yalnız `macId` taşır; paylaşılan dondurulmuş alanlar ve kayıt kısayolu eklendi (hız); kulübe her hattan; oda maç günü işini tüketmez. Sıradaki F2, kendi kısa planıyla. Geçerli kararlar YOL_HARITASI 31–37. -->
# F — Başkanlık programı ve F1 planı (2026-10-23, dizüstü)

## Bağlam

**Nerede kaldık.** Evde (masaüstü) 22–23 Ekim gecesi D (V1 daraltılmış) ve E (2D görüntü ve kopuş) oto modda kapandı, `main`'e alınıp push edildi (`tur/d`, `tur/e`); makine durumu “boşta”. Bu dizüstü eski `main`'de (017d525, ayrık HEAD), `../chairman-main` ağacındaki `main` 9 commit geride; fetch yapıldı, ağaç temiz, ileri sarma onaydan sonra.

**Kullanıcı kararları (2026-10-23, bu oturum):**
1. **Kapı geçti.** Motor “idare eder” sayılır (FUTBOL_KUTUPHANESI §11.3; kullanıcı izlemeden kabul etti). Geliştirme başkanlık ve oyun içi sistemlere geçer.
2. **İki hat.** Ana hat başkanlık/kariyer (F turları). Yan hat: kullanıcı arada 2D maç izler, notlarını sohbette yazar; notlar teşhis tablosuna alınır ve küçük motor turlarıyla (İ1, İ2 …) F turlarının arasında işlenir; tek anahtarlık ayarlar (ör. `pasEgriKat`) tur açmadan yapılır ve taban yenilenir. Yol haritası sırası dışında yeni motor işi yok; arkadaki Z6-2, Z5-2, Z4-2/Z7-2, Z10 yalnız notlar isterse öne gelir.
3. **Tek kart her yerde:** dosya, karar paneli, telefon konuşması ve maç günü karar anı.
4. **Rakip kadroların adları Claude'dan (kural değişikliği):** Türkçe kurgusal oyuncu adları TEST verisi olarak Claude yazar, kullanıcı sonra değiştirebilir. Kulüp adları değişmez (ligdeki 16 ad kullanıcının).
5. **Beklenen gol Canlı Skor'da sayı** olarak görünür (maç sonrası istatistik satırı).
6. **İlk olay içeriği Claude'dan TEST taslak** (yer tutucu metinler), kullanıcı metinlerin üstüne yazar; 2.9 denemesi beklemez. Aynı kip F3'ün ekip yorumu ve rapor şablonlarına uygulanır (Claude'un kararı; metinler TEST etiketli).

**Claude'un kararları (belgeye görünür yazılır; itiraz serbest):**
- **Lig TEST tarifi:** 16 takım, çift devreli 30 hafta, her hafta Cumartesi 19:00, ara yok; 1–12. haftalar devralınan geçmiştir (bugünkü `LIG` tablosu ve `sonMaclar`), oyun 13. haftada başlar (bugünkü DEM–AKD maçı); kış transfer dönemi 4–31 Ocak yalnız takvim işareti. Kesin lig formatı bundan türetilmez (Aşama 5 öncesi karar).
- **Kadro kariyere geçer:** `KADROLAR` tohum kadrosudur, `kariyerBaslat` kopyalar; oyuncular kalıcı kimlikle `k.oyuncular`'da, kulüp kimlik listesi tutar; kayıt sürümü 7 (eski kayıt reddedilir, kural). Gerekçe: transfer (Aşama 4) kadroyu kariyerde ister; iki gerçek kaynağı olmaz.
- **Maç sınırı sayfa yeniden yüklemesidir:** stat, seyirci, tünel, kulübe ve `mac` yüklemede bir kez kurulan sabitler; maç başına yeniden kurmak ~12 görüntü dosyasına yayılır ve E'nin kopuşunu riske atar. “Stada git” → `index.html?ekran=bulten&mac=<id>`; “Odaya dön” → sonuç komutu kaydedildikten sonra `index.html`. Maç ortasında kayıt yok (kural): sayfa kapanırsa aynı kimlik ve tohumla aynı maç yeniden oynanır.
- **Maç kimliği ve tohum:** `mac-2627-13-demirkapi-akdeniz`; tohum = FNV-1a(`dunyaTohumu:macId`); kariyer rastlantısı çekilmez. Sonuç yalnız `macSonucuUygula` komutuyla, kimlikle, bir kez.
- **Motor sözleşmesi korunur:** takım 0 = ev sahibi; “bizim takım” sunuma `MAC_GUNU.biz` ile verilir; motor dosyalarına F1–F2'de dokunulmaz (`--ayni` d.json). F3'te `sonucKaydi`'ye şut listesi (xG) eklenir; sonucu değiştirmez.
- **Diğer maçlar:** F2'de oynanmaz (tablo yalnız bizim maçla ilerler, bülten ve Canlı Skor TEST notu yazar). 3.8 için yaklaşım: kullanıcının maçı sürerken aynı sayfada zaman dilimli, kilit adımlı 7 motor (görüntüsüz maç ≈ 6,5 s dizüstünde; Web Worker `file://` altında engelli). Ölçü aracı `araclar/sezon-deneme.js` F2'de.
- **Ceza TEST kuralı:** kırmızı/ikinci sarı 1 maç, 4 sarı 1 maç; sakatlık `tedavi`/`cikis` derecesinde ve `gun>0` iken kadro dışı (`sakat.donus` tarihi).
- **Tek kart davranışı (F4):** ortadaki kartın yüzünde konu, bedel, süre ve risk; sürüklerken yüz o yönün cevabına döner (metin, süre, bilinen sonuç); kart genişliğinin %40'ını geçince bırakmak uygular, altında geri yaylanır; klavye ←/→ önizler, Enter uygular, Esc bırakır; “Onayla” adımı kalkar (karar 23: bırakınca uygulanır), uyarılar (atlanacak randevu, cevapsız kalacak) kart yüzünde önceden görünür; sol/sağ doğru/yanlış kodlanmaz; hareket 0,2 sn ve sakin. Karar anında aynı kart + süre çubuğu, cevapsız sonucu kayıttan.
- **Sıra:** F0 belge → F1 fikstür ve deplasman statı → F2 maç sonucu kariyere → F3 hoca, kadro, rapor ve maçın okunması → F4 tek kart → F5 antrenman arka planda → F6 2.9 ve ilk içerik. Gerekçe: hafta → maç → sonuç → sonraki hafta döngüsü (F1–F2) “oyuna başlamanın” omurgası; F3 maçı başkan için anlamlı kılar; F4 sunum, içerikten bağımsız, F6'daki içerikten önce; F5 görsel ve araştırmalı, en sona. Kullanıcı F4'ü öne çekebilir.
- Her F turu kendi dalında (`claude/f1-fikstur`, `claude/f2-sonuc`, `claude/f3-hoca`, `claude/f4-kart`, `claude/f5-antrenman`, `claude/f6-icerik`), kapanışta `tur/f1` … etiketi, `main` ve push kullanıcının sözüyle, tur bitince durulur. F1'in planı bu belgedir; F2–F6 kendi başında kısa planla (`araclar/plan/f<N>-uygulama.md`) onaylanır. Oto mod yok (istenmedi).

## F0 — Eşitleme ve belge (yalnız belge; kod yok) — yapıldı 2026-10-23

1. Eşitle (yalnız ileri sarma): `git -C ../chairman-main pull --ff-only`; burada `git checkout --detach origin/main` (F1 başlarken `git checkout -b claude/f1-fikstur origin/main`).
2. Hızlı kademe: `node araclar/mac-deneme.js 4` (“sonuç aynı”); `node araclar/mac-deneme.js 10 1 --karsilastir araclar/taban/d.json --ayni` (taban bu makinede tutuyor mu; tutmazsa yerel taban, depoya alınmaz).
3. Belgeler (bu plan belgeye iner):
   - YOL_HARITASI: devam notu (kapı geçti, iki hat, F0 yapıldı, sıradaki F1); “Program” paragrafı F0–F6 ve yan hat; “Geçerli kararlar” 31 (kapı ve iki hat), 32 (tek kart ekranları), 33 (rakip adları Claude TEST), 34 (beklenen gol sayı), 35 (ilk içerik TEST taslak), 36 (Claude'un F kararları: lig tarifi, kadro kariyerde, sayfa yeniden yükleme, maç kimliği); Aşama 3 maddelerine F eşlemesi.
   - FUTBOL_KUTUPHANESI §11.3 “geçti (2026-10-23, kullanıcı kararı)”, §12.1 F satırı alt turlara açılır, yan hat kuralı §12.3'e.
   - OYUN_TASARIMI §2 tek kart ekranları kesinleşir; §9/§11 beklenen gol kararı; §13 tablo satırları.
   - CLAUDE.md “İçerik” (rakip adları TEST, Claude), “Program”, “Bugün çalışan”; TEKNIK_PLAN §3 eskimiş sürüm satırı (kayıt 6, içerik 4) ve §8 F planı.
   - STIL_REHBERI §7 “oyuncu etiketi bulunmaz” satırı E'ye göre düzeltilir; tek kart kuralı F4'te yazılır.
   - `araclar/plan/f-program.md` (bu belge), `araclar/plan/OKU.md`; c-uygulama'nın açık soruları: 2 (falso: izleme notlarıyla), 3–4 (izlemeye), 5 (nabız eşiği: değişmedi), 6 (kapandı), 7 (adlı kadrolar: F1'de Claude TEST).
4. Commit (yalnız belge; `git diff --check`); “kapatıyorum” denince push. `main`'e doğrudan belge commit'i kullanıcının sözüyle.

## F1 — Fikstür, maç kimliği, kadrolar ve deplasman statı (1–2 oturum; `claude/f1-fikstur`)

**Kapsam:** Aşama 3.1 + 3.4'ün girdi yarısı + E'den kalan deplasman statı. Kullanıcıya rakam gösterilmez.

### F1-a Veri ve fikstür (commit 1)
- `js/kariyer.js`: `KARIYER_SURUM` 7; `KIMLIK_TURLERI.oyuncu:'oyuncular'`, `sonrakiNo.oyuncu`; doğrulamada `sezon`, `fikstur`, `maclar`, `oyuncular`. `js/kayit.js` `ESKI_KAYIT_SINIRI` 7.
- Yeni `js/fikstur.js` (veri ve saf işlevler; `ajanda.js`'ten sonra yüklenir): `fiksturUret(takimlar, tohum, {pivot:'demirkapi'})` daire (Berger) yöntemi, ikinci devre aynası; pivot sabit, 8–13. konumlar Demirkapı'nın devralınan son 5 maçı ve 13. hafta rakibiyle tutacak biçimde (Akdeniz'in son 5'i aranmaz, TEST sınırı); `macTohumu(dunyaTohumu, macId)`; `macGunuIsiKur(k, macId)` (`veri:{eylem:'macGunu', macId, ev, konuk}`); `sezonTablosu(k)` ve `sonBesMac(k, kulupId)` devralınan + `k.maclar`'dan türetir (`puanDurumu` satır biçimi korunur); `fiksturDogrula` → `EK_DENETIMLER`.
- Yeni `js/kadro-uret.js`: `kadroUret(kulup, tohum)` 11 + 7 oyuncu, `oz` kademe dağılımından özetle (rastlantı çekmez), görünüş özetten; **adlar Claude'un TEST ad havuzundan** (`js/adlar-test.js`: ~80 ad + ~80 soyad, tohumla birleşir; dosya başında TEST ve “kullanıcı değiştirebilir” notu); `forma:'deplasman'`, `td:{ad: TEST ad}`; Demirkapı ve Akdeniz'in `eksikler`i oyuncu kaydına dönüşür.
- `js/baslangic.js`: 16 kulüp (`kisa` iki kulüpte `KADROLAR`'dan, diğerlerinde 3 harf TEST; kademe 3, nakit 0, başkan yok), `k.oyuncular` ve `kulup.kadro{forma, kaleciForma, taktik, td, ilk11, yedekler}`, `k.sezon{etiket:'TEST', ilkHafta:13, haftaSayisi:30, tarih0:'2026-11-28', tablo, sonMaclar, transfer}`, `k.fikstur` (13–30), 13. hafta maç işi, transfer dönemi iki `hatirlatma` işi. `js/kadrolar.js` yalnız başlık notu (tohum kadrosu). `js/kariyer-ornek.js` sürüm 7.
- `index.html` yükleme sırası; `araclar/kariyer-deneme.js` yeni bölüm “3.1 — sezon ve fikstür” (belirlenimcilik, her takım her hafta tek maç, aynalı ikinci devre, 13. hafta DEM–AKD ev, tek bekleyen `macGunu` işi, devralınan 5 maç tutuyor, bozuk kopyalar, oyuncu kimlikleri ve kadro listeleri tutarlı).

### F1-b Maç girdisi ve geçiş (commit 2)
- Yeni `js/mac-girdi.js` (saf, Node'da yüklenir): `macGirdisi(k, macId)` → `{macId, hafta, tarih, ev, konuk, biz, secenek:{kadro:[K0,K1], tohum, evSahibi:0, tarz:'dagilim', kosullar:{atmosfer}, zemin}, stat, doluluk, bulten}`; kadro kayıtları derin kopya; uygunluk (sakat/cezalı dışarı, aynı mevkiden ilk uygun yedek) — hoca yokken; F3'te hocadan.
- Yeni `js/mac-gunu.js` (`oyun-oturumu.js`'ten sonra, `mac-motoru.js`'ten önce): adreste `?mac=<id>` varsa `oyunBaslat()`, bekleyen `macGunu` işini bellekte kaydetmeden yeniden uygular, `MAC_GUNU = macGirdisi(…)`; yoksa/hata → `MAC_GUNU.hata`, odaya düşer. `?ekran=mac` / `?ekran=bulten` kariyersiz yol bugünkü sabitlerle (`MAC_KADRO`, `LIG.buMac`, `?tohum`): araçlar ve `akis-2d.py` değişmez.
- `js/mac-sahnesi.js` `MAC_SECENEK` → `MAC_GUNU.secenek` + sahne alanları; `MAC_KADRO` okumaları → `MAC_GUNU.kadro`. `js/ekran-mac-oncesi.js` bülten `MAC_GUNU.bulten`'den (sıra, puan, ilk 11, hoca, eksikler, tablo, son 5; TEST “diğer maçlar oynanmıyor” notu). `js/ekran-oda.js` `macaGit` → yeniden yükleme. Takım 0 varsayımı → `MAC_GUNU.biz`: `js/baskan.js`, `js/kamera.js`, `js/ekran-mac-telefon.js`, `js/ekran-telefon.js` (başlık ayrıştırma yerine `veri.ev/konuk`), `js/loca-giris.js`; `js/test-gorunum.js` kadroyu kariyerden okur.
- `araclar/kariyer-deneme.js` “3.4 — maç girdisi”; `akis-deneme.py` §1 (Stada git → `?mac=` yeniden yükleme), §16 (Canlı Skor adları).

### F1-c Deplasman statı (commit 3)
- `js/stadyum-tarifleri.js`: `statTarifiUret(kulup)` “kompakt kasaba stadı” modelinden (kapasite ve tribün tipi kademeden; renk formadan; `ad` türetme TEST; yamaç ve kulüp binası yalnız Demirkapı; loca yok); `STAT`/`MAC_GUNU` tanımı `js/mac-gunu.js`'e taşınır. `js/stadyum.js` tarif parametresi (`statKur(kok,{mac,gunduz,tarif})`, ölçü işlevleri), tabela adı, arma ve kulübe rengi `MAC_GUNU.kadro`'dan; `js/balkon.js` ve oda penceresi hep kulübün statı (`STADYUMLAR.kulup`); `js/seyirci.js`, `js/stadyum-cevre.js` tolerans. Geliştirici parametresi `?ev=<kulupId>` (kariyersiz tarif önizlemesi).
- Doluluk: kulüp 0,3; üretilen 0,22–0,35 (`h2(tohum)`, TEST). Demirkapı deplasmandayken bizim taraftar deplasman bölümünde.

### F1 kabul
- `node araclar/kariyer-deneme.js` yeni bölümlerle geçer; `node araclar/ad-denetimi.js` temiz (yeni global adlar: `fiksturUret`, `macTohumu`, `macGirdisi`, `macGunuIsiKur`, `sezonTablosu`, `sonBesMac`, `kadroUret`, `statTarifiUret`).
- Motor dosyasına dokunulmadı: `node araclar/mac-deneme.js 10 1 --karsilastir araclar/taban/d.json --ayni` 10/10; `node araclar/ikiz-deneme.js 4`.
- `python -X utf8 araclar/kontrol.py "index.html?ekran=mac&tohum=3"` ve `"index.html?ekran=mac&ev=karaova"` görüntüsü incelenir (deplasman statı tepeden farklı); `python -I -X utf8 araclar/akis-2d.py`; `akis-deneme.py` §1, §14, §16, §18 (tamamı masaüstünde).
- Oyunda: yeni kariyer → ajandada 13. hafta maçı ve ilerideki haftalar → Stada git → bülten fikstürden → maç (sonuç henüz uygulanmaz, F2) ; `?ekran=mac` araç yolu aynen.
- Belgeler: TEKNIK_PLAN §3 tablosu ve §8; YOL_HARITASI 3.1 işaretlenir, devam notu; `tur/f1`.

### F1 yapılmayacaklar
Maç sonucunun uygulanması (F2); hoca ve kadro seçimi (F3); diğer maçların oynanması (3.8); kulüp adları ve forma renkleri (kullanıcıdan gelene dek `deplasman` forması); motor anahtarı; 80/160 maç; ekranda yetenek rakamı; `varlik`'e alan (kimlik `p.kayit.id`).

### F1 riskler
Global ad çakışması (yalnız tarayıcı yakalar → `kontrol.py` her commit'te); `mac-gunu.js`'in `oyunBaslat`'ı erken çağırması (`OYUN.basladi` kilidi; Node yüklemesinde `typeof location` koruması); kayıt sürümü 7 ile `kariyer-ornek.js` güncellenmezse 1.x bölümleri düşer; “Stada git”in bellekte yeniden uygulanması yolda durursa odaya düşer (hata metni TEST).

## F2 — Maç sonucunun kariyere işlenmesi (1–2 oturum; `claude/f2-sonuc`; kendi kısa planıyla)

- `js/fikstur.js` `macSonucuUygula(k, macId, sonucKaydi, tohum)`: reddet (uygulanmış, fikstürde yok, bitmemiş, tohum uyuşmuyor, maç işi yapılmamış); `k.maclar[macId]` yaz, geçmişe `tur:'mac'`; oyuncu durumu (gol, sarı birikimi, ceza, sakatlık → `sakat.donus`); oynamayan cezalılarda `ceza--`; `zamanIlerlet(k, 120)` (oda 21:00'de açılır, TEST); sıradaki haftanın maç işi (30. haftadan sonra yok). Tablo saklanmaz, türetilir.
- Yeni `js/ekran-mac-sonu.js`: fulltime canlandırması bitince “Maç bitti” kartı (skor, goller, kartlar, sakatlıklar; ikiz tutmadıysa küçük TEST uyarısı) → “Odaya dön” → `oyunKomut(macSonucuUygula…)` kaydedilir → `index.html`; kayıt hatasında “Kaydedilemedi · yeniden dene”, kayıt yazılmadan yeniden yükleme yok. Kariyersiz yolda kart çıkmaz. Rakip başkan karar anının seçimi `k.maclar[id].protokol`'e yazılır (etkisi F6 içeriğinde).
- Canlı Skor maç dışı saatte sıradaki gerçek maçı ve son sonucu gösterir (fikstürden).
- Yeni `araclar/sezon-deneme.js` (3.6): motor + kariyer dosyaları; N hafta oynat (`macaGec`, görüntüsüz), aynı tohumda `k.maclar` birebir; maç başına ms ve haftanın 8 maçının toplamı; 3.8 kararına veri.
- Kabul: `kariyer-deneme` “3.5 — sonucun bir kez uygulanması” (ikinci uygulama, kaydet–yükle sonrası uygulama ve yanlış tohum reddi; sayaçlar; sıradaki iş); `akis-deneme.py` yeni §19 (oda → Stada git → bülten → Maça geç → `?hiz=16` → Maç bitti → Odaya dön → tablo ilerledi, bekleyen iş 14. hafta; aynı `?mac=` ikinci kez açılınca odaya düşer); `sezon-deneme 3` belirlenimci; `--ayni` d.json; belgeler (3.4, 3.5, 3.6 işaretleri, 3.8 yaklaşımı); `tur/f2`.
- “Oyuna başlama” eşiği: F2 kapanınca hafta → maç → sonuç → sonraki hafta döngüsü kayıtla çalışır.

## F3 — Hoca, kadro seçimi, rapor ve maçın okunması (2 oturum; `claude/f3-hoca`; kendi planıyla)

- Hoca kişisi kariyerde (`rol:'teknikDirektor'`, Demirkapı'nınki `KADROLAR.demirkapi.td`'den; diğer kulüplerde TEST ad) ve `hoca:{tarz (B'nin arketipleri), bilgi, tercihler}`; maç girdisinde `secenek.tarz=[evHoca.tarz, konukHoca.tarz]` (`'dagilim'` yerine); `m.hoca` kapısı maç içi tarz değişikliği için F3'te açılmaz (Z7-2), değişiklikler bugünkü `mac-kurallar` ile. Tarz adı bültende görünür (B'den kalan).
- `hocaKadroSec(kulup, oyuncular, tarih, hoca, tohum)` saf: uygunluk, mevki, hocanın bilgisine bağlı gürültülü değerlendirme (kusursuz seçim makinesi değil), form; ilk 11 ve yedekler; başkan görmez, kadro bültende adla.
- Maçın okunması (3.2 + OYUN_TASARIMI §2): (a) Canlı Skor maç sonrası: şut, isabet, sahiplik, korner, kart, **beklenen gol sayısı** (motorun `xgYer`'i; `sonucKaydi`'ye şut listesi eklenir, sonucu değiştirmez, `--ayni`); (b) ekibin yorumu: hoca ya da futbol şube sorumlusu (koltuk doluysa) tarz uyumu (tarz izi: hat, uzun pas payı ↔ ilan edilen tarz), şans–beceri (beklenen gol farkı), öne çıkan oyuncu (c-oyuncu imzalarının oyun içi hafif eşi `macOzeti(m)`); metinler TEST şablon, kullanıcı düzeltir; mesaj olarak telefona ve dosyaya; (c) başkanın gözlem notu: maçtan 1 not (`GOZLEM_NOTLARI` kalıbı) deftere. Belirsizlik ve kaynak her raporda (TEKNIK_PLAN §7).
- Kabul: hoca tarzı maçta görünüyor (tarz izi tablosu yönüyle); kadro seçimi deterministik ve eksikleri dışarıda bırakıyor; rapor kaynaklı ve tarihli, kaydet–yükle sonrası ikinci rapor üretmiyor; ekranda rakam yalnız gözlenebilir sayılar + beklenen gol; `kariyer-deneme` 3.2/3.3 bölümleri; `--ayni`; `tur/f3`.

## F4 — Tek kart (1 oturum; `claude/f4-kart`; kendi kısa planıyla)

**Yapıldı (H1, 2026-10-26; dal `claude/h1-tek-kart`, etiket `tur/h1`; plan ve sapmalar `araclar/plan/h1-uygulama.md`).** Kart `js/ekran-kart.js`'te (`kararKarti`, `kartEtkilesimKur`), ölçüler `STIL.kagit.kart`; dosya, karar paneli, telefon konuşması ve karar anı aynı kartı kullanır; maç telefonunda kart kilitli, kenarla yalnız okunur. Aşağıdaki maddelerden ayrılanlar: kenar etiketi yalnız önizler (tıklama uygulamaz), karar anında 1/2 doğrudan seçer; hazır görüş kartın nötr yüzünde, “Görüş iste” (`tavsiyeBolumu`; içeriksiz oyunda görünmez) ve girişim listesi kartın dışında aynen kaldı. Davranış OYUN_TASARIMI §2, görünüm STIL_REHBERI §7 “Bugünkü uygulama (H1)”, sözleşme TEKNIK_PLAN §10; denetim `akis-deneme.py 3 14b`.

- `js/ekran-telefon.js` `kararKarti` tek kart bileşenine döner (ortak; dosya sağ sayfa, karar paneli, telefon cevap alanı); `js/ekran-an.js` karar anı aynı kart + süre çubuğu; davranış yukarıdaki “Tek kart davranışı”; ölçüler `STIL.kagit.kart` (yeni); erişilebilirlik: klavye ←/→/Enter/Esc, büyük yazı, odak halkası; “Onayla” ve “Vazgeç” kalkar; “Görüş iste” hazır görüş olarak kart üstünde kalır (üçüncü düğme değil). TEST seçenek kutusu kart yüzünde.
- Kabul: `akis-deneme.py` §3 ve §14b güncellenir (kaydırma ve klavye yolları; karar bir kez uygulanır); `kariyer-deneme` 2.2 aynen; `kontrol.py` görüntüsü (dosya, telefon, karar anı); STIL_REHBERI §7 tek kart kuralı, OYUN_TASARIMI §2 “Bugünkü uygulama”; `tur/f4`.

## F5 — Antrenman sahnesi ve arka planda izleme (araştırma + 1–2 oturum; `claude/f5-antrenman`; kendi planıyla)

- Önce araştırma: antrenman türleri (ısınma, pas, şut, orta ve kafa, gelişine vuruş, kuvvet, çift kale, sakatın düz koşusu), drill tablosu ve hocanın antrenman portföyü → `kutuphane/N-antrenman.md`; figür çizimi korunur (`js/animasyon.js`, `js/oyuncular.js`), A10/A11 ve K1 figür borçları burada.
- Ekran düzeni (OYUN_TASARIMI §11 hedefi): antrenman saatinde oda penceresi/balkon figürlerle sürer; dosya ya da telefon açıkken dosya sağa kayar, sol yarıda antrenman görünür (ayrıntı F5 planında, kullanıcıya gösterilir). `js/balkon.js` üç drill → tabloya bağlı antrenman motoru (hafif; maç motoru değil). Gözlem notları hocanın antrenmanından (F3'ün not kalıbı).
- Kabul: figür ölçümü ve çizim tabanı (`s1-anm.json`, KAPILAR); `kontrol.py`; `akis-deneme.py` §15; `tur/f5`.

## F6 — 2.9 günlük akış ve ilk içerik (1 oturum + kullanıcı metinleri; `claude/f6-icerik`; kendi planıyla)

- P12 “Hocaya sabır mı, değişim mi?” (OLAY_KUTUPHANESI; Aşama 3'e uyan tek paket): paket iskeleti `js/icerik-p12.js` (`PAKETLER`, `GELISMELER`, `KARAR_TURLERI`, `MESAJ_*`, `MESELE_OLAYLARI`), koşulları gerçek sonuçlardan (F2–F3: üst üste mağlubiyet, rapor), yer tutucu metinler TEST etiketli; kullanıcı metinleri değiştirir; içerik sürümü 5. Skor hikâye için değiştirilmez.
- 2.9: birkaç günlük tek mesele + sakin/olağan/yoğun günlerden bir hafta, maçlarla (3.7'nin ilk kısmı); `akis-deneme.py` genişler; tempo ölçümü (maç günü 20–35 dk hedefi bilgi).
- Kabul: 2.9'un “yeni kabul” ve “bitiş” satırları (YOL_HARITASI Aşama 2); `kariyer-deneme` 2.2 genişler; kayıt–yükleme sonrası olay ikinci kez uygulanmaz; `tur/f6`.

## F7 — Ligin öbür maçları (3.8; 2026-10-24 kullanıcı kararıyla F4'ün önüne; `claude/f7-lig`)

- Bizim maçımız sürerken haftanın öbür yedi maçı aynı sayfada görüntüsüz, kilit adımla (bizim motorun attığı adım kadar) oynar; seçenekleri saf (`digerMacSecenegi`: hocaların kadrosu ve tarzı, maç tohumu, stat alanı yok), santrayı ilk adımda alır. Canlı Skor'da canlı skor ve dakika; “Odaya dön” sekiz sonucu tek komutla uygular (biri reddedilirse hiçbiri). Puan durumu 16 satırda gerçek, öbür kulüplerin ceza ve sakatlıkları doğal düşer. Ayrıntı `f7-uygulama.md`.

## F6-a — Hoca değişimi ve P12 TEST taslağı (2026-10-24 kullanıcı kararıyla öne; `claude/f6a-hoca-degisimi`)

- `hocaDegistir` komutu (eski hoca ayrılır, TEST tazminat, yeni hocanın tarzı sonraki maçta), `hocaAdaylari`; P12 “Hocaya sabır mı, değişim mi?” kötü sonuç serisinden açılır (gizli gelişme), kanıt maçın okumasından (beklenen gol, tarz izi); iki cevap sabır (söz) / değişim (sıralı aday görüşmesi). Metinler TEST taslağı (karar 35). Ayrıntı `f6a-uygulama.md`. **Yapıldı 2026-10-24 (`tur/f6a`):** sabır süresi 3 maç (plandaki 3 hafta maç takvimine denk düşmüyordu); karar dosyada. F6'nın P12 maddesi bununla karşılandı; F6-b 2.9 ve kullanıcı metinleri.

## Yan hat — İzleme notları (kullanıcı istedikçe)

Kullanıcı 2D'de izler (`index.html?ekran=mac`, `&tarz=konumsal,direkt`, `&tohum=N`; F1'den sonra kariyerden gerçek maç) ve notlarını sohbete yazar. Claude: not başına kodda teşhis (dosya:satır, salt okuma), gerekirse geçici ölçüm, teşhis tablosu `araclar/plan/izleme-notlari.md`; tek anahtarlık ayarlar tur açmadan (ör. `pasEgriKat`; sonra taban yenilenir ve `--ayni` eski değerle); davranış işleri İ1, İ2 … turları olarak planlanıp onaylanır, F turlarının arasına girer. Denge kuralları aynen (40 maç yön, 80 denge, soru başına iki tarama).

## Doğrulama (genel)

- Her F turu: hızlı kademe her düzenlemede (`mac-deneme 4` + KAPILAR satırı; kariyer kuralı değiştiyse `kariyer-deneme`; yeni ad/betik → `ad-denetimi`); oturum sonu (`oturum-sonu d.json --ayni --mac 24` dizüstünde; ekran değiştiyse `kontrol.py`, 2D değiştiyse `akis-2d.py`); kapanış (bütün senaryolar `--seyrek`, `akis-deneme.py` tamamı masaüstünde, hız bütçesi yalnız motor dosyası değiştiyse — F3).
- Motor tabanı `d.json` F boyunca sabit kalır; motor dosyası değişmeyen turlarda `--ayni` 10/10 bütünlük denetimidir.
- Kabul sahnesi üretilmez; kullanıcı oyunu kendisi açar (`chairman-yerel` sunucusu ya da `index.html`), onay sohbette.
