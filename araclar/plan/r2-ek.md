# R2 eki — Reigns gibi kart, tek işli panel, “Yeni konu aç” (uygulama planı)

Durum: **onaylandı (kullanıcı, 2026-10-29: “Onayla, başla”); uygulama Opus 5.5, masaüstü.** Dal `claude/r2-ek` (taban `claude/r2-telefon`, `tur/r2-telefon`; R2 henüz `main`'de değil), etiket `tur/r2-ek`. `main`'e alma ve push kullanıcının sözüyle; R2 ve R2 eki birlikte alınır.

Kaynak: kullanıcının 2026-10-29'da gönderdiği beş görsel (gelen mesaj, sola kaydır, sağa kaydır, eski mesaj, yeni mesaj) ve kararı: **“cevaplar sağda ve solda görünmesin, kaydırınca çıksın, Reigns gibi.”** Claude'un değerlendirmesi sohbette; alınanlar ve alınmayanlar aşağıda.

## Bugünkü durum (kodla doğrulandı)

- Kart (`js/ekran-kart.js` `kararKarti`) üç yüzlüdür: nötr yüzde konu, hazır görüş, bağlam şeridi ve son cevap; altında iki kenar düğmesi cevapların adını ve süresini hep gösterir; üst etikette sürüklerken cevabın adı belirir (H1, U2). R2'de kartın altına eşik ipucu, telefonun iş panelinde yanına tam bağlam geldi.
- Karar anı (`js/ekran-an.js`) kendi kartını kurar; iki kenar etiketi cevapların adıdır; 1/2 doğrudan seçer.
- Telefonun iş paneli konuşmada künye, bekleme satırı, kararlar (kart ve yanında bağlam), dosya bağlantısı ve konu listesini alt alta gösterir.

## Kesin kullanıcı kararı (karar 62 olarak yazılır)

Kartta cevaplar görünmez: ne kenarda ne üst etikette. Oyuncu kartı sağa ya da sola kaydırınca (klavyede ←/→) kartın yüzü o cevaba döner; cevabın adı, ne getirdiği ve süresi orada görünür. Eşiği geçip bırakınca uygulanır (bugünkü kural). Bu, H1'in “kenar etiketi önizler” ve U2'nin “üstünde cevabın adı belirir” kararlarının yerine geçer.

## Kapsam

### R2E-0 — başlangıç ölçüsü

`akis-deneme 3 14b 21 27 30`, `okunurluk.py`, `kariyer-deneme` bugünkü kodla; sonuç Sapmalar'ın başına. Kod değişmez.

### R2E-a — kartın yüzü (ortak bileşen; her yerde)

- **Nötr yüz, sade:** üstte künye (“TAHSİN · YARDIMCI ANTRENÖR”; kişisiz kararda işin adı), ortada kararın sorusu büyük yazıyla (işin açıklaması), altında kişinin portresi, adı ve görevi (`js/portre.js`; kişisiz kararda kulübün işareti, TEST). En altta tek küçük satır: son cevap ve cevapsız kalırsa ne olacağı. Bağlam şeridi, hazır görüş ve uyarılar nötr yüzden kalkar.
- **Cevaplar gizli:** iki kenar düğmesi görünmez olur, kartın altındaki ipucu “Cevabı görmek için kartı kaydır (←/→)” der. Üst etiket yalnız künyedir, cevabın adını yazmaz.
- **Hazır görüş:** dosyada ve karar panelinde kartın üstünde, kartın dışında kalır (kişilerin sözü; cevabı söylemez).
- Kart her yerde aynıdır: dosya, karar paneli, telefonun iş paneli, balkondaki tek telefon, maç telefonu (maçta yalnız okunur).

### R2E-b — kaydırınca cevabın yüzü

- Kart eğilmeye başlayınca (bugünkü önizleme katı) yüz o cevaba döner: üstte cevabın simgesi, büyük yazıyla cevabın adı, altında ne getirdiği (seçeneğin açıklaması), süresi, varsa uyarılar (kaçırılacak iş, engel) ve o cevabın bağlam şeridi (görüşmede o günün defteri, bütçede kasa, teklifte künye; U3'ün şeridi). Dosyada “Defter ▸” göz atma bu yüzde kalır.
- **Simge** cevabın türündendir, kodla çizilir; kural katmanı değişmez, ekran kimlikten seçer: kabul, onay, al, yenile, devam, sabır → onay işareti; biz, başka gün, sonraki → takvim; sat → para; reddet, bırak → çarpı; değişim → iki ok; bilinmeyen → nokta.
- **Renk anlam taşımaz:** sol ve sağ aynı kâğıt; yalnız eşik geçilince kart amber kenarlanır (bugünkü “hazır”). Görsellerdeki yeşil/turuncu alınmadı: “doğru cevap” izlenimi verir (H1 kuralı, karar anı başlığı).
- Bırakınca damga (U2) aynen. Önizlemede Esc ya da kartı ortaya bırakmak nötr yüze döner.

### R2E-c — karar anı

- Aynı görünüm: cevaplar gizli, kaydırınca ya da ←/→ ile yüz döner. **1/2 artık doğrudan seçmez, önizler; Enter uygular** (gizli cevabı körlemesine seçtirmemek için; Claude kararı, aşağıda). Süre çubuğu, damga ve cevapsız sonucu aynen.

### R2E-d — telefonun iş paneli tek iş gösterir; “Yeni konu aç”

- **Karar varsa:** panelde yalnız kart (büyük, ortada); yanındaki tam bağlam kutusu kalkar (bağlam artık cevabın yüzünde). “Bu konuda karar dosyada bekliyor” bağlantısı kartın altında.
- **Karar yoksa:** panel sakin: cevap bekleniyorsa tek bekleme satırı; değilse kısa bir boş durum (“Tahsin'e yazmak için Yeni konu aç.”).
- **“Yeni konu aç”** telefonun altında, klavyenin yerinde (görseldeki gibi). Basınca panelde konu menüsü açılır: başlıklı gruplar ve simgeler (bugün Maç, Takım, Görüşme, Kasa; konu sayısı arttıkça gruplar büyür), her satır ad ve tek satır açıklama. Oyuncu konusu seçimi menünün içinde açılır (R2'deki gibi). Esc önce menüyü kapatır. Cevap beklenirken ya da kişinin bekleyen kararı varken düğme kapalı, nedeni altında bir kez.
- Kategori, yazışma konusunun isteğe bağlı `kategori` alanıdır (`js/yazisma.js`, `js/mali-rapor.js`); kural değişmez.
- Bekleyenler (konuşma dışındaki ekranlar), okuma yeri ve oyuncunun dosyasındaki “Hocaya sor ▸” aynen.

### R2E-e — denetimler

- `akis-deneme`: §3 (kenar tıklamasıyla önizleme yerine ←/→ ve sürükleme; kenar adlarının denetimi yerine yüzlerin denetimi; nötr yüzde cevap adı yok), §14b (1/2 önizler, Enter uygular), §21 (kenar yazıları yerine yüzler), §30 (panelin tek iş hâli, Yeni konu aç menüsü, üst etiketin cevap yazmaması), §27 (Esc: menü → konuşma). Yeni denetim: hiçbir kabın görünen yazısında, önizlemeden önce, iki cevabın adı geçmiyor.
- `okunurluk.py`: kart ve menü sahneleri; üç genişlikte eşik.
- `kariyer-deneme`: yalnız `kategori` alanı (her yazışma konusu bir kategoride).

## Yapılmayacaklar

- Serbest mesaj yazmak (“Diğer: serbest mesaj”): oyun yazılanı anlayamaz; hazır konu ilkesi.
- “Alıntıla ve hatırlat”: kişilerin sözlerini tutan hafıza ister; R6'ya not (OLAY_KUTUPHANESI §13'ün R6 satırına bir cümle).
- Çizim portreler ve dış görsel: görsel iş en sona (karar 49); bugünkü portre yer tutucu, çizimler sonra aynı yere oturur.
- Baloncuk menüsü, okundu tikleri, telefonun genel görsel cilası; Canlı Skor (R3); balkonun düzeni (R5).
- Motor dosyaları, kayıt sürümü, ses.

## Claude kararları (belgeye görünür yazılır; itiraz serbest)

- Cevaplar her kartta gizli; ekran okuyucu ←/→ ile önizlenen yüzü bugünkü gibi duyar (kenar düğmeleri kalkar, sekme sırası kart).
- Karar anında 1/2 önizler, Enter uygular.
- Sol ve sağ renkle ayrılmaz; simge cevabın türünü, amber yalnız eşiği gösterir.
- Bağlam nötr yüzde değil, cevabın yüzünde; telefonda yanındaki tam bağlam kalkar.
- Konu menüsü iki katlı değil, başlıklı tek liste (bugün beş konu için tek dokunuş yeter).
- Keşif için kart kendiliğinden kıpırdatılmaz (sakin hareket standardı); kaydırılabildiğini kartın altındaki ipucu satırı söyler.

## Kabul

- `node araclar/hizli.js --hepsi` çıkış 0.
- Motor değişmez: `node araclar/oturum-sonu.js --ayni --seyrek` 40/40, yeni kabul dışı 0; sezon tabanları KAPILAR komutuyla 18/18 birebir.
- `python -X utf8 araclar/akis-deneme.py` tamamı masaüstünde; düşen yalnız defterdekiler.
- `okunurluk.py` eşikte; `kontrol.py`, `akis-2d.py` hatasız; hız bilgi.
- Gerçek ekranda bakılır: nötr yüzde cevap yok, kaydırınca cevabın yüzü okunur, eşik ve damga yerinde (640, 800, 1186 px).

## Belgeler

- **OYUN_TASARIMI** §2 “Tek kart” ve ekran tablosunun telefon satırı.
- **STIL_REHBERI** §7: kartın yüzü, cevabın yüzü, simgeler, panelin tek iş hâli, “Yeni konu aç”.
- **TEKNIK_PLAN** §10 kart sözleşmesi ve R2 paragrafı; §6 yazışma konusunun `kategori` alanı.
- **YOL_HARITASI** karar 62, devam notu, tamamlanan tur; **CLAUDE.md** “Kararlar” ve “Bugün çalışan”; **KAPILAR** tek kart ve telefon satırları; **OLAY_KUTUPHANESI** §13 R6 notu.

## Riskler

- **Keşfedilebilirlik:** yeni oyuncu kartın kaydığını bilmeyebilir. İpucu satırı hep görünür; ilk kartta da aynı.
- **Bilgi kaybı:** cevabın süresi ve kaçırılacak iş artık yalnız önizlemede. Kaçırılacak iş varsa nötr yüzün alt satırı “Cevaplardan biri zaman alır” der (cevabı söylemeden).
- **Testler:** kenar düğmesine dayanan çok denetim var; davranış denetimleri gevşetilmez, yalnız yol değişir.
- **Kartın boyu:** portreli nötr yüz uzar; dar karede panelde kart kaydırmadan görünmeli (B47'nin ölçüsü korunur).

## Tahmin

8–12 saat. Sıra: R2E-0 → R2E-a → R2E-b → R2E-c → R2E-d → R2E-e → belgeler ve kapanış.

## Sapmalar

(boş — uygulama sırasında doldurulur)
