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
/* U1 (2026-10-12, kullanıcı kararı): izleme hızı. secim: oyuncunun seçimi (1, 2, 4; OYUN.ayarlar.macHizi — üst şeritteki düğmeler, 1/2/4 tuşları ve
   Ayarlar > Maç), oto: önemli anlarda 1× (OYUN.ayarlar.otoYavas; js/mac-izleme.js), deger: bu karenin etkin hızı (macKare ve kamera okur), hedef:
   izleme eğrisinin istediği hız, anda: önemli anın penceresinde mi (üst şeritteki gösterge). Geliştirici: ?hiz=1|2|4|8|16 sabit hız (önemli anda
   yavaşlamaz; &oto=1 ile yavaşlar), deneme panelinde 8×. Maçın sonucu hızdan bağımsızdır (adım hep 1/60 sn) */
const MAC_HIZ=(()=>{let s=null,oto=null;
  try{const q=new URLSearchParams(location.search),v=parseFloat(q.get('hiz'));if([1,2,4,8,16].includes(v)){s=v;oto=q.get('oto')==='1';}}catch(e){}
  const A=typeof OYUN!=='undefined'&&OYUN.ayarlar?OYUN.ayarlar:null;
  if(s==null){s=A&&[1,2,4].includes(A.macHizi)?A.macHizi:1;oto=!(A&&A.otoYavas===false);}
  return{secim:s,oto,deger:s,hedef:s,anda:false};})();
/* ?tohum=123 ile aynı maç yeniden oynatılabilir */
const MAC_TOHUM=(()=>{try{const v=parseInt(new URLSearchParams(location.search).get('tohum'),10);return Number.isFinite(v)?v:null;}catch(e){return null;}})();
/* B4: ?tarz=A,B iki takımın tarzı (js/mac-tarz.js arketip adları; geliştirici); yoksa maç iki tarzı tohumdan seçer ('dagilim') */
const MAC_TARZ=(()=>{try{const v=new URLSearchParams(location.search).get('tarz'),a=v?v.split(','):[];if(a.length===2&&a.every(x=>Object.prototype.hasOwnProperty.call(TARZ_ARKETIP,x)))return a;}catch(e){}
  return 'dagilim';})();
/* DURAKLAT: eski ad; ortak duraklatma yönetimini okur (js/sunum-durumu.js, 2.8B) */
const olayKuyrugu=[],DURAKLAT={get aktif(){return duraklatmaVar();}};
/* maç sonunda takımların alkışlayacağı tribünün önü (motor koordinatı): ev taraftarının ve deplasman bölümünün tribünü */
function tribunOnu(taraftar){
  for(const tr of STAT.tribunler){const b=tr.taraftar===taraftar?{from:0,to:0}:(tr.bolumler||[]).find(b=>b.taraftar===taraftar);if(!b)continue;
    const u=(b.from+b.to)/2;
    return{ana:{x:clamp(u,-40,40),z:3.5,nx:0,nz:-1},karsi:{x:clamp(u,-40,40),z:PW-3.5,nx:0,nz:1},kale1:{x:-PL+3.5,z:MZ+clamp(u,-22,22),nx:-1,nz:0},kale2:{x:PL-3.5,z:MZ+clamp(u,-22,22),nx:1,nz:0}}[tr.yer];}
  return null;}
/* T10e: atmosfer (hakemin ev sahibi eğilimi, deplasmanın güven tabanı) maç günü tarifinin doluluğundan.
   F1-b (2026-10-23): kadrolar ve tohum bu sayfanın maç gününden (js/mac-gunu.js MAC_GUNU): kariyerden açılan maçta kariyerin kadroları ve maçın
   kimliğinden türeyen tohum (adresteki ?tohum ve ?tarz yok sayılır), geliştirme adreslerinde eskisi gibi. F3-a (2026-10-24): kariyer maçında
   iki takımın tarzı hocalarının tarzıdır (MAC_GUNU.tarz; js/hoca.js), F3'ten önce tohumdan çekilirdi ('dagilim') */
const MAC_SECENEK={kadro:MAC_GUNU.kadro,tunel:{x:TUNEL.x,z:TUNEL.z+MOTOR_Z},tohum:MAC_GUNU.kariyer?MAC_GUNU.tohum:MAC_TOHUM,tarz:MAC_GUNU.kariyer?MAC_GUNU.tarz.slice():MAC_TARZ,zemin:STAT.zemin,kosullar:{atmosfer:clamp(MAC_GUNU.doluluk,0,1)},
  kulubeler:KULUBELER.map(k=>({takim:k.takim,koltuklar:k.koltuklar.map(s=>({x:s.x,z:s.z+MOTOR_Z})),alan:{x:k.alan.x,z:k.alan.z+MOTOR_Z}})),
  taraftarYeri:tribunOnu('ev')||undefined,deplasmanYeri:tribunOnu('deplasman')};
/* U1: izleme (js/mac-izleme.js) — ana motorun her olayı ikizinkiyle karşılaştırılır; aynı seçenek ve tohumla kurulan ikiz önemli anları önceden
   bildirir. Kurucunun kendi olayları (izleme kurulmadan) karşılaştırılmaz */
let MAC_IZLEME=null;
const mac=new Match((ad,v)=>{olayKuyrugu.push([ad,v]);if(MAC_IZLEME)izlemeAnaOlay(MAC_IZLEME,ad,v);},MAC_SECENEK);
MAC_IZLEME=izlemeKur(mac,Match,MAC_SECENEK);
/* ---- F7 (2026-10-24; yol haritası 3.8): haftanın öbür maçları — görüntüsüz, kilit adımlı ----
   Kariyer maçında haftanın öbür yedi maçı (MAC_GUNU.digerleri; seçenekleri js/lig-maclari.js digerMacSecenegi) bu sayfada görüntüsüz oynanır:
   santrayı ilk adımda alırlar (maç öncesi yok), bizim santramızdan sonra bizim motorun attığı her adımda birer adım atarlar — hepsi 19:00'da
   başlayan maçlar gibi; duraklatma ve telefon onları da durdurur, izleme hızı onları da hızlandırır (ligCanliAdim). Olayları dinlenmez; Canlı
   Skor skorlarını ve dakikalarını okur. H2-a: "Maçı bitir" perdesinin arkasında önce bizim maç hesaplanır, öbür maçlar o sırada adım atmaz;
   bizim maç bitince, kart açıkken ve "Odaya dön" beklerken kalanı bütçeli sürücü bitirir (ligCanliHizli). "Odaya dön" sayfayı dondurmadan
   bekler, sekiz sonucu tek komutla uygular (js/ekran-mac-sonu.js, js/lig-maclari.js haftaSonuclariUygula); eşzamanlı ligCanliBitir yalnız son
   çaredir. Aynı seçenek ve tohumla aynı motor (aynı tarayıcının işçisi ve ana ipliği) aynı maçı oynar. Node'daki araclar/sezon-deneme.js aynı seçeneği kurar ama
   V8 sürümlerinin Math işlevleri bit düzeyinde farklı olabildiğinden (RK7 ölçüsü: Chromium 153 ↔ Node 24'te sin, log, atan2 …) skorlar Node'da başka çıkabilir */
/* G1-a: hükmen öbür maçın motoru yoktur; sonucu hemen bellidir (son). G1-e: işçi kipinde (js/mac-arka.js) öbür maçlar ve bizim maçın sonuç ikizi
   Web Worker'da oynanır (m null; son ve ornekler işçiden gelir); işçi yoksa ya da bozulursa ana iplikte kilit adımlı motorlar (ligCanliKur) */
const LIG_CANLI=MAC_GUNU.kariyer&&Array.isArray(MAC_GUNU.digerleri)?MAC_GUNU.digerleri.map(d=>({d,m:null,son:d.hukmen?hukmenSonucu(d.hukmen):null,ornekler:null})):[];
/* ana iplik kipi: motorları kurar ve bizim santramızdan beri geçen adım kadar ilerletir (işçi sonradan bozulursa) */
function ligCanliKur(adim){for(const x of LIG_CANLI)if(!x.son&&!x.m){x.m=new Match(()=>{},x.d.secenek);x.m.macaGec();for(let i=0;i<adim&&x.m.phase!=='fulltime';i++)x.m.step(ADIM);}}
/* H2-a: işçi düşünce donma yok — bizim maç bittiyse ya da perdenin arkasında hesaplanıyorsa motorlar sıfır adımla kurulur, kalanı ligCanliHizli
   bütçeyle bitirir (kartın arkasında ya da Odaya dön beklerken). Maç izlenirken düşerse bugünkü kısa yetişme (kilit adım) kalır */
MAC_ARKA.dusus=()=>ligCanliKur(HIZLI_BITIR.bitti||HIZLI_BITIR.anlik||HIZLI_BITIR.perde||mac.phase==='fulltime'||MAC_ARKA.T0===null?0:Math.max(0,(mac.kare||0)-MAC_ARKA.T0));
if(!arkaBaslat(LIG_CANLI,MAC_GUNU.hukmen?null:Object.assign({},MAC_SECENEK,{tohum:mac.tohum})))ligCanliKur(0);
function ligCanliAdim(n){for(const x of LIG_CANLI)if(x.m)for(let i=0;i<n&&x.m.phase!=='fulltime';i++)x.m.step(ADIM);}
const ligCanliSuruyor=()=>LIG_CANLI.some(x=>x.m?x.m.phase!=='fulltime':!x.son);
/* kalan adımlar (güvenlik sınırı maç başına 60 dk'lık adım); dönüşte bitmiş mi */
function ligCanliBitir(){
  for(const x of LIG_CANLI){
    if(x.m){for(let i=0;i<60*60*80&&x.m.phase!=='fulltime';i++)x.m.step(ADIM);}
    else if(!x.son){const R=arkaMacOynat(Match,x.d.secenek,{});if(R.bitti){x.son=R.son;x.ornekler=R.ornekler;}}}   /* G1-e: işçiden gelmeyen (son çare) */
  return!ligCanliSuruyor();}   /* motorun son çaresi (MAC_SON_CARE) her maçı bu sınırdan önce bitirir */
/* B4: geliştirici panelinde iki takımın tarzı (TEST; oyun ekranına tarz adı yazılmaz — F). Geçişte harmanın payları ve durum */
function tarzTestYaz(){const e=document.getElementById('tarzTest');if(!e)return;
  const y=t=>{const g=tarzGecisDurum(mac,t);return tarzAdi(mac,t)+(g==='talimat'?' (talimat: bir sonraki duruşta)':g!=null?' (geçişte)':'');};
  e.textContent='Ev: '+y(0)+' · Konuk: '+y(1);}
/* B4b: geliştirici panelinden tarz değişikliği (TEST; başkan maça dokunmaz — aynı kapıyı ileride hocanın maç içi kararı kullanır, F ve Z7-2). Komut iki
   motora aynı karede verilir (js/mac-izleme.js izlemeKomut): ikiz önden gittiği için talimat ana motorda ~7 sn sonra işler, önemli anları önceden
   bilmek bozulmaz. Geçişin kendisi js/mac-tarz.js tarzDegistir (duruşta başlar, tarzGecis sn'de oturur) */
function tarzTestDegistir(t,ad){const k=izlemeKomut(MAC_IZLEME,mac,(Z,k)=>tarzDegistir(Z,t,ad,k));tarzDegistir(mac,t,ad,k);arkaIkizKomut({t,hedef:ad,kare:k});tarzTestYaz();}
let tarzTestSay=0;
tarzTestYaz();

/* ---- aktörler: motordaki her oyuncu, hakem ve top toplayıcı için bir model ---- */
const AKTORLER=[];
mac.players.forEach(p=>{const kd=MAC_GUNU.kadro[p.team],k=p.kayit||{},forma=p.rol==='GK'?kd.kaleciForma:kd.forma;
  AKTORLER.push(aktorKur(kitKaydi(forma,k,p.no),p,k.boy));});
const HAKEMLER=mac.refs.map((r,i)=>{const a=aktorKur({...KIT.hakem,num:0,skin:STIL.tenler[[1,4,2][i]],hair:['#8a8680','#3c2616','#241a12'][i],style:i?'short':'bald',mus:i===0,w:i?1:1.06},r);
  /* yan hakemin bayrağı: sol elde başlar; js/animasyon.js işarete ve koşuya göre sahaya yakın ele alır (A2b) */
  if(r.kind==='lin'){const bayrak=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.22),LAM({color:0xf2c11d,side:THREE.DoubleSide}));bayrak.position.set(0,-0.36,0.14);a.m.eR.add(bayrak);a.bayrak=bayrak;}
  AKTORLER.push(a);return a;});
/* hakemin kartı: elinde küçük sarı/kırmızı kart */
const KART=new THREE.Mesh(new THREE.PlaneGeometry(0.08,0.11),LAM({color:0xf2d21d,side:THREE.DoubleSide}));KART.position.set(0,-0.36,0.04);KART.visible=false;HAKEMLER[0].m.eL.add(KART);
/* S1d (2026-10-20): hakemin not defteri — sol elde, yalnız deftere yazarken (motorda hakem eylemi 'not'; STIL.animasyon.s1.kart 0'da çizilmez) */
const DEFTER=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.12,0.015),LAM({color:STIL.animasyon.s1.defterRenk}));DEFTER.position.set(0,-0.33,0.05);DEFTER.visible=false;HAKEMLER[0].m.eR.add(DEFTER);

/* ---- yedekler: motordaki kulübe oyuncuları. Kulübede eşofmanla oturur, oyuna girince formayla görünür ---- */
mac.yedekler.forEach((Y,t)=>Y.forEach(y=>{const kd=MAC_GUNU.kadro[t],k=y.kayit||{};
  const a=aktorKur(kitKaydi(y.rol==='GK'?kd.kaleciForma:kd.forma,k,k.no),y,k.boy);
  const m2=player(kitKaydi(kd.forma==='ev'?'yedekEv':'yedekDeplasman',k,k.no));   /* F1-b: eşofman takım sırasından değil formadan */m2.root.rotation.order='YXZ';scene.add(m2.root);golgeEkle(m2);
  a.esofman=m2;AKTORLER.push(a);}));
/* ---- saha kenarı: teknik direktörler, kaleci antrenörleri, kondisyonerler, dördüncü hakem, fotoğrafçılar (motordaki kenar kişileri) ---- */
const SACLAR=['#241a12','#141212','#3c2616','#8a8680','#5a4028'];
const DORDUNCU=(()=>{let d=null;mac.kenar.forEach((p,i)=>{
  const bak={ten:[0,1,2,3,4][(i*3+1)%5],sacRenk:SACLAR[(i*7)%5],sac:['kisa','kel','kivircik','kisa','uzun'][(i*5)%5],biyik:i%3===0,boy:0.95+((i*37)%10)/100,yapi:0.95+((i*53)%14)/100};
  let K;
  if(p.kind==='td')K=kitKaydi('takimElbise',MAC_GUNU.kadro[p.team].td,0);
  else if(p.kind==='dorduncu')K={...KIT.hakem,num:0,skin:STIL.tenler[0],hair:'#3c2616',style:'short'};
  else K=kitKaydi(p.kind==='foto'?'foto':p.kind==='saglikci'?'saglikci':MAC_GUNU.kadro[p.team].forma==='ev'?'antrenorEv':'antrenorDeplasman',bak,0);   /* T10f: sağlıkçı */
  const a=aktorKur(K,p,K.h);AKTORLER.push(a);if(p.kind==='dorduncu')d=a;});return d;})();
/* ---- top toplayıcılar (N10): sarı yelekli çocuklar; ellerindeki yedek top aşağıda EK_TOPLAR ile çizilir ---- */
mac.topcular.forEach((k,i)=>AKTORLER.push(aktorKur({...KIT.topcu,num:0,skin:STIL.tenler[(i*3)%5],hair:SACLAR[(i*2)%5],style:i%4?'short':'curly',h:STIL.topcuBoy.h,w:STIL.topcuBoy.w},k,STIL.topcuBoy.h)));
/* uzatma tabelası: dördüncü hakemin elinde, yeşil ışıklı rakamlar */
const TABELA_CV=mk(32,16),TABELA_G=TABELA_CV.getContext('2d'),TABELA_TX=tx(TABELA_CV,'n');
const UZATMA_TABELA=(()=>{const g=new THREE.Group(),kasa=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.34,0.05),LAM({color:0x141416}));
  const yuz=new THREE.Mesh(new THREE.PlaneGeometry(0.56,0.28),BAS({map:TABELA_TX}));yuz.position.z=0.027;const arka=yuz.clone();arka.rotation.y=Math.PI;arka.position.z=-0.027;
  g.add(kasa,yuz,arka);g.visible=false;scene.add(g);return g;})();
const UZATMA={t:-1,metin:''},AYAKTA=[0,0];
/* T10f: sedye (motor m.sedye {x, z, yon, p}): iki sap ve bez, sağlıkçıların el hizasında; sakat üstünde yatar (js/animasyon.js kökü 0,72 m) */
const SEDYE=(()=>{const g=new THREE.Group(),C=STIL.sedye,cer=LAM({color:C.cerceve}),bez=new THREE.Mesh(new THREE.BoxGeometry(0.56,0.03,1.85),LAM({color:C.bez}));
  bez.position.y=0.02;g.add(bez);for(const s of[-1,1]){const sap=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,2.3),cer);sap.position.set(s*0.3,0.02,0);g.add(sap);}
  g.visible=false;scene.add(g);return{g,a:null,p:null};})();
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
  const anlik=HIZLI_BITIR.anlik&&HIZLI_BITIR.sonuc,skor=anlik?HIZLI_BITIR.sonuc.skor:mac.score;   /* G1-e: ikizle bitince sonuç (H2-a: kopyadan) */
  const ph=anlik?'fulltime':mac.phase,saat=!MAC_ONCESI.includes(ph)&&ph!=='halftime'&&ph!=='fulltime',alt=MAC_ONCESI.includes(ph)?'MAÇ ÖNCESİ':ph==='halftime'?'DEVRE ARASI':ph==='fulltime'?'MAÇ SONU':tabelaSaati();
  const kalan=Math.round(cizgiDegeri(MAC_SENARYOSU.kalan,mac.sen.t)),tabelaAlt=ph==='isinma'?(kalan>0&&Math.floor(zaman/6)%2?'MAÇA '+kalan+' DK':'HOŞ GELDİNİZ'):alt;
  tabelaBekle-=dt||0;
  const k=skor.join('-')+tabelaAlt;if(k===tabelaAnahtar)return;
  const sabit=skor.join('-')+(saat?'saat':tabelaAlt);if(sabit===tabelaSabit&&tabelaBekle>0)return;
  tabelaAnahtar=k;tabelaSabit=sabit;tabelaBekle=0.1;TABELA.yazi=tabelaAlt;
  TABELA.ciz(MAC_GUNU.kadro[0].kisa,MAC_GUNU.kadro[1].kisa,skor,tabelaAlt);
}
/* maç olayları: başkanın tepkisi, tribün heyecanı, bakış, para, tabela ve sevinç. Yazılı spiker yoktur (2.8A) */
function olay(ad,v){
  if(typeof baskanOlay==='function')baskanOlay(ad,v);
  /* animasyon akışının olay kancası (js/animasyon.js; kamera bakışı aşamalardan ve toptan okur, olay gerekmez) */
  animasyonOlay(ad,v);
  if(typeof pulOlay==='function')pulOlay(ad,v);   /* E: 2D olay simgeleri (js/pul.js) */
  switch(ad){
    case 'tarzGecis':tarzTestYaz();break;   /* B4b: geçiş başladı ya da bitti (panel satırı) */
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
      for(const a of AKTORLER)if((a.esofman||a.kaynak.tur==='kenar')&&a.kaynak.team===v.team)a.sevinc=v.sevincT?Math.min(10,0.6*v.sevincT):6;   /* S1c: sevinç süresinden */
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



/* ---- "Santraya geç" (F3-0, 2026-10-24, kullanıcı kararı): maç öncesi görüntüsüz doğal sonuna oynatılır ----
   Eskiden motor basıldığı karede santraya sıçrardı (mac.macaGec): yazı tura ve maçın geri kalanı o anki rastlantı durumundan çekildiği için aynı
   tohumla basma anına göre farklı maç oynanırdı; sonuç kariyere kalıcı işlendiğinden (F2) sayfa kapatılıp başka anda basılarak sonuç yeniden
   çekilebilirdi. Şimdi kalan ısınma, tören, tokalaşma, fotoğraf ve yazı tura her karede en çok SANTRA_HIZLI.butce ms görüntüsüz oynanır
   (HIZLI_BITIR'in kalıbı; duraklatma ve telefon kare dt'sini 0 yaptığı için o da durur). İkiz motor maç öncesinde ana motorla aynı karede yürür,
   her adımda birlikte ilerler (izlemeAdim; tek karede büyük sıçrama yok). Basılsa da basılmasa da, ne zaman basılsa da maç aynıdır. Aradaki olaylar
   sunuma verilmez; santraya geçilen adımın olayları verilir. mac.macaGec motorda kalır: araçlar (Node, maç öncesisiz denemeler) ve F7'nin
   görüntüsüz öbür maçları kullanır; bu sayfanın kendi maçı onu çağırmaz */
const SANTRA_HIZLI={aktif:false,butce:30};
function macaGecIste(){if(!MAC_ONCESI.includes(mac.phase)||SANTRA_HIZLI.aktif)return;SANTRA_HIZLI.aktif=true;}
function santraHizliAdim(dt){
  const S=SANTRA_HIZLI;if(!(dt>0))return 0;
  const t0=performance.now(),butce=HIZLI_BITIR.perde?HIZLI_BITIR.perdeButce:S.butce;let n=0;   /* H2-a: perdenin arkasında (çizim yok) daha geniş bütçe */
  while(MAC_ONCESI.includes(mac.phase)&&performance.now()-t0<butce){olayKuyrugu.length=0;mac.step(ADIM);n++;izlemeAdim(MAC_IZLEME);}
  for(const a of AKTORLER){a.px=a.kaynak.x;a.pz=a.kaynak.z;}
  {const b=mac.ball;TOP.px=b.x;TOP.py=b.y;TOP.pz=b.z;}
  birikim=0;zaman+=n*ADIM;
  if(MAC_ONCESI.includes(mac.phase))olayKuyrugu.length=0;
  else{S.aktif=false;PARA.t=-1;for(const F of FLASLAR)F.t=9;while(olayKuyrugu.length){const [ad,v]=olayKuyrugu.shift();olay(ad,v);}}
  return Math.min(n*ADIM,0.1);
}

/* ---- F2 (2026-10-23, kullanıcı isteği; GEÇİCİ TEST, yayından önce kaldırılır): "Maçı bitir" — kalan maç görüntüsüz oynanır ----
   Sonuç aynıdır (adım hep 1/60 sn; motor tohumlu); duraklatma ve telefon kare dt'sini 0 yaptığı için hesap da durur. Maç öncesinde basılırsa
   "Santraya geç" yolu izlenir (rakip başkanın karar anı atlanmaz; js/loca-giris.js), santradan sonra başlar. Aradaki olaylar sunuma verilmez
   (başkan tepkisi, pul simgeleri, flaş yığılmaz); maç sonu olayı verilir. Düğme js/arayuz.js, maç sonu kartı js/ekran-mac-sonu.js.
   H2-a (2026-10-26, kullanıcı isteği 5: "Maçı bitir" maçı izletmesin, sonuç gelsin): basılınca PERDE açılır — çizim durur, son kare donuk kalır
   (js/arayuz.js frame), üstünde "Maç hesaplanıyor…" örtüsü (js/ekran-mac-sonu.js #macHesap). İkiz hemen bırakılır (izlemeKapat; maç öncesinde
   de: izleme bitti, ikizi adımlamak iki kat iş olur). Perde açıkken santraHizliAdim ve hizliBitirAdim, kip ne olursa olsun her karede
   perdeButce ms adım atar. Yarış: perde açıkken her karenin başında sonuç ikizi (js/mac-arka.js) hazır mı diye bakılır (karar anı, tepe anı ya
   da loca girişi açık değilse) — hazırsa maç öncesinde de anlık dala geçilir; sonucun JSON kopyası HIZLI_BITIR.sonuc'a alınır (kart, tabela ve
   maç telefonu bundan okur; sonradan arkaDus MAC_ARKA.ikiz'i null yapsa da). İşçisiz yolda önce bizim maç: öbür maçlar bu sırada adım atmaz
   (sonuçları değişmez: her biri yalnız kendi seçeneğine ve tohumuna bağlı); kart açılınca ya da Odaya dön beklerken ligCanliHizli bitirir.
   Kariyersiz adreste kart yoktur: bizim maç bitince perde kalkar, çizim sürer. "Maçı izleme" (TEST, js/ekran-oda.js; adres izle=0) aynı yolu
   ilk kareden kullanır */
const HIZLI_BITIR={aktif:false,bekliyor:false,bitti:false,anlik:false,butce:30,perde:false,perdeButce:250,sonuc:null};
function hizliBitirIste(){
  const H=HIZLI_BITIR;if(H.aktif||H.bekliyor||H.anlik||mac.phase==='fulltime')return;
  H.bekliyor=true;H.perde=true;
  izlemeKapat(MAC_IZLEME);
  MAC_HIZ.anda=false;   /* izlemeHizi hızlı bitirmede çağrılmaz: şeritteki "önemli an" göstergesi yanık kalmasın (F2 incelemesi) */
  if(MAC_ONCESI.includes(mac.phase)&&typeof btnMacaGec!=='undefined'&&btnMacaGec.onclick)btnMacaGec.onclick();
}
/* her karenin başında (macKare): yarış ya da santradan sonra ve karar anı, tepe anı ya da loca girişi bitince ana iplikte başlar */
function hizliBitirHazir(){
  const H=HIZLI_BITIR;if(H.anlik||H.bitti||!(H.bekliyor||H.aktif))return;
  const engel=(typeof KARAR_ANI!=='undefined'&&KARAR_ANI.acik)||(typeof TEPE_AN!=='undefined'&&TEPE_AN.aktif)||(typeof LOCA_GIRIS!=='undefined'&&LOCA_GIRIS.aktif);
  /* G1-e, H2-a: sonuç ikizi hazırsa kart hemen ikizin sonucuyla açılır; canlı motor durur, tabela sonucu yazar */
  if(H.perde&&!engel&&mac.phase!=='fulltime'&&arkaIkizHazir()){
    Object.assign(H,{anlik:true,bitti:true,aktif:false,bekliyor:false,sonuc:JSON.parse(JSON.stringify(MAC_ARKA.ikiz.son))});SANTRA_HIZLI.aktif=false;
    olayKuyrugu.length=0;UZATMA.t=-1;PARA.t=-1;for(const F of FLASLAR)F.t=9;return;}
  if(!H.bekliyor||MAC_ONCESI.includes(mac.phase)||engel)return;
  H.bekliyor=false;if(mac.phase==='fulltime')return;
  olayKuyrugu.length=0;H.aktif=true;
}
/* bu karenin adımları; çizimin dts'ini döndürür. H2-a: yalnız bizim maç (öbür maçlar kart açılınca ligCanliHizli ile) */
function hizliBitirAdim(dt){
  const H=HIZLI_BITIR;if(!(dt>0))return 0;
  const t0=performance.now(),butce=H.perde?H.perdeButce:H.butce;let n=0;
  while(mac.phase!=='fulltime'&&performance.now()-t0<butce){mac.step(ADIM);n++;if(mac.phase!=='fulltime')olayKuyrugu.length=0;}
  const son=olayKuyrugu.filter(o=>o[0]==='fulltime');olayKuyrugu.length=0;
  for(const a of AKTORLER){a.px=a.kaynak.x;a.pz=a.kaynak.z;}
  {const b=mac.ball;TOP.px=b.x;TOP.py=b.y;TOP.pz=b.z;}
  birikim=0;zaman+=n*ADIM;
  if(mac.phase==='fulltime'){H.aktif=false;H.bitti=true;UZATMA.t=-1;PARA.t=-1;for(const F of FLASLAR)F.t=9;for(const [ad,v] of son)olay(ad,v);
    if(!MAC_GUNU.kariyer)H.perde=false;}   /* kariyersiz adreste kart yok: perde kalkar */
  return Math.min(n*ADIM,0.1);
}
/* F7, H2-a: öbür maçları bitiren sürücü — bizim maç bitti (hızlı ya da anlık) ya da kart açık ya da Odaya dön bekliyorsa kalan kilit adımlı motorlar
   görüntüsüz biter: perde ya da Odaya dön beklemesinde perdeButce, aksi hâlde butce ms. İşçide oynanan maçın motoru yoktur; onlar işçiden gelir
   (döngü yalnız canlı motor varken döner). Duraklatma ve telefon dt'yi 0 yapar (inceleme) */
function ligCanliHizli(dt){
  const H=HIZLI_BITIR,S=typeof MAC_SONU!=='undefined'?MAC_SONU:null;
  if(!(dt>0)||!(H.bitti||H.anlik||(S&&(S.acik||S.bekliyor)))||!ligCanliSuruyor())return;
  const canli=()=>LIG_CANLI.some(x=>x.m&&x.m.phase!=='fulltime'),butce=H.perde||(S&&S.bekliyor)?H.perdeButce:H.butce,t0=performance.now();
  while(canli()&&performance.now()-t0<butce)ligCanliAdim(1);}

/* U1: bu karenin etkin hızı — oyuncunun seçimi, önemli anlarda 1×'e iner (eğri motor zamanında: izlemeHedefHiz); seçim değişince ya da ikiz
   yokken (pencere olayla başlar) ani sıçrama olmasın diye gerçek zamanda saniyede en çok IZLEME_GECIS kat değişir. Duraklatmada (dt 0) değişmez */
const IZLEME_GECIS=8;
function izlemeHizi(dt){
  const H=MAC_HIZ,h=H.oto?izlemeHedefHiz(MAC_IZLEME,H.secim):H.secim;H.hedef=h;H.anda=H.oto&&H.secim>1&&izlemeAnda(MAC_IZLEME);
  if(!(dt>0))return;const d=h-H.deger,s=IZLEME_GECIS*dt;H.deger=Math.abs(d)<=s?h:H.deger+Math.sign(d)*s;
}
/* ---- her kare: motoru ilerlet, modelleri yerleştir ---- */
let birikim=0,zaman=0;
function macKare(dt){
  hizliBitirHazir();
  if(MAC_ARKA.T0===null&&!MAC_ONCESI.includes(mac.phase))MAC_ARKA.T0=mac.kare||0;   /* G1-e: Canlı Skor'un öbür maç saati bizim santramızdan */
  let dts;
  if(HIZLI_BITIR.anlik){dts=0;ligCanliHizli(dt);}   /* G1-e: sonuç ikizle bitti; canlı motor durur. H2-a: işçi düştüyse öbür maçlar kartın arkasında biter */
  else if(HIZLI_BITIR.aktif)dts=hizliBitirAdim(dt);   /* F2: "Maçı bitir (TEST)" */
  else if(SANTRA_HIZLI.aktif)dts=santraHizliAdim(dt);   /* F3-0: "Santraya geç" maç öncesini görüntüsüz bitirir */
  else{
  izlemeHizi(dt);
  dts=dt*MAC_HIZ.deger;zaman+=dts;birikim+=dts;
  let n=0;
  let nLig=0;
  while(birikim>=ADIM&&n<240){
    for(const a of AKTORLER){a.px=a.kaynak.x;a.pz=a.kaynak.z;}
    const b=mac.ball;TOP.px=b.x;TOP.py=b.y;TOP.pz=b.z;
    if(!MAC_ONCESI.includes(mac.phase))nLig++;   /* F7: öbür maçlar bizim santramızdan sonra adım adım */
    mac.step(ADIM);birikim-=ADIM;n++;
    while(olayKuyrugu.length){const [ad,v]=olayKuyrugu.shift();olay(ad,v);}
    izlemeAdim(MAC_IZLEME);   /* U1: ikiz motor (js/mac-izleme.js) */
  }
  if((tarzGecisDurum(mac,0)!=null||tarzGecisDurum(mac,1)!=null)&&++tarzTestSay%20===0)tarzTestYaz();   /* B4b: geçişte panel satırı */
  if(n>=240)birikim=0;
  ligCanliAdim(nLig);ligCanliHizli(dt);
  }
  arkaIkizKarsilastir(mac);   /* G1-e: doğal biten maçta ikizin sonucu aynı mı (bir kez) */
  const al=birikim/ADIM,b=mac.ball,bx=lerp(TOP.px,b.x,al),bz=lerp(TOP.pz,b.z,al)-MOTOR_Z,T=mac.tunel;
  /* aktörler: konum, poz ve kök (js/animasyon.js) */
  /* E (2026-10-23): 2D'de kopuş — figür animasyonu çalışmaz, pul motorun alanlarından beslenir (js/pul.js pulAktor; STIL.pul.kopus) */
  const KOP=typeof pulKopus==='function'&&pulKopus();
  if(KOP)for(const a of AKTORLER)pulAktor(a,al,dts,T);
  else{for(const a of AKTORLER)aktorGuncelle(a,al,dts,T);
    anmYardimIK(AKTORLER);}   /* A4-3: yerden kaldırma — iki bedenli kol IK'sı (bütün aktörler güncellendikten sonra) */
  pulKare(dts);   /* P1 (deneme): pul görünümü açıksa her modelin pulu kökünü izler (js/pul.js) */
  /* hakemin kartı (ikinci sarıda önce sarı, sonra kırmızı; A2b) */
  {const e=mac.refs[0].eylem;KART.visible=!KOP&&!!(e&&e.ad==='kart');if(KART.visible)KART.material.color.setHex(e.renk==='sari'||(e.renk==='ikinciSari'&&e.t<(e.sure||1.7)*0.5)?0xf2d21d:0xd8201e);
    DEFTER.visible=!KOP&&!!(e&&e.ad==='not'&&STIL.animasyon.s1.kart>0);   /* S1d: deftere yazma */
    if(!KOP)for(const H of HAKEMLER)if(H.bayrak)H.bayrak.visible=true;}   /* E: 2D'de gizlenen yan hakem bayrağı figür yoluna dönünce görünür */
  if(UZATMA.t>=0){UZATMA.t+=dts;if(UZATMA.t>7)UZATMA.t=-1;}
  /* uzatma tabelası dördüncü hakemin başının üstünde */
  {const w=DORDUNCU.w.tabela||0;UZATMA_TABELA.visible=w>0.5;if(UZATMA_TABELA.visible){UZATMA_TABELA.position.set(DORDUNCU.x,1.95+0.25*w,DORDUNCU.z+0.2);UZATMA_TABELA.rotation.set(0,Math.PI,0);}}
  /* T10f: sedye sakatın çizilen yerinde (aktörün ara değerli yeri), uzun ekseni motorun sedye yönünde */
  {const sd=mac.sedye;SEDYE.g.visible=!!sd;if(sd){if(SEDYE.p!==sd.p){SEDYE.p=sd.p;SEDYE.a=AKTORLER.find(a=>a.kaynak===sd.p)||null;}
    const A=SEDYE.a,x=A?A.x:sd.x,z=A?A.z:sd.z-MOTOR_Z;SEDYE.g.position.set(x,0.66,z);SEDYE.g.rotation.set(0,Math.PI/2-sd.yon,0);}}
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
