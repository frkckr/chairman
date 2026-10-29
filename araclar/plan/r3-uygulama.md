# R3 — Canlı Skor: tarafsız lig uygulaması (uygulama planı)

Durum: **onaylandı (kullanıcı, 2026-10-29: “Onayla, başla”); uygulama Opus 5.5, masaüstü.** Dal `claude/r3-canli-skor` (taban `main` d9727d6; ilk commit karar 63), etiket `tur/r3-canli-skor`. `main`'e alma karar 63'e göre: büyük kapıdan sonra, kullanıcının sözüyle (R3 ve R4 birlikte alınabilir).

Kaynaklar: kullanıcının isteği (2026-10-29: “takım logoları da uyduralım ve ilgili yerlere ekleyelim”); kullanıcının inceleme raporunun 3. maddesi (“Canlı Skor, tarafsız bir futbol uygulamasına dönüşsün”); R programı (karar 56: hafta görünümü; maç sayfası Özet, İstatistikler, Kadrolar, Puan durumu; takım ve oyuncu sayfası; öbür maçlara kadro ve değişiklik kaydı; kulübe özel maaş ve doktor bilgisi girmez; alınmayanlar: ayrı takip alanı, öbür maçlar için ölçümsüz şut listesi); ilkelerin uygulama yönü (karar 60: futbol haftanın ritmidir, sakin günün karşılığı bilgidir); H2'nin açık sorusu “eski haftalar Canlı Skor'da”; borç defteri B44'ün maç telefonu satırları.

## Bugünkü durum (kodla doğrulandı, 2026-10-29)

- Canlı Skor telefonun içinde üç sekmedir (`js/ekran-telefon.js` `telLigSekmeleri`): **Maçlar** (maç gününde haftanın maçları; bizim maç ayrı satırda), **Puan durumu** (bizim satır vurgulu), **Fikstür** (‹ N. hafta ›). Satıra dokununca ayrıntı satırın altında açılır (`telMacAyrinti`: goller, kartlar, sakatlıklar, 10 satırlık tablo). Takıma dokununca kulüp ekranı (`telKulupEkrani`: sıra, G-B-M, goller, golcüler, son beş, sıradaki, hoca, stat). Oyuncu sayfası yok.
- Maç kaydı (`js/mac-sonuc.js` `macKaydiYaz`): bizim maçta goller, kartlar, sakatlıklar (kimlikle), oyuncu değişiklikleri (**adla**), şut listesi, beklenen gol, ilk on bir, hocalar, tarz, istatistik. **Öbür maçların kısa kaydında oyuncu değişiklikleri ve şut listesi atılır**; dizilişi ve maç öncesi eksikler hiçbir kayıtta yok.
- Motor olayları dakikayla yazar (`Math.floor(gameSec/60)+1`); ilk yarının uzatmasındaki dakika ile ikinci yarının başı aynı sayıyı alır (46, 47 …), **devre kayıtta ayrılmıyor**. Asist kaydedilmiyor.
- Sezonun devralınan haftaları (1–12) fikstürde yok; Canlı Skor 13. haftadan başlar.
- Maç telefonu aynı çizimi kullanır (`js/ekran-mac-telefon.js`): satırlar canlı, tablo canlı (S-d).
- **Kulüp armaları yok.** Maç öncesi bülteninde forma renginden yuvarlak bir yer tutucu var (`js/ekran-mac-oncesi.js` `oe-arma`). Kulüplerin kendi renkleri de yok: maçlar iki ortak formayla oynanır (ev sahibi `STIL.formalar.ev`, konuk `deplasman`; Demirkapı ve Akdeniz renkleri).

## Kapsam

### R3-0 — başlangıç ölçüsü

`akis-deneme 16 19 24 27 30`, `okunurluk.py`, `kariyer-deneme`, sezon tabanı t7 (KAPILAR komutu) bugünkü kodla; sonuç Sapmalar'ın başına. Kod değişmez.

### R3-a — kayıtta eşitlik (kural; motora yalnız bir alan)

- **Devre:** motorun olay kayıtlarına (gol, kart, sakatlık, değişiklik, şut) `yari` alanı (1 ya da 2) eklenir; motor davranışı değişmez (TEKNIK_PLAN §8: motor yalnız alan ekler). Kayda geçer; ekranda “45+2'”, “90+3'” yazımı ve devre arası skoru bundan.
- **Değişiklikler kimlikle ve her maçta:** kısa kayıt da oyuncu değişikliklerini saklar; giren ve çıkan oyuncunun kimliği kayıt anında kadrodan çözülür (`cikanId`, `girenId`; çözülemezse null, ad kalır).
- **Diziliş ve eksikler:** her maç kaydına iki takımın dizilişi (hocanın o maçtaki dizilişi) ve maç anında oynayamayanlar (sakat, cezalı; kimlik ve neden türü) girer.
- **Şut listesi** öbür maçlarda yine saklanmaz (karar 56; beklenen gol saklanıyor). Asist yok; gösterilmez.
- Kayıt sürümü 11 kalır: yeni alanlar isteğe bağlıdır; eski kayıtta yoktur, ekran o bölümü “Bu maçın kaydında yok” diye geçer. `macSonucDogrula` yeni alanların biçimini sınar. Kayıt boyu ölçülür (sezon sonunda; kısa kayıt maç başına birkaç yüz bayt büyür).

### R3-b — kulüp armaları (TEST; kodla)

- **Kullanıcının isteği:** ligin 16 kulübüne birer arma uydurulur ve futbol uygulamasının ilgili yerlerine konur. Armalar kodla çizilen SVG'dir (dış görsel yok; CLAUDE.md görsel kuralı). Bugünkü görseller gibi yer tutucudur: görsel turda (karar 49) yenilenebilir, kullanıcı değiştirir.
- **Tarif tablosu** (yeni `js/arma.js`; görüntü yardımcısı, kural ve kayıt yok): her kulübe biçim (kalkan, daire, rozet, eskutçon, sancak), iki ya da üç renk, adından esinli bir motif ve kısa ad harfleri. Örnek yönler (TEST): Demirkapı kale kapısı (kırmızı–krem, bugünkü ev forması), Akdeniz dalga (beyaz–lacivert), Yıldıztepe yıldız ve tepe, Çamlıbel çam, Değirmenaltı değirmen çarkı, Kuyulu çıkrık, Mercanlı mercan dalı, Söğütlü söğüt yaprağı, Bozkaya kaya, Ilıcaköy buhar, Taşharman ve Eskiharman başak, Karaova ova çizgisi, Sarıyamaç güneş, Kocadere dere, Ardıçlı ardıç dalı. Kuruluş yılı ve uydurma tarih yazılmaz (kulübün geçmişi içeriktir, kullanıcınındır).
- **Çizim:** `armaSvg(kulüpKimliği, sınıf)` → satır içi SVG; tarifi olmayan kulüpte biçim ve renk kimlikten türetilir, ortada baş harf. Arma süs öğesidir (`aria-hidden`); kulübün adı hep yanında yazılı.
- **Yerler:** Canlı Skor'un hafta satırları ve puan durumu (küçük), maç sayfasının başlığı (büyük), takım sayfasının başlığı, oyuncu sayfasındaki kulüp, maç telefonu (aynı çizim), maç öncesi bülteni (bugünkü yuvarlak yer tutucunun yerine), maç sonu kartının başlığı ve 2D maçın köşe skoru. Oda, stat tabelası ve formalar bu turda değişmez (görsel tur).
- Kulüp renkleri yalnız armadadır; formalar bugünkü iki ortak forma olarak kalır (kulübe özel forma görsel turun işi; tarif tablosu o zaman kaynak olabilir).

### R3-c — hafta görünümü (Maçlar)

- Canlı Skor'un ilk sekmesi hafta görünümüdür: ‹ N. hafta ›, günü, o haftanın **bütün maçları aynı satır kalıbıyla** (başlama saati ya da durum, iki takım, skor). Demirkapı ayrıcalıksızdır: ayrı satır, ayrı renk ya da üstte durma yok; puan durumundaki “bizim satır” vurgusu da kalkar (rapor: kişiselleştirme yok, ayrı takip alanı alınmadı).
- Fikstür sekmesi bu görünüme katılır (sekmeler: **Maçlar · Puan durumu**). Eski haftalar (13. haftadan bugüne) ve gelecek haftalar aynı yerde.
- Varsayılan hafta: maç günü ve sonraki iki gün o hafta, sonra sıradaki hafta (Claude kararı).
- Satıra dokununca **maç sayfası** açılır (satırın altındaki ayrıntı kalkar).

### R3-d — maç sayfası

- Başlık: iki takım (dokunulur → takım sayfası), skor, devre arası skoru, hafta, tarih, stat; oynanmamışsa başlama saati.
- **Özet:** gol, kart (ikinci sarı, kırmızı), oyuncu değişikliği, sakatlık ve devrelerin ortak olay akışı; dakika “45+2'” biçimi; kendi kalesine gol “k.k.”. Sakatlık ayrı sekme değildir.
- **İstatistikler:** bugünkü 10 satırlık tablo (şut, isabet, beklenen gol, sahiplik, pas isabeti, korner, faul, kartlar, ofsayt); devrelere ayrılmaz (kayıt maçın toplamını tutar).
- **Kadrolar:** iki takımın dizilişi, ilk on biri (forma, ad, mevki), yedekleri, değişiklikleri (giren ve çıkan, dakika, sakatlıktan mı) ve maç öncesi eksikleri (sakat, cezalı). Dar telefonda iki takım üstte seçilir; geniş panelde yan yana.
- **Puan durumu:** o haftanın sonundaki lig tablosu, iki takımın satırı işaretli (`sezonTablosu(k, sonAn)`).
- Oynanmamış maçta sayfa önizlemedir: saat, stat, iki takımın son beşi, hocaları; Kadrolar ve Özet “maçtan sonra”.
- Hükmen maçta yalnız hükmen notu ve tablo.

### R3-e — takım sayfası

- Bugünkü kulüp ekranı dört bölüme ayrılır: **Genel** (sıra, puan, G-B-M, goller, son beş, sıradaki maç, hoca ve tarzı, stat), **Maçlar** (sezonun bütün maçları: oynanan skorla, gelecek saatle; dokununca maç sayfası), **Kadro** (forma, ad, mevki, yaş, maç, dakika, gol, kart, durum: sakat ya da cezalı; maaş, sözleşme ve gizli değer yok), **İstatistik** (atılan/yenen, beklenen gol lehte/aleyhte, şut, ortalama sahiplik, kartlar, golcüler).
- Her kulüp aynı sayfayı alır; Demirkapı'nın kulübe özel bilgisi (maaş, sözleşme, doktor) Dosya'dadır, burada yoktur.

### R3-f — oyuncu sayfası

- Kimlik (ad, forma, mevki, yaş, ayak, kulüp), bu sezon (maç, dakika, gol, kart), **maç maç** (hafta, rakip, skor, dakika, gol, kart; dokununca maç sayfası) ve **sağlık geçmişi** (maçta görülen sakatlıklar: maç, dakika, bölge; bugün sakat ya da cezalı olduğu). Dönüş tarihi, doktor notu, maaş ve gizli değer (yetenek, kondisyon, form ya da bunların yerine geçen puan) yoktur.
- Kadrodan, maç sayfasının kadro ve olay satırlarından açılır.

### R3-g — yerleşim ve gezinti

- **Odada (iki sütun):** telefon listeyi tutar (hafta görünümü, puan durumu); maç, takım ve oyuncu sayfaları **sağdaki panelde** açılır (Bekleyenler'in yerine; liste ile ayrıntı yan yana). Sayfadan sayfaya geçiş panelde, geri zinciri panelin başlığında; Esc bir adım geri, sonra panel Bekleyenler'e döner.
- **Balkonda ve maç telefonunda:** aynı sayfalar telefonun içinde, ‹ Geri ile.
- **Maçta canlı:** maç telefonunda hafta görünümü ve bugünkü haftanın maç sayfaları canlı veriyle (bizim maç motordan, öbürleri arka maçların anlığından; “canlı” etiketi). Telefon açıkken maç durur (bugünkü kural).
- Okuma yeri her sayfada korunur (R2-b'nin kalıbı).

### R3-h — denetimler

- `kariyer-deneme`: yeni kayıt alanları (yarı, diziliş, eksikler, değişikliklerin kimliği, kısa kayıtta değişiklikler), eski kayıt (alanlar yok, okumalar çökmez), kaydet–yükle, belirlenimcilik; saf okumaların (maç sayfası, takım istatistiği, oyuncunun maçları) gizli değer ve maaş içermediği.
- Motor: `node araclar/mac-deneme.js 40 1 --karsilastir araclar/taban/g1.json --ayni` birebir (alan sonucu değiştirmez), çekirdek ve seyrek senaryolar, hız bütçesi.
- `akis-deneme`: §24 yeni düzene uyar; yeni **§31 Canlı Skor**: hafta görünümü (tarafsız satırlar, hafta gezintisi), maç sayfası dört bölüm, takım ve oyuncu sayfası, kamuya açık bilgi sınırı (maaş, sözleşme, dönüş tarihi, gizli değer yok), odada sağ panel ve Esc zinciri, maç telefonunda canlı maç sayfası ve kaydırma (B44).
- `okunurluk.py`: hafta görünümü, maç sayfası (Özet, Kadrolar), takım ve oyuncu sayfası.
- Armalar: Node'da tarif tablosu ligin 16 kulübünü kapsar, iki kulübün tarifi (biçim, renkler, motif) aynı değil; tarayıcıda her yerde (hafta satırı, tablo, maç ve takım sayfası, bülten, maç sonu kartı, köşe skoru) arma var ve SVG geçerli; `kontrol.py` ve `akis-2d.py` (bülten, maç sonu, köşe skoru) görüntüleri incelenir. Kullanıcı isterse 16 armanın tek PNG'si verilir (görsel karar; CLAUDE.md istisnası).

## Yapılmayacaklar

- Ayrı takip alanı, favori takım, bildirim (karar 56).
- Öbür maçlarda şut listesi, şut haritası, asist (kaydedilmiyor; motor işi değil).
- Devralınan haftaların (1–12) maç sayfaları (kayıtta yalnız tablo ve son maçlar var).
- Haber, transfer söylentisi, oyuncu puanı, “maçın adamı” (gizli değerin yerine geçer).
- Canlı Skor dışındaki ekranların yeniden yapımı; balkonun düzeni (R5).

## Claude kararları (belgeye görünür yazılır; itiraz serbest)

- Tarafsızlık: Demirkapı hiçbir listede ayrıcalıklı değil (puan durumundaki vurgu da kalkar).
- Armalar kodla, kulüp adlarından esinli motiflerle; renkler TEST. Demirkapı ve Akdeniz bugünkü forma renklerini taşır; öbürleri birbirinden ayrılan bir paletten. Kuruluş yılı yazılmaz.
- Varsayılan hafta: maç günü ve sonraki iki gün o hafta, sonra sıradaki hafta.
- Odada ayrıntı sağ panelde (telefon liste, panel sayfa); balkonda ve maçta telefonun içinde.
- Kamuya açık bilgi: maçta görülen sakatlık bölgesi var, dönüş tarihi yok; maaş ve sözleşme yalnız Dosya'da.
- Motor kaydına `yari` alanı (devre ve “45+” yazımı için tek motor dokunuşu).
- Fikstür sekmesi hafta görünümüne katılır.

## Kabul

- `node araclar/hizli.js --hepsi` çıkış 0; `kariyer-deneme` yeni bölümüyle geçer.
- Motor alanı sonucu değiştirmez: 40 maç `--ayni` birebir; senaryolarda yeni kabul dışı yok; hız bütçesi içinde.
- Sezon tabanı t7 (KAPILAR komutu) 18/18 birebir (yeni alanlar karşılaştırılan alanları değiştirmez; değiştirirse fark gerekçesiyle Sapmalar'a, yeni taban).
- `akis-deneme` değişen bölümler (14, 16, 19, 24, 27, 30, 31) geçer; `okunurluk.py` eşikte; `kontrol.py` ve `akis-2d.py` (bülten, maç sonu kartı, köşe skoru, maç telefonu) geçer; armaların görüntüsü incelenir.
- Büyük kapı (`main`'den önce, karar 63) ayrıca.

## Belgeler

- **OYUN_TASARIMI** §2 ekran tablosunda Canlı Skor satırı; §9 kamuya açık bilgi sınırı (puan yok; maaş, sözleşme ve doktor bilgisi Dosya'da).
- **STIL_REHBERI** §7: hafta görünümü, maç sayfası, takım ve oyuncu sayfası, odada sağ panel; kulüp armalarının dili (biçimler, motifler, boylar; yer tutucu).
- **TEKNIK_PLAN** §3 maç kaydının yeni alanları; §8 motorun `yari` alanı; §10 Canlı Skor çizimi ve `js/arma.js` (yükleme sırası, tarif tablosu).
- **YOL_HARITASI** karar 64, devam notu; **CLAUDE.md** “Bugün çalışan” ve içerik kuralına armaların TEST oluşu; **KAPILAR** Canlı Skor satırı; **BORCLAR** B44.

## Riskler

- **Kayıt boyu:** her maçın kaydı büyür; sezon sonunda ölçülür. Sınıra yaklaşırsa önce kısa kayıttaki değişiklikler sıkıştırılır (kimlik ve dakika), sonra H3'ün arşivi.
- **Ad ile kimlik eşleşmesi:** aynı adlı iki oyuncu varsa değişikliğin kimliği çözülmez (bugün `macDakikalari` de böyle atlar); satır adla görünür.
- **Maçta canlı sayfa:** arka maçların anlığı her karede değişir; telefon açıkken maç durduğu için sayfa donmuş anı gösterir (bugünkü tablo kuralı).
- **Dar telefon:** Kadrolar iki takımı dar ekranda yan yana sığdıramaz; üstte takım seçimi. Okunurluk ölçüsüyle sınanır.
- **Kapsam:** takım ve oyuncu istatistikleri yalnız kayıttaki sayılarla; yeni ölçüm üretilmez.
- **Armaların okunurluğu:** küçük satırda (hafta görünümü, köşe skoru) motif seçilmez; küçük boyda yalnız biçim, renk ve baş harf çizilir.

## Tahmin

17–22 saat. Sıra: R3-0 → R3-a → R3-b → R3-c → R3-d → R3-e ve R3-f → R3-g → R3-h → belgeler ve kapanış.

## Sapmalar

- **Motora birden çok alan (R3-a “yalnız bir alan” yerine):** `yari` olaylara; ayrıca oyuncu değişikliğine `cikanNo`, `girenNo` ve `sonucKaydi()`'na `yedek` (kulübe kimlikleri). Değişikliğin kimliği adla değil motorun forma numarasıyla çözülür (aynı adlı iki oyuncu riski kalkar); kulübe kayıtta adla eşlenmez, motorun kadrosundan gelir. Davranış değişmedi (`--ayni`).
- **Yedekler kayda girdi** (planda yalnız diziliş ve eksikler vardı): Kadrolar'ın “Yedekler” bölümü için `yedek` alanı.
- **Arka maç örneği:** `n` dört sayaçtan beşe (değişiklik sayısı), örnekte `yari`; `arkaMacAnlik` değişikliklerin önekini, ilk on biri ve kulübeyi verir (canlı maç sayfasının Kadrolar'ı ve devre ayracı için).
- **Kadrolar dar alanda alt alta** (planda “üstte takım seçimi”): iki takım alt alta, geniş panelde (≥ 30 em) yan yana; seçim düğmesi gerekmedi, okunurluk ölçüsü eşikte.
- **Armaların harfleri CSS ile:** SVG `<text>` sayfa metnine (ve ekran okuyucuya, metin denetimlerine) karışıyordu; harfler `::after` ile çizilir. Küçük boy SVG değil düz HTML ve CSS.
- **Satırda armalar skor hücresinde:** armalar adların yanında ayrı hücredeyken adlar fazla kesiliyordu; N2'nin tek satır kuralı korunarak skorla tek hücreye alındı, saat sütunu daraldı.
- **Hafta sınırı düzeltmesi:** `haftaSayisi` sezonun son haftasının numarasıdır; eski Fikstür sekmesi 31–42 gibi boş haftalara gidebiliyordu (`canliHafta` sınırlar).
- **Takım ve oyuncu sayfasında “13. haftadan beri”:** devralınan 1–12. haftaların maç kaydı yoktur; takımın maç listesi ve oyuncunun maç maç dökümü kayıtlı haftalardır, sezon sayaçları (maç, dakika, gol) bütün sezondur — iki yerde de başlıkta yazar. Eski kayıtta maç ve dakika sayacı yoksa “—”; kırmızı kart oyuncu kaydında tutulmaz, maç kayıtlarından sayılır (Kadro sekmesiyle aynı).
- **`macAyrintisi` kalktı:** yerine `macSayfasi`; H2-b'nin kariyer denetimleri ona taşındı. Ayrıntı görünümünün ölü CSS'i silindi.
- **Kariyersiz TEST maçında satırlar dokunulmaz:** maç sayfası kariyerden okunur (fikstür, kulüpler); eski ayrıntı orada da açılıyordu. Canlı sayfanın denetimi kariyerli maçta (§19 kilit adım, §20 işçi).
- **Maç telefonunda takım ve oyuncu sayfası notu:** kariyer maç bitince işlendiği için sayfa maç öncesini gösterir ve “Bugünkü maçlar, maç bitince işlenir.” der (S-d'nin kulüp ekranındaki “(canlı)”, “(önceki haftalar)” etiketlerinin yerine).
- **Dakikada düz kesme işareti** (“45+2'”): oyunun öbür yerleriyle (satır, maç sonu kartı, köşe skoru) aynı.
- **B44:** maç telefonunda okuma yeri (H2-e düzeltmesi R3'ün yeniden yazımında kaybolmuştu; sayfa başına geri geldi), telefon açıkken Maçı bitir ve maçta Mesajlar önizlemesi denetime alındı; kalan tek madde gözlemde rozet (R5).
- **Örnek kayıt:** `araclar/ornekler/kayit-s11-hafta14.json` (R3 koduyla, tohum 7, 14. hafta sonu; `sezon-deneme --kayit-yaz`); akış §31 ve okunurluğun Canlı Skor sahneleri bunu açar.
