/* ============ Chairman — koşula bağlı olaylar: paket tarifi ve kariyerdeki olay örneği (çizim yok; yol haritası 2.4A) ============
   Paket tarifi (PAKETLER[id]) bir mesele ailesinin hangi koşulda nasıl açılacağını anlatır; koddadır, kayda girmez.
     PAKETLER[id] = {surum, icerik?, degerlendir(k, baglam) → varyant adı ya da null (koşul tutmuyor), ac(k, olay, baglam)}
     icerik: paketin açılabildiği en küçük içerik sürümü (verilmezse 1); eski kariyerde sonradan eklenen paket açılmaz.
     ac; meseleyi, bağlı işleri ve başkanın bildiği kanıtları kurar, olay.meseleId'yi doldurur.
   Olay örneği (k.olaylar['olay-N']) o kariyerde gerçekten oluşmuş kayıttır:
     {id, paket, surum, konu, varyant, durum, meseleId, acilis:{tarih, dakika}, kosullar, bilgiler, sonuc}
     konu: tekrar sınırının anahtarı (ör. 'sponsor:is-5'); aynı paket aynı konuya ikinci kez açılmaz, önlenen konu da geri açılmaz.
     durum: 'acik' meselesi sürüyor · 'kapandi' meselesi kapandı · 'onlendi' koşul doğmadan giderildi (mesele yok).
     bilgiler: başkanın bildiği kanıtlar [{anahtar, p, kaynak, tarih}] — metin saklanmaz (MESELE_OLAYLARI[anahtar]); kaynak kişi kimliği
       ya da OLAY_KAYNAKLARI anahtarıdır. Dünyanın gerçeği k.kosullar'dadır ve oyuncuya dökülmez.
     sonuc: kararların bıraktığı kalıcı izler (ör. verilen hak, geciken maaş); sonraki içerik buradan okur.
   Dış gelişme (takvimde 'gelisme' türü iş, gizli): zamanı gelince GELISMELER[veri.gelisme].uygula dünyayı değiştirir ve ilgili
     paketi o anki koşullarla dener (paketDene). Koşul önizlemede, özet okurken ya da çizimde denetlenmez; rastlantı çekilmez.
   Yoğunluk denetimi yoktur: gerçek vade ve gelişme zamanında işlenir.
   İçerik sıfırlandı (2.8L, kullanıcı kararı 2026-10-02): oyunda paket, gelişme ya da kanıt kaynağı tanımlı değildir; kayıt defterleri boş durur ve
   içerik yazıldıkça kendi dosyasından doldurulur. Kural denemeleri yalnız araclar/test-icerik.js'teki TEST içeriğini yükler. */
/* içerik sürümü 4 (2.8L): boş içerik. 3 ve öncesinin paketleri kaldırıldı; o kayıtlar kayıt sürümü 6 ile açılmaz (js/kayit.js) */
const ICERIK_SURUM=4;
const OLAY_DURUMLARI=['acik','kapandi','onlendi'];
/* kanıt kaynakları: anahtar → okunur ad (ör. {defter:'Muhasebe kayıtları'}); içerik dosyaları ekler. Kişi kimliği de kaynak olabilir */
const OLAY_KAYNAKLARI={};
const PAKETLER={},GELISMELER={};

const olayKaynakAdi=(k,kaynak)=>OLAY_KAYNAKLARI[kaynak]||kisiAdi(k,kaynak);
const olayVarMi=(k,paket,konu)=>Object.values(k.olaylar).some(o=>o.paket===paket&&o.konu===konu);

/* olay örneği kaydeder; kaydı döndürür */
function olayKaydet(k,{paket,konu,varyant=null,durum,meseleId=null,kosullar={}}){
  if(!PAKETLER[paket])throw new Error(`Bilinmeyen olay paketi: ${paket}`);
  const id=kimlikUret(k,'olay');
  return k.olaylar[id]={id,paket,surum:PAKETLER[paket].surum,konu,varyant,durum,meseleId,acilis:{tarih:k.tarih,dakika:k.gunIciDakika},kosullar,bilgiler:[],sonuc:{}};
}
/* paketi şu anki koşullarla dener: açılırsa olay kaydını, açılmazsa null döndürür. Yalnız komut içinde çağrılır */
function paketDene(k,paket,konu,baglam){
  const P=PAKETLER[paket];
  if(!P)throw new Error(`Bilinmeyen olay paketi: ${paket}`);
  if(k.icerik.surum<(P.icerik||1)||olayVarMi(k,paket,konu))return null;
  const varyant=P.degerlendir(k,baglam);
  if(!varyant)return null;
  const olay=olayKaydet(k,{paket,konu,varyant,durum:'acik'});
  P.ac(k,olay,baglam);
  if(!k.meseleler[olay.meseleId])throw new Error(`Paket ${paket} mesele açmadı`);
  return olay;
}
/* başkanın öğrendiği kanıtı olaya ekler (şu anki tarihle) */
function olayBilgi(k,olayId,anahtar,p,kaynak){
  const o=k.olaylar[olayId];
  if(!o)throw new Error(`Olay bulunamadı: ${olayId}`);
  if(!MESELE_OLAYLARI[anahtar])throw new Error(`Bilinmeyen bilgi anahtarı: ${anahtar}`);
  o.bilgiler.push({anahtar,p:p||{},kaynak,tarih:k.tarih});
}
const meseleOlayi=(k,meseleId)=>Object.values(k.olaylar||{}).find(o=>o.meseleId===meseleId)||null;

MESELE_OZET_EKLERI.push((k,id,ozet)=>{
  const o=meseleOlayi(k,id);
  if(o)ozet.bilgiler=o.bilgiler.map(b=>({metin:MESELE_OLAYLARI[b.anahtar](k,b.p),kaynak:olayKaynakAdi(k,b.kaynak),tarih:b.tarih}));
});
/* meselesi kapanan olay da kapanır */
IS_SONRASI.push(k=>{
  for(const o of Object.values(k.olaylar||{}))if(o.durum==='acik'&&k.meseleler[o.meseleId].durum==='kapandi')o.durum='kapandi';
});

IS_TURLERI.gelisme={
  gizli:true,
  denetle:(k,v)=>{
    if(!v||typeof v!=='object')return['gelişme bilgisi yok'];
    const g=GELISMELER[v.gelisme];
    return g?g.denetle(k,v):[`bilinmeyen gelişme (${v.gelisme})`];
  },
  baslik:()=>'Gelişme',
  uygula:(k,is)=>GELISMELER[is.veri.gelisme].uygula(k,is)
};

/* olay alanlarının doğrulaması (kariyerDogrula EK_DENETIMLER üzerinden çağırır) */
function olayDogrula(k,h){
  const O=k.olaylar,M=k.meseleler||{};
  if(!O||typeof O!=='object'||Array.isArray(O))return;
  const konular=new Set(),meseleler=new Set();
  for(const [anahtar,o] of Object.entries(O)){
    const ad=`Olay ${anahtar}`;
    if(!o||o.id!==anahtar){h.push(`${ad}: kimliği anahtarıyla aynı değil (${o&&o.id})`);continue;}
    kimlikDenetle(k,h,ad,anahtar,'olay');
    if(!PAKETLER[o.paket])h.push(`${ad}: bilinmeyen paket (${o.paket})`);
    if(!Number.isInteger(o.surum)||o.surum<1)h.push(`${ad}: paket sürümü yok`);
    if(typeof o.konu!=='string'||!o.konu)h.push(`${ad}: konu yok`);
    else{const a=o.paket+'|'+o.konu;if(konular.has(a))h.push(`${ad}: aynı konu ikinci kez açılmış (${o.konu})`);konular.add(a);}
    if(!OLAY_DURUMLARI.includes(o.durum))h.push(`${ad}: bilinmeyen durum (${o.durum})`);
    if(!o.acilis||!tarihGecerliMi(o.acilis.tarih)||!Number.isInteger(o.acilis.dakika))h.push(`${ad}: açılış anı yok`);
    if(!o.sonuc||typeof o.sonuc!=='object'||Array.isArray(o.sonuc))h.push(`${ad}: sonuç kaydı nesne değil`);
    if(o.durum==='onlendi'){if(o.meseleId!==null)h.push(`${ad}: önlenmiş fakat meselesi var`);}
    else{
      const m=M[o.meseleId];
      if(!m)h.push(`${ad}: meselesi bulunamadı (${o.meseleId})`);
      else{
        if(meseleler.has(o.meseleId))h.push(`${ad}: meselesi başka olaya da bağlı (${o.meseleId})`);
        meseleler.add(o.meseleId);
        if((o.durum==='kapandi')!==(m.durum==='kapandi'))h.push(`${ad}: durumu (${o.durum}) meselesiyle tutmuyor (${m.durum})`);
      }
    }
    if(!Array.isArray(o.bilgiler)){h.push(`${ad}: bilgi listesi yok`);continue;}
    o.bilgiler.forEach((b,i)=>{
      if(!b||!MESELE_OLAYLARI[b.anahtar])h.push(`${ad} bilgi [${i}]: bilinmeyen anahtar (${b&&b.anahtar})`);
      else if(!b.p||typeof b.p!=='object'||Array.isArray(b.p))h.push(`${ad} bilgi [${i}]: parametreler nesne değil`);
      if(b&&!OLAY_KAYNAKLARI[b.kaynak]&&!(k.kisiler||{})[b.kaynak])h.push(`${ad} bilgi [${i}]: kaynak bulunamadı (${b.kaynak})`);
      if(b&&!tarihGecerliMi(b.tarih))h.push(`${ad} bilgi [${i}]: geçersiz tarih`);
    });
  }
}
EK_DENETIMLER.push(olayDogrula);
