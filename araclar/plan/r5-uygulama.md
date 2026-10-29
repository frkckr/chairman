# R5 — Balkon: sağda çalışma alanı, kadronun kendisi, hocanın programına göre gruplar (uygulama planı)

Durum: **uygulandı ve kapandı (2026-10-30, `tur/r5-balkon`); oto modda planlandı ve uygulandı (kullanıcı, 2026-10-29 gece: “r4'ü bitir, main'e push yap, sonra r5 planla önce, sonra planını uygula, main'e al, push yap …; sabaha kadar oto modda sırasıyla kendin yap”).** Kullanıcı uyurken verilen bu toplu izin R5'in planını ve uygulamasını kapsar; plan yine turun başında yazılır (karar 12) ve sabah kullanıcının incelemesine açıktır. Uygulama Opus 5.5, masaüstü. Dal `claude/r5-balkon` (taban R4'ün `main`'e alındığı commit), etiket `tur/r5-balkon`. `main`'e alma bu oto mod isteğinde kullanıcının sözüyle (büyük kapıdan sonra).

Kaynaklar: R programı (YOL_HARITASI karar 56): “R5 balkon — sağ çalışma alanı, kadro bağlantısı, hocanın programına göre grup düzeni, TEST ‘her saat antrenman’ anahtarı” (kullanıcının inceleme raporunun 5–6. sıraları, çalışma çeşitleri hariç); borç defteri B44'ün son maddesi (gözlemde rozet); OYUN_TASARIMI §6 “Balkon” ve S-a/S-b'nin bugünkü uygulaması; [OYUN_TASARIMI §1](../../OYUN_TASARIMI.md#başkanlık-deneyiminin-temel-ilkeleri) 1. ilke (sakin günün karşılığı bilgi ve ilişkidir).

## Bugünkü durum (kodla doğrulandı, 2026-10-29)

- **Balkonda iş sağ yarıda (U6) çalışıyor:** geniş karede bütün işler sağ yarıda açılır, saha solda görünür; dar karede (oyun karesi ≤ 820 px) iş bilerek neredeyse tam genişlikte açılır (R1-f okunurluk). Sağ alanda işten bağımsız bir “çalışma” yüzü yok: gözlem şeridi solda küçük kâğıttır ve iş açılınca perdenin arkasında kalır.
- **Antrenman sahnesi kariyerden kopuk.** `js/balkon.js` oyuncuları `KADROLAR.demirkapi`'nin dosyadaki ilk kadrosundan bir kez kurar: transferle gelen, ayrılan, sakat ya da cezalı oyuncu sahada değişmez; üç grup (ısınma koşusu 6, pas çemberi 6, şut 4 + kaleci) her gün aynıdır.
- **Hocanın programı sahnede görünmez.** `antrenmanProgrami(k, kulüp, tarih)` (`js/oyuncu-hafta.js`) günün türünü verir (toparlanma, yoğun, hafif, dinlenme, maç); şerit yalnız TEST olarak “günün türü” yazar.
- **Gözlem şeridi** solda küçük kâğıt: “Saha boş / İzliyorsun / Gözlem durdu”, son görülen tek sinyal, “n not oyuncuların dosyasına düştü”. Sinyalden oyuncunun dosyasına bağlantı yok.
- **Antrenman penceresi** hafta içi 15:00–17:00 (TEST; `ANTRENMAN_SAATI`); dışında saha boş.
- **B44'ün kalan maddesi:** gözlem sürerken gelen cevapta telefonun rozeti (H2-e) otomatik denetimsiz.

## Kapsam

### R5-a — sağda çalışma alanı (ekran)

- Bugünkü sağ yarı (U6) korunur; dar karede iş yine geniş açılır, saha arkada kalır (okunurluk önce).
- **Antrenman kâğıdı** (sağ alanın üstünde, iş açık değilken): günün türü (“Bugün yoğun çalışma” — artık TEST değil, hocanın programı gözlenebilir bilgidir), saat ve durum (saha boş, antrenman 15:00'te, sürüyor, izliyorsun · kalan), Gözlemi başlat / bırak / devam et, **Gördüklerin**: bugün görülen bütün sinyaller (yalnız sonuncusu değil), her biri oyuncunun adıyla; ada dokununca oyuncunun dosyası sağda açılır (R5-b).
- Kural değişmez: gözlem, sinyaller, kısa işin gözlemin içinde geçmesi aynıdır.

### R5-b — kadronun kendisi (okuma + çizim)

- Yeni saf okuma `antrenmanDuzeni(k, tarih)` (`js/gozlem.js`; kural katmanı, çizim yok): başkanın kulübünün o günkü kadrosundan gruplar — `{tur, gruplar:[{ad, etkinlik, oyuncular:[id]}], ayri:[id], kenar:[id]}`. Sakat oyuncu sahada yoktur; dönüşüne üç gün kalan sakat “ayrı koşu”dadır (fizyoterapistle); cezalı oyuncu takımla çalışır. Belirlenimci (tarihten tohumlu sıra), kayda yazmaz, rastlantı akışı çekmez.
- `js/balkon.js` figürleri bu düzene göre kurar ve günü değişince yeniden dağıtır: oyuncu kadrodaki görünüşüyle (görünüşü olmayan TEST oyuncusu için kimlikten türetilmiş görünüş); figür havuzu bir kez kurulur, oyuncuya atanır (en çok 22 + kaleci + ekip). Transferle gelen oyuncu ertesi antrenmanda sahadadır.

### R5-c — hocanın programına göre grup düzeni (çizim)

- **Yoğun:** pas çemberi, şut çalışması, ısınma koşusu (bugünkü üç grup) + iki kaleci.
- **Toparlanma (maç ertesi):** son maçta 60 dakikadan çok oynayanlar yavaş koşu ve esneme (yerde, hafif pozlar); öbürleri pas çemberi ve şut.
- **Hafif (maç arifesi):** duran top (şut çalışması korner noktasından), kısa pas çemberi; koşu yok.
- **Dinlenme ve maç günü:** saha boş (bugünkü gibi).
- Ayrı koşu: dönüşe yakın sakat oyuncu fizyoterapistle kenarda yavaş koşar. Ekipte fizyoterapist bir figür daha.
- Görsel iş en sonda (karar 49): yeni çizim yalnız mevcut pozlardan; yeni hareket eğrisi ya da figür biçimi yok.

### R5-d — TEST “Her saat antrenman” anahtarı (görüntü)

- Ayarlar › Geliştirici: **“Balkonda her saat antrenman (TEST)”**. Açıkken balkonda saha her saat ve her gün o günün düzeniyle doludur (maç günü ve dinlenme günü dahil; dinlenme gününde yoğun düzen). **Yalnız görüntüdür:** gözlem, sinyal ve kurallar antrenman penceresine bağlı kalır (kariyer ayara bağlı olamaz; belirlenim). Şerit bunu söyler (“TEST: görüntü; gözlem yalnız antrenman saatinde”). Tarayıcı ayarında durur, kayda girmez; yayından önce kalkar.

### R5-e — gözlemde telefonun rozeti (B44 son maddesi)

- Akış denetimi: gözlem sürerken yazışma cevabı gelince gözlem kesilmez ve balkondaki telefon düğmesinde rozet belirir; telefon açılıp okununca kalkar. B44 kapanır.

### R5-f — denetimler (karar 63; motor dosyası değişmez)

- `node araclar/hizli.js` (ad denetimi, `kariyer-deneme`).
- `kariyer-deneme` yeni bölüm: `antrenmanDuzeni` saf ve belirlenimci; bütün günler için kadronun her uygun oyuncusu tam bir grupta; sakat sahada yok, dönüşe yakın ayrı; toparlanmada çok oynayanlar esnemede; transferle gelen oyuncu ertesi gün düzende; eski kayıtta çalışır.
- `akis-deneme` yeni **§34 Balkon** (sağ yarı: dosya ve Transfer masası balkonda yarım genişlikte, saha görünür; antrenman kâğıdı: günün türü, Gördüklerin listesi, sinyalden oyuncu dosyası; TEST anahtarı: saha dolu ama gözlem düğmesi pencere dışında yok; gözlemde rozet). Etkilenenler: 7 (balkon), 16, 27 (Esc), 30.
- `okunurluk.py` yeni sahneler: balkon (antrenman kâğıdı), balkonda dosya.
- `kontrol.py` (balkon görüntüsü) ve `akis-2d.py` değişmeyen 2D için çalışır; figür çizim kodu (`js/animasyon.js`, `js/oyuncular.js`) değişmediği için animasyon ölçümü gerekmez.
- Kural dosyası değiştiği için tek sezon tabanı t7 ve t3 (birebir beklenir: düzen saf okumadır).

## Yapılmayacaklar (R5)

- Yeni antrenman çalışmaları (altı çalışma çeşidi; görsel tur, karar 49), sinyalden kart (“Doktora sorayım mı?”, Y3), ağır kartların dikkat bedeli, balkonda kişi gelmesi, mekân sahneleri.
- Antrenman saatlerinin değişmesi (S kararı: 15:00–17:00), her saat gerçek antrenman (karar 56: yalnız TEST görüntü anahtarı).

## Claude kararları (belgeye görünür yazılır; itiraz serbest)

- **Günün türü artık TEST değil:** hocanın haftalık programı sahada gözlenebilir; kâğıtta düz yazı.
- **Düzen saf okumadır, kayda girmez;** figürler yalnız onu çizer. Sinyaller ve gözlem değişmez.
- **TEST anahtarı yalnız görüntüdür;** kurallar tarayıcı ayarına bağlanmaz.
- **Dar karede balkonda iş geniş açılır** (okunurluk eşiği önce).

## Kabul

- `hizli` çıkış 0; `kariyer-deneme` yeni bölümle geçer; sezon t3 ve t7 18/18 birebir (`--ayni`).
- `akis-deneme` 7, 16, 27, 30, 34 geçer; `okunurluk.py` eşikte; `kontrol.py` balkon görüntüsü incelenir.
- Balkonda dosya ve Transfer masası sağ yarıda, saha solda canlı.

## Belgeler

- **OYUN_TASARIMI** §6 “Balkon” (bugünkü uygulama R5), **STIL_REHBERI** §7 (balkonda sağ yarı, antrenman kâğıdı), **TEKNIK_PLAN** (`antrenmanDuzeni`, balkon düzeni), **YOL_HARITASI** karar ve devam notu, **CLAUDE.md** “Bugün çalışan”, **KAPILAR** balkon satırı, **BORCLAR** B44 kapanışı.

## Riskler

- **Balkon figür sayısı:** 22 oyuncu + 2 kaleci + 4 ekip; bugün 17 + 3. Kare hızı balkonda ölçülür (`kontrol.py` süresi); gerekirse ayrı koşu ve esneme gruplarında figür sayısı sınırlanır.
- **Görünüşü olmayan TEST oyuncuları:** kimlikten türetilmiş görünüş (belirlenimci); yeni görsel dil değildir.
- **Yarım odakta okunurluk:** 800 px karede yarım kap dar kalabilir; eşik okunurluk ölçüsüyle; tutmazsa o genişlikte geniş açılır.

## Tahmin

6–9 saat. Sıra: a (sağ alan, kâğıt) → b (düzen okuması, figür havuzu) → c (gruplar) → d (TEST anahtarı) → e (rozet denetimi) → f (denetimler, belgeler).

## Sapmalar

1. **Bugünkü durumun ilk tespiti düzeltildi:** “sağ yarı yalnız telefonda” yanlıştı — geniş karede bütün işler balkonda sağ yarıda açılıyordu; 800 px pencerede (640 px kare) dar kare kuralı (R1-f) işi bilerek geniş açar. R5-a bu yüzden yalnız antrenman kâğıdıdır.
2. **Rondonun ortasındaki yelek kalktı:** figürler oyuncu kimliğiyle havuzdan kurulur (formanın rengi günlük değişmez).
3. **“Gördüklerin”** bugünün kapanmış gözlem kayıtlarındaki sinyalleri ve açık aralığın görülmüş sinyallerini birlikte gösterir (yalnız sonuncusu değil; S-b'nin “yalnız son” inceleme kararı kâğıt büyüdüğü için kalktı; kâğıt uzarsa kayar).
4. **Toparlanmada önceki maç yoksa** (kariyerin ilk haftası) herkes pas çemberi ve şuttadır; grup sınırını aşanlar esnemeye gider (hafif gün dahil).
5. **TEST anahtarı** dinlenme ve maç gününde de yoğun düzeni gösterir; kâğıtta “yalnız görüntü” notu TEST kutusunda.
6. **Akış §34'te** cevabın anı test kurgusuyla gözlemin içine alındı: hocanın cevabı mesai gecikmesiyle çoğu zaman gözlemin bitişinden sonraya düşüyor; kural (cevap gözlemi kesmez) aynı.
7. Kare süresi (`kontrol.py`, odada) ortanca 1,4 ms; balkonda figür sayısı 20 + kaleciler + 4 ekip.

**Denetim sonuçları:** `kariyer-deneme` R5 bölümüyle geçti; sezon t3 ve t7 18/18 birebir (`--ayni`); `akis-deneme` 7, 12, 16, 23, 27, 30, 34 geçti; `okunurluk.py` balkon ve balkon-dosya üç genişlikte eşikte; `kontrol.py` geçti; motor dosyası değişmedi.
