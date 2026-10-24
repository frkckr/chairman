# G1 — Sezon boyu oynanabilirlik (uygulama notu)

Durum: 2026-10-24 akşam, masaüstü, oto mod 2 (kullanıcı kararı 43). Dal `claude/g1-kadro-sezon`, etiket `tur/g1`. Onaylı plan: hükmen, 22 kişilik kadro, sakatlık ölçeği (80 maç), sezon sonu kaydı (yeni sezon yok), "Maçı bitir" anında.

## Neden

`sezon-deneme 18 3` 27. haftada kilitlendi: Değirmenaltı 10 uygun oyuncu (4 ceza, 4 uzun sakatlık). 18 kişilik kadro, oyuncu eklemenin yolu yok, çıkış sakatlığı maç başına 0,6 (karar 13 hedefi ~0,3), birikimli 4 sarı cezası. Sezon sonu yok (30. haftadan sonra İlerle "Takvimde bekleyen bir gelişme yok"). "Maçı bitir" sekiz maçı o anda hesapladığı için 30–50 sn.

## Adımlar

- **G1-a hükmen** (`js/lig-maclari.js` `kulupHazirMi`, `hukmenKarari`, `hukmenSonucu`, `digerMacPlani`; `js/mac-sonuc.js` karar yeniden hesaplanır, kayıtta `hukmen`; `js/hoca.js` `zorla`; `js/mac-girdi.js` `girdi.hukmen`; `js/mac-okuma.js` yorum ve not; tarayıcıda LIG_CANLI, kart, Canlı Skor; `sezon-deneme`). 11 uygun oyuncu çıkaramayan taraf 0–3; iki taraf 0–0 (TEST sınırı). Cezalılar maçı çekmiş sayılır. Deneme `kariyer-deneme` 3.9.
- **G1-b kadro 22**: her kulübe 4 TEST genç (18–21 yaş, güç −8), ayrı rastlantı akışı; mevcut oyuncular değişmez.
- **G1-c sakatlık**: `MOTOR_AYAR.sakatCikisPay` (çıkış payı; düşen pay ağrıya); tarama 0,5 ve 0,4 (80 maç); yeni taban `g1.json`.
- **G1-d sezon sonu**: `k.sezon.sonuc`, `gecmis sezonSonu`, hatırlatma, İlerle'nin engel metni; `SEZON_SONU_EKLERI` (G2).
- **G1-e "Maçı bitir" anında**: haftanın öbür maçları ve bizim maçın sonuç ikizi Web Worker'da arkada; worker yoksa bugünkü kilit adımlı yol.

## Sapmalar ve notlar

(tur ilerledikçe doldurulur)
