# H4 — Transferin kişisiz dalları: ikinci teklif, kaçan transfer ve alternatif (uygulama planı; koşullu)

Durum: planlandı 2026-10-25 gece (Fable); uygulama Opus 5.5, oto mod 3, masaüstü — yalnız H3 kapanmış ve gece bütçesi kalmışsa. Dal `claude/h4-transfer-dallari` (taban `tur/h3-sezon`), etiket `tur/h4-transfer`. YOL_HARITASI 4.2'nin kalanı (karşı teklif gerçek koşulla, kaçan transfer sonrası alternatif) ve 4.3'ün kişisiz dalları (rakip teklif, tekrar sınırı). Menajer ve sızıntı dışarıda (kişi ve gazete kararı). Program `araclar/plan/h-program.md`. Daraltma sırası: önce ikinci teklif, sonra kaçan transfer/alternatif; sığmazsa yapılmayan devam notuna yazılır.

## Kapsam

### H4-a — ikinci teklif (`js/transfer.js`)
- `TRANSFER_TEST` yeni anahtarlar (tek yerde): `ikinciTeklifPay:0.4` (ilk Reddet'ten sonra ikinci teklif gelme payı), `yukseltPay:0.6` (varyant: aynı kulüp yükseltir; kalanı başka kulüp girer), `ikinciTeklifGun:2`, `yukseltKat:[1.15,1.30]`, `rakipKat:[1.05,1.25]`.
- `KARAR_TURLERI.teklifKarari.uygula('reddet')`: `!v.asama` (ilk kart) iken `kadroRastgele(k.dunyaTohumu,'ikinci:'+v.olayId)()<ikinciTeklifPay` ise `isEkle(k,{tur:'gelisme',tarih:+ikinciTeklifGun,dakika:TRANSFER_TEST.saat,veri:{gelisme:'ikinciTeklif',kulupId,oyuncuId,alici,bedel,meseleId,olayId,varyant}})` — tarih dönem bitişini aşarsa kurulmaz; `tr.reddet` metni aynen; ilk kartın Reddet açıklamasına “Kulüp daha yüksek bir teklifle dönebilir ya da vazgeçer.” (TEST; bilinen sonuç kart yüzünde).
- `GELISMELER.ikinciTeklif`: `denetle` (kulüp, oyuncu, alıcı, mesele); `uygula`: oyuncu hâlâ bizdeyse ve dönem açıksa — varyant `yukselt`: aynı alıcı, bedel = eski × kat (1 M ₺'ye yuvarlı); `rakip`: tabloda üstümüzdeki başka kulüp (yoksa yükselt), bedel = eski × rakipKat — `meseleOlay(k,meseleId,'tr.ikinciTeklif',{varyant,kulupId:alici,oyuncuId,bedel})` ve aynı meselede yeni `teklifKarari` kartı (`isEkle` G2 kalıbı; `asama:2`, `bedel`, `alici`, `aciklama`); `dur:true`. Oyuncu gitmişse ya da dönem kapandıysa iz bırakmaz (`bilgi:null`).
- İkinci kartta Reddet → `tr.vazgecti` (`asama===2`: üçüncü teklif yok); Sat → mevcut satış yolu (bedel ikinci teklifin); cevapsız → `tr.cevapsiz` (mevcut `zamanAsimi`). Hoca notu (`tr.hocaGorus`, H1) yeniden yazılmaz; konu aynı konuşmada sürer.
- `teklifKarari.denetle`: `asama` varsa 2 olmalı; `secenekler` aynı ikili (Sat / Reddet) — ikinci Reddet'in açıklaması “Kulüp vazgeçer; bu dönem bu oyuncuya başka teklif gelmez.” (TEST).
- **Tekrar sınırı** `PAKETLER.gelenTeklif.degerlendir`: aday havuzundan bu dönemde teklif almış oyuncular çıkar (açık ya da kapanmış `gelenTeklif` olaylarının meselesindeki `tr.teklif` olayının `p.oyuncuId`si, açılış tarihi dönem içinde); aynı anda en çok bir açık teklif konusu (bugünkü kural) ve `transferAlternatif` kartı beklerken yeni teklif gelmez.

### H4-b — kaçan transfer ve alternatif kararı (`js/transfer.js`)
- `TRANSFER_TEST`: `kactiPay:0.25`, `imzaGun2:2`.
- `GELISMELER.transferImza.uygula`: hedef bulunduysa ve `!v.ikinci` ve `kadroRastgele(k.dunyaTohumu,'kacti:'+v.olayId)()<kactiPay` → oyuncu bize gelmez (yerinde kalır; AI kulüpler arası transfer yok), `meseleOlay 'tr.kacti'` ({oyuncuId, eski}); `transferHedefi(k,v,{haric:[H.p.id]})` ikinci aday bulursa başkana dönen karar `transferAlternatif` (`isEkle` G2 kalıbı: `saatsiz`, `bekleyebilir`, `gelis`, son cevap `cevapGun`, `soran:v.hocaId` — telefonda hocanın konuşmasında cevaplanır, `meseleId`, `olayId`, `kulupId`, `hocaId`, `mevki`, `bonservis`, `tavan`, `adayId`, `bedel`, `maas`) ve hocanın mesajı `tr.alternatif` (mesele olayı; `MESAJ_GONDEREN`/`MESAJ_METIN` hocanın ağzından: “Başkanım, ilk hedef kaçtı; yerine <ad> var: bonservis X, aylık Y.”); aday yoksa `tr.bulunamadi` (bugünkü). `dur:true`.
- `KARAR_TURLERI.transferAlternatif`: `secenekler` [Alternatife geç (sure 15; engel: oyuncu artık uygun değil / dönem kapalı; açıklama bedel ve maaş) / Vazgeç (sure 0; “Bu dönem o hatta transfer yok.”)]; `uygula('gec')` → `isEkle gelisme transferImza` `{…v, ikinci:true, hedefId:adayId}` `imzaGun2` sonra (dönem bitişini aşmaz) + `tr.alternatifOnay`; `uygula('vazgec')` → `tr.alternatifVazgec`; `zamanAsimi` → `tr.alternatifVazgec` (metin: “Cevap vermezsen alternatif düşer.”). `transferImza` `hedefId` verilmişse yalnız o oyuncuyu dener (kaçma ikinci kez olmaz); dönem başına en çok bir kaçma (konu `kacti:` olayı meselede varsa yeniden çekilmez).
- `transferHedefi(k,v,o)` isteğe bağlı `o.haric` (kimlik listesi) ve `o.hedefId` alır; imza tablosu ve serbest oyuncu kuralı aynen.

### H4-c — metinler (TEST yer tutucu; karar 35 kipi)
- `MESELE_OLAYLARI`: `tr.ikinciTeklif` (iki varyant tek anahtar: “<Kulüp> teklifini yükseltti: …” / “<Kulüp> araya girdi: … teklif etti.”), `tr.vazgecti`, `tr.kacti`, `tr.alternatif`, `tr.alternatifOnay`, `tr.alternatifVazgec`. `MESAJ_GONDEREN['tr.alternatif']=pKisi('kisiId')`, `MESAJ_METIN['tr.alternatif']` (hocanın ağzından; mesele olayının birinci tekil eşi). Yeni kişi yok, gazete haberi yok.

### H4-d — araçlar
- `araclar/kariyer-deneme.js` yeni bölüm “4.3 — transferin kişisiz dalları (H4)”: `TRANSFER_TEST.ikinciTeklifPay`, `yukseltPay`, `kactiPay` deneme içinde geçici 1 ve 0'a sabitlenir (bölüm sonunda eski değerler geri) — tohum taraması yok: `ikinciTeklifPay=1,yukseltPay=1` → ilk Reddet'ten 2 gün sonra 11:00 aynı meselede ikinci `teklifKarari` (`asama` 2, aynı alıcı, bedel 1,15–1,30 kat); `yukseltPay=0` → başka kulüp (tabloda üstümüzde ya da herhangi), bedel 1,05–1,25 kat; ikinci Reddet → `tr.vazgecti`, konu kapanır, aynı dönemde aynı oyuncuya üçüncü teklif yok ve sonraki teklif başka oyuncuya; ikinci Sat → bedel ikinci teklifin, ertesi gün tek `odeme`; cevapsız → geri çekilir; `ikinciTeklifPay=0` → 4.2 bölümü birebir geçer; `kactiPay=1` → imza anında `tr.kacti`, oyuncu eski kulübünde, `transferAlternatif` kartı soran hoca → `kararTelefondaMi` true, iki cevap, Alternatife geç → 2 gün sonra imza (farklı oyuncu, bedel ≤ bonservis, maaş ≤ tavan), hoca teşekkürü; Vazgeç / cevapsız → kadro ve kasa değişmez; aday yoksa `tr.bulunamadi`; dönem bitişine yakın ikinci teklif kurulmaz; kaydet–yükle sonrası ikinci teklif ve alternatif ikinci kez doğmaz; aynı tohum aynı dallar; bozuk veri (`asama` 3, alternatif oyuncu artık uygun değil) doğrulamada ya da seçenek engelinde yakalanır. Mevcut 4.2 bölümü varsayılan paylarla da (0,4/0,25) belirlenimcilik satırını korur.
- `araclar/sezon-deneme.js`: `--teklif reddet` ikinci karta da aynı cevap; yeni `--teklif reddetSat` (ilkini reddet, ikincisini sat); `--alternatif gec|vazgec|cevapsiz`; para özetinde dal işaretleri; `18 7 --tek --teklif reddetSat --talep onayla --alternatif gec` ve `36 7 --tek --sezon 2 --teklif reddet --talep onayla --alternatif gec` (iki pencere) koşulur.

## Yapılmayacaklar

- Menajer kişisi ya da talebi (kişi kaydı ister; karar 7, 33); basına sızma / gazete haberi dalı (karar 47/6); yeni kişi, yeni haber.
- Üçüncü düğme ya da pazarlık menüsü (“Karşı teklif iste”, “Daha yüksek iste”): karşı teklif yalnız alıcının gerçek yeni teklifi olarak doğar (TEKNIK_PLAN §6); başkanın pazarlık girişimi karar 47/3'e komşu.
- Açık kartı iptal eden “rakip teklif” ve “iki teklif arasında seçim” kurgusu (OYUN_TASARIMI §2'nin o seçeneği kullanıcıya kalır): ikinci teklif ardışık karttır.
- Oyuncunun ücret artışı isteği (oyuncu kişi değil; moral/ilişki sistemi yok → sahte ikinci cevap riski).
- AI kulüpler arası transfer, öbür kulüplerin kasası, oyuncu değeri modelinin dengelenmesi.
- Yeni ekran, Kadro sekmesi, oyuncu dosyası, transfer listesi (karar 47); motor, taban, kayıt sürümü, ses, puan gösterimi.

## Kayıt sürümü

10 (değişmez). Yeni karar verileri mevcut `isler`/`olaylar`/`meseleler` biçiminde, isteğe bağlı alanlar (`asama`, `ikinci`, `hedefId`); geçiş yok; sürüm 10 kaydı dönüşümsüz açılır.

## Kabul

- `node araclar/kariyer-deneme.js` çıkış 0: yeni 4.3 bölümü yukarıdaki denetimlerle; 4.2 aynen (pay 0 ile birebir G2 yolu).
- `node araclar/sezon-deneme.js 18 7 --tek --teklif reddetSat --talep onayla --alternatif gec` ve `36 7 --tek --sezon 2 --teklif reddet --talep onayla --alternatif gec` çıkış 0: dallardan en az biri gerçekleşir (ikinci teklif ya da kaçma; tohum ve dal raporlanır), kariyer geçerli; `36 3 --kaydet --sezon 2` belirlenimcilik korunur ve H3 kapanışındaki kayıt metniyle birebir (varsayılan paylarla dal açılmayan tohumda) ya da fark yalnız dallardan.
- `node araclar/mac-deneme.js 4` “sonuç aynı”; `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni` 40/40; `node araclar/ad-denetimi.js` temiz.
- `python -X utf8 araclar/akis-deneme.py 3 19 21` geçer (kart ve oda değişmedi; bilgi); `python -X utf8 araclar/kontrol.py` hatasız.
- Her yeni kartın cevapsız sonucu kartın yüzünde önceden yazar (`zamanAsimi.metin`) ve zamanında bir kez işler.
- Belgeler; `git diff --check`; `tur/h4-transfer`; `main` ileri sarıldı ve push edildi.

## Riskler

- İçerik kuralı sınırı: altı TEST olay/mesaj metni; karakter üslubu yok; kullanıcı sonradan yazar (menajer isterse ayrı tur).
- “Sahte ikinci cevap”: her dalın iki cevabı gerçek ve farklı etkili (sat/reddet → vazgeçti; alternatife geç/vazgeç); ikinci kartın Reddet açıklaması farklı sonucu söyler.
- Aynı olayın tekrarı hissi: dönem başına sınırlar (aynı oyuncuya en çok iki kart, bir kaçma), belirlenimci TEST olasılıklar; `sezon-deneme` dal sayısını yazar; kış penceresinde yılda 3 teklif → derinlik H3'nin yaz dönemiyle iki kat görünür.
- Belirlenimcilik: `kadroRastgele(dunyaTohumu, anahtar)` ile; kayıtlı rastlantı çekilmez; kaydet–yükle farkı kariyer-deneme ve sezon-deneme ile.
- Dönem bitişine yakın ikinci teklif ya da imza (`+2 gün`) dönem dışına düşerse kurulmaz / dönem bitişine çekilir (G2'nin `transferButcesi` kalıbı); denetim.
- Zaman: H3 uzarsa yalnız H4-a (ikinci teklif) ya da hiç; devam notuna yazılır.

## Claude kararları (belgeye görünür yazılır)

- Karşı teklif başkanın pazarlık düğmesi değil, alıcının ilk ret sonrası gerçek yeni koşuludur: aynı kulüp yükseltir (×1,15–1,30) ya da tabloda üstümüzdeki başka kulüp girer (×1,05–1,25); 2 gün sonra, TEST %40; ikinci ret kesindir; aynı oyuncuya aynı dönemde en çok iki kart.
- Kaçan transfer imza anında doğar (TEST %25), oyuncu başka kulübe gitmez (AI transfer yok); alternatif başkana iki cevaplı kartla ve telefonda hocanın konuşmasında döner; dönemde bir kez; onayda kaçma tekrarlanmaz.
- Olasılıklar, günler ve katlar `TRANSFER_TEST` içinde tek yerde; dünya tohumu ve olay kimliğinden belirlenimci; kayıt sürümü 10 kalır.
- Tekrar sınırı: bu dönemde teklif almış oyuncu havuzdan düşer; alternatif kartı beklerken yeni teklif gelmez.
- Menajer ve sızıntı bilinçli dışarıda (kişi içeriği ve gazete kararı); belgede 4.3'ün kalanı olarak işaretlenir.

## Belgeler

- OYUN_TASARIMI §8 “Bugünkü uygulama (H4)” (hangi dallar var: ikinci teklif, kaçan transfer ve alternatif; hangileri yok: menajer, sızıntı, pazarlık menüsü, iki teklif arasında seçim).
- TEKNIK_PLAN §6 (karşı teklif yalnız gerçek koşulla — uygulandı), §3 (yeni karar türü `transferAlternatif`, gelişme `ikinciTeklif`, isteğe bağlı alanlar `asama`, `ikinci`, `hedefId`).
- YOL_HARITASI 4.2 ve 4.3 kısmi işaretleri (kalan: menajer talebi, sızıntı — kişi ve gazete kararına bağlı; iki teklif arasında seçim kullanıcıya), karar 50 “H4 kararları (Claude)”, devam notu, Tamamlanan turlar `tur/h4-transfer`.
- CLAUDE.md “Bugün çalışan”; `araclar/KAPILAR.md` G2 satırına H4 ekleri ve `sezon-deneme` seçenekleri; `araclar/plan/h4-uygulama.md` sapmalar; `araclar/plan/OKU.md`.

## Sapmalar

(boş — uygulama sırasında doldurulur)
