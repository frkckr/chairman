#!/usr/bin/env node
/* ============ Chairman — masaüstü denemesi (yol haritası 1.5) ============
   Kullanım (masaustu klasöründe, npm install sonrası):
     node deneme.js           geliştirme kopyası: hazirla.js + electron .
     node deneme.js --paket   paketlenmiş uygulama: cikti/Chairman-win32-x64/Chairman.exe (önce node paketle.js)
   Uygulama iki kez ayrı süreç olarak açılır:
     1. açılış: oyun çevrimdışı açılır (bütün ağ istekleri engellenir ve sayılır), hatalar toplanır, bültenin ve
        İlerle'den sonraki 3B maç gününün ekran görüntüsü alınır, örnek kariyer kaydedilir. Uygulama kapanır.
     2. açılış: kayıt diskteki dosyadan yüklenir, kariyer devam eder, önceki kayda dönüş denenir.
   Kayıt klasörü Türkçe harf ve boşluk içeren geçici bir yoldur. Sonuçlar ve ekran görüntüsü cikti/deneme/ altına yazılır. */
'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),{spawnSync}=require('child_process');
const PAKET=process.argv.includes('--paket');
const CIKTI=path.join(__dirname,'cikti','deneme'+(PAKET?'-paket':''));
const KAYIT=path.join(os.tmpdir(),'chairman-deneme','Kayıt Şükrü Çağ İğne Ö');
const EXE=path.join(__dirname,'cikti','Chairman-win32-x64','Chairman.exe');

let basarisiz=0;
const denetle=(ad,tamam,ayrinti)=>{if(!tamam)basarisiz++;console.log((tamam?'  ':'! ')+ad+(ayrinti?` — ${ayrinti}`:''));};

if(PAKET){if(!fs.existsSync(EXE)){console.error(`Paket yok: ${EXE}\nÖnce: node paketle.js`);process.exit(1);}}
else require('./hazirla.js');
fs.rmSync(CIKTI,{recursive:true,force:true});fs.mkdirSync(CIKTI,{recursive:true});
fs.rmSync(KAYIT,{recursive:true,force:true});

function ac(asama){
  const bayraklar=[`--deneme=${CIKTI}`,`--asama=${asama}`,`--kayit-dizini=${KAYIT}`];
  const [komut,arglar]=PAKET?[EXE,bayraklar]:[require('electron'),['.',...bayraklar]];
  const t0=Date.now(),r=spawnSync(komut,arglar,{cwd:__dirname,encoding:'utf8',timeout:120000});
  const f=path.join(CIKTI,`sonuc-${asama}.json`);
  return{kod:r.status,sure:(Date.now()-t0)/1000,sonuc:fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):null,hata:r.error&&r.error.message};
}
const ozet=s=>s?[...s.hatalar,...s.engellenen.map(u=>'engellenen istek: '+u)].join(' · '):'';

console.log(`\nChairman masaüstü denemesi · ${PAKET?'paketlenmiş uygulama':'geliştirme kopyası'}`);
console.log(`Kayıt klasörü: ${KAYIT}\n`);

const a1=ac('1'),s1=a1.sonuc;
denetle('1. açılış tamamlandı',a1.kod===0&&!!s1,`çıkış kodu ${a1.kod} · ${a1.sure.toFixed(1)} sn${a1.hata?' · '+a1.hata:''}`);
if(s1){
  console.log(`  Electron ${s1.electron} · Chromium ${s1.chrome} · paketli: ${s1.paketli} · uygulama yolu: ${s1.uygulamaYolu}`);
  denetle('Sayfa ve betik hatası yok',!s1.hatalar.length,s1.hatalar.join(' · '));
  denetle('Ağ isteği yok (çevrimdışı açılış)',!s1.engellenen.length,s1.engellenen.join(', '));
  const o=s1.oyun||{};
  denetle('Three.js yerel kopyadan yüklendi',o.three==='128',`REVISION ${o.three}`);
  const yt=o.yaziTipleri||[];
  denetle('Yazı tipleri yerel kopyadan yüklendi',yt.some(x=>/IBM Plex Mono/.test(x))&&yt.some(x=>/Jersey 10/.test(x)),yt.join(', '));
  denetle('İlerle ile 3B maç gününe geçildi, WebGL çalışıyor',s1.ilerle===true&&s1.webgl===true,'görüntü: mac-gunu.png');
  denetle('Kayıt klasörü Türkçe karakterli yolda',s1.kayitDizini.startsWith(KAYIT),s1.kayitDizini);
  for(const x of (s1.kayit||{}).satirlar||[])console.log('    '+x);
}
const dosya=path.join(KAYIT,'kayitlar','kariyer-1.json');
const metin=fs.existsSync(dosya)?fs.readFileSync(dosya,'utf8'):'';
denetle('Kayıt diske yazıldı, Türkçe metin bozulmadı',metin.includes('"Şükrü Hoca"')&&metin.includes('"Demirkapı SK"'),`${dosya} · ${metin.length} karakter`);
denetle('Diskte geçici dosya kalmadı',fs.existsSync(dosya)&&!fs.readdirSync(path.dirname(dosya)).some(f=>/\.gecici$|\.yeni\.json$/.test(f)),fs.existsSync(path.dirname(dosya))?fs.readdirSync(path.dirname(dosya)).join(', '):'klasör yok');

const a2=ac('2'),s2=a2.sonuc;
denetle('2. açılış: kapatılıp açılan uygulamada kariyer kaldığı yerden sürdü',a2.kod===0&&!!s2&&s2.tamam,`çıkış kodu ${a2.kod} · ${a2.sure.toFixed(1)} sn ${ozet(s2)}`);
for(const x of ((s2||{}).kayit||{}).satirlar||[])console.log('    '+x);

console.log(`\nEkran görüntüleri: ${['oyun.png','mac-gunu.png'].map(f=>path.relative(path.join(__dirname,'..'),path.join(CIKTI,f))).join(', ')}`);
console.log(basarisiz?`BAŞARISIZ: ${basarisiz} denetim`:'Tüm denetimler geçti');
fs.rmSync(path.join(os.tmpdir(),'chairman-deneme'),{recursive:true,force:true});
process.exit(basarisiz?1:0);
