/* ============ Chairman — oyun oturumu: kayıt deposu, açılış ve komut yolu (çizim yok; yol haritası 2.4, 2.5) ============
   Oda ekranı (js/ekran-oda.js; telefon, defter ve dosya ondan açılır) bu oturumu kullanır; ekran değiştirmek kariyeri, kaydı ya da zamanı
   değiştirmez. (Eski koyu ajanda js/ekran-ajanda.js de bu oturumu kullanıyordu; 2026-10-10'da kaldırıldı.)
   Depo: masaüstü → tarayıcı ('chairman:' önekiyle) → yalnız bellek. Yuva 'oyun-1'.
     oyunBaslat()            kayıt varsa devam, yoksa yeni kariyer; açılamayan kayda dokunulmaz (OYUN.bozukHata). Dönüş özeti ("Kaldığın yer") 2.8L'de kaldırıldı.
     oyunKomut(f, kaydetme)  komut kariyerin kopyasında uygulanır, geçerliyse kabul edilir ve kaydedilir (kaydetme: true ise kaydedilmez).
     oyunYeniKariyer()       js/baslangic.js ile yeni kariyer kurar, kaydeder; açılış mesajını döndürür. Dünya tohumu burada üretilir.
       Geliştirici için adres parametresi: ?dunya=tohum (2.8L'de başlangıç seçenekleri içerikle birlikte kaldırıldı).
     oyunBozuguSakla()       açılamayan kaydı '.bozuk' ekiyle saklar, yeni kariyer başlatır.
     oyunKayitYazi() · oyunKayitHata()  kayıt durumunun oyuncuya gösterilen yazısı.
   Ayarlar (OYUN.ayarlar: yazi, test, macHizi, otoYavas, locaBakisi) kariyer kaydına girmez; depoda ayrı 'ayarlar' adında tutulur. Ses ayarı 2.8A'da, hareket azaltma
   2.8J'de kaldırıldı: eski kayıttaki ses/sessiz anahtarları okunurken yok sayılır, açılışta yeniden yazılarak düşer.
   U1 (2026-10-12): macHizi maçın izleme hızı (1, 2, 4; varsayılan 1), otoYavas önemli anlarda normal hıza inme (varsayılan açık; js/mac-izleme.js).
   test: geliştirme aşamasında gizli değerleri gösteren geçici anahtar (js/test-gorunum.js); varsayılan açık, yayından önce kaldırılacak.
   locaBakisi (P2, 2026-10-21 gece; TEST): maç 2D izlenir (js/pul.js; kullanıcı kararı); true iken maç eski figürlü loca bakışıyla açılır (geliştirme
   ve araçlar). P1'in deneme anahtarı pul okunmaz; açılışta yeniden yazılarak düşer.
   R1-a (2026-10-29) kayıt çakışması: oturum karşılaştırarak yazar (js/kayit.js). Çakışma ilk görüldüğünde oyunCakismaDinle ile kaydolan
     dinleyiciler çağrılır (örtü js/ekran-cakisma.js). Tarayıcıda başka pencerenin ana yuvaya yazımı storage olayıyla gelir; oturum hemen denetler. */
'use strict';
const OYUN_YUVA='oyun-1';
const OYUN={depo:null,kariyer:null,oturum:null,mesaj:'',bozukHata:null,basladi:false,
  ayarlar:{yazi:'normal',test:true,macHizi:1,otoYavas:true,locaBakisi:false,
    kaydet(){try{OYUN_DEPO.yaz('ayarlar',JSON.stringify({yazi:this.yazi,test:this.test,macHizi:this.macHizi,otoYavas:this.otoYavas,locaBakisi:this.locaBakisi}));}catch(e){}}}};
let OYUN_DEPO=null;
{
  try{OYUN_DEPO=masaustuDeposu();if(OYUN_DEPO)OYUN.depo='masaustu';}catch(e){OYUN_DEPO=null;}
  if(!OYUN_DEPO){OYUN_DEPO=tarayiciDeposu('chairman:');if(OYUN_DEPO)OYUN.depo='tarayici';}
  if(!OYUN_DEPO){OYUN_DEPO=bellekDeposu();OYUN.depo='bellek';}
  try{
    const a=JSON.parse(OYUN_DEPO.oku('ayarlar')||'null');
    if(a&&typeof a==='object'){
      if(a.yazi==='buyuk')OYUN.ayarlar.yazi='buyuk';
      if(a.test===false)OYUN.ayarlar.test=false;
      if([1,2,4].includes(a.macHizi))OYUN.ayarlar.macHizi=a.macHizi;if(a.otoYavas===false)OYUN.ayarlar.otoYavas=false;   /* U1 */
      if(a.locaBakisi===true)OYUN.ayarlar.locaBakisi=true;   /* P2: maçta loca bakışı (TEST); 2D varsayılan */
      /* kaldırılan ayarlar (ses 2.8A, hareket azaltma 2.8J) okunmaz; açılışta yeniden yazılarak düşer */
      if('ses' in a||'sessiz' in a||'hareket' in a||'pul' in a)OYUN.ayarlar.kaydet();
    }
  }catch(e){}
}
const OYUN_CAKISMA_DINLEYICI=[];
function oyunCakismaDinle(f){OYUN_CAKISMA_DINLEYICI.push(f);if(OYUN.oturum&&OYUN.oturum.durum.cakisma)f(OYUN.oturum.durum);}
function oyunCakismaBildir(d){for(const f of OYUN_CAKISMA_DINLEYICI)try{f(d);}catch(e){console.error(e);}}
const oyunOturumuKur=(kariyer,kayitli)=>kayitOturumu(OYUN_DEPO,OYUN_YUVA,kariyer,kayitli,{cakismada:oyunCakismaBildir});
if(OYUN.depo==='tarayici'&&typeof addEventListener==='function')
  addEventListener('storage',e=>{if(e.key==='chairman:'+OYUN_YUVA&&OYUN.oturum)OYUN.oturum.cakismaDenetle();});
function oyunYerlestir(o){OYUN.oturum=o;OYUN.kariyer=o.kariyer;}
function oyunKomut(f,kaydetme){const s=OYUN.oturum.uygula(f,kaydetme);OYUN.kariyer=OYUN.oturum.kariyer;return s;}
const oyunKayitHata=()=>!OYUN.oturum.durum.tamam||OYUN.depo==='bellek';
function oyunKayitYazi(){
  const AY=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],GUN=['Paz','Paz','Sal','Çar','Per','Cum','Cum'];
  const d=OYUN.oturum.durum;let son=null;
  if(d.tarih){const [y,a,g]=d.tarih.split('-').map(Number);son=g+' '+AY[a-1]+' '+GUN[new Date(Date.UTC(y,a-1,g)).getUTCDay()]+' '+saatYazi(d.dakika);}
  if(d.cakisma)return'Kaydedilmedi: kariyer başka bir pencerede ilerledi';
  if(!d.tamam)return'Kaydedilemedi: '+d.hata+' · karar uygulandı, kayıt bekliyor'+(son?' · son kayıt '+son:'');
  if(OYUN.depo==='bellek')return'Kayıt yalnız bu oturumda: tarayıcı deposu kullanılamıyor';
  return son?(d.bekleyen?'Son kayıt · ':'Kaydedildi · ')+son:'Kayıt bekliyor';
}
function oyunYeniKariyer(){
  const rastgele=()=>Math.floor(Math.random()*0x100000000);
  let q=null,yeni;
  try{q=new URLSearchParams(location.search);}catch(e){}
  const al=ad=>(q&&q.get(ad))||undefined,dunya=parseInt(al('dunya'),10);
  yeni=kariyerBaslat({tohum:Number.isFinite(dunya)?dunya:rastgele()});
  oyunYerlestir(oyunOturumuKur(yeni,false));OYUN.oturum.kaydet();
  return OYUN.mesaj='Yeni kariyer başladı.';
}
function oyunBaslat(){
  if(OYUN.basladi)return;
  OYUN.basladi=true;
  let y;
  try{y=kariyerYukle(OYUN_DEPO,OYUN_YUVA);}catch(e){y={tamam:false,bos:false,hata:e.message};}
  if(y.tamam){
    oyunYerlestir(oyunOturumuKur(y.kariyer,y.kaynak==='ana'&&!y.gecisler.length));
    if(y.kaynak!=='ana')OYUN.mesaj='Son kayıt açılamadı; '+(y.kaynak==='onceki'?'bir önceki sağlam kayıttan':'yarım kalan yazımın tamamlanmış kopyasından')+' devam ediliyor. '+y.uyarilar.join(' · ');
    else if(y.gecisler.length){OYUN.oturum.kaydet();OYUN.mesaj='Eski kayıt yeni biçime dönüştürüldü ('+y.gecisler.join(', ')+'); önceki kayıt yedek olarak saklandı.';}
  }else if(y.bos)oyunYeniKariyer();
  else OYUN.bozukHata=y.hata;
}
/* bozuk kayıt: üzerine yazmadan önce kopyasını saklar */
function oyunBozuguSakla(){
  for(const ad of [OYUN_YUVA,OYUN_YUVA+'.yeni',OYUN_YUVA+'.onceki']){const m=OYUN_DEPO.oku(ad);if(m!==null)OYUN_DEPO.yaz(ad+'.bozuk',m);}
  OYUN.bozukHata=null;
  return oyunYeniKariyer();
}
