/* ============ Chairman — ajanda: başkanın günlük işleri ve günü bitirme (çizim yok) ============
   Ajanda işi takvimdeki 'ajanda' türü bekleyen iştir (js/takvim.js). tarih/dakika işin başlangıcıdır.
     veri: {baslik, aciklama, zorunluluk, sure, kisiId?, bilgi?, sonTarih?, eylem?}
     zorunluluk: 'zorunlu' yapılmadan gün bitmez · 'ertelenebilir' ileri güne alınabilir, sonTarih'ten sonraya alınamaz ·
                 'istege' yapılmazsa kaçırılır. sure: ajandada kapladığı dakika. bilgi: iş yapılınca öğrenilen metin.
     eylem 'macGunu': maç sınırı; sunum katmanı bu işi yapınca maç gününe geçer (maç sonucu kariyere Aşama 3'te bağlanır).
   Katılım: ajandaIsiYap zamanı işin başlangıcına getirir, işi 'yapildi' diye tamamlar, sonra süresi kadar ilerletir.
   Başlangıç dakikası katılmadan geçerse takvim işi 'kacirildi' diye tamamlar (pay:1). Arada kalan işler önizlemede önceden
   bildirilir; araya giren zorunlu iş varsa ya da iş gün içinde bitmiyorsa katılım reddedilir.
   Günü bitirme: bekleyen zorunlu iş varsa gün bitmez. Ertelenebilir işler ertesi güne taşınır (son günüyse taşınamaz,
   gün bitmez); isteğe bağlı işler kaçırılır. Sonra takvim ertesi günün başlangıcına geçer. Kayıt sunum katmanında
   gün sınırında yapılır. Erteleme geçmişe {tur:'erteleme', isId, tarih, dakika, eski, yeni, saat, baslik, otomatik} yazar.
   Karar işi: veri.karar KARAR_TURLERI'nde bir türdür (ör. js/yonetim.js). Katılırken seçenek kimliği verilir;
     seçenek o anda yeniden doğrulanır, türün uygula'sı iş başlangıcında bir kez çalışır, sonuç işin geçmiş kaydına yazılır.
     KARAR_TURLERI[tur] = {denetle(k,veri) → hatalar, secenekler(k,is) → [{id, metin, aciklama, sure?, engel?}],
                           uygula(k,is,secenekId) → {bilgi?} (kariyeri değiştirebilir: koltuk, ödeme, yeni ajanda işi)}
   Saati serbest karar (2.3; yalnız başkana dönen kararlar): veri.saatsiz true, veri.gelis {tarih, dakika} kararın geldiği an.
     İşin tarih/dakika alanı başlangıç değil SON CEVAP ANIdır. Geliş ile son cevap arasında istenen an verilir (başlangıç = şimdi).
     Bekleyen karar başka işe katılmayı kilitlemez; yalnız bitişi son cevap anını aşan işe katılınamaz ve ilerleme bu anı geçemez.
     Başkan bir işin içindeyken dolan son cevap anı kaçırılmaz: işin bitişinden SURE_UZATMA dakika sonrasına uzar.
   İlerleme (ilerleOnizle/duragaIlerle): sıradaki durma noktasına gider; günü bitirmekle aynı işlem değildir. Durma noktaları:
     sonucu 'dur' taşıyan ya da yeni ajanda işi doğuran gelişme (o anda) · sıradaki saatli ajanda işinin başlangıcı ·
     işleri birbiriyle çakışan günün başlangıcı · hiç ajanda işi yoksa ILERLE_SINIRI gün içindeki son rutin iş.
     Gelecekteki zorunlu iş ilerlemeyi engellemez, ilerleme onun başlangıcında durur. Şu an başlangıcında durulan iş:
     zorunluysa katılmadan ilerlenmez, ertelenebilirse ertesi güne taşınır (son günüyse ilerlenmez), isteğe bağlıysa kaçırılır. */
const AJANDA_ZORUNLULUK=['zorunlu','ertelenebilir','istege'];
const AJANDA_EYLEMLER=['macGunu'];
const AJANDA_EN_UZUN=720;                   // bir işin en uzun süresi (dakika)
const SURE_UZATMA=30;                       // meşgulken dolan son cevap anı, işin bitişinden bu kadar dakika sonraya uzar (TEST değeri)
const ILERLE_SINIRI=30;                     // ajanda işi yokken ilerlemenin bakacağı en uzak gün (TEST değeri)
const KARAR_TURLERI={};

IS_TURLERI.ajanda={
  pay:1,
  baslik:(k,is)=>is.veri.baslik,
  denetle:(k,v)=>{
    if(!v||typeof v!=='object')return['ajanda bilgisi yok'];
    const h=[];
    if(typeof v.baslik!=='string'||!v.baslik)h.push('başlık yok');
    if(typeof v.aciklama!=='string')h.push('açıklama metin değil');
    if(!AJANDA_ZORUNLULUK.includes(v.zorunluluk))h.push(`bilinmeyen zorunluluk (${v.zorunluluk})`);
    if(!Number.isInteger(v.sure)||v.sure<0||v.sure>AJANDA_EN_UZUN)h.push(`süre 0–${AJANDA_EN_UZUN} dakika olmalı (${v.sure})`);
    if(v.kisiId!==undefined&&!(k.kisiler||{})[v.kisiId])h.push(`kişi bulunamadı (${v.kisiId})`);
    if(v.bilgi!==undefined&&typeof v.bilgi!=='string')h.push('bilgi metin değil');
    if(v.sonTarih!==undefined&&!tarihGecerliMi(v.sonTarih))h.push(`geçersiz son tarih (${v.sonTarih})`);
    if(v.sonTarih!==undefined&&v.zorunluluk!=='ertelenebilir')h.push('son tarih yalnız ertelenebilir işte olur');
    if(v.eylem!==undefined&&!AJANDA_EYLEMLER.includes(v.eylem))h.push(`bilinmeyen eylem (${v.eylem})`);
    if(v.karar!==undefined){const t=KARAR_TURLERI[v.karar];if(!t)h.push(`bilinmeyen karar türü (${v.karar})`);else h.push(...t.denetle(k,v));}
    if(v.meseleId!==undefined&&typeof v.meseleId!=='string')h.push('mesele kimliği metin değil');
    if(v.saatsiz!==undefined){
      if(v.saatsiz!==true)h.push('saatsiz alanı yalnız true olabilir');
      if(v.karar===undefined||v.zorunluluk!=='zorunlu')h.push('saati serbest iş zorunlu bir karar olmalı');
      if(!v.gelis||!tarihGecerliMi(v.gelis.tarih)||!Number.isInteger(v.gelis.dakika))h.push('saati serbest kararın geliş anı yok');
    }
    return h;
  },
  /* takvim yalnız katılınmayan işi tamamlar: başlangıç dakikası geçti */
  uygula:(k,is)=>ajandaSonucu(is,'kacirildi')
};

/* geçmişe yazılan sonuç: iş listeden çıktıktan sonra da ajandada gösterilebilsin diye başlık ve zaman bilgisini taşır */
function ajandaSonucu(is,durum,sure){
  const v=is.veri,s={durum,baslik:v.baslik,zorunluluk:v.zorunluluk,gun:is.tarih,saat:is.dakika,sure:sure===undefined?v.sure:sure};
  if(durum==='yapildi'&&v.bilgi!==undefined)s.bilgi=v.bilgi;
  if(v.eylem!==undefined)s.eylem=v.eylem;
  return s;
}
/* karar işinin seçenekleri (karar işi değilse boş liste) */
const kararSecenekleri=(k,is)=>is&&is.tur==='ajanda'&&is.veri.karar!==undefined?KARAR_TURLERI[is.veri.karar].secenekler(k,is):[];

const isAn=is=>anDakika(is.tarih,is.dakika);
const isSirasi=(a,b)=>isAn(a)-isAn(b)||isNo(a.id)-isNo(b.id);
const bekleyenIsler=k=>Object.values(k.isler).sort(isSirasi);

/* katılmadan önce: işin zamanı, arada kaçırılacak ajanda işleri, arada gerçekleşecek diğer işler ve engeller.
   Karar işinde secim verilirse süresi ve geçerliliği o seçeneğe göre hesaplanır; verilmezse secimGerekli true olur */
function ajandaOnizle(k,id,secim){
  const is=k.isler[id];
  if(!is||is.tur!=='ajanda')return{is:null,engel:[`Ajanda işi bulunamadı: ${id}`],atlanacak:[],gerceklesecek:[],secenekler:[]};
  const secenekler=kararSecenekleri(k,is),engel=[],atlanacak=[],gerceklesecek=[];
  let sure=is.veri.sure,secenek=null;
  if(secenekler.length&&secim!==undefined&&secim!==null){
    secenek=secenekler.find(s=>s.id===secim);
    if(!secenek)engel.push(`Geçersiz seçenek: ${secim}`);
    else{if(secenek.engel)engel.push(secenek.engel);if(secenek.sure!==undefined)sure=secenek.sure;}
  }
  /* saati serbest karar şimdi başlar; saatli iş kendi saatinde */
  const baslangic=is.veri.saatsiz?simdikiAn(k):isAn(is),bitis=baslangic+sure;
  if(!is.veri.saatsiz){
    if(is.tarih!==k.tarih)engel.push(`${is.veri.baslik} bugünün işi değil (${is.tarih})`);
    if(bitis>anDakika(is.tarih,0)+1440)engel.push(`${is.veri.baslik} gün içinde bitmiyor`);
  }
  for(const x of bekleyenIsler(k)){
    if(x.id===id||isSonAn(x)>bitis)continue;
    if(x.tur!=='ajanda'){gerceklesecek.push(x);continue;}
    if(x.veri.saatsiz){engel.push(`Önce karar ver: ${x.veri.baslik} (son cevap ${saatYazi(x.dakika)})`);continue;}
    atlanacak.push(x);
    if(x.veri.zorunluluk==='zorunlu')engel.push(`${x.veri.baslik} (${saatYazi(x.dakika)}) zorunlu; bu işle çakışıyor`);
  }
  return{is,baslangic,bitis,sure,engel,atlanacak,gerceklesecek,secenekler,secenek,secimGerekli:secenekler.length>0&&!secenek};
}

/* ilerleme sırasında durduran gelişme: sonucu 'dur' taşıyan iş ya da yeni doğan ajanda işi (başkana dönen karar, yeni randevu) */
function durakSorgusu(k){
  const once=new Set(Object.keys(k.isler));
  return kayit=>!!(kayit.sonuc&&kayit.sonuc.dur)||Object.values(k.isler).some(x=>x.tur==='ajanda'&&!once.has(x.id));
}
/* başkan meşgulken son cevap anı dolan saati serbest karar kaçırılmaz: süre işin bitişinden SURE_UZATMA dakika sonrasına uzar */
function sureUzat(k,x,bitis){
  if(x.tur!=='ajanda'||!x.veri.saatsiz)return false;
  const t=anTarih(bitis+SURE_UZATMA);
  isTasi(k,x.id,t.tarih,t.dakika);
  if(x.veri.meseleId)meseleOlay(k,x.veri.meseleId,'sureUzadi',{baslik:x.veri.baslik,tarih:t.tarih,dakika:t.dakika});
  return true;
}

/* işe katıl: zaman başlangıca gelir, (karar işinde seçenek uygulanır) iş 'yapildi' olur, sonra süresi kadar ilerler.
   Tamamlanan kayıtları döndürür. İşe giderken karar gerektiren bir gelişme olursa orada durulur: iş bekler durumda kalır
   (dönen kayıtlarda o iş yoktur); işin kendi süresi içinde gelen haber işi kesmez */
function ajandaIsiYap(k,id,secim){
  const o=ajandaOnizle(k,id,secim);
  if(o.secimGerekli)o.engel.push('Bir seçenek seçilmeli');
  if(o.engel.length)throw new Error('İşe katılınamadı: '+o.engel.join('; '));
  const git=zamanIlerletAna(k,o.baslangic,durakSorgusu(k)),biten=git.biten;
  if(git.durdu)return biten;
  const sonuc=ajandaSonucu(o.is,'yapildi',o.sure);
  if(o.is.veri.saatsiz){sonuc.gun=k.tarih;sonuc.saat=k.gunIciDakika;}
  if(o.secenek){
    /* seçenek, zaman başlangıca geldikten sonra yeniden doğrulanır */
    const s=kararSecenekleri(k,o.is).find(x=>x.id===secim);
    if(!s||s.engel)throw new Error('Seçenek artık geçerli değil: '+(s?s.engel:secim));
    const r=KARAR_TURLERI[o.is.veri.karar].uygula(k,o.is,secim)||{};
    sonuc.secim=secim;sonuc.secimMetni=s.metin;
    if(r.bilgi!==undefined)sonuc.bilgi=r.bilgi;
  }
  biten.push(isTamamla(k,id,sonuc));
  const bitis=simdikiAn(k)+o.sure;
  biten.push(...zamanIlerletAna(k,bitis,null,x=>sureUzat(k,x,bitis)).biten);
  return biten;
}

/* ertelenebilir işi ertesi günün aynı saatine taşır; son tarihten sonraya taşınamaz. Yeni tarihi döndürür */
function ertelemeTarihi(is){
  const yeni=tarihEkle(is.tarih,1);
  return is.veri.sonTarih!==undefined&&tarihKarsilastir(yeni,is.veri.sonTarih)>0?null:yeni;
}
function ajandaErtele(k,id,otomatik){
  const is=k.isler[id];
  if(!is||is.tur!=='ajanda')throw new Error(`Ajanda işi bulunamadı: ${id}`);
  if(is.veri.zorunluluk!=='ertelenebilir')throw new Error(`${is.veri.baslik} ertelenemez`);
  const yeni=ertelemeTarihi(is);
  if(!yeni)throw new Error(`${is.veri.baslik} son tarihinden (${is.veri.sonTarih}) sonraya ertelenemez`);
  const eski=is.tarih;
  isTasi(k,id,yeni,is.dakika);
  k.gecmis.push({tur:'erteleme',isId:id,tarih:k.tarih,dakika:k.gunIciDakika,eski,yeni,saat:is.dakika,baslik:is.veri.baslik,otomatik:!!otomatik});
  return yeni;
}

/* günü bitirmeden önce: engeller, ertesi güne taşınacak, kaçırılacak ve arada gerçekleşecek işler */
function gunuBitirOnizle(k){
  const hedef=simdikiAn(k)+1440-k.gunIciDakika+GUN_BASLANGICI,engel=[],tasinacak=[],kacirilacak=[],gerceklesecek=[];
  for(const x of bekleyenIsler(k)){
    if(isSonAn(x)>hedef)continue;
    if(x.tur!=='ajanda'){gerceklesecek.push(x);continue;}
    const v=x.veri,ad=`${v.baslik} (${saatYazi(x.dakika)})`;
    if(v.zorunluluk==='zorunlu')engel.push(v.saatsiz?`Karar bekliyor: ${v.baslik} (son cevap ${saatYazi(x.dakika)})`:`Zorunlu iş bekliyor: ${ad}`);
    else if(v.zorunluluk==='ertelenebilir'){
      if(ertelemeTarihi(x))tasinacak.push(x);else engel.push(`Bugün son günü: ${ad}`);
    }else kacirilacak.push(x);
  }
  return{hedef,engel,tasinacak,kacirilacak,gerceklesecek};
}
/* günü bitirir: ertelenebilir işler taşınır, zaman ertesi günün başlangıcına geçer. Tamamlanan kayıtları döndürür */
function gunuBitir(k){
  const o=gunuBitirOnizle(k);
  if(o.engel.length)throw new Error('Gün bitirilemez: '+o.engel.join('; '));
  for(const x of o.tasinacak)ajandaErtele(k,x.id,true);
  return sonrakiGuneGec(k);
}

/* sıradaki durma noktası (kariyeri değiştirmez): {engel, hedef: durulacak an ya da null, neden: 'randevu'|'cakisma'|'sinir',
   durak: başlangıcında durulacak iş ya da null, tasinacak, kacirilacak, gerceklesecek: arada işlenecek rutin işler} */
function ilerleOnizle(k){
  const simdi=simdikiAn(k),engel=[],tasinacak=[],kacirilacak=[],L=bekleyenIsler(k);
  const saatli=L.filter(x=>x.tur==='ajanda'&&!x.veri.saatsiz),anlar=new Map();
  for(const x of saatli){
    if(isAn(x)>simdi){anlar.set(x.id,isAn(x));continue;}
    /* şu an başlangıcında durulan iş */
    const v=x.veri,ad=`${v.baslik} (${saatYazi(x.dakika)})`;
    if(v.zorunluluk==='zorunlu')engel.push(`Önce zorunlu işe katıl: ${ad}`);
    else if(v.zorunluluk==='ertelenebilir'){
      if(ertelemeTarihi(x)){tasinacak.push(x);anlar.set(x.id,isAn(x)+1440);}else engel.push(`Bugün son günü: ${ad}`);
    }else kacirilacak.push(x);
  }
  let durak=null,hedef=null,neden='randevu';
  for(const x of saatli)if(anlar.has(x.id)&&(hedef===null||anlar.get(x.id)<hedef)){durak=x;hedef=anlar.get(x.id);}
  if(durak){
    /* durağın günü bugünden sonraysa ve o günün işleri çakışıyorsa gün başında durulur: seçim gerekir */
    const gun=Math.floor(hedef/1440),gunBasi=gun*1440+GUN_BASLANGICI;
    const ogun=saatli.filter(x=>anlar.has(x.id)&&Math.floor(anlar.get(x.id)/1440)===gun);
    const cakisiyor=ogun.some(a=>ogun.some(b=>a!==b&&anlar.get(a.id)<=anlar.get(b.id)&&anlar.get(b.id)<anlar.get(a.id)+a.veri.sure));
    if(cakisiyor&&gunBasi>simdi&&gunBasi<hedef){hedef=gunBasi;durak=null;neden='cakisma';}
  }else{
    const son=L.filter(x=>x.tur!=='ajanda'&&isSonAn(x)<=simdi+ILERLE_SINIRI*1440).pop();
    if(son){hedef=Math.max(isSonAn(son),simdi+(kacirilacak.length?1:0));neden='sinir';}
    else if(kacirilacak.length){hedef=simdi+1;neden='sinir';}
    else if(!L.some(x=>x.tur==='ajanda'))engel.push('Takvimde bekleyen bir gelişme yok');
  }
  /* son cevap anı geçilemez: bekleyen karar ilerlemeyi ancak bu an aşılacaksa engeller */
  for(const x of L)if(x.tur==='ajanda'&&x.veri.saatsiz&&(hedef===null||isSonAn(x)<=hedef))
    engel.push(`Önce karar ver: ${x.veri.baslik} (son cevap ${saatYazi(x.dakika)})`);
  const gerceklesecek=hedef===null?[]:L.filter(x=>x.tur!=='ajanda'&&isSonAn(x)<=hedef);
  return{engel,hedef,neden,durak,tasinacak,kacirilacak,gerceklesecek};
}
/* sıradaki durma noktasına ilerler. {biten: geçmiş kayıtları, neden: 'karar' (yolda karar gerektiren gelişme) ya da önizlemedeki neden,
   durak: başlangıcına gelinen iş ya da null} döndürür */
function duragaIlerle(k){
  const o=ilerleOnizle(k);
  if(o.engel.length)throw new Error('İlerlenemez: '+o.engel.join('; '));
  for(const x of o.tasinacak)ajandaErtele(k,x.id,true);
  const r=zamanIlerletAna(k,o.hedef,durakSorgusu(k));
  return{biten:r.biten,neden:r.durdu?'karar':o.neden,durak:r.durdu?null:o.durak};
}

/* bir günün ajanda satırları: bekleyen işler ve o gün için tamamlanmış/kaçırılmış/ertelenmiş kayıtlar, saat sırasıyla.
   satır: {id, tur, saat, durum:'bekliyor'|'yapildi'|'kacirildi'|'ertelendi'|'tamamlandi', baslik, zorunluluk?, sure?, bilgi?, tutar?, eylem?,
           meseleId?, saatsiz?, sonCevap?} — saati serbest karar bugünün listesinde şimdiki saatle görünür */
function ajandaGunu(k,tarih){
  const s=[];
  for(const x of bekleyenIsler(k)){
    const saatsiz=x.tur==='ajanda'&&!!x.veri.saatsiz;
    if(saatsiz?tarih!==k.tarih:x.tarih!==tarih)continue;
    const v=x.veri,r={id:x.id,tur:x.tur,saat:saatsiz?k.gunIciDakika:x.dakika,durum:'bekliyor',baslik:isBasligi(k,x)};
    if(v.meseleId)r.meseleId=v.meseleId;
    if(saatsiz){r.saatsiz=true;r.sonCevap={tarih:x.tarih,dakika:x.dakika};}
    if(x.tur==='ajanda'){r.zorunluluk=v.zorunluluk;r.sure=v.sure;if(v.eylem)r.eylem=v.eylem;if(v.sonTarih)r.sonTarih=v.sonTarih;if(v.karar)r.karar=v.karar;}
    if(x.tur==='odeme')r.tutar=v.tutar;
    s.push(r);
  }
  for(const g of k.gecmis){
    if(g.tur==='erteleme'&&g.eski===tarih){s.push({id:g.isId,tur:'ajanda',saat:g.saat,durum:'ertelendi',baslik:g.baslik,yeni:g.yeni});continue;}
    if(g.tur!=='is')continue;
    const r=g.sonuc||{};
    if(g.isTuru==='ajanda'){
      if(r.gun!==tarih)continue;
      const satir={id:g.isId,tur:'ajanda',saat:r.saat,durum:r.durum,baslik:r.baslik,zorunluluk:r.zorunluluk,sure:r.sure};
      if(r.bilgi!==undefined)satir.bilgi=r.bilgi;
      if(r.eylem!==undefined)satir.eylem=r.eylem;
      if(r.secimMetni!==undefined)satir.secimMetni=r.secimMetni;
      s.push(satir);
    }else if(g.tarih===tarih){
      const h=g.isTuru==='odeme'?k.hareketler.find(x=>x.id===r.hareketId):null;
      s.push({id:g.isId,tur:g.isTuru,saat:g.dakika,durum:'tamamlandi',baslik:h?h.aciklama:r.metin||r.bilgi||g.isTuru,tutar:h?h.tutar:undefined});
    }
  }
  return s.sort((a,b)=>a.saat-b.saat);
}

/* bugünden sonraki gün günlerin bekleyen işleri */
function yaklasanlar(k,gun){
  const son=tarihEkle(k.tarih,gun);
  return bekleyenIsler(k).filter(x=>tarihKarsilastir(x.tarih,k.tarih)>0&&tarihKarsilastir(x.tarih,son)<=0);
}

/* kulübün özet durumu: para ve bilinen insanlar. yonetim: koltuk → kişi (ya da null); kulüpte koltuk kaydı yoksa null */
function kulupDurumu(k,kulupId){
  const c=k.kulupler[kulupId],kisiler=Object.values(k.kisiler).filter(p=>p.kulupId===kulupId&&p.durum==='aktif');
  const yonetim=c.yonetim?Object.fromEntries(Object.entries(c.yonetim).map(([koltuk,id])=>[koltuk,id?k.kisiler[id]||null:null])):null;
  return{
    kulup:c,mali:maliDurum(k,kulupId),
    baskan:k.kisiler[c.baskanId]||null,
    hoca:kisiler.find(p=>p.rol==='teknikDirektor')||null,
    yoneticiler:kisiler.filter(p=>p.rol==='yonetici'),
    yonetim
  };
}
