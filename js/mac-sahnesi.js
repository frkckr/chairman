/* ============ Demirkapı '99 — maç sahnesi: maç motorunu (js/mac-motoru.js) '99 sahnesine bağlar ============
   Motor sabit adımla (1/60 sn) ilerler; çizim son iki adım arasında ara değer alır, böylece hareket ekran hızından bağımsız pürüzsüz akar.
   Oyuncu pozları sürekli karışır: koşu döngüsü hıza bağlı dalga, vuruş/kafa/taç/uçuş/sevinç yumuşakça girip çıkar.
   Burada ayrıca: yedek kulübeleri, teknik direktörler, dördüncü hakem, yazı tura parası, top, gölgeler, tribün heyecanı,
   canlı skor tabelası, başkanın bakışı ve ekranın altındaki radyo satırı. */
const MOTOR_Z=34,ADIM=1/60;
const MAC_HIZ={deger:(()=>{try{const v=parseFloat(new URLSearchParams(location.search).get('hiz'));return [1,2,4,8,16].includes(v)?v:1;}catch(e){return 1;}})()};
const olayKuyrugu=[],DURAKLAT={aktif:false};
const mac=new Match((ad,v)=>olayKuyrugu.push([ad,v]),{kadro:MAC_KADRO,tunel:{x:TUNEL.x,z:TUNEL.z+MOTOR_Z}});

/* ---- aktörler: motordaki her oyuncu ve hakem için bir model ---- */
const EKLEM=['lean','dy','hx','lL','kL','lR','kR','aL','aR','aLz','aRz','eL','eR'];
function aktorKur(K,kaynak,boy){
  const m=player(K);scene.add(m.root);golgeEkle(m);
  return{m,kaynak,boy:boy||1,J:{},yaw:0,ph:rnd()*6,amp:0,w:{},px:kaynak?kaynak.x:0,pz:kaynak?kaynak.z:0,x:0,z:0};
}
const AKTORLER=[];
mac.players.forEach(p=>{const kd=MAC_KADRO[p.team],k=p.kayit||{},forma=p.role==='GK'?kd.kaleciForma:kd.forma;
  AKTORLER.push(aktorKur(kitKaydi(forma,k,p.no),p,k.boy));});
mac.refs.forEach((r,i)=>{const a=aktorKur({...KIT.hakem,num:0,skin:STIL.tenler[[1,4,2][i]],hair:['#8a8680','#3c2616','#241a12'][i],style:i?'short':'bald',mus:i===0,w:i?1:1.06},r);
  if(r.kind==='lin'){const bayrak=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.22),LAM({color:0xf2c11d,side:THREE.DoubleSide}));bayrak.position.set(0,-0.36,0.14);a.m.eR.add(bayrak);}
  AKTORLER.push(a);});

/* ---- yedek kulübeleri: yedekler oturur, teknik direktör teknik alanda gezinir; dördüncü hakem ortada ---- */
const KENAR=[];
KULUBELER.forEach(kb=>{const kd=MAC_KADRO[kb.takim],forma=kb.takim?'yedekDeplasman':'yedekEv';
  kd.yedekler.forEach((k,i)=>{const s=kb.koltuklar[i];if(!s)return;const a=aktorKur(kitKaydi(forma,k,k.no),null,k.boy);
    a.x=s.x;a.z=s.z;a.oturur=true;a.takim=kb.takim;a.yaw=0;a.m.root.position.set(s.x,s.y-0.53,s.z);KENAR.push(a);});
  const td=aktorKur(kitKaydi('takimElbise',kd.td,0),null,kd.td.boy);td.x=kb.alan.x;td.z=kb.alan.z;td.td=kb;td.takim=kb.takim;KENAR.push(td);});
{const d=aktorKur({...KIT.hakem,num:0,skin:STIL.tenler[0],hair:'#3c2616',style:'short'},null);d.x=-5;d.z=-36.9;d.dorduncu=true;KENAR.push(d);}

/* ---- top: beyaz, siyah beşgenli; hıza göre döner ---- */
const TOP_R=0.14;
const topMesh=(()=>{const cv=mk(32,16),g=cv.getContext('2d');g.fillStyle='#f4f4ee';g.fillRect(0,0,32,16);g.fillStyle='#18181c';
  for(const [x,y] of[[2,3],[10,9],[18,3],[26,9],[6,13],[22,13]])g.fillRect(x,y,3,3);
  const m=new THREE.Mesh(new THREE.SphereGeometry(TOP_R,12,8),LAM({map:tx(cv,'n')}));scene.add(m);return m;})();
golgeTop(topMesh,TOP_R);
const TOP={px:0,py:0,pz:0,q:new THREE.Quaternion(),eksen:new THREE.Vector3(),dq:new THREE.Quaternion()};

/* ---- yazı tura parası ---- */
const para=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.01,12),LAM({color:0xe0c050}));para.visible=false;scene.add(para);
const PARA={t:-1,x:0,z:0};

/* ---- heyecan, radyo, skor tabelası ---- */
const H=STIL.seyirci.heyecan,HEY={ev:0,dep:0,tutEv:0,tutDep:0};
function heyecanla(takim,deger,tut){if(takim!==1){HEY.ev=Math.max(HEY.ev,deger);if(tut)HEY.tutEv=tut;}if(takim!==0){HEY.dep=Math.max(HEY.dep,deger);if(tut)HEY.tutDep=tut;}}
const radyoMetin=$('radyoMetin'),radyoSkor=$('radyoSkor');
let SON_SOZ='';
function soyle(s){SON_SOZ=s;if(radyoMetin&&!DURAKLAT.aktif)radyoMetin.textContent=s;}
const tAd=t=>MAC_KADRO[t].ad;
let tabelaAnahtar='';
function tabelaGuncelle(){
  const ph=mac.phase,dk=mac.minuteLabel(),alt=MAC_ONCESI.includes(ph)?'MAÇ ÖNCESİ':ph==='halftime'?'DEVRE ARASI':ph==='fulltime'?'MAÇ SONU':'DAKİKA '+dk;
  const k=mac.score.join('-')+alt;if(k===tabelaAnahtar)return;tabelaAnahtar=k;
  TABELA.ciz(MAC_KADRO[0].kisa,MAC_KADRO[1].kisa,mac.score,alt);
  if(radyoSkor)radyoSkor.textContent=MAC_KADRO[0].kisa+' '+mac.score[0]+'-'+mac.score[1]+' '+MAC_KADRO[1].kisa+' · '+(alt.startsWith('DAKİKA')?dk+"'":alt.toLocaleLowerCase('tr-TR'));
}
function olay(ad,v){
  switch(ad){
    case 'giris':soyle('Takımlar hakemlerin arkasından sahaya çıkıyor. Tribünler ayakta!');heyecanla(-1,H.giris,6);break;
    case 'mars':soyle('İstiklal Marşı okunuyor.');HEY.ev=HEY.dep=0;HEY.tutEv=HEY.tutDep=0;break;
    case 'marsBitti':soyle('Kaptanlar ve hakem orta yuvarlakta, yazı tura atılacak.');break;
    case 'yazitura':soyle('Yazı turayı '+tAd(v.takim)+' kazandı; santra '+sLoc(tAd(v.takim))+'.');PARA.t=0;PARA.x=v.x;PARA.z=v.z-MOTOR_Z;break;
    case 'kickoff':soyle(mac.half===1?'Hakemin düdüğüyle maç başladı!':'İkinci yarı başladı!');heyecanla(-1,H.santra);break;
    case 'shot':soyle(v.p.name+' şutunu çekiyor…');heyecanla(v.p.team,H.sut);break;
    case 'header':if(v.shot){soyle(v.p.name+' kafayı vurdu!');heyecanla(v.p.team,H.sut);}break;
    case 'save':soyle(v.p.name+(v.catch?' topu kucakladı.':' uçtu, çeldi!'));heyecanla(v.p.team,H.kurtaris);break;
    case 'wood':soyle('Direk! Top direkten döndü!');if(v.p)heyecanla(v.p.team,H.direk);break;
    case 'goal':{const s=v.score,sc=v.scorer;
      soyle(v.own?'Olamaz! '+(sc?sc.name:'')+' topu kendi ağlarına gönderdi. Skor '+s[0]+'-'+s[1]+'.':'GOOOL! '+sGen(tAd(v.team))+' golünü '+(sc?sc.name:'')+' attı! Skor '+s[0]+'-'+s[1]+'.');
      heyecanla(v.team,H.gol,8);if(v.team===0){HEY.dep=0;HEY.tutDep=0;}else{HEY.ev=0;HEY.tutEv=0;}
      for(const a of KENAR)if(a.takim===v.team)a.sevinc=6;break;}
    case 'corner':soyle('Korner, '+tAd(v.team)+'.');break;
    case 'halftime':soyle('İlk yarı sona erdi. Skor '+v.score[0]+'-'+v.score[1]+'. Takımlar soyunma odasına gidiyor.');break;
    case 'secondhalf':soyle('Takımlar ikinci yarı için sahaya dönüyor.');heyecanla(-1,H.giris*0.7,3);break;
    case 'fulltime':{const s=v.score;soyle('Maç sona erdi! '+tAd(0)+' '+s[0]+', '+tAd(1)+' '+s[1]+'.'+(s[0]>s[1]?' Tribünler başkanını alkışlıyor!':s[0]<s[1]?' Zor bir akşam oldu.':' Puanlar paylaşıldı.'));
      if(s[0]!==s[1])heyecanla(s[0]>s[1]?0:1,H.macSonu,6);break;}
  }
}

/* ---- pozlar: sürekli karışım ---- */
const kar=(J,P,w)=>{if(w<=0.001)return;for(const k in P)J[k]=J[k]+(P[k]-J[k])*w;};
function yumusak(a,ad,hedef,hiz,dt){const v=a.w[ad]||0;a.w[ad]=v+(hedef-v)*Math.min(1,dt*hiz);return a.w[ad];}
function aciYumusak(a,h,dt,hiz){let d=h-a.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));a.yaw+=d*Math.min(1,dt*hiz);}
function pozla(a,p,spd,dt,bx,bz){
  const run=Math.min(1,spd/7.5),hedefAmp=spd>0.3?0.18+run*0.8:0;a.amp+=(hedefAmp-a.amp)*Math.min(1,dt*8);
  if(spd>0.3)a.ph+=dt*(4.8+spd*0.95);
  const s=Math.sin(a.ph),c=Math.cos(a.ph),A=a.amp,r=Math.min(1,a.amp);
  const J={lean:0.22*run,dy:Math.abs(c)*0.05*run-0.03*run,hx:0,lL:-s*A,lR:s*A,kL:Math.max(0,Math.sin(a.ph+1.4))*A*1.5+0.05,kR:Math.max(0,Math.sin(a.ph+Math.PI+1.4))*A*1.5+0.05,
    aL:s*A*0.75,aR:-s*A*0.75,eL:-(0.25+r*1.0),eR:-(0.25+r*1.0),aLz:-0.08,aRz:0.08};
  if(!p)return J;
  const ph=mac.phase,oyuncu=p.team!=null;
  /* vuruş: topa dokunduktan sonraki kısa an */
  if(oyuncu&&p.kickCd>0.2&&p.pose!=='dive')kar(J,POSE.shoot,Math.sin(clamp((0.45-p.kickCd)/0.25,0,1)*Math.PI)*0.9);
  kar(J,POSE.kafa,yumusak(a,'kafa',p.pose==='head'?1:0,14,dt));
  kar(J,POSE.tac,yumusak(a,'tac',p.pose==='throw'||(mac.sp&&mac.sp.type==='throw'&&mac.sp.taker===p)?1:0,10,dt));
  kar(J,POSE.tutus,yumusak(a,'tutus',p.hold>0?1:0,10,dt));
  kar(J,POSE.sevinc,yumusak(a,'sevinc',p.celeb?1:0,6,dt));
  kar(J,POSE.mars,yumusak(a,'mars',ph==='toren'&&!p.kind?1:0,3,dt));
  kar(J,POSE.dive,yumusak(a,'dive',p.pose==='dive'?1:0,16,dt));
  if(p.celeb)J.aLz+=Math.sin(zaman*8)*0.3,J.aRz-=Math.sin(zaman*8)*0.3;
  return J;
}
function uygula(a,J){for(const k of EKLEM)a.J[k]=J[k]||0;pose(a.m,a.J);}

/* ---- bakış: başkanın gözü topu ve olan biteni yumuşakça izler (kritik sönümlü yay) ---- */
const BAKIS=new THREE.Vector3(...STIL.kameralar.baskan.hedef),BAKIS_HIZ=new THREE.Vector3(),BAKIS_HEDEF=new THREE.Vector3();
function bakisOdagi(){
  const ph=mac.phase,b=mac.ball;
  if(ph==='giris'){if(mac.phaseT<5)return BAKIS_HEDEF.set(TUNEL.x,1,TUNEL.z+3);let n=0,x=0,z=0;for(const a of AKTORLER)if(a.m.root.visible){x+=a.x;z+=a.z;n++;}return BAKIS_HEDEF.set(n?x/n:0,1,n?z/n:0);}
  if(ph==='toren')return BAKIS_HEDEF.set(0,1,MZ-9-MOTOR_Z);
  if(ph==='yazitura')return BAKIS_HEDEF.set(0,1,0);
  if(ph==='halftime')return BAKIS_HEDEF.set(0,1,TUNEL.z+10);
  if(ph==='fulltime'){if(mac.phaseT<12)return BAKIS_HEDEF.set(0,1,-6);return BAKIS_HEDEF.set(0,1,TUNEL.z+10);}
  const f=mac.focus();return BAKIS_HEDEF.set(f.x+b.vx*0.25,Math.min(f.y,3),f.z-MOTOR_Z+b.vz*0.25);
}

/* ---- her kare: motoru ilerlet, modelleri yerleştir ---- */
let birikim=0,zaman=0;
function macKare(dt){
  const dts=dt*MAC_HIZ.deger;zaman+=dts;birikim+=dts;
  let n=0;
  while(birikim>=ADIM&&n<240){
    for(const a of AKTORLER){a.px=a.kaynak.x;a.pz=a.kaynak.z;}
    const b=mac.ball;TOP.px=b.x;TOP.py=b.y;TOP.pz=b.z;
    mac.step(ADIM);birikim-=ADIM;n++;
    while(olayKuyrugu.length){const [ad,v]=olayKuyrugu.shift();olay(ad,v);}
  }
  if(n>=240)birikim=0;
  const al=birikim/ADIM,b=mac.ball,bx=lerp(TOP.px,b.x,al),bz=lerp(TOP.pz,b.z,al)-MOTOR_Z,T=mac.tunel;
  for(const a of AKTORLER){
    const p=a.kaynak;a.x=lerp(a.px,p.x,al);a.z=lerp(a.pz,p.z,al)-MOTOR_Z;
    const gorunur=p.z>T.z-0.8;a.m.root.visible=gorunur;
    const spd=p.spd||0;
    let hy;if(p.pose==='dive')hy=a.yaw;else if(spd>0.6)hy=Math.atan2(p.vx,p.vz);else if(p.bak)hy=Math.atan2(p.bak.x-p.x,p.bak.z-p.z);else hy=Math.atan2(bx-a.x,bz-a.z);
    aciYumusak(a,hy,dts,spd>0.6?10:5);
    const J=pozla(a,p,spd,dts,bx,bz);uygula(a,J);
    const dw=a.w.dive||0,yan=Math.sign((p.vx*Math.cos(a.yaw)-p.vz*Math.sin(a.yaw))||1);
    a.m.root.position.set(a.x,dw*(p.diveY||0.5)*0.9,a.z);a.m.root.rotation.set(0,a.yaw,-yan*1.35*dw);
  }
  /* kulübe: yedekler oturur (golde ayağa fırlar), teknik direktör topu izleyerek gezinir */
  for(const a of KENAR){
    if(a.oturur){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const kalk=yumusak(a,'kalk',a.sevinc>0?1:0,5,dts);
      const J=pozla(a,null,0,dts);kar(J,POSE.otur,1-kalk);if(kalk>0.5){kar(J,POSE.sevinc,kalk);J.dy+=Math.abs(Math.sin(zaman*7))*0.25*kalk;}
      uygula(a,J);a.m.root.rotation.y=0;continue;}
    let hx=a.x;
    if(a.td){const oyunda=['play','setpiece','kickoff','goal'].includes(mac.phase);hx=oyunda?clamp(bx*0.25+a.td.alan.x,a.td.alan.x-3.5,a.td.alan.x+3.5):a.td.alan.x;}
    const dx=hx-a.x,spd=Math.min(1.6,Math.abs(dx)*1.5);a.x+=Math.sign(dx)*Math.min(Math.abs(dx),spd*dts);
    aciYumusak(a,spd>0.3?Math.sign(dx)*Math.PI/2:Math.atan2(bx-a.x,bz-a.z),dts,4);
    const J=pozla(a,null,spd>0.3?spd:0,dts);
    if(a.td){a.sevinc=Math.max(0,(a.sevinc||0)-dts);kar(J,POSE.sevinc,yumusak(a,'sevinc',a.sevinc>0?1:0,6,dts));
      kar(J,POSE.isaret,yumusak(a,'isaret',Math.sin(zaman*0.7+a.takim*2)>0.85&&mac.phase==='play'?1:0,4,dts));}
    uygula(a,J);a.m.root.position.set(a.x,0,a.z);a.m.root.rotation.set(0,a.yaw,0);
  }
  /* top */
  {const by=lerp(TOP.py,b.y,al),vx=b.vx,vz=b.vz,v=Math.hypot(vx,vz);
   topMesh.position.set(bx,TOP_R+by,bz);
   if(v>0.05){TOP.eksen.set(vz/v,0,-vx/v);TOP.dq.setFromAxisAngle(TOP.eksen,v*dts/TOP_R);TOP.q.premultiply(TOP.dq);topMesh.quaternion.copy(TOP.q);}
   const icerde=b.z<T.z-0.8;topMesh.visible=!icerde;}
  /* yazı tura */
  if(PARA.t>=0){PARA.t+=dts;const t=PARA.t;para.visible=t<3;
    const y=t<1.1?1.4+5.2*t-4.905*t*t*1.9:0.02;para.position.set(PARA.x+0.4,Math.max(0.02,y),PARA.z+0.3);para.rotation.x=t<1.1?t*40:Math.PI/2*0;if(t>3)PARA.t=-1;}
  /* heyecan söner; meşaleler coşkuyla çoğalır */
  HEY.tutEv=Math.max(0,HEY.tutEv-dts);HEY.tutDep=Math.max(0,HEY.tutDep-dts);
  if(HEY.tutEv<=0)HEY.ev=Math.max(0,HEY.ev-dts/H.sonme);if(HEY.tutDep<=0)HEY.dep=Math.max(0,HEY.dep-dts/H.sonme);
  SEYIRCI_HEYECAN.value.set(HEY.ev,HEY.dep);MESALE_COSKU=HEY.ev;
  tabelaGuncelle();
  golgeleriGuncelle();
  /* bakış yayı */
  bakisOdagi();const k=STIL.kameralar.baskan.yay,d=Math.min(dt,0.05);
  BAKIS_HIZ.addScaledVector(BAKIS_HEDEF.clone().sub(BAKIS),k*k*d).multiplyScalar(Math.max(0,1-2*k*d));BAKIS.addScaledVector(BAKIS_HIZ,d);
}
