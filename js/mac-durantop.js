/* ============ Chairman — maç motoru: duran toplar (mantık, çizimsiz) ============
   Sahibi: K akışı (T8, 2026-10-11; gerçekçilik planı §4 T8 “Duran toplar”). Duruşun akışı (durusBaslat, stepDurus, durusKullan, top toplayıcılar,
   hakemler) js/mac-kurallar.js'te kalır; bu dosya duran topun görevlerini, yerleşimini, hazırlığını ve kullanımını taşır.
   T8-0 (ölçüm; sonuç birebir aynı): duran topun gerçek kullanım anı. durusKullan (ve santra, js/mac-motoru.js stepKick) b.kullanim'ı kurar;
   kullananın topa ilk dokunuşu (vuruş, taç atışı, sürüş dokunuşu ya da kalecinin topu eline alması) 'kullanim' olayını yayar (Match.dokunus);
   başka oyuncunun dokunuşu bayrağı siler. Olay {tur, alt, bolge, p, takim, x, z, hedef {x, z, alici}, hazirlik (duruşun başından kullanıma, sn),
   baraj, barajdakiler, du}. alt: korner kisa | ice | disa | duz; serbest sut | orta | kisa | uzun | pas | surus; tac kisa | uzun (≥ 18 m);
   kaleVurusu kisa | uzun | elle (kaleci topu yerden vurmadan eline aldı); penalti sag | sol | orta (vuranın gözünden); santra pas; sürüşle
   kullanılan her duran top surus. bolge (korner ve ortalanan serbest vuruş): on (ön direk) | arka | orta (altıpas) | nokta (penaltı noktası) |
   disari (ceza sahası kenarı ve yay). Ölçüm araclar/olcumler/k-duran.js, senaryo araclar/senaryolar/d-duran.js.
   T8a (görevler, hazırlık, çabuk serbest vuruş): duruşun başında görevler profilden dağıtılır (duranGorevAta): du.gorev (oyuncu → görev) ve
   oyuncuda p.duranRol {rol, hx, hz, hedef, takim} (motor → çizim). Korner: hücumda kutuya çıkan sayısı maç durumundan (kornerKutu ± acele/koru,
   rakibin ileride bıraktığıyla azalır), kafacılar (sıçrama + boy) kutuda sıralı yerlere, ikinci top şut gücünden yayda, geride kalanlar pozisyon
   alma + çabukluk + hızdan (rakibin ileride bıraktığı + 1, en az 1); savunmada iki en iyi kafacı bölgede (ön direk ve altıpas ortası), kutudaki
   her hücumcuya kafa sırasıyla adam (kale tarafında 0,9 m), ön direkte bir adam, yayda ikinci topa bir adam, ileride 1–2 hızlı oyuncu, kaleci
   çizgiden 0,9 m. Penaltı: herkes ceza sahası ve yayın dışında, iki hücumcu ve iki savunmacı yayın kenarında ribaunda hazır. Hazırlık (§7 madde 5):
   tehlikeli duran topta (korner, barajlı ve kenar serbest vuruşu) duruşun başından en az 10, en çok 14 sn; arada kullanım koşulu “görevliler
   yerinde” (duranYerinde m içinde; barajlı vuruşta hakem barajı 9,15 m'ye dizdi); penaltıda 8–12 sn. Kullananın geri çekilmesi türe ve profile göre
   (duranGeri; kornerde 3–4,5, barajlı vuruşta 4–7, penaltıda 5–7 m), topu yere koyup (yerlestir eylemi, 0,6 sn) geri adımlarla çekilir;
   kornerde ve kenarda vurmadan önce elini kaldırır (jest 'kol', 0,8 sn). Çabuk serbest vuruş: tehlikesiz, kartsız serbest vuruşta kararlı
   (karar ≥ hizliSerbest) kullanan, 6 m içinde en çok bir rakip ve önünde boş bir arkadaş varken beklemeden kullanır (düdük yok, rakip 9,15 m'ye
   itilmez). Faulden sonra yuvarlanan topu en yakın oyuncu durdurur (topDurdur). Kullananın seçiminde yerdeki (kilitli eylemdeki) oyuncu
   seçilmez (penaltı hariç). Rastlantı çekmez. */
'use strict';
ayarEkle('K',{
  duranSure:[8,11],            // T8a (§7 madde 5): tehlikeli duran topta duruşun başından koşunun başına en az / en çok (sn; koşu ve işaret ~1,5–2,5 sn: temas 10–14; T10d: 8,5–11,5 → 8–11);
                               // arada koşul “görevliler yerinde”
  duranHazir:[0.25,1.4,0.15,0.35,1.2],   // T8a: kullanan hazır olduktan sonra en az bekleme (sn): taç, korner, kale vuruşu, serbest vuruş, penaltı (T10d: kale vuruşu 0,5 → 0,3, penaltı 1,5 → 1,2; T10g: taç 0,5 → 0,25, kale vuruşu 0,3 → 0,15, serbest 0,6 → 0,35)
  duranYerinde:1.5,            // T8a: görevli hedefine bu kadar (m) yakınsa yerinde
  duranGeri:[3,7],             // T8a: kullananın geri çekilmesinin sınırları (m); türden ve profilden (kornerde 3–4,5, barajlı vuruşta 4–7)
  penaltiSure:[6,9],           // T8a: penaltıda duruşun başından koşunun başına en az / en çok (sn; temas 8–12; T10d: 6,5–9,5 → 6–9)
  hizliSerbest:0.6,            // T8a: çabuk serbest vuruş için kullananın en az karar özelliği
  kornerKutu:5,                // T8a: kornerde kutuya çıkan hücumcu (maç durumuyla 4–7)
  duranKosFaz:0.15,            // T23a3 (2026-10-18): duran topta koşu tetiği (kullananın temasına 0,55 sn kala) oyuncuya göre kayar — ön direk +, penaltı noktası ve
                               // orta 0, arka direk −½, uzak −1 kat; öbürleri numaradan ±1 kat (ortalaması 0); 0: hepsi aynı karede (kümelerin %17'si)
  kornerKisa:0.18,             // T8b: kısa korner olasılığı (kullananın yaratıcılığıyla 0,6–1,4 katı; gerçek ~%20, Ek E)
  duranRolSure:6,              // T8b: vuruştan sonra görev düzeninin en uzun süresi (sn)
  barajZipla:1.0,              // T8c: barajın sıçrama yüksekliği, oyuncunun durarak sıçramasının katı (planlayıcı ve motor aynı)
  barajZiplaZaman:0.06,        // T8c: baraj üyesinin kalkış zamanlamasının σ'sı (sn; kullananın temasından sonra hazırlık + bu)
  serbestDevam:2.3,            // T8c: serbest vuruşta oyunu sürdürmenin (kısa ya da uzun pas, sürüş) değeri, P(gol)·100 biriminde (T8f: 2,0'da 30 m'de %51 doğrudan şut; 2,3'te %47,5)
  serbestOrta:6.0,             // T8c: kenardan ve ceza sahasına yakından ortanın değeri (P(gol)·100; d-duran'da korner %4,8, kenar ortası biraz üstü);
                               // ortadan ve uzaktan azalır. 5,0'te kenardan %22 doğrudan şut
  serbestRutin:0.12,           // T8c: barajlı vuruşta kısa pas rutini olasılığı (kullananın yaratıcılığıyla 0,6–1,4 katı; taktik çeşitlilik; 0,08'de 18 m'de %92,5 şut)
  serbestTau:1.0,              // T8c: serbest vuruş kararının sıcaklığı (karar ve duran top becerisiyle 0,6–1,4 katı; 1,5'te kenardan %30–40 şut)
  penaltiSapma:0.85,           // T8d: penaltı vuruşunun hata çarpanı (baskısız 11 m; soğukkanlılıkla ×(1 + 0,8·(0,5 − s))); eski sabit 0,55. T19c (2026-10-17): 0,85 —
                               // d-penalti 4 × 1600 (penaltiKose 3,2 ile): 0,55'te gol %83,5 · kurtarış 14 · kaçırma 1,7; 0,7'de 79,8 · 16,5 · 2,3; 0,85'te 76,4 · 18,8 · 3,0
                               // (gerçek ~76–78 · 16–20 · 5–7; plan hatası büyüyünce ortaya yaklaşır, kaçırma az artar)
  penaltiKose:3.2,             // T19c (2026-10-17): penaltı planında direğe 0,46 m köşe adayı (±m; kale ortasından); 0: yalnız ±2,9 m köşe (T18'in yolu)
  /* A4-1 (2026-10-15; gerçekçilik planı §4 A4, Ek D): barajlı serbest vuruşta topun başında iki kişi ve aldatma koşusu */
  serbestIkili:0.45,           // A4-1: barajlı serbest vuruşta ikinci vurucunun topun yanında durma olasılığı (0: kapalı, T16'nın aynısı; d-duran'da %43)
  serbestAldatma:0.6,          // A4-1: iki kişiyken şut kararında ikinci vurucunun kullanandan önce topun üstünden koşma olasılığı
  aldatmaTepki:0.04,           // A4-1: aldatma koşusu topun yanından şuttan en çok 0,8 sn önce geçtiyse kalecinin tepkisine eklenen süre (sn; js/mac-kaleci.js)
  /* A4-2 (Ek D): kornerde perdeleme ve yaya geri pas */
  kornerPerde:0.15,            // A4-2: ortalı kornerde (kutuda ≥ 4) kutudaki en zayıf kafacının en iyi kafacının markajcısını perdeleme olasılığı (0: kapalı). 0,3'te
                               // kornerlerin %20'si, perdeli kornerde gol %6,1 · perdesiz %4,2 (3200 korner). Motorun korner verimi gerçeğin (~%3) üstünde (A4: fazla
                               // hücumun ilk kafası bloklandıktan sonraki karambolde, %16,4) — sıklık düşük: %10, korner başına gol %4,7 (kapı %3–5)
  kornerGeri:0.03              // A4-2: ortanın yerine ceza sahası kenarına geç koşan ikinci topçuya yerden pas (yaya geri pas) olasılığı (0: kapalı; kornerlerin
                               // %2,9'u, korner başına 0,83 şut; gol %11,7 — 213 korner, ±2,2: yaydaki savunmacı geç koşuyu izlemiyor)
  ,markajYan:[0.8,0.3]         // T17b (2026-10-16; gerçekçilik planı §4 T17): duran topta adam markajcısının duruşu — adamının [kale tarafında, top tarafında] (m); [0,5; 0,5]
                               // markajcıyı kafanın yolundan çekti ama hücumcunun ilk kafasını serbest bıraktı (ilk kafadan gol %5 → 9, korner başına gol %5,5); [0,8; 0,3]: blok payı %23, ilk kafadan gol %4,9;
                               // boş/0: T8 duruşu (kale tarafında 0,8 m, tam hücumcu–kale çizgisinde: ilk kafaların %38'i markajcının havadaki gövdesine çarpıyordu)
  /* Z2 (2026-10-19 gece; FUTBOL_KUTUPHANESI §12.2 ve §12.6, kutuphane/F-duran-toplar.md F.8; kullanıcı kararı: tempo B) */
  ,sahne:15                    // Z2: duran top sahnesi bit maskesi — 1 tempo ve evreler (bağlama göre süre, kullananın yürüyüşü, yay koşusu, bakış, savunanın düzeni),
                               // 2 korner rutinleri, 4 serbest vuruş sahnesi (sprey, yatan barajcı, barajdan 1 m, uzaktan kutu dolumu), 8 taç sahnesi; 0: Z1 (durusSaat 0 ile birebir)
  ,tempo:{tac:7,tacUzun:13,korner:18,baraj:24,kenar:18,serbest:9,kaleVurusu:11,penalti:27}   // Z2a: tempo B — duruşun başından kullanıma hedef gerçek sn (gerçeğin kabaca yarısı;
                               // PL 2026/27: taç 15, korner 34, doğrudan şut serbest vuruşu 75, kale vuruşu 28, penaltı 117 sn — kutuphane/F F.0.3). Z1'de 6,0 / 12,6 / 11,9 / 8,5 / 11,0
  ,tempoBaglam:[1.3,0.75]      // Z2a: önde son 20 dakikada (koru) ve geride (acele) hedef süre çarpanı; zaman geçirme (zgEk) ve kuralın sayımı ayrıca
  ,tempoSapma:0.15             // Z2a: duruştan duruşa ± pay (h2 özetiyle; ana zar dizisi kaymaz)
  ,duranYay:[0.45,0.75]        // Z2a: geri çekilme noktası vuran ayağın ters yanına dönük (rad; duran top becerisinden; gerçek 20–45°, kutuphane/F F.2.1) — yay koşusu
  ,kornerIce:0.8               // Z2b: takımın içe dönen korner tercihi (kullananın seçiminde ayak; Premier Lig 2025/26 ortalananların ~%83'ü içe dönen)
  ,kornerRutin:{orta:1,onDirek:0.35,arkaDirek:0.3,tren:0.22,alcak:0.2,geri:0.12}   // Z2b: korner rutinlerinin ağırlıkları (kısa korner kornerKisa ile ayrıca)
  ,kornerOncelik:1.8           // Z2b: rutinin hedef koşucusuna giden ortanın değer çarpanı (kornerSecenegi)
  ,yatanBaraj:0.5              // Z2c: en az 3 kişilik barajda barajın arkasına yatan oyuncu olasılığı (h2)
  ,barajYani:0.7               // Z2c: barajın iç ucunun 1 m dışında perde duran hücumcu olasılığı (h2; barajdan 1 m kuralı her zaman)
  ,uzakDolum:0.35              // Z2c: rakip yarıda uzak serbest vuruşta kutuyu doldurup uzun orta olasılığı (geride son dakikalarda 1)
  ,tacPres:1                   // Z2d: taçta savunan alıcıları adam adama tutar (1), atana 2 m'de perde; 0: yalnız düzen
  ,tacSayim:5                  // Z2d: geciktirilen taç ve kale vuruşunda hakemin görünür sayımı (sn; IFAB 2026/27)
});
const DT_HAZIR={tac:0,korner:1,kaleVurusu:2,serbest:3,penalti:4};
/* kafa sırası (T3'ten: sıçrama + boy) ve ikinci top (şut gücü, uzaktan vurma) */
const dtKafa=p=>profilAlt(p,'sicrama',p.oz.kafa)+(p.boy||1);
/* T8d: penaltı vuruşunun hata çarpanı: baskısız 11 m (penaltiSapma) × soğukkanlılık (0,5'te 1; 0,2'de 1,24, 0,8'de 0,76) — plan ve vuruş aynı */
const penaltiSapmaK=p=>MOTOR_AYAR.penaltiSapma*(1+0.8*(0.5-profilAlt(p,'sogukkanlilik',p.oz.karar)));
/* T8c: doğrudan serbest vuruşun tekniği (vuruş hatası ve karar aynı): şut becerisi + duran top */
const serbestTeknik=p=>0.4*p.oz.sut+0.6*profilAlt(p,'duranTop',p.oz.sut);
const dtIkinci=p=>profilAlt(p,'sutGucu',p.oz.sut)+0.3*profilEgilim(p,'uzaktanVurur')+(p.rol==='OS'?0.1:0);
/* kornerde hücum yerleri, kafa sırasıyla: [rol, başlangıç u, w, koşu u, w] — kale çizgisine göre (u = PL − m), w yan çarpanıyla (ön direk +).
   T8b: koşu kullananın temasından ~0,55 sn önce başlar (durusYerlesim 'kullan' evresi), vuruştan sonra görev düzeninde sürer */
const DT_KORNER_HUCUM=[['hedefOrta',PL-10,-0.5,PL-6.5,-0.3],['hedefOn',PL-9.5,2.6,PL-6,2.3],['hedefArka',PL-10.5,-4.2,PL-7,-3.6],['hedefNokta',PL-13.5,1,PL-11,0.5],
  ['perde',PL-2.4,1.2,PL-2.4,1.2],['hedefUzak',PL-12.5,-6.5,PL-9.5,-6],['hedefNokta',PL-14,-2.5,PL-11.5,-2]];
const DT_HEDEF=new Set(['hedefOrta','hedefOn','hedefArka','hedefNokta','hedefUzak']);
/* Z2d: taç sahnesinin rolleri (js/mac-durantop.js tacGorev, tacRolAdim; çizim okur) */
const TAC_ROL=new Set(['tacGelgit','tacIce','tacGeri','tacMarkaj','tacPerde']);
/* K1 (2026-10-20; madde F): hakemin spreyinin zamanı (sn; evrenin başından) — motorla çizimin tek kaynağı. sure: evrenin süresi ('top' topun yeri,
   'cizgi' barajın çizgisi); s0 → s0 + sw: elin ve köpüğün açılışı; don: gövdenin işaretten dönüşü. 'cizgi'de motorun bakışı sıkılan noktayı aynı
   s0 → s0 + sw'de süpürür, don'da gövde topa döner ('cekil'den önce biter); 'top'ta gövde evre boyunca topa bakar (yay topun çevresinde), evre bitince
   gidiş yönüne döner (don = sure). Motor evreleri ve bakışı buradan, çizim (js/animasyon.js anmHkPoz, anmHakemAdim, anmSpreyKare) olayın zaman
   alanından okur (sprey {…, zaman}) */
const DT_SPREY={top:{sure:1.2,s0:0.1,sw:0.95,don:1.2},cizgi:{sure:1.6,s0:0.1,sw:1.15,don:1.25}};
/* T8c: kenar serbest vuruşunda kutudakiler, kafa sırasıyla: [rol, başlangıç w (savunma çizgisinin 0,6 m gerisinde), koşu u, w] — w yan çarpanıyla
   (ön direk +) */
const DT_KENAR=[['hedefOn',3.5,PL-6,2.2],['hedefOrta',0.5,PL-7,0],['hedefArka',-3,PL-7.5,-3.5],['hedefNokta',-6,PL-11,-0.5],['hedefUzak',-9,PL-8.5,-6],['hedefNokta',6.5,PL-12,2]];
Object.assign(Match.prototype,{
  /* ============ T8-0: kullanım ============ */
  /* kullanım bayrağı: tur, kullanan, duruşun başladığı an (t0), duran topun yeri ve duruş (santrada yok) */
  kullanimBaslat(tur,tk,du,t0){const b=this.ball;b.kullanim={tur,p:tk,t0,x:du?du.x:b.x,z:du?du.z:b.z,cikti:false,du:du||null};},
  /* kullananın ilk dokunuşu: türü ve hedefi kullananın eyleminden (vuruşun seçimi, taç atışının hedefi), topun dönüşünden (korner içe/dışa) */
  kullanimBildir(p,K){
    if(K.tur==='penalti')this._penaltiSon={takim:p.team,t:this.t,g0:this.score[p.team]};   /* T10e: kaçan penaltının güveni (js/mac-takim.js guvenAdim) */
    const b=this.ball,e=p.eylem,sec=e&&e.ad==='vurus'?e.sec:null,d=this.dir[p.team],tur=K.tur;
    let alt='surus',bolge=null,hx=null,hz=null,alici=null;
    if(b.tasiyan===p)alt='elle';
    else if(e&&e.ad==='tac'){hx=e.hx;hz=e.hz;alici=e.hedef||null;alt=hx!=null&&hyp(hx-p.x,hz-p.z)>=18?'uzun':'kisa';}
    else if(sec){hx=sec.hx;hz=sec.hz;alici=sec.alici||null;const L=hyp(hx-K.x,hz-K.z);
      if(tur==='korner'){
        /* içe dönen: falsonun yana itişi (Magnus; egri'nin işaretiyle hızın sola dönüğü) kale çizgisine doğru */
        if(sec.tur!=='korner')alt=K.du&&K.du.rutin==='geri'?'geri':'kisa';else{   /* A4-2: yaya geri pas */const g=b.egri||0;alt=Math.abs(g)<0.02?'duz':g*(-b.vz)*d>0?'ice':'disa';}}
      else if(tur==='penalti'){const dz=(hz-MZ)*d;alt=Math.abs(hz-MZ)<1?'orta':dz>0?'sag':'sol';}   /* zt·d > 0 vuranın sağı (sutEgriYani) */
      else if(tur==='kaleVurusu'||tur==='santra')alt=tur==='santra'?'pas':(sec.tip==='hava'?'uzun':'kisa');
      else alt=sec.tur==='sut'?'sut':sec.tur==='orta'||sec.tur==='korner'?'orta':L<15?'kisa':sec.tip==='hava'&&L>=30?'uzun':'pas';
      /* hedef bölgesi (korner ve orta): u kaleye göre, ön direk duran topun yanında */
      if(alt==='ice'||alt==='disa'||alt==='duz'||alt==='orta'){const u=hx*d,yan=Math.sign(K.z-MZ)||1,wr=(hz-MZ)*yan;
        bolge=u<PL-13?'disari':u<PL-8?(Math.abs(hz-MZ)<5?'nokta':'disari'):wr>0.8?'on':wr<-1.5?'arka':'orta';}}
    const du=K.du;
    /* T8a: vuruşla kullanılan duran topta oyun temasta başlar (durusKullan 'kullan' evresi); ofsayt muafiyeti (taç, korner, kale vuruşu) ve duran
       toptan gol sayımı (r-karne) temas anından */
    if(du&&this.phase==='durus'&&this.durus===du){this.phase='play';this.phaseT=0;this.durus=null;}
    if(this.sonKullanim&&this.sonKullanim.p===p)this.sonKullanim.t=this.t;
    if(du&&tur!=='santra')this.duranSonrasiBaslat(du,alici,hx,hz);   /* T8b: vuruştan sonra görev düzeni */
    if(du&&alt==='sut'&&du.barajdakiler&&du.barajdakiler.length)this.barajZipla(du);   /* T8c; T8f: kenar vuruşunun 1–2 kişilik barajı da sıçrar */
    if(du)this.yatanKaldir(du);   /* Z2c: yatan barajcı vuruşla kalkar (kalkarken alçak şutu keser: govdeCarpmasi) */
    this.on('kullanim',{tur,alt,bolge,p,takim:p.team,x:K.x,z:K.z,hedef:hx!=null?{x:hx,z:hz,alici}:null,hazirlik:this.t-K.t0,
      baraj:!!(du&&du.baraj),barajdakiler:du&&du.barajdakiler||null,du});
  },

  /* ============ T8a: görevler ============ */
  duranRolTemizle(){for(const p of this.players)p.duranRol=null;},
  /* tehlikeli serbest vuruş: kaleye 15–33 m, kale ortasından 17 m'den yakın, dolaylı değil (baraj kurulur) */
  tehlikeliSerbest(du){const u=du.x*this.dir[du.takim],dz=Math.abs(du.z-MZ);return !du.endirekt&&u>PL-33&&u<PL-15&&dz<17;},
  /* serbest vuruşun sınıfı (T8a; k-duran ile aynı): baraj, kenar (barajsız, kaleye 35 m'den yakın ve kale ortasından 12 m'den yanda), uzak, geri */
  /* T10c: hakem topu (sakatlıkta hakemin durdurduğu oyun; js/mac-sakatlik.js) ayrı sınıf: baraj ve görev yok */
  serbestSinif(du){const u=du.x*this.dir[du.takim];return du.hakemTopu?'hakemTopu':this.tehlikeliSerbest(du)?'baraj':u<=0?'geri':u>PL-35&&Math.abs(du.z-MZ)>12?'kenar':'uzak';},
  duranTehlikeli(du){return du.tur==='korner'||du.sinif==='baraj'||du.sinif==='kenar';},
  /* duruşun başında (durusBaslat; kullanan seçildikten sonra) görevler dağıtılır; oyuncunun p.duranRol'ü aynı kayıttır */
  duranGorevAta(du){
    this.duranRolTemizle();this._duranSonrasi=null;const G=du.gorev=new Map();du.yatan=null;   /* Z2c: yeniden dağıtımda yatan yeniden seçilir */
    if(du.tur==='serbest'){du.sinif=this.serbestSinif(du);if(du.sinif==='kenar')this.kenarGorev(du,G);if(du.sinif==='baraj'||du.sinif==='kenar')this.barajKur(du,G);
      if(du.sinif==='baraj')this.ikiliKur(du,G);   /* A4-1 */
      /* Z2c (sahne&4): rakip yarıda uzak serbest vuruşta kutu dolumu ve uzun orta — kenarın görev düzeniyle (hat ceza sahası çizgisinin önünde) */
      if(du.sinif==='uzak'&&(MOTOR_AYAR.sahne&4)&&!du.hakemTopu){if(du.dolum==null)du.dolum=this.uzakDolumMu(du);if(du.dolum)this.kenarGorev(du,G);}}   /* karar bir kez (kullanan değişip görevler yeniden dağıtılınca da aynı) */
    if(du.tur==='korner')this.kornerGorev(du,G);
    else if(du.tur==='penalti')this.penaltiGorev(du,G);
    else if(du.tur==='tac'&&(MOTOR_AYAR.sahne&8))this.tacGorev(du,G);   /* Z2d */
    for(const [p,g] of G)p.duranRol=g;
  },
  /* korner görevleri (T8a): hücum kutu, geride, ikinci top; savunma bölge, adam, ön direk, yay, ileride, kaleci */
  kornerGorev(du,G){
    const t=du.takim,s=1-t,d=this.dir[t],yan=Math.sign(du.z-MZ)||1,tk=du.kullanan,A=MOTOR_AYAR,Dt=this.macDurumu(t),Ds=this.macDurumu(s);
    const ekle=(p,rol,u,w,ek)=>{G.set(p,Object.assign({rol,hx:d*u,hz:w,takim:p.team,hedef:null},ek||{}));};
    const huc=this.sahadakiler(t).filter(p=>p.rol!=='GK'&&p!==tk),sav=this.sahadakiler(s).filter(p=>p.rol!=='GK');
    /* savunmanın ileride bıraktığı: 1; savunan geride ve hücum değilse 2 */
    const Ld=Math.min(sav.length>7?2:1,1+(Ds.acele>0.5&&Dt.acele<=0.5?1:0));
    const gerideN=Math.max(1,Ld+(Dt.acele>0.6?0:1)),ikinciN=1;
    const kutuN=clamp(Math.min(clamp(Math.round(A.kornerKutu+2*Dt.acele-1.5*Dt.koru)-(Ld>=2?1:0),4,7),huc.length-gerideN-ikinciN),0,7);
    /* kutu: kafa sırası; geride: kalanlardan pozisyon alma + çabukluk + hız; ikinci top ve fazlası: şut gücü */
    const S=huc.slice().sort((a,c)=>dtKafa(c)-dtKafa(a)||a.n-c.n),kutu=S.slice(0,kutuN);
    const gs=p=>0.5*profilAlt(p,'pozisyonAlma',0.5)+0.3*profilAlt(p,'cabukluk',0.5)+0.2*p.oz.hiz;
    const kalan=S.slice(kutuN).sort((a,c)=>gs(c)-gs(a)||a.n-c.n),geride=kalan.slice(0,Math.min(gerideN,kalan.length));
    const diger=kalan.slice(geride.length).sort((a,c)=>dtIkinci(c)-dtIkinci(a)||a.n-c.n);
    kutu.forEach((p,i)=>{const Y=DT_KORNER_HUCUM[i];ekle(p,Y[0],Y[1],MZ+yan*Y[2],{kx:d*Y[3],kz:MZ+yan*Y[4]});});
    /* T8b (karar 2): ikinci yarının son iki dakikasında ve uzatmada gerideyse kaleci de kutuya çıkar — penaltı noktasının arkasından arka
       direğe koşar (adamsız kalır); vuruştan sonraki pencerede görevini izler, pencere bitince kalesine koşar (js/mac-dizilis.js) */
    const klH=this.kaleci(t);if(this.half===2&&Dt.fark<0&&Dt.kalanDk<=2&&klH&&klH.oyunda)ekle(klH,'hedefNokta',PL-13,MZ-yan*1.5,{kx:d*(PL-8),kz:MZ-yan*2.5});
    /* T8b: rutin (Ek D) — kısa korner kornerKisa olasılığıyla (kullananın yaratıcılığı 0,6–1,4 katı; kutunun dışında, ikinci topçudan sonraki
       oyuncu varsa): kısa seçenek 6–10 m'de, kale çizgisine 6 m; yoksa orta (hedef vuruşta değerden seçilir) */
    const kisaP=diger.length>=2?diger.slice(1).sort((a,c)=>profilAlt(c,'orta',c.oz.pas)-profilAlt(a,'orta',a.oz.pas)||a.n-c.n)[0]:null;
    du.rutin=kisaP&&this.rast()<A.kornerKisa*(0.6+0.8*profilAlt(tk,'yaraticilik',0.5))?'kisa':'orta';
    /* A4-2: yaya geri pas (Ek D) — kornerGeri olasılıkla ortanın yerine ilk ikinci topçu ceza sahasının kornere yakın kenarına geç koşar (yaydaki
       savunmacının öbür yanı; 23 m'den 17 m'ye), korner ona yerden oynanır (kornerSecenegi; kullanımın alt'ı 'geri'). Karar rastlantısız özetle */
    if(A.sahne&2){if(du.rutin==='orta')du.rutin=this.kornerRutinSec(du,tk,Dt,diger.length>0);}   /* Z2b: rutin (geri: ceza sahası dışına kesme dahil) */
    else if(du.rutin==='orta'&&A.kornerGeri>0&&diger.length&&this.kornerOzet(du,0)<A.kornerGeri)du.rutin='geri';
    let ik=0;for(const p of diger){if(du.rutin==='kisa'&&p===kisaP){ekle(p,'kisa',PL-6,du.z-yan*8);continue;}
      if(du.rutin==='geri'&&ik===0){ekle(p,'geri',PL-23,MZ+yan*7,{kx:d*(PL-17),kz:MZ+yan*6});ik++;continue;}
      if(ik===0)ekle(p,'ikinciTop',PL-19,MZ-yan*2);else ekle(p,'ikinciTop',PL-17.5,MZ+yan*(9+3*ik));ik++;}
    /* savunma: ileride kalanlar (hız; forvet önce) */
    const ileri=sav.slice().sort((a,c)=>((c.rol==='FV'?0.3:0)+c.oz.hiz)-((a.rol==='FV'?0.3:0)+a.oz.hiz)||a.n-c.n).slice(0,Ld);
    ileri.forEach((p,i)=>ekle(p,'ileride',-8,MZ+(Ld===1?3:(i?6:-6))));
    /* geride kalan hücumcu ileride kalanın kale tarafında, yoksa orta çizginin önünde */
    geride.forEach((p,i)=>{if(ileri[i])ekle(p,'geride',-10.5,MZ+(Ld===1?3:(i?6:-6)));else ekle(p,'geride',-4,MZ+[-9,9,0,-15,15][i%5]);});
    let D=sav.filter(p=>!ileri.includes(p)).sort((a,c)=>dtKafa(c)-dtKafa(a)||a.n-c.n);
    /* bölge: en iyi iki kafacı ön direk bölgesi ve altıpas ortası */
    const Z=[['bolge',PL-5.5,yan*1.8],['bolge',PL-6.5,-yan*0.8]];
    for(let i=0;i<Z.length&&D.length;i++){const p=D.shift();ekle(p,Z[i][0],Z[i][1],MZ+Z[i][2]);}
    /* adam: kutudaki hücumcular kafa sırasıyla, sıradaki kafacılara */
    for(const o of kutu){if(!D.length)break;const p=D.shift();ekle(p,'adam',null,null,{hedef:o});const g=G.get(p);g.hx=o.x;g.hz=o.z;}
    /* A4-2: perdeleme (Ek D) — ortalı kornerde kornerPerde olasılıkla kutudaki en zayıf kafacı (hedef rollerinden; kaleciyi perdeleyen değil) en iyi
       kafacının markajcısının önüne geçer: markajcıyla arkadaşının koşu noktası arasında 0,8 m, koşu başlayınca yerinde kalır (durusYerlesim).
       Markajcı rakipten kaçınmaz, bedene takılır. Rol 'perdeAdam' (hedef arkadaş, perdeM markajcı); kendi koşusu yok. Karar rastlantısız özetle */
    if(du.rutin==='orta'&&kutu.length>=4&&A.kornerPerde>0&&this.kornerOzet(du,1)<A.kornerPerde){const hd=kutu[0];let mk=null;
      for(const [q,g] of G)if(g.rol==='adam'&&g.hedef===hd){mk=q;break;}
      let pp=null;for(let i=kutu.length-1;i>0;i--){const g=G.get(kutu[i]);if(g&&DT_HEDEF.has(g.rol)){pp=kutu[i];break;}}
      if(mk&&pp){const g=G.get(pp);g.rol='perdeAdam';g.hedef=hd;g.perdeM=mk;g.kx=undefined;g.kz=undefined;}}
    /* ön direk: kalanların en çabuğu (kafası en zayıflardan); yay: kalan */
    if(D.length){D.sort((a,c)=>(profilAlt(c,'cabukluk',0.5)-dtKafa(c))-(profilAlt(a,'cabukluk',0.5)-dtKafa(a))||a.n-c.n);const p=D.shift();ekle(p,'direk',PL-0.6,MZ+yan*(GW2-0.5));}
    /* T8b: kısa kornere çıkan — kısa seçeneğin kale tarafında, toptan 9,6 m */
    if(du.rutin==='kisa'&&D.length){const p=D.shift(),kx=d*(PL-6),kz=du.z-yan*8,L=hyp(kx-du.x,kz-du.z)||1;
      G.set(p,{rol:'kisaCikan',hx:du.x+(kx-du.x)/L*9.6,hz:du.z+(kz-du.z)/L*9.6,takim:p.team,hedef:null});}
    D.forEach((p,i)=>ekle(p,'yay',PL-17,MZ+(i%2?yan:-yan)*(2+3*Math.floor(i/2))));
    /* kaleci: çizgiden 0,9 m, ön direğe 0,3 m */
    const kl=this.kaleci(s);if(kl&&kl.oyunda)ekle(kl,'kaleci',PL-0.9,MZ+yan*0.3);
    if(A.sahne&2)this.kornerRutinKur(du,G,kutu,yan,d);   /* Z2b */
  },
  /* ============ Z2b: korner rutinleri (2026-10-19 gece; kutuphane/F F.1.1–F.1.9, F.8.8) ============
     Kullanan ayağına göre seçilir (js/mac-kurallar.js kullananSec: takımın içe dönen tercihi kornerIce); rutin vurucunun dönüşüne, maç durumuna ve
     rutin ağırlıklarına göre (kornerRutin; h2 özetiyle, ana zar dizisi kaymaz): 'orta' (içe dönen 6 pas merkezine; dışa dönende en iyi kafacı
     penaltı noktasına koşarak gelir), 'onDirek' (ön direkte sıyırma: hedefOn kafayla arka direğe uzatır, arka direkte bitirici), 'arkaDirek' (küme
     arka direkte; ikisi ön direğe ve merkeze koşup markajcılarını sürükler, en iyi kafacı arka direkte), 'tren' (penaltı noktasında sıra; vurucu
     koşunca dağılır), 'alcak' (alçak sert içe dönen, ön direğe dalış; içe dönen vurucuyla), 'geri' (ceza sahası dışına yerden kesme ve gelişine
     vuruş; A4-2'nin yolu). Rutin var olan görevlerin yalnız yerlerini ve koşu noktalarını değiştirir (kornerSecenekleri bunları okur); hedef koşucu
     du.hedefQ (kornerSecenegi'nde kornerOncelik), alçak teslim du.teslim. Vuruşta vurucu güçlü ayağıyla vurur (sec.ayak) */
  kornerIceAyak(du){return Math.sign(du.z-MZ)*this.dir[du.takim]>0?'sol':'sag';},
  kornerRutinSec(du,tk,Dt,ikinciVar){
    if(!tk)return 'orta';
    const A=MOTOR_AYAR,W=A.kornerRutin||{},ia=this.kornerIceAyak(du),ice=tk.ayak===ia||tk.ayak==='iki',S=[];
    const ek=(r,w)=>{if(w>0)S.push([r,w]);};
    ek('orta',(W.orta||0)*(1+0.2*Dt.acele));ek('onDirek',(W.onDirek||0)*(ice?1.2:0.7));ek('arkaDirek',(W.arkaDirek||0)*(1+0.5*Dt.acele));
    ek('tren',W.tren||0);if(ice)ek('alcak',W.alcak||0);if(ikinciVar)ek('geri',(W.geri||0)*(1-0.5*Dt.acele+0.5*Dt.koru));
    let top=0;for(const x of S)top+=x[1];if(!(top>0))return 'orta';
    let r=this.kornerOzet(du,2)*top;for(const x of S){r-=x[1];if(r<=0)return x[0];}
    return S[S.length-1][0];},
  kornerRutinKur(du,G,kutu,yan,d){
    const r=du.rutin,tk=du.kullanan,ice=tk&&(tk.ayak===this.kornerIceAyak(du)||tk.ayak==='iki');
    const g=i=>{const p=kutu[i],x=p&&G.get(p);return x&&DT_HEDEF.has(x.rol)?x:null;};
    const yer=(x,u,w)=>{x.hx=d*u;x.hz=MZ+yan*w;},kos=(x,u,w)=>{x.kx=d*u;x.kz=MZ+yan*w;};
    du.hedefQ=null;du.teslim=null;
    if(r==='orta'){const a=g(0);if(a&&!ice){yer(a,PL-15,1);kos(a,PL-9.5,-0.5);du.hedefQ=kutu[0];}}   /* dışa dönen: penaltı noktası, koşarak */
    else if(r==='onDirek'){const a=g(1),b=g(2);if(a){kos(a,PL-5.2,2.6);a.siyir=true;a.siyirYan=yan;du.hedefQ=kutu[1];}if(b)kos(b,PL-4.5,-2.8);}
    else if(r==='arkaDirek'){for(let i=0;i<4;i++){const x=g(i);if(x)yer(x,PL-8.5,-(2.4+1.2*i));}
      const a=g(0),b=g(1),c=g(2),e=g(3);if(b)kos(b,PL-5.5,2.2);if(e)kos(e,PL-7,0);if(c)kos(c,PL-8,-5.6);if(a){kos(a,PL-6.5,-3.8);du.hedefQ=kutu[0];}}
    else if(r==='tren'){for(let i=0;i<4;i++){const x=g(i);if(x){yer(x,PL-12.5-0.85*i,0.6);x.faz=0.35;}}
      const a=g(0),b=g(1),c=g(2),e=g(3);if(e)kos(e,PL-5.5,2.2);if(b)kos(b,PL-6.5,-3.8);if(c)kos(c,PL-11,0);if(a){kos(a,PL-6,-0.3);du.hedefQ=kutu[0];}}
    else if(r==='alcak'){const a=g(1),b=g(0);if(a){kos(a,PL-4.8,2.4);du.hedefQ=kutu[1];du.teslim='alcak';}if(b)kos(b,PL-3.2,0.3);}
  },
  /* Z2c (sahne&4): rakip yarıda uzak serbest vuruşta kutu dolumu — geride son dakikalarda her zaman, öbür durumlarda uzakDolum olasılığıyla (h2) */
  /* Z2c: yatan barajcı duruş biterken kalkar — vuruşla (kullanimBildir) ya da temassız başlayan oyunla (js/mac-kurallar.js stepDurus, durusKullan);
     kalkamıyorsa (kilitli eylem, oyun dışı) yatik kapanır (çizim ve fizik onu ayakta sayar) */
  yatanKaldir(du){const Y=du.yatan;if(!Y)return;const R=Y.duranRol;if(!R||R.rol!=='yatan'||!R.yatik)return;
    if(Y.oyunda&&!(Y.eylem&&Y.eylem.kilit)){Y.eylem={ad:'kalkis',t:0,sure:0.7,kilit:true,fren:12,yon:Y.yon,yuzustu:false,neden:'yatan'};this._yatan=Y;}else R.yatik=false;},
  /* kalkış bitince yatik kapanır (takimAI, oyunda her kare; yalnız kalkan bir yatan varken iş yapar) */
  yatanAdim(){const Y=this._yatan;if(!Y||Y.eylem&&Y.eylem.ad==='kalkis'&&Y.eylem.neden==='yatan')return;if(Y.duranRol&&Y.duranRol.rol==='yatan')Y.duranRol.yatik=false;this._yatan=null;},
  uzakDolumMu(du){const u=du.x*this.dir[du.takim];if(u<=PL-55||u>PL-35)return false;const D=this.macDurumu(du.takim);
    return D.acele>0.5||this.sahneOzet(du,6)<(MOTOR_AYAR.uzakDolum||0);},
  /* ============ Z2d: taç sahnesi (2026-10-19 gece; kutuphane/F F.3.1–F.3.5) ============
     Atıcının takımından üç alıcı (kaleci hariç, 30 m içindeki en yakınlar): 'tacGelgit' çizgi boyu 12 m ileri ve 4 m içeriden atış yaklaşınca 6 m
     ileriye geri gelir (gel-git; koşu noktası kx, kz), 'tacIce' 11 m içeride, 'tacGeri' 7 m geride (bek). Savunan takım (tacPres): her alıcıya en
     yakın savunmacı 'tacMarkaj' (alıcısının kale ve top tarafında ~1 m; durusYerlesim), atıcıya en yakın kalan 'tacPerde' (çizgiden 2,8 m; kural
     2 m). Atış alıcının o anki açıklığına göre (tacHedefi), uçuşa göre öncülük; atışta roller silinir. Rastlantı çekmez (görev) */
  tacGorev(du,G){
    const t=du.takim,s=1-t,d=this.dir[t],tk=du.kullanan,ic=du.z<MZ?1:-1,A=MOTOR_AYAR;
    const nx=x=>clamp(x,-PL+1.5,PL-1.5),nz=z=>clamp(z,1.5,PW-1.5);
    const P=[['tacGelgit',nx(du.x+d*12),nz(du.z+ic*4),nx(du.x+d*6),nz(du.z+ic*3)],['tacIce',nx(du.x+d*2),nz(du.z+ic*11)],['tacGeri',nx(du.x-d*7),nz(du.z+ic*3)]];
    const L=this.sahadakiler(t).filter(p=>p!==tk&&p.rol!=='GK'&&!(p.eylem&&p.eylem.kilit)&&hyp(p.x-du.x,p.z-du.z)<30),al=[];
    for(const Y of P){let en=null,ed=1e9;for(const q of L){if(G.has(q))continue;const dd=hyp(q.x-Y[1],q.z-Y[2]);if(dd<ed-1e-9||dd<ed+1e-9&&en&&q.n<en.n){ed=dd;en=q;}}
      if(!en)continue;G.set(en,Y.length>3?{rol:Y[0],hx:Y[1],hz:Y[2],kx:Y[3],kz:Y[4],takim:t,hedef:null}:{rol:Y[0],hx:Y[1],hz:Y[2],takim:t,hedef:null});al.push(en);}
    if(!(A.tacPres>0))return;
    const S=this.sahadakiler(s).filter(p=>p.rol!=='GK'&&!(p.eylem&&p.eylem.kilit));
    for(const q of al){let en=null,ed=22;for(const o of S){if(G.has(o))continue;const dd=hyp(o.x-q.x,o.z-q.z);if(dd<ed){ed=dd;en=o;}}
      if(en)G.set(en,{rol:'tacMarkaj',hx:q.x,hz:q.z,takim:s,hedef:q});}
    let en=null,ed=18;for(const o of S){if(G.has(o))continue;const dd=hyp(o.x-du.x,o.z-du.z);if(dd<ed){ed=dd;en=o;}}
    if(en)G.set(en,{rol:'tacPerde',hx:du.x+d*0.6,hz:nz(du.z+ic*2.8),takim:s,hedef:tk});
  },
  /* Z2c (sahne&4): hakemin spreyi — barajlı serbest vuruşta hakem topun yanına gelir, topun yerini işaretler (olay 'sprey' tur 'top', 1,2 sn), 9,15 m'yi
     barajın yerine yürür, barajın çizgisini çeker ('sprey' tur 'cizgi', 1,6 sn), sonra barajın ucuna çekilip barajı dizer (eski hakemHazir yolu).
     du.hk {evre: top | adim | cizgi | cekil, t, s, nk}; 12 sn'de sprey bitmezse çekilir. Rastlantı çekmez.
     K1 (2026-10-20; kullanıcı notu 11, kutuphane/L L.1): hakemin yüzü — 'top'ta topa; 'adim'da gidiş yönüne (toptan barajın çizgisine), baş da önüne
     (h.bakisYon; eskiden h.bak = top ve adımlama 2,8 m/sn'nin altında kaldığından hakem 9,15 m'yi geri geri yürüyordu, 8 maçta adımlama karelerinin
     %75'i); 'cizgi'de gövde ve baş çizgide sıkılan noktaya (uçtan uca 0,1 → 1,25 sn; zaman DT_SPREY'den, çizimin eli ve köpüğü aynı zamanlamayla açılır,
     köpük gövdenin önünde), sonra topa — dönüş çizginin bittiği yandan, 'cekil'den önce biter; sahne&1 kapalıyken (vuruş spreyi beklemez) eski yüz.
     Yalnız yön değişir: moveP'de yön yalnız hız tavanını (yanTavan/geriTavan) belirler, adımlamanın hızı (0,24 × 7,2) geri geri tavanının (0,42 × 7,2) altında, çizgide hakem durur — konum, süreler ve hakemHazir aynı; 'cekil'e gövde eskisi gibi topa dönük girer
     (çekilişte tavan bağlayabilir), sprey kesilecekse (12 sn tavanı, güvenlik ağının vuruşu) 0,5 sn önceden topa döner. Sonucu değiştirmez */
  hakemSpreyHedef(du){const H=du.hk,W=du.barajW;
    if(H.evre==='top')return{x:du.x+W.px*0.8,z:du.z+W.pz*0.8};
    const c=0.25*(W.n-1);return{x:W.x+W.px*c-W.ux*0.6,z:W.z+W.pz*c-W.uz*0.6};},
  hakemSpreyAdim(du,h,uz,dt){
    /* süre top yerine konunca sayılır (kullanan topu getirirken hakem topun yanında bekler); 12 sn'de bitmeyen sprey bırakılır */
    const H=du.hk,yer=du.asama==='yerles'||du.asama==='hazir'||du.asama==='kullan';if(yer)H.t+=dt;if(H.t>12){H.evre='cekil';return;}
    if(H.evre==='top'){h.hizOran=uz>6?0.7:0.4;
      if(uz<0.6&&yer){h.hizOran=0;if(H.s==null){H.s=0;this.on('sprey',{tur:'top',x:du.x,z:du.z,zaman:DT_SPREY.top});}H.s+=dt;if(H.s>DT_SPREY.top.sure){H.evre='adim';H.s=null;}}}
    else if(H.evre==='adim'){h.hizOran=0.24;if(uz<0.5)H.evre='cizgi';}
    else if(H.evre==='cizgi'){h.hizOran=0;
      if(H.s==null){H.s=0;const W=du.barajW,a=-0.3,b=0.5*(W.n-1)+0.3;this.on('sprey',{tur:'cizgi',x:W.x+W.px*a,z:W.z+W.pz*a,x2:W.x+W.px*b,z2:W.z+W.pz*b,zaman:DT_SPREY.cizgi});}
      H.s+=dt;if(H.s>DT_SPREY.cizgi.sure)H.evre='cekil';}
    /* K1: yüz (yukarıda); 'top', 'cekil' ve kesilmeden 0,5 sn önce hakemAI'nın h.bak'ı (top). Çizgiden topa dönüş en çok ~160° (yerinde 11 rad/sn:
       ≤ 16 kare; don'dan 'cekil'e ~21 kare). Vuruş spreyi beklemiyorsa (du.sahneT yok: sahne&1 kapalı — duranHazirMi'nin sprey koşulu yalnız sahnede;
       du.zorlaHazir da yalnız orada) eski yüz: hakem topa bakar */
    if(!du.sahneT||H.evre==='top'||H.evre==='cekil'||H.t>11.5||du.t>du.zorlaHazir-2.5)return;
    if(H.evre==='adim'){h.bak=null;h.bakisYon=Math.atan2(h.tz-h.z,h.tx-h.x);return;}
    const Z=DT_SPREY.cizgi,s=H.s||0;if(s>Z.don)return;
    const W=du.barajW,k=-0.3+(0.5*(W.n-1)+0.6)*clamp((s-Z.s0)/Z.sw,0,1),N=H.nk||(H.nk={x:0,z:0});
    N.x=W.x+W.px*k;N.z=W.z+W.pz*k;h.bak=N;h.bakisYon=Math.atan2(N.z-h.z,N.x-h.x);
  },
  /* penaltı görevleri (T8a): herkes ceza sahası ve yayın dışında; iki hücumcu ve iki savunmacı yayın kenarında ribaunda hazır, kaleci çizgide */
  penaltiGorev(du,G){
    const t=du.takim,s=1-t,d=this.dir[t],tk=du.kullanan;
    const ekle=(p,rol,u,w)=>{G.set(p,{rol,hx:d*u,hz:w,takim:p.team,hedef:null});};
    const rb=p=>profilAlt(p,'topsuzHareket',0.5)+0.4*Math.max(0,profilEgilim(p,'cezaSahasinaGecGirer'))+(p.rol==='FV'?0.3:0);
    const huc=this.sahadakiler(t).filter(p=>p.rol!=='GK'&&p!==tk).sort((a,c)=>rb(c)-rb(a)||a.n-c.n);
    /* yay: penaltı noktasından 9,15 m; ceza sahası çizgisinin 0,5 m gerisinde yayın dışı |w| ≥ 7,2 */
    huc.forEach((p,i)=>{if(i<2)ekle(p,'ribaund',PL-17,MZ+(i?7.4:-7.4));else ekle(p,'bekle',PL-22-((i*5)%4),MZ+[-12,12,-4,4,-18,18,0][(i-2)%7]);});
    const sav=this.sahadakiler(s).filter(p=>p.rol!=='GK').sort((a,c)=>dtKafa(c)-dtKafa(a)||a.n-c.n);
    sav.forEach((p,i)=>{if(i<2)ekle(p,'ribaund',PL-17,MZ+(i?9.4:-9.4));else ekle(p,'bekle',PL-20.6,MZ+[-6,6,-2,2,-10,10,-15,15][(i-2)%8]);});
    const kl=this.kaleci(s);if(kl&&kl.oyunda)ekle(kl,'kaleci',PL,MZ);
  },
  /* ============ T8c: serbest vuruş ============
     Baraj: kişi sayısı mesafe × görünen kale açısı × vuranın duran top becerisi (16–20 m 4–5 · 20–25 3–4 · 25–30 2–3 · 30–35 1–2); en dıştaki üye
     yakın direğin 0,3 m dışından geçen çizgide 9,15 m'de, öbürleri omuz omuza (0,5 m) kale ortasına doğru: barajın gölgesi yakın direk yarısını
     kapatır, kaleci ortanın 0,3 m uzak tarafında, çizgiden 0,8 m. İlk denemede ortadan 1,2 m'de 18 m'den yakın üst köşeye düşen şutların çoğu gol
     oluyordu; tarama (18 ve 22 m, 80'er vuruş): 0,3 m'de gol %14,9, 0,6'da %16, 0,9'da %18,8 — plan en zayıf yeri seçer: yakın köşe barajın
     üstünden ya da barajın iç ucunun yanından uzak köşe (kaleci barajın arkasında kaldıkça geç görür). Üyeler barajın yerine en yakın n + 2 savunmacıdan
     en uzunlar (en uzun en dışta). Kenar vuruşunda 1–2 kişilik baraj ön direğe giden alçak ortanın çizgisinde. Hakem barajın dış ucunun 1,8 m
     ötesinde durup dizer (hakemDuranYeri) */
  barajKur(du,G){
    const t=du.takim,s=1-t,d=this.dir[t],gx=d*PL,tk=du.kullanan,L=hyp(gx-du.x,MZ-du.z),yan=Math.sign(du.z-MZ)||1,kenar=du.sinif==='kenar',dT=profilAlt(tk,'duranTop',0.5);
    let n,hx,hz;
    if(kenar){n=dT>0.55?2:1;hx=gx-d*8;hz=MZ+yan*2;}
    else{const a0=2*Math.atan(GW2/L),a=Math.abs(aciFark(Math.atan2(MZ+GW2-du.z,gx-du.x),Math.atan2(MZ-GW2-du.z,gx-du.x)));
      n=clamp(Math.round((4.5-(L-18)/5)*(0.4+0.6*Math.min(1,a/a0))+(dT-0.5)),1,5);hx=gx;hz=MZ+yan*(GW2+0.3);}
    const L0=hyp(hx-du.x,hz-du.z)||1,ux=(hx-du.x)/L0,uz=(hz-du.z)/L0,Wx=du.x+ux*9.15,Wz=du.z+uz*9.15;
    let px=-uz,pz=ux;if(px*(gx-Wx)+pz*(MZ-Wz)<0){px=-px;pz=-pz;}   /* içe: kale ortası tarafı */
    const U=this.sahadakiler(s).filter(p=>p.rol!=='GK'&&!G.has(p)).sort((a,c)=>hyp(a.x-Wx,a.z-Wz)-hyp(c.x-Wx,c.z-Wz)||a.n-c.n).slice(0,n+2)
      .sort((a,c)=>(c.boy||1)-(a.boy||1)||a.n-c.n).slice(0,n);
    const BY=new Map();
    U.forEach((p,k)=>{const sk=kenar?(k-(U.length-1)/2)*0.5:k*0.5,x=Wx+px*sk,z=Wz+pz*sk;G.set(p,{rol:'baraj',hx:x,hz:z,takim:s,hedef:null,sira:k});BY.set(p,{x,z});});
    du.barajdakiler=U;du.barajYer=BY;du.barajAci=Math.atan2(du.z-Wz,du.x-Wx);
    if(!kenar){du.baraj=true;du.barajUc={x:Wx-px*1.8,z:Wz-pz*1.8};
      const kl=this.kaleci(s);if(kl&&kl.oyunda){G.set(kl,{rol:'kaleci',hx:gx-d*0.8,hz:MZ-yan*0.3,takim:s,hedef:null});this.jestVer(kl,'isaret',1.4,{x:Wx,z:Wz});}   /* T8e: kaleci barajı kol işaretiyle kurar (Ek G5) */
      if(MOTOR_AYAR.sahne&4)this.barajSahne(du,G,U,Wx,Wz,px,pz,ux,uz);}   /* Z2c */
  },
  /* Z2c (sahne&4; kutuphane/F F.2.1, F.2.3, F.2.9; IFAB Law 13): hakemin spreyi (du.hk, du.barajW), en az 3 kişilik barajın arkasına yatan oyuncu
     (yatanBaraj olasılığı, h2: barajın 0,9 m arkasında, barajın doğrultusunda; yerine varınca yatar — G.yatik —, alçak şutu keser: govdeCarpmasi ve
     planlayıcı sutBlokOlasiligi; vuruşta kalkar), barajın iç ucunun 1 m dışında perde duran hücumcu (barajYani olasılığı; kalecinin görüşünü
     keser: kaleciTepkiSuresi'nin perdesi). Hücumcular barajdan en az 1 m uzakta durur (durusYerlesim). Rastlantı çekmez */
  barajSahne(du,G,U,Wx,Wz,px,pz,ux,uz){
    const A=MOTOR_AYAR,t=du.takim,s=1-t,n=U.length;
    du.barajW={x:Wx,z:Wz,px,pz,ux,uz,n};if(!du.hk)du.hk={evre:'top',t:0,s:null};   /* yeniden dağıtımda sprey baştan başlamaz */
    if(n>=3&&this.sahneOzet(du,5)<(A.yatanBaraj||0)){const c=0.25*(n-1),yx=Wx+px*c+ux*0.9,yz=Wz+pz*c+uz*0.9;
      let en=null,ed=1e9;for(const p of this.sahadakiler(s)){if(p.rol==='GK'||G.has(p)||p.eylem&&p.eylem.kilit)continue;const dd=hyp(p.x-yx,p.z-yz);if(dd<ed){ed=dd;en=p;}}
      if(en){G.set(en,{rol:'yatan',hx:yx,hz:yz,takim:s,hedef:null,wx:px,wz:pz,nx:ux,nz:uz,yatik:false});du.yatan=en;}}
    if(this.sahneOzet(du,7)<(A.barajYani||0)){const c=0.5*(n-1)+1.1,bx=Wx+px*c,bz=Wz+pz*c;
      let en=null,ep=-1e9;for(const p of this.sahadakiler(t)){if(p.rol==='GK'||p===du.kullanan||G.has(p)||p.eylem&&p.eylem.kilit)continue;const L=hyp(p.x-bx,p.z-bz);if(L>45)continue;
        const P=(p.boy||1)*2-L*0.02;if(P>ep){ep=P;en=p;}}
      if(en)G.set(en,{rol:'barajYani',hx:bx,hz:bz,takim:t,hedef:null});}
  },
  /* A4-1 (Ek D “topun başında iki kişi”): barajlı serbest vuruşta serbestIkili olasılıkla ikinci vurucu (45 m içindeki en iyi serbest vuruş tekniği,
     uzaklıkla azalır; hazırlık 10–14 sn) topun 1,3 m gerisinde ve 0,7 m yanında durur — kullananın vuran ayağının tersi yanda. Şut kararında aldatma
     koşusu (aldatmaHazirla), kısa pas rutininde doğal alıcıdır. Rol 'ikinci' (çizim okur). Karar rastlantısız özetle (h2: maçın tohumu, kullanan,
     an ve yer; H1 taramasındaki gibi) — ana zar dizisi kaymaz, iki kişisiz vuruş birebir aynı kalır */
  /* A4-2: kornerin rastlantısız özeti (h2: maçın tohumu, kullanan, an ve yer) — ana zar dizisi kaymaz */
  kornerOzet(du,tuz){return h2((this.tohum|0)*137+du.kullanan.n*19+Math.round(this.t*4),Math.round(du.x*10)*1009+Math.round(du.z*10)*11+tuz+5);},
  ikiliOzet(du,tuz){return h2((this.tohum|0)*131+du.kullanan.n*17+Math.round(this.t*4),Math.round(du.x*10)*1031+Math.round(du.z*10)*7+tuz);},
  /* ============ Z2a: sahne ve tempo (2026-10-19 gece; FUTBOL_KUTUPHANESI §12.6, kutuphane/F F.8; kullanıcı kararı tempo B) ============
     Duruşun başında (durusBaslat, görevlerden sonra; MOTOR_AYAR.sahne&1) hedef süre: tempo[tür] × bağlam (maç durumunun koru payıyla
     tempoBaglam[0], acele payıyla tempoBaglam[1]) × (1 ± tempoSapma; h2). du.sahneT: duruşun başından kullananın temasına (gerçek sn); du.sahneKos:
     kullanımdan temasa beklenen süre (koşu, atış). duranHazirMi kullanımı sahneT − sahneKos (+ zaman geçirme) gelene dek bekletir; kullanan bu
     sürede topa ve yerine yürür (sahneHiz), geri çekilme noktası vuran ayağın ters yanına dönüktür (du.yay; yay koşusu), kutuya ya da kaleye bakar
     (du.bakis; çizim okur). Güvenlik ağları hedefle uzar (du.zorlaGetir, du.zorlaHazir; js/mac-kurallar.js stepDurus). Taçta ve kale vuruşunda
     zaman geçirme kuralın sayımıyla sınırlı (tacSayim − 0,5 sn): hakem geciktirilen atışta 5 sn'yi görünür sayar (olay 'sayim'). Rastlantı çekmez */
  sahneOzet(du,tuz){return h2((this.tohum|0)*149+(du.kullanan?du.kullanan.n:0)*23+Math.round(this.t*4),Math.round(du.x*10)*1013+Math.round(du.z*10)*13+tuz*7+3);},
  sahneKur(du){
    if(du.hakemTopu)return;
    const A=MOTOR_AYAR,T=A.tempo||{},tur=du.tur==='serbest'?(du.sinif==='baraj'?'baraj':du.sinif==='kenar'||du.dolum?'kenar':'serbest'):du.tur,t0=T[tur];
    if(!(t0>0))return;
    const D=this.macDurumu(du.takim),B=A.tempoBaglam;let k=1;
    if(B){k*=1+(B[0]-1)*D.koru;k*=1-(1-B[1])*D.acele;}
    du.sahneTur=tur;du.sahneK=k;du.sahneT=t0*k*(1+(A.tempoSapma||0)*(2*this.sahneOzet(du,0)-1));
    /* hızlı taç (kutuphane/F F.3.1): savunma dizilmeden, en yakın oyuncu topu alıp hemen atar — çeyreği, gerideki takımda daha sık; önde son dakikalarda yok */
    if(tur==='tac'&&D.koru<0.3&&this.sahneOzet(du,8)<0.25+0.35*D.acele){du.sahneT=Math.min(du.sahneT,3.2);du.hizliTac=true;}
    du.sahneKos=tur==='tac'?0.35:tur==='penalti'?1.6:tur==='kaleVurusu'?1.0:1.3;
    /* güvenlik ağları sahnenin planlı varışından sonra (sahneHiz'in payıyla aynı: taç 1, spreyli baraj 12, öbürleri 3 sn) */
    du.zorlaGetir=Math.max(16,du.sahneT-du.sahneKos-(tur==='tac'?1.0:du.hk?12:3.0)+2);du.zorlaHazir=Math.max(28,du.sahneT+10);
    if((tur==='tac'||tur==='kaleVurusu')&&du.zgEk>0&&A.tacSayim>0)du.zgEk=Math.min(du.zgEk,A.tacSayim-0.5);
    const tk=du.kullanan,Y=A.duranYay,d=this.dir[du.takim];
    if(tk&&Y&&(tur==='korner'||tur==='baraj'||tur==='kenar'||tur==='penalti'))du.yay=Y[0]+(Y[1]-Y[0])*clamp(0.3+0.4*this.sahneOzet(du,1)+0.3*profilAlt(tk,'duranTop',0.5),0,1);
    if(tur==='korner'||tur==='kenar')du.bakis={x:d*(PL-8),z:MZ};else if(tur==='baraj'||tur==='penalti')du.bakis={x:d*PL,z:MZ};
    /* Z3a (kurma&1): kale vuruşunda kısa kuran kaleci şeklin oturmasını bekler (kisaPay ile ×0,85–1,2), sahaya bakar */
    if(tur==='kaleVurusu'&&(A.kurma&1)){const V=tarzTakim(this,du.takim),kp=V?V.kisaPay:1-this.taktik[du.takim].direkt;du.sahneT*=0.85+0.35*kp;du.zorlaHazir=Math.max(28,du.sahneT+10);du.bakis={x:du.x+d*30,z:MZ};}
  },
  /* Z2a: kullananın topa ve yerine yürüyüşü — hedef süreye zaman varsa yürür (≥ 1,6 m/sn; gerçek duruşta oyuncular yürür), yoksa eski hızla (v0) */
  sahneHiz(du,tk,v0,x,z){
    if(!du.sahneT||du.hizli||du.hizliTac)return v0;   /* çabuk serbest vuruş ve hızlı taç beklemez */
    /* topun yerine konmasından sonraki sahne payı: taçta 1 sn, hakemin spreyli barajında 12 sn (sprey, 9,15 m, çizgi, baraj), öbürlerinde 3 sn */
    const kalan=du.sahneT-du.sahneKos-(du.tur==='tac'?1.0:du.hk?12:3.0)-du.t,L=hyp(x-tk.x,z-tk.z);
    if(!(kalan>0.5)||L<0.6)return v0;
    return Math.min(v0,Math.max(1.6,L/kalan)/tk.maxSpd);},
  ikiliKur(du,G){
    const A=MOTOR_AYAR;if(!(A.serbestIkili>0)||this.ikiliOzet(du,0)>=A.serbestIkili)return;
    const t=du.takim,tk=du.kullanan;let en=null,eP=-1e9;
    for(const p of this.sahadakiler(t)){if(p===tk||p.rol==='GK'||G.has(p)||p.eylem&&p.eylem.kilit)continue;const L=hyp(p.x-du.x,p.z-du.z);if(L>45)continue;
      const P=serbestTeknik(p)-0.006*L;if(P>eP){eP=P;en=p;}}
    if(!en)return;
    /* Z2a (sahne&1): yay koşusu vuran ayağın ters yanından gelir — ikinci vurucu vuran ayak yanında durur (koşunun yolundan çekilir) */
    const a=this.durusHedefAcisi(du),c=Math.cos(a),s=Math.sin(a),yan=(tk.ayak==='sol'?1:-1)*(MOTOR_AYAR.sahne&1?-1:1);
    G.set(en,{rol:'ikinci',hx:du.x-c*1.3-s*0.7*yan,hz:du.z-s*1.3+c*0.7*yan,takim:t,hedef:tk});du.ikili=en;
  },
  /* A4-1: şut kararında (durusKullan) serbestAldatma olasılıkla ikinci vurucu kullanandan önce topun üstünden koşar: çapraz, topun ~0,4 m yanından
     geçip toptan 1,2 m öne ve 1,8 m öbür yana — şutun yolunun dışına (ilk denemede bitiş toptan 2,4 m önde, çizgiye 0,35 m'deydi: aldatmalı şutta
     gol/şut %3,7, aldatmasızda %7,1). Koşu kullananın temasına ~1 sn kala (durusYerlesim); kalecinin tepkisi js/mac-kaleci.js */
  aldatmaHazirla(du,sec){
    const q=du.ikili,G=q&&du.gorev?du.gorev.get(q):null;if(!G||!q.oyunda||sec.tur!=='sut')return;
    if(this.ikiliOzet(du,1)>=MOTOR_AYAR.serbestAldatma)return;
    const a=this.durusHedefAcisi(du),c=Math.cos(a),s=Math.sin(a),yan=Math.sign(-(G.hx-du.x)*s+(G.hz-du.z)*c)||1;
    G.kx=du.x+c*1.2+s*1.8*yan;G.kz=du.z+s*1.2-c*1.8*yan;du.aldatma=true;
  },
  /* kenar serbest vuruşu: orta için 4–6 hücumcu savunma çizgisinin 0,6 m gerisinde (çizgi kaleden 10–16 m; vuruş uzaklaştıkça geride),
     temastan 0,55 sn önce koşu noktalarına (ön direk, altıpas ortası, arka direk, penaltı noktası, uzak direk); biri yayda ikinci topa, ikisi
     geride. Savunmada kutudakilere adam (kale tarafında), ön direkte bir bölge, biri ileride; kaleci kendi konumunda */
  kenarGorev(du,G){
    const t=du.takim,s=1-t,d=this.dir[t],yan=Math.sign(du.z-MZ)||1,tk=du.kullanan,Dt=this.macDurumu(t),u=du.x*d;
    const ekle=(p,rol,u2,w,ek)=>{G.set(p,Object.assign({rol,hx:d*u2,hz:w,takim:p.team,hedef:null},ek||{}));};
    const uc=PL-clamp(0.5*(PL-u)+4,10,16)-0.6;
    const huc=this.sahadakiler(t).filter(p=>p.rol!=='GK'&&p!==tk),sav=this.sahadakiler(s).filter(p=>p.rol!=='GK');
    const kutuN=clamp(Math.min(clamp(Math.round(4.5+1.5*Dt.acele-Dt.koru),4,6),huc.length-3),0,6);
    const S=huc.slice().sort((a,c)=>dtKafa(c)-dtKafa(a)||a.n-c.n),kutu=S.slice(0,kutuN);
    kutu.forEach((p,i)=>{const Y=DT_KENAR[i];ekle(p,Y[0],uc,MZ+yan*Y[1],{kx:d*Y[2],kz:MZ+yan*Y[3]});});
    const kalan=S.slice(kutuN).sort((a,c)=>dtIkinci(c)-dtIkinci(a)||a.n-c.n);
    if(kalan.length)ekle(kalan.shift(),'ikinciTop',PL-19,MZ-yan*2);
    const gs=p=>0.5*profilAlt(p,'pozisyonAlma',0.5)+0.5*p.oz.hiz;
    kalan.sort((a,c)=>gs(c)-gs(a)||a.n-c.n).slice(0,2).forEach((p,i)=>ekle(p,'geride',-4,MZ+(i?9:-9)));
    const ileri=sav.slice().sort((a,c)=>((c.rol==='FV'?0.3:0)+c.oz.hiz)-((a.rol==='FV'?0.3:0)+a.oz.hiz)||a.n-c.n)[0];
    if(ileri)ekle(ileri,'ileride',-8,MZ+3);
    const D=sav.filter(p=>p!==ileri).sort((a,c)=>dtKafa(c)-dtKafa(a)||a.n-c.n);
    for(const o of kutu){if(!D.length)break;const p=D.shift();ekle(p,'adam',null,null,{hedef:o});const g=G.get(p);g.hx=o.x;g.hz=o.z;}
    if(D.length)ekle(D.shift(),'bolge',PL-6,MZ+yan*2.5);
    /* kaleci ortaya ve 1,2 m öne: ortayı karşılar, yakın direğe gelen şutu da görür */
    const kl=this.kaleci(s);if(kl&&kl.oyunda)ekle(kl,'kaleci',PL-1.2,MZ);
  },
  /* serbest vuruş kararı (eski zar: barajda %62 doğrudan şut): saf değerler P(gol)·100 biriminde — doğrudan şut (sutAdaylari'nın en iyisi:
     barajın üstünden falso ve düşen, kalecinin köşesine sert, sıçrayan barajın altından; dolaylı vuruşta yok), orta (kornerSecenekleri: görevli
     koşucuların ya da kutudakilerin noktası, kafanın gol beklentisi; kaleye 40 m'den yakın), oyunu sürdürmek (serbestDevam: kısa ya da uzun pas,
     sürüş — kullananın kendi kararı). Seçim sıcaklıklı (serbestTau; kararlı ve becerili kullanan daha tutarlı). Çabuk vuruşta karar yok */
  serbestKarar(du,tk){
    if(du.hizli)return null;
    const A=MOTOR_AYAR,d=this.dir[du.takim],gx=d*PL,u=du.x*d,L=hyp(gx-du.x,MZ-du.z),S=[];
    /* rutin: barajlı vuruşta kısa pas (kullananın kendi kararı: yanındakine, sürüş) — kısa kornerdeki gibi yaratıcılıkla */
    if(du.sinif==='baraj'&&this.rast()<A.serbestRutin*(0.6+0.8*profilAlt(tk,'yaraticilik',0.5))){du.karar={S:[],sec:'rutin'};return null;}
    if(!du.endirekt&&u>0&&L<40){const R=VURUS_GUC_REF.sut,sd=vurusSapma(tk,{sut:true,guc:R,ref:R,stil:'falso',teknik:serbestTeknik(tk)})*sutHataK(L,true);
      const P=sutAdaylari(this,tk,du.x,du.z,sd,{serbest:true}).en;S.push({tur:'sut',deger:P*100,P});}
    /* orta: hedef kornerSecenekleri'nin en iyisi; değeri ortanın gerçek veriminden (serbestOrta: kenarda ve kaleye 15 m'de tam; kaleden 30 m ötede
       yarısı, en az 0,3'ü; ortada yarısı — baraj ve top görmüş savunma). Planın değeri pas analizinden geliyor ve kalabalık kutuda hücumun ilk
       teması için 0,02–0,11 veriyor (kornerde gerçekleşen %33): hedefleri sıralamaya yeter, ölçek olarak değil (T10 öncesi orta gözden geçirmesi) */
    if(u>PL-40||du.dolum){let en=null;for(const o of kornerSecenekleri(this,tk,du.x,du.z,A.sahne&2?'kornerHizli':'korner'))if(!en||o.deger>en.deger)en=o;
      if(en){const aw=clamp((Math.abs(du.z-MZ)-6)/10,0,1);S.push({tur:'orta',deger:A.serbestOrta*clamp(1-(PL-u-15)/30,0.3,1)*(0.5+0.5*aw)*(du.dolum?3:1),c:en});}}   /* Z2c: kutu dolumunda uzun orta */
    S.push({tur:'devam',deger:A.serbestDevam});
    let en=-1e9;for(const s of S)en=Math.max(en,s.deger);
    const tau=A.serbestTau*(1.4-0.4*tk.oz.karar-0.4*profilAlt(tk,'duranTop',0.5));let top=0;for(const s of S){s.a=Math.exp((s.deger-en)/tau);top+=s.a;}
    let r=this.rast()*top,c=S[S.length-1];for(const s of S){r-=s.a;if(r<=0){c=s;break;}}
    du.karar={S:S.map(s=>({tur:s.tur,deger:s.deger})),sec:c.tur};   /* salt okunur (ölçüm) */
    if(c.tur==='sut')return{tur:'sut',hx:gx,hz:MZ,serbest:true,xg:c.P};
    if(c.tur==='orta'){const o=c.c,so={tur:'orta',hx:o.hx,hz:o.hz,tip:'hava',T:o.T,hy:o.hy,yay:'korner',alici:o.q};
      if((A.sahne&4)&&du.sinif==='kenar')so.ayak=tk.ayak==='iki'?this.kornerIceAyak(du):tk.ayak;   /* Z2c: kenarda güçlü ayakla (seçimde içe dönen tercih) */
      return so;}
    return null;
  },
  /* T8d: uzun taç — son üçte birde (kaleye 32 m), atanın erişimi güçten ve boydan (14–26 m; uzun taç uzmanı 25 m'yi aşar). Kutudaki hedefler
     korner seçeneklerinden (kutudakiler ve iki bölge); erişimdeki en iyi hedef 15 m'den uzaksa ve atan uzun atmayı seçerse (%70; karar
     yerleşmede, koşudan önce — karar false iken yalnız hedef tazelenir) uzun taç, yoksa kısa taç (tacHedefi). Topun inişi sıçrayan başın
     hizasında; alıcı ortadaki gibi topa gider ve sıçrar */
  tacUzunSecenegi(du,tk,karar){
    const d=this.dir[du.takim];if(du.x*d<PL-32)return null;
    /* T8e düzeltmesi: menzil 22–32 m (gerçek uzun taç 25–30 m, uzmanlar 35+); kutu hedefleri yan çizgiden 30+ m'de kaldığı için ayrıca altıpasın
       atana yakın köşesi (kaleden 7 m, ortadan 6 m) hedeftir — oraya en yakın arkadaş alıcıdır */
    const R=22+10*profilAlt(tk,'guc',0.5)+8*((tk.boy||1)-1),yan=Math.sign(du.z-MZ)||1;let en=null;
    for(const c of kornerSecenekleri(this,tk,du.x,du.z)){const Lc=hyp(c.hx-du.x,c.hz-du.z);if(Lc>R||Lc<15)continue;if(!en||c.deger>en.deger)en=Object.assign({L:Lc},c);}
    /* T8f: kutu hedefleri (altıpasın atana yakın köşesi; yetişilmezse ceza sahasının atana yakın ön kenarı — yan çizgiden 25 m, çoğu atan yetişir);
       alıcı hedefe 12 m içindeki en yakın arkadaş */
    if(!en)for(const [eu,ew] of[[PL-7,6],[PL-9,9.5]]){const ex=d*eu,ez=MZ+yan*ew,Lc=hyp(ex-du.x,ez-du.z);if(Lc>R||Lc<15)continue;
      let q=null,qd=12;for(const p of this.sahadakiler(du.takim)){if(p===tk||p.rol==='GK')continue;const dd=hyp(p.x-ex,p.z-ez);if(dd<qd){qd=dd;q=p;}}
      if(q){en={q,hx:ex,hz:ez,hy:Math.min(2.0,hvAlinDur(q)+0.25),L:Lc,deger:0.5};break;}}
    if(!en||karar&&this.rast()>0.7)return null;
    return{q:en.q,hx:en.hx,hz:en.hz,hy:en.hy,L:en.L};
  },
  /* baraj doğrudan şutta sıçrar (kullanimBildir): kalkış temastan hazırlık (sicramaHazir, durarak) + kişisel σ (barajZiplaZaman) sonra; tepe
     topun barajdan geçtiği ~0,4 sn'ye yakın. Yükseklik oyuncunun durarak sıçraması × barajZipla (planlayıcı aynısını bilir) */
  barajZipla(du){const A=MOTOR_AYAR,hz=A.sicramaHazir[0];
    for(const p of du.barajdakiler){if(!p.oyunda||p.zipla||p.eylem&&p.eylem.kilit)continue;const h=hvSicramaH(p,0)*A.barajZipla,eps=this.normal()*A.barajZiplaZaman;
      p.zipla={t:-clamp(hz+eps,0.05,0.4),sure:hvUcus(h),tepe:h,kos:false,hz,cx:p.x,cz:p.z,tt:hz,v0:0};}},
  /* görevliler yerinde mi: kullanan takımın görevlileri hedefine duranYerinde içinde (kullanan hariç; kullanan kendi takımını bekler, rakibin
     savunmacısını beklemez — geç kalan markajcı gerçek bir açıktır); barajdakiler barajdaki yerinde (1 m); barajlı vuruşta hakem dizdi; penaltıda
     herkes */
  gorevlilerYerinde(du){const Y=MOTOR_AYAR.duranYerinde;
    /* T8b: kutudaki koşucular (koşu noktası olanlar) adamlarıyla itişir, vuruşta koşuya başlar: 3 m içinde yerinde sayılır */
    if(du.gorev)for(const [p,g] of du.gorev){if(!p.oyunda||p===du.kullanan||g.hx==null||(p.team!==du.takim&&du.tur!=='penalti'))continue;if(hyp(p.x-g.hx,p.z-g.hz)>(g.kx!=null||g.rol==='perdeAdam'?Y+1.5:Y))return false;}   /* A4-2: perdeci markajcıyla itişir */
    if(du.barajYer)for(const [p,y] of du.barajYer){if(p.oyunda&&hyp(p.x-y.x,p.z-y.z)>1.0)return false;}
    if(du.sinif==='baraj'&&!du.hakemHazir)return false;
    return true;},
  /* kullanım koşulu (stepDurus 'hazir'): kullanan hazır, en az bekleme; tehlikeli duran topta ve penaltıda süre penceresi ve görevliler; kornerde
     ve kenarda el işareti */
  duranHazirMi(du,tk){
    const A=MOTOR_AYAR,H=A.duranHazir[DT_HAZIR[du.tur]]||1;
    if(du.hizli)return du.hazirT>=0.2;
    /* Z2a: sahnenin hedef süresi (el işareti kornerde ve kenarda hedeften 0,8 sn önce); taçta ve kale vuruşunda geciktirme hakemin sayımıyla */
    if(du.sahneT){const isa=du.tur==='korner'||du.sinif==='kenar'?0.8:0,son=du.sahneT-du.sahneKos-isa;
      if((du.tur==='tac'||du.tur==='kaleVurusu')&&du.zgEk>1&&!du.sayim&&du.t>=son){du.sayim=true;this.on('sayim',{takim:du.takim,sure:MOTOR_AYAR.tacSayim||5});}
      /* Z3a (kurma&1): kale vuruşundan ~2 sn önce kaleci kolunu kaldırıp şekli gösterir (kısa kuranda stopere, uzun atanda ileriye; jest 'kol', motor okumaz) */
      if(du.tur==='kaleVurusu'&&(MOTOR_AYAR.kurma&1)&&!du.kvIsaret&&du.t>=son-2.2&&tk){du.kvIsaret=true;const d=this.dir[du.takim],V=tarzTakim(this,du.takim),kp=V?V.kisaPay:1-this.taktik[du.takim].direkt;
        this.jestVer(tk,'kol',0.9,kp>=0.5?{x:du.x+d*8,z:du.z+(du.z<MZ?1:-1)*16}:{x:du.x+d*45,z:MZ});}
      if(du.kr){if(!du.kr.hazir)return false;}else if(!du.s1Sure&&du.t<son+(du.zgEk||0))return false;   /* S1 (js/mac-sahne.js): rutinde (du.kr, S1e) hazırı rutin verir; du.s1Sure'de süreyi sahne planı */
      /* Z2c: spreyli barajda hakem barajı dizmeden vuruş yok (güvenlik ağından 2 sn öncesine dek); S1a seremonisinde (du.hk.s1) kapı düdüktür */
      if(du.hk&&!du.hk.s1&&(du.hk.evre!=='cekil'||!du.hakemHazir)&&du.t<du.zorlaHazir-2)return false;}
    if(!(du.hazirT>=H&&(du.tur==='tac'||hyp(tk.x-du.geriX,tk.z-du.geriZ)<0.5||!du.kr&&du.hazirT>H+2)))return false;   /* S1e: rutinde geri noktası muafiyeti yok */
    if(du.hakemTopu)return this.hakemTopuBirak(du);   /* T10d */
    if(du.zgEk>0&&du.hazirT<H+du.zgEk)return false;   /* T10d: zaman geçirme (js/mac-kurallar.js zamanGecirEk) */
    if(this.duranTehlikeli(du)){if(du.t<A.duranSure[0])return false;if(du.t<A.duranSure[1]&&!this.gorevlilerYerinde(du))return false;}
    else if(du.tur==='penalti'){if(du.t<A.penaltiSure[0])return false;if(du.t<A.penaltiSure[1]&&!this.gorevlilerYerinde(du))return false;}
    if(!du.kr&&(du.tur==='korner'||du.sinif==='kenar')){if(du.isaret==null){du.isaret=du.t;this.jestVer(tk,'kol',0.8,du.bakis||null);return false;}if(du.t-du.isaret<0.8)return false;}   /* S1e: rutinin kol işareti kendi evresinde */
    if(du.dudukGerek&&!this.s1DudukKapisi(du,tk))return false;   /* S1: düdük ön koşulu (js/mac-sahne.js; kuran S1a, S1b, S1d) */
    return true;},
  /* ============ T8b: vuruştan sonra görev düzeni ============
     Korner (T8c'de barajlı ve kenar serbest vuruşu da) kullanıldıktan sonra görevler duranRolSure sn sürer (bolgeKonumu'nun başında
     duranRolKonum): kutudakiler koşu hedeflerinde (servisin alıcısı servisin noktasında; kısa kornerde başlangıç yerlerinde, orta bekler), ikinci
     topçu yayda, geride kalanlar geride; savunmada adam markajı (adamının 0,3 sn sonraki yerinin kale tarafında 0,8 m), bölge, ön direk, yay,
     ileride. Topa yetişen (kovalayan) ve ortanın koşusu (T6d) kendi kuralıyla. Biter: süre doldu, top kale çizgisinden 28 m'den uzağa gitti,
     savunan takım topu 0,8 sn tuttu, şut atıldı (dönen top ve şutu takip kendi kuralıyla), oyun durdu. Eskiden vuruşla birlikte açık oyunun
     düzeni dönüyordu: stoperler “geride kalan” kuralıyla kutudan çıkıyor, hücumcular kanat rollerine dağılıyordu */
  duranSonrasiBaslat(du,alici,hx,hz){
    if(!du.gorev||!du.gorev.size||!(du.tur==='korner'||du.sinif==='baraj'||du.sinif==='kenar'||du.dolum))return;   /* Z2c: kutu dolumu da */
    const G=alici&&alici.team===du.takim?alici.duranRol:null;if(G&&hx!=null&&DT_HEDEF.has(G.rol)){G.kx=hx;G.kz=hz;}
    this._duranSonrasi={t0:this.t,tur:du.tur,takim:du.takim,savunan:1-du.takim,sahipT:-1,kisa:du.rutin==='kisa',x:du.x};
  },
  duranSonrasiBitir(){if(this._duranSonrasi){this._duranSonrasi=null;this.duranRolTemizle();}},
  /* takimAI'nın başında (duruş dışında) */
  duranSonrasiAdim(){
    const DS=this._duranSonrasi;if(!DS)return;const b=this.ball,s=b.sahip,d=this.dir[DS.takim];
    if(s&&s.team===DS.savunan){if(DS.sahipT<0)DS.sahipT=this.t;}else DS.sahipT=-1;
    /* T8f (inceleme bulgusu): bitiş eşiği vuruş noktasına göre — eskiden sabit 28 m, 28–35 m'den kullanılan kenar ve barajlı vuruşta pencere ilk
       adımda kapanıyordu (kutu koşuları ve markaj hiç çalışmıyordu) */
    if(this.phase!=='play'||this.t-DS.t0>MOTOR_AYAR.duranRolSure||b.x*d<Math.min(PL-28,DS.x*d-10)||DS.sahipT>=0&&this.t-DS.sahipT>0.8||this._sonSut&&this._sonSut.t>DS.t0)this.duranSonrasiBitir();
  },
  /* görev düzenindeki oyuncunun hedefi {x, z, ef, h}; null: eski kural (görevsiz, kısa seçenek, kaleci, ortanın koşusundaki alıcı) */
  duranRolKonum(p){
    const DS=this._duranSonrasi,G=p.duranRol;if(!DS||!G||G.hx==null||p.kosu&&p.kosu.tur==='orta')return null;
    if(p.team===DS.takim){
      if(G.rol==='kisa'||G.rol==='ikinci'||G.rol==='geri'||G.rol==='barajYani')return null;   /* Z2c: barajın yanındaki perde de açık oyunla */   /* A4-1: ikinci vurucu, A4-2: geri pasın alıcısı vuruştan sonra açık oyunun kuralıyla */
      if(DT_HEDEF.has(G.rol)||G.rol==='perde'){const x=!DS.kisa&&G.kx!=null?G.kx:G.hx,z=!DS.kisa&&G.kz!=null?G.kz:G.hz,e=hyp(p.x-x,p.z-z);return{x,z,ef:1,h:e>3?1:0.6};}
      return{x:G.hx,z:G.hz,ef:0.6,h:0.7};}
    if(G.rol==='adam'){const o=G.hedef;if(!o||!o.oyunda)return null;const og=this.dir[o.team]*PL,ox=o.x+o.vx*0.3,oz=o.z+o.vz*0.3,L=hyp(og-ox,MZ-oz)||1;
      /* T17b (markajYan): kale tarafında ve top tarafında — adamla topun arasında durur, kafanın yolunda değil (T8: yalnız kale tarafında 0,8 m) */
      const my=MOTOR_AYAR.markajYan;if(my&&(my[0]>0||my[1]>0)){const b=this.ball,bx=b.x-ox,bz=b.z-oz,Lb=hyp(bx,bz)||1;
        return{x:ox+(og-ox)/L*my[0]+bx/Lb*my[1],z:oz+(MZ-oz)/L*my[0]+bz/Lb*my[1],ef:1,h:1};}
      return{x:ox+(og-ox)/L*0.8,z:oz+(MZ-oz)/L*0.8,ef:1,h:1};}
    if(G.rol==='kaleci'||G.rol==='baraj'||G.rol==='yatan')return null;   /* Z2c: yatan barajcı kalkıp oyuna döner */   /* T8c: baraj vuruştan sonra oyuna döner */
    return{x:G.hx,z:G.hz,ef:0.8,h:0.8};},
  /* Z2d: taç rolünün bu karedeki hedefi — atış zamanına (sahnenin hedefi; sahnesizse hazırlığın sonu) göre gel-git ve isteme; markajcı alıcısının
     kale ve top tarafında, perde atanın önünde */
  tacRolAdim(du,p,g){
    const b=this.ball,son=du.sahneT?du.sahneT-du.sahneKos+(du.zgEk||0):(du.asama==='hazir'?du.t+0.3:du.t+3),kalan=son-du.t;
    if(g.rol==='tacGelgit'){const don=kalan<1.6&&g.kx!=null,x=don?g.kx:g.hx,z=don?g.kz:g.hz,e=hyp(p.x-x,p.z-z);
      p.tx=x;p.tz=z;p.hizOran=don?1:e>8?0.7:0.45;p.bak=b;p.yonHedef=null;this.eforVer(p,don?1:0.6);g.istek=don&&e<3.5;return;}
    if(g.rol==='tacIce'||g.rol==='tacGeri'){const k=kalan<1.2;let x=g.hx,z=g.hz;
      if(k&&g.rol==='tacIce'){const L=hyp(du.x-x,du.z-z)||1;x+=(du.x-x)/L*2;z+=(du.z-z)/L*2;}
      const e=hyp(p.x-x,p.z-z);p.tx=x;p.tz=z;p.hizOran=k?0.8:e>8?0.7:0.4;p.bak=b;p.yonHedef=null;this.eforVer(p,k?0.9:0.5);g.istek=k;return;}
    if(g.rol==='tacMarkaj'){const q=g.hedef;if(!q||!q.oyunda){p.tx=g.hx;p.tz=g.hz;p.hizOran=0.5;return;}
      const og=-this.dir[p.team]*PL,qx=q.x+q.vx*0.25,qz=q.z+q.vz*0.25,L=hyp(og-qx,MZ-qz)||1,Lb=hyp(du.x-qx,du.z-qz)||1;
      p.tx=qx+(og-qx)/L*0.9+(du.x-qx)/Lb*0.5;p.tz=qz+(MZ-qz)/L*0.9+(du.z-qz)/Lb*0.5;p.hizOran=1;p.bak=q;p.yonHedef=null;
      this.eforVer(p,hyp(p.x-p.tx,p.z-p.tz)>1?1:0.8);return;}
    if(g.rol==='tacPerde'){const e=hyp(p.x-g.hx,p.z-g.hz);p.tx=g.hx;p.tz=g.hz;p.hizOran=e>6?0.8:0.5;p.bak=du.kullanan||b;p.yonHedef=null;this.eforVer(p,0.6);}
  },
  /* kullananın geri çekilmesi (m): kornerde 3–4,5 (duran top), barajlı vuruşta 4–7 (şut gücü), kenarda 3,5–5,5 (orta), penaltıda 5–7, kale
     vuruşunda 4–6; çabuk ve diğer serbest vuruşta 1,3 (eski) */
  duranGeriMesafe(du,tk){const G=MOTOR_AYAR.duranGeri;let m=1.3;
    if(du.hizli)m=0.8;
    else if(du.tur==='korner')m=3+1.5*profilAlt(tk,'duranTop',0.5);
    else if(du.tur==='penalti')m=4+2*profilAlt(tk,'sutGucu',0.5);
    else if(du.tur==='kaleVurusu')m=2.5+profilAlt(tk,'sutGucu',0.5);
    else if(du.sinif==='baraj')m=4+3*profilAlt(tk,'sutGucu',0.5);
    else if(du.sinif==='kenar')m=3.5+2*profilAlt(tk,'orta',0.5);
    return du.hizli||m<=1.3?m:clamp(m,G[0],G[1]);},
  /* atanın bakacağı yön: kaleye ya da oyunun içine */
  durusHedefAcisi(du){const d=this.dir[du.takim];if(du.tur==='penalti'||(du.tur==='serbest'&&du.baraj))return Math.atan2(MZ-du.z,d*PL-du.x);
    if(du.tur==='korner')return Math.atan2(MZ-du.z,d*(PL-11)-du.x);return Math.atan2((MZ-du.z)*0.3,d*20);},
  /* çabuk serbest vuruş (T8a): tehlikesiz ve kartsız serbest vuruş, kararlı kullanan, 6 m içinde en çok bir rakip, 6–30 m'de çevresi 4 m boş arkadaş */
  hizliSerbestMi(du,tk){
    if(du.tur!=='serbest'||du.hizli!=null||du.kart||du.sinif==='baraj'||du.sinif==='kenar'||du.dolum||!tk||tk.eylem&&tk.eylem.kilit)return false;   /* Z2c: kutu dolumunda çabuk vuruş yok */
    if(tk.oz.karar<MOTOR_AYAR.hizliSerbest)return false;
    let yakin=0;for(const o of this.teams[1-du.takim])if(o.oyunda&&hyp(o.x-du.x,o.z-du.z)<6)yakin++;if(yakin>1)return false;
    for(const q of this.teams[du.takim]){if(!q.oyunda||q===tk||q.rol==='GK')continue;const L=hyp(q.x-du.x,q.z-du.z);if(L<6||L>30)continue;
      if(enYakinRakip(this,q.x,q.z,q.team).d>4)return true;}
    return false;},
  /* faulden sonra yuvarlanan top (serbest vuruş ve penaltı; sahada, 1,5 m/sn'den hızlı, yerde): topa en önce yetişecek oyuncu durdurur; kullanan
     değilse topu duran topun yerine yuvarlar (gerçekte en yakın oyuncu topu yerine geri verir; eskiden kullanan 10–15 m uzağa gidip topu
     getiriyordu, penaltının hazırlığı ~19 sn sürüyordu) */
  topDurdur(du){
    const b=this.ball;if(du.gonderildi||b.tasiyan||Math.abs(b.x)>PL||b.z<0||b.z>PW||b.y>0.6)return;
    const v=hyp(b.vx,b.vz);if(v<1.5&&hyp(b.x-du.x,b.z-du.z)<6){du.durduran=null;return;}
    let p=du.durduran;
    if(!p||!p.oyunda||p.eylem&&p.eylem.kilit){p=null;let enT=5;
      for(const q of this.players){if(!q.oyunda||q.rol==='GK'||q.eylem&&q.eylem.kilit)continue;const k=this.yakalamaNoktasi(q,0.7);if(k.t<enT){enT=k.t;p=q;}}
      du.durduran=p;}
    if(!p)return;
    const k=this.yakalamaNoktasi(p,0.7);p.tx=clamp(k.x,-PL,PL);p.tz=clamp(k.z,0,PW);p.hizOran=0.85;p.bak=b;this.eforVer(p,0.8);
    if(hyp(b.x-p.x,b.z-p.z)<0.9){du.durduran=null;
      if(p===du.kullanan){b.vx=b.vz=0;b.vy=0;}
      else{const L=hyp(du.x-b.x,du.z-b.z)||1,w=L<1.5?0:yerIlkHiz(L,1.2,this.R);b.vx=(du.x-b.x)/L*w;b.vz=(du.z-b.z)/L*w;b.vy=0;du.gonderildi=true;p.kickCd=0.3;}
      this.topDegisti();}
  },
  /* hakemlerin duran toptaki yeri (T8a): kornerde orta hakem ceza sahasının uzak köşesinde, o yarının yan hakemi köşe bayrağının arkasında;
     penaltıda yan hakem kale çizgisi ile ceza sahası çizgisinin kesişiminde, orta hakem yayın yanında; barajlı serbest vuruşta orta hakem
     barajın ucuna yürür (9,15 m), barajı dizer (du.hakemHazir), sonra çaprazına çekilir. Döner: {h:{x,z}|null, yh: yan hakem, yhYer} */
  hakemDuranYeri(du){
    const d=this.dir[du.takim],sx=Math.sign(du.x)||1,yh=sx>0?this.refs[1]:this.refs[2],yz=sx>0?PW+1.0:-1.0;
    if(du.tur==='korner'){const yan=Math.sign(du.z-MZ)||1;
      return{h:{x:d*(PL-12),z:MZ-yan*12},yh,yhYer:{x:sx*(PL+0.8),z:Math.sign(yz-MZ)===yan?yz+Math.sign(yz-MZ)*0.2:yz}};}
    if(du.tur==='penalti')return{h:{x:d*(PL-17),z:MZ+(yz>MZ?-6:6)},yh,yhYer:{x:sx*PL,z:yz>MZ?MZ+CEZA_W:MZ-CEZA_W}};
    if(du.sinif==='baraj'&&!du.hakemHazir&&du.barajUc)return{h:du.hk&&du.hk.evre!=='cekil'?this.hakemSpreyHedef(du):du.barajUc,yh:null,yhYer:null};   /* Z2c: sprey evreleri */
    /* T10d: hakem topunda hakem topun yanına gelir ve bırakır (hakemTopuBirak), sonra topun gerisine ve içeriye 2,5 m çekilir */
    if(du.hakemTopu)return{h:du.birak==null?{x:du.x,z:du.z+(du.z<MZ?0.55:-0.55)}:{x:du.x-d*2.5,z:du.z+(du.z<MZ?2.5:-2.5)},yh:null,yhYer:null};
    return null;},
  /* T10d: hakem topu bırakılır — hakem topun yanına varınca (en geç 14 sn) top 1 m'den bırakılır (olay hakemTopuBirak, hakemde eylem 'birak');
     yere değince oyun başlar (kullanan oynar). Döner: kullanılabilir mi */
  hakemTopuBirak(du){
    const r=this.refs[0],b=this.ball;
    if(du.birak==null){if(hyp(r.x-du.x,r.z-du.z)>1.4&&du.t<14)return false;
      du.birak=this.t;b.tasiyan=null;b.x=du.x;b.z=du.z;b.y=1.0;b.vx=b.vy=b.vz=0;this.topDegisti();
      r.eylem={ad:'birak',t:0,sure:0.7};this.on('hakemTopuBirak',{takim:du.takim,x:du.x,z:du.z});return false;}
    if(b.y>0.12&&this.t-du.birak<1.2)return false;
    if(b.y<0.12){b.y=0;b.vy=0;b.vx=b.vz=0;}
    return hyp(r.x-du.x,r.z-du.z)>=2||this.t-du.birak>2.5;},   /* hakem çekilmeden oynanmaz (top hakeme çarpıyordu) */

  /* ============ yerleşim (T8a; eski mac-kurallar.js durusYerlesim) ============
     Görevliler hedeflerine (adam: adamının kale tarafında 0,9 m); baraj (T8c'ye kadar eski kural); 9,15 m kuralı; taç */
  durusYerlesim(du,dt){
    const d=this.dir[du.takim],gx=d*PL,tk=du.kullanan,savunan=1-du.takim,b=this.ball;
    /* T8b: kullananın temasına ~0,55 sn kala kutudakiler koşu hedeflerine koşar (kısa kornerde değil) */
    const ke=du.asama==='kullan'&&tk&&tk.eylem&&tk.eylem.ad==='vurus'?tk.eylem:null,kos=!!ke&&ke.kalan<0.55&&du.rutin!=='kisa';
    if(du.gorev)for(const [p,g] of du.gorev){if(!p.oyunda||p===tk)continue;
      /* Z2d: taç rolleri (gel-git, içe, geri; markaj ve perde) */
      if(du.tur==='tac'&&TAC_ROL.has(g.rol)){this.gorevYaz(p,'duran');this.tacRolAdim(du,p,g);continue;}
      /* Z2c: yatan barajcı yerine yürür, varınca barajın arkasında yatar (vuruşta kalkar: kullanimBildir) */
      if(g.rol==='yatan'){this.gorevYaz(p,'duran');if(g.yatik){p.tx=p.x;p.tz=p.z;p.hizOran=0;p.vx=0;p.vz=0;p.bak=b;continue;}
        const e=hyp(p.x-g.hx,p.z-g.hz);p.tx=g.hx;p.tz=g.hz;p.hizOran=e>4?0.7:0.4;p.bak=b;p.yonHedef=null;this.eforVer(p,0.6);
        if(e<0.35&&(du.asama==='yerles'||du.asama==='hazir'))g.yatik=true;continue;}
      /* adam markajı: adamının 0,3 sn sonraki yerinin kale tarafında 0,8 m (koşuyu okur; vuruştan sonra duranRolKonum aynı) */
      /* T10d: adamı kendi görev yerinden 6 m'den uzaktaysa markajcı o yerin kale tarafında bekler (adamının önünde geri geri koşup kutuya gelen
         koşucuyu 3 m/sn'ye kilitliyordu: görevliler yerinde %71) */
      if(g.rol==='adam'&&g.hedef){const o=g.hedef;if(o.oyunda){const og=this.dir[o.team]*PL,go=du.gorev.get(o),uzak=!!go&&go.hx!=null&&hyp(o.x-go.hx,o.z-go.hz)>6;
        const ox=uzak?go.hx:o.x+o.vx*0.3,oz=uzak?go.hz:o.z+o.vz*0.3,L=hyp(og-ox,MZ-oz)||1;g.hx=ox+(og-ox)/L*0.8;g.hz=oz+(MZ-oz)/L*0.8;}}
      if(g.hx==null)continue;
      this.gorevYaz(p,'duran');   /* T13-0: görev etiketi */
      /* A4-1: aldatma koşusu — kullananın temasına ~1 sn kala ikinci vurucu tam eforla topun üstünden koşar; topun yanından geçtiği an kalecinin
         tepkisi için kaydedilir (kaleciTepkiSuresi). g.aldatma çizim içindir */
      /* A4-2: perdeci markajcıyla arkadaşının koşu noktası arasında 0,8 m; koşu başlayınca (kos) yeri donar, yerinde kalır */
      if(g.rol==='perdeAdam'&&!g.don){const M=g.perdeM,o=g.hedef,go=o&&du.gorev.get(o);
        if(M&&M.oyunda&&go){const Kx=go.kx!=null?go.kx:go.hx,Kz=go.kz!=null?go.kz:go.hz,L=hyp(Kx-M.x,Kz-M.z)||1;g.hx=M.x+(Kx-M.x)/L*0.8;g.hz=M.z+(Kz-M.z)/L*0.8;}
        if(kos)g.don=true;}
      if(g.rol==='ikinci'&&du.aldatma&&g.kx!=null&&ke&&ke.kalan<1.0){p.tx=g.kx;p.tz=g.kz;p.hizOran=1;p.bak=null;p.yonHedef=null;this.eforVer(p,1);g.aldatma=true;
        if(du.aldatmaGecti==null&&hyp(p.x-du.x,p.z-du.z)<0.6){du.aldatmaGecti=this.t;this._aldatmaT=this.t;}continue;}
      /* T23a3 (duranKosFaz): koşu tetiği oyuncuya göre kayar */
      let kosP=kos;{const F=MOTOR_AYAR.duranKosFaz;if(F>0&&ke&&du.rutin!=='kisa'){const r=g.rol,dl=r==='hedefOn'?F:r==='hedefNokta'||r==='hedefOrta'?0:r==='hedefArka'?-F/2:r==='hedefUzak'?-F:((p.n*7+p.team*3)%5-2)/2*F;kosP=ke.kalan<0.55+dl+(g.faz||0);}}   /* Z2b: trende koşu erken (g.faz) */
      if(kosP&&g.kx!=null){p.tx=g.kx;p.tz=g.kz;p.hizOran=1;p.bak=b;p.yonHedef=null;this.eforVer(p,1);continue;}
      /* görevli yerine düzenli koşar (efor 0,8: T1 hız kipleri 8 m içinde yürütüyordu, hareket eden adamına yetişemiyordu), yerinde ağır */
      /* T10d: 6 sn'den sonra yerine varmamış görevli hızlanır (T8'den: görevliler yerinde %76–78, hedef ≥ %80; geç kalanlar kutuya kendi yarısından
         gelen koşucular, kullanımda hedeflerine ortanca 5,8 m) */
      const e=hyp(p.x-g.hx,p.z-g.hz),acil=du.t>6&&e>3;p.tx=g.hx;p.tz=g.hz;p.hizOran=acil?0.95:e>15?0.85:e>8?0.7:e>2?0.55:0.4;p.bak=b;
      /* markajcı koşan adamını tam eforla izler */
      if(g.rol==='adam'&&g.hedef&&g.hedef.spd>2){p.hizOran=e>1?1:0.8;p.yonHedef=null;this.eforVer(p,1);continue;}
      if(p.rol!=='GK'){p.yonHedef=null;this.eforVer(p,acil?1:e>1.2||g.rol==='adam'?0.8:0.45);}}
    /* Z2c (sahne&4): barajdan 1 m kuralı (IFAB Law 13, 2019) — en az 3 kişilik barajda hücumcular baraj üyelerine 1 m'den yaklaşmaz */
    if(du.baraj&&(MOTOR_AYAR.sahne&4)&&du.barajYer&&du.barajYer.size>=3)for(const p of this.sahadakiler(du.takim)){if(p===tk||p.rol==='GK')continue;
      for(const w of du.barajYer.values()){const dx=p.tx-w.x,dz=p.tz-w.z,L=hyp(dx,dz);if(L<1.05){const s=1.05/(L||1);p.tx=w.x+(L>1e-6?dx:1)*s;p.tz=w.z+dz*s;}}}
    if(du.tur==='serbest'||du.tur==='kaleVurusu'){
      /* T8c: baraj görevlerden (barajKur; yerleri gorev döngüsünde): üyeler topa bakar */
      if(du.barajdakiler)for(const p of du.barajdakiler){if(p.oyunda&&p.duranRol&&p.duranRol.rol==='baraj'){p.bak=b;p.yonHedef=du.barajAci;}}
      /* 9,15 m: savunan takım topa yaklaşmaz (çabuk serbest vuruşta itilmez); kale vuruşunda ceza sahası dışında kalır */
      if(!du.hizli)for(const p of this.sahadakiler(savunan)){if(du.barajdakiler&&du.barajdakiler.includes(p))continue;if(p.rol==='GK'&&du.tur==='serbest')continue;
        const dx=p.tx-du.x,dz=p.tz-du.z,L=hyp(dx,dz),R=du.hakemTopu?4.5:9.6;if(L<R){const s=R/(L||1);p.tx=du.x+dx*s;p.tz=du.z+dz*s;}   /* T10d: hakem topunda 4 m */
        if(du.tur==='kaleVurusu'){const u=p.tx*this.dir[du.takim];if(u<-PL+CEZA_U+1&&Math.abs(p.tz-MZ)<CEZA_W+1)p.tx=this.dir[du.takim]*(-PL+CEZA_U+1.5);}}
    }else if(du.tur==='tac'){
      for(const p of this.sahadakiler(savunan)){const L=hyp(p.tx-du.x,p.tz-du.z);if(L<2.5){p.tz=du.z<MZ?Math.max(p.tz,2.8):Math.min(p.tz,PW-2.8);}}
    }
  }
});
