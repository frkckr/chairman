/* ============ Chairman — yönetim ekibi: koltuklar, adaylar ve yetki sınırlı işler (çizim yok; yol haritası 2.2) ============
   İlk kapsam üç koltuktur (kullanıcı kararı, 2026-09-29): sayman, futbol şube sorumlusu, basın sözcüsü.
   Kulüp kaydı: yonetim = {sayman, futbol, basin} → kişi kimliği ya da null (boş koltuk). Alan yoksa denetlenmez.
   Aday/yönetici kişisinin ek alanları (kişi kaydında, isteğe bağlı):
     profil: {meslek, guclu, zayif, beklenti} — oyuncuya gösterilen metin.
     katki: {mali, baglanti, futbol, iletisim} → 'zayif'|'orta'|'guclu' — gizli; sayı ya da seviye olarak gösterilmez,
       yalnız işlerin sonucunu belirler.
   Karar türü (KARAR_TURLERI, js/ajanda.js):
     koltukSecimi     veri {koltuk, adaylar:[kişi]} — boş koltuğa adaylardan biri seçilir.
   donenKarar: ekibin yetkisini aşan konu başkana saati serbest zorunlu karar olarak döner.
   2.6: tavsiye (karar başkanda kalır, görüş dosyaya düşer), kapasite (kişi başına tek iş), kalıcı sorumluluk
     (kulüp.sorumluluklar = {alan: {kisiId}}; yetki içindeki iş ek onay istemeden yürür) ve girişim (başkanın başlattığı iş).
   Konuya özgü kararlar kendi dosyasındadır: js/paket-odeme.js (2.4A), eski kayıtlar için js/uyum-sponsor.js.
   Metinler ve ekip işinin süresi TEST verisidir. */
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

/* başkana dönen karar: saati serbest, son cevap anı bugünün sonu (js/ajanda.js) */
const donenKarar=(k,veri)=>isEkle(k,{tur:'ajanda',tarih:k.tarih,dakika:1439,
  veri:Object.assign({zorunluluk:'zorunlu',saatsiz:true,gelis:{tarih:k.tarih,dakika:k.gunIciDakika}},veri)});

/* ---- kapasite: bir kişi aynı anda tek ekip işi ya da tavsiye yürütür ---- */
const kisiMesgul=(k,kisiId)=>Object.values(k.isler).some(x=>x.tur==='ekip'&&x.veri.kisiId===kisiId);
const koltuktaki=(k,kulupId,koltuk)=>{const c=k.kulupler[kulupId],id=c&&c.yonetim&&c.yonetim[koltuk];return id?k.kisiler[id]||null:null;};

/* ---- tavsiye: karar başkanda kalır; ilgili koltuktaki kişi konuyu inceler, görüşü TAVSIYE_SURESI sonra dosyaya kaynağıyla düşer ----
   Karar türü tavsiye: {koltuk, gorus(k, is, kisi) → {anahtar, p}, engel?(k, is, kisi) → metin} sağlarsa tavsiye istenebilir.
   Tavsiye dünyayı değiştirmez; kişinin kapasitesini ve zamanı kullanır. Görüş gelince ilerleme durur (iş veri.durak taşır) */
const TAVSIYE_SURESI=120;                   // görüşün gelmesi için geçen dakika (TEST değeri)
Object.assign(MESELE_OLAYLARI,{
  'tavsiye.istendi':(k,p)=>`${kisiAdi(k,p.kisiId)} konuyu inceliyor; görüşünü ${saatYazi(p.dakika)} gibi bildirecek.`,
  'tavsiye.geldi':(k,p)=>`${kisiAdi(k,p.kisiId)} görüşünü bildirdi; dosyaya işlendi.`,
  'tavsiye.bosa':(k,p)=>`${kisiAdi(k,p.kisiId)} görüşünü getirdi ama karar verilmişti.`
});
/* tavsiye istenebilir mi (kariyeri değiştirmez): null (bu karar için tavsiye yok) ya da {kisi, koltuk, sure, gelis, engel, bekleyen} */
function tavsiyeOnizle(k,isId){
  const is=k.isler[isId],t=is&&is.tur==='ajanda'&&is.veri.karar?KARAR_TURLERI[is.veri.karar]:null;
  if(!t||!t.tavsiye||typeof is.veri.meseleId!=='string')return null;
  const v=is.veri,T=t.tavsiye,kisi=koltuktaki(k,v.kulupId,T.koltuk),gelis=simdikiAn(k)+TAVSIYE_SURESI;
  const bekleyen=Object.values(k.isler).find(x=>x.tur==='ekip'&&x.veri.gorev==='tavsiye'&&x.veri.isId===isId)||null;
  let engel=null;
  if(!kisi)engel=`${YONETIM_KOLTUKLARI[T.koltuk].ad} koltuğu boş`;
  else if(bekleyen)engel=`${kisiAdi(k,bekleyen.veri.kisiId)} inceliyor; görüşü ${saatYazi(bekleyen.dakika)} gibi gelir`;
  else if((v.tavsiyeAlinan||[]).includes(kisi.id))engel=`${kisi.ad} görüşünü bildirdi`;
  else if(T.engel&&T.engel(k,is,kisi))engel=T.engel(k,is,kisi);
  else if(kisiMesgul(k,kisi.id))engel=`${kisi.ad} şu an başka bir işte`;
  else if(anTarih(gelis).tarih!==k.tarih)engel='Bugün için geç oldu';
  else if(v.saatsiz?gelis>=isAn(is):gelis>isAn(is)&&!(v.zorunluluk==='ertelenebilir'&&ertelemeTarihi(is)))engel='Görüş karar saatine yetişmez';
  return{kisi,koltuk:T.koltuk,sure:TAVSIYE_SURESI,gelis,engel,bekleyen:!!bekleyen};
}
function tavsiyeIste(k,isId){
  const o=tavsiyeOnizle(k,isId);
  if(!o)throw new Error('Bu karar için tavsiye istenemez');
  if(o.engel)throw new Error('Tavsiye istenemedi: '+o.engel);
  const is=k.isler[isId],v=is.veri,t=anTarih(o.gelis);
  isEkle(k,{tur:'ekip',tarih:t.tarih,dakika:t.dakika,veri:{meseleId:v.meseleId,kisiId:o.kisi.id,kulupId:v.kulupId,koltuk:o.koltuk,gorev:'tavsiye',isId,durak:true}});
  v.tavsiyeAlinan=(v.tavsiyeAlinan||[]).concat(o.kisi.id);
  const m=k.meseleler[v.meseleId];
  if(!m.kisiler.includes(o.kisi.id))m.kisiler.push(o.kisi.id);
  return meseleOlay(k,v.meseleId,'tavsiye.istendi',{kisiId:o.kisi.id,dakika:t.dakika});
}
EKIP_GOREVLERI.tavsiye={
  denetle:(k,v)=>typeof v.isId==='string'?[]:['tavsiyenin karar işi yok'],
  bekleme:(k,is)=>`${kisiAdi(k,is.veri.kisiId)} konuyu inceliyor; görüşü bekleniyor`,
  uygula:(k,is)=>{
    const v=is.veri,karar=k.isler[v.isId],kisi=k.kisiler[v.kisiId];
    if(!karar||karar.tur!=='ajanda')return{bilgi:meseleOlay(k,v.meseleId,'tavsiye.bosa',{kisiId:kisi.id})};
    const g=KARAR_TURLERI[karar.veri.karar].tavsiye.gorus(k,karar,kisi),olay=meseleOlayi(k,v.meseleId);
    if(olay)olayBilgi(k,olay.id,g.anahtar,g.p,kisi.id);
    meseleOlay(k,v.meseleId,'tavsiye.geldi',{kisiId:kisi.id});
    return{bilgi:`${kisi.ad}: ${MESELE_OLAYLARI[g.anahtar](k,g.p)}`,dur:true,haber:true};
  },
  /* görüşü isteyen karar duruyor; kişi ayrıldıysa görüş gelmez */
  geriDon:()=>{}
};

/* ---- girişim: başkanın kendi başlattığı iş. GIRISIMLER[id] = {ad, aciklama(k), uygun(k) → true | engel metni | false (listede yok), baslat(k) → bilgi}
   Başlatılan girişim geçmişe {tur:'girisim', id, tarih, dakika} yazılır; aynı girişim GIRISIM_ARALIGI gün içinde yeniden açılmaz ---- */
const GIRISIMLER={};
const GIRISIM_ARALIGI=7;                    // aynı girişimin yeniden açılabilmesi için geçmesi gereken gün (TEST değeri)
const girisimYapildi=(k,id)=>k.gecmis.some(g=>g.tur==='girisim'&&g.id===id&&tarihKarsilastir(tarihEkle(g.tarih,GIRISIM_ARALIGI),k.tarih)>0);
function girisimListesi(k){
  const L=[];
  for(const [id,G] of Object.entries(GIRISIMLER)){const u=k.icerik.surum>=2&&!girisimYapildi(k,id)?G.uygun(k):false;if(u!==false)L.push({id,ad:G.ad,aciklama:G.aciklama(k),engel:u===true?null:u});}
  return L;
}
function girisimBaslat(k,id){
  const g=girisimListesi(k).find(x=>x.id===id);
  if(!g)throw new Error(`Girişim şu an açılamaz: ${id}`);
  if(g.engel)throw new Error('Girişim başlatılamadı: '+g.engel);
  const bilgi=GIRISIMLER[id].baslat(k);
  k.gecmis.push({tur:'girisim',id,tarih:k.tarih,dakika:k.gunIciDakika});
  return bilgi;
}

/* yönetim alanlarının doğrulaması (kariyerDogrula EK_DENETIMLER üzerinden çağırır) */
function yonetimDogrula(k,h){
  const kisiler=k.kisiler||{},oturan=new Map();
  for(const [id,c] of Object.entries(k.kulupler||{})){
    if(!c||c.yonetim===undefined)continue;
    if(!c.yonetim||typeof c.yonetim!=='object'||Array.isArray(c.yonetim)){h.push(`Kulüp ${id}: yönetim kaydı nesne değil`);continue;}
    /* kalıcı sorumluluk: {alan: {kisiId}}; kişi koltuktan ayrıldıysa kullanılırken düşer, kayıtta kalması hata değildir */
    if(c.sorumluluklar!==undefined){
      if(!c.sorumluluklar||typeof c.sorumluluklar!=='object'||Array.isArray(c.sorumluluklar))h.push(`Kulüp ${id}: sorumluluk kaydı nesne değil`);
      else for(const [alan,s] of Object.entries(c.sorumluluklar))if(!s||!kisiler[s.kisiId])h.push(`Kulüp ${id}: ${alan} sorumlusu bulunamadı (${s&&s.kisiId})`);
    }
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
