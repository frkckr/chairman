/* ============ Chairman — mesajlar: telefondaki kişi konuşmaları (okuma modeli; çizim yok; yol haritası 2.8I) ============
   Kariyeri değiştirmez, kayda yeni alan eklemez: konuşmalar mesele olaylarından, verilen kararlardan ve bekleyen kararlardan türetilir.
   Gönderen: MESAJ_GONDEREN[olay anahtarı](k, p, mesele) → kişi kimliği ya da null. Listede olmayan olay anahtarı başkanın konudaki kısa
     notudur ("not"): bütün olay günlüğü bir kişiye atfedilmez, konunun ana konuşmasında küçük satır olarak görünür.
   Konunun ana konuşması: konuya ilk mesaj gönderen kişi; yoksa konuyu soran ya da konudaki ilk kişi; o da yoksa konu yalnız dosyadadır.
   Giden mesaj: verilmiş kararın seçilen cevabı (geçmişteki iş kaydı; sonuc.meseleId/soran 2.8I'dan beri yazılır, eski kayıtta giden görünmez);
     yalnız soranın konuşmasında (soranı olmayan kararın cevabı dosyadadır; F6-a).
   Cevap: bekleyen karar veri.soran taşıyorsa o kişinin konuşmasında iki cevabıyla görünür (ortak komut: ajandaIsiYap). Soran yoksa
     konuşmada yalnız "dosyada karar bekliyor" bağlantısı vardır (ör. yüz yüze aday görüşmesi, saymansız kriz).
   Okundu: mesele.gorulen sayacı (meseleGoruldu). Okumak cevaplamak değildir; cevap bekleyen ayrı işaretlenir.
   konusmaListesi(k) → [{anahtar, kisi, ad, rol, mesajlar:[{tarih,dakika,yon,metin,meseleId,yeni}], kararlar:[isId], dosyaKarar:[meseleId],
     meseleler:[id], girisimler:[{id,ad,aciklama,engel}], okunmamis, cevapBekliyor, sonAn}] */
/* rolün telefonda görünen adı; koltuktaki yönetici koltuğunun adıyla görünür. İçerik yeni rol ekleyebilir */
const MESAJ_ROL={baskan:'Başkan',teknikDirektor:'Teknik direktör',yardimciAntrenor:'Yardımcı antrenör',maliMudur:'Mali işler müdürü',yonetici:'Yönetim',yoneticiAdayi:'Kulüp üyesi',personel:'Kulüp çalışanı',eskiBaskan:'Eski başkan'};
const kisiRolu=(k,p)=>{
  if(!p)return'';
  const c=p.kulupId&&k.kulupler[p.kulupId];
  if(c&&c.yonetim)for(const [koltuk,id] of Object.entries(c.yonetim))if(id===p.id&&typeof YONETIM_KOLTUKLARI!=='undefined')return YONETIM_KOLTUKLARI[koltuk].ad;
  if(p.rol==='teknikDirektor'&&p.durum!=='aktif')return'Eski teknik direktör';      // F6-a: görevden ayrılan hocanın eski mesajları
  return MESAJ_ROL[p.rol]||p.rol;
};
/* göndereni parametredeki kişi olan olay için kısa yazım: MESAJ_GONDEREN['x.y']=pKisi('kisiId') */
const pKisi=a=>(k,p)=>p[a]||null;
/* olay anahtarı → gönderen; içerik dosyaları ekler (2.8L'den beri oyunda konuya özgü olay yoktur) */
const MESAJ_GONDEREN={'tavsiye.geldi':pKisi('kisiId')};
/* telefonda kişinin kendi sesiyle mesaj: dosyadaki anlatım aynı olaydan üretilir, telefonda gönderenin ağzından yazılır.
   Metin yeni bir bilgi ya da söz eklemez; gizli dünya gerçeğini söylemez. İçerik dosyaları ekler */
const MESAJ_METIN={'tavsiye.geldi':()=>'Görüşümü dosyaya yazdım.'};
/* telefonda gösterilmeyen kayıt satırları (konunun dosyasında durur) */
const MESAJ_GIZLI=new Set(['kapandi']);
/* F3-b: meseleye bağlı olmayan mesaj kaynakları: (k) → [{kisiId, tarih, dakika, metin, yeni, yon?}]. Kayda alan eklemez. H2-c (2026-10-26): hocanın
   otomatik maç yorumu kalktı; tek kaynak yazışmadır (js/yazisma.js: giden soru, gelen cevap, “Cevap gelmedi.”; yeni = kişinin okunan anından sonra) */
const MESAJ_KAYNAKLARI=[];
/* olayın göndereni (kişi kaydı yoksa null) */
function mesajGondereni(k,o,m){
  const f=MESAJ_GONDEREN[o.anahtar],id=f?f(k,o.p,m):null;
  return id&&k.kisiler[id]?id:null;
}
/* konunun ana konuşması: ilk gönderen, yoksa kararı soran. İkisi de yoksa konu telefonda yoktur, yalnız dosyadadır (ör. yüz yüze aday görüşmesi) */
function meseleKonusmasi(k,m){
  for(const o of m.olaylar){const g=mesajGondereni(k,o,m);if(g)return g;}
  const soran=meseleIsleri(k,m.id).find(x=>x.tur==='ajanda'&&x.veri.soran);
  if(soran)return soran.veri.soran;
  const g=k.gecmis.find(x=>x.tur==='is'&&x.sonuc&&x.sonuc.meseleId===m.id&&x.sonuc.soran);
  return g?g.sonuc.soran:null;
}
/* G2 incelemesi (oda özeti): bu anda gelen karar işleri ve kararın telefonda olup olmadığı — soranın konuşmasında ya da konusunun telefondaki
   konuşmasında dosya bağlantısıyla. Soranı ve konuşması olmayan karar (ör. hocası olmayan kulüpte gelen teklif) yalnız masadaki dosyadadır; H1'den beri
   gelen teklifin konuşması hocanındır (js/transfer.js 'tr.hocaGorus') */
const simdiGelenKararlar=k=>Object.values(k.isler).filter(x=>x.tur==='ajanda'&&x.veri.karar&&x.veri.gelis&&x.veri.gelis.tarih===k.tarih&&x.veri.gelis.dakika===k.gunIciDakika);
/* H2-c: soran ya da konunun ana konuşması aktif kişi olmalı (görevden ayrılan hocanın konuşmasında açık karar görünmez; H1 incelemesinin bulgusu) */
const mesajKisiAktif=(k,id)=>!!(id&&k.kisiler[id]&&k.kisiler[id].durum==='aktif');
const kararTelefondaMi=(k,is)=>!!(mesajKisiAktif(k,is.veri.soran)||(is.veri.meseleId&&k.meseleler[is.veri.meseleId]&&mesajKisiAktif(k,meseleKonusmasi(k,k.meseleler[is.veri.meseleId]))));
function konusmaListesi(k){
  const K=new Map(),al=id=>{
    if(!K.has(id)){const p=k.kisiler[id];K.set(id,{anahtar:id,kisi:p,ad:p.ad,rol:kisiRolu(k,p),mesajlar:[],kararlar:[],dosyaKarar:[],meseleler:[],girisimler:[],okunmamis:0,cevapBekliyor:false,sonAn:0});}
    return K.get(id);
  };
  const ekle=(c,m,x)=>{c.mesajlar.push(x);if(m&&!c.meseleler.includes(m))c.meseleler.push(m);};
  for(const m of Object.values(k.meseleler||{})){
    const ana=meseleKonusmasi(k,m);
    m.olaylar.forEach((o,j)=>{
      const g=mesajGondereni(k,o,m),hedef=g||ana;
      if(!hedef||MESAJ_GIZLI.has(o.anahtar))return;
      const metin=g&&MESAJ_METIN[o.anahtar]?MESAJ_METIN[o.anahtar](k,o.p):MESELE_OLAYLARI[o.anahtar](k,o.p);
      ekle(al(hedef),m.id,{tarih:o.tarih,dakika:o.dakika,yon:g?'gelen':'not',metin,meseleId:m.id,yeni:j>=m.gorulen,sira:j});
    });
    /* bekleyen karar: soranı varsa o konuşmada cevaplanır; yoksa ana konuşmada dosyaya bağlantı */
    for(const x of meseleIsleri(k,m.id))if(x.tur==='ajanda'&&x.veri.karar){
      const simdi=!!x.veri.saatsiz||x.tarih===k.tarih;
      if(mesajKisiAktif(k,x.veri.soran)){const c=al(x.veri.soran);c.kararlar.push(x.id);if(!c.meseleler.includes(m.id))c.meseleler.push(m.id);if(simdi)c.cevapBekliyor=true;}
      else if(ana&&mesajKisiAktif(k,ana)){const c=al(ana);if(!c.dosyaKarar.includes(m.id))c.dosyaKarar.push(m.id);if(simdi)c.cevapBekliyor=true;}
    }
  }
  /* H2-c: mesele açmayan ama soranı olan bekleyen karar (ör. görüşme önerisi, js/yazisma.js) soranın konuşmasında, soran aktifse */
  for(const x of Object.values(k.isler))if(x.tur==='ajanda'&&x.veri.karar&&!x.veri.meseleId&&mesajKisiAktif(k,x.veri.soran)){
    const c=al(x.veri.soran);c.kararlar.push(x.id);if(!!x.veri.saatsiz||x.tarih===k.tarih)c.cevapBekliyor=true;}
  /* giden: verilmiş kararların seçilen cevabı (2.8I'dan beri iş kaydında konu ve soran yazılır). Yalnız soranın konuşmasında: soranı olmayan
     kararın cevabı dosyadadır (F6-a incelemesi: P12'nin dosyadaki kararı, konunun ilk göndereni olan eski hocaya yazılmış gibi görünüyordu).
     Sıra: cevap verildiği anda konunun kaç olayı vardıysa onlardan sonra, cevabın doğurduğu olaylardan önce (sonuc.olaySira, F6-a; eski kayıtta yok:
     aynı dakikada önce gelir) */
  for(const g of k.gecmis){
    const r=g.tur==='is'&&g.isTuru==='ajanda'&&g.sonuc;
    /* H2-c: mesele açmayan kararın (görüşme önerisi) cevabı da soranın konuşmasında; sırası anına göre */
    if(!r||!(r.secimMetni||r.durum==='cevapsiz')||!(r.meseleId||r.karar&&r.soran))continue;
    const m=r.meseleId?k.meseleler[r.meseleId]:null;if(r.meseleId&&!m)continue;
    const hedef=r.soran&&k.kisiler[r.soran]?r.soran:null;
    if(!hedef)continue;
    const sira=!m?anDakika(g.tarih,g.dakika):Number.isInteger(r.olaySira)?r.olaySira-0.5:-1,mid=m?m.id:null;
    ekle(al(hedef),mid,r.secimMetni?{tarih:g.tarih,dakika:g.dakika,yon:'giden',metin:r.secimMetni,meseleId:mid,yeni:false,sira}
      :{tarih:g.tarih,dakika:g.dakika,yon:'not',metin:'Cevap vermedin.',meseleId:mid,yeni:false,sira});
  }
  /* F3-b: meseleye bağlı olmayan mesajlar (MESAJ_KAYNAKLARI). H2-c: öğe yönünü kendisi taşır (yazışmada giden soru ve “Cevap gelmedi.” notu; js/yazisma.js) */
  for(const f of MESAJ_KAYNAKLARI)for(const x of f(k))if(k.kisiler[x.kisiId]){const c=al(x.kisiId);
    c.mesajlar.push({tarih:x.tarih,dakika:x.dakika,yon:x.yon||'gelen',metin:x.metin,meseleId:null,yeni:!!x.yeni,sira:anDakika(x.tarih,x.dakika)});}
  /* başkanın başlatabileceği görüşmeler: ilgili kişinin konuşmasında öneri olarak */
  if(typeof girisimListesi==='function')for(const G of girisimListesi(k)){
    const id=GIRISIMLER[G.id].kisi?GIRISIMLER[G.id].kisi(k):null;
    if(id&&k.kisiler[id])al(id).girisimler.push(G);
  }
  const L=[...K.values()];
  for(const c of L){
    /* aynı an: konunun olay sırası; cevap (giden) sorusundan sonra, doğurduğu olaylardan önce (eski kayıtta sira -1: önce) */
    c.mesajlar.sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika)||a.sira-b.sira);
    c.okunmamis=c.mesajlar.filter(x=>x.yeni&&x.yon==='gelen').length;
    const s=c.mesajlar[c.mesajlar.length-1];c.sonAn=s?anDakika(s.tarih,s.dakika):0;
  }
  return L.sort((a,b)=>(b.cevapBekliyor-a.cevapBekliyor)||(b.sonAn-a.sonAn)||(a.ad<b.ad?-1:1));
}
