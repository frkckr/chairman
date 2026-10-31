#!/usr/bin/env node
/* ============ Chairman — oyuncu yüzlerinin denetimi (RK4-a, 2026-10-31) ============
   Kullanıcı (31 Ekim): “her oyuncunun yüzü farklı olmalı”. Yüz oyuncunun kaydından ve kimliğinden türetilir (js/portre.js portreOzellik; saf, çizimsiz).
   Araç oyunun kural dosyalarını, stil ve arma tarifini ve portre dosyasını tarayıcısız yükler (kariyer-deneme kalıbı), üç dünya tohumunda yeni kariyer
   kurar ve bütün oyuncuların (16 kulüp ve serbest havuz) özellik kümelerini karşılaştırır:
     tekillik    aynı kariyerde iki oyuncunun özellik kümesi aynı değil
     ortak       yüzün teni, saç tipi ve rengi, bıyığı ve sakalı oyuncunun kaydındakiyle (3B figür) aynı
     belirlenim  aynı tohum iki kez aynı yüzleri verir; JSON'dan geri okunan kayıt da (kaydet–yükle)
     dağılım     her özelliğin bütün değerleri kullanılıyor (bilgi)
   Kullanım: node araclar/portre-denetimi.js [tohum ...]   Çıkış kodu: kabul dışıysa 1. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const KOK=path.join(__dirname,'..');
const {OYUN_DOSYALARI}=require('./dosya-gruplari');
const DOSYALAR=['js/stil-99.js'].concat(OYUN_DOSYALARI,['js/arma.js','js/portre.js']);
const baglam=()=>{if(!(vm.constants&&vm.constants.DONT_CONTEXTIFY))return vm.createContext({console,Math,Date});const c=vm.createContext(vm.constants.DONT_CONTEXTIFY);c.console=console;return c;};
const tohumlar=process.argv.slice(2).map(Number).filter(Number.isInteger);
const T=tohumlar.length?tohumlar:[3,7,11];
let basarisiz=0;
const denetle=(ad,tamam,ayrinti)=>{if(!tamam)basarisiz++;console.log((tamam?'  ':'! ')+ad+(ayrinti?' — '+ayrinti:''));};
function kur(){const ctx=baglam();for(const f of DOSYALAR)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),ctx,{filename:f});return ad=>vm.runInContext(ad,ctx);}
const al=kur();
const [kariyerBaslat,portreOzellik,anahtar]=['kariyerBaslat','portreOzellik','portreOzellikAnahtari'].map(al);
const say={};let toplam=0;
for(const tohum of T){
  const k=kariyerBaslat({tohum}),O=Object.values(k.oyuncular),A=new Map(),cak=[],uymayan=[];
  for(const o of O){const f=portreOzellik(o),a=anahtar(f);toplam++;
    if(A.has(a))cak.push([A.get(a),o.id]);else A.set(a,o.id);
    if(f.ten!==Math.max(0,Math.min(4,o.ten|0))||f.sacRenk!==(o.sacRenk||'#241a12')||(o.sac&&f.sac!==o.sac)||f.biyik!==!!o.biyik||f.sakal!==!!o.sakal)uymayan.push(o.id);
    for(const [ad,v] of Object.entries({yuz:f.yuz,kas:f.kas,goz:f.goz,gozRenk:f.gozRenk,burun:f.burun,agiz:f.agiz,kulak:f.kulak,sac:f.sac+f.sacV})){(say[ad]=say[ad]||{})[v]=(say[ad][v]||0)+1;}}
  const kulupsuz=O.filter(o=>!o.kulupId).length;
  denetle(`tohum ${tohum}: ${O.length} oyuncuda (${kulupsuz} serbest) aynı yüz yok`,!cak.length,cak.slice(0,3).map(x=>x.join(' = ')).join(', '));
  denetle(`tohum ${tohum}: ten, saç, bıyık ve sakal kayıttakiyle (3B figür) aynı`,!uymayan.length,uymayan.slice(0,5).join(', '));
  /* belirlenim: aynı tohum yeniden ve JSON'dan geri okunmuş kayıt */
  const k2=kariyerBaslat({tohum}),k3=JSON.parse(JSON.stringify(k));
  const ayni=O.every(o=>anahtar(portreOzellik(o))===anahtar(portreOzellik(k2.oyuncular[o.id]))&&anahtar(portreOzellik(o))===anahtar(portreOzellik(k3.oyuncular[o.id])));
  denetle(`tohum ${tohum}: aynı tohum ve kaydet–yükle aynı yüzleri verir`,ayni);
}
const eksik=Object.entries({yuz:5,kas:4,goz:5,gozRenk:3,burun:4,agiz:4,kulak:2}).filter(([a,n])=>Object.keys(say[a]||{}).length<n).map(([a])=>a);
denetle(`dağılım: her özelliğin bütün değerleri kullanılıyor (${toplam} yüz)`,!eksik.length,eksik.join(', ')||Object.entries(say).map(([a,v])=>a+' '+Object.keys(v).length).join(' · '));
console.log(basarisiz?`BAŞARISIZ: ${basarisiz} denetim`:'Yüz denetimi geçti');
process.exit(basarisiz?1:0);
