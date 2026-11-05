/* ============ Chairman — dosya şablonu: aşamalı iş, süreç kaydı, kıvrımlar (çizim yok; R4-a, 2026-10-29) ============
   Kaynak: OYUN_TASARIMI §2 “Dosya şablonları”, TEKNIK_PLAN §6 “Dosya şablonu sözleşmesi”, karar 60/7 (küçük süreç kaydı), plan araclar/plan/r4-uygulama.md.
   Şablon bir dosyanın (mesele) aşamalarını tarif eder; koddadır, kayda girmez. Dosyanın o anki durumu meseleye yazılır: süreç kaydı odur
   (ayrı süreç defteri, genel hikâye motoru ya da betik yorumlayıcısı yoktur).
     SABLONLAR[ad] = {meseleTuru?, baslangic, asamalar:{[aşamaAdı]: aşama}}
     aşama türleri:
       kart     {tur:'kart', sinif:'firsat'|'pazarlik'|'rutin'|'sorun', baslik(k,m), aciklama(k,m), son(k,m) → {tarih,dakika}, soran?(k,m), veri?(k,m) → iş verisine ek,
                 secenekler(k,m,is) → [{id, metin, aciklama, sure?, engel?}], uygula(k,m,secim,is) → {asama, p?, bilgi?}, cevapsiz:{metin(k,m,is), uygula(k,m,is) → {asama, p?, bilgi?}},
                 baglam?(k,m,is,secim)} — iş: ajanda kararı ('sablonKarti'; saatsiz, bekleyebilir, son cevap anı son(k,m))
       bekleme  {tur:'bekleme', an(k,m) → {tarih,dakika}, bitince(k,m) → {asama, p?, bilgi?, dur?}} — iş: gizli gelişme ('sablonAdim')
       devir    {tur:'devir', kisi(k,m) → kişi kimliği, konu, an(k,m), bitince(k,m,kalite) → {…}} — görevlendirilen kişi yürütür; kalite gizli yetenekten
                 'iyi' | 'vasat' | 'kotu' (devirKalitesi)
       uyku     {tur:'uyku', kanca?, kosul(k,m), an(k,m) (sınır), sonra, kayip} — koşul bir kancada (SABLON_KANCALARI: 'ayBasi', 'macSonucu') ya da sınır anında
                 denenir; tutarsa 'sonra', sınırda tutmazsa 'kayip' aşamasına
       son      {tur:'son', sonuc(k,m,p) → metin} — dosyanın sonucu yazılır; bağlı iş kalmadığı için mesele bir sonraki değerlendirmede kapanır
     Her aşamaya isteğe bağlı giris(k,m,p) → metin|null: aşamaya girerken veri hazırlığı ve dosyaya olay.
   Meseledeki süreç kaydı: m.sablon = {ad, asama, adim, kaynak, sahip, karsi, son, veri, sonuc, kivrim}
     adim: her geçişte artar; aşamanın işi kendi adımını taşır (veri.adim), adımı geçmiş iş hiçbir şey yapmaz (bir kez uygulama).
     kaynak: dosyayı ne açtı ('baskan' girişimi, 'hoca', 'dunya' …; girişim payı ölçüsü). sahip: yürüten kişi (null = başkan). karsi: {tur:'kulup', id} | null.
     veri: şablonun küçük düz verisi (gizli değerler dahil; hiçbir ekranda sayı olarak gösterilmez). sonuc: null (açık) | metin. kivrim: olmuş kıvrımların adları.
   Kıvrım (SABLON_KIVRIMLARI[şablon] = [{ad, asamalar, an:'giris'|'bitis', kosul(k,m), olasilik(k,m), uygula(k,m) → {asama?, p?, bilgi?, dur?} | null, tekrar?}]):
     aşamaya girerken ('giris') ya da bekleme/devir dolarken ('bitis') denenir; koşul dünyanın gerçek durumundan, çekiliş belirlenimci
     (kadroRastgele(dünyaTohumu, 'kivrim:<mesele>:<ad>:<adım>')). Asama döndüren kıvrım akışı o aşamaya çevirir. Yeni senaryo = yeni kıvrım; motor değişmez.
   kisiYetenegi(k, kişi, konu) → 0,20–0,95: kişinin konudaki gizli yeteneği (TEST); dünya tohumundan türetilir, kayda yazılmaz, gösterilmez.
   sablonAc(k, ad, {baslik, kaynak, sahip?, karsi?, son?, veri?, kisiler?, asama?, p?}) → mesele kimliği; sablonIlerle(k, mesele, aşama, p) → {bilgi, dur}.
   AR3-b (2026-11-05, karar 95 “Her işin bir sahibi var”): şablon isteğe bağlı sahiplik tanımı taşır:
     SABLONLAR[ad].sahiplik = {kisi(k, m) → devredilecek kişi, devret:{asamalar:[…], hedef}, devral:{asamalar:[…], hedef}}
     sablonSahiplik(k, m) → {sahip, kisiId, devret, devral, engel}   saf; dosyada ve Haberler'de düğmeler bundan
     sablonDevret(k, mesele) · sablonDevral(k, mesele)   komut: bekleyen iş kalkar, dosya hedef aşamaya geçer; geçmişe {tur:'sahiplik', olay, meseleId, kisiId}
       ve dosyaya kişinin tepkisi (js/metin.js 'devret.tepki' / 'devral.tepki'); devralınan iş temiz sayfa değildir (dosyanın verisi ve sözler durur)
     devrin kalitesi: gizli yetenek + huyun payı (js/metin.js huyDevirEtkisi) − yük (DEVIR_TEST.yukEsik ve üstü açık iş) − küslük (gururlu kişiden iş
       alındıysa kus gün); devrin süresine huyun günü eklenir. Her devrin sonucu geçmişe {tur:'devirSonucu', meseleId, kisiId, sablon, kalite} (sicil).
     kisiYuku(k, kişi) · kisiKus(k, kişi) · kisiSicili(k, kişi) → {is, iyi, vasat, kotu, devralinan, satir}   saf okumalar */
'use strict';
const SABLONLAR={};
const SABLON_KIVRIMLARI={};
const KART_SINIFLARI={firsat:'Fırsat',pazarlik:'Pazarlık',rutin:'Rutin',sorun:'Sorun'};
const SABLON_ASAMA_TURLERI=['kart','bekleme','devir','uyku','son'];
const SABLON_KANCALARI=['ayBasi','macSonucu'];
/* devrin kalitesi (TEST): yetenek y için iyi payı 0,15 + 0,7·y, kötü payı 0,35·(1 − y), kalanı vasat */
const DEVIR_TEST={iyiTaban:0.15,iyiKat:0.7,kotuKat:0.35,yukEsik:3,yukCeza:0.15,kusCeza:0.2};

const kisiYetenegi=(k,kisiId,konu)=>Math.round((0.2+0.75*kadroRastgele(k.dunyaTohumu,'yetenek:'+kisiId+':'+konu)())*100)/100;
/* AR3-b: açık dosyalarında sahibi olduğu iş sayısı; gururlu kişiden iş alındıysa küslüğün bittiği an (yoksa null) */
const kisiYuku=(k,kisiId,haricMesele)=>Object.values(k.meseleler||{}).filter(m=>m.id!==haricMesele&&m.durum!=='kapandi'&&m.sablon&&m.sablon.sahip===kisiId&&m.sablon.sonuc===null).length;
function kisiKus(k,kisiId){
  const E=typeof huyDevirEtkisi==='function'?huyDevirEtkisi(k,kisiId):{kus:0};if(!E.kus)return null;
  const g=(k.gecmis||[]).filter(x=>x.tur==='sahiplik'&&x.olay==='devral'&&x.kisiId===kisiId).pop();if(!g)return null;
  const son=anDakika(g.tarih,g.dakika)+E.kus*1440;return son>simdikiAn(k)?anTarih(son):null;
}
function devirKalitesi(k,kisiId,konu,anahtar,haricMesele){
  const E=typeof huyDevirEtkisi==='function'?huyDevirEtkisi(k,kisiId):{kalite:0},T=DEVIR_TEST;
  const y=Math.min(0.98,Math.max(0.05,kisiYetenegi(k,kisiId,konu)+E.kalite-(kisiYuku(k,kisiId,haricMesele)>=T.yukEsik?T.yukCeza:0)-(kisiKus(k,kisiId)?T.kusCeza:0)));
  const r=kadroRastgele(k.dunyaTohumu,'devir:'+anahtar)();
  return r<T.iyiTaban+T.iyiKat*y?'iyi':r>1-T.kotuKat*(1-y)?'kotu':'vasat';
}
const sablonAsama=m=>m&&m.sablon?(SABLONLAR[m.sablon.ad]||{asamalar:{}}).asamalar[m.sablon.asama]||null:null;
const sablonluMu=m=>!!(m&&m.sablon);
/* şimdiden en az dk dakika sonraki an (son cevap ve bekleme anlarında geçmişe düşmemek için) */
const sablonEnErken=(k,dk)=>anTarih(simdikiAn(k)+dk);
const sablonAnSec=(k,o,enAz)=>{const e=sablonEnErken(k,enAz===undefined?30:enAz);return anDakika(o.tarih,o.dakika)<anDakika(e.tarih,e.dakika)?e:o;};

function sablonAc(k,ad,o){
  const S=SABLONLAR[ad];if(!S)throw new Error(`Bilinmeyen şablon: ${ad}`);
  if(typeof o.baslik!=='string'||!o.baslik)throw new Error(`Şablon ${ad}: başlık yok`);
  const id=meseleAc(k,{tur:S.meseleTuru||ad,baslik:o.baslik,sorumluId:k.baskanId,kisiler:o.kisiler||[]});
  k.meseleler[id].sablon={ad,asama:null,adim:0,kaynak:o.kaynak||'dunya',sahip:o.sahip||null,karsi:o.karsi||null,son:o.son||null,
    veri:JSON.parse(JSON.stringify(o.veri||{})),sonuc:null,kivrim:[]};
  sablonIlerle(k,id,o.asama||S.baslangic,o.p);
  meseleDegerlendir(k);
  return id;
}
/* aşamaya geçer: giriş, giriş kıvrımları, aşamanın işi. Döner {bilgi, dur} (bilgi: dosyaya yazılan son olayın metni) */
function sablonIlerle(k,id,asamaAd,p,derinlik){
  const m=k.meseleler[id];if(!m||!m.sablon)throw new Error(`Şablonlu dosya bulunamadı: ${id}`);
  if((derinlik|0)>12)throw new Error(`Şablon ${m.sablon.ad}: aşama döngüsü (${asamaAd})`);
  const S=SABLONLAR[m.sablon.ad],A=S.asamalar[asamaAd];if(!A)throw new Error(`Şablon ${m.sablon.ad}: bilinmeyen aşama (${asamaAd})`);
  m.sablon.asama=asamaAd;m.sablon.adim++;
  let bilgi=A.giris?A.giris(k,m,p||{})||null:null,dur=false;
  const kv=kivrimDene(k,m,'giris');
  if(kv){bilgi=kv.bilgi||bilgi;dur=!!kv.dur;if(kv.asama){const s=sablonIlerle(k,id,kv.asama,kv.p,(derinlik|0)+1);return{bilgi:s.bilgi||bilgi,dur:dur||s.dur};}}
  const v0={meseleId:id,adim:m.sablon.adim};
  if(A.tur==='kart'){
    const an=sablonAnSec(k,A.son(k,m));
    const v=Object.assign({baslik:A.baslik(k,m),aciklama:A.aciklama(k,m),zorunluluk:'zorunlu',sure:0,saatsiz:true,bekleyebilir:true,
      gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'sablonKarti',sinif:A.sinif||'rutin'},v0,A.veri?A.veri(k,m):{});
    const s=A.soran?A.soran(k,m):null;if(s)v.soran=s;
    isEkle(k,{tur:'ajanda',tarih:an.tarih,dakika:an.dakika,veri:v});
  }else if(A.tur==='bekleme'||A.tur==='devir'||A.tur==='uyku'){
    let an=sablonAnSec(k,A.an(k,m),1);
    if(A.tur==='devir'){m.sablon.sahip=A.kisi(k,m);
      /* AR3-b: huyun günü (yemeğe düşkün: imza bir gün kayar) */
      const g=typeof huyDevirEtkisi==='function'?huyDevirEtkisi(k,m.sablon.sahip).gun:0;if(g)an=anTarih(anDakika(an.tarih,an.dakika)+g*1440);}
    isEkle(k,{tur:'gelisme',tarih:an.tarih,dakika:an.dakika,veri:Object.assign({gelisme:'sablonAdim'},v0)});
  }else if(A.tur==='son'){
    m.sablon.sonuc=String(A.sonuc(k,m,p||{})||'tamam');m.sablon.sahip=null;
  }else throw new Error(`Şablon ${m.sablon.ad}: bilinmeyen aşama türü (${A.tur})`);
  return{bilgi,dur};
}
/* kıvrımları dener (an: 'giris' | 'bitis'); akışı değiştiren ilk kıvrımın sonucunu, yoksa yalnız etkisi olanların son bilgisini döndürür */
function kivrimDene(k,m,an){
  let son=null;
  for(const kv of SABLON_KIVRIMLARI[m.sablon.ad]||[]){
    if(kv.an!==an||!kv.asamalar.includes(m.sablon.asama))continue;
    if(!kv.tekrar&&m.sablon.kivrim.includes(kv.ad))continue;
    if(!kv.kosul(k,m))continue;
    if(kadroRastgele(k.dunyaTohumu,'kivrim:'+m.id+':'+kv.ad+':'+m.sablon.adim)()>=kv.olasilik(k,m))continue;
    m.sablon.kivrim.push(kv.ad);
    const r=kv.uygula(k,m)||{};
    if(r.asama)return r;
    if(r.bilgi||r.dur)son=Object.assign(son||{},r);
  }
  return son;
}
/* dosyanın bekleyen işlerini kaldırır (akış dışarıdan değişince: uykudan uyanma, dönem kapanması) */
function sablonIsleriIptal(k,id,neden){for(const x of meseleIsleri(k,id))isIptal(k,x.id,neden||'Dosyanın aşaması değişti');}
/* kanca: uykudaki dosyalardan koşulu tutanları uyandırır (bağlı sınır işi kalkar). Uyanan dosya sayısını döndürür */
function sablonKancasi(k,kanca){
  let n=0;
  for(const m of Object.values(k.meseleler||{})){
    if(m.durum==='kapandi'||!m.sablon)continue;
    const A=sablonAsama(m);if(!A||A.tur!=='uyku'||A.kanca!==kanca||!A.kosul(k,m))continue;
    sablonIsleriIptal(k,m.id,'Dosya uyandı');sablonIlerle(k,m.id,A.sonra);n++;
  }
  if(n)meseleDegerlendir(k);
  return n;
}
if(typeof AY_BASI_EKLERI!=='undefined')AY_BASI_EKLERI.push(k=>{sablonKancasi(k,'ayBasi');return null;});
if(typeof MAC_SONUCU_EKLERI!=='undefined')MAC_SONUCU_EKLERI.push((k,f)=>{if(!hazirlikMi(f))sablonKancasi(k,'macSonucu');});

/* ---- kart aşaması: tek karar türü, aşamaya devreder ---- */
const sablonKartDosyasi=(k,v)=>{const m=(k.meseleler||{})[v.meseleId];return m&&m.sablon&&m.sablon.adim===v.adim?m:null;};
KARAR_TURLERI.sablonKarti={
  denetle:(k,v)=>{const h=[],m=(k.meseleler||{})[v.meseleId];
    if(!m||!m.sablon)h.push('şablonlu dosya bulunamadı');else{const A=sablonAsama(m);if(!A||A.tur!=='kart')h.push(`dosyanın aşaması kart değil (${m.sablon.asama})`);}
    if(!Number.isInteger(v.adim)||v.adim<1)h.push('aşama adımı yok');if(!KART_SINIFLARI[v.sinif])h.push(`bilinmeyen kart sınıfı (${v.sinif})`);return h;},
  secenekler:(k,is)=>{const m=sablonKartDosyasi(k,is.veri);return m?sablonAsama(m).secenekler(k,m,is):[];},
  uygula:(k,is,secim)=>{const m=sablonKartDosyasi(k,is.veri);if(!m)return{bilgi:null};
    const r=sablonAsama(m).uygula(k,m,secim,is)||{};if(!r.asama)throw new Error(`Şablon ${m.sablon.ad}: kart sonraki aşamayı vermedi`);
    const s=sablonIlerle(k,m.id,r.asama,r.p);return{bilgi:r.bilgi||s.bilgi||null};},
  zamanAsimi:{
    metin:(k,is)=>{const m=sablonKartDosyasi(k,is.veri);return m?sablonAsama(m).cevapsiz.metin(k,m,is):'';},
    uygula:(k,is)=>{const m=sablonKartDosyasi(k,is.veri);if(!m)return{bilgi:null};
      const r=sablonAsama(m).cevapsiz.uygula(k,m,is)||{};const s=sablonIlerle(k,m.id,r.asama,r.p);return{bilgi:r.bilgi||s.bilgi||null};}},
  baglam:(k,is,secim)=>{const m=sablonKartDosyasi(k,is.veri),A=m&&sablonAsama(m);return A&&A.baglam?A.baglam(k,m,is,secim):null;}
};
/* ---- bekleme, devir ve uyku aşamalarının işi ---- */
GELISMELER.sablonAdim={
  denetle:(k,v)=>{const h=[],m=(k.meseleler||{})[v.meseleId];if(!m||!m.sablon)h.push('şablonlu dosya bulunamadı');if(!Number.isInteger(v.adim)||v.adim<1)h.push('aşama adımı yok');return h;},
  uygula:(k,is)=>{
    const v=is.veri,m=k.meseleler[v.meseleId];
    if(!m||!m.sablon||m.durum==='kapandi'||m.sablon.adim!==v.adim)return{bilgi:null};
    const A=sablonAsama(m);let r;
    if(A.tur==='uyku')r={asama:A.kosul(k,m)?A.sonra:A.kayip};
    else{r=kivrimDene(k,m,'bitis');
      if(!r||!r.asama){let b;
        if(A.tur==='devir'){const sahip=m.sablon.sahip,kalite=devirKalitesi(k,sahip,A.konu,m.id+':'+m.sablon.adim,m.id);
          k.gecmis.push({tur:'devirSonucu',meseleId:m.id,kisiId:sahip,sablon:m.sablon.ad,kalite,tarih:k.tarih,dakika:k.gunIciDakika});   /* AR3-b: sicil */
          b=A.bitince(k,m,kalite);}
        else b=A.bitince(k,m);
        r=Object.assign({},b,{bilgi:b.bilgi||(r&&r.bilgi),dur:b.dur||(r&&r.dur)});}}
    const s=sablonIlerle(k,m.id,r.asama,r.p);
    return{bilgi:r.bilgi||s.bilgi||null,dur:!!(r.dur||s.dur)};
  }
};

/* ---- doğrulama (kariyerDogrula EK_DENETIMLER) ---- */
function sablonDogrula(k,h){
  for(const m of Object.values(k.meseleler||{})){
    if(!m||m.sablon===undefined)continue;
    const s=m.sablon,ad=`Mesele ${m.id} şablonu`,duz=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
    if(!duz(s)){h.push(`${ad}: nesne değil`);continue;}
    const S=SABLONLAR[s.ad];
    if(!S){h.push(`${ad}: bilinmeyen şablon (${s.ad})`);continue;}
    if(!S.asamalar[s.asama])h.push(`${ad}: bilinmeyen aşama (${s.asama})`);
    if(!Number.isInteger(s.adim)||s.adim<1)h.push(`${ad}: adım geçersiz`);
    if(typeof s.kaynak!=='string'||!s.kaynak)h.push(`${ad}: kaynak yok`);
    if(s.sahip!==null&&!(k.kisiler||{})[s.sahip])h.push(`${ad}: sahip kişi bulunamadı (${s.sahip})`);
    if(s.karsi!==null&&!(duz(s.karsi)&&s.karsi.tur==='kulup'&&(k.kulupler||{})[s.karsi.id]))h.push(`${ad}: karşı taraf geçersiz`);
    if(s.son!==null&&!tarihGecerliMi(s.son))h.push(`${ad}: son tarih geçersiz`);
    if(!duz(s.veri))h.push(`${ad}: veri nesne değil`);
    if(s.sonuc!==null&&(typeof s.sonuc!=='string'||!s.sonuc))h.push(`${ad}: sonuç geçersiz`);
    if(!Array.isArray(s.kivrim)||!s.kivrim.every(x=>typeof x==='string'))h.push(`${ad}: kıvrım listesi geçersiz`);
    const A=S.asamalar[s.asama];
    /* 'dustu': son aşamaya varmadan işsiz kalıp kapanan dosya (js/mesele.js meseleDegerlendir; kararın soranı ayrıldı) */
    if(s.sonuc==='dustu'){if(m.durum!=='kapandi')h.push(`${ad}: düşen dosya açık`);}
    else if(A&&(A.tur==='son')!==(s.sonuc!==null))h.push(`${ad}: sonuç ile aşama tutmuyor (${s.asama}, ${s.sonuc})`);
    if(m.durum==='kapandi'&&s.sonuc===null)h.push(`${ad}: dosya kapanmış fakat sonucu yok`);
    for(const x of Object.values(k.isler||{}))if(x.veri&&x.veri.meseleId===m.id&&x.veri.adim!==undefined&&x.veri.adim!==s.adim)h.push(`${ad}: iş ${x.id} eski adımda (${x.veri.adim} ≠ ${s.adim})`);
  }
}
EK_DENETIMLER.push(sablonDogrula);
/* şablon tanımlarının biçimi (araç denetimi; kariyer-deneme): her aşamanın türü, kartın gerekli işlevleri, hedef aşamaların varlığı yazılım sırasında sınanmaz */
function sablonTanimDenetle(ad){
  const S=SABLONLAR[ad],h=[];if(!S)return[`bilinmeyen şablon (${ad})`];
  if(!S.asamalar[S.baslangic])h.push(`başlangıç aşaması yok (${S.baslangic})`);
  for(const [a,A] of Object.entries(S.asamalar)){
    if(!SABLON_ASAMA_TURLERI.includes(A.tur)){h.push(`${a}: bilinmeyen tür (${A.tur})`);continue;}
    const gerek={kart:['baslik','aciklama','son','secenekler','uygula'],bekleme:['an','bitince'],devir:['kisi','an','bitince'],uyku:['kosul','an'],son:['sonuc']}[A.tur];
    for(const f of gerek)if(typeof A[f]!=='function')h.push(`${a}: ${f} işlevi yok`);
    if(A.tur==='kart'){if(!KART_SINIFLARI[A.sinif])h.push(`${a}: kart sınıfı yok`);if(!A.cevapsiz||typeof A.cevapsiz.metin!=='function'||typeof A.cevapsiz.uygula!=='function')h.push(`${a}: cevapsız davranışı yok`);}
    if(A.tur==='devir'&&typeof A.konu!=='string')h.push(`${a}: devrin konusu yok`);
    if(A.tur==='uyku'){if(!S.asamalar[A.sonra]||!S.asamalar[A.kayip])h.push(`${a}: uykunun hedef aşamaları yok`);if(A.kanca!==undefined&&!SABLON_KANCALARI.includes(A.kanca))h.push(`${a}: bilinmeyen kanca (${A.kanca})`);}
  }
  return h;
}
/* ---- AR3-b: sahiplik (devret, devral) ---- */
function sablonSahiplik(k,m){
  const S=m&&m.sablon?SABLONLAR[m.sablon.ad]:null,H=S&&S.sahiplik,R={sahip:m&&m.sablon?m.sablon.sahip:null,kisiId:null,devret:false,devral:false,engel:null};
  if(!H||!m.sablon||m.durum==='kapandi'||m.sablon.sonuc!==null)return R;
  const id=H.kisi(k,m);R.kisiId=id&&(k.kisiler||{})[id]&&k.kisiler[id].durum==='aktif'?id:null;
  const a=m.sablon.asama;
  R.devral=!!H.devral&&H.devral.asamalar.includes(a)&&R.sahip!==null;
  R.devret=!!H.devret&&H.devret.asamalar.includes(a)&&R.sahip===null&&!!R.kisiId;
  if(H.devret&&H.devret.asamalar.includes(a)&&!R.kisiId)R.engel='Devredecek kimse yok';
  if((R.devret||R.devral)&&typeof sahneAcik==='function'&&sahneAcik(k))R.engel='Önce görüşmeyi bitir';
  return R;
}
function sablonSahiplikDegis(k,meseleId,olay){
  const m=(k.meseleler||{})[meseleId];if(!m||!m.sablon)throw new Error(`Şablonlu dosya bulunamadı: ${meseleId}`);
  const H=SABLONLAR[m.sablon.ad].sahiplik,R=sablonSahiplik(k,m);
  if(R.engel)throw new Error(R.engel);
  if(olay==='devret'&&!R.devret)throw new Error('Bu aşamada devredilemez');
  if(olay==='devral'&&!R.devral)throw new Error('Bu aşamada devralınamaz');
  const kisiId=olay==='devret'?R.kisiId:R.sahip;
  sablonIsleriIptal(k,m.id,olay==='devret'?'İş devredildi':'İş devralındı');
  k.gecmis.push({tur:'sahiplik',olay,meseleId:m.id,kisiId,sablon:m.sablon.ad,tarih:k.tarih,dakika:k.gunIciDakika});
  const mi=typeof metinSec==='function'?metinSec(k,olay+'.tepki',{kisiId,anahtar:m.id,devral:aniSayisi(k,'devral',kisiId)}):null;
  if(olay==='devral'&&typeof aniEkle==='function')aniEkle(k,'devral',{kisiId,p:{meseleId:m.id}});
  meseleOlay(k,m.id,'sahip.'+olay,{kisiId,metin:mi});
  if(olay==='devral')m.sablon.sahip=null;
  const s=sablonIlerle(k,m.id,H[olay].hedef);
  meseleDegerlendir(k);
  return{bilgi:s.bilgi||null};
}
const sablonDevret=(k,meseleId)=>sablonSahiplikDegis(k,meseleId,'devret');
const sablonDevral=(k,meseleId)=>sablonSahiplikDegis(k,meseleId,'devral');
/* sicil (saf): kişinin yürüttüğü devirlerin sonuçları ve elinden alınan işler */
function kisiSicili(k,kisiId){
  const G=k.gecmis||[],D=G.filter(g=>g.tur==='devirSonucu'&&g.kisiId===kisiId),say=q=>D.filter(g=>g.kalite===q).length;
  const R={is:D.length,iyi:say('iyi'),vasat:say('vasat'),kotu:say('kotu'),devralinan:G.filter(g=>g.tur==='sahiplik'&&g.olay==='devral'&&g.kisiId===kisiId).length};
  R.satir=!R.is&&!R.devralinan?'Henüz ona iş vermedin.':[R.is?`${R.is} iş`:'',R.iyi?`${R.iyi}'${R.iyi===1?'i':'si'} istediğin gibi`:'',R.vasat?`${R.vasat}'${R.vasat===1?'i':'si'} pahalı ya da eksik`:'',
    R.kotu?`${R.kotu}'${R.kotu===1?'i':'si'} kaçtı`:'',R.devralinan?`${R.devralinan} işi elinden aldın`:''].filter(Boolean).join(' · ');
  return R;
}
Object.assign(MESELE_OLAYLARI,{
  'sahip.devret':(k,p)=>`Dosyayı ${kisiAdi(k,p.kisiId)}'e devrettin.`,
  'sahip.devral':(k,p)=>`Dosyayı ${kisiAdi(k,p.kisiId)}'den devraldın; bundan sonra sen yürütüyorsun.`});
MESAJ_GONDEREN['sahip.devret']=pKisi('kisiId');MESAJ_GONDEREN['sahip.devral']=pKisi('kisiId');
MESAJ_METIN['sahip.devret']=(k,p)=>(typeof metinYaz==='function'&&p.metin?metinYaz(k,'devret.tepki',p.metin,p):'')||'Peki başkanım, ilgileniyorum.';
MESAJ_METIN['sahip.devral']=(k,p)=>(typeof metinYaz==='function'&&p.metin?metinYaz(k,'devral.tepki',p.metin,p):'')||'Peki başkanım; rakamlar dosyada.';

/* ---- aşama satırı (R4-k; okuma, saf): şablon asamaMetni / sonucMetni tanımlar (yoksa aşamanın adı) ---- */
/* sablonAsamaSatiri(k, m) → {metin, son} | null — şablonlu konunun üstündeki tek satır (aşama ya da sonuç; sayı ve gizli değer yok) */
function sablonAsamaSatiri(k,m){
  if(!m||!m.sablon||!SABLONLAR[m.sablon.ad])return null;
  const S=SABLONLAR[m.sablon.ad],s=m.sablon;
  if(s.sonuc!==null)return{metin:(S.sonucMetni||{})[s.sonuc]||s.sonuc,son:true};
  return{metin:(S.asamaMetni||{})[s.asama]||s.asama,son:false};
}
