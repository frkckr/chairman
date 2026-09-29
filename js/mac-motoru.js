/* ============ Demirkapı '99 — maç motoru: görüntüden bağımsız oyun mantığı ============
   Koordinatlar: x −52,5…52,5 (kaleler), z 0…68 (z=0 ana tribün tarafındaki taç çizgisi). Görüntü katmanı z'den 34 çıkarır.
   Zaman: motor sabit adımla (1/60 sn) ilerler. Hareketler gerçek hızdadır; maç saati 9 kat hızlı akar (90 dk ≈ 10 dk).
   Evreler: isinma → giris → toren → selam → yazitura (maç günü: js/mac-oncesi.js) → kickoff → play ⇄ durus (taç, korner, aut,
   serbest vuruş, penaltı) / goal → halftime → … → fulltime.
   Oyuncunun gerçek bir bakış yönü (yon) vardır ve dönüşü sınırlıdır: hızlı koşarken yavaş döner, geri geri koşamaz.
   Topla her iş bir eylemdir: vuruşta önce hazırlık (hedefe dön, topu vuran ayağın önüne al), sonra geri salınım ve temas, sonra takip.
   Top fiziği: yuvarlanma, sekme, hava direnci, falso; direk, üst direk, ağ. Top sürme dokunuşlarla olur, aradaki anlarda top serbesttir.
   Diziliş ve topsuz oyun js/mac-dizilis.js'te, topla karar js/mac-karar.js'te, kurallar ve duran toplar js/mac-kurallar.js'tedir.
   Olaylar on(ad, veri) ile bildirilir; görüntü bunları dinler. Rastgelelik tohumludur (this.rast): aynı tohum aynı maçı verir. */
const PL=52.5,PW=68,MZ=34,GH=2.44,GW2=3.66,GPR=9,G=9.81;
/* yuvarlanma: yavaşlama = R + (hava direnci/2)·v². R çimin kalitesine bağlıdır: iyi çimde ~1,2, tarla gibi zeminde ~2,1 m/sn² */
const ROLL=1.45,TOP_YARICAP=0.11,HAVA_DIRENCI=0.0125,SEKME=0.52,SEKME_SURTUNME=0.8,DIREK_R=0.06;
const CEZA_U=16.5,CEZA_W=20.16,ALTIPAS_U=5.5,ALTIPAS_W=9.16,PENALTI_U=11;
const MAC_ONCESI=['isinma','giris','toren','selam','yazitura'],DEVRE_ARASI=45;
/* oyuncu özellikleri (kadrolar.js'te 1–99 arası, aynı sırayla) */
const OZ_SIRA=['hiz','pas','sut','kafa','surus','mudahale','gorus','karar','kalecilik','dayaniklilik','sertlik'];
const VARSAYILAN_OZ=[62,58,55,55,56,55,55,56,8,66,50];
const VARSAYILAN_TAKTIK={dizilis:'4-4-2',sakin:0.5,direkt:0.5,risk:1,pres:0.5,tempo:0.5};
/* ayar katsayıları: araclar/mac-deneme.js ile hedef tabloya göre ayarlanır */
const MOTOR_AYAR={
  kararGecikme:[0.12,0.36],   // topu kontrol ettikten sonra karar süresi (sn): tempo yüksekse kısa
  ilerleme:0.03,               // topu ileri taşımanın metre başına değeri (puan): oyunun ne kadar dikine aktığı
  risk:1.0,                    // top kaybından çekinme çarpanı (takımın risk ayarıyla çarpılır)
  surusKarar:[0.3,0.62],       // top sürerken yeniden karar aralığı
  vurusHizalama:0.36,          // vuruş için gövdenin hedefe en fazla sapması (rad); gelişine vuruşta 1,05
  sutIstegi:3.0,               // şut seçeneğinin değer çarpanı (iyi pozisyonda tam; uzaklaştıkça azalır, 30 m'de etkisiz)
  ortaIstegi:3.2,              // orta ve geri çevirmenin değer çarpanı
  gecis:0.7,                   // topu kaybeden takımın savunma düzenine geçme gecikmesi (sn)
  donus:0.85,                  // savunmaya dönüşte topa uzak oyuncunun hız oranı
  sutSapma:0.8,                // şut isabet hatası çarpanı
  pasSapma:1.0,                // pas yön hatası çarpanı
  sikisma:0.3,                 // pas hedefindeki alıcı sıkışıksa (rakip dibinde) o yerin değerinden düşülen pay
  geriPas:0.9,                 // geri pasın ek değeri (takımın 'sakin' ayarıyla çarpılır): topu tutma isteği
  kontrolZorluk:0.7,           // ilk dokunuş hatası çarpanı
  kaleciTepki:0.2,             // kalecinin şuta tepki süresi (sn), kalecilik özelliğiyle kısalır
  kaleciErisim:1.0,            // kurtarış erişimi çarpanı
  mudahaleIstegi:1.0,          // pres yapan oyuncunun müdahaleye girme isteği
  faulOrani:2.8                // müdahalede faul olasılığı çarpanı
};

/* ---- açı ve geometri yardımcıları (Math.hypot yavaş olduğu için karekökle) ---- */
const hyp=(a,b)=>Math.sqrt(a*a+b*b),hyp3=(a,b,c)=>Math.sqrt(a*a+b*b+c*c);
const aciNorm=a=>a-2*Math.PI*Math.floor((a+Math.PI)/(2*Math.PI));
const aciFark=(a,b)=>aciNorm(a-b);
function segD(px,pz,ax,az,bx,bz){const vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az;const L2=vx*vx+vz*vz||1;const t=clamp((vx*wx+vz*wz)/L2,0,1);return hyp(px-ax-vx*t,pz-az-vz*t);}
/* bir oyuncunun bir noktaya varış süresi (sn): önce tepki süresince mevcut hızıyla devam eder, sonra en yüksek hızla koşar;
   koştuğu yönden sapmak için yavaşlaması gerekir (ters yöne dönmek en pahalısı). menzil: ayağın/elin uzandığı mesafe */
function varisZamani(p,x,z,menzil,tepki){
  const tp=tepki!=null?tepki:0.2,rx=p.x+p.vx*tp,rz=p.z+p.vz*tp,dx=x-rx,dz=z-rz,d=Math.max(0,hyp(dx,dz)-(menzil||0));
  const sp=hyp(p.vx,p.vz);let ceza=0;
  if(sp>1&&d>0.3){const c=(dx*p.vx+dz*p.vz)/((hyp(dx,dz)||1)*sp),k=(1-c)/2;ceza=k*Math.sqrt(k)*sp/7;}
  else if(d>0.3){const c=(dx*Math.cos(p.yon)+dz*Math.sin(p.yon))/(hyp(dx,dz)||1);ceza=(1-c)*0.12;}
  return tp+d/(p.maxSpd*0.95)+ceza;
}
function ozellikler(k){const v=(k&&k.oz)||VARSAYILAN_OZ,o={};OZ_SIRA.forEach((a,i)=>{o[a]=(v[i]!=null?v[i]:VARSAYILAN_OZ[i])/100;});return o;}
/* yerde yuvarlanan top: v² mesafeyle üstel azalır (R sabit sürtünme, c hava direnci). Buradan hız, ilk hız ve süre */
function yerHiz(v0,s,R){const c=HAVA_DIRENCI*0.5,k=R/c,w=(v0*v0+k)*Math.exp(-2*c*s)-k;return w>0?Math.sqrt(w):0;}
function yerIlkHiz(L,varis,R){const c=HAVA_DIRENCI*0.5,k=R/c;return Math.sqrt((varis*varis+k)*Math.exp(2*c*L)-k);}
function yerSure(v0,s,R){let t=0,v=v0;const ds=s/4;for(let i=1;i<=4;i++){const v2=yerHiz(v0,ds*i,R||ROLL);if(v2<=0.05)return 99;t+=ds/((v+v2)/2);v=v2;}return t;}
/* pasın alıcıya varış hızı: kısa pas yumuşak, uzun pas sert */
const pasVarisHizi=L=>clamp(7+L*0.15,8,12);
/* tek adım top fiziği (gerçek top da tahmin de bununla ilerler). ucus: yere çarpmayı yok say (vuruş çözümü için). R: yuvarlanma */
function topFizikAdim(b,dt,ucus,R){
  if(ucus||b.y>0.001||b.vy>0.001){
    const v=hyp3(b.vx,b.vy,b.vz),k=HAVA_DIRENCI*v*dt;
    b.vx-=b.vx*k;b.vy-=b.vy*k;b.vz-=b.vz*k;
    if(b.egri){const ex=-b.vz*b.egri*dt,ez=b.vx*b.egri*dt;b.vx+=ex;b.vz+=ez;b.egri*=1-0.35*dt;}
    b.vy-=G*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;
    if(!ucus&&b.y<=0){b.y=0;if(b.vy<-1.3){b.vy=-b.vy*SEKME;b.vx*=SEKME_SURTUNME;b.vz*=SEKME_SURTUNME;b.egri*=0.3;}else{b.vy=0;b.egri=0;}}
  }else{
    b.y=0;b.vy=0;const s=hyp(b.vx,b.vz);
    if(s>0){const ns=Math.max(0,s-((R||ROLL)+HAVA_DIRENCI*0.5*s*s)*dt);b.vx*=ns/s;b.vz*=ns/s;}
    b.x+=b.vx*dt;b.z+=b.vz*dt;
  }
}

class Match{
  /* secenek.kadro: [ev, konuk] (js/kadrolar.js), secenek.tunel: {x,z} tünel ağzı, secenek.tohum: rastgele tohumu,
     secenek.kulubeler: [{takim, koltuklar:[{x,z}], alan:{x,z}}] (motor koordinatı; verilmezse varsayılan),
     secenek.taraftarYeri / deplasmanYeri: {x,z,nx,nz} maç sonunda takımın alkışlayacağı tribünün önü (n: tribüne doğru birim yön) */
  constructor(on,secenek){
    secenek=secenek||{};this.on=on||(()=>{});this.kadro=secenek.kadro||null;this.tunel=secenek.tunel||{x:0,z:-6};
    this.kulubeler=secenek.kulubeler||[0,1].map(t=>({takim:t,koltuklar:[0,1,2,3,4,5].map(i=>({x:(t?11.5:-11.5)-2.6+i*1.04,z:-5.75})),alan:{x:t?11.5:-11.5,z:-2.4}}));
    this.tohum=(secenek.tohum!=null?secenek.tohum:Math.floor(Math.random()*4294967296))>>>0;this.rast=tohumluRastgele(this.tohum);
    /* zemin 0 (tarla) – 1 (halı gibi): kötü zeminde top çabuk durur, sekmesi düzensizdir */
    this.zemin=secenek.zemin!=null?clamp(secenek.zemin,0,1):0.7;this.R=lerp(2.1,1.2,this.zemin);
    this.taraftarYeri=secenek.taraftarYeri||{x:0,z:PW-4,nx:0,nz:1};this.deplasmanYeri=secenek.deplasmanYeri||null;
    this.reset();
  }
  normal(){let u=0;while(u===0)u=this.rast();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*this.rast());}
  reset(){
    this.score=[0,0];this.half=1;this.gameSec=0;this.t=0;this.phase='kickoff';this.phaseT=0;this.dir=[1,-1];
    this.yaziTura=null;this.ilkSantra=0;this.tuneleGitti=false;this.celeb=null;this.durus=null;this.sp=null;
    this.ist={sut:[0,0],isabet:[0,0],korner:[0,0],tac:[0,0],kaleVurusu:[0,0],faul:[0,0],sari:[0,0],kirmizi:[0,0],ofsayt:[0,0],
      pas:[0,0],pasTamam:[0,0],pasYon:{ileri:0,yan:0,geri:0},uzunPas:0,havaTopu:0,uzatma:[0,0],degisiklik:[0,0],oyunda:0,toplam:0,sahiplik:[0,0]};
    this.shots=this.ist.sut;this.poss=this.ist.sahiplik;
    this.duranSure=[0,0];this.added=[60,120];this.uzatmaIlan=[false,false];
    this.taktik=[0,1].map(t=>Object.assign({},VARSAYILAN_TAKTIK,this.kadro&&this.kadro[t].taktik));
    this.players=[];this.teams=[[],[]];
    for(let t=0;t<2;t++){const diz=DIZILISLER[this.taktik[t].dizilis]||DIZILISLER['4-4-2'];
      for(let n=0;n<11;n++){const p=this.oyuncuKur(t,n,this.kadro&&this.kadro[t].oyuncular[n],diz.mevkiler[n]);this.players.push(p);this.teams[t].push(p);}}
    /* hakemler: orta hakem, sağ yarının yan hakemi (karşı taç), sol yarının yan hakemi (ana tribün tacı) */
    this.refs=[this.hakemKur('ref',-6,26),this.hakemKur('lin',20,PW+1.3),this.hakemKur('lin',-20,-1.3)];
    this.topcular=this.topculariKur();this.disToplar=[];
    this.yedekleriKur();this.kenarKur();
    this.ball={x:0,z:MZ,y:0,vx:0,vz:0,vy:0,egri:0,sahip:null,tasiyan:null,sonDokunan:null,sonTakim:0,hedefOyuncu:null,sut:null,pas:null,
      surum:0,agda:false,direk:false,px:0,py:0,pz:0};
    this.kuralHazirla();
    this.oncesiHazirla();
  }
  /* bütün insanlar (oyuncu, hakem, top toplayıcı, yedek) aynı alanlarla başlar */
  varlik(tur,x,z,ek){
    return Object.assign({tur,kind:null,team:null,n:-1,rol:null,mevki:null,name:'',no:0,kaptan:false,kayit:null,oz:null,ayak:'sag',boy:1,
      x,z,vx:0,vz:0,spd:0,yon:0,maxSpd:7,tx:x,tz:z,hizOran:1,bak:null,yonHedef:null,eylem:null,kickCd:0,kararT:0,dokunT:0,surus:null,
      oyunda:false,cikiyor:false,kart:0,yorgunluk:0,destek:null,kosu:null,gorev:null,sevinc:false,hedef:null,tutus:null,_cikis:null,
      ilkSoruldu:-1,penaltiTahmin:0,ev:null,top:false,kartSira:null,gir:0,_kar:null,oturuyor:false,koltuk:null,cikti:false,poz:null,sg:null},ek);
  }
  oyuncuKur(t,n,k,mevki){
    const oz=ozellikler(k),rol=mevki.cizgi==='KL'?'GK':mevki.cizgi;
    return this.varlik('oyuncu',0,MZ,{team:t,n,rol,mevki,name:k?k.ad:TEAMS[t].names[n],no:k?k.no:n+1,kaptan:!!(k&&k.kaptan),kayit:k||null,oz,
      ayak:(k&&k.ayak)||'sag',boy:(k&&k.boy)||1,yon:t?Math.PI:0,maxSpd:6.4+2.4*oz.hiz,oyunda:true});
  }
  hakemKur(kind,x,z){return this.varlik('hakem',x,z,{kind,maxSpd:7.2,oz:{hiz:0.6}});}
  focus(){const c=this.celeb,b=this.ball;if(this.phase==='goal'&&c&&c.scorer&&!c.own)return{x:c.scorer.x,y:1,z:c.scorer.z};
    const h=b.tasiyan;if(h)return{x:h.x,y:1,z:h.z};return{x:b.x,y:b.y,z:b.z};}
  minuteLabel(){
    if(this.phase==='halftime')return 'İY';if(this.phase==='fulltime')return 'MS';if(MAC_ONCESI.includes(this.phase))return '';
    const s=this.gameSec;
    if(this.half===1&&s>=2700)return '45+'+(Math.floor((s-2700)/60)+1);
    if(this.half===2&&s>=5400)return '90+'+(Math.floor((s-5400)/60)+1);
    return String(Math.floor(s/60)+1);
  }
  kaleci(t){return this.teams[t][0];}
  sahadakiler(t){return this.teams[t].filter(p=>p.oyunda);}

  /* ============ ana döngü ============ */
  step(dt){
    this.t+=dt;this.phaseT+=dt;this.kare=(this.kare||0)+1;
    const saat=this.phase!=='halftime'&&this.phase!=='fulltime'&&!MAC_ONCESI.includes(this.phase);
    if(saat){this.gameSec+=dt*GPR;this.ist.toplam+=dt;if(this.phase==='play')this.ist.oyunda+=dt;}
    this.hakemAI(dt);
    switch(this.phase){
      case 'isinma':this.stepIsinma(dt);break;
      case 'giris':this.stepGiris(dt);break;
      case 'toren':this.stepToren(dt);break;
      case 'selam':this.stepSelam(dt);break;
      case 'yazitura':this.stepYazitura(dt);break;
      case 'kickoff':this.stepKick(dt);break;
      case 'play':this.stepPlay(dt);break;
      case 'durus':this.stepDurus(dt);break;
      case 'goal':this.stepGoal(dt);break;
      default:this.stepBreak(dt);
    }
    if(['kickoff','play','durus','goal'].includes(this.phase))this.kenarAI(dt);
    this.topcuAI(dt);this.disToplarAdim(dt);
    if(saat)this.devreSonuKontrol();
  }

  /* maç öncesi, devre arası ve maç sonu (maç günü akışı) js/mac-oncesi.js'tedir */

  /* ============ santra ============ */
  santraKonumu(p,takim){
    const d=this.dir[p.team],k=dizilisKonumu(this.taktik[p.team].dizilis,p.n,0,MZ,p.team===takim);
    let u=Math.min(k.u,p.rol==='GK'?k.u:-1.2),w=k.w;
    if(p.team===takim&&p.n===9){u=-0.3;w=MZ-0.2;}
    else if(p.team===takim&&p.n===10){u=-0.9;w=MZ+2.6;}
    else if(p.team!==takim&&p.rol!=='GK'){const dz=w-MZ,dd=hyp(u,dz);if(dd<10){const s=10/(dd||1);u=-Math.abs(u*s||10);w=MZ+dz*s;}}
    return{x:u*d,z:w};
  }
  santraHazirla(takim,isinla){
    this.phase='kickoff';this.phaseT=0;this.kickTeam=takim;this.durus=null;this.celeb=null;
    const b=this.ball;
    if(isinla||b.agda)this.topuSifirla(0,MZ);
    for(const p of this.players){
      if(!p.oyunda)continue;
      const k=this.santraKonumu(p,takim);p.tx=k.x;p.tz=k.z;p.hizOran=0.55;p.eylem=null;p.surus=null;p.kickCd=0;p.sevinc=false;p.kosu=null;p.destek=null;
      p.bak=b;p.yonHedef=null;
      if(isinla){p.x=k.x;p.z=k.z;p.vx=p.vz=0;p.yon=this.dir[p.team]>0?0:Math.PI;}
    }
    if(isinla){const r=this.refs[0];r.x=-6;r.z=26;}
  }
  stepKick(dt){
    const b=this.ball,tk=this.teams[this.kickTeam][9];
    /* top orta noktada değilse santrayı yapacak oyuncu alır, orta noktaya koyar */
    const yerinde=hyp(b.x,b.z-MZ)<0.3&&!b.tasiyan&&b.y<0.05&&hyp(b.vx,b.vz)<0.2;
    if(!yerinde){
      if(b.tasiyan===tk){tk.tx=-0.35*this.dir[tk.team];tk.tz=MZ-0.25;tk.hizOran=0.5;if(hyp(tk.x,tk.z-MZ)<0.7)this.topuSifirla(0,MZ);}
      else if(!b.tasiyan){/* kalecinin gönderdiği topu santrayı yapacak oyuncu karşılar, eliyle ya da ayağıyla tutar */
        const k=this.yakalamaNoktasi(tk,2.2);tk.tx=k.x;tk.tz=k.z;tk.hizOran=0.8;tk.bak=b;
        if(hyp(b.x-tk.x,b.z-tk.z)<1.2&&b.y<2.2){b.tasiyan=tk;this.topDegisti();}}
    }else{const k=this.santraKonumu(tk,this.kickTeam);tk.tx=k.x;tk.tz=k.z;}
    this.hareketHepsi(dt);this.topAdim(dt);
    let hazir=yerinde;
    if(hazir)for(const p of this.players)if(p.oyunda&&hyp(p.tx-p.x,p.tz-p.z)>1.3){hazir=false;break;}
    if(hazir&&this.phaseT>1.6||this.phaseT>22){
      if(!yerinde)this.topuSifirla(0,MZ);
      const al=this.teams[this.kickTeam][7];
      this.on('kickoff',{team:this.kickTeam,half:this.half});this.refs[0].eylem={ad:'duduk',t:0,sure:0.8};
      this.phase='play';this.phaseT=0;
      tk.x=-0.35*this.dir[tk.team];tk.z=MZ-0.25;tk.vx=tk.vz=0;tk.yon=this.dir[tk.team]>0?0:Math.PI;
      this.sahipYap(tk);this.vurusBaslat(tk,{tur:'pas',hx:al.x,hz:al.z,tip:'yer',alici:al});
    }
  }

  /* ============ oyun ============ */
  stepPlay(dt){
    const b=this.ball;
    if(b.sahip)this.ist.sahiplik[b.sahip.team]+=dt;
    /* yorgunluk: koştukça (özellikle depar) birikir, dayanıklılık yavaşlatır */
    for(const p of this.players)if(p.oyunda){const k=p.spd/p.maxSpd;p.yorgunluk=Math.min(1,p.yorgunluk+dt*(0.0008+0.0024*k*k)*(1.25-p.oz.dayaniklilik));}
    this.takimAI(dt);
    this.topluAI(dt);
    this.hareketHepsi(dt);
    this.topAdim(dt);
    if(this.phase!=='play')return;
    this.temaslar(dt);
    if(this.phase!=='play')return;
    this.sinirlar();
    this.kuralAdim(dt);
  }

  /* ============ top ============ */
  topuSifirla(x,z){const b=this.ball;Object.assign(b,{x,z,y:0,vx:0,vz:0,vy:0,egri:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,agda:false,direk:false});b.surum++;}
  topDegisti(){this.ball.surum++;this._degisimT=this.t;}
  /* topun gelecekteki yolu (3,5 sn, 1/60 adım). Top her dokunuşta değişir; o zamana kadar hesap önbellekte kalır */
  topYolu(){
    const b=this.ball;
    if(this._yol&&this._yolSurum===b.surum&&this.t-this._yolT0<1.2)return this._yol;
    const s={x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:b.egri},yol=[];
    for(let i=0;i<210;i++){topFizikAdim(s,1/60,false,this.R);yol.push({x:s.x,y:s.y,z:s.z,v:hyp(s.vx,s.vz)});}
    this._yol=yol;this._yolSurum=b.surum;this._yolT0=this.t;return yol;
  }
  /* t saniye sonra top nerede */
  topTahmin(t){const yol=this.topYolu(),i=clamp(Math.round((this.t-this._yolT0+t)*60)-1,0,yol.length-1);return yol[i];}
  topAdim(dt){
    const b=this.ball;b.px=b.x;b.py=b.y;b.pz=b.z;
    if(b.tasiyan){const h=b.tasiyan,c=Math.cos(h.yon),s=Math.sin(h.yon),tac=h.eylem&&h.eylem.ad==='tac';
      b.x=h.x+c*(tac?0.05:0.32);b.z=h.z+s*(tac?0.05:0.32);b.y=tac?2.05*h.boy:1.05*h.boy;b.vx=h.vx;b.vz=h.vz;b.vy=0;return;}
    topFizikAdim(b,dt,false,this.R);
    if(b.agda)this.agIcinde();
  }
  agIcinde(){
    const b=this.ball,sx=Math.sign(b.x);
    if(Math.abs(b.x)>PL+1.9){b.x=sx*(PL+1.9);b.vx*=-0.15;}
    if(Math.abs(b.z-MZ)>GW2-0.12){b.z=MZ+Math.sign(b.z-MZ)*(GW2-0.12);b.vz*=-0.2;}
    if(b.y>GH-0.12){b.y=GH-0.12;b.vy=-Math.abs(b.vy)*0.3;}
    b.vx*=0.97;b.vz*=0.97;
  }
  /* bir oyuncunun (ya da topun) kale ağzına ait çarpışmaları: direk, üst direk, yan ağ. Gol ise true */
  kaleCarpismalari(){
    const b=this.ball;
    for(const sx of[-1,1]){
      const gx=sx*PL,once=(b.px-gx)*sx,simdi=(b.x-gx)*sx;
      /* direkler: kale çizgisindeki iki dikey silindir */
      if(Math.abs(b.x-gx)<0.4&&b.y<GH+0.1)for(const pz of[MZ-GW2-DIREK_R,MZ+GW2+DIREK_R]){
        const dx=b.x-(gx+sx*DIREK_R),dz=b.z-pz,dd=hyp(dx,dz);
        if(dd<DIREK_R+TOP_YARICAP&&dd>1e-4){const nx=dx/dd,nz=dz/dd,vn=b.vx*nx+b.vz*nz;
          if(vn<0){b.vx-=1.55*vn*nx;b.vz-=1.55*vn*nz;b.x=gx+sx*DIREK_R+nx*(DIREK_R+TOP_YARICAP);b.z=pz+nz*(DIREK_R+TOP_YARICAP);this.direkVurdu();return false;}}}
      /* üst direk */
      if(Math.abs(b.x-gx)<0.3&&Math.abs(b.z-MZ)<GW2+0.1){const dy=b.y-(GH+DIREK_R),dx=b.x-(gx+sx*DIREK_R),dd=hyp(dx,dy);
        if(dd<DIREK_R+TOP_YARICAP&&dd>1e-4){const nx=dx/dd,ny=dy/dd,vn=b.vx*nx+b.vy*ny;
          if(vn<0){b.vx-=1.5*vn*nx;b.vy-=1.5*vn*ny;b.x=gx+sx*DIREK_R+nx*(DIREK_R+TOP_YARICAP);b.y=GH+DIREK_R+ny*(DIREK_R+TOP_YARICAP);this.direkVurdu();return false;}}}
      /* çizgiyi geçti mi: topun tamamı kale çizgisinin ötesinde ve direklerin arasında, üst direğin altında */
      if(once<=TOP_YARICAP&&simdi>TOP_YARICAP&&!b.agda){
        const f=(TOP_YARICAP-once)/((simdi-once)||1),z=b.pz+(b.z-b.pz)*f,y=b.py+(b.y-b.py)*f;
        if(Math.abs(z-MZ)<GW2-TOP_YARICAP*0.2&&y<GH-TOP_YARICAP*0.2)return sx;
      }
      /* yan ağ: kale dışından gelen top ağa çarpar ("gol sandık") */
      if(simdi>0&&simdi<1.9&&b.y<GH&&!b.agda){const kz=Math.abs(b.z-MZ),okz=Math.abs(b.pz-MZ);
        if(okz>=GW2+0.05&&kz<GW2+0.05){b.z=MZ+Math.sign(b.z-MZ)*(GW2+0.06);b.vz*=-0.15;b.vx*=0.3;this.topDegisti();this.on('yanAg',{p:b.sonDokunan});}}
    }
    return false;
  }
  direkVurdu(){const b=this.ball;b.direk=true;if(b.sut)b.sut.direk=true;this.topDegisti();this.on('wood',{p:b.sonDokunan});}

  /* bir oyuncu topa dokundu (kimin son dokunduğu: taç/korner/aut ve ofsayt için) */
  dokunus(p,kasitli){
    const b=this.ball;b.sonDokunan=p;b.sonTakim=p.team;b.hedefOyuncu=null;b.direk=false;
    if(b.pas&&p!==b.pas.p){if(p.team===b.pas.takim)this.ist.pasTamam[p.team]++;b.pas=null;}
    if(b.sut&&p!==b.sut.by)b.sut=null;
    this.ofsaytDokunus(p,kasitli);
    this.topDegisti();
  }
  sahipYap(p){const b=this.ball;b.sahip=p;b.tasiyan=null;p.surus=null;p.kararT=lerp(MOTOR_AYAR.kararGecikme[1],MOTOR_AYAR.kararGecikme[0],this.taktik[p.team].tempo)+(1-p.oz.karar)*0.15;}

  /* ============ hareket ============ */
  hareketHepsi(dt,carpismaYok){
    const P=this.players;
    for(const p of P)if(p.oyunda||p.cikiyor)this.moveP(p,dt);
    for(const r of this.refs)this.moveP(r,dt);
    for(const Y of this.yedekler)for(const p of Y)if(!p.oturuyor)this.moveP(p,dt);
    if(this.kenar)for(const p of this.kenar)if(!p.oturuyor)this.moveP(p,dt);
    if(carpismaYok)return;
    for(let i=0;i<P.length;i++){const a=P[i];if(!a.oyunda||(a.eylem&&a.eylem.ad==='ucus'))continue;
      for(let j=i+1;j<P.length;j++){const c=P[j];if(!c.oyunda)continue;const dx=c.x-a.x,dz=c.z-a.z,d2=dx*dx+dz*dz;
        if(d2<0.64&&d2>1e-6){const dd=Math.sqrt(d2),push=(0.8-dd)*0.25,ux=dx/dd,uz=dz/dd;a.x-=ux*push;a.z-=uz*push;c.x+=ux*push;c.z+=uz*push;}}}
  }
  /* hedefe yürü/koş: varışta yavaşla, gövde yönü sınırlı hızda döner, geri ve yana koşu yavaştır */
  moveP(p,dt){
    if(p.kickCd>0)p.kickCd-=dt;
    const e=p.eylem;
    if(e)this.eylemIlerle(p,e,dt);
    const e2=p.eylem;
    if(e2&&e2.kilit){/* düşme, yerde yatma, kayma, uçuş: kendi hareketi */
      p.x+=p.vx*dt;p.z+=p.vz*dt;const s=hyp(p.vx,p.vz),ns=Math.max(0,s-(e2.fren||9)*dt);if(s>0){p.vx*=ns/s;p.vz*=ns/s;}p.spd=ns;return;}
    /* tünelden geçerken önce ağza yürü (tribün duvarının içinden geçmesin) */
    let tx=p.tx,tz=p.tz;const T=this.tunel,ic=p.z<T.z+0.5;
    if(ic!==(tz<T.z+0.5)){const ax=T.x+clamp(p.x-T.x,-0.7,0.7);
      if(ic){tx=ax;tz=Math.abs(p.x-ax)>0.2?p.z:T.z+2;}else if(hyp(p.x-ax,p.z-T.z-1.5)>0.6){tx=ax;tz=T.z+1.5;}else tx=ax;}
    const dx=tx-p.x,dz=tz-p.z,d=hyp(dx,dz);
    const yorgun=1-0.1*(p.yorgunluk||0);
    let hedefHiz=d<0.04?0:Math.min(p.maxSpd*yorgun*p.hizOran,Math.sqrt(2*5.5*Math.max(0,d-0.03))+0.2);
    /* bakış: açıkça verilmişse ona; yavaş ve kısa hareketlerde bakılan şeye (topa); koşuda gidilen yöne */
    let yh=p.yonHedef;
    if(yh==null){
      /* hızlı gitmesi gereken oyuncu gideceği yöne döner ve koşar; bir iki adımlık ayarda yüzü topa (bakılan şeye) dönük kalır */
      if(hedefHiz>2.8&&d>1.2)yh=Math.atan2(dz,dx);
      else if(p.bak){const bx=p.bak.x-p.x,bz=p.bak.z-p.z;if(bx*bx+bz*bz>0.04)yh=Math.atan2(bz,bx);}
      else if(hedefHiz>0.4)yh=Math.atan2(dz,dx);
    }
    if(yh!=null){const f=aciFark(yh,p.yon),oran=(11-7*Math.min(1,p.spd/p.maxSpd))*dt;p.yon=aciNorm(p.yon+clamp(f,-oran,oran));}
    let ux=0,uz=0;if(d>0.04){ux=dx/d;uz=dz/d;}
    const cosA=ux*Math.cos(p.yon)+uz*Math.sin(p.yon),tavan=p.maxSpd*(0.36+0.64*Math.max(0,cosA));
    const s=Math.min(hedefHiz,tavan);
    let ax=ux*s-p.vx,az=uz*s-p.vz;
    const hizlanir=s*s>p.vx*p.vx+p.vz*p.vz,lim=(hizlanir?4.2+2.4*p.oz.hiz:8.5)*dt,al=hyp(ax,az);
    if(al>lim){ax*=lim/al;az*=lim/al;}
    p.vx+=ax;p.vz+=az;p.x+=p.vx*dt;p.z+=p.vz*dt;p.spd=hyp(p.vx,p.vz);
  }

  /* ============ eylemler ============ */
  eylemIlerle(p,e,dt){
    e.t+=dt;
    if(e.ad==='vurus'){this.vurusIlerle(p,e,dt);return;}
    if(e.ad==='ucus'){if(e.t<0.42){p.vx=e.vx;p.vz=e.vz;}if(e.t>=e.sure){p.eylem={ad:'kalkis',t:0,sure:0.55,kilit:true,fren:12};}return;}
    if(e.ad==='kayma'&&e.t>=e.sure){p.eylem={ad:'kalkis',t:0,sure:0.6,kilit:true,fren:12};return;}
    if(e.ad==='dusus'&&e.t>=e.sure){p.eylem={ad:'yerde',t:0,sure:e.yerde||1.2,kilit:true,fren:12};return;}
    if(e.ad==='yerde'&&e.t>=e.sure){p.eylem={ad:'kalkis',t:0,sure:0.6,kilit:true,fren:12};return;}
    if(e.ad==='mudahale'&&!e.oldu&&e.t>=e.temas){e.oldu=true;this.mudahaleSonuc(p,e);}
    if(e.ad==='tac'){this.tacIlerle(p,e,dt);return;}
    if(e.t>=e.sure&&p.eylem===e)p.eylem=null;
  }
  /* vuruş zinciri. sec: {tur, hx, hz, tip, alici, ilk (gelişine)}. Önce hazırlık: hedefe dön, topu vuran ayağın önüne al */
  vurusBaslat(p,sec){
    const b=this.ball,a=Math.atan2(sec.hz-b.z,sec.hx-b.x),f=aciFark(a,p.yon);
    /* ayak: tercih edilen; hedef çok ters yandaysa diğer ayak (iki ayaklı değilse hatası büyür) */
    let ayak=p.ayak==='iki'?(f>0?'sol':'sag'):p.ayak;
    if(p.ayak!=='iki'&&Math.abs(f)>0.9&&this.rast()<0.45)ayak=f>0?'sol':'sag';
    p.eylem={ad:'vurus',faz:'hazirlik',t:0,ft:0,sec,ayak,geri:sec.tur==='sut'||sec.tip==='hava'||sec.tur==='uzaklastir'?0.17:0.11};
    p.surus=null;
  }
  vurusIlerle(p,e,dt){
    const b=this.ball,sec=e.sec;e.ft+=dt;
    if(e.faz==='hazirlik'){
      if(sec.guncelle)this.hedefGuncelle(p,sec);
      const a=Math.atan2(sec.hz-b.z,sec.hx-b.x),c=Math.cos(a),s=Math.sin(a),yan=e.ayak==='sag'?1:-1;
      /* vuran ayak topun arkasında, destek ayağı yanında: gövde topun biraz gerisinde ve yanında */
      const on=sec.ilk?0.42:0.34,px=b.x-c*on-(-s)*0.13*yan,pz=b.z-s*on-c*0.13*yan;
      const topHiz=hyp(b.vx,b.vz);
      if(sec.ilk&&topHiz>2){/* gelişine: topun yoluna gir */const k=this.yakalamaNoktasi(p,1.0);p.tx=k.x-c*on;p.tz=k.z-s*on;}
      else{p.tx=px+b.vx*0.12;p.tz=pz+b.vz*0.12;}
      p.hizOran=1;p.yonHedef=a;p.bak=null;
      const sapma=Math.abs(aciFark(a,p.yon)),sinir=sec.ilk?1.05:MOTOR_AYAR.vurusHizalama*(sec.tip==='yer'&&sec.tur==='pas'?1.35:1);
      const ax=p.x+Math.cos(p.yon)*0.3,az=p.z+Math.sin(p.yon)*0.3,ayakD=hyp(b.x-ax,b.z-az);
      /* hareketli top: ayağa ne zaman gelir (yol boyunca uzaklık / hız) ve yoldan ne kadar yanda */
      let gelir=false;if(topHiz>1.5){const yol=((ax-b.x)*b.vx+(az-b.z)*b.vz)/topHiz,yan2=Math.abs((ax-b.x)*b.vz-(az-b.z)*b.vx)/topHiz;
        gelir=yol>0&&yol/topHiz<=e.geri+0.03&&yan2<0.45;}
      if(sapma<sinir&&(ayakD<(sec.ilk?0.62:0.5)||(sec.ilk&&gelir))&&b.y<(sec.tur==='sut'||sec.ilk?1.1:0.6)){
        /* son an kontrolü: yerden pas hattı bu arada kapandıysa pastan vazgeç, yeniden karar ver */
        if(sec.tip==='yer'&&sec.tur!=='sut'&&!sec.ilk&&this.hatKapali(p,a)){p.eylem=null;p.yonHedef=null;p.kararT=0.05;this.on('vazgecti',{p});return;}
        e.faz='geri';e.ft=0;e.hizalanma=sapma;e.sabit=sec.ilk&&topHiz>1.5;}
      else if(e.t>(sec.ilk?2.2:1.3)){p.eylem=null;p.yonHedef=null;p.kararT=0;if(b.sahip===p&&b.hedefOyuncu)b.hedefOyuncu=null;}
    }else if(e.faz==='geri'){
      if(!e.sabit){p.tx=b.x+b.vx*0.1-Math.cos(p.yon)*0.3;p.tz=b.z+b.vz*0.1-Math.sin(p.yon)*0.3;}
      if(e.ft>=e.geri){
        const ayakD=hyp(b.x-(p.x+Math.cos(p.yon)*0.3),b.z-(p.z+Math.sin(p.yon)*0.3));
        if(ayakD<0.85&&b.y<1.2&&!b.tasiyan&&this.phase!=='goal'){this.vurusYap(p,e);e.faz='takip';e.ft=0;}
        else{p.eylem=null;p.yonHedef=null;p.kararT=0;}
      }
    }else if(e.ft>=0.26){p.eylem=null;p.yonHedef=null;}
  }
  /* pas hattının ilk metrelerinde rakip bacağı var mı */
  hatKapali(p,a){const b=this.ball,ux=Math.cos(a),uz=Math.sin(a);
    for(const o of this.teams[1-p.team]){if(!o.oyunda)continue;if(segD(o.x,o.z,b.x,b.z,b.x+ux*4,b.z+uz*4)<0.7)return true;}return false;}
  /* topa vur: hedefe göre başlangıç hızını çöz, hatayı ekle */
  vurusYap(p,e){
    const b=this.ball,sec=e.sec,oz=p.oz,d=this.dir[p.team],baski=baskiAltinda(this,p);
    const zayif=p.ayak!=='iki'&&e.ayak!==p.ayak,hizalanma=e.hizalanma||0;
    const bx=b.x,bz=b.z;let hx=sec.hx,hz=sec.hz,hy=0;
    const L=hyp(hx-bx,hz-bz)||1;
    let v,T,tip=sec.tip||'yer',egri=0;
    const teknik=sec.tur==='sut'?oz.sut:oz.pas;
    let sigma=(0.028+0.075*(1-teknik))*(1+baski*0.9)*(zayif?1.7:1)*(1+hizalanma*0.9)*(sec.ilk?1.35:1);
    if(sec.tur==='sut'){
      sigma*=MOTOR_AYAR.sutSapma*(1+Math.max(0,(L-12)/25));
      const gk=this.kaleci(1-p.team),gx=d*PL;
      /* hedef: kalecinin uzak tarafı, köşeye yakın; yakın mesafede plase, uzakta sert */
      const uzak=Math.sign(MZ-gk.z)||(this.rast()<0.5?-1:1),yakinKose=this.rast()<0.25;
      const yz=sec.penalti?sec.hz-MZ:(yakinKose?-uzak:uzak)*(GW2-0.45-this.rast()*0.9);
      hx=gx;hz=MZ+yz;hy=this.rast()<0.62?0.25+this.rast()*0.6:0.9+this.rast()*1.2;
      const guc=sec.penalti?0.5+this.rast()*0.3:L<11?0.35+this.rast()*0.3:L<18?0.55+this.rast()*0.3:0.75+this.rast()*0.25;
      v=16+guc*14*(0.85+oz.sut*0.25);if(b.y>0.4)v*=0.9;
      if(sec.penalti)sigma*=0.55;
      if(sec.serbest){hy=1.6+this.rast()*0.6;v=21+this.rast()*4;egri=(e.ayak==='sag'?-1:1)*(0.1+this.rast()*0.06);hz=MZ+Math.sign(yz)*(GW2-0.6);}
      T=hyp(hx-bx,hz-bz)/v*1.06;tip='sut';
      if(L>16&&this.rast()<0.35)egri=(e.ayak==='sag'?-1:1)*(0.06+this.rast()*0.08);
    }else if(tip==='yer'){
      const varis=sec.varisHizi||pasVarisHizi(L)+(sec.tur==='ara'?1:0);
      v=Math.min(29,yerIlkHiz(L,varis,this.R));
    }else{/* havadan: pas, uzun top, orta, uzaklaştırma, degaj */
      T=sec.T||(sec.tur==='orta'?0.95+L/32:sec.tur==='uzaklastir'?1.3+L/30:0.75+L/28);
      /* orta ve korner hedefteki oyuncunun baş yüksekliğine gönderilir */
      hy=sec.hy!=null?sec.hy:(sec.tur==='orta'||sec.tur==='korner')?1.7:0;
      if(sec.tur==='orta'||sec.tur==='korner')egri=(e.ayak==='sag'?-1:1)*(0.05+this.rast()*0.07);
    }
    /* hata */
    const ah=this.normal()*sigma*(tip==='yer'?MOTOR_AYAR.pasSapma:1)*(tip==='hava'?1.6:1);
    const ca=Math.cos(ah),sa=Math.sin(ah),rx=hx-bx,rz=hz-bz;
    hx=bx+rx*ca-rz*sa;hz=bz+rx*sa+rz*ca;
    const uzunlukHata=1+this.normal()*sigma*(tip==='hava'?1.5:1.2);
    if(tip==='yer'){const L2=hyp(hx-bx,hz-bz)||1;v*=uzunlukHata;b.vx=(hx-bx)/L2*v;b.vz=(hz-bz)/L2*v;b.vy=0;b.y=Math.min(b.y,0.02);b.egri=0;}
    else{
      if(tip==='sut')hy+=this.normal()*sigma*L*0.35+Math.max(0,L-18)*0.01;
      else{hx=bx+(hx-bx)*uzunlukHata;hz=bz+(hz-bz)*uzunlukHata;}
      const c=this.havadanCoz(bx,Math.max(b.y,0.11),bz,hx,hy,hz,T,egri);
      b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.y=Math.max(b.y,0.11);b.egri=egri;
    }
    b.sahip=null;b.tasiyan=null;p.kickCd=0.3;p.surus=null;
    this.dokunus(p,true);
    b.hedefOyuncu=sec.alici||null;b.pasHedef=sec.alici?{x:hx,z:hz,tur:sec.tur}:null;
    const tur=sec.tur;
    if(tur==='sut'){b.sut={team:p.team,by:p,gkDone:false,cerceve:this.cerceveyeGider(p.team),xg:sec.xg||0,t:this.t};this.ist.sut[p.team]++;
      this.ofsaytPasAni(p);this.on('shot',{p,dist:L,xg:sec.xg||0});}
    else if(tur==='pas'||tur==='ara'||tur==='uzun'||tur==='orta'||tur==='geriCevir'||tur==='kisa'){
      this.pasSay(p,sec.hx,sec.hz,L,tur);this.ofsaytPasAni(p);
      this.on(tur==='orta'?'cross':'pass',{p,q:sec.alici,long:L>=32,tur});
      if(tur==='orta'||tur==='geriCevir')this.ortaBlok(p);}
    else if(tur==='uzaklastir'||tur==='degaj')this.on(tur==='degaj'?'gkkick':'clear',{p});
    else if(tur==='serbest'||tur==='korner'||tur==='kaleVurusu'){this.pasSay(p,sec.hx,sec.hz,L,tur);this.ofsaytPasAni(p);}
  }
  pasSay(p,hx,hz,L,tur){
    const b=this.ball,d=this.dir[p.team],ileri=(hx-b.x)*d,yan=Math.abs(hz-b.z),a=Math.atan2(yan,ileri);
    this.ist.pas[p.team]++;b.pas={p,takim:p.team,t:this.t};
    if(a<Math.PI/4)this.ist.pasYon.ileri++;else if(a>Math.PI*3/4)this.ist.pasYon.geri++;else this.ist.pasYon.yan++;
    if(L>=32)this.ist.uzunPas++;
  }
  /* havadan vuruş: top T saniye sonra (hx,hy,hz)'de olsun; hava direnci ve falso ile, düzeltmeli çözüm */
  havadanCoz(x0,y0,z0,hx,hy,hz,T,egri){
    let vx=(hx-x0)/T,vz=(hz-z0)/T,vy=(hy-y0+0.5*G*T*T)/T;const n=Math.max(1,Math.round(T*60));
    for(let k=0;k<3;k++){const s={x:x0,y:y0,z:z0,vx,vy,vz,egri};for(let i=0;i<n;i++)topFizikAdim(s,1/60,true);
      vx+=(hx-s.x)/T;vy+=(hy-s.y)/T;vz+=(hz-s.z)/T;}
    return{vx,vy,vz};
  }
  /* şut çerçeveyi bulacak mı (kaleci ve oyuncular olmasa) */
  cerceveyeGider(t){
    const gx=this.dir[t]*PL,yol=this.topYolu();
    for(let i=1;i<yol.length;i++){const a=yol[i-1],c=yol[i];if((a.x-gx)*(c.x-gx)<=0){const f=(gx-a.x)/((c.x-a.x)||1),z=a.z+(c.z-a.z)*f,y=a.y+(c.y-a.y)*f;return Math.abs(z-MZ)<GW2&&y<GH;}}
    return false;
  }
  /* pasın hedefi vuruş anında tazelenir: top ile alıcının buluşacağı nokta. Alıcı koşusunu ~1 sn sürdürür sonra yavaşlar;
     top o noktaya pasın hızıyla ne zaman varırsa, alıcının orada olacağı ilk an seçilir. Ara pasında koşunun önündeki boşluğa */
  hedefGuncelle(p,sec){
    const q=sec.alici,b=this.ball;if(!q)return;
    const hava=sec.tip==='hava',surdur=sec.tur==='ara'?2.2:1.0;
    for(let t=0.2;t<=3.5;t+=0.05){
      const k=Math.min(t,surdur),x=q.x+q.vx*k,z=q.z+q.vz*k,L=hyp(x-b.x,z-b.z);
      const tb=hava?0.75+L/28:yerSure(Math.min(29,yerIlkHiz(L,pasVarisHizi(L),this.R)),L,this.R);
      if(tb<=t){sec.hx=clamp(x,-PL+0.5,PL-0.5);sec.hz=clamp(z,0.8,PW-0.8);return;}}
    sec.hx=clamp(q.x+q.vx*surdur,-PL+0.5,PL-0.5);sec.hz=clamp(q.z+q.vz*surdur,0.8,PW-0.8);
  }

  /* ============ topla oyuncu: karar, top sürme, koruma ============ */
  topluAI(dt){
    const b=this.ball,p=b.sahip;if(!p||b.tasiyan)return;
    if(!p.oyunda){b.sahip=null;return;}
    const d=hyp(b.x-p.x,b.z-p.z);
    if(d>3.2||(d>1.6&&hyp(b.vx,b.vz)>9)){b.sahip=null;p.surus=null;return;}
    if(p.eylem)return;
    p.kararT-=dt;
    if(p.kararT<=0&&d<1.1&&b.y<0.5){const s=kararVer(this,p);this.secenekUygula(p,s);if(p.eylem)return;}
    this.surusIlerle(p,dt);
  }
  secenekUygula(p,s){
    const b=this.ball,A=MOTOR_AYAR;
    switch(s.tur){
      case 'sut':this.vurusBaslat(p,{tur:'sut',hx:this.dir[p.team]*PL,hz:MZ,xg:s.xg});break;
      case 'pas':case 'ara':case 'uzun':case 'orta':case 'geriCevir':
        this.vurusBaslat(p,{tur:s.tur,hx:s.hx,hz:s.hz,tip:s.tip,alici:s.alici,guncelle:s.tur==='pas'||s.tur==='uzun'});break;
      case 'uzaklastir':{/* uzağa ve kanada, çoğu zaman hedefsiz; baskı altında ayağın kenarından kaçıp taça ya da kornere gidebilir */
        const d=this.dir[p.team],yan=p.z<MZ?-1:1,kacti=this.rast()<0.25+baskiAltinda(this,p)*0.25;
        let hx=clamp(p.x+d*(28+this.rast()*22),-PL+4,PL-4),hz=p.z+yan*(10+this.rast()*26);
        if(kacti){hx=p.x+d*(this.rast()*14-4);hz=p.z+yan*(18+this.rast()*20);}
        this.vurusBaslat(p,{tur:'uzaklastir',hx,hz,tip:'hava'});break;}
      case 'koru':{const {o}=enYakinRakip(this,p.x,p.z,p.team);const a=o?Math.atan2(p.z-o.z,p.x-o.x):p.yon;p.surus={yon:a,hiz:0.22,koru:true};
        p.kararT=0.28+this.rast()*0.2;break;}
      default:{p.surus={yon:s.yon!=null?s.yon:p.yon,hiz:s.hiz||0.88};p.kararT=lerp(A.surusKarar[0],A.surusKarar[1],this.rast());}
    }
  }
  /* dokunuşlarla top sürme: top öne itilir, oyuncu yetişince yeniden dokunur. Rakip yakınsa dokunuşlar kısa */
  surusIlerle(p,dt){
    const b=this.ball;if(!p.surus)p.surus={yon:p.yon,hiz:0.5};
    const s=p.surus,c=Math.cos(s.yon),sn=Math.sin(s.yon);
    const dx=b.x-p.x,dz=b.z-p.z,d=hyp(dx,dz);
    /* top ile oyuncu arasına rakip girmesin: topun biraz arkasına koş */
    p.tx=b.x+b.vx*0.22-c*0.34;p.tz=b.z+b.vz*0.22-sn*0.34;p.hizOran=s.hiz*(0.8+0.12*p.oz.surus);p.yonHedef=s.yon;p.bak=null;
    p.dokunT-=dt;
    const onde=dx*Math.cos(p.yon)+dz*Math.sin(p.yon);
    if(d<0.62&&p.dokunT<=0&&b.y<0.35&&onde>-0.15){
      let a=s.yon;const f=aciFark(a,p.yon),donus=Math.abs(f)>0.85;
      if(donus)a=aciNorm(p.yon+Math.sign(f)*0.85);
      const baski=baskiAltinda(this,p);
      a+=this.normal()*(0.04+0.1*(1-p.oz.surus))*(1+baski);
      const itme=s.koru?0.3:lerp(1.9,0.65,baski)*(donus?0.45:1)*(0.75+0.5*s.hiz);
      const ileri=Math.max(0,p.vx*Math.cos(a)+p.vz*Math.sin(a)),v=ileri*0.95+itme;
      b.vx=Math.cos(a)*v;b.vz=Math.sin(a)*v;b.vy=0;b.y=0;b.egri=0;
      p.dokunT=0.22;this.dokunus(p,true);
    }
  }

  /* ============ temaslar: kontrol, araya girme, kafa, blok, kaleci ============ */
  temaslar(dt){
    const b=this.ball;if(b.tasiyan)return;
    if(b.sut&&!b.sut.gkDone)this.kaleciKurtaris();
    if(this.phase!=='play'||b.tasiyan)return;
    const ad=[];
    for(const p of this.players){
      if(!p.oyunda||p.kickCd>0)continue;const e=p.eylem;
      if(e&&(e.kilit||e.ad==='tac'))continue;
      const dx=b.x-p.x,dz=b.z-p.z,d=hyp(dx,dz);if(d>1.3)continue;
      const tur=this.erisim(p,d);if(tur)ad.push({p,d,tur});
    }
    if(!ad.length)return;
    const sahip=b.sahip;
    /* top sürücünün kontrolündeyse (ayağında, ilk dokunuşta ya da dokunuşla hemen önünde) rakip onu ancak müdahaleyle alır
       (mudahaleSonuc). Yalnız uzun kaçan dokunuşta, topa sürücüden belirgin yakın olan rakip araya girebilir */
    if(sahip&&sahip.oyunda&&b.y<0.5&&!b.sut){const dS=hyp(b.x-sahip.x,b.z-sahip.z);
      if(dS<1.3&&hyp(b.vx,b.vz)<7){
        if(dS<0.62&&ad.some(a=>a.p===sahip))return;
        for(let i=ad.length-1;i>=0;i--){const a=ad[i];if(a.p!==sahip&&(a.p.team===sahip.team||a.d>dS-0.5))ad.splice(i,1);}
        if(!ad.length)return;}}
    /* şut: savunmacı bloklar */
    if(b.sut){const bl=ad.find(a=>a.p.team!==b.sut.team&&a.p.rol!=='GK');if(bl){this.blok(bl.p);return;}
      if(ad.every(a=>a.p===b.sut.by))return;}
    /* kaleci eliyle (ceza sahasında önceliklidir) */
    const el=ad.find(a=>a.tur==='el');if(el){this.kaleciYakala(el.p);return;}
    /* hava topu: kafa mücadelesi. Topa sıçrayan rakipler 1,5 m'ye kadar mücadeleye girer */
    const kafa=ad.filter(a=>a.tur==='kafa').sort((x,y)=>x.d-y.d);
    if(kafa.length){
      for(const p of this.players){if(!p.oyunda||p.kickCd>0||p.rol==='GK'||kafa.some(a=>a.p===p)||p.team===kafa[0].p.team)continue;
        const e=p.eylem;if(e&&(e.kilit||e.ad==='tac'))continue;
        const d=hyp(b.x-p.x,b.z-p.z),kafaY=1.72*p.boy+0.25+0.35*p.oz.kafa;if(d<1.5&&b.y<kafaY+0.1)kafa.push({p,d,tur:'kafa'});}
      this.havaTopu(kafa);return;}
    /* en yakın oyuncu dokunur; iki takımdan biri de erişiyorsa ikili mücadele */
    ad.sort((x,y)=>x.d-y.d);let kazanan=ad[0];
    const rakip=ad.find(a=>a.p.team!==kazanan.p.team);
    if(rakip&&rakip.d-kazanan.d<0.25){kazanan=this.ikiliMucadele(kazanan,rakip);if(!kazanan)return;}
    const p=kazanan.p,e=p.eylem;
    if(e&&e.ad==='vurus'&&e.faz!=='takip')return; /* vuruş zinciri topu kendisi alacak */
    /* sert gelen topa uzanan rakip çoğu zaman kontrol edemez: top bacağından seker */
    const hiz=hyp(b.vx,b.vz),rakipTopu=b.sonTakim!==p.team&&b.hedefOyuncu!==p;
    if(rakipTopu&&hiz>8&&kazanan.d>0.28&&kazanan.tur==='ayak'&&this.rast()<clamp(0.35+(hiz-8)*0.05,0,0.8)){this.sekme(p);return;}
    if(kazanan.tur==='gogus')this.gogusKontrol(p);else this.kontrolEt(p);
  }
  /* oyuncu topa ne ile erişir: ayak, göğüs, kafa ya da (kaleci) el */
  erisim(p,d){
    const b=this.ball,y=b.y,kafaY=1.72*p.boy+0.25+0.35*p.oz.kafa;
    if(p.rol==='GK'&&this.elleOynar(p)&&d<0.95&&y<2.65)return 'el';
    if(d<0.6&&y<0.8)return 'ayak';
    if(d<0.5&&y>=0.8&&y<1.55)return 'gogus';
    if(d<0.62&&y>=1.45&&y<kafaY&&b.vy<3){
      /* ceza sahaları dışında, rakipsiz ve yavaşça düşen topu kafayla oynamaz: göğse ya da ayağa indirir */
      if(b.vy<0&&hyp(b.vx,b.vz)<9&&!(Math.abs(b.x)>PL-CEZA_U-2&&Math.abs(b.z-MZ)<CEZA_W+2)){
        let rakip=false;for(const o of this.teams[1-p.team])if(o.oyunda&&hyp(o.x-b.x,o.z-b.z)<2.5){rakip=true;break;}
        if(!rakip)return null;}
      return 'kafa';}
    return null;
  }
  elleOynar(p){
    const b=this.ball;if(p.rol!=='GK'||!this.kendiCezaSahasinda(p,b.x,b.z))return false;
    /* geri pas kuralı: takım arkadaşının kasıtlı ayak pasını ve taçı elle alamaz */
    if(b.pas&&b.pas.takim===p.team&&b.sonDokunan&&b.sonDokunan.team===p.team&&b.sonDokunan!==p)return false;
    return true;
  }
  kendiCezaSahasinda(p,x,z){const gx=-this.dir[p.team]*PL;return Math.abs(x-gx)<CEZA_U&&Math.abs(z-MZ)<CEZA_W;}
  ikiliMucadele(a,c){
    /* topu önce kim alır: yakınlık, müdahale ve top sürme becerisi, gövde gücü. Kaybeden bir an geride kalır */
    const g=x=>x.p.oz.mudahale*0.5+x.p.oz.surus*0.3+(x.p.kayit?(x.p.kayit.yapi||1)-1:0)+(0.25-x.d)*1.5;
    const pa=sigma((g(a)-g(c))*3),k=this.rast()<pa?a:c,kay=k===a?c:a;
    kay.p.kickCd=0.55;if(this.ball.sahip===kay.p)this.ball.sahip=null;
    return k;
  }
  /* ilk dokunuş: top ayağa gelir; hız, yükseklik, baskı ve tekniğe göre iyi ya da kötü */
  kontrolEt(p){
    const b=this.ball,v=hyp3(b.vx,b.vz,b.vy),baski=baskiAltinda(this,p),teknik=p.oz.surus*0.55+p.oz.pas*0.45;
    const zorluk=(clamp((v-5)/18,0,1)*0.55+(b.y>0.3?0.14:0)+baski*0.14)*MOTOR_AYAR.kontrolZorluk;
    const iyi=this.rast()<clamp(0.99-zorluk*(1.1-teknik)*0.6,0.4,0.995);
    const a=this.kontrolYonu(p);
    if(iyi){const h=clamp(p.spd*0.75,0,4.5)+0.5;b.vx=Math.cos(a)*h;b.vz=Math.sin(a)*h;b.vy=0;b.y=Math.min(b.y,0.05);b.egri=0;
      this.dokunus(p,true);this.sahipYap(p);p.eylem={ad:'kontrol',t:0,sure:0.22};p.kickCd=0.06;
      /* topu alırken arkasına yapışan rakip itebilir ya da tutabilir */
      if(this.phase==='play')this.sirtFaulu(p);}
    else{const ra=a+this.normal()*1.3,h=1.8+v*0.2;b.vx=Math.cos(ra)*h;b.vz=Math.sin(ra)*h;b.vy=b.y>0.3?1+this.rast()*2:0;
      this.dokunus(p,false);if(b.sahip===p)b.sahip=null;p.eylem={ad:'kontrol',t:0,sure:0.3,kotu:true};p.kickCd=0.32;this.on('kotuKontrol',{p});}
  }
  gogusKontrol(p){
    const b=this.ball,baski=baskiAltinda(this,p),iyi=this.rast()<clamp(0.9-baski*0.2+(p.oz.surus-0.6)*0.3,0.4,0.97),a=this.kontrolYonu(p);
    b.vx=Math.cos(a)*(iyi?0.8:2.5)+(iyi?0:this.normal()*1.5);b.vz=Math.sin(a)*(iyi?0.8:2.5)+(iyi?0:this.normal()*1.5);b.vy=iyi?-0.5:1.2;
    this.dokunus(p,true);if(iyi)this.sahipYap(p);else if(b.sahip===p)b.sahip=null;
    p.eylem={ad:'gogus',t:0,sure:0.4};p.kickCd=iyi?0.18:0.35;
  }
  /* ilk dokunuşla top nereye: boşluğa ve hücum yönüne, en yakın rakipten uzağa */
  kontrolYonu(p){
    const d=this.dir[p.team],{o,d:od}=enYakinRakip(this,p.x,p.z,p.team);
    let x=d*1.0,z=(MZ-p.z)*0.01;
    if(o&&od<6){x+=(p.x-o.x)/od*1.2*(6-od)/6;z+=(p.z-o.z)/od*1.2*(6-od)/6;}
    const a=Math.atan2(z,x),f=aciFark(a,p.yon);return aciNorm(p.yon+clamp(f,-1.2,1.2));
  }
  /* sekme: top oyuncunun bacağına çarpıp rastgele yöne gider, hızının bir kısmını kaybeder */
  sekme(p){
    const b=this.ball,hiz=hyp(b.vx,b.vz),a=Math.atan2(b.vz,b.vx)+(this.rast()<0.5?-1:1)*(0.5+this.rast()*1.4),k=0.35+this.rast()*0.35;
    b.vx=Math.cos(a)*hiz*k;b.vz=Math.sin(a)*hiz*k;b.vy=this.rast()<0.4?1+this.rast()*3:0;
    if(b.sut)b.sut=null;this.dokunus(p,false);p.kickCd=0.35;this.on('sekme',{p});
  }
  blok(p){
    /* blok: top sekerek yön değiştirir; çoğu zaman yana ya da kale çizgisine doğru (korner), bazen geri */
    const b=this.ball,v=hyp(b.vx,b.vz),r=this.rast(),ileri=r<0.55;
    if(r<0.22){/* sekip kale çizgisine, direğin dışına (korner) */b.vx=b.vx*(0.45+this.rast()*0.2);b.vz=(Math.sign(b.z-MZ)||1)*(4+this.rast()*5);}
    else if(ileri){b.vx=b.vx*(0.2+this.rast()*0.35);b.vz=b.vz*0.4+(this.rast()<0.5?-1:1)*(3+this.rast()*6);}
    else{b.vx=-b.vx*(0.12+this.rast()*0.2)+this.normal()*3;b.vz=b.vz*0.3+this.normal()*5;}
    b.vy=1.5+this.rast()*4;
    b.sut=null;this.dokunus(p,false);p.kickCd=0.35;p.eylem={ad:'blok',t:0,sure:0.45};this.on('block',{p,v});
  }

  /* orta: topun ilk metrelerindeki rakibin bacağı ortayı kesebilir; top çoğu zaman kale çizgisine doğru seker (korner) */
  ortaBlok(p){
    const b=this.ball,v=hyp(b.vx,b.vz)||1,ux=b.vx/v,uz=b.vz/v,d=this.dir[p.team];
    for(const o of this.teams[1-p.team]){if(!o.oyunda||o.rol==='GK'||(o.eylem&&o.eylem.kilit))continue;
      const on=(o.x-b.x)*ux+(o.z-b.z)*uz,yan=Math.abs((o.x-b.x)*uz-(o.z-b.z)*ux);
      if(on<0.3||on>2.4||yan>0.9||this.rast()>0.45*(1-yan/0.9))continue;
      if(this.rast()<0.6){b.vx=d*(4+this.rast()*6);b.vz=(this.rast()-0.5)*7;}
      else{b.vx=-ux*v*(0.15+this.rast()*0.2)+this.normal()*2;b.vz=-uz*v*(0.15+this.rast()*0.2)+this.normal()*2;}
      b.vy=1.5+this.rast()*4;b.egri=0;b.pasHedef=null;
      this.dokunus(o,false);o.kickCd=0.35;o.eylem={ad:'blok',t:0,sure:0.45};this.on('block',{p:o,v,orta:true});return;}
  }

  /* ============ kaleci: şuta tepki, uçuş, kurtarış ============ */
  kaleciKurtaris(){
    const b=this.ball,sh=b.sut,t=1-sh.team,gk=this.kaleci(t),d=this.dir[t];
    if(!gk.oyunda)return;
    /* top kaleciye doğru mu gidiyor */
    if(b.vx*d>=0){sh.gkDone=true;return;}
    const tepki=MOTOR_AYAR.kaleciTepki*(1.25-gk.oz.kalecilik*0.5);
    if(gk.penaltiTahmin&&!sh.tepki){sh.tepki=true;const yan=gk.penaltiTahmin;gk.penaltiTahmin=0;
      gk.eylem={ad:'ucus',t:0,sure:1.05,kilit:true,fren:4,vx:0,vz:yan*5.2,yan,y:0.4+this.rast()*1.2};this.on('dive',{p:gk});}
    if(!sh.tepki&&this.t-sh.t>=tepki){sh.tepki=true;
      /* topun kalecinin hizasından geçeceği nokta ve oraya kalan süre; kaleye gidip gitmediğine kale çizgisinde bakılır
         (açılı şutta top kaleci hizasında direğin dışından geçip içeri girebilir) */
      const yol=this.topYolu(),i0=Math.max(0,Math.round((this.t-this._yolT0)*60)-1),gx=-d*PL;let g=null,kale=null;
      for(let i=i0+1;i<yol.length;i++){const a=yol[i-1],c=yol[i];
        if(!g&&(a.x-gk.x)*(c.x-gk.x)<=0){const f=(gk.x-a.x)/((c.x-a.x)||1);g={z:a.z+(c.z-a.z)*f,y:a.y+(c.y-a.y)*f,t:(i-i0)/60};}
        if((a.x-gx)*(c.x-gx)<=0){const f=(gx-a.x)/((c.x-a.x)||1);kale={z:a.z+(c.z-a.z)*f,y:a.y+(c.y-a.y)*f};break;}}
      if(g&&kale&&Math.abs(kale.z-MZ)<GW2+1.0&&kale.y<GH+0.5)sh.plan={z:g.z,y:g.y,an:this.t+g.t,uctu:false};
    }
    /* uzaktan gelen şutta kaleci önce yana kayar (kaleciKonum), topa ~0,4 sn kala uçar; yakından gelende hemen uçar.
       Uçuş hızı, topun geçeceği noktaya top gelirken varacak kadardır (en çok 6,2 m/sn) */
    const pl=sh.plan;
    if(pl&&!pl.uctu&&!gk.eylem){const kalan=pl.an-this.t,dz=pl.z-gk.z;
      if(kalan<=0.45){pl.uctu=true;
        if(Math.abs(dz)>0.45||pl.y>2.0){const hiz=clamp(Math.abs(dz)/Math.max(0.2,kalan),Math.abs(dz)>0.45?2:0.5,6.2)*(Math.sign(dz)||1);
          gk.eylem={ad:'ucus',t:0,sure:1.05,kilit:true,fren:4,vx:0,vz:hiz,yan:Math.sign(dz)||1,y:clamp(pl.y,0.15,2.2)};this.on('dive',{p:gk});}}}
    /* top kaleci hizasından geçiyor mu */
    if((b.px-gk.x)*(b.x-gk.x)>0)return;
    sh.gkDone=true;
    /* ayaktaki kaleci eğilip uzanarak 0,3–1,9 m arasını gövdesiyle karşılar; uçan kaleci uçtuğu yükseklikte */
    const e=gk.eylem,ucus=e&&e.ad==='ucus',govdeY=ucus?e.y:clamp(b.y,0.3,1.9),uz=Math.abs(b.z-gk.z),uy=b.y-govdeY;
    const erisim=(ucus?1.05:0.85)*MOTOR_AYAR.kaleciErisim*(0.85+gk.oz.kalecilik*0.3),mesafe=hyp(uz,uy*0.8);
    if(mesafe>erisim||b.y>2.55)return;
    /* kurtarış olasılığı: gövdeye gelen top neredeyse hep kurtarılır; kol boyu uzaktaki sert şut zor */
    const v=hyp3(b.vx,b.vy,b.vz),r=mesafe/erisim,P=clamp(0.985-r*(0.3+Math.max(0,v-16)*0.013)+r*(gk.oz.kalecilik-0.65)*0.4,0.25,0.985);
    if(this.rast()>=P)return;
    if(sh.cerceve)this.ist.isabet[sh.team]++;
    const tut=!ucus&&mesafe<0.55&&v<26?this.rast()<0.35+gk.oz.kalecilik*0.5:ucus&&mesafe<0.45&&v<20&&this.rast()<0.3;
    b.sut=null;
    if(tut){this.kaleciTut(gk);this.on('save',{p:gk,catch:true});return;}
    /* çelme: çoğu zaman top direğin yanından ya da üst direğin üstünden dışarı (korner), bazen öne düşer */
    const kose=this.rast()<(b.y>1.7?0.75:0.55),yan=Math.sign(b.z-gk.z)||1;
    if(kose){b.vx*=0.35;b.vz=yan*(3.5+this.rast()*3.5);b.vy=b.y>1.6?3+this.rast()*2:1+this.rast()*2.5;}
    else{b.vx=-b.vx*(0.12+this.rast()*0.2);b.vz=yan*(1+this.rast()*4);b.vy=1.5+this.rast()*3;}
    this.dokunus(gk,false);gk.kickCd=0.5;this.on('save',{p:gk,catch:false});
  }
  kaleciTut(gk){
    const b=this.ball;b.tasiyan=gk;b.sahip=null;b.vx=b.vy=b.vz=0;b.egri=0;this.dokunus(gk,true);
    gk.tutus={t:0,sure:1.6+this.rast()*1.6};gk.kickCd=0.2;
  }
  kaleciYakala(gk){
    const b=this.ball,v=hyp3(b.vx,b.vy,b.vz),kalabalik=this.players.filter(o=>o.oyunda&&o!==gk&&hyp(o.x-b.x,o.z-b.z)<1.6).length;
    if(b.y>1.2&&kalabalik>=2&&this.rast()<0.55){/* yumrukla */
      const d=this.dir[gk.team],a=Math.atan2((b.z<MZ?-1:1)*0.8,d);b.vx=Math.cos(a)*14;b.vz=Math.sin(a)*14;b.vy=5;b.sut=null;
      this.dokunus(gk,false);gk.kickCd=0.5;gk.eylem={ad:'yumruk',t:0,sure:0.5};this.on('yumruk',{p:gk});return;}
    if(this.rast()<clamp(0.93-(v-12)*0.02+(gk.oz.kalecilik-0.6)*0.3,0.5,0.98)){this.kaleciTut(gk);gk.eylem={ad:'tutus',t:0,sure:0.35};}
    else{b.vx=-b.vx*0.3+this.normal()*2;b.vz=b.vz*0.3+this.normal()*2;b.vy=1;this.dokunus(gk,false);gk.kickCd=0.45;this.on('save',{p:gk,catch:false});}
  }

  /* ============ hava topu ============ */
  havaTopu(adaylar){
    const b=this.ball,takimlar=new Set(adaylar.map(a=>a.p.team));
    let kazanan=adaylar[0];
    if(takimlar.size>1){
      this.ist.havaTopu++;
      const g=a=>{const p=a.p;return p.oz.kafa*2+(p.boy-1)*4+(p.kayit?(p.kayit.yapi||1)-1:0)*2-a.d*1.6+(p.rol==='GK'?0.5:0)+this.normal()*0.45;};
      kazanan=adaylar.reduce((x,y)=>g(x)>g(y)?x:y);
      for(const a of adaylar)if(a!==kazanan){a.p.eylem={ad:'kafa',t:0,sure:0.5,bos:true};a.p.kickCd=0.4;}
      const kaybeden=adaylar.find(a=>a.p.team!==kazanan.p.team);
      if(kaybeden&&this.havaFaulu(kazanan.p,kaybeden.p))return;
    }
    this.kafaVur(kazanan.p);
  }
  kafaVur(p){
    const b=this.ball,k=kafaKarari(this,p);
    /* kendi kalesine dönük savunmacının kafası çoğu zaman topu çizgiden dışarı atar (korner) */
    const d=this.dir[p.team],kaleyeDonuk=Math.cos(p.yon)*d<-0.3,kendiCeza=this.kendiCezaSahasinda(p,b.x,b.z);
    if(k.tur==='uzaklastir'&&kendiCeza&&this.rast()<(kaleyeDonuk?0.45:0.18)){k.hx=b.x-d*12;k.hz=b.z+(b.z<MZ?-1:1)*(4+this.rast()*8);k.vy=3+this.rast()*3;}
    const L=hyp(k.hx-b.x,k.hz-b.z)||1,sig=(0.05+0.1*(1-p.oz.kafa))*(1+baskiAltinda(this,p)*0.5);
    const a=Math.atan2(k.hz-b.z,k.hx-b.x)+this.normal()*sig,v=k.v*(0.9+this.rast()*0.2);
    b.vx=Math.cos(a)*v;b.vz=Math.sin(a)*v;b.vy=k.vy+this.normal()*sig*6;b.egri=0;
    b.sahip=null;p.kickCd=0.4;p.eylem={ad:'kafa',t:0,sure:0.5};
    this.dokunus(p,true);b.hedefOyuncu=k.alici||null;
    if(k.tur==='sut'){b.sut={team:p.team,by:p,gkDone:false,cerceve:this.cerceveyeGider(p.team),kafa:true,t:this.t};this.ist.sut[p.team]++;}
    else if(k.tur==='indirme'||k.tur==='pas'){this.pasSay(p,k.hx,k.hz,L,'kafa');this.ofsaytPasAni(p);}
    this.on('header',{p,shot:k.tur==='sut',tur:k.tur});
  }

  /* ============ oyun alanı sınırları: gol, taç, korner, aut ============ */
  sinirlar(){
    const b=this.ball;
    const gol=this.kaleCarpismalari();if(gol){this.gol(gol);return;}
    if(b.agda)return;
    if(b.tasiyan)return;
    const ax=Math.abs(b.x);
    if(ax>PL+TOP_YARICAP){
      const side=Math.sign(b.x),def=this.dir[0]===-side?0:1;
      this.topDisari();
      if(b.sonTakim===def)this.durusBaslat('korner',1-def,side*(PL-0.4),b.z<MZ?0.4:PW-0.4);
      else this.durusBaslat('kaleVurusu',def,side*(PL-ALTIPAS_U+0.5),MZ+(b.z<MZ?-4:4));
      return;
    }
    if(b.z<-TOP_YARICAP||b.z>PW+TOP_YARICAP){this.topDisari();this.durusBaslat('tac',1-b.sonTakim,clamp(b.x,-PL+0.5,PL-0.5),b.z<0?-0.15:PW+0.15);}
  }
  /* oyundaki top dışarı çıktı: saha dışında yuvarlanan "dış top" olur, top toplayıcı alır */
  topDisari(){
    const b=this.ball;this.disToplar.push({x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:0,alan:null,t:0});
    for(const p of this.players)if(p.eylem&&p.eylem.ad==='vurus')p.eylem=null;
    b.sahip=null;b.sut=null;b.hedefOyuncu=null;b.pas=null;
    for(const t of[0,1]){const gk=this.kaleci(t);if(gk.eylem&&gk.eylem.ad==='ucus')continue;}
  }
  disToplarAdim(dt){
    for(let i=this.disToplar.length-1;i>=0;i--){const o=this.disToplar[i];o.t+=dt;if(o.alan)continue;
      topFizikAdim(o,dt,false,this.R);
      /* reklam panoları: yanlarda 4,2 m, kale arkasında 5,3 m ötede */
      if(o.z<-4.1&&o.vz<0){if(o.y>1.0){this.disToplar.splice(i,1);continue;}o.z=-4.1;o.vz*=-0.25;}
      if(o.z>PW+4.1&&o.vz>0){if(o.y>1.0){this.disToplar.splice(i,1);continue;}o.z=PW+4.1;o.vz*=-0.25;}
      if(Math.abs(o.x)>PL+5.2&&o.vx*Math.sign(o.x)>0){if(o.y>1.0){this.disToplar.splice(i,1);continue;}o.x=Math.sign(o.x)*(PL+5.2);o.vx*=-0.25;}
      /* kale ağına giden dış top ağın arkasında kalır */
      if(Math.abs(o.x)>PL&&Math.abs(o.x)<PL+2&&Math.abs(o.z-MZ)<GW2+0.1&&o.y<GH){o.vx*=0.5;o.vz*=0.5;}
    }
  }

  /* ============ gol ============ */
  gol(side){
    const b=this.ball,def=this.dir[0]===-side?0:1,att=1-def;
    this.score[att]++;const own=b.sonTakim===def,scorer=b.sonDokunan;
    if(b.sut&&!own)this.ist.isabet[att]++;
    b.agda=true;b.sut=null;b.sahip=null;b.hedefOyuncu=null;b.pas=null;
    for(const p of this.players)if(p.eylem&&p.eylem.ad==='vurus')p.eylem=null;
    this.phase='goal';this.phaseT=0;this.celeb={team:att,side,scorer,own};this.duranSure[this.half-1]+=50;
    this.on('goal',{team:att,scorer,own,score:this.score.slice()});
  }
  stepGoal(dt){
    const c=this.celeb,sc=c.own?null:c.scorer,cx=c.side*(PL-3),cz=c.side>0?PW-3:3,b=this.ball,gk=this.kaleci(1-c.team);
    for(const p of this.players){
      if(!p.oyunda)continue;p.surus=null;
      if(p===gk){/* kaleci topu ağdan alır, orta noktaya doğru atar */
        if(!b.tasiyan&&b.agda&&this.phaseT>2.2){p.tx=b.x-c.side*0.4;p.tz=b.z;p.hizOran=0.4;p.bak=b;
          if(hyp(p.x-b.x,p.z-b.z)<0.9){b.agda=false;b.tasiyan=p;this.topDegisti();}}
        else if(b.tasiyan===p){p.tx=c.side*(PL-2);p.tz=MZ;p.bak={x:0,z:MZ};
          if(this.phaseT>5.2&&Math.abs(p.x-c.side*(PL-2))<1.2){b.tasiyan=null;const cz2=this.havadanCoz(b.x,1.2,b.z,-c.side*1.5,0,MZ,2.2,0);b.x=p.x;b.y=1.2;b.z=p.z;b.vx=cz2.vx;b.vy=cz2.vy;b.vz=cz2.vz;this.topDegisti();
            p.eylem={ad:'degaj',t:0,sure:0.5};}}
        else{p.tx=c.side*(PL-1.5);p.tz=MZ;p.hizOran=0.4;}
        continue;}
      if(p.team===c.team&&p.rol!=='GK'){
        if(p===sc){p.tx=cx;p.tz=cz;p.hizOran=1;}
        else{const g=sc||{x:cx,z:cz};p.tx=g.x-c.side*(1.2+(p.n%3)*0.9);p.tz=g.z-(cz>MZ?1:-1)*(1+(p.n%4)*0.9);p.hizOran=0.9;}
        p.sevinc=this.phaseT>0.5;p.bak=null;
      }else{const k=this.santraKonumu(p,1-c.team);p.tx=k.x;p.tz=k.z;p.hizOran=0.3;p.bak=null;}
    }
    this.hareketHepsi(dt);this.topAdim(dt);
    if(this.phaseT>7){for(const p of this.players)p.sevinc=false;this.santraHazirla(1-c.team,false);}
  }

  /* ============ devre / maç sonu ============ */
  devreSonuKontrol(){
    const h=this.half-1,sinir=h?5400:2700;
    if(!this.uzatmaIlan[h]&&this.gameSec>=sinir-20){
      const dk=clamp(Math.round((this.duranSure[h]+30)/60),h?2:1,8);this.added[h]=dk*60;this.uzatmaIlan[h]=true;this.ist.uzatma[h]=dk;
      this.on('uzatma',{dakika:dk,yari:this.half});}
    if(this.phase!=='play'&&this.phase!=='kickoff')return;
    const lim=sinir+this.added[h],b=this.ball;
    if(this.gameSec>=lim&&(Math.abs(b.x)<30||this.gameSec>lim+100)&&!b.sut)this.endHalf();
  }

}
