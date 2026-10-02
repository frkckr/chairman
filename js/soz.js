/* ============ Chairman — kulüp hafızası: sözler, haberler ve ortamdaki izler (çizim yok; yol haritası 2.8) ============
   Söz (k.sozler['soz-N']): {id, verenId, muhatap, anahtar, p, sonTarih, isId, olayId, durum, verilis:{tarih, dakika}, sonuc}
     muhatap: kişi kimliği ya da SOZ_TARAFLARI anahtarı. anahtar + p: sözün konusu (metin saklanmaz; MESELE_OLAYLARI[anahtar]).
     isId: sözü yerine getirecek bekleyen iş (ör. ödeme); olayId: sözün doğduğu olay. durum: 'acik' | 'tutuldu' | 'bozuldu'.
   Yalnız açıkça taahhüt olan karar söz doğurur (sozVer); söylenen her cümle söz değildir. Tutulma/bozulma gerçek kayıttan türetilir ve bir kez
   yazılır: bağlı iş tamamlandıysa tutuldu; bağlı iş yapılmadan kalktıysa ya da son tarihi geçtiyse bozuldu. Süresiz söz (sonTarih null, iş yok) açık kalır.
   Haber (k.haberler): {tur:'gazete'|'tesekkur', tarih, dakika, anahtar, p, olayId, gorulen} — yaşanmış olaydan üretilen kalıcı kayıt; yeni sorun icat etmez.
   odaIzleri(k): odada gösterilecek izler; yalnız kayıtlı olaya dayanır, yüklemeden sonra aynıdır.
   Metinler ve kişiler TEST verisidir. */
const SOZ_DURUMLARI=['acik','tutuldu','bozuldu'];
const SOZ_TARAFLARI={sponsor:'Forma sponsoru',personel:'Personel ve oyuncular'};
const HABER_TURLERI=['gazete','tesekkur'];
const sozMuhatapAdi=(k,m)=>SOZ_TARAFLARI[m]||kisiAdi(k,m);
const sozMetni=(k,s)=>MESELE_OLAYLARI[s.anahtar](k,s.p);

Object.assign(MESELE_OLAYLARI,{
  'soz.pano':()=>'Gelecek sezon stat içi bir pano sponsorun olacak.',
  'soz.destekPano':()=>'Bu sezonun kalanı ve gelecek sezon stat içi bir pano destekçinin firmasına ayrılacak.',
  'soz.maas':(k,p)=>`Maaşlar ${gunAyYazi(p.tarih)} günü ödenecek.`,
  'soz.kamp':(k,p)=>`Kamp masrafı (${paraYazi(p.tutar)}) ${gunAyYazi(p.tarih)} günü, maaşlar yattıktan sonra ödenecek.`,
  'soz.tutuldu':(k,p)=>`Sözünü tuttun (${sozMuhatapAdi(k,p.muhatap)}): ${MESELE_OLAYLARI[p.anahtar](k,p.p)}`,
  'soz.bozuldu':(k,p)=>`Sözün yerine gelmedi (${sozMuhatapAdi(k,p.muhatap)}): ${MESELE_OLAYLARI[p.anahtar](k,p.p)}`,
  'tesekkur.maas':(k,p)=>`${kisiAdi(k,p.kisiId)} kapıdan başını uzattı: “Başkanım, bu ay zor diyorlardı; maaşlar gününde yattı. Çocuklar adına sağ olun.”`
});

/* söz kaydeder; kimliğini döndürür */
function sozVer(k,{muhatap,anahtar,p={},sonTarih=null,isId=null,olayId=null}){
  if(!MESELE_OLAYLARI[anahtar])throw new Error(`Bilinmeyen söz konusu: ${anahtar}`);
  const id=kimlikUret(k,'soz');
  k.sozler[id]={id,verenId:k.baskanId,muhatap,anahtar,p,sonTarih,isId,olayId,durum:'acik',verilis:{tarih:k.tarih,dakika:k.gunIciDakika},sonuc:null};
  return id;
}
const acikSoz=(k,anahtar)=>Object.values(k.sozler||{}).find(s=>s.durum==='acik'&&s.anahtar===anahtar)||null;
const olaySozleri=(k,olayId)=>Object.values(k.sozler||{}).filter(s=>s.olayId===olayId);
/* açık sözleri gerçek kayıtla karşılaştırır; durum değişirse bir kez yazar ve ilgili meseleye haber düşer */
function sozDegerlendir(k,tamamlanan){
  for(const s of Object.values(k.sozler||{})){
    if(s.durum!=='acik')continue;
    let durum=null;
    if(s.isId&&tamamlanan&&tamamlanan.id===s.isId)durum='tutuldu';
    else if(s.isId&&!k.isler[s.isId]&&!k.gecmis.some(g=>g.tur==='is'&&g.isId===s.isId))durum='bozuldu';
    else if(!s.isId&&s.sonTarih&&tarihKarsilastir(k.tarih,s.sonTarih)>0)durum='bozuldu';
    if(!durum)continue;
    s.durum=durum;s.sonuc={tarih:k.tarih,dakika:k.gunIciDakika};
    const o=s.olayId&&k.olaylar[s.olayId];
    if(o&&k.meseleler[o.meseleId])meseleOlay(k,o.meseleId,'soz.'+durum,{muhatap:s.muhatap,anahtar:s.anahtar,p:s.p});
  }
}
IS_SONRASI.push((k,is)=>{if(k.sozler)sozDegerlendir(k,is);});

function haberEkle(k,{tur,anahtar,p={},olayId=null}){
  if(!MESELE_OLAYLARI[anahtar])throw new Error(`Bilinmeyen haber anahtarı: ${anahtar}`);
  const h={tur,tarih:k.tarih,dakika:k.gunIciDakika,anahtar,p,olayId,gorulen:false};
  k.haberler.push(h);
  return MESELE_OLAYLARI[anahtar](k,p);
}
const haberMetni=(k,h)=>MESELE_OLAYLARI[h.anahtar](k,h.p);
function haberlerGoruldu(k){for(const h of k.haberler)h.gorulen=true;}

/* dış gelişme: maaşlar gününde yattıysa ve hafta içinde gerçek bir sıkışma atlatıldıysa kısa teşekkür (olay kütüphanesi P13'ün dar örneği).
   Para ya da moral puanı üretmez; koşulu yoksa iz bırakmadan geçer */
GELISMELER.tesekkur={
  denetle:(k,v)=>{const h=[];if(!(k.kisiler||{})[v.kisiId])h.push(`kişi bulunamadı (${v.kisiId})`);if(typeof v.maasIsId!=='string')h.push('maaş işi kimliği yok');return h;},
  uygula:(k,is)=>{
    const v=is.veri,kriz=Object.values(k.olaylar).find(o=>o.paket==='odemeSikismasi'&&o.varyant==='kriz');
    if(!kriz||kriz.sonuc.maasGecikti||!k.hareketler.some(h=>h.kaynak===v.maasIsId))return{bilgi:null};
    return{bilgi:haberEkle(k,{tur:'tesekkur',anahtar:'tesekkur.maas',p:{kisiId:v.kisiId},olayId:kriz.id})};
  }
};

/* ---- hatıra (2.8K): gerçek geçmişe gönderme yapan, cevap istemeyen kısa kişi mesajları ----
   Dış gelişme 'hatira' (içerik sürümü 3; Cuma öğle ve Cumartesi sabahı) o güne kadar gerçekten verilmiş kararlara bakar; kayıt yoksa iz bırakmaz.
   Her kural bir kez yazılır (aynı anahtar o konuda tekrar etmez), ilgili konunun geçmişine olay olarak düşer ve telefonda kişinin konuşmasında
   görünür (js/mesajlar.js). Para, puan ya da yeni görev üretmez; mizah kararın bedelini değiştirmez. Metinler TEST verisidir. */
Object.assign(MESELE_OLAYLARI,{
  'hatira.sponsor.bedel':()=>'Gecikme bedelini yatırdık başkanım. Babam “sözleşme sözleşmedir” dedi; haklıymışsınız, biz de öyle yaparız.',
  'hatira.sponsor.pano':()=>'Gelecek sezonun panosu için ölçü almaya ne zaman gelelim? Babam logoyu büyütelim diyor, ben vazgeçirmeye çalışıyorum.',
  'hatira.sponsor.tam':(k,p)=>`Genel müdürümüz ${kisiAdi(k,p.saymanId)} Bey'le konuştuktan sonra taksiti hemen çıkardı. Bir dahaki sefere doğrudan onu arayacağım galiba.`,
  'hatira.sponsor.cevapsiz':()=>'Sessizliği “olur” saydık başkanım, sağ olun. Taksit söylediğimiz günde gelecek.',
  'hatira.destek.pano':()=>'Panonun yazısını kızım çizmek istiyor, şimdiden üç taslak yaptı. Kulübün rengine sadık kalacağız, söz.',
  'hatira.destek.anons':()=>'Maç günü anonsu ben okuyayım diyorum; sesim gürdür. Şaka şaka, spikere bıraktım.',
  'hatira.basin.baskan':()=>'Açıklamanız aynen girdi başkanım. Böyle doğrudan konuşunca biz de rahat ediyoruz.',
  'hatira.basin.yorumYok':()=>'“Yorum yok” da bir cevaptır başkanım; manşete onu taşıdık. Bir dahakine bir cümle daha verin.',
  'hatira.basin.sessiz':()=>'Dün aradım, açmadınız; elimdekini yazdım. Telefonum açık.',
  'hatira.hoca.lokal':()=>'Lokalde yattık başkanım. Remzi Usta bütün gece maç anlattı ama çocuklar dinç. Otel kadar olmasa da birlikteydik.',
  'hatira.hoca.otel':()=>'Otelde herkes erkenden yattı, kahvaltıda kimse geç kalmadı. Bunu unutmam başkanım.',
  'hatira.hoca.cevapsiz':()=>'Dün akşam herkes kendi evindeydi. Sustuysa hayırdır dedik, ama bir dahakine bir “yok” de başkanım, ben anlarım.',
  'hatira.personel.soz':(k,p)=>`Başkanım, ${gunAyYazi(p.tarih)} dediniz; ben çocuklara öyle söyledim. Bekliyoruz.`
});
const olayPaketi=(k,paket)=>Object.values(k.olaylar||{}).find(o=>o.paket===paket&&o.durum!=='onlendi')||null;
/* kurallar: [gün, anahtar, kişi(k, olay) → kişi kimliği, koşul(k) → olay ya da null, parametre?] */
const HATIRA_KURALLARI=[
  ['cuma','hatira.sponsor.bedel',k=>(Object.values(k.kisiler).find(p=>p.rol==='sponsorTemsilcisi')||{}).id,k=>{const o=olayPaketi(k,'odemeSikismasi');return o&&o.sonuc.cozum==='bedel'?o:null;}],
  ['cuma','hatira.sponsor.pano',k=>(Object.values(k.kisiler).find(p=>p.rol==='sponsorTemsilcisi')||{}).id,k=>{const o=olayPaketi(k,'odemeSikismasi');return o&&o.sonuc.hak==='panoGelecekSezon'?o:null;}],
  ['cuma','hatira.sponsor.tam',k=>(Object.values(k.kisiler).find(p=>p.rol==='sponsorTemsilcisi')||{}).id,k=>{const o=olayPaketi(k,'odemeSikismasi');return o&&o.sonuc.cozum==='tamOdeme'?o:null;},
    (k,o)=>({saymanId:(k.kulupler[k.kisiler[k.baskanId].kulupId].yonetim||{}).sayman})],
  ['cuma','hatira.sponsor.cevapsiz',k=>(Object.values(k.kisiler).find(p=>p.rol==='sponsorTemsilcisi')||{}).id,k=>{const o=olayPaketi(k,'odemeSikismasi');return o&&o.sonuc.cozum==='cevapsiz'?o:null;}],
  ['cuma','hatira.destek.pano',(k,o)=>k.meseleler[o.meseleId].kisiler[0]||null,k=>{const o=olayPaketi(k,'kosulluDestek');return o&&o.sonuc.cozum==='kabul'?o:null;}],
  ['cuma','hatira.destek.anons',(k,o)=>k.meseleler[o.meseleId].kisiler[0]||null,k=>{const o=olayPaketi(k,'kosulluDestek');return o&&o.sonuc.cozum==='kucuk'?o:null;}],
  ['cuma','hatira.basin.baskan',k=>(Object.values(k.kisiler).find(p=>p.rol==='muhabir')||{}).id,k=>{const o=olayPaketi(k,'basinSorusu');return o&&o.sonuc.basin==='baskan'?o:null;}],
  ['cuma','hatira.basin.yorumYok',k=>(Object.values(k.kisiler).find(p=>p.rol==='muhabir')||{}).id,k=>{const o=olayPaketi(k,'basinSorusu');return o&&o.sonuc.basin==='yorumYok'?o:null;}],
  ['cuma','hatira.basin.sessiz',k=>(Object.values(k.kisiler).find(p=>p.rol==='muhabir')||{}).id,k=>{const o=olayPaketi(k,'basinSorusu');return o&&o.sonuc.basin==='sessiz'?o:null;}],
  ['cumartesi','hatira.hoca.lokal',(k,o)=>k.meseleler[o.meseleId].kisiler[0]||null,k=>{const o=olayPaketi(k,'hocaTalebi');return o&&o.sonuc.cozum==='lokal'?o:null;}],
  ['cumartesi','hatira.hoca.otel',(k,o)=>k.meseleler[o.meseleId].kisiler[0]||null,k=>{const o=olayPaketi(k,'hocaTalebi');return o&&(o.sonuc.cozum==='onay'||o.sonuc.cozum==='soz')?o:null;}],
  ['cumartesi','hatira.hoca.cevapsiz',(k,o)=>k.meseleler[o.meseleId].kisiler[0]||null,k=>{const o=olayPaketi(k,'hocaTalebi');return o&&o.sonuc.cozum==='cevapsiz'?o:null;}],
  ['cumartesi','hatira.personel.soz',k=>{const p=Object.values(k.kisiler).find(p=>p.rol==='personel'&&p.durum==='aktif');return p?p.id:null;},
    k=>{const s=acikSoz(k,'soz.maas');return s&&k.olaylar[s.olayId]||null;},k=>({tarih:acikSoz(k,'soz.maas').p.tarih})]
];
GELISMELER.hatira={
  denetle:(k,v)=>v.gun==='cuma'||v.gun==='cumartesi'?[]:[`bilinmeyen hatıra günü (${v.gun})`],
  uygula:(k,is)=>{
    const yazilan=[];
    for(const [gun,anahtar,kisi,kosul,param] of HATIRA_KURALLARI){
      if(gun!==is.veri.gun)continue;
      const o=kosul(k);if(!o||!k.meseleler[o.meseleId])continue;
      const m=k.meseleler[o.meseleId],kid=kisi(k,o);
      if(!kid||!k.kisiler[kid]||m.olaylar.some(x=>x.anahtar===anahtar))continue;
      const p=Object.assign({kisiId:kid},param?param(k,o):{});
      yazilan.push(kisiAdi(k,kid)+': '+meseleOlay(k,o.meseleId,anahtar,p));
    }
    return{bilgi:yazilan.length?yazilan.join(' · '):null};
  }
};

/* odada görünen izler (kariyeri değiştirmez) */
function odaIzleri(k){
  const H=k.haberler||[],gazete=H.filter(h=>h.tur==='gazete'),kart=H.filter(h=>h.tur==='tesekkur');
  return{
    gazete:gazete.length?gazete[gazete.length-1]:null,
    kart:kart.length?kart[kart.length-1]:null,
    yeniHaber:H.filter(h=>!h.gorulen).length,
    iskele:k.hareketler.some(h=>h.kalem==='bakim'),
    panoNotu:!!(acikSoz(k,'soz.pano')||acikSoz(k,'soz.destekPano'))
  };
}

/* söz ve haber alanlarının doğrulaması (kariyerDogrula EK_DENETIMLER üzerinden çağırır) */
function sozDogrula(k,h){
  const S=k.sozler,an=x=>x&&tarihGecerliMi(x.tarih)&&Number.isInteger(x.dakika);
  if(S&&typeof S==='object'&&!Array.isArray(S))for(const [anahtar,s] of Object.entries(S)){
    const ad=`Söz ${anahtar}`;
    if(!s||s.id!==anahtar){h.push(`${ad}: kimliği anahtarıyla aynı değil (${s&&s.id})`);continue;}
    kimlikDenetle(k,h,ad,anahtar,'soz');
    if(!(k.kisiler||{})[s.verenId])h.push(`${ad}: sözü veren bulunamadı (${s.verenId})`);
    if(!SOZ_TARAFLARI[s.muhatap]&&!(k.kisiler||{})[s.muhatap])h.push(`${ad}: muhatap bulunamadı (${s.muhatap})`);
    if(!MESELE_OLAYLARI[s.anahtar])h.push(`${ad}: bilinmeyen konu (${s.anahtar})`);
    else if(!s.p||typeof s.p!=='object'||Array.isArray(s.p))h.push(`${ad}: parametreler nesne değil`);
    if(!SOZ_DURUMLARI.includes(s.durum))h.push(`${ad}: bilinmeyen durum (${s.durum})`);
    if(s.sonTarih!==null&&!tarihGecerliMi(s.sonTarih))h.push(`${ad}: geçersiz son tarih (${s.sonTarih})`);
    if(s.olayId!==null&&!(k.olaylar||{})[s.olayId])h.push(`${ad}: olayı bulunamadı (${s.olayId})`);
    if(!an(s.verilis))h.push(`${ad}: veriliş anı yok`);
    if((s.durum==='acik')!==(s.sonuc===null))h.push(`${ad}: durumu (${s.durum}) sonuç kaydıyla tutmuyor`);
    if(s.durum==='tutuldu'&&s.isId&&(k.isler||{})[s.isId])h.push(`${ad}: tutulmuş görünüyor fakat işi hâlâ bekliyor (${s.isId})`);
  }
  if(Array.isArray(k.haberler))k.haberler.forEach((x,i)=>{
    const ad=`Haber [${i}]`;
    if(!x||!HABER_TURLERI.includes(x.tur)){h.push(`${ad}: bilinmeyen tür (${x&&x.tur})`);return;}
    if(!MESELE_OLAYLARI[x.anahtar])h.push(`${ad}: bilinmeyen anahtar (${x.anahtar})`);
    else if(!x.p||typeof x.p!=='object'||Array.isArray(x.p))h.push(`${ad}: parametreler nesne değil`);
    if(!an(x))h.push(`${ad}: geçersiz tarih/dakika`);
    else if(tarihGecerliMi(k.tarih)&&anDakika(x.tarih,x.dakika)>simdikiAn(k))h.push(`${ad}: gelecekte kalan kayıt`);
    if(x.olayId!==null&&!(k.olaylar||{})[x.olayId])h.push(`${ad}: olayı bulunamadı (${x.olayId})`);
    if(typeof x.gorulen!=='boolean')h.push(`${ad}: görülme işareti yok`);
  });
}
EK_DENETIMLER.push(sozDogrula);
