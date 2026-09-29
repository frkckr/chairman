/* ============ Chairman — yönetim ekibi: koltuklar, adaylar ve yetki sınırlı işler (çizim yok; yol haritası 2.2) ============
   İlk kapsam üç koltuktur (kullanıcı kararı, 2026-09-29): sayman, futbol şube sorumlusu, basın sözcüsü.
   Kulüp kaydı: yonetim = {sayman, futbol, basin} → kişi kimliği ya da null (boş koltuk). Alan yoksa denetlenmez.
   Aday/yönetici kişisinin ek alanları (kişi kaydında, isteğe bağlı):
     profil: {meslek, guclu, zayif, beklenti} — oyuncuya gösterilen metin.
     katki: {mali, baglanti, futbol, iletisim} → 'zayif'|'orta'|'guclu' — gizli; sayı ya da seviye olarak gösterilmez,
       yalnız işlerin sonucunu belirler. Sonuçlar belirlenimlidir (olasılık yok).
   Karar türleri (KARAR_TURLERI, js/ajanda.js):
     koltukSecimi     veri {koltuk, adaylar:[kişi]} — boş koltuğa adaylardan biri seçilir.
     sponsorGecikmesi veri {kulupId, odemeIsId} — gecikecek sponsor ödemesi: başkan kendisi görüşür ya da saymana devreder.
       Saymanın yetkisi ödeme takvimi ve taksittir; indirim yetkisi yoktur. İndirim istenirse iş başkana yeni karar olarak döner.
     sponsorIndirimi  veri {kulupId, odemeIsId, oran} — başkanın indirim kararı (kabul ya da ret).
   Metinler, tutarlar ve tarihler TEST verisidir. */
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

const TR_AYLAR=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const gunAyYazi=t=>{const [,a,g]=t.split('-').map(Number);return g+' '+TR_AYLAR[a-1];};
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
  return h;
}
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
    const v=is.veri,odeme=sponsorOdemesi(k,v),tutar=odeme.veri.tutar,c=k.kulupler[v.kulupId];
    if(secim==='kendin')
      return{bilgi:`Temsilci ödemenin planlanan günde (${gunAyYazi(odeme.tarih)}) tam yapılacağını söyledi. Karşılığında gelecek sezon stat içi pano istiyorlar; henüz söz vermedin.`};
    const s=k.kisiler[c.yonetim.sayman];
    const yarin=tarihEkle(k.tarih,1),sonra=tarihEkle(odeme.tarih,14);
    if(katki(s,'baglanti')==='guclu'){
      /* bağlantısı güçlü sayman sponsorun üst yönetimine ulaşır; indirim talebi yetkisini aşar, karar başkana döner */
      isEkle(k,{tur:'ajanda',tarih:yarin,dakika:600,veri:{baslik:'Sponsor indirim istiyor',zorunluluk:'zorunlu',sure:30,karar:'sponsorIndirimi',
        kulupId:v.kulupId,odemeIsId:v.odemeIsId,oran:10,kisiId:s.id,
        aciklama:`${s.ad} sponsorun genel müdürüyle görüştü: ödeme zamanında yapılabilir, ancak %10 indirim istiyorlar. İndirim saymanın yetkisini aştığı için karar sana kaldı.`}});
      return{bilgi:`${s.ad} sponsorun genel müdürüne ulaştı. Ödeme zamanında yapılabilir ama sponsor indirim istiyor. İndirim saymanın yetkisinde olmadığı için yarın karar sana gelecek.`};
    }
    if(katki(s,'mali')==='guclu'&&katki(s,'baglanti')==='orta'){
      /* mali deneyimli sayman taksit planı kurar (yetkisi içinde) */
      const yarim=Math.trunc(tutar/2);
      isIptal(k,odeme.id,'Sayman taksit planı yaptı');
      odemePlanla(k,{kulupId:v.kulupId,tarih:odeme.tarih,dakika:odeme.dakika,tutar:yarim,kalem:odeme.veri.kalem,aciklama:odeme.veri.aciklama+' (1/2)'});
      odemePlanla(k,{kulupId:v.kulupId,tarih:sonra,dakika:odeme.dakika,tutar:tutar-yarim,kalem:odeme.veri.kalem,aciklama:odeme.veri.aciklama+' (2/2)'});
      return{bilgi:`${s.ad} iki taksitte anlaştı: yarısı ${gunAyYazi(odeme.tarih)}, kalanı ${gunAyYazi(sonra)} günü gelecek.`};
    }
    /* bağlantısı zayıf sayman karar vericiye ulaşamaz; ödeme kayar, sözleşmedeki gecikme bedeli işletilir */
    isTasi(k,odeme.id,sonra,odeme.dakika);
    const bedel=Math.trunc(Math.abs(tutar)/50);
    odemePlanla(k,{kulupId:v.kulupId,tarih:sonra,dakika:odeme.dakika,tutar:bedel,kalem:odeme.veri.kalem,aciklama:'Sponsor gecikme bedeli (sözleşme maddesi)'});
    return{bilgi:`${s.ad} temsilcinin üstlerine ulaşamadı; ödeme ${gunAyYazi(sonra)} gününe kaydı. Sözleşmedeki gecikme maddesini buldu: sponsor ${paraYazi(bedel)} gecikme bedeli ödeyecek.`};
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
      odemePlanla(k,{kulupId:v.kulupId,tarih:odeme.tarih,dakika:odeme.dakika,tutar:yeni,kalem:odeme.veri.kalem,aciklama:odeme.veri.aciklama+` (%${v.oran} indirimli)`});
      return{bilgi:`İndirim kabul edildi; ödeme planlanan günde (${gunAyYazi(odeme.tarih)}) ${paraYazi(yeni)} olarak gelecek.`};
    }
    const sonra=tarihEkle(odeme.tarih,14);
    isTasi(k,odeme.id,sonra,odeme.dakika);
    return{bilgi:`İndirimi reddettin. Sponsor tam ödeyecek ama iki hafta geç: ${gunAyYazi(sonra)}.`};
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
