/* ============ Chairman — maç sahnesi: maç motorunu (js/mac-motoru.js) '99 sahnesine bağlar ============
   Motor sabit adımla (1/60 sn) ilerler; çizim son iki adım arasında ara değer alır, böylece hareket ekran hızından bağımsız pürüzsüz akar.
   Gövde yönü motordaki gerçek bakış yönünden (yon) gelir. Pozlar sürekli karışır: koşu döngüsü hıza bağlı dalga; vuruşta
   geri salınım ve takip (vuran ayak tarafına göre), kontrol, göğüs, kafa sıçrayışı, müdahale, kayma, düşme ve kalkma,
   kaleci uçuşu ve tutuşu, taç, itiraz, sevinç; hakemde düdük, yön, avantaj, kart, penaltı; yan hakemde bayrak.
   Burada ayrıca: top toplayıcı çocuklar ve ellerindeki yedek toplar, dışarıda kalan toplar (N10; 2.8O'daki koniler kalktı), yedek kulübeleri, teknik direktörler, antrenörler, dördüncü hakem ve uzatma
   tabelası, fotoğrafçılar ve flaşları, antrenman topları ve koniler, yazı tura parası, top, gölgeler, tribünün dolması ve ayağa
   kalkması, tribün heyecanı, canlı skor tabelası ve başkanın bakışı. Yazılı spiker/radyo satırı 2.8A'da kaldırıldı.
   Faz 0 (2026-10-03): oyuncu pozları ve aktör yerleşimi js/animasyon.js'te (E akışı), başkanın bakışı ve kamera js/kamera.js'te (A akışı). */
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
const AKTORLER=[];
mac.players.forEach(p=>{const kd=MAC_KADRO[p.team],k=p.kayit||{},forma=p.rol==='GK'?kd.kaleciForma:kd.forma;
  AKTORLER.push(aktorKur(kitKaydi(forma,k,p.no),p,k.boy));});
const HAKEMLER=mac.refs.map((r,i)=>{const a=aktorKur({...KIT.hakem,num:0,skin:STIL.tenler[[1,4,2][i]],hair:['#8a8680','#3c2616','#241a12'][i],style:i?'short':'bald',mus:i===0,w:i?1:1.06},r);
  /* yan hakemin bayrağı: sol elde başlar; js/animasyon.js işarete ve koşuya göre sahaya yakın ele alır (A2b) */
  if(r.kind==='lin'){const bayrak=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.22),LAM({color:0xf2c11d,side:THREE.DoubleSide}));bayrak.position.set(0,-0.36,0.14);a.m.eR.add(bayrak);a.bayrak=bayrak;}
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
/* ---- top toplayıcılar (N10): sarı yelekli çocuklar; ellerindeki yedek top aşağıda EK_TOPLAR ile çizilir ---- */
mac.topcular.forEach((k,i)=>AKTORLER.push(aktorKur({...KIT.topcu,num:0,skin:STIL.tenler[(i*3)%5],hair:SACLAR[(i*2)%5],style:i%4?'short':'curly',h:STIL.topcuBoy.h,w:STIL.topcuBoy.w},k,STIL.topcuBoy.h)));
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
let tabelaAnahtar='',tabelaSabit='',tabelaBekle=0;
/* tabelanın alt satırı: oyunda canlı maç saati dakika:saniye (ör. 17:33; 2026-10-03 kullanıcı kararı). Uzatmada saymayı sürdürür (46:12, 91:05);
   ikinci yarı 45:00'ten başlar. Tabela yalnız yazı değişince yeniden çizilir; yalnız saat değiştiyse en çok saniyede 10 kez (hızlı oynatmada
   tuval yüklemesi her kareye binmez; skor ve durum hemen yazılır). dt gerçek süredir, duraklatmada 0. TABELA.yazi denemeler içindir */
function tabelaSaati(){const s=Math.max(0,Math.floor(mac.gameSec));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function tabelaGuncelle(dt){
  const ph=mac.phase,saat=!MAC_ONCESI.includes(ph)&&ph!=='halftime'&&ph!=='fulltime',alt=MAC_ONCESI.includes(ph)?'MAÇ ÖNCESİ':ph==='halftime'?'DEVRE ARASI':ph==='fulltime'?'MAÇ SONU':tabelaSaati();
  const kalan=Math.round(cizgiDegeri(MAC_SENARYOSU.kalan,mac.sen.t)),tabelaAlt=ph==='isinma'?(kalan>0&&Math.floor(zaman/6)%2?'MAÇA '+kalan+' DK':'HOŞ GELDİNİZ'):alt;
  tabelaBekle-=dt||0;
  const k=mac.score.join('-')+tabelaAlt;if(k===tabelaAnahtar)return;
  const sabit=mac.score.join('-')+(saat?'saat':tabelaAlt);if(sabit===tabelaSabit&&tabelaBekle>0)return;
  tabelaAnahtar=k;tabelaSabit=sabit;tabelaBekle=0.1;TABELA.yazi=tabelaAlt;
  TABELA.ciz(MAC_KADRO[0].kisa,MAC_KADRO[1].kisa,mac.score,tabelaAlt);
}
/* maç olayları: başkanın tepkisi, tribün heyecanı, bakış, para, tabela ve sevinç. Yazılı spiker yoktur (2.8A) */
function olay(ad,v){
  if(typeof baskanOlay==='function')baskanOlay(ad,v);
  /* kamera ve animasyon akışlarının olay kancaları (js/kamera.js, js/animasyon.js; Faz 0) */
  kameraOlay(ad,v);animasyonOlay(ad,v);
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
  /* aktörler: konum, poz ve kök (js/animasyon.js) */
  for(const a of AKTORLER)aktorGuncelle(a,al,dts,T);
  /* hakemin kartı (ikinci sarıda önce sarı, sonra kırmızı; A2b) */
  {const e=mac.refs[0].eylem;KART.visible=!!(e&&e.ad==='kart');if(KART.visible)KART.material.color.setHex(e.renk==='sari'||(e.renk==='ikinciSari'&&e.t<(e.sure||1.7)*0.5)?0xf2d21d:0xd8201e);}
  if(UZATMA.t>=0){UZATMA.t+=dts;if(UZATMA.t>7)UZATMA.t=-1;}
  /* uzatma tabelası dördüncü hakemin başının üstünde */
  {const w=DORDUNCU.w.tabela||0;UZATMA_TABELA.visible=w>0.5;if(UZATMA_TABELA.visible){UZATMA_TABELA.position.set(DORDUNCU.x,1.95+0.25*w,DORDUNCU.z+0.2);UZATMA_TABELA.rotation.set(0,Math.PI,0);}}
  /* top (js/animasyon.js) */
  topCiz(b,al,bx,bz,dts,T);
  /* dışarıda kalan toplar, antrenman topları ve top toplayıcıların elindeki yedek toplar */
  {let n=0;const E=EK_TOPLAR;
   for(const o of mac.disToplar){if(n>=80)break;EK_M.makeTranslation(o.x,TOP_R+o.y,o.z-MOTOR_Z);E.setMatrixAt(n++,EK_M);}
   for(const o of mac.sen.toplar){if(n>=80)break;EK_M.makeTranslation(o.x,TOP_R+o.y,o.z-MOTOR_Z);E.setMatrixAt(n++,EK_M);}
   for(const k of mac.topcular){if(!k.top||b.tasiyan===k||n>=80||k.z<mac.tunel.z-0.8)continue;const c=Math.cos(k.yon),s=Math.sin(k.yon);
     /* çömelen çocuğun topu kucağında (A2b; js/animasyon.js ANM_TOPCU: çömelme ağırlığı) */
     const cw=typeof ANM_TOPCU!=='undefined'?(ANM_TOPCU.get(k)||0):0;
     EK_M.makeTranslation(k.x+c*(0.22+0.06*cw),0.62-0.3*cw,k.z+s*(0.22+0.06*cw)-MOTOR_Z);E.setMatrixAt(n++,EK_M);}
   E.count=n;E.instanceMatrix.needsUpdate=true;
   let c=0;for(const k of mac.sen.koniler){if(c>=64)break;EK_M.makeTranslation(k.x,0.12,k.z-MOTOR_Z);KONILER.setMatrixAt(c++,EK_M);}
   KONILER.count=c;KONILER.instanceMatrix.needsUpdate=true;}
  /* flaşlar: bir an parlar, söner */
  for(const F of FLASLAR){F.t+=dts;F.f.visible=F.t<0.14;if(F.f.visible)F.f.material.opacity=1-F.t/0.14;}
  /* tribün: maç öncesi dolar; marşta ve golde ayağa kalkar */
  /* N9: seyirci saati (maç öncesi senaryo saati; çıkıştan sonra geç gelenler için maç zamanıyla); kapıdan yerine yürüyenler */
  {const A=seyirciSaatIlerlet(dts);SEYIRCI_DOLU.value=cizgiDegeri(MAC_SENARYOSU.tribun,A);seyirciKare(A);}
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
  tabelaGuncelle(dt);
  golgeleriGuncelle();
  /* bakış (js/kamera.js) */
  kameraAdim(dt);
}
