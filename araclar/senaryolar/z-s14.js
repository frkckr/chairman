/* ============ Z1 sınav sahnesi S14 — kontra zamanlaması (FUTBOL_KUTUPHANESI §8; H.7 S14) ============
   Esin: Bayern–Real Madrid 2014 (kendi ceza sahasından 11 sn'lik kontra). Örnek kodlanmaz; kabul biçimdir (H.5 #4: kazanım → ≤ 2 sn'de ileri pas,
   iki kanat aynı anda derine).
   Kurulum: iki takım tam. Konuk hücumda, ev sahibinin yarısına yerleşmiş (dizilişin hücum yerleri, top ev sahibinin ceza sahası önünde); ev sahibi
   savunma düzeninde (dizilişin savunma yerleri). Ev sahibinin stoperi (3) topu kendi ceza sahasının önünde kazanır (kaleye 14 m, yüzü ileri); sahiplik
   yeni (kontra niyeti motorun kendi kuralıyla). Karar katmanı açık; 12 sn ya da top rakibe, şuta, duruşa dek.
   Kollar: MOTOR_AYAR.plan 0 ve 31 (aynı tohum ve başlangıç). Kabiliyet (Z1j): plan 31'de kanatların ve forvetlerin görüş, karar ve pası ±0,2.
   Ölçü: kazanımdan sonra 1 sn içinde derine koşuya kalkan (koşunun başı ileri hızlanmanın başı — ileri hız ≥ 2 m/sn —, seri ≥ 4,2 m/sn ve ileri
   hız > 3 m/sn'ye ulaşır; 2026-10-19: eşiğe ulaşma anı duran oyuncuda ~1,5 sn sürdüğünden 1 sn ölçüsü hep sıfırdı) hücumcu (kanatlar 5, 8; forvetler 9, 10) sayısı (≥ 2
   "iki koşucu"); ilk ileri pasın (≥ 10 m ileri) süresi; 12 sn içinde ≥ 3 pasla rakip ceza sahasında alış; şutta şutçunun en yakın savunmacıya
   uzaklığı (> 2 m serbest).
   Kabul (Z1 kapanışında açılır, KAPI): plan 31'de 1 sn'de ≥ 2 koşucu ≥ %50 ve plan 0'dan en çok 5 puan düşük (2026-10-19: ölçü düzeltilince plan 0
   zaten ~%98 — motorun geçiş koşuları kontrada iki kanadı birlikte kaldırıyor; plan katmanı bunu bozmamalı); öbürleri bilgi.
   Kullanım: node araclar/mac-deneme.js --senaryo z-s14 [N=60 kol başına] [tohum] */
'use strict';
const KAPI=true;   /* Z1 kapanışında açıldı (plan katmanı kontradaki iki koşucuyu bozmamalı) */
module.exports={calistir({ctx,vm,N,tohum}){
  const O=require('../senaryo-ortak')(ctx,vm),n=N||60,dt=1/60,t0=Date.now();
  const PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx),profilKur=vm.runInContext('profilKur',ctx);
  const planVar=O.ayarVar('plan');
  const deneme=(i,kol)=>{const r={iki:false,kosN:0,ileriT:null,kutu:false,pasN:0,sut:false,serbest:null,kayip:false};
    let m=null,d=1,tK=0,hazir=false;const kos=new Map();let H=[];
    m=O.kur((tohum||1)*1000+i,(ad,v)=>{if(!m||!hazir||m.phase!=='play')return;
      if(ad==='pass'&&v.p&&v.p.team===0){r.pasN++;if(r.ileriT==null&&v.hx!=null&&(v.hx-v.p.x)*d>=10)r.ileriT=m.t-tK;}
      else if(ad==='shot'&&v.p&&v.p.team===0){r.sut=true;let e=99;for(const o of m.teams[1])if(o.oyunda&&o.rol!=='GK')e=Math.min(e,Math.hypot(o.x-v.p.x,o.z-v.p.z));r.serbest=e;}});
    d=m.dir[0];const hy=d>0?0:Math.PI,T0=m.teams[0],T1=m.teams[1];
    /* konuk hücumda (top ev sahibinin ceza sahası önünde: konuğun çerçevesinde kaleye 18 m), ev sahibi savunmada */
    O.dizilis(m,1,PL-18,MZ,true);O.dizilis(m,0,-(PL-18),MZ,false);
    const CB=T0[3];H=[T0[5],T0[8],T0[9],T0[10]];
    O.yerlestir(CB,d*(-PL+14),MZ+4,hy,0);
    if(kol.profil){for(const p of H){for(const k of ['gorus','karar','pas'])p.oz[k]=Math.max(0,Math.min(1,p.oz[k]+kol.profil));p._kutle=0;p._cev=null;p._hk=undefined;profilKur(p,m.tohum);}}
    O.oyunda(m);m._sonSahipTakim=1;m._sahiplikBas=m.t;O.topVer(m,CB,hy,0);tK=m.t;hazir=true;
    for(let k=0;k<60*12;k++){m.step(dt);if(m.phase!=='play')break;const b=m.ball;
      /* koşunun başı ileri hızlanmanın başıdır (ileri hız ≥ 2 m/sn); seri 4,2 m/sn'ye ve ileri 3 m/sn'ye ulaşınca derine koşu sayılır (duran oyuncu 4,2'ye ~1,5 sn'de çıkar) */
      for(const p of H){const v=Math.hypot(p.vx,p.vz),vi=p.vx*d;let o=kos.get(p);if(!o){o={bas:-1,alt:0,ilk:null};kos.set(p,o);}
        if(vi>=2){if(o.bas<0)o.bas=m.t;o.alt=0;if(v>=4.2&&vi>3&&o.ilk==null)o.ilk=o.bas-tK;}else if(o.bas>=0){o.alt+=dt;if(o.alt>0.2){o.bas=-1;o.alt=0;}}}
      if(!r.kutu&&b.sahip&&b.sahip.team===0&&Math.abs(b.x-d*PL)<16.5&&Math.abs(b.z-MZ)<20.16&&r.pasN>=3)r.kutu=true;
      if(b.sahip&&b.sahip.team===1||b.tasiyan&&b.tasiyan.team===1){r.kayip=true;break;}
      if(r.sut)break;}
    r.kosN=[...kos.values()].filter(o=>o.ilk!=null&&o.ilk<=1.0).length;r.iki=r.kosN>=2;
    return r;};
  const KOL=[{ad:'plan 0',ayar:{plan:0}}];if(planVar){KOL.push({ad:'plan 31',ayar:{plan:31}});KOL.push({ad:'plan 31, yüksek',ayar:{plan:31},profil:0.2});KOL.push({ad:'plan 31, düşük',ayar:{plan:31},profil:-0.2});}
  const S={},pc=x=>Number.isNaN(x)?'   —':(100*x).toFixed(1).padStart(5);
  for(const kol of KOL){const eski=O.ayar(kol.ayar);const L=[];for(let i=0;i<n;i++)L.push(deneme(i,kol));O.ayar(eski);S[kol.ad]=L;}
  console.log(`\nZ1 · S14 kontra zamanlaması · kol başına ${n} deneme${planVar?'':' · plan katmanı yok: yalnız "önce" kolu'}`);
  console.log('  kol                  1 sn\'de ≥ 2 koşucu %   koşucu ort.   ilk ileri pas (sn, ortanca)   12 sn ≥ 3 pasla kutu %   şut %   şutta > 2 m serbest %   kayıp %');
  const sat={},med=a=>{const s=a.filter(x=>x!=null).sort((x,y)=>x-y);return s.length?s[s.length>>1]:NaN;};
  for(const kol of KOL){const L=S[kol.ad],sutlu=L.filter(r=>r.sut);const v={iki:L.filter(r=>r.iki).length/L.length};sat[kol.ad]=v;
    console.log('  '+kol.ad.padEnd(20)+pc(v.iki).padStart(18)+(L.reduce((s,r)=>s+r.kosN,0)/L.length).toFixed(2).padStart(14)+(Number.isNaN(med(L.map(r=>r.ileriT)))?'—':med(L.map(r=>r.ileriT)).toFixed(2)).padStart(28)+
      pc(L.filter(r=>r.kutu).length/L.length).padStart(24)+pc(sutlu.length/L.length).padStart(10)+pc(sutlu.length?sutlu.filter(r=>r.serbest>2).length/sutlu.length:NaN).padStart(23)+pc(L.filter(r=>r.kayip).length/L.length).padStart(11));}
  let cikis=0;
  if(planVar){const a=sat['plan 0'],b=sat['plan 31'],k1=b.iki>=0.5&&b.iki>=a.iki-0.05;const yk=sat['plan 31, yüksek'],dk=sat['plan 31, düşük'];
    console.log(`  [1] 1 sn'de ≥ 2 koşucu plan 31 ≥ %50 ve ≥ plan 0 − 5: ${k1?'tuttu':'TUTMADI'} · Kabiliyet (bilgi): yüksek ÷ düşük ${(yk.iki/Math.max(1e-9,dk.iki)).toFixed(2)}`);
    if(KAPI&&!k1)cikis=1;}
  console.log(`  (${((Date.now()-t0)/1000).toFixed(1)} sn)${KAPI?'':' · kapılar Z1 kapanışında açılır (KAPI)'}`);
  return cikis;
}};
