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
const {OYUN_DOSYALARI}=require('./dosya-gruplari');   /* R1-c (2026-10-29): liste araclar/dosya-gruplari.js'te (hizli.js ve ad-denetimi de okur) */
const DOSYALAR=OYUN_DOSYALARI.concat(['araclar/test-icerik.js','js/kariyer-ornek.js']);
/* F1 (2026-10-23): bağlam sıradan bir genel nesnedir (araclar/motor-yukle.js gibi; vm.constants.DONT_CONTEXTIFY). Eski sarılı bağlam her genel ada
   erişimi bir ara katmandan geçirdiği için kariyer 16 kulüp ve 289 oyuncuya büyüyünce araç 1 sn'den 15 sn'ye çıkmıştı */
const baglam=()=>{if(!(vm.constants&&vm.constants.DONT_CONTEXTIFY))return vm.createContext({console,Math,Date});const c=vm.createContext(vm.constants.DONT_CONTEXTIFY);c.console=console;return c;};
const ctx=baglam();
for(const f of DOSYALAR)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),ctx,{filename:f});
/* RK7 (2026-11-01): öbür maçlar kendi saatinde lig maçı işiyle oynanır (js/lig-takvimi.js). Kural denemesi motorsuz ve hızlıdır: sağlayıcı on birlerle
   0–0 yazar; motorlu yol (havuz, aynı sonuç) 3.12'de ayrıca sınanır */
const SAHTE_LIG='LIG_MAC_SAGLAYICI=(k,p)=>({skor:[0,0],bitti:true,goller:[],kartlar:[],sakatliklar:[],degisiklikler:[],sutlar:[],ist:{},ilk11:p.secenek.kadro.map(K=>K.oyuncular.map(o=>o.id))})';
const sahteLig=c=>{vm.runInContext(SAHTE_LIG,c);return c;};
sahteLig(ctx);
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
const tGiris=L=>L.filter(g=>!/\.transfer(DEF|OS|FV)$/.test(g.id));   /* R4: telefonun transfer konuları (R4 bölümünde denetlenir) */
const yukle=k=>JSON.parse(JSON.stringify(k));        // kaydet/yükle benzetimi (gerçek kayıt 1.4'te)
const an=k=>`${k.tarih} ${saatYazi(k.gunIciDakika)}`;
const anDakikaYazi=n=>{const t=al('anTarih')(n);return `${t.tarih} ${saatYazi(t.dakika)}`;};
const reddeder=f=>{try{f();return false;}catch(e){return true;}};
/* S-a: yapay hafta — İlerle maç gününe, maç günü işi, haftanın sekiz maçı girdilerin gerçek on biriyle 0–0: her takımda 60. dakikada on birin son
   oyuncusu kulübenin ikincisiyle değişir, 70. dakikada onuncu oyuncuya kırmızı (o.degisiklik/o.kart false ile kapanır; o.duzelt(sonuc, macId) kopyayı
   değiştirir). Döner {k, once (sonuçtan hemen önce), Gi, D, biz} */
/* RK7: İlerle bekleyen maç günü işinin anına; yolda maç ertelenir ya da program değişirse yeni işe geçilir. Döner {k, j} (iş yoksa j null) */
function macGununeGit(T,k,n){const KK=T('kariyerKomut'),bul=c=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu')||null;
  let j=bul(k);for(let g=0;g<(n||40)&&j&&!(k.tarih===j.tarih&&k.gunIciDakika===j.dakika);g++){k=KK(k,x=>T('duragaIlerle')(x)).kariyer;j=bul(k);}return{k,j};}
function yapayHafta(T,k,o){
  o=o||{};const KK=T('kariyerKomut');let is;({k,j:is}=macGununeGit(T,k));
  if(!is)throw new Error('yapay hafta: maç günü işi yok');
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
  denetle('Eski sürüm: geçiş yoksa açıklamalı hata, varsa sırayla dönüştürülür',!y2.tamam&&/eski bir sürüm/.test(y2.hata)&&y3.tamam&&y3.gecisler.join()==='7→8,8→9,9→10,10→11,11→12,12→13'&&metin(y3.kariyer.maclar)==='{}',`${y2.hata} · deneme geçişiyle: ${y3.gecisler&&y3.gecisler.join()}`);
}
denetle('Başlangıç verisi hiçbir denemede değişmedi',metin(ORNEK)===ornekMetni);

/* ================= 2.8L boş oyun: içerik yok, iskelet çalışır ================= */
bolum('2.8L — içeriksiz yeni kariyer (oyunun yüklediği dosyalar)');
const oyunCtx=baglam();
for(const f of OYUN_DOSYALARI)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),oyunCtx,{filename:f});
sahteLig(oyunCtx);
const oyunAl=ad=>vm.runInContext(ad,oyunCtx);
{
  const kur=oyunAl('kariyerBaslat'),c=kur({tarif:'kasim',tohum:7}),d=kur({tarif:'kasim',tohum:7}),h=oyunAl('kariyerDogrula')(c);
  const say=ad=>Object.keys(oyunAl(ad)).length;
  const adlar=ad=>Object.keys(oyunAl(ad)).sort().join(',');
  const G=Object.keys(oyunAl('GIRISIMLER'));
  denetle('Oyunda yalnız P12 TEST taslağı (F6-a), G2 iskeleti (transfer teklifi, hocanın isteği, imza, sözleşme yenileme) ve H2-c yazışması (cevap, görüşme önerisi, görüşme; girişimler yalnız yaz.*) tanımlı; konuya özgü ekip görevi (genel tavsiye hariç), gözlem notu ve söz tarafı yok',
    adlar('PAKETLER')==='gelenTeklif,hocaDegerlendirme,hocaTalebi'&&adlar('GELISMELER')==='gelenTeklif,hocaBaskisi,hocaTalebi,ikinciTeklif,onsezon,sablonAdim,sozlesmeBaslangic,transferImza,yazismaCevap'
    &&adlar('KARAR_TURLERI')==='gorusmeOnerisi,hocaAdayi,hocaKarari,onAlacak,onBasin,onBorc,onDevir,onHoca,onKamp,onKombine,onKurul,onLisans,onPersonel,onZemin,sablonKarti,sozlesmeYenile,teklifKarari,transferButcesi,ziyaret,ziyaretGorusme'&&adlar('KATILIM_ETKILERI')==='ekipGorusmesi,hocaAdayGorusmesi,izleme'
    &&G.length===13&&G.includes('yaz.maliMudur.isler')&&G.every(x=>/^yaz\./.test(x))   /* AR3-b: müdüre “İşler nasıl gidiyor?” 13'üncü girişim */&&Object.keys(oyunAl('EKIP_GOREVLERI')).filter(x=>x!=='tavsiye').length===0&&oyunAl('GOZLEM_NOTLARI').length===0&&say('SOZ_TARAFLARI')===1,
    [adlar('PAKETLER'),adlar('GELISMELER'),adlar('KARAR_TURLERI'),adlar('KATILIM_ETKILERI'),G.join(',')].join(' · '));
  denetle('Yeni kariyer geçerli; içerik sürümü 6 (CM2-b), kayıt sürümü 13 (CM2-a)',!h.length&&c.icerik.surum===6&&c.kayitSurumu===13&&c.macOkundu===undefined,h.join('; '));
  const isler=Object.values(c.isler),ajandaIsleri=isler.filter(x=>x.tur==='ajanda');
  const kisiler=Object.values(c.kisiler),hocalar=kisiler.filter(p=>p.rol==='teknikDirektor');
  const ya=kisiler.find(p=>p.rol==='yardimciAntrenor'),mm=kisiler.find(p=>p.rol==='maliMudur');
  denetle('Kişiler başkan, 16 kulübün hocası (F3), TEST yardımcı antrenör ve mali işler müdürü (H2-c, kisi-18 ve kisi-19); koltuklar boş; mesele, olay, söz yok; tek haber müdürün açılış özeti (H2-d)',kisiler.length===19&&!!ya&&!!mm&&ya.id==='kisi-18'&&mm.id==='kisi-19'&&ya.kulupId==='demirkapi'&&mm.kulupId==='demirkapi'&&c.kisiler['kisi-1'].rol==='baskan'&&hocalar.length===16&&hocalar.every(h=>c.kulupler[h.kulupId].hocaId===h.id)&&metin(c.kulupler.demirkapi.yonetim)==='{"sayman":null,"futbol":null,"basin":null}'
    &&!Object.keys(c.meseleler).length&&!Object.keys(c.olaylar).length&&!Object.keys(c.sozler).length
    &&c.haberler.length===1&&c.haberler[0].tur==='rapor'&&c.haberler[0].anahtar==='mali.haftalik'&&c.haberler[0].p.kaynak===mm.id&&c.haberler[0].p.nakit===c.kulupler.demirkapi.nakit);
  const gel=isler.filter(x=>x.tur==='gelisme'),lt=isler.filter(x=>['program','hava','ligMaci'].includes(x.tur));
  /* RK7: ilk üç haftanın öbür maçları (21 lig maçı işi), Aralık haftalarının hava denetimi (14, 15) ve 16. haftanın programı (23 Kasım 10:00) */
  denetle('RK7: lig takvimi — program 15. haftaya dek açıklanmış; 21 lig maçı işi (ilk üç haftanın öbür maçları), 14 ve 15. haftaya hava denetimi (Perşembe 10:00), 16. hafta programı Pazartesi 23 Kasım 10:00',
    c.sezon.programAciklanan===15&&lt.filter(x=>x.tur==='ligMaci').length===21&&metin(lt.filter(x=>x.tur==='hava').map(x=>[x.veri.hafta,x.tarih,x.dakika]))==='[[14,"2026-12-03",600],[15,"2026-12-10",600]]'
    &&metin(lt.filter(x=>x.tur==='program').map(x=>[x.veri.hafta,x.tarih,x.dakika]))==='[[16,"2026-11-23",600]]',lt.map(x=>x.tur).join(','));
  denetle('Takvimde tek ajanda işi: Cumartesi 19:00 maç günü (LIG.buMac ile aynı an); yanında iki transfer hatırlatması, 1 Aralık ay başı (G2), 30 Kasım haftalık mali özet (H2-d) ve kış döneminin dört gizli transfer gelişmesi',ajandaIsleri.length===1&&ajandaIsleri[0].id==='is-1'&&ajandaIsleri[0].veri.eylem==='macGunu'
    &&ajandaIsleri[0].tarih==='2026-11-28'&&saatYazi(ajandaIsleri[0].dakika)===LIG.buMac.saat&&ajandaIsleri[0].veri.baslik==='Maç: Demirkapı SK – Akdeniz FK'
    &&isler.length-lt.length===9&&isler.filter(x=>x.tur==='hatirlatma').length===2&&isler.filter(x=>x.tur==='ayBasi'&&x.tarih==='2026-12-01').length===1
    &&isler.filter(x=>x.tur==='maliRapor'&&x.tarih==='2026-11-30'&&x.dakika===540).length===1
    &&gel.length===4&&gel.every(x=>x.tarih>='2027-01-04'&&x.tarih<='2027-01-31')&&metin(gel.map(x=>x.veri.gelisme).sort())==='["gelenTeklif","gelenTeklif","gelenTeklif","hocaTalebi"]',ajandaIsleri[0]&&ajandaIsleri[0].veri.baslik);
  denetle('Aynı tohum aynı kariyeri kurar',metin(c)===metin(d));
  {const L=oyunAl('konusmaListesi')(c);
   denetle('H2-c/H2-d: Mesajlar listesinde hoca ve yardımcı (Takım ne durumda?, Görüşelim, Oyuncu hakkında sor; maç oynanmadığı için maç sorusu yok) ve mali işler müdürü (Kasa ne durumda?); mesaj yok, okunmamış 0, cevap bekleyen yok',
     L.length===3&&metin(L.map(x=>x.kisi.rol).sort())==='["maliMudur","teknikDirektor","yardimciAntrenor"]'&&L.every(x=>!x.mesajlar.length&&!x.okunmamis&&!x.cevapBekliyor
       &&metin(tGiris(x.girisimler).map(g=>g.ad))===(x.kisi.rol==='maliMudur'?'["Kasa ne durumda?"]':'["Takım ne durumda?","Görüşelim","Oyuncu hakkında sor"]')),
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

console.log(basarisiz?'! '+basarisiz:'tamam');process.exit(basarisiz?1:0);