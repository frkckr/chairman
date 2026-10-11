/* ============ Gerçekçilik planı T10 senaryosu: kanattan orta (c-orta; T10-0, 2026-10-11; T10a'nın kapısı) ============
   Ortanın tahmini (karar katmanı) ile gerçekleşen sonucu aynı kurulumda karşılaştırır. T10 teşhisi: maçta orta 1,7/maç; kornerde gerçekleşen ilk
   temas %33 iken tahmin %2–11 (T8c); ortaSecenekleri tahminin %10'un altındakini hiç düşünmez. Kurulum: ev sahibinin kanadı (sağdan 5, sağ ayak;
   soldan 8, sol ayak; deneme sırasıyla iki yan) topla orta yerinde; kutuda ev sahibinden 2–3 hücumcu (9 ön direğe, 10 arka direğe, üçlüde 7
   penaltı noktasına; 5 m geriden koşuda), konuktan 2–5 savunmacı (2 ve 3 stoper, 6 ön libero — adamlarının 1,2 m kale tarafında; beşlide 1 ve 4
   altıpasta bölge) ve kaleci (yakın direğin önünde); diğerleri saha dışında. Orta yerleri (hücum yönünde kaleye u, ortadan w): çizgi (3 / 18),
   köşe (17 / 21), erken (27 / 24). Seçenekler motorun kendi işlevinden (ortaSecenekleri, o.hepsi: eşiksiz liste ve tahminin bileşenleri);
   deneme sırasıyla listeden bir seçenek uygulanır (secenekUygula), karar katmanının en değerli bulduğu ayrıca işaretlenir.
   Kayıt: tahmin P (Pg = pas analizi P × (1 − kalecinin alması) × blok açıklığı × isabet; motorun pas tamamlama tanımı — topa ilk dokunan takım
   arkadaşı — ile karşılaştırılır) ve bileşenleri; ortanın türü (alçak, kesme, asma, geri çevirme). Sonuç: topa ilk dokunan (hücum: alıcı mı,
   kafa mı; savunma: saha oyuncusu ya da kaleci; kimse — oyun dışı), 4 sn içinde hücumun şutu ve golü, ortadan korner, ikinci top (ilk temas
   savunmada, 3 sn içinde top hücumda), ofsayt ve vazgeçme (bu ikisi kalibrasyona girmez).
   Kabul (T10a'da kapı; T10-0'da bilgi — KAPI false): en az 30 geçerli denemeli her yer × kutu hücresinde |tahmin − gerçekleşen| ≤ 5 puan.
   Kullanım: node araclar/mac-deneme.js --senaryo c-orta [N=40 hücre başına] [tohum] */
'use strict';
const KAPI=false;
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||40,dt=1/60,t0=Date.now();
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx);
  const ortaSec=vm.runInContext('(m,p,b)=>{const S=[];ortaSecenekleri(m,p,{ox:b.x,oz:b.z,baski:baskiAltinda(m,p),ofs:ofsaytCizgisi(m,p.team),hepsi:true},S);return S;}',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p))continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,v)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:Math.cos(yon)*(v||0),vz:Math.sin(yon)*(v||0),spd:v||0,yon,eylem:null,kickCd:0,surus:null,kosu:null,
    destek:null,oyunda:true,denge:1,calim:null,yutma:null,zipla:null,yuk:0});};
  const YER=[['çizgi',3,18],['köşe',17,21],['erken',27,24]],KUTU=[['2–2',2,2],['3–3',3,3],['3–5',3,5]];
  const R=[];let deneme=0;
  for(const [yAd,yu,yw] of YER)for(const [kAd,nA,nD] of KUTU)for(let i=0;i<n;i++){deneme++;
    const o={yer:yAd,kutu:kAd,P:null,tur:null,bil:null,enIyi:false,ilk:null,kaleci:false,kafa:false,alici:false,tuttu:false,sut:false,gol:false,korner:false,
      ikinci:false,vazgec:false,ofsayt:false,yok:false,vurulmadi:false};
    let tVur=null,tIlk=null,sec=null,sonKafa=null,W=null;
    const m=kur((tohum||1)*1000+deneme,(ad,v)=>{
      if(!sec)return;
      if(tVur==null){if((ad==='cross'||ad==='pass')&&v.p===W)tVur=m.t;else if(ad==='vazgecti'&&v&&v.p===W)o.vazgec=true;return;}
      if(ad==='ofsayt')o.ofsayt=true;
      else if(ad==='header'&&v.p){sonKafa=v.p;if(v.shot&&v.p.team===0&&m.t-tVur<=4)o.sut=true;}
      else if(ad==='shot'&&v.p&&v.p.team===0&&m.t-tVur<=4)o.sut=true;
      else if(ad==='goal'&&v.team===0&&m.t-tVur<=6)o.gol=true;});
    const s=i%2?-1:1,d=m.dir[0],T0=m.teams[0],T1=m.teams[1],b=m.ball,X=u=>d*u;
    W=s>0?T0[8]:T0[5];
    const A=[T0[9],T0[10],T0[7]].slice(0,nA),D=[T1[2],T1[3],T1[6],T1[1],T1[4]].slice(0,nD),GK=T1[0];
    bosalt(m,[W,GK].concat(A,D));
    /* hücumcular: başlangıç → koşu noktası (yan s) */
    const KOS=[[[11,7],[6,3]],[[12,-1],[7,-4]],[[17,2],[12,0]]];
    A.forEach((p,k)=>{const [[u0,w0],[u1,w1]]=KOS[k],x0=X(PL-u0),z0=MZ+s*w0,a=Math.atan2(MZ+s*w1-z0,X(PL-u1)-x0);yerlestir(p,x0,z0,a,2.5);p.tx=X(PL-u1);p.tz=MZ+s*w1;});
    /* savunmacılar: adamının 1,2 m kale tarafında; beşlide iki bölge savunmacısı altıpasta */
    const SAV=[[9.8,6.5],[10.8,-0.8],[15.8,2],[4.5,2],[5,-3]];
    D.forEach((p,k)=>{const [u0,w0]=SAV[k],x0=X(PL-u0),z0=MZ+s*w0;yerlestir(p,x0,z0,Math.atan2(MZ+s*yw-z0,X(PL-yu)-x0),0);});
    yerlestir(GK,X(PL-1.2),MZ+s*1.2,Math.atan2(s*yw,X(PL-yu)-X(PL-1.2)),0);
    const wx=X(PL-yu),wz=MZ+s*yw,wa=Math.atan2(MZ-wz,X(PL-11)-wx);yerlestir(W,wx,wz,wa,0);
    m.phase='play';m.phaseT=1;m.durus=null;
    Object.assign(b,{x:wx+Math.cos(wa)*0.35,z:wz+Math.sin(wa)*0.35,y:0,vx:0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:W});
    m.topDegisti();m.sahipYap(W);
    const S=ortaSec(m,W,b);
    if(!S.length){o.yok=true;R.push(o);continue;}
    let en=S[0];for(const c of S)if(c.deger>en.deger)en=c;
    sec=S[i%S.length];o.enIyi=sec===en;o.P=sec.P;o.tur=sec.ortaTuru||sec.tur;o.bil=sec.bilesen||null;
    m.secenekUygula(W,sec);
    for(let a=0;a<60*9;a++){
      m.step(dt);
      if(tVur==null){if(a>150||o.vazgec||m.phase!=='play'){o.vurulmadi=true;break;}continue;}
      if(tIlk==null){const q=b.sonDokunan;
        if(q&&q!==W){tIlk=m.t;o.ilk=q.team===0?'hucum':'savunma';o.kaleci=q.rol==='GK';o.alici=q===sec.alici;o.kafa=sonKafa===q;}
        else if(m.phase!=='play'){o.ilk='kimse';}}
      else if(!o.tuttu&&o.kaleci&&b.tasiyan===GK)o.tuttu=true;
      if(o.ilk==='savunma'&&!o.ikinci&&m.t-tIlk<=3&&b.sahip&&b.sahip.team===0)o.ikinci=true;
      if(m.phase==='durus'&&m.durus&&m.durus.tur==='korner'&&m.durus.takim===0)o.korner=true;
      if(m.phase!=='play'||m.t-tVur>6)break;}
    if(tVur!=null&&o.ilk==null)o.ilk='kimse';
    R.push(o);}
  /* ---- rapor ---- */
  const yz=(a,c)=>c?(100*a/c).toFixed(0)+'%':'—',ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN,f=(x,k)=>Number.isNaN(x)?'—':x.toFixed(k);
  const gecerli=L=>L.filter(o=>!o.yok&&!o.vurulmadi&&!o.ofsayt&&o.ilk);
  console.log(`\nT10 · c-orta (kanattan orta: tahmin ↔ gerçekleşen) · ${deneme} deneme · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  console.log('  hücre (yer · kutu)   geçerli  tahmin  gerçek  fark │ alıcı  kafa  kaleci (tuttu)  savunma  kimse │ şut  gol  korner  ikinci top │ seçeneksiz vurulmadı ofsayt');
  let kapi=true;
  const satir=(ad,L0,kapili)=>{const L=gecerli(L0),Pt=100*ort(L.map(o=>o.P)),G=L.length?100*L.filter(o=>o.ilk==='hucum').length/L.length:NaN,fk=Pt-G;
    const dis=kapili&&L.length>=30&&Math.abs(fk)>5;if(dis)kapi=false;
    const hS=L.filter(o=>o.ilk==='hucum'),gk=L.filter(o=>o.kaleci);
    console.log((dis?'! ':'  ')+ad.padEnd(20)+String(L.length).padStart(7)+f(Pt,1).padStart(8)+f(G,1).padStart(8)+f(fk,1).padStart(6)+' │ '+
      yz(hS.filter(o=>o.alici).length,L.length).padStart(5)+yz(hS.filter(o=>o.kafa).length,L.length).padStart(6)+(yz(gk.length,L.length)+' ('+yz(gk.filter(o=>o.tuttu).length,gk.length)+')').padStart(16)+
      yz(L.filter(o=>o.ilk==='savunma'&&!o.kaleci).length,L.length).padStart(9)+yz(L.filter(o=>o.ilk==='kimse').length,L.length).padStart(7)+' │ '+
      yz(L.filter(o=>o.sut).length,L.length).padStart(4)+yz(L.filter(o=>o.gol).length,L.length).padStart(5)+yz(L.filter(o=>o.korner).length,L.length).padStart(8)+
      yz(L.filter(o=>o.ikinci).length,L.filter(o=>o.ilk==='savunma').length).padStart(12)+' │ '+
      String(L0.filter(o=>o.yok).length).padStart(10)+String(L0.filter(o=>o.vurulmadi).length).padStart(10)+String(L0.filter(o=>o.ofsayt).length).padStart(7));};
  for(const [yAd] of YER)for(const [kAd] of KUTU)satir(yAd+' · '+kAd,R.filter(o=>o.yer===yAd&&o.kutu===kAd),true);
  satir('hepsi',R,false);
  satir('  en değerli seçenek',R.filter(o=>o.enIyi),false);
  console.log('  — türe göre —');
  for(const t of['alcak','kesme','asma','geri'])satir('  '+t,R.filter(o=>o.tur===t),false);
  console.log('  — tahmin dilimi —');
  for(const [ad,a,c] of[['P < 0,1',0,0.1],['P 0,1–0,3',0.1,0.3],['P 0,3–0,5',0.3,0.5],['P ≥ 0,5',0.5,2]])satir('  '+ad,R.filter(o=>o.P!=null&&o.P>=a&&o.P<c),false);
  /* bileşenler: havadan ortada kalecinin alması tahmini ↔ kalecinin ilk teması; pas analizi P ile isabet terimleri (Pex pas analizinin içinde, Pis ortanın) */
  {const H=gecerli(R).filter(o=>o.bil&&o.tur!=='alcak'&&o.tur!=='geri');
   console.log(`  Bileşenler (havadan orta, n ${H.length}): pas analizi P ort. ${f(ort(H.map(o=>o.bil.P2)),2)} · isabet: pas analizi Pex ${f(ort(H.map(o=>o.bil.Pex)),2)}, orta Pis ${f(ort(H.map(o=>o.bil.Pis)),2)} · blok açıklığı ${f(ort(H.map(o=>o.bil.acik)),2)} · `+
     `kalecinin alması tahmini ${f(100*ort(H.map(o=>o.bil.kal)),1)}% ↔ kalecinin ilk teması ${yz(H.filter(o=>o.kaleci).length,H.length)} · ilk temas hücumda ${yz(H.filter(o=>o.ilk==='hucum').length,H.length)} · xG×beceri (sans) ort. ${f(ort(H.map(o=>o.bil.sans)),3)}`);}
  const ok=kapi;
  console.log((ok?'  ':'! ')+`Kabul (T10a; ${KAPI?'kapı':'bilgi'}): ≥ 30 geçerli denemeli hücrelerde |tahmin − gerçek| ≤ 5 puan — `+(ok?'tuttu':'TUTMADI'));
  return KAPI&&!ok?1:0;
}};
