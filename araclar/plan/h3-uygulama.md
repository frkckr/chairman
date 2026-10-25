# H3 — Yeni sezon ve sezon geçişi, kayıpsız sezon arşivi (uygulama planı)

Durum: planlandı 2026-10-25 gece (Fable); uygulama Opus 5.5, oto mod 3, masaüstü. Dal `claude/h3-yeni-sezon` (taban `tur/h2-istekler` (H2 kullanıcı istekleri sonrası)), etiket `tur/h3-sezon`. YOL_HARITASI 5.1 (sezon geçişi; TEST tarifiyle, kesin lig formatı açık — karar 36, OYUN_TASARIMI §13), 5.2'nin başlangıcı (sezon arşivi ve kayıt bileşimi ölçümü), borçlar `macOkundu`, `yasUret` 2026 sabiti, ay başı zincirinin sezon sonunda kesilmesi, `ILERLE_SINIRI` tuzağı. Program `araclar/plan/h-program.md`.

## Kapsam

### H3-0 — sigorta ve araçlar (ilk commit; kural dosyasına dokunulmaz)
- `araclar/sezon-deneme.js`: `--kayit-yaz DOSYA[@hafta=N|@sezonSonu]` — o haftanın sonuç komutundan sonra ya da sezon sonu döngüsünden (bugünkü `sezonSonu` bloğu: sözleşme kartları cevapsız, ay başı, İlerle engeli) sonra `kayitMetni(k)` zarfını dosyaya yazar; `--bilesim` — sezon sonunda `JSON.stringify` ile alan başına KB (`oyuncular`, `fikstur`, `maclar` bizim/öbür ayrı ve kayıt başına ortalama bayt, `gecmis`, `hareketler`, `isler`, `meseleler`, `olaylar`, `kisiler`, kalan; toplam); tempo sayaçları — hafta döngüsündeki `duragaIlerle` çağrı sayısı ve dönüşün `neden` dağılımı (karar, randevu, sonCevap, cevapsiz, haber, cakisma, sinir), hafta içinde doğan karar kartı sayısı; tabloya “durak” sütunu, sona “Tempo (ölçü; normal tempoda oynama yerine geçmez)” satırı; `--json` çıktısına aynı alanlar.
- Bugünkü kodla üç sürüm 9 örneği (`node araclar/sezon-deneme.js … --tek --kayit-yaz …`): `araclar/ornekler/kayit-s9-hafta14.json` (tohum 7, `@hafta=14`: 13. hafta sonrası, ilk ay başından önce), `kayit-s9-ocak.json` (tohum 7, `@hafta=19`, `--teklif cevapsiz`: 9 Ocak 21:00, 7 Ocak gelen teklifin kartı açık — son cevap 10 Ocak 18:00), `kayit-s9-sezonsonu.json` (tohum 7, 18 hafta, `@sezonSonu`: `sezon.sonuc` var, sözleşme kartları cevapsız geçmiş, ay başı zinciri 1 Nisan'da kesilmiş, İlerle engelli). Boyut ~150 KB × 3; depoya girer (G2'nin s8 emsali).
- İsteğe bağlı (zaman kalırsa): `araclar/senaryolar/d-sut.js` “Üst köşe ≥18 m kurtarış” NaN teşhisi (20 ve 25 m'den `üst köşe` hücresinde kurtarış+gol 0; yapay şut üreticisi `S.dene` o hedefe üç hızda da çerçeve dışı atıyor mu — hız/mesafe eğrisi `tipik(u)`, hedef yüksekliği). Yalnız araç kusuru kanıtlanırsa hücre düzeltilir; kanıtlanmazsa satıra dokunulmaz, teşhis borç listesine yazılır (kapı gevşetilmez).
- Commit; `node araclar/kariyer-deneme.js` hâlâ çıkış 0.

### H3-a — sezon tarifi ve geçiş (`js/fikstur.js`)
- `sezonTarifi(yil)` (TEST): `{id:`${yil}-${String((yil+1)%100).padStart(2,'0')}`, ilkHafta:1, ilkMacTarihi: Eylül'ün ilk Cumartesi (2027 → '2027-09-04'), dakika:1140, transfer:[{ad:'Yaz transfer dönemi',bas:`${yil}-06-15`,bitis:`${yil}-08-31`},{ad:'Kış transfer dönemi',bas:`${yil+1}-01-04`,bitis:`${yil+1}-01-31`}]}`. İlk kariyerin `SEZON_TEST` tarifi (ilkHafta 13, 2026-11-28, yalnız kış) birebir korunur; `sezonKur` değişmez, `kariyerBaslat` çıktısı aynı.
- `YENI_SEZON_TEST={ay:6,gun:1,dakika:540}` (1 Haziran 09:00; sözleşmeler 31 Mayıs biter, ay başı 10:00'dan önce).
- `yeniSezonKur(k)` (katı kip, kopyala-yaz; başkanın kulübü pivot): (1) arşiv `k.sezonlar=k.sezonlar.concat([{id,kod,sezonAdi,sonuc,fikstur:k.fikstur,maclar:k.maclar,sayaclar:{oyuncuId:{gol,sari}} (başkanın kulübünün oyuncuları),hocaId}])` — eski `fikstur` ve `maclar` olduğu gibi, veri atılmaz; (2) `k.sezon` yeni nesne: `ad`, `grup`, `bolgeler`, `takimlar` eskiden; `sezonAdi` '2027–28'; `etiket:'TEST'`; tarif alanları; `devralinan:{tablo: 16 kulüp {G:0,B:0,M:0,A:0,Y:0}, sonMaclar:{}}` (`fiksturIcDenetim` G+B+M = ilkHafta−1 = 0 ile tutar); (3) `k.fikstur=fiksturUret(takimlar,[],biz,parseInt(saglamaHesapla(`${k.dunyaTohumu>>>0}:${yeniId}`),16)>>>0)` — sabitsiz yol; kimlikler `mac-2728-…` (`macKimligi`), tarih `haftaTarihi`; (4) `k.maclar={}`, `k.macOkundu=[]`; (5) `oyuncuSayaclariSifirla(k)` (`js/kariyer-kadro.js`: bütün oyuncularda `gol`, `sari` 0; `ceza` taşınır — bugünkü TEST kuralı —, `sakat` tarih bazlı sürer); (6) `sezonTakvimiKur(k,biz)` — geçmiş anlı hatırlatma atlanır (savunma); `transferTakvimiKur(k)`; (7) geçmişe `{tur:'yeniSezon',eskiId,yeniId,tarih,dakika}`.
- `IS_TURLERI.yeniSezon` (görünür rutin iş; `js/fikstur.js`'te — `js/takvim.js`'ten sonra yüklenir): `denetle:(k,v)=>k.sezon&&k.sezon.sonuc?[]:['yeni sezon: sezon sonu kaydı yok']`, `baslik:()=>'Yeni sezon: fikstür açıklanır'`, `uygula:(k,is)=>{yeniSezonKur(k);return{metin:`Yeni sezon kuruldu: ${k.sezon.sezonAdi}; ilk maç ${gunAyYazi(ilkMac)} 19:00 (TEST).`};}`; `sezon.sonuc` yoksa ya da iş ikinci kez gelirse reddeder (`denetle`).
- `sezonSonuYaz`: hatırlatma metni “… Yeni sezonun fikstürü 1 Haziran'da açıklanır (TEST).”; `isEkle(k,{tur:'yeniSezon',tarih:`${bitisYili}-06-01`,dakika:540,veri:{sezonId}})` (`bitisYili=sezonBitisYili(k)`); `ILERLE_ENGEL_EKLERI` satırı yalnız `yeniSezon` işi yokken `SEZON_SONU_METNI` (yedek).
- `sezonlarDogrula` (`EK_DENETIMLER`): `k.sezonlar` dizi; her kayıt düz nesne, `id` `^\d{4}-\d{2}$`, tekil ve `k.sezon.id`'den farklı, `kod` biçimde, `sonuc` G1-d biçiminde (tablo 16, şampiyon tablo[0]), `fikstur` dizi, `maclar` nesne; `k.sezonlar` `PAYLASILAN_ALANLAR`'a eklenir (`js/kariyer.js`; dondurulur, kopyala-yaz).

### H3-b — zincirler ve borçlar
- `js/kulup-mali.js`: `IS_TURLERI.ayBasi.uygula` sonraki ayı sezon sonu kaydından bağımsız kurar (`if(!(k.sezon&&k.sezon.sonuc))` kalkar; G2 kararı 44'ün “sezon sonu kaydından sonra kurulmaz” sınırı 5.1 ile kaldırıldı — gerekçe belgeye); `nakitUfku` ay başlarını ufuk boyunca sayar (`sonMac`/`sonuc` kesmesi kalkar); bilet tahmini yeni fikstürden kendiliğinden.
- `js/ajanda.js` `ILERLE_SINIRI` 30 → 32 (TEST): ajanda işi yokken `ilerleOnizle` (`isSonAn(x)<=simdi+ILERLE_SINIRI*1440`) 1 Mayıs 10:00'dan 1 Haziran 09:00/10:00'a (30 gün 23 saat) ve 31 günlük aylarda ay başından ay başına ulaşamıyordu, “Takvimde bekleyen bir gelişme yok” derdi (kodla doğrulandı).
- `js/kariyer-kadro.js`: `yasUret(r,mevki,aralik,yil)` — `2026` sabiti yerine yıl; `oyuncuUret` `o.yil` alır, `kadroUret`/`kadroKopyala`/`gencEkle` `Number(k.tarih.slice(0,4))` geçer (rastlantı çekiş sırası değişmez; 2026 başlangıcında kayıt birebir aynı); `GENC_YAS` yorumu; `oyuncuSayaclariSifirla(k)` kopyala-yaz.
- `js/mac-okuma.js`: yorum (`macOkundu` sezon geçişinde temizlenir; `macOkumaDogrula` oynanmış maç ister).
- `js/icerik-p12.js`: kontrol — `hocaBaskisi` gelişmesi (`veri.macId`) maç akşamı tüketilir, 1 Haziran'a kalmaz; sabır hatırlatması (`veri.hocaSuresi`) tarih bazlıdır. 5.1d'de denetlenir: yeniSezon öncesi `veri.macId` taşıyan bekleyen gelişme yok.
- `js/sozlesme.js`: değişmez; `sezonBitisYili` yeni `k.sezon.id`'den 2028 (kendiliğinden); `SEZON_SONU_EKLERI` aynen. `js/transfer.js`: `transferTakvimiKur` listeyi okur (yaz dönemi planı aynı TEST günler: talep +1, teklif +3/+12/+22); `transferDonemi` yaz dönemini tanır; değişiklik gerekmeyebilir.

### H3-c — kayıt sürümü 10
- `js/kariyer.js`: `KARIYER_SURUM=10`; `kariyerDogrula` `sezonlar` dizi; `PAYLASILAN_ALANLAR` + `'sezonlar'`; sürüm notu.
- `js/kayit.js` `KAYIT_GECISLERI[9]` (düz veri; kural işlevi çağırmaz, para hareketi üretmez): `v.kayitSurumu=10; v.sezonlar=[]`; `v.sezon&&v.sezon.sonuc` ve bekleyen `yeniSezon` yoksa `yeniSezon` işi (`${Number(v.sezon.id.slice(0,4))+1}-06-01` 09:00; o an `v.tarih`/`gunIciDakika`'dan önceyse ertesi gün 09:00); başkanın kulübüne bekleyen `ayBasi` yoksa sonraki ayın 1'i 10:00 (G2'nin ayın 1'i 10:00 kuralıyla). `ESKI_KAYIT_SINIRI` 8 kalır (8→9→10 zinciri).
- `js/kariyer-ornek.js` `kayitSurumu:10`, `sezonlar:[]`; `js/baslangic.js` `sezonlar:[]`.

### H3-d — ekranlar (yeni ekran yok)
- `js/ekran-oda.js` `ilerleOzeti`: `r.biten` içinde `isTuru==='yeniSezon'` varsa baş cümle onun `sonuc.metin`i (bugün yeni ajanda işi doğuran durak “Yeni bir gelişme var; dosyada” derdi). Canlı Skor “Sıradaki · Cumartesi 4 Eylül” ve “Son maç” yokluğu fikstürden kendiliğinden; defter yeni maç günleri.
- `js/ekran-mac-oncesi.js` bülten: puan tablosu 0 maç ve boş son 5 (`T.son.length?` toleransı) doğrulanır; gerekirse küçük düzeltme.
- Eski sezonun hoca yorumları (`MESAJ_KAYNAKLARI`) ve defter notları `k.fikstur`/`k.maclar` okuduğu için düşer — kabul edilen TEST sınırı, kullanıcıya soru.

### H3-e — araçlar
- `araclar/sezon-deneme.js`: `--sezon N` (çok sezon): hafta sayacı sezonun kalanını aşarsa sezon sonu döngüsü (`--sozlesme cevapsiz|yenile|birak`, varsayılan cevapsız), ay başları, `yeniSezon` işi görülünce ikinci sezonun haftaları; maç gününe İlerle döngüsü sınırı 20 → 60 adım (yaz durakları); tabloya “Sezon geçişi” satırı (tarih, kayıt boyu önce/sonra, kasa, yaz dönemi gelişme sayısı); belirlenimcilik iki sezon üstünden; `--kayit-yaz X@sezonBasi` (yeniSezon'dan sonra, ilk maçtan önce).
- `araclar/kariyer-deneme.js`: 5.1a güncellenir (hatırlatma metni; İlerle engeli yok, `yeniSezon` işi bekliyor); yeni “5.1d — yeni sezon”: tohum 7, 18 yapay hafta → sezon sonu → İlerle: 1 Nisan ve 1 Mayıs ay başları (maaş hareketleri), sözleşme kartları (cevapsız), 1 Haziran 09:00 `yeniSezon` → `k.sezonlar.length===1` (id '2026-27', `sonuc` tablo 16, şampiyon aynı, `maclar` 240 kayıt ve `fikstur` 240 eskiyle birebir, `sayaclar` bizim oyuncular), `k.sezon.id==='2027-28'`, `kod==='2728'`, `ilkHafta===1`, `haftaSayisi===30`, `ilkMacTarihi==='2027-09-04'`, devralınan tablo sıfır ve `sonMaclar` boş, `k.fikstur.length===240` kimlikler `mac-2728-…` tekil ve her takım her hafta tek maç, 2027-28 fikstürü 2026-27'den farklı, `k.maclar` ve `k.macOkundu` boş, bütün oyuncularda `gol===0&&sari===0`, cezalı oyuncunun `ceza` korunmuş, hoca aynı ve sözleşmeli, bütün sözleşmelerin `bitis>='2028-05-31'`, `k.sezon.transfer` [yaz, kış] ve yaz dönemi gelişme işleri kurulu (talep 16 Haz, teklif 18/27 Haz, 7 Tem), tek bekleyen maç günü işi 2027-09-04 19:00, `ayBasi` zinciri sürüyor (1 Haziran 10:00 bekliyor), `ilerleOnizle` engeli yok, `yeniSezon` öncesi `veri.macId` taşıyan gelişme yok; 28 Mart → 4 Eylül `duragaIlerle` zinciri engel vermeden ilk maç gününe ulaşır (31 günlük aylarda “Takvimde bekleyen bir gelişme yok” çıkmaz); yaz boyunca ay başları ve maaş hareketleri (Nisan–Eylül); `nakitUfku` ay başlarını ufuk boyunca sayar; ikinci sezonun ilk haftası yapay sonuçla oynanır → `sezonTablosu` 16 kulüp O=1; aynı tohumla ikinci kuruluş birebir; kaydet–yükle birebir; `yeniSezon` ikinci kez uygulanamaz (`sonuc` yok → ret); gençlerin yaşı 2027'de 18–21; bozuk kopyalar (`sezonlar` kaydı eksik alan, arşiv id = sezon id, `macOkundu`'da eski sezon kimliği, iki `yeniSezon` işi) yakalanır. Yeni “1.4c — geçiş 9→10”: `kayit-s9-hafta14.json` ve `kayit-s9-ocak.json` 9→10 (`gecisler` '9→10', yalnız `sezonlar:[]`; Ocak örneğinde teklif kartı yerinde ve cevaplanabilir), `kayit-s9-sezonsonu.json` → `yeniSezon` (2027-06-01 09:00) ve eksik `ayBasi` eklendi, İlerle 1 Haziran'a varır, geçişten sonra `k.sezon.id==='2027-28'`; `kayit-s8-hafta14.json` 8→9→10; geçiş para hareketi üretmez (`hareketler` uzunluğu aynı). 3.1 parmak izi (`kariyerBaslat({tohum:7}).oyuncular` metni) H1'dekiyle aynı.
- `araclar/akis-deneme.py` yeni §21 “İkinci sezon”: `araclar/ornekler/kayit-s10-sezon2.json` (`node araclar/sezon-deneme.js 36 7 --tek --sezon 2 --kayit-yaz …@sezonBasi`; H3 koduyla) bölüm 2'nin kalıbıyla (`add_init_script` → `localStorage 'chairman:oyun-1'`) yüklenir; oda açılır (`.od-bozuk` yok), Canlı Skor “Sıradaki · Cumartesi 4 Eylül”, defterde maç günü, İlerle → Stada git → bültende puan tablosu 0 maç ve boş son 5 → “Maçı bitir” → kart → Odaya dön → tablo 16 kulüp O=1, `OYUN.kariyer.sezonlar.length===1`, `OYUN.kariyer.sezon.id==='2027-28'`. §2 aynen (sürüm 7 örneği reddedilir).
- `araclar/KAPILAR.md` “Sezon geçişi” satırı (kariyer-deneme 5.1d/1.4c, sezon-deneme `--sezon 2`, akis 21, kayit-deneme.html).

## Yapılmayacaklar

- Kesin lig formatı: yükselme/düşme, play-off, `LIG.bolgeler`'in sonucu, kademe değişimi, takım sayısı (karar 36; OYUN_TASARIMI §13 satırı açık kalır); yeni kulüp ya da 16 dışı takım.
- Veri atan sıkıştırma: eski sezonun `maclar`/`fikstur` kaydı atılmaz, özete indirilmez (TEKNIK_PLAN §11 saklama düzeyi kullanıcıyla); yalnız ölçüm.
- Yeni geçiş ekranı, sezon özeti sayfası, arşiv sekmesi, istatistik görünümü (karar 46–47): arşiv yalnız veri; geçiş mevcut hatırlatma/İlerle özeti diliyle.
- Yaşlanma, emeklilik, oyuncu gelişimi, nüfus üretimi (5.7, Aşama 7); AI kulüpler arası transfer; yaz dönemi için yeni transfer dalı (H4).
- Ekonomi tutarlarının dengelenmesi (TEST; kasa erirse raporlanır, kriz içeriği P01 kullanıcının).
- Motor dosyası, `MOTOR_AYAR`, taban, 80 maç; `digerMacSecenegi`, maç kaydı ve kayıt zarfı biçimi; `fiksturUret` algoritması.
- Ses, yetenek puanı, yeni kişi ya da senaryo metni (yalnız TEST başlık ve hatırlatma metinleri).

## Kayıt sürümü

10. `KAYIT_GECISLERI[9]` düz veri (`sezonlar:[]`; sezon sonu kaydı olan kariyere `yeniSezon` ve eksikse `ayBasi` işi). Sürüm 9 örnekleri H3-0'da kod değişmeden üretildi; `ESKI_KAYIT_SINIRI` 8 kalır (8→9→10). `k.sezonlar` paylaşılan alandır.

## Kabul

- H3-0'dan sonra: üç `kayit-s9-*.json` bugünkü kodla üretildi ve commit'lendi; `node araclar/kariyer-deneme.js` çıkış 0; `node araclar/sezon-deneme.js 18 3 --kaydet --bilesim` tabloda durak sütunu, Tempo ve bileşim satırları, belirlenimcilik “aynı”.
- `node araclar/kariyer-deneme.js` çıkış 0: 5.1d ve 1.4c geçer; 5.1a yeni duruma uyar; 3.1 parmak izi aynı; 1.4b (8→9→10) geçer.
- `node araclar/sezon-deneme.js 36 3 --kaydet --sezon 2` (masaüstü, ~10–15 dk × 2): birinci sezon 18 hafta, yaz geçişi, ikinci sezon 18 hafta; kulüplerin maç sayısı her hafta eşit; aynı tohumla ikinci koşu birebir; her hafta kaydet–yükle farksız; `yeniSezon` 2027-06-01; Sezon geçişi satırında kayıt boyu önce/sonra (bilgi; arşiv kayıpsız olduğu için küçülme beklenmez — sayı devam notuna); kasa yaz boyunca aylık −(maaş − lig payı) ile erir, çökme yok (bilgi).
- `node araclar/sezon-deneme.js 36 7 --tek --sezon 2 --teklif sat --talep onayla --p12 degisim`: yaz döneminde gelen teklif ve hocanın isteği çalışır (transferler satırında Haziran/Temmuz tarihli kayıt), hoca değişimi sezon sınırını bozmaz, kariyer geçerli.
- `node araclar/mac-deneme.js 4` “sonuç aynı”; `node araclar/oturum-sonu.js araclar/taban/g1.json --ayni` 40/40 (motor değişmedi); kapanışta `--seyrek`.
- `node araclar/ad-denetimi.js` temiz (yeni adlar: `sezonTarifi`, `yeniSezonKur`, `sezonlarDogrula`, `oyuncuSayaclariSifirla`, `YENI_SEZON_TEST`).
- `python -X utf8 araclar/akis-deneme.py 1 2 19 21` geçer; ardından tamamı masaüstünde (bilinen düşüş 15b).
- `python -X utf8 araclar/kontrol.py` hatasız; `python -X utf8 araclar/kontrol.py araclar/kayit-deneme.html` (kayıt sürümü değişti); `python -X utf8 araclar/akis-2d.py` bilgi.
- Geçiş düz veri: `KAYIT_GECISLERI[9]` kural işlevi çağırmaz (kod incelemesi), 1.4c'de hareket sayısı değişmez.
- Belgeler: TEKNIK_PLAN §3/§5/§9/§11, OYUN_TASARIMI §13 satırı (“kesin format açık” kalır); `git diff --check`; `tur/h3-sezon` etiketi; `main` ileri sarıldı ve push edildi.

## Riskler

- Kayıt sürümü 10 ve 9→10 geçişi ters dönüşü zor → sigorta: s9 örnekleri önce, geçiş düz veri, 8→9→10 zinciri 1.4c'de.
- Dondurulmuş paylaşılan alanlar (`sezon`, `fikstur`, `maclar`, `oyuncular`, yeni `sezonlar`) yerinde yazılırsa katı kipte komut düşer → `yeniSezonKur` yalnız yeni nesne kurar; 5.1d bütün yolu dolaşır.
- `ILERLE_SINIRI` tuzağı (31 günlük aylar, 1 Mayıs → 1 Haziran) → 32; 5.1d'nin yaz zinciri denetimi şart.
- `fiksturUret(takimlar,[],pivot,tohum)` sabitsiz yol hiç çalıştırılmadı → ilk denemede hata verebilir; 3.1'in fikstür denetimleri (her takım her hafta tek maç, aynalı ikinci devre, çift devre 240) yeni fikstüre uygulanır.
- Yaz dönemi 15 Haziran–31 Ağustos seçildi: 1 Haziran'da başlayan dönem `sezonTakvimiKur`'un 08:00 hatırlatmasını geçiş anından (09:00) geriye düşürür (`isEkle` geçmişi reddeder); yine de geçmiş anlı hatırlatma atlanır (savunma).
- Yaz ekonomisi (Nisan–Ağustos maaş, yalnız lig payı, bilet yok) kasayı TEST ölçekte eritir → denge değil tutarlılık sınanır, kullanıcı sorusu.
- Eski sezonun okumaları ekrandan düşer (`MESAJ_KAYNAKLARI`, defter notu, Canlı Skor son maç) → kabul edilen sınır; arşivden okuma yeni ekran ister (karar 47).
- `sezonBitisYili` +1 kayar: geçişten sonra kurulan sözleşmeler 2028+; 5.1d bitişleri denetler.
- P12 `hocaSuresi`/`hocaBaskisi` fikstüre bağlı veri taşırsa `denetle` yeni fikstürde bulamaz → 5.1d öncesi kontrol; `sezon-deneme --p12 sabir --sezon 2`.
- Süre: `sezon-deneme 36 … --sezon 2` belirlenimcilik koşusuyla masaüstünde ~20–30 dk; bütçede; dizüstünde koşulmaz.
- Kullanıcı sorusu doğurma: G1'de “sezon geçişi yok” kapsam sınırıydı (karar 43); 5.1 yol haritasında ve görev havuzunda; takvim ayrıntıları TEST ve devam notunda soru.

## Claude kararları (belgeye görünür yazılır)

- Sezon geçişi iki evreli: sezon sonu kaydı (G1-d) aynen; yeni sezon `yeniSezon` görünür rutin işiyle 1 Haziran 09:00'da (TEST) kurulur; nisan–mayıs sözleşme kartları ve ay başlarıyla, 15 Haziran–31 Ağustos yaz transfer dönemiyle geçer.
- TEST tarif ikinci sezona aynı biçimde taşınır: aynı 16 kulüp, 30 hafta, Eylül'ün ilk Cumartesi 19:00 (2027-09-04), ara yok, kış 4–31 Ocak; devralınan tablo sıfır (ilkHafta 1). Kesin lig formatı kullanıcı kararıdır; bu tarif onu kesinleştirmez.
- Sezon arşivi `k.sezonlar` kayıpsızdır (eski `fikstur` ve `maclar` olduğu gibi + sonuç, bizim oyuncuların sayaçları, hoca); sıkıştırma biçimi (5.2) ölçümle kullanıcıya; arşiv yalnız veridir, görünür yeri bilgi mimarisi kararıyla.
- Fikstür tohumu `saglamaHesapla(`${dunyaTohumu}:${sezonId}`)` (maç tohumu kalıbı); maç kimlikleri sezon koduyla tekil; belirlenimci.
- Sayaçlar: gol ve sarı sıfırlanır; kalan maç cezası devreder (TEST); sakatlık tarihle sürer; yaş kariyer tarihinden; `macOkundu` temizlenir.
- Ay başı zinciri sezon sonundan bağımsız sürer (karar 44'ün G2 sınırı kaldırıldı); nakit ufku ay başlarını ufuk boyunca kesin sayar.
- `ILERLE_SINIRI` 32 gün (TEST sabiti).
- Kayıt sürümü 10; geçiş düz veri; sürüm 9 örnekleri değişiklikten önce; sürüm 8 zinciriyle açılır.

## Belgeler

- TEKNIK_PLAN §3 (sürüm 10 tablosu: `sezonlar`, `yeniSezon` işi, geçmişte `yeniSezon`; `sezonTarifi`), §5 (geçiş 9→10 ve örnekler), §9 (sezon geçişi TEST tarifiyle uygulandı; kesin format açık; arşiv kayıpsız, saklama düzeyi açık), §11 (sezon-deneme çok sezon, bileşim, tempo).
- OYUN_TASARIMI §13 tablosu (TEST tarifine geçiş günü ve yaz dönemi; “tam sezon için Aşama 5 öncesi kesinleşmeli” kalır), §6 (maçsız aylarda İlerle ay başlarına ve geçişe; `ILERLE_SINIRI` TEST), §7 ve §8 “Bugünkü uygulama (H3)” (yaz maaşları, yaz dönemi).
- YOL_HARITASI: 5.1 kısmi (sezon geçişi TEST tarifiyle; format açık), 5.2 kısmi (arşiv, bileşim ölçümü), karar 49 “H3 kararları (Claude)”, devam notu (borçlar: `macOkundu`, `yasUret`, “yeni sezon yok” kapandı; kalan: yükselme/düşme, emeklilik, AI transfer, sıkıştırma; bileşim ve tempo sayıları; kullanıcı soruları), Tamamlanan turlar `tur/h3-sezon`.
- CLAUDE.md “Bugün çalışan” (kayıt sürümü 10, sezon geçişi), “Program”.
- `araclar/KAPILAR.md` sezon geçişi satırı; `araclar/plan/h3-uygulama.md` sapmalar; `araclar/plan/f-program.md` durum satırı; `araclar/plan/OKU.md`.

## Sapmalar

(boş — uygulama sırasında doldurulur)
