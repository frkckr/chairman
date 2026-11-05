/* ============ Chairman — metin altyapısı: huylar, anılar, metin seçici (kural; çizim yok; AR3-a, 2026-11-05; karar 95) ============
   OYUN_TASARIMI §10 “Mizahın altyapısı” ve §6 “Ekibi tanımak”. Mizah ve kişilerin sesi araya serpiştirilir; tam bir kütüphane baştan yazılmaz:
   sistemde yeri açılır, birkaç örnekle başlanır, senaryolarla büyür (hedef ufuk: 20 sezonluk kariyerde tekrar etmemek).
     Huy: kişinin iki-üç belirgin özelliği. Kişi kaydında isteğe bağlı p.huylar (içerik ileride yazar) yoksa TEST taslağı rolden (KISI_HUY_TEST; yalnız
       kulübün çalışanları). Mekanik etkisi küçük ve TEST'tir (HUYLAR[huy].devir: devrin kalitesine ve süresine; js/sablon.js okur); çoğu yalnız metindir.
     Anı: hatırlanan olay — geçmiş satırı {tur:'ani', anahtar, kisiId?, p, tarih, dakika}. Sonradan geri dönen şakanın ve kişinin hafızasının tohumu;
       anıSayisi ile dönüşler tırmanır (aynı cümle değil, bir üst perdesi). aniEkle komuttur.
     Metin seçici: METIN_YUVALARI[yuva] = [{id, oz?, kosul?(k, b), tekrar?, metin(k, b)}]. oz özgüllüktür (0 genel cümle; kişi, huy, olay arttıkça yüksek).
       metinSec(k, yuva, b) (komut içinde) en özel uyan ve bu kariyerde kullanılmamış metni seçer; tekrar:true metin (sade iş cümlesi) her zaman
       kullanılabilir; uygun metin yoksa null döner — oyun susar (sessizlik tekrardan iyidir). Seçim belirlenimcidir (dünya tohumu + yuva + b.anahtar;
       kariyerin rastlantısı çekilmez). Kullanılan metin k.metinKullanilan'a ('yuva/id') yazılır (isteğe bağlı; kayıt sürümü 13 içinde).
       Seçilen kimlik olayın p'sine yazılır; metin okuma anında metinYaz(k, yuva, id, b) ile kurulur (metin kayda girmez, TEKNIK_PLAN §7).
       METIN_OLCU (yalnız araç): yuva başına istek, seçilen, genele düşen ve susan sayısı — içerik borcunun ölçüsü (AR3-f; BORCLAR İB6).
   Metinler TEST taslağıdır; kullanıcı değiştirir. Oyuncuyla dalga geçen, güncel olaya yaslanan ya da kelime değiştirerek çoğaltılan şaka yazılmaz
   (OLAY_KUTUPHANESI §9, karar 95 soruları). */
'use strict';
const METIN_TEST={kullanilanEnCok:2000};
/* huylar (TEST taslağı; kullanıcı değiştirir). devir: {kalite: yeteneğe eklenen pay, gun: devrin süresine eklenen gün, kus: devralınınca küsme süresi (gün)} */
const HUYLAR={
  kuruscu:{ad:'Kuruşu kuruşuna',aciklama:'Rakamda titizdir; pahalı anlaşmaz ama karşı tarafı da yorar.',devir:{kalite:0.12}},
  yemekci:{ad:'Yemeğe düşkün',aciklama:'Görüşmeler sofrada uzar; imza çoğu zaman bir gün kayar.',devir:{gun:1}},
  gururlu:{ad:'Gururlu',aciklama:'İşi elinden alınırsa bozulur; bir süre ağırdan alır.',devir:{kus:10}},
  rakamci:{ad:'Rakamcı',aciklama:'Her şeyi koşu verisiyle söyler.'},
  agziGevsek:{ad:'Ağzı gevşek',aciklama:'Duyduğu soyunma odasına gider.'},
  eskiUsul:{ad:'Eski usul',aciklama:'“Kadroyu ben bilirim.” Karışılmasından hoşlanmaz.'},
  batil:{ad:'Batıl inançlı',aciklama:'Salı imza atılmaz; aynı ceketle maça çıkar.'}
};
const KISI_HUY_TEST={maliMudur:['kuruscu','yemekci','gururlu'],yardimciAntrenor:['rakamci','agziGevsek'],teknikDirektor:['eskiUsul','batil']};
function kisiHuylari(k,kisiId){
  const p=(k.kisiler||{})[kisiId];if(!p)return[];
  if(Array.isArray(p.huylar))return p.huylar.filter(h=>HUYLAR[h]);
  const biz=(k.kisiler[k.baskanId]||{}).kulupId;
  return biz&&p.kulupId===biz&&p.durum==='aktif'&&KISI_HUY_TEST[p.rol]?KISI_HUY_TEST[p.rol].slice():[];
}
const kisiHuyu=(k,kisiId,huy)=>kisiHuylari(k,kisiId).includes(huy);
/* kişinin huylarından devrin etkisi (toplam; TEST) */
function huyDevirEtkisi(k,kisiId){
  const E={kalite:0,gun:0,kus:0};
  for(const h of kisiHuylari(k,kisiId)){const d=HUYLAR[h].devir;if(!d)continue;E.kalite+=d.kalite||0;E.gun+=d.gun||0;E.kus=Math.max(E.kus,d.kus||0);}
  return E;
}

/* ---- anılar ---- */
function aniEkle(k,anahtar,o){
  const g={tur:'ani',anahtar:String(anahtar),tarih:k.tarih,dakika:k.gunIciDakika};
  if(o&&o.kisiId)g.kisiId=o.kisiId;if(o&&o.p)g.p=JSON.parse(JSON.stringify(o.p));
  k.gecmis.push(g);return g;
}
const anilar=(k,anahtar,kisiId)=>(k.gecmis||[]).filter(g=>g.tur==='ani'&&g.anahtar===anahtar&&(!kisiId||g.kisiId===kisiId));
const aniSayisi=(k,anahtar,kisiId)=>anilar(k,anahtar,kisiId).length;

/* ---- metin seçici ---- */
const METIN_YUVALARI={};
const METIN_OLCU={};
const metinKullanildiMi=(k,yuva,id)=>Array.isArray(k.metinKullanilan)&&k.metinKullanilan.includes(yuva+'/'+id);
/* uygun adaylar (saf): koşulu tutan ve (tekrar değilse) kullanılmamış metinler içinde en yüksek özgüllük grubu */
function metinAdaylari(k,yuva,b){
  const L=(METIN_YUVALARI[yuva]||[]).filter(x=>(!x.kosul||x.kosul(k,b||{}))&&(x.tekrar||!metinKullanildiMi(k,yuva,x.id)));
  if(!L.length)return[];
  const en=Math.max(...L.map(x=>x.oz|0));
  return L.filter(x=>(x.oz|0)===en);
}
/* seçim (komut içinde): kimlik ya da null; kullanılanı işaretler */
function metinSec(k,yuva,b){
  const O=METIN_OLCU[yuva]=METIN_OLCU[yuva]||{istek:0,secilen:0,genel:0,sus:0};O.istek++;
  const A=metinAdaylari(k,yuva,b);
  if(!A.length){O.sus++;return null;}
  const r=kadroRastgele(k.dunyaTohumu,'metin:'+yuva+':'+((b&&b.anahtar)||'')+':'+(Array.isArray(k.metinKullanilan)?k.metinKullanilan.length:0))();
  const x=A[Math.floor(r*A.length)%A.length];
  O.secilen++;if(!(x.oz|0))O.genel++;
  if(!x.tekrar){const L=Array.isArray(k.metinKullanilan)?k.metinKullanilan:[];k.metinKullanilan=L.concat([yuva+'/'+x.id]).slice(-METIN_TEST.kullanilanEnCok);}
  return x.id;
}
/* okuma: seçilmiş kimliğin metni (yoksa boş) */
function metinYaz(k,yuva,id,b){const x=(METIN_YUVALARI[yuva]||[]).find(y=>y.id===id);return x?String(x.metin(k,b||{})||''):'';}
/* yuva tanımının biçimi (araç denetimi): kimlikler tekil, metin işlevi var, en az bir genel ya da tekrar eden metin */
function metinYuvasiDenetle(yuva){
  const L=METIN_YUVALARI[yuva],h=[];if(!Array.isArray(L)||!L.length)return[`boş yuva (${yuva})`];
  const I=new Set();for(const x of L){if(typeof x.id!=='string'||I.has(x.id))h.push(`${yuva}: kimlik tekil değil (${x.id})`);I.add(x.id);if(typeof x.metin!=='function')h.push(`${yuva}/${x.id}: metin işlevi yok`);}
  return h;
}
function metinDogrula(k,h){
  const L=k.metinKullanilan;if(L===undefined||L===null)return;
  if(!Array.isArray(L)||L.length>METIN_TEST.kullanilanEnCok||L.some(x=>typeof x!=='string'||!/^[^/]+\/[^/]+$/.test(x)))h.push('Kullanılan metinler (metinKullanilan) geçersiz');
  for(const g of k.gecmis||[])if(g.tur==='ani'&&(typeof g.anahtar!=='string'||!g.anahtar||!tarihGecerliMi(g.tarih))){h.push('Anı kaydı geçersiz');break;}
}
EK_DENETIMLER.push(metinDogrula);

/* ---- örnek yuvalar (TEST taslağı; birkaç örnekle başlanır, senaryolarla büyür — BORCLAR İB2, İB6). b: {kisiId, kalite?, devral?, bitis?} ---- */
const mtHuy=h=>(k,b)=>kisiHuyu(k,b.kisiId,h);
Object.assign(METIN_YUVALARI,{
  /* devredilen işin raporu (iyi ya da vasat sonuç): anlatım kişinin sesiyle */
  'devir.rapor':[
    {id:'kurus.iyi',oz:2,kosul:(k,b)=>b.kalite==='iyi'&&kisiHuyu(k,b.kisiId,'kuruscu'),metin:()=>'Üç kez kalkıp gittim, dördüncüde oturdular.'},
    {id:'kurus.vasat',oz:2,kosul:(k,b)=>b.kalite==='vasat'&&kisiHuyu(k,b.kisiId,'kuruscu'),metin:()=>'Bir kuruş daha inmediler; ben de yoruldum, onlar da.'},
    {id:'yemek.1',oz:2,kosul:mtHuy('yemekci'),metin:()=>'Kebapçıda anlaştık; tatlıyı onlar ısmarladı.'},
    {id:'yemek.2',oz:2,kosul:mtHuy('yemekci'),metin:()=>'İki porsiyon beyti sonra el sıkıştık.'},
    {id:'iyi.1',oz:1,kosul:(k,b)=>b.kalite==='iyi',metin:()=>'İlk rakamı duyunca güldüler, sonra masaya oturdular.'},
    {id:'vasat.1',oz:1,kosul:(k,b)=>b.kalite==='vasat',metin:()=>'İstediğimiz rakam olmadı ama fazla da açılmadık.'},
    {id:'genel',oz:0,tekrar:true,metin:()=>''}],
  /* devredilen iş kaçtı */
  'devir.kotu':[
    {id:'kurus.1',oz:2,kosul:mtHuy('kuruscu'),metin:()=>'Elli bin için kalktım, onlar da kalktı. Bence yine ararlar.'},
    {id:'yemek.1',oz:2,kosul:mtHuy('yemekci'),metin:()=>'Yemek güzeldi, anlaşma olmadı.'},
    {id:'genel',oz:0,tekrar:true,metin:()=>''}],
  /* başkan işi devredince kişinin cevabı */
  'devret.tepki':[
    {id:'yemek.1',oz:2,kosul:mtHuy('yemekci'),metin:()=>'Hallederim başkanım. Onları yemeğe davet ederim, orada konuşuruz.'},
    {id:'kurus.1',oz:2,kosul:mtHuy('kuruscu'),metin:()=>'Bana bırakın; pahalıya almayız.'},
    {id:'genel',oz:0,tekrar:true,metin:()=>'Peki başkanım, ilgileniyorum.'}],
  /* başkan işi elinden alınca (devral, kaçıncı kez) */
  'devral.tepki':[
    {id:'gurur.2',oz:3,kosul:(k,b)=>kisiHuyu(k,b.kisiId,'gururlu')&&(b.devral|0)>=1,metin:()=>'Yine mi başkanım? Peki. Siz bilirsiniz.'},
    {id:'gurur.1',oz:2,kosul:mtHuy('gururlu'),metin:()=>'Siz bilirsiniz başkanım. Dosya sizde.'},
    {id:'genel',oz:0,tekrar:true,metin:()=>'Peki başkanım; rakamlar dosyada.'}],
  /* “İşler nasıl gidiyor?” cevabında dosya başına cümle */
  'devir.ara':[
    {id:'yemek.1',oz:2,kosul:mtHuy('yemekci'),metin:()=>'Yarın öğlen bir yemek var; orada netleşir.'},
    {id:'kurus.1',oz:2,kosul:mtHuy('kuruscu'),metin:()=>'Biraz daha sıkacağım; acele etmeyin.'},
    {id:'genel',oz:0,tekrar:true,metin:()=>''}]
});

