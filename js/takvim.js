/* ============ Chairman — takvim: gün, gün içi zaman ve bekleyen işler (çizim yok) ============
   Kariyerin zamanı yalnız burada ilerler: zamanIlerlet(k, dakika) bir eylemin ajandada kapladığı süreyi işler.
   Ekranda beklemek, düşünmek ya da maç animasyonu takvimi ilerletmez.
   Bekleyen iş (k.isler): {id:'is-N', tur, tarih, dakika, veri}. Zamanı gelince türünün uygula() işlevi bir kez çalışır,
   iş listeden çıkar ve k.gecmis'e {tur:'is', isId, isTuru, tarih, dakika, sonuc} olarak yazılır.
   Aynı anda zamanı gelen işler kimlik numarası sırasıyla (önce eklenen önce) tamamlanır; zamanı nasıl parçalı
   ilerletirseniz ilerletin sonuç aynıdır. İş türleri IS_TURLERI'ndedir; maliye.js 'odeme' türünü ekler. */
const GUN_BASLANGICI=480;                  // yeni gün 08:00'de başlar (TEST değeri; ajanda tasarımı 2.1'de)
const ZAMAN_ISLEM_SINIRI=100000;           // tek ilerletmede tamamlanabilecek iş sayısı; kendini sürekli yeniden kuran işe karşı

/* iş türleri: denetle(k, veri) → hata listesi; uygula(k, is) → geçmişe yazılacak sade sonuç (ya da undefined) */
const IS_TURLERI={
  hatirlatma:{
    denetle:(k,v)=>v&&typeof v.metin==='string'&&v.metin?[]:['hatırlatma metni yok'],
    uygula:(k,is)=>({metin:is.veri.metin})
  }
};

/* an: tarih + gün içi dakika, tek tamsayıya çevrilmiş (1970-01-01 00:00'dan beri dakika). Sıralama ve fark için */
function anDakika(tarih,dakika){
  const [y,a,g]=tarih.split('-').map(Number);
  return Date.UTC(y,a-1,g)/86400000*1440+dakika;
}
function anTarih(an){
  const gun=Math.floor(an/1440),d=new Date(gun*86400000),iki=n=>String(n).padStart(2,'0');
  return{tarih:`${d.getUTCFullYear()}-${iki(d.getUTCMonth()+1)}-${iki(d.getUTCDate())}`,dakika:an-gun*1440};
}
const tarihEkle=(tarih,gun)=>anTarih(anDakika(tarih,0)+gun*1440).tarih;
const simdikiAn=k=>anDakika(k.tarih,k.gunIciDakika);
const saatYazi=dk=>`${String(Math.floor(dk/60)).padStart(2,'0')}:${String(dk%60).padStart(2,'0')}`;
function anAyarla(k,an){const t=anTarih(an);k.tarih=t.tarih;k.gunIciDakika=t.dakika;}
const isNo=id=>Number(id.slice(3));

/* yeni bekleyen iş; geçmiş bir ana iş kurulamaz. Kimliği döndürür */
function isEkle(k,{tur,tarih,dakika,veri}){
  const h=[],t=IS_TURLERI[tur];
  if(!t)h.push(`bilinmeyen iş türü: ${tur}`);else h.push(...t.denetle(k,veri));
  if(!tarihGecerliMi(tarih))h.push(`geçersiz tarih: ${tarih}`);
  if(!Number.isInteger(dakika)||dakika<0||dakika>1439)h.push(`gün içi dakika 0–1439 arasında değil: ${dakika}`);
  else if(!h.length&&anDakika(tarih,dakika)<simdikiAn(k))h.push(`${tarih} ${saatYazi(dakika)} geçmişte kaldı`);
  sadeVeriDenetle(veri,'veri',h);
  if(h.length)throw new Error('İş eklenemedi: '+h.join('; '));
  const id=kimlikUret(k,'is');
  k.isler[id]={id,tur,tarih,dakika,veri:JSON.parse(JSON.stringify(veri))};
  return id;
}

/* zamanı hedef ana kadar gelen ilk iş: önce en erken an, aynı anda önce eklenen */
function siradakiIs(k,hedef){
  let en=null,enAn=0;
  for(const is of Object.values(k.isler)){
    const an=anDakika(is.tarih,is.dakika);
    if(an>hedef)continue;
    if(!en||an<enAn||(an===enAn&&isNo(is.id)<isNo(en.id))){en=is;enAn=an;}
  }
  return en;
}

/* zamanı dakika kadar ilerletir; arada zamanı gelen işleri sırayla bir kez tamamlar. Geçmiş kayıtlarını döndürür */
function zamanIlerlet(k,dakika){
  if(!Number.isInteger(dakika)||dakika<0)throw new Error(`Zaman yalnız ileri ve tam dakika olarak ilerler: ${dakika}`);
  const hedef=simdikiAn(k)+dakika,biten=[];
  for(let n=0;;n++){
    if(n>=ZAMAN_ISLEM_SINIRI)throw new Error('Zaman ilerletme sınırı aşıldı: işler kendini sürekli yeniden kuruyor olabilir');
    const is=siradakiIs(k,hedef);
    if(!is)break;
    anAyarla(k,Math.max(anDakika(is.tarih,is.dakika),simdikiAn(k)));
    const sonuc=IS_TURLERI[is.tur].uygula(k,is);
    delete k.isler[is.id];
    const kayit={tur:'is',isId:is.id,isTuru:is.tur,tarih:k.tarih,dakika:k.gunIciDakika,sonuc:sonuc===undefined?null:sonuc};
    k.gecmis.push(kayit);biten.push(kayit);
  }
  anAyarla(k,hedef);
  return biten;
}
/* ertesi günün başlangıcına geç (arada kalan işler tamamlanır) */
const sonrakiGuneGec=k=>zamanIlerlet(k,1440-k.gunIciDakika+GUN_BASLANGICI);

/* takvim alanlarının doğrulaması; kariyerDogrula çağırır */
function takvimDogrula(k,h){
  const isler=k.isler,gecmis=k.gecmis;
  if(!isler||typeof isler!=='object'||Array.isArray(isler)){h.push('Bekleyen iş listesi (isler) yok');return;}
  if(!Array.isArray(gecmis)){h.push('Geçmiş listesi yok');return;}
  const simdi=tarihGecerliMi(k.tarih)&&Number.isInteger(k.gunIciDakika)?simdikiAn(k):null;
  for(const [anahtar,is] of Object.entries(isler)){
    const ad=`İş ${anahtar}`;
    if(!is||is.id!==anahtar){h.push(`${ad}: kimliği anahtarıyla aynı değil (${is&&is.id})`);continue;}
    kimlikDenetle(k,h,ad,anahtar,'is');
    const t=IS_TURLERI[is.tur];
    if(!t)h.push(`${ad}: bilinmeyen iş türü (${is.tur})`);else for(const x of t.denetle(k,is.veri))h.push(`${ad}: ${x}`);
    if(!tarihGecerliMi(is.tarih))h.push(`${ad}: geçersiz tarih (${is.tarih})`);
    else if(!Number.isInteger(is.dakika)||is.dakika<0||is.dakika>1439)h.push(`${ad}: gün içi dakika 0–1439 arasında değil`);
    else if(simdi!==null&&anDakika(is.tarih,is.dakika)<simdi)h.push(`${ad}: zamanı geçmiş fakat tamamlanmamış`);
  }
  const tamamlanan=new Set();
  gecmis.forEach((g,i)=>{
    if(!g||typeof g!=='object'){h.push(`Geçmiş [${i}]: kayıt değil`);return;}
    if(!tarihGecerliMi(g.tarih))h.push(`Geçmiş [${i}]: geçersiz tarih (${g.tarih})`);
    else if(simdi!==null&&anDakika(g.tarih,g.dakika)>simdi)h.push(`Geçmiş [${i}]: gelecekte kalan kayıt`);
    if(g.tur!=='is')return;
    if(tamamlanan.has(g.isId))h.push(`Geçmiş: ${g.isId} iki kez tamamlanmış`);
    tamamlanan.add(g.isId);
    if(isler[g.isId])h.push(`İş ${g.isId}: hem bekliyor hem tamamlanmış görünüyor`);
  });
}
