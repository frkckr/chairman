/* ============ Chairman — maç sahnesi: maç motorunu (js/mac-motoru.js) '99 sahnesine bağlar ============
   Motor sabit adımla (1/60 sn) ilerler; çizim son iki adım arasında ara değer alır, böylece hareket ekran hızından bağımsız pürüzsüz akar.
   Gövde yönü motordaki gerçek bakış yönünden (yon) gelir. Pozlar sürekli karışır: koşu döngüsü hıza bağlı dalga; vuruşta
   geri salınım ve takip (vuran ayak tarafına göre), kontrol, göğüs, kafa sıçrayışı, müdahale, kayma, düşme ve kalkma,
   kaleci uçuşu ve tutuşu, taç, itiraz, sevinç; hakemde düdük, yön, avantaj, kart, penaltı; yan hakemde bayrak.
   Burada ayrıca: konilerdeki yedek toplar ve dışarıda kalan toplar (top toplayıcı 2.8O'da kaldırıldı), yedek kulübeleri, teknik direktörler, antrenörler, dördüncü hakem ve uzatma
   tabelası, fotoğrafçılar ve flaşları, antrenman topları ve koniler, yazı tura parası, top, gölgeler, tribünün dolması ve ayağa
   kalkması, tribün heyecanı, canlı skor tabelası ve başkanın bakışı. Yazılı spiker/radyo satırı 2.8A'da kaldırıldı. */
const MOTOR_Z=34,ADIM=1/60;
const MAC_HIZ={deger:(()=>{try{const v=parseFloat(new URLSearchParams(location.search).get('hiz'));return [1,2,4,8,16].includes(v)?v:1;}catch(e){return 1;}})()};
/* ?tohum=123 ile aynı maç yeniden oynatılabilir */
const MAC_TOHUM=(()=>{try{const v=parseInt(new URLSearchParams(location.search).get('tohum'),10);return Number.isFinite(v)?v:null;}catch(e){return null;}})();
/* DURAKLAT: eski ad; ortak duraklatma yönetimini okur (js/sunum-durumu.js, 2.8B) */
const olayKuyrugu=[],DURAKLAT={get aktif(){return duraklatmaVar();}};
/* maç sonunda takımların alkışlayacağı tribünün önü (motor koordinatı): ev taraftarının ve deplasman bölümünün tribünü */
function tribunOnu(taraftar){
  for(const tr of STAT.tribunler){const b=tr.taraftar===taraftar?{from:0,to:0}:(tr.bolumler||[]).find(b=>b.taraftar===taraftar);if(!b)continue;
    const u=(b.from+b.to)/2;
    return{ana:{x:clamp(u,-40,40),z:3.5,nx:0,nz:-1},karsi:{x:clamp(u,-40,40),z:PW-3.5,nx:0,nz:1},kale1:{x:-PL+3.5,z:MZ+clamp(u,-22,22),nx:-1,nz:0},kale2:{x:PL-3.5,z:MZ+clamp(u,-22,22),nx:1,nz:0}}[tr.yer];}
  return null;}
const mac=new Match((ad,v)=>olayKuyrugu.push([ad,v]),{kadro:MAC_KADRO,tunel:{x:TUNEL.x,z:TUNEL.z+MOTOR_Z},tohum:MAC_TOHUM,zemin:STAT.zemin,
  kulubeler:KULUBELER.map(k=>({takim:k.takim,koltuklar:k.koltuklar.map(s=>({x:s.x,z:s.z+MOTOR_Z})),alan:{x:k.alan.x,z:k.alan.z+MOTOR_Z}})),
  taraftarYeri:tribunOnu('ev')||undefined,deplasmanYeri:tribunOnu('deplasman')});

/* ---- aktörler: motordaki her oyuncu, hakem ve top toplayıcı için bir model ---- */
const EKLEM=['lean','dy','hx','lL','kL','lR','kR','aL','aR','aLz','aRz','eL','eR'];
function aktorKur(K,kaynak,boy){
  const m=player(K);m.root.rotation.order='YXZ';scene.add(m.root);golgeEkle(m);
  return{m,kaynak,boy:boy||1,J:{},yaw:0,ph:rnd()*6,amp:0,w:{},px:kaynak?kaynak.x:0,pz:kaynak?kaynak.z:0,x:0,z:0,dus:0};
}
const AKTORLER=[];
mac.players.forEach(p=>{const kd=MAC_KADRO[p.team],k=p.kayit||{},forma=p.rol==='GK'?kd.kaleciForma:kd.forma;
  AKTORLER.push(aktorKur(kitKaydi(forma,k,p.no),p,k.boy));});
const HAKEMLER=mac.refs.map((r,i)=>{const a=aktorKur({...KIT.hakem,num:0,skin:STIL.tenler[[1,4,2][i]],hair:['#8a8680','#3c2616','#241a12'][i],style:i?'short':'bald',mus:i===0,w:i?1:1.06},r);
  if(r.kind==='lin'){const bayrak=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.22),LAM({color:0xf2c11d,side:THREE.DoubleSide}));bayrak.position.set(0,-0.36,0.14);a.m.eR.add(bayrak);}
  AKTORLER.push(a);return a;});
/* hakemin kartı: elinde küçük sarı/kırmızı kart */
const KART=new THREE.Mesh(new THREE.PlaneGeometry(0.08,0.11),LAM({color:0xf2d21d,side:THREE.DoubleSide}));KART.position.set(0,-0.36,0.04);KART.visible=false;HAKEMLER[0].m.eL.add(KART);

/* ---- yedekler: motordaki kulübe oyuncuları. Kulübede eşofmanla oturur, oyuna girince formayla görünür ---- */
mac.yedekler.forEach((Y,t)=>Y.forEach(y=>{const kd=MAC_KADRO[t],k=y.kayit||{};
  const a=aktorKur(kitKaydi(y.rol==='GK'?kd.kaleciForma:kd.forma,k,k.no),y,k.boy);
  const m2=player(kitKaydi(t?'yedekDeplasman':'yedekEv',k,k.no));m2.root.rotation.order='YXZ';scene.add(m2.root);golgeEkle(m2);
  a.esofman=m2;AKTORLER.push(a);}));
/* ---- saha kenarı: teknik direktörler, kaleci antrenörleri, kondisyonerler, dördüncü hakem, fotoğrafçılar (motordaki kenar kişileri) ---- */
const SACLAR=['#241a12','#141212','#3c2616','#8a8680','#5a4028'];
const DORDUNCU=(()=>{let d=null;mac.kenar.forEach((p,i)=>{
  const bak={ten:[0,1,2,3,4][(i*3+1)%5],sacRenk:SACLAR[(i*7)%5],sac:['kisa','kel','kivircik','kisa','uzun'][(i*5)%5],biyik:i%3===0,boy:0.95+((i*37)%10)/100,yapi:0.95+((i*53)%14)/100};
  let K;
  if(p.kind==='td')K=kitKaydi('takimElbise',MAC_KADRO[p.team].td,0);
  else if(p.kind==='dorduncu')K={...KIT.hakem,num:0,skin:STIL.tenler[0],hair:'#3c2616',style:'short'};
  else K=kitKaydi(p.kind==='foto'?'foto':p.team?'antrenorDeplasman':'antrenorEv',bak,0);
  const a=aktorKur(K,p,K.h);AKTORLER.push(a);if(p.kind==='dorduncu')d=a;});return d;})();
/* uzatma tabelası: dördüncü hakemin elinde, yeşil ışıklı rakamlar */
const TABELA_CV=mk(32,16),TABELA_G=TABELA_CV.getContext('2d'),TABELA_TX=tx(TABELA_CV,'n');
const UZATMA_TABELA=(()=>{const g=new THREE.Group(),kasa=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.34,0.05),LAM({color:0x141416}));
  const yuz=new THREE.Mesh(new THREE.PlaneGeometry(0.56,0.28),BAS({map:TABELA_TX}));yuz.position.z=0.027;const arka=yuz.clone();arka.rotation.y=Math.PI;arka.position.z=-0.027;
  g.add(kasa,yuz,arka);g.visible=false;scene.add(g);return g;})();
const UZATMA={t:-1,metin:''},AYAKTA=[0,0];
function tabelaYaz(s,s2){const g=TABELA_G;g.fillStyle='#050505';g.fillRect(0,0,32,16);
  if(s2==null)ctxText(g,s,(32-textW(s,2))>>1,1,'#3cff4a',2);
  else{ctxText(g,s,Math.max(0,8-(textW(s,1)>>1)),4,'#ff3a2a',1);ctxText(g,s2,Math.max(16,24-(textW(s2,1)>>1)),4,'#3cff4a',1);g.fillStyle='#333';g.fillRect(15,2,1,12);}
  TABELA_TX.needsUpdate=true;}

/* ---- top: beyaz, siyah beşgenli; hıza göre döner. Dışarıdaki ve çocukların elindeki yedek toplar tek çizimde ---- */
const TOP_R=0.14;
const topMesh=(()=>{const cv=mk(32,16),g=cv.getContext('2d');g.fillStyle='#f4f4ee';g.fillRect(0,0,32,16);g.fillStyle='#18181c';
  for(const [x,y] of[[2,3],[10,9],[18,3],[26,9],[6,13],[22,13]])g.fillRect(x,y,3,3);
  const m=new THREE.Mesh(new THREE.SphereGeometry(TOP_R,12,8),LAM({map:tx(cv,'n')}));scene.add(m);return m;})();
golgeTop(topMesh,TOP_R);
const EK_TOPLAR=new THREE.InstancedMesh(topMesh.geometry,topMesh.material,80);EK_TOPLAR.count=0;EK_TOPLAR.frustumCulled=false;scene.add(EK_TOPLAR);
/* ısınma konileri ve fotoğraf flaşları */
const KONILER=new THREE.InstancedMesh(new THREE.ConeGeometry(0.11,0.24,6),LAM({color:STIL.antrenman.koni}),64);KONILER.count=0;KONILER.frustumCulled=false;scene.add(KONILER);
const FLASLAR=[0,1,2,3,4,5].map(()=>{const f=glow(STIL.antrenman.flas,1.6,0);f.visible=false;scene.add(f);return{f,t:9};});let flasSira=0;
const TOP={px:0,py:0,pz:0,q:new THREE.Quaternion(),eksen:new THREE.Vector3(),dq:new THREE.Quaternion()},EK_M=new THREE.Matrix4();

/* ---- yazı tura parası ---- */
const para=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.01,12),LAM({color:0xe0c050}));para.visible=false;scene.add(para);
const PARA={t:-1,x:0,z:0};

/* ---- heyecan ve skor tabelası ---- */
const H=STIL.seyirci.heyecan,HEY={ev:0,dep:0,tutEv:0,tutDep:0};
function heyecanla(takim,deger,tut){if(takim!==1){HEY.ev=Math.max(HEY.ev,deger);if(tut)HEY.tutEv=tut;}if(takim!==0){HEY.dep=Math.max(HEY.dep,deger);if(tut)HEY.tutDep=tut;}}
let tabelaAnahtar='';
function tabelaGuncelle(){
  const ph=mac.phase,dk=mac.minuteLabel(),alt=MAC_ONCESI.includes(ph)?'MAÇ ÖNCESİ':ph==='halftime'?'DEVRE ARASI':ph==='fulltime'?'MAÇ SONU':'DAKİKA '+dk;
  const kalan=Math.round(cizgiDegeri(MAC_SENARYOSU.kalan,mac.sen.t)),tabelaAlt=ph==='isinma'?(kalan>0&&Math.floor(zaman/6)%2?'MAÇA '+kalan+' DK':'HOŞ GELDİNİZ'):alt;
  const k=mac.score.join('-')+tabelaAlt;if(k===tabelaAnahtar)return;tabelaAnahtar=k;
  TABELA.ciz(MAC_KADRO[0].kisa,MAC_KADRO[1].kisa,mac.score,tabelaAlt);
}
/* maç olayları: başkanın tepkisi, tribün heyecanı, bakış, para, tabela ve sevinç. Yazılı spiker yoktur (2.8A) */
function olay(ad,v){
  if(typeof baskanOlay==='function')baskanOlay(ad,v);
  switch(ad){
    case 'oncesi':if(v.ad==='takim0')heyecanla(0,H.santra*0.7,2);if(v.ad==='takim1')heyecanla(1,H.santra*0.7,2);
      if(v.x!=null){ONCESI_BAKIS.x=v.x;ONCESI_BAKIS.z=v.z-MOTOR_Z;ONCESI_BAKIS.t=zaman;}break;
    case 'flas':{const F=FLASLAR[flasSira++%FLASLAR.length];F.t=0;F.f.position.set(v.x,v.y,v.z-MOTOR_Z);break;}
    case 'giris':heyecanla(-1,H.giris,6);break;
    case 'mars':HEY.ev=HEY.dep=0;HEY.tutEv=HEY.tutDep=0;break;
    case 'yazitura':PARA.t=0;PARA.x=v.x;PARA.z=v.z-MOTOR_Z;break;
    case 'kickoff':heyecanla(-1,H.santra);break;
    case 'shot':heyecanla(v.p.team,H.sut);break;
    case 'header':if(v.shot)heyecanla(v.p.team,H.sut);break;
    case 'cross':heyecanla(v.p.team,H.sut*0.6);break;
    case 'save':heyecanla(v.p.team,H.kurtaris);break;
    case 'wood':if(v.p)heyecanla(v.p.team,H.direk);break;
    case 'yanAg':if(v.p)heyecanla(v.p.team,H.sut);break;
    case 'goal':
      heyecanla(v.team,H.gol,8);if(v.team===0){HEY.dep=0;HEY.tutDep=0;}else{HEY.ev=0;HEY.tutEv=0;}
      for(const a of AKTORLER)if((a.esofman||a.kaynak.tur==='kenar')&&a.kaynak.team===v.team)a.sevinc=6;
      AYAKTA[v.team?1:0]=6;break;
    case 'korner':heyecanla(v.team,H.sut*0.5);break;
    case 'faul':if(v.penalti)heyecanla(v.takim,H.gol*0.8,3);break;
    case 'kart':heyecanla(1-v.p.team,H.sut*0.7);break;
    case 'uzatma':UZATMA.t=0;UZATMA.metin='+'+v.dakika;tabelaYaz(UZATMA.metin);break;
    case 'degisiklik':UZATMA.t=0;tabelaYaz(String(v.cikan.no),String(v.giren.no));break;
    case 'secondhalf':heyecanla(-1,H.giris*0.7,3);break;
    case 'fulltime':{const s=v.score;if(s[0]!==s[1])heyecanla(s[0]>s[1]?0:1,H.macSonu,6);break;}
  }
}

/* ---- pozlar: sürekli karışım ---- */
const kar=(J,P,w)=>{if(w<=0.001)return;for(const k in P)J[k]=J[k]+(P[k]-J[k])*w;};
function yumusak(a,ad,hedef,hiz,dt){const v=a.w[ad]||0;a.w[ad]=v+(hedef-v)*Math.min(1,dt*hiz);return a.w[ad];}
function aciYumusak(a,h,dt,hiz){let d=h-a.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));a.yaw+=d*Math.min(1,dt*hiz);}
const yanPoz=(P,sol)=>sol?aynala(P):P;
const POZ_ETIKET=['esneme','tokalas','comel','foto','alkis','cember','yorgun','tutus'];
const tepe=(t,s)=>Math.sin(Math.PI*clamp(t/s,0,1));
function pozla(a,p,spd,dt){
  const run=Math.min(1,spd/7.5),hedefAmp=spd>0.3?0.18+run*0.8:0;a.amp+=(hedefAmp-a.amp)*Math.min(1,dt*8);
  /* adım: her adım bir yarım döngüdür; adım boyu hızla uzar (yürüyüşte ~0,8 m, depar ~2 m), böylece ayak yerde kaymaz (MM1) */
  if(spd>0.3)a.ph+=dt*Math.PI*spd/((0.7+0.15*spd)*(p&&p.boy||1));
  const s=Math.sin(a.ph),c=Math.cos(a.ph),A=a.amp,r=Math.min(1,a.amp);
  const J={lean:0.22*run,dy:Math.abs(c)*0.05*run-0.03*run,hx:0,lL:-s*A,lR:s*A,kL:Math.max(0,Math.sin(a.ph+1.4))*A*1.5+0.05,kR:Math.max(0,Math.sin(a.ph+Math.PI+1.4))*A*1.5+0.05,
    aL:s*A*0.75,aR:-s*A*0.75,eL:-(0.25+r*1.0),eR:-(0.25+r*1.0),aLz:-0.08,aRz:0.08};
  if(!p)return J;
  const ph=mac.phase,e=p.eylem,ad=e?e.ad:'',b=mac.ball;
  /* vuruş: geri salınım, temas, takip. Pas iç ayakla küçük, şut ve uzun top tam salınım */
  if(ad==='vurus'){const sol=e.ayak==='sol',kucuk=e.sec&&e.sec.tip==='yer'&&e.sec.tur!=='sut',G=yanPoz(kucuk?POSE.pasGeri:POSE.vurusGeri,sol),T=yanPoz(kucuk?POSE.pasTakip:POSE.vurusTakip,sol);
    if(e.faz==='geri')kar(J,G,clamp(e.ft/Math.max(0.05,e.geri),0,1));
    else if(e.faz==='takip'){const f=e.ft/0.26;if(f<0.35){kar(J,G,1);kar(J,T,f/0.35);}else kar(J,T,1-(f-0.35)/0.65);}}
  /* antrenman vuruşu: geri salınım, temas, takip */
  if(ad==='tekme'){const sol=e.ayak==='sol',G=yanPoz(e.kucuk?POSE.pasGeri:POSE.vurusGeri,sol),T=yanPoz(e.kucuk?POSE.pasTakip:POSE.vurusTakip,sol),f=e.t/e.sure;
    if(f<0.33)kar(J,G,f/0.33);else{const g=(f-0.33)/0.67;kar(J,G,Math.max(0,1-g*3));kar(J,T,g<0.3?g/0.3:1-(g-0.3)/0.7);}}
  /* maç günü pozları (motorun verdiği poz etiketi): esneme, tokalaşma, fotoğraf, alkış, kenetlenme, yorgunluk */
  for(const k of POZ_ETIKET){const w=yumusak(a,'p_'+k,p.poz===k?1:0,k==='tokalas'?10:5,dt);if(w<=0.001)continue;
    if(k==='esneme'){const f=0.5+0.5*Math.sin(zaman*0.9+a.ph);kar(J,POSE.esneme1,w*f);kar(J,POSE.esneme2,w*(1-f));}
    else if(k==='comel'&&p.kind==='foto')kar(J,POSE.fotoCek,w);
    else{kar(J,POSE[k],w);if(k==='alkis'){J.aLz+=Math.sin(zaman*15+a.ph)*0.22*w;J.aRz-=Math.sin(zaman*15+a.ph)*0.22*w;}}}
  if(ad==='degaj'){const f=e.t/e.sure;kar(J,POSE.vurusTakip,f<0.3?f/0.3:1-(f-0.3)/0.7);kar(J,POSE.tutus,Math.max(0,1-f*3));}
  if(ad==='kontrol')kar(J,POSE.kontrol,tepe(e.t,e.sure)*0.8);
  if(ad==='gogus')kar(J,POSE.gogus,tepe(e.t,e.sure));
  kar(J,POSE.kafa,yumusak(a,'kafa',ad==='kafa'?1:0,16,dt));
  if(ad==='mudahale')kar(J,POSE.mudahale,tepe(e.t,e.sure));
  kar(J,POSE.slide,yumusak(a,'kayma',ad==='kayma'?1:0,14,dt));
  if(ad==='blok')kar(J,POSE.blok,tepe(e.t,e.sure));
  if(ad==='dusus'||ad==='yerde')kar(J,ad==='dusus'?POSE.dusus:POSE.yerde,1);
  if(ad==='kalkis')kar(J,POSE.yerde,1-e.t/e.sure);
  if(ad==='yumruk')kar(J,POSE.yumruk,tepe(e.t,e.sure));
  if(ad==='elleAtis')kar(J,POSE.elleAtis,tepe(e.t,e.sure));
  if(ad==='itiraz'){kar(J,POSE.itiraz,Math.min(1,e.t*4)*Math.min(1,(e.sure-e.t)*4));J.aLz-=Math.sin(zaman*6)*0.15;J.aRz+=Math.sin(zaman*6)*0.15;}
  /* taç: top başın üstünde; atışta kollar öne */
  if(ad==='tac'){if(e.faz==='tut')kar(J,POSE.tac,1);else{const f=e.ft/0.34;kar(J,POSE.tac,1);kar(J,POSE.tacAt,f<1?f*f:Math.max(0,1-(e.ft-0.34)/0.3));}}
  if(ad==='atis'){const f=e.t/e.sure;kar(J,POSE.tac,f<0.4?f/0.4:0);kar(J,POSE.tacAt,f>=0.4?1-(f-0.4)/0.6:0);}
  /* top elde: kaleci tutuşu, duran topu taşıyan oyuncu, yedek topu tutan çocuk */
  const elde=b.tasiyan===p&&ad!=='tac';
  kar(J,p.rol==='GK'?POSE.tutus:POSE.tasi,yumusak(a,'elde',elde?1:0,10,dt));
  kar(J,POSE.sevinc,yumusak(a,'sevinc',p.sevinc?1:0,6,dt));
  kar(J,POSE.mars,yumusak(a,'mars',ph==='toren'&&p.tur!=='hakem'?1:0,3,dt));
  kar(J,POSE.dive,yumusak(a,'dive',ad==='ucus'?1:0,16,dt));
  /* hakem işaretleri */
  if(p.tur==='hakem'){
    if(ad==='duduk')kar(J,POSE.hakemDuduk,tepe(e.t,e.sure));
    if(ad==='yon')kar(J,POSE.hakemYon,tepe(e.t,e.sure));
    if(ad==='avantaj')kar(J,POSE.hakemAvantaj,tepe(e.t,e.sure));
    if(ad==='kart')kar(J,POSE.hakemKart,tepe(e.t,e.sure));
    if(ad==='penaltiGoster')kar(J,POSE.hakemPenalti,tepe(e.t,e.sure));
    if(ad==='bayrak')kar(J,POSE.bayrak,Math.min(1,e.t*6)*Math.min(1,(e.sure-e.t)*4));}
  if(p.sevinc)J.aLz+=Math.sin(zaman*8)*0.3,J.aRz-=Math.sin(zaman*8)*0.3;
  return J;
}
function uygula(a,J){for(const k of EKLEM)a.J[k]=J[k]||0;pose(a.m,a.J);}

/* ---- bakış: başkanın gözü olan biteni yumuşakça izler (kritik sönümlü yay) ----
   2.8O: yüksek locadan saha geniş görünür; baş topun her dokunuşunu izlemez. Odak noktası önce sahanın ortasına doğru sıkıştırılır
   (takip.x/z payı, xSinir), sonra takip.sure saniyede yumuşar (atak bölgesi); yay bu yumuşak noktaya döner. */
const BAKIS=new THREE.Vector3(...STIL.kameralar.baskan.hedef),BAKIS_HIZ=new THREE.Vector3(),BAKIS_HEDEF=new THREE.Vector3(),BAKIS_ATAK=new THREE.Vector3(...STIL.kameralar.baskan.hedef);
const ONCESI_BAKIS={x:0,z:0,t:-99};
function bakisOdagi(){
  const ph=mac.phase,b=mac.ball;
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
  /* kart gösterilirken hakeme (dördüncü hakem başkanın hemen önünde, ekranın altında zaten görünür) */
  const h=mac.refs[0];if(h.eylem&&h.eylem.ad==='kart')return BAKIS_HEDEF.set(h.x,1.3,h.z-MOTOR_Z);
  const f=mac.focus();return BAKIS_HEDEF.set(f.x,1,f.z-MOTOR_Z);
}
/* atak bölgesi: hedef sahanın ortasına sıkıştırılır ve zamanla yumuşatılır; duraklatmada (dt 0) yerinde kalır */
function bakisAtak(dt){
  const T=STIL.kameralar.baskan.takip,h=BAKIS_HEDEF;
  const x=clamp(h.x*T.x,-T.xSinir,T.xSinir),z=h.z*T.z,a=1-Math.exp(-dt/T.sure);
  BAKIS_ATAK.x+=(x-BAKIS_ATAK.x)*a;BAKIS_ATAK.z+=(z-BAKIS_ATAK.z)*a;BAKIS_ATAK.y=1;
  return BAKIS_ATAK;
}

/* ---- "Maça geç": maç öncesini atla ---- */
function macaGecIste(){if(!MAC_ONCESI.includes(mac.phase))return;mac.macaGec();for(const F of FLASLAR)F.t=9;}

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
    let gorunur=p.z>T.z-0.8&&(p.tur!=='oyuncu'||p.oyunda||p.cikiyor);
    /* yedek: kulübedeyken eşofman modeli, oyuna girince forma */
    if(a.esofman){const esofmanli=p.tur==='yedek'&&!p.cikti;a.esofman.root.visible=gorunur&&esofmanli;
      if(esofmanli){a.m.root.visible=false;const E=a.esofman;if(!gorunur)continue;
        const ax={m:E,J:a.J,w:a.w,amp:a.amp,ph:a.ph};const J=pozla(ax,p,p.oturuyor?0:p.spd,dts);a.amp=ax.amp;a.ph=ax.ph;
        if(p.oturuyor){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const kalk=yumusak(a,'kalk',a.sevinc>0||mac.phase==='toren'?1:0,5,dts);kar(J,POSE.otur,1-kalk);if(kalk>0.5&&a.sevinc>0){kar(J,POSE.sevinc,kalk);J.dy+=Math.abs(Math.sin(zaman*7))*0.25*kalk;}}
        for(const k of EKLEM)a.J[k]=J[k]||0;pose(E,a.J);aciYumusak(a,Math.atan2(Math.cos(p.yon),Math.sin(p.yon)),dts,8);
        E.root.position.set(a.x,0,a.z);E.root.rotation.set(0,a.yaw,0);continue;}}
    a.m.root.visible=gorunur;if(!gorunur)continue;
    const spd=p.oturuyor?0:(p.spd||0),e=p.eylem,ad=e?e.ad:'';
    /* dördüncü hakem tabelayı kaldırırken yüzü ana tribüne */
    if(a===DORDUNCU&&UZATMA.t>=0&&UZATMA.t<6){aciYumusak(a,Math.PI,dts,5);const J=pozla(a,p,0,dts);kar(J,POSE.tabela,yumusak(a,'tabela',1,5,dts));uygula(a,J);
      a.m.root.position.set(a.x,0,a.z);a.m.root.rotation.set(0,a.yaw,0);continue;}
    /* gövde yönü: motordaki bakış yönü (yon, x ekseninden açı) → modelin y dönüşü */
    /* gövde yönü motorda sınırlı hızla döner; çizim yalnız iki adım arasını yumuşatır (çift yumuşatma yok, MM1) */
    aciYumusak(a,Math.atan2(Math.cos(p.yon),Math.sin(p.yon)),dts,40);
    const J=pozla(a,p,spd,dts);
    if(p.tur==='kenar'){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const sv=yumusak(a,'kenarSevinc',a.sevinc>0?1:0,6,dts);
      if(p.oturuyor){kar(J,POSE.otur,1-sv);}
      if(sv>0.02){kar(J,POSE.sevinc,sv);J.dy+=Math.abs(Math.sin(zaman*7))*0.2*sv;}
      if(p.kind==='td')kar(J,POSE.isaret,yumusak(a,'isaret',Math.sin(zaman*0.7+p.team*2)>0.85&&mac.phase==='play'?1:0,4,dts));
      if(a===DORDUNCU)kar(J,POSE.tabela,yumusak(a,'tabela',0,5,dts));}
    else if(p.oturuyor)kar(J,POSE.otur,1);
    uygula(a,J);
    /* kök: kafa sıçrayışı, uçuş yuvarlanması, düşüp yerde yatma */
    let y=0,rx=0,rz=0;
    /* sıçrama yüksekliği motordan (p.yuk); kafa vuruşu pozu ayrıca */
    y=p.yuk||0;
    const dw=a.w.dive||0;
    if(dw>0.01){const yan=e&&e.ad==='ucus'?e.yan:(a.sonYan||1);a.sonYan=yan;const lx=-Math.sin(a.yaw)*yan;y=dw*((e&&e.y)||0.5)*0.6;rz=-Math.sign(lx||1)*1.35*dw;}
    const hedefDus=ad==='dusus'?clamp(e.t/e.sure,0,1):ad==='yerde'?1:ad==='kalkis'?1-e.t/e.sure:0;a.dus+=(hedefDus-a.dus)*Math.min(1,dts*18);
    if(a.dus>0.01){rx=1.45*a.dus;y+=0.12*a.dus;}
    a.m.root.position.set(a.x,y,a.z);a.m.root.rotation.set(rx,a.yaw,rz);
  }
  /* hakemin kartı */
  {const e=mac.refs[0].eylem;KART.visible=!!(e&&e.ad==='kart');if(KART.visible)KART.material.color.setHex(e.renk==='sari'?0xf2d21d:0xd8201e);}
  if(UZATMA.t>=0){UZATMA.t+=dts;if(UZATMA.t>7)UZATMA.t=-1;}
  /* uzatma tabelası dördüncü hakemin başının üstünde */
  {const w=DORDUNCU.w.tabela||0;UZATMA_TABELA.visible=w>0.5;if(UZATMA_TABELA.visible){UZATMA_TABELA.position.set(DORDUNCU.x,1.95+0.25*w,DORDUNCU.z+0.2);UZATMA_TABELA.rotation.set(0,Math.PI,0);}}
  /* top */
  {const by=lerp(TOP.py,b.y,al),vx=b.vx,vz=b.vz,v=Math.hypot(vx,vz);
   topMesh.position.set(bx,TOP_R+by,bz);
   if(v>0.05){TOP.eksen.set(vz/v,0,-vx/v);TOP.dq.setFromAxisAngle(TOP.eksen,v*dts/TOP_R);TOP.q.premultiply(TOP.dq);topMesh.quaternion.copy(TOP.q);}
   const icerde=b.z<T.z-0.8;topMesh.visible=!icerde;}
  /* dışarıda kalan toplar ve konilerin üstündeki yedek toplar */
  {let n=0;const E=EK_TOPLAR;
   for(const o of mac.disToplar){if(n>=80)break;EK_M.makeTranslation(o.x,TOP_R+o.y,o.z-MOTOR_Z);E.setMatrixAt(n++,EK_M);}
   for(const o of mac.sen.toplar){if(n>=80)break;EK_M.makeTranslation(o.x,TOP_R+o.y,o.z-MOTOR_Z);E.setMatrixAt(n++,EK_M);}
   for(const k of mac.koniler){if(!k.top||n>=80)continue;EK_M.makeTranslation(k.x,0.2+TOP_R,k.z-MOTOR_Z);E.setMatrixAt(n++,EK_M);}
   E.count=n;E.instanceMatrix.needsUpdate=true;
   let c=0;for(const k of mac.sen.koniler){if(c>=64)break;EK_M.makeTranslation(k.x,0.12,k.z-MOTOR_Z);KONILER.setMatrixAt(c++,EK_M);}
   for(const k of mac.koniler){if(c>=64)break;EK_M.makeTranslation(k.x,0.12,k.z-MOTOR_Z);KONILER.setMatrixAt(c++,EK_M);}
   KONILER.count=c;KONILER.instanceMatrix.needsUpdate=true;}
  /* flaşlar: bir an parlar, söner */
  for(const F of FLASLAR){F.t+=dts;F.f.visible=F.t<0.14;if(F.f.visible)F.f.material.opacity=1-F.t/0.14;}
  /* tribün: maç öncesi dolar; marşta ve golde ayağa kalkar */
  SEYIRCI_DOLU.value=cizgiDegeri(MAC_SENARYOSU.tribun,mac.sen.t);
  AYAKTA[0]=Math.max(0,AYAKTA[0]-dts);AYAKTA[1]=Math.max(0,AYAKTA[1]-dts);
  const marsta=mac.phase==='toren'||(mac.phase==='giris'&&mac.phaseT>8);
  SEYIRCI_AYAKTA.value.set(marsta||AYAKTA[0]>0?1:0,marsta||AYAKTA[1]>0?1:0);
  /* yazı tura */
  if(PARA.t>=0){PARA.t+=dts;const t=PARA.t;para.visible=t<3;
    const y=t<1.1?1.4+5.2*t-4.905*t*t*1.9:0.02;para.position.set(PARA.x+0.4,Math.max(0.02,y),PARA.z+0.3);para.rotation.x=t<1.1?t*40:0;if(t>3)PARA.t=-1;}
  /* heyecan söner; meşaleler coşkuyla çoğalır */
  HEY.tutEv=Math.max(0,HEY.tutEv-dts);HEY.tutDep=Math.max(0,HEY.tutDep-dts);
  if(HEY.tutEv<=0)HEY.ev=Math.max(0,HEY.ev-dts/H.sonme);if(HEY.tutDep<=0)HEY.dep=Math.max(0,HEY.dep-dts/H.sonme);
  SEYIRCI_HEYECAN.value.set(HEY.ev,HEY.dep);MESALE_COSKU=HEY.ev;
  tabelaGuncelle();
  golgeleriGuncelle();
  /* bakış yayı */
  bakisOdagi();const A=bakisAtak(Math.min(dt,0.05)),k=STIL.kameralar.baskan.yay,d=Math.min(dt,0.05);
  BAKIS_HIZ.addScaledVector(A.clone().sub(BAKIS),k*k*d).multiplyScalar(Math.max(0,1-2*k*d));BAKIS.addScaledVector(BAKIS_HIZ,d);
}
