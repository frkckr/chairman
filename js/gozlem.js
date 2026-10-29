/* ============ Chairman — antrenman gözlemi: balkondan isteğe bağlı izleme (çizim yok; yol haritası 2.7) ============
   Antrenman penceresi bir takvim işi değildir: hafta içi belirli saatlerde takım sahadadır (antrenmanPenceresi). İzlenmezse hiçbir şey
   kaçırılmış sayılmaz; geçmişe "kaçırıldı" kaydı düşmez.
   Gözlem takvimde bir ARALIKTIR (k.gozlem = {tarih, bas, bitis} ya da null/yok), süre tüketen ayrı bir iş değildir:
     gozlemAc aralığı kurar; gozlemAdim zamanı bitişe doğru parça parça, gozlemBaslat/gozlemSurdur tek parça ilerletir. Karar gerektiren bir gelişme ya da beklenen bir görüş gelirse zaman o anda
     DURUR; aralık açık kalır (kalan süre = bitis − şimdi). Karar verilirken zaman ilerlemez. gozlemSurdur kalan süreyi ilerletir.
     Aralık açıkken yapılan kısa iş (süresi KISA_IS dakikayı aşmayan) aralığın içinde geçer: gözlem süresi iki kez harcanmaz.
     Tam dikkat isteyen uzun iş için önce gözlem bırakılır (ajandaOnizle engeli).
     Zaman aralığın sonuna ya da başka bir güne geçtiğinde aralık kendiliğinden kapanır (ZAMAN_SONRASI) ve geçmişe
     {tur:'gozlem', tarih, dakika, bas, bitis, izlenen, not?} yazılır.
   Gözlem ödül toplama işi değildir: GOZLEM_NOT_ESIGI dakikadan uzun izlenirse geçmişe o günün çalışmasından tek cümlelik bir not düşer
     (tarihe göre belirlenimli; rastlantı çekmez). Para, moral ya da gizli bilgi kazandırmaz; izlememek hiçbir şey kaybettirmez.
   S-b (2026-10-27): balkon sinyalleri. Sinyal gözlenebilir davranıştır, sayı değildir: izleyen o günün gerçek durumundan bilgi alır (yorulan,
     sakatlıktan dönen, parlayan genç, durgun görünen; türler GOZLEM_SINYALLERI'nde, çekirdeği js/oyuncu-hafta.js), izlemeyen bir şey kaybetmez;
     para, moral ya da sonuç değişmez. antrenmanSinyalleri(k, tarih) saftır ve yalnız başkanın kulübüne bakar: günde en çok GOZLEM_SINYAL_EN_COK,
     oyuncu başına bir, son GOZLEM_TEKRAR_GUN günün gözlem kayıtlarında aynı (oyuncu, tür) yoksa; dakikası tarihten tohumlu. gozlemAc o aralığın
     sinyallerini dondurur (k.gozlem.sinyaller), gozlemBitir izlenen kısmını geçmişteki gözlem kaydına yazar (sinyaller: [{oyuncuId, tur, alt?, dk}]);
     metin kayda girmez (MESELE_OLAYLARI['gozlem.'+tür]). gozlemNotlari(k, oyuncu) oyuncunun dosyasına tarihli notları verir (js/kadro-dosyasi.js).
   Saatler ve eşikler TEST değeridir. */
'use strict';
const ANTRENMAN_SAATI={bas:900,bit:1020};  // hafta içi 15:00–17:00 (TEST değeri)
const KISA_IS=15;                          // gözlemin içine sığan işin en uzun süresi, dakika (TEST değeri)
const GOZLEM_NOT_ESIGI=30;                 // bundan kısa gözlem not bırakmaz (TEST değeri)
/* gözlem notlarının olay anahtarları (MESELE_OLAYLARI); içerik dosyaları ekler. Boşsa gözlem not bırakmaz (2.8L) */
const GOZLEM_NOTLARI=[];
/* S-b: sinyal türleri: tur → {oncelik, gunler (antrenman programının günleri; yoksa her antrenman günü), sec(k, p, tarih, gun) → null | {siddet, alt?}};
   içerik paketleri yeni tür ekleyebilir. Sabitler TEST */
const GOZLEM_SINYALLERI={};
const GOZLEM_SINYAL_EN_COK=3,GOZLEM_TEKRAR_GUN=7;

const gunNo=tarih=>{const [y,a,g]=tarih.split('-').map(Number);return Date.UTC(y,a-1,g)/86400000;};
/* o günün antrenman saatleri ya da null (hafta sonu ve maç günü antrenman yok) */
function antrenmanPenceresi(k,tarih){
  const hg=(gunNo(tarih)+4)%7;                                     // 0 = Pazar
  if(hg===0||hg===6)return null;
  if(Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'&&x.tarih===tarih))return null;
  return{bas:ANTRENMAN_SAATI.bas,bit:ANTRENMAN_SAATI.bit};
}
/* şu anki durum (kariyeri değiştirmez): {pencere, suruyor, kalan: antrenmanın bitmesine kalan dakika} */
function antrenmanDurumu(k){
  const p=antrenmanPenceresi(k,k.tarih),suruyor=!!p&&k.gunIciDakika>=p.bas&&k.gunIciDakika<p.bit;
  return{pencere:p,suruyor,kalan:suruyor?p.bit-k.gunIciDakika:0};
}
const gozlemAcik=k=>!!k.gozlem&&k.gozlem.tarih===k.tarih&&k.gunIciDakika<k.gozlem.bitis;
const gozlemKalan=k=>gozlemAcik(k)?k.gozlem.bitis-k.gunIciDakika:0;

/* gözlemi başlatmadan önce (kariyeri değiştirmez): {sure: gerçekleşecek dakika, bitis: gün içi dakika, engel: [metin], kisaldi: neden | null,
   gerceklesecek: arada işlenecek rutin işler} */
function gozlemOnizle(k,dakika){
  const d=antrenmanDurumu(k),engel=[],simdi=simdikiAn(k),gun=anDakika(k.tarih,0);
  if(gozlemAcik(k))engel.push('Zaten izliyorsun');
  if(!d.pencere)engel.push('Bugün antrenman yok');
  else if(k.gunIciDakika<d.pencere.bas)engel.push(`Antrenman ${saatYazi(d.pencere.bas)}'te başlıyor`);
  else if(!d.suruyor)engel.push('Antrenman bitti');
  if(!Number.isInteger(dakika)||dakika<1)engel.push('Geçersiz süre');
  if(engel.length)return{sure:0,bitis:k.gunIciDakika,engel,kisaldi:null,gerceklesecek:[]};
  let bitis=Math.min(simdi+dakika,gun+d.pencere.bit),kisaldi=bitis<simdi+dakika?'Antrenman o saatte bitiyor':null;
  for(const x of bekleyenIsler(k)){
    if(x.tur!=='ajanda')continue;
    const v=x.veri,an=isAn(x);
    /* saatli iş başlangıcında ve acil kararın son cevap anında gözlem biter: kimse sessizce kaçırılmaz */
    if(!v.saatsiz&&an>=simdi&&an<bitis){bitis=an;kisaldi=`${v.baslik} ${saatYazi(x.dakika)}'te`;}
    if(v.saatsiz&&an<=bitis){if(v.bekleyebilir&&an>simdi){bitis=an;kisaldi=`${v.baslik} için son cevap ${saatYazi(x.dakika)}`;}else engel.push(`Önce karar ver: ${v.baslik} (son cevap ${sonCevapYazi(k,x)})`);}
  }
  if(!engel.length&&bitis<=simdi)engel.push(kisaldi||'İzlenecek süre yok');
  return{sure:Math.max(0,bitis-simdi),bitis:bitis-gun,engel,kisaldi,gerceklesecek:bekleyenIsler(k).filter(x=>x.tur!=='ajanda'&&!isGizli(x)&&isSonAn(x)<=bitis)};
}
/* S-b: o günün sinyal adayları (saf): [{oyuncuId, tur, alt?, dk}] dakika sırasıyla */
function antrenmanSinyalleri(k,tarih){
  const P=antrenmanPenceresi(k,tarih),biz=(k.kisiler[k.baskanId]||{}).kulupId;
  if(!P||!biz||!k.kulupler[biz]||!k.kulupler[biz].kadro||!Object.keys(GOZLEM_SINYALLERI).length)return[];
  const gun=typeof antrenmanProgrami==='function'?antrenmanProgrami(k,biz,tarih):{tur:'yogun',yuk:1};
  const sinir=tarihEkle(tarih,-GOZLEM_TEKRAR_GUN),onceki=new Set();
  for(let i=(k.gecmis||[]).length-1;i>=0;i--){const g=k.gecmis[i];if(!g||typeof g.tarih!=='string')continue;if(g.tarih<sinir)break;
    if(g.tur==='gozlem'&&g.tarih<tarih)for(const s of g.sinyaller||[])onceki.add(s.oyuncuId+':'+s.tur);}
  const A=[];
  for(const p of kulupOyunculari(k,biz))for(const [tur,S] of Object.entries(GOZLEM_SINYALLERI)){
    if(S.gunler&&!S.gunler.includes(gun.tur))continue;
    if(onceki.has(p.id+':'+tur))continue;
    const r=S.sec(k,p,tarih,gun);if(r)A.push({oyuncuId:p.id,tur,alt:r.alt,siddet:r.siddet||0,oncelik:S.oncelik||0});
  }
  A.sort((a,b)=>b.oncelik-a.oncelik||b.siddet-a.siddet||(a.oyuncuId<b.oyuncuId?-1:1));
  const secilen=[],kim=new Set();
  for(const s of A){if(secilen.length>=GOZLEM_SINYAL_EN_COK)break;if(kim.has(s.oyuncuId))continue;kim.add(s.oyuncuId);secilen.push(s);}
  return secilen.map(s=>Object.assign({oyuncuId:s.oyuncuId,tur:s.tur},s.alt?{alt:s.alt}:{},
      {dk:P.bas+5+Math.floor(kadroRastgele(k.dunyaTohumu,`gozlem:${tarih}:${s.oyuncuId}:${s.tur}`)()*(P.bit-P.bas-10))}))
    .sort((a,b)=>a.dk-b.dk||(a.oyuncuId<b.oyuncuId?-1:1));
}
/* sinyalin TEST metni (okurken üretilir) */
const gozlemSinyalMetni=(k,s)=>{const f=MESELE_OLAYLARI['gozlem.'+s.tur+(s.alt?s.alt.charAt(0).toUpperCase()+s.alt.slice(1):'')]||MESELE_OLAYLARI['gozlem.'+s.tur];
  return f?f(k,{oyuncuId:s.oyuncuId,alt:s.alt}):null;};
/* gözlem kaydının metni: içerik notu varsa o; yoksa ilk sinyalin metni ve dosyalara düşen not sayısı; ikisi de yoksa null */
function gozlemKaydiMetni(k,kayit){
  if(!kayit)return null;
  if(kayit.not&&MESELE_OLAYLARI[kayit.not])return MESELE_OLAYLARI[kayit.not](k,{});
  const S=kayit.sinyaller||[];if(!S.length)return null;
  const m=gozlemSinyalMetni(k,S[0]);return m?m+(S.length>1?` (${S.length} not dosyalara düştü)`:' (oyuncunun dosyasına not düştü)'):null;
}
/* oyuncunun antrenman notları (geçmişteki gözlem kayıtlarından; js/kadro-dosyasi.js) */
function gozlemNotlari(k,oyuncuId){
  const L=[];for(const g of k.gecmis||[])if(g.tur==='gozlem')for(const s of g.sinyaller||[])if(s.oyuncuId===oyuncuId)
    L.push({tarih:g.tarih,dakika:s.dk,kaynak:'Antrenman (balkon)',anahtar:'gozlem.'+s.tur+(s.alt?s.alt.charAt(0).toUpperCase()+s.alt.slice(1):''),p:{oyuncuId,alt:s.alt}});
  return L;
}
/* gözlemi kapatır (şu anki saatle) ve geçmişe yazar; bıraktığı notun metnini ya da null döndürür */
function gozlemBitir(k){
  const g=k.gozlem;
  if(!g)return null;
  const ayniGun=g.tarih===k.tarih,bit=ayniGun?Math.min(k.gunIciDakika,g.bitis):g.bitis,izlenen=Math.max(0,bit-g.bas);
  const kayit={tur:'gozlem',tarih:g.tarih,dakika:bit,bas:g.bas,bitis:bit,izlenen};
  if(izlenen>=GOZLEM_NOT_ESIGI&&GOZLEM_NOTLARI.length)kayit.not=GOZLEM_NOTLARI[gunNo(g.tarih)%GOZLEM_NOTLARI.length];
  /* S-b: izlenen kısmın sinyalleri (hâlâ başkanın kulübündeki oyuncular) */
  {const biz=(k.kisiler[k.baskanId]||{}).kulupId,S=(g.sinyaller||[]).filter(s=>s.dk<bit&&k.oyuncular[s.oyuncuId]&&k.oyuncular[s.oyuncuId].kulupId===biz);
   if(S.length)kayit.sinyaller=S.map(s=>Object.assign({},s));}
  k.gecmis.push(kayit);
  k.gozlem=null;
  return gozlemKaydiMetni(k,kayit);
}
/* açık gözlemi en çok `dakika` kadar ilerletir (2.8B: ekran gözlemi oyun dakikası oyun dakikası uygular; görünen saat kayıtlı saattir).
   Aralığın bitişi ve durma sorguları tek parça ilerlemeyle aynıdır: parça parça ilerlemek aynı dünya sonucunu verir.
   {biten, durdu, neden: 'devam'|'karar'|'haber'|'bitti', kalan, not} döndürür */
function gozlemAdim(k,dakika){
  if(!gozlemAcik(k))throw new Error('Süren bir gözlem yok');
  if(!(dakika>0))throw new Error('Geçersiz adım');
  const son=anDakika(k.gozlem.tarih,k.gozlem.bitis),hedef=Math.min(son,simdikiAn(k)+dakika);
  const S0=(k.gozlem.sinyaller||[]).slice(),bas0=k.gunIciDakika,gun0=k.gozlem.tarih;   /* S-b: bu adımda geçilen sinyaller */
  const r=zamanIlerletAna(k,hedef,durakSorgusu(k)),b=r.biten[r.biten.length-1],acik=gozlemAcik(k);
  const g=k.gecmis[k.gecmis.length-1];
  const son0=acik?k.gunIciDakika:g&&g.tur==='gozlem'&&g.tarih===gun0?g.bitis:k.tarih===gun0?k.gunIciDakika:1440;
  return{biten:r.biten,durdu:r.durdu,neden:r.durdu?(b&&b.sonuc&&b.sonuc.haber?'haber':'karar'):acik?'devam':'bitti',kalan:gozlemKalan(k),
    not:!r.durdu&&!acik&&g&&g.tur==='gozlem'?gozlemKaydiMetni(k,g):null,yeni:S0.filter(s=>s.dk>=bas0&&s.dk<son0)};
}
/* kalan gözlem süresini tek parça ilerletir */
function gozlemSurdur(k){return gozlemAdim(k,Infinity);}
/* gözlem aralığını kurar, zamanı ilerletmez; ekran sonra gozlemAdim ile ilerletir */
function gozlemAc(k,dakika){
  const o=gozlemOnizle(k,dakika);
  if(o.engel.length)throw new Error('Gözlem başlatılamadı: '+o.engel.join('; '));
  k.gozlem={tarih:k.tarih,bas:k.gunIciDakika,bitis:o.bitis};
  /* S-b: aralığın sinyalleri açılışta dondurulur (aradaki ay başı, transfer ya da gün aşan kapanış onları değiştirmez) */
  {const S=antrenmanSinyalleri(k,k.tarih).filter(s=>s.dk>=k.gozlem.bas&&s.dk<k.gozlem.bitis);if(S.length)k.gozlem.sinyaller=S;}
  return{bitis:o.bitis,kalan:gozlemKalan(k)};
}
/* gözlemi kurar ve tek parça sonuna kadar ilerletir (kural denemeleri ve tek seferde izleme) */
function gozlemBaslat(k,dakika){gozlemAc(k,dakika);return gozlemSurdur(k);}

/* zaman aralığın sonuna ya da başka bir güne geçtiyse gözlem kapanır */
ZAMAN_SONRASI.push(k=>{if(k.gozlem&&!gozlemAcik(k))gozlemBitir(k);});
/* gözlem sürerken tam dikkat isteyen iş: önce balkondan ayrılmak gerekir */
AJANDA_ENGELLERI.push((k,is,sure)=>gozlemAcik(k)&&sure>KISA_IS?'Bu iş tam dikkat ister; önce gözlemi bırak':null);

/* gözlem alanının doğrulaması (kariyerDogrula EK_DENETIMLER üzerinden çağırır) */
function gozlemDogrula(k,h){
  const g=k.gozlem;
  if(g===undefined||g===null)return;
  if(typeof g!=='object'||!tarihGecerliMi(g.tarih)||!Number.isInteger(g.bas)||!Number.isInteger(g.bitis)||g.bas>g.bitis){h.push('Gözlem kaydı geçersiz');return;}
  if(g.tarih!==k.tarih||k.gunIciDakika<g.bas||k.gunIciDakika>=g.bitis)h.push('Gözlem aralığı geçmiş fakat kapanmamış');
  if(g.sinyaller!==undefined&&!gozlemSinyalleriGecerli(k,g.sinyaller,g.bas,g.bitis))h.push('Gözlem sinyalleri geçersiz');
}
/* S-b: sinyal listesi: dizi, en çok GOZLEM_SINYAL_EN_COK, bilinen tür, dakika aralıkta, oyuncu var */
function gozlemSinyalleriGecerli(k,S,bas,bit){
  return Array.isArray(S)&&S.length<=GOZLEM_SINYAL_EN_COK&&S.every(s=>s&&typeof s==='object'&&GOZLEM_SINYALLERI[s.tur]&&(k.oyuncular||{})[s.oyuncuId]
    &&Number.isInteger(s.dk)&&s.dk>=bas&&s.dk<bit&&(s.alt===undefined||typeof s.alt==='string'));
}
/* S-b: geçmişteki gözlem kayıtlarının sinyalleri */
function gozlemGecmisDogrula(k,h){for(const [i,g] of (k.gecmis||[]).entries())if(g&&g.tur==='gozlem'&&g.sinyaller!==undefined&&!gozlemSinyalleriGecerli(k,g.sinyaller,g.bas,g.bitis+1))h.push(`Geçmiş [${i}]: gözlem sinyalleri geçersiz`);}
EK_DENETIMLER.push(gozlemDogrula,gozlemGecmisDogrula);
/* ---- R5 (2026-10-29): antrenmanın sahadaki düzeni (saf okuma; çizim js/balkon.js; kayda yazmaz, rastlantı akışı çekmez) ----
   antrenmanDuzeni(k, tarih, zorla?) → null | {tur, kosu:[id], rondo:[id], sut:[id], esneme:[id], ayri:[id], kaleciler:[id], kenar:[id]}
     Başkanın kulübünün o günkü kadrosu hocanın programına göre (js/oyuncu-hafta.js antrenmanProgrami) gruplara ayrılır. Dinlenme ve maç günü
     null (saha boş); zorla (TEST görüntü anahtarı) bu günlerde de yoğun düzeni verir. Sakat oyuncu sahada yoktur; dönüşüne
     ANTRENMAN_DUZEN_TEST.donusGun gün kalan sakat ayrı koşudadır (fizyoterapistle). Toparlanma gününde son maçta toparlanmaDk dakikadan çok
     oynayanlar esneme ve yavaş koşudadır, öbürleri pas çemberi ve şut. Hafif günde koşu yok: pas çemberi ve şut (duran top).
     Kaleciler: ilki kalede, öbürü kenarda (kaleci antrenörüyle). Sıra tarihten tohumlu (kimlik ve tarih karması), aynı gün aynı düzen. Sayılar TEST. */
const ANTRENMAN_DUZEN_TEST={donusGun:3,toparlanmaDk:60,rondoEnCok:7,sutEnCok:6};
const adKarma=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
function antrenmanDuzeni(k,tarih,zorla){
  const biz=bizimKulup(k),T=ANTRENMAN_DUZEN_TEST;if(!biz||!k.kulupler[biz]||!k.kulupler[biz].kadro)return null;
  const P=typeof antrenmanProgrami==='function'?antrenmanProgrami(k,biz,tarih):{tur:'yogun'};
  let tur=P.tur;if(tur==='mac'||tur==='dinlenme'){if(!zorla)return null;tur='yogun';}
  const L=kulupOyunculari(k,biz).slice().sort((a,b)=>adKarma(a.id+tarih)-adKarma(b.id+tarih)||(a.id<b.id?-1:1));
  const sakat=p=>!!(p.sakat&&tarihKarsilastir(p.sakat.donus,tarih)>0);
  const D={tur,kosu:[],rondo:[],sut:[],esneme:[],ayri:[],kaleciler:[],kenar:[]};
  for(const p of L)if(sakat(p)&&gunFarki(tarih,p.sakat.donus)<=T.donusGun)D.ayri.push(p.id);
  const uygun=L.filter(p=>!sakat(p)),KL=uygun.filter(p=>p.mevki==='KL'),saha=uygun.filter(p=>p.mevki!=='KL');
  D.kaleciler=KL.slice(0,1).map(p=>p.id);D.kenar=KL.slice(1).map(p=>p.id);
  /* son maçta çok oynayanlar (toparlanma) */
  let cok=new Set();
  if(tur==='toparlanma'&&typeof macDakikalari==='function'){
    const F=(k.fikstur||[]).filter(f=>(f.ev===biz||f.konuk===biz)&&f.tarih<tarih&&(k.maclar||{})[f.id]).sort((a,b)=>a.tarih<b.tarih?1:-1)[0];
    if(F){const M=macDakikalari(k,F,k.maclar[F.id]);cok=new Set([...M].filter(([,dk])=>dk>T.toparlanmaDk).map(([id])=>id));}
  }
  for(const p of saha){
    if(tur==='toparlanma'&&cok.has(p.id))(D.esneme.length<=D.kosu.length?D.esneme:D.kosu).push(p.id);
    else if(tur==='yogun'&&D.kosu.length<6)D.kosu.push(p.id);
    else if(D.rondo.length<T.rondoEnCok)D.rondo.push(p.id);
    else if(D.sut.length<T.sutEnCok)D.sut.push(p.id);
    else D.esneme.push(p.id);
  }
  return D;
}
