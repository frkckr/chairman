/* ============ Z1 sınav sahnesi S10 — geri çevirme ve üç derinlikli kutu girişi (FUTBOL_KUTUPHANESI §8; H.7 S10) ============
   Esin: İspanya–İtalya 2012 (Silva), Türkiye–Senegal 2002 (İlhan), Man City'nin geri çevirmeleri. Örnek kodlanmaz; kabul biçimdir.
   Kurulum (ev sahibinin hücum çerçevesinde): sağ kanat (5) topla kale çizgisine 8 m, ortanın 22 m sağında, çizgiye 4 m/sn ile iniyor. Hücumcular:
   forvet (10) kaleye 15 m'de ortanın 3 m sağında, hedef forvet (9) 19 m'de 4 m solunda, merkez orta saha (7) 27 m'de ortada (geç gelen adayı), sol
   kanat (8) 17 m'de 15 m solda; hepsi kaleye 3 m/sn ile. Konuk savunma kendi kalesine geri koşuyor: bek (1) kanadın 2,5 m önünde, stoperler (2, 3)
   kaleye 9–10 m'de, öbür bek (4) 12 m'de, iki orta saha (6, 7) 24 m'den geri koşuyor (3–5 m/sn kaleye). Kaleciler kalede, öbürleri oyun dışı.
   Karar katmanı açık; 4 sn ya da topun bırakılmasına dek (pas, orta, şut, kayıp).
   Kollar: MOTOR_AYAR.plan 0 ve 31 (aynı tohum, aynı başlangıç; plan katmanı yoksa yalnız 0). Kabiliyet (Z1j): plan 31'de hücumcuların görüş, karar
   ve pası ±0,2.
   Ölçü: kanadın ilk bırakışı — geri çevirme (yerden, geriye ya da yana, kaleye 4–22 m ve ortaya 12 m içindeki hedefe; z-kalip ile aynı geometri),
   orta (havadan), şut, öteki pas, kayıp. Geri çevirme anında üç bandın (ön direk ≤ 7 m, penaltı noktası 7–14 m, yay 14–22 m; ortaya 10–12 m) kaçında
   hücumcu var; geç gelenin (7) koşusu (≥ 4,2 m/sn, kaleye) pastan kaç sn önce başladı.
   Kabul (Z1 kapanışında açılır, KAPI): plan 31'de geri çevirme anında ≥ 2 bant ≥ %60 ve plan 0'dan ≥ 20 puan; geç gelenin koşusu kesişten 0,7–2,0 sn
   önce ≥ %40 (geri çevirmelerde); geri çevirme kararının payı plan 0'dan en çok 5 puan düşük.
   Kullanım: node araclar/mac-deneme.js --senaryo z-s10 [N=60 kol başına] [tohum] */
'use strict';
const KAPI=false;
module.exports={calistir({ctx,vm,N,tohum}){
  const O=require('../senaryo-ortak')(ctx,vm),n=N||60,dt=1/60,t0=Date.now();
  const PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx),profilKur=vm.runInContext('profilKur',ctx);
  const planVar=O.ayarVar('plan');
  const deneme=(i,kol)=>{const r={karar:null,bant:0,gecDt:null,sut2:false};
    let m=null,d=1,K=null,G=null,ATK=[],bitti=false;const kos=new Map();
    m=O.kur((tohum||1)*1000+i,(ad,v)=>{if(!m||m.phase!=='play'||!K||bitti)return;
      if(v.p===K&&(ad==='pass'||ad==='cross'||ad==='shot')){bitti=true;
        if(ad==='shot'){r.karar='şut';return;}
        if(ad==='cross'){r.karar='orta';return;}
        const u0=K.x*d,hu=(v.hx!=null?v.hx:K.x)*d,hz=v.hz!=null?v.hz:K.z;
        const gc=v.tip!=='hava'&&hu<=u0+1&&hu>=PL-22&&hu<=PL-4&&Math.abs(hz-MZ)<12;
        if(!gc){r.karar=v.tip==='hava'?'orta':'öteki pas';return;}
        r.karar='geri çevirme';let ne=0,sp=0,ar=0;
        for(const p of ATK){const u=p.x*d,w=Math.abs(p.z-MZ);if(u>=PL-7&&w<=10)ne++;else if(u>=PL-14&&u<PL-7&&w<=10)sp++;else if(u>=PL-22&&u<PL-14&&w<=12)ar++;}
        r.bant=(ne>0)+(sp>0)+(ar>0);const o=kos.get(G);r.gecDt=o&&o.ks>=0?o.ks-m.t:null;}});
    d=m.dir[0];const hy=d>0?0:Math.PI,T0=m.teams[0],T1=m.teams[1];
    K=T0[5];G=T0[7];ATK=[T0[10],T0[9],T0[7],T0[8]];const D=[T1[1],T1[2],T1[3],T1[4],T1[6],T1[7]];
    O.bosalt(m,[K,...ATK,...D]);const yer=(p,u,w,yon,v)=>O.yerlestir(p,u*d,w,yon,v);
    const geri=hy;   /* savunmanın kendi kalesine koşusu da +u yönünde (aynı kale) */
    yer(K,PL-8,MZ-22,hy,4);yer(T0[10],PL-15,MZ-3,hy,3);yer(T0[9],PL-19,MZ+4,hy,3);yer(T0[7],PL-27,MZ,hy,3);yer(T0[8],PL-17,MZ+15,hy,3);
    yer(D[0],PL-5.5,MZ-20,geri,3);yer(D[1],PL-9,MZ-4,geri,4);yer(D[2],PL-10,MZ+3,geri,4);yer(D[3],PL-12,MZ+12,geri,3);yer(D[4],PL-24,MZ-2,geri,5);yer(D[5],PL-24,MZ+6,geri,5);
    if(kol.profil){for(const p of [K,...ATK]){for(const k of ['gorus','karar','pas'])p.oz[k]=Math.max(0,Math.min(1,p.oz[k]+kol.profil));p._kutle=0;p._cev=null;p._hk=undefined;profilKur(p,m.tohum);}}
    O.oyunda(m);O.topVer(m,K,hy,4,0.9);
    for(let k=0;k<60*4&&!bitti;k++){m.step(dt);if(m.phase!=='play')break;const b=m.ball;
      for(const p of ATK){const v=Math.hypot(p.vx,p.vz);let o=kos.get(p);if(!o){o={ks:-1,alt:0};kos.set(p,o);}
        if(v>=4.2){if(o.ks<0)o.ks=m.t;o.alt=0;}else if(o.ks>=0){o.alt+=dt;if(o.alt>0.2){o.ks=-1;o.alt=0;}}}
      if(b.sahip&&b.sahip.team===1||b.tasiyan&&b.tasiyan.team===1){r.karar='kayıp';break;}}
    if(!r.karar)r.karar='tuttu';
    return r;};
  const KOL=[{ad:'plan 0',ayar:{plan:0}}];if(planVar){KOL.push({ad:'plan 31',ayar:{plan:31}});KOL.push({ad:'plan 31, yüksek',ayar:{plan:31},profil:0.2});KOL.push({ad:'plan 31, düşük',ayar:{plan:31},profil:-0.2});}
  const S={},pc=x=>Number.isNaN(x)?'   —':(100*x).toFixed(1).padStart(5);
  for(const kol of KOL){const eski=O.ayar(kol.ayar);const L=[];for(let i=0;i<n;i++)L.push(deneme(i,kol));O.ayar(eski);S[kol.ad]=L;}
  const KR=['geri çevirme','orta','şut','öteki pas','kayıp','tuttu'];
  console.log(`\nZ1 · S10 geri çevirme ve üç derinlik · kol başına ${n} deneme${planVar?'':' · plan katmanı yok: yalnız "önce" kolu'}`);
  console.log('  kol                  '+KR.map(k=>k.padStart(13)).join('')+'   ≥ 2 bant %   3 bant %   geç gelen 0,7–2,0 sn önce %   Δt ortanca');
  const sat={};
  for(const kol of KOL){const L=S[kol.ad],G2=L.filter(r=>r.karar==='geri çevirme');
    const b2=G2.length?G2.filter(r=>r.bant>=2).length/G2.length:NaN,b3=G2.length?G2.filter(r=>r.bant>=3).length/G2.length:NaN;
    const gz=G2.length?G2.filter(r=>r.gecDt!=null&&r.gecDt<=-0.7&&r.gecDt>=-2.0).length/G2.length:NaN;
    const dts=G2.map(r=>r.gecDt).filter(x=>x!=null).sort((a,b)=>a-b),med=dts.length?dts[dts.length>>1]:NaN;
    sat[kol.ad]={gc:G2.length/L.length,b2,gz};
    console.log('  '+kol.ad.padEnd(20)+KR.map(k=>pc(L.filter(r=>r.karar===k).length/L.length).padStart(13)).join('')+pc(b2).padStart(13)+pc(b3).padStart(11)+pc(gz).padStart(30)+(Number.isNaN(med)?'—':med.toFixed(2)).padStart(13));}
  let cikis=0;
  if(planVar){const a=sat['plan 0'],b=sat['plan 31'];const k1=b.b2>=0.6&&(Number.isNaN(a.b2)||b.b2-a.b2>=0.2),k2=b.gz>=0.4,k3=b.gc>=a.gc-0.05;
    const yk=sat['plan 31, yüksek'],dk=sat['plan 31, düşük'];
    console.log(`  [1] ≥ 2 bant plan 31 ≥ %60 ve +20: ${k1?'tuttu':'TUTMADI'} · [2] geç gelen zamanında ≥ %40: ${k2?'tuttu':'TUTMADI'} · [3] geri çevirme payı ≥ plan 0 − 5: ${k3?'tuttu':'TUTMADI'}`);
    console.log(`  Kabiliyet (bilgi): ≥ 2 bant yüksek ÷ düşük ${(yk.b2/Math.max(1e-9,dk.b2)).toFixed(2)} · geri çevirme payı ${(yk.gc/Math.max(1e-9,dk.gc)).toFixed(2)}`);
    if(KAPI&&!(k1&&k2&&k3))cikis=1;}
  console.log(`  (${((Date.now()-t0)/1000).toFixed(1)} sn)${KAPI?'':' · kapılar Z1 kapanışında açılır (KAPI)'}`);
  return cikis;
}};
