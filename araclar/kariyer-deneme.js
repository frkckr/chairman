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
   - Bilerek bozulan kopyalar doğrulamada yakalanmalı.
   - Başarısız denetim "!" ile işaretlenir; en az biri başarısızsa çıkış kodu 1'dir. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const KOK=path.join(__dirname,'..');
const DOSYALAR=['js/ortak.js','js/kadrolar.js','js/lig.js','js/kariyer.js','js/takvim.js','js/maliye.js','js/ajanda.js','js/yonetim.js','js/kayit.js','js/kariyer-ornek.js'];
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
/* bütün hafta: her gün zorunlu ve son günü gelen işler (engelsizse) yapılır, gün bitirilir; araya kaydet/yükle girebilir.
   Karar işlerinde secimler[işId] ya da ilk engelsiz seçenek seçilir */
function haftayiOyna(araIslem,secimler){
  let c=hafta();
  for(let gun=0;gun<10&&c.isler['is-13'];gun++){
    for(const r of ajandaGunu(c,c.tarih)){
      if(!c.isler[r.id]||r.tur!=='ajanda'||!(r.zorunluluk==='zorunlu'||r.sonTarih===c.tarih))continue;
      const o=ajandaOnizle(c,r.id),s=o.secenekler.find(x=>!x.engel&&(!secimler||!secimler[r.id]||x.id===secimler[r.id]));
      if(!o.engel.length)ajandaIsiYap(c,r.id,s?s.id:undefined);
    }
    if(!c.isler['is-13'])break;
    gunuBitir(c);
    if(araIslem)c=araIslem(c);
  }
  return c;
}
{
  const c=haftayiOyna();
  const m=maliDurum(c,'demirkapi');
  denetle('Hafta oynanır, maç sınırına Cumartesi 19:00\'da gelinir',an(c)==='2026-11-28 19:00'&&c.gecmis.some(x=>x.isId==='is-13'&&x.sonuc.durum==='yapildi'&&x.sonuc.eylem==='macGunu'),an(c));
  denetle('Hafta içindeki ödemeler birer kez işlenir',m.nakit===850000000-4500000+12000000&&c.hareketler.length===2,`nakit ${paraYazi(m.nakit)} · ${c.hareketler.length} hareket`);
  denetle('Maçtan sonraki ödemeler bekliyor',m.bekleyenGider===-320000000&&m.bekleyenGelir===150000000);
  denetle('Hafta sonunda kariyer geçerli',...gecerli(c));
  const depo=bellekDeposu();
  const d=haftayiOyna(x=>{const s=kariyerKaydet(depo,'oyun-1',x);if(!s.tamam)throw new Error(s.hata);return kariyerYukle(depo,'oyun-1').kariyer;});
  denetle('Her gün başında kaydet/yükle yapmak sonucu değiştirmez',metin(c)===metin(d));
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
{
  const kendin=persembe('kisi-9');ajandaIsiYap(kendin,'is-10','kendin');
  const s3=kendin.isler['is-3'];
  denetle('Başkan kendisi görüşürse 90 dakika sürer, ödeme planı değişmez',an(kendin)==='2026-11-26 11:30'&&s3.tarih==='2026-12-01'&&s3.veri.tutar===150000000&&!kendin.gecmis.some(g=>g.tur==='iptal'),odemeler(kendin));
  const h=persembe('kisi-8');ajandaIsiYap(h,'is-10','devret');
  denetle('Mali deneyimli sayman (yetkisi içinde) iki taksit kurar',an(h)==='2026-11-26 10:15'&&!h.isler['is-3']&&h.gecmis.some(g=>g.tur==='iptal'&&g.isId==='is-3')&&/2026-12-01:75000000 2026-12-15:75000000/.test(odemeler(h)),odemeler(h));
  const d=persembe('kisi-10');ajandaIsiYap(d,'is-10','devret');
  denetle('Bağlantısı zayıf sayman: ödeme kayar, gecikme bedeli eklenir',d.isler['is-3'].tarih==='2026-12-15'&&/2026-12-15:150000000 2026-12-15:3000000/.test(odemeler(d)),odemeler(d));
  const t=persembe('kisi-9');const tb=ajandaIsiYap(t,'is-10','devret');
  const donen=Object.values(t.isler).filter(x=>x.tur==='ajanda'&&x.veri.karar==='sponsorIndirimi');
  denetle('Bağlantısı güçlü sayman: indirim talebi yetkisini aşar, başkana zorunlu karar olarak döner',t.isler['is-3'].veri.tutar===150000000&&donen.length===1&&donen[0].tarih==='2026-11-27'&&donen[0].veri.zorunluluk==='zorunlu',
    tb.find(x=>x.isId==='is-10').sonuc.bilgi);
  denetle('Her sayman farklı sonuç verir',new Set([odemeler(h),odemeler(d),odemeler(t)]).size===3);
  const t2=persembe('kisi-9');ajandaIsiYap(t2,'is-10','devret');
  denetle('Aynı seçimler aynı sonucu verir (olasılık yok)',metin(t)===metin(t2));
  ajandaIsiYap(t,'is-6');gunuBitir(t);                                  // zemin turunun son günü; sonra Cuma
  denetle('Dönen karar yapılmadan Cuma bitmez',gunuBitirOnizle(t).engel.some(e=>/indirim/.test(e)));
  const depo=bellekDeposu();kariyerKaydet(depo,'k',t);const t3=kariyerYukle(depo,'k').kariyer;
  const kabul=kariyerOlustur(t3);ajandaIsiYap(kabul,donen[0].id,'kabul');
  denetle('İndirimi kabul: ödeme %10 düşük, aynı gün',/2026-12-01:135000000/.test(odemeler(kabul))&&!kabul.isler['is-3'],odemeler(kabul));
  const ret=kariyerOlustur(t3);ajandaIsiYap(ret,donen[0].id,'ret');
  denetle('İndirimi ret: tam ödeme iki hafta geç',ret.isler['is-3'].tarih==='2026-12-15'&&ret.isler['is-3'].veri.tutar===150000000,odemeler(ret));
  denetle('Kayıttan yüklenen kariyerde karar tekrarlanmaz',t3.gecmis.filter(g=>g.isId==='is-10').length===1&&Object.values(t3.isler).filter(x=>x.veri.karar==='sponsorIndirimi').length===1);
  denetle('Yönetim kararlarından sonra kariyer geçerli',gecerli(h)[0]&&gecerli(d)[0]&&gecerli(kabul)[0]&&gecerli(ret)[0],[h,d,kabul,ret].map(x=>gecerli(x)[1]).filter(Boolean).join(' | '));
  const w=haftayiOyna(null,{'is-14':'kisi-9','is-10':'devret','is-15':'kabul'});
  denetle('Hafta yetki devri ve dönen kararla oynanır, maç sınırına gelinir',an(w)==='2026-11-28 19:00'&&gecerli(w)[0]&&/135000000/.test(odemeler(w)),odemeler(w));
}
denetle('Hafta başlangıç verisi değişmedi',metin(BASLANGIC)===baslangicMetni&&metin(ORNEK)===ornekMetni);

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
  ['Kişi: bilinmeyen katkı seviyesi',hafta,c=>{c.kisiler['kisi-8'].katki.mali='harika';}]
];
for(const [ad,kur,boz] of BOZUKLAR){
  const c=kur();boz(c);
  const hh=kariyerDogrula(c);
  denetle(`Yakalandı: ${ad}`,hh.length>0,hh[0]||'hata üretmedi');
}

console.log(`\n${basarisiz?`BAŞARISIZ: ${basarisiz} denetim`:'Tüm denetimler geçti'}`);
process.exit(basarisiz?1:0);
