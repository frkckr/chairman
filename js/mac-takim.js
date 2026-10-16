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
  kontraSure:6,      // T7a: kontra niyeti top kazanıldıktan sonra en çok bu kadar sürer (sn)
  kurmaStoperW:17,   // T7b: kurmada stoperlerin orta çizgiden uzaklığı (m; ceza sahası genişliği ±20)
  gerideEk:1,        // T7b: hücumda geride kalan sayısı = bizim yarıdaki rakip saha oyuncusu + bu (en az 2)
  rakipAlgi:1,       // T7c (Ek H 26): karar anında görüş dışındaki rakip son taramadan bilinir (0: gerçek konum; mac-karar.js rakipAlgisi)
  /* pasT0, pasOku, pasOkuAlici (T7c, §7.10: rakibin ve alıcının saati vuruştan): 40 maçta iyimser çıktı (pas tahmini −3,3…−4,1, ara pası −10 puan;
     sahiplik başına pas 2,18 → 1,80–1,94, PPDA 6,0 → 4,9–5,6), kapalı kaldı; 2026-10-10 bakımında kaldırıldı (gerçekçilik planı §7 madde 10) */
  kosuTetik:6,       // T7c: tetikli koşunun başlama sıklığı (1/sn; ara noktası bulundu ve taşıyanın başı yukarıda; topsuz hareket × kanallara koşma)
  kosuRastgele:0.5,  // T7c: tetiksiz (rastgele) derin koşunun eski sıklığa oranı
  kosuEs:2,          // T7c: aynı anda en çok savunma arkasına koşu
  zon14:2,           // T7c: son üçte birde orta sahanın destek noktasında ceza sahası önü (zon 14) payı (destekNoktasi puanı)
  govdeAc:0.25,      // T7c (Ek H 6): taşırken gövde en iyi pasın hedefine bu oranda açılır (0: kapalı)
  osDestek:28,       // T7c: merkez orta saha topa bu kadar yakınken (m) hep destek noktası arar (0: kapalı; eski kural en yakın üç)
  presTetikSure:1.5, // T7d: pres tetiği (kötü ilk dokunuş, geri pas, sırtı dönük alıcı, çizgiye sıkışma) bu kadar sürer (sn)
  presTetikMesafe:20,// T7d: tetikte 1. adamın çıkış mesafesi (m; tetiksiz 16, orta sahada 11 / 7)
  golgePres:1,       // T7d: ortada 1. adam en tehlikeli pas yolunu arkasında bırakan taraftan yaklaşır (0: zayıf ayağa itme)
  kosucuTakip:1,     // T7d: top uzaktayken de kalemize koşan rakip savunmacıya eşlenir (0: kapalı)
  hatCik:2,          // T7d: top baskıdaysa ya da sürücünün sırtı dönükse savunma çizgisi öne çıkar (m)
  kutuSavunma:1,     // T7d: top kanatta, kendi üçte birimizdeyken boştaki savunmacılar ön direk, altıpas önü, arka direk, penaltı noktasını tutar
  kompakt:0.1,       // T7d: savunmada hatlar arası mesafe bu oranda kısalır (takım boyu; T7g: 0,15 → 0,10 — 0,15'te 40 maçta şut 6,2 / gol 1,7, 0,10'da 6,6 / 2,0)
  mdhTahminEtki:1,   // T7d: erken ve yandan müdahale isteği mudahaleTahmin'in kazanma − faul farkıyla ölçeklenir (0: kapalı)
  takipSayi:3,       // T7e: şutu takip eden en çok hücumcu (0: kapalı)
  donenUzak:1,       // T7e: kurtarış, blok ya da direkten sonra 3 sn kendi ceza sahamızda uzaklaştırmanın ek değeri (puan)
  /* T10e: kısa süreli takım güveni (guvenAdim): gol, kendi kalesine gol, kaçan büyük fırsat, kaçan penaltı; birkaç oyun dakikasında tabana döner */
  guvenEtki:0.06,    // T10e: güvenin vuruş hatasına etkisi: σ × (1 − guvenEtki × oyuncunun güveni) (güven −1…1; soğukkanlılık tepkiyi küçültür)
  guvenRisk:0.1,     // T10e: güvenin takım riskine (kayıp maliyeti çarpanı) etkisi: risk × (1 − guvenRisk × güven) — güvenen takım daha cesur
  guvenSure:30,      // T10e: güvenin tabana dönüş süresi sabiti (sn; ~4,5 oyun dakikası)
  evGuven:0.2,       // T10e: deplasmanın güven tabanı −evGuven × atmosfer (dolu statta deplasman biraz gergin)
  /* T14a (2026-10-14; gerçekçilik planı §4 T14): kanat rolü — hücumun genişliği ve derinliği (kanatKonumu) */
  kanatRol:1,        // T14a: kanat oyuncusunun hücum rolü (0: kapalı, T13'ün düzeni — tesisat kanıtı --ayni)
  kanatBas:-10,      // T14a: topu tutanın u'su bundan ilerideyken kanat genişlik ve derinlik verir (m; hücum çerçevesi, orta çizgi 0)
  kanatCizgi:5,      // T14a: kanadın taç çizgisine uzaklığı (m; içe kat eğilimi içeri, çizgiye inme eğilimi dışarı alır)
  kanatDerin:2.5,    // T14a: kanadın ofsayt çizgisinin gerisinde beklediği mesafe (m; 4'te kanat derin koşu kapısının (çizgiye 4 m) sınırındaydı)
  kanatOnde:14,      // T14a: orta alanda (top kaleye kanatUzak m'den uzakken) kanadın topu tutandan en çok önde durduğu mesafe (m)
  kanatUzak:40,      // T14a: top öbür kanatta ve kaleye bu kadar yakınken uzak kanat arka direğe gelir (m)
  gecGiris:2,        // T14b: orta ve geri çevirmede ceza sahasına geç giren en çok forvet dışı oyuncu (0: kapalı; gecGirisAta)
  /* T16b (2026-10-15; gerçekçilik planı §4 T16): öndeki takım maçın sonunda da hücum eder — gerçekte öndeki ÷ gerideki şut ~0,5–0,6 (son dilimde
     motorda 0,33 idi) */
  tutEtki:0.5,       // T16b: öndeki takımın hücumdaki temkini (tut niyetinin ilerlet'ten farkı ve koru'nun risk, sakinlik, tempo terimleri; 1: eski — 40 maçta
                     // son dilimde öndeki takımın şutu 0,24 → 0,47 / takım·dk, öndeki ÷ gerideki 0,33 → 0,59; 0'da ek kazanç yok)
  /* T18a (2026-10-16; gerçekçilik planı §4 T18): görev bağlılığı — kovalayan ve pres el değiştirmesin diye kalıcılık (T13'ün 0,15 sn'lik eşiği her topa
     uygulanmıştı ve etkisizdi; burada yalnız savunan takımın kovalayanı, pasın alıcısı ve yüksek top hariç) */
  kovalaKalici:0,    // T18a: savunan takımın (topa son dokunan rakip) o anki kovalayanı, yeni adaydan bu kadar sn geç kalmadıkça kalır; 0: her dokunuşta en erken.
                     // Denendi (0,25; 40 maç): kovalama her dokunuşta bittiğinden giriş sayısı düşmedi (2,24 → 2,21), ivmelenme aynı; pas isabeti −2, hava topu +2,8 → kapalı
  presKalici:0,      // T18a: 1. adamın mesafe süzgecinde (R1/R2) önceki 1. adama bu kadar m pay; süzgeçte elenen 1. adamın belleği silinmez; 0: T7d.
                     // Denendi (2 m; 40 maç, kovalaKalici ile): PPDA 4,4 → 4,0, ivmelenme aynı → kapalı
  kapatKalici:0.5,   // T18a: 2. adam ve bire bir örtüsü bu kadar sn tutulur (geçerliyse: oyunda, kilitsiz, 14 m içinde); karşı pres üçlüsü sahiplik boyunca sabit; 0: her kare
  /* T18b: pas uçuşunda sahip yok sayılmasın, top kaybında savunma düzenine geçiş tek karede olmasın */
  gecisKademe:0,     // T18b: pas uçuşunda pasın alıcısı rol düzeni için sanal sahiptir (hücumun topu tutana bağlı rolleri ve 1. adam pas boyunca düşmez; 1. adam alıcıya
                     // kapatır); kovalayan ve geçiş sayacı gerçek sahiplikle; 0: T13 (pas yolda bütün roller aynı karede düşüp alışta geri geliyordu)
  gecisDalga:0,      // T18b: top kaybında topa 12 m'den uzak oyuncu savunma düzenine gecis + bu kadar sn'ye yayılmış kişisel gecikmeyle geçer (tepki süresiyle; efor düşmez,
                     // karşı pres ve kovalayan hemen); 0: herkes gecis (0,7 sn) sonunda aynı karede.
                     // T18b denendi ve kapatıldı (12 ve 40 maç): gecisKademe 1 görev değişimini 27,5 → 32,5 (yüksek eforlu 8,4 → 11,9), ivmelenmeyi 6,5 → 7,3,
                     // boşta rakibi 97 → 152 sn/maç yükseltti (pres üçlüsü pas boyunca alıcıya koşup alışta yeniden seçiliyor); gecisDalga 0,5 etkisiz (top kaybında
                     // aynı karede ≥ 3 hedef sıçraması zaten 0,06/takım·dk — T18-0: toplu sıçramalar bölge güncellemesinde (16,6) ve duruş sonunda (5,4))
  /* T18c: markaj ve kutu savunması eşleşmeleri hücumda silinmez, koşucu takibi histerezisli; derin koşu top kaybında biter */
  markajKalici:1,    // T18c: takım hücuma geçince markaj ve kutu savunması haritası silinmez (top geri gelince eski çiftler 12 m içindeyse sürer); kutu savunmasında önceki
                     // bölge eşleşmesi korunur, yalnız boş bölgeler dağıtılır; koşucu takibinde giriş 4, çıkış 3,2 m/sn; 0: T7 (her hücumda sıfırdan)
  kosuSil:1,         // T18c: derin koşu (arkaya, geniş, eş koşu) rakip topu alınca biter (eskiden yalnız sayaçla ve sayaç yalnız topa sahipken işliyordu: koşu askıda kalıp
                     // takım topu geri alınca efor 1'le sürüyordu); 0: eski
  /* T18d (gerçekçilik planı §4 T18): yorgunluğun düzene etkisi — takım yorgunluğu (sahadaki saha oyuncularının ortalaması; pay = (y − 0,1) / 0,25, 0–1) */
  yorgunBlok:2,      // T18d: savunma çizgisi takım yorgunluğuyla bu kadar m'ye kadar geri (N.blok) ve kompaktlık %60'a kadar gevşer; 0: kapalı.
                     // 4 denendi (40 maç): dilim etkileri 2 ile aynı (HŞK son ÷ ilk 0,94 / 0,96) ama ofsayt 2,0 → 0,8 (2'de 1,5) ve gol 3,3 — derin çizgi ofsaytı siliyor
  yorgunPres:0.25,   // T18d: 1. adamın çıkış mesafeleri (R1/R2) takım yorgunluğuyla bu orana kadar daralır; 0: kapalı
  yorgunKosu:0.5,    // T18d: derin koşu sıklığı oyuncunun yorgunluğuyla bu orana kadar azalır (gerçekte yüksek şiddetli koşu ilk → son 15 dk −18…−20 %); 0: kapalı
  yorgunKip:1        // T18d: yorgun (> 0,2) ve düşük eforlu (< 0,6) oyuncu yerine dönüşte koşu yerine tırıs (3,2 m/sn) kipini seçer; 0: koş
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
/* T16b (2026-10-15): öndeki takımın hücumdaki temkini — tut niyetinin sayısal değerleri ilerlet'ten tutEtki oranında ayrılır (1: eski değerin
   kendisi; bekCik tut'unki). Saf, önbellek yok */
function niyetDeger(ad,k){const P=NIYET_PARAM[ad],e=MOTOR_AYAR.tutEtki;if(ad!=='tut'||e===1)return P[k];const I=NIYET_PARAM.ilerlet;return I[k]+e*(P[k]-I[k]);}
/* T10e: güven olaylarının büyüklüğü (takım güveninde) */
const GUVEN_OLAY={golAtti:0.45,golYedi:-0.25,kendiKale:-0.15,kacanFirsat:-0.15,penaltiKacti:-0.3,penaltiKurtardi:0.2};
Object.assign(Match.prototype,{
  /* T10e: takım güveni m.guven[t] (−1…1) olaylarla değişir, guvenSure ile tabana döner (ev sahibi 0, deplasman −evGuven × atmosfer); oyuncuya
     soğukkanlılığıyla yansır: p.guven = güven × (1,25 − soğukkanlılık) (6 karede bir). Etkiler küçük: vuruş hatası (js/mac-topla.js vurusSapma) ve
     takımın riski (etkinTaktik). Rastlantı çekmez */
  guvenHazirla(){const a=this.kosullar?this.kosullar.atmosfer:0.5,ev=this.evSahibi||0;
    this.guvenTaban=[0,1].map(t=>t===ev?0:-MOTOR_AYAR.evGuven*a);this.guven=this.guvenTaban.slice();this._penaltiSon=null;},
  guvenOlay(t,ad){const d=GUVEN_OLAY[ad];if(d==null||t==null)return;this.guven[t]=clamp(this.guven[t]+d,-1,1);this.on('guven',{takim:t,ad,deger:this.guven[t]});},
  guvenAdim(dt){
    const G=this.guven,B=this.guvenTaban,k=Math.exp(-dt/MOTOR_AYAR.guvenSure);for(let t=0;t<2;t++)G[t]=B[t]+(G[t]-B[t])*k;
    /* kaçan penaltı: kullanımdan 3 sn içinde gol yoksa (js/mac-durantop.js kullanimBildir _penaltiSon) */
    const P=this._penaltiSon;if(P&&this.t-P.t>3){this._penaltiSon=null;if(this.score[P.takim]===P.g0){this.guvenOlay(P.takim,'penaltiKacti');this.guvenOlay(1-P.takim,'penaltiKurtardi');}}
    if(this.kare%6)return;
    for(const p of this.players)if(p.oyunda)p.guven=clamp(G[p.team]*(1.25-profilAlt(p,'sogukkanlilik',p.oz.karar)),-1,1);
  },
  niyetYeni(){return{ad:'savunma',t0:0,genislik:1,derinlik:0,bekIleri:1,kosu:1,bekCik:true,blok:0,duranGecikme:0,zamanGecir:0,faulIstek:1,stoperIleri:null,alti:null,basan:0,uzun:false,kompakt:1,
    durum:{fark:0,kalanDk:90,adamFark:0,acele:0,koru:0,eksik:0}};},
  /* takimAI'dan her adım (sahiplik takibinden sonra): niyetYenile sn'de bir, sahiplik takımı değişince ya da duruş başlayıp bitince yeniden hesaplanır */
  niyetAdim(dt,du){
    /* T7f: jestin süresi (çizim p.jest.t'yi okur, ilerletmez; sözleşme {tur, t, sure, kol, hedef}) */
    for(const p of this.players){const j=p.jest;if(j){j.t+=dt;if(j.t>=j.sure)p.jest=null;}}
    if(!this._niyet){this._niyet=[this.niyetYeni(),this.niyetYeni()];this._niyetT=-9;this._niyetSahip=-2;this._niyetDu=false;}
    const sahip=du?du.takim:this._sonSahipTakim!=null?this._sonSahipTakim:-1;
    if(sahip===this._niyetSahip&&!!du===this._niyetDu&&this.t-this._niyetT<MOTOR_AYAR.niyetYenile)return;
    this._niyetSahip=sahip;this._niyetDu=!!du;this._niyetT=this.t;
    for(let t=0;t<2;t++){this.takimNiyet(t,sahip,du);this.etkinTaktik(t);}
  },
  takimNiyet(t,sahip,du){
    const N=this._niyet[t],A=MOTOR_AYAR,D=this.macDurumu(t,N.durum),d=this.dir[t],u=(du?du.x:this.ball.x)*d;
    /* T18d: takım yorgunluğu (sahadaki saha oyuncuları) ve düzen payı */
    {let ys=0,yn=0;for(const p of this.teams[t])if(p.oyunda&&p.rol!=='GK'){ys+=p.yorgunluk||0;yn++;}N.yorgun=yn?ys/yn:0;N.yorgunPay=clamp((N.yorgun-0.1)/0.25,0,1);}
    let ad;
    if(sahip!==t)ad='savunma';
    else{const yeni=!du&&this._sahiplikBas!=null&&this.t-this._sahiplikBas<A.kontraSure;
      if(yeni&&(N.ad==='kontra'?this.kontraSayim(t)<=1:this.t-this._sahiplikBas<1&&this.kontraSayim(t)<=0&&u<PL-25))ad='kontra';
      else if(D.koru>0.5&&u<PL-20)ad='tut';
      else ad=u<-15?'kur':u<PL-30?'ilerlet':'sonBolge';}
    if(ad!==N.ad){N.ad=ad;N.t0=this.t;}
    const P=NIYET_PARAM[ad],k=A.niyetEtki;   /* T16b: tut'ta sayısal değerler niyetDeger'den (tutEtki) */
    N.genislik=1+k*(niyetDeger(ad,'genislik')-1);N.derinlik=k*niyetDeger(ad,'derinlik');N.bekIleri=1+k*(niyetDeger(ad,'bekIleri')-1);N.kosu=1+k*(niyetDeger(ad,'kosu')-1);N.bekCik=k?P.bekCik:true;
    /* savunma çizgisi: geride kalan takım öne çıkar, öndeki ve eksik kalan geri çekilir (m) */
    N.blok=k*(4*D.acele-3*D.koru-3*D.eksik)-(A.yorgunBlok||0)*N.yorgunPay;   /* T18d: yorgun takım derinleşir */
    N.duranGecikme=k*2*D.koru;N.faulIstek=1+k*0.6*D.koru;N.zamanGecir=k*D.koru;   /* T10d: zaman geçirme yoğunluğu (js/mac-kurallar.js zamanGecirEk) */
    N.stoperIleri=k&&D.acele>0.6&&ad!=='savunma'?this.ileriStoper(t):null;
    N.kompakt=k&&ad==='savunma'?1-k*A.kompakt*(1-(A.yorgunBlok?0.6*N.yorgunPay:0)):1;   /* T7d: savunmada hatlar sıkışır (dizilisKonumu); T18d: yorgunlukla gevşer */
    /* T7b: kurma — altı numara, basan rakip sayısı ve +1 üstünlüğü (kaleci dahil); sağlanamıyorsa uzun (etkin direkt +0,4) */
    N.alti=null;N.basan=0;N.uzun=false;
    if(k&&ad==='kur'){const b=this.ball,bx=du?du.x:b.x,bz=du?du.z:b.z,bu=bx*d;let en=null;
      for(const p of this.teams[t])if(p.oyunda&&p.rol==='OS'&&p.mevki.derin&&(!en||Math.abs(p.mevki.w-MZ)<Math.abs(en.mevki.w-MZ)))en=p;
      N.alti=en;let Pb=0,Qb=1;
      for(const o of this.teams[1-t])if(o.oyunda&&o.rol!=='GK'&&o.x*d>bu-2&&Math.hypot(o.x-bx,o.z-bz)<22)Pb++;
      for(const p of this.teams[t])if(p.oyunda&&p.rol!=='GK'&&p.x*d<bu+8&&Math.hypot(p.x-bx,p.z-bz)<30)Qb++;
      N.basan=Pb;N.uzun=Qb<Pb+1;}
  },
  /* T7b: kurma dizilişi (plan T7 madde 2): stoperler ceza sahası genişliğine açılır, altı numara basan iki rakip varsa aralarına, yoksa önlerine
     gelir, bekler yükselir ve çizgiye açılır. k: mevkinin dizilişteki yeri ({u, w}, hücum çerçevesi); kurmada rolü olmayana null */
  kurmaKonumu(p,t,k,N){const m=p.mevki;
    if(p.rol==='DEF'&&!m.bek)return{u:k.u,w:MZ+(m.w<MZ?-1:1)*MOTOR_AYAR.kurmaStoperW};
    if(m.bek)return{u:k.u+10,w:m.w<MZ?4:PW-4};
    if(p===N.alti)return N.basan>=2?{u:k.u-10,w:MZ}:{u:k.u-3,w:MZ+(m.w-MZ)*0.3};
    return null;},
  /* T7b: geride kalanlar (plan T7 madde 7): hücumda bizim yarıdaki rakip saha oyuncusu + gerideEk kadar oyuncu (en az 2) geride kalır: önce
     stoperler, sonra pozisyon alması ve çabukluğu en iyi bek/derin orta saha. Koşmaz, bindirmez, destek ve ceza sahası rolü almaz (bolgeKonumu).
     6 karede bir; savunmada boş */
  gerideKalanlar(t){const G=this._geride||(this._geride=[new Set(),new Set()]);
    if(this.kare%6!==(t?3:0))return G[t];
    const S=G[t];S.clear();
    /* T8b: duran topun görev düzeninde geride kalanlar görevden (js/mac-durantop.js; eskiden kafa için kutuya çıkan stoperler buradan geri çekiliyordu) */
    const DS=this._duranSonrasi;if(DS&&DS.takim===t){for(const p of this.teams[t])if(p.oyunda&&p.duranRol&&p.duranRol.rol==='geride')S.add(p);if(S.size)return S;}   /* T8f: görev yoksa (barajlı vuruş) eski kural */
    const N=this._niyet&&this._niyet[t];if(!N||!MOTOR_AYAR.niyetEtki||N.ad==='savunma')return S;   /* (hız: tablo yeniden kullanılır) */
    const d=this.dir[t];let rakip=0;for(const o of this.teams[1-t])if(o.oyunda&&o.rol!=='GK'&&o.x*d<0)rakip++;
    const gerek=Math.max(2,rakip+MOTOR_AYAR.gerideEk),b=this.ball;
    const C=this.teams[t].filter(p=>p.oyunda&&p.rol!=='GK'&&p!==b.sahip&&p!==N.stoperIleri&&(p.rol==='DEF'||p.mevki.derin));
    const stp=p=>p.rol==='DEF'&&!p.mevki.bek?1:0,ka=p=>profilAlt(p,'pozisyonAlma',0.5)+profilAlt(p,'cabukluk',0.5);
    C.sort((a,c)=>stp(c)-stp(a)||ka(c)-ka(a)||a.n-c.n);
    for(const p of C){if(S.size>=gerek)break;S.add(p);}
    return S;},
  /* T7b: koridor sahipliği (plan T7 madde 3): saha beş dikey koridora ayrılır (PW/5). Hücumda topun hizasındaki ve önündeki oyuncularda (kaleci,
     topu süren ve geride kalanlar hariç; yer dizilişten) aynı koridor ve aynı hatta (|Δu| < 8 m) iki kişi olmaz — koridor ortasına uzak olan boş
     komşu koridora kayar —, boş koridor kalmaz — iki kişilik komşu koridordan en yakını kayar. Kontrada üç şerit: en öndeki forvet ortaya, en
     öndeki iki oyuncu kanatlara. Sonuç oyuncu → koridorun ortası (w); 6 karede bir */
  koridorAta(t,odak){const K=this._koridor||(this._koridor=[new Map(),new Map()]);
    if(this.kare%6!==(t?3:0))return K[t];
    const M=K[t];M.clear();const N=this._niyet&&this._niyet[t];if(!N||!MOTOR_AYAR.niyetEtki||N.ad==='savunma')return M;
    const d=this.dir[t],bu=odak.x*d,bw=odak.z,diz=this.taktik[t].dizilis,b=this.ball,GR=this._geride&&this._geride[t],KW=PW/5,L=[];
    for(const p of this.teams[t]){if(!p.oyunda||p.rol==='GK'||p===b.sahip||(GR&&GR.has(p)))continue;
      const k=dizilisKonumu(diz,p.n,bu,bw,true,N);if(k.u<bu-6)continue;L.push({p,u:k.u,w:k.w,s:clamp(Math.floor(k.w/KW),0,4),yeni:false});}
    const dolu=(s,q)=>L.some(r=>r!==q&&r.s===s&&Math.abs(r.u-q.u)<8);
    if(N.ad==='kontra'){
      const F=L.filter(q=>q.p.rol==='FV').sort((a,c)=>c.u-a.u||a.p.n-c.p.n)[0];if(F){F.s=2;F.yeni=true;}
      const Y=L.filter(q=>q!==F).sort((a,c)=>c.u-a.u||a.p.n-c.p.n).slice(0,2);
      if(Y.length===2){const sol=Y[0].w<=Y[1].w?Y[0]:Y[1],sag=sol===Y[0]?Y[1]:Y[0];sol.s=0;sag.s=4;sol.yeni=sag.yeni=true;}}
    else{
      for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const a=L[i],c=L[j];if(a.s!==c.s||Math.abs(a.u-c.u)>=8)continue;
        const mv=Math.abs(a.w-(a.s+0.5)*KW)>Math.abs(c.w-(c.s+0.5)*KW)?a:c,B=[mv.s-1,mv.s+1].filter(s=>s>=0&&s<=4&&!dolu(s,mv));
        if(B.length){mv.s=B.length>1&&Math.abs((B[1]+0.5)*KW-mv.w)<Math.abs((B[0]+0.5)*KW-mv.w)?B[1]:B[0];mv.yeni=true;}}
      for(let s=0;s<5;s++){if(L.some(q=>q.s===s))continue;let en=null,ed=1e9;
        for(const q of L){if(Math.abs(q.s-s)!==1||L.filter(r=>r.s===q.s).length<2)continue;const dd=Math.abs(q.w-(s+0.5)*KW);if(dd<ed){ed=dd;en=q;}}
        if(en){en.s=s;en.yeni=true;}}}
    for(const q of L)if(q.yeni)M.set(q.p,(q.s+0.5)*KW);
    return M;},
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
    /* T16b: öndeki takımın hücumdaki temkini (tut niyeti ve koru'nun risk, sakinlik, tempo terimleri) tutEtki ile; pres, blok ve zaman geçirme aynen */
    const ad=N.ad,kr=D.koru*MOTOR_AYAR.tutEtki;
    E.risk=Math.max(0.3,B.risk*(1+k*(niyetDeger(ad,'risk')-1))*(1-0.25*k*D.acele)*(1+0.3*k*kr)*(1+0.1*k*D.eksik)*(1-MOTOR_AYAR.guvenRisk*(this.guven?this.guven[t]:0)));   /* T10e: güven */
    E.sakin=clamp(B.sakin+k*(niyetDeger(ad,'sakin')-0.3*D.acele+0.3*kr),0,1);
    E.tempo=clamp(B.tempo+k*(niyetDeger(ad,'tempo')+0.3*D.acele-0.25*kr),0,1);
    E.direkt=clamp(B.direkt+k*(niyetDeger(ad,'direkt')+0.3*D.acele+(N.uzun?0.4:0)),0,1);
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
  /* T7c: topsuz koşular (plan T7 madde 5). Savunma arkasına koşu (tur 'arkaya') başlar; koşucunun 15 m içindeki hat arkadaşı (forvet, kanat,
     ileri orta saha; koşmayan, geride kalmayan) “biri giderse öteki gelir”: hedef forvet ya da derine gelme eğilimli olan ayağa gelir ('gel'),
     öteki yana açılıp savunmacıyı çeker ('aldatma'). Topu tutan bir sonraki düşünme anını beklemeden yeniden bakar */
  kosuBaslat(p,s,hu,hw,tur){p.kosu={u:hu,w:hw,t:2.6,tur};this.on('kosu',{p,tur});if(s.kararT>0.05)s.kararT=0.05;
    /* T7f (Ek G3): koşu başında kol koşunun gideceği yeri gösterir */
    const hx=hu*this.dir[p.team];this.jestVer(p,'isaret',0.9,{x:hx,z:hw});
    this.kosuOrtak(p,s);return p.kosu;},
  /* T7f (Ek G3): jest yazımı — {tur: kol|isaret|itiraz|cagir|basEl|alkis, t, sure, kol: hedefin olduğu kol ('sol' aynalanır), hedef}. Aynı jest
     sürerken yenilenmez. Rastlantısız */
  jestVer(p,tur,sure,hedef){if(!p||p.jest&&p.jest.tur===tur)return;let kol=null;
    if(hedef){const c=Math.cos(p.yon),s=Math.sin(p.yon),yan=(hedef.x-p.x)*-s+(hedef.z-p.z)*c;kol=yan>0?'sag':'sol';}
    p.jest={tur,t:0,sure,kol,hedef:hedef||null};},
  /* T7f: ofsayt verilince topa en yakın iki savunmacı kolunu kaldırır (1,5 sn) */
  ofsaytJesti(p){const L=this.teams[1-p.team].filter(q=>q.oyunda&&q.rol==='DEF').sort((a,c)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(c.x-p.x,c.z-p.z)||a.n-c.n);
    for(let i=0;i<Math.min(2,L.length);i++)this.jestVer(L[i],'kol',1.5,null);},
  /* T7f: büyük fırsat (xG > 0,25) kurtarışla ya da auta biterse şutçu başını tutar (1,6 sn); şuttan 3 sn içinde */
  kacanFirsat(){const k=this._sonSut;if(!k)return;this._sonSut=null;if(this.t-k.t<3&&k.xg>0.25&&k.p.oyunda){this.jestVer(k.p,'basEl',1.6,null);this.guvenOlay(k.p.team,'kacanFirsat');}},   /* T10e: güven */
  kosuOrtak(p,s){const d=this.dir[p.team],GR=this._geride&&this._geride[p.team];let en=null,ed=15;
    for(const q of this.teams[p.team]){if(q===p||q===s||!q.oyunda||q.kosu||q.rol==='GK'||q.rol==='DEF'||(q.rol==='OS'&&q.mevki.derin)||(GR&&GR.has(q)))continue;
      const dd=Math.hypot(q.x-p.x,q.z-p.z);if(dd<ed&&Math.abs((q.x-p.x)*d)<10){ed=dd;en=q;}}
    if(!en)return;const su=s.x*d,qu=en.x*d;
    if(en.mevki.hedef||profilEgilim(en,'derineGelir')>0){en.kosu={u:Math.max(su+5,qu-7),w:lerp(en.z,s.z,0.35),t:1.4,tur:'gel'};this.jestVer(en,'cagir',1.0,{x:s.x,z:s.z});}   /* T7f: ayağa isteyen çağırır */
    else{const y=Math.sign(en.z-p.z)||1;en.kosu={u:qu,w:clamp(en.z+y*6,4,PW-4),t:1.2,tur:'aldatma'};}
    this.on('kosu',{p:en,tur:en.kosu.tur});},
  kosuSayisi(t){let n=0;for(const q of this.teams[t])if(q.oyunda&&q.kosu&&(q.kosu.tur==='arkaya'||q.kosu.tur==='genis'))n++;return n;},   /* T14a: kanat koşusu ('genis') da savunma arkasına koşudur */
  /* T14a (2026-10-14; gerçekçilik planı §4 T14): kanat rolü. Topu tutan arkadaş rakip yarıya yaklaşınca (u > kanatBas) kanat mevkili oyuncu
     (topu tutan değil, geride kalmayan; koşusu ve kutu rolü önceliklidir — bolgeKonumu) hücumun genişliği ve derinliğidir: kendi kanadında taç
     çizgisine kanatCizgi m (içe kat eğilimi içeride, çizgiye inme eğilimi dışarıda), ofsayt çizgisinin kanatDerin m gerisinde, topu tutandan en
     çok kanatOnde m önde; top kendi kanadında ve kaleye kanatUzak m içindeyken topun önünde, ofsayt çizgisinin hemen gerisinde. Topu tutan aynı kanatta çizgideyse (bek, forvet) kanat yarım alana girer (çizgiden 14 m; genişliği o verir). Top öbür kanatta
     ve kaleye kanatUzak m'den yakınsa arka direğe gelir (kutuRolu'nun uzak kanat noktası; ofsayt çizgisi bolgeKonumu'nda); daha uzaktaysa eski
     uzak kanat kuralı (null). Destek noktası aramaz (destekçiliği bek ve merkez verir). Eskiden (T13) aynı kanattaki kanat son üçte birde topun
     8 m gerisinde destekçiydi (%51), uzak kanattaki kaleden ~31 m uzakta kalıyordu; kanatta topu tutan %55 forvetti (T14-0). Rastlantısız */
  /* T14b (2026-10-14; gerçekçilik planı §4 T14): kutuya geç giriş. Orta ya da geri çevirmenin hazırlığı başlayınca (vurusBaslat) forvet ve savunma
     dışından en çok gecGiris oyuncu (orta saha, kanat; ortacı, alıcı, geride kalanlar, kilitli eylemdekiler ve başka bir koşudakiler hariç — savunma
     arkasına koşu bırakılır), penaltı noktasına 25 m içinde ve rakip yarının son 40 m'sindeyse, profiline göre (topsuz hareket, ceza sahasına geç
     girme eğilimi; kanat önce; uzaklık cezası) ceza sahasına koşar: havadan ortada penaltı noktası ve uzak direğin önü, yerden ortada ve geri
     çevirmede penaltı noktası ve yay. Tam efor; top ortacıdayken ofsayt çizgisinin gerisinde (bolgeKonumu), 1,8 sn. Eskiden orta anında ceza
     sahasında forvet dışı 1,1 hücumcu vardı, şutların %81'i forvetten (T14-0). Rastlantısız */
  gecGirisAta(p,sec){const A=MOTOR_AYAR;if(!A.gecGiris||!p||p.team==null)return;
    const t=p.team,d=this.dir[t],yan=Math.sign(this.ball.z-MZ)||1,GR=this._geride&&this._geride[t],yer=sec.tur==='geriCevir'||sec.tip!=='hava';
    const Z=yer?[[PL-11,MZ],[PL-17,MZ-yan*3]]:[[PL-11,MZ-yan],[PL-7,MZ-yan*4]],C=[];
    for(const q of this.teams[t]){if(q===p||q===sec.alici||!q.oyunda||q.rol==='GK'||q.rol==='FV'||q.rol==='DEF'||(q.eylem&&q.eylem.kilit)||(GR&&GR.has(q))||(q.kosu&&q.kosu.tur!=='arkaya'))continue;
      const L=hyp(q.x-d*(PL-11),q.z-MZ);if(L>25||q.x*d<PL-40)continue;
      C.push([0.5*profilAlt(q,'topsuzHareket',0.5)+0.5*Math.max(0,profilEgilim(q,'cezaSahasinaGecGirer'))+(q.mevki.kanat?0.2:0)-L/30,q]);}
    C.sort((a,c)=>c[0]-a[0]||a[1].n-c[1].n);
    for(let i=0;i<Math.min(A.gecGiris,C.length,Z.length);i++){const q=C[i][1],z=Z[i];q.kosu={u:z[0],w:z[1],t:1.8,tur:'gecGiris'};
      this.on('kosu',{p:q,tur:'gecGiris'});this.jestVer(q,'isaret',0.6,{x:z[0]*d,z:z[1]});}},
  kanatKonumu(p,t,s,ofs,geride){
    const A=MOTOR_AYAR;if(!A.kanatRol||geride||!p.mevki.kanat||!s||s.team!==t||s===p)return null;
    const d=this.dir[t],su=s.x*d;if(su<A.kanatBas)return null;
    const ky=Math.sign(p.mevki.w-MZ)||1,bk=Math.abs(s.z-MZ)>10?Math.sign(s.z-MZ):0;
    if(bk===-ky)return su>PL-A.kanatUzak?{u:PL-9,w:MZ-bk*6,ef:0.8,g:'kutu'}:null;
    let wc=clamp(A.kanatCizgi+2.5*profilEgilim(p,'iceKatEder')-1.5*profilEgilim(p,'cizgiyeIner'),2.5,10);
    if(bk===ky&&Math.min(s.z,PW-s.z)<A.kanatCizgi+5)wc=14;
    /* top kendi kanadında ve son bölgeye yakınken topun önünde, ofsayt çizgisinin hemen gerisinde (çizgiye ve savunma arkasına seçenek) */
    const u=bk===ky&&su>PL-A.kanatUzak?Math.max(su-4,Math.min(ofs-1.2,su+8)):Math.max(Math.min(ofs-A.kanatDerin,su+A.kanatOnde),su-4);
    return{u,w:ky<0?wc:PW-wc,ef:0.5,g:'genis'};},
  /* T7d: pres tetikleyicileri (plan T7 madde 8): kötü ilk dokunuş (kontrol eylemi kötü), geri pas (yeni sahip önceki sahipten ≥ 3 m geride),
     sırtı dönük alıcı (sahipliğin ilk 1 sn'si, yüzü kendi kalesine belirgin), çizgiye sıkışma (taç çizgisine ≤ 3 m). Savunan takımın tetiği
     presTetikSure sn sürer (takimAI: 1. adam daha uzaktan çıkar, 2. adam serbest). Her adım takimAI'nın başında. T7g: ilk sürümde çizgi 6 m ve
     sırt 1,5 sn / −0,3 idi — kanat oyuncusu neredeyse sürekli tetikti (şut 7,5 → 5,3'ün bir payı) */
  presTetikAdim(){const b=this.ball,s=b.sahip,PT=this._presTetik||(this._presTetik=[-9,-9]);
    if(s&&s!==this._ptSon){const o=this._ptSon;if(o&&o.team===s.team&&s.team!=null&&(s.x-this._ptX)*this.dir[s.team]<-3)PT[1-s.team]=this.t;this._ptSon=s;this._ptT=this.t;}
    if(s&&s.team!=null){this._ptX=s.x;const t=1-s.team,d=this.dir[s.team];
      if(s.eylem&&s.eylem.ad==='kontrol'&&s.eylem.kotu||this.t-this._ptT<1&&Math.cos(s.yon)*d<-0.6||s.z<3||s.z>PW-3)PT[t]=this.t;}},
  presTetikVar(t){return!!this._presTetik&&this.t-this._presTetik[t]<MOTOR_AYAR.presTetikSure;},
  /* T7d: sürücünün en tehlikeli pas yolu — 3–18 m içinde en çok ilerleten arkadaşı (ilerleme − 0,25·uzaklık > 2 m) */
  tehlikeliAlici(s){const d=this.dir[s.team];let en=null,ep=2;
    for(const q of this.teams[s.team]){if(q===s||!q.oyunda||q.rol==='GK')continue;const dx=q.x-s.x,dz=q.z-s.z,L=Math.hypot(dx,dz);if(L>18||L<3)continue;
      const v=dx*d-0.25*L;if(v>ep){ep=v;en=q;}}
    return en;},
  /* T7d: orta savunması (plan T7 madde 8): top kendi üçte birimizde ve kanattayken (|w − orta| > 12) markajı olmayan savunmacı ve derin orta
     sahalar ön direk, altıpas önü, arka direk ve penaltı noktasını tekil paylaşır (en yakın çiftten). 6 karede bir */
  kutuSavunmaAta(t,odak){const K=this._kutuSav||(this._kutuSav=[new Map(),new Map()]);
    if(this.kare%6!==(t?3:0))return K[t];
    const M=K[t],eskiK=MOTOR_AYAR.markajKalici?new Map(M):null;M.clear();if(!MOTOR_AYAR.kutuSavunma)return M;
    const d=this.dir[t],bu=odak.x*d;if(bu>-PL+30||Math.abs(odak.z-MZ)<=12)return M;
    const yan=Math.sign(odak.z-MZ)||1,MK=this._markaj&&this._markaj[t],Z=[[-PL+5.5,MZ+yan*2.2],[-PL+6.5,MZ],[-PL+6,MZ-yan*4.5],[-PL+11,MZ-yan]];
    const S=this.teams[t].filter(p=>p.oyunda&&(p.rol==='DEF'||p.rol==='OS'&&p.mevki.derin)&&!(MK&&MK.has(p))&&!(p.eylem&&p.eylem.kilit)&&p!==this.ball.sahip);
    const al=new Set();
    /* T18c (markajKalici): önceki bölge eşleşmesi geçerliyse korunur (aynı bölge sırası), yalnız boş bölgeler yeniden dağıtılır */
    if(eskiK)for(const [p,z] of eskiK){if(z.i!=null&&!al.has(z.i)&&S.includes(p)){al.add(z.i);M.set(p,{u:Z[z.i][0],w:Z[z.i][1],i:z.i});}}
    const C=[];for(let i=0;i<Z.length;i++)for(const p of S)C.push([Math.hypot(p.x-Z[i][0]*d,p.z-Z[i][1]),i,p]);
    C.sort((a,c)=>a[0]-c[0]||a[1]-c[1]||a[2].n-c[2].n);
    for(const [,i,p] of C)if(!al.has(i)&&!M.has(p)){al.add(i);M.set(p,{u:Z[i][0],w:Z[i][1],i});}
    return M;},
  /* T7d: girme/bekleme (plan T7; T5'ten devralınan): erken ve yandan müdahale isteği mudahaleTahmin'in kazanma − faul farkıyla ölçeklenir
     (1,05 + 1,2·(Pkazan − Pfaul), 0,4–1,6; maçta fark ortalaması −0,07, ortanca 0 → çarpan ortalaması ~1: hacim korunur, faul riski yüksek giriş
     azalır, kazanma şansı yüksek giriş artar); 9 karede bir, rakip başına */
  mudahaleTahminCarpani(p,s){const e=MOTOR_AYAR.mdhTahminEtki;if(!e)return 1;
    if(p._mtK!=null&&p._mtS===s&&this.kare-p._mtK<9)return p._mt;
    const T=mudahaleTahmin(this,p,s),c=clamp(1.05+1.2*(T.Pkazan-T.Pfaul),0.4,1.6);
    p._mt=1+e*(c-1);p._mtK=this.kare;p._mtS=s;return p._mt;},
  /* T7e: şutu takip ve dönen top (plan T7 madde 11). Kaleye 25 m içinden şutta, ceza sahasındaki ve yaydaki (kaleye 22 m) hücumculardan profili
     uygun olanlar (fırsatçı rol, ceza sahasına geç girme eğilimi, topsuz hareket; geride kalanlar asla) sırayla kale ağzına, uzak direğe ve penaltı
     noktasına takip koşusu yapar (en çok takipSayi; puanı eşiği geçen). Savunmada kaleciye en yakın stoper topun düşeceği bölgeyi (kale önü
     6 m), uzak taraftaki bek uzak direği 1,5 sn tutar (bolgeKonumu). Şuttan 3 sn kendi ceza sahasındaki savunmacı için uzaklaştırma daha değerlidir
     (mac-karar.js secenekler). Hücum: p.kosu {tur:'takip'}; savunma: _donenSav */
  sutTakipAta(p,xg){const A=MOTOR_AYAR;if(p&&p.team!=null)this._sonSut={p,xg:xg||0,t:this.t};   /* T7f: kaçan fırsat jesti için */
    if(!A.takipSayi||!p||p.team==null)return;
    const t=p.team,d=this.dir[t],gx=d*PL,b=this.ball;
    const DT=this._donenT||(this._donenT=[-9,-9]);DT[1-t]=this.t;
    if(Math.hypot(p.x-gx,p.z-MZ)>25)return;
    const yan=Math.sign(p.z-MZ)||1,GR=this._geride&&this._geride[t],Z=[[PL-3,MZ+yan*1.2],[PL-4,MZ-yan*4],[PL-11,MZ]],C=[];
    for(const q of this.teams[t]){if(q===p||!q.oyunda||q.rol==='GK'||(q.eylem&&q.eylem.kilit)||(GR&&GR.has(q)))continue;
      const L=Math.hypot(q.x-gx,q.z-MZ);if(L>22)continue;
      /* T6e (2026-10-10): eşik 0,05 → −0,05, uzaklık cezası L/40 → L/50 — ceza sahasına geç giren orta saha da takibe girer (T7 sonunda
         takip eden hücumcu 0,92; bant 1–3) */
      const pr=q.profil,puan=0.5*profilAlt(q,'topsuzHareket',0.5)+0.4*Math.max(0,profilEgilim(q,'cezaSahasinaGecGirer'))+(pr&&pr.rol==='firsatci'?0.4:0)+(q.rol==='FV'?0.2:0)-L/50;
      if(puan>-0.05)C.push([puan,q]);}
    C.sort((a,c)=>c[0]-a[0]||a[1].n-c[1].n);
    for(let i=0;i<Math.min(A.takipSayi,C.length,Z.length);i++){const q=C[i][1];q.kosu={u:Z[i][0],w:Z[i][1],t:1.6,tur:'takip'};this.on('kosu',{p:q,tur:'takip'});}
    /* savunma: kaleciye en yakın stoper kale önüne, uzak bek uzak direğe */
    const s=1-t,sd=this.dir[s],ogx=-sd*PL,M=new Map();let st=null,sb=null,es=1e9,eb=1e9;
    for(const q of this.teams[s]){if(!q.oyunda||q.rol!=='DEF'||(q.eylem&&q.eylem.kilit))continue;const L=Math.hypot(q.x-ogx,q.z-MZ);
      if(!q.mevki.bek){if(L<es){es=L;st=q;}}else if(Math.sign(q.z-MZ)!==yan&&L<eb){eb=L;sb=q;}}
    if(st)M.set(st,{u:-PL+6,w:lerp(b.z,MZ,0.5)});if(sb)M.set(sb,{u:-PL+1.5,w:MZ-yan*3.4});
    this._donenSav={t:this.t,team:s,M};},
  /* duruşta hoca sorulur: m.hoca(t, maç durumu, taban, maç) bir yama dönerse uygulanır (yoksa hiçbir şey olmaz; rastlantı çekmez) */
  hocaKapisi(){if(typeof this.hoca!=='function')return;
    for(let t=0;t<2;t++){const y=this.hoca(t,this.macDurumu(t),Object.assign({},this.taktikTaban[t]),this);if(y&&typeof y==='object')this.taktikDegistir(t,y,'hoca');}}
});
