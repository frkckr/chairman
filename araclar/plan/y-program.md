# Y — Yönetim omurgası programı (2026-10-26 gece, dizüstü)

Durum: **onaylandı (kullanıcı, 2026-10-26 gece: “Y0'a bu planla başla”); Y0 uygulandı (dal `claude/y0-omurga`, etiket `tur/y0-omurga`; §8), `main`'e alma kullanıcının sözüyle.** Kaynak: kullanıcının “Kulüp Başkanlığı Oyunu – Sistem Tasarım Taslağı” PDF'i (26 Ekim 2026, 24 sayfa) ve aynı gün sohbette verdiği kararlar. Bu dosya programın kaydıdır: Y0 belge turunun adımları (bu tur), Y1–Y5 kod turlarının kapsamı (her biri kendi başında ayrıca planlanır ve onaylanır), git sırası ve temizlik. Onaylı kararlar YOL_HARITASI “Geçerli kararlar” 51–52'ye, kurallar ilgili ana belgelere Y0 ile işlenir; bu dosya belge değildir (araclar/plan/OKU.md).

**R4 (2026-10-29; karar 65):** küçültülmüş Y1 uygulandı — şablon motoru ve kıvrım defteri (`js/sablon.js`), pazarlık (`js/pazarlik.js`), transfer alımı zinciri (`js/transfer-alim.js`), serbest havuz ve piyasa (`js/piyasa.js`), mekânlar (`js/mekan.js`), Transfer masası. Satış şablonu, menajer ve satan başkan kişileri, sözleşme, kriz ve kurumsal şablonları R6'dadır.

**R programı (2026-10-29, kullanıcı; YOL_HARITASI karar 56).** Bu programın sırası R revizyon programıyla değişti: önce tek sezon uçtan uca. Y1 küçülerek R4 olur (dosya şablonu motoru, transfer alımının kısa zinciri, pazarlık kartı; ardından kullanıcının oynama denemesi); Y1'in kalanı (kişi modeli, personel slotu), Y2 ve Y3 R6'ya, Y5 R7'ye dağılır; Y4'ün kapsamlı hafta testi kalır ama ilk oynanış değerlendirmesi onu beklemez. Aşağıdaki gövde 2026-10-26'nın kaydıdır; her R turu kendi başında bu gövdeyi kaynak alarak planlanır. Sıra [r1-uygulama.md](r1-uygulama.md) §0'dadır.

**S turu araya girdi (kullanıcı, 2026-10-27; plan `s-uygulama.md`, YOL_HARITASI karar 54).** H2 kapandı (`tur/h2-istekler`); sıra artık S → H3 → Y1. S “Sezonun içi”dir: oyuncunun haftası (kondisyon, form, gelişim, rotasyon), balkon sinyalleri, Dosya'da Kadro sekmesi (§3'teki karar 47 satırının ilk uygulaması), Canlı Skor'da lig ve günlük gazete. Kayıt sürümü S'de 11 olur; zincir S 11 → H3 12 → Y1 13 (§3, §5 ve §6 buna göre düzeltildi). **Gazete artık günlüktür:** her sabah 08:00 masadadır, önceki günün maç ve geçmiş kayıtlarından kurulur, kayda yazılmaz. Bu karar §3'teki “haftalık, Pazartesi” satırının ve “Reddedilenler”deki günlük gazete gerekçesinin yerine geçer. TV, telefonla gelen haber ve gelip konuşanlar sonraki kanallardır; kanal aciliyet sırası OYUN_TASARIMI §6'dadır. S'nin Y2 ve Y3 için hazırladığı zemin o turların bölümlerinde.

## 1. Bağlam

- `main` d31ea81 (`tur/h1-kart` + etiket adı commit'i). Çalışma dalı `claude/h2-istekler` b09feae: H2-0 ve H2-a commit'li ve push'lu, H2-b/c/d/e kalan (`h2-uygulama.md` “Durum”). İkinci ağaç `../chairman-main` `main`'de. `claude/stat-gorsel` dalı uzakta (prototipler). Scratch tabanlar makineye bağlı, depoda değil.
- Bugün çalışan oyun CLAUDE.md “Bugün çalışan”dadır; kod bu turda değişmez.
- PDF'in incelemesi (sohbet, 2026-10-26): beş ilkesi bizim kesin kararlarla örtüşüyor (tek mesele, iki cevaplı tek kart, menüsüz arayüz, puan yok, eylemle ilerleyen zaman). Yeni olan üç şey: beş katmanlı omurga, dosyayı durum makinesi olarak tanımlayan şablon, kişi modeli (gündem, hafıza, gizli tutum). Çelişenler ve kullanıcının cevapları aşağıda.

## 2. Kullanıcı kararları (2026-10-26, sohbet)

1. **Pazarlıkta çark yok.** Ekip iki rakam önerir; kartın sol ve sağ yüzü bu iki rakamdır; karşı tarafın cevabı sonraki kartta gelir. OYUN_TASARIMI §2'nin “başkan rakam girmez” kesin kararı korunur.
2. **TEST kişiler Claude'dan.** PDF'teki kişiler gibi uygun TEST kişilerini (kaptan, asistan, kurul üyesi, gazeteci, menajer) Claude yaratır (karar 33 ve 35 kipi: adlar `js/adlar-test.js` havuzundan, metinler yer tutucu); kullanıcı sonra değiştirir. “Şimdilik test ediyoruz.”
3. **Sezon süresi kısılmaz.** PDF'in “sezon ≈ 10 saat, yayıncı 8–12 bölüm” hedefi alınmadı; süre uzun olsun, eğlence ve olay yoğunluğu belirler, 10 saati geçebilir. Dengeyi Claude kurar: ölçüm hedefi aralık olarak kalır, kota ya da tavan olmaz (§3).
4. **Yardımcı antrenör kalır** (H2-c; hoca değişince kulüpte kalır, TEST).
5. **Sıra:** plan → belgeler, git ve yol haritası (Y0) → çevre temizliği → kod turları. Her tur kendi dalında, planı başında onaylanır (karar 12).

## 3. Claude'un kararları (belgeye görünür yazılır; itiraz serbest)

**PDF'ten alınanlar** (hangi belgeye gideceği §5'te):

- **Beş katman:** dünya → kişiler → dosyalar → kartlar → sonuç. Bugünkü karşılıkları: `PAKETLER`/`GELISMELER` ve takvim (dünya), `k.kisiler` (kişiler), mesele (dosya), `KARAR_TURLERI` + tek kart (kart), `gecmis`/söz/para (sonuç). Oyuncu yalnız kart katmanına dokunur.
- **Dosya şablonu:** her iş bir durum makinesidir: aşamalar (kart / bekleme / devir), bekleme süresi, sahip, karşı taraf, son tarih, geçmiş, kayıp çıkışları. Altı şablon: transfer alımı, transfer satışı, sözleşme yenileme, personel, kriz, kurumsal. Şablon mekanik iskelettir; olay paketi (OLAY_KUTUPHANESI) koşul ve metindir; ikisi birlikte çalışır. Genel amaçlı hikâye motoru kurulmaz (TEKNIK_PLAN §6 sınırı sürer).
- **Kişi modeli:** gündem (ne istiyor; sezon boyunca değişir), hafıza (son kararlar ve verilen sözler; bugünkü söz kaydıyla tek yapı), tutum (gizli; hafızadan türetilir, saklanmaz; asla sayı ya da çubuk olarak gösterilmez; üslupta, kapıyı çalma sıklığında ve getirdiği bilginin kalitesinde görünür), güvenilirlik (konu başına gizli isabet; hocanın `bilgi` alanının genelleşmesi). Dışarıdan kişilerin (menajer, rakip başkan, gazeteci) hafızası kısadır.
- **Çekirdek kişiler ve personel slotu:** üç yönetim koltuğu (sayman, futbol şube sorumlusu, basın sözcüsü; kesin karar, seçilmiş kurul) ayrı, **personel** (çalışan) ayrı. 3. Lig çekirdeği: teknik direktör, yardımcı antrenör, mali işler müdürü (H2), kaptan (oyuncu; rol bayrağı), asistan/genel sekreter, kurul üyesi (üç koltuktan biri gündemli). Lig kademesine göre beklenen slotlar (sportif direktör, basın sözcüsü personeli, altyapı koordinatörü, hukuk müşaviri): erken açmak yatırımdır (maaş kasadan), boş slotun işi başkana ya da yanlış kişiye düşer. 3. Lig'de scout yoktur, hoca kendi bakar (bugünkü “hocanın isteği” akışıyla uyumlu).
- **Delegasyonun üç kalitesi:** devredilen iş iyi / vasat / kötü sonuçla onay kartı olarak döner; kalite personelin o konudaki gizli yeteneğinden; vasat sonuç sonradan gazeteyle sezdirilir. 2.2'nin saymanlı dar örneği bunun ilk hâlidir.
- **Kart sınıfı ve erteleme:** fırsat (ömrü dolunca sessizce kaybolur; gazete yazar), sorun (büyür; bir hafta sonra daha ağır kart), rutin (birikir; asistan uyarır, kurul “takip etmiyor” der), pazarlık (karşı tarafın sabrı düşer; “hâlâ bekliyorum”, sonra kopma). Bugünkü “cevapsız kalma” kuralının (karar 2026-10-02) sınıf bazında tamamlanmış hâlidir; cevapsız sonuç yine kartın yüzünde önceden yazar.
- **Gün ve hafta ritmi (TEST):** gün 08:00–20:00 (transfer döneminde 23:00); 08:00 gazete ve asistan brifingi, 10:00–12:00 antrenman/balkon, 12:00–14:00 kapı, 14:00–18:00 telefon ve dosya, akşam davet. Hafta: Pazartesi maç sonrası kriz günü, Salı–Perşembe iş, Cuma basın toplantısı ve hocanın kadro notu, Cumartesi maç, Pazar boş; gece dünya katmanı çalışır, sabah yeni kartlar. **Gazete haftalık, Pazartesi sabah masada** (bugünkü Cuma gazetesinin yeri değişir; açık karar 47/6 kapanır). *2026-10-27: yerine günlük gazete geçti (S turu, YOL_HARITASI karar 54).* “Günü bitir” yerine bizim İlerle durakları kalır.
- **Balkon:** kartlar balkonda bedavadır (antrenman süresi zaten geçer); ağır kartın (pazarlık, yüz yüze) dikkat bedeli vardır: açıkken antrenman sinyali kaçar. 2.7 ve karar 20 ile aynı yön; görsel yanı (ekranın yarısı) görsel tura kalır.
- **Maç olayından dosyaya eşleme tablosu:** motor olay satırı verir, yönetim tabloyla dosyaya çevirir: sakatlık → kriz dosyası (doktor raporu beklemesi), kırmızı kart → disiplin (kurumsal), üst üste yenilgi → hoca krizi (P12), gencin ilk golü → menajer arar (sözleşme). Bugünkü `MAC_SONUCU_EKLERI` kancası bunun tek örneğidir; tabloya dönüşür.
- **Açık kararlar kapanır (karar 47):** bilgisayar nesnesi yok; **Kadro sekmesi** Dosya'da (oyuncu dosyası: sert veri + kartlardan biriken notlar; çubuk yok); **ziyaretçi odaya gelir** (kapı; ayrı mekân yok; konu listesi açık meselelerle sınırlı, serbest soru telefondan); haftalık ritim ve gazetenin yeri yukarıda; oyuncu satırında yalnız gözlenebilir sayılar. **Rehber** tanışıldıkça büyür (telefon Kişiler; H2-c'nin listesi temel).
- **Genel kurul:** sezon sonunda yıllık güven oyu; dört grubun (kasa, taraftar, soyunma odası, yönetim kurulu) gizli durumundan okunur; dibe vuran grup olağanüstü kurul açar. Güven oyu kaybedilirse **erken seçim** (OYUN_TASARIMI §4'ün açık “erken seçim/görevden alınma” sorusu böyle kapanır). Dört yıllık seçim ve Avrupa finali kesin kararları değişmez; sportif başarı dört grubu dolaylı etkiler.

**Reddedilenler ve gerekçe:**

- **Çark** (kullanıcı kararı 1).
- **Sezon 10 saat kotası ve yayıncı ölçütü** (kullanıcı kararı 3).
- **Anlık kart günde 2–3:** OYUN_TASARIMI §10 “baskıyı süre değil kararın önemi taşır”; anlık kart yalnız doğal yerlerde (canlı yayın, maç günü) ve nadir; günlük kota yok; fitil ve zil görsel/ses turuna.
- **“Yığın hiç tükenmemeli; boş masa uyarıdır”:** bizim kural tersi — sakin dönem iyi yönetimin ödülüdür, boşluk doldurulmaz (§6, §10). Korunur.
- **Dört gizli denge ana veri olarak:** Reigns'in dört çubuğu açıkça reddedilmişti; dört grup yalnız genel kurul için **türetilmiş özettir**, kişi ve grup tutumu asıl kaynak kalır.
- **Günlük gazete, televizyon, ev modu:** günlük gazete her gün içerik ister; gazete haftalık. *2026-10-27: günlük gazete kullanıcı kararıyla alındı; içerik TEST yer tutucusudur, sayı kayıtlardan kurulur (YOL_HARITASI karar 54).* TV ve ev modu PDF'in de dediği gibi havuzda (temel döngü oturduktan sonra; OYUN_TASARIMI §13 açık konu).
- **Kâğıt prototipi:** oda ve tek kart kodlaması H1 ile bitti; şablon oyunda kurulur, kullanıcı oynar (karar 11: kabul sahnesi üretilmez).
- **Portre tepkileri, pano, yığın kalınlığı, fitil:** görsel dil; görsel tura (karar 49). Kural katmanında sabır ve yük metinle ve odanın tek satır özetiyle anlatılır.

**Program ve teknik kararlar:**

- **Sıra:** H2 (kalan: b, c, d, e) → H3 yeni sezon (planlandığı gibi) → **Y1 omurga ve transfer alımı** → **Y2 çekirdek kişiler, kapı, rehber** → **Y3 kalan şablonlar ve hafta ritmi** → **Y4 “Pazartesi” dikey dilimi (2.9)** → **Y5 genel kurul ve dört grup**. *2026-10-27: H2 ile H3 arasına S girdi.* H4 (transfer dalları) ayrı tur olmaz: ikinci teklif, kaçan transfer ve alternatif Y1'in transfer şablonunun doğal çıkışlarıdır; `h4-uygulama.md` Y1 planlanırken kaynak olarak kalır, başına not düşülür. F5 antrenman sahnesi görsel ağırlıklı olduğu için Y'den sonra (karar 49).
- **Kayıt sürümü zinciri:** H2-c 10 → H3 11 → Y1 12 (her biri düz veri geçişi ve önceki sürümün sigorta örnekleri; `ESKI_KAYIT_SINIRI` 8 kalır). H3 planındaki “10” buna göre 11 olur (H3 planlanırken düzeltilir). *2026-10-27: S araya girdi; zincir H2-c 10 → S 11 → H3 12 → Y1 13 (`h3-uygulama.md` “S'den gelenler”).*
- **Sezon süresi dengesi:** OYUN_TASARIMI §6 tablosu kalır (normal sezon 20–35 saat ölçüm hedefi); hafta satırı eklenir: sakin hafta 5–10 dk, olağan 15–25 dk, yoğun hafta 40–60 dk. Süre olay yoğunluğundan çıkar; alt ya da üst sınır değildir. Y4'te ölçülür.
- **Tutum türetilir, saklanmaz** (TEKNIK_PLAN §7 kipi: metin ve yorum kayda yazılmaz, veriden okunur). Hafıza = geçmiş kayıtları + söz kaydı; ayrı defter açılmaz.
- **Kaptan oyuncu kişisi değildir:** kadrodaki bir oyuncuya rol bayrağı; mesaj kaynağı olarak konuşur. Oyuncu moral/ilişki sistemi kurulmaz (G2/H4 sınırı sürer).
- **Y0 belge turu kendi dalında**, `main`'e alınır (kullanıcı sözüyle); H2 dalı `main`'i içine alır ve sürer. Belge değişikliği Pages'e gider, zararsız.

## 4. Y0 — belgeler, git ve yol haritası (bu tur; oyun kodu değişmez)

### 4.1 Git sırası

1. `git fetch --prune --tags`; ağaç temiz; `main` = `origin/main` (d31ea81).
2. Bu plan dosyası bugün `claude/h2-istekler` ağacında izlenmiyor; `git checkout -b claude/y0-omurga main` (izlenmeyen dosya dalı izler). İlk commit: `araclar/plan/y-program.md` + `araclar/plan/OKU.md` satırı.
3. Belge commit'leri (4.2–4.3; dosya başına ya da birkaç dosya birlikte, her commit tek konu).
4. Kontrol (4.5). Etiket `git tag -a tur/y0-omurga` (açıklamalı: PDF incelemesi, kararlar 51–52, Y programı).
5. **Kullanıcının sözüyle:** `main` `../chairman-main` ağacında açık olduğu için ileri sarma orada yapılır: `git -C ../chairman-main merge --ff-only claude/y0-omurga`; ardından `git push origin main tur/y0-omurga`; dal silinir (`git branch -d claude/y0-omurga`).
6. `git checkout claude/h2-istekler && git merge main` (çakışma yalnız YOL_HARITASI devam notunda beklenir: Y0 paragrafı üstte, H2 yarım satırı altta kalır); `h2-uygulama.md` “Durum”a bir satır: Y0 geçti, sıra ve kayıt sürümü zinciri y-program'da; push. H2-b'den sürülür.

### 4.2 Belge değişiklikleri (dosya dosya)

- **OYUN_TASARIMI.md**
  - Başlık notu: son güncelleme Y0.
  - §2 yeni alt bölüm **“Yönetim omurgası: beş katman”** (hedef; bugünkü karşılıkları; oyuncu yalnız kart katmanına dokunur). “Başkanlık kararında iki seçenek” altına **pazarlık kuralı** paragrafı (ekibin iki rakamı; gizli rezervasyon fiyatı ve sabır; karşı tarafın cevabı sonraki kartta; teklif dışı hamleler Kabul/Red kartı; kopma; çark yok — kullanıcı 2026-10-26).
  - §2 yeni alt bölüm **“Dosya şablonları”**: altı şablon, ortak alanlar, bekleme aşamaları pasif değil, delegasyonun üç kalitesi, kart sınıfı × erteleme tablosu (PDF §5, §6, §8'den; bizim cevapsız kuralıyla birleşik).
  - §4: koltuk (3, kesin) ile personel ayrımı; çekirdek kişiler; personel slot modeli (lig kademesine göre beklenen; erken açma; boş slot); **genel kurul** (yıllık güven oyu, olağanüstü kurul, erken seçim) — “erken seçim/görevden alınma koşulları” cümlesi karar olarak güncellenir; seçmen yapısı ve dönem süresi açık kalır.
  - §6: gün yapısı ve hafta ritmi (TEST), gazete Pazartesi, balkonun dikkat bedeli, anlık kartın nadirliği; tempo tablosuna hafta satırı ve “kota ya da tavan değil” notu; PDF'in 10 saat hedefinin alınmadığı (kullanıcı).
  - §9: kaynak güvenilirliği konu başına; sert veri / yumuşak veri ayrımı; **Kadro sekmesi** ve oyuncu dosyası (notlar kartlardan birikir).
  - §10: kişi modeli (gündem, hafıza, tutum, güvenilirlik); rehber; TEST kişiler kararı (kaptan, asistan, kurul üyesi, gazeteci, menajer); dört grup türetilmiş özet; ev modu ve TV havuzda.
  - §11: maç olayından dosyaya eşleme tablosu (hedef; bugünkü kanca).
  - §13 tablo: kapananlar (bilgisayar, Kadro sekmesi, kapı, haftalık ritim ve gazete, oyuncu satırı, erken seçim koşulu) “Karar verildi (2026-10-26)”; yeni açık satırlar: ev modu ve TV, personel maliyet ölçeği ve slot ücretleri, kaynak güvenilirlik değerleri, lig formatı (aynen).
- **TEKNIK_PLAN.md**
  - §3: kayıt sürümü zinciri notu (10 → 11 → 12) ve hedef alanlar: kişide `gundem`, hafıza geçmişten; `kulup.personel` slotları; meselede `sablon`, `asama`, `sahip`, `karsiTaraf`, `sonTarih`.
  - §6: beş katmanın kayıt defterlerine eşlemesi; **dosya şablonu sözleşmesi** (asgari alanlar tablosu: aşamalar, bekleme → `GELISMELER`, devir → `EKIP_GOREVLERI` ve kalite, kart sınıfı, kayıp çıkışları, kapanış); kişi modeli veri kuralı (tutum türetilir); maç olayı → dosya kayıt defteri (`MAC_SONUCU_EKLERI` genelleşir). Alan adları Y1'de kod incelenerek seçilir.
  - §9: genel kurul ve erken seçim; dört grup özeti türetilmiş.
- **YOL_HARITASI.md** (4.3).
- **CLAUDE.md:** “Oyun yönü” — Kararlar maddesine pazarlık kuralı (çark yok, ekibin iki rakamı); yeni madde **“Yönetim omurgası”** (beş katman, altı şablon, kişi modeli; belge OYUN_TASARIMI §2, §4, §10); Program maddesi: sıra H2 → H3 → Y1–Y5 (`araclar/plan/y-program.md`), H4 Y1'e girdi; İçerik maddesi: TEST kişiler istisnası (kaptan, asistan, kurul üyesi, gazeteci, menajer; 2026-10-26). “Bugün çalışan” değişmez.
- **OLAY_KUTUPHANESI.md:** §1'e bir paragraf (paket = şablon + koşul + metin; her paketin şablonu) ve §8 tablosuna “Şablon” sütunu (P01 kriz/kurumsal, P02 kurumsal, P03 kurumsal, P04 kurumsal, P05 kurumsal, P06 kurumsal, P07 satış, P08 personel, P09 alım, P10 kriz, P11 kurumsal, P12 personel, P13 rutin/kriz, P14 kurumsal).
- **STIL_REHBERI.md §7:** tek not — kapı/ziyaretçi sahnesi karar olarak odada; görsel düzeni görsel turda; kart sınıfının görünür izi (damga, sararma) görsel turda.
- **araclar/plan/:** `OKU.md` (Y programı satırı; H4'ün durumu); `h-program.md` durum notu (H4 Y1'e girdi; H3 sürüm 11); `h4-uygulama.md` başına not (ayrı tur değil; Y1 kaynağı); `f-program.md` durum notu (F4 H1 ile yapıldı; F5 Y'den sonra; F6-b 2.9 = Y4); `ui-mimari-ve-gorsel-yon.md` §4 (kapanan kararlar, 2026-10-26); `h2-uygulama.md`'ye dokunulmaz (H2 dalında, 4.1 adım 6).

### 4.3 Yol haritası

- “Şu an neredeyiz” program paragrafı: Y serisi ve H4'ün durumu; devam notu yeniden yazılır (Y0 yapıldı; sıradaki H2-b; makine durumu boşta; H2 dalı `main`'i aldı).
- **Karar 51 — yönetim omurgası (kullanıcı ve Claude, 2026-10-26):** PDF incelemesi; alınanlar, reddedilenler, dört kullanıcı cevabı (§2), Claude kararları (§3). **Karar 52 — program (kullanıcı):** sıra H2 → H3 → Y1–Y5; H4 Y1'e; kayıt sürümü zinciri; Y0 belge turu.
- Aşama eşlemesi (F eşlemesi kalıbıyla “Y eşlemesi”): 2.9 → Y4; 4.2 kalan ve 4.3 → Y1; 4.4 sponsor → Y3 (kurumsal şablonun ilk örneği, tutarlar TEST); 4.5 yetki devri → Y1 (şablonun devir aşaması) ve Y2; 5.4 medya/taraftar → Y3 kısmen, Y5; Aşama 6 seçim kuralları → Y5 genel kurul (seçim sahnesi Aşama 6'da kalır); 7.1 ilişki/hafıza → Y1–Y2 temeli; 8.4 büyüme → Y1 slot modeli temeli.
- “Açık kararların takibi”: kapananlar ve yeni açıklar.
- “Silinen dosyalar” tablosu: bu turda silme yok.

### 4.4 Temizlik

- `../chairman-main` ağacı `main`'in kendisidir; 4.1 adım 5'te ileri sarılır. `git worktree list` iki geçerli ağaç gösteriyor, budanacak kayıt yok.
- Uzak dallar: `claude/h2-istekler` sürer; `claude/stat-gorsel` kalır (h-program sorusu 1'in cevabı: prototipler `main`'e alınmaz, görsel tura kadar dalda).
- Scratch: H2-0'ın tabanları (`h2-oturum-taban.txt`, `h2-sezon-*.json`) makineye bağlıdır; H2-b başında H2-0'daki komutlarla bu makinede yeniden üretilir.
- `araclar/plan/` dosya sayısı artıyor; kapanmış turların planları silinmez (OKU.md kuralı: silmek serbest, git'te kalır) — bu turda dokunulmaz.
- Bellek (Claude): omurga kararlarının kısa notu oturum sonunda.

### 4.5 Kontrol ve kapanış (yalnız belge değişikliği)

- Yerel bağlantılar: değişen belgelerdeki dosya bağlantıları ve başlık çapaları (küçük denetim betiği scratch'te).
- Mevcut durum ile hedef ayrımı: yeni bölümlerde “hedef / bugünkü uygulama” etiketi; H2'nin yarım işleri “bugün çalışan” sayılmaz.
- Belgeler arası tutarlılık: karar numaraları 51–52, tarihler, Y1–Y5 adları, kayıt sürümü zinciri aynı.
- `git diff --check`. Tarayıcı ve maç denemesi gerekmez (kod değişmedi).

## 5. Kod turları (her biri kendi `yN-uygulama.md` planıyla, başında onay)

| Tur | Dal / etiket | Konu | Kayıt sürümü | Tahmin |
|---|---|---|---|---|
| H2 (kalan) | `claude/h2-istekler` / `tur/h2-istekler` | H2-b Canlı Skor, H2-c kişiler ve yazışma, H2-d mali rapor, H2-e kapanış (`h2-uygulama.md`) | 10 | 8–10 sa |
| S (araya girdi, 2026-10-27) | `claude/s-sezon-ici` / `tur/s-sezon-ici` | oyuncunun haftası, balkon sinyalleri, Kadro sekmesi, Canlı Skor'da lig, günlük gazete (`s-uygulama.md`) | 11 | 22–27 sa (dizüstü) |
| H3 | `claude/h3-yeni-sezon` / `tur/h3-sezon` | yeni sezon ve sezon geçişi, kayıpsız arşiv (`h3-uygulama.md`; sürüm 12, “S'den gelenler” notu) | 12 | 6–8 sa |
| Y1 | `claude/y1-omurga` / `tur/y1-omurga` | kişi modeli, personel slotu, dosya şablonu motoru, kart sınıfı, pazarlık kartı; ilk şablon transfer alımı (H4 dalları içinde) | 13 | 12–16 sa |
| Y2 | `claude/y2-kisiler` / `tur/y2-kisiler` | TEST kişiler (kaptan, asistan, kurul üyesi, gazeteci, menajer), kapı görüşmesi, rehber, delegasyon kalitesi | 13 | 8–10 sa |
| Y3 | `claude/y3-sablonlar` / `tur/y3-sablonlar` | satış, sözleşme, personel (P12 şablona), kriz, kurumsal (sponsor ilk örnek) şablonları; hafta ritmi; balkon dikkat bedeli; maç olayı tablosu | 13 (+1 gerekirse) | 10–14 sa |
| Y4 | `claude/y4-pazartesi` / `tur/y4-pazartesi` | 2.9: PDF test senaryosu 1'in TEST uyarlaması, bir haftalık dikey dilim, tempo ölçümü, kullanıcı oynar | — | 6–8 sa + kullanıcı |
| Y5 | `claude/y5-genel-kurul` / `tur/y5-genel-kurul` | dört grup özeti, yıllık genel kurul güven oyu, olağanüstü kurul, erken seçim sonucu (TEST) | +1 | 6–8 sa |

Kesilme kuralı h-program'daki gibi: kabul koşullarını geçmeyen tur `main`'e alınmaz; uzayan turun kalanı devam notuna yazılır.

### Y1 — Omurga ve transfer alımı (kapsam özeti)

- **Kişi modeli:** `gundem` (liste; tür, hedef, şiddet; sezon içinde değişir), hafıza okuması (geçmiş kayıtları + sözler; saf işlev), tutum (`tutumDegeri`, saf, gösterilmez; üslup seçimi ve kapı sıklığında kullanılır), güvenilirlik (konu başına gizli isabet; `hoca.bilgi` özel hâli). TEST kutusu dışında hiçbir ekranda sayı yok.
- **Personel slotu:** `kulup.personel` {rol → kisiId}; lig kademesine göre beklenen roller TEST tablosu; slot açma kararı tek kart (maaş kasadan; G2 sözleşmesi personele uzar); H2-c'nin yardımcı ve müdürü slota oturur; boş slotun işi başkana düşer (şablonun devir aşamasında sahip yoksa).
- **Dosya şablonu motoru:** `SABLONLAR` kayıt defteri (ad geçici): aşamalar `{ad, tur:'kart'|'bekleme'|'devir', sure, kartSinifi, cikislar}`; mesele kaydına `sablon`, `asama`, `sahip`, `karsiTaraf`, `sonTarih`; bekleme → mevcut `GELISMELER`, devir → mevcut `EKIP_GOREVLERI` + kalite (iyi/vasat/kötü), kart → mevcut `KARAR_TURLERI`; kayıp çıkışları (rakip kaptı, oyuncu reddetti, süre doldu, pazarlık koptu, sağlık kötü) her aşamadan.
- **Kart sınıfı ve erteleme:** fırsat / sorun / rutin / pazarlık; cevapsız davranışı sınıfa göre; dosyada görünür (metin).
- **Pazarlık kartı:** ekibin iki rakamı (kim öneriyor: sportif direktör yoksa hoca ya da mali müdür, konuya göre); karşı tarafın gizli rezervasyon fiyatı ve sabrı; tepki sonraki kartta; teklif dışı hamleler Kabul/Red; kopma; ipuçları kişilerden (“borçlular, satmak zorundalar”).
- **Transfer alımı şablonu (8 aşama):** ihtiyaç (hocanın isteği ya da başkanın girişimi) → araştırma (bekleme 2–5 gün) → aday seçimi (iki aday, kart; kaynak güvenilirliği) → temas (bekleme; dünya: rakip ilgisi) → kulüp pazarlığı (zincir) → oyuncu pazarlığı (maaş; menajer kişisi Y2'de, Y1'de “oyuncu tarafı”) → sağlık (bekleme 1 gün; kayıp çıkışı) → imza. G2'nin sorunsuz yolu şablonun en kısa yolu; H4'ün ikinci teklif / kaçan transfer / alternatif dalları doğal çıkışlar; dönem başına tekrar sınırı.
- **Maç olayı → dosya tablosu:** kayıt defteri; Y1'de yalnız tablo ve P12 tetikleyicisi (üst üste yenilgi), öbür satırlar Y3.
- **Araçlar:** `kariyer-deneme` yeni bölümler (şablon motoru, kart sınıfı, pazarlık, transfer 8 aşama ve kayıp çıkışları, personel slotu, kişi modeli), `sezon-deneme` dal ve rapor sayaçları, `akis-deneme` kart sınıfı ve pazarlık kartı; sürüm 12 sigorta örnekleri H3 koduyla üretilir.
- **Yapılmayacaklar:** yeni ekran, görsel dil, menajer kişisi (Y2), oyuncu moral/ilişki, AI kulüpler arası transfer, motor, ses, puan.

### Y2 — Çekirdek kişiler, kapı, rehber

- TEST kişiler (Claude, karar 33/35 kipi): kaptan (kadrodaki oyuncuya rol bayrağı; soyunma odası sinyali ve kendi sözleşmesi gündemi), asistan/genel sekreter (sabah brifingi = İlerle özeti kişinin ağzından; biriken rutin uyarısı; hiçbir şey istemez), kurul üyesi (üç koltuktan biri gündemli: “kendi adamı”, nüfuz), gazeteci (yerel gazete; Cuma basın kartı; canlı yayın anlık kartı nadir), menajer (oyuncu pazarlığının karşı tarafı; rehbere girer; kısa hafıza).
- Kapı: ziyaretçi odaya gelir; yüz yüze kart zinciri (60 dk TEST); ajandadan randevu (H2-c'nin görüşme isteği kabul edilince kapı sahnesi); görsel yer tutucu (kart ve metin; portre yok).
- Rehber: telefon Kişiler listesi tanışıldıkça büyür; “Ara” yalnız rehberdekilere.
- Delegasyon kalitesi genel kural: şablonun devir aşaması personelin konu yeteneğinden üç sonuç; onay kartı.
- **S'nin zemini (2026-10-27):** gazeteci ve basın kartının haberleri yeni kanal açmadan `GAZETE_KAYNAKLARI`'na (`js/soz.js`; sayıyı `js/gazete.js` kurar) kaynak olarak girer. Kaptanın ve kapıdaki görüşmelerin bir oyuncuya dair sözleri `OYUNCU_NOT_KAYNAKLARI` (`js/kadro-dosyasi.js`) ile oyuncu dosyasına kaynaklı, tarihli not düşer; hocanın “Takım ne durumda?” notu emsaldir. Kanal sırasında kapı yüz yüzedir (OYUN_TASARIMI §6).
- Yapılmayacaklar: kapı sahnesinin görsel düzeni, ev modu, TV.

### Y3 — Kalan şablonlar ve hafta ritmi

- Şablonlar: satış (gelen teklif → “hocaya nasıl söylerim” → pazarlık), sözleşme yenileme (bitişe 6 ay kala ve sezon sonu; maaş pazarlığı), personel (P12 şablona taşınır; istifa, kovma, kurul baskısı; aday görüşmesi), kriz (soyunma odası, basın, taraftar; yüz yüze görüşme kritik kart), kurumsal (sponsor ilk örnek — 4.4 TEST tutarlar; federasyon yazısı; kurul oylaması).
- Hafta ritmi (TEST): Pazartesi brifing (gazete S'den beri her sabah 08:00); Cuma basın toplantısı kartı + hocanın kadro notu; Pazar boş; gece gelişmeleri 08:00'e; gün 20:00 (transfer döneminde 23:00).
- Balkon dikkat bedeli (kural); anlık kart kuralı (nadir, süre §10).
- Maç olayı → dosya tablosunun kalan satırları (sakatlık, kırmızı, gencin ilk golü).
- **S'nin zemini (2026-10-27):** balkon sinyalleri `GOZLEM_SINYALLERI` (`js/gozlem.js`; çekirdek türler `js/oyuncu-hafta.js`) bugün yalnız oyuncu dosyasına not düşer; sinyalden açılan kart Y3'te bu kayıt defterinden kurulur. Maç olayları (gol, kart, sakatlık, on birde olmayış) oyuncu dosyasında not olarak durur (`OYUNCU_NOT_KAYNAKLARI` maç kaynağı); tablonun kalan satırları aynı olayları okur. Hafta ritminin antrenman günleri (maç ertesi toparlanma, hafta ortası yoğun, maç öncesi hafif) S-a'da kuruldu (`antrenmanProgrami`). Balkonun dikkat bedeli (ağır kartta sinyalin kaçması) S'de yoktur; Y3'te kurulurken S'nin “izlemeyen bir şey kaybetmez” kullanıcı kararıyla bağdaştırılır (kaçan sinyal yalnız bilgidir; oyuncu, maç ve hocanın seçimi değişmez).

### Y4 — “Pazartesi” dikey dilimi (2.9)

- PDF 12b'nin TEST uyarlaması: 3. Lig, deplasmanda yenilgi, üst üste üçüncü, kasa dar, hoca ikinci sezonunda; 13 kart, bir hafta oynanır (Pazartesi'den Pazar'a). Kişi adları ve metinler TEST (kullanıcı değiştirir).
- Ölçüm: gerçek süre, kart sayısı, ertelenen kart, balkona sığan kart sayısı, oyuncunun “ne oldu” sorusu (pano işini yapıyor mu → odanın özeti); 2.9'un bitiş ölçütleri. Kullanıcı oynar, notlar sohbette.

### Y5 — Genel kurul ve dört grup

- Dört grup özeti (kasa, taraftar, soyunma odası, yönetim kurulu) kişi ve grup tutumundan türetilir; gizli; sinyali odada metinle (asistan, kaptan mesajı, gazete manşeti, kurul daveti).
- Yıllık genel kurul (sezon sonu) güven oyu kart zinciri; olağanüstü kurul koşulu; kaybedilirse erken seçim sonucu TEST kaydı (seçim sahnesi Aşama 6'da); “miras” özeti.

## 6. Riskler

- **Belge şişmesi:** Y0 çok bölüm ekler; her bölüm “hedef” etiketli ve kısa tutulur, PDF'in metni kopyalanmaz, kararın ayrıntısı tek belgede.
- **H2 ile çakışma:** Y0 `main`'e girince H2 dalı `main`'i alır; çakışma yalnız devam notu ve plan notlarında beklenir. H2'nin kapsamı değişmez (Kadro sekmesi, kapı sahnesi Y'de).
- **Şablon motoru genel hikâye motoruna kayar:** sınır TEKNIK_PLAN §6; aşama türü üç (kart, bekleme, devir), ilkel sayısı küçük; şablon içeriği olay paketinde.
- **İçerik kuralı:** Y2'nin kişileri ve metinleri TEST (kullanıcı kararı 2); kullanıcı metinleri değiştirir; yeni kulüp adı ya da gerçek kişi yok.
- **Kayıt sürümü her turda artıyor** (H2 10, S 11, H3 12, Y1 13): her tur önceki sürümün örneklerini kod değişmeden üretir (H2-0 emsali).
- **Tempo:** sezon süresi kotasız; Y4 ölçer, dengeyi olay yoğunluğuyla kurar; sakin dönem korunur.

## 7. Açık kalanlar (kullanıcıya; bloklamaz)

- Lig formatı (karar 36; H3 TEST tarifiyle sürer).
- Ev modu ve TV: havuz; ne zaman açılacağı Y4'ten sonra.
- Personel maliyet ölçeği ve slot ücretleri: Y1'de TEST tutarlar.
- Kapı sahnesinde konu listesi: açık meselelerle sınırlı (Claude kararı); kullanıcı serbest bırakabilir.
- `tur/y0-omurga` `main`'e alınıp push edilsin mi (yalnız belgeler Pages'e gider).

## 8. Uygulama kaydı (Y0, 2026-10-26 gece, dizüstü)

- **Commit'ler** (`claude/y0-omurga`, taban `main` d31ea81): plan ve OKU.md satırı; OYUN_TASARIMI; TEKNIK_PLAN; YOL_HARITASI; CLAUDE.md, OLAY_KUTUPHANESI ve STIL_REHBERI; plan dizininin durum notları; bu kayıt. Oyun kodu, araçlar ve tabanlar değişmedi.
- **Denetim:** değişen 13 belgedeki dosya bağlantıları ve başlık çapaları tutuyor (yeni bölüm çapaları dahil: `#yönetim-omurgası-beş-katman`, `#dosya-şablonları`, `#personel-ve-çekirdek-kişiler`, `#genel-kurul-ve-güven-oyu`, `#gün-ve-hafta-ritmi`, `#kişi-modeli`); `git diff --check main` temiz. Tarayıcı ve maç denemesi gerekmedi (CLAUDE.md “Yalnız belge değişikliği”).
- **Sapmalar:** (1) H2'nin yarım durumu `main`'in devam notuna da yazıldı (planda yalnız H2 dalına bir satırdı): H2 dalı `main`'i alırken devam notundaki çakışma `main`'in sürümüyle çözülebilsin. (2) Y eşlemesi YOL_HARITASI'nda F eşlemesinin hemen altında (Aşama 3 başında) durur; bütün aşamaları kapsar. (3) `h2-uygulama.md` yalnız H2 dalında olduğu için Y0 ona dokunmadı (planla aynı). (4) `main` öbür ağaçta açık olduğu için 4.1 adım 5'in ileri sarma komutu düzeltildi.
- **Kalan (kullanıcının sözüyle):** `main`'e alma ve push (4.1 adım 5), H2 dalının `main`'i alması (adım 6), sonra H2-b.
