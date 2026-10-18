<!-- T25 uygulama planı: Claude'un salt okuma kod haritalarının sentezi (2026-10-18 gece, masaüstü). Onaylı tur planı gerçekçilik planındadır; burası uygulayıcının çalışma notudur. Satır numaraları yazıldığı andaki koda göredir; scratchpad yolları (C:/Users/herna/AppData/...) yerel ve geçicidir. -->

# T25 (kanat ve orta): birleşik uygulama planı

Bu plan salt okuma çalışmasıdır. Dosya değiştirilmedi. Plan dört raporun ve kodun karşılaştırılmasına dayanıyor (HEAD `ecbf993`).

## 0. Başlangıç koşulları ve genel kurallar

**Başlangıç**
- T24 kapanmış olmalı.
- Dal: `claude/motor-t25`, `claude/motor-t24`'ün ucundan açılır.
- Motor tabanı `araclar/taban/t24.json`, hız karşılaştırması `tur/t24` ile yapılır.
- Dört raporun sayıları T23 motorundan (t24-0, t23-80). T24 şutu, bloğu ve kutuya girişi değiştireceği için T25-0 bütün sayıları T24 tabanında yeniden ölçer.
- Aşağıdaki satır numaraları `ecbf993`'e göredir. T24 `mac-karar.js`'i kaydıracak; yerler işlev adıyla bulunmalı.

**Anahtarlar**
- Her anahtar `js/mac-motoru.js`'te bir `/* T25 */` bloğunda bildirilir. Değeri sahibi akışın `ayarEkle`'si atar:
  - B: `mac-topla.js:20`
  - C: `mac-mudahale.js:12` ve `mac-hareket.js:20`
- Değeri 0 olan anahtar ek `this.rast()` çekmez. Bütün T25 anahtarları 0'dayken `--ayni t24.json` 40/40 tutmalı. Bu, her alt adımın commit'inden önce denetlenir.

**Varlık alanı**
- `varlik`'e alan eklenmez.
- Gereken durum var olan nesnelere yazılır: `p.surus`, eylem nesnesi, seçenek nesnesi.

**Akış sapması (belgeye görünür yazılır)**
- Plan "B ve T" diyor. Orta bloğu ve sürükleme hızı C'ye de dokunuyor (`mac-mudahale.js`, `mac-hareket.js`).
- T'ye (kanat konumu) gerek yok: T14c teşhisine göre kanat seçeneği kararların %95'inde var, eksik olan değeri.

**Sıra ilkesi**
- Ölçüm → yürütme ve fizik (a, b) → tahminin kalibrasyonu (c) → değer modeli (d, e) → seçim ayarları (f) → denge (g).
- Gerekçe:
  - §6: "Mekanik senaryoda doğrulanmadan `MOTOR_AYAR` ile denge aranmaz."
  - §3 ilke 1–3.
- Taramalar 40 maçla yapılır ve yalnız yön gösterir. Denge kararı yalnız T25g'de, 80 maçla verilir.

## T25-0 Ölçüm eki

Sonucu değiştirmez. Kabul `--ayni t24.json` 40/40.

**Kanat (`t-kanat.js`, `r-karne.js`)**
- Kanadın topu alması: üçlük × pasör grubu, alımda gövdenin rakip kaleye sırtı (sırt).
- Kanadın son üçte bire taşıyarak girişi.
- T14c tanısının bugünkü kodla tekrarı: kanat seçeneği ne sıklıkla en iyi, en iyi diğer pasla farkı kaç puan.
- 35–40 m'de kanat alıcısı / maç (T25e'deki `devamOrtaU` koşulu için).

**Çalım (`r-karne.js`, `p-kalib.js`)**
- Düello: grup (forvet / merkez / bek / stoper / kanat) × koridor (|z−MZ| > 14 ya da içeri) × üçlük.
- p-kalib çalımı gruba göre. Bugün +8,9, bant ±8 dışında.

**Orta**
- Açık oyun ortası / maç ve kanat payı. Orta, rol × koridora göre (≥ 14 m kanat koridoru, 8–14 m yarım alan). Serbest vuruş ortası ayrı satırda.
- Geniş koridordaki kanat ve bek kararları (|w−MZ| ≥ 14, u > PL−40): aday sayısı, `ortaEsik`'le elenen, en iyi ortanın değeri, seçilenin değeri ve türü.
  - Açıklık seçenek nesnesine salt okunur yazılır: `S.push`'a `acik` (`mac-karar.js:599`).
- Kararın blok tahmini (1 − açıklık) ↔ gerçekleşen blok, 1. adam mesafe dilimlerinde (< 1,5 / 1,5–3 / 3–5 / ≥ 5 m).
- `ortaBlokUygula`'nın sonucu (korner / taç / oyunda), kale çizgisine uzaklığa göre.
- p-kalib ortası ikiye ayrılır: "ilk temas arkadaş" ve "sonra arkadaş aldı". Maç ile `c-orta` neden ters yönde ayrılıyor, bu ayrım gösterir.
- `c-orta` senaryosuna zorlamalı orta: 1. adam 1 / 2 / 3,5 / 5 m'de, tahmin ↔ gerçek blok. Yalnız senaryo, maçı değiştirmez. T25b'deki seçim buna bağlı.

**Sürükleme (`a-akis.js`)**
- Bitiş nedeni yüzdesi: hızlı top / uzak top / rakip / karar türü.
- Sürükleme başına yolun ortancası ve süre.
- Borç 33'ün "1,2 sn'den sonra pasla bitiyor" teşhisi ile surukle izinin "%62'si sahiplik düşerek bitiyor" bulgusu çelişiyor. 13 kararlık iz yetmez; bunu 40 maç çözer.

**Koşana havadan pas (`a-akis.js:81`, `p-kalib.js`)**
- Alt türe göre: boşluğa / ara / ayağa / forvete.
- p-kalib'e "havadan boşluğa (koşana)" dilimi.

## T25a Sürükleme mekaniği (yürütme; şut değerinden bağımsız)

**`surukleSahip`** (m; 0 = eski; varsayılan 5; tarama 4 / 5)
- Yer: `mac-topla.js:585`.
- Ne: sürükleme süresi içindeyken eşik 3,2 m → `surukleSahip` olur ve 9 m/sn kuralı uygulanmaz. Koşul var olan alandan okunur: `p.surus.surukle > t`. Çalım kaçışındaki muafiyetin eşi.
- Gerekçe: bu yalnız ölçüm düzeltmesi değil. Sahiplik düşünce `p.surus=null` oluyor, sürükleme planı kopuyor ve oyuncu topu kovalayıp yeniden karar veriyor.
- Uygulamada doğrulanacak: top 5 m öndeyken savunmacılar sürücüye değil topa gidiyor mu. Gerekirse `birebirTahmin`'in "top 1,2 m açıldıysa topa koş" yarışının sürükleme eşi aynı adımda eklenir.

**`surukleHiz`** (0 = eski; varsayılan 0,96; tarama 0,92 / 0,96)
- Yer: `mac-hareket.js:672`.
- Ne: sürüklemede `hizOran = surukleHiz − 0,08·(1 − oz.surus)`. Bugün 0,80–0,92. Beceri eğimi korunur.

**`surukleBagli`** (sn tavanı; 0 = eski; tarama 2,5 / 3,5; koşullu)
- Koşul: T25-0 ve `surukleSahip`'ten sonra "karar: pas ≤ 1,5 sn" bitişleri %30'u geçerse.
- Yer: `mac-topla.js:628`.
- Ne: bağlılık `0,3 + L/vC`, hedefe 2 m kalınca biter.
- Erken çıkış: önde ±60° içinde 3 m'de savunmacı, ya da u > PL−30. İkincisi T24'ün şut kararını kilitlememek için.

**Kabul (40 maç, yön)**
- Kanat taşıması ≥ 15 m ≥ 2,5 / maç; topla hızın %90'lığı ≥ 6,7 m/sn.
- Top kapma ve faul bantta.
- Top taşıma > 5 m en çok +3 puan. Bugün %42, bant 25–35 dışında; T26'nın hedefiyle çatışmamalı.

**Kapılar**
- `c-1v1`, `c-kanat`, `c-hareket`, `c-surus`, `c-koru`.
- a-akis "Sürüş / Sürükleme / Kanat taşıması" satırları.

## T25b Orta bloğu: savunmacının tepkisi ve sekme (fizik; planlayıcı aynı işlevi kullanır)

**`ortaBlokTepki`** (sn; 0 = eski, yani gecikmesiz ve 4,5 m'de tam erişim; varsayılan 0,2; tarama 0,15 / 0,25)
- Motorda (`mac-hareket.js:882–889`, presYap): 1. adam ortanın yoluna, ortacının vuruş eylemi başladıktan `ortaBlokTepki` kadar sonra adım atar. Süre eylemin kendi zamanından okunur; yeni alan yok.
- Planlayıcıda (`mac-mudahale.js:143–168`, `ortaBlokTahmin`):
  - `varisZamani` tepkisi 0,05 → `ortaBlokTepki`.
  - `tam` (`:163`) koşulu "r0 < 4,5 m" yerine "1. adam t0 − tepki içinde yola varır".
- Sonuç: bugünkü ya hep ya hiç açıklık mesafeye göre kademeli olur. Yakın baskıdaki orta düşünülür ve bir kısmı bloklanır.

**Seçim ve gerekçe (`ortaBlokAlgi` yerine)**
- Orta raporu `ortaBlokAlgi`'yi öneriyordu: ortacının savunmacının adımını bilerek görmemesi.
- Bugün planlayıcı ile motor aynı işlevle tutarlı. Kusur motorun kendisinde: savunmacı ortacının gerilişini 0,05 sn'de okuyor.
- Kasıtlı yanlış algı §3 ilke 1'e aykırı. Tepki süresi ise ilke 2'nin "rastlantı girdide: tepki süresi" kuralına uyar.
- `ortaBlokAlgi` yalnız T25-0'ın zorlamalı ölçümü planlayıcının kötümser olduğunu gösterirse (tahmin blok − gerçek blok > 10 puan) kalibrasyon olarak kullanılır.

**`ortaBlokSekme`** (0/1; 0 = eski %60 / %40 zarı; varsayılan 1)
- Motorda (`mac-mudahale.js:383`): bloklanan orta T17'nin temas yansımasıyla seker (`blokGercek` yolu, `:268–271`). İleri bileşenli ve çizgiye yakın ortada top kendiliğinden kale çizgisine ya da taça gider. Hız payı rastlantıdan, girdide.
- Planlayıcıda:
  - `ortaBlokKorner` 0,4 sabiti yerine yeni saf işlev `ortaBlokKornerP` (aynı yansımanın rastlantısız ortası; `mac-karar.js:594`).
  - İkinci top (`ik`, `:597`) × açıklık × (1 − kaleci payı). Bloklanan ya da kalecinin aldığı ortada ikinci top yok.
- Orta raporunun "çizgiye ulaşacak hızla" önerisi yerine geometri seçildi (ilke 2).

**Kabul (40 maç, yön)**
- Orta bloğu ≥ %5, orta kaynaklı korner > 0, korner ≥ 4.
- `c-orta` T10a kapısı. Yeni bilgi satırı: dilim başına |tahmin blok − gerçek| ≤ 10.
- `d-duran`'da korner verimi kötüleşmez.

**Kapılar**
- `c-orta`, `c-kanat`, `c-1v1`, `c-koru`.
- Blok ve sekme listesi: `c-temas`, `c-yariyariya`, `c-kayma`, `c-donen`, `d-duran`, `d-sut`.
- `ikiz-deneme.js`: `OB_V` modül düzeyinde paylaşılan nesne.
- `ad-denetimi.js`: yeni ad `ortaBlokKornerP`.

## T25c Koşana havadan pasın tahmini (kalibrasyon)

**`kosuTolHava`** (m; 0 = eski; varsayılan 4; tarama 4 / 5,5)
- Yer: `mac-karar.js:176`.
- Ne: alıcı koşudayken (`q.kosu` arkaya ya da geniş), havadan boşluk ve ara pasında `tol = max(tol, kosuTolHava)`. T10a'daki `pasTolHava`'nın eşi: alıcı topun gerçek inişini kovalıyor (`yakalamaNoktasi`), 1,2 m'lik isabet şartı fazla karamsar.
- Orta yolu (`hvO`) değişmez.
- Değer seçimi: 5,5 hedefe yakın ama tahmini iyimser yapabilir. p-kalib'in "koşana" diliminde |tahmin − gerçek| ≤ 5'i tutan büyük değer seçilir.
- Bu anahtar şuttan bağımsız: teşhiste şutu geçen karar her tabanda 0 idi. T24'e dayanıklı.

**Kabul (40 maç, yön)**
- Koşana havadan pas ≥ 7 / maç; p-kalib "koşana" dilimi ≤ 5 puan.
- Havadan pas isabeti ve ofsayt bantta.

**Kapılar**
- `b-pas`, `o-ofsayt`, `c-kanat`.
- `c-orta`: sayılar aynı kalmalı.
- a-akis "Uzun / Eğri" satırları.

## T25d Kanat değer modeli

**`xtYan`** (oran; 0 = eski; varsayılan 1; tarama 0,75 / 1)
- Yer: `mac-karar.js:30–35`.
- Ne: `t = max(t, xtYan · xTmerkez(u) · R(u, |w−MZ|))`.
  - R: Singh oranlarından 3 sıra × 5 sütunluk tablo, çift doğrusal ara değer.
  - Yalnız u 12…PL−12 arasında, 36–40,5 m'de sönümlü.
  - Ceza sahası, kendi yarı, `ortaSecenekleri`, `ik` ve korner değişmez.
- Oran merkezin xG'sine bağlı. T24 şut değerini ya da `xG()`'yi değiştirse de kanat ile merkez arasındaki denge korunur.
- Singh değerleri kanat-deger raporunda hafızadan. Doğrulama için `open_xt_12x8_v1.json` indirmek kullanıcı onayı ister:
  - Onay gelirse §7.9 kuralı uygulanır: dosya kendi klasöründe, betik ayrı klasörde, `python -I`; koda yalnız sayı tablosu girer.
  - Onay yoksa değerler belgeye "doğrulanmadı" diye yazılır.

**`kanatBeden`** (rad; 0 = eski; varsayılan 1,0; tarama 0,6 / 1,0)
- Yer: `mac-karar.js:481`.
- Ne: ayağa ya da bırakma pasında, |hz−MZ| > 20 ise alıcının bakışı pasör yönünden hücum yönüne en çok `kanatBeden` kadar döner.
- Gerekçe: yürütmede `alisAcik` 1,0 rad (`mac-hareket.js:611`) yönlü ilk dokunuşta gövdeyi zaten açıyor. Planlayıcı aynı varsayımı yapar (ilke 1). Varsayılanın 1,0 olması bundan.
- Kanat dışına genel uygulama geniş etkili; borç defterine "planlayıcının alıcı gövdesi" olarak yazılır.

**Yeniden denenmeyecekler**
- `xtKanat`'ı büyütmek (T12c).
- Tek başına `devamOrta` (T14c).

**Kabul (40 maç, yön)**
- Kanat pas alıcısı ≥ %14.
- Orta / maç ve kanattan payı 0,5'ten fazla düşmez. Düşerse not edilir, T25f'de telafi edilir.
- Gol ve xG bantta.

**Kapılar**
- `c-kanat`, `c-orta`, `c-1v1`, `c-koru`, `c-surus` [4].
- a-akis "Alış → vuruş" ve "Kanat taşıması" satırları.

## T25e Devam değerleri (T24'ün şut değerine bağlanan adım)

**`kosuDevam`** (çarpan; 0 = eski; varsayılan 0,4; tarama 0,3 / 0,5)
- Yer: `devamDegeri`, `mac-karar.js:238–276`.
- Ne: kaleci dışında alıcıdan önce yetişen rakip yoksa (kalecisiz `baskiSuresi`), u+12'deki şut değeri × `kosuDevam`.
- Şut değeri `sutSecenegi`'den çıkarılacak yeni saf yardımcıdan okunur: T24 kapanışındaki xG × beceri × istek × (1 − blok). T24 şut değerini değiştirirse bu devam da birlikte kayar.
- Yeni üst düzey ad olduğu için `ad-denetimi.js` çalışır.

**`calimKacis`** (m; 0 = eski; varsayılan 8; tarama 6 / 8)
- Yer: `mac-karar.js:413`.
- Ne: çalım noktasının yön boyunca `calimKacis` ötesi de değerlendirilir; şart, orada geçilen savunmacı hariç baskı süresinin 0,8 sn'yi aşması. İki değerin büyüğü alınır.
- Etki geometriden kanada özgü çıkar: merkezde örtü savunmacısı yetişiyor.
- P değişmez, yalnız başarılı çalımın değeri değişir. p-kalib çalımı doğrudan etkilenmez.

**`devamOrtaU`** (m; 0 = 35; varsayılan 40; koşullu)
- Koşul: T25-0'da 35–40 m kanat alıcısı ≥ 2 / maç.
- Yer: `mac-karar.js:261`.
- Bekletilme nedeni: `c-orta`'da erken orta hücreleri zaten +8…+15 iyimser.

**Kabul (40 maç, yön)**
- Koşana havadan pas ≥ 10 / maç.
- Kanat çalımı artar.
- Gol ≤ 3,3; gerçekleşen ÷ konum xG ≤ 1,20.

**Kapılar**
- `b-pas`, `o-ofsayt`, `c-1v1`, `c-koru`, `c-kanat`, `v-sut`, `d-sut`, `p-tip`.

## T25f Seçim ayarları (ölçülen açığa göre, en son)

**`birebirBolge`** (pay; 0 = eski; varsayılan 0,5; tarama 0,5 / 0,75)
- Yer: `mac-karar.js:414`.
- Ne: `birebirDeger` u < 17,5'te × (1 − `birebirBolge`); 17,5'ten 35 m'ye doğrusal olarak 1'e çıkar.
- Beklenen: bekin orta sahadaki 4,3 çalımı ~2'ye iner.
- Gerekçe: her yerde aynı olan +4 puan zaten bir sabit. Bölgeye bağlamak değer modelinin inceltilmesidir, zorlama değil.

**`ortaEsik`** 0,05 → 0,03 (tarama 0,03 / 0,04)
- Yalnız T25b'den sonra. Tek başına 4 maçta blok 0'da kaldı.

**`ortaIkinci`** 0,15 kalır.
- T25b'nin ikinci top düzeltmesi derin ortayı fazla düşürürse en çok 0,2. 0,35 reddedildi: T21'de şut −3.

**`surukleKanat`** 0,5 → 0,8 (tarama 0,8 / 1,0)
- Yalnız T25a ve T25d'den sonra kanat taşıması < 4 ise ve orta ile kanattan payı düşmüyorsa (borç 32 ile çatışma).

**`ortaKanat`** (çarpan; 0 = eski; tarama 1,2 / 1,4)
- Son çare; yalnız kanattan payı < %50 kalırsa ve |oz−MZ| ≥ 14 ortalarında. Gerekçesi belgeye yazılır.
- Kanat çalımını düşürebilir (borç 10).

**Çalım ≥ %40 tutmazsa yedek**
- Profilin 'gec' eğilim gücü (eğilim kanalı, ilke 5). Kapılar `p-tip` ve duyarlılık karnesi.
- Rol puanı (`kanatCalim`, `birebirKanat`) reddedildi: bu ayarla zorlamadır.

**Ertelenen (borç defterine): `ortaSutIstek`**
- Ortanın ilk temas şansını iniş mesafesindeki şut isteğine bağlamak.
- Gerekçe: T25, T24'ün kapanmış tabanında ayarlanır. Kanat koridorunda şut ≤ 3 puan, yarış yalnız yarım alanda. Risk yüksek: altıpasa orta 5 kat değer alır.

**Kabul (40 maç, yön)**
- Orta 10–16 / maç, kanattan ≥ %50.
- Kanat çalım payı ≥ %40; düello 20–28 / maç.
- p-kalib çalımı +8,9'dan kötüleşmez.

## T25g Denge ve kapanış (CLAUDE.md tur kapanışı listesi)

- 80 maç `--karsilastir t24.json` ve robotluk karnesi.
- Bütün senaryolar.
- `oyuncu-karnesi.js 80 1 --duyarlilik`.
- Hız ölçümü `tur/t24` ile; gol ve duruş sayısı değiştiği için ayrıca `hiz-evre.js`.
- Yeni taban `t25.json`; belgeler ve devam notu.
- Tutmayan satırlar ve ertelenenler borç defterine (`ortaSutIstek`, genel alıcı gövdesi, gerekirse geri çevirme).
- Çizime dokunulmadığı için animasyon ölçümü gerekmez. Dokunulursa `a9-anm.json` ile karşılaştırılır.

**Kabul (80 maç; gerçekçilik planı T25)**

| Satır | Hedef |
|---|---|
| Orta / maç · kanattan | 10–16 · ≥ %50 |
| Koşana havadan pas / maç | ≥ 10 |
| Kanat pas alıcısı | ≥ %15 |
| Kanat çalım payı | ≥ %40 |
| Kanat taşıması ≥ 15 m / maç · topla hızın %90'lığı | ≥ 4 · ≥ 7 m/sn |
| Orta bloğu · orta kaynaklı korner | ≥ %8 · > 0 |
| Korner / maç | ≥ 4 |
| Kapılar | `c-orta` (T10a), `c-kanat` |
| Korunacak bantlar | gol 2,2–3,3; şut 16–28; gerçekleşen ÷ konum xG 0,85–1,20 |

## Kabul satırı → alt adımlar (bugün → beklenen; beklenenler tahmin)

| Satır | Alt adımlar | Bugün → beklenen |
|---|---|---|
| Orta / maç | b, d, f | 6,9 (açık oyunda 4,5) → 9–11. Açık oyunda ~+3,5 gerekiyor |
| Kanattan | d, f | %40 → %45–52. Forvet ve merkez orta saha %44; çoğu yarım alandan mı, T25-0 gösterir |
| Koşana havadan pas | c, e | 4,95 → 9–12 |
| Kanat pas alıcısı | d | %12,8 → %14,4–15,5 |
| Kanat çalım payı | d, e, f | %24,7 → %33–40. En riskli satır: kanadın +4,5 / maç artıp kanat dışının −2,2 / maç düşmesi gerekiyor |
| Kanat taşıması ≥ 15 m | a, d, f | 1,25 → 2,5–4 |
| Topla hızın %90'lığı | a | 6,15 → 6,6–7,0 m/sn |
| Orta bloğu · orta kaynaklı korner | b | %0,7 · 0 → %5–10 · > 0 |

## Çakışmalar ve seçimler

1. **Orta bloğu:** `ortaBlokAlgi` (algı) yerine `ortaBlokTepki` (zamanlama). Gerekçe T25b'de.
2. **Bloklanan ortanın yönü:** "çizgiye ulaşacak hız" yerine T17 yansıması. Gerekçe ilke 2.
3. **Kanat çalımı:** `calimKacis` (geometri) ve `birebirBolge` (sabitin bölgeye bağlanması) seçildi. Rol puanları (`kanatCalim`, `birebirKanat`) reddedildi.
4. **Kanatta orta ↔ çalım:** `xtYan` topu tutmanın değerini artırır, `ortaKanat` çalımı düşürür. Değer modeli (d) seçim ayarlarından (f) önce gelir; `ortaKanat` son çaredir.
5. **Kanat payının kaynağı:** iki rapor farklı sayılar veriyor (6 maçta kanat %17, 40 maçta %24,7). 40 ve 80 maç esas alınır.
6. **Sürüklemenin bitişi:** borç 33 ile surukle izi çelişiyor. T25-0 karar verir; bağlılık (`surukleBagli`) yalnız ölçüm isterse.
7. **Geri çevirme:** `c-orta`'da +18,8, T17 notundaki ≤ 10 tutmuyor. T25'in hedefi değil. T25-0 nedeni gösterirse T25f'de düzeltilir, göstermezse borç defterine yazılır.
8. **Kabulün tanımı değişmez.** "Orta 10–16" ve "kanattan" satırları bugünkü tanımla (serbest vuruş ortası dahil) okunur; açık oyun payı bilgi satırıdır.

## T24 ile etkileşim

- **Forvete pasın değeri:** `devamDegeri`'nin şut dalı `sutBlokOlasiligi`'ye bağlı (`:244`). T24a bloğu artırırsa forvete pasın değeri düşer, kanat payı kendiliğinden biraz artar. T25-0 bunu yeniden ölçer.
- **Kanat koridoru:** şut ≤ 3 puan, `sutIstegi` değişimine duyarsız. `xtYan` merkezin xG'sine oranlı olduğu için T24'e dayanıklı. Şut ile orta arasındaki yarış yalnız yarım alanda (8–14 m), orası T24'ün kalibrasyonunda kalır.
- **Kutuya giriş:** T24e orta saha ve bekleri kutuya getirir. `ortaDestek` artar, orta değerlenir. Orta hacmi T24'te de kayabilir.
- **Ortak şut yardımcısı:** `kosuDevam` T24 kapanışındaki saf şut yardımcısını kullanır. Sonraki şut değişiklikleri birlikte kayar.
- **Korner:** T24'ün çelmeden kornere hedefi (≥ 0,07 / şut) ile sert şutun azalması zıt yönde. Ortadan gelen korner (T25b) tampon olur. Korner ≥ 4 her 40 maçta izlenir.
- **Şut sayısı:** daha çok orta şutun yerini alabilir. Ders `ortaIkinci` 0,35: şut −3, gol −1.

## En büyük riskler ve geri dönüş yolu

| Risk | Kaynak | İzleme |
|---|---|---|
| Gol 2,2–3,3 dışına çıkar | yukarı: `kosuDevam` (bire bir büyük fırsat), `surukleSahip`; aşağı: orta şutun yerini alır | her 40 maçta Δ gol, Δ şut |
| Gerçekleşen ÷ konum xG 0,85–1,20 dışı | orta verimi bugün gerçeğin ~2 katı; kaliteli ortanın çoğalması | daha kötü koşullardaki orta (T25b) verimi düşürmeli |
| Şut 16–28 dışı | orta ve devam şutun yerini alır | Δ şut |
| Top taşıma > 5 m bandı | `surukleSahip` | T26 ile çatışma |
| Kontra ve PPDA bozulur | kanatta kayıp | 40 maç |
| p-kalib çalımı bozulur | bugün +8,9 | p-kalib |
| Hız bütçesi aşılır | `xtYan` tablosu (sıcak yol), `kosuDevam` erişim denetimi | kapanışta `hiz-olcum.js` |

**Hız bütçesi:** ortanca artış ≤ %10, mutlak tavan 250 ms / 1000 adım.

**Geri dönüş**
- Her anahtarın 0'ı eski yoldur; bütün T25 anahtarları 0'dayken `--ayni t24.json` 40/40.
- Bant bozulursa kod geri alınmaz: önce en son eklenen alt adımın varsayılanı 0'a çekilir ve satır borç defterine yazılır.
- Her alt adım ayrı commit; geri dönülemezse `tur/t24` etiketinden dal açılır.
- T24 şut modelini beklenenden çok değiştirirse T25-0'ın sayılarına göre sıra yeniden düzenlenir. Örnek: T24 sonrası kanat alıcısı ≥ %15 ise T25d yalnız ölçülür.

**Dosyalar** (hepsi `C:\Users\herna\Desktop\chairman` altında)
- Motor: `js\mac-karar.js`, `js\mac-topla.js`, `js\mac-hareket.js`, `js\mac-mudahale.js`, `js\mac-motoru.js`.
- Ölçüm: `araclar\olcumler\t-kanat.js`, `r-karne.js`, `p-kalib.js`, `a-akis.js`, `s-sut.js`.
- Senaryo: `araclar\senaryolar\c-orta.js`.
- Plan: `MAC_MOTORU_GERCEKCILIK_PLANI.md` (T25 bölümü satır 1270–1278, borç defteri satır 1412–1429).
