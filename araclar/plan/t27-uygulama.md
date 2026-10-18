<!-- T27 uygulama planı: Claude'un salt okuma kod haritalarının sentezi (2026-10-18 gece, masaüstü). Onaylı tur planı gerçekçilik planındadır; burası uygulayıcının çalışma notudur. Satır numaraları yazıldığı andaki koda göredir; scratchpad yolları (C:/Users/herna/AppData/...) yerel ve geçicidir. -->

# T27 uygulama planı (üç okuyucu raporunun birleşimi)

Hiçbir dosyaya yazılmadı. Satır numaralarını bugünkü ağaçta (`claude/motor-t24`, `ecbf993` ve üstü) tek tek kontrol ettim. T24–T26'dan sonra satırlar kayacağından her yer işlev adıyla da verildi.

Raporlardaki birkaç satır numarası bugünkü ağaçta kaymış durumda; aşağıdakiler düzeltilmiş hâlleridir:
- `mac-mudahale.js`: `elleOynamaDene` :300, faul zarı :560, `temasFaulu` :606–607.
- `mac-kaleci.js`: `kaleciKontrolP` :98, `kaleciKonum` :527.
- `mac-hareket.js`: `HRK_HAREKET` :254, `birebirTahmin` :318, `calimAdim` :765, `yutmaCoz` :826.

## Çerçeve

**Dal ve taban**
- Dal `claude/motor-t27`, `claude/motor-t26`'nın ucundan açılır.
- Motor tabanı `araclar/taban/t26.json`.
- Animasyon tabanı `a9-anm.json`; T24–T26 çizim tabanı ürettiyse o kullanılır.

**Anahtar kuralları**
- Bütün T27 anahtarları 0 iken motor `t26.json`'a `--ayni` verir. Bu iskelette, her alt adımın sonunda ve kapanışta sınanır.
- Anahtar 0 iken yeni dal hiç çalışmaz. Toplamın ortasına `+0·x` yazılmaz (kayan nokta sırası değişmesin); hepsi `if(A.anahtar)` korumasıyla yazılır.
- Rastlantı yalnız `this.rast`'tan gelir. T27'nin hiçbir adımı yeni zar eklemez: eşik ya da olasılık aynı zara karşı değişir.

**Varlık ve durum**
- `varlik`'e alan eklenmez.
- Yeni durum şu yerlerde tutulur:
  - maç düzeyi (`this._sevincSure`, `this._santraKarsilayan`)
  - maç durumu nesnesi (`D.skor`, oyuncu değil)
  - yutma nesnesi (`C.bacak`)
  - olay yükü (`vr`)
  - `GUVEN_OLAY` sabiti

**İskelet commit'i** (T24'teki gibi, sonucu değiştirmez): `/*T27x*/` + `/* · */` işaret satırları şu yerlere konur:
- `MOTOR_AYAR` (`js/mac-motoru.js`, T26 bloğunun altına) ve çekirdek anahtarlar için `MOTOR_AYAR_SAHIBI`.
- `ayarEkle('T')` `mac-takim.js:9`, `('K')` `mac-durantop.js:25`, `('Kurallar')` `mac-kurallar.js:15`, `('C')` `mac-mudahale.js:12` ve `mac-hareket.js:20`, `('D')` `mac-kaleci.js:11`.
- `STIL.animasyon.t27:{endirektTut:0,sevincImza:0,bacak:0,sapka:0}`, `js/stil-99.js:138`'deki `a9` bloğunun altına.

İskelet doğrulaması: `--ayni` ve `animasyon-olcum.py --karsilastir` birebir.

**Çizim**
- Çizim değişeceği için turun başında `node araclar/karsilastir/dondur.js a9` (T24–T26 çizime dokunduysa son çizim turunun adıyla).
- Kapanışta eski dondurulmuş kopya silinir (M2).

**Test kademeleri**
- Her düzenlemeden sonra: 4 maç ve ilgili senaryo.
- Alt adım sonunda: oturum sonu, yani 40 maç `--karsilastir t26.json`; tarama soru başına en çok iki değer, `MAC_DENEME_AYAR` ile.
- Denge kararı yalnız 80 maçla verilir. Seyrek satırlar (golden sonraki pencerede şut oranı, ikinci yarının gol payı, direk) kapanışta bir kez 240 maçla.

**Bağımlılık grafiği**
1. İskelet → T27-0 (0a–0e paralel).
2. Paralel kollar:
   - [T27a → T27g]
   - [T27b]
   - [T27c → T27e (koşullu)]
   - [T27d]
   - [T27f1, T27f2]
3. T27f3 (T27g'den sonra) ve T27f4 (T27d'den sonra).
4. T27h denge.
5. Kapanış.
6. T24–T27 main'e alma.

## Anahtar tablosu (0 = eski)

| Alt adım | Anahtar | Sahibi | Varsayılan | Tarama |
|---|---|---|---|---|
| T27a | `golAtisDonus` | çekirdek | 1 | — (düzeltme) |
| T27a | `santraKarsila` | çekirdek | 1 | — |
| T27g | `sevincBaglam` | çekirdek | 1 | — |
| T27b | `guvenSaat` | T | 1 | — |
| T27b | `guvenKart` | T | 1 | — |
| T27b | `skorEtki` | T | 0,2 | 0,15 / 0,3 |
| T27b | `kaleciCikFark` | K | 1 | — |
| T27c | `kutuEsik` | Kurallar | 0,15 | 0,1 / 0,2 |
| T27c | `elKutu` | C (mudahale) | 0,5 | tek değer |
| T27d | `bacakArasi`, `bacakKal` | C (hareket) | 1, c-1v1'den | `esik` 0,72 / 0,65 |
| T27d | `sapka`, `sapkaKal` | C (hareket) | 1, c-1v1'den | `esik` iki değer |
| T27e | `kaleciHata` | D | koşullu | 0,02 / 0,03 |
| T27f | `STIL.animasyon.t27.*` | çizim | 1 | — |

---

## T27-0: Ölçüm (sonucu değiştirmez, `--ayni`; beş parça birbirinden bağımsız, PARALEL)

### 0a. `araclar/olcumler/m-moral.js` (yeni dosya; eklentiler klasörden kendiliğinden yüklenir)

**Pencere**
- Her `goal` olayında açılır. Kayıtlar: A atan, B yiyen, golden sonraki skor durumu (öne geçti, eşitledi, fark kapattı, açık fark).
- 300 maç sn dolunca, sonraki golde ya da yarı sonunda kapanır.
- Süre yalnız `phase==='play'` iken sayılır.

**Satırlar**
- Pencere başına top oyunda süre.
- Şut / takım·oyun dk: atan, yiyen, pencere dışında aynı skor farkı.
- Şut başına konum xG.
- Savunurken 1. adamın topa uzaklığı (`y-yari` tanımı).
- Rakip yarıda top kazanma / oyun dk.
- Topa sahip olma payı. Santrayı yiyen yaptığı için baştan yanlıdır; bilgi olarak yazılır.

**Geç oyun**
- Kaleci kutuda / maç: korner `kullanim` anında kalecinin `duranRol`'ü `DT_HEDEF`'te. Hedef ≥ 0,05.
- O kornerden gol (20 sn içinde) ve 20 sn içinde yenen gol.
- Son 10 dk gerideki takımın uzun pas payı (`pass.long`) ÷ kendi maç ortalaması. Bilgi; beklenen ≥ 1,1.
- Kart sonrası 2 maç dk'da takımın faulü ÷ ortalaması (bilgi).
- Kırmızıdan sonraki 5 dk şut (bilgi).

**Kabul satırları (T27 etiketiyle)**
- yiyen ÷ atan şut 1,05–1,25 (240 maç)
- pres farkı |atan − yiyen| / genel ≤ %20 (80 maç)
- pencere ÷ pencere dışı (aynı skor durumu) 0,8–1,2

### 0b. `d-kaleci.js` ve `r-karne.js`

**`d-kaleci.js`**: her biri maç başına ve 4 sn içinde gol:
- düşürme (bicim `'dusurdu'`, `mac-kaleci.js:410–412`)
- kolay temasta parmak ucu (u ≤ 0,7, v ≤ 22; zar :407)
- tutmak isterken elden kaçan
- toplam "kaleci hatası → gol"

Olay yükünde `u` yoksa yalnız veri olarak eklenir.

**`r-karne.js`** (direk, :72–79 ve :133):
- doğrudan içeri giden (≤ 0,6 sn, arada dokunuş yok) ile oyunda dönen topu ayırır;
- dönen topa ilk dokunan (hücum, savunma, kaleci) ve süresi;
- dönen toptan 4 sn'de şut ve gol.

Ayrıca çalım hareketleri satırına her hareket için deneyenin sürüş ortalaması eklenir (beceri ölçüsü; yeni hareketler satıra kendiliğinden girer).

### 0c. `a-akis.js` (:43, :138): iki yeni satır
- "Santra: 22 sn zaman aşımı %": kickoff, santra evresinin 22. saniyesinde.
- "Santra: santracı > 1 m ışınlandı %": `kickoff` olayındaki konum ile sonraki adımdaki konum. Olay `mac-motoru.js:445`'te, ışınlanma :447'de.

### 0d. `c-temas` [2] yeniden tanımı (borç 29)
- `mac-mudahale.js`:
  - :552'deki bloğun dışında `let vr=null`, :555'te `vr=vrel`.
  - :561 ve :575'teki `mudahaleSonuc` olaylarına `vr` eklenir.
  - Yalnız olay verisi değişir; `--ayni` tutmalı.
  - :575 olayından önce `dengeBoz` hızları değiştirdiği için bağıl hız senaryoda yeniden hesaplanamaz; alanın olaya konması bu yüzden gerekir.
- `araclar/senaryolar/c-temas.js`, :86'daki kapı [2]:
  - Hız dilimi temas anındaki `vr`'den alınır.
  - Katmanlar olaydaki var olan `once` alanıyla: önce topa değip kazanan / değmeyen.
  - Her katmanda dilim başına ≥ 40 adama temas, düşüş ≤ 0,08; arkadan > önden aynen kalır.
  - Varsayılan N 30 → 60.
  - Eski [2] "bilgi (eski tanım)" satırı olarak basılmayı sürdürür.
- Kabul: N=60, tohum 1–3'te [2] geçer.

### 0e. `oyuncu-karnesi.js` [7b] (:129–135): var olan ±0,2 oynatmalarla bilgi satırları
- şut → uzaktan şut payı (≥ 20 m; `shot.dist`; `uzaktanVurur` eğilimi)
- müdahale → kayarak müdahale payı (`kayarakGirer`)
- sertlik → itiraz / oyun dk
- sürüş → topu tutma / koruma (`topuTutar`), olay varsa

Hedef: oran ≥ 1,15 ve alt uç > 1. Tutmayanlar borç defterine yazılır (eğilim gücü T27'de ayarlanmaz).

**T27-0 kabulü**: dört maç `--ayni` (`t26.json`), yeni satırlar basılıyor, `c-temas` [2] geçiyor. Ölçümler 40 maçta bir kez okunur. T27b–e'nin koşullu kararları bu okumadan çıkar.

---

## T27a: Santra (çekirdek; `js/mac-motoru.js`; ajan 1, T27g ile aynı sırada)

### a1. `golAtisDonus:1`
- Yer: `stepGoal` :704, kalecinin ortaya attığı topun `havadanCoz`'undan önce `b.egri=0;b.ust=0`.
- Neden: zaman aşımlarının 10/29'unda gol şutunun yan dönüşü kalıyor (`egri` 0,15–0,19). Top orta çizgide ±17–19 m sapıp taçtan çıkıyor. `mac-kaleci.js:586`'daki dağıtım zaten `b.egri=0` yapıyor.

### a2. `santraKarsila:1`
- `stepKick` :430–432: topu santra yapan takımın sahadaki, kaleci olmayan ve `yakalamaNoktasi` süresi en kısa oyuncusu karşılar.
  - Histerezis: önceki karşılayan 1 sn'den çok geç kalmadıkça kalır. Eşitlikte küçük `n` kazanır.
  - Karşılayan santracı değilse topu ortaya koyar ve yerine döner. Bu yol :427–429'da `santraTek` ile zaten var.
- `stepGoal` :703–705: santracı orta noktaya 8 m'den uzaksa kaleci topu ortaya en yakın arkadaşının yerine atar.

### Kabul (40 maç yön, karar kapanışta 80 maçla)
- Orta noktada tek oyuncu ≥ %98 (bugün %85,3).
- Zaman aşımı ≤ %3 (bugün %30).
- Işınlanma > 1 m ≤ %2.
- Gol → santra 20–35 sn ve T26 tabanından uzun değil (≤ +1 sn; kullanıcının "tempo bugünkü kalsın" kararı). Beklenen ~25,5–26.
- Santra: ilk pas geri payı aynı kalır.
- Gol ve şut gürültü içinde.

**Kapılar**: `a-akis` Santra satırları, `m-fotograf`, `m-isinma`, `o-olay` "Gol → santra".

## T27g: Sevinç süresi ve katılanlar (çekirdek; T27a'dan sonra, aynı ajan; `stepGoal` aynı işlev)

### `sevincBaglam:1`
- **Süre** (:715'teki sabit 7 sn yerine golde hesaplanan `this._sevincSure`):
  - Geç (≥ 80. dk) ve sonucu değiştiren gol: 9 sn.
  - Gol atan takım hâlâ gerideyse ve T10d yolu varsa (`c.alan`, topu ağdan alma): 3,5 sn.
  - Fark ≥ 3 olunca: 5 sn.
  - Öbür durumlarda: 7 sn.
- **Katılanlar** (:708–711):
  - Golcüye 35 m'den yakın arkadaşlar koşar.
  - Uzaktakiler 1–2 sn yerinde sevinir, sonra santra yerine yürür (`santraKonumu`, `hizOran` 0,4).
- **Sözleşme**: süre gol durumuna yazılır (`c.sevincSure`), çizim okur (T27f3). TEKNIK_PLAN §8'e satır eklenir.

### Kabul
- `o-olay`'a yeni satırlar: bağlama göre sevinç süresi ve Gol → santra.
- Ortalama Gol → santra T26 tabanının ±1 sn'si içinde ve 20–35'te. Gerçek maç süresi (23,3 dk) aşılmaz.
- Gol evresinde ivmelenme aynı ya da daha az.

**Kapılar**: `o-olay`, `m-fotograf`, `m-isinma`, 40 maç `--karsilastir`.

---

## T27b: Moral, momentum, son dakika (T ve K; ajan 2; PARALEL)

Dosyalar: `mac-takim.js`, `mac-kurallar.js` (yalnız `kartGoster` :429), `mac-durantop.js:147`.

### b1. `guvenSaat:1`
- Yer: `guvenAdim` :118, `k=Math.exp(-dt*saatCarpani()/9/guvenSure)`.
- Ne olur: τ = 4,5 maç dk, T10e'nin yazılı amacı. U1'den beri 2,25 maç dk'ya inmişti (gerileme); güvenin çoğu gol → santra arasında sönüyordu.
- Beklenen: pencerede güven ~0,10 → ~0,21.

### b2. `guvenKart:1`
- `GUVEN_OLAY` (:109) `kirmizi:-0.2`, `kirmiziRakip:+0.1`.
- `kartGoster` :429'da kırmızıda (ikinci sarı dahil), olay yayılmadan önce iki `guvenOlay`. Sarı kartta takım etkisi yok; oyuncunun kendi temkini zaten var.

### b4. `kaleciCikFark:1`
- `mac-durantop.js:147` koşuluna `Dt.fark===-1`: kaleci yalnız tek farkla gerideyken çıkar.
- Beklenen ~0,12 / maç; kabul ≥ 0,05.

b1, b2 ve b4 tek 40 maçta birlikte okunur (küçük, birbirinden bağımsız).

### b3. `skorEtki` (varsayılan 0,2; tarama 0,15 / 0,3; b1, b2 ve b4'ten sonra)

**Tanım**
- `macDurumu` :217–224 `o.skor` alanını her çağrıda yazar (nesnenin biçimi sabit kalsın; anahtar 0'da 0).
- Değer: `skorEtki × (geride +1, önde −1, berabere 0) × (1 − max(acele, koru))`.
- Son dakikalarda bu terim `acele`/`koru`'ya devreder; T16b'nin son dilim dengesi (öndeki ÷ gerideki şut 0,5–0,6) çift sayılmaz.

**Girdiği yerler** (yalnız `if(A.skorEtki)` dalında)
- `etkinTaktik` :228–237: tempo +0,3·skor, direkt +0,3·skor, pres +0,25·skor.
- `takimNiyet` :150: `N.blok` +4·skor m (0,2'de ±0,8 m).
- `N.kosu` × (1 + 0,3·skor), varsa.

**Girmediği yerler**
- Risk terimi nötr kalır. T7a ve T10e'nin dersi: risk kolu şutu ters yönde iter.
- `koru`, zaman geçirme ve faul isteği 70. dk'dan önce açılmaz.

**Koşullu ikinci soru**: skorEtki 0,3'te yiyen ÷ atan < 1,05 ise `guvenRisk` 0,1 → 0,05. Güven, yiyen takımı temkinli yapıyor ve bu yön skor etkisine ters.

**Koşullu**: m-moral'de uzun pas payı < 1,1 ise ayrı karar (`aceleUzun`); yoksa yapılmaz.

### Kabul
- Pencere:
  - yiyen ÷ atan şut 1,05–1,25 (240 maç; 80 maç yön);
  - pres farkı ≤ %20 ve yiyen ≥ atan (80 maç);
  - pencere ÷ pencere dışı 0,8–1,2 (Heuer ve Rubner 2012: golün golü getirdiği bir momentum yok).
- Kaleci kutuda ≥ 0,05 / maç.
- Gerideki takımın son 15 dk şut payı ≥ %60.
- T16b son dilim oranı 0,5–0,6 korunur.
- İkinci yarının gol payı ≥ %50 korunur (T26 kabulü; 240 maç).

**Kapılar**:
- `Y:` satırları ve dilim tablosu, `c-kanat`, `d-sut`.
- Pres için: `c-1v1`, `c-koru`, `MAC_DENEME_IVME=1 node araclar/mac-deneme.js 12` görev tablosu (yüksek eforlu görev değişimi ≤ 15 / oyuncu·dk).
- `d-duran` (b4).
- `ikiz-deneme.js`: süre saate bağlandı; ucuz bir önlem.

---

## T27c: Penaltı ve elle oynama dozu (Kurallar ve C; ajan 3; PARALEL)

Dosyalar: `mac-kurallar.js:15` ve :42, `mac-mudahale.js` :129, :305, :560, :607.

### c1. `kutuEsik` (Kurallar; varsayılan 0,15; tarama 0,1 / 0,2)

**Tanım**
- `hkFaulEsik(m,t,x,z)` (:42) sonuna `+(A.kutuEsik&&x!=null&&m.cezaSahasi(t,x,z)?A.kutuEsik:0)`.
- `faul()`'daki `kutu` tanımı da `this.cezaSahasi(yapan.team,x,z)`. Ek pay tam olarak penaltı olacak temaslara uygulanır.

**Çağrı yerleri**
- :560: `s.x, s.z`.
- :607: `v.x, v.z`. Tutma, omuz, çarpma, basma ve hava faulleri bu yoldan geçer.

**Tahmin**
- `mudahaleTahmin` :129'daki `E`'ye aynı pay eklenir: planlayıcı ile yürütme aynı eşiği kullanır.
- Yan etki: kutuda müdahale biraz artar ve penaltı düşüşünün bir kısmını geri alır. Tarama bunu da ölçer.

**Etkilenmeyenler**: elle oynama (`faulGor` yolu) ve kaleciye çarpma.

**Değişmezlik denetimi**: `c-temas`, `c-kayma`, `c-yariyariya` orta sahada kuruluyor (`c-temas.js:37`, `c-kayma.js:23`). Anahtar açıkken çıktıları birebir aynı kalmalı.

### c2. `elKutu` (C, `elOlasilik`'in yanı; 0,5)
- `elleOynamaDene` :305'te kendi ceza sahasındaysa olasılık × (1 − elKutu). Zar sayısı aynı.
- Neden yalnız kutu: kutu dışındaki elle oynama zaten az (~0,06–0,09 / maç).

### Kabul (80 maç)
- Penaltı / maç 0,25–0,45. Bugün 0,53–0,74; gerçek 0,23–0,33; 240 maçta bilgi.
- Elle oynama penaltısı ≤ 0,07 / maç (gerçek 0,037–0,066).
- Duran toptan gol payı 25–35 (bugün 36,5).
- Faul 8–18.
- Gol ≥ 2,3. Bant 2,2–3,3; aşağıdaki ilk riske bakın.

**Kapılar**: `c-temas`, `c-yariyariya`, `c-kayma`, `c-donen`, `d-duran`.

## T27e: Kaleci hatasının dozu (D; KOŞULLU; T27c'den sonra ajan 3 ya da ayrı ajan; `mac-kaleci.js`)

**Tetik**: 0b'nin "kaleci hatası → 4 sn'de gol" satırı 0,03–0,10 / maç bandının üstündeyse (> 0,15) ya da kolay topta hata payı > %4 ise. Değilse motor değişmez; borçta "ölçüldü, yerinde" yazılır.

**`kaleciHata`** (0 = tavansız): kolay temasta (u ≤ 0,7, v ≤ 22) `1 − kaleciKontrolP` (:98) ve düşürme (:410) için ortak tavan. Tarama 0,02 / 0,03.

**Kabul**:
- Bant 0,03–0,10 / maç (240 maç; bilgi, kaynak düşük güvenli).
- `d-sut` (48 tekrar) kapıları.
- `d-penalti` kurtarış 16–20 korunur (1600 atış).

---

## T27d: Bacak arası ve şapka (C; ajan 4; PARALEL; ikisi sırayla aynı ajanda)

İkisi de aynı tabloya ve işlevlere dokunur: `HRK_HAREKET` :254, `birebirTahmin` :318, `calimAdim` :765, `yutmaCoz` :826.

### d1. Bacak arası (`bacakArasi:1`, `bacakKal`)

**Satır**: Cruyff kalıbında (:269), anahtar 0'da atlanır.
- `mek:'aldat'`
- yetenek {sürüş 0,5, çeviklik 0,25, yaratıcılık 0,25}, eşik 0,72
- a0 0, gec 1,2, dolanma 0,8 m, hazırlık 0,3 sn, yanılt 0,8, gecikme 0,25, hata 0,15

**Yeni koşul `'bacak'`**: savunmacı 1,0–2,0 m'de, yüzü topa dönük (cos > 0,85), yan duruşta değil ya da topa koşuyor. Ek C'deki "bacakları açık" koşulu budur.

**Tahmin**:
- Savunmacı okursa top ayağına gelir: pmN = 0.
- Okumazsa: pmY = σ((tr + gecikme − tb)/0,12).

**Yürütme**:
- `yutmaCoz` yutma nesnesine `bacak:true` yazar.
- Yutma süresince `temaslar` (`mac-motoru.js:583`) ve `govdeCarpmasi` (`mac-mudahale.js:364`) o savunmacı için yerdeki topu (y < 0,3) atlar.
- Okuyan savunmacıda top bacağa çarpar ve kayıp olur; tahminle tutarlı.

**Ayarlar**: sıklığın kolu `esik`, kalibrasyonun kolu `bacakKal`.

### d2. Şapka (`sapka:1`, `sapkaKal`)

**Seçilen yol**: yeni `mek:'asir'`.
- Koşul: savunmacı ≥ 3 m/sn hızla üstüne geliyor ve 1,5–3 m'de; sürücü < 3 m/sn.
- Fizik: `surusIlerle` itişinde (:754 `b.vy=0`) çalım itişine dikey hız eklenir. Tepe ≥ 2,3 m, vy ≈ 6,7 m/sn, uçuş ≈ 1,37 sn, yatay ≈ 2,5 m/sn; top savunmacının 1,5–2 m arkasına iner.
- Okuyan savunmacı sıçrar: pmN ≈ σ((tr + 0,3 − 0,6)/0,12).
- Hava modülü: yutma süresince aldatılan savunmacı kafa adayı olmaz. Bu yutma nesnesinden okunur; `js/mac-hava.js`'teki `sicramalar` adayları.

### Kabul
- Her biri ≥ 0,15 / maç (80 maçta ≥ 12 olay; 1 / 10 maç kabulünün güvenli üstü).
- Üst sınır: bacak arası ≤ 0,5, şapka ≤ 0,4 (seyrek kalsın).
- Başarı %35–60.
- Deneyenin sürüş ortalaması − saha oyuncularının ortalaması ≥ 0,1 ("beceriyle").
- `c-1v1` zorlanmış satırlarda |tahmin − gerçek| ≤ 10.
- `p-kalib` çalımının tahmin − gerçek satırı T26'dakinden kötüleşmez.
- `oyuncu-karnesi --duyarlilik`'te sürüş → çalım ≥ 1,25 korunur.

**Kapılar**: `c-1v1`, `c-koru`, `c-kanat`, `c-temas`, `c-surus`, `p-tip`; şapka için ayrıca `c-hava`.

---

## T27f: Çizim (E; ajan 5; f1 ve f2 PARALEL, f3 T27g'den, f4 T27d'den sonra; `js/animasyon.js`)

### f1. `endirektTut:1`
- :1035'te `bitti = sur ? h.t>=60 : h.t>1.2`. :972 ve :979'daki `sure:14` anahtar açıkken yok sayılır.
- Gerekçe: IFAB Kural 13'e göre kol, top başka oyuncuya değene dek havadadır. Kayıpların %98'i 14 sn'lik sınırdan geliyor.
- Kopyalamada 90,3 → 100.

### f2. `sevincImza:1`
- `anmSevincSec` :1267–1270'te her çeşidin puanı:
  - `0,6·(özellik − oyuncunun özellik ortalaması)`
  - `+ 0,5·h2(kimlik, i)` (kalıcı imza)
  - `+ 0,35·h2(kimlik, gol)`
- Bağlam, çizim tarafından salt okunur (`mac.score`, gol dakikası, `evSahibi`):
  - deplasmanda sus ve kulak +0,2;
  - geride ya da fark ≥ 3 iken sakin +0,5;
  - geç ve belirleyici golde yumruk ve kollar +0,2.
- Bugünkü yapısal baskınlığı kaldırır: kulak hep yumruğun, sakin hep susun altında kalıyor.
- Beklenen: 10 golde ≥ 5 çeşit olasılığı %51 → ~%80.

### f3. Sevinç süresi motordan (T27g'den sonra)
- :1528'deki `a.sevH`, motorun `c.sevincSure`'sinden okunur; f2'nin anahtar bloğuna bağlanır.

### f4. Bacak arası ve şapka çizimi (T27d'den sonra)
- **Bacak arası (~10 satır)**:
  - `ANM_CK` (:1124) girişi, itiş yüzeyi `'ic'`.
  - Aldatılan savunmacıda geniş duruş (:676'ya bir satır: genişlik 0,2, çökme 0,1).
  - `ytBacak` pozu.
- **Şapka (~15–20 satır)**:
  - yeni mek, `ANM_CK_YUR` (:1126) satırı;
  - `anmCkBasla` (:1132) dalı (aşırtma pozunun bacak değerleri);
  - `anmCalimDurum` (:1161) evre ağırlıkları.

### Ölçüm (`animasyon-olcum.py`)
- `--olay 80`:
  - endirekt ≥ %90 (beklenen ~100);
  - 10 golde ≥ 5 sevinç çeşidi (kapı tanımı değişmez);
  - bilgi: 20 yapay golde çeşit sayısı ve en sık çeşidin payı;
  - endirekt kaybının nedeni (boş kuyruk / süre sınırı).
- Yeni yapay kip `--calim <hareket> N` (zorlanmış satırla; `--koru` ve `--blok` gibi):
  - "A: bacak arası": çizilen ayak arası ≥ top çapı + 0,1 m ve top ayağa ≥ 0,05 m, ≥ %90.
  - "A: şapka": itişte ayak topa ≤ 0,15 m, savunmacının başı topa ≥ 0,15 m, ≥ %90.
  - "A: çalım": hazırlık ve itiş motorla aynı karede.
- Bütün çizim anahtarları 0'da `--karsilastir a9-anm.json` birebir. Açıkken öbür `A:` satırları aynı kalır.

### Galeri ve denetimler
- Galeri: `t4calim`'e iki satır, `t10olay`'a sevinç satırı.
- `kontrol.py araclar/poz-galerisi.html`.
- `animasyon.js` ekran listesinde olduğu için `akis-deneme.py` (tam koşu yalnız masaüstünde, ağır CPU işiyle aynı anda değil).
- Yeni üst düzey ad eklendiyse `ad-denetimi.js`.

---

## T27h: Denge (tek ajan, sıralı)

1. Bütün kollar birleştirilir. Ortak dosyalarda parçalar ayrı yerlerde:
   - `mac-motoru.js`: :430, :704, :708–715 (ajan 1) ve `temaslar` :583 (ajan 4).
   - `mac-mudahale.js`: :129, :305, :560, :607 (ajan 3), :364 (ajan 4), :552–575 (T27-0d).
   - `mac-kurallar.js`: :42 (ajan 3), :429 (ajan 2).
2. Birleşimin 40 maçı `--karsilastir t26.json`.
3. `kutuEsik` ve `skorEtki`'nin son değerleri birleşimde seçilir (her biri iki değer).
4. Karar 80 maçla.
5. Bütün anahtarlar 0'da `--ayni` bir kez daha.

## Kapanış (CLAUDE.md'deki tur kapanışı listesi)

**Ölçümler**
- 80 maç `--karsilastir t26.json` ve robotluk karnesi.
- Tek bir 240 maç koşusu, şunlar için:
  - pencerede şut oranı;
  - T26'nın ikinci yarı payı korunuyor mu;
  - direk ayrımı;
  - penaltı sıklığı ve kaleci hatası (bilgi).
- Bütün senaryolar.
- `kontrol.py`, `akis-deneme.py`, `an-yakala.py` önce/sonra (yalnız Claude'un kendi incelemesi; kullanıcıya gösterilmez).
- `oyuncu-karnesi.js 80 1 --duyarlilik`.
- Animasyon ölçümü ve yeni animasyon tabanı `araclar/taban/t27-anm.json`.
- `ikiz-deneme.js`.

**Hız bütçesi**
- `git worktree add --detach <klasör> tur/t26`.
- En az üç çift `hiz-olcum.js 3 --tekrar 5` ve aynı süreçte `--kok`.
- Gol ve duruş sayısı değiştiği için `hiz-evre.js`.
- Ortanca artış ≤ %10, tavan 250 ms.

**Kayıt ve belgeler**
- Yeni taban `araclar/taban/t27.json`; ağaçta yalnız t27 ve t26 tabanı kalır.
- Belgeler:
  - gerçekçilik planı "T27 — Sonuç";
  - Ek C'deki şapka satırının koşul notu;
  - TEKNIK_PLAN §8'e sevinç süresi sözleşmesi;
  - borç defteri: 28, 29 ve 46 kapanır, ertelenenler eklenir;
  - YOL_HARITASI devam notu.

**Kullanıcı isteği ("hepsi bitince main'e al ve push et")**
1. Her tur için "<Tur> main'e alındı" commit'i.
2. `main` T27'nin ucuna ileri sarılır.
3. `tur/t24`…`tur/t27` açıklamalı etiketleri.
4. Push.
5. Birleşen dallar silinir.

---

## Çakışan öneriler: seçim ve gerekçe

1. **`guvenPres` reddedildi.** Güvenle artan pres, gol atan takıma daha çok pres yaptırır. Gerçekte öndeki takım geri çekilir: topa sahip olma ve pres düşer (Lago 2009; Lago-Peñas ve Dellal 2010). Heuer ve Rubner 2012 de golün golü getirdiği bir momentum bulmadı. Planın "pres etkisi" `skorEtki`'nin pres teriminden gelir; kaçan fırsat ve kart etkisi güvenin vuruş ve risk kollarından. Pres kabulü tutmazsa yeniden açılır.
2. **Risk kolu momentum için kullanılmaz.** `skorEtki` riski nötr bırakır. `guvenRisk` ancak ölçüm ters yönü gösterirse yarıya iner (b3'ün koşullu sorusu).
3. **`kaleciIleri` ve kenar serbest vuruşta kaleci çıkışı yapılmaz.** Kabulde yoklar; `d-sut` ve `d-penalti` riski var. Borca yazılır.
4. **`onceHizPay` (faul modeli) yapılmaz.** Teşhise göre model katmanlarda tekdüze artıyor; [2]'deki düşüş bir karışım etkisi (Simpson). IFAB'ın hız ve şiddet maddesi kartın ağırlığıyla ilgili, faulün olup olmamasıyla değil. Değiştirmek `c-kayma`'daki faulsüz düşüşü riske atar.
5. **`kutuEsik` 'Kurallar' grubunda, C'de değil.** Bu hakemin kutudaki eşiğidir ve `hkFaulEsik` oradadır. Ayrıca ajan 3 ile ajan 4'ün `mac-mudahale.js`'teki çakışmasını azaltır. Tahmin de aynı eşiği kullanır (planlayıcı ile yürütme aynı).
6. **Şapka: çalım satırı (`'asir'`) seçildi; alışta seken topu aşırtma reddedildi.**
   - Çalım çerçevesi tahmin–gerçek kalibrasyonunu (`kal`) ve beceri eşiğini hazır veriyor.
   - Alış yolu, A8 alış çizimini, `c-surus`'u ve "A: alış"ı riske atar.
   - Ek C'deki "seken top" koşulundan sapma belgeye görünür yazılır.
   - Satır `c-hava`'yı tutturamazsa alış yolu ikinci seçenek olarak borca yazılır.
7. **Sıklık kolu `esik`, `kal` değil.** `kal` yalnız tahmin = gerçek kalibrasyonu içindir; sıklığı `kal` ile çekmek kalibrasyonu bozar.
8. **Sevinç kapısı değişmez** (10 golde ≥ 5). Ölçüme yalnız bilgi satırları eklenir; düzeltme çizimde yapılır (imza). Ölçüm aracının golcü seçimi aynı kalır, karşılaştırılabilirlik korunur.
9. **Direk: motor değişmez.** Şut anındaki damga 3 sn sürüyor ve direk teması çoğu zaman bunun içinde kalıyor. Takipçilerin topun yeni iniş noktasına yönelmesi ancak 240 maçlık ayrım bir kusur gösterirse açılır. Geri sekme katsayısı 0,55'in gerçek değeri bilinmiyor; dokunulmaz.

## En büyük riskler ve geri dönüş yolu

1. **Gol 2,2–3,3.**
   - Penaltı payı 0,74 → ~0,35: penaltıdan gol −0,25…−0,3.
   - `kaleciHata` −0,03; `skorEtki` ±0,15. Net beklenti −0,2 civarı.
   - T24-0'da gol 2,5; T26 tabanı belirleyici.
   - Kural: gol 80 maçta < 2,3 olursa `kutuEsik` 0,2 → 0,1 → 0 sırasıyla geri çekilir. Kalan penaltı fazlası borçta kalır. Gol bandı penaltı gerçekçiliğinden önce gelir.
2. **Şut 16–28.**
   - T24-0'da 17,1, alt sınıra yakın.
   - Penaltı şutları −0,35; `kutuEsik` sonrasında süren oyun ve `skorEtki` artı yönde.
   - < 16,5 ise önce `kutuEsik` düşer, sonra `skorEtki` 0,3'e çıkar.
3. **÷ konum xG 0,85–1,20.**
   - Penaltının oranı ~1, bu yüzden az oynar.
   - `kaleciHata` gerçekleşeni düşürür.
   - `skorEtki` gerideki takımın uzak ve bloklanan şutunu artırabilir.
   - Bant dışına çıkarsa `kaleciHata` tavanı kaldırılır; `skorEtki`'nin direkt terimi düşürülür.
4. **İvmelenme** (> 3 m/sn² / oyuncu·dk ≤ 5; T24-0'da 5,7 "!"; eşzamanlı ≤ 1; görev tablosu ≤ 15).
   - Artıranlar: `skorEtki`'nin pres terimi (gerideki takımın 1. adam koşuları) ve `santraKarsila` (gol evresinde bir koşucu daha).
   - Azaltan: `sevincBaglam` (uzaktakiler yürür).
   - Kural: T26 tabanı + 0,1'i aşarsa `skorEtki` 0,15'e iner; gerekirse pres terimi 0 olur (ikinci soru).
5. **T26 ve T16b kabulleri.** İkinci yarının gol payı ≥ %50 (240) ve son dilim oranı 0,5–0,6: `skorEtki` son dakikalarda söner. Kapanıştaki 240 maç ikisini de okur.
6. **Şapkanın hava yan etkileri.** `c-hava` tutmazsa `sapka:0`; satır ve çizimi kapalı kalır, borca yazılır.

**Genel geri dönüş**
- Her anahtar 0'a çekilince T26 motoru birebir geri gelir (`--ayni` her adımda kanıtlı).
- Çizim anahtarları 0'da a9 çizimi birebir (`--karsilastir`).
- Ölçüm araçlarına yapılan eklemeler yalnız yeni satırdır. `c-temas`'ın eski [2]'si bilgi satırı olarak kalır.

## Ertelenenler ve yapılmayanlar (borç defterine)

- `guvenPres`, `kaleciIleri`, kenar serbest vuruşta kaleci çıkışı, `onceHizPay`.
- Şapkanın alış yolu (seçenek).
- Direkten dönen topun takip koşusu (ancak teşhis kusur gösterirse).
- Penaltı sıklığının ince ayarı (240 maç; ~0,05 standart hata).
- Eğilim satırlarının anlamsız çıkanları. `egilimGuc` T27'de ayarlanmaz; `p-tip` ve bütün kararları etkiler.
- `aceleUzun`: yalnız ölçüm tetiklerse.

## Gerçek değerler (dayanak)

- **Penaltı / maç** (Premier Lig, VAR dönemi; The Analyst): 0,23–0,33.
- **Elle oynama penaltısı:** 0,037–0,066 / maç; penaltının %7,5–20,7'si (ESPN, bettingodds).
- **Direk ve üst direk:** ~0,58 / maç (The Analyst).
- **Kaleci hatası → gol:** ~0,03–0,06 / kaleci·maç. Düşük güvenli bir çıkarım, kaynak değil.
- **Momentum ve skor durumu:**
  - Heuer ve Rubner 2012 (PLoS ONE 7(11): e47678): golün golü getirdiği bir momentum yok.
  - Lago 2009; Lago-Peñas ve Dellal 2010: öndeki takımın topa sahip olma payı daha düşük.
  - Son dilimde öndeki ÷ gerideki şut ~0,5–0,6 (T16b).
- **IFAB:**
  - Kural 8: tek kişilik santra.
  - Kural 13: endirekt işaretinde kol top başka oyuncuya değene dek havada kalır.
  - Kural 7: sevinç süresi uzatmaya eklenir.
- **Kaynağı olmayanlar** (bantlar motor kararıdır ve belgeye görünür yazılır):
  - golden sonraki 5 dk'da şut ve pres farkı;
  - bacak arası ve şapka sıklığı;
  - gol → santra süresinin dağılımı;
  - sevinç türlerinin sıklığı.
