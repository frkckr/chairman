#!/usr/bin/env node
/* ============ Chairman — oyuncu ve karar karnesi (gerçekçilik planı T0; MAC_MOTORU_GERCEKCILIK_PLANI.md Ek F) ============
   Maçları görüntüsüz oynatır ve iki şeyi yazar:
   1) Topla karar izi: kararVer'in her çağrısında seçenek türlerinin en iyi değeri, seçilen eylem, alıcının grubu (stoper, bek, merkez, kanat,
      forvet), baskı ve sahadaki yer. "Neden hep pas, neden hep forvete" sorusu bununla yanıtlanır.
   2) Bireysellik: ilk 11'lerin oyuncu başına eylem sayıları (pas, şut, çalım girişimi, müdahale, faul, alış, kafa, derin koşu), topa sahip olma
      süresi, tempo, depar ve yürüme payı; özellik ile davranış arasındaki ilişki (Pearson r).
   Kullanım: node araclar/oyuncu-karnesi.js [maç sayısı, varsayılan 8] [ilk tohum, varsayılan 1] [--duyarlilik]
   --duyarlilik (T3 kabulü; Claude kararı 2026-10-07): kadrolarda aynı mevki grubundaki oyuncuların özellikleri neredeyse aynı olduğu için
   (stoperlerde sürüş 36–45) doğal r gürültüden ibarettir. Bu kipte her takımın her mevki grubundaki iki oyuncuya sürüş, müdahale ve sertlikte
   ±0,15 verilir (çift içinde zıt: takım gücü değişmez; üç özelliğin işaretleri çiftler arasında bağımsız), profil yeniden türetilir ve aynı
   r tanımı ölçülür: motorun özelliğe duyarlılığı. Kipsiz çalıştırma doğal kadroyla bilgi verir.
   Motor dosyaları index.html sırasıyla yüklenir (araclar/motor-yukle.js; mac-deneme.js ile aynı). kararVer ve secenekler yalnız kayıt için
   sarılır: sonuçları değiştirmez, rastlantı çekmez (baskiAltinda saftır). MAC_DENEME_AYAR ve MAC_DENEME_DIZILIS mac-deneme.js'teki gibi
   çalışır. Tek süreçtir. */
'use strict';
const vm=require('vm');
const ARG=process.argv.slice(2),DUYARLILIK=ARG.includes('--duyarlilik'),SAYI=ARG.filter(a=>!a.startsWith('--'));
const N=Math.max(1,parseInt(SAYI[0]||'8',10)),T0=parseInt(SAYI[1]||'1',10),dt=1/60,DELTA=0.2;
const KARAR=[];
const {ctx}=require('./motor-yukle').motorYukle({__kayit:o=>KARAR.push(o)});
if(process.env.MAC_DENEME_AYAR)vm.runInContext(`Object.assign(MOTOR_AYAR,${JSON.stringify(JSON.parse(process.env.MAC_DENEME_AYAR))})`,ctx);
const DIZILIS=process.env.MAC_DENEME_DIZILIS?process.env.MAC_DENEME_DIZILIS.split(','):null;
/* karar izi: secenekler'in son listesi ve kararVer'in seçimi */
vm.runInContext(`(function(){const _s=secenekler,_k=kararVer;let son=null;const sonNo=new Map();
  const grup=q=>!q?'-':q.rol==='GK'?'kaleci':q.mevki.bek?'bek':q.rol==='DEF'?'stoper':q.mevki.kanat?'kanat':q.rol==='OS'?'merkez':'forvet';
  secenekler=function(m,p){const S=_s(m,p);son=S;return S;};
  kararVer=function(m,p){const r=_k(m,p),S=son||[],d=m.dir[p.team],en={};son=null;
    for(const s of S){const t=s.tur==='ara'||s.tur==='uzun'||s.tur==='geriCevir'?'pas':s.tur;if(en[t]==null||s.deger>en[t])en[t]=s.deger;}
    let dd=99;for(const o of m.teams[1-p.team])if(o.oyunda)dd=Math.min(dd,hyp(o.x-p.x,o.z-p.z));
    /* T2: topu tutarken saniyede 5–8 kez karar verilir; sahipliğin ilk kararı ayrıca işaretlenir */
    const ilk=sonNo.get(p)!==m.sahiplikNo;sonNo.set(p,m.sahiplikNo);
    __kayit({g:grup(p),sec:r.tur,alici:grup(r.alici),L:r.L||0,P:r.P!=null?r.P:null,en,dd,u:m.ball.x*d,ileri:r.alici?(r.hx-m.ball.x)*d:0,ilk});
    return r;};})();`,ctx);
/* duyarlılık kipi: her takımın her mevki grubunda (profilin grup alanı) sıraya göre çiftler; çiftin ilkine +, ikincisine − (sürüş, müdahale,
   sertlik; işaretler çift sırasının bitlerinden, çiftler arasında bağımsız). Aynı oyuncu her maçta aynı farkı alır (sayaçlar ada göre birikir).
   Kütle ve çeviklik önbelleği sıfırlanır, profil yeniden türetilir (profilKur) */
const profilKurCtx=vm.runInContext('profilKur',ctx),kirp=x=>Math.min(0.95,Math.max(0.15,x)),DUY=new Map();   /* takım:ad → özelliğin işareti */
function duyarlilikUygula(m){let k=0;
  for(let t=0;t<2;t++){const G={};for(const p of m.teams[t]){if(p.rol==='GK')continue;const g=p.profil?p.profil.grup:p.rol;(G[g]||(G[g]=[])).push(p);}
    for(const g of Object.keys(G).sort()){const L=G[g].sort((a,b)=>a.n-b.n),s=[k&1?1:-1,k&2?1:-1,k&4?1:-1];k++;
      L.forEach((p,j)=>{const w=j%2?-1:1,oz=p.oz;oz.surus=kirp(oz.surus+w*s[0]*DELTA);oz.mudahale=kirp(oz.mudahale+w*s[1]*DELTA);oz.sertlik=kirp(oz.sertlik+w*s[2]*DELTA);
        DUY.set(t+':'+p.name,{surus:w*s[0],mudahale:w*s[1],sertlik:w*s[2]});p._kutle=0;p._cev=null;profilKurCtx(p,m.tohum);});}}}
/* oyuncu sayaçları (takım + ad) */
const O={},hyp=Math.hypot;
const oy=p=>{const k=p.team+':'+p.name;return O[k]||(O[k]={team:p.team,ad:p.name,rol:p.rol,mevki:p.mevki&&p.mevki.ad,oz:p.oz,prof:p.profil?p.profil.rol:null,grup:p.profil?p.profil.grup:p.rol,eg:p.profil?p.profil.egilim:null,form:p.profil?p.profil.form:1,
  sure:0,mes:0,sprint:0,yuru:0,top:0,pas:0,sut:0,kafa:0,mud:0,faul:0,calim:0,kosu:0,alis:0,tasima:0});};
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
  if(DUYARLILIK)duyarlilikUygula(m);
  m.macaGec();const calim=new Map();let a=0,sahipOnce=null,yol=0;   /* yol: sahipliğin kesintisiz yolu (m); 5 m'den uzunu taşıma sayılır (T3; r-karne ile aynı) */
  while(m.phase!=='fulltime'&&a<60*60*30){m.step(dt);a++;if(m.phase!=='play'){if(sahipOnce&&yol>5)oy(sahipOnce).tasima++;sahipOnce=null;yol=0;continue;}
    const sh=m.ball.sahip;if(sh!==sahipOnce){if(sahipOnce&&yol>5)oy(sahipOnce).tasima++;sahipOnce=sh;yol=0;}
    for(const p of m.players){if(!p.oyunda)continue;const P=oy(p),sp=hyp(p.vx,p.vz);P.sure+=dt;P.mes+=sp*dt;if(sp>7)P.sprint+=sp*dt;if(sp<2)P.yuru+=dt;
      if(m.ball.sahip===p){P.top+=dt;yol+=sp*dt;}const c=p._calim;if(c&&calim.get(p)!==c)P.calim++;calim.set(p,c||null);}}
}
const f1=x=>x==null||Number.isNaN(x)?'—':x.toFixed(1),f2=x=>x==null||Number.isNaN(x)?'—':x.toFixed(2),ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN;
const say=(L,f)=>{const o={};for(const k of L){const a=f(k);o[a]=(o[a]||0)+1;}return o;};
const yuzde=o=>{const t=Object.values(o).reduce((a,b)=>a+b,0);return Object.entries(o).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+' '+f1(100*v/t)).join(' · ');};
const tip=k=>k.sec==='ara'||k.sec==='uzun'||k.sec==='geriCevir'?'pas':k.sec,K=KARAR;
console.log(`\nChairman oyuncu ve karar karnesi · ${N} maç · tohum ${T0}…${T0+N-1} · ${K.length} karar (maç başına ${f1(K.length/N)})`+(DUYARLILIK?` · DUYARLILIK kipi (sürüş, müdahale, sertlik ±${DELTA})`:''));
console.log('\n[1] Topla karar: seçilen eylem % (T2: "hepsi" topu tutarken her düşünme anını sayar; "ilk" sahipliğin ilk kararıdır)');
console.log('    hepsi                 '+yuzde(say(K,tip)));
for(const [ad,f] of[['rakip >6 m (rahat)',k=>k.dd>6],['rakip 3–6 m',k=>k.dd>3&&k.dd<=6],['rakip <3 m (baskı)',k=>k.dd<=3]]){const L=K.filter(f);
  console.log('    '+ad.padEnd(22)+'('+f1(100*L.length/K.length)+'% karar) '+yuzde(say(L,tip)));}
const KI=K.filter(k=>k.ilk);
console.log('    ilk karar             ('+KI.length+') '+yuzde(say(KI,tip)));
for(const [ad,f] of[['  ilk, rakip >6 m',k=>k.dd>6],['  ilk, rakip 3–6 m',k=>k.dd>3&&k.dd<=6],['  ilk, rakip <3 m',k=>k.dd<=3]]){const L=KI.filter(f);
  if(L.length)console.log('    '+ad.padEnd(22)+'('+f1(100*L.length/KI.length)+'% ilk) '+yuzde(say(L,tip)));}
console.log('\n[2] Seçenek türlerinin en iyi değeri (puan = gol olasılığı × 100)');
/* T2: eski 'sur' (sürme) yerine taşıma ('tasi') ve bekleme ('bekle'); 'koru' gövdeyle koruma */
for(const t of['pas','tasi','bekle','koru','sut','orta','uzaklastir']){const L=K.filter(k=>k.en[t]!=null);
  console.log('    '+t.padEnd(11)+'kararların %'+f1(100*L.length/K.length).padStart(5)+'\'inde var · ort. '+f2(ort(L.map(k=>k.en[t]))).padStart(6)+' · seçilme %'+f1(100*K.filter(k=>tip(k)===t).length/K.length));}
{const L=KI.filter(k=>k.en.pas!=null&&k.en.tasi!=null),R=L.filter(k=>k.dd>6);
 console.log('    ilk kararda en iyi pas − en iyi taşıma ort. '+f2(ort(L.map(k=>k.en.pas-k.en.tasi)))+' (rahatken '+f2(ort(R.map(k=>k.en.pas-k.en.tasi)))+') · taşımanın daha değerli olduğu ilk karar %'+f1(100*L.filter(k=>k.en.tasi>k.en.pas).length/(L.length||1)));}
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
const pearson=(a,b)=>{const ma=ort(a),mb=ort(b);let x=0,y=0,z=0;for(let i=0;i<a.length;i++){x+=(a[i]-ma)*(b[i]-mb);y+=(a[i]-ma)**2;z+=(b[i]-mb)**2;}return x/Math.sqrt(y*z||1);};
const S=L.filter(o=>o.rol!=='GK'),kor=(fa,fb,G)=>pearson((G||S).map(fa),(G||S).map(fb));
/* hat içi (T3 "aynı hatta"): her mevki grubunun (stoper, bek, merkez, kanat, forvet; profilin grup alanı) ortalaması iki değişkenden de
   çıkarılıp havuzlanır; mevkinin payı düşer, aynı yerdeki oyuncuların farkı kalır */
const hatIci=(fa,fb)=>{const A=[],B=[];for(const h of['stoper','bek','merkez','kanat','FV']){const G=S.filter(o=>o.grup===h);if(G.length<3)continue;const ma=ort(G.map(fa)),mb=ort(G.map(fb));for(const o of G){A.push(fa(o)-ma);B.push(fb(o)-mb);}}return pearson(A,B);};
const cal=[o=>o.oz.surus,o=>o.calim/o.sure],tas=[o=>o.oz.surus,o=>o.tasima/o.sure],mdh=[o=>o.oz.mudahale,o=>o.mud/o.sure],srt=[o=>o.oz.sertlik,o=>o.faul/o.sure];
/* T3 kabulü hat içi r ile ölçülür (Claude kararı 2026-10-07: havuzlanmış r mevkinin payını ölçer — bek çok taşır, forvet çok şut atar; planın
   amacı aynı durumda farklı oyuncunun farklı davranmasıdır). Havuzlanmış r bilgi olarak yazılır. Hedefler: sürüş↔çalım ve ↔taşıma ≥ 0,6,
   müdahale↔müdahale ≥ 0,4, sertlik↔faul ≥ 0,4; 80 maçta değerlendirilir (az maçta sayılar Poisson gürültüsüyle seyrelir) */
console.log('\n[7] Özellik ↔ davranış (saha oyuncuları, Pearson r; bilgi): hat içi = mevki grubunun ortalaması düşülmüş; havuzlanmış = bütün saha oyuncuları');
console.log('    hat içi: sürüş↔çalım '+f2(hatIci(...cal))+' · sürüş↔taşıma (>5 m) '+f2(hatIci(...tas))+' · müdahale↔müdahale '+f2(hatIci(...mdh))+' · sertlik↔faul '+f2(hatIci(...srt))+'   (planın T3 eşikleri 0,6 · 0,6 · 0,4 · 0,4; kabul [7b] ile)');
console.log('    havuzlanmış: sürüş↔çalım '+f2(kor(...cal))+' · sürüş↔taşıma '+f2(kor(...tas))+' · müdahale↔müdahale '+f2(kor(...mdh))+' (DEF '+f2(kor(mdh[0],mdh[1],S.filter(o=>o.rol==='DEF')))+', OS '+f2(kor(mdh[0],mdh[1],S.filter(o=>o.rol==='OS')))+')'+
  ' · sertlik↔faul '+f2(kor(...srt))+' · sürüş↔topa sahip olma '+f2(kor(o=>o.oz.surus,o=>o.top/o.sure))+' · şut↔şut '+f2(kor(o=>o.oz.sut,o=>o.sut/o.sure))+' · hız↔depar '+f2(kor(o=>o.oz.hiz,o=>o.sprint/o.sure))+
  ' · dayanıklılık↔mesafe '+f2(kor(o=>o.oz.dayaniklilik,o=>o.mes/o.sure))+' · karar↔pas '+f2(kor(o=>o.oz.karar,o=>o.pas/o.sure)));
/* T3 kabulü (Claude kararı 2026-10-07; duyarlılık kipi): özelliği +DELTA olan oyuncuların davranış sıklığı (sayı / top oyunda süre) ÷ −DELTA
   olanlarınki; %95 güven aralığı Poisson yaklaşımıyla (ln oranının SE'si √(1/n₊ + 1/n₋)). Seyrek olaylarda (maçta 4–8 faul, müdahale ya da çalım)
   oyuncu başına Pearson r gürültüden ibarettir; toplam oranı aynı soruyu kararlı ölçer. Hedef: oran ≥ 1,25 ve aralığın alt ucu > 1 (80 maç) */
if(DUYARLILIK){
  const oran=(attr,f)=>{let np=0,sp=0,nm=0,sm=0;for(const o of S){const d=DUY.get(o.team+':'+o.ad);if(!d)continue;const c=f(o);if(d[attr]>0){np+=c;sp+=o.sure;}else{nm+=c;sm+=o.sure;}}
    const r=sm&&nm?(np/sp)/(nm/sm):NaN,se=Math.sqrt(1/Math.max(1,np)+1/Math.max(1,nm));return{r,lo:r*Math.exp(-1.96*se),hi:r*Math.exp(1.96*se),np,nm};};
  console.log(`\n[7b] Duyarlılık (T3 kabulü): özelliği +${DELTA} olanların sıklığı ÷ −${DELTA} olanlarınki [%95 GA] (n₊ / n₋); hedef oran ≥ 1,25 ve alt uç > 1`);
  for(const [ad,attr,f] of[['sürüş → çalım','surus',o=>o.calim],['sürüş → taşıma (>5 m)','surus',o=>o.tasima],['müdahale → müdahale girişimi','mudahale',o=>o.mud],['sertlik → faul','sertlik',o=>o.faul]]){
    const o=oran(attr,f),ok=o.r>=1.25&&o.lo>1;
    console.log((ok?'  ':'! ')+ad.padEnd(32)+f2(o.r)+'  ['+f2(o.lo)+'–'+f2(o.hi)+']  ('+o.np+' / '+o.nm+')');}
}
console.log('\n[8] Profil (T3): rol, gün formu ve en belirgin iki eğilim (ilk 11\'ler)');
for(const o of L){if(!o.prof||!o.eg)continue;const E=Object.entries(o.eg).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,2).map(([k,v])=>k+(v>=0?' +':' −')+Math.abs(v).toFixed(2));
  console.log('    '+(o.team+' '+o.ad).padEnd(14)+String(o.mevki||o.rol).padEnd(6)+String(o.prof).padEnd(17)+'form '+o.form.toFixed(3)+'  '+E.join(' · '));}
