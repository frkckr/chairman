<!-- Üretildi 2026-10-21: Claude'un 2026-10-20 oto mod oturumunda tasarım ajanlarının çıkardığı ve birleştirdiği uygulama planı. Kaynak JSON'u aynı klasörde (<tur>-tasarim.json: alan tasarımları). Kabul ve sıra kullanıcı onaylı programın (FUTBOL_KUTUPHANESI §12.13) içindedir; bu dosya uygulayıcı için ayrıntıdır, belge değildir. -->

# A11 — uygulama planı (2026-10-20; Claude'un tasarımı, kullanıcı onaylı program §12.13)

**Durum (2026-10-21 sabah, dizüstü):** Dal `claude/motor-a11` (`../chairman-a11`). Yapıldı: A11-0 (150ecbe), A11a (520e55a), A11b (7ac7e9f). A11c yarım kaldı (ara durum commit'i). Kaldı: A11c, A11d, A11e, A11f, A11g, inceleme, A11h. Sapma: A11 K1 ucundan paralel açıldı; A10'un vuruş katmanına dokunulmaz, STIL.animasyon.a11; önce kopyası `araclar/karsilastir/a11once` (K1 çizimi); birebirlik tabanı `araclar/taban/k1.json`.

## Plan

AMAÇ
Kullanıcının notu: "düşüşler mekanik, direkt düşüyorlar; nasıl faul olduğuna göre farklı düşüşler". A11 bunu üç katmanda çözer:
- Motor, temasın anını salt okunur bir sözleşmeyle çizime verir (`darbe` nesnesi ve 'darbe' olayı). Motorun sonucu değişmez.
- Çizimde sendeleme ve düşmeyen temaslar klipsiz yaylarla ve yakalama adımlarıyla çizilir (J.7 D7, D5 kademe 1).
- Düşüş, faulün türüne göre aile seçen, anahtar pozlu bir programla çizilir. Kök kalçadan iner, eller önce yere gelir, yakalanan bacak geride kalır; yerde canlılık ve kalkış programı vardır (J.6, D5 kademe 2/3).
Locadan (60–100 m) okunması gerekenler: düşüşün yönü, ilk 300 ms'deki kırılma, tökezleme adımı, ellerin önce yere gelmesi ve "ölü" görünmeyen bir yerleşme.

SIRA
Önce motor (A11a; `--ayni`), sonra ölçü (A11b; `--once a10` ile önce değerleri), sonra çizim:
- A11c: yaylar;
- A11d: tökezleme;
- A11e–f: düşüş programı;
- A11g: yerde kalma ve kalkış;
- A11h: kalibrasyon ve kapanış.

Her alt adımın sonunda motor çalışır. Motor yalnız A11a'da değişir; o adımın sonunda `darbe` 0 ve 1 değerlerinin ikisinde de turun tabanına 40/40 `--ayni` tutar. Çizim adımlarında `STIL.animasyon.a11.acik` 0 iken çizim a10 tabanıyla birebir aynıdır.

ÜÇ TASARIMIN BİRLEŞTİRİLMESİ — ÇELİŞKİLERİN ÇÖZÜMÜ (Claude kararı, belgeye görünür yazılır)
1. **Tek motor anahtarı.** `MOTOR_AYAR.darbe` (1) ve `darbeEsik` (0,25 m/sn). A11b'nin `temasBilgi`/`temasEsik` ve A11c'nin `dususSozlesme` anahtarları bunun içinde birleşir. Bildirim js/mac-motoru.js C satırında, değer js/mac-mudahale.js `ayarEkle('C')` içindedir.

2. **Tek olay.** A11a'nın 'darbe', A11b'nin 'itilme' olayı ve A11b'nin sekme/block/hakemeCarpti'ye eklemek istediği alanlar tek bir 'darbe' olayında birleşir. Olayın şekli sabittir: `{p, o, tur, ux, uz, dv, v, y, kayip, sonuc, darbe}`. Üç kaynağı vardır:
   - (a) `dengeBoz`'un her etkili çağrısı;
   - (b) gövde çarpışmasında `dengeBoz`'a gitmeyen ya da orada etkisiz kalan bir bedenin dv ≥ `darbeEsik` olması (hakem dahil, bütün fazlarda);
   - (c) topun bedene çarpması: `tur 'top'` ile, `v` ve `y` alanlarıyla.

   Var olan sekme, block ve hakemeCarpti olaylarına alan eklenmez; block'un `v` alanı bugünkü anlamını korur. Çizim tek bir akış tüketir (`ANM_DARBE`).

3. **Sözleşme nesnesi.** A11b'nin `sendele.neden/kaynak` ve A11c'nin `dusus.kaynak/rakip/kalkis` önerileri, darbe nesnesinin `tur`, `yapan` ve `kalk` alanlarıdır. A11c'nin `bacak` alanı darbe nesnesine eklenir:
   - `mdhBacakTakilma`'da uzanan bacak segmentinin düşene en yakın noktasının gövdeye göre yanı;
   - kaymada 'iki'.

   Oyuncu nesnesine alan eklenmez.

4. **Aile.** Motor kaba J.6 tipini verir (`tip`: takilma, kayarak, itilme, cekilme, havaInis, aldatma). Bu tip tek kaynaktır ve ölçülebilir. Çizim tipi görsel aileye inceltir:

| tip | koşul | aile |
|---|---|---|
| kayarak | — | kayan |
| cekilme | — | cekme |
| havaInis | — | hava |
| aldatma | — | otur |
| itilme | n·yüz > 0,3 | takilma ailesi (yakalanan bacak yok) |
| itilme | n·yüz < −0,4 | itme (önden) |
| itilme | arada | yan |
| takilma | \|v\| ≥ 1,5 | takilma |
| takilma | \|v\| < 1,5 | cokme |
| darbe null, neden 'sakatlik' | — | sakat |

   Taktik faulde A11a'nın ayrımı geçerlidir: `v.itme` ise cekilme, değilse takilma. Bu, koddaki `gecildiFaulu` ayrımıdır. A11c'nin "taktik her zaman çekme" önerisi uygulanmaz.

5. **Görsel yön d.**
   - takilma: norm(w·v̂ + (1−w)·n), w = clamp((|v| − 1,5)/3, 0, 0,8) (A11a). A11c'nin v + n formülü momentumu sınırsız büyütüyordu.
   - kayan: norm(v̂ − 0,8·ŝ); ŝ rakibin hız yönü, yoksa ryon, o da yoksa −n (A11c).
   - itilme ailesi: norm(n + 0,1·v + 0,06·rv) (GRF, A11a).
   - cekme: −n, rakibe doğru. |sin| değişmediği için motorun kalkış sınıfı bozulmaz (A11a).
   - hava: norm(n + 0,3·v̂) (A11c).
   - otur: n.

6. **Yatış ve kalkış.** Zorunlu yuvarlanma yoktur. J.6 ve G4'e göre fazla yuvarlanma simülasyon belirtisidir. A11a'nın "yan ↔ yüz/sırt farkı yerde evresinde yuvarlanarak kapatılır" kuralı uygulanmaz.
   - Yatış türü d'den gelir (d·yüz > 0,5 yüz, < −0,5 sırt, arası yan). Yandaki alt tür motorun `yuzustu` ipucundan, yoksa h2'den.
   - Kalkış programı altı hücrelidir: yüz/sırt/yan × 1,1/1,6 sn. A11c'de eksik olan "yan 1,6" eklenir. Hep motorun `e.sure`'una sığar.
   - "Son yatış ↔ darbe.kalk sınıfı" yalnız bilgi satırıdır.
   - Kayan ailenin kendi yuvarlanması (0,35 sn) kalır.

7. **Ragdoll.** Seçilen yol B'dir (A11c): anahtar pozlu düşüş programı, kalçadan kök, el ve bacak IK'sı, zemin kilidi ve eklem uzayında ikincil yaylar. 10–12 noktalı verlet uygulanmaz. Gerekçe:
   - ilk 300 ms kırılma, ellerin önce gelmesi ve yön tasarımla garanti edilir;
   - determinizm motorun `e.t`'si ve h2 ile sağlanır;
   - ters bükülme, temasta titreme ve uzaktan "ölü" görünme riskleri yoktur;
   - hız kalemi küçüktür.

   Bu, §12.13'ün metninden (A11 satırı ve J.7 D5'te "verlet ragdoll") bilinçli bir sapmadır. G4 ↔ G0.10 çelişkisi şöyle kapanır: "aktif ragdoll yok; motor tip/yön/süre verir, çizim anahtar pozlu program + yaylar". A seçeneğinin nokta → kemik eşleme notu belgeye yedek olarak yazılır. Kullanıcı yerleşmeyi sert bulursa, A yalnız yerleşme evresi için ayrı karar olarak açılır. Tur özetinde kullanıcıya açıkça söylenir.

8. **GRF skalası.** Motorun denge eşiğine sayısal olarak eşlenmez; motorun birikimli `denge`si skalanın zamana yayılmış karşılığıdır:

| Motor | GRF |
|---|---|
| sendele: denge < 0,3 | 0,48 |
| düşüş: denge < 0 | 0,58 |
| kayarak (tip) | 3. kademe |

   Yönlü hassasiyet çizimde h olarak hesaplanır (A11a §7: `STIL.animasyon.a11.hassas`). h şiddetin doygunluğunu kırar:
   - sendelemede faulse c/0,35;
   - düşüşte max((siddet − 0,2)/0,8, c/1,3);
   - darbede min(1, kayip/0,6).

   h şunları ölçekler: sendelemenin yay girişi (A11b formülünde şiddet yerine h), düşüşün kırılma açısı ve ilk açısal hızı (× (0,8 + 0,4h)), kol savrulması, tökezleme sınıfı (h ≥ 0,6 iken üst sınıfın olasılığı +0,25).

   Motor kararını yönlü yapmak sonucu değiştirir; bu borç olarak kalır.

9. **İki tökezleme mekanizması bağlamla ayrılır.**
   - Sendele ve darbe sırasında yürüyüş döngüsüne yakalama noktası ofseti eklenir (A11b).
   - Kilitli düşüşte programın çivili adımları vardır (A11c).
   - Adım süresi sabitleri ortaktır (0,17 + 0,02i sn).
   - Düşüş programının başlangıç açısı ve açısal hızı denge yayından (`a11.dgy.bF/bR/vbF/vbR`) alınır; sendeleden düşüşe geçişte sıçrama olmaz. Denge yayı tam beden yuvalarıyla söner.

10. **A11b'nin `govdeTemasi`/tutma/sekme yedeği yapılmaz.**
    - `darbe` 0 iken D7 tepkisi yoktur (bugünkü gibi).
    - Sendele genel itilmedir.
    - Düşüşün ailesi `neden`den ve `ANM_DUSUS`'tan gelir (faul, avantaj, faulGorulmedi olaylarının kaynağı ve yapanı).

11. **Ölçü araçları birleşir.**
    - animasyon-olcum.py'de üç satır ("A: düşüş", "A: tökezleme", "A: darbe") ve iki yapay kip (`--dusus N`, `--temas N`).
    - Motor tarafında c-beden.js (bilgi), g-temas.js (MAC_DENEME_TEMAS=1 teşhis) ve c-temas [4] (kapı).

12. **Çizim durumu.**
    - Aktörde tek alan `a11` vardır: aktorKur'da null, ilk temas ya da düşüşte `anmA11Yeni()` ile sabit şekilde `{dgy, ds}` kurulur.
    - Tek harita `ANM_DARBE`.
    - Tek ayar nesnesi `STIL.animasyon.a11` (acik, hassas, yuk, denge, darbe, kol, adim, top, dusus{kok, el, adim, zemin, yay, cesit, tut}, aile, kalk). Her alt anahtarın 0'ı o parçayı kapatır.
    - A11 yolunda `rnd` (Math.random) kullanılmaz. Tohum h2(no + 31·takım, darbe.kare || mac.kare). `anmDususBasla`'nın `rnd`'si yalnız acik 0 yolunda kalır.

13. **Eski yolda kalanlar** (A11c riskleri): plonjon (T14e), yatan barajcı (Z2e), kalecinin uçuşu ve kalkışı (`e.kaleci`), kaymanın kendi kalkışı (öncesinde düşüş yok), kapan, sedyedeki sakat. Sedyeye 0,3 sn harmanla geçilir; bu sayede "A: olay"ın "sedyede kök" tanımı değişmez.
    - Temaslı sakatlıkta düşüş darbelidir, yerde süresi 999'dur ve yerde `anmSakatPoz` baskındır. Program `lieTur`/`lieSag`'ı yazar.
    - Temassız sakatlığın ailesi 'sakat'tır.
    - Sakatlık akışının kalkışı darbesizdir; `a11.ds` etkinse yine programla kalkar.

14. **Yerleştirme.** S1, V1 ve A10 aynı dosyalara dokunmuş olacak. Değişiklikler satır numarasıyla değil işlev adıyla yerleştirilir: `dengeBoz`, `dus`, `faulDusur`, `mdhBacakTakilma`, `EYLEM_ADIM.dusus/yerde`, `omuzIt`, `tutmaAdim`, `ikiliMucadele`, `mudahaleSonuc`, `sekme`, `blok`, `govdeCarpmasi`, `ortaBlokUygula`; mac-hareket'te çarpışma döngüsü ve `yutmaCoz`. Prototip (scratchpad/a11sz/yama.js; 4/4 + 4/4 `--ayni`) yalnız rehberdir.

TABANLAR
- Motor: A10 kapanışındaki taban (devam notunda; V1 sonucu değiştirdiği için beklenen `araclar/taban/v1.json`). A11 motor sonucunu değiştirmediği için yeni motor tabanı yazılmaz.
- Animasyon: `a10-anm.json`. Önce kopyası `dondur.js a10`. Kapanışta yeni taban `a11-anm.json`.
- Hız: `git worktree add --detach <klasör> tur/a10` ile önceki tura karşı aynı süreçte ölçülür.

BORÇLAR (sonucu değiştirir; bu turda yapılmaz, belgeye yazılır)
- Motorun kalkış süreleri J.6'dan kısa: yüzüstünde 1,1–1,6 sn, gerçekte 1,5–2; sırtüstünde gerçekte 1,5–3.
- Kayma faulünde motorun kökü 0,45 sn'de 2,3–2,9 m kayıyor (fren 6). Çizim kalçayı motora en çok 0,9 m ofsetle bağlar.
- Yönlü motor kararı: arkadan temasta daha kolay düşme; kafa eylemi sendelemeyi engelliyor (1,4/maç yalnız 'darbe' olayıyla görünür).

OTO MOD VE GİT
Yerel commit noktaları:
- A11a sonu;
- A11g sonu;
- kapanış.

Her commit'ten önce `oturum-sonu.js <taban> --ayni` (dizüstünde `--mac 24`) okunur. Her commit'ten sonra dal `origin`'e push edilir ve devam notu güncellenir; akşam ev bilgisayarından devam edilebilir.

Kapanış kapıları geçmezse tur `main`'e alınmaz: dal ve devam notu push edilir, eksik kapı devam notuna ve kullanıcıya yazılır. Geçerse:
- "A11 main'e alındı" commit'i atılır;
- `main` ileri sarılır;
- `tur/a11` açıklamalı etiketi konur;
- push edilir (`main`, etiket);
- birleşen dal ve hız ölçümünün çalışma ağacı silinir.

Oto mod A11'de biter. Sıradaki Z6-2, kullanıcı "devam" deyince planlanır.

## Alt adımlar

### A11-0 — Açılış, önce kopyası, tabanlar ve plan

**Dosyalar:** `araclar/karsilastir/a10/ (yeni önce kopyası)`, `FUTBOL_KUTUPHANESI.md (§12.13 A11 planı)`, `YOL_HARITASI.md (devam notu)`

Açılış:
- `git fetch` ve `git status`; kullanıcı değişiklikleri korunur.
- Dal `claude/motor-a11`, A10'un ucundan açılır (A10 `main`'e alındıysa `main`'den).
- `node araclar/karsilastir/dondur.js a10` ile çizimin önce kopyası alınır. M2 kuralı: tek kopya kalır; `a9` A10 kapanışında silinmediyse burada silinir.

Tabanlar:
- Turun motor tabanı (A10 devam notu; beklenen `v1.json`) ve animasyon tabanı (`a10-anm.json`) yerinde olmalı.
- Bu makinede 4 maç `--ayni` tutmalı. Tutmazsa yerel taban üretilir, depoya alınmaz.

Plan ve hazırlık:
- Bu plan FUTBOL_KUTUPHANESI §12.13'e "A11 planı" alt başlığıyla yazılır (oto mod kuralı: plan tur başında belgeye girer). YOL_HARITASI devam notuna "A11 açıldı" yazılır.
- Hedef işlevler grep ile yeniden okunur: dengeBoz, dus, faulDusur, mdhBacakTakilma, omuzIt, tutmaAdim, ikiliMucadele, mudahaleSonuc, sekme, blok, govdeCarpmasi, ortaBlokUygula, EYLEM_ADIM.dusus/yerde, mac-hareket çarpışma döngüsü, yutmaCoz; çizimde anmDususBasla, anmBasla, anmEylemler, anmEkler, anmTavir, anmYuruyus, anmKok, aktorGuncelle, animasyonOlay. Amaç, S1, V1 ve A10'un değiştirdiği yerleri görmek.

**Denetim:** - `node araclar/mac-deneme.js 4`: "sonuç aynı".
- `node araclar/mac-deneme.js 4 --karsilastir araclar/taban/<taban>.json --ayni`: 4/4.
- `git diff --check`.
- Oyun kodu değişmez.

### A11a — Motor sözleşmesi: `darbe` nesnesi ve 'darbe' olayı (sonuç değişmez)

**Dosyalar:** `js/mac-motoru.js`, `js/mac-mudahale.js`, `js/mac-hareket.js`, `araclar/olcumler/c-beden.js`, `araclar/olcumler/g-temas.js`, `araclar/senaryolar/c-temas.js`, `TEKNIK_PLAN.md (§8)`

(1) Anahtarlar: MOTOR_AYAR C satırına `darbe:undefined, darbeEsik:undefined` eklenir. `ayarEkle('C')` içinde `darbe:1` ve `darbeEsik:0.25` (m/sn) olur. Açıklama: "A11: sendeleme ve düşüş eylemine, ayrıca 'darbe' olayına çizimin okuyacağı temas anı; rastlantısız, motor okumaz; 0 ve 1'de sonuç birebir; 0'da alan null ve olay yok".

(2) Saf yardımcılar `MDH_DARBE_TIP` ve `mdhDarbe(m,p,tur,yapan,ek,kayip)` (dosya sonu, EYLEM_ADIM.mudahale'den önce):
- tip tablosu A11a'dakidir; taktik ise ek.itme → cekilme, değilse takilma;
- havadaki düşen kayarak dışında havaInis olur; tablo havaInis dediği hâlde yerdeyse itilme olur;
- bacak = ek.bacak, yoksa (tur kayma ise 'iki', değilse null);
- tek nesne literali, alan sırası sözleşmedeki gibi; kalk null.

(3) `dengeBoz(p,m,ux,uz,neden,kaynak,tur,ek)`:
- `kayip = m/mdhDengeGuc(p)` ayrı hesaplanır; `p.denge -= kayip` bit düzeyinde aynıdır.
- T = tur, yoksa (neden 'faul' ise 'mudahale', değilse neden).
- Düşüş dalı `dus(...,kaynak,undefined,T,ek,kayip)` çağırır.
- Sendele literaline `darbe` eklenir.
- Etkili her çağrının sonunda 'darbe' olayı yayılır: sonuc 'yok', 'sendele' ya da 'dusus'; dv = ek.dv ya da null.
- Etkili çağrıda true döner. Bugün dönüş değerini okuyan yok.

(4) `dus(...,tur,ek,kayip)`:
- D, hız itkisinden önce kurulur ve eyleme yazılır.
- `D.kalk = mdhKalkisSure(p,p.eylem)`.
- 'dusus' olayına `darbe:D` eklenir.

(5) `faulDusur`:
- tur = v.kaynak, yoksa faul() neden kuralıyla türetilir (kayma, hava, itme, mudahale).
- ek = {faul:true, c, itme:!!v.itme, bacak:v.bacak||null, dv:null}; yalnız darbe 1 iken nesne kurulur.
- rast() çağrısının yeri ve sırası aynen kalır.

(6) Çağıranlara tür ve ek:
- ikiliMucadele 'ikili';
- tutmaAdim 'tutma', ek dv = 0,45·|v_o| (hız farkı);
- mudahaleSonuc faulsüz temas: kayma ? 'kayma' : 'mudahale';
- geçilen savunmacı 'gecilme';
- mdhBacakTakilma: kay ? 'kayma' : 'bacak', ek bacak;
- omuzIt kaybedeni: hız değişiminden önce/sonra farkla ek dv; kazanan aynı tür, dv null;
- mac-hareket çarpışması 'carpisma', ek dv = J·i;
- yutmaCoz 'aldatma';
- mac-hava.js değişmez ('hava' varsayılandan gelir).

(7) `mdhBacakTakilma` bacak yanı: segmentin düşene en yakın noktası gövde sağına göre ((−sin yon, cos yon)) 'sag' ya da 'sol'; kaymada 'iki'. temasFaulu'na giden v literaline `bacak` yalnız darbe 1'de eklenir.

(8) Çarpışma döngüsü: her beden için `dengeBoz` koşulu sağlanmadıysa ya da çağrı etkisiz döndüyse ve J·i ≥ darbeEsik ise doğrudan 'darbe' olayı yayılır: {tur:'carpisma', kayip:null, sonuc:'yok', darbe:null}. Hakem dahil, bütün fazlarda. Konum düzeltmesi, dürtü, dengeBoz ve govdeTemasi sırası değişmez.

(9) Topun bedene çarpması. Yeri: sekme(p) içinde elleOynamaDene'den sonra ve yansit'ten önce; blok(p); govdeCarpmasi'nda oyuncu, yatan barajcı ve hakem; ortaBlokUygula. Olay: 'darbe' {o:null, tur:'top', ux,uz = bağıl hızın birim yönü, v = |bağıl hız|, y = b.y − (p.yuk||0), dv/kayip null, sonuc 'yok'}. ikiliMucadele'nin sıkışma sekmesi hariç.

(10) EYLEM_ADIM.dusus ve .yerde: sonraki literale `darbe:e.darbe||null` yazılır; aynı nesne taşınır.

(11) Ölçü:
- c-beden.js (bilgi; maç başına):
  - düşüş ailesi cDa*;
  - sendele ailesi cSa*;
  - darbe tür × sonuc cDb*;
  - düşüş şiddeti dilimleri (<0,5 / 0,5–0,8 / ≥0,8);
  - düşenin hızı dilimleri (<2 / 2–5 / ≥5 m/sn);
  - darbesiz düşüş;
  - ozet: tür (faul/faulsüz) × şiddet tablosu; her hücrede adet, hız ortancası ve kalkış yan payı.
- g-temas.js (MAC_DENEME_TEMAS=1): darbe tür × dv bandı; top y × v bandı.
- c-temas.js [4]: [1] ve [3] denemelerinin olaylarından kapsam, tür ve aile N/N. Yön (|ra − kurulum| ≤ 45°, ≥ %85) ve kalk ↔ gerçek kalkış bilgi satırıdır. darbe 0'da 'atlandı' yazar.

(12) TEKNIK_PLAN §8 sözleşme listesi (sozlesme alanındaki metin).

**Denetim:** Hızlı kademe (her düzenlemeden sonra):
- `node araclar/mac-deneme.js 4`: sonuç aynı.
- `node araclar/ad-denetimi.js`: bulgusuz (yeni üst düzey adlar MDH_DARBE_TIP, mdhDarbe).
- `--senaryo c-temas`: [1]–[3] sayıları birebir, [4] N/N.

Adım sonunda:
- 40 maç `--karsilastir araclar/taban/<taban>.json --ayni` iki ayarda 40/40: varsayılan ve `MAC_DENEME_AYAR='{"darbe":0}'`. Tekrarlanabilirlik "sonuç aynı".
- `node araclar/ikiz-deneme.js`: Aynılık N/N; 'darbe' olayı ikizde aynı ad ve karede.
- Değişmeden geçmesi gerekenler: c-yariyariya, c-donen, c-1v1, c-koru, c-hava, o-sakatlik, d-duran, d-sut, v-sut (temas, dengeBoz çağıranları, blok ve sekme).
- `node araclar/hiz-olcum.js 2 --tekrar 8 --ayarlar '{"kapali":{"darbe":0}}'`: eşleştirilmiş oranın ortancası ≤ %10 (beklenen ~%0).
- c-beden'in prototiple kıyası (tohum 21–24, maç başına):
  - düşüş aileleri: kayarak ~3,75 · takilma ~3 · itilme ~2 · havaInis ~1,25 · cekilme ~1;
  - 'darbe' olayı: ~230 + çarpışma dv ≥ 0,25 (~700–1000).
- `oturum-sonu.js <taban> --ayni` (dizüstünde `--mac 24`) okunur. Ardından yerel commit "A11a: darbe sözleşmesi (sonuç değişmez)" ve dal push edilir.

### A11b — Ölçü önce: "A: düşüş / tökezleme / darbe" satırları ve yapay kipler

**Dosyalar:** `araclar/animasyon-olcum.py`, `araclar/an-yakala.py`

animasyon-olcum.py'ye üç satır eklenir; tanımlar kabuldedir:
- "A: düşüş (A11)": aile dağılımı; ilk 300 ms kırılma; temasta ω ve kare başına Δω; Δφ; temas sırası ve zamanları (el, ön kol, diz, kalça); kök sürekliliği; gömülme; yön tutarlılığı; kalkış süresi ve son kare dikliği; son yatış ↔ darbe.kalk (bilgi); düşen aktör başına µs.
- "A: tökezleme (A11)": basış/sendele; yakalama basışı payı; ilk yakalama zamanı; pencere içi ayak kayması; yatış yönü ve tepe açısı; toparlanma; kol açılması.
- "A: darbe (A11, D7)": görünür tepki payı; tepe cm ve locada piksel; tepki süresi; koşunun sürmesi; kırılma ve sıçrama; darbe saniyesi / oyuncu·dk (bilgi).

Eski "tökezleme: sendele N kare, kısa adım %" bilgisi bunlarla değişir.

Yapay kipler:
- `--dusus N`: aileler × 2 hız (2,5 / 6 m/sn) × 2 yan; motorun gerçek dus, faulDusur ve dengeBoz yolundan (--olay kalıbı).
- `--temas N`: yedi sahne:
  - omuz omuza;
  - itilerek sendele: 0/3/6 m/sn × önden/arkadan/sağdan/soldan × şiddet 0,2/0,5/0,9;
  - arkadan takılma;
  - gövde çarpışması: 0/45/90° × 3/5/7 m/sn;
  - top gövdeye: 15/25 m/sn × bacak/göğüs/baş.
- Tetiklenmeyen sahne sayılır ve dengeBoz doğrudan çağrısına düşer.

an-yakala.py seçicileri (e.darbe.tip ve 'darbe' olayından): dusus-kayarak, dusus-cekilme, dusus-hava, kalkis-sirt, omuz, takilma, carpisma, gogse-top.

Önce değerleri `--once a10` ile alınır (a10 çizimi + A11a motoru): tohum 3 ve 7, `--dusus 64`, `--temas 96`. Değerler devam notuna yazılır. Beklenen: temasta Δω ~5,7 rad/sn·kare, el önce ~0, yakalama basışı ~0, görünür darbe ~%0.

**Denetim:** - Araç iki kez koşulur; A: satırları aynı çıkmalı.
- `--karsilastir araclar/taban/a10-anm.json` ile eski satırlar değişmemeli.
- Oyun kodu değişmedi; maç denemesi gerekmez.
- Sonuçlar Claude'un kendi incelemesidir, kullanıcıya sunulmaz.

### A11c — Temas katmanı I: denge, darbe ve kol yayları (D7 ve sendeleme; adımsız)

**Dosyalar:** `js/animasyon.js`, `js/stil-99.js`

Kurulum:
- `STIL.animasyon.a11` iskeleti kurulur: acik, hassas (0,45 / 0,2 / 0,15 / 0,1 / 0,1), yuk (tur → temas yüksekliği: carpisma 0,55, omuz/tutma/itme 0,8, faul ve mudahale 0,5, hava 0,6, takilma/bacak/kayma/gecilme/ikili 0,3, aldatma 0,5), denge, darbe, kol, top (A11b değerleri).
- aktorKur'a `a11:null` eklenir; `anmA11Yeni()` sabit şekli kurar.
- `ANM_DARBE` haritası (p → birikim {ux, uz, dv, y, t, o, tur, kayip}). animasyonOlay 'darbe' olayını biriktirir; ×4'te birden çok adım toplanır, 0,2 sn'den eski birikim atılır.

`anmDengeAdim(a,p,dt,sx,sy)` (anmPozBasla'da anmTavir'den önce; oyuncu ve hakem). Üç yay:
- denge: ω 6 (kimlik ±0,1), ζ 0,7, τ 0,06;
- darbe: ω 15, ζ 0,45, τ 0,04;
- kol: ω 14, ζ 1.

Yayların işleyişi:
- Kuvvet basamağı f += ΔΩ/τ; yarı örtük Euler ve anmAltAdim.
- tanh tavanları: denge 0,45; darbe leğen 0,2 / gövde 0,35 / baş 0,45.
- Kilitli tam beden eylemlerinde exp(−12·dt) ile söner.
- Ağırlık w = 1 − max(sw[dusus, yerde, kalk, kalk2, kayma, ucus*, kapan, sakat, sedyeTut]).

Girdiler:
- Sendele: ΔΩ_denge = 2 + 4,5·h, ΔΩ_darbe = 1,5 + 2,5·h.
- Darbe olayı:
  - dv'li: ΔΩ_darbe = 1,8·(dv − 0,25)⁺ (tavan 6), ΔΩ_denge = 0,5·(dv − 0,25)⁺ (tavan 3), burulma 0,3·teğetsel (tavan 2);
  - dv'siz: g = min(1, kayip/0,6), kayip < 0,05 ise tepki yok;
  - top: A11b tablosu (gövde 0,15·(v − 8)⁺, baş 0,25·v, bacak 0,04·v).
- Yükseklik ağırlıkları wP, wT, wH.

Sendele ailelerinin yay ve kol tarafı:
- omuz: yana;
- takılma/kayma, > 2 m/sn: koşu yönü + 0,3·itilme;
- tutma/çekilme: geri sarsılma;
- faul: genel, güçlü;
- hava: diz.

`anmDengeUygula` (anmEkler'in sonunda, A9 basSon'dan önce; bacak IK'sından önce): leğen, gövde, baş (dik tutulur), kollar (kol yayı zorunlu ara katman), LOD (a.kucuk'ta kol, irkilme ve baş atlanır).

Eski yollar (acik 1 iken kapanır, acik 0 iken a10 birebir):
- anmEylemler sendele yuvası st 0;
- anmEkler'in sendele eğimi ve kol çırpması bloğu;
- omuz kaybedeninin itme bloğu (wo);
- anmBasla'nın sendele dalı (acik 0 için kalır).

Dışa açık: `anmDengeDarbe(a,ux,uz,dB,dL,h,dY)`.

**Denetim:** - `node araclar/mac-deneme.js 4`: sonuç aynı (motor dokunulmadı).
- `node araclar/ad-denetimi.js`: yeni üst düzey adlar; çizim motora yazmıyor.
- `python araclar/kontrol.py` ve görüntü incelemesi.
- `python araclar/animasyon-olcum.py --karsilastir araclar/taban/a10-anm.json` (tohum 3) ve `--temas 96`:
  - A: darbe görünür tepki ≥ %90;
  - kırılma payı ≤ 1,2 × genel;
  - süre ≤ a10 × 1,05.
- `--anm '{"a11":{"acik":0}}'` ile a10 satırları birebir.

### A11d — Tökezleme adımları, aile kolları ve irkilme

**Dosyalar:** `js/animasyon.js`, `js/stil-99.js`, `araclar/poz-galerisi.html`

Yakalama noktası C = 0,95·sy·(b + κ·ḃ/ω0):
- κ 0,5, ω0 3,2;
- |C| ≤ 0,5·boy;
- C, ω 20'lik yayla izlenir.

wTok = yumuşak basamak((|C| − 0,08)/0,08).

anmYuruyus içinde bacak başına ofset:
- Salınımda cx·S(g), cz·S(g); g ≥ 0,7'de donar.
- İniş karesinde çapa (x + cx, z + cz): ayak dünyaya çivilenir, kayma olmaz, sürükleme sınırı 0,6 m.
- Planlı basışta emme penceresi 0,12 sn: ω × 1,6, ζ 1. Ani ölçekleme yasaktır.
- Çapraz adım önden geçer (z + 0,08).
- Kadans tabanı wTok·(3,4 + 1,2·s).

anmTavir'in yeni sendele satırı: drop, gen, adım, kal, hizli.

Tutulan bacak takılmada seçilir; öncelik sırası:
1. darbe.bacak;
2. sin(darbe.ra)'nın yanı;
3. salınımdaki bacak.

Tutulan bacakta kal × 0,5, ofset −0,2 m (kısa ve alçak); öbür bacak uzun ve hızlı yakalama adımı atar.

Bastırma: vk.kw, çalım evresi, zipla, koru (× 0,5), kilit, dokunuş ayağı (topu sürerken C × 0,5).

Aile kolları: takılmada kollar öne (+0,4); omuzda uzak kol yukarı.

İrkilme: top gövde ya da baş hizasında ve ≥ 14 m/sn; zarf 0,4 sn.

Poz galerisi `a11tokez` sayfası: yandan, önden, arkadan, takılma × şiddet; top göğse ve başa; t 0…0,8 sn. Claude'un kendi incelemesidir.

**Denetim:** - `node araclar/mac-deneme.js 4`.
- `python araclar/kontrol.py araclar/poz-galerisi.html?sayfa=a11tokez`: konsol hatası 0.
- animasyon-olcum `--temas 96` ve tohum 3:
  - A: tökezleme kabul hedefleri;
  - genel ayak kayması ve kadans bantları a10'dan bozulmaz;
  - vuruş, çalım, alış ve top saklama satırları değişmez.
- κ ve adım eşiği için en çok iki tarama değeri.

### A11e — Düşüş programı I: kalçadan kök, aile seçimi, görsel yön, aile pozları

**Dosyalar:** `js/animasyon.js`, `js/stil-99.js`

`anmDususAile` ve `anmDususPlan` (düşüşün başında bir kez):
- Aile: plandaki tip → aile tablosu.
- Görsel yön d: plandaki formüller.
- Yatış türü d'den; yan alt türü yuzustu ipucundan, yoksa h2'den.
- h ile kırılma ölçeği: θ_k ve ω0 × (0,8 + 0,4h).
- A11c aile tablosunun anahtarları: tc, kırılma, temas, son, O, λ.
- Sığma kuralı: tc + 0,35 ≤ düşüş süresi + e.yerde; gerekirse adım azalır, tc en az 0,34.
- Çeşitlilik h2(no + 31·takım, darbe.kare || mac.kare): tc ±0,04, θc ±0,1, ψL ±0,3, önce değen el, yatış pozunun türü.

`anmDususDurum` (anmPozBasla'da anmEylemler'den önce):
- τ: düşüşte e.t; yerdeyken düşüş süresi + e.t.
- C¹ Hermite anahtarları ve kritik sönümlü çarpma sönümü (θ, ψ, h, O); yerde aniden 0 yok.
- Başlangıç: h(0) ve O(0) önceki karede çizilen kalçadan; θ0 ve θ̇0 a11.dgy'nin bF/bR/vbF/vbR'sinin d'ye izdüşümünden.
- Yuva karışımı a11.ds tamponunda: üç anahtar poz.

`anmKok`: a11.ds etkinken kök kalçadan iner.
- Q = yaw ⊗ eğim(θ) ⊗ yuvarlanma(ψ).
- R.position = Ph − Q·(0, (0,95 + dy)·sy, 0) + yEk.
- a.lth, lps, lkx, lkz, lieTur, lieSag güncel tutulur: kalkDik, ölçüm, yardım IK'sı ve anmSakatPoz okur.

Yeni Tm pozlar (sağ yan; sol yan aynala ile): tkTepki, tkKorun, kyTepki, kyHava, itTepki, itOtur, yaTepki, yaIn, ckTepki, ckDus, hvTepki, hvInis, cmDiz.

Ayrımlar:
- Eski yolda kalanlar: plonjon, yatan, kaleci (e.kaleci/ucus), kaymanın kendi kalkışı, kapan, sedyedeki sakat (0,3 sn harman).
- ANM_DUSUS yedeği kaynak ve yapanı da saklar (darbe 0).
- A11 yolunda rnd yok.

**Denetim:** - `node araclar/mac-deneme.js 4`.
- `node araclar/ad-denetimi.js`: anmDusus*, anmA11Yeni.
- `python araclar/kontrol.py`.
- animasyon-olcum `--dusus 64` ve tohum 3/7:
  - ilk 300 ms kırılma ≥ %90;
  - |Δω| ≤ 1,5 rad/sn·kare;
  - Δφ ≤ 0,12;
  - kök sürekliliği;
  - yön tutarlılığı ≥ %95;
  - her aile ≥ 6 (yapay).
- `--olay 80`, `--duran 24`, `--kaleci 96` satırları a10'dan bozulmaz.
- `--anm` ile acik 0'da birebir.

### A11f — Düşüş programı II: eller önce, yakalanan bacak ve tökezleme, zemin kilidi, ikincil yaylar

**Dosyalar:** `js/animasyon.js`, `js/stil-99.js`, `araclar/poz-galerisi.html`

`anmDususKol` (aktorGuncelle'de anmKok'tan sonra, düşen her oyuncu için; kalecinin anmKolIK'sı ayrı kalır):
- anmKolCoz ile hedef omuz izdüşümü + d·0,25 ± 0,18.
- Ağırlık tc − 0,12'den tc'ye 0 → 1.
- tc'den sonra 0,25 sn dünyada çivili; motor 1,5 m/sn'den hızlı kayıyorsa el de kayar.
- 0,15 sn'de bırakılır; çözüm önceki çözüme yakın seçilir.

Yakalanan bacak:
- 0,12 sn çivi.
- Tökezleme adımları: n, A11c kuralıyla h kaydırmalı; 0,17 + 0,02i sn; basış motorun öngörülen yerinin önünde 0,35 + 0,05v m; her adımda kalça −0,05 m, θ +0,12.
- Bacak IK hedefleri kök çerçevesindedir (anmDususDurum'da, anmBacakIK'dan önce).
- Ağırlık rampası 0,08–0,1 sn; diz açı hızı tavanı 15 rad/sn.

Zemin kilidi:
- 13 nokta: baş, omuzlar, dirsekler, eller, dizler, tabanlar, kalça.
- Sıra: kök → kilit → kol IK.
- Kaldırma anında olur; iniş ≤ 1,5 m/sn.

İkincil yaylar:
- kollar ω 28, baş ω 22, gx/gz; ζ 0,65;
- temas itkisi: hx +2,5, dirsek −3 rad/sn.

LOD: a.kucuk aktörde IK, yay ve kilit atlanır.

Poz galerisi `a11dusus`: aileler × hız, kalkışlar ve loca uzaklığı satırı (~30 piksel). Claude'un kendi incelemesidir.

**Denetim:** - `node araclar/mac-deneme.js 4`.
- `python araclar/kontrol.py araclar/poz-galerisi.html?sayfa=a11dusus`, ayrıca dusus, t5temas, t10olay, t14plonjon, a5model: konsol hatası 0.
- animasyon-olcum `--dusus 64`:
  - takılma, hava ve yanda önce el ≥ %80;
  - el → kalça/diz 0,05–0,25 sn;
  - gömülme;
  - düşen aktör p99 ≤ 80 µs.
- Tohum 3: genel satırlar a10'dan bozulmaz.

### A11g — Yerde ve kalkış

**Dosyalar:** `js/animasyon.js`, `js/stil-99.js`, `YOL_HARITASI.md (devam notu)`

Yerde canlılığı:
- Yerleşmeden sonra nefes ve küçük ψ salınımı; baş hakeme ya da topa kalkar.
- Sert faulde (siddet ≥ 0,75, h2 < a11.tut 0,35) vurulan bacak 0,6–1,0 sn tutulur: sakatDiz pozu, 0,7 ağırlık, darbe.bacak tarafı.
- Gerçek sakatlıkta anmSakatPoz baskındır.

`anmKalkisPlan` ve `anmKalkisDurum`:
- Kalkış başında anlık durum saklanır: P, Q0, h0, O0.
- Altı hücre: yüz/sırt/yan × 1,1/1,6 sn (A11c aşamaları + yan 1,6: kalkYan → diz, duraksamalı → ayağa).
- f = e.t/e.sure motordan; Q slerp; h ve O Hermite.
- f = 1'de standart kök: θ = ψ = O = 0, h = (0,95 + dy)·sy.

Kesintiler: faz sonu, değişiklik ve null eylemde 0,3 sn harmanla ayağa dönülür. Sedyeye 0,3 sn harmanla eski köke geçilir. Yardım IK'sı (A4-3) değişmez.

Sakatlık akışının kalkışı darbesizdir; a11.ds etkinse yine programla kalkar.

Adımın sonunda oturum sonu `--ayni` koşulur; yerel commit "A11c–g: temas ve düşüş çizimi" atılır, dal push edilir, devam notu güncellenir.

**Denetim:** - `node araclar/mac-deneme.js 4`.
- `python araclar/kontrol.py`.
- animasyon-olcum:
  - kalkış süresi motorla N/N;
  - son karede dik (lth ≤ 0,05) N/N;
  - kalça ofseti ≤ 0,02 m;
  - kalkışta 0,05 m'den büyük geri iniş yok.
- `--olay 80` (A: olay: sakat tutma ≥ %90, sedyede kök, yardım) ve `--duran 24` (yatan barajcı) bozulmaz.
- `--senaryo o-sakatlik` ve `d-duran`: motor aynı.
- `oturum-sonu.js <taban> --ayni` (dizüstünde `--mac 24`) okunur, sonra commit ve push.

### A11h — Kalibrasyon, kendi incelemesi ve tur kapanışı

**Dosyalar:** `js/stil-99.js (kalibrasyon)`, `araclar/taban/a11-anm.json`, `TEKNIK_PLAN.md`, `MAC_MOTORU_GERCEKCILIK_PLANI.md`, `kutuphane/J-beden-dili.md`, `FUTBOL_KUTUPHANESI.md`, `YOL_HARITASI.md`, `CLAUDE.md (Kontrol bölümü: A11 kapı ve taban satırları)`

Kalibrasyon:
- `--temas 96`, `--dusus 64` ve maç (tohum 3 ve 7) ile yapılır; ayar başına en çok iki tarama değeri.
- Sırayla: κ ve adım eşiği; hassasiyet katsayıları; aile tc ve θ; yay ω.

Kendi incelemesi (kullanıcıya sunulmaz):
- an-yakala `--onek once`/`sonra` (seçiciler A11b'de);
- `titreme-olc.py --karsilastir` ≤ 1,1 × önce;
- poz galerileri `a11tokez`, `a11dusus`.

Tur kapanışı listesi (CLAUDE.md; kabul alanı). Yeni animasyon tabanı `araclar/taban/a11-anm.json`. Motor tabanı değişmez.

Belgeler: belgeNotu'ndaki liste.

Git:
- Kapılar geçerse:
  - "A11 main'e alındı" commit'i;
  - `main` ileri sarılır;
  - `tur/a11` açıklamalı etiketi;
  - push (`main`, etiket);
  - birleşen dal silinir;
  - hız ölçümünün çalışma ağacı silinir.
- M2: kapanışta yalnız `a10` önce kopyası kalır; sıradaki çizim turu `dondur.js a11` ile başlar.
- Bir kapı geçmezse:
  - bir düzeltme denemesi yapılır;
  - yine geçmezse `main`'e alınmaz;
  - dal ve devam notu push edilir, eksik kapı yazılır.
- Oto mod burada biter. Devam notu: "sıradaki Z6-2; kullanıcı 'devam' deyince planlanır".

**Denetim:** Kabul alanındaki tur kapanışı:
- 80 maç `--karsilastir --ayni` ve sağlık aralığı;
- `oturum-sonu.js --seyrek`;
- duyarlılık karnesi;
- ikiz-deneme;
- hız bütçesi (`--kok tur/a10` ağacı);
- animasyon ölçümünün bütün satırları ve yapay kipleri;
- kontrol.py ve poz galerileri;
- akis-deneme.py (animasyon.js ekran listesinde; bu dizüstünde bilinen §11/12/14/14b/15/15b/16 düşmeleri gerileme sayılmaz);
- an-yakala önce/sonra.

Sonra belgeler, commit, `main`, etiket ve push.

## Sözleşme (motor → çizim)

*A11 (2026-10-20; `MOTOR_AYAR.darbe` 1 iken)* — Motor yalnız alan ve olay ekler. Alanlar rastlantısız hesaplanır; motor bunları okumaz; oyuncu nesnesine alan eklenmez. `darbe` 0 iken alanlar null olur ve 'darbe' olayı yayılmaz; çizim yedek yoldan gider (bugünkü sendele, `neden` ve `ANM_DUSUS`'tan aile, D7 tepkisi yok). İki değerde de parmak izi aynıdır.

- *Eylem:*
  - `sendele {yon, siddet, darbe}`
  - `dusus {sure (0,45; temassız sakatlıkta 0,6), fren, yerde, yon (itme normali; motorun kalkış sınıfı buradan), neden, siddet, yuzustu (ipucu), darbe}`
  - `yerde {sure, yon, neden, siddet, yuzustu, darbe}`
  - `kalkis {sure, yon, neden, siddet, yuzustu, yardim, darbe}`

  `darbe` aynı nesnedir: düşüş → yerde → kalkış boyunca taşınır, kopyalanmaz. Şu durumlarda null'dır:
  - temassız sakatlık (`neden 'sakatlik'`; çizimde 'sakat' ailesi);
  - plonjon;
  - yatan barajcı (`neden 'yatan'`);
  - kalecinin kalkışı (`kaleci`);
  - kaymanın kendi kalkışı (`neden 'kayma'`, öncesinde düşüş yok);
  - sakatlık akışının kalkışı.

- *`darbe` nesnesi* (temas anının kopyası; alan sırası sabit):
  - `tip`: J.6 ailesi, 'takilma' | 'kayarak' | 'itilme' | 'cekilme' | 'havaInis' | 'aldatma'. Kademe eylemin adındadır (sendele = 1, dusus = 2); 'kayarak' 3. kademedir.
  - `tur`:
    - faulde faul olayının `kaynak`ı: mudahale, kayma, carpma, omuz, tutma, taktik, basma, hava, kaleci, itme;
    - faulsüzde: carpisma, omuz, hava, kayma, mudahale, bacak, gecilme, ikili, tutma, aldatma.
  - `faul`: temas faul sayıldı mı (çalınan, avantaj ya da görülmeyen).
  - `c`: doymamış faul ciddiyeti; faulsüzde null.
  - `kayip`: dengeBoz yolundaki denge kaybı; faul düşüşünde null.
  - `guc`: `mdhDengeGuc`, dayanıklılık.
  - `bacak`: 'sag' | 'sol' | 'iki' | null. `mdhBacakTakilma`'da uzanan bacak segmentinin düşene en yakın noktasının gövdeye göre yanı; kaymada 'iki'.
  - `x`, `z`, `vx`, `vz`, `yon0`: düşenin temas anındaki yeri, hızı ve gövde yönü. Hız, düşüş itkisi eklenmeden önceki hızdır.
  - `sahip`: top ondaydı.
  - `havada`: `p.yuk`, m.
  - `ucus`: kalan uçuş süresi, sn; yerdeyse 0.
  - `ra`: rakibin gövdeye göre açısı (rad): 0 önden, +π/2 sağdan (motorun (−sin, cos) sağ kuralı), ±π arkadan; rakipsiz null.
  - `rx`, `rz`, `rvx`, `rvz`, `ryon`: rakibin temas anındaki kopyası. Kayan müdahalede süpürme yönü ryon ve rvx, rvz'dir.
  - `yapan`: rakip, canlı başvuru. Çizim temas anı için kopyaları okur.
  - `kalk`: düşüşte motorun kalkış süresi (`mdhKalkisSure`: 0,8 / 1,1 / 1,6); sendelemede null.
  - `kare`: temasın motor karesi. Çizimin tohumu h2(no + 31·takım, kare) buradan gelir; ×4'te temas anı da buradan bulunur.

- *Olaylar:*
  - `dusus {p, neden, siddet, yon, yuzustu, kaynak (düşüren oyuncu), darbe}`.
  - Yeni `darbe {p, o, tur, ux, uz, dv, v, y, kayip, sonuc, darbe}` (sabit şekil):
    - `p`: temas alan beden (oyuncu ya da hakem).
    - `o`: öbür beden ya da null.
    - `ux`, `uz`: itme yönünün birim vektörü; topta gelişin yönü.
    - `dv`: gerçek hız değişimi (m/sn) — çarpışmada, omuz kaybedeninde ve tutulanda; başka yerde null.
    - `v`: topun gelen bağıl hızı (m/sn); yalnız tur 'top'.
    - `y`: topun temas yüksekliği, p.yuk üstünde m; yalnız tur 'top'.
    - `kayip`: denge kaybı ya da null.
    - `sonuc`: 'yok' | 'sendele' | 'dusus'.
    - `darbe`: sendele ve düşüşte eylemin nesnesi, değilse null.

    Üç kaynağı vardır:
    - (a) `dengeBoz`'un her etkili çağrısı;
    - (b) gövde çarpışmasında `dengeBoz`'a gitmeyen ya da orada etkisiz kalan bedenin dv ≥ `darbeEsik` (0,25 m/sn) olması: oyuncu ve hakem, bütün fazlar; tur 'carpisma', sonuc 'yok';
    - (c) topun bedene çarpması: sekme, blok, govdeCarpmasi (hakem ve yatan barajcı dahil), ortaBlokUygula; yansımadan önce; tur 'top'.

    İkiz motor aynı olayları aynı karede yayar.
  - Var olan `sekme`, `block`, `hakemeCarpti` olaylarına alan eklenmez; `block.v` bugünkü anlamını korur.

- *Okunmaya devam edenler:*
  - `omuz {taraf, rakip, kazandi}` eylemi (omuz pozu yayın altında kalır);
  - `faul`, `avantaj`, `faulGorulmedi` olaylarının `faulYapan`, `faulYiyen`, `kaynak` alanları (darbe yoksa `ANM_DUSUS` yedeği: yön, kaynak, yapan);
  - oyuncuda `x`, `z`, `vx`, `vz`, `spd`, `yon`, `yuk`, `zipla`, `sakat` (yerde tutma pozu), `profil` (yay kimliği), `boy`;
  - maçta `sedye` (sedyedeki sakat eski kök yolunda), `kare`, `phase`.
  - `govdeTemasi` yalnız teşhis içindir; çizim okumaz.

- *Çizim tarafı (E akışı satırına):*
  - aktörde tek alan `a11` ({`dgy`: denge, darbe ve kol yayları ile yakalama adımı; `ds`: düşüş ve kalkış programı, anlık görüntü, çivili el ve ayak noktaları});
  - `ANM_DARBE` (p → birikim; 0,2 sn'den eski atılır);
  - `STIL.animasyon.a11` (acik 0 → a10 çizimi birebir);
  - dışa açık `anmDengeDarbe(a, ux, uz, dB, dL, h, dY)`;
  - yeni işlevler: `anmA11Yeni`, `anmDengeAdim`, `anmDengeUygula`, `anmDususAile`, `anmDususPlan`, `anmDususDurum`, `anmDususKol`, `anmKalkisPlan`, `anmKalkisDurum`.

- *Anahtarlar:*
  - `MOTOR_AYAR.darbe` (1) ve `darbeEsik` (0,25): bildirim js/mac-motoru.js C satırında, değer js/mac-mudahale.js `ayarEkle('C')` içinde.
  - Motorun eşikleri (denge 0,3 / 0; faulde ayakta kalma kapısı c < 0,35) ve süreleri (düşüş 0,45, fren 6, yerde, mdhKalkisSure, sendele) değişmez.

## Kabul

MOTOR (A11a'da ve tur kapanışında; motorun sonucu değişmez)
- 40 maç `--karsilastir <turun tabanı> --ayni`: 40/40, iki ayarda da (varsayılan `darbe` 1 ve `MAC_DENEME_AYAR='{"darbe":0}'`). Tekrarlanabilirlik "sonuç aynı".
- Tur kapanışında 80 maç `--karsilastir --ayni` 80/80; sağlık aralığı dışında 0 satır; Z ölçüleri ve robotluk karnesi tabanla aynı.
- `ikiz-deneme.js`: "Aynılık N/N" ('darbe' olayı aynı ad ve karede).
- `ad-denetimi.js`: bulgusuz.
- c-temas [1]–[3] sayıları birebir. c-temas [4]:
  - kapsam: [1] ve [3]'teki her sendele ve düşüş eyleminde darbe var, N/N;
  - tür: faul düşüşünde darbe.tur aynı adımdaki faul, faulGorulmedi ya da avantaj olayının kaynağına eşit, N/N;
  - aile: [3]'te kayma türü → 'kayarak' N/N; [1]'de 'kayarak' 0;
  - bilgi satırları: yön payı ≥ %85 ve kalk ↔ gerçek kalkış N/N.
- Değişmeden geçenler: c-yariyariya, c-donen, c-1v1, c-koru, c-hava, o-sakatlik, d-duran, d-sut, v-sut; `oturum-sonu.js --seyrek` (`--ayni`); duyarlılık karnesi (`oyuncu-karnesi.js 80 1 --duyarlilik`) tabanla aynı.
- Hız: aynı süreçte `hiz-olcum.js 2 --tekrar 8 --kok <tur/a10 ağacı>` ve `--ayarlar '{"kapali":{"darbe":0}}'`. Eşleştirilmiş oranın ortancası ≤ %10 (beklenen ~%0); 250 ms mutlak tavan. Sonuç devam notuna yazılır.
- c-beden bilgi satırları dolu: maç başına düşüş aileleri, sendele aileleri, darbe tür × sonuç, şiddet ve hız dilimleri. Bant yoktur, yalnız dağılımdır.

ÇİZİM — animasyon-olcum.py; maç tohum 3 ve 7 (180 sn) ile `--dusus 64` ve `--temas 96`; önce tarafı `--once a10`

"A: düşüş":
- İlk 300 ms'de kırılma: gövde açısında Δφ ≥ 0,35 rad ya da kalçada iniş ≥ 0,25 m olan düşüş payı ≥ %90.
- İlk ayak dışı temasın ±0,2 sn çevresinde kare başına açısal fren |Δω| ≤ 1,5 rad/sn·kare (bugün ~5,7). Temastaki ω bilgi satırıdır (3–6 rad/sn).
- Kare başına Δφ ≤ 0,12 rad (p99 ve en büyük). Eylemde > 20° sıçrama a10'dan kötü değil.
- Takılma, hava ve yan ailelerinde önce el ya da ön kol ≥ %80. El → kalça/diz ortancası 0,05–0,25 sn. Takılmada ilk temas 0,35–0,7 sn.
- Kök sürekliliği:
  - kalçanın kare başına sıçraması (motorun yer değiştirmesinden farkı) ≤ 0,05 m;
  - kalça hızı sıçraması ≤ 1,5 m/sn·kare;
  - kalça ile motor arası yatay uzaklık ≤ 0,9 m.
- Gömülme: 13 noktanın en alçağı ≥ −0,02 m (karelerin %99'unda); baş ≥ 0,08 m.
- Yön tutarlılığı: motor ≥ 0,5 m kaydırdıysa, yatan gövdenin baş yönü ile kayma yönü arasında cos ≥ −0,2, düşüşlerin ≥ %95'inde (bugün ~%79).
- Kalkış:
  - süre motorla aynı, N/N;
  - son karede dik (lth ≤ 0,05), N/N;
  - kalça ofseti ≤ 0,02 m;
  - 0,05 m'den büyük geri iniş yok.
- Aile dağılımı: yapayda her aile ≥ 6; maçta (iki tohum) en az 4 aile.
- Düşen aktör başına p99 ≤ 80 µs.
- "Son yatış ↔ darbe.kalk" bilgi satırıdır.

"A: tökezleme":
- Basış/sendele ortalaması 1–3.
- Şiddet ≥ 0,25 olan sendelelerin ≥ %90'ında en az bir yakalama basışı. Yakalama basışı: taban ortasının kalça merkezine göre itilme yönündeki farkı ≥ 0,08 m.
- Yakalama basışı / bütün basış ≥ %80.
- İlk yakalama basışının ortancası ≤ 0,35 sn.
- Pencerede ayak kayması ≤ %5 (G9 tanımı).
- Yatış: 0,1–0,3 sn'de itilme yönüyle cos ≥ 0,7 olan pay ≥ %90. Toparlanma (< 2°) 0,4–1,0 sn. Tepe açıları ve kol açılması (≥ 30° beklenir) bilgi satırıdır.

"A: darbe" (D7):
- Kapsam: dv ≥ 0,5 olan darbe olayları ve gövde/baş hizasında ≥ 12 m/sn top.
- Görünür tepki (olaydan sonraki 0,3 sn'de omuz merkezinin kalçaya göre yer değiştirmesi ≥ 0,03 m) ≥ %90.
- Tepki süresi ortancası 0,15–0,5 sn. Tepe cm ve locada piksel bilgi satırıdır.
- Koşu sürer: darbe pencerelerinde eylemsiz ayak kayması genel banttan en çok +2 puan, kadans ±0,2 adım/sn.
- Tökezleme ve darbe pencerelerinde üst gövde kırılması (> 0,06 rad) payı genelin en çok 1,2 katı; > 10° sıçrama ~0.
- Darbe saniyesi / oyuncu·dk bilgi satırıdır (titreşen kalabalık denetimi).

Genel:
- `--karsilastir araclar/taban/a10-anm.json` ile ayak kayması, adım, kadans, uçuş, sıçrama, kırılma, baş, eğri, vuruş stili, zamanlama, çalım, temas ve hava satırları bozulmaz.
- `--olay 80` (A: olay: sakat tutma pozu ve sedyede kök ≥ %90, sağlıkçı ≥ %80, hakem topu N/N), `--duran 24` (yatan barajcı dahil), `--kaleci 96`, `--blok N` satırları a10 tabanından bozulmaz.
- Süre: aktorGuncelle ms/kare ≤ a10 × 1,05 ve ≤ 2 ms/kare.
- `STIL.animasyon.a11.acik` 0 (`--anm '{"a11":{"acik":0}}'`) iken satırlar a10 ile birebir.
- A11 yolunda rnd yok: iki koşu aynı A: satırlarını verir.

GÖRSEL VE ARAÇ (Claude'un kendi doğrulaması; kullanıcıya sahne, şerit ya da galeri sunulmaz — 2026-10-09 kararı)
- `python araclar/kontrol.py` (görüntü incelenir).
- Poz galerisi `a11tokez` ve `a11dusus` ile dusus, t5temas, t10olay, t14plonjon, a5model sayfaları: konsol hatası 0.
- `an-yakala.py --onek` önce/sonra (dusus-kayarak, dusus-cekilme, dusus-hava, kalkis-sirt, omuz, takilma, carpisma, gogse-top); `titreme-olc.py --karsilastir` ≤ 1,1 × önce.
- `python araclar/akis-deneme.py` (bu dizüstünde bilinen §11/12/14/14b/15/15b/16 düşmeleri gerileme sayılmaz).
- Yeni animasyon tabanı `araclar/taban/a11-anm.json` yazılır.

KAPANIŞ
Yukarıdakiler geçmeden tur tamamlanmış sayılmaz ve `main`'e alınmaz. Geçmeyen kapı devam notuna ve kullanıcıya yazılır; dal push edilir. Geçince "A11 main'e alındı" commit'i, `main` ileri sarma, `tur/a11` etiketi ve push gelir (kullanıcının 2026-10-20 izni).

## Belge notu

Belgelere yazılacaklar (A11h; tarihli, görünür; Claude kararları gerekçesiyle):

1. **TEKNIK_PLAN §8 "Motor → çizim sözleşmesi"**
   - Sözleşme metni ("A11" paragrafı): sendele, dusus, yerde ve kalkis'e darbe; darbe nesnesinin alanları; 'dusus' olayına darbe; yeni 'darbe' olayı ve üç kaynağı.
   - E akışı satırına `a11` (dgy, ds), `ANM_DARBE`, `STIL.animasyon.a11` ve yeni anm* işlevleri.
   - C akışına `MOTOR_AYAR.darbe` ve `darbeEsik`.

2. **MAC_MOTORU_GERCEKCILIK_PLANI**
   - Ek G4:
     - "aktif ragdoll" maddesinin kapanışı: uygulanan B — anahtar pozlu düşüş programı, kalçadan kök, el ve bacak IK'sı, zemin kilidi, eklem uzayında ikincil yaylar. Gerekçe: okunurluk, determinizm, güvenlik, hız.
     - Verlet (A) seçeneğinin nokta → kemik eşleme notu yedek olarak yazılır.
     - Aileler ve uygulanan ölçü sonuçları ("A11 — Sonuç").
   - G0.10 "atlanan: aktif ragdoll" doğrulanır; G4 ile çelişki kapandı.
   - G0.9: kalkış zamanlaması ve motor kalkış süresi borcu.
   - G9 tablosuna "Düşüş", "Tökezleme" ve "Darbe" satırları (tanım, hedef, önce → A11).

3. **kutuphane/J-beden-dili.md**
   - J.7 D5 uygulanan biçim. GRF skalası motorun birikimli dengesine karşılık tablo olarak eşlenir: sendele 0,3 ↔ 0,48, düşüş 0 ↔ 0,58, kayarak tip. Yönlü hassasiyet çizimde h.
   - J.7 D7 uygulandı.
   - J.8 düşüş satırı "A11'de kapandı".
   - J.9 madde 6: uygulanan sözleşme (tip/tur/bacak/kalk …).

4. **FUTBOL_KUTUPHANESI §12.13**
   - A11 planı (A11-0'da) ve tur sonucu.
   - Teşhis tablosu satır 9 "kapandı".
   - Program metnindeki "10–12 noktalı verlet ragdoll" ifadesinden sapma açıkça yazılır: karar, gerekçe, kullanıcı izleyip sert bulursa yerleşme için A ayrı karar olarak açılır.

5. **YOL_HARITASI**
   - Karar özeti (2026-10-20, A11): tek anahtar `darbe`; tek 'darbe' olayı; zorunlu yuvarlanma yok, altı hücreli kalkış; taktik faulde v.itme ayrımı; ragdoll yerine program.
   - Devam notu her commit'te güncellenir. İçerik:
     - turun motor tabanı (değişmedi);
     - animasyon tabanı `a11-anm.json`;
     - önce kopyası `a10` (M2);
     - hız sonucu;
     - "oto mod bitti; sıradaki Z6-2 kullanıcı 'devam' deyince planlanır".

6. **CLAUDE.md (proje kuralının tek kaynağı olan Kontrol bölümü; yalnız satır eklemeleri)**
   - Senaryo kapılarına: "darbe sözleşmesi (`mdhDarbe`, `MDH_DARBE_TIP`, dengeBoz, dus, faulDusur ve çağıranların tür/ek argümanları, 'darbe' olayı; `darbe`, `darbeEsik`) → `c-temas` [4], 40 maç `--ayni` darbe 0/1, `ikiz-deneme.js`".
   - Animasyon satırına:
     - A11 tabanı `a11-anm.json`;
     - yapay kipler `--dusus N` ve `--temas N`;
     - satırlar "A: düşüş / tökezleme / darbe";
     - galeri `a11tokez`, `a11dusus`;
     - "sıradaki çizim turu `dondur.js a11` ile başlar".

7. **Borçlar** (gerçekçilik planı ve devam notu; sonucu değiştirir, ileride):
   - motorun kalkış süreleri J.6'dan kısa;
   - kayma faulünde motorun kökü 2,3–2,9 m kayıyor (fren 6);
   - yönlü motor kararı: arkadan temasta daha kolay düşme;
   - kafa eylemi sendelemeyi engelliyor (1,4/maç).

8. **ARSIV:** gerekmez. Tarihli tam metinler ana belgelerde kalır.

9. **Kullanıcıya tur özetinde açıkça söylenecekler:**
   - ragdoll yerine anahtar pozlu programın seçildiği ve gerekçesi;
   - motor sonucunun değişmediği (`--ayni`);
   - kullanıcının maçı kendisi izleyip yerleşmeyi değerlendirmesi;
   - Pages yayınının ancak `main` push'undan sonra ve doğrulanınca güncel sayılacağı.
