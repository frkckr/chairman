#!/usr/bin/env node
/* ============ Chairman — masaüstü paketi (Windows x64) ============
   Kullanım (masaustu klasöründe):  node paketle.js
   hazirla.js ile oyun kopyasını kurar, @electron/packager ile cikti/Chairman-win32-x64/ klasörüne Chairman.exe üretir.
   Uygulama dosyaları asar arşivine konur. Kurulum sihirbazı, imzalama ve Steam bağlantısı bu denemenin kapsamı değildir. */
'use strict';
const path=require('path'),fs=require('fs');
require('./hazirla.js');
(async()=>{
  const mod=await import('@electron/packager');
  const packager=mod.packager||mod.default;
  const yollar=await packager({
    dir:__dirname,name:'Chairman',executableName:'Chairman',platform:'win32',arch:'x64',
    out:path.join(__dirname,'cikti'),overwrite:true,asar:true,prune:true,
    ignore:[/^\/cikti($|\/)/,/^\/(deneme|hazirla|paketle)\.js$/,/^\/package-lock\.json$/]
  });
  for(const y of yollar){
    let boyut=0;const gez=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())gez(f);else boyut+=fs.statSync(f).size;}};gez(y);
    console.log(`Paket: ${path.relative(path.join(__dirname,'..'),y)} · ${(boyut/1048576).toFixed(0)} MB`);
  }
})().catch(e=>{console.error(e.message);process.exit(1);});
