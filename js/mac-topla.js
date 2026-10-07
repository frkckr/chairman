/* ============ Chairman — maç motoru: topla oyuncu — vuruş, pas, şut, ilk dokunuş (mantık, çizimsiz) ============
   Sahibi: B akışı. Vuruş zinciri (hazırlık, geri salınım, temas, takip), şut / yerden pas / havadan vuruş, pas hedefinin tazelenmesi, topla karar
   (js/mac-karar.js seçenekleri), top sürme niyeti (p.surus; dokunuşları mac-hareket.js uygular), erişim türü, ilk dokunuş ve göğüs kontrolü,
   kafa vuruşu, gelişine karar, destek noktası ve derin koşu, korner ve serbest vuruşun ilk topu.
   MM3 (2026-10-03, bireysel karar zekâsı):
   - Tarama (taramaAdim): her oyuncu görüşüne göre ~0,7–2,5 sn'de bir omzunun üstünden bakar (top gelirken daha sık) ve herkesin yerini
     hafızaya alır; p.bakisYon başın yönüdür (çizim okur). Karar bu algıyla yapılır (mac-karar.js algilanan).
   - Vuruş: hedef vuruş anında ortak planla (pasPlani) tazelenir: ayağa buluşma, boşluğa, ara pasında koşucunun savunmacılardan 0,25 sn önce
     vardığı nokta, ortada hücumcunun varışı. Hata yön ve uzunluk olarak ayrıdır: yön hatası teknik, baskı, zayıf ayak, gövde hizası, gelişine
     vuruş, yorgunluk ve mesafeden; uzunluk hatası bununla ve mesafeyle orantılı, baskıda hafif eksik vuruş. Güçlü ayağın dış tarafındaki orta
     açılı hedefe çoğu zaman dış ayak (zayıf ayağı zorlamaz). Şut hedefi kaleciyi ve bloku tartar (sutPlani).
   - Yönlü ilk dokunuş: top gelirken plan yapılır (plan): bir sonraki işi açan boşluğa, koşu içinde dokunulur; hazır planla karar süresi
     0,10–0,20 sn. Hata: ağır dokunuş (top 2–4 m kaçar) ya da sekme. Yüzey topun yüksekliğinden (iç/dış/taban/uyluk; göğüs).
   - Tek vuruşla oyun (gelisineKarar): geri pas, bırakma, ara pası kontrol edip oynamaya karşı tartılır. Ver-kaç: kısa pastan sonra pasör
     baskıcısının arkasındaki boşluğa koşar (vk; topluAI hedefi uygular).
   Oyuncuya özel B verisi (tarama hafızası, plan, ver-kaç) oyuncu nesnesine alan eklemeden yan tabloda (bVeri) tutulur: sonradan eklenen alanlar
   nesnelerin biçimini (V8 gizli sınıfı) bozar ve bütün sıcak döngüleri yavaşlatır.
   Sözleşme alanları (TEKNIK_PLAN §8): vurus.stil/guc/tekDokunus, kontrol.yuzey/yon, kafa.tur, p.bakisYon, p.sonDokunus — rastlantısız. */
'use strict';
ayarEkle('B',{
  kararGecikme:[0.4,0.7],      // topu kontrol ettikten sonra karar süresi (sn): tempo yüksekse kısa (T2: 0,12–0,36 → 0,4–0,7; top ayakta ortancası 0,85 sn idi)
  ilerleme:0.04,               // topu ileri taşımanın metre başına değeri (puan): oyunun ne kadar dikine aktığı (birleştirme 2026-10-03: 0,036 → 0,027; T1: 0,04)
  risk:1.0,                    // top kaybından çekinme çarpanı (takımın risk ayarıyla çarpılır)
  surusKarar:[0.3,0.62],       // top sürerken yeniden karar aralığı
  vurusHizalama:0.36,          // vuruş için gövdenin hedefe en fazla sapması (rad); gelişine vuruşta 1,05, dış ayakla 0,85
  sutIstegi:5.0,               // şut seçeneğinin değer çarpanı: 14 m'ye kadar tam, 22 m'de etkisiz (birleştirme 2026-10-03: 3 → 5)
  ortaIstegi:4.0,              // orta ve geri çevirmenin değer çarpanı
  sutSapma:0.75,               // şut isabet hatası çarpanı (MM1: 0,8 → 0,7; beden blokları ve yorgunluk isabeti düşürdü; T1: 0,75, sakin oyunda şut daha az baskılı)
  pasSapma:1.0,                // pas yön hatası çarpanı
  sikisma:0.3,                 // pas hedefindeki alıcı sıkışıksa (rakip dibinde) o yerin değerinden düşülen pay
  geriPas:1.8,                 // geri pasın ek değeri (takımın 'sakin' ayarıyla çarpılır): topu tutma isteği (birleştirme 2026-10-03: 1,4 → 1,8)
  kontrolZorluk:0.7,           // ilk dokunuş hatası çarpanı (kontrolOlasiligi)
  tekVurus:0.0,                // tek vuruşla pasın, kontrol edip oynamaya göre ek değeri (puan) (MM3)
  verKacIstegi:0.35,           // kısa pastan sonra pasörün ver-kaç koşusuna çıkma olasılığı (baskıcısı yakınsa tam) (MM3)
  verKacDeger:0.4,             // ver-kaç koşusundaki pasöre dönüş pasının ek değeri (MM3)
  boslukDeger:0.1,             // alıcının önündeki boşluğa pasın ek değeri (MM3)
  ikinciTop:0.75,              // havadan pasta kaybın bedel çarpanı: kaybedilen hava topu çoğu zaman ikinci top olur (MM3)
  havaDeger:0.0,               // havadan pasın ek değeri (takımın 'direkt' ayarıyla +0–0,4) (MM3: eskiden −0,85; birleştirme 2026-10-03: −0,25 → 0)
  araDeger:0.3,                // ara pasının ek değeri (takımın 'direkt' ayarıyla 0,5–1,5 katı) (MM3)
  araDar:3,                    // dar pencereli ara pasının (alıcı savunmacıdan 0,25 sn'den az önde) değer cezası (puan / sn) (MM3)
  donusDeger:0.2,              // oyunun yönünü değiştiren pasın ek değeri (|Δz| ≥ 25 m) (MM3)
  ofsaytAlgi:1.4,              // ofsayt çizgisini görme hatası (m, görüş düşükse büyür): koşucunun çizgiyi geçip geçmediği yanılgısı (MM3)
  kosuIstegi:2.8,              // savunma arkasına derin koşuya çıkma sıklığı çarpanı (ara pası ve ofsayt; eskiden 1) (MM3; T1: 1,6 → 2,8)
  aliciPay:0.1,                // pas analizinde alıcının varış süresine eklenen pay (sn): varış modeli duran/dönen oyuncuda iyimser (MM3)
  uzaklastirDeger:0.0,         // uzaklaştırmanın taban değeri (baskıyla +1,1, ceza sahası yakınında +0,4; birleştirme 2026-10-03)
  hedefDeger:0.8,              // hedef forvete uzun topun ek değeri (takımın 'direkt' ayarıyla 0,4–1,4 katı; birleştirme 2026-10-03)
  /* T2 (2026-10-07, topla oyun) */
  devamAgirlik:0.6,            // pas değerinde alıcının devam değerinin oranın tehdidinden farkının payı (devamDegeri)
  devamHedef:0.4,              // hedef forvete uzun topta devam farkının ek çarpanı (değeri alan ve ikinci top belirler)
  sabir:[0.3,1.1],             // sabır eşiği (puan): topu tutmanın pasa göre ek değeri, takımın sakin/tempo ayarıyla bu aralıkta
  sabirSure:2.5,               // sabır eşiği topu tuttukça söner, bu kadar (sn) sonra sıfır
  devamPas:0.8,                // devam değerinde ileri pas ön puanının payı (ön puan tam analizden iyimser)
  bekleOran:0.8,               // yerinde bekleyen topun oranın tehdidinden koruduğu pay
  dusunHz:[5,8],               // topu tutarken düşünme sıklığı (1/sn; karar özelliğiyle): her anda seçenekler yeniden tartılır
  pasTol:[1.2,4,0.5],          // pas hatası toleransı: taban (m) + alıcının rakipten önce varma payı (sn) × katsayı; uzunluk hatasının payı
  ikinciTopHedef:0.3,          // hedef forvete uzun topta kaybedilen düelloda topun takımda kalma olasılığı (kaybın bedelini azaltır)
  araKalib:0.85                // ara pasının başarı olasılığı düzeltmesi (ölçülen; kök neden savunmacının varış modeli, T5)
});
/* vuruş stili (sözleşme: ic/dis/ust/asirtma/vole/yarimVole); vuruş anında topun yüksekliği ve şutun türüyle kesinleşir */
function vurusStili(sec,y){
  if(sec.yay==='asirtma')return 'asirtma';
  if(sec.ilk&&y>0.45)return 'vole';if(sec.ilk&&y>0.15)return 'yarimVole';
  if(sec.tur==='sut'||sec.tip==='hava'||sec.tur==='uzaklastir')return 'ust';
  return 'ic';}
Object.assign(Match.prototype,{
  /* topu alan oyuncunun karar süresi (sn): hazır planla (yönlü ilk dokunuş) çok kısa; yoksa takımın temposu, karar özelliği ve yorgunluk */
  kararSuresi(p){
    const pl=this.bVeri(p).plan;if(pl&&pl.hazir)return 0.1+0.1*(1-p.oz.karar);
    return lerp(MOTOR_AYAR.kararGecikme[1],MOTOR_AYAR.kararGecikme[0],this.taktik[p.team].tempo)+(1-p.oz.karar)*0.15+(p.yorgunluk||0)*0.12;
  },
  /* etrafa bakma (tarama): her oyuncu 2,5 − 1,8·görüş sn'de bir (top ona gelirken daha sık, topu sürerken daha seyrek) omzunun üstünden bakar,
     herkesin yerini ve hızını hafızaya alır. Baş: taramada gövdeden ±100°, yoksa topa (boyun ±80°). Rastlantısız; takımAI'dan önce */
  taramaAdim(dt){
    const b=this.ball,P=this.players,n=P.length,PI=Math.PI,kare=this.kare||0;
    for(let i=0;i<n;i++){const p=P[i];if(!p.oyunda||(i+kare)&1)continue;  /* her oyuncu iki karede bir */
      let per=2.5-1.8*p.oz.gorus;
      /* topu süren seyrek bakar; topu ayağının altında bekleten (T2) seçenek arar, daha sık bakar */
      if(b.hedefOyuncu===p)per*=0.55;else if(b.sahip===p)per*=p.tavir==='bekle'?0.5:1.25;
      const v=this.bVeri(p);let T=v.tara;
      if(!T){T=v.tara={t:0,bas:-9,yan:p.n%2?1:-1,ok:false,x:new Float64Array(n),z:new Float64Array(n),vx:new Float64Array(n),vz:new Float64Array(n)};
        T.t=this.t-((p.n*0.37+p.team*0.53)%1)*per;this.taramaKaydi(T);}
      if(this.t-T.t>=per){this.taramaKaydi(T);T.t=this.t;T.bas=this.t;T.yan=-T.yan;}
      let by;
      if(this.t-T.bas<0.28)by=p.yon+T.yan*1.75;
      else{let f=Math.atan2(b.z-p.z,b.x-p.x)-p.yon;if(f>PI)f-=2*PI;else if(f<-PI)f+=2*PI;by=p.yon+(f>1.4?1.4:f<-1.4?-1.4:f);}
      if(by>PI)by-=2*PI;else if(by<-PI)by+=2*PI;
      p.bakisYon=by;}
  },
  /* oyuncuya özel B verisi: {tara: tarama hafızası, plan: yönlü ilk dokunuş planı, vk: ver-kaç koşusu, gur: kararın sahiplik boyu sapması (T2),
     yakinR/yakinNo: en yakın rakibin önceki uzaklığı ve sahiplik (T2 olay)} */
  bVeri(p){let M=this._bv;if(!M)M=this._bv=new Map();let v=M.get(p);if(!v){v={tara:null,plan:null,vk:null,gur:null,yakinR:9,yakinNo:-1};M.set(p,v);}return v;},
  /* düşünme aralığı (T2): topu tutarken seçenekler 5–8 Hz'de yeniden tartılır (karar özelliği yüksek oyuncu daha sık) */
  dusunmeAraligi(p){const H=MOTOR_AYAR.dusunHz;return 1/(H[0]+(H[1]-H[0])*p.oz.karar);},
  taramaKaydi(T){const P=this.players;for(let j=0;j<P.length;j++){const q=P[j];T.x[j]=q.x;T.z[j]=q.z;T.vx[j]=q.vx;T.vz[j]=q.vz;}T.ok=true;},
  /* vuruş zinciri. sec: {tur, hx, hz, tip, alici, ilk (gelişine), mod (hedef tazeleme: ayak/bosluk/ara), varisHizi, T, hy, yay}.
     Önce hazırlık: hedefe dön, topu vuran ayağın önüne al */
  vurusBaslat(p,sec){
    const b=this.ball;let ox=b.x,oz=b.z;
    if(sec.ilk&&hyp(b.vx,b.vz)>2&&hyp(b.x-p.x,b.z-p.z)>1.2){const k=this.yakalamaNoktasi(p,1.0);ox=k.x;oz=k.z;}
    const a=Math.atan2(sec.hz-oz,sec.hx-ox),f=aciFark(a,p.yon);
    /* ayak: tercih edilen. Hedef güçlü ayağın dış tarafında ve açı orta büyüklükteyse çoğu zaman dış ayak (zayıf ayağı zorlamaz);
       çok ters yandaysa diğer ayak (iki ayaklı değilse hatası büyük). f > 0: hedef sağda */
    let ayak=p.ayak==='iki'?(f>0?'sol':'sag'):p.ayak,stil=null;
    if(p.ayak!=='iki'){const dis=p.ayak==='sag'?f>0:f<0;
      if(dis&&sec.tur!=='sut'&&sec.tur!=='uzaklastir'&&(sec.tip||'yer')==='yer'&&Math.abs(f)>0.45&&Math.abs(f)<1.4&&this.rast()<0.3+0.5*p.oz.pas)stil='dis';
      else if(Math.abs(f)>0.9&&this.rast()<0.45)ayak=f>0?'sol':'sag';}
    p.eylem={ad:'vurus',faz:'hazirlik',t:0,ft:0,sec,ayak,stil:stil||vurusStili(sec,b.y),guc:0,tekDokunus:!!sec.tekDokunus,
      geri:sec.tur==='sut'||sec.tip==='hava'||sec.tur==='uzaklastir'?0.17:0.11};
    p.surus=null;
  },
  vurusIlerle(p,e,dt){
    const b=this.ball,sec=e.sec;e.ft+=dt;
    if(e.faz==='hazirlik'){
      /* hedef hazırlıkta tazelenir (gelişine vuruşta yalnız vuruş anında) */
      if(sec.guncelle&&!sec.ilk)this.hedefGuncelle(p,sec);
      /* gelişine vuruşta yön karşılama noktasından ölçülür */
      const topHiz=hyp(b.vx,b.vz);let k=null;if(sec.ilk&&topHiz>2)k=this.yakalamaNoktasi(p,1.0);
      const a=k?Math.atan2(sec.hz-k.z,sec.hx-k.x):Math.atan2(sec.hz-b.z,sec.hx-b.x),c=Math.cos(a),s=Math.sin(a),yan=e.ayak==='sag'?1:-1;
      /* vuran ayak topun arkasında, destek ayağı yanında: gövde topun biraz gerisinde ve yanında */
      const on=sec.ilk?0.42:0.34,px=b.x-c*on-(-s)*0.13*yan,pz=b.z-s*on-c*0.13*yan;
      if(k){/* gelişine: topun yoluna gir */p.tx=k.x-c*on;p.tz=k.z-s*on;}
      else{p.tx=px+b.vx*0.12;p.tz=pz+b.vz*0.12;}
      p.hizOran=1;p.yonHedef=a;p.bak=null;this.eforVer(p,k||baskiAltinda(this,p)>0.3?1:0.6);   /* T1: baskısız duran topa sakin yaklaşır */
      const sapma=Math.abs(aciFark(a,p.yon)),sinir=sec.ilk?1.05:e.stil==='dis'?0.85:MOTOR_AYAR.vurusHizalama*(sec.tur!=='sut'&&sec.tur!=='uzaklastir'?1.35:1);
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
      /* gelişine: top ayağın hizasını geçerken vur (salınım bitmeden önce gelirse beklemez) */
      let gecti=false;if(e.sabit&&e.ft>=0.05){const ax=p.x+Math.cos(p.yon)*0.3,az=p.z+Math.sin(p.yon)*0.3;gecti=(ax-b.x)*b.vx+(az-b.z)*b.vz<=0;}
      if(e.ft>=e.geri||gecti){
        const ayakD=hyp(b.x-(p.x+Math.cos(p.yon)*0.3),b.z-(p.z+Math.sin(p.yon)*0.3));
        if(ayakD<0.85&&b.y<1.2&&!b.tasiyan&&this.phase!=='goal'){this.vurusYap(p,e);e.faz='takip';e.ft=0;}
        else{p.eylem=null;p.yonHedef=null;p.kararT=0;}
      }
    }else if(e.ft>=0.26){p.eylem=null;p.yonHedef=null;}
  },
  /* pas hattının ilk metrelerinde rakip bacağı var mı */
  hatKapali(p,a){const b=this.ball,ux=Math.cos(a),uz=Math.sin(a);
    for(const o of this.teams[1-p.team]){if(!o.oyunda)continue;if(segD(o.x,o.z,b.x,b.z,b.x+ux*4,b.z+uz*4)<0.7)return true;}return false;},
  /* topa vur: hedef son kez tazelenir, gövde hizası ve stil kesinleşir; türüne göre şut, yerden pas ya da havadan vuruş */
  vurusYap(p,e){
    const sec=e.sec,b=this.ball;
    if(sec.guncelle&&sec.tur!=='sut')this.hedefGuncelle(p,sec);
    if(sec.tur!=='sut'){const sap=Math.abs(aciFark(Math.atan2(sec.hz-b.z,sec.hx-b.x),p.yon));
      /* dış ayak ve gelişine iç ayak, gövdeyi tam çevirmeden açılı vurur */
      e.hizalanma=e.stil==='dis'?Math.max(0,sap-0.6):sec.ilk?Math.max(0,sap-0.4):sap;}
    if(e.stil!=='asirtma'&&e.stil!=='dis'){if(b.y>0.45)e.stil='vole';else if(b.y>0.15&&sec.ilk)e.stil='yarimVole';}
    if(sec.tur==='sut')this.sutVur(p,e);
    else if((sec.tip||'yer')==='yer')this.yerPasVur(p,e);
    else this.havaPasVur(p,e);
    p.sonDokunus={t:this.t,tur:'vurus',ayak:e.ayak,yuzey:e.stil||'ic'};
  },
  /* vuruşun yön hatası (rad, standart sapma): teknik, baskı, zayıf ayak (dış ayak daha az), gövde hizası, gelişine ve havada vuruş,
     yorgunluk; pasta mesafe de */
  vurusHatasi(p,e,L){
    const sec=e.sec,oz=p.oz,baski=baskiAltinda(this,p),sut=sec.tur==='sut';
    const ayakK=e.stil==='dis'?1.22:p.ayak!=='iki'&&e.ayak!==p.ayak?1.7:1,hizalanma=e.hizalanma||0;
    const vole=e.stil==='vole'?(sut?1.3:1.5):e.stil==='yarimVole'?(sut?1.12:1.2):1;
    return(0.028+0.075*(1-(sut?oz.sut:oz.pas)))*(1+baski*0.9)*ayakK*(1+hizalanma*0.9)*(sec.ilk?1.35:1)*vole*(1+0.35*(p.yorgunluk||0))*(sut?1:1+(L||0)/200);
  },
  /* şut: hedef ve tür sutPlani'ndan (kaleci, blok, isabet olasılığı); penaltıda seçilen köşe. b.sut'a hedef, tür ve vurucunun gövde
     ipucu yazılır (ipucu.yan: gövdenin gösterdiği taraf, z'nin işareti; guven: ne kadar okunur — iyi şutçu az belli eder, bazen aldatır) */
  sutVur(p,e){
    const b=this.ball,sec=e.sec,oz=p.oz,d=this.dir[p.team],bx=b.x,bz=b.z,gx=d*PL;
    const L=hyp(gx-bx,MZ-bz)||1;
    let sd=this.vurusHatasi(p,e,L)*MOTOR_AYAR.sutSapma*(1+Math.max(0,(L-12)/25));
    let hz,hy,v,egri=0,tur,kz=1,ky=1;
    if(sec.penalti){sd*=0.55;hz=sec.hz;hy=this.rast()<0.62?0.25+this.rast()*0.6:0.9+this.rast()*1.2;v=16+(0.5+this.rast()*0.3)*14*(0.85+oz.sut*0.25);tur='plase';}
    else{const pl=sutPlani(this,p,bx,bz,sd,{serbest:sec.serbest});hz=MZ+pl.zt;hy=pl.yt;v=pl.v;tur=pl.tur;kz=pl.kz;ky=pl.ky;
      /* falso: top kalenin dışından içeri döner */
      if(tur==='falso')egri=-(Math.sign(pl.zt)||1)*d*(0.08+oz.sut*0.05);}
    if(b.y>0.4)v*=0.9;
    const hz0=hz,hy0=hy,T=(hyp(gx-bx,hz-bz)||1)/v*1.06*(tur==='falso'?1.08:1);
    /* alçak sert şutta üst dönüş (top yere doğru iner), yüksek şutta az; düşen serbest vuruşta güçlü üst dönüş, aşırtmada hafif kesik */
    const ust=tur==='dusen'?0.09:tur==='asirtma'?-0.02:hy<0.9?0.05+clamp((v-16)/14,0,1)*0.05:0.02;
    /* hata: yön (atış hattı etrafında dönme) ve yükseklik; uzaktan şut biraz yükselir */
    const ah=this.normal()*sd*kz,ca=Math.cos(ah),sa=Math.sin(ah),rx=gx-bx,rz=hz-bz;
    const hx=bx+rx*ca-rz*sa;hz=bz+rx*sa+rz*ca;
    hy+=this.normal()*sd*ky*L*0.35+Math.max(0,L-18)*0.01;
    const c=this.havadanCoz(bx,Math.max(b.y,0.11),bz,hx,hy,hz,T,egri,ust);
    b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.y=Math.max(b.y,0.11);b.egri=egri;b.ust=ust;
    if(e.stil!=='vole'&&e.stil!=='yarimVole')e.stil=tur==='asirtma'?'asirtma':tur==='sert'||tur==='dusen'?'ust':'ic';
    e.guc=clamp(v/32,0,1);
    const aldat=this.rast()<0.08+0.25*oz.sut;
    this.vurusSon(p,e,{hx,hz,L,bx,bz,tip:'sut',sut:{hedefZ:hz0,hedefY:hy0,tur,ipucu:{yan:(Math.sign(hz0-MZ)||1)*(aldat?-1:1),guven:clamp(0.85-0.7*oz.sut,0.15,0.8)}}});
  },
  /* yerden pas: ortak plandaki varış hızından ilk hız; yön hatası ve uzunluk hatası (mesafe oranı; baskıda hafif eksik) */
  yerPasVur(p,e){
    const b=this.ball,sec=e.sec;
    const bx=b.x,bz=b.z;let hx=sec.hx,hz=sec.hz;
    const L=hyp(hx-bx,hz-bz)||1,sd=this.vurusHatasi(p,e,L)*MOTOR_AYAR.pasSapma,baski=baskiAltinda(this,p);
    const varis=sec.varisHizi||pasVarisHizi(L);
    const ah=this.normal()*sd,ca=Math.cos(ah),sa=Math.sin(ah),rx=hx-bx,rz=hz-bz;
    hx=bx+rx*ca-rz*sa;hz=bz+rx*sa+rz*ca;
    const eL=this.normal()*sd*(1+L/40)-0.035*baski,v=pasPlani(this,Math.max(0.5,L*(1+eL)),'yer',varis).v0;
    b.vx=(hx-bx)/L*v;b.vz=(hz-bz)/L*v;b.vy=0;b.y=Math.min(b.y,0.02);b.egri=0;b.ust=0;
    e.guc=clamp(v/29,0,1);if(v>20&&e.stil==='ic')e.stil='ust';
    this.vurusSon(p,e,{hx,hz,L,bx,bz,tip:'yer'});
  },
  /* havadan: pas, aşırtma, uzun top, orta, korner, uzaklaştırma, degaj. Uçuş süresi ortak plandan */
  havaPasVur(p,e){
    const b=this.ball,sec=e.sec;
    const bx=b.x,bz=b.z;let hx=sec.hx,hz=sec.hz,hy=0;
    const L=hyp(hx-bx,hz-bz)||1,sd=this.vurusHatasi(p,e,L),baski=baskiAltinda(this,p);let egri=0,ust=0;
    const T=sec.T||(sec.tur==='orta'?0.95+L/32:sec.tur==='uzaklastir'?1.3+L/30:pasPlani(this,L,'hava',0,sec.yay).T);
    /* orta ve korner hedefteki oyuncunun baş (kesmede göğüs-baş) yüksekliğine gönderilir */
    hy=sec.hy!=null?sec.hy:(sec.tur==='orta'||sec.tur==='korner')?1.7:0;
    if(sec.tur==='orta'||sec.tur==='korner')egri=(e.ayak==='sag'?-1:1)*(sec.yay==='kesme'?0.08+this.rast()*0.06:0.05+this.rast()*0.07);
    /* havadan pas ve orta kesik dönüşle gider: havada biraz asılı kalır, yerde frenlenir */
    ust=sec.tur==='uzaklastir'||sec.tur==='degaj'?0:sec.yay==='asirtma'?-0.06:-0.04;
    const ah=this.normal()*sd*1.6,ca=Math.cos(ah),sa=Math.sin(ah),rx=hx-bx,rz=hz-bz;
    hx=bx+rx*ca-rz*sa;hz=bz+rx*sa+rz*ca;
    const eL=this.normal()*sd*1.3-0.03*baski;
    hx=bx+(hx-bx)*(1+eL);hz=bz+(hz-bz)*(1+eL);
    const c=this.havadanCoz(bx,Math.max(b.y,0.11),bz,hx,hy,hz,T,egri,ust);
    b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.y=Math.max(b.y,0.11);b.egri=egri;b.ust=ust;
    e.guc=clamp(hyp3(c.vx,c.vy,c.vz)/30,0,1);
    this.vurusSon(p,e,{hx,hz,L,bx,bz,tip:'hava'});
  },
  /* vuruşun sonu: top ayaktan çıktı; dokunuş, pas/şut kaydı ve olaylar; kısa pastan sonra ver-kaç koşusu */
  vurusSon(p,e,k){
    const b=this.ball,sec=e.sec,{hx,hz,L,bx,bz,tip}=k;
    b.sahip=null;b.tasiyan=null;p.kickCd=0.3;p.surus=null;
    this.dokunus(p,true);
    b.hedefOyuncu=sec.alici||null;b.pasHedef=sec.alici?{x:hx,z:hz,tur:sec.tur}:null;
    const tur=sec.tur;
    if(tur==='sut'){b.sut={team:p.team,by:p,gkDone:false,cerceve:this.cerceveyeGider(p.team),xg:sec.xg||0,t:this.t};if(k.sut)Object.assign(b.sut,k.sut);this.ist.sut[p.team]++;
      this.ofsaytPasAni(p);this.on('shot',{p,dist:L,xg:sec.xg||0});}
    else if(tur==='pas'||tur==='ara'||tur==='uzun'||tur==='orta'||tur==='geriCevir'||tur==='kisa'){
      this.pasSay(p,sec.hx,sec.hz,L,tur);this.ofsaytPasAni(p);
      this.on(tur==='orta'?'cross':'pass',{p,q:sec.alici,long:L>=32,tur,L,x0:bx,z0:bz,hx,hz,tip,ilk:!!sec.ilk});
      if(tur==='orta'||tur==='geriCevir')this.ortaBlok(p);
      if(tur==='pas'&&tip==='yer'&&sec.alici&&L>=5&&L<=22&&p.rol!=='GK')this.verKacBaslat(p,sec.alici);}
    else if(tur==='uzaklastir'||tur==='degaj')this.on(tur==='degaj'?'gkkick':'clear',{p});
    else if(tur==='serbest'||tur==='korner'||tur==='kaleVurusu'){this.pasSay(p,sec.hx,sec.hz,L,tur);this.ofsaytPasAni(p);}
  },
  /* ver-kaç: pasör baskıcısının arkasındaki boşluğa 8–12 m koşar (baskıcı yakınsa daha istekli) */
  verKacBaslat(p,q){
    const d=this.dir[p.team],pu=p.x*d;if(pu<-25||pu>PL-14)return;
    const yr=enYakinRakip(this,p.x,p.z,p.team),yakin=yr.o&&yr.d<6;
    if(this.rast()>=MOTOR_AYAR.verKacIstegi*(0.5+0.5*p.oz.karar)*(yakin?1:0.4))return;
    const wz=yakin?(p.z-yr.o.z)/(yr.d||1)*2.5:0,u=Math.min(pu+8+this.rast()*4,ofsaytCizgisi(this,p.team)+2,PL-8);
    this.bVeri(p).vk={q,x:u*d,z:clamp(p.z+wz,3,PW-3),son:this.t+2.8};this.on('kosu',{p,verKac:true});
  },
  /* ver-kaç koşusunu sürdür: top arkadaşta ya da aralarında yoldayken (takimAI'dan sonra hedefi uygular); dönüş pası gelirken kovala yönetir */
  verKacAdim(){
    const b=this.ball;
    const M=this._bv;if(!M)return;
    for(const p of this.players){const bv=M.get(p),v=bv&&bv.vk;if(!v)continue;
      const devam=p.oyunda&&this.t<v.son&&!(p.eylem&&p.eylem.kilit)&&(b.sahip===v.q||(!b.sahip&&!b.tasiyan&&b.sonTakim===p.team&&(b.sonDokunan===p||b.sonDokunan===v.q)));
      if(!devam||hyp(p.x-v.x,p.z-v.z)<1.2){bv.vk=null;continue;}
      if(b.hedefOyuncu===p||(p.eylem&&p.eylem.ad==='vurus'))continue;
      p.tx=v.x;p.tz=v.z;p.hizOran=1;p.bak=b;p.yonHedef=null;this.eforVer(p,1);}
  },
  /* pasın hedefi hazırlıkta ve vuruş anında tazelenir (ortak plan: aynı varış hızı / uçuş süresi). ayak: alıcının koşusunu ~1 sn sürdürdüğü
     buluşma noktası; bosluk: onun önündeki boşluk; ara: koşu çizgisinde alıcının her savunmacıdan 0,25 sn önce vardığı ilk nokta.
     Havadan orta ve korner tazelenmez: hedef karar anında hücumcunun koşusunun sonuna konur, gövde oynayan hedefi kovalamaz */
  hedefGuncelle(p,sec){
    const q=sec.alici,b=this.ball;if(!q||!q.oyunda)return;
    const mod=sec.mod||'ayak',d=this.dir[p.team];
    if(mod==='ara'){const h=araNoktasi(this,q,b.x,b.z,0,sec.varisHizi,ofsaytCizgisi(this,p.team),d);if(h){sec.hx=h.x;sec.hz=h.z;}return;}
    const mt=bulusmaNoktasi(this,q,b.x,b.z,0,sec.tip||'yer',sec.varisHizi,sec.yay),es=mod==='bosluk'?(sec.es||0):0;
    sec.hx=clamp(mt.x+(sec.ex||0)*es,-PL+0.5,PL-0.5);sec.hz=clamp(mt.z+(sec.ez||0)*es,0.8,PW-0.8);
    if(sec.tip==='hava'&&sec.T)sec.T=havaSure(hyp(sec.hx-b.x,sec.hz-b.z),sec.yay);
  },
  /* ============ topla oyuncu: karar, top sürme, koruma ============ */
  topluAI(dt){
    this.verKacAdim();
    const b=this.ball,p=b.sahip;if(!p||b.tasiyan)return;
    if(!p.oyunda){b.sahip=null;return;}
    const d=hyp(b.x-p.x,b.z-p.z);
    if(d>3.2||(d>1.6&&hyp(b.vx,b.vz)>9)){b.sahip=null;p.surus=null;return;}
    if(p.eylem)return;
    p.kararT-=dt;
    /* T2 olay: rakip 2,5 m'ye girdi — bir sonraki düşünme anını beklemeden yeniden bak (yeni sahiplikte ilk karede yalnız kaydedilir) */
    const v=this.bVeri(p),yr=enYakinRakip(this,p.x,p.z,p.team).d;
    if(yr<2.5&&v.yakinR>=2.5&&v.yakinNo===this.sahiplikNo&&p.kararT>0)p.kararT=0;
    v.yakinR=yr;v.yakinNo=this.sahiplikNo;
    if(p.kararT<=0&&d<1.1&&b.y<0.5){const s=kararVer(this,p);this.secenekUygula(p,s);if(p.eylem)return;}
    this.surusIlerle(p,dt);
  },
  secenekUygula(p,s){
    const b=this.ball,A=MOTOR_AYAR;
    switch(s.tur){
      case 'sut':this.vurusBaslat(p,{tur:'sut',hx:this.dir[p.team]*PL,hz:MZ,xg:s.xg});break;
      case 'pas':case 'ara':case 'uzun':case 'orta':case 'geriCevir':
        this.vurusBaslat(p,{tur:s.tur,hx:s.hx,hz:s.hz,tip:s.tip,alici:s.alici,varisHizi:s.varis,T:s.T,hy:s.hy,yay:s.yay,mod:s.mod,ex:s.ex,ez:s.ez,es:s.es,guncelle:!!s.mod,
          P:s.P,Pk:s.Pk,alt:s.alt});break;   /* P, Pk, alt: karar anındaki tahmin, salt okunur (ölçüm: araclar/olcumler/p-kalib.js) */
      case 'uzaklastir':{/* uzağa ve kanada, çoğu zaman hedefsiz; baskı altında ayağın kenarından kaçıp taça ya da kornere gidebilir */
        const d=this.dir[p.team],yan=p.z<MZ?-1:1,kacti=this.rast()<0.25+baskiAltinda(this,p)*0.25;
        let hx=clamp(p.x+d*(28+this.rast()*22),-PL+4,PL-4),hz=p.z+yan*(10+this.rast()*26);
        if(kacti){hx=p.x+d*(this.rast()*14-4);hz=p.z+yan*(18+this.rast()*20);}
        this.vurusBaslat(p,{tur:'uzaklastir',hx,hz,tip:'hava'});break;}
      case 'koru':{const {o}=enYakinRakip(this,p.x,p.z,p.team);const a=o?Math.atan2(p.z-o.z,p.x-o.x):p.yon;p.surus={yon:a,hiz:0.22,koru:true};
        p.kararT=this.dusunmeAraligi(p);break;}
      /* T2: taşıma — yön ve uzunluk seçimden; uzun taşıma daha hızlı. Bekleme — top ayağın altında, baş yukarıda */
      case 'tasi':p.surus={yon:s.yon,hiz:clamp(0.55+0.035*s.mesafe,0.55,0.92)};p.kararT=this.dusunmeAraligi(p);break;
      case 'bekle':p.surus={yon:p.yon,hiz:0.1,bekle:true};p.kararT=this.dusunmeAraligi(p);break;
      default:{p.surus={yon:s.yon!=null?s.yon:p.yon,hiz:s.hiz||0.88};p.kararT=lerp(A.surusKarar[0],A.surusKarar[1],this.rast());}
    }
  },
  /* oyuncu topa ne ile erişir: ayak, göğüs, kafa ya da (kaleci) el */
  erisim(p,d){
    const b=this.ball,y=b.y,kafaY=kafaYuksekligi(p);
    if(this.elErisimi(p,d,y))return 'el';
    if(d<0.6&&y<0.8)return 'ayak';
    if(d<0.5&&y>=0.8&&y<1.55)return 'gogus';
    if(d<0.62&&y>=1.45&&y<kafaY&&b.vy<3){
      /* ceza sahaları dışında, rakipsiz ve yavaşça düşen topu kafayla oynamaz: göğse ya da ayağa indirir */
      if(b.vy<0&&hyp(b.vx,b.vz)<9&&!(Math.abs(b.x)>PL-CEZA_U-2&&Math.abs(b.z-MZ)<CEZA_W+2)){
        let rakip=false;for(const o of this.teams[1-p.team])if(o.oyunda&&hyp(o.x-b.x,o.z-b.z)<2.5){rakip=true;break;}
        if(!rakip)return null;}
      return 'kafa';}
    return null;
  },
  /* temasın sonu: topa erişen oyuncu dokunur (kontrol, göğüs; sert gelen rakip topu bacaktan seker) */
  topaDokun(kazanan){
    const b=this.ball;
    const p=kazanan.p,e=p.eylem;
    if(e&&e.ad==='vurus'&&e.faz!=='takip')return; /* vuruş zinciri topu kendisi alacak */
    /* sert gelen topa uzanan rakip çoğu zaman kontrol edemez: top bacağından seker */
    const hiz=hyp(b.vx,b.vz),rakipTopu=b.sonTakim!==p.team&&b.hedefOyuncu!==p;
    if(rakipTopu&&hiz>8&&kazanan.d>0.28&&kazanan.tur==='ayak'&&this.rast()<clamp(0.35+(hiz-8)*0.05,0,0.8)){this.sekme(p);return;}
    if(kazanan.tur==='gogus')this.gogusKontrol(p);else this.kontrolEt(p);
  },
  /* dokunan ayak ve yüzey (rastlantısız): topun gövdeye göre yanı, yüksekliği ve dokunuş yönü. Sağ yön (−sin, cos) */
  kontrolYuzeyi(p,a,h){
    const b=this.ball,c=Math.cos(p.yon),s=Math.sin(p.yon),yan=(b.x-p.x)*-s+(b.z-p.z)*c,tl=Math.cos(a)*-s+Math.sin(a)*c;
    const ayak=Math.abs(yan)<0.05?(p.ayak==='sol'?'sol':'sag'):yan>0?'sag':'sol';
    const yuzey=b.y>=0.5?'uyluk':h<1.3&&Math.abs(aciFark(a,p.yon))>2.2?'taban':(ayak==='sag'?tl>0.35:tl<-0.35)?'dis':'ic';
    return{ayak,yuzey};
  },
  /* ilk dokunuş: top ayağa gelir. Planlıysa (gelisineKarar) bir sonraki işi açan boşluğa, koşu içinde; değilse boşluğa ve hücum yönüne.
     Başarı kontrolOlasiligi'ndan (hız, yükseklik, baskı, dönüş açısı, teknik). Hata: ağır dokunuş (top 2–4 m kaçar) ya da sekme */
  kontrolEt(p){
    const b=this.ball,v=hyp3(b.vx,b.vz,b.vy),baski=baskiAltinda(this,p),teknik=p.oz.surus*0.55+p.oz.pas*0.45;
    const bv=this.bVeri(p),pl=bv.plan&&bv.plan.surum===b.surum?bv.plan:null;
    const a=pl?pl.yon:this.kontrolYonu(p),gx=b.vx,gz=b.vz,aci=v>1?Math.abs(aciFark(a,Math.atan2(gz,gx))):0;
    const P=kontrolOlasiligi(p,v,b.y,baski,aci),r=this.rast();
    if(r<P){
      /* iyi dokunuş: planlı ve gidiş yönündeyse koşu içinde (top bir adım önde), değilse yumuşak; gelen hızın bir kısmı kalır */
      const ayni=Math.abs(aciFark(a,p.yon))<1.2,h=pl&&ayni?clamp(p.spd*0.85+0.6,1.0,5.5):clamp(p.spd*0.75,0,4.5)*(pl?0.6:1)+0.5;
      const k=clamp((1-teknik)*0.18+baski*0.05+(1-P)*0.4,0.02,0.3),y=this.kontrolYuzeyi(p,a,h);
      b.vx=Math.cos(a)*h+gx*k;b.vz=Math.sin(a)*h+gz*k;b.vy=0;b.y=Math.min(b.y,0.05);b.egri=0;b.ust=0;this.govdedenGecmesin(p);
      if(pl)pl.hazir=true;
      this.dokunus(p,true);this.sahipYap(p);p.eylem={ad:'kontrol',t:0,sure:pl?0.15:0.22,yuzey:y.yuzey,yon:a};p.kickCd=0.06;
      p.sonDokunus={t:this.t,tur:'kontrol',ayak:y.ayak,yuzey:y.yuzey};
      this.on('ilkDokunus',{p,iyi:true,tur:'ayak',plan:!!pl});
      /* topu alırken arkasına yapışan rakip itebilir ya da tutabilir */
      if(this.phase==='play')this.sirtFaulu(p);}
    else{/* kötü dokunuş: ağır (top istenen yöne 2–4 m kaçar) ya da sekme (gelen hızın bir kısmı sürer, ayaktan rastgele yöne) */
      const agir=r<P+(1-P)*0.6,y=this.kontrolYuzeyi(p,a,3);
      if(agir){const ra=a+this.normal()*0.45,h=Math.sqrt(2*(this.R+0.3)*(2+this.rast()*2));b.vx=gx*0.12+Math.cos(ra)*h;b.vz=gz*0.12+Math.sin(ra)*h;b.vy=0;b.y=Math.min(b.y,0.05);}
      else{const ra=a+this.normal()*1.3,h=1.2+v*0.12;b.vx=gx*0.3+Math.cos(ra)*h;b.vz=gz*0.3+Math.sin(ra)*h;b.vy=b.y>0.3?1+this.rast()*2:0;}
      b.ust=0;b.egri=0;this.govdedenGecmesin(p);
      this.dokunus(p,false);if(b.sahip===p)b.sahip=null;p.eylem={ad:'kontrol',t:0,sure:0.3,kotu:true,agir,yuzey:y.yuzey,yon:a};p.kickCd=agir?0.24:0.32;
      p.sonDokunus={t:this.t,tur:'kontrol',ayak:y.ayak,yuzey:y.yuzey};
      this.on('kotuKontrol',{p,agir});this.on('ilkDokunus',{p,iyi:false,tur:'ayak',agir});}
    bv.plan=null;
  },
  /* dokunuş topu gövdenin içinden geçirecekse (gövde topun yolunun hemen üstünde) top yavaş kalır: taban ya da iç ayakla yanından çekilir */
  govdedenGecmesin(p){
    const b=this.ball,v=hyp(b.vx,b.vz);if(v<2.6)return;
    const rx=p.x-b.x,rz=p.z-b.z,on=(rx*b.vx+rz*b.vz)/v,yan=Math.abs(rx*b.vz-rz*b.vx)/v;
    if(on>0&&yan<0.35){const k=2.6/v;b.vx*=k;b.vz*=k;}
  },
  gogusKontrol(p){
    const b=this.ball,baski=baskiAltinda(this,p),iyi=this.rast()<clamp(0.9-baski*0.2+(p.oz.surus-0.6)*0.3,0.4,0.97);
    const bv=this.bVeri(p),pl=bv.plan&&bv.plan.surum===b.surum?bv.plan:null,a=pl?pl.yon:this.kontrolYonu(p);
    b.vx=Math.cos(a)*(iyi?0.8:2.5)+(iyi?0:this.normal()*1.5);b.vz=Math.sin(a)*(iyi?0.8:2.5)+(iyi?0:this.normal()*1.5);b.vy=iyi?-0.5:1.2;
    if(pl&&iyi)pl.hazir=true;
    this.dokunus(p,true);if(iyi)this.sahipYap(p);else if(b.sahip===p)b.sahip=null;
    p.eylem={ad:'gogus',t:0,sure:0.4,yuzey:'gogus',yon:a};p.kickCd=iyi?0.18:0.35;
    p.sonDokunus={t:this.t,tur:'gogus',ayak:null,yuzey:'gogus'};this.on('ilkDokunus',{p,iyi,tur:'gogus'});
    bv.plan=null;
  },
  /* ilk dokunuşla top nereye (plan yoksa): boşluğa ve hücum yönüne, en yakın rakipten uzağa */
  kontrolYonu(p){
    const d=this.dir[p.team],{o,d:od}=enYakinRakip(this,p.x,p.z,p.team);
    let x=d*1.0,z=(MZ-p.z)*0.01;
    if(o&&od<6){x+=(p.x-o.x)/od*1.2*(6-od)/6;z+=(p.z-o.z)/od*1.2*(6-od)/6;}
    const a=Math.atan2(z,x),f=aciFark(a,p.yon);return aciNorm(p.yon+clamp(f,-1.2,1.2));
  },
  /* yönlü ilk dokunuş planı: karşılama noktasından 8 yön; boşluk (rakiplerin oraya varışı, dokunuştan sonra), ilerleme, kontrol sonrası en iyi
     pasın yönü ve dokunuşun zorluğu (kontrolOlasiligi) tartılır */
  dokunusPlani(p,k,s,hedef){
    const b=this.ball,d=this.dir[p.team],gelA=Math.atan2(b.vz,b.vx),v=s.v||hyp(b.vx,b.vz),rakip=this.teams[1-p.team];
    let dd=99;for(const o of rakip)if(o.oyunda)dd=Math.min(dd,hyp(o.x-k.x,o.z-k.z)-o.maxSpd*k.t*0.6);
    const baski=clamp((4.5-dd)/3.5,0,1),hA=hedef?Math.atan2(hedef.z-k.z,hedef.x-k.x):null;
    let en=null,enP=-1e9;
    for(let j=0;j<8;j++){const a=(d>0?0:Math.PI)+j*Math.PI/4,x=k.x+Math.cos(a)*1.8,z=k.z+Math.sin(a)*1.8;
      if(Math.abs(x)>PL-0.6||z<0.6||z>PW-0.6)continue;
      let bos=1.5;for(const o of rakip){if(!o.oyunda)continue;const t=varisZamani(o,x,z,0.75,0.2)-(k.t+0.45);if(t<bos)bos=t;}
      const pk=kontrolOlasiligi(p,v,s.y,baski,Math.abs(aciFark(a,gelA)));
      const puan=Math.max(-1,bos)+Math.cos(a)*d*0.5+(hA!=null?Math.cos(aciFark(a,hA))*0.6:0)-(1-pk)*3-(z<3||z>PW-3?0.5:0);
      if(puan>enP){enP=puan;en=a;}}
    return en==null?null:{surum:b.surum,t:this.t,yon:aciNorm(en),hazir:false};
  },
  kafaVur(p){
    const b=this.ball,k=kafaKarari(this,p);
    /* kendi kalesine dönük savunmacının kafası çoğu zaman topu çizgiden dışarı atar (korner) */
    const d=this.dir[p.team],kaleyeDonuk=Math.cos(p.yon)*d<-0.3,kendiCeza=this.kendiCezaSahasinda(p,b.x,b.z);
    if(k.tur==='uzaklastir'&&kendiCeza&&this.rast()<(kaleyeDonuk?0.45:0.18)){k.hx=b.x-d*12;k.hz=b.z+(b.z<MZ?-1:1)*(4+this.rast()*8);k.vy=3+this.rast()*3;}
    const L=hyp(k.hx-b.x,k.hz-b.z)||1,sig=(0.05+0.1*(1-p.oz.kafa))*(1+baskiAltinda(this,p)*0.5),gelen=hyp(b.vx,b.vz);
    /* kafa vuruşu gelen topun hızının bir kısmını kullanır: sert gelen orta sert gider */
    const a=Math.atan2(k.hz-b.z,k.hx-b.x)+this.normal()*sig,v=Math.min(22,k.v*(0.85+this.rast()*0.15)+gelen*(k.tur==='sut'?0.12:0.2));
    b.vx=Math.cos(a)*v;b.vz=Math.sin(a)*v;b.vy=k.vy+this.normal()*sig*6;b.egri=0;b.ust=0;
    b.sahip=null;p.kickCd=0.4;p.eylem={ad:'kafa',t:0,sure:0.5,tur:k.tur};
    p.sonDokunus={t:this.t,tur:'kafa',ayak:null,yuzey:'alin'};
    this.dokunus(p,true);b.hedefOyuncu=k.alici||null;
    if(k.tur==='sut'){b.sut={team:p.team,by:p,gkDone:false,cerceve:this.cerceveyeGider(p.team),kafa:true,t:this.t,hedefZ:k.hz,hedefY:k.hy,tur:'kafa',
      ipucu:{yan:Math.sign(k.hz-MZ)||1,guven:clamp(0.8-0.5*p.oz.kafa,0.2,0.8)}};this.ist.sut[p.team]++;}
    else if(k.tur==='indirme'||k.tur==='pas'){this.pasSay(p,k.hx,k.hz,L,'kafa');this.ofsaytPasAni(p);}
    this.on('header',{p,shot:k.tur==='sut',tur:k.tur,xg:k.xg||0});
  },
  /* gelişine karar (C'nin kovala'sından her karede, karşılama noktası k: {x,z,t}); top başına bir kez, topa ~0,6 sn kala:
     arkadaştan gelen topta gelişine şut ya da tek vuruşla pas (kontrol edip oynamaya karşı); seçilmezse yönlü ilk dokunuş planı */
  gelisineKarar(p,k){
    const b=this.ball;
    if(p.eylem||!(k.t>=0)||k.t>0.6||p.ilkSoruldu===b.surum)return;
    p.ilkSoruldu=b.surum;
    const s=this.topTahmin(k.t);
    if(b.sonTakim===p.team){
      const sut=p.rol!=='GK'&&ilkDokunusSutu(this,p,k.x,k.z,s.y);if(sut){this.vurusBaslat(p,sut);return;}
      const tk=tekVurusKarari(this,p,k,s,hyp(p.x-k.x,p.z-k.z)<=3.0);if(tk.sec){this.vurusBaslat(p,tk.sec);return;}
      this.bVeri(p).plan=this.dokunusPlani(p,k,s,tk.hedef);}
    else this.bVeri(p).plan=this.dokunusPlani(p,k,s,null);
  },
  /* destek noktası (Buckland): topun çevresinde 9–18 m halkada, pas yolu açık, ileride ve boşta olan yer */
  destekNoktasi(p,s,dt){
    if(p.destek&&this.t-p.destek.t<0.5)return p.destek;
    const d=this.dir[p.team],su=s.x*d,sw=s.z,ofs=this._ofs[p.team],rakip=this.teams[1-p.team];
    const ku=p.x*d,kw=p.z;let en=null,enP=-1e9;
    for(let i=0;i<14;i++){
      const a=(-1.35+i*0.21)+(this.rast()-0.5)*0.12,r=9+((i*7)%5)*2.2;
      const u=su+Math.cos(a)*r,w=sw+Math.sin(a)*r*(p.z>sw?1:-1)*(i%2?1:-1);
      if(u>ofs-0.6||u<-PL+4||w<2||w>PW-2)continue;
      let yol=99,bos=99;for(const o of rakip){if(!o.oyunda)continue;const ox=o.x*d;
        yol=Math.min(yol,segD(ox,o.z,su,sw,u,w));bos=Math.min(bos,hyp(ox-u,o.z-w));}
      const puan=Math.min(yol,5)*1.1+Math.min(bos,8)*0.5+(u-su)*0.22-hyp(u-ku,w-kw)*0.1;
      if(puan>enP){enP=puan;en={u,w};}}
    p.destek=en?{u:en.u,w:en.w,t:this.t}:null;return p.destek;
  },
  derinKosu(p,s,ofs,dt){
    const d=this.dir[p.team],su=s.x*d;
    if(p.kosu){const k=p.kosu;k.t-=dt;
      if(k.t<=0||this.ball.sahip!==s||p.x*d>PL-6){p.kosu=null;return null;}
      return k;}
    if(!(p.rol==='FV'||p.mevki.kanat||(p.rol==='OS'&&!p.mevki.derin&&su>5)))return null;
    const ileriBakar=Math.cos(s.yon)*d>0.2,serbest=baskiAltinda(this,s)<0.8,pu=p.x*d;
    if(!ileriBakar||!serbest||su<-18||Math.abs(pu-ofs)>4||this.rast()>dt*(p.rol==='FV'?3.2:1.3)*MOTOR_AYAR.kosuIstegi)return null;
    const hedefU=Math.min(PL-8,ofs+10+this.rast()*8),hw=clamp(p.z+(MZ-p.z)*0.35+(this.rast()-0.5)*10,8,PW-8);
    p.kosu={u:hedefU,w:hw,t:2.6};this.on('kosu',{p});
    /* T2 olay: koşu başladı — topu tutan bir sonraki düşünme anını beklemeden yeniden bakar */
    if(s.kararT>0.05)s.kararT=0.05;
    return p.kosu;
  },
  /* korner: kısa korner ya da orta ile aynı hedef mantığı (kafa vuranlar, koşular, ön direk ve penaltı noktası bölgesi); sıcaklıklı seçim */
  kornerSecenegi(du,tk){
    const d=this.dir[du.takim];
      const yan=Math.sign(du.z-MZ)||1,r=this.rast();
      if(r<0.13){/* kısa korner */let q=null,ed=1e9;for(const p of this.sahadakiler(du.takim)){if(p===tk||p.rol==='GK')continue;const dd=hyp(p.x-du.x,p.z-du.z);if(dd<ed){ed=dd;q=p;}}
        if(q&&ed<20)return{tur:'pas',hx:q.x,hz:q.z,tip:'yer',alici:q};}
      const S=kornerSecenekleri(this,tk,du.x,du.z);
      if(S.length){let en=-1e9;for(const s of S)en=Math.max(en,s.deger);
        const tau=0.6+0.8*(1-tk.oz.karar);let top=0;for(const s of S){s.a=Math.exp((s.deger-en)/tau);top+=s.a;}
        let x=this.rast()*top,c=S[S.length-1];for(const s of S){x-=s.a;if(x<=0){c=s;break;}}
        return{tur:'korner',hx:c.hx,hz:c.hz,tip:'hava',T:c.T,hy:c.hy,yay:'korner',alici:c.q};}
      const hedefler=[[PL-5.5,MZ+yan*2.2],[PL-7,MZ-yan*3.2],[PL-11,MZ],[PL-6,MZ]],h=hedefler[Math.floor(this.rast()*hedefler.length)];
      let al=null,ed=1e9;for(const p of this.sahadakiler(du.takim)){if(p===tk||p.rol==='GK')continue;const dd=hyp(p.x-d*h[0],p.z-h[1]);if(dd<ed){ed=dd;al=p;}}
      return{tur:'korner',hx:d*h[0],hz:h[1],tip:'hava',T:1.15+hyp(d*h[0]-du.x,h[1]-du.z)/30,alici:al};
  },
  serbestSecenegi(du,tk){
    const gx=this.dir[du.takim]*PL;
    if(du.baraj&&!du.endirekt&&this.rast()<0.62)return{tur:'sut',hx:gx,hz:MZ,serbest:true,xg:0.06};
    return null;
  },
  penaltiAtisi(du,tk){
    const gx=this.dir[du.takim]*PL,yan=this.rast()<0.5?-1:1;return{tur:'sut',hx:gx,hz:MZ+yan*(GW2-0.7),penalti:true,xg:0.76};
  }
});
EYLEM_ADIM.vurus=function(p,e,dt){this.vurusIlerle(p,e,dt);return true;};
/* kontrol: iyi dokunuşta oyuncu topun arkasından koşusunu sürdürür (top bir adım önde) */
EYLEM_ADIM.kontrol=function(p,e){const b=this.ball;if(!e.kotu&&b.sahip===p&&e.yon!=null){p.tx=b.x+b.vx*0.2-Math.cos(e.yon)*0.3;p.tz=b.z+b.vz*0.2-Math.sin(e.yon)*0.3;p.hizOran=1;this.eforVer(p,1);}return false;};
