/* ============ Duran top kapısı (gerçekçilik planı T8; T0 senaryosu, T8-0'da yeniden yazıldı 2026-10-11) ============
   Her deneme ayrı tohumlu maçta, iki takım tam kadro; duran top motorun kendi akışıyla (durusBaslat → yerleşim → durusKullan). Kullanım anı motorun
   'kullanim' olayıdır (js/mac-durantop.js): kullananın topa ilk dokunuşu. Kullanımdan sonra 8 sn (ya da oyun durana dek) şut ve gol.
   Hücreler: korner (iki yan, iki takım); serbest vuruş merkez (kale çizgisine 18/22/26/30 m), yarı (18/22/26 m, 10 m yanda), kenar (18/22/26 m,
   18 m yanda), uzak (36 m ortada, 40 m 10 m yanda); penaltı; uzun taç adayı (son üçte birde taç); kale vuruşu.
   Ölçüler: hazırlık (duruşun başından kullanıma), kullanımın türü (k-duran ile aynı: korner kısa/içe/dışa; serbest vuruş doğrudan şut/orta/diğer),
   kullanımda ceza sahasındaki hücumcu ve savunmacı (kaleci ve kullanan hariç), barajdaki kişi, kornerde inişte iki takımdan 1,5 m içinde oyuncu ve
   ilk temas (4 sn; kısa korner hariç), doğrudan şutta çerçeve ve gol (golde son dokunan kullanan), barajın bloğu ve sıçraması, 8 sn içinde gol,
   penaltıda ribaund koşucusu (vuruşta ceza sahası dışında, 1 sn sonra içinde olan hücumcu), kale vuruşu yerden (kaleci topu eline almadı).
   Kapılar (T8; KAPI ilgili alt adımda açılır, açıkken kabul dışı “!” çıkış kodu 1): korner T8b, serbest vuruş T8c, penaltı/taç/kale vuruşu T8d.
   Kullanım: node araclar/mac-deneme.js --senaryo d-duran [N=400: korner 4N (T8b: 400 kornerde gol payı ±1,1 puan oynuyordu, kapı gürültüyle düşüyordu; 800'de ±0,75; A4, 2026-10-15: 1600'de ±0,53 — gerçek oran bandın ucuna yakınken (%4,5–4,8) 800'lük kapı gürültüyle düşüyordu); serbest vuruş hücresi N/5 (T8c: 40 vuruşta 18 m'nin gol oranı ±7 puan), penaltı ve taç N/7, kale vuruşu N/5] [tohum] */
'use strict';
const KAPI={korner:true,serbest:true,penalti:true,tac:true,kaleVurusu:true};
/* kale vuruşunun yeri: kendi kale çizgisinden 5 m (altıpas çizgisinin 0,5 m önü; motorun sinirlar() kuralı) */
const PL_KV=5.5-0.5;
/* u: kale çizgisine uzaklık (m), w: kale ortasından yana (m); hücum yönü santradan sonraki yöne göre maçın içinde bulunur. Kale vuruşunda u
   kullanan takımın kendi kalesine göredir */
const KOD=`(function(tohum,tur,t,u,w){
  let kul=null,su=0,sut=0,gol=false,golDogrudan=false,ilkP=null,ilkSut=false,golIlk=false,sonra1=null,ilkT=0,dogrudan=false,cerceve=false,ilk=null,inis=null,blok=false,zip=false,rib=-1,kutuH=0,kutuS=0,A0=null,elle=false;
  const kutuda=(p,tt)=>{const gx=m.dir[tt]*PL;return Math.abs(p.x-gx)<CEZA_U&&Math.abs(p.z-MZ)<CEZA_W;};
  const m=new Match((ad,v)=>{
    if(ad==='kullanim'&&!kul&&v&&v.takim===t){kul=v;su=m.t;elle=v.alt==='elle';
      const A=m.teams[t].filter(q=>q.oyunda&&q.rol!=='GK'&&q!==v.p),D=m.teams[1-t].filter(q=>q.oyunda&&q.rol!=='GK');
      kutuH=A.filter(q=>kutuda(q,t)).length;kutuS=D.filter(q=>kutuda(q,t)).length;A0=A.filter(q=>!kutuda(q,t));return;}
    if(!kul||!v)return;
    if(ad==='shot'&&v.p&&v.p.team===t){sut++;if(v.p===kul.p&&m.t-su<1.6&&!dogrudan){dogrudan=true;cerceve=!!(m.ball.sut&&m.ball.sut.cerceve);}}
    else if(ad==='header'&&v.shot&&v.p&&v.p.team===t)sut++;
    else if(ad==='goal'&&v.team===t&&!gol){gol=true;golDogrudan=m.ball.sonDokunan===kul.p||v.scorer===kul.p;golIlk=!!ilkP&&(m.ball.sonDokunan===ilkP||v.scorer===ilkP);}
    if(ad==='block'&&v.p&&kul.barajdakiler&&kul.barajdakiler.includes(v.p)&&m.t-su<1)blok=true;
    /* A4 (bilgi): hücumun ilk kafasından sonraki ilk olay — kaleci, blok, savunmanın kafası ya da ayağı, hücumun ikinci dokunuşu */
    if(ilkP&&!sonra1&&m.t>ilkT+1e-6&&v&&v.p){if(ad==='save'||ad==='yumruk'||ad==='parmak'||ad==='kapan')sonra1='kaleci';else if(ad==='block')sonra1=v.p.team===t?'hucBlok':'savBlok';
      else if(ad==='header')sonra1=v.p.team===t?'hucKafa':'savKafa';else if(ad==='ilkDokunus'||ad==='sekme'||ad==='kotuKontrol'||ad==='shot')sonra1=v.p.team===t?'hucAyak':'savAyak';}
    /* T10b (2026-10-11): ilk temastan önce çalınan faul (kutuda tutma, havada kol, kaleciye çarpma) ayrı sınıf — eskiden "disari" sayılıyordu */
    if(!ilk&&ad==='faul'&&m.t-su<4&&(kul.alt!=='kisa'&&kul.alt!=='geri')){ilk='faul';return;}
    if(!ilk&&v.p&&m.t-su<4&&(kul.alt!=='kisa'&&kul.alt!=='geri')){const h=v.p.team===t;
      if(ad==='header'){ilk=h?'hucumKafa':'savunmaKafa';if(h){ilkP=v.p;ilkSut=!!v.shot;ilkT=m.t;}}
      else if(ad==='save'||ad==='yumruk'||ad==='parmak'||ad==='kapan')ilk='kaleci';
      else if(ad==='ilkDokunus'||ad==='sekme'||ad==='block'||ad==='kotuKontrol')ilk=h?'hucumAyak':'savunmaAyak';}},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});
  m.macaGec();
  const d=m.dir[t];let x,z,veri;
  if(tur==='kaleVurusu'){x=-d*(PL-u);z=MZ+w;}else{x=d*(PL-u);z=MZ+w;}
  if(tur==='korner')m.topuSifirla(x-d*1.2,z-Math.sign(w)*0.8);else if(tur==='tac')m.topuSifirla(x,z<MZ?-0.4:PW+0.4);else m.topuSifirla(x,z);
  m.phase='play';
  if(tur==='serbest')veri={bekle:1.0,duduk:true};else if(tur==='penalti')veri={bekle:0.3};
  m.durusBaslat(tur,t,x,z,veri);
  const du=m.durus;let baraj=false,nb=0;
  for(let n=0;n<60*32&&!kul;n++){if(m.durus){baraj=!!m.durus.baraj;nb=m.durus.barajdakiler?m.durus.barajdakiler.length:0;}m.step(1/60);}
  if(!kul)return null;
  const b=m.ball;
  for(let k=0;k<60*8;k++){
    if(m.phase!=='play'&&m.phase!=='goal'){if(!ilk&&(kul.alt!=='kisa'&&kul.alt!=='geri'))ilk='disari';break;}
    m.step(1/60);const dt=m.t-su;
    if(!zip&&dt<0.5&&kul.barajdakiler&&kul.barajdakiler.some(q=>q.zipla||q.yuk>0.05))zip=true;
    if(inis==null&&dt>0.2&&b.vy<0&&b.y<2.6&&!b.sahip&&!b.tasiyan){const n2=[0,0];for(const q of m.players)if(q.oyunda&&q.rol!=='GK'&&Math.hypot(q.x-b.x,q.z-b.z)<1.5)n2[q.team]++;inis=n2[0]>0&&n2[1]>0;}
    if(rib<0&&dt>=1.0&&A0)rib=A0.filter(q=>q.oyunda&&kutuda(q,t)).length;
    if(!ilk&&(kul.alt!=='kisa'&&kul.alt!=='geri')){if(b.tasiyan&&b.tasiyan.rol==='GK'&&b.tasiyan.team!==t)ilk='kaleci';else if(inis!=null&&b.y<0.3&&!b.sahip)ilk='yere';else if(dt>4)ilk='yok';}}
  return{hz:kul.hazirlik,alt:kul.alt,bolge:kul.bolge,sut,gol,golDogrudan,golIlk,ilkSut,sonra1,dogrudan,cerceve,ilk,inis,blok,zip,rib,kutuH,kutuS,baraj,nb,elle,perde:!!(kul.du&&kul.du.gorev&&[...kul.du.gorev.values()].some(g=>g.rol==='perdeAdam')),ikili:!!(kul.du&&kul.du.ikili),aldatma:!!(kul.du&&kul.du.aldatma),aldOnce:kul.du&&kul.du.aldatmaGecti!=null?su-kul.du.aldatmaGecti:null};})`;
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||400,f=vm.runInContext(KOD,ctx),t0=Date.now();let tn=(tohum||1)*10000,kabulDisi=0;   /* T8f: tohum blokları çakışmasın (koşu başına ~4N + 3N tohum) */
  const y=(a,c)=>c?(100*a/c).toFixed(1)+'%':'—',ort=L=>L.length?L.reduce((a,c)=>a+c,0)/L.length:NaN,ortanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,c)=>a-c);return S[Math.floor(S.length/2)];};
  const f1=(x,k)=>Number.isNaN(x)?'—':x.toFixed(k==null?1:k);
  const kapi=(acik,ok,metin)=>{const dis=!ok;if(dis&&acik)kabulDisi++;console.log((dis?'! ':'  ')+(acik?'Kapı':'Kabul (T8, bilgi)')+': '+metin);};
  const kos=(tur,t,u,w)=>f(tn++,tur,t,u,w);
  /* korner: iki yan × iki takım */
  const K={L:[],yok:0};
  for(let i=0;i<4*n;i++){const r=kos('korner',i%2,0.4,(i%4<2?1:-1)*(34-0.4));if(!r){K.yok++;continue;}K.L.push(r);}
  const KL=K.L,Kn=KL.length,Kc=KL.filter(r=>r.alt!=='kisa'&&r.alt!=='geri'),say=(L,f2)=>L.filter(f2).length;
  const ilkT={};for(const r of Kc)ilkT[r.ilk||'yok']=(ilkT[r.ilk||'yok']||0)+1;
  const kGol=100*say(KL,r=>r.gol)/Math.max(1,Kn),kKisa=100*say(KL,r=>r.alt==='kisa')/Math.max(1,Kn),kKutu=ort(KL.map(r=>r.kutuH)),kIn=Kc.filter(r=>r.inis!=null);
  /* T10b: ilk temas payı faulle biten kornerler dışında (çekişmenin sonucu); faulle biten pay ayrıca yazılır */
  const Kt=Kc.filter(r=>r.ilk!=='faul');
  const kInis=100*say(kIn,r=>r.inis)/Math.max(1,kIn.length),kHucum=100*say(Kt,r=>r.ilk==='hucumKafa'||r.ilk==='hucumAyak')/Math.max(1,Kt.length);
  console.log(`\nT8 · duran top kapısı (d-duran) · ${((Date.now()-t0)/1000).toFixed(1)} sn (korner)\n`);
  console.log(`  Korner: ${Kn} kullanıldı${K.yok?` (${K.yok} kullanılamadı)`:''} · hazırlık ortancası ${f1(ortanca(KL.map(r=>r.hz)))} sn · kısa ${y(say(KL,r=>r.alt==='kisa'),Kn)} · içe ${y(say(KL,r=>r.alt==='ice'),Kn)} · dışa ${y(say(KL,r=>r.alt==='disa'),Kn)}`);
  console.log(`  Korner: kutuda hücumcu ${f1(kKutu)} · savunmacı ${f1(ort(KL.map(r=>r.kutuS)))} · inişte iki takımdan 1,5 m içinde ${f1(kInis)}% · şut/korner ${(KL.reduce((a,r)=>a+r.sut,0)/Math.max(1,Kn)).toFixed(2)} · 8 sn içinde gol ${kGol.toFixed(1)}% (${say(KL,r=>r.gol)}/${Kn})`);
  console.log('  Korner ilk temas (kısa hariç): '+['hucumKafa','savunmaKafa','kaleci','hucumAyak','savunmaAyak','yere','disari','faul','yok'].map(k=>k+' '+y(ilkT[k]||0,Kc.length)).join(' · '));
  kapi(KAPI.korner,kGol>=3&&kGol<=5,`korner başına gol %3–5 → %${kGol.toFixed(1)}`);
  kapi(KAPI.korner,kKutu>=4&&kKutu<=7,`kullanımda kutudaki hücumcu 4–7 → ${f1(kKutu)}`);
  kapi(KAPI.korner,kKisa>=10&&kKisa<=25,`kısa korner %10–25 → %${kKisa.toFixed(1)}`);
  kapi(KAPI.korner,kHucum>=30,`ilk temas hücumda ≥ %30 (faulle bitenler dışında) → %${kHucum.toFixed(1)}`);
  console.log(`  Korner: ilk temastan önce faul %${(100*say(Kc,r=>r.ilk==='faul')/Math.max(1,Kc.length)).toFixed(1)} (T10b bilgi; gerçekte ~%10–15, çoğu hücum faulü)`);
  kapi(KAPI.korner,kInis>=50,`inişte iki takımdan 1,5 m içinde ≥ %50 → %${kInis.toFixed(1)}`);
  /* A4-2 (bilgi): perdeleme ve yaya geri pas — perdeli ve perdesiz ortada hücumun ilk teması ve gol, geri pasın golü ve şutu */
  {const P1=Kt.filter(r=>r.perde),P0=Kt.filter(r=>!r.perde),hu=L=>y(say(L,r=>r.ilk==='hucumKafa'||r.ilk==='hucumAyak'),L.length),G1=KL.filter(r=>r.perde),G0=KL.filter(r=>!r.perde&&r.alt!=='geri'),Gr=KL.filter(r=>r.alt==='geri');
    console.log(`  A4-2: perdeleme ${y(G1.length,Kn)} · ilk temas hücumda perdeli ${hu(P1)} (${P1.length}) · perdesiz ${hu(P0)} (${P0.length}) · gol perdeli ${y(say(G1,r=>r.gol),G1.length)} · perdesiz ${y(say(G0,r=>r.gol),G0.length)}`);
    console.log(`  A4-2: yaya geri pas ${y(Gr.length,Kn)} · gol ${y(say(Gr,r=>r.gol),Gr.length)} (${Gr.length}) · şut / korner ${(Gr.reduce((a,r)=>a+r.sut,0)/Math.max(1,Gr.length)).toFixed(2)}`);}
  /* A4 (bilgi): golün kaynağı — kısa kornerde ve ortalı kornerde ilk temasa göre gol (adet, o türün içinde %) */
  {const Ks=KL.filter(r=>r.alt==='kisa'),T={};for(const r of Kc){const k=r.ilk||'yok',t=T[k]||(T[k]=[0,0]);t[0]++;if(r.gol)t[1]++;}
    console.log('  A4: gol kısa '+say(Ks,r=>r.gol)+' ('+y(say(Ks,r=>r.gol),Ks.length)+') · ortalıda ilk temasa göre '+Object.keys(T).sort((a,c)=>T[c][1]-T[a][1]).map(k=>k+' '+T[k][1]+' ('+y(T[k][1],T[k][0])+')').join(' · '));
    const HK=Kc.filter(r=>r.ilk==='hucumKafa');console.log(`  A4: hücumun ilk temaslı kafası ${HK.length} · şut ${y(say(HK,r=>r.ilkSut),HK.length)} · gol ilk kafadan ${say(HK,r=>r.golIlk)} (${y(say(HK,r=>r.golIlk),HK.length)}; şutların ${y(say(HK,r=>r.golIlk&&r.ilkSut),say(HK,r=>r.ilkSut))}) · sonraki evreden ${say(HK,r=>r.gol&&!r.golIlk)} (${y(say(HK,r=>r.gol&&!r.golIlk),HK.length)})`);
    const S1={};for(const r of HK){const k=r.sonra1||'yok',u=S1[k]||(S1[k]=[0,0]);u[0]++;if(r.gol&&!r.golIlk)u[1]++;}
    console.log('  A4: ilk kafadan sonraki ilk olay (adet · sonraki evreden gol): '+Object.keys(S1).sort((a,c)=>S1[c][0]-S1[a][0]).map(k=>k+' '+S1[k][0]+' · '+S1[k][1]+' ('+y(S1[k][1],S1[k][0])+')').join(' | '));}
  /* serbest vuruş hücreleri */
  const m2=Math.max(4,Math.round(n/5)),H=[['merkez',18,0],['merkez',22,0],['merkez',26,0],['merkez',30,0],['yarı',18,10],['yarı',22,10],['yarı',26,10],
    ['kenar',18,18],['kenar',22,18],['kenar',26,18],['uzak',36,0],['uzak',40,10]],S={};
  for(const [ad,u,w] of H){const L=[];let yok=0;for(let i=0;i<m2;i++){const r=kos('serbest',i%2,u,(i%4<2?1:-1)*w);if(!r){yok++;continue;}L.push(r);}S[ad+u]={ad,u,w,L,yok};}
  console.log(`\n  Serbest vuruş · hücre başına ${m2} · ${((Date.now()-t0)/1000).toFixed(1)} sn toplam`);
  console.log('  Hücre        n  yok  hazırlık   baraj  kişi   d.şut    orta   diğer   d.gol/şut  çerçeve  8 sn gol  kutu hücumcu');
  for(const k in S){const {ad,u,w,L,yok}=S[k],dog=L.filter(r=>r.dogrudan);
    console.log('  '+(ad+' '+u+'/'+w).padEnd(11)+String(L.length).padStart(4)+String(yok).padStart(5)+f1(ortanca(L.map(r=>r.hz))).padStart(9)+y(say(L,r=>r.baraj),L.length).padStart(9)+f1(ort(L.filter(r=>r.baraj).map(r=>r.nb))).padStart(6)
      +y(say(L,r=>r.alt==='sut'),L.length).padStart(8)+y(say(L,r=>r.alt==='orta'),L.length).padStart(8)+y(say(L,r=>r.alt!=='sut'&&r.alt!=='orta'),L.length).padStart(8)
      +(dog.length?y(say(dog,r=>r.golDogrudan&&r.gol),dog.length):'—').padStart(12)+(dog.length?y(say(dog,r=>r.cerceve),dog.length):'—').padStart(9)+y(say(L,r=>r.gol),L.length).padStart(10)+f1(ort(L.map(r=>r.kutuH))).padStart(13));}
  const havuz=[].concat(S.merkez18.L,S.merkez22.L,S.merkez26.L,S['yarı18'].L,S['yarı22'].L,S['yarı26'].L).filter(r=>r.baraj&&r.dogrudan);
  const hg=100*say(havuz,r=>r.golDogrudan&&r.gol)/Math.max(1,havuz.length),yk=[].concat(S.merkez18.L,S.merkez22.L).filter(r=>r.dogrudan),ykg=100*say(yk,r=>r.golDogrudan&&r.gol)/Math.max(1,yk.length);
  const pay=k=>100*say(S[k].L,r=>r.alt==='sut')/Math.max(1,S[k].L.length),ken=[].concat(S.kenar18.L,S.kenar22.L,S.kenar26.L),uz=[].concat(S.uzak36.L,S.uzak40.L);
  const kenOrta=100*say(ken,r=>r.alt==='orta')/Math.max(1,ken.length),kenSut=100*say(ken,r=>r.alt==='sut')/Math.max(1,ken.length),kenKutu=ort(ken.map(r=>r.kutuH));
  const uzSut=100*say(uz,r=>r.alt==='sut')/Math.max(1,uz.length),b18=ort(S.merkez18.L.filter(r=>r.baraj).map(r=>r.nb)),b26=ort(S.merkez26.L.filter(r=>r.baraj).map(r=>r.nb));
  const blok=havuz.length?100*say(havuz,r=>r.blok)/havuz.length:NaN,zp=havuz.length?100*say(havuz,r=>r.zip)/havuz.length:NaN;
  console.log(`  Barajlı doğrudan şut (merkez ve yarı 18–26 m): ${havuz.length} · gol/şut ${hg.toFixed(1)}% · barajdan dönen ${f1(blok)}% · baraj sıçradı ${f1(zp)}%`);
  /* A4-1 (bilgi): topun başında iki kişi ve aldatma koşusu — havuzun ve barajlı vuruşların payı, aldatmalı ve aldatmasız doğrudan şutta gol/şut */
  {const bL=[].concat(S.merkez18.L,S.merkez22.L,S.merkez26.L,S['yarı18'].L,S['yarı22'].L,S['yarı26'].L).filter(r=>r.baraj),hA=havuz.filter(r=>r.aldatma),hN=havuz.filter(r=>!r.aldatma);
    const aG=hA.filter(r=>r.aldOnce!=null);
    console.log(`  A4-1: barajlı vuruşta topun başında iki kişi ${y(say(bL,r=>r.ikili),bL.length)} · doğrudan şutta aldatma ${y(hA.length,havuz.length)} · gol/şut aldatmalı ${y(say(hA,r=>r.golDogrudan&&r.gol),hA.length)} (${hA.length}) · aldatmasız ${y(say(hN,r=>r.golDogrudan&&r.gol),hN.length)} (${hN.length})`);
    console.log(`  A4-1: aldatma koşusu topun yanından geçti ${aG.length}/${hA.length} · şuttan önce ortanca ${f1(ortanca(aG.map(r=>r.aldOnce)),2)} sn (kalecinin tepkisine ek: 0,8 sn içinde)`);}
  kapi(KAPI.serbest,havuz.length>0&&hg>=6&&hg<=10,`barajlı doğrudan şutta gol/şut %6–10 (merkez ve yarı 18–26 m) → %${hg.toFixed(1)} (${say(havuz,r=>r.golDogrudan&&r.gol)}/${havuz.length})`);
  /* T8c: bilgi — 18–22 m merkezde fazlalık genel şut isabetinden ve kalecinin kurtarışından (maçta isabet %45–47, bant 30–45; kurtarış %55,
     gerçekte ~%70): T10 öncesi gözden geçirmede; havuz (6–10) kapıdır */
  kapi(false,ykg<=15,`18–22 m merkezde doğrudan şutta gol/şut ≤ %15 → %${ykg.toFixed(1)}`);
  kapi(KAPI.serbest,pay('merkez18')>=60&&pay('merkez18')<=90,`18 m merkezde doğrudan şut %60–90 → %${pay('merkez18').toFixed(1)}`);
  kapi(KAPI.serbest,pay('merkez30')>=20&&pay('merkez30')<=50,`30 m merkezde doğrudan şut %20–50 → %${pay('merkez30').toFixed(1)}`);
  kapi(KAPI.serbest,uzSut<=10,`uzak serbest vuruşta doğrudan şut ≤ %10 → %${uzSut.toFixed(1)}`);
  kapi(KAPI.serbest,kenOrta>=60&&kenSut<=15,`kenarda orta ≥ %60, doğrudan şut ≤ %15 → %${kenOrta.toFixed(1)} / %${kenSut.toFixed(1)}`);
  kapi(KAPI.serbest,kenKutu>=4&&kenKutu<=6,`kenarda kullanımda kutudaki hücumcu 4–6 → ${f1(kenKutu)}`);
  kapi(KAPI.serbest,b18>=4&&b18<=5&&b26>=2&&b26<=4,`baraj 18 m merkezde 4–5, 26 m merkezde 2–4 → ${f1(b18)} / ${f1(b26)}`);
  /* penaltı, taç, kale vuruşu */
  const m3=Math.max(4,Math.round(n/7)),P=[],T=[],V=[];
  for(let i=0;i<m3;i++){const r=kos('penalti',i%2,11,0);if(r)P.push(r);}
  for(let i=0;i<m3;i++){const r=kos('tac',i%2,25,(i%4<2?1:-1)*34.15);if(r)T.push(r);}
  for(let i=0;i<m2;i++){const r=kos('kaleVurusu',i%2,PL_KV,(i%4<2?1:-1)*4);if(r)V.push(r);}
  const pg=100*say(P,r=>r.gol)/Math.max(1,P.length),prib=100*say(P,r=>r.rib>=1)/Math.max(1,P.length);
  console.log(`\n  Penaltı: ${P.length} · hazırlık ortancası ${f1(ortanca(P.map(r=>r.hz)))} sn · gol ${pg.toFixed(1)}% · ribaund koşucusu ort. ${f1(ort(P.map(r=>Math.max(0,r.rib))),2)} (en az 1: ${prib.toFixed(1)}%)`);
  kapi(KAPI.penalti,prib>=70,`penaltıda en az bir ribaund koşucusu ≥ %70 → %${prib.toFixed(1)}`);
  const tu=100*say(T,r=>r.alt==='uzun')/Math.max(1,T.length);
  console.log(`  Taç (son üçte bir): ${T.length} · hazırlık ortancası ${f1(ortanca(T.map(r=>r.hz)))} sn · uzun (≥ 18 m) ${tu.toFixed(1)}% · 8 sn içinde şut ${(T.reduce((a,r)=>a+r.sut,0)/Math.max(1,T.length)).toFixed(2)}`);
  kapi(KAPI.tac,tu>=10,`son üçte birde uzun taç ≥ %10 → %${tu.toFixed(1)}`);
  const vy=100*say(V,r=>!r.elle)/Math.max(1,V.length);
  console.log(`  Kale vuruşu: ${V.length} · hazırlık ortancası ${f1(ortanca(V.map(r=>r.hz)))} sn · yerden ${vy.toFixed(1)}% · uzun ${y(say(V,r=>r.alt==='uzun'),V.length)}`);
  kapi(KAPI.kaleVurusu,vy>=99,`kale vuruşu yerden (kaleci topu eline almadan) %100 → %${vy.toFixed(1)}`);
  console.log(`\n  Toplam ${((Date.now()-t0)/1000).toFixed(1)} sn${kabulDisi?` · kapı dışı ${kabulDisi}`:''}`);
  return kabulDisi?1:0;
}};