/* ============ Chairman — zaman özeti: İlerle'de geçen sürenin okunur özeti (saf okuma; çizim yok; U4, 2026-10-28) ============
   Kullanıcı tercihi 6 (2026-10-28, araclar/plan/u-arayuz.md): İlerle anında atlamaz gibi görünmesin; "zaman geçiyor" sahnesi olanları sırayla
   gösterir, durak özeti kartıyla biter; ay başı, transfer dönemi ve sezon sonu kapak olarak öne çıkar. Bu dosya yalnız okur: kariyeri değiştirmez,
   kayda alan eklemez; Node'da sınanır (araclar/kariyer-deneme.js). Sahnenin çizimi js/ekran-zaman.js, odadaki bağlantısı js/ekran-oda.js.
     zamanOzeti(k, once, r) → {bas, son, gecen (dk), satirlar:[{an, tarih, dakika, metin, tur}], kapaklar:[{tur, tarih, baslik, metin}]}
       once: İlerle'den önceki an {tarih, dakika}; r: duragaIlerle sonucu (biten geçmiş kayıtları); k: İlerle'den sonraki kariyer.
       Satırlar biten kayıtlardan (ödeme, kaçırılan ve cevapsız kalan iş, hatırlatma, ay başı ve mali rapor, yazışma cevabı, görüş, ekip işi) ve
       aradaki her sabahın gazetesinden (sabah 08:00; boş sayı satır vermez) zaman sırasıyla kurulur. Kapak: ay başı (iş türü ayBasi), hatırlatmanın
       veri.kapak'ı ('transfer', 'sezonSonu'; js/fikstur.js).
     gecmisOzetSatirlari(k, g) → [{metin, tur, kapak?}]: biten bir işin satırları (CM1-b: gelişme listesi de okur; metin tek yerde)
     sureYazi(dk) → “2 saat 30 dk”, “1 gün 3 saat”
   METİNLER TEST TASLAĞIDIR (karar 35 kipi). */
'use strict';
const ZAMAN_KAPAK={ayBasi:'Ay başı',transfer:'Transfer dönemi',sezonSonu:'Sezon sonu',ara:'Devre arası'};   /* CM2-a: devre arası */
const ZAMAN_GAZETE_SAAT=typeof GUN_BASLANGICI!=='undefined'?GUN_BASLANGICI:480;   /* gazetenin çıktığı an (js/gazete.js penceresiyle aynı) */
function sureYazi(dk){
  dk=Math.max(0,Math.round(dk));
  const g=Math.floor(dk/1440),s=Math.floor(dk%1440/60),d=dk%60,P=[];
  if(g)P.push(g+' gün');if(s)P.push(s+' saat');if(d&&!g)P.push(d+' dk');
  return P.length?P.join(' '):'0 dk';
}
/* CM1-b (2026-11-03, karar 87): biten bir işin (geçmişteki 'is' kaydı) okunur satırları — zaman özeti ve gelişme listesi (js/gelismeler.js) aynı
   metni kullanır (tek kayıt, çok sunum). Döndürür: [{metin, tur, kapak?}] (ertelemede birden çok satır; satırsız kayıtta boş dizi) */
function gecmisOzetSatirlari(k,g){
  const s=g.sonuc||{},t=g.isTuru,L=[],ekle=(metin,kapak)=>{if(metin){const x={metin:String(metin),tur:t};if(kapak)x.kapak=kapak;L.push(x);}};
  if(t==='odeme'){const h=(k.hareketler||[]).find(x=>x.id===s.hareketId);if(h)ekle(h.aciklama+' · '+paraYazi(h.tutar));}
  else if(t==='ajanda'&&s.durum==='kacirildi')ekle(s.baslik+' kaçırıldı');
  else if(t==='ajanda'&&s.durum==='cevapsiz')ekle(s.baslik+': cevapsız kaldı'+(s.bilgi?' — '+s.bilgi:''));
  else if(t==='hatirlatma'&&s.metin){
    /* eski kayıtların hatırlatmasında kapak yoktur: transfer dönemi ve sezon sonu metinden tanınır (U7 incelemesi) */
    const kp=s.kapak||(/transfer dönemi (açıldı|kapandı)/i.test(s.metin)?'transfer':/^Sezon tamamlandı/.test(s.metin)?'sezonSonu':null);
    ekle(s.metin,kp&&ZAMAN_KAPAK[kp]?kp:null);}
  else if((t==='ayBasi'||t==='maliRapor')&&s.metin)ekle(s.metin,t==='ayBasi'?'ayBasi':null);
  else if(t==='gelisme'&&s.yazisma){const p=k.kisiler[s.yazisma.kisiId];ekle((p?p.ad:'Biri')+(s.yazisma.cevapYok?': cevap gelmedi':' yazdı'));}
  else if(t==='gelisme'&&s.haber)ekle('Beklediğin görüş geldi');
  else if((t==='gelisme'||t==='ekip')&&typeof s.bilgi==='string')ekle(s.bilgi);
  /* RK7: öbür maçlar kendi saatinde, TFF programı, ertelemeler (js/lig-takvimi.js) */
  else if(t==='ligMaci'&&!s.atlandi&&Array.isArray(s.skor)){const f=(k.fikstur||[]).find(x=>x.id===s.macId),kisa=id=>((k.kulupler||{})[id]||{}).kisa||id;
    if(f)ekle(`${kisa(f.ev)} ${s.skor[0]}–${s.skor[1]} ${kisa(f.konuk)}`);}
  else if(t==='program'&&Number.isInteger(s.hafta))ekle(`TFF ${s.hafta}. haftanın programını açıkladı`);
  else if(t==='hava'&&Array.isArray(s.ertelenen)){if(s.metin)ekle(s.metin);   /* bizim maç ertelendiyse onun metni; öbürleri birer satır */
    const biz=ligBizimKulup(k);
    for(const id of s.ertelenen){const f=(k.fikstur||[]).find(x=>x.id===id),ad=x=>((k.kulupler||{})[x]||{ad:x}).ad;
      if(f&&!(s.metin&&(f.ev===biz||f.konuk===biz)))ekle(`Ertelendi: ${ad(f.ev)} – ${ad(f.konuk)}`);}}
  return L;
}
function zamanOzeti(k,once,r){
  const bas=anDakika(once.tarih,once.dakika),son=simdikiAn(k),S=[],K=[];
  const ekle=(tarih,dakika,metin,tur)=>{if(metin)S.push({an:anDakika(tarih,dakika),tarih,dakika,metin:String(metin),tur});};
  for(const g of (r&&r.biten)||[])for(const x of gecmisOzetSatirlari(k,g)){
    ekle(g.tarih,g.dakika,x.metin,x.tur);
    if(x.kapak)K.push({tur:x.kapak,tarih:g.tarih,baslik:ZAMAN_KAPAK[x.kapak],metin:x.metin});
  }
  /* aradaki sabahların gazetesi: manşetiyle (o günün haberini erken gösterir) */
  if(typeof gazeteSayisi==='function')for(let a=Math.floor(bas/1440)*1440+ZAMAN_GAZETE_SAAT;a<=son;a+=1440){
    if(a<=bas)continue;const t=anTarih(a),G=gazeteSayisi(k,t.tarih);
    if(G&&!G.bos&&G.manset)ekle(t.tarih,t.dakika,'Gazete: '+G.manset.metin,'gazete');
  }
  S.sort((x,y)=>x.an-y.an);
  return{bas,son,gecen:son-bas,satirlar:S,kapaklar:K};
}
