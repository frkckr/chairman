/* ============ Gerçekçilik planı T0/T9a senaryosu: top fiziği (topFizikAdim, js/mac-motoru.js) ============
   Yalnız topun kendi fiziği; oyuncu ve rastlantı yok. 1) Falsolu vuruş: top kaleye doğru düz yönde (havadan, 25 m'de ~1,5 m yükseklik) ve yan
   dönüşle (egri; sutVur'da falso 0,08 + 0,05·şut) vurulur; 25 m ilerideki yan sapma. 2) Sekme: 2 m'den bırakılan topun ilk sekmedeki en yüksek
   noktası (ayrıca 1 ve 3 m, 10 m/sn yatay hızla); 10 m/sn'lik düşen topun sekmede kaybettiği yatay hız. 3) Yerden pas: 15 m/sn ile vurulan topun
   kayma yolu, durma mesafesi ve süresi zemine göre (Match.R = zeminYuvarlanma(zemin)); planlayıcının yerSure/yerIlkHiz'ı fizikle karşılaştırılır.
   4) Sürükleme: 30 ve 8 m/sn'de hava direnci katsayısı (hızlı topta düşük). 5) Koşul kapısı: ıslak zeminde kayma uzar ve sekme düşer; rüzgâra karşı
   uçuş kısalır.
   Kabul (T9a): 25 m falsoda 2–4 m yan sapma; 2 m'den sekme 0,6–0,8 m; durma mesafesi zemin kötüleştikçe azalır ve zemin 0,7'de 30–60 m;
   planlayıcı ile fizik arasındaki varış süresi farkı ≤ %5. Kabul dışıysa çıkış kodu 1. Kullanım: node araclar/mac-deneme.js --senaryo t-top */
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
  return hata?1:0;
}};
