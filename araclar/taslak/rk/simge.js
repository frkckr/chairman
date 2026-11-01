/* RK3 taslağı (2026-11-01): 16×16 piksellik 1-bit simgeler — kodla çizilir (ilkel: dikdörtgen kenarı R, dolu F, daire kenarı C, çizgi L).
   Kare (Macintosh) ve Windows kılavuzu dersi: küme olarak tasarla, siyah-beyaz başla, fiil değil ad, simgenin yanında her zaman kelime.
   simgeSvg(ad, boy, renk) → <svg> (shape-rendering crispEdges; mürekkep rengi). Oyun koduna girmez; taslak sayfası kullanır. */
'use strict';
const SIMGE_TANIM={
  telefon:[['R',3,1,10,14],['R',5,3,6,8],['F',7,12,2,1]],
  defter:[['R',3,2,10,12],['F',2,4,2,1],['F',2,7,2,1],['F',2,10,2,1],['F',6,5,5,1],['F',6,8,5,1],['F',6,11,3,1]],
  dosya:[['R',2,5,12,9],['F',2,3,5,1],['F',2,4,1,1],['F',6,4,1,1],['F',7,5,1,1]],
  gazete:[['R',2,3,12,10],['F',4,5,8,2],['F',4,8,3,1],['F',4,10,3,1],['F',9,8,3,1],['F',9,10,3,1]],
  transfer:[['F',2,5,10,1],['L',9,2,12,5],['L',12,5,9,8],['F',4,10,10,1],['L',7,7,4,10],['L',4,10,7,13]],
  tv:[['R',2,3,12,9],['F',7,12,2,1],['F',5,13,6,1],['L',5,0,7,2],['L',11,0,9,2],['F',4,5,3,1],['F',4,7,6,1]],
  kasa:[['R',1,4,14,8],['C',8,8,2],['F',3,6,1,1],['F',12,9,1,1]],
  takvim:[['R',2,3,12,11],['F',2,3,12,3],['F',5,1,1,3],['F',10,1,1,3],['F',4,8,2,1],['F',7,8,2,1],['F',10,8,2,1],['F',4,11,2,1],['F',7,11,2,1]],
  mac:[['C',8,8,6],['F',7,6,2,3],['F',6,7,4,1],['L',8,2,8,5],['L',3,6,6,7],['L',13,6,10,7],['L',5,13,7,10],['L',11,13,9,10]],
  sakatlik:[['F',6,2,4,12],['F',2,6,12,4]],
  kart:[['F',4,2,8,12]],
  arama:[['C',6,6,4],['L',9,9,13,13],['L',10,9,14,13]],
  menajer:[['R',2,5,12,9],['F',6,2,4,1],['F',5,3,1,2],['F',10,3,1,2],['F',7,8,2,2],['F',2,9,12,1]],
  not:[['L',12,2,4,10],['L',13,3,5,11],['L',13,2,14,3],['F',3,11,2,2],['F',2,13,2,1]],
  saat:[['C',8,8,6],['F',8,4,1,5],['F',8,8,3,1]],
  uyari:[['L',8,1,1,14],['L',8,1,15,14],['F',1,14,15,1],['F',8,5,1,5],['F',8,11,1,2]],
  onay:[['L',2,8,6,12],['L',6,12,14,4],['L',2,9,6,13],['L',6,13,14,5]],
  takim:[['R',3,2,4,4],['R',10,2,4,4],['R',2,7,6,7],['R',9,7,6,7]],
  gozlem:[['C',4,10,3],['C',12,10,3],['F',6,6,4,2],['F',3,5,3,2],['F',10,5,3,2]],
  mesaj:[['R',1,3,14,10],['L',1,3,8,9],['L',15,3,8,9]],
  ilerle:[['F',3,3,2,10],['L',7,3,12,8],['L',12,8,7,13],['L',7,3,7,13]],
  kapat:[['L',3,3,12,12],['L',12,3,3,12],['L',4,3,13,12],['L',13,3,4,12]]};
function simgeIzgara(ad){
  const G=Array.from({length:16},()=>new Array(16).fill(0)),nok=(x,y)=>{if(x>=0&&x<16&&y>=0&&y<16)G[y][x]=1;};
  for(const [t,a,b,c,d] of SIMGE_TANIM[ad]||[]){
    if(t==='F')for(let y=b;y<b+d;y++)for(let x=a;x<a+c;x++)nok(x,y);
    else if(t==='R'){for(let x=a;x<a+c;x++){nok(x,b);nok(x,b+d-1);}for(let y=b;y<b+d;y++){nok(a,y);nok(a+c-1,y);}}
    else if(t==='C'){let x=c,y=0,e=1-c;while(x>=y){for(const [p,q] of [[x,y],[y,x],[-y,x],[-x,y],[-x,-y],[-y,-x],[y,-x],[x,-y]])nok(a+p,b+q);y++;if(e<0)e+=2*y+1;else{x--;e+=2*(y-x)+1;}}}
    else if(t==='L'){let x0=a,y0=b;const x1=c,y1=d,dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
      for(;;){nok(x0,y0);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}
  }
  return G;
}
function simgeSvg(ad,boy,renk){
  const G=simgeIzgara(ad);let r='';
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(G[y][x])r+='<rect x="'+x+'" y="'+y+'" width="1" height="1"/>';
  return'<svg class="simge" viewBox="0 0 16 16" width="'+(boy||16)+'" height="'+(boy||16)+'" fill="'+(renk||'currentColor')+'" shape-rendering="crispEdges" aria-hidden="true">'+r+'</svg>';
}
