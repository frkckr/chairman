/* ============ Chairman — başkanın bakışı ve maç kamerası (çizim) ============
   Sahibi: A akışı (2026-10-03). Başkanın gözü başkan koltuğundadır. Oyun sürerken bakış topa odaklıdır: topu taşıyanın hemen önü, serbest
   topta kısa balistik öngörü (topFizikAdim topun özel kopyasında; motorun önbelleklerine dokunulmaz), uzun havadan topta iniş yeri, son üçte
   birde kale ağzı. Bu kaymalar topun yönünden en fazla bir açı bütçesi kadar sapar: top hep ekranın ortasına yakın kalır. Maç öncesi, devre
   arası, maç sonu, gol sevinci ve kart anında bakisOdagi'nin ilgi noktaları izlenir. Bakış yönü (sapma/eğim) kritik sönümlü yaylarla, açısal
   hız sınırıyla ve maç zamanıyla (dt × maç hızı, alt adımlı) ilerler: 2–8× hızda geride kalmaz; duraklatmada (dt 0) hiçbir şey kıpırdamaz.
   Görüş açısı oyunda oyunAci aralığına daralır (oyunun ne kadarının kadraja girmesi gerektiğine göre), ölü topta kısa bir gecikmeyle,
   maç öncesi/sonrası ve devre arasında geniş açıya (aci) döner. Dürbün elle açılır; açıkken topa kilitlenir, açılış/kapanış yumuşak geçişlidir.
   kameraAdim durumu ilerletir (js/mac-sahnesi.js macKare sonunda), kameraUygula kameraya yerleştirir (js/arayuz.js frame). Motoru yalnız okur. */
const KAM_B=STIL.kameralar.baskan,KAM_D=STIL.kameralar.durbun,KAM_DER=Math.PI/180;
/* BAKIS: o anki bakış noktası (kameranın baktığı yönde, okuyucular için); BAKIS_HEDEF: ilgi noktası (sahne koordinatı) */
const BAKIS=new THREE.Vector3(...KAM_B.hedef),BAKIS_HEDEF=new THREE.Vector3(...KAM_B.hedef),KAM_YON=new THREE.Vector3();
const ONCESI_BAKIS={x:0,z:0,t:-99};
/* bakış durumu: a = başkanın bakışı, d = dürbün. y sapma (+z'den +x'e, radyan), p eğim, vy/vp hızları; fov/dfov görüş açıları;
   gecis dürbün geçişi (0 kapalı, 1 açık); olu ölü topta geçen maç süresi; ty/tp ölü bölgede tutulan hedef */
const KAM={a:{y:0,p:-0.2,vy:0,vp:0},d:{y:0,p:-0.2,vy:0,vp:0},fov:KAM_B.aci,dfov:KAM_D.aci,gecis:0,durbunAcik:false,olu:0,ty:0,tp:-0.2,ilk:true,mod:'sahne'};
const KAM_TOP={x:0,y:0,z:0,vx:0,vy:0,vz:0,egri:0,ust:0},KAM_INIS={x:0,y:0,z:0,vx:0,vy:0,vz:0,egri:0,ust:0};
const kamAciFark=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
function kameraGoz(){return[BASKAN_KOLTUGU.x,BASKAN_KOLTUGU.y+KAM_B.goz,BASKAN_KOLTUGU.z];}
/* gözden bir noktaya sapma ve eğim (sahne koordinatı) */
function kameraAcilari(x,y,z,o){const g=kameraGoz(),dx=x-g[0],dz=z-g[2];o.y=Math.atan2(dx,dz);o.p=Math.atan2(y-g[1],Math.hypot(dx,dz));return o;}

/* ---- ilgi noktaları: oyun dışı aşamalar (2.8O'daki gibi; atak bölgesine sıkıştırma kalktı) ---- */
function bakisOdagi(){
  const ph=mac.phase;
  /* ısınma: yeni bir şey olduysa oraya bakar; yoksa ilgi noktaları (kaleciler, hakemler, takımlar) arasında gezinir.
     İlk anlarda karşı tribünün dolmasını izler */
  if(ph==='isinma'){const sn=mac.sen;
    if(zaman-ONCESI_BAKIS.t<6)return BAKIS_HEDEF.set(ONCESI_BAKIS.x,1,ONCESI_BAKIS.z);
    const L=sn.ilgiler;if(sn.t<14||!L.length)return BAKIS_HEDEF.set(-8,4,PW-MOTOR_Z+12);
    const i=Math.floor(zaman/8)%L.length;return BAKIS_HEDEF.set(L[i].x,1,L[i].z-MOTOR_Z);}
  /* tokalaşma: el sıkışanları izler; fotoğrafta iki takımın fotoğrafı arasında gidip gelir */
  if(ph==='selam'){const G=[[0,0,0],[0,0,0]];let n=0,x=0,z=0;
    for(const p of mac.players){if(p.poz==='tokalas'){x+=p.x;z+=p.z;n++;}else if(p.poz==='comel'||p.poz==='foto'){const g=G[p.team];g[0]+=p.x;g[1]+=p.z;g[2]++;}}
    const fotolar=G.filter(g=>g[2]>4);
    if(fotolar.length){const g=fotolar[Math.floor(zaman/5)%fotolar.length];return BAKIS_HEDEF.set(g[0]/g[2],1,g[1]/g[2]-MOTOR_Z);}
    return n?BAKIS_HEDEF.set(x/n,1,z/n-MOTOR_Z):BAKIS_HEDEF.set(0,1,MZ-9-MOTOR_Z);}
  if(ph==='giris'){if(mac.phaseT<5)return BAKIS_HEDEF.set(TUNEL.x,1,TUNEL.z+3);let n=0,x=0,z=0;for(const a of AKTORLER)if(a.m.root.visible){x+=a.x;z+=a.z;n++;}return BAKIS_HEDEF.set(n?x/n:0,1,n?z/n:0);}
  if(ph==='toren')return BAKIS_HEDEF.set(0,1,MZ-9-MOTOR_Z);
  if(ph==='yazitura')return BAKIS_HEDEF.set(0,1,0);
  /* devre arası: önce soyunma odasına yürüyen oyuncular, sonra kale önünde şut çalışan yedekler, en son tünel.
     Maç sonu: sevinç ve tokalaşma, sonra taraftarını alkışlayan ev sahibi, en son tünel */
  const ortala=L=>{let n=0,x=0,z=0;for(const p of L)if(p.z>mac.tunel.z){x+=p.x;z+=p.z;n++;}return n?BAKIS_HEDEF.set(x/n,1,z/n-MOTOR_Z):BAKIS_HEDEF.set(0,1,TUNEL.z+10);};
  if(ph==='halftime'){if(mac.phaseT<10)return ortala(mac.players.filter(p=>p.oyunda));if(mac.phaseT<DEVRE_ARASI-8)return BAKIS_HEDEF.set(-PL+14,1,0);return BAKIS_HEDEF.set(0,1,TUNEL.z+10);}
  if(ph==='fulltime'){if(mac.phaseT<14)return ortala(mac.players.filter(p=>p.oyunda));if(mac.phaseT<30)return ortala(mac.teams[0].filter(p=>p.oyunda));return BAKIS_HEDEF.set(0,1,TUNEL.z+10);}
  /* kart gösterilirken hakeme; gol sevincinde golcüye */
  const h=mac.refs[0];if(h.eylem&&h.eylem.ad==='kart')return BAKIS_HEDEF.set(h.x,1.3,h.z-MOTOR_Z);
  if(ph==='goal'){const f=mac.focus();return BAKIS_HEDEF.set(f.x,1,f.z-MOTOR_Z);}
  return null;
}
/* topa odaklı nişan (motor koordinatı, o'ya yazılır): taşıyanın önü / balistik öngörü; tam ise uzun havadan topta iniş yeri ve son üçte birde
   kale ağzı (dürbün yalnız öngörüyle topa kilitlenir). sure: öngörü süresi (sn). Duran topta top uzaktaysa oyunun başlayacağı nokta */
function kamTopNisani(sure,tam,o){
  const b=mac.ball,h=b.tasiyan||b.sahip,T=KAM_B.top,du=mac.phase==='durus'?mac.durus:null;
  if(du&&Math.hypot(b.x-du.x,b.z-du.z)>3){o.x=du.x;o.y=0;o.z=du.z;}
  else if(h){o.x=h.x+Math.cos(h.yon)*T.onde;o.z=h.z+Math.sin(h.yon)*T.onde;o.y=h===b.tasiyan?b.y:0;}
  else{
    const k=KAM_TOP;k.x=b.x;k.y=b.y;k.z=b.z;k.vx=b.vx;k.vy=b.vy;k.vz=b.vz;k.egri=b.egri||0;k.ust=b.ust||0;
    for(let i=0,n=Math.round(sure*60);i<n;i++)topFizikAdim(k,1/60,false,mac.R);
    o.x=k.x;o.y=k.y;o.z=k.z;
    /* uzun havadan top: ilk iniş yerine doğru (uçuş ne kadar uzunsa o kadar) */
    if(tam&&(b.y>0.4||b.vy>1.5)){const L=KAM_INIS;L.x=b.x;L.y=b.y;L.z=b.z;L.vx=b.vx;L.vy=b.vy;L.vz=b.vz;L.egri=b.egri||0;L.ust=b.ust||0;
      let t=0;while(t<3){topFizikAdim(L,1/60,false,mac.R);t+=1/60;if(L.y<=0.001&&L.vy<=0.001)break;}
      const w=clamp((t-T.inis[0])/T.inis[1],0,T.inis[2]);o.x+=(L.x-o.x)*w;o.z+=(L.z-o.z)*w;o.y*=1-w;}
  }
  if(!tam)return o;
  /* son üçte bir: kale ağzı kadraja girsin; kornerde penaltı noktasına doğru daha çok */
  const sg=o.x>=0?1:-1;
  if(du&&du.tur==='korner'){o.x+=(sg*(PL-11)-o.x)*T.korner;o.z+=(MZ-o.z)*T.korner;}
  else{const s=T.kale*clamp((Math.abs(o.x)-PL/3)/(PL/3),0,1);o.x+=(sg*PL-o.x)*s;o.z+=(MZ-o.z)*s;}
  return o;
}
/* oyunun ne kadarı kadraja girmeli (0 dar – 1 geniş): topun hızı, kaleye yakınlık, toptaki oyunun yayılımı (üçüncü en yakın oyuncu) */
function kamOyunGenisligi(){
  const b=mac.ball,G=KAM_B.genislik,h=b.tasiyan||b.sahip,v=Math.hypot(b.vx,b.vz);
  let n=clamp((v-G.hiz[0])/(G.hiz[1]-G.hiz[0]),0,1);
  const dg=Math.hypot((b.x>=0?PL:-PL)-b.x,MZ-b.z);n=Math.max(n,clamp((G.kale[0]-dg)/(G.kale[0]-G.kale[1]),0,1));
  let d1=1e9,d2=1e9,d3=1e9;
  for(const p of mac.players){if(!p.oyunda||p===h)continue;const d=Math.hypot(p.x-b.x,p.z-b.z);if(d<d1){d3=d2;d2=d1;d1=d;}else if(d<d2){d3=d2;d2=d;}else if(d<d3)d3=d;}
  return Math.max(n,clamp((d3-G.yayilim[0])/(G.yayilim[1]-G.yayilim[0]),0,1)*G.yayilim[2]);
}
/* hedef yön: nişan noktası topun yönünden en fazla bütçe kadar sapar (derece; s: görüş açısına göre ölçek) */
const KAM_ATOP={y:0,p:0},KAM_ANIS={y:0,p:0},KAM_NIS={x:0,y:0,z:0};
function kamTopYonu(sure,tam,butce,s,o){
  const b=mac.ball;kameraAcilari(b.x,b.y+TOP_R,b.z-MOTOR_Z,KAM_ATOP);kamTopNisani(sure,tam,KAM_NIS);kameraAcilari(KAM_NIS.x,KAM_NIS.y,KAM_NIS.z-MOTOR_Z,KAM_ANIS);
  o.y=KAM_ATOP.y+clamp(kamAciFark(KAM_ANIS.y,KAM_ATOP.y),-butce[0]*KAM_DER*s,butce[0]*KAM_DER*s);
  o.p=KAM_ATOP.p+clamp(KAM_ANIS.p-KAM_ATOP.p,-butce[1]*KAM_DER*s,butce[1]*KAM_DER*s);
  BAKIS_HEDEF.set(KAM_NIS.x,KAM_NIS.y,KAM_NIS.z-MOTOR_Z);return o;
}

/* geliştirme kancası: an yakalama aracı (araclar/an-yakala.py) kamerayı bir noktaya zorlayabilir: {hedef:{x,y,z}, fov}. Oyunda hep null */
var KAMERA_ZORLA=null;
/* kritik sönümlü yay (yarı örtük Euler, h ≤ 1/60): w açısal sıklık (1/sn), sinir açısal hız sınırı (radyan/sn) */
function kameraYay(s,ty,tp,w,sinir,h){
  s.vy+=(w*w*kamAciFark(ty,s.y)-2*w*s.vy)*h;s.vp+=(w*w*(tp-s.p)-2*w*s.vp)*h;
  const v=Math.hypot(s.vy,s.vp);if(v>sinir){s.vy*=sinir/v;s.vp*=sinir/v;}
  s.y+=s.vy*h;s.p+=s.vp*h;
}
/* bu anın hedefleri: başkanın bakışı (y, p, yay, sınır, fov) ve dürbün (dy, dp, dfov) */
const KAM_H={y:0,p:0,w:1,sinir:1,fov:52,dy:0,dp:0,dfov:11,yavas:false},KAM_HD={y:0,p:0};
function kameraHedefleri(dtm){
  const ph=mac.phase,odak=bakisOdagi(),b=mac.ball;
  if(odak){
    /* oyun dışı: ilgi noktası; bakış eskisi gibi biraz aşağıda (masa ve ön sıralar görünsün) */
    KAM.mod='sahne';kameraAcilari(odak.x,odak.y,odak.z,KAM_H);const g=kameraGoz();
    KAM_H.p=Math.atan2(odak.y-Math.hypot(odak.x-g[0],odak.z-g[2])*KAM_B.sahneEgim-g[1],Math.hypot(odak.x-g[0],odak.z-g[2]));
    kameraAcilari(odak.x,odak.y,odak.z,KAM_HD);KAM_H.dy=KAM_HD.y;KAM_H.dp=KAM_HD.p;
    KAM_H.w=KAM_B.yay;KAM_H.sinir=KAM_B.sahneSinir*KAM_DER;KAM_H.yavas=true;
    /* gol sevinci ve kart ölü toptur: kısa gecikmeyle geniş açı; maç öncesi/sonrası ve devre arasında hemen */
    const olu=ph==='goal'||!MAC_ONCESI.includes(ph)&&ph!=='halftime'&&ph!=='fulltime';
    KAM.olu=olu?KAM.olu+dtm:99;KAM_H.fov=KAM.olu>KAM_B.oluGecikme?KAM_B.aci:KAM.fov;KAM_H.dfov=KAM_D.aci;
  }else{
    KAM.mod='top';const oyun=ph==='play';
    kamTopYonu(KAM_D.ongoru,false,KAM_D.butce,KAM.dfov/KAM_D.oyunAci[1],KAM_HD);KAM_H.dy=KAM_HD.y;KAM_H.dp=KAM_HD.p;
    kamTopYonu(KAM_B.top.ongoru,true,KAM_B.top.butce,KAM.fov/KAM_B.oyunAci[1],KAM_H);KAM_H.p-=KAM_B.egim*KAM_DER;
    KAM_H.w=KAM_B.yayOyun;KAM_H.sinir=KAM_B.hizSiniri*KAM_DER;KAM_H.yavas=Math.hypot(b.vx,b.vz)<KAM_B.oluBolge[1];
    const n=kamOyunGenisligi();
    KAM.olu=oyun?0:KAM.olu+dtm;
    KAM_H.fov=KAM.olu>KAM_B.oluGecikme?KAM_B.aci:oyun?lerp(KAM_B.oyunAci[0],KAM_B.oyunAci[1],n):KAM.fov;
    KAM_H.dfov=lerp(KAM_D.oyunAci[0],KAM_D.oyunAci[1],n);
  }
  KAM_H.p=clamp(KAM_H.p,-KAM_B.asagiSinir,KAM_B.yukariSinir);KAM_H.dp=clamp(KAM_H.dp,-KAM_B.asagiSinir,KAM_B.yukariSinir);
  return KAM_H;
}
/* her kare (durum): hedefler → ölü bölge → yaylar (maç zamanında, alt adımlı) → görüş açıları → dürbün geçişi */
function kameraAdim(dt){
  if(KAM.ilk){KAM.ilk=false;kameraOturt();}
  if(!(dt>0))return;
  const dtm=Math.min(dt,0.05)*MAC_HIZ.deger,H=kameraHedefleri(dtm),A=KAM.a,D=KAM.d,acik=typeof bino!=='undefined'&&bino;
  /* ölü bölge: top yavaşken küçük oynamalarda baş kıpırdamaz */
  if(H.yavas){const ey=kamAciFark(H.y,KAM.ty),ep=H.p-KAM.tp,e=Math.hypot(ey,ep),dz=KAM_B.oluBolge[0]*KAM_DER;if(e>dz){KAM.ty+=ey*(e-dz)/e;KAM.tp+=ep*(e-dz)/e;}}
  else{KAM.ty=H.y;KAM.tp=H.p;}
  /* dürbün açılınca başkanın bakışından devralır; kapanırken de topu izlemeyi sürdürür */
  if(acik&&!KAM.durbunAcik&&KAM.gecis<=0){D.y=A.y;D.p=A.p;D.vy=A.vy;D.vp=A.vp;KAM.dfov=H.dfov;}
  KAM.durbunAcik=acik;
  const n=Math.min(30,Math.ceil(dtm*60-1e-6)),h=dtm/n;
  for(let i=0;i<n;i++){kameraYay(A,KAM.ty,KAM.tp,H.w,H.sinir,h);if(acik||KAM.gecis>0)kameraYay(D,H.dy,H.dp,KAM_D.yay,KAM_D.hizSiniri*KAM_DER,h);}
  KAM.fov+=(H.fov-KAM.fov)*(1-Math.exp(-dtm/KAM_B.aciSure));
  KAM.dfov+=(H.dfov-KAM.dfov)*(1-Math.exp(-dtm/KAM_D.aciSure));
  /* dürbün geçişi gerçek zamanla (arayüz hareketi; maç hızından bağımsız) */
  KAM.gecis=clamp(KAM.gecis+(acik?1:-1)*Math.min(dt,0.05)/KAM_D.gecisSure,0,1);
}
/* bütün durumu bu anın hedeflerine oturtur (ilk kare; geliştirme: an yakalama aracı dürbünü anında açar) */
function kameraOturt(){
  const H=kameraHedefleri(0),acik=typeof bino!=='undefined'&&bino;
  Object.assign(KAM.a,{y:H.y,p:H.p,vy:0,vp:0});Object.assign(KAM.d,{y:H.dy,p:H.dp,vy:0,vp:0});
  KAM.ty=H.y;KAM.tp=H.p;KAM.fov=H.fov;KAM.dfov=H.dfov;KAM.gecis=acik?1:0;KAM.durbunAcik=acik;
}
/* görüş açılarını tan(fov/2) üzerinden karıştırır: yakınlaşma eşit hızda hissedilir */
function kameraFovKaristir(a,b,e){const ta=Math.tan(a*KAM_DER/2),tb=Math.tan(b*KAM_DER/2);return 2*Math.atan(ta*Math.pow(tb/ta,e))/KAM_DER;}
/* sakin kamera (2.8J): baş salınımı, gol sarsıntısı ve dürbün el titremesi yok; ayağa kalkış (kalk) gerçek harekettir */
function kameraUygula(V){
  if(KAMERA_ZORLA){const h=KAMERA_ZORLA.hedef,f=KAMERA_ZORLA.fov||KAM_B.aci;camera.position.set(V.p[0],V.p[1],V.p[2]);camera.lookAt(h.x,h.y,h.z);
    if(camera.fov!==f){camera.fov=f;camera.updateProjectionMatrix();}return;}
  const kalk=typeof BASKAN!=='undefined'?BASKAN.kalk:0,g=KAM.gecis,e=g*g*(3-2*g);
  camera.position.set(V.p[0],V.p[1]+kalk*0.38,V.p[2]+kalk*0.12);
  const y=KAM.a.y+kamAciFark(KAM.d.y,KAM.a.y)*e,p=KAM.a.p+(KAM.d.p-KAM.a.p)*e,c=Math.cos(p);
  KAM_YON.set(Math.sin(y)*c,Math.sin(p),Math.cos(y)*c);BAKIS.copy(camera.position).addScaledVector(KAM_YON,60);
  camera.lookAt(BAKIS);
  const f=e>0?kameraFovKaristir(KAM.fov,KAM.dfov,e):KAM.fov;
  if(Math.abs(camera.fov-f)>1e-6){camera.fov=f;camera.updateProjectionMatrix();}
}
/* maç olayları (js/mac-sahnesi.js olay işlevinden): bakış aşamalardan ve toptan okunur, olay gerekmez */
function kameraOlay(ad,v){}
