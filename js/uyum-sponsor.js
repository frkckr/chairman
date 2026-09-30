/* ============ Chairman — eski sabit sponsor içeriği: yalnız kayıt uyumu (çizim yok) ============
   Yol haritası 2.2–2.3'ün sabit TEST haftasındaki forma sponsoru kararları. 2.4A'dan beri yeni kariyer bu kararları ÜRETMEZ
   (yeni içerik js/paket-odeme.js'tedir). Bu dosya sürüm 1–2 kayıtlarında bekleyen işlerin (içerik sürümü 0) kaldığı yerden
   tamamlanabilmesi ve kural denemelerinin eski örnek haftası (KARIYER_BASLANGIC) için durur; davranışı değiştirilmez.
   Karar türleri:
     sponsorGecikmesi veri {kulupId, odemeIsId, meseleId} — gecikecek sponsor ödemesi: başkan kendisi görüşür ya da saymana devreder.
       Devredilen iş takvime 'ekip' işi (görev sponsorGorusmesi) kurar; sonuç ertesi sabah, görevlendirilen saymanın gizli katkısına göre gelir.
       Saymanın yetkisi ödeme takvimi ve taksittir; indirim istenirse iş başkana saati serbest karar olarak döner.
     sponsorIndirimi  veri {kulupId, odemeIsId, oran, meseleId} — başkanın indirim kararı (kabul ya da ret).
   Sonuçlar olasılıksızdır. Metinler ve tutarlar TEST verisidir. */
/* ---- karar: gecikecek sponsor ödemesi ---- */
const sponsorOdemesi=(k,v)=>{const is=k.isler[v.odemeIsId];return is&&is.tur==='odeme'?is:null;};
function sponsorDenetle(k,v){
  const h=[];
  if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);
  if(typeof v.odemeIsId!=='string')h.push('ödeme işi kimliği yok');
  if(typeof v.meseleId!=='string')h.push('sponsor işi bir meseleye bağlı değil');
  return h;
}
Object.assign(MESELE_OLAYLARI,{
  'sponsor.acildi':(k,p)=>`${kisiAdi(k,p.kisiId)} haber verdi: forma sponsoru ilk taksiti geciktirmek istiyor.`,
  'sponsor.kendin':(k,p)=>`Temsilciyle kendin görüştün: ödeme planlanan günde (${gunAyYazi(p.tarih)}) tam yapılacak. Karşılığında gelecek sezon stat içi pano istiyorlar; henüz söz vermedin.`,
  'sponsor.devir':(k,p)=>`Görüşmeyi ${kisiAdi(k,p.kisiId)} üstlendi; ${gunAyYazi(p.tarih)} sabahı haber verecek.`,
  'sponsor.indirimTalebi':(k,p)=>`${kisiAdi(k,p.kisiId)} sponsorun genel müdürüne ulaştı: ödeme zamanında yapılabilir ama %${p.oran} indirim istiyorlar. İndirim saymanın yetkisini aştığı için karar sende.`,
  'sponsor.taksit':(k,p)=>`${kisiAdi(k,p.kisiId)} iki taksitte anlaştı: yarısı ${gunAyYazi(p.ilk)}, kalanı ${gunAyYazi(p.son)} günü gelecek.`,
  'sponsor.gecikme':(k,p)=>`${kisiAdi(k,p.kisiId)} temsilcinin üstlerine ulaşamadı; ödeme ${gunAyYazi(p.tarih)} gününe kaydı. Sözleşmedeki gecikme maddesini buldu: sponsor ${paraYazi(p.bedel)} gecikme bedeli ödeyecek.`,
  'sponsor.indirimKabul':(k,p)=>`İndirimi kabul ettin; ödeme planlanan günde (${gunAyYazi(p.tarih)}) ${paraYazi(p.tutar)} olarak gelecek.`,
  'sponsor.indirimRet':(k,p)=>`İndirimi reddettin. Sponsor tam ödeyecek ama iki hafta geç: ${gunAyYazi(p.tarih)}.`,
  'sponsor.gorusmeBosa':()=>'Ödeme artık beklemediği için görüşmeye gerek kalmadı.'
});
KARAR_TURLERI.sponsorGecikmesi={
  denetle:sponsorDenetle,
  secenekler:(k,is)=>{
    const v=is.veri,c=k.kulupler[v.kulupId],odeme=sponsorOdemesi(k,v),saymanId=c.yonetim&&c.yonetim.sayman,s=saymanId?k.kisiler[saymanId]:null;
    const yok=odeme?null:'Sponsor ödemesi artık beklemiyor';
    return[
      {id:'kendin',metin:'Temsilciyle kendin görüş',sure:90,engel:yok,
        aciklama:['90 dakika sürer. Ödemeyi yüz yüze konuşursun.']},
      {id:'devret',metin:s?`Saymana (${s.ad}) devret`:'Saymana devret',sure:15,engel:yok||(s?null:'Sayman koltuğu boş'),
        aciklama:['15 dakikalık bilgilendirme; görüşmeyi sayman yürütür.','Saymanın yetkisi: '+YONETIM_KOLTUKLARI.sayman.yetki]}
    ];
  },
  uygula:(k,is,secim)=>{
    const v=is.veri,odeme=sponsorOdemesi(k,v),c=k.kulupler[v.kulupId];
    if(secim==='kendin')return{bilgi:meseleOlay(k,v.meseleId,'sponsor.kendin',{tarih:odeme.tarih})};
    /* devir: görevlendirilen kişi işte saklanır; sonuç takvim ilerleyince, o kişinin katkısına göre gelir */
    const s=k.kisiler[c.yonetim.sayman],yarin=tarihEkle(k.tarih,1),m=k.meseleler[v.meseleId];
    isEkle(k,{tur:'ekip',tarih:yarin,dakika:EKIP_HABER_DAKIKASI,veri:{meseleId:v.meseleId,kisiId:s.id,kulupId:v.kulupId,koltuk:'sayman',gorev:'sponsorGorusmesi',odemeIsId:v.odemeIsId}});
    if(!m.kisiler.includes(s.id))m.kisiler.push(s.id);
    return{bilgi:meseleOlay(k,v.meseleId,'sponsor.devir',{kisiId:s.id,tarih:yarin})};
  }
};

/* ---- ekip görevi: saymanın sponsor görüşmesi (sonuç görevlendirilen saymanın gizli katkısına göre, olasılıksız) ---- */
EKIP_GOREVLERI.sponsorGorusmesi={
  denetle:(k,v)=>typeof v.odemeIsId==='string'?[]:['ödeme işi kimliği yok'],
  bekleme:(k,is)=>`${kisiAdi(k,is.veri.kisiId)} sponsorla görüşüyor; haber bekleniyor`,
  uygula:(k,is)=>{
    const v=is.veri,odeme=sponsorOdemesi(k,v),s=k.kisiler[v.kisiId],olay=(anahtar,p)=>meseleOlay(k,v.meseleId,anahtar,Object.assign({kisiId:s.id},p));
    if(!odeme)return{bilgi:meseleOlay(k,v.meseleId,'sponsor.gorusmeBosa')};
    const tutar=odeme.veri.tutar,sonra=tarihEkle(odeme.tarih,14),plan=x=>odemePlanla(k,Object.assign({kulupId:v.kulupId,dakika:odeme.dakika,kalem:odeme.veri.kalem,meseleId:v.meseleId},x));
    if(katki(s,'baglanti')==='guclu'){
      /* bağlantısı güçlü sayman sponsorun üst yönetimine ulaşır; indirim talebi yetkisini aşar, karar başkana döner */
      donenKarar(k,{baslik:'Sponsor indirim istiyor',sure:15,karar:'sponsorIndirimi',kulupId:v.kulupId,odemeIsId:v.odemeIsId,oran:10,kisiId:s.id,meseleId:v.meseleId,
        aciklama:`${s.ad} sponsorun genel müdürüyle görüştü: ödeme zamanında yapılabilir, ancak %10 indirim istiyorlar. İndirim saymanın yetkisini aştığı için karar sana kaldı.`});
      return{bilgi:olay('sponsor.indirimTalebi',{oran:10}),dur:true};
    }
    if(katki(s,'mali')==='guclu'&&katki(s,'baglanti')==='orta'){
      /* mali deneyimli sayman taksit planı kurar (yetkisi içinde) */
      const yarim=Math.trunc(tutar/2);
      isIptal(k,odeme.id,'Sayman taksit planı yaptı');
      plan({tarih:odeme.tarih,tutar:yarim,aciklama:odeme.veri.aciklama+' (1/2)'});
      plan({tarih:sonra,tutar:tutar-yarim,aciklama:odeme.veri.aciklama+' (2/2)'});
      return{bilgi:olay('sponsor.taksit',{ilk:odeme.tarih,son:sonra})};
    }
    /* bağlantısı zayıf sayman karar vericiye ulaşamaz; ödeme kayar, sözleşmedeki gecikme bedeli işletilir */
    isTasi(k,odeme.id,sonra,odeme.dakika);
    const bedel=Math.trunc(Math.abs(tutar)/50);
    plan({tarih:sonra,tutar:bedel,aciklama:'Sponsor gecikme bedeli (sözleşme maddesi)'});
    return{bilgi:olay('sponsor.gecikme',{tarih:sonra,bedel})};
  },
  /* görevlendirilen sayman koltuktan ayrıldı: görüşme kararı başkana döner */
  geriDon:(k,is)=>{
    const v=is.veri;
    if(sponsorOdemesi(k,v))donenKarar(k,{baslik:'Sponsor görüşmesi sahipsiz kaldı',sure:90,karar:'sponsorGecikmesi',kulupId:v.kulupId,odemeIsId:v.odemeIsId,meseleId:v.meseleId,
      aciklama:'Görüşmeyi üstlenen sayman görevden ayrıldı. Temsilciyle kendin görüşebilir ya da işi yeni saymana devredebilirsin.'});
  }
};

/* ---- karar: saymanın yetkisini aşan indirim talebi ---- */
KARAR_TURLERI.sponsorIndirimi={
  denetle:(k,v)=>{const h=sponsorDenetle(k,v);if(!Number.isInteger(v.oran)||v.oran<1||v.oran>50)h.push(`indirim oranı 1–50 olmalı (${v.oran})`);return h;},
  secenekler:(k,is)=>{
    const v=is.veri,odeme=sponsorOdemesi(k,v),yok=odeme?null:'Sponsor ödemesi artık beklemiyor';
    const indirimli=odeme?odeme.veri.tutar-Math.trunc(odeme.veri.tutar*v.oran/100):0;
    return[
      {id:'kabul',metin:`%${v.oran} indirimi kabul et`,engel:yok,aciklama:[odeme?`Ödeme planlanan günde (${gunAyYazi(odeme.tarih)}) ${paraYazi(indirimli)} olarak gelir.`:'']},
      {id:'ret',metin:'İndirimi reddet',engel:yok,aciklama:['Sponsor tam öder ama ödemeyi iki hafta geciktirir.']}
    ];
  },
  uygula:(k,is,secim)=>{
    const v=is.veri,odeme=sponsorOdemesi(k,v);
    if(secim==='kabul'){
      const yeni=odeme.veri.tutar-Math.trunc(odeme.veri.tutar*v.oran/100);
      isIptal(k,odeme.id,`%${v.oran} indirim kabul edildi`);
      odemePlanla(k,{kulupId:v.kulupId,tarih:odeme.tarih,dakika:odeme.dakika,tutar:yeni,kalem:odeme.veri.kalem,aciklama:odeme.veri.aciklama+` (%${v.oran} indirimli)`,meseleId:v.meseleId});
      return{bilgi:meseleOlay(k,v.meseleId,'sponsor.indirimKabul',{tarih:odeme.tarih,tutar:yeni})};
    }
    const sonra=tarihEkle(odeme.tarih,14);
    isTasi(k,odeme.id,sonra,odeme.dakika);
    return{bilgi:meseleOlay(k,v.meseleId,'sponsor.indirimRet',{tarih:sonra})};
  }
};
