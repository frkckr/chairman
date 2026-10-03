/* ============ Chairman — mesajlar: telefondaki kişi konuşmaları (okuma modeli; çizim yok; yol haritası 2.8I) ============
   Kariyeri değiştirmez, kayda yeni alan eklemez: konuşmalar mesele olaylarından, verilen kararlardan ve bekleyen kararlardan türetilir.
   Gönderen: MESAJ_GONDEREN[olay anahtarı](k, p, mesele) → kişi kimliği ya da null. Listede olmayan olay anahtarı başkanın konudaki kısa
     notudur ("not"): bütün olay günlüğü bir kişiye atfedilmez, konunun ana konuşmasında küçük satır olarak görünür.
   Konunun ana konuşması: konuya ilk mesaj gönderen kişi; yoksa konuyu soran ya da konudaki ilk kişi; o da yoksa konu yalnız dosyadadır.
   Giden mesaj: verilmiş kararın seçilen cevabı (geçmişteki iş kaydı; sonuc.meseleId/soran 2.8I'dan beri yazılır, eski kayıtta giden görünmez).
   Cevap: bekleyen karar veri.soran taşıyorsa o kişinin konuşmasında iki cevabıyla görünür (ortak komut: ajandaIsiYap). Soran yoksa
     konuşmada yalnız "dosyada karar bekliyor" bağlantısı vardır (ör. yüz yüze aday görüşmesi, saymansız kriz).
   Okundu: mesele.gorulen sayacı (meseleGoruldu). Okumak cevaplamak değildir; cevap bekleyen ayrı işaretlenir.
   konusmaListesi(k) → [{anahtar, kisi, ad, rol, mesajlar:[{tarih,dakika,yon,metin,meseleId,yeni}], kararlar:[isId], dosyaKarar:[meseleId],
     meseleler:[id], girisimler:[{id,ad,aciklama,engel}], okunmamis, cevapBekliyor, sonAn}] */
/* rolün telefonda görünen adı; koltuktaki yönetici koltuğunun adıyla görünür. İçerik yeni rol ekleyebilir */
const MESAJ_ROL={baskan:'Başkan',teknikDirektor:'Teknik direktör',yonetici:'Yönetim',yoneticiAdayi:'Kulüp üyesi',personel:'Kulüp çalışanı',eskiBaskan:'Eski başkan'};
const kisiRolu=(k,p)=>{
  if(!p)return'';
  const c=p.kulupId&&k.kulupler[p.kulupId];
  if(c&&c.yonetim)for(const [koltuk,id] of Object.entries(c.yonetim))if(id===p.id&&typeof YONETIM_KOLTUKLARI!=='undefined')return YONETIM_KOLTUKLARI[koltuk].ad;
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
function konusmaListesi(k){
  const K=new Map(),al=id=>{
    if(!K.has(id)){const p=k.kisiler[id];K.set(id,{anahtar:id,kisi:p,ad:p.ad,rol:kisiRolu(k,p),mesajlar:[],kararlar:[],dosyaKarar:[],meseleler:[],girisimler:[],okunmamis:0,cevapBekliyor:false,sonAn:0});}
    return K.get(id);
  };
  const ekle=(c,m,x)=>{c.mesajlar.push(x);if(!c.meseleler.includes(m))c.meseleler.push(m);};
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
      if(x.veri.soran&&k.kisiler[x.veri.soran]){const c=al(x.veri.soran);c.kararlar.push(x.id);if(!c.meseleler.includes(m.id))c.meseleler.push(m.id);if(simdi)c.cevapBekliyor=true;}
      else if(ana){const c=al(ana);if(!c.dosyaKarar.includes(m.id))c.dosyaKarar.push(m.id);if(simdi)c.cevapBekliyor=true;}
    }
  }
  /* giden: verilmiş kararların seçilen cevabı (2.8I'dan beri iş kaydında konu ve soran yazılır) */
  for(const g of k.gecmis){
    const r=g.tur==='is'&&g.isTuru==='ajanda'&&g.sonuc;
    if(!r||!r.meseleId||!(r.secimMetni||r.durum==='cevapsiz'))continue;
    const m=k.meseleler[r.meseleId];if(!m)continue;
    const hedef=r.soran&&k.kisiler[r.soran]?r.soran:meseleKonusmasi(k,m);
    if(!hedef)continue;
    ekle(al(hedef),m.id,r.secimMetni?{tarih:g.tarih,dakika:g.dakika,yon:'giden',metin:r.secimMetni,meseleId:m.id,yeni:false,sira:-1}
      :{tarih:g.tarih,dakika:g.dakika,yon:'not',metin:'Cevap vermedin.',meseleId:m.id,yeni:false,sira:-1});
  }
  /* başkanın başlatabileceği görüşmeler: ilgili kişinin konuşmasında öneri olarak */
  if(typeof girisimListesi==='function')for(const G of girisimListesi(k)){
    const id=GIRISIMLER[G.id].kisi?GIRISIMLER[G.id].kisi(k):null;
    if(id&&k.kisiler[id])al(id).girisimler.push(G);
  }
  const L=[...K.values()];
  for(const c of L){
    /* aynı an: giden önce (cevap), sonra gelişme */
    c.mesajlar.sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika)||(a.yon==='giden'?-1:0)-(b.yon==='giden'?-1:0)||a.sira-b.sira);
    c.okunmamis=c.mesajlar.filter(x=>x.yeni&&x.yon==='gelen').length;
    const s=c.mesajlar[c.mesajlar.length-1];c.sonAn=s?anDakika(s.tarih,s.dakika):0;
  }
  return L.sort((a,b)=>(b.cevapBekliyor-a.cevapBekliyor)||(b.sonAn-a.sonAn)||(a.ad<b.ad?-1:1));
}
