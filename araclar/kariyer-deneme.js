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
   - Ajanda: zorunlu iş varken gün bitmez; kaçırılacak iş önceden bildirilir ve bir kez kaçırılır; erteleme son tarihi aşmaz;
     hafta boyunca oynanınca maç sınırına gelinir, her gün başında kaydet/yükle sonucu değiştirmez.
   - Yönetim: koltuk seçimi bir kez uygulanır; devredilen işin sonucu saymana göre belirlenimli değişir; yetkiyi aşan konu başkana döner.
   - Mesele ve zaman (2.3): tek konu tek mesele, birden çok bağlı iş; ilerleme durma noktalarında durur; saati serbest karar;
     devredilen iş görevlendirilen kişiye bağlıdır. Boş günler ve uzun meseleler ayrı test takvimleriyle sınanır.
   - Gün içi kayıt (2.4): güvenli komut, kayıt oturumu, maç sınırı istisnası, dönüş özeti; araclar/ornekler/ altındaki gerçek
     sürüm 1 kayıtları açılır, dönüştürülür ve oynanmaya devam eder.
   - Değişken başlangıç ve koşula bağlı olay (2.4A): üç başlangıç, açılan/açılmayan/önlenen olay, koşula göre değişen seçenek ve sonuç,
     kayıtlı rastlantı, okuma ve kaydın sonucu değiştirmemesi, bütün karar yolları; sürüm 2 kayıtları eski içerikle tamamlanır.
   - Test görünümü, tavsiye/kapasite/kalıcı sorumluluk/girişim, hoca-basın-destek paketleri, sözler ve haberler (2.6, 2.8): bütün içerikle
     karar yolları; sürüm 3 kayıtları kendi içeriğiyle tamamlanır.
   - Antrenman gözlemi (2.7): aralık, kesilme ve sürdürme, kısa işin gözlemin içinde geçmesi, uzun işin engellenmesi; sürüm 4 kayıtları.
   - Gözlemin gerçek zamanı (2.8B): 1 dakikalık adımlar tek parça gözlemle aynı kariyeri verir; arada kaydet–yükle; haberde durma.
   - Bilerek bozulan kopyalar doğrulamada yakalanmalı.
   - Başarısız denetim "!" ile işaretlenir; en az biri başarısızsa çıkış kodu 1'dir. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const KOK=path.join(__dirname,'..');
const DOSYALAR=['js/ortak.js','js/kadrolar.js','js/lig.js','js/kariyer.js','js/takvim.js','js/maliye.js','js/ajanda.js','js/mesele.js','js/yonetim.js','js/uyum-sponsor.js','js/olay.js','js/paket-odeme.js','js/paket-hoca.js','js/paket-basin.js','js/paket-destek.js','js/uyum-icerik2.js','js/soz.js','js/mesajlar.js','js/gozlem.js','js/test-gorunum.js','js/kayit.js','js/kariyer-ornek.js','js/baslangic.js'];
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
  const eski=Object.assign({},c,{kayitSurumu:0});delete eski.hareketler;depo.yaz('eski',zarf(eski));
  const y2=kariyerYukle(depo,'eski');
  KAYIT_GECISLERI[0]=v=>{v.hareketler=[];v.kayitSurumu=1;return v;};
  const y3=kariyerYukle(depo,'eski');
  delete KAYIT_GECISLERI[0];
  denetle('Eski sürüm: geçiş yoksa açıklamalı hata, varsa sırayla dönüştürülür',!y2.tamam&&y3.tamam&&y3.gecisler.join()==='0→1,1→2,2→3,3→4,4→5'&&Array.isArray(y3.kariyer.hareketler),`${y2.hata} · deneme geçişiyle: ${y3.gecisler&&y3.gecisler.join()}`);
}
denetle('Başlangıç verisi hiçbir denemede değişmedi',metin(ORNEK)===ornekMetni);

/* ================= 2.1 ajanda ================= */
bolum('2.1 — ajanda, zorunlu/ertelenebilir işler ve günü bitirme');
const [ajandaOnizle,ajandaIsiYap,ajandaErtele,gunuBitirOnizle,gunuBitir,ajandaGunu,yaklasanlar,kulupDurumu]=
  ['ajandaOnizle','ajandaIsiYap','ajandaErtele','gunuBitirOnizle','gunuBitir','ajandaGunu','yaklasanlar','kulupDurumu'].map(al);
const BASLANGIC=al('KARIYER_BASLANGIC'),baslangicMetni=metin(BASLANGIC);
const hafta=()=>kariyerOlustur(BASLANGIC);
const durumlar=(c,tarih)=>ajandaGunu(c,tarih).map(r=>`${r.id}:${r.durum}`).join(' ');
{
  const c=hafta();
  denetle('Hafta başlangıcı geçerli',...gecerli(c));
  denetle('Başlangıç Pazartesi 08:00, maç işi LIG.buMac ile aynı an',an(c)==='2026-11-23 08:00'&&c.isler['is-13'].tarih==='2026-11-28'&&saatYazi(c.isler['is-13'].dakika)===LIG.buMac.saat,an(c));
  const o=gunuBitirOnizle(c);
  denetle('Zorunlu iş varken gün bitmez, zaman ilerlemez',o.engel.length===2&&reddeder(()=>gunuBitir(c))&&an(c)==='2026-11-23 08:00',o.engel.join(' · '));
  const p=ajandaOnizle(c,'is-4');
  denetle('Önizleme: başlangıç, bitiş, engel yok',!p.engel.length&&saatYazi(p.baslangic%1440)==='10:00'&&p.bitis-p.baslangic===90&&!p.atlanacak.length);
  const b=ajandaIsiYap(c,'is-4');
  denetle('Zorunlu işe katılınca zaman başlangıç + süre kadar ilerler, iş yapıldı',an(c)==='2026-11-23 11:30'&&b.length===1&&b[0].sonuc.durum==='yapildi'&&!c.isler['is-4'],`${an(c)} · ${b.map(x=>x.isId+':'+x.sonuc.durum).join()}`);
  denetle('Aynı işe ikinci kez katılınamaz',reddeder(()=>ajandaIsiYap(c,'is-4')));
  denetle('Bir zorunlu iş kalınca gün hâlâ bitmez',gunuBitirOnizle(c).engel.length===1);
  ajandaIsiYap(c,'is-14','kisi-8');
  const o2=gunuBitirOnizle(c);
  denetle('Günü bitirmeden önce kaçırılacak isteğe bağlı iş bildirilir',!o2.engel.length&&o2.kacirilacak.map(x=>x.id).join()==='is-5');
  gunuBitir(c);
  const g=c.gecmis.filter(x=>x.isId==='is-5');
  denetle('İsteğe bağlı iş bir kez kaçırıldı, gün 24 Kasım 08:00',g.length===1&&g[0].sonuc.durum==='kacirildi'&&an(c)==='2026-11-24 08:00',an(c));
  const satir=ajandaGunu(c,'2026-11-23');
  denetle('Geçmiş günün ajandası: yapılan ve kaçırılan, öğrenilen bilgi duruyor',durumlar(c,'2026-11-23')==='is-4:yapildi is-14:yapildi is-5:kacirildi'&&!!satir[0].bilgi&&!satir[2].bilgi,durumlar(c,'2026-11-23'));
  denetle('Günü bitirdikten sonra kariyer geçerli',...gecerli(c));
}
{
  const c=hafta();
  isEkle(c,{tur:'ajanda',tarih:'2026-11-23',dakika:630,veri:{baslik:'Çakışan zorunlu',aciklama:'',zorunluluk:'zorunlu',sure:30}});
  const p=ajandaOnizle(c,'is-4');
  denetle('Araya giren zorunlu iş katılımı engeller',p.engel.length===1&&reddeder(()=>ajandaIsiYap(c,'is-4'))&&an(c)==='2026-11-23 08:00',p.engel[0]);
  const d=hafta();
  const ard=isEkle(d,{tur:'ajanda',tarih:'2026-11-23',dakika:690,veri:{baslik:'Hemen ardından',aciklama:'',zorunluluk:'istege',sure:30}});
  const ogle=isEkle(d,{tur:'ajanda',tarih:'2026-11-23',dakika:720,veri:{baslik:'Öğle',aciklama:'',zorunluluk:'istege',sure:30}});
  ajandaIsiYap(d,'is-4');
  denetle('Biten işin bitiş dakikasında başlayan işe hâlâ katılınabilir',!!d.isler[ard]&&!ajandaOnizle(d,ard).engel.length);
  const p5=ajandaOnizle(d,'is-14');
  denetle('Atlanacak işler önceden bildirilir',p5.atlanacak.map(x=>x.id).join()===`${ard},${ogle}`&&!p5.engel.length,p5.atlanacak.map(x=>x.veri.baslik).join(', '));
  ajandaIsiYap(d,'is-14','kisi-8');
  denetle('Atlanan işler bir kez kaçırılır',[ard,ogle].every(id=>d.gecmis.filter(x=>x.isId===id&&x.sonuc.durum==='kacirildi').length===1)&&an(d)==='2026-11-23 14:30',an(d));
  const gece=isEkle(d,{tur:'ajanda',tarih:'2026-11-23',dakika:1320,veri:{baslik:'Gece',aciklama:'',zorunluluk:'istege',sure:180}});
  denetle('Gün içinde bitmeyen işe ve başka günün işine katılınamaz',ajandaOnizle(d,gece).engel.length===1&&ajandaOnizle(d,'is-6').engel.length===1,`${ajandaOnizle(d,gece).engel[0]} · ${ajandaOnizle(d,'is-6').engel[0]}`);
  denetle('Kaçırılan ve yapılan işlerden sonra kariyer geçerli',...gecerli(d));
}
{
  const c=hafta();
  ajandaIsiYap(c,'is-4');ajandaIsiYap(c,'is-14','kisi-8');gunuBitir(c);  // Salı
  denetle('Zorunlu olmayan iş ertelenemez',reddeder(()=>ajandaErtele(hafta(),'is-5'))&&reddeder(()=>ajandaErtele(hafta(),'is-4')));
  const yeni=ajandaErtele(c,'is-6');
  denetle('Erteleme kimliği korur, ertesi güne taşır',yeni==='2026-11-25'&&c.isler['is-6'].tarih==='2026-11-25'&&durumlar(c,'2026-11-24')==='is-6:ertelendi is-7:bekliyor',durumlar(c,'2026-11-24'));
  gunuBitir(c);                                                          // Çarşamba
  const o=gunuBitirOnizle(c);
  denetle('Günü bitirirken ertelenebilir işler ertesi güne taşınacak diye bildirilir',o.tasinacak.map(x=>x.id).join()==='is-6,is-8'&&!o.engel.length);
  gunuBitir(c);                                                          // Perşembe
  denetle('Otomatik erteleme geçmişe işaretli yazılır',c.gecmis.filter(x=>x.tur==='erteleme'&&x.otomatik).length===2&&c.isler['is-6'].tarih==='2026-11-26');
  const o2=gunuBitirOnizle(c);
  denetle('Son günü gelen ertelenebilir iş günü bitirmez, son tarihten sonraya ertelenemez',o2.engel.length===2&&/zemin/.test(o2.engel[1])&&reddeder(()=>ajandaErtele(c,'is-6')),o2.engel.join(' · '));
  const p=ajandaOnizle(c,'is-10');
  denetle('Zorunlu işle çakışan ertelenmiş iş önceden bildirilir',p.atlanacak.map(x=>x.id).join()==='is-6'&&!p.engel.length,`${p.atlanacak.map(x=>x.veri.baslik).join()} kaçırılacak`);
  ajandaIsiYap(c,'is-10','kendin');
  denetle('Kaçırılan son günlü iş artık günü bitirmeyi engellemez',!gunuBitirOnizle(c).engel.length&&c.gecmis.some(x=>x.tur==='is'&&x.isId==='is-6'&&x.sonuc.durum==='kacirildi'));
  denetle('Ertelemelerden sonra kariyer geçerli',...gecerli(c));
}
/* maç işine kadar oyna: sıradaki zorunlu ya da son günü gelen iş (engelsizse) yapılır, yoksa gün bitirilir.
   araIslem her komuttan sonra çağrılır (kaydet/yükle girebilir). Karar işlerinde secimler[işId] ya da secimler[karar türü],
   yoksa ilk engelsiz seçenek seçilir. macsiz: maç işine katılmadan, maç günü başka iş kalmayınca durur */
function oyna(c,{araIslem,secimler,macsiz}={}){
  for(let n=0;n<200&&c.isler['is-13'];n++){
    const r=ajandaGunu(c,c.tarih).find(r=>c.isler[r.id]&&r.tur==='ajanda'&&(r.zorunluluk==='zorunlu'||r.sonTarih===c.tarih)
      &&!(macsiz&&r.eylem==='macGunu')&&!ajandaOnizle(c,r.id).engel.length);
    if(r){
      const istenen=secimler&&(secimler[r.id]||secimler[r.karar]);
      const s=ajandaOnizle(c,r.id).secenekler.find(x=>!x.engel&&(!istenen||x.id===istenen));
      ajandaIsiYap(c,r.id,s?s.id:undefined);
    }else if(macsiz&&c.isler['is-13'].tarih===c.tarih)break;
    else gunuBitir(c);
    if(araIslem)c=araIslem(c);
  }
  return c;
}
const haftayiOyna=(araIslem,secimler)=>oyna(hafta(),{araIslem,secimler});
{
  const c=haftayiOyna();
  const m=maliDurum(c,'demirkapi');
  denetle('Hafta oynanır, maç sınırına Cumartesi 19:00\'da gelinir',an(c)==='2026-11-28 19:00'&&c.gecmis.some(x=>x.isId==='is-13'&&x.sonuc.durum==='yapildi'&&x.sonuc.eylem==='macGunu'),an(c));
  denetle('Hafta içindeki ödemeler birer kez işlenir',m.nakit===850000000-4500000+12000000&&c.hareketler.length===2,`nakit ${paraYazi(m.nakit)} · ${c.hareketler.length} hareket`);
  denetle('Maçtan sonraki ödemeler bekliyor',m.bekleyenGider===-320000000&&m.bekleyenGelir===150000000);
  denetle('Hafta sonunda kariyer geçerli',...gecerli(c));
  const depo=bellekDeposu();
  const d=haftayiOyna(x=>{const s=kariyerKaydet(depo,'oyun-1',x);if(!s.tamam)throw new Error(s.hata);return kariyerYukle(depo,'oyun-1').kariyer;});
  denetle('Her komuttan sonra kaydet/yükle yapmak sonucu değiştirmez',metin(c)===metin(d));
  const kd=kulupDurumu(c,'demirkapi');
  denetle('Kulüp durumu: başkan, hoca, yönetim koltukları ve para',kd.baskan.ad==='Haluk Demirel'&&kd.hoca.ad==='Şükrü Hoca'&&kd.yonetim.sayman.ad==='Hikmet Aydın'&&kd.yonetim.futbol.ad==='Necati Uysal'&&kd.mali.nakit===m.nakit,
    `${kd.hoca.ad} · ${Object.entries(kd.yonetim).map(([x,p])=>x+': '+(p?p.ad:'boş')).join(', ')} · ${paraYazi(kd.mali.nakit)}`);
  const y=yaklasanlar(hafta(),7).map(x=>x.id);
  denetle('Yaklaşan işler: bugünden sonraki 7 gün',y[0]==='is-6'&&y.includes('is-13')&&!y.includes('is-4')&&!y.includes('is-3'),y.join(', '));
}

/* ================= 2.2 yönetim ekibi ================= */
bolum('2.2 — yönetim ekibi: koltuk seçimi ve yetki sınırlı iş');
const YK=al('YONETIM_KOLTUKLARI'),bekleyenOdemeler=al('bekleyenOdemeler');
const odemeler=c=>bekleyenOdemeler(c,'demirkapi').map(x=>`${x.tarih}:${x.veri.tutar}`).join(' ');
denetle('Üç koltuk tanımlı: sayman, futbol şube sorumlusu, basın sözcüsü',Object.keys(YK).join()==='sayman,futbol,basin',Object.values(YK).map(x=>x.ad).join(', '));
{
  const c=hafta(),y=c.kulupler.demirkapi.yonetim;
  denetle('Başlangıçta sayman koltuğu boş, diğer ikisi dolu',y.sayman===null&&y.futbol==='kisi-3'&&y.basin==='kisi-4');
  const o=ajandaOnizle(c,'is-14');
  denetle('Aday seçimi: üç seçenek, profil metinleri, seçim yapılmadan katılınamaz',o.secenekler.length===3&&o.secenekler.every(s=>s.aciklama.length===4&&!s.engel)&&o.secimGerekli&&reddeder(()=>ajandaIsiYap(c,'is-14')),
    o.secenekler.map(s=>s.metin).join(', '));
  denetle('Gizli katkı seviyeleri seçenek metinlerinde yok',!/guclu|zayif|orta'|katki/.test(JSON.stringify(o.secenekler)));
  denetle('Sayman yokken sponsor işi saymana devredilemez',/boş/.test(ajandaOnizle(c,'is-10').secenekler.find(s=>s.id==='devret').engel||''));
  ajandaIsiYap(c,'is-4');
  const b=ajandaIsiYap(c,'is-14','kisi-9');
  const kayit=b.find(x=>x.isId==='is-14');
  denetle('Seçilen aday sayman oldu; sonuç ve bilgi geçmişte',y.sayman==='kisi-9'&&c.kisiler['kisi-9'].rol==='yonetici'&&kayit.sonuc.secim==='kisi-9'&&/Tuncay Erbil/.test(kayit.sonuc.bilgi),kayit.sonuc.bilgi);
  denetle('Karar ikinci kez uygulanamaz, seçilmeyen adaylar aday kalır',reddeder(()=>ajandaIsiYap(c,'is-14','kisi-8'))&&y.sayman==='kisi-9'&&c.kisiler['kisi-8'].rol==='yoneticiAdayi');
  denetle('Seçimden sonra kariyer geçerli',...gecerli(c));
}
/* Perşembe sabahına kadar oyna: seçilen sayman ile */
function persembe(sayman){
  const c=hafta();
  ajandaIsiYap(c,'is-4');ajandaIsiYap(c,'is-14',sayman);
  for(let i=0;i<3;i++)gunuBitir(c);
  return c;
}
const [ilerleOnizle,duragaIlerle,meseleOzeti,meseleListesi,meseleGoruldu,donusOzeti,kariyerKomut,kayitOturumu,isTasi,isIptal]=
  ['ilerleOnizle','duragaIlerle','meseleOzeti','meseleListesi','meseleGoruldu','donusOzeti','kariyerKomut','kayitOturumu','isTasi','isIptal'].map(al);
const M1='mesele-1';
const bagli=c=>Object.values(c.isler).filter(x=>x.veri.meseleId===M1).map(x=>x.id+':'+x.tur).join(' ');
const donenKarar=(c,tur)=>Object.values(c.isler).filter(x=>x.tur==='ajanda'&&x.veri.saatsiz&&x.veri.karar===(tur||'sponsorIndirimi'));
const sponsorToplami=c=>c.hareketler.filter(x=>x.kalem==='sponsor').reduce((t,x)=>t+x.tutar,0);
/* devirden sonra saymanın haberini bekle: zemin turu yapılır, röportajın başlangıcında durulur, sonra ilerlenir.
   Son ilerlemenin sonucunu döndürür (rutin sonuçta Cuma 14:00 röportajda, karar gerekiyorsa Cuma 09:30'da durur) */
function haberiBekle(c){ajandaIsiYap(c,'is-6');duragaIlerle(c);return duragaIlerle(c);}
{
  const kendin=persembe('kisi-9');ajandaIsiYap(kendin,'is-10','kendin');
  const s3=kendin.isler['is-3'];
  denetle('Başkan kendisi görüşürse 90 dakika sürer, ödeme planı değişmez',an(kendin)==='2026-11-26 11:30'&&s3.tarih==='2026-12-01'&&s3.veri.tutar===150000000&&!kendin.gecmis.some(g=>g.tur==='iptal'),odemeler(kendin));
  const h=persembe('kisi-8');const hb=ajandaIsiYap(h,'is-10','devret');
  denetle('Devir 15 dakika sürer; sonuç anında gelmez, ödeme planı henüz değişmez',an(h)==='2026-11-26 10:15'&&h.isler['is-3'].veri.tutar===150000000&&!h.gecmis.some(g=>g.tur==='iptal')
    &&Object.values(h.isler).some(x=>x.tur==='ekip'&&x.tarih==='2026-11-27'&&saatYazi(x.dakika)==='09:30'),hb.find(x=>x.isId==='is-10').sonuc.bilgi);
  const hr=haberiBekle(h);
  denetle('Mali deneyimli sayman (yetkisi içinde) iki taksit kurar; rutin sonuç ilerlemeyi durdurmaz',hr.neden==='randevu'&&an(h)==='2026-11-27 14:00'&&!h.isler['is-3']&&h.gecmis.some(g=>g.tur==='iptal'&&g.isId==='is-3')&&/2026-12-01:75000000 2026-12-15:75000000/.test(odemeler(h)),`${an(h)} · ${odemeler(h)}`);
  const d=persembe('kisi-10');ajandaIsiYap(d,'is-10','devret');const dr=haberiBekle(d);
  denetle('Bağlantısı zayıf sayman: ödeme kayar, gecikme bedeli eklenir; rutin sonuç durdurmaz',dr.neden==='randevu'&&d.isler['is-3'].tarih==='2026-12-15'&&/2026-12-15:150000000 2026-12-15:3000000/.test(odemeler(d)),odemeler(d));
  const t=persembe('kisi-9');ajandaIsiYap(t,'is-10','devret');const tr=haberiBekle(t);
  const donen=donenKarar(t);
  denetle('Bağlantısı güçlü sayman: indirim talebi yetkisini aşar, ilerleme haber anında durur, karar başkana döner',tr.neden==='karar'&&an(t)==='2026-11-27 09:30'&&t.isler['is-3'].veri.tutar===150000000
    &&donen.length===1&&donen[0].tarih==='2026-11-27'&&donen[0].dakika===1439&&donen[0].veri.zorunluluk==='zorunlu',`${an(t)} · ${tr.biten[tr.biten.length-1].sonuc.bilgi}`);
  denetle('Her sayman farklı sonuç verir',new Set([odemeler(h),odemeler(d),odemeler(t)]).size===3);
  const t2=persembe('kisi-9');ajandaIsiYap(t2,'is-10','devret');haberiBekle(t2);
  denetle('Aynı seçimler aynı sonucu verir (olasılık yok)',metin(t)===metin(t2));
  denetle('Dönen karar verilmeden Cuma bitmez',gunuBitirOnizle(t).engel.some(e=>/indirim/.test(e)),gunuBitirOnizle(t).engel.join(' · '));
  const depo=bellekDeposu();kariyerKaydet(depo,'k',t);const t3=kariyerYukle(depo,'k').kariyer;
  const kabul=kariyerOlustur(t3);ajandaIsiYap(kabul,donen[0].id,'kabul');
  denetle('İndirimi kabul: ödeme %10 düşük, aynı gün; karar geldiği anda verilebildi',/2026-12-01:135000000/.test(odemeler(kabul))&&!kabul.isler['is-3']&&an(kabul)==='2026-11-27 09:45',`${an(kabul)} · ${odemeler(kabul)}`);
  const ret=kariyerOlustur(t3);ajandaIsiYap(ret,donen[0].id,'ret');
  denetle('İndirimi ret: tam ödeme iki hafta geç',ret.isler['is-3'].tarih==='2026-12-15'&&ret.isler['is-3'].veri.tutar===150000000,odemeler(ret));
  denetle('Kayıttan yüklenen kariyerde karar tekrarlanmaz',t3.gecmis.filter(g=>g.isId==='is-10').length===1&&t3.gecmis.filter(g=>g.isTuru==='ekip').length===1&&donenKarar(t3).length===1);
  denetle('Yönetim kararlarından sonra kariyer geçerli',gecerli(h)[0]&&gecerli(d)[0]&&gecerli(kabul)[0]&&gecerli(ret)[0],[h,d,kabul,ret].map(x=>gecerli(x)[1]).filter(Boolean).join(' | '));
  const w=haftayiOyna(null,{'is-14':'kisi-9','is-10':'devret',sponsorIndirimi:'kabul'});
  denetle('Hafta yetki devri ve dönen kararla oynanır, maç sınırına gelinir',an(w)==='2026-11-28 19:00'&&gecerli(w)[0]&&/135000000/.test(odemeler(w)),odemeler(w));
}
denetle('Hafta başlangıç verisi değişmedi',metin(BASLANGIC)===baslangicMetni&&metin(ORNEK)===ornekMetni);

/* ================= 2.3 mesele ve zaman ================= */
bolum('2.3 — mesele: tek konu, bağlı işler, kimin yürüttüğü');
/* maçı da oynayıp takvimi gun kadar ilerletir (ödemeler işlensin) */
const macSonrasi=(c,gun)=>{c=oyna(c);zamanIlerlet(c,gun*1440);return c;};
{
  const c=hafta(),o=meseleOzeti(c,M1);
  denetle('Başlangıçta tek mesele: karar başkanda, iki bağlı iş (karar ve ödeme)',meseleListesi(c).length===1&&o.durum==='kararBekliyor'&&o.sorumlu.ad==='Haluk Demirel'&&bagli(c)==='is-3:odeme is-10:ajanda'
    &&o.karar.isId==='is-10'&&o.karar.simdi===false,`${o.mesele.baslik} · ${o.durumAdi} · ${o.adimlar.map(a=>a.metin).join(' | ')}`);
  denetle('Mesele geçmişi anahtar + parametre olarak saklanır, metin gösterimde üretilir',c.meseleler[M1].olaylar[0].anahtar==='sponsor.acildi'&&!('metin' in c.meseleler[M1].olaylar[0])&&/Sevim Kara/.test(o.olaylar[0].metin),o.olaylar[0].metin);
  const once=metin(c);
  meseleOzeti(c,M1);meseleListesi(c);donusOzeti(c);ilerleOnizle(c);ajandaOnizle(c,'is-4');gunuBitirOnizle(c);
  denetle('Özet ve önizleme işlevleri kariyeri değiştirmez',metin(c)===once);
  meseleGoruldu(c,M1);
  denetle('Meseleyi okumak yalnız "yeni" işaretini kaldırır; zaman ve işler aynı',meseleOzeti(c,M1).yeni===0&&o.yeni===1&&an(c)==='2026-11-23 08:00'&&bagli(c)==='is-3:odeme is-10:ajanda'&&gecerli(c)[0]);
}
{
  const c=persembe('kisi-8');ajandaIsiYap(c,'is-10','devret');
  const o=meseleOzeti(c,M1);
  denetle('Devirden sonra aynı mesele ekipte: yürüten sayman, beklenen haber belli',Object.keys(c.meseleler).length===1&&o.durum==='ekipte'&&o.sorumlu.ad==='Hikmet Aydın'&&o.karar===null&&/Hikmet Aydın/.test(o.adimlar[0].metin)&&o.adimlar[0].tarih==='2026-11-27',
    `${o.durumAdi} · ${o.sorumlu.ad} · ${o.adimlar.map(a=>a.metin).join(' | ')}`);
  haberiBekle(c);
  const o2=meseleOzeti(c,M1);
  denetle('Ödeme iptal edilip iki taksit kurulunca mesele kapanmaz: iki bağlı ödeme, haber bekleniyor',Object.keys(c.meseleler).length===1&&o2.durum==='haberBekliyor'&&o2.adimlar.length===2&&o2.adimlar.every(a=>a.tur==='odeme')&&o2.sorumlu.ad==='Hikmet Aydın',bagli(c));
  let s=macSonrasi(c,4);                                                  // 2 Aralık: ilk taksit geldi
  denetle('İlk taksit gelince mesele kapanmaz',s.meseleler[M1].durum==='haberBekliyor'&&sponsorToplami(s)===75000000&&meseleOzeti(s,M1).adimlar.length===1,`${an(s)} · ${meseleOzeti(s,M1).olaylar.slice(-1)[0].metin}`);
  zamanIlerlet(s,14*1440);
  denetle('Son taksit de gelince mesele kapanır; ödemeler birer kez işlendi',s.meseleler[M1].durum==='kapandi'&&!!s.meseleler[M1].kapanis&&sponsorToplami(s)===150000000&&s.hareketler.filter(x=>x.kalem==='sponsor').length===2&&gecerli(s)[0],
    `${an(s)} · ${gecerli(s)[1]||meseleOzeti(s,M1).olaylar.slice(-1)[0].metin}`);
  const k2=persembe('kisi-9');ajandaIsiYap(k2,'is-10','kendin');
  const oncekiDurum=k2.meseleler[M1].durum,k3=macSonrasi(kariyerOlustur(k2),4);
  denetle('Başkan kendisi görüştüyse mesele ödeme gelince kapanır',oncekiDurum==='haberBekliyor'&&k3.meseleler[M1].durum==='kapandi'&&sponsorToplami(k3)===150000000&&gecerli(k3)[0],gecerli(k3)[1]);
}
{
  /* görevlendirilen kişi işte saklanır: koltuk değişirse işi yeni oturan kendiliğinden üstlenmez */
  const c=persembe('kisi-9');ajandaIsiYap(c,'is-10','devret');
  c.kulupler.demirkapi.yonetim.sayman='kisi-8';c.kisiler['kisi-8'].rol='yonetici';      // Tuncay Erbil ayrıldı, yerine Hikmet Aydın oturdu
  const r=haberiBekle(c),d=donenKarar(c,'sponsorGecikmesi');
  denetle('Görevlendirilen kişi ayrılınca iş başkana döner; yeni saymanın becerisiyle sonuçlanmaz',r.neden==='karar'&&an(c)==='2026-11-27 09:30'&&d.length===1&&c.isler['is-3'].veri.tutar===150000000&&!c.gecmis.some(g=>g.tur==='iptal')
    &&donenKarar(c).length===0&&c.meseleler[M1].durum==='kararBekliyor'&&c.meseleler[M1].sorumluId==='kisi-1',meseleOzeti(c,M1).olaylar.slice(-1)[0].metin);
  denetle('Dönen işte yeniden devir açıkça yeni saymana yapılır',/Hikmet Aydın/.test(ajandaOnizle(c,d[0].id).secenekler.find(s=>s.id==='devret').metin)&&gecerli(c)[0],gecerli(c)[1]);
  ajandaIsiYap(c,d[0].id,'devret');
  const e=Object.values(c.isler).find(x=>x.tur==='ekip');
  denetle('Yeni devir yeni kişiyi saklar',e.veri.kisiId==='kisi-8'&&c.meseleler[M1].durum==='ekipte'&&c.meseleler[M1].sorumluId==='kisi-8'&&gecerli(c)[0],gecerli(c)[1]);
}

bolum('2.3 — ilerleme: sıradaki anlamlı durma noktası');
{
  /* test takvimi: ajanda işi olmayan örnek kariyer (28 Kasım 09:00; hatırlatma 30 Kasım, maaş 30 Kasım, sponsor 1 Aralık) */
  const c=yeni(),o=ilerleOnizle(c);
  denetle('Ajanda işi yokken ilerleme son rutin işe kadar gider',!o.engel.length&&o.neden==='sinir'&&o.gerceklesecek.length===3);
  const r=duragaIlerle(c);
  denetle('Boş günler tek ilerlemeyle geçilir, rutin işler sırayla birer kez işlenir',an(c)==='2026-12-01 11:00'&&r.biten.map(x=>x.isId).join()==='is-1,is-2,is-3'&&c.hareketler.length===2,an(c));
  const p=yeni();zamanIlerlet(p,1440);zamanIlerlet(p,600);zamanIlerlet(p,2*1440+120-600);
  denetle('Tek parça ilerleme = bölünmüş ilerleme',metin(p)===metin(c));
  denetle('Bekleyen hiçbir şey yokken ilerlenmez, nedeni söylenir',/gelişme yok/.test(ilerleOnizle(c).engel[0]||'')&&reddeder(()=>duragaIlerle(c)),ilerleOnizle(c).engel[0]);
  const z=yeni(),x=isEkle(z,{tur:'ajanda',tarih:'2026-12-03',dakika:840,veri:{baslik:'Genel kurul hazırlığı',aciklama:'',zorunluluk:'zorunlu',sure:60}});
  const rz=duragaIlerle(z);
  denetle('Gelecekteki zorunlu iş ilerlemeyi engellemez; ilerleme onun başlangıcında durur (5 gün, sabah duruşu yok)',an(z)==='2026-12-03 14:00'&&rz.neden==='randevu'&&rz.durak.id===x&&!!z.isler[x]&&z.hareketler.length===2,an(z));
  denetle('Zorunlu işin başlangıcındayken katılmadan ilerlenmez',/zorunlu işe katıl/.test(ilerleOnizle(z).engel[0]||'')&&reddeder(()=>duragaIlerle(z))&&an(z)==='2026-12-03 14:00',ilerleOnizle(z).engel[0]);
}
{
  /* TEST haftası ilerleyerek: Pazartesi iki zorunlu işten sonra */
  const c=hafta();ajandaIsiYap(c,'is-4');ajandaIsiYap(c,'is-14','kisi-8');
  const r1=duragaIlerle(c);
  denetle('İlerleme isteğe bağlı işin başlangıcında durur',an(c)==='2026-11-23 15:00'&&r1.durak.id==='is-5');
  const o=ilerleOnizle(c);
  denetle('Başlangıcındaki isteğe bağlı işin kaçırılacağı önceden bildirilir',o.kacirilacak.map(x=>x.id).join()==='is-5'&&!o.engel.length&&o.durak.id==='is-6');
  duragaIlerle(c);
  denetle('Çakışması olmayan günün sabahında durulmaz: doğrudan Salı 11:00 randevusu',an(c)==='2026-11-24 11:00'&&c.gecmis.filter(g=>g.isId==='is-5'&&g.sonuc.durum==='kacirildi').length===1,an(c));
  const o2=ilerleOnizle(c);
  denetle('Başlangıcındaki ertelenebilir iş ertesi güne taşınacak diye bildirilir',o2.tasinacak.map(x=>x.id).join()==='is-6'&&o2.gerceklesecek.some(x=>x.id==='is-7'));
  duragaIlerle(c);duragaIlerle(c);                                                     // Çarşamba 11:00 zemin turu → Çarşamba 14:00 röportaj
  denetle('Ertelenen iş kimliğini korur, rutin ödeme arada işlenir',an(c)==='2026-11-25 14:00'&&c.isler['is-6'].tarih==='2026-11-26'&&c.hareketler.length===1,an(c));
  const o3=ilerleOnizle(c);
  denetle('İşleri çakışan günün başında durulur (Perşembe: sponsor görüşmesi ile zemin turu)',o3.neden==='cakisma'&&o3.durak===null);
  duragaIlerle(c);
  const o4=ilerleOnizle(c);
  denetle('Çakışmalı günde sabah durulur, sonraki ilerleme ilk randevuya gider',an(c)==='2026-11-26 08:00'&&o4.neden==='randevu'&&o4.durak.id==='is-10',an(c));
  denetle('İlerlemelerden sonra kariyer geçerli',...gecerli(c));
}
/* Cuma 14:00'e zorunlu toplantı eklenmiş hafta: Perşembe devir, zemin turu ve röportaj yapılmış (Perşembe 15:00) */
function toplantiliCuma(sayman){
  const c=persembe(sayman);ajandaIsiYap(c,'is-10','devret');ajandaIsiYap(c,'is-6');ajandaIsiYap(c,'is-8');
  const x=isEkle(c,{tur:'ajanda',tarih:'2026-11-27',dakika:840,veri:{baslik:'Divan kurulu toplantısı',aciklama:'',zorunluluk:'zorunlu',sure:60}});
  return[c,x];
}
{
  const [h]=toplantiliCuma('kisi-8');const rh=duragaIlerle(h);
  denetle('Haber rutinse ilerleme toplantıya kadar gider; sonuç özette',an(h)==='2026-11-27 14:00'&&rh.neden==='randevu'&&rh.biten.some(g=>g.isTuru==='ekip'&&!g.sonuc.dur&&/taksit/.test(g.sonuc.bilgi)),rh.biten.map(g=>g.isTuru).join());
  const [t,x]=toplantiliCuma('kisi-9');const rt=duragaIlerle(t);
  denetle('Haber karar gerektiriyorsa ilerleme tam o anda durur; 14:00 toplantısı ilerlemeyi engellemedi',an(t)==='2026-11-27 09:30'&&rt.neden==='karar'&&donenKarar(t).length===1&&!!t.isler[x],an(t));
  const kr=donenKarar(t)[0].id,o=ilerleOnizle(t);
  denetle('Bekleyen karar ilerlemeyi kilitlemez: son cevap anından önceki randevuya gidilir',!o.engel.length&&o.durak.id===x);
  duragaIlerle(t);
  denetle('Bekleyen karar varken başka işe katılınabilir',an(t)==='2026-11-27 14:00'&&!ajandaOnizle(t,x).engel.length);
  ajandaIsiYap(t,x);
  const gun=ajandaGunu(t,t.tarih).find(r=>r.id===kr);
  denetle('Saati serbest karar bugünün listesinde, son cevap anıyla görünür',an(t)==='2026-11-27 15:00'&&!!t.isler[kr]&&gun.saatsiz===true&&saatYazi(gun.sonCevap.dakika)==='23:59');
  duragaIlerle(t);                                                              // 16:00 hoca görüşmesi (isteğe bağlı)
  const o2=ilerleOnizle(t);
  denetle('Karar verilmeden son cevap anı geçilemez',an(t)==='2026-11-27 16:00'&&o2.engel.some(e=>/Önce karar ver/.test(e))&&reddeder(()=>duragaIlerle(t)),o2.engel.join(' · '));
  isTasi(t,kr,'2026-11-27',990);                                          // deneme: son cevap 16:30
  denetle('Bitişi son cevap anını aşan işe katılınamaz',ajandaOnizle(t,'is-12').engel.some(e=>/Önce karar ver/.test(e))&&reddeder(()=>ajandaIsiYap(t,'is-12')),ajandaOnizle(t,'is-12').engel.join(' · '));
  const b=ajandaIsiYap(t,kr,'ret');
  denetle('Karar verildiği anda işlenir; ardından iş ve ilerleme açılır',b[0].sonuc.gun==='2026-11-27'&&saatYazi(b[0].sonuc.saat)==='16:00'&&an(t)==='2026-11-27 16:15'&&!ilerleOnizle(t).engel.length&&gecerli(t)[0],gecerli(t)[1]);
}
{
  /* büyük sıçrama: ajandada başka iş kalmasa da sonradan doğan zorunlu karar atlanmaz */
  const c=persembe('kisi-9');ajandaIsiYap(c,'is-10','devret');ajandaIsiYap(c,'is-6');ajandaIsiYap(c,'is-8');
  isIptal(c,'is-12','deneme');isIptal(c,'is-13','deneme');
  const o=ilerleOnizle(c),r=duragaIlerle(c);
  denetle('Günler süren sıçrama sonradan doğan zorunlu kararı atlayamaz',o.neden==='sinir'&&anDakikaYazi(o.hedef)==='2026-12-01 11:00'&&r.neden==='karar'&&an(c)==='2026-11-27 09:30'&&ilerleOnizle(c).engel.some(e=>/Önce karar ver/.test(e)),`hedef ${anDakikaYazi(o.hedef)} → durulan ${an(c)}`);
}
{
  /* işe giderken kesilme ve işin içinde gelen haber */
  const kur=()=>{const c=persembe('kisi-9');ajandaIsiYap(c,'is-10','devret');ajandaIsiYap(c,'is-6');ajandaIsiYap(c,'is-8');gunuBitir(c);return c;};   // Cuma 08:00
  const c=kur(),b=ajandaIsiYap(c,'is-12');
  denetle('İşe giderken karar gerektiren haber gelirse orada durulur, iş bekler durumda kalır',an(c)==='2026-11-27 09:30'&&!!c.isler['is-12']&&!b.some(g=>g.isId==='is-12')&&donenKarar(c).length===1,an(c));
  ajandaIsiYap(c,'is-12');
  denetle('Aynı işe yeniden gidilebilir; bekleyen karar engel olmaz',an(c)==='2026-11-27 16:45'&&!c.isler['is-12']&&donenKarar(c).length===1&&gecerli(c)[0],gecerli(c)[1]);
  const d=kur(),uzun=isEkle(d,{tur:'ajanda',tarih:'2026-11-27',dakika:540,veri:{baslik:'Esnaf ziyareti',aciklama:'',zorunluluk:'istege',sure:60}});
  ajandaIsiYap(d,uzun);
  denetle('İşin içindeyken gelen haber işi kesmez; karar işten sonra bekler',an(d)==='2026-11-27 10:00'&&!d.isler[uzun]&&donenKarar(d).length===1&&d.meseleler[M1].durum==='kararBekliyor');
}
{
  /* iş sırasında son cevap anı dolan karar: deneme görevi 20 dakika süreli karar doğurur */
  vm.runInContext(`EKIP_GOREVLERI.denemeKisaSure={denetle:()=>[],bekleme:()=>'deneme',geriDon:()=>{},uygula:(k,is)=>{
    isEkle(k,{tur:'ajanda',tarih:k.tarih,dakika:k.gunIciDakika+20,veri:{baslik:'Kısa süreli karar',aciklama:'',zorunluluk:'zorunlu',sure:5,saatsiz:true,
      gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'sponsorIndirimi',kulupId:is.veri.kulupId,odemeIsId:'is-3',oran:10,meseleId:is.veri.meseleId}});
    return{bilgi:'deneme',dur:true};}}`,ctx);
  const c=hafta();ajandaIsiYap(c,'is-4');ajandaIsiYap(c,'is-14','kisi-8');
  isEkle(c,{tur:'ekip',tarih:'2026-11-23',dakika:930,veri:{meseleId:M1,kisiId:'kisi-8',kulupId:'demirkapi',koltuk:'sayman',gorev:'denemeKisaSure'}});
  ajandaIsiYap(c,'is-5');                                                  // 15:00–17:00 antrenman; karar 15:30'da doğar, son cevap 15:50
  const kr=donenKarar(c)[0];
  denetle('İşin içindeyken son cevap anı dolan zorunlu karar kaçırılmaz: süre işin bitişinden 30 dk sonrasına uzar',an(c)==='2026-11-23 17:00'&&!!kr&&saatYazi(kr.dakika)==='17:30'
    &&!c.gecmis.some(g=>g.tur==='is'&&g.sonuc&&g.sonuc.baslik==='Kısa süreli karar')&&c.meseleler[M1].olaylar.some(o=>o.anahtar==='sureUzadi'),kr&&`son cevap ${saatYazi(kr.dakika)} · ${meseleOzeti(c,M1).olaylar.slice(-1)[0].metin}`);
  denetle('Tek meseleye üç bağlı iş; kariyer geçerli',bagli(c).split(' ').length===3&&Object.keys(c.meseleler).length===1&&gecerli(c)[0],`${bagli(c)} ${gecerli(c)[1]}`);
  vm.runInContext('delete EKIP_GOREVLERI.denemeKisaSure',ctx);
}

/* ================= 2.4 gün içi kayıt ve dönüş ================= */
bolum('2.4 — güvenli komut, gün içi kayıt ve dönüş özeti');
{
  const c=hafta(),once=metin(c);
  const yarida=reddeder(()=>kariyerKomut(c,x=>{ajandaIsiYap(x,'is-4');throw new Error('yarıda kesildi');}));
  const tutarsiz=reddeder(()=>kariyerKomut(c,x=>{ajandaIsiYap(x,'is-4');x.kulupler.demirkapi.nakit+=1;}));
  denetle('Yarıda hata veren ya da tutarsız bırakan komut kariyeri hiç değiştirmez',yarida&&tutarsiz&&metin(c)===once);
  const r=kariyerKomut(c,x=>ajandaIsiYap(x,'is-4').length);
  denetle('Geçerli komut yeni durumu döndürür, eski durum olduğu gibi kalır',an(r.kariyer)==='2026-11-23 11:30'&&r.sonuc===1&&metin(c)===once);
}
{
  const d=bellekDeposu();let dolu=false;
  const depo=Object.assign({},d,{yaz:(ad,m)=>{if(dolu)throw new Error('depolama alanı dolu');d.yaz(ad,m);}});
  const o=kayitOturumu(depo,'oyun-1',hafta());o.kaydet();
  o.uygula(x=>ajandaIsiYap(x,'is-4'));
  const y1=kariyerYukle(depo,'oyun-1');
  denetle('Gün bitmeden kapatıp açınca son tamamlanan karar korunur',o.durum.tamam&&!o.durum.bekleyen&&an(y1.kariyer)==='2026-11-23 11:30'&&!y1.kariyer.isler['is-4'],`kayıt: ${an(y1.kariyer)}`);
  dolu=true;
  o.uygula(x=>ajandaIsiYap(x,'is-14','kisi-8'));
  const y2=kariyerYukle(depo,'oyun-1');
  denetle('Kayıt yazılamazsa açıkça bildirilir: karar uygulandı, kaydedilemedi; önceki sağlam kayıt durur',!o.durum.tamam&&o.durum.bekleyen&&/dolu/.test(o.durum.hata)&&o.kariyer.kulupler.demirkapi.yonetim.sayman==='kisi-8'
    &&saatYazi(o.durum.dakika)==='11:30'&&y2.tamam&&an(y2.kariyer)==='2026-11-23 11:30'&&y2.kariyer.kulupler.demirkapi.yonetim.sayman===null,o.durum.hata);
  dolu=false;const s=o.kaydet(),y3=kariyerYukle(depo,'oyun-1');
  denetle('Yeniden kaydetmek kararı ikinci kez uygulamaz',s.tamam&&o.durum.tamam&&!o.durum.bekleyen&&metin(y3.kariyer)===metin(o.kariyer)&&y3.kariyer.gecmis.filter(g=>g.isId==='is-14').length===1&&an(y3.kariyer)==='2026-11-23 14:30');
  denetle('Hata veren komut oturumu ve kaydı değiştirmez',reddeder(()=>o.uygula(x=>ajandaIsiYap(x,'is-14','kisi-9')))&&metin(kariyerYukle(depo,'oyun-1').kariyer)===metin(o.kariyer)&&o.durum.tamam);
}
{
  /* maç sınırı: otomatik kaydın bilinçli istisnası */
  const depo=bellekDeposu(),o=kayitOturumu(depo,'oyun-1',oyna(hafta(),{macsiz:true}));o.kaydet();
  const onceki=an(o.kariyer);
  o.uygula(x=>ajandaIsiYap(x,'is-13'),true);
  const y=kariyerYukle(depo,'oyun-1').kariyer;
  denetle('"Stada git" kaydedilmez: bellekte maç sınırına gelinir, kayıt bir önceki kararda kalır',an(o.kariyer)==='2026-11-28 19:00'&&!o.kariyer.isler['is-13']&&o.durum.bekleyen&&an(y)===onceki,`bellek ${an(o.kariyer)} · kayıt ${an(y)}`);
  denetle('Yüklenen oyuncu maç geçişini kaybetmez: maç işi bekliyor ve katılınabilir',!!y.isler['is-13']&&!ajandaOnizle(y,'is-13').engel.length&&y.tarih==='2026-11-28');
}
{
  const depo=bellekDeposu();
  const ara=x=>{const s=kariyerKaydet(depo,'oyun-1',x);if(!s.tamam)throw new Error(s.hata);return kariyerYukle(depo,'oyun-1').kariyer;};
  const S={'is-14':'kisi-9','is-10':'devret',sponsorIndirimi:'kabul'};
  denetle('Devirli haftada her komuttan sonra kaydet/yükle = hiç kaydetmeden oynamak',metin(haftayiOyna(null,S))===metin(haftayiOyna(ara,S)));
  let c=persembe('kisi-8');ajandaIsiYap(c,'is-10','devret');
  const oz=donusOzeti(c),once=metin(c);
  denetle('Dönüş özeti: son karar, beklenen haber ve yaklaşan zorunlu iş; özet kariyeri değiştirmez',/devret/.test(oz.sonKarar.secimMetni)&&oz.sonKarar.baslik==='Forma sponsoru ödemesi gecikiyor'
    &&oz.beklenen.length===1&&/Hikmet Aydın/.test(oz.beklenen[0].metin)&&oz.beklenen[0].tarih==='2026-11-27'&&oz.yaklasan.isId==='is-6'&&metin(c)===once,
    `${oz.sonKarar.secimMetni} · ${oz.beklenen[0].metin} · ${oz.yaklasan.baslik}`);
  c=macSonrasi(ara(c),20);                                                 // gün ortasında kaydedildi, yüklendi, 18 Aralık'a kadar sürdü
  denetle('Gün ortası kayıttan devamda karar, ekip işi ve ödemeler bir kez',c.gecmis.filter(g=>g.isId==='is-10').length===1&&c.gecmis.filter(g=>g.isTuru==='ekip').length===1&&sponsorToplami(c)===150000000
    &&c.meseleler[M1].durum==='kapandi'&&gecerli(c)[0],gecerli(c)[1]);
}

bolum('2.4 — sürüm 1 kayıtları (araclar/ornekler): açılır, dönüşür, devam eder');
{
  const ORNEKLER=[
    ['karar-oncesi','kararBekliyor','is-3:odeme is-10:ajanda',150000000],
    ['kendin','haberBekliyor','is-3:odeme',150000000],
    ['taksit','haberBekliyor','is-15:odeme is-16:odeme',150000000],
    ['gecikme-bedeli','haberBekliyor','is-3:odeme is-15:odeme',153000000],
    ['indirim-bekliyor','kararBekliyor','is-3:odeme is-15:ajanda',135000000],
    ['indirim-kabul','haberBekliyor','is-16:odeme',135000000],
    ['indirim-ret','haberBekliyor','is-3:odeme',150000000],
    ['odeme-tamam','kapandi','',150000000]
  ];
  const meselesiz=x=>{const y=yukle(x);for(const is of Object.values(y))delete is.veri.meseleId;return metin(y);};
  for(const [ad,durum,isler,toplam] of ORNEKLER){
    const dosya=fs.readFileSync(path.join(KOK,'araclar','ornekler',`kayit-s1-${ad}.json`),'utf8'),eski=JSON.parse(dosya).veri;
    const depo=bellekDeposu();depo.yaz('e',dosya);
    const y=kariyerYukle(depo,'e'),c=y.kariyer;
    const ayni=y.tamam&&eski.kayitSurumu===1&&y.gecisler.join()==='1→2,2→3,3→4,4→5'&&metin(c.hareketler)===metin(eski.hareketler)&&metin(c.gecmis)===metin(eski.gecmis)
      &&metin(c.kulupler)===metin(eski.kulupler)&&meselesiz(c.isler)===metin(eski.isler)&&c.tarih===eski.tarih&&c.gunIciDakika===eski.gunIciDakika;
    denetle(`${ad}: açıldı ve sürüm 5'e dönüştü (1→…→5); para, geçmiş ve işler aynı, mesele ${durum}`,ayni&&Object.keys(c.meseleler).length===1&&c.meseleler[M1].durum===durum&&bagli(c)===isler,
      y.tamam?`${an(c)} · bağlı: ${bagli(c)||'yok'} · ${meseleOzeti(c,M1).olaylar.length} olay`:y.hata);
    if(!y.tamam)continue;
    const s=macSonrasi(kariyerOlustur(c),30);
    denetle(`${ad}: oynanmaya devam etti; ödeme ve karar tekrarlanmadı, mesele kapandı`,s.meseleler[M1].durum==='kapandi'&&sponsorToplami(s)===toplam&&gecerli(s)[0]&&Object.keys(s.meseleler).length===1,
      `${an(s)} · sponsor geliri ${paraYazi(sponsorToplami(s))} ${gecerli(s)[1]}`);
  }
  denetle('Dönüştürülen kayıt sürüm 5 olarak yeniden kaydedilip yüklenir',(()=>{const depo=bellekDeposu();depo.yaz('e',fs.readFileSync(path.join(KOK,'araclar','ornekler','kayit-s1-taksit.json'),'utf8'));
    const c=kariyerYukle(depo,'e').kariyer,s=kariyerKaydet(depo,'e',c),y=kariyerYukle(depo,'e');return s.tamam&&y.tamam&&!y.gecisler.length&&y.kariyer.kayitSurumu===5&&metin(y.kariyer)===metin(c);})());
}
denetle('Başlangıç verileri yeni denemelerde de değişmedi',metin(BASLANGIC)===baslangicMetni&&metin(ORNEK)===ornekMetni);

/* ================= 2.4A değişken başlangıç ve koşula bağlı olay ================= */
bolum('2.4A — değişken başlangıç: aynı kulüp, farklı devralınan koşullar');
const [kariyerBaslat,nakitAcigi,rastlantiCek,paketDene,kayitMetni]=['kariyerBaslat','nakitAcigi','rastlantiCek','paketDene','kayitMetni'].map(al);
/* 2.4A bölümleri ödeme sıkışmasını tek başına dener: sonradan eklenen dış gelişmeler (destek, hoca, basın, gazete, teşekkür) ve basın koltuğu
   seçimi bu kariyerlerden çıkarılır. Bütün içerik birlikte 2.6/2.8 bölümlerinde denenir (tamBasla) */
const yalnizOdeme=c=>{for(const x of Object.values(c.isler))if((x.tur==='gelisme'&&x.veri.gelisme!=='sponsorErteleme')||(x.veri.karar==='koltukSecimi'&&x.veri.koltuk==='basin'))delete c.isler[x.id];return c;};
const tamBasla=(baslangic,sponsor,sayman,hoca,tohum)=>kariyerBaslat({tohum:tohum===undefined?7:tohum,baslangic,sponsor,sayman,hoca,icerik:2});
const basla=(baslangic,sponsor,sayman,tohum)=>yalnizOdeme(tamBasla(baslangic,sponsor,sayman,'yok',tohum));
const kararIsi=(c,tur)=>Object.values(c.isler).find(x=>x.tur==='ajanda'&&x.veri.karar===tur);
const secenekAdlari=(c,tur)=>ajandaOnizle(c,kararIsi(c,tur).id).secenekler.map(s=>s.id).join();
const olayDurumlari=c=>Object.values(c.olaylar).map(o=>`${o.varyant}:${o.durum}`).join();
const meseleDurumlari=c=>Object.values(c.meseleler).map(m=>m.durum).join();
const enDusukNakit=c=>{let n=c.kulupler.demirkapi.acilisNakit,en=n;for(const x of c.hareketler)if(x.kulupId==='demirkapi'){n+=x.tutar;en=Math.min(en,n);}return en;};
const sponsorBeklenen=c=>sponsorToplami(c)+Object.values(c.isler).filter(x=>x.tur==='odeme'&&x.veri.kalem==='sponsor').reduce((t,x)=>t+x.veri.tutar,0);
const uygunSecenekler=(c,id)=>ajandaOnizle(c,id).secenekler.filter(s=>!s.engel&&!ajandaOnizle(c,id,s.id).engel.length);
const bugunkuKararlar=c=>ajandaGunu(c,c.tarih).filter(r=>r.tur==='ajanda'&&r.durum==='bekliyor'&&r.karar);
/* yeni içerikle oyna: bugün verilebilecek karar varsa verilir (secimler[karar türü]: seçenek, öncelik listesi ya da null = dokunma;
   'dur' = bu karar bugünün ajandasına düşünce orada dur; yoksa ilk uygun seçenek), yoksa ilerlenir. İlerleme engellenince durur
   (maç sınırı ya da bekleyen karar). ara: her komuttan sonra */
function yurut(c,secimler={},ara){
  for(let n=0;n<80;n++){
    if(bugunkuKararlar(c).some(r=>secimler[r.karar]==='dur'))break;
    const r=bugunkuKararlar(c).find(r=>secimler[r.karar]!==null&&uygunSecenekler(c,r.id).length);
    if(r){
      const S=uygunSecenekler(c,r.id),ist=[].concat(secimler[r.karar]||[]);
      ajandaIsiYap(c,r.id,(ist.map(i=>S.find(s=>s.id===i)).find(Boolean)||S[0]).id);
    }else{if(ilerleOnizle(c).engel.length)break;duragaIlerle(c);}
    if(ara)c=ara(c);
  }
  return c;
}
const macSinirinda=c=>an(c)==='2026-11-28 19:00'&&Object.values(c.isler).some(x=>x.veri.eylem==='macGunu');
{
  const S=basla('sikisik','nakitSikisik'),R=basla('rahat','nakitSikisik','kisi-9'),D=basla('duzenli',undefined,'kisi-8');
  denetle('Üç başlangıç geçerli, içerik sürümü 2, başlangıç kaydedilmiş',[S,R,D].every(c=>gecerli(c)[0]&&c.icerik.surum===2)&&[S,R,D].map(c=>c.icerik.baslangic).join()==='sikisik,rahat,duzenli');
  const kimlik=c=>metin([c.kulupler.demirkapi.ad,Object.values(c.kisiler).map(p=>[p.id,p.ad,p.dogumTarihi])]);
  denetle('Kulüp kimliği ve kişiler üç başlangıçta aynı; hafta aynı günde başlar',kimlik(S)===kimlik(R)&&kimlik(R)===kimlik(D)&&[S,R,D].every(c=>an(c)==='2026-11-23 08:00'));
  const kosul=c=>`${c.kulupler.demirkapi.nakit}/${c.kulupler.demirkapi.yonetim.sayman}/${c.kosullar.sponsor.durum}/${Object.values(c.isler).map(x=>x.veri.karar||x.veri.gelisme).filter(Boolean).sort().join('+')}`;
  denetle('Devralınan koşullar ayrışıyor: kasa, sayman koltuğu, sponsorun durumu ve gündem',new Set([S,R,D].map(kosul)).size===3&&S.kulupler.demirkapi.yonetim.sayman===null&&R.kulupler.demirkapi.yonetim.sayman==='kisi-9',[S,R,D].map(kosul).join(' | '));
  denetle('Başlangıçta mesele ve olay yok: kriz hazır kart olarak verilmiyor',[S,R,D].every(c=>!Object.keys(c.meseleler).length&&!Object.keys(c.olaylar).length));
  const gizli=c=>Object.values(c.isler).find(x=>x.tur==='gelisme');
  denetle('Henüz olmamış dış gelişme ajandada, yaklaşanlarda ve ilerleme önizlemesinde görünmez',!!gizli(S)&&!yaklasanlar(S,7).some(x=>x.tur==='gelisme')&&!ajandaGunu(S,'2026-11-25').some(r=>r.tur==='gelisme')
    &&!ilerleOnizle(D).gerceklesecek.some(x=>x.tur==='gelisme')&&!gizli(D));
  const tohumlar=[];for(let t=1;t<=40;t++)tohumlar.push(kariyerBaslat({tohum:t,icerik:2}));
  denetle('Aynı tohum aynı kariyeri kurar; 40 tohumda üç başlangıç ve iki sponsor durumu da çıkıyor',tohumlar.every((c,i)=>metin(c)===metin(kariyerBaslat({tohum:i+1,icerik:2})))
    &&new Set(tohumlar.map(c=>c.icerik.baslangic)).size===3&&new Set(tohumlar.map(c=>c.kosullar.sponsor.durum)).size===3,[...new Set(tohumlar.map(c=>c.icerik.baslangic+'/'+c.kosullar.sponsor.durum))].join(' '));
  const r1=kariyerBaslat({tohum:7,icerik:2}),r2=kariyerBaslat({tohum:7,baslangic:r1.icerik.baslangic,icerik:2});
  denetle('Başlangıcı elle vermek diğer çekilişleri değiştirmez; geçersiz başlangıç reddedilir',metin(r1)===metin(r2)&&reddeder(()=>kariyerBaslat({tohum:7,baslangic:'yok',icerik:2}))&&reddeder(()=>kariyerBaslat({tohum:1.5,icerik:2})));
  const uretec=al('tohumluRastgele')(7),x=basla('duzenli'),y=kariyerOlustur(x);x.rastlanti.durum=7;y.rastlanti.durum=7;
  const dizi=[1,2,3,4].map(()=>rastlantiCek(x));
  denetle('Kayıtlı rastlantı tohumlu üreticiyle aynı diziyi verir; durumu kariyerde saklanır ve kaldığı yerden sürer',dizi.every(v=>v===uretec())&&(rastlantiCek(y),rastlantiCek(y),rastlantiCek(yukle(y)))===dizi[2]);
}

bolum('2.4A — koşula göre açılan, açılmayan ve önlenen olay');
{
  const d=basla('duzenli',undefined,'kisi-8'),ilk=kariyerOlustur(d),r=duragaIlerle(d);
  denetle('Düzenli başlangıç: tek ilerlemeyle maç sınırına gelinir; mesele ve olay hiç açılmaz',r.neden==='randevu'&&macSinirinda(d)&&!Object.keys(d.meseleler).length&&!Object.keys(d.olaylar).length,`${an(d)} · ${r.biten.length} rutin iş`);
  denetle('Düzenli başlangıç: ödemeler gününde ve birer kez; kasa hiç eksiye düşmez',d.hareketler.length===5&&d.kulupler.demirkapi.nakit===322500000&&enDusukNakit(d)>=0&&sponsorToplami(d)===150000000
    &&d.hareketler.every(h=>{const is=ilk.isler[h.kaynak];return is.tarih===h.tarih&&is.dakika===h.dakika;}),paraYazi(d.kulupler.demirkapi.nakit));

  const rh=basla('rahat','nakitSikisik','kisi-8'),rr=duragaIlerle(rh),ri=kararIsi(rh,'anlasmaDegerlendirme'),ro=meseleOzeti(rh,'mesele-1');
  denetle('Rahat başlangıç: aynı talep gelir ama kasa yetiyor; acil olmayan, ertelenebilir bir karar açılır',rr.neden==='karar'&&an(rh)==='2026-11-25 09:30'&&!ilerleOnizle(rh).engel.length&&olayDurumlari(rh)==='degerlendirme:acik'&&ri.veri.zorunluluk==='ertelenebilir'&&!ri.veri.saatsiz
    &&!nakitAcigi(rh,'demirkapi').acik&&rh.isler['is-3'].tarih==='2026-12-10',`${an(rh)} · ${ro.mesele.baslik}`);
  const sk=yurut(basla('sikisik','nakitSikisik'),{koltukSecimi:'kisi-8',nakitTakvimi:'bekle',odemeSikismasi:null}),si=kararIsi(sk,'odemeSikismasi'),so=meseleOzeti(sk,'mesele-1');
  denetle('Sıkışık başlangıç: taksit kayınca maaş günü kasa yetmiyor; ilerleme haber anında durur, zorunlu karar maaştan önce ister',an(sk)==='2026-11-25 09:30'&&olayDurumlari(sk)==='kriz:acik'&&si.veri.zorunluluk==='zorunlu'&&si.veri.saatsiz
    &&`${si.tarih} ${saatYazi(si.dakika)}`==='2026-11-27 11:00'&&nakitAcigi(sk,'demirkapi').acik===17500000&&ilerleOnizle(sk).engel.length===1,`${paraYazi(nakitAcigi(sk,'demirkapi').acik)} açık · son cevap ${si.tarih} ${saatYazi(si.dakika)}`);
  denetle('Aynı olay ailesi koşula göre farklı seçenek sunar (yalnız metin ya da tutar farkı değil)',secenekAdlari(sk,'odemeSikismasi')==='kendin,devret,bakimErtele,maasGeciktir'&&secenekAdlari(rh,'anlasmaDegerlendirme')==='kabul,bedel,devret',
    `${secenekAdlari(sk,'odemeSikismasi')} | ${secenekAdlari(rh,'anlasmaDegerlendirme')}`);
  denetle('Mesele kim/ne/şimdi sorularını ve kaynağıyla kanıtları verir',so.durum==='kararBekliyor'&&so.karar.simdi&&so.bilgiler.length===3&&so.bilgiler.every(b=>b.kaynak&&b.metin&&b.tarih)&&ro.bilgiler.length===3
    &&so.adimlar.some(a=>a.tur==='odeme'&&a.tutar===-320000000),so.bilgiler.map(b=>b.kaynak+': '+b.metin).join(' · '));
  const sp=yurut(basla('sikisik','pazarlik'),{koltukSecimi:'kisi-8',nakitTakvimi:'bekle',odemeSikismasi:null});
  const gorunen=c=>metin([meseleOzeti(c,'mesele-1'),ajandaGunu(c,c.tarih),ajandaOnizle(c,kararIsi(c,'odemeSikismasi').id).secenekler,donusOzeti(c)]);
  denetle('Sponsorun gerçek durumu oyuncuya dökülmez; tahsilat geçmişi kanıtı iki durumda farklıdır',!/nakitSikisik|pazarlik|saglam/.test(gorunen(sk)+gorunen(sp))
    &&meseleOzeti(sk,'mesele-1').bilgiler[0].metin!==meseleOzeti(sp,'mesele-1').bilgiler[0].metin,meseleOzeti(sp,'mesele-1').bilgiler[0].metin);

  const on=yurut(basla('sikisik','pazarlik'),{koltukSecimi:'kisi-9',nakitTakvimi:'takip'});
  denetle('Önleme: erken teyit pazarlık arayan sponsorun talebini doğmadan bitirir; mesele açılmaz, taksit gününde gelir',macSinirinda(on)&&!Object.keys(on.meseleler).length&&olayDurumlari(on)==='null:onlendi'
    &&on.hareketler.some(h=>h.kalem==='sponsor'&&h.tarih==='2026-11-26'&&h.tutar===150000000)&&enDusukNakit(on)>=0&&gecerli(on)[0],`${olayDurumlari(on)} · ${paraYazi(on.kulupler.demirkapi.nakit)}`);
  denetle('Önlenen konu geri zorlanmaz: aynı paket aynı konuya yeniden açılmaz',paketDene(on,'odemeSikismasi',Object.values(on.olaylar)[0].konu,{kulupId:'demirkapi'})===null&&Object.keys(on.olaylar).length===1);
  const on2=yurut(basla('sikisik','nakitSikisik'),{koltukSecimi:'kisi-9',nakitTakvimi:'takip',odemeSikismasi:null});
  const on3=yurut(basla('sikisik','pazarlik'),{koltukSecimi:'kisi-10',nakitTakvimi:'takip',odemeSikismasi:null});
  denetle('Aynı önlem her koşulda işe yaramaz: gerçekten sıkışık sponsorda ya da bağlantısı zayıf saymanla talep yine gelir',olayDurumlari(on2)==='kriz:acik'&&olayDurumlari(on3)==='kriz:acik');
  const bk=yurut(basla('sikisik','nakitSikisik'),{koltukSecimi:'kisi-8',nakitTakvimi:'bakim',anlasmaDegerlendirme:null});
  denetle('Kasada pay bırakmak krizi önler: talep gelir ama acil karar doğmaz; erteleme bedeli kayıtlıdır',olayDurumlari(bk)==='degerlendirme:acik'&&!kararIsi(bk,'odemeSikismasi')&&Object.values(bk.isler).some(x=>x.veri.kalem==='bakim'&&x.tarih==='2026-12-15'&&x.veri.tutar===-37500000));
  const eski=hafta(),eskiMetin=metin(eski);
  denetle('Eski sabit içerikte (içerik sürümü 0) paket açılmaz',paketDene(eski,'odemeSikismasi','sponsor:is-3',{kulupId:'demirkapi'})===null&&metin(eski)===eskiMetin);
}

bolum('2.4A — kararlar: başkan, sayman ve başka ödeme planı koşula göre farklı sonuç verir');
{
  const ADAYLAR=['kisi-8','kisi-9','kisi-10'],DURUMLAR=['nakitSikisik','pazarlik'];
  const kriz=(durum,sayman)=>yurut(basla('sikisik',durum),{koltukSecimi:sayman,nakitTakvimi:'bekle',odemeSikismasi:null});
  /* devir: haber gelene (ya da maç sınırına) kadar ilerle. cozuldu: karar başkana dönmedi */
  const devir=(durum,sayman)=>{const c=kriz(durum,sayman);ajandaIsiYap(c,kararIsi(c,'odemeSikismasi').id,'devret');const r=duragaIlerle(c);
    return{c,cozuldu:r.neden!=='karar',gelir:sponsorBeklenen(c),olay:c.meseleler['mesele-1'].olaylar.filter(o=>o.anahtar.startsWith('odeme.ekip')).map(o=>o.anahtar).join()};};
  const T={};for(const d of DURUMLAR)for(const s of ADAYLAR)T[d+'/'+s]=devir(d,s);
  const puan=x=>(x.cozuldu?1e12:0)+x.gelir,enIyi=d=>ADAYLAR.filter(s=>puan(T[d+'/'+s])===Math.max(...ADAYLAR.map(a=>puan(T[d+'/'+a]))));
  denetle('Devir sonucu = sponsorun gerçek durumu × saymanın katkısı: altı hücrede en az beş farklı sonuç',new Set(Object.values(T).map(x=>x.olay)).size>=5,Object.entries(T).map(([a,x])=>`${a}: ${x.olay.slice(11)}${x.cozuldu?'':' (döndü)'}`).join(' · '));
  denetle('Hiçbir aday her koşulda en iyi değil; her aday iki koşulda farklı sonuç veriyor',!enIyi('nakitSikisik').some(s=>enIyi('pazarlik').includes(s))&&ADAYLAR.every(s=>T['nakitSikisik/'+s].olay!==T['pazarlik/'+s].olay),
    `sıkışık sponsor: ${enIyi('nakitSikisik').map(s=>T['nakitSikisik/'+s].c.kisiler[s].ad)} · pazarlık: ${enIyi('pazarlik').map(s=>T['pazarlik/'+s].c.kisiler[s].ad)}`);
  denetle('Yetki içindeki çözüm ilerlemeyi durdurmaz; yetkiyi aşan teklif ve çözülemeyen açık başkana döner',T['pazarlik/kisi-9'].cozuldu&&macSinirinda(T['pazarlik/kisi-9'].c)&&!T['nakitSikisik/kisi-9'].cozuldu&&an(T['nakitSikisik/kisi-9'].c)==='2026-11-26 09:30'
    &&kararIsi(T['nakitSikisik/kisi-9'].c,'odemeTeklifi').veri.teklif==='indirim'&&/zaten görüştü/.test(ajandaOnizle(T['pazarlik/kisi-10'].c,kararIsi(T['pazarlik/kisi-10'].c,'odemeSikismasi').id).secenekler[1].engel));
  denetle('Yetki devri görevlendirilen kişinin kimliğini saklar; mesele ekipteyken yürüten o kişidir',(()=>{const c=kriz('nakitSikisik','kisi-8');ajandaIsiYap(c,kararIsi(c,'odemeSikismasi').id,'devret');
    const e=Object.values(c.isler).find(x=>x.tur==='ekip');return e.veri.kisiId==='kisi-8'&&c.meseleler['mesele-1'].durum==='ekipte'&&c.meseleler['mesele-1'].sorumluId==='kisi-8'&&e.tarih==='2026-11-26';})());
  const kn=kriz('nakitSikisik','kisi-9');ajandaIsiYap(kn,kararIsi(kn,'odemeSikismasi').id,'kendin');
  const kp=kriz('pazarlik','kisi-9');ajandaIsiYap(kp,kararIsi(kp,'odemeSikismasi').id,'kendin');
  denetle('Başkanın görüşmesi de koşula bağlı: sıkışık sponsor taksit önerir, pazarlık arayan karşılık ister (teklif yine başkanın)',kn.olaylar['olay-1'].sonuc.cozum==='taksit'&&!kararIsi(kn,'odemeTeklifi')&&!nakitAcigi(kn,'demirkapi').acik
    &&kararIsi(kp,'odemeTeklifi').veri.teklif==='pano'&&meseleOzeti(kn,'mesele-1').bilgiler.length===4,`${kn.olaylar['olay-1'].sonuc.cozum} | teklif: ${kararIsi(kp,'odemeTeklifi').veri.teklif}`);
  const kabul=kariyerOlustur(kp);ajandaIsiYap(kabul,kararIsi(kabul,'odemeTeklifi').id,'kabul');
  const ret=kariyerOlustur(kp);ajandaIsiYap(ret,kararIsi(ret,'odemeTeklifi').id,'ret');
  denetle('Teklifi kabul: tam ödeme hemen, verilen hak kayıtlı. Ret: açık sürer, karar denenmiş yol kapalı olarak döner',kabul.olaylar['olay-1'].sonuc.hak==='panoGelecekSezon'&&!nakitAcigi(kabul,'demirkapi').acik&&sponsorBeklenen(kabul)===150000000
    &&nakitAcigi(ret,'demirkapi').acik>0&&!!ajandaOnizle(ret,kararIsi(ret,'odemeSikismasi').id).secenekler[0].engel&&!ret.olaylar['olay-1'].sonuc.hak);
  const bakim=kriz('pazarlik','kisi-10');ajandaIsiYap(bakim,kararIsi(bakim,'odemeSikismasi').id,'bakimErtele');
  const maas=kriz('pazarlik','kisi-10');ajandaIsiYap(maas,kararIsi(maas,'odemeSikismasi').id,'maasGeciktir');
  denetle('Başka ödeme planı: bakım taksitini ertelemek bedelli, maaşı bekletmek parasız ama iz bırakır; ikisi de açığı kapatır',!nakitAcigi(bakim,'demirkapi').acik&&bakim.olaylar['olay-1'].sonuc.bakimErtelendi&&!kararIsi(bakim,'odemeSikismasi')
    &&!nakitAcigi(maas,'demirkapi').acik&&maas.olaylar['olay-1'].sonuc.maasGecikti&&Object.values(maas.isler).some(x=>x.veri.kalem==='maas'&&x.tarih==='2026-12-10'));
  const dg=yurut(basla('rahat','pazarlik','kisi-9'),{anlasmaDegerlendirme:'devret'}),dr=yurut(basla('rahat','pazarlik','kisi-8'),{anlasmaDegerlendirme:'devret'}),db=yurut(basla('rahat','pazarlik','kisi-8'),{anlasmaDegerlendirme:'bedel'});
  denetle('Acil olmayan talepte: uygun sayman ödemeyi geri getirir ve konu kapanır; diğeri görüş yazar; bedel istemek kesin gelir yazar',dg.meseleler['mesele-1'].durum==='kapandi'&&olayDurumlari(dg)==='degerlendirme:kapandi'&&sponsorToplami(dg)===150000000
    &&meseleOzeti(dr,'mesele-1').bilgiler.some(b=>b.kaynak==='Hikmet Aydın')&&dr.meseleler['mesele-1'].durum==='haberBekliyor'&&sponsorBeklenen(db)===153000000&&[dg,dr,db].every(macSinirinda));
  const iki=kriz('nakitSikisik','kisi-8'),kid=kararIsi(iki,'odemeSikismasi').id;ajandaIsiYap(iki,kid,'kendin');
  denetle('Karar bir kez uygulanır; kapalı seçenek seçilemez',reddeder(()=>ajandaIsiYap(iki,kid,'kendin'))&&iki.gecmis.filter(g=>g.isId===kid).length===1&&reddeder(()=>ajandaIsiYap(kriz('nakitSikisik','kisi-8'),kid,'yok')));
}

bolum('2.4A — tutarlılık: tekrar, okuma, kayıt ve bütün karar yolları');
{
  const S={koltukSecimi:'kisi-9',nakitTakvimi:'bekle',odemeSikismasi:['devret','kendin','maasGeciktir'],odemeTeklifi:'ret'};
  const a1=yurut(basla('sikisik','nakitSikisik'),S),a2=yurut(basla('sikisik','nakitSikisik'),S);
  denetle('Aynı başlangıç ve aynı seçimler aynı kariyeri verir',metin(a1)===metin(a2)&&macSinirinda(a1)&&gecerli(a1)[0],`${an(a1)} · ${a1.meseleler['mesele-1'].olaylar.length} olay ${gecerli(a1)[1]}`);
  const depo=bellekDeposu(),ara=x=>{const s=kariyerKaydet(depo,'oyun-1',x);if(!s.tamam)throw new Error(s.hata);return kariyerYukle(depo,'oyun-1').kariyer;};
  denetle('Her komuttan sonra kaydet/yükle = hiç kaydetmeden oynamak; rastlantı durumu başlangıçtan sonra değişmez',metin(yurut(basla('sikisik','nakitSikisik'),S,ara))===metin(a1)&&a1.rastlanti.durum===basla('sikisik','nakitSikisik').rastlanti.durum);
  const c=yurut(basla('sikisik','pazarlik'),{koltukSecimi:'kisi-8',nakitTakvimi:'bekle',odemeSikismasi:null}),once=metin(c),kid=kararIsi(c,'odemeSikismasi').id;
  for(let i=0;i<3;i++){for(const s of ajandaOnizle(c,kid).secenekler)ajandaOnizle(c,kid,s.id);meseleOzeti(c,'mesele-1');donusOzeti(c);ilerleOnizle(c);ajandaGunu(c,c.tarih);yaklasanlar(c,7);nakitAcigi(c,'demirkapi');kariyerDogrula(c);kayitMetni(c);}
  denetle('Okuma, önizleme, özet ve kayıt metni kariyeri ve rastlantıyı değiştirmez; yeni sonuç çekmez',metin(c)===once);
  const o=kayitOturumu(bellekDeposu(),'oyun-1',c);o.kaydet();
  denetle('Tutarsız bırakan komut kabul edilmez; geçerli karar kaydedilir',reddeder(()=>o.uygula(x=>{ajandaIsiYap(x,kid,'kendin');x.olaylar['olay-1'].durum='kapandi';}))&&metin(o.kariyer)===once&&(o.uygula(x=>ajandaIsiYap(x,kid,'kendin')),o.durum.tamam&&!o.durum.bekleyen));
  /* tek parça ve parçalı ilerleme: devredilmiş iş ve ödemeler beklerken */
  const p=yurut(basla('sikisik','nakitSikisik'),{koltukSecimi:'kisi-8',nakitTakvimi:'bekle',odemeSikismasi:null});ajandaIsiYap(p,kararIsi(p,'odemeSikismasi').id,'devret');
  const tek=kariyerOlustur(p),parca=kariyerOlustur(p),sure=3*1440+300;
  zamanIlerlet(tek,sure);for(let t=0;t<sure;t+=97)zamanIlerlet(parca,Math.min(97,sure-t));
  denetle('Tek parça ve parçalı ilerleme aynı sonucu verir (ekip işi ve ödemeler dahil)',metin(tek)===metin(parca)&&tek.gecmis.filter(g=>g.isTuru==='ekip').length===1&&gecerli(tek)[0],gecerli(tek)[1]);
  /* bütün karar yolları: her uygun seçenek ve "karar vermeden ilerle" dalı */
  const say={yol:0,engel:0,eksi:0,gecersiz:0,vade:0,sonuc:new Set()};
  function dolas(c,plan,derinlik){
    if(derinlik>40){say.engel++;return;}
    const K=bugunkuKararlar(c).filter(r=>uygunSecenekler(c,r.id).length),ilerlenir=!ilerleOnizle(c).engel.length;
    const dallar=[];
    if(K.length)for(const s of uygunSecenekler(c,K[0].id))dallar.push(x=>ajandaIsiYap(x,K[0].id,s.id));
    if(ilerlenir&&!K.some(r=>r.zorunluluk==='zorunlu'))dallar.push(x=>duragaIlerle(x));
    if(!dallar.length){
      say.yol++;
      if(!macSinirinda(c))say.engel++;
      if(enDusukNakit(c)<0)say.eksi++;
      if(!gecerli(c)[0])say.gecersiz++;
      /* bir karara konu olmayan rutin ödemeler planlandığı anda işlenmiş olmalı */
      for(const h of c.hareketler){const is=plan[h.kaynak];if(is&&['isletme','bilet'].includes(is.veri.kalem)&&(is.tarih!==h.tarih||is.dakika!==h.dakika))say.vade++;}
      say.sonuc.add(olayDurumlari(c)+'/'+metin(Object.values(c.olaylar).map(o=>o.sonuc)));
      return;
    }
    for(const f of dallar){const y=kariyerOlustur(c);f(y);dolas(y,plan,derinlik+1);}
  }
  for(const d of ['nakitSikisik','pazarlik']){const b=basla('sikisik',d);dolas(b,b.isler,0);}
  for(const d of ['nakitSikisik','pazarlik'])for(const s of ['kisi-8','kisi-9','kisi-10']){const b=basla('rahat',d,s);dolas(b,b.isler,0);}
  denetle('Bütün karar yolları maç sınırına varır: kasa hiç eksiye düşmez, kayıt geçerli kalır, rutin vadeler kaymaz',say.yol>100&&!say.engel&&!say.eksi&&!say.gecersiz&&!say.vade,
    `${say.yol} yol · ${say.sonuc.size} farklı sonuç · takılan ${say.engel} · eksi kasa ${say.eksi} · geçersiz ${say.gecersiz} · kayan vade ${say.vade}`);
}

bolum('2.4A — sürüm 2 kayıtları (araclar/ornekler): açılır, 3\'e dönüşür, eski içerikle tamamlanır');
{
  const ORNEKLER2=[['yeni','kararBekliyor',150000000],['karar-oncesi','kararBekliyor',150000000],['ekipte','ekipte',150000000],['indirim-bekliyor','kararBekliyor',135000000],['taksit','haberBekliyor',150000000],['kendin','haberBekliyor',150000000]];
  for(const [ad,durum,toplam] of ORNEKLER2){
    const dosya=fs.readFileSync(path.join(KOK,'araclar','ornekler',`kayit-s2-${ad}.json`),'utf8'),eski=JSON.parse(dosya).veri;
    const depo=bellekDeposu();depo.yaz('e',dosya);
    const y=kariyerYukle(depo,'e'),c=y.kariyer;
    const ayni=y.tamam&&eski.kayitSurumu===2&&y.gecisler.join()==='2→3,3→4,4→5'&&['hareketler','gecmis','kulupler','isler','meseleler','kisiler'].every(a=>metin(c[a])===metin(eski[a]))&&c.tarih===eski.tarih&&c.gunIciDakika===eski.gunIciDakika;
    denetle(`${ad}: açıldı ve sürüm 5'e dönüştü (2→…→5); para, geçmiş, işler ve mesele aynı (${durum}), içerik sürümü 0`,ayni&&c.meseleler[M1].durum===durum&&c.icerik.surum===0&&!Object.keys(c.olaylar).length,y.tamam?an(c):y.hata);
    if(!y.tamam)continue;
    const s=macSonrasi(kariyerOlustur(c),30);
    denetle(`${ad}: eski sponsor işi kaldığı yerden tamamlandı; yeni olay açılmadı, ödeme tekrarlanmadı`,s.meseleler[M1].durum==='kapandi'&&sponsorToplami(s)===toplam&&gecerli(s)[0]&&Object.keys(s.meseleler).length===1&&!Object.keys(s.olaylar).length,
      `${an(s)} · sponsor geliri ${paraYazi(sponsorToplami(s))} ${gecerli(s)[1]}`);
  }
}
denetle('Başlangıç verileri 2.4A denemelerinde de değişmedi',metin(BASLANGIC)===baslangicMetni&&metin(ORNEK)===ornekMetni);

/* ================= 2.6 ve 2.8: test görünümü, tavsiye, ekip, sözler ve hafıza ================= */
bolum('Test görünümü (geçici): gizli değerleri okumak kariyeri değiştirmez');
const [testKisi,testKosullar,testOnizleme,testKadro,tavsiyeOnizle,tavsiyeIste,kisiMesgul,girisimListesi,girisimBaslat,odaIzleri,sozMetni,haberMetni,acikSoz,haberlerGoruldu]=
  ['testKisi','testKosullar','testOnizleme','testKadro','tavsiyeOnizle','tavsiyeIste','kisiMesgul','girisimListesi','girisimBaslat','odaIzleri','sozMetni','haberMetni','acikSoz','haberlerGoruldu'].map(al);
const mesTur=(c,tur)=>Object.values(c.meseleler).find(m=>m.tur===tur)||null;
const olayPaket=(c,paket)=>Object.values(c.olaylar).find(o=>o.paket===paket)||null;
const meseleTurleri=c=>Object.values(c.meseleler).map(m=>m.tur).sort().join();
const tamKriz=(durum,sayman,hoca)=>yurut(tamBasla('sikisik',durum,undefined,hoca||'yok'),{koltukSecimi:sayman,destekTeklifi:'reddet',nakitTakvimi:'bekle',odemeSikismasi:null});
{
  const c=tamKriz('pazarlik','kisi-8'),once=metin(c),kid=kararIsi(c,'odemeSikismasi').id;
  const O={};for(const s of ['kendin','devret','bakimErtele','maasGeciktir'])O[s]=testOnizleme(c,kid,s);
  testKisi(c,'kisi-8');testKosullar(c);testKadro('demirkapi');
  denetle('Önizleme, katkı ve koşul okuma kariyeri, kaydı ve rastlantıyı değiştirmez',metin(c)===once&&Object.values(O).every(o=>!o.hata&&o.satirlar.length>=2));
  const gercek=kariyerOlustur(c),kayit=ajandaIsiYap(gercek,kid,'bakimErtele').find(g=>g.isId===kid);
  denetle('Önizlenen sonuç, karar gerçekten verilince çıkan sonuçla aynı',O.bakimErtele.satirlar[0]===kayit.sonuc.bilgi&&/açığı yok/.test(O.bakimErtele.satirlar[1]),O.bakimErtele.satirlar.join(' / '));
  denetle('Devir önizlemesi ekibin haberini de gösterir (kopya haber anına kadar ilerletilir)',O.devret.satirlar.length===3&&/Hikmet Aydın sponsorun muhasebesiyle/.test(O.devret.satirlar[1])&&/sürüyor/.test(O.devret.satirlar[2]),O.devret.satirlar.slice(1).join(' / '));
  const K=testKisi(c,'kisi-8'),T=testKosullar(c),Q=testKadro('demirkapi');
  denetle('Test verisi: katkı seviyeleri, sponsorun gerçek durumu ve futbolcu özellikleri okunur',K.length===4&&K[0].seviye==='güçlü'&&T.some(x=>x.deger==='pazarlik')&&Q.ozellikler.length===11&&Q.oyuncular.length>=11&&Q.oyuncular[0].oz.length===11,
    `${K.map(x=>x.alan+' '+x.seviye).join(', ')} · ${Q.oyuncular.length} futbolcu`);
  denetle('Geçersiz önizleme hata metniyle döner, kariyer yine değişmez',!!testOnizleme(c,kid,'yok').hata&&metin(c)===once);
}

bolum('2.6 — tavsiye, kapasite, kalıcı sorumluluk ve girişim');
{
  const c=tamKriz('nakitSikisik','kisi-8'),kid=kararIsi(c,'odemeSikismasi').id,o=tavsiyeOnizle(c,kid);
  const onceIs=bagli(c),nakit=c.kulupler.demirkapi.nakit,odeme=odemeler(c),bilgiSayisi=meseleOzeti(c,mesTur(c,'odemeSikismasi').id).bilgiler.length;
  denetle('Tavsiye istenebilir: ilgili koltuktaki kişi, süre ve geliş anı önceden bellidir',!!o&&!o.engel&&o.kisi.id==='kisi-8'&&o.sure===120&&anDakikaYazi(o.gelis)==='2026-11-25 11:30');
  tavsiyeIste(c,kid);
  denetle('Tavsiye dünyayı değiştirmez: para, ödemeler ve karar aynı; yalnız kişinin işi eklenir',c.kulupler.demirkapi.nakit===nakit&&odemeler(c)===odeme&&!!c.isler[kid]&&an(c)==='2026-11-25 09:30'
    &&Object.values(c.isler).filter(x=>x.tur==='ekip'&&x.veri.gorev==='tavsiye').length===1&&mesTur(c,'odemeSikismasi').durum==='kararBekliyor',onceIs);
  denetle('Kapasite: görüş bekleyen kişiye iş devredilemez, ikinci görüş istenemez',kisiMesgul(c,'kisi-8')&&/başka bir işte/.test(ajandaOnizle(c,kid).secenekler[1].engel)&&reddeder(()=>tavsiyeIste(c,kid))&&/inceliyor/.test(tavsiyeOnizle(c,kid).engel),
    ajandaOnizle(c,kid).secenekler[1].engel);
  const r=duragaIlerle(c),oz=meseleOzeti(c,mesTur(c,'odemeSikismasi').id);
  denetle('Karar beklerken görüş beklenebilir: ilerleme görüş gelince durur, görüş kaynağıyla dosyaya düşer',r.neden==='haber'&&an(c)==='2026-11-25 11:30'&&oz.bilgiler.length===bilgiSayisi+1
    &&oz.bilgiler[oz.bilgiler.length-1].kaynak==='Hikmet Aydın'&&!kisiMesgul(c,'kisi-8')&&!ajandaOnizle(c,kid).secenekler[1].engel&&gecerli(c)[0],oz.bilgiler[oz.bilgiler.length-1].metin);
  const gorus=(durum,sayman)=>{const x=tamKriz(durum,sayman),id=kararIsi(x,'odemeSikismasi').id;tavsiyeIste(x,id);duragaIlerle(x);const b=meseleOzeti(x,mesTur(x,'odemeSikismasi').id).bilgiler;return b[b.length-1].metin;};
  denetle('Görüş kişinin katkısına ve gerçeğe göre değişir; zayıf görüş yanıltmaz, belirsiz kalır',new Set([gorus('nakitSikisik','kisi-8'),gorus('pazarlik','kisi-8'),gorus('nakitSikisik','kisi-9')]).size===3
    &&/bilemem/.test(gorus('pazarlik','kisi-9'))&&!/nakitSikisik|pazarlik/.test(gorus('pazarlik','kisi-8')),gorus('pazarlik','kisi-9'));
  const gec=tamKriz('nakitSikisik','kisi-8');zamanIlerlet(gec,2*1440+30);
  denetle('Karar saatine yetişmeyecek görüş istenemez',/yetişmez/.test(tavsiyeOnizle(gec,kararIsi(gec,'odemeSikismasi').id).engel||'')&&an(gec)==='2026-11-27 10:00');
  denetle('Eski sabit içerikte ve koltuk seçiminde tavsiye yoktur',tavsiyeOnizle(hafta(),'is-14')===null&&tavsiyeOnizle(persembe('kisi-8'),'is-10')===null);
}
{
  const S={koltukSecimi:'kisi-8',destekTeklifi:'reddet',nakitTakvimi:'kalici',odemeSikismasi:null,odemeTeklifi:null};
  const h=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),S),t=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),Object.assign({},S,{koltukSecimi:'kisi-9'}));
  denetle('Kalıcı sorumluluk: yetki içindeki çözümde başkana karar gelmez, ilerleme durmaz; maç gününe gelinir',macSinirinda(h)&&h.kulupler.demirkapi.sorumluluklar.tahsilat.kisiId==='kisi-8'
    &&!h.gecmis.some(g=>g.tur==='is'&&g.sonuc&&g.sonuc.baslik==='Maaş günü kasa yetmiyor')&&olayPaket(h,'odemeSikismasi').sonuc.cozum==='taksit'&&enDusukNakit(h)>=0&&gecerli(h)[0],`${an(h)} · ${gecerli(h)[1]}`);
  denetle('Kalıcı sorumluluk: yetkiyi aşan teklif yine başkana döner',an(t)==='2026-11-26 09:30'&&!!kararIsi(t,'odemeTeklifi')&&kararIsi(t,'odemeTeklifi').veri.teklif==='indirim'&&!kararIsi(t,'odemeSikismasi'));
  const y=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),Object.assign({},S,{nakitTakvimi:'bekle'}));
  denetle('Sorumluluk verilmediyse karar başkana gelir',an(y)==='2026-11-25 09:30'&&!!kararIsi(y,'odemeSikismasi')&&!y.kulupler.demirkapi.sorumluluklar);
}
{
  const c=tamBasla('rahat','pazarlik','kisi-8','kamp'),L=girisimListesi(c).map(g=>g.id).join();
  const b=girisimBaslat(c,'nakitTakvimi'),ki=kararIsi(c,'nakitTakvimi');
  denetle('Girişim: başkan saymanla nakit takvimini kendisi başlatır; görüşme bugünün ajandasına düşer',L==='nakitTakvimi,hocaGorusmesi'&&!!ki&&ki.tarih===c.tarih&&ki.veri.zorunluluk==='istege'&&/çağırdın/.test(b)
    &&!girisimListesi(c).some(g=>g.id==='nakitTakvimi')&&reddeder(()=>girisimBaslat(c,'nakitTakvimi'))&&gecerli(c)[0],gecerli(c)[1]);
  ajandaIsiYap(c,ki.id,'takip');
  const s=yurut(c,{koltukSecimi:'kisi-12',hocaTalebi:'reddet'});
  denetle('Başlatılan görüşmedeki erken teyit rahat başlangıçta da talebi önler',olayPaket(s,'odemeSikismasi').durum==='onlendi'&&!mesTur(s,'odemeSikismasi')&&macSinirinda(s));
  const d=tamBasla('duzenli',undefined,'kisi-8'),sikisik=tamBasla('sikisik','pazarlik');
  denetle('Sayman yokken nakit takvimi girişimi engeliyle görünür; eski içerikte girişim yoktur',/boş/.test(girisimListesi(sikisik).find(g=>g.id==='hocaGorusmesi')?(girisimListesi(sikisik).find(g=>g.id==='nakitTakvimi')||{engel:'boş'}).engel:'')
    &&girisimListesi(d).length===2&&girisimListesi(hafta()).length===0);
  const g1=tamBasla('rahat','pazarlik','kisi-8','kamp');girisimBaslat(g1,'hocaGorusmesi');ajandaIsiYap(g1,kararIsi(g1,'hocaGorusmesi').id,'dinle');
  const g2=tamBasla('rahat','pazarlik','kisi-8','yok');girisimBaslat(g2,'hocaGorusmesi');const b2=ajandaIsiYap(g2,kararIsi(g2,'hocaGorusmesi').id,'dinle');
  denetle('Hocayla görüşme talebi erkenden açar (Perşembe gelişmesi kalkar); isteği yoksa mesele doğmaz',!!mesTur(g1,'hocaTalebi')&&an(g1)==='2026-11-23 08:45'&&!Object.values(g1.isler).some(x=>x.veri.gelisme==='hocaTalebi')
    &&!!kararIsi(g1,'hocaTalebi')&&!mesTur(g2,'hocaTalebi')&&/isteği yok/.test(b2[0].sonuc.bilgi)&&gecerli(g1)[0]&&gecerli(g2)[0],gecerli(g1)[1]+gecerli(g2)[1]);
}

bolum('2.6 — koltuk havuzu, hoca talebi, basın sorusu ve koşullu destek');
{
  const S=tamBasla('sikisik','pazarlik'),R=tamBasla('rahat','pazarlik','kisi-8'),D=tamBasla('duzenli',undefined,'kisi-10');
  const koltuk=c=>Object.entries(c.kulupler.demirkapi.yonetim).map(([a,b])=>a+':'+(b||'boş')).join(' ');
  denetle('Koltuklar havuzdan kurulur: sıkışıkta sayman, rahatta basın sözcüsü boş; düzenlide üçü de dolu',koltuk(S)==='sayman:boş futbol:kisi-3 basin:kisi-4'&&koltuk(R)==='sayman:kisi-8 futbol:kisi-3 basin:boş'&&koltuk(D)==='sayman:kisi-10 futbol:kisi-3 basin:kisi-4',
    [S,R,D].map(koltuk).join(' | '));
  const bi=kararIsi(R,'koltukSecimi'),bo=ajandaOnizle(R,bi.id).secenekler;
  denetle('Basın koltuğu seçimi ertelenebilir; adaylar havuzdan, profil metniyle; gizli katkı seçenek metninde yok',bi.veri.koltuk==='basin'&&bi.veri.zorunluluk==='ertelenebilir'&&bo.map(s=>s.id).join()==='kisi-11,kisi-12,kisi-10'
    &&bo.every(s=>s.aciklama.length===4)&&!/guclu|zayif|"orta"/.test(JSON.stringify(bo))&&R.kisiler['kisi-4'].durum==='ayrildi');
  const d=yurut(tamBasla('duzenli',undefined,'kisi-8','kamp'));
  denetle('Düzenli hafta sakin kalır: hiçbir mesele, olay ya da söz doğmaz; gazete maç önü haberiyle çıkar, teşekkür gelmez',macSinirinda(d)&&!Object.keys(d.meseleler).length&&!Object.keys(d.olaylar).length&&!Object.keys(d.sozler).length
    &&d.haberler.length===1&&d.haberler[0].anahtar==='gazete.macOnu'&&d.kulupler.demirkapi.nakit===322500000&&gecerli(d)[0],`${d.haberler.map(x=>x.anahtar)} ${gecerli(d)[1]}`);
  const r0=yurut(tamBasla('rahat','pazarlik','kisi-8','yok'),{koltukSecimi:'kisi-11',anlasmaDegerlendirme:'kabul'}),rk=yurut(tamBasla('rahat','pazarlik','kisi-8','kamp'),{koltukSecimi:'kisi-11',anlasmaDegerlendirme:'kabul',hocaTalebi:'dur'});
  denetle('Paketler yalnız koşulu varken açılır: rahat kasada destek teklifi ve basın sorusu yok; hoca talebi yalnız isteği varsa',meseleTurleri(r0)==='odemeSikismasi'&&meseleTurleri(rk)==='hocaTalebi,odemeSikismasi'&&an(rk)==='2026-11-26 14:00',`${meseleTurleri(r0)} | ${meseleTurleri(rk)}`);
  const hk=kararIsi(rk,'hocaTalebi'),ho=ajandaOnizle(rk,hk.id).secenekler;
  denetle('Hoca talebi bütçe kararıdır: onayla, maaşlardan sonra öde (söz), reddet; son cevap maçtan önceki gün',ho.map(s=>s.id).join()==='onayla,soz,reddet'&&ho.every(s=>!s.engel)&&hk.veri.saatsiz&&`${hk.tarih} ${saatYazi(hk.dakika)}`==='2026-11-27 18:00'&&/Söz verirsin/.test(ho[1].aciklama[0]));
  const dar=tamKriz('nakitSikisik','kisi-8','kamp');zamanIlerlet(dar,1440+300);
  const hd=ajandaOnizle(dar,kararIsi(dar,'hocaTalebi').id).secenekler;
  denetle('Kasa maaş gününü çıkaramıyorken hoca talebinin onayı ve sözü kapalıdır; ret açıktır',an(dar)==='2026-11-26 14:30'&&!!hd[0].engel&&!!hd[1].engel&&!hd[2].engel,`${hd[0].engel} · ${hd[1].engel}`);

  const t=yurut(tamBasla('sikisik','pazarlik',undefined,'yok'),{koltukSecimi:'kisi-9',destekTeklifi:'dur'}),di=kararIsi(t,'destekTeklifi');
  denetle('Destek teklifi yalnız kasa darken gelir; teklif sahibi saymansa görüşü istenemez (çıkar çatışması)',an(t)==='2026-11-24 10:30'&&olayPaket(t,'kosulluDestek').varyant==='teklif'&&/tarafsız/.test(tavsiyeOnizle(t,di.id).engel)
    &&ajandaOnizle(t,di.id).secenekler.map(s=>s.id).join()==='kabul,kucult,reddet'&&!tavsiyeOnizle(yurut(tamBasla('sikisik','pazarlik',undefined,'yok'),{koltukSecimi:'kisi-8',destekTeklifi:'dur'}),di.id).engel);
  const kabul=yurut(kariyerOlustur(t),{destekTeklifi:'kabul',nakitTakvimi:'bekle',anlasmaDegerlendirme:null,odemeSikismasi:null,basinSorusu:'dur'});
  denetle('Kabul edilen destek kesin nakit ve süreli pano sözü yazar; kasa açığı doğmaz, sponsorun talebi acil karara dönüşmez',!!acikSoz(kabul,'soz.destekPano')&&olayPaket(kabul,'kosulluDestek').sonuc.hak==='panoDestek'
    &&kabul.hareketler.some(h=>h.kalem==='destek'&&h.tutar===40000000&&h.tarih==='2026-11-25')&&olayPaket(kabul,'odemeSikismasi').varyant==='degerlendirme'&&!kararIsi(kabul,'odemeSikismasi'),olayDurumlari(kabul));
  const kucuk=yurut(kariyerOlustur(t),{destekTeklifi:'kucult',nakitTakvimi:'bekle',odemeSikismasi:null});
  denetle('Küçük destek pano bağlamaz ama açığı tek başına kapatmaz: kriz daha küçük açıkla yine doğar',!Object.keys(kucuk.sozler).length&&olayPaket(kucuk,'odemeSikismasi').varyant==='kriz'&&nakitAcigi(kucuk,'demirkapi').acik===2500000,paraYazi(nakitAcigi(kucuk,'demirkapi').acik));
  /* destek teklifi beklerken sponsorun haberi gelir: iki karar aynı anda açıktır */
  const p1=yurut(tamBasla('sikisik','pazarlik',undefined,'yok'),{koltukSecimi:'kisi-10',destekTeklifi:null,nakitTakvimi:'bekle',odemeSikismasi:'dur'});
  const p2=kariyerOlustur(p1);ajandaIsiYap(p2,kararIsi(p2,'odemeSikismasi').id,'kendin');
  const p2a=kariyerOlustur(p2);ajandaIsiYap(p2a,kararIsi(p2a,'odemeTeklifi').id,'kabul');
  const p2b=kariyerOlustur(p2);ajandaIsiYap(p2b,kararIsi(p2b,'destekTeklifi').id,'kabul');
  const p3=kariyerOlustur(p1);ajandaIsiYap(p3,kararIsi(p3,'destekTeklifi').id,'kabul');
  denetle('İki karar aynı anda açık kalabilir: destek teklifi beklerken sponsorun haberi gelir',an(p1)==='2026-11-25 09:30'&&!!kararIsi(p1,'destekTeklifi')&&!!kararIsi(p1,'odemeSikismasi')&&meseleTurleri(p1)==='kosulluDestek,odemeSikismasi');
  denetle('Tek pano iki kişiye söz verilemez: sponsora verildiyse destek, destekçiye verildiyse sponsorun pano teklifi kabul edilemez',!!acikSoz(p2a,'soz.pano')&&/sponsora söz verildi/.test(ajandaOnizle(p2a,kararIsi(p2a,'destekTeklifi').id).secenekler[0].engel||'')
    &&!!acikSoz(p2b,'soz.destekPano')&&/destekçiye söz verildi/.test(ajandaOnizle(p2b,kararIsi(p2b,'odemeTeklifi').id).secenekler[0].engel||'')&&gecerli(p2a)[0]&&gecerli(p2b)[0]);
  denetle('Kabul edilen destek bekleyen kriz kararını düşürür: açık başka yoldan kapandı',!kararIsi(p3,'odemeSikismasi')&&olayPaket(p3,'odemeSikismasi').sonuc.cozum==='baskaKaynak'&&mesTur(p3,'odemeSikismasi').durum==='haberBekliyor'&&gecerli(p3)[0],gecerli(p3)[1]);

  const b=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),{koltukSecimi:'kisi-8',destekTeklifi:'reddet',nakitTakvimi:'bekle',odemeSikismasi:'maasGeciktir',basinSorusu:'dur'}),bi2=kararIsi(b,'basinSorusu');
  denetle('Basın yalnız yaşanmış bir sonucu sorar: geciken maaş; karar gazetenin baskı saatine kadar',an(b)==='2026-11-26 16:00'&&olayPaket(b,'basinSorusu').kosullar.konu==='maas'&&bi2.veri.saatsiz&&saatYazi(bi2.dakika)==='18:30'
    &&ajandaOnizle(b,bi2.id).secenekler.map(s=>s.id).join()==='kendin,devret,sessiz'&&meseleOzeti(b,mesTur(b,'basinSorusu').id).bilgiler[0].kaynak==='Demirkapı Postası');
  const manset=(sec,basinKisi)=>{const x=kariyerOlustur(b);if(basinKisi){x.kulupler.demirkapi.yonetim.basin=null;x.kisiler[basinKisi].rol='yonetici';x.kulupler.demirkapi.yonetim.basin=basinKisi;}
    ajandaIsiYap(x,kararIsi(x,'basinSorusu').id,sec);const y=yurut(x,{});return haberMetni(y,y.haberler[0]);};
  const M=[manset('kendin'),manset('sessiz'),manset('devret'),manset('devret','kisi-12')];
  denetle('Gazetenin manşeti verilen cevaba ve sözcünün iletişimine göre değişir; kaynağı kayıtlı olaydır',new Set(M).size===4&&/Başkan Demirel/.test(M[0])&&/cevapsız/.test(M[1])&&/kasada para yok/.test(M[3]),M[3]);
}

bolum('2.8 — sözler, haberler ve odadaki izler');
{
  const S={koltukSecimi:'kisi-11',anlasmaDegerlendirme:'kabul',hocaTalebi:'soz'};
  const c=yurut(tamBasla('rahat','pazarlik','kisi-8','kamp'),S),soz=Object.values(c.sozler)[0],hm=mesTur(c,'hocaTalebi');
  denetle('Söz yalnız açık taahhütten doğar, gerçek ödemeyle bir kez tutulur ve meselesine haber düşer',Object.keys(c.sozler).length===1&&soz.durum==='tutuldu'&&soz.muhatap==='kisi-2'&&soz.sonuc.tarih==='2026-11-27'&&saatYazi(soz.sonuc.dakika)==='14:00'
    &&hm.olaylar.filter(o=>o.anahtar==='soz.tutuldu').length===1&&hm.durum==='kapandi'&&c.hareketler.filter(h=>h.kalem==='kamp').length===1,sozMetni(c,soz));
  const depo=bellekDeposu(),ara=x=>{const s=kariyerKaydet(depo,'oyun-1',x);if(!s.tamam)throw new Error(s.hata);return kariyerYukle(depo,'oyun-1').kariyer;};
  denetle('Söz, haber ve izler her komuttan sonra kaydet/yükle ile aynı kalır',metin(yurut(tamBasla('rahat','pazarlik','kisi-8','kamp'),S,ara))===metin(c));
  const bz=yurut(tamBasla('rahat','pazarlik','kisi-8','kamp'),Object.assign({},S,{hocaTalebi:'dur'}));
  ajandaIsiYap(bz,kararIsi(bz,'hocaTalebi').id,'soz');
  const kamp=Object.values(bz.isler).find(x=>x.veri.kalem==='kamp');isIptal(bz,kamp.id,'deneme');zamanIlerlet(bz,1440);
  const bs=Object.values(bz.sozler)[0];
  denetle('Yerine getirecek iş yapılmadan kalkarsa söz bir kez bozulur',bs.durum==='bozuldu'&&mesTur(bz,'hocaTalebi').olaylar.filter(o=>o.anahtar==='soz.bozuldu').length===1&&(zamanIlerlet(bz,600),mesTur(bz,'hocaTalebi').olaylar.filter(o=>o.anahtar==='soz.bozuldu').length===1));
  const m=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),{koltukSecimi:'kisi-8',destekTeklifi:'reddet',nakitTakvimi:'bekle',odemeSikismasi:'maasGeciktir',basinSorusu:'kendin'});
  denetle('Geciken maaş personele verilmiş sözdür: maç sınırında hâlâ açıktır; teşekkür gelmez, gazete yazar',acikSoz(m,'soz.maas').muhatap==='personel'&&!m.haberler.some(h=>h.tur==='tesekkur')&&m.haberler[0].anahtar==='gazete.maas'&&macSinirinda(m));
  const t=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),{koltukSecimi:'kisi-8',destekTeklifi:'reddet',nakitTakvimi:'bekle',odemeSikismasi:'devret'}),iz=odaIzleri(t);
  denetle('Olumlu an: sıkışma atlatılıp maaş gününde yatınca kısa teşekkür; para ya da puan üretmez',t.haberler.map(h=>h.tur).join()==='gazete,tesekkur'&&!!iz.kart&&iz.yeniHaber===2&&t.hareketler.length===5&&/Remzi Usta/.test(haberMetni(t,iz.kart)),haberMetni(t,iz.kart));
  const once=metin(t);odaIzleri(t);
  const g=kariyerOlustur(t);haberlerGoruldu(g);
  denetle('İzler kayıtlı olaydan türetilir ve okumak kariyeri değiştirmez; görüldü işareti yalnız "yeni"yi kaldırır',metin(t)===once&&iz.iskele&&!!iz.gazete&&!iz.panoNotu&&odaIzleri(g).yeniHaber===0&&gecerli(g)[0]);
  const bak=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),{koltukSecimi:'kisi-8',destekTeklifi:'reddet',nakitTakvimi:'bakim',anlasmaDegerlendirme:'kabul',basinSorusu:'sessiz'});
  denetle('Bakım ertelendiyse pencerede iskele yoktur ve gazete bunu sorar; pano sözü verildiyse notu görünür',!odaIzleri(bak).iskele&&bak.haberler[0].anahtar==='gazete.bakim'&&odaIzleri(yurut(tamBasla('sikisik','pazarlik',undefined,'yok'),{koltukSecimi:'kisi-9',destekTeklifi:'kabul',nakitTakvimi:'bekle',anlasmaDegerlendirme:'kabul',basinSorusu:'kendin'})).panoNotu);
}

bolum('2.6–2.8 — bütün içerik birlikte: karar yolları, eski kayıtlar');
{
  const say={yol:0,engel:0,eksi:0,gecersiz:0,sinir:0,sonuc:new Set(),enCok:0};
  /* her karar için bütün uygun seçenekler; acil olmayan karar beklerken ilerleme de bir daldır. Bir başlangıcın yol sayısı SINIR'ı aşarsa
     o başlangıcın kalan dallarında yalnız ilk seçenek izlenir (örnekleme; tam dolaşım değildir) */
  const SINIR=1200;let kok=0;
  function dolasTam(c,derinlik){
    if(derinlik>60){say.engel++;return;}
    const K=bugunkuKararlar(c).filter(r=>uygunSecenekler(c,r.id).length),dallar=[];
    if(K.length)for(const s of uygunSecenekler(c,K[0].id))dallar.push(x=>ajandaIsiYap(x,K[0].id,s.id));
    if(!ilerleOnizle(c).engel.length&&!K.some(r=>r.zorunluluk==='zorunlu'&&!c.isler[r.id].veri.bekleyebilir))dallar.push(x=>duragaIlerle(x));
    if(!dallar.length){
      say.yol++;
      if(!macSinirinda(c))say.engel++;
      if(enDusukNakit(c)<0)say.eksi++;
      if(!gecerli(c)[0])say.gecersiz++;
      say.enCok=Math.max(say.enCok,Object.keys(c.meseleler).length);
      say.sonuc.add(meseleTurleri(c)+'/'+metin(Object.values(c.olaylar).map(o=>o.sonuc))+'/'+c.haberler.map(h=>h.anahtar+JSON.stringify(h.p)).join());
      return;
    }
    const L=say.yol-kok>=SINIR?(say.sinir++,dallar.slice(0,1)):dallar;
    for(const f of L){const y=kariyerOlustur(c);f(y);dolasTam(y,derinlik+1);}
  }
  const kokler=[];for(const d of ['nakitSikisik','pazarlik'])for(const hc of ['kamp','yok'])kokler.push(tamBasla('sikisik',d,undefined,hc));
  kokler.push(tamBasla('rahat','pazarlik','kisi-9','kamp'),tamBasla('rahat','nakitSikisik','kisi-8','yok'),tamBasla('duzenli',undefined,'kisi-8'));
  for(const b of kokler){kok=say.yol;dolasTam(b,0);}
  denetle('Bütün içerikle karar yolları maç sınırına varır: kasa eksiye düşmez, kayıt geçerli kalır',say.yol>500&&!say.engel&&!say.eksi&&!say.gecersiz,
    `${say.yol} yol · ${say.sonuc.size} farklı sonuç · en çok ${say.enCok} mesele · takılan ${say.engel} · eksi kasa ${say.eksi} · geçersiz ${say.gecersiz}${say.sinir?` · başlangıç başına ${SINIR} yoldan sonra ${say.sinir} noktada yalnız ilk seçenek izlendi (örnekleme)`:''}`);

  const ORNEKLER3=[['yeni-sikisik',''],['kriz-acik','kararBekliyor'],['ekipte','ekipte'],['teklif-bekliyor','kararBekliyor'],['mac-gunu','haberBekliyor'],['degerlendirme','kararBekliyor'],['duzenli','']];
  for(const [ad,durum] of ORNEKLER3){
    const dosya=fs.readFileSync(path.join(KOK,'araclar','ornekler',`kayit-s3-${ad}.json`),'utf8'),eski=JSON.parse(dosya).veri;
    const depo=bellekDeposu();depo.yaz('e',dosya);
    const y=kariyerYukle(depo,'e'),c=y.kariyer;
    const ayni=y.tamam&&eski.kayitSurumu===3&&y.gecisler.join()==='3→4,4→5'&&['hareketler','gecmis','kulupler','isler','meseleler','kisiler','olaylar','kosullar','rastlanti'].every(a=>metin(c[a])===metin(eski[a]))&&c.tarih===eski.tarih;
    denetle(`${ad}: açıldı ve sürüm 5'e dönüştü (3→4→5); para, geçmiş, işler, mesele ve olay aynı, içerik sürümü 1`,ayni&&c.icerik.surum===1&&meseleDurumlari(c)===durum&&!Object.keys(c.sozler).length&&!c.haberler.length,y.tamam?an(c):y.hata);
    if(!y.tamam)continue;
    const s=yurut(kariyerOlustur(c),{koltukSecimi:'kisi-8',odemeSikismasi:['devret','kendin','maasGeciktir'],odemeTeklifi:'kabul'});
    denetle(`${ad}: kendi içeriğiyle maç sınırına kadar oynandı; sonradan eklenen paket açılmadı, kasa eksiye düşmedi`,macSinirinda(s)&&Object.values(s.olaylar).every(o=>o.paket==='odemeSikismasi')&&!s.haberler.length&&enDusukNakit(s)>=0&&gecerli(s)[0]&&girisimListesi(s).length===0,
      `${an(s)} · ${olayDurumlari(s)||'olay yok'} ${gecerli(s)[1]}`);
  }
}
denetle('Başlangıç verileri 2.6–2.8 denemelerinde de değişmedi',metin(BASLANGIC)===baslangicMetni&&metin(ORNEK)===ornekMetni);

/* ================= 2.7: antrenman gözlemi ================= */
bolum('2.7 — antrenman gözlemi: aralık, kesilme, kısa iş ve uzun iş');
const [antrenmanPenceresi,antrenmanDurumu,gozlemOnizle,gozlemBaslat,gozlemSurdur,gozlemBitir,gozlemAcik,gozlemKalan]=
  ['antrenmanPenceresi','antrenmanDurumu','gozlemOnizle','gozlemBaslat','gozlemSurdur','gozlemBitir','gozlemAcik','gozlemKalan'].map(al);
const saate=(c,tarih,dakika)=>{zamanIlerlet(c,al('anDakika')(tarih,dakika)-al('simdikiAn')(c));return c;};
const gozlemKayitlari=c=>c.gecmis.filter(g=>g.tur==='gozlem');
const dunya=c=>metin([c.kulupler,c.hareketler,c.isler,c.meseleler,c.olaylar,c.sozler,c.haberler,c.tarih,c.gunIciDakika]);
{
  const d=tamBasla('duzenli',undefined,'kisi-8');
  denetle('Antrenman hafta içi 15:00–17:00; hafta sonu ve maç günü yok; takvim işi değildir',metin(antrenmanPenceresi(d,'2026-11-23'))==='{"bas":900,"bit":1020}'&&antrenmanPenceresi(d,'2026-11-28')===null&&antrenmanPenceresi(d,'2026-11-29')===null
    &&!Object.values(d.isler).some(x=>/ntrenman/.test(JSON.stringify(x.veri))));
  denetle('Antrenman başlamadan ve bittikten sonra gözlem başlatılamaz',/başlıyor/.test(gozlemOnizle(d,30).engel[0])&&reddeder(()=>gozlemBaslat(d,30))&&/bitti/.test(gozlemOnizle(saate(kariyerOlustur(d),'2026-11-23',1025),30).engel[0]));
  saate(d,'2026-11-23',900);
  const once=dunya(d),kisa=kariyerOlustur(d),r15=gozlemBaslat(kisa,15),uzun=kariyerOlustur(d),r30=gozlemBaslat(uzun,30);
  denetle('Gözlem seçilen süre kadar zamanı ilerletir ve kapanır; 30 dakikadan kısa gözlem not bırakmaz',an(kisa)==='2026-11-23 15:15'&&r15.neden==='bitti'&&kisa.gozlem===null&&gozlemKayitlari(kisa).length===1&&!gozlemKayitlari(kisa)[0].not&&r15.not===null
    &&an(uzun)==='2026-11-23 15:30'&&gozlemKayitlari(uzun)[0].izlenen===30&&!!r30.not&&gecerli(kisa)[0]&&gecerli(uzun)[0],r30.not);
  const tek=kariyerOlustur(d);gozlemBaslat(tek,120);
  const parca=kariyerOlustur(d);for(let i=0;i<4;i++)gozlemBaslat(parca,30);
  denetle('Tek parça ve parçalı gözlem aynı dünya sonucunu verir; antrenman bitince süre kendiliğinden kısalır',dunya(tek)===dunya(parca)&&an(tek)==='2026-11-23 17:00'&&gozlemOnizle(saate(kariyerOlustur(d),'2026-11-23',1000),60).sure===20);
  const izleyen=yurut(kariyerOlustur(tek)),izlemeyen=yurut(tamBasla('duzenli',undefined,'kisi-8'));
  denetle('İzlemek ödül toplama değildir: izleyen ile izlemeyenin parası, meseleleri, sözleri ve haberleri aynı',dunya(izleyen)===dunya(izlemeyen)&&gozlemKayitlari(izleyen).length===1&&!gozlemKayitlari(izlemeyen).length&&dunya(d)===once);
  const cak=kariyerOlustur(d);isEkle(cak,{tur:'ajanda',tarih:'2026-11-23',dakika:960,veri:{baslik:'Randevu',aciklama:'',zorunluluk:'zorunlu',sure:30}});
  const co=gozlemOnizle(cak,120);gozlemBaslat(cak,120);
  denetle('Gözlem saatli işi sessizce kaçırtmaz: o işin başlangıcında biter ve bunu önceden söyler',co.sure===60&&/Randevu/.test(co.kisaldi)&&an(cak)==='2026-11-23 16:00'&&!!Object.values(cak.isler).find(x=>x.veri.baslik==='Randevu')&&cak.gozlem===null);
}
{
  /* Perşembe 15:00: geciken maaş yüzünden gazete 16:00'da arar */
  const c=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),{koltukSecimi:'kisi-8',destekTeklifi:'reddet',nakitTakvimi:'bekle',odemeSikismasi:'maasGeciktir',basinSorusu:'dur'});
  denetle('(hazırlık) gazete Perşembe 16:00\'da arar',an(c)==='2026-11-26 16:00');
  const b=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),{koltukSecimi:'kisi-8',destekTeklifi:'reddet',nakitTakvimi:'bekle',odemeSikismasi:'dur'});
  ajandaIsiYap(b,kararIsi(b,'odemeSikismasi').id,'maasGeciktir');saate(b,'2026-11-26',900);
  const r=gozlemBaslat(b,120),bi=kararIsi(b,'basinSorusu'),S=ajandaOnizle(b,bi.id).secenekler;
  denetle('Karar gerektiren haberde gözlem durur: zaman haber anında kalır, aralık açık, kalan süre korunur',r.durdu&&r.neden==='karar'&&an(b)==='2026-11-26 16:00'&&gozlemAcik(b)&&r.kalan===60&&gozlemKalan(b)===60&&!!bi&&gecerli(b)[0],`${an(b)} · kalan ${r.kalan} dk ${gecerli(b)[1]}`);
  denetle('Gözlem sürerken uzun iş tam dikkat ister (kapalı); kısa iş ve cevap vermemek açık',/tam dikkat/.test(ajandaOnizle(b,bi.id,'kendin').engel.join())&&!ajandaOnizle(b,bi.id,'devret').engel.length&&!ajandaOnizle(b,bi.id,'sessiz').engel.length
    &&reddeder(()=>ajandaIsiYap(kariyerOlustur(b),bi.id,'kendin')),ajandaOnizle(b,bi.id,'kendin').engel.join());
  const depo=bellekDeposu();kariyerKaydet(depo,'g',b);const y=kariyerYukle(depo,'g').kariyer;
  denetle('Gözlem ortasında kaydet–yükle aynı yerden sürer',metin(y)===metin(b)&&gozlemAcik(y)&&gozlemKalan(y)===60);
  ajandaIsiYap(y,bi.id,'devret');
  denetle('Kısa iş gözlemin içinde geçer: saat 15 dakika ilerler, aralık ve bitişi değişmez',an(y)==='2026-11-26 16:15'&&gozlemAcik(y)&&gozlemKalan(y)===45&&y.gozlem.bitis===1020);
  const s=gozlemSurdur(y),g=gozlemKayitlari(y)[0];
  denetle('Devam edince gözlem antrenman sonunda biter; toplam geçen süre gözlem süresidir (çifte sayım yok)',s.neden==='bitti'&&an(y)==='2026-11-26 17:00'&&y.gozlem===null&&g.bas===900&&g.bitis===1020&&g.izlenen===120&&gozlemKayitlari(y).length===1&&gecerli(y)[0],gecerli(y)[1]);
  const birak=kariyerOlustur(b);gozlemBitir(birak);
  denetle('Gözlem bırakılınca aralık kapanır ve uzun iş yapılabilir',birak.gozlem===null&&gozlemKayitlari(birak)[0].izlenen===60&&!ajandaOnizle(birak,bi.id,'kendin').engel.length&&gecerli(birak)[0]);
  const gec=kariyerOlustur(b);ajandaIsiYap(gec,bi.id,'sessiz');duragaIlerle(gec);
  denetle('İlerlemek açık gözlemi kendiliğinden kapatır; eski aralık kayıtta kalmaz',gec.gozlem===null&&gozlemKayitlari(gec).length===1&&gecerli(gec)[0],`${an(gec)} ${gecerli(gec)[1]}`);
}
{
  const ORNEKLER4=['yeni-sikisik','destek-bekliyor','gorus-bekliyor','sorumlu-ekipte','soz-acik','basin-bekliyor','mac-gunu','duzenli'];
  for(const ad of ORNEKLER4){
    const dosya=fs.readFileSync(path.join(KOK,'araclar','ornekler',`kayit-s4-${ad}.json`),'utf8'),eski=JSON.parse(dosya).veri;
    const depo=bellekDeposu();depo.yaz('e',dosya);
    const y=kariyerYukle(depo,'e'),c=y.kariyer;
    const ayni=y.tamam&&eski.kayitSurumu===4&&y.gecisler.join()==='4→5'&&['hareketler','gecmis','kulupler','isler','meseleler','kisiler','olaylar','kosullar','rastlanti','sozler','haberler','icerik'].every(a=>metin(c[a])===metin(eski[a]))&&c.tarih===eski.tarih;
    denetle(`${ad}: açıldı ve 4→5 dönüştü; para, geçmiş, işler, mesele, söz ve haber aynı; gözlem yok`,ayni&&c.gozlem===null,y.tamam?an(c):y.hata);
    if(!y.tamam)continue;
    const s=yurut(kariyerOlustur(c),{koltukSecimi:'kisi-8',odemeSikismasi:['devret','kendin','maasGeciktir']});
    denetle(`${ad}: maç sınırına kadar oynandı; kasa eksiye düşmedi, kayıt geçerli`,macSinirinda(s)&&enDusukNakit(s)>=0&&gecerli(s)[0],`${an(s)} ${gecerli(s)[1]}`);
  }
}
denetle('Başlangıç verileri 2.7 denemelerinde de değişmedi',metin(BASLANGIC)===baslangicMetni&&metin(ORNEK)===ornekMetni);

/* ================= 2.8B: gözlemin gerçek zamanı ================= */
bolum('2.8B — gözlem oyun dakikası oyun dakikası: parçalı adım, kaydet–yükle ve durma');
{
  const [gozlemAc,gozlemAdim,kariyerKomut]=['gozlemAc','gozlemAdim','kariyerKomut'].map(al);
  /* ekranın yaptığı gibi: aralığı kur, sonra 1 dakikalık komutlarla (her biri doğrulanmış kopyada) ilerle; her n adımda kaydet–yükle */
  const adimAdim=(bas,dk,kayitAraligi)=>{
    let c=kariyerKomut(bas,x=>gozlemAc(x,dk)).kariyer,r={neden:'devam'},n=0,kayit=0;
    if(c.gunIciDakika!==bas.gunIciDakika||!gozlemAcik(c))return{c,r:{neden:'açılmadı'},n,kayit};
    while(r.neden==='devam'&&n<2000){
      const s=kariyerKomut(c,x=>gozlemAdim(x,1));c=s.kariyer;r=s.sonuc;n++;
      if(kayitAraligi&&n%kayitAraligi===0&&r.neden==='devam'){const depo=bellekDeposu();kariyerKaydet(depo,'g',c);c=kariyerYukle(depo,'g').kariyer;kayit++;}
    }
    return{c,r,n,kayit};
  };
  const d=saate(tamBasla('duzenli',undefined,'kisi-8'),'2026-11-23',900);
  const ac=kariyerOlustur(d);gozlemAc(ac,120);
  denetle('gozlemAc aralığı kurar, zamanı ilerletmez; kayıt geçerli',an(ac)==='2026-11-23 15:00'&&gozlemAcik(ac)&&gozlemKalan(ac)===120&&gecerli(ac)[0],gecerli(ac)[1]);
  const tek=kariyerOlustur(d),rt=gozlemBaslat(tek,120),p=adimAdim(d,120,0),pk=adimAdim(d,120,15);
  denetle('Sakin gün: 120 adımlık gözlem tek parça gözlemle aynı kariyeri verir (geçmiş ve not dahil)',metin(p.c)===metin(tek)&&p.n===120&&p.r.neden==='bitti'&&rt.neden==='bitti'&&p.r.not===rt.not&&!!p.r.not,`${p.n} adım · ${p.r.neden}`);
  denetle('Adımlar arasında her 15 dakikada kaydet–yükle sonucu değiştirmez',metin(pk.c)===metin(tek)&&pk.kayit===7,`${pk.kayit} kayıt`);
  const yarim=adimAdim(d,30,0);
  denetle('Kısa gözlem kendi süresinde biter',an(yarim.c)==='2026-11-23 15:30'&&yarim.n===30&&yarim.r.neden==='bitti'&&gozlemKayitlari(yarim.c).length===1);
  /* Perşembe 15:00: gazete 16:00'da arar */
  const b=yurut(tamBasla('sikisik','nakitSikisik',undefined,'yok'),{koltukSecimi:'kisi-8',destekTeklifi:'reddet',nakitTakvimi:'bekle',odemeSikismasi:'dur'});
  ajandaIsiYap(b,kararIsi(b,'odemeSikismasi').id,'maasGeciktir');saate(b,'2026-11-26',900);
  const tb=kariyerOlustur(b),rb=gozlemBaslat(tb,120),pb=adimAdim(b,120,10);
  denetle('Karar gerektiren haberde parçalı gözlem de aynı anda durur; dünya tek parçayla aynı, kalan süre korunur',metin(pb.c)===metin(tb)&&pb.r.neden==='karar'&&rb.neden==='karar'&&pb.n===60&&gozlemKalan(pb.c)===60,`${an(pb.c)} · ${pb.r.neden} · ${pb.n} adım`);
  const bi=kararIsi(pb.c,'basinSorusu');
  denetle('Haberde durunca karar beklerken uzun iş engeli sürer',/tam dikkat/.test(ajandaOnizle(pb.c,bi.id,'kendin').engel.join()));
  let y=kariyerOlustur(pb.c);ajandaIsiYap(y,bi.id,'devret');
  const ty=kariyerOlustur(y);gozlemSurdur(ty);
  let r={neden:'devam'},n=0;while(r.neden==='devam'){const s=kariyerKomut(y,x=>gozlemAdim(x,1));y=s.kariyer;r=s.sonuc;n++;}
  denetle('Kısa iş gözlemin içinde geçer; kalan 45 dakika adım adım sürdürülür, süre iki kez sayılmaz',metin(y)===metin(ty)&&n===45&&gozlemKayitlari(y)[0].izlenen===120&&an(y)==='2026-11-26 17:00',`${n} adım`);
  const odeme=c=>c.hareketler.map(h=>h.kaynak).filter(Boolean);
  denetle('Parçalı gözlemde ödeme ya da olay iki kez uygulanmaz',new Set(odeme(y)).size===odeme(y).length&&metin(Object.keys(y.olaylar))===metin(Object.keys(ty.olaylar)));
  denetle('Gözlem açık değilken adım reddedilir; geçersiz adım reddedilir',reddeder(()=>gozlemAdim(kariyerOlustur(d),1))&&reddeder(()=>gozlemAdim(kariyerOlustur(ac),0)));
}

/* ================= 2.8H: iki cevaplı kararlar (içerik sürümü 3) ================= */
bolum('2.8H — yeni kariyer: içerik sürümü 3, aynı devralınan koşullar, sıralı aday görüşmesi');
const ESKI_TURLER=['koltukSecimi','odemeSikismasi','anlasmaDegerlendirme','nakitTakvimi','hocaTalebi','hocaGorusmesi','basinSorusu','destekTeklifi','sponsorGecikmesi','sponsorIndirimi'];
const [ikiSecenek,zamanAsimiVar]=['ikiSecenek','zamanAsimiVar'].map(al);
const yeniBasla=(baslangic,sponsor,sayman,hoca,tohum)=>kariyerBaslat({tohum:tohum===undefined?7:tohum,baslangic,sponsor,sayman,hoca});
const secenekIdleri=(c,id)=>ajandaOnizle(c,id).secenekler.map(s=>s.id).join();
/* bugün katılınması gereken randevu (karar olmayan, saati gelmiş, engeli olmayan): aday görüşmesi gibi */
const randevu=c=>ajandaGunu(c,c.tarih).find(r=>r.tur==='ajanda'&&r.durum==='bekliyor'&&!r.karar&&!r.eylem&&!r.saatsiz&&r.saat<=c.gunIciDakika&&r.zorunluluk!=='istege'&&!ajandaOnizle(c,r.id).engel.length);
/* yeni içerikle oyna: secimler[karar türü] seçenek kimliği, öncelik listesi, işlev (c, iş) → kimlik, null (dokunma) ya da 'dur'. Engel randevudan geliyorsa randevuya katılınır */
function yurut3(c,secimler={},ara){
  for(let n=0;n<160;n++){
    if(bugunkuKararlar(c).some(r=>secimler[r.karar]==='dur'))break;
    const r=bugunkuKararlar(c).find(r=>secimler[r.karar]!==null&&uygunSecenekler(c,r.id).length);
    if(r){
      const S=uygunSecenekler(c,r.id),t=secimler[r.karar],ist=[].concat(typeof t==='function'?t(c,c.isler[r.id]):t||[]);
      ajandaIsiYap(c,r.id,(ist.map(i=>S.find(s=>s.id===i)).find(Boolean)||S[0]).id);
    }else{
      /* saati gelen randevuya (zorunlu ya da ertelenebilir aday görüşmesi) katılır; yoksa ilerler */
      const rv=randevu(c);
      if(rv)ajandaIsiYap(c,rv.id);else if(ilerleOnizle(c).engel.length)break;else duragaIlerle(c);
    }
    if(ara)c=ara(c);
  }
  return c;
}
const adayAl=id=>(c,is)=>is.veri.kisiId===id?'al':['sonraki','bos'];
const koltuklar=c=>Object.entries(c.kulupler.demirkapi.yonetim).map(([a,b])=>a+':'+(b||'boş')).join(' ');
{
  const y=yeniBasla('sikisik','pazarlik'),e=tamBasla('sikisik','pazarlik',undefined,'yok');
  const t3=[];for(let t=1;t<=40;t++)t3.push(kariyerBaslat({tohum:t}));
  denetle('Yeni kariyer içerik sürümü 3 ile kurulur; aynı tohumda devralınan koşullar eski sürümle aynı (önceki dört çekiliş değişmez)',
    t3.every((c,i)=>{const o=kariyerBaslat({tohum:i+1,icerik:2});return c.icerik.surum===3&&c.icerik.baslangic===o.icerik.baslangic&&metin(c.kosullar)===metin(o.kosullar)&&gecerli(c)[0];})
    &&t3.every((c,i)=>metin(c)===metin(kariyerBaslat({tohum:i+1}))));
  const ilk=c=>{const r=Object.values(c.isler).find(x=>x.veri.etki==='adayGorusmesi'&&x.veri.koltuk==='sayman');return r?r.veri.adaylar[0]:null;};
  denetle('Aday görüşme sırası tohuma göre değişir (ezber sıra yok); geçersiz içerik sürümü reddedilir',new Set(t3.map(ilk).filter(Boolean)).size===3&&reddeder(()=>kariyerBaslat({tohum:7,icerik:1})),[...new Set(t3.map(ilk).filter(Boolean))].join());
  denetle('Kulüp dışı muhataplar (sponsor temsilcisi, gazete muhabiri) yeni kariyerde kişi olarak var; eski sürümde yok',y.kisiler['kisi-14'].rol==='sponsorTemsilcisi'&&y.kisiler['kisi-15'].rol==='muhabir'&&!e.kisiler['kisi-14']&&y.sonrakiNo.kisi===16);
  const rv=Object.values(y.isler).find(x=>x.veri.etki==='adayGorusmesi');
  denetle('Başlangıçta karar yok: sayman görüşmesi bir randevudur (katılım etkisi), nakit takvimi henüz kurulmaz',!!rv&&!rv.veri.karar&&rv.veri.zorunluluk==='zorunlu'&&!Object.values(y.isler).some(x=>x.veri.karar)&&!Object.keys(y.meseleler).length,koltuklar(y));
  const b=kariyerOlustur(y);duragaIlerle(b);ajandaIsiYap(b,rv.id);
  const k1=kararIsi(b,'adayGorusmesi'),m=Object.values(b.meseleler)[0];
  denetle('Randevuya katılınca koltuk meselesi açılır, ilk adayın kartı gelir: [Göreve al] / [Sıradaki adayı dinle]',!!k1&&secenekIdleri(b,k1.id)==='al,sonraki'&&m.tur==='koltuk'&&k1.veri.kisiId===rv.veri.adaylar[0]&&an(b)==='2026-11-23 10:30'&&k1.veri.saatsiz,secenekIdleri(b,k1.id));
  const b2=kariyerOlustur(b);ajandaIsiYap(b2,k1.id,'sonraki');const k2=kararIsi(b2,'adayGorusmesi');ajandaIsiYap(b2,k2.id,'sonraki');const k3=kararIsi(b2,'adayGorusmesi');
  denetle('Sıradakini dinlemek 30 dakika sürer; son adayda [Göreve al] / [Koltuğu boş bırak]',an(b2)==='2026-11-23 11:30'&&k3.veri.sira===2&&secenekIdleri(b2,k3.id)==='al,bos'&&!b2.kulupler.demirkapi.yonetim.sayman);
  const bos=kariyerOlustur(b2);ajandaIsiYap(bos,k3.id,'bos');
  denetle('Koltuk boş kalabilir: mesele kapanır, nakit takvimi kurulmaz, geri çevrilen adaylar kulüpte kalır',!bos.kulupler.demirkapi.yonetim.sayman&&bos.meseleler[m.id].durum==='kapandi'&&!kararIsi(bos,'nakitOnerisi')&&rv.veri.adaylar.every(id=>bos.kisiler[id].durum==='aktif')&&gecerli(bos)[0],gecerli(bos)[1]);
  const al=kariyerOlustur(b);ajandaIsiYap(al,k1.id,'al');const nk=kararIsi(al,'nakitOnerisi');
  denetle('Göreve alınan sayman ertesi gün 14:00 için nakit takvimi randevusu ister: [sponsoru bugün ara] / [tahsilat bundan sonra sende]',al.kulupler.demirkapi.yonetim.sayman===rv.veri.adaylar[0]&&!!nk&&nk.tarih==='2026-11-24'&&nk.dakika===840
    &&nk.veri.soran===rv.veri.adaylar[0]&&secenekIdleri(al,nk.id)==='takip,kalici'&&al.meseleler[m.id].durum==='kapandi',`${nk&&nk.tarih} · ${nk&&secenekIdleri(al,nk.id)}`);
  const ra=yeniBasla('rahat','pazarlik','kisi-8','yok'),brv=Object.values(ra.isler).find(x=>x.veri.etki==='adayGorusmesi');
  denetle('Rahat başlangıçta basın sözcüsü görüşmesi ertelenebilir bir randevudur (karar değil; erteleme randevunun işidir)',koltuklar(ra)==='sayman:kisi-8 futbol:kisi-3 basin:boş'&&brv.veri.koltuk==='basin'&&brv.veri.zorunluluk==='ertelenebilir'&&brv.veri.adaylar.length===3);
}

bolum('2.8H — ödeme sıkışması: koşula göre seçilen iki cevap, hazır görüş, cevapsız kalma');
{
  const kriz3=(durum,sayman)=>yurut3(yeniBasla('sikisik',durum,undefined,'yok'),{adayGorusmesi:adayAl(sayman),destekCevabi:'kucult',nakitOnerisi:null,odemeYolu:'dur',basinCevabi:'kendin'});
  /* destek teklifi kabul edilirse açık kapanabilir; burada küçük destek: kriz yine doğar */
  const c=kriz3('nakitSikisik','kisi-8'),ki=kararIsi(c,'odemeYolu'),oz=meseleOzeti(c,ki.veri.meseleId);
  denetle('Kriz kartı: saymanlı başlangıçta [kendin görüş] / [sayman görüşsün]; karar telefonda saymanın konuşmasındadır',!!ki&&secenekIdleri(c,ki.id)==='kendin,devret'&&ki.veri.soran==='kisi-8'&&ki.veri.zorunluluk==='zorunlu'&&!ki.veri.bekleyebilir,
    `${an(c)} · ${secenekIdleri(c,ki.id)}`);
  denetle('Saymanın görüşü karar gelirken hazır bilgi olarak dosyada (kaynağıyla); "Görüş iste" ayrı karar düğmesi yok',oz.bilgiler.some(b=>b.kaynak==='Hikmet Aydın'&&/Görüşü/.test(b.metin))&&tavsiyeOnizle(c,ki.id)===null,oz.bilgiler.map(b=>b.kaynak).join());
  const bos=yurut3(yeniBasla('sikisik','nakitSikisik',undefined,'yok'),{adayGorusmesi:(x,is)=>is.veri.sira<2?'sonraki':'bos',destekCevabi:'kucult',odemeYolu:'dur'}),kb=kararIsi(bos,'odemeYolu');
  denetle('Sayman koltuğu boşsa kriz kartı: [kendin görüş] / [tribün onarımının taksitini ertelet]; telefonda soran yok, karar dosyada',!!kb&&secenekIdleri(bos,kb.id)==='kendin,bakimErtele'&&kb.veri.soran===undefined,kb&&secenekIdleri(bos,kb.id));
  const sn=kriz3('pazarlik','kisi-10');ajandaIsiYap(sn,kararIsi(sn,'odemeYolu').id,'devret');duragaIlerle(sn);const k2=kararIsi(sn,'odemeYolu');
  denetle('Görüşme sonuçsuz kalınca kart döner ve açığın kulüp içinde nasıl kapanacağını sorar: [bakımı ertelet] / [maaşı beklet]',!!k2&&secenekIdleri(sn,k2.id)==='bakimErtele,maasGeciktir'&&k2.veri.denenen.join()==='devret',k2&&secenekIdleri(sn,k2.id));
  const kp=kriz3('pazarlik','kisi-8');ajandaIsiYap(kp,kararIsi(kp,'odemeYolu').id,'kendin');const tk=kararIsi(kp,'odemeTeklifi');
  denetle('Kendin görüşünce pazarlık arayan sponsor pano ister; teklif sponsor temsilcisinin konuşmasında iki cevaplıdır',!!tk&&secenekIdleri(kp,tk.id)==='kabul,ret'&&tk.veri.soran==='kisi-14');
  const ret=kariyerOlustur(kp);ajandaIsiYap(ret,tk.id,'ret');
  denetle('Teklif reddedilince kart [bakımı ertelet] / [maaşı beklet] olarak döner',secenekIdleri(ret,kararIsi(ret,'odemeYolu').id)==='bakimErtele,maasGeciktir');

  const rh=yurut3(yeniBasla('rahat','pazarlik','kisi-8','yok'),{adayGorusmesi:adayAl('kisi-11'),ertelemeTalebi:'dur'}),ei=kararIsi(rh,'ertelemeTalebi');
  denetle('Rahat başlangıç: acil olmayan talep [Hikmet Aydın konuşsun] / [%2 bedeli iste]; bekleyebilir, son cevap iki gün sonra 18:00, soran sponsor temsilcisi',!!ei&&secenekIdleri(rh,ei.id)==='devret,bedel'&&ei.veri.bekleyebilir&&zamanAsimiVar(ei)
    &&`${ei.tarih} ${saatYazi(ei.dakika)}`==='2026-11-27 18:00'&&ei.veri.soran==='kisi-14'&&!ilerleOnizle(rh).engel.length,`${an(rh)} · ${ei&&secenekIdleri(rh,ei.id)}`);
  const cv=kariyerOlustur(rh),r1=duragaIlerle(cv),o1=ilerleOnizle(cv);
  denetle('Cevap verilmezse ilerleme son cevap anında bir kez durur; sonraki ilerleme kararı “cevapsız kalacak” diye bildirir (engel değil)',r1.neden==='sonCevap'&&an(cv)==='2026-11-27 18:00'&&!!cv.isler[ei.id]&&!o1.engel.length&&o1.cevapsiz.length===1&&o1.cevapsiz[0].id===ei.id,`${r1.neden} · ${o1.neden}`);
  duragaIlerle(cv);const g=cv.gecmis.find(x=>x.isId===ei.id),ol=Object.values(cv.olaylar).find(o=>o.paket==='odemeSikismasi');
  denetle('Süre dolunca kartta yazan sonuç işler: erteleme kabul edilmiş sayılır, taksit bir kez ve ertelenen günde; kayıtta cevapsız yazar',g&&g.sonuc.durum==='cevapsiz'&&/cevap vermedin/.test(g.sonuc.bilgi)&&ol.sonuc.cozum==='cevapsiz'
    &&Object.values(cv.isler).filter(x=>x.veri.kalem==='sponsor').length===1&&Object.values(cv.isler).find(x=>x.veri.kalem==='sponsor').tarih==='2026-12-10'&&gecerli(cv)[0],gecerli(cv)[1]);
  const uz=kariyerOlustur(rh),o2=ajandaOnizle(uz,ei.id,'devret');
  denetle('Zorunlu kriz kararı cevapsız kalamaz: ilerleme engellenir',!!ilerleOnizle(c).engel.length&&!zamanAsimiVar(kararIsi(c,'odemeYolu'))&&!o2.engel.length);
}

bolum('2.8H — hoca, basın ve destek: koşula göre iki cevap; tek eylemli görüşme karar değil');
{
  const rk=yurut3(yeniBasla('rahat','pazarlik','kisi-8','kamp'),{adayGorusmesi:adayAl('kisi-11'),ertelemeTalebi:'bedel',kampTalebi:'dur'}),hk=kararIsi(rk,'kampTalebi');
  denetle('Kasa yetiyorsa kamp talebi [onayla, bugün öde] / [bu maç olmaz]; Necati Uysal\'ın görüşü hazır, soran hoca',!!hk&&secenekIdleri(rk,hk.id)==='onayla,reddet'&&hk.veri.soran==='kisi-2'
    &&meseleOzeti(rk,hk.veri.meseleId).bilgiler.some(b=>b.kaynak==='Necati Uysal'),hk&&secenekIdleri(rk,hk.id));
  /* küçük destek açığı kapatmaz: kriz kararı beklerken Perşembe hocanın talebi gelir */
  const dar=yurut3(yeniBasla('sikisik','nakitSikisik',undefined,'kamp'),{adayGorusmesi:adayAl('kisi-8'),destekCevabi:'kucult',nakitOnerisi:null,odemeYolu:null,kampTalebi:'dur'});
  zamanIlerlet(dar,1440+300);const hd=kararIsi(dar,'kampTalebi');
  denetle('Kasa maaş gününü çıkaramıyorsa: [takım lokalde toplansın, masrafsız] / [bu maç olmaz]',!!hd&&secenekIdleri(dar,hd.id)==='lokal,reddet',hd&&`${an(dar)} · ${secenekIdleri(dar,hd.id)}`);
  const lk=kariyerOlustur(dar);ajandaIsiYap(lk,hd.id,'lokal');
  denetle('Lokal cevabı para çıkarmaz, sonucu kayıtlıdır',Object.values(lk.olaylar).find(o=>o.paket==='hocaTalebi').sonuc.cozum==='lokal'&&!Object.values(lk.isler).some(x=>x.veri.kalem==='kamp')&&gecerli(lk)[0]);
  const cz=yurut3(kariyerOlustur(rk),{kampTalebi:null,basinCevabi:'kendin'});
  denetle('Kamp talebi cevapsız kalırsa hoca takımı maç günü toplar (kayıtta cevapsız)',Object.values(cz.olaylar).find(o=>o.paket==='hocaTalebi').sonuc.cozum==='cevapsiz'&&macSinirinda(cz)&&!cz.hareketler.some(h=>h.kalem==='kamp'));

  /* sayman görüşür (bedel işletilir ama açık sürer), kart döner, maaş bekletilir: gazete bunu sorar */
  const bs=yurut3(yeniBasla('sikisik','pazarlik',undefined,'yok'),{adayGorusmesi:adayAl('kisi-8'),destekCevabi:'kucult',nakitOnerisi:null,odemeYolu:['devret','maasGeciktir'],basinCevabi:'dur'}),bi=kararIsi(bs,'basinCevabi');
  denetle('Basın sorusu: sözcü varken [kendin konuş] / [Sevim Kara açıklasın]; soran gazete muhabiri; baskı saatine kadar bekleyebilir',!!bi&&secenekIdleri(bs,bi.id)==='kendin,devret'&&bi.veri.soran==='kisi-15'&&bi.veri.bekleyebilir&&saatYazi(bi.dakika)==='18:30',bi&&secenekIdleri(bs,bi.id));
  const sz=kariyerOlustur(bs);sz.kisiler['kisi-4'].durum='ayrildi';sz.kulupler.demirkapi.yonetim.basin=null;
  denetle('Sözcü yokken basın sorusu: [kendin konuş] / [“yorum yok” de]',secenekIdleri(sz,bi.id)==='kendin,yorumYok');
  const yy=kariyerOlustur(sz);ajandaIsiYap(yy,bi.id,'yorumYok');const yyy=yurut3(yy,{});
  const sess=yurut3(kariyerOlustur(bs),{basinCevabi:null});
  denetle('“Yorum yok” ve cevapsız kalma farklı manşet üretir; ikisi de kayıtlı olaydan',/Yorum yok/.test(haberMetni(yyy,yyy.haberler[0]))&&/cevapsız/.test(haberMetni(sess,sess.haberler[0]))&&Object.values(sess.olaylar).find(o=>o.paket==='basinSorusu').sonuc.basin==='sessiz',
    haberMetni(yyy,yyy.haberler[0]));

  const ds=yurut3(yeniBasla('sikisik','pazarlik',undefined,'yok'),{adayGorusmesi:adayAl('kisi-9'),destekCevabi:'dur'}),di=kararIsi(ds,'destekCevabi');
  denetle('Destek teklifi [kabul, pano onların] / [küçük destek]; teklif sahibi saymansa saymanın görüşü yazılmaz (çıkar çatışması)',!!di&&secenekIdleri(ds,di.id)==='kabul,kucult'&&di.veri.soran==='kisi-9'
    &&!meseleOzeti(ds,di.veri.meseleId).bilgiler.some(b=>/Görüşü/.test(b.metin)),di&&secenekIdleri(ds,di.id));
  const pn=kariyerOlustur(ds);al('sozVer')(pn,{muhatap:'sponsor',anahtar:'soz.pano'});
  denetle('Pano sponsora söz verildiyse destek: [küçük destek] / [teşekkür et, reddet] (kapalı cevap gösterilmez)',secenekIdleri(pn,di.id)==='kucult,reddet');
  const dc=yurut3(kariyerOlustur(ds),{destekCevabi:null,nakitOnerisi:null,odemeYolu:['devret','bakimErtele'],odemeTeklifi:'ret',basinCevabi:'kendin'});
  denetle('Destek teklifi cevapsız kalırsa düşer: para gelmez, hak verilmez',Object.values(dc.olaylar).find(o=>o.paket==='kosulluDestek').sonuc.cozum==='cevapsiz'&&!dc.hareketler.some(h=>h.kalem==='destek')&&!Object.values(dc.sozler).some(s=>s.anahtar==='soz.destekPano'));

  const g1=yeniBasla('rahat','pazarlik','kisi-8','kamp');girisimBaslat(g1,'hocaGorusmesi');const gr=Object.values(g1.isler).find(x=>x.veri.etki==='hocaGorusmesi');
  const gb=ajandaIsiYap(g1,gr.id);
  denetle('Hocayla görüşme karar değil, katılınan randevudur; talep varsa erkenden açılır ve kamp kartı iki cevaplı gelir',!!gr&&!gr.veri.karar&&/isteğini açtı/.test(gb.find(x=>x.isId===gr.id).sonuc.bilgi)&&!!kararIsi(g1,'kampTalebi')&&gecerli(g1)[0],gecerli(g1)[1]);
  const g2=yeniBasla('rahat','pazarlik','kisi-8','kamp');girisimBaslat(g2,'nakitTakvimi');const nt=kararIsi(g2,'nakitOnerisi');
  denetle('Nakit takvimi girişimi yeni içerikte iki cevaplı karar kurar; soran sayman',!!nt&&secenekIdleri(g2,nt.id)==='takip,kalici'&&nt.veri.soran==='kisi-8'&&!kararIsi(g2,'nakitTakvimi'));
}

bolum('2.8H — bütün yeni karar yolları: tam iki geçerli cevap, eski tür yok, kasa ve kayıt tutarlı');
{
  const say={yol:0,engel:0,eksi:0,gecersiz:0,sinir:0,ikiDegil:0,eski:0,karar:0,turler:new Set(),sonuc:new Set(),ornek:'',cevapsiz:0};
  const SINIR=1500;let kok=0;
  function dolas3(c,derinlik){
    if(derinlik>80){say.engel++;return;}
    for(const r of bugunkuKararlar(c)){
      const t=c.isler[r.id].veri.karar,S=ajandaOnizle(c,r.id).secenekler;say.karar++;say.turler.add(t);
      if(ESKI_TURLER.includes(t))say.eski++;
      if(S.length!==2||S.some(s=>s.engel)){say.ikiDegil++;if(!say.ornek)say.ornek=`${t}: ${S.map(s=>s.id+(s.engel?'('+s.engel+')':'')).join(',')}`;}
    }
    const K=bugunkuKararlar(c).filter(r=>uygunSecenekler(c,r.id).length),dallar=[];
    if(K.length)for(const s of uygunSecenekler(c,K[0].id))dallar.push(x=>ajandaIsiYap(x,K[0].id,s.id));
    const o=ilerleOnizle(c),rv=K.length?null:randevu(c);
    if(rv)dallar.push(x=>ajandaIsiYap(x,rv.id));
    if(!o.engel.length&&!K.some(r=>r.zorunluluk==='zorunlu'&&!c.isler[r.id].veri.bekleyebilir))dallar.push(x=>duragaIlerle(x));
    if(!dallar.length){
      say.yol++;
      if(!macSinirinda(c))say.engel++;
      if(enDusukNakit(c)<0)say.eksi++;
      if(!gecerli(c)[0])say.gecersiz++;
      say.cevapsiz+=c.gecmis.filter(g=>g.sonuc&&g.sonuc.durum==='cevapsiz').length?1:0;
      say.sonuc.add(meseleTurleri(c)+'/'+metin(Object.values(c.olaylar).map(o=>o.sonuc))+'/'+koltuklar(c));
      return;
    }
    const L=say.yol-kok>=SINIR?(say.sinir++,dallar.slice(0,1)):dallar;
    for(const f of L){const y=kariyerOlustur(c);f(y);dolas3(y,derinlik+1);}
  }
  const kokler=[];
  for(const d of ['nakitSikisik','pazarlik'])for(const hc of ['kamp','yok'])kokler.push(yeniBasla('sikisik',d,undefined,hc));
  for(const d of ['nakitSikisik','pazarlik'])for(const s of ['kisi-8','kisi-9','kisi-10'])kokler.push(yeniBasla('rahat',d,s,'kamp'));
  kokler.push(yeniBasla('duzenli',undefined,'kisi-8'),yeniBasla('sikisik','pazarlik',undefined,'kamp',11),yeniBasla('sikisik','nakitSikisik',undefined,'kamp',23));
  for(const b of kokler){kok=say.yol;dolas3(b,0);}
  denetle('Her karar noktasında tam iki geçerli cevap var; eski çok seçenekli türler yeni kariyerde hiç doğmuyor',say.karar>1000&&!say.ikiDegil&&!say.eski,
    `${say.karar} karar görünümü · türler: ${[...say.turler].sort().join(', ')}${say.ornek?' · ilk aykırı: '+say.ornek:''}`);
  denetle('Bütün yeni yollar maç sınırına varır: kasa eksiye düşmez, kayıt geçerli kalır; cevapsız kalma da bir yol',say.yol>1000&&!say.engel&&!say.eksi&&!say.gecersiz&&say.cevapsiz>0,
    `${say.yol} yol · ${say.sonuc.size} farklı sonuç · cevapsız kalan yol ${say.cevapsiz} · takılan ${say.engel} · eksi kasa ${say.eksi} · geçersiz ${say.gecersiz}${say.sinir?` · başlangıç başına ${SINIR} yoldan sonra ${say.sinir} noktada yalnız ilk seçenek izlendi (örnekleme)`:''}`);
  const S={adayGorusmesi:adayAl('kisi-9'),destekCevabi:'kucult',odemeYolu:['devret','kendin','maasGeciktir'],odemeTeklifi:'ret',basinCevabi:'devret'};
  const a1=yurut3(yeniBasla('sikisik','nakitSikisik',undefined,'kamp'),S),a2=yurut3(yeniBasla('sikisik','nakitSikisik',undefined,'kamp'),S);
  const depo=bellekDeposu(),ara=x=>{const s=kariyerKaydet(depo,'oyun-1',x);if(!s.tamam)throw new Error(s.hata);return kariyerYukle(depo,'oyun-1').kariyer;};
  denetle('Aynı başlangıç ve seçimler aynı kariyeri verir; her komuttan sonra kaydet/yükle sonucu değiştirmez',metin(a1)===metin(a2)&&metin(yurut3(yeniBasla('sikisik','nakitSikisik',undefined,'kamp'),S,ara))===metin(a1)&&macSinirinda(a1)&&gecerli(a1)[0],an(a1));
  const c=yurut3(yeniBasla('sikisik','pazarlik'),{adayGorusmesi:adayAl('kisi-8'),destekCevabi:'kucult',nakitOnerisi:null,odemeYolu:'dur'}),once=metin(c),kid=kararIsi(c,'odemeYolu').id;
  for(let i=0;i<3;i++){for(const s of ajandaOnizle(c,kid).secenekler){ajandaOnizle(c,kid,s.id);testOnizleme(c,kid,s.id);}meseleOzeti(c,kararIsi(c,'odemeYolu').veri.meseleId);ilerleOnizle(c);donusOzeti(c);}
  denetle('Okuma, önizleme ve test önizlemesi yeni içerikte de kariyeri ve rastlantıyı değiştirmez',metin(c)===once);
  denetle('ikiSecenek: kapalı seçenek seçilmez, koşula uyan ilk çift döner',ikiSecenek([{id:'a',engel:'x'},{id:'b'},{id:'c'}],[['a','b'],['b','c']]).map(s=>s.id).join()==='b,c');
}
denetle('Başlangıç verileri 2.8H denemelerinde de değişmedi',metin(BASLANGIC)===baslangicMetni&&metin(ORNEK)===ornekMetni);

bolum('2.8H — içerik sürümü 3 kayıtları (araclar/ornekler/kayit-s5-*): açılır, iki cevapla sürer, cevapsız kalma bir kez işler');
{
  const ORN=[['aday-karti','adayGorusmesi'],['kriz-iki-cevap','odemeYolu'],['cevapsiz-son-an','ertelemeTalebi']];
  for(const [ad,tur] of ORN){
    const dosya=fs.readFileSync(path.join(KOK,'araclar','ornekler',`kayit-s5-${ad}.json`),'utf8'),eski=JSON.parse(dosya).veri;
    const depo=bellekDeposu();depo.yaz('e',dosya);
    const y=kariyerYukle(depo,'e'),c=y.kariyer,ki=y.tamam&&kararIsi(c,tur);
    denetle(`${ad}: dönüşümsüz açıldı (sürüm 5, içerik 3); bekleyen karar iki cevaplı`,y.tamam&&!y.gecisler.length&&c.icerik.surum===3&&metin(c)===metin(eski)&&!!ki&&ajandaOnizle(c,ki.id).secenekler.length===2,y.tamam?`${an(c)} · ${ki&&secenekIdleri(c,ki.id)}`:y.hata);
    if(!y.tamam)continue;
    if(ad==='cevapsiz-son-an'){
      const o=ilerleOnizle(c),cc=kariyerOlustur(c);duragaIlerle(cc);const g=cc.gecmis.filter(x=>x.isId===ki.id);
      denetle('Son cevap anında kaydedilmiş kayıttan ilerlenince karar bir kez cevapsız kapanır; tekrar yükleme ikinci kez uygulamaz',
        o.cevapsiz.length===1&&g.length===1&&g[0].sonuc.durum==='cevapsiz'&&metin(kariyerYukle((()=>{const d=bellekDeposu();kariyerKaydet(d,'x',cc);return d;})(),'x').kariyer)===metin(cc),`${g.length} kayıt`);
    }
    const s=yurut3(kariyerOlustur(c),{adayGorusmesi:adayAl('kisi-8'),odemeYolu:['devret','maasGeciktir'],odemeTeklifi:'ret',ertelemeTalebi:'bedel'});
    denetle(`${ad}: kaldığı yerden maç sınırına kadar oynandı; eski tür doğmadı, kasa eksiye düşmedi`,macSinirinda(s)&&gecerli(s)[0]&&enDusukNakit(s)>=0
      &&s.gecmis.some(g=>g.sonuc&&g.sonuc.karar)&&!s.gecmis.some(g=>g.sonuc&&ESKI_TURLER.includes(g.sonuc.karar)),`${an(s)} ${gecerli(s)[1]}`);
  }
}

/* ================= 2.8I/2.8K: telefondaki kişi konuşmaları (okuma modeli) ================= */
bolum('2.8I — kişi konuşmaları: gönderen, giden cevap, okundu ile cevaplandı; okumak kariyeri değiştirmez');
{
  const konusmaListesi=al('konusmaListesi'),meseleGoruldu=al('meseleGoruldu');
  const c=yurut3(yeniBasla('sikisik','pazarlik',undefined,'kamp'),{adayGorusmesi:adayAl('kisi-8'),destekCevabi:'kucult',nakitOnerisi:null,odemeYolu:'dur'});
  const once=metin(c),L=konusmaListesi(c),ad=id=>L.find(x=>x.anahtar===id);
  for(let i=0;i<3;i++)konusmaListesi(c);
  denetle('Konuşma listesi okuma modelidir: kariyeri ve rastlantıyı değiştirmez',metin(c)===once);
  denetle('Mesajlar gerçek gönderenden: sponsorun haberi temsilcinin, destek teklifi destekçinin konuşmasında; kendi ağzından yazılmış',
    /babam selam/.test(ad('kisi-14').mesajlar[0].metin)&&ad('kisi-9').mesajlar.some(m=>m.yon==='gelen'&&/firma olarak/.test(m.metin)),ad('kisi-14').mesajlar[0].metin);
  denetle('Kararın iki cevabı soranın (sayman) konuşmasında; cevap bekleyen konuşma listede önde; yüz yüze aday görüşmesi telefonda yok',
    ad('kisi-8').kararlar.length===1&&L[0].anahtar==='kisi-8'&&L[0].cevapBekliyor&&!L.some(x=>x.meseleler.includes(Object.values(c.meseleler).find(m=>m.tur==='koltuk').id)),L.map(x=>x.ad).join(', '));
  denetle('Verilen cevap giden mesaj olarak destekçinin konuşmasında; sonuç satırı not olarak',ad('kisi-9').mesajlar.some(m=>m.yon==='giden'&&/Küçük destek/.test(m.metin))&&ad('kisi-9').mesajlar.some(m=>m.yon==='not'));
  const y=kariyerOlustur(c);for(const id of ad('kisi-14').meseleler)meseleGoruldu(y,id);
  const s=konusmaListesi(y).find(x=>x.anahtar==='kisi-14');
  denetle('Okundu ile cevaplandı ayrı: konuşmayı okumak yeni işaretini kaldırır, bekleyen karar sürer',ad('kisi-14').okunmamis>0&&s.okunmamis===0&&!!kararIsi(y,'odemeYolu'));
  denetle('Girişim ilgili kişinin konuşmasında öneri olarak durur (hocayla görüşme)',ad('kisi-2')&&ad('kisi-2').girisimler.some(g=>g.id==='hocaGorusmesi'));
  const e=hafta();
  denetle('Eski içerikte de konuşma listesi kurulur (gönderen kaydı olmayan olaylar not olur, hata vermez)',Array.isArray(konusmaListesi(e)));
}

bolum('2.8K — karakter ve hafıza: gerçek geçmişe gönderme yapan, cevap istemeyen kişi mesajları');
{
  const konusmaListesi=al('konusmaListesi');
  const hatiralar=c=>Object.values(c.meseleler).flatMap(m=>m.olaylar.filter(o=>o.anahtar.startsWith('hatira.')).map(o=>o.anahtar)).sort().join();
  const MESELE_OLAYLARI_METNI=(c,anahtar)=>{for(const m of Object.values(c.meseleler))for(const o of m.olaylar)if(o.anahtar===anahtar)return al('MESELE_OLAYLARI')[anahtar](c,o.p);return'';};
  const lk=yurut3(yeniBasla('sikisik','nakitSikisik',undefined,'kamp'),{adayGorusmesi:adayAl('kisi-9'),destekCevabi:'kucult',nakitOnerisi:null,odemeYolu:null,kampTalebi:'dur'});
  zamanIlerlet(lk,1440+300);ajandaIsiYap(lk,kararIsi(lk,'kampTalebi').id,'lokal');
  const lks=yurut3(lk,{odemeYolu:['devret','maasGeciktir'],odemeTeklifi:'ret'});
  const sk=konusmaListesi(lks).find(x=>x.anahtar==='kisi-2');
  denetle('Lokalde toplanan takımın hocası maç sabahı bunu hatırlatır; maaşı geciken personel sözü hatırlatır; küçük destek veren üye anonsu anar',
    hatiralar(lks)==='hatira.destek.anons,hatira.hoca.lokal,hatira.personel.soz'&&sk.mesajlar.some(m=>m.yon==='gelen'&&/Lokalde yattık/.test(m.metin))&&macSinirinda(lks),hatiralar(lks));
  const bs=yurut3(yeniBasla('sikisik','pazarlik',undefined,'yok'),{adayGorusmesi:adayAl('kisi-8'),destekCevabi:'kucult',nakitOnerisi:null,odemeYolu:['kendin','maasGeciktir'],odemeTeklifi:'ret',basinCevabi:null});
  denetle('Gazeteye cevap vermeyen başkana muhabir Cuma döner; mesaj gazetenin konuşmasında',/hatira\.basin\.sessiz/.test(hatiralar(bs))&&konusmaListesi(bs).find(x=>x.anahtar==='kisi-15').mesajlar.some(m=>/açmadınız/.test(m.metin)),hatiralar(bs));
  const d=yurut3(yeniBasla('duzenli',undefined,'kisi-8'),{});
  denetle('Sakin hafta sakin kalır: yaşanmış karar yoksa hatıra mesajı da yok',!hatiralar(d)&&macSinirinda(d)&&!Object.keys(d.meseleler).length);
  const r=yurut3(yeniBasla('rahat','pazarlik','kisi-9','kamp'),{adayGorusmesi:adayAl('kisi-11'),ertelemeTalebi:'devret',kampTalebi:'onayla'});
  denetle('Hatıra yalnız gerçekten olana bağlı: talebi geri çektiren saymanı sponsor anar, oteldeki kampı hoca anar; her biri bir kez',
    hatiralar(r)==='hatira.hoca.otel,hatira.sponsor.tam'&&/Tuncay Erbil/.test(MESELE_OLAYLARI_METNI(r,'hatira.sponsor.tam')),hatiralar(r));
}

/* ================= bozuk kopyalar ================= */
bolum('Bozuk kayıtlar yakalanmalı');
const ilerlemis=()=>{const c=yeni();zamanIlerlet(c,4*1440);return c;};   // hatırlatma, maaş ve sponsor işlenmiş
const sozlu=()=>{const c=yurut(tamBasla('rahat','pazarlik','kisi-8','kamp'),{koltukSecimi:'kisi-11',anlasmaDegerlendirme:'kabul',hocaTalebi:'dur'});ajandaIsiYap(c,kararIsi(c,'hocaTalebi').id,'soz');return c;};   // hocaya verilmiş açık söz
const krizde=()=>yurut(basla('sikisik','pazarlik'),{koltukSecimi:'kisi-8',nakitTakvimi:'bekle',odemeSikismasi:null});   // kriz açık, karar bekliyor
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
  ['Gelecekte işlenmiş hareket',ilerlemis,c=>{c.hareketler[0].tarih='2027-01-01';}],
  ['Ajanda: bilinmeyen zorunluluk',hafta,c=>{c.isler['is-5'].veri.zorunluluk='belki';}],
  ['Ajanda: olmayan kişi',hafta,c=>{c.isler['is-4'].veri.kisiId='kisi-99';}],
  ['Ajanda: eksi süre',hafta,c=>{c.isler['is-6'].veri.sure=-5;}],
  ['Ajanda: zorunlu işte son tarih',hafta,c=>{c.isler['is-4'].veri.sonTarih='2026-11-25';}],
  ['Ajanda: başlangıcı geçmiş fakat kaçırılmamış iş',hafta,c=>{c.gunIciDakika=602;}],
  ['Ajanda: bilinmeyen karar türü',hafta,c=>{c.isler['is-14'].veri.karar='yok';}],
  ['Karar: bilinmeyen koltuk',hafta,c=>{c.isler['is-14'].veri.koltuk='kaleci';}],
  ['Karar: olmayan aday',hafta,c=>{c.isler['is-14'].veri.adaylar.push('kisi-99');}],
  ['İş hem bekliyor hem iptal edilmiş',hafta,c=>{c.gecmis.push({tur:'iptal',isId:'is-3',isTuru:'odeme',tarih:c.tarih,dakika:c.gunIciDakika,baslik:'x',neden:''});}],
  ['Yönetim: olmayan kişi',hafta,c=>{c.kulupler.demirkapi.yonetim.sayman='kisi-99';}],
  ['Yönetim: aynı kişi iki koltukta',hafta,c=>{c.kulupler.demirkapi.yonetim.sayman='kisi-3';}],
  ['Yönetim: bilinmeyen koltuk',hafta,c=>{c.kulupler.demirkapi.yonetim.kaleci=null;}],
  ['Yönetim: aday rolündeki kişi koltukta',hafta,c=>{c.kulupler.demirkapi.yonetim.sayman='kisi-8';}],
  ['Kişi: bilinmeyen katkı seviyesi',hafta,c=>{c.kisiler['kisi-8'].katki.mali='harika';}],
  ['Mesele: liste yok',hafta,c=>{delete c.meseleler;}],
  ['Mesele: bilinmeyen durum',hafta,c=>{c.meseleler['mesele-1'].durum='belki';}],
  ['Mesele: olmayan meseleye bağlı iş',hafta,c=>{c.isler['is-3'].veri.meseleId='mesele-9';}],
  ['Mesele: açık fakat bekleyen adımı yok',hafta,c=>{delete c.isler['is-10'].veri.meseleId;delete c.isler['is-3'].veri.meseleId;}],
  ['Mesele: durumu bağlı işlerle tutmuyor',hafta,c=>{c.meseleler['mesele-1'].durum='ekipte';}],
  ['Mesele: kapanmış fakat bağlı iş bekliyor',hafta,c=>{c.meseleler['mesele-1'].durum='kapandi';c.meseleler['mesele-1'].kapanis={tarih:c.tarih,dakika:c.gunIciDakika};}],
  ['Mesele: gelecekte kalan olay',hafta,c=>{c.meseleler['mesele-1'].olaylar[0].tarih='2027-01-01';}],
  ['Mesele: bilinmeyen olay anahtarı',hafta,c=>{c.meseleler['mesele-1'].olaylar[0].anahtar='yok';}],
  ['Mesele: olmayan sorumlu',hafta,c=>{c.meseleler['mesele-1'].sorumluId='kisi-99';}],
  ['Mesele: görülen olay sayısı fazla',hafta,c=>{c.meseleler['mesele-1'].gorulen=5;}],
  ['Mesele: düşük sonrakiNo.mesele',hafta,c=>{c.sonrakiNo.mesele=1;}],
  ['Ajanda: saati serbest iş karar değil',hafta,c=>{c.isler['is-5'].veri.saatsiz=true;}],
  ['Ekip işi: olmayan kişi',()=>{const c=persembe('kisi-8');ajandaIsiYap(c,'is-10','devret');return c;},c=>{Object.values(c.isler).find(x=>x.tur==='ekip').veri.kisiId='kisi-99';}],
  ['Ekip işi: bilinmeyen görev',()=>{const c=persembe('kisi-8');ajandaIsiYap(c,'is-10','devret');return c;},c=>{Object.values(c.isler).find(x=>x.tur==='ekip').veri.gorev='yok';}],
  ['İçerik kaydı yok',yeni,c=>{delete c.icerik;}],
  ['Rastlantı durumu tamsayı değil',yeni,c=>{c.rastlanti.durum=0.5;}],
  ['Devralınan koşullar yok',yeni,c=>{c.kosullar=null;}],
  ['Gelişme: bilinmeyen tür',krizde,c=>{isEkle(c,{tur:'hatirlatma',tarih:c.tarih,dakika:c.gunIciDakika,veri:{metin:'x'}});Object.values(c.isler).find(x=>x.tur==='hatirlatma').tur='gelisme';}],
  ['Olay: bilinmeyen paket',krizde,c=>{c.olaylar['olay-1'].paket='yok';}],
  ['Olay: bilinmeyen durum',krizde,c=>{c.olaylar['olay-1'].durum='belki';}],
  ['Olay: açık fakat meselesi yok',krizde,c=>{c.olaylar['olay-1'].meseleId='mesele-9';}],
  ['Olay: kapanmış fakat meselesi açık',krizde,c=>{c.olaylar['olay-1'].durum='kapandi';}],
  ['Olay: aynı konu iki kez açılmış',krizde,c=>{c.olaylar['olay-2']=Object.assign({},c.olaylar['olay-1'],{id:'olay-2',durum:'onlendi',meseleId:null});c.sonrakiNo.olay=3;}],
  ['Olay: düşük sonrakiNo.olay',krizde,c=>{c.sonrakiNo.olay=1;}],
  ['Olay: bilinmeyen kanıt anahtarı',krizde,c=>{c.olaylar['olay-1'].bilgiler[0].anahtar='yok';}],
  ['Olay: kaynağı olmayan kanıt',krizde,c=>{c.olaylar['olay-1'].bilgiler[0].kaynak='kisi-99';}],
  ['Ödeme kararı: olayı yok',krizde,c=>{kararIsi(c,'odemeSikismasi').veri.olayId='olay-9';}],
  ['Gözlem alanı yok',yeni,c=>{delete c.gozlem;}],
  ['Gözlem: kapanmamış eski aralık',yeni,c=>{c.gozlem={tarih:'2026-11-20',bas:900,bitis:960};}],
  ['Gözlem: biçimi bozuk',yeni,c=>{c.gozlem={tarih:c.tarih,bas:'x',bitis:960};}],
  ['Söz listesi yok',yeni,c=>{delete c.sozler;}],
  ['Haber listesi dizi değil',yeni,c=>{c.haberler={};}],
  ['Söz: bilinmeyen durum',sozlu,c=>{Object.values(c.sozler)[0].durum='belki';}],
  ['Söz: olmayan muhatap',sozlu,c=>{Object.values(c.sozler)[0].muhatap='kisi-99';}],
  ['Söz: açık fakat sonuç kaydı var',sozlu,c=>{Object.values(c.sozler)[0].sonuc={tarih:c.tarih,dakika:0};}],
  ['Söz: düşük sonrakiNo.soz',sozlu,c=>{c.sonrakiNo.soz=1;}],
  ['Haber: bilinmeyen anahtar',sozlu,c=>{c.haberler.push({tur:'gazete',tarih:c.tarih,dakika:c.gunIciDakika,anahtar:'yok',p:{},olayId:null,gorulen:false});}],
  ['Haber: gelecekte kalan kayıt',sozlu,c=>{c.haberler.push({tur:'gazete',tarih:'2027-01-01',dakika:0,anahtar:'gazete.macOnu',p:{},olayId:null,gorulen:false});}],
  ['Sorumluluk: olmayan kişi',krizde,c=>{c.kulupler.demirkapi.sorumluluklar={tahsilat:{kisiId:'kisi-99'}};}],
  ['Tavsiye: karar işi kimliği yok',()=>{const c=tamKriz('pazarlik','kisi-8');tavsiyeIste(c,kararIsi(c,'odemeSikismasi').id);return c;},c=>{delete Object.values(c.isler).find(x=>x.veri.gorev==='tavsiye').veri.isId;}],
  ['Ödeme teklifi: bilinmeyen teklif',()=>{const c=krizde();ajandaIsiYap(c,kararIsi(c,'odemeSikismasi').id,'kendin');return c;},c=>{kararIsi(c,'odemeTeklifi').veri.teklif='yok';}],
  ['Ajanda: bilinmeyen katılım etkisi',()=>yeniBasla('sikisik','pazarlik'),c=>{Object.values(c.isler).find(x=>x.veri.etki).veri.etki='yok';}],
  ['Ajanda: katılım etkisi karar işinde',()=>yeniBasla('sikisik','pazarlik'),c=>{Object.values(c.isler).find(x=>x.veri.etki).veri.karar='nakitOnerisi';}],
  ['Ajanda: olmayan soran kişi',()=>yurut3(yeniBasla('sikisik','pazarlik'),{adayGorusmesi:adayAl('kisi-8'),destekCevabi:'dur'}),c=>{kararIsi(c,'destekCevabi').veri.soran='kisi-99';}],
  ['Aday kartı: sıra geçersiz',()=>{const c=yeniBasla('sikisik','pazarlik');duragaIlerle(c);ajandaIsiYap(c,Object.values(c.isler).find(x=>x.veri.etki).id);return c;},c=>{kararIsi(c,'adayGorusmesi').veri.sira=7;}]
];
for(const [ad,kur,boz] of BOZUKLAR){
  const c=kur();boz(c);
  const hh=kariyerDogrula(c);
  denetle(`Yakalandı: ${ad}`,hh.length>0,hh[0]||'hata üretmedi');
}

console.log(`\n${basarisiz?`BAŞARISIZ: ${basarisiz} denetim`:'Tüm denetimler geçti'}`);
process.exit(basarisiz?1:0);
