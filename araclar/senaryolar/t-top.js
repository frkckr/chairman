/* ============ Gerçekçilik planı T0/T9a senaryosu: top fiziği (topFizikAdim, js/mac-motoru.js) ============
   Yalnız topun kendi fiziği; oyuncu ve rastlantı yok. 1) Falsolu vuruş: top kaleye doğru düz yönde (havadan, 25 m'de ~1,5 m yükseklik) ve yan
   dönüşle (egri; sutVur'da falso 0,08 + 0,05·şut) vurulur; 25 m ilerideki yan sapma. 2) Sekme: 2 m'den bırakılan topun ilk sekmedeki en yüksek
   noktası (ayrıca 1 ve 3 m, 10 m/sn yatay hızla); 10 m/sn'lik düşen topun sekmede kaybettiği yatay hız. 3) Yerden pas: 15 m/sn ile vurulan topun
   kayma yolu, durma mesafesi ve süresi zemine göre (Match.R = zeminYuvarlanma(zemin)); planlayıcının yerSure/yerIlkHiz'ı fizikle karşılaştırılır.
   4) Sürükleme: 30 ve 8 m/sn'de hava direnci katsayısı (hızlı topta düşük). 5) Koşul kapısı: ıslak zeminde kayma uzar ve sekme düşer; rüzgâra karşı
   uçuş kısalır.
   Kabul (T9a): 25 m falsoda 2–4 m yan sapma; 2 m'den sekme 0,6–0,8 m; durma mesafesi zemin kötüleştikçe azalır ve zemin 0,7'de 30–60 m;
   planlayıcı ile fizik arasındaki varış süresi farkı ≤ %5. Kabul dışıysa çıkış kodu 1. Kullanım: node araclar/mac-deneme.js --senaryo t-top
   V1-0b (2026-10-20; FUTBOL_KUTUPHANESI §12.14, V1c): TOP_FIZIK değişmez; V1c'nin yeni pas yollarının bugünkü fizikle geçerliliği. 6) Yerden eğri bandı:
   aileye bağlı eğri tablosu (MOTOR_AYAR.pasEgri, V1c-2; bildirilmeden önce planın değerleri) × pasFalso ile zemin 0,7'de 20 m'deki telafisiz yanal
   sapma (Match.yerEgriSapma'nın yolu: yerde topun kopyası). 7) Sert pasta hafif havalanma (V1c-3): y 0,02 m, vy ile L 15/25 m'ye varış süresi
   planlayıcının yerSure'siyle (vy 0 varsayımı) ve tepe; sekmesiz tavan (inişte dik hız ≤ 1,3 m/sn: topFizikAdim'ın sekme eşiği) fizikten bulunur.
   8) Alçak havadan kısa pas (V1c-4): uçuş süresi √(8·clamp(0,6 + 0,05·L, 0,8, 1,4)/G) (alcakPas; bildirilmeden önce planın değerleri), havadanCoz
   ile 0,11 m'den yere, kesik −0,03: tepe, 2 m'deki yükseklik, iniş hızı (ilk sekmeden sonraki yatay hız — alıcının kontrol ettiği; tasarımın
   5,7–9,8 m/sn'si; çarpmadaki 3B hız bilgi).
   Kabul (V1-0b; V1c'nin kapıları): plasede 20 m'de 0,3–0,8 m (v0 13–19, eğri bandın iki ucu); itmede v0 10'da ≤ 0,2 m; sekmesiz bölgede
   (vy ≤ min(pasKalkis tavanı, sekmesiz tavan)) süre farkı ≤ %5 ve tepe ≤ 0,1 m; alçak havadan L 8–16'da tepe 0,8–1,4 m, 2 m'de ≥ 0,5 m,
   inişte ≤ 12 m/sn. V1-0b bulgusu: planın tavanı 1,25 m/sn, y 0,02 m'den sekme eşiğinin üstünde (sekmesiz tavan ~1,14): 1,25'te top seker,
   süre farkı %6–11 — V1c-3 tavanı ≤ 1,1'e indirir ya da topu y 0'dan çıkarır (satır "NOT"). */
'use strict';
module.exports={calistir({ctx,vm}){
  const F=vm.runInContext('({topFizikAdim,G,lerp,zeminYuvarlanma,topSurukleme,yerSure,yerIlkHiz,yerHiz})',ctx),dt=1/60,yeni=o=>Object.assign({x:0,y:0,z:0,vx:0,vy:0,vz:0,egri:0,ust:0},o);
  let hata=0;const kabul=(ok,m)=>{if(!ok)hata++;console.log((ok?'  ':'! ')+m);};
  /* 1) falso: x ileri; 25 m'yi geçerken z (yan sapma) ve uçuş süresi */
  console.log('\nT9a · top fiziği · 1) falsolu vuruş: 25 m ilerideki yan sapma (m) [uçuş süresi sn]\n');
  const HZ=[20,25,28],EG=[0,0.08,0.105,0.13];
  console.log('  Hız (m/sn)'+EG.map(e=>('egri '+String(e).replace('.',',')).padStart(16)).join(''));
  let tipik=NaN;
  for(const v of HZ){let s='  '+String(v).padEnd(10);
    for(const e of EG){const T=25/v,b=yeni({y:0.11,vx:v,vy:(1.5-0.11+0.5*F.G*T*T)/T,egri:e});let t=0;
      for(let i=0;i<600&&b.x<25;i++){F.topFizikAdim(b,dt,true);t+=dt;}
      s+=(Math.abs(b.z).toFixed(2)+' ['+t.toFixed(2)+']').padStart(16);if(v===25&&e===0.105)tipik=Math.abs(b.z);}
    console.log(s);}
  kabul(tipik>=2&&tipik<=4,`Kabul (T9a): 25 m'den falsoda (25 m/sn, egri 0,105 = şut 0,5) 2–4 m yan sapma → ${tipik.toFixed(2)} m`);
  /* 2) sekme: ilk yere çarpmadan sonraki en yüksek nokta; yatay hız kaybı */
  console.log('\n  2) sekme: bırakılan topun ilk sekmedeki en yüksek noktası (m)');
  let iki=NaN;
  for(const [h,vx] of[[1,0],[2,0],[3,0],[2,10]]){const b=yeni({y:h,vx});let sekti=false,en=0,vh=NaN;
    for(let i=0;i<600;i++){const vy0=b.vy;F.topFizikAdim(b,dt,false,F.zeminYuvarlanma(0.7));if(!sekti&&vy0<0&&b.vy>0){sekti=true;vh=Math.hypot(b.vx,b.vz);}if(sekti){if(b.y>en)en=b.y;if(b.vy<=0&&b.y<en)break;}}
    if(h===2&&!vx)iki=en;console.log('  '+(h+' m'+(vx?', yatay '+vx+' m/sn':'')).padEnd(28)+en.toFixed(2).padStart(6)+'  (oran '+(en/h).toFixed(2)+(vx?', yatay hız '+vx+' → '+vh.toFixed(1)+' m/sn':'')+')');}
  kabul(iki>=0.6&&iki<=0.8,`Kabul (T9a): 2 m'den bırakılan topun iyi zeminde sekmesi 0,6–0,8 m → ${iki.toFixed(2)} m`);
  /* 3) yerden pas: 15 m/sn, zemine göre kayma yolu, durma mesafesi ve süresi; planlayıcı ile fizik */
  console.log('\n  3) yerden pas 15 m/sn: kayma yolu, durma mesafesi ve süresi zemine göre');
  const durma=[];
  for(const z of[0,0.35,0.7,1]){const R=F.zeminYuvarlanma(z),b=yeni({vx:15});let t=0,kayma=NaN;
    for(let i=0;i<60*60&&Math.hypot(b.vx,b.vz)>0.01;i++){F.topFizikAdim(b,dt,false,R);t+=dt;if(Number.isNaN(kayma)&&Math.abs(Math.hypot(b.vx,b.vz)-b.sw)<=0.05)kayma=b.x;}
    durma.push(b.x);console.log('  zemin '+z.toFixed(2)+' (R '+R.toFixed(2)+' m/sn²)'.padEnd(16)+'kayma '+kayma.toFixed(1).padStart(5)+' m'+(b.x.toFixed(1)+' m').padStart(10)+(t.toFixed(1)+' sn').padStart(9));}
  kabul(durma[0]<durma[1]&&durma[1]<durma[2]&&durma[2]<durma[3]&&durma[2]>=30&&durma[2]<=60,`Kabul (T9a): durma mesafesi zemin kötüleştikçe azalır, zemin 0,7'de 30–60 m → ${durma.map(x=>x.toFixed(0)).join(' / ')} m`);
  /* planlayıcı: L metreye varis hızıyla ulaşmak için ilk hız (yerIlkHiz) ve süre (yerSure); fizikle aynı mı */
  let enFark=0;const R7=F.zeminYuvarlanma(0.7);
  for(const [L,varis] of[[8,8],[15,9],[25,11],[35,12]]){const v0=F.yerIlkHiz(L,varis,R7),tp=F.yerSure(v0,L,R7),b=yeni({vx:v0});let t=0;
    while(b.x<L&&t<10){F.topFizikAdim(b,dt,false,R7);t+=dt;}
    const vf=Math.hypot(b.vx,b.vz),fark=Math.abs(t-tp)/tp;if(fark>enFark)enFark=fark;
    console.log('  planlayıcı L '+String(L).padStart(2)+' m, varış '+varis+' m/sn: ilk hız '+v0.toFixed(1)+' · süre plan '+tp.toFixed(2)+' / fizik '+t.toFixed(2)+' sn · varış hızı fizik '+vf.toFixed(1)+' m/sn');}
  kabul(enFark<=0.05,`Kabul (T9a): planlayıcının varış süresi fizikten en çok %5 sapar → en çok %${(100*enFark).toFixed(1)}`);
  /* 4) sürükleme katsayısı */
  console.log('\n  4) hava direnci katsayısı k(v) (1/m): '+[8,12,14,16,20,30].map(v=>v+' m/sn '+F.topSurukleme(v).toFixed(4)).join(' · '));
  /* 5) koşul kapısı: ıslak zeminde kayma ve düşük sekme; rüzgâra karşı uçuş */
  const kuru=yeni({vx:15}),islak=yeni({vx:15});let kk=NaN,ki=NaN;
  for(let i=0;i<600;i++){F.topFizikAdim(kuru,dt,false,R7);F.topFizikAdim(islak,dt,false,R7,{islak:1,ruzgar:null});
    if(Number.isNaN(kk)&&Math.abs(Math.hypot(kuru.vx,kuru.vz)-kuru.sw)<=0.05)kk=kuru.x;if(Number.isNaN(ki)&&Math.abs(Math.hypot(islak.vx,islak.vz)-islak.sw)<=0.05)ki=islak.x;}
  const sek=(K)=>{const b=yeni({y:2});let sekti=false,en=0;for(let i=0;i<600;i++){const vy0=b.vy;F.topFizikAdim(b,dt,false,R7,K);if(!sekti&&vy0<0&&b.vy>0)sekti=true;if(sekti){if(b.y>en)en=b.y;if(b.vy<=0&&b.y<en)break;}}return en;};
  const uc=(K)=>{const b=yeni({y:0.11,vx:20,vy:10});let t=0;while(t<6&&(b.y>0.001||b.vy>0.001)){F.topFizikAdim(b,dt,false,R7,K);t+=dt;}return b.x;};
  console.log('  5) koşullar: ıslakta kayma yolu '+kk.toFixed(1)+' → '+ki.toFixed(1)+' m, 2 m sekme '+sek(null).toFixed(2)+' → '+sek({islak:1}).toFixed(2)+' m; 20 m/sn uçuşta 8 m/sn karşı rüzgârla menzil '+uc(null).toFixed(1)+' → '+uc({islak:0,ruzgar:{x:-8,z:0}}).toFixed(1)+' m');
  /* ---- V1-0b: 6) yerden eğri bandı ---- */
  const A=vm.runInContext('MOTOR_AYAR',ctx),PF=A.pasFalso!=null?A.pasFalso:1,R7b=F.zeminYuvarlanma(0.7);
  const PE=A.pasEgri||[[0.004,0.010],[0.02,0.02],[0.035,0.03],[0.004,0.008],[0.05,0.04]],PEAD=['itme / bırakma','sert iç','plase','sürülmüş','dış ayak'];
  const egri20=(v0,eg)=>{const b=yeni({vx:v0,egri:eg});for(let i=0;i<240;i++){F.topFizikAdim(b,dt,false,R7b);if(b.x>=20||Math.hypot(b.vx,b.vz)<0.3)break;}return Math.abs(b.z);};
  console.log(`\n  6) V1c: yerden eğri — 20 m'de telafisiz yanal sapma (m), zemin 0,7; eğri = pasFalso (${PF}) × [taban, taban + aralık]${A.pasEgri?'':' (pasEgri henüz bildirilmedi: planın değerleri)'}`);
  for(let k=0;k<PE.length;k++){const [a0,a1]=PE[k];console.log('  '+PEAD[k].padEnd(16)+[10,13,16,19,22].map(v=>`v0 ${v}: ${egri20(v,PF*a0).toFixed(2)}–${egri20(v,PF*(a0+a1)).toFixed(2)}`).join('  '));}
  {const P=PE[2],L=[];for(const v of[13,16,19])for(const e of[P[0],P[0]+P[1]])L.push(egri20(v,PF*e));const mn=Math.min(...L),mx=Math.max(...L);
    kabul(mn>=0.3&&mx<=0.8,`Kabul (V1c-2): plasede 20 m'de 0,3–0,8 m (v0 13–19, bandın iki ucu) → ${mn.toFixed(2)}–${mx.toFixed(2)} m`);
    const it=egri20(10,PF*(PE[0][0]+PE[0][1]));kabul(it<=0.2,`Kabul (V1c-2): itmede v0 10'da (bandın üst ucu) ≤ 0,2 m → ${it.toFixed(2)} m`);}
  /* ---- 7) sert pasta hafif havalanma ---- */
  const PK=A.pasKalkis||[0.5,0.5,0.4,0.8,0.45,1.25],sekti=(v0,vy)=>{const b=yeni({y:0.02,vx:v0,vy});let s0=false;for(let i=0;i<120;i++){const v1=b.vy;F.topFizikAdim(b,dt,false,R7b);if(v1<0&&b.vy>0){s0=true;break;}if(b.y<=0&&b.vy===0)break;}return s0;};
  let vyS=0;for(let vy=0.5;vy<=1.6001;vy+=0.01)if(!sekti(18,vy))vyS=vy;else break;
  const tavan=Math.min(PK[5],vyS),VY=[0,0.5,0.8,Math.min(1.0,tavan),tavan].filter((x,i,a)=>a.indexOf(x)===i);
  console.log(`\n  7) V1c: sert pasta havalanma — planlayıcının süresi (vy 0) ↔ fizik ve tepe; y 0,02 m · sekmesiz tavan ${vyS.toFixed(2)} m/sn · planın tavanı ${PK[5]}${A.pasKalkis?'':' (pasKalkis henüz bildirilmedi)'} → denetlenen ≤ ${tavan.toFixed(2)}`);
  let enF=0,enT=0,enP=0;
  for(const L of[15,25])for(const v0 of[14,18,23]){let sat='  L '+String(L).padStart(2)+' m, v0 '+String(v0).padStart(2)+':';
    for(const vy of VY.concat(PK[5]>tavan?[PK[5]]:[])){const b=yeni({y:0.02,vx:v0,vy});let t=0,tepe=b.y;while(b.x<L&&t<10){F.topFizikAdim(b,dt,false,R7b);t+=dt;if(b.y>tepe)tepe=b.y;}
      const tp=F.yerSure(v0,L,R7b),fk=Math.abs(t-tp)/tp;if(vy<=tavan+1e-9){if(fk>enF)enF=fk;if(tepe>enT)enT=tepe;}else if(fk>enP)enP=fk;sat+=`  vy ${vy.toFixed(2)}: ${(100*fk).toFixed(1)}% tepe ${(100*tepe).toFixed(0)} cm`;}
    console.log(sat);}
  kabul(enF<=0.05&&enT<=0.1,`Kabul (V1c-3): sekmesiz bölgede (vy ≤ ${tavan.toFixed(2)}) plan↔fizik süre farkı ≤ %5 ve tepe ≤ 0,1 m → en çok %${(100*enF).toFixed(1)}, tepe ${(100*enT).toFixed(1)} cm`);
  if(PK[5]>tavan)console.log(`  NOT (V1-0b bulgusu, V1c-3'e): planın tavanı ${PK[5]} m/sn sekme eşiğinin üstünde — top seker, süre farkı en çok %${(100*enP).toFixed(1)}; tavan ≤ ${(Math.floor(vyS*20)/20).toFixed(2)} ya da top y 0'dan`);
  /* ---- 8) alçak havadan kısa pas ---- */
  const AP=A.alcakPas||[6,16,3.5,0.6,0.05,0.8,1.4],coz=vm.runInContext('Match.prototype.havadanCoz',ctx),K={kosullar:undefined};
  console.log(`\n  8) V1c: alçak havadan kısa pas — tepe, 2 m'deki yükseklik, iniş hızı (0,11 m'den yere, kesik −0,03)${A.alcakPas?'':' (alcakPas henüz bildirilmedi: planın değerleri)'}`);
  let ok8=true;
  for(const L of[8,10,12,14,16]){const h=Math.min(AP[6],Math.max(AP[5],AP[3]+AP[4]*L)),T=Math.sqrt(8*h/F.G),c=coz.call(K,0,0.11,0,L,0,0,T,0,-0.03);
    const b=yeni({y:0.11,vx:c.vx,vy:c.vy,vz:c.vz,ust:-0.03});let tepe=b.y,y2=NaN,vin=NaN,v3=NaN,ix=NaN,t=0;
    for(let i=0;i<600;i++){const px=b.x,py=b.y,pv=Math.hypot(b.vx,b.vy,b.vz),pvy=b.vy;F.topFizikAdim(b,dt,false,R7b);t+=dt;if(b.y>tepe)tepe=b.y;
      if(y2!==y2&&px<2&&b.x>=2)y2=py+(b.y-py)*(2-px)/((b.x-px)||1);
      if(pvy<0&&b.vy>=0&&b.y<=0.001+1e-9){vin=Math.hypot(b.vx,b.vz);v3=pv;ix=b.x;break;}}
    const ok=tepe>=0.8&&tepe<=1.4&&y2>=0.5&&vin<=12;if(!ok)ok8=false;
    console.log(`  L ${String(L).padStart(2)} m: uçuş ${T.toFixed(2)} sn (plan tepe ${h.toFixed(2)} m) · tepe ${tepe.toFixed(2)} m · 2 m'de ${y2.toFixed(2)} m · inişte (sekmeden sonra yatay) ${vin.toFixed(1)} m/sn (çarpmada 3B ${v3.toFixed(1)}) · iniş ${ix.toFixed(1)} m`);}
  kabul(ok8,'Kabul (V1c-4): L 8–16 m alçak havadan pasta tepe 0,8–1,4 m, 2 m\'de ≥ 0,5 m, inişte ≤ 12 m/sn');
  return hata?1:0;
}};
