/* ============ Chairman — maç motoru: sakatlık, tedavi ve sağlıkçılar (mantık, çizimsiz) ============
   Sahibi: S akışı (T10c, 2026-10-11; gerçekçilik planı §4 T10 madde 1, §7.6 kullanıcı kararı: maç başına ~1 kısa sakatlık duraklaması — çoğu
   oyuncu devam eder — ve ~0,3 oyundan çıkma; kariyere süre kaybı olarak, bağlantı Aşama 3'te).
   Kaynak: temaslı sakatlık rakibin temasıyla düşüşten (şiddet; js/mac-mudahale.js dus → sakatlikTemas), temassız kas sakatlığı deparda
   yorgunluktan (arka adale, baldır), kramp 70. dakikadan sonra koşarken yorgunluktan (maç boyu yorgunluk T10c'de düzeldi: kısa duruşta
   azalmaz, devre arasında azalır — js/mac-hareket.js). Yatkınlık profilden türetilir (dayanıklılık; kadro verisine alan eklenmez, §7.3).
   Sakatlık zarları ve süreleri ayrı tohumlu diziden (skRast): sakatlık olmayan maçta ana dizisi değişmez.
   Dereceler: ağrı — yerde biraz uzun kalır, kalkar, kısa süre topallar (p.topal; oyun durmaz); tedavi — hakem oyunu durdurur (faul çalındıysa
   oyun zaten durmuştur; hafif sakatlıkta atağın bitmesini bekler, ağır ve kafa sakatlığında hemen durdurur), takımın iki sağlıkçısı kulübeden koşar, kısa tedavi, oyuncu kenara yürür (takım kısa süre eksik; kaleci sahada kalır),
   oyun başladıktan sonra hakemin işaretiyle döner; çıkış — sağlıkçılar sedyeyle taşır, değişiklik hakkı varsa yedek girer (kalecide yedek
   kaleci), yoksa takım eksik oynar (kaleci çıktıysa bir saha oyuncusu kaleye geçer).
   Süreler sıkıştırılmış maça göre (Claude kararı, gerçekçilik planı T10: tedavi duraklaması 20–30 sn — gerçekte ~89 sn —, sedyeyle ~30 sn).
   Hakemin durdurduğu oyun hakem topuyla başlar (bugünün kuralı, §7.6: topu son oynayan takıma, ceza sahasında savunan takımın kalecisine;
   motorda dolaylı serbest vuruş gibi kullanılır, baraj ve görev yok — js/mac-durantop.js serbestSinif 'hakemTopu').
   Sözleşme (çizim T10f'de okur; motor yalnız alan ekler): oyuncuda p.sakat {tur, bolge, derece, t0, gun} (tedavi ve çıkış sürerken), p.topal
   {oran, son} (basma oranı ve bitiş), p.tedavide (tedavi sonrası saha dışında bekliyor); saha kenarında kind 'saglikci' (takım başına iki;
   gorev, poz 'comel' tedavide); m.sakatlikAkis {p, evre, ...}, m.sedye {x, z, yon, p} (sedye taşınırken). Olaylar 'sakatlik' {p, tur, bolge,
   derece, dakika, gun}, 'hakemTopu' {takim, x, z, neden 'sakatlik', kutu, p, ek}, 'tedaviBasladi', 'sedye', 'oyunaDondu'. Maçın kaydı kayit.sakatliklar (Match.sonucKaydi; kariyer Aşama 3'te okur) */
'use strict';
ayarEkle('S',{
  sakatTemas:0.45,             // temaslı düşüşte sakatlık olasılığı: × (0,3 + 0,7·şiddet²) × yatkınlık (derece şiddetle: çıkış 0,025 + 0,14·ş, tedavi 0,28 + 0,2·ş, kalanı ağrı)
  sakatKas:0.010,              // deparda (hız ≥ 0,85 × azami) kas sakatlığı tehlikesi (1/sn): × (0,3 + yorgunluk)² × yatkınlık
  sakatKramp:0.0012,           // 70. dakikadan sonra koşarken kramp tehlikesi (1/sn): × min(1, (yorgunluk − 0,38)/0,12) × yatkınlık (yorgunluk 90. dakikada ortanca ~0,37)
  tedaviSure:[5,8],            // sağlıkçıların sahadaki tedavisi (sn; çıkışta 4 sn değerlendirme, sonra sedye)
  tedaviDonus:[6,10]           // tedaviden sonra kenarda bekleyen oyuncunun oyun başladıktan sonra dönüşü (sn; top 12 m'den uzaktayken)
});
/* yatkınlık 0,7–1,3: dayanıklılık düşükse yüksek */
const skYatkinlik=p=>0.7+0.6*(1-(p.oz&&p.oz.dayaniklilik!=null?p.oz.dayaniklilik:0.5));
/* rakip temasıyla düşüş nedenleri (js/mac-mudahale.js dus) */
const SK_TEMAS=new Set(['faul','kayma','takilma','omuz','hava','itme']);
Object.assign(Match.prototype,{
  /* kurulum (Match.reset): sağlıkçılar saha kenarı kişisidir (takım başına iki, kulübenin yanında saha dışında) */
  sakatlikHazirla(){
    /* sakatlık zarları ve süreleri ayrı tohumdan (mac-oncesi srast gibi): sakatlık olmayan maçta ana rastgele dizisi değişmez */
    this.skRast=tohumluRastgele((this.tohum^0x85ebca6b)>>>0);
    this.sakatlikAkis=null;this.sakatlikSira=[];this.sedye=null;this.tedavideBekleyen=[];
    for(let t=0;t<2;t++){const kb=this.kulubeler[t],s=kb.alan.x>=0?1:-1;
      for(let i=0;i<2;i++){const ev={x:kb.alan.x+s*(4.4+0.8*i),z:-1.9};
        this.kenar.push(this.varlik('kenar',ev.x,ev.z,{kind:'saglikci',team:t,name:'Sağlıkçı',maxSpd:6.2,oz:{hiz:0.5},yon:Math.PI/2,ev,gorev:null}));}}
  },
  saglikcilar(t){return this.kenar.filter(p=>p.kind==='saglikci'&&p.team===t);},
  /* sakatlık gününü kariyer için (Aşama 3 okur): ağrı 0–1, kramp 0, tedavi 0–5, temaslı çıkış 7–42 (uzun sakatlık %12: 60–150), kas 10–30 */
  sakatlikGun(tur,derece){const r=this.skRast();
    if(derece==='agri'||tur==='kramp')return derece==='agri'?Math.floor(r*2):0;
    if(derece==='tedavi')return Math.floor(r*6);
    if(tur==='kas')return 10+Math.floor(r*21);
    return r<0.12?60+Math.floor(r/0.12*90):7+Math.floor((r-0.12)/0.88*36);},
  /* temaslı düşüş (js/mac-mudahale.js dus): düşüren rakipse sakatlık zarı */
  sakatlikTemas(p,siddet,neden,kaynak){
    if(!kaynak||kaynak.team===p.team||!SK_TEMAS.has(neden)||!p.oyunda||p.sakat)return;
    const s=clamp(siddet||0,0,1);
    if(this.skRast()>=MOTOR_AYAR.sakatTemas*sureOlcek()*(0.3+0.7*s*s)*skYatkinlik(p))return;   /* U1: uzun maçta düşüş çok, maç başına sıklık aynı */
    const u=this.skRast(),Pc=0.025+0.14*s,Pt=0.28+0.2*s,derece=u<Pc?'cikis':u<Pc+Pt?'tedavi':'agri';
    const bolge=neden==='hava'?(u<0.5?'kafa':'omuz'):neden==='kayma'||neden==='takilma'?(u<0.6?'bilek':'diz'):u<0.5?'baldir':'diz';
    this.sakatlikBaslat(p,'temas',bolge,derece);
  },
  /* sakatlık başlar: kayıt ve olay; ağrıda yerde biraz kalır ve topallar, tedavi ve çıkışta yerde kalır ve sıraya girer */
  sakatlikBaslat(p,tur,bolge,derece){
    const dakika=Math.floor(this.gameSec/60)+1,gun=this.sakatlikGun(tur,derece);
    this.kayit.sakatliklar.push({ad:p.name,no:p.no,takim:p.team,tur,bolge,derece,dakika,gun});
    this.on('sakatlik',{p,tur,bolge,derece,dakika,gun});
    const e=p.eylem;
    if(derece==='agri'){
      if(e&&(e.ad==='dusus'||e.ad==='yerde'))e.yerde=(e.yerde||1)+2+this.skRast()*2;
      p.topal={oran:0.62+0.06*this.skRast(),son:this.t+12+this.skRast()*14};return;}
    p.sakat={tur,bolge,derece,t0:this.t,gun};p.topal=null;
    /* yerde kalır: düşüşteyse yerde evresi akış bitene dek sürer; değilse (temassız) oturup yatar */
    if(e&&e.ad==='dusus')e.yerde=999;
    else if(e&&e.ad==='yerde')e.sure=999;
    else{p.eylem={ad:'dusus',t:0,sure:0.6,kilit:true,fren:5,yerde:999,yon:p.yon+Math.PI,neden:'sakatlik',siddet:0.3,yuzustu:false};
      p.surus=null;p.tavir=null;if(p.calim)this.calimBitir(p,'kayip');}
    if(this.ball.sahip===p)this.ball.sahip=null;
    this.sakatlikSira.push(p);
  },
  /* tedavi ya da sedye sürerken duruşun kullanılması ve santra bekler */
  sakatlikBekletir(){const A=this.sakatlikAkis;return!!(A&&A.bekletir)||this.sakatlikSira.length>0&&this.phase!=='play';},
  /* her adım (oyun, duruş, gol, santra): akış, kenardaki sağlıkçılar, topallama; oyunda 6 karede bir temassız sakatlık zarı */
  sakatlikAdim(dt){
    this.sakatlikAkisAdim(dt);if(this.tedavideBekleyen.length)this.tedavidenDonus();
    if(this.kare%6)return;   /* T10g (hız): boştaki sağlıkçılar, topallamanın bitişi ve temassız zar 6 karede bir */
    for(const s of this.kenar)if(s.kind==='saglikci'&&!s.gorev){s.tx=s.ev.x;s.tz=s.ev.z;s.hizOran=0.35;s.poz=null;s.bak=null;s.yonHedef=hyp(s.x-s.ev.x,s.z-s.ev.z)<1.5?Math.PI/2:null;}   /* T10g: yerinde sahaya dönük */
    for(const p of this.players)if(p.topal&&this.t>p.topal.son)p.topal=null;
    if(this.phase!=='play')return;
    const ds=dt*6*sureOlcek(),son=this.half===2&&this.gameSec>4200;   /* U1: tehlike gerçek saniye başına; maç dakikası başına aynı kalsın */
    for(const p of this.players){if(!p.oyunda||p.sakat||p.eylem&&p.eylem.kilit)continue;
      const y=p.yorgunluk||0,yt=skYatkinlik(p);
      if(p.spd>0.85*p.maxSpd){if(this.skRast()<MOTOR_AYAR.sakatKas*(0.3+y)*(0.3+y)*yt*ds){const u=this.skRast();this.sakatlikBaslat(p,'kas',u<0.6?'arkaAdale':'baldir',u<0.5?'cikis':u<0.9?'tedavi':'agri');}}
      else if(son&&y>0.38&&p.spd>3){const k=Math.min(1,(y-0.38)/0.12);if(this.skRast()<MOTOR_AYAR.sakatKramp*k*yt*ds)this.sakatlikBaslat(p,'kramp','baldir',this.skRast()<0.7?'tedavi':'agri');}}
  },
  /* akış: bekle (oyun sürer; hakem durdurur) → cagir (sağlıkçılar koşar) → kos → tedavi → kalk ve cik (tedavi: kenara yürür; çizgide akış biter,
     oyuncu tedavideBekleyen listesinde dönüşü bekler) / sedye (çıkış) → degis (değişiklik ya da eksik). Aynı anda tek akış; ötekiler sırada */
  sakatlikAkisAdim(dt){
    let A=this.sakatlikAkis;
    if(!A){if(!this.sakatlikSira.length||this.degisiklik)return;const p=this.sakatlikSira.shift();if(!p.oyunda||!p.sakat)return;
      A=this.sakatlikAkis={p,evre:'bekle',t0:this.t,et:0,bekletir:false};}
    const p=A.p,b=this.ball;A.et+=dt;
    const M=this.saglikcilar(p.team),evre=e=>{A.evre=e;A.et=0;};
    if(A.evre==='bekle'){
      /* oyun duruyorsa (faul, top dışarıda, gol) tedavi bu duruşta. Oyundaysa hakem: ağır sakatlıkta (çıkış) ve kafada 1 sn'de durdurur; tedavide
         atağın bitmesini bekler (Kural 5: hafif sakatlıkta oyun durana dek sürer) — sakatın takımı topu 1 sn tutunca, top 1,5 sn sahipsiz kalınca
         ya da en geç 12 sn'de */
      if(this.phase!=='play'){A.bekletir=true;evre('cagir');return;}
      const agir=p.sakat.derece==='cikis'||p.sakat.bolge==='kafa';
      A.kendi=b.sahip&&b.sahip.team===p.team?(A.kendi||0)+dt:0;A.bos=!b.sahip&&!b.sut&&!b.pas?(A.bos||0)+dt:0;
      if(agir?A.et>=1.0:A.et>=12||A.kendi>=1.0||A.bos>=1.5){this.hakemTopuDurdur(p);A.bekletir=true;evre('cagir');}
      return;}
    if(A.evre==='cagir'){
      M.forEach((s,i)=>{s.gorev=A;s.poz=null;s.hizOran=1;s.bak=p;});
      this.on('tedaviBasladi',{p,saglikcilar:M});evre('kos');}
    if(A.evre==='kos'){
      M.forEach((s,i)=>{const yan=i?1:-1;s.tx=p.x+yan*0.75;s.tz=p.z+0.35;s.hizOran=1;s.bak=p;});
      if(M.every(s=>hyp(s.x-s.tx,s.z-s.tz)<0.6)||A.et>9){evre('tedavi');A.sure=p.sakat.derece==='cikis'?4:MOTOR_AYAR.tedaviSure[0]+this.skRast()*(MOTOR_AYAR.tedaviSure[1]-MOTOR_AYAR.tedaviSure[0]);
        M.forEach(s=>{s.poz='comel';s.vx=s.vz=0;});}}
    else if(A.evre==='tedavi'){
      M.forEach((s,i)=>{const yan=i?1:-1;s.tx=p.x+yan*0.75;s.tz=p.z+0.35;s.bak=p;});
      if(A.et>=A.sure){M.forEach(s=>{s.poz=null;});
        if(p.sakat.derece==='cikis'){/* sedye: oyuncu yatarak en yakın yan çizgiye taşınır (sağlıkçılar iki uçta) */
          p.oyunda=false;p.cikiyor=true;const kz=p.z<MZ?-1.2:PW+1.2;A.hedef={x:clamp(p.x,-PL+2,PL-2),z:kz};
          this.sedye={x:p.x,z:p.z,yon:Math.atan2(kz-p.z,0),p};this.on('sedye',{p});evre('sedye');}
        else if(p.rol==='GK'){/* kaleci sahada tedavi edilir, kalkar, yerinde kalır */
          p.eylem={ad:'kalkis',t:0,sure:1.4,kilit:true,fren:12,yon:p.eylem&&p.eylem.yon,neden:'sakatlik'};p.sakat=null;p.topal={oran:0.7,son:this.t+8};
          this.sakatlikBitir();return;}
        else{/* kalkar, kenara yürür; takım kısa süre eksik */
          p.eylem={ad:'kalkis',t:0,sure:1.2,kilit:true,fren:12,yon:p.eylem&&p.eylem.yon,neden:'sakatlik'};
          A.hedef={x:clamp(p.x,-PL+2,PL-2),z:p.z<MZ?-0.9:PW+0.9};evre('kalk');}}}
    else if(A.evre==='kalk'){if(!(p.eylem&&p.eylem.ad==='kalkis')){p.oyunda=false;p.cikiyor=true;p.tedavide=true;p.topal={oran:0.66,son:this.t+60};evre('cik');}}
    else if(A.evre==='cik'){
      /* sağlıkçılarla en yakın yan çizgiye yürür (~3 m/sn; sıkıştırılmış maç); 6 sn'den sonra oyun başlayabilir, o çizgiye varınca bekler */
      p.tx=A.hedef.x;p.tz=A.hedef.z;p.hizOran=0.45;p.bak=null;M.forEach((s,i)=>{s.tx=p.x+(i?0.7:-0.7);s.tz=p.z;s.hizOran=0.55;s.bak=p;});
      if(A.et>6)A.bekletir=false;
      /* çizgide: akış biter (sıradaki sakatlık başlayabilir), oyuncu dönüşü bekleyenler listesine (sakatlikAdim) */
      if(hyp(p.x-A.hedef.x,p.z-A.hedef.z)<0.6||A.et>14){M.forEach(s=>{s.gorev=null;});this.tedavideBekleyen.push({p,hedef:A.hedef,don:null});this.sakatlikBitir();}}
    else if(A.evre==='sedye'){
      /* sedye 2,2 m/sn ile en yakın yan çizgiye (sıkıştırılmış maç); oyuncu ve sağlıkçılar sedyeyle */
      const h=A.hedef,dx=h.x-p.x,dz=h.z-p.z,d=hyp(dx,dz),v=Math.min(d,2.2*dt);
      if(d>1e-3){p.x+=dx/d*v;p.z+=dz/d*v;}p.vx=p.vz=0;p.tx=p.x;p.tz=p.z;
      const S=this.sedye;S.x=p.x;S.z=p.z;
      M.forEach((s,i)=>{const yon=S.yon,uc=i?0.95:-0.95;s.tx=p.x+Math.cos(yon)*uc;s.tz=p.z+Math.sin(yon)*uc;s.hizOran=0.5;s.bak=p;});
      if(d<0.3){this.sedye=null;M.forEach(s=>{s.gorev=null;});evre('degis');}}
    else if(A.evre==='degis'){
      /* değişiklik hakkı varsa yedek girer (kalecide yedek kaleci); yoksa eksik — kaleci çıktıysa bir saha oyuncusu kaleye geçer. Süren bir
         (plandaki) değişiklik bitene dek bekler */
      if(this.degisiklik)return;
      if(p.eylem&&p.eylem.ad==='yerde')p.eylem={ad:'kalkis',t:0,sure:1.6,kilit:true,fren:12,yon:p.eylem.yon,neden:'sakatlik'};
      const deg=this.zorunluDegisiklik(p);
      if(!deg){if(p.rol==='GK')this.yenidenDizil(p);p.tx=this.tunel.x;p.tz=this.tunel.z-4;p.hizOran=0.3;}
      p.sakat=null;this.sakatlikBitir();}
  },
  /* tedavi edilen oyuncu kenarda bekler; oyun yeniden başladıktan sonra (tedaviDonus) hakemin işaretiyle döner: oyunda top 12 m'den uzaktayken ya da
     bir duruşta (kural: dönüş ancak oyun yeniden başladıktan sonra) */
  tedavidenDonus(){
    const L=this.tedavideBekleyen,b=this.ball;
    for(let i=L.length-1;i>=0;i--){const o=L[i],p=o.p;
      if(o.don==null&&this.phase==='play')o.don=this.t+MOTOR_AYAR.tedaviDonus[0]+this.skRast()*(MOTOR_AYAR.tedaviDonus[1]-MOTOR_AYAR.tedaviDonus[0]);
      p.tx=o.hedef.x;p.tz=o.hedef.z;p.hizOran=0.3;p.bak=b;
      if(o.don!=null&&this.t>=o.don&&(this.phase==='durus'||this.phase==='play'&&hyp(b.x-p.x,b.z-p.z)>12)){L.splice(i,1);
        p.oyunda=true;p.cikiyor=false;p.tedavide=false;p.sakat=null;p.eylem=null;p.topal={oran:0.68,son:this.t+10+this.skRast()*10};
        this.on('oyunaDondu',{p});}}
  },
  sakatlikBitir(){this.sakatlikAkis=null;},
  /* hakem oyunu durdurur: hakem topu topu son oynayan takıma (sahibi varsa onun takımı), topun yerinde; top ceza sahasındaysa savunan takımın
     kalecisine (2019; js/mac-kurallar.js hakemTopuBaslat: hakem topu bırakır, rakipler 4 m'de). Uzatmaya tedavide 60, sedyede 90 sn (gerçekte
     ~1–1,5 dk; sıkıştırılmış maçta duraklama ~20–30 sn sürer) */
  hakemTopuDurdur(p){
    const b=this.ball,takim=b.sahip?b.sahip.team:b.sonTakim!=null?b.sonTakim:1-p.team;
    const ek=p.sakat&&p.sakat.derece==='cikis'?90:60;this.uzatmaBirikim[this.half-1]+=ek;
    this.hakemTopuBaslat(takim,b.x,b.z,'sakatlik',{p,ek});
  },
  /* devre ya da maç bitti: süren tedavi kapanır (kenardaki oyuncu ikinci yarıda sahada), sedyedeki oyuncu çıkmış sayılır (değişiklik devre arasında) */
  sakatlikDevreSonu(){
    const A=this.sakatlikAkis;this.sedye=null;this.sakatlikSira.length=0;
    for(const s of this.kenar)if(s.kind==='saglikci'){s.gorev=null;s.poz=null;}
    for(const o of this.tedavideBekleyen){const p=o.p;p.oyunda=true;p.cikiyor=false;p.tedavide=false;p.sakat=null;}this.tedavideBekleyen.length=0;
    if(!A)return;const p=A.p;this.sakatlikAkis=null;
    if(p.sakat&&p.sakat.derece==='cikis'||A.evre==='sedye'||A.evre==='degis'){p.sakat=null;if(!this.zorunluDegisiklik(p,true)){p.oyunda=false;p.cikiyor=true;if(p.rol==='GK')this.yenidenDizil(p);}}
    else{p.oyunda=true;p.cikiyor=false;p.tedavide=false;p.sakat=null;if(p.eylem&&p.eylem.kilit)p.eylem=null;}
  }
});
