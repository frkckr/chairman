# G2 — Sözleşmeler, para akışı ve transfer iskeleti (uygulama notu)

Durum: 2026-10-24 gece, masaüstü, oto mod 2 (kullanıcı kararı 43: ikinci tur "ikisi birden"). Dal `claude/g2-sozlesme`, etiket `tur/g2`. Claude'un kararları YOL_HARITASI 44.

## Kapsam

- **Sözleşme ve maaş (`js/sozlesme.js`):** oyuncu kaydında `sozlesme = null | {maas (kuruş/ay), bitis}`, hoca kişisinde aynı. TEST ölçek: maaş gizli özellik ortalamasından (kalecide kalecilik ağırlıklı), 21 yaş altı ×0,6, 32 üstü ×0,85, 500 ₺'ye yuvarlanır (Demirkapı 22 oyuncu + hoca ≈ 490 bin ₺/ay); bitiş tohumdan bu sezon / +1 / +2 yıl 31 Mayıs. `sozlesmeleriTamamla` idempotent; `aylikMaas`; `hocaTazminati` = kalan ay × maaş (P12 değişiminde, değişimden önce hesaplanır).
- **Ay başı (`js/kulup-mali.js`, görünür rutin iş `ayBasi`, ayın 1'i 10:00):** kadrolar 22'ye, sözleşmeler tamamlanır; maaşlar (`maas`) ve lig yayın payı (`ligPayi`, 100 bin ₺ TEST); transfer takvimi onarılır; sonraki ay kurulur (sezon sonu kaydı varsa kurulmaz).
- **Maç günü geliri:** iç saha maçından sonra `bilet` = kapasite (`statKapasitesi`, Demirkapı 3.823) × doluluk (0,3; maç sayfasının çizdiği seyirciyle aynı formül `dolulukTest`) × 150 ₺ (≈ 172 bin ₺); deplasman ve hükmende yok.
- **Nakit ufku:** `nakitUfku(k, kulüp, 90)` — bekleyen ödemeler ve ay başları kesin, iç saha biletleri belirsiz ve ayrı; odada kasa panelinde (aylık maaş yükü, en düşük kesin bakiye, 90 gün sonra, belirsiz gelir, son hareketler).
- **Sezon sonu sözleşmeleri (`SEZON_SONU_EKLERI`):** bizim kulübün bitenleri için sıralı iki cevaplı kart [Yenile (iki yıl, maaş en az eskisi ve tahmini, ×1,1) / Bırak]; acil değil (7 gün), cevapsız → imza yok, oyuncu ayrılır; bırakılan serbest kalır, kadro gençle 22. Öbür kulüpler ve hocalar kendiliğinden +1 yıl.
- **Transfer (`js/transfer.js`):** dönem `k.sezon.transfer` (kış 4–31 Ocak); gizli gelişmeler 11:00'de: dönem başından +1 gün hocanın isteği (5 Ocak), +3/+12/+22 gün gelen teklif (7, 16, 26 Ocak). Gelen teklif: değerce ilk altı saha oyuncumuzdan biri, tabloda üstümüzdeki kulüpten, bedel değer × 0,9–1,2; [Sat / Reddet], cevapsız → geri çekilir. Hocanın isteği: en zayıf hat, bütçe (bonservis 400 bin–1,2 M ₺, maaş tavanı ortalama ×1,3), soran hoca; [Bütçeyi onayla / Reddet]; onayda 5 gün sonra imza: serbest oyuncu, yoksa tabloda altımızdaki kulüpten bütçeye uyan en iyi (bedel = değer), yoksa "bulunamadı". `oyuncuTransfer` ilk 11 yuvasını yedekten doldurur, numara çakışmasında ilk boş numara, geçmişe `transfer`/`ayrilis`.
- **Kayıt sürümü 9:** `KAYIT_GECISLERI[8]` (2.8L'den sonraki ilk geçiş): ilk ay başı işi eklenir; sürüm 8 kariyer açılır, sözleşmeler ve kadro tamamlaması o ay başında. Örnek `araclar/ornekler/kayit-s8-hafta14.json` (tur/g1 kodu).

## Sapmalar (plana göre)

- `maliDurum`'a `ufuk`/`eksi` alanı eklenmedi: kasa paneli `nakitUfku`'yu doğrudan okur, eksi kasa panelde kırmızı (kural etkisi yok, plandaki gibi).
- Ay başı sezon sonu kaydından sonra yeniden kurulmaz (yeni sezon yok; yoksa İlerle maçsız aylarda maaş ödemeye sürerdi ve “Sezon tamamlandı” engeli gelmezdi).
- Transfer hedefleri yalnız saha oyuncusu (kaleci yuvası güvencesi; TEST).

## İnceleme (dört boyut — para, transfer, sözleşme, kayıt; her bulguya bir doğrulayıcı)

Doğrulanan 19 bulgu (yinelenenler birleşince 9 sorun); hepsi düzeltildi ve `kariyer-deneme`'ye denetim eklendi:
- **Yüksek — iki kalecinin sözleşmesi birlikte bitince** (tohumların ~%10'u) ikincisinin Bırak'ı ya da cevapsız kartı komutu çökertiyor, İlerle takılıyordu (gençler kaleci değil). Kaleci kadrodan çıkmadan önce kadroda iki kaleci kalması sağlanır (`kaleciGuvence`, genç kaleci; kadro bir süre 22'yi aşabilir). Denetim 5.1c (tohum 10: Bırak ve cevapsız).
- **Orta — hocanın istediği hat hep savunma:** ham özellik ortalaması mevkiler arasında kıyaslanamıyor; artık ligin aynı hattıyla kıyaslanır (5 tohum × 16 kulüpte üç hat da çıkıyor).
- **Düşük:** transferde kaptan bayrağı oyuncuyla gidiyordu (alan kulüpte iki kaptan); onayla imza arasında hoca değişirse teşekkürü ayrılan hoca ediyordu (artık görevdeki hoca); geçişten sonra ilk ay başına dek kasa paneli maaş yükünü 0 ve ay başlarını “kesin +100 bin” gösteriyordu (artık kurulacak TEST maaşıyla); nakit ufku sezon sonrası hiç gelmeyecek ay başlarını kesin sayıyordu (artık son maçtan sonraki ilk ay başında durur); geçiş ayın 1'i 10:00'dan önceki kayıtta o ayın ay başını atlıyordu; Ocak tarihli sürüm 8 kaydında kış transfer dönemi tamamen kaçıyordu (gelişmeler artık geçişte, transferTakvimiKur planının donmuş kopyasıyla); gelen teklifin telefonda izi yokken oda “Telefon: karar gerektiren bir haber” diyordu (artık yeni karar telefonda değilse “Masada yeni dosya”).
- **İkinci inceleme** (düzeltme commit'i, üç boyut; 7 bulgu, hepsi doğrulandı, 4 sorun; düzeltildi ve denetim eklendi): oda özeti telefonda önceden bekleyen herhangi bir karara bakıyordu (hocanın isteği beklerken gelen teklif “Telefon” deniyordu; artık bu anda gelen kararın yeri — `js/mesajlar.js` `simdiGelenKararlar`, `kararTelefondaMi`); sürüm 8'den Mart'ta geçen kayıtta ilk ay başı son maçtan sonraya düştüğü için sözleşmeler sezon sonundan sonra kuruluyor, bu sezon biten sözleşmeler hiç sorulmuyordu (artık sezon sonu kaydından sonra kurulan sözleşme en az bir yıl — Bırak'tan sonra gelen gençler için de); Ocak'ta geçen kayıtta hocanın isteğinin maaş tavanı sözleşmesiz hesaplanıyordu (transfer gelişmeleri önce sözleşmeleri tamamlar); geçiş kaydın tam anındaki işi geçmiş sayıyordu (1 Ocak 10:00, 5 Ocak 11:00).
- **Reddedilen:** maaşın ve hoca maaşının gizli değerleri ele vermesi (maaş gösterilebilir bir sayıdır, ters çevirmek kaynak kodu ister; ama gürültüsüz — kullanıcı ölçeği değiştirirken ün/pazarlık payı eklenebilir, borç); tazminatın içinde bulunulan ayı sayması (tasarım).

## Borçlar

- Maaş gizli kabiliyetten gürültüsüz türer (inceleme: ters çevrilebilir; ün/pazarlık payı kullanıcı ölçeğiyle birlikte).
- Ekonomi tutarları TEST (maaş ölçeği, bilet 150 ₺, lig payı 100 bin ₺, tazminat); öbür kulüplerin kasası yok; pazarlık, karşı teklif, menajer, sızıntı (4.3) yok; AI kulüpler arası transfer yok; serbest oyuncular yalnız bizim imzamızla kulüp bulur; yaz dönemi ve yeni sezon (5.1) yok.
