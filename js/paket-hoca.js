/* ============ Chairman — olay paketi: hocanın talebi (çizim yok; yol haritası 2.6, 2.8H) ============
   Teknik direktör saha dışı küçük bir harcama ister: maçtan önceki gece takımın otelde toplu kalması (kamp). Kadro ve taktik hocanındır;
   başkanın kararı yalnız bütçe önceliğidir. Talep her kariyerde doğmaz (k.kosullar.hoca.talep; başlangıçta tohumla seçilir).
   Dış gelişme 'hocaTalebi' (veri {kulupId, hocaId, tutar, maasIsId}) → paket 'hocaTalebi' → saati serbest, acil olmayan karar (son cevap: maçtan önceki gün 18:00).
   İçerik sürümü 3 (2.8H): karar 'kampTalebi' iki cevaplıdır ve kasaya göre çift seçilir:
     kasa bugün yetiyorsa [onayla, bugün öde / bu maç olmaz]; yalnız maaştan sonra yetiyorsa [onayla, maaştan sonra öde (söz) / bu maç olmaz];
     ikisi de olmuyorsa [takım kulüp lokalinde toplansın (masrafsız) / bu maç olmaz]. Cevapsız kalırsa hoca takımı maç günü toplar.
     Futbol şube sorumlusunun görüşü talep gelirken hazır bilgi olarak dosyaya düşer.
   Girişim 'hocaGorusmesi': başkan hocayla kendisi görüşür (karar değil, katılınan randevu; KATILIM_ETKILERI); talep varsa erkenden öğrenir.
   İçerik sürümü 2 ve öncesinin hocaTalebi (üç seçenek) ve hocaGorusmesi (tek seçenekli karar) türleri js/uyum-icerik2.js'tedir.
   Tutar ve metinler TEST verisidir. */
const KAMP_SOZ_GECIKME=120;                 // söz verilirse ödeme maaşlardan bu kadar dakika sonra yapılır (TEST değeri)
const hocaKarari=(k,v)=>({kulupId:v.kulupId,hocaId:v.hocaId,tutar:v.tutar,maasIsId:v.maasIsId});
const macGunuIsi=k=>Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu')||null;
/* son cevap: maçtan önceki gün 18:00 (kamp o gece yapılır) */
const kampSonCevap=m=>anDakika(tarihEkle(m.tarih,-1),1080);

Object.assign(MESELE_OLAYLARI,{
  'hoca.talep':(k,p)=>`${kisiAdi(k,p.hocaId)} maçtan önceki gece takımı otelde toplamak istiyor; masrafı ${paraYazi(-p.tutar)}.`,
  'hoca.onay':(k,p)=>`Kampı onayladın; ${paraYazi(-p.tutar)} bugün ödenecek.`,
  'hoca.soz':(k,p)=>`Kampı onayladın ve söz verdin: masraf ${gunAyYazi(p.tarih)} günü, maaşlar yattıktan sonra ödenecek.`,
  'hoca.ret':(k,p)=>`Kampı bu maç için reddettin. ${kisiAdi(k,p.hocaId)} kararı kabul etti; takım maç günü toplanacak.`,
  'hoca.lokal':(k,p)=>`Takım maçtan önceki gece kulüp lokalinde toplanacak; masraf yok. Remzi Usta yer yataklarını sayıyor, ${kisiAdi(k,p.hocaId)} “Olsun, birlikte olalım da” dedi.`,
  'hoca.cevapsiz':(k,p)=>`Kamp talebine cevap vermedin; ${kisiAdi(k,p.hocaId)} takımı maç günü topladı. “Sustuysa hayırdır dedim başkanım.”`,
  'hoca.kanit.gerekce':()=>'“Son iki maçta ikinci yarıda düştük. Çocuklar maçtan önceki gece evde dinlenemiyor; bir gece toplu kalalım.”',
  'hoca.kanit.kasa':(k,p)=>p.yeter?'Kasa bu masrafı bugün ödese de maaş gününü çıkarıyor.':'Kasa bu masrafı bugün öderse maaş gününde eksik kalıyor.',
  'hoca.tavsiye.net':()=>'Görüşü: takım gerçekten yorgun dönüyor, kamp bu maç için işe yarar. Para darsa ödemeyi maaştan sonraya almak Hoca\'yı kırmaz.',
  'hoca.tavsiye.genel':()=>'Görüşü: kampın zararı olmaz; şart mı, ondan emin değilim.',
  'hoca.tavsiye.emin':()=>'Görüşü: bu futbol işi, Hoca\'nın bileceği şey; bir şey diyemem.',
  'hoca.gorusme.istek':(k,p)=>`${kisiAdi(k,p.hocaId)} haftanın planını anlattı ve bir isteğini açtı: ${MESELE_OLAYLARI['hoca.talep'](k,p)}`
});
const hocaTavsiyesi={koltuk:'futbol',gorus:(k,is,kisi)=>{const f=katki(kisi,'futbol');return{anahtar:f==='guclu'?'hoca.tavsiye.net':f==='orta'?'hoca.tavsiye.genel':'hoca.tavsiye.emin',p:{}};}};

GELISMELER.hocaTalebi={
  denetle:(k,v)=>{
    const h=[];
    if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);
    if(!(k.kisiler||{})[v.hocaId])h.push(`hoca bulunamadı (${v.hocaId})`);
    if(!Number.isSafeInteger(v.tutar)||v.tutar>=0)h.push(`talep tutarı eksi tamsayı kuruş olmalı (${v.tutar})`);
    if(typeof v.maasIsId!=='string')h.push('maaş işi kimliği yok');
    return h;
  },
  uygula:(k,is)=>{
    const v=is.veri,olay=paketDene(k,'hocaTalebi','hoca:kamp',v);
    return olay?{bilgi:MESELE_OLAYLARI['hoca.talep'](k,v),dur:true}:{bilgi:null};
  }
};

PAKETLER.hocaTalebi={
  surum:1,icerik:2,
  /* maç geçtiyse ya da hoca ayrıldıysa talebin anlamı kalmaz */
  degerlendir:(k,b)=>{const p=k.kisiler[b.hocaId],m=macGunuIsi(k);return p&&p.durum==='aktif'&&m&&simdikiAn(k)+60<kampSonCevap(m)?'kamp':null;},
  ac:(k,olay,b)=>{
    const futbol=koltuktaki(k,b.kulupId,'futbol'),son=anTarih(kampSonCevap(macGunuIsi(k))),yeter=nakitAcigi(k,b.kulupId).enDusuk+b.tutar>=0,yeni=k.icerik.surum>=3;
    const id=meseleAc(k,{tur:'hocaTalebi',baslik:`${kisiAdi(k,b.hocaId)} maç öncesi kamp istiyor`,sorumluId:k.baskanId,kisiler:[b.hocaId].concat(futbol?[futbol.id]:[])});
    olay.meseleId=id;
    meseleOlay(k,id,'hoca.talep',{hocaId:b.hocaId,tutar:b.tutar});
    olayBilgi(k,olay.id,'hoca.kanit.gerekce',{},b.hocaId);
    olayBilgi(k,olay.id,'hoca.kanit.kasa',{yeter},'defter');
    const veri=Object.assign({baslik:'Hocanın kamp talebi',zorunluluk:'zorunlu',sure:15,saatsiz:true,bekleyebilir:true,gelis:{tarih:k.tarih,dakika:k.gunIciDakika},
      karar:yeni?'kampTalebi':'hocaTalebi',meseleId:id,olayId:olay.id,kisiId:b.hocaId,
      aciklama:yeni?`Maçtan önceki gece takımı otelde toplamak istiyor: ${paraYazi(-b.tutar)}. Kadro onun işi; senden istediği bütçe kararı.`
        :`${kisiAdi(k,b.hocaId)} maçtan önceki gece takımı otelde toplamak istiyor; masrafı ${paraYazi(-b.tutar)}. Kadro ve antrenman onun işi; senden istediği yalnız bütçe kararı. ${gunAyYazi(son.tarih)} ${saatYazi(son.dakika)}'e kadar cevap bekliyor.`},hocaKarari(k,b));
    if(yeni){veri.soran=b.hocaId;hazirGorus(k,olay.id,veri,'futbol',hocaTavsiyesi.gorus);}
    isEkle(k,{tur:'ajanda',tarih:son.tarih,dakika:son.dakika,veri});
  }
};

/* ---- kamp talebi: yollar (engelleriyle) ve uygulanmaları. Eski tür hocaTalebi lokal dışındaki üçünü, yeni tür kampTalebi ikisini gösterir ---- */
function hocaYollari(k,is){
  const v=is.veri,a=nakitAcigi(k,v.kulupId),maas=k.isler[v.maasIsId],m=macGunuIsi(k);
  const sozAn=maas&&maas.tur==='odeme'?anDakika(maas.tarih,maas.dakika)+KAMP_SOZ_GECIKME:null,sozT=sozAn===null?null:anTarih(sozAn);
  return[
    {id:'onayla',metin:'Onayla, bugün öde',engel:a.enDusuk+v.tutar<0?'Kasa bu ödemeyle maaş gününü çıkaramıyor':null,
      aciklama:[`${paraYazi(-v.tutar)} bugün kasadan çıkar.`]},
    {id:'soz',metin:'Onayla, maaşlardan sonra öde',engel:sozAn===null?'Maaşlar ödendi; bekletmeye gerek yok':!m||sozAn>=anDakika(m.tarih,m.dakika)?'Maaşlar maçtan sonraya kaldı':a.acik>0?'Kasa maaş gününü çıkaramıyor':a.son+v.tutar<0?'Kasa maaşlardan sonra bu masrafı karşılayamıyor':null,
      aciklama:sozT?[`Söz verirsin: masraf ${gunAyYazi(sozT.tarih)} günü ${saatYazi(sozT.dakika)}'de, maaşlar yattıktan sonra ödenir.`,'Kamp yine yapılır; söz kayda geçer.']:[]},
    {id:'lokal',metin:'Lokalde toplansınlar',engel:null,aciklama:['Para çıkmaz. Takım maçtan önceki gece kulüp lokalinde, yer yataklarında kalır.','Otel değil; hocanın ne diyeceği belli değil.']},
    {id:'reddet',metin:'Bu maç olmaz',engel:null,aciklama:['Para çıkmaz. Takım maç günü toplanır; hocanın bunu nasıl karşılayacağı belli değil.']}
  ];
}
function hocaUygula(k,is,secim){
  const v=is.veri,olay=k.olaylar[v.olayId],temel={kulupId:v.kulupId,tutar:v.tutar,kalem:'kamp',aciklama:'Maç öncesi kamp (otel)',meseleId:v.meseleId};
  if(secim==='onayla'){
    const t=anTarih(simdikiAn(k)+30);
    odemePlanla(k,Object.assign({tarih:t.tarih,dakika:t.dakika},temel));
    olay.sonuc.cozum='onay';
    return{bilgi:meseleOlay(k,v.meseleId,'hoca.onay',{tutar:v.tutar})};
  }
  if(secim==='soz'){
    const maas=k.isler[v.maasIsId],t=anTarih(anDakika(maas.tarih,maas.dakika)+KAMP_SOZ_GECIKME);
    const isId=odemePlanla(k,Object.assign({tarih:t.tarih,dakika:t.dakika},temel));
    sozVer(k,{muhatap:v.hocaId,anahtar:'soz.kamp',p:{tutar:-v.tutar,tarih:t.tarih},sonTarih:t.tarih,isId,olayId:olay.id});
    olay.sonuc.cozum='soz';
    return{bilgi:meseleOlay(k,v.meseleId,'hoca.soz',{tarih:t.tarih})};
  }
  if(secim==='lokal'){
    olay.sonuc.cozum='lokal';
    return{bilgi:meseleOlay(k,v.meseleId,'hoca.lokal',{hocaId:v.hocaId})};
  }
  olay.sonuc.cozum='ret';
  return{bilgi:meseleOlay(k,v.meseleId,'hoca.ret',{hocaId:v.hocaId})};
}
const hocaDenetle=(k,v)=>{const h=GELISMELER.hocaTalebi.denetle(k,v);if(typeof v.meseleId!=='string')h.push('talep bir meseleye bağlı değil');if(!(k.olaylar||{})[v.olayId])h.push(`olay bulunamadı (${v.olayId})`);return h;};
KARAR_TURLERI.kampTalebi={
  denetle:hocaDenetle,
  secenekler:(k,is)=>ikiSecenek(hocaYollari(k,is),[['onayla','reddet'],['soz','reddet'],['lokal','reddet']]),
  uygula:hocaUygula,
  zamanAsimi:{
    metin:()=>'Cevap vermezsen kamp yapılmaz; hoca takımı maç günü toplar.',
    uygula:(k,is)=>{const v=is.veri,olay=k.olaylar[v.olayId];olay.sonuc.cozum='cevapsiz';return{bilgi:meseleOlay(k,v.meseleId,'hoca.cevapsiz',{hocaId:v.hocaId})};}
  }
};

/* ---- girişim: başkan hocayla kendisi görüşür. İçerik sürümü 3'te katılınan randevudur (karar değil) ---- */
function hocaGorusmesiSonucu(k,is){
  const v=is.veri,gel=Object.values(k.isler).find(x=>x.tur==='gelisme'&&x.veri.gelisme==='hocaTalebi');
  if(gel){
    const b=gel.veri;
    isIptal(k,gel.id,'Hoca talebini görüşmede anlattı');
    if(paketDene(k,'hocaTalebi','hoca:kamp',b))return{bilgi:`${MESELE_OLAYLARI['hoca.gorusme.istek'](k,b)} Dosyası açıldı.`};
  }
  return{bilgi:`${kisiAdi(k,v.hocaId)} haftanın planını anlattı; senden bir isteği yok.`};
}
KATILIM_ETKILERI.hocaGorusmesi={
  denetle:(k,v)=>(k.kisiler||{})[v.hocaId]?[]:[`hoca bulunamadı (${v.hocaId})`],
  uygula:hocaGorusmesiSonucu
};
const takimHocasi=k=>{const kulupId=k.kisiler[k.baskanId].kulupId;return Object.values(k.kisiler).find(p=>p.kulupId===kulupId&&p.rol==='teknikDirektor'&&p.durum==='aktif')||null;};
GIRISIMLER.hocaGorusmesi={
  ad:'Hocayla görüş',
  kisi:k=>{const h=takimHocasi(k);return h?h.id:null;},
  aciklama:()=>'45 dakikalık görüşme: haftanın planını ve bir ihtiyacı olup olmadığını sorarsın. Kadro ve taktik onun kararıdır.',
  uygun:k=>{
    const hoca=takimHocasi(k);
    if(!hoca||olayVarMi(k,'hocaTalebi','hoca:kamp')||Object.values(k.isler).some(x=>x.tur==='ajanda'&&(x.veri.karar==='hocaGorusmesi'||x.veri.etki==='hocaGorusmesi')))return false;
    return k.gunIciDakika+45>1140?'Bugün için geç oldu':true;
  },
  baslat:k=>{
    const kulupId=k.kisiler[k.baskanId].kulupId,hoca=takimHocasi(k),yeni=k.icerik.surum>=3;
    isEkle(k,{tur:'ajanda',tarih:k.tarih,dakika:k.gunIciDakika,veri:Object.assign({baslik:`${hoca.ad} ile görüşme`,zorunluluk:'istege',sure:45,kulupId,hocaId:hoca.id,kisiId:hoca.id,
      aciklama:`${hoca.ad} antrenmandan önce seni bekliyor.`},yeni?{etki:'hocaGorusmesi'}:{karar:'hocaGorusmesi'})});
    return`${hoca.ad} ile görüşme ajandada.`;
  }
};
