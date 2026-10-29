/* ============ Chairman — sözleşmeler ve maaşlar (çizim yok; G2-a, 2026-10-24; YOL_HARITASI 4.1, karar 44) ============
   Oyuncu sözleşmesi oyuncu kaydındadır (k.oyuncular, paylaşılan alan; kopyala-yaz): sozlesme = null | {maas, bitis}
     maas: aylık brüt maaş (kuruş, tamsayı); bitis: sözleşmenin son günü (sezon sonu 31 Mayıs). null: sözleşmesi henüz kurulmamış (kayıt sürümü 8'den
     geçen kariyer ilk ay başına dek; serbest oyuncu). Hocanın sözleşmesi kişi kaydında: kisi.sozlesme {maas, bitis} (rol teknikDirektor).
   TEST ölçeği (Claude, karar 44; kullanıcı değiştirir — kesin para tutarları oynanış testi ister, OYUN_TASARIMI §13):
     maasTahmini(p, tarih): oyuncunun piyasadaki algısından (R6-a: gizli özellik ortalaması — kalecide kalecilik ağırlıklı — + kalıcı algı sapması + ün) SOZLESME_TEST.taban × kat (0,4–3), 21 yaş altı × genç,
       32 üstü × yaşlı; SOZLESME_TEST.yuvarla'ya yuvarlanır. Gizli puan kuralı: maaş görünür bir sayıdır, yetenek puanı değildir (OYUN_TASARIMI §9:
       ücret gösterilebilir); ölçek kabadır, oyuncunun gücünü tam ele vermez.
     Bitiş: oyuncu kimliği ve dünya tohumundan, SOZLESME_TEST.bitisPay ile bu sezon sonu, bir ya da iki yıl sonrası.
   sozlesmeleriTamamla(k): sözleşmesi olmayan her kulüplü oyuncuya ve etkin her hocaya TEST sözleşme (idempotent; yeni kariyerde, her ay başında, transfer
     gelişmelerinde; sezon sonu kaydından sonra en az bir yıl).
   aylikMaas(k, kulüp, tahmin): kulübün oyuncularının ve hocasının aylık maaşı; sözleşmesi olmayan sayılmaz, tahmin true ise ilk ay başında kurulacak
     TEST maaşıyla sayılır (sürüm 8'den geçen kariyerin nakit ufku; G2 incelemesi). hocaMaasi(h): hocanın TEST maaşı.
   hocaTazminati(k, hocaId): kalan ay × aylık maaş (en az bir ay; js/icerik-p12.js değişim).
   Doğrulama sozlesmeDogrula (EK_DENETIMLER). Sezon sonunda biten sözleşmeler: sözleşme kartları (G2-c, bu dosyanın sonu). */
'use strict';
const SOZLESME_TEST={taban:1600000,yuvarla:50000,genc:0.6,yasli:0.85,hocaMaas:6000000,bitisPay:[[0,25],[1,40],[2,35]],algi:8,un:6};
/* R6-a (2026-10-30): maaş piyasanın ALGISINDAN türer — gizli ortalama + oyuncuya özgü kalıcı algı sapması (kimlik karmasından, ±SOZLESME_TEST.algi puan;
   rastlantı akışı çekmez) + ün (eski yıldız +SOZLESME_TEST.un). Maaş yeteneğin kaba göstergesidir, sırası değildir (“pahalı ama vasat”, “ucuz ama iyi”);
   gerçek yetenek gözlemle, izlemeyle ve hocanın görüşüyle ayrılır. Kayıtlı sözleşmeler değişmez */
function maasAlgiSapmasi(p){let h=2166136261;const s=String(p.id)+':maas';for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
  return((h>>>0)/4294967295*2-1)*SOZLESME_TEST.algi;}
const SOZLESME_AY_GUN='-05-31';
/* tarihteki yaş (tam yıl) */
function oyuncuYasi(p,tarih){
  const [y,a,g]=p.dogumTarihi.split('-').map(Number),[Y,A,G]=tarih.split('-').map(Number);
  return Y-y-((A<a||(A===a&&G<g))?1:0);
}
function maasTahmini(p,tarih){
  const o=p.oz,saha=o.filter((_,j)=>j!==8),gercek=p.mevki==='KL'?o[8]*0.6+saha.reduce((a,b)=>a+b,0)/saha.length*0.4:saha.reduce((a,b)=>a+b,0)/saha.length;
  const ort=gercek+maasAlgiSapmasi(p)+(p.un?SOZLESME_TEST.un:0);   /* R6-a: algı */
  const T=SOZLESME_TEST,yas=oyuncuYasi(p,tarih);
  let m=T.taban*clamp(0.4+(ort-35)/25,0.4,3);
  if(yas<21)m*=T.genc;else if(yas>32)m*=T.yasli;
  return Math.max(T.yuvarla,Math.round(m/T.yuvarla)*T.yuvarla);
}
/* sezonun bitiş yılı (k.sezon.id '2026-27' → 2027) */
const sezonBitisYili=k=>Number(k.sezon.id.slice(0,4))+1;
const sozlesmeBitisi=(k,yil)=>`${sezonBitisYili(k)+yil}${SOZLESME_AY_GUN}`;
function sozlesmeleriTamamla(k){
  const yeni={};
  for(const p of Object.values(k.oyuncular)){
    if(!p||p.kulupId===null||p.sozlesme)continue;
    const r=kadroRastgele(k.dunyaTohumu,p.id+':sozlesme'),y0=agirlikliSec(r,SOZLESME_TEST.bitisPay);
    /* sezon sonu kaydından sonra kurulan sözleşme bu sezon sonunda bitmez (G2 incelemesi: kartlar geçmişken kurulan sözleşme hiç sorulmazdı — sezon
       sonunda kadroya giren genç, sürüm 8'den Mart'ta geçen kayıt) */
    const yil=k.sezon&&k.sezon.sonuc&&y0===0?1:y0;
    yeni[p.id]=Object.assign({},p,{sozlesme:{maas:maasTahmini(p,k.tarih),bitis:sozlesmeBitisi(k,yil)}});
  }
  if(Object.keys(yeni).length)k.oyuncular=Object.assign({},k.oyuncular,yeni);
  for(const h of Object.values(k.kisiler))if(h&&h.rol==='teknikDirektor'&&h.durum==='aktif'&&h.hoca&&!h.sozlesme)
    h.sozlesme={maas:hocaMaasi(h),bitis:sozlesmeBitisi(k,1)};
  return Object.keys(yeni).length;
}
const hocaMaasi=h=>Math.round(SOZLESME_TEST.hocaMaas*(0.8+0.4*h.hoca.bilgi)/SOZLESME_TEST.yuvarla)*SOZLESME_TEST.yuvarla;
function aylikMaas(k,kulupId,tahmin){
  let t=0;for(const p of kulupOyunculari(k,kulupId))if(p.sozlesme)t+=p.sozlesme.maas;else if(tahmin)t+=maasTahmini(p,k.tarih);
  const h=kulupHocasi(k,kulupId);if(h&&h.sozlesme)t+=h.sozlesme.maas;else if(h&&tahmin)t+=hocaMaasi(h);
  return t;
}
/* kalan ay (bugünden bitişe; başlamış ay sayılır) × maaş, en az bir ay */
function hocaTazminati(k,hocaId){
  const h=k.kisiler[hocaId],S=h&&h.sozlesme;if(!S)return 0;
  const [y,a]=k.tarih.split('-').map(Number),[Y,A]=S.bitis.split('-').map(Number),ay=Math.max(1,(Y-y)*12+(A-a)+1);
  return ay*S.maas;
}
function sozlesmeDogrula(k,h){
  const iyi=s=>s===undefined||s===null||(!!s&&typeof s==='object'&&Number.isInteger(s.maas)&&s.maas>0&&s.maas<=1e9&&tarihGecerliMi(s.bitis));
  for(const p of Object.values(k.oyuncular||{}))if(p&&!iyi(p.sozlesme))h.push(`Oyuncu ${p.id}: sözleşme geçersiz`);
  for(const p of Object.values(k.kisiler||{}))if(p&&p.sozlesme!==undefined&&(p.rol!=='teknikDirektor'||!iyi(p.sozlesme)))h.push(`Kişi ${p.id}: sözleşme geçersiz`);
}
EK_DENETIMLER.push(sozlesmeDogrula);

/* ---- G2-c: sezon sonunda biten sözleşmeler (js/fikstur.js SEZON_SONU_EKLERI) ----
   Bitişi bu sezon sonu olan oyuncular: bizim kulüpte sıralı iki cevaplı kart [Yenile (iki yıl, maaş en az eskisi ve tahmini, ×1,1) / Bırak]; acil değil,
   son cevap 7 gün sonra 18:00; cevapsız kalırsa imza yoktur, oyuncu ayrılır. Bırakılan oyuncu serbest kalır (js/transfer.js oyuncuSerbestBirak),
   kadro gençle 22'ye tamamlanır. Öbür kulüplerin oyuncuları ve bütün hocalar kendiliğinden bir yıl uzatır (TEST). */
Object.assign(MESELE_OLAYLARI,{
  'sz.bitiyor':(k,p)=>`${p.n} oyuncunun sözleşmesi ${gunAyYazi(p.bitis)} bitiyor; her biri için yenile ya da bırak.`,
  'sz.yenile':(k,p)=>`${(k.oyuncular[p.oyuncuId]||{}).ad} ile yeni sözleşme: bitiş ${gunAyYazi(p.bitis)} ${p.bitis.slice(0,4)}, aylık ${paraYazi(p.maas)}.`,
  'sz.birak':(k,p)=>`${(k.oyuncular[p.oyuncuId]||{}).ad} ile yollar ayrıldı; serbest kaldı.`,
  'sz.cevapsiz':(k,p)=>`Cevap verilmedi; ${(k.oyuncular[p.oyuncuId]||{}).ad} sözleşmesi yenilenmeden ayrıldı.`
});
MESELE_KATEGORILERI.sozlesme=['Sözleşme','S'];
const yeniSozlesmeMaasi=(k,p)=>Math.round(Math.max(p.sozlesme.maas,maasTahmini(p,k.tarih))*1.1/SOZLESME_TEST.yuvarla)*SOZLESME_TEST.yuvarla;
function sozlesmeKartiKur(k,v){
  const id=v.sira[0];if(!id)return null;const p=k.oyuncular[id];
  return isEkle(k,{tur:'ajanda',tarih:tarihEkle(k.tarih,7),dakika:1080,veri:{baslik:`Sözleşme: ${p.ad}`,zorunluluk:'zorunlu',sure:0,saatsiz:true,bekleyebilir:true,
    gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'sozlesmeYenile',meseleId:v.meseleId,kulupId:v.kulupId,oyuncuId:id,sira:v.sira.slice(1),
    aciklama:`${p.ad}: aylık ${paraYazi(p.sozlesme.maas)}; sözleşmesi ${gunAyYazi(p.sozlesme.bitis)} bitiyor.`}});
}
function sozlesmeAyril(k,v){oyuncuSerbestBirak(k,v.oyuncuId);kadroTamamla(k,v.kulupId,KADRO_HEDEF,'serbest:'+v.oyuncuId);sozlesmeleriTamamla(k);}
SEZON_SONU_EKLERI.push(k=>{
  const biz=(k.kisiler[k.baskanId]||{}).kulupId,son=sozlesmeBitisi(k,0),uzat={};
  for(const p of Object.values(k.oyuncular))if(p.kulupId&&p.kulupId!==biz&&p.sozlesme&&p.sozlesme.bitis<=son)uzat[p.id]=Object.assign({},p,{sozlesme:{maas:p.sozlesme.maas,bitis:sozlesmeBitisi(k,1)}});
  if(Object.keys(uzat).length)k.oyuncular=Object.assign({},k.oyuncular,uzat);
  for(const h of Object.values(k.kisiler))if(h.rol==='teknikDirektor'&&h.durum==='aktif'&&h.sozlesme&&h.sozlesme.bitis<=son)h.sozlesme={maas:h.sozlesme.maas,bitis:sozlesmeBitisi(k,1)};
  if(!biz)return;
  const L=kulupOyunculari(k,biz).filter(p=>p.sozlesme&&p.sozlesme.bitis<=son).sort((a,b)=>a.no-b.no).map(p=>p.id);
  if(!L.length)return;
  const id=meseleAc(k,{tur:'sozlesme',baslik:'Sözleşmesi biten oyuncular',sorumluId:k.baskanId,kisiler:[]});
  meseleOlay(k,id,'sz.bitiyor',{n:L.length,bitis:son});
  sozlesmeKartiKur(k,{kulupId:biz,meseleId:id,sira:L});
});
KARAR_TURLERI.sozlesmeYenile={
  denetle:(k,v)=>{const h=[],p=(k.oyuncular||{})[v.oyuncuId];if(!p)h.push('oyuncu bulunamadı');if(!Array.isArray(v.sira)||!v.sira.every(x=>typeof x==='string'))h.push('sıra geçersiz');
    if(typeof v.meseleId!=='string')h.push('mesele yok');return h;},
  secenekler:(k,is)=>{const v=is.veri,p=k.oyuncular[v.oyuncuId],ok=p&&p.kulupId===v.kulupId&&p.sozlesme;
    return[{id:'yenile',metin:'Yenile',sure:15,engel:ok?null:'Oyuncu artık kulüpte değil',aciklama:ok?[`İki yıl; aylık ${paraYazi(yeniSozlesmeMaasi(k,p))}.`]:[]},
      {id:'birak',metin:'Bırak',sure:0,aciklama:[`${p?p.ad:''} serbest kalır; kadro gençle tamamlanır.`]}];},
  uygula:(k,is,secim)=>{
    const v=is.veri,p=k.oyuncular[v.oyuncuId];let bilgi;
    if(secim==='yenile'){const maas=yeniSozlesmeMaasi(k,p),bitis=sozlesmeBitisi(k,2);
      k.oyuncular=Object.assign({},k.oyuncular,{[p.id]:Object.assign({},p,{sozlesme:{maas,bitis}})});bilgi=meseleOlay(k,v.meseleId,'sz.yenile',{oyuncuId:p.id,maas,bitis});}
    else{if(p.kulupId===v.kulupId)sozlesmeAyril(k,v);bilgi=meseleOlay(k,v.meseleId,'sz.birak',{oyuncuId:v.oyuncuId});}
    sozlesmeKartiKur(k,v);
    return{bilgi};
  },
  zamanAsimi:{metin:(k,is)=>`Cevap vermezsen ${(k.oyuncular[is.veri.oyuncuId]||{}).ad} sözleşmesi yenilenmeden ayrılır.`,
    uygula:(k,is)=>{const v=is.veri,p=k.oyuncular[v.oyuncuId];if(p&&p.kulupId===v.kulupId)sozlesmeAyril(k,v);const bilgi=meseleOlay(k,v.meseleId,'sz.cevapsiz',{oyuncuId:v.oyuncuId});
      sozlesmeKartiKur(k,v);return{bilgi};}}
};
/* U3 bağlam (okuma): sözleşme kararında oyuncunun künyesi */
if(KARAR_TURLERI.sozlesmeYenile)KARAR_TURLERI.sozlesmeYenile.baglam=(k,is)=>({tur:'oyuncu',oyuncuId:is.veri.oyuncuId});
