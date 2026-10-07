#!/usr/bin/env node
/* ============ Chairman — maç deneme aracı ============
   Maç motorunu görüntüsüz, hızlıca oynatır ve maç istatistiklerini hedef tabloyla karşılaştırır.
   Kullanım:  node araclar/mac-deneme.js [maç sayısı, varsayılan 40] [ilk tohum, varsayılan 1] [seçenekler]
   - Motor dosyaları index.html'deki sırayla yüklenir: js/goruntu.js'ten önceki mantık dosyaları
     (stil ve stat tarifleri hariç; motor onlara bağlı değildir).
   - Her maç santradan başlar (maç öncesi atlanır). Tohum aynıysa maç da aynıdır.
   - Maçlar işlemci çekirdeği sayısı kadar paralel oynatılır.
   - Hedef dışında kalan satırlar "!" ile işaretlenir.
   - Seçenek --dizilis A,B: iki takımın dizilişi (MM2). Bilgi satırlarında takım savunması: ceza sahasında boşta rakip, çift markaj,
     karşı pres kazanımı, savunmada takım boyu/eni, kalecisiz süre.
   - MM0 (2026-10-02): hedefsiz bilgi satırları ve tekrarlanabilirlik denetimi (ilk tohum iki kez daha oynatılır; sonuç aynı
     olmalı, değilse çıkış kodu 1). Motor değişiklikleri bu satırlarla tabana göre karşılaştırılır (TEKNIK_PLAN §8).
   - 2026-10-03 (maç motoru güncellemesi, Faz 0):
     --json DOSYA            tohum başına sonuçları ve parmak izlerini yazar (araclar/taban/*.json)
     --karsilastir DOSYA     kayıtlı bir çalıştırmayla karşılaştırır: ölçüt farkı ± standart hata (aynı tohumlar)
       --ayni                tohum başına parmak izi birebir aynı olmalı; değilse ilk ayrılan kontrol noktası yazılır, çıkış kodu 1
     --senaryo AD [N]        araclar/senaryolar/AD.js senaryosunu çalıştırır (seyrek olaylar için; maç oynatmaz)
     MAC_DENEME_AYAR='{"anahtar":deger}'  motor koduna dokunmadan MOTOR_AYAR değerlerini değiştirir (ayar taraması)
     Parmak izi: her 30 adımda topun ve oyuncuların durumu (konum, hız, yön) FNV-1a ile özetlenir; 600 adımda bir kontrol noktası.
     Ölçüm rastlantı çekmez ve motorun önbellek yazan yöntemlerini (topYolu, topTahmin, yakalamaNoktasi, cerceveyeGider) çağırmaz;
     şutun kale çizgisini geçeceği yer topun bir kopyası üzerinde topFizikAdim ile bulunur.
     Eklenti ölçümleri: araclar/olcumler/*.js → module.exports={bilgi:[[ad,anahtar,basamak]], yeni:()=>({dinle(ad,v,m),adim(m),bitir(m)}), ozet?(sonuclar)}.
   - T0 (gerçekçilik planı, 2026-10-03): --json taban dosyasına ortam (Node sürümü, işletim sistemi, git) yazılır; --karsilastir tabanın ortamını
     basar, Node sürümü farklıysa "!" ile uyarır (çıkış kodu değişmez). Eklentinin ozet() tablosu bilgi satırlarından sonra basılır.
   - M0 (2026-10-07, araç ve hız): motor araclar/motor-yukle.js ile sıradan genel nesneli bağlamda yüklenir (sonuç aynı, motor ~belirgin hızlı).
     --isci N                işçi süreç sayısı (varsayılan: mantıksal çekirdeğin yarısı, yani fiziksel çekirdek; ortam MAC_DENEME_ISCI).
                             Ölçüm (i7-8565U, 4 çekirdek/8 iş parçacığı, 8 maç): 8 işçi 33,9 sn, 4 işçi 21,7 sn, 2 işçi 25,1 sn; dizüstü
                             işlemci bütün iş parçacıkları yüklenince güç sınırına takılır
     Tekrarlanabilirlik ayrı bir işçide, maçlarla aynı anda koşar: ilk tohum o işçide iki kez oynatılır (süreçler arası ve aynı süreçte art arda
     aynılık). 10 maç ve altında yalnız ilk 3 dakikası (18 kontrol noktası) oynatılır ("kısa"); --tam-tekrar ile bütünü.
     "Süre / 1000 motor adımı" paralel işçilerin birbirini yavaşlattığı süredir; tek süreç hız ölçüsü araclar/hiz-olcum.js'tedir. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),os=require('os'),{spawn}=require('child_process');
const ARG=process.argv.slice(2);
function secenek(ad,degerli){const i=ARG.indexOf(ad);if(i<0)return null;if(!degerli){ARG.splice(i,1);return true;}return ARG.splice(i,2)[1];}
/* seçenek: --dizilis A,B  iki takımın dizilişini kadro verisine dokunmadan değiştirir (ör. 4-3-3,4-2-3-1; MM2) */
const DIZILIS=secenek('--dizilis',true)||process.env.MAC_DENEME_DIZILIS||'';
const JSON_DOSYA=secenek('--json',true),KARSILASTIR=secenek('--karsilastir',true),AYNI=!!secenek('--ayni',false),SENARYO=secenek('--senaryo',true);
const ISCI=parseInt(secenek('--isci',true)||process.env.MAC_DENEME_ISCI||'0',10),TAM_TEKRAR=!!secenek('--tam-tekrar',false);
const AYAR=process.env.MAC_DENEME_AYAR||'';
/* T0: taban dosyasına yazılan çalışma ortamı (Node sürümü, işletim sistemi, git sürümü) */
const ORTAM=(()=>{let git=null;try{git=require('child_process').execSync('git rev-parse --short HEAD',{cwd:__dirname,stdio:['ignore','pipe','ignore']}).toString().trim()||null;}catch(e){}
  return{node:process.version,platform:process.platform,arch:process.arch,git};})();
const MAC_SAYISI=Math.max(1,parseInt(ARG[0]||'40',10));
const ILK_TOHUM=parseInt(ARG[1]||'1',10);

/* ---- motoru yükle (M0: araclar/motor-yukle.js) ---- */
const {ctx,mantik,kip:BAGLAM}=require('./motor-yukle').motorYukle();
if(AYAR){let o;try{o=JSON.parse(AYAR);}catch(e){console.error('MAC_DENEME_AYAR geçerli JSON değil: '+e.message);process.exit(2);}
  const yok=Object.keys(o).filter(k=>!vm.runInContext(`Object.prototype.hasOwnProperty.call(MOTOR_AYAR,${JSON.stringify(k)})`,ctx));
  if(yok.length){console.error('MAC_DENEME_AYAR: MOTOR_AYAR içinde olmayan anahtar: '+yok.join(', '));process.exit(2);}
  vm.runInContext(`Object.assign(MOTOR_AYAR,${JSON.stringify(o)})`,ctx);}
/* eklenti ölçümleri */
const OLCUM_KLASOR=path.join(__dirname,'olcumler');
const EKLENTILER=fs.existsSync(OLCUM_KLASOR)?fs.readdirSync(OLCUM_KLASOR).filter(f=>f.endsWith('.js')).sort().map(f=>Object.assign({dosya:f},require(path.join(OLCUM_KLASOR,f)))):[];

/* ---- hedef tablo: 10 dakikalık, kesintisiz maç (2026-09-28'de gözden geçirildi; bkz. YOL_HARITASI.md kararları) ----
   Oyuncular gerçek hızda koştuğu için bir maçta ~7 dakika (≈400 sn) oyun oynanır; gerçek bir maçta bu ~55 dakikadır.
   Gerçekçi kararlarla motor şut ve gol gibi önemli olayları gerçeğin dakika başına 2,5–3 katı sıklıkta üretir:
   gol sayısı gerçeğe yakındır; şut, korner, taç ve pas gibi sık tekrarlanan olaylar gerçek maçın yarısından azdır.
   Oranlar (isabet, pas isabeti, pas yönleri, uzun pas) gerçek maçlara göre tutulur. */
const HEDEF=[
  ['Gol','gol',1.8,3.0],
  ['Şut','sut',8,14],
  ['İsabetli şut oranı %','isabetOran',30,45],
  ['Korner','korner',2,6],
  ['Taç','tac',5,12],
  ['Kale vuruşu','kaleVurusu',2.5,8],
  ['Faul','faul',8,14],
  ['Sarı kart','sari',1.5,3.5],
  ['Kırmızı kart','kirmizi',0,0.2],
  ['Ofsayt','ofsayt',0.3,2],
  ['Pas','pas',110,200],
  ['Pas isabeti %','pasOran',65,80],
  ['İleri pas %','ileriOran',30,45],
  ['Yan pas %','yanOran',35,58],
  ['Geri pas %','geriOran',10,25],
  ['Uzun pas %','uzunOran',10,24],
  ['Hava topu mücadelesi','havaTopu',6,15],
  ['Uzatma 1. yarı (dk)','uzatma1',1,4],
  ['Uzatma 2. yarı (dk)','uzatma2',3,7],
  ['Değişiklik (takım başına)','degisiklik',2,4],
  ['Top oyunda %','oyundaOran',58,72]
];

/* ---- bilgi satırları (hedefsiz): motorun fiziğini ve hareketini izlemek için ---- */
const BILGI=[
  ['Gol ev / deplasman','golEv','golDep',1],['Şut ev / deplasman','sutEv','sutDep',1],['Topa sahip olma ev %','sahiplikEv',null,1],
  ['Kurtarış (kaleci)','kurtaris',null,1],['Kafa vuruşu','kafa',null,1],['Blok','blok',null,1],['Sekme','sekme',null,1],['Top kapma','kapma',null,1],
  ['Pas hızı ort. (m/sn)','pasHiz',null,1],['Şut hızı ort. (m/sn)','sutHiz',null,1],['Şut hızı en yüksek (m/sn)','sutHizMaks',null,1],
  ['Oyuncu en yüksek hız (m/sn)','hizMaks',null,2],['Oyuncu hız %99 (m/sn)','hiz99',null,2],['Oyuncu ivme %99 (m/sn²)','ivme99',null,1],
  ['Koşu mesafesi / oyuncu (m)','mesafe',null,0],['Top gövdeden geçti (kez)','icindenGecti',null,1],
  /* MM2: takım savunması */
  ['Ceza sahasında boşta rakip (sn)','bosta',null,1],['Çift markaj anı (sn)','cift',null,1],['Karşı pres kazanımı (kez)','karsiPres',null,1],
  ['Savunmada takım boyu (m)','boy',null,1],['Savunmada takım eni (m)','en',null,1],['Kalecisiz oynanan süre (sn)','kalecisiz',null,1],
  /* 2026-10-03 Faz 0: pas, beden, kaleci ölçümleri (oranlar bütün maçların toplamından) */
  ['— Pas —',null,null,0],
  ['Pas tamamlama <15 m %','pasKisaOran',null,1],['Pas tamamlama 15–30 m %','pasOrtaOran',null,1],['Pas tamamlama >30 m %','pasUzunOran',null,1],
  ['Ara pas (adet)','araPas',null,1],['Ara pas başarısı %','araPasOran',null,1],
  ['Oyunun yönünü değiştirme (adet)','donusPas',null,1],['Yön değiştirme başarısı %','donusPasOran',null,1],
  ['Orta (adet)','orta',null,1],['Orta başarısı %','ortaOran',null,1],
  ['Tek vuruşla pas %','tekVurusOran',null,1],['Ver-kaç (adet)','verKac',null,1],['İlk dokunuş hatası %','ilkDokunusHataOran',null,1],
  ['Çalım girişimi (adet)','calim',null,1],['Çalım başarısı %','calimOran',null,1],
  ['— Beden ve mücadele —',null,null,0],
  ['Müdahale girişimi (adet)','mudahale',null,1],['Müdahale kazanma %','mudahaleOran',null,1],['Girişim başına faul %','mudahaleFaulOran',null,1],
  ['Kayarak müdahale payı %','kaymaPay',null,1],['Omuz mücadelesi (adet)','omuz',null,1],['Sendeleme (adet)','sendele',null,1],
  ['Düşüş (adet)','dusus',null,1],['Faulsüz düşüş %','faulsuzDususOran',null,1],
  ['Avantaj (adet)','avantaj',null,2],['Avantaj tutuldu %','avantajOran',null,1],['Penaltı (adet)','penalti',null,2],
  ['Sprint mesafesi / oyuncu (m, >7 m/sn)','sprint',null,0],
  ['— Şut ve kaleci —',null,null,0],
  ['Kurtarış oranı % (çerçeveye giden)','kurtarisOran',null,1],['Kurtarışta tutma payı %','tutmaPay',null,1],
  ['xG / şut','xgSut',null,3],['Şutsuz gol payı % (sekme, dönen top, kendi kalesine)','sutsuzGolOran',null,1],['Ceza sahası içi isabetli: direğe ≤1 m %','direkYakinOran',null,1],
  ['— Performans —',null,null,0],
  ['Süre / 1000 motor adımı (ms; işçiler paralel)','msAdim',null,1]
];
const yuzdelik=(L,q)=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b);return S[Math.min(S.length-1,Math.floor(q*S.length))];};

/* ---- parmak izi: FNV-1a (32 bit) ---- */
const IZ_F=new Float64Array(8+5*64),IZ_U=new Uint8Array(IZ_F.buffer);
function izKat(h,n){for(let i=0;i<n*8;i++){h^=IZ_U[i];h=Math.imul(h,16777619)>>>0;}return h;}
function izDurum(h,m){const b=m.ball;let n=0;IZ_F[n++]=b.x;IZ_F[n++]=b.y;IZ_F[n++]=b.z;IZ_F[n++]=b.vx;IZ_F[n++]=b.vy;IZ_F[n++]=b.vz;IZ_F[n++]=m.score[0];IZ_F[n++]=m.score[1];
  for(const p of m.players){IZ_F[n++]=p.x;IZ_F[n++]=p.z;IZ_F[n++]=p.vx;IZ_F[n++]=p.vz;IZ_F[n++]=p.yon;}return izKat(h,n);}
function izMetin(h,s){for(let i=0;i<s.length;i++){h^=s.charCodeAt(i)&255;h=Math.imul(h,16777619)>>>0;h^=s.charCodeAt(i)>>8;h=Math.imul(h,16777619)>>>0;}return h;}
const hex=h=>('0000000'+(h>>>0).toString(16)).slice(-8);

/* ---- bir maç (sinir: en çok bu kadar adım; kısa tekrarlanabilirlik için) ---- */
function macOyna(tohum,sinir){
  const olay={save:0,header:0,block:0,sekme:0,steal:0},pasH=[],sutH=[];let m=null;
  const bu={faulYiyen:new Set(),save:null,catch:false,goal:false,block:false};   /* bu adımın olayları */
  const say={avantaj:0,avantajTutuldu:0,avantajSonuc:0,penalti:0,faulMudahale:0,steal:0,xg:[]},eylemSay={};
  const eklentiler=EKLENTILER.map(E=>E.yeni?E.yeni():{});
  const dinle=(ad,v)=>{if(ad in olay)olay[ad]++;
    for(const e of eklentiler)if(e.dinle)e.dinle(ad,v,m);
    if(ad==='faul'||ad==='avantaj'){if(v.faulYiyen)bu.faulYiyen.add(v.faulYiyen);
      if(ad==='avantaj')say.avantaj++;if(ad==='faul'&&v.penalti)say.penalti++;
      if(ad==='faul'&&!v.avantajdan&&(v.neden==='mudahale'||v.neden==='kayma'))say.faulMudahale++;
      if(ad==='avantaj'&&(v.neden==='mudahale'||v.neden==='kayma'))say.faulMudahale++;}
    if(ad==='avantajSonuc'){say.avantajSonuc++;if(v.tutuldu)say.avantajTutuldu++;}
    if(ad==='save'){bu.save=v;if(v.catch)bu.catch=true;}
    if(ad==='goal')bu.goal=true;
    if(ad==='block')bu.block=true;
    if(ad==='steal')say.steal++;
    if(ad==='shot'||(ad==='header'&&v.shot))sutBasla(v);
    const b=m&&m.ball;if(!b)return;const h=Math.sqrt(b.vx*b.vx+b.vy*b.vy+b.vz*b.vz);
    if(ad==='pass'||ad==='cross')pasH.push(h);else if(ad==='shot')sutH.push(h);};
  m=vm.runInContext(`(on,tohum,D)=>{const K=D?MAC_KADRO.map((k,i)=>Object.assign({},k,{taktik:Object.assign({},k.taktik,{dizilis:D[i]})})):MAC_KADRO;
    return new Match(on,{kadro:K,tohum,tunel:{x:0,z:-6}});}`,ctx)(dinle,tohum,DIZILIS?DIZILIS.split(','):null);
  const PLm=52.5,MZm=34,GW2m=3.66,GHm=2.44,topAdimFn=ctx.topFizikAdim||vm.runInContext('topFizikAdim',ctx);
  /* şutlar: kick anında topun kopyası kale çizgisine kadar ilerletilir (çerçeve ve direğe uzaklık); sonuç top.sut değişince yazılır */
  const sutlar={n:0,cerceve:0,kurtarisCerceve:0,gol:0,tutma:0,kurtaris:0,kutuIsabet:0,direkYakin:0};let aktifSut=null;
  function sutBasla(v){const b=m.ball,s=b.sut;if(!s)return;if(aktifSut)sutBitir();if(v&&v.xg!=null)say.xg.push(v.xg);
    const d=m.dir[s.team],gx=d*PLm,k={x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:b.egri||0,ust:b.ust||0};let cz=null,cy=null;
    for(let i=0;i<240;i++){const px=k.x,py=k.y,pz=k.z;topAdimFn(k,1/60,false,m.R);if((px-gx)*(k.x-gx)<=0){const f=(gx-px)/((k.x-px)||1);cz=pz+(k.z-pz)*f;cy=py+(k.y-py)*f;break;}}
    const icerde=cz!=null&&Math.abs(cz-MZm)<GW2m&&cy<GHm,kutu=Math.abs(b.x-gx)<16.5&&Math.abs(b.z-MZm)<20.16;
    if(icerde&&kutu){sutlar.kutuIsabet++;if(GW2m-Math.abs(cz-MZm)<=1)sutlar.direkYakin++;}
    aktifSut={s,cerceve:!!s.cerceve,team:s.team};sutlar.n++;if(s.cerceve)sutlar.cerceve++;}
  function sutBitir(){const a=aktifSut;aktifSut=null;const b=m.ball,gk=b.tasiyan&&b.tasiyan.rol==='GK'&&b.tasiyan.team!==a.team;
    if(bu.goal){sutlar.gol++;return;}
    if(bu.save||gk){sutlar.kurtaris++;if(a.cerceve)sutlar.kurtarisCerceve++;if(bu.catch||gk)sutlar.tutma++;}}
  m.macaGec();
  let adim=0;const MAKS=sinir||60*60*30,dt=1/60,onceki=new Map(),hizlar=[],ivmeler=[],icinde=new Set();let mesafe=0,gecti=0,sprint=0;
  let bosta=0,cift=0,karsiPres=0,kalecisiz=0,sonSahip=-1,kayip=[-99,-99];const boylar=[],enler=[];
  /* pas izleme: ist.pas artınca yeni pas (top.pas), ist.pasTamam artınca tamamlandı, top.pas boşalınca tamamlanmadı */
  const pasK={kisa:[0,0],orta:[0,0],uzun:[0,0],ara:[0,0],donus:[0,0],cross:[0,0],tek:[0,0]};let pasN=0,pasTN=0,aktifPas=null,sonTamam=null,verKac=0;
  const ACIK=new Set(['pas','ara','uzun','kisa','geriCevir','kafa','orta']);
  function pasBitir(a,tamam){a.bitti=true;const k=tamam?1:0;
    if(ACIK.has(a.tur)){const L=a.L||0;(L<15?pasK.kisa:L<=30?pasK.orta:pasK.uzun)[0]++;(L<15?pasK.kisa:L<=30?pasK.orta:pasK.uzun)[1]+=k;
      if(a.tur==='ara'){pasK.ara[0]++;pasK.ara[1]+=k;}if(a.tur==='orta'){pasK.cross[0]++;pasK.cross[1]+=k;}
      if(a.dz>=30){pasK.donus[0]++;pasK.donus[1]+=k;}pasK.tek[0]++;if(a.tek)pasK.tek[1]++;}
    if(tamam){const q=m.ball.sonDokunan;if(sonTamam&&sonTamam.q===a.p&&q===sonTamam.p&&m.t-sonTamam.t<3)verKac++;sonTamam={p:a.p,q,t:m.t};}}
  /* eylem histogramı: her yeni eylem nesnesi adıyla sayılır; tavır süreleri */
  const sonEylem=new Map(),tavirSure={};let kontrolN=0,kontrolKotu=0,mudahaleN=0,kaymaN=0,omuzN=0,sendeleN=0,dususN=0,faulsuzDusus=0;
  /* çalım: topu süren oyuncunun önünde 3 m içindeki rakip, aynı sahiplikte arkasında kalırsa başarılı; top o rakibe giderse başarısız */
  let calimSahip=null,calimOnunde=new Set(),calimN=0,calimOk=0;
  let ns=0n;
  while(m.phase!=='fulltime'&&adim<MAKS){
    bu.faulYiyen.clear();bu.save=null;bu.catch=false;bu.goal=false;bu.block=false;
    const t0=process.hrtime.bigint();m.step(dt);ns+=process.hrtime.bigint()-t0;adim++;
    if(adim%30===0)izH=izDurum(izH,m);if(adim%600===0)izler.push(hex(izH));
    for(const e of eklentiler)if(e.adim)e.adim(m);
    /* eylemler */
    for(const p of m.players){if(!p.oyunda)continue;const e=p.eylem;
      if(e&&e!==sonEylem.get(p)){eylemSay[e.ad]=(eylemSay[e.ad]||0)+1;
        if(e.ad==='kontrol'){kontrolN++;if(e.kotu)kontrolKotu++;}else if(e.ad==='gogus')kontrolN++;
        else if(e.ad==='mudahale')mudahaleN++;else if(e.ad==='kayma')kaymaN++;else if(e.ad==='omuz')omuzN++;else if(e.ad==='sendele')sendeleN++;
        else if(e.ad==='dusus'){dususN++;if(!bu.faulYiyen.has(p))faulsuzDusus++;}}
      sonEylem.set(p,e);if(p.tavir)tavirSure[p.tavir]=(tavirSure[p.tavir]||0)+dt;}
    /* paslar */
    {const I=m.ist,pt=I.pas[0]+I.pas[1],pc=I.pasTamam[0]+I.pasTamam[1];
     if(pc>pasTN){if(aktifPas&&!aktifPas.bitti)pasBitir(aktifPas,true);pasTN=pc;}
     if(pt>pasN){if(aktifPas&&!aktifPas.bitti)pasBitir(aktifPas,false);pasN=pt;const bp=m.ball.pas;
       aktifPas=bp?{tur:bp.tur,L:bp.L,dz:bp.hz!=null?Math.abs(bp.hz-bp.z0):0,p:bp.p,tek:!!(bp.p&&bp.p.eylem&&bp.p.eylem.ad==='vurus'&&(bp.p.eylem.tekDokunus||(bp.p.eylem.sec&&bp.p.eylem.sec.ilk))),bitti:false}:null;}
     else if(aktifPas&&!aktifPas.bitti&&!m.ball.pas)pasBitir(aktifPas,false);}
    /* şut sonucu */
    if(aktifSut&&m.ball.sut!==aktifSut.s)sutBitir();
    if(m.phase!=='play')continue;
    const b=m.ball,bh=Math.sqrt(b.vx*b.vx+b.vz*b.vz);
    /* çalım */
    if(adim%6===0){const s=b.sahip;
      if(s!==calimSahip){if(s&&calimSahip&&s.team!==calimSahip.team&&calimOnunde.has(s)){calimN++;}calimSahip=s;calimOnunde=new Set();}
      if(s){const d=m.dir[s.team];for(const o of m.teams[1-s.team]){if(!o.oyunda||o.rol==='GK')continue;const dd=Math.hypot(o.x-s.x,o.z-s.z),rel=(o.x-s.x)*d;
        if(dd<3&&rel>0.5)calimOnunde.add(o);else if(calimOnunde.has(o)&&rel<-1.0){calimOnunde.delete(o);calimN++;calimOk++;}}}}
    /* MM2 ölçümleri: hücum eden takım topun sahibi (yoksa son dokunan) */
    {const st=b.sahip?b.sahip.team:-1,att=st>=0?st:b.sonTakim,def=1-att,d=m.dir[att];
     if(st>=0&&st!==sonSahip){if(sonSahip>=0)kayip[sonSahip]=m.t;if(m.t-kayip[st]<5)karsiPres++;kayip[st]=-99;sonSahip=st;}
     for(const t of[0,1]){const g=m.teams[t][0];if(!g.oyunda||g.rol!=='GK')kalecisiz+=dt;}
     if(b.x*d>PLm-35){const S=m.teams[def].filter(q=>q.oyunda&&q.rol!=='GK');
       for(const o of m.teams[att]){if(!o.oyunda||o.rol==='GK'||o===b.sahip)continue;if(o.x*d<PLm-18||Math.abs(o.z-MZm)>20)continue;
         let n=0,en=99;for(const q of S){const dd=Math.hypot(q.x-o.x,q.z-o.z);if(dd<en)en=dd;if(dd<1.5)n++;}
         if(en>2)bosta+=dt;if(n>=2)cift+=dt;}}
     if(st>=0&&adim%6===0){const S=m.teams[1-st].filter(q=>q.oyunda&&q.rol!=='GK');if(S.length){const X=S.map(q=>q.x),Z=S.map(q=>q.z);
       boylar.push(Math.max(...X)-Math.min(...X));enler.push(Math.max(...Z)-Math.min(...Z));}}}
    for(const p of m.players){if(!p.oyunda)continue;const sp=Math.sqrt(p.vx*p.vx+p.vz*p.vz),o=onceki.get(p);mesafe+=sp*dt;if(sp>7)sprint+=sp*dt;
      if(adim%6===0)hizlar.push(sp);
      if(o&&!(p.eylem&&p.eylem.kilit)&&!o.kilit&&adim%3===0)ivmeler.push(Math.sqrt((p.vx-o.vx)**2+(p.vz-o.vz)**2)/dt);
      onceki.set(p,{vx:p.vx,vz:p.vz,kilit:!!(p.eylem&&p.eylem.kilit)});
      /* top gövdenin içinden geçiyor: hızlı top, yerden 1,8 m'den alçak, gövde ekseninden 0,22 m'den yakın; o kişi topun sahibi/taşıyanı değil */
      const d=Math.sqrt((b.x-p.x)**2+(b.z-p.z)**2),ic=bh>3&&b.y<1.8&&d<0.22&&b.sahip!==p&&b.tasiyan!==p;
      if(ic&&!icinde.has(p)){gecti++;icinde.add(p);}else if(!ic)icinde.delete(p);}
  }
  const I=m.ist,top=a=>a[0]+a[1],ort=L=>L.length?L.reduce((a,c)=>a+c,0)/L.length:NaN;
  izH=izMetin(izH,JSON.stringify(I)+'|'+m.score.join('-')+'|'+m.phase+'|'+adim);
  const s={tohum,sure:adim/60,bitmedi:m.phase!=='fulltime',gol:top(m.score),sut:top(I.sut),isabet:top(I.isabet),korner:top(I.korner),tac:top(I.tac),
    kaleVurusu:top(I.kaleVurusu),faul:top(I.faul),sari:top(I.sari),kirmizi:top(I.kirmizi),ofsayt:top(I.ofsayt),pas:top(I.pas),pasTamam:top(I.pasTamam),
    ileri:I.pasYon.ileri,yan:I.pasYon.yan,geri:I.pasYon.geri,uzun:I.uzunPas,havaTopu:I.havaTopu,
    uzatma1:I.uzatma[0],uzatma2:I.uzatma[1],degisiklik:top(I.degisiklik)/2,oyunda:I.oyunda,toplam:I.toplam};
  s.isabetOran=s.sut?100*s.isabet/s.sut:0;
  s.pasOran=s.pas?100*s.pasTamam/s.pas:0;
  const yonToplam=s.ileri+s.yan+s.geri||1;
  s.ileriOran=100*s.ileri/yonToplam;s.yanOran=100*s.yan/yonToplam;s.geriOran=100*s.geri/yonToplam;
  s.uzunOran=s.pas?100*s.uzun/s.pas:0;
  s.oyundaOran=100*s.oyunda/(s.toplam||1);
  Object.assign(s,{golEv:m.score[0],golDep:m.score[1],sutEv:I.sut[0],sutDep:I.sut[1],sahiplikEv:100*I.sahiplik[0]/((I.sahiplik[0]+I.sahiplik[1])||1),
    kurtaris:olay.save,kafa:olay.header,blok:olay.block,sekme:olay.sekme,kapma:olay.steal,pasHiz:ort(pasH),sutHiz:ort(sutH),sutHizMaks:sutH.length?Math.max(...sutH):NaN,
    hizMaks:hizlar.length?Math.max(...hizlar):NaN,hiz99:yuzdelik(hizlar,0.99),ivme99:yuzdelik(ivmeler,0.99),mesafe:mesafe/22,icindenGecti:gecti,
    bosta,cift,karsiPres,kalecisiz,boy:ort(boylar),en:ort(enler)});
  /* Faz 0 ölçümleri: oranlar toplam üzerinden hesaplanabilsin diye pay/payda ayrı saklanır (ham: [pay, payda]) */
  s.ham={pasKisaOran:[pasK.kisa[1],pasK.kisa[0]],pasOrtaOran:[pasK.orta[1],pasK.orta[0]],pasUzunOran:[pasK.uzun[1],pasK.uzun[0]],
    araPasOran:[pasK.ara[1],pasK.ara[0]],donusPasOran:[pasK.donus[1],pasK.donus[0]],ortaOran:[pasK.cross[1],pasK.cross[0]],tekVurusOran:[pasK.tek[1],pasK.tek[0]],
    ilkDokunusHataOran:[kontrolKotu,kontrolN],calimOran:[calimOk,calimN],mudahaleOran:[say.steal,mudahaleN+kaymaN],mudahaleFaulOran:[say.faulMudahale,mudahaleN+kaymaN],
    kaymaPay:[kaymaN,mudahaleN+kaymaN],faulsuzDususOran:[faulsuzDusus,dususN],avantajOran:[say.avantajTutuldu,say.avantajSonuc],
    kurtarisOran:[sutlar.kurtarisCerceve,sutlar.kurtarisCerceve+sutlar.gol],tutmaPay:[sutlar.tutma,sutlar.kurtaris],sutsuzGolOran:[Math.max(0,m.score[0]+m.score[1]-sutlar.gol),m.score[0]+m.score[1]],direkYakinOran:[sutlar.direkYakin,sutlar.kutuIsabet]};
  Object.assign(s,{araPas:pasK.ara[0],donusPas:pasK.donus[0],orta:pasK.cross[0],verKac,calim:calimN,mudahale:mudahaleN+kaymaN,omuz:omuzN,sendele:sendeleN,
    dusus:dususN,avantaj:say.avantaj,penalti:say.penalti,sprint:sprint/22,xgSut:ort(say.xg),eylemler:eylemSay,tavir:tavirSure});
  /* eklenti oran satırı için ham:{anahtar:[pay,payda]} verebilir */
  for(const e of eklentiler)if(e.bitir){const r=e.bitir(m)||{};if(r.ham){Object.assign(s.ham,r.ham);delete r.ham;}Object.assign(s,r);}
  s.iz=hex(izH);s.izler=izler;s._msAdim=Number(ns)/1e6/(adim/1000);
  return s;
}
/* parmak izi durumu (macOyna içinde sıfırlanır) */
let izH=0x811c9dc5,izler=[];
const _macOyna=macOyna;
function macOynaIz(t,sinir){izH=0x811c9dc5>>>0;izler=[];return _macOyna(t,sinir);}
/* kısa tekrarlanabilirlik: ilk 3 dakika (10800 adım, 18 kontrol noktası) */
const KISA_TEKRAR=60*60*3;
/* zamanı içermeyen karşılaştırma metni */
const karsilastirMetni=s=>JSON.stringify(s,(k,v)=>k.startsWith('_')?undefined:v);

/* ---- senaryo: seyrek olaylar için (ör. şut ızgarası, penaltı, varış süresi) ---- */
if(SENARYO){
  const dosya=path.join(__dirname,'senaryolar',SENARYO+'.js');
  if(!fs.existsSync(dosya)){console.error('Senaryo yok: '+dosya);process.exit(2);}
  const S=require(dosya);const N=ARG[0]?MAC_SAYISI:undefined;
  Promise.resolve(S.calistir({ctx,vm,N,tohum:ILK_TOHUM,macOyna:macOynaIz})).then(k=>process.exit(typeof k==='number'?k:0)).catch(e=>{console.error(e.stack||e.message);process.exit(1);});
}
/* ---- işçi: kendisine verilen tohum aralığını oynatır, sonuçları JSON olarak yazar ---- */
else if(process.env.MAC_DENEME_TOHUMLAR){
  const [a,b]=process.env.MAC_DENEME_TOHUMLAR.split(',').map(Number),out=[];
  for(let t=a;t<b;t++)out.push(macOynaIz(t));
  process.stdout.write(JSON.stringify(out));
}
/* ---- tekrar işçisi: bir tohumu aynı süreçte iki kez oynatır (sinir > 0 ise yalnız o kadar adım) ---- */
else if(process.env.MAC_DENEME_TEKRAR){
  const [t,sinir]=process.env.MAC_DENEME_TEKRAR.split(',').map(Number);
  process.stdout.write(JSON.stringify([macOynaIz(t,sinir||0),macOynaIz(t,sinir||0)]));
}else{
  /* ---- maçları işçilere dağıt, sonuçları topla, özetle; tekrarlanabilirlik ayrı işçide aynı anda ---- */
  const t0=Date.now(),isci=Math.max(1,Math.min(ISCI>0?ISCI:Math.floor(os.cpus().length/2),MAC_SAYISI)),parca=Math.ceil(MAC_SAYISI/isci),isler=[];
  const surec=(env,ad)=>new Promise((tamam,hata)=>{
    const c=spawn(process.execPath,[__filename],{env:Object.assign({},process.env,{MAC_DENEME_DIZILIS:DIZILIS},env)});let s='';
    c.stdout.on('data',d=>s+=d);c.stderr.on('data',d=>process.stderr.write(d));
    c.on('close',k=>k===0?tamam(JSON.parse(s)):hata(new Error(`${ad} oynatılamadı (çıkış kodu ${k})`)));});
  for(let i=0;i<isci;i++){const a=ILK_TOHUM+i*parca,b=Math.min(ILK_TOHUM+MAC_SAYISI,a+parca);if(a>=b)break;
    isler.push(surec({MAC_DENEME_TOHUMLAR:a+','+b},`tohum ${a}–${b-1}`));}
  const tekrarSinir=TAM_TEKRAR||MAC_SAYISI>10?0:KISA_TEKRAR;
  const tekrar=surec({MAC_DENEME_TEKRAR:ILK_TOHUM+','+tekrarSinir},'tekrarlanabilirlik');
  Promise.all([Promise.all(isler),tekrar]).then(([p,tk])=>{
    const sonuclar=[].concat(...p);
    const deger=(k,L)=>(L||sonuclar).map(s=>s[k]).filter(x=>typeof x==='number'&&!Number.isNaN(x));
    const ort=(k,L)=>{const v=deger(k,L);return v.length?v.reduce((a,b)=>a+b,0)/v.length:NaN;};
    const sap=(k,L)=>{const v=deger(k,L),o=ort(k,L);return v.length?Math.sqrt(v.reduce((a,b)=>a+(b-o)*(b-o),0)/v.length):NaN;};
    /* oran: bütün maçların payı / paydası */
    const oran=(k,L)=>{let a=0,b=0;for(const s of(L||sonuclar)){const h=s.ham&&s.ham[k];if(h){a+=h[0];b+=h[1];}}return b?100*a/b:NaN;};
    const degerAl=(k,L)=>sonuclar[0]&&sonuclar[0].ham&&k in sonuclar[0].ham?oran(k,L):ort(k,L);
    const f=(x,n)=>Number.isNaN(x)?'—':x.toFixed(n);
    console.log(`\nChairman maç deneme aracı · ${MAC_SAYISI} maç · tohum ${ILK_TOHUM}…${ILK_TOHUM+MAC_SAYISI-1} · ${isler.length} işçi + 1 tekrar işçisi · ${((Date.now()-t0)/1000).toFixed(1)} sn${DIZILIS?' · diziliş '+DIZILIS:''}${AYAR?' · ayar '+AYAR:''}`);
    console.log(`Motor dosyaları (bağlam ${BAGLAM}): ${mantik.join(', ')}${EKLENTILER.length?'\nEklenti ölçümleri: '+EKLENTILER.map(e=>e.dosya).join(', '):''}\n`);
    console.log('  '+'Ölçüm'.padEnd(28)+'Ortalama'.padStart(10)+'  ±'.padEnd(8)+'Hedef'.padStart(12));
    let disarida=0;
    for(const [ad,k,a,b] of HEDEF){
      const o=ort(k),dis=!Number.isNaN(o)&&(o<a||o>b);if(dis)disarida++;
      console.log((dis?'! ':'  ')+ad.padEnd(28)+f(o,1).padStart(10)+('  '+f(sap(k),1)).padEnd(8)+`${a}–${b}`.padStart(12));
    }
    const bitmeyen=sonuclar.filter(s=>s.bitmedi).length;
    console.log(`\nOrtalama maç süresi: ${f(ort('sure')/60,1)} dakika (gerçek zaman)${bitmeyen?` · BİTMEYEN MAÇ: ${bitmeyen}`:''}`);
    console.log(`Hedef dışında: ${disarida} satır`);
    console.log('\n  Bilgi (hedefsiz; "hedef T…" gerçekçilik planı turunun kabulüdür, bilgi amaçlı)');
    const msAdim=ort('_msAdim');
    /* T0: eklenti satırı isteğe bağlı plan hedefi taşır: [ad,anahtar,basamak,[alt|null,üst|null,'T1']]; dışındaysa "!" (bilgi, çıkış kodu değişmez) */
    const bilgiSatirlari=BILGI.concat(...EKLENTILER.map(e=>(e.bilgi||[]).map(([ad,k,n,h])=>[ad,k,null,n,h])));
    for(const [ad,k,k2,n,h] of bilgiSatirlari){
      if(!k){console.log('  '+ad);continue;}
      if(k==='msAdim'){console.log('  '+ad.padEnd(28)+f(msAdim,n).padStart(16));continue;}
      const oranli=sonuclar[0]&&sonuclar[0].ham&&k in sonuclar[0].ham,v=degerAl(k);
      const dis=h&&!Number.isNaN(v)&&((h[0]!=null&&v<h[0])||(h[1]!=null&&v>h[1]));
      const hedef=h?`   hedef ${h[2]}: ${h[0]==null?'≤'+h[1]:h[1]==null?'≥'+h[0]:h[0]+'–'+h[1]}`:'';
      console.log((dis?'! ':'  ')+ad.padEnd(28)+(f(v,n)+(k2?' / '+f(ort(k2),n):'')).padStart(16)+(k2||oranli?'':('  ± '+f(sap(k),n)))+hedef);}
    /* eylem histogramı ve tavır süreleri (maç başına) */
    const EH={},TV={};for(const s of sonuclar){for(const [a,v] of Object.entries(s.eylemler||{}))EH[a]=(EH[a]||0)+v;for(const [a,v] of Object.entries(s.tavir||{}))TV[a]=(TV[a]||0)+v;}
    console.log('  Eylemler / maç: '+Object.keys(EH).sort().map(a=>a+' '+f(EH[a]/sonuclar.length,1)).join(' · '));
    if(Object.keys(TV).length)console.log('  Tavır süresi / maç (oyuncu·sn): '+Object.keys(TV).sort().map(a=>a+' '+f(TV[a]/sonuclar.length,0)).join(' · '));
    /* T0: eklenti isteğe bağlı ozet(sonuclar) ile kendi tablosunu basabilir ("!" satırları bilgidir, çıkış kodunu etkilemez) */
    for(const E of EKLENTILER)if(E.ozet)E.ozet(sonuclar);
    /* tekrarlanabilirlik: ilk tohum tekrar işçisinde iki kez oynatıldı (aynı süreçte art arda), işçinin sonucuyla da karşılaştırılır.
       Kısa denetimde yalnız ilk kontrol noktaları (parmak izi zinciri) karşılaştırılır */
    let ayni;
    if(tekrarSinir){const n=tk[0].izler.length,c=sonuclar[0].izler.slice(0,n).join(',');ayni=n>0&&tk[0].izler.join(',')===c&&tk[1].izler.join(',')===c;}
    else{const a=karsilastirMetni(tk[0]),b=karsilastirMetni(tk[1]),c=karsilastirMetni(sonuclar[0]);ayni=a===b&&a===c;}
    console.log('\n'+(ayni?'  ':'! ')+`Tekrarlanabilirlik: tohum ${ILK_TOHUM} üç kez oynatıldı${tekrarSinir?` (kısa: ilk ${tekrarSinir/3600} dakika, ${tk[0].izler.length} kontrol noktası)`:''}, ${ayni?'sonuç aynı':'SONUÇ FARKLI'}`);
    if(!ayni)process.exitCode=1;
    if(JSON_DOSYA){fs.mkdirSync(path.dirname(path.resolve(JSON_DOSYA)),{recursive:true});
      fs.writeFileSync(JSON_DOSYA,JSON.stringify({tarih:new Date().toISOString(),dizilis:DIZILIS,ayar:AYAR,ortam:ORTAM,sonuclar},null,0));console.log(`  Sonuçlar yazıldı: ${JSON_DOSYA}`);}
    if(KARSILASTIR){
      const EJ=JSON.parse(fs.readFileSync(KARSILASTIR,'utf8')),eski=EJ.sonuclar,E=new Map(eski.map(s=>[s.tohum,s]));
      const ortak=sonuclar.filter(s=>E.has(s.tohum));
      console.log(`\n  Karşılaştırma: ${KARSILASTIR} (${ortak.length} ortak tohum)`);
      /* T0: tabanın ortamı; Node sürümü farklıysa kayan nokta (Math.* kütüphanesi) farkı parmak izini değiştirebilir (çıkış kodunu etkilemez) */
      const eo=EJ.ortam;console.log('  Taban ortamı: '+(eo?`Node ${eo.node} · ${eo.platform}/${eo.arch} · git ${eo.git||'—'}`:'kayıtlı değil')+` · şimdi Node ${ORTAM.node} · git ${ORTAM.git||'—'}`);
      if(!eo||eo.node!==ORTAM.node)console.log(`! Node sürümü ${eo?'farklı':'bilinmiyor'} (taban ${eo?eo.node:'?'}, şimdi ${ORTAM.node}): --ayni farkı motor değişikliği olmayabilir`);
      if(AYNI){let fark=0;
        for(const s of ortak){const e=E.get(s.tohum);if(s.iz===e.iz)continue;fark++;
          let i=0;while(i<s.izler.length&&i<e.izler.length&&s.izler[i]===e.izler[i])i++;
          if(fark<=5)console.log(`! tohum ${s.tohum}: parmak izi farklı; ilk ayrılan kontrol noktası ${i} (≈${(i*600/60).toFixed(0)}. sn)${i===Math.min(s.izler.length,e.izler.length)?' · yalnız maç sonu özeti/istatistik farklı':''}`);}
        console.log((fark?'! ':'  ')+`Birebir aynılık: ${ortak.length-fark}/${ortak.length} tohum aynı`);
        if(fark||!ortak.length)process.exitCode=1;}
      else{
        const Lyeni=ortak,Leski=ortak.map(s=>E.get(s.tohum));
        const satir=(ad,k)=>{const oranli=Lyeni[0]&&Lyeni[0].ham&&k in Lyeni[0].ham;
          const y=oranli?oran(k,Lyeni):ort(k,Lyeni),e=oranli?oran(k,Leski):ort(k,Leski);
          const se=oranli?NaN:Math.sqrt((sap(k,Lyeni)**2+sap(k,Leski)**2)/Math.max(1,Lyeni.length));
          console.log('  '+ad.padEnd(34)+f(e,2).padStart(9)+' → '+f(y,2).padStart(9)+('  ('+(y-e>=0?'+':'')+f(y-e,2)+(Number.isNaN(se)?'':' ± '+f(se,2))+')').padEnd(20));};
        for(const [ad,k] of HEDEF)satir(ad,k);
        for(const [ad,k] of bilgiSatirlari){if(!k||k==='msAdim')continue;satir(ad,k);}
        const me=ort('_msAdim',Leski);console.log('  '+'Süre / 1000 adım (ms)'.padEnd(34)+f(me,1).padStart(9)+' → '+f(ort('_msAdim',Lyeni),1).padStart(9));}}
  }).catch(e=>{console.error(e.message);process.exit(1);});
}
