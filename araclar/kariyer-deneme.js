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
const OYUN_DOSYALARI=['js/ortak.js','js/kadrolar.js','js/lig.js','js/kariyer.js','js/takvim.js','js/maliye.js','js/ajanda.js','js/mesele.js','js/yonetim.js','js/olay.js','js/soz.js','js/mesajlar.js','js/gozlem.js','js/test-gorunum.js','js/kayit.js','js/baslangic.js'];
const DOSYALAR=OYUN_DOSYALARI.concat(['araclar/test-icerik.js','js/kariyer-ornek.js']);
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
  const eski=Object.assign({},c,{kayitSurumu:5});delete eski.hareketler;depo.yaz('eski',zarf(eski));
  const y2=kariyerYukle(depo,'eski');
  KAYIT_GECISLERI[5]=v=>{v.hareketler=[];v.kayitSurumu=6;return v;};
  const y3=kariyerYukle(depo,'eski');
  delete KAYIT_GECISLERI[5];
  denetle('Eski sürüm: geçiş yoksa açıklamalı hata, varsa sırayla dönüştürülür',!y2.tamam&&/eski bir sürüm/.test(y2.hata)&&y3.tamam&&y3.gecisler.join()==='5→6'&&Array.isArray(y3.kariyer.hareketler),`${y2.hata} · deneme geçişiyle: ${y3.gecisler&&y3.gecisler.join()}`);
}
denetle('Başlangıç verisi hiçbir denemede değişmedi',metin(ORNEK)===ornekMetni);

/* ================= 2.8L boş oyun: içerik yok, iskelet çalışır ================= */
bolum('2.8L — içeriksiz yeni kariyer (oyunun yüklediği dosyalar)');
const oyunCtx=vm.createContext({console,Math,Date});
for(const f of OYUN_DOSYALARI)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),oyunCtx,{filename:f});
const oyunAl=ad=>vm.runInContext(ad,oyunCtx);
{
  const kur=oyunAl('kariyerBaslat'),c=kur({tohum:7}),d=kur({tohum:7}),h=oyunAl('kariyerDogrula')(c);
  const say=ad=>Object.keys(oyunAl(ad)).length;
  denetle('Oyunda paket, gelişme, karar türü, konuya özgü ekip görevi (genel tavsiye hariç), katılım etkisi ve girişim tanımlı değil',
    say('PAKETLER')+say('GELISMELER')+say('KARAR_TURLERI')+Object.keys(oyunAl('EKIP_GOREVLERI')).filter(x=>x!=='tavsiye').length+say('KATILIM_ETKILERI')+say('GIRISIMLER')===0&&oyunAl('GOZLEM_NOTLARI').length===0&&say('SOZ_TARAFLARI')===0);
  denetle('Yeni kariyer geçerli; içerik sürümü 4, kayıt sürümü 6',!h.length&&c.icerik.surum===4&&c.kayitSurumu===6,h.join('; '));
  const isler=Object.values(c.isler);
  denetle('Yalnız başkan var; koltuklar boş; mesele, olay, söz ve haber yok',Object.keys(c.kisiler).join()==='kisi-1'&&metin(c.kulupler.demirkapi.yonetim)==='{"sayman":null,"futbol":null,"basin":null}'
    &&!Object.keys(c.meseleler).length&&!Object.keys(c.olaylar).length&&!Object.keys(c.sozler).length&&!c.haberler.length);
  denetle('Takvimde tek iş: Cumartesi 19:00 maç günü (LIG.buMac ile aynı an)',isler.length===1&&isler[0].veri.eylem==='macGunu'&&isler[0].tarih==='2026-11-28'&&saatYazi(isler[0].dakika)===LIG.buMac.saat,isler[0]&&isler[0].veri.baslik);
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
