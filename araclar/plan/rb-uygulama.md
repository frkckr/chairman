# RB — Balkonda antrenmanı izlemek (uygulama planı)

Durum: **onaylandı (kullanıcı, 2026-10-30: “Onayla, başla”; önerilen iki seçimle: geniş düzen yalnız balkonda, düz yakınlaşma — dürbün yok).** Dal `claude/rb-balkon` (taban `main` 1315ae5, RN dahil). Uygulama masaüstünde, Opus 5.5. Sapmalar ve denetim sonuçları en sonda.

Kaynak: kullanıcının 2026-10-30 notu 1 (“balkonda antrenman izlenemiyor; bir gruba, oyuncuya ya da bölgeye bakmak, yakınlaşmak”), RN planının §0 eşlemesi ([rn-uygulama.md](rn-uygulama.md)) ve YOL_HARITASI karar 68.

## 0. Bugün (kod, 2026-10-30)

- Balkon kamerası sabit: göz `STIL.balkon.goz` (ana tribünün arkası), bakış `STIL.balkon.bakis` (saha ortası), görüş açısı 46°. Saha ortası ~53 m, uzak köşe ~100 m: 960×720 ızgarada figür ~30 px ve ~16 px; ekranda (1366×650'de kare 825 px) ~25 ve ~14 px.
- Balkonda iş açılınca (`ODA.odak`) bakış telefona döner (`js/oda.js` `odaKare`): iş açıkken saha görünmez olur.
- Antrenman kâğıdı sağ üstte; iş açıkken sola geçer (RN-c, geçici); dar karede (< 820 px) iş tam genişlik, kâğıt gizli.
- 16:9 pencerede oyun alanı 4:3 kare; yanları boş.

## Kapsam

Yalnız görüntü ve sunum. **Kural, kayıt ve motor değişmez**: bakış kayda girmez, kariyer komutu çağırmaz, sinyal üretmez (sinyalin bakılan kümeden gelmesi R6b-2'de). Antrenman çeşitliliği R6b-2'de. Kodla çizim; yeni poz ve figür yok.

### RB-a — Bakış ve yakınlık (`js/balkon.js`, `js/oda.js`)

- Başkan oturduğu yerde kalır; göz sabit, yalnız bakış ve görüş açısı değişir. Yakınlık üç kademe (`STIL.balkon.yakinlik`, TEST): **geniş** 46° (bugünkü), **grup** ~20°, **yakın** ~9°.
- Bakış hedefleri: **saha** (bugünkü), **yer** (sahada bir nokta), **grup** (ısınma/yavaş koşu, pas çemberi, şut, esneme, ayrı koşu, kaleciler, teknik ekip; grubun canlı merkezi, koşuda sıranın ortasındaki koşucu), **oyuncu** (takip).
- Seçim:
  - Sahada tıklama: geniş bakışta bir figürün yakınına → o grup; grup ya da yakın bakışta bir figüre → o oyuncu takip edilir; boş zemine → o yer (grup kademesi). Üzerine gelince imleç el olur, figürün adı ipucunda.
  - Fare tekerleği: içeri bir kademe yakın (genişten imlecin altındaki yere), dışarı bir kademe geniş; genişe dönünce saha.
  - Klavye **Z**: yakınlık kademesi döner (2D maçtaki gibi; geniş → grup → yakın → geniş). **Esc** (iş ve onay yokken): oyuncu → grubu → saha; yer → saha.
  - Antrenman kâğıdında **Sahada** bölümü (aşağıda).
- Geçiş yumuşak (üstel yaklaşma, ~0,6 sn'de yerine oturur; baş en çok ~140°/sn, RN-b ile aynı sınır). Duraklat bakışı da dondurur (oda karesi durur).
- Balkonda iş açıkken bakış seçili hedefte kalır (telefona dönmez). İş karenin sağını örtüyorsa hedef görünen sol bölümün ortasına kayar (kamera hafifçe sağa döner).
- Takip edilen oyuncunun başının üstünde küçük ad etiketi (“7 · Ad”); dokununca oyuncunun dosyası. Oyuncu düzende yoksa (gün değişti, saha boşaldı) bakış sahaya döner.
- Odaya dönüşte bakış sıfırlanır; balkona her varış geniş sahayla başlar (yürüyüşün son bakışıyla aynı).

### RB-a2 — Antrenman kâğıdında “Sahada” (`js/ekran-oda.js`)

- Antrenman sürerken (ya da TEST her saat açıkken) kâğıtta “Sahada” başlığı altında gruplar: ad ve kişi sayısı (“Pas çemberi · 7”). Gruba dokununca bakış o gruba; seçili grubun altında oyuncular (forma ve ad), dokununca takip; seçili oyuncunun yanında “Dosyası ▸”. Başta “Bütün saha”.
- Bu bölüm yalnız görüntüdür, iş açıkken de kullanılabilir (bakışı değiştirir, işi kapatmaz).

### RB-b — Geniş pencere bandı (`js/sunum-durumu.js`, `index.html`, `js/ekran-oda.js`)

- Balkonda (oda sayfası, başkan balkonda) pencerenin yanında 4:3 karenin yanına en az ~300 px sığıyorsa **kâğıt bandı** açılır: 3B kare solda bugünkü boyunda kalır (960×720 ızgara değişmez), sağında bant (en çok karenin %55'i). Ölçü `ekranPayGuncelle` ile: `--kare-en`, `--bant-en`, `#screen[data-bant]`.
- Bantta: üstte antrenman kâğıdı; telefon ve öbür işler bandın içinde açılır, bant dar kalırsa iş sağdan sola doğru genişler (dosya ve defter iki sayfası için en az ~46 em) ve karenin sağını örter; o zaman bakış görünen sola kayar.
- Yazı boyu karenin genişliğinden ölçülür (bant yazıyı büyütmez): `yaziBoyuDegeri` `--kare-en` varsa onu kullanır.
- 4:3 ya da dar pencerede bant yoktur: bugünkü yarım odak sürer, **antrenman kâğıdı kalıcı olarak solda** (tarih kutusunun altında; RN-c'nin geçici kuralı kalıcı), iş sağda. Dar karede iş tam genişlik kalır (yazı tabanı); kapanınca saha seçili bakışla döner.
- Odada ve maçta düzen değişmez. STIL_REHBERI §1 (oyun alanı) ve §7 (balkon) güncellenir.

## Denetim

- Her adımda `node araclar/hizli.js`.
- Tarayıcı: bakış (tıklama, Z, tekerlek, Esc, Sahada listesi, takip etiketi), bant (1920×1080, 1536×864, 1366×650; 4:3 pencere; dar kare), iş açıkken bakış ve kayma, duraklatma.
- `akis-deneme.py`: balkon bölümleri (7, 12, 16, 23, 27, 30, 34) ve yeni §36 (bakış ve bant). `okunurluk.py` balkon sahneleri ve bantlı pencere. `kontrol.py`. `yuruyus-yakala.py` (varışın son bakışı).
- Büyük kapı (RN ile birlikte RB `main`'e alınmadan önce, masaüstünde): `akis-deneme.py` tamamı (RN'nin dizüstünde kalan 11, 12, 14, 14b, 15, 15b, 16, 28 dahil), iki sezon tabanı `--ayni`, `oturum-sonu.js --ayni --seyrek`, `kontrol.py`, `akis-2d.py`, `okunurluk.py`. Motor değişmediği için hız ölçümü yok.

## TEST değerleri

Yakınlık açıları (46 / 20 / 9), geçiş hızı, bant en az ve en çok genişliği, tıklama yakınlık eşikleri. Kullanıcı deneyince ayarlanır.
