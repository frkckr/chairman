/* DONDURULMUŞ KOPYA — js/animasyon.js, git f749a6b, 2026-10-08 (araclar/karsilastir/dondur.js).
   Doğrudan yüklenmez: araclar/karsilastir/once-yukle.js bu dosyayı bir işlevin içinde çalıştırır. POSE ve STIL.animasyon o anki değerleriyle sabittir. */
const POSE={"shoot":{"lean":-0.22,"lR":-1.35,"kR":0.25,"lL":0.3,"kL":0.35,"aL":-0.35,"aLz":-1.05,"aR":0.55,"aRz":0.8,"eL":-0.3,"eR":-0.4,"hx":0.15},"runA":{"lean":0.2,"lL":-0.75,"kL":0.35,"lR":0.6,"kR":1.35,"aL":0.65,"aR":-0.7,"eL":-1.1,"eR":-1.1,"aLz":-0.1,"aRz":0.1},"runB":{"lean":0.2,"lL":0.6,"kL":1.35,"lR":-0.75,"kR":0.35,"aL":-0.7,"aR":0.65,"eL":-1.1,"eR":-1.1,"aLz":-0.1,"aRz":0.1},"slide":{"lean":-1.05,"dy":-0.5,"lR":-1.5,"kR":0.05,"lL":-0.55,"kL":1.5,"aL":0.3,"aLz":-0.9,"aR":0.6,"aRz":0.6,"eL":-0.2,"eR":-0.4,"hx":0.5},"dive":{"lL":0.25,"kL":0.5,"lR":-0.35,"kR":0.2,"aLz":-2.9,"aRz":2.9,"eL":-0.1,"eR":-0.1},"ready":{"lean":0.25,"dy":-0.08,"lL":-0.2,"kL":0.45,"lR":0.15,"kR":0.4,"aL":-0.3,"aR":-0.3,"aLz":-0.35,"aRz":0.35,"eL":-0.6,"eR":-0.6},"otur":{"dy":-0.4,"lL":-1.45,"kL":1.45,"lR":-1.45,"kR":1.45,"aL":-0.35,"aR":-0.35,"eL":-0.9,"eR":-0.9,"aLz":-0.05,"aRz":0.05},"sevinc":{"aLz":-2.6,"aRz":2.6,"eL":-0.2,"eR":-0.2,"hx":-0.25},"kafa":{"hx":-0.45,"dy":0.25,"aLz":-0.5,"aRz":0.5,"lL":-0.2,"kL":0.5},"tac":{"aL":-2.8,"aR":-2.8,"eL":-0.5,"eR":-0.5,"lean":-0.15},"tutus":{"aL":-1.1,"aR":-1.1,"eL":-0.8,"eR":-0.8},"mars":{"aR":-0.55,"eR":-1.95,"aRz":0.3,"aL":0.02,"aLz":-0.05},"isaret":{"aR":-2.2,"eR":-0.1,"aRz":0.4},"vurusGeri":{"lean":0.06,"lL":0.8,"kL":1.3,"lR":-0.12,"kR":0.3,"aL":0.35,"aLz":-0.55,"aR":-0.4,"aRz":0.7,"eL":-0.4,"eR":-0.3,"hx":0.18},"vurusTakip":{"lean":-0.28,"lL":-1.35,"kL":0.12,"lR":0.22,"kR":0.35,"aL":-0.35,"aLz":-0.9,"aR":0.5,"aRz":1,"eL":-0.4,"eR":-0.3,"hx":0.2},"pasGeri":{"lean":0.04,"lL":0.45,"kL":0.7,"lR":-0.08,"kR":0.25,"aL":0.2,"aLz":-0.35,"aR":-0.2,"aRz":0.4,"eL":-0.4,"eR":-0.4,"hx":0.2},"pasTakip":{"lean":-0.12,"lL":-0.75,"kL":0.2,"lR":0.12,"kR":0.3,"aL":-0.2,"aLz":-0.5,"aR":0.3,"aRz":0.55,"eL":-0.4,"eR":-0.4,"hx":0.2},"kontrol":{"lean":0.12,"lL":-0.35,"kL":0.55,"lR":0.05,"kR":0.25,"aLz":-0.35,"aRz":0.35,"hx":0.35},"gogus":{"lean":-0.32,"aL":-0.4,"aR":-0.4,"aLz":-0.85,"aRz":0.85,"eL":-0.3,"eR":-0.3,"hx":0.3,"lL":-0.1,"kL":0.3,"lR":0.1,"kR":0.3},"mudahale":{"lean":-0.12,"dy":-0.12,"lL":-1.05,"kL":0.15,"lR":0.35,"kR":0.95,"aL":0.35,"aR":-0.4,"aLz":-0.6,"aRz":0.6,"eL":-0.5,"eR":-0.5},"blok":{"lean":0.05,"aL":0.15,"aR":0.15,"aLz":-0.12,"aRz":0.12,"eL":-2.3,"eR":-2.3,"lL":-0.2,"kL":0.3,"lR":0.2,"kR":0.3},"dusus":{"aL":-2.2,"aR":-2.2,"eL":-0.2,"eR":-0.2,"lL":0.2,"lR":-0.1,"kL":0.4,"kR":0.3,"hx":-0.4},"yerde":{"aL":-2.6,"aR":-0.4,"aLz":-0.4,"aRz":0.3,"eL":-0.4,"eR":-0.6,"lL":0.1,"kL":0.6,"lR":-0.2,"kR":0.2,"hx":-0.3},"yumruk":{"aL":-3,"aR":-3,"eL":-0.05,"eR":-0.05,"dy":0.18,"hx":-0.35,"lL":-0.3,"kL":0.6},"elleAtis":{"lean":0.15,"aL":-2.2,"eL":-0.2,"aR":0.4,"aRz":0.3,"lL":0.2,"lR":-0.4,"kR":0.3},"tacAt":{"lean":0.25,"aL":-1.1,"aR":-1.1,"eL":-0.4,"eR":-0.4,"lL":0.25,"lR":-0.35,"kL":0.2,"kR":0.4},"tasi":{"aL":-0.85,"aR":-0.85,"eL":-0.9,"eR":-0.9,"aLz":0.15,"aRz":-0.15},"itiraz":{"aL":-0.5,"aR":-0.5,"aLz":-0.7,"aRz":0.7,"eL":-1.25,"eR":-1.25,"hx":-0.15},"hakemDuduk":{"aL":-2.5,"eL":-0.2,"aLz":-0.15,"hx":-0.1},"hakemYon":{"aL":-1.55,"eL":0,"aLz":0},"hakemAvantaj":{"aL":-1.35,"aR":-1.35,"eL":0,"eR":0,"aLz":0.25,"aRz":-0.25},"hakemKart":{"aL":-3,"eL":0,"aLz":-0.1,"hx":-0.15},"hakemPenalti":{"aL":-1,"eL":0,"aLz":0},"bayrak":{"aR":-3,"eR":0,"aRz":0.05},"tabela":{"aL":-2.9,"aR":-2.9,"eL":-0.3,"eR":-0.3,"aLz":0.2,"aRz":-0.2},"esneme1":{"lean":0.35,"dy":-0.25,"lL":-0.9,"kL":1.1,"lR":0.6,"kR":0.2,"aL":-0.2,"aR":-0.2,"aLz":-0.2,"aRz":0.2},"esneme2":{"aL":-2.9,"aR":-2.9,"aLz":0.3,"aRz":-0.3,"eL":-0.2,"eR":-0.2,"lean":-0.05},"tokalas":{"aL":-1.1,"eL":-0.35,"aLz":0.15},"comel":{"dy":-0.45,"lR":-1.5,"kR":1.5,"lL":0.1,"kL":1.6,"lean":0.1,"aL":-0.7,"eL":-0.9,"aR":-0.7,"eR":-0.9},"fotoCek":{"dy":-0.45,"lR":-1.5,"kR":1.5,"lL":0.1,"kL":1.6,"lean":0.05,"aL":-1.45,"eL":-1.35,"aR":-1.45,"eR":-1.35,"aLz":0.25,"aRz":-0.25},"foto":{"aL":-0.35,"aR":-0.35,"eL":-1.9,"eR":-1.9,"aLz":0.25,"aRz":-0.25},"alkis":{"aL":-1,"aR":-1,"eL":-1,"eR":-1,"aLz":0.35,"aRz":-0.35},"cember":{"lean":0.45,"aL":-1.6,"aR":-1.6,"aLz":-1,"aRz":1,"eL":-0.2,"eR":-0.2,"hx":0.3},"yorgun":{"lean":0.75,"dy":-0.08,"aL":-0.55,"aR":-0.55,"eL":-0.35,"eR":-0.35,"lL":-0.2,"lR":-0.2,"kL":0.35,"kR":0.35,"hx":-0.3}};
/* ============ Chairman — oyuncu animasyonu: motor durumundan poz (çizim) ============
   Sahibi: E akışı (2026-10-03 maç motoru güncellemesi). Motorun oyuncu alanlarından (eylem, hız, yön ve TEKNIK_PLAN §8'deki sözleşme alanları)
   iskelet pozu üretir: aktör kurulumu, poz karışımı, her karede aktörün yeri/pozu/kökü ve topun çizimi. Motoru yalnız okur: p.* ve top alanlarını
   yazmaz, mac.rast kullanmaz, önbellek yazan motor yöntemlerini çağırmaz. js/mac-sahnesi.js'ten önce yüklenir (AKTORLER kurulurken aktorKur gerekir).
   Katmanlar (her kare, yeni nesne üretmeden): 1) yürüyüş: ayak hedefleri hıza ve hareketin gövdeye göre yönüne bağlı (ileri, geri, yana adım; ayak
   yerdeyken gövdeyle aynı hızda geri kayar, böylece yerde kaymaz), kalça harekete döner, gövde ters döner, ivmeden eğilme ve yatış, baş topa (ya da
   p.bakisYon'a) bakar. 2) eylem yuvaları: her eylemin pozu kendi ağırlığıyla karışır; ağırlık sınırlı hızla yükselir ve iner (eylem yarıda kesilince
   poz atlamaz). 3) bacaklar en son iki kemikli ters kinematikle (IK) ayak hedeflerine uzanır; eylem pozu bacağı ne kadar tutuyorsa IK o kadar çekilir.
   4) kök: düşüş, yerde yatış ve kalkış aynı eksende (düşüşün başında saklanır; ters dönme yok), kaleci uçuşunun yayı, sıçrama.
   Sözleşme alanları yoksa yedek davranış: vuruş stili seçim türünden, düşüş yönü faul olayından ya da hızdan, uçuş evreleri süreden,
   hız kipi (p.kip, T1) hızdan. Boşta pozlar (T1): duran oyuncu eller belde ya da gevşek, ağırlık değiştirir; yürürken yarı ağırlıkla. */
/* ---- kanallar: eski 13 eklem (balkon ve eski pozlar) + iskelet 2 kanalları (js/oyuncular.js pose) ---- */
const EKLEM=['lean','dy','hx','lL','kL','lR','kR','aL','aR','aLz','aRz','eL','eR'];
const ANM_KANAL=EKLEM.concat(['hy','hz','gx','gy','gz','by','bz','lLy','lRy','lLz','lRz','aLy','aRy']);
const ANM_BACAK={lL:1,kL:1,lR:1,kR:1,lLy:1,lRy:1,lLz:1,lRz:1};
const ANM={"adim":{"kisa":0.25,"uzun":0.37,"hizBoy":0.17,"yer":0.6,"yerHiz":0.05,"yerEn":0.22,"kaldir":0.06,"kaldirHiz":0.05,"kaldirTavan":0.42,"geri":0.7,"yan":0.45,"yuvar":0.05},"kalcaDonus":0.5,"egilme":{"kosu":0.2,"ivme":0.025,"yatis":0.03},"dusus":{"aci":1.45,"yuzY":0.12,"yanY":0.16},"dokunus":0.18,"kucukPiksel":12,"top":{"ust":300,"egri":150,"kare":0.6},"sevincCesit":4};   /* dondurulmuş STIL.animasyon */
/* tam gövde pozu: verilmeyen kanallar 0 (düşüş, yerde yatış, kayma gibi bütün bedeni kaplayan pozlara koşu katmanı sızmasın) */
function anmTam(P){const T={};for(const k of ANM_KANAL)T[k]=P[k]||0;return T;}
/* bacağı veren poz bacağın bütün kanallarını tutar (yana açma ve burulma IK'dan sızmasın) */
function anmGenis(P){const T=Object.assign({},P);if('lL' in P){if(!('lLz' in P))T.lLz=0;if(!('lLy' in P))T.lLy=0;if(!('kL' in P))T.kL=0;}
  if('lR' in P){if(!('lRz' in P))T.lRz=0;if(!('lRy' in P))T.lRy=0;if(!('kR' in P))T.kR=0;}return T;}

/* ---- yeni pozlar (sağ ayak/kol için; L harfli kemikler oyuncunun sağıdır, sol taraf aynala() ile). İşaretler: lean+ öne, lL− uyluk öne, kL+ diz büker,
   aL− kol öne/yukarı, aLz− sağ kol yana açılır, eL− dirsek büker, hy+/gy+/by+ sola döner, hz+/gz+ sağa yatar, lLz− sağ bacak yana açılır, lLy− sağ ayak ucu dışa ---- */
const ANM_POZ=(()=>{const G=anmGenis,P=POSE,Tm=anmTam,O=Object.assign;return{
  /* vuruş stilleri: geri salınım (G) ve takip (T) */
  icG:G(O({},P.pasGeri,{lLy:-0.55,hy:-0.12})),icT:G(O({},P.pasTakip,{lLy:-0.7,lLz:0.12,hy:-0.18})),
  disG:G(O({},P.pasGeri,{lLy:0.35,lLz:0.15})),disT:G(O({},P.pasTakip,{lL:-0.6,lLy:0.45,lLz:-0.25,hy:0.15})),
  ustG:G(O({},P.vurusGeri,{hy:-0.25,gy:0.15})),ustT:G(O({},P.vurusTakip,{hy:0.3,gy:-0.1})),
  asirtmaG:G(O({},P.vurusGeri,{lL:0.6,kL:1.2,hy:-0.15})),asirtmaT:G({lean:-0.32,lL:-0.75,kL:0.35,lR:0.15,kR:0.4,aL:-0.2,aLz:-1.0,aR:0.3,aRz:1.0,eL:-0.3,eR:-0.3,hx:0.1,hy:0.1}),
  voleG:G({lean:-0.1,gz:-0.35,hz:-0.15,lL:-0.2,lLz:-1.0,kL:1.2,lR:0.05,kR:0.15,aL:-0.2,aLz:-1.3,aR:0.2,aRz:0.6,eL:-0.3,eR:-0.4,hy:-0.35,hx:0.25}),
  voleT:G({lean:-0.05,gz:-0.45,hz:-0.2,lL:-1.1,lLz:-0.85,kL:0.15,lR:0.05,kR:0.2,aL:-0.1,aLz:-1.4,aR:0.3,aRz:0.9,eL:-0.3,eR:-0.4,hy:0.45,gy:0.2,hx:0.3}),
  yarimVoleG:G(O({},P.vurusGeri,{lean:0.18,hx:0.35})),yarimVoleT:G(O({},P.vurusTakip,{lean:-0.05,lL:-1.0,kL:0.25,hx:0.3})),
  dokun:G({lL:-0.45,kL:0.3,lLy:-0.35}),
  kontrol:G(O({},P.kontrol,{lLy:-0.4})),kontrolUyluk:G({lL:-1.1,kL:1.3,lean:-0.1,aLz:-0.5,aRz:0.5,hx:0.45}),gogus:G(P.gogus),
  kafa:G({hx:-0.45,dy:0.2,aLz:-0.6,aRz:0.6,aL:-0.5,aR:-0.5,eL:-0.6,eR:-0.6,lL:-0.25,kL:0.6,lR:0.1,kR:0.3}),
  /* ikili mücadele: rakip sağda */
  omuz:{lean:0.22,gz:0.28,hz:0.08,aL:0.15,aLz:-0.12,eL:-1.5,aR:-0.25,aRz:0.75,eR:-0.5,hy:-0.1,gy:-0.12,hx:0.1},
  koru:{lean:0.12,gz:0.15,gy:0.3,hy:0.2,aL:0.35,aLz:-1.05,eL:-0.35,aR:-0.3,aRz:0.35,eR:-0.9,hx:0.25},
  jokey:{lean:0.28,aL:-0.25,aR:-0.25,aLz:-0.5,aRz:0.5,eL:-0.9,eR:-0.9,hx:0.15},
  /* T2: topu ayağının altında bekletme (sağ taban topun üstünde, gövde hafif geride, kollar dengede, baş yukarıda); taşıma (hafif öne,
     kollar dengede; bacaklar koşu döngüsünden); dönüş dokunuşu (sağ ayak içe/dışa çeker, gövde dönüşe yatar) */
  bekle:G({lean:-0.04,dy:-0.03,lL:-1.15,kL:1.1,lLy:-0.15,lR:0.1,kR:0.22,aLz:-0.3,aRz:0.25,eL:-0.45,eR:-0.4,hx:0.05}),
  tasi:{lean:0.07,aLz:-0.22,aRz:0.22,eL:-0.55,eR:-0.55,hx:0.08},
  dokunDon:G({lean:0.12,gz:0.14,hz:0.1,lL:-0.35,kL:0.5,lLy:-0.85,lLz:0.25,aLz:-0.55,aRz:0.3,eL:-0.4,eR:-0.5}),
  /* boşta (T1, p.kip dur/yuru): eller belde; gevşek duruş (kollar yanda, ağırlık bir bacakta) */
  belde:{aL:0.25,aR:0.25,aLz:-0.55,aRz:0.55,eL:-1.45,eR:-1.45,hx:0.12},
  gevsek:{aLz:-0.06,aRz:0.1,eL:-0.15,eR:-0.3,hz:0.05,gz:0.06,hx:0.08},
  sendele:{aL:-0.6,aR:-0.6,aLz:-1.15,aRz:1.15,eL:-0.4,eR:-0.4,hx:-0.25},
  /* müdahale (top sağda): uzanan ayak ya da önden blok; şut bloku kollar arkada; kayarak (sağ bacak uzanır, sol kalçaya yatar) */
  mudahaleV:G({lean:-0.05,dy:-0.15,lL:-1.1,lLz:-0.2,lLy:-0.4,kL:0.12,lR:0.3,kR:0.9,aL:0.3,aR:-0.45,aLz:-0.7,aRz:0.7,eL:-0.5,eR:-0.5,hy:-0.25,gy:0.1,hx:0.35}),
  mudahaleB:G({lean:0.1,dy:-0.18,lL:-0.85,lLy:-0.9,kL:0.35,lR:0.35,kR:1.0,aL:0.2,aR:0.2,aLz:-0.6,aRz:0.6,eL:-0.6,eR:-0.6,hx:0.4}),
  blok:G({lean:0.1,dy:-0.12,lL:-0.9,lLz:-0.35,kL:0.15,lR:0.25,kR:0.6,aL:0.55,aR:0.55,aLz:-0.1,aRz:0.1,eL:-1.3,eR:-1.3,hx:0.2}),
  kayma:Tm({lean:-0.95,dy:-0.8,lL:-0.6,lLz:-0.1,kL:0.05,lR:-0.4,lRz:0.15,kR:1.9,gx:-0.1,gz:0.15,aL:-0.4,aLz:-0.9,eL:-0.3,aR:0.9,aRz:0.5,eR:-0.2,hx:0.55,hy:-0.15}),
  /* düşüş (öne, arkaya, sağ yana), yerde yatış ve kalkış ara pozları */
  dususYuz:Tm({aL:-1.7,aR:-1.7,aLz:-0.35,aRz:0.35,eL:-0.35,eR:-0.35,lL:0.1,kL:0.5,lR:-0.25,kR:0.2,hx:-0.55,lean:-0.1}),
  dususSirt:Tm({aL:0.6,aR:0.6,aLz:-0.9,aRz:0.9,eL:-0.3,eR:-0.3,lL:-0.7,kL:0.5,lR:-0.35,kR:0.3,lean:0.25,hx:0.45}),
  dususYan:Tm({aL:-0.3,aLz:-1.4,eL:-0.2,aR:-0.9,aRz:0.4,eR:-0.9,lL:-0.3,kL:0.6,lR:-0.5,kR:0.9,gz:-0.2,hx:0.1}),
  yerdeYuz:Tm({aL:-2.6,aR:-2.4,aLz:-0.4,aRz:0.5,eL:-0.6,eR:-0.9,lL:0.05,kL:0.6,lR:-0.15,kR:0.2,hx:-0.35}),
  yerdeSirt:Tm({lL:-1.3,kL:1.9,lR:-0.6,kR:0.9,aL:-1.15,aR:-1.0,aLz:0.1,aRz:-0.15,eL:-0.5,eR:-0.6,lean:0.35,hx:0.5}),
  yerdeSirt2:Tm({aL:-0.2,aR:-1.2,aLz:-1.2,aRz:1.0,eL:-0.2,eR:-1.4,lL:-0.6,kL:1.1,lR:0.05,kR:0.1,hx:0.2}),
  yerdeYan:Tm({lL:-0.9,kL:1.3,lR:-0.6,kR:1.0,aL:-1.5,aLz:-0.2,eL:-1.2,aR:-0.8,aRz:0.2,eR:-1.4,lean:0.3,hx:0.3}),
  kalkYuz:Tm({lean:0.55,dy:-0.35,lL:-1.45,kL:2.0,lR:-0.9,kR:1.7,aL:-1.4,aR:-1.4,eL:-0.1,eR:-0.1,hx:-0.4}),
  kalkSirt:Tm({lean:0.45,dy:-0.5,lL:-1.5,kL:1.9,lR:-1.3,kR:1.6,aL:0.5,aR:0.5,aLz:-0.4,aRz:0.4,eL:-0.2,eR:-0.2,hx:0.2}),
  kalkYan:Tm({lean:0.35,dy:-0.42,lL:-0.2,kL:1.9,lR:-1.4,kR:1.6,aL:-0.5,aLz:-0.6,eL:-0.1,aR:-0.4,eR:-0.9,hx:0.1,gz:-0.15}),
  /* kaleci: itiş, havada (iki el / tek el, sağa uçuş), iniş, kapanma, hazır duruş, tutuş çeşitleri */
  ucusItis:Tm({lean:0.2,dy:-0.18,lL:-0.45,kL:0.9,lR:-0.35,kR:0.8,aL:-0.8,aR:-0.8,aLz:-0.9,aRz:0.9,eL:-0.5,eR:-0.5,hx:0.1}),
  ucusCift:Tm({lL:0.25,kL:0.5,lR:-0.35,kR:0.2,aLz:-2.9,aRz:2.9,eL:-0.1,eR:-0.1,aL:-0.25,aR:-0.25,hx:-0.1}),
  ucusTek:Tm({lL:0.2,kL:0.4,lR:-0.3,kR:0.3,aRz:2.9,eR:-0.05,aR:-0.2,aL:-0.9,aLz:-0.6,eL:-1.3,hx:-0.15}),
  ucusIn:Tm({lL:0.1,kL:0.5,lR:-0.4,kR:0.6,aL:-1.5,aR:-1.2,aLz:-0.1,aRz:-0.15,eL:-0.4,eR:-0.6,hx:0.1}),
  kapan:Tm({lean:0.5,dy:-0.42,lL:-0.9,kL:1.5,lR:-0.9,kR:1.5,lLz:-0.55,lRz:0.55,aL:-0.5,aR:-0.5,aLz:-1.25,aRz:1.25,eL:-0.15,eR:-0.15,hx:-0.2}),
  kaleciHazir:{lean:0.22,aL:-0.5,aR:-0.5,aLz:-0.5,aRz:0.5,eL:-0.75,eR:-0.75,hx:0.05},
  tutGogus:{lean:0.2,aL:-1.0,aR:-1.0,eL:-1.1,eR:-1.1,aLz:0.25,aRz:-0.25,hx:0.35},
  tutYuksek:{aL:-2.85,aR:-2.85,eL:-0.45,eR:-0.45,aLz:0.15,aRz:-0.15,hx:-0.45,lean:-0.08},
  tutYer:{lean:0.75,aL:-1.25,aR:-1.25,eL:-0.25,eR:-0.25,aLz:0.15,aRz:-0.15,hx:0.3},
  /* sevinç: kollar havada, uçak, yumruk, göğe işaret; dizler üstünde kayma (golcü), sarılma; yenen takım: eller başta, belde, baş önde */
  sevKollar:{aL:-2.7,aR:-2.7,aLz:-0.35,aRz:0.35,eL:-0.3,eR:-0.3,hx:-0.3},
  sevUcak:{aL:0,aR:0,aLz:-1.5,aRz:1.5,eL:-0.05,eR:-0.05,hx:-0.1},
  sevYumruk:{aL:-2.2,aLz:-0.2,eL:-1.6,aR:0.2,aRz:0.3,eR:-1.2,hx:-0.4},
  sevGok:{aL:-2.95,aR:-2.95,aLz:-0.15,aRz:0.15,eL:-0.05,eR:-0.05,hx:-0.55},
  dizKayma:Tm({lean:-0.35,dy:-0.47,lL:0.35,kL:1.75,lR:0.35,kR:1.75,aL:-0.4,aR:-0.4,aLz:-2.3,aRz:2.3,eL:-0.2,eR:-0.2,hx:-0.5}),
  sarilma:{lean:0.25,aL:-1.35,aR:-1.35,aLz:-0.5,aRz:0.5,eL:-0.8,eR:-0.8,hx:0.15},
  basEl:{aL:-2.5,aR:-2.5,aLz:-0.75,aRz:0.75,eL:-2.1,eR:-2.1,hx:-0.15,lean:-0.05},
  belEl:{aL:0.3,aR:0.3,aLz:-0.6,aRz:0.6,eL:-1.5,eR:-1.5,hx:0.4,lean:0.08},
  egik:{hx:0.6,lean:0.12,aL:0.05,aR:0.05,aLz:-0.05,aRz:0.05,eL:-0.15,eR:-0.15},
  /* eski pozların bacak kanallarını tutan ve tam gövde sürümleri */
  otur:Tm(P.otur),kafaEski:G(P.kafa),tac:P.tac,tacAt:G(P.tacAt),vurusTakip:G(P.vurusTakip),yumruk:G(P.yumruk),elleAtis:G(P.elleAtis),
  esneme1:Tm(P.esneme1),comel:Tm(P.comel),fotoCek:Tm(P.fotoCek),yorgun:G(P.yorgun)
};})();
const ANM_VURUS={ic:['icG','icT'],dis:['disG','disT'],ust:['ustG','ustT'],asirtma:['asirtmaG','asirtmaT'],vole:['voleG','voleT'],yarimVole:['yarimVoleG','yarimVoleT']};
const ANM_SEVINC=[ANM_POZ.sevKollar,ANM_POZ.sevUcak,ANM_POZ.sevYumruk,ANM_POZ.sevGok],ANM_UZGUN=[ANM_POZ.basEl,ANM_POZ.belEl,ANM_POZ.egik];

/* ---- eylem yuvaları: sıra karışım sırasıdır (sonraki baskın). [ad, yükselme hızı, inme hızı] (ağırlık/sn) ---- */
const ANM_SLOT=[['bosta',2,4],['hazir',5,4],['jokey',5,4],['koru',6,5],['bekle',3,3],['tasi',4,4],['dokun',40,10],['kontrol',30,8],['gogus',30,8],['vG',40,8],['vT',40,8],['degaj',30,8],
  ['kafa',16,16],['omuz',12,8],['sendele',15,6],['mudahale',30,7],['blok',30,8],['kayma',12,3],['ucusI',30,6],['ucusH',30,5],['ucusN',30,5],['kapan',12,6],
  ['tutus',25,8],['yumruk',30,8],['elleAtis',30,8],['dusus',10,4],['yerde',4,3],['kalk',20,5],['tac',6,5],['tacAt',30,6],['elde',10,10],['itiraz',30,8],
  ['p0',5,5],['p1',10,10],['p2',5,5],['p3',5,5],['p4',5,5],['p5',5,5],['p6',5,5],['p7',5,5],['sevinc',6,6],['sarilma',4,4],['dizKayma',5,4],['uzgun',2,3],['mars',3,3]];
const ANM_S={},ANM_SY=new Float32Array(ANM_SLOT.length),ANM_SD=new Float32Array(ANM_SLOT.length);
ANM_SLOT.forEach((s,i)=>{ANM_S[s[0]]=i;ANM_SY[i]=s[1];ANM_SD[i]=s[2];});
const POZ_ETIKET=['esneme','tokalas','comel','foto','alkis','cember','yorgun','tutus'];
const ANM_ETIKET_POZ=[null,POSE.tokalas,ANM_POZ.comel,POSE.foto,POSE.alkis,POSE.cember,ANM_POZ.yorgun,POSE.tutus];

/* ---- aktörler: motordaki her oyuncu, hakem ve kenar kişisi için bir model ---- */
function aktorKur(K,kaynak,boy){
  const m=player(K);m.root.rotation.order='YXZ';scene.add(m.root);golgeEkle(m);
  const N=ANM_SLOT.length,P={},C={};for(const k of ANM_KANAL)P[k]=0;for(const k in ANM_BACAK)C[k]=1;
  return{m,kaynak,boy:boy||1,J:{},yaw:0,ph:rnd()*6,amp:0,w:{},px:kaynak?kaynak.x:0,pz:kaynak?kaynak.z:0,x:0,z:0,
    P,C,sw:new Float32Array(N),st:new Float32Array(N),sp:new Array(N).fill(null),faz0:rnd()*6.283,
    /* yürüyüş: dünya hızı/ivmesi, gövdeye göre hareket yönü, ayak hedefleri (x,y,z ×2), kalça/baş dönüşü, tavır parametreleri */
    wvx:0,wvz:0,awx:0,awz:0,mX:0,mZ:1,W:new Float32Array(4),D:new Float32Array(4),anc:new Uint8Array(2),yawO:0,don:0,T:new Float32Array([-0.1,-0.034,0.025,0.1,-0.034,0.025]),qA:new Float32Array(2),beta:0.6,dyR:0,hy:0,by:0,
    gDrop:0,gGen:0,gAdim:1,gHy:0,tvSon:null,jYan:1,korP:null,bekP:null,yEk:0,kucuk:false,phItme:0,dokT:-1,dokSon:undefined,dokSurum:-1,dokP:null,dokDon:false,
    /* eylem: son görülen eylem nesnesi ve başında seçilenler */
    eyl:null,eylAd:'',oSag:1,vG:null,vT:null,vGm:1,vTm:1,vStil:null,kP:null,mP:null,bP:null,kyP:null,oP:null,tP:null,uP:null,uY:0.8,uFaz:'',uG:0,
    sdX:0,sdZ:1,sdS:0.6,bosT:0,bosP:null,sevSon:false,sevC:0,sevH:8,sevDiz:false,dizAktif:false,uzP:null,
    /* kök: yatış ekseni (gövde çerçevesinde x,z), açısı, uzun eksen etrafında dönüş; düşüş/kalkış pozları */
    lkx:1,lkz:0,lth:0,lps:0,lps0:0,lieTur:'',lieSag:true,dP:null,yP:null,kkP:null,kTh0:0,kPs0:0};
}

/* ---- pozlar: sürekli karışım ---- */
const kar=(J,P,w)=>{if(w<=0.001)return;for(const k in P)J[k]=J[k]+(P[k]-J[k])*w;};
/* aktörün poz karışımı: bacak kanallarında pozun payı da tutulur (kalan pay IK'nındır) */
function anmKar(a,P,w){if(w<=0.001)return;const J=a.P,C=a.C;if(w>1)w=1;for(const k in P){J[k]+=(P[k]-J[k])*w;if(ANM_BACAK[k]===1)C[k]*=1-w;}}
function yumusak(a,ad,hedef,hiz,dt){const v=a.w[ad]||0;a.w[ad]=v+(hedef-v)*Math.min(1,dt*hiz);return a.w[ad];}
function aciYumusak(a,h,dt,hiz){let d=h-a.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));a.yaw+=d*Math.min(1,dt*hiz);}
const yanPoz=(P,sol)=>sol?aynala(P):P;
const tepe=(t,s)=>Math.sin(Math.PI*clamp(t/s,0,1));
/* giriş-tutma-çıkış zarfı: g sn'de yükselir, sürenin son c sn'sinde iner */
const anmZarf=(t,s,g,c)=>Math.max(0,Math.min(1,t/g,(s-t)/c));
/* (x,z) noktası oyuncunun sağında mı (motor koordinatı; sağ = yon + 90°) */
const anmSagda=(p,x,z)=>-(x-p.x)*Math.sin(p.yon)+(z-p.z)*Math.cos(p.yon)>0;
const ANM_DUSUS=new Map();
/* ekranda boy (piksel): uzaktaki küçük oyuncuda ayrıntı katmanları atlanır */
const ANM_LOD={fov:-1,k:0};
function anmPiksel(a,sy){if(typeof camera==='undefined')return 99;
  if(camera.fov!==ANM_LOD.fov){ANM_LOD.fov=camera.fov;ANM_LOD.k=1.8*(STIL.ekran.yukseklik/2)/Math.tan(camera.fov*Math.PI/360);}
  const c=camera.position,dx=a.x-c.x,dy=0.9-c.y,dz=a.z-c.z;return ANM_LOD.k*sy/(Math.sqrt(dx*dx+dy*dy+dz*dz)||1);}

/* ---- 1. yürüyüş: ayak hedefleri (kök çerçevesinde, model birimi), kalça/gövde dönüşü, eğilme, kollar, baş ---- */
function anmYuruyus(a,p,spd,dt,sx,sy){
  const P=a.P,A=ANM.adim,T=a.T,E=ANM.egilme,TAU=6.283185307179586;
  /* gerçek hız: çizilen yerin iki motor adımı arasındaki değişimi (ayak buna göre yerde durur) */
  let vx=0,vz=0;if(p&&spd>0){vx=(p.x-a.px)/ADIM;vz=(p.z-a.pz)/ADIM;if(vx*vx+vz*vz>225)vx=vz=0;}
  if(dt>0){const k=Math.min(1,dt*12),ox=a.wvx,oz=a.wvz;a.wvx+=(vx-a.wvx)*k;a.wvz+=(vz-a.wvz)*k;const k2=Math.min(1,dt*6);a.awx+=((a.wvx-ox)/dt-a.awx)*k2;a.awz+=((a.wvz-oz)/dt-a.awz)*k2;}
  const sY=Math.sin(a.yaw),cY=Math.cos(a.yaw),vf=(vx*sY+vz*cY)/sx,vr=(-vx*cY+vz*sY)/sx,s=Math.sqrt(vf*vf+vr*vr);
  const af=a.awx*sY+a.awz*cY,ar=-a.awx*cY+a.awz*sY;
  if(s>0.05&&dt>0){const k=Math.min(1,dt*(3+4*s));a.mX+=(-vr/s-a.mX)*k;a.mZ+=(vf/s-a.mZ)*k;const L=Math.sqrt(a.mX*a.mX+a.mZ*a.mZ)||1;a.mX/=L;a.mZ/=L;}
  const mX=a.mX,mZ=a.mZ,wF=mZ>0?mZ*mZ:0,wB=mZ<0?mZ*mZ:0,wS=mX*mX;
  /* yerinde dönerken de adım atılır: evre hızı max(hız, dönüş hızı × 0,25 m); yerdeki ayağın yolu buna göre kısalır */
  if(dt>0){let d=a.yaw-a.yawO;d=Math.atan2(Math.sin(d),Math.cos(d));a.don+=(Math.abs(d)/dt-a.don)*Math.min(1,dt*6);}a.yawO=a.yaw;
  const sA=Math.max(s,Math.min(3,a.don*0.25)*(1-Math.min(1,s/1.5)));
  const kA=(wF+A.geri*wB+A.yan*wS)*a.gAdim,adim=(sy*(A.kisa+A.uzun*Math.min(1,sA/1.4))+A.hizBoy*sA)*kA;
  const beta=clamp(A.yer-A.yerHiz*sA,A.yerEn,A.yer);a.beta=beta;
  if(dt>0&&sA>0.02){a.ph+=dt*Math.PI*sA/adim;if(a.ph>TAU)a.ph-=TAU;}
  const R=2*beta*adim*(sA>0.02?s/sA:1),run=Math.min(1,s*sx/7.5),kal=Math.min(A.kaldirTavan,A.kaldir+A.kaldirHiz*sA)*Math.min(1,sA/0.6)*(sA>s?1:wF+0.6*wB+0.5*wS)*sy;
  const gen=Math.max(0,(Math.abs(mX)*R-0.12)/2)+a.gGen,zOff=0.025-0.05*run,yuv=A.yuvar*4*Math.min(1,R/0.5),Lr=0.928,W=a.W,Dv=a.D;
  let need=9,u0=a.ph/TAU;
  for(let i=0;i<2;i++){let u=u0+i*0.5;u-=Math.floor(u);let q,h=0,g=0;const yer=u<beta;
    /* salınım: Hermite eğrisi; kalkışta ve yere inişte ayak gövdeye göre yerdeki hızla geri gider (inişte yerde sürtmez) */
    if(yer)q=0.5-u/beta;else{g=(u-beta)/(1-beta);const m=-(1-beta)/beta;q=g*g*(3-2*g)-0.5+m*g*(2*g-1)*(g-1);h=kal*Math.sin(Math.PI*Math.sqrt(g));}
    const sd=i?1:-1,j=i*3,k2=i*2;let x=sd*(0.1+gen)+mX*q*R,z=zOff+mZ*q*R;const y=-0.034+h+yuv*q*q;
    /* yerdeki ayak dünyaya çivilenir (dönüşte ve hız değişiminde kaymaz); sapma 0,6 m'yi aşarsa ayak sürüklenir. Kalkan ayak sapmayı salınımda kapatır */
    if(yer){if(!a.anc[i]){W[k2]=a.x+(x*cY+z*sY)*sx;W[k2+1]=a.z+(-x*sY+z*cY)*sx;a.anc[i]=1;}
      const dx=W[k2]-a.x,dz=W[k2+1]-a.z,ax=(dx*cY-dz*sY)/sx,az=(dx*sY+dz*cY)/sx;let ex=ax-x,ez=az-z;const e=Math.sqrt(ex*ex+ez*ez);
      if(e>0.6){const k=0.6/e;ex*=k;ez*=k;W[k2]=a.x+((x+ex)*cY+(z+ez)*sY)*sx;W[k2+1]=a.z+(-(x+ex)*sY+(z+ez)*cY)*sx;}
      x+=ex;z+=ez;Dv[k2]=ex;Dv[k2+1]=ez;}
    else{a.anc[i]=0;const f=1-g*g*(3-2*g);x+=Dv[k2]*f;z+=Dv[k2+1]*f;}
    T[j]=x;T[j+1]=y;T[j+2]=z;a.qA[i]=2*q*mZ;
    /* yerdeki ayağa uzanmak için kalçanın inmesi gereken yer */
    if(yer){const dx=x-sd*0.1,dh2=dx*dx+z*z,v=Math.sqrt(Math.max(0.04,Lr*Lr-dh2))+y-0.91;if(v<need)need=v;}}
  if(need>8)need=a.dyR;need=Math.min(0,need);if(need<a.dyR)a.dyR=need;else if(dt>0)a.dyR+=(need-a.dyR)*Math.min(1,dt*12);
  P.dy=Math.min(-a.gDrop,a.dyR);
  P.lean=E.kosu*run*wF+0.05*wB*Math.min(1,s)+clamp(af*E.ivme,-0.25,0.12)+0.6*a.gDrop;
  P.hz=clamp(ar*E.yatis,-0.25,0.25)*Math.min(1,s/2);
  /* kalça hareket çizgisine döner (geri koşuda düz kalır), gövde ters döner */
  let fl=Math.atan2(-mX,mZ);if(fl>1.5708)fl-=Math.PI;else if(fl<-1.5708)fl+=Math.PI;
  const hyH=-clamp(fl*0.7,-ANM.kalcaDonus,ANM.kalcaDonus)*Math.min(1,s/1.5)+a.gHy;if(dt>0)a.hy+=(hyH-a.hy)*Math.min(1,dt*8);
  P.hy=a.hy;P.gy=-a.hy*0.8;
  /* kollar bacaklara ters salınır; yana adımda hafif açılır */
  const kol=(0.15+0.75*run)*(wF+0.8*wB)*Math.min(1,s/0.5);P.aL=kol*a.qA[0];P.aR=kol*a.qA[1];
  P.eL=P.eR=-(0.25+run);P.aLz=-0.08-0.25*wS*Math.min(1,s);P.aRz=-P.aLz;
  /* baş: p.bakisYon ya da top (oyun, duran top ve santrada); yakındaki topa hafif aşağı */
  const ph=mac.phase;
  if(p&&!a.kucuk&&p.yon!=null&&(ph==='play'||ph==='durus'||ph==='kickoff')){const b=mac.ball,dx=b.x-p.x,dz=b.z-p.z,d2=dx*dx+dz*dz;let hed=p.bakisYon;if(hed==null&&d2>0.25)hed=Math.atan2(dz,dx);
    let by=0;if(hed!=null){const r=Math.atan2(Math.sin(hed-p.yon),Math.cos(hed-p.yon));by=-clamp(r,-1.25,1.25);}
    /* yakındaki topa baş eğilir; bakış (tarama) topun yönünden uzaklaştıkça baş kalkar (T2 bakınma: omuz üstünden bakan başını kaldırır) */
    if(dt>0)a.by+=(by-a.by)*Math.min(1,dt*8);P.by=a.by-P.hy-P.gy;
    if(d2<16){let k=1;if(p.bakisYon!=null&&d2>0.01){const r=Math.atan2(Math.sin(p.bakisYon-Math.atan2(dz,dx)),Math.cos(p.bakisYon-Math.atan2(dz,dx)));k=clamp(Math.cos(r),0,1);}
      P.hx+=0.25*(1-Math.sqrt(d2)/4)*k;}}
  else if(dt>0){a.by*=Math.max(0,1-dt*6);P.by=a.by-P.hy-P.gy;}
}

/* ---- tavır (sözleşme: p.tavir) → yürüyüş parametreleri ve üst gövde ---- */
function anmTavir(a,p,dt){
  let drop=0,gen=0,adim=1,hyE=0;
  if(p&&p.tur==='oyuncu'){const tv=p.tavir,b=mac.ball,st=a.st,sp=a.sp,S=ANM_S;
    let hazir=tv==='hazir';if(tv==null&&p.rol==='GK'&&b.sut&&b.sut.team!==p.team&&mac.phase==='play'&&!p.eylem)hazir=true;
    if(tv!==a.tvSon){a.tvSon=tv;if(tv==='jokey')a.jYan=anmSagda(p,b.x,b.z)?1:-1;
      if(tv==='koru'){let o=null,ed=1e9;const R=mac.teams&&mac.teams[1-p.team];if(R)for(const q of R){if(!q.oyunda)continue;const d=(q.x-p.x)*(q.x-p.x)+(q.z-p.z)*(q.z-p.z);if(d<ed){ed=d;o=q;}}
        a.korP=!o||anmSagda(p,o.x,o.z)?ANM_POZ.koru:aynala(ANM_POZ.koru);}
      if(tv==='bekle')a.bekP=p.ayak==='sol'?aynala(ANM_POZ.bekle):ANM_POZ.bekle;}
    if(hazir){st[S.hazir]=1;sp[S.hazir]=ANM_POZ.kaleciHazir;drop=0.13;gen=0.12;adim=0.6;}
    else if(tv==='jokey'){st[S.jokey]=1;sp[S.jokey]=ANM_POZ.jokey;drop=0.12;gen=0.07;adim=0.65;hyE=-0.35*a.jYan;}
    else if(tv==='koru'){st[S.koru]=1;sp[S.koru]=a.korP;drop=0.07;gen=0.08;adim=0.8;}
    else if(tv==='bekle'){st[S.bekle]=1;sp[S.bekle]=a.bekP||ANM_POZ.bekle;adim=0.7;}
    /* T2 taşıma: topu süren oyuncu (eylemsiz, tavırsız) koşarken hafif öne eğik, kollar dengede (hızla artar) */
    const v=Math.sqrt((p.vx||0)*(p.vx||0)+(p.vz||0)*(p.vz||0)),sahip=b.sahip===p;
    if(sahip&&!tv&&!p.eylem){st[S.tasi]=clamp((v-1.2)/2,0,1);sp[S.tasi]=ANM_POZ.tasi;}
    /* boşta (T1; sözleşme: p.kip, yoksa hızdan): bir süre duran oyuncu eller belde ya da gevşek durur, ağırlığını değiştirir (anmEkler);
       yürürken yarı ağırlıkla. Oyuncuya göre sabit seçim (h2), rastlantısız. Topu süren boşta duruşa girmez (T2) */
    const ph=mac.phase,kip=p.kip!=null?p.kip:v<0.2?'dur':v<2?'yuru':'';
    if(!tv&&!hazir&&!sahip&&!p.eylem&&!p.poz&&!p.sevinc&&(ph==='play'||ph==='durus'||ph==='kickoff')){
      a.bosT=kip==='dur'?a.bosT+dt:0;
      if(!a.bosP){const n=(p.n!=null?p.n:p.no||0)|0;a.bosP=h2(n*5+(p.team|0),11)<0.35?ANM_POZ.belde:ANM_POZ.gevsek;}
      st[S.bosta]=kip==='dur'?(a.bosT>1.2?1:0):kip==='yuru'?0.45:0;sp[S.bosta]=a.bosP;}
    else a.bosT=0;}
  if(dt>0){const k=Math.min(1,dt*5);a.gDrop+=(drop-a.gDrop)*k;a.gGen+=(gen-a.gGen)*k;a.gAdim+=(adim-a.gAdim)*k;a.gHy+=(hyE-a.gHy)*k;}
}

/* ---- eylemin başında bir kez: hangi ayak/yan, stil, düşüş yönü, kalkış biçimi ---- */
function anmDususBasla(a,p,e){
  let y=e.yon;
  if(y==null){const k=ANM_DUSUS.get(p);if(k&&zaman-k.t<1.5)y=k.yon;ANM_DUSUS.delete(p);}
  if(y==null){const s=Math.sqrt(p.vx*p.vx+p.vz*p.vz);y=s>1.2?Math.atan2(p.vz,p.vx):p.yon+Math.PI+(rnd()-0.5)*1.6;}
  const r=y-p.yon,dX=-Math.sin(r),dZ=Math.cos(r),sag=dX<0;
  if(a.lth<0.1){a.lkx=dZ;a.lkz=-dX;}
  const tur=dZ>0.5?'yuz':dZ<-0.5?'sirt':'yan';a.lieTur=tur;a.lieSag=sag;
  if(tur==='yan'){const sirta=e.yuzustu===true?false:e.yuzustu===false?true:rnd()<0.6;a.lps0=(sag?1:-1)*(sirta?1.1:-1.1);if(sirta)a.lieTur='yanSirt';}
  else a.lps0=(rnd()-0.5)*0.6;
  a.dP=tur==='yuz'?ANM_POZ.dususYuz:tur==='sirt'?ANM_POZ.dususSirt:sag?ANM_POZ.dususYan:aynala(ANM_POZ.dususYan);
  const yS=rnd()<0.5?ANM_POZ.yerdeSirt:ANM_POZ.yerdeSirt2,ay=rnd()<0.5;
  a.yP=tur==='yuz'?ANM_POZ.yerdeYuz:a.lieTur==='yan'?(sag?ANM_POZ.yerdeYan:aynala(ANM_POZ.yerdeYan)):(ay?aynala(yS):yS);
}
function anmBasla(a,p,e,ad){
  const b=mac.ball;
  if(ad==='vurus'||ad==='tekme')anmVurusSec(a,p,e,ad);
  else if(ad==='kontrol'){const P0=e.yuzey==='uyluk'?ANM_POZ.kontrolUyluk:ANM_POZ.kontrol;a.kP=anmSagda(p,b.x,b.z)?P0:aynala(P0);}
  else if(ad==='mudahale'){const P0=rnd()<0.3?ANM_POZ.mudahaleB:ANM_POZ.mudahaleV;a.mP=anmSagda(p,b.x,b.z)?P0:aynala(P0);}
  else if(ad==='blok')a.bP=anmSagda(p,b.x,b.z)?ANM_POZ.blok:aynala(ANM_POZ.blok);
  else if(ad==='kayma'){const sag=anmSagda(p,b.x,b.z);a.kyP=sag?ANM_POZ.kayma:aynala(ANM_POZ.kayma);if(a.lth<0.1){a.lkx=0;a.lkz=sag?-1:1;}a.lieTur='kayma';a.lieSag=!sag;}
  else if(ad==='dusus')anmDususBasla(a,p,e);
  else if(ad==='yerde'){if(a.lth<0.3)anmDususBasla(a,p,e);}
  else if(ad==='kalkis'){a.kTh0=a.lth;a.kPs0=a.lps;const t=a.lth<0.25?'':a.lieTur,sag=a.lieSag;
    a.kkP=t==='yuz'?ANM_POZ.kalkYuz:t==='yan'||t==='ucus'||t==='kapan'||e.kaleci?(sag?ANM_POZ.kalkYan:aynala(ANM_POZ.kalkYan)):ANM_POZ.kalkSirt;}
  else if(ad==='ucus'){const vx=e.vx||0,vz=e.vz!=null?e.vz:(e.yan||1);let r=-vx*Math.sin(p.yon)+vz*Math.cos(p.yon);if(!r)r=e.yan||1;const sag=r>0;
    a.uY=e.hedefY!=null?e.hedefY:e.y!=null?e.y:0.8;const tek=e.el?e.el==='tek':a.uY>1.6;
    a.uP=tek?(sag?ANM_POZ.ucusTek:aynala(ANM_POZ.ucusTek)):ANM_POZ.ucusCift;a.uNP=sag?ANM_POZ.ucusIn:aynala(ANM_POZ.ucusIn);
    if(a.lth<0.1){a.lkx=0;a.lkz=sag?1:-1;}a.lieTur='ucus';a.lieSag=sag;}
  else if(ad==='tutus'){const tur=e.tur||(b.y>1.55?'yuksek':b.y<0.45?'yer':'gogus');a.tP=tur==='yuksek'?ANM_POZ.tutYuksek:tur==='yer'?ANM_POZ.tutYer:ANM_POZ.tutGogus;}
  else if(ad==='omuz'){const r=e.rakip;const sag=r&&r.x!=null?anmSagda(p,r.x,r.z):(e.taraf==='sag'||e.taraf>0);a.oP=sag?ANM_POZ.omuz:aynala(ANM_POZ.omuz);a.oSag=sag?1:-1;}
  else if(ad==='sendele'){const y=e.yon!=null?e.yon:Math.atan2(p.vz||0,p.vx||1),r=y-p.yon;a.sdX=-Math.sin(r);a.sdZ=Math.cos(r);a.sdS=e.siddet!=null?clamp(e.siddet,0.2,1):0.6;}
  else if(ad==='kapan'){let sag;if(e.yon!=null)sag=Math.sin(e.yon-p.yon)>0;else sag=anmSagda(p,b.x,b.z);if(a.lth<0.1){a.lkx=0;a.lkz=sag?1:-1;}a.lieTur='kapan';a.lieSag=sag;}
}
/* vuruş stili (sözleşme: vurus.stil, guc, tekDokunus); yoksa seçimin türünden */
function anmVurusSec(a,p,e,ad){
  const sec=e.sec||{},b=mac.ball;let st=e.stil,g=e.guc;
  if(ad==='tekme')st=e.kucuk?'ic':'ust';
  else if(!st)st=sec.tur==='sut'?(b.y>0.45?'vole':'ust'):(sec.tip||'yer')==='yer'&&sec.tur!=='uzaklastir'?'ic':'ust';
  if(g==null){if(ad==='tekme')g=e.kucuk?0.4:0.8;else if(sec.tur==='sut'||sec.tur==='uzaklastir')g=0.9;
    else if(st==='ic'){const dx=(sec.hx!=null?sec.hx:p.x)-p.x,dz=(sec.hz!=null?sec.hz:p.z)-p.z;g=clamp(0.25+Math.sqrt(dx*dx+dz*dz)/40,0.25,0.85);}else g=0.75;}
  const V=ANM_VURUS[st]||ANM_VURUS.ust,sol=e.ayak==='sol',tek=e.tekDokunus||sec.ilk;
  a.vStil=e.stil;a.vG=sol?aynala(ANM_POZ[V[0]]):ANM_POZ[V[0]];a.vT=sol?aynala(ANM_POZ[V[1]]):ANM_POZ[V[1]];
  a.vGm=(0.55+0.45*g)*(tek?0.6:1);a.vTm=0.6+0.4*g;
}
/* top sürerken dokunuş (sözleşme: p.sonDokunus; yoksa topun sürümü ve son dokunan): kısa ayak hareketi, adım evresi o ayağı öne getirir */
function anmDokunus(a,p,e,dt){
  if(a.dokT>=0){a.dokT+=dt;if(a.dokT>ANM.dokunus)a.dokT=-1;}
  if(a.phItme&&dt>0){const d=a.phItme*Math.min(1,dt*10);a.ph+=d;a.phItme-=d;if(Math.abs(a.phItme)<0.005)a.phItme=0;}
  if(a.kucuk||!p.oyunda)return;
  const sd=p.sonDokunus,b=mac.ball;let yeni=false,ayak=-1;
  if(sd){if(sd.t!==a.dokSon){yeni=a.dokSon!==undefined;a.dokSon=sd.t;ayak=sd.ayak==='sol'?1:sd.ayak==='sag'?0:-1;}}
  else if(b.sonDokunan===p&&b.surum!==a.dokSurum){a.dokSurum=b.surum;yeni=b.sahip===p&&b.y<0.4;}
  if(!yeni||e)return;
  if(ayak<0)ayak=anmSagda(p,b.x,b.z)?0:1;
  const bt=a.beta,hu=bt+0.72*(1-bt);let u=a.ph/6.283185307179586+ayak*0.5;u-=Math.floor(u);let d=hu-u;d-=Math.round(d);
  /* T2: dönüş dokunuşu (sözleşme: sonDokunus.donus) gövdeyi dönüşe yatırır, ayak topu içe/dışa çeker */
  const P0=sd&&sd.donus?ANM_POZ.dokunDon:ANM_POZ.dokun;
  a.phItme=clamp(d*6.283185307179586,-0.9,0.9);a.dokT=0;a.dokP=ayak?aynala(P0):P0;a.dokDon=!!(sd&&sd.donus);
}

/* ---- 2. eylem yuvalarının hedef ağırlıkları ---- */
function anmEylemler(a,p,dt){
  const e=p.eylem,ad=e?e.ad:'',b=mac.ball,st=a.st,sp=a.sp,S=ANM_S,ph=mac.phase;
  if(e!==a.eyl){a.eyl=e;a.eylAd=ad;if(e)anmBasla(a,p,e,ad);}
  anmDokunus(a,p,e,dt);
  if(a.dokT>=0){st[S.dokun]=(a.dokDon?0.75:0.55)*tepe(a.dokT,ANM.dokunus);sp[S.dokun]=a.dokP;}
  if(ad==='vurus'){if(e.stil!==undefined&&e.stil!==a.vStil&&e.faz!=='takip')anmVurusSec(a,p,e,ad);
    if(e.faz==='geri')st[S.vG]=a.vGm*clamp(e.ft/Math.max(0.05,e.geri),0,1);
    else if(e.faz==='takip'){const f=e.ft/0.26;st[S.vG]=a.vGm*Math.max(0,1-f/0.3);st[S.vT]=a.vTm*(f<0.3?f/0.3:1-0.75*(f-0.3)/0.7);}
    sp[S.vG]=a.vG;sp[S.vT]=a.vT;}
  else if(ad==='tekme'){const f=e.t/e.sure;if(f<0.33)st[S.vG]=f/0.33;else{const g=(f-0.33)/0.67;st[S.vG]=Math.max(0,1-g*3);st[S.vT]=g<0.3?g/0.3:1-(g-0.3)/0.7;}sp[S.vG]=a.vG;sp[S.vT]=a.vT;}
  else if(ad==='degaj'){const f=e.t/e.sure;st[S.degaj]=f<0.3?f/0.3:1-(f-0.3)/0.7;sp[S.degaj]=ANM_POZ.vurusTakip;}
  else if(ad==='kontrol'){st[S.kontrol]=tepe(e.t,e.sure)*0.85;sp[S.kontrol]=a.kP;}
  else if(ad==='gogus'){st[S.gogus]=tepe(e.t,e.sure);sp[S.gogus]=ANM_POZ.gogus;}
  else if(ad==='kafa'){st[S.kafa]=1;sp[S.kafa]=ANM_POZ.kafa;}
  else if(ad==='omuz'){st[S.omuz]=anmZarf(e.t,e.sure||0.5,0.1,0.15);sp[S.omuz]=a.oP;}
  else if(ad==='sendele'){st[S.sendele]=anmZarf(e.t,e.sure||0.6,0.06,0.2);sp[S.sendele]=ANM_POZ.sendele;}
  else if(ad==='mudahale'){const s=e.sure||0.5,t=e.t,tm=e.temas||0.16;st[S.mudahale]=t<tm?t/tm:t<tm+0.14?1:Math.max(0,1-(t-tm-0.14)/Math.max(0.05,s-tm-0.14));sp[S.mudahale]=a.mP;}
  else if(ad==='kayma'){st[S.kayma]=Math.min(1,e.t/0.12);sp[S.kayma]=a.kyP;}
  else if(ad==='blok'){st[S.blok]=tepe(e.t,e.sure);sp[S.blok]=a.bP;}
  else if(ad==='ucus')anmUcus(a,p,e);
  else if(ad==='kapan'){st[S.kapan]=anmZarf(e.t,e.sure||0.8,0.15,0.25);sp[S.kapan]=ANM_POZ.kapan;}
  else if(ad==='tutus'){st[S.tutus]=anmZarf(e.t,e.sure||0.35,0.07,0.12);sp[S.tutus]=a.tP;}
  else if(ad==='yumruk'){st[S.yumruk]=tepe(e.t,e.sure);sp[S.yumruk]=ANM_POZ.yumruk;}
  else if(ad==='elleAtis'){st[S.elleAtis]=tepe(e.t,e.sure);sp[S.elleAtis]=ANM_POZ.elleAtis;}
  else if(ad==='dusus'){st[S.dusus]=1;sp[S.dusus]=a.dP;}
  else if(ad==='yerde'){st[S.yerde]=1;sp[S.yerde]=a.yP;}
  else if(ad==='kalkis'){const f=clamp(e.t/(e.sure||0.6),0,1);st[S.yerde]=Math.max(0,1-f/0.35);st[S.ucusN]=Math.max(0,1-f/0.35);
    if(a.lieTur==='kayma')st[S.kayma]=Math.max(0,1-f/0.45);st[S.kalk]=f<0.35?f/0.35:Math.max(0,1-(f-0.35)/0.6);sp[S.kalk]=a.kkP;}
  else if(ad==='itiraz'){st[S.itiraz]=Math.min(1,e.t*4)*Math.min(1,(e.sure-e.t)*4);sp[S.itiraz]=POSE.itiraz;}
  /* taç: top başın üstünde; atışta kollar öne */
  else if(ad==='tac'){st[S.tac]=1;sp[S.tac]=ANM_POZ.tac;sp[S.tacAt]=ANM_POZ.tacAt;if(e.faz!=='tut'){const f=e.ft/0.34;st[S.tacAt]=f<1?f*f:Math.max(0,1-(e.ft-0.34)/0.3);}}
  else if(ad==='atis'){const f=e.t/e.sure;st[S.tac]=f<0.4?f/0.4:0;st[S.tacAt]=f>=0.4?1-(f-0.4)/0.6:0;sp[S.tac]=ANM_POZ.tac;sp[S.tacAt]=ANM_POZ.tacAt;}
  /* top elde: kaleci tutuşu, duran topu taşıyan oyuncu */
  if(b.tasiyan===p&&ad!=='tac'){st[S.elde]=1;sp[S.elde]=p.rol==='GK'?POSE.tutus:POSE.tasi;}
  /* top toplayıcı (N10): yedek topu iki eliyle önünde tutar */
  else if(p.tur==='topcu'&&p.top&&ad!=='atis'){st[S.elde]=1;sp[S.elde]=POSE.tasi;}
  /* maç günü poz etiketleri */
  if(p.poz)for(let i=0;i<8;i++)if(p.poz===POZ_ETIKET[i]){st[S.p0+i]=1;sp[S.p0+i]=i===2&&p.kind==='foto'?ANM_POZ.fotoCek:ANM_ETIKET_POZ[i];}
  /* gol sevinci: oyuncuya ve gole göre çeşit, kendi zamanlaması; golcünün yanındakiler sarılır; golcü dizlerinin üstünde kayabilir */
  const c=mac.celeb;
  if(p.sevinc){if(!a.sevSon){a.sevSon=true;const n=(p.n!=null?p.n:p.no||0)|0,gol=mac.score?mac.score[0]+mac.score[1]:0,h=h2(n*7+(p.team|0),gol*13+5);
      a.sevC=Math.floor(h*ANM.sevincCesit)%ANM_SEVINC.length;a.sevH=7+2*h2(n,3);a.sevDiz=!!(c&&c.scorer===p)&&h2(n+11,gol)<0.5;a.dizAktif=false;}
    const sc=c&&c.scorer;let hug=0;if(sc&&sc!==p){const dx=sc.x-p.x,dz=sc.z-p.z;if(dx*dx+dz*dz<5.5&&p.spd<2.2)hug=1;}
    if(a.sevDiz&&sc===p&&mac.phaseT>1.0&&p.spd<4.5)a.dizAktif=true;
    st[S.sevinc]=hug?0:1;sp[S.sevinc]=ANM_SEVINC[a.sevC];st[S.sarilma]=hug;sp[S.sarilma]=ANM_POZ.sarilma;
    if(a.dizAktif){st[S.dizKayma]=1;sp[S.dizKayma]=ANM_POZ.dizKayma;}}
  else a.sevSon=false;
  /* yenen takım: gol aşamasında eller başta / belde, baş önde */
  if(ph==='goal'&&c&&p.tur==='oyuncu'&&p.oyunda&&p.team!==c.team&&b.tasiyan!==p){
    if(!a.uzP){const n=(p.n!=null?p.n:p.no||0)|0;a.uzP=ANM_UZGUN[Math.floor(h2(n,(mac.score[0]+mac.score[1])*3)*3)%3];}
    st[S.uzgun]=mac.phaseT>0.7?1:0;sp[S.uzgun]=a.uzP;}
  else if(a.sw[S.uzgun]<0.01)a.uzP=null;
  st[S.mars]=ph==='toren'&&p.tur!=='hakem'?1:0;sp[S.mars]=POSE.mars;
}
/* kaleci uçuşu: evreler (sözleşme: ucus.faz/itisT/inisT; yoksa süreden), havadaki poz yüksekliğe ve ele göre */
function anmUcus(a,p,e){
  const iT=e.itisT!=null?e.itisT:0.1,nT=e.inisT!=null?e.inisT:0.55,t=e.t,st=a.st,sp=a.sp,S=ANM_S;
  let faz=e.faz;if(faz!=='itis'&&faz!=='havada'&&faz!=='inis')faz=t<iT?'itis':t<nT?'havada':'inis';
  const g=faz==='itis'?clamp(t/iT,0,1):faz==='havada'?clamp((t-iT)/Math.max(0.05,nT-iT),0,1):clamp((t-nT)/0.3,0,1);
  a.uFaz=faz;a.uG=g;
  if(faz==='itis')st[S.ucusI]=1;else if(faz==='havada'){st[S.ucusI]=Math.max(0,1-g/0.35);st[S.ucusH]=1;}else{st[S.ucusH]=Math.max(0,1-g);st[S.ucusN]=1;}
  sp[S.ucusI]=ANM_POZ.ucusItis;sp[S.ucusH]=a.uP;sp[S.ucusN]=a.uNP;
}
/* yuvaların ağırlığı sınırlı hızla hedefe gider ve sırayla karışır */
function anmYuvalar(a,dt){const sw=a.sw,st=a.st,sp=a.sp,N=sw.length;
  for(let i=0;i<N;i++){let w=sw[i];const h=st[i]>0?st[i]:0;
    if(h>w)w=Math.min(h,w+dt*ANM_SY[i]);else if(h<w)w=Math.max(h,w-dt*ANM_SD[i]);
    sw[i]=w;if(w>0.001&&sp[i])anmKar(a,sp[i],w);}}
/* yuvaların üstüne eklenen hareketler: boyun vuruşu, sendeleme yönü, sevinç ritmi, itiraz ve alkış; hakem işaretleri */
function anmEkler(a,p,dt){
  const P=a.P,sw=a.sw,S=ANM_S,e=p.eylem,ad=e?e.ad:'';
  const wk=sw[S.kafa];if(wk>0.01&&ad==='kafa'){const f=clamp(e.t/0.32,0,1),sm=f*f*(3-2*f),k=e.bos?0.5:1;P.hx+=wk*k*(0.8*sm-0.1);P.gx+=wk*k*(0.55*sm-0.3);}
  const ws=sw[S.sendele];if(ws>0.01){const s=a.sdS*ws;P.lean+=0.45*a.sdZ*s;P.gx+=0.15*a.sdZ*s;P.gz-=0.5*a.sdX*s;P.hz-=0.15*a.sdX*s;
    if(!a.kucuk){const w=Math.sin(zaman*15+a.faz0);P.aL+=0.5*w*ws;P.aR-=0.5*w*ws;}}
  const wv=sw[S.sevinc];if(wv>0.01&&!a.kucuk){const w=Math.sin(zaman*a.sevH+a.faz0),c=a.sevC;
    if(c===0){P.aL+=0.3*w*wv;P.aR-=0.3*w*wv;if(p.spd<1.2)a.yEk=Math.max(a.yEk,Math.abs(w)*0.14*wv);}
    else if(c===1){const v=Math.sin(zaman*1.8+a.faz0);P.hz+=v*0.32*wv;P.gz+=v*0.15*wv;}
    else if(c===2){P.aL+=0.45*w*wv;P.eL+=0.35*w*wv;}
    else{P.aLz-=0.1*w*wv;P.aRz+=0.1*w*wv;}}
  /* omuz mücadelesini kaybeden ikinci yarıda rakipten uzağa itilir */
  const wo=sw[S.omuz];if(wo>0.01&&ad==='omuz'&&e.kazandi===false){const f=clamp(e.t/(e.sure||0.5)*2-1,0,1)*wo;P.gz-=0.55*a.oSag*f;P.hz-=0.2*a.oSag*f;P.aRz+=0.5*f;P.aLz-=0.5*f;}
  const wh=sw[S.sarilma];if(wh>0.01)a.yEk=Math.max(a.yEk,Math.abs(Math.sin(zaman*6+a.faz0*0.3))*0.1*wh);
  const wi=sw[S.itiraz];if(wi>0.01){const v=Math.sin(zaman*6+a.faz0)*0.15*wi;P.aLz-=v;P.aRz+=v;}
  /* boşta (T1): ağırlığı yavaşça bir bacaktan öbürüne verir, başı hafif oynar */
  const wb=sw[S.bosta];if(wb>0.01&&!a.kucuk){const v=Math.sin(zaman*0.7+a.faz0),u=Math.sin(zaman*0.37+a.faz0*1.7);P.gz+=0.07*v*wb;P.hz-=0.05*v*wb;P.hy+=0.12*u*wb;}
  const wa=sw[S.p0+4];if(wa>0.01){const v=Math.sin(zaman*15+a.faz0)*0.22*wa;P.aLz+=v;P.aRz-=v;}
  const we=sw[S.p0];if(we>0.01){const f=0.5+0.5*Math.sin(zaman*0.9+a.faz0);anmKar(a,ANM_POZ.esneme1,we*f);anmKar(a,POSE.esneme2,we*(1-f));}
  if(p.tur==='hakem'&&e){
    if(ad==='duduk')anmKar(a,POSE.hakemDuduk,tepe(e.t,e.sure));
    else if(ad==='yon')anmKar(a,POSE.hakemYon,tepe(e.t,e.sure));
    else if(ad==='avantaj')anmKar(a,POSE.hakemAvantaj,tepe(e.t,e.sure));
    else if(ad==='kart')anmKar(a,POSE.hakemKart,tepe(e.t,e.sure));
    else if(ad==='penaltiGoster')anmKar(a,POSE.hakemPenalti,tepe(e.t,e.sure));
    else if(ad==='bayrak')anmKar(a,POSE.bayrak,Math.min(1,e.t*6)*Math.min(1,(e.sure-e.t)*4));}
}

/* ---- 3. bacaklar: iki kemikli IK. Ayak hedefi kalça çerçevesine alınır (eğilme, kalça dönüşü ve yatışın tersi), uyluk yana açma (z) ve
   öne-arkaya (x), diz bükülme ile hedefe uzanır. Etki noktası taban ortasıdır (dizden 0,50 m aşağı, 0,05 m önde) ---- */
const ANM_L1=0.44,ANM_L2=Math.sqrt(0.5*0.5+0.05*0.05),ANM_D0=Math.atan2(0.05,0.5),ANM_IK=[{l:'lL',k:'kL',z:'lLz',x:-0.1},{l:'lR',k:'kR',z:'lRz',x:0.1}];
function anmBacakIK(a){
  const P=a.P,C=a.C,T=a.T,cl=Math.cos(P.lean),sl=Math.sin(P.lean),ch=Math.cos(P.hy),sh=Math.sin(P.hy),cz=Math.cos(P.hz),sz=Math.sin(P.hz),hY=0.95+P.dy;
  for(let i=0;i<2;i++){const B=ANM_IK[i],cL=C[B.l],cK=C[B.k],cZ=C[B.z];if(cL<0.001&&cK<0.001&&cZ<0.001)continue;
    const x=T[i*3],y=T[i*3+1]-hY,z=T[i*3+2];
    const y1=y*cl+z*sl,z1=-y*sl+z*cl,x2=x*ch-z1*sh,z2=x*sh+z1*ch;
    let X=x2*cz+y1*sz-B.x,Y=-x2*sz+y1*cz+0.04,Z=z2;
    let d=Math.sqrt(X*X+Y*Y+Z*Z);const dm=(ANM_L1+ANM_L2)*0.9995;if(d>dm){const k=dm/d;X*=k;Y*=k;Z*=k;d=dm;}if(d<0.3)d=0.3;
    const ck=clamp((d*d-ANM_L1*ANM_L1-ANM_L2*ANM_L2)/(2*ANM_L1*ANM_L2),-1,1),kk=Math.acos(ck),aa=ANM_L1+ANM_L2*ck,bb=-ANM_L2*Math.sin(kk);
    const be=Math.asin(clamp(X/aa,-1,1));let al=Math.atan2(Z,Y)-Math.atan2(bb,-aa*Math.cos(be));if(al>Math.PI)al-=6.283185307179586;else if(al<-Math.PI)al+=6.283185307179586;
    P[B.l]+=cL*al;P[B.z]+=cZ*be;P[B.k]+=cK*(kk+ANM_D0);}
}

/* ---- kare başına poz: başla (yürüyüş + yuvalar + ekler), arada ek pozlar (kenar, kulübe), bitir (IK) ---- */
function anmPozBasla(a,p,spd,dt,M){
  const P=a.P,C=a.C;for(let i=0;i<ANM_KANAL.length;i++)P[ANM_KANAL[i]]=0;C.lL=C.kL=C.lR=C.kR=C.lLy=C.lRy=C.lLz=C.lRz=1;
  a.st.fill(0);a.yEk=0;const sx=M.root.scale.x||1,sy=M.root.scale.y||1;
  a.kucuk=anmPiksel(a,sy)<ANM.kucukPiksel;
  anmTavir(a,p,dt);anmYuruyus(a,p,spd,dt,sx,sy);
  if(p)anmEylemler(a,p,dt);
  anmYuvalar(a,dt);
  if(p)anmEkler(a,p,dt);
}
function anmPozBitir(a){anmBacakIK(a);}
/* eski arayüz: tek çağrıda poz (a.P) */
function pozla(a,p,spd,dt){anmPozBasla(a,p,spd,dt,a.m);anmPozBitir(a);return a.P;}
function uygula(a,J){for(const k of EKLEM)a.J[k]=J[k]||0;pose(a.m,a.J);}

/* ---- 4. kök: düşüş/yatış/kalkış ekseni ve açısı, kaleci uçuşunun yayı, sıçrama ve sevinç zıplaması ---- */
const ANM_Y=new THREE.Vector3(0,1,0),ANM_V=new THREE.Vector3(),ANM_Q1=new THREE.Quaternion(),ANM_Q2=new THREE.Quaternion();
function anmKok(a,p,dt,M){
  const e=p.eylem,ad=e?e.ad:'',D=ANM.dusus;let th=0,ps=0,hiz=10,ekY=0;
  if(ad==='dusus'){const f=clamp(e.t/(e.sure||0.45),0,1);th=D.aci*f*f;ps=a.lps0*f*f;hiz=40;}
  else if(ad==='yerde'){th=D.aci;ps=a.lps0+(a.lieTur!=='yuz'?Math.sin(zaman*3+a.faz0)*0.08:0);hiz=10;}
  else if(ad==='kalkis'){const f=clamp(e.t/(e.sure||0.6),0,1),g=clamp((f-0.08)/0.85,0,1);th=a.kTh0*(1-g*g*(3-2*g));ps=a.kPs0*Math.max(0,1-f*2);hiz=40;}
  else if(ad==='kayma'){th=0.42*Math.min(1,e.t/0.14);hiz=25;}
  else if(ad==='ucus'){const hi=clamp((a.uY-0.4)/1.6,0,1),thA=1.35-0.55*hi,g=a.uG;hiz=40;
    if(a.uFaz==='itis')th=0.22*g;
    /* alçak topa gövde hemen yatar (yavaşlayan eğri), yüksek topa önce uzanır */
    else if(a.uFaz==='havada'){const sm=g*g*(3-2*g),c=1-(1-g)*(1-g)*(1-g);th=0.22+(thA-0.22)*Math.min(1,(c+(sm*1.6-c)*hi));ekY=(0.2+0.4*hi)*Math.sin(Math.PI*g);}
    else th=thA+(1.42-thA)*g*g*(3-2*g);}
  else if(ad==='kapan'){th=0.3*a.sw[ANM_S.kapan];hiz=20;}
  if(dt>0){const k=Math.min(1,dt*hiz);a.lth+=(th-a.lth)*k;a.lps+=(ps-a.lps)*k;}
  /* yatarken gövde kalınlığı kadar yukarı */
  const yat=clamp((1-Math.cos(a.lth))/(1-Math.cos(D.aci)),0,1),yy=(a.lieTur==='yuz'||a.lieTur==='sirt'?D.yuzY:D.yanY)*yat;
  const R=M.root;R.position.set(a.x,(p.yuk||0)+ekY+yy+a.yEk,a.z);
  if(a.lth<1e-3&&Math.abs(a.lps)<1e-3)R.rotation.set(0,a.yaw,0);
  else{ANM_V.set(a.lkx,0,a.lkz).normalize();ANM_Q1.setFromAxisAngle(ANM_V,a.lth);ANM_Q2.setFromAxisAngle(ANM_Y,a.lps);ANM_Q1.multiply(ANM_Q2);
    R.quaternion.setFromAxisAngle(ANM_Y,a.yaw).multiply(ANM_Q1);}
}

/* ---- her kare: aktörün ara değerli yeri, görünürlüğü, pozu ve kökü. al: iki motor adımı arası oran, T: tünel ---- */
function aktorGuncelle(a,al,dts,T){
    const p=a.kaynak;a.x=lerp(a.px,p.x,al);a.z=lerp(a.pz,p.z,al)-MOTOR_Z;
    let gorunur=p.z>T.z-0.8&&(p.tur!=='oyuncu'||p.oyunda||p.cikiyor);
    /* yedek: kulübedeyken eşofman modeli, oyuna girince forma */
    if(a.esofman){const esofmanli=p.tur==='yedek'&&!p.cikti;a.esofman.root.visible=gorunur&&esofmanli;
      if(esofmanli){a.m.root.visible=false;const E=a.esofman;if(!gorunur)return;
        aciYumusak(a,Math.atan2(Math.cos(p.yon),Math.sin(p.yon)),dts,8);
        anmPozBasla(a,p,p.oturuyor?0:p.spd,dts,E);
        if(p.oturuyor){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const kalk=yumusak(a,'kalk',a.sevinc>0||mac.phase==='toren'?1:0,5,dts);anmKar(a,ANM_POZ.otur,1-kalk);
          if(kalk>0.5&&a.sevinc>0){anmKar(a,POSE.sevinc,kalk);a.P.dy+=Math.abs(Math.sin(zaman*7+a.faz0))*0.25*kalk;}}
        anmPozBitir(a);pose(E,a.P);E.root.position.set(a.x,0,a.z);E.root.rotation.set(0,a.yaw,0);return;}}
    a.m.root.visible=gorunur;if(!gorunur)return;
    const spd=p.oturuyor?0:(p.spd||0);
    /* dördüncü hakem tabelayı kaldırırken yüzü ana tribüne */
    if(a===DORDUNCU&&UZATMA.t>=0&&UZATMA.t<6){aciYumusak(a,Math.PI,dts,5);anmPozBasla(a,p,0,dts,a.m);anmKar(a,POSE.tabela,yumusak(a,'tabela',1,5,dts));anmPozBitir(a);pose(a.m,a.P);
      a.m.root.position.set(a.x,0,a.z);a.m.root.rotation.set(0,a.yaw,0);return;}
    /* gövde yönü motorda sınırlı hızla döner; çizim yalnız iki adım arasını yumuşatır (çift yumuşatma yok, MM1) */
    aciYumusak(a,Math.atan2(Math.cos(p.yon),Math.sin(p.yon)),dts,40);
    anmPozBasla(a,p,spd,dts,a.m);
    if(p.tur==='kenar'){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const sv=yumusak(a,'kenarSevinc',a.sevinc>0?1:0,6,dts);
      if(p.oturuyor)anmKar(a,ANM_POZ.otur,1-sv);
      if(sv>0.02){anmKar(a,POSE.sevinc,sv);a.P.dy+=Math.abs(Math.sin(zaman*7+a.faz0))*0.2*sv;}
      if(p.kind==='td')anmKar(a,POSE.isaret,yumusak(a,'isaret',Math.sin(zaman*0.7+p.team*2)>0.85&&mac.phase==='play'?1:0,4,dts));
      if(a===DORDUNCU)anmKar(a,POSE.tabela,yumusak(a,'tabela',0,5,dts));}
    else if(p.oturuyor)anmKar(a,ANM_POZ.otur,1);
    anmPozBitir(a);pose(a.m,a.P);
    anmKok(a,p,dts,a.m);
}
/* ---- top: ara değerli yer; dönüş yerde yuvarlanma, havada üst/kesik (ust) ve yan (egri) dönüş; elde taşınırken dönmez; tünelin içinde gizli ---- */
const ANM_TOP={w:new THREE.Vector3(),h:new THREE.Vector3(),e:new THREE.Vector3()};
function topCiz(b,al,bx,bz,dts,T){
  const by=lerp(TOP.py,b.y,al);topMesh.position.set(bx,TOP_R+by,bz);
  const icerde=b.z<T.z-0.8;topMesh.visible=!icerde;
  if(!(dts>0))return;
  const W=ANM_TOP.w,H=ANM_TOP.h,K=ANM.top;
  if(b.tasiyan)W.multiplyScalar(Math.max(0,1-dts*15));
  else{const vx=b.vx,vz=b.vz,v=Math.sqrt(vx*vx+vz*vz),ex=v>0.02?vz/v:0,ez=v>0.02?-vx/v:0;
    if(b.y<0.03&&Math.abs(b.vy)<0.6){H.set(ex*v/TOP_R,0,ez*v/TOP_R);W.lerp(H,Math.min(1,dts*25));}
    else{const u=(b.ust||0)*K.ust;H.set(ex*u,-(b.egri||0)*K.egri,ez*u);W.lerp(H,Math.min(1,dts*6));}}
  const w=W.length();if(w>1e-3){ANM_TOP.e.copy(W).multiplyScalar(1/w);TOP.dq.setFromAxisAngle(ANM_TOP.e,Math.min(w*dts,K.kare));TOP.q.premultiply(TOP.dq);topMesh.quaternion.copy(TOP.q);}
}
/* maç olayları (js/mac-sahnesi.js olay işlevinden): faulde düşüş yönü (yedek: sözleşmede dusus.yon yoksa) — fauli yapandan uzağa, yiyenin hızıyla karışık */
function animasyonOlay(ad,v){
  if((ad==='faul'||ad==='avantaj')&&v&&v.faulYiyen&&v.faulYapan&&!v.avantajdan){const y=v.faulYiyen,f=v.faulYapan;
    let dx=y.x-f.x,dz=y.z-f.z;const L=Math.sqrt(dx*dx+dz*dz)||1;dx/=L;dz/=L;const s=Math.sqrt((y.vx||0)*(y.vx||0)+(y.vz||0)*(y.vz||0));
    if(s>1){const k=Math.min(0.75,0.3+s/8);dx=dx*(1-k)+y.vx/s*k;dz=dz*(1-k)+y.vz/s*k;}
    ANM_DUSUS.set(y,{yon:Math.atan2(dz,dx),t:zaman});}
}
