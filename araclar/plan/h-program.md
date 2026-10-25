# H — Oto mod 3 programı (2026-10-25 gece, masaüstü)

> **Durum (2026-10-26, kullanıcı kararı):** H1 yapıldı (`tur/h1`). Kullanıcı oto modu H1'den sonra durdurdu, oyunu inceledi ve sırayı değiştirdi: görsel iş en sona (YOL_HARITASI 49); araya **H2 kullanıcı istekleri** girdi (karar 50; plan `h2-uygulama.md`). Bu belgedeki eski H2 (yeni sezon) artık **H3** (`h3-uygulama.md`), eski H3 (transfer dalları) **H4**'tür (`h4-uygulama.md`); iki dosyada numaralar buna göre değişti. Aşağıdaki metin 2026-10-25 planının kaydıdır; sınırları ve doğrulama kuralları H2–H4 için de geçerlidir.

Durum: planlandı (Fable); uygulama Opus 5.5 ile oto modda, turlar sırayla. Üç planın (omurga, derinlik, sağlamlık) yargıç sentezidir: omurga temel alındı, yargıçların aşıları eklendi, ihlal sayılan maddeler düzeltildi (aşağıda “Sentezde değişenler”). Tur planları `h1-uygulama.md`, `h2-uygulama.md`, `h3-uygulama.md`.

## Bağlam

- `main` 31a8ff9 (G2 kapanışı, makine durumu boşta). Çalışma dalı `claude/stat-gorsel` = `main` + tek commit 824760f: görsel yön ve bilgi mimarisi tartışma kaydı (belgeler: CLAUDE.md, OYUN_TASARIMI.md, STIL_REHBERI.md, YOL_HARITASI.md kararlar 45–47, `araclar/plan/ui-mimari-ve-gorsel-yon.md`, `araclar/plan/OKU.md`, `.gitignore`) ve `prototipler/stat-konsept/` (19 dosya, ~290 KB; three.js post-process kopyaları dahil). Kullanıcı prototipler için “dalda referans” dedi (karar 45).
- Bugünkü iki duvar: (1) her karar hâlâ iki düğme + “Onayla” ile veriliyor; kullanıcının kesin tek kart kararı (YOL_HARITASI 23, 32; OYUN_TASARIMI §2) bekliyor; (2) 30. haftadan sonra İlerle “Sezon tamamlandı; yeni sezon bu sürümde yok (TEST)” diyor (`js/fikstur.js` `SEZON_SONU_METNI`, `ILERLE_ENGEL_EKLERI`); G2'nin sözleşme bitişleri ve kış dönemi döngüyü tamamlayamıyor.
- Motor tabanı `araclar/taban/g1.json`; üç turda da motor dosyasına dokunulmaz, `--ayni` bütünlük denetimidir, hız ölçümü gerekmez.

## Kullanıcı kararı (2026-10-25)

Planlamayı Fable yapar; planı Opus 5.5 oto modda sırasıyla uygular. Her tur kendi dalında; tur sonunda `tur/hN` açıklamalı etiketi, `main`'e alma ve push. Kullanıcı sonra kontrol eder. Görsel/çizim ağırlıklı iş yok; açık kararlar kesinleştirilmez.

## Kesin sınırlar (bu gece)

1. Karar 46 (görsel tarz, dış varlık) ve karar 47'nin yedi noktası (bilgisayar nesnesi, Kadro/Mali sekmeleri, kişiye soru girişimi, kapı/ziyaretçi sahnesi, oyuncu satırı sayıları, haftalık ritim, gazetenin yeri) UYGULANMAZ, bunlara bağımlı iş seçilmez. Tek kart bugünkü kâğıt dilinde (`STIL.kagit` renkleri), yalnız ölçü anahtarı eklenir (`STIL.kagit.kart`).
2. Yeni oyun içeriği yok (karar 7). Eklenen her metin TEST yer tutucudur (karar 35 kipi); yeni kişi (menajer, sayman, sponsor) yok; gazete haberi eklenmez.
3. Yetenek puanı gösterilmez; ses yok.
4. Lig formatı (karar 36; OYUN_TASARIMI §13 “tam sezon için Aşama 5 öncesi kesinleşmeli”) kesinleştirilmez: H2 bugünkü TEST tarifini ikinci sezona aynı 16 kulüple taşır; yükselme/düşme, play-off, kademe değişimi yok; §13 satırı açık kalır; takvim ayrıntıları (geçiş günü, yaz dönemi) TEST ve devam notunda kullanıcıya soru.
5. Motor dosyaları (`js/mac-*.js`, `js/kadrolar.js`), `MOTOR_AYAR`, taban ve 80/160 maç yok; motor denge borçları (gol −0,45, korner −1,3, tedavi duruşu ~1,65) karar 31 gereği izleme notlarına kalır — tedavi payı için anahtar tasarımı (`sakatTedaviPay`, 80 maç × iki değer) yalnız devam notuna “kullanıcı isterse” diye yazılır, uygulanmaz.
6. Her tur doğrulanabilir: `node araclar/kariyer-deneme.js`, `node araclar/mac-deneme.js 4` (“sonuç aynı”), `node araclar/ad-denetimi.js`, `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni`, `python -X utf8 araclar/kontrol.py`, `python -I -X utf8 araclar/akis-2d.py` (masaüstünde `-I` olmadan), `python -X utf8 araclar/akis-deneme.py` (tamamı masaüstünde; bilinen düşüş yalnız 15b); kayıt sürümü değişirse geçiş ve `python -X utf8 araclar/kontrol.py araclar/kayit-deneme.html`.
7. Kayıt biçimini değiştiren tur (H2) kural dosyasına dokunmadan önce bugünkü kodla sürüm 9 örneklerini üretir (G2'nin s8 emsali).

## Claude'un program kararları

- **Dal tabanı `main`, prototipler `main`'e girmez.** H1 dalı `main`'den (31a8ff9) açılır. İlk commit (H0) `claude/stat-gorsel`'den YALNIZ belge dosyalarını alır: `git checkout claude/stat-gorsel -- CLAUDE.md OYUN_TASARIMI.md STIL_REHBERI.md YOL_HARITASI.md araclar/plan/OKU.md araclar/plan/ui-mimari-ve-gorsel-yon.md .gitignore` (`.gitignore` satırı `prototipler/stat-konsept/cikti/`, zararsız). `prototipler/stat-konsept/` alınmaz; `claude/stat-gorsel` dalı silinmez, referans orada kalır. Aynı commit YOL_HARITASI devam notuna “Makine durumu: masaüstü çalışıyor, dal claude/h1-tek-kart” yazar; `git fetch`, `main` bu commit'e ileri sarılır ve push edilir (uzak `main` ilerlemişse durulur, not yazılır). Kullanıcıya soru (devam notu): prototipler `main`'e alınsın mı, dalda mı kalsın.
- **Sıra: H1 → H2 → H3 (koşullu).** H1 kesin karar ve kural katmanı değişmez; H2 oyunun en görünür duvarını kaldırır ve uzun kariyerin omurgasıdır (kayıt sürümü 10, en riskli iş, sigortasıyla ortada); H3 H2'nin yaz dönemiyle yılda iki pencerede görünür, zaman kalırsa ve daraltılabilir. Tahmini toplam 13–17 saat makine zamanı (H1 4–5, H2 6–8, H3 3–4).
- **Sezon arşivi kayıpsız (TEKNIK_PLAN §11 “saklama düzeyi ayrıca seçilir”).** H2 eski sezonun `maclar` ve `fikstur` kaydını `k.sezonlar` içine olduğu gibi taşır, hiçbir veri atmaz; kayıt sıkıştırmanın biçimi (5.2) bu gece seçilmez, yalnız ölçülür (`sezon-deneme --bilesim`: alan başına KB) ve kullanıcıya soru olarak yazılır.
- **İçerik kuralına en dar yol.** H1'de gelen teklifin telefon izi yeni cümle değil, mevcut `tr.kanit.hoca` metninin hocanın ağzından (birinci tekil) eşidir (`tr.hocaGorus`). H3'ün metinleri en çok beş olay + bir hoca mesajı, hepsi TEST.
- **Kart etkileşimi kullanıcı tarifine bağlı.** Sürükleyip bırakmak ve klavye (←/→ önizler, Enter uygular, Esc bırakır). Tıklama uygulamaz: kenar etiketine dokunmak yalnız önizler (ok tuşuyla aynı). Karar anında 1/2 tuşları doğrudan uygular (süreli an; TEST alışkanlık).
- **Karşı teklif başkanın düğmesi değil.** H3'te ikinci teklif alıcının gerçek yeni koşuluyla doğar (aynı kulüp yükseltir ya da başka kulüp girer), ardışık ikinci kart olarak; açık kartı iptal eden “iki teklif arasında seçim” kurgusu yapılmaz (OYUN_TASARIMI §2'nin o seçeneği kullanıcıya kalır). Kaçan transfer ve alternatif arayışı YOL_HARITASI 4.2'nin yazılı maddesidir.

## Sentezde değişenler (yargıç ihlalleri ve aşıları)

- Omurga H0'ın “main'i 824760f'e ileri sar” adımı kaldırıldı → yalnız belge dosyaları, prototipler dalda (üç yargıcın ortak notu).
- Omurga H2'nin “k.maclar atılır, kayıt küçülür” kabulü kaldırıldı → kayıpsız arşiv + bileşim ölçümü; lig formatı/takvim kararları TEST ve kullanıcı sorusu; `ILERLE_SINIRI` 30→32 ve ay başı zincirinin sezon sonundan sonra sürmesi (karar 44'ün G2 sınırı) gerekçesiyle belgeye.
- Omurga H3'ün “rakip teklif açık kartı iptal eder, düşük teklif ezilir” dalı kaldırıldı → tek gelişme iki varyant, ardışık kart (derinlik aşısı); dallar tohum taramasıyla değil `TRANSFER_TEST` olasılıklarını deneme içinde 1 ve 0'a sabitleyerek sınanır (derinlik aşısı); tekrar sınırı (bu dönemde teklif almış oyuncu havuzdan düşer).
- `js/uyum-icerik2.js` atıfları silindi (dosya yok; `kararKarti`'nin iki seçenek yolu tek canlı yoldur).
- Sağlamlık aşıları alındı: kart bileşeni ayrı betikte (`js/ekran-kart.js`) ve tek `kartEtkilesimKur` sözleşmesi, `aria-disabled` kilit (duraklatma ve maç telefonu aynı yol), Esc yalnız önizleme varken yutulur, odak `.kk-kart[data-is=…]`; `TEL_YERLESIM_JS` yeniden tanımlanır; akis §3 kabulü a–g maddeli; `ajandaOnizle` iki seçenek için ayrı hesaplanır ve uyarılar o cevabın yüzünde o cevabın süresiyle; `sezon-deneme` başında diziliş tutarlılık denetimi; `--bilesim` ve tempo sayaçları (ölçü; 3.7 kapanmaz); `KARAR_ANI` arayüzü korunur, §14b'ye “→ tek başına karar vermez” denetimi; H2'de `sezonGecisi`/`yeniSezon` ikinci kez reddedilir, `kayit-deneme.html` koşulur, s9 Ocak örneği açık teklif kartıyla.
- `d-sut` “Üst köşe ≥18 m” NaN satırı: yalnız teşhis (H2-0 araç commit'inde, zaman kalırsa); hücre tanımı ancak araç kusuru kanıtlanırsa düzeltilir, aksi hâlde satır dokunulmaz ve borç kalır (kapıyı gevşetme yok).
- Omurga'nın `KARAR_TURLERI[tur].kisi(k,is)` kancası (aday kartında aday) ve `ILERLE_SINIRI` tuzağının kayıt altına alınması korundu.

## Turlar

| Tur | Dal | Konu | Kayıt sürümü | Süre |
|---|---|---|---|---|
| H1 | `claude/h1-tek-kart` (taban `main` 31a8ff9 + H0 belge commit'i) | F4 tek kart her yerde (dosya, karar paneli, telefon konuşması, karar anı); borçlar: aday kartında kişi bölümü (F6-a), gelen teklifin telefon izi (G2), `dizilisMevkileri` 4-2-3-1 (F1) | 9 (değişmez) | 4–5 sa |
| H2 | `claude/h2-yeni-sezon` (taban `tur/h1`) | 5.1 yeni sezon ve sezon geçişi (TEST tarifi, aynı 16 kulüp), kayıpsız sezon arşivi, kayıt bileşimi ölçümü (5.2 başlangıcı), `macOkundu`/`yasUret`/ay başı zinciri borçları | 10; `KAYIT_GECISLERI[9]` düz veri; s9 örnekleri önce | 6–8 sa |
| H3 | `claude/h3-transfer-dallari` (taban `tur/h2`; koşullu) | 4.2 kalan / 4.3 kişisiz dallar: ikinci teklif (yükselt / başka kulüp), kaçan transfer ve alternatif kararı, tekrar sınırı | 10 (değişmez) | 3–4 sa |

Kesilme kuralı: bir tur kabul koşullarını geçmeden kapanmış sayılmaz ve `main`'e alınmaz. H2 uzarsa H3 açılmaz (ya da yalnız ikinci teklifle daraltılır); yapılmayan devam notuna “H3 planlandı, yapılmadı” diye yazılır. Gece kesilirse yarım dal push edilmiş kalır, `main` değişmez.

## Genel doğrulama (her tur)

- Hızlı: her düzenlemede `node araclar/mac-deneme.js 4` (“sonuç aynı”); kariyer kuralı değiştiyse `node araclar/kariyer-deneme.js`; yeni betik ya da üst düzey ad → `node araclar/ad-denetimi.js`.
- Oturum sonu (commit öncesi): `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni` (40/40 birebir; bilinen kabul dışı satırlar c-1v1, d-sut köşe, d-topcu dışında yeni `!` yok); ekran değiştiyse `python -X utf8 araclar/kontrol.py`; 2D ya da karar anı değiştiyse `python -X utf8 araclar/akis-2d.py` (masaüstü, `-I`'sız).
- Tur kapanışı: `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni --seyrek`; `python -X utf8 araclar/akis-deneme.py` tamamı (bilinen düşüş 15b); belgeler ve `git diff --check`; H2'de ayrıca `kontrol.py araclar/kayit-deneme.html`.
- Her commit push edilir (önce `git fetch`; uzak dal başka makineden ilerlemişse push yok, durulur, not yazılır; zorla push yok).

## `main`, etiket ve makine durumu

- H0: `main`'den `claude/h1-tek-kart`; belge dosyaları + “Makine durumu: masaüstü çalışıyor, dal claude/h1-tek-kart” satırı; `main` ileri sarılır, push.
- Tur kapanışı: `git tag -a tur/hN -m "<başlık ve maddeler>"`, `git checkout main && git merge --ff-only claude/hN-…`, push (`main` ve etiket), dal silinir; sonraki dal yeni `main`'den açılır; devam notundaki satır sonraki dalın adına geçer.
- Bitişte satır “Makine durumu: boşta (masaüstü, 2026-10-26)” olur ve `main`'e alınır.
- `main`'e her push GitHub Pages'e yayınlanır: tur kabul koşullarını geçmeden `main` değişmez.

## Kullanıcıya dönecek sorular (devam notuna yazılır)

1. `prototipler/stat-konsept/` `main`'e alınsın mı (bugün `claude/stat-gorsel` dalında)?
2. Yeni sezon takvimi TEST: geçiş 1 Haziran 09:00, yaz transfer dönemi 15 Haziran–31 Ağustos, ikinci sezon Eylül'ün ilk Cumartesi 19:00; kesin lig formatı (yükselme/düşme, play-off) açık.
3. Eski sezonun okumaları (hocanın yorumu, defter notu, Canlı Skor “Son maç”) arşivle birlikte ekrandan düşer; arşivden okutmak yeni ekran ister (karar 47'ye bağlı).
4. Yaz ekonomisi TEST: Nisan–Ağustos maaş çıkar, lig payı girer, bilet yok → kasa erir; tutarlar `MALI_TEST`, `SOZLESME_TEST`, `TRANSFER_TEST`.
5. Kayıt sıkıştırmanın biçimi (5.2): bileşim ölçümü tabloda; eski sezonların `maclar` kaydı tutulsun mu, özete insin mi.
6. H3'ün dışında bırakılan dallar: menajer talebi, sızıntı/gazete, pazarlık düğmesi (kişi ve gazete kararına bağlı).