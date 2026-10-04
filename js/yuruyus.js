/* ============ Chairman — başkanın beden hareketi: kalkış, adım, oturma, el işi (yalnız sunum; yol haritası N6) ============
   Kullanıcı kararı 2026-10-04: odadan balkona yürüyüş, masaya oturma ve locaya giriş ani değil, adım adım ve insan gibi olur.
   Buradaki işlevler saf hesaplardır (durum tutmaz, sahneye dokunmaz); kamera yolunu kuran dosya (js/oda.js; sonra js/loca-giris.js) çağırır.
   İlke: göz konumu, hızı ve ivmesi süreklidir (yrYumusak: en az sarsıntılı geçiş). Süs hareketi ve kamera sallantısı yoktur; yalnız gerçek
   adımın küçük iniş-çıkışı ve ağırlık aktarımı vardır (2026-10-02'deki “yalpa yok” ayrıntısının yerini alır). Ayarlar STIL.yuruyus (TEST).
     yrYumusak(x)                     0→1 geçiş; başta ve sonda hız ve ivme sıfır
     yrKalk(s, P0, P1, ileri, out)    kalkış (s 0→1): otururken göz P0 → ayakta göz P1; önce öne eğilir, sonra iter, doğrulur ve yerine adım atar
     yrOtur(s, P0, P1, ileri, out)    oturma (s 0→1): ayakta göz P0 → otururken göz P1; yerine geçer, öne eğilerek alçalır, en son yaslanır
     yrAdimBoyu(v)                    hıza göre adım boyu (m): yavaşken kısa adım
     yrAdim(faz, zarf, yon, P)        adımın göze etkisi: dikey iniş-çıkış ve yana ağırlık aktarımı (faz: adım sayısı, kesirli; zarf 0–1)
     yrElKur(malzeme)                 kol + manşet + el; ön kol +z'ye uzanır, bilek kökte. {g, parmak}
     yrElYolu(s, bas, hedef, out)     elin bir nesneye uzanıp dönmesi (s 0→1): tut anında hedeftedir; dönen değer uzanma oranı (0–1)
   Yol planlayıcısı (N11, 2026-10-04; js/oda.js'ten ortaklaştı, oda yürüyüşü aynen kullanır; locaya giriş de kullanır):
     yrYolKur(noktalar, ayar)         noktalardan geçen yuvarlatılmış yolun zaman çizelgesi. ayar: {hiz, viraj, ivme, merdiven: [[bas, son], …]
                                      (yol metresi), merdivenHiz, basamak: {derinlik, yukseklik}}. Döner: {egri, Q, L, D, VZ, FZ, DTS, yuru (sn)}.
                                      Merdivende hız düşer, adım basamaktır (her adımda bir basamak).
     yrAra(D, x)                      sıralı dizide x'in aralığı ve kesri
     yrYolda(Y, d, P, yon)            yolda d metredeki nokta ve yön
     yrIleri(Y, d, cikis, ileri)      yürürken bakış: yolun ileri metre (varsayılan 2,5) ilerisine, biraz aşağı
     yrYuruAn(Y, t, P, B)             yürüyüşün t. saniyesinde göz (adımın iniş-çıkışı ve ağırlık aktarımıyla) ve bakış; döner: yol metresi */
const YR=STIL.yuruyus;
const yrYumusak=x=>{x=x<0?0:x>1?1:x;return x*x*x*(10+x*(6*x-15));};
function yrKalk(s,P0,P1,ileri,out){
  const K=YR.kalk,eg=yrYumusak(s/K.egilPay)*(1-yrYumusak((s-K.egilPay)/(1-K.egilPay)));
  const yuk=yrYumusak((s-K.egilPay*0.55)/(1-K.egilPay*0.55)),yat=yrYumusak((s-K.adimPay)/(1-K.adimPay));
  return out.set(P0.x+(P1.x-P0.x)*yat+ileri.x*K.egil*eg,P0.y+(P1.y-P0.y)*yuk-K.cok*eg,P0.z+(P1.z-P0.z)*yat+ileri.z*K.egil*eg);
}
function yrOtur(s,P0,P1,ileri,out){
  const O=YR.otur,yat=yrYumusak(s/O.yerPay),al=yrYumusak((s-O.basla)/(O.yaslan-O.basla));
  /* alçalırken gövde öne eğilir (çan biçimli); oturunca biraz önde kalır, en son yaslanır */
  const eg=Math.sin(Math.PI*al),on=al*(1-yrYumusak((s-O.yaslan)/(1-O.yaslan))),k=O.egil*eg+O.geri*on;
  return out.set(P0.x+(P1.x-P0.x)*yat+ileri.x*k,P0.y+(P1.y-P0.y)*al-O.cok*eg,P0.z+(P1.z-P0.z)*yat+ileri.z*k);
}
function yrAdimBoyu(v){const A=YR.adim;return A.boy*(0.6+0.4*Math.min(1,v/A.hiz));}
function yrAdim(faz,zarf,yon,P){
  const A=YR.adim,z=yrYumusak(zarf),yanal=Math.sin(Math.PI*faz)*A.yanal*z;
  /* her adımın ortasında (tek ayak üstünde) göz en yüksekte, ayak basarken en alçakta: düzgün dalga (köşesiz; baş bedenden yumuşak hareket eder).
     Ağırlık basan ayağın yanına kayar (iki adımda bir tam salınım) */
  P.y-=Math.cos(2*Math.PI*faz)*A.dikey*0.5*z;P.x-=yon.z*yanal;P.z+=yon.x*yanal;
  return P;
}
function yrElKur(M){
  const g=new THREE.Group(),B=STIL.baskan,kol=M({color:B.takim}),ten=M({color:B.ten});
  box(0.096,0.074,0.52,kol,0,0.004,0.29,g);box(0.1,0.078,0.03,M({color:0xf2f0ea}),0,0.004,0.03,g);box(0.08,0.03,0.095,ten,0,-0.008,-0.058,g);
  const parmak=new THREE.Group();parmak.position.set(0,-0.01,-0.105);g.add(parmak);box(0.078,0.024,0.07,ten,0,-0.002,-0.034,parmak);
  g.rotation.order='YXZ';g.visible=false;return{g,parmak};
}
function yrElYolu(s,bas,hedef,out){
  const E=YR.el,u=s<E.tut?yrYumusak(s/E.tut):s<E.tut+E.bekle?1:1-yrYumusak((s-E.tut-E.bekle)/(1-E.tut-E.bekle));
  out.lerpVectors(bas,hedef,u);out.y+=Math.sin(Math.PI*u)*E.kavis;return u;
}
/* ---- yol planlayıcısı (N11'de js/oda.js'ten ortaklaştı; sayısal davranış aynı) ---- */
function yrAra(D,x){let a=0,b=D.length-1;if(x<=D[0])return[1,0];if(x>=D[b])return[b,1];while(b-a>1){const m=(a+b)>>1;if(D[m]<=x)a=m;else b=m;}return[b,(x-D[a])/Math.max(1e-9,D[b]-D[a])];}
const yrMerdivende=(A,d)=>!!A.merdiven&&A.merdiven.some(([a,b])=>d>=a&&d<=b);
function yrYolKur(W,A){
  /* eğri: konum ve yön doğrudan eğriden okunur (köşesiz); Q sık örneklenir (hız ve zaman çizelgesi için; kare başına birden çok nokta) */
  const egri=new THREE.CatmullRomCurve3(W,false,'centripetal');egri.arcLengthDivisions=1200;
  const Q=egri.getSpacedPoints(640),L=[0],K=12;
  for(let i=1;i<Q.length;i++)L.push(L[i-1]+Q[i].distanceTo(Q[i-1]));
  const top=L[L.length-1],n=Q.length,V=[];
  /* hız: dönüşün keskinliğiyle (yön değişimi / metre) azalır; merdivende daha yavaş */
  for(let i=0;i<n;i++){const a=Q[Math.max(0,i-K)],b=Q[i],c=Q[Math.min(n-1,i+K)],u1=b.clone().sub(a),u2=c.clone().sub(b);
    const e=u1.lengthSq()>1e-8&&u2.lengthSq()>1e-8?u1.angleTo(u2)/Math.max(0.05,L[Math.min(n-1,i+K)]-L[Math.max(0,i-K)]):0;
    V.push(Math.min(A.hiz/(1+A.viraj*e),yrMerdivende(A,L[i])?A.merdivenHiz:Infinity));}
  /* ivme sınırı: durmadan başlar, durarak biter; dönüşe girerken önceden yavaşlar, çıkarken yeniden hızlanır (ileri ve geri geçiş) */
  V[0]=V[n-1]=0.04;
  for(let i=1;i<n;i++)V[i]=Math.min(V[i],Math.sqrt(V[i-1]*V[i-1]+2*A.ivme*(L[i]-L[i-1])));
  for(let i=n-2;i>=0;i--)V[i]=Math.min(V[i],Math.sqrt(V[i+1]*V[i+1]+2*A.ivme*(L[i+1]-L[i])));
  /* zaman çizelgesi: yol 1/240 sn'lik adımlarla yürünür; hız yolun izin verdiği hıza ivme sınırıyla yaklaşır (hız sürekli, sıçrama yok).
     D = yol (m), VZ = hız, FZ = adım fazı (adım boyu hızla değiştiği için biriktirilir; merdivende adım bir basamaktır); hepsi zamana göre eşit aralıklı */
  const DTS=1/240,D=[0],VZ=[0],FZ=[0],B=A.basamak,mAdim=B?Math.hypot(B.derinlik,B.yukseklik):0;let d=0,v=0;
  while(d<top-1e-7&&D.length<240*40){const [i,s]=yrAra(L,d),vt=V[i-1]+(V[i]-V[i-1])*s;
    v=Math.max(0.03,v+Math.max(-1.6*A.ivme*DTS,Math.min(A.ivme*DTS,vt-v)));d=Math.min(top,d+v*DTS);
    D.push(d);VZ.push(v);FZ.push(FZ[FZ.length-1]+v*DTS/(B&&yrMerdivende(A,d)?mAdim:yrAdimBoyu(v)));}
  return{egri,Q,L,D,VZ,FZ,DTS,yuru:(D.length-1)*DTS};
}
function yrYolda(Y,d,P,yon){const u=Math.min(1,Math.max(0,d/Y.L[Y.L.length-1]));Y.egri.getPointAt(u,P);Y.egri.getTangentAt(u,yon);}
function yrIleri(Y,d,cikis,ileri){const I=ileri===undefined?2.5:ileri,P=new THREE.Vector3(),yon=new THREE.Vector3(),toplam=Y.L[Y.L.length-1];yrYolda(Y,Math.min(toplam,d+I),P,yon);
  if(d+I>toplam)P.addScaledVector(yon,d+I-toplam);return cikis.set(P.x,P.y-0.3,P.z);}
/* yürüyüşün t. saniyesi: zaman çizelgesinden; her adımda küçük iniş-çıkış, ağırlık aktarımı ve ilerlemenin hafif nabzı */
function yrYuruAn(Y,t,P,B,ileri){
  const toplam=Y.L[Y.L.length-1],k=Math.min(Y.D.length-1-1e-9,Math.max(0,t)/Y.DTS),i=Math.floor(k),s=k-i,ara=Z=>Z[i]+(Z[i+1]-Z[i])*s;
  const faz=ara(Y.FZ),v=ara(Y.VZ),zarf=Math.max(0,Math.min(1,faz,Y.FZ[Y.FZ.length-1]-faz));
  const d=Math.min(toplam,Math.max(0,ara(Y.D)+YR.adim.nabiz*yrAdimBoyu(v)*Math.sin(2*Math.PI*faz)*yrYumusak(zarf))),yon=new THREE.Vector3();
  yrYolda(Y,d,P,yon);yrAdim(faz,zarf,yon,P);if(B)yrIleri(Y,d,B,ileri);return d;
}
