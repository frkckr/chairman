<!-- Durum (2026-10-22, dizüstü): B KAPANDI (`tur/b`). B0–B4b ve B1b (tarzın sabrı), B1d (kutu kapısı anlık yer) uygulandı; B2 plan bitleri kapı tutmadı (plan 20 kaldı, Z4-2); B5 tarz kenarı +0,34 [0,07–0,62], ayar yapılmadı. Sonuç FUTBOL_KUTUPHANESI §12.4, kararlar MAC_MOTORU §3. -->
# Plan: B — 2D izlenebilirlik (amaçsız geri pas, kapalı ilkeller, hücum iştahı, maç başına tarz)

## Bağlam

Maç 2D'ye geçti (P2) ve kullanıcı 2026-10-22'de yönü yeniden çizdi: istatistik değil izlenebilir akış; amaçsız pas yerine amaçlı hücum; hocaya göre görünür tarz; atak zihniyeti. A temizlik turu kapandı (`tur/a-temizlik`, taban `araclar/taban/p2.json`, `main` 214b7d5). Keşif (üç salt okuma ajanı + tasarım ajanı + kod okuması, 2026-10-22):

- **Geri pas bonusu baskın.** `pasDegeri` (js/mac-karar.js:425) 4 m'den geriye her pasa `sakin·1,8 + baskı·0,8` ekliyor; konumsal takımda 1,1–1,7 puan. Orta sahadaki alan değeri farkları 0,1–0,3, karar gürültüsü σ≈0,3. Örnek: konumsal takım, orta saha, baskısız — 12 m geri pas U≈1,6, 12 m boş ileri pas U≈0,8. Alıcının bakışı ayağa pasta pasöre dönük sayıldığı için (:497) geri pasın alıcısı oyuna dönük sayılıyor (ikinci asimetri; bu turda dokunulmaz). Hiçbir seçenek "rakibi çekip arkasına oynama"yı değerlendirmiyor.
- **Üç ilkel kapalı** (`plan` 20 = derin koşu + istek). Kabul %16'nın nedenleri: reddedilen (K,B) çifti 0,2 sn'de bir yeniden teklif ediliyor; pasın asgari hazırlığı 0,38 sn iken teklif penceresi 0,6 sn ve `planDenetle` (js/mac-plan.js:109) teklifi K vuruş hazırlığındayken de kapatıyor; pay küçük. **Tuzak:** `plan&1` açılınca Z4'ün ver-kaçı kesiliyor (js/mac-topla.js:585; p2'de 1,70/maç) ve `planPas` K'ya `vk` yazmadığı için takip 0,26 sn kilitli kalıyor. Üçüncü adamda C'ye teklif anında hedef verilmiyor (js/mac-ilkeller.js:63-87). Geri çevirmede K'yı çizgiye indiren pay yok, tetik geometrisi ölçüyle uyumsuz.
- **Tarz yalnız direkt ve presi kaydırıyor** (js/mac-takim.js:263); sakin, risk, tempo tarzdan gelmiyor; `dengeli` vektörsüz; tarz yalnız `kadro.taktik.tarz`'dan okunuyor; her maç ev direkt ↔ konuk konumsal.
- Ölçü: pas olayında ilerleme ve baskı yok ama eklenti `m.ball.pas`, `m.sahiplikNo` ve `m.teams`'ten hesaplayabilir; `r-ivme.js` bütünüyle `MAC_DENEME_IVME` kapılı ve "eşzamanlı" satırı oyuncu·dk'ya bölüyor (B0 kendi satırını kurar).

**Kullanıcı kararları (2026-10-22, tur başı):** tarz kenarı hedefi **orta (+0,2–0,3 gol/maç)**; korner başına gol borcu **Z6-2'de**; görev çalkantısı için **B'de yalnız ölçü**.

**Oyun ilkesi (kullanıcı, 2026-10-22, tur başı konuşması):** başkan maça dokunmaz, maçı okur ve yönetim hamlesi çıkarır (hoca uyumu, kadro eksiği, şans ya da beceri, sabır ya da büyüme). Maç başkanın bilgi kaynağıdır: tarz ve uyum, oyuncu kalitesi, şans ile beceri farkı sahada ayırt edilmeli. Futbolun belirsizliği korunur: her plan tutmayabilir, şans yalnız girdide, kalite ortalamayı kaydırır ama garanti vermez. B bunun ilk basamağıdır (tarz okunur, oyun amaçlı); oyuncu farkı C, hocanın maç içi kararları ve ekip F/Z7-2, "maçın okunması" (başkanın gözlem notu, ekibin yorumu, Canlı Skor istatistikleri) başkanlık planında.

**Varsayımlar:** B'nin "amaçlı geri pas" mekanizması "önü kapalıyken geri, önü açılınca ileri"dir; rakip hattının arkasını gören uzun top (konumsal takım için `devamDegeri`/`ileriPasOnPuani` çizgi arkası) bu turda yapılmaz, B0 "amaçlı geri pas %" satırı izler, iş Z4-2/D'de. Tarz adlarının oyun ekranında gösterilmesi ekran işidir (F); bu turda yalnız geliştirici panelinde TEST satırı.

## Dal, taban, kurallar

- Dal `claude/motor-b` (`main` 214b7d5'ten); `claude/temizlik-a` dalı yerelde silinir. Tur planı `araclar/plan/b-uygulama.md`'ye kopyalanır (durum satırıyla); belge değil, çalışma kopyası.
- Taban `araclar/taban/p2.json`. Her yeni davranış anahtarla kapılı; bütün yeni anahtarlar eski değerdeyken (`MAC_DENEME_AYAR='{"geriPasAmac":0,"plan":20,"tarzIstah":0,"tarzSecim":0}'`) `node araclar/mac-deneme.js 24 --karsilastir araclar/taban/p2.json --ayni` 24/24 (motor bütünlüğü, her commit'te). Ara karşılaştırmalar yerel `araclar/taban/b-ara.json` ile (depoya alınmaz). Rastlantı yalnız `this.rast`; oyuncu nesnesine alan eklenmez (plan bilgisi `_pln`/`bVeri`, pas sayacı `m._geriN`, etkin taktik alanları `m.taktik[t]`).
- Kademeler CLAUDE.md "Kontrol": hızlı 4 maç + KAPILAR satırı; oturum sonu 24 maç + çekirdek 10; kapanış 40 maç + bütün senaryolar + hız + yeni taban `b.json`. 80 maç yalnız denge sorusunda (tarz kenarı). Soru başına en çok iki tarama değeri.
- Bilinen borç (kapanışı durdurmaz): `d-duran` korner başına gol %5,3 (Z6-2).
- Kullanıcı tur sonunda 2D'de izler; "iki tarz ayırt ediliyor" ve "boş pas azaldı" hükmü onundur. Kabul sahnesi üretilmez. Büyüklük 1–2 oturum (dizüstü); tur kapanınca durulur.

## Alt adımlar (sıra: B0 → B1 → B2a/b/c/d → B3 → B4 → B5 → kapanış; her biri ayrı commit)

Gerekçe: önce ölçü; B1 B2'den önce çünkü teklif kabulünü taşıyanın güvenli geri pas eğilimi bastırıyor; B3 B2'den sonra çünkü iştah `N.kosu` ve `sakin` üzerinden teklif kabulüne giriyor; B4 en sona çünkü varsayılan eşleşmeyi değiştirir (öncesi p2 ile ev/konuk düzeyinde karşılaştırılabilir kalsın).

### B0 — Ölçü (sonucu değiştirmez)
- Yeni `araclar/olcumler/b0-zincir.js` (sözleşme `k-kurma.js` gibi; `dinle('pass')`, `adim`, `bitir`, `ozet`): yalnız `pass` olayı, `m.ball.pas`, `m.sahiplikNo`, `m.teams`, `m.tarz` okur; rastlantı ve motor yöntemi yok. Tanımlar: geri/yan pas = `pasSay` yön sınıfı (ileri yalnız 45° dilimi); baskısız = pas anında pasöre en yakın rakip ≥ 4,5 m (geometriden, bağımsızlık için); **amaçsız zincir** = aynı `sahiplikNo`'da aynı takımın ardışık ≥ 3 geri/yan ve baskısız pası, net ilerleme ≤ 0; **amaçlı geri pas** = geri pastan (ilerleme < −4) sonra 3 sn içinde ≥ 25 m ileri pas. Satırlar: `b0Zincir` zincir / takım·maç, `b0ZincirPas` zincirdeki pas %, `b0Amacli` amaçlı geri pas %, `b0Net` sahiplik başına net ilerleme (m), `b0Ileri` takım başına ileri pas %, **`b0Firla`** eşzamanlı fırlama: aynı karede aynı takımdan ≥ 3 oyuncunun > 3 m/sn² ivmelenmesi olan kare / takım·dk (r-karne tanımı; yalnız ölçü). `ozet()` tarz tablosu: tarz · takım·maç · zincir · ileri pas % · gol (B4'ten sonra anlam kazanır; tarz yoksa 'yok').
- `p2.json` aynı motorla yeniden üretilir (önce `--ayni` 40/40, sonra `--json`; parmak izi aynı, B0 satırları eklenir). "Önce" sayıları devam notuna.
- **B1-0 teşhis (kod yok):** `MAC_DENEME_AYAR='{"geriPas":0.9}'` ve `'{"geriPas":0}'` 24 maç. `geriPas` 0'da zincir belirgin düşmüyorsa kaynak bonus değil yapısaldır ve B1'in kapsamı daraltılır (devam notuna yazılır).
- Denetim: 8 tohum p2'ye `--ayni` 8/8; `ad-denetimi`; KAPILAR'a B0 satırı.

### B1 — Geri pas dengesi (sonucu değiştirir)
Anahtarlar (sahibi B, `js/mac-topla.js` `ayarEkle('B')`; bildirim `js/mac-motoru.js`): `geriPasAmac` 1 (0 eski), `geriPasK` 1,0 puan (tarama 0,7 / 1,5).

`pasDegeri` (:425):
```
bonus = sakin·geriPas·(1 − e·(1 − f_kapali·f_zincir)) + o.baski·0,8        e = geriPasAmac
f_kapali = clamp(1 − g/geriPasK, 0, 1),   g = max(0, o.onIleri − xT(u,z)·100)   (pasörün en iyi ileri seçeneğinin bağıl kazancı; onIleri −9 ise g = 0)
f_zincir = max(0, 1 − n/2)                n = aynı sahiplikte takımın ardışık geri (ilerleme < −4) pas sayısı
plan adımıysa (m.planAlici(p) === q)      f_kapali = f_zincir = 1
```
- `o.onIleri`: `pasSecenekleri`'nde (:507) `geriPasAmac>0` iken bir kez `ileriPasOnPuani(m,p,o.ox,o.oz,0)`; `o` nesnesine alan.
- `n`: `m._geriN=[{no,n},{no,n}]`, `pasSay`'de (js/mac-motoru.js:564-569) güncellenir; `sahiplikNo` değişince 0; e=0'da okunmaz (`--ayni`).
- Kaleci alıcı: −0,3 cezası (:429) ve filtre (:512-513) aynen; ayrı muafiyet yok (f_kapali "önü kapalıysa kaleciye dön"ü zaten açık bırakır). Geri metre cezası (×0,3) ve bakış asimetrisi (:497) dokunulmaz.
- Beklenen ölçek: konumsal ilerlet'te bonus 1,12 → ortalama f≈0,5 ile ~0,55 (gürültü σ 0,25–0,32'nin altı). Tahmin: ileri pas %32 → 35–38, pas isabeti 84 → 80–82, zincir en az yarıya.
- Denetim: `geriPasAmac` 0 → p2 `--ayni`; `b-pas`, `c-koru`, `c-kanat`, `c-1v1`; 24 maç B0 önce/sonra; oturum sonu. Kabul (öneri): `b0Zincir` ≤ 0,5 × önce ve ≤ 1,5 / takım·maç; `b0Amacli` artar; sağlık aralığı (ileri pas %25–50, pas isabeti ≥ %65, gerçekleşen ÷ konum xG 0,8–1,35).

### B2a — Duvar pası (bit 1): plan ver-kaça kaynak olur
- js/mac-topla.js:585'teki dışlama kalkar (`verKacBaslat` her zaman; çekiliş sayısı plan 20'de aynı → `--ayni` tutar).
- `planPas` duvar 'basladi' (js/mac-plan.js:90): `this.bVeri(P.K).vk={q:P.B,x:P.nu·d,z:P.nw,son:t+2,5}` (çekilişsiz; planın hedefi ver-kaçın rastgele hedefini ezer); vk yoksa `on('kosu',{verKac:true})`, varsa yaymaz (b-olcum çift saymasın). Böylece `verKacAdim` K'yı sürer, `verKacDeger` B'nin dönüşüne girer, `verKacKalkis` takibi kısaltır, z-kalip bağımsız sayar.
- Teklif hazırlıkta kapanmaz: `planDenetle` (:109) teklif açıkken K'nın vuruş hazırlığı B'ye ise `P.son=max(P.son,t+0,05)`.
- Reddedilen çift hafızası: `_pln.red` (K → {B,t}); `duvarPasi.aday` ve `ucuncuAdam.aday` `t−red.t < planRed` ise B'yi atlar. Anahtar `planRed` 2,5 sn (sahibi js/mac-plan.js; 0 hafıza yok).
- Kabul: `zpKabul` %30–70; teklif / maç ≥ 2 ve başlayan ≥ 1; **`zVkT` ≥ 1,5** plan 21'de (p2 1,70'in altına düşmeden). Denetim: plan 20 → `--ayni`; 40 maç plan 21 (z-kalip, z-plan, b-olcum); `b-pas`, `c-kanat`.

### B2b — Üçüncü adam (bit 2): C teklifte kalkar
- `ucuncuAdam.hedef` (js/mac-ilkeller.js:63-87): i=0'da C'ye ön hareket (`u=min(P.nu−4, çizgi−0,3)`, `w=P.nw`, efor 0,55; tırıs, 4,2 m/sn koşu eşiğinin altında); i=1'de `tKes = t + 0,5·ILK_TEPKI(C,0,5)` ve tam eforda `P.kosuT=t`.
- Ofsayt: hedef çizgi−0,3 ile sınırlı; `planDenetle`'ye derin koşudaki 'hat' kuralı (C çizginin 1,5 m önüne geçerse plan bozulur; B'nin C'ye vuruş hazırlığı hariç). Ölçü: maç başına ofsayt ve `zDpOfs` önce/sonra (bilgi).
- Kabul: z-plan'a yeni satır "plan üçüncü adam: C koşusu B'nin pasından önce %" **≥ %70**; bağımsız `zUaOnce` %19,7 → ≥ %30 (tahmin); `zUaT` ≥ 2,9 korunur; ofsayt sağlık aralığında. Denetim: plan 20 → `--ayni`; 40 maç plan 23.

### B2c — Geri çevirme (bit 8): K çizgiye iner
- Tetik (js/mac-ilkeller.js:120-149): `ku ≥ PL−18` ve `|z−MZ| ≥ 9`, K ileri (`vx·d ≥ 1`) ya da `ku ≥ PL−12`; `planGeriGeo` (js/mac-plan.js:74) z-kalip geometrisiyle hizalanır (hedef kaleye 4–22 m, ortaya ≤ 12 m).
- Çizgiye inme payı: `planEkle` (:165) kip 0'da taşıma ve sürükleme seçeneklerine (hx,hz var) plan açık, `P.K===p`, i=1 iken hedefin çizgiye (PL−6, kanat) yaklaşma oranı × `planDeger·0,5·clamp(P.deger,0,5,4)·0,3` (tahmin; `planTavan` sınırı). `planTut` (:178): geri çevirme i=1, K çizgiye 8 m'den uzak ve baskı ≤ 0,5 iken `planTut·(1−yaş/1,2)` bekleme payı (geç gelen zaman kazansın).
- Kabul: `zGcN` 0,4–1,2 / maç, `zGc2` ≥ %50 (p2 %38,5), `zGcGec` ≥ %40 (40 maçta n≈13: bilgi; kapanışta yalnız bu satırlar için 80 maç). Denetim: plan 20 → `--ayni`; 40 maç plan 31; `c-orta`, `c-kanat`.

### B2d — Sahne kolları ve varsayılan
- `z-s3.js` kolları plan 20 ↔ 23, `z-s10.js` 20 ↔ 28 (bugün 0 ↔ 31; S3'ün kolu ver-kaç yüzünden çarpıktı); kapılar ilk ölçümden sonra KAPI=true (eşik değişirse belgeye). `z-s14` (KAPI) plan 31'de geçmeli.
- `plan` varsayılanı 20 → 31 **yalnız üç kapı geçince**; geçmeyen bit kapalı kalır, borç yazılır.
- `node araclar/ikiz-deneme.js 4 --esit --oncesi 598` plan 31 (yeni durum `_pln` içinde; ortak modül durumu yok).

### B3 — Tarz vektörüne hücum iştahı ve tempo
- `TARZ_ALAN` += `istah`, `tempo`; yükleme anında her vektörlü arketipte bütün alanlar tanımlı değilse hata (NaN tuzağı). Arketipler (tahmin, tur içinde ölçülür): konumsal .60/.40 · ilişkisel .70/.60 · dikey .90/.85 · kanatOrta .65/.55 · direkt .75/.75 · **dengeli** nötr vektör (kisaPay .5, presYuksek .5, blokCizgi 0, bekIceri .2, kaleciArti .4, uzunHedef .5, ikinciTop .5, karsiSn 3, istah .60, tempo .50) · yeni **`yok`** (takim:null, ilkel 1, bağlılık 1): tarzsız kadro ve `--tarz yok` buraya düşer (eski davranış korunur).
- Anahtar `tarzIstah` 1 (sahibi Z, js/mac-tarz.js; 0 eski). `etkinTaktik` (js/mac-takim.js:263 sonrası), V varsa, e = tarzIstah:
```
istah_e = clamp(V.istah + 0,3·D.acele − 0,4·kr·(1,5 − V.istah), 0, 1)    kr = D.koru·tutEtki   (iştahlı takım öndeyken daha az kapanır)
E.tempo += e·(V.tempo − B.tempo)
E.sakin += e·(0,2 + 0,6·(1 − istah_e) − B.sakin)      (konumsal ~.44, direkt ~.35, dikey ~.26; B1 ile çift sayımı önleyen ölçek)
E.risk  ×= 1 + 0,4·e·(0,6 − istah_e)
E.ilerle = 1 + 0,6·e·(istah_e − 0,5)     E.koruK = 1 + e·(istah_e − 0,5)     (V yoksa 1)
```
`A.ilerleme` → `A.ilerleme·takim.ilerle` (pas :424, taşıma :305, sürükle :337, bire bir :414, `ileriPasOnPuani` :233); `koruTempo·takim.koruK` koruSecenegi'nde; `takimNiyet` (:140) `N.kosu ×= 1 + e·(0,6·istah_e − 0,3)`; kontra eşiği (:135) istah_e ≥ 0,8'de `kontraSayim ≤ 1`. e=0'da çarpanlar 1 → `--ayni`. **Dışarıda:** `sutIstegi`, `kosuIstegi` tabanı, `araDeger`, `tarzArka`.
- Beklenen (tahmin): ileri pas +2–4 puan, şut +1–2, gol 2,40 → 2,5–2,7, pas isabeti −1–2; izlenecek: gerçekleşen ÷ konum xG (aceleci şut), pas isabeti ≥ 65.
- Denetim: `tarzIstah` 0 → `--ayni`; tarama 0,5 / 1,0 (40 maç `--tarz konumsal,direkt`); `k-kurma` Z3 satırları iki tarz için; `c-kanat`, `c-orta`, `b-pas`, `d-sut`.

### B4 — Maç başına tarz seçimi
- `Match` kurucusu `secenek.tarz=[A,B]` (ad ya da harman); `tarzKur` önceliği: `secenek.tarz[t]` > (`tarzSecim` 1 ise dağılım) > `kadro.taktik.tarz` > `yok`. Anahtar `tarzSecim` 1 (sahibi Z; 0 kadrodan, eski). Dağılım `TARZ_DAGILIM` (veri; tahmin, atak ağırlıklı): dikey .22, ilişkisel .18, konumsal .17, direkt .15, kanatOrta .15, dengeli .13. Seçim saf: `u=h2(tohum, 7919+t)` birikimli arama (`js/ortak.js` h2); konuk evle aynı çıkarsa `h2(tohum, 7921)` ile yeniden (2D'de iki tarz ayırt edilebilsin). `this.rast` kullanılmaz; ikiz ve işçiler aynı tarzı alır.
- `?tarz=A,B` → `MAC_SECENEK.tarz` (js/mac-sahnesi.js:31). `araclar/mac-deneme.js --tarz` → `secenek.tarz`; `--json`'a tarz (B0 özeti okur). **`araclar/senaryo-ortak.js:18` kadronun tarzını `secenek.tarz` ile sabitler** (senaryolar, `p-tip`, `oyuncu-karnesi` eski eşleşmeyle; `--ayni` kalır). `tarz-kenar.js` değişmez.
- Geliştirici paneli (index.html "Geliştirici · deneme ayarları"; js/arayuz.js): TEST satırı "Ev: <tarz> · Konuk: <tarz>" (`m.tarzAdi(t)` salt okunur). Oyun ekranına tarz adı yazılmaz (F).
- Denetim: `tarzSecim` 0 → `--ayni`; `ikiz-deneme 4`; `python -X utf8 araclar/kontrol.py "index.html?ekran=mac&tohum=3&tarz=dikey,konumsal"`; 40 maç tarz tablosu (tarzSecim 1).

### B5 — Denge okuması (80 maç, bilinçli denge sorusu)
- B3'ten sonra `node araclar/tarz-kenar.js konumsal direkt 80` (iki sıra): hedef **+0,2–0,3**. Bugünkü +0,43'ün kaynağı: konumsalın yüksek presi direktin kısa sahipliğini bitiriyor, direkt derin savunurken şut veriyor. > 0,3 ise en çok iki tablo düzenlemesi, her biri 80 eşli maç: (1) konumsal `presYuksek` .8 → .7, (2) direkt `istah` .75 → .85; < 0,2 ise geri alınır. Sonuç kutuphane/G G2.8'e ve MAC_MOTORU §3'e.
- Varsayılan dağılımla 40 maç (tarzSecim 1): istah ≥ .65 arketiplerin takım·maç payı ≥ %60; ortalama istah_e ≥ 0,6; ileri pas % dikey > konumsal; zincir konumsalda en yüksek ama eşiğin altında; sağlık aralığı. (Arketip başına ~7–9 takım·maç: yalnız yön.)

### B-son — Kapanış
40 maç `--karsilastir p2.json` → `araclar/taban/b.json` (p2 önceki olarak kalır, `s1.json` silinir); `oturum-sonu.js b.json --seyrek`; `ikiz-deneme 4 --esit --oncesi 598`; hız `git worktree add --detach <klasör> tur/p2` + `node araclar/hiz-olcum.js 2 --tekrar 8 --kok <klasör>` (≤ %10; 1000 adım ≤ 250 ms; teklif başına ~1 fazladan karar, `o.onIleri` ~110 döngü/karar: tahmin +2–5 %; aşılırsa `planHiz[0..1]` düşürülür ya da takım başına teklif aralığı 1,5 sn); `oyuncu-karnesi 80 1 --duyarlilik`; `kontrol.py` (maç, bülten), `akis-2d.py`; belgeler: FUTBOL_KUTUPHANESI §1'e "belirsizlik" maddesi (her plan tutmayabilir, şans girdide, kalite ortalamayı kaydırır) ve §11.1 madde 6 eşiği, §12.1 B satırı ve §12.4 tablo satırı, §10 Durum, §12.1 F satırına "maçın okunması"; OYUN_TASARIMI §2'ye "maç başkanın bilgi kaynağıdır" ilkesi; MAC_MOTORU §3 (karar 1 güncel, tarz kenarı hedefi); kutuphane/G G2.8; KAPILAR.md (B0/B1 satırları, yeni anahtarlar); YOL_HARITASI devam notu; `tur/b` etiketi; `main` ve push kullanıcının sözüyle; kullanıcı 2D'de izler (`?tarz=A,B` ile iki tarzı bilerek).

## Kabul (turun kapanışı)
1. `b0Zincir` konumsalda ≤ 0,5 × önce ve ≤ 1,5 / takım·maç; `b0Amacli` ↑; ileri pas % 25–50 ve tarz başına ayrışık; sağlık aralığı dışında 0 satır.
2. Üç ilkel görünür: `zVkT` ≥ 1,5 ve plan duvar pası > 0; plan üçüncü adamda C erken ≥ %70; `zGcN` 0,4–1,2 (80 maç); `zpKabul` %30–70; `z-s14` geçiyor; S3/S10 kapıları yeni kollarla.
3. İki tarz tepeden ayırt ediliyor (kullanıcı); k-kurma ve B0 tarz satırları yönüyle tutuyor; `--tarz` takasında iz tarzla gidiyor.
4. Tarz kenarı konumsal → direkt +0,2–0,3 (80 eşleştirilmiş maç); varsayılan dağılımla sağlık aralığı ve atak ağırlıklı satırlar.
5. Hız ≤ +%10, 1000 adım ≤ 250 ms; yeni anahtarlar eski değerde iken p2'ye `--ayni`.

## Yapılmayacaklar
- Bakış asimetrisi (:497) ve çizgi arkasını gören uzun top (Z4-2/D); `sutIstegi` iştaha bağlanmaz; korner verimi (Z6-2); görev çalkantısı düzeltmesi (yalnız `b0Firla`); oyun ekranında tarz adı ve maç öncesi satırı (F); `kvBekle` silme (temizlik notu); on arketip, `m.hoca` bağlantısı (F/Z7-2); kadro taktik ve profil değerleri (C); `plan` varsayılanının kapı geçmeden 31'e alınması; `dengeli`nin eski anlamını `yok` olmadan değiştirmek; 4/10 maçla anahtar ayarı.

## Riskler
- B1: pas isabeti ve kayıp artışı; geri çevirme paslarının bonus kaybı (`planAlici` muafiyeti; `ortaSecenekleri`'nin `geriCevir` yolunun `pasDegeri`'nden geçip geçmediği uygulamada kontrol edilir).
- B2: `vk` ile `planRolKonumu`'nun aynı kareyi yazması (aynı hedef; tek sürücü vk); üçüncü adamda ofsayt artışı (hat kuralı); rastlantı dizisi plan 20 ↔ 31 arasında kayar (`--karsilastir` ile).
- B3: `yok`/`dengeli` ayrımı atlanırsa tarzsız takımların sessizce değişmesi; kadro `taktik.sakin/tempo` değerlerinin gürültüye dönmesi (C'de TEST verisi yeniden yazılır).
- B4: senaryoların tohumdan tarz alması (sabitleme şart); 40 maçın tarz karışımı (arketip başına n küçük: yön).

## Doğrulama
- Her alt adım: `mac-deneme 4`, ilgili senaryo (KAPILAR), yeni anahtar eski değerde `--ayni` 24/24.
- Oturum sonu (commit öncesi): `oturum-sonu p2.json --mac 24` (B0'da `--ayni`; B1'den sonra `--ayni`siz, yerel `b-ara.json` ile ilerleme).
- Kapanış: B-son listesi; kullanıcı `index.html?ekran=mac` ve `?tarz=A,B` ile 2D'de izler.
