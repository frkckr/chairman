/* ============ Gerçekçilik planı T0 senaryosu: top fiziği (topFizikAdim, js/mac-motoru.js) ============
   Yalnız topun kendi fiziği; oyuncu ve rastlantı yok. 1) Falsolu vuruş: top kaleye doğru düz yönde (havadan, 25 m'de ~1,5 m yükseklik) ve yan
   dönüşle (egri; sutVur'da falso 0,08 + 0,05·şut) vurulur; 25 m ilerideki yan sapma. 2) Sekme: 2 m'den bırakılan topun ilk sekmedeki en yüksek
   noktası (ayrıca 1 ve 3 m, 10 m/sn yatay hızla). 3) Yerden pas: 15 m/sn ile vurulan topun durma mesafesi ve süresi zemine göre (Match.R =
   lerp(2,1; 1,2; zemin)). Kabul (T9, bilgi): 25 m falsoda 2–4 m yan sapma; 2 m'den sekme 0,6–0,8 m; durma mesafesi zemine göre (gerçek
   yuvarlanma yavaşlaması 0,45–1,5 m/sn² — kaynak doğrulanmalı — hava direnci hariç 75–250 m). Kullanım: node araclar/mac-deneme.js --senaryo t-top */
'use strict';
module.exports={calistir({ctx,vm}){
  const F=vm.runInContext('({topFizikAdim,G,lerp})',ctx),dt=1/60,yeni=o=>Object.assign({x:0,y:0,z:0,vx:0,vy:0,vz:0,egri:0,ust:0},o);
  /* 1) falso: x ileri; 25 m'yi geçerken z (yan sapma) ve uçuş süresi */
  console.log('\nT0 · top fiziği · 1) falsolu vuruş: 25 m ilerideki yan sapma (m) [uçuş süresi sn]\n');
  const HZ=[20,25,28],EG=[0,0.08,0.105,0.13];
  console.log('  Hız (m/sn)'+EG.map(e=>('egri '+String(e).replace('.',',')).padStart(16)).join(''));
  let tipik=NaN;
  for(const v of HZ){let s='  '+String(v).padEnd(10);
    for(const e of EG){const T=25/v,b=yeni({y:0.11,vx:v,vy:(1.5-0.11+0.5*F.G*T*T)/T,egri:e});let t=0;
      for(let i=0;i<600&&b.x<25;i++){F.topFizikAdim(b,dt,true);t+=dt;}
      s+=(Math.abs(b.z).toFixed(2)+' ['+t.toFixed(2)+']').padStart(16);if(v===25&&e===0.105)tipik=Math.abs(b.z);}
    console.log(s);}
  {const g=tipik>=2&&tipik<=4;console.log((g?'  ':'! ')+`Kabul (T9, bilgi): 25 m'den falsoda (25 m/sn, egri 0,105 = şut 0,5) 2–4 m yan sapma → ${tipik.toFixed(2)} m`);}
  /* 2) sekme: ilk yere çarpmadan sonraki en yüksek nokta */
  console.log('\n  2) sekme: bırakılan topun ilk sekmedeki en yüksek noktası (m)');
  let iki=NaN;
  for(const [h,vx] of[[1,0],[2,0],[3,0],[2,10]]){const b=yeni({y:h,vx});let sekti=false,en=0;
    for(let i=0;i<600;i++){const vy0=b.vy;F.topFizikAdim(b,dt,false,1.2);if(!sekti&&vy0<0&&b.vy>0)sekti=true;if(sekti){if(b.y>en)en=b.y;if(b.vy<=0&&b.y<en)break;}}
    if(h===2&&!vx)iki=en;console.log('  '+(h+' m'+(vx?', yatay '+vx+' m/sn':'')).padEnd(28)+en.toFixed(2).padStart(6)+'  (oran '+(en/h).toFixed(2)+')');}
  {const g=iki>=0.6&&iki<=0.8;console.log((g?'  ':'! ')+`Kabul (T9, bilgi): 2 m'den bırakılan topun iyi zeminde sekmesi 0,6–0,8 m → ${iki.toFixed(2)} m`);}
  /* 3) yerden pas: 15 m/sn, zemine göre durma mesafesi */
  console.log('\n  3) yerden pas 15 m/sn: durma mesafesi ve süresi zemine göre');
  for(const z of[0,0.35,0.7,1]){const R=F.lerp(2.1,1.2,z),b=yeni({vx:15});let t=0;
    for(let i=0;i<60*60&&Math.hypot(b.vx,b.vz)>0.01;i++){F.topFizikAdim(b,dt,false,R);t+=dt;}
    console.log('  zemin '+z.toFixed(2)+' (R '+R.toFixed(2)+' m/sn²)'.padEnd(16)+(b.x.toFixed(1)+' m').padStart(9)+(t.toFixed(1)+' sn').padStart(9));}
  console.log('  Bilgi (T9): gerçek yuvarlanma yavaşlaması 0,45–1,5 m/sn² (kaynak doğrulanmalı) → hava direnci hariç ~75–250 m; bugünkü R 1,2–2,1');
  return 0;
}};
