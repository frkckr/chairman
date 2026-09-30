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
   - Bilerek bozulan kopyalar doğrulamada yakalanmalı.
   - Başarısız denetim "!" ile işaretlenir; en az biri başarısızsa çıkış kodu 1'dir. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const KOK=path.join(__dirname,'..');
const DOSYALAR=['js/ortak.js','js/kadrolar.js','js/lig.js','js/kariyer.js','js/takvim.js','js/maliye.js','js/ajanda.js','js/mesele.js','js/yonetim.js','js/kayit.js','js/kariyer-ornek.js'];
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
  const ileri=Object.assign({},c,{kayitSurumu:3});depo.yaz('ileri',zarf(ileri));
  const y1=kariyerYukle(depo,'ileri');
  denetle('Daha yeni sürümle yapılmış kayıt açılmaz, nedeni söylenir',!y1.tamam&&/daha yeni/.test(y1.hata),y1.hata);
  const eski=Object.assign({},c,{kayitSurumu:0});delete eski.hareketler;depo.yaz('eski',zarf(eski));
  const y2=kariyerYukle(depo,'eski');
  KAYIT_GECISLERI[0]=v=>{v.hareketler=[];v.kayitSurumu=1;return v;};
  const y3=kariyerYukle(depo,'eski');
  delete KAYIT_GECISLERI[0];
  denetle('Eski sürüm: geçiş yoksa açıklamalı hata, varsa sırayla dönüştürülür',!y2.tamam&&y3.tamam&&y3.gecisler.join()==='0→1,1→2'&&Array.isArray(y3.kariyer.hareketler),`${y2.hata} · deneme geçişiyle: ${y3.gecisler&&y3.gecisler.join()}`);
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
    const ayni=y.tamam&&eski.kayitSurumu===1&&y.gecisler.join()==='1→2'&&metin(c.hareketler)===metin(eski.hareketler)&&metin(c.gecmis)===metin(eski.gecmis)
      &&metin(c.kulupler)===metin(eski.kulupler)&&meselesiz(c.isler)===metin(eski.isler)&&c.tarih===eski.tarih&&c.gunIciDakika===eski.gunIciDakika;
    denetle(`${ad}: açıldı ve 1→2 dönüştü; para, geçmiş ve işler aynı, mesele ${durum}`,ayni&&Object.keys(c.meseleler).length===1&&c.meseleler[M1].durum===durum&&bagli(c)===isler,
      y.tamam?`${an(c)} · bağlı: ${bagli(c)||'yok'} · ${meseleOzeti(c,M1).olaylar.length} olay`:y.hata);
    if(!y.tamam)continue;
    const s=macSonrasi(kariyerOlustur(c),30);
    denetle(`${ad}: oynanmaya devam etti; ödeme ve karar tekrarlanmadı, mesele kapandı`,s.meseleler[M1].durum==='kapandi'&&sponsorToplami(s)===toplam&&gecerli(s)[0]&&Object.keys(s.meseleler).length===1,
      `${an(s)} · sponsor geliri ${paraYazi(sponsorToplami(s))} ${gecerli(s)[1]}`);
  }
  denetle('Dönüştürülen kayıt sürüm 2 olarak yeniden kaydedilip yüklenir',(()=>{const depo=bellekDeposu();depo.yaz('e',fs.readFileSync(path.join(KOK,'araclar','ornekler','kayit-s1-taksit.json'),'utf8'));
    const c=kariyerYukle(depo,'e').kariyer,s=kariyerKaydet(depo,'e',c),y=kariyerYukle(depo,'e');return s.tamam&&y.tamam&&!y.gecisler.length&&y.kariyer.kayitSurumu===2&&metin(y.kariyer)===metin(c);})());
}
denetle('Başlangıç verileri yeni denemelerde de değişmedi',metin(BASLANGIC)===baslangicMetni&&metin(ORNEK)===ornekMetni);

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
  ['Ekip işi: bilinmeyen görev',()=>{const c=persembe('kisi-8');ajandaIsiYap(c,'is-10','devret');return c;},c=>{Object.values(c.isler).find(x=>x.tur==='ekip').veri.gorev='yok';}]
];
for(const [ad,kur,boz] of BOZUKLAR){
  const c=kur();boz(c);
  const hh=kariyerDogrula(c);
  denetle(`Yakalandı: ${ad}`,hh.length>0,hh[0]||'hata üretmedi');
}

console.log(`\n${basarisiz?`BAŞARISIZ: ${basarisiz} denetim`:'Tüm denetimler geçti'}`);
process.exit(basarisiz?1:0);
