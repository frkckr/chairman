/* ============ Chairman — ilk 60 gün: göreve yeni gelen başkanın sezon öncesi (içerik; TEST taslağı; çizim yok; CM2-b, 2026-11-03) ============
   YOL_HARITASI karar 89; plan araclar/plan/cm2-uygulama.md §3; araştırma araclar/plan/cm-arastirma.md §3 (Türkiye'de yeni başkanın ilk 60 günü: mazbata,
   devir teslim, futbolcu alacakları ve transfer yasağı, kulüp lisansı, kamp, kombine, olağanüstü mali genel kurul, basın). Yalnız yaz tarifiyle açılan
   kariyerde çalışır (k.icerik.baslangic === 'yaz'); Kasım tarifi ve eski kayıtlar değişmez. Kullanıcı kararı (2026-11-03): belgeler (tutanak, lisans
   yazısı, kurul gündemi) Claude'un metni, kişi replikleri TEST ve kullanıcı değiştirir. BÜTÜN TUTARLAR, OLASILIKLAR VE METİNLER TEST'TİR.
   Öğretici yoktur: her iş kulübün gerçek işidir ve bir ekranı öğretir (ters piramit: ilk gün tek dosya tek kart, sonra seyrek).
   Devralınan koşullar tohumdan kurulur, kayda yazılır (k.kosullar.onsezon; EK_DENETIMLER): alacak, tutanakta yazmayan borç, lisans kalemleri, transfer
   tahtası, kamp, kombine, kurul yetkisi, altyapı kararı. Dünyanın gerçeği başkanın bilgisinden önce gelir: gizli borç tutanağı imzalayan başkanın
   karşısına dokuzuncu gün çıkar, “eksikleri sor” diyene ertesi gün.
   Akış (gizli 'gelisme' işi 'onsezon', veri.adim; her adım dosya ve tek kart açar, cevapsız kalırsa kartın yüzünde yazan sonuç):
     devir      22 Haz 10:00 devir teslim tutanağı — Tutanağı imzala / Eksikleri sor
     alacak     23 Haz 10:00 futbolcu alacakları ve transfer tahtası — Hemen öde / Taksit teklif et (ret olursa tam öde ya da tahta kapalı kalsın)
     lisans     24 Haz 10:00 kulüp lisansı eksikleri (üç kalem, 23 Temmuz 18:00'e dek; açık kalan kalem ceza)
     hoca       26 Haz 10:00 teknik direktör — Hocayla devam / Adaylarla görüş (P12'nin aday görüşmesi ve kartı)
     kamp       29 Haz 10:00 hazırlık kampı — Bolu / Avusturya (13–20 Temmuz; k.kosullar.kamp)
     kombine     3 Tem 10:00 kombine kampanyası — Taraftar fiyatı / Yüksek fiyat (iç saha dolulu­ğu ±, gelir peşin)
     kurul      14 Tem 10:00 olağanüstü mali genel kurul — Borçlanma yetkisi iste / İstemeyeceğim
     personel   15 Tem 10:00 yardımcı antrenör ve mali işler müdürü — Devam / Yeni isim
     yemek      21 Tem 18:00 taraftar temsilcisi kapıda (js/ziyaret.js konu 'taraftarYemegi') — Söz ver / Söz verme
     basin      24 Tem 11:00 ilk basın toplantısı — Hedef play-off / Hedef sağlam kulüp (söz; ertesi sabah manşet)
     zemin       4 Ağu 10:00 stat zemini ve altyapı — Zemini yenile / Altyapıya ayır
   Gazetenin bu paketten haberleri geçmişten kurulur (k.gecmis {tur:'onsezon', olay, p}; kaynak 'onsezon'). Sponsor Temmuz ay başında (js/sponsor.js). */
'use strict';
const ONSEZON_TEST={
  saat:600,
  alacak:[45000000,90000000],kabul:0.6,tekrarGun:7,tekrarEnCok:6,
  gizliBorc:[30000000,70000000],hacizGun:8,hacizFaiz:1.15,hacizCeza:1.25,yapilandirPesin:0.3,yapilandirFaiz:1.1,
  lisans:{son:31,sgk:[25000000,50000000],tesis:18000000,personel:15000000,ceza:20000000,tesisKabul:0.65,personelKabul:0.5,tesisBekleme:5},
  kamp:{bas:21,gun:8,yurtici:{yer:'Bolu',masraf:45000000},yurtdisi:{yer:'Avusturya',masraf:110000000}},
  kombine:{taraftar:{gelir:45000000,ek:0.05},yuksek:{gelir:70000000,ek:-0.05},cevapsiz:{gelir:55000000,ek:0}},
  kurul:{kredi:200000000,taksit:56000000,taksitAylari:['10','12','02','04']},
  personel:{tazminat:6000000,yeni:{yardimciAntrenor:{ad:'Cevdet',dogumTarihi:'1981-11-02'},maliMudur:{ad:'Saadet Hanım',dogumTarihi:'1975-05-19'}}},
  zemin:{zemin:60000000,altyapi:40000000,altyapiCarpan:1.1},
  kisiler:{eskiBaskan:{ad:'Rıfat Bey',dogumTarihi:'1958-02-11'},taraftar:{ad:'Cengiz',dogumTarihi:'1984-08-30'}},
  /* gün planı: göreve başlamanın gününe göre (0 = 22 Haziran) ve saat */
  plan:[['devir',0,600],['alacak',1,600],['lisans',2,600],['hoca',4,600],['kamp',7,600],['kombine',11,600],['kurul',22,600],['personel',23,600],['basin',32,660],['zemin',43,600]],
  yemek:{gun:29,dakika:1080}
};
MESELE_KATEGORILERI.onsezon=['Kurumsal','K'];
MESAJ_ROL.taraftar='Taraftar temsilcisi';
SOZ_TARAFLARI.basin='Basın';
const onBiz=k=>(k.kisiler[k.baskanId]||{}).kulupId;
const onK=k=>(k.kosullar&&k.kosullar.onsezon)||null;
const onAcik=k=>!!onK(k)&&k.gorevDurumu==='gorevde';
const onPara=x=>paraYazi(x).replace(/,\d\d ₺$/,' ₺');
const onKisi=(k,rol)=>Object.values(k.kisiler).find(p=>p.rol===rol&&p.kulupId===onBiz(k)&&p.durum==='aktif')||null;
const onSon=(k,gun,dakika)=>({tarih:tarihEkle(k.tarih,gun),dakika:dakika===undefined?1080:dakika});
const onGecmis=(k,olay,p)=>k.gecmis.push({tur:'onsezon',olay,p:p||{},tarih:k.tarih,dakika:k.gunIciDakika});
const onAdim=(k,adim,tarih,dakika,ek)=>isEkle(k,{tur:'gelisme',tarih,dakika,veri:Object.assign({gelisme:'onsezon',adim,kulupId:onBiz(k)},ek||{})});
/* paketin kartı: dosyada, acil değil (son cevapta durur), cevapsız kalabilir (türün zamanAsimi) */
function onKart(k,{karar,baslik,aciklama,meseleId,son,sinif,ek}){
  return isEkle(k,{tur:'ajanda',tarih:son.tarih,dakika:son.dakika,veri:Object.assign({baslik,zorunluluk:'zorunlu',sure:0,saatsiz:true,bekleyebilir:true,
    gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar,meseleId,kulupId:onBiz(k),aciklama},sinif?{sinif}:{},ek||{})});
}
const onOde=(k,tutar,kalem,aciklama)=>paraHareketi(k,{kulupId:onBiz(k),tutar:-tutar,kalem,aciklama});
const onPlanla=(k,tarih,tutar,kalem,aciklama,meseleId)=>odemePlanla(k,Object.assign({kulupId:onBiz(k),tarih,dakika:ONSEZON_TEST.saat,tutar:-tutar,kalem,aciklama},meseleId?{meseleId}:{}));
const onAralik=(r,a)=>Math.round((a[0]+(a[1]-a[0])*r())/1000000)*1000000;   /* 10.000 ₺'ye yuvarlı */

/* ---- kurulum (yeni kariyer, yaz tarifi; js/baslangic.js BASLANGIC_EKLERI) ---- */
function onsezonKur(k){
  if(!k.icerik||k.icerik.baslangic!=='yaz')return;
  const T=ONSEZON_TEST,biz=onBiz(k),r=kadroRastgele(k.dunyaTohumu,'onsezon:kosul');if(!biz)return;
  for(const [rol,P] of Object.entries(T.kisiler)){const id=kimlikUret(k,'kisi');k.kisiler[id]={id,ad:P.ad,rol,dogumTarihi:P.dogumTarihi,kulupId:biz,durum:'aktif'};}
  const L=T.lisans,sgk=onAralik(r,L.sgk);
  k.kosullar.onsezon={alacak:onAralik(r,T.alacak),gizliBorc:onAralik(r,T.gizliBorc),yasak:true,tekrar:0,
    lisans:{son:tarihEkle(k.tarih,L.son),meseleId:null,kalemler:{sgk:{tutar:sgk,durum:'acik'},tesis:{tutar:L.tesis,durum:'acik'},personel:{tutar:L.personel,durum:'acik'}},
      tesisKabul:r()<L.tesisKabul,personelKabul:r()<L.personelKabul},
    taksitKabul:r()<T.kabul,kombine:null,yetki:null,altyapi:false,basin:null};
  /* mazbata: göreve başlamadan önceki akşam (gazetenin ilk sayısı) */
  k.gecmis.push({tur:'onsezon',olay:'mazbata',p:{},tarih:tarihEkle(k.tarih,-1),dakika:1200});
  for(const [adim,gun,dk] of T.plan)onAdim(k,adim,tarihEkle(k.tarih,gun),dk);
  /* taraftar temsilcisi kapıda (defterde ilk günden görünür) */
  const ta=onKisi(k,'taraftar');
  if(ta)isEkle(k,{tur:'ajanda',tarih:tarihEkle(k.tarih,T.yemek.gun),dakika:T.yemek.dakika,veri:ziyaretRandevuVeri(k,ta.id,0,'taraftarYemegi')});
}
BASLANGIC_EKLERI.push(onsezonKur);

/* ---- transfer tahtası: alacaklar ödenmeden yeni transfer dosyası açılmaz ---- */
const transferYasagi=k=>!!(onK(k)&&onK(k).yasak);
TA_ACILIS_ENGELLERI.push(k=>transferYasagi(k)?'Transfer tahtası kapalı: futbolcu alacakları ödenmedi.':null);
function onYasakKaldir(k,meseleId){
  const O=onK(k);if(!O||!O.yasak)return;
  k.kosullar.onsezon=Object.assign({},O,{yasak:false});
  if(meseleId)meseleOlay(k,meseleId,'on.tahtaAcildi',{});
  onGecmis(k,'tahtaAcildi');
  /* tahta kapalıyken gelen hocanın isteği düştü: ertesi gün yeniden gelir (dosya açılmamışsa) */
  const d=typeof transferDonemi==='function'?transferDonemi(k,k.tarih):null;
  if(d&&!Object.values(k.meseleler).some(m=>m.sablon&&m.sablon.ad==='transferAlim'))
    isEkle(k,{tur:'gelisme',tarih:tarihEkle(k.tarih,1),dakika:660,veri:{gelisme:'hocaTalebi',kulupId:onBiz(k),anahtar:`${d.bas}:hocaTalebi:tahta`}});
}

/* ---- metinler (TEST; kullanıcı değiştirir) ---- */
Object.assign(MESELE_OLAYLARI,{
  'on.devir':(k,p)=>`${kisiAdi(k,p.kisiId)} devir teslim tutanağını getirdi. Kasa ${onPara(p.nakit)}; futbolcu alacakları ${onPara(p.alacak)} (transfer tahtası kapalı); kulüp lisansında üç eksik; üç oyuncunun sözleşmesi 30 Haziran'da bitiyor.`,
  'on.imza':()=>'Tutanağı imzaladın. Devir tamamlandı.',
  'on.sor':(k,p)=>`Mali müdüre tutanağı satır satır inceletiyorsun; ek tutanak yarın. ${kisiAdi(k,p.kisiId)} bundan hoşlanmadı.`,
  'on.devirCevapsiz':()=>'Tutanak imzasız kaldı; devir yine de yürüdü.',
  'on.ekTutanak':(k,p)=>`Ek tutanak: eski yönetimden kalan ${onPara(p.tutar)} vergi borcu tutanakta yazmıyordu.`,
  'on.haciz':(k,p)=>`Vergi dairesinden yazı geldi: eski yönetimden kalan ${onPara(p.tutar)} borç için haciz uyarısı. Tutanakta yoktu.`,
  'on.borcOde':(k,p)=>`Borcu ödedin: ${onPara(p.tutar)}.`,
  'on.borcYapilandir':(k,p)=>`Borcu yapılandırdın: şimdi ${onPara(p.pesin)}, kalan ${onPara(p.kalan)} iki taksitte (1 Eylül, 1 Ekim).`,
  'on.hacizOldu':(k,p)=>`Cevap verilmedi; haciz uygulandı: kasadan ${onPara(p.tutar)} çekildi.`,
  'on.alacak':(k,p)=>`Üç eski oyuncunun ${onPara(p.tutar)} alacağı var; ödenene dek transfer tahtası kapalı.`,
  'on.alacakOde':(k,p)=>`Alacakları ödedin: ${onPara(p.tutar)}.`,
  'on.taksitIste':()=>'Oyunculara taksit teklif ettin; cevap yarın.',
  'on.taksitKabul':(k,p)=>`Oyuncular taksiti kabul etti: şimdi ${onPara(p.pesin)}, kalan ${onPara(p.kalan)} 1 Ağustos'ta.`,
  'on.taksitRet':()=>'Oyuncular taksiti kabul etmedi; tam ödeme istiyorlar.',
  'on.tahtaKapali':()=>'Tahta kapalı kaldı; oyuncular bir hafta sonra yeniden arayacak.',
  'on.tahtaAcildi':()=>'Transfer tahtası açıldı.',
  'on.lisans':(k,p)=>`Kulüp lisansı için üç eksik var; son gün ${gunAyYazi(p.son)} 18:00. Açık kalan her kalem için ceza.`,
  'on.lisansKalem':(k,p)=>`${ON_LISANS_AD[p.kalem]}: ${p.metin}`,
  'on.lisansTamam':()=>'Lisans dosyası tamamlandı.',
  'on.lisansCeza':(k,p)=>`Lisans süresi doldu: ${p.n} kalem eksik; ceza ${onPara(p.tutar)}.`,
  'on.hoca':(k,p)=>`Göreve geldiğinde takımın başında ${kisiAdi(k,p.kisiId)} var; sözleşmesi ${gunAyYazi(p.bitis)} ${String(p.bitis).slice(0,4)}'te bitiyor.`,
  'on.hocaDevam':(k,p)=>`${kisiAdi(k,p.kisiId)} ile devam: sözleşmesi ${String(p.bitis).slice(0,4)} yazına uzadı.`,
  'on.hocaAday':(k,p)=>`Adaylarla görüşeceksin: ${gunAyYazi(p.tarih)} ${saatYazi(p.dakika)}.`,
  'on.hocaCevapsiz':(k,p)=>`Cevap vermedin; ${kisiAdi(k,p.kisiId)} göreve devam ediyor.`,
  'on.kamp':(k,p)=>`Kamp: ${p.yer}, ${gunAyYazi(p.bas)}–${gunAyYazi(p.bitis)}; masraf ${onPara(p.masraf)}.`,
  'on.kombine':(k,p)=>p.secim==='yuksek'?`Kombineler yüksek fiyatla satışta; gelir ${onPara(p.gelir)}.`:p.secim==='taraftar'?`Kombineler taraftar fiyatıyla satışta; gelir ${onPara(p.gelir)}.`:`Mali müdür kombineleri geçen yılın fiyatıyla açtı; gelir ${onPara(p.gelir)}.`,
  'on.kurulYetki':(k,p)=>`Kurul borçlanma yetkisi verdi: ${onPara(p.kredi)} kredi kasada; geri ödeme dört taksit (${onPara(p.taksit)}).`,
  'on.kurulYok':()=>'Borçlanma yetkisi istemedin; kulüp borçsuz yönetilecek.',
  'on.personelDevam':(k,p)=>`${kisiAdi(k,p.kisiId)} ile devam.`,
  'on.personelYeni':(k,p)=>`${kisiAdi(k,p.eskiId)} ile yollar ayrıldı; yerine ${kisiAdi(k,p.kisiId)}.`,
  'on.basin':(k,p)=>p.hedef==='playoff'?'Basın toplantısında hedefi açıkladın: play-off.':p.hedef==='saglam'?'Basın toplantısında hedefi açıkladın: borçsuz, sağlam bir kulüp.':'Basın toplantısına çıkmadın.',
  'on.zemin':(k,p)=>p.secim==='zemin'?`Stat zemini yenileniyor: ${onPara(p.tutar)}.`:p.secim==='altyapi'?`Altyapıya ${onPara(p.tutar)} ayırdın; gençlerin çalışma koşulları iyileşiyor.`:'Zemin ve altyapı için karar verilmedi.',
  'on.sozZam':()=>'Taraftara söz: bu sezon kombine zammı yok.',
  'on.sozHedef':(k,p)=>p.hedef==='playoff'?'Basına söz: play-off.':'Basına söz: borçsuz, sağlam kulüp.',
  /* gazete (geçmişten kurulur) */
  'on.gz.mazbata':(k,p)=>`TEST: ${(k.kulupler[onBiz(k)]||{ad:''}).ad}'da yeni dönem: ${kisiAdi(k,k.baskanId)} mazbatasını aldı.`,
  'on.gz.kirgin':(k,p)=>`TEST: Kulis: eski başkan devir teslimdeki sorgudan kırgın.`,
  'on.gz.tahtaAcildi':()=>'TEST: Transfer tahtası açıldı; yeni yönetim alacakları kapattı.',
  'on.gz.haciz':(k,p)=>`TEST: Kulübe haciz: eski yönetimden kalan vergi borcu (${onPara(p.tutar)}).`,
  'on.gz.lisansCeza':(k,p)=>`TEST: Lisans eksikleri tamamlanmadı; kulübe ${onPara(p.tutar)} ceza.`,
  'on.gz.lisansTamam':()=>'TEST: Kulüp lisansı tamam.',
  'on.gz.kamp':(k,p)=>`TEST: Takım ${p.yer} kampına gidiyor.`,
  'on.gz.kombine':(k,p)=>p.secim==='yuksek'?'TEST: Kombine fiyatları tribünde tepki çekti.':'TEST: Kombineler taraftar fiyatıyla satışta.',
  'on.gz.kurulYetki':(k,p)=>`TEST: Genel kurul ${onPara(p.kredi)} borçlanma yetkisi verdi.`,
  'on.gz.kurulYok':()=>'TEST: Yeni başkan: “Borç almayacağız.”',
  'on.gz.basin':(k,p)=>p.hedef==='playoff'?`TEST: ${kisiAdi(k,k.baskanId)}: “Hedef play-off.”`:p.hedef==='saglam'?`TEST: ${kisiAdi(k,k.baskanId)}: “Önce borçsuz, sağlam bir kulüp.”`:'TEST: Başkan basın toplantısına çıkmadı.',
  'on.gz.zemin':(k,p)=>p.secim==='zemin'?'TEST: Stat zemini yenileniyor.':'TEST: Kulüp altyapıya yatırım yapıyor.'
});
const ON_LISANS_AD={sgk:'SGK ve vergi borcu',tesis:'Altyapı tesisi belgesi',personel:'Lisanslı sağlık personeli'};
Object.assign(GAZETE_ETIKET,{'on.gz.mazbata':'Kulüp','on.gz.kirgin':'Kulis','on.gz.tahtaAcildi':'Transfer','on.gz.haciz':'Kulüp','on.gz.lisansCeza':'Kulüp','on.gz.lisansTamam':'Kulüp',
  'on.gz.kamp':'Kulüp','on.gz.kombine':'Kulüp','on.gz.kurulYetki':'Kulüp','on.gz.kurulYok':'Kulüp','on.gz.basin':'Başkan','on.gz.zemin':'Kulüp'});
const ON_GAZETE_ONEM={mazbata:110,kirgin:45,tahtaAcildi:60,haciz:95,lisansCeza:90,lisansTamam:40,kamp:40,kombine:50,kurulYetki:70,kurulYok:65,basin:110,zemin:35};
GAZETE_KAYNAKLARI.push({ad:'onsezon',haberler:(k,P)=>(k.gecmis||[]).filter(g=>g.tur==='onsezon'&&ON_GAZETE_ONEM[g.olay]!==undefined).map(g=>({onem:ON_GAZETE_ONEM[g.olay],
  an:anDakika(g.tarih,g.dakika),anahtar:'on.gz.'+g.olay,p:g.p||{}}))});
if(typeof GELISME_HABER_KATEGORI!=='undefined')Object.assign(GELISME_HABER_KATEGORI,{'on.gz.tahtaAcildi':'transfer','on.gz.kombine':'para','on.gz.kurulYetki':'para','on.gz.kurulYok':'para','on.gz.haciz':'para',
  'on.gz.lisansCeza':'para','on.gz.kirgin':'basin','on.gz.basin':'basin'});

/* ---- adımlar ---- */
const ONSEZON_ADIMLARI={
  devir:(k,v)=>{const O=onK(k),e=onKisi(k,'eskiBaskan'),biz=onBiz(k);
    const id=meseleAc(k,{tur:'onsezon',baslik:'Devir teslim tutanağı',sorumluId:k.baskanId,kisiler:e?[e.id]:[]});
    meseleOlay(k,id,'on.devir',{kisiId:e?e.id:k.baskanId,nakit:k.kulupler[biz].nakit,alacak:O.alacak});
    onKart(k,{karar:'onDevir',baslik:'Devir teslim tutanağı',aciklama:'Eski yönetimin tutanağı masanda: kasa, borçlar, alacaklar, sözleşmeler, açık işler.',meseleId:id,son:onSon(k,1),sinif:'rutin'});
    return{bilgi:'Devir teslim tutanağı geldi.',dur:true};},
  ekTutanak:(k,v)=>{const O=onK(k),m=v.meseleId;meseleOlay(k,m,'on.ekTutanak',{tutar:O.gizliBorc});
    onKart(k,{karar:'onBorc',baslik:'Ek tutanak: vergi borcu',aciklama:`Tutanakta yazmayan ${onPara(O.gizliBorc)} vergi borcu çıktı.`,meseleId:m,son:onSon(k,3),sinif:'sorun',ek:{tutar:O.gizliBorc,haciz:false}});
    return{bilgi:'Ek tutanak geldi.',dur:true};},
  haciz:(k,v)=>{const O=onK(k),t=Math.round(O.gizliBorc*ONSEZON_TEST.hacizFaiz/1000000)*1000000;
    const id=meseleAc(k,{tur:'onsezon',baslik:'Haciz uyarısı',sorumluId:k.baskanId,kisiler:[]});meseleOlay(k,id,'on.haciz',{tutar:t});
    onKart(k,{karar:'onBorc',baslik:'Haciz uyarısı',aciklama:`Vergi dairesi eski yönetimden kalan ${onPara(t)} için süre verdi.`,meseleId:id,son:onSon(k,2),sinif:'sorun',ek:{tutar:t,haciz:true}});
    return{bilgi:'Vergi dairesinden haciz uyarısı geldi.',dur:true};},
  alacak:(k,v)=>{const O=onK(k);if(!O.yasak)return{bilgi:null};const md=onKisi(k,'maliMudur');
    const id=v.meseleId&&k.meseleler[v.meseleId]&&k.meseleler[v.meseleId].durum!=='kapandi'?v.meseleId:meseleAc(k,{tur:'onsezon',baslik:'Futbolcu alacakları',sorumluId:k.baskanId,kisiler:md?[md.id]:[]});
    if(!v.meseleId)meseleOlay(k,id,'on.alacak',{tutar:O.alacak});
    onKart(k,{karar:'onAlacak',baslik:'Futbolcu alacakları',aciklama:`Üç eski oyuncu ${onPara(O.alacak)} alacak istiyor; ödenmeden transfer tahtası açılmaz.`,meseleId:id,son:onSon(k,2),sinif:'sorun',ek:{tutar:O.alacak,ret:!!v.ret}});
    return{bilgi:v.meseleId?'Eski oyuncular alacakları için yine aradı.':'Futbolcu alacakları masada; transfer tahtası kapalı.',dur:true};},
  alacakCevap:(k,v)=>{const O=onK(k),m=v.meseleId;
    if(O.taksitKabul){const pesin=Math.round(O.alacak/2/1000000)*1000000,kalan=O.alacak-pesin;onOde(k,pesin,'alacak','Futbolcu alacakları (taksit 1)');
      onPlanla(k,'2026-08-01',kalan,'alacak','Futbolcu alacakları (taksit 2)',null);meseleOlay(k,m,'on.taksitKabul',{pesin,kalan});onYasakKaldir(k,m);return{bilgi:'Oyuncular taksiti kabul etti.',dur:true};}
    meseleOlay(k,m,'on.taksitRet',{});return ONSEZON_ADIMLARI.alacak(k,{meseleId:m,ret:true});},
  lisans:(k,v)=>{const O=onK(k),L=O.lisans;
    const id=meseleAc(k,{tur:'onsezon',baslik:'Kulüp lisansı: eksikler',sorumluId:k.baskanId,kisiler:[]});
    k.kosullar.onsezon=Object.assign({},O,{lisans:Object.assign({},L,{meseleId:id})});
    meseleOlay(k,id,'on.lisans',{son:L.son});
    onLisansKarti(k,id,['sgk','tesis','personel']);
    onAdim(k,'lisansSon',L.son,1080);
    return{bilgi:'Kulüp lisansı dosyası açıldı.',dur:true};},
  lisansTesis:(k,v)=>{const O=onK(k),L=O.lisans;if(L.kalemler.tesis.durum!=='bekliyor')return{bilgi:null};
    const ok=L.tesisKabul;onLisansKalem(k,'tesis',ok?'kapandi':'acik');
    meseleOlay(k,L.meseleId,'on.lisansKalem',{kalem:'tesis',metin:ok?'belediye protokolü imzaladı.':'belediye protokolü reddetti; tesis kiralanmalı.'});
    if(!ok)onLisansKarti(k,L.meseleId,['tesis'],true);else onLisansTamamMi(k);
    return{bilgi:ok?'Belediye tesis protokolünü imzaladı.':'Belediye tesis protokolünü reddetti.',dur:true};},
  lisansSon:(k,v)=>{const O=onK(k),L=O.lisans,acik=Object.entries(L.kalemler).filter(([,x])=>x.durum!=='kapandi').map(([a])=>a);
    if(!acik.length)return{bilgi:null};
    const t=acik.length*ONSEZON_TEST.lisans.ceza;
    for(const a of acik)onLisansKalem(k,a,'ceza');
    onPlanla(k,tarihEkle(k.tarih,1),t,'ceza','Kulüp lisansı cezası',null);
    if(L.meseleId&&k.meseleler[L.meseleId])meseleOlay(k,L.meseleId,'on.lisansCeza',{n:acik.length,tutar:t});
    /* açık kalan kalem kartları düşer */
    for(const x of Object.values(k.isler))if(x.tur==='ajanda'&&x.veri.karar==='onLisans')delete k.isler[x.id];
    onGecmis(k,'lisansCeza',{tutar:t,n:acik.length});
    return{bilgi:`Lisans süresi doldu; ${acik.length} kalem eksik.`,dur:true};},
  hoca:(k,v)=>{const biz=onBiz(k),h=kulupHocasi(k,biz);if(!h)return{bilgi:null};
    const id=meseleAc(k,{tur:'onsezon',baslik:'Teknik direktör',sorumluId:k.baskanId,kisiler:[h.id]});
    meseleOlay(k,id,'on.hoca',{kisiId:h.id,bitis:h.sozlesme?h.sozlesme.bitis:sozlesmeBitisi(k,0)});
    onKart(k,{karar:'onHoca',baslik:'Teknik direktör: devam mı?',aciklama:`${h.ad} takımı tanıyor; tarzı ${HOCA_TARZ_ADI[h.hoca.tarz]||h.hoca.tarz}. Sezon öncesi değişim için son fırsat.`,meseleId:id,son:onSon(k,2),sinif:'rutin',ek:{hocaId:h.id}});
    return{bilgi:'Teknik direktör kararı masada.',dur:true};},
  kamp:(k,v)=>{const id=meseleAc(k,{tur:'onsezon',baslik:'Hazırlık kampı',sorumluId:k.baskanId,kisiler:[(onKisi(k,'yardimciAntrenor')||{}).id].filter(Boolean)});
    onKart(k,{karar:'onKamp',baslik:'Hazırlık kampı',aciklama:'Takım 13–20 Temmuz arası kampa girecek. Yer seçimi kasayı ve havayı belirler.',meseleId:id,son:onSon(k,2),sinif:'rutin'});
    return{bilgi:'Kamp yeri kararı masada.',dur:true};},
  kombine:(k,v)=>{const id=meseleAc(k,{tur:'onsezon',baslik:'Kombine ve loca kampanyası',sorumluId:k.baskanId,kisiler:[(onKisi(k,'maliMudur')||{}).id].filter(Boolean)});
    onKart(k,{karar:'onKombine',baslik:'Kombine fiyatı',aciklama:'Kombine satışı açılıyor. Fiyat hem kasayı hem tribünü belirler.',meseleId:id,son:onSon(k,2),sinif:'firsat'});
    return{bilgi:'Kombine kampanyası masada.',dur:true};},
  kurul:(k,v)=>{const id=meseleAc(k,{tur:'onsezon',baslik:'Olağanüstü mali genel kurul',sorumluId:k.baskanId,kisiler:[]});
    onKart(k,{karar:'onKurul',baslik:'Mali genel kurul',aciklama:`Gündem: toplam yükümlülük ve yönetime ${onPara(ONSEZON_TEST.kurul.kredi)} borçlanma yetkisi.`,meseleId:id,son:onSon(k,2),sinif:'rutin'});
    return{bilgi:'Olağanüstü mali genel kurul toplanıyor.',dur:true};},
  personel:(k,v)=>{const id=meseleAc(k,{tur:'onsezon',baslik:'Personel',sorumluId:k.baskanId,kisiler:[]});
    onPersonelKarti(k,id,['yardimciAntrenor','maliMudur']);
    return{bilgi:'Personel kararı masada.',dur:true};},
  basin:(k,v)=>{const id=meseleAc(k,{tur:'onsezon',baslik:'İlk basın toplantısı',sorumluId:k.baskanId,kisiler:[]});
    onKart(k,{karar:'onBasin',baslik:'Basın toplantısı: hedef',aciklama:'Gazeteciler sezonun hedefini soracak. Söylediğin manşet olur ve hatırlanır.',meseleId:id,son:{tarih:k.tarih,dakika:1080},sinif:'firsat'});
    return{bilgi:'Basın toplantısı bugün.',dur:true};},
  zemin:(k,v)=>{const id=meseleAc(k,{tur:'onsezon',baslik:'Stat zemini ve altyapı',sorumluId:k.baskanId,kisiler:[]});
    onKart(k,{karar:'onZemin',baslik:'Zemin mi, altyapı mı?',aciklama:'Stat zemini yorgun; gençlerin sahası da. Bu yaz ikisine birden para yetmez.',meseleId:id,son:onSon(k,2),sinif:'rutin'});
    return{bilgi:'Zemin ve altyapı kararı masada.',dur:true};}
};
GELISMELER.onsezon={
  denetle:(k,v)=>ONSEZON_ADIMLARI[v.adim]?(onK(k)?[]:['ön sezon koşulları yok']):[`bilinmeyen ön sezon adımı (${v.adim})`],
  uygula:(k,is)=>onAcik(k)?ONSEZON_ADIMLARI[is.veri.adim](k,is.veri):{bilgi:null}
};

/* ---- lisans kalemleri ---- */
function onLisansKalem(k,a,durum){const O=onK(k),L=O.lisans;
  k.kosullar.onsezon=Object.assign({},O,{lisans:Object.assign({},L,{kalemler:Object.assign({},L.kalemler,{[a]:Object.assign({},L.kalemler[a],{durum})})})});}
function onLisansKarti(k,meseleId,sira,tekrar){
  const L=onK(k).lisans,a=sira[0];if(!a)return null;
  const son=onSon(k,4),S=anDakika(son.tarih,son.dakika)<anDakika(L.son,1080)?son:{tarih:L.son,dakika:1020};
  if(anDakika(S.tarih,S.dakika)<=simdikiAn(k))return null;
  return onKart(k,{karar:'onLisans',baslik:`Lisans: ${ON_LISANS_AD[a]}`,aciklama:ON_LISANS_ACIKLAMA[a](k,L),meseleId,son:S,sinif:'sorun',ek:{kalem:a,sira:sira.slice(1),tekrar:!!tekrar}});
}
function onLisansTamamMi(k){const L=onK(k).lisans;
  if(Object.values(L.kalemler).every(x=>x.durum==='kapandi')){if(L.meseleId)meseleOlay(k,L.meseleId,'on.lisansTamam',{});onGecmis(k,'lisansTamam');
    for(const x of Object.values(k.isler))if(x.tur==='gelisme'&&x.veri.gelisme==='onsezon'&&x.veri.adim==='lisansSon')delete k.isler[x.id];}}
const ON_LISANS_ACIKLAMA={
  sgk:(k,L)=>`SGK ve vergi borcu ${onPara(L.kalemler.sgk.tutar)}. Lisans için ödenmeli ya da yapılandırılmalı.`,
  tesis:(k,L)=>'Altyapı takımları için tesis belgesi gerekiyor: belediyeyle protokol ya da kiralık saha.',
  personel:(k,L)=>'Lisanslı sağlık personeli kadroda yok: işe alım ya da mevcut kadroyla başvuru.'
};
const ON_LISANS_SECENEK={
  sgk:L=>[{id:'ode',metin:'Peşin öde',aciklama:[`${onPara(L.kalemler.sgk.tutar)} şimdi; kalem kapanır.`]},
    {id:'yapilandir',metin:'Yapılandır',aciklama:[`Şimdi ${onPara(Math.round(L.kalemler.sgk.tutar*ONSEZON_TEST.yapilandirPesin/1000000)*1000000)}, kalanı faiziyle Eylül ve Ekim'de; kalem kapanır.`]}],
  tesis:(L,tekrar)=>[{id:'kirala',metin:'Tesis kirala',aciklama:[`${onPara(L.kalemler.tesis.tutar)}; kalem kapanır.`]},
    tekrar?{id:'bekle',metin:'Bekle',aciklama:['Kalem açık kalır; süre dolarsa ceza.']}:{id:'protokol',metin:'Belediyeyle protokol',aciklama:[`Para yok; cevap ${ONSEZON_TEST.lisans.tesisBekleme} gün sonra. Reddedilebilir.`]}],
  personel:L=>[{id:'ise',metin:'Sağlıkçı işe al',aciklama:[`Sezonluk ${onPara(L.kalemler.personel.tutar)}; kalem kapanır.`]},
    {id:'mevcut',metin:'Mevcut kadroyla başvur',aciklama:['Para yok; federasyon kabul etmeyebilir. Ederse kalem kapanır, etmezse açık kalır.']}]
};
KARAR_TURLERI.onLisans={
  denetle:(k,v)=>{const h=[];if(!onK(k))h.push('ön sezon koşulları yok');if(!ON_LISANS_AD[v.kalem])h.push('lisans kalemi geçersiz');if(!Array.isArray(v.sira))h.push('sıra yok');return h;},
  secenekler:(k,is)=>ON_LISANS_SECENEK[is.veri.kalem](onK(k).lisans,is.veri.tekrar).map(o=>Object.assign({sure:15},o)),
  uygula:(k,is,secim)=>{const v=is.veri,L=onK(k).lisans,a=v.kalem,T=ONSEZON_TEST;let metin;
    if(a==='sgk'){const t=L.kalemler.sgk.tutar;
      if(secim==='ode'){onOde(k,t,'vergi','SGK ve vergi borcu (lisans)');metin=`${onPara(t)} ödendi.`;}
      else{const p=Math.round(t*T.yapilandirPesin/1000000)*1000000,kal=Math.round((t-p)*T.yapilandirFaiz/2000000)*1000000;onOde(k,p,'vergi','SGK ve vergi borcu (yapılandırma, peşin)');
        onPlanla(k,'2026-09-01',kal,'vergi','SGK ve vergi borcu (taksit)',v.meseleId);onPlanla(k,'2026-10-01',kal,'vergi','SGK ve vergi borcu (taksit)',v.meseleId);metin=`yapılandırıldı: şimdi ${onPara(p)}, iki taksit ${onPara(kal)}.`;}
      onLisansKalem(k,a,'kapandi');}
    else if(a==='tesis'){
      if(secim==='kirala'){onOde(k,L.kalemler.tesis.tutar,'kira','Altyapı tesisi kirası (lisans)');onLisansKalem(k,a,'kapandi');metin='tesis kiralandı.';}
      else if(secim==='protokol'){onLisansKalem(k,a,'bekliyor');onAdim(k,'lisansTesis',tarihEkle(k.tarih,T.lisans.tesisBekleme),690,{meseleId:v.meseleId});   /* 11:30: sabahın adımlarıyla çakışmaz */metin='belediyeye başvuruldu; cevap bekleniyor.';}
      else metin='beklemeye alındı; açık.';}
    else{
      if(secim==='ise'){onOde(k,L.kalemler.personel.tutar,'personel','Lisanslı sağlık personeli (sezonluk)');onLisansKalem(k,a,'kapandi');metin='sağlıkçı işe alındı.';}
      else{const ok=L.personelKabul;if(ok)onLisansKalem(k,a,'kapandi');metin=ok?'federasyon mevcut kadroyu kabul etti.':'federasyon mevcut kadroyu kabul etmedi; açık.';}}
    const bilgi=meseleOlay(k,v.meseleId,'on.lisansKalem',{kalem:a,metin});
    onLisansKarti(k,v.meseleId,v.sira);onLisansTamamMi(k);
    return{bilgi};},
  zamanAsimi:{metin:(k,is)=>`Cevap vermezsen ${ON_LISANS_AD[is.veri.kalem].toLocaleLowerCase('tr-TR')} açık kalır; süre dolarsa ceza.`,
    uygula:(k,is)=>{const v=is.veri,bilgi=meseleOlay(k,v.meseleId,'on.lisansKalem',{kalem:v.kalem,metin:'cevap verilmedi; açık.'});onLisansKarti(k,v.meseleId,v.sira);return{bilgi};}},
  baglam:(k,is)=>({tur:'kasa',kulupId:onBiz(k)})
};

/* ---- iki cevaplı kartlar ---- */
const onIki=(a,b)=>[Object.assign({sure:15},a),Object.assign({sure:15},b)];
KARAR_TURLERI.onDevir={
  denetle:(k,v)=>onK(k)?[]:['ön sezon koşulları yok'],
  secenekler:(k,is)=>onIki({id:'imzala',metin:'Tutanağı imzala',aciklama:['Devir tamamlanır.','Tutanakta yazmayan bir borç varsa sonra çıkar.']},
    {id:'sor',metin:'Eksikleri sor',aciklama:['Mali müdür satır satır inceler; ek tutanak yarın.','Eski başkan bundan hoşlanmaz.']}),
  uygula:(k,is,secim)=>{const v=is.veri;
    if(secim==='sor'){const e=onKisi(k,'eskiBaskan');onAdim(k,'ekTutanak',tarihEkle(k.tarih,1),600,{meseleId:v.meseleId});onGecmis(k,'kirgin');
      return{bilgi:meseleOlay(k,v.meseleId,'on.sor',{kisiId:e?e.id:k.baskanId})};}
    onAdim(k,'haciz',tarihEkle(kariyerBaslangici(k),ONSEZON_TEST.hacizGun),600);
    return{bilgi:meseleOlay(k,v.meseleId,'on.imza',{})};},
  zamanAsimi:{metin:()=>'Cevap vermezsen tutanak imzasız kalır; devir yine yürür.',
    uygula:(k,is)=>{onAdim(k,'haciz',tarihEkle(kariyerBaslangici(k),ONSEZON_TEST.hacizGun),600);return{bilgi:meseleOlay(k,is.veri.meseleId,'on.devirCevapsiz',{})};}}
};
KARAR_TURLERI.onBorc={
  denetle:(k,v)=>Number.isInteger(v.tutar)&&v.tutar>0?[]:['borç tutarı geçersiz'],
  secenekler:(k,is)=>{const t=is.veri.tutar,p=Math.round(t*ONSEZON_TEST.yapilandirPesin/1000000)*1000000;
    return onIki({id:'ode',metin:'Hemen öde',aciklama:[`${onPara(t)} kasadan.`]},{id:'yapilandir',metin:'Yapılandır',aciklama:[`Şimdi ${onPara(p)}; kalanı faiziyle Eylül ve Ekim'de.`]});},
  uygula:(k,is,secim)=>{const v=is.veri,t=v.tutar;
    if(secim==='ode'){onOde(k,t,'vergi','Eski yönetimden kalan vergi borcu');return{bilgi:meseleOlay(k,v.meseleId,'on.borcOde',{tutar:t})};}
    const p=Math.round(t*ONSEZON_TEST.yapilandirPesin/1000000)*1000000,kal=Math.round((t-p)*ONSEZON_TEST.yapilandirFaiz/2000000)*1000000;
    onOde(k,p,'vergi','Eski yönetimden kalan vergi borcu (peşin)');onPlanla(k,'2026-09-01',kal,'vergi','Vergi borcu (taksit)',v.meseleId);onPlanla(k,'2026-10-01',kal,'vergi','Vergi borcu (taksit)',v.meseleId);
    return{bilgi:meseleOlay(k,v.meseleId,'on.borcYapilandir',{pesin:p,kalan:2*kal})};},
  zamanAsimi:{metin:(k,is)=>is.veri.haciz?'Cevap vermezsen haciz uygulanır (cezalı).':'Cevap vermezsen mali müdür yapılandırmaya başvurur.',
    uygula:(k,is)=>{const v=is.veri;
      if(v.haciz){const t=Math.round(v.tutar*ONSEZON_TEST.hacizCeza/ONSEZON_TEST.hacizFaiz/1000000)*1000000;onOde(k,t,'vergi','Haciz: eski yönetimden kalan vergi borcu');onGecmis(k,'haciz',{tutar:t});
        return{bilgi:meseleOlay(k,v.meseleId,'on.hacizOldu',{tutar:t})};}
      return KARAR_TURLERI.onBorc.uygula(k,is,'yapilandir');}},
  baglam:(k,is)=>({tur:'kasa',kulupId:onBiz(k)})
};
KARAR_TURLERI.onAlacak={
  denetle:(k,v)=>Number.isInteger(v.tutar)&&v.tutar>0?[]:['alacak tutarı geçersiz'],
  secenekler:(k,is)=>{const v=is.veri;
    return onIki({id:'ode',metin:'Hemen öde',aciklama:[`${onPara(v.tutar)} kasadan; transfer tahtası açılır.`]},
      v.ret?{id:'kapali',metin:'Tahta kapalı kalsın',aciklama:['Para kasada kalır; transfer yapılamaz.','Oyuncular bir hafta sonra yeniden arar.']}
        :{id:'taksit',metin:'Taksit teklif et',aciklama:['Yarısı şimdi, yarısı Ağustos başında.','Cevap yarın; kabul etmeyebilirler.']});},
  uygula:(k,is,secim)=>{const v=is.veri,O=onK(k);
    if(secim==='ode'){onOde(k,v.tutar,'alacak','Futbolcu alacakları');const b=meseleOlay(k,v.meseleId,'on.alacakOde',{tutar:v.tutar});onYasakKaldir(k,v.meseleId);return{bilgi:b};}
    if(secim==='taksit'){onAdim(k,'alacakCevap',tarihEkle(k.tarih,1),600,{meseleId:v.meseleId});return{bilgi:meseleOlay(k,v.meseleId,'on.taksitIste',{})};}
    return onAlacakTekrar(k,v);},
  zamanAsimi:{metin:()=>'Cevap vermezsen tahta kapalı kalır; oyuncular bir hafta sonra yeniden arar.',uygula:(k,is)=>onAlacakTekrar(k,is.veri)},
  baglam:(k,is)=>({tur:'kasa',kulupId:onBiz(k)})
};
function onAlacakTekrar(k,v){const O=onK(k);
  if(O.tekrar<ONSEZON_TEST.tekrarEnCok){k.kosullar.onsezon=Object.assign({},O,{tekrar:O.tekrar+1});onAdim(k,'alacak',tarihEkle(k.tarih,ONSEZON_TEST.tekrarGun),600,{meseleId:v.meseleId});}
  return{bilgi:meseleOlay(k,v.meseleId,'on.tahtaKapali',{})};}
KARAR_TURLERI.onHoca={
  denetle:(k,v)=>(k.kisiler||{})[v.hocaId]?[]:['hoca bulunamadı'],
  secenekler:(k,is)=>{const h=k.kisiler[is.veri.hocaId];
    return onIki({id:'devam',metin:'Hocayla devam',aciklama:[`${h.ad} ile sözleşme bir yıl uzar.`,'Takım tanıdık sistemle başlar.']},
      {id:'aday',metin:'Adaylarla görüş',aciklama:['Yarın 11:00 iki aday hocayla görüşürsün.','Göreve alırsan eski hocaya tazminat.']});},
  uygula:(k,is,secim)=>{const v=is.veri,h=k.kisiler[v.hocaId];
    if(secim==='devam'){const bitis=sozlesmeBitisi(k,1),maas=h.sozlesme?h.sozlesme.maas:hocaMaasi(h);h.sozlesme={maas,bitis};
      return{bilgi:meseleOlay(k,v.meseleId,'on.hocaDevam',{kisiId:h.id,bitis})};}
    const yarin=tarihEkle(k.tarih,1);
    isEkle(k,{tur:'ajanda',tarih:yarin,dakika:660,veri:{baslik:'Hoca adaylarıyla görüşme',zorunluluk:'zorunlu',sure:60,etki:'hocaAdayGorusmesi',
      meseleId:v.meseleId,olayId:'onsezon:hoca',kulupId:onBiz(k),hocaId:h.id,adaylar:hocaAdaylari(k,onBiz(k),'onsezon'),aciklama:'İki aday hocayla sırayla görüşeceksin.'}});
    return{bilgi:meseleOlay(k,v.meseleId,'on.hocaAday',{tarih:yarin,dakika:660})};},
  zamanAsimi:{metin:(k,is)=>`Cevap vermezsen ${kisiAdi(k,is.veri.hocaId)} sözleşmesiyle devam eder.`,uygula:(k,is)=>({bilgi:meseleOlay(k,is.veri.meseleId,'on.hocaCevapsiz',{kisiId:is.veri.hocaId})})}
};
function onKampKur(k,v,tur){const T=ONSEZON_TEST.kamp,K=T[tur],bas=tarihEkle(kariyerBaslangici(k),T.bas),bitis=tarihEkle(bas,T.gun-1);
  k.kosullar.kamp={kulupId:onBiz(k),bas,bitis,yer:K.yer,tur};
  onPlanla(k,bas,K.masraf,'kamp',`Hazırlık kampı (${K.yer})`,null);
  isEkle(k,{tur:'hatirlatma',tarih:bas,dakika:480,veri:{metin:`Takım ${K.yer} kampına gitti; ${gunAyYazi(bitis)} akşamı döner.`}});
  isEkle(k,{tur:'hatirlatma',tarih:tarihEkle(bitis,1),dakika:480,veri:{metin:`Takım ${K.yer} kampından döndü.`}});
  onGecmis(k,'kamp',{yer:K.yer});
  return meseleOlay(k,v.meseleId,'on.kamp',{yer:K.yer,bas,bitis,masraf:K.masraf});}
KARAR_TURLERI.onKamp={
  denetle:()=>[],
  secenekler:(k,is)=>{const T=ONSEZON_TEST.kamp;
    return onIki({id:'yurtici',metin:`${T.yurtici.yer}'da kamp`,aciklama:[`Masraf ${onPara(T.yurtici.masraf)}.`,'Serin hava, tanıdık tesis.']},
      {id:'yurtdisi',metin:`${T.yurtdisi.yer}'da kamp`,aciklama:[`Masraf ${onPara(T.yurtdisi.masraf)}.`,'Daha iyi saha; kasa zorlanır, gazete yazar.']});},
  uygula:(k,is,secim)=>({bilgi:onKampKur(k,is.veri,secim)}),
  zamanAsimi:{metin:()=>`Cevap vermezsen yardımcı antrenör ${ONSEZON_TEST.kamp.yurtici.yer}'u ayarlar.`,uygula:(k,is)=>({bilgi:onKampKur(k,is.veri,'yurtici')})},
  baglam:(k,is)=>({tur:'kasa',kulupId:onBiz(k)})
};
function onKombineKur(k,v,secim){const K=ONSEZON_TEST.kombine[secim];
  k.kosullar.onsezon=Object.assign({},onK(k),{kombine:secim});
  paraHareketi(k,{kulupId:onBiz(k),tutar:K.gelir,kalem:'kombine',aciklama:'Kombine ve loca satışı'});
  if(secim!=='cevapsiz')onGecmis(k,'kombine',{secim});
  return meseleOlay(k,v.meseleId,'on.kombine',{secim,gelir:K.gelir});}
KARAR_TURLERI.onKombine={
  denetle:()=>[],
  secenekler:(k,is)=>{const T=ONSEZON_TEST.kombine;
    return onIki({id:'taraftar',metin:'Taraftar fiyatı',aciklama:[`Gelir ${onPara(T.taraftar.gelir)}.`,'Tribün dolar.']},{id:'yuksek',metin:'Yüksek fiyat',aciklama:[`Gelir ${onPara(T.yuksek.gelir)}.`,'Tribün seyrelir; taraftar konuşur.']});},
  uygula:(k,is,secim)=>({bilgi:onKombineKur(k,is.veri,secim)}),
  zamanAsimi:{metin:()=>'Cevap vermezsen mali müdür geçen yılın fiyatıyla açar.',uygula:(k,is)=>({bilgi:onKombineKur(k,is.veri,'cevapsiz')})},
  baglam:(k,is)=>({tur:'kasa',kulupId:onBiz(k)})
};
/* kombine iç saha doluluğunu değiştirir (js/kulup-mali.js DOLULUK_EKLERI; lig ve hazırlık maçı) */
DOLULUK_EKLERI.push((k,f)=>{const O=onK(k);if(!O||!O.kombine||f.ev!==onBiz(k))return 0;return(ONSEZON_TEST.kombine[O.kombine]||{ek:0}).ek;});
KARAR_TURLERI.onKurul={
  denetle:()=>[],
  secenekler:(k,is)=>{const T=ONSEZON_TEST.kurul;
    return onIki({id:'yetki',metin:'Borçlanma yetkisi iste',aciklama:[`${onPara(T.kredi)} kredi şimdi kasaya.`,`Geri ödeme dört taksit (${onPara(T.taksit)}); gazete borç diye yazar.`]},
      {id:'yok',metin:'İstemeyeceğim',aciklama:['Kasa olduğu gibi kalır.','Borçsuz yönetim sözü manşet olur.']});},
  uygula:(k,is,secim)=>{const v=is.veri,T=ONSEZON_TEST.kurul;
    if(secim==='yetki'){k.kosullar.onsezon=Object.assign({},onK(k),{yetki:T.kredi});paraHareketi(k,{kulupId:onBiz(k),tutar:T.kredi,kalem:'kredi',aciklama:'Genel kurul borçlanma yetkisi: kredi'});
      for(const a of T.taksitAylari){const y=Number(a)>=7?2026:2027;onPlanla(k,`${y}-${a}-01`,T.taksit,'kredi','Kredi taksiti',null);}
      onGecmis(k,'kurulYetki',{kredi:T.kredi});return{bilgi:meseleOlay(k,v.meseleId,'on.kurulYetki',{kredi:T.kredi,taksit:T.taksit})};}
    onGecmis(k,'kurulYok');return{bilgi:meseleOlay(k,v.meseleId,'on.kurulYok',{})};},
  zamanAsimi:{metin:()=>'Cevap vermezsen yetki istenmez.',uygula:(k,is)=>({bilgi:meseleOlay(k,is.veri.meseleId,'on.kurulYok',{})})},
  baglam:(k,is)=>({tur:'kasa',kulupId:onBiz(k)})
};
function onPersonelKarti(k,meseleId,sira){const rol=sira[0];if(!rol)return null;const p=onKisi(k,rol);if(!p)return onPersonelKarti(k,meseleId,sira.slice(1));
  return onKart(k,{karar:'onPersonel',baslik:`Personel: ${MESAJ_ROL[rol]||rol}`,aciklama:`${p.ad} eski yönetimden kaldı. Devam mı, yeni bir isim mi?`,meseleId,son:onSon(k,2),sinif:'rutin',ek:{rol,kisiId:p.id,sira:sira.slice(1)}});}
function personelDegistir(k,rol,T){const biz=onBiz(k),eski=onKisi(k,rol);if(!eski)return null;
  k.kisiler[eski.id]=Object.assign({},eski,{durum:'ayrildi'});
  const id=kimlikUret(k,'kisi');k.kisiler[id]={id,ad:T.ad,rol,dogumTarihi:T.dogumTarihi,kulupId:biz,durum:'aktif'};return{eski:eski.id,yeni:id};}
KARAR_TURLERI.onPersonel={
  denetle:(k,v)=>(k.kisiler||{})[v.kisiId]?[]:['personel bulunamadı'],
  secenekler:(k,is)=>{const v=is.veri,p=k.kisiler[v.kisiId],y=ONSEZON_TEST.personel.yeni[v.rol];
    return onIki({id:'devam',metin:`${p.ad} ile devam`,aciklama:['Tanıdık işler, tanıdık el.']},{id:'degis',metin:`${y?y.ad:'Yeni isim'} gelsin`,aciklama:[`${p.ad} ayrılır; tazminat ${onPara(ONSEZON_TEST.personel.tazminat)}.`,'Devrettiğin işler yeni kişiyle döner.']});},
  uygula:(k,is,secim)=>{const v=is.veri;let bilgi;
    if(secim==='degis'){const d=personelDegistir(k,v.rol,ONSEZON_TEST.personel.yeni[v.rol]);if(d){onOde(k,ONSEZON_TEST.personel.tazminat,'tazminat',`${kisiAdi(k,d.eski)} tazminatı`);
      bilgi=meseleOlay(k,v.meseleId,'on.personelYeni',{eskiId:d.eski,kisiId:d.yeni});}}
    else bilgi=meseleOlay(k,v.meseleId,'on.personelDevam',{kisiId:v.kisiId});
    onPersonelKarti(k,v.meseleId,v.sira);return{bilgi};},
  zamanAsimi:{metin:(k,is)=>`Cevap vermezsen ${kisiAdi(k,is.veri.kisiId)} devam eder.`,
    uygula:(k,is)=>{const v=is.veri,bilgi=meseleOlay(k,v.meseleId,'on.personelDevam',{kisiId:v.kisiId});onPersonelKarti(k,v.meseleId,v.sira);return{bilgi};}}
};
KARAR_TURLERI.onBasin={
  denetle:()=>[],
  secenekler:()=>onIki({id:'playoff',metin:'Hedef play-off',aciklama:['Taraftar heyecanlanır.','Söz hatırlanır; tutmazsa sorulur.']},{id:'saglam',metin:'Hedef sağlam kulüp',aciklama:['Borçsuz, sağlam bir kulüp dersin.','Tribün sabırsızlanabilir.']}),
  uygula:(k,is,secim)=>{const v=is.veri;k.kosullar.onsezon=Object.assign({},onK(k),{basin:secim});sozVer(k,{muhatap:'basin',anahtar:'on.sozHedef',p:{hedef:secim}});onGecmis(k,'basin',{hedef:secim});
    return{bilgi:meseleOlay(k,v.meseleId,'on.basin',{hedef:secim})};},
  zamanAsimi:{metin:()=>'Cevap vermezsen toplantıya çıkmamış olursun; gazete yazar.',uygula:(k,is)=>{onGecmis(k,'basin',{hedef:null});return{bilgi:meseleOlay(k,is.veri.meseleId,'on.basin',{hedef:null})};}}
};
KARAR_TURLERI.onZemin={
  denetle:()=>[],
  secenekler:()=>{const T=ONSEZON_TEST.zemin;
    return onIki({id:'zemin',metin:'Zemini yenile',aciklama:[`${onPara(T.zemin)}.`,'Statta iskele kurulur.']},{id:'altyapi',metin:'Altyapıya ayır',aciklama:[`${onPara(T.altyapi)}.`,'Gençler daha iyi gelişir (TEST).']});},
  uygula:(k,is,secim)=>{const v=is.veri,T=ONSEZON_TEST.zemin,t=T[secim];
    onOde(k,t,secim==='zemin'?'bakim':'altyapi',secim==='zemin'?'Stat zemini yenileme':'Altyapı yatırımı');
    if(secim==='altyapi')k.kosullar.onsezon=Object.assign({},onK(k),{altyapi:true});
    onGecmis(k,'zemin',{secim});return{bilgi:meseleOlay(k,v.meseleId,'on.zemin',{secim,tutar:t})};},
  zamanAsimi:{metin:()=>'Cevap vermezsen ikisi de bu yaz yapılmaz.',uygula:(k,is)=>({bilgi:meseleOlay(k,is.veri.meseleId,'on.zemin',{secim:null})})},
  baglam:(k,is)=>({tur:'kasa',kulupId:onBiz(k)})
};
/* ---- taraftar temsilcisi kapıda (js/ziyaret.js konu) ---- */
ZIYARET_KONULARI.taraftarYemegi={
  baslik:(k,v)=>`Taraftar temsilcisi: ${kisiAdi(k,v.kisiId)}`,
  konusma:(k,v)=>`TEST: ${kisiAdi(k,v.kisiId)}: “Tribün yeni yönetimi bekliyor başkanım. Kombine fiyatlarını, takımı, sözünü merak ediyorlar.”`,
  cevaplar:{soz:{metin:'Söz: bu sezon zam yok',aciklama:'Taraftara söz verirsin; tutmazsan hatırlarlar.',tepki:'Masadan memnun kalktı.'},
    yok:{metin:'Söz vermem',aciklama:'“Sonuca bakın” dersin.',tepki:'Ayrılırken soğuktu.'}},
  uygula:(k,is,secim)=>{if(secim==='soz')sozVer(k,{muhatap:is.veri.kisiId,anahtar:'on.sozZam',p:{}});}
};

/* ---- doğrulama ---- */
function onsezonDogrula(k,h){
  const O=k.kosullar&&k.kosullar.onsezon,tam=x=>Number.isInteger(x)&&x>=0;
  if(O!==undefined){
    if(!O||typeof O!=='object'||!tam(O.alacak)||!tam(O.gizliBorc)||typeof O.yasak!=='boolean'||!tam(O.tekrar)||!O.lisans||!tarihGecerliMi(O.lisans.son)
      ||!['sgk','tesis','personel'].every(a=>O.lisans.kalemler&&O.lisans.kalemler[a]&&tam(O.lisans.kalemler[a].tutar)&&['acik','bekliyor','kapandi','ceza'].includes(O.lisans.kalemler[a].durum))
      ||!(O.kombine===null||ONSEZON_TEST.kombine[O.kombine])||!(O.yetki===null||tam(O.yetki))||typeof O.altyapi!=='boolean')h.push('Ön sezon koşulları (kosullar.onsezon) geçersiz');}
  const K=k.kosullar&&k.kosullar.kamp;
  if(K!==undefined&&!(K&&typeof K==='object'&&(k.kulupler||{})[K.kulupId]&&tarihGecerliMi(K.bas)&&tarihGecerliMi(K.bitis)&&K.bas<=K.bitis&&typeof K.yer==='string'))h.push('Kamp kaydı (kosullar.kamp) geçersiz');
}
EK_DENETIMLER.push(onsezonDogrula);
