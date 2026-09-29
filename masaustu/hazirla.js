#!/usr/bin/env node
/* ============ Chairman — masaüstü: oyun kopyasını çevrimdışı açılışa hazırlar ============
   Kullanım:  node masaustu/hazirla.js   (önce masaustu içinde npm install)
   Depodaki oyun dosyaları değişmez. masaustu/oyun/ klasörüne bir kopya kurulur:
   - index.html ve js/ kopyalanır; Three.js CDN adresi ve Google Fonts bağlantısı yerel dosyalarla değiştirilir.
   - Three.js r128 (MIT) ve IBM Plex Mono, Jersey 10 yazı tipleri (OFL-1.1) npm paketlerinden kutuphane/ altına alınır.
     Türkçe harfler (ş, ğ, İ...) yazı tiplerinin latin-ext dosyalarındadır; tüm alt kümeler kopyalanır.
   - Lisans metinleri ve sürümler kutuphane/lisanslar/ ve kutuphane/SURUMLER.txt içine yazılır.
   - Geliştirici kayıt denemesi sayfası (araclar/kayit-deneme.html) da kopyalanır; yayın paketinden ayrıca çıkarılacak.
   Değiştirilmesi beklenen bir satır bulunamazsa ya da kopyada dış adres kalırsa hata verir. */
'use strict';
const fs=require('fs'),path=require('path');
const KOK=path.join(__dirname,'..'),HEDEF=path.join(__dirname,'oyun'),NM=path.join(__dirname,'node_modules');
const kutu=path.join(HEDEF,'kutuphane'),lisans=path.join(kutu,'lisanslar');
const paketSurumu=p=>JSON.parse(fs.readFileSync(path.join(NM,p,'package.json'),'utf8')).version;

if(!fs.existsSync(path.join(NM,'three')))throw new Error('Bağımlılıklar yok: masaustu klasöründe npm install çalıştırın');
fs.rmSync(HEDEF,{recursive:true,force:true});
fs.mkdirSync(lisans,{recursive:true});

/* oyun dosyaları */
fs.cpSync(path.join(KOK,'js'),path.join(HEDEF,'js'),{recursive:true});
fs.mkdirSync(path.join(HEDEF,'araclar'));
fs.copyFileSync(path.join(KOK,'araclar','kayit-deneme.html'),path.join(HEDEF,'araclar','kayit-deneme.html'));

/* Three.js */
fs.copyFileSync(path.join(NM,'three','build','three.min.js'),path.join(kutu,'three.min.js'));
fs.copyFileSync(path.join(NM,'three','LICENSE'),path.join(lisans,'three-LICENSE.txt'));

/* yazı tipleri: fontsource CSS'leri birleştirilir, dosya yolları yeni konuma çevrilir */
const FONTLAR=[['ibm-plex-mono',['400','500','600']],['jersey-10',['400']]];
let css='/* Chairman — yerel yazı tipleri (masaustu/hazirla.js üretir) */\n';
for(const [ad,kalinliklar] of FONTLAR){
  const kaynak=path.join(NM,'@fontsource',ad);
  fs.cpSync(path.join(kaynak,'files'),path.join(kutu,'fontlar',ad),{recursive:true});
  for(const k of kalinliklar)css+=fs.readFileSync(path.join(kaynak,`${k}.css`),'utf8').replace(/url\(\.\/files\//g,`url(${ad}/`)+'\n';
  fs.copyFileSync(path.join(kaynak,'LICENSE'),path.join(lisans,`${ad}-LICENSE.txt`));
}
fs.writeFileSync(path.join(kutu,'fontlar','fontlar.css'),css);

/* index.html: dış bağlantılar yerel dosyalara */
let html=fs.readFileSync(path.join(KOK,'index.html'),'utf8');
const DEGISIM=[
  [/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\r?\n/,''],
  [/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\r?\n/,''],
  [/<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*" rel="stylesheet">/,'<link href="kutuphane/fontlar/fontlar.css" rel="stylesheet">'],
  [/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js"><\/script>/,'<script src="kutuphane/three.min.js"></script>']
];
for(const [ara,yeni] of DEGISIM){
  if(!ara.test(html))throw new Error(`index.html içinde beklenen satır yok: ${ara}`);
  html=html.replace(ara,yeni);
}
fs.writeFileSync(path.join(HEDEF,'index.html'),html);

/* kopyada dış adres kalmamalı (yorumlar dahil değil: yalnız src/href ve url() aranır) */
const dis=[];
const tara=f=>{const s=fs.readFileSync(f,'utf8');for(const m of s.matchAll(/(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)|url\(\s*["']?(https?:\/\/[^)"']+)/g))dis.push(`${path.relative(HEDEF,f)}: ${m[1]||m[2]}`);};
const gez=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())gez(f);else if(/\.(html|css|js)$/.test(e.name))tara(f);}};
gez(HEDEF);
if(dis.length)throw new Error('Kopyada dış adres kaldı:\n  '+dis.join('\n  '));

const surumler=[
  'Chairman masaüstü kopyasındaki dış kaynaklar',
  `three.js ${paketSurumu('three')} (r128) · MIT · kutuphane/three.min.js`,
  `IBM Plex Mono · @fontsource/ibm-plex-mono ${paketSurumu('@fontsource/ibm-plex-mono')} · OFL-1.1`,
  `Jersey 10 · @fontsource/jersey-10 ${paketSurumu('@fontsource/jersey-10')} · OFL-1.1`,
  `Electron ${paketSurumu('electron')} · MIT (paketleyici ekler)`
].join('\n')+'\n';
fs.writeFileSync(path.join(kutu,'SURUMLER.txt'),surumler);
console.log(`Hazır: ${path.relative(KOK,HEDEF)}\n${surumler}`);
