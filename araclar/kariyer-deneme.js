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
   - Bilerek bozulan kopyalar doğrulamada yakalanmalı.
   - Başarısız denetim "!" ile işaretlenir; en az biri başarısızsa çıkış kodu 1'dir. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const KOK=path.join(__dirname,'..');
const DOSYALAR=['js/ortak.js','js/kadrolar.js','js/lig.js','js/kariyer.js','js/takvim.js','js/maliye.js','js/kayit.js','js/kariyer-ornek.js'];
const ctx=vm.createContext({console,Math,Date});
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
  const ileri=Object.assign({},c,{kayitSurumu:2});depo.yaz('ileri',zarf(ileri));
  const y1=kariyerYukle(depo,'ileri');
  denetle('Daha yeni sürümle yapılmış kayıt açılmaz, nedeni söylenir',!y1.tamam&&/daha yeni/.test(y1.hata),y1.hata);
  const eski=Object.assign({},c,{kayitSurumu:0});delete eski.hareketler;depo.yaz('eski',zarf(eski));
  const y2=kariyerYukle(depo,'eski');
  KAYIT_GECISLERI[0]=v=>{v.hareketler=[];v.kayitSurumu=1;return v;};
  const y3=kariyerYukle(depo,'eski');
  delete KAYIT_GECISLERI[0];
  denetle('Eski sürüm: geçiş yoksa açıklamalı hata, varsa sırayla dönüştürülür',!y2.tamam&&y3.tamam&&y3.gecisler.join()==='0→1'&&Array.isArray(y3.kariyer.hareketler),`${y2.hata} · deneme geçişiyle: ${y3.gecisler&&y3.gecisler.join()}`);
}
denetle('Başlangıç verisi hiçbir denemede değişmedi',metin(ORNEK)===ornekMetni);

/* ================= bozuk kopyalar ================= */
bolum('Bozuk kayıtlar yakalanmalı');
const ilerlemis=()=>{const c=yeni();zamanIlerlet(c,4*1440);return c;};   // hatırlatma, maaş ve sponsor işlenmiş
const BOZUKLAR=[
  ['Yinelenen kişi kimliği',yeni,c=>{c.kisiler['kisi-6'].id='kisi-2';}],
  ['Olmayan kulübe bağlı kişi',yeni,c=>{c.kisiler['kisi-3'].kulupId='yok';}],
  ['Olmayan başkan',yeni,c=>{c.baskanId='kisi-99';}],
  ['Geçersiz tarih 2026-02-30',yeni,c=>{c.tarih='2026-02-30';}],
  ['Gün içi dakika 1440',yeni,c=>{c.gunIciDakika=1440;}],
  ['NaN değer',yeni,c=>{c.dunyaTohumu=NaN;}],
  ['Fonksiyon alanı',yeni,c=>{c.kisiler['kisi-2'].hesap=()=>1;}],
  ['Date nesnesi',yeni,c=>{c.tarih=new Date();}],
  ['undefined alan',yeni,c=>{c.final=undefined;}],
  ['Bilinmeyen görev durumu',yeni,c=>{c.gorevDurumu='kral';}],
  ['Bilinmeyen kişi durumu',yeni,c=>{c.kisiler['kisi-7'].durum='kayip';}],
  ['Düşük sonrakiNo.kisi',yeni,c=>{c.sonrakiNo.kisi=5;}],
  ['Doğum tarihi bugünden sonra',yeni,c=>{c.kisiler['kisi-4'].dogumTarihi='2030-01-01';}],
  ['Görevde fakat kulüp başkanı başkası',yeni,c=>{c.kulupler.demirkapi.baskanId='kisi-3';}],
  ['Desteklenmeyen kayıt sürümü',yeni,c=>{c.kayitSurumu=99;}],
  ['Zamanı geçmiş fakat tamamlanmamış iş',yeni,c=>{c.tarih='2026-12-02';}],
  ['Bilinmeyen iş türü',yeni,c=>{c.isler['is-1'].tur='yok';}],
  ['Düşük sonrakiNo.is',yeni,c=>{c.sonrakiNo.is=2;}],
  ['Ödeme işinde kesirli tutar',yeni,c=>{c.isler['is-2'].veri.tutar=-3200.5;}],
  ['Ödeme işinde olmayan kulüp',yeni,c=>{c.isler['is-3'].veri.kulupId='yok';}],
  ['İş hem bekliyor hem tamamlanmış',ilerlemis,c=>{c.isler['is-1']={id:'is-1',tur:'hatirlatma',tarih:'2026-12-10',dakika:600,veri:{metin:'x'}};}],
  ['Aynı iş iki kez tamamlanmış',ilerlemis,c=>{c.gecmis.push(Object.assign({},c.gecmis[0]));}],
  ['Nakit hareketlerle tutmuyor',ilerlemis,c=>{c.kulupler.demirkapi.nakit+=1;}],
  ['Kesirli nakit',yeni,c=>{c.kulupler.demirkapi.nakit=8500000.5;c.kulupler.demirkapi.acilisNakit=8500000.5;}],
  ['Aynı ödeme iki kez işlenmiş',ilerlemis,c=>{const x=Object.assign({},c.hareketler[0],{id:'hareket-9'});c.sonrakiNo.hareket=10;c.hareketler.push(x);c.kulupler.demirkapi.nakit+=x.tutar;}],
  ['Kaynağı bekleyen işe bağlı hareket',yeni,c=>{c.hareketler.push({id:'hareket-1',kulupId:'demirkapi',tarih:c.tarih,dakika:c.gunIciDakika,tutar:-320000000,kalem:'maas',aciklama:'',kaynak:'is-2'});c.sonrakiNo.hareket=2;c.kulupler.demirkapi.nakit-=320000000;}],
  ['Gelecekte işlenmiş hareket',ilerlemis,c=>{c.hareketler[0].tarih='2027-01-01';}]
];
for(const [ad,kur,boz] of BOZUKLAR){
  const c=kur();boz(c);
  const hh=kariyerDogrula(c);
  denetle(`Yakalandı: ${ad}`,hh.length>0,hh[0]||'hata üretmedi');
}

console.log(`\n${basarisiz?`BAŞARISIZ: ${basarisiz} denetim`:'Tüm denetimler geçti'}`);
process.exit(basarisiz?1:0);
