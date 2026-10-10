/* ============ Takım zekâsı: niyet, maç durumu, hoca kapısı (gerçekçilik planı §4 T7; T7a, 2026-10-10) ============
   Takımın o anki niyeti (kur, ilerlet, sonBolge, kontra, tut; topu olmayan takım savunma) ve maç durumu (skor farkı × kalan süre × eksik adam) hocanın
   tabanına (taktikTaban) eklenir, etkin taktik (taktik) olur. Taktiği okuyan bütün yerler (karar, pres, kaleci) niyeti ve maç durumunu kendiliğinden
   alır; takım düzeni (genişlik, derinlik, bek çıkışı, koşu sıklığı, savunma çizgisi) niyetten okunur (mac-dizilis.js, mac-topla.js). Hoca kapısı:
   taktikDegistir(t, yeni, neden) tabanı değiştirir ve 'taktik' olayını yayar; m.hoca geri çağrısı varsa her duruşta sorulur (hocaKapisi). Kararın
   kendisi (ne zaman, neyle) kariyer katmanınındır (Aşama 3.3); motor yalnız kapıyı sağlar.
   Kural: rastlantı çekmez, alan sırası ve sayısı belirlenimli (oyuncu sırası n); çizim kodu yok. niyetEtki 0 iken etkin taktik tabanın aynısıdır ve
   düzen çarpanları nötrdür (tesisat kanıtı: --ayni). */
ayarEkle('T',{
  niyetEtki:1,       // T7a: niyet ve maç durumunun taktiğe ve düzene etkisi (0: yok, tabanın aynısı)
  macDurumEtki:1,    // T7a: maç durumunun (skor × kalan süre × eksik adam) payı (0: niyet var, maç durumu yok)
  niyetYenile:0.5,   // T7a: niyet en çok bu aralıkla yeniden hesaplanır (sn; sahiplik değişince ve duruşta hemen)
  kontraSure:6       // T7a: kontra niyeti top kazanıldıktan sonra en çok bu kadar sürer (sn)
});
/* niyet → düzen ve taktik farkı. Taktik: risk kayıp maliyetinin çarpanıdır (yüksek = temkinli), sakin geri pas ve sabır, tempo karar hızı, direkt ileri
   ve uzun oyun (mac-karar.js); toplanır (risk çarpılır). Düzen: genişlik hücumda mevkilerin yayılma çarpanı, derinlik bloğun öne/geriye kayması (m),
   bekIleri bek çıkışının çarpanı, kosu derin koşu sıklığının çarpanı, bekCik bindirme serbest mi (T7a; TEST değerleri, 40/80 maçla okunur).
   Not (T7a, 40 maç): şutun değerinde risk yoktur (kaçırma maliyeti sabit); son bölgede risk düşürülünce pas ve çalım şuta göre cazipleşip şut
   8,4 → 7,3'e düştü — son bölgede risk nötrdür. Kurmada temkin (risk 1,15, sakin +0,15, tempo −0,1, direkt −0,15) 40 maçta PPDA 5,4 → 6,1 ve
   sahiplik başına pası 1,97 → 2,07 yaptı ama şutu 8,4 → 7,4'e indirdi (sıkıştırılmış maçta sahiplik uzayınca atak azalır; §7.7); hafif değerde
   (1,05 / +0,1 / 0 / −0,1) ikisi de tabanda kaldı. Ara değer seçildi, denge T7g'de (iki tarama değeri kuralı) */
const NIYET_PARAM={
  kur:     {risk:1.1, sakin:0.12, tempo:-0.05,direkt:-0.12,genislik:1.05,derinlik:0, bekIleri:1,  kosu:0.8,bekCik:false},
  ilerlet: {risk:1,   sakin:0,    tempo:0,    direkt:0,    genislik:1,   derinlik:0, bekIleri:1,  kosu:1,  bekCik:true},
  sonBolge:{risk:1,   sakin:-0.2, tempo:0.1,  direkt:0,    genislik:1,   derinlik:2, bekIleri:1,  kosu:1.2,bekCik:true},
  kontra:  {risk:0.85,sakin:-0.3, tempo:0.3,  direkt:0.25, genislik:0.95,derinlik:4, bekIleri:0.6,kosu:1.6,bekCik:false},
  tut:     {risk:1.3, sakin:0.35, tempo:-0.25,direkt:-0.2, genislik:1.12,derinlik:-2,bekIleri:0.6,kosu:0.5,bekCik:false},
  savunma: {risk:1,   sakin:0,    tempo:0,    direkt:0,    genislik:1,   derinlik:0, bekIleri:1,  kosu:1,  bekCik:true}
};
Object.assign(Match.prototype,{
  niyetYeni(){return{ad:'savunma',t0:0,genislik:1,derinlik:0,bekIleri:1,kosu:1,bekCik:true,blok:0,duranGecikme:0,faulIstek:1,stoperIleri:null,
    durum:{fark:0,kalanDk:90,adamFark:0,acele:0,koru:0,eksik:0}};},
  /* takimAI'dan her adım (sahiplik takibinden sonra): niyetYenile sn'de bir, sahiplik takımı değişince ya da duruş başlayıp bitince yeniden hesaplanır */
  niyetAdim(dt,du){
    if(!this._niyet){this._niyet=[this.niyetYeni(),this.niyetYeni()];this._niyetT=-9;this._niyetSahip=-2;this._niyetDu=false;}
    const sahip=du?du.takim:this._sonSahipTakim!=null?this._sonSahipTakim:-1;
    if(sahip===this._niyetSahip&&!!du===this._niyetDu&&this.t-this._niyetT<MOTOR_AYAR.niyetYenile)return;
    this._niyetSahip=sahip;this._niyetDu=!!du;this._niyetT=this.t;
    for(let t=0;t<2;t++){this.takimNiyet(t,sahip,du);this.etkinTaktik(t);}
  },
  takimNiyet(t,sahip,du){
    const N=this._niyet[t],A=MOTOR_AYAR,D=this.macDurumu(t,N.durum),d=this.dir[t],u=(du?du.x:this.ball.x)*d;
    let ad;
    if(sahip!==t)ad='savunma';
    else{const yeni=!du&&this._sahiplikBas!=null&&this.t-this._sahiplikBas<A.kontraSure;
      if(yeni&&(N.ad==='kontra'?this.kontraSayim(t)<=1:this.t-this._sahiplikBas<1&&this.kontraSayim(t)<=0&&u<PL-25))ad='kontra';
      else if(D.koru>0.5&&u<PL-20)ad='tut';
      else ad=u<-15?'kur':u<PL-30?'ilerlet':'sonBolge';}
    if(ad!==N.ad){N.ad=ad;N.t0=this.t;}
    const P=NIYET_PARAM[ad],k=A.niyetEtki;
    N.genislik=1+k*(P.genislik-1);N.derinlik=k*P.derinlik;N.bekIleri=1+k*(P.bekIleri-1);N.kosu=1+k*(P.kosu-1);N.bekCik=k?P.bekCik:true;
    /* savunma çizgisi: geride kalan takım öne çıkar, öndeki ve eksik kalan geri çekilir (m) */
    N.blok=k*(4*D.acele-3*D.koru-3*D.eksik);
    N.duranGecikme=k*2*D.koru;N.faulIstek=1+k*0.6*D.koru;
    N.stoperIleri=k&&D.acele>0.6&&ad!=='savunma'?this.ileriStoper(t):null;
  },
  /* kontra koşulu (plan T7 madde 1): topun önündeki (rakip kalesi yönünde) rakip saha oyuncusu − topun hizasında ya da önündeki bizim saha oyuncumuz
     (topu süren hariç). Sayım ≤ 0: top kazanıldığı anda kontra başlar; ≤ 1 sürdükçe sürer (savunma toparlanınca biter) */
  kontraSayim(t){const b=this.ball,d=this.dir[t],bu=b.x*d;let onde=0,bizim=0;
    for(const o of this.teams[1-t])if(o.oyunda&&o.rol!=='GK'&&o.x*d>bu-1)onde++;
    for(const p of this.teams[t])if(p.oyunda&&p.rol!=='GK'&&p!==b.sahip&&p.x*d>bu-3)bizim++;
    return onde-bizim;},
  /* maç durumu (saf okuma: skor, yarı, oyun saati, sahadaki sayı): acele (geride, son 15 dk; iki farkla 20 dk), koru (önde, son 20 dk), eksik (adam eksik) */
  macDurumu(t,o){o=o||{};const s=this.score,fark=s[t]-s[1-t],e=MOTOR_AYAR.macDurumEtki;
    const kalan=this.half===1?45+Math.max(0,2700-this.gameSec)/60:Math.max(0,5400-this.gameSec)/60;
    let n0=0,n1=0;for(const p of this.teams[t])if(p.oyunda)n0++;for(const p of this.teams[1-t])if(p.oyunda)n1++;
    o.fark=fark;o.kalanDk=kalan;o.adamFark=n0-n1;
    o.acele=e*(fark<0?clamp(((fark<=-2?20:15)-kalan)/(fark<=-2?12:10),0,1):0);
    o.koru=e*(fark>0?clamp((20-kalan)/12,0,1):0);
    o.eksik=e*(n0<n1?Math.min(1,n1-n0):0);
    return o;},
  /* hücuma çıkan stoper (geride, son dakikalar): kafası en iyi stoper (eşitlikte küçük n) */
  ileriStoper(t){let en=null;for(const p of this.teams[t]){if(!p.oyunda||p.rol!=='DEF'||p.mevki.bek)continue;if(!en||p.oz.kafa>en.oz.kafa)en=p;}return en;},
  /* etkin taktik = taban + niyet + maç durumu (niyetEtki 0 iken tabanın aynısı) */
  etkinTaktik(t){const B=this.taktikTaban[t],E=this.taktik[t],N=this._niyet[t],D=N.durum,k=MOTOR_AYAR.niyetEtki;
    E.dizilis=B.dizilis;
    if(!k){E.risk=B.risk;E.sakin=B.sakin;E.tempo=B.tempo;E.direkt=B.direkt;E.pres=B.pres;return;}
    const P=NIYET_PARAM[N.ad];
    E.risk=Math.max(0.3,B.risk*(1+k*(P.risk-1))*(1-0.25*k*D.acele)*(1+0.3*k*D.koru)*(1+0.1*k*D.eksik));
    E.sakin=clamp(B.sakin+k*(P.sakin-0.3*D.acele+0.3*D.koru),0,1);
    E.tempo=clamp(B.tempo+k*(P.tempo+0.3*D.acele-0.25*D.koru),0,1);
    E.direkt=clamp(B.direkt+k*(P.direkt+0.3*D.acele),0,1);
    E.pres=clamp(B.pres+k*(0.25*D.acele-0.1*D.koru-0.15*D.eksik),0,1);},
  /* hoca kapısı (plan T7 madde 10): hocanın tabanını değiştirir; diziliş değişirse mevkiler sıradan (n) yeniden okunur, markaj/pres/koşu tabloları
     sıfırlanır; 'taktik' olayı yayılır */
  taktikDegistir(t,yeni,neden){
    const T=this.taktikTaban[t],eski=Object.assign({},T);Object.assign(T,yeni||{});
    if(T.dizilis!==eski.dizilis){if(!DIZILISLER[T.dizilis])T.dizilis=eski.dizilis;
      else{const M=DIZILISLER[T.dizilis].mevkiler;
        for(const p of this.teams[t]){const mv=M[p.n];if(!mv||p.rol==='GK'&&mv.cizgi!=='KL')continue;p.mevki=mv;p.rol=mv.cizgi==='KL'?'GK':mv.cizgi;p.destek=null;p.kosu=null;}
        if(this._markaj)this._markaj[t]=new Map();if(this._pres1)this._pres1[t]=null;}}
    if(this._niyet)this.etkinTaktik(t);else Object.assign(this.taktik[t],T);
    this.on('taktik',{takim:t,eski,yeni:Object.assign({},T),neden:neden||null});},
  /* duruşta hoca sorulur: m.hoca(t, maç durumu, taban, maç) bir yama dönerse uygulanır (yoksa hiçbir şey olmaz; rastlantı çekmez) */
  hocaKapisi(){if(typeof this.hoca!=='function')return;
    for(let t=0;t<2;t++){const y=this.hoca(t,this.macDurumu(t),Object.assign({},this.taktikTaban[t]),this);if(y&&typeof y==='object')this.taktikDegistir(t,y,'hoca');}}
});
