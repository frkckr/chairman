/* ============ Chairman — oyun dosyalarının grupları (R1-c, 2026-10-29) ============
   Araçların ortak listesi: hangi oyun dosyası hangi gruba girer. Tek kaynak; kullananlar:
     araclar/kariyer-deneme.js  OYUN_DOSYALARI'nı yükler
     araclar/hizli.js           değişen dosyaya göre hızlı denetimi seçer
     araclar/ad-denetimi.js     (g) katı kip: GEVSEK_IZINLI dışındaki her js/ dosyası 'use strict' ile başlar
   OYUN_DOSYALARI  kural katmanı: oyunun yüklediği, çizimsiz ve Node'da sınanan dosyalar (index.html sırasıyla)
   motorDosyalari(kok)  maç motoru: araclar/motor-yukle.js'in mantık dosyalarından js/mac-*.js (kural katmanındakiler hariç), js/kadrolar.js, js/ortak.js
   GEVSEK_IZINLI  'use strict' olmadan kalabilen dosyalar ve gerekçesi; yeni dosya varsayılan olarak katıdır (borç defteri araclar/BORCLAR.md) */
'use strict';
const OYUN_DOSYALARI=['js/ortak.js','js/stadyum-tarifleri.js','js/kadrolar.js','js/lig.js','js/kariyer.js','js/takvim.js','js/maliye.js','js/ajanda.js','js/mesele.js','js/yonetim.js','js/olay.js','js/soz.js','js/mesajlar.js','js/gozlem.js',
  'js/adlar-test.js','js/kariyer-kadro.js','js/fikstur.js','js/hoca.js','js/mac-girdi.js','js/mac-sonuc.js','js/mac-okuma.js','js/lig-maclari.js','js/oyuncu-hafta.js','js/sozlesme.js','js/kulup-mali.js','js/sablon.js','js/pazarlik.js','js/transfer.js','js/icerik-p12.js','js/yazisma.js','js/mekan.js','js/piyasa.js','js/transfer-alim.js','js/sponsor.js','js/mali-rapor.js','js/kadro-dosyasi.js','js/canli-skor.js','js/gazete.js','js/zaman-ozeti.js','js/test-gorunum.js','js/kayit.js','js/baslangic.js'];
/* kural katmanına sayılan, Node'da kariyer-deneme'nin yüklemediği dosyalar: örnek kariyer ve oturum ile depolar (tarayıcıda sınanır) */
const KURAL_EK=['js/kariyer-ornek.js','js/oyun-oturumu.js','js/depo-tarayici.js','js/depo-masaustu.js'];
function motorDosyalari(kok){
  const {mantikDosyalari}=require('./motor-yukle');
  return mantikDosyalari(kok).filter(f=>/^js\/mac-/.test(f)&&!OYUN_DOSYALARI.includes(f)).concat(['js/kadrolar.js','js/ortak.js']);
}
const MOTOR_GEVSEK='motor: katı kip --ayni 40 maç ve hız ölçümüyle ayrı küçük motor işi (BORCLAR)';
const CIZIM_GEVSEK='ekran ya da çizim: kariyere yazmaz; katı kip tarayıcı denetimiyle ayrı iş (BORCLAR)';
const GEVSEK_IZINLI=Object.assign(
  Object.fromEntries(['js/mac-motoru.js','js/mac-karar.js','js/mac-kurallar.js','js/mac-dizilis.js','js/mac-takim.js','js/mac-oncesi.js','js/mac-senaryo.js','js/kadrolar.js',
    'js/hareket-egrileri.js'].map(f=>[f,MOTOR_GEVSEK])),
  Object.fromEntries(['js/animasyon.js','js/arayuz.js','js/balkon.js','js/baskan.js','js/efektler.js','js/ekran-an.js','js/ekran-defter.js','js/ekran-dosya.js','js/ekran-gazete.js',
    'js/ekran-kart.js','js/ekran-mac-oncesi.js','js/ekran-mac-skor.js','js/ekran-mac-sonu.js','js/ekran-mac-telefon.js','js/ekran-oda.js','js/ekran-odak.js','js/ekran-telefon.js',
    'js/ekran-zaman.js','js/gecis-karti.js','js/golgeler.js','js/goruntu.js','js/kamera.js','js/karar-ani.js','js/loca-giris.js','js/mac-arka.js','js/mac-gunu.js','js/mac-sahnesi.js',
    'js/oda.js','js/okunurluk.js','js/oyuncular.js','js/portre.js','js/pul.js','js/seyirci.js','js/stadyum-cevre.js','js/stadyum.js','js/stil-99.js','js/sunum-durumu.js',
    'js/yuruyus.js'].map(f=>[f,CIZIM_GEVSEK])));
module.exports={OYUN_DOSYALARI,KURAL_EK,motorDosyalari,GEVSEK_IZINLI};
