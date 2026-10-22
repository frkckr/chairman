'use strict';
/* ============ V1 senaryosu: kale vuruşunun koşusu ve kalecinin elden dağıtımı (d-dagitim; V1-0b iskeleti, 2026-10-20; FUTBOL_KUTUPHANESI §12.14,
   V1e; kullanıcı notu 6) — seyrek senaryo (oturum-sonu.js --seyrek) ============
   Kullanım: node araclar/mac-deneme.js --senaryo d-dagitim [N=24 hücre başına] [tohum]
   Kale vuruşu (duruş motorun akışıyla: durusBaslat → yerleşim → durusKullan; kaleci ve tek hedef sahada, rakip saha oyuncuları yok):
   K1 sağ ayaklı kaleci → sağdaki stoper (kısa); K2 solak kaleci → sağdaki stoper; K3 iki ayaklı kaleci → soldaki stoper; K4 uzun (üstüne: yalnız
   hedef forvet, ~50 m). "Sağ": hücum yönüne bakarken motorun f > 0 yanı. Ölçülen: koşu noktası (du.geriX/Z) — topa uzaklığı ve koşu çizgisinin
   hedef doğrultusuna açısı (vuran ayağın çerçevesinde; + vuran ayağın dış yanından gelir); karar anında gövde–hedef (dil.don.a0; + vuran ayağın
   dış yanı), yüzey (dış / zayıf / güçlü), kısa vuruşun 20 m'de telafisiz eğrisi (Match.yerEgriSapma), top başında ve koşu noktasında hareketsiz
   süre (hız < 0,3 m/sn), karar→temas, kol jestinin hedefle uyumu (< 30°).
   Elden dağıtım (kaleci topu elinde, oyunda; tutuş 0,5 sn): E1 sol bek 14 m'de 60° solda boş (yuvarla); E2 kanat ~31 m ileride ve yanda (üstten atış);
   E3 yalnız hedef forvet 55 m ileride durgun (punt). Ölçülen: tür, hazırlık (V1e'nin 'dagitim' eylemi; o güne dek 0), bırakışta |gövde–atış|,
   tutuştan bırakışa süre.
   V1-0b: kapı yok, bugünkü değerleri yazar. Kapılar V1e-2 ve V1e-3'te açılır (V1-plan: K1 koşu noktası hedef doğrultusunun 14° solunda, 1,6–2,2 m
   geride, f ≈ −0,25, sağ ayak içi, 20 m'de 0,3–0,5 m eğri; E1 yuvarlama ~0,47 sn, bırakışta |gövde–atış| < 15°; E2 üstten ~0,51 sn ve ceza sahası
   kıstırması; E3 punt 3 adım). Kısa kuran takımda geç konan top hücresi V1e-2'de eklenir. */
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||24,t0=Date.now(),O=require('../senaryo-ortak')(ctx,vm),OO=require('../olcum-ortak');
  const G=vm.runInContext('({PL,MZ,PW})',ctx),PL=G.PL,MZ=G.MZ,PW=G.PW,dr=180/Math.PI;
  let deneme=0;
  const kv=(K,i)=>{deneme++;let kul=null,fTe=NaN,jest=null,top=0,kos=0,ilkF=null;
    const m=O.kur((tohum||1)*100000+K*1000+i,(ad,v)=>{if(ad==='kullanim'&&v&&v.tur==='kaleVurusu'&&!kul){kul=v;}});
    const d=m.dir[0],gk=m.kaleci(0),T=m.teams[0];
    const S=[T[2],T[3]].sort((p,q)=>(q.z-MZ)*d-(p.z-MZ)*d),hedef=K===4?T[9]:K===3?S[1]:S[0];
    O.bosalt(m,[gk,hedef]);gk.ayak=K===2?'sol':K===3?'iki':'sag';
    if(K===4)O.yerlestir(hedef,d*(-PL+55),MZ+(i%3-1)*5,d>0?0:Math.PI,0);
    const x=-d*(PL-5),z=MZ+(i%2?4:-4);
    m.topuSifirla(x,z);m.phase='play';m.durusBaslat('kaleVurusu',0,x,z);
    let son=m.t;
    for(let k=0;k<60*45&&!kul;k++){m.step(1/60);const du=m.durus,dt=m.t-son;son=m.t;
      if(du&&du.tur==='kaleVurusu'&&du.kullanan===gk){if(Math.hypot(gk.vx,gk.vz)<0.3){if(Math.hypot(gk.x-du.x,gk.z-du.z)<1.5)top+=dt;else if(du.geriX!=null&&Math.hypot(gk.x-du.geriX,gk.z-du.geriZ)<0.6)kos+=dt;}
        if(gk.jest&&gk.jest.tur==='kol'&&gk.jest.hedef)jest={x:gk.jest.hedef.x,z:gk.jest.hedef.z};}
      const e=gk.eylem;if(!ilkF&&e&&e.ad==='vurus'&&e.sec){const b=m.ball;ilkF=OO.aciFark(Math.atan2(e.sec.hz-b.z,e.sec.hx-b.x),gk.yon);}}
    if(!kul)return null;const e=gk.eylem;if(!e||e.ad!=='vurus')return{elle:true};
    const b=m.ball,du=kul.du,sg=e.ayak==='sol'?-1:1,ah=Math.atan2(e.sec.hz-z,e.sec.hx-x);
    const kosA=du&&du.geriX!=null?OO.aciFark(Math.atan2(z-du.geriZ,x-du.geriX),ah)*sg:NaN,kosL=du&&du.geriX!=null?Math.hypot(x-du.geriX,z-du.geriZ):NaN;
    const D=e.dil,f0=D&&D.don?D.don.a0:ilkF!=null?ilkF*sg:NaN;
    return{kisa:(e.sec.tip||'yer')==='yer',dis:e.stil==='dis',zay:gk.ayak!=='iki'&&e.ayak!==gk.ayak,ayak:e.ayak,f0,kosA,kosL,top,kos,vt:e.t,
      egri:(e.sec.tip||'yer')==='yer'&&m.yerEgriSapma?m.yerEgriSapma(b.x,b.z,b.vx,b.vz,b.egri||0,20)*sg:null,
      jest:jest?Math.abs(OO.aciFark(ah,Math.atan2(jest.z-z,jest.x-x)))<0.52:null};};
  const dag=(E,i)=>{deneme++;let rel=null;
    const m=O.kur((tohum||1)*100000+(10+E)*1000+i,(ad,v)=>{if(!rel&&v&&v.p&&v.p.rol==='GK'&&(ad==='pass'||ad==='gkkick')){const gk=v.p,e=gk.eylem,b=m.ball;
      rel={stil:e?e.stil||e.ad:'?',ad,aci:Math.abs(OO.aciFark(Math.atan2(b.vz,b.vx),gk.yon))*dr,t:m.t,gx:gk.x};}});
    const d=m.dir[0],yon0=d>0?0:Math.PI,gk=m.kaleci(0),T=m.teams[0],b=m.ball;
    const q=E===1?T[4]:E===2?T[5]:T[9];O.bosalt(m,[gk,q]);
    const gx=-d*(PL-6),gz=MZ+(i%3-1)*2;O.yerlestir(gk,gx,gz,yon0,0);
    if(E===1){const a=yon0-1.047;O.yerlestir(q,gx+Math.cos(a)*14,gz+Math.sin(a)*14,yon0,0);}
    else if(E===2)O.yerlestir(q,gx+d*28,gz+(i%2?14:-14),yon0,1.5);   /* ~31 m: elle atış 14–40 m, 28 m'den uzağa üstten */
    else O.yerlestir(q,gx+d*55,MZ+(i%3-1)*6,yon0,0);
    O.oyunda(m);
    Object.assign(b,{x:gk.x+Math.cos(yon0)*0.3,z:gk.z+Math.sin(yon0)*0.3,y:1.0,vx:0,vy:0,vz:0,egri:0,ust:0,sahip:null,tasiyan:gk,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:gk});
    gk.tutus={t:0,sure:0.5,zg:0};m.topDegisti();const tb=m.t;let haz=null;
    for(let k=0;k<60*6&&!rel;k++){m.step(1/60);const e=gk.eylem;if(haz==null&&e&&e.ad==='dagitim')haz=m.t;}
    if(!rel)return null;return Object.assign(rel,{tut:rel.t-tb,haz:haz!=null?rel.t-haz:0});};
  const f=(x,k)=>x===x&&x!=null?x.toFixed(k==null?2:k):'—',yz=(a,c)=>c?(100*a/c).toFixed(0)+'%':'—',P3=(a,k)=>{const c=a.filter(x=>x!=null&&x===x);return `${f(OO.yuzde(c,0.1),k)} / ${f(OO.yuzde(c,0.5),k)} / ${f(OO.yuzde(c,0.9),k)}`;};
  console.log(`\nV1 · d-dagitim (V1-0b iskeleti; kapısız) · hücre başına ${n} deneme — %10 / %50 / %90`);
  const KAD={1:'K1 sağ ayaklı → sağ stoper',2:'K2 solak → sağ stoper',3:'K3 iki ayaklı → sol stoper',4:'K4 uzun (üstüne, ~50 m)'};
  for(const K of[1,2,3,4]){const L=[];for(let i=0;i<n;i++){const r=kv(K,i);if(r&&!r.elle)L.push(r);}
    console.log(`  ${KAD[K].padEnd(28)} n ${L.length} · kısa ${yz(L.filter(r=>r.kisa).length,L.length)} · dış ${L.filter(r=>r.dis).length} · zayıf ${L.filter(r=>r.zay).length} · ayak ${[...new Set(L.map(r=>r.ayak))].join('/')}`+
      ` · koşu: uzaklık ${P3(L.map(r=>r.kosL),1)} m, açı ${P3(L.map(r=>r.kosA*dr),0)}° · karar f ${P3(L.map(r=>r.f0*dr),0)}°`);
    console.log(`  ${''.padEnd(28)} top başında hareketsiz ${P3(L.map(r=>r.top))} sn · koşu noktasında ${P3(L.map(r=>r.kos))} sn · karar→temas ${P3(L.map(r=>r.vt))} sn`+
      (L.some(r=>r.kisa)?` · 20 m eğri (vuran ayağın iç yanına +) ${P3(L.filter(r=>r.kisa).map(r=>r.egri))} m`:'')+` · jest uyumlu ${yz(L.filter(r=>r.jest).length,L.filter(r=>r.jest!=null).length)}`);}
  const EAD={1:'E1 sol bek 14 m, 60° solda',2:'E2 kanat ~31 m (kontra)',3:'E3 forvet 55 m (punt)'};
  for(const E of[1,2,3]){const L=[];for(let i=0;i<n;i++){const r=dag(E,i);if(r)L.push(r);}
    console.log(`  ${EAD[E].padEnd(28)} n ${L.length} · tür ${Object.entries(L.reduce((a,r)=>(a[r.stil]=(a[r.stil]||0)+1,a),{})).map(([k,v])=>k+' '+v).join(' · ')} · bırakışta |gövde–atış| ${P3(L.map(r=>r.aci),0)}° (en çok ${f(Math.max(0,...L.map(r=>r.aci)),0)})`+
      ` · hazırlık ${P3(L.map(r=>r.haz))} sn · tutuştan bırakışa ${P3(L.map(r=>r.tut))} sn`);}
  console.log(`  Süre ${((Date.now()-t0)/1000).toFixed(1)} sn · V1-0b: kapı yok; kapılar V1e-2 ve V1e-3'te açılır`);
  return 0;
}};
