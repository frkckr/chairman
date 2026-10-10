/* ============ Gerçekçilik planı T7 senaryosu: orta saha → kanat (c-kanat; Ek H 37; T7-0 iskeleti, 2026-10-10) ============
   Ev sahibi kendi yarısında topu kuruyor: stoper (mevki 2) topu ayağında, merkez orta saha (7) 14 m önünde, yüzü stopere (sırtı rakip kaleye), sol
   kanat (8) açıkta ileride, sol bek (4) geride, forvet (10) rakip savunmanın önünde. Stoperin merkeze pası motorun kendi seçeneklerinden
   (secenekler → alıcısı merkez olan pas) başlatılır; sonrası karar katmanınındır, sonuç sabitlenmez. Kademeler (başlangıç ve profiller sabit):
     0 rakipsiz (yalnız kaleciler)
     1 kör noktadan presçi: konuk derin orta saha merkezin 6 m arkasında ve 2 m yanında (görüş dışı), pas yoldayken kapanır; denemelerin yarısında
       merkezin görüşü 0,3, yarısında 0,85 (Ek H 26: görüşü düşük merkez presçiyi son taramasındaki yerinde bilir)
     2 küçük grup: + konuk sağ bek kanadın 3 m kale tarafında, konuk forvet stopere 3 m/sn ile basıyor
     3 11'e 11: herkes dizilişin yerinde (dizilisKonumu), yukarıdaki beş ev sahibi ve sırttaki savunmacı aynı başlangıçta
   Ölçülen: pasın merkeze ulaşması (merkezin ilk dokunuşu; tek dokunuşla oynaması dahil); topun yolundayken merkezin omzunun üstünden bakması
   (tarama); merkezin ilk eylemi (kanada pas, ileri pas, geri/yan pas, dönüp ilerleme (yüzü kaleye ±60° ve 1,5 m ileri), taşıma (≥ 4 m), kayıp,
   5 sn tutuyor) ve tek dokunuş payı; alıştan pasa süre; kanada pas payı; kanadın 4 sn içindeki devamı (ilerler ≥ 5 m, orta, içeri kat eder
   ≥ 4 m ya da şut, beke/merkeze döner, kayıp, diğer); 6 sn sonra top ev sahibinde mi.
   Kabul (T7g, 2026-10-10; kabul dışıysa çıkış kodu 1): [1] kademe 0–2'de pas merkeze ≥ %90 ulaşır ve merkez topun yolunda ≥ 1,5 kez omzunun
   üstünden bakar; [2] küçük grupta kanada pas ≥ %40 ve 6 sn sonra top ev sahibinde ≥ %55 (kademe başına 40 denemede %68–83, 24'te %58–83:
   varsayılan 40); [A] algı denetimi. 11'e 11 kademesi bilgidir (zorla
   verilen stoper pası sırtı markajlı merkeze %55–65 kesilir).
   Kullanım: node araclar/mac-deneme.js --senaryo c-kanat [N=40 kademe başına] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||40,dt=1/60,t0=Date.now();
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const profilKur=vm.runInContext('profilKur',ctx),PW=vm.runInContext('PW',ctx),MZ=vm.runInContext('MZ',ctx);
  const secenekler=vm.runInContext('secenekler',ctx),dizilisKonumu=vm.runInContext('dizilisKonumu',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,v)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:Math.cos(yon)*(v||0),vz:Math.sin(yon)*(v||0),spd:v||0,yon,eylem:null,kickCd:0,surus:null,kosu:null,destek:null,oyunda:true,denge:1,calim:null,yutma:null});};
  const KADEME=['0 rakipsiz','1 kör noktadan presçi','2 küçük grup','3 11\'e 11'];
  const IL=['kanada','ileri','geri/yan','döndü','taşıdı','kayıp','tutuyor'],KD=['ilerledi','orta','içeri','beke/merkeze','kayıp','diğer'];
  const sonuc=[];let deneme=0;
  for(let k=0;k<4;k++)for(let i=0;i<n;i++){deneme++;
    const o={k,gorus:null,pasYok:false,ulasti:false,kesildi:false,tara:0,ilk:null,tek:false,birak:null,kanada:false,kanatDevam:null,elde6:false};
    let CB,CM,W,FB,FV,D1,D2,P1,m,tVur=null,tAl=null,tKanat=null,alU=0,alZ=0,wU=0,wZ=0,d=1;
    const u=x=>x*d;
    const alis=()=>{if(tAl!=null)return;tAl=m.t;o.ulasti=true;alU=u(CM.x);alZ=CM.z;};
    m=kur((tohum||1)*1000+deneme,(ad,v)=>{
      if(!CM||tVur==null)return;
      if((ad==='pass'||ad==='cross')&&v.p===CM&&o.birak==null){if(tAl==null){alis();o.tek=true;}o.birak=m.t-tAl;
        if(v.q===W){o.kanada=true;if(!o.ilk)o.ilk='kanada';}
        else if(!o.ilk){const ileri=(v.hx-CM.x)*d;o.ilk=v.q===FV||ileri>4?'ileri':'geri/yan';}}
      else if(o.kanada&&o.kanatDevam==null&&v.p===W){
        if(tKanat==null){tKanat=m.t;wU=u(W.x);wZ=W.z;}
        if(ad==='cross')o.kanatDevam='orta';else if(ad==='shot')o.kanatDevam='içeri';
        else if(ad==='pass')o.kanatDevam=v.q===FB||v.q===CM?'beke/merkeze':'diğer';}});
    d=m.dir[0];const hy=d>0?0:Math.PI,T0=m.teams[0],T1=m.teams[1],b=m.ball;
    CB=T0[2];CM=T0[7];W=T0[8];FB=T0[4];FV=T0[10];D1=T1[6];D2=T1[1];P1=T1[9];
    const evler=[CB,CM,W,FB,FV];
    if(k===0)bosalt(m,evler);else if(k===1)bosalt(m,evler.concat([D1]));else if(k===2)bosalt(m,evler.concat([D1,D2,P1]));
    else{/* 11'e 11: herkes dizilişin yerinde (top stoperde) */
      const bu=-24,bw=MZ-6;for(let t=0;t<2;t++){const dt2=m.dir[t],diz=m.taktik[t].dizilis;
        for(const p of m.teams[t]){if(!p.oyunda)continue;const q=dizilisKonumu(diz,p.n,t===0?bu:-bu,bw,t===0);yerlestir(p,q.u*dt2,q.w,dt2>0?0:Math.PI,0);}}}
    if(k===1){const g=i%2?0.85:0.3;o.gorus=g;CM.oz.gorus=g;CM._kutle=0;CM._cev=null;CM._hk=undefined;profilKur(CM,m.tohum);}
    yerlestir(CB,d*-24,MZ-6,hy,0);
    yerlestir(CM,d*-10,MZ+5+(i%3-1),0,0);CM.yon=Math.atan2(CB.z-CM.z,CB.x-CM.x);   /* yüzü stopere */
    CB.yon=Math.atan2(CM.z-CB.z,CM.x-CB.x);
    yerlestir(W,d*-2,PW-5,hy,0);yerlestir(FB,d*-16,PW-9,hy,0);yerlestir(FV,d*12,MZ+2,hy,0);
    if(k===1)yerlestir(D1,CM.x+d*6,CM.z-2,hy+Math.PI,0);else if(k>=2)yerlestir(D1,CM.x+d*3,CM.z-0.4,hy+Math.PI,0);
    if(k===2){yerlestir(D2,W.x+d*3,W.z-1.5,hy+Math.PI,0);yerlestir(P1,CB.x+d*8,CB.z+1,hy+Math.PI,3);}
    m.phase='play';m.phaseT=1;m.durus=null;
    Object.assign(b,{x:CB.x+Math.cos(CB.yon)*0.35,z:CB.z+Math.sin(CB.yon)*0.35,y:0,vx:0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:CB});
    m.topDegisti();m.sahipYap(CB);
    /* stoperin merkeze pası: motorun kendi seçeneklerinden (yoksa deneme sayılmaz) */
    const S=secenekler(m,CB).filter(s=>s.alici===CM&&(s.tur==='pas'||s.tur==='ara'));
    const sec=S.find(s=>s.alt==='ayak')||S[0];
    if(!sec){o.pasYok=true;sonuc.push(o);continue;}
    m.secenekUygula(CB,sec);
    const bv=m.bVeri(CM);let sonBas=bv.tara?bv.tara.bas:-9,kayipT=null;
    for(let a=0;a<60*14;a++){
      m.step(dt);
      if(m.phase!=='play')break;
      if(tVur==null){if(b.pas&&b.pas.p===CB)tVur=m.t;else if(a>120)break;else continue;}
      if(tAl==null){
        const T=bv.tara;if(T&&T.bas!==sonBas)o.tara++;if(T)sonBas=T.bas;
        if(b.sonDokunan===CM||b.sahip===CM)alis();
        else if(b.sonDokunan&&b.sonDokunan.team===1||b.sahip&&b.sahip.team===1){o.kesildi=true;break;}
        else if(m.t-tVur>4)break;
        if(tAl==null)continue;}
      /* alıştan sonra */
      if((b.sahip&&b.sahip.team===1||b.sonDokunan&&b.sonDokunan.team===1&&!b.pas)&&kayipT==null){kayipT=m.t;if(!o.ilk)o.ilk='kayıp';if(o.kanada&&o.kanatDevam==null)o.kanatDevam='kayıp';}
      if(!o.ilk&&b.sahip===CM){const yuz=Math.cos(CM.yon-hy)>0.5,ilerleme=u(CM.x)-alU,yol=Math.hypot(u(CM.x)-alU,CM.z-alZ);
        if(yuz&&ilerleme>1.5)o.ilk='döndü';else if(yol>4)o.ilk='taşıdı';}
      if(!o.ilk&&m.t-tAl>5)o.ilk='tutuyor';
      /* kanat aldı: devamı */
      if(o.kanada&&tKanat==null&&(b.sahip===W||b.sonDokunan===W)){tKanat=m.t;wU=u(W.x);wZ=W.z;}
      if(tKanat!=null&&o.kanatDevam==null&&b.sahip===W){
        if(u(W.x)-wU>5)o.kanatDevam='ilerledi';else if(Math.abs(wZ-MZ)-Math.abs(W.z-MZ)>4)o.kanatDevam='içeri';}
      if(tKanat!=null&&o.kanatDevam==null&&m.t-tKanat>4)o.kanatDevam='diğer';
      if(m.t-tAl>=6){o.elde6=kayipT==null;break;}}
    sonuc.push(o);}
  /* rapor */
  const yz=(a,c)=>c?(100*a/c).toFixed(0)+'%':'—',ortanca=L=>{if(!L.length)return NaN;const B=L.slice().sort((a,b)=>a-b);return B[Math.floor(B.length/2)];};
  console.log(`\nT7 · c-kanat (orta saha → kanat; Ek H 37) · ${deneme} deneme · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  const yaz=(ad,L)=>{const P=L.filter(o=>!o.pasYok),U=L.filter(o=>o.ulasti),ilk={},kd={};for(const o of U){ilk[o.ilk||'tutuyor']=(ilk[o.ilk||'tutuyor']||0)+1;}
    const K=U.filter(o=>o.kanada);for(const o of K){const c=o.kanatDevam||'diğer';kd[c]=(kd[c]||0)+1;}
    const br=U.map(o=>o.birak).filter(x=>x!=null),bo=ortanca(br);
    console.log(`  ${ad.padEnd(24)} n ${String(L.length).padStart(3)} · pas yok ${L.length-P.length} · ulaştı ${yz(U.length,P.length)} · kesildi ${yz(L.filter(o=>o.kesildi).length,P.length)} · yolda tarama ${(U.reduce((a,o)=>a+o.tara,0)/Math.max(1,U.length)).toFixed(2)} · tek dokunuş ${yz(U.filter(o=>o.tek).length,U.length)} · bırakma ortanca ${Number.isNaN(bo)?'—':bo.toFixed(2)+' sn'} · 6 sn elde ${yz(U.filter(o=>o.elde6).length,U.length)}`);
    console.log(`      ilk eylem: `+IL.map(c=>c+' '+yz(ilk[c]||0,U.length)).join(' · '));
    console.log(`      kanada pas ${yz(K.length,U.length)} → kanat: `+KD.map(c=>c+' '+yz(kd[c]||0,K.length)).join(' · '));};
  for(let k=0;k<4;k++){const L=sonuc.filter(o=>o.k===k);yaz(KADEME[k],L);
    if(k===1){yaz('   görüş 0,3',L.filter(o=>o.gorus===0.3));yaz('   görüş 0,85',L.filter(o=>o.gorus===0.85));}}
  /* kapılar [1]–[2] (T7g) */
  let k1=true,k2=true;const pay=(a,c)=>c?100*a/c:0;
  for(let k=0;k<3;k++){const L=sonuc.filter(o=>o.k===k&&!o.pasYok),U=L.filter(o=>o.ulasti),ul=pay(U.length,L.length),tr=U.reduce((a,o)=>a+o.tara,0)/Math.max(1,U.length);if(ul<90||tr<1.5)k1=false;}
  {const U=sonuc.filter(o=>o.k===2&&o.ulasti),kn=pay(U.filter(o=>o.kanada).length,U.length),el=pay(U.filter(o=>o.elde6).length,U.length);if(kn<40||el<55)k2=false;
   console.log((k1?'  ':'! ')+'[1] Kabul (T7): kademe 0–2 pas merkeze ≥ %90 ulaşır, topun yolunda tarama ≥ 1,5 — '+(k1?'tuttu':'TUTMADI'));
   console.log((k2?'  ':'! ')+`[2] Kabul (T7): küçük grupta kanada pas %${kn.toFixed(0)} (≥ 40), 6 sn elde %${el.toFixed(0)} (≥ 55)`);}
  /* [A] algı denetimi (T7c, Ek H 26; belirlenimli): topu tutan merkezin 4 m arkasından 5 m/sn ile gelen rakip, merkezin son taramasında (1 sn önce)
     12 m geride duruyordu. Karar katmanının baskı süresi (gözlemci merkez) algıya göre uzun, gerçeğe göre kısa olmalı; rakip görüş içindeyse ikisi
     aynı. Kabul: görüş dışında fark ≥ 0,5 sn, görüş içinde 0 (rakipAlgi 0 iken denetim atlanır) */
  let cikis=k1&&k2?0:1;
  {const algi=vm.runInContext('MOTOR_AYAR.rakipAlgi',ctx),olc=vm.runInContext('(m,p)=>gozlemle(p,()=>baskiSuresi(m,p.team,m.ball.x,m.ball.z,0).t1)',ctx);
    const m=kur((tohum||1)*1000+999,()=>{}),d=m.dir[0],hy=d>0?0:Math.PI,C=m.teams[0][7],D=m.teams[1][6],b=m.ball;
    bosalt(m,[C,D]);yerlestir(C,0,MZ,hy,0);yerlestir(D,-d*4,MZ+0.5,hy,5);
    m.phase='play';m.phaseT=1;m.durus=null;Object.assign(b,{x:C.x+d*0.4,z:C.z,y:0,vx:0,vz:0,vy:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:C});
    m.topDegisti();m.sahipYap(C);
    const nP=m.players.length,v=m.bVeri(C),T=v.tara={t:0,bas:-9,yan:1,ok:false,x:new Float64Array(nP),z:new Float64Array(nP),vx:new Float64Array(nP),vz:new Float64Array(nP)};
    m.taramaKaydi(T);const i=m.players.indexOf(D);T.t=m.t-1;T.x[i]=-d*12;T.z[i]=MZ+0.5;T.vx[i]=0;T.vz[i]=0;
    C.bakisYon=hy;m.kare++;const tDis=olc(m,C);C.bakisYon=hy+Math.PI;m.kare++;const tIc=olc(m,C);   /* algı karede bir kurulur: bakış değişince kare ilerletilir */
    const A=vm.runInContext('MOTOR_AYAR',ctx),es=A.rakipAlgi;A.rakipAlgi=0;C.bakisYon=hy;m.kare++;const tGer=olc(m,C);A.rakipAlgi=es;
    const ok=!algi||(tDis-tGer>=0.5&&Math.abs(tIc-tGer)<1e-9);if(!ok)cikis=1;
    console.log((ok?'  ':'! ')+`[A] Algı (Ek H 26): arkadan gelen rakip görüş dışındayken baskı süresi ${tDis.toFixed(2)} sn (gerçek ${tGer.toFixed(2)} sn), görüş içinde ${tIc.toFixed(2)} sn — kabul: dışarıda fark ≥ 0,5, içeride 0${algi?'':' (rakipAlgi 0: atlandı)'}`);}
  return cikis;
}};
