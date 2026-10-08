/* Chairman — animasyonu dondurma (A2, 2026-10-08): js/animasyon.js'in o anki hâlini karşılaştırmanın "önce" tarafı olarak sabitler.
   Kullanım (turun başında bir kez; çıktı git'e alınır):  node araclar/karsilastir/dondur.js
   Çıktı: araclar/karsilastir/once/animasyon.js — js/animasyon.js'in kopyası; dosyanın başına o anki POSE (js/oyuncular.js) ve
   STIL.animasyon (js/stil-99.js) değerleri sabit olarak yazılır, böylece tur içinde bu ikisi değişse de "önce" değişmez.
   Dosya doğrudan yüklenmez: araclar/karsilastir/once-yukle.js onu bir işlevin içinde çalıştırır (üst düzey adları yerel kalır). */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),cp=require('child_process');
const KOK=path.join(__dirname,'..','..');
const ctx=vm.createContext({console,Math,JSON});
for(const f of ['js/ortak.js','js/stil-99.js','js/oyuncular.js'])vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),ctx,{filename:f});
const anm=vm.runInContext('JSON.stringify(STIL.animasyon)',ctx),poz=vm.runInContext('JSON.stringify(POSE)',ctx);
let src=fs.readFileSync(path.join(KOK,'js','animasyon.js'),'utf8');
const ESKI='const ANM=STIL.animasyon;';
if(!src.includes(ESKI))throw new Error('js/animasyon.js içinde "'+ESKI+'" bulunamadı');
src=src.replace(ESKI,'const ANM='+anm+';   /* dondurulmuş STIL.animasyon */');
let git='?';try{git=cp.execSync('git rev-parse --short HEAD',{cwd:KOK}).toString().trim();}catch(e){}
const bas='/* DONDURULMUŞ KOPYA — js/animasyon.js, git '+git+', '+new Date().toISOString().slice(0,10)+' (araclar/karsilastir/dondur.js).\n'+
  '   Doğrudan yüklenmez: araclar/karsilastir/once-yukle.js bu dosyayı bir işlevin içinde çalıştırır. POSE ve STIL.animasyon o anki değerleriyle sabittir. */\n'+
  'const POSE='+poz+';\n';
const hedef=path.join(KOK,'araclar','karsilastir','once','animasyon.js');
fs.mkdirSync(path.dirname(hedef),{recursive:true});
fs.writeFileSync(hedef,bas+src);
console.log('yazıldı: '+path.relative(KOK,hedef)+' ('+(bas.length+src.length)+' karakter, git '+git+')');
