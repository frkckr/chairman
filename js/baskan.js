/* ============ Chairman — başkanın bedeni: önündeki masa, elleri ve eşyaları (ön plan katmanı) ============
   Dünya çizildikten sonra derinlik temizlenir ve bu katman üstüne çizilir. Böylece masa ve eller her zaman ekranın altında durur.
   Eller maçtaki olaylara tepki verir: gol sevinci (başkan ayağa kalkar), yenilen golde eller başa, kaçan pozisyonda masaya yumruk,
   itiraz, alkış. Sakin anlarda telefonuna bakar. Dürbünü elleriyle kaldırır. Çay 2.8A'da, masadaki maç programı 2.8O'da kaldırıldı. */
const BK=STIL.baskan;
const BASKAN={sahne:new THREE.Scene(),kamera:new THREE.PerspectiveCamera(BK.aci,RW/RH,0.02,6),eylem:null,kuyruk:[],bosT:12,
  kalk:0,kalkHedef:0,sarsinti:0,durbunDurum:0,durbunHedef:0,durbunHazir:null};
{const S=BASKAN.sahne;S.add(new THREE.AmbientLight(0x7a7064,1.1));
 const d=new THREE.DirectionalLight(0xffe4bc,0.75);d.position.set(0.4,2,1.2);S.add(d);
 const f=new THREE.DirectionalLight(0x9fb0d8,0.25);f.position.set(-1,0.5,-1);S.add(f);}
const BK_MASA=new THREE.Group();BASKAN.sahne.add(BK_MASA);
/* ---- masa: ceviz, pirinç kenar şeridi, ortada bordo deri sümen ---- */
{const cv=mk(32,16),g=cv.getContext('2d');g.fillStyle=BK.masa;g.fillRect(0,0,32,16);
 for(let y=0;y<16;y++){g.fillStyle=h2(y,3)>0.5?BK.masaKoyu:BK.masaAcik;g.fillRect(((h2(y,9)*32)|0),y,8+((h2(y,5)*14)|0),1);}
 const ust=box(2.6,0.06,1.1,LAM({map:tx(cv,'n',[5,2])}),0,-0.5,-0.95,BK_MASA);ust.name='masa';
 box(2.6,0.026,0.03,LAM({color:BK.pirinc}),0,-0.468,-1.5,BK_MASA);
 box(0.5,0.008,0.32,LAM({color:BK.sumen}),-0.02,-0.466,-1.2,BK_MASA);}
/* maç programı (beyaz kitapçık) 2.8O'da kaldırıldı (kullanıcı kararı 2026-10-02): masada yalnız sümen ve telefon durur */
/* ---- telefon: ekranı yanınca skoru ve saati gösterir ---- */
const BK_TEL=new THREE.Group();BK_TEL.position.set(0.14,-0.463,-1.08);BK_TEL.rotation.y=-0.3;BK_MASA.add(BK_TEL);
const BK_TEL_CV=mk(16,32),BK_TEL_TX=tx(BK_TEL_CV,'n'),BK_TEL_EKRAN=BAS({map:BK_TEL_TX,color:0x333333});
{BK_TEL.add(new THREE.Mesh(new THREE.BoxGeometry(0.072,0.01,0.148),LAM({color:0x1a1b1f})));
 const e=new THREE.Mesh(new THREE.PlaneGeometry(0.062,0.13),BK_TEL_EKRAN);e.rotation.x=-Math.PI/2;e.position.y=0.0055;BK_TEL.add(e);}
function telefonYaz(){const g=BK_TEL_CV.getContext('2d');g.fillStyle='#0a1a2a';g.fillRect(0,0,16,32);g.fillStyle='#1c4a7a';g.fillRect(0,0,16,6);
  const dk=typeof mac!=='undefined'?mac.minuteLabel():'';ctxText(g,dk||'--',1,0,'#f4f4f4',1);
  ctxText(g,String(mac.score[0]),3,10,'#ffffff',1);ctxText(g,String(mac.score[1]),10,10,'#ffffff',1);ctxText(g,'-',6,10,'#9ab',1);
  g.fillStyle='#c8281e';g.fillRect(2,20,5,2);g.fillStyle='#22347a';g.fillRect(9,20,5,2);BK_TEL_TX.needsUpdate=true;}
/* ---- eller: lacivert kol, beyaz manşet, kutu el, parmaklar, başparmak; solda saat ---- */
function elKur(taraf){
  const g=new THREE.Group(),sx=taraf==='sol'?-1:1,kol=LAM({color:BK.takim}),ten=LAM({color:BK.ten});
  box(0.096,0.074,0.52,kol,0,0.004,0.29,g);box(0.1,0.078,0.03,LAM({color:0xf2f0ea}),0,0.004,0.03,g);
  box(0.08,0.03,0.095,ten,0,-0.008,-0.058,g);
  const parmak=new THREE.Group();parmak.position.set(0,-0.01,-0.105);g.add(parmak);box(0.078,0.024,0.07,ten,0,-0.002,-0.034,parmak);
  const bas=box(0.024,0.022,0.056,ten,-sx*0.046,0.0,-0.066,g);bas.rotation.y=sx*0.4;
  if(taraf==='sol'){box(0.1,0.08,0.018,LAM({color:0x2a1c12}),0,0.004,0.004,g);box(0.04,0.01,0.04,LAM({color:BK.saat}),0,0.047,0.004,g);box(0.026,0.004,0.026,LAM({color:0xf2eee0}),0,0.053,0.004,g);}
  BASKAN.sahne.add(g);return{g,parmak};
}
const BK_EL={sol:elKur('sol'),sag:elKur('sag')};
/* ---- dürbün: iki tüp ve köprü; yalnız kaldırılırken görünür ---- */
const BK_DURBUN=new THREE.Group();BK_DURBUN.visible=false;BASKAN.sahne.add(BK_DURBUN);
{const m=LAM({color:0x1e1f22});for(const sx of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.036,0.04,0.13,10),m);c.rotation.x=Math.PI/2;c.position.set(sx*0.045,0,0);BK_DURBUN.add(c);}
 box(0.05,0.02,0.04,m,0,0,0.02,BK_DURBUN);}

/* ---- pozlar: bilek konumu p, dönüşü r (Euler), parmak kıvrımı k ---- */
const BKP=(x,y,z,rx,ry,rz,k)=>({p:[x,y,z],r:[rx||0,ry||0,rz||0],k:k||0});
const BK_DINLEN={sol:BKP(-0.3,-0.434,-0.99,0,0.55,0,0.22),sag:BKP(0.29,-0.434,-0.98,0,-0.5,0,0.28)};
function bkKaristir(a,b,t){const s=t*t*(3-2*t),l=(u,v)=>u.map((x,i)=>x+(v[i]-x)*s);return{p:l(a.p,b.p),r:l(a.r,b.r),k:a.k+(b.k-a.k)*s};}
/* anahtar kareler: [zaman(sn), {sol?, sag?}] — verilmeyen el dinlenme pozunda kalır */
function bkAnahtar(keys,t){
  const out={};for(const el of['sol','sag']){
    const K=keys.map(([tt,v])=>[tt,v[el]||BK_DINLEN[el]]);let i=0;while(i<K.length-1&&t>K[i+1][0])i++;
    if(i>=K.length-1){out[el]=K[K.length-1][1];continue;}const [t0,a]=K[i],[t1,b]=K[i+1];out[el]=bkKaristir(a,b,clamp((t-t0)/Math.max(1e-3,t1-t0),0,1));}
  return out;}
const BK_EYLEM={
  telefon:{sure:3.6,keys:[[0,{}],[0.5,{sag:BKP(0.105,-0.433,-0.965,0,-0.3,0,0.6)}],[1.0,{sag:BKP(0.05,-0.27,-0.6,1.05,-0.1,0,0.55)}],[2.8,{sag:BKP(0.05,-0.27,-0.6,1.05,-0.1,0,0.55)}],[3.3,{sag:BKP(0.105,-0.433,-0.965,0,-0.3,0,0.6)}],[3.6,{}]],telefon:[0.5,3.3]},
  alkis:{sure:2.2,keys:[[0,{}],[0.35,{sol:BKP(-0.08,-0.3,-0.78,0,0,-1.2,0.1),sag:BKP(0.08,-0.3,-0.78,0,0,1.2,0.1)}],[1.85,{sol:BKP(-0.08,-0.3,-0.78,0,0,-1.2,0.1),sag:BKP(0.08,-0.3,-0.78,0,0,1.2,0.1)}],[2.2,{}]],alkis:[0.35,1.85]},
  golBiz:{sure:4.2,keys:[[0,{}],[0.3,{sol:BKP(-0.3,0.08,-0.72,1.3,0,0.2,1),sag:BKP(0.3,0.08,-0.72,1.3,0,-0.2,1)}],[3.4,{sol:BKP(-0.3,0.1,-0.72,1.3,0,0.2,1),sag:BKP(0.3,0.1,-0.72,1.3,0,-0.2,1)}],[4.2,{}]],kalk:[0.2,3.6],salla:[0.3,3.4]},
  golYedik:{sure:3.4,keys:[[0,{}],[0.6,{sol:BKP(-0.36,0.3,-0.26,2.3,0.4,0.6,0.3),sag:BKP(0.36,0.3,-0.26,2.3,-0.4,-0.6,0.3)}],[2.6,{sol:BKP(-0.36,0.28,-0.26,2.25,0.4,0.6,0.3),sag:BKP(0.36,0.28,-0.26,2.25,-0.4,-0.6,0.3)}],[3.4,{}]]},
  yumruk:{sure:1.3,keys:[[0,{}],[0.4,{sag:BKP(0.22,-0.26,-1.0,0.3,-0.3,0,1)}],[0.55,{sag:BKP(0.22,-0.43,-1.05,0,-0.3,0,1)}],[0.9,{sag:BKP(0.22,-0.43,-1.05,0,-0.3,0,1)}],[1.3,{}]],vur:0.55},
  itiraz:{sure:1.8,keys:[[0,{}],[0.45,{sol:BKP(-0.3,-0.33,-0.92,0,0.3,-2.7,0.05),sag:BKP(0.3,-0.33,-0.92,0,-0.3,2.7,0.05)}],[1.3,{sol:BKP(-0.32,-0.3,-0.9,0,0.3,-2.8,0.05),sag:BKP(0.32,-0.3,-0.9,0,-0.3,2.8,0.05)}],[1.8,{}]]},
  durbunKaldir:{sure:0.5,keys:[[0,{}],[0.5,{sol:BKP(-0.09,-0.1,-0.4,1.35,0.3,0,0.8),sag:BKP(0.09,-0.1,-0.4,1.35,-0.3,0,0.8)}]],durbun:true,kal:true},
  durbunIndir:{sure:0.5,keys:[[0,{sol:BKP(-0.09,-0.1,-0.4,1.35,0.3,0,0.8),sag:BKP(0.09,-0.1,-0.4,1.35,-0.3,0,0.8)}],[0.5,{}]],durbun:true}
};
/* ---- tepkiler: maç olaylarından gelir (js/mac-sahnesi.js → baskanOlay) ---- */
function baskanEylem(ad,oncelik){
  const e=BASKAN.eylem;if(e&&(e.oncelik>=(oncelik||1)||e.ad.startsWith('durbun')))return;
  BASKAN.eylem={ad,t:0,oncelik:oncelik||1,...BK_EYLEM[ad]};}
function baskanOlay(ad,v){
  if(ad==='goal')baskanEylem(v.team===0?'golBiz':'golYedik',5);
  else if(ad==='kickoff'&&mac.half===1)baskanEylem('alkis',2);
  else if(ad==='wood'&&v.p&&v.p.team===0)baskanEylem('yumruk',3);
  else if(ad==='save'&&v.p&&v.p.team===1&&rnd()<0.45)baskanEylem('yumruk',3);
  /* aleyhimize karar (faul, kart, ofsayt): başkan itiraz eder */
  else if((ad==='faul'||ad==='kart'||ad==='ofsayt')&&v.aleyhe===0)baskanEylem('itiraz',3);
  else if(ad==='halftime')baskanEylem('telefon',2);
  else if(ad==='fulltime'){const s=v.score;baskanEylem(s[0]>s[1]?'alkis':s[0]<s[1]?'golYedik':'itiraz',4);}
}
/* dürbün: eller kaldırır, yüze gelince maske açılır (hazır geri çağrısı); indirirken önce maske kapanır */
function baskanDurbun(ac,hazir){
  BASKAN.eylem=null;if(ac){BASKAN.durbunHazir=hazir;baskanEylem('durbunKaldir',9);}else{BASKAN.durbunAcik=false;baskanEylem('durbunIndir',9);}}
/* ---- her kare ---- */
const BK_V=new THREE.Vector3();
function elYerlestir(el,poz){const E=BK_EL[el];E.g.position.set(...poz.p);E.g.rotation.set(poz.r[0],poz.r[1],poz.r[2]);E.parmak.rotation.x=poz.k*1.4;}
function baskanKare(dt,kamera){
  const B=BASKAN;
  /* kendiliğinden eylem: sakin anda (maç öncesi, devre arası ya da top ortadayken) telefona bakar */
  B.bosT-=dt;
  if(!B.eylem&&B.bosT<=0){B.bosT=14+rnd()*22;
    const ph=typeof mac!=='undefined'?mac.phase:'',sakin=ph==='play'?Math.abs(mac.ball.x)<24:true;
    if(sakin){const r=rnd();if(MAC_ONCESI.includes(ph)||ph==='halftime'?r<0.25:r<0.12)baskanEylem('telefon');}}
  /* eylemi oynat */
  let poz={sol:BK_DINLEN.sol,sag:BK_DINLEN.sag};const e=B.eylem;
  if(e){e.t+=dt;poz=bkAnahtar(e.keys,Math.min(e.t,e.sure));
    if(e.alkis&&e.t>e.alkis[0]&&e.t<e.alkis[1]){const a=Math.sin(e.t*26)*0.045;poz.sol.p[0]-=a;poz.sag.p[0]+=a;}
    if(e.salla&&e.t>e.salla[0]&&e.t<e.salla[1]){const a=Math.sin(e.t*17)*0.03;poz.sol.p[1]+=a;poz.sag.p[1]-=a;}
    if(e.vur&&!e.vurdu&&e.t>=e.vur){e.vurdu=true;B.sarsinti=1;}
    B.kalkHedef=e.kalk&&e.t>e.kalk[0]&&e.t<e.kalk[1]?1:0;
    const tel=e.telefon&&e.t>e.telefon[0]&&e.t<e.telefon[1];
    if(tel&&BK_TEL.parent!==BK_EL.sag.g){BK_EL.sag.g.add(BK_TEL);BK_TEL.rotation.set(0,0,0);}
    /* telefon avucun altından kalkıp elin önüne döner: ekran başkana bakar */
    if(tel){const q=clamp(Math.min((e.t-0.5)/0.5,(e.telefon[1]-e.t)/0.5),0,1),s=q*q*(3-2*q);BK_TEL.position.set(0,lerp(-0.03,0.04,s),lerp(-0.12,-0.07,s));BK_TEL.rotation.x=0.52*s;}
    if(!tel&&BK_TEL.parent!==BK_MASA){BK_MASA.add(BK_TEL);BK_TEL.position.set(0.14,-0.463,-1.08);BK_TEL.rotation.set(0,-0.3,0);}
    BK_TEL_EKRAN.color.setHex(tel?0xffffff:0x333333);if(tel)telefonYaz();
    if(e.durbun){const s=clamp(e.t/e.sure,0,1);BK_DURBUN.visible=true;BK_DURBUN.position.set(0,lerp(-0.45,-0.07,e.ad==='durbunKaldir'?s:1-s),lerp(-0.9,-0.33,e.ad==='durbunKaldir'?s:1-s));
      if(e.ad==='durbunKaldir'&&e.t>=e.sure&&B.durbunHazir){B.durbunHazir();B.durbunHazir=null;B.durbunAcik=true;}}
    if(e.t>=e.sure&&!e.kal){B.eylem=null;if(e.durbun)BK_DURBUN.visible=false;}
  }else B.kalkHedef=0;
  elYerlestir('sol',poz.sol);elYerlestir('sag',poz.sag);
  /* ayağa kalkma (yay) ve masaya yumruk sarsıntısı */
  B.kalk+=(B.kalkHedef-B.kalk)*Math.min(1,dt*(B.kalkHedef>B.kalk?5:2.2));B.sarsinti=Math.max(0,B.sarsinti-dt*4);
  BK_MASA.position.y=Math.sin(zamanB*55)*0.004*B.sarsinti;
  /* gövde hissi: baş dönünce ön plan biraz ters yöne kayar (nefes salınımı yok, 2.8J) */
  kamera.getWorldDirection(BK_V);const yaw=Math.atan2(BK_V.x,BK_V.z),pitch=Math.asin(clamp(BK_V.y,-1,1));
  const K=B.kamera;K.rotation.set(clamp((pitch-BK.dinlenmeEgimi)*0.22,-0.12,0.14),clamp(yaw*0.25,-0.3,0.3),0);
  K.position.set(0,B.kalk*0.34,B.kalk*0.1);
}
let zamanB=0;
function baskanZaman(dt){zamanB+=dt;}
function baskanCiz(){renderer.clearDepth();renderer.render(BASKAN.sahne,BASKAN.kamera);}
