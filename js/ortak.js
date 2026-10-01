/* ============ Chairman — ortak yardımcılar: sayı araçları, 3x5 piksel yazı, kulüpler, reklam listesi ============ */
'use strict';
/* ============ yardımcılar ============ */
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const rnd=Math.random;
/* tohumlu rastgele sayı (mulberry32): aynı tohum hep aynı sayı dizisini verir. Maç motoru bunu kullanır; aynı tohumla aynı maç oynanır */
function tohumluRastgele(tohum){let a=tohum>>>0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
/* parçalı doğrusal eğri: noktalar [[x,y],...] (x artan); aralık dışında uçtaki değer */
function cizgiDegeri(N,x){if(x<=N[0][0])return N[0][1];for(let i=1;i<N.length;i++)if(x<=N[i][0]){const a=N[i-1],b=N[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}return N[N.length-1][1];}
function h2(x,y){let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;}
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);const a=h2(xi,yi),b=h2(xi+1,yi),c=h2(xi,yi+1),d=h2(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}

/* ============ 3x5 piksel yazı (Türkçe harflerle) ============ */
const GLYPH={
A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',
H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'110101101101101',
O:'010101101101010',P:'110101110100100',Q:'010101101110011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',
V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111',
'0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110',
'6':'011100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001110',
' ':'000000000000000','-':'000000111000000','.':'000000000000010',':':'000010000010000',"'":'010010000000000','!':'010010010000010',
'·':'000000010000000','/':'001001010100100','+':'000010111010000',',':'000000000010100','?':'110001010000010'
};
const ACC={'Ç':['C','000','010'],'Ş':['S','000','010'],'Ğ':['G','111','000'],'İ':['I','010','000'],'Ö':['O','101','000'],'Ü':['U','101','000']};
const GCACHE={};
function glyphRows(ch){
  if(GCACHE[ch])return GCACHE[ch];
  let top='000',bot='000',base=ch;const a=ACC[ch];
  if(a){base=a[0];top=a[1];bot=a[2];}
  const g=GLYPH[base]||GLYPH['?'];
  return GCACHE[ch]=[top,g.slice(0,3),g.slice(3,6),g.slice(6,9),g.slice(9,12),g.slice(12,15),bot];
}
const upTR=s=>s.toLocaleUpperCase('tr-TR');
const textW=(s,sx)=>upTR(s).length*4*sx-sx;
function makeTex(w,h,bg){const t={w,h,d:new Uint8ClampedArray(w*h*3)};if(bg)fillTex(t,0,0,w,h,bg);return t;}
function fillTex(t,x,y,w,h,c){for(let j=y;j<y+h;j++){if(j<0||j>=t.h)continue;for(let i=x;i<x+w;i++){if(i<0||i>=t.w)continue;const k=(j*t.w+i)*3;t.d[k]=c[0];t.d[k+1]=c[1];t.d[k+2]=c[2];}}}
function texText(t,s,x,y,c,sx,sy){s=upTR(s);for(let n=0;n<s.length;n++){const rows=glyphRows(s[n]);for(let r=0;r<7;r++)for(let q=0;q<3;q++)if(rows[r][q]==='1')fillTex(t,x+(n*4+q)*sx,y+r*sy,sx,sy,c);}}
function ctxText(ctx,s,x,y,col,sc){sc=sc||1;ctx.fillStyle=col;s=upTR(s);for(let n=0;n<s.length;n++){const rows=glyphRows(s[n]);for(let r=0;r<7;r++)for(let q=0;q<3;q++)if(rows[r][q]==='1')ctx.fillRect(x+(n*4+q)*sc,y+r*sc,sc,sc);}}

/* ============ paletler ============ */
const EGA=[[0,0,0],[0,0,170],[0,170,0],[0,170,170],[170,0,0],[170,0,170],[170,85,0],[170,170,170],[85,85,85],[85,85,255],[85,255,85],[85,255,255],[255,85,85],[255,85,255],[255,255,85],[255,255,255]];
let EGA_LUT=null;
function egaLUT(){
  if(EGA_LUT)return EGA_LUT;
  const L=new Uint8Array(32768);
  for(let r=0;r<32;r++)for(let g=0;g<32;g++)for(let b=0;b<32;b++){
    const R=r*8+4,G=g*8+4,B=b*8+4;let best=0,bd=1e12;
    for(let i=0;i<16;i++){const p=EGA[i];const dr=R-p[0],dg=G-p[1],db=B-p[2];const d=2*dr*dr+4*dg*dg+3*db*db;if(d<bd){bd=d;best=i;}}
    L[(r<<10)|(g<<5)|b]=best;
  }
  return EGA_LUT=L;
}
const BAYER=new Float32Array([0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+0.5)/16-0.5));

/* ============ kulüpler ============ */
const TEAMS=[
  {name:'Demirkapı',short:'DEMİRKAPI',shirt:[206,50,36],trim:[244,240,230],shorts:[240,238,230],socks:[206,50,36],
   gk:[[236,194,40],[28,28,30],[236,194,40]],
   names:['Engin','Hüseyin','Ziya','Cengiz','Rıza','Oğuz','Metin','Selçuk','Kadir','Erdal','Bülent']},
  {name:'Akdeniz',short:'AKDENİZ',shirt:[236,240,244],trim:[36,70,150],shorts:[34,54,118],socks:[236,240,244],
   gk:[[62,146,84],[24,24,26],[62,146,84]],
   names:['Nihat','Yaşar','Turgut','İlyas','Nevzat','Halil','Sadi','Fikret','Yılmaz','Orhan','Levent']}
];

/* ============ dokular: reklam panoları, pankart, skor tabelası ============ */
const ADS=[['ŞİMŞEK PİL',[250,210,40],[196,28,28]],['LALE KOLONYA',[246,244,236],[28,110,62]],['ÇINAR BİSKÜVİ',[186,30,40],[250,238,214]],
  ['KARAKUŞ LASTİK',[22,22,26],[250,178,40]],['DEMİRKAPI ÇELİK',[30,58,138],[244,244,244]],['RADYO 88',[238,118,22],[22,22,30]],
  ['MARMARA GAZOZ',[40,146,200],[255,255,255]],['ANKA TEKSTİL',[244,244,238],[186,30,40]]];
function buildAdTex(){
  const ps=ADS.map(a=>({t:a[0],bg:a[1],fg:a[2],w:Math.max(72,textW(a[0],2)+20)}));
  const W=ps.reduce((s,p)=>s+p.w,0);const t=makeTex(W,9,[0,0,0]);let x=0;
  for(const p of ps){fillTex(t,x,0,p.w,9,p.bg);fillTex(t,x,0,1,9,[12,12,14]);texText(t,p.t,x+((p.w-textW(p.t,2))>>1),1,p.fg,2,1);x+=p.w;}
  return t;
}
function buildBannerTex(){
  const s='DEMİRKAPI SENİ SEVİYORUZ';const w=textW(s,2)+12,h=18;const t=makeTex(w,h,[238,234,222]);
  fillTex(t,0,0,w,2,[196,34,30]);fillTex(t,0,h-2,w,2,[196,34,30]);texText(t,s,6,2,[196,34,30],2,2);return t;
}
function drawBoardTex(t,sc,label){
  fillTex(t,0,0,t.w,t.h,[18,11,4]);
  for(let y=0;y<t.h;y+=2)for(let x=(y>>1)&1;x<t.w;x+=2){const k=(y*t.w+x)*3;t.d[k]=28;t.d[k+1]=17;t.d[k+2]=6;}
  const A=[255,176,40],B=[255,236,190];
  texText(t,TEAMS[0].short,4,1,A,1,1);texText(t,TEAMS[1].short,t.w-4-textW(TEAMS[1].short,1),1,A,1,1);
  const s=sc[0]+'-'+sc[1];texText(t,s,(t.w-textW(s,3))>>1,9,B,3,2);
  texText(t,label,(t.w-textW(label,1))>>1,24,A,1,1);
}
