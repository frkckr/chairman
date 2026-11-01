# Arayüz dili (RK3, 2026-11-01; karar 83 — kullanıcı: “Önerdiğin karışım”; kurallar STIL_REHBERI §7 “Arayüz dili”nde)

Kaynak: kullanıcının 1 Kasım notu (“raporlar okunaksız, düğmelerin yeri, ara geçişler, renkler, ikonlar … sıfırdan planlasan aynısını mı yaparsın”), araştırma ve teşhis [../../plan/kasim-notlari-arastirma.md](../../plan/kasim-notlari-arastirma.md) §6, paket planı [../../plan/kasim-paketi.md](../../plan/kasim-paketi.md) RK3. Bu sayfa iki taslağın ortak kurallarını ve aralarındaki seçimi anlatır; görüntüler `png/` altında (`v1-*` Kırtasiye, `v2-*` Kulüp evrakı 1999; 640, 944, 1186 piksel). Kaynak sayfa `taslak.html?v=1|2&s=mali|kart|transfer|gunbasi|simge`; görüntü ve ölçü `python -X utf8 araclar/taslak/rk/cek.py`.

## Değişmeyenler

Odak modeli (masa → nesne → kâğıt, en çok iki derinlik), tek kart ve “tıklama uygulamaz”, tanıdık telefon, tarafsız Canlı Skor, tuşlar (1–7, Esc, ←/→, Enter, Z, P), koyu tema yok, amber yalnız ana eylem ve seçili.

## İki taslağın ortak kuralları (ikisinde de uygulanır)

1. **Tek krom çubuk.** Üstte kulüp · tarih ve saat (saat kulüp kırmızısı) · kayıt · Duraklat. İşin başlığı kâğıdın üstünde; Kapat kâğıdın köşesinde. Alt şerit tek satır (durum); yardım cümlesi ilk açılışlarda.
2. **Kâğıt öne, oda geriye.** Perde hafif (%20–28 karartma); kâğıdın kenarı ince, gölgesi yumuşak. Kalın kırmızı çerçeve yok.
3. **Ana eylem kâğıdın alt kenarında** (sağda amber, solda ikincil eylemler); ikincil eylem nesnenin üstünde (oyuncu satırında “Araştırt”, “Menajeri”).
4. **Rapor dili:** üstte üç büyük rakam (bugün kasa · 90 günde en düşük ve tarihi · 90 gün sonra), önceki rapora göre değişim oku; altında 90 günün seyri (tek çizgi, en düşük nokta işaretli); etiket–değer listesi; en altta hareketler tablosu (Tarih · Açıklama · Giriş · Çıkış), eşit genişlikli rakam, sağa yaslı, tek renk zebra, ay toplamı. Kuruş yok; metinde “4,82 milyon ₺”, tabloda tam rakam.
5. **Yazı:** gövde 16 px (en az 15), en küçük 12; tablo ve rakamlar Plex Sans eşit genişlikli rakamla (v2'de rakam alanları Plex Mono); başlık Plex Sans (v2'de Plex Serif); piksel yazı (Jersey 10) yalnız forma numarası, skorbord, saat gibi cihaz göstergelerinde.
6. **Simgeler:** 16 piksel 1-bit piktogram (`simge.js`; tek ızgara, 1 piksellik çizgi, mürekkep rengi), yanında her zaman kelime. Damga yalnız durum (ALINDI, LİSANSLI, ÖDENDİ, TESCİL).
7. **Renk disiplini:** krem kâğıt, kahve mürekkep, mürekkep mavisi (bilgi, seyir çizgisi), kulüp kırmızısı yalnız kimlik ve düşüş, amber yalnız ana eylem ve seçili sekme, yeşil yalnız galibiyet ve antrenman notu.
8. **Kontrast ≥ 4,5:1** (ikincil yazı dahil; ölçü `cek.py`).
9. **Gün başı kâğıdı:** 08:00 durağında masada asistanın notu — dün ya da son maç, bugünün ajandası, cevap bekleyenler, kasa tek rakam, gazetenin manşeti; “Güne başla” ile kapanır. Ayrı ana ekran değildir (masa gelen kutusudur).
10. **Transfer:** Pano · Liste · Ara · Geçmiş (Piyasa yok); Ara kamu künyesinde klavyeyle ve süzgeç çipleriyle; kısa liste mevkiye göre, her satırda kaynak; “Hocaya araştırt” ana eylem, “Menajerlere duyur” ikincil.

## Ayrıldıkları yer

| | v1 Kırtasiye | v2 Kulüp evrakı 1999 |
|---|---|---|
| Kâğıt | Düz krem, ince çizgi | Antetli (arma ve kulüp adı), hafif satır çizgisi |
| Rapor | Başlık + üç rakam + tablo | Resmî yazı: Sayı, Konu, “BAŞKANLIK MAKAMINA”, “Bilgilerinize arz ederim”, paraf ve ALINDI mührü |
| Oyuncu | Kart: yüz, künye, bu sezon, notlar iki sütun | Sicil fişi: ataşlı fotoğraf, daktilo alanlar, LİSANSLI mührü, notlar sarı not kâğıdında |
| Transfer | Kâğıt sekmeler | Mantar pano: iğneli kart, teleks şeridi (gelen menajer menüsü) |
| Gün başı | Sade not | Sarı bloknot, mavi çizgili |
| Krom | Krem çubuk | Koyu ceviz çubuk, çift çizgi |
| Risk | Düşük; okunurluk en yüksek | İmza güçlü; yoğun ekranda (kadro, Canlı Skor) süs yorabilir — oralarda v1 kalır |

## Önerim

Karışım: **iskelet ve yoğun ekranlar v1** (kadro, Canlı Skor, telefon, tablolar), **belge niteliğindeki kâğıtlar v2** (mali rapor ve resmî yazışmalar, oyuncu sicil fişi, transfer panosu, gün başı notu). Böylece her nesnenin kendi dili olur (RK program §3 “nesne başına görsel dil”), okunurluk tabanı ortak kalır.

## Karar (2026-11-01, kullanıcı: “Önerdiğin karışım”; karar 83)

Soru 1: önerilen karışım — iskelet ve yoğun ekranlar v1 Kırtasiye (krom çubuk, odak kabı, kadro, Canlı Skor, telefon, tablolar, ayarlar), belge niteliğindeki kâğıtlar v2 Kulüp evrakı 1999 (mali rapor ve resmî yazışmalar, kulübün oyuncu dosyasında sicil fişi, transfer panosu, gün başı notu). Soru 2 ve 3 önerilen varsayılanla (kullanıcı ayrıca söylemedi): gün başı notu masada rozetle bekler, kendiliğinden açılmaz; mali rapordaki resmî yazı dili kalır (TEST metin). Uygulama RK5 (plan `araclar/plan/rk5-uygulama.md`).

## Kullanıcıya sorular

1. Ekran başına v1 mi, v2 mi, karışım mı? (önerim yukarıda)
2. Gün başı kâğıdı 08:00 durağında kendiliğinden açılsın mı, masada beklesin mi? — *masada beklesin, rozetli*.
3. Mali rapordaki resmî yazı dili (“Bilgilerinize arz ederim”) kalsın mı? — *evet, TEST metin*.
