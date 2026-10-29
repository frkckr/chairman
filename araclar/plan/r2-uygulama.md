# R2 — Telefon: iki sütunlu konuşma, geniş tek kart, tek bekleme satırı, oyuncu sorusu (uygulama planı)

Durum: **onaylandı (kullanıcı, 2026-10-29: “Onayla, başla”); uygulama Opus 5.5, masaüstü.** Dal `claude/r2-telefon` (taban `main` 3cbecc4; ilk commit karar 60 belgesi), etiket `tur/r2-telefon`. `main`'e alma ve push kullanıcının sözüyle.

Kaynaklar: kullanıcının inceleme raporunun 2. maddesi (telefon ve mesajlaşma) ve 6. maddesinin bildirim satırı; R programı (karar 56, `r1-uygulama.md` §0); ilkelerin uygulama yönü (karar 60: sakin günün karşılığı bilgi ve ilişki); olay kütüphanesi §13'ün R2 satırı; borç defteri B44, B47, B48, B52.

## Bugünkü durum (kodla doğrulandı, 2026-10-29)

- Telefon odak kabında dar `cihaz` boyunda açılır (`STIL.kagit.odak.boy.cihaz` %44). Konuşmada her şey telefonun içindedir: mesaj akışı, bekleme notu, kararın özeti ve hazır görüşü, “dosyada bekliyor” bağlantısı, konu önerileri; tek kart telefonun altındaki dar cevap alanındadır (`js/ekran-telefon.js` `telefonCiz`).
- 640 px karede kart telefona sığmaz, cevap alanı kayar (B47, B48).
- Cevap beklenirken aynı “Önceki mesajının cevabını bekliyorsun.” engeli her konunun altına ayrı yazılır, konuşmanın sonunda ayrıca “Cevap … civarı” notu çıkar (`js/yazisma.js` `yazismaKonusuEkle` `uygun`, `js/ekran-telefon.js` 345. satır): raporun “üç pasif kutu” tespiti.
- Konuşmayı her açışta telefon en alta kayar (`konusmaAc` → `telAlta`); başka işe gidip dönünce okuma yeri kaybolur. Aynı görünüm yeniden çizilirken yer korunur.
- Bağlam (o günün defteri, kasa, künye) kartın yüzünde tek satır ve “Defter ▸” göz atma bağlantısıyla gelir (U3); tam hâli ayrı göz atma kâğıdındadır.
- Kart sürüklenirken üst etikette cevabın adı belirir, eşikte amber olur (`data-hazir`), bırakınca damga basılır (U2). Dinlenirken nasıl kullanılacağı yazmaz; eşik alanda görünmez.
- Girişim parametre almaz (`girisimBaslat(k, id)`); bir oyuncu hakkında soru sorulamaz. Hocanın oyuncuya bakışı `js/hoca.js` `hocaDegeri`'nde vardır: hocanın bilgisine bağlı kalıcı yanılgı taşır ve on biri o seçer.
- Hocanın görüşme önerisi hafta içi 15:00 olabilir, antrenman 15:00–17:00 (B52).

## Kapsam

### R2-0 — başlangıç ölçüsü

Akış denemesinin telefon bölümleri (3, 16, 21, 24, 27), `okunurluk.py` ve `kariyer-deneme` bugünkü kodla koşar; sonuçlar Sapmalar'ın başına yazılır. Kod değişmez.

### R2-a — iki sütunlu telefon (yalnız odada)

- Yeni odak boyu `telefon`: solda telefon, sağda iş paneli. Başlangıç oranı telefon %42, panel %56; 640, 800 ve 1186 px'te ölçülüp gerekirse değişir. Dar karede de iki sütun kalır; telefon sütunu en az ~17 em.
- `telefonCiz` ikiye ayrılır: **telefon** yalnız konuşmanın kendisini taşır (başlıkta portre, ad ve görev; gün ayraçları, gelen ve giden mesajlar, notlar); **iş paneli** (`telefonIsPaneli`) o kişiyle yapılabilecekleri ve kararları taşır. Sözleşme `js/ekran-telefon.js` başlığında.
- Konuşma dışındaki telefon ekranlarında (ana ekran, Mesajlar, Canlı Skor) sağ panel **Bekleyenler**'dir: cevap bekleyen kararlar (kimden, en geç ne zaman) ve beklenen cevaplar (kimden, yaklaşık ne zaman); satıra dokununca o konuşma açılır. Yeni mesaj, cevap bekleyen karar ve beklenen cevap üç ayrı işaretle ayrılır (raporun 6. maddesi). Böylece telefon açıkken yerleşim zıplamaz.
- Balkonda (iş sağ yarıda, R5) ve maç telefonunda (maçta cevap verilmez) bugünkü tek telefon sürer; ortak çizim iki kipe de hizmet eder.
- Esc zinciri ve ‹ Geri değişmez (konuşma → Mesajlar → ana ekran → masa). Sekme sırası: telefon, sonra panel.

### R2-b — okuma yeri

- Konuşma başına kaydırma yeri oturumda hatırlanır. Konuşma yeniden açılınca o yer geri gelir; o arada yeni mesaj geldiyse ilk yeni mesaja kayar.
- Dosyadan “‹ Mesajlar” ile dönüş, Bekleyenler'den açılış ve masadan yeniden açılış aynı kuralı kullanır.

### R2-c — konular ve tek bekleme satırı

- Konular sağ panelde kısa bir liste: ad ve bir satırlık açıklama (“Son maçı sorarsın; cevap birkaç saat içinde gelir.”). Konu seçmek karar değil menüdür; gerçek kararlar ayrıca tek kartta.
- Cevap beklenirken panelin en üstünde **bir kez, belirgin**: “Şükrü Hoca'dan cevap bekleniyor. Yarın 09:30 civarı.” Konular kapalı görünür, altlarında açıklama tekrarlanmaz. Telefonun akışında giden mesaj durur; ayrıca not çıkmaz.
- Yalnız o konuya özgü engel (“Görüşme ayarlandı: 4 Aralık 11:00.”) o konunun satırında kalır.

### R2-d — tek kart sağ panelde

- Kart sağ panelin genişliğini kullanır (dosyadaki ölçü); hareket alanı geniştir. Fare, dokunma ve klavye aynı davranır (sürükle-bırak ya da ←/→ ve Enter).
- Ortak bileşende (`js/ekran-kart.js`; dosyada da geçerli): dinlenirken tek satır kullanım ipucu; sürüklerken iki yanda eşik çizgisi; eşik geçilince üst etikette “Bırak: <cevap>”. Bırakınca damga (U2) aynen.
- Bağlam kartın yanında, tıklamadan: görüşme önerisinde o günün defteri (dolu saatler, antrenman, önerilen an), mali kararda kasa özeti, oyuncu kararında künye. U3'ün göz atma içerikleri kullanılır; telefonda ayrıca göz atma kâğıdı açılmaz.
- Kararın konusu ve hazır görüş kartın üstünde panelde; “Bu konuda karar dosyada bekliyor” bağlantısı da panelde.

### R2-e — “Oyuncuyu nasıl görüyorsun?” (hoca ve yardımcı antrenör)

- Karar 60'ın ilk somut örneği: sakin günde merak bilgi verir. Oyuncu seçimi sağ panelde (kadro mevkiye göre; yalnız forma, ad, mevki). Oyuncu dosyasında “Hocaya sor ▸” aynı soruyu doğrudan gönderir.
- Cevap birkaç saat sonra gelir, İlerle cevapta durur (bugünkü yazışma kuralı). **Hoca** kendi gözüyle konuşur: `hocaDegeri`'nin kalıcı kısmıyla (günlük fark yok) oyuncuyu mevkisindekiler arasında sıralar; “ilk tercihim”, “rotasyonda”, “şimdilik planımda değil” ve kısa gerekçe (yaş, son haftalar, yorgunluk ya da form izlenimi). Hoca yanılabilir; söylediği seçtiği on birle tutarlıdır. **Yardımcı** rakamla konuşur: bu sezon maç, dakika, gol, son beş maçtaki dakikası, koşu verisinde düşüş varsa o.
- Cevap oyuncu dosyasına tarihli not olarak düşer (`OYUNCU_NOT_KAYNAKLARI`, kaynak “Hoca” ya da “Yardımcı antrenör”). Gizli değer, puan ya da sıra numarası metinde geçmez.
- Kural: `girisimBaslat(k, id, arg)` isteğe bağlı argüman alır; konu `veri(k, arg)` ile soruya oyuncu kimliğini yazar; gelişmenin denetimi oyuncunun varlığını ve o kulüpte olduğunu sınar. Aynı oyuncu için cevap beklenirken ikinci soru yok; başka oyuncu için kişi başına tek bekleyen kuralı sürer.
- Metinler TEST taslağıdır (karar 35 kipi; kullanıcı değiştirir).
- **Kayıt sürümü 11 kalır:** yeni alanlar (girişim kaydında ve gelişmede `oyuncuId`) isteğe bağlıdır, eski kayıtta yoktur; sürüm 10 örnekleri yine geçişle açılır.

### R2-f — küçük düzeltmeler ve borçlar

- B52: görüşme önerisi saatleri 11:00 ve 17:30 (antrenman 15:00–17:00 ile çakışmaz; mesai 18:30'da biter). “Şu gün olsun” kuralı aynen.
- B44'ün telefona dokunan satırlarına (bekleme satırı, görünmez metinler) akış denetimi; dokunulmayanlar defterde kalır.
- B47 ve B48 odada kapanır (kart sağ panelde); maç telefonunda kart yine okumalıktır.

### R2-g — denetimler

- `kariyer-deneme` yeni bölüm: oyuncu sorusu (argümanlı girişim, gelişmenin denetimi, aynı tohumla aynı cevap, kaydet–yükle, hocanın “ilk tercih” dediği oyuncunun hocanın on birinde olması ve “planımda değil” dediğinin olmaması, notun dosyaya düşmesi, hoca değişince yeni hocanın kendi gözü), görüşme saatleri.
- `akis-deneme` yeni §30 “İki sütunlu telefon”: yerleşim (telefon solda, panel sağda, üç genişlikte), Bekleyenler, bekleme tek satır, konunun kapalı oluşu, okuma yeri (dosyaya gidip dönünce, yeni mesajda), kart sağ panelde kaydırmadan görünür ve sürüklenir, eşik ipucu, bağlam kendiliğinden, oyuncu sorusu uçtan uca (sor, İlerle, cevap, dosyada not).
- Mevcut bölümler yeni yerleşime uyar: 3, 21, 27 (telefonun ve kartın yeri), 14b ve 16 (maç telefonu aynen); B47 ve B48'in dar telefon denetimleri odada kesin olur.
- `okunurluk.py` telefon sahneleri yeni yerleşimle; 13 ekran üç genişlikte eşikte kalır.

## Yapılmayacaklar

- Canlı Skor'un yeniden yapımı (R3); bu turda telefonun içinde aynen durur.
- Çok konulu yaşayan görüşme ve kişi gündemi (R6), yeni kişi, kapı sahnesi.
- Balkonun düzeni (R5), maç telefonunun yeniden yapımı.
- Motor dosyaları, kayıt sürümü, ses, görsel tur; yeni içerik ailesi.

## Claude kararları (belgeye görünür yazılır; itiraz serbest)

- İki sütun yalnız odada; balkon ve maç tek telefon.
- Sağ panel telefon açıkken hep vardır: konuşmada kişinin işleri, öbür ekranlarda Bekleyenler. Yerleşim zıplamaz.
- Bekleme satırının tek yeri sağ panelin üstü.
- Bağlam tıklamasız; telefonda göz atma kâğıdı yok.
- Oyuncu sorusunun cevabı hocanın kalıcı görüşünden: seçimiyle tutarlı, yanılabilir; sonraki maçlarla karşılaştırılabilir (raporun “fark et, dosyaya bak, hocaya sor, izlediğinle karşılaştır” akışı).
- Görüşme saatleri 11:00 ve 17:30.
- Kartın eşik ipucu ortak bileşende: dosyada ve karar panelinde de aynı.

## Kabul

- `node araclar/hizli.js --hepsi` çıkış 0; `kariyer-deneme` yeni bölümüyle geçer.
- Motor dosyaları değişmez: `node araclar/oturum-sonu.js --ayni --seyrek` 40/40, yeni kabul dışı 0; sezon tabanları (`sezon-s-t7`, `sezon-s-t3`) 18/18 birebir (görüşme saati değişikliği sezon denemesine girmez; girerse fark Sapmalar'a).
- `python -X utf8 araclar/akis-deneme.py` tamamı masaüstünde: yeni §30 geçer; düşen yalnız defterdekiler; B47 ve B48 kapanır.
- `python -X utf8 araclar/okunurluk.py` 13 ekran üç genişlikte eşikte; telefon görüntüleri incelenir.
- `kontrol.py`, `akis-2d.py` hatasız; hız bütçesi (motor değişmediği için bilgi).
- Belgeler aşağıdaki gibi; `git diff --check`; etiket; `main`'e alma ve push kullanıcının sözüyle.

## Belgeler

- **OYUN_TASARIMI** §2 ekran tablosunda telefon satırı, §10 yazışma (oyuncu sorusu, tek bekleme satırı), §8 görüşme saatleri.
- **STIL_REHBERI** §7: iki sütunlu telefon, Bekleyenler, kartın eşik ipucu, bağlamın yeri.
- **TEKNIK_PLAN** §6 girişim argümanı ve oyuncu konusu, §10 telefonun iki kipi ve okuma yeri.
- **YOL_HARITASI**: karar 61 (R2 Claude kararları), devam notu, tamamlanan tur.
- **CLAUDE.md** “Bugün çalışan”; **KAPILAR** telefon satırları; **BORCLAR** B44, B47, B48, B52 durumları.

## Riskler

- **Testlerin yeri değişir:** telefonun ve kartın seçicileri akış denemesinde çok yerde. Önce başlangıç ölçüsü, sonra bölüm bölüm güncelleme; davranış denetimleri gevşetilmez, yalnız seçici değişir.
- **Dar karede telefon sütunu:** 640 px'te ~260 px'lik telefon. Okunurluk ölçüsü ve görüntüyle oran seçilir; olmazsa dar karede telefon sütunu genişler, panel kayar.
- **Ortak kart bileşeni:** eşik ipucu dosyayı ve karar anını da etkiler; akış 3 ve 14b'nin kart denetimleri yeniden koşar.
- **Oyuncu sorusunun belirlenimciliği:** cevap rastlantı çekmez (hocanın kalıcı görüşü ve kayıttaki sayılar); kayda yalnız cevap anının sayıları girer, metin okunurken kurulur (bugünkü yazışma kuralı).
- **Kapsam kayması:** Bekleyenler paneli küçük tutulur (iki liste); Canlı Skor'a dokunulmaz.

## Tahmin

10–14 saat. Sıra: R2-0 → R2-a ve R2-b (yerleşim) → R2-c → R2-d → R2-e → R2-f → denetimler ve kapanış.

## Sapmalar

(boş — uygulama sırasında doldurulur)
