# F6-a — Hoca değişimi ve P12 TEST taslağı (uygulama notu)

Durum: 2026-10-24, masaüstü, oto mod (kullanıcı kararı 39: F3 → F7 → F6-a). Dal `claude/f6a-hoca-degisimi`, etiket `tur/f6a`. Kararlar YOL_HARITASI 42.

## Kapsam

- **Kural (`js/hoca.js`):** `hocaAdaylari(k, kulüp, ek)` iki TEST aday (belirlenimci: dünya tohumu + kulüp + olay; tarzlar bugünkü hocadan ve birbirinden farklı, `HOCA_TARZ_PAYI` ile; ad kariyerdeki hocalarla çakışmaz; saha kenarı görünüşü kadro üretimiyle aynı dağılım). `hocaAdayiDenetle`. `hocaDegistir(k, kulüp, aday)`: eski hoca `durum:'ayrildi'` (kişi ve maç kayıtlarındaki izi kalır), `hocaKur`, `kadro.td` görünüşü ve adı yeni, eski hocaya verilen süre işleri (`veri.hocaSuresi`) iptal (söz bozulur; söz, mesele ve olay hemen eşitlenir: `sozDegerlendir`, `meseleDegerlendir`, `olayDurumGuncelle`), geçmişe `hocaDegisimi`.
- **İçerik (`js/icerik-p12.js`, oyunda yüklenir; içerik sürümü 5):** maç sonucu kancası (`MAC_SONUCU_EKLERI`) maç akşamı 21:30 gizli gelişme kurar; paket koşulu (TEST) son 3 maçta en çok 1 puan ya da son 5 maçta galibiyet yok — yalnız bugünkü hocayla oynanan maçlar; açık P12 konusu yokken ve son açılıştan 14 gün sonra. Mesele (Futbol), hocanın mesajı, kanıtlar (puan durumu; maç raporlarından beklenen gol ve tarzın izi), acil olmayan karar (son cevap iki gün sonra 18:00):
  - sabır: söz, 3 maç (üçüncü maçın akşamı 21:00 hatırlatma; o akşam kötü gidiş sürüyorsa 21:30'da konu yeniden açılır);
  - değişim: ertesi gün 11:00 zorunlu görüşme (katılım etkisi) → 1. aday [Göreve al / Sıradaki adayı dinle] → 2. aday [Göreve al / Mevcut hocayla devam]; göreve alma: `hocaDegistir`, ertesi gün 10:00 tazminat (300.000 ₺, TEST), yerel gazetede haber;
  - cevapsız: hoca görevde, söz yok.
- **Araçlar:** `kariyer-deneme` 3.7a (P12 bütün dalları, kaydet–yükle, eski içerik sürümü, bozuk aday) ve 2.8L satırı (oyunda yalnız P12); 3.5'in sezon döngüsü P12 duraklarına dayanıklı; `sezon-deneme --p12 cevapsiz|sabir|degisim`; `akis-deneme` içerik sürümü 5.

## Sapmalar (plana göre)

- Sabır süresi “3 hafta” yerine **3 maç**: 21 gün maç takvimine denk düşmüyordu (söz üçüncü maçtan önce bitiyordu); süre şimdi üçüncü maçın akşamı biter, kötü gidiş sürerse konu aynı akşam yeniden açılır.
- Karar telefonda soran hocaya değil **dosyaya** bağlı: “değişim” cevabını hocanın kendisine yazmak tuhaftı; hocanın mesajı konuşmada, karar dosyada (konuşmadan bağlantı).
- `ICERIK_SURUM` 5; kayıt sürümü değişmedi (8). Sürüm 4 ile kurulmuş kariyer açılır, P12 orada kurulmaz.

## İnceleme ve kapanış

- Çok ajanlı inceleme (4 boyut: kural, kayıt, sunum, belirlenim; 11 bulgu, her birine bir çürütücü). Onaylanan ve düzeltilen: telefonda soranı olmayan kararın cevabı konunun ilk göndereni olan eski hocaya yazılmış gibi görünüyordu (`js/mesajlar.js`: giden yalnız soranın konuşmasında); aynı dakikada başkanın cevabı sorudan önce sıralanıyordu (`js/ajanda.js` iş kaydına `olaySira`); şerit başka gündeki son cevabı tarihsiz yazıyordu (`js/ekran-oda.js`). Reddedildiği hâlde düzeltilen: yeni hoca eskisinin son on birine ısrar ediyordu (`hocaKadroSec`: ısrar yalnız kendi on birine); TEST kutusu adayın gizli değerlerini göstermiyordu (seçeneğin `gizli` alanı).
- Kendi denemede bulunan: hoca değişince açık konu kapanmıyordu (`olayDurumGuncelle`); sabır süresi maç takvimine denk düşmüyordu (3 maç).
- Gerçek maçlarla sezon: `sezon-deneme 18 7 --p12 degisim` — P12 iki kez açıldı, iki hoca değişimi, sezon tamamlandı. `sezon-deneme 18 3 --p12 sabir` — P12 bir kez (sabır, söz tutuldu); 27. haftada Değirmenaltı 11 uygun oyuncu çıkaramadı ve sezon kilitlendi (F1'den bilinen borç; F6-a ile ilgisiz; sıradaki iş önerisi).

## Borçlar (F6-b, kullanıcıyla)

- Koşul ve eşiklerin oyun kuralı olarak onayı; baskının kaynağı bugün yalnız sonuç (yönetim, taraftar, basın yok).
- Hocanın takıma oturma süresi (G3.2) yok: yeni hoca ilk maçta kendi tarzıyla tam oynar.
- Sabır süresinde sözü bozan oyuncu yolu yok (yalnız başka bir komutla hoca değişirse); tazminat sözleşmeden değil sabit TEST tutarı.
- Aday kartında dosyanın kişi paneli eski hocayı gösterir (aday kişi değildir; F4 tek kart turunda bakılır).
- Sezonun son maçından sonra P12 koşulu tutmazsa İlerle'de boş bir durak (gizli gelişme son rutin iş olur; sezon geçişi 5.1 ile kalkar).
