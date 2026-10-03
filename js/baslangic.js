/* ============ Chairman — yeni kariyerin kurulması (çizim yok; yol haritası 2.4A, 2.8L) ============
   2.8L (kullanıcı kararı, 2026-10-02): oyunun bütün senaryo, kişi, mesaj ve olay içeriği kaldırıldı; içerik kullanıcı tarafından
   tek tek yazılacak. Yeni kariyer yalnız dünyanın iskeletini kurar:
     kulüp (Demirkapı SK, yönetim koltukları boş), başkan, açılış kasası ve haftanın sonundaki maç günü ajanda kaydı.
   Maç günü kaydı zorunludur: "İlerle → Stada git" akışı, Canlı Skor ve antrenman penceresi ona bağlıdır.
   Başka kişi, ödeme, gelişme ya da olay yoktur; telefon, ajanda ve dosya boş başlar. İçerik eklendiğinde kendi dosyası
   bu kurulumun ardından takvime iş koyabilir (kariyerBaslat'ın sonunda BASLANGIC_EKLERI).
   kariyerBaslat({tohum}): aynı tohum aynı kariyeri kurar (dünya tohumu kayıtlı rastlantının başlangıcıdır).
   Hafta 23 Kasım Pazartesi 08:00'de başlar, Cumartesi 19:00 maç sınırında biter (LIG.buMac ile aynı an). Tutar ve adlar TEST değeridir. */
const BASLANGIC_TARIHI='2026-11-23';
const ACILIS_NAKDI=520000000;               // 5.200.000,00 ₺ (TEST değeri)
const DUNYA={
  kulupler:{demirkapi:{id:'demirkapi',ad:'Demirkapı SK',kisa:'DEM',kademe:3,baskanId:'kisi-1',acilisNakit:ACILIS_NAKDI,nakit:ACILIS_NAKDI,
    yonetim:{sayman:null,futbol:null,basin:null}}},
  kisiler:{'kisi-1':{id:'kisi-1',ad:'Haluk Demirel',rol:'baskan',dogumTarihi:'1972-04-17',kulupId:'demirkapi',durum:'aktif'}},
  baskanId:'kisi-1'
};
/* içerik dosyalarının yeni kariyere ekleyeceği kurulumlar: (k) => void. Bugün boştur; denemeler TEST içeriğini buradan ekler */
const BASLANGIC_EKLERI=[];

function kariyerBaslat({tohum}={}){
  if(!Number.isInteger(tohum))throw new Error(`Dünya tohumu tamsayı olmalı: ${tohum}`);
  tohum=tohum>>>0;
  const D=kariyerOlustur(DUNYA);
  const k=kariyerOlustur({kayitSurumu:KARIYER_SURUM,dunyaTohumu:tohum,icerik:{surum:ICERIK_SURUM,baslangic:'bos'},kosullar:{},rastlanti:rastlantiBaslat(tohum),
    olaylar:{},sozler:{},haberler:[],gozlem:null,tarih:BASLANGIC_TARIHI,gunIciDakika:GUN_BASLANGICI,baskanId:D.baskanId,gorevDurumu:'gorevde',final:null,
    sonrakiNo:{kisi:2,is:1,hareket:1,mesele:1,olay:1,soz:1},meseleler:{},kulupler:D.kulupler,isler:{},gecmis:[],hareketler:[],kisiler:D.kisiler});
  const B=LIG.buMac,takim=id=>(LIG.takimlar.find(t=>t.id===id)||{ad:id}).ad,[s,d]=B.saat.split(':').map(Number);
  isEkle(k,{tur:'ajanda',tarih:tarihEkle(BASLANGIC_TARIHI,5),dakika:s*60+d,veri:{baslik:`Maç: ${takim(B.ev)} – ${takim(B.konuk)}`,zorunluluk:'zorunlu',sure:0,eylem:'macGunu',
    aciklama:`${LIG.ad} ${B.hafta}. hafta. Başkan koltuğunda yerini al.`}});
  for(const f of BASLANGIC_EKLERI)f(k);
  const h=kariyerDogrula(k);
  if(h.length)throw new Error('Başlangıç tutarsız kuruldu: '+h.slice(0,3).join('; '));
  return k;
}
