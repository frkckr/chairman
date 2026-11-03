# CM programı — CM 01/02 çerçevesi, haber akışı ve sezon öncesi başlangıç (plan, 2026-11-03, dizüstü)

Durum: **onaylandı (kullanıcı, 2026-11-03: “Onayla, başla”); CM1-a uygulandı (dal `claude/cm1a-cerceve`), CM1-b uygulandı (dal `claude/cm1b-akis`; §10). Büyük kapı ve `main` kullanıcının sözüyle; CM2-a “devam”la.** Kaynak: kullanıcının 3 Kasım teşhisi ve isteği, araştırma ve tartışma turu ([cm-arastirma.md](cm-arastirma.md); yedi tercihin tamamı kabul edildi) ve üç kod haritası (ekran iskeleti, akış ve kayıt, sezon ve başlangıç; ajan raporları sohbette, kısıtları §8'de). Onaylanınca: kararlar OYUN_TASARIMI, STIL_REHBERI ve TEKNIK_PLAN'a, tarihli özetleri YOL_HARITASI “Geçerli kararlar”a (86–89), sıra devam notuna; her tur kendi dalında, kapanışta `tur/<ad>` etiketi; `main`'e alma kullanıcının sözüyle (karar 63). Uygulama ayrıntıları Claude'un; kesin kullanıcı kararını değiştirecek bir seçim görünür kılınır.

## 0. Bir bakışta

| Tur | Ad | Oyunda ne değişir | Neden daha iyi | Büyüklük |
|---|---|---|---|---|
| **CM1-a** | Çerçeve | Karenin solunda tam boy CM şeridi (tarih, İlerle, Ofis, Haberler, Telefon, Gazete, Ajanda, Kulüp, Lig, Transfer, en altta “Haber var”); üstte kulüp renginde başlık şeridi ve sekme satırı; oda canlı zemin; menü düğmesi nesneyi açar; iki palet yan yana (CM lacivert, Kâğıt) | Gezinme hep görünür ve tek yerde; nesne ile şerit aynı şeyi iki kez söylemez; CM tanınırlığı; RK5 kâğıt işi korunur | orta |
| **CM1-b** | Haber akışı | Tek gelişme kaydı (kayıttan türetilir) → **Haberler** ekranı (kronolojik liste, kategori sekmeleri, “Cevap bekliyor” sekmesi, sonraki okunmamış); satır ortamı açar; “Haber var” sayacı; İlerle Haberler'e iner; gazete yalnız haber olunca çıkar, TV 100 kalkar, gün başı notu listenin “Bugün” başlığı olur | “Son İlerle'den beri ne oldu, ne bekliyor” tek bakışta; kanallar sunum olarak kalır, patrol gerekmez; çift anlatım biter | orta–büyük |
| **CM2-a** | Takvim ve başlangıç | Oyun 22 Haziran'da göreve yeni gelen başkanla başlar; ilk lig maçı 22 Ağustos; yaz ve kış dönemi, devre arası; hazırlık maçları yeni maç türü; sıfır tablo; kayıt sürümü 13 | Bağlam var: kulüp devralınır, lig sıfırdan başlar; gerçek TFF ritmi; alıştırma için güvenli sahne | büyük |
| **CM2-b** | İlk 60 gün paketi | Devir teslim, borç-alacak, futbolcu alacakları ve transfer yasağı, lisans eksikleri (30 gün), hoca kararı, sözleşmesi bitenler, ilk transfer dosyası, kamp, hazırlık maçları, kombine, sponsor yenileme, personel, taraftar yemeği, ilk basın toplantısı, stat zemini; ters piramit; belgeler Claude, replikler TEST | Oyun oynatır: her gün gerçek bir iş, her iş bir ekranı öğretir; ilk resmî maç alıştırmanın bitişidir | büyük |

Sıra gerekçesi: CM1-a ve CM1-b aynı pakettir (Haberler listesi çerçevenin ilk gerçek ekranıdır; çerçeve tek başına “güzel ama boş” görünür). CM2-a tarif değişikliği bütün sezon tabanlarını yeniler, o yüzden CM1'den sonra ve CM2-b'den önce. CM2-b içerik ve küçük mekaniklerdir, CM2-a'nın takvimine oturur. RK9, R6b ve R7 bu programın arkasına kayar.

Dallar: `claude/cm1a-cerceve` (main'den) → `claude/cm1b-akis` → büyük kapı → `main` (kullanıcının sözüyle) → `claude/cm2a-takvim` → `claude/cm2b-onsezon` → büyük kapı → `main`. Etiketler `tur/cm1a-cerceve`, `tur/cm1b-akis`, `tur/cm2a-takvim`, `tur/cm2b-onsezon`.

## 1. Bu planla kesinleşen kararlar (kullanıcı 2026-11-03; ayrıntı kararları Claude'un)

1. **CM çerçevesi biçimde birebir:** sol şerit tam boy, düz metin düğmeler, en üstte tarih kutusu, en altta kırmızı “Haber var”; üstte başlık şeridi kulüp renginde (genel ekranlarda nötr); altında sekme satırı; kart ya da diyalog açıkken İlerle gizlenir. **Karar 47 ve 51'in “sürekli yan menü yok” kısmı bu kararla değişir;** “görev listesi yok” kısmı Haberler'in “Cevap bekliyor” sekmesiyle sınırlı değişir (ayrı görev günlüğü yok).
2. **Oda canlı zemin:** Ofis'te tam ve net; başka ekranda içerik alanının arkasında soluk ve donuk (kamera durur). Oyun karesi 4:3 ve 960×720 ızgara değişmez; şerit karenin **solunda** HTML kromdur (bant kalıbı), 3B görüntüye yayın çerçevesi eklenmez.
3. **Menü düğmesi nesne açar:** Telefon telefonu ele aldırır, Gazete masadan gazeteyi kaldırır, Ajanda defteri açar, Kulüp dosyayı (Kadro öne), Lig telefondaki Canlı Skor'u, Transfer panoyu. TV menüde yoktur: oda nesnesi ve 7 tuşu kalır. Masa şeridi (`.od-nesneler`) kalkar; 3B nesneler tıklanır kalır.
4. **Renk karışım, iki palet yan yana:** çerçeve CM (lacivert şerit, sarı metin, kulüp rengi başlık) ya da Kâğıt (krem krom); içerik alanı RK5 kâğıt dilinde. Ayarlar › Görünüm'de “Çerçeve paleti” (tarayıcıda, kayda girmez; TEST değil, ürün ayarı adayı); varsayılan CM. Yazı: şerit ve başlıklarda kalın yuvarlak sans (Nunito 700/800; Türkçe harfler denenir), gövde Plex Sans 16 px (RK5).
5. **Tek kayıt, tek liste, çok sunum:** gelişme kaydı kayıttan türetilir (saf okuma; kayda yalnız okundu işareti); üç sınıf *cevap bekliyor / beklenen / okumalık / arka plan* (beklenen = oyuncunun kendi başlattığı bekleyişin sonucu, durdurur); İlerle'nin durakları değişmez (bugün zaten yalnız karar, randevu, beklenen cevap ve maç gününde duruyor — kod haritası §8), ama **İlerle Haberler'e iner** (ayar: Haberler / Ofis). Gazete “dünya ve yankı” yüzeyi, boş günde sayı yok; TV 100 Haberler kalkar; gün başı notu Haberler'in “Bugün” başlığı, masadaki sarı not o sayfaya giriş.
6. **Sezon öncesi başlangıç (TEST tarifi):** oyun 22 Haziran 2026 Pazartesi 08:00 (yaz döneminin açıldığı gün; ilk gün mazbata ve devir teslim), ilk lig maçı 22 Ağustos 2026 Cumartesi (hafta 1; ~9 hafta, 61 gün), yaz dönemi 22 Haziran–4 Eylül (3. hafta sonrası), devre arası 17. haftadan sonra 4 hafta (20 Aralık–16 Ocak), kış dönemi 4 Ocak–5 Şubat 2027, 30. hafta 17 Nisan 2027. Lig 16 takım, 30 hafta (karar 36 korunur); tablo sıfırdan. 13. hafta Kasım tarifi araçlarda kalır (`kasim`).
7. **Hazırlık maçı yeni maç türüdür:** motor aynı, puan ve sayaç yok, kondisyon ve sakatlık işler, küçük bilet geliri; rakipler bu turda ligin kulüpleri (yurt dışı kampta da Türk kulüpleri birbiriyle oynar; dış kulüp eklenmez). Kamp bir ajanda işidir (yer, süre, masraf; `js/mekan.js`).
8. **Metinler karma:** resmî belgeleri Claude yazar; kişi repliklerini kullanıcı; replikler gelene dek açıkça işaretli TEST replikler (P12 emsali, içerik kuralının istisnası olarak bu paket). Yeni TEST kişiler: eski başkan, taraftar temsilcisi; özel kalem adsız kalır.
9. **Menü sabit:** kademeli açılma yok; ilk kez anlamlı olan düğme vurgulanır, kilitler diegetik (“Transfer · yasaklı”). Kademelilik masada ve işlerde.
10. **Maç sayfası çerçevenin dışında kalır** (bülten, 2D, maç sonu): ayrı sayfa, ayrı krom; CM çerçevesine alınması sonraki iş.

## 2. CM1-a — Çerçeve (kesin kapsam)

**Ekran (`index.html`, `js/ekran-oda.js`, `js/ekran-odak.js`, `js/sunum-durumu.js`, `js/stil-99.js`, `js/arayuz.js`):**
- `#screen` iki parçalı olur: solda `nav.cm-serit` (genişlik `--serit-en`, karenin %11'i, 640 piksellik karede en az 96 px), sağda 4:3 kare (`#view` tuvali ve `#oda` kabı `left:var(--serit-en)`). `.screen` genişlik formülü kare + şerit (bant kalıbı `#screen[data-bant]`, index.html:41-44; `--kare-cq` her zaman kare genişliğinden). Balkon bandı sağda olduğu gibi kalır. `ekranPayGuncelle` (sunum-durumu.js:35-48) şeridi hesaba katar.
- **Şerit** (kalıcı DOM, `ciz()` yalnız durumunu günceller): üstte tarih kutusu (gün adı, g.a.yy, saat; `.od-ustTarih` buradan kalkar), altında ‹ Geri (odak geri zinciri; ileri yok), sonra **İlerle ▸** (maç günü “Stada git ▸”; kart ya da diyalog açıkken gizli; Onayla/Vazgeç adımı aynen), **Ofis** (balkonda “Odaya dön”), **Haberler** (CM1-b'ye dek bugünkü gün başı notunu açar), **Telefon**, **Gazete**, **Ajanda**, **Kulüp**, **Lig**, **Transfer**; en altta kırmızı **Haber var** (CM1-a'da bugünkü `haberSayisi` + `kararBekleyen`; CM1-b'de tek sayaç). Düğmeler düz metin, etkin olan parlak; rozet yok (sayaç tek yerde). Tuşlar: 1 telefon, 2 ajanda, 3 dosya, 4 gazete, 5 balkon, 6 transfer, 7 TV, 8 not aynen; **9 Haberler, 0 Lig** yeni; P/Boşluk, Esc, Z, oklar, Enter, [ ] aynen.
- **Başlık şeridi** (`header.od-ust` yeniden biçimlenir): zemin kulübün arma rengi (`armaTarifi(kulupId).renk[0]`, arma.js:59-64; yazı rengi parlaklıktan beyaz ya da mürekkep), Ayarlar ve genel ekranlarda nötr; solda ekran adı (Ofis, Balkon, Haberler, Telefon, Dosya, Defter, Gazete, Transfer, Canlı Skor, Ayarlar), sağda “Kaydedildi”, Duraklat, Ayarlar (RK5 yeri). Altında **sekme satırı**: ekranın kendi sekmeleri buraya taşınır — Dosya (Kadro · Dosyalar · Raporlar · Arşiv), Transfer (`TM_BOLUMLER`), Canlı Skor (Maçlar · Puan durumu · Takip), Ayarlar (Okuma · Maç · Kayıt · Geliştirici), Haberler (CM1-b); sekmesiz ekranlarda satır boş kalmaz, gizlenir. Kâğıdın içindeki sekme çizimi kalkar; her ekran `sekmeler()` ve `sekmeSec(ad)` verir.
- **İçerik alanı ve canlı zemin:** odak kabı (`section.odk`) içerik alanında ortada, ölçüleri `STIL.kagit.odak.boy` (geniş 80 vb.) kareye göre aynı; perde `rgba(20,14,10,.40)` + 6 px bulanıklık (bugün .22; ölçülür, okunurluk eşiği kâğıt içinde zaten tutuyor); `odaDondur` kuralı aynen (oda.js:469-470). Ofis'te perde yok, oda net. Yarım odak (ziyaret) aynen. Masa şeridi kalkar; “Sonra” yığını masada kalır; `.od-alt` yalnız durum satırı ve ekranın birincil eylemi (Katıl, Karar ver, İzle) — İlerle şeride geçtiği için alt şerit incelir, dar karede `--od-alt` yine ölçülür.
- **Paletler:** `STIL.cerceve = {cm:{serit:'#1b2a5e', yazi:'#f2c94c', etkin:'#fff3a0', soluk, haber:'#c8281e', baslikNotr:'#3a2a08'}, kagit:{serit:STIL.kagit.krom, yazi:STIL.kagit.yazi, etkin:STIL.kagit.vurgu, …}}` → CSS değişkenleri `--c-*`; Ayarlar › Görünüm “Çerçeve paleti: CM / Kâğıt” (ayar deposu, kayda girmez); kontrast ≥ 4,5:1 her ikisinde ölçülür. Yazı: index.html Google Fonts satırına Nunito 700/800 (`--cerceve`); masaüstü kopyası `masaustu/hazirla.js:30` font listesine Nunito **ve eksik Plex Serif** eklenir.
- **Balkon:** şerit ve başlık şeridi aynen durur (“Balkon · Toparlanma 15:00”); bant yalnız iş açıkken sağda (karar 72). Balkona özgü alt şerit (İzle, Gördüklerin) kalır.
- **Maç sayfası:** dokunulmaz (`ON_EKRAN.sayfa!=='oda'` iken şerit kurulmaz); geçiş kartı ve “Odaya dön” aynen.

**Kural:** değişmez. Kayıt sürümü 12 kalır.

**Belgeler:** STIL_REHBERI §1 (kare + şerit), §7 yeni “CM çerçevesi” maddesi (şerit, başlık şeridi, sekme satırı, paletler, yazı) ve “Tek krom çubuk” kuralının güncellenmesi; OYUN_TASARIMI §2 ekran tablosuna şerit ve “menü düğmesi nesne açar”; YOL_HARITASI karar 86; CLAUDE.md “Bugün çalışan” ve “Görüntü standardı” (kare 4:3 kalır, şerit yanında).

**Kabul (ölçülebilir):** (1) beş genişlikte (640, 800, 825, 944, 1186; `okunurluk.py`, pencere → kare eşlemesi şeridi hesaba katacak biçimde güncellenir) bütün sahneler eşikte, şerit düğmeleri tek ya da iki satır, kırpılan yok; (2) `#view` 4:3 ve 960 katı kalır (`kontrol.py` ölçer), oda karesi rAF ortancası değişmez; (3) Ofis'te perde yok, başka ekranda perde ve `odaDondur` doğru (akış §27 genişletilir); (4) şeritten her düğme kendi nesnesini açar ve 3B tıklamayla aynı yere iner (akış yeni §41 “Çerçeve”); (5) iki palet anında değişir, kontrast ölçümü ikisinde ≥ 4,5:1; (6) başlık şeridi 16 kulüpte okunur (yazı rengi hesaplanır); (7) balkonda bant ve şerit birlikte (akış §36); (8) `kariyer-deneme` değişmemiş çıkar (kural dosyası yok); (9) çakışma örtüsü şeridi de `inert` yapar (akış §28).

**Denetim (KAPILAR):** `hizli.js`; akış 1, 3, 11, 12, 21, 22, 23, 26, 27, 28, 30, 34, 36, 37, 40 ve yeni 41; `okunurluk.py` tamamı; `kontrol.py`; `ad-denetimi` (yeni betik `js/ekran-cerceve.js` varsa). Masaüstü kopyası `node masaustu/deneme.js` (bağımlılık yoksa not düşülür, B31).

## 3. CM1-b — Haber akışı (kesin kapsam)

**Kural (yeni `js/gelismeler.js`, 'use strict'; `OYUN_DOSYALARI`'na ve index.html'e `zaman-ozeti.js`'ten sonra, `test-gorunum.js`'ten önce; işçi aralığının dışında):**
- `gelismeListesi(k, {bas, bitis})` saf okuma; satır `{id, tarih, dakika, kanal, sinif, kategori, baslik, hedef, okundu}`. Kimlikler kaynaktan türetilir ve kararlıdır (diziler yalnız eklenir): `is:<isId>` (ajanda, iptal, erteleme, ziyaret), `gecmis:<tur>:<tarih>:<dakika>:<n>` (mac, transfer, ayrilis, hocaDegisimi, sezonSonu, ligProgram, macErteleme, macYeniTarih, gozlem), `haber:<i>` (mali raporlar, `k.haberler`), `mesele:<id>:<olaySira>` (telefon ve dosya olayları), `yaz:<isId>` (yazışma cevapları), `gazete:<tarih>` (günün manşeti), `lig:<macId>` (`ligMaci` sonucu).
- **Kanal** = satırın açacağı ortam: telefon (mesele olayı, yazışma), gazete (manşet, dünya ve söylenti), tv (canlı maç), kapi (ziyaret), dosya (karar, rapor, aşama), ajanda (randevu, erteleme), lig (bizim ve öbür maçlar, program, erteleme), para (ödeme, ay başı). Kanal simgesi `js/simge.js` setinden (eksikler eklenir).
- **Sınıf:** *cevap* = bekleyen ajanda karar işleri (`sonraKararlari` ile aynı kaynak; üç ayrı “cevap bekleyen” tanımı bu tek işleve indirilir: `kararBekleyen`, `cevapBekliyor`, `sonraKararlari` onu çağırır), saati gelen randevu ve kapı; *beklenen* = `veri.durak` taşıyan işlerin sonucu (yazışma cevabı, tavsiye) ve devredilen işin dönüşü; *okumalik* = rapor, bizim maç, program, erteleme, manşet, transfer imza, hoca değişimi, sezon sonu; *arka* = öbür maç sonuçları, rakiplerin transferi ve söylenti, ödemeler. Kart sınıfı (fırsat/sorun/rutin/pazarlık) künyede kalır.
- **Okundu:** `k.gelismeOkunan = {an:{tarih,dakika}, idler:[…]}` isteğe bağlı alan (gun-notu kalıbı; `EK_DENETIMLER`); `an` Haberler her açıldığında o ana çekilir (önceki her şey okundu), `idler` tek tek açılanlar (an'dan eskiler budanır, en çok 200). Kayıt sürümü 12 kalır. `gelismeSayaci(k)` → `{cevap, yeni}`.
- **Kaynakların uyumu:** `gazeteSayisi` boş günde `null` döner (“TEST: bugün haber yok” sayısı yok; `gazeteOkunan` aynen); `tvHaberleri` ve TV 100 sayfası kalkar (`TV_SAYFALAR` 200 Skorlar, 300 Puan durumu · Program; şerit canlı maç ya da günün başlığı — başlık gelişme listesinden); `takipHaberleri` aynen (14 gün, konu süzgeci); `gunNotu` gövdesi “Bugün” başlığına girer (son maç, bugünün defteri, kasa, manşet; `notOkunan` kalır, sarı not Haberler'i açar); `zamanOzeti` değişmez ama durak özeti kartına “Haberler ▸” gelir.
- **İlerle:** durak kuralı (`ilerleOnizle`, `durakSorgusu`) değişmez. Yeni ayar `ilerleInis: 'haberler' | 'ofis'` (varsayılan haberler): zaman sahnesi bitince Haberler açılır, okunmamışlar işaretli, “Cevap bekliyor” varsa o sekme. `ilerleOzeti`'nin “Telefonda yeni haber var / Masada yeni gazete var” cümleleri “n cevap · m yeni” olur. Bilinen borç: `ilerleOnizle`'nin `sinir` dalındaki `.pop()` en uzak rutin işi seçiyor (ajanda.js:254-256) — bu turda **düzeltilir** (en yakın), `kariyer-deneme` satırı eklenir; sezon tabanını etkilerse not düşülür (bu tur tabanı yenilemez, CM2-a yeniler; etkiliyorsa düzeltme CM2-a'ya kayar).

**Ekran (yeni `js/ekran-haberler.js`; `acik='haberler'`, `ODAK_BOY` genis, `kagit:true`):**
- Üstte sekme satırı: **Hepsi · Cevap bekliyor · Kulüp · Transfer · Lig · Basın · Para**; satırlar güne göre gruplu (bugün en üstte), satır = saat · kanal simgesi · başlık · sınıf rozeti (cevap kırmızı, beklenen amber, okumalık yok, arka soluk) · okunmamışsa kalın; “Sonraki okunmamış ▸” (CM “Next Unread”); [ ] gün geçişi. Satıra dokununca **ortam açılır**: telefon konuşması (`panelAc('telefon')` + konuşma), gazete sayısı (tarih), dosya konusu (`dosyaAc`), transfer dosyası, Canlı Skor maç/kulüp sayfası (`tel.sayfalar` kalıbı), kapı kartı (`kararYerindeAc`), defter günü. Listede yalnız başlık; içerik ortamda (düz pano olmaması bununla güvenceye alınır).
- **Cevap bekliyor** sekmesi: bekleyen kartlar (sınıf, kalan gün), bugünün randevuları (saat), kimde bekleyen devredilmiş işler ve zincirler (aşama satırı `sablonAsamaSatiri`: “kulüple pazarlık · 2/3 · cevap Perşembe”). Görev günlüğü değil; biten satır düşer.
- Şeritteki **Haber var** = `gelismeSayaci`: “2 cevap · 5 yeni” (yalnız yeni: “5 yeni”; hiçbiri yoksa düğme soluk “Haberler”); tıklayınca cevap varsa “Cevap bekliyor”, yoksa Hepsi'nin ilk okunmamışı. Başlık şeridinde küçük “2 bekliyor” rozeti.
- Masa: 3B telefon ışığı ve sarı not kalır; “Sonra” yığını aynen.

**Belgeler:** OYUN_TASARIMI §2 ekran tablosuna Haberler, §6 “gün ve hafta ritmi” (gazete rolü, boş günde sayı yok, TV 100 kalktı, gün başı notu), §10 medya; STIL_REHBERI §7 Haberler ve sayaç; TEKNIK_PLAN §6 gelişme kaydı ve kimlik kuralı, §3 isteğe bağlı alan; YOL_HARITASI karar 87; KAPILAR satırı; BORCLAR (`.pop()` kapanışı).

**Kabul:** (1) `kariyer-deneme` yeni bölüm: liste belirlenimci (iki okuma ve JSON kopya aynı), okuma kariyeri değiştirmez, kimlikler tekil, sınıf sayıları beklenen (TEST içerikli kariyerde: karar → cevap, yazışma → beklenen, maç → okumalık, öbür maç → arka), watermark ve `idler` kaydet–yükle turunda korunur, bozuk alan doğrulamada düşer, boş günde `gazeteSayisi` null, TV 100 yok; (2) akış yeni §42 “Haberler”: İlerle → Haberler'e iniş, satırdan telefon ve gazete açılır ve geri aynı yere döner, “Cevap bekliyor” kartı açar ve cevaptan sonra satır düşer, sayaç metni; akış 25 (gazete boş gün), 39 (TV sayfaları), 40 (gün başı notu → Haberler) güncellenir; (3) `okunurluk.py` sahneleri haberler-hepsi, haberler-cevap; (4) liste kurma süresi: bir sezonluk kayıtta (`sezon-rk7-t7`'nin son kaydı) 14 günlük pencere < 5 ms, tam sezon < 50 ms (Node ölçümü; `ciz()` başına kariyer nesnesi değişmediyse önbellek); (5) kayıt boyutu artışı yalnız `gelismeOkunan` (< 4 KB).

**Denetim:** `hizli.js` (kural değişti: kariyer-deneme); sezon tabanı `sezon-rk7-t7 --ayni` (`.pop()` düzeltmesi sonucu değiştirirse not ve karar); akış 1, 3, 19, 21, 25, 27, 39, 40, 41, 42; okunurluk; kontrol. **Büyük kapı CM1-b sonunda** (akış tamamı, iki sezon tabanı, `oturum-sonu --ayni --seyrek`, kontrol, akis-2d, okunurluk, hız bütçesi `tur/rk5b-belgeler`'e göre; motor değişmediği için bilgi).

## 4. CM2-a — Takvim ve başlangıç (kesin kapsam)

**Tarif (`js/fikstur.js`, `js/lig.js`, `js/baslangic.js`):**
- `SEZON_TARIFLERI = {yaz: {...}, kasim: SEZON_TEST}`; `kariyerBaslat({tarif})` (varsayılan `yaz`; `k.icerik.baslangic` 'yaz' | 'kasim'). **yaz:** `id:'2026-27', ilkHafta:1, ilkMacTarihi:'2026-08-22', dakika:1140, ara:{sonra:17, hafta:4}, transfer:[{Yaz, 2026-06-22, 2026-09-04}, {Kış, 2027-01-04, 2027-02-05}]`. `haftaTarihi(sezon,h)` = `ilkMacTarihi + (h−ilkHafta)·7 + (ara && h>ara.sonra ? ara.hafta·7 : 0)` gün; `kayit.js:74`'teki satır içi kopya eski geçiş için olduğu gibi kalır (eski tarifte `ara` yok). `fiksturIcDenetim` ara haftasını tanır; `lig-takvimi` program anı ve yeni tarih adayları `haftaTarihi` üzerinden kendiliğinden uyar (ara haftalarında boş Çarşamba yok: erteleme adayı aradan sonraki haftalar).
- Devralınan geçmiş yok: `LIG.tablo` sıfır, `LIG.sonMaclar` boş, `LIG.buMac` 1. hafta; `sezonKur` sabitsiz `fiksturUret` (h3 risk notu: ilk kez çalışır, denemesi yazılır). Kulüp gücü devralınan puandan geliyordu (`kulupGucu`, kariyer-kadro.js:149-152; `serbestHavuzKur`): yeni `LIG.gecenSezon` (TEST sıra tablosu; Canlı Skor kulüp sayfasında “Geçen sezon: 7.”) onun yerine. Üretilen kadroların bu sezon sayaçları sıfır; `kadrolar.js`'teki gömülü `gol`/`sari` (bu sezon sayacıydı) kalkar; `sezonSayaclari`/`devralinanSayaclar` sıfır verir.
- Başlangıç: `BASLANGIC_TARIHI` tarife göre ('2026-06-22'); `sezonTakvimiKur` dönem hatırlatmalarını yaz ve kış için kurar; `ayBasiKur` 1 Temmuz; `maliRaporBaslat` ilk Pazartesi; `transferTakvimiKur` yaz dönemine de gelişme kurar (teklif +3/+12/+22, talep +1 → ilk gün hocanın isteği doğal olarak gelir); sponsor açılış ayları `['07','02']` (CM2-b kullanır); yaş sabitleri (`yasUret`, `hocalariKur`, `hocaAdaylari` 2026) tarifin yılından okunur.
- **Sözleşmeler:** bitiş `-05-31` kuralı kalır; başlangıçta Demirkapı'da üç oyuncunun sözleşmesi `2026-06-30` (doğrulama bu değere izin verir: yalnız devralınan ilk sözleşmelerde) → ilk haftada sıralı Yenile/Bırak kartları (`sozlesmeYenile` kalıbı; sezon sonu yolu aynen). `piyasa.sozlesmeBitiyor` ve tescil `-06-30` aynen.
- **Hazırlık maçı:** fikstür kaydına `tur:'hazirlik'` (`hafta:0`, kimlik `mac-<kod>-h<N>-<ev>-<konuk>`, tohum aynı yoldan); lig maçları `tur` alansız (eski kayıt uyumu). Dokunan yerler ve kural: `sezonTablosu`, `sonBesMac`, `golSiralamasi`, `sezonTamamMi`, `fiksturIcDenetim` (n·(n−1) sayımı lig maçlarıyla), `siradakiMac`/`macGunuEsle` (hazırlık da sıradaki maç olabilir), `macGirdisi` (oynanan 0; bülten “Hazırlık maçı”), `macKaydiYaz` (puan, gol, sarı ve ceza sayaçları ve ceza düşümü **yok**; sakatlık, `MAC_KAYDI_EKLERI` kondisyon **var**), `hukmenKarari` (hazırlıkta hükmen yerine “oynanmadı”), bilet (`dolulukTest`·0,5), P12 gidişat (hazırlık sayılmaz), Canlı Skor (Maçlar'da “Hazırlık” grubu 1. haftadan önce; kulüp sayfasında etiket; puan durumuna girmez), gazete ve TV kaynakları (sonuç haberi “hazırlık” etiketiyle, önem düşük), gün notu, `kulupMacGunleri` (hazırlık günü maç günü sayılır: antrenman programı buna göre), `ziyaret`/`yazisma` maç günü atlamaları (aynen). Hazırlık fikstürü kamp kararıyla doğar (CM2-b); CM2-a'da sabit TEST programı: 4 maç (11 Temmuz, 18 Temmuz, 1 Ağustos, 8 Ağustos; Cumartesi 18:00; rakipler ligin kulüpleri, ikisi iç saha).
- **Antrenman programı:** maçsız haftalar için `antrenmanProgrami`'ne “sezon öncesi” kuralı: hafta içi yoğun, hazırlık maçı günü maç, maç arifesi hafif, Pazar dinlenme; kamp günleri (CM2-b) “kamp” türü. Form ve gelişim hazırlık maçı kaydıyla da ilerler (yük küçük).
- **Kayıt sürümü 13:** `KAYIT_GECISLERI[12]` yalnız sürümü artırır (eski kariyer eski tarifiyle sürer: `ara` yok, hazırlık yok, `icerik.baslangic` 'bos' → `kasim` sayılır). `ESKI_KAYIT_SINIRI` 8 kalır. Yeni örnekler `kayit-s13-{temmuz, hafta3, ocak, sezonsonu}` sezon-deneme `--kayit-yaz` ile; eski örnekler aynen açılır.

**Ekran:** Canlı Skor hazırlık grubu ve geçen sezon satırı; bülten “Hazırlık maçı” başlığı; Transfer dönem sayacı yazı aynen (iki dönem); defterde dönem ve ara işaretleri; zaman sahnesinde kapaklar (yaz dönemi açıldı/kapandı, devre arası).

**Araçlar:** `sezon-deneme` tarif seçeneği (`--tarif yaz|kasim`), hafta sayımı `ilkHafta`'dan, sabit '2027-02-01' tarifle; `kariyer-deneme` mevcut bölümler **`kasim` tarifiyle aynen** (194 sabit tarih yeniden yazılmaz), yeni bölüm “CM2-a yaz tarifi” (ara, dönemler, sıfır tablo, hazırlık maçı kaydı, sürüm 13 geçişi, geçen sezon gücü); `akis-deneme` beklentileri ürünü izler (65 tarih ve “13. hafta” beklentileri yeni tarife; §1, §19, §24, §31, §38 başta). Yeni sezon tabanları `sezon-cm2-t7`, `sezon-cm2-t3` (masaüstünde; süre ~%30 artar: hazırlık + 30 hafta); `GUNCEL.json` güncellenir.

**Belgeler:** OYUN_TASARIMI §3 (başlangıç: göreve yeni gelmiş başkan, sezon öncesi; taraftarlıktan adaylık girişi Aşama 6'da bunun önüne eklenir), §6 (takvim: dönemler, devre arası, hazırlık maçı), §13 takvim satırı; TEKNIK_PLAN §3 (sürüm 13, tarifler), §10; YOL_HARITASI karar 88 (karar 36 ve 43'ün güncellenmesi), 3.1/5.1 notları; CLAUDE.md “Bugün çalışan” ve taban adları; h3-uygulama.md başına “CM2-a aldı” notu.

**Kabul:** (1) `kariyer-deneme` eski bölümler `kasim` ile birebir, yeni bölüm geçer; (2) sezon t7 ve t3 (kaydet–yükle) iki koşuda birebir, 30 hafta + 4 hazırlık; ara haftalarında maç yok, program ve erteleme işleri tutarlı (`ligTakvimiDogrula`); (3) sürüm 12 örnekleri açılır ve eski tarifiyle sürer; (4) hazırlık maçı puan, sayaç ve ceza yazmaz, sakatlık ve kondisyon yazar (denetim satırları); (5) ilk gün masada iş var, İlerle ilk hazırlık maçına kadar en az dört durakta durur (dönem, hocanın isteği, sözleşme kartları, ay başı); (6) akış §1 yeni kariyer “22 Haziran 2026”, §38 takvim; (7) motor değişmedi: `oturum-sonu --ayni`.

**Denetim:** `hizli.js`; `kariyer-deneme`; sezon tabanları (yeni); akış 1, 19, 24, 31, 32, 38 (+ CM2-b ile tamamı); okunurluk canli-hafta, bulten; kontrol.

## 5. CM2-b — İlk 60 gün paketi (kesin kapsam)

**İçerik dosyası `js/icerik-onsezon.js`** (içerik sürümü 6; `PAKETLER`, `KARAR_TURLERI`, `MESELE_KATEGORILERI`, `MESELE_OLAYLARI`, `GAZETE_KAYNAKLARI`, `MESAJ_GONDEREN/METIN`, `BASLANGIC_EKLERI`, `SABLONLAR`; P12 kalıbı) ve küçük kural ekleri. Gün planı (22 Haziran = gün 1; TEST; ters piramit: ilk iki hafta günde en çok iki cevap bekleyen):

| Gün | İş | Mekanik | Öğrettiği |
|---|---|---|---|
| 1 | **Mazbata ve devir teslim dosyası** (eski başkan TEST kişi; tutanak: borçlar, alacaklar, sözleşmeler, açık işler) | dosya + tek kart (imzala / eksikleri sor → ertesi gün ek tutanak) | oda, dosya, kart, İlerle |
| 1 | Mali işler müdürünün **açılış özeti** ve “Kasa ne durumda?” | mevcut `maliRaporBaslat` + yazışma | Raporlar, telefon |
| 2 | **Futbolcu alacakları ve transfer yasağı** | `k.kulup.yasak={tutar, neden}`; ödeme kartı; ödenene dek `taAcilisEngeli` ve tescil kilitli, Transfer düğmesi “yasaklı” | para kartı, Transfer kilidi |
| 2 | Hocanın hat isteği (mevcut `talep +1`) | transfer alımı zinciri | Transfer dosyası |
| 3 | **Kulüp lisansı eksikleri**: SGK/vergi, altyapı belgesi, personel; 30 günlük ek süre | yeni şablon `lisans` (üç kalem kart, bekleme, son; süre dolarsa ceza ve gazete; TEST) | şablon dosyası, takvim |
| 3–7 | **Sözleşmesi bitenler** (üç oyuncu, 30 Haziran) | `sozlesmeYenile` sıralı kartlar | Kadro, oyuncu dosyası |
| 5 | **Hoca kararı**: devam / iki adayla görüşme | P12'nin aday yolu (`hocaAdaylari`), telefon + kapı | telefon, randevu, kapı |
| 8 | **Kamp kararı**: yurt içi (Bolu/Erzurum TEST) / yurt dışı | kart; `MEKANLAR` kamp türleri (süre 8 gün, masraf); kamp ajanda işi; balkonda “Takım kampta”; hazırlık fikstürü buna göre (2 maç kampta) | kasa, balkon, ajanda |
| 10 | **Kombine ve loca kampanyası** | kart (düşük/yüksek fiyat → sezon doluluğu TEST ±0,05, gelir peşin) | para, gazete yankısı |
| 11 | **Hazırlık maçı 1** | CM2-a | 2D maç, maç telefonu |
| 14 | **Olağanüstü mali genel kurul**: borçlanma yetkisi | kart (yetki iste / istemeyeceğim) → kasa ufku ve gazete | kurul (R7'nin tohumu) |
| 15 | **Personel**: yardımcı ve mali müdür devam/değişim | iki kart (devredilen iş kalitesi değişir) | personel, devir |
| 18 | **Taraftar gruplarıyla yemek** | ziyaret (kapı) + söz | kişiler, söz hafızası |
| 20 | **Göğüs sponsoru yenileme** | sponsor şablonu Temmuz açılışı | pazarlık |
| 25 | **İlk basın toplantısı** | kart; gazete manşeti başkanın sözünden (yankı) | gazete |
| 30 | **Stat zemini ve altyapı turu** | kart (kasa) + balkondan genç gözlemi | stat, gözlem |
| 61 | **İlk resmî maç** = alıştırma bitti | — | — |

- **Alıştırma ipuçları:** kartın altındaki eşik ipucu kalıbıyla, ekran ilk kez açıldığında tek satır (en çok sekiz kelime), oturumun ilk üç açılışında; “tecrübeli başkan” için Ayarlar › Okuma “İpuçları: kapalı”. Öğreten kişi mali müdür, yardımcı ve özel kalem; pencere yok.
- **Kişiler (TEST):** eski başkan (`eskiBaskan` rolü var), taraftar temsilcisi; `kisi` numaraları kayar → `kariyer-deneme` sabitleri güncellenir.
- **Metin kuralı:** belgeler (tutanak, lisans yazısı, sözleşme, kurul gündemi, sponsor metni) Claude; replikler `TEST:` önekiyle, kullanıcı değiştirir; değiştirme sırası önce replikler.
- **Belgeler:** OYUN_TASARIMI §2 (paket), §3 (devir), §4 (mali genel kurul), §6; OLAY_KUTUPHANESI §8 (yeni paket satırı), §12; TEKNIK_PLAN §6 (içerik sürümü 6, yasak, lisans şablonu, kamp mekânı); YOL_HARITASI karar 89; CLAUDE.md içerik maddesi (bu paket TEST taslak istisnası).
- **Kabul:** `kariyer-deneme` “ilk 60 gün” bölümü (zincir belirlenimci; yasak ödenmeden transfer dosyası açılmaz, ödenince açılır; lisans süresi dolunca ceza; kamp masrafı ve hazırlık fikstürü kampa göre; kombine doluluğu; kurul kararı ufka işler; 60. günde açık zorunlu iş kalmaz); akış yeni §43 “İlk hafta” (gün 1–7 oynanır: dosya, kart, rapor, telefon, Transfer kilidi, Yenile/Bırak); okunurluk yeni kartlar; sezon tabanları paketle yenilenir (`sezon-cm2-*` CM2-b sonunda alınır, CM2-a'da ara taban).
- **Denetim:** `hizli.js`; kariyer-deneme; sezon tabanları; akış 1, 3, 21, 32, 33, 35, 37, 42, 43; okunurluk; kontrol. **Büyük kapı CM2-b sonunda.**

## 6. Yapılmayacaklar

Maç sayfasının çerçeveye alınması; tam CM paleti ve koyu tablo dili içerik alanında; el yazısı yazı ailesi; dış kulüp kaydı (yurt dışı rakip); yeni sezon geçişi ve arşiv (H3); genel kurulun tamamı (R7; yalnız mali kurul kartı); kişi modeli ve personel slotları (R6b); antrenman canlandırması (RK9); tartışma programı, bildirim kartı; kayıt büyümesi ölçümü (B51, H3); motor ve 2D maç; ses; görsel tur.

## 7. Riskler ve karşılıkları

- **Kare formülü ve ölçüm araçları:** `.screen` genişliği, `cqw` tabanı ve okunurluk penceresi → kare eşlemesi şeridi hesaba katmalı; `okunurluk.py` ve `akis-deneme.py` ortak yardımcıları CM1-a'nın ilk commit'inde güncellenir, beş genişlik yeniden türetilir.
- **Perde koyuluğu ve kâğıt:** %40 perde kâğıdın kontrastını değiştirmez (kâğıt opak); ölçülür, gerekirse %35–45 arası ayarlanır. Hareketli zemin yok: `odaDondur` ekran açıkken odayı donduruyor.
- **Sekme satırı taşıması** ekran başına küçük yeniden düzenleme ister (Dosya, Transfer, Canlı Skor, Ayarlar); kalan ekranlar dokunulmaz. Geri zinciri (`odakGeriHedef`) aynen.
- **194 sabit tarih:** `kasim` tarifi araçlarda kalarak çözülür; `akis-deneme`'nin 65 beklentisi ürünle birlikte değişir (kaçınılmaz, bir kez).
- **Hazırlık maçı alanı** ~15 yere dokunur; hepsi `f.tur==='hazirlik'` tek yardımcıyla (`hazirlikMi(f)`), denetim satırları her yer için.
- **Liste kurma maliyeti:** pencereli türetme ve kariyer nesnesi kimliğiyle önbellek; ölçü kabulde.
- **Kulüp rengi kontrastı:** 16 arma renginde yazı rengi hesaplanır; soluk renkte koyu yazı.
- **Dizüstü:** uygulama burada adım adım, hızlı kademeyle; akış tamamı, sezon tabanları ve büyük kapı masaüstünde ya da gece (keep-awake istenir).
- **İçerik kuralı:** paket TEST taslaktır; kullanıcı replikleri değiştirmeden ürün sayılmaz; CLAUDE.md'ye istisna yazılır.

## 8. Kod haritalarından gelen kısıtlar (uygulamada uyulacak)

- Krom `#oda` içinde her `ciz()`'de innerHTML ile kurulur; kalıcı DOM yok (ekran-oda.js:797-818). Şerit kalıcı düğüm olur, `ciz()` yalnız durumunu yazar.
- `#view` tuvali mutlak ve sola yaslı, 4:3, genişliği yükseklikten; `kareNoktasi` `#view` dikdörtgenini, `odakKokYerlestir` `kap` dikdörtgenini kullanır → `#oda` karenin içinde kalmalı.
- `.screen` genişliği `100svh − --ekran-pay`'dan; bant kipi `#screen[data-bant]` emsali (index.html:41-44); `--kare-cq` yazı tabanı.
- Çakışma örtüsü ve okunurluk yalnız `#screen` çocuklarını görür → şerit `#screen` içinde.
- İşçi dosyaları index.html'de `mac-motoru.js` ile `goruntu.js` arasından seçilir → yeni betikler bu aralığa girmez.
- Mesaj, haber ve geçmiş kaydının kimlik türü yok; diziler yalnız eklenir → türetilmiş kararlı kimlik.
- İlerle 08:00'de durmaz; gazete, mali rapor ve ay başı durak değil; `sinir` dalında `.pop()` en uzak rutin işi seçiyor.
- `gecmis` ve `haberler` her komutta derin kopyalanır (gözlemde her dakika) → gelişme listesi bu dizilere yazmaz.
- `haftaTarihi` 7 gün adımı 8 yerde; RK7 tarih denetimi Cuma–Pazartesi aralığı; `sezonKur` `buMac.hafta===ilkHafta` ister; `sonMaclar.hafta < ilkHafta`.
- Fikstürde maç türü alanı yok; her kayıt lig maçı sayılır (tablo, Canlı Skor, gazete, bilet, P12, hükmen, sayaçlar).
- `AJANDA_EYLEMLER=['macGunu']`, tek bekleyen maç günü işi, `macGunuEsle` sıradaki maça bağlar.
- Sözleşme bitişi `-05-31`; kişi kaydında sözleşme yalnız teknik direktörde.
- Transfer gelişmeleri dönemin 1., 3., 12., 22. günleri; dosya sınırı dönem başına 3; sponsor yalnız Şubat.
- `yasUret`, `hocalariKur`, `hocaAdaylari` 2026 sabiti; antrenman programında maçsız hafta kipi yok; kamp kavramı yok.
- `kariyer-deneme` 194 sabit tarih, akış 65 beklenti, kişi sayısı 19 sabit.

## 9. Kullanıcıya sorular (cevap gelmezse varsayılan)

1. Program adı ve dal önekleri “CM” (`claude/cm1a-cerceve` …) — varsayılan evet.
2. 22 Ağustos ilk maç, 22 Haziran açılış, 4 haftalık devre arası — varsayılan evet (TEST tarif, sonra değişir).
3. Masa şeridinin kalkması (nesneler 3B'de tıklanır, düğmeler şeritte) — varsayılan evet.
4. Hazırlık rakiplerinin ligin kulüpleri olması — varsayılan evet.
5. Yeni tuşlar 9 Haberler, 0 Lig — varsayılan evet.
6. `main`'e alma: CM1 paketi büyük kapıdan sonra tek başına mı, CM2 ile birlikte mi — varsayılan CM1 sonra (kullanıcı görüp beğenmeli; karar 63'e uygun: iki tur birlikte).

## 10. Durum

**CM1-a (dal `claude/cm1a-cerceve`, 2026-11-03, dizüstü):** uygulandı. Plandan sapmalar ve eklemeler (Claude kararı, gerekçeli):

- **Şeride Balkon eklendi** (plandaki listede yoktu): kullanıcı antrenmanı izlemeyi en önemli özelliklerden sayıyor; masa şeridiyle görünmez “Balkona çık” düğmesi de kalkınca balkona yalnız kapı ve 5 kalıyordu. Balkondayken Ofis odaya döner (eski “Odaya dön”).
- **Kulüp düğmesi dosyayı Kadro'yla açar** (CM'nin kulüp ekranı kadrodur); 3 tuşu ve 3B dosya eski önceliği korur (karar > yeni rapor > konu). Kulüp düğmesi `data-panel="dosya"` taşımaz: “masadaki dosya” ile “kulüp” iki ayrı giriş.
- **Cihaz içi sekmeler cihazda kaldı:** Canlı Skor (Maçlar · Puan durumu · Takip) ve TV sayfaları sekme satırına taşınmadı (plan §2 Canlı Skor'u da sayıyordu); telefon ve TV nesnedir, sekmeleri uygulamanındır. Sekme satırı yalnız kâğıt ekranlarda: Kulüp, Transfer, Ayarlar. Lig düğmesi Canlı Skor'u puan durumuyla açar.
- **Dosyanın konu sekmeleri yalnız Dosyalar bölümünde** (Kadro, Raporlar, Arşiv'de klasör yalnız o bölümü gösterir); Arşiv sekme satırındayken seçiliyse ikinci basış konulara döndürmez (`data-sabit`).
- **İlerle iş açıkken gizli ama yeri ayrılı** (`visibility:hidden`): şeridin menüsü her açılışta kaymaz. Balkonda izlerken İlerle görünür ve kapalıdır (saat akıyor).
- **Menü düğmesi açık işi kapatmaz** (`cmAc`; eski masa şeridindeki “aç/kapat” geçişi yok); Telefon düğmesi Canlı Skor açıkken telefonun ana ekranına döner.
- **Haber var (CM1-a hâli):** cevap bekleyen kararlar (`sonraKararlari`) + yeniler (okunmamış mesaj, görülmemiş rapor, yeni gazete, gün başı notu); dokununca önce en yakın son cevaplı kararın yeri, sonra telefon, rapor, not, gazete. Tek liste CM1-b'de.
- **Palet seçimi Ayarlar › Okuma'da** (“Çerçeve: CM / Kâğıt”); varsayılan CM. Başlık şeridinin yazı rengi arma renginin parlaklığından (beyaz ya da mürekkep), Ayarlar'da nötr.
- **Prototip sayfası** (`prototipler/7-dosya-defter.html`; #cmSerit yok) eski masa şeridiyle çalışır.
- **Masaüstü yazı tipleri ertelendi** (B49): Nunito ve Plex Serif fontsource paketi indirmek gerekiyor; masaüstü kopyasında yedek yazı.

**Ölçüler:** şerit karenin %12,5'i, 104–148 px; 1366×650 (dizüstü) kare 824 + şerit 104; 1280×720 kare 917 + 115; 1366×1000 kare 1186 + 148; 776×560 kare 640 + 104 (genişlikten sınırlı pencere kare + şerit kadar daralır). Şerit yazısı en az 15 px; palet kontrastı CM'de yazı 10,0, etkin 13,6, İlerle 10,0, Haber var 5,6; Kâğıt'ta 13,9 / 6,8 / 10,5 / 6,5 (pasif düğme 5,4 ve 4,3). Kural ve kayıt değişmedi (sürüm 12); motor dosyası değişmedi.

**Denetimler (dizüstü, 2026-11-03):** `node araclar/hizli.js` geçti (ad denetimi, `mac-deneme 4` sonuç aynı, `kariyer-deneme` 691 sn). Akış: 1, 3, 22, 23, 26, 27, 30, 32, 34, 40 ve yeni **41** geçti; 21, 28, 36 ve 37'de yalnız gerçek zaman beklemeleri düştü (bakışın kapıya dönmesi, kişinin girişi, ikinci pencerenin açılışı, görüş açısının oturması) — 21, 28 ve 36 `main`'in kopyasında aynı biçimde düştü (B42). Düzeltilen gerçek hata: balkonda ←/→ bakışı alırken şeritteki odak bırakılmıyordu, ardından basılan Enter İlerle'ye basıyordu. `kontrol.py` index hata yok; prototipteki “hocalariKur is not defined” `main`'de de var (B39). `okunurluk.py` bu dizüstünde tamamlanamadı (başsız Chromium sekmesi çöküyor): beş genişlik masaüstündeki büyük kapıda; yazı ölçeğini sınayan akış 26 ve dar karede taşma denetimleri (3, 22, 41) geçti. Araç değişiklikleri: akışta odaya ait dar pencere denetimleri 672 → 776 px (kare 640), bant bölümleri (36, 37) 1600×900 → 1740×900 (kare aynı 1157, bant 406), eski masa şeridi seçicileri şeride ve sayaca; okunurlukta pencereler şerit kadar geniş (kare aynı), kare tuvalden ölçülür.

**CM1-b (dal `claude/cm1b-akis`, 2026-11-03, dizüstü):** uygulandı (YOL_HARITASI karar 87). Plandan sapmalar ve eklemeler (Claude kararı, gerekçeli):

- **`.pop()` düzeltmesi CM2-a'ya kaldı:** `ilerleOnizle`'nin `sinir` dalı İlerle'nin durduğu yeri değiştirir, iki sezon tabanını da; tabanlar CM2-a'da takvimle birlikte zaten yenilenir. Bu turda sezon sonucu değişmedi.
- **Okundu işareti açılışta çekilmez:** plan Haberler her açıldığında `an`'ı o ana çekmeyi öneriyordu; CM'nin haber kutusunda okunmamış satır açılmadıkça kalın kalır, listeye göz atmak okumak sayılmaz. `an` yalnız “Hepsini okundu say” ile ilerler; satır açılınca kimliği `idler`'e girer (telefon mesajı konuşmayla, rapor `raporGoruldu` ile okunur).
- **Kimlik ve sınıf biçimi:** kimlik `kaynak:an:…` (`tel`, `hb`, `rp`, `gc`; an kimliğin içinde, budama için). Listede sınıf `beklenen`/`okumalik`/`arka`; cevap bekleyenler listeye satır olarak girmez, Cevap bekliyor sekmesinde kartlardır (`gelismeBekleyenler`), çünkü kararın yeri iştir, haber değil. Kanallar telefon, gazete, lig, dosya, ajanda, para, kapı.
- **Üç “cevap bekleyen” tanımı tek işleve inmedi:** Cevap bekliyor, Haber var ve Sonra yığını aynı kaynağı (`sonraKararlari`) okur; ekrandaki `kararBekleyen` masadaki 3B dosyanın işareti için kaldı (dosyadaki konu kararı; birleşme CM2-b'nin dosya şablonlarında).
- **Gazete boş günde `gazeteSayisi` değişmedi:** okuyucuların (eski sayılar, gelişme listesi) sözleşmesi bozulmasın diye boşluk ekranda çözüldü — masadaki gazete boş günde “yeni” değil (`odaIzleri`), masadan açılınca son dolu sayı, gezinti boş sayıları 21 güne dek atlar.
- **İniş yalnız odada:** balkonda izlerken İlerle'nin akışı biterse Haberler açılmaz (izleme bozulmasın); ziyaret varsa önce ziyaret. Ofis (özet) seçiliyken ve şeritsiz prototipte durak özeti kartı; şeritli odada özetin telefon, gazete ve rapor cümleleri tek “Haberler: n cevap · m yeni” cümlesine indi.
- **Gün başı notu 8 tuşunda ve masada kaldı;** Haberler'in Bugün bölümü notun gövdesini taşır, Haberler'i açmak notu okundu yazar. Not Haber var sayacına girmez (sayaç Haberler'in okunmamışlarıdır).
- **Haberler'den açılan iş ‹ Geri ile Haberler'e döner** (satır, Cevap bekliyor kartı, takipteki dosya, defter); cihazın kendi geri adımı varsa (Canlı Skor'da alt sayfa, kadrodaki oyuncu, transferdeki oyuncu kâğıdı) önce o.
- **Deneme ortamı:** akış denemesinde eski bölümler İlerle'den sonra masaya dönüş üzerine yazılmıştı; sayfa açılışında ayar “Ofis (özet)” yapılır, yalnız adresinde `inis=` olan bölüm (42) varsayılanla koşar.

**Ölçüler:** gelişme listesi 14 günde ~7 ms (Node, TEST içerikli kariyer, 13 gelişme). Kayıt sürümü 12 (yalnız isteğe bağlı `gelismeOkunan`); motor dosyası değişmedi.

**Denetimler (dizüstü, 2026-11-03):** `node araclar/hizli.js` geçti (ad denetimi, `kariyer-deneme` yeni CM1-b bölümüyle, 361 sn); son ekran düzeltmesinden sonra ad denetimi ve `git diff --check` temiz. Akış: 25, 39, 40, 41 ve yeni **42** geçti (42: şeritten Haberler, İlerle'den sonra iniş ve Cevap bekliyor, kartın yerinde açılıp ‹ Geri ile dönüşü, okunmamış satırın ortamı ve sayacın düşüşü, 9, TV'de 100 yok, Ofis ayarı); sayfa ve betik hatası yok. Kâğıdın opaklığı ve odanın perdesi gecikmeli görüntüyle doğrulandı (akışın görüntüleri açılış geçişinin ortasındaydı; bekleme eklendi). Ağır denetimler (akış tamamı, iki sezon tabanı, okunurluk beş genişlik, `oturum-sonu --ayni --seyrek`, kontrol, akis-2d, hız bütçesi) masaüstündeki büyük kapıda; okunurluk bu dizüstünde başsız Chromium'u çökertiyor.
