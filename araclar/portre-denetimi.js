#!/usr/bin/env node
/* ============ Chairman — oyuncu yüzlerinin denetimi (RK4-a 2026-10-31, RK4-b 2026-11-01) ============
   Kullanıcı (31 Ekim): “her oyuncunun yüzü farklı olmalı”; (1 Kasım): “Türkler çok siyahi değildir, hafif esmer olur …; yaşlandıkça saç dökülmesi …”.
   Yüz oyuncunun kimliğinden, kaydından ve yaşından türetilir (js/kimlik.js, js/portre.js portreOzellik; saf, çizimsiz). Araç oyunun kural dosyalarını,
   stil ve arma tarifini ve portre dosyasını tarayıcısız yükler (kariyer-deneme kalıbı), üç dünya tohumunda yeni kariyer kurar ve bütün oyuncuları
   (16 kulüp ve serbest havuz) denetler:
     tekillik    aynı kariyerde iki oyuncunun kimlik özellik kümesi aynı değil (yaşa bağlı alanlar hariç)
     ortak       yüzün saç tipi ve rengi, bıyığı ve sakalı kayıttakiyle; teni kimliğin teniyle (balkondaki 3B figür aynı işlevi kullanır)
     belirlenim  aynı tohum iki kez aynı yüzleri verir; JSON'dan geri okunan kayıt da (kaydet–yükle)
     köken       Türkiye kökeninde ten ve göz dağılımı hedef aralığında (en koyu üç rampa yok, açık ve açık zeytuni ≥ %55, açık göz %28–50)
     yaş         yapay 3000 kimlikte belirgin saç açılması (aşama ≥ 2) 25 yaşta %8–24, 35'te %25–45, 40'ta %40–60; 21 yaşından küçükte yok;
                 aynı kişide yaşla saç çizgisi ve kırlaşma azalmaz; kırlaşma 30 yaşından önce yok denecek kadar az
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
const [kariyerBaslat,portreOzellik,anahtar,kimlik,yasKatmani]=['kariyerBaslat','portreOzellik','portreOzellikAnahtari','kimlik','yasKatmani'].map(al);
const say={},tenSay=[0,0,0,0,0,0,0],gozSay=[0,0,0,0];let toplam=0;
const yuzde=(a,b)=>(100*a/Math.max(1,b)).toFixed(1)+'%';
for(const tohum of T){
  const k=kariyerBaslat({tohum}),O=Object.values(k.oyuncular),A=new Map(),cak=[],uymayan=[];
  for(const o of O){const f=portreOzellik(o,k.tarih),a=anahtar(f);toplam++;
    if(A.has(a))cak.push([A.get(a),o.id]);else A.set(a,o.id);
    if(f.ten!==kimlik(o).ten||f.sacRenk!==(o.sacRenk||'#241a12')||(o.sac&&f.sac!==o.sac)||f.biyik!==!!o.biyik||f.sakal!==!!o.sakal)uymayan.push(o.id);
    tenSay[f.ten]++;gozSay[f.gozRenk]++;
    for(const [ad,v] of Object.entries({yuz:f.yuz,kas:f.kas,goz:f.goz,gozRenk:f.gozRenk,burun:f.burun,agiz:f.agiz,kulak:f.kulak,sac:f.sac+f.sacV})){(say[ad]=say[ad]||{})[v]=(say[ad][v]||0)+1;}}
  const kulupsuz=O.filter(o=>!o.kulupId).length;
  denetle(`tohum ${tohum}: ${O.length} oyuncuda (${kulupsuz} serbest) aynı yüz yok`,!cak.length,cak.slice(0,3).map(x=>x.join(' = ')).join(', '));
  denetle(`tohum ${tohum}: saç, bıyık ve sakal kayıttakiyle, ten kimliğinkiyle (3B figür) aynı`,!uymayan.length,uymayan.slice(0,5).join(', '));
  const k2=kariyerBaslat({tohum}),k3=JSON.parse(JSON.stringify(k));
  const ayni=O.every(o=>anahtar(portreOzellik(o,k.tarih))===anahtar(portreOzellik(k2.oyuncular[o.id],k.tarih))&&JSON.stringify(portreOzellik(o,k.tarih))===JSON.stringify(portreOzellik(k3.oyuncular[o.id],k.tarih)));
  denetle(`tohum ${tohum}: aynı tohum ve kaydet–yükle aynı yüzleri verir (yaş katmanı dahil)`,ayni);
}
/* köken: bugün ligin herkesi Türkiye kökenli */
const koyu=tenSay[4]+tenSay[5]+tenSay[6],acik=tenSay[0]+tenSay[1],acikGoz=gozSay[2]+gozSay[3];
denetle(`köken (Türkiye): ten dağılımı — en koyu üç rampa ${yuzde(koyu,toplam)} (yok), açık ve açık zeytuni ${yuzde(acik,toplam)} (≥ %55)`,koyu===0&&acik/toplam>=0.55,
  'rampalar '+tenSay.map(n=>yuzde(n,toplam)).join(' · '));
denetle(`köken (Türkiye): açık göz (ela-yeşil, mavi-gri) ${yuzde(acikGoz,toplam)} (%28–50)`,acikGoz/toplam>=0.28&&acikGoz/toplam<=0.5,'gözler '+gozSay.map(n=>yuzde(n,toplam)).join(' · '));
/* yaş: yapay kimlikler (aynı kişi farklı yaşlarda: doğum yılı değişir, kimlik aynı) */
{const tarih='2026-11-23',N=3000,pay={},monoton=[],kirGenc=[];
  for(const yas of [19,25,30,35,40,45]){let a2=0,kir=0;
    for(let i=0;i<N;i++){const p={id:'yapay-'+i,ad:'Yapay '+i,no:i%40,dogumTarihi:(2026-yas-1)+'-12-01'},Y=yasKatmani(p,tarih);if(Y.sacCizgisi>=2)a2++;if(Y.gri>0)kir++;}
    pay[yas]={sac:a2/N,kir:kir/N};}
  for(let i=0;i<400;i++){let once=null;for(const yas of [18,22,26,30,34,38,42]){const p={id:'yapay-'+i,ad:'Yapay '+i,no:i%40,dogumTarihi:(2026-yas-1)+'-12-01'},Y=yasKatmani(p,tarih);
    if(once&&(Y.sacCizgisi<once.sacCizgisi||Y.gri<once.gri))monoton.push(p.id);if(yas<30&&Y.gri>0)kirGenc.push(p.id);once=Y;}}
  const s=y=>(100*pay[y].sac).toFixed(1)+'%';
  denetle(`yaş: belirgin saç açılması 19 yaşta ${s(19)} (0), 25'te ${s(25)} (%8–24), 35'te ${s(35)} (%25–45), 40'ta ${s(40)} (%40–60)`,
    pay[19].sac===0&&pay[25].sac>=0.08&&pay[25].sac<=0.24&&pay[35].sac>=0.25&&pay[35].sac<=0.45&&pay[40].sac>=0.4&&pay[40].sac<=0.6,
    'kır: '+[30,35,40,45].map(y=>y+' '+(100*pay[y].kir).toFixed(0)+'%').join(' · '));
  denetle('yaş: aynı kişide saç çizgisi ve kırlaşma yaşla azalmaz; 30 yaşından önce kır yok denecek kadar az',!monoton.length&&kirGenc.length<=4,
    monoton.slice(0,3).join(', ')+(kirGenc.length?' · gençte kır '+kirGenc.length:''));}
const eksik=Object.entries({yuz:5,kas:4,goz:5,gozRenk:4,burun:4,agiz:4,kulak:2}).filter(([a,n])=>Object.keys(say[a]||{}).length<n).map(([a])=>a);
denetle(`dağılım: her özelliğin bütün değerleri kullanılıyor (${toplam} yüz)`,!eksik.length,eksik.join(', ')||Object.entries(say).map(([a,v])=>a+' '+Object.keys(v).length).join(' · '));
console.log(basarisiz?`BAŞARISIZ: ${basarisiz} denetim`:'Yüz denetimi geçti');
process.exit(basarisiz?1:0);
