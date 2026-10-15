/* ============ Chairman — kurallar, hakemler, duran toplar, top toplayıcılar (mantık, çizimsiz) ============
   Duran toplar gerçek sırasıyla işler. N10 (kullanıcı kararı 2026-10-04; 2.8O/MM0b'deki konilerin yerini alır): oyuncu topu almaya saha
   dışına gitmez. Top taç, korner ya da aut olunca en yakın top toplayıcı çocuk elindeki yedek topu atana verir; dışarı çıkan eski topu
   boştaki bir çocuk toplar. Top atış yerinin hemen yanında duracaksa atan onu kendisi alır.
   Taç: atan çizgide, top başının üstünde. Korner: köşe yayında, ceza sahasında koşu rolleri, falsolu orta.
   Aut: kaleci topu altıpasa koyar, kısa oynar ya da uzun vurur. Serbest vuruş: faulün yerinde; kaleye yakınsa 9,15 m'de baraj.
   Faul: müdahalenin sonucu (ayakta, kayarak, arkadan, hava topunda itme). Oyuncu düşer, hakem düdük çalar ve yön gösterir,
   gerekirse kart; faul yiyen takım iyi durumdaysa avantaj. Ofsayt: pas anında ölçülür, oyuna karışınca yan hakem bayrak kaldırır.
   Hakem çapraz sistemle koşar; yan hakemler sondan ikinci savunmacı (ya da top) hizasında durur. */
/* ============ T10b (2026-10-11): hakem kişiliği (gerçekçilik planı §4 T10 madde 2; isimsiz — isimli hakem içerik işidir, 2.8L) ============
   sertlik (faul ve kart eşiği), avantaj (avantaj verme eğilimi), dikkat (görme), kondisyon (son 15 dakikada görme ve koşu), evEgilim (seyirci
   baskısı, T10e): 0–1, 0,5 ortalama — ortalama hakem eski sabit davranışın aynısıdır, kişilik yalnız hakemden hakeme fark katar (gerçekte maç
   başına faul ±%15, sarı ±%25). Maç girdisinden (secenek.hakem) ya da tohumdan (profilOzet: rastlantı çekmez); MOTOR_AYAR.hakemSabit (tarama)
   hepsinin yerine geçer */
ayarEkle('Kurallar',{
  hakemSabit:null,             // T10b: tarama için sabit kişilik {sertlik, avantaj, dikkat, kondisyon, evEgilim} (MAC_DENEME_AYAR); null: girdiden ya da tohumdan
  hakemFaul:0.3,               // T10b: sertliğin faul eşiğine etkisi: eşik − hakemFaul × (sertlik − 0,5) (uçlarda ±0,12; 40'ar maç: sertlik 0,9 → faul 6,8 / sarı 2,6, 0,1 → 4,8 / 1,6 — gerçekte hakemden hakeme ±%15 / ±%25; 0,12'de faul farkı yalnız %5'ti)
  hakemKart:0.25,              // T10b: sertliğin kart eşiğine etkisi (uçlarda ±0,1)
  hakemYorgun:0.15,            // T10b: 75. dakikadan sonra yorgunluk: görme × (1 − f·(1,3 − kondisyon)·hakemYorgun), koşu temposu da düşer (Ek G7: son 15 dakikada hata %23)
  hakemGeriDon:0.01,           // A4-6: yorgunluğu (hkYorgun) bunu aşan hakem, gideceği yer topa göre 60°'den gerideyse ve 3 m'den uzaksa topa bakmayı bırakıp döner
                               // (moveP koşu yönüne bakar; Ek G7: son 15 dakikada geri ve yan koşu azalır). 0: kapalı. 0,04'te (72°) son 15 dakikada
                               // geri + yan payı %33,6 → 28,3 (eşik ortalama hakemde ancak 80'de aşılıyordu)
  itirazKart:0.035,            // T10b: itiraz başına sarı olasılığı (× hakemeItiraz eğilimi, × hakemin sertliği; gerçekte itiraz sarısı maç başına ~0,3)
  kartliHosgoru:0.4,           // U1: sarı kartlı oyuncuya ikinci sarının (pervasızlık ya da gelişen atak) gösterilme olasılığı çarpanı — hakemin ikinci sarıdaki isteksizliği. 20 dakikalık maçta sarı gerçek düzeyde (4–5) ama faul gerçeğin yarısı olduğundan kart/faul ~%31 (gerçekte ~%17): ikinci sarıdan kırmızı 0,28/maç çıkıyordu (gerçekte ~0,05–0,1). İlk deneme (eşiği 0,07 kaydırmak) etkisizdi (40 maç: kartlının faulünde kart %34)
  evEtki:0.03,                 // T10e: hakemin ev sahibi eğilimi: faul ve kart eşiği ± evEtki × atmosfer × (0,5 + evEgilim) (gerçekte deplasman ~%10–20 fazla sarı)
  /* T10d: yan hakemin ofsayt kararı (ofsaytPasAni): algılanan fark = gerçek + hizalanma hatası + hareket yanılgısı + gürültü */
  ofsaytLag:0.06,              // T10d: hareket yanılgısı (flash-lag, sn): ileri koşan hücumcu ve geri çekilen çizgi bu kadar ileride/geride görülür
  ofsaytHata:0.3,              // T10d: yan hakemin yargı gürültüsü (m, standart sapma; o-ofsayt: ucu ucuna hata ~%15–20, hataların çoğu yanlış bayrak)
  ofsaytPay:0.15,              // T10d: şüphede bayrak inmez — algılanan fark bundan büyükse bayrak (m)
  ofsaytBayrak:[0.35,0.65],    // T10d: dokunuştan bayrağa tepki (sn)
  ofsaytBekle:0.4              // T10d: “bekle ve gör” — ucu ucuna pozisyonda (algılanan |fark| < 1 m) bayrak bu kadar daha geç (sn); bu sürede gol olursa iptal
});
const HAKEM_ALAN=['sertlik','avantaj','dikkat','kondisyon','evEgilim'];
function hakemKisilik(g,tohum){const S=MOTOR_AYAR.hakemSabit,o={};
  for(const k of HAKEM_ALAN)o[k]=S&&S[k]!=null?clamp(+S[k],0,1):g&&g[k]!=null?clamp(+g[k],0,1):clamp(0.5+(profilOzet('hakem#'+tohum+'#'+k)-0.5)*0.8,0.1,0.9);
  return o;}
const hkDeger=(m,k)=>m.hakem?m.hakem[k]:0.5;
/* yorgunluk: 75. dakikadan (ikinci yarıda maç saati 4500 sn) 90'a doğrusal artar, uzatmada en çok; kondisyonla */
const hkYorgun=m=>m.half===2?clamp((m.gameSec-4500)/900,0,1)*(1.3-hkDeger(m,'kondisyon'))*MOTOR_AYAR.hakemYorgun:0;
/* T10e: ev sahibi eğilimi — atmosfer × hakemin evEgilim'i: deplasmanın faulünde eşik düşer, ev sahibininkinde yükselir (t: faul yapan takım) */
const hkEv=(m,t)=>t==null?0:(t===(m.evSahibi||0)?-1:1)*MOTOR_AYAR.evEtki*(m.kosullar?m.kosullar.atmosfer:0.5)*(0.5+hkDeger(m,'evEgilim'));
const hkFaulEsik=(m,t)=>MOTOR_AYAR.faulEsik-MOTOR_AYAR.hakemFaul*(hkDeger(m,'sertlik')-0.5)-hkEv(m,t);
const hkKartEsik=(m,t)=>MOTOR_AYAR.kartEsik-MOTOR_AYAR.hakemKart*(hkDeger(m,'sertlik')-0.5)-hkEv(m,t);
/* T10d: zaman geçirmede duran topun ek hazırlığının tabanı (sn; × yoğunluk × 0,6–1,4; zamanGecirEk) */
const ZG_TABAN={tac:3.5,kaleVurusu:6,serbest:3,korner:2.5};
/* orta hakemin görme çarpanı: dikkat (0,94–1,06) × (1 − yorgunluk) */
const hkGorme=m=>(0.94+0.12*hkDeger(m,'dikkat'))*(1-hkYorgun(m));
Object.assign(Match.prototype,{
  kuralHazirla(){this.avantaj=null;this.sonKullanim=null;this.degisiklik=null;},

  /* ============ yedekler ve oyuncu değişikliği ============ */
  yedekleriKur(){
    this.yedekler=[[],[]];
    for(let t=0;t<2;t++){const kd=this.kadro&&this.kadro[t];if(!kd)continue;
      (kd.yedekler||[]).forEach((k,i)=>{const s=this.kulubeler[t].koltuklar[i]||{x:t?11.5:-11.5,z:-5.8},oz=ozellikler(k);
        const y=this.varlik('yedek',s.x,s.z,{team:t,rol:k.mevki==='KL'?'GK':(k.mevki||'OS'),name:k.ad,no:k.no,kayit:k,oz,ayak:k.ayak||'sag',boy:k.boy||1,
          maxSpd:6.4+2.4*oz.hiz,yon:Math.PI/2,oturuyor:true,koltuk:s});
        profilKur(y,this.tohum);this.yedekler[t].push(y);});}   /* T3: yedeğin profili (mevki yok: stoper / merkez sayılır) */
    /* değişiklik planı: her takım ikinci yarıda 2–4 değişiklik, 55. ile 87. dakika arasında */
    this.degisimPlani=[0,1].map(()=>{const n=2+Math.floor(this.rast()*3),L=[];for(let i=0;i<n;i++)L.push(3300+this.rast()*1920);return L.sort((a,b)=>a-b);});
  },
  /* duruşta sırası gelen değişiklik başlar: yorgun (ya da sarı kartlı) oyuncu çıkar, aynı mevkiden yedek girer. T10c: skora göre — gerideki takım
     60. dakikadan sonra değişikliği 10 dakikaya dek öne alır ve orta saha ya da forvetin yerine forvet sokar (yeni mevkide hücumcu); öndeki takım
     75. dakikadan sonra orta sahanın yerine savunmacı sokar. Diziliş değişikliği ve hocanın kararı Aşama 3.3'te (m.hoca kapısı) */
  degisiklikBaslat(du){
    if(this.degisiklik||this.half!==2||!['tac','kaleVurusu','serbest'].includes(du.tur))return;
    for(const t of[du.takim,1-du.takim]){
      const fark=this.score[t]-this.score[1-t],geri=fark<0&&this.gameSec>=3600,onde=fark>0&&this.gameSec>=4500;
      const plan=this.degisimPlani[t];if(!plan.length||this.gameSec<plan[0]-(geri?600:0)||this.ist.degisiklik[t]>=5)continue;
      const yedek=this.yedekler[t].filter(p=>!p.cikti&&p.rol!=='GK');if(!yedek.length){plan.length=0;continue;}
      let saha=this.teams[t].filter(p=>p.oyunda&&p.rol!=='GK'&&p!==du.kullanan&&!(p.eylem&&p.eylem.kilit));if(!saha.length)continue;
      const sec=f=>yedek.find(y=>y.isiniyor&&f(y))||yedek.find(f);   /* T10e: önce ısınanlardan */
      const hucumcu=geri&&sec(y=>y.rol==='FV'),savunmaci=onde&&sec(y=>y.rol==='DEF');
      if(hucumcu||savunmaci){const S=saha.filter(p=>hucumcu?p.rol!=='DEF':p.rol==='OS');if(S.length)saha=S;}
      const puan=p=>p.yorgunluk+(p.kart===1&&p.rol==='DEF'?0.25:0)+this.rast()*0.15-Math.min(p.z,PW-p.z)*0.004;
      const cikan=saha.reduce((a,c)=>puan(c)>puan(a)?c:a);
      const giren=hucumcu&&cikan.rol!=='DEF'?hucumcu:savunmaci&&cikan.rol==='OS'?savunmaci:sec(y=>y.rol===cikan.rol)||yedek.find(y=>y.isiniyor)||yedek[0];
      plan.shift();
      giren.oturuyor=false;giren.poz=null;giren.tx=0;giren.tz=-0.7;giren.hizOran=0.5;giren.bak=cikan;
      /* çıkan oyuncu en yakın çizgiden çıkar; ana tribün tarafındaysa kulübeye yürür. T10d: öndeki takımın çıkanı son dakikalarda yavaş yürür
         (T16a: hız degisiklikAdim'de dg.cikHiz'den — eskiden her karede 0,6'ya eziliyordu; olağan hız 0,6 aynen) */
      this.degisiklik={t,cikan,giren,t0:this.t,girdi:false,cikHiz:0.6*(1-0.5*(this._niyet?this._niyet[t].zamanGecir:0))};
      this.uzatmaBirikim[this.half-1]+=30;
      this.on('degisiklik',{takim:t,cikan,giren,skor:fark<0?'geri':fark>0?'onde':'esit'});
      return;}
  },
  /* T10e: ısınan yedekler — ikinci yarıda (55. dakikadan ya da ilk planlı değişiklikten 10 dakika önce) en çok 3 yedek kenarda ısınır: mümkünse
     her hattan biri; kulübe tarafındaki çizginin dışında, kulübeden köşeye doğru 7–25 m'de hafif koşar (p.isiniyor, p.isinma; olay isinma).
     Değişiklik ısınanlardan yapılır (degisiklikBaslat, zorunluDegisiklik). Devre ya da maç sonunda kulübeye otururlar (js/mac-oncesi.js) */
  isinmaAdim(dt){
    if(this.half!==2||this.kare%6)return;   /* T10g (hız): 6 karede bir (hedefler ve şerit ucu; ~0,25 m yol) */
    for(let t=0;t<2;t++){const Y=this.yedekler[t],kb=this.kulubeler[t],s=kb.alan.x>=0?1:-1,dg=this.degisiklik;
      const I=Y.filter(p=>p.isiniyor&&!p.cikti&&!(dg&&dg.giren===p));
      const plan=this.degisimPlani[t],bas=Math.max(3300,(plan.length?plan[0]:5400)-600);
      if(this.gameSec>=bas&&I.length<3&&this.ist.degisiklik[t]<5&&this.kare%30===0){
        const oturan=Y.filter(p=>!p.cikti&&p.oturuyor&&p.rol!=='GK'),roller=new Set(I.map(p=>p.rol)),y=oturan.find(p=>!roller.has(p.rol))||oturan[0];
        if(y){const k=Y.filter(p=>p.isinma).length%3;y.isiniyor=true;y.oturuyor=false;y.isinma={a:kb.alan.x+s*(7+k*1.5),b:kb.alan.x+s*(22+k*1.5),z:-3.2-0.6*k,yon:1};
          I.push(y);this.on('isinma',{p:y,takim:t});}}
      /* T10f: şeridin ucunda 2,5 sn esner (poz etiketi 'esneme'; çizim) */
      for(const p of I){const w=p.isinma;if(!w)continue;
        if(w.dur!=null){p.tx=p.x;p.tz=p.z;p.hizOran=0.3;if(this.t>=w.dur){w.dur=null;p.poz=null;w.yon=-w.yon;}continue;}
        const hx=w.yon>0?w.b:w.a;p.tx=hx;p.tz=w.z;p.hizOran=0.42;p.bak=null;p.yonHedef=null;
        if(hyp(p.x-hx,p.z-w.z)<0.8){w.dur=this.t+2.5;p.poz='esneme';}}}
  },
  /* T10c: değişikliğin takası — giren çıkanın yerini ve mevkisini alır; profili yeni mevkiye göre yeniden kurulur (T10 teşhisi hata 3: yedeğin
     profili kulübede mevkisiz kuruluyordu, kanadın yerine giren merkez gibi oynuyordu); çıkan kulübeye. Maçın kaydına yazılır */
  degisiklikTakas(dg){
    const {cikan,giren,t}=dg,n=cikan.n,i=this.players.indexOf(cikan),isindi=!!giren.isiniyor;
    Object.assign(giren,{tur:'oyuncu',n,mevki:cikan.mevki,rol:cikan.rol,oyunda:true,oturuyor:false,yorgunluk:0,hizOran:0.8,isiniyor:false,isinma:null,poz:null});
    profilKur(giren,this.tohum);
    this.teams[t][n]=giren;if(i>=0)this.players[i]=giren;
    Object.assign(cikan,{tur:'yedek',oyunda:false,cikiyor:false,cikti:true,koltuk:giren.koltuk,eylem:null,surus:null});
    const Y=this.yedekler[t];Y.splice(Y.indexOf(giren),1,cikan);
    if(this.ball.sahip===cikan)this.ball.sahip=null;
    this.ist.degisiklik[t]++;dg.girdi=true;dg.t1=this.t;
    this.kayit.degisiklikler.push({takim:t,cikan:cikan.name,giren:giren.name,dakika:Math.floor(this.gameSec/60)+1,sakatlik:!!dg.sakatlik});
    this.on('oyuncuGirdi',{takim:t,cikan,giren,isindi});
  },
  /* T10c: sakatlıkta zorunlu değişiklik — hak varsa (en çok 5) sakatın yerine aynı mevkiden yedek (kalecide yedek kaleci) girer; plandaki
     değişikliklerden biri kullanılmış sayılır. aninda: devre sonunda takas hemen (yürüme yok). Süren değişiklik, hak ya da uygun yedek yoksa false */
  zorunluDegisiklik(p,aninda){
    const t=p.team;if(this.degisiklik||this.ist.degisiklik[t]>=5)return false;
    const Y=this.yedekler[t].filter(q=>!q.cikti),giren=p.rol==='GK'?Y.find(q=>q.rol==='GK'):(Y.find(q=>q.isiniyor&&q.rol===p.rol)||Y.find(q=>q.rol===p.rol)||Y.find(q=>q.isiniyor)||Y.find(q=>q.rol!=='GK'));   /* T10e: önce ısınanlardan */
    if(!giren)return false;
    const plan=this.degisimPlani[t];if(plan.length)plan.shift();
    const dg={t,cikan:p,giren,t0:this.t,girdi:false,sakatlik:true};
    this.uzatmaBirikim[this.half-1]+=30;this.on('degisiklik',{takim:t,cikan:p,giren,sakatlik:true});
    giren.oturuyor=false;giren.poz=null;
    if(aninda){this.degisiklikTakas(dg);const k=p.koltuk;p.oturuyor=true;p.x=p.tx=k.x;p.z=p.tz=k.z;p.vx=p.vz=0;return true;}
    giren.tx=0;giren.tz=-0.7;giren.hizOran=0.6;giren.bak=p;
    this.degisiklik=dg;return true;
  },
  degisiklikAdim(dt){
    const dg=this.degisiklik;if(!dg)return;
    const {cikan,giren,t}=dg;
    /* çıkan: en yakın çizgiye yürür (kulübe tarafına), geçince kulübeye */
    if(!dg.girdi){cikan.tx=clamp(cikan.x,-PL+2,PL-2);cikan.tz=cikan.z<MZ?-0.8:PW+0.8;cikan.hizOran=dg.cikHiz||0.6;cikan.bak=null;cikan.yonHedef=null;
      giren.tx=0;giren.tz=-0.7;giren.hizOran=0.55;
      const disarida=cikan.z<0.2||cikan.z>PW-0.2,girenHazir=hyp(giren.x,giren.z+0.7)<1.2;
      if((disarida&&girenHazir)||this.t-dg.t0>14)this.degisiklikTakas(dg);}
    else{/* çıkan kulübedeki boş koltuğa oturur */const k=cikan.koltuk;
      if(cikan.z>MZ){cikan.tx=clamp(cikan.x,-PL,PL);cikan.tz=PW+2;}else{cikan.tx=k.x;cikan.tz=k.z;}
      cikan.hizOran=0.35;cikan.bak=null;
      if(hyp(cikan.x-k.x,cikan.z-k.z)<0.4){cikan.oturuyor=true;cikan.x=k.x;cikan.z=k.z;cikan.vx=cikan.vz=0;cikan.yon=Math.PI/2;}
      if(cikan.oturuyor||this.t-dg.t1>10){if(!cikan.oturuyor){cikan.oturuyor=true;cikan.x=k.x;cikan.z=k.z;}this.degisiklik=null;}}
  },

  /* ============ top toplayıcılar (N10): yan çizgilerin ve kalelerin arkasında 12 çocuk; her birinin elinde yedek top ============ */
  topculariKur(){
    const L=[],ekle=(x,z)=>L.push(this.varlik('topcu',x,z,{kind:'topcu',ev:{x,z},yon:z<0?Math.PI/2:z>PW?-Math.PI/2:x>0?Math.PI:0,maxSpd:5.6,hizOran:0.4,oz:{hiz:0.4},boy:0.72,top:true}));
    for(const x of[-41,-27,27,41])ekle(x,-2.9);
    for(const x of[-40,-14,14,40])ekle(x,PW+2.9);
    for(const s of[-1,1])for(const dz of[-13,13])ekle(s*(PL+3.4),MZ+dz);
    return L;
  },
  /* her adım: dışarıda duran topu boştaki en yakın çocuk toplar; görevli çocuk atanın yanına gelip topu verir; diğerleri yerinde oyunu izler.
     Maç öncesinde sırayla tünelden çıkıp yerlerine geçerler (sg.cikis; js/mac-oncesi.js). Tribüne giden top geri gelmez: topsuz kalan çocuğa
     ~40 sn sonra görevlilerce yeni top verilir */
  topcuAI(dt){
    const b=this.ball,oncesi=MAC_ONCESI.includes(this.phase);
    if(!oncesi)for(const o of this.disToplar){if(o.alan||hyp(o.vx,o.vz)>3||o.y>0.5)continue;
      /* yalnız topun bulunduğu kenarın çocuğu toplar: yolu sahadan geçmez */
      const bolge=o.z<0?'alt':o.z>PW?'ust':o.x<0?'sol':'sag';
      let en=null,ed=1e9;for(const k of this.topcular){if(k.top||k.gorev||this.topcuBolge(k)!==bolge)continue;const dd=hyp(k.x-o.x,k.z-o.z);if(dd<ed){ed=dd;en=k;}}
      if(en&&ed<60){en.gorev={tur:'al',top:o};o.alan=en;}}
    for(const k of this.topcular){
      const g=k.gorev;k.yonHedef=null;
      if(oncesi&&k.sg&&k.sg.cikis!=null&&this.sen&&this.sen.t<k.sg.cikis){this.moveP(k,dt);continue;}
      if(!g){k.tx=k.ev.x;k.tz=k.ev.z;k.hizOran=0.4;k.bak=oncesi?{x:k.ev.x*0.8,z:MZ}:b.tasiyan&&b.tasiyan!==k?b.tasiyan:b;
        if(!k.top&&!oncesi){k.topBos+=dt;if(k.topBos>40){k.top=true;k.topBos=0;}}}
      else if(g.tur==='al'){const o=g.top,i=this.disToplar.indexOf(o);
        if(i<0)k.gorev=null;
        else{/* topa kendi kenarından, çizginin dışından uzanır (sahaya basmaz) */
          const bo=this.topcuBolge(k);k.tx=bo==='sol'?Math.min(o.x,-PL-0.45):bo==='sag'?Math.max(o.x,PL+0.45):o.x;
          k.tz=bo==='alt'?Math.min(o.z,-0.45):bo==='ust'?Math.max(o.z,PW+0.45):o.z;k.hizOran=0.75;k.bak=o;
          if(hyp(k.x-o.x,k.z-o.z)<0.9){this.disToplar.splice(i,1);k.top=true;k.topBos=0;k.gorev=null;}}}
      else if(g.tur==='ver'){const du=this.phase==='durus'?this.durus:null;
        if(!du||du.topcu!==k||b.tasiyan!==k){if(b.tasiyan===k){b.tasiyan=null;this.topDegisti();}k.gorev=null;}
        else{/* atana yakın, saha dışında bir yere gelir; atan yaklaşınca topu atar. Atan yoksa (sahada uygun oyuncu kalmadı; yalnız yapay
             senaryolarda, ör. d-sut) bekler: stepDurus atanı yeniden seçer (M0, 2026-10-07; gerçek maçta sonuç değişmez) */
          k.tx=g.x;k.tz=g.z;k.hizOran=0.9;const tk=du.kullanan;k.bak=tk;
          if(tk){const L=hyp(tk.x-k.x,tk.z-k.z),gel=hyp(k.x-g.x,k.z-g.z)<2.5||L<9,menzil=du.tur==='serbest'||du.tur==='penalti'?32:16;
            /* atan çizgiye dönmeden atmaz: topun peşinden dışarı taşmış oyuncu (ör. kale arkasındaki kaleci) önce yerine yönelir */
            const tkDis=Math.max(Math.abs(tk.x)-PL,-tk.z,tk.z-PW);
            /* T3 bulgusu (2026-10-07): koşarak gelen atana uzaktan atılan top kontrol edilemeyip sahaya yuvarlanıyordu (taç, 16 sn'yi aşan
               hazırlık); top ancak atan yakındayken (6 m) ya da yavaşlamışken verilir */
            const yakin=L<6||(L<menzil&&tk.spd<2.5);
            if(gel&&yakin&&du.t>0.5&&tkDis<1.0){this.topcuAtar(k,tk,du);k.gorev=null;}}}}
      this.moveP(k,dt);
      /* T9b-a (2026-10-10, d-topcu bulgusu): çocuk sahaya girmez — dışarıdaki topu koşarak alıp dönerken atalet onu çizginin içine taşıyabiliyordu
         (kale çizgisinde 0,38 m); oyunda çizgi kendi kenarında kesin sınırdır, içeri doğru hızı kesilir */
      if(!oncesi&&Math.abs(k.x)<PL+0.05&&k.z>-0.05&&k.z<PW+0.05){const bo=this.topcuBolge(k);
        if(bo==='sag'){k.x=PL+0.05;if(k.vx<0)k.vx=0;}else if(bo==='sol'){k.x=-PL-0.05;if(k.vx>0)k.vx=0;}
        else if(bo==='alt'){k.z=-0.05;if(k.vz>0)k.vz=0;}else{k.z=PW+0.05;if(k.vz<0)k.vz=0;}}
    }
  },
  /* çocuğun durduğu kenar: alt (ana tribün önü), ust (karşı kenar), sol ve sag (kale arkaları) */
  topcuBolge(k){return k.ev.z<0?'alt':k.ev.z>PW?'ust':k.ev.x<0?'sol':'sag';},
  /* çocuk yedek topu atana verir (taçta ve autta elden atar; kornerde ve uzaktaki atana yerden yuvarlar) */
  topcuAtar(k,tk,du){
    const b=this.ball;b.tasiyan=null;k.top=false;k.topBos=0;
    const hx=clamp(tk.x+tk.vx*0.5,-PL-0.5,PL+0.5),hz=clamp(tk.z+tk.vz*0.5,-0.5,PW+0.5),L=hyp(hx-k.x,hz-k.z)||1;
    b.x=k.x+Math.cos(k.yon)*0.2;b.z=k.z+Math.sin(k.yon)*0.2;b.egri=0;b.ust=0;
    const yuvarla=du.tur==='korner'||L>14;
    if(yuvarla){b.y=0;b.vy=0;const v=yerIlkHiz(L,1.2,this.R);b.vx=(hx-b.x)/L*v;b.vz=(hz-b.z)/L*v;}
    else{b.y=1.0;const c=this.havadanCoz(b.x,1.0,b.z,hx,1.3,hz,0.55+L/16,0);b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;}
    k.eylem={ad:'atis',t:0,sure:0.5,stil:yuvarla?'yuvarla':'at'};this.topDegisti();this.on('topcu',{k,tk});   /* T8e: stil (çizim okur) */
  },
  /* duran topa uygun kenardaki en yakın, elinde top olan ve boştaki çocuk. Taçta o yan çizginin, kornerde o kale arkasının ya da o yan
     çizginin, autta o kale arkasının çocuğu; diğerlerinde en yakını. Duracağı yer kendi kenarında, çizginin dışında, atış noktasına en
     yakın yerdedir: çocuk sahaya girmez */
  topcuSec(du){
    const yan=du.z<MZ?'alt':'ust',kale=du.x<0?'sol':'sag';
    const uygun=du.tur==='tac'?[yan]:du.tur==='korner'?[kale,yan]:du.tur==='kaleVurusu'?[kale]:['alt','ust','sol','sag'];
    let en=null,ed=1e9;
    for(const k of this.topcular){if(!k.top||k.gorev||!uygun.includes(this.topcuBolge(k)))continue;const dd=hyp(k.x-du.x,k.z-du.z);if(dd<ed){ed=dd;en=k;}}
    if(!en)return null;
    const bo=this.topcuBolge(en);let x,z;
    if(bo==='alt'||bo==='ust'){z=bo==='alt'?-2.2:PW+2.2;x=du.tur==='tac'?clamp(du.x+(en.x>du.x?4:-4),-PL+1,PL-1):clamp(du.x,-PL+2.5,PL-2.5);}
    else{x=(bo==='sol'?-1:1)*(PL+2.3);z=du.tur==='korner'?(du.z<MZ?6:PW-6):du.tur==='kaleVurusu'?MZ+(du.z<MZ?-9.5:9.5):clamp(du.z,3,PW-3);}
    en.gorev={tur:'ver',x,z};return en;
  },
  /* top nerede durur (kariyeri değil, kopyayı ilerletir): panolarda durur; tribüne giderse null */
  topDuracagiYer(){
    const b=this.ball,o={x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:b.egri||0};
    for(let i=0;i<360;i++){topFizikAdim(o,1/30,false,this.R,this.kosullar);if(!this.panoSiniri(o))return null;if(o.y<0.01&&Math.abs(o.vy)<0.01&&hyp(o.vx,o.vz)<0.15)break;}
    return{x:o.x,z:o.z};
  },
  /* duran top için top: atış yerinin hemen yanında (≤2,5 m) duracaksa atan onu alır; değilse en yakın top toplayıcı elindeki topu verir,
     eski top dışarıda kalır (boştaki çocuk toplar). Uygun çocuk yoksa atan eski topu alır (eski davranış) */
  durusTopu(du,zorla){
    const b=this.ball,yer=zorla?null:this.topDuracagiYer();
    /* atan yalnız atış yerinin dibinde ve çizginin en çok 1,5 m dışında duracak topu kendisi alır */
    if(yer&&hyp(yer.x-du.x,yer.z-du.z)<2.5&&Math.max(Math.abs(yer.x)-PL,-yer.z,yer.z-PW)<1.5)return;
    const k=this.topcuSec(du);if(!k)return;
    this.disToplar.push({x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:0,t:0,alan:null});
    du.topcu=k;b.tasiyan=k;b.vx=b.vy=b.vz=0;b.egri=0;this.topDegisti();
  },

  /* ============ duran toplar ============ */
  durusBaslat(tur,takim,x,z,veri){
    /* T10d: bayrağı bekleyen ofsayt varken oyun başka sebeple durursa önce ofsayt çalınır (ilk ihlal) */
    if(this.ofsaytBekleyen&&!(veri&&veri.ofsayt)){const o=this.ofsaytBekleyen;this.ofsaytCal(o.p,o);return;}
    const b=this.ball;
    this.phase='durus';this.phaseT=0;
    for(const p of this.players){if(p.eylem&&!p.eylem.kilit)p.eylem=null;p.surus=null;p.kosu=null;p.destek=null;p.yonHedef=null;}
    b.sahip=null;b.hedefOyuncu=null;b.sut=null;b.pas=null;b.ofsaytta=null;b.endirekt=null;b.tac=null;b.kullanim=null;b.hakemDegdi=null;
    const du=Object.assign({tur,takim,x,z,t:0,asama:'bekle',kullanan:null,topcu:null,hazirT:0},veri||{});
    this.durus=du;
    /* T10d: zaman geçirme (öndeki takım; hakem topu ve penaltı hariç) */
    if(!du.hakemTopu&&tur!=='penalti'){du.zgEk=this.zamanGecirEk(takim,ZG_TABAN[tur]||0);if(du.zgEk>0)du.hizli=false;}
    du.kullanan=this.kullananSec(du);
    this.duranGorevAta(du);   /* T8a: görevler profilden (js/mac-durantop.js) */
    this.hocaKapisi();   /* T7a: hoca kapısı — m.hoca geri çağrısı varsa her duruşta sorulur (js/mac-takim.js) */
    /* taç, korner, aut ve saha dışında kalan top: top toplayıcı yedek topu verir (N10). Faulde top sahadadır; atan alıp yerine taşır */
    b.tasiyan=null;
    if(tur==='tac'||tur==='korner'||tur==='kaleVurusu'||Math.abs(b.x)>PL+0.2||b.z<-0.2||b.z>PW+0.2)this.durusTopu(du);
    /* T10d: penaltıda top noktaya konur (hakem gösterir; kullanan topu taşımaz, noktaya yürür — T8'den penaltı hazırlığı 14–16 sn, hedef 8–12) */
    else if(tur==='penalti'){b.tasiyan=null;b.x=x;b.z=z;b.y=0;b.vx=b.vy=b.vz=0;this.topDegisti();}
    /* T10b (T10 teşhisi hata 5): avantaj sürerken oyun durdu — avantaj kapanır, kart bu duruşta gösterilir (eskiden oyun dönünce kapanıyor, kart bir
       duruş geç kalıyordu). Avantajdan kalan kart ilk duruşta gösterilir */
    if(this.avantaj){const a=this.avantaj;this.avantaj=null;this.on('avantajSonuc',{tutuldu:!!a.tuttu});if(a.kart)this.bekleyenKart=a;}
    if(this.bekleyenKart){const a=this.bekleyenKart;this.bekleyenKart=null;if(a.yapan.oyunda)this.kartGoster(a.yapan,a.kart);}
    if(tur==='tac')this.ist.tac[takim]++;else if(tur==='korner')this.ist.korner[takim]++;else if(tur==='kaleVurusu')this.ist.kaleVurusu[takim]++;
    if(tur==='kaleVurusu'||tur==='korner')this.kacanFirsat();   /* T7f: kaçan büyük fırsatta şutçu başını tutar */
    /* T8-0: faulde ve ofsaytta aynı karede yazılan düdük / penaltı işareti ezilmez (hakem çizimi olaydan da kurar; sonuç değişmez) */
    const r=this.refs[0],re=r.eylem;if(!(re&&re.t===0&&(re.ad==='duduk'||re.ad==='penaltiGoster')))r.eylem={ad:'yon',t:0,sure:1.3,yon:this.dir[takim]};
    if(tur==='korner'||tur==='kaleVurusu'){const yh=b.x>0?this.refs[1]:this.refs[2];yh.eylem={ad:'bayrak',t:0,sure:1.6,tur};}
    const eski={tac:'throw',korner:'corner',kaleVurusu:'goalkick'}[tur];
    this.on(tur,{team:takim,taker:du.kullanan,x,z});if(eski)this.on(eski,{team:takim,taker:du.kullanan});
    this.degisiklikBaslat(du);
  },
  kullananSec(du){
    const tm=this.sahadakiler(du.takim);
    if(du.tur==='kaleVurusu'||du.kaleciye)return this.kaleci(du.takim)||tm[0];   /* T10d: ceza sahasındaki hakem topu kaleciye */
    let en=null,ep=1e9;
    for(const p of tm){if(p.rol==='GK'&&du.tur!=='serbest')continue;
      let c=hyp(p.x-du.x,p.z-du.z);
      /* T3: görevli profilden — korner: duran top + orta; penaltı: şut + soğukkanlılık; tehlikeli serbest vuruş: duran top (T8 bunun üstüne kurulur) */
      if(du.tur==='korner')c=c*0.4+(p.rol==='OS'?0:30)-(p.profil?0.5*p.profil.alt.duranTop+0.5*p.profil.alt.orta:p.oz.pas)*20;
      if(du.tur==='tac'&&(p.mevki.bek||p.mevki.kanat))c-=6;
      if(du.tur==='penalti')c=-(p.profil?0.6*p.oz.sut+0.4*p.profil.alt.sogukkanlilik:p.oz.sut)*50-(p.rol==='FV'?10:0)+(p.rol==='GK'?99:0);
      if(du.tur==='serbest'&&p.rol==='GK')c=this.kendiCezaSahasinda(p,du.x,du.z)?c-10:c+60;
      if(du.tur==='serbest'&&this.tehlikeliSerbest(du))c=c*0.3-profilAlt(p,'duranTop',p.oz.sut)*25;
      /* T8a: yerdeki ya da düşen (kilitli eylemdeki) oyuncu duran topu kullanmaz (penaltı hariç: görevli vurucu kalkar); faulden sonra yiyen
         oyuncu en yakın olduğu için seçiliyor, serbest vuruşların %59'unda kalkışı bekleniyordu */
      if(p.eylem&&p.eylem.kilit&&du.tur!=='penalti')c+=20;
      if(c<ep){ep=c;en=p;}}
    return en;
  },
  /* atış/vuruş noktasında atanın durduğu yer */
  durusNoktasi(du){
    const d=this.dir[du.takim];
    if(du.tur==='tac')return{x:du.x,z:du.z<MZ?-0.35:PW+0.35};
    if(du.tur==='korner')return{x:du.x,z:du.z};
    return{x:du.x,z:du.z};
  },
  stepDurus(dt){
    const du=this.durus,b=this.ball,tk=du.kullanan,d=this.dir[du.takim];du.t+=dt;
    if(!tk||!tk.oyunda){du.kullanan=this.kullananSec(du);this.duranGorevAta(du);return;}
    this.taramaAdim(dt);   /* duran topta da etrafa bakılır */
    this.takimAI(dt,du);
    this.durusYerlesim(du,dt);
    /* T8a: faulden sonra yuvarlanan topu en yakın oyuncu durdurur; çabuk serbest vuruş düdükten 0,3 sn sonra bir kez tartılır (js/mac-durantop.js) */
    if((du.tur==='serbest'||du.tur==='penalti')&&(du.asama==='bekle'||du.asama==='getir'))this.topDurdur(du);
    if(du.tur==='serbest'&&du.hizli==null&&du.t>=0.3)du.hizli=this.hizliSerbestMi(du,tk);
    const nk=this.durusNoktasi(du);
    if(du.t>16&&(du.asama==='getir'||du.asama==='bekle')){b.tasiyan=tk;this.topDegisti();du.asama='yerles';}
    /* çok uzadıysa: atan yerine konur (taçta top elinde) */
    if(du.t>28&&du.asama!=='hazir'&&du.asama!=='kullan'){du.asama='hazir';
      if(du.tur==='tac'){tk.x=nk.x;tk.z=nk.z;tk.vx=tk.vz=0;b.tasiyan=tk;tk.eylem={ad:'tac',t:0,faz:'tut',ft:0};}
      else{b.tasiyan=null;du.geriX=tk.x;du.geriZ=tk.z;du.aci=tk.yon;b.x=du.x;b.z=du.z;}}
    /* T7a: önde biten son dakikalarda duran topta acele yok (niyetin duranGecikme'si) */
    /* T9b-a (d-topcu bulgusu): topu kovalarken hızla çizgiyi aşan atan sert durur (azami fren; rahat frenle 5 m/sn'den ~2,8 m taşıyordu) */
    if((du.asama==='bekle'||du.asama==='getir')&&tk.spd>3)this.eforVer(tk,1);
    /* T8a: kullanan topa ve yerine düzenli yürür/koşar (efor 0,8; T1 hız kipi 8 m içinde 1,6 m/sn'lik yürüyüşe düşürüyordu: serbest vuruşta topu
       yerine taşımak ~3 sn sürüyordu) */
    else if(du.asama==='bekle'||du.asama==='getir'||du.asama==='yerles')this.eforVer(tk,0.8);
    if(du.asama==='bekle'){tk.tx=nk.x;tk.tz=nk.z;tk.hizOran=0.8;if(du.t>(du.hizli?0.3:(du.bekle||0.45)+(this._niyet&&du.tur!=='penalti'?this._niyet[du.takim].duranGecikme:0)))du.asama='getir';}
    else if(du.asama==='getir'){
      if(b.tasiyan===tk)du.asama='yerles';
      /* top çocuğun elinde: atan atış yerine gelir, çocuğa döner ve topu bekler (saha dışına çıkmaz) */
      else if(b.tasiyan&&b.tasiyan.tur==='topcu'){tk.tx=nk.x;tk.tz=nk.z;tk.hizOran=0.85;tk.bak=b.tasiyan;}
      else if(!b.tasiyan){/* top havada ya da yerde: atan alır. T4h (2026-10-09, N10 kuralı): atan çizginin en çok 1,6 m dışına gider (tahmin topun
           1,5 m içinde duracağını söylese de yavaş top öteye yuvarlanabiliyor; 1 m'lik alma erimiyle 2,6 m'ye dek yetişir); top 2,5 m'den öteye
           yuvarlanıp yavaşladıysa top toplayıcı yenisini verir (uygun çocuk yoksa atan gider). T6b (2026-10-10, d-topcu bulgusu): çocuğun attığı
           yedek topu atan kaçırıp top yine 2,5 m'den öteye yuvarlandıysa başka bir çocuk yenisini verir (eskiden yalnız ilk top: atan topa
           uzanamayıp 16 sn'lik zorla teslime kadar takılıyordu) */
        if(Math.max(Math.abs(b.x)-PL,-b.z,b.z-PW)>2.5&&hyp(b.vx,b.vz)<1&&b.y<0.3)this.durusTopu(du,true);
        if(!b.tasiyan){const k=this.yakalamaNoktasi(tk,2.2);tk.tx=clamp(k.x,-PL-1.6,PL+1.6);tk.tz=clamp(k.z,-1.6,PW+1.6);tk.hizOran=0.8;tk.bak=b;
          if(hyp(b.x-tk.x,b.z-tk.z)<1.0&&b.y<2.3){b.tasiyan=tk;b.vx=b.vy=b.vz=0;this.topDegisti();du.asama='yerles';}}}
    }else if(du.asama==='yerles'){
      tk.tx=nk.x;tk.tz=nk.z;tk.hizOran=0.8;tk.bak=null;tk.yonHedef=Math.atan2(MZ-nk.z,d*20-nk.x);   /* T8a: 0,7 → 0,8 */
      if(hyp(tk.x-nk.x,tk.z-nk.z)<0.45){
        if(du.tur==='tac'){tk.eylem={ad:'tac',t:0,faz:'tut',ft:0};du.asama='hazir';
          /* T8d: uzun taç kararı burada (atan koşu için çizginin 3 m gerisine çekilir; hedef atışta tazelenir) */
          const U=this.tacUzunSecenegi(du,tk,true);if(U){du.tacUzun=U;const dis=nk.z<MZ?-1:1;du.tacGeri={x:nk.x,z:nk.z+dis*3};}}
        else{/* topu yere koy, geri çekil. T8a: topu yere koyma eylemi (yerlestir, 0,6 sn; çabuk vuruşta yok), geri çekilme türe ve profile göre
             (duranGeriMesafe; eskiden 1,3, penaltıda 2,2 m) */
          b.tasiyan=null;b.x=du.x;b.z=du.z;b.y=0;b.vx=b.vy=b.vz=0;this.topDegisti();du.asama='hazir';
          const a=this.durusHedefAcisi(du),gm=this.duranGeriMesafe(du,tk);du.aci=a;du.geriX=du.x-Math.cos(a)*gm;du.geriZ=du.z-Math.sin(a)*gm;
          if(!du.hizli&&(du.tur!=='serbest'||this.duranTehlikeli(du))){tk.eylem={ad:'yerlestir',t:0,sure:0.6};du.yerT=du.t;}}}
    }else if(du.asama==='hazir'){
      du.hazirT+=dt;
      if(du.tur!=='tac'){const yer=du.yerT!=null&&du.t-du.yerT<0.6;tk.tx=yer?tk.x:du.geriX;tk.tz=yer?tk.z:du.geriZ;tk.hizOran=0.4;tk.yonHedef=du.aci;tk.bak=null;b.x=du.x;b.z=du.z;b.vx=b.vz=0;
        /* T8a: geri adımlar düzenli (efor 0,8, yavaş; 3–7 m geri çekilme T1 hız kipinde ~3 sn sürüyordu); T8f: topa yürüyüş (kisaGeri) 0,6 */
        if(!yer&&hyp(tk.x-du.geriX,tk.z-du.geriZ)>0.5){tk.hizOran=du.kisaGeri?0.6:0.3;this.eforVer(tk,0.8);}}
      /* T8d: uzun taçta atan topu başının üstünde tutarak çizginin 3 m gerisine yürür (koşu için) */
      let tacHazir=true;if(du.tur==='tac'&&du.tacGeri){const G=du.tacGeri;tk.tx=G.x;tk.tz=G.z;tk.hizOran=0.3;tk.yonHedef=Math.atan2(MZ-G.z,0);tk.bak=null;tacHazir=hyp(tk.x-G.x,tk.z-G.z)<0.5||du.hazirT>4;}
      const sakatBekle=this.sakatlikBekletir();if(sakatBekle)du.sakatBekledi=true;   /* T10d: ölçüm (k-duran hazırlığı sakatlık bekleyişini ayırır) */
      const degisimBekle=this.degisiklik&&!this.degisiklik.girdi||sakatBekle;   /* T10c: tedavi ve sedye sürerken de bekler */
      /* T8a: kullanım koşulu (hazırlık penceresi, görevliler yerinde, el işareti; js/mac-durantop.js duranHazirMi) */
      if(!degisimBekle&&tacHazir&&!(du.kisaGeri&&hyp(tk.x-du.geriX,tk.z-du.geriZ)>0.5)&&this.duranHazirMi(du,tk))this.durusKullan(du);
    }else if(du.asama==='kullan'){
      /* T8a: kullananın koşusu ve vuruşu (vuruş eylemi) sürerken duruş sürer, oyun temasta başlar (kullanimBildir); kullanan vuruştan vazgeçerse
         (hat kapandı, süre doldu, ıska) oyun başlar ve yeniden karar verir */
      if(!(tk.eylem&&tk.eylem.ad==='vurus')){this.phase='play';this.phaseT=0;this.durus=null;tk.kararT=0;}
      else if(du.tur==='penalti')this.kaleciPenaltiErken(du);   /* T8d: kaleci koşuyu okur (js/mac-kaleci.js) */
    }
    this.degisiklikAdim(dt);
    this.hareketHepsi(dt);this.topAdim(dt);
    /* saha dışındaki top panolarda durur; panoların üstünden tribüne giderse top toplayıcı yenisini verir */
    if(this.phase==='durus'&&!b.tasiyan&&(Math.abs(b.x)>PL||b.z<0||b.z>PW)&&!this.panoSiniri(b))this.durusTopu(du,true);
  },
  /* duran topu kullan. T8a: vuruşla kullanılan duran topta oyun kullananın koşusundan sonra, topa temasta başlar (asama 'kullan'; baraj ve
     görevliler koşu boyunca yerinde kalır, eskiden düzen koşunun başında dağılıyor, presçi koşuya giriyordu); vuruş seçimi yoksa hemen */
  durusKullan(du){
    const tk=du.kullanan,b=this.ball,d=this.dir[du.takim];
    this.sonKullanim={tur:du.tur,p:tk,t:this.t};
    if(du.zgEk>0)this.zamanGecirmeGoruldu(tk,du.zgEk);   /* T10d */
    /* T8b (inceleme bulgusu): görevliler kullanım anında yerinde miydi (k-duran ölçümü; yalnız okur) */
    if(this.duranTehlikeli(du)||du.tur==='penalti')du.yerinde=this.gorevlilerYerinde(du);
    this.kullanimBaslat(du.tur,tk,du,this.t-du.t);   /* T8-0: kullanım bayrağı; olay kullananın ilk dokunuşunda (js/mac-durantop.js) */
    /* T8d: uzun taçta (yerleşmede karar) atan çizgiye koşar ('kosu'), hedef atışta tazelenir; kısa taçta eski atış */
    if(du.tur==='tac'){const e=tk.eylem;if(e&&e.ad==='tac'&&e.faz==='tut'){e.ft=0;
      if(du.tacUzun){const U=this.tacUzunSecenegi(du,tk,false)||du.tacUzun,nk=this.durusNoktasi(du);e.uzun=U;e.hedef=U.q;e.faz='kosu';e.kx=nk.x;e.kz=nk.z;}
      else{e.faz='at';e.hedef=this.tacHedefi(tk);}}return;}
    if(!du.hizli&&(du.duduk||du.tur==='penalti'||du.baraj)&&!du.dudukCalindi){du.dudukCalindi=true;this.on('duduk',{tur:du.tur});}
    b.tasiyan=null;b.x=du.x;b.z=du.z;b.y=0;b.vx=b.vz=b.vy=0;b.ust=0;this.topDegisti();
    tk.x=du.geriX;tk.z=du.geriZ;if(tk.eylem&&!tk.eylem.kilit)tk.eylem=null;
    this.sahipYap(tk);
    /* dolaylı serbest vuruş: başka bir oyuncu dokunmadan gol olmaz (Match.gol) */
    b.endirekt=du.endirekt?{p:tk,hakemTopu:!!du.hakemTopu}:null;   /* T10f: hakem topunda işaret yok (çizim ve ölçüm ayırır) */
    const sec=du.kisaGeri?null:this.durusSecenegi(du,tk);   /* T8f: topa yürüdükten sonra ilk karar (sürdürme) geçerlidir, yeniden zar atılmaz */
    if(sec){sec.duran=true;du.asama='kullan';if(du.ikili)this.aldatmaHazirla(du,sec);   /* A4-1: topun başında iki kişi (js/mac-durantop.js) */
      this.vurusBaslat(tk,sec);if(du.tur==='penalti')this.penaltiKaleciHazirla(du);return;}
    /* T8b (inceleme bulgusu): vuruş seçeneği yoksa (serbest vuruşun şutsuz ve ortasız payı: oyunu sürdürme, rutin) oyun kullanan topun başındayken
       başlar — geri çekildiği 3–7 m'de başlarsa sahiplik ilk karede düşüyor, top kimsenin değilken 9,15 m kuralı kalkıyordu. T8f (inceleme): kullanan
       ışınlanmaz, duruş sürerken topun 1 m gerisine yürür (hazır evresi, hizOran 0,6), sonra yeniden kullanır (düdük bir kez çalar) */
    const gx=du.geriX-du.x,gz=du.geriZ-du.z,gL=hyp(gx,gz);
    if(gL>1.3&&!du.kisaGeri){du.kisaGeri=true;du.geriX=du.x+gx/gL*1.0;du.geriZ=du.z+gz/gL*1.0;b.sahip=null;b.endirekt=null;b.kullanim=null;du.asama='hazir';return;}
    this.phase='play';this.phaseT=0;this.durus=null;tk.kararT=0;
  },
  /* duran topun ilk vuruşu: korner ve serbest vuruş mac-topla.js, kale vuruşu mac-kaleci.js (Faz 0) */
  durusSecenegi(du,tk){
    if(du.tur==='korner')return this.kornerSecenegi(du,tk);
    if(du.tur==='kaleVurusu')return this.kaleVurusuSecenegi(du,tk);
    if(du.tur==='penalti')return this.penaltiAtisi(du,tk);
    if(du.tur==='serbest')return this.serbestKarar(du,tk);   /* T8c: js/mac-durantop.js */
    return null;
  },
  /* taç: atan top başının üstünde bekler, açıktaki arkadaşa atar */
  tacIlerle(p,e,dt){
    const b=this.ball;e.ft+=dt;
    if(e.faz==='tut'){if(b.tasiyan!==p)p.eylem=null;return;}
    /* T8d: uzun taçta 3 m koşu (3–5 adım), topu başının arkasında tutarak; çizgiye varınca atar */
    if(e.faz==='kosu'){if(b.tasiyan!==p){p.eylem=null;return;}p.tx=e.kx;p.tz=e.kz;p.hizOran=0.75;this.eforVer(p,1);p.yonHedef=Math.atan2(MZ-e.kz,0);p.bak=null;
      if(hyp(p.x-e.kx,p.z-e.kz)<0.3||e.ft>1.6){e.faz='at';e.ft=0.2;}return;}
    if(e.faz==='at'&&!e.atti&&e.ft>=0.34){
      e.atti=true;const q=e.hedef,U=e.uzun,hx=U?U.hx:q?q.x+q.vx*0.6:p.x+this.dir[p.team]*8,hz=U?U.hz:q?q.z+q.vz*0.6:clamp(p.z+(p.z<MZ?8:-8),1,PW-1);
      e.hx=hx;e.hz=hz;   /* T8-0: atışın hedefi (kullanım olayı okur) */
      /* T8d: uzun taç kutudaki alıcının başına (sıçrayan başın hizası), ~16 m/sn'lik yatay hızla (havada 0,5 + L/16 sn) */
      const L=hyp(hx-p.x,hz-p.z),c=this.havadanCoz(p.x,2.0*p.boy,p.z,hx,U?U.hy:1.0,hz,U?0.5+L/16:0.4+L/20,0);
      b.tasiyan=null;b.x=p.x+Math.cos(p.yon)*0.25;b.z=p.z+Math.sin(p.yon)*0.25;b.y=2.0*p.boy;b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.egri=0;
      this.dokunus(p,true);b.hedefOyuncu=q||null;p.kickCd=0.4;b.tac={p};b.ust=0;if(U&&q)b.pasHedef={x:hx,z:hz,tur:'orta'};   /* uzun taç orta gibi okunur */
      this.phase='play';this.phaseT=0;this.durus=null;
    }
    if(e.ft>=0.65)p.eylem=null;
  },
  tacHedefi(p){
    let en=null,ep=-1e9;const d=this.dir[p.team];
    for(const q of this.sahadakiler(p.team)){if(q===p||q.rol==='GK')continue;const L=hyp(q.x-p.x,q.z-p.z);if(L<4||L>24)continue;
      const bos=enYakinRakip(this,q.x,q.z,p.team).d,s=Math.min(bos,7)*0.5+(q.x-p.x)*d*0.06-L*0.05+this.rast()*0.8;if(s>ep){ep=s;en=q;}}
    return en;
  },


  cezaSahasi(t,x,z){const gx=-this.dir[t]*PL;return Math.abs(x-gx)<CEZA_U&&Math.abs(z-MZ)<CEZA_W;},
  kartGoster(p,renk,neden){
    const r=this.refs[0];
    /* U1 (2026-10-12): kırmızı görmüş (çıkışı bekleyen) oyuncuya yeni kart verilmez — eskiden aynı duruşta faulden ikinci sarıdan sonra itirazdan
       gelen sarı p.kart'ı 2'den 1'e geri yazıyor, oyuncu oyundan atılmıyordu (20 dakikalık taramada tohum 1) */
    if((p.kart||0)>=2)return;
    this.uzatmaBirikim[this.half-1]+=30;   /* U1: disiplin cezası uzatmaya girer (IFAB Kural 7; eskiden faul 15 + kart 15 faulde eklenirdi) */
    if(renk==='sari'&&p.kart===1)renk='ikinciSari';
    if(renk==='sari'){p.kart=1;this.ist.sari[p.team]++;}
    else{if(renk==='ikinciSari')this.ist.sari[p.team]++;p.kart=2;this.ist.kirmizi[p.team]++;}
    /* T10b (T10 teşhisi hata 1): kartlar sıraya girer — eskiden tek yer vardı (r.kartSira), birkaç saniye içinde ikinci kart gelirse ilki eziliyor,
       kırmızı gören oyuncu oyundan çıkarılmayabiliyordu. Hakem sıradakini gösterir; r.kartSira gösterilen karttır (çizim okur) */
    const k={p,renk,t:0};(r.kartKuyruk||(r.kartKuyruk=[])).push(k);if(!r.kartSira)r.kartSira=k;
    this.kayit.kartlar.push({ad:p.name,no:p.no,takim:p.team,renk,neden:neden||null,dakika:Math.floor(this.gameSec/60)+1});   /* T10c: maçın kaydı */
    this.on('kart',{p,renk,aleyhe:p.team,takim:p.team,neden:neden||null});   /* T10b: neden (itiraz …; faul kartının gerekçesi faul olayındadır) */
  },
  /* T10d: zaman geçirme — öndeki takım son dakikalarda (niyetin zamanGecir'i, maç durumunun koru'su 0–1): duran topu geç kullanır (durusBaslat
     zgEk: taç 3,5 · kale vuruşu 6 · serbest 3 · korner 2,5 sn × yoğunluk × 0,6–1,4; js/mac-durantop.js duranHazirMi bekler), kaleci topu elinde
     tutar (js/mac-kaleci.js kaleciElde), çıkan oyuncu yavaş yürür. Hakem görür: kaybın üçte birini uzatmaya ekler (maç saati; gerçekte de
     eksik ekler), 3 sn'den uzun gecikmede uyarır (olay uyari; 0,25 + 0,3·(sertlik − 0,5)), uyarıdan sonra tekrarında sarı (neden 'zaman'; aynı
     olasılık), takım başına bir kez */
  zamanGecirEk(t,taban){const N=this._niyet&&this._niyet[t],z=N?N.zamanGecir:0;return z>0.05&&taban>0?taban*z*(0.6+0.8*this.rast()):0;},
  zamanGecirmeGoruldu(p,ek){
    if(!p||!(ek>0))return;const uz=ek*saatCarpani()/3;this.uzatmaBirikim[this.half-1]+=uz;this.on('zamanGecirme',{p,ek,uz});   /* U1: uz uzatmaya eklenen (maç sn) */
    const Z=this.zgUyari,t=p.team;if(ek<3||Z[t]>=2)return;
    if(this.rast()>=0.25+0.3*(hkDeger(this,'sertlik')-0.5))return;
    if(!Z[t]){Z[t]=1;this.on('uyari',{p,neden:'zaman'});}else{Z[t]=2;this.kartGoster(p,'sari','zaman');}
  },
  itirazEt(yapan){
    let n=0;for(const q of this.teams[yapan.team]){if(!q.oyunda||q.rol==='GK'||n>=2)continue;
      /* U1: sarı kartlı oyuncu daha az itiraz eder (0,55 → 0,25), hakem ona itirazdan sarıyı yarı olasılıkla gösterir (ikinci sarıda isteksizlik) */
      const kartli=q.kart===1;
      if(hyp(q.x-yapan.x,q.z-yapan.z)<14&&this.rast()<(kartli?0.25:0.55)){q.eylem={ad:'itiraz',t:0,sure:1.4+this.rast()};n++;
        /* T10b: itirazdan sarı — oyuncunun hakeme itiraz eğilimi (profil; eskiden okunmuyordu) ve hakemin sertliği; kartı olan da görebilir (ikinci sarı) */
        if(this.rast()<MOTOR_AYAR.itirazKart*(1+1.5*Math.max(0,profilEgilim(q,'hakemeItiraz')))*(0.5+hkDeger(this,'sertlik'))*(kartli?0.5:1))this.kartGoster(q,'sari','itiraz');}}
  },

  /* her karede: avantajın süresi, kaleci elde, kayma teması */
  kuralAdim(dt){
    const b=this.ball;
    if(this.degisiklik&&this.degisiklik.girdi)this.degisiklikAdim(dt);
    if(b.tasiyan&&b.tasiyan.rol==='GK')this.kaleciElde(dt);
    for(const p of this.players)if(p.eylem&&p.eylem.ad==='kayma')this.kaymaTemas(p);
    this.tutmaAdim();   /* T10b: markajda tutma (js/mac-mudahale.js) */
    this.avantajAdim(dt);
    this.hakemDegdiAdim();   /* T10d: hakeme çarpan top el değiştirdiyse hakem topu */
    this.ofsaytBekleAdim();   /* T10d: geç kalkan ofsayt bayrağı */
  },
  /* T10d: hakem topu (2019 kuralı; §7.6) — topu son oynayan takımın bir oyuncusuna, son dokunuşun yerinde; top ceza sahasındaysa savunan
     takımın kalecisine. Hakem noktaya gelir ve topu bırakır (duranHazirMi → hakemTopuBirak, js/mac-durantop.js), top yere değince oyun başlar;
     rakipler en az 4 m uzakta, doğrudan gol olmaz (endirekt). Kaynaklar: sakatlık (js/mac-sakatlik.js hakemTopuDurdur), hakeme çarpan top
     (hakemDegdiAdim). veri: olaya eklenir (sakatlıkta p, ek) */
  hakemTopuBaslat(takim,x,z,neden,veri){
    x=clamp(x,-PL+1,PL-1);z=clamp(z,1,PW-1);
    const kutu=Math.abs(x)>PL-CEZA_U&&Math.abs(z-MZ)<CEZA_W;if(kutu)takim=this.dir[0]===-Math.sign(x)?0:1;
    this.refs[0].eylem={ad:'duduk',t:0,sure:1.0};this.on('hakemTopu',Object.assign({takim,x,z,neden,kutu},veri||{}));
    this.durusBaslat('serbest',takim,x,z,{bekle:1.0,endirekt:true,hakemTopu:true,kaleciye:kutu,duduk:true,hizli:false});
  },
  /* T10d (2019): top hakeme çarptı (js/mac-mudahale.js govdeCarpmasi b.hakemDegdi) ve sonraki dokunuş öbür takımınsa oyun durur, hakem topu
     topu son oynayan takıma çarpmanın yerinde; aynı takım dokunursa ya da 8 sn geçerse bir şey olmaz. Doğrudan kaleye giren top gol değildir (golIptalMi) */
  hakemDegdiAdim(){const b=this.ball,H=b.hakemDegdi;if(!H)return;
    if(b.sonDokunan!==H.dokunan){b.hakemDegdi=null;if(b.sonTakim!==H.takim)this.hakemTopuBaslat(H.takim,H.x,H.z,'hakem');}
    else if(this.t-H.t>8)b.hakemDegdi=null;},

  /* ============ ofsayt ============ */
  /* pas anında yan hakemin değerlendirmesi. T10d (gerçekçilik planı T10 madde 3; Ek G7): çizgi sondan ikinci savunmacı (top öndeyse top); yan
     hakem gerçek farkı hatasız görmez — algılanan fark = gerçek fark + hizalanma hatası (yan hakem çizginin hizasında değilse bakış açısı:
     (x_yh − x_çizgi)·(z_oyuncu − z_çizgi)/(z_çizgi − z_yh), ±3 katla sınırlı) + hareket yanılgısı (ofsaytLag × ileri hız farkı: koşan hücumcu
     ileride, geri çekilen çizgi geride görülür) + gürültü (ofsaytHata); şüphede bayrak inmez (ofsaytPay). Gerçekte ucu ucuna pozisyonda yan
     hakemin hatası ~%25, çoğu yanlış bayrak (Helsen 2006). liste: bayrak kalkacaklar; kacan: gerçekte ofsaytta olup görülmeyenler */
  ofsaytPasAni(p){
    const b=this.ball,son=this.sonKullanim;
    if(son&&son.p===p&&this.t-son.t<1.5&&(son.tur==='tac'||son.tur==='korner'||son.tur==='kaleVurusu')){b.ofsaytta=null;return;}
    const t=p.team,d=this.dir[t],bu=b.x*d,A=MOTOR_AYAR;
    let s1=null,s2=null;for(const o of this.teams[1-t]){if(!o.oyunda)continue;const u=o.x*d;if(!s1||u>s1.x*d){s2=s1;s1=o;}else if(!s2||u>s2.x*d)s2=o;}
    const cu=Math.max(s2?s2.x*d:0,0),topCizgi=bu>cu,cizgi=Math.max(cu,bu),ref=topCizgi||!s2?{x:cizgi*d,z:topCizgi?b.z:MZ,vx:0}:s2;
    const liste=[],kacan=[];
    for(const q of this.teams[t]){if(q===p||!q.oyunda)continue;const qu=q.x*d;if(qu<=0)continue;const f=qu-cizgi;if(f<-1.5)continue;
      const yh=q.x>0?this.refs[1]:this.refs[2],k=clamp((q.z-ref.z)/((ref.z-yh.z)||1e-3),-3,3);
      const algi=f+(yh.x-cizgi*d)*d*k+A.ofsaytLag*((q.vx||0)-(ref.vx||0))*d+this.normal()*A.ofsaytHata;
      if(algi>A.ofsaytPay)liste.push({q,fark:f,algi});else if(f>0.05)kacan.push({q,fark:f,algi});}
    b.ofsaytta=liste.length||kacan.length?{takim:t,liste,kacan,t:this.t}:null;
  },
  /* ofsayttaki oyuncu topa dokundu: bayrak tepkiyle (ofsaytBayrak), ucu ucuna pozisyonda “bekle ve gör” ile daha geç kalkar (ofsaytBekle); o
     sürede oyun sürer, gol olursa iptal (golIptalMi), başka duruş olursa önce ofsayt çalınır (durusBaslat). Görülmeyen ofsayt: olay ofsaytKacti */
  ofsaytDokunus(p,kasitli){
    const b=this.ball,o=b.ofsaytta;if(!o)return;
    if(p.team!==o.takim){if(kasitli)b.ofsaytta=null;return;}
    const k=o.liste.find(a=>a.q===p),kc=k?null:o.kacan.find(a=>a.q===p);b.ofsaytta=null;
    if(kc){this.on('ofsaytKacti',{p,fark:kc.fark});return;}
    if(!k||this.ofsaytBekleyen)return;
    const A=MOTOR_AYAR,g=A.ofsaytBayrak[0]+this.rast()*(A.ofsaytBayrak[1]-A.ofsaytBayrak[0])+(Math.abs(k.algi)<1?A.ofsaytBekle:0);
    this.ofsaytBekleyen={p,t:this.t+g,g,x:p.x,z:p.z,fark:k.fark,yanlis:k.fark<=0.05};
  },
  ofsaytBekleAdim(){const o=this.ofsaytBekleyen;if(o&&this.t>=o.t){this.ofsaytBekleyen=null;this.ofsaytCal(o.p,o);}},
  /* o: bekleyen bayrak {x, z (dokunuşun yeri), fark, yanlis, g (gecikme)} */
  ofsaytCal(p,o){
    o=o||{x:p.x,z:p.z,fark:null,yanlis:false,g:0};this.ofsaytBekleyen=null;
    const yh=o.x>0?this.refs[1]:this.refs[2];yh.eylem={ad:'bayrak',t:0,sure:2.6,tur:'ofsayt'};
    this.ist.ofsayt[p.team]++;this.on('ofsayt',{p,aleyhe:p.team,fark:o.fark,yanlis:o.yanlis,gecikme:o.g});this.ofsaytJesti(p);   /* T7f: savunmacılar kol kaldırır */
    this.refs[0].eylem={ad:'duduk',t:0,sure:1.0};
    this.durusBaslat('serbest',1-p.team,clamp(o.x,-PL+1,PL-1),clamp(o.z,1,PW-1),{bekle:1.2,endirekt:true,ofsayt:true,duduk:true});
  },
  /* T10d: gol iptali — bekleyen ofsayt bayrağı (yan hakem geç kaldırdı: önce ofsayt) ya da hakeme çarpıp doğrudan kaleye giren top (2019: hakem
     topu). Döner: gol iptal edildi mi (gol() başta sorar) */
  golIptalMi(side){
    const b=this.ball,o=this.ofsaytBekleyen,H=b.hakemDegdi;
    if(o){this.topDisari();this.on('golIptal',{takim:o.p.team,p:o.p,neden:'ofsayt',yanlis:o.yanlis});this.ofsaytCal(o.p,o);return true;}
    if(H&&b.sonDokunan===H.dokunan){b.hakemDegdi=null;this.topDisari();this.on('golIptal',{takim:H.takim,p:null,neden:'hakem',yanlis:false});this.hakemTopuBaslat(H.takim,H.x,H.z,'hakem');return true;}
    return false;
  },

  /* ============ hakemler ============ */
  hakemAI(dt){
    const b=this.ball,r=this.refs,T=this.tunel,ph=this.phase;
    if(MAC_ONCESI.includes(ph))return;
    if(ph==='halftime'||(ph==='fulltime'&&this.phaseT>9)){r.forEach((q,i)=>{q.hizOran=0.3;q.tx=T.x+(i-1)*0.5;q.tz=T.z-3;q.bak=null;q.yonHedef=null;});return;}
    if(ph==='fulltime'){r.forEach((q,i)=>{q.hizOran=0.3;q.tx=(i-1)*1.2;q.tz=MZ-3;});return;}
    /* orta hakem: çapraz çizgi, oyunu kendisiyle aktif yan hakem arasında tutar, 12–20 m uzakta */
    const h=r[0],du=this.durus,fx=du?du.x:b.x,fz=du?du.z:b.z;
    const kartSira=h.kartSira,DY=du?this.hakemDuranYeri(du):null;   /* T8a: duran topta hakemlerin yeri (js/mac-durantop.js) */
    if(kartSira){kartSira.t+=dt;const p=kartSira.p;h.tx=p.x+(h.x<p.x?-1.6:1.6);h.tz=p.z;h.hizOran=1;h.bak=p;
      if(hyp(h.x-p.x,h.z-p.z)<2.2&&!(h.eylem&&h.eylem.ad==='kart')){h.eylem={ad:'kart',t:0,sure:1.7,renk:kartSira.renk};}
      if(h.eylem&&h.eylem.ad==='kart'&&h.eylem.t>1.5||kartSira.t>6){const Q=h.kartKuyruk;if(Q&&Q[0]===kartSira)Q.shift();h.kartSira=Q&&Q.length?Q[0]:null;
        if(p.kart===2&&p.oyunda)this.oyundanCikar(p);}}
    else if(DY&&DY.h){h.tx=clamp(DY.h.x,-PL+1,PL-1);h.tz=clamp(DY.h.z,1,PW-1);const uz=hyp(h.tx-h.x,h.tz-h.z);h.hizOran=uz>8?0.9:0.6;h.bak=b;
      /* barajlı serbest vuruş: hakem barajın ucunda 9,15 m'yi gösterir, 1,2 sn sonra baraj dizilmiş sayılır ve hakem çaprazına çekilir */
      if(du.sinif==='baraj'&&!du.hakemHazir&&(du.asama==='yerles'||du.asama==='hazir')&&uz<1.2){du.hakemT=(du.hakemT||0)+dt;
        if(!du.hakemYon){du.hakemYon=true;h.eylem={ad:'yon',t:0,sure:1.2,yon:Math.atan2(du.z-h.z,du.x-h.x)};this.on('barajYeri',{hedef:{x:du.x,z:du.z},x:h.x,z:h.z});}   /* T8e: çizim işareti */
        if(du.hakemT>1.2)du.hakemHazir=true;}}
    else{
      const cap=MZ-clamp(fx,-PL,PL)/PL*21;
      let tx=clamp(fx*0.8-Math.sign(fx||1)*3,-40,40),tz=lerp(cap,fz,0.28);
      const dd=hyp(tx-fx,tz-fz);if(dd<12){const s=12/(dd||1);tx=fx+(tx-fx)*s;tz=fz+(tz-fz)*s;}
      /* T10b: yorgun hakem son 15 dakikada daha yavaş koşar (hkYorgun; Ek G7: geri ve yan koşu yarıya iner) */
      h.tx=clamp(tx,-PL+2,PL-2);h.tz=clamp(tz,2,PW-2);const uzak=hyp(h.tx-h.x,h.tz-h.z);h.hizOran=(uzak>14?1:uzak>5?0.65:0.4)*(1-1.5*hkYorgun(this));h.bak=b;
      /* A4-6 (Ek G7): yorgun hakem geri geri ve yan yan az koşar — gideceği yer topa göre 60°'den gerideyse ve 3 m'den uzaksa döner (bak yok) */
      const gd=MOTOR_AYAR.hakemGeriDon;if(gd>0&&uzak>3&&hkYorgun(this)>=gd){const gx=h.tx-h.x,gz=h.tz-h.z,bx=b.x-h.x,bz=b.z-h.z;
        if(gx*bx+gz*bz<0.5*uzak*(hyp(bx,bz)||1))h.bak=null;}
      /* T10b: hakem topun yolundan çekilir (Ek G7: pas hattını kapatmaz; T10-0'da topa çarpan hakem maç başına 0,5): top 6 m/sn'den hızlı ve
         önümüzdeki 1 sn'de 1,5 m yakınından geçecekse yolun dik yönünde 3 m kenara */
      const bv=hyp(b.vx,b.vz);if(bv>6&&!b.sahip){const nx=-b.vz/bv,nz=b.vx/bv;
        if(segD(h.x,h.z,b.x,b.z,b.x+b.vx,b.z+b.vz)<1.5){const s=((h.x-b.x)*nx+(h.z-b.z)*nz)>=0?1:-1;h.tx=clamp(h.x+nx*s*3,-PL+2,PL-2);h.tz=clamp(h.z+nz*s*3,2,PW-2);h.hizOran=1;}}}
    /* yan hakemler: kendi yarılarında, sondan ikinci savunmacı ya da top hizasında; yan adımla izler */
    const yan=(q,s,z)=>{q.tx=clamp(this.ofsaytHizasi(s),0,PL-1)*s;q.tz=z;const uz=Math.abs(q.tx-q.x);q.hizOran=uz>8?1:0.55;
      q.yonHedef=uz>6?null:(z>MZ?-Math.PI/2:Math.PI/2);q.bak=b;};
    yan(r[1],1,PW+1.3);yan(r[2],-1,-1.3);
    if(DY&&DY.yh){const q=DY.yh;q.tx=DY.yhYer.x;q.tz=DY.yhYer.z;q.hizOran=hyp(q.tx-q.x,q.tz-q.z)>8?1:0.6;q.yonHedef=null;q.bak=b;}
  },
  /* sondan ikinci savunmacının hizası (M0: her karede iki kez çağrılır; dizi kurmadan en büyük iki değer, sonuç aynı) */
  ofsaytHizasi(side){const def=this.dir[0]===-side?0:1;let a=-Infinity,c=-Infinity;
    for(const p of this.teams[def])if(p.oyunda){const v=p.x*side;if(v>a){c=a;a=v;}else if(v>c)c=v;}
    return Math.max(c>0?c:0,this.ball.x*side,0);},
  oyundanCikar(p){p.oyunda=false;p.cikiyor=true;p.eylem=null;p.surus=null;p.tx=this.tunel.x;p.tz=this.tunel.z-4;p.hizOran=0.35;
    const b=this.ball;if(b.sahip===p)b.sahip=null;if(b.tasiyan===p)b.tasiyan=null;this.on('oyundanCikti',{p});
    const kaleciydi=p.rol==='GK';this.yenidenDizil(p);   /* yenidenDizil rolleri takas eder */
    /* T8b (inceleme bulgusu): duruş sürerken kaleci atıldıysa kaleye geçen oyuncu kaleci görevini alır (görevler yeniden dağıtılır) */
    if(kaleciydi&&this.phase==='durus'&&this.durus&&this.durus.gorev)this.duranGorevAta(this.durus);},
  /* kırmızı kartta yeniden diziliş (MM2): kaleci atılırsa en uygun saha oyuncusu (önce forvet, sonra kalecilik özelliği) kaleye geçer;
     savunma ya da orta saha oyuncusu atılırsa bir forvet onun mevkisine iner (takım 4-4-1 gibi oynar). Takım dizisindeki yerler takas edilir */
  yenidenDizil(p){
    /* T10c: takastan sonra profil yeni mevkiye göre yeniden kurulur (değişiklikteki hata 3'ün eşi) */
    const t=p.team,T=this.teams[t],takas=(a,c)=>{const na=a.n,nc=c.n,ma=a.mevki,ra=a.rol;a.n=nc;a.mevki=c.mevki;a.rol=c.rol;c.n=na;c.mevki=ma;c.rol=ra;T[a.n]=a;T[c.n]=c;
      profilKur(a,this.tohum);profilKur(c,this.tohum);};
    if(p.rol==='GK'){const L=T.filter(q=>q.oyunda&&q!==p);if(!L.length)return;
      const puan=q=>(q.rol==='FV'?1:0)+q.oz.kalecilik*3;const y=L.reduce((a,c)=>puan(c)>puan(a)?c:a);
      takas(y,p);y.eylem=null;y.surus=null;this.on('kaleyeGecti',{p:y});return;}
    if(p.rol==='FV')return;
    const F=T.filter(q=>q.oyunda&&q.rol==='FV');if(!F.length)return;
    const f=F.find(q=>!q.mevki.hedef)||F[0];takas(f,p);this.on('yenidenDizildi',{p:f});
  },
});
EYLEM_ADIM.tac=function(p,e,dt){this.tacIlerle(p,e,dt);return true;};
