/* ============ Chairman — oyuncular: kesitli insan modeli ve pozlar. Maçtaki hareketi js/mac-sahnesi.js verir ============ */
/* ============ oyuncular: değişken kesitli halkalardan az poligonlu tek kemikli modeller (A5), 16 piksellik dokular ============ */
function dk(hex,f){const n=parseInt(hex.slice(1),16);return 'rgb('+(((n>>16)&255)*f|0)+','+(((n>>8)&255)*f|0)+','+((n&255)*f|0)+')';}
function numText(g,s,x,y,col,out,sc){if(out)for(const d of[[-1,0],[1,0],[0,-1],[0,1]])ctxText(g,s,x+d[0],y+d[1],out,sc);ctxText(g,s,x,y,col,sc);}
/* ---- doku atlası: her insanın 64x64'lük tek dokusu. 16'lık kareler: forma önü/arkası, yüz, başın yanı ve arkası; altta düz renk kareleri ---- */
const ATLAS=64,KARE={formaOn:[0,0],formaArka:[16,0],yuz:[32,0],basYan:[48,0],basArka:[0,16]};
const RENK_KARE=['shirt','shorts','socks','skin','hair','boots','glove','trim','ek1','ek2','ek3','ek4'];
function shirtFront(g,k,ox,oy){g.fillStyle=k.shirt;g.fillRect(ox,oy,16,16);
  if(k.sash){g.fillStyle=k.sash;for(let i=0;i<16;i++)g.fillRect(ox+i,oy+13-i,1,4);}
  g.fillStyle=k.trim;g.fillRect(ox+5,oy,6,1);g.fillRect(ox+6,oy+1,1,1);g.fillRect(ox+9,oy+1,1,1);g.fillRect(ox+7,oy+2,2,1);g.fillRect(ox+3,oy+4,2,2);
  if(k.num&&!k.sash){const s=String(k.num);numText(g,s,ox+13-textW(s,1),oy+4,k.trim,k.out,1);}
  g.fillStyle=dk(k.shirt,0.78);g.fillRect(ox,oy+15,16,1);}
function shirtBack(g,k,ox,oy){g.fillStyle=k.shirt;g.fillRect(ox,oy,16,16);g.fillStyle=k.trim;g.fillRect(ox+5,oy,6,1);
  if(k.num){const s=String(k.num);numText(g,s,ox+((16-textW(s,2))>>1),oy+1,k.trim,k.out,2);}}
function headTiles(g,k){
  const bald=k.style==='bald',curly=k.style==='curly',longH=k.style==='long'||k.style==='mullet',hr=k.hair,sk=k.skin;
  let [x,y]=KARE.yuz;g.fillStyle=sk;g.fillRect(x,y,16,16);g.fillStyle=hr;
  if(bald){g.fillRect(x,y+5,2,3);g.fillRect(x+14,y+5,2,3);}else{g.fillRect(x,y,16,curly?5:4);g.fillRect(x,y+4,2,4);g.fillRect(x+14,y+4,2,4);}
  if(k.beard){g.fillRect(x+1,y+10,14,6);g.fillStyle=sk;g.fillRect(x+4,y+10,8,1);}
  g.fillStyle='#16110d';g.fillRect(x+4,y+7,2,2);g.fillRect(x+10,y+7,2,2);g.fillStyle=dk(sk,0.82);g.fillRect(x+7,y+8,2,3);
  if(k.mus){g.fillStyle=hr;g.fillRect(x+4,y+11,8,1);}g.fillStyle='#7a3c30';g.fillRect(x+6,y+13,4,1);
  [x,y]=KARE.basYan;g.fillStyle=sk;g.fillRect(x,y,16,16);g.fillStyle=hr;
  if(bald)g.fillRect(x,y+6,16,3);else g.fillRect(x,y,16,longH?9:5);
  if(k.beard)g.fillRect(x,y+11,16,5);
  g.fillStyle=dk(sk,0.8);g.fillRect(x+7,y+7,2,3);
  [x,y]=KARE.basArka;g.fillStyle=sk;g.fillRect(x,y,16,16);g.fillStyle=hr;
  if(bald)g.fillRect(x,y+6,16,5);else g.fillRect(x,y,16,longH?16:11);
}
function atlasCiz(k,ekRenkler){
  const cv=mk(ATLAS,ATLAS),g=cv.getContext('2d');
  shirtFront(g,k,...KARE.formaOn);shirtBack(g,k,...KARE.formaArka);headTiles(g,k);
  const renk={shirt:k.shirt,shorts:k.shorts,socks:k.socks,skin:k.skin,hair:k.hair,boots:k.boots||'#18181a',glove:k.glove||k.skin,trim:k.trim,...(ekRenkler||{})};
  RENK_KARE.forEach((ad,i)=>{g.fillStyle=renk[ad]||'#ff00ff';g.fillRect((i%8)*8,32+Math.floor(i/8)*8,8,8);});
  return cv;
}
/* atlas içinde bir yüzün uv dikdörtgeni: doku karesi ya da düz renk karesinin ortası */
function uvKare(ad){const [x,y]=KARE[ad];return[x/ATLAS,1-(y+16)/ATLAS,(x+16)/ATLAS,1-y/ATLAS];}
function uvRenk(ad){const i=RENK_KARE.indexOf(ad),x=(i%8)*8+4,y=32+Math.floor(i/8)*8+4;return[x/ATLAS,1-y/ATLAS,x/ATLAS,1-y/ATLAS];}

/* ---- insan modeli (A5, 2026-10-15; gerçekçilik planı §4 A5): insan başına tek kemikli model (SkinnedMesh), tek çizim, 11 kemik ve 64×64 atlas.
   Gövde, baş, kollar ve bacaklar değişken kesitli halkalardan kurulur (kutu yerine): halka [y, rx, rz, cx, cz, w] kemiğe göre metre; iki halka
   arası bir bant, rengi ya da dokusu bandın anahtarından (renk karesi adı, 'forma' gövde dokusu, 'bas' baş dokusu). Eklemde (kalça–gövde, dirsek,
   diz) halkalar iki kemiğe ağırlıkla bağlıdır (w ilk kemiğin payı): eklem büküldükçe yüzey de bükülür. Normaller halka ızgarasından (komşu halka ve
   dilim farkları; renk değişen kopyalar aynı normali alır, dikiş yok); STIL.model.normal 'duz' her dilimi düz gölgeler (PS1 gibi), 'yumusak'
   Gouraud. Sabit kalanlar (çizim ve ölçüm araçları bunlara bağlı): kemik adları, yerleri ve eksenleri; taban noktası (0, −0,5, 0,05) kL/kR'de,
   el (0, −0,3, 0) eL/eR'de, başın z yarı derinliği ~0,12. Eski kutu modeli ?model=kutu ya da STIL.model.tur 'kutu' (karşılaştırma; kullanıcı
   A5'i değerlendirene dek, sonra kalkar). Dönen nesne: root, mesh, hip, govde, head, aL, eL, aR, eR, lL, kL, lR, kR, kemikler ---- */
const MODEL_PARAM=(()=>{try{const v=new URLSearchParams(location.search).get('model');return['kutu','duz','yumusak'].includes(v)?v:null;}catch(e){return null;}})();
/* kimlikten biçim (rastlantısız): kemikler oynamaz, yalnız yarıçaplar — omuz (gövdenin üstü), bel, kalça ve uyluk, baldır. Ad özetinden ve
   kadronun yapı ile boyundan; adı olmayan kişide (kenar, hakem) numara, ten ve saçtan */
function adOzet(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193);}return h|0;}
const SEKIL_DUZ={omuz:1,bel:1,kalca:1,baldir:1};
function sekilKur(k){const oz=adOzet((k.ad||'')+'|'+(k.no||0)+'|'+(k.ten||0)+'|'+(k.sac||'')),y=clamp(((k.yapi||1)-1)/0.1,-1,1),boy=k.boy||1;
  return{omuz:clamp(1+0.04*y+0.05*(h2(oz,1)-0.5),0.95,1.06),bel:clamp(1+0.06*y+0.06*(h2(oz,2)-0.5),0.92,1.08),
    kalca:clamp(1+0.05*y-0.2*(boy-1)+0.08*(h2(oz,3)-0.5),0.92,1.08),baldir:clamp(1+0.2*(h2(oz,4)-0.5),0.9,1.1)};}
/* başın kesiti (head kemiği): [y, rx, rz, cz]; saç kabı bunun üstüne kurulur */
const INSAN_BAS=[[-0.13,0.055,0.060,0.02],[-0.08,0.090,0.105,0.01],[-0.02,0.110,0.120,0],[0.05,0.110,0.120,0],[0.10,0.085,0.095,-0.005]];
function basKesit(y){const B=INSAN_BAS;if(y<=B[0][0])return B[0];if(y>=B[B.length-1][0])return B[B.length-1];
  for(let i=1;i<B.length;i++)if(y<=B[i][0]){const a=B[i-1],b=B[i],t=(y-a[0])/(b[0]-a[0]);return[y,lerp(a[1],b[1],t),lerp(a[2],b[2],t),lerp(a[3],b[3],t)];}return B[B.length-1];}
/* saç: hairline [önde, arkada] (başa göre y), kabın uzaklığı, tepe; uzun ve mullet için arkada dökülen saç (yarım halkalar [y, rx, rz, cz]) */
const INSAN_SAC={short:{cizgi:[0.05,-0.03],pay:0,tepe:0.148},curly:{cizgi:[0.03,-0.07],pay:0.03,tepe:0.18},
  long:{cizgi:[0.05,0.0],pay:0,tepe:0.148,dokum:[[-0.02,0.12,0.135,0],[-0.12,0.115,0.14,-0.02],[-0.25,0.10,0.10,-0.08]]},
  mullet:{cizgi:[0.05,-0.05],pay:0,tepe:0.148,dokum:[[-0.05,0.10,0.13,0],[-0.15,0.09,0.10,-0.05],[-0.25,0.07,0.07,-0.10]]}};
/* yüzeyler: kem (ilk kemik), kem2 (eklemin öbür kemiği), H halkalar, U bant anahtarları (H.length − 1), uc0/uc1 ilk ve son halkadaki kapak
   {y, cx, cz, uv, duz (düz disk)}, forma: gövde dokusunun etek yüksekliği, yay: açık yarım halka [a0, a1] (radyan; θ=0 önde, +x'e doğru artar) */
function insanYuzeyleri(k,S){
  const kol=(k.gk||k.ls)?'shirt':'skin',el=k.glove?'glove':'skin',bac=k.pant?'shorts':'skin',sok=k.rolled?'skin':'socks',E=STIL.model.eklem;
  const o=S.omuz,b=S.bel,kl=S.kalca,bd=S.baldir,Y=[];
  /* kalça–gövde tek tüp (kalça kemiğine göre): şort kalçada, etek iki kemiğe yarı yarıya, forma gövde kemiğinde; göğüs genişliği omuzdan, bel kimlikten */
  Y.push({kem:'hip',kem2:'govde',H:[[-0.09,0.165*kl,0.100*kl,0,0,1],[0,0.175*kl,0.105*kl,0,0,1],[0.08,0.180*kl,0.105*kl,0,0,1],[0.12,0.185*b,0.105*b,0,0,0.5],
    [0.18,0.185*b,0.105*b,0,0,0],[0.28,0.175*b,0.100*b,0,0,0],[0.40,0.195*o,0.110,0,0,0],[0.52,0.210*o,0.115,0,0,0],[0.60,0.205*o,0.110,0,0,0],[0.66,0.160*o,0.090,0,0,0]],
    U:['shorts','shorts','shorts','forma','forma','forma','forma','forma','forma'],uc0:{y:-0.09,cx:0,cz:0,uv:'shorts',duz:true},uc1:{y:0.66,cx:0,cz:0,uv:'shirt',duz:true},forma:0.12});
  Y.push({kem:'govde',H:[[0.52,0.05,0.05,0,0,1],[0.62,0.05,0.05,0,0,1]],U:['skin']});   /* boyun (iki ucu da gövdenin ve başın içinde) */
  Y.push({kem:'head',H:INSAN_BAS.map(h=>[h[0],h[1],h[2],0,h[3],1]),U:['bas','bas','bas','bas'],
    uc0:{y:-0.135,cx:0,cz:0.02,uv:'skin'},uc1:{y:0.135,cx:0,cz:-0.005,uv:k.style==='bald'?'skin':'hair'},bas:true});
  const sac=INSAN_SAC[k.style];
  if(sac){const pay=STIL.model.sacPay+sac.pay,cz=sac.cizgi,N=3,H=[];
    /* kap: saç çizgisinden (önde ve arkada farklı yükseklik) 0,10'a dek halkalar, sonra tepe; kafadan pay kadar dışarıda */
    for(let i=0;i<N;i++){const f=i/(N-1);H.push({f:t=>{const y0=cz[1]+(cz[0]-cz[1])*(1+Math.cos(t))/2,y=lerp(y0,0.10,f),q=basKesit(y);return[(q[1]+pay)*Math.sin(t),y,q[3]+(q[2]+pay)*Math.cos(t)];},c:[0,lerp((cz[0]+cz[1])/2,0.10,f),0],w:1});}
    Y.push({kem:'head',H,U:['hair','hair'],uc1:{y:sac.tepe,cx:0,cz:-0.005,uv:'hair'}});
    if(sac.dokum)Y.push({kem:'head',H:sac.dokum.map(h=>[h[0],h[1],h[2],0,h[3],1]),U:['hair','hair'],yay:[1.75,4.53],yayN:4});}
  for(const [a,e] of[['aL','eL'],['aR','eR']])
    /* kol (omzun tepesinden parmak ucuna; dirsekte iki kemik): kol ağzı −0,15'te, bilek −0,54'te; el eL'de (0, −0,3, 0) çevresinde */
    Y.push({kem:a,kem2:e,H:[[0,0.060,0.060,0,0,1],[-0.06,0.062,0.062,0,0,1],[-0.15,0.056,0.056,0,0,1],[-0.25,0.050,0.050,0,0,1],[-0.30,0.052*E,0.052*E,0,0,0.5],
      [-0.35,0.047,0.047,0,0,0],[-0.45,0.043,0.043,0,0,0],[-0.54,0.036,0.036,0,0,0],[-0.56,0.045,0.030,0,0,0],[-0.63,0.038,0.026,0,0,0]],
      U:['shirt','shirt',kol,kol,kol,kol,kol,el,el],uc0:{y:0.03,cx:0,cz:0,uv:'shirt'},uc1:{y:-0.655,cx:0,cz:0,uv:el}});
  for(const [l,kn] of[['lL','kL'],['lR','kR']])
    /* bacak (uyluğun üstünden tabana; dizde iki kemik): şort −0,18'e dek, çorap dizden, krampon bilekten; taban halkasının merkezi taban noktası */
    Y.push({kem:l,kem2:kn,H:[[0.02,0.085*kl,0.090*kl,0,0,1],[-0.10,0.080*kl,0.088*kl,0,0,1],[-0.18,0.078*kl,0.085*kl,0,0,1],[-0.30,0.070,0.076,0,0,1],[-0.40,0.062,0.068,0,0,1],
      [-0.44,0.064*E,0.070*E,0,0,0.5],[-0.50,0.057*bd,0.063*bd,0,0,0],[-0.60,0.060*bd,0.068*bd,0,0,0],[-0.64,(k.rolled?0.069:0.057)*bd,(k.rolled?0.076:0.064)*bd,0,0,0],
      [-0.74,0.050,0.056,0,0,0],[-0.84,0.042,0.047,0,0,0],[-0.86,0.050,0.070,0,0.03,0],[-0.90,0.060,0.130,0,0.05,0],[-0.94,0.055,0.125,0,0.05,0]],
      U:['shorts','shorts',bac,bac,bac,sok,sok,sok,'socks','socks','boots','boots','boots'],uc1:{y:-0.94,cx:0,cz:0.05,uv:'boots',duz:true}});
  return Y;
}
/* bir yüzeyi geometriye ekler: halka ızgarası (duruşta dünya konumu), ızgara normalleri, bantlar ve uç kapakları. G: {pos, nor, uv, si, sw, idx} */
function yuzeyEkle(G,Y,B,kemikler,n,duz,RU){
  const kem=B[Y.kem],bi=kemikler.indexOf(kem),bi2=Y.kem2?kemikler.indexOf(B[Y.kem2]):-1,M=kem.matrixWorld,V=new THREE.Vector3();
  const yay=!!Y.yay,S=yay?Y.yayN:n,a0=yay?Y.yay[0]:0,da=yay?(Y.yay[1]-Y.yay[0])/S:2*Math.PI/n,R=Y.H.length;
  const dunya=q=>{V.set(q[0],q[1],q[2]).applyMatrix4(M);return[V.x,V.y,V.z];};
  const P=[],C=[],Wt=[];
  for(let i=0;i<R;i++){const h=Y.H[i],row=[];
    for(let s=0;s<=S;s++){const t=a0+s*da;row.push(dunya(h.f?h.f(t):[h[3]+h[1]*Math.sin(t),h[0],h[4]+h[2]*Math.cos(t)]));}
    P.push(row);C.push(dunya(h.f?h.c:[h[3],h[0],h[4]]));Wt.push(h.f?h.w:h[5]);}
  const alt=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cap=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
    nrm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l];},nok=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  /* ızgara normali: çevre teğeti × boy teğeti, dışa döndürülür (merkezden noktaya) */
  const N=P.map((row,i)=>row.map((p,s)=>{const sp=yay?Math.max(0,s-1):(s===0?S-1:s-1),sn=yay?Math.min(S,s+1):(s===S?1:s+1),ip=Math.max(0,i-1),inx=Math.min(R-1,i+1);
    let nv=nrm(cap(alt(row[sn],row[sp]),alt(P[inx][s],P[ip][s])));if(nok(nv,alt(p,C[i]))<0)nv=[-nv[0],-nv[1],-nv[2]];return nv;}));
  const bolge=(ad,col)=>{const t=((a0+(col+0.5)*da)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
    if(ad==='forma')return t<Math.PI/2||t>1.5*Math.PI?0:1;if(ad==='bas')return t<Math.PI/4||t>1.75*Math.PI?0:t<0.75*Math.PI?1:t<1.25*Math.PI?2:3;return 0;};
  const uvAl=(ad,bo,i,s)=>{const t=a0+s*da,h=Y.H[i],y=h.f?h.c[1]:h[0];
    if(ad==='forma'){const r=uvKare(bo?'formaArka':'formaOn'),sn=Math.sin(t),u=bo?(1-sn)/2:(sn+1)/2,v=clamp((y-Y.forma)/0.54,0,1);return[r[0]+u*(r[2]-r[0]),r[1]+v*(r[3]-r[1])];}
    if(ad==='bas'){const r=uvKare(bo===0?'yuz':bo===2?'basArka':'basYan'),tt=bo===0&&t>Math.PI?t-2*Math.PI:t,bas=[-Math.PI/4,Math.PI/4,0.75*Math.PI,1.25*Math.PI][bo],
      u=clamp((tt-bas)/(Math.PI/2),0,1),v=clamp((y+0.13)/0.26,0,1);return[r[0]+u*(r[2]-r[0]),r[1]+v*(r[3]-r[1])];}
    const r=RU(ad);return[r[0],r[1]];};
  const kos=new Map();
  const ekle=(p,nv,uv,w)=>{const o=G.pos.length/3;G.pos.push(p[0],p[1],p[2]);G.nor.push(nv[0],nv[1],nv[2]);G.uv.push(uv[0],uv[1]);
    if(bi2>=0&&w<1){G.si.push(bi,bi2,0,0);G.sw.push(w,1-w,0,0);}else{G.si.push(bi,0,0,0);G.sw.push(1,0,0,0);}return o;};
  /* köşe: yumuşakta halka, anahtar, bölge ve dilim başına; düzde ayrıca sütun ve yanı başına (sütunun normali iki kenar normalinin ortası) */
  const kose=(i,ad,bo,s,col)=>{const anah=duz?i+'|'+ad+'|'+bo+'|'+col+'|'+s:i+'|'+ad+'|'+bo+'|'+s;let o=kos.get(anah);
    if(o===undefined){const nv=duz?nrm([N[i][col][0]+N[i][col+1][0],N[i][col][1]+N[i][col+1][1],N[i][col][2]+N[i][col+1][2]]):N[i][s];o=ekle(P[i][s],nv,uvAl(ad,bo,i,s),Wt[i]);kos.set(anah,o);}return o;};
  const ucg=(a,b,c,dis)=>{const pa=G.pos,A=[pa[a*3],pa[a*3+1],pa[a*3+2]],Bv=[pa[b*3],pa[b*3+1],pa[b*3+2]],Cv=[pa[c*3],pa[c*3+1],pa[c*3+2]];
    if(nok(cap(alt(Bv,A),alt(Cv,A)),dis)>=0)G.idx.push(a,b,c);else G.idx.push(a,c,b);};
  /* bantlar */
  for(let bnd=0;bnd<R-1;bnd++){const ad=Y.U[bnd];
    for(let col=0;col<S;col++){const bo=bolge(ad,col),a=kose(bnd,ad,bo,col,col),b=kose(bnd,ad,bo,col+1,col),c=kose(bnd+1,ad,bo,col+1,col),d=kose(bnd+1,ad,bo,col,col);
      const m=[(P[bnd][col][0]+P[bnd+1][col+1][0])/2,(P[bnd][col][1]+P[bnd+1][col+1][1])/2,(P[bnd][col][2]+P[bnd+1][col+1][2])/2],
        cm=[(C[bnd][0]+C[bnd+1][0])/2,(C[bnd][1]+C[bnd+1][1])/2,(C[bnd][2]+C[bnd+1][2])/2],dis=alt(m,cm);
      ucg(a,b,c,dis);ucg(a,c,d,dis);}}
  /* uç kapakları: tepe köşeye yelpaze; düz diskte bütün köşeler eksen yönünde (sert kenar), yuvarlakta kenar köşeleri ızgara normaliyle */
  for(const [U,i,j] of[[Y.uc0,0,1],[Y.uc1,R-1,R-2]]){if(!U)continue;
    const tp=dunya([U.cx,U.y,U.cz]),ex=nrm(alt(C[i],C[j])),ax=Math.hypot(tp[0]-C[i][0],tp[1]-C[i][1],tp[2]-C[i][2])>1e-4?nrm(alt(tp,C[i])):ex;
    const uv0=uvAl(U.uv,0,i,0);
    if(duz||U.duz){for(let col=0;col<S;col++){const p0=P[i][col],p1=P[i][col+1],fn=U.duz?ex:nrm(cap(alt(p1,p0),alt(tp,p0))),f2=nok(fn,ex)<0?[-fn[0],-fn[1],-fn[2]]:fn;
        const a=ekle(p0,f2,uv0,Wt[i]),b=ekle(p1,f2,uv0,Wt[i]),c=ekle(tp,f2,uv0,Wt[i]);ucg(a,b,c,ex);}}
    else{const c=ekle(tp,ax,uv0,Wt[i]);for(let col=0;col<S;col++){const a=kose(i,U.uv,0,col,col),b=kose(i,U.uv,0,col+1,col);ucg(a,b,c,ex);}}}
}
/* kesitli geometri (yüzeyler + ek kutular) */
function kesitGeometri(k,B,kemikler,duz){
  const G={pos:[],nor:[],uv:[],si:[],sw:[],idx:[]},uvC={},RU=ad=>uvC[ad]||(uvC[ad]=uvRenk(ad));
  for(const Y of insanYuzeyleri(k,k.sekil||SEKIL_DUZ))yuzeyEkle(G,Y,B,kemikler,STIL.model.dilim,duz,RU);
  if(k.ekParcalar)for(const e of k.ekParcalar)kutuEkle(G,B[e.kemik],kemikler,e.w,e.h,e.d,e.x,e.y,e.z,RU(e.renk));
  return G;
}
/* kutu (ek parçalar: fotoğraf makinesi, ilk yardım çantası): altı yüz aynı renk karesi; kemiğe sert bağlı */
function kutuEkle(G,kem,kemikler,w,h,d,x,y,z,r){
  const g=new THREE.BoxGeometry(w,h,d),P=g.attributes.position,Nn=g.attributes.normal,o=G.pos.length/3,bi=kemikler.indexOf(kem),V=new THREE.Vector3();
  for(let i=0;i<P.count;i++){V.set(P.getX(i)+x,P.getY(i)+y,P.getZ(i)+z).applyMatrix4(kem.matrixWorld);G.pos.push(V.x,V.y,V.z);G.nor.push(Nn.getX(i),Nn.getY(i),Nn.getZ(i));
    G.uv.push(r[0],r[1]);G.si.push(bi,0,0,0);G.sw.push(1,0,0,0);}
  for(const j of g.index.array)G.idx.push(o+j);g.dispose();
}
/* eski kutu modeli (A5 öncesi; ?model=kutu ile karşılaştırma için, kullanıcı A5'i değerlendirene dek): her kutu tek kemiğe bağlı */
function kutuGeometri(k,B,kemikler){
  const {hip,govde,head,aL,eL,aR,eR,lL,kL,lR,kR}=B,ls=k.gk||k.ls,uv={};
  const R=ad=>uv[ad]||(uv[ad]=uvRenk(ad));
  const parcalar=[];
  const kutu=(kem,w,h,d,x,y,z,yuzler)=>parcalar.push({kem,w,h,d,x,y,z,yuzler});
  const tek=ad=>{const u=R(ad);return[u,u,u,u,u,u];};
  kutu(hip,0.34,0.22,0.21,0,0.02,0,tek('shorts'));
  {const f=R('shirt');kutu(govde,0.42,0.54,0.23,0,0.27,0,[f,f,f,f,uvKare('formaOn'),uvKare('formaArka')]);}
  kutu(govde,0.1,0.08,0.1,0,0.58,0,tek('skin'));
  {const yan=uvKare('basYan');kutu(head,0.22,0.26,0.24,0,0,0,[yan,yan,R(k.style==='bald'?'skin':'hair'),R('skin'),uvKare('yuz'),uvKare('basArka')]);}
  if(k.style==='long')kutu(head,0.23,0.26,0.07,0,-0.12,-0.13,tek('hair'));
  if(k.style==='mullet')kutu(head,0.2,0.2,0.06,0,-0.15,-0.13,tek('hair'));
  if(k.style==='curly'){kutu(head,0.28,0.11,0.28,0,0.16,0,tek('hair'));kutu(head,0.26,0.12,0.06,0,0.04,-0.14,tek('hair'));}
  for(const [a,e] of[[aL,eL],[aR,eR]]){
    kutu(a,0.12,0.15,0.12,0,-0.06,0,tek('shirt'));kutu(a,0.1,0.3,0.1,0,-0.15,0,tek(ls?'shirt':'skin'));
    kutu(e,0.09,0.27,0.09,0,-0.135,0,tek(ls?'shirt':'skin'));kutu(e,0.09,0.09,0.08,0,-0.3,0,tek(k.glove?'glove':'skin'));}
  for(const [l,kn] of[[lL,kL],[lR,kR]]){
    kutu(l,0.17,0.2,0.18,0,-0.08,0,tek('shorts'));kutu(l,0.15,0.44,0.16,0,-0.22,0,tek(k.pant?'shorts':'skin'));
    if(k.rolled){kutu(kn,0.12,0.2,0.13,0,-0.1,0,tek('skin'));kutu(kn,0.14,0.05,0.15,0,-0.21,0,tek('socks'));kutu(kn,0.12,0.22,0.13,0,-0.33,0,tek('socks'));}
    else kutu(kn,0.12,0.44,0.13,0,-0.22,0,tek('socks'));
    kutu(kn,0.12,0.08,0.26,0,-0.46,0.05,tek('boots'));}
  if(k.ekParcalar)for(const e of k.ekParcalar)kutu(B[e.kemik],e.w,e.h,e.d,e.x,e.y,e.z,tek(e.renk));
  /* geometri: kutuların köşeleri kemiklerin bağlanma (düz duruş) konumuna yerleşir */
  const pos=[],nor=[],uvs=[],si=[],sw=[],idx=[],V=new THREE.Vector3();
  for(const pc of parcalar){
    const g=new THREE.BoxGeometry(pc.w,pc.h,pc.d),P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv,o=pos.length/3,bi=kemikler.indexOf(pc.kem);
    for(let i=0;i<P.count;i++){
      V.set(P.getX(i)+pc.x,P.getY(i)+pc.y,P.getZ(i)+pc.z).applyMatrix4(pc.kem.matrixWorld);pos.push(V.x,V.y,V.z);
      nor.push(N.getX(i),N.getY(i),N.getZ(i));
      const r=pc.yuzler[Math.floor(i/4)];uvs.push(r[0]+U.getX(i)*(r[2]-r[0]),r[1]+U.getY(i)*(r[3]-r[1]));
      si.push(bi,0,0,0);sw.push(1,0,0,0);}
    for(const j of g.index.array)idx.push(o+j);g.dispose();}
  return{pos,nor,uv:uvs,si,sw,idx};
}
/* model: kemikler (iskelet 2, 2026-10-03: govde kalçanın üstünde; gövde, boyun, baş ve kollar ona bağlı), geometri (kesitli ya da kutu), tek ağ */
function player(k,ekRenkler){
  const kemik=(ad,parent,x,y,z)=>{const b=new THREE.Bone();b.name=ad;b.position.set(x,y,z);if(parent)parent.add(b);return b;};
  const hip=kemik('hip',null,0,0.95,0),govde=kemik('govde',hip,0,0.12,0),head=kemik('head',govde,0,0.72,0);head.rotation.order='YXZ';
  const aL=kemik('aL',govde,-0.27,0.48,0),eL=kemik('eL',aL,0,-0.3,0),aR=kemik('aR',govde,0.27,0.48,0),eR=kemik('eR',aR,0,-0.3,0);
  const lL=kemik('lL',hip,-0.1,-0.04,0),kL=kemik('kL',lL,0,-0.44,0),lR=kemik('lR',hip,0.1,-0.04,0),kR=kemik('kR',lR,0,-0.44,0);
  const kemikler=[hip,govde,head,aL,eL,aR,eR,lL,kL,lR,kR],B={hip,govde,head,aL,eL,aR,eR,lL,kL,lR,kR};
  hip.updateMatrixWorld(true);
  const tur=MODEL_PARAM==='kutu'?'kutu':MODEL_PARAM?'kesit':STIL.model.tur,duz=MODEL_PARAM?MODEL_PARAM==='duz':STIL.model.normal==='duz';
  const G=tur==='kutu'?kutuGeometri(k,B,kemikler):kesitGeometri(k,B,kemikler,duz);
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(G.pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(G.nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(G.uv,2));
  geo.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(G.si,4));geo.setAttribute('skinWeight',new THREE.Float32BufferAttribute(G.sw,4));geo.setIndex(G.idx);
  geo.computeBoundingSphere();geo.boundingSphere.radius+=0.6;
  const mesh=new THREE.SkinnedMesh(geo,LAM({map:tx(atlasCiz(k,ekRenkler||k.ekRenkler),'n'),skinning:true}));
  mesh.add(hip);mesh.bind(new THREE.Skeleton(kemikler));
  const root=new THREE.Group();root.add(mesh);root.scale.set(k.w||1,k.h||1,k.w||1);
  return{root,mesh,hip,govde,head,aL,eL,aR,eR,lL,kL,lR,kR,kemikler};
}
/* poz: eski 13 kanal (lean, dy, hx, lL/kL/lR/kR, aL/aR, aLz/aRz, eL/eR) aynen; iskelet 2 kanalları verilmezse 0:
   hy/hz kalça dönüşü ve yana yatışı, gx/gy/gz gövde (öne eğilme, dönme, yana yatma), by/bz baş dönüşü ve yatışı,
   lLy/lRy bacak burulması, lLz/lRz bacağı yana açma, aLy/aRy kol burulması */
function pose(r,P){
  r.hip.rotation.set(P.lean||0,P.hy||0,P.hz||0);r.hip.position.y=0.95+(P.dy||0);
  r.govde.rotation.set(P.gx||0,P.gy||0,P.gz||0);r.head.rotation.set(P.hx||0,P.by||0,P.bz||0);
  r.lL.rotation.set(P.lL||0,P.lLy||0,P.lLz||0);r.kL.rotation.x=P.kL||0;r.lR.rotation.set(P.lR||0,P.lRy||0,P.lRz||0);r.kR.rotation.x=P.kR||0;
  r.aL.rotation.set(P.aL||0,P.aLy||0,P.aLz||0);r.aR.rotation.set(P.aR||0,P.aRy||0,P.aRz||0);r.eL.rotation.x=P.eL||0;r.eR.rotation.x=P.eR||0;
}
const POSE={
  runA:{lean:0.2,lL:-0.75,kL:0.35,lR:0.6,kR:1.35,aL:0.65,aR:-0.7,eL:-1.1,eR:-1.1,aLz:-0.1,aRz:0.1},
  runB:{lean:0.2,lL:0.6,kL:1.35,lR:-0.75,kR:0.35,aL:-0.7,aR:0.65,eL:-1.1,eR:-1.1,aLz:-0.1,aRz:0.1},
  dive:{lL:0.25,kL:0.5,lR:-0.35,kR:0.2,aLz:-2.9,aRz:2.9,eL:-0.1,eR:-0.1},
  ready:{lean:0.25,dy:-0.08,lL:-0.2,kL:0.45,lR:0.15,kR:0.4,aL:-0.3,aR:-0.3,aLz:-0.35,aRz:0.35,eL:-0.6,eR:-0.6},
  otur:{dy:-0.4,lL:-1.45,kL:1.45,lR:-1.45,kR:1.45,aL:-0.35,aR:-0.35,eL:-0.9,eR:-0.9,aLz:-0.05,aRz:0.05},
  sevinc:{aLz:-2.6,aRz:2.6,eL:-0.2,eR:-0.2,hx:-0.25},
  kafa:{hx:-0.45,dy:0.25,aLz:-0.5,aRz:0.5,lL:-0.2,kL:0.5},
  tac:{aL:-2.8,aR:-2.8,eL:-0.5,eR:-0.5,lean:-0.15},
  tutus:{aL:-1.1,aR:-1.1,eL:-0.8,eR:-0.8},
  mars:{aR:-0.55,eR:-1.95,aRz:0.3,aL:0.02,aLz:-0.05},
  isaret:{aR:-2.2,eR:-0.1,aRz:0.4},
  /* maç eylemleri. Modelde L harfli kemikler (yerel −x) oyuncunun sağ tarafıdır; aşağıdakiler sağ ayak/kol içindir,
     sol ayaklı oyuncuda aynala() ile çevrilir */
  vurusGeri:{lean:0.06,lL:0.8,kL:1.3,lR:-0.12,kR:0.3,aL:0.35,aLz:-0.55,aR:-0.4,aRz:0.7,eL:-0.4,eR:-0.3,hx:0.18},
  vurusTakip:{lean:-0.28,lL:-1.35,kL:0.12,lR:0.22,kR:0.35,aL:-0.35,aLz:-0.9,aR:0.5,aRz:1.0,eL:-0.4,eR:-0.3,hx:0.2},
  pasGeri:{lean:0.04,lL:0.45,kL:0.7,lR:-0.08,kR:0.25,aL:0.2,aLz:-0.35,aR:-0.2,aRz:0.4,eL:-0.4,eR:-0.4,hx:0.2},
  pasTakip:{lean:-0.12,lL:-0.75,kL:0.2,lR:0.12,kR:0.3,aL:-0.2,aLz:-0.5,aR:0.3,aRz:0.55,eL:-0.4,eR:-0.4,hx:0.2},
  kontrol:{lean:0.12,lL:-0.35,kL:0.55,lR:0.05,kR:0.25,aLz:-0.35,aRz:0.35,hx:0.35},
  gogus:{lean:-0.32,aL:-0.4,aR:-0.4,aLz:-0.85,aRz:0.85,eL:-0.3,eR:-0.3,hx:0.3,lL:-0.1,kL:0.3,lR:0.1,kR:0.3},
  mudahale:{lean:-0.12,dy:-0.12,lL:-1.05,kL:0.15,lR:0.35,kR:0.95,aL:0.35,aR:-0.4,aLz:-0.6,aRz:0.6,eL:-0.5,eR:-0.5},
  blok:{lean:0.05,aL:0.15,aR:0.15,aLz:-0.12,aRz:0.12,eL:-2.3,eR:-2.3,lL:-0.2,kL:0.3,lR:0.2,kR:0.3},
  dusus:{aL:-2.2,aR:-2.2,eL:-0.2,eR:-0.2,lL:0.2,lR:-0.1,kL:0.4,kR:0.3,hx:-0.4},
  yerde:{aL:-2.6,aR:-0.4,aLz:-0.4,aRz:0.3,eL:-0.4,eR:-0.6,lL:0.1,kL:0.6,lR:-0.2,kR:0.2,hx:-0.3},
  yumruk:{aL:-3.0,aR:-3.0,eL:-0.05,eR:-0.05,dy:0.18,hx:-0.35,lL:-0.3,kL:0.6},
  elleAtis:{lean:0.15,aL:-2.2,eL:-0.2,aR:0.4,aRz:0.3,lL:0.2,lR:-0.4,kR:0.3},
  tacAt:{lean:0.25,aL:-1.1,aR:-1.1,eL:-0.4,eR:-0.4,lL:0.25,lR:-0.35,kL:0.2,kR:0.4},
  tasi:{aL:-0.85,aR:-0.85,eL:-0.9,eR:-0.9,aLz:0.15,aRz:-0.15},
  itiraz:{aL:-0.5,aR:-0.5,aLz:-0.7,aRz:0.7,eL:-1.25,eR:-1.25,hx:-0.15},
  /* T10f (T10 teşhisi hata 7'nin çizim kalıntısı): kullanılmayan hakem pozları (hakemDuduk, hakemYon, hakemAvantaj, hakemKart, hakemPenalti) ile eski shoot ve slide kaldırıldı; hakem işaretleri js/animasyon.js anmHkPoz'da */
  bayrak:{aR:-3.0,eR:0,aRz:0.05},
  tabela:{aL:-2.9,aR:-2.9,eL:-0.3,eR:-0.3,aLz:0.2,aRz:-0.2},
  /* maç günü: ısınma, tören, fotoğraf, maç sonu */
  esneme1:{lean:0.35,dy:-0.25,lL:-0.9,kL:1.1,lR:0.6,kR:0.2,aL:-0.2,aR:-0.2,aLz:-0.2,aRz:0.2},
  esneme2:{aL:-2.9,aR:-2.9,aLz:0.3,aRz:-0.3,eL:-0.2,eR:-0.2,lean:-0.05},
  tokalas:{aL:-1.1,eL:-0.35,aLz:0.15},
  comel:{dy:-0.45,lR:-1.5,kR:1.5,lL:0.1,kL:1.6,lean:0.1,aL:-0.7,eL:-0.9,aR:-0.7,eR:-0.9},
  fotoCek:{dy:-0.45,lR:-1.5,kR:1.5,lL:0.1,kL:1.6,lean:0.05,aL:-1.45,eL:-1.35,aR:-1.45,eR:-1.35,aLz:0.25,aRz:-0.25},
  foto:{aL:-0.35,aR:-0.35,eL:-1.9,eR:-1.9,aLz:0.25,aRz:-0.25},
  alkis:{aL:-1.0,aR:-1.0,eL:-1.0,eR:-1.0,aLz:0.35,aRz:-0.35},
  cember:{lean:0.45,aL:-1.6,aR:-1.6,aLz:-1.0,aRz:1.0,eL:-0.2,eR:-0.2,hx:0.3},
  yorgun:{lean:0.75,dy:-0.08,aL:-0.55,aR:-0.55,eL:-0.35,eR:-0.35,lL:-0.2,lR:-0.2,kL:0.35,kR:0.35,hx:-0.3}
};
/* sağ ayak/kol pozunu sol tarafa çevir: sağ-sol kanalları yer değiştirir; y ve z eksenli dönüşler (yana açma, burulma, kalça/gövde/baş dönüşü) işaret değiştirir */
const AYNA={lL:'lR',lR:'lL',kL:'kR',kR:'kL',aL:'aR',aR:'aL',eL:'eR',eR:'eL',aLz:'aRz',aRz:'aLz',lLz:'lRz',lRz:'lLz',lLy:'lRy',lRy:'lLy',aLy:'aRy',aRy:'aLy'},AYNA_ONBELLEK=new Map();
const AYNA_EKSI={aLz:1,aRz:1,lLz:1,lRz:1,lLy:1,lRy:1,aLy:1,aRy:1,hy:1,hz:1,gy:1,gz:1,by:1,bz:1};
function aynala(P){let A=AYNA_ONBELLEK.get(P);if(A)return A;A={};for(const k in P){const h=AYNA[k]||k;A[h]=AYNA_EKSI[k]?-P[k]:P[k];}AYNA_ONBELLEK.set(P,A);return A;}
/* formalar: kadrodaki forma adı → STIL.formalar */
const KIT=STIL.formalar;
const SAC_STILI={kisa:'short',kel:'bald',uzun:'long',mullet:'mullet',kivircik:'curly'};
/* kadro kaydından (js/kadrolar.js) model tarifi */
function kitKaydi(forma,k,num){return{...KIT[forma],num,skin:STIL.tenler[k.ten||0],hair:k.sacRenk||'#241a12',mus:k.biyik,beard:k.sakal,style:SAC_STILI[k.sac]||'short',h:k.boy||1,w:k.yapi||1,boots:k.krampon,rolled:k.sirik,
  sekil:sekilKur(k)};}   /* A5: kimlikten biçim (omuz, bel, kalça, baldır) */
