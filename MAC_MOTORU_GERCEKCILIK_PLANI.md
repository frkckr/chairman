# Chairman — maç motoru: ilkeler, kurallar, kararlar ve başvuru

**Bu belge ne için (2026-10-22 sadeleştirmesi):** maç motorunun uygulayıcıya bağlayıcı ilkeleri, kuralları ve geçerli kararları; ekleri başvurudur (özellik türetme, roller, hareket kütüphanesi, duran top rutinleri, gerçek değerler, robotluk karnesi) ve motorun araştırma kaynakları. İş sırası ve program [FUTBOL_KUTUPHANESI §12](FUTBOL_KUTUPHANESI.md#12-program) ve [YOL_HARITASI](YOL_HARITASI.md)'ndadır; test kademeleri [CLAUDE.md “Kontrol”](CLAUDE.md#kontrol) ve [araclar/KAPILAR.md](araclar/KAPILAR.md)'de.

**Tarih:** Bu belge 2026-10-03'te 30 turluk gerçekçilik planı olarak açıldı; T0–T23, A2–A9, H1, M0–M3 ve U1 burada planlandı ve kapandı. Turların teşhisi, kabul tabloları ve sonuçları git etiketlerindedir: `git show tur/<ad>:MAC_MOTORU_GERCEKCILIK_PLANI.md` (son tam hâli `tur/p2`). Kod yorumlarındaki ve diğer belgelerdeki “gerçekçilik planı §4 Tn”, “Tn — Sonuç”, “§5a borç” ve “Ek G”, “Ek H”, “Ek I” göndermeleri o hâle aittir. Bölüm eşlemesi: eski §3 (tasarım ilkeleri) → bugün §1, eski §6 (uygulayıcı kuralları) → §2, eski §7 madde n ve “§7.n” (kararlar) → §3 tablosu (gerekçeleri `tur/p2` §7'de), eski Ek G → kutuphane/J §J.12; Ek A–F aynı adla durur. Figür çiziminin hareket dili (eski Ek G, ölçütler G9) ve hareket verisinin kaynakları maç 2D olduğu için (P2, 2026-10-21) antrenman serisine geçti: [kutuphane/J §J.12](kutuphane/J-beden-dili.md#j12-figür-çizimi-hareket-dili-ve-kaynaklar-antrenman-serisi-için).

---

## 1. Tasarım ilkeleri

1. **Karar ve uygulama aynı saf işlevi kullanır.** Pas (`pasPlani`) ve kaleci (`kaleciTahmin`) örneği taşıma, çalım, müdahale, hava topu ve duran topa genişler. Saf işlev rastlantı çekmez, önbellek yazmaz.
2. **Sonuç geometri ve zamanlamadan çıkar.** Rastlantı yalnız girdidedir: tepki süresi, vuruş hatası, okuma hatası, hakemin görmesi.
3. **Önce ölçü, sonra kod.** Her tur kendi senaryosu ve ölçü satırlarıyla başlar ve kapanır.
4. **Efor ölçülü harcanır.** Azami ivme ve depar yalnız mücadele, kovalama ve koşuda kullanılır; yer tutma rahat tempoda yapılır.
5. **Aynı durum, farklı oyuncu, farklı davranış.** Özellik "ne kadar iyi"yi, eğilim "neyi dener"i belirler; fark sahada davranış olarak görünür (2026-10-22: oyuncu etkisi öncelik).
6. **Önce tepeden okunan.** Maç tepeden 2D izlenir (P2, 2026-10-21): önce tempo, akış, takım şekli, koşular ve topun yolu; beden ayrıntısı antrenman sahnesinindir.
7. **Kısa maç 90 dakikanın özeti gibi oynar.** Motorun maçı 20 dakikalık oyun saatidir (U1; tempo B ile ×1'de ~28 dk). Daha az ama amaçlı atak; maç başına olay sayıları gerçeğin kabaca yarısı ile gerçek değeri arasındadır.
8. **Atak zihniyeti (2026-10-22, kullanıcı).** Futbol yenme oyunudur: varsayılan takım kazanmak için oynar, geri pas bir planın adımıdır (rakibi çekip arkaya, oyunu çevirme, üçüncü adam). Kontrollü ya da savunmacı hocalar azınlıktır ve bağlama bağlı davranır (kadro zayıflığı, skor, rakip).

## 2. Uygulayıcı kuralları

- Rastlantı yalnız `this.rast`; `…Tahmin` ve `…Degeri` işlevleri saf.
- Oyuncuya yeni alan `varlik` içinde baştan tanımlanır (128 alan sınırı: önce seyrek alanlar alt nesneye; `ad-denetimi.js` (f)). Yeni ayar anahtarı önce `js/mac-motoru.js` `MOTOR_AYAR`'da bildirilir, değeri sahibi akışın `ayarEkle`'siyle atanır; yeni dosya `index.html` sırasına ve `ad-denetimi.js`'e uygun eklenir. Blok içinde `function` bildirimi kullanılmaz.
- Kişisel sapma ve düşünme anı kaydırması tohumdan ve oyuncu sırasından türetilir.
- Rastlantı çekiliş sırası değişen turda `--ayni` kullanılmaz; `--karsilastir` istatistikle bakılır. Sonucu değiştirmemesi gereken düzenlemede `--ayni` zorunludur.
- Mekanik senaryoda doğrulanmadan `MOTOR_AYAR` düğmeleriyle denge aranmaz; 4/10 maçla denge kararı verilmez.
- Denenip kapatılan anahtar ölçüsüyle birlikte belgeye yazılır ve kodu temizlik turunda kaldırılır (2026-10-22'de yedisi kaldırıldı; git'te durur).
- Hız bütçesi: aynı süreçte dönüşümlü ölçüm, ortanca artış ≤ %10, 1000 adım ≤ 250 ms (yöntem CLAUDE.md “Kontrol”).
- Motor çizime yalnız alan ekler; çizim (2D pul, figür) motoru yalnız okur; her yeni alanın çizimde yedek davranışı olur (TEKNIK_PLAN §8).
- Bir tur bitmeden ötekine geçilmez.

## 3. Geçerli kararlar

Ayrıntılı gerekçeler `tur/p2` etiketindeki §7'dedir.

| # | Konu | Geçerli karar |
|---|---|---|
| 1 | Maçın temposu | Amaçlı atak (kullanıcı, 2026-10-04). Dar kabul bantları 2026-10-19'da kalktı; geniş sağlık aralığı [FUTBOL_KUTUPHANESI §11.1](FUTBOL_KUTUPHANESI.md#11-ölçüler-ve-test-rejimi). 2026-10-22: atak zihniyeti, amaçsız geri pas zincirinin ölçülmesi ve azaltılması (B turu): geri pas payı önü açıkken ve zincirde söner, tarzın sabrıyla (konumsal geç, direkt erken; `geriPasAmac`, `tarzSabir`); varsayılanla 40 maç gol 3,70 (önce 2,40), sağlık aralığı içinde. |
| 2 | Özellikler | Kadro verisine yeni özellik eklenmez; 11 özellikten alt özellik, rol ve eğilim türetilir (Claude, 2026-10-07; Ek A, Ek B). Kabiliyetin tek girişi `js/mac-profil.js`. Kadro profillerini TEST verisi olarak Claude yazar (C turu, 2026-10-22): roller özelliklerin şeklinden çıkar, `kayit.rol`/`egilimler` ile sabitlenmez; seviye dönüşümü (güçlü/zayıf) yalnız araçların içinde, ad uydurulmaz. |
| 3 | Duran top süresi | Tempo B: duruşlar gerçeğin kabaca yarısı ve bağlama göre değişken, duruşta maç saati 2 kat (kullanıcı, 2026-10-19 gece); penaltı ~40, gol sonrası ~35 sn (S1). |
| 4 | Sakatlık | Maç başına ~1 kısa duraklama ve ~0,3 oyundan çıkma (kullanıcı, 2026-10-11). |
| 5 | Dönem | Kurallar bütünüyle bugünün kurallarıdır (VAR, iptal, avantaj dahil); 1999 yalnız görüntüdür (kullanıcı, 2026-10-19). Kalan kural öğeleri (VAR, çoklu top, 8 sn sayımı) Z10'da. |
| 6 | Sıkıştırma | Motorun maçı 20 dk oyun saati (U1, kullanıcı 2026-10-12). Oyun dakikası başına pas gerçeğe yakındır; önemli olaylar (gol, şut, kart, düello) ve savunma eylemleri gerçeğin 2,5–3,5 katıdır. Böylece gol, şut ve kart maç başına gerçek değere varır, pas, taç ve faul gerçeğin kabaca yarısında kalır. Sahiplik başına pas (~yarısı), PPDA (~1/2,5–1/3) ve kart/faul oranı (~2 kat) yapı gereği sapar; Ek E'deki gerçek değerlerine kovalanmaz, tarz karşılaştırmasında göreli okunur. |
| 7 | Hava koşulları | Şimdilik gösterilmez (kullanıcı, 2026-10-11); motor kapısı `kosullar` (ıslak zemin, rüzgâr) kalır. |
| 8 | Hareket verisi | A7'de uygulandı (CMU, Fukuchi 2017 CC BY; `js/hareket-egrileri.js` yalnız sayı tablosu). Yalnız figür çizimi içindir (antrenman); atıf [kutuphane/J §J.12](kutuphane/J-beden-dili.md#j12-figür-çizimi-hareket-dili-ve-kaynaklar-antrenman-serisi-için). |
| 9 | Vuruş hazırlığı | `vurusSureleri` motor davranışıdır (türüne göre geri salınım ve asgari hazırlık; baskıda acele). D'den (2026-10-22) beri uzaklaştırmanın hazırlığı adım sayısından (`uzakHaz`: 0 / 1 / 2 adım 0,06 / 0,22 / 0,42 sn; zaman varsa en az bir ayar adımı). |
| 15 | Pas hızı, eğri ve uzaklaştırma (D, Claude ve kullanıcı, 2026-10-22) | Yerden pas çıkış hızı uzayında dört aileden seçilir (bırakma, itme, sert ayak içi, sürülmüş; `aileAdaylari`); planlayıcı hızlı topun bedelini bilir (pasif erişim, yanal erişim, aşım; Pex'li ve zamanlı seçim) — bu olmadan aile başına 10 puan iyimser. Tavan ortalama vurucunun şut azamisi (`pasTavan` 1,0; oyuncuya bağlanınca zayıf pasör yumuşak ve isabetli pas atıyor, seviye farkı siliniyordu). Eğri aileden ve plaseden; **kullanıcı kararı: daha da çok falso** (`pasEgriKat` 2,0, yalnız pasta; orta ve korner `ortaEgriKat` 1,6). Uzaklaştırma amaçlıdır: değer "başarı × kazanç − başarısızlık × kayıp", hedef saha içinde, taç ve korner yalnız gerçek tehlikede, kurtarış topu pas sayılmaz (`clear`). Kale vuruşunun planı erken kurulur, takımın şekli ve jest onu gösterir. Alçak havadan kısa pas ve kaleciye geri pasın risk değeri ölçüde tutmadı, kapalı. Ayrıntı FUTBOL_KUTUPHANESI §12.4 D. |
| 10 | Faul | Faul temastan doğar; eşikle zorlanmaz (sağlık aralığı 6–20). |
| 12 | Tarz (B, Claude, 2026-10-22) | Tarz maç başına seçilir: oyunda ve `mac-deneme`'de tohumdan atak ağırlıklı `TARZ_DAGILIM` (dikey .22, ilişkisel .18, konumsal .17, direkt .15, kanat-orta .15, dengeli .13; konuk evinkini almaz), senaryolarda kadronun tarzı; tarz vektörü iştah, tempo ve sabır taşır. Maç içinde kademeli değişir (`tarzDegistir`: talimat duruşta, en geç 20 sn; 40 sn'lik yumuşak geçiş) — bugün geliştirici panelinin TEST seçimi, ileride hocanın kararı. Tarz kenarı konumsal → direkt +0,34 gol/maç [%95 0,07–0,62] (hedef +0,2–0,3; fark ölçü belirsizliğinin altında, ayar yapılmadı). |
| 14 | Oyuncu farkı (C, Claude, 2026-10-22) | Eğilim ve rol oyuncunun kendi seviyesine göre (`egilimGoreli` 1: referans 10 saha özelliğinin ortalaması, türetilmiş alt özellikler de; zayıf ayak ve tutarlılık beceri sayılır): aynı profilin güçlüsü aynı zihniyetle oynar, seviye isabet, hız ve kapıdan gelir (karar 22). `egilimGuc` 1,0 (1,5'te forvet çifti ayrışmıyor, seviye ÷ profil 1,16). Tepe hız `hizAralik` [5,75; 3,4; 10,6] (0,65 hızda değişmez). Falso `falsoProfil` (pas özelliği 0,65 merkezli ve falsoluPas; orta ve korner dokunulmaz), ileri uzun pas `uzunEgilim`, kendi yarısından ileri pas ve taşıma `cikisEgilim`. |
| 13 | Kutu savunması (B1d, Claude, 2026-10-22) | Kutu markajı ve kutu savunmasının kapısı (32 m / 30 m) top kaleye gecikmeli yerinden yakınsa anlık yerden açılır (`kutuKapiAnlik`); T1'in 4 sn yumuşatılmış, 0,45 sn geriden gelen top yeri çabuk dikey girişte kutuyu boş bırakıyordu (B1'le gerçekleşen ÷ konum xG 1,52). Z5-2'den B'ye alındı (sağlık kabulü); blok takibi ve geri koşu Z5-2'de. |
| 11 | 2D | Maç tepeden 2D izlenir; figürlü motor antrenman sahneleri içindir (kullanıcı, 2026-10-21 gece; [kutuphane/M](kutuphane/M-pul-gorunumu.md)). |
| 17 | Bitmeyen maç (F7, Claude, 2026-10-24) | Maç her zaman biter: taçta “hazir” evresinde top atıcının elinde değilse ya da tac eylemi silindiyse evre getir'e döner; gol evresinde süren değişiklik sıradaki sakatlığı bekletirse değişiklik orada ilerletilir; son çare duruş ve gol evresi 180 motor sn (`DURUS_SON_CARE`, `GOL_SON_CARE`), maçın bütünü için motor zamanı 4500 sn (`MAC_SON_CARE`: o anki skorla biter; olay `macTavan`). Sağlıklı maçlar değişmez (`d.json`'a 39/40 birebir; tohum 13 eskiden bitmiyordu); taban `f7.json`. `mac-deneme` bitmeyen maçı kabul dışı sayar |
| 16 | Hocanın tarzı ve maçın kaydı (F3, Claude, 2026-10-24) | Kariyer maçında iki takımın tarzı hocalarının tarzıdır (`secenek.tarz`; tohumdan `'dagilim'` yalnız kariyersiz maçta ve araçlarda); `m.hoca` taban yaması kullanılmaz (tarz vektörü varken tabanın direkt, pres, tempo, sakin alanları etkisiz; maç içi hoca kararı Z7-2). Maçın kaydı salt kayıttır, sonucu değiştirmez: şut listesi (konum xG'si), takım başına uzun pas, girdinin on biri; kayıttaki golcü: 4 sn içinde aynı takımın çerçeveye giden ya da kalecinin dokunduğu şutu girerse gol şutu atanındır (`b.sonSut`; motorun `own` bayrağı, güven ve sevinç değişmez). “Santraya geç” oyunda `macaGec` vermez, maç öncesi doğal biter (kullanıcı kararı) |

---

## Ek A — Alt özelliklerin türetilmesi (başlangıç önerisi)

Hepsi 0–1; `kütle` boy ve yapıdan (mevcut `kutle`), 0–1'e ölçeklenir. Her birine ad özetinden ±0,08 sapma eklenir.

| Alt özellik | Türetme |
|---|---|
| çabukluk | 0,55·hız + 0,25·(1 − kütle) + 0,20·sürüş |
| çeviklik | 0,50·sürüş + 0,30·hız + 0,20·(1 − kütle) (mevcut `hrkCeviklik`) |
| güç | 0,50·sertlik + 0,50·kütle |
| denge | 0,40·güç + 0,30·çeviklik + 0,30·sertlik |
| sıçrama | 0,60·kafa + 0,20·hız + 0,20·güç |
| ilk dokunuş | 0,55·sürüş + 0,45·pas |
| soğukkanlılık | 0,60·karar + 0,40·(forvette şut, diğerlerinde pas) |
| sezgi | 0,50·karar + 0,50·görüş |
| pozisyon alma | 0,50·müdahale + 0,50·karar |
| topsuz hareket | 0,40·görüş + 0,30·karar + 0,30·hız |
| yaratıcılık | 0,50·görüş + 0,30·sürüş + 0,20·pas |
| çalışkanlık | 0,60·dayanıklılık + 0,20·sertlik + 0,20·karar |
| agresiflik | 0,70·sertlik + 0,30·(1 − karar) |
| zayıf ayak | 0,35 + 0,40·ilk dokunuş (iki ayaklıda 1) |
| duran top | 0,50·pas + 0,30·şut + 0,20·görüş |
| orta | 0,60·pas + 0,20·sürüş + 0,20·görüş |
| şut gücü | 0,60·şut + 0,40·güç |
| tutarlılık | 0,50 + 0,40·karar |

**Uygulama (T3, 2026-10-07):** `js/mac-profil.js` `PRF_ALT` bu tabloyu veri olarak tutar (çeviklik `hrkCeviklik` ile aynı, sapmasız; kütle01 = (kütle − 55)/45). Ek B'ye `topuSurer` eğilimi eklendi (sürüş 0,6, çabukluk 0,2, pas −0,2; taşıma kararı ve çalım sıklığı); `uzaktanVurur` tabanı şut 0,3 + şut gücü 0,3'tür ve rol belirler (iki yönlü +0,5, içe kat eden +0,4, hedef forvet −0,3, fırsatçı −0,4). Roller: KL çizgi kalecisi / süpürücü; stoper sert / oyun kuran; bek savunmacı / bindiren; merkez kesici / oyun kurucu / iki yönlü; kanat çizgi / içe kat eden / oyun kuran; FV hedef / fırsatçı / derine gelen. Eğilim = clamp(3·Σ w·(değer − 0,5) + rolün varsayılanı, −1, 1).

## Ek B — Roller ve eğilimler

**Roller** (profil uyumuyla seçilir)

| Mevki | Rol | Topsuz | Topla |
|---|---|---|---|
| Kaleci | çizgi kalecisi / süpürücü | çizgide / savunma arkasını toplar | uzun / kısa oyun kurar |
| Stoper | sert stoper | öne çıkıp keser | basit oynar, uzaklaştırır |
| Stoper | oyun kuran stoper | çizgiyi tutar | topu taşır, hat kıran pas |
| Bek | savunmacı bek | geride kalır | güvenli pas |
| Bek | bindiren bek | kanattan çıkar | orta, çizgiye iner |
| Orta saha | kesici | savunmanın önünde | basit pas, taktik faul |
| Orta saha | oyun kurucu | derine gelir | yön değiştirir, ara pası |
| Orta saha | iki yönlü | ceza sahasına geç girer | şut, ver-kaç |
| Kanat | çizgi kanadı | kenarda genişlik | topu atıp koşar, orta |
| Kanat | içe kat eden | yarı alana girer | güçlü ayağına alıp şut |
| Kanat | oyun kuran kanat | içe gelir, top ister | ara pası |
| Forvet | hedef forvet | stoperlerin arasında | sırtı dönük alır, indirir, kafa |
| Forvet | fırsatçı | ofsayt çizgisinde | tek vuruş, arkaya koşu |
| Forvet | derine gelen | orta sahaya iner | bağlantı, ara pası |

**Eğilimler** (−1…+1): topu atıp koşar, içe kat eder, çizgiye iner, topu fazla tutar, tek vuruş oynar, öldürücü pas dener, oyunun yönünü değiştirir, uzaktan vurur, plase vurur, kaleciyi aşırtır, sırtı dönük oynar, kanallara koşar, ceza sahasına geç girer, derine gelir, kayarak girer ↔ ayakta kalır, sıkı markaj yapar, tehlikeden oynayarak çıkar ↔ uzaklaştırır, zayıf ayağından kaçınır, hakeme itiraz eder.

## Ek C — Hareket kütüphanesi

| Hareket | Ön koşul | Uygun durum | Mekanik |
|---|---|---|---|
| Topu at, koş | çabukluk ya da hız yüksek | önünde alan var, savunmacı duruyor | top 6–10 m öne; yarış `varisZamani` ile |
| Sağından at, solundan geç | hız ve çeviklik | savunmacı üstüne geliyor | top bir yandan, oyuncu öbür yandan |
| Hız değiştirme | herkes | yan yana koşu | yavaşla, patla (bugün var) |
| Dur-kalk | çabukluk | savunmacı aynı hızda | tam fren, yeniden depar |
| Gövde çalımı | sürüş orta üstü | savunmacı bekliyor | dokunmadan yana yüklenme (bugün var) |
| Makas | sürüş yüksek | karşı karşıya, düşük tempo | ayak topun üstünden döner; yanıltma gücü yüksek |
| İçe / dışa kesme | çeviklik | savunmacı tek yana yüklü | keskin yön değişimi, kısa itme |
| Şut çalımı | şut pozisyonu | savunmacı bloğa atlıyor | vuruş hazırlığı iptal, yana dokunuş |
| Topu çekme | ilk dokunuş | çizgide, sıkışmış | tabanla geri çekme, dönüş |
| Sırtla dönme | güç ya da çeviklik | sırtı dönük, rakip dibinde | rakibin yüklendiği yanın tersine |
| Rulet | sürüş çok yüksek | dar alan | 360° dönüş; hata riski yüksek |
| Bacak arası | sürüş çok yüksek | savunmacının bacakları açık | seyrek |
| Şapka | sürüş çok yüksek | seken top | seyrek |

## Ek D — Duran top rutinleri

| Durum | Hücum | Savunma |
|---|---|---|
| Korner | ön direğe sert + uzatma; arka direğe asma; penaltı noktasına; kısa korner; yaya geri pas; perdeleme ve aldatma koşusu; içe ya da dışa dönen top | karma düzen; isteğe bağlı direkte adam; kısa kornere çıkan; ileride 1–2 hızlı oyuncu |
| Tehlikeli serbest vuruş | barajın üstünden falso; kaleci köşesine sert; barajın altından; kısa pas–şut; topun başında iki kişi | baraj 2–5 (mesafe, açı, vuran); zıplama; kaleci uzak direkte |
| Kenardan serbest vuruş | içe dönen orta; arka direğe; stoperler ceza sahasında; yayda ikinci top | ceza sahası çizgisinde hat; adam paylaşımı |
| Uzak serbest vuruş | uzun top hedef forvete; ya da kısa | blok yerini alır |
| Taç | hızlı; çizgi boyunca; gel-git; uzun taç | atanın önü ve yakın alıcı kapatılır |
| Kale vuruşu | kısa (stoperler açık); uzun (hedef forvet) | pres ya da orta blok |
| Penaltı | atıcı duran top ve soğukkanlılıktan; yaydan ribaund koşusu | kaleci ipucunu okur (bugün var) |
| Santra | geri pas + düzen; gerideyken hızlı | — |

## Ek E — Gerçek değerler (başvuru)

| Konu | Değer |
|---|---|
| Maçta süre dağılımı | durma %19,5, yürüme %41,8, tırıs %16,7, koşu %16,8, depar %1,4 |
| İvme–hız profili (profesyonel erkek) | 1. lig: A0 7,37, S0 9,61, en yüksek ivme 5,94, en yüksek hız 8,91; 2. lig: 7,12 / 9,46 / 5,68 / 8,75 (m/sn², m/sn) |
| İvmelenme sıklığı | ≥2 m/sn²: maç başına ~423, ortalama 14 sn'de bir (üst düzey kadın futbolu); yavaşlamalar ivmelenmelerden sık |
| Top ayakta | oyuncu başına 90 dakikada toplam ~1 dk 49 sn, en çok ~50 dokunuş |
| Sahiplik zinciri | ortalama 9,5–9,6 sn; takıma göre 2,9–5,1 pas |
| PPDA | beş büyük lig ortalaması ~11 |
| Şut | %68'i ceza sahası içinden; takıma göre ortalama 13,6–16,1 m |
| Duran top golleri | %20–30 |
| Korner | %1,6–4,1'i gol; %20,5 kısa, %36 içe, %43 dışa dönen |
| Doğrudan serbest vuruş | ~%6 gol (uzmanlarda ~%13) |
| Baraj | 2–5 kişi; ~32 m ötesinde 0–1 |
| Vuruş hızı | iç ayak ~21 m/sn; azami içüstü 28–30 m/sn; aralık 18–35 |
| Top | sürükleme düşüşü Reynolds 2,2–3,0×10⁵ (yaklaşık 15–22 m/sn; yeni toplarda daha düşük); hızlı topta katsayı ≈ 0,22 |
| Etrafa bakma | iyi oyuncuda saniyede 0,4–0,6 bakış; çok bakanlar %17 daha çok pas tamamlar |
| Skor etkisi | gerideki takım daha çok şut atar ve topa daha çok sahip olur; öndeki geri çekilir |
| Sakatlık | 1000 maç saatinde 25–30 (maç başına yaklaşık bir) |
| Duruşlar | maçta ~108 duruş (taç 40, serbest vuruş 33, kale vuruşu 17, korner 10), ortalaması 18,7 sn, sürenin %38'i (Bundesliga, 16 maç); öndeki takımın kale vuruşu maçın sonuna doğru uzar |
| Duruştan sonra başlatma | takım ortalaması 24–31 sn (Premier Lig 2022-23); kale vuruşunda en yavaş takım 36 sn, ötekiler ≤ 33; kornerde en yavaşı 44,5 sn |

## Ek F — Robotluk karnesi: ölçüm tanımları

Hepsi top oyundayken (`phase==='play'`), saha oyuncuları için; rastlantı çekmez, önbellek yazan motor yöntemlerini çağırmaz. Uygulama: `araclar/olcumler/r-karne.js` (takım ve maç düzeyi; `mac-deneme.js` ile) ve `araclar/oyuncu-karnesi.js` (karar izi, oyuncu tablosu, yetenek–davranış ilişkisi). Eklenti eklendikten sonra 8 tohumda `--karsilastir --ayni` 8/8 aynı: ölçüm motor sonucunu değiştirmez.

- **Hız bölgeleri:** süre payı; <0,2 dur, <2 yürü, <4 tırıs, <5,5 koş, <7 hızlı, ≥7 depar. Ayrıca topa uzaklığa göre (<10, 10–25, >25 m) ve mevkiye göre.
- **Eşzamanlı koşu:** 0,5 sn'de bir, 2 m/sn üstündeki saha oyuncusu sayısı.
- **İvmelenme:** 0,2 sn pencerede hız büyüklüğü değişimi; 3 m/sn² üstüne çıkış sayısı (1 sn dinlenme aralığıyla), oyuncu başına dakikada. Kilitli eylemler hariç.
- **Top ayakta süre:** oyuncunun `ball.sahip` olduğu andan `pass` ya da `shot` olayına kadar.
- **Taşıma:** bir oyuncunun kesintisiz sahiplik dönemi; süre, katedilen yol, `sonDokunus.tur==='surus'` sayısı.
- **Sahiplik zinciri:** bir takımın oyuncusu `sahip` olduğunda başlar; öbür takım `sahip` olunca ya da oyun durunca biter. Süre, `ist.pasTamam` farkı, şutla bitme.
- **Top kaybı nedeni:** el değiştirme anından önceki olaylara göre: `steal` (1,5 sn) müdahale; `kotuKontrol` (2,5 sn); `header` (2,5 sn) hava topu; kaybeden takımın `pass` olayı (4 sn) kesilen pas; kalan diğer.
- **PPDA:** topu tutan takımın kendi kalesinden itibaren sahanın %60'ında yaptığı paslar ÷ rakibin aynı bölgedeki müdahale + faul + pas kesme sayısı.
- **Pas ağı:** `kararVer` çıktısında alıcının grubu (stoper, bek, merkez, kanat, forvet).
- **Şut yeri:** `shot` anında vuranın ceza sahasında olup olmadığı; `dist`; kafa şutu payı.
- **Gol kaynağı:** `goal` anında `sonKullanim` 10 sn içindeyse o duran top; değilse açık oyun; sahiplik kendi yarıda başlayıp 12 sn içinde gol olduysa hızlı hücum.
- **Duran top düzeni:** duruştan oyuna geçiş anında ceza sahasındaki hücumcu ve savunmacı sayısı, kendi yarısında kalan hücumcular ve hız ortalaması, `barajdakiler.length`, 1,6 sn içinde şut (doğrudan), 8 sn içinde şut ve gol.
- **Yetenek–davranış ilişkisi:** oyuncu başına süreye oranlanmış sayılar ile özellik arasında Pearson r.

## Kaynaklar

- Maçta hareket dağılımı: https://jssm.org/jssm-06-63.xml-Fulltext
- İvme–hız profili: https://jhk.termedia.pl/The-Acceleration-Speed-Profile-in-Professional-Soccer-Players-nA-Comparative-Study,220252,0,2.html
- İvmelenme ve yavaşlama sıklığı: https://lida.sport-iat.de/ta/Record/4044737?lng=en · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8471310/
- Yüksek tempolu koşu (Bradley 2009): https://sure.sunderland.ac.uk/3478
- Top ayakta süre: https://www.newsday.co.zw/thestandard/sport/article/200029590/on-the-ball-when-off-the-ball
- Sahiplik zincirleri: https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25 · https://www.premierleague.com/en/news/4426039/opta-analyst-on-long-balls-long-throws-key-tactical-trends-spotted-in-2025-26-season
- PPDA: https://statsbomb.com/?p=10118 · https://www.premierleague.com/en/news/4250153
- Şut verisi: https://theanalyst.com/articles/premier-league-2024-25-shot-data
- Duran top golleri: https://www.fantasyfootballscout.co.uk/2025/10/18/just-how-important-are-set-pieces-in-fpl
- Korner: https://eprints.chi.ac.uk/id/eprint/5013/ · https://www.ingentaconnect.com/content/uwic/ujpa/2013/00000013/00000001/art00012 · https://vu-9.eprints-hosting.org/40479/1/Kubayi-2020-Cornerkicks.pdf
- Serbest vuruş: https://blog.soccerment.com/?p=4905 · https://theanalyst.com/2025/03/free-kick-specialists-celebrating-an-endangered-species
- Baraj: https://keeperstop.com/goalkeeper_guidelines_for_setting_a_wall
- Duran top rutinleri: https://guidetofootball.com/tactics/set-piece-routines/
- Top aerodinamiği: https://www.physics.usyd.edu.au/~cross/TRAJECTORIES/Sports%20Balls.pdf · https://eprints.whiterose.ac.uk/98035
- Zemin ve top: https://digitalhub.fifa.com/m/58aa765dd3e85f26/original/FIFA-natural-pitch-rating-system_EN.pdf · https://www.isss-sportsurfacescience.org/downloads/documents/A7ZD60AH55_Gabrielsen_Ball_Roll.pdf.pdf
- Vuruş hızı: https://pmc.ncbi.nlm.nih.gov/articles/PMC4234773 · https://jssm.org/jssm-06-154.xml-abst
- Çalım araştırması: https://www.tsukuba.ac.jp/en/research-news/20260521110000.html
- Etrafa bakma: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.553813/pdf
- Skor etkisi: https://blogarchive.statsbomb.com/articles/soccer/score-effects/ · https://www.scitepress.org/Papers/2013/46787/
- Pres tetikleyicileri: https://learning.coachesvoice.com/cv/in-focus-high-press/ · https://voor.sport/en/mag/pressing-and-a-quick-guide-to-pressing-triggers
- Sakatlık: https://bjsm.bmj.com/content/45/7/553
- Duruşlar (Siegle ve Lames 2012, Journal of Sports Sciences 30(7) 619–624): https://lida.sport-iat.de/dfb/Record/4024884?lng=en · duruştan sonra başlatma süreleri (Opta, Premier Lig 2022-23): https://theanalyst.com/articles/guide-to-premier-league-time-wasting/
- En az sarsıntı modeli: https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/MinimumJerkHypothesis.ipynb
- Güce bağlı hareket gürültüsü: https://www.doi.org/10.1038/29528
- Alan kontrolü ve sahiplik değeri: https://archive.trainingground.guru/articles/william-spearman-how-liverpool-create-pitch-control · https://www.sloansportsconference.com/research-papers/decomposing-the-immeasurable-sport-a-deep-learning-expected-possession-value-framework-for-soccer
- RoboCup HELIOS (eylem zinciri, diziliş): https://staff.fnwi.uva.nl/a.visser/activities/robocup/RoboCup2013/Symposium/TeamDescriptionPapers/SoccerSimulation/Soccer2D/TDP_HELIOS2013.pdf
- Football Manager eğilimleri ve gizli özellikler: https://www.passion4fm.com/football-manager-player-traits/ · https://www.passion4fm.com/football-manager-player-attributes/ · https://www.goal.com/en-gb/news/match-winning-tactics-positional-play-football-manager-2024/blt3a251acbf3d212e8
- EA FC roller ve oyun stilleri: https://www.ea.com/games/ea-sports-fc/fc-25/news/pitch-notes-fc-25-fc-iq-deep-dive · https://www.gamesradar.com/fc-24-playstyles-list · https://ggrecon.com/guides/fifa-23-accelerate-lengthy-controlled-explosive
- FIFA oynanış teknikleri: https://www.ea.com/games/fifa/news/fifa-19-pitch-notes-gameplay · https://www.ea.com/news/pitch-notes-fifa-23-gameplay-deep-dive · https://blog.playstation.com/?p=116374
- PES / eFootball: https://www.fifplay.com/efootball-2026-playing-styles/ · https://pesmastery.com/pes-playing-styles/ · https://www.mynewsdesk.com/uk/bastion-uk/pressreleases/new-efootball-gameplay-details-revealed-by-konami-at-gamescom-2021-3123618 · https://godisageek.com/?p=121204
- Olay türleri (StatsBomb): https://live-data-api-guide.statsbomb.com/api-reference/event-descriptions.html
- Yürüyüşte kadans ve adım (Froude ilişkisi): https://en.wikipedia.org/wiki/Froude_number#Walking_Froude_number · ataletli karışım (inertialization; GDC 2018): https://www.gdcvault.com/play/1025165/Inertialization-High-Performance-Animation-Transitions · CMU hareket yakalama veritabanı (ticari kullanım serbest, veri satılamaz, teşekkür ister; atıf [kutuphane/J §J.12 “Kaynaklar — A7”](kutuphane/J-beden-dili.md#kaynaklar--a7-2026-10-17-hareket-verisi), §3 satır 8): http://mocap.cs.cmu.edu/


### Kaynaklar — T17 (2026-10-16 araştırması: korner ve orta)

- Korner hacmi: PL 2024-25 maç başına 10,3 (3.913/380): https://www.bettoredge.com/post/soccer-corners-and-cards-betting · Opta/The Analyst 2021-22 takım değerleri: https://www.planetsport.com/soccer/feature/the-analyst-premier-league-corner-kings-betting-stats · 4 büyük lig 2024-25 takım başına sezonda 178,2: https://mhassanfootball.substack.com/p/202425-corner-statistics-europes · 11 lig 2010–17, 5,13/takım: https://github.com/hesussavas/corners_stats/blob/master/README.md · Süper Lig 2023-24 9,5 ve 2025-26 9,4: https://golmetric.com/kornerler?league=TSL&season=2023-24 · https://golmetric.com/kornerler?league=TSL&season=2025-26
- Korner verimi (gol, şut, kısa korner, ilk temas, içe/dışa dönen, hedef bölge): https://theanalyst.com/articles/premier-league-corner-stats-inswingers-vs-outswingers-short-vs-crossed-kai-havertzs-defending · https://theanalyst.com/articles/premier-league-corners-2024-25 · https://theanalyst.com/articles/championship-corners-2024-25-goals-stats-opta · https://theanalyst.com/articles/premier-league-corners-justifiable-excitement · https://theanalyst.com/articles/premier-league-teams-still-more-direct-2025-26 · https://theanalyst.com/articles/are-manchester-united-really-that-bad-at-corners · La Liga 2019-20 %2,9: https://www.eurjhm.com/index.php/eurjhm/article/view/642 · PL 328 korner, ilk temastan gol %2,7: https://eprints.chi.ac.uk/id/eprint/1680/ · Copa América 2021 ilk temas %52,6: https://pergamos.lib.uoa.gr/uoa/dl/frontend/en/browse/3329322 · DK 2002: https://portalinvestigacion.um.es/documentos/63c0b2e23df4c204fbafe952?lang=en
- FIFA turnuva analizleri (ilk temas, ikinci evre, kısa korner, savunma sistemleri, kaleci): https://www.fifatrainingcentre.com/en/game/tournaments/fcwc/2025/team-analyses/more-goalscoring-opportunities-generated-from-set-plays.php · https://www.fifatrainingcentre.com/en/game/tournaments/fcwc/2025/team-analyses/set-plays-defending-corner-strategies.php · https://www.fifatrainingcentre.com/en/game/game-analysis/set-plays/defending-corners-zonal-or-player-to-player.php · https://www.fifatrainingcentre.com/en/game/tournaments/fifa-womens-world-cup/2023/post-tournament-analysis/more-goals-from-corners-and-the-impact-of-in-swingers.php · https://www.fifatrainingcentre.com/en/game/tournaments/fu20wc/2025/goalkeeper-considerations-when-defending-corners.php
- Duran top ve korner gol payı: https://theanalyst.com/articles/fpl-set-piece-stats-projections-tips-premier-league-2026-27 · https://theanalyst.com/articles/premier-league-delays-set-piece-throw-in-stats · https://theanalyst.com/articles/premier-league-teams-most-dangerous-set-pieces · https://theanalyst.com/articles/arsenal-tottenham-corners-record-premier-league-title-race-relegation-battle · https://www.premierleague.com/news/3534079 · https://www.premierleague.com/news/3053137 · https://www.skysports.com/football/news/12040/13493842/arsenal-and-liverpool-rank-as-best-and-worst-from-set-pieces-as-premier-league-clubs-embrace-trend-between-the-lines · https://www.skysports.com/football/news/11095/13514315/liverpool-have-transformed-their-set-piece-record-by-copying-key-trend-sweeping-the-premier-league · https://www.fantasyfootballscout.co.uk/2023/10/25/which-fpl-players-are-taking-penalties-and-set-pieces-2
- Orta hacmi ve verimi: PL açık oyun ortası 22,4/maç, isabet %21,7: https://www.premierleague.com/news/4148090 · bütün ortalar 51 → 38/maç (Opta): https://english.aawsat.com/node/1157341 · 5 büyük lig 2017-18 18,6/takım, 1/64 gol: https://blog.soccerment.com/?p=2967 · orta başına gol %1,76 (5 sn): https://blogarchive.statsbomb.com/articles/soccer/how-low-can-you-go-assorted-thoughts-about-crosses/ · DK 2022 kanat kullanımı: https://www.fifatrainingcentre.com/en/fwc2022/technical-and-tactical-analysis/use-of-wide-areas.php · ortalar ceza sahasına girişlerin %40'ı: https://theanalyst.com/articles/what-you-didnt-know-about-premier-league-passing · “ortaların %70,5'i kesiliyor”: https://www.researchgate.net/publication/255698488_Crossing_in_Soccer_has_a_Strong_Negative_Impact_on_Scoring_Evidence_from_the_English_Premier_League
- Geri çevirme: https://analyticsfc.co.uk/blog/2021/04/28/developing-new-metrics-cutbacks/ · https://www.uefa.com/womenschampionsleague/news/027f-17960e899457-ba4c2d00eba0-1000--uefa-women-s-champions-league-performance-insight-how-cros · https://fifatrainingcentre.com/en/game/tournaments/fu17wwcfu17wwc-24/2024/high-value-chance-creation-from-low-cut-back-push-and-driven-crosses-passes.php · savunma başarısızlık oranı türe göre: https://www.jhse.es/index.php/jhse/article/view/defensive-adaptations-crosses-elite-football
- Kornerde savunma ve kaleci: PL 2013 adam/bölge: https://www.ingentaconnect.com/content/uwic/ujpa/2013/00000013/00000001/art00012 · Parslow: https://www.skysports.com/football/news/11689/12959089/set-piece-innovations-and-busting-myths-about-corners-specialist-set-piece-coach-andy-parslow-talks-us-through-his-role · ikinci evre (nitel): https://jacksaunders.substack.com/p/tactical-notes-brighton · kalecinin çıkışı (xClaimables): https://blogarchive.statsbomb.com/articles/soccer/the-xclaimables-measuring-keeper-aggressiveness/ · korner tehlike modeli ve dağılım (ÇSL 2019): https://arxiv.org/html/2602.22684

### Kaynaklar — T18 (2026-10-16 araştırması: ivmelenme, eşzamanlı koşu, yorgunluk)

- İvmelenme sayıları: Morgans 2025 (EPL/Ligue 1, dakika başına, > 3 m/sn² ≥ 0,5 sn): https://termedia.pl/The-positional-demands-of-explosive-actions-in-elite-soccer-r-nComparison-of-English-Premier-League-and-French-Ligue-1,78,54014,1,1.html · Oliva-Lozano 2020 (LaLiga 123, maç başına): https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0236959 · Ingebrigtsen 2015: https://pubmed.ncbi.nlm.nih.gov/25005777/ · Vigh-Larsen 2018: https://lida.sport-iat.de/dfb/Record/4049714 · Varley & Aughey 2013: https://synapsesocial.com/papers/W2014448332 · Harper, Carling & Kiely 2019 (derleme, eşik ve süre ölçütü): https://pmc.ncbi.nlm.nih.gov/articles/PMC6851047/ · geçiş anları Bortnik 2023: https://pmc.ncbi.nlm.nih.gov/articles/PMC10955741/
- Dilimlere göre düşüş: Bradley 2009: https://www.sponet.de/sponet/Record/4015478 · Bradley 2010: https://sponet.de/sponet/Record/4020178?lng=en · Mohr 2003: https://portal.findresearcher.sdu.dk/da/publications/match-performance-of-high-standard-soccer-players-with-special-re/ · Linke, Link, Weber, Lames 2018 (Bundesliga, etkin süre): https://jssm.org/17-4-662.p_d_f · Lovell 2013 (devre arası): https://pubmed.ncbi.nlm.nih.gov/22824313/ · Weston 2011: https://pubmed.ncbi.nlm.nih.gov/21725103/ · Akenhead 2013 (ivmelenme dilimleri): https://lida.sport-iat.de/dfb/Record/4030014?lng=en · FIFA Katar 2022 yarılar: https://fifatrainingcentre.com/en/fwc2022/physical-analysis/when-do-teams-and-players-run.php
- Eşzamanlı koşu ve senkron: Gregory 2024 (MLS): https://pmc.ncbi.nlm.nih.gov/articles/PMC11392333/ · Folgado 2014: https://pmc.ncbi.nlm.nih.gov/articles/PMC4016249 · Gonçalves 2018: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0200019 · sprintin taktik bağlamı Caldbeck & Dos'Santos 2022: https://repository.mmu.ac.uk/articles/journal_contribution/How_do_soccer_players_sprint_from_a_tactical_context_Observations_of_an_English_Premier_League_soccer_team/32471268 · Lobo-Triviño 2024: https://pmc.ncbi.nlm.nih.gov/articles/PMC11164352
- Takım düzeni ve yorgunluk: Praça 2020: https://www.scielo.br/j/rbcdh/a/7YVg9g85QcmjdLdF6jxkHYm/?lang=en · Clemente 2013: https://lida.sport-iat.de/dfb/Record/4030250 · Alberti 2013 (gol dilimleri): https://air.unimi.it/handle/2434/226869
- Görev süresi ve geçiş: Ju 2023 (pres koşusu, toparlanma koşusu): https://researchonline.ljmu.ac.uk/id/eprint/17199/1/BS_Art_46976-10.pdf · Carling 2012: https://knowledge.lancashire.ac.uk/id/eprint/12290/ · Bauer & Anzer 2021 (savunma geçişi, karşı pres): https://link.springer.com/article/10.1007/s10618-021-00763-7 · Vogelbein 2014: https://lida.sport-iat.de/dfb/Record/4032298?lng=en · Barnes 2014: https://lida.sport-iat.de/ta/Record/4033554?lng=en

### Kaynaklar — T20–T22 (2026-10-18 araştırması: santra, top sürme, orta, eğri, uzun top)

- Santra kuralı (2016/17): Shoot, “Top 5 things … opening weekend 2016/17”: https://www.shoot.co.uk/top-5-things-to-look-out-for-on-the-opening-weekend-of-the-201617-premier-league-season-2/amp/ · Arsenal.com, Wenger'in yeni santra kuralı üzerine: https://www.arsenal.com/node/21400 · Uzun santra topu ve santradan taca atma modası (2025/26, 1999 görünümünde kullanılmaz): The Analyst, https://theanalyst.com/articles/premier-league-2025-26-trends-tactics-long-throws-long-balls-kick-offs
- Top sürme: Zago ve ark. 2016, *Journal of Sports Sciences* (hızlı sürücü 3,0 ↔ 2,3 dokunuş/sn, daha dar ağırlık merkezi salınımı, daha kısa yol): https://lida.sport-iat.de/ta/Record/4038745?lng=en · Fizik tabanlı top kontrolü: PhysicsFC (2025), https://arxiv.org/html/2504.21216v2
- Orta: Premier Lig açık oyunda orta / maç (2024/25'in başında 22,4; 2023/24 isabet %20,9): https://www.premierleague.com/en/news/4148090 · 2022/23 23,8 (o güne dek en düşük): https://www.premierleague.com/news/2917776 · 2018/19 açık oyunda orta / 90 dk 24,2, en yüksek 2003/04 42,0: https://www.premierleague.com/news/1224792 · Ortalar açık oyun fırsatlarının ~%40'ı: https://theanalyst.com/articles/what-you-didnt-know-about-premier-league-passing · İçe dönen korner %41 → 65: https://datawrapper.dwcdn.net/f7WeA/3/ · Ters ayaklı kanat ve içe dönen orta: https://www.mnufc.com/news/understanding-game-inverted-wingers · UEFA EURO 2016 teknik raporu (ortalar): https://www.uefa.com/uefaeuro/history/news/0253-0d81b8ee1943-c8779da8cd9d-1000--euro-2016-technical-report-3-crosses
- Tek vuruş: “düşük dokunuşlu pas” (alıcının önceki dokunuşundan 1 sn içinde): https://saturdays.substack.com/p/successful-low-touch-passes (payın sayısal değeri bulunamadı; T20c bandı Claude'un tahmini)
- Eğri ve dönen top: dönüş hızının yanal sapmadaki payı (CFD, 2025): https://link.springer.com/article/10.1007/s00466-025-02705-2 · Dönen serbest vuruşu kalecinin yanlış okuması (Craig ve ark. 2006, ±600 rpm): https://hal-amu.archives-ouvertes.fr/hal-01635484/file/Craig%20-%20Die%20Naturwissenschaften%20-%202006.pdf · Yerden eğri pasın sayısal ölçüsü bulunamadı.

### Kaynaklar — T23–T27 (2026-10-18 akşam araştırması: duruş süreleri, yürüyüş, baş dönüşü, gol tekniği)

- Duruş süreleri: The Analyst — kale vuruşu 27,7 → 23,7 sn, taç 15,7 → 13,2 sn (2022 ↔ 2026 Dünya Kupası, süre kuralından sonra): https://theanalyst.com/articles/premier-league-rules-throw-ins-goal-kicks-ball-in-play · Siegle ve Lames, “Game interruptions in elite soccer” (maç başına ~108 kesinti; oyun parçası ortalama 32,1 sn, kesinti 18,7 sn): https://lida.sport-iat.de/dfb/Record/4024884?lng=en · Beş büyük ligde kesintiler (Premier Lig'de taç ve aut daha uzun): https://lida.sport-iat.de/ta/Record/4067568?lng=en
- Yürüyüş: kendiliğinden hızda hız 1,30–1,46 m/sn, adım boyu 0,68–0,85 m (Frontiers tablosu; kadans = hız ÷ adım boyu ≈ 1,7–2,1 adım/sn): https://pmc.ncbi.nlm.nih.gov/articles/PMC8217618/table/T3
- Baş dönüş hızı: yürüyüş ve koşuda grup ortancasının en büyüğü ≤ 90°/sn, kasıtlı en hızlı dönüşte ~780°/sn (Grossman ve ark. 1988): https://link.springer.com/doi/10.1007/BF00247595
- Gol tekniği: Şampiyonlar Ligi 2009/10 gollerinin %41,6'sı iç ayakla plase, kafa %16,9: https://sponet.de/sponet/Record/4028980?lng=en · Kadınlar Avrupa Şampiyonası 2009 (iç ayak %35,7, iç ayakla vole %22,9): https://sponet.de/sponet/Record/4032403
- Maç motoru eleştirisi (tekrar eden hareket, hızın baskınlığı, maç görselinin eskiliği): https://www.techradar.com/gaming/football-manager-26-review
