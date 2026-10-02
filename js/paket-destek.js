/* ============ Chairman — olay paketi: koşullu destek (çizim yok; yol haritası 2.6, olay kütüphanesi P03'ün dar TEST örneği) ============
   Kasa haftayı dar geçiriyorsa bir kulüp üyesinin firması tek seferlik destek önerir; karşılığında süresi belli bir görünürlük hakkı ister.
   Hisse, yatırımcı, seçim desteği ve başkanın kişisel katkısı bu örnekte yoktur. Her destekçi gizli niyet taşımaz: teklif profilde yazılı beklentinin kendisidir.
   Dış gelişme 'destekTeklifi' (veri {kulupId, kisiId, tutar, kucuk}) → paket 'kosulluDestek' (koşul: önümüzdeki günlerde kasanın en düşük bakiyesi
     DESTEK_ESIGI'nin altında ve kişi kulüpte aktif) → saati serbest karar (son cevap iki gün sonra akşam).
   Yollar: kabul (kesin nakit ertesi sabah + süreli pano sözü) · kucult (yarıdan az destek, yalnız maç günü anonsu, pano yok) · reddet.
     Tek pano varsayımı: gelecek sezonun panosu sponsora söz verildiyse kabul edilemez; burada verilirse sponsora verilemez (js/paket-odeme.js).
   İçerik sürümü 3 (2.8H): karar 'destekCevabi' iki cevaplıdır: pano boşsa [kabul / küçük destek], pano sponsora söz verildiyse [küçük destek / reddet].
     Cevapsız kalırsa teklif düşer. Saymanın görüşü teklif gelirken hazır bilgi olarak düşer; teklif sahibi saymanın kendisiyse görüş yazılmaz (çıkar çatışması).
   İçerik sürümü 2 ve öncesinin üç seçenekli 'destekTeklifi' türü js/uyum-icerik2.js'tedir.
   Tutarlar ve eşik TEST verisidir. */
const DESTEK_ESIGI=150000000;               // kasanın en düşük bakiyesi bunun altındaysa teklif gelir (TEST değeri)
const DESTEK_CEVAP_GUN=2;                   // teklifin cevap beklediği gün sayısı (TEST değeri)
const destekVerisi=v=>({kulupId:v.kulupId,kisiId:v.kisiId,tutar:v.tutar,kucuk:v.kucuk});

Object.assign(MESELE_OLAYLARI,{
  'destek.teklif':(k,p)=>`${kisiAdi(k,p.kisiId)} aradı: firması kulübe ${paraYazi(p.tutar)} destek vermeye hazır; karşılığında stat içinde bir pano istiyor.`,
  'destek.kabul':(k,p)=>`Desteği kabul ettin: ${paraYazi(p.tutar)} ${gunAyYazi(p.tarih)} sabahı kasaya girecek. Bu sezonun kalanı ve gelecek sezon bir pano ${kisiAdi(k,p.kisiId)} firmasının.`,
  'destek.kucuk':(k,p)=>`Daha küçük bir destekte anlaştın: ${paraYazi(p.tutar)} ${gunAyYazi(p.tarih)} sabahı kasaya girecek; karşılığı yalnız maç günü anonsu. Pano verilmedi.`,
  'destek.ret':(k,p)=>`Teklifi reddettin; ${kisiAdi(k,p.kisiId)} “Kapım açık” dedi.`,
  'destek.cevapsiz':(k,p)=>`${kisiAdi(k,p.kisiId)} cevap alamayınca teklifini geri çekti. “Başkan meşgul herhalde” demiş.`,
  'destek.kanit.teklif':(k,p)=>`Teklif: ${paraYazi(p.tutar)} tek seferlik destek; karşılığında bu sezonun kalanı ve gelecek sezon stat içinde bir pano.`,
  'destek.kanit.kasa':(k,p)=>`Bu hafta kasanın göreceği en düşük bakiye ${paraYazi(p.enDusuk)}.`,
  'destek.tavsiye.net':(k,p)=>`Görüşü: bu destek kasaya pay bırakır, ama tek pano iki sezon bağlanır; sponsor aynı panoyu isterse veremezsin.${p.kucukYeter?' Küçük destek de bu haftayı çıkarır.':' Küçük destek tek başına bu haftaya yetmeyebilir.'}`,
  'destek.tavsiye.defter':(k,p)=>`Görüşü: defterde bu hafta en düşük bakiye ${paraYazi(p.enDusuk)}. Panonun değerini ben biçemem.`,
  'destek.tavsiye.emin':()=>'Görüşü: emin değilim; böyle bir anlaşmayı daha önce yürütmedim.'
});

GELISMELER.destekTeklifi={
  denetle:(k,v)=>{
    const h=[];
    if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);
    if(!(k.kisiler||{})[v.kisiId])h.push(`destekçi bulunamadı (${v.kisiId})`);
    if(!Number.isSafeInteger(v.tutar)||v.tutar<=0||!Number.isSafeInteger(v.kucuk)||v.kucuk<=0||v.kucuk>=v.tutar)h.push('destek tutarları geçersiz');
    return h;
  },
  uygula:(k,is)=>{
    const v=is.veri,olay=paketDene(k,'kosulluDestek','destek:'+v.kisiId,v);
    return olay?{bilgi:MESELE_OLAYLARI['destek.teklif'](k,v),dur:true}:{bilgi:null};
  }
};
PAKETLER.kosulluDestek={
  surum:1,icerik:2,
  degerlendir:(k,b)=>{const p=k.kisiler[b.kisiId];return p&&p.durum==='aktif'&&nakitAcigi(k,b.kulupId).enDusuk<DESTEK_ESIGI?'teklif':null;},
  ac:(k,olay,b)=>{
    const yeni=k.icerik.surum>=3;
    const id=meseleAc(k,{tur:'kosulluDestek',baslik:`${kisiAdi(k,b.kisiId)} firmasıyla destek öneriyor`,sorumluId:k.baskanId,kisiler:[b.kisiId]});
    olay.meseleId=id;
    meseleOlay(k,id,'destek.teklif',{kisiId:b.kisiId,tutar:b.tutar});
    olayBilgi(k,olay.id,'destek.kanit.teklif',{tutar:b.tutar},b.kisiId);
    olayBilgi(k,olay.id,'destek.kanit.kasa',{enDusuk:nakitAcigi(k,b.kulupId).enDusuk},'defter');
    const son=tarihEkle(k.tarih,DESTEK_CEVAP_GUN);
    const veri=Object.assign({baslik:'Destek teklifi',zorunluluk:'zorunlu',sure:15,saatsiz:true,bekleyebilir:true,gelis:{tarih:k.tarih,dakika:k.gunIciDakika},
      karar:yeni?'destekCevabi':'destekTeklifi',meseleId:id,olayId:olay.id,
      aciklama:yeni?`Firması adına kulübe ${paraYazi(b.tutar)} destek öneriyor; karşılığında bu sezonun kalanı ve gelecek sezon stat içinde bir pano istiyor.`
        :`${kisiAdi(k,b.kisiId)} firması adına kulübe ${paraYazi(b.tutar)} destek öneriyor; karşılığında bu sezonun kalanı ve gelecek sezon stat içinde bir pano istiyor. ${gunAyYazi(son)} akşamına kadar cevap bekliyor.`},destekVerisi(b));
    if(yeni){veri.soran=b.kisiId;hazirGorus(k,olay.id,veri,'sayman',destekTavsiyesi.gorus,kisi=>kisi.id===b.kisiId);}
    isEkle(k,{tur:'ajanda',tarih:son,dakika:1080,veri});
  }
};
const destekTavsiyesi={koltuk:'sayman',
  engel:(k,is,kisi)=>kisi.id===is.veri.kisiId?'Teklif sahibi kendisi; görüşü tarafsız olmaz':null,
  gorus:(k,is,kisi)=>{
    const m=katki(kisi,'mali'),d=nakitAcigi(k,is.veri.kulupId).enDusuk;
    if(m==='guclu')return{anahtar:'destek.tavsiye.net',p:{kucukYeter:d+is.veri.kucuk>=DESTEK_ESIGI}};
    return m==='orta'?{anahtar:'destek.tavsiye.defter',p:{enDusuk:d}}:{anahtar:'destek.tavsiye.emin',p:{}};
  }};
const destekDenetle=(k,v)=>{const h=GELISMELER.destekTeklifi.denetle(k,v);if(typeof v.meseleId!=='string')h.push('teklif bir meseleye bağlı değil');if(!(k.olaylar||{})[v.olayId])h.push(`olay bulunamadı (${v.olayId})`);return h;};
function destekYollari(k,is){
  const v=is.veri,yarin=tarihEkle(k.tarih,1),yeni=v.karar==='destekCevabi';
  return[
    {id:'kabul',metin:yeni?'Kabul et, pano onların':'Desteği kabul et',engel:acikSoz(k,'soz.pano')?'Gelecek sezonun panosu sponsora söz verildi':null,
      aciklama:[`${paraYazi(v.tutar)} ${gunAyYazi(yarin)} sabahı kasaya girer.`,'Söz verirsin: bu sezonun kalanı ve gelecek sezon stat içinde bir pano destekçinin firmasına ayrılır; o pano başkasına verilemez.']},
    {id:'kucult',metin:yeni?'Küçük destek, yalnız anons':'Daha küçük bir destek iste',engel:null,
      aciklama:[`${paraYazi(v.kucuk)} ${gunAyYazi(yarin)} sabahı kasaya girer; karşılığı yalnız maç günü anonsu.`,'Pano verilmez.']},
    {id:'reddet',metin:'Teşekkür et, reddet',engel:null,aciklama:['Para gelmez, hak verilmez.']}
  ];
}
function destekUygula(k,is,secim){
  const v=is.veri,olay=k.olaylar[v.olayId],yarin=tarihEkle(k.tarih,1);
  if(secim==='reddet'){olay.sonuc.cozum='ret';return{bilgi:meseleOlay(k,v.meseleId,'destek.ret',{kisiId:v.kisiId})};}
  const tutar=secim==='kabul'?v.tutar:v.kucuk;
  odemePlanla(k,{kulupId:v.kulupId,tarih:yarin,dakika:540,tutar,kalem:'destek',aciklama:'Kulüp üyesi desteği',meseleId:v.meseleId});
  if(secim==='kabul'){
    sozVer(k,{muhatap:v.kisiId,anahtar:'soz.destekPano',olayId:olay.id});
    olay.sonuc.cozum='kabul';olay.sonuc.hak='panoDestek';
    return{bilgi:meseleOlay(k,v.meseleId,'destek.kabul',{kisiId:v.kisiId,tutar,tarih:yarin})};
  }
  olay.sonuc.cozum='kucuk';
  return{bilgi:meseleOlay(k,v.meseleId,'destek.kucuk',{tutar,tarih:yarin})};
}
KARAR_TURLERI.destekCevabi={
  denetle:destekDenetle,
  secenekler:(k,is)=>ikiSecenek(destekYollari(k,is),[['kabul','kucult'],['kucult','reddet']]),
  uygula:destekUygula,
  zamanAsimi:{
    metin:()=>'Cevap vermezsen teklif düşer; para gelmez, hak verilmez.',
    uygula:(k,is)=>{const v=is.veri;k.olaylar[v.olayId].sonuc.cozum='cevapsiz';return{bilgi:meseleOlay(k,v.meseleId,'destek.cevapsiz',{kisiId:v.kisiId})};}
  }
};
