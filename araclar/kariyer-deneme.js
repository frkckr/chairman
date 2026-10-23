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
const OYUN_DOSYALARI=['js/ortak.js','js/kadrolar.js','js/lig.js','js/kariyer.js','js/takvim.js','js/maliye.js','js/ajanda.js','js/mesele.js','js/yonetim.js','js/olay.js','js/soz.js','js/mesajlar.js','js/gozlem.js',
  'js/adlar-test.js','js/kariyer-kadro.js','js/fikstur.js','js/mac-girdi.js','js/test-gorunum.js','js/kayit.js','js/baslangic.js'];
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
  const eski=Object.assign({},c,{kayitSurumu:6});delete eski.maclar;depo.yaz('eski',zarf(eski));
  const y2=kariyerYukle(depo,'eski');
  KAYIT_GECISLERI[6]=v=>{v.maclar={};v.kayitSurumu=7;return v;};
  const y3=kariyerYukle(depo,'eski');
  delete KAYIT_GECISLERI[6];
  denetle('Eski sürüm: geçiş yoksa açıklamalı hata, varsa sırayla dönüştürülür',!y2.tamam&&/eski bir sürüm/.test(y2.hata)&&y3.tamam&&y3.gecisler.join()==='6→7'&&metin(y3.kariyer.maclar)==='{}',`${y2.hata} · deneme geçişiyle: ${y3.gecisler&&y3.gecisler.join()}`);
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
  denetle('Oyunda paket, gelişme, karar türü, konuya özgü ekip görevi (genel tavsiye hariç), katılım etkisi ve girişim tanımlı değil',
    say('PAKETLER')+say('GELISMELER')+say('KARAR_TURLERI')+Object.keys(oyunAl('EKIP_GOREVLERI')).filter(x=>x!=='tavsiye').length+say('KATILIM_ETKILERI')+say('GIRISIMLER')===0&&oyunAl('GOZLEM_NOTLARI').length===0&&say('SOZ_TARAFLARI')===0);
  denetle('Yeni kariyer geçerli; içerik sürümü 4, kayıt sürümü 7',!h.length&&c.icerik.surum===4&&c.kayitSurumu===7,h.join('; '));
  const isler=Object.values(c.isler),ajandaIsleri=isler.filter(x=>x.tur==='ajanda');
  denetle('Yalnız başkan var; koltuklar boş; mesele, olay, söz ve haber yok',Object.keys(c.kisiler).join()==='kisi-1'&&metin(c.kulupler.demirkapi.yonetim)==='{"sayman":null,"futbol":null,"basin":null}'
    &&!Object.keys(c.meseleler).length&&!Object.keys(c.olaylar).length&&!Object.keys(c.sozler).length&&!c.haberler.length);
  denetle('Takvimde tek ajanda işi: Cumartesi 19:00 maç günü (LIG.buMac ile aynı an); yanında yalnız iki transfer hatırlatması',ajandaIsleri.length===1&&ajandaIsleri[0].id==='is-1'&&ajandaIsleri[0].veri.eylem==='macGunu'
    &&ajandaIsleri[0].tarih==='2026-11-28'&&saatYazi(ajandaIsleri[0].dakika)===LIG.buMac.saat&&ajandaIsleri[0].veri.baslik==='Maç: Demirkapı SK – Akdeniz FK'
    &&isler.length===3&&isler.filter(x=>x.tur==='hatirlatma').length===2,ajandaIsleri[0]&&ajandaIsleri[0].veri.baslik);
  denetle('Aynı tohum aynı kariyeri kurar',metin(c)===metin(d));
  denetle('Telefonda konuşma yok',oyunAl('konusmaListesi')(c).length===0);
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
  denetle('Kadrolar: Demirkapı 11+7 (5 yedek, 2 eksik), Akdeniz 11+8, üretilen 14 kulüp 11+7',boy('demirkapi')==='11+7'&&boy('akdeniz')==='11+8'&&uretilen.length===14&&uretilen.every(id=>boy(id)==='11+7'),
    `${boy('demirkapi')} · ${boy('akdeniz')} · ${boy(uretilen[0])}`);
  const ayni=id=>{const D=c.kulupler[id].kadro,K=KD[id];
    return K.oyuncular.every((o,i)=>{const p=c.oyuncular[D.ilk11[i]];return p.ad===o.ad&&p.no===o.no&&metin(p.oz)===metin(o.oz)&&p.gol===(o.gol||0)&&p.sari===(o.sari||0)&&p.ayak===(o.ayak||'sag')&&p.ten===o.ten&&p.sac===o.sac&&!!p.kaptan===!!o.kaptan;})
      &&K.yedekler.every((o,i)=>{const p=c.oyuncular[D.yedekler[i]];return p.ad===o.ad&&p.no===o.no&&p.mevki===o.mevki&&metin(p.oz)===metin(o.oz);})
      &&D.ad===K.ad&&D.forma===K.forma&&metin(D.taktik)===metin(K.taktik)&&D.td.ad===K.td.ad;};
  denetle('Demirkapı ve Akdeniz kadroları js/kadrolar.js ile aynı (ad, numara, özellik, görünüş, sayaçlar, sıra, taktik, hoca)',ayni('demirkapi')&&ayni('akdeniz'));
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
  /* sonuç yazılınca (F2'nin işi; burada elle) tablo ve son maçlar ilerler */
  const x=kariyerOlustur(c);x.maclar[ilk.id]={skor:[2,1]};oyunAl('isIptal')(x,Object.values(x.isler).find(q=>q.veri.eylem==='macGunu').id,'deneme: maç oynandı');const t2=sezonTablosu(x),dm=t2.find(t=>t.id==='demirkapi'),ak=t2.find(t=>t.id==='akdeniz'),s5=sonBesMac(x,'demirkapi');
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

/* ================= F1-b — maç girdisi ================= */
bolum('3.4 — maç girdisi: kariyerden maç kadrosu ve Match seçeneği (F1-b)');
{
  const c=oyunAl('kariyerBaslat')({tohum:7}),KD=oyunAl('KADROLAR'),LG=oyunAl('LIG');
  const [macGirdisi,macKadrosu,macTohumu,sezonTablosu]=['macGirdisi','macKadrosu','macTohumu','sezonTablosu'].map(oyunAl);
  const id13='mac-2627-13-demirkapi-akdeniz',once=metin(c),G=macGirdisi(c,id13);
  const ayniKadro=(K,S)=>K.oyuncular.length===11&&K.oyuncular.every((o,i)=>o.ad===S.oyuncular[i].ad&&o.no===S.oyuncular[i].no&&metin(o.oz)===metin(S.oyuncular[i].oz)&&!!o.kaptan===!!S.oyuncular[i].kaptan)
    &&K.yedekler.length===S.yedekler.length&&K.yedekler.every((o,i)=>o.ad===S.yedekler[i].ad&&o.no===S.yedekler[i].no&&o.mevki===S.yedekler[i].mevki);
  denetle('13. hafta: tohum maç kimliğinden, biz ev sahibi; iki kadro js/kadrolar.js ile aynı (ilk 11, 5 yedek); kariyer değişmedi',
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
  denetle('Sakat sağ kanadın yerine ilk uygun orta saha yedeği girer; kulübede kalan dört yedek',K1.oyuncular[5].ad==='Hakan'&&K1.yedekler.map(y=>y.ad).join()==='Tamer,Levent,Murat,Sinan'&&K1.eksikler.some(e=>e.ad==='Oğuz'),
    K1.oyuncular.map(o=>o.no).join(','));
  const x2=kopya(x=>{bul(x,'Engin').ceza={mac:1,neden:'deneme'};bul(x,'Cengiz').ceza={mac:1,neden:'deneme'};}),K2=macKadrosu(x2,'demirkapi','2026-11-28');
  denetle('Cezalı kalecinin yerine yedek kaleci; cezalı kaptanın yerine en yaşlı saha oyuncusu kaptan',K2.oyuncular[0].ad==='Tamer'&&K2.oyuncular.filter(o=>o.kaptan).length===1&&!K2.oyuncular.some(o=>o.ad==='Cengiz'),
    'kaptan '+(K2.oyuncular.find(o=>o.kaptan)||{}).ad);
  denetle('Sakatlığı bitmiş oyuncu oynar: Nail 7 Aralık\'ta dönüyor (14. hafta 5 Aralık dışarıda, 15. hafta 12 Aralık kadroda)',macKadrosu(c,'demirkapi','2026-12-05').eksikler.some(e=>e.ad==='Nail')&&!macKadrosu(c,'demirkapi','2026-12-12').eksikler.some(e=>e.ad==='Nail'));
  const x3=kopya(x=>{for(const p of Object.values(x.oyuncular))if(p.kulupId==='karaova'&&p.mevki!=='KL')p.sakat={neden:'deneme',donus:'2027-06-01'};});
  denetle('On bir uygun oyuncu çıkaramayan kulübün maç kadrosu kurulmaz (açık hata)',reddeder(()=>macKadrosu(x3,'karaova','2026-11-28'))&&reddeder(()=>macGirdisi(c,'mac-2627-99-a-b')));
  const f14=c.fikstur.find(f=>f.hafta===14&&(f.ev==='demirkapi'||f.konuk==='demirkapi')),G14=macGirdisi(c,f14.id);
  denetle('14. hafta: biz fikstürdeki tarafımız; üretilen rakip kadro 11 + 5 yedek',G14.biz===(f14.konuk==='demirkapi'?1:0)&&G14.kadro.every(K=>K.oyuncular.length===11&&K.yedekler.length===5)&&G14.kadro[G14.biz].id==='demirkapi',
    `${f14.id} · biz ${G14.biz}`);
  /* motor: kariyerden kurulan 13. hafta maçı, aynı tohumla kariyersiz (MAC_KADRO) maçla birebir aynı (santradan sonra 2400 adım) */
  const {motorYukle}=require('./motor-yukle'),M=motorYukle().ctx,MG=a=>vm.runInContext(a,M),Match=MG('Match'),ONCESI=MG('MAC_ONCESI');
  const Gm=MG('macGirdisi')(MG('kariyerBaslat')({tohum:7}),id13);
  const oyna=kadro=>{const m=new Match(()=>{},{kadro,tohum:Gm.tohum,tunel:{x:0,z:-6},tarz:'dagilim'});for(let n=0;n<3000;n++){if(n===600&&ONCESI.includes(m.phase))m.macaGec();m.step(1/60);}
    return metin({s:m.sonucKaydi(),p:m.players.map(p=>[p.x.toFixed(4),p.z.toFixed(4)]),b:[m.ball.x.toFixed(4),m.ball.z.toFixed(4)]});};
  denetle('Motor: kariyerden kurulan 13. hafta maçı aynı tohumla kariyersiz maçla birebir aynı oynanır',oyna(Gm.kadro)===oyna(MG('MAC_KADRO')));
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
  const K=konusmaListesi(c);
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
  const sonra=oyna(kariyerOlustur(c),'kabul');
  denetle('Tahsilat yapılınca söz tutulur, mesele ve olay kapanır; para bir kez girer',Object.values(sonra.sozler)[0].durum==='tutuldu'&&Object.values(sonra.meseleler)[0].durum==='kapandi'&&Object.values(sonra.olaylar)[0].durum==='kapandi'
    &&sonra.hareketler.filter(h=>h.kalem==='destek').length===1&&!odaIzleri(sonra).panoNotu&&gecerli(sonra)[0],gecerli(sonra)[1]);
}
{
  const c=deneme({randevu:false});duragaIlerle(c);ajandaIsiYap(c,kararIsi(c).id,'devret');
  const m=Object.values(c.meseleler)[0];
  denetle('Devir: ekip işi yarın 09:30, mesele ekipte ve yürüten sayman',m.durum==='ekipte'&&m.sorumluId==='kisi-2'&&Object.values(c.isler).some(x=>x.tur==='ekip'&&x.tarih==='2026-11-25'&&x.dakika===570));
  const r=duragaIlerle(c);
  denetle('Saymanın haberi gelince ilerleme durur; gazete haberi masada',r.neden==='karar'&&an(c)==='2026-11-25 09:30'&&odaIzleri(c).gazete&&odaIzleri(c).yeniHaber===1&&al('haberBasligi')(c,c.haberler[0])==='Deneme Gazetesi',`${r.neden} · ${an(c)}`);
  const K=konusmaListesi(c).find(x=>x.ad==='Ayla Deneme');
  denetle('Saymanın mesajı kendi konuşmasında',!!K&&K.mesajlar.some(x=>x.yon==='gelen'&&/görüşmeyi bitirdi/.test(x.metin)));
  const z=oyna(kariyerOlustur(c),'devret');
  denetle('Tahsilat öğlen bir kez; mesele kapanır',z.hareketler.filter(h=>h.kalem==='destek').length===1&&Object.values(z.meseleler)[0].durum==='kapandi'&&gecerli(z)[0]);
  const a=deneme({randevu:false});duragaIlerle(a);ajandaIsiYap(a,kararIsi(a).id,'devret');
  a.kulupler.demirkapi.yonetim.sayman=null;a.kisiler['kisi-2'].durum='ayrildi';
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
  isEkle(h,{tur:'gelisme',tarih:'2026-11-23',dakika:930,veri:{gelisme:'denemeTeklif',kulupId:'demirkapi',kisiId:'kisi-3',tutar:40000000}});
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
  bozuk('Koltukta aktif olmayan yönetici',x=>{x.kisiler['kisi-2'].durum='ayrildi';},/aktif değil/);
}

denetle('Örnek kariyer bütün denemelerden sonra da değişmedi',metin(ORNEK)===ornekMetni);
console.log(basarisiz?`\n! ${basarisiz} denetim başarısız`:'\nBütün denetimler geçti.');
process.exit(basarisiz?1:0);
