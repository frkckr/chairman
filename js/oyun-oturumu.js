/* ============ Chairman — oyun oturumu: kayıt deposu, açılış ve komut yolu (çizim yok; yol haritası 2.4, 2.5) ============
   Oda (js/ekran-oda.js) ve ajanda (js/ekran-ajanda.js) ekranları aynı oturumu kullanır; ekran değiştirmek kariyeri, kaydı ya da zamanı değiştirmez.
   Depo: masaüstü → tarayıcı ('chairman:' önekiyle) → yalnız bellek. Yuva 'oyun-1'.
     oyunBaslat()            kayıt varsa devam, yoksa yeni kariyer; açılamayan kayda dokunulmaz (OYUN.bozukHata). Dönüş özeti ("Kaldığın yer") 2.8L'de kaldırıldı.
     oyunKomut(f, kaydetme)  komut kariyerin kopyasında uygulanır, geçerliyse kabul edilir ve kaydedilir (kaydetme: true ise kaydedilmez).
     oyunYeniKariyer()       js/baslangic.js ile yeni kariyer kurar, kaydeder; açılış mesajını döndürür. Dünya tohumu burada üretilir.
       Geliştirici için adres parametresi: ?dunya=tohum (2.8L'de başlangıç seçenekleri içerikle birlikte kaldırıldı).
     oyunBozuguSakla()       açılamayan kaydı '.bozuk' ekiyle saklar, yeni kariyer başlatır.
     oyunKayitYazi() · oyunKayitHata()  kayıt durumunun oyuncuya gösterilen yazısı.
   Ayarlar (OYUN.ayarlar: yazi, test) kariyer kaydına girmez; depoda ayrı 'ayarlar' adında tutulur. Ses ayarı 2.8A'da, hareket azaltma 2.8J'de kaldırıldı:
   eski kayıttaki ses/sessiz anahtarları okunurken yok sayılır, açılışta yeniden yazılarak düşer.
   test: geliştirme aşamasında gizli değerleri gösteren geçici anahtar (js/test-gorunum.js); varsayılan açık, yayından önce kaldırılacak. */
const OYUN_YUVA='oyun-1';
const OYUN={depo:null,kariyer:null,oturum:null,mesaj:'',bozukHata:null,basladi:false,
  ayarlar:{yazi:'normal',test:true,kaydet(){try{OYUN_DEPO.yaz('ayarlar',JSON.stringify({yazi:this.yazi,test:this.test}));}catch(e){}}}};
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
      /* kaldırılan ayarlar (ses 2.8A, hareket azaltma 2.8J) okunmaz; açılışta yeniden yazılarak düşer */
      if('ses' in a||'sessiz' in a||'hareket' in a)OYUN.ayarlar.kaydet();
    }
  }catch(e){}
}
function oyunYerlestir(o){OYUN.oturum=o;OYUN.kariyer=o.kariyer;}
function oyunKomut(f,kaydetme){const s=OYUN.oturum.uygula(f,kaydetme);OYUN.kariyer=OYUN.oturum.kariyer;return s;}
const oyunKayitHata=()=>!OYUN.oturum.durum.tamam||OYUN.depo==='bellek';
function oyunKayitYazi(){
  const AY=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],GUN=['Paz','Paz','Sal','Çar','Per','Cum','Cum'];
  const d=OYUN.oturum.durum;let son=null;
  if(d.tarih){const [y,a,g]=d.tarih.split('-').map(Number);son=g+' '+AY[a-1]+' '+GUN[new Date(Date.UTC(y,a-1,g)).getUTCDay()]+' '+saatYazi(d.dakika);}
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
  oyunYerlestir(kayitOturumu(OYUN_DEPO,OYUN_YUVA,yeni,false));OYUN.oturum.kaydet();
  return OYUN.mesaj='Yeni kariyer başladı.';
}
function oyunBaslat(){
  if(OYUN.basladi)return;
  OYUN.basladi=true;
  let y;
  try{y=kariyerYukle(OYUN_DEPO,OYUN_YUVA);}catch(e){y={tamam:false,bos:false,hata:e.message};}
  if(y.tamam){
    oyunYerlestir(kayitOturumu(OYUN_DEPO,OYUN_YUVA,y.kariyer,y.kaynak==='ana'&&!y.gecisler.length));
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
