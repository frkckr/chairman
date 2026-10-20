'use strict';
/* ============ V1 senaryosu: vuruşun yüzeyi ve gövdenin dönüşü (v-yuzey; V1-0b iskeleti, 2026-10-20; FUTBOL_KUTUPHANESI §12.14, V1a/V1e) ============
   Kullanım: node araclar/mac-deneme.js --senaryo v-yuzey [N=24 hücre başına] [tohum]
   1) Pas: topla duran güçlü ayaklı orta saha (ev sahibi 7, sağ ayaklı) hücum yönüne dönük; alıcı (forvet 9) θ açısında, L metrede; θ ∈ {−135, −90,
      −45, 0, +45, +90, +135}° (+ = güçlü ayağın dış yanı: sağ ayaklıda motorun f > 0 yanı), L ∈ {8, 18, 30} m. Kip: serbest (rakip uzakta),
      baskılı (rakip 1,5 m arkada, baskı ~0,85), gelişine (top 10 m'den ~8 m/sn ile gelir — hücum yönünün 22,5° iç yanından, alıcıların yolu
      kesmediği doğrultu; tek vuruş zorlanır, sec.ilk). Pas planlayıcının
      alıcıya seçtiği plandır (pasSecenekleri; yoksa ayağa yerden pas), vuruş motorun kendisidir (ayak ve yüzey zarı, hazırlık, dönüş).
      Ölçülen (vurulanlar): dış / zayıf / güçlü payı, dil'in kapanma yolu (hizalı, pelvis, adım, açık, dış), geri salınımın başında yanlış yan > 15°
      (dış ayak hariç; dil.don.kalan, yoksa gövde), temasta yanlış yan > 15° (fk: topun çıkış yönü − gövde, vuran ayağın çerçevesinde), karar→temas
      ortanca; vazgeçen ve başlamayan ayrıca.
   2) Kale vuruşu: kaleci (sağ, sol ya da iki ayaklı) kale vuruşunu tek kalan stopere (sağdaki ya da soldaki) kullanır; duruş motorun akışıyla
      (durusBaslat → yerleşim → durusKullan). Ölçülen: dış ve zayıf payı, karar anında |gövde–hedef| (dil.don.a0), temasta |gövde–top yönü|, yol.
   V1a-1 (2026-10-20): yuzeyKarar & 1 iken kapılar (geçmezse çıkış 1; bit kapalıyken bilgi) — (+45°, 18 m, serbest) dış 0; (+45°, 8 m, baskılı) dış
   ≥ %25; (−45°, 18 m, bütün kipler) dış 0; kale vuruşunda dış 0.
   V1a-2 (2026-10-20): yuzeyKarar & 2 iken (bit 1 de açıkken; asimetrik koni kapısı) — (+45°, 18 m, serbest) geri salınımın başında yanlış yan > 15°
   ≤ %2; (−45°, 18 m) serbest ve gelişine kipinde hizalı ya da pelvis ≥ %90, baskılı kipte adım yok (hizalı, pelvis ya da açık ≥ %90: karar
   anında koni dışı 5°, zaman yokken yol tanım gereği 'açık'; dönüş acele payının içinde). Bilgi: (+45°, 18 m, serbest) güçlü + adım payı.
   V1-0b: iskelet. Öbür kapılar V1a-2…V1a-3 ve V1e-1'de açılır (V1-plan: (+45°, 18 m, serbest) dış 0 ve yanlış yan
   ≤ %2; (+45°, 8 m, baskılı) dış ≥ %25; (+90°, 18 m, serbest) zayıf %10–35; (−45°, 18 m) hizalı ya da pelvis ≥ %90, dış 0; (0°) karar→temas
   yuzeyKarar 0'a göre ±0,02 sn; kale vuruşunda dış 0, tek ayaklıda zayıf 0, temasta |sapma| ≤ 0,26 rad). Kurulum rastlantısı senaryonun kendi
   tohumlu üretecindendir; motor kendi tohumunu kullanır. */
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||24,t0=Date.now(),O=require('../senaryo-ortak')(ctx,vm),OO=require('../olcum-ortak');
  const G=vm.runInContext('({pasSecenekleri,baskiAltinda,yerIlkHiz,PL,MZ,PW,MOTOR_AYAR})',ctx),YK=G.MOTOR_AYAR.yuzeyKarar|0;
  let sr=((tohum||1)*2654435761)>>>0;const r=()=>{sr=(sr+0x6D2B79F5)>>>0;let t=sr;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};
  const TH=[-135,-90,-45,0,45,90,135],LL=[8,18,30],KIP=['serbest','baskili','gelisine'],KIPAD={serbest:'serbest',baskili:'baskılı',gelisine:'gelişine'};
  let deneme=0;
  /* ---- 1) pas ---- */
  const pasDene=(th,L,kip)=>{deneme++;
    let A=null,e0=null,tem=null,vaz=false;
    const m=O.kur((tohum||1)*100000+deneme,(ad,v)=>{if(!A||!v||v.p!==A)return;
      if(ad==='pass'&&!tem){const e=A.eylem;if(e&&e.ad==='vurus'){const b=m.ball,sg=e.ayak==='sol'?-1:1;tem={e,t:e.t,fkT:OO.aciFark(Math.atan2(b.vz,b.vx),A.yon)*sg};}}
      else if(ad==='vazgecti')vaz=true;});
    A=m.teams[0][7];const Q=m.teams[0][9],D=m.teams[1][3],b=m.ball;
    O.bosalt(m,[A,Q,D]);
    const d=m.dir[0],yon0=d>0?0:Math.PI,sgG=A.ayak==='sol'?-1:1,ax=-10*d,az=G.MZ+(r()-0.5)*2,a=yon0+th*Math.PI/180*sgG;
    O.yerlestir(A,ax,az,yon0,0);O.yerlestir(Q,ax+Math.cos(a)*L,az+Math.sin(a)*L,a+Math.PI,0);
    if(kip==='baskili')O.yerlestir(D,ax-Math.cos(yon0)*1.5,az-Math.sin(yon0)*1.5,yon0,0);else O.yerlestir(D,ax-40*d,az+28,0,0);
    O.oyunda(m);
    let sec=null;
    if(kip==='gelisine'){/* top iç yandan (hücum yönünden −22,5°·güçlü ayak) gelir: hiçbir alıcı yolun üstünde değil */
      const v0=G.yerIlkHiz(10,8,m.R),ag=yon0-0.3927*sgG,bx=ax+Math.cos(ag)*10,bz=az+Math.sin(ag)*10;
      Object.assign(b,{x:bx,z:bz,y:0,vx:-Math.cos(ag)*v0,vz:-Math.sin(ag)*v0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:A,sut:null,pas:null,sonTakim:0,sonDokunan:Q});
      m.topDegisti();A.ilkSoruldu=b.surum;
      for(let k=0;k<60*3;k++){m.step(1/60);A.ilkSoruldu=b.surum;const dd=Math.hypot(b.x-A.x,b.z-A.z),v=Math.hypot(b.vx,b.vz);if(v>0.5&&dd/v<=0.55)break;if(b.sahip===A||A.eylem)break;}
      if(A.eylem||b.sahip===A)return{durum:'baslamadi'};
      const S=G.pasSecenekleri(m,A,{ox:A.x,oz:A.z,t0:0.3,ilk:true,gelA:Math.atan2(b.vz,b.vx),sinirA:3,baski:G.baskiAltinda(m,A),ofs:99}).filter(o=>o.alici===Q);
      let o=null;for(const c of S)if(!o||c.deger>o.deger)o=c;
      sec=o?{tur:o.tur,hx:o.hx,hz:o.hz,tip:o.tip,alici:Q,varisHizi:o.varis,mod:o.mod,ex:o.ex,ez:o.ez,es:o.es,guncelle:true,ilk:true,tekDokunus:true}
        :{tur:'pas',hx:Q.x,hz:Q.z,tip:'yer',alici:Q,mod:'ayak',guncelle:true,ilk:true,tekDokunus:true};}
    else{O.topVer(m,A,yon0,0,0.32);for(let k=0;k<6;k++)m.step(1/60);A.kararT=99;
      const S=G.pasSecenekleri(m,A,{ox:b.x,oz:b.z,t0:0,ilk:false,baski:G.baskiAltinda(m,A),ofs:99}).filter(o=>o.alici===Q);
      let o=null;for(const c of S)if(!o||c.deger>o.deger)o=c;
      sec=o?{tur:o.tur,hx:o.hx,hz:o.hz,tip:o.tip,alici:Q,varisHizi:o.varis,T:o.T,yay:o.yay,mod:o.mod,ex:o.ex,ez:o.ez,es:o.es,guncelle:true}
        :{tur:'pas',hx:Q.x,hz:Q.z,tip:L>34?'hava':'yer',alici:Q,mod:'ayak',guncelle:true};}
    m.vurusBaslat(A,sec);e0=A.eylem&&A.eylem.ad==='vurus'?A.eylem:null;
    if(!e0)return{durum:'baslamadi'};
    let fkG=NaN;
    for(let k=0;k<60*3&&!tem&&!vaz;k++){m.step(1/60);
      if(e0.faz==='geri'&&fkG!==fkG){const sg=e0.ayak==='sol'?-1:1;fkG=e0.dil&&e0.dil.don?e0.dil.don.kalan:OO.aciFark(Math.atan2(sec.hz-b.z,sec.hx-b.x),A.yon)*sg;}
      if(A.eylem!==e0&&!tem)break;}
    if(!tem)return{durum:vaz?'vazgecti':'bitti'};
    const e=tem.e,D0=e.dil;
    return{durum:'vurdu',dis:e.stil==='dis',zay:A.ayak!=='iki'&&e.ayak!==A.ayak,yol:D0&&D0.don?D0.don.yol:'—',fkG,fkT:tem.fkT,t:tem.t,ust:e.stil==='ust'};};
  const ortanca=OO.ortanca,y=(a,c)=>c?(100*a/c).toFixed(0).padStart(4)+'%':'   —';
  console.log(`\nV1 · v-yuzey (V1a kapıları) · pas: hücre başına ${n} deneme · pasör ${'sağ ayaklı orta saha'}`);
  console.log('  Kip       θ (°)  L (m)    n   dış  zayıf güçlü   üst   hizalı pelvis  adım  açık   geri>15° temas>15°  karar→temas  vazgeçti/başlamadı');
  const OZ={};
  for(const kip of KIP)for(const th of TH)for(const L of LL){const h={n:0,dis:0,zay:0,ust:0,yol:{},g:0,gN:0,tk:0,tN:0,t:[],vaz:0,bas:0};
    for(let i=0;i<n;i++){const R=pasDene(th,L,kip);if(R.durum==='vazgecti'){h.vaz++;continue;}if(R.durum!=='vurdu'){h.bas++;continue;}
      h.n++;if(R.dis)h.dis++;if(R.zay)h.zay++;if(R.ust)h.ust++;h.yol[R.yol]=(h.yol[R.yol]||0)+1;h.t.push(R.t);
      if(!R.dis&&R.fkG===R.fkG){h.gN++;if(R.fkG>0.26)h.g++;}if(!R.dis){h.tN++;if(R.fkT>0.26)h.tk++;}}
    OZ[kip+'|'+th+'|'+L]=h;
    const gu=h.n-h.dis-h.zay;
    console.log('  '+KIPAD[kip].padEnd(9)+String(th).padStart(6)+String(L).padStart(7)+String(h.n).padStart(5)+y(h.dis,h.n)+y(h.zay,h.n).padStart(6)+y(gu,h.n).padStart(6)+y(h.ust,h.n).padStart(6)+
      '  '+['hizali','pelvis','adim','acik'].map(k=>y(h.yol[k]||0,h.n)).join('  ')+y(h.g,h.gN).padStart(11)+y(h.tk,h.tN).padStart(10)+(ortanca(h.t).toFixed(2)+' sn').padStart(13)+(h.vaz+' / '+h.bas).padStart(18));}
  /* ---- 2) kale vuruşu ---- */
  const kvDene=(ayak,yan)=>{deneme++;let kul=null,gk=null,ilkF=null,fTe=NaN;
    const m=O.kur((tohum||1)*100000+deneme,(ad,v)=>{if(ad==='kullanim'&&v&&v.tur==='kaleVurusu'&&!kul){kul=v;const b=m.ball;fTe=Math.abs(OO.aciFark(Math.atan2(b.vz,b.vx),v.p.yon));}});
    const d=m.dir[0];gk=m.kaleci(0);
    /* sağdaki stoper: hücum yönüne bakarken motorun f > 0 yanı ((z − MZ)·d > 0) */
    const S=[m.teams[0][2],m.teams[0][3]].sort((p,q)=>(q.z-G.MZ)*d-(p.z-G.MZ)*d),st=yan==='sag'?S[0]:S[1];
    O.bosalt(m,[gk,st]);gk.ayak=ayak;
    const x=-d*(G.PL-5),z=G.MZ+(r()<0.5?4:-4);
    m.topuSifirla(x,z);m.phase='play';m.durusBaslat('kaleVurusu',0,x,z);
    for(let k=0;k<60*45&&!kul;k++){m.step(1/60);const e=gk.eylem;if(!ilkF&&e&&e.ad==='vurus'&&e.sec){const b=m.ball;ilkF=Math.abs(OO.aciFark(Math.atan2(e.sec.hz-b.z,e.sec.hx-b.x),gk.yon));}}
    if(!kul)return null;const e=gk.eylem;if(!e||e.ad!=='vurus')return{elle:true};
    const D0=e.dil,fa=OO.aciFark(Math.atan2(e.sec.hz-z,e.sec.hx-x),d>0?0:Math.PI);
    return{dis:e.stil==='dis',zay:ayak!=='iki'&&e.ayak!==ayak,ayakK:e.ayak,f0:D0&&D0.don?Math.abs(D0.don.a0):ilkF,
      fTe,yol:D0&&D0.don?D0.don.yol:'—',kisa:(e.sec.tip||'yer')==='yer',hedefYan:fa>0?'sag':'sol'};};
  console.log(`\n  Kale vuruşu: hücre başına ${n} · kaleci ayağı × kalan stoper (sağ: hücum yönüne bakarken f > 0 yanı)`);
  console.log('  Kaleci   Stoper    n  kısa   dış  zayıf  sağ ayakla  hedef sağda  karar |f| ort. (°)  temasta |sapma| ort. / en çok (°)  yol');
  const KV={n:0,dis:0};
  for(const ayak of['sag','sol','iki'])for(const yan of['sag','sol']){const h={n:0,kisa:0,dis:0,zay:0,sagA:0,hs:0,f0:[],fT:[],yol:{}};
    for(let i=0;i<n;i++){const R=kvDene(ayak,yan);if(!R||R.elle)continue;h.n++;if(R.kisa)h.kisa++;if(R.dis)h.dis++;if(R.zay)h.zay++;if(R.ayakK==='sag')h.sagA++;if(R.hedefYan==='sag')h.hs++;
      h.f0.push(R.f0*180/Math.PI);h.fT.push(R.fTe*180/Math.PI);h.yol[R.yol]=(h.yol[R.yol]||0)+1;KV.n++;if(R.dis)KV.dis++;}
    console.log('  '+ayak.padEnd(9)+yan.padEnd(7)+String(h.n).padStart(4)+y(h.kisa,h.n).padStart(6)+y(h.dis,h.n).padStart(6)+y(h.zay,h.n).padStart(7)+y(h.sagA,h.n).padStart(12)+y(h.hs,h.n).padStart(13)+
      ortanca(h.f0).toFixed(0).padStart(20)+(ortanca(h.fT).toFixed(1)+' / '+(h.fT.length?Math.max(...h.fT):NaN).toFixed(1)).padStart(36)+'  '+Object.keys(h.yol).sort().map(k=>k+' '+h.yol[k]).join(' · '));}
  /* ---- kapılar (V1a-1: yuzeyKarar & 1; V1a-2: & 3 — bitleri kapalıyken bilgi, çıkışı etkilemez) ---- */
  const H=(kip,th,L)=>OZ[kip+'|'+th+'|'+L],KP=[];
  const kapi=(ad,ok,deger,bit)=>{const etkin=(YK&bit)===bit;if(etkin)KP.push(ok);console.log(`  ${!etkin?'·':ok?' ':'!'} ${ad}: ${deger}`);};
  console.log(`\n  Kapılar (yuzeyKarar ${YK}; V1a-1 bit 1, V1a-2 bit 1 + 2 — kapalı bitin kapısı "·": bilgi, çıkışı etkilemez)`);
  {const h=H('serbest',45,18);kapi('(+45°, 18 m, serbest) dış = 0',h.dis===0&&h.n>0,`${h.dis}/${h.n}`,1);}
  {const h=H('baskili',45,8);kapi('(+45°, 8 m, baskılı) dış ≥ %25',h.n>0&&h.dis>=0.25*h.n,`${h.dis}/${h.n}`+y(h.dis,h.n),1);}
  {let d=0,nn=0;for(const kip of KIP){const h=H(kip,-45,18);d+=h.dis;nn+=h.n;}kapi('(−45°, 18 m, bütün kipler) dış = 0',d===0&&nn>0,`${d}/${nn}`,1);}
  kapi('Kale vuruşu dış = 0',KV.dis===0&&KV.n>0,`${KV.dis}/${KV.n}`,1);
  /* V1a-2 */
  {const h=H('serbest',45,18);kapi('(+45°, 18 m, serbest) geri başında yanlış yan > 15° ≤ %2',h.gN>0&&h.g<=0.02*h.gN,`${h.g}/${h.gN}`+y(h.g,h.gN),3);
    const gu=(h.yol.adim||0);console.log(`    bilgi: (+45°, 18 m, serbest) güçlü + adım ${gu}/${h.n}${y(gu,h.n)} (tasarım ≥ %60)`);}
  {let hp=0,nn=0;for(const kip of['serbest','gelisine']){const h=H(kip,-45,18);hp+=(h.yol.hizali||0)+(h.yol.pelvis||0);nn+=h.n;}
    kapi('(−45°, 18 m, serbest ve gelişine) hizalı ya da pelvis ≥ %90',nn>0&&hp>=0.9*nn,`${hp}/${nn}`+y(hp,nn),3);}
  {const h=H('baskili',-45,18),hp=(h.yol.hizali||0)+(h.yol.pelvis||0)+(h.yol.acik||0);
    kapi('(−45°, 18 m, baskılı) adım yok: hizalı, pelvis ya da açık ≥ %90',h.n>0&&hp>=0.9*h.n,`${hp}/${h.n}`+y(hp,h.n)+` (açık ${h.yol.acik||0})`,3);}
  const gec=KP.every(Boolean);
  console.log(`\n  Süre ${((Date.now()-t0)/1000).toFixed(1)} sn · ${YK&1?(gec?'kapılar geçti':'KAPI GEÇMEDİ'):'bilgi (bit 1 kapalı)'}`);
  return YK&1&&!gec?1:0;
}};
