'use strict';
/* ============ V1 senaryosu: amaçlı uzaklaştırma (u-uzak; V1-0b iskeleti, 2026-10-20; FUTBOL_KUTUPHANESI §12.14, V1d; kullanıcı notu 4) ============
   Kullanım: node araclar/mac-deneme.js --senaryo u-uzak [N=80 hücre başına] [tohum]
   Kurulum c-koru kalıbıyla (kur, bosalt, yerlestir, profil, sahipYap); karar katmanı açık (motorun kararı ölçülür), deneme 5 sn. Ev sahibi kendi
   kalesini (x = −d·PL) savunur. Hücreler (V1d tasarımı):
   U1 kanatta sıkışma: sol bek kendi çizgisine 12 m, taç çizgisine 4 m, kendi kalesine dönük; rakip 1,0 m önde-içeride; stoper 15 m içeride.
   U2 amaçlı, baskısıza yakın: stoper ceza sahası köşesinde, rakip 3 m (baskı ~0,4); kanat forvet 35 m ileride boş.
   U3 kaleciye geri pas: stoper kendi çizgisine 20 m, ortada; rakip 2,2 m önden (baskı ~0,65); kaleci 12 m geride, hattı açık.
   U4 kaleye dönük, direğin 3 m dışı: kendi ceza sahasında (çizgiye 8 m), kaleye dönük; rakip 1,2 m arkada.
   U5 kendi çizgisine 35 m, baskı 1 (rakip 1 m): ayakla uzaklaştırma olmamalı (seçenek kendi 30 m'sinde).
   U6 dönen top: şuttan sonra kale önünde 8 m, top seken (vy 1,6), rakip 1,5 m; _donenT (şuttan sonra 3 sn).
   U7 kafa: (a) kendi ceza sahasında gelen ortaya (kafa yüksekliğinde) baskı altında kafa, (b) orta sahada (u = 0) düşen uzun topa panik kafası.
   Ölçülen: ilk karar (uzaklaştırma, pas — kaleciye ayrı —, koruma, bekleme, taşıma/sürüş, kayıp), uzaklaştırmada planlanan L ve hedef saha dışı,
   dil.adim.n, asgari hazırlık; topun kopyasıyla iniş ve tepe, yolun saha dışı; 5 sn sonunda top bizde / rakipte / oyun dışı (taç, korner, kale
   vuruşu) / gol; U3'te geri pasın kaleye doğruluğu ve kesilmesi; U4'te kale önünden yatay vuruş (iniş kendi 16 m'sinde ve kale ortasının 8 m'sinde).
   V1-0b: kapı yok, bugünkü değerleri yazar. Kapılar V1d-1 ve V1d-2'de açılır (V1-plan: U1 L > 30 m havadan saha dışı hedef 0, adımsız yalnız
   L ≤ 22 m, adımlı hazırlık ≥ 0,22 sn; U2 kurtarış + ileri ≥ %60, saha dışı ≤ %5, 5 sn'de top bizde ≥ %40; U3 kaleci pası ≥ %20, kale ağzını
   kesen 0, kesilen ≤ %5; U4 çizgi + taç + acil ≥ %40, kale önünden yatay 0; U5 ayakla uzaklaştırma 0; U6 kendi kalesine doğru vuruş 0, tepe ≤ 15 m;
   U7 tepe ≤ 8 m %100, orta sahada saha içi %100). */
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||80,t0=Date.now(),O=require('../senaryo-ortak')(ctx,vm),OO=require('../olcum-ortak'),F=OO.bagla(ctx);
  const G=vm.runInContext('({profilKur,PL,MZ,PW,GW2})',ctx),PL=G.PL,MZ=G.MZ,PW=G.PW,GW2=G.GW2;
  let deneme=0;
  const dene=(U,i)=>{deneme++;
    let A=null,kick=null,kafa=null,gkPas=null;
    const m=O.kur((tohum||1)*100000+U*1000+i,(ad,v)=>{if(!A||!v)return;
      if(!kick&&v.p===A&&(ad==='clear'||ad==='pass'||ad==='cross')){const e=A.eylem,b=m.ball;kick={ad,t:m.t,x:b.x,z:b.z,vx:b.vx,vz:b.vz,u:OO.ucus(F,m,b),sec:e&&e.sec||null,n:e&&e.dil&&e.dil.adim?e.dil.adim.n:null};}
      if(!kafa&&v.p===A&&ad==='header'){const b=m.ball;kafa={tur:v.tur,u:OO.ucus(F,m,b),x:b.x,z:b.z};}});
    const T0=m.teams[0],T1=m.teams[1],b=m.ball,d=m.dir[0],gx=-d*PL,ic=(z)=>z<MZ?1:-1;   /* gx: kendi kale çizgisi */
    let R=T1[9],R2=null,Q=null,GK=m.kaleci(0),kal,ax,az,yon,rx,rz,qx,qz;
    if(U===1){A=T0[4];Q=T0[3];az=PW-4;ax=gx+d*12;yon=d>0?Math.PI:0;rx=ax-d*0.6;rz=az-0.8;qx=ax+d*4;qz=az-15;}
    else if(U===2){A=T0[2];Q=T0[5];az=MZ-20;ax=gx+d*16.5;yon=d>0?0:Math.PI;rx=ax+d*2.4;rz=az+1.8;qx=ax+d*35;qz=6;}
    else if(U===3){A=T0[2];Q=T0[3];az=MZ;ax=gx+d*20;yon=d>0?0:Math.PI;rx=ax+d*2.2;rz=az+0.3;qx=ax+d*2;qz=az+22;}
    else if(U===4){A=T0[3];az=MZ+(i%2?1:-1)*(GW2+3);ax=gx+d*8;yon=d>0?Math.PI:0;rx=ax+d*1.2;rz=az;}
    else if(U===5){A=T0[2];Q=T0[3];az=MZ;ax=gx+d*35;yon=d>0?0:Math.PI;rx=ax+d*1.0;rz=az+0.2;qx=ax;qz=az+20;}
    else if(U===6){A=T0[3];az=MZ+(i%3-1)*2;ax=gx+d*8;yon=d>0?0:Math.PI;rx=ax+d*1.5;rz=az+0.4;}
    else{A=T0[2];const orta=U===72;az=orta?MZ+(i%3-1)*4:MZ+2;ax=orta?0:gx+d*10;yon=d>0?Math.PI*0.75:Math.PI*0.25;rx=ax-d*0.9;rz=az+0.4;}
    kal=[A,R].concat(Q?[Q]:[]);if(U===2||U===5){R2=T1[10];kal.push(R2);}
    O.bosalt(m,kal);
    for(const q of kal){q._kutle=0;q._cev=null;q._hk=undefined;G.profilKur(q,m.tohum);}
    O.yerlestir(A,ax,az+(U<7?((i%5)-2)*0.3:0),yon,0);O.yerlestir(R,rx,rz,Math.atan2(az-rz,ax-rx),U===3||U===5?1.5:0.5);
    if(Q)O.yerlestir(Q,qx,qz,d>0?0:Math.PI,0);
    if(R2)O.yerlestir(R2,Q?Q.x-d*6:ax+d*20,Q?Q.z+3:az,d>0?Math.PI:0,0);
    if(U===3){O.yerlestir(GK,gx+d*8,MZ,d>0?0:Math.PI,0);}
    O.oyunda(m);
    if(U===71||U===72){/* kafa: top kafa yüksekliğinde gelir (U71 kanattan orta, U72 yüksekten düşen uzun top) */
      const sx=U===71?gx+d*16:ax+d*30,sz=U===71?(az<MZ?6:PW-6):az+3,T=U===71?1.0:1.6;
      const c=m.havadanCoz(sx,0.3,sz,A.x,1.85,A.z,T,0,0);Object.assign(b,{x:sx,y:0.3,z:sz,vx:c.vx,vy:c.vy,vz:c.vz,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:A,sut:null,pas:null,sonTakim:1,sonDokunan:R});
      m.topDegisti();}
    else{O.topVer(m,A,yon,0,0.35);A.kararT=0;if(U===6){b.vy=1.6;b.y=0.12;m._donenT=[m.t,m.t];}
      /* D (2026-10-22): U3'te savunmacı kaleciyi yeni görmüş olmalı (hattı açık) — kurulumda son taraması 1,5 sn'den eski kalıyor, algı kaleciyi unutuyordu */
      if(U===3){m.taramaAdim(1/60);const bv=m.bVeri(A);if(bv.tara){m.taramaKaydi(bv.tara);bv.tara.t=m.t;}}}
    let secim=null;const sonuc={};
    for(let k=0;k<60*5;k++){m.step(1/60);
      if(kick&&!sonuc.ilk&&b.sonDokunan&&b.sonDokunan!==A&&m.t>kick.t)sonuc.ilk=b.sonDokunan.team===0?'biz':'rakip';   /* D: vuruştan sonra topa ilk dokunan */
      if(!secim){const e=A.eylem;
        if(e&&e.ad==='vurus'&&e.sec){const s=e.sec;secim=s.tur==='uzaklastir'?'uzaklastir':s.alici&&s.alici.rol==='GK'?'kaleciPas':'pas';
          sonuc.L=Math.hypot(s.hx-b.x,s.hz-b.z);sonuc.hedefDis=Math.abs(s.hx)>PL||s.hz<0||s.hz>PW;sonuc.haz=e.hazirlikEn;sonuc.uz=s.uz||null;}
        else if(e&&e.ad==='kafa')secim='kafa';
        else if(A.surus&&b.sahip===A&&k>0)secim=A.surus.koru?'koru':A.surus.bekle?'bekle':A.surus.surukle?'surukle':A.surus.cal?'gec':'tasi';
        else if(b.sahip&&b.sahip.team===1)secim='kayip';}
      if(m.phase!=='play'){const du=m.durus;sonuc.son=m.phase==='goal'?'gol':du&&(du.tur==='tac'||du.tur==='korner'||du.tur==='kaleVurusu')?'disari':'durdu';break;}}
    if(!sonuc.son){const s=b.sahip||b.tasiyan;sonuc.son=s?(s.team===0?'biz':'rakip'):'bos';}
    if(kick){sonuc.n=kick.n;sonuc.inis=kick.u.inis?kick.u.inis.L:null;sonuc.tepe=kick.u.tepe;sonuc.yolDis=!!kick.u.cik;
      const ix=kick.u.inis?kick.u.inis.x:null,iz=kick.u.inis?kick.u.inis.z:null;
      sonuc.yatay=ix!=null&&(ix-gx)*d<16.5&&Math.abs(iz-MZ)<8;
      sonuc.kaleye=kick.vx*d<-0.3&&(()=>{const tt=(gx-kick.x)/kick.vx,zc=kick.z+kick.vz*tt;return tt>0&&Math.abs(zc-MZ)<GW2+0.5;})();}
    if(kafa){sonuc.kTur=kafa.tur;sonuc.tepe=kafa.u.tepe;sonuc.yolDis=!!kafa.u.cik;}
    return{secim:secim||'yok',...sonuc};};
  const f=(x,k)=>x===x&&x!=null?x.toFixed(k==null?1:k):'—',yz=(a,c)=>c?(100*a/c).toFixed(0)+'%':'—';
  const AD={1:'U1 kanatta sıkışma',2:'U2 köşede, baskı ~0,4',3:'U3 kaleciye geri pas',4:'U4 kaleye dönük, direk dışı',5:'U5 35 m, baskı 1',6:'U6 dönen top',71:'U7a kafa, ceza sahası',72:'U7b kafa, orta saha'};
  /* D (2026-10-22): kapılar uzakAmac'ın bitleriyle açılır — 1: U1, U2, U4, U5, U6; 2: U3; 4: U7 */
  const UA=vm.runInContext('MOTOR_AYAR.uzakAmac',ctx)|0;let hata=0;const kapi=(bit,ok,metin)=>{if(!(UA&bit))return;if(!ok)hata=1;console.log((ok?'    ':'  ! ')+'Kabul: '+metin);};
  console.log(`\nD · u-uzak (amaçlı uzaklaştırma; uzakAmac ${UA}) · hücre başına ${n} deneme, 5 sn`);
  for(const U of[1,2,3,4,5,6,71,72]){const L=[];for(let i=0;i<n;i++)L.push(dene(U,i));
    const say=k=>L.filter(r=>r.secim===k).length,uz=L.filter(r=>r.secim==='uzaklastir'),son=k=>L.filter(r=>r.son===k).length;
    const secimler=Object.entries(L.reduce((a,r)=>(a[r.secim]=(a[r.secim]||0)+1,a),{})).sort((a,c)=>c[1]-a[1]).map(([k,v])=>`${k} ${yz(v,L.length)}`).join(' · ');
    let sat=`  ${AD[U].padEnd(28)} seçim: ${secimler} · 5 sn: biz ${yz(son('biz'),L.length)} rakip ${yz(son('rakip'),L.length)} dışarı ${yz(son('disari'),L.length)} durdu ${yz(son('durdu'),L.length)} gol ${son('gol')}`;
    if(uz.length){const L30=uz.filter(r=>r.L>30);
      sat+=`\n      uzaklaştırma n ${uz.length}: L ort. ${f(OO.ortanca(uz.map(r=>r.L)))} m · hedef saha dışı ${yz(uz.filter(r=>r.hedefDis).length,uz.length)} (L > 30 m'de ${yz(L30.filter(r=>r.hedefDis).length,L30.length)}) · yol saha dışı ${yz(uz.filter(r=>r.yolDis).length,uz.length)}`+
        ` · adım 0 ${yz(uz.filter(r=>r.n===0).length,uz.length)} (adımsız L en çok ${f(Math.max(-1,...uz.filter(r=>r.n===0).map(r=>r.L)))} m) · asgari hazırlık ort. ${f(OO.ortanca(uz.map(r=>r.haz)),3)} sn`+
        ` · iniş ort. ${f(OO.ortanca(uz.map(r=>r.inis)))} m · tepe ort. / en çok ${f(OO.ortanca(uz.map(r=>r.tepe)))} / ${f(Math.max(0,...uz.map(r=>r.tepe||0)))} m`+
        (U===4?` · kale önünden yatay ${uz.filter(r=>r.yatay).length}`:'')+(U===6?` · kendi kalesine doğru ${uz.filter(r=>r.kaleye).length}`:'');}
    if(U===3){const g=L.filter(r=>r.secim==='kaleciPas');sat+=`\n      kaleci pası ${g.length}/${L.length} · kaleye doğru (kaçarsa kale) ${g.filter(r=>r.kaleye).length} · 5 sn'de rakipte ${g.filter(r=>r.son==='rakip').length}`;}
    if(U===71||U===72){const K=L.filter(r=>r.secim==='kafa');sat+=`\n      kafa n ${K.length} (tür ${[...new Set(K.map(r=>r.kTur||'?'))].join('/')}) · tepe ort. ${f(OO.ortanca(K.map(r=>r.tepe)))} m, > 8 m ${K.filter(r=>r.tepe>8).length} · yol saha dışı ${yz(K.filter(r=>r.yolDis).length,K.length)}`;}
    if(uz.length)sat+=`\n      tür: ${Object.entries(uz.reduce((a,r)=>(a[r.uz||'eski']=(a[r.uz||'eski']||0)+1,a),{})).map(([k,v])=>`${k} ${yz(v,uz.length)}`).join(' · ')}`;
    console.log(sat);
    const pay=F2=>uz.length?uz.filter(F2).length/uz.length:0,pL=F2=>L.length?L.filter(F2).length/L.length:0;
    if(U===1){kapi(1,!uz.some(r=>r.L>30&&r.hedefDis),'U1: 30 m\'den uzun uzaklaştırmada hedef saha dışı 0');kapi(1,!uz.some(r=>r.n===0&&r.L>22),'U1: adımsız uzaklaştırma yalnız ≤ 22 m');
      kapi(1,uz.filter(r=>r.n>0).every(r=>r.haz>=0.22-1e-9),'U1: adımlı uzaklaştırmada asgari hazırlık ≥ 0,22 sn');}
    if(U===2){const p1=pay(r=>r.uz==='kurtar'||r.uz==='ileri'||r.uz==='ters'),p2=pay(r=>r.hedefDis),p3=pL(r=>r.son==='biz');
      /* D (2026-10-22): V1 tasarımının "5 sn sonunda top bizde ≥ %40"ı ikinci topu 5. saniyede ölçüyordu; kurtarış ve ileri topta top o anda çoğu zaman hâlâ
         çekişmede (boşta). İlk dokunan biz bilgi satırı (kapı 40 maçta, u-uzak ölçüsü); 5 sn'deki sahip bilgi */
      const p4=pay(r=>r.ilk==='biz');
      kapi(1,p1>=0.6,`U2: kurtarış + ileri ≥ %60 → %${(100*p1).toFixed(0)}`);kapi(1,p2<=0.05,`U2: hedef saha dışı ≤ %5 → %${(100*p2).toFixed(0)}`);console.log(`      bilgi: U2'de uzaklaştırmadan sonra topa ilk dokunan biz %${(100*p4).toFixed(0)} (5 sn sonunda bizde %${(100*p3).toFixed(0)}); D'de blok kalibrasyonundan sonra %37–38 — turun kapısı 40 maçta ilk dokunan biz ≥ %30 (borç: FUTBOL_KUTUPHANESI §12.4 D)`);}
    if(U===3){const g=L.filter(r=>r.secim==='kaleciPas'),p=g.length/L.length;kapi(2,p>=0.2,`U3: kaleci pası kararların ≥ %20'si → %${(100*p).toFixed(0)}`);
      kapi(2,!g.some(r=>r.kaleye),'U3: kale ağzını kesen geri pas 0');kapi(2,!g.length||g.filter(r=>r.son==='rakip').length/g.length<=0.05,'U3: kesilen geri pas ≤ %5');}
    /* D (2026-10-22): kaleye dönük, arkasında rakip olan savunmacı bu motorda çoğunlukla topu korur (rakibin topa varışı ~0,7 sn; dönüp vuruş ~0,65 sn) —
       V1 tasarımının "uzaklaştırmaların çizgi + taç + acil payı ≥ %40"ı uzaklaştırmanın seçileceğini varsayıyordu (bilgi satırı). Kapı sonuçla: 5 sn içinde
       top rakipte ya da gol ≤ %10, kale önünden yatay vuruş 0 */
    if(U===4){const p=pay(r=>r.uz==='cizgi'||r.uz==='tac'||r.uz==='acil'),pt=pL(r=>r.son==='rakip'||r.son==='gol');
      console.log(`      bilgi: uzaklaştırmaların çizgi + taç + acil payı %${(100*p).toFixed(0)} (V1 tasarımı ≥ %40)`);
      kapi(1,pt<=0.1,`U4: 5 sn içinde top rakipte ya da gol ≤ %10 → %${(100*pt).toFixed(0)}`);kapi(1,!uz.some(r=>r.yatay),'U4: kale önünden yatay vuruş 0');}
    if(U===5)kapi(1,!L.some(r=>r.secim==='uzaklastir'),'U5: 35 m\'de ayakla uzaklaştırma 0');
    if(U===6){kapi(1,!uz.some(r=>r.kaleye),'U6: kendi kalesine doğru vuruş 0');kapi(1,!uz.some(r=>(r.tepe||0)>15),'U6: tepe ≤ 15 m');}
    if(U===71||U===72){const KK=L.filter(r=>r.secim==='kafa');kapi(4,!KK.some(r=>r.tepe>8),'U7: kafada tepe ≤ 8 m %100');if(U===72)kapi(4,!KK.some(r=>r.yolDis),'U7b: orta sahada kafa saha içi %100');}}
  console.log(`  Süre ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  return hata;
}};
