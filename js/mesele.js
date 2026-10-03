/* ============ Chairman — mesele: günlere yayılan tek konu ve ekibe verilen işler (çizim yok; yol haritası 2.3–2.4) ============
   Mesele (k.meseleler['mesele-N']): {id, tur, baslik, durum, sorumluId, kisiler:[kişi], olaylar, gorulen, kapanis}
     durum: 'kararBekliyor' başkanın adımı bekleniyor · 'ekipte' ekipten biri yürütüyor · 'haberBekliyor' ödeme/haber bekleniyor · 'kapandi'.
     olaylar: [{tarih, dakika, anahtar, p}] — metin saklanmaz; MESELE_OLAYLARI[anahtar](k, p) gösterirken üretir.
     gorulen: oyuncunun gördüğü olay sayısı (yalnız "yeni" işareti; işi tamamlamaz, zamanı ilerletmez).
     kapanis: null ya da {tarih, dakika}.
   Tek konuya tek mesele; meseleye gerektiği kadar iş bağlanır: işin veri.meseleId alanı (ajanda, ödeme, ekip işi).
   Mesele işlerin kopyasını tutmaz; sıradaki adım ve beklenen haber bağlı bekleyen işlerden türetilir (meseleOzeti).
   Durum, bir iş bütün etkileriyle tamamlandıktan sonra bağlı işlerden değerlendirilir (meseleDegerlendir, IS_SONRASI):
     bağlı ajanda işi varsa karar bekliyor, yoksa ekip işi varsa ekipte, yoksa başka iş varsa haber bekliyor, hiç yoksa kapanır.
     İlk taksit gelince ya da eski ödeme iptal edilip yenileri kurulurken mesele kapanmaz.
   Ekip işi (takvimde 'ekip' türü): veri {meseleId, kisiId, kulupId, koltuk, gorev, ...}. Zamanı gelince görevlendirilen kişinin
     (o an koltukta oturanın değil) katkısına göre EKIP_GOREVLERI[gorev].uygula çalışır. Kişi koltuktan ayrıldıysa iş başkana döner (geriDon).
     Sonuç 'dur:true' taşıyorsa ilerleme o anda durur (js/ajanda.js).
     EKIP_GOREVLERI[gorev] = {denetle(k,veri) → hatalar, bekleme(k,is) → beklenen haberin metni, uygula(k,is) → sonuç, geriDon(k,is) → sonuç}
   Konuya özgü olay anahtarları, ekip görevleri ve kategoriler içerik dosyalarındadır (2.8L'den beri oyunda içerik yoktur). */
const MESELE_DURUMLARI=['kararBekliyor','ekipte','haberBekliyor','kapandi'];
const MESELE_DURUM_ADI={kararBekliyor:'Karar sende',ekipte:'Ekipte',haberBekliyor:'Haber bekleniyor',kapandi:'Kapandı'};
const EKIP_GOREVLERI={};
/* meseleOzeti'ne ek bilgi katan kural dosyaları: (k, meseleId, özet) => void (js/olay.js kanıt satırlarını buradan ekler) */
const MESELE_OZET_EKLERI=[];

const TR_AYLAR=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const gunAyYazi=t=>{const [,a,g]=t.split('-').map(Number);return g+' '+TR_AYLAR[a-1];};
const kisiAdi=(k,id)=>(k.kisiler[id]||{}).ad||'—';

/* olay metinleri: anahtar → (k, p) => metin. Konuya özgü anahtarlar kendi kural dosyasında eklenir (ör. js/yonetim.js 'sponsor.*') */
const MESELE_OLAYLARI={
  odeme:(k,p)=>`${p.aciklama}: ${paraYazi(p.tutar)} ${p.tutar<0?'ödendi':'kasaya girdi'}.`,
  kapandi:()=>'Konu kapandı; bekleyen adım kalmadı.',
  sureUzadi:(k,p)=>`Başka bir işteydin; “${p.baslik}” için son cevap saati ${saatYazi(p.dakika)} oldu.`,
  ekipAyrildi:(k,p)=>`${kisiAdi(k,p.kisiId)} görevden ayrıldığı için iş sana döndü.`
};
/* dosyada konunun kategorisi: mesele türü → [ad, simge harfi]; içerik dosyaları ekler. Tanımsız tür 'Kulüp' sayılır */
const MESELE_KATEGORILERI={};
const meseleKategorisi=m=>MESELE_KATEGORILERI[m.tur]||['Kulüp','K'];

/* yeni mesele açar; kimliğini döndürür. Durum bağlı işlerden değerlendirilene kadar verilen değerdir */
function meseleAc(k,{tur,baslik,sorumluId,kisiler=[],durum='kararBekliyor'}){
  const id=kimlikUret(k,'mesele');
  k.meseleler[id]={id,tur,baslik,durum,sorumluId,kisiler:kisiler.slice(),olaylar:[],gorulen:0,kapanis:null};
  return id;
}
/* meselenin geçmişine şu anki zamanla olay yazar; olayın metnini döndürür */
function meseleOlay(k,id,anahtar,p={}){
  const m=k.meseleler[id];
  if(!m)throw new Error(`Mesele bulunamadı: ${id}`);
  if(!MESELE_OLAYLARI[anahtar])throw new Error(`Bilinmeyen mesele olayı: ${anahtar}`);
  m.olaylar.push({tarih:k.tarih,dakika:k.gunIciDakika,anahtar,p});
  return MESELE_OLAYLARI[anahtar](k,p);
}
/* meseleye bağlı bekleyen işler, zaman sırasıyla */
const meseleIsleri=(k,id)=>Object.values(k.isler).filter(x=>x.veri&&x.veri.meseleId===id)
  .sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika)||isNo(a.id)-isNo(b.id));
/* bağlı işlerden türeyen durum; bağlı iş yoksa null (kapanmalı) */
function meseleTuretilenDurum(isler){
  return isler.some(x=>x.tur==='ajanda')?'kararBekliyor':isler.some(x=>x.tur==='ekip')?'ekipte':isler.length?'haberBekliyor':null;
}
/* açık meselelerin durumunu bağlı işlerden günceller; bağlı işi kalmayan mesele kapanır */
function meseleDegerlendir(k){
  for(const m of Object.values(k.meseleler||{})){
    if(m.durum==='kapandi')continue;
    const isler=meseleIsleri(k,m.id),durum=meseleTuretilenDurum(isler);
    if(!durum){m.durum='kapandi';m.kapanis={tarih:k.tarih,dakika:k.gunIciDakika};meseleOlay(k,m.id,'kapandi');continue;}
    m.durum=durum;
    if(durum==='kararBekliyor')m.sorumluId=k.baskanId;
    else if(durum==='ekipte')m.sorumluId=isler.find(x=>x.tur==='ekip').veri.kisiId;
  }
}
IS_SONRASI.push((k,is)=>{
  if(!k.meseleler)return;
  const id=is.veri&&is.veri.meseleId;
  if(id&&k.meseleler[id]&&is.tur==='odeme')meseleOlay(k,id,'odeme',{tutar:is.veri.tutar,aciklama:is.veri.aciklama});
  meseleDegerlendir(k);
});

/* oyuncu meselenin geçmişini gördü: yalnız "yeni" işareti sıfırlanır */
function meseleGoruldu(k,id){const m=k.meseleler[id];if(m)m.gorulen=m.olaylar.length;}

/* meselenin okunur özeti (kariyeri değiştirmez): kim ilgileniyor, ne bekleniyor, şimdi ne yapılabilir, geçmiş.
   adimlar: bağlı bekleyen işler {isId, tur, tarih, dakika, saatsiz, metin}. karar: başkanın bekleyen adımı {isId, simdi} ya da null;
   simdi: bu adım şu an atılabilir mi (saati serbest ya da bugünün işi). bilgiler: başkanın bildiği kanıtlar {metin, kaynak, tarih} (js/olay.js) */
function meseleOzeti(k,id){
  const m=k.meseleler[id],isler=meseleIsleri(k,id),karar=isler.find(x=>x.tur==='ajanda')||null;
  const o={
    mesele:m,durum:m.durum,durumAdi:MESELE_DURUM_ADI[m.durum],
    sorumlu:k.kisiler[m.sorumluId]||null,
    kisiler:m.kisiler.map(x=>k.kisiler[x]).filter(Boolean),
    adimlar:isler.map(x=>({isId:x.id,tur:x.tur,tarih:x.tarih,dakika:x.dakika,saatsiz:!!x.veri.saatsiz,metin:isBasligi(k,x),tutar:x.tur==='odeme'?x.veri.tutar:undefined})),
    karar:karar?{isId:karar.id,simdi:!!karar.veri.saatsiz||karar.tarih===k.tarih}:null,
    yeni:m.olaylar.length-m.gorulen,
    olaylar:m.olaylar.map(o=>({tarih:o.tarih,dakika:o.dakika,metin:MESELE_OLAYLARI[o.anahtar](k,o.p)})),
    bilgiler:[]
  };
  for(const f of MESELE_OZET_EKLERI)f(k,id,o);
  return o;
}
/* meseleler: önce açık olanlar (kimlik sırasıyla), sonra kapananlar (son kapanan önce) */
function meseleListesi(k){
  const L=Object.values(k.meseleler||{}),no=m=>Number(m.id.slice(7));
  return L.filter(m=>m.durum!=='kapandi').sort((a,b)=>no(a)-no(b))
    .concat(L.filter(m=>m.durum==='kapandi').sort((a,b)=>anDakika(b.kapanis.tarih,b.kapanis.dakika)-anDakika(a.kapanis.tarih,a.kapanis.dakika)||no(b)-no(a)));
}

/* ---- ekip işi: devredilen iş takvimde bekler, zamanı gelince görevlendirilen kişiye göre sonuçlanır ---- */
IS_TURLERI.ekip={
  denetle:(k,v)=>{
    if(!v||typeof v!=='object')return['ekip işi bilgisi yok'];
    const h=[],g=EKIP_GOREVLERI[v.gorev];
    if(typeof v.meseleId!=='string')h.push('ekip işi bir meseleye bağlı değil');
    if(!(k.kisiler||{})[v.kisiId])h.push(`görevlendirilen kişi bulunamadı (${v.kisiId})`);
    if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);
    if(typeof v.koltuk!=='string'||!v.koltuk)h.push('koltuk yok');
    if(!g)h.push(`bilinmeyen ekip görevi (${v.gorev})`);else h.push(...g.denetle(k,v));
    return h;
  },
  baslik:(k,is)=>EKIP_GOREVLERI[is.veri.gorev].bekleme(k,is),
  uygula:(k,is)=>{
    const v=is.veri,g=EKIP_GOREVLERI[v.gorev],p=k.kisiler[v.kisiId],c=k.kulupler[v.kulupId];
    if(p&&p.durum==='aktif'&&c.yonetim&&c.yonetim[v.koltuk]===v.kisiId)return g.uygula(k,is);
    /* görevlendirilen kişi artık o koltukta değil: işi yeni oturan kendiliğinden üstlenmez, başkana döner */
    const bilgi=meseleOlay(k,v.meseleId,'ekipAyrildi',{kisiId:v.kisiId});
    g.geriDon(k,is);
    return{bilgi,dur:true};
  }
};

/* mesele alanlarının doğrulaması (kariyerDogrula EK_DENETIMLER üzerinden çağırır) */
function meseleDogrula(k,h){
  const M=k.meseleler,kisiler=k.kisiler||{};
  if(!M||typeof M!=='object'||Array.isArray(M)){h.push('Mesele listesi (meseleler) yok');return;}
  const simdi=tarihGecerliMi(k.tarih)&&Number.isInteger(k.gunIciDakika)?simdikiAn(k):null;
  const anGecerli=x=>x&&tarihGecerliMi(x.tarih)&&Number.isInteger(x.dakika)&&x.dakika>=0&&x.dakika<=1439;
  const bagli={};
  for(const [isId,is] of Object.entries(k.isler||{})){
    const id=is&&is.veri&&is.veri.meseleId;
    if(id===undefined)continue;
    if(!M[id]){h.push(`İş ${isId}: mesele bulunamadı (${id})`);continue;}
    (bagli[id]=bagli[id]||[]).push(is);
  }
  for(const [anahtar,m] of Object.entries(M)){
    const ad=`Mesele ${anahtar}`;
    if(!m||m.id!==anahtar){h.push(`${ad}: kimliği anahtarıyla aynı değil (${m&&m.id})`);continue;}
    kimlikDenetle(k,h,ad,anahtar,'mesele');
    if(typeof m.baslik!=='string'||!m.baslik)h.push(`${ad}: başlık yok`);
    if(typeof m.tur!=='string'||!m.tur)h.push(`${ad}: tür yok`);
    if(!MESELE_DURUMLARI.includes(m.durum))h.push(`${ad}: bilinmeyen durum (${m.durum})`);
    if(!kisiler[m.sorumluId])h.push(`${ad}: sorumlu kişi bulunamadı (${m.sorumluId})`);
    if(!Array.isArray(m.kisiler))h.push(`${ad}: ilgili kişi listesi yok`);
    else for(const x of m.kisiler)if(!kisiler[x])h.push(`${ad}: ilgili kişi bulunamadı (${x})`);
    if(!Array.isArray(m.olaylar)){h.push(`${ad}: olay listesi yok`);continue;}
    m.olaylar.forEach((o,i)=>{
      if(!anGecerli(o))h.push(`${ad} olay [${i}]: geçersiz tarih/dakika`);
      else if(simdi!==null&&anDakika(o.tarih,o.dakika)>simdi)h.push(`${ad} olay [${i}]: gelecekte kalan kayıt`);
      if(!o||!MESELE_OLAYLARI[o.anahtar])h.push(`${ad} olay [${i}]: bilinmeyen olay (${o&&o.anahtar})`);
      else if(!o.p||typeof o.p!=='object'||Array.isArray(o.p))h.push(`${ad} olay [${i}]: parametreler nesne değil`);
    });
    if(!Number.isInteger(m.gorulen)||m.gorulen<0||m.gorulen>m.olaylar.length)h.push(`${ad}: görülen olay sayısı geçersiz (${m.gorulen})`);
    const isler=bagli[anahtar]||[];
    if(m.durum==='kapandi'){
      if(!anGecerli(m.kapanis))h.push(`${ad}: kapanmış fakat kapanış anı yok`);
      if(isler.length)h.push(`${ad}: kapanmış fakat bağlı iş bekliyor (${isler.map(x=>x.id).join(', ')})`);
    }else{
      if(m.kapanis!==null)h.push(`${ad}: açık fakat kapanış anı var`);
      if(!isler.length)h.push(`${ad}: açık fakat bekleyen adımı yok`);
      else if(MESELE_DURUMLARI.includes(m.durum)&&meseleTuretilenDurum(isler)!==m.durum)h.push(`${ad}: durumu (${m.durum}) bağlı işlerle tutmuyor (${meseleTuretilenDurum(isler)})`);
    }
  }
}
EK_DENETIMLER.push(meseleDogrula);
