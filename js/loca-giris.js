/* ============ Chairman — locaya giriş ve rakip başkan (yol haritası 2.8T; yalnız sunum) ============
   Kullanıcı kararı 2026-10-03 (ikinci paket): maç öncesi ekranında “Maça geç”ten sonra başkan kulüp binasının merdiveninden çıkar, kapıdan
   locaya girer, rakip kulübün başkanıyla tokalaşır ve yavaşça yerine oturur. Atlanabilir: maç görüntüsüne tıklamak, Esc ya da “Santraya geç”.
   Maç günü yürüyüş sırasında durmaz (tören başında sakindir; kaleciler ~15. saniyede çıkar); yürüyüş yalnız kameradır ve motoru okumaz bile.
   Sırada ON_EKRAN.sayfa 'loca'dır: dürbün ve masadaki telefon kapalıdır (js/arayuz.js, js/ekran-mac-telefon.js).
   Duraklatmada (kare dt 0) yürüyüş olduğu yerde durur. Merdiven, kapı, sahanlık, iki koltuk ve rakip başkan ilk yürüyüşte kurulur (tembel kurulum):
   ?ekran=mac ile açılan denemelerde (an-yakala, akış) sahne ve yüklemedeki rastlantı tüketimi değişmez. Rakip başkanın adı ve sözü yoktur.
   Ölçüler ve süreler STIL.locaGiris'tedir (TEST değerleri).
     locaGirisBaslat()   yürüyüşü başlatır (js/ekran-mac-oncesi.js ilerle)
     locaGirisKare(dt)   ilerletir (js/arayuz.js frame)
     locaGirisKamera()   kamerayı yürüyüşün yerine koyar (js/kamera.js kameraUygula)
     locaGirisBitir()    atlar: başkan oturmuş, bakış sahada */
const LG=STIL.locaGiris;
const LOCA_GIRIS={aktif:false,kuruldu:false,t:0,yol:null,kapi:null,rakip:null,tokalasti:false,P:new THREE.Vector3(),B:new THREE.Vector3()};
/* ---- kurulum: arka duvarda kapı boşluğu, kapının ardında sahanlık ve aşağı inen merdiven, başkanın ve rakibin koltuğu, rakip başkan ---- */
function locaGirisKur(){
  const L=LOCA,G=LOCA_GIRIS;if(G.kuruldu||!L)return;G.kuruldu=true;
  const kok=L.arka.parent,b=L.beton,k=L.koyu,z0=L.on-L.D,K=LG.kapi,y0=L.zemin,kutu=(w,h,d,m,x,y,z)=>box(w,h,d,m,x,y,z,kok);
  /* arka duvar kapı boşluğuyla yeniden: sol ve sağ parça, kapının üstü */
  L.arka.visible=false;
  const x0=K.x-K.en/2,x1=K.x+K.en/2,sol=-L.W/2,sag=L.W/2;
  kutu(x0-sol,2.8,0.25,k,(sol+x0)/2,y0+1.4,z0);kutu(sag-x1,2.8,0.25,k,(x1+sag)/2,y0+1.4,z0);kutu(K.en,2.8-K.boy,0.25,k,K.x,y0+K.boy+(2.8-K.boy)/2,z0);
  const cerceve=LAM({color:LG.renk.cerceve});for(const x of[x0,x1])kutu(0.08,K.boy,0.3,cerceve,x,y0+K.boy/2,z0);kutu(K.en+0.16,0.08,0.3,cerceve,K.x,y0+K.boy,z0);
  /* kanat: menteşe locanın içine açılır */
  const kanat=new THREE.Group();kanat.position.set(x0,y0,z0+0.12);kok.add(kanat);box(K.en,K.boy,0.05,LAM({color:LG.renk.kapi}),K.en/2,K.boy/2,0,kanat);
  box(0.03,0.03,0.08,LAM({color:STIL.baskan.pirinc}),K.en-0.1,1.02,0.05,kanat);G.kapi=kanat;
  /* sahanlık ve merdiven: kapının ardında, binanın içinde; iki yan duvar ve tavan; lambalı */
  const S=LG.merdiven,ic=LAM({color:LG.renk.ic}),zs=z0-0.12-S.sahanlik;
  kutu(K.en+0.6,0.2,S.sahanlik,b,K.x,y0-0.1,z0-0.12-S.sahanlik/2);
  for(let i=0;i<S.basamak;i++){const yy=y0-(i+1)*S.yukseklik,zz=zs-(i+0.5)*S.derinlik;kutu(K.en+0.6,S.yukseklik,S.derinlik,b,K.x,yy+S.yukseklik/2-0.1,zz);}
  const boy=S.basamak*S.derinlik+S.sahanlik+0.2,zm=z0-0.12-boy/2,alt=y0-S.basamak*S.yukseklik;
  for(const sx of[-1,1])kutu(0.15,3.2+S.basamak*S.yukseklik,boy,ic,K.x+sx*(K.en/2+0.35),alt+(3.2+S.basamak*S.yukseklik)/2-0.2,zm);
  kutu(K.en+0.85,0.12,boy,ic,K.x,y0+2.9,zm);kutu(K.en+0.85,3.2+S.basamak*S.yukseklik,0.15,ic,K.x,alt+1.4,z0-0.12-boy);
  const lamba=new THREE.PointLight(0xfff0d8,0.9,7);lamba.position.set(K.x,y0+2.5,z0-1.4);kok.add(lamba);
  /* koltuklar: başkanınki (otururken görünmez) ve yanında rakibinki */
  const deri=LAM({color:LG.renk.koltuk}),ayak=LAM({color:0x2a2c33});
  const koltuk=x=>{const g=new THREE.Group();box(0.56,0.1,0.5,deri,0,0.46,0,g);box(0.56,0.62,0.1,deri,0,0.82,-0.24,g);box(0.06,0.42,0.06,ayak,0,0.21,0,g);
    g.position.set(x,y0,L.on-0.55);kok.add(g);return g;};
  koltuk(0);koltuk(LG.rakip.x);
  /* rakip başkan: takım elbiseli insan modeli; yüzü locanın içine dönük ayakta bekler, tokalaştıktan sonra oturur */
  const R=player(kitKaydi('takimElbise',LG.rakip.gorunus,0));R.root.rotation.order='YXZ';kok.add(R.root);
  R.root.position.set(LG.rakip.x,y0,L.on-LG.rakip.bekle);G.rakip=R;
}
/* ---- yol: [zaman, nokta] anahtarları; konum yumuşak eğriyle, bakış anahtarlar arasında yumuşak geçişle ---- */
function locaGirisYolu(){
  const L=LOCA,K=LG.kapi,S=LG.merdiven,y0=L.zemin,z0=L.on-L.D,goz=LG.goz,V=(x,y,z)=>new THREE.Vector3(x,y,z),koltuk=BASKAN_KOLTUGU;
  const zs=z0-0.12-S.sahanlik,dip=y0-S.basamak*S.yukseklik,rx=LG.rakip.x,rz=L.on-LG.rakip.bekle;
  const otur=V(koltuk.x,koltuk.y+STIL.kameralar.baskan.goz,koltuk.z),ayak=V(koltuk.x,y0+goz,koltuk.z-0.25);
  const nokta=[V(K.x,dip+goz,zs-S.basamak*S.derinlik+0.2),V(K.x,y0+goz,zs+0.1),V(K.x,y0+goz,z0+0.9),V((K.x+rx)/2,y0+goz,rz-1.3),V(rx+0.18,y0+goz,rz-1.35),ayak];
  const egri=new THREE.CatmullRomCurve3(nokta,false,'centripetal');
  /* zaman → eğri parametresi anahtarları (i/5: i. noktada); sonra oturma: ayakta yerden koltuğa yavaşça iner */
  const T=LG.sure,U=[[0,0],[T.merdiven,1/5],[T.kapi,2/5],[T.rakip,4/5],[T.tokalas,4/5],[T.yer,1]];
  const ust=V(K.x,y0+goz,z0+4),rakipYuz=V(rx,y0+1.62,rz),rakipEl=V(rx+0.22,y0+1.42,rz-0.4),saha=V(koltuk.x,0,koltuk.z+40);
  /* bakış anahtarları: merdivende yukarı, kapıdan içeri, rakibin yüzüne, tokalaşırken ele ve yüze, sonra sahaya */
  const B=[[0,V(K.x,y0+1.4,z0)],[T.merdiven*0.8,V(K.x,y0+1.5,z0+1)],[T.kapi,ust],[T.kapi+0.6,rakipYuz],[T.rakip+0.3,rakipEl],[T.tokalas-0.4,rakipYuz],[T.yer,saha],[T.otur,saha]];
  return{egri,U,B,otur,ayak,toplam:T.otur};
}
const lgYumusak=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x);};
function lgAnahtar(A,t,f){let i=0;while(i<A.length-2&&t>A[i+1][0])i++;const [t0,a]=A[i],[t1,b]=A[i+1];return f(a,b,lgYumusak((t-t0)/Math.max(1e-6,t1-t0)));}
/* t anındaki göz ve bakış */
function locaGirisAni(t,P,B){
  const Y=LOCA_GIRIS.yol,T=LG.sure;
  if(t<T.yer){const u=lgAnahtar(Y.U,t,(a,b,s)=>a+(b-a)*s);Y.egri.getPoint(Math.min(1,u),P);
    /* adım hissi: yürürken küçük iniş-çıkış (yana yalpa yok); merdivende basamak başına bir adım */
    const yuruyor=!(t>T.rakip&&t<T.tokalas);if(yuruyor)P.y+=(Math.abs(Math.sin(u*Y.egri.getLength()*Math.PI/0.62))-0.5)*0.012;}
  else{/* oturma: ayakta yerden koltuğa yavaşça iner */
    const s=lgYumusak((t-T.yer)/(T.otur-T.yer));P.lerpVectors(Y.ayak,Y.otur,s);P.y=Y.ayak.y+(Y.otur.y-Y.ayak.y)*Math.sin(s*Math.PI/2);}
  lgAnahtar(Y.B,Math.min(t,T.otur),(a,b,s)=>B.lerpVectors(a,b,s));
}
function locaGirisBaslat(){
  if(!LOCA||!BASKAN_KOLTUGU)return;
  locaGirisKur();const G=LOCA_GIRIS;
  G.aktif=true;G.t=0;G.tokalasti=false;G.yol=locaGirisYolu();ON_EKRAN.sayfa='loca';
  pose(G.rakip,{});G.rakip.root.position.set(LG.rakip.x,LOCA.zemin,LOCA.on-LG.rakip.bekle);G.rakip.root.rotation.y=LG.rakip.yon;
  btnBino.disabled=true;
  locaGirisKare(0);
}
/* rakip başkan: tokalaşırken eli uzanır, sonra koltuğuna döner ve oturur */
function lgRakip(t){
  const G=LOCA_GIRIS,R=G.rakip,T=LG.sure,y0=LOCA.zemin,rz=LOCA.on-LG.rakip.bekle;
  if(t<T.rakip-0.3)pose(R,{});
  else if(t<T.tokalas){pose(R,POSE.tokalas);const a=t>T.rakip+0.55&&t<T.tokalas-0.5?Math.sin((t-T.rakip)*17)*0.08:0;R.aL.rotation.x+=a;}
  else{const s=lgYumusak((t-T.tokalas)/1.6);pose(R,s<0.5?{}:POSE.otur);R.root.position.set(LG.rakip.x,y0,rz+(LOCA.on-0.55-rz)*s);R.root.rotation.y=LG.rakip.yon+(LG.rakip.oturYon-LG.rakip.yon)*s;}
}
function locaGirisKare(dt){
  const G=LOCA_GIRIS;if(!G.aktif)return;
  G.t+=dt;const t=G.t,T=LG.sure;
  if(t>=T.rakip&&!G.tokalasti){G.tokalasti=true;baskanEylem('tokalas',9);}
  lgRakip(t);
  /* kapı: başkan yaklaşınca açılır, geçince kapanır */
  locaGirisAni(t,G.P,G.B);
  const dz=G.P.z-(LOCA.on-LOCA.D),ac=1-lgYumusak((Math.abs(dz)-0.6)/1.4);G.kapi.rotation.y=-1.6*ac;
  /* ön plan: masa yok, eller yalnız tokalaşırken (sağ el) görünür; otururken masa yerine gelir */
  const otur=t>T.yer+(T.otur-T.yer)*0.55;
  BK_MASA.visible=otur;BK_EL.sol.g.visible=otur;BK_EL.sag.g.visible=otur||!!(BASKAN.eylem&&BASKAN.eylem.ad==='tokalas');
  if(t>=T.otur)locaGirisBitir();
}
function locaGirisKamera(){
  const G=LOCA_GIRIS;camera.position.copy(G.P);camera.lookAt(G.B);
  if(Math.abs(camera.fov-LG.aci)>1e-6){camera.fov=LG.aci;camera.updateProjectionMatrix();}
}
/* bitiş ya da atlama: rakip oturur, başkan koltuğunda, kamera maçın bakışına hizalanır, düğmeler açılır */
function locaGirisBitir(){
  const G=LOCA_GIRIS;if(!G.aktif)return;
  G.aktif=false;G.t=LG.sure.otur;lgRakip(LG.sure.tokalas+2);G.kapi.rotation.y=0;
  BK_MASA.visible=true;BK_EL.sol.g.visible=true;BK_EL.sag.g.visible=true;if(BASKAN.eylem&&BASKAN.eylem.ad==='tokalas')BASKAN.eylem=null;
  if(ON_EKRAN.sayfa==='loca')ON_EKRAN.sayfa=null;
  btnBino.disabled=duraklatmaVar();
  kameraOturt();
}
/* atlama: maç görüntüsüne tıklamak ya da Esc; “Santraya geç” önce yürüyüşü bitirir */
hud.addEventListener('click',e=>{if(LOCA_GIRIS.aktif&&!duraklatmaVar()){e.stopImmediatePropagation();locaGirisBitir();}},true);
addEventListener('keydown',e=>{if(e.code==='Escape'&&LOCA_GIRIS.aktif&&!duraklatmaVar()){e.preventDefault();locaGirisBitir();}});
{const eski=btnMacaGec.onclick;btnMacaGec.onclick=()=>{locaGirisBitir();eski();};}
