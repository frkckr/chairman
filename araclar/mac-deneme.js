#!/usr/bin/env node
/* ============ Chairman — maç deneme aracı ============
   Maç motorunu görüntüsüz, hızlıca oynatır ve maç istatistiklerini hedef tabloyla karşılaştırır.
   Kullanım:  node araclar/mac-deneme.js [maç sayısı, varsayılan 40] [ilk tohum, varsayılan 1]
   - Motor dosyaları index.html'deki sırayla yüklenir: js/goruntu.js'ten önceki mantık dosyaları
     (stil ve stat tarifleri hariç; motor onlara bağlı değildir).
   - Her maç santradan başlar (maç öncesi atlanır). Tohum aynıysa maç da aynıdır.
   - Maçlar işlemci çekirdeği sayısı kadar paralel oynatılır (bir maç ~7 sn).
   - Hedef dışında kalan satırlar "!" ile işaretlenir.
   - Seçenek --dizilis A,B: iki takımın dizilişi (MM2). Bilgi satırlarında takım savunması: ceza sahasında boşta rakip, çift markaj,
     karşı pres kazanımı, savunmada takım boyu/eni, kalecisiz süre.
   - MM0 (2026-10-02): hedefsiz bilgi satırları (takım ayrımı, topa sahip olma, kurtarış, pas/şut hızı, oyuncunun en yüksek hızı ve ivmesi,
     koşu mesafesi, topun bir oyuncunun gövdesinden geçtiği anlar) ve tekrarlanabilirlik denetimi (ilk tohum iki kez daha oynatılır; sonuç aynı
     olmalı, değilse çıkış kodu 1). Motor değişiklikleri bu satırlarla tabana göre karşılaştırılır (TEKNIK_PLAN §8). */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),os=require('os'),{spawn}=require('child_process');
const KOK=path.join(__dirname,'..');
/* seçenek: --dizilis A,B  iki takımın dizilişini kadro verisine dokunmadan değiştirir (ör. 4-3-3,4-2-3-1; MM2) */
const ARG=process.argv.slice(2),di=ARG.indexOf('--dizilis'),DIZILIS=di>=0?ARG.splice(di,2)[1]:(process.env.MAC_DENEME_DIZILIS||'');
const MAC_SAYISI=Math.max(1,parseInt(ARG[0]||'40',10));
const ILK_TOHUM=parseInt(ARG[1]||'1',10);

/* ---- motoru yükle ---- */
const html=fs.readFileSync(path.join(KOK,'index.html'),'utf8');
const sira=[...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m=>m[1]);
const DISARIDA=new Set(['js/stil-99.js','js/sunum-durumu.js','js/stadyum-tarifleri.js']);
const mantik=sira.slice(0,sira.indexOf('js/goruntu.js')).filter(f=>!DISARIDA.has(f));
const ctx=vm.createContext({console,Math,Date});
for(const f of mantik)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),ctx,{filename:f});

/* ---- hedef tablo: 10 dakikalık, kesintisiz maç (2026-09-28'de gözden geçirildi; bkz. YOL_HARITASI.md kararları) ----
   Oyuncular gerçek hızda koştuğu için bir maçta ~7 dakika (≈400 sn) oyun oynanır; gerçek bir maçta bu ~55 dakikadır.
   Gerçekçi kararlarla motor şut ve gol gibi önemli olayları gerçeğin dakika başına 2,5–3 katı sıklıkta üretir:
   gol sayısı gerçeğe yakındır; şut, korner, taç ve pas gibi sık tekrarlanan olaylar gerçek maçın yarısından azdır.
   Oranlar (isabet, pas isabeti, pas yönleri, uzun pas) gerçek maçlara göre tutulur. */
const HEDEF=[
  ['Gol','gol',1.8,3.0],
  ['Şut','sut',8,14],
  ['İsabetli şut oranı %','isabetOran',30,45],
  ['Korner','korner',2,6],
  ['Taç','tac',5,12],
  ['Kale vuruşu','kaleVurusu',2.5,8],
  ['Faul','faul',8,14],
  ['Sarı kart','sari',1.5,3.5],
  ['Kırmızı kart','kirmizi',0,0.2],
  ['Ofsayt','ofsayt',0.3,2],
  ['Pas','pas',110,200],
  ['Pas isabeti %','pasOran',65,80],
  ['İleri pas %','ileriOran',30,45],
  ['Yan pas %','yanOran',35,58],
  ['Geri pas %','geriOran',10,25],
  ['Uzun pas %','uzunOran',10,24],
  ['Hava topu mücadelesi','havaTopu',6,15],
  ['Uzatma 1. yarı (dk)','uzatma1',1,4],
  ['Uzatma 2. yarı (dk)','uzatma2',3,7],
  ['Değişiklik (takım başına)','degisiklik',2,4],
  ['Top oyunda %','oyundaOran',58,72]
];

/* ---- bilgi satırları (hedefsiz): motorun fiziğini ve hareketini izlemek için ---- */
const BILGI=[
  ['Gol ev / deplasman','golEv','golDep',1],['Şut ev / deplasman','sutEv','sutDep',1],['Topa sahip olma ev %','sahiplikEv',null,1],
  ['Kurtarış (kaleci)','kurtaris',null,1],['Kafa vuruşu','kafa',null,1],['Blok','blok',null,1],['Sekme','sekme',null,1],['Top kapma','kapma',null,1],
  ['Pas hızı ort. (m/sn)','pasHiz',null,1],['Şut hızı ort. (m/sn)','sutHiz',null,1],['Şut hızı en yüksek (m/sn)','sutHizMaks',null,1],
  ['Oyuncu en yüksek hız (m/sn)','hizMaks',null,2],['Oyuncu hız %99 (m/sn)','hiz99',null,2],['Oyuncu ivme %99 (m/sn²)','ivme99',null,1],
  ['Koşu mesafesi / oyuncu (m)','mesafe',null,0],['Top gövdeden geçti (kez)','icindenGecti',null,1],
  /* MM2: takım savunması */
  ['Ceza sahasında boşta rakip (sn)','bosta',null,1],['Çift markaj anı (sn)','cift',null,1],['Karşı pres kazanımı (kez)','karsiPres',null,1],
  ['Savunmada takım boyu (m)','boy',null,1],['Savunmada takım eni (m)','en',null,1],['Kalecisiz oynanan süre (sn)','kalecisiz',null,1]
];
const yuzdelik=(L,q)=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b);return S[Math.min(S.length-1,Math.floor(q*S.length))];};

/* ---- bir maç ---- */
function macOyna(tohum){
  const olay={save:0,header:0,block:0,sekme:0,steal:0},pasH=[],sutH=[];let m=null;
  const dinle=(ad,v)=>{if(ad in olay)olay[ad]++;const b=m&&m.ball;if(!b)return;const h=Math.sqrt(b.vx*b.vx+b.vy*b.vy+b.vz*b.vz);
    if(ad==='pass'||ad==='cross')pasH.push(h);else if(ad==='shot')sutH.push(h);};
  m=vm.runInContext(`(on,tohum,D)=>{const K=D?MAC_KADRO.map((k,i)=>Object.assign({},k,{taktik:Object.assign({},k.taktik,{dizilis:D[i]})})):MAC_KADRO;
    return new Match(on,{kadro:K,tohum,tunel:{x:0,z:-6}});}`,ctx)(dinle,tohum,DIZILIS?DIZILIS.split(','):null);
  m.macaGec();
  let adim=0;const MAKS=60*60*30,dt=1/60,onceki=new Map(),hizlar=[],ivmeler=[],icinde=new Set();let mesafe=0,gecti=0;
  let bosta=0,cift=0,karsiPres=0,kalecisiz=0,sonSahip=-1,kayip=[-99,-99];const boylar=[],enler=[];
  const PLm=52.5,MZm=34;
  while(m.phase!=='fulltime'&&adim<MAKS){
    m.step(dt);adim++;
    if(m.phase!=='play')continue;
    const b=m.ball,bh=Math.sqrt(b.vx*b.vx+b.vz*b.vz);
    /* MM2 ölçümleri: hücum eden takım topun sahibi (yoksa son dokunan) */
    {const st=b.sahip?b.sahip.team:-1,att=st>=0?st:b.sonTakim,def=1-att,d=m.dir[att];
     if(st>=0&&st!==sonSahip){if(sonSahip>=0)kayip[sonSahip]=m.t;if(m.t-kayip[st]<5)karsiPres++;kayip[st]=-99;sonSahip=st;}
     for(const t of[0,1]){const g=m.teams[t][0];if(!g.oyunda||g.rol!=='GK')kalecisiz+=dt;}
     if(b.x*d>PLm-35){const S=m.teams[def].filter(q=>q.oyunda&&q.rol!=='GK');
       for(const o of m.teams[att]){if(!o.oyunda||o.rol==='GK'||o===b.sahip)continue;if(o.x*d<PLm-18||Math.abs(o.z-MZm)>20)continue;
         let n=0,en=99;for(const q of S){const dd=Math.hypot(q.x-o.x,q.z-o.z);if(dd<en)en=dd;if(dd<1.5)n++;}
         if(en>2)bosta+=dt;if(n>=2)cift+=dt;}}
     if(st>=0&&adim%6===0){const S=m.teams[1-st].filter(q=>q.oyunda&&q.rol!=='GK');if(S.length){const X=S.map(q=>q.x),Z=S.map(q=>q.z);
       boylar.push(Math.max(...X)-Math.min(...X));enler.push(Math.max(...Z)-Math.min(...Z));}}}
    for(const p of m.players){if(!p.oyunda)continue;const sp=Math.sqrt(p.vx*p.vx+p.vz*p.vz),o=onceki.get(p);mesafe+=sp*dt;
      if(adim%6===0)hizlar.push(sp);
      if(o&&!(p.eylem&&p.eylem.kilit)&&!o.kilit&&adim%3===0)ivmeler.push(Math.sqrt((p.vx-o.vx)**2+(p.vz-o.vz)**2)/dt);
      onceki.set(p,{vx:p.vx,vz:p.vz,kilit:!!(p.eylem&&p.eylem.kilit)});
      /* top gövdenin içinden geçiyor: hızlı top, yerden 1,8 m'den alçak, gövde ekseninden 0,22 m'den yakın; o kişi topun sahibi/taşıyanı değil */
      const d=Math.sqrt((b.x-p.x)**2+(b.z-p.z)**2),ic=bh>3&&b.y<1.8&&d<0.22&&b.sahip!==p&&b.tasiyan!==p;
      if(ic&&!icinde.has(p)){gecti++;icinde.add(p);}else if(!ic)icinde.delete(p);}
  }
  const I=m.ist,top=a=>a[0]+a[1],ort=L=>L.length?L.reduce((a,c)=>a+c,0)/L.length:NaN;
  const s={sure:adim/60,bitmedi:m.phase!=='fulltime',gol:top(m.score),sut:top(I.sut),isabet:top(I.isabet),korner:top(I.korner),tac:top(I.tac),
    kaleVurusu:top(I.kaleVurusu),faul:top(I.faul),sari:top(I.sari),kirmizi:top(I.kirmizi),ofsayt:top(I.ofsayt),pas:top(I.pas),pasTamam:top(I.pasTamam),
    ileri:I.pasYon.ileri,yan:I.pasYon.yan,geri:I.pasYon.geri,uzun:I.uzunPas,havaTopu:I.havaTopu,
    uzatma1:I.uzatma[0],uzatma2:I.uzatma[1],degisiklik:top(I.degisiklik)/2,oyunda:I.oyunda,toplam:I.toplam};
  s.isabetOran=s.sut?100*s.isabet/s.sut:0;
  s.pasOran=s.pas?100*s.pasTamam/s.pas:0;
  const yonToplam=s.ileri+s.yan+s.geri||1;
  s.ileriOran=100*s.ileri/yonToplam;s.yanOran=100*s.yan/yonToplam;s.geriOran=100*s.geri/yonToplam;
  s.uzunOran=s.pas?100*s.uzun/s.pas:0;
  s.oyundaOran=100*s.oyunda/(s.toplam||1);
  Object.assign(s,{golEv:m.score[0],golDep:m.score[1],sutEv:I.sut[0],sutDep:I.sut[1],sahiplikEv:100*I.sahiplik[0]/((I.sahiplik[0]+I.sahiplik[1])||1),
    kurtaris:olay.save,kafa:olay.header,blok:olay.block,sekme:olay.sekme,kapma:olay.steal,pasHiz:ort(pasH),sutHiz:ort(sutH),sutHizMaks:sutH.length?Math.max(...sutH):NaN,
    hizMaks:hizlar.length?Math.max(...hizlar):NaN,hiz99:yuzdelik(hizlar,0.99),ivme99:yuzdelik(ivmeler,0.99),mesafe:mesafe/22,icindenGecti:gecti,
    bosta,cift,karsiPres,kalecisiz,boy:ort(boylar),en:ort(enler)});
  return s;
}

/* ---- işçi: kendisine verilen tohum aralığını oynatır, sonuçları JSON olarak yazar ---- */
if(process.env.MAC_DENEME_TOHUMLAR){
  const [a,b]=process.env.MAC_DENEME_TOHUMLAR.split(',').map(Number),out=[];
  for(let t=a;t<b;t++)out.push(macOyna(t));
  process.stdout.write(JSON.stringify(out));
}else{
  /* ---- maçları çekirdeklere dağıt, sonuçları topla, özetle ---- */
  const t0=Date.now(),isci=Math.max(1,Math.min(os.cpus().length,MAC_SAYISI)),parca=Math.ceil(MAC_SAYISI/isci),isler=[];
  for(let i=0;i<isci;i++){const a=ILK_TOHUM+i*parca,b=Math.min(ILK_TOHUM+MAC_SAYISI,a+parca);if(a>=b)break;
    isler.push(new Promise((tamam,hata)=>{
      const c=spawn(process.execPath,[__filename],{env:Object.assign({},process.env,{MAC_DENEME_TOHUMLAR:a+','+b,MAC_DENEME_DIZILIS:DIZILIS})});let s='';
      c.stdout.on('data',d=>s+=d);c.stderr.on('data',d=>process.stderr.write(d));
      c.on('close',k=>k===0?tamam(JSON.parse(s)):hata(new Error(`tohum ${a}–${b-1} oynatılamadı (çıkış kodu ${k})`)));}));}
  Promise.all(isler).then(p=>{
    const sonuclar=[].concat(...p);
    const deger=k=>sonuclar.map(s=>s[k]).filter(x=>typeof x==='number'&&!Number.isNaN(x));
    const ort=k=>{const v=deger(k);return v.length?v.reduce((a,b)=>a+b,0)/v.length:NaN;};
    const sap=k=>{const v=deger(k),o=ort(k);return v.length?Math.sqrt(v.reduce((a,b)=>a+(b-o)*(b-o),0)/v.length):NaN;};
    const f=(x,n)=>Number.isNaN(x)?'—':x.toFixed(n);
    console.log(`\nChairman maç deneme aracı · ${MAC_SAYISI} maç · tohum ${ILK_TOHUM}…${ILK_TOHUM+MAC_SAYISI-1} · ${isler.length} çekirdek · ${((Date.now()-t0)/1000).toFixed(1)} sn${DIZILIS?' · diziliş '+DIZILIS:''}`);
    console.log(`Motor dosyaları: ${mantik.join(', ')}\n`);
    console.log('  '+'Ölçüm'.padEnd(28)+'Ortalama'.padStart(10)+'  ±'.padEnd(8)+'Hedef'.padStart(12));
    let disarida=0;
    for(const [ad,k,a,b] of HEDEF){
      const o=ort(k),dis=!Number.isNaN(o)&&(o<a||o>b);if(dis)disarida++;
      console.log((dis?'! ':'  ')+ad.padEnd(28)+f(o,1).padStart(10)+('  '+f(sap(k),1)).padEnd(8)+`${a}–${b}`.padStart(12));
    }
    const bitmeyen=sonuclar.filter(s=>s.bitmedi).length;
    console.log(`\nOrtalama maç süresi: ${f(ort('sure')/60,1)} dakika (gerçek zaman)${bitmeyen?` · BİTMEYEN MAÇ: ${bitmeyen}`:''}`);
    console.log(`Hedef dışında: ${disarida} satır`);
    console.log('\n  Bilgi (hedefsiz)');
    for(const [ad,k,k2,n] of BILGI)console.log('  '+ad.padEnd(28)+(f(ort(k),n)+(k2?' / '+f(ort(k2),n):'')).padStart(16)+(k2?'':('  ± '+f(sap(k),n))));
    /* tekrarlanabilirlik: ilk tohum bu süreçte iki kez oynatılır, işçinin sonucuyla da karşılaştırılır */
    const a=JSON.stringify(macOyna(ILK_TOHUM)),b=JSON.stringify(macOyna(ILK_TOHUM)),c=JSON.stringify(sonuclar[0]);
    const ayni=a===b&&a===c;
    console.log('\n'+(ayni?'  ':'! ')+`Tekrarlanabilirlik: tohum ${ILK_TOHUM} üç kez oynatıldı, ${ayni?'sonuç aynı':'SONUÇ FARKLI'}`);
    if(!ayni)process.exitCode=1;
  }).catch(e=>{console.error(e.message);process.exit(1);});
}
