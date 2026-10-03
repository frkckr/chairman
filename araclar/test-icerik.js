/* ============ Chairman — TEST içeriği (oyun yüklemez; yalnız denemeler) ============
   2.8L'den beri oyunda senaryo içeriği yoktur. Bu dosya kural motorunun (mesele, karar, ajanda, ekip işi, olay paketi, söz, haber,
   telefon konuşması, gözlem notu) içeriksiz oyunda da sınanabilmesi için küçük bir TEST konusu tanımlar. Oyuncuya ait değildir;
   index.html yüklemez. Kullananlar: araclar/kariyer-deneme.js (vm), araclar/akis-deneme.py (sayfaya enjekte eder),
   prototipler/7-dosya-defter.html (örnek verili görünüm).
   testIcerikKur(k, {sayman?, gelisme?, randevu?}) yeni kariyere kişileri ve takvim işlerini ekler (BASLANGIC_EKLERI ile ya da elle):
     kisi-2 Ayla Deneme (sayman, mali katkısı güçlü), kisi-3 Berk Deneme (kulüp dışı destekçi), kisi-4 Cem Deneme (kulüp çalışanı).
     Pazartesi 11:00 ertelenebilir randevu, 15:00 isteğe bağlı randevu, Salı 12:00 gider ödemesi, Salı 10:30 gizli gelişme.
   Gelişme 'denemeTeklif' → paket 'denemeTeklif' (koşul: k.kosullar.deneme !== 'yok') → acil olmayan iki cevaplı karar 'denemeKarari'
     [kabul et / saymana devret] (sayman yoksa [kabul et / reddet]); cevapsız kalırsa teklif düşer.
     kabul: ertesi sabah tahsilat + pano sözü (bağlı tahsilat yapılınca tutulur). devret: ertesi sabah saymanın ekip işi → tahsilat ve gazete haberi.
   testDosyasizKarar(k): bugüne konuya bağlı olmayan iki cevaplı karar 'denemeDosyasiz' ekler (2.8Q'nun sağ karar paneli için).
   Metinler yalnız denemedir; oyun içeriği değildir. */
const TEST_KISILER={
  'kisi-2':{id:'kisi-2',ad:'Ayla Deneme',rol:'yonetici',dogumTarihi:'1975-05-05',kulupId:'demirkapi',durum:'aktif',
    profil:{meslek:'Deneme saymanı.'},katki:{mali:'guclu',baglanti:'orta',futbol:'zayif',iletisim:'orta'}},
  'kisi-3':{id:'kisi-3',ad:'Berk Deneme',rol:'destekci',dogumTarihi:'1980-03-03',kulupId:null,durum:'aktif'},
  'kisi-4':{id:'kisi-4',ad:'Cem Deneme',rol:'personel',dogumTarihi:'1960-01-01',kulupId:'demirkapi',durum:'aktif'}
};
const TEST_TUTAR=40000000;
Object.assign(OLAY_KAYNAKLARI,{defter:'Deneme defteri',gazete:'Deneme Gazetesi'});
Object.assign(SOZ_TARAFLARI,{taraftar:'Taraftar'});
MESELE_KATEGORILERI.deneme=['Mali','₺'];
MESAJ_ROL.destekci='Destekçi';
Object.assign(MESELE_OLAYLARI,{
  'deneme.teklif':(k,p)=>`${kisiAdi(k,p.kisiId)} kulübe ${paraYazi(p.tutar)} destek öneriyor; karşılığında stat içinde bir pano istiyor.`,
  'deneme.kanit':(k,p)=>`Bu hafta kasanın göreceği en düşük bakiye ${paraYazi(p.enDusuk)}.`,
  'deneme.gorus':()=>'Görüşü: teklif kasaya pay bırakır; panonun süresi sözleşmede yazmalı.',
  'deneme.kabul':(k,p)=>`Teklifi kabul ettin; ${paraYazi(p.tutar)} ${gunAyYazi(p.tarih)} sabahı kasaya girecek.`,
  'deneme.devret':(k,p)=>`Konuyu ${kisiAdi(k,p.kisiId)} üstlendi; yarın sabah haber verecek.`,
  'deneme.ret':(k,p)=>`Teklifi reddettin; ${kisiAdi(k,p.kisiId)} “Kapım açık” dedi.`,
  'deneme.ekip':(k,p)=>`${kisiAdi(k,p.kisiId)} görüşmeyi bitirdi: ${paraYazi(p.tutar)} bugün öğlen kasaya giriyor.`,
  'deneme.cevapsiz':(k,p)=>`${kisiAdi(k,p.kisiId)} cevap alamayınca teklifini geri çekti.`,
  'deneme.soz':(k,p)=>`Stat içindeki bir pano ${kisiAdi(k,p.kisiId)} firmasına ayrılacak.`,
  'deneme.haber':(k,p)=>`Kulübe yeni destek: ${paraYazi(p.tutar)}.`,
  'deneme.not':()=>'Deneme antrenman notu: pas çalışması uzun sürdü.'
});
MESAJ_GONDEREN['deneme.teklif']=pKisi('kisiId');
MESAJ_GONDEREN['deneme.ekip']=pKisi('kisiId');
MESAJ_METIN['deneme.teklif']=(k,p)=>`Başkanım merhaba, firmamız kulübe ${paraYazi(p.tutar)} destek vermek istiyor. Karşılığında bir pano yeter.`;
if(typeof GOZLEM_NOTLARI!=='undefined')GOZLEM_NOTLARI.push('deneme.not');
ODA_NOTU_SOZLERI.push('deneme.soz');

GELISMELER.denemeTeklif={
  denetle:(k,v)=>{const h=[];if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);if(!(k.kisiler||{})[v.kisiId])h.push(`destekçi bulunamadı (${v.kisiId})`);
    if(!Number.isSafeInteger(v.tutar)||v.tutar<=0)h.push('tutar geçersiz');return h;},
  uygula:(k,is)=>{const v=is.veri,olay=paketDene(k,'denemeTeklif','deneme:'+v.kisiId,v);
    return olay?{bilgi:MESELE_OLAYLARI['deneme.teklif'](k,v),dur:true}:{bilgi:null};}
};
PAKETLER.denemeTeklif={
  surum:1,icerik:4,
  degerlendir:(k,b)=>k.kosullar.deneme==='yok'?null:'teklif',
  ac:(k,olay,b)=>{
    const id=meseleAc(k,{tur:'deneme',baslik:'Deneme: destek teklifi',sorumluId:k.baskanId,kisiler:[b.kisiId]});
    olay.meseleId=id;
    meseleOlay(k,id,'deneme.teklif',{kisiId:b.kisiId,tutar:b.tutar});
    olayBilgi(k,olay.id,'deneme.kanit',{enDusuk:nakitAcigi(k,b.kulupId).enDusuk},'defter');
    const veri={baslik:'Deneme teklifi',zorunluluk:'zorunlu',sure:15,saatsiz:true,bekleyebilir:true,gelis:{tarih:k.tarih,dakika:k.gunIciDakika},
      karar:'denemeKarari',meseleId:id,olayId:olay.id,soran:b.kisiId,kulupId:b.kulupId,kisiId:b.kisiId,tutar:b.tutar,
      aciklama:`Kulübe ${paraYazi(b.tutar)} destek; karşılığında stat içinde bir pano.`};
    hazirGorus(k,olay.id,veri,'sayman',()=>({anahtar:'deneme.gorus',p:{}}));
    isEkle(k,{tur:'ajanda',tarih:tarihEkle(k.tarih,1),dakika:1080,veri});
  }
};
function denemeYollari(k,is){
  const v=is.veri,s=koltuktaki(k,v.kulupId,'sayman');
  return[
    {id:'kabul',metin:'Kabul et',sure:0,aciklama:[`${paraYazi(v.tutar)} yarın sabah kasaya girer.`,'Söz verirsin: bir pano onların olur.']},
    {id:'devret',metin:'Saymana devret',sure:15,engel:!s?'Sayman koltuğu boş':kisiMesgul(k,s.id)?`${s.ad} başka bir işte`:null,kisiId:s?s.id:undefined,
      aciklama:['Sayman yarın sabah görüşür ve haber verir.']},
    {id:'reddet',metin:'Reddet',sure:0,aciklama:['Para gelmez, söz verilmez.']}
  ];
}
KARAR_TURLERI.denemeKarari={
  denetle:(k,v)=>{const h=GELISMELER.denemeTeklif.denetle(k,v);if(typeof v.meseleId!=='string')h.push('mesele yok');return h;},
  secenekler:(k,is)=>ikiSecenek(denemeYollari(k,is),[['kabul','devret'],['kabul','reddet']]),
  uygula:(k,is,secim)=>{
    const v=is.veri,yarin=tarihEkle(k.tarih,1);
    if(secim==='reddet')return{bilgi:meseleOlay(k,v.meseleId,'deneme.ret',{kisiId:v.kisiId})};
    if(secim==='devret'){
      const s=koltuktaki(k,v.kulupId,'sayman');
      isEkle(k,{tur:'ekip',tarih:yarin,dakika:570,veri:{meseleId:v.meseleId,kisiId:s.id,kulupId:v.kulupId,koltuk:'sayman',gorev:'denemeGorevi',sahipId:v.kisiId,tutar:v.tutar,olayId:v.olayId}});
      return{bilgi:meseleOlay(k,v.meseleId,'deneme.devret',{kisiId:s.id})};
    }
    const odeme=odemePlanla(k,{kulupId:v.kulupId,tarih:yarin,dakika:540,tutar:v.tutar,kalem:'destek',aciklama:'Deneme desteği',meseleId:v.meseleId});
    sozVer(k,{muhatap:v.kisiId,anahtar:'deneme.soz',p:{kisiId:v.kisiId},isId:odeme,olayId:v.olayId});
    return{bilgi:meseleOlay(k,v.meseleId,'deneme.kabul',{tutar:v.tutar,tarih:yarin})};
  },
  zamanAsimi:{
    metin:()=>'Cevap vermezsen teklif düşer.',
    uygula:(k,is)=>({bilgi:meseleOlay(k,is.veri.meseleId,'deneme.cevapsiz',{kisiId:is.veri.kisiId})})
  }
};
EKIP_GOREVLERI.denemeGorevi={
  denetle:(k,v)=>Number.isSafeInteger(v.tutar)?[]:['tutar yok'],
  bekleme:(k,is)=>`${kisiAdi(k,is.veri.kisiId)} teklifi görüşüyor`,
  uygula:(k,is)=>{
    const v=is.veri;
    odemePlanla(k,{kulupId:v.kulupId,tarih:k.tarih,dakika:720,tutar:v.tutar,kalem:'destek',aciklama:'Deneme desteği',meseleId:v.meseleId});
    haberEkle(k,{tur:'gazete',anahtar:'deneme.haber',p:{tutar:v.tutar,kaynak:'gazete'},olayId:v.olayId});
    return{bilgi:meseleOlay(k,v.meseleId,'deneme.ekip',{kisiId:v.kisiId,tutar:v.tutar}),dur:true};
  },
  geriDon:(k,is)=>{const v=is.veri;donenKarar(k,{baslik:'Deneme teklifi sana döndü',sure:15,karar:'denemeKarari',meseleId:v.meseleId,olayId:v.olayId,soran:v.sahipId,
    kulupId:v.kulupId,kisiId:v.sahipId,tutar:v.tutar,aciklama:'Sayman ayrıldı; teklifi sen cevaplayacaksın.'});}
};

/* dosyasız karar (2.8Q): bir konuya bağlı olmayan, başkana dönen iki cevaplı karar. Yalnız denemede elle eklenir (testDosyasizKarar);
   ajandada yalnız görünür, cevabı alt şeritteki "Karar ver" ile açılan sağ panelde verilir */
KARAR_TURLERI.denemeDosyasiz={
  denetle:()=>[],
  secenekler:()=>[{id:'evet',metin:'Evet',sure:0,aciklama:['Deneme: evet.']},{id:'hayir',metin:'Hayır',sure:0,aciklama:['Deneme: hayır.']}],
  uygula:(k,is,secim)=>({bilgi:secim==='evet'?'Deneme kararı: evet dedin.':'Deneme kararı: hayır dedin.'})
};
const testDosyasizKarar=k=>donenKarar(k,{baslik:'Dosyasız deneme kararı',sure:0,karar:'denemeDosyasiz',aciklama:'Konuya bağlı olmayan deneme kararı.'});

/* yeni kariyere TEST kişilerini ve takvim işlerini ekler */
function testIcerikKur(k,{sayman=true,gelisme=true,randevu=true}={}){
  const c=k.kulupler.demirkapi,gun=n=>tarihEkle(BASLANGIC_TARIHI,n);
  Object.assign(k.kisiler,kariyerOlustur(TEST_KISILER));
  k.sonrakiNo.kisi=Math.max(k.sonrakiNo.kisi,5);
  if(sayman)c.yonetim.sayman='kisi-2';else{k.kisiler['kisi-2'].rol='yoneticiAdayi';}
  if(randevu){
    isEkle(k,{tur:'ajanda',tarih:gun(0),dakika:660,veri:{baslik:'Deneme randevusu',zorunluluk:'ertelenebilir',sure:30,sonTarih:gun(1),kisiId:'kisi-4',
      aciklama:'Kulüp çalışanı stadın anahtarlarını teslim edecek.',bilgi:'Anahtarlar teslim alındı.'}});
    isEkle(k,{tur:'ajanda',tarih:gun(0),dakika:900,veri:{baslik:'İsteğe bağlı deneme',zorunluluk:'istege',sure:60,aciklama:'Gelmezsen kaçırılır.'}});
  }
  odemePlanla(k,{kulupId:'demirkapi',tarih:gun(1),dakika:720,tutar:-4500000,kalem:'isletme',aciklama:'Deneme faturası'});
  if(gelisme)isEkle(k,{tur:'gelisme',tarih:gun(1),dakika:630,veri:{gelisme:'denemeTeklif',kulupId:'demirkapi',kisiId:'kisi-3',tutar:TEST_TUTAR}});
}
