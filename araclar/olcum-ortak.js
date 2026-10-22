'use strict';
/* ============ Ölçü eklentilerinin ortak yardımcıları (V1-0b, 2026-10-20; FUTBOL_KUTUPHANESI §12.14, kutuphane/J J.10) ============
   Bu dosya araclar/olcumler/ klasörünün DIŞINDADIR (mac-deneme.js oradaki her .js'i eklenti sayar; senaryo-ortak.js ile aynı kalıp).
   Kullanım (eklentide): const O=require('../olcum-ortak'); yeni:(ctx)=>{const F=O.bagla(ctx); …}
     O.bagla(ctx)            motor bağlamından saf işlev ve sabitler: top (topFizikAdim), zamanButcesi, vurusSureleri, hrkVurusDonus, profilAlt,
                             MOTOR_AYAR, PL, PW, MZ, GW2 (bağlam başına bir kez; bağlam yoksa null)
     O.aciNorm, O.aciFark     açı yardımcıları (motordakinin aynısı)
     O.ortanca(a), O.yuzde(a,q)  sıralı dizinin ortancası ve q yüzdeliği (en yakın alt sıra: s[⌊q·(n−1)⌋]; tasarım sondalarıyla aynı)
     O.ucus(F,m,b)            topun bir KOPYASI topFizikAdim ile ilerletilir (en çok 8 sn): tepe yüksekliği, ilk iniş {x,z,t,L} (y ≤ 0,12 m'ye
                             inerken), sahadan çıkış {x,z,t,havada,tac} — oyuncuları bilmez
     O.disBeceri(F,p)         V1a'nın dış ayak becerisi: clamp(0,5·pas + 0,3·yaratıcılık + 0,2·ilk dokunuş) (motordaki disAyakBecerisi'nin aynası;
                             V1a gelince onun yerine okunabilir)
     O.dilim(S,x)             sınırlar S'ye göre dilim (S[i] ≤ x < S[i+1])
   Rastlantı çekmez, motora ve topa yazmaz, motorun önbellek yazan yöntemlerini (topYolu, topTahmin, yakalamaNoktasi, cerceveyeGider) çağırmaz. */
const vm=require('vm');
const ONB=new WeakMap();
function bagla(ctx){
  if(!ctx)return null;let o=ONB.get(ctx);if(o)return o;
  const al=a=>{try{return vm.runInContext(`typeof ${a}!=='undefined'?${a}:undefined`,ctx);}catch(e){return undefined;}};
  o={top:al('topFizikAdim'),zamanButcesi:al('zamanButcesi'),vurusSureleri:al('vurusSureleri'),hrkVurusDonus:al('hrkVurusDonus'),profilAlt:al('profilAlt'),
    MOTOR_AYAR:al('MOTOR_AYAR'),PL:al('PL')||52.5,PW:al('PW')||68,MZ:al('MZ')||34,GW2:al('GW2')||3.66};
  ONB.set(ctx,o);return o;}
const aciNorm=a=>{a=(a+Math.PI)%(2*Math.PI);if(a<0)a+=2*Math.PI;return a-Math.PI;};
const aciFark=(a,b)=>aciNorm(a-b);
const sirala=a=>a.filter(x=>typeof x==='number'&&x===x).sort((x,y)=>x-y);
const ortanca=a=>{const s=sirala(a),n=s.length;if(!n)return NaN;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;};
const yuzde=(a,q)=>{const s=sirala(a);return s.length?s[Math.floor(q*(s.length-1))]:NaN;};
const dilim=(S,x)=>{for(let i=0;i<S.length-1;i++)if(x<S[i+1])return i;return S.length-2;};
function ucus(F,m,b){
  const r={tepe:b.y,inis:null,cik:null};if(!F||!F.top)return r;
  const PL=F.PL,PW=F.PW,s={x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:b.egri||0,ust:b.ust||0};
  for(let i=1;i<=480;i++){const py=s.y;F.top(s,1/60,false,m.R,m.kosullar);if(s.y>r.tepe)r.tepe=s.y;
    if(!r.inis&&py>0.12&&s.y<=0.12&&s.vy<=0)r.inis={x:s.x,z:s.z,t:i/60,L:Math.hypot(s.x-b.x,s.z-b.z),v:Math.hypot(s.vx,s.vy,s.vz)};
    if(!r.cik&&(Math.abs(s.x)>PL||s.z<0||s.z>PW))r.cik={x:s.x,z:s.z,t:i/60,havada:s.y>0.2,tac:s.z<0||s.z>PW};
    if(r.cik&&(r.inis||s.y<0.12))break;if(Math.hypot(s.vx,s.vz)<0.3&&s.y<0.12)break;}
  return r;}
function disBeceri(F,p){const pa=F&&F.profilAlt?F.profilAlt:(q,a,y)=>y;const x=0.5*p.oz.pas+0.3*pa(p,'yaraticilik',0.5)+0.2*pa(p,'ilkDokunus',0.5);return Math.max(0,Math.min(1,x));}
module.exports={bagla,aciNorm,aciFark,ortanca,yuzde,dilim,ucus,disBeceri};
