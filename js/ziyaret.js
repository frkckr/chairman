/* ============ Chairman — ziyaret: kabul edilen görüşme kapıya gelir (kural; çizim yok; RK6, 2026-10-31) ============
   Kullanıcı (31 Ekim): “kapının yerini sen belirle; karşımda otursun, gelsin ve kart açılsın; senaryoları sonra yazacağız, altyapıyı kuralım”.
   Telefonda kabul edilen ekip görüşmesi (js/yazisma.js gorusmeOnerisi) deftere düz randevu olarak değil, saatli bir kapı kararı olarak yazılır:
     ziyaret         kapı: saatli, isteğe bağlı karar işi (veri: kisiId, konu, erteleme; sure görüşmenin süresidir, defterde o saatleri kaplar ve
                     çakışmayı gösterir). Saati gelince İlerle orada durur (saatli işin başlangıcı), ekran kapı kartını açar. Kararı yalnız saatinde
                     verilir (önce iki cevap da engelli: ajandaIsiYap zamanı işin başlangıcına getirirdi). Buyursun: kişi kulüpteyse görüşme kartı
                     doğar (zaman almaz). Sonra gelsin: ertesi uygun günün aynı saatine yeni kapı işi (maç günü, hafta içi antrenman ve saatli işlerle
                     çakışan günler atlanır; en çok ZIYARET_TEST.ertelemeEnCok kez; sonra “Bugün olmaz”: görüşme olmaz). Cevapsız geçilirse takvim
                     kaçırıldı yazar; İlerle kilitlenmez.
     ziyaretGorusme  kişi karşıda oturunca açılan kart: konuşmanın kendisi (bugün kişinin takım görüntüsü, js/yazisma.js YAZISMA_METIN) ve iki cevap
                     (TEST: “Sağ ol” / “Sonuç istiyorum”). Cevap görüşmenin süresi kadar zaman alır; geçmişe {tur:'ziyaret', isId, kisiId, konu, cevap,
                     tarih, dakika, p} yazılır (p: görüşme anının takım görüntüsü; oyuncu dosyasına not düşer, js/kadro-dosyasi.js). Mekanik etkisi
                     yoktur: kişinin hafızasını ileride senaryolar okur. Cevapsız geçilirse kaçırıldı.
   Kayda yeni alan yazılmaz (ajanda işinin verisi ve geçmiş satırı); kayıt sürümü değişmez. Eski kayıttaki düz randevu (etki ekipGorusmesi) eskisi gibi
   katılımla çalışır. Metinler TEST (kullanıcı değiştirir).
     ziyaretRandevuVeri(k, kisiId, erteleme) → kapı işinin verisi (js/yazisma.js kabulde ve “Sonra gelsin”de)
     ziyaretSaatinde(k, is) → işin saati şimdi mi (kapı ve görüşme)
     ziyaretKapida(k) → şu an kapıda bekleyen kapı işi (saati şimdi, kişi kulüpte) ya da null
     ziyaretGorusmede(k) → şu an karşıda oturan kişinin görüşme işi ya da null
     ziyaretSonrakiAn(k, is) → “Sonra gelsin”in anı {tarih, dakika} ya da null */
'use strict';
const ZIYARET_TEST={ertelemeEnCok:2,gunEnCok:10};
/* saatin bulunma eki okunuşa göre (11:00'de “on birde”, 10:55'te “elli beşte”, 08:30'da “otuzda”, 17:40'ta “kırkta”) */
const ZIYARET_EK_BIRLER=['da','de','de','te','te','te','da','de','de','da'],ZIYARET_EK_ONLAR={0:'da',1:'da',2:'de',3:'da',4:'ta',5:'de'};
const saatBulunma=dk=>{const s=Math.floor(dk/60)%24,d=dk%60,n=d||s;return saatYazi(dk)+"'"+(n%10?ZIYARET_EK_BIRLER[n%10]:ZIYARET_EK_ONLAR[Math.floor(n/10)]||'da');};
const ZIYARET_METIN={
  kapi:(k,id)=>`${kisiAdi(k,id)} görüşmeye geliyor.`,
  buyursun:(k,id)=>[`${kisiAdi(k,id)} içeri girer, karşına oturur.`],
  sonra:(k,id,o)=>[`${kisiAdi(k,id)} ${gunAyYazi(o.tarih)} ${saatBulunma(o.dakika)} yeniden gelir.`],
  olmaz:()=>['Görüşme olmaz; görüşmek istersen telefonda yazarsın.'],
  cevap:{tesekkur:{metin:'Sağ ol',aciklama:'Görüşme biter; söyledikleri deftere ve oyuncu dosyalarına yazılır.',tepki:'Rahatlamış görünüyordu.'},
    baski:{metin:'Sonuç istiyorum',aciklama:'Görüşme biter; bunu aklında tutar (TEST: bugün etkisi yok).',tepki:'Yüzü biraz asıldı.'}}
};
const ziyaretKonusmasi=(k,kisiId,T)=>{const p=k.kisiler[kisiId];return p&&p.rol==='yardimciAntrenor'?YAZISMA_METIN.yardimciTakim(k,T):YAZISMA_METIN.hocaTakim(k,T);};
function ziyaretRandevuVeri(k,kisiId,erteleme){
  return{baslik:`Görüşme: ${kisiAdi(k,kisiId)}`,aciklama:ZIYARET_METIN.kapi(k,kisiId),zorunluluk:'istege',sure:YAZISMA_TEST.gorusme.sure,
    karar:'ziyaret',kisiId,konu:'takim',erteleme:erteleme|0};
}
const ziyaretSaatinde=(k,is)=>!!is&&is.tarih===k.tarih&&is.dakika===k.gunIciDakika;
const ziyaretBul=(k,tur)=>Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.karar===tur&&ziyaretSaatinde(k,x))||null;
const ziyaretKapida=k=>{const x=ziyaretBul(k,'ziyaret');return x&&kisiAktif(k,x.veri.kisiId)?x:null;};
const ziyaretGorusmede=k=>ziyaretBul(k,'ziyaretGorusme');
function ziyaretSonrakiAn(k,is){
  const biz=bizimKulup(k),macGunu=new Set((k.fikstur||[]).filter(f=>f.ev===biz||f.konuk===biz).map(f=>f.tarih)),G=YAZISMA_TEST.gorusme;
  for(let d=1;d<=ZIYARET_TEST.gunEnCok;d++){
    const t=tarihEkle(is.tarih,d);if(macGunu.has(t))continue;
    const p=typeof antrenmanPenceresi==='function'?antrenmanPenceresi(k,t):null;
    if(p&&is.dakika<p.bit&&is.dakika+G.sure>p.bas)continue;
    const o={tarih:t,dakika:is.dakika};if(!gorusmeCakisma(k,o,is.id))return o;
  }
  return null;
}
KARAR_TURLERI.ziyaret={
  denetle:(k,v)=>{const h=[];if(!(k.kisiler||{})[v.kisiId])h.push('ziyaretçi bulunamadı');if(!Number.isInteger(v.erteleme)||v.erteleme<0)h.push('erteleme sayısı yok');return h;},
  secenekler:(k,is)=>{
    const v=is.veri,simdi=ziyaretSaatinde(k,is),aktif=kisiAktif(k,v.kisiId),o=(v.erteleme|0)<ZIYARET_TEST.ertelemeEnCok?ziyaretSonrakiAn(k,is):null;
    const once=simdi?null:`Kapıya ${saatBulunma(is.dakika)} gelir; kararı o zaman verirsin`;
    return[{id:'buyursun',metin:'Buyursun',sure:0,engel:once||(!aktif?`${kisiAdi(k,v.kisiId)} artık kulüpte değil`:null),aciklama:ZIYARET_METIN.buyursun(k,v.kisiId)},
      o?{id:'sonra',metin:`Sonra gelsin: ${gunAyYazi(o.tarih)} ${saatYazi(o.dakika)}`,etiket:'Sonra gelsin',etiketAlt:`${gunAyYazi(o.tarih).replace(/^(\d+ \S{3})\S*/,'$1')} ${saatYazi(o.dakika)}`,sure:0,engel:once,aciklama:ZIYARET_METIN.sonra(k,v.kisiId,o)}
       :{id:'sonra',metin:'Bugün olmaz',sure:0,engel:once,aciklama:ZIYARET_METIN.olmaz(k,v.kisiId)}];},
  uygula:(k,is,secim)=>{
    const v=is.veri,ad=kisiAdi(k,v.kisiId);
    if(secim==='buyursun'){
      const T=takimGoruntusu(k);
      isEkle(k,{tur:'ajanda',tarih:k.tarih,dakika:k.gunIciDakika,veri:{baslik:`Görüşme: ${ad}`,aciklama:ziyaretKonusmasi(k,v.kisiId,T),zorunluluk:'istege',
        sure:YAZISMA_TEST.gorusme.sure,karar:'ziyaretGorusme',kisiId:v.kisiId,konu:v.konu,p:T}});
      return{bilgi:`${ad} içeri girdi.`};
    }
    const o=(v.erteleme|0)<ZIYARET_TEST.ertelemeEnCok?ziyaretSonrakiAn(k,is):null;
    if(o){isEkle(k,{tur:'ajanda',tarih:o.tarih,dakika:o.dakika,veri:ziyaretRandevuVeri(k,v.kisiId,(v.erteleme|0)+1)});
      return{bilgi:`${ad} ${gunAyYazi(o.tarih)} ${saatBulunma(o.dakika)} yeniden gelecek.`};}
    return{bilgi:`${ad} ile görüşme olmadı.`};
  }
};
KARAR_TURLERI.ziyaretGorusme={
  denetle:(k,v)=>{const h=[];if(!(k.kisiler||{})[v.kisiId])h.push('ziyaretçi bulunamadı');if(!v.p||typeof v.p!=='object')h.push('görüşmenin görüntüsü yok');return h;},
  secenekler:(k,is)=>{const G=YAZISMA_TEST.gorusme.sure,C=ZIYARET_METIN.cevap;
    return Object.keys(C).map(id=>({id,metin:C[id].metin,sure:G,aciklama:[C[id].aciklama]}));},
  uygula:(k,is,secim)=>{
    const v=is.veri,C=ZIYARET_METIN.cevap[secim];
    k.gecmis.push({tur:'ziyaret',isId:is.id,kisiId:v.kisiId,konu:v.konu,cevap:secim,tarih:k.tarih,dakika:k.gunIciDakika,p:v.p});
    return{bilgi:`${kisiAdi(k,v.kisiId)} ile görüştün: ${v.aciklama} ${C?C.tepki:''}`.trim()};
  }
};
