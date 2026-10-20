'use strict';
/* ============ V1 senaryosu: vuruşun hazırlığı ve gerilmesi (v-hazirlik; V1-0b iskeleti, 2026-10-20; FUTBOL_KUTUPHANESI §12.14, V1b) ============
   Kullanım: node araclar/mac-deneme.js --senaryo v-hazirlik [N=40 hücre başına] [tohum]
   Ev sahibi stoper (2, sağ ayaklı) kendi kale çizgisinden 37,5 m'de (uzaklaştırma seçeneği yok; o u-uzak'ta) topla; alıcı forvet (9) hücum yönünde; rakip forvet (konuk 9) baskıcı; öbürleri sahada değil. Vuruş zorlanır
   (vurusBaslat; plan pasSecenekleri'nden, yoksa ayağa) — motorun hazırlığı, geri salınımı ve dili ölçülür. Hücreler (V1b tasarımının numaraları):
   [1] top ayağında, rakip > 10 m, 40 m havadan pas: karar→temas, ek adım (dil.adim.n), salınım (dil.sal), kol, mod, acele, iniş uzaklığı.
   [2] aynısı, rakip 1 m önde 5 m/sn ile geliyor: (a) karar katmanı serbest — planlayıcı ≥ 28 m havadan pası seçti mi; (b) zorlanırsa mod, iniş,
       acele.
   [4] 5 m/sn koşarak topu süren oyuncu, 40 m havadan (hedef koşu yönünün ±25°'sinde): karar→temas.
   [5] duran oyuncu, 18 m sert yerden pas (çıkış ~16 m/sn; varış hızı yerHiz(16, 18)): ek adım, karar→temas, salınım.
   [6] baskıda (rakip 1,5 m önde, 3 m/sn) havadan uzun vuruş: 1. adamın bloğu (vuruştan sonra 0,6 sn içinde rakibin topun vuruş yerinin 4 m'sinde
       dokunuşu; bilgi). Planlayıcının modu ↔ motorunki aynı karede: V1b-2'den önce yok. Belirlenimlilik: [1]'in ilk 8 denemesi aynı tohumla iki
       kez — sonuçlar aynı olmalı (N/N).
   V1-0b: kapı yok, bugünkü değerleri yazar (yalnız belirlenimlilik bilgi). Kapılar V1b-1…V1b-3'te açılır (V1-plan). */
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||40,t0=Date.now(),O=require('../senaryo-ortak')(ctx,vm),OO=require('../olcum-ortak'),F=OO.bagla(ctx);
  const G=vm.runInContext('({pasSecenekleri,baskiAltinda,yerHiz,PL,MZ,PW})',ctx);
  let deneme=0;
  /* bir deneme: hucre, i (aynı hücre ve i aynı kurulumu verir); zorla: vuruş zorlanır, değilse karar katmanı serbest */
  const dene=(hucre,i,zorla,tohumEk)=>{const sd=(tohum||1)*100000+hucre*1000+i+(tohumEk||0);deneme++;
    let A=null,tem=null,blok=false;
    const m=O.kur(sd,(ad,v)=>{if(!A||!v)return;
      if(!tem&&v.p===A&&(ad==='pass'||ad==='clear')){const e=A.eylem;if(e&&e.ad==='vurus'){const b=m.ball;tem={e,t:e.t,x:b.x,z:b.z,tm:m.t,u:OO.ucus(F,m,b)};}}});
    A=m.teams[0][2];const Q=m.teams[0][9],R=m.teams[1][9],b=m.ball;
    O.bosalt(m,[A,Q,R]);
    const d=m.dir[0],yon0=d>0?0:Math.PI,ax=-15*d,az=G.MZ+(i%5-2)*1.5;
    const L=hucre===5?18:40,aq=yon0+((i%3)-1)*0.25,qx=ax+Math.cos(aq)*L,qz=az+Math.sin(aq)*L;
    O.yerlestir(Q,qx,qz,aq+Math.PI,0);
    const kos=hucre===4;O.yerlestir(A,ax,az,yon0,kos?5:0);
    if(hucre===2)O.yerlestir(R,ax+Math.cos(yon0)*1.0,az+0.3,yon0+Math.PI,5);
    else if(hucre===6)O.yerlestir(R,ax+Math.cos(yon0)*1.5,az+0.4,yon0+Math.PI,3);
    else O.yerlestir(R,ax+Math.cos(yon0)*14,az+8,yon0+Math.PI,0);
    O.oyunda(m);O.topVer(m,A,yon0,kos?5:0,kos?0.8:0.32);
    let secim=null;
    if(!zorla){A.kararT=0;
      for(let k=0;k<60*1.5&&!secim;k++){m.step(1/60);const e=A.eylem;
        if(e&&e.ad==='vurus')secim={tur:e.sec.tur,tip:e.sec.tip||'yer',L:Math.hypot(e.sec.hx-b.x,e.sec.hz-b.z)};else if(b.sahip!==A&&k>2)secim={tur:'kayip'};}
      return{secim:secim||{tur:'tut'}};}
    if(!kos){for(let k=0;k<4;k++)m.step(1/60);}
    A.kararT=99;
    const tip=hucre===5?'yer':'hava';
    const S=G.pasSecenekleri(m,A,{ox:b.x,oz:b.z,t0:0,ilk:false,baski:G.baskiAltinda(m,A),ofs:99}).filter(o=>o.alici===Q&&(o.tip||'yer')===tip);
    let o=null;for(const c of S)if(!o||c.deger>o.deger)o=c;
    const sec=hucre===5?{tur:'pas',hx:Q.x,hz:Q.z,tip:'yer',alici:Q,varisHizi:G.yerHiz(16,18,m.R),mod:'ayak',guncelle:true}
      :o?{tur:o.tur,hx:o.hx,hz:o.hz,tip:o.tip,alici:Q,varisHizi:o.varis,T:o.T,yay:o.yay,mod:o.mod,ex:o.ex,ez:o.ez,es:o.es,guncelle:true}
      :{tur:'uzun',hx:Q.x,hz:Q.z,tip:'hava',alici:Q,mod:'ayak',guncelle:true};
    m.vurusBaslat(A,sec);const e0=A.eylem&&A.eylem.ad==='vurus'?A.eylem:null;
    if(!e0)return{durum:'baslamadi'};
    for(let k=0;k<60*3&&!tem;k++){m.step(1/60);if(A.eylem!==e0)break;}
    if(!tem)return{durum:'vurmadi'};
    for(let k=0;k<36;k++){m.step(1/60);const q=b.sonDokunan;if(q&&q.team===1&&Math.hypot(b.x-tem.x,b.z-tem.z)<4&&m.t-tem.tm<0.6){blok=true;break;}if(m.t-tem.tm>=0.6)break;}
    const D=e0.dil;
    return{durum:'vurdu',t:tem.t,n:D&&D.adim?D.adim.n:null,sal:D?D.sal:null,kol:D?D.kol:null,mod:D?D.mod:'—',acele:e0.acele||0,inis:tem.u&&tem.u.inis?tem.u.inis.L:null,
      v0:Math.hypot(b.vx,b.vy,b.vz),haz:e0.hazirlikEn,blok,sema:D?D.sema:'—'};};
  const o=OO.ortanca,f=(x,k)=>x===x&&x!=null?x.toFixed(k==null?2:k):'—',P=(a,q)=>OO.yuzde(a.filter(x=>x!=null),q);
  const hucre=(h,ad,zorla)=>{const L=[];for(let i=0;i<n;i++)L.push(dene(h,i,zorla));return L;};
  const yaz=(ad,L)=>{const V=L.filter(r=>r.durum==='vurdu'),c=k=>V.filter(k).length;
    const dur=L.reduce((a,r)=>(a[r.durum]=(a[r.durum]||0)+1,a),{});
    console.log(`  ${ad.padEnd(44)} vurdu ${V.length}/${L.length}${V.length<L.length?' ('+Object.entries(dur).filter(([k])=>k!=='vurdu').map(([k,v])=>k+' '+v).join(', ')+')':''} · karar→temas %10/50/90 ${f(P(V.map(r=>r.t),0.1))} / ${f(P(V.map(r=>r.t),0.5))} / ${f(P(V.map(r=>r.t),0.9))} sn · ek adım ≥ 1 %${V.length?(100*c(r=>r.n>=1)/V.length).toFixed(0):'—'}`+
      ` · sal ort. ${f(o(V.map(r=>r.sal)))} · kol ort. ${f(o(V.map(r=>r.kol)))} · mod ${[...new Set(V.map(r=>r.mod))].join('/')} · acele ort. ${f(o(V.map(r=>r.acele)))} · asgari hazırlık ort. ${f(o(V.map(r=>r.haz)),3)} sn`+
      (V.some(r=>r.inis!=null)?` · iniş %10/50/90 ${f(P(V.map(r=>r.inis),0.1),1)} / ${f(P(V.map(r=>r.inis),0.5),1)} / ${f(P(V.map(r=>r.inis),0.9),1)} m`:'')+` · şema ${[...new Set(V.map(r=>r.sema))].join('/')}`);
    return V;};
  console.log(`\nV1 · v-hazirlik (V1-0b iskeleti; kapısız) · hücre başına ${n} deneme · pasör stoper (sağ ayaklı)`);
  const H1=yaz('[1] 40 m havadan, rakip > 10 m',hucre(1,'',true));
  const H2s=hucre(2,'',false),pl=H2s.filter(r=>r.secim.tur!=='kayip'&&r.secim.tur!=='tut'&&r.secim.tur!=='uzaklastir'&&r.secim.tip==='hava'&&r.secim.L>=28).length;
  console.log(`  [2a] rakip 1 m'de 5 m/sn — karar katmanı serbest: ≥ 28 m havadan pas seçti ${pl}/${H2s.length} · seçimler: `+
    Object.entries(H2s.reduce((a,r)=>{const k=r.secim.tur+(r.secim.tip&&r.secim.tur!=='kayip'&&r.secim.tur!=='tut'?'('+r.secim.tip+')':'');a[k]=(a[k]||0)+1;return a;},{})).map(([k,v])=>k+' '+v).join(' · '));
  yaz('[2b] aynısı, zorlanmış',hucre(2,'',true));
  yaz('[4] 5 m/sn koşarak, 40 m havadan',hucre(4,'',true));
  yaz('[5] duran, 18 m sert yerden (~16 m/sn)',hucre(5,'',true));
  const H6=yaz('[6] baskıda (1,5 m, 3 m/sn) havadan uzun',hucre(6,'',true));
  console.log(`  [6] 1. adamın bloğu ${H6.filter(r=>r.blok).length}/${H6.length} (bilgi; V1b-3 kapısı %5–30) · planlayıcının modu ↔ motor: V1b-2'den önce yok`);
  /* belirlenimlilik: [1]'in ilk 8 denemesi aynı tohumla yeniden */
  let ayni=0;const k8=Math.min(8,n);for(let i=0;i<k8;i++){const a=dene(1,i,true),c=dene(1,i,true);if(JSON.stringify(a)===JSON.stringify(c))ayni++;}
  console.log(`  Belirlenimlilik: [1] aynı tohumla iki koşu ${ayni}/${k8} aynı (bilgi)\n  Süre ${((Date.now()-t0)/1000).toFixed(1)} sn · V1-0b: kapı yok; kapılar V1b-1…V1b-3'te açılır`);
  return 0;
}};
