#!/usr/bin/env node
/* ============ Chairman — oyuncu ve karar karnesi (gerçekçilik planı T0; MAC_MOTORU_GERCEKCILIK_PLANI.md Ek F) ============
   Maçları görüntüsüz oynatır ve iki şeyi yazar:
   1) Topla karar izi: kararVer'in her çağrısında seçenek türlerinin en iyi değeri, seçilen eylem, alıcının grubu (stoper, bek, merkez, kanat,
      forvet), baskı ve sahadaki yer. "Neden hep pas, neden hep forvete" sorusu bununla yanıtlanır.
   2) Bireysellik: ilk 11'lerin oyuncu başına eylem sayıları (pas, şut, çalım girişimi, müdahale, faul, alış, kafa, derin koşu), topa sahip olma
      süresi, tempo, depar ve yürüme payı; özellik ile davranış arasındaki ilişki (Pearson r).
   Kullanım: node araclar/oyuncu-karnesi.js [maç sayısı, varsayılan 8] [ilk tohum, varsayılan 1]
   Motor dosyaları index.html sırasıyla yüklenir (araclar/motor-yukle.js; mac-deneme.js ile aynı). kararVer ve secenekler yalnız kayıt için
   sarılır: sonuçları değiştirmez, rastlantı çekmez (baskiAltinda saftır). MAC_DENEME_AYAR ve MAC_DENEME_DIZILIS mac-deneme.js'teki gibi
   çalışır. Tek süreçtir. */
'use strict';
const vm=require('vm');
const N=Math.max(1,parseInt(process.argv[2]||'8',10)),T0=parseInt(process.argv[3]||'1',10),dt=1/60;
const KARAR=[];
const {ctx}=require('./motor-yukle').motorYukle({__kayit:o=>KARAR.push(o)});
if(process.env.MAC_DENEME_AYAR)vm.runInContext(`Object.assign(MOTOR_AYAR,${JSON.stringify(JSON.parse(process.env.MAC_DENEME_AYAR))})`,ctx);
const DIZILIS=process.env.MAC_DENEME_DIZILIS?process.env.MAC_DENEME_DIZILIS.split(','):null;
/* karar izi: secenekler'in son listesi ve kararVer'in seçimi */
vm.runInContext(`(function(){const _s=secenekler,_k=kararVer;let son=null;
  const grup=q=>!q?'-':q.rol==='GK'?'kaleci':q.mevki.bek?'bek':q.rol==='DEF'?'stoper':q.mevki.kanat?'kanat':q.rol==='OS'?'merkez':'forvet';
  secenekler=function(m,p){const S=_s(m,p);son=S;return S;};
  kararVer=function(m,p){const r=_k(m,p),S=son||[],d=m.dir[p.team],en={};son=null;
    for(const s of S){const t=s.tur==='ara'||s.tur==='uzun'||s.tur==='geriCevir'?'pas':s.tur;if(en[t]==null||s.deger>en[t])en[t]=s.deger;}
    let dd=99;for(const o of m.teams[1-p.team])if(o.oyunda)dd=Math.min(dd,hyp(o.x-p.x,o.z-p.z));
    __kayit({g:grup(p),sec:r.tur,alici:grup(r.alici),L:r.L||0,P:r.P!=null?r.P:null,en,dd,u:m.ball.x*d,ileri:r.alici?(r.hx-m.ball.x)*d:0});
    return r;};})();`,ctx);
/* oyuncu sayaçları (takım + ad) */
const O={},hyp=Math.hypot;
const oy=p=>{const k=p.team+':'+p.name;return O[k]||(O[k]={team:p.team,ad:p.name,rol:p.rol,mevki:p.mevki&&p.mevki.ad,oz:p.oz,sure:0,mes:0,sprint:0,yuru:0,top:0,pas:0,sut:0,kafa:0,mud:0,faul:0,calim:0,kosu:0,alis:0});};
for(let tohum=T0;tohum<T0+N;tohum++){
  let m=null;
  const dinle=(ad,v)=>{if(!m)return;
    if(ad==='pass'||ad==='cross'){if(v.p)oy(v.p).pas++;}
    else if(ad==='shot'){if(v.p)oy(v.p).sut++;}
    else if(ad==='header'){if(v.p){oy(v.p).kafa++;if(v.shot)oy(v.p).sut++;}}
    else if(ad==='mudahale'){if(v.p)oy(v.p).mud++;}
    else if((ad==='faul'&&!v.avantajdan)||ad==='avantaj'){if(v.faulYapan)oy(v.faulYapan).faul++;}
    else if(ad==='ilkDokunus'){if(v.p)oy(v.p).alis++;}
    else if(ad==='kosu'){if(v.p&&!v.verKac)oy(v.p).kosu++;}};
  m=vm.runInContext(`(on,t,D)=>{const K=D?MAC_KADRO.map((k,i)=>Object.assign({},k,{taktik:Object.assign({},k.taktik,{dizilis:D[i]})})):MAC_KADRO;
    return new Match(on,{kadro:K,tohum:t,tunel:{x:0,z:-6}});}`,ctx)(dinle,tohum,DIZILIS);
  m.macaGec();const calim=new Map();let a=0;
  while(m.phase!=='fulltime'&&a<60*60*30){m.step(dt);a++;if(m.phase!=='play')continue;
    for(const p of m.players){if(!p.oyunda)continue;const P=oy(p),sp=hyp(p.vx,p.vz);P.sure+=dt;P.mes+=sp*dt;if(sp>7)P.sprint+=sp*dt;if(sp<2)P.yuru+=dt;
      if(m.ball.sahip===p)P.top+=dt;const c=p._calim;if(c&&calim.get(p)!==c)P.calim++;calim.set(p,c||null);}}
}
const f1=x=>x==null||Number.isNaN(x)?'—':x.toFixed(1),f2=x=>x==null||Number.isNaN(x)?'—':x.toFixed(2),ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN;
const say=(L,f)=>{const o={};for(const k of L){const a=f(k);o[a]=(o[a]||0)+1;}return o;};
const yuzde=o=>{const t=Object.values(o).reduce((a,b)=>a+b,0);return Object.entries(o).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+' '+f1(100*v/t)).join(' · ');};
const tip=k=>k.sec==='ara'||k.sec==='uzun'||k.sec==='geriCevir'?'pas':k.sec,K=KARAR;
console.log(`\nChairman oyuncu ve karar karnesi · ${N} maç · tohum ${T0}…${T0+N-1} · ${K.length} karar (maç başına ${f1(K.length/N)})`);
console.log('\n[1] Topla karar: seçilen eylem %');
console.log('    hepsi                 '+yuzde(say(K,tip)));
for(const [ad,f] of[['rakip >6 m (rahat)',k=>k.dd>6],['rakip 3–6 m',k=>k.dd>3&&k.dd<=6],['rakip <3 m (baskı)',k=>k.dd<=3]]){const L=K.filter(f);
  console.log('    '+ad.padEnd(22)+'('+f1(100*L.length/K.length)+'% karar) '+yuzde(say(L,tip)));}
console.log('\n[2] Seçenek türlerinin en iyi değeri (puan = gol olasılığı × 100)');
for(const t of['pas','sur','koru','sut','orta','uzaklastir']){const L=K.filter(k=>k.en[t]!=null);
  console.log('    '+t.padEnd(11)+'kararların %'+f1(100*L.length/K.length).padStart(5)+'\'inde var · ort. '+f2(ort(L.map(k=>k.en[t]))).padStart(6)+' · seçilme %'+f1(100*K.filter(k=>tip(k)===t).length/K.length));}
{const L=K.filter(k=>k.en.pas!=null&&k.en.sur!=null),R=L.filter(k=>k.dd>6);
 console.log('    en iyi pas − en iyi sürme ort. '+f2(ort(L.map(k=>k.en.pas-k.en.sur)))+' (rahatken '+f2(ort(R.map(k=>k.en.pas-k.en.sur)))+') · sürmenin daha değerli olduğu karar %'+f1(100*L.filter(k=>k.en.sur>k.en.pas).length/(L.length||1)));}
console.log('\n[3] Pas');
console.log('    alıcı %: '+yuzde(say(K.filter(k=>k.alici!=='-'),k=>k.alici)));
console.log('    boy ort. '+f1(ort(K.filter(k=>k.L>0).map(k=>k.L)))+' m · ileri kazanç ort. '+f1(ort(K.filter(k=>k.alici!=='-').map(k=>k.ileri)))+' m · seçilen pasın başarı tahmini ort. '+f2(ort(K.filter(k=>k.P!=null&&k.alici!=='-').map(k=>k.P))));
console.log('\n[4] Karar veren → seçim / alıcı');
for(const g of['stoper','bek','merkez','kanat','forvet','kaleci']){const L=K.filter(k=>k.g===g);if(!L.length)continue;
  console.log('    '+g.padEnd(8)+'maç başına '+f1(L.length/N).padStart(5)+' · '+yuzde(say(L,tip)));
  console.log('    '+''.padEnd(8)+'→ '+yuzde(say(L.filter(k=>k.alici!=='-'),k=>k.alici)));}
console.log('\n[5] Sahadaki yere göre seçim (alıcı)');
for(const [ad,f] of[['kendi üçte bir',k=>k.u<-17.5],['orta üçte bir',k=>k.u>=-17.5&&k.u<17.5],['son üçte bir',k=>k.u>=17.5]]){const L=K.filter(f);
  console.log('    '+ad.padEnd(16)+yuzde(say(L,tip))+'  | '+yuzde(say(L.filter(k=>k.alici!=='-'),k=>k.alici)));}
console.log('\n[6] Bireysellik: ilk 11\'ler (sayılar 10 dakikalık top oyunda süresine oranlı)');
console.log('    '+'oyuncu'.padEnd(14)+'mevki'.padEnd(6)+'hız sür pas şut mdh'.padEnd(21)+'pas'.padStart(6)+'şut'.padStart(6)+'çalım'.padStart(7)+'mdh'.padStart(6)+'faul'.padStart(6)+'alış'.padStart(6)+'kafa'.padStart(6)+'koşu'.padStart(6)+'top sn'.padStart(8)+'m/dk'.padStart(6)+'depar m'.padStart(9)+'yürü %'.padStart(8));
const L=Object.values(O).filter(o=>o.sure>N*60*3).sort((a,b)=>a.team-b.team);
for(const o of L){const k=600/o.sure,z=o.oz,oz=[z.hiz,z.surus,z.pas,z.sut,z.mudahale].map(x=>String(Math.round(x*100)).padStart(3)).join(' ');
  console.log('    '+(o.team+' '+o.ad).padEnd(14)+String(o.mevki||o.rol).padEnd(6)+oz.padEnd(21)+[o.pas,o.sut,o.calim,o.mud,o.faul,o.alis,o.kafa,o.kosu].map((v,i)=>f1(v*k).padStart(i===2?7:6)).join('')+
    f1(o.top*k).padStart(8)+String(Math.round(o.mes/o.sure*60)).padStart(6)+String(Math.round(o.sprint*k)).padStart(9)+f1(100*o.yuru/o.sure).padStart(8));}
const S=L.filter(o=>o.rol!=='GK'),kor=(fa,fb)=>{const a=S.map(fa),b=S.map(fb),ma=ort(a),mb=ort(b);let x=0,y=0,z=0;for(let i=0;i<a.length;i++){x+=(a[i]-ma)*(b[i]-mb);y+=(a[i]-ma)**2;z+=(b[i]-mb)**2;}return x/Math.sqrt(y*z||1);};
console.log('\n[7] Özellik ↔ davranış (saha oyuncuları, Pearson r; planın T3 hedefi ≥ 0,4–0,6)');
console.log('    sürüş↔çalım '+f2(kor(o=>o.oz.surus,o=>o.calim/o.sure))+' · sürüş↔topa sahip olma '+f2(kor(o=>o.oz.surus,o=>o.top/o.sure))+' · şut↔şut '+f2(kor(o=>o.oz.sut,o=>o.sut/o.sure))+
  ' · hız↔depar '+f2(kor(o=>o.oz.hiz,o=>o.sprint/o.sure))+' · müdahale↔müdahale '+f2(kor(o=>o.oz.mudahale,o=>o.mud/o.sure))+' · sertlik↔faul '+f2(kor(o=>o.oz.sertlik,o=>o.faul/o.sure))+
  ' · dayanıklılık↔mesafe '+f2(kor(o=>o.oz.dayaniklilik,o=>o.mes/o.sure))+' · karar↔pas '+f2(kor(o=>o.oz.karar,o=>o.pas/o.sure)));
