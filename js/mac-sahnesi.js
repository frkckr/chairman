/* ============ Demirkapı '99 — maç sahnesi: maç motorunu (js/mac-motoru.js) '99 sahnesine bağlar ============
   Motor sabit adımla (1/60 sn) ilerler; çizim son iki adım arasında ara değer alır, böylece hareket ekran hızından bağımsız pürüzsüz akar.
   Gövde yönü motordaki gerçek bakış yönünden (yon) gelir. Pozlar sürekli karışır: koşu döngüsü hıza bağlı dalga; vuruşta
   geri salınım ve takip (vuran ayak tarafına göre), kontrol, göğüs, kafa sıçrayışı, müdahale, kayma, düşme ve kalkma,
   kaleci uçuşu ve tutuşu, taç, itiraz, sevinç; hakemde düdük, yön, avantaj, kart, penaltı; yan hakemde bayrak.
   Burada ayrıca: top toplayıcılar ve yedek toplar, yedek kulübeleri, teknik direktörler, dördüncü hakem ve uzatma tabelası,
   yazı tura parası, top, gölgeler, tribün heyecanı, canlı skor tabelası, başkanın bakışı ve ekranın altındaki radyo satırı. */
const MOTOR_Z=34,ADIM=1/60;
const MAC_HIZ={deger:(()=>{try{const v=parseFloat(new URLSearchParams(location.search).get('hiz'));return [1,2,4,8,16].includes(v)?v:1;}catch(e){return 1;}})()};
/* ?tohum=123 ile aynı maç yeniden oynatılabilir */
const MAC_TOHUM=(()=>{try{const v=parseInt(new URLSearchParams(location.search).get('tohum'),10);return Number.isFinite(v)?v:null;}catch(e){return null;}})();
const olayKuyrugu=[],DURAKLAT={aktif:false};
const mac=new Match((ad,v)=>olayKuyrugu.push([ad,v]),{kadro:MAC_KADRO,tunel:{x:TUNEL.x,z:TUNEL.z+MOTOR_Z},tohum:MAC_TOHUM,zemin:STAT.zemin,
  kulubeler:KULUBELER.map(k=>({takim:k.takim,koltuklar:k.koltuklar.map(s=>({x:s.x,z:s.z+MOTOR_Z})),alan:{x:k.alan.x,z:k.alan.z+MOTOR_Z}}))});

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
mac.topcular.forEach((t,i)=>AKTORLER.push(aktorKur({...KIT.topcu,num:0,skin:STIL.tenler[(i*3)%5],hair:['#241a12','#141212','#3c2616'][i%3],style:i%4?'short':'curly',h:STIL.topcuBoy.h,w:STIL.topcuBoy.w},t)));
/* hakemin kartı: elinde küçük sarı/kırmızı kart */
const KART=new THREE.Mesh(new THREE.PlaneGeometry(0.08,0.11),LAM({color:0xf2d21d,side:THREE.DoubleSide}));KART.position.set(0,-0.36,0.04);KART.visible=false;HAKEMLER[0].m.eL.add(KART);

/* ---- yedekler: motordaki kulübe oyuncuları. Kulübede eşofmanla oturur, oyuna girince formayla görünür ---- */
mac.yedekler.forEach((Y,t)=>Y.forEach(y=>{const kd=MAC_KADRO[t],k=y.kayit||{};
  const a=aktorKur(kitKaydi(y.rol==='GK'?kd.kaleciForma:kd.forma,k,k.no),y,k.boy);
  const m2=player(kitKaydi(t?'yedekDeplasman':'yedekEv',k,k.no));m2.root.rotation.order='YXZ';scene.add(m2.root);golgeEkle(m2);
  a.esofman=m2;AKTORLER.push(a);}));
/* ---- teknik direktörler teknik alanda gezinir; dördüncü hakem ortada ---- */
const KENAR=[];
KULUBELER.forEach(kb=>{const kd=MAC_KADRO[kb.takim];
  const td=aktorKur(kitKaydi('takimElbise',kd.td,0),null,kd.td.boy);td.x=kb.alan.x;td.z=kb.alan.z;td.td=kb;td.takim=kb.takim;KENAR.push(td);});
const DORDUNCU=(()=>{const d=aktorKur({...KIT.hakem,num:0,skin:STIL.tenler[0],hair:'#3c2616',style:'short'},null);d.x=-5;d.z=-36.9;d.dorduncu=true;KENAR.push(d);return d;})();
/* uzatma tabelası: dördüncü hakemin elinde, yeşil ışıklı rakamlar */
const TABELA_CV=mk(32,16),TABELA_G=TABELA_CV.getContext('2d'),TABELA_TX=tx(TABELA_CV,'n');
const UZATMA_TABELA=(()=>{const g=new THREE.Group(),kasa=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.34,0.05),LAM({color:0x141416}));
  const yuz=new THREE.Mesh(new THREE.PlaneGeometry(0.56,0.28),BAS({map:TABELA_TX}));yuz.position.z=0.027;const arka=yuz.clone();arka.rotation.y=Math.PI;arka.position.z=-0.027;
  g.add(kasa,yuz,arka);g.visible=false;scene.add(g);return g;})();
const UZATMA={t:-1,metin:''};
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
const EK_TOPLAR=new THREE.InstancedMesh(topMesh.geometry,topMesh.material,48);EK_TOPLAR.count=0;EK_TOPLAR.frustumCulled=false;scene.add(EK_TOPLAR);
const TOP={px:0,py:0,pz:0,q:new THREE.Quaternion(),eksen:new THREE.Vector3(),dq:new THREE.Quaternion()},EK_M=new THREE.Matrix4();

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
/* radyo spikeri: her olay için kısa bir cümle */
let sonTacSoz=-99;
function olay(ad,v){
  if(typeof baskanOlay==='function')baskanOlay(ad,v);
  const ad1=p=>p?p.name:'';
  switch(ad){
    case 'giris':soyle('Takımlar hakemlerin arkasından sahaya çıkıyor. Tribünler ayakta!');heyecanla(-1,H.giris,6);break;
    case 'mars':soyle('İstiklal Marşı okunuyor.');HEY.ev=HEY.dep=0;HEY.tutEv=HEY.tutDep=0;break;
    case 'marsBitti':soyle('Kaptanlar ve hakem orta yuvarlakta, yazı tura atılacak.');break;
    case 'yazitura':soyle('Yazı turayı '+tAd(v.takim)+' kazandı; santra '+sLoc(tAd(v.takim))+'.');PARA.t=0;PARA.x=v.x;PARA.z=v.z-MOTOR_Z;break;
    case 'kickoff':soyle(mac.half===1?'Hakemin düdüğüyle maç başladı!':'İkinci yarı başladı!');heyecanla(-1,H.santra);break;
    case 'shot':soyle(v.p.name+(v.dist>20?' uzaktan deniyor…':' şutunu çekiyor…'));heyecanla(v.p.team,H.sut);break;
    case 'header':if(v.shot){soyle(v.p.name+' kafayı vurdu!');heyecanla(v.p.team,H.sut);}else if(v.tur==='indirme')soyle(v.p.name+' kafayla indirdi.');break;
    case 'cross':soyle(v.p.name+' ortaladı…');heyecanla(v.p.team,H.sut*0.6);break;
    case 'save':soyle(v.p.name+(v.catch?' topu kucakladı.':' uçtu, çeldi!'));heyecanla(v.p.team,H.kurtaris);break;
    case 'block':soyle(v.p.name+' şutu vücuduyla kesti.');break;
    case 'yumruk':soyle(v.p.name+' yumrukla uzaklaştırdı.');break;
    case 'wood':soyle('Direk! Top direkten döndü!');if(v.p)heyecanla(v.p.team,H.direk);break;
    case 'yanAg':soyle('Yan ağlar! Tribünler gol sandı.');if(v.p)heyecanla(v.p.team,H.sut);break;
    case 'goal':{const s=v.score,sc=v.scorer;
      soyle(v.own?'Olamaz! '+(sc?sc.name:'')+' topu kendi ağlarına gönderdi. Skor '+s[0]+'-'+s[1]+'.':'GOOOL! '+sGen(tAd(v.team))+' golünü '+(sc?sc.name:'')+' attı! Skor '+s[0]+'-'+s[1]+'.');
      heyecanla(v.team,H.gol,8);if(v.team===0){HEY.dep=0;HEY.tutDep=0;}else{HEY.ev=0;HEY.tutEv=0;}
      for(const a of KENAR)if(a.takim===v.team)a.sevinc=6;for(const a of AKTORLER)if(a.esofman&&a.kaynak.team===v.team)a.sevinc=6;break;}
    case 'korner':soyle('Korner, '+tAd(v.team)+'.');heyecanla(v.team,H.sut*0.5);break;
    case 'tac':if(zaman-sonTacSoz>20){sonTacSoz=zaman;soyle('Taç, '+tAd(v.team)+'. Top toplayıcı çocuk topu hemen veriyor.');}break;
    case 'kaleVurusu':soyle('Kale vuruşu.');break;
    case 'faul':soyle(v.penalti?'Penaltı! '+ad1(v.faulYapan)+' ceza sahasında '+sAcc(ad1(v.faulYiyen))+' düşürdü!':'Faul! '+ad1(v.faulYapan)+', '+sAcc(ad1(v.faulYiyen))+' düşürdü; hakem düdüğü çaldı.');
      if(v.penalti)heyecanla(v.takim,H.gol*0.8,3);break;
    case 'avantaj':soyle('Hakem avantaj verdi, oyun devam ediyor.');break;
    case 'kart':soyle(v.renk==='sari'?v.p.name+' sarı kart gördü.':v.renk==='ikinciSari'?'İkinci sarıdan kırmızı! '+v.p.name+' oyundan atıldı.':'Kırmızı kart! '+v.p.name+' oyundan atıldı.');
      heyecanla(1-v.p.team,H.sut*0.7);break;
    case 'ofsayt':soyle('Ofsayt! Yan hakem bayrağını kaldırdı.');break;
    case 'uzatma':UZATMA.t=0;UZATMA.metin='+'+v.dakika;tabelaYaz(UZATMA.metin);
      soyle('Dördüncü hakem tabelayı kaldırdı: '+v.dakika+' dakika uzatma.');break;
    case 'degisiklik':UZATMA.t=0;tabelaYaz(String(v.cikan.no),String(v.giren.no));
      soyle('Oyuncu değişikliği, '+tAd(v.takim)+': '+v.cikan.name+' çıkıyor, '+v.giren.name+' giriyor.');break;
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
const yanPoz=(P,sol)=>sol?aynala(P):P;
const tepe=(t,s)=>Math.sin(Math.PI*clamp(t/s,0,1));
function pozla(a,p,spd,dt){
  const run=Math.min(1,spd/7.5),hedefAmp=spd>0.3?0.18+run*0.8:0;a.amp+=(hedefAmp-a.amp)*Math.min(1,dt*8);
  if(spd>0.3)a.ph+=dt*(4.8+spd*0.95);
  const s=Math.sin(a.ph),c=Math.cos(a.ph),A=a.amp,r=Math.min(1,a.amp);
  const J={lean:0.22*run,dy:Math.abs(c)*0.05*run-0.03*run,hx:0,lL:-s*A,lR:s*A,kL:Math.max(0,Math.sin(a.ph+1.4))*A*1.5+0.05,kR:Math.max(0,Math.sin(a.ph+Math.PI+1.4))*A*1.5+0.05,
    aL:s*A*0.75,aR:-s*A*0.75,eL:-(0.25+r*1.0),eR:-(0.25+r*1.0),aLz:-0.08,aRz:0.08};
  if(!p)return J;
  const ph=mac.phase,e=p.eylem,ad=e?e.ad:'',b=mac.ball;
  /* vuruş: geri salınım, temas, takip. Pas iç ayakla küçük, şut ve uzun top tam salınım */
  if(ad==='vurus'){const sol=e.ayak==='sol',kucuk=e.sec&&e.sec.tip==='yer'&&e.sec.tur!=='sut',G=yanPoz(kucuk?POSE.pasGeri:POSE.vurusGeri,sol),T=yanPoz(kucuk?POSE.pasTakip:POSE.vurusTakip,sol);
    if(e.faz==='geri')kar(J,G,clamp(e.ft/Math.max(0.05,e.geri),0,1));
    else if(e.faz==='takip'){const f=e.ft/0.26;if(f<0.35){kar(J,G,1);kar(J,T,f/0.35);}else kar(J,T,1-(f-0.35)/0.65);}}
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
  kar(J,p.rol==='GK'?POSE.tutus:POSE.tasi,yumusak(a,'elde',elde||(p.tur==='topcu'&&p.top)?1:0,10,dt));
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

/* ---- bakış: başkanın gözü topu ve olan biteni yumuşakça izler (kritik sönümlü yay) ---- */
const BAKIS=new THREE.Vector3(...STIL.kameralar.baskan.hedef),BAKIS_HIZ=new THREE.Vector3(),BAKIS_HEDEF=new THREE.Vector3();
function bakisOdagi(){
  const ph=mac.phase,b=mac.ball;
  if(ph==='giris'){if(mac.phaseT<5)return BAKIS_HEDEF.set(TUNEL.x,1,TUNEL.z+3);let n=0,x=0,z=0;for(const a of AKTORLER)if(a.m.root.visible&&a.kaynak.tur!=='topcu'){x+=a.x;z+=a.z;n++;}return BAKIS_HEDEF.set(n?x/n:0,1,n?z/n:0);}
  if(ph==='toren')return BAKIS_HEDEF.set(0,1,MZ-9-MOTOR_Z);
  if(ph==='yazitura')return BAKIS_HEDEF.set(0,1,0);
  if(ph==='halftime')return BAKIS_HEDEF.set(0,1,TUNEL.z+10);
  if(ph==='fulltime'){if(mac.phaseT<12)return BAKIS_HEDEF.set(0,1,-6);return BAKIS_HEDEF.set(0,1,TUNEL.z+10);}
  /* kart gösterilirken hakeme (dördüncü hakem başkanın hemen önünde, ekranın altında zaten görünür) */
  const h=mac.refs[0];if(h.eylem&&h.eylem.ad==='kart')return BAKIS_HEDEF.set(h.x,1.3,h.z-MOTOR_Z);
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
    let gorunur=p.z>T.z-0.8&&(p.tur!=='oyuncu'||p.oyunda||p.cikiyor);
    /* yedek: kulübedeyken eşofman modeli, oyuna girince forma */
    if(a.esofman){const esofmanli=p.tur==='yedek'&&!p.cikti;a.esofman.root.visible=gorunur&&esofmanli;
      if(esofmanli){a.m.root.visible=false;const E=a.esofman;if(!gorunur)continue;
        const ax={m:E,J:a.J,w:a.w,amp:a.amp,ph:a.ph};const J=pozla(ax,p,p.oturuyor?0:p.spd,dts);a.amp=ax.amp;a.ph=ax.ph;
        if(p.oturuyor){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const kalk=yumusak(a,'kalk',a.sevinc>0?1:0,5,dts);kar(J,POSE.otur,1-kalk);if(kalk>0.5){kar(J,POSE.sevinc,kalk);J.dy+=Math.abs(Math.sin(zaman*7))*0.25*kalk;}}
        for(const k of EKLEM)a.J[k]=J[k]||0;pose(E,a.J);aciYumusak(a,Math.atan2(Math.cos(p.yon),Math.sin(p.yon)),dts,8);
        E.root.position.set(a.x,0,a.z);E.root.rotation.set(0,a.yaw,0);continue;}}
    a.m.root.visible=gorunur;if(!gorunur)continue;
    const spd=p.oturuyor?0:(p.spd||0),e=p.eylem,ad=e?e.ad:'';
    /* gövde yönü: motordaki bakış yönü (yon, x ekseninden açı) → modelin y dönüşü */
    aciYumusak(a,Math.atan2(Math.cos(p.yon),Math.sin(p.yon)),dts,ad==='vurus'?22:14);
    const J=pozla(a,p,spd,dts);if(p.oturuyor)kar(J,POSE.otur,1);uygula(a,J);
    /* kök: kafa sıçrayışı, uçuş yuvarlanması, düşüp yerde yatma */
    let y=0,rx=0,rz=0;
    if(ad==='kafa')y=0.32*tepe(e.t,e.sure)*(p.oz?0.6+p.oz.kafa*0.6:1);
    const dw=a.w.dive||0;
    if(dw>0.01){const yan=e&&e.ad==='ucus'?e.yan:(a.sonYan||1);a.sonYan=yan;const lx=-Math.sin(a.yaw)*yan;y=dw*((e&&e.y)||0.5)*0.6;rz=-Math.sign(lx||1)*1.35*dw;}
    const hedefDus=ad==='dusus'?clamp(e.t/e.sure,0,1):ad==='yerde'?1:ad==='kalkis'?1-e.t/e.sure:0;a.dus+=(hedefDus-a.dus)*Math.min(1,dts*18);
    if(a.dus>0.01){rx=1.45*a.dus;y+=0.12*a.dus;}
    a.m.root.position.set(a.x,y,a.z);a.m.root.rotation.set(rx,a.yaw,rz);
  }
  /* hakemin kartı */
  {const e=mac.refs[0].eylem;KART.visible=!!(e&&e.ad==='kart');if(KART.visible)KART.material.color.setHex(e.renk==='sari'?0xf2d21d:0xd8201e);}
  /* kulübe: yedekler oturur (golde ayağa fırlar), teknik direktör topu izleyerek gezinir; dördüncü hakem tabela kaldırır */
  if(UZATMA.t>=0){UZATMA.t+=dts;if(UZATMA.t>7)UZATMA.t=-1;}
  for(const a of KENAR){
    if(a.oturur){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const kalk=yumusak(a,'kalk',a.sevinc>0?1:0,5,dts);
      const J=pozla(a,null,0,dts);kar(J,POSE.otur,1-kalk);if(kalk>0.5){kar(J,POSE.sevinc,kalk);J.dy+=Math.abs(Math.sin(zaman*7))*0.25*kalk;}
      uygula(a,J);a.m.root.rotation.y=0;continue;}
    let hx=a.x;
    if(a.td){const oyunda=['play','durus','kickoff','goal'].includes(mac.phase);hx=oyunda?clamp(bx*0.25+a.td.alan.x,a.td.alan.x-3.5,a.td.alan.x+3.5):a.td.alan.x;}
    const dx=hx-a.x,spd=Math.min(1.6,Math.abs(dx)*1.5);a.x+=Math.sign(dx)*Math.min(Math.abs(dx),spd*dts);
    const tabelada=a.dorduncu&&UZATMA.t>=0;
    aciYumusak(a,tabelada?Math.PI:spd>0.3?Math.sign(dx)*Math.PI/2:Math.atan2(bx-a.x,bz-a.z),dts,4);
    const J=pozla(a,null,spd>0.3?spd:0,dts);
    if(a.td){a.sevinc=Math.max(0,(a.sevinc||0)-dts);kar(J,POSE.sevinc,yumusak(a,'sevinc',a.sevinc>0?1:0,6,dts));
      kar(J,POSE.isaret,yumusak(a,'isaret',Math.sin(zaman*0.7+a.takim*2)>0.85&&mac.phase==='play'?1:0,4,dts));}
    if(a.dorduncu)kar(J,POSE.tabela,yumusak(a,'tabela',tabelada&&UZATMA.t<6?1:0,5,dts));
    uygula(a,J);a.m.root.position.set(a.x,0,a.z);a.m.root.rotation.set(0,a.yaw,0);
  }
  /* uzatma tabelası dördüncü hakemin başının üstünde */
  {const w=DORDUNCU.w.tabela||0;UZATMA_TABELA.visible=w>0.5;if(UZATMA_TABELA.visible){UZATMA_TABELA.position.set(DORDUNCU.x,1.95+0.25*w,DORDUNCU.z+0.2);UZATMA_TABELA.rotation.set(0,Math.PI,0);}}
  /* top */
  {const by=lerp(TOP.py,b.y,al),vx=b.vx,vz=b.vz,v=Math.hypot(vx,vz);
   topMesh.position.set(bx,TOP_R+by,bz);
   if(v>0.05){TOP.eksen.set(vz/v,0,-vx/v);TOP.dq.setFromAxisAngle(TOP.eksen,v*dts/TOP_R);TOP.q.premultiply(TOP.dq);topMesh.quaternion.copy(TOP.q);}
   const icerde=b.z<T.z-0.8;topMesh.visible=!icerde;}
  /* dışarıdaki toplar ve çocukların elindeki yedek toplar */
  {let n=0;const E=EK_TOPLAR;
   for(const o of mac.disToplar){if(n>=48)break;EK_M.makeTranslation(o.x,TOP_R+o.y,o.z-MOTOR_Z);E.setMatrixAt(n++,EK_M);}
   for(const k of mac.topcular){if(!k.top||b.tasiyan===k||n>=48)continue;const c=Math.cos(k.yon),s=Math.sin(k.yon);EK_M.makeTranslation(k.x+c*0.22,0.62,k.z+s*0.22-MOTOR_Z);E.setMatrixAt(n++,EK_M);}
   E.count=n;E.instanceMatrix.needsUpdate=true;}
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
  bakisOdagi();const k=STIL.kameralar.baskan.yay,d=Math.min(dt,0.05);
  BAKIS_HIZ.addScaledVector(BAKIS_HEDEF.clone().sub(BAKIS),k*k*d).multiplyScalar(Math.max(0,1-2*k*d));BAKIS.addScaledVector(BAKIS_HIZ,d);
}
