#!/usr/bin/env node
/* ============ Chairman — hızlı kademe (“bozdum mu?”; R1-c, 2026-10-29) ============
   CLAUDE.md "Kontrol" hızlı kademesinin tek komutu. Değişen dosyaları git'ten okur, araclar/KAPILAR.md'nin hızlı satırlarına göre seçer
   (gruplar araclar/dosya-gruplari.js'te):
     her zaman        git diff --check, node araclar/ad-denetimi.js (~1 sn)
     motor dosyası    node araclar/mac-deneme.js 4 — çıkış 0 ve "sonuç aynı" satırı (~20 sn)
     kural dosyası    node araclar/kariyer-deneme.js (~85 sn)
     ekran / çizim    koşturmaz; gereken tarayıcı denetimini yazar (KAPILAR "Görüntü, ekran ve kariyer")
   Kullanım: node araclar/hizli.js [--taban <ref>] [--hepsi] [--liste]
     değişenler: varsayılan çalışma ağacı + hazırlananlar + izlenmeyenler (HEAD'e göre); --taban <ref> o commit'ten bu yana (dalın tamamı: --taban main)
     --hepsi  motor ve kural denetimini dosyadan bağımsız koşar; --liste  yalnız seçimi yazar, koşmaz
   İşler paralel koşar; özet ekrana, tam çıktı araclar/son-hizli.txt'ye (Git dışı). Çıkış kodu: bir denetim kabul dışıysa 1, kullanım hatasında 2.
   Bu kademe denge onayı değildir; oturum sonu node araclar/oturum-sonu.js. */
'use strict';
const fs=require('fs'),path=require('path'),{spawn,spawnSync}=require('child_process');
const {OYUN_DOSYALARI,KURAL_EK,motorDosyalari}=require('./dosya-gruplari');
const KOK=path.join(__dirname,'..'),RAPOR=path.join(__dirname,'son-hizli.txt');
const ARG=process.argv.slice(2);
function secenek(ad,degerli){const i=ARG.indexOf(ad);if(i<0)return null;if(!degerli){ARG.splice(i,1);return true;}const v=ARG[i+1];ARG.splice(i,2);return v;}
const TABANREF=secenek('--taban',true),HEPSI=!!secenek('--hepsi',false),LISTE=!!secenek('--liste',false);
if(ARG.length){console.error('Bilinmeyen argüman: '+ARG.join(' ')+'\nKullanım: node araclar/hizli.js [--taban <ref>] [--hepsi] [--liste]');process.exit(2);}

const git=a=>{const r=spawnSync('git',a,{cwd:KOK,encoding:'utf8'});if(r.status!==0)throw new Error('git '+a.join(' ')+': '+(r.stderr||'').trim());return r.stdout;};
function degisenler(){
  const L=new Set();
  if(TABANREF){for(const s of git(['diff','--name-only',TABANREF]).split('\n'))if(s.trim())L.add(s.trim());}
  else for(const s of git(['status','--porcelain=v1','-uall']).split('\n')){if(!s.trim())continue;let p=s.slice(3);if(p.includes(' -> '))p=p.split(' -> ')[1];L.add(p.replace(/^"|"$/g,''));}
  for(const s of git(['ls-files','--others','--exclude-standard']).split('\n'))if(s.trim())L.add(s.trim());
  return[...L].sort();
}

const MOTOR=new Set(motorDosyalari(KOK)),KURAL=new Set(OYUN_DOSYALARI.concat(KURAL_EK));
const MOTOR_ARAC=/^araclar\/(mac-deneme|motor-yukle|olcum-ortak|senaryo-ortak)\.js$|^araclar\/(olcumler|senaryolar)\//;
const KURAL_ARAC=/^araclar\/(kariyer-deneme|test-icerik|dosya-gruplari)\.js$|^araclar\/ornekler\//;
const IKI_D=new Set(['js/pul.js','js/kamera.js','js/mac-sahnesi.js']);
function sinifla(L){
  const s={motor:[],kural:[],ekran:[],ikiD:[],diger:[]};
  for(const f of L){
    let yer=false;
    if(MOTOR.has(f)||MOTOR_ARAC.test(f)||f==='index.html'){s.motor.push(f);yer=true;}
    if(KURAL.has(f)||KURAL_ARAC.test(f)||f==='index.html'){s.kural.push(f);yer=true;}
    if(IKI_D.has(f)){s.ikiD.push(f);yer=true;}
    if((/^js\/.+\.js$/.test(f)&&!MOTOR.has(f)&&!KURAL.has(f))||f==='index.html'){s.ekran.push(f);yer=true;}
    if(!yer)s.diger.push(f);
  }
  return s;
}

const calistir=(ad,arg,kabul)=>new Promise(tamam=>{const t0=Date.now();let cikti='';
  const c=spawn(process.execPath,arg,{cwd:KOK,env:Object.assign({},process.env,{PYTHONUTF8:'1'})});
  c.stdout.on('data',d=>cikti+=d);c.stderr.on('data',d=>cikti+=d);
  c.on('close',k=>{const neden=kabul?kabul(k,cikti):(k===0?null:'çıkış '+k);tamam({ad,k,neden,sure:(Date.now()-t0)/1000,cikti});});});
function gitDenetim(){
  const a=TABANREF?[['diff','--check',TABANREF]]:[['diff','--check'],['diff','--cached','--check']];
  let cikti='';for(const x of a){const r=spawnSync('git',x,{cwd:KOK,encoding:'utf8'});cikti+=r.stdout+r.stderr;}
  return{ad:'git diff --check',k:cikti.trim()?1:0,neden:cikti.trim()?'boşluk hatası':null,sure:0,cikti};
}

(async()=>{
  const L=degisenler(),S=sinifla(L);
  const motor=HEPSI||S.motor.length>0,kural=HEPSI||S.kural.length>0;
  const yaz=(ad,l)=>l.length?`  ${ad}: ${l.length>6?l.slice(0,6).join(', ')+` (+${l.length-6})`:l.join(', ')}`:null;
  console.log(`Hızlı kademe · ${L.length} değişen dosya${TABANREF?' (taban '+TABANREF+')':''}${HEPSI?' · --hepsi':''}`);
  for(const s of [yaz('motor',S.motor),yaz('kural',S.kural),yaz('ekran',S.ekran),yaz('diğer',S.diger)])if(s)console.log(s);
  const ipucu=[];
  if(S.ekran.length)ipucu.push('ekran ya da çizim değişti: python -X utf8 araclar/kontrol.py; akış bölümleri için KAPILAR “Görüntü, ekran ve kariyer” (python -X utf8 araclar/akis-deneme.py <bölüm>)');
  if(S.ikiD.length)ipucu.push('2D maç görünümü değişti: python -I -X utf8 araclar/akis-2d.py (masaüstünde -I olmadan)');
  if(LISTE){console.log(`Seçim: ad-denetimi${motor?', mac-deneme 4':''}${kural?', kariyer-deneme':''}`);for(const i of ipucu)console.log('  → '+i);return;}
  const isler=[calistir('ad-denetimi',[path.join('araclar','ad-denetimi.js')])];
  if(motor)isler.push(calistir('mac-deneme 4',[path.join('araclar','mac-deneme.js'),'4'],(k,c)=>k!==0?'çıkış '+k:/sonuç aynı/.test(c)?null:'tekrarlanabilirlik “sonuç aynı” değil'));
  if(kural)isler.push(calistir('kariyer-deneme',[path.join('araclar','kariyer-deneme.js')]));
  const sonuc=[gitDenetim()].concat(await Promise.all(isler));
  fs.writeFileSync(RAPOR,sonuc.map(r=>`==== ${r.ad} · ${r.neden||'geçti'} · ${r.sure.toFixed(1)} sn\n${r.cikti}`).join('\n'));
  for(const r of sonuc){
    console.log(`${r.neden?'!':' '} ${r.ad.padEnd(18)} ${r.neden||'geçti'}${r.sure?` · ${r.sure.toFixed(0)} sn`:''}`);
    if(r.neden){const s=r.cikti.split('\n').filter(x=>/^\s*!/.test(x)||/hata|Error/i.test(x)).slice(0,8);for(const x of(s.length?s:r.cikti.trim().split('\n').slice(-6)))console.log('    '+x.trim().slice(0,200));}
  }
  for(const i of ipucu)console.log('  → '+i);
  console.log(`Tam çıktı ${path.relative(KOK,RAPOR).split(path.sep).join('/')}`);
  process.exitCode=sonuc.some(r=>r.neden)?1:0;
})().catch(e=>{console.error(e.message);process.exit(2);});
