/* ============ Z1 sınav sahnesi S3 — tek dokunuş zinciri ve pas sonrası koşu (FUTBOL_KUTUPHANESI §8; kutuphane/H-unlu-ornekler.md H.7 S3) ============
   Esin: Arsenal–Norwich 2013 (tek dokunuşlar). Örnek kodlanmaz; sahne, ilkellerin bu BİÇİMDE bir dizi üretip üretmediğini sınar — kabul gol değil biçimdir.
   Kurulum (ev sahibinin hücum çerçevesinde, kaleye uzaklık u): rakip yarıda 25 m'lik bant. Ev sahibi: merkez orta saha (7) topla sol yarım alanda
   (kaleye 30 m, ortanın 10 m solunda, yüzü kaleye), hedef forvet (9) ceza sahası yayının önünde sırtı kaleye (kaleye 19 m), ikinci forvet (10) 24 m'de
   ortanın 6 m sağında. Konuk: iki stoper (3 hedef forvetin 1,5 m kale tarafında, 2 yanında), iki orta saha (7 topun 4 m önünde, 6 araya perde).
   Kaleciler kalede, öbür oyuncular oyun dışı. Karar katmanı açık; 6 sn ya da top rakibe, şuta, duruşa dek.
   Kollar: aynı tohum ve başlangıçla MOTOR_AYAR.plan 0 ve 31 (plan katmanı yoksa yalnız 0). Kabiliyet (Z1j): plan 31'de hücumcuların görüş, karar ve
   pası +0,2 ↔ −0,2 (aynı sahne, farklı seviye).
   Ölçü (deneme başına): pas sonrası koşu — ≤ 15 m pastan sonra 0,6 sn içinde pasörün ileri koşusunun başı (ileri hızlanmanın başı,
   ileri hız ≥ 2 m/sn; seri 2,5 sn içinde ≥ 4,2 m/sn'ye ulaşır) en az bir kez;
   forvetin bırakışı — hedef forvetin tek dokunuşla koşan (≥ 4,2 m/sn, ileri) arkadaşa pası (forvete top gelen denemelerde); 3 sn'de ≥ 3 tek dokunuş;
   son pas ofsaytsız (şut ya da ceza sahasında alış olan denemelerde ofsayt yok); şut, gol, kayıp.
   Kabul (Z1 kapanışında açılır, KAPI; o güne dek bilgi): plan 31'de pas sonrası koşu ≥ %40 ve plan 0'dan ≥ 15 puan (fark > 2 SE); forvetin
   bırakışı ≥ %30 ve ≥ 10 puan; son pas ofsaytsız ≥ %80. Kullanım: node araclar/mac-deneme.js --senaryo z-s3 [N=60 kol başına] [tohum] */
'use strict';
const KAPI=false;
module.exports={calistir({ctx,vm,N,tohum}){
  const O=require('../senaryo-ortak')(ctx,vm),n=N||60,dt=1/60,t0=Date.now();
  const PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx),profilKur=vm.runInContext('profilKur',ctx);
  const planVar=O.ayarVar('plan');
  const deneme=(i,kol)=>{const r={pasKos:false,birakisN:0,birakis:false,zincir:false,tek:0,final:false,ofs:false,sut:false,gol:false,kayip:false};
    let m=null;const pas=[],kos=new Map(),tekT=[];let A,B,C,d=1;
    m=O.kur((tohum||1)*1000+i,(ad,v)=>{if(!m||m.phase!=='play'||!A)return;
      if(ad==='pass'&&v.p&&v.p.team===0){pas.push({t:m.t,p:v.p,q:v.q,L:v.L||0,ilk:!!v.ilk,ks:null});if(v.ilk){r.tek++;tekT.push(m.t);}
        if(v.p===B&&v.ilk&&v.q){const q=v.q;if(Math.hypot(q.vx,q.vz)>=4.2&&q.vx*d>2)r.birakis=true;}}
      else if(ad==='shot'&&v.p&&v.p.team===0){r.sut=true;r.final=true;}
      else if(ad==='goal')r.gol=true;
      else if(ad==='ofsayt'&&v.p&&v.p.team===0)r.ofs=true;});
    d=m.dir[0];const hy=d>0?0:Math.PI,T0=m.teams[0],T1=m.teams[1];A=T0[7];B=T0[9];C=T0[10];
    const D=[T1[3],T1[2],T1[7],T1[6]];O.bosalt(m,[A,B,C,...D]);
    const yer=(p,u,w,yon,v)=>O.yerlestir(p,u*d,w,yon,v);
    yer(A,PL-28,MZ+6,hy,0);   /* A→B ~10 m (2026-10-19: 13,6 m'lik ilk pas ölçünün ≤ 12 m'lik penceresine girmiyordu) */yer(B,PL-19,MZ+2,hy+Math.PI,0);yer(C,PL-24,MZ-6,hy,0);
    yer(D[0],PL-17.5,MZ+2,hy+Math.PI,0);yer(D[1],PL-17,MZ-7,hy+Math.PI,0);yer(D[2],PL-26,MZ+10,hy+Math.PI,0);yer(D[3],PL-24,MZ+1,hy+Math.PI,0);
    for(const p of D)p.yon=Math.atan2(A.z-p.z,A.x-p.x);
    if(kol.profil){for(const p of [A,B,C]){for(const k of ['gorus','karar','pas'])p.oz[k]=Math.max(0,Math.min(1,p.oz[k]+kol.profil));p._kutle=0;p._cev=null;p._hk=undefined;profilKur(p,m.tohum);}}
    O.oyunda(m);O.topVer(m,A,hy,0);
    for(let k=0;k<60*6;k++){m.step(dt);if(m.phase!=='play')break;const b=m.ball;
      /* koşu serileri (≥ 4,2 m/sn) */
      /* koşu: ileri hızlanmanın başı (ileri hız ≥ 2 m/sn) — seri 4,2 m/sn'ye ulaşınca koşu sayılır (ks); duran oyuncu 4,2'ye ~1,5 sn'de çıkar */
      for(const p of [A,B,C]){const v=Math.hypot(p.vx,p.vz),vi=p.vx*d;let o=kos.get(p);if(!o){o={ks:-1,bas:-1,alt:0};kos.set(p,o);}
        if(vi>=2){if(o.bas<0)o.bas=m.t;o.alt=0;if(v>=4.2&&o.ks<0)o.ks=o.bas;}else if(o.bas>=0){o.alt+=dt;if(o.alt>0.2){o.ks=-1;o.bas=-1;o.alt=0;}}}
      if(b.sahip===B||b.sonDokunan===B)r.birakisN=1;
      if(b.sahip&&b.sahip.team===0&&Math.abs(b.x-d*PL)<16.5&&Math.abs(b.z-MZ)<20.16)r.final=true;
      /* pasörün koşu başlangıcı: pastan sonraki 0,6 sn içinde ilk görülen seri başı */
      for(const P of pas)if(P.ks==null&&m.t-P.t<=2.5){const o=kos.get(P.p);if(o&&o.ks>=0)P.ks=o.ks;}   /* başı pastan sonra 0,6 sn içinde olan seri 4,2'ye 2,5 sn içinde ulaşır */
      if(b.sahip&&b.sahip.team===1||b.tasiyan&&b.tasiyan.team===1){r.kayip=true;break;}}
    /* pas sonrası koşu: ≤ 12 m pas ve pasörün 0,6 sn içinde başlayan ileri koşusu (pas günlüğü ve seri başlangıcı) */
    for(const P of pas){if(P.L>15)continue;const o=P.ks;if(o!=null&&o>=P.t-0.1&&o<=P.t+0.6){r.pasKos=true;break;}}
    for(let a=0;a<tekT.length;a++){let c=0;for(let b2=a;b2<tekT.length;b2++)if(tekT[b2]-tekT[a]<=3)c++;if(c>=3){r.zincir=true;break;}}
    return r;};
  const KOL=[{ad:'plan 0',ayar:{plan:0}}];if(planVar){KOL.push({ad:'plan 31',ayar:{plan:31}});KOL.push({ad:'plan 31, yüksek',ayar:{plan:31},profil:0.2});KOL.push({ad:'plan 31, düşük',ayar:{plan:31},profil:-0.2});}
  const S={};
  for(const kol of KOL){const eski=O.ayar(kol.ayar);const L=[];for(let i=0;i<n;i++)L.push(deneme(i,kol));O.ayar(eski);S[kol.ad]=L;}
  const pay=(L,f,g)=>{const D=g?L.filter(g):L;return D.length?D.filter(f).length/D.length:NaN;},pc=x=>Number.isNaN(x)?'   —':(100*x).toFixed(1).padStart(5);
  console.log(`\nZ1 · S3 tek dokunuş zinciri · kol başına ${n} deneme${planVar?'':' · plan katmanı yok: yalnız "önce" kolu'}`);
  console.log('  kol                  pas sonrası koşu %   forvetin bırakışı % (n)   3 sn ≥ 3 tek dokunuş %   tek dokunuş/deneme   son pas ofsaytsız %   şut %   gol %   kayıp %');
  const sat={};
  for(const kol of KOL){const L=S[kol.ad],bN=L.filter(r=>r.birakisN).length;
    const v={pk:pay(L,r=>r.pasKos),br:pay(L,r=>r.birakis,r=>r.birakisN),zc:pay(L,r=>r.zincir),of:pay(L,r=>!r.ofs,r=>r.final)};sat[kol.ad]=v;
    console.log('  '+kol.ad.padEnd(20)+pc(v.pk).padStart(14)+(pc(v.br)+' ('+bN+')').padStart(24)+pc(v.zc).padStart(20)+(L.reduce((s,r)=>s+r.tek,0)/L.length).toFixed(2).padStart(20)+pc(v.of).padStart(20)+pc(pay(L,r=>r.sut)).padStart(10)+pc(pay(L,r=>r.gol)).padStart(8)+pc(pay(L,r=>r.kayip)).padStart(9));}
  let cikis=0;
  if(planVar){const a=sat['plan 0'],b=sat['plan 31'],se=p=>Math.sqrt(Math.max(1e-9,p*(1-p)/n));
    const k1=b.pk>=0.4&&b.pk-a.pk>=0.15&&b.pk-a.pk>2*Math.hypot(se(a.pk),se(b.pk)),k2=b.br>=0.3&&b.br-a.br>=0.10,k3=!(b.of<0.8);
    const yk=sat['plan 31, yüksek'],dk=sat['plan 31, düşük'];
    console.log(`  [1] pas sonrası koşu plan 31 ≥ %40 ve +15 puan (2 SE): ${k1?'tuttu':'TUTMADI'} · [2] forvetin bırakışı ≥ %30 ve +10: ${k2?'tuttu':'TUTMADI'} · [3] son pas ofsaytsız ≥ %80: ${k3?'tuttu':'TUTMADI'}`);
    console.log(`  Kabiliyet (bilgi): pas sonrası koşu yüksek ÷ düşük ${(yk.pk/Math.max(1e-9,dk.pk)).toFixed(2)} · 3 sn zinciri ${(yk.zc/Math.max(1e-9,dk.zc)).toFixed(2)}`);
    if(KAPI&&!(k1&&k2&&k3))cikis=1;}
  console.log(`  (${((Date.now()-t0)/1000).toFixed(1)} sn)${KAPI?'':' · kapılar Z1 kapanışında açılır (KAPI)'}`);
  return cikis;
}};
