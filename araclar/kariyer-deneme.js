#!/usr/bin/env node
/* ============ Chairman — kariyer deneme aracı ============
   Kariyer verisini tarayıcısız yükler ve sözleşmeyi, takvimi ve para kaydını dener.
   Kullanım:  node araclar/kariyer-deneme.js
   - js/ortak.js, js/kadrolar.js, js/lig.js ve kariyer dosyaları (DOSYALAR) sırayla yüklenir.
   - Örnek kariyer geçerli olmalı, JSON'a çevrilip geri okununca aynı kalmalı, yeni kimlikler çakışmamalı.
   - Takvim: işler zamanında ve yalnız bir kez tamamlanmalı; zaman nasıl parçalanırsa parçalansın sonuç aynı olmalı.
   - Maliye: tutarlar kuruş tamsayısı; ödemeler bir kez işlenmeli; nakit ile bekleyen taahhütler ayrı durmalı.
   - Kayıt: bellek deposunda kaydet/yükle, önceki sağlam kayda dönüş, bozuk/yarım/yeni sürümlü kayıt bildirimi, sürüm geçişi.
     Tarayıcı deposu ayrıca: python3 araclar/kontrol.py araclar/kayit-deneme.html
   - 2.8L (2026-10-02): oyunun içeriği kaldırıldı. Oyunun yüklediği dosyalarla (OYUN_DOSYALARI) yeni kariyer içeriksiz kurulur:
     yalnız başkan ve maç günü; kayıt defterleri boş; eski (sürüm 5) kayıt nedeni söylenerek reddedilir.
   - Kural motoru oyun içeriği yerine araclar/test-icerik.js'teki TEST konusuyla sınanır: ajanda (randevu, erteleme, kaçırma, günü bitirme),
     koşula bağlı olay, iki cevaplı karar, hazır görüş, telefon konuşması, ekip işi ve geri dönüş, söz ve haber, cevapsız kalma,
     bütün karar yollarında maç sınırına kadar oynama ve araya kaydet–yükle, güvenli komut ve kayıt oturumu, antrenman gözlemi.
   - Bilerek bozulan kopyalar doğrulamada yakalanmalı.
   - Başarısız denetim "!" ile işaretlenir; en az biri başarısızsa çıkış kodu 1'dir. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const KOK=path.join(__dirname,'..');
const OYUN_DOSYALARI=['js/ortak.js','js/stadyum-tarifleri.js','js/kadrolar.js','js/lig.js','js/kariyer.js','js/takvim.js','js/maliye.js','js/ajanda.js','js/mesele.js','js/yonetim.js','js/olay.js','js/soz.js','js/mesajlar.js','js/gozlem.js',
  'js/adlar-test.js','js/kariyer-kadro.js','js/fikstur.js','js/hoca.js','js/mac-girdi.js','js/mac-sonuc.js','js/mac-okuma.js','js/lig-maclari.js','js/oyuncu-hafta.js','js/sozlesme.js','js/kulup-mali.js','js/transfer.js','js/icerik-p12.js','js/yazisma.js','js/mali-rapor.js','js/kadro-dosyasi.js','js/test-gorunum.js','js/kayit.js','js/baslangic.js'];
const DOSYALAR=OYUN_DOSYALARI.concat(['araclar/test-icerik.js','js/kariyer-ornek.js']);
/* F1 (2026-10-23): bağlam sıradan bir genel nesnedir (araclar/motor-yukle.js gibi; vm.constants.DONT_CONTEXTIFY). Eski sarılı bağlam her genel ada
   erişimi bir ara katmandan geçirdiği için kariyer 16 kulüp ve 289 oyuncuya büyüyünce araç 1 sn'den 15 sn'ye çıkmıştı */
const baglam=()=>{if(!(vm.constants&&vm.constants.DONT_CONTEXTIFY))return vm.createContext({console,Math,Date});const c=vm.createContext(vm.constants.DONT_CONTEXTIFY);c.console=console;return c;};
const ctx=baglam();
for(const f of DOSYALAR)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),ctx,{filename:f});
const al=ad=>vm.runInContext(ad,ctx);
const ORNEK=al('KARIYER_ORNEK'),LIG=al('LIG'),KADROLAR=al('KADROLAR');
const [kariyerOlustur,kariyerDogrula,kimlikUret,tarihGecerliMi]=['kariyerOlustur','kariyerDogrula','kimlikUret','tarihGecerliMi'].map(al);
const [zamanIlerlet,sonrakiGuneGec,isEkle,tarihEkle,saatYazi]=['zamanIlerlet','sonrakiGuneGec','isEkle','tarihEkle','saatYazi'].map(al);
const [paraHareketi,odemePlanla,maliDurum,paraYazi]=['paraHareketi','odemePlanla','maliDurum','paraYazi'].map(al);
const [kariyerKaydet,kariyerYukle,bellekDeposu,saglamaHesapla,KAYIT_GECISLERI]=['kariyerKaydet','kariyerYukle','bellekDeposu','saglamaHesapla','KAYIT_GECISLERI'].map(al);

let basarisiz=0;
function denetle(ad,tamam,ayrinti){
  if(!tamam)basarisiz++;
  console.log((tamam?'  ':'! ')+ad+(ayrinti?` — ${ayrinti}`:''));
}
const bolum=ad=>console.log(`\n${ad}`);
const yeni=()=>kariyerOlustur(ORNEK);
const metin=x=>JSON.stringify(x);
const yukle=k=>JSON.parse(JSON.stringify(k));        // kaydet/yükle benzetimi (gerçek kayıt 1.4'te)
const an=k=>`${k.tarih} ${saatYazi(k.gunIciDakika)}`;
const anDakikaYazi=n=>{const t=al('anTarih')(n);return `${t.tarih} ${saatYazi(t.dakika)}`;};
const reddeder=f=>{try{f();return false;}catch(e){return true;}};
/* S-a: yapay hafta — İlerle maç gününe, maç günü işi, haftanın sekiz maçı girdilerin gerçek on biriyle 0–0: her takımda 60. dakikada on birin son
   oyuncusu kulübenin ikincisiyle değişir, 70. dakikada onuncu oyuncuya kırmızı (o.degisiklik/o.kart false ile kapanır; o.duzelt(sonuc, macId) kopyayı
   değiştirir). Döner {k, once (sonuçtan hemen önce), Gi, D, biz} */
function yapayHafta(T,k,o){
  o=o||{};const KK=T('kariyerKomut'),is=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
  if(!is)throw new Error('yapay hafta: maç günü işi yok');
  for(let g=0;g<20&&!(k.tarih===is.tarih&&k.gunIciDakika===is.dakika);g++)k=KK(k,x=>T('duragaIlerle')(x)).kariyer;
  const Gi=T('macGirdisi')(k,is.veri.macId),Dg=T('haftaninDigerMaclari')(k,Gi.macId).map(f=>T('digerMacPlani')(k,f));
  k=KK(k,x=>T('ajandaIsiYap')(x,is.id)).kariyer;
  const son=(kadro,id)=>{const s={skor:[0,0],bitti:true,goller:[],sakatliklar:[],ist:{},ilk11:kadro.map(K=>K.oyuncular.map(p=>p.id)),
      degisiklikler:o.degisiklik===false?[]:kadro.map((K,t)=>({takim:t,cikan:K.oyuncular[10].ad,giren:K.yedekler[1].ad,dakika:60,sakatlik:false})),
      kartlar:o.kart===false?[]:kadro.map((K,t)=>({takim:t,no:K.oyuncular[9].no,ad:K.oyuncular[9].ad,renk:'kirmizi',dakika:70}))};
    return o.duzelt?o.duzelt(s,id):s;};
  const digerler=Dg.map(d=>({macId:d.macId,sonuc:d.hukmen?T('hukmenSonucu')(d.hukmen):son(d.secenek.kadro,d.macId),tohum:d.tohum}));
  const biz=Gi.hukmen?T('hukmenSonucu')(Gi.hukmen):son(Gi.kadro,Gi.macId);
  return{k:KK(k,x=>T('haftaSonuclariUygula')(x,Gi.macId,biz,Gi.tohum,{},digerler)).kariyer,once:k,Gi,D:Dg,biz};
}
const gecerli=k=>{const h=kariyerDogrula(k);return[h.length===0,h.join('; ')];};
const ornekMetni=metin(ORNEK);

console.log(`\nChairman kariyer deneme aracı · ${DOSYALAR.join(', ')}`);

/* ================= 1.1 veri sözleşmesi ================= */
bolum('1.1 — veri sözleşmesi');
const k=yeni();
denetle('Örnek kariyer geçerli',...gecerli(k));
denetle('Tarih, başkan ve görev',true,`${an(k)} · ${k.kisiler[k.baskanId].ad} · ${k.gorevDurumu} · ${Object.keys(k.kulupler).length} kulüp, ${Object.keys(k.kisiler).length} kişi, ${Object.keys(k.isler).length} bekleyen iş`);
const geri=yukle(k);
denetle('JSON\'a çevrilip geri okununca aynı',metin(geri)===metin(k));
denetle('Geri okunan kopya geçerli',...gecerli(geri));
const a=kimlikUret(k,'kisi'),b=kimlikUret(k,'kisi');
denetle('Yeni kimlikler farklı ve çakışmasız',a!==b&&!ORNEK.kisiler[a]&&!ORNEK.kisiler[b],`${a}, ${b}`);
denetle('Var olan kimlik yeniden verilmiyor',reddeder(()=>{const c=yeni();c.sonrakiNo.kisi=3;kimlikUret(c,'kisi');}));
const ligde=new Set(LIG.takimlar.map(t=>t.id));
for(const id of Object.keys(k.kulupler))denetle(`Kulüp ${id} ligde ve kadrolarda var`,ligde.has(id)&&!!KADROLAR[id]);
denetle('Tarih denetimi',tarihGecerliMi('2028-02-29')&&!tarihGecerliMi('2026-02-29')&&!tarihGecerliMi('2026-02-30')&&!tarihGecerliMi('2026-13-01')&&!tarihGecerliMi('28.11.2026'),
  '2028-02-29 geçerli; 2026-02-29, 2026-02-30, 2026-13-01, 28.11.2026 geçersiz');

/* ================= 1.2 takvim ================= */
bolum('1.2 — gün, gün içi zaman ve bekleyen işler');
denetle('Tarih toplama: ay, yıl ve artık gün',tarihEkle('2026-11-30',1)==='2026-12-01'&&tarihEkle('2026-12-31',1)==='2027-01-01'
  &&tarihEkle('2028-02-28',1)==='2028-02-29'&&tarihEkle('2026-03-01',-1)==='2026-02-28'&&tarihEkle('2026-11-28',365)==='2027-11-28');
{
  const c=yeni();
  zamanIlerlet(c,60);
  const t1=an(c);
  zamanIlerlet(c,13*60+30);const t2=an(c);
  zamanIlerlet(c,90);const t3=an(c);
  denetle('Gün içi ilerleme ve gece yarısı geçişi',t1==='2026-11-28 10:00'&&t2==='2026-11-28 23:30'&&t3==='2026-11-29 01:00',`${t1} → ${t2} → ${t3}`);
  const d=yeni();sonrakiGuneGec(d);
  denetle('Sonraki güne geçiş gün başlangıcına gider',an(d)==='2026-11-29 08:00',an(d));
  denetle('Zaman geri ya da kesirli ilerlemez',reddeder(()=>zamanIlerlet(yeni(),-5))&&reddeder(()=>zamanIlerlet(yeni(),1.5)));
}
{
  const c=yeni();
  const once=zamanIlerlet(c,2*1440+59);                 // 30 Kasım 09:59: iş henüz zamanında değil
  const tam=zamanIlerlet(c,1);                          // 30 Kasım 10:00: hatırlatma tamamlanır
  const sonra=zamanIlerlet(c,60);
  const kez=c.gecmis.filter(g=>g.isId==='is-1').length;
  denetle('İş tam zamanında tamamlanır',once.length===0&&tam.length===1&&tam[0].isId==='is-1'&&`${tam[0].tarih} ${saatYazi(tam[0].dakika)}`==='2026-11-30 10:00',
    tam[0]&&`${tam[0].isId} · ${tam[0].tarih} ${saatYazi(tam[0].dakika)} · "${tam[0].sonuc.metin}"`);
  denetle('Tamamlanan iş tekrar çalışmaz',sonra.length===0&&kez===1&&!c.isler['is-1']);
  const y=yukle(c);zamanIlerlet(y,5*1440);
  denetle('Kaydet/yükle benzetiminden sonra da tekrar çalışmaz',y.gecmis.filter(g=>g.isId==='is-1').length===1&&y.gecmis.length===3,`geçmişte ${y.gecmis.length} kayıt`);
  denetle('İlerlemiş kariyer geçerli',...gecerli(y));
}
{
  const A=yeni(),B=yeni(),C=yeni();
  zamanIlerlet(A,7*1440);
  for(let i=0;i<7;i++)zamanIlerlet(B,1440);
  for(let i=0;i<7*24*4;i++)zamanIlerlet(C,15);
  denetle('Zamanı parçalı ilerletmek sonucu değiştirmez',metin(A)===metin(B)&&metin(B)===metin(C),'tek adım = 7 × 1 gün = 672 × 15 dk');
}
{
  const c=yeni();
  const x=isEkle(c,{tur:'hatirlatma',tarih:'2026-11-29',dakika:900,veri:{metin:'ilk eklenen'}});
  const y=isEkle(c,{tur:'hatirlatma',tarih:'2026-11-29',dakika:900,veri:{metin:'ikinci eklenen'}});
  const z=isEkle(c,{tur:'hatirlatma',tarih:'2026-11-29',dakika:600,veri:{metin:'daha erken'}});
  const s=zamanIlerlet(c,1440+6*60).map(g=>g.isId).join(', ');   // 29 Kasım 15:00'e kadar
  denetle('Sıra: önce erken an, aynı anda önce eklenen',s===`${z}, ${x}, ${y}`,s);
  const w=isEkle(c,{tur:'hatirlatma',tarih:c.tarih,dakika:c.gunIciDakika,veri:{metin:'şimdi'}});
  const t=zamanIlerlet(c,0);
  denetle('Şu ana kurulan iş sıfır dakikalık ilerlemede tamamlanır',t.length===1&&t[0].isId===w);
  denetle('Geçmişe, bilinmeyen türde ya da bozuk veriyle iş kurulamaz',
    reddeder(()=>isEkle(yeni(),{tur:'hatirlatma',tarih:'2026-11-28',dakika:539,veri:{metin:'geç'}}))
    &&reddeder(()=>isEkle(yeni(),{tur:'yok',tarih:'2026-12-01',dakika:600,veri:{}}))
    &&reddeder(()=>isEkle(yeni(),{tur:'hatirlatma',tarih:'2026-12-01',dakika:600,veri:{metin:'x',f:()=>1}})));
}

/* ================= 1.3 maliye ================= */
bolum('1.3 — para hareketleri ve gelecekteki ödemeler');
denetle('Para yazımı',paraYazi(-320000000)==='-3.200.000,00 ₺'&&paraYazi(5)==='0,05 ₺'&&paraYazi(150000000)==='1.500.000,00 ₺',paraYazi(-320000000));
{
  const c=yeni(),m0=maliDurum(c,'demirkapi');
  denetle('Nakit ile taahhüt ayrı',m0.nakit===850000000&&m0.bekleyenGider===-320000000&&m0.bekleyenGelir===150000000&&m0.odemelerSonrasi===680000000,
    `nakit ${paraYazi(m0.nakit)} · bekleyen gider ${paraYazi(m0.bekleyenGider)} · gelir ${paraYazi(m0.bekleyenGelir)} · sonra ${paraYazi(m0.odemelerSonrasi)}`);
  zamanIlerlet(c,2*1440+180);                           // 30 Kasım 12:00: maaşlar
  const m1=maliDurum(c,'demirkapi');
  denetle('Maaş zamanında bir kez ödenir',m1.nakit===530000000&&c.hareketler.length===1&&c.hareketler[0].kaynak==='is-2',`${an(c)} · nakit ${paraYazi(m1.nakit)}`);
  const y=yukle(c);zamanIlerlet(y,10*1440);
  const m2=maliDurum(y,'demirkapi');
  denetle('Kaydet/yükle benzetiminden sonra ödemeler tekrarlanmaz',m2.nakit===680000000&&y.hareketler.length===2&&m2.bekleyenGider===0&&m2.bekleyenGelir===0,
    `${an(y)} · nakit ${paraYazi(m2.nakit)} · ${y.hareketler.length} hareket`);
  denetle('Rakip kulübün parası etkilenmez',y.kulupler.akdeniz.nakit===ORNEK.kulupler.akdeniz.nakit);
  denetle('Ödemelerden sonra kariyer geçerli',...gecerli(y));
  const i=odemePlanla(y,{kulupId:'demirkapi',tarih:tarihEkle(y.tarih,30),dakika:720,tutar:-320000000,kalem:'maas',aciklama:'Aralık maaşları'});
  denetle('Yeni ödeme planlanır, nakit değişmeden taahhüde eklenir',maliDurum(y,'demirkapi').nakit===680000000&&maliDurum(y,'demirkapi').bekleyenGider===-320000000,i);
}
{
  const c=yeni();
  for(let i=0;i<1000;i++){paraHareketi(c,{kulupId:'demirkapi',tutar:1,kalem:'deneme',aciklama:''});paraHareketi(c,{kulupId:'demirkapi',tutar:10,kalem:'deneme',aciklama:''});}
  denetle('Küçük tutarlar kuruşu kaçırmadan toplanır',c.kulupler.demirkapi.nakit===850000000+11000&&gecerli(c)[0],paraYazi(c.kulupler.demirkapi.nakit));
  denetle('Kesirli, sıfır ya da bilinmeyen kulübe hareket reddedilir',
    reddeder(()=>paraHareketi(yeni(),{kulupId:'demirkapi',tutar:0.1,kalem:'x',aciklama:''}))
    &&reddeder(()=>paraHareketi(yeni(),{kulupId:'demirkapi',tutar:0,kalem:'x',aciklama:''}))
    &&reddeder(()=>paraHareketi(yeni(),{kulupId:'yok',tutar:100,kalem:'x',aciklama:''}))
    &&reddeder(()=>odemePlanla(yeni(),{kulupId:'demirkapi',tarih:'2026-12-05',dakika:600,tutar:99.5,kalem:'x',aciklama:''})));
  const d=yeni();zamanIlerlet(d,3*1440);
  denetle('Aynı kaynaktan ikinci hareket reddedilir',reddeder(()=>paraHareketi(d,{kulupId:'demirkapi',tutar:-320000000,kalem:'maas',aciklama:'tekrar',kaynak:'is-2'})));
}

/* ================= 1.4 kayıt ve yükleme ================= */
bolum('1.4 — sürümlü yerel kayıt ve yükleme (bellek deposu)');
{
  const depo=bellekDeposu(),c=yeni();
  zamanIlerlet(c,2*1440+180);                            // maaş ödendi, sponsor bekliyor
  const s1=kariyerKaydet(depo,'kariyer-1',c);
  const y=kariyerYukle(depo,'kariyer-1');
  denetle('Kaydedilen kariyer aynen yüklenir',s1.tamam&&y.tamam&&y.kaynak==='ana'&&metin(y.kariyer)===metin(c),s1.hata||y.hata||`${an(y.kariyer)} · ${y.kariyer.kisiler['kisi-2'].ad}`);
  zamanIlerlet(y.kariyer,10*1440);
  const m=maliDurum(y.kariyer,'demirkapi');
  denetle('Yüklemeden sonra bekleyen işler bir kez çalışır, ödenmiş maaş tekrarlanmaz',
    m.nakit===680000000&&y.kariyer.gecmis.filter(g=>g.isId==='is-2').length===1&&y.kariyer.hareketler.length===2,`nakit ${paraYazi(m.nakit)}`);
  const A=yeni(),B=yeni();
  zamanIlerlet(A,7*1440);
  zamanIlerlet(B,3*1440);kariyerKaydet(depo,'kariyer-2',B);const B2=kariyerYukle(depo,'kariyer-2').kariyer;zamanIlerlet(B2,4*1440);
  denetle('Araya kaydet/yükle girmesi sonucu değiştirmez',metin(A)===metin(B2),'7 gün = 3 gün + kayıt/yükleme + 4 gün');
}
{
  const depo=bellekDeposu(),c=yeni();
  kariyerKaydet(depo,'k',c);const ilk=depo.oku('k');
  zamanIlerlet(c,1440);kariyerKaydet(depo,'k',c);
  denetle('Yeni kayıt öncekini .onceki olarak saklar, geçici dosya kalmaz',depo.oku('k.onceki')===ilk&&depo.oku('k.yeni')===null&&depo.oku('k')!==ilk);
  const saglam=depo.oku('k');
  depo.yaz('k',saglam.slice(0,Math.floor(saglam.length/2)));
  const y1=kariyerYukle(depo,'k');
  denetle('Yarım yazılmış ana kayıtta önceki sağlam kayıt yüklenir ve bildirilir',y1.tamam&&y1.kaynak==='onceki'&&y1.kariyer.tarih==='2026-11-28'&&y1.uyarilar.length===1,y1.uyarilar[0]);
  depo.yaz('k',saglam.replace('"acilisNakit":850000000,"nakit":850000000','"acilisNakit":850000000,"nakit":950000000'));   // özet değil, kariyer verisi
  const y2=kariyerYukle(depo,'k');
  denetle('Elle değiştirilmiş kayıt sağlamadan yakalanır',y2.tamam&&y2.kaynak==='onceki'&&/sağlama/.test(y2.uyarilar[0]),y2.uyarilar[0]);
  depo.yaz('k.onceki','{"oyun":"chairman"');
  const y3=kariyerYukle(depo,'k');
  denetle('Hiç sağlam kayıt yoksa açıklamalı hata',!y3.tamam&&!y3.bos&&/k:/.test(y3.hata)&&/k\.onceki:/.test(y3.hata),y3.hata);
  const y4=kariyerYukle(depo,'bos-yuva');
  denetle('Boş yuva ayrıca bildirilir',!y4.tamam&&y4.bos,y4.hata);
  depo.yaz('x','merhaba');depo.yaz('z','{"oyun":"baska"}');
  denetle('Chairman kaydı olmayan dosya reddedilir',!kariyerYukle(depo,'x').tamam&&!kariyerYukle(depo,'z').tamam,kariyerYukle(depo,'z').hata);
}
{
  const depo=bellekDeposu(),c=yeni();
  kariyerKaydet(depo,'k',c);const once=JSON.stringify(depo.adlar().map(a=>[a,depo.oku(a)]));
  const bozuk=yeni();bozuk.kulupler.demirkapi.nakit+=1;
  const s=kariyerKaydet(depo,'k',bozuk);
  denetle('Tutarsız kariyer kaydedilmez, eski kayıt dokunulmadan kalır',!s.tamam&&JSON.stringify(depo.adlar().map(a=>[a,depo.oku(a)]))===once,s.hata);
}
{
  /* ana kayıt yazılırken kesilen yazım: .yeni tamamdır; ana kayıt yarım kalır */
  const depo=bellekDeposu(),c=yeni();
  kariyerKaydet(depo,'k',c);
  const yarim=Object.assign({},depo,{yaz:(ad,m)=>depo.yaz(ad,ad==='k'?m.slice(0,100):m)});
  zamanIlerlet(c,1440);
  const s=kariyerKaydet(yarim,'k',c),y=kariyerYukle(depo,'k');
  denetle('Kesilen yazımda hata bildirilir, tamamlanmış yeni kopya yüklenir',!s.tamam&&y.tamam&&y.kaynak==='yeni'&&y.kariyer.tarih==='2026-11-29',`${s.hata} → yüklenen: ${y.kaynak}, ${y.kariyer&&an(y.kariyer)}`);
  const dolu=Object.assign({},depo,{yaz:()=>{throw new Error('depolama alanı dolu');}});
  const d2=bellekDeposu();kariyerKaydet(d2,'k',yeni());const dolu2=Object.assign({},d2,{yaz:dolu.yaz});
  const s2=kariyerKaydet(dolu2,'k',c),y2=kariyerYukle(d2,'k');
  denetle('Depo yazmayı reddederse eski kayıt korunur',!s2.tamam&&y2.tamam&&y2.kaynak==='ana'&&y2.kariyer.tarih==='2026-11-28',s2.hata);
}
{
  const zarf=veri=>{const v=JSON.stringify(veri);return`{"oyun":"chairman","bicim":1,"saglama":"${saglamaHesapla(v)}","ozet":{},"veri":${v}}`;};
  const depo=bellekDeposu(),c=yeni();
  const ileri=Object.assign({},c,{kayitSurumu:99});depo.yaz('ileri',zarf(ileri));
  const y1=kariyerYukle(depo,'ileri');
  denetle('Daha yeni sürümle yapılmış kayıt açılmaz, nedeni söylenir',!y1.tamam&&/daha yeni/.test(y1.hata),y1.hata);
  const eski=Object.assign({},c,{kayitSurumu:7});delete eski.maclar;depo.yaz('eski',zarf(eski));
  const y2=kariyerYukle(depo,'eski');
  KAYIT_GECISLERI[7]=v=>{v.maclar={};v.kayitSurumu=8;return v;};
  const y3=kariyerYukle(depo,'eski');
  delete KAYIT_GECISLERI[7];
  denetle('Eski sürüm: geçiş yoksa açıklamalı hata, varsa sırayla dönüştürülür',!y2.tamam&&/eski bir sürüm/.test(y2.hata)&&y3.tamam&&y3.gecisler.join()==='7→8,8→9,9→10,10→11'&&metin(y3.kariyer.maclar)==='{}',`${y2.hata} · deneme geçişiyle: ${y3.gecisler&&y3.gecisler.join()}`);
}
denetle('Başlangıç verisi hiçbir denemede değişmedi',metin(ORNEK)===ornekMetni);

/* ================= 2.8L boş oyun: içerik yok, iskelet çalışır ================= */
bolum('2.8L — içeriksiz yeni kariyer (oyunun yüklediği dosyalar)');
const oyunCtx=baglam();
for(const f of OYUN_DOSYALARI)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),oyunCtx,{filename:f});
const oyunAl=ad=>vm.runInContext(ad,oyunCtx);
{
  const kur=oyunAl('kariyerBaslat'),c=kur({tohum:7}),d=kur({tohum:7}),h=oyunAl('kariyerDogrula')(c);
  const say=ad=>Object.keys(oyunAl(ad)).length;
  const adlar=ad=>Object.keys(oyunAl(ad)).sort().join(',');
  const G=Object.keys(oyunAl('GIRISIMLER'));
  denetle('Oyunda yalnız P12 TEST taslağı (F6-a), G2 iskeleti (transfer teklifi, hocanın isteği, imza, sözleşme yenileme) ve H2-c yazışması (cevap, görüşme önerisi, görüşme; girişimler yalnız yaz.*) tanımlı; konuya özgü ekip görevi (genel tavsiye hariç), gözlem notu ve söz tarafı yok',
    adlar('PAKETLER')==='gelenTeklif,hocaDegerlendirme,hocaTalebi'&&adlar('GELISMELER')==='gelenTeklif,hocaBaskisi,hocaTalebi,transferImza,yazismaCevap'
    &&adlar('KARAR_TURLERI')==='gorusmeOnerisi,hocaAdayi,hocaKarari,sozlesmeYenile,teklifKarari,transferButcesi'&&adlar('KATILIM_ETKILERI')==='ekipGorusmesi,hocaAdayGorusmesi'
    &&G.length===7&&G.every(x=>/^yaz\./.test(x))&&Object.keys(oyunAl('EKIP_GOREVLERI')).filter(x=>x!=='tavsiye').length===0&&oyunAl('GOZLEM_NOTLARI').length===0&&say('SOZ_TARAFLARI')===0,
    [adlar('PAKETLER'),adlar('GELISMELER'),adlar('KARAR_TURLERI'),adlar('KATILIM_ETKILERI'),G.join(',')].join(' · '));
  denetle('Yeni kariyer geçerli; içerik sürümü 5 (F6-a), kayıt sürümü 11 (S-a)',!h.length&&c.icerik.surum===5&&c.kayitSurumu===11&&c.macOkundu===undefined,h.join('; '));
  const isler=Object.values(c.isler),ajandaIsleri=isler.filter(x=>x.tur==='ajanda');
  const kisiler=Object.values(c.kisiler),hocalar=kisiler.filter(p=>p.rol==='teknikDirektor');
  const ya=kisiler.find(p=>p.rol==='yardimciAntrenor'),mm=kisiler.find(p=>p.rol==='maliMudur');
  denetle('Kişiler başkan, 16 kulübün hocası (F3), TEST yardımcı antrenör ve mali işler müdürü (H2-c, kisi-18 ve kisi-19); koltuklar boş; mesele, olay, söz yok; tek haber müdürün açılış özeti (H2-d)',kisiler.length===19&&!!ya&&!!mm&&ya.id==='kisi-18'&&mm.id==='kisi-19'&&ya.kulupId==='demirkapi'&&mm.kulupId==='demirkapi'&&c.kisiler['kisi-1'].rol==='baskan'&&hocalar.length===16&&hocalar.every(h=>c.kulupler[h.kulupId].hocaId===h.id)&&metin(c.kulupler.demirkapi.yonetim)==='{"sayman":null,"futbol":null,"basin":null}'
    &&!Object.keys(c.meseleler).length&&!Object.keys(c.olaylar).length&&!Object.keys(c.sozler).length
    &&c.haberler.length===1&&c.haberler[0].tur==='rapor'&&c.haberler[0].anahtar==='mali.haftalik'&&c.haberler[0].p.kaynak===mm.id&&c.haberler[0].p.nakit===c.kulupler.demirkapi.nakit);
  const gel=isler.filter(x=>x.tur==='gelisme');
  denetle('Takvimde tek ajanda işi: Cumartesi 19:00 maç günü (LIG.buMac ile aynı an); yanında iki transfer hatırlatması, 1 Aralık ay başı (G2), 30 Kasım haftalık mali özet (H2-d) ve kış döneminin dört gizli transfer gelişmesi',ajandaIsleri.length===1&&ajandaIsleri[0].id==='is-1'&&ajandaIsleri[0].veri.eylem==='macGunu'
    &&ajandaIsleri[0].tarih==='2026-11-28'&&saatYazi(ajandaIsleri[0].dakika)===LIG.buMac.saat&&ajandaIsleri[0].veri.baslik==='Maç: Demirkapı SK – Akdeniz FK'
    &&isler.length===9&&isler.filter(x=>x.tur==='hatirlatma').length===2&&isler.filter(x=>x.tur==='ayBasi'&&x.tarih==='2026-12-01').length===1
    &&isler.filter(x=>x.tur==='maliRapor'&&x.tarih==='2026-11-30'&&x.dakika===540).length===1
    &&gel.length===4&&gel.every(x=>x.tarih>='2027-01-04'&&x.tarih<='2027-01-31')&&metin(gel.map(x=>x.veri.gelisme).sort())==='["gelenTeklif","gelenTeklif","gelenTeklif","hocaTalebi"]',ajandaIsleri[0]&&ajandaIsleri[0].veri.baslik);
  denetle('Aynı tohum aynı kariyeri kurar',metin(c)===metin(d));
  {const L=oyunAl('konusmaListesi')(c);
   denetle('H2-c/H2-d: Mesajlar listesinde hoca ve yardımcı (Takım ne durumda?, Görüşelim; maç oynanmadığı için maç sorusu yok) ve mali işler müdürü (Kasa ne durumda?); mesaj yok, okunmamış 0, cevap bekleyen yok',
     L.length===3&&metin(L.map(x=>x.kisi.rol).sort())==='["maliMudur","teknikDirektor","yardimciAntrenor"]'&&L.every(x=>!x.mesajlar.length&&!x.okunmamis&&!x.cevapBekliyor
       &&metin(x.girisimler.map(g=>g.ad))===(x.kisi.rol==='maliMudur'?'["Kasa ne durumda?"]':'["Takım ne durumda?","Görüşelim"]')),
     L.map(x=>x.ad+': '+x.girisimler.map(g=>g.ad).join('/')).join(' · '));}
  const o=oyunAl('ilerleOnizle')(c);
  denetle('İlerle doğrudan maç gününe gider (engel yok)',!o.engel.length&&o.durak&&o.durak.veri.eylem==='macGunu',`${o.neden}`);
  oyunAl('duragaIlerle')(c);
  denetle('Cumartesi 19:00\'da maç sınırı; kariyer geçerli',an(c)==='2026-11-28 19:00'&&!oyunAl('kariyerDogrula')(c).length,an(c));
  const g=kur({tohum:7});vm.runInContext('ZAMAN_SONRASI',oyunCtx);
  oyunAl('zamanIlerlet')(g,420);
  const r=oyunAl('gozlemBaslat')(g,60);
  denetle('Antrenman gözlemi içeriksiz de çalışır; not bırakmaz',r.neden==='bitti'&&r.not===null&&g.gecmis.filter(x=>x.tur==='gozlem').length===1&&!g.gecmis[0].not);
}
{
  const dosya=fs.readFileSync(path.join(KOK,'araclar','ornekler','kayit-eski-s5.json'),'utf8');
  const depo=oyunAl('bellekDeposu')();depo.yaz('e',dosya);
  const y=oyunAl('kariyerYukle')(depo,'e');
  denetle('İçeriği kaldırılmış eski kayıt (sürüm 5) açılmaz, nedeni söylenir; dosyaya dokunulmaz',!y.tamam&&!y.bos&&/eski bir sürüm/.test(y.hata)&&depo.oku('e')===dosya,y.hata);
  /* F1: sürüm 6 (2.8L–E içeriksiz kariyeri; araclar/ornekler/kayit-eski-s6.json o kodla üretildi) lig ve kadrolar kariyere geçtiği için açılmaz */
  const d6=fs.readFileSync(path.join(KOK,'araclar','ornekler','kayit-eski-s6.json'),'utf8');
  depo.yaz('e6',d6);const y6=oyunAl('kariyerYukle')(depo,'e6');
  denetle('Sürüm 6 kaydı açılmaz; neden lig, fikstür ve kadroların kariyere geçmesi; dosyaya dokunulmaz',!y6.tamam&&!y6.bos&&/eski bir sürüm/.test(y6.hata)&&/fikstür/.test(y6.hata)&&depo.oku('e6')===d6,y6.hata);
  /* F3: sürüm 7 (F1–F2 kariyeri; araclar/ornekler/kayit-eski-s7.json tur/f2 koduyla tohum 7'den üretildi) hocalar kariyere geçtiği için açılmaz */
  const d7=fs.readFileSync(path.join(KOK,'araclar','ornekler','kayit-eski-s7.json'),'utf8');
  depo.yaz('e7',d7);const y7=oyunAl('kariyerYukle')(depo,'e7');
  denetle('Sürüm 7 kaydı açılmaz; neden hocalar ve maçın okunması; dosyaya dokunulmaz',!y7.tamam&&!y7.bos&&/eski bir sürüm/.test(y7.hata)&&/hoca/.test(y7.hata)&&depo.oku('e7')===d7,y7.hata);
}

/* ================= F1 — sezon, fikstür ve kadrolar ================= */
bolum('3.1 — sezon, fikstür ve kadrolar (F1; oyunun yüklediği dosyalar)');
{
  const kur=oyunAl('kariyerBaslat'),c=kur({tohum:7}),S=c.sezon,F=c.fikstur,LG=oyunAl('LIG'),KD=oyunAl('KADROLAR'),ADLAR=oyunAl('ADLAR_TEST');
  const [kulupOyunculari,sezonTablosu,sonBesMac,macTohumu,puanDurumu,siradakiMac]=['kulupOyunculari','sezonTablosu','sonBesMac','macTohumu','puanDurumu','siradakiMac'].map(oyunAl);
  const ids=Object.keys(c.kulupler),uretilen=ids.filter(id=>!KD[id]);
  denetle('Ligin 16 kulübü kariyerde; öbür kulüplerin başkanı ve parası yok; kısa adlar tekil',ids.length===16&&ids[0]==='demirkapi'&&LG.takimlar.every(t=>c.kulupler[t.id]&&c.kulupler[t.id].ad===t.ad)
    &&ids.filter(id=>id!=='demirkapi').every(id=>c.kulupler[id].baskanId===null&&c.kulupler[id].nakit===0&&c.kulupler[id].yonetim===undefined)&&new Set(ids.map(id=>c.kulupler[id].kisa)).size===16,
    ids.map(id=>c.kulupler[id].kisa).join(' '));
  const boy=id=>{const D=c.kulupler[id].kadro;return D.ilk11.length+'+'+D.yedekler.length;};
  denetle('Kadrolar 22 (G1-b): Demirkapı 11+7 (5 yedek, 2 eksik) ve Akdeniz 11+8 tohumdan, üretilen 14 kulüp 11+7; hepsi gençlerle 11+11',boy('demirkapi')==='11+11'&&boy('akdeniz')==='11+11'&&uretilen.length===14&&uretilen.every(id=>boy(id)==='11+11'),
    `${boy('demirkapi')} · ${boy('akdeniz')} · ${boy(uretilen[0])}`);
  {const yas=p=>2026-Number(p.dogumTarihi.slice(0,4)),tum=ids.flatMap(id=>oyunAl('kulupOyunculari')(c,id).map((p,i)=>({p,i,id})));
   const genc=tum.filter(x=>x.i>=(x.id==='demirkapi'?18:x.id==='akdeniz'?19:18)),idNo=x=>Number(x.p.id.slice(7));
   const enBuyukEski=Math.max(...tum.filter(x=>!genc.includes(x)).map(idNo));
   denetle('Gençler (G1-b): 16 kulüpte 63 (14 × 4, Demirkapı 4, Akdeniz 3), 18–21 yaşında, kimlikleri bütün eski oyunculardan sonra; numaralar kulüpte tekil; aynı tohum aynı gençler',
     genc.length===63&&genc.every(x=>yas(x.p)>=18&&yas(x.p)<=21&&idNo(x)>enBuyukEski&&x.p.gol===0&&x.p.sari===0)&&ids.every(id=>{const N=oyunAl('kulupOyunculari')(c,id).map(p=>p.no);return new Set(N).size===N.length;})
     &&metin(oyunAl('kariyerBaslat')({tohum:7}).oyuncular)===metin(c.oyuncular),`${genc.length} genç · ${genc.slice(0,4).map(x=>x.p.ad+' '+x.p.no+' '+x.p.mevki).join(', ')}`);}
  const ayni=id=>{const D=c.kulupler[id].kadro,K=KD[id];
    return K.oyuncular.every((o,i)=>{const p=c.oyuncular[D.ilk11[i]];return p.ad===o.ad&&p.no===o.no&&metin(p.oz)===metin(o.oz)&&p.gol===(o.gol||0)&&p.sari===(o.sari||0)&&p.ayak===(o.ayak||'sag')&&p.ten===o.ten&&p.sac===o.sac&&!!p.kaptan===!!o.kaptan;})
      &&K.yedekler.every((o,i)=>{const p=c.oyuncular[D.yedekler[i]];return p.ad===o.ad&&p.no===o.no&&p.mevki===o.mevki&&metin(p.oz)===metin(o.oz);})
      &&D.ad===K.ad&&D.forma===K.forma&&metin(D.taktik)===metin(K.taktik)&&D.td.ad===K.td.ad;};
  denetle('Demirkapı ve Akdeniz kadroları js/kadrolar.js ile aynı (ad, numara, özellik, görünüş, sayaçlar, sıra, taktik, hoca)',ayni('demirkapi')&&ayni('akdeniz'));
  /* H1 (F1 borcu): yuva mevkileri motorun yuva sırasıyla (js/kariyer-kadro.js DIZILIS_YUVA_MEVKI; motorla ve hocayla tutarlılık araclar/sezon-deneme.js başında) */
  {const dm=oyunAl('dizilisMevkileri'),a=dm('4-2-3-1'),b=dm('4-3-3');
   const kural=d=>{const S=d.split('-').map(Number),os=S.slice(1,-1).reduce((x,y)=>x+y,0);return['KL',...Array(S[0]).fill('DEF'),...Array(os).fill('OS'),...Array(S[S.length-1]).fill('FV')];};
   const tamam=a[9]==='FV'&&a[10]==='OS'&&a.filter(x=>x==='FV').length===1&&b.slice(5,8).every(x=>x==='OS')&&b.slice(8).every(x=>x==='FV')
     &&metin(dm('4-4-2'))===metin(kural('4-4-2'))&&ids.every(id=>c.kulupler[id].kadro.taktik.dizilis==='4-4-2')
     &&metin(dm('3-5-2'))===metin(kural('3-5-2'))&&dm('4-4-1')===null&&dm('')===null;
   const ayrinti=`4-2-3-1 ${a.slice(5).join(' ')} · 4-3-3 ${b.slice(5).join(' ')}`;a[9]='KL';
   denetle('Diziliş mevkileri (H1): 4-2-3-1 dizin 9 forvet, 10 orta saha (10 numara); 4-3-3 dizin 8–10 forvet; 4-4-2 aritmetik kuralla aynı ve bütün kulüpler 4-4-2 (kariyerBaslat({tohum:7}).oyuncular değişmez); tabloda olmayan 3-5-2 kuralla, geçersiz null; dönen dizi kopya',
     tamam&&dm('4-2-3-1')[9]==='FV',ayrinti);}
  const bul=(id,ad)=>kulupOyunculari(c,id).find(p=>p.ad===ad)||{};
  const nail=bul('demirkapi','Nail'),yusuf=bul('demirkapi','Yusuf'),serdar=bul('akdeniz','Serdar'),volkan=bul('akdeniz','Volkan'),tarik=bul('akdeniz','Tarık');
  denetle('Eksikler oyuncu oldu: sakatlık dönüş günüyle, ceza maç sayısıyla',nail.sakat&&nail.sakat.donus==='2026-12-07'&&!nail.sakat.belirsiz&&yusuf.ceza&&yusuf.ceza.mac===1&&/Kırmızı/.test(yusuf.ceza.neden)
    &&serdar.sakat&&serdar.sakat.belirsiz===true&&volkan.sakat&&volkan.sakat.donus==='2026-11-30'&&tarik.ceza&&tarik.ceza.mac===1&&nail.oz.length===11,
    `Nail ${nail.sakat&&nail.sakat.donus} · Yusuf ${yusuf.ceza&&yusuf.ceza.neden} · Serdar belirsiz · Volkan ${volkan.sakat&&volkan.sakat.donus} · Tarık ${tarik.ceza&&tarik.ceza.neden}`);
  denetle('Oyuncu kimlikleri başkanın kulübünden başlar; sayaç bütün oyuncuları geçer; herkes bir kadroda',c.oyuncular['oyuncu-1'].ad==='Engin'&&c.oyuncular['oyuncu-1'].kulupId==='demirkapi'
    &&c.sonrakiNo.oyuncu===Object.keys(c.oyuncular).length+1&&ids.reduce((s,id)=>s+kulupOyunculari(c,id).length,0)===Object.keys(c.oyuncular).length,`${Object.keys(c.oyuncular).length} oyuncu`);
  const U=uretilen.map(id=>({id,P:kulupOyunculari(c,id),D:c.kulupler[id].kadro,t:LG.takimlar.find(t=>t.id===id)}));
  denetle('Üretilen kadrolar: adlar TEST havuzundan ve kulüp içinde tekil; numaralar tekil; ilk yuva kaleci; gol toplamı devralınan attığı gol; sarı en çok 3',
    U.every(u=>u.P.every(p=>ADLAR.includes(p.ad))&&new Set(u.P.map(p=>p.ad)).size===u.P.length&&new Set(u.P.map(p=>p.no)).size===u.P.length&&u.P[0].mevki==='KL'
      &&u.P.reduce((s,p)=>s+p.gol,0)===u.t.A&&u.P.every(p=>p.sari<=3&&!p.sakat&&!p.ceza)&&/ Hoca$/.test(u.D.td.ad)&&u.P.filter(p=>p.kaptan).length===1),
    U.slice(0,2).map(u=>`${u.D.ad}: ${u.P.slice(0,3).map(p=>p.no+' '+p.ad).join(', ')} … hoca ${u.D.td.ad}`).join(' · '));
  const ort=(P,j)=>P.reduce((s,p)=>s+p.oz[j],0)/P.length,ozOrt=P=>[0,1,2,3,4,5,6,7,9,10].reduce((s,j)=>s+ort(P.slice(1,11),j),0)/10;
  const g=U.map(u=>({id:u.id,o:ozOrt(u.P),P:3*u.t.G+u.t.B})).sort((a,b)=>b.P-a.P),dem=ozOrt(kulupOyunculari(c,'demirkapi'));
  denetle('Üretilen kadroların seviyesi tohum kadrolarıyla aynı aralıkta; tablonun üstü altından güçlü (ilk 11 saha oyuncusu ortalaması)',g.every(x=>Math.abs(x.o-dem)<9)&&g.slice(0,4).reduce((s,x)=>s+x.o,0)>g.slice(-4).reduce((s,x)=>s+x.o,0),
    `Demirkapı ${dem.toFixed(1)} · üst dört ${(g.slice(0,4).reduce((s,x)=>s+x.o,0)/4).toFixed(1)} · alt dört ${(g.slice(-4).reduce((s,x)=>s+x.o,0)/4).toFixed(1)}`);

  /* fikstür */
  const n=S.takimlar.length,hafta=h=>F.filter(f=>f.hafta===h);
  const herHafta=[...Array(S.haftaSayisi).keys()].every(i=>{const E=hafta(i+1),T=E.flatMap(f=>[f.ev,f.konuk]);return E.length===n/2&&new Set(T).size===n;});
  const ciftler=new Set(F.map(f=>f.ev+'>'+f.konuk));
  const ayna=[...Array(n-1).keys()].every(i=>hafta(i+1).every(f=>hafta(i+n).some(x=>x.ev===f.konuk&&x.konuk===f.ev)));
  denetle('Fikstür: 30 hafta × 8 maç; her takım her hafta bir maç; her sıralı çift bir kez; ikinci devre ilk devrenin yer değiştirmiş aynası',
    S.haftaSayisi===30&&F.length===240&&herHafta&&ciftler.size===240&&ayna);
  const ilk=F.find(f=>f.hafta===13&&(f.ev==='demirkapi'||f.konuk==='demirkapi'));
  denetle('13. hafta: Demirkapı – Akdeniz, Cumartesi 2026-11-28 19:00; kimlik mac-2627-13-demirkapi-akdeniz',ilk&&ilk.id==='mac-2627-13-demirkapi-akdeniz'&&ilk.tarih==='2026-11-28'&&ilk.dakika===1140,ilk&&ilk.id);
  const tutar=id=>LG.sonMaclar[id].every(x=>F.some(f=>f.hafta===x.hafta&&(x.yer==='i'?f.ev===id&&f.konuk===x.rakip:f.konuk===id&&f.ev===x.rakip)));
  denetle('Devralınan son maçlar fikstürle aynı rakip ve yerde (Demirkapı ve Akdeniz, 8–12. haftalar)',tutar('demirkapi')&&tutar('akdeniz'));
  const dengesi=k=>{let enUzun=0,evAz=99,evCok=0;
    for(const t of k.sezon.takimlar){const s=[...Array(k.sezon.haftaSayisi).keys()].map(i=>k.fikstur.find(f=>f.hafta===i+1&&(f.ev===t||f.konuk===t)).ev===t);
      const ev1=s.slice(0,n-1).filter(Boolean).length;evAz=Math.min(evAz,ev1);evCok=Math.max(evCok,ev1);
      let L=1;for(let i=1;i<s.length;i++){L=s[i]===s[i-1]?L+1:1;enUzun=Math.max(enUzun,L);}}
    return{enUzun,evAz,evCok};};
  const d=dengesi(c);
  denetle('Ev/deplasman: her takım ilk devrede 7–8 iç saha; arka arkaya aynı yer en çok 3 maç',d.evAz>=7&&d.evCok<=8&&d.enUzun<=3,`iç saha ${d.evAz}–${d.evCok} · en uzun dizi ${d.enUzun}`);
  const mi=Object.values(c.isler).find(x=>x.veri.eylem==='macGunu');
  denetle('Maç günü işi fikstürdeki 13. hafta maçına bağlı; sıradaki maç o',mi&&mi.veri.macId===ilk.id&&siradakiMac(c,'demirkapi').id===ilk.id);
  const H=Object.values(c.isler).filter(x=>x.tur==='hatirlatma').map(x=>`${x.tarih} ${saatYazi(x.dakika)} ${x.veri.metin}`);
  denetle('Kış transfer dönemi takvimde: 4 Ocak açılış, 31 Ocak kapanış hatırlatması',H.length===2&&/^2027-01-04 08:00 Kış transfer dönemi açıldı/.test(H[0])&&/^2027-01-31 20:00 Kış transfer dönemi kapandı/.test(H[1]),H.join(' · '));
  const tablo=sezonTablosu(c),eski=puanDurumu(LG);
  denetle('Puan durumu devralınan tablodan türetilir (js/lig.js puanDurumu ile aynı sıra ve puan)',metin(tablo.map(t=>[t.id,t.P,t.AV,t.O]))===metin(eski.map(t=>[t.id,t.P,t.AV,t.O])),tablo.slice(0,3).map(t=>`${t.ad} ${t.P}`).join(', '));
  denetle('Son beş maç: Demirkapı ve Akdeniz devralınan listeyle aynı; öbürlerinde devralınan kayıt yok',metin(sonBesMac(c,'demirkapi'))===metin(LG.sonMaclar.demirkapi)&&metin(sonBesMac(c,'akdeniz'))===metin(LG.sonMaclar.akdeniz)&&sonBesMac(c,'karaova').length===0);
  /* sonuç yazılınca tablo ve son maçlar ilerler (burada elle, F2'nin biçiminde; komutun kendisi 3.5'te) */
  const golK=(takim,dk)=>({id:null,no:0,takim,kk:false,dk});
  const x=kariyerOlustur(c);x.maclar[ilk.id]={skor:[2,1],tohum:oyunAl('macTohumu')(7,ilk.id),goller:[golK(0,10),golK(1,30),golK(0,70)],kartlar:[],sakatliklar:[],degisiklikler:[],sutlar:[],xg:[0,0],ilk11:null,hocalar:[x.kulupler[ilk.ev].hocaId,x.kulupler[ilk.konuk].hocaId],tarz:['direkt','konumsal'],ist:{},protokol:null};oyunAl('isIptal')(x,Object.values(x.isler).find(q=>q.veri.eylem==='macGunu').id,'deneme: maç oynandı');const t2=sezonTablosu(x),dm=t2.find(t=>t.id==='demirkapi'),ak=t2.find(t=>t.id==='akdeniz'),s5=sonBesMac(x,'demirkapi');
  denetle('Elle yazılan bir sonuçla puan durumu ve son beş maç türetilir; kariyer geçerli kalır',dm.P===24&&dm.O===13&&ak.M===3&&s5.length===5&&s5[4].hafta===13&&s5[4].a===2&&s5[0].hafta===9&&!oyunAl('kariyerDogrula')(x).length,
    `Demirkapı ${dm.P} puan, ${dm.O} maç · son: ${s5.map(m=>m.a+'-'+m.y).join(' ')}`);
  const t1=macTohumu(7,ilk.id);
  denetle('Maç tohumu dünya tohumu ve maç kimliğinden: aynı girdi aynı, başka maç ya da başka dünya farklı',t1===macTohumu(7,ilk.id)&&t1!==macTohumu(8,ilk.id)&&t1!==macTohumu(7,F[0].id)&&Number.isInteger(t1)&&t1>=0&&t1<2**32,String(t1));

  /* farklı dünyalar: fikstür ve kadrolar değişir, kurallar tutar */
  let gecerli40=0,enUzun=0,evAz=99,evCok=0,fark=0,ms=0;
  for(let tohum=100;tohum<140;tohum++){
    const t0=process.hrtime.bigint(),y=kur({tohum});ms+=Number(process.hrtime.bigint()-t0)/1e6;
    const e=dengesi(y);enUzun=Math.max(enUzun,e.enUzun);evAz=Math.min(evAz,e.evAz);evCok=Math.max(evCok,e.evCok);
    if(!oyunAl('kariyerDogrula')(y).length&&y.fikstur.find(f=>f.id===ilk.id)&&LG.sonMaclar.demirkapi.every(m=>y.fikstur.some(f=>f.hafta===m.hafta&&(f.ev==='demirkapi'||f.konuk==='demirkapi')&&(f.ev===m.rakip||f.konuk===m.rakip))))gecerli40++;
    if(metin(y.fikstur)!==metin(c.fikstur))fark++;
  }
  denetle('40 dünya tohumunda kariyer geçerli, sabit maçlar tutuyor, fikstür tohuma göre değişiyor; ev/deplasman sınırları tutuyor',gecerli40===40&&fark===40&&enUzun<=3&&evAz>=7&&evCok<=8,
    `geçerli ${gecerli40}/40 · farklı ${fark}/40 · iç saha ${evAz}–${evCok} · en uzun dizi ${enUzun} · kurulum ortalama ${(ms/40).toFixed(1)} ms`);
  /* kayıt boyutu ve komut süresi (bilgi; gözlem her oyun dakikasında bir komut çalıştırır) */
  const depo=oyunAl('bellekDeposu')(),s=oyunAl('kariyerKaydet')(depo,'f1',c),y=oyunAl('kariyerYukle')(depo,'f1');
  const k0=process.hrtime.bigint();let z=c;for(let i=0;i<50;i++)z=oyunAl('kariyerKomut')(z,q=>oyunAl('zamanIlerlet')(q,1)).kariyer;const kms=Number(process.hrtime.bigint()-k0)/1e6/50;
  denetle('Kaydet–yükle aynı kariyeri verir',s.tamam&&y.tamam&&metin(y.kariyer)===metin(c),`kayıt ${(depo.oku('f1').length/1024).toFixed(0)} KB · bir komut (kopya + doğrulama) ${kms.toFixed(2)} ms`);
  /* paylaşılan alanlar (js/kariyer.js PAYLASILAN_ALANLAR): komutlar arasında kopyalanmaz, dondurulur; yerinde yazma reddedilir, kopyala-yaz çalışır */
  const komut=oyunAl('kariyerKomut'),r1=komut(c,q=>oyunAl('zamanIlerlet')(q,1)).kariyer,r2=komut(r1,q=>oyunAl('zamanIlerlet')(q,1)).kariyer;
  const paylasilan=['sezon','fikstur','oyuncular','maclar'];
  denetle('Komut sezon, fikstür, oyuncular ve maç sonuçlarını kopyalamadan paylaşır ve dondurur; kulüpler ve takvim kopyalanır',
    paylasilan.every(a=>r1[a]===r2[a]&&Object.isFrozen(r2[a]))&&Object.isFrozen(r2.oyuncular['oyuncu-1'])&&Object.isFrozen(r2.fikstur[0])&&r1.kulupler!==r2.kulupler&&r1.isler!==r2.isler&&!Object.isFrozen(r2.kulupler));
  const yerinde=komut.bind(null,r2),onceMetin=metin(r2);
  denetle('Dondurulmuş alana yerinde yazan komut reddedilir; kariyer değişmez',reddeder(()=>yerinde(q=>{q.oyuncular['oyuncu-1'].gol=99;}))&&reddeder(()=>yerinde(q=>{q.maclar[ilk.id]={skor:[1,0]};}))
    &&reddeder(()=>yerinde(q=>{q.fikstur[0].dakika=0;}))&&metin(r2)===onceMetin&&r2.oyuncular['oyuncu-1'].gol===0);
  const r3=komut(r2,q=>{const p=q.oyuncular['oyuncu-1'];q.oyuncular=Object.assign({},q.oyuncular,{'oyuncu-1':Object.assign({},p,{gol:p.gol+1})});}).kariyer;
  denetle('Kopyala-yaz: yeni oyuncu kaydı yeni durumda, eski durum aynen; öbür oyuncular paylaşılmaya devam eder',r3.oyuncular['oyuncu-1'].gol===1&&r2.oyuncular['oyuncu-1'].gol===0
    &&r3.oyuncular['oyuncu-2']===r2.oyuncular['oyuncu-2']&&r3.oyuncular!==r2.oyuncular&&!oyunAl('kariyerDogrula')(r3).length);
  denetle('Önbellekli doğrulama tam doğrulamayla aynı karar verir: oyuncu kimlik sayacını geri alan komut reddedilir',
    reddeder(()=>komut(r3,q=>{q.sonrakiNo.oyuncu=5;}))&&oyunAl('kariyerDogrula')(Object.assign(kariyerOlustur(r3),{sonrakiNo:Object.assign({},r3.sonrakiNo,{oyuncu:5})})).length>0);

  /* bozuk kopyalar */
  const bozuk=(ad,f,beklenen)=>{const q=kariyerOlustur(c);f(q);const hh=oyunAl('kariyerDogrula')(q);denetle(ad,hh.some(e=>beklenen.test(e)),hh.slice(0,2).join(' · ')||'hata yakalanmadı');};
  bozuk('Oyuncu başka kulübün kadrosunda',q=>{const id=q.kulupler.demirkapi.kadro.yedekler.pop();q.kulupler.akdeniz.kadro.yedekler.push(id);},/bu kulübün oyuncusu değil/);
  bozuk('Kulübün oyuncusu kadroda yok',q=>{q.kulupler.karaova.kadro.yedekler.pop();},/kadroda yok/);
  bozuk('Aynı forma numarası iki oyuncuda',q=>{const D=q.kulupler.bozkaya.kadro;q.oyuncular[D.yedekler[0]].no=q.oyuncular[D.ilk11[5]].no;},/numarası iki oyuncuda/);
  bozuk('İlk 11 on bir kişi değil',q=>{q.kulupler.demirkapi.kadro.yedekler.push(q.kulupler.demirkapi.kadro.ilk11.pop());},/on bir/);
  bozuk('Bir takım aynı hafta iki maçta',q=>{const f=q.fikstur.find(x=>x.hafta===20);const g=q.fikstur.find(x=>x.hafta===20&&x!==f);g.konuk=f.ev;},/iki maçta/);
  bozuk('Maç günü fikstür dışı maça bağlı',q=>{Object.values(q.isler).find(x=>x.veri.eylem==='macGunu').veri.macId='mac-2627-99-a-b';},/fikstürdeki bir maça bağlı değil/);
  bozuk('Maç günü fikstürdeki anında değil',q=>{Object.values(q.isler).find(x=>x.veri.eylem==='macGunu').dakika=1080;},/anında değil/);
  bozuk('Devralınan haftaya sonuç yazılmış',q=>{q.maclar[q.fikstur.find(x=>x.hafta===5).id]={skor:[1,0]};},/devralınan haftada/);
  bozuk('Devralınan tablo kendi içinde tutmuyor',q=>{q.sezon.devralinan.tablo.karaova.G++;q.sezon.devralinan.tablo.karaova.B--;},/tutmuyor/);
  bozuk('Devralınan son maç fikstürde yok',q=>{q.sezon.devralinan.sonMaclar.demirkapi[0].rakip='karaova';},/fikstürde yok/);
  bozuk('Sakatlık kaydı bozuk',q=>{const p=Object.values(q.oyuncular).find(o=>o.ad==='Nail');p.sakat={neden:'x',donus:'2026-13-01'};},/sakatlık kaydı/);
}

/* ================= F3-a — hoca ve kadro seçimi ================= */
bolum('3.3 — hoca: kişi, tarz ve maç kadrosunun seçimi (F3-a)');
{
  const kur=oyunAl('kariyerBaslat'),c=kur({tohum:7}),d=kur({tohum:7}),sec=oyunAl('hocaKadroSec'),Y=oyunAl('hocaYuvalari'),ROL=oyunAl('HOCA_ROL'),TZ=oyunAl('HOCA_TARZLARI');
  const H=Object.values(c.kisiler).filter(p=>p.rol==='teknikDirektor'),kul=Object.keys(c.kulupler);
  denetle('Her kulübün tek etkin hocası; tarz altı arketipten, bilgi ve ısrar 0–1; Demirkapı Şükrü Hoca direkt, Akdeniz Nuri Hoca konumsal; aynı tohum aynı hocalar',
    H.length===16&&kul.every(id=>H.filter(h=>h.kulupId===id).length===1&&c.kisiler[c.kulupler[id].hocaId].kulupId===id)&&H.every(h=>TZ.includes(h.hoca.tarz)&&h.hoca.bilgi>=0&&h.hoca.bilgi<=1&&h.hoca.israr>=0&&h.hoca.israr<=1)
    &&c.kisiler[c.kulupler.demirkapi.hocaId].ad==='Şükrü Hoca'&&c.kisiler[c.kulupler.demirkapi.hocaId].hoca.tarz==='direkt'&&c.kisiler[c.kulupler.akdeniz.hocaId].hoca.tarz==='konumsal'
    &&metin(c.kisiler)===metin(d.kisiler),[...new Set(H.map(h=>h.hoca.tarz))].join(','));
  const T=7777,uyar=(x,id,S)=>{const D=x.kulupler[id].kadro,y=Y(D.taktik.dizilis);
    return S.ilk11.length===11&&new Set(S.ilk11.concat(S.kulube)).size===S.ilk11.length+S.kulube.length&&S.ilk11.every((o,i)=>x.oyuncular[o].mevki===ROL[y[i].rol].cizgi)&&S.kulube.length===5&&x.oyuncular[S.kulube[0]].mevki==='KL';};
  denetle('16 kulübün hepsinde on bir dizilişin yuvalarına hattıyla uyuyor (kaleci yuvada, dört defans, dört orta saha, iki forvet); kulübede beş, başta kaleci; aynı girdi aynı seçim',
    kul.every(id=>uyar(c,id,sec(c,id,'2026-11-28',T)))&&kul.every(id=>metin(sec(c,id,'2026-11-28',T))===metin(sec(d,id,'2026-11-28',T))));
  const kopya=f=>{const x=kariyerOlustur(c);f(x);return x;},bul=(x,ad)=>Object.values(x.oyuncular).find(p=>p.kulupId==='demirkapi'&&p.ad===ad);
  const x1=kopya(x=>{bul(x,'Oğuz').sakat={neden:'deneme',donus:'2026-12-20'};bul(x,'Metin').ceza={mac:1,neden:'deneme'};bul(x,'Engin').ceza={mac:2,neden:'deneme'};});
  const S1=sec(x1,'demirkapi','2026-11-28',T),ad1=S1.ilk11.concat(S1.kulube).map(id=>x1.oyuncular[id].ad);
  const hatlar=S=>S.ilk11.map(o=>x1.oyuncular[o].mevki).join('');
  denetle('Sakat ve cezalılar on birde de kulübede de yok; cezalı kalecinin yerine yedek kaleci (kulübede kaleci kalmadı); on bir yine dizilişin hatlarında',!ad1.includes('Oğuz')&&!ad1.includes('Metin')&&!ad1.includes('Engin')
    &&x1.oyuncular[S1.ilk11[0]].ad==='Tamer'&&!S1.kulube.some(o=>x1.oyuncular[o].mevki==='KL')&&hatlar(S1)==='KLDEFDEFDEFDEFOSOSOSOSFVFV',ad1.slice(0,11).join(','));
  /* bilgi: 1'de yanılgı yok (aynı tarzdaki iki hoca aynı on biri seçer), 0'da kalıcı yanılgı bazı kulüplerde başka on bir seçtirir */
  const hocaAyar=(x,a)=>{for(const h of Object.values(x.kisiler))if(h.hoca)Object.assign(h.hoca,a);};
  const b1=kopya(x=>hocaAyar(x,{bilgi:1})),b0=kopya(x=>hocaAyar(x,{bilgi:0}));
  const ilk=(x,id)=>metin(sec(x,id,'2026-11-28',T).ilk11),farkli=kul.filter(id=>ilk(b1,id)!==ilk(c,id)),farkli0=kul.filter(id=>ilk(b1,id)!==ilk(b0,id));
  const b1b=kopya(x=>{hocaAyar(x,{bilgi:1});const h=x.kisiler[x.kulupler.karaova.hocaId],y=oyunAl('kimlikUret')(x,'kisi');x.kisiler[y]=Object.assign({},h,{id:y,hoca:Object.assign({},h.hoca)});h.durum='ayrildi';x.kulupler.karaova.hocaId=y;});
  denetle('Hocanın bilgisi: tam bilgide yanılgı yok (başka kişi, aynı tarz → aynı on bir); bugünkü hocalar kulüplerin bir kısmında kusursuz seçimden ayrılıyor, bilgisiz hoca daha çoğunda (kusursuz seçim makinesi değil)',
    ilk(b1,'karaova')===ilk(b1b,'karaova')&&farkli.length>=2&&farkli.length<=12&&farkli0.length>farkli.length,`kusursuzdan farklı on bir: bugünkü hocalar ${farkli.length}/16, bilgisiz ${farkli0.length}/16`);
  /* ısrar: son on bire zayıf bir yedek yazılınca ısrarcı hoca onu tutar, ısrarsız hoca bırakır */
  const zayif=x=>{const D=x.kulupler.demirkapi.kadro,y=D.yedekler.find(id=>x.oyuncular[id].mevki==='OS'&&oyunAl('oyuncuUygunMu')(x.oyuncular[id],'2026-11-28')),i=5,eski=D.ilk11[i];
    D.ilk11[i]=y;D.yedekler=D.yedekler.filter(z=>z!==y).concat([eski]);return y;};
  let yid=null;const i1=kopya(x=>{yid=zayif(x);x.kisiler[x.kulupler.demirkapi.hocaId].hoca.israr=1;}),i0=kopya(x=>{zayif(x);x.kisiler[x.kulupler.demirkapi.hocaId].hoca.israr=0;});
  const S_i1=sec(i1,'demirkapi','2026-11-28',T),S_i0=sec(i0,'demirkapi','2026-11-28',T);
  denetle('Hocanın ısrarı: son on birdeki yedeği ısrarcı hoca tutuyor, ısrarsız hoca kulübeye alıyor',S_i1.ilk11.includes(yid)&&!S_i0.ilk11.includes(yid),`${i1.oyuncular[yid].ad}: ısrarlı ${S_i1.ilk11.includes(yid)} · ısrarsız ${S_i0.ilk11.includes(yid)}`);
  denetle('Bozuk hoca kaydı yakalanır: hocasız kulüp, bilinmeyen tarz, ikinci etkin hoca',
    kariyerDogrula(kopya(x=>{delete x.kulupler.karaova.hocaId;})).some(e=>/hocası yok/.test(e))&&kariyerDogrula(kopya(x=>{x.kisiler[x.kulupler.karaova.hocaId].hoca.tarz='kaos';})).some(e=>/tarz/.test(e))
    &&kariyerDogrula(kopya(x=>{const h=x.kisiler[x.kulupler.karaova.hocaId];x.kisiler['kisi-90']=Object.assign({},h,{id:'kisi-90'});x.sonrakiNo.kisi=95;})).some(e=>/kulübünün hocası olarak kayıtlı değil/.test(e)));
}

/* ================= F1-b — maç girdisi ================= */
bolum('3.4 — maç girdisi: kariyerden maç kadrosu ve Match seçeneği (F1-b)');
{
  const c=oyunAl('kariyerBaslat')({tohum:7}),KD=oyunAl('KADROLAR'),LG=oyunAl('LIG');
  const [macGirdisi,macKadrosu,macTohumu,sezonTablosu]=['macGirdisi','macKadrosu','macTohumu','sezonTablosu'].map(oyunAl);
  const id13='mac-2627-13-demirkapi-akdeniz',once=metin(c),G=macGirdisi(c,id13);
  const ayniKadro=(K,S)=>K.oyuncular.length===11&&K.oyuncular.every((o,i)=>o.ad===S.oyuncular[i].ad&&o.no===S.oyuncular[i].no&&metin(o.oz)===metin(S.oyuncular[i].oz)&&!!o.kaptan===!!S.oyuncular[i].kaptan)
    &&K.yedekler.length===S.yedekler.length&&metin(K.yedekler.map(o=>o.no).sort((a,b)=>a-b))===metin(S.yedekler.map(o=>o.no).sort((a,b)=>a-b));   /* F3-a: kulübe sırası hocanın (kaleci ve her hattan biri önce) */
  denetle('13. hafta: tohum maç kimliğinden, biz ev sahibi; iki hoca tohum kadrosunun (js/kadrolar.js) on birini ve beş yedeğini seçti (F3-a); kariyer değişmedi',
    G.tohum===macTohumu(7,id13)&&G.biz===0&&G.ev==='demirkapi'&&G.konuk==='akdeniz'&&ayniKadro(G.kadro[0],KD.demirkapi)&&ayniKadro(G.kadro[1],KD.akdeniz)&&metin(c)===once,
    G.kadro.map(K=>K.yedekler.map(y=>y.no).join(',')).join(' | '));
  denetle('Eksikler kadroda değil, bültende: Demirkapı 2 (Nail dönüş günüyle, Yusuf 1 maç), Akdeniz 3',G.kadro[0].eksikler.map(e=>e.ad+' '+e.donus).join(', ')==='Nail 7 Aralık, Yusuf 1 maç'
    &&G.kadro[1].eksikler.length===3&&G.kadro.every(K=>K.oyuncular.concat(K.yedekler).every(o=>!K.eksikler.some(e=>e.no===o.no))),G.kadro.map(K=>K.eksikler.map(e=>e.ad).join(',')).join(' | '));
  const B=G.bulten;
  denetle('Bülten: lig, hafta, gün, saat, puan durumu, iki tarafın son beş maçı ve adlar',B.ligAd===LG.ad&&B.hafta===13&&B.gun==='Cumartesi'&&B.saat==='19:00'&&B.oynanan===12
    &&metin(B.tablo)===metin(sezonTablosu(c))&&metin(B.son[0])===metin(LG.sonMaclar.demirkapi)&&metin(B.son[1])===metin(LG.sonMaclar.akdeniz)&&B.adlar.karaova==='Karaova Belediyespor');
  /* hocasız seçim (F3'e dek): sakat ya da cezalının yerine yedeklerden aynı mevkideki ilk uygun oyuncu */
  const kopya=f=>{const x=kariyerOlustur(c);f(x);return x;},bul=(x,ad)=>Object.values(x.oyuncular).find(p=>p.kulupId==='demirkapi'&&p.ad===ad);
  const x1=kopya(x=>{bul(x,'Oğuz').sakat={neden:'deneme',donus:'2026-12-20'};}),K1=macKadrosu(x1,'demirkapi','2026-11-28');
  denetle('Sakat sağ kanadın yerine ilk uygun orta saha yedeği girer; kulübede kalan dört yedek ve bir genç (G1-b: kadro 22)',K1.oyuncular[5].ad==='Hakan'&&K1.yedekler.map(y=>y.ad).join()==='Tamer,Levent,Murat,Sinan,Umut'&&K1.eksikler.some(e=>e.ad==='Oğuz'),
    K1.oyuncular.map(o=>o.no).join(','));
  const x2=kopya(x=>{bul(x,'Engin').ceza={mac:1,neden:'deneme'};bul(x,'Cengiz').ceza={mac:1,neden:'deneme'};}),K2=macKadrosu(x2,'demirkapi','2026-11-28');
  denetle('Cezalı kalecinin yerine yedek kaleci; cezalı kaptanın yerine en yaşlı saha oyuncusu kaptan',K2.oyuncular[0].ad==='Tamer'&&K2.oyuncular.filter(o=>o.kaptan).length===1&&!K2.oyuncular.some(o=>o.ad==='Cengiz'),
    'kaptan '+(K2.oyuncular.find(o=>o.kaptan)||{}).ad);
  denetle('Sakatlığı bitmiş oyuncu oynar: Nail 7 Aralık\'ta dönüyor (14. hafta 5 Aralık dışarıda, 15. hafta 12 Aralık kadroda)',macKadrosu(c,'demirkapi','2026-12-05').eksikler.some(e=>e.ad==='Nail')&&!macKadrosu(c,'demirkapi','2026-12-12').eksikler.some(e=>e.ad==='Nail'));
  const x3=kopya(x=>{for(const p of Object.values(x.oyuncular))if(p.kulupId==='karaova'&&p.mevki!=='KL')p.sakat={neden:'deneme',donus:'2027-06-01'};});
  denetle('On bir uygun oyuncu çıkaramayan kulübün maç kadrosu kurulmaz (açık hata)',reddeder(()=>macKadrosu(x3,'karaova','2026-11-28'))&&reddeder(()=>macGirdisi(c,'mac-2627-99-a-b')));
  const f14=c.fikstur.find(f=>f.hafta===14&&(f.ev==='demirkapi'||f.konuk==='demirkapi')),G14=macGirdisi(c,f14.id);
  const hat=K=>[...new Set(K.yedekler.map(y=>y.mevki))].sort().join(',');
  denetle('Kulübede kaleci ve her hattan (DEF, OS, FV) oyuncu; üretilen bütün kulüplerde ve tohum kadrolarında (F1-b incelemesi)',
    Object.keys(c.kulupler).every(id=>hat(macKadrosu(c,id,'2026-11-28'))==='DEF,FV,KL,OS'),Object.keys(c.kulupler).slice(0,3).map(id=>id+' '+macKadrosu(c,id,'2026-11-28').yedekler.map(y=>y.mevki).join('-')).join(' · '));
  denetle('14. hafta: biz fikstürdeki tarafımız; üretilen rakip kadro 11 + 5 yedek',G14.biz===(f14.konuk==='demirkapi'?1:0)&&G14.kadro.every(K=>K.oyuncular.length===11&&K.yedekler.length===5)&&G14.kadro[G14.biz].id==='demirkapi',
    `${f14.id} · biz ${G14.biz}`);
  /* motor: kariyerden kurulan 13. hafta maçı hocaların tarzıyla kurulur (F3-a; eskiden kariyersiz MAC_KADRO maçıyla birebir aynıydı — kulübe sırası artık
     hocanın) ve aynı girdiyle iki kez aynı oynanır (santradan sonra 2400 adım) */
  const {motorYukle}=require('./motor-yukle'),M=motorYukle().ctx,MG=a=>vm.runInContext(a,M),Match=MG('Match'),ONCESI=MG('MAC_ONCESI');
  const Gm=MG('macGirdisi')(MG('kariyerBaslat')({tohum:7}),id13);
  const oyna=kadro=>{const m=new Match(()=>{},{kadro,tohum:Gm.tohum,tunel:{x:0,z:-6},tarz:Gm.tarz.slice()});for(let n=0;n<3000;n++){if(n===600&&ONCESI.includes(m.phase))m.macaGec();m.step(1/60);}
    return metin({s:m.sonucKaydi(),p:m.players.map(p=>[p.x.toFixed(4),p.z.toFixed(4)]),b:[m.ball.x.toFixed(4),m.ball.z.toFixed(4)]});};
  const mt=new Match(()=>{},{kadro:Gm.kadro,tohum:Gm.tohum,tunel:{x:0,z:-6},tarz:Gm.tarz.slice()}),tb=[0,1].map(t=>MG('tarzBaskin')(mt,t));
  denetle('Motor: kariyer maçı iki hocanın tarzıyla kurulur (Demirkapı direkt, Akdeniz konumsal) ve aynı girdiyle birebir aynı oynanır',metin(tb)===metin(Gm.tarz)&&metin(Gm.tarz)==='["direkt","konumsal"]'&&oyna(Gm.kadro)===oyna(Gm.kadro),tb.join(' · '));
}

/* ================= F2 — maç sonucu ================= */
bolum('3.5 — maç sonucunun kariyere bir kez işlenmesi (F2)');
{
  const T=oyunAl,KK=T('kariyerKomut'),uygula=T('macSonucuUygula'),id13='mac-2627-13-demirkapi-akdeniz',toh13=T('macTohumu')(7,id13);
  const red=f=>{try{f();return'';}catch(e){return e.message;}};
  const c0=KK(T('kariyerBaslat')({tohum:7}),x=>T('duragaIlerle')(x)).kariyer,c1=KK(c0,x=>T('ajandaIsiYap')(x,'is-1')).kariyer;   // c0 maç sınırında (iş bekliyor), c1 maç günü işi yapıldı
  const O=(k,kl,no)=>T('kulupOyunculari')(k,kl).find(p=>p.no===no);
  const S=o=>Object.assign({skor:[0,0],bitti:true,goller:[],kartlar:[],sakatliklar:[],degisiklikler:[],ist:{sut:[5,3],isabet:[2,1],korner:[3,1],faul:[6,7],sari:[0,0],kirmizi:[0,0],ofsayt:[1,0],sahiplik:[0.5523,0.4477]}},o);
  const gol=(t,kl,no,dk,kk)=>({ad:O(c1,kl,no).ad,no,takim:t,kendiKalesine:!!kk,dakika:dk});
  const kart=(t,kl,no,renk,dk)=>({ad:O(c1,kl,no).ad,no,takim:t,renk,neden:null,dakika:dk});
  const sak=(t,kl,no,tur,bolge,derece,gun,dk)=>({ad:O(c1,kl,no).ad,no,takim:t,tur,bolge,derece,dakika:dk,gun});
  /* 2–1: Kadir; Yaşar kendi kalesine; Orhan. Kartlar: Ziya (3 sarılı) sarı, Selçuk iki sarı, İlyas kırmızı, Turgut (3 sarılı) sarı + kırmızı.
     Sakatlık: Cengiz diz tedavi 5 gün, Oğuz arka adale çıkış 12 gün, Halil bilek ağrı, Erdal kramp */
  const S13=S({skor:[2,1],goller:[gol(0,'demirkapi',9,20),gol(0,'akdeniz',2,55,true),gol(1,'akdeniz',9,70)],
    kartlar:[kart(0,'demirkapi',4,'sari',30),kart(0,'demirkapi',8,'sari',35),kart(0,'demirkapi',8,'ikinciSari',60),kart(1,'akdeniz',5,'kirmizi',41),kart(1,'akdeniz',4,'sari',12),kart(1,'akdeniz',4,'kirmizi',80)],
    sakatliklar:[sak(0,'demirkapi',5,'temas','diz','tedavi',5,33),sak(0,'demirkapi',7,'kas','arkaAdale','cikis',12,50),sak(1,'akdeniz',7,'temas','bilek','agri',1,64),sak(0,'demirkapi',10,'kramp','baldir','tedavi',0,88)],
    degisiklikler:[{takim:0,cikan:'Oğuz',giren:'Hakan',dakika:51,sakatlik:true}]});
  const fk12=c1.fikstur.find(f=>f.hafta===12);
  denetle('Red: fikstürde olmayan maç, devralınan hafta, maç günü işi beklerken, bitmemiş maç, yanlış tohum, kadroda olmayan kart sahibi ve golcü',
    /fikstürde/.test(red(()=>KK(c1,x=>uygula(x,'mac-yok',S13,toh13))))&&/devralınan/.test(red(()=>KK(c1,x=>uygula(x,fk12.id,S13,T('macTohumu')(7,fk12.id)))))
    &&/hâlâ bekliyor/.test(red(()=>KK(c0,x=>uygula(x,id13,S13,toh13))))&&/bitmemiş/.test(red(()=>KK(c1,x=>uygula(x,id13,Object.assign({},S13,{bitti:false}),toh13))))
    &&/tohum/.test(red(()=>KK(c1,x=>uygula(x,id13,S13,toh13^1))))&&/kadrosuyla uyuşmuyor/.test(red(()=>KK(c1,x=>uygula(x,id13,S({kartlar:[{ad:'Kimse',no:77,takim:0,renk:'sari',dakika:5}]}),toh13))))
    &&/kadrosuyla uyuşmuyor/.test(red(()=>KK(c1,x=>uygula(x,id13,S({skor:[1,0],goller:[{ad:'Kimse',no:77,takim:0,kendiKalesine:false,dakika:5}]}),toh13)))),
    red(()=>KK(c0,x=>uygula(x,id13,S13,toh13))));
  {const z=kariyerOlustur(c1);z.gunIciDakika=1080;
   denetle('Red: zaman maç anından önceyse',/maç anından önce/.test(red(()=>uygula(z,id13,S13,toh13))));}
  const once1=metin(c1),R=KK(c1,x=>uygula(x,id13,S13,toh13,{protokol:{id:'rakipTokalasma',secim:'selam',an:3.5}})),k=R.kariyer,M13=k.maclar[id13];
  denetle('Sonuç kimlikle yazılır: skor, tohum, goller (kendi kalesine golcü rakipten), kartlar, sakatlıklar, değişiklik, istatistik, protokol; başlangıç kopyası değişmedi',
    metin(M13.skor)==='[2,1]'&&M13.tohum===toh13&&metin(M13.goller.map(g=>[g.id,g.takim,g.kk]))===metin([[O(c1,'demirkapi',9).id,0,false],[O(c1,'akdeniz',2).id,0,true],[O(c1,'akdeniz',9).id,1,false]])
    &&M13.kartlar.length===6&&M13.kartlar.every(c=>/^oyuncu-/.test(c.id))&&M13.sakatliklar.length===4&&M13.degisiklikler[0].dk===51&&M13.ist.sahiplik[0]===0.552
    &&M13.protokol.secim==='selam'&&metin(c1)===once1&&!('ad' in M13.goller[0]),metin(M13.goller));
  const tb=T('sezonTablosu')(k),dm=tb.find(t=>t.id==='demirkapi'),ak=tb.find(t=>t.id==='akdeniz'),s5=T('sonBesMac')(k,'demirkapi');
  denetle('Puan durumu ve son beş maç ilerler: Demirkapı 24 puan 13 maç (20–14), Akdeniz 3. mağlubiyet; son maç 13. hafta 2–1',dm.P===24&&dm.O===13&&dm.A===20&&dm.Y===14&&ak.M===3&&ak.O===13
    &&s5.length===5&&s5[4].hafta===13&&s5[4].a===2&&s5[4].y===1&&T('kulubunSonMaci')(k,'demirkapi').f.id===id13,`${dm.P} puan, ${dm.A}-${dm.Y}`);
  const gm=k.gecmis.filter(g=>g.tur==='mac'),is=Object.values(k.isler).filter(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
  const f14=k.fikstur.find(f=>f.hafta===14&&(f.ev==='demirkapi'||f.konuk==='demirkapi'));
  denetle('Geçmişte maç kaydı (19:00); oda Cumartesi 21:00; sıradaki maç günü işi tek: 14. hafta 5 Aralık 19:00',gm.length===1&&gm[0].macId===id13&&gm[0].dakika===1140&&an(k)==='2026-11-28 21:00'
    &&is.length===1&&is[0].veri.macId===f14.id&&is[0].tarih==='2026-12-05'&&is[0].dakika===1140&&R.sonuc.siradakiIsId===is[0].id&&!R.sonuc.durdu,`${an(k)} · ${is.map(x=>x.veri.macId)}`);
  const P=(kl,no)=>O(k,kl,no),cz=p=>p.ceza?p.ceza.mac+' '+p.ceza.neden:'-';
  denetle('Gol sayaçları: Kadir ve Orhan +1, kendi kalesine atan Yaşar sayılmaz',P('demirkapi',9).gol===6&&P('akdeniz',9).gol===7&&P('akdeniz',2).gol===0);
  denetle('Kartlar (TEST kuralı): 4. sarı 1 maç; iki sarı 1 maç ve sarılar birikmez; kırmızı 1 maç; sarı + kırmızı ve 4. sarı aynı maçta 2 maç',
    P('demirkapi',4).sari===4&&cz(P('demirkapi',4))==='1 4 sarı kart'&&P('demirkapi',8).sari===0&&cz(P('demirkapi',8))==='1 İki sarı kart'&&cz(P('akdeniz',5))==='1 Kırmızı kart'
    &&P('akdeniz',4).sari===4&&cz(P('akdeniz',4))==='2 Kırmızı kart · 4 sarı kart',[4,8].map(n=>cz(P('demirkapi',n))).concat([5,4].map(n=>cz(P('akdeniz',n)))).join(' | '));
  denetle('Maçı oynamayan cezalılar (Yusuf, Tarık) cezasını çekti',P('demirkapi',20).ceza===null&&P('akdeniz',23).ceza===null);
  denetle('Sakatlık: Cengiz diz 3 Aralık, Oğuz arka adale 10 Aralık; ağrı ve kramp yazılmaz; eski sakatlar (Nail, Volkan) yerinde',
    metin(P('demirkapi',5).sakat)==='{"neden":"Diz","donus":"2026-12-03"}'&&metin(P('demirkapi',7).sakat)==='{"neden":"Arka adale","donus":"2026-12-10"}'
    &&P('akdeniz',7).sakat===null&&P('demirkapi',10).sakat===null&&P('demirkapi',18).sakat.donus==='2026-12-07'&&P('akdeniz',21).sakat.donus==='2026-11-30');
  denetle('İkinci uygulama reddedilir; dondurulmuş sonuca yerinde yazılamaz; kariyer geçerli',/zaten uygulanmış/.test(red(()=>KK(k,x=>uygula(x,id13,S13,toh13))))&&reddeder(()=>{k.maclar[id13].skor[0]=5;})&&!T('kariyerDogrula')(k).length);
  {const d=T('bellekDeposu')();T('kariyerKaydet')(d,'y',k);const y=T('kariyerYukle')(d,'y');
   denetle('Kaydet–yükle: aynı kariyer; yüklenen kariyerde sonuç ikinci kez uygulanamaz',y.tamam&&metin(y.kariyer)===metin(k)&&/zaten uygulanmış/.test(red(()=>KK(y.kariyer,x=>uygula(x,id13,S13,toh13)))));}
  {const r1=KK(c1,x=>uygula(x,id13,S({sakatliklar:[sak(0,'demirkapi',5,'temas','diz','tedavi',5,20),sak(0,'demirkapi',5,'temas','bilek','tedavi',1,70)]}),toh13)).kariyer;
   const r2=KK(c1,x=>uygula(x,id13,S({sakatliklar:[sak(0,'demirkapi',5,'temas','bilek','tedavi',1,20),sak(0,'demirkapi',5,'temas','diz','tedavi',5,70)]}),toh13)).kariyer;
   denetle('Aynı maçta iki sakatlık: sıradan bağımsız en uzun dönüş kalır (F2 incelemesi)',metin(O(r1,'demirkapi',5).sakat)==='{"neden":"Diz","donus":"2026-12-03"}'&&metin(O(r2,'demirkapi',5).sakat)===metin(O(r1,'demirkapi',5).sakat),
     metin(O(r1,'demirkapi',5).sakat)+' · '+metin(O(r2,'demirkapi',5).sakat));}
  {const z=kariyerOlustur(c1);z.oyuncular[O(c1,'akdeniz',21).id].sakat.donus='2026-11-28';const r=KK(z,x=>uygula(x,id13,S13,toh13)).kariyer;
   denetle('Dönüşü gelmiş sakatlık temizlenir (Volkan bugün dönüyor)',O(r,'akdeniz',21).sakat===null);}
  {const z=kariyerOlustur(c1);T('isEkle')(z,{tur:'hatirlatma',tarih:'2026-11-28',dakika:1200,veri:{metin:'Deneme hatırlatması'}});
   T('isEkle')(z,{tur:'ajanda',tarih:'2026-11-28',dakika:1230,veri:{baslik:'Deneme randevusu',aciklama:'',zorunluluk:'istege',sure:30}});
   const r=KK(z,x=>uygula(x,id13,S13,toh13)),y=r.kariyer,ra=Object.values(y.isler).find(x=>x.veri&&x.veri.baslik==='Deneme randevusu');
   denetle('Maçtan sonra arada anı gelen ajanda işinde durulur (kaçırılmaz); hatırlatma tamamlanır; sıradaki maç günü yine kurulur',an(y)==='2026-11-28 20:30'&&r.sonuc.durdu&&!!ra
     &&y.gecmis.some(g=>g.tur==='is'&&g.sonuc&&g.sonuc.metin==='Deneme hatırlatması')&&Object.values(y.isler).some(x=>x.veri&&x.veri.eylem==='macGunu'),an(y));}
  /* 14. hafta: yeni uygunlukla maç girdisi; sonucu cezaları düşürür (öbür kulübün cezası yalnız bizimle oynayınca düşer: TEST sınırı) */
  let k14=KK(k,x=>T('duragaIlerle')(x)).kariyer;
  denetle('14. hafta: İlerle maç gününe gider',an(k14)==='2026-12-05 19:00',an(k14));
  k14=KK(k14,x=>T('ajandaIsiYap')(x,is[0].id)).kariyer;
  const G14=T('macGirdisi')(k14,f14.id),biz14=G14.kadro[G14.biz],eks=biz14.eksikler.map(e=>e.ad).sort().join(',');
  denetle('14. hafta kadrosu: cezalı Ziya ve Selçuk, sakat Oğuz ve Nail dışarıda; cezası biten Yusuf ve iyileşen Cengiz uygun',eks==='Nail,Oğuz,Selçuk,Ziya'
    &&biz14.oyuncular.concat(biz14.yedekler).some(o=>o.ad==='Cengiz')&&!biz14.eksikler.some(e=>e.ad==='Yusuf'),eks);
  const k15=KK(k14,x=>uygula(x,f14.id,S(),G14.tohum)).kariyer;
  denetle('14. haftanın sonucu: Ziya ve Selçuk cezasını çekti; Turgut (Akdeniz, başka maçta) cezası yerinde (TEST sınırı); 15. haftanın işi kuruldu',
    O(k15,'demirkapi',4).ceza===null&&O(k15,'demirkapi',8).ceza===null&&O(k15,'akdeniz',4).ceza.mac===2&&Object.values(k15.isler).some(x=>x.veri&&x.veri.eylem==='macGunu'&&x.tarih==='2026-12-12'));
  /* sezonun sonuna dek 0–0 (F6-a: galibiyetsiz seri P12 konusunu açar; karar cevapsız kalır, İlerle maç gününe dek birkaç kez durur) */
  let ks=k15,n=0;
  for(;n<30;n++){const j=Object.values(ks.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');if(!j)break;
    for(let g=0;g<12&&!(ks.tarih===j.tarih&&ks.gunIciDakika===j.dakika);g++)ks=KK(ks,x=>T('duragaIlerle')(x)).kariyer;ks=KK(ks,x=>T('ajandaIsiYap')(x,j.id)).kariyer;ks=KK(ks,x=>uygula(x,j.veri.macId,S(),T('macTohumu')(7,j.veri.macId))).kariyer;}
  const ts=T('sezonTablosu')(ks).find(t=>t.id==='demirkapi');
  denetle('Sezon sonuna dek: 30. haftadan sonra maç günü işi kurulmaz; Demirkapı 30 maç; kariyer geçerli',n===16&&ts.O===30&&!Object.values(ks.isler).some(x=>x.veri&&x.veri.eylem==='macGunu')&&!T('kariyerDogrula')(ks).length,
    `${n} hafta daha · ${an(ks)} · ${ts.O} maç`);
  const bozuk=(ad,f,re)=>{const x=kariyerOlustur(k);f(x);const h=T('kariyerDogrula')(x);denetle(ad,h.some(e=>re.test(e)),h.slice(0,2).join(' · ')||'hata yakalanmadı');};
  bozuk('Bozuk sonuç: gol kayıtları skorla tutmuyor',x=>{x.maclar[id13].goller.pop();},/skorla tutmuyor/);
  bozuk('Bozuk sonuç: tohum maçın değil',x=>{x.maclar[id13].tohum=1;},/tohum/);
  bozuk('Bozuk sonuç: kart kaydındaki oyuncu yok',x=>{x.maclar[id13].kartlar[0].id='oyuncu-9999';},/bulunamadı/);
  {const x=kariyerOlustur(k),id=O(k,'demirkapi',4).id;x.oyuncular[id].kulupId='karaova';const D=x.kulupler.demirkapi.kadro;D.yedekler=D.yedekler.filter(y=>y!==id);D.ilk11=D.ilk11.map(y=>y===id?D.yedekler.shift():y);x.kulupler.karaova.kadro.yedekler.push(id);
   x.oyuncular[id].no=77;const h=kariyerDogrula(x).filter(e=>/^Maç /.test(e));
   denetle('Transfer edilen oyuncunun eski maç kayıtları geçerli kalır (doğrulama bugünkü kulübe bakmaz)',!h.length,h.slice(0,2).join(' · '));}
  /* gerçek motor: kısaltılmış maç (macSuresiDk 6; kural denemesi, denge değil) kariyerden kurulur, sonucu kimlikle işlenir. Dünya tohumu 3:
     kısa maç 1–2 biter, gollerden biri kendi kalesine (F2 incelemesi: tohum 7'nin 0–0'ı gol eşlemesini sınamıyordu; F3-a: hocaların tarzıyla tohum 3
     0–0 bitti, tohum 25 seçildi) */
  const {motorYukle}=require('./motor-yukle'),MC=motorYukle().ctx,MG=a=>vm.runInContext(a,MC);vm.runInContext('MOTOR_AYAR.macSuresiDk=6',MC);
  let m0=MG('kariyerBaslat')({tohum:25});m0=MG('kariyerKomut')(m0,x=>MG('duragaIlerle')(x)).kariyer;m0=MG('kariyerKomut')(m0,x=>MG('ajandaIsiYap')(x,'is-1')).kariyer;
  const Gm=MG('macGirdisi')(m0,id13),mm=new (MG('Match'))(()=>{},{kadro:Gm.kadro,tohum:Gm.tohum,tunel:{x:0,z:-6},tarz:Gm.tarz.slice()});
  mm.macaGec();for(let i=0;i<60*60*30&&mm.phase!=='fulltime';i++)mm.step(1/60);
  const SK=mm.sonucKaydi(),mk=MG('kariyerKomut')(m0,x=>MG('macSonucuUygula')(x,id13,SK,Gm.tohum)).kariyer,MK=mk.maclar[id13];
  const kul=(g,kk)=>((kk?1-g.takim:g.takim)===1?'akdeniz':'demirkapi'),Om=id=>mk.oyuncular[id],O0=id=>m0.oyuncular[id];
  denetle('Gerçek motor (kısa maç, dünya tohumu 25): goller (kendi kalesine dahil; aynı oyuncu iki yöne), kartlar ve sakatlıklar kimlikle işlenir; golcünün sayacı artar, kendi kalesine atanınki artmaz; kariyer geçerli',
    SK.bitti&&metin(MK.skor)===metin(SK.skor)&&SK.goller.length>=2&&SK.goller.some(g=>g.kendiKalesine)&&MK.goller.length===SK.goller.length&&MK.kartlar.length===SK.kartlar.length&&MK.sakatliklar.length===SK.sakatliklar.length
    &&MK.goller.every(g=>g.id&&Om(g.id).kulupId===kul(g,g.kk)&&Om(g.id).gol===O0(g.id).gol+MK.goller.filter(x=>x.id===g.id&&!x.kk).length)
    &&MK.kartlar.every(c=>c.id&&Om(c.id).kulupId===kul(c,false))&&!MG('kariyerDogrula')(mk).length,`${SK.skor.join('-')} · ${SK.goller.length} gol, ${SK.kartlar.length} kart, ${SK.sakatliklar.length} sakatlık`);
  /* F3-b: şutlar kimlikle ve konum xG'siyle; beklenen gol şut listesinden; maçın on biri kayıtta ve iki kulübün kadro.ilk11'inde (hocanın son on biri) */
  const bg=MG('macBeklenenGol')(MK.sutlar);
  denetle('Gerçek motor: şutlar kimlikle, beklenen gol şut listesinden (iki takım), maçın on biri kayıtta ve kadronun son on biri oldu; pas istatistiği kayıtta',
    SK.sutlar.length>0&&MK.sutlar.length===SK.sutlar.length&&MK.sutlar.every(x=>x.id&&Om(x.id).kulupId===(x.takim?'akdeniz':'demirkapi')&&x.xg>=0&&x.xg<=1)
    &&metin(MK.xg)===metin(bg)&&MK.xg[0]+MK.xg[1]>0&&metin(MK.ilk11)===metin(Gm.kadro.map(K=>K.oyuncular.map(o=>o.id)))
    &&metin(mk.kulupler.demirkapi.kadro.ilk11)===metin(MK.ilk11[0])&&metin(mk.kulupler.akdeniz.kadro.ilk11)===metin(MK.ilk11[1])&&MK.ist.pas[0]>0&&MK.ist.pasTamam[0]<=MK.ist.pas[0],
    `şut ${MK.sutlar.length} · xG ${MK.xg.join(' – ')} · pas ${MK.ist.pas.join('/')} · uzun ${MK.ist.uzunPas.join('/')}`);

  /* ===== 3.2 (F3-b): maçın okunması — aynı gerçek maçın kaydından ===== */
  bolum('3.2 — maçın okunması: istatistik, beklenen gol, hocanın yorumu, başkanın notu (F3-b)');
  const oku=MG('macOkumasi'),yorum=MG('macYorumu'),not=MG('macGozlemNotu'),Ok=oku(mk,id13),Y=yorum(mk,id13),N=not(mk,id13);
  denetle('Okuma kayıttan: skor ve beklenen gol bizim gözümüzden, kaynak maçın hocası (Şükrü Hoca) ve maç akşamı, tarz izi hocanın tarzıyla (direkt), şans sınıfı',
    Ok&&metin(Ok.skor)===metin(MK.skor)&&metin(Ok.xg)===metin(MK.xg)&&Ok.hoca.ad==='Şükrü Hoca'&&Ok.kaynak.tarih==='2026-11-28'&&Ok.kaynak.dakika===1140+120&&Ok.tarzIzi.tarz==='direkt'&&MK.tarz[0]==='direkt'
    &&['sanssiz','sansli','hakli','dengeli'].includes(Ok.sans)&&Ok.ist.sut[0]===MK.ist.sut[0],`${Ok&&Ok.sans} · uzun pas payı ${Ok&&Ok.tarzIzi.uzunPay} (${Ok&&Ok.tarzIzi.uyum}) · öne çıkan ${Ok&&Ok.oneCikan&&Ok.oneCikan.ad}`);
  denetle('Hocanın yorumu sözle (rakam ve gizli puan yok), başkanın notu gözlenebilir sayılarla (skor, beklenen gol, şut, sahiplik); ikisi de belirlenimli ve kaydet–yükle sonrası aynı',
    Y&&Y.kisiId===mk.kulupler.demirkapi.hocaId&&Y.metin.length>10&&!/\d/.test(Y.metin)&&/Beklenen gol \d,\d\d – \d,\d\d; şut \d+–\d+, topa sahip olma %\d+\./.test(N)
    &&metin(yorum(mk,id13))===metin(Y)&&(()=>{const d=MG('bellekDeposu')(),r=MG('kariyerKaydet')(d,'s',mk),y=MG('kariyerYukle')(d,'s');return y.tamam&&metin(yorum(y.kariyer,id13))===metin(Y)&&not(y.kariyer,id13)===N;})(),
    `${Y&&Y.metin} | ${N}`);
  /* H2-c (kullanıcı isteği 3): hocanın yorumu kendiliğinden gelmez; başkan sorar (js/yazisma.js) */
  const KL=MG('konusmaListesi'),KK3=MG('kariyerKomut'),hId=mk.kulupler.demirkapi.hocaId,yId=(Object.values(mk.kisiler).find(p=>p.rol==='yardimciAntrenor')||{}).id;
  const kon=(k,id)=>KL(k).find(c=>c.anahtar===id)||{mesajlar:[],girisimler:[],kararlar:[],okunmamis:0,cevapBekliyor:false,yok:true};
  const sor=(k,g)=>KK3(k,x=>MG('girisimBaslat')(x,g)).kariyer,ilerle3=k=>KK3(k,x=>MG('duragaIlerle')(x)),gelen=(k,id)=>kon(k,id).mesajlar.filter(m=>m.yon==='gelen').pop();
  {const h=kon(mk,hId);
   denetle('H2-c: maçtan sonra hocanın konuşmasında kendiliğinden mesaj yok; konular öneri olarak duruyor (Maçı nasıl gördün?, Takım ne durumda?, Görüşelim)',
     !h.yok&&h.mesajlar.length===0&&h.okunmamis===0&&metin(h.girisimler.map(g=>g.ad))==='["Maçı nasıl gördün?","Takım ne durumda?","Görüşelim"]'&&!!yId,h.girisimler.map(g=>g.ad).join(', '));}
  const k1=sor(mk,'yaz.teknikDirektor.mac'),o1=MG('ilerleOnizle')(k1),cv=Object.values(k1.isler).find(x=>x.tur==='gelisme'&&x.veri.gelisme==='yazismaCevap');
  denetle('“Maçı nasıl gördün?” (Cumartesi 21:00): İlerle beklenen cevapta durur (neden haber, beklenen iş cevap), cevap mesai dışından ertesi gün 09:30; o kişinin bütün konuları cevap gelene dek kapalı, yardımcınınki açık',
    !!cv&&o1.neden==='haber'&&!!o1.haberIsi&&o1.haberIsi.id===cv.id&&`${cv.tarih} ${cv.dakika}`==='2026-11-29 570'&&kon(k1,hId).girisimler.length>0&&kon(k1,hId).girisimler.every(g=>g.engel==='Önceki mesajının cevabını bekliyorsun.')
    &&kon(k1,yId).girisimler.every(g=>!g.engel)&&kon(k1,hId).mesajlar.length===1&&kon(k1,hId).mesajlar[0].yon==='giden',cv&&`${cv.tarih} ${cv.dakika} · ${o1.neden}`);
  const R2=ilerle3(k1),k2=R2.kariyer,h2=kon(k2,hId),gl=gelen(k2,hId);
  denetle('Cevap telefonda: hocanın metni maçın okumasıyla aynı (macYorumu), rakam ve gizli puan yok; yeni mesaj; aynı maç ikinci kez sorulamaz',
    R2.sonuc.neden==='haber'&&an(k2)==='2026-11-29 09:30'&&!!gl&&gl.metin===Y.metin&&!/\d/.test(gl.metin)&&gl.yeni&&h2.okunmamis===1&&!h2.girisimler.some(g=>g.id==='yaz.teknikDirektor.mac'),gl&&gl.metin);
  {const k3=KK3(k2,x=>MG('yazismaGoruldu')(x,hId)).kariyer;
   denetle('Konuşma açılınca cevap görüldü (kişinin okunan anı); kayıt geçerli; kaydet–yükle sonrası konuşma aynı',kon(k3,hId).okunmamis===0&&!MG('kariyerDogrula')(k3).length
     &&(()=>{const d=MG('bellekDeposu')();MG('kariyerKaydet')(d,'s',k3);const y=MG('kariyerYukle')(d,'s');return y.tamam&&metin(kon(y.kariyer,hId).mesajlar)===metin(kon(k3,hId).mesajlar);})());}
  const k4=ilerle3(sor(k2,'yaz.yardimciAntrenor.mac')).kariyer,yg=gelen(k4,yId);
  denetle('Yardımcının cevabı rakamlarla (şut, isabetli, beklenen gol, topa sahip olma; öne çıkanın şutu ve beklenen golü), iki saat sonra',
    !!yg&&/Şut \d+–\d+/.test(yg.metin)&&/Beklenen gol \d,\d\d – \d,\d\d/.test(yg.metin)&&an(k4)==='2026-11-29 11:30',yg&&yg.metin);
  /* şans ve beceri: kayıt elle değiştirilir (kopya) */
  const elle=(skor,xg,israr)=>{const x=JSON.parse(JSON.stringify(mk));x.maclar[id13].skor=skor;x.maclar[id13].xg=xg;if(israr!=null)x.kisiler[x.kulupler.demirkapi.hocaId].hoca.israr=israr;return x;};
  const Sn=(skor,xg)=>oku(elle(skor,xg),id13).sans;
  denetle('Şans ile beceri: pozisyonda öndeyken kaybetmek şanssızlık, gerideyken kazanmak şans, sonuç pozisyonlarla aynı yöndeyse haklı, fark küçükse dengeli',
    Sn([0,1],[1.5,0.3])==='sanssiz'&&Sn([2,0],[0.4,1.6])==='sansli'&&Sn([2,0],[2.0,0.5])==='hakli'&&Sn([0,2],[0.3,1.8])==='hakli'&&Sn([1,1],[0.8,0.7])==='dengeli');
  const ys=yorum(elle([0,2],[0.3,1.8],0.9),id13).metin,yd=yorum(elle([0,2],[0.3,1.8],0.2),id13).metin;
  denetle('Israrcı hoca açık yenilgiyi şansa bağlar (başkan beklenen golle karşılaştırır); ısrarsız hoca kabul eder',/Şanssızdık/.test(ys)&&!/Şanssızdık/.test(yd)&&/bahanem yok/.test(yd),`${ys} | ${yd}`);
  denetle('Bozuk okunan an (şimdiden sonra ya da tamsayı değil) ve aynı görevde iki aktif çalışan doğrulamada yakalanır',
    MG('kariyerDogrula')((x=>{x.kisiler[hId].okunan=MG('simdikiAn')(x)+5;return x;})(JSON.parse(JSON.stringify(mk)))).some(e=>/okunan an/.test(e))
    &&MG('kariyerDogrula')((x=>{x.kisiler['kisi-999']=Object.assign({},x.kisiler[yId],{id:'kisi-999'});x.sonrakiNo.kisi=1000;return x;})(JSON.parse(JSON.stringify(mk)))).some(e=>/birden çok aktif/.test(e)));

  /* ===== 3.2c (H2-c): kişiye yazmak ve görüşme isteği ===== */
  bolum('3.2c — kişiye yazmak: takımın durumu, gözlem, görüşme isteği ve hoca değişimi (H2-c; js/yazisma.js)');
  const t1=ilerle3(sor(k4,'yaz.yardimciAntrenor.takim')).kariyer,m1=gelen(t1,yId);
  {const sak=KK3(t1,x=>{const p=MG('kulupOyunculari')(x,'demirkapi').find(q=>!q.sakat);x.oyuncular=Object.assign({},x.oyuncular,{[p.id]:Object.assign({},p,{sakat:{neden:'deneme',donus:'2027-03-01'}})});}).kariyer;
   const ertesi=KK3(t1,x=>{MG('zamanIlerlet')(x,1440);}).kariyer;
   denetle('“Takım ne durumda?”: yardımcı sıra, puan, son maçlar ve sıradakiyle (rakamlı); sonradan sakatlık olsa da cevap aynı; aynı gün ikinci kez sorulamaz, ertesi gün sorulur',
     !!m1&&/Sıramız \d+\., \d+ puan/.test(m1.metin)&&gelen(sak,yId).metin===m1.metin&&!kon(t1,yId).girisimler.some(g=>g.id==='yaz.yardimciAntrenor.takim')
     &&kon(ertesi,yId).girisimler.some(g=>g.id==='yaz.yardimciAntrenor.takim'),m1&&m1.metin);}
  {/* Pazartesi 13:30 soru → cevap 16:30, antrenman 15:00–17:00 (gözlem ancak hafta içi antrenmanda) */
   const p0=KK3(t1,x=>{MG('zamanIlerlet')(x,1440);}).kariyer,g0=sor(p0,'yaz.teknikDirektor.takim'),p1=KK3(g0,x=>{MG('zamanIlerlet')(x,90);}).kariyer;
   const R=KK3(p1,x=>MG('gozlemBaslat')(x,120)),gz=R.kariyer,hm=gelen(gz,hId);
   denetle('Hocanın takım cevabı sözle (rakamsız); cevap antrenman gözlemini kesmez (gözlem sonuna dek sürer, cevap telefonda)',
     R.sonuc.neden==='bitti'&&!!hm&&hm.tarih==='2026-11-30'&&hm.dakika===990&&!/\d/.test(hm.metin)&&gz.gecmis.some(g=>g.sonuc&&g.sonuc.yazisma&&g.sonuc.yazisma.konu==='takim'&&g.sonuc.yazisma.kisiId===hId),`${R.sonuc.neden} · ${hm&&hm.metin}`);}
  const g1=sor(t1,'yaz.teknikDirektor.gorusme'),RG=ilerle3(g1),gk=RG.kariyer,gKart=Object.values(gk.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='gorusmeOnerisi');
  {const macGun=new Set(gk.fikstur.filter(f=>f.ev==='demirkapi'||f.konuk==='demirkapi').map(f=>f.tarih));
   denetle('“Görüşelim”: cevap bir saat önerisidir — maç gününü atlar, 11:00 ya da 15:00; tek kart (Kabul et / Başka gün iste) soranın konuşmasında; İlerle cevapta karar diye durur',
     !!gKart&&RG.sonuc.neden==='karar'&&!macGun.has(gKart.veri.oneri.tarih)&&[660,900].includes(gKart.veri.oneri.dakika)&&metin(MG('kararSecenekleri')(gk,gKart).map(s=>s.id))==='["kabul","baska"]'
     &&kon(gk,hId).kararlar.includes(gKart.id)&&kon(gk,hId).cevapBekliyor&&MG('kararTelefondaMi')(gk,gKart),gKart&&`${gKart.veri.oneri.tarih} ${MG('saatYazi')(gKart.veri.oneri.dakika)}`);}
  if(gKart){
    const kb=KK3(gk,x=>MG('ajandaIsiYap')(x,gKart.id,'kabul')).kariyer,rv=Object.values(kb.isler).find(x=>x.tur==='ajanda'&&x.veri.etki==='ekipGorusmesi');
    denetle('Kabul et: deftere isteğe bağlı 45 dk randevu (öneri anında); konuşmada giden cevap; “Görüşelim” randevu varken kapalı',
      !!rv&&rv.tarih===gKart.veri.oneri.tarih&&rv.dakika===gKart.veri.oneri.dakika&&rv.veri.zorunluluk==='istege'&&rv.veri.sure===45&&kon(kb,hId).mesajlar.some(m=>m.yon==='giden'&&m.metin==='Kabul et')
      &&/Görüşme ayarlandı/.test((kon(kb,hId).girisimler.find(g=>g.id==='yaz.teknikDirektor.gorusme')||{}).engel||''),rv&&`${rv.tarih} ${MG('saatYazi')(rv.dakika)}`);
    {const M=kon(kb,hId).mesajlar,io=M.findIndex(m=>m.yon==='gelen'&&/uygun mu/.test(m.metin)),ic=M.findIndex(m=>m.yon==='giden'&&m.metin==='Kabul et');
     denetle('İnceleme (H2-e): aynı dakikada verilen cevap konuşmada önerinin altında (öneri, sonra “Kabul et”)',io>=0&&ic>io&&M[io].dakika===M[ic].dakika,`${io} · ${ic}`);}
    if(rv){let kc=kb;for(let g=0;g<8&&!(kc.tarih===rv.tarih&&kc.gunIciDakika===rv.dakika);g++)kc=ilerle3(kc).kariyer;
      const kat=KK3(kc,x=>MG('ajandaIsiYap')(x,rv.id)).kariyer,gr=kat.gecmis.find(g=>g.tur==='is'&&g.isId===rv.id);
      denetle('Randevuya katılınca kısa TEST özeti (“… ile görüştün”) öğrendiklerin olarak kalır',!!gr&&gr.sonuc.durum==='yapildi'&&/ile görüştün/.test(gr.sonuc.bilgi||''),gr&&gr.sonuc.bilgi);}
    let kd=gk,son=null;for(let d=0;d<3;d++){const kr=Object.values(kd.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='gorusmeOnerisi');if(!kr)break;son=kr;kd=KK3(kd,x=>MG('ajandaIsiYap')(x,kr.id,'baska')).kariyer;kd=ilerle3(kd).kariyer;}
    const ms=gelen(kd,hId);
    denetle('Başka gün iste: her ret yeni bir gün önerir; üçüncü retten sonra kart kurulmaz, “Uygun olduğunuzda yazın başkanım.”',
      !Object.values(kd.isler).some(x=>x.veri&&x.veri.karar==='gorusmeOnerisi')&&!!ms&&ms.metin==='Uygun olduğunuzda yazın başkanım.'&&!!son&&son.veri.deneme===2&&son.veri.oneri.tarih>gKart.veri.oneri.tarih,ms&&ms.metin);
    {const kb2=KK3(gk,x=>MG('ajandaIsiYap')(x,gKart.id,'baska')).kariyer,ad=MG('hocaAdaylari')(kb2,'demirkapi','deneme')[0];
     const kh=KK3(kb2,x=>MG('hocaDegistir')(x,'demirkapi',ad)).kariyer,M=kon(kh,hId).mesajlar,son=M[M.length-1];
     denetle('İnceleme (H2-e): “Başka gün iste”den sonra hoca değişirse bekleyen yeni cevap düşer ve eski hocanın konuşması “Cevap gelmedi.” ile biter',
       !Object.values(kh.isler).some(x=>x.veri&&x.veri.gelisme==='yazismaCevap'&&x.veri.muhatap===hId)&&!!son&&son.yon==='not'&&son.metin==='Cevap gelmedi.'&&!MG('kariyerDogrula')(kh).length,son&&son.metin);}
    let kz=gk;for(let g=0;g<6&&kz.isler[gKart.id];g++)kz=ilerle3(kz).kariyer;
    const gc=kz.gecmis.find(g=>g.tur==='is'&&g.isId===gKart.id);
    denetle('Cevapsız kalırsa (son cevap öneriden bir saat önce) görüşme olmaz; randevu yok; konuşmada “Cevap vermedin.”',
      !!gc&&gc.sonuc.durum==='cevapsiz'&&!Object.values(kz.isler).some(x=>x.veri&&x.veri.etki==='ekipGorusmesi')&&kon(kz,hId).mesajlar.some(m=>m.metin==='Cevap vermedin.'),gc&&gc.sonuc.durum);
  }
  {/* H2-d: müdüre “Kasa ne durumda?”: cevap 90 dk sonra müdürün konuşmasında, sayılar cevap anındaki maliOzet; aynı gün ikinci soru yok */
   const mId=(Object.values(k4.kisiler).find(p=>p.rol==='maliMudur')||{}).id,kk=ilerle3(sor(k4,'yaz.maliMudur.kasa')).kariyer,mg=gelen(kk,mId);
   denetle('H2-d: “Kasa ne durumda?” — müdür 90 dk sonra kasayı, 90 günün en düşüğünü ve maaş yükünü yazar (cevap anının sayıları); aynı gün ikinci kez sorulamaz',
     !!mg&&an(kk)==='2026-11-29 13:00'&&mg.metin===MG('kasaCevapMetni')(kk,MG('maliOzet')(kk,'demirkapi'))&&!kon(kk,mId).girisimler.some(g=>g.id==='yaz.maliMudur.kasa'),mg&&mg.metin);}
  {const kq=sor(k4,'yaz.teknikDirektor.takim'),aday=MG('hocaAdaylari')(kq,'demirkapi')[0],kh=KK3(kq,x=>MG('hocaDegistir')(x,'demirkapi',aday)).kariyer,yeniId=kh.kulupler.demirkapi.hocaId,eski=kon(kh,hId);
   denetle('3.7a eki: hoca değişince eski hocaya bekleyen soru iptal (geçmişte iptal), konuşmasında “Cevap gelmedi.” ve konu yok; yardımcı aynı kişi; yeni hocanın konuları listede',
     !Object.values(kh.isler).some(x=>x.veri&&x.veri.muhatap===hId)&&kh.gecmis.some(g=>g.tur==='iptal'&&g.isTuru==='gelisme')&&eski.mesajlar.some(m=>m.metin==='Cevap gelmedi.')&&!eski.girisimler.length
     &&yeniId!==hId&&metin(kon(kh,yeniId).girisimler.map(g=>g.ad))==='["Takım ne durumda?","Görüşelim"]'&&MG('personelKisisi')(kh,'yardimciAntrenor').id===yId&&!MG('kariyerDogrula')(kh).length,
     `yeni hoca ${kh.kisiler[yeniId].ad}: ${kon(kh,yeniId).girisimler.map(g=>g.ad).join('/')}`);}
}

/* ================= F7 — ligin öbür maçları ================= */
bolum('3.8 — ligin öbür maçları: haftanın sekiz maçı, tek komut (F7)');
{
  const {motorYukle}=require('./motor-yukle'),MC=motorYukle().ctx,MG=a=>vm.runInContext(a,MC);vm.runInContext('MOTOR_AYAR.macSuresiDk=6',MC);
  const KK=MG('kariyerKomut'),Match=MG('Match'),oyna=sec=>{const m=new Match(()=>{},sec);m.macaGec();for(let i=0;i<60*60*30&&m.phase!=='fulltime';i++)m.step(1/60);return m;};
  /* bir hafta: maç gününe git, girdiler, sekiz maç (kısa), sonuçlar; f: komuttan önce kariyere dokunan deneme (ceza vb.) */
  const hafta=(k,f)=>{const is=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');k=KK(k,x=>MG('duragaIlerle')(x)).kariyer;
    const G=MG('macGirdisi')(k,is.veri.macId),D=MG('haftaninDigerMaclari')(k,G.macId).map(f=>({f,sec:MG('digerMacSecenegi')(k,f)}));
    k=KK(k,x=>MG('ajandaIsiYap')(x,is.id)).kariyer;if(f)k=KK(k,f).kariyer;
    const m=oyna({kadro:G.kadro,tohum:G.tohum,tunel:{x:0,z:-6},tarz:G.tarz.slice()}),O=D.map(d=>({macId:d.f.id,sonuc:oyna(d.sec).sonucKaydi(),tohum:d.sec.tohum}));
    return{k,G,D,S:m.sonucKaydi(),O};};
  const h=hafta(MG('kariyerBaslat')({tohum:7})),uy=(x,O)=>MG('haftaSonuclariUygula')(x,h.G.macId,h.S,h.G.tohum,{},O||h.O);
  const k1=KK(h.k,x=>uy(x)).kariyer,tb=MG('sezonTablosu')(k1),ids=Object.keys(k1.maclar);
  denetle('Haftanın sekiz maçı tek komutla: sekiz kayıt, 16 kulüp 13 maç, geçmişe yalnız bizim maç, öbürleri kısa kayıt (şut listesi yok, beklenen gol var), 16 kulübün son on biri yazıldı',
    ids.length===8&&tb.every(t=>t.O===13)&&k1.gecmis.filter(g=>g.tur==='mac').length===1&&ids.filter(id=>id!==h.G.macId).every(id=>k1.maclar[id].sutlar===null&&k1.maclar[id].xg.length===2&&k1.maclar[id].degisiklikler.length===0)
    &&Array.isArray(k1.maclar[h.G.macId].sutlar)&&ids.every(id=>{const f=k1.fikstur.find(x=>x.id===id);return [f.ev,f.konuk].every((c,t)=>metin(k1.kulupler[c].kadro.ilk11)===metin(k1.maclar[id].ilk11[t]));})
    &&!MG('kariyerDogrula')(k1).length,`${ids.length} maç · O ${[...new Set(tb.map(t=>t.O))].join(',')}`);
  /* H2-b: Canlı Skor'un ayrıntısı kayıttan (macAyrintisi; adlar kariyerin oyuncularından, kısa kayıtta beklenen gol kayıttaki değer) */
  {const AY=MG('macAyrintisi'),adBul=id=>(k1.oyuncular[id]||{}).ad,A=ids.filter(id=>id!==h.G.macId).map(id=>[id,AY(k1.maclar[id],adBul)]);
   const tamam=A.every(([id,a])=>{const s=k1.maclar[id];return a.goller.length===s.skor[0]+s.skor[1]&&a.goller.concat(a.kartlar,a.sakat).every(x=>x.ad!=='—')
     &&metin(a.xg)===metin(s.xg)&&a.satirlar.length===10&&a.satirlar[2][0]==='Beklenen gol';});
   const MK=k1.maclar[h.G.macId],B=AY(MK,adBul);
   denetle('H2-b: öbür maçların kısa kaydından ayrıntı — gol satırı skor toplamı kadar, bütün adlar kariyerin oyuncularından, beklenen gol kayıttaki, tablo 10 satır; bizim tam kayıtta şut listesinin beklenen golü kayıttakiyle aynı',
     tamam&&metin(B.xg)===metin(MK.xg)&&metin(MG('macBeklenenGol')(MK.sutlar))===metin(MK.xg)&&B.satirlar.length===10,
     A.slice(0,3).map(([id,a])=>`${a.skor.join('–')}: ${a.goller.length} gol, ${a.kartlar.length} kart`).join(' · '));}
  denetle('Eksik ya da fazla öbür maç reddedilir, kariyer değişmez; aynı hafta ikinci kez uygulanamaz',
    reddeder(()=>KK(h.k,x=>uy(x,h.O.slice(1))))&&reddeder(()=>KK(h.k,x=>uy(x,h.O.concat([h.O[0]]))))&&reddeder(()=>KK(k1,x=>uy(x)))&&Object.keys(h.k.maclar).length===0);
  /* atomiklik: SONUNCU öbür maçın tohumu yanlış — öncekiler kopyaya yazılmışken komut düşer; verilen kariyer hiç değişmez (inceleme) */
  const bozukO=h.O.map((o,i)=>i<h.O.length-1?o:Object.assign({},o,{tohum:o.tohum+1})),once3=metin(h.k);
  denetle('Öbür maçlardan sonuncusunun tohumu yanlışsa komut düşer, öncekiler de yazılmaz (kariyer aynı)',reddeder(()=>KK(h.k,x=>uy(x,bozukO)))&&metin(h.k)===once3&&Object.keys(h.k.maclar).length===0);
  /* belirlenimcilik: aynı tohumla ikinci kariyerde öbür maçların seçenekleri ve sonuçları birebir */
  const h2=hafta(MG('kariyerBaslat')({tohum:7})),k2=KK(h2.k,x=>MG('haftaSonuclariUygula')(x,h2.G.macId,h2.S,h2.G.tohum,{},h2.O)).kariyer;
  denetle('Aynı tohum: öbür maçların seçenekleri (kadro, tarz, tohum) ve haftanın sonuçları birebir',metin(h.D.map(d=>d.sec))===metin(h2.D.map(d=>d.sec))&&metin(k1.maclar)===metin(k2.maclar));
  /* öbür kulübün cezalısı: maçını oynamayınca cezası düşer (F2'nin borcu kapandı) */
  const dk=h.D[0].f.ev,cz=MG('kulupOyunculari')(h.k,dk).find(p=>!h.D[0].sec.kadro[0].oyuncular.concat(h.D[0].sec.kadro[0].yedekler).some(o=>o.id===p.id));
  const kc=KK(KK(h.k,x=>{x.oyuncular=Object.assign({},x.oyuncular,{[cz.id]:Object.assign({},x.oyuncular[cz.id],{ceza:{mac:2,neden:'deneme'}})});}).kariyer,x=>uy(x)).kariyer;
  denetle('Öbür kulübün oynamayan cezalısının cezası düşer (yalnız bizimle oynayınca düşmüyordu)',kc.oyuncular[cz.id].ceza&&kc.oyuncular[cz.id].ceza.mac===1,`${cz.ad}: ${metin(kc.oyuncular[cz.id].ceza)}`);
  const d=MG('bellekDeposu')();MG('kariyerKaydet')(d,'s',k1);const y=MG('kariyerYukle')(d,'s');
  const h14=hafta(y.kariyer),k14=KK(h14.k,x=>MG('haftaSonuclariUygula')(x,h14.G.macId,h14.S,h14.G.tohum,{},h14.O)).kariyer;
  denetle('Kaydet–yükle sonrası 14. hafta: yedi öbür maç, sonra 16 kulüp 14 maç',y.tamam&&h14.D.length===7&&MG('sezonTablosu')(k14).every(t=>t.O===14)&&Object.keys(k14.maclar).length===16&&!MG('kariyerDogrula')(k14).length);
}

bolum('3.8b — maç arkada (G1-e: işçinin saf parçası; Node eşitliği)');
{
  const {motorYukle}=require('./motor-yukle'),MC=motorYukle().ctx,MG=a=>vm.runInContext(a,MC);vm.runInContext('MOTOR_AYAR.macSuresiDk=6',MC);
  const KK=MG('kariyerKomut'),Match=MG('Match'),oyna=MG('arkaMacOynat');
  const k=KK(MG('kariyerBaslat')({tohum:7}),x=>MG('duragaIlerle')(x)).kariyer,id13='mac-2627-13-demirkapi-akdeniz';
  const D=MG('haftaninDigerMaclari')(k,id13).slice(0,2).map(f=>MG('digerMacSecenegi')(k,f)),G=MG('macGirdisi')(k,id13);
  const kilit=sec=>{const m=new Match(()=>{},sec);m.macaGec();for(let i=0;i<60*60*30&&m.phase!=='fulltime';i++)m.step(1/60);return m;};
  denetle('Öbür maç: arkaMacOynat (santra ilk adımda) ≡ kilit adımlı motorun sonucu',D.every(sec=>metin(oyna(Match,sec).son)===metin(kilit(sec).sonucKaydi())));
  const bizSec={kadro:G.kadro,tohum:G.tohum,tunel:{x:0,z:-6},tarz:G.tarz.slice()};
  const dogal=(sec,K)=>{const m=new Match(()=>{},sec);for(let i=0;i<60*60*40&&m.phase!=='fulltime';i++){for(const c of K||[])if((m.kare||0)===c.kare-1)MG('tarzDegistir')(m,c.t,c.hedef,c.kare);m.step(1/60);}return m;};
  const R=oyna(Match,bizSec,{oncesi:true});
  denetle('Sonuç ikizi: maç öncesi doğal adımlanır (macaGec yok) ve doğal oynanan maçla aynı; macaGec\'li oynatma farklı (santra anı sonucu değiştirir)',
    R.bitti&&metin(R.son)===metin(dogal(bizSec).sonucKaydi())&&metin(oyna(Match,bizSec).son)!==metin(R.son),`${metin(R.son.skor)} · ${R.adim} adım`);
  const K=[{t:0,hedef:'konumsal',kare:30000},{t:1,hedef:'direkt',kare:42000}],RK=oyna(Match,bizSec,{oncesi:true,komutlar:K});
  denetle('Tarz komutları (TEST paneli): baştan kurulan komut, canlı motorda karesinden önce verilen komutla aynı sonucu verir; komutsuzdan farklı',
    metin(RK.son)===metin(dogal(bizSec,K).sonucKaydi())&&metin(RK.son)!==metin(R.son),metin(RK.son.skor));
  {const m=new Match(()=>{},bizSec);let ok=true,say=0;
   for(let i=0;i<60*60*40&&m.phase!=='fulltime';i++){m.step(1/60);if((m.kare||0)%997===0){const o=MG('arkaMacDurum')(R.ornekler,m.kare);
     if(o&&o.kare<=m.kare&&m.kare-o.kare<MG('ARKA_ORNEK_KARE')){say++;const m2=dogal;}
     if(!o||o.kare>m.kare)ok=false;}}
   const son=R.ornekler[R.ornekler.length-1],d=MG('arkaMacDurum')(R.ornekler,1e9);
   denetle('Örnekler: 5 motor sn\'de bir (kare sırasıyla), son örnek maç sonu; arkaMacDurum karesine kadarki son örneği verir',ok&&say>0&&R.ornekler.every((o,i)=>i===0||o.kare>=R.ornekler[i-1].kare)&&son.faz==='fulltime'&&d===son&&MG('arkaMacDurum')(R.ornekler,-1)===null,`${R.ornekler.length} örnek`);}
  /* H2-b: örneğin anındaki olaylar ve istatistik — bitmiş kaydın öneki, aynı kareye kilit adımla getirilen motorla birebir (motorun listeleri yalnız eklenir) */
  {const anlik=MG('arkaMacAnlik'),proj=S=>metin({skor:S.skor,goller:S.goller,kartlar:S.kartlar,sakatliklar:S.sakatliklar,sutlar:S.sutlar,ist:S.ist});
   const bicim=R.ornekler.every(o=>Array.isArray(o.n)&&o.n.length===4&&o.ist&&Array.isArray(o.ist.sut));let esit=0,toplam=0;const not=[];
   for(const sec of D){const RR=oyna(Match,sec),O=RR.ornekler,uc=[O.length>>2,O.length>>1,(O.length*3)>>2].map(i=>O[i]);
     const m=new Match(()=>{},sec);m.macaGec();
     for(const o of uc){while((m.kare||0)<o.kare&&m.phase!=='fulltime')m.step(1/60);toplam++;if((m.kare||0)===o.kare&&proj(anlik(RR.son,o))===proj(m.sonucKaydi()))esit++;}
     const s=O[O.length-1];toplam++;if(proj(anlik(RR.son,s))===proj(RR.son))esit++;
     not.push(uc.map(o=>`${o.dk}' ${o.n.join('/')}`).join(', '));}
   denetle('H2-b: örneklerde olay sayıları (n) ve istatistik (ist); iki öbür maçta üç örnek karesinde arkaMacAnlik ≡ aynı kareye kilit adımla getirilen motorun kaydı (skor, goller, kartlar, sakatlıklar, şutlar, ist); son örnekte önek bitmiş kayıtla aynı',
     bicim&&esit===toplam,`${esit}/${toplam} · ${not.join(' | ')}`);}
  {const html=fs.readFileSync(path.join(KOK,'index.html'),'utf8'),L=[...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m=>m[1]),F=MG('arkaDosyalari')(L);
   const I=vm.createContext({console});for(const f of F)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),I,{filename:f});vm.runInContext('MOTOR_AYAR.macSuresiDk=6',I);
   const IG=a=>vm.runInContext(a,I),RI=IG('arkaMacOynat')(IG('Match'),JSON.parse(metin(D[0]))),RB=IG('arkaMacOynat')(IG('Match'),JSON.parse(metin(bizSec)),{oncesi:true,komutlar:K});
   const RD=oyna(Match,D[0]);
   denetle('İşçinin dosya listesi (arkaDosyalari: ortak, kadrolar, lig, motor dosyaları, lig-maclari) yeter: yalnız onlarla kurulan bağlamda sonuçlar ve örnekler (H2-b biçimi: n, ist) tam bağlamla aynı',
     !F.includes('js/kariyer.js')&&!F.includes('js/mac-arka.js')&&F[F.length-1]==='js/lig-maclari.js'&&metin(RI.son)===metin(RD.son)&&metin(RI.ornekler)===metin(RD.ornekler)&&metin(RB.son)===metin(RK.son),`${F.length} dosya`);}
}

bolum('3.9 — kadro yeterliliği: hükmen güvenlik ağı (G1-a; oyunun yüklediği dosyalar)');
{
  const T=oyunAl,KK=T('kariyerKomut'),id13='mac-2627-13-demirkapi-akdeniz',toh=id=>T('macTohumu')(7,id);
  const c1=KK(KK(T('kariyerBaslat')({tohum:7}),x=>T('duragaIlerle')(x)).kariyer,x=>T('ajandaIsiYap')(x,'is-1')).kariyer;
  const S=o=>Object.assign({skor:[0,0],bitti:true,goller:[],kartlar:[],sakatliklar:[],degisiklikler:[],ist:{}},o);
  const F=T('haftaninDigerMaclari')(c1,id13),f0=F[0];
  /* kulübün uygun oyuncusunu n'ye indirir (dönüşü uzak sakatlık) */
  const eksilt=(x,kulup,n)=>{const L=T('kulupOyunculari')(x,kulup),y={};L.slice(0,Math.max(0,L.length-n)).forEach(p=>{y[p.id]=Object.assign({},p,{sakat:{neden:'deneme',donus:'2027-06-01'}});});
    x.oyuncular=Object.assign({},x.oyuncular,y);};
  const hafta=(x,D)=>T('haftaSonuclariUygula')(x,id13,S(),toh(id13),{},D);
  const digerleri=(x,ozel)=>T('haftaninDigerMaclari')(x,id13).map(f=>({macId:f.id,sonuc:ozel&&ozel[f.id]?ozel[f.id]:S(),tohum:toh(f.id)}));
  {const c=KK(c1,x=>{eksilt(x,f0.ev,10);}).kariyer,P=T('digerMacPlani')(c,f0),h=T('hukmenKarari')(c,f0);
   denetle('11 uygun oyuncu çıkaramayan ev sahibi: plan hükmen (0–3), motor seçeneği yok; öbür maçların planı seçenekli',
     !!P.hukmen&&!P.secenek&&h.neden==='ev'&&metin(h.skor)==='[0,3]'&&T('haftaninDigerMaclari')(c,id13).slice(1).every(f=>!!T('digerMacPlani')(c,f).secenek),metin(h));
   const c2=KK(c,x=>{const p=T('kulupOyunculari')(x,f0.ev).find(q=>!q.sakat);x.oyuncular=Object.assign({},x.oyuncular,{[p.id]:Object.assign({},p,{ceza:{mac:1,neden:'deneme'}})});}).kariyer;
   const cz=T('kulupOyunculari')(c2,f0.ev).find(q=>q.ceza);
   const k2=KK(c2,x=>hafta(x,digerleri(x,{[f0.id]:T('hukmenSonucu')(T('hukmenKarari')(x,f0))}))).kariyer,s=k2.maclar[f0.id],tb=T('sezonTablosu')(k2),te=tb.find(t=>t.id===f0.ev),tk=tb.find(t=>t.id===f0.konuk);
   denetle('Hükmen maç kaydı: 0–3, hukmen ev, on bir yok, atansız goller; tablo yenilgi ve galibiyet sayar; cezalı maçı çekmiş sayılır; 16 kulüp eşit maç; kariyer geçerli',
     metin(s.skor)==='[0,3]'&&s.hukmen==='ev'&&s.ilk11===null&&s.goller.length===3&&s.goller.every(g=>g.id===null)&&tb.every(t=>t.O===13)
     &&k2.oyuncular[cz.id].ceza===null&&!T('kariyerDogrula')(k2).length,`${metin(s.skor)} · ${te.ad} ${te.M}M · ${tk.ad} ${tk.G}G`);
   {const A=T('macAyrintisi')(s,id=>(k2.oyuncular[id]||{}).ad);
    denetle('H2-b: hükmen kaydın Canlı Skor ayrıntısı yalnız hükmen notudur (listeler ve tablo boş, beklenen gol yok)',
      A.hukmen==='ev'&&!A.goller.length&&!A.kartlar.length&&!A.sakat.length&&!A.satirlar.length&&A.xg===null&&metin(A.skor)==='[0,3]');}
   denetle('Hükmen gereken maça oynanmış sonuç reddedilir; hükmen sonucu hükmen koşulu olmayan maça reddedilir (kariyer aynı)',
     reddeder(()=>KK(c2,x=>hafta(x,digerleri(x))))&&reddeder(()=>KK(c1,x=>hafta(x,digerleri(x,{[f0.id]:T('hukmenSonucu')({skor:[0,3],neden:'ev'})}))))&&!Object.keys(c2.maclar).length);
   {const d=T('bellekDeposu')();T('kariyerKaydet')(d,'s',k2);const y=T('kariyerYukle')(d,'s');
    denetle('Kaydet–yükle: hükmen kaydı aynı',y.tamam&&metin(y.kariyer.maclar[f0.id])===metin(s));}
   {const b=JSON.parse(metin(k2));b.maclar[f0.id].skor=[1,3];b.maclar[f0.id].goller.unshift({id:null,no:0,takim:0,kk:false,dk:0});
    const H=T('kariyerDogrula')(T('kariyerOlustur')(b));
    denetle('Bozuk hükmen kaydı (skor tutmuyor) doğrulamada yakalanır',H.some(e=>/hükmen kaydı skor/.test(e)),H.slice(0,2).join(' · '));}}
  {const c=KK(c1,x=>{eksilt(x,f0.ev,9);eksilt(x,f0.konuk,10);}).kariyer,h=T('hukmenKarari')(c,f0);
   const k2=KK(c,x=>hafta(x,digerleri(x,{[f0.id]:T('hukmenSonucu')(h)}))).kariyer;
   denetle('İki taraf da çıkaramazsa çift hükmen 0–0 (TEST sınırı); tablo beraberlik sayar',h.neden==='cift'&&metin(k2.maclar[f0.id].skor)==='[0,0]'&&T('sezonTablosu')(k2).find(t=>t.id===f0.ev).B>=1,metin(h));}
  {const c=KK(c1,x=>{eksilt(x,'demirkapi',10);}).kariyer,G=T('macGirdisi')(c,id13);
   const k2=KK(c,x=>T('haftaSonuclariUygula')(x,id13,T('hukmenSonucu')(G.hukmen),toh(id13),{},digerleri(x))).kariyer;
   const y=T('macYorumu')(k2,id13),n=T('macGozlemNotu')(k2,id13);
   denetle('Bizim kulüp 11 çıkaramazsa maç girdisi hükmen ve çizim için iki tarafta 11 (zorla); sonuç 0–3; hocanın yorumu ve başkanın notu hükmeni söyler',
     !!G.hukmen&&G.hukmen.neden==='ev'&&G.kadro.every(K=>K.oyuncular.length===11)&&metin(k2.maclar[id13].skor)==='[0,3]'&&/hükmen/.test(y.metin)&&/hükmen/.test(n)
     &&!!Object.values(k2.isler).find(x=>x.veri&&x.veri.eylem==='macGunu'),`${y.metin} | ${n}`);
   denetle('Hükmen maçında motor sonucu (oynanmış maç) reddedilir',reddeder(()=>KK(c,x=>T('haftaSonuclariUygula')(x,id13,S(),toh(id13),{},digerleri(x)))));}
}

bolum('5.1a — sezon sonu kaydı (G1-d; yeni sezon yok; oyunun yüklediği dosyalar)');
{
  const T=oyunAl,KK=T('kariyerKomut');
  const macIsi=c=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
  const S={skor:[0,0],bitti:true,goller:[],kartlar:[],sakatliklar:[],degisiklikler:[],ist:{}};
  /* haftayı sekiz yapay 0–0 ile oynar (P12 açılırsa kararı cevapsız kalır) */
  const hafta=c=>{const j=macIsi(c);for(let g=0;g<12&&!(c.tarih===j.tarih&&c.gunIciDakika===j.dakika);g++)c=KK(c,x=>T('duragaIlerle')(x)).kariyer;
    c=KK(c,x=>T('ajandaIsiYap')(x,j.id)).kariyer;const id=j.veri.macId,D=T('haftaninDigerMaclari')(c,id).map(f=>({macId:f.id,sonuc:S,tohum:T('macTohumu')(7,f.id)}));
    return KK(c,x=>T('haftaSonuclariUygula')(x,id,S,T('macTohumu')(7,id),{},D)).kariyer;};
  let k=T('kariyerBaslat')({tohum:7}),n=0;
  for(;n<20&&macIsi(k);n++){if(n===17)denetle('29. haftadan sonra sezon sonu kaydı yok',!k.sezon.sonuc&&!k.gecmis.some(g=>g.tur==='sezonSonu'));k=hafta(k);}
  const R=k.sezon.sonuc,tb=T('sezonTablosu')(k),G=k.gecmis.filter(g=>g.tur==='sezonSonu'),hat=Object.values(k.isler).find(x=>x.tur==='hatirlatma'&&/Sezon tamamlandı/.test(x.veri.metin));
  denetle('18 hafta: son maçın komutunda sezon sonu kaydı bir kez (tablo, şampiyon, bizim sıra ve puan); geçmişte sezonSonu; ertesi gün 10:00 hatırlatma; maç günü işi yok',
    n===18&&!!R&&R.tablo.length===16&&R.sampiyon===tb[0].id&&metin(R.tablo.map(t=>t.id))===metin(tb.map(t=>t.id))&&R.bizimSira===tb.findIndex(t=>t.id==='demirkapi')+1&&R.bizimPuan===tb.find(t=>t.id==='demirkapi').P
    &&G.length===1&&G[0].sira===R.bizimSira&&!!hat&&hat.tarih==='2027-03-28'&&hat.dakika===600&&!macIsi(k)&&tb.every(t=>t.O===30),`${n} hafta · şampiyon ${R&&R.sampiyon} · biz ${R&&R.bizimSira}. ${R&&R.bizimPuan} puan · ${hat&&hat.veri.metin}`);
  {let c=k;for(let g=0;g<60&&!T('ilerleOnizle')(c).engel.length;g++)c=KK(c,x=>T('duragaIlerle')(x)).kariyer;   /* G2: sözleşme kartları (cevapsız) ve son ay başı da geçer */
   const e=T('ilerleOnizle')(c).engel;
   denetle('Sezon bitince İlerle hatırlatmaya gider, sonra açık engel: “Sezon tamamlandı; yeni sezon bu sürümde yok (TEST).”',e.length===1&&e[0]===T('SEZON_SONU_METNI')&&c.gecmis.some(g=>g.tur==='is'&&g.sonuc&&/Sezon tamamlandı/.test(g.sonuc.metin||'')),e.join(' · '));
   /* H2-d: sezon sonu kaydından sonraki ilk Pazartesi raporu gelir, sonra mali rapor zinciri durur */
   const sr=c.haberler.filter(h=>h.anahtar==='mali.haftalik'&&h.tarih>'2027-03-27');
   denetle('H2-d: sezon sonundan sonraki ilk Pazartesi (29 Mart) haftalık özet gelir; sonra bekleyen mali rapor işi yok',sr.length===1&&sr[0].tarih==='2027-03-29'&&!Object.values(c.isler).some(x=>x.tur==='maliRapor'),sr.map(h=>h.tarih).join());}
  denetle('Sezon sonu kaydı ikinci kez yazılmaz; bitmiş haftanın sonucu ikinci kez uygulanamaz',KK(k,x=>T('sezonSonuYaz')(x)).sonuc===false&&reddeder(()=>KK(k,x=>T('macSonucuUygula')(x,Object.keys(x.maclar).pop(),S,0))));
  {const d=T('bellekDeposu')();T('kariyerKaydet')(d,'s',k);const y=T('kariyerYukle')(d,'s');
   denetle('Kaydet–yükle: sezon sonu kaydı aynı, kariyer geçerli',y.tamam&&metin(y.kariyer.sezon)===metin(k.sezon)&&!T('kariyerDogrula')(y.kariyer).length);}
  {const b=JSON.parse(metin(k));b.sezon.sonuc.sampiyon=b.sezon.sonuc.tablo[1].id;const H=T('kariyerDogrula')(T('kariyerOlustur')(b));
   const b2=JSON.parse(metin(k));const son=Object.keys(b2.maclar).pop();delete b2.maclar[son];const H2=T('kariyerDogrula')(T('kariyerOlustur')(b2));
   denetle('Bozuk sezon sonu kaydı (şampiyon tabloyla tutmuyor; oynanmamış maç kalmış) doğrulamada yakalanır',H.some(e=>/sezon sonu kaydı geçersiz/.test(e))&&H2.some(e=>/sezon sonu kaydı var fakat/.test(e)),H.concat(H2).slice(0,2).join(' · '));}
}

bolum('4.1 — sözleşme, maaş ve ay başı; 5.5 maç günü geliri; nakit ufku (G2-a, G2-b; oyunun yüklediği dosyalar)');
{
  const T=oyunAl,KK=T('kariyerKomut'),k0=T('kariyerBaslat')({tohum:7}),biz='demirkapi';
  const O=Object.values(k0.oyuncular).filter(p=>p.kulupId),hocalar=Object.values(k0.kisiler).filter(p=>p.rol==='teknikDirektor');
  const bitisler=new Set(O.map(p=>p.sozlesme&&p.sozlesme.bitis)),maas=T('aylikMaas')(k0,biz);
  denetle('Yeni kariyerde her kulüplü oyuncunun ve her hocanın TEST sözleşmesi var (maaş > 0; bitiş bu sezon, bir ya da iki yıl sonra 31 Mayıs); aylık maaş makul',
    O.every(p=>p.sozlesme&&p.sozlesme.maas>0)&&hocalar.every(h=>h.sozlesme&&h.sozlesme.maas>0)&&[...bitisler].every(b=>['2027-05-31','2028-05-31','2029-05-31'].includes(b))&&bitisler.size===3
    &&maas>=20000000&&maas<=90000000&&metin(T('kariyerBaslat')({tohum:7}).oyuncular)===metin(k0.oyuncular),`Demirkapı aylık ${T('paraYazi')(maas)} · ${bitisler.size} bitiş`);
  const genc=T('kulupOyunculari')(k0,biz).slice(18),usta=T('kulupOyunculari')(k0,biz).slice(0,18);
  denetle('Gençlerin maaşı kadronun ortalamasından düşük (yaş ve özellik); maaş gizli puanı ele vermez (yuvarlanmış, 500 ₺ katı)',
    genc.every(p=>p.sozlesme.maas<usta.reduce((a,q)=>a+q.sozlesme.maas,0)/usta.length)&&O.every(p=>p.sozlesme.maas%50000===0));
  const ab=Object.values(k0.isler).find(x=>x.tur==='ayBasi');
  denetle('İlk ay başı işi 1 Aralık 10:00 (görünür rutin iş)',!!ab&&ab.tarih==='2026-12-01'&&ab.dakika===600&&ab.veri.kulupId===biz&&!T('isGizli')(ab));
  let k=k0;
  /* maç günü işi önce gelir: Stada git yerine yapay sonuç (3.5 kalıbı) */
  const S={skor:[0,0],bitti:true,goller:[],kartlar:[],sakatliklar:[],degisiklikler:[],ist:{}};
  const hafta=c=>{const j=Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');for(let g=0;g<12&&!(c.tarih===j.tarih&&c.gunIciDakika===j.dakika);g++)c=KK(c,x=>T('duragaIlerle')(x)).kariyer;
    c=KK(c,x=>T('ajandaIsiYap')(x,j.id)).kariyer;const id=j.veri.macId,D=T('haftaninDigerMaclari')(c,id).map(f=>({macId:f.id,sonuc:S,tohum:T('macTohumu')(7,f.id)}));
    return KK(c,x=>T('haftaSonuclariUygula')(x,id,S,T('macTohumu')(7,id),{},D)).kariyer;};
  k=hafta(k0);
  const bilet=k.hareketler.filter(h=>h.kalem==='bilet'),kap=T('statKapasitesi')(T('STADYUMLAR').kulup),sey=Math.round(kap*0.3);
  denetle('İç saha maçından sonra bilet geliri: kapasite × doluluk (0,3) × bilet fiyatı; açıklamada seyirci',bilet.length===1&&bilet[0].tutar===sey*T('MALI_TEST').bilet&&/Akdeniz/.test(bilet[0].aciklama),
    `${kap} kapasite · ${sey} seyirci · ${bilet[0]&&T('paraYazi')(bilet[0].tutar)}`);
  {const k14=hafta(k);denetle('Deplasman maçında bilet geliri yok',k14.hareketler.filter(h=>h.kalem==='bilet').length===1);}
  for(let g=0;g<10&&!k.hareketler.some(h=>h.kalem==='maas');g++)k=KK(k,x=>T('duragaIlerle')(x)).kariyer;
  const M=k.hareketler.filter(h=>h.kalem==='maas'),L=k.hareketler.filter(h=>h.kalem==='ligPayi'),sonraki=Object.values(k.isler).find(x=>x.tur==='ayBasi');
  denetle('1 Aralık: maaşlar (aylık maaş kadar) ödendi, lig payı geldi; sonraki ay başı 1 Ocak; kasa denetimi tutarlı',M.length===1&&M[0].tutar===-T('aylikMaas')(k,biz)&&L.length===1&&L[0].tutar===T('MALI_TEST').ligPayi
    &&!!sonraki&&sonraki.tarih==='2027-01-01'&&!T('kariyerDogrula')(k).length,`${M[0]&&T('paraYazi')(M[0].tutar)} · ${sonraki&&sonraki.tarih}`);
  const U=T('nakitUfku')(k,biz,90);
  denetle('Nakit ufku (90 gün): ay başları kesin, iç saha biletleri belirsiz ve ayrı; en düşük bakiye ve tarihi',U.adimlar.some(a=>a.kesin&&/ay başı/.test(a.neden))&&U.belirsizGelir>0
    &&U.adimlar.filter(a=>!a.kesin).every(a=>/bilet/.test(a.neden))&&Number.isInteger(U.kesin.enDusuk),`en düşük ${T('paraYazi')(U.kesin.enDusuk)} (${U.kesin.enDusukTarih}) · belirsiz ${T('paraYazi')(U.belirsizGelir)}`);
  {const b=JSON.parse(metin(k));const id=Object.keys(b.oyuncular)[0];b.oyuncular[id].sozlesme={maas:-5,bitis:'2027-05-31'};
   const H=T('kariyerDogrula')(T('kariyerOlustur')(b));denetle('Bozuk sözleşme doğrulamada yakalanır',H.some(e=>/sözleşme geçersiz/.test(e)),H[0]);}
  {const d=T('bellekDeposu')();T('kariyerKaydet')(d,'s',k);const y=T('kariyerYukle')(d,'s');denetle('Kaydet–yükle: sözleşmeler ve ay başı aynı',y.tamam&&metin(y.kariyer)===metin(k));}
}

bolum('4.1c — mali işler müdürünün raporu (H2-d; js/mali-rapor.js; oyunun yüklediği dosyalar)');
{
  const T=oyunAl,KK=T('kariyerKomut'),biz='demirkapi',ilerle=c=>KK(c,x=>T('duragaIlerle')(x)).kariyer;
  const macIsi=c=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
  const S={skor:[0,0],bitti:true,goller:[],kartlar:[],sakatliklar:[],degisiklikler:[],ist:{}},toh=id=>T('macTohumu')(7,id);
  const hafta=c=>{const j=macIsi(c);for(let g=0;g<14&&!(c.tarih===j.tarih&&c.gunIciDakika===j.dakika);g++)c=ilerle(c);c=KK(c,x=>T('ajandaIsiYap')(x,j.id)).kariyer;const id=j.veri.macId;
    return KK(c,x=>T('haftaSonuclariUygula')(x,id,S,toh(id),{},T('haftaninDigerMaclari')(x,id).map(f=>({macId:f.id,sonuc:S,tohum:toh(f.id)})))).kariyer;};
  const k0=T('kariyerBaslat')({tohum:7}),R0=T('maliRaporlari')(k0),mid=T('personelKisisi')(k0,'maliMudur').id;
  denetle('Açılışta ilk haftalık özet (kaynak müdür, açılış nakdi); sıradaki rapor 30 Kasım Pazartesi 09:00; rapor gazetenin ışığını yakmaz',
    R0.length===1&&R0[0].h.anahtar==='mali.haftalik'&&R0[0].h.p.nakit===k0.kulupler[biz].nakit&&R0[0].h.p.kaynak===mid
    &&Object.values(k0.isler).some(x=>x.tur==='maliRapor'&&x.tarih==='2026-11-30'&&x.dakika===540)&&T('odaIzleri')(k0).yeniHaber===0&&!T('odaIzleri')(k0).gazete);
  const k13=hafta(k0),k1=KK(k13,x=>{T('zamanIlerlet')(x,3660);}).kariyer;   /* Cumartesi 21:00 → 1 Aralık 10:00 (ay başından hemen sonra) */
  const H=T('maliRaporlari')(k1).map(x=>x.h),hf=H.find(h=>h.anahtar==='mali.haftalik'&&h.tarih==='2026-11-30'),ay=H.find(h=>h.anahtar==='mali.aylik'),oz=T('maliOzet')(k1,biz);
  denetle('30 Kasım 09:00 haftalık rapor; 1 Aralık 10:00 aylık rapor maaştan sonra yazılır; aylık raporun en düşük bakiyesi ve 90 gün sonrası aynı anda hesaplanan özetle aynı (o ay başı iki kez sayılmaz)',
    !!hf&&hf.dakika===540&&!!ay&&ay.tarih==='2026-12-01'&&ay.dakika===600&&ay.p.enDusuk===oz.enDusuk&&ay.p.son90===oz.son90&&ay.p.nakit===k1.kulupler[biz].nakit,
    ay&&`aylık: en düşük ${T('paraYazi')(ay.p.enDusuk)} · özet ${T('paraYazi')(oz.enDusuk)}`);
  {const O=T('maliRaporOkumasi')(k1,ay),Oh=T('maliRaporOkumasi')(k1,hf),ad=O.satirlar.map(s=>s.ad);
   denetle('Okuma: haftalık kısa (kasa, 90 günün en düşüğü, 90 gün sonrası, belirsiz gelir; hareket yok); aylık ayrıntılı (maaş yükü, bekleyen gelir ve gider, ödeme takvimi, Aralık maaşı ve lig payı hareketleri); kaynak müdür',
     Oh.satirlar.length===4&&!Oh.hareketler.length&&ad.includes('Aylık maaş yükü')&&ad.includes('Bekleyen gider')&&Array.isArray(O.odemeler)&&O.hareketler.some(h=>/Aralık maaşları/.test(h.aciklama))
     &&O.hareketler.some(h=>/Aralık lig yayın payı/.test(h.aciklama))&&O.kaynakAd===k1.kisiler[mid].ad&&O.baslik==='Aylık mali rapor',`${ad.join(', ')} · ${O.hareketler.length} hareket`);}
  {/* inceleme (H2-e): 1 Ocak raporunun hareketlerinde Aralık ay başı yinelenmez (o satırlar 1 Aralık raporunda) */
   const ko=KK(k1,x=>{T('zamanIlerlet')(x,T('anDakika')('2027-01-01',660)-T('simdikiAn')(x));}).kariyer,ocak=ko.haberler.find(h=>h.anahtar==='mali.aylik'&&h.tarih==='2027-01-01');
   const H=ocak?T('maliRaporOkumasi')(ko,ocak).hareketler.map(h=>h.aciklama):[];
   denetle('İnceleme (H2-e): 1 Ocak aylık raporunda Ocak maaşı ve lig payı var, Aralık ay başının satırları yok',!!ocak&&H.some(a=>/Ocak maaşları/.test(a))&&H.some(a=>/Ocak lig/.test(a))&&!H.some(a=>/Aralık maaşları|Aralık lig/.test(a)),H.join(' | '));}
  {const i=T('maliRaporlari')(k1)[0].i,kg=KK(k1,x=>T('raporGoruldu')(x,i)).kariyer;
   denetle('raporGoruldu yalnız o raporu görüldü işaretler; gazete okumak raporu işaretlemez',kg.haberler[i].gorulen&&kg.haberler.filter(h=>h.tur==='rapor'&&!h.gorulen).length===k1.haberler.filter(h=>h.tur==='rapor'&&!h.gorulen).length-1
     &&KK(k1,x=>T('haberlerGoruldu')(x)).kariyer.haberler.filter(h=>h.tur==='rapor'&&!h.gorulen).length===k1.haberler.filter(h=>h.tur==='rapor'&&!h.gorulen).length);}
  {const x=JSON.parse(metin(k1));for(const id of Object.keys(x.isler))if(x.isler[id].tur==='maliRapor')delete x.isler[id];x.tarih='2027-01-26';x.gunIciDakika=600;
   const y=JSON.parse(metin(x));y.tarih='2027-02-02';T('maliRaporKur')(x,biz);T('maliRaporKur')(y,biz);
   const z=JSON.parse(metin(k1));z.sezon=Object.assign({},z.sezon,{sonuc:{}});for(const id of Object.keys(z.isler))if(z.isler[id].tur==='maliRapor')delete z.isler[id];
   const t=o=>Object.values(o.isler).filter(q=>q.tur==='maliRapor').map(q=>q.tarih+' '+q.dakika).join();
   denetle('Zincir: sıradaki Pazartesi ayın 1\'iyse (1 Şubat 2027; o gün aylık rapor) haftalık rapor bir hafta sonra; sezon sonu kaydı varsa kurulmaz',t(x)==='2027-02-08 540'&&t(y)==='2027-02-08 540'&&T('maliRaporKur')(z,biz)===null&&t(z)==='',`${t(x)} · ${t(y)}`);}
  {/* eksi kasa uyarısı: ödeme kasayı eksiye düşürünce müdür kısa uyarı bırakır; aynı eksi dönemde ikinci uyarı yok */
   const ke=KK(k1,x=>{T('odemePlanla')(x,{kulupId:biz,tarih:x.tarih,dakika:x.gunIciDakika+5,tutar:-(x.kulupler[biz].nakit+50000),kalem:'transfer',aciklama:'Deneme gideri'});
     T('odemePlanla')(x,{kulupId:biz,tarih:x.tarih,dakika:x.gunIciDakika+10,tutar:-100000,kalem:'transfer',aciklama:'Deneme gideri 2'});T('zamanIlerlet')(x,15);}).kariyer;
   const U=ke.haberler.filter(h=>h.anahtar==='mali.uyari'),O=U.length?T('maliRaporOkumasi')(ke,U[0]):null;
   denetle('Kasa eksiye düşünce müdürün kısa uyarısı (bir kez; ikinci ödeme yeni uyarı yazmaz); okumada “Kasa eksiye düştü.”',ke.kulupler[biz].nakit<0&&U.length===1&&!!O&&O.uyari==='Kasa eksiye düştü.',`${U.length} uyarı · kasa ${T('paraYazi')(ke.kulupler[biz].nakit)}`);}
  {const ilk=k1.haberler.find(h=>h.anahtar==='mali.haftalik'&&h.tarih==='2026-11-23');
   denetle('Raporun sayıları sonradan değişmez: Cumartesi bilet geliri ve ay başından sonra 23 Kasım raporunun okuması açılıştakiyle aynı',!!ilk&&metin(T('maliRaporOkumasi')(k1,ilk))===metin(T('maliRaporOkumasi')(k0,R0[0].h))&&k1.kulupler[biz].nakit!==k0.kulupler[biz].nakit);}
  {const j=Object.values(k1.isler).find(x=>x.tur==='maliRapor'),x=JSON.parse(metin(k1));x.kisiler[mid].durum='ayrildi';
   const y=KK(T('kariyerOlustur')(x),z=>{z.tarih=j.tarih;z.gunIciDakika=j.dakika-1;T('zamanIlerlet')(z,1);}).kariyer,yeni=Object.values(y.isler).filter(q=>q.tur==='maliRapor');
   denetle('Müdür yoksa rapor yazılmaz ama zincir sürer (sonraki Pazartesi işi kurulur)',y.haberler.length===k1.haberler.length&&yeni.length===1&&yeni[0].tarih===T('tarihEkle')(j.tarih,7),yeni.map(q=>q.tarih).join());}
  {const b=JSON.parse(metin(k1)),i=b.haberler.findIndex(h=>h.tur==='rapor');b.haberler[i].p='x';const b2=JSON.parse(metin(k1));b2.haberler[i].anahtar='mali.yok';
   const H=T('kariyerDogrula')(T('kariyerOlustur')(b)),H2=T('kariyerDogrula')(T('kariyerOlustur')(b2));
   denetle('kariyerDogrula temiz; bozuk rapor kopyaları (parametre nesne değil; bilinmeyen anahtar) yakalanır',!T('kariyerDogrula')(k1).length&&H.some(e=>/parametreler nesne değil/.test(e))&&H2.some(e=>/bilinmeyen anahtar/.test(e)),H.concat(H2).slice(0,2).join(' · '));}
  {const d=T('bellekDeposu')();T('kariyerKaydet')(d,'s',k1);const y=T('kariyerYukle')(d,'s');denetle('Kaydet–yükle: raporlar ve zincir aynı',y.tamam&&metin(y.kariyer)===metin(k1));}
}

bolum('1.4b — kayıt geçişi 8 → 9 (G2; araclar/ornekler/kayit-s8-hafta14.json tur/g1 koduyla tohum 7, 13. hafta sonrası)');
{
  const T=oyunAl,KK=T('kariyerKomut'),d=T('bellekDeposu')();d.yaz('oyun-1',fs.readFileSync(path.join(KOK,'araclar','ornekler','kayit-s8-hafta14.json'),'utf8'));
  const y=T('kariyerYukle')(d,'oyun-1'),k=y.kariyer,ab=k&&Object.values(k.isler).find(x=>x.tur==='ayBasi');
  denetle('Sürüm 8 kaydı geçişle açılır (8→9→10→11): sözleşmeler boş, 1 Aralık 10:00 ay başı işi eklendi; kariyer geçerli',
    y.tamam&&metin(y.gecisler)==='["8→9","9→10","10→11"]'&&k.kayitSurumu===11&&!!ab&&ab.tarih==='2026-12-01'&&ab.dakika===600&&Object.values(k.oyuncular).every(p=>!p.sozlesme)&&!T('kariyerDogrula')(k).length,
    y.hata||metin(y.gecisler));
  {const V=JSON.parse(fs.readFileSync(path.join(KOK,'araclar','ornekler','kayit-s8-hafta14.json'),'utf8')).veri,G=T('KAYIT_GECISLERI')[8];
   const gec=(tarih,dk)=>{const v=JSON.parse(metin(V));v.tarih=tarih;v.gunIciDakika=dk;for(const id of Object.keys(v.isler))if(v.isler[id].tarih<tarih)delete v.isler[id];G(v);
     return{ab:Object.values(v.isler).filter(x=>x.tur==='ayBasi').map(x=>x.tarih),tr:Object.values(v.isler).filter(x=>x.tur==='gelisme'&&x.veri.anahtar).map(x=>x.tarih+' '+x.veri.gelisme).sort()};};
   const a=gec('2026-12-01',480),b=gec('2026-12-01',720),c=gec('2027-01-02',1260),d=gec('2027-01-10',1260),e=gec('2027-01-01',600),f=gec('2027-01-05',660);
   denetle('Geçiş, kaydın tam anına denk gelen işi henüz olmamış sayar (1 Ocak 10:00 kaydında o ayın ay başı, 5 Ocak 11:00 kaydında hocanın isteği kurulur)',
     metin(e.ab)==='["2027-01-01"]'&&f.tr[0]==='2027-01-05 hocaTalebi',`${metin(e.ab)} · ${f.tr[0]}`);
   denetle('Geçişin tarih durumları: ayın 1\'i 10:00\'dan önceki kayıtta ay başı o gün, sonrasında sonraki ay; Ocak kaydında kış döneminin kalan gelişmeleri geçişte kurulur (dönem kaçmaz)',
     metin(a.ab)==='["2026-12-01"]'&&metin(b.ab)==='["2027-01-01"]'&&metin(c.ab)==='["2027-02-01"]'&&c.tr.length===4&&c.tr[0]==='2027-01-05 hocaTalebi'
     &&metin(d.tr)==='["2027-01-16 gelenTeklif","2027-01-26 gelenTeklif"]'&&a.tr.length===4,`${metin(c.tr)} · ${metin(d.tr)}`);}
  /* G2 incelemesi: ilk ay başına dek sözleşme yok; kasa paneli ve ufuk maaş yükünü kurulacak TEST maaşlarıyla sayar (0 ve +lig payı değil) */
  const tah=T('aylikMaas')(k,'demirkapi',true),U0=T('nakitUfku')(k,'demirkapi',90),a0=U0.adimlar.find(a=>/ay başı/.test(a.neden));
  let c=k;for(let g=0;g<10&&!c.hareketler.some(h=>h.kalem==='maas');g++)c=KK(c,x=>T('duragaIlerle')(x)).kariyer;
  {const ger=-c.hareketler.find(h=>h.kalem==='maas').tutar;
   denetle('Geçişten sonra ilk ay başına dek nakit ufku maaşı tahminle sayar (ay başı eksi), tahmin gerçekleşen maaşa yakın (%5)',T('aylikMaas')(k,'demirkapi')===0&&tah>0&&!!a0&&a0.tutar===T('MALI_TEST').ligPayi-tah&&a0.tutar<0
     &&Math.abs(ger-tah)<=ger*0.05,`tahmin ${T('paraYazi')(tah)} · gerçekleşen ${T('paraYazi')(ger)}`);}
  denetle('Geçişten sonra ilk ay başında sözleşmeler kurulur, kadrolar en az 22, maaş ödenir, kış transfer gelişmeleri kurulur; kariyer geçerli',
    Object.values(c.oyuncular).filter(p=>p.kulupId).every(p=>p.sozlesme)&&Object.keys(c.kulupler).every(id=>T('kulupOyunculari')(c,id).length>=22)&&c.hareketler.some(h=>h.kalem==='maas')
    &&Object.values(c.isler).filter(x=>x.tur==='gelisme'&&x.veri.anahtar).length===4&&!T('kariyerDogrula')(c).length,`${c.tarih} ${c.gunIciDakika}`);
}

bolum('1.4c — kayıt geçişi 9 → 10 (H2-c; araclar/ornekler/kayit-s9-*.json H2-0\'da tur/h1-kart koduyla, tohum 7)');
{
  const T=oyunAl,KK=T('kariyerKomut');
  for(const ad of ['hafta14','ocak','sezonsonu']){
    const dosya=fs.readFileSync(path.join(KOK,'araclar','ornekler',`kayit-s9-${ad}.json`),'utf8'),V=JSON.parse(dosya).veri,d=T('bellekDeposu')();d.yaz('oyun-1',dosya);
    const y=T('kariyerYukle')(d,'oyun-1'),k=y.kariyer,P=k?Object.values(k.kisiler).filter(p=>p.rol==='yardimciAntrenor'||p.rol==='maliMudur'):[];
    let ok=!!(y.tamam&&metin(y.gecisler)==='["9→10","10→11"]'&&k.kayitSurumu===11&&k.macOkundu===undefined&&P.length===2&&Object.keys(k.kisiler).length===Object.keys(V.kisiler).length+2
      &&k.hareketler.length===V.hareketler.length&&!T('kariyerDogrula')(k).length);
    if(ok){const d2=T('bellekDeposu')();T('kariyerKaydet')(d2,'s',k);const y2=T('kariyerYukle')(d2,'s');ok=y2.tamam&&!(y2.gecisler||[]).length&&metin(y2.kariyer)===metin(k);}
    /* H2-d: görevdeki ve sezonu süren kayıtta kaydın anında haftalık mali rapor işi (ilk ilerlemede ilk rapor); sezon sonunda yok, İlerle engeli sürer */
    const mr=k?Object.values(k.isler).filter(x=>x.tur==='maliRapor'):[];
    if(ok)ok=ad==='sezonsonu'?!mr.length&&T('ilerleOnizle')(k).engel[0]===T('SEZON_SONU_METNI'):mr.length===1&&mr[0].tarih===k.tarih&&mr[0].dakika===k.gunIciDakika;
    let ek='';
    if(ok&&ad==='ocak'){const t=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='teklifKarari');let r=null;
      if(t)try{r=KK(k,x=>T('ajandaIsiYap')(x,t.id,'reddet'));}catch(e){ek=' · '+e.message;}
      ok=!!t&&!!r;ek=(t?` · teklif kartı ${t.id} cevaplandı`:' · teklif kartı yok')+ek;}
    denetle(`Sürüm 9 (${ad}) 9→10 açılır: iki çalışan bir kez eklenir, macOkundu yok, para hareketi aynı; kaydet–yükle yeniden geçiş yapmaz`+(ad==='ocak'?'; gelen teklif kartı yerinde ve cevaplanabilir':''),
      ok,`${y.hata||metin(y.gecisler)} · ${P.map(p=>p.ad).join(', ')}${ek}`);
  }
}

bolum('1.4d — kayıt geçişi 10 → 11 (S-a; araclar/ornekler/kayit-s10-*.json S-0\'da H2 koduyla, tohum 7)');
{
  const T=oyunAl,KK=T('kariyerKomut');
  for(const ad of ['hafta14','ocak','sezonsonu']){
    const dosya=fs.readFileSync(path.join(KOK,'araclar','ornekler',`kayit-s10-${ad}.json`),'utf8'),V=JSON.parse(dosya).veri,d=T('bellekDeposu')();d.yaz('oyun-1',dosya);
    const y=T('kariyerYukle')(d,'oyun-1'),k=y.kariyer;
    let ok=!!(y.tamam&&metin(y.gecisler)==='["10→11"]'&&k.kayitSurumu===11&&metin(k.oyuncular)===metin(V.oyuncular)&&metin(k.kisiler)===metin(V.kisiler)
      &&k.hareketler.length===V.hareketler.length&&Object.values(k.oyuncular).every(p=>T('oyuncuKondisyonu')(k,p,k.tarih)===100&&T('oyuncuFormu')(p)===0)&&!T('kariyerDogrula')(k).length);
    if(ok){const d2=T('bellekDeposu')();T('kariyerKaydet')(d2,'s',k);const y2=T('kariyerYukle')(d2,'s');ok=y2.tamam&&!(y2.gecisler||[]).length&&metin(y2.kariyer)===metin(k);}
    let ek='';
    if(ok&&ad==='ocak'){const t=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='teklifKarari');let r=null;
      if(t)try{r=KK(k,x=>T('ajandaIsiYap')(x,t.id,'reddet'));}catch(e){ek=' · '+e.message;}ok=!!t&&!!r;ek+=t?' · teklif kartı cevaplandı':' · teklif kartı yok';}
    if(ok&&ad==='sezonsonu')ok=T('ilerleOnizle')(k).engel[0]===T('SEZON_SONU_METNI');
    if(ok&&ad==='hafta14'){const R=yapayHafta(T,k),O=Object.values(R.k.oyuncular).filter(p=>p.kulupId);
      ok=O.every(p=>p.hal&&p.hal.gun===R.Gi.tarih)&&O.every(p=>p.mac===undefined&&p.dk===undefined)&&!T('kariyerDogrula')(R.k).length;ek+=' · bir yapay haftadan sonra hal yazıldı, M/Dk yok';}
    denetle(`Sürüm 10 (${ad}) 10→11 açılır: oyuncular, kişiler ve hareketler aynı; herkes tam kondisyon ve nötr form; kaydet–yükle yeniden geçiş yapmaz`
      +(ad==='ocak'?'; teklif kartı cevaplanabilir':ad==='sezonsonu'?'; İlerle engeli sürer':'; sonraki maç kaydı hal yazar'),ok,`${y.hata||metin(y.gecisler)}${ek}`);
  }
}

bolum('3.10 — oyuncunun haftası: dakikalar, kondisyon, form, gelişim ve maç girdisi çarpanı (S-a; js/oyuncu-hafta.js; oyunun yüklediği dosyalar)');
{
  const T=oyunAl,KK=T('kariyerKomut'),OH=T('OYUNCU_HAFTA_TEST'),biz='demirkapi',OKon=T('oyuncuKondisyonu'),OGel=T('gelisimOrt'),Yas=T('oyuncuYasi');
  const k0=T('kariyerBaslat')({tohum:7}),k0m=metin(k0);
  const R=yapayHafta(T,k0),k1=R.k,f=k1.fikstur.find(x=>x.id===R.Gi.macId),bT=f.ev===biz?0:1,K=R.Gi.kadro[bT];
  const dkFark=id=>(k1.oyuncular[id].dk||0)-(R.once.oyuncular[id].dk||0),macFark=id=>(k1.oyuncular[id].mac||0)-(R.once.oyuncular[id].mac||0);
  {const ilk=K.oyuncular.map(p=>p.id),giren=K.yedekler[1].id,kulube=K.yedekler.filter((p,i)=>i!==1).map(p=>p.id);
   const tum=[R.Gi,...R.D.filter(d=>d.secenek).map(d=>({kadro:d.secenek.kadro}))].flatMap(g=>g.kadro.flatMap(x=>x.oyuncular.map(p=>p.id)));
   denetle('(a) Dakikalar: on bir 90, 60. dakikada çıkan 60, giren 30 (+1 maç), 70. dakikada kırmızı gören 70; kulübede kalanın sayacı artmaz; haftanın bütün on birlerinde maç +1',
     ilk.slice(0,9).every(id=>dkFark(id)===90&&macFark(id)===1)&&dkFark(ilk[10])===60&&dkFark(ilk[9])===70&&dkFark(giren)===30&&macFark(giren)===1
     &&kulube.every(id=>dkFark(id)===0&&macFark(id)===0)&&tum.length>=16*11-22&&tum.every(id=>macFark(id)===1),`${tum.length} on bir oyuncusu`);}
  {const once=R.once,x={ilk11:[K.oyuncular.map(p=>p.id),R.Gi.kadro[1-bT].oyuncular.map(p=>p.id)].map((v,i,a)=>bT===0?a[i]:a[1-i]),degisiklikler:[],kartlar:[],sakatliklar:[]};
   const ff=Object.assign({},f),t=bT,ad0=K.oyuncular[3].ad;
   x.degisiklikler=[{takim:t,cikan:'YOK BÖYLE',giren:K.yedekler[1].ad,dk:50},{takim:t,cikan:ad0,giren:'YOK',dk:55}];
   const M=T('macDakikalari')(once,ff,x);
   const c2=JSON.parse(metin(once));c2.oyuncular[K.yedekler[2].id].ad=K.yedekler[1].ad;const k2=T('kariyerOlustur')(c2);
   const x2=Object.assign({},x,{degisiklikler:[{takim:t,cikan:ad0,giren:K.yedekler[1].ad,dk:50}]}),M2=T('macDakikalari')(k2,ff,x2);
   denetle('(a) Bilinmeyen ad ya da iki adaylı ad dakika yazmaz (değişiklik atlanır; on bir 90 kalır)',M.get(K.oyuncular[3].id)===90&&!M.has(K.yedekler[1].id)&&M2.get(K.oyuncular[3].id)===90&&!M2.has(K.yedekler[1].id)&&!M2.has(K.yedekler[2].id));}
  {const once=R.once,ok=K.oyuncular.every((q,i)=>{const p=once.oyuncular[q.id],h=k1.oyuncular[q.id].hal,dk=i===10?60:i===9?70:90;
      return h&&h.gun===f.tarih&&h.kon===Math.max(0,Math.round(OKon(once,p,f.tarih)-T('kondisyonDususu')(p,dk,f.tarih)));});
   const kb=K.yedekler.slice(2).map(p=>p.id).every(id=>k1.oyuncular[id].hal.kon===OKon(once,once.oyuncular[id],f.tarih));
   const p=k1.oyuncular[K.oyuncular[5].id],zayif=Object.assign({},p,{oz:p.oz.map((v,j)=>j===9?40:v),dogumTarihi:'1992-01-01'}),guclu=Object.assign({},p,{oz:p.oz.map((v,j)=>j===9?85:v),dogumTarihi:'2004-01-01'});
   const sak=Object.assign({},p,{hal:{kon:60,gun:f.tarih,form:0,gel:0,tav:60},sakat:{neden:'x',donus:T('tarihEkle')(f.tarih,10)}});
   denetle('(b) Düşüş: oynayanın kondisyonu maç öncesinden düşüş kadar azalır, oynamayanınki aynı; gün maç günü; dayanıksız ve yaşlı daha çok düşer; sakatken toparlanma yok',
     ok&&kb&&T('kondisyonDususu')(zayif,90,f.tarih)>T('kondisyonDususu')(guclu,90,f.tarih)&&OKon(k1,sak,T('tarihEkle')(f.tarih,5))===60);}
  {const p=Object.assign({},k1.oyuncular[K.oyuncular[5].id],{hal:{kon:50,gun:f.tarih,form:0,gel:0,tav:60},sakat:null}),g=n=>OKon(k1,p,T('tarihEkle')(f.tarih,n));
   const seri=[0,1,2,3,4,5,6,7,10,20].map(g),art=seri.every((v,i)=>!i||v>=seri[i-1])&&seri.every(v=>v<=100)&&seri[9]===100;
   const yavas=Object.assign({},p,{oz:p.oz.map((v,j)=>j===9?30:v)}),yasli=Object.assign({},p,{dogumTarihi:'1990-01-01'});
   const tz=tarz=>{const c=JSON.parse(metin(k1));c.kisiler[c.kulupler[biz].hocaId].hoca.tarz=tarz;const kk=T('kariyerOlustur')(c);return OKon(kk,Object.assign({},p,{kulupId:biz}),T('tarihEkle')(f.tarih,6));};
   denetle('(c) Toparlanma günle artar, 100\'ü aşmaz; dayanıklılığı düşük ya da yaşlı oyuncu daha yavaş toparlanır; dikey tarzın haftası dengeliden az toparlar',
     art&&OKon(k1,yavas,T('tarihEkle')(f.tarih,3))<g(3)&&OKon(k1,yasli,T('tarihEkle')(f.tarih,3))<g(3)&&tz('dikey')<tz('dengeli'),`${seri.join(',')} · dikey ${tz('dikey')} dengeli ${tz('dengeli')}`);}
  {const a=KK(k1,x=>{T('zamanIlerlet')(x,11*60);}).kariyer,b1=KK(a,x=>{T('zamanIlerlet')(x,6*1440);}).kariyer;let b2=a;
   for(let i=0;i<576;i++)b2=KK(b2,x=>{T('zamanIlerlet')(x,15);}).kariyer;
   const id=K.oyuncular[2].id;
   denetle('(d) Zamanın parçalanması: Pazar 08:00\'den Cumartesi 08:00\'e tek adım ≡ 576 × 15 dk (oyuncular ve kondisyon aynı; oyuncular paylaşılmayı sürdürür)',
     metin(b1.oyuncular)===metin(b2.oyuncular)&&OKon(b1,b1.oyuncular[id],b1.tarih)===OKon(b2,b2.oyuncular[id],b2.tarih)&&b2.oyuncular===KK(b2,x=>{T('zamanIlerlet')(x,1);}).kariyer.oyuncular,`${b1.tarih} ${b1.gunIciDakika}`);}
  /* (e)(f) 18 yapay hafta */
  {let k=k0;const gel0=new Map(Object.values(k0.oyuncular).filter(p=>p.kulupId).map(p=>[p.id,{g:OGel(p),y:Yas(p,k0.tarih)}])),adimlar=[],ciftler=[];let hata='';
   for(let h=0;h<18;h++){let r;try{r=yapayHafta(T,k);}catch(e){hata=e.message;break;}
     for(const [id,q] of Object.entries(r.k.oyuncular)){const o=r.once.oyuncular[id];if(!q.hal||!o||!o.kulupId)continue;const f0=o.hal?o.hal.form:0;adimlar.push(Math.abs(q.hal.form-f0)-(0.25*Math.abs(f0)+25));if(o.hal)ciftler.push([f0,q.hal.form]);}
     k=r.k;}
   const F=Object.values(k.oyuncular).filter(p=>p.hal).map(p=>p.hal.form),ort=F.reduce((a,b)=>a+b,0)/F.length,sd=Math.sqrt(F.reduce((a,b)=>a+(b-ort)**2,0)/F.length);
   const mx=ciftler.reduce((a,c)=>a+c[0],0)/ciftler.length,my=ciftler.reduce((a,c)=>a+c[1],0)/ciftler.length,kor=ciftler.reduce((a,c)=>a+(c[0]-mx)*(c[1]-my),0);
   denetle('(e) Form, 18 yapay haftada: maç başına sınırlı (|Δ| ≤ 0,25·|f| + 25), dağılır (sd > 5), ardışık korelasyonu pozitif',
     !hata&&adimlar.length>0&&adimlar.every(v=>v<=1)&&sd>5&&kor>0,hata||`sd ${sd.toFixed(1)} · ${adimlar.length} adım`);
   const gr={genc:[],yasli:[]},az=[];let tavan=true,ozOk=true;
   for(const [id,a] of gel0){const p=k.oyuncular[id];if(!p)continue;const d=OGel(p)-a.g;if(a.y<=21){gr.genc.push(d);if(d<=0.1)az.push(id);}if(a.y>=30)gr.yasli.push(d);
     if(p.hal&&OGel(p)>p.hal.tav+1)tavan=false;if(!(p.oz.length===11&&p.oz.every(x=>Number.isInteger(x)&&x>=1&&x<=99))||(p.mevki!=='KL'&&p.oz[8]!==5))ozOk=false;}
   const m=L=>L.reduce((a,b)=>a+b,0)/Math.max(1,L.length);
   denetle('(f) Gelişim, 18 yapay haftada: 21 yaş ve altının ölçüsü artar, 30+\'nınki azalır; tavanını bir adımdan çok aşan yok; özellikler 11 tamsayı 1–99, saha oyuncusunda kalecilik 5; en az bir genç hiç ya da çok az gelişir',
     !hata&&m(gr.genc)>0&&m(gr.yasli)<0&&tavan&&ozOk&&az.length>0&&!T('kariyerDogrula')(k).length,`≤21 ${m(gr.genc).toFixed(2)} · 30+ ${m(gr.yasli).toFixed(2)} · az gelişen genç ${az.length}`);}
  {const gun=R.Gi.tarih,Gi0=R.Gi,ayni=Gi0.kadro.every(x=>x.oyuncular.concat(x.yedekler).every(p=>metin(p.oz)===metin(R.once.oyuncular[p.id].oz)));
   const p=R.once.oyuncular[K.oyuncular[4].id],yorgun=Object.assign({},p,{hal:{kon:50,gun,form:0,gel:0,tav:60}}),formda=Object.assign({},p,{hal:{kon:100,gun,form:50,gel:0,tav:60}});
   const oy=T('macOzu')(R.once,yorgun,gun),of=T('macOzu')(R.once,formda,gun),r2=x=>Math.round(x*100)/100;
   const yOk=oy.every((v,j)=>[0,9].includes(j)?v===r2(p.oz[j]*0.95):v===p.oz[j]),fOk=of.every((v,j)=>[1,2,3,4,5,6,7].includes(j)||(p.mevki==='KL'&&j===8)?v===r2(p.oz[j]*1.03):v===p.oz[j]);
   const d=R.D.find(x=>x.secenek),o=d&&d.secenek.kadro[0].oyuncular[0],aynıYol=!!o&&metin(o.oz)===metin(T('macOzu')(R.once,R.once.oyuncular[o.id],gun));
   denetle('(g) Çarpan: açılışta girdinin özellikleri kayıtla aynı; kondisyon 50 hız ve dayanıklılığı ×0,95, form +50 form yuvalarını ×1,03 yapar, öbürleri aynı; öbür maçın girdisi aynı çarpanı taşır; kariyerin oz\'u değişmez',
     ayni&&yOk&&fOk&&aynıYol&&metin(p.oz)===metin(R.once.oyuncular[p.id].oz));}
  {const R2=yapayHafta(T,T('kariyerBaslat')({tohum:7})),d=T('bellekDeposu')();T('kariyerKaydet')(d,'s',k1);const y=T('kariyerYukle')(d,'s');
   denetle('(h) Kopyala-yaz ve kayıt: eski kariyer değişmez; kaydet–yükle aynı; haftanın ikinci uygulaması reddedilir; kayıtlı rastlantı aynı; aynı tohum aynı hal',
     metin(k0)===k0m&&y.tamam&&metin(y.kariyer)===metin(k1)&&reddeder(()=>KK(k1,x=>T('haftaSonuclariUygula')(x,R.Gi.macId,R.biz,R.Gi.tohum,{},[])))
     &&metin(k1.rastlanti)===metin(R.once.rastlanti)&&metin(R2.k.oyuncular)===metin(k1.oyuncular));}
  {OH.kapali=true;let R3;try{R3=yapayHafta(T,T('kariyerBaslat')({tohum:7}));}finally{OH.kapali=false;}
   const O3=Object.values(R3.k.oyuncular),p=R3.once.oyuncular[R3.Gi.kadro[0].oyuncular[0].id];
   OH.kapali=true;let kop;try{kop=T('macOzu')(R3.once,Object.assign({},p,{hal:{kon:40,gun:R3.Gi.tarih,form:90,gel:0,tav:60}}),R3.Gi.tarih);}finally{OH.kapali=false;}
   denetle('(i) Anahtar kapalı: hal yazılmaz, maç girdisi düz kopyadır (sayaçlar yine artar)',O3.every(p=>p.hal===undefined)&&metin(kop)===metin(p.oz)&&O3.some(p=>p.mac>(R3.once.oyuncular[p.id]||{mac:0}).mac));}
  {const b=JSON.parse(metin(k1)),id=K.oyuncular[1].id,bozuk=(f)=>{const c=JSON.parse(metin(k1));f(c.oyuncular[id]);return T('kariyerDogrula')(T('kariyerOlustur')(c));};
   const H=[bozuk(p=>{p.hal.kon=120;}),bozuk(p=>{p.hal.form=300;}),bozuk(p=>{p.hal.gel=150;}),bozuk(p=>{p.hal.tav=0;}),bozuk(p=>{p.hal.gun='2030-01-01';}),bozuk(p=>{p.mac=-1;}),bozuk(p=>{p.dk=90*p.mac+1;})];
   denetle('(j) Bozuk kopyalar yakalanır: kondisyon 120, form 300, birikim 150, tavan 0, gelecekteki gün, maç −1, dk > 90 × maç',H.every(x=>x.length>0)&&!T('kariyerDogrula')(k1).length,H.map(x=>x[0]).join(' · ').slice(0,200));}
  {const O=Object.values(k0.oyuncular).filter(p=>p.kulupId);
   denetle('(k) Devralınan sayaçlar: gol > 0 ise maç ≥ 1; maç ≥ sarı; dk ≤ 90 × maç; her kulüpte en az on bir oyuncu maç oynamış; kaleci yuvası her maç 90 dakika',
     O.every(p=>Number.isInteger(p.mac)&&Number.isInteger(p.dk)&&(p.gol===0||p.mac>=1)&&p.mac>=p.sari&&p.dk<=90*p.mac)
     &&Object.keys(k0.kulupler).every(c=>T('kulupOyunculari')(k0,c).filter(p=>p.mac>0).length>=11)
     &&Object.values(k0.kulupler).every(c=>{const kl=k0.oyuncular[c.kadro.ilk11[0]];return kl.dk===90*kl.mac;}));}
  {const sec=R.once.kulupler[biz].kadro.ilk11,adaylar=K.oyuncular.slice(1,9).map(p=>p.id).filter(id=>sec.includes(id));
   const cik=adaylar[0],yer=K.yedekler[2].id;
   const Rd=yapayHafta(T,k0,{duzelt:(s,id)=>{if(id===R.Gi.macId){s.ilk11[bT]=s.ilk11[bT].map(x=>x===cik?yer:x);}return s;}});
   const g=Rd.k.gecmis.filter(x=>x.tur==='mac').pop(),dis=g&&g.disarida||[];
   denetle('(l) Bizim maçın geçmiş kaydında “on birde yoktu” listesi: önceki on birde olup maç günü uygun ve bu maçın on birinde olmayan (sakat ve cezalı yok)',
     !!cik&&dis.includes(cik)&&dis.every(id=>T('oyuncuUygunMu')(Rd.once.oyuncular[id],Rd.Gi.tarih)),`${dis.join(',')}`);}
  {const G=T('takimGoruntusu')(k1),Mh=T('YAZISMA_METIN').hocaTakim(k1,G),My=T('YAZISMA_METIN').yardimciTakim(k1,G),ileri=KK(k1,x=>{T('zamanIlerlet')(x,2*1440);}).kariyer;
   denetle('(m) Hocanın sözü: takımın durumu görüntüsünde yorgun ve formda kimlik listeleri; hoca metni rakamsız; yardımcı “koşu verilerinde düşüş” der; kayıtlı görüntünün metni sonradan değişmez',
     Array.isArray(G.yorgun)&&G.yorgun.length>0&&Array.isArray(G.formda)&&!/\d/.test(Mh)&&/Koşu verilerinde düşüş/.test(My)&&T('YAZISMA_METIN').hocaTakim(ileri,G)===Mh,Mh.slice(0,160));}
}

bolum('3.3b — rotasyon: hoca yorgun oyuncuyu dinlendirir, formu tartar (S-a; js/hoca.js)');
{
  const T=oyunAl,OH=T('OYUNCU_HAFTA_TEST'),biz='demirkapi',k0=T('kariyerBaslat')({tohum:7});
  const is=Object.values(k0.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'),tarih=is.tarih,tohum=T('macTohumu')(7,is.veri.macId);
  const S0=T('hocaKadroSec')(k0,biz,tarih,tohum);
  const yorgunla=kon=>{const x=JSON.parse(metin(k0));for(const id of S0.ilk11)x.oyuncular[id].hal={kon,gun:tarih,form:0,gel:0,tav:60};return T('kariyerOlustur')(x);};
  const k55=yorgunla(55),S55=T('hocaKadroSec')(k55,biz,tarih,tohum),S95=T('hocaKadroSec')(yorgunla(95),biz,tarih,tohum);
  const dinlenen=S0.ilk11.filter(id=>!S55.ilk11.includes(id)),giren=S55.ilk11.filter(id=>!S0.ilk11.includes(id));
  denetle('Kondisyonu 55 olan on birin bir kısmı dinlenir, yerlerine on bir dışından oyuncu girer; kondisyon 95\'te on bir aynı',
    dinlenen.length>=2&&giren.length===dinlenen.length&&metin(S95.ilk11)===metin(S0.ilk11),`${dinlenen.length} dinlenen`);
  const h=T('kulupHocasi')(k0,biz),p=k0.oyuncular[S0.ilk11[5]],Y={rol:'merkez',taraf:null},hv=d=>T('hocaDegeri')(k0,h,p,Y,tohum,0,d);
  denetle('Hocanın değeri: form +50 tam HOCA_FORM_PAYI kadar artırır; kondisyon 55 HOCA_YORGUN × (85 − 55) kadar düşürür',
    Math.abs(hv({kon:100,form:50})-hv({kon:100,form:0})-T('HOCA_FORM_PAYI'))<1e-9&&Math.abs(hv({kon:100,form:0})-hv({kon:55,form:0})-T('HOCA_YORGUN')*30)<1e-9);
  OH.kapali=true;let Sk,S0k;try{Sk=T('hocaKadroSec')(k55,biz,tarih,tohum);S0k=T('hocaKadroSec')(k0,biz,tarih,tohum);}finally{OH.kapali=false;}
  denetle('Anahtar kapalıyken hoca kondisyonu ve formu görmez (eski zar): yorgun kopyada seçim eski seçimle aynı',metin(Sk)===metin(S0k));
}

bolum('3.11 — kadro ve oyuncu dosyası: gözlenebilir sayılar ve tarihli notlar (S-c; js/kadro-dosyasi.js; oyunun yüklediği dosyalar)');
{
  const T=oyunAl,KK=T('kariyerKomut'),biz='demirkapi',KS=T('kadroSatirlari'),ON=T('oyuncuNotlari'),OD=T('oyuncuDosyasi'),MS={KL:0,DEF:1,OS:2,FV:3};
  const k0=T('kariyerBaslat')({tohum:7}),S0=KS(k0,biz),ANAHTAR='id,no,ad,mevki,yas,mac,dk,gol,sari,kirmizi,sakat,ceza,bitis,maas';
  const sirali=S0.every((x,i)=>!i||MS[S0[i-1].mevki]<MS[x.mevki]||(S0[i-1].mevki===x.mevki&&S0[i-1].no<x.no));
  denetle('Satır: anahtar kümesi tam liste (özellik, kondisyon, form, tavan, bilgi, ısrar yok); 22 satır, mevki sonra forma sırasıyla',
    S0.length===22&&S0.every(x=>Object.keys(x).join()===ANAHTAR)&&sirali,`${S0.length} · ${Object.keys(S0[0]).join()}`);
  const nail=S0.find(x=>x.ad==='Nail'),yusuf=S0.find(x=>x.ad==='Yusuf');
  denetle('Devralınan M/Dk gol ve sarıyla tutarlı (gol > 0 → M ≥ 1; M ≥ sarı; Dk ≤ 90 × M); Nail sakat (dönüş tarihiyle), Yusuf cezalı; açılışta kırmızı yok',
    S0.every(x=>Number.isInteger(x.mac)&&Number.isInteger(x.dk)&&x.dk<=90*x.mac&&x.mac>=x.sari&&(x.gol===0||x.mac>=1)&&x.kirmizi===0)
    &&!!nail&&!!nail.sakat&&!!nail.sakat.donus&&!nail.ceza&&!!yusuf&&!!yusuf.ceza&&yusuf.ceza.mac>0,`${metin(nail&&nail.sakat)} · ${metin(yusuf&&yusuf.ceza)}`);
  /* yapay hafta: bizim on birden bir oyuncu (cik) dışarıda bırakılır, yerine yedek girer; her takımda 60'ta değişiklik, 70'te kırmızı */
  const f0=k0.fikstur.find(x=>x.hafta===13&&(x.ev===biz||x.konuk===biz)),bT=f0.ev===biz?0:1;
  const R0=yapayHafta(T,k0),K=R0.Gi.kadro[bT],cik=K.oyuncular.slice(1,9).map(p=>p.id).find(id=>k0.kulupler[biz].kadro.ilk11.includes(id)),yer=K.yedekler[2].id;
  const R=yapayHafta(T,k0,{duzelt:(s,id)=>{if(id===R0.Gi.macId)s.ilk11[bT]=s.ilk11[bT].map(x=>x===cik?yer:x);return s;}}),k1=R.k,S1=KS(k1,biz);
  const once1=id=>S0.find(x=>x.id===id),sonra1=id=>S1.find(x=>x.id===id),fark=(id,m,d)=>sonra1(id).mac===once1(id).mac+m&&sonra1(id).dk===once1(id).dk+d;
  const kl=K.oyuncular[0].id,giren=K.yedekler[1].id,kirmizi=K.oyuncular[9].id,cikan60=K.oyuncular[10].id;
  denetle('Yapay haftadan sonra: 90 dk oynayan +1/+90, 60\'ta çıkan +1/+60, giren +1/+30, kırmızılı +1/+70 ve kırmızı 1; dışarıda bırakılan +0',
    fark(kl,1,90)&&fark(cikan60,1,60)&&fark(giren,1,30)&&fark(kirmizi,1,70)&&sonra1(kirmizi).kirmizi===1&&fark(cik,0,0)&&sonra1(kirmizi).ceza&&sonra1(kirmizi).ceza.mac>0,
    `${metin(once1(giren))} → ${metin(sonra1(giren))}`.slice(0,200));
  const ss=JSON.parse(metin(k0));delete ss.oyuncular[S0[3].id].sozlesme;const Ss=KS(T('kariyerOlustur')(ss),biz).find(x=>x.id===S0[3].id);
  const s10=(()=>{const d=T('bellekDeposu')();d.yaz('oyun-1',fs.readFileSync(path.join(KOK,'araclar','ornekler','kayit-s10-hafta14.json'),'utf8'));return T('kariyerYukle')(d,'oyun-1').kariyer;})();
  const S10=KS(s10,biz);
  denetle('Sözleşmesiz oyuncuda bitiş ve maaş null; sürüm 10 kaydında (geçişle açılır) M ve Dk null, gol ve sarı yerinde',
    Ss.bitis===null&&Ss.maas===null&&S10.length>=22&&S10.every(x=>x.mac===null&&x.dk===null)&&S10.some(x=>x.gol>0),`${metin(Ss).slice(0,80)}`);
  /* notlar: maç (kırmızı; on birde yoktu), antrenman (Salı balkonda yorgun) ve hocanın “Takım ne durumda?” cevabı (yorgun) */
  const yc=JSON.parse(metin(k1));yc.oyuncular[cik].hal=Object.assign({},yc.oyuncular[cik].hal,{kon:60});
  let k2=T('kariyerOlustur')(yc);
  k2=KK(k2,x=>{T('zamanIlerlet')(x,T('anDakika')('2026-12-01',900)-T('simdikiAn')(x));}).kariyer;
  k2=KK(k2,x=>T('gozlemBaslat')(x,120)).kariyer;
  k2=KK(k2,x=>T('girisimBaslat')(x,'yaz.teknikDirektor.takim')).kariyer;
  for(let i=0;i<8&&!k2.gecmis.some(g=>g.sonuc&&g.sonuc.yazisma&&g.sonuc.yazisma.konu==='takim');i++)k2=KK(k2,x=>T('duragaIlerle')(x)).kariyer;
  const N=ON(k2,cik),hocaAd=k2.kisiler[k2.kulupler[biz].hocaId].ad,ana=Q=>N.filter(n=>n.kaynak===Q);
  const yeniden=N.every((n,i)=>!i||T('anDakika')(N[i-1].tarih,N[i-1].dakika)>=T('anDakika')(n.tarih,n.dakika));
  denetle('Notlar yeniden eskiye; kaynaklar hoca, antrenman ve maç (on birde yoktu); antrenman ve hoca notlarında rakam yok',
    yeniden&&ana(hocaAd).length>=1&&ana('Antrenman (balkon)').length===1&&ana('Maç').some(n=>/on birde yoktu/.test(n.metin))
    &&N[0].kaynak===hocaAd&&N[N.length-1].kaynak==='Maç'&&N.filter(n=>n.kaynak!=='Maç').every(n=>!/\d/.test(n.metin)),metin(N.map(n=>n.kaynak+': '+n.metin)).slice(0,260));
  const Nk=ON(k2,kirmizi),tc=JSON.parse(metin(k2));tc.oyuncular[kirmizi].kulupId='akdeniz';
  denetle('Maç notunda rakip maçtaki tarafından: kırmızı kart notu var; oyuncu başka kulübe geçse de eski maç notları aynı',
    Nk.some(n=>n.kaynak==='Maç'&&/kırmızı/.test(n.metin))&&metin(ON(tc,kirmizi))===metin(Nk),metin(Nk.map(n=>n.metin)).slice(0,160));
  const once2=metin(k2),O=OD(k2,cik),bos=JSON.parse(metin(k2));bos.gorevDurumu='kaybetti';
  denetle('Oyuncu dosyası saf: okumak kariyeri değiştirmez; künye, bu sezon, durum ve sözleşme; gizli değer yok; görev dışında kadro yok',
    metin(k2)===once2&&!!O&&O.kunye.ad===k2.oyuncular[cik].ad&&O.sezon.mac===sonra1(cik).mac&&!!O.sozlesme&&metin(O.notlar)===metin(N)
    &&!/"(oz|hal|kon|form|tav|gel|bilgi|israr)"/.test(metin(O))&&!T('kadroVar')(bos)&&T('kadroVar')(k2)&&KS(k2,'yok_boyle').length===0,Object.keys(O||{}).join());
}

bolum('4.2 — transfer iskeleti: dönem, gelen teklif, hocanın isteği ve imza (G2-d/e; oyunun yüklediği dosyalar)');
{
  const T=oyunAl,KK=T('kariyerKomut'),biz='demirkapi',toh=id=>T('macTohumu')(7,id);
  const macIsi=c=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
  const ilerle=c=>KK(c,x=>T('duragaIlerle')(x)).kariyer;
  /* hafta: biz 1–0 kazanırız (P12 açılmasın), öbürleri 0–0 */
  const hafta=c=>{const j=macIsi(c);for(let g=0;g<12&&!(c.tarih===j.tarih&&c.gunIciDakika===j.dakika);g++)c=ilerle(c);c=KK(c,x=>T('ajandaIsiYap')(x,j.id)).kariyer;
    const id=j.veri.macId,f=c.fikstur.find(x=>x.id===id),t=f.konuk===biz?1:0,skor=t?[0,1]:[1,0];
    const S={skor,bitti:true,goller:[{no:0,takim:t,dakika:30}],kartlar:[],sakatliklar:[],degisiklikler:[],ist:{}},Z={skor:[0,0],bitti:true,goller:[],kartlar:[],sakatliklar:[],degisiklikler:[],ist:{}};
    return KK(c,x=>T('haftaSonuclariUygula')(x,id,S,toh(id),{},T('haftaninDigerMaclari')(x,id).map(g=>({macId:g.id,sonuc:Z,tohum:toh(g.id)})))).kariyer;};
  /* maç sınırındaysa haftayı oynar, değilse İlerle */
  const ileri=c=>{const j=macIsi(c);return j&&c.tarih===j.tarih&&c.gunIciDakika===j.dakika?hafta(c):ilerle(c);};
  let k=T('kariyerBaslat')({tohum:7});for(let i=0;i<6;i++)k=hafta(k);
  denetle('Dönem dışında (Aralık) transfer paketi açılmaz; dönem 4–31 Ocak',!Object.values(k.olaylar).some(o=>o.paket==='gelenTeklif'||o.paket==='hocaTalebi')&&!T('transferDonemi')(k,'2026-12-20')&&!!T('transferDonemi')(k,'2027-01-15')&&!T('transferDonemi')(k,'2027-02-01'));
  const kT=ilerle(k),OT=Object.values(kT.olaylar).find(o=>o.paket==='hocaTalebi'),kr=Object.values(kT.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='transferButcesi');
  const h0=kT.kulupler[biz].hocaId,K=T('konusmaListesi')(kT).find(x=>x.anahtar===h0);
  denetle('5 Ocak 11:00 hocanın isteği: zayıf hat, TEST bütçe (bonservis 400 bin–1,2 M ₺, maaş tavanı); hocanın mesajı ve kararı telefonda (soran hoca); iki cevap',
    `${kT.tarih} ${kT.gunIciDakika}`==='2027-01-05 660'&&!!OT&&!!kr&&['DEF','OS','FV'].includes(kr.veri.mevki)&&kr.veri.bonservis>=40000000&&kr.veri.bonservis<=120000000&&kr.veri.tavan>0
    &&kr.veri.soran===h0&&!!K&&K.mesajlar.some(x=>x.yon==='gelen'&&/oyuncu lazım/.test(x.metin))&&K.kararlar.includes(kr.id)&&metin(T('kararSecenekleri')(kT,kr).map(s=>s.id))==='["onayla","reddet"]',
    kr&&`${kr.veri.mevki} · ${T('paraYazi')(kr.veri.bonservis)} · tavan ${T('paraYazi')(kr.veri.tavan)}`);
  {const Y=T('simdiGelenKararlar')(kT);denetle('Oda özeti: 5 Ocak hocanın isteği bu anda gelen karar ve telefonda (soranın konuşmasında)',Y.length===1&&Y[0].id===kr.id&&T('kararTelefondaMi')(kT,Y[0]));}
  /* H2-c (H1 bulgusu): hoca değişince soranı o olan karar (hocanın isteği) düşer; gelen teklif dosyada sürer, eski hocanın konuşmasında görünmez */
  {let c=kT;for(let g=0;g<5&&!Object.values(c.isler).some(x=>x.veri&&x.veri.karar==='teklifKarari');g++)c=ilerle(c);
   const tk=Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='teklifKarari'),ist=c.isler[kr.id];
   const cd=tk&&ist?KK(c,x=>T('hocaDegistir')(x,biz,T('hocaAdaylari')(x,biz)[0])).kariyer:c,m=cd.meseleler[kr.veri.meseleId],Kd=T('konusmaListesi')(cd).find(x=>x.anahtar===h0)||{kararlar:[],dosyaKarar:[]};
   denetle('H2-c: hoca değişince hocanın isteği düşer (geçmişte iptal, konuda “… görevden ayrıldı; … düştü”, konu kapalı, bekleyen imza yok); gelen teklif dosyada iki cevapla verilebilir; eski hocanın konuşmasında karar ve dosya bağlantısı yok, teklif telefonda değil',
     !!tk&&!!ist&&!cd.isler[kr.id]&&cd.gecmis.some(g=>g.tur==='iptal'&&g.isId===kr.id)&&m.durum==='kapandi'&&m.olaylar.some(o=>o.anahtar==='kisiAyrildi')
     &&!Object.values(cd.isler).some(x=>x.veri&&x.veri.gelisme==='transferImza')&&!!cd.isler[tk.id]&&T('kararSecenekleri')(cd,cd.isler[tk.id]).length===2
     &&!Kd.kararlar.length&&!Kd.dosyaKarar.length&&!T('kararTelefondaMi')(cd,cd.isler[tk.id])&&!T('kariyerDogrula')(cd).length,`${c.tarih} ${c.gunIciDakika}`);}
  /* imza: onay → 5 gün sonra */
  let kO=KK(kT,x=>T('ajandaIsiYap')(x,kr.id,'onayla')).kariyer;
  {const ch=KK(kO,x=>T('hocaDegistir')(x,biz,T('hocaAdaylari')(x,biz)[0])).kariyer;
   denetle('H2-c: onaylanmış istekten doğan imza hoca değişse de sürer (kulüp bütçe kararını uygular)',Object.values(ch.isler).some(x=>x.veri&&x.veri.gelisme==='transferImza')&&!T('kariyerDogrula')(ch).length);}const imzaIs=Object.values(kO.isler).find(x=>x.tur==='gelisme'&&x.veri.gelisme==='transferImza');
  denetle('Onay: imza işi 5 gün sonra 11:00 (dönem içinde, gizli); konu haber bekliyor',!!imzaIs&&imzaIs.tarih==='2027-01-10'&&T('isGizli')(imzaIs)&&kO.meseleler[OT.meseleId].durum==='haberBekliyor');
  {let c=kO,r=null;for(let g=0;g<12&&!c.gecmis.some(x=>x.tur==='transfer'&&x.yeni===biz);g++){const j=macIsi(c);if(j&&c.tarih===j.tarih&&c.gunIciDakika===j.dakika)c=hafta(c);else{const R=KK(c,x=>T('duragaIlerle')(x));c=R.kariyer;r=R.sonuc;}}
   denetle('İmza durağı karar açmaz: oda özeti için bu anda gelen karar yok (“Yeni bir gelişme var”), hocanın teşekkürü telefonda okunmamış haber',
     !!r&&r.neden==='karar'&&!T('simdiGelenKararlar')(c).length&&T('konusmaListesi')(c).some(x=>x.okunmamis>0&&x.mesajlar.some(m=>/Sağ olun başkanım, yeni oyuncu/.test(m.metin))),r&&`${c.tarih} ${c.gunIciDakika} ${r.neden}`);}
  for(let g=0;g<12&&!kO.gecmis.some(x=>x.tur==='transfer'&&x.yeni===biz);g++)kO=ileri(kO);
  const tr=kO.gecmis.find(x=>x.tur==='transfer'&&x.yeni===biz),yeni=tr&&kO.oyuncular[tr.oyuncuId];
  denetle('İmza: istenen hatta oyuncu kulübe katıldı; sözleşme maaşı tavanı aşmaz, bitiş 2029; satan kulüp 22\'ye tamamlandı; numaralar tekil; kariyer geçerli',
    !!yeni&&yeni.kulupId===biz&&yeni.mevki===kr.veri.mevki&&yeni.sozlesme.maas<=kr.veri.tavan&&yeni.sozlesme.bitis==='2029-05-31'&&(!tr.eski||T('kulupOyunculari')(kO,tr.eski).length>=22)
    &&(()=>{const N=T('kulupOyunculari')(kO,biz).map(p=>p.no);return new Set(N).size===N.length;})()&&!T('kariyerDogrula')(kO).length,
    yeni&&`${yeni.ad} (${yeni.mevki}) · ${tr.eski||'serbest'} · bonservis ${T('paraYazi')(tr.bedel)} · maaş ${T('paraYazi')(yeni.sozlesme.maas)}`);
  {let c=kO;for(let g=0;g<6&&c.meseleler[OT.meseleId].durum!=='kapandi';g++)c=ileri(c);
   denetle('Bonservis ertesi gün kasadan düşer (bedelli imzada), konu kapanır; hoca teşekkür eder',(!tr||tr.bedel===0||c.hareketler.some(h=>h.kalem==='transfer'&&h.tutar===-tr.bedel))&&c.meseleler[OT.meseleId].durum==='kapandi'
     &&T('konusmaListesi')(c).find(x=>x.anahtar===h0).mesajlar.some(x=>/Sağ olun başkanım, yeni oyuncu/.test(x.metin)));}
  {let c=KK(kT,x=>T('ajandaIsiYap')(x,kr.id,'onayla')).kariyer;const a=T('hocaAdaylari')(c,biz,'deneme')[0];c=KK(c,x=>{T('hocaDegistir')(x,biz,a);}).kariyer;
   const h1=c.kulupler[biz].hocaId;for(let g=0;g<12&&!c.gecmis.some(x=>x.tur==='transfer'&&x.yeni===biz);g++)c=ileri(c);
   const ks=T('konusmaListesi')(c),M=x=>(ks.find(y=>y.anahtar===x)||{mesajlar:[]}).mesajlar.some(m=>/Sağ olun başkanım, yeni oyuncu/.test(m.metin));
   denetle('Bütçe onayıyla imza arasında hoca değişirse imza olur, teşekkürü görevdeki hoca eder (ayrılan hoca yazmaz)',h1!==h0&&c.gecmis.some(x=>x.tur==='transfer'&&x.yeni===biz)&&M(h1)&&!M(h0));}
  {const say={};for(const t of [1,2,3,4,5]){const c=T('kariyerBaslat')({tohum:t});for(const id of Object.keys(c.kulupler)){const m=T('zayifHat')(c,id);say[m]=(say[m]||0)+1;}}
   denetle('Hocanın istediği hat ligin aynı hattıyla kıyaslanır: 5 tohum × 16 kulüpte üç hat da çıkar, hiçbiri %70\'i geçmez',Object.keys(say).length===3&&Object.values(say).every(n=>n<=56),metin(say));}
  {const k0=T('kariyerBaslat')({tohum:7}),kp=T('kulupOyunculari')(k0,biz).find(p=>p.kaptan),c=KK(k0,x=>{T('oyuncuTransfer')(x,kp.id,'akdeniz',{bedel:0,sozlesme:{maas:100000,bitis:'2029-05-31'}});}).kariyer;
   denetle('Transferde kaptan bayrağı oyuncuyla gitmez: alan kulüpte tek kaptan; kariyer geçerli',!c.oyuncular[kp.id].kaptan&&T('kulupOyunculari')(c,'akdeniz').filter(p=>p.kaptan).length===1&&!T('kariyerDogrula')(c).length,kp.ad);}
  {const c=KK(kT,x=>T('ajandaIsiYap')(x,kr.id,'reddet')).kariyer;denetle('Reddet: imza yok, konu kapanır',!Object.values(c.isler).some(x=>x.veri&&x.veri.gelisme==='transferImza')&&c.meseleler[OT.meseleId].durum==='kapandi');}
  /* gelen teklif (7 Ocak) */
  const kTek=ilerle(kT),OG=Object.values(kTek.olaylar).find(o=>o.paket==='gelenTeklif'),tk=Object.values(kTek.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='teklifKarari');
  const p=tk&&kTek.oyuncular[tk.veri.oyuncuId],tb=T('sezonTablosu')(kTek),sira=id=>tb.findIndex(t=>t.id===id);
  {const Y=T('simdiGelenKararlar')(kTek);denetle('Oda özeti: hocanın isteği telefonda beklerken 7 Ocak teklifi gelir — bu anda gelen karar yalnız teklif ve telefonda (H1: hocanın konuşmasında dosya bağlantısıyla; “Telefon: karar gerektiren bir haber geldi.”)',
    Y.length===1&&Y[0].id===tk.id&&T('kararTelefondaMi')(kTek,Y[0])&&T('konusmaListesi')(kTek).some(c=>c.cevapBekliyor));}
  /* H1 (G2 borcu): hocanın görüşü telefonda (mesele olayı tr.hocaGorus, gönderen hoca); karar dosyada kalır, kanıt aynen */
  {const hId=kTek.kulupler[biz].hocaId,hg=kTek.meseleler[OG.meseleId].olaylar.filter(o=>o.anahtar==='tr.hocaGorus');
   const K=T('konusmaListesi')(kTek).find(x=>x.anahtar===hId),M=K?K.mesajlar.filter(x=>x.meseleId===OG.meseleId):[];
   const ilk=kTek.kulupler[biz].kadro.ilk11.includes(p.id),beklenen=ilk?`${p.ad} takımın önemli parçası; gitmesini istemem.`:`${p.ad} gidebilir, yerini doldururuz.`;
   denetle('Teklifte hocanın görüşü telefonda (H1, tr.hocaGorus): hocanın konuşmasında birinci tekil gelen mesaj ve teklif notu; karar dosyada (soran yok, konuşmada dosya bağlantısı), cevap bekliyor; dosyadaki kanıt aynen',
     hg.length===1&&hg[0].p.kisiId===hId&&!!K&&M.some(x=>x.yon==='gelen'&&x.metin===beklenen)&&M.some(x=>x.yon==='not'&&/teklif etti/.test(x.metin))&&K.dosyaKarar.includes(OG.meseleId)
     &&!K.kararlar.includes(tk.id)&&!tk.veri.soran&&K.cevapBekliyor&&OG.bilgiler.some(b=>b.anahtar==='tr.kanit.hoca'&&b.kaynak===hId),M.map(x=>x.yon+': '+x.metin).join(' | '));}
  /* hocanın isteği cevaplanmışken teklif hocanın konuşmasında tek başına cevap bekletir; Sat ya da Reddet sonrası orada giden ve bekleyen yok */
  {const kR=ilerle(KK(kT,x=>T('ajandaIsiYap')(x,kr.id,'reddet')).kariyer),tR=Object.values(kR.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='teklifKarari');
   const hId=kR.kulupler[biz].hocaId,K=c=>T('konusmaListesi')(c).find(x=>x.anahtar===hId)||{kararlar:[],dosyaKarar:[],mesajlar:[],cevapBekliyor:false,yok:true};
   const sonra=tR?['sat','reddet'].map(s=>{const c=KK(kR,x=>T('ajandaIsiYap')(x,tR.id,s)).kariyer,q=K(c);
     return!q.yok&&!q.cevapBekliyor&&!q.dosyaKarar.length&&!q.mesajlar.some(x=>x.meseleId===tR.veri.meseleId&&x.yon==='giden')&&q.mesajlar.some(x=>x.meseleId===tR.veri.meseleId&&x.yon==='gelen')&&!T('kariyerDogrula')(c).length;}):[];
   denetle('İstek cevaplanmışken teklif hocanın konuşmasında tek başına cevap bekletir; Sat ya da Reddet sonrası hocanın konuşmasında giden yok, bekleyen yok, görüş mesajı kalır',
     `${kR.tarih} ${kR.gunIciDakika}`==='2027-01-07 660'&&!!tR&&!K(kR).kararlar.length&&K(kR).cevapBekliyor&&K(kR).dosyaKarar.includes(tR.veri.meseleId)&&sonra.length===2&&sonra.every(Boolean),
     `${an(kR)} · sat/reddet ${metin(sonra)}`);}
  denetle('7 Ocak 11:00 gelen teklif: değeri yüksek bir saha oyuncumuz, tabloda üstümüzdeki (ya da herhangi) bir kulüpten, bedel değerin 0,9–1,2 katı; kanıtlar kaynaklı; iki cevap',
    `${kTek.tarih} ${kTek.gunIciDakika}`==='2027-01-07 660'&&!!OG&&!!tk&&p.kulupId===biz&&p.mevki!=='KL'&&OG.bilgiler.length>=2
    &&(sira(tk.veri.alici)<sira(biz)||sira(biz)===0)&&tk.veri.bedel>=Math.round(T('oyuncuDegeri')(p,kTek.tarih)*0.9/1000000)*1000000-1000000&&metin(T('kararSecenekleri')(kTek,tk).map(s=>s.id))==='["sat","reddet"]',
    tk&&`${p.ad} → ${tk.veri.alici} · ${T('paraYazi')(tk.veri.bedel)}`);
  {const c=KK(kTek,x=>T('ajandaIsiYap')(x,tk.id,'sat')).kariyer,q=c.oyuncular[p.id],od=Object.values(c.isler).find(x=>x.tur==='odeme'&&x.veri.kalem==='transfer');
   const N=T('kulupOyunculari')(c,tk.veri.alici).map(o=>o.no);
   denetle('Sat: oyuncu alıcı kulüpte (sözleşmesiyle, numarası orada tekil), bizim kadro gençle 22, ilk 11 geçerli; bedel ertesi gün kasaya; gazetede haber; kariyer geçerli',
     q.kulupId===tk.veri.alici&&!!q.sozlesme&&new Set(N).size===N.length&&T('kulupOyunculari')(c,biz).length===22&&!c.kulupler[biz].kadro.ilk11.includes(p.id)
     &&!!od&&od.veri.tutar===tk.veri.bedel&&od.tarih==='2027-01-08'&&c.haberler.some(h=>h.anahtar==='tr.haber')&&!T('kariyerDogrula')(c).length);
   const d=T('bellekDeposu')();T('kariyerKaydet')(d,'s',c);const y=T('kariyerYukle')(d,'s');denetle('Kaydet–yükle: satış sonrası aynı',y.tamam&&metin(y.kariyer)===metin(c));}
  {const c=KK(kTek,x=>T('ajandaIsiYap')(x,tk.id,'reddet')).kariyer;denetle('Reddet: oyuncu kalır, konu kapanır',c.oyuncular[p.id].kulupId===biz&&c.meseleler[OG.meseleId].durum==='kapandi');}
  {let c=kTek;for(let g=0;g<8&&Object.values(c.isler).some(x=>x.veri&&x.veri.karar==='teklifKarari');g++)c=ileri(c);
   denetle('Cevapsız: teklif geri çekilir, oyuncu kalır',c.oyuncular[p.id].kulupId===biz&&c.meseleler[OG.meseleId].olaylar.some(x=>x.anahtar==='tr.cevapsiz'));}
  {const k2=(()=>{let c=T('kariyerBaslat')({tohum:7});for(let i=0;i<6;i++)c=hafta(c);return ilerle(ilerle(c));})();
   denetle('Aynı tohum aynı teklif ve istek (belirlenimci)',metin(k2.olaylar)===metin(kTek.olaylar)&&metin(k2.isler)===metin(kTek.isler));}
}

bolum('5.1b — sezon sonunda biten sözleşmeler (G2-c; oyunun yüklediği dosyalar)');
{
  const T=oyunAl,KK=T('kariyerKomut'),biz='demirkapi',toh=id=>T('macTohumu')(7,id);
  const macIsi=c=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'),ilerle=c=>KK(c,x=>T('duragaIlerle')(x)).kariyer;
  const Z={skor:[0,0],bitti:true,goller:[],kartlar:[],sakatliklar:[],degisiklikler:[],ist:{}};
  const hafta=c=>{const j=macIsi(c);for(let g=0;g<20&&!(c.tarih===j.tarih&&c.gunIciDakika===j.dakika);g++)c=ilerle(c);c=KK(c,x=>T('ajandaIsiYap')(x,j.id)).kariyer;const id=j.veri.macId;
    return KK(c,x=>T('haftaSonuclariUygula')(x,id,Z,toh(id),{},T('haftaninDigerMaclari')(x,id).map(g=>({macId:g.id,sonuc:Z,tohum:toh(g.id)})))).kariyer;};
  let k=T('kariyerBaslat')({tohum:7}),ufukSubat=null;while(macIsi(k)){k=hafta(k);if(!ufukSubat&&k.tarih>='2027-02-20')ufukSubat=T('nakitUfku')(k,biz,90);}
  {const ab=ufukSubat.adimlar.filter(a=>a.kesin&&/ay başı/.test(a.neden)).map(a=>a.tarih);
   denetle('Nakit ufku ay başı kuralını izler: Şubat sonunda kesin ay başları 1 Mart ve 1 Nisan (son maçtan sonraki ilk ay başı sonuncu; 1 Mayıs gelmeyecek)',metin(ab)==='["2027-03-01","2027-04-01"]',metin(ab));}
  const bitenler=T('kulupOyunculari')(k,biz).filter(p=>p.sozlesme&&p.sozlesme.bitis==='2027-05-31'),M=Object.values(k.meseleler).find(m=>m.tur==='sozlesme');
  const kart=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='sozlesmeYenile');
  const obur=Object.values(k.oyuncular).filter(p=>p.kulupId&&p.kulupId!==biz);
  denetle('Sezon sonunda: bizim bitenler için dosya ve ilk kart (acil değil, 7 gün); öbür kulüplerin bitenleri kendiliğinden bir yıl uzadı',
    bitenler.length>0&&!!M&&!!kart&&kart.veri.sira.length===bitenler.length-1&&kart.veri.bekleyebilir&&obur.every(p=>!p.sozlesme||p.sozlesme.bitis!=='2027-05-31'),`${bitenler.length} biten · ${kart&&kart.veri.baslik}`);
  const p0=k.oyuncular[kart.veri.oyuncuId];
  {const c=KK(k,x=>T('ajandaIsiYap')(x,kart.id,'yenile')).kariyer,q=c.oyuncular[p0.id],sonraki=Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='sozlesmeYenile');
   denetle('Yenile: iki yıl (2029), maaş eskisinden düşük değil; sıradaki kart açılır',q.sozlesme.bitis==='2029-05-31'&&q.sozlesme.maas>=p0.sozlesme.maas&&(bitenler.length===1||!!sonraki&&sonraki.veri.oyuncuId!==p0.id),
     `${T('paraYazi')(p0.sozlesme.maas)} → ${T('paraYazi')(q.sozlesme.maas)}`);}
  {const c=KK(k,x=>T('ajandaIsiYap')(x,kart.id,'birak')).kariyer,q=c.oyuncular[p0.id];
   {const yeni=T('kulupOyunculari')(c,biz).filter(q=>!k.oyuncular[q.id]);
    const x=KK(k,y=>{const q=T('kulupOyunculari')(y,biz)[0];y.oyuncular=Object.assign({},y.oyuncular,{[q.id]:Object.assign({},q,{sozlesme:null})});T('sozlesmeleriTamamla')(y);}).kariyer;
    denetle('Sezon sonu kaydından sonra kurulan sözleşme bu sezon sonunda bitmez (Bırak\'tan sonra gelen genç; sözleşmesiz kalmış oyuncu — sürüm 8\'den Mart\'ta geçen kayıt)',
      yeni.length>0&&yeni.every(q=>q.sozlesme.bitis>'2027-05-31')&&T('kulupOyunculari')(x,biz)[0].sozlesme.bitis>'2027-05-31');}
   denetle('Bırak: oyuncu serbest (kulüpsüz, sözleşmesiz, kadro listelerinde yok); kadro gençle 22; geçmişte ayrılış; kariyer geçerli',q.kulupId===null&&q.sozlesme===null&&T('kulupOyunculari')(c,biz).length===22
     &&!c.kulupler[biz].kadro.ilk11.concat(c.kulupler[biz].kadro.yedekler).includes(p0.id)&&c.gecmis.some(g=>g.tur==='ayrilis'&&g.oyuncuId===p0.id)&&!T('kariyerDogrula')(c).length);}
  {let c=k;for(let g=0;g<80&&Object.values(c.isler).some(x=>x.veri&&x.veri.karar==='sozlesmeYenile');g++)c=ilerle(c);
   const ayrilan=c.gecmis.filter(g=>g.tur==='ayrilis').length,maaslar=c.hareketler.filter(h=>h.kalem==='maas').map(h=>h.tarih);
   denetle('Gerçek akışta ay başları 1 Aralık – 1 Nisan (ufukla aynı); sezon sonrasında bekleyen ay başı yok',metin(maaslar)==='["2026-12-01","2027-01-01","2027-02-01","2027-03-01","2027-04-01"]'
     &&!Object.values(c.isler).some(x=>x.tur==='ayBasi'),metin(maaslar));
   denetle('Cevapsız kalan kartlar: imza yok, oyuncular ayrılır; zincir sonuna dek; dosya kapanır; sonra İlerle “Sezon tamamlandı”',ayrilan===bitenler.length&&c.meseleler[M.id].durum==='kapandi'
     &&(()=>{let x=c;for(let g=0;g<10&&!T('ilerleOnizle')(x).engel.length;g++)x=ilerle(x);return T('ilerleOnizle')(x).engel[0]===T('SEZON_SONU_METNI');})(),`${ayrilan} ayrılış`);}
}

bolum('5.1c — iki kalecinin sözleşmesi birlikte biter (G2 incelemesi; tohum 10)');
{
  const T=oyunAl,KK=T('kariyerKomut'),biz='demirkapi',toh=id=>T('macTohumu')(10,id);
  const macIsi=c=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'),ilerle=c=>KK(c,x=>T('duragaIlerle')(x)).kariyer;
  const Z={skor:[0,0],bitti:true,goller:[],kartlar:[],sakatliklar:[],degisiklikler:[],ist:{}};
  const hafta=c=>{const j=macIsi(c);for(let g=0;g<40&&!(c.tarih===j.tarih&&c.gunIciDakika===j.dakika);g++)c=ilerle(c);c=KK(c,x=>T('ajandaIsiYap')(x,j.id)).kariyer;const id=j.veri.macId;
    return KK(c,x=>T('haftaSonuclariUygula')(x,id,Z,toh(id),{},T('haftaninDigerMaclari')(x,id).map(g=>({macId:g.id,sonuc:Z,tohum:toh(g.id)})))).kariyer;};
  let k=T('kariyerBaslat')({tohum:10});while(macIsi(k))k=hafta(k);
  const KL=c=>T('kulupOyunculari')(c,biz).filter(p=>p.mevki==='KL'),kart=c=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='sozlesmeYenile');
  const kalecilerBiter=KL(k).filter(p=>p.sozlesme.bitis==='2027-05-31').length;
  const kontrol=c=>KL(c).length>=2&&c.oyuncular[c.kulupler[biz].kadro.ilk11[0]].mevki==='KL'&&!T('kariyerDogrula')(c).length;
  let c=k,hata=null;try{for(let g=0;g<40&&kart(c);g++){const x=kart(c);c=KK(c,y=>T('ajandaIsiYap')(y,x.id,'birak')).kariyer;}}catch(e){hata=e.message;}
  denetle('Bütün kartlarda Bırak: iki kaleci de ayrılır, komut çökmez; kadroda en az iki kaleci, ilk 11\'in ilk yuvası kaleci; kariyer geçerli',kalecilerBiter===2&&!hata&&!kart(c)&&kontrol(c),
    hata||`${KL(c).map(p=>p.ad+'#'+p.no).join(', ')}`);
  let d=k;hata=null;try{for(let g=0;g<120&&kart(d);g++)d=ilerle(d);}catch(e){hata=e.message;}
  denetle('Kartlar cevapsız: zaman aşımında oyuncular ayrılır, İlerle takılmaz; iki kaleci kalır',!hata&&!kart(d)&&kontrol(d),hata||d.tarih);
}

bolum('3.7a — hoca değişimi ve P12 “Hocaya sabır mı, değişim mi?” TEST taslağı (F6-a; oyunun yüklediği dosyalar)');
{
  const P=oyunAl,KK=P('kariyerKomut'),KAYNAK=['puanDurumu','macRaporlari'];
  const macIsi=c=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
  const ilerle=c=>{const r=KK(c,x=>P('duragaIlerle')(x));return Object.assign(r.kariyer,{_neden:r.sonuc.neden});};
  /* maç gününe dek İlerle (P12 kararı bekliyorsa cevapsız kalır); maç günü işi; sonuç: G galibiyet, B 0–0, M yenilgi (atansız tek gol) */
  const macaGit=c=>{const j=macIsi(c);for(let g=0;g<12&&!(c.tarih===j.tarih&&c.gunIciDakika===j.dakika);g++)c=ilerle(c);return c;};
  const macOyna=(c,s)=>{c=macaGit(c);const j=macIsi(c),f=c.fikstur.find(x=>x.id===j.veri.macId),t=f.konuk==='demirkapi'?1:0;
    c=KK(c,x=>P('ajandaIsiYap')(x,j.id)).kariyer;
    const skor=s==='B'?[0,0]:s==='G'?(t?[0,1]:[1,0]):(t?[1,0]:[0,1]),goller=s==='B'?[]:[{no:0,takim:skor[0]>skor[1]?0:1,dakika:30}];
    const S={skor,bitti:true,goller,kartlar:[],sakatliklar:[],degisiklikler:[],ist:{sut:[5,3],isabet:[2,1],korner:[3,1],faul:[6,7],sari:[0,0],kirmizi:[0,0],ofsayt:[1,0],sahiplik:[0.5,0.5]}};
    return KK(c,x=>P('macSonucuUygula')(x,j.veri.macId,S,P('macTohumu')(7,j.veri.macId))).kariyer;};
  const seri=(c,L)=>{for(const s of L)c=macOyna(c,s);return c;};
  const p12=c=>Object.values(c.olaylar).filter(o=>o.paket==='hocaDegerlendirme');
  const karar=(c,tur)=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.karar===tur)||null;
  const yap=(c,id,s)=>KK(c,x=>P('ajandaIsiYap')(x,id,s)).kariyer;
  const kayitTur=c=>{const d=P('bellekDeposu')();P('kariyerKaydet')(d,'s',c);const y=P('kariyerYukle')(d,'s');return y.tamam&&metin(y.kariyer)===metin(c)?y.kariyer:null;};
  const k0=P('kariyerBaslat')({tohum:7}),h0=k0.kulupler.demirkapi.hocaId,hoca0=k0.kisiler[h0];

  /* iki yenilgi: koşul tutmaz; gelişme her maç akşamı kurulur, iz bırakmaz */
  const k2=seri(k0,['M','M']),gel=Object.values(k2.isler).filter(x=>x.tur==='gelisme'&&x.veri.gelisme==='hocaBaskisi');
  const k2b=ilerle(k2);
  denetle('İki yenilgi: maç akşamı 21:30 gizli gelişme kurulur; koşul tutmaz, konu açılmaz, ajandada iz kalmaz, İlerle maç gününe gider',
    gel.length===1&&gel[0].tarih===k2.tarih&&gel[0].dakika===1290&&gel[0].veri.hocaId===h0&&!p12(k2b).length&&!!macIsi(k2b)&&k2b.tarih===macIsi(k2b).tarih
    &&!P('ajandaGunu')(k2b,k2.tarih).some(r=>r.tur==='gelisme'),`${gel.length} gelişme · ${an(k2b)}`);
  /* üçüncü yenilgi: konu açılır */
  const k3=seri(k0,['M','M','M']),a3=an(k3),k3b=ilerle(k3),O=p12(k3b)[0],m=O&&k3b.meseleler[O.meseleId],kr=karar(k3b,'hocaKarari');
  const SE=kr?P('kararSecenekleri')(k3b,kr):[];
  denetle('Üç yenilgi (en çok 1 puan): maç akşamı 21:30 konu açılır, İlerle orada durur; mesele Futbol kategorisinde, varyant puan, konu hoca:<hoca>:<maç>',
    a3.endsWith('21:00')&&an(k3b).endsWith('21:30')&&k3b._neden==='karar'&&!!O&&O.varyant==='puan'&&O.konu===`hoca:${h0}:${Object.keys(k3b.maclar).pop()}`&&m.baslik==='Hocaya sabır mı, değişim mi?'
    &&P('meseleKategorisi')(m)[0]==='Futbol'&&m.kisiler.includes(h0),`${a3} → ${an(k3b)} · ${O&&O.varyant} · ${O&&O.konu}`);
  denetle('Kanıtlar kaynaklı ve tarihli (puan durumu, maç raporları); gizli değer (bilgi, ısrar) metinde yok',
    O.bilgiler.length>=2&&O.bilgiler.every(b=>KAYNAK.includes(b.kaynak)&&b.tarih===k3b.tarih)&&(()=>{const o=P('meseleOzeti')(k3b,O.meseleId),T=o.bilgiler.map(b=>b.metin).join(' ');
      return /M M M \(0 puan\)/.test(T)&&/beklenen golü/.test(T)&&!T.includes(String(hoca0.hoca.bilgi))&&!T.includes(String(hoca0.hoca.israr));})(),
    P('meseleOzeti')(k3b,O.meseleId).bilgiler.map(b=>b.kaynak+': '+b.metin).join(' | '));
  denetle('Karar acil değil, iki cevap: sabır ve değişim; son cevap iki gün sonra 18:00; cevapsız kalırsa sonucu kartta yazar',
    !!kr&&kr.veri.saatsiz&&kr.veri.bekleyebilir&&metin(SE.map(s=>s.id))==='["sabir","degisim"]'&&kr.tarih===P('tarihEkle')(k3b.tarih,2)&&kr.dakika===1080
    &&P('zamanAsimiVar')(kr)&&/görevde kalır/.test(P('zamanAsimiMetni')(k3b,kr)),SE.map(s=>s.metin).join(' / '));
  {const K=P('konusmaListesi')(k3b).find(x=>x.anahtar===h0);
   denetle('Telefonda hocanın konuşması: hocanın mesajı gelir; karar dosyada (soran yok), konuşmadan bağlantı; cevap bekliyor',
     !!K&&K.mesajlar.some(x=>x.yon==='gelen'&&/zaman isterim/.test(x.metin))&&K.dosyaKarar.includes(O.meseleId)&&K.cevapBekliyor,K&&K.mesajlar.map(x=>x.yon+':'+x.metin.slice(0,30)).join(' | '));}
  denetle('Kaydet–yükle: konu açıkken aynı kariyer, geçerli',!!kayitTur(k3b)&&!P('kariyerDogrula')(k3b).length);

  /* sabır */
  const ks=yap(k3b,kr.id,'sabir'),sz=Object.values(ks.sozler)[0],hat=sz&&ks.isler[sz.isId];
  const sabSon=P('p12SabirSonu')(k3b,'demirkapi'),ucuncu=k3b.fikstur.filter(f=>(f.ev==='demirkapi'||f.konuk==='demirkapi')&&f.hafta>=k3b.sezon.ilkHafta&&!k3b.maclar[f.id]).sort((a,b)=>a.hafta-b.hafta)[2];
  denetle('Sabır: söz (muhatap hoca, 3 maç: bağlı iş üçüncü maçın akşamı 21:00 hatırlatma); mesele haber bekliyor; hocanın teşekkürü; panoda not',
    !!sz&&sz.muhatap===h0&&sz.durum==='acik'&&sz.anahtar==='p12.soz'&&!!hat&&hat.tur==='hatirlatma'&&hat.veri.hocaSuresi===h0&&sabSon.mac===3&&hat.tarih===ucuncu.tarih&&hat.dakika===1260
    &&ks.meseleler[O.meseleId].durum==='haberBekliyor'&&P('konusmaListesi')(ks).find(x=>x.anahtar===h0).mesajlar.some(x=>/Sağ olun/.test(x.metin))&&P('odaIzleri')(ks).panoNotu,
    sz&&`${sz.durum} · ${hat&&hat.tarih} · ${ks.meseleler[O.meseleId].durum}`);
  const ks2=ilerle(seri(ks,['M','M']));
  denetle('Sabır süresinde iki yenilgi daha: konu açık kalır, yeniden açılmaz; İlerle üçüncü maçın gününe gider',p12(ks2).length===1&&p12(ks2)[0].durum==='acik'&&ks2.sozler[sz.id].durum==='acik'&&ks2.tarih===ucuncu.tarih,an(ks2));
  const ks3=seri(ks2,['M']),sz3=ks3.sozler[sz.id],ks3b=ilerle(ks3);
  denetle('Üçüncü maçın akşamı süre dolar: söz tutulur, konu kapanır; kötü gidiş sürdüğü için 21:30 konu yeniden açılır (yeni konu)',
    an(ks3).endsWith('21:00')&&sz3.durum==='tutuldu'&&p12(ks3)[0].durum==='kapandi'&&ks3.meseleler[O.meseleId].olaylar.some(x=>x.anahtar==='soz.tutuldu')
    &&an(ks3b).endsWith('21:30')&&p12(ks3b).length===2&&p12(ks3b)[1].durum==='acik'&&p12(ks3b)[1].konu!==p12(ks3b)[0].konu,`${sz3.durum} · ${an(ks3)} → ${an(ks3b)}`);
  {const A=P('hocaAdaylari')(ks,'demirkapi','deneme');let c=KK(ks,x=>P('hocaDegistir')(x,'demirkapi',A[0])).kariyer;c=KK(c,x=>P('zamanIlerlet')(x,60)).kariyer;
   denetle('Sabır süresinde hoca başka yoldan değişirse süre işi iptal olur, söz bozulur ve dosyaya yazılır',c.sozler[sz.id].durum==='bozuldu'&&!c.isler[sz.isId]
     &&c.gecmis.some(g=>g.tur==='iptal'&&g.isId===sz.isId)&&c.meseleler[O.meseleId].olaylar.some(x=>x.anahtar==='soz.bozuldu')&&c.meseleler[O.meseleId].durum==='kapandi',c.sozler[sz.id].durum);}

  /* değişim: ertesi gün görüşme, iki aday sırayla */
  const kd=yap(k3b,kr.id,'degisim'),rd=Object.values(kd.isler).find(x=>x.tur==='ajanda'&&x.veri.etki==='hocaAdayGorusmesi'),A=rd&&rd.veri.adaylar;
  denetle('Değişim: ertesi gün 11:00 zorunlu görüşme; iki aday, tarzları bugünkü hocadan ve birbirinden farklı; adlar kariyerde yok; adaylar belirlenimci',
    !!rd&&rd.tarih===P('tarihEkle')(k3b.tarih,1)&&rd.dakika===660&&rd.veri.zorunluluk==='zorunlu'&&A.length===2&&A[0].tarz!==A[1].tarz&&A.every(a=>a.tarz!==hoca0.hoca.tarz)
    &&A.every(a=>!Object.values(kd.kisiler).some(p=>p.ad===a.ad))&&metin(A)===metin(P('hocaAdaylari')(k3b,'demirkapi',O.id)),A&&A.map(a=>`${a.ad} (${a.tarz})`).join(', '));
  let kg=ilerle(kd);
  denetle('İlerle görüşmenin başında durur; katılınca 1. adayın kartı: [Göreve al / Sıradaki adayı dinle]',an(kg)===`${rd.tarih} 11:00`&&(()=>{
    kg=yap(kg,rd.id);const c1=karar(kg,'hocaAdayi');return!!c1&&c1.veri.sira===0&&metin(P('kararSecenekleri')(kg,c1).map(s=>s.id))==='["al","sonraki"]';})(),an(kg));
  const c1=karar(kg,'hocaAdayi'),kg2=yap(kg,c1.id,'sonraki'),c2=karar(kg2,'hocaAdayi');
  denetle('Sıradaki aday: 2. adayın kartı [Göreve al / Mevcut hocayla devam]',!!c2&&c2.veri.sira===1&&metin(P('kararSecenekleri')(kg2,c2).map(s=>s.id))==='["al","devam"]');
  {const f=P('KARAR_TURLERI').hocaAdayi.kisi,once=metin(kg)+metin(kg2),x1=typeof f==='function'?f(kg,c1):{},x2=typeof f==='function'?f(kg2,c2):{};
   denetle('Aday kartının kişisi adaydır (H1, F6-a borcu: KARAR_TURLERI.hocaAdayi.kisi → {ad, rol}; dosyanın sağ sayfası); kanca kariyeri değiştirmez',
     x1.ad===A[0].ad&&x2.ad===A[1].ad&&x1.rol==='Teknik direktör adayı'&&x2.rol===x1.rol&&metin(kg)+metin(kg2)===once,`${x1.ad} · ${x2.ad} · ${x1.rol}`);}
  {const c=yap(kg2,c2.id,'devam');
   denetle('Mevcut hocayla devam: hoca aynı, konu kapanır, tazminat yok',c.kulupler.demirkapi.hocaId===h0&&c.meseleler[O.meseleId].durum==='kapandi'&&!Object.values(c.isler).some(x=>x.tur==='odeme'));}
  const tzB=P('hocaTazminati')(kg2,h0),ky=yap(kg2,c2.id,'al'),hy=ky.kulupler.demirkapi.hocaId,yh=ky.kisiler[hy],od=Object.values(ky.isler).find(x=>x.tur==='odeme'&&x.veri.meseleId===O.meseleId);   /* G2: tazminat sözleşmeden */
  denetle('Göreve al: yeni hoca kişisi (2. adayın tarzı), eski hoca ayrıldı, saha kenarı görünüşü ve adı yeni, geçmişte hoca değişimi; ertesi gün tazminat; gazetede haber',
    hy!==h0&&yh.ad===A[1].ad&&yh.hoca.tarz===A[1].tarz&&ky.kisiler[h0].durum==='ayrildi'&&ky.kulupler.demirkapi.kadro.td.ad===A[1].ad&&ky.kulupler.demirkapi.kadro.td.sac===A[1].td.sac
    &&ky.gecmis.some(g=>g.tur==='hocaDegisimi'&&g.eskiId===h0&&g.yeniId===hy)&&!!od&&tzB>0&&od.veri.tutar===-tzB&&od.veri.kalem==='tazminat'&&!!yh.sozlesme&&od.tarih===P('tarihEkle')(ky.tarih,1)
    &&ky.haberler.some(h=>h.anahtar==='p12.haber'&&h.p.kisiId===hy),`${yh.ad} · ${yh.hoca.tarz} · ${od&&od.tarih}`);
  {const j=macIsi(ky),G=P('macGirdisi')(ky,j.veri.macId);
   denetle('Sonraki maç girdisi yeni hocayla: tarz, hoca adı, saha kenarı adı',G.tarz[G.biz]===A[1].tarz&&G.hocalar[G.biz].id===hy&&G.kadro[G.biz].td.ad===A[1].ad,`${G.tarz[G.biz]} · ${G.kadro[G.biz].td.ad}`);
   const on=x=>{const H=P('macGirdisi')(x,j.veri.macId);return metin(H.kadro[H.biz].oyuncular.map(o=>o.id));};
   denetle('Yeni hoca eskisinin on birine bağlı değildir: ısrarı 0 olsa da aynı on bir (ısrar yalnız kendi son on birine; inceleme bulgusu)',
     on(ky)===on(KK(ky,x=>{x.kisiler[hy].hoca.israr=0;}).kariyer)&&ky.kisiler[hy].hoca.israr>0);}
  {const K=P('konusmaListesi')(ky).find(x=>x.anahtar===h0);
   denetle('Telefonda eski hocanın konuşmasında başkanın değişim ve aday cevapları yok (karar dosyada; inceleme bulgusu); rolü eski teknik direktör',
     !!K&&!K.mesajlar.some(x=>x.yon==='giden')&&!K.cevapBekliyor&&K.rol==='Eski teknik direktör',K&&K.mesajlar.map(x=>x.yon+':'+x.metin.slice(0,20)).join(' | '));}
  {const s=P('kararSecenekleri')(kg,c1).find(x=>x.id==='al');
   denetle('Göreve al seçeneği adayın gizli değerlerini yalnız TEST kutusu için taşır (gizli alanı); metinlerde yok',!!s&&s.gizli&&s.gizli.bilgi===A[0].bilgi&&s.gizli['ısrar']===A[0].israr
     &&![s.metin].concat(s.aciklama).some(x=>x.includes(String(A[0].bilgi).replace('.',','))||x.includes(String(A[0].bilgi))));}
  let kt=ilerle(ky);for(let g=0;g<4&&kt.meseleler[O.meseleId].durum!=='kapandi';g++)kt=ilerle(kt);
  denetle('Tazminat ödenince kasadan düşer; konu ve olay kapanır; eski hocanın mesajları telefonda kalır; kariyer geçerli, kaydet–yükle aynı',
    kt.hareketler.some(h=>h.kalem==='tazminat'&&h.tutar===-tzB)&&kt.meseleler[O.meseleId].durum==='kapandi'&&p12(kt)[0].durum==='kapandi'
    &&P('konusmaListesi')(kt).some(x=>x.anahtar===h0)&&!P('kariyerDogrula')(kt).length&&!!kayitTur(kt),an(kt));
  {const c=yap(kg,c1.id,'al');denetle('1. adayı göreve almak da çalışır (1. adayın tarzı)',c.kisiler[c.kulupler.demirkapi.hocaId].hoca.tarz===A[0].tarz&&c.kisiler[h0].durum==='ayrildi');}
  {const c=ilerle(seri(ky,['M','M']));
   denetle('Yeni hocanın iki maçı: eski hocanın yenilgileri sayılmaz, konu açılmaz',p12(c).length===1&&p12(c)[0].durum==='kapandi',an(c));}

  /* cevapsız */
  let kc=k3b;for(let g=0;g<6&&karar(kc,'hocaKarari');g++)kc=ilerle(kc);
  const gc=kc.gecmis.find(g=>g.tur==='is'&&g.isId===kr.id);
  denetle('Cevapsız: son cevap anında kartta yazan sonuçla kapanır; hoca görevde, söz yok, konu kapanır',!!gc&&gc.sonuc.durum==='cevapsiz'&&kc.kulupler.demirkapi.hocaId===h0
    &&!Object.keys(kc.sozler).length&&kc.meseleler[O.meseleId].olaylar.some(x=>x.anahtar==='p12.cevapsiz')&&kc.meseleler[O.meseleId].durum==='kapandi',gc&&gc.sonuc.durum);
  {let c=ilerle(seri(kc,['M']));const ara=p12(c).length===1;c=ilerle(seri(c,['M']));
   denetle('Cevapsızdan sonra: 14 gün dolmadan konu yeniden açılmaz; dolunca kötü gidiş sürüyorsa açılır',ara&&p12(c).length===2,`${p12(c).length} konu · ${an(c)}`);}

  /* galibiyetsiz varyant; galibiyet; eski içerik sürümü; bozuk aday */
  {let c=ilerle(seri(k0,['B','B','B','B']));const yok=!p12(c).length;c=ilerle(seri(c,['B']));
   denetle('Beş beraberlik: üçte 3 puan konu açmaz; beşinci maçta galibiyetsiz varyantla açılır',yok&&p12(c).length===1&&p12(c)[0].varyant==='galibiyetsiz',p12(c).map(o=>o.varyant).join());}
  {const c=ilerle(seri(k0,['M','M','G']));denetle('Son maç galibiyetse konu açılmaz (3 puan)',!p12(c).length);}
  {const c=KK(k0,x=>{x.icerik.surum=4;}).kariyer,d=seri(c,['M','M','M']);
   denetle('İçerik sürümü 4 ile kurulmuş kariyerde P12 gelişmesi kurulmaz (eski kariyerde sonradan eklenen paket açılmaz)',!Object.values(d.isler).some(x=>x.tur==='gelisme'&&x.veri.gelisme==='hocaBaskisi')&&!p12(ilerle(d)).length);}
  {const B=P('hocaAdayiDenetle'),a=P('hocaAdaylari')(k0,'demirkapi','x')[0];
   denetle('Bozuk aday reddedilir (tarz, bilgi); hocası olmayan kulüpte değişim reddedilir',B(Object.assign({},a,{tarz:'yok'})).length>0&&B(Object.assign({},a,{bilgi:2})).length>0
     &&reddeder(()=>KK(k0,x=>P('hocaDegistir')(x,'demirkapi',Object.assign({},a,{tarz:'yok'}))))&&reddeder(()=>KK(k0,x=>{x.kulupler.demirkapi.hocaId=null;P('hocaDegistir')(x,'demirkapi',a);})));}
}

/* ================= TEST içeriğiyle kural motoru ================= */
const [ilerleOnizle,duragaIlerle,kararSecenekleri,meseleOzeti,meseleListesi,meseleGoruldu,konusmaListesi,kariyerKomut,kayitOturumu,odaIzleri,testKosullar,testOnizleme,nakitAcigi,simdikiAn,anDakika]=
  ['ilerleOnizle','duragaIlerle','kararSecenekleri','meseleOzeti','meseleListesi','meseleGoruldu','konusmaListesi','kariyerKomut','kayitOturumu','odaIzleri','testKosullar','testOnizleme','nakitAcigi','simdikiAn','anDakika'].map(al);
const isAn=x=>anDakika(x.tarih,x.dakika);
const [ajandaOnizle,ajandaIsiYap,ajandaErtele,gunuBitirOnizle,gunuBitir,ajandaGunu]=['ajandaOnizle','ajandaIsiYap','ajandaErtele','gunuBitirOnizle','gunuBitir','ajandaGunu'].map(al);
/* TEST içerikli yeni kariyer */
const deneme=(se={},kosul)=>{const c=al('kariyerBaslat')({tohum:11});al('testIcerikKur')(c,se);if(kosul)c.kosullar.deneme=kosul;const h=kariyerDogrula(c);if(h.length)throw new Error(h.join('; '));return c;};
const kararIsi=c=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.karar)||null;
const saate=(c,tarih,dakika)=>{zamanIlerlet(c,anDakika(tarih,dakika)-simdikiAn(c));return c;};
const macSinirinda=c=>Object.values(c.isler).some(x=>x.veri.eylem==='macGunu'&&isAn(x)===simdikiAn(c));
/* maç sınırına kadar oyna: kararlar `secim` ile (sırası yoksa ilk geçerli), saatli işlere katılır; 'cevapsiz' kararları cevapsız bırakır */
function oyna(c,secim,araKayit){
  for(let n=0;n<300;n++){
    if(araKayit)c=araKayit(c);
    if(macSinirinda(c))return c;
    const b=kararIsi(c);
    if(b&&secim!=='cevapsiz'&&(b.veri.saatsiz||b.tarih===c.tarih)){const S=kararSecenekleri(c,b).map(s=>s.id);ajandaIsiYap(c,b.id,S.includes(secim)?secim:S[0]);continue;}
    const simdi=Object.values(c.isler).find(x=>x.tur==='ajanda'&&!x.veri.saatsiz&&isAn(x)===simdikiAn(c));
    if(simdi){ajandaIsiYap(c,simdi.id);continue;}
    duragaIlerle(c);
  }
  throw new Error('maç sınırına varılamadı: '+an(c));
}
const kaynaklar=c=>c.hareketler.map(h=>h.kaynak).filter(Boolean);

bolum('2.1 — ajanda: randevu, erteleme, kaçırma ve günü bitirme (TEST içeriği)');
{
  const c=deneme();
  denetle('TEST içerikli kariyer geçerli',...gecerli(c));
  const ilk=Object.values(c.isler).filter(x=>x.tur==='ajanda'&&!x.veri.eylem).sort((a,b)=>isAn(a)-isAn(b));
  const [randevu,istege]=ilk;
  const o=gunuBitirOnizle(c);
  denetle('Günü bitirmeden önce ertelenecek ve kaçırılacak iş bildirilir',!o.engel.length&&o.tasinacak.map(x=>x.id).join()===randevu.id&&o.kacirilacak.map(x=>x.id).join()===istege.id);
  const p=ajandaOnizle(c,randevu.id);
  denetle('Randevu önizlemesi: 11:00–11:30, engel yok',!p.engel.length&&saatYazi(p.baslangic%1440)==='11:00'&&p.bitis-p.baslangic===30);
  const once=metin(c);ajandaGunu(c,c.tarih);meseleListesi(c);ilerleOnizle(c);gunuBitirOnizle(c);konusmaListesi(c);testKosullar(c);odaIzleri(c);nakitAcigi(c,'demirkapi');
  denetle('Okuma ve önizleme işlevleri kariyeri değiştirmez',metin(c)===once);
  const a=kariyerOlustur(c);ajandaIsiYap(a,randevu.id);
  const g=a.gecmis.find(x=>x.isId===randevu.id);
  denetle('Katılınca zaman ilerler, iş bir kez yapılır, bilgi öğrenilir',an(a)==='2026-11-23 11:30'&&g.sonuc.durum==='yapildi'&&g.sonuc.bilgi==='Anahtarlar teslim alındı.'&&reddeder(()=>ajandaIsiYap(a,randevu.id)));
  const b=kariyerOlustur(c);gunuBitir(b);
  denetle('Gün bitince ertelenebilir iş ertesi güne taşınır, isteğe bağlı iş bir kez kaçırılır',an(b)==='2026-11-24 08:00'&&b.isler[randevu.id].tarih==='2026-11-24'&&b.gecmis.filter(x=>x.isId===istege.id&&x.sonuc.durum==='kacirildi').length===1);
  denetle('Son tarihinden sonraya ertelenemez',reddeder(()=>ajandaErtele(b,randevu.id))&&/son gün/i.test(gunuBitirOnizle(b).engel.join()),gunuBitirOnizle(b).engel.join());
  const z=kariyerOlustur(c);isEkle(z,{tur:'ajanda',tarih:'2026-11-23',dakika:1200,veri:{baslik:'Zorunlu deneme',aciklama:'',zorunluluk:'zorunlu',sure:30}});
  denetle('Zorunlu iş varken gün bitmez',gunuBitirOnizle(z).engel.length===1&&reddeder(()=>gunuBitir(z)));
}

bolum('2.2 — koşula bağlı olay, iki cevaplı karar ve telefon (TEST içeriği)');
{
  const c=deneme({randevu:false});
  const r=duragaIlerle(c),m=Object.values(c.meseleler)[0],o=Object.values(c.olaylar)[0],b=kararIsi(c);
  denetle('Gelişme zamanında paket açılır, ilerleme karar haberinde durur',r.neden==='karar'&&an(c)==='2026-11-24 10:30'&&!!m&&m.durum==='kararBekliyor'&&o.durum==='acik'&&o.meseleId===m.id,`${r.neden} · ${an(c)}`);
  const oz=meseleOzeti(c,m.id);
  denetle('Dosyada kanıtlar kaynaklarıyla: defter ve saymanın hazır görüşü',oz.bilgiler.length===2&&oz.bilgiler[0].kaynak==='Deneme defteri'&&oz.bilgiler[1].kaynak==='Ayla Deneme',oz.bilgiler.map(x=>x.kaynak).join(', '));
  const S=kararSecenekleri(c,b);
  denetle('Karar tam iki cevaplı: [Kabul et / Saymana devret]',S.length===2&&S.map(s=>s.id).join()==='kabul,devret',S.map(s=>s.metin).join(' / '));
  /* H2-c: hoca ve personelin konuşmaları (konu önerileri) her zaman listededir; TEST konusu tek konuşmadır */
  const K=konusmaListesi(c).filter(x=>!['teknikDirektor','yardimciAntrenor','maliMudur'].includes(x.kisi.rol));
  denetle('Telefonda soranın konuşması: kişinin sesiyle gelen mesaj ve cevap bekliyor',K.length===1&&K[0].ad==='Berk Deneme'&&K[0].cevapBekliyor&&K[0].kararlar[0]===b.id&&/firmamız/.test(K[0].mesajlar[0].metin)&&K[0].okunmamis===1);
  meseleGoruldu(c,m.id);
  denetle('Okumak yalnız "yeni" işaretini kaldırır, karar beklemeye devam eder',konusmaListesi(c)[0].okunmamis===0&&!!c.isler[b.id]);
  const s=deneme({randevu:false,sayman:false});duragaIlerle(s);
  denetle('Sayman yoksa çift değişir: [Kabul et / Reddet]; görüş yazılmaz',kararSecenekleri(s,kararIsi(s)).map(x=>x.id).join()==='kabul,reddet'&&meseleOzeti(s,Object.keys(s.meseleler)[0]).bilgiler.length===1);
  const y=deneme({randevu:false},'yok');const ry=duragaIlerle(y);
  denetle('Koşul tutmazsa gelişme iz bırakmaz: mesele, olay ve ajanda satırı yok',!Object.keys(y.meseleler).length&&!Object.keys(y.olaylar).length&&!ajandaGunu(y,'2026-11-24').some(x=>x.tur==='gelisme')&&ry.durak&&ry.durak.veri.eylem==='macGunu',an(y));
  const t=testOnizleme(c,b.id,'devret'),once=metin(c);
  denetle('Test önizlemesi sonucu kopyada gösterir, kariyeri değiştirmez',!t.hata&&t.satirlar.length>=2&&metin(c)===once,t.satirlar.join(' → '));
}
{
  const c=deneme({randevu:false});duragaIlerle(c);const b=kararIsi(c);
  ajandaIsiYap(c,b.id,'kabul');
  const m=Object.values(c.meseleler)[0],s=Object.values(c.sozler)[0];
  denetle('Kabul: tahsilat yarın sabah, pano sözü açık, mesele haber bekliyor; karar ikinci kez uygulanamaz',m.durum==='haberBekliyor'&&s&&s.durum==='acik'&&odaIzleri(c).panoNotu&&reddeder(()=>ajandaIsiYap(c,b.id,'kabul')));
  const K=konusmaListesi(c)[0];
  denetle('Telefonda seçilen cevap giden mesaj olarak görünür',K.mesajlar.some(x=>x.yon==='giden'&&x.metin==='Kabul et')&&!K.cevapBekliyor);
  {const S=K.mesajlar,i=S.findIndex(x=>x.yon==='giden'),j=S.findIndex(x=>/destek vermek istiyor/.test(x.metin)),n=S.findIndex(x=>/Teklifi kabul ettin/.test(x.metin));
   denetle('Aynı dakikada cevap: telefonda teklifin ardından, doğurduğu sonucun önünde (F6-a: cevabın konudaki yeri)',j>=0&&j<i&&i<n,S.map(x=>x.yon+':'+x.metin.slice(0,18)).join(' | '));}
  const sonra=oyna(kariyerOlustur(c),'kabul');
  denetle('Tahsilat yapılınca söz tutulur, mesele ve olay kapanır; para bir kez girer',Object.values(sonra.sozler)[0].durum==='tutuldu'&&Object.values(sonra.meseleler)[0].durum==='kapandi'&&Object.values(sonra.olaylar)[0].durum==='kapandi'
    &&sonra.hareketler.filter(h=>h.kalem==='destek').length===1&&!odaIzleri(sonra).panoNotu&&gecerli(sonra)[0],gecerli(sonra)[1]);
}
{
  const c=deneme({randevu:false});duragaIlerle(c);ajandaIsiYap(c,kararIsi(c).id,'devret');
  const m=Object.values(c.meseleler)[0];
  denetle('Devir: ekip işi yarın 09:30, mesele ekipte ve yürüten sayman',m.durum==='ekipte'&&m.sorumluId==='kisi-91'&&Object.values(c.isler).some(x=>x.tur==='ekip'&&x.tarih==='2026-11-25'&&x.dakika===570));
  const r=duragaIlerle(c);
  denetle('Saymanın haberi gelince ilerleme durur; gazete haberi masada',r.neden==='karar'&&an(c)==='2026-11-25 09:30'&&odaIzleri(c).gazete&&odaIzleri(c).yeniHaber===1&&al('haberBasligi')(c,odaIzleri(c).gazete)==='Deneme Gazetesi',`${r.neden} · ${an(c)}`);
  const K=konusmaListesi(c).find(x=>x.ad==='Ayla Deneme');
  denetle('Saymanın mesajı kendi konuşmasında',!!K&&K.mesajlar.some(x=>x.yon==='gelen'&&/görüşmeyi bitirdi/.test(x.metin)));
  const z=oyna(kariyerOlustur(c),'devret');
  denetle('Tahsilat öğlen bir kez; mesele kapanır',z.hareketler.filter(h=>h.kalem==='destek').length===1&&Object.values(z.meseleler)[0].durum==='kapandi'&&gecerli(z)[0]);
  const a=deneme({randevu:false});duragaIlerle(a);ajandaIsiYap(a,kararIsi(a).id,'devret');
  a.kulupler.demirkapi.yonetim.sayman=null;a.kisiler['kisi-91'].durum='ayrildi';
  duragaIlerle(a);
  const d=kararIsi(a);
  denetle('Sayman ayrıldıysa iş başkana döner: aynı konuda yeni karar, [Kabul et / Reddet]',!!d&&d.veri.meseleId===Object.keys(a.meseleler)[0]&&Object.values(a.meseleler)[0].durum==='kararBekliyor'&&kararSecenekleri(a,d).map(x=>x.id).join()==='kabul,reddet'&&gecerli(a)[0],gecerli(a)[1]);
}
{
  const c=deneme({randevu:false});duragaIlerle(c);const b=kararIsi(c);
  const o=ilerleOnizle(c);
  denetle('Acil olmayan karar beklerken ilerlenebilir; ilerleme son cevap anında durur',!o.engel.length&&o.neden==='sonCevap'&&o.hedef===isAn(b),`${o.neden}`);
  duragaIlerle(c);
  const o2=ilerleOnizle(c);
  denetle('Son cevap anında: cevapsız kalacak karar önceden bildirilir',o2.cevapsiz.length===1&&o2.cevapsiz[0].id===b.id);
  duragaIlerle(c);
  const g=c.gecmis.find(x=>x.isId===b.id),m=Object.values(c.meseleler)[0];
  denetle('Cevapsız kalınca teklif düşer, mesele kapanır; telefonda "Cevap vermedin."',g&&g.sonuc.durum==='cevapsiz'&&m.durum==='kapandi'&&konusmaListesi(c)[0].mesajlar.some(x=>x.metin==='Cevap vermedin.')&&gecerli(c)[0]);
}
{
  /* bütün karar yolları × sayman var/yok × araya kaydet–yükle */
  for(const sayman of [true,false])for(const secim of ['kabul','devret','reddet','cevapsiz']){
    if(secim==='devret'&&!sayman)continue;
    const ad=`${secim}${sayman?'':' (saymansız)'}`;
    const a=oyna(deneme({sayman}),secim);
    const depo=bellekDeposu(),ara=x=>{const s=kariyerKaydet(depo,'k',x);if(!s.tamam)throw new Error(s.hata);return kariyerYukle(depo,'k').kariyer;};
    const b=oyna(deneme({sayman}),secim,ara);
    const k=kaynaklar(a);
    denetle(`${ad}: maç sınırına varıldı; kasa eksiye düşmedi; her ödeme bir kez; her adımda kaydet–yükle aynı sonucu verdi`,macSinirinda(a)&&metin(a)===metin(b)&&new Set(k).size===k.length
      &&Math.min(...a.hareketler.map(()=>0),a.kulupler.demirkapi.nakit)>=0&&gecerli(a)[0],`${an(a)} · nakit ${paraYazi(a.kulupler.demirkapi.nakit)}`);
  }
}

bolum('2.4 — güvenli komut ve kayıt oturumu');
{
  const c=deneme(),once=metin(c),r0=Object.values(c.isler).find(x=>x.veri.baslik==='Deneme randevusu');
  const yarida=reddeder(()=>kariyerKomut(c,x=>{ajandaIsiYap(x,r0.id);throw new Error('yarıda kesildi');}));
  const tutarsiz=reddeder(()=>kariyerKomut(c,x=>{ajandaIsiYap(x,r0.id);x.kulupler.demirkapi.nakit+=1;}));
  denetle('Yarıda hata veren ya da tutarsız bırakan komut kariyeri hiç değiştirmez',yarida&&tutarsiz&&metin(c)===once);
  const d=bellekDeposu();let dolu=false;
  const depo=Object.assign({},d,{yaz:(ad,m)=>{if(dolu)throw new Error('depolama alanı dolu');d.yaz(ad,m);}});
  const o=kayitOturumu(depo,'oyun-1',c);o.kaydet();
  o.uygula(x=>ajandaIsiYap(x,r0.id));
  denetle('Tamamlanan komut kaydedilir',o.durum.tamam&&an(kariyerYukle(depo,'oyun-1').kariyer)==='2026-11-23 11:30');
  dolu=true;o.uygula(x=>duragaIlerle(x));
  denetle('Kayıt yazılamazsa bildirilir; önceki sağlam kayıt durur',!o.durum.tamam&&o.durum.bekleyen&&/dolu/.test(o.durum.hata)&&an(kariyerYukle(depo,'oyun-1').kariyer)==='2026-11-23 11:30');
  dolu=false;const s=o.kaydet();
  denetle('Yeniden kaydetmek komutu ikinci kez uygulamaz',s.tamam&&metin(kariyerYukle(depo,'oyun-1').kariyer)===metin(o.kariyer));
  const m=kayitOturumu(bellekDeposu(),'m',oyna(deneme(),'kabul'));m.kaydet();const onceki=an(m.kariyer);
  const mac=Object.values(m.kariyer.isler).find(x=>x.veri.eylem==='macGunu');
  m.uygula(x=>ajandaIsiYap(x,mac.id),true);
  denetle('"Stada git" kaydedilmez: bellekte maç sınırı geçilir, kayıt öncekinde kalır',!m.kariyer.isler[mac.id]&&m.durum.bekleyen&&onceki==='2026-11-28 19:00');
}

bolum('2.7 / 2.8B — antrenman gözlemi (TEST içeriği)');
{
  const [antrenmanPenceresi,gozlemOnizle,gozlemBaslat,gozlemSurdur,gozlemBitir,gozlemAcik,gozlemKalan,gozlemAc,gozlemAdim]=
    ['antrenmanPenceresi','gozlemOnizle','gozlemBaslat','gozlemSurdur','gozlemBitir','gozlemAcik','gozlemKalan','gozlemAc','gozlemAdim'].map(al);
  const gk=c=>c.gecmis.filter(g=>g.tur==='gozlem');
  const d=deneme({randevu:false,gelisme:false});
  denetle('Antrenman hafta içi 15:00–17:00; hafta sonu ve maç günü yok',metin(antrenmanPenceresi(d,'2026-11-23'))==='{"bas":900,"bit":1020}'&&antrenmanPenceresi(d,'2026-11-28')===null&&antrenmanPenceresi(d,'2026-11-29')===null);
  denetle('Antrenman başlamadan gözlem başlatılamaz',/başlıyor/.test(gozlemOnizle(d,30).engel[0])&&reddeder(()=>gozlemBaslat(kariyerOlustur(d),30)));
  saate(d,'2026-11-23',900);
  const kisa=kariyerOlustur(d),r15=gozlemBaslat(kisa,15),uzun=kariyerOlustur(d),r30=gozlemBaslat(uzun,30);
  denetle('15 dk not bırakmaz; 30 dk gözlem TEST notu bırakır',r15.not===null&&!gk(kisa)[0].not&&!!r30.not&&gk(uzun)[0].izlenen===30&&gecerli(uzun)[0],r30.not);
  const tek=kariyerOlustur(d);gozlemBaslat(tek,120);
  const parca=kariyerOlustur(d);for(let i=0;i<4;i++)gozlemBaslat(parca,30);
  denetle('Tek parça ve parçalı gözlem aynı; antrenman bitince süre kısalır',metin(tek.kulupler)===metin(parca.kulupler)&&an(tek)==='2026-11-23 17:00'&&gozlemOnizle(saate(kariyerOlustur(d),'2026-11-23',1000),60).sure===20);
  const adimAdim=(bas,dk,kayitAraligi)=>{
    let c=kariyerKomut(bas,x=>gozlemAc(x,dk)).kariyer,r={neden:'devam'},n=0;
    while(r.neden==='devam'&&n<2000){const s=kariyerKomut(c,x=>gozlemAdim(x,1));c=s.kariyer;r=s.sonuc;n++;
      if(kayitAraligi&&n%kayitAraligi===0&&r.neden==='devam'){const depo=bellekDeposu();kariyerKaydet(depo,'g',c);c=kariyerYukle(depo,'g').kariyer;}}
    return{c,r,n};
  };
  const p=adimAdim(d,120,15);
  denetle('1 dakikalık adımlar ve araya kaydet–yükle tek parça gözlemle aynı kariyeri verir',metin(p.c)===metin(tek)&&p.n===120&&p.r.neden==='bitti');
  /* karar gerektiren haber gözlemi keser */
  const h=deneme({randevu:false,gelisme:false});
  isEkle(h,{tur:'gelisme',tarih:'2026-11-23',dakika:930,veri:{gelisme:'denemeTeklif',kulupId:'demirkapi',kisiId:'kisi-92',tutar:40000000}});
  isEkle(h,{tur:'ajanda',tarih:'2026-11-23',dakika:1260,veri:{baslik:'Uzun deneme',aciklama:'',zorunluluk:'istege',sure:60}});
  saate(h,'2026-11-23',900);
  const tb=kariyerOlustur(h),rb=gozlemBaslat(tb,120),pb=adimAdim(h,120,10);
  denetle('Karar gerektiren haberde gözlem durur; kalan süre korunur; parçalı ile aynı',rb.durdu&&rb.neden==='karar'&&an(tb)==='2026-11-23 15:30'&&gozlemKalan(tb)===90&&metin(pb.c)===metin(tb),`${an(tb)} · kalan ${gozlemKalan(tb)}`);
  const uzunIs=Object.values(tb.isler).find(x=>x.veri.baslik==='Uzun deneme');
  denetle('Gözlem sürerken uzun iş tam dikkat ister',/tam dikkat/.test(ajandaOnizle(tb,uzunIs.id).engel.join()));
  ajandaIsiYap(tb,kararIsi(tb).id,'devret');
  denetle('Kısa iş gözlemin içinde geçer; aralık değişmez',an(tb)==='2026-11-23 15:45'&&gozlemAcik(tb)&&tb.gozlem.bitis===1020);
  const s=gozlemSurdur(tb);
  denetle('Devam edince antrenman sonunda biter, süre iki kez sayılmaz',s.neden==='bitti'&&an(tb)==='2026-11-23 17:00'&&gk(tb)[0].izlenen===120&&gecerli(tb)[0]);
  const birak=kariyerOlustur(h);gozlemAc(birak,60);gozlemBitir(birak);
  denetle('Gözlem bırakılınca aralık kapanır',birak.gozlem===null&&gk(birak).length===1&&gecerli(birak)[0]);
}

bolum('2.7b — antrenman programı ve balkon sinyalleri (S-b; js/gozlem.js, js/oyuncu-hafta.js; oyunun yüklediği dosyalar)');
{
  const T=oyunAl,KK=T('kariyerKomut'),biz='demirkapi',AP=T('antrenmanProgrami'),AS=T('antrenmanSinyalleri');
  const k0=T('kariyerBaslat')({tohum:7}),gun=['2026-11-23','2026-11-24','2026-11-25','2026-11-26','2026-11-27','2026-11-28','2026-11-29'];
  const prog=gun.map(t=>AP(k0,biz,t).tur).join(),yuk=AP(k0,biz,'2026-11-24').yuk;
  const tz=t=>{const c=JSON.parse(metin(k0));c.kisiler[c.kulupler[biz].hocaId].hoca.tarz=t;return AP(T('kariyerOlustur')(c),biz,'2026-11-24').yuk;};
  denetle('Program: 23–29 Kasım toparlanma, yoğun, yoğun, yoğun, hafif, maç, dinlenme; Demirkapı (direkt) yoğun gün yükü 1,1; tarz değişince yük değişir; fikstürsüz kopyada hafta içi hafif',
    prog==='toparlanma,yogun,yogun,yogun,hafif,mac,dinlenme'&&Math.abs(yuk-1.1)<1e-9&&Math.abs(tz('dikey')-1.15)<1e-9&&AP(Object.assign({},k0,{fikstur:[]}),biz,'2026-11-24').tur==='hafif',`${prog} · ${yuk}`);
  denetle('Açılışta sinyal yok: hal yok, Nail\'in dönüşü iki hafta sonra (2.7 ve 2.8L\'nin “gözlem içeriksiz not bırakmaz” satırı sürer)',
    gun.slice(0,5).every(t=>AS(k0,t).length===0));
  /* kopya: bir on bir oyuncusu yorgun (kondisyon 60), beş oyuncu daha yorgun, Nail'in dönüşü Perşembe */
  const K=k0.kulupler[biz].kadro,nail=Object.values(k0.oyuncular).find(p=>p.kulupId===biz&&p.ad==='Nail');
  const kur=(n)=>{const c=JSON.parse(metin(k0));K.ilk11.slice(1,1+n).forEach((id,i)=>{c.oyuncular[id].hal={kon:60-i,gun:'2026-11-23',form:0,gel:0,tav:60};});
    if(nail)c.oyuncular[nail.id].sakat=Object.assign({},c.oyuncular[nail.id].sakat,{donus:'2026-11-26'});return T('kariyerOlustur')(c);};
  const k1=kur(1),s24=AS(k1,'2026-11-24'),s26=AS(k1,'2026-11-26'),y=K.ilk11[1];
  denetle('Kondisyonu 60 yapılan oyuncu Salı “yorgun”; dönüşü üç gün içinde olan sakat Salı “ayrı”, dönüş günü “takımla”; dakikalar 15:05–16:55 arasında',
    s24.some(s=>s.oyuncuId===y&&s.tur==='yorgun')&&!!nail&&s24.some(s=>s.oyuncuId===nail.id&&s.tur==='donus'&&s.alt==='ayri')&&s26.some(s=>s.oyuncuId===nail.id&&s.tur==='donus'&&!s.alt)
    &&s24.concat(s26).every(s=>s.dk>=905&&s.dk<1015),metin(s24));
  const k6=kur(6),s6=AS(k6,'2026-11-24');
  denetle('Günde en çok üç sinyal, öncelik sırasıyla (dönüş, sonra en yorgunlar); oyuncu başına bir',s6.length===3&&s6.some(s=>s.tur==='donus')&&new Set(s6.map(s=>s.oyuncuId)).size===3
    &&s6.filter(s=>s.tur==='yorgun').every(s=>K.ilk11.slice(5,7).includes(s.oyuncuId)),metin(s6.map(s=>s.tur+':'+s.oyuncuId)));
  const salı=c=>KK(c,x=>{T('zamanIlerlet')(x,T('anDakika')('2026-11-24',900)-T('simdikiAn')(x));}).kariyer;
  const tek=KK(salı(k1),x=>T('gozlemBaslat')(x,120)).kariyer,g1=tek.gecmis.filter(g=>g.tur==='gozlem').pop();
  denetle('Tam gözlem günün sinyallerini geçmişteki gözlem kaydına yazar (metin yok); ertesi gün aynı oyuncu ve tür 7 gün tekrar etmez',
    !!g1&&metin(g1.sinyaller)===metin(s24)&&!/TEST:/.test(metin(tek))&&!AS(tek,'2026-11-25').some(s=>s.oyuncuId===y&&s.tur==='yorgun'),metin(g1&&g1.sinyaller));
  let dort=salı(k1);for(let i=0;i<4;i++)dort=KK(dort,x=>T('gozlemBaslat')(x,30)).kariyer;
  const bir=(()=>{let c=KK(salı(k1),x=>T('gozlemAc')(x,120)).kariyer,r={neden:'devam'},n=0;
    while(r.neden==='devam'&&n<200){const s=KK(c,x=>T('gozlemAdim')(x,1));c=s.kariyer;r=s.sonuc;n++;
      if(n%17===0&&r.neden==='devam'){const d=T('bellekDeposu')();T('kariyerKaydet')(d,'g',c);c=T('kariyerYukle')(d,'g').kariyer;}}return c;})();
  const birlesim=c=>metin(c.gecmis.filter(g=>g.tur==='gozlem').flatMap(g=>g.sinyaller||[]).sort((a,b)=>a.dk-b.dk));
  denetle('Parçalama: tek parça ≡ 4 × 30 dk (sinyallerin birleşimi aynı) ≡ 1 dakikalık adımlar ve araya kaydet–yükle (bütün kariyer aynı)',
    birlesim(dort)===birlesim(tek)&&metin(bir)===metin(tek));
  const ilk=s24[0],k15=KK(KK(k1,x=>{T('zamanIlerlet')(x,T('anDakika')('2026-11-24',ilk.dk-5)-T('simdikiAn')(x));}).kariyer,x=>T('gozlemBaslat')(x,15)).kariyer;
  const g15=k15.gecmis.filter(g=>g.tur==='gozlem').pop(),pen=g15?(g15.sinyaller||[]):[];
  const sat=(()=>{let c=KK(salı(k1),x=>T('gozlemAc')(x,120)).kariyer;const x=JSON.parse(metin(c));x.oyuncular[y].kulupId='akdeniz';
    const kk=T('kariyerOlustur')(x);T('gozlemBitir')(kk);return kk.gecmis.filter(g=>g.tur==='gozlem').pop();})();
  denetle('Kenar durumlar: 15 dakikalık gözlem yalnız kendi aralığındaki sinyali yazar; başka kulübe geçen oyuncunun sinyali kayda düşmez',
    pen.length>=1&&pen.every(s=>s.dk>=ilk.dk-5&&s.dk<ilk.dk+10)&&!(sat.sinyaller||[]).some(s=>s.oyuncuId===y),metin(pen));
  const once=salı(k1);
  denetle('Yan etki yok: sinyal iş, mesele, söz ya da haber açmaz; kayıtlı rastlantı aynı; antrenmanda sakatlık yok',
    Object.keys(tek.isler).length===Object.keys(once.isler).length&&metin(tek.meseleler)===metin(once.meseleler)&&metin(tek.sozler)===metin(once.sozler)
    &&tek.haberler.length===once.haberler.length&&metin(tek.rastlanti)===metin(once.rastlanti)&&metin(tek.oyuncular)===metin(once.oyuncular));
  /* izleyen ve izlemeyen kariyer: maç anında oyuncular, maçlar ve girdi aynı */
  const haftaSonuna=(c,izle)=>{for(const t of gun.slice(0,5)){
      c=KK(c,x=>{T('zamanIlerlet')(x,Math.max(0,T('anDakika')(t,900)-T('simdikiAn')(x)));}).kariyer;
      if(izle)c=KK(c,x=>T('gozlemBaslat')(x,120)).kariyer;}
    return KK(c,x=>{T('zamanIlerlet')(x,T('anDakika')('2026-11-28',1140)-T('simdikiAn')(x));}).kariyer;};
  const A=haftaSonuna(k1,true),B=haftaSonuna(k1,false),mid=Object.values(A.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
  denetle('İzlemeyen kaybetmez: her gün izleyen ve hiç izlemeyen kariyerde maç anında oyuncular, maçlar ve maç girdisi birebir aynı',
    !!mid&&metin(A.oyuncular)===metin(B.oyuncular)&&metin(A.maclar)===metin(B.maclar)&&metin(T('macGirdisi')(A,mid.veri.macId))===metin(T('macGirdisi')(B,mid.veri.macId)));
  const bz=JSON.parse(metin(tek)),gi=bz.gecmis.findIndex(g=>g.tur==='gozlem'&&g.sinyaller);bz.gecmis[gi].sinyaller[0].tur='yok';
  const ac=KK(salı(k0),x=>T('gozlemAc')(x,60)).kariyer;
  denetle('Kayıt: bozuk sinyal listesi doğrulamada yakalanır; sinyalsiz (eski) açık gözlem sinyalsiz kapanır',
    T('kariyerDogrula')(T('kariyerOlustur')(bz)).some(e=>/sinyal/.test(e))&&!T('kariyerDogrula')(tek).length&&ac.gozlem.sinyaller===undefined
    &&!KK(ac,x=>{T('gozlemBitir')(x);}).kariyer.gecmis.filter(g=>g.tur==='gozlem').pop().sinyaller);
}

bolum('Bozuk kopyalar doğrulamada yakalanır');
{
  const c=deneme({randevu:false});duragaIlerle(c);ajandaIsiYap(c,kararIsi(c).id,'kabul');
  const bozuk=(ad,f,beklenen)=>{const x=kariyerOlustur(c);f(x);const h=kariyerDogrula(x);denetle(ad,h.some(e=>beklenen.test(e)),h.slice(0,2).join(' · ')||'hata yakalanmadı');};
  bozuk('Bilinmeyen karar türü',x=>{const i=Object.values(x.isler).find(y=>y.tur==='ajanda'&&!y.veri.eylem)||Object.values(x.isler)[0];isEkle(x,{tur:'ajanda',tarih:'2026-11-26',dakika:600,veri:{baslik:'x',aciklama:'',zorunluluk:'istege',sure:0}});x.isler[Object.keys(x.isler).pop()].veri.karar='yok';},/karar türü/);
  bozuk('Bilinmeyen gelişme',x=>{x.isler['is-99']={id:'is-99',tur:'gelisme',tarih:'2026-11-26',dakika:600,veri:{gelisme:'yok'}};x.sonrakiNo.is=100;},/bilinmeyen gelişme/);
  bozuk('Bilinmeyen olay paketi',x=>{Object.values(x.olaylar)[0].paket='yok';},/bilinmeyen paket/);
  bozuk('Açık mesele bağlı işi olmadan',x=>{for(const i of Object.values(x.isler))if(i.veri.meseleId)delete i.veri.meseleId;},/bekleyen adımı yok/);
  bozuk('Sözün muhatabı yok',x=>{Object.values(x.sozler)[0].muhatap='kisi-77';},/muhatap/);
  bozuk('Bilinmeyen haber türü',x=>{x.haberler.push({tur:'radyo',tarih:x.tarih,dakika:x.gunIciDakika,anahtar:'deneme.haber',p:{tutar:1},olayId:null,gorulen:false});},/bilinmeyen tür/);
  bozuk('Kapanmamış eski gözlem aralığı',x=>{x.gozlem={tarih:'2026-11-23',bas:900,bitis:1020};},/Gözlem/);
  bozuk('Koltukta aktif olmayan yönetici',x=>{x.kisiler['kisi-91'].durum='ayrildi';},/aktif değil/);
}

denetle('Örnek kariyer bütün denemelerden sonra da değişmedi',metin(ORNEK)===ornekMetni);
console.log(basarisiz?`\n! ${basarisiz} denetim başarısız`:'\nBütün denetimler geçti.');
process.exit(basarisiz?1:0);
