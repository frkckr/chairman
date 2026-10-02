/* ============ Chairman — yönetim ekibi: koltuklar, adaylar ve yetki sınırlı işler (çizim yok; yol haritası 2.2) ============
   İlk kapsam üç koltuktur (kullanıcı kararı, 2026-09-29): sayman, futbol şube sorumlusu, basın sözcüsü.
   Kulüp kaydı: yonetim = {sayman, futbol, basin} → kişi kimliği ya da null (boş koltuk). Alan yoksa denetlenmez.
   Aday/yönetici kişisinin ek alanları (kişi kaydında, isteğe bağlı):
     profil: {meslek, guclu, zayif, beklenti} — oyuncuya gösterilen metin.
     katki: {mali, baglanti, futbol, iletisim} → 'zayif'|'orta'|'guclu' — gizli; sayı ya da seviye olarak gösterilmez,
       yalnız işlerin sonucunu belirler.
   Karar türü (KARAR_TURLERI, js/ajanda.js):
     adayGorusmesi    veri {koltuk, kisiId, sira, adaylar} — içerik 3 (2.8H): adaylar sırayla tek tek görülür; [Göreve al] /
                      [Sıradaki adayı dinle (+30 dk)], son adayda [Koltuğu boş bırak]. Eski tek ekranlı koltukSecimi js/uyum-icerik2.js'tedir.
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

/* aday seçimi (koltukSecimi, bütün adaylar tek ekranda) içerik sürümü 2 ve öncesinin kararıdır: js/uyum-icerik2.js.
   İçerik sürümü 3'te aday görüşmesi sıralıdır (aşağıda, adayGorusmesi) */
const adayDenetle=(k,v)=>{
  const h=[];
  if(!YONETIM_KOLTUKLARI[v.koltuk])h.push(`bilinmeyen koltuk (${v.koltuk})`);
  if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);
  if(!Array.isArray(v.adaylar)||!v.adaylar.length)h.push('aday listesi yok');
  else for(const id of v.adaylar)if(!(k.kisiler||{})[id])h.push(`aday bulunamadı (${id})`);
  return h;
};
const koltukAtamaBilgisi=(k,koltuk,p)=>`${p.ad} ${YONETIM_KOLTUKLARI[koltuk].ad.toLocaleLowerCase('tr-TR')} oldu. Yetkisi: ${YONETIM_KOLTUKLARI[koltuk].yetki}`+
  (p.profil&&p.profil.beklenti?` Beklentisini açıkça söyledi: ${p.profil.beklenti}`:'');

/* ---- iki cevap (2.8H, OYUN_TASARIMI §2): içerik sürümü 3'teki her başkanlık kararı tam iki geçerli cevap sunar ----
   Karar türü bütün olası yolları (engelleriyle) üretir; ikiSecenek koşula uyan ilk ÇİFTİ seçer. Çift rastgele değil, o anki koşuldan seçilir;
   kapalı seçenek gösterilmez. Kalan yollar ancak gerçek yeni durum doğunca (ör. görüşme sonuçsuz kaldı) sonraki kararla gelir.
   Uygun çift bulunmazsa geçerlilerin ilk ikisi döner; kariyer denemesi bütün yollarda iki geçerli cevabı ayrıca sınar */
function ikiSecenek(L,ciftler){
  const g=L.filter(s=>!s.engel),bul=id=>g.find(s=>s.id===id);
  for(const [a,b] of ciftler)if(bul(a)&&bul(b))return[bul(a),bul(b)];
  return g.slice(0,2);
}
/* hazır görüş (2.8H): karar gelirken ilgili koltuktaki kişinin görüşü kanıt olarak dosyaya düşer. Okumak ücretsizdir; rastlantı çekmez, zaman almaz.
   gorus(k, {veri}, kisi) → {anahtar, p} (eski tavsiye görüşleriyle aynı işlev). Aynı kişinin bu olaydaki görüşü bir kez yazılır. Yazan kişiyi döndürür */
function hazirGorus(k,olayId,veri,koltuk,gorus,engel){
  const kisi=koltuktaki(k,veri.kulupId,koltuk),o=k.olaylar[olayId];
  if(!kisi||!o||(engel&&engel(kisi)))return null;
  const g=gorus(k,{veri},kisi);
  if(o.bilgiler.some(b=>b.kaynak===kisi.id&&b.anahtar===g.anahtar))return kisi;
  olayBilgi(k,olayId,g.anahtar,g.p,kisi.id);
  return kisi;
}

/* ---- sıralı aday görüşmesi (2.8H; kullanıcı kararı 2026-10-02) ----
   Randevu (veri.etki 'adayGorusmesi', veri {kulupId, koltuk, adaylar: görüşme sırası}) katılınınca bir mesele açar ve ilk adayın kartını getirir.
   Kart: [Göreve al] / [Sıradaki adayı dinle (+ADAY_SURESI dk)]; son adayda [Göreve al] / [Koltuğu şimdilik boş bırak].
   Geri çevrilen aday kulüp üyesi olarak kalır, bu koltuk için dönmez. Sıra başlangıçta bir kez belirlenir (js/baslangic.js) */
const ADAY_SURESI=30;                       // bir adayla görüşmenin süresi, dakika (TEST değeri)
const BOS_KOLTUK_NOTU={
  sayman:'Bu hafta ödemeleri ve sponsoru sen takip edersin; işi devredebileceğin bir sayman olmaz.',
  basin:'Gazete sorarsa ya sen konuşursun ya da kulüp “yorum yok” der; açıklamayı devredemezsin.',
  futbol:'Hocayla temas ve transfer araştırması sende kalır.'
};
Object.assign(MESELE_OLAYLARI,{
  'aday.basladi':(k,p)=>`${YONETIM_KOLTUKLARI[p.koltuk].ad} koltuğu için ${p.n} adayla sırayla görüşeceksin. İlk aday: ${kisiAdi(k,p.kisiId)}.`,
  'aday.sonraki':(k,p)=>`${kisiAdi(k,p.kisiId)} ile vedalaştın; sıradaki aday ${kisiAdi(k,p.sonrakiId)} içeri giriyor.`,
  'aday.al':(k,p)=>koltukAtamaBilgisi(k,p.koltuk,k.kisiler[p.kisiId]),
  'aday.bos':(k,p)=>`${YONETIM_KOLTUKLARI[p.koltuk].ad} koltuğu şimdilik boş kaldı. ${BOS_KOLTUK_NOTU[p.koltuk]||''}`
});
function adayKarti(k,v,sira){
  const id=v.adaylar[sira],p=k.kisiler[id],pr=p.profil||{},K=YONETIM_KOLTUKLARI[v.koltuk];
  isEkle(k,{tur:'ajanda',tarih:k.tarih,dakika:1439,veri:{baslik:`${K.ad} adayı ${sira+1}/${v.adaylar.length}: ${p.ad}`,zorunluluk:'zorunlu',sure:0,saatsiz:true,
    gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'adayGorusmesi',kulupId:v.kulupId,koltuk:v.koltuk,adaylar:v.adaylar.slice(),sira,kisiId:id,meseleId:v.meseleId,
    aciklama:[pr.meslek,pr.guclu&&'Güçlü yanı: '+pr.guclu,pr.zayif&&'Zayıf yanı: '+pr.zayif,pr.beklenti&&'Beklentisi: '+pr.beklenti].filter(Boolean).join(' ')}});
}
KATILIM_ETKILERI.adayGorusmesi={
  denetle:adayDenetle,
  uygula:(k,is)=>{
    const v=is.veri,id=meseleAc(k,{tur:'koltuk',baslik:`${YONETIM_KOLTUKLARI[v.koltuk].ad} koltuğu boş`,sorumluId:k.baskanId,kisiler:v.adaylar});
    meseleOlay(k,id,'aday.basladi',{koltuk:v.koltuk,n:v.adaylar.length,kisiId:v.adaylar[0]});
    adayKarti(k,Object.assign({},v,{meseleId:id}),0);
    return{bilgi:MESELE_OLAYLARI['aday.basladi'](k,{koltuk:v.koltuk,n:v.adaylar.length,kisiId:v.adaylar[0]})};
  }
};
KARAR_TURLERI.adayGorusmesi={
  denetle:(k,v)=>{const h=adayDenetle(k,v);if(!Number.isInteger(v.sira)||v.sira<0||!Array.isArray(v.adaylar)||v.sira>=v.adaylar.length)h.push(`aday sırası geçersiz (${v.sira})`);
    if(typeof v.meseleId!=='string')h.push('aday görüşmesi bir meseleye bağlı değil');return h;},
  secenekler:(k,is)=>{
    const v=is.veri,c=k.kulupler[v.kulupId],p=k.kisiler[v.kisiId],K=YONETIM_KOLTUKLARI[v.koltuk],son=v.sira===v.adaylar.length-1,dolu=!!(c.yonetim&&c.yonetim[v.koltuk]);
    const sonraki=son?null:k.kisiler[v.adaylar[v.sira+1]];
    return[
      {id:'al',metin:'Göreve al',kisiId:p.id,engel:dolu?`${K.ad} koltuğu artık dolu`:p.durum!=='aktif'?`${p.ad} artık aday değil`:koltuktaMi(k,p.id)?`${p.ad} zaten bir koltukta`:null,
        aciklama:[`${p.ad} ${K.ad.toLocaleLowerCase('tr-TR')} olur.`,'Yetkisi: '+K.yetki]},
      son?{id:'bos',metin:'Koltuğu şimdilik boş bırak',engel:null,aciklama:[BOS_KOLTUK_NOTU[v.koltuk]||'Koltuk boş kalır.']}
        :{id:'sonraki',metin:'Sıradaki adayı dinle',sure:ADAY_SURESI,kisiId:sonraki.id,engel:sonraki.durum!=='aktif'?`${sonraki.ad} artık aday değil`:null,
          aciklama:[`${ADAY_SURESI} dakika sürer: ${sonraki.ad} ile görüşürsün.`,`${p.ad} bu koltuk için geri çağrılmaz.`]}
    ];
  },
  uygula:(k,is,secim)=>{
    const v=is.veri;
    if(secim==='al'){
      koltugaAta(k,v.kulupId,v.koltuk,v.kisiId);
      if(v.koltuk==='sayman'&&typeof nakitRandevusu==='function')nakitRandevusu(k,v.kulupId);
      return{bilgi:meseleOlay(k,v.meseleId,'aday.al',{koltuk:v.koltuk,kisiId:v.kisiId})};
    }
    if(secim==='bos')return{bilgi:meseleOlay(k,v.meseleId,'aday.bos',{koltuk:v.koltuk})};
    adayKarti(k,v,v.sira+1);
    return{bilgi:meseleOlay(k,v.meseleId,'aday.sonraki',{kisiId:v.kisiId,sonrakiId:v.adaylar[v.sira+1]})};
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
