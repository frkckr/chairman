/* ============ Chairman — yeni kariyerin kurulması (çizim yok; yol haritası 2.4A, 2.8L, F1) ============
   2.8L (kullanıcı kararı, 2026-10-02): oyunun bütün senaryo, kişi, mesaj ve olay içeriği kaldırıldı; içerik kullanıcı tarafından
   tek tek yazılacak. Yeni kariyer yalnız dünyanın iskeletini kurar.
   F1 (2026-10-23; YOL_HARITASI karar 36): iskelet ligin 16 kulübüdür (js/lig.js). Başkanın kulübü (Demirkapı SK) başkanı, kasası ve boş
   yönetim koltuklarıyla; öbür kulüplerin başkanı ve parası yoktur (kayıt yalnız kimlik ve kadrodur). Kadrolar kariyere kopyalanır ya da
   TEST olarak üretilir (js/kariyer-kadro.js), sezon ve fikstür kurulur (js/fikstur.js). Ajandada 13. haftanın maç günü (eski LIG.buMac ile
   aynı an) ve kış transfer döneminin iki hatırlatması durur. Maç günü kaydı zorunludur: "İlerle → Stada git" akışı, Canlı Skor ve
   antrenman penceresi ona bağlıdır.
   Başka kişi, ödeme, gelişme ya da olay yoktur; telefon ve dosya boş başlar. İçerik eklendiğinde kendi dosyası bu kurulumun ardından
   takvime iş koyabilir (kariyerBaslat'ın sonunda BASLANGIC_EKLERI).
   kariyerBaslat({tohum}): aynı tohum aynı kariyeri kurar (dünya tohumu kayıtlı rastlantının başlangıcıdır; fikstür ve üretilen kadrolar
   tohumdan türetilir, kayıtlı rastlantıyı çekmez). Hafta 23 Kasım Pazartesi 08:00'de başlar, Cumartesi 19:00 maç sınırında biter.
   Tutar ve adlar TEST değeridir. */
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
    sonrakiNo:{kisi:2,is:1,hareket:1,mesele:1,olay:1,soz:1,oyuncu:1},meseleler:{},kulupler:D.kulupler,isler:{},gecmis:[],hareketler:[],kisiler:D.kisiler,
    sezon:null,fikstur:[],maclar:{},oyuncular:{},macOkundu:[]});
  /* ligin öbür kulüpleri: kimlik, ad, kısa ad (TEST: adın ilk üç harfi), kademe; başkan ve para yok */
  for(const t of LIG.takimlar)if(!k.kulupler[t.id])k.kulupler[t.id]={id:t.id,ad:t.ad,kisa:kulupKisaAd(t.ad),kademe:3,baskanId:null,acilisNakit:0,nakit:0};
  kadrolariKur(k,LIG);
  hocalariKur(k);   /* F3-a: her kulübün hocası (js/hoca.js) */
  const biz=k.kisiler[k.baskanId].kulupId;
  sezonKur(k,LIG,biz);
  sezonTakvimiKur(k,biz);
  /* G2 (2026-10-24 gece): sözleşmeler, ilk ay başı ve transfer dönemi gelişmeleri (js/sozlesme.js, js/kulup-mali.js, js/transfer.js) */
  sozlesmeleriTamamla(k);ayBasiKur(k,biz);transferTakvimiKur(k);
  for(const f of BASLANGIC_EKLERI)f(k);
  const h=kariyerDogrula(k);
  if(h.length)throw new Error('Başlangıç tutarsız kuruldu: '+h.slice(0,3).join('; '));
  return k;
}
