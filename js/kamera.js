/* ============ Chairman — başkanın bakışı ve maç kamerası (çizim) ============
   Sahibi: A akışı (2026-10-03). Başkanın gözü başkan koltuğundadır.
   N4 (kullanıcı kararı 2026-10-04): bakış topu izler. Fareyle sürükleme ve ok tuşlarıyla elle bakış, “Topu izle” düğmesi ve F tuşu kaldırıldı
   (2026-10-03 ikinci paketteki varsayılan elle bakışın yerini alır). Dürbün 2026-10-07'de kullanıcı kararıyla tamamen kaldırıldı: tek bakış vardır.
   Z1 (kullanıcı kararı 2026-10-19): görüş açısı maç günü boyunca sabit (STIL aci; yakınlaşma yok — Z1'de 32°, K1'de (kullanıcı kararı 2026-10-20)
   36°); bakış topu ortada tutmaz, geniş bir PENCEREDE tutar (32°'de yatayda ±9°, dikeyde ±5°: top pencerenin içindeyken baş kıpırdamaz, dışına
   çıkınca topu kenara getirecek kadar yavaşça döner); pencere, nişan bütçesi ve eğim STIL olcekAci'de ayarlıdır ve ekrandaki oranları aynı
   kalsın diye açıyla ölçeklenir (kamAciOlcek); önündeki masa (K1'den beri kare ayaklı küçük masa; eskiden raf) ekranda sabittir
   (kameraGovdeHedefi çarpanları STIL.baskan.govde = 0).
   Oyun sürerken bakış topa odaklıdır: topu taşıyanın hemen önü, serbest
   topta kısa balistik öngörü (topFizikAdim topun özel kopyasında; motorun önbelleklerine dokunulmaz), uzun havadan topta iniş yeri, son üçte
   birde kale ağzı. Bu kaymalar topun yönünden en fazla bir açı bütçesi kadar sapar; bakış bu nişanı pencerede tutar (Z1: top ortada tutulmaz). Maç öncesi, devre
   arası, maç sonu, gol sevinci ve kart anında bakisOdagi'nin ilgi noktaları izlenir. Bakış yönü (sapma/eğim) kritik sönümlü yaylarla, açısal
   hız sınırıyla ve maç zamanıyla (dt × maç hızı, alt adımlı) ilerler: 2–8× hızda geride kalmaz; duraklatmada (dt 0) hiçbir şey kıpırdamaz.
   kameraAdim durumu ilerletir (js/mac-sahnesi.js macKare sonunda), kameraUygula kameraya yerleştirir (js/arayuz.js frame). Motoru yalnız okur. */
const KAM_B=STIL.kameralar.baskan,KAM_DER=Math.PI/180;
/* BAKIS: o anki bakış noktası (kameranın baktığı yönde, okuyucular için); BAKIS_HEDEF: ilgi noktası (sahne koordinatı) */
const BAKIS=new THREE.Vector3(...KAM_B.hedef),BAKIS_HEDEF=new THREE.Vector3(...KAM_B.hedef),KAM_YON=new THREE.Vector3();
const ONCESI_BAKIS={x:0,z:0,t:-99};
/* bakış durumu: a = başkanın bakışı. y sapma (+z'den +x'e, radyan), p eğim, vy/vp hızları; fov görüş açısı;
   olu ölü topta geçen maç süresi; ty/tp ölü bölgede tutulan hedef */
const KAM={a:{y:0,p:-0.2,vy:0,vp:0},fov:KAM_B.aci,ty:0,tp:-0.2,tvy:0,tvp:0,ilk:true,mod:'sahne'};
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
  if(ph==='giris'){if(mac.phaseT<5)return BAKIS_HEDEF.set(TUNEL.x,1,TUNEL.z+3);let n=0,x=0,z=0;for(const a of AKTORLER)if(a.m.root.visible&&a.kaynak.tur!=='topcu'){x+=a.x;z+=a.z;n++;}return BAKIS_HEDEF.set(n?x/n:0,1,n?z/n:0);}
  if(ph==='toren')return BAKIS_HEDEF.set(0,1,MZ-9-MOTOR_Z);
  if(ph==='yazitura')return BAKIS_HEDEF.set(0,1,0);
  /* devre arası: önce soyunma odasına yürüyen oyuncular, sonra kale önünde şut çalışan yedekler, en son tünel.
     Maç sonu: sevinç ve tokalaşma, sonra taraftarını alkışlayan ev sahibi, en son tünel */
  const ortala=L=>{let n=0,x=0,z=0;for(const p of L)if(p.z>mac.tunel.z){x+=p.x;z+=p.z;n++;}return n?BAKIS_HEDEF.set(x/n,1,z/n-MOTOR_Z):BAKIS_HEDEF.set(0,1,TUNEL.z+10);};
  if(ph==='halftime'){if(mac.phaseT<10)return ortala(mac.players.filter(p=>p.oyunda));if(mac.phaseT<DEVRE_ARASI-8)return BAKIS_HEDEF.set(-PL+14,1,0);return BAKIS_HEDEF.set(0,1,TUNEL.z+10);}
  if(ph==='fulltime'){if(mac.phaseT<14)return ortala(mac.players.filter(p=>p.oyunda));if(mac.phaseT<30)return ortala(mac.teams[0].filter(p=>p.oyunda));return BAKIS_HEDEF.set(0,1,TUNEL.z+10);}
  /* kart gösterilirken hakeme; gol sevincinde golcüye. S1d (2026-10-20; S1 planı §1.10): kart sahnesi hakemi tutarken yaklaşmada ve kalabalıkta
     hakemle oyuncunun ortasına (STIL.kameralar.baskan.kartIzle 0'da kapalı), kart gösterilirken ve sahnede deftere yazarken hakeme */
  /* S1c (bit 16; motorun salt okunur odağı celeb.odak): gol sevincinde golcü ve küme, dönüşte takım, düdüğe yakın nokta — sevinç karttan önce gelir
     (avantajdan gelen kart sevinci bölmez) */
  const cG=ph==='goal'&&mac.celeb&&mac.celeb.odak?mac.celeb:null;
  if(cG&&cG.evre==='kutla')return BAKIS_HEDEF.set(cG.odak.x,1,cG.odak.z-MOTOR_Z);
  const h=mac.refs[0],ks=h.kartSira,KS=ks&&ks.s,KI=KAM_B.kartIzle;
  if(KI!==0&&KS&&KS.tut&&(KS.evre==='yaklas'||KS.evre==='kalabalik')&&ks.p)return BAKIS_HEDEF.set((h.x+ks.p.x)/2,1.2,(h.z+ks.p.z)/2-MOTOR_Z);
  /* deftere yazma ('not') oyun sürerken bakışı çekmez (yalnız duruşta ve gol evresinde kartla) */
  if(h.eylem&&(h.eylem.ad==='kart'||h.eylem.ad==='not'&&ks&&ph!=='play'))return BAKIS_HEDEF.set(h.x,1.3,h.z-MOTOR_Z);
  if(cG)return BAKIS_HEDEF.set(cG.odak.x,1,cG.odak.z-MOTOR_Z);   /* S1c: dönüşte odak (kart varsa önce kart) */
  if(ph==='goal'){const f=mac.focus();return BAKIS_HEDEF.set(f.x,1,f.z-MOTOR_Z);}
  return null;
}
/* topa odaklı nişan (motor koordinatı, o'ya yazılır): taşıyanın önü / balistik öngörü; tam ise uzun havadan topta iniş yeri ve son üçte birde
   kale ağzı. sure: öngörü süresi (sn). Duran topta top uzaktaysa oyunun başlayacağı nokta */
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
/* kritik sönümlü yay (yarı örtük Euler, h ≤ 1/60): w açısal sıklık (1/sn), sinir açısal hız sınırı (radyan/sn); tvy/tvp hedefin açısal hızı
   (Z1 ileri besleme: sabit hızla kayan hedefte yay geride kalmaz; eskiden kararlı gecikme 2·hız/w idi — 20°/sn'lik pasta ~18°) */
function kameraYay(s,ty,tp,w,sinir,h,tvy,tvp){
  s.vy+=(w*w*kamAciFark(ty,s.y)+2*w*((tvy||0)-s.vy))*h;s.vp+=(w*w*(tp-s.p)+2*w*((tvp||0)-s.vp))*h;
  const v=Math.hypot(s.vy,s.vp);if(v>sinir){s.vy*=sinir/v;s.vp*=sinir/v;}
  s.y+=s.vy*h;s.p+=s.vp*h;
}
/* K1 (2026-10-20): pencere, nişan bütçesi ve eğim STIL'de olcekAci'de (32°) derece olarak verilir; ekrandaki oranları aynı kalsın diye
   tan(aci/2) / tan(olcekAci/2) ile çarpılır (küçük açılarda doğrusal yaklaşım yeterli: 36°'de ±9° → ±10,2°, ekranda fark %0,3) */
function kamAciOlcek(){return Math.tan(KAM_B.aci*KAM_DER/2)/Math.tan((KAM_B.olcekAci||KAM_B.aci)*KAM_DER/2);}
/* bu anın hedefleri: başkanın bakışı (y, p, yay, sınır, fov; olcek: açının pencereye ölçeği) */
const KAM_H={y:0,p:0,w:1,sinir:1,fov:52,olcek:1};
function kameraHedefleri(dtm){
  const ph=mac.phase,odak=bakisOdagi(),b=mac.ball;
  if(odak){
    /* oyun dışı: ilgi noktası; bakış eskisi gibi biraz aşağıda (masa ve ön sıralar görünsün) */
    KAM.mod='sahne';kameraAcilari(odak.x,odak.y,odak.z,KAM_H);const g=kameraGoz();
    KAM_H.p=Math.atan2(odak.y-Math.hypot(odak.x-g[0],odak.z-g[2])*KAM_B.sahneEgim-g[1],Math.hypot(odak.x-g[0],odak.z-g[2]));
    KAM_H.w=KAM_B.yay;KAM_H.sinir=KAM_B.sahneSinir*KAM_DER;
  }else{
    KAM.mod='top';
    const s=kamAciOlcek();KAM_H.olcek=s;
    kamTopYonu(KAM_B.top.ongoru,true,KAM_B.top.butce,s,KAM_H);KAM_H.p-=KAM_B.egim*KAM_DER*s;
    KAM_H.w=KAM_B.yayOyun;KAM_H.sinir=KAM_B.hizSiniri*KAM_DER;
  }
  KAM_H.fov=KAM_B.aci;   /* Z1: sabit görüş açısı (yakınlaşma yok) */
  KAM_H.p=clamp(KAM_H.p,-KAM_B.asagiSinir,KAM_B.yukariSinir);
  return KAM_H;
}
/* her kare (durum): hedefler → pencere (oyunda) → yay (maç zamanında, alt adımlı); görüş açısı sabit */
function kameraAdim(dt){
  if(KAM.ilk){KAM.ilk=false;kameraOturt();}
  if(!(dt>0))return;
  const dtm=Math.min(dt,0.05)*MAC_HIZ.deger,H=kameraHedefleri(dtm),A=KAM.a;
  /* Z1 pencere: top (nişanı) bakışın hedefinin ±pencere içindeyken hedef kıpırdamaz; dışına çıkınca nişanı pencerenin kenarına getirecek kadar kayar.
     Oyun dışı ilgi noktalarında hedef doğrudan izlenir */
  /* İleri besleme: pencerenin kenarına itilen hedefin açısal hızı (yumuşatılmış, hız sınırıyla); pencere içinde hedef durduğundan sıfıra iner */
  if(KAM.mod==='top'){const wy=KAM_B.pencere[0]*KAM_DER*H.olcek,wp=KAM_B.pencere[1]*KAM_DER*H.olcek,ey=kamAciFark(H.y,KAM.ty),ep=H.p-KAM.tp,y0=KAM.ty,p0=KAM.tp;
    if(ey>wy)KAM.ty+=ey-wy;else if(ey<-wy)KAM.ty+=ey+wy;
    if(ep>wp)KAM.tp+=ep-wp;else if(ep<-wp)KAM.tp+=ep+wp;
    KAM.tp=clamp(KAM.tp,-KAM_B.asagiSinir,KAM_B.yukariSinir);
    const k=1-Math.exp(-dtm/KAM_B.ileriSure),sn=H.sinir;
    KAM.tvy+=(clamp(kamAciFark(KAM.ty,y0)/dtm,-sn,sn)-KAM.tvy)*k;KAM.tvp+=(clamp((KAM.tp-p0)/dtm,-sn,sn)-KAM.tvp)*k;}
  else{KAM.ty=H.y;KAM.tp=H.p;KAM.tvy=0;KAM.tvp=0;}
  const n=Math.min(30,Math.ceil(dtm*60-1e-6)),h=dtm/n;
  for(let i=0;i<n;i++)kameraYay(A,KAM.ty,KAM.tp,H.w,H.sinir,h,KAM.tvy,KAM.tvp);
  KAM.fov=H.fov;
}
/* bütün durumu bu anın hedeflerine oturtur (ilk kare; locaya girişin sonu; an yakalama aracı) */
function kameraOturt(){
  const H=kameraHedefleri(0);
  Object.assign(KAM.a,{y:H.y,p:H.p,vy:0,vp:0});
  KAM.ty=H.y;KAM.tp=H.p;KAM.tvy=0;KAM.tvp=0;KAM.fov=H.fov;
}
/* başkanın önündeki masa (js/baskan.js ön plan; K1'den beri küçük masa, eskiden raf): Z1 (kullanıcı kararı 2026-10-19) ekranda sabit —
   STIL.baskan.govde çarpanları 0 (eskiden 0,22 ve 0,25: baş dönünce raf ters yöne kayıyordu) */
function kameraGovdeHedefi(yaw,pitch,G){
  if(typeof LOCA_GIRIS!=='undefined'&&LOCA_GIRIS.aktif)return{p:0,y:0,hiz:8};
  const B=STIL.baskan,k=B.govde||[0.22,0.25];
  return{p:clamp((pitch-B.dinlenmeEgimi)*k[0],-0.12,B.egimUst),y:clamp(yaw*k[1],-0.3,0.3),hiz:B.govdeHiz};
}
/* P1 (2026-10-21 akşam, kullanıcı kararı; DENEME): 2D maç görünümü — loca bakışı yerine FM gibi tepeden bakan kamera (js/pul.js pulTepe; pullar).
   Saha yatay, ana tribün ekranın altında (locadakiyle aynı sol–sağ: kameranın üstü dünya +z); kamera topu yumuşakça izler (STIL.pul.tepe.takip),
   merkezi STIL.pul.tepe.sinir içinde kalır (statın dışı görünmesin); görüş açısı yakınlık seviyesinin dikey uzunluğundan (Z tuşu). Maç öncesinde
   ve top görünmezken stadın ortası; maç öncesinde bütün stat görünür (P2: tribün arkalarından türetilen PUL.stat), santrada seçili seviyeye
   yaklaşır (yakınlık geçişi STIL.pul.tepe.yakinlik sn; duraklatılmışken anında). Görüntü statın sınırında kalır (sınırdan geniş görüntüde stadın
   ortası). Zaman maçın çizim saatinden (zaman; duraklatınca durur, hız katında hızlanır) */
const TEPE_KAM={x:0,z:0,E:46,son:-1,ilk:true};
function tepeSinir(a,b,y,v){return b-a>2*y?clamp(v,a+y,b-y):(a+b)/2;}
function tepeKamera(){const T=STIL.pul.tepe,b=topMesh,G=T.genislik,H=T.yukseklik,once=MAC_ONCESI.includes(mac.phase),S=PUL.stat;
  const Eh=once?S.E:(G[PUL.seviye]||G[1]),dt=TEPE_KAM.son<0?0:Math.max(0,zaman-TEPE_KAM.son);TEPE_KAM.son=zaman;
  if(TEPE_KAM.ilk)TEPE_KAM.E=Eh;else TEPE_KAM.E+=(Eh-TEPE_KAM.E)*(dt>0?1-Math.exp(-dt/T.yakinlik):1);
  const E=TEPE_KAM.E,fov=2*Math.atan(E/2/H)/KAM_DER,yw=E*RW/RH/2,yh=E/2;
  const oyunda=b.visible&&!once,hx=tepeSinir(S.x0,S.x1,yw,oyunda?b.position.x:S.cx),hz=tepeSinir(S.z0,S.z1,yh,oyunda?b.position.z:S.cz);
  if(TEPE_KAM.ilk){TEPE_KAM.ilk=false;TEPE_KAM.x=hx;TEPE_KAM.z=hz;}
  else{const k=dt>0?1-Math.exp(-dt/T.takip):0;TEPE_KAM.x=tepeSinir(S.x0,S.x1,yw,TEPE_KAM.x+(hx-TEPE_KAM.x)*k);TEPE_KAM.z=tepeSinir(S.z0,S.z1,yh,TEPE_KAM.z+(hz-TEPE_KAM.z)*k);}
  camera.up.set(0,0,1);camera.position.set(TEPE_KAM.x,H,TEPE_KAM.z);camera.lookAt(TEPE_KAM.x,0,TEPE_KAM.z);
  if(Math.abs(camera.fov-fov)>1e-6){camera.fov=fov;camera.updateProjectionMatrix();}}
/* sakin kamera (2.8J): baş salınımı ve gol sarsıntısı yok; ayağa kalkış (kalk) gerçek harekettir */
function kameraUygula(V){
  const tepe=typeof pulTepe==='function'&&pulTepe();
  if(!tepe){TEPE_KAM.ilk=true;if(camera.up.y!==1)camera.up.set(0,1,0);}
  /* locaya giriş (2.8T, js/loca-giris.js): kamera yürüyüşün yolundadır */
  if(typeof LOCA_GIRIS!=='undefined'&&LOCA_GIRIS.aktif){if(camera.up.y!==1)camera.up.set(0,1,0);locaGirisKamera();return;}
  if(KAMERA_ZORLA){const h=KAMERA_ZORLA.hedef,f=KAMERA_ZORLA.fov||KAM_B.aci;camera.position.set(V.p[0],V.p[1],V.p[2]);camera.lookAt(h.x,h.y,h.z);
    if(camera.fov!==f){camera.fov=f;camera.updateProjectionMatrix();}return;}
  if(tepe){tepeKamera();return;}
  const kalk=typeof BASKAN!=='undefined'?BASKAN.kalk:0;
  camera.position.set(V.p[0],V.p[1]+kalk*0.38,V.p[2]+kalk*0.12);
  const y=KAM.a.y,p=KAM.a.p,c=Math.cos(p);
  KAM_YON.set(Math.sin(y)*c,Math.sin(p),Math.cos(y)*c);BAKIS.copy(camera.position).addScaledVector(KAM_YON,60);
  camera.lookAt(BAKIS);
  if(Math.abs(camera.fov-KAM.fov)>1e-6){camera.fov=KAM.fov;camera.updateProjectionMatrix();}
}
