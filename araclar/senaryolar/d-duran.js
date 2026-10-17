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
  /* T17-0: ilk kafanın bloğu (rol, erişim, havada; önceki adımın top yeri), ikinci evre (1,5 sn sonra), pencerenin bitişi, kapanıştan sonra gol */
  let hkT=-1,hkX=0,hkZ=0,hkR=null,hkSav=-1,hkHuc=-1,evSav=-1,evHuc=-1,evMarkaj=null,evAcik=null,blokT=-1,blokRol=null,blokEr=null,blokHavada=null,blokD=NaN,golBlok=false,bitis=null,bitT=-1,golBitis=false,dsSon=null;const onc={x:0,z:0,y:0};
  let sbIlk=null,sbIlkT=null,sbSut=null,golBlokT=null,bSonra=null,sonra1K=null;   /* T19-0: kalecinin ilk kafadan sonraki dokunuşu (tuttu, çeldi, parmak, yumruk, kapan) */   /* bloktan sonra: ilk dokunan, hücumun ilk şutu {t, L, gk, sav15, blok, gol} */
  const kutuda=(p,tt)=>{const gx=m.dir[tt]*PL;return Math.abs(p.x-gx)<CEZA_U&&Math.abs(p.z-MZ)<CEZA_W;};
  const m=new Match((ad,v)=>{
    if(ad==='kullanim'&&!kul&&v&&v.takim===t){kul=v;su=m.t;elle=v.alt==='elle';
      const A=m.teams[t].filter(q=>q.oyunda&&q.rol!=='GK'&&q!==v.p),D=m.teams[1-t].filter(q=>q.oyunda&&q.rol!=='GK');
      kutuH=A.filter(q=>kutuda(q,t)).length;kutuS=D.filter(q=>kutuda(q,t)).length;A0=A.filter(q=>!kutuda(q,t));return;}
    if(!kul||!v)return;
    if(ad==='shot'&&v.p&&v.p.team===t){sut++;if(v.p===kul.p&&m.t-su<1.6&&!dogrudan){dogrudan=true;cerceve=!!(m.ball.sut&&m.ball.sut.cerceve);}}
    else if(ad==='header'&&v.shot&&v.p&&v.p.team===t)sut++;
    else if(ad==='goal'&&v.team===t&&!gol){gol=true;golDogrudan=m.ball.sonDokunan===kul.p||v.scorer===kul.p;golIlk=!!ilkP&&(m.ball.sonDokunan===ilkP||v.scorer===ilkP);
      if(blokT>=0&&m.t-blokT<=8){golBlok=true;golBlokT=m.t-blokT;}if(bitT>=0&&m.t-bitT<=8)golBitis=true;}
    if(ad==='block'&&v.p&&kul.barajdakiler&&kul.barajdakiler.includes(v.p)&&m.t-su<1)blok=true;
    /* T17-0: savunma bloğundan sonraki zincir */
    if(blokT>=0&&v&&v.p&&m.t>blokT+1e-6){const h=v.p.team===t;
      if(!sbIlk){if(ad==='save'||ad==='yumruk'||ad==='parmak'||ad==='kapan')sbIlk='kaleci';else if(ad==='header')sbIlk=h?'hucKafa':'savKafa';
        else if(ad==='ilkDokunus'||ad==='sekme'||ad==='block'||ad==='kotuKontrol'||ad==='shot'||ad==='clear'||ad==='pass'||ad==='cross')sbIlk=h?'hucAyak':'savAyak';
        if(sbIlk)sbIlkT=m.t-blokT;}
      if(!sbSut&&h&&m.t-blokT<=4&&(ad==='shot'||ad==='header'&&v.shot)){const p=v.p,gk=m.teams[1-t].find(q=>q.rol==='GK'&&q.oyunda),D=m.teams[1-t];
        sbSut={t:m.t-blokT,L:Math.hypot(m.dir[t]*PL-p.x,MZ-p.z),gk:gk&&gk.eylem?gk.eylem.ad:'ayakta',gkYuk:gk&&gk.yuk>0.05,sav15:D.filter(q=>q.oyunda&&q!==gk&&Math.hypot(q.x-p.x,q.z-p.z)<1.5).length,blok:false,gol:false};}
      if(sbSut&&!sbSut.blok&&!sbSut.gol&&ad==='block'&&!h&&m.t-blokT>sbSut.t)sbSut.blok=true;
      if(sbSut&&ad==='goal'&&v.team===t&&m.t-blokT-sbSut.t<=4)sbSut.gol=true;}
    /* A4 (bilgi): hücumun ilk kafasından sonraki ilk olay — kaleci, blok, savunmanın kafası ya da ayağı, hücumun ikinci dokunuşu */
    if(ilkP&&!sonra1&&m.t>ilkT+1e-6&&v&&v.p){if(ad==='save'||ad==='yumruk'||ad==='parmak'||ad==='kapan'){sonra1='kaleci';sonra1K=ad==='save'?(v.catch?'tuttu':v.bicim==='parmak'?'parmak':'celdi'):ad;}else if(ad==='block'){sonra1=v.p.team===t?'hucBlok':'savBlok';
        if(v.p.team!==t){const p=v.p;blokT=m.t;blokRol=hkR&&hkR.get(p)||'diger';const yb=onc.y-(p.yuk||0);blokEr=yb<0.8?'ayak':yb<1.55?'gogus':'ust';blokHavada=(p.yuk||0)>0.05||!!p.zipla;blokD=Math.hypot(p.x-hkX,p.z-hkZ);
        const b2=m.ball,dd=m.dir[t],gx=dd*PL,vh=Math.hypot(b2.vx,b2.vz),tg=b2.vx*dd>0.5?(gx-b2.x)/b2.vx:-1,zg=tg>0?b2.z+b2.vz*tg:NaN;
        bSonra={v:vh,vOnce:Math.hypot(onc.vx||0,onc.vz||0),vy:b2.vy,y:b2.y,yOnce:onc.y,yuk:p.yuk||0,kaleye:tg>0&&tg<1.5&&Math.abs(zg-MZ)<GW2+0.6,ileri:b2.vx*dd>0};}}
      else if(ad==='header')sonra1=v.p.team===t?'hucKafa':'savKafa';else if(ad==='ilkDokunus'||ad==='sekme'||ad==='kotuKontrol'||ad==='shot')sonra1=v.p.team===t?'hucAyak':'savAyak';}
    /* T10b (2026-10-11): ilk temastan önce çalınan faul (kutuda tutma, havada kol, kaleciye çarpma) ayrı sınıf — eskiden "disari" sayılıyordu */
    if(!ilk&&ad==='faul'&&m.t-su<4&&(kul.alt!=='kisa'&&kul.alt!=='geri')){ilk='faul';return;}
    if(!ilk&&v.p&&m.t-su<4&&(kul.alt!=='kisa'&&kul.alt!=='geri')){const h=v.p.team===t;
      if(ad==='header'){ilk=h?'hucumKafa':'savunmaKafa';if(h){ilkP=v.p;ilkSut=!!v.shot;ilkT=m.t;
        hkT=m.t;hkX=m.ball.x;hkZ=m.ball.z;hkR=new Map();for(const q of m.teams[1-t])if(q.oyunda&&q.duranRol)hkR.set(q,q.duranRol.rol);
        hkSav=m.teams[1-t].filter(q=>q.oyunda&&q.rol!=='GK'&&kutuda(q,t)).length;hkHuc=m.teams[t].filter(q=>q.oyunda&&q.rol!=='GK'&&q!==kul.p&&kutuda(q,t)).length;}}
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
    /* T17-0: pencerenin bitiş nedeni (motorun duranSonrasiAdim sırası: duruş, süre, 28 m, sahiplik, şut) ve ilk kafadan 1,5 sn sonrası */
    {const DS=m._duranSonrasi;if(DS)dsSon={t0:DS.t0,x:DS.x,sahipT:DS.sahipT};
      else if(dsSon&&!bitis){const dd=m.dir[t];if(m.phase!=='play')bitis='durus';else if(m.t-dsSon.t0>MOTOR_AYAR.duranRolSure)bitis='sure';else if(b.x*dd<Math.min(PL-28,dsSon.x*dd-10))bitis='m28';
        else if(dsSon.sahipT>=0&&m.t-dsSon.sahipT>0.8)bitis='sahip';else if(m._sonSut&&m._sonSut.t>dsSon.t0)bitis='sut';else bitis='diger';bitT=m.t;dsSon=null;}}
    if(hkT>=0&&evSav<0&&m.t-hkT>=1.5){const A=m.teams[t].filter(q=>q.oyunda&&q.rol!=='GK'&&kutuda(q,t)),D=m.teams[1-t].filter(q=>q.oyunda&&q.rol!=='GK'&&kutuda(q,t));
      evSav=D.length;evHuc=A.length;let mk=0;for(const a of A)if(D.some(q=>Math.hypot(q.x-a.x,q.z-a.z)<1.5))mk++;evMarkaj=[mk,A.length];evAcik=!!m._duranSonrasi;}
    if(!zip&&dt<0.5&&kul.barajdakiler&&kul.barajdakiler.some(q=>q.zipla||q.yuk>0.05))zip=true;
    if(inis==null&&dt>0.2&&b.vy<0&&b.y<2.6&&!b.sahip&&!b.tasiyan){const n2=[0,0];for(const q of m.players)if(q.oyunda&&q.rol!=='GK'&&Math.hypot(q.x-b.x,q.z-b.z)<1.5)n2[q.team]++;inis=n2[0]>0&&n2[1]>0;}
    if(rib<0&&dt>=1.0&&A0)rib=A0.filter(q=>q.oyunda&&kutuda(q,t)).length;
    if(!ilk&&(kul.alt!=='kisa'&&kul.alt!=='geri')){if(b.tasiyan&&b.tasiyan.rol==='GK'&&b.tasiyan.team!==t)ilk='kaleci';else if(inis!=null&&b.y<0.3&&!b.sahip)ilk='yere';else if(dt>4)ilk='yok';}
    onc.x=b.x;onc.z=b.z;onc.y=b.y;onc.vx=b.vx;onc.vz=b.vz;}
  return{hz:kul.hazirlik,alt:kul.alt,bolge:kul.bolge,sut,gol,golDogrudan,golIlk,ilkSut,sonra1,dogrudan,cerceve,ilk,inis,blok,zip,rib,kutuH,kutuS,baraj,nb,elle,perde:!!(kul.du&&kul.du.gorev&&[...kul.du.gorev.values()].some(g=>g.rol==='perdeAdam')),ikili:!!(kul.du&&kul.du.ikili),aldatma:!!(kul.du&&kul.du.aldatma),aldOnce:kul.du&&kul.du.aldatmaGecti!=null?su-kul.du.aldatmaGecti:null,
    sonra1K,hkBlok:sonra1==='savBlok',blokRol,blokEr,blokHavada,blokD,golBlok,golBlokT,sbIlk,sbIlkT,sbSut,bSonra,hkSav,hkHuc,evSav,evHuc,evMarkaj,evAcik,bitis,bitT:bitT>=0?bitT-su:null,golBitis,sutP:sut>0};})`;
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
    console.log('  A4: ilk kafadan sonraki ilk olay (adet · sonraki evreden gol): '+Object.keys(S1).sort((a,c)=>S1[c][0]-S1[a][0]).map(k=>k+' '+S1[k][0]+' · '+S1[k][1]+' ('+y(S1[k][1],S1[k][0])+')').join(' | '));
    /* T19-0 (bilgi; T19b kabulü ≤ %8): hücumun ilk kafasına kaleci dokundu — sonraki evreden gol, dokunuşun türüne göre */
    {const KK=HK.filter(r=>r.sonra1==='kaleci'),KT={};for(const r of KK){const k=r.sonra1K||'?',u=KT[k]||(KT[k]=[0,0]);u[0]++;if(r.gol&&!r.golIlk)u[1]++;}
      console.log('  T19: ilk kafaya kaleci dokundu '+KK.length+' · sonraki evreden gol '+y(say(KK,r=>r.gol&&!r.golIlk),KK.length)+' (kabul ≤ %8) · türe göre '+Object.keys(KT).sort((a,c)=>KT[c][0]-KT[a][0]).map(k=>k+' '+KT[k][0]+' · gol '+y(KT[k][1],KT[k][0])).join(' | '));}
    /* T17-0 (bilgi): ilk kafanın bloğu — pay, bloktan sonra 8 sn'de gol, bloklayanın rolü ve erişimi, havada mı, kafa noktasına uzaklık; ikinci evre;
       pencerenin bitiş nedeni ve kapanıştan sonra gol; 8 sn'de şut olan korner payı */
    const SB=HK.filter(r=>r.hkBlok),sb=(f2)=>y(say(SB,f2),SB.length);
    console.log('  T17: ilk kafanın blok payı '+y(SB.length,HK.length)+' ('+SB.length+'/'+HK.length+') · bloktan sonra 8 sn\'de gol '+sb(r=>r.golBlok)+' · bloklayan rolü '+['adam','bolge','direk','diger'].map(k=>k+' '+sb(r=>r.blokRol===k)).join(' / ')+' · erişim '+['ayak','gogus','ust'].map(k=>k+' '+sb(r=>r.blokEr===k)).join(' / ')+' · havada '+sb(r=>r.blokHavada)+' · kafa noktasına '+f1(ortanca(SB.map(r=>r.blokD)),2)+' m');
    {const SI={};for(const r of SB){const k=r.sbIlk||'yok';SI[k]=(SI[k]||0)+1;}const SS=SB.filter(r=>r.sbSut),GK={};for(const r of SS){const k=r.sbSut.gk+(r.sbSut.gkYuk?'+havada':'');GK[k]=(GK[k]||0)+1;}
      console.log('  T17: bloktan sonra ilk dokunan '+Object.keys(SI).sort((a,c)=>SI[c]-SI[a]).map(k=>k+' '+y(SI[k],SB.length)).join(' · ')+' (ortanca '+f1(ortanca(SB.filter(r=>r.sbIlkT!=null).map(r=>r.sbIlkT)),2)+' sn) · 4 sn içinde hücum şutu '+y(SS.length,SB.length)+' (ortanca '+f1(ortanca(SS.map(r=>r.sbSut.t)),2)+' sn, '+f1(ortanca(SS.map(r=>r.sbSut.L)))+' m) · o şut bloklandı '+y(say(SS,r=>r.sbSut.blok),SS.length)+' · gol '+y(say(SS,r=>r.sbSut.gol),SS.length)+' · şutçunun 1,5 m içinde savunmacı ort. '+f1(ort(SS.map(r=>r.sbSut.sav15)),2));
      console.log('  T17: bloktan sonraki şutta kaleci '+Object.keys(GK).sort((a,c)=>GK[c]-GK[a]).map(k=>k+' '+y(GK[k],SS.length)).join(' · '));
      const SG=SB.filter(r=>r.golBlok),GI={};for(const r of SG){const k=r.sbIlk||'yok';GI[k]=(GI[k]||0)+1;}
      {const BS=SB.filter(r=>r.bSonra),BG=BS.filter(r=>r.golBlok);const oz=L=>'kaleye '+y(say(L,r=>r.bSonra.kaleye),L.length)+' · ileri '+y(say(L,r=>r.bSonra.ileri),L.length)+' · hız önce '+f1(ortanca(L.map(r=>r.bSonra.vOnce)))+' → sonra '+f1(ortanca(L.map(r=>r.bSonra.v)))+' m/sn · vy '+f1(ortanca(L.map(r=>r.bSonra.vy)))+' · top y '+f1(ortanca(L.map(r=>r.bSonra.yOnce)),2)+' m · bloklayan yuk '+f1(ortanca(L.map(r=>r.bSonra.yuk)),2)+' m';
        console.log('  T17: blok sonrası top — bütün bloklar ('+BS.length+'): '+oz(BS));console.log('  T17: blok sonrası top — gol olan bloklar ('+BG.length+'): '+(BG.length?oz(BG):'—'));}
      console.log('  T17: gol olan bloklarda ilk dokunan '+Object.keys(GI).sort((a,c)=>GI[c]-GI[a]).map(k=>k+' '+GI[k]).join(' · ')+' · gol bloktan sonra ortanca '+f1(ortanca(SG.map(r=>r.golBlokT)),2)+' sn ('+SG.length+')');}
    const HE=HK.filter(r=>r.evSav>=0);
    console.log('  T17: ilk kafada kutuda savunmacı '+f1(ort(HK.map(r=>r.hkSav)))+' · hücumcu '+f1(ort(HK.map(r=>r.hkHuc)))+' · 1,5 sn sonra savunmacı '+f1(ort(HE.map(r=>r.evSav)))+' · hücumcu '+f1(ort(HE.map(r=>r.evHuc)))+' · markajlı hücumcu '+y(HE.reduce((a,r)=>a+r.evMarkaj[0],0),HE.reduce((a,r)=>a+r.evMarkaj[1],0))+' · pencere açık '+y(say(HE,r=>r.evAcik),HE.length)+' ('+HE.length+')');
    const BT={};for(const r of Kc){const k=r.bitis||'acik8';BT[k]=(BT[k]||0)+1;}
    console.log('  T17: pencerenin bitişi '+Object.keys(BT).sort((a,c)=>BT[c]-BT[a]).map(k=>k+' '+y(BT[k],Kc.length)).join(' · ')+' · bitiş ortancası '+f1(ortanca(Kc.filter(r=>r.bitT!=null).map(r=>r.bitT)))+' sn · kapanıştan sonra 8 sn\'de gol '+y(say(Kc,r=>r.golBitis),say(Kc,r=>r.bitis))+' · 8 sn\'de şut olan korner '+y(say(KL,r=>r.sutP),Kn));}
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