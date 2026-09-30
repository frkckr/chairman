/* ============ Chairman — yönetim ekibi: koltuklar, adaylar ve yetki sınırlı işler (çizim yok; yol haritası 2.2) ============
   İlk kapsam üç koltuktur (kullanıcı kararı, 2026-09-29): sayman, futbol şube sorumlusu, basın sözcüsü.
   Kulüp kaydı: yonetim = {sayman, futbol, basin} → kişi kimliği ya da null (boş koltuk). Alan yoksa denetlenmez.
   Aday/yönetici kişisinin ek alanları (kişi kaydında, isteğe bağlı):
     profil: {meslek, guclu, zayif, beklenti} — oyuncuya gösterilen metin.
     katki: {mali, baglanti, futbol, iletisim} → 'zayif'|'orta'|'guclu' — gizli; sayı ya da seviye olarak gösterilmez,
       yalnız işlerin sonucunu belirler. Sonuçlar belirlenimlidir (olasılık yok).
   Karar türleri (KARAR_TURLERI, js/ajanda.js):
     koltukSecimi     veri {koltuk, adaylar:[kişi]} — boş koltuğa adaylardan biri seçilir.
     sponsorGecikmesi veri {kulupId, odemeIsId, meseleId} — gecikecek sponsor ödemesi: başkan kendisi görüşür ya da saymana devreder.
       Devredilen iş anında sonuçlanmaz: takvime 'ekip' işi (js/mesele.js, görev sponsorGorusmesi) kurulur, sonuç ertesi sabah gelir.
       Saymanın yetkisi ödeme takvimi ve taksittir; indirim yetkisi yoktur. İndirim istenirse iş başkana saati serbest karar olarak döner.
     sponsorIndirimi  veri {kulupId, odemeIsId, oran, meseleId} — başkanın indirim kararı (kabul ya da ret).
   Sponsor konusu tek meseledir: karar işleri, ekip işi ve bütün ödemeler aynı meseleId'yi taşır; her adım meseleye olay yazar.
   Metinler, tutarlar, tarihler ve ekip işinin süresi TEST verisidir. */
const YONETIM_KOLTUKLARI={
  sayman:{ad:'Sayman',alan:'Mali işler: ödemeler, alacaklar ve bütçe takibi.',
    yetki:'Ödeme takvimi ve taksit üzerinde anlaşabilir. İndirim, yeni harcama ve sözleşme başkana döner.'},
  futbol:{ad:'Futbol şube sorumlusu',alan:'Teknik direktörle temas ve transfer araştırması.',
    yetki:'Araştırma ve ilk teması yapabilir. Teklif ve imza başkana döner.'},
  basin:{ad:'Basın sözcüsü',alan:'Medya ve taraftarla ilişkiler.',
    yetki:'Kulüp adına rutin açıklama yapabilir. Başkan adına söz veremez.'}
};
const KATKI_ALANLARI=['mali','baglanti','futbol','iletisim'];
const KATKI_SEVIYELERI=['zayif','orta','guclu'];
const PROFIL_ALANLARI=['meslek','guclu','zayif','beklenti'];

const EKIP_HABER_DAKIKASI=570;              // devredilen işin haberi ertesi gün 09:30'da gelir (TEST değeri)
const katki=(p,alan)=>(p&&p.katki&&p.katki[alan])||'orta';
const koltuktaMi=(k,kisiId)=>Object.values(k.kulupler).some(c=>c.yonetim&&Object.values(c.yonetim).includes(kisiId));

/* bir kişiyi koltuğa oturtur */
function koltugaAta(k,kulupId,koltuk,kisiId){
  const c=k.kulupler[kulupId],p=k.kisiler[kisiId];
  if(!c||!c.yonetim||!(koltuk in c.yonetim))throw new Error(`Koltuk bulunamadı: ${kulupId}/${koltuk}`);
  if(c.yonetim[koltuk])throw new Error(`${YONETIM_KOLTUKLARI[koltuk].ad} koltuğu dolu`);
  if(!p||p.durum!=='aktif')throw new Error(`Kişi göreve uygun değil: ${kisiId}`);
  if(koltuktaMi(k,kisiId))throw new Error(`${p.ad} zaten bir koltukta`);
  c.yonetim[koltuk]=kisiId;p.rol='yonetici';p.kulupId=kulupId;
}

/* ---- karar: boş koltuğa aday seçimi ---- */
KARAR_TURLERI.koltukSecimi={
  denetle:(k,v)=>{
    const h=[];
    if(!YONETIM_KOLTUKLARI[v.koltuk])h.push(`bilinmeyen koltuk (${v.koltuk})`);
    if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);
    if(!Array.isArray(v.adaylar)||!v.adaylar.length)h.push('aday listesi yok');
    else for(const id of v.adaylar)if(!(k.kisiler||{})[id])h.push(`aday bulunamadı (${id})`);
    return h;
  },
  secenekler:(k,is)=>{
    const v=is.veri,c=k.kulupler[v.kulupId],dolu=!!(c.yonetim&&c.yonetim[v.koltuk]);
    return v.adaylar.map(id=>{const p=k.kisiler[id],pr=p.profil||{};
      return{id,metin:p.ad,aciklama:[pr.meslek,pr.guclu&&'Güçlü yanı: '+pr.guclu,pr.zayif&&'Zayıf yanı: '+pr.zayif,pr.beklenti&&'Beklentisi: '+pr.beklenti].filter(Boolean),
        engel:dolu?`${YONETIM_KOLTUKLARI[v.koltuk].ad} koltuğu artık dolu`:p.durum!=='aktif'?`${p.ad} artık aday değil`:koltuktaMi(k,id)?`${p.ad} zaten bir koltukta`:null};});
  },
  uygula:(k,is,secim)=>{
    const v=is.veri,p=k.kisiler[secim];
    koltugaAta(k,v.kulupId,v.koltuk,secim);
    return{bilgi:`${p.ad} ${YONETIM_KOLTUKLARI[v.koltuk].ad.toLocaleLowerCase('tr-TR')} oldu. Yetkisi: ${YONETIM_KOLTUKLARI[v.koltuk].yetki}`+
      (p.profil&&p.profil.beklenti?` Beklentisini açıkça söyledi: ${p.profil.beklenti}`:'')};
  }
};

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

/* başkana dönen karar: saati serbest, son cevap anı bugünün sonu (js/ajanda.js) */
const donenKarar=(k,veri)=>isEkle(k,{tur:'ajanda',tarih:k.tarih,dakika:1439,
  veri:Object.assign({zorunluluk:'zorunlu',saatsiz:true,gelis:{tarih:k.tarih,dakika:k.gunIciDakika}},veri)});

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

/* yönetim alanlarının doğrulaması (kariyerDogrula EK_DENETIMLER üzerinden çağırır) */
function yonetimDogrula(k,h){
  const kisiler=k.kisiler||{},oturan=new Map();
  for(const [id,c] of Object.entries(k.kulupler||{})){
    if(!c||c.yonetim===undefined)continue;
    if(!c.yonetim||typeof c.yonetim!=='object'||Array.isArray(c.yonetim)){h.push(`Kulüp ${id}: yönetim kaydı nesne değil`);continue;}
    for(const [koltuk,kisiId] of Object.entries(c.yonetim)){
      const ad=`Kulüp ${id} ${koltuk} koltuğu`;
      if(!YONETIM_KOLTUKLARI[koltuk]){h.push(`${ad}: bilinmeyen koltuk`);continue;}
      if(kisiId===null)continue;
      const p=kisiler[kisiId];
      if(!p){h.push(`${ad}: kişi bulunamadı (${kisiId})`);continue;}
      if(p.durum!=='aktif')h.push(`${ad}: ${p.ad} aktif değil`);
      if(p.kulupId!==id)h.push(`${ad}: ${p.ad} bu kulübe bağlı değil`);
      if(p.rol!=='yonetici')h.push(`${ad}: ${p.ad} yönetici rolünde değil`);
      if(oturan.has(kisiId))h.push(`${ad}: ${p.ad} iki koltukta birden (${oturan.get(kisiId)})`);
      oturan.set(kisiId,`${id} ${koltuk}`);
    }
  }
  for(const [id,p] of Object.entries(kisiler)){
    if(!p)continue;
    if(p.katki!==undefined){
      if(!p.katki||typeof p.katki!=='object')h.push(`Kişi ${id}: katkı kaydı nesne değil`);
      else for(const [alan,sev] of Object.entries(p.katki)){
        if(!KATKI_ALANLARI.includes(alan))h.push(`Kişi ${id}: bilinmeyen katkı alanı (${alan})`);
        else if(!KATKI_SEVIYELERI.includes(sev))h.push(`Kişi ${id}: bilinmeyen katkı seviyesi (${alan}: ${sev})`);
      }
    }
    if(p.profil!==undefined){
      if(!p.profil||typeof p.profil!=='object')h.push(`Kişi ${id}: profil nesne değil`);
      else for(const [alan,m] of Object.entries(p.profil))if(!PROFIL_ALANLARI.includes(alan)||typeof m!=='string')h.push(`Kişi ${id}: geçersiz profil alanı (${alan})`);
    }
  }
}
EK_DENETIMLER.push(yonetimDogrula);
