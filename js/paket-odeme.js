/* ============ Chairman — olay paketi: ödeme sıkışması (çizim yok; yol haritası 2.4A, olay kütüphanesi P01'in dar örneği) ============
   Konu: forma sponsoru taksiti ertelemek ister. Ne olacağı o anki deftere ve devralınan koşullara bağlıdır; ikinci mali defter yoktur.
   Dış gelişme 'sponsorErteleme' (veri {kulupId, odemeIsId, maasIsId, bakimIsId, gun}): sponsor ödemesi gerçekten gun kadar kayar,
     sonra paket denenir. Ödeme artık beklemiyorsa gelişme boşa düşer.
   Paket 'odemeSikismasi' iki varyantla açılır:
     kriz           — ödeme kayınca önümüzdeki ODEME_UFKU gün içinde kasa eksiye düşüyor (nakitAcigi). Başkana saati serbest zorunlu karar
                      (odemeSikismasi) gelir; son cevap, kasanın yetmediği ödemeden KARAR_PAYI dakika öncedir.
     degerlendirme  — kasa yetiyor. Acil olmayan, ertelenebilir karar (anlasmaDegerlendirme) açılır.
   Sponsorun gerçek durumu k.kosullar.sponsor.durum'dadır ('nakitSikisik' | 'pazarlik'); başlangıçta bir kez seçilir, oyuncuya dökülmez.
     Başkan tahsilat geçmişi gibi kanıtları görür (olay.bilgiler). Sonuçlar olasılıksızdır: seçilen yol × gerçek durum × saymanın gizli katkısı.
   Karar türleri (ortak veri: kulupId, odemeIsId, maasIsId, bakimIsId, meseleId, olayId, denenen:[seçenek]):
     odemeSikismasi        kendin · devret · bakimErtele · maasGeciktir. Açık sürerse karar, denenen yollar kapalı olarak geri döner.
     odemeTeklifi          veri.teklif 'pano' (gelecek sezon pano hakkı karşılığı tam ödeme) | 'indirim' (veri.oran; hemen ödeme) → kabul · ret.
     anlasmaDegerlendirme  kabul · bedel · devret.
     nakitTakvimi          olay açılmadan önceki isteğe bağlı görüşme (veri.gelismeIsId): takip · bakim · bekle. Önleme buradan doğar.
   Ekip görevi 'tahsilatGorusmesi' (veri.varyant): saymanın sponsor görüşmesi; yetkisi ödeme takvimi ve taksittir, indirim başkana döner.
   Tutarlar, oranlar, süreler ve metinler TEST verisidir; denge sayısı değildir. */
const ODEME_UFKU=7;                         // nakit açığına bakılan gün sayısı (TEST değeri)
const KARAR_PAYI=60;                        // son cevap, kasanın yetmediği ödemeden bu kadar dakika önce (TEST değeri)
const HEMEN_DAKIKA=30;                      // "hemen" yapılan ödeme bu kadar dakika sonra kasaya girer (TEST değeri)
const GECIKME_BEDELI_ORAN=2;                // sözleşmedeki gecikme bedeli, yüzde (TEST değeri)
const INDIRIM_ORAN=10;                      // nakit sıkışığı sponsorun hemen ödeme için istediği indirim, yüzde (TEST değeri)
const BAKIM_ERTELEME_GUN=19,BAKIM_ERTELEME_FARKI=2500000;   // ertelenen bakım taksiti ve müteahhidin farkı (TEST değeri)

/* önümüzdeki ODEME_UFKU günde kasanın en çok ne kadar eksiye düştüğü (kariyeri değiştirmez): {acik: kuruş (0 = açık yok), is: kasanın
   ilk yetmediği ödeme ya da null, enDusuk: bu sürede kasanın gördüğü en düşük bakiye, son: sürenin sonundaki bakiye}. haric: hesaba katılmayacak ödeme işi (o ödeme gelmezse ne olur sorusu için) */
function nakitAcigi(k,kulupId,haric){
  const sinir=simdikiAn(k)+ODEME_UFKU*1440;
  let bakiye=k.kulupler[kulupId].nakit,en=0,ilk=null,dip=bakiye;
  for(const is of bekleyenOdemeler(k,kulupId)){
    if(is.id===haric||isAn(is)>sinir)continue;
    bakiye+=is.veri.tutar;
    if(bakiye<0&&!ilk)ilk=is;
    if(bakiye<en)en=bakiye;
    if(bakiye<dip)dip=bakiye;
  }
  return{acik:-en,is:ilk,enDusuk:dip,son:bakiye};
}

const odemeIsi=(k,id)=>{const is=k.isler[id];return is&&is.tur==='odeme'?is:null;};
/* meselenin bekleyen sponsor ödemesi: ilk iş yeniden planlandıysa meseleye bağlı sıradaki sponsor ödemesi */
const sponsorIsi=(k,v)=>odemeIsi(k,v.odemeIsId)||(v.meseleId?meseleIsleri(k,v.meseleId).find(x=>x.tur==='odeme'&&x.veri.kalem==='sponsor'):null)||null;
const saymanKisi=(k,kulupId)=>{const c=k.kulupler[kulupId],id=c.yonetim&&c.yonetim.sayman;return id?k.kisiler[id]:null;};
const hemenAn=k=>anTarih(simdikiAn(k)+HEMEN_DAKIKA);
const bedelTutari=tutar=>Math.trunc(Math.abs(tutar)*GECIKME_BEDELI_ORAN/100);
const ortakVeri=v=>({kulupId:v.kulupId,odemeIsId:v.odemeIsId,maasIsId:v.maasIsId,bakimIsId:v.bakimIsId,meseleId:v.meseleId,olayId:v.olayId});

function odemeDenetle(k,v){
  const h=[];
  if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);
  for(const a of ['odemeIsId','maasIsId','bakimIsId'])if(typeof v[a]!=='string')h.push(`${a} yok`);
  return h;
}
function odemeMeseleDenetle(k,v){
  const h=odemeDenetle(k,v);
  if(typeof v.meseleId!=='string')h.push('ödeme kararı bir meseleye bağlı değil');
  if(!(k.olaylar||{})[v.olayId])h.push(`olay bulunamadı (${v.olayId})`);
  if(v.denenen!==undefined&&!Array.isArray(v.denenen))h.push('denenen yollar liste değil');
  return h;
}

/* ---- dünyayı değiştiren ortak adımlar ---- */
/* sponsor ödemesini hemen (HEMEN_DAKIKA sonra) kasaya girecek biçimde öne alır; indirim verilirse tutar düşer. Ödeme anını döndürür */
function sponsorHemen(k,v,indirimOran){
  const sp=sponsorIsi(k,v),t=hemenAn(k);
  if(!indirimOran){isTasi(k,sp.id,t.tarih,t.dakika);return t;}
  const yeni=sp.veri.tutar-Math.trunc(sp.veri.tutar*indirimOran/100);
  isIptal(k,sp.id,`%${indirimOran} indirim kabul edildi`);
  odemePlanla(k,{kulupId:v.kulupId,tarih:t.tarih,dakika:t.dakika,tutar:yeni,kalem:sp.veri.kalem,aciklama:sp.veri.aciklama+` (%${indirimOran} indirimli)`,meseleId:v.meseleId});
  return Object.assign({tutar:yeni},t);
}
/* sponsor ödemesini ikiye böler: yarısı hemen, kalanı sponsorun istediği günde. {ilk, son} tarihlerini döndürür */
function sponsorTaksit(k,v){
  const sp=sponsorIsi(k,v),t=hemenAn(k),tutar=sp.veri.tutar,yarim=Math.trunc(tutar/2);
  const plan=x=>odemePlanla(k,Object.assign({kulupId:v.kulupId,kalem:sp.veri.kalem,meseleId:v.meseleId},x));
  isIptal(k,sp.id,'Taksit planı yapıldı');
  plan({tarih:t.tarih,dakika:t.dakika,tutar:yarim,aciklama:sp.veri.aciklama+' (1/2)'});
  plan({tarih:sp.tarih,dakika:sp.dakika,tutar:tutar-yarim,aciklama:sp.veri.aciklama+' (2/2)'});
  return{ilk:t.tarih,son:sp.tarih};
}
/* sözleşmedeki gecikme bedelini geciken ödemenin gününe yazar; bedeli döndürür */
function sponsorBedel(k,v){
  const sp=sponsorIsi(k,v),bedel=bedelTutari(sp.veri.tutar);
  odemePlanla(k,{kulupId:v.kulupId,tarih:sp.tarih,dakika:sp.dakika,tutar:bedel,kalem:sp.veri.kalem,aciklama:'Sponsor gecikme bedeli (sözleşme maddesi)',meseleId:v.meseleId});
  return bedel;
}
/* bakım taksitini erteler; müteahhit fark alır. {tarih, tutar} döndürür */
function bakimErtele(k,v){
  const b=odemeIsi(k,v.bakimIsId),tarih=tarihEkle(b.tarih,BAKIM_ERTELEME_GUN),tutar=b.veri.tutar-BAKIM_ERTELEME_FARKI;
  isIptal(k,b.id,'Bakım taksiti ertelendi');
  odemePlanla(k,{kulupId:v.kulupId,tarih,dakika:b.dakika,tutar,kalem:b.veri.kalem,aciklama:b.veri.aciklama+' (ertelendi)'});
  return{tarih,tutar};
}

/* ---- kriz kararının başkana gelişi ve dönüşü ---- */
/* kasa hâlâ yetmiyorsa kararı (denenen yollar kapalı) başkana döndürür; döndüyse true */
function krizKontrol(k,v,denenen){
  const a=nakitAcigi(k,v.kulupId);
  if(!a.acik)return false;
  const sp=sponsorIsi(k,v),son=anTarih(Math.max(simdikiAn(k),isAn(a.is)-KARAR_PAYI));
  isEkle(k,{tur:'ajanda',tarih:son.tarih,dakika:son.dakika,veri:Object.assign({baslik:'Maaş günü kasa yetmiyor',zorunluluk:'zorunlu',sure:15,saatsiz:true,
    gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'odemeSikismasi',denenen:denenen||[],
    aciklama:`${sp?`Sponsor taksiti ${gunAyYazi(sp.tarih)} gününe kaldı. `:''}${gunAyYazi(a.is.tarih)} günü “${a.is.veri.aciklama}” için kasada ${paraYazi(a.acik)} eksik kalıyor. O saatten önce bir yol seçmelisin.`},ortakVeri(v))});
  return true;
}
function teklifKarari(k,v,denenen,teklif){
  const a=nakitAcigi(k,v.kulupId),s=saymanKisi(k,v.kulupId),son=anTarih(Math.max(simdikiAn(k),(a.is?isAn(a.is):simdikiAn(k)+1440)-KARAR_PAYI));
  isEkle(k,{tur:'ajanda',tarih:son.tarih,dakika:son.dakika,veri:Object.assign({baslik:teklif.teklif==='pano'?'Sponsor pano hakkı istiyor':'Sponsor indirim istiyor',
    zorunluluk:'zorunlu',sure:15,saatsiz:true,gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'odemeTeklifi',denenen,
    aciklama:teklif.teklif==='pano'?'Sponsorun sahibi taksiti hemen ve tam ödemeye hazır; karşılığında gelecek sezon stat içi pano hakkı istiyor.'
      :`${s?s.ad:'Sayman'} sponsorun yöneticisine ulaştı: ödeme hemen yapılabilir ama %${teklif.oran} indirim istiyorlar. İndirim saymanın yetkisini aştığı için karar sende.`},teklif,ortakVeri(v))});
}

Object.assign(MESELE_OLAYLARI,{
  'odeme.bildirim':(k,p)=>`Forma sponsorunun temsilcisi bildirdi: ilk taksiti ${gunAyYazi(p.tarih)} gününe ertelemek istiyorlar.`,
  'odeme.acik':(k,p)=>`Taksit gelmeyince ${gunAyYazi(p.tarih)} günü “${p.aciklama}” için kasada ${paraYazi(p.acik)} eksik kalıyor.`,
  'odeme.kendin.taksit':(k,p)=>`Sponsorun sahibiyle görüştün: şirketin kasası gerçekten dar. Yarısını ${gunAyYazi(p.ilk)} günü, kalanını ${gunAyYazi(p.son)} günü ödeyecek.`,
  'odeme.kendin.teklif':()=>'Sponsorun sahibiyle görüştün: taksiti hemen ve tam ödeyebilir, ama karşılığında gelecek sezon stat içi pano hakkı istiyor.',
  'odeme.devir':(k,p)=>`Görüşmeyi ${kisiAdi(k,p.kisiId)} üstlendi; ${gunAyYazi(p.tarih)} sabahı haber verecek.`,
  'odeme.ekip.tam':(k,p)=>`${kisiAdi(k,p.kisiId)} sponsorun üst yönetimine ulaştı; erteleme talebi geri çekildi. Taksit ${gunAyYazi(p.tarih)} günü tam ödenecek.`,
  'odeme.ekip.taksit':(k,p)=>`${kisiAdi(k,p.kisiId)} ödeme planı kurdu: yarısı ${gunAyYazi(p.ilk)}, kalanı ${gunAyYazi(p.son)} günü gelecek.`,
  'odeme.ekip.taksitBedel':(k,p)=>`${kisiAdi(k,p.kisiId)} ödeme planı kurdu: yarısı ${gunAyYazi(p.ilk)}, kalanı ${gunAyYazi(p.son)} günü gelecek. Sözleşmedeki gecikme maddesini de işletti: sponsor ${paraYazi(p.bedel)} bedel ödeyecek.`,
  'odeme.ekip.bedel':(k,p)=>`${kisiAdi(k,p.kisiId)} sponsorun muhasebesiyle görüştü; ödeme günü değişmedi. Sözleşmedeki gecikme maddesini işletti: sponsor ${paraYazi(p.bedel)} bedel ödeyecek.`,
  'odeme.ekip.sonucsuz':(k,p)=>`${kisiAdi(k,p.kisiId)} sponsorda karar verecek kimseye ulaşamadı; ödeme günü değişmedi.`,
  'odeme.ekip.indirimTalebi':(k,p)=>`${kisiAdi(k,p.kisiId)} sponsorun yöneticisine ulaştı: ödeme hemen yapılabilir ama %${p.oran} indirim istiyorlar. İndirim saymanın yetkisini aştığı için karar sende.`,
  'odeme.ekip.rapor':(k,p)=>`${kisiAdi(k,p.kisiId)} sponsorla görüştü; ödeme günü değişmedi. Görüşünü dosyaya yazdı.`,
  'odeme.ekip.bosa':()=>'Ödeme artık beklemediği için görüşmeye gerek kalmadı.',
  'odeme.acikKapandi':()=>'Kasa açığı başka yoldan kapandı; maaş günü için karara gerek kalmadı. Sponsor taksiti ertelediği günde gelecek.',
  'odeme.dondu':(k,p)=>`Kasa hâlâ yetmiyor (${paraYazi(p.acik)} eksik); karar yine sende.`,
  'odeme.bakim':(k,p)=>`Çatı bakım taksitini ${gunAyYazi(p.tarih)} gününe ertelettin; müteahhit farkıyla birlikte ${paraYazi(-p.tutar)} ödenecek. Onarım Ocak ayına kaldı.`,
  'odeme.maas':(k,p)=>`Maaşları ${gunAyYazi(p.tarih)} gününe, sponsor ödemesinin arkasına aldın. Personel ve oyuncular maaşın geciktiğini biliyor.`,
  'odeme.teklif.pano':(k,p)=>`Pano hakkını kabul ettin: sponsor taksiti ${gunAyYazi(p.tarih)} günü tam ödeyecek. Gelecek sezon stat içi bir pano sponsorun.`,
  'odeme.teklif.indirim':(k,p)=>`İndirimi kabul ettin; ödeme ${gunAyYazi(p.tarih)} günü ${paraYazi(p.tutar)} olarak gelecek.`,
  'odeme.teklif.ret':()=>'Teklifi reddettin; sponsor ödemeyi ertelediği günde yapacak.',
  'odeme.kabul':(k,p)=>`Ertelemeyi kabul ettin; taksit ${gunAyYazi(p.tarih)} günü gelecek.`,
  'odeme.bedel':(k,p)=>`Ertelemeyi sözleşmeye göre kabul ettin: taksit ${gunAyYazi(p.tarih)} günü gelecek, sponsor ayrıca ${paraYazi(p.bedel)} gecikme bedeli ödeyecek.`,
  /* kanıtlar (olay.bilgiler) */
  'odeme.kanit.acik':(k,p)=>`Taksit gelmezse ${gunAyYazi(p.tarih)} günü kasada ${paraYazi(p.acik)} eksik kalıyor.`,
  'odeme.kanit.tampon':()=>'Kasadaki para bu haftanın ödemelerini sponsor taksiti olmadan da karşılıyor.',
  'odeme.kanit.gecmis':(k,p)=>p.gecikmeli?'Sponsor geçen sezonun son iki taksitini de geç ödedi.':'Sponsor geçen sezon bütün taksitleri gününde ödedi; ertelemeyi ilk kez istiyor.',
  'odeme.kanit.sozlesme':(k,p)=>`Sözleşmede gecikme maddesi var: geciken taksit için %${p.oran} bedel istenebilir.`,
  'odeme.kanit.sahip':()=>'Sponsorun sahibi yüz yüze söyledi: şirketin kasası dar, parayı toplayınca ödeyecek.',
  'odeme.kanit.yorum':(k,p)=>p.sikisik?'Görüşü: sponsor gerçekten nakit sıkıntısında; zaman kazanmaya çalışmıyor.':'Görüşü: sponsorun parası var; erteleme talebiyle pazarlık payı arıyor.',
  'odeme.sorumlu':(k,p)=>`${kisiAdi(k,p.kisiId)} tahsilat sorumlusu olarak sponsorla görüşmeyi üstlendi; ${gunAyYazi(p.tarih)} sabahı haber verecek.`,
  /* tavsiye: saymanın görüşü mali katkısına göre netleşir; zayıf görüş yanıltmaz, belirsiz kalır */
  'odeme.tavsiye.net':(k,p)=>p.sikisik?'Görüşü: sponsor gerçekten sıkışık, tam ödeme beklemeyelim. Ödeme planı istenirse yarısı hemen alınabilir.':'Görüşü: sponsorun parası var, pazarlık payı arıyor. Üst yönetimini tanıyan biri talebi geri çektirebilir; sen gidersen karşılık isterler.',
  'odeme.tavsiye.defter':(k,p)=>p.acik?`Görüşü: sponsorun niyetini bilemem. Defter açık: ${paraYazi(p.acik)} eksik; bakım taksitini ertelemek bunu kesin kapatır ama farkı var.`:'Görüşü: sponsorun niyetini bilemem. Defter açık: kasa bu haftayı taksit olmadan da çıkarıyor.',
  'odeme.tavsiye.emin':()=>'Görüşü: emin değilim; sponsoru yeterince tanımıyorum.'
});
/* saymanın tavsiyesi (üç ödeme kararında ortak) */
const odemeTavsiyesi={koltuk:'sayman',gorus:(k,is,kisi)=>{
  const m=katki(kisi,'mali');
  if(m==='guclu')return{anahtar:'odeme.tavsiye.net',p:{sikisik:k.kosullar.sponsor.durum==='nakitSikisik'}};
  if(m==='orta')return{anahtar:'odeme.tavsiye.defter',p:{acik:nakitAcigi(k,is.veri.kulupId).acik}};
  return{anahtar:'odeme.tavsiye.emin',p:{}};
}};

/* ---- dış gelişme: sponsor taksiti ertelemek istiyor ---- */
GELISMELER.sponsorErteleme={
  denetle:(k,v)=>{const h=odemeDenetle(k,v);if(!Number.isInteger(v.gun)||v.gun<1)h.push(`erteleme günü geçersiz (${v.gun})`);return h;},
  uygula:(k,is)=>{
    const v=is.veri,sp=odemeIsi(k,v.odemeIsId);
    if(!sp)return{bilgi:null};
    isTasi(k,sp.id,tarihEkle(sp.tarih,v.gun),sp.dakika);
    const olay=paketDene(k,'odemeSikismasi','sponsor:'+v.odemeIsId,v);
    /* sorumlu üstlendiyse başkana karar doğmamıştır: haber rutindir, ilerleme durmaz */
    return{bilgi:MESELE_OLAYLARI['odeme.bildirim'](k,{tarih:sp.tarih}),dur:!!olay&&k.meseleler[olay.meseleId].durum==='kararBekliyor'};
  }
};

/* kalıcı sorumluluk: tahsilat takibi saymana bırakıldıysa görüşmeyi kendiliğinden üstlenir (başkana karar gelmez). Haberi son cevap
   anından (sinir) sonra gelecekse ya da sayman meşgulse üstlenemez; false döner ve karar başkana gelir */
function sorumluUstlenir(k,v,varyant,sinir){
  const c=k.kulupler[v.kulupId],sor=c.sorumluluklar&&c.sorumluluklar.tahsilat,s=saymanKisi(k,v.kulupId),yarin=tarihEkle(k.tarih,1);
  if(!sor||!s||s.id!==sor.kisiId||kisiMesgul(k,s.id))return false;
  if(sinir!==null&&anDakika(yarin,EKIP_HABER_DAKIKASI)>=sinir)return false;
  isEkle(k,{tur:'ekip',tarih:yarin,dakika:EKIP_HABER_DAKIKASI,veri:Object.assign({kisiId:s.id,koltuk:'sayman',gorev:'tahsilatGorusmesi',varyant,denenen:['devret']},ortakVeri(v))});
  meseleOlay(k,v.meseleId,'odeme.sorumlu',{kisiId:s.id,tarih:yarin});
  return true;
}

PAKETLER.odemeSikismasi={
  surum:2,icerik:1,
  degerlendir:(k,b)=>nakitAcigi(k,b.kulupId).acik>0?'kriz':'degerlendirme',
  ac:(k,olay,b)=>{
    const sp=odemeIsi(k,b.odemeIsId),s=saymanKisi(k,b.kulupId),kriz=olay.varyant==='kriz',a=nakitAcigi(k,b.kulupId);
    const id=meseleAc(k,{tur:'odemeSikismasi',baslik:kriz?'Sponsor taksiti gecikiyor: maaş günü kasa yetmiyor':'Forma sponsoru taksiti ertelemek istiyor',sorumluId:k.baskanId,kisiler:s?[s.id]:[]});
    olay.meseleId=id;
    sp.veri.meseleId=id;
    const v=Object.assign(ortakVeri(b),{meseleId:id,olayId:olay.id});
    meseleOlay(k,id,'odeme.bildirim',{tarih:sp.tarih});
    olayBilgi(k,olay.id,'odeme.kanit.gecmis',{gecikmeli:k.kosullar.sponsor.durum==='nakitSikisik'},'defter');
    olayBilgi(k,olay.id,'odeme.kanit.sozlesme',{oran:GECIKME_BEDELI_ORAN},'sozlesme');
    if(kriz){
      const maas=odemeIsi(k,b.maasIsId);
      if(maas)maas.veri.meseleId=id;
      meseleOlay(k,id,'odeme.acik',{acik:a.acik,tarih:a.is.tarih,aciklama:a.is.veri.aciklama});
      olayBilgi(k,olay.id,'odeme.kanit.acik',{acik:a.acik,tarih:a.is.tarih},'defter');
      if(!sorumluUstlenir(k,v,'kriz',isAn(a.is)-KARAR_PAYI))krizKontrol(k,v,[]);
    }else{
      olayBilgi(k,olay.id,'odeme.kanit.tampon',{},'defter');
      if(!sorumluUstlenir(k,v,'degerlendirme',null))isEkle(k,{tur:'ajanda',tarih:k.tarih,dakika:Math.min(1380,Math.max(840,k.gunIciDakika+30)),veri:Object.assign({baslik:'Sponsorun erteleme talebi',zorunluluk:'ertelenebilir',sure:15,
        sonTarih:tarihEkle(k.tarih,2),karar:'anlasmaDegerlendirme',
        aciklama:`Forma sponsoru ilk taksiti ${gunAyYazi(sp.tarih)} gününe ertelemek istiyor. Kasa bu haftayı taksit olmadan da çıkarıyor; acele yok.`},v)});
    }
  }
};

/* ---- karar: maaş günü kasa yetmiyor ---- */
KARAR_TURLERI.odemeSikismasi={
  denetle:odemeMeseleDenetle,tavsiye:odemeTavsiyesi,
  secenekler:(k,is)=>{
    const v=is.veri,sp=sponsorIsi(k,v),maas=odemeIsi(k,v.maasIsId),bakim=odemeIsi(k,v.bakimIsId),s=saymanKisi(k,v.kulupId),den=v.denenen||[];
    const yok=sp?null:'Sponsor ödemesi artık beklemiyor',haber=anDakika(tarihEkle(k.tarih,1),EKIP_HABER_DAKIKASI);
    return[
      {id:'kendin',metin:'Sponsorun sahibiyle kendin görüş',sure:90,engel:yok||(den.includes('kendin')?'Sponsorun sahibiyle zaten görüştün':null),
        aciklama:['90 dakika sürer. Ödeme gününü yüz yüze konuşursun.','Ne isteyeceğini görüşmeden bilemezsin; bir teklif gelirse kabul edip etmemek yine sana kalır.']},
      {id:'devret',metin:s?`Saymana (${s.ad}) devret`:'Saymana devret',sure:15,
        engel:yok||(!s?'Sayman koltuğu boş':den.includes('devret')?`${s.ad} zaten görüştü`:kisiMesgul(k,s.id)?`${s.ad} şu an başka bir işte`:haber>=isAn(is)?'Saymanın haberi son cevap saatinden sonra gelir':null),
        aciklama:['15 dakikalık bilgilendirme; görüşmeyi sayman yürütür, haberi ertesi sabah gelir.','Saymanın yetkisi: '+YONETIM_KOLTUKLARI.sayman.yetki]},
      {id:'bakimErtele',metin:'Çatı bakım taksitini ertelet',sure:30,engel:bakim?null:'Bakım taksiti artık beklemiyor',
        aciklama:bakim?[`${paraYazi(-bakim.veri.tutar)} tutarındaki ödeme ${gunAyYazi(tarihEkle(bakim.tarih,BAKIM_ERTELEME_GUN))} gününe kayar; müteahhit ${paraYazi(BAKIM_ERTELEME_FARKI)} fark alır.`,'Tribün çatısının onarımı Ocak ayına kalır.']:[]},
      {id:'maasGeciktir',metin:'Maaşları sponsor ödemesine kadar beklet',sure:15,engel:yok||(maas?null:'Maaşlar artık beklemiyor'),
        aciklama:sp?[`Maaşlar ${gunAyYazi(sp.tarih)} günü, taksit geldikten sonra ödenir. Para bedeli yok.`,'Personel ve oyuncular maaşın geciktiğini bilecek.']:[]}
    ];
  },
  uygula:(k,is,secim)=>{
    const v=is.veri,olay=k.olaylar[v.olayId],den=(v.denenen||[]).concat(secim),m=k.meseleler[v.meseleId];
    let bilgi;
    if(secim==='devret'){
      const s=saymanKisi(k,v.kulupId),yarin=tarihEkle(k.tarih,1);
      isEkle(k,{tur:'ekip',tarih:yarin,dakika:EKIP_HABER_DAKIKASI,veri:Object.assign({kisiId:s.id,koltuk:'sayman',gorev:'tahsilatGorusmesi',varyant:'kriz',denenen:den},ortakVeri(v))});
      if(!m.kisiler.includes(s.id))m.kisiler.push(s.id);
      return{bilgi:meseleOlay(k,v.meseleId,'odeme.devir',{kisiId:s.id,tarih:yarin})};
    }
    if(secim==='kendin'){
      if(k.kosullar.sponsor.durum==='pazarlik'){
        teklifKarari(k,v,den,{teklif:'pano'});
        return{bilgi:meseleOlay(k,v.meseleId,'odeme.kendin.teklif')};
      }
      const t=sponsorTaksit(k,v);
      olayBilgi(k,olay.id,'odeme.kanit.sahip',{},k.baskanId);
      olay.sonuc.cozum='taksit';
      bilgi=meseleOlay(k,v.meseleId,'odeme.kendin.taksit',t);
    }else if(secim==='bakimErtele'){
      olay.sonuc.bakimErtelendi=true;
      bilgi=meseleOlay(k,v.meseleId,'odeme.bakim',bakimErtele(k,v));
    }else{
      const sp=sponsorIsi(k,v),maas=odemeIsi(k,v.maasIsId);
      isTasi(k,maas.id,sp.tarih,Math.max(maas.dakika,Math.min(1439,sp.dakika+60)));
      olay.sonuc.maasGecikti=true;
      if(k.sozler)sozVer(k,{muhatap:'personel',anahtar:'soz.maas',p:{tarih:sp.tarih},sonTarih:sp.tarih,isId:maas.id,olayId:olay.id});
      bilgi=meseleOlay(k,v.meseleId,'odeme.maas',{tarih:sp.tarih});
    }
    if(krizKontrol(k,v,den))bilgi+=' '+meseleOlay(k,v.meseleId,'odeme.dondu',{acik:nakitAcigi(k,v.kulupId).acik});
    return{bilgi};
  }
};

/* kasa açığı başka bir yoldan kapandıysa (ör. kabul edilen destek) bekleyen kriz kararı düşer: gereksiz karar başkanın önünde kalmaz */
IS_SONRASI.push(k=>{
  for(const is of Object.values(k.isler)){
    if(is.tur!=='ajanda'||is.veri.karar!=='odemeSikismasi'||nakitAcigi(k,is.veri.kulupId).acik>0)continue;
    const v=is.veri,olay=k.olaylar[v.olayId];
    isIptal(k,is.id,'Kasa açığı kapandı');
    if(olay&&!olay.sonuc.cozum)olay.sonuc.cozum='baskaKaynak';
    meseleOlay(k,v.meseleId,'odeme.acikKapandi');
    meseleDegerlendir(k);
  }
});

/* ---- karar: sponsorun teklifi (pano hakkı ya da indirim) ---- */
KARAR_TURLERI.odemeTeklifi={
  tavsiye:odemeTavsiyesi,
  denetle:(k,v)=>{
    const h=odemeMeseleDenetle(k,v);
    if(v.teklif!=='pano'&&v.teklif!=='indirim')h.push(`bilinmeyen teklif (${v.teklif})`);
    if(v.teklif==='indirim'&&(!Number.isInteger(v.oran)||v.oran<1||v.oran>50))h.push(`indirim oranı 1–50 olmalı (${v.oran})`);
    return h;
  },
  secenekler:(k,is)=>{
    const v=is.veri,sp=sponsorIsi(k,v),yok=sp?null:'Sponsor ödemesi artık beklemiyor',t=hemenAn(k);
    const indirimli=sp&&v.teklif==='indirim'?sp.veri.tutar-Math.trunc(sp.veri.tutar*v.oran/100):0;
    return[
      v.teklif==='pano'
        ?{id:'kabul',metin:'Pano hakkını ver',engel:yok||(typeof acikSoz==='function'&&acikSoz(k,'soz.destekPano')?'Pano iki sezon için destekçiye söz verildi':null),aciklama:[`Taksit ${gunAyYazi(t.tarih)} günü tam ödenir.`,'Gelecek sezon stat içi bir pano sponsora bağlanır; o pano başkasına satılamaz.']}
        :{id:'kabul',metin:`%${v.oran} indirimi kabul et`,engel:yok,aciklama:[sp?`Ödeme ${gunAyYazi(t.tarih)} günü ${paraYazi(indirimli)} olarak gelir; aradaki fark geri gelmez.`:'']},
      {id:'ret',metin:'Teklifi reddet',engel:yok,aciklama:[sp?`Sponsor tam öder, ama ertelediği günde (${gunAyYazi(sp.tarih)}). Kasa açığı için başka bir yol seçmen gerekir.`:'']}
    ];
  },
  uygula:(k,is,secim)=>{
    const v=is.veri,olay=k.olaylar[v.olayId];
    if(secim==='kabul'){
      if(v.teklif==='pano'){
        const t=sponsorHemen(k,v);
        olay.sonuc.cozum='pano';olay.sonuc.hak='panoGelecekSezon';
        if(k.sozler)sozVer(k,{muhatap:'sponsor',anahtar:'soz.pano',olayId:olay.id});
        return{bilgi:meseleOlay(k,v.meseleId,'odeme.teklif.pano',{tarih:t.tarih})};
      }
      const t=sponsorHemen(k,v,v.oran);
      olay.sonuc.cozum='indirim';
      return{bilgi:meseleOlay(k,v.meseleId,'odeme.teklif.indirim',{tarih:t.tarih,tutar:t.tutar})};
    }
    let bilgi=meseleOlay(k,v.meseleId,'odeme.teklif.ret');
    if(krizKontrol(k,v,v.denenen||[]))bilgi+=' '+meseleOlay(k,v.meseleId,'odeme.dondu',{acik:nakitAcigi(k,v.kulupId).acik});
    return{bilgi};
  }
};

/* ---- karar: acil olmayan erteleme talebi ---- */
KARAR_TURLERI.anlasmaDegerlendirme={
  denetle:odemeMeseleDenetle,tavsiye:odemeTavsiyesi,
  secenekler:(k,is)=>{
    const v=is.veri,sp=sponsorIsi(k,v),s=saymanKisi(k,v.kulupId),yok=sp?null:'Sponsor ödemesi artık beklemiyor';
    return[
      {id:'kabul',metin:'Ertelemeyi kabul et',engel:yok,aciklama:[sp?`Taksit ${gunAyYazi(sp.tarih)} günü gelir; başka bir şey değişmez.`:'']},
      {id:'bedel',metin:'Sözleşmedeki gecikme bedelini iste',engel:yok,aciklama:[sp?`Taksit yine ${gunAyYazi(sp.tarih)} günü gelir; sponsor ayrıca ${paraYazi(bedelTutari(sp.veri.tutar))} öder.`:'','Sponsorun bunu nasıl karşılayacağı belli değil.']},
      {id:'devret',metin:s?`Saymana (${s.ad}) incelet`:'Saymana incelet',engel:yok||(!s?'Sayman koltuğu boş':kisiMesgul(k,s.id)?`${s.ad} şu an başka bir işte`:null),
        aciklama:['Sayman sponsorla görüşür, haberi ertesi sabah gelir.','Saymanın yetkisi: '+YONETIM_KOLTUKLARI.sayman.yetki]}
    ];
  },
  uygula:(k,is,secim)=>{
    const v=is.veri,olay=k.olaylar[v.olayId],sp=sponsorIsi(k,v),m=k.meseleler[v.meseleId];
    if(secim==='devret'){
      const s=saymanKisi(k,v.kulupId),yarin=tarihEkle(k.tarih,1);
      isEkle(k,{tur:'ekip',tarih:yarin,dakika:EKIP_HABER_DAKIKASI,veri:Object.assign({kisiId:s.id,koltuk:'sayman',gorev:'tahsilatGorusmesi',varyant:'degerlendirme',denenen:[]},ortakVeri(v))});
      if(!m.kisiler.includes(s.id))m.kisiler.push(s.id);
      return{bilgi:meseleOlay(k,v.meseleId,'odeme.devir',{kisiId:s.id,tarih:yarin})};
    }
    if(secim==='bedel'){
      olay.sonuc.cozum='bedel';
      return{bilgi:meseleOlay(k,v.meseleId,'odeme.bedel',{tarih:sp.tarih,bedel:sponsorBedel(k,v)})};
    }
    olay.sonuc.cozum='kabul';
    return{bilgi:meseleOlay(k,v.meseleId,'odeme.kabul',{tarih:sp.tarih})};
  }
};

/* ---- ekip görevi: saymanın sponsor görüşmesi (sonuç: sponsorun gerçek durumu × görevlendirilen saymanın gizli katkısı) ---- */
EKIP_GOREVLERI.tahsilatGorusmesi={
  denetle:(k,v)=>{const h=odemeMeseleDenetle(k,v);if(v.varyant!=='kriz'&&v.varyant!=='degerlendirme')h.push(`bilinmeyen varyant (${v.varyant})`);return h;},
  bekleme:(k,is)=>`${kisiAdi(k,is.veri.kisiId)} sponsorla görüşüyor; haber bekleniyor`,
  uygula:(k,is)=>{
    const v=is.veri,olay=k.olaylar[v.olayId],s=k.kisiler[v.kisiId],kriz=v.varyant==='kriz',sikisik=k.kosullar.sponsor.durum==='nakitSikisik';
    const yaz=(anahtar,p)=>meseleOlay(k,v.meseleId,anahtar,Object.assign({kisiId:s.id},p));
    if(!sponsorIsi(k,v))return{bilgi:yaz('odeme.ekip.bosa')};
    const B=katki(s,'baglanti'),mali=katki(s,'mali');
    let bilgi;
    if(!sikisik&&B==='guclu'){
      /* pazarlık payı arayan sponsor, üst yönetimini tanıyan saymana karşı talebini geri çeker */
      olay.sonuc.cozum='tamOdeme';
      bilgi=yaz('odeme.ekip.tam',{tarih:sponsorHemen(k,v).tarih});
    }else if(sikisik&&mali==='guclu'){
      /* gerçekten sıkışık sponsorla mali deneyimli sayman ödeme planı kurar (yetkisi içinde); sözleşmeyi satır satır okuyan bedeli de işletir */
      const bedel=B==='zayif'?sponsorBedel(k,v):0,t=sponsorTaksit(k,v);
      olay.sonuc.cozum='taksit';
      bilgi=bedel?yaz('odeme.ekip.taksitBedel',Object.assign({bedel},t)):yaz('odeme.ekip.taksit',t);
    }else if(sikisik&&kriz){
      /* plan kuramayan sayman hemen ödeme için indirim teklifi getirir; yetkisini aşar, karar başkana döner */
      teklifKarari(k,v,v.denenen||[],{teklif:'indirim',oran:INDIRIM_ORAN});
      return{bilgi:yaz('odeme.ekip.indirimTalebi',{oran:INDIRIM_ORAN}),dur:true};
    }else if(!sikisik&&kriz&&B==='orta'){
      bilgi=yaz('odeme.ekip.bedel',{bedel:sponsorBedel(k,v)});
    }else if(kriz)bilgi=yaz('odeme.ekip.sonucsuz');
    else{
      olayBilgi(k,olay.id,'odeme.kanit.yorum',{sikisik},s.id);
      olay.sonuc.cozum='kabul';
      bilgi=yaz('odeme.ekip.rapor');
    }
    if(kriz&&krizKontrol(k,v,v.denenen||[]))return{bilgi:bilgi+' '+meseleOlay(k,v.meseleId,'odeme.dondu',{acik:nakitAcigi(k,v.kulupId).acik}),dur:true};
    return{bilgi};
  },
  /* görevlendirilen sayman koltuktan ayrıldı: kasa yetmiyorsa karar başkana döner */
  geriDon:(k,is)=>{const v=is.veri;krizKontrol(k,v,(v.denenen||[]).filter(x=>x!=='devret'));}
};

/* ---- karar: olay doğmadan önce saymanla nakit takvimi görüşmesi (önleme imkânı) ---- */
KARAR_TURLERI.nakitTakvimi={
  denetle:(k,v)=>{const h=odemeDenetle(k,v);if(typeof v.gelismeIsId!=='string')h.push('gelişme işi kimliği yok');return h;},
  secenekler:(k,is)=>{
    const v=is.veri,sp=odemeIsi(k,v.odemeIsId),bakim=odemeIsi(k,v.bakimIsId),s=saymanKisi(k,v.kulupId),bos=s?null:'Sayman koltuğu boş';
    return[
      {id:'takip',metin:'Sponsor ödemesini şimdiden teyit ettir',engel:bos||(sp?null:'Sponsor ödemesi artık beklemiyor'),
        aciklama:[`${s?s.ad:'Sayman'} sponsorun muhasebesini arar ve ödeme gününü sorar.`,'Teyit alıp alamayacağı belli değil.']},
      {id:'bakim',metin:'Çatı bakım taksitini ertelet',engel:bos||(bakim?null:'Bakım taksiti artık beklemiyor'),
        aciklama:bakim?[`${paraYazi(-bakim.veri.tutar)} tutarındaki ödeme ${gunAyYazi(tarihEkle(bakim.tarih,BAKIM_ERTELEME_GUN))} gününe kayar; müteahhit ${paraYazi(BAKIM_ERTELEME_FARKI)} fark alır.`,'Tribün çatısının onarımı Ocak ayına kalır; kasada pay bırakır.']:[]},
      {id:'kalici',metin:'Tahsilat takibini kalıcı olarak saymana bırak',engel:bos||(k.kulupler[v.kulupId].sorumluluklar&&k.kulupler[v.kulupId].sorumluluklar.tahsilat&&s&&k.kulupler[v.kulupId].sorumluluklar.tahsilat.kisiId===s.id?'Tahsilat takibi zaten saymanda':null),
        aciklama:[`Bundan sonra geciken ya da ertelenmek istenen ödemelerde ${s?s.ad:'sayman'} sana sormadan görüşür.`,'Yetkisi: '+YONETIM_KOLTUKLARI.sayman.yetki]},
      {id:'bekle',metin:'Takvimi dinle, bir şey değiştirme',engel:bos,aciklama:['Ödemeler planlandığı gibi kalır.']}
    ];
  },
  uygula:(k,is,secim)=>{
    const v=is.veri,s=saymanKisi(k,v.kulupId);
    if(secim==='bakim'){
      const t=bakimErtele(k,v);
      return{bilgi:`Çatı bakım taksiti ${gunAyYazi(t.tarih)} gününe ertelendi; müteahhit farkıyla birlikte ${paraYazi(-t.tutar)} ödenecek. Onarım Ocak ayına kaldı.`};
    }
    if(secim==='bekle')return{bilgi:`${s.ad} nakit takvimini anlattı; bir değişiklik istemedin.`};
    if(secim==='kalici'){
      const c=k.kulupler[v.kulupId];
      c.sorumluluklar=Object.assign({},c.sorumluluklar,{tahsilat:{kisiId:s.id}});
      return{bilgi:`Tahsilat takibini ${s.ad} üstlendi. Yetkisi içindeki görüşmeleri sana sormadan yürütecek; aşan konu sana dönecek.`};
    }
    if(k.kosullar.sponsor.durum==='nakitSikisik')return{bilgi:`${s.ad} sponsorun muhasebesini aradı: ödeme günü için net bir cevap vermediler.`};
    if(katki(s,'baglanti')==='zayif')return{bilgi:`${s.ad} sponsorda muhatap bulamadı; teyit alamadı.`};
    /* pazarlık payı arayan sponsor erkenden aranınca talebini hiç dile getirmez: gelişme doğmaz, konu önlenmiş olarak kaydedilir */
    if(k.isler[v.gelismeIsId]){
      isIptal(k,v.gelismeIsId,'Sponsor ödeme gününü teyit etti');
      if(k.icerik.surum>=1)olayKaydet(k,{paket:'odemeSikismasi',konu:'sponsor:'+v.odemeIsId,durum:'onlendi'});
    }
    const sp=odemeIsi(k,v.odemeIsId);
    return{bilgi:`${s.ad} sponsorun muhasebesini aradı ve teyit aldı: taksit ${gunAyYazi(sp.tarih)} günü yatacak.`};
  }
};

/* ---- girişim: saymanla nakit takvimi (başkan başlatır). Sıkışık başlangıçta yeni saymanın önerdiği görüşme hazır gelir; diğer durumlarda buradan açılır ---- */
GIRISIMLER.nakitTakvimi={
  ad:'Saymanla nakit takvimi',
  aciklama:()=>'45 dakikalık görüşme: haftanın ödemelerine birlikte bakarsınız; tahsilatı teyit ettirebilir ya da takibi saymana bırakabilirsin.',
  uygun:k=>{
    const kulupId=k.kisiler[k.baskanId].kulupId,s=saymanKisi(k,kulupId);
    if(Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.karar==='nakitTakvimi')||k.gecmis.some(g=>g.tur==='is'&&g.sonuc&&g.sonuc.secim&&g.sonuc.baslik==='Saymanla nakit takvimi'&&g.sonuc.durum==='yapildi'))return false;
    if(!s)return'Sayman koltuğu boş';
    return k.gunIciDakika+45>1140?'Bugün için geç oldu':true;
  },
  baslat:k=>{
    const kulupId=k.kisiler[k.baskanId].kulupId,bul=kalem=>bekleyenOdemeler(k,kulupId).find(x=>x.veri.kalem===kalem);
    const sp=bul('sponsor'),maas=bul('maas'),bakim=bul('bakim'),gel=Object.values(k.isler).find(x=>x.tur==='gelisme'&&x.veri.gelisme==='sponsorErteleme');
    isEkle(k,{tur:'ajanda',tarih:k.tarih,dakika:k.gunIciDakika,veri:{baslik:'Saymanla nakit takvimi',zorunluluk:'istege',sure:45,karar:'nakitTakvimi',kulupId,
      odemeIsId:sp?sp.id:'yok',maasIsId:maas?maas.id:'yok',bakimIsId:bakim?bakim.id:'yok',gelismeIsId:gel?gel.id:'yok',
      aciklama:'Saymanı çağırdın; haftanın ödeme takvimine birlikte bakacaksınız.'}});
    return'Saymanı çağırdın; görüşme ajandada.';
  }
};
