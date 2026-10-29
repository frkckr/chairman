# R6 — Zincirler (ilk dilim): maaşın gizli yetenekten kopması, rakiplerin gündemi gazetede, ikinci teklif, sponsor zinciri (uygulama planı)

Durum: **oto modda planlandı ve uygulanıyor (kullanıcı, 2026-10-29 gece: “… sonra r6 planla, sonra uygula, main'e al, push yap; sabaha kadar oto modda sırasıyla kendin yap”).** Kullanıcı uyurken verilen toplu izin R6'nın planını ve uygulamasını kapsar; plan turun başında yazılır (karar 12), sabah incelemeye açıktır. Uygulama Opus 5.5, masaüstü. Dal `claude/r6-zincirler` (taban R5'in `main`'e alındığı commit), etiket `tur/r6-zincirler`.

Kaynaklar: R programı (YOL_HARITASI karar 56): “R6 — sözleşme, kriz, kurumsal (sponsor) zincirleri; Y1'in kalanı (kişi modeli, personel slotu); maaşın gizli kabiliyetten kopması; rakip gündemi gazetede; aralarda oynama”; R4'ün “Yapılmayacaklar”ı (satış şablonu, söylenti kanalı, taksit ve pay R6'ya); R1 borç listesi (“maaşın gizli kabiliyetten türemesi (R6)”); [OYUN_TASARIMI §1](../../OYUN_TASARIMI.md#başkanlık-deneyiminin-temel-ilkeleri) (gündelik doku gerçek veriden okuyan sistemlerden; başarı büyümeye açılır).

## Kapsamın bölünmesi (Claude kararı, gerekçeli)

R6'nın program satırı bir gecelik tura sığmaz: kişi modeli ve personel slotu (Y1 kalanı), kriz şablonu (içerik ağırlıklı; kullanıcının pilotları P01, P07) ve sözleşme pazarlığı ayrı bir tur ister. Bu tur **ilk dilimdir** (R6): oyuncunun bilgi dengesini bozan maaş sızıntısını kapatır, dünyayı gazetede görünür kılar, gelen teklife pazarlık tadı verir ve şablon motorunun transfer dışındaki ilk kullanıcısını (sponsor) kurar. Kalanı **R6b** olarak devam notuna ve sıraya yazılır (kişi modeli ve personel slotu, kriz, sözleşme pazarlığı, menajer ve satan başkan kişileri, taksit ve pay). Kullanıcı sabah sırayı değiştirebilir.

## Bugünkü durum (kodla doğrulandı, 2026-10-30)

- `maasTahmini(p, tarih)` (`js/sozlesme.js`) doğrudan oyuncunun gizli özellik ortalamasından türer; Dosya › Kadro maaşı gösterdiği için **maaş gizli yeteneğin okunuşudur** (kulüpler arası karşılaştırmada yetenek sırası maaş sırasıyla aynı).
- Gazete (`js/gazete.js`, `GAZETE_KAYNAKLARI`) bizim maç, lig, sakatlık, P12 ve bizim transferlerimizi okur; **başka kulüpler arasındaki transfer (R4 dar transfer) ve rakip ilgisi gazetede yok.**
- Gelen teklif (`js/transfer.js`, G2) iki cevaplı tek karttır: Sat / Reddet; reddetmek konuyu kapatır, alıcı geri gelmez.
- Şablon motoru (`js/sablon.js`, R4) yalnız transfer alımında kullanılıyor; pazarlık (`js/pazarlik.js`) yalnız “biz öderiz” yönünde.

## Kapsam

### R6-a — maaş gizli yetenekten kopar (kural)

- `maasTahmini` piyasanın **algısından** türer: gizli ortalama + oyuncuya özgü kalıcı algı sapması (kimlikten, ±8 puan TEST) + ün (eski yıldız +6) ; yaş katları aynı. Aynı oyuncu her zaman aynı tahmini verir (belirlenimci). Maaş yeteneğin kaba göstergesi kalır ama sırası değildir: “pahalı ama vasat”, “ucuz ama iyi” oyuncular olur — keşfetmenin yolu gözlem, izleme ve hocanın görüşüdür.
- Kayıtlı sözleşmeler değişmez (eski kayıtta maaşlar aynen); yeni kariyerde ve yeni sözleşmelerde algı kullanılır.
- Ölçü (kariyer denemesi): ligin bütün oyuncularında gizli ortalama ile yaş katından arındırılmış maaş arasındaki sıra korelasyonu (Spearman): önce 0,997 (maaş gizli yeteneğin sırası), ±8 ile 0,75 (üç tohum ortalaması; ±6 0,82, ±10 0,68). Hedef aralık 0,6–0,8 (TEST).

### R6-b — rakiplerin gündemi gazetede (kural: gazete kaynağı)

- Yeni kaynak: başka kulüpler arasındaki transferler (R4 dar transfer: “X, Y'den Z'ye geçti”), rakip ilgisi söylentisi (bizim dosyamızdaki rakip araya girer kıvrımından: “Kulis: Z de X'le ilgileniyor”, sayı ertesi sabah) ve öbür kulüplerin uzun sakatlıkları (maç kaydından, haftada en çok iki). Önem P12 ve bizim transferimizin altında; manşet olmaz (kutu ya da sütun). Kayıt değişmez: geçmişten her sabah aynı kurulur.

### R6-c — gelen teklifte ikinci teklif (kural)

- Reddet artık sert pazarlık hamlesidir: alıcı TEST olasılıkla (oyuncunun değeri bedelin üstündeyse daha yüksek) 2–3 gün sonra **bedeli artırarak** (×1,12–1,25) yeniden gelir; ikinci reddedişten sonra gelmez. Telefonda ve dosyada yeni teklif; hocanın görüşü aynı. Cevapsız teklif eskisi gibi geri çekilir (yeniden gelmez).
- Satış şablonu (P07: “hocaya nasıl söylerim”, oyuncunun isteği, taksit) R6b'de.

### R6-d — sponsor zinciri: şablon motorunun ilk kurumsal kullanıcısı (kural; TEST)

- Yeni şablon `sponsor` (`js/sponsor.js`): sezonda bir kez (TEST: Şubat'ın ilk haftası; kulüp tablonun üst yarısındaysa teklif daha güçlü) stattaki TEST tabelalardan bir marka forma göğüs reklamı önerir. Aşamalar: teklif kartı (fırsat; “Görüşelim” / “İlgilenmiyoruz”) → pazarlık kartı (**tahsil yönü**: ekibin iki rakamı — makul ve iddialı aylık bedel; markanın gizli üst sınırı ve sabrı; karşı teklif) → cevap (bekleme) → imza: sezon sonuna dek her ay başı kasaya gelir (`ayBasi` kancası), dosya kapanır. Kayıp: marka çekilir (kopma, cevapsız).
- Pazarlık iki yönlü olur: `pazarlikKur(…, {yon:'tahsil'})` — teklif üst sınırın altındaysa kabul; değilse sabır düşer, karşı rakam üst × 0,9. Mevcut “öderiz” yönü aynen.
- Marka adları stattaki TEST tabelalardan (kulüp adı değildir; yer tutucu, kullanıcı değiştirir).

### R6-e — denetimler (karar 63; motor dosyası değişmez)

- `node araclar/hizli.js`; `kariyer-deneme` yeni bölüm (maaş algısı belirlenimci ve sıra korelasyonu aralıkta; gazete kaynakları: dar transfer ve söylenti haberi, kayıt değişmez; ikinci teklif: reddet → artırılmış ikinci teklif, ikinci ret son; cevapsız yeniden gelmez; sponsor zinciri: teklif, tahsil pazarlığı kabul/karşı/kopma, imza ve ay başı gelir, sezon sonunda biter; şablon tanımı eksiksiz).
- Sezon tabanları: maaşlar değiştiği için t3 ve t7 **yeni taban** (`sezon-r6-t3.json`, `sezon-r6-t7.json`) gerekçesiyle; maç sonuçları ilk haftalarda aynı kalmalı (maaş maç girdisine girmez).
- `akis-deneme` yeni **§35** (gazetede rakip haberi; ikinci teklif kartı; sponsor teklifinin kartı ve pazarlık yüzü); etkilenenler 3, 21, 30, 33.
- `okunurluk.py` sponsor pazarlık kartı sahnesi.

## Yapılmayacaklar (R6 — R6b'ye)

- Kişi modeli (gündem, hafıza, tutum), personel slotu, menajer ve satan başkan kişileri; kriz şablonu; sözleşme yenileme pazarlığı; satış şablonu (P07), taksit, pay ve imza parası; söylenti kanalı olarak telefon.
- Yeni ekran, görsel dil, motor, ses, puan.

## Claude kararları

- **Kapsamın bölünmesi** (yukarıda). **Maaş algısı kalıcıdır** (oyuncuya özgü; sezonlar boyu aynı); gerçek yetenek ondan ancak gözlemle ayrılır.
- **Reddet sert pazarlık hamlesidir**, iki cevap kuralı bozulmaz.
- **Sponsor tabela markalarından;** tutarlar TEST (`SPONSOR_TEST`).

## Kabul

- `hizli` çıkış 0; `kariyer-deneme` yeni bölümle geçer; t3 ve t7 yeni tabanlar gerekçeli (maç sonuçlarında fark, maaşın değiştirdiği yorgunluk/rotasyon dışında beklenmez — kasa ve satış bedelleri farklıdır).
- `akis-deneme` 35 ve etkilenenler geçer; `okunurluk.py` eşikte.

## Tahmin

5–7 saat. Sıra: a → b → c → d → e.

## Sapmalar

(boş — uygulama sırasında doldurulur)
