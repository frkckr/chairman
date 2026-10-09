/* DONDURULMUŞ KOPYA — js/animasyon.js, git 1b39e40, 2026-10-09 (araclar/karsilastir/dondur.js t4).
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
   hız kipi (p.kip, T1) hızdan. Boşta pozlar (T1): duran oyuncu eller belde ya da gevşek, ağırlık değiştirir; yürürken yarı ağırlıkla.
   A2b (2026-10-08, gerçekçilik planı Ek G): vuruş katmanı (1b; bacaklar IK'da, temas motorun temas karesinde), hakem/yan hakem/4. hakem
   işaretleri motor olaylarından (1c), kaleci set ve split-step (1d), baraj (1e), ikinci top (1f), kenar bekleyişleri (1g); uzun topta baş,
   ilk dokunuşta temas → yumuşatma, dağıtım pozları, ölü topta esneme ve eldiven. Motora yazılmaz; çizim gövdeyi vuruşta en çok 0,15 m kaydırır.
   T4g (2026-10-09): çalım hazırlığı ve itişi, aldatılan savunmacı, top saklama (1h; motorun p.calim, p.yutma, tavır 'koru' alanlarından). */
/* ---- kanallar: eski 13 eklem (balkon ve eski pozlar) + iskelet 2 kanalları (js/oyuncular.js pose) ---- */
const EKLEM=['lean','dy','hx','lL','kL','lR','kR','aL','aR','aLz','aRz','eL','eR'];
const ANM_KANAL=EKLEM.concat(['hy','hz','gx','gy','gz','by','bz','lLy','lRy','lLz','lRz','aLy','aRy']);
const ANM_BACAK={lL:1,kL:1,lR:1,kR:1,lLy:1,lRy:1,lLz:1,lRz:1};
const ANM={"adim":{"yuvar":0.05,"kaldirEn":0.06,"kaldirHiz":0.055,"kaldirTavan":0.42,"geri":0.75,"yanEn":0.3,"yanHiz":0.08,"yanTavan":0.5,"donusKadans":3.2},"kalcaDonus":0.5,"kalcaSalinim":[0.05,0.1],"kalcaGecikme":0.65,"yaylanma":[0.04,0.022],"egilme":{"kosu":0.2,"ivme":0.8,"yatis":0.8,"ivmeAlt":-0.3,"ivmeUst":0.42,"yatisTavan":0.35},"bas":{"yay":22,"hiz":7,"ivme":90,"sinir":1.22,"govde":0.7,"oncu":0.32},"kol":{"genlik":[0.16,0.74],"dirsek":[0.28,1.1]},"dusus":{"aci":1.45,"yuzY":0.12,"yanY":0.16},"dokunus":0.18,"kucukPiksel":12,"top":{"ust":300,"egri":150,"kare":0.6},"sevincCesit":4};   /* dondurulmuş STIL.animasyon */
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
  /* A2b ilk dokunuş (Ek G2): temas pozu → yumuşatma (iç ayak dışa dönük, temasta geri çekilir; dış ayak içe; taban topun üstünde; uyluk yatay
     kalkar, temasta düşer; göğüs 10–20° geride, dirsekler dışarıda, temasta geri çekilir, sonra inen topa öne eğilir) */
  kIc:G({lean:0.1,lL:-0.42,kL:0.45,lLz:-0.25,lLy:-0.85,lR:0.05,kR:0.3,aLz:-0.4,aRz:0.4,eL:-0.4,eR:-0.4,hx:0.42}),
  kIc2:G({lean:0.08,lL:-0.12,kL:0.75,lLz:-0.2,lLy:-0.8,lR:0.05,kR:0.32,aLz:-0.35,aRz:0.35,eL:-0.4,eR:-0.4,hx:0.4}),
  kDis:G({lean:0.1,lL:-0.35,kL:0.45,lLz:0.12,lLy:0.5,lR:0.05,kR:0.3,aLz:-0.35,aRz:0.45,eL:-0.4,eR:-0.4,hx:0.4}),
  kDis2:G({lean:0.08,lL:-0.15,kL:0.65,lLz:0.05,lLy:0.45,lR:0.05,kR:0.3,aLz:-0.3,aRz:0.4,eL:-0.4,eR:-0.4,hx:0.38}),
  kTaban:G({lean:0,lL:-0.6,kL:0.85,lLy:-0.1,lR:0.08,kR:0.3,aLz:-0.35,aRz:0.35,eL:-0.45,eR:-0.45,hx:0.45}),
  kTaban2:G({lean:0.04,lL:-0.45,kL:0.75,lLy:-0.1,lR:0.08,kR:0.32,aLz:-0.3,aRz:0.3,eL:-0.45,eR:-0.45,hx:0.42}),
  kUyluk2:G({lL:-0.65,kL:0.85,lean:-0.02,aLz:-0.45,aRz:0.45,hx:0.42}),
  gogusAl:{lean:-0.28,gx:-0.12,aL:-0.35,aR:-0.35,aLz:-0.95,aRz:0.95,eL:-0.9,eR:-0.9,hx:0.22},
  gogusBirak:{lean:0.12,gx:0.22,aL:-0.2,aR:-0.2,aLz:-0.6,aRz:0.6,eL:-0.6,eR:-0.6,hx:0.55},
  kafa:G({hx:-0.45,dy:0.2,aLz:-0.6,aRz:0.6,aL:-0.5,aR:-0.5,eL:-0.6,eR:-0.6,lL:-0.25,kL:0.6,lR:0.1,kR:0.3}),
  /* ikili mücadele: rakip sağda */
  omuz:{lean:0.22,gz:0.28,hz:0.08,aL:0.15,aLz:-0.12,eL:-1.5,aR:-0.25,aRz:0.75,eR:-0.5,hy:-0.1,gy:-0.12,hx:0.1},
  /* T4g top saklama (rakip sağda ya da sağ arkada; Ek G2): gövde yana döner (sağ omuz rakibe), sağ kol rakibe doğru geride ve bükük (tutar, itmez),
     sol kol dengede açık, gövde alçak ve hafif öne, baş topta (diz bükme ve geniş duruş yürüyüşten) */
  koru:{lean:0.16,gz:0.1,gy:-0.25,hy:-0.3,aL:0.55,aLz:-0.75,eL:-0.75,aR:-0.3,aRz:0.6,eR:-0.6,hx:0.3},
  jokey:{lean:0.28,aL:-0.25,aR:-0.25,aLz:-0.5,aRz:0.5,eL:-0.9,eR:-0.9,hx:0.15},
  /* T2: topu ayağının altında bekletme (sağ taban topun üstünde, gövde hafif geride, kollar dengede, baş yukarıda); taşıma (hafif öne,
     kollar dengede; bacaklar koşu döngüsünden); dönüş dokunuşu (sağ ayak içe/dışa çeker, gövde dönüşe yatar) */
  bekle:G({lean:-0.04,dy:-0.03,lL:-1.15,kL:1.1,lLy:-0.15,lR:0.1,kR:0.22,aLz:-0.3,aRz:0.25,eL:-0.45,eR:-0.4,hx:0.05}),
  tasi:{lean:0.07,aLz:-0.22,aRz:0.22,eL:-0.55,eR:-0.55,hx:0.08},
  dokunDon:G({lean:0.12,gz:0.14,hz:0.1,lL:-0.35,kL:0.5,lLy:-0.85,lLz:0.25,aLz:-0.55,aRz:0.3,eL:-0.4,eR:-0.5}),
  /* T4g (2026-10-09) çalımın itiş dokunuşları (yalnız bacak; üst gövde ckIt'ten): dış ayakla (bacak öne ve dışa, ayak ucu içe), iç ayakla kesme (bacak
     gövdenin önünden içe, ayak ucu dışa), uzun itiş (bacak öne uzanır); taban (ayak topun üstünde: top saklama, bekletme) */
  dokunDis:G({lL:-0.5,kL:0.35,lLz:-0.22,lLy:0.5}),dokunIc:G({lL:-0.55,kL:0.3,lLz:0.15,lLy:-0.75}),dokunUzun:G({lL:-0.75,kL:0.25,lLy:-0.05}),
  dokunTaban:G({lL:-0.6,kL:0.95,lLy:-0.1,hx:0.3}),
  /* T4g çalım hazırlığı, aldatma yanı sağ (solda aynalanır): omuz ve kalça sağa düşer, göğüs sağa döner, sağ kol aşağıda açık, sol kol dengede yukarıda */
  ckAldat:{lean:0.14,gz:0.34,hz:0.12,gy:-0.2,hy:-0.12,aL:0.12,aLz:-0.62,eL:-0.35,aR:-0.42,aRz:1.0,eR:-0.55,hx:0.3},
  /* itiş ve patlama, itiş yanı sağ: gövde öne ve itiş yanına, kollar pompalar (sağ kol geride, sol önde) */
  ckIt:{lean:0.36,gz:0.16,hz:0.06,gy:-0.1,aL:0.55,aLz:-0.3,eL:-1.0,aR:-0.75,aRz:0.3,eR:-1.15,hx:0.1},
  /* kesme, kesme yanı sağ: gövde kesme yanına yatar ve döner, kollar açık; rulet: kollar açık dengede, baş topta; tempo: duraksama (dik, baş kalkık) */
  ckKesme:{lean:0.18,gz:0.28,hz:0.14,gy:-0.3,hy:-0.18,aL:0.1,aLz:-0.85,eL:-0.4,aR:-0.3,aRz:0.75,eR:-0.6,hx:0.3},
  ckRulet:{lean:0.18,aL:-0.25,aR:-0.25,aLz:-1.05,aRz:1.05,eL:-0.35,eR:-0.35,hx:0.45},
  ckTempo:{lean:-0.06,aLz:-0.4,aRz:0.4,eL:-0.6,eR:-0.6,hx:-0.05},
  /* T4g aldatılan savunmacı, yanılgı sağa: ağırlık ve kalça sağa, kollar açık, baş topta (alçak ve geniş duruş yürüyüşten); yakalanmış (tempo): dik,
     ağırlık geride; ataletle (kesme): fren, kollar savrulur */
  ytAldat:{lean:0.2,gz:0.3,hz:0.2,hy:-0.3,gy:-0.12,aL:-0.15,aLz:-1.0,eL:-0.45,aR:0.35,aRz:0.75,eR:-0.4,hx:0.3},
  ytDur:{lean:-0.12,aL:-0.15,aR:-0.15,aLz:-0.5,aRz:0.5,eL:-0.5,eR:-0.5,hx:0.25},
  ytKay:{lean:-0.15,aL:-0.55,aR:-0.3,aLz:-0.85,aRz:0.9,eL:-0.3,eR:-0.4,hx:0.15},
  /* boşta (T1, p.kip dur/yuru): eller belde; gevşek duruş (kollar yanda, ağırlık bir bacakta) */
  belde:{aL:0.25,aR:0.25,aLz:-0.55,aRz:0.55,eL:-1.45,eR:-1.45,hx:0.12},
  /* A2a bekleyiş: sert koşudan sonra eller dizlerde soluklanma (bacakları IK büker); çorap/tekmelik çekme (sağ el kavalda) */
  /* A2a jest katmanı (sözleşme p.jest {tur, t, sure, hedef, kol}): bacaktan bağımsız üst gövde; sağ kol için, kol:'sol' aynalanır */
  jestKol:{aL:-3.0,eL:-0.05,aLz:-0.12,hx:-0.12},jestIsaret:{aL:-1.55,eL:-0.05,aLz:-0.12,hx:0.02},
  jestItiraz:{aL:-0.5,aR:-0.5,aLz:-0.75,aRz:0.75,eL:-1.3,eR:-1.3,aLy:0.6,aRy:-0.6,hx:-0.12,lean:-0.04},
  jestCagir:{aL:-1.35,eL:-2.35,aLz:0.32,aLy:0.4,hx:-0.08},jestBasEl:{aL:-2.5,aR:-2.5,aLz:-0.75,aRz:0.75,eL:-2.1,eR:-2.1,hx:-0.2},
  dizler:{lean:0.22,gx:0.62,dy:-0.13,aL:-0.22,aR:-0.22,aLz:-0.14,aRz:0.14,eL:-0.1,eR:-0.1,hx:-0.55},
  corap:{lean:0.85,gx:0.3,gz:0.1,dy:-0.14,aL:-0.25,aLz:-0.05,eL:-0.25,aR:0.15,aRz:0.2,eR:-0.6,hx:0.35},
  gevsek:{aLz:-0.06,aRz:0.1,eL:-0.15,eR:-0.3,hz:0.05,gz:0.06,hx:0.08},
  sendele:{aL:-0.6,aR:-0.6,aLz:-1.15,aRz:1.15,eL:-0.4,eR:-0.4,hx:-0.25},
  /* A2b hakem bekleyişi: orta hakem eller arkada, 4. hakem eller önde birleşik */
  hkBekle:{aL:0.42,aR:0.42,aLz:0.22,aRz:-0.22,aLy:-0.35,aRy:0.35,eL:-0.75,eR:-0.75,hx:0.05},
  hkOnde:{aL:-0.3,aR:-0.3,aLz:0.28,aRz:-0.28,eL:-1.0,eR:-1.0,hx:0.05},
  /* A2b kulübe (Ek G7 kenar bekleyişleri): öne eğik, dirsekler dizlerde, baş kalkık; geriye yaslanmış, eller oturağa */
  oturOne:{gx:0.55,aL:-0.55,aR:-0.55,aLz:0.12,aRz:-0.12,eL:-1.2,eR:-1.2,hx:-0.4},
  oturArka:{gx:-0.2,aL:0.35,aR:0.35,aLz:-0.25,aRz:0.25,eL:-0.15,eR:-0.15,hx:0.05},
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
  /* A2b (Ek G6): set duruşu — göğüs dizlerin üstünde, dirsekler önde, eller ayakların önünde, baş topta (diz ~60°, ayaklar geniş: tavır) */
  kaleciSet:{lean:0.38,gx:0.06,aL:-0.9,aR:-0.9,aLz:-0.28,aRz:0.28,eL:-0.5,eR:-0.5,hx:-0.08},
  /* A2b dağıtım (Ek G6; top motorda eylemin ilk karesinde çıkar: pozlar bırakış/temas anından takibe gider). Sağ ayak/el; solakta aynalanır */
  degajTemas:G({lean:-0.2,lL:-1.25,kL:0.55,lR:0.12,kR:0.3,aL:-0.5,aLz:-1.1,eL:-0.3,aR:-0.4,aRz:1.1,eR:-0.3,hx:0.35}),
  degajTakip:G({lean:-0.36,lL:-1.95,kL:0.1,lR:0.18,kR:0.25,aL:0.2,aLz:-1.2,eL:-0.3,aR:-0.6,aRz:1.25,eR:-0.3,hx:0.15}),
  omuzAt:G({lean:0.22,gy:-0.35,hy:-0.18,lR:-0.55,kR:0.4,lL:0.35,kL:0.3,aL:-2.6,eL:-0.25,aLz:-0.2,aR:-0.6,aRz:0.5,eR:-0.4,hx:0.1}),
  omuzTakip:G({lean:0.42,gy:0.3,hy:0.15,lR:-0.6,kR:0.5,lL:0.4,kL:0.5,aL:-0.9,aLz:0.45,eL:-0.3,aR:0.2,aRz:0.4,eR:-0.4,hx:0.15}),
  yuvarlaAt:G({lean:0.7,dy:-0.3,lR:-1.05,kR:1.45,lL:0.45,kL:1.55,aL:-0.55,eL:-0.05,aLz:-0.05,aR:-0.35,aRz:0.7,eR:-0.4,hx:0.15}),
  yuvarlaTakip:G({lean:0.45,dy:-0.16,lR:-0.85,kR:1.0,lL:0.35,kL:1.0,aL:-1.35,eL:-0.1,aLz:-0.05,aR:-0.3,aRz:0.6,eR:-0.4,hx:0.05}),
  /* A2b baraj (Ek G5): eller önde kapanır; sıçramada dizler toplanır, kimi başını çevirir */
  baraj:{aL:0.12,aR:0.12,aLz:0.32,aRz:-0.32,aLy:-0.2,aRy:0.2,eL:-0.75,eR:-0.75,hx:0.12},
  barajZipla:G({lL:-0.35,kL:0.6,lR:-0.3,kR:0.55}),barajZiplaBas:G({lL:-0.35,kL:0.6,lR:-0.3,kR:0.55,by:0.85,hx:0.3,gy:0.15}),
  /* A2b ikinci top için hazır duruş (Ek G3): dizler hafif bükük, kollar dengede */
  izle:{lean:0.14,aL:-0.12,aR:-0.12,aLz:-0.32,aRz:0.32,eL:-0.55,eR:-0.55},
  /* A2b bekleyiş kıpırtıları (Ek G0.7): kalecinin eldiveni; ölü topta esneme (sağ bacak; solda aynalanır) */
  eldiven:{aL:-1.0,aR:-1.0,aLz:0.32,aRz:-0.32,eL:-1.45,eR:-1.45,hx:0.35},
  esnemeArka:G({lL:0.25,kL:2.25,aL:0.55,eL:-0.55,aLz:-0.1,aR:-0.2,aRz:0.55,eR:-0.2,hx:0.1}),
  esnemeOn:G({lean:0.55,dy:-0.08,lL:-0.5,kL:0.05,aL:-0.55,aR:-0.55,aLz:0.1,aRz:-0.1,eL:-0.35,eR:-0.35,hx:0.35}),
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
const ANM_JEST={kol:'jestKol',isaret:'jestIsaret',itiraz:'jestItiraz',cagir:'jestCagir',basEl:'jestBasEl',alkis:'alkis'};
const ANM_VURUS={ic:['icG','icT'],dis:['disG','disT'],ust:['ustG','ustT'],asirtma:['asirtmaG','asirtmaT'],vole:['voleG','voleT'],yarimVole:['yarimVoleG','yarimVoleT']};
const ANM_SEVINC=[ANM_POZ.sevKollar,ANM_POZ.sevUcak,ANM_POZ.sevYumruk,ANM_POZ.sevGok],ANM_UZGUN=[ANM_POZ.basEl,ANM_POZ.belEl,ANM_POZ.egik];

/* ---- eylem yuvaları: sıra karışım sırasıdır (sonraki baskın). [ad, yükselme hızı, inme hızı] (ağırlık/sn) ---- */
/* T4g: yutma (aldatılan savunmacı), koru/koruS (top saklama; rakip sağda/solda, çapraz geçiş), ckA (çalım hazırlığı), ckB (itiş ve patlama) */
const ANM_SLOT=[['bosta',2,4],['dizler',2.5,1.6],['kipirti',3,2.5],['hazir',5,4],['set',12,5],['jokey',5,4],['yutma',10,5],['koru',6,5],['koruS',6,5],['bekle',3,3],['tasi',4,4],
  ['ckA',12,8],['ckB',14,6],['izle',3,2],['baraj',4,4],['barajZ',14,5],
  ['dokun',40,10],['kontrol',30,8],['kontrol2',20,8],['gogus',30,8],['gogus2',20,8],['vG',40,8],['vT',40,8],['degaj',30,8],['degajT',20,6],
  ['kafa',16,16],['omuz',12,8],['sendele',15,6],['mudahale',30,7],['blok',30,8],['kayma',12,3],['ucusI',30,6],['ucusH',30,5],['ucusN',30,5],['kapan',12,6],
  ['tutus',25,8],['yumruk',30,8],['elleAtis',30,8],['elleAtisT',20,6],['dusus',10,4],['yerde',4,3],['kalk',20,5],['tac',6,5],['tacAt',30,6],['elde',10,10],['itiraz',30,8],['jest',8,5],
  ['p0',5,5],['p1',10,10],['p2',5,5],['p3',5,5],['p4',5,5],['p5',5,5],['p6',5,5],['p7',5,5],['sevinc',6,6],['sarilma',4,4],['dizKayma',5,4],['uzgun',2,3],['mars',3,3],
  /* A2b: hakem işaretleri iki yuvada sırayla (biri biterken öbürü başlar: çapraz geçiş) */
  ['hkA',10,6],['hkB',10,6]];
const ANM_S={},ANM_SY=new Float32Array(ANM_SLOT.length),ANM_SD=new Float32Array(ANM_SLOT.length);
ANM_SLOT.forEach((s,i)=>{ANM_S[s[0]]=i;ANM_SY[i]=s[1];ANM_SD[i]=s[2];});
const POZ_ETIKET=['esneme','tokalas','comel','foto','alkis','cember','yorgun','tutus'];
const ANM_ETIKET_POZ=[null,POSE.tokalas,ANM_POZ.comel,POSE.foto,POSE.alkis,POSE.cember,ANM_POZ.yorgun,POSE.tutus];

/* ---- aktörler: motordaki her oyuncu, hakem ve kenar kişisi için bir model ---- */
function aktorKur(K,kaynak,boy){
  const m=player(K);m.root.rotation.order='YXZ';scene.add(m.root);golgeEkle(m);
  const N=ANM_SLOT.length,P={},C={};for(const k of ANM_KANAL)P[k]=0;for(const k in ANM_BACAK)C[k]=1;
  return{m,kaynak,boy:boy||1,J:{},yaw:0,ilkYon:true,ph:rnd()*6,amp:0,w:{},px:kaynak?kaynak.x:0,pz:kaynak?kaynak.z:0,x:0,z:0,
    P,C,sw:new Float32Array(N),swV:new Float32Array(N),st:new Float32Array(N),sp:new Array(N).fill(null),faz0:rnd()*6.283,
    /* yürüyüş: dünya hızı/ivmesi, gövdeye göre hareket yönü, ayak hedefleri (x,y,z ×2), kalça/baş dönüşü, tavır parametreleri */
    wvx:0,wvz:0,awx:0,awz:0,mX:0,mZ:1,sapma:0,W:new Float32Array(4),D:new Float32Array(4),anc:new Uint8Array(2),yawO:0,don:0,donY:0,yonM:null,cadS:0,ayakYaw:null,T:new Float32Array([-0.1,-0.034,0.025,0.1,-0.034,0.025]),qA:new Float32Array(2),beta:0.6,dyR:0,dyV:0,hy:0,hyV:0,hyT:0,hyTV:0,by:0,byV:0,kim:null,
    gDrop:0,gGen:0,gAdim:1,gHy:0,tvSon:null,jYan:1,bekP:null,yEk:0,kucuk:false,phItme:0,dokT:-1,dokSon:undefined,dokSurum:-1,dokP:null,dokDon:false,dokCal:false,dokKoru:false,dokS:ANM.dokunus,
    /* T4g: çalım, aldatılan savunmacı ve top saklama katmanının durumu (anmCalimDurum) */
    ck:anmCkYeni(),
    /* eylem: son görülen eylem nesnesi ve başında seçilenler */
    eyl:null,eylAd:'',oSag:1,vG:null,vT:null,vGm:1,vTm:1,vStil:null,kP:null,mP:null,bP:null,kyP:null,oP:null,tP:null,uP:null,uY:0.8,uFaz:'',uG:0,
    sdX:0,sdZ:1,sdS:0.6,bosT:0,bosP:null,efor:0,bosK:null,bkW:new Float32Array(2),bkH:0,bkT:0,bkN:0,dizT:0,kpT:20,kpN:0,kpS:-1,kpTur:0,bakinH:0,sevSon:false,sevC:0,sevH:8,sevDiz:false,dizAktif:false,uzP:null,
    /* kök: yatış ekseni (gövde çerçevesinde x,z), açısı, uzun eksen etrafında dönüş; düşüş/kalkış pozları */
    lkx:1,lkz:0,lth:0,lps:0,lps0:0,lieTur:'',lieSag:true,dP:null,yP:null,kkP:null,kTh0:0,kPs0:0,
    /* A2b: vuruş katmanının durumu (anmVurusDurum) ve iki motor adımı arasındaki oran (topun çizilen yeri için) */
    vk:anmVkYeni(),al:1,
    /* A2b: kalecinin set/split-step durumu, baraj sıçraması, dağıtım pozları */
    ks:{evre:0,t:0,hopT:0.2,e:null},hxU:0,hxUV:0,kP2:null,bj:{e:null,t:-1,h:0.35,T:0.53,bas:false},dg:{e:null,P0:null,P1:null},kpSol:false};
}

/* ---- pozlar: sürekli karışım ---- */
const kar=(J,P,w)=>{if(w<=0.001)return;for(const k in P)J[k]=J[k]+(P[k]-J[k])*w;};
/* aktörün poz karışımı: bacak kanallarında pozun payı da tutulur (kalan pay IK'nındır) */
function anmKar(a,P,w){if(w<=0.001)return;const J=a.P,C=a.C;if(w>1)w=1;for(const k in P){J[k]+=(P[k]-J[k])*w;if(ANM_BACAK[k]===1)C[k]*=1-w;}}
function yumusak(a,ad,hedef,hiz,dt){const v=a.w[ad]||0;a.w[ad]=v+(hedef-v)*Math.min(1,dt*hiz);return a.w[ad];}
/* kök yönü hedefe yaklaşır; tavan verilirse en çok tavan rad/sn (A2a: motorun ani yön atlamaları çizimde tek karede dönüş olmaz) */
function aciYumusak(a,h,dt,hiz,tavan){let d=h-a.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));let s=d*Math.min(1,dt*hiz);if(tavan){const m=tavan*dt;if(s>m)s=m;else if(s<-m)s=-m;}a.yaw+=s;}
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

/* ---- 1. yürüyüş (A2a, 2026-10-08; gerçekçilik planı Ek G0/G1): evreli adım döngüsü. Hız → adım boyu ve kadans (gerçek değerler, boya göre);
   yerdeki ayak dünyaya çivili; havadaki ayak hızlı kalkar, geç ve kısa iner (yerde süzülmez); durunca havadaki ayak adımını tamamlar;
   yerinde dönüşte ayaklar ihtiyaç oldukça basar, kalça ayakların yönünde gecikir, gövde ve baş önden döner; koşuda uçuş evresi ve kalça
   yaylanması; kollar bacakla ters fazda, genlik hızla; ivmede öne, frende geriye, virajda içe yatış (atan(a/g)); baş hız sınırlı yayla
   hedefe döner, baş–gövde sınırını aşan kısmı gövde alır. Oyuncuya göre kimlik (anmKimlik): adım, kol, dirsek, yaylanma, duruş eğimi.
   Yorgunluk (p.enerji < 0,6): koşuda duruş uzar, kalça daha çok yaylanır, ayak daha az kalkar (adım boyu aynı). ---- */
const anmAci=d=>Math.atan2(Math.sin(d),Math.cos(d));
/* T4h (2026-10-09; gerçekçilik planı Ek H madde 15): yarı örtük Euler yayı ω·dt ≈ 0,83'ü aşınca kararsızdır (2× oynatmada kalça yayı ω 34 ile 1,13:
   dy ve bacak kanallarında patlama). Büyük dt alt adımlara bölünür (ω·h ≤ 0,7); 1×'te (dt = 1/60) her yayda tek adım, sonuç eskisiyle aynı */
const anmAltAdim=(w,dt)=>{const n=Math.ceil(w*dt/0.7-1e-9);return n<1?1:n>16?16:n;};
/* bir adımın boyu (m, boy 1 için) boya göre hızdan (vn = hız/√boy): yürüyüşte 0,75·(vn/1,25)^0,42, koşuda 1 + 0,95·(1 − e^−(vn−2,5)/2,2) */
function anmAdimBoyu(vn){
  if(vn<2)return 0.75*Math.pow(Math.max(vn,0.25)/1.25,0.42);
  if(vn<2.5){const w=(vn-2)/0.5;return(1-w)*0.9145+w;}
  return 1+0.95*(1-Math.exp(-(vn-2.5)/2.2));}
/* kimlik: oyuncuya göre sabit hareket parametreleri; profilden (p.profil.alt: çabukluk kısa ve sık adım, güç geniş kol) ve numara/takım
   özetinden (rastlantısız; aynı oyuncu her maçta aynı yürür) */
function anmKimlik(a,p){
  /* A2b: yeri sabit kişiler (top toplayıcı, kenar) numara taşımaz: ev yeri de katılır, yoksa hepsi aynı kimliği paylaşırdı */
  const n=p?((p.n!=null?p.n:p.no||0)|0)+((p.team|0)+1)*37+(p.kind?p.kind.length*101:0)+(p.ev?Math.round(p.ev.x*7+p.ev.z*13):0):0,u=i=>h2(n*13+i,91);
  const al=p&&p.profil&&p.profil.alt,f=(ad,y)=>al&&al[ad]!=null?al[ad]:y,cab=f('cabukluk',0.5),guc=f('guc',0.5);
  return a.kim={adim:1.06-0.12*cab+0.08*(u(1)-0.5),kol:(0.8+0.4*guc)*(0.82+0.36*u(2)),dirsek:0.26*(u(3)-0.5),yay:0.7+0.6*u(4),
    egim:0.09*(u(5)-0.5),nefes:0.85+0.35*u(6),kaldir:0.9+0.2*u(7),bekle:u(8),kipirti:14+22*u(9),faz:u(10)*6.283,
    /* T4-V: vuruş kimliği — geri salınım genliği, tepeye varış temposu, gerilme yayı (kol) ağırlığı, karışım süresi */
    vurS:0.88+0.24*u(11),vurTempo:0.9+0.2*u(12),vurKol:0.9+0.2*u(13),vurTau:0.85+0.3*u(14)};}
function anmYuruyus(a,p,spd,dt,sx,sy){
  const P=a.P,A=ANM.adim,T=a.T,E=ANM.egilme,K=a.kim||anmKimlik(a,p),TAU=6.283185307179586;
  /* gerçek hız: çizilen yerin iki motor adımı arasındaki değişimi; yumuşatılmış hız ve ivme (dünya m/sn) */
  let vx=0,vz=0;if(p&&spd>0){vx=(p.x-a.px)/ADIM;vz=(p.z-a.pz)/ADIM;if(vx*vx+vz*vz>225)vx=vz=0;}
  if(dt>0){const k=Math.min(1,dt*12),ox=a.wvx,oz=a.wvz;a.wvx+=(vx-a.wvx)*k;a.wvz+=(vz-a.wvz)*k;const k2=Math.min(1,dt*6);a.awx+=((a.wvx-ox)/dt-a.awx)*k2;a.awz+=((a.wvz-oz)/dt-a.awz)*k2;}
  const sY=Math.sin(a.yaw),cY=Math.cos(a.yaw),vf=a.wvx*sY+a.wvz*cY,vr=-a.wvx*cY+a.wvz*sY,v=Math.sqrt(vf*vf+vr*vr);
  const af=a.awx*sY+a.awz*cY,ar=-a.awx*cY+a.awz*sY;
  if(v>0.05&&dt>0){const k=Math.min(1,dt*(3+4*v/sx));a.mX+=(-vr/v-a.mX)*k;a.mZ+=(vf/v-a.mZ)*k;const L=Math.sqrt(a.mX*a.mX+a.mZ*a.mZ)||1;a.mX/=L;a.mZ/=L;}
  const mX=a.mX,mZ=a.mZ,wF=mZ>0?mZ*mZ:0,wB=mZ<0?mZ*mZ:0,wS=mX*mX;
  /* kök dönüşü; ayakların yönü yalnız basışta köke yaklaşır: aradaki fark yerinde dönüşte basma ister, kalça bu farkla geride kalır */
  if(dt>0){const d=anmAci(a.yaw-a.yawO);a.don+=(Math.abs(d)/dt-a.don)*Math.min(1,dt*6);
    if(p&&p.yon!=null){const ym=Math.atan2(Math.cos(p.yon),Math.sin(p.yon));if(a.yonM!==null)a.donY+=(anmAci(ym-a.yonM)/dt-a.donY)*Math.min(1,dt*20);a.yonM=ym;}}a.yawO=a.yaw;
  if(a.ayakYaw===null)a.ayakYaw=a.yaw;
  const fark=anmAci(a.yaw-a.ayakYaw),piv=v<1.2?clamp((Math.abs(fark)-0.08)/0.3+a.don/4,0,1)*(1-v/1.2):0;
  /* adım boyu (dünya m) ve kadans; koşu payı (yürüyüş → koşu 2–2,5 m/sn, boya göre) */
  const vn=v/Math.sqrt(sy),kos=clamp((vn-2)/0.5,0,1),Lf=anmAdimBoyu(vn)*sy,yor=clamp((0.6-(p&&p.enerji!=null?p.enerji:1))/0.6,0,1);   /* yor: yorgun koşu */
  /* T4h (2026-10-09): hızlı yan harekette (motorun vuruş hazırlığında gövde pas yönüne erken döner, oyuncu topa koşmayı sürdürür) yan adım 2 m/sn'den
     sonra uzar (yan galop, çapraz adım; 4,5 m/sn'de 0,95 m) ve adım sıklığı insan sınırında kalır (en çok 4,8 adım/sn): eskiden yan koşuda 7–9
     adım/sn çıkıyor, dizler karede 20°'den çok sıçrıyordu */
  const Ly=clamp(A.yanEn+A.yanHiz*v,A.yanEn,A.yanTavan),Lyan=v>2?lerp(Ly,0.95,clamp((v-2)/2.5,0,1)):Ly;
  const wS2=wS*wS,wFB=wF+wB||1,L=Math.max(0.12,v/4.8,((1-wS2)*(wF*Lf+wB*A.geri*Lf)/wFB+wS2*sy*Lyan)*K.adim*a.gAdim);
  let cad=Math.max(v/L,piv*A.donusKadans*(0.7+0.5*Math.min(1,Math.abs(fark)/1.5)),clamp((a.sapma-0.28)/0.2,0,1)*A.donusKadans);
  /* durunca havadaki ayak adımını tamamlar (süzülerek yerine gitmez) */
  if(cad<1.6&&(!a.anc[0]||!a.anc[1]))cad=1.6;
  if(dt>0){a.cadS+=(cad-a.cadS)*Math.min(1,dt*10);cad=a.cadS;}
  const betaH=lerp(lerp(clamp(0.62-0.03*vn,0.55,0.62),clamp(0.4-0.025*(vn-2.5),0.25,0.4)+0.04*yor,kos),0.45,piv);if(dt>0)a.beta+=(lerp(betaH,0.42,wS2*Math.min(1,v))-a.beta)*Math.min(1,dt*6);const beta=a.beta;
  const vk=a.vk;   /* A2b: vuruşta adım döngüsü durur (bacaklar vuruş katmanında) */
  if(dt>0&&cad>0.02&&!(vk&&vk.dondur)){a.ph+=dt*Math.PI*cad;if(a.ph>TAU)a.ph-=TAU;}
  const Lm=L/sx,R=2*beta*Lm*Math.min(1,v/Math.max(1e-3,cad*L)),run=Math.min(1,v/7.5);
  let kal=clamp(A.kaldirEn+A.kaldirHiz*v,A.kaldirEn,A.kaldirTavan)*(wF+0.85*wB+0.75*wS)*K.kaldir*(1-0.2*yor*kos);kal=Math.min(kal,Math.max(0.035,0.5*L))/sy;
  const gen=Math.max(0,(Math.abs(mX)*R-0.12)/2)+a.gGen,zOff=0.025-0.05*run-0.12*R*kos*wF,yuv=A.yuvar*4*Math.min(1,R/0.5),yuvA=yuv*(1.1+1.9*run),Lr=0.92,W=a.W,Dv=a.D,us=lerp(1,0.75,kos);
  let need=9,sapma=0;const u0=a.ph/TAU,ck=a.ck;
  for(let i=0;i<2;i++){let u=u0+i*0.5;u-=Math.floor(u);let q,h=0,g=0;const yer=u<beta;
    /* salınım: yatayda Hermite eğrisi (kalkışta ve inişte ayak yere göre durur); dikeyde 1 − (2g−1)⁴: hızlı kalkış, düz tepe, geç ve kısa iniş
       (uçlarda eğim sonlu); koşuda tepe öne kayar (topuk erken kalkar) */
    if(yer)q=0.5-u/beta;else{g=(u-beta)/(1-beta);const m=-(1-beta)/beta;q=g*g*(3-2*g)-0.5+m*g*(2*g-1)*(g-1);const xg=2*Math.pow(g,us)-1;h=kal*(1-xg*xg*xg*xg);}
    const sd=i?1:-1,j=i*3,k2=i*2;let x=sd*(0.1+gen)+mX*q*R,z=zOff+mZ*q*R,y=-0.034+h+(q*mZ<0?yuvA:yuv)*q*q;
    /* T4g çalım salınımı (makas, gövde çalımı, şut çalımı; anmCkBasla): pencere açıkken kalkan ayağın salınımı işaretlenir ve yolu sapar (dışa
       süpürme, yüksek kaldırma, öne ya da geri); iniş, sapmanın son yanal payıyla (geniş basış) kilitlenir */
    const ckS=!!ck&&ck.sIdx===i;
    if(ckS&&yer&&ck.sAktif&&!a.anc[i]){x+=ck.sSon;ck.sAktif=false;ck.sBitti=true;}
    /* yerdeki ayak dünyaya çivilenir; sapma 0,6 m'yi aşarsa sürüklenir. Basışta ayakların yönü köke yaklaşır. Kalkan ayak sapmayı salınımda kapatır */
    if(yer){if(!a.anc[i]){W[k2]=a.x+(x*cY+z*sY)*sx;W[k2+1]=a.z+(-x*sY+z*cY)*sx;a.anc[i]=1;a.ayakYaw+=anmAci(a.yaw-a.ayakYaw)*0.85;}
      const dx=W[k2]-a.x,dz=W[k2+1]-a.z,ax=(dx*cY-dz*sY)/sx,az=(dx*sY+dz*cY)/sx;let ex=ax-x,ez=az-z;const e=Math.sqrt(ex*ex+ez*ez);
      if(e>0.6){const k=0.6/e;ex*=k;ez*=k;W[k2]=a.x+((x+ex)*cY+(z+ez)*sY)*sx;W[k2+1]=a.z+(-(x+ex)*sY+(z+ez)*cY)*sx;}
      x+=ex;z+=ez;Dv[k2]=ex;Dv[k2+1]=ez;if(e>sapma)sapma=e;}
    else{if(ckS&&a.anc[i]&&ck.sAcik&&!ck.sAktif&&!ck.sBitti){ck.sAktif=true;ck.sG0=g;}
      a.anc[i]=0;const f=1-g*g*(3-2*g);x+=Dv[k2]*f;z+=Dv[k2+1]*f;
      if(ckS&&ck.sAktif){const s=Math.sin(Math.PI*g),w=ck.sW*clamp((g-ck.sG0)/0.2,0,1),sm=g*g*(3-2*g);ck.sSon=ck.sX*ck.sL*sm*w;
        x+=ck.sX*ck.sA*Math.pow(s,0.8)*w+ck.sSon;y+=ck.sH*s*w;z+=(ck.sZ+ck.sZ2*(1-g))*s*w;}}
    T[j]=x;T[j+1]=y;T[j+2]=z;a.qA[i]=2*q*mZ;
    /* yerdeki ayağa uzanmak için kalçanın inmesi gereken yer */
    if(yer){const dx=x-sd*0.1,dh2=dx*dx+z*z,iv=Math.sqrt(Math.max(0.04,Lr*Lr-dh2))+y-0.91;if(iv<need)need=iv;}}
  a.sapma=sapma;
  /* A2b vuruş katmanı: ayak hedefleri vuruşun hedeflerine (çıkışta son vuruş hedeflerinden döngüye) ağırlıkla geçer */
  if(vk&&vk.kw>0){const w=vk.kw,V=vk.evre===5?vk.Te:vk.T;for(let k=0;k<6;k++)T[k]+=(V[k]-T[k])*w;}
  /* kalça yüksekliği: yerdeki ayağa uzanma ve koşuda yaylanma (duruşun ortasında alçak, uçuşta yüksek); hızlı kritik sönümlü yayla izlenir */
  if(need>8)need=a.dyR;need=Math.min(0,need);
  if(vk&&vk.kw>0&&vk.evre!==5)need=lerp(need,vk.need<8?Math.min(0,vk.need)+vk.dy:a.dyR,vk.kw);   /* iki ayak havadayken kalça yüksekliği korunur */
  const yay=kos*K.yay*(1+0.5*yor)*lerp(ANM.yaylanma[0],ANM.yaylanma[1],clamp((v-3)/5,0,1))/sy;
  /* iniş sınırı: gerçek yürüyüşte kütle merkezi 4–5 cm iner (geride kalan ayağın topuğu kalkar; hızlı yürüyüşte daha çok); yetişemeyen ayağı yumuşak IK kısa bırakır */
  const dyH=Math.max(Math.min(need,-yay*Math.cos(2*TAU*(u0-beta/2))),-lerp(0.09,0.1,kos)/sy);
  if(dt>0){const w=34,n=anmAltAdim(w,dt),h=dt/n;for(let s=0;s<n;s++){a.dyV+=(w*w*(dyH-a.dyR)-2*w*a.dyV)*h;a.dyR+=a.dyV*h;}}
  P.dy=Math.min(-a.gDrop,a.dyR);
  /* eğilme: koşu duruşu (kimlikle), ivmeden öne/arkaya, virajda içe (atan(a/g)) */
  P.lean=Math.min(0.6,(E.kosu*run+K.egim*kos)*wF+0.05*wB*Math.min(1,v)+clamp(Math.atan(af/9.81)*E.ivme,E.ivmeAlt,E.ivmeUst)+0.6*a.gDrop);
  P.hz=clamp(Math.atan(ar/9.81)*E.yatis,-E.yatisTavan,E.yatisTavan)*Math.min(1,v/3);
  /* kalça: hareket çizgisine döner (geri koşuda düz), adımla salınır, dönüşte ayakların yönünde geride kalır; gövde ters döner ve kökle gider */
  let fl=Math.atan2(-mX,mZ);if(fl>1.5708)fl-=Math.PI;else if(fl<-1.5708)fl+=Math.PI;
  /* tam yana harekette kalça kare kalır (±90°'de yön değiştirirken kalça öbür yana kapanmaz); kritik sönümlü yayla */
  const fy=Math.abs(fl)/1.5708,hyH=-clamp(fl*0.7,-ANM.kalcaDonus,ANM.kalcaDonus)*Math.min(1,v/1.5)*(1-fy*fy*fy*fy)+a.gHy;
  if(dt>0){const w=9,n=anmAltAdim(w,dt),h=dt/n;for(let s=0;s<n;s++){a.hyV+=(w*w*(hyH-a.hy)-2*w*a.hyV)*h;a.hy+=a.hyV*h;}}
  if(dt>0){const w=12,h=clamp(-fark*ANM.kalcaGecikme,-0.5,0.5),n=anmAltAdim(w,dt),k=dt/n;for(let s=0;s<n;s++){a.hyTV+=(w*w*(h-a.hyT)-2*w*a.hyTV)*k;a.hyT+=a.hyTV*k;}}
  const sal=lerp(ANM.kalcaSalinim[0],ANM.kalcaSalinim[1],run)*Math.min(1,v)*Math.cos(TAU*u0);
  P.hy=a.hy+sal+a.hyT;P.gy=-a.hy*0.8-1.5*sal-a.hyT;
  /* kollar: bacakla ters fazda (sağ ayak basarken sağ kol geride), genlik hızla ve kimlikle; öne gelen kolun dirseği daha kapalı */
  const KL=ANM.kol,cs=Math.cos(TAU*u0),yk=clamp((mZ+0.2)/0.4,-1,1);   /* geri koşuda kollar ters; geçiş sürekli */
  const kolA=(KL.genlik[0]+KL.genlik[1]*run)*K.kol*(wF+0.6*wB+0.25*wS)*Math.min(1,v/0.4+piv*0.5);
  P.aL=kolA*cs*yk;P.aR=-kolA*cs*yk;
  P.eL=P.eR=-(KL.dirsek[0]+KL.dirsek[1]*run+K.dirsek);P.eL-=0.09*run*(1-cs*yk);P.eR-=0.09*run*(1+cs*yk);
  P.aLz=-0.08-0.06*run-0.2*wS*Math.min(1,v);P.aRz=-P.aLz;
  /* baş (bakış zinciri): hedef p.bakisYon ya da top; arkada kalan hedefte baş döndüğü omuzda kalır (öbür omuza fırlamaz); dönüşte baş önden
     gider; hız sınırlı kritik sönümlü yay; baş–gövde sınırını aşan kısmı gövde alır */
  const ph=mac.phase,B=ANM.bas;let yH=0;
  let hxU=0;
  if(p&&!a.kucuk&&p.yon!=null&&(ph==='play'||ph==='durus'||ph==='kickoff')){const b=mac.ball,dx=b.x-p.x,dz=b.z-p.z,d2=dx*dx+dz*dz;
    /* A2b uzun top ve orta (Ek G3): top havadayken herkes taramayı bırakıp topa bakar, baş topun yüksekliğine kalkar (çok yüksekte gövde de
       geriye) */
    const ucan=!b.sahip&&!b.tasiyan&&(b.y>1.2||(!!b.pas&&b.pas.L>20&&b.y>0.4));
    let hed=ucan&&d2>0.25?Math.atan2(dz,dx):p.bakisYon;if(hed==null&&d2>0.25)hed=Math.atan2(dz,dx);
    /* T4g top saklama: baş arada rakibe döner (omuz üstünden; anmKoru) */
    if(!ucan&&ck&&ck.korBak&&ck.korO&&p.tavir==='koru')hed=Math.atan2(ck.korO.z-p.z,ck.korO.x-p.x);
    if(ucan&&d2>0.25)hxU=-clamp(Math.atan2(b.y+0.14-1.62*sy,Math.sqrt(d2)),0,1.15)*0.72;
    if(hed!=null){yH=-anmAci(hed-p.yon);if(Math.abs(yH)>2.2&&yH*a.by<0&&Math.abs(a.by)>0.3)yH+=yH>0?-TAU:TAU;}
    yH+=clamp(a.donY*B.oncu,-1.5,1.5)+(a.kpS>=0&&a.kpTur===1?a.bakinH*Math.sin(Math.PI*Math.min(1,a.kpS/2.2)):0);
    /* yakındaki topa baş eğilir; bakış (tarama) topun yönünden uzaklaştıkça baş kalkar (T2 bakınma: omuz üstünden bakan başını kaldırır) */
    if(d2<16){let k=1;if(p.bakisYon!=null&&d2>0.01){const r=anmAci(p.bakisYon-Math.atan2(dz,dx));k=clamp(Math.cos(r),0,1);}
      P.hx+=0.25*(1-Math.sqrt(d2)/4)*k;}}
  /* başın topa kalkması kritik sönümlü yayla (top inince ya da sahip olunca sıçramasın) */
  if(dt>0){const w=12,n=anmAltAdim(w,dt),h=dt/n;for(let s=0;s<n;s++){a.hxUV+=(w*w*(hxU-a.hxU)-2*w*a.hxUV)*h;a.hxU+=a.hxUV*h;}}
  P.hx+=a.hxU;if(a.hxU<-0.45)P.gx+=(a.hxU+0.45)*0.35;
  yH=clamp(yH,-(B.sinir+B.govde),B.sinir+B.govde);
  /* hız sınırı ve gövdenin payı yumuşak (tanh, softplus): sınırda ivme kırılmaz */
  if(dt>0){const w=B.yay,n=anmAltAdim(w,dt),h=dt/n;for(let s=0;s<n;s++){const ac=clamp(w*w*(yH-a.by)-2*w*a.byV,-B.ivme,B.ivme);a.byV+=ac*h;a.byV=B.hiz*Math.tanh(a.byV/B.hiz);a.by+=a.byV*h;}}
  {const x=Math.abs(a.by)-B.sinir;P.gy+=Math.sign(a.by)*(x>3?x:Math.log(1+Math.exp(8*x))/8);}
  P.by=clamp(a.by-P.hy-P.gy,-1.4,1.4);
}

/* ---- bekleyiş (A2a, Ek G0.7): duran oyuncu iki tarz arasında (eller belde, gevşek) 8–15 sn'de bir yumuşakça geçer;
   tarz tercihi kimlikten; sert koşudan sonra (a.efor) durunca 2–4 sn elleri dizlerinde soluklanır; uzun beklemede kimliğin aralığıyla
   (14–36 sn) küçük kıpırtı: bakınma (baş 60° yana ve geri) ya da çorap çekme. Sayaçlar ve seçimler rastlantısız (h2). ---- */
/* kıpırtı türleri: süre (s), giriş (g), çıkış (c) ve poz (1 bakınma yalnız baştadır) */
const ANM_KIPIRTI=[null,{s:2.2,g:0,c:0,P:null},{s:1.6,g:0.35,c:0.45,P:ANM_POZ.corap},{s:1.8,g:0.3,c:0.4,P:ANM_POZ.eldiven},{s:3.4,g:0.5,c:0.6,P:ANM_POZ.esnemeArka},{s:3.4,g:0.6,c:0.6,P:ANM_POZ.esnemeOn}];
const ANM_BEKLE_TARZ=[ANM_POZ.belde,ANM_POZ.gevsek],ANM_BEKLE_KANAL=[...new Set([].concat(...ANM_BEKLE_TARZ.map(Object.keys)))];
function anmBekleyis(a,p,dt,duruyor){
  const K=a.kim||anmKimlik(a,p),W=a.bkW;
  if(!a.bosK){a.bosK={};a.bkH=K.bekle<0.45?0:1;W[a.bkH]=1;a.bkT=4+8*K.bekle;a.kpT=K.kipirti*(0.4+0.6*K.bekle);}
  if(dt>0){
    a.bkT-=dt;if(a.bkT<=0){a.bkN++;const u=h2(a.bkN*31+((K.faz*1000)|0),17);a.bkH=u<0.35?(K.bekle<0.45?0:1):1-a.bkH;a.bkT=8+7*h2(a.bkN,23);}
    for(let i=0;i<2;i++)W[i]+=((i===a.bkH?1:0)-W[i])*Math.min(1,dt*1.5);
    /* soluklanma: sert koşudan sonra duran oyuncu */
    if(a.dizT>0)a.dizT-=dt;else if(duruyor&&a.bosT>0.3&&a.bosT<1&&a.efor>0.9)a.dizT=2+Math.min(2,a.efor);
    /* kıpırtı: 0 yok, 1 bakınma, 2 çorap, 3 eldiven (kaleci), 4–5 esneme (A2b: ölü topta, yorgunluk arttıkça daha sık); uzun beklemede */
    if(a.kpS>=0){a.kpS+=dt;if(a.kpS>ANM_KIPIRTI[a.kpTur].s){a.kpS=-1;a.bakinH=0;}}
    else if(duruyor&&a.bosT>2.5&&a.dizT<=0){a.kpT-=dt;if(a.kpT<=0){a.kpN++;const u=h2(a.kpN*13,(K.faz*100)|0),ph=mac.phase;
      if(p&&p.rol==='GK')a.kpTur=u<0.5?1:3;
      else if((ph==='durus'||ph==='kickoff'||ph==='goal')&&p&&((p.yorgunluk||0)>0.2||(p.enerji!=null&&p.enerji<0.85)))a.kpTur=u<0.45?1:u<0.65?2:u<0.83?4:5;
      else a.kpTur=u<0.7?1:2;
      a.kpS=0;a.kpT=K.kipirti;a.kpSol=h2(a.kpN,9)<0.5;a.bakinH=(h2(a.kpN,5)<0.5?-1:1)*1.05;}}
    if(a.kpS<0||a.kpTur!==1)a.bakinH=0;}
  const B=a.bosK;for(const k of ANM_BEKLE_KANAL){let x=0;for(let i=0;i<2;i++){const v=ANM_BEKLE_TARZ[i][k];if(v)x+=W[i]*v;}B[k]=x;}
}

/* ---- tavır (sözleşme: p.tavir) → yürüyüş parametreleri ve üst gövde ---- */
function anmTavir(a,p,dt){
  let drop=0,gen=0,adim=1,hyE=0;
  if(p&&p.tur==='oyuncu'){const tv=p.tavir,b=mac.ball,st=a.st,sp=a.sp,S=ANM_S;
    let hazir=tv==='hazir';if(tv==null&&p.rol==='GK'&&b.sut&&b.sut.team!==p.team&&mac.phase==='play'&&!p.eylem)hazir=true;
    if(tv!==a.tvSon){a.tvSon=tv;if(tv==='jokey')a.jYan=anmSagda(p,b.x,b.z)?1:-1;
      /* T4g: top saklamanın başında rakibin yanı (sonra her karede histerezisle, anmKoru) */
      if(tv==='koru'){const o=anmKorRakip(p);a.ck.korSag=!o||anmSagda(p,o.x,o.z);a.ck.korT=0;}
      if(tv==='bekle')a.bekP=p.ayak==='sol'?aynala(ANM_POZ.bekle):ANM_POZ.bekle;}
    /* A2b kaleci: şutçunun basışına zamanlanmış split-step ve set duruşu (anmKaleciSet) */
    const ks=p.rol==='GK'?anmKaleciSet(a,p,dt):0;
    const bjw=p.rol!=='GK'?anmBaraj(a,p,dt):0;
    if(hazir||ks>0){st[S.hazir]=1;sp[S.hazir]=ANM_POZ.kaleciHazir;st[S.set]=ks;sp[S.set]=ANM_POZ.kaleciSet;drop=0.13+0.07*ks;gen=0.12+0.06*ks;adim=0.6-0.2*ks;}
    else if(tv==='jokey'){st[S.jokey]=1;sp[S.jokey]=ANM_POZ.jokey;drop=0.12;gen=0.07;adim=0.65;hyE=-0.35*a.jYan;}
    /* T4g top saklama: rakibin yanı her karede (anmKoru); iki yuva (sağ/sol) çapraz geçer; alçak, geniş, kısa adım */
    else if(tv==='koru'){anmKoru(a,p,dt);const sg=a.ck.korSag;st[S.koru]=sg?1:0;sp[S.koru]=ANM_POZ.koru;st[S.koruS]=sg?0:1;sp[S.koruS]=aynala(ANM_POZ.koru);drop=0.1;gen=0.12;adim=0.7;}
    else if(tv==='bekle'){st[S.bekle]=1;sp[S.bekle]=a.bekP||ANM_POZ.bekle;adim=0.7;}
    /* T2 taşıma: topu süren oyuncu (eylemsiz, tavırsız) koşarken hafif öne eğik, kollar dengede (hızla artar) */
    const v=Math.sqrt((p.vx||0)*(p.vx||0)+(p.vz||0)*(p.vz||0)),sahip=b.sahip===p;
    if(sahip&&!tv&&!p.eylem){st[S.tasi]=clamp((v-1.2)/2,0,1);sp[S.tasi]=ANM_POZ.tasi;}
    /* boşta (T1; sözleşme: p.kip, yoksa hızdan): bir süre duran oyuncu eller belde ya da gevşek durur, ağırlığını değiştirir (anmEkler);
       yürürken yarı ağırlıkla. Oyuncuya göre sabit seçim (h2), rastlantısız. Topu süren boşta duruşa girmez (T2) */
    const ph=mac.phase,kip=p.kip!=null?p.kip:v<0.2?'dur':v<2?'yuru':'';
    /* A2a: yakın geçmişteki sert koşu (sn eşdeğeri; 8 sn'de söner) — durunca soluklanma */
    if(dt>0)a.efor+=dt*((v>5.5?1:v>4?0.4:0)-a.efor/8);
    /* A2b baraj: eller önde; vuruşla sıçrama (anmBaraj) */
    if(bjw){st[S.baraj]=1;sp[S.baraj]=ANM_POZ.baraj;if(bjw===2){st[S.barajZ]=1;sp[S.barajZ]=a.bj.bas?(a.bj.basSol?aynala(ANM_POZ.barajZiplaBas):ANM_POZ.barajZiplaBas):ANM_POZ.barajZipla;}}
    /* A2b ikinci top: havadan inen top yakına düşecekse dizler bükük, baş topta */
    else if(!p.eylem&&!sahip&&mac.phase==='play'&&anmIkinciTop(p,b)){st[S.izle]=0.7;sp[S.izle]=ANM_POZ.izle;drop=Math.max(drop,0.05);}
    if(!tv&&!hazir&&!bjw&&!sahip&&!p.eylem&&!p.poz&&!p.sevinc&&(ph==='play'||ph==='durus'||ph==='kickoff')){
      a.bosT=kip==='dur'?a.bosT+dt:0;
      anmBekleyis(a,p,dt,kip==='dur');
      st[S.bosta]=kip==='dur'?(a.bosT>1.2?1:0):kip==='yuru'?0.45:0;sp[S.bosta]=a.bosK;
      st[S.dizler]=a.dizT>0?1:0;sp[S.dizler]=ANM_POZ.dizler;
      if(a.kpS>=0&&a.kpTur>=2){const K=ANM_KIPIRTI[a.kpTur];st[S.kipirti]=anmZarf(a.kpS,K.s,K.g,K.c);sp[S.kipirti]=a.kpTur>=4&&a.kpSol?aynala(K.P):K.P;}}
    else{a.bosT=0;a.dizT=0;a.kpS=-1;a.bakinH=0;}}
  /* A2b hakem bekleyişi: duran orta hakem eller arkada, yan hakem gevşek, 4. hakem eller önde (işaret yokken) */
  else if(p&&(p.tur==='hakem'||p.kind==='dorduncu')){const st=a.st,sp=a.sp,S=ANM_S,v=Math.sqrt((p.vx||0)*(p.vx||0)+(p.vz||0)*(p.vz||0)),h=ANM_HK.get(p);
    a.bosT=v<0.3&&!(h&&(h.cur||h.sira.length))?a.bosT+dt:0;
    if(a.bosT>0.8){st[S.bosta]=1;sp[S.bosta]=p.kind==='lin'?ANM_POZ.gevsek:p.kind==='dorduncu'?ANM_POZ.hkOnde:ANM_POZ.hkBekle;}}
  /* T4g: çalım hazırlığında kısa ve sık adım, diz bükük (harekete göre); aldatılan savunmacı alçak ve geniş basar */
  const ck=a.ck;let hizli=!!(a.ks&&a.ks.evre);
  if(ck){if(ck.evre===1){const Y=ANM_CK_YUR[ck.mek]||ANM_CK_YUR.aldat;drop=Math.max(drop,Y[0]);gen=Math.max(gen,Y[1]);adim=Math.min(adim,Y[2]);hizli=true;}
    if(ck.yW>0.01&&ck.yE&&ck.yE.mek==='aldat'){drop=Math.max(drop,0.1*ck.yW);gen=Math.max(gen,0.12*ck.yW);hizli=true;}}
  if(dt>0){const k=Math.min(1,dt*(hizli?12:5));a.gDrop+=(drop-a.gDrop)*k;a.gGen+=(gen-a.gGen)*k;a.gAdim+=(adim-a.gAdim)*k;a.gHy+=(hyE-a.gHy)*k;}
}

/* ---- 1b. vuruş katmanı (A2b, 2026-10-08; gerçekçilik planı Ek G2): hazırlık → basış → geri salınım → temas → takip → iniş. Motorun vuruş
   evreleri (vurus.faz hazirlik/geri/takip, ft, geri, stil, guc, ayak, sec, sabit) okunur, motora yazılmaz. Hazırlığın son adımlarında karşı kol
   açılır ve gövde burulur; temastan tBas sn önce destek ayağı tahmini temas yerinin yanına basar ve dünyaya kilitlenir (gerekirse kısa ayar
   adımıyla); vuran ayak IK ile geri salınımın tepesine çıkar (diz ~90°), temastan tD sn önce aşağıdan topa iner ve motorun 'takip'e geçtiği
   karede topa değer (kare sapması 0); takipte ayak hedefe doğru yükselir; sert vuruşta vuran ayağa iniş sıçraması (destek ayağı yerden kesilir),
   sonra vuran ayak öne basar ve adım döngüsü o ayaktan yeniden başlar (0,16 sn'lik ataletli geçiş). Bacaklar IK'dadır; pozlar üst gövdeyi
   (karşı kolun açılıp geriye uzaması: “gerilme yayı”, gövdenin burulması, eğilme) ve ayak burulmasını (iç ayakta uç dışa) verir.
   Evreler: 0 yok · 1 hazırlık (yalnız üst gövde) · 2 basış ve salınım · 3 takip · 4 iniş · 5 çıkış (adım döngüsüne geçiş).
   T4-V (2026-10-09): temasa kalan süre motordan okunur (vurus.kalan; son adım = vurus.geri, üst gövde hazırlığı + vurus.hazirlikEn), geri
   salınım kalan süreye bağlı durumsuz eğridir (her oynatma hızında aynı), karışım üstel, ilk kez temasta görülen eylemde kısa vuruş, 22 m'den
   uzun yerden pas gerilmeli, vuruşta kimlik (anmKimlik vur*). ---- */
const ANM_VK_POZ={
  /* geri salınım (G) ve temas/takip (T), sağ ayak için (sol ayakta aynalanır): karşı (sol) kol açılıp geriye uzar, gövde vuruş tarafının
     tersine burulur (kalça sağa, göğüs sola); takipte kalça sola döner, karşı kol öne süpürür, vuran taraftaki kol geriye gider */
  icG:{gy:0.18,hy:-0.16,aR:0.12,aRz:0.85,eR:-0.35,aL:-0.22,aLz:-0.3,eL:-0.6,hx:0.38,lLy:-0.35},
  icT:{gy:-0.14,hy:0.2,aR:-0.25,aRz:0.6,eR:-0.4,aL:0.25,aLz:-0.4,eL:-0.5,hx:0.32,lLy:-0.85},
  disG:{gy:0.12,hy:-0.1,aR:0.1,aRz:0.7,eR:-0.35,aL:-0.2,aLz:-0.35,eL:-0.6,hx:0.36,lLy:0.3},
  disT:{gy:0.22,hy:-0.22,aR:-0.2,aRz:0.55,eR:-0.4,aL:-0.1,aLz:-0.75,eL:-0.4,hx:0.3,lLy:0.45},
  ustG:{lean:-0.04,gy:0.4,hy:-0.26,gz:-0.08,aR:0.3,aRz:1.45,eR:-0.22,aL:-0.4,aLz:-0.42,eL:-0.75,hx:0.42,lLy:0},
  ustT:{lean:0.06,gy:-0.42,hy:0.3,gz:0.04,aR:-0.55,aRz:0.75,eR:-0.45,aL:0.5,aLz:-0.5,eL:-0.45,hx:0.38,lLy:0},
  uzunG:{lean:-0.16,gx:-0.06,gy:0.42,hy:-0.3,gz:-0.1,aR:0.45,aRz:1.6,eR:-0.2,aL:-0.45,aLz:-0.5,eL:-0.7,hx:0.32,lLy:0},
  uzunT:{lean:-0.18,gx:-0.1,gy:-0.4,hy:0.32,aR:-0.7,aRz:0.95,eR:-0.4,aL:0.55,aLz:-0.7,eL:-0.4,hx:0.2,lLy:0},
  asirtmaG:{lean:-0.1,gy:0.25,hy:-0.2,aR:0.22,aRz:1.15,eR:-0.3,aL:-0.3,aLz:-0.5,eL:-0.65,hx:0.34,lLy:0},
  asirtmaT:{lean:-0.24,gx:-0.08,gy:-0.1,hy:0.12,aR:-0.2,aRz:1.05,eR:-0.35,aL:0.2,aLz:-0.85,eL:-0.4,hx:0.15,lLy:0},
  voleG:{lean:-0.1,gz:-0.34,hz:-0.18,gy:0.28,hy:-0.3,aR:0.1,aRz:1.45,eR:-0.3,aL:-0.2,aLz:-1.1,eL:-0.4,hx:0.2,lLy:0},
  voleT:{lean:-0.05,gz:-0.45,hz:-0.22,gy:-0.28,hy:0.36,aR:-0.3,aRz:1.05,eR:-0.35,aL:0.3,aLz:-1.3,eL:-0.4,hx:0.25,lLy:0}};
/* stile göre geri salınımın (S) ve takibin (T) büyüklüğü; güç ve uzun top ölçekler */
const ANM_VK_STIL={ic:{S:0.45,T:0.4},dis:{S:0.6,T:0.6},ust:{S:1,T:1},yarimVole:{S:0.85,T:0.85},asirtma:{S:0.7,T:0.4},vole:{S:0.9,T:0.9}};
const ANM_VK_YG=-0.034,ANM_VK_G=new Float32Array(2),ANM_VK_B=new Float32Array(3),ANM_VK_Q=new Float32Array(3),ANM_VK_L=new Float32Array(3);
function anmVkYeni(){const f=n=>new Float32Array(n);return{evre:0,e:null,t:0,tT:0,tL:0,ayak:0,yan:-1,stil:'ic',uzun:false,sert0:false,sert:false,S:1,Tk:1,g:0.6,
  tD:0.1,tB:0.3,tF:0.2,tIn:0.15,hopT:0,hopH:0,h:0,tc:9,u:0,asagi:false,kd:0,ofs:0,ofs0:0,kp:f(3),kv:f(3),D0:f(3),C:f(3),F:f(3),Ln:f(3),
  sw:f(2),s0:f(2),sAd:1,sDur:0.1,sBos:false,sb:f(3),T:f(6),Te:f(6),kw:0,dondur:false,need:9,yer:new Uint8Array(2),
  wG:0,wT:0,pG:null,pT:null,yEk:0,dy:0,lean:0,cikT:0,hazEn:0.22,uzunYer:false,k0:f(3),kisa:false,tempo:1,kol:1,tau:0.045};}
/* gövde çerçevesi (x sola, z öne; js/animasyon.js adım döngüsüyle aynı) ↔ dünya */
function anmVkGovde(a,wx,wz,sx){const c=Math.cos(a.yaw),s=Math.sin(a.yaw),dx=wx-a.x,dz=wz-a.z;ANM_VK_G[0]=(dx*c-dz*s)/sx;ANM_VK_G[1]=(dx*s+dz*c)/sx;return ANM_VK_G;}
function anmVkDunya(a,x,z,sx){const c=Math.cos(a.yaw),s=Math.sin(a.yaw);ANM_VK_G[0]=a.x+(x*c+z*s)*sx;ANM_VK_G[1]=a.z+(-x*s+z*c)*sx;return ANM_VK_G;}
/* topun çizilen yeri (iki motor adımı arası; aktörlerle aynı oran) */
function anmVkTop(al){const b=mac.ball,P=typeof TOP!=='undefined'?TOP:null;
  ANM_VK_B[0]=P?lerp(P.px,b.x,al):b.x;ANM_VK_B[1]=P?lerp(P.py,b.y,al):b.y;ANM_VK_B[2]=(P?lerp(P.pz,b.z,al):b.z)-MOTOR_Z;return ANM_VK_B;}
/* ikinci derece Bézier; orta nokta eğrinin s = 0,5'te geçtiği yer (denetim noktası 2M − (A+C)/2) */
function anmVkBez(A,M,C,s,o){const u=1-s;for(let k=0;k<3;k++){const q=2*M[k]-(A[k]+C[k])/2;o[k]=u*u*A[k]+2*u*s*q+s*s*C[k];}}
/* temasa kalan süre (sn; motorun hesabıyla: hazırlıkta hizalanma ve ayak–top uzaklığı, geri salınımda kalan süre, gelişine vuruşta topun
   ayağa varışı); hizalanmamışsa 9. Vuruş yönü vk.kd (motor açısı) */
function anmVkKalan(vk,p,vur){
  const b=mac.ball,sec=vur.sec||{},hx=sec.hx!=null?sec.hx:b.x+Math.cos(p.yon),hz=sec.hz!=null?sec.hz:b.z+Math.sin(p.yon);
  vk.kd=Math.atan2(hz-b.z,hx-b.x);
  if(vur.faz==='takip')return 0;
  /* T4-V: motor temasa kalan süreyi her adımda bildirir (vurus.kalan); yoksa (dondurulmuş kopyalar, poz galerisi) aşağıdaki tahmin */
  if(vur.kalan!=null)return vur.kalan;
  const fx=p.x+Math.cos(p.yon)*0.3,fz=p.z+Math.sin(p.yon)*0.3,dx=b.x-fx,dz=b.z-fz,d=Math.sqrt(dx*dx+dz*dz),geri=vur.geri||0.11;
  if(vur.faz==='geri'){let tc=Math.max(0,geri-(vur.ft||0));
    if(vur.sabit){const v=Math.sqrt(b.vx*b.vx+b.vz*b.vz);if(v>1.5){const yol=-(dx*b.vx+dz*b.vz)/v;if(yol>0)tc=Math.min(tc,yol/v);}}
    return tc;}
  /* gelişine vuruşta motor gövdeyi karşılama noktasına göre hizalar (topun bugünkü yerine göre değil): hizalanma aranmaz. Değilse hizasız
     gövdenin dönmesi için süre eklenir (~3 rad/sn); çok hizasızsa (dönüşün başı) bekler */
  let don=0;if(!sec.ilk){const s=Math.abs(anmAci(vk.kd-p.yon)),sn=vur.stil==='dis'?1:0.85;if(s>sn+0.9)return 9;if(s>sn)don=(s-sn)/3;}
  const vc=d>1e-3?(((p.vx||0)-b.vx)*dx+((p.vz||0)-b.vz)*dz)/d:0;
  return geri+don+Math.max(0,d-(sec.ilk?0.62:0.5))/Math.max(0.7,vc);
}
function anmVkPoz(vk){const st=vk.stil,k=st==='ic'?(vk.uzunYer?'ust':'ic'):st==='dis'?'dis':st==='asirtma'?'asirtma':st==='vole'?'vole':vk.uzun?'uzun':'ust';
  const G=ANM_VK_POZ[k+'G'],T=ANM_VK_POZ[k+'T'];vk.pG=vk.ayak?aynala(G):G;vk.pT=vk.ayak?aynala(T):T;}
/* temas yeri (gövde çerçevesi): üstle top ortasının arkası, iç ayakla topun yanı, dış ayakla öbür yanı, aşırtmada altı, volede top
   yüksekliğinde; bacağın erişimine sığdırılır */
function anmVkTemas(vk,bx,bz,by,o){
  const y=vk.yan,st=vk.stil;let x=bx,z=bz-0.15,h=by+0.05;
  if(st==='ic'){x=bx+y*0.1;z=bz-0.04;h=by+0.02;}else if(st==='dis'){x=bx-y*0.09;z=bz-0.06;h=by+0.03;}
  else if(st==='asirtma'){z=bz-0.12;h=by;}else if(st==='vole'){x=bx+y*0.04;z=bz-0.1;h=by+0.06;}
  o[0]=x;o[1]=ANM_VK_YG+Math.max(0.01,h);o[2]=z;
  const hx=y*0.1,dx=o[0]-hx,dy=o[1]-0.9,dz=o[2],d=Math.sqrt(dx*dx+dy*dy+dz*dz);if(d>0.935){const k=0.935/d;o[0]=hx+dx*k;o[1]=0.9+dy*k;o[2]=dz*k;}
}
function anmVkBasla(a,p,vur){
  const vk=a.vk,b=mac.ball,sec=vur.sec||{},L=sec.hx!=null?Math.sqrt((sec.hx-b.x)*(sec.hx-b.x)+(sec.hz-b.z)*(sec.hz-b.z)):10;
  vk.evre=1;vk.t=0;vk.e=vur;vk.ayak=vur.ayak==='sol'?1:0;vk.yan=vk.ayak?1:-1;vk.stil=vur.stil||'ic';
  vk.uzun=(sec.tip==='hava'&&L>22)||sec.tur==='uzaklastir'||sec.tur==='orta'||sec.tur==='korner';vk.sert0=sec.tur==='sut'||vk.uzun;
  /* T4-V: 22 m'den uzun yerden pas gerilmeli (geniş salınım, üst gövde pozları, yüksek takip); kimlik (anmKimlik vur*); baskıda acele (dar) */
  vk.uzunYer=(sec.tip||'yer')==='yer'&&L>22&&sec.tur!=='sut'&&sec.tur!=='uzaklastir'&&!sec.ilk;
  const st=ANM_VK_STIL[vk.stil]||ANM_VK_STIL.ust,K=a.kim||anmKimlik(a,p);vk.tempo=K.vurTempo;vk.kol=K.vurKol;vk.tau=0.045*K.vurTau;
  /* Ek G2: tek vuruşta ve kesme ortada kısa, zayıf ayakla dar salınım */
  vk.S=st.S*(vk.uzun?1.2:vk.uzunYer?1.5:1)*(sec.tur==='sut'?1.05:1)*(vk.stil==='ic'?0.8+Math.min(L,30)/60:1)*(vur.tekDokunus?0.75:1)*(sec.yay==='kesme'?0.85:1)*
    (p.ayak&&p.ayak!=='iki'&&vur.ayak&&vur.ayak!==p.ayak?0.8:1)*K.vurS*(vur.baski>0.5?0.8:1);
  /* tD: aşağı salınım (temastan önce), tB: son adımın başı = motorun geri salınım süresi (T4-V; yoksa türe göre); üst gövde hazırlığı
     tB + hazirlikEn (motorun asgari hazırlığı) */
  vk.tD=0.07+0.035*vk.S;vk.tB=vur.geri!=null?Math.max(vk.tD+0.08,vur.geri):vk.tD+(vk.uzun?0.28:vk.sert0?0.23:0.18);
  vk.hazEn=vur.hazirlikEn!=null?Math.max(0.1,vur.hazirlikEn):0.22;
  vk.h=0;vk.asagi=false;vk.u=0;vk.sBos=false;vk.sAd=1;vk.tc=9;vk.kisa=false;anmVkPoz(vk);
}
/* destek ayağının basacağı yer (dünya): tahmini temas anındaki topun 0,12 m gerisi, 0,22–0,27 m yanı */
function anmVkBasisYeri(vk,tc){
  const b=mac.ball,cx=Math.cos(vk.kd),cz=Math.sin(vk.kd),dS=vk.sert0?0.27:0.22,tt=Math.min(tc,0.5);
  vk.sw[0]=b.x+b.vx*tt-cx*0.12+(vk.yan<0?cz:-cz)*dS;vk.sw[1]=b.z+b.vz*tt-MOTOR_Z-cz*0.12+(vk.yan<0?-cx:cx)*dS;}
/* son adım: vuran ayak geri salınıma kalkar, destek ayağı basış yerine uzanır (yerdeyse ve basış yeri 0,12 m'den yakınsa yerinde kalır) */
function anmVkSonAdim(a,p,vur,tc,sx){
  const vk=a.vk,i=vk.ayak,j=1-i,T=a.T;
  vk.evre=2;vk.t=0;vk.dondur=true;vk.asagi=false;vk.u=0;
  for(let k=0;k<3;k++){vk.kp[k]=T[i*3+k];vk.kv[k]=0;vk.k0[k]=T[i*3+k];}
  anmVkBasisYeri(vk,tc);
  const w=anmVkDunya(a,T[j*3],T[j*3+2],sx),ex=w[0]-vk.sw[0],ez=w[1]-vk.sw[1];vk.s0[0]=w[0];vk.s0[1]=w[1];
  if(a.anc[j]&&ex*ex+ez*ez<0.0144){vk.sw[0]=w[0];vk.sw[1]=w[1];vk.sAd=1;}else vk.sAd=0;
}
/* adım döngüsüne dönüş: yere basan ayak (ya da ayaklar) dünyaya kilitlenir, döngünün evresi o ayağın basışının başına alınır;
   geçiş 0,16 sn'de son vuruş hedeflerinden döngünün hedeflerine iner */
function anmVkCikis(a,sx,basan){
  const vk=a.vk,T=vk.T;if(basan==null)basan=vk.yer[vk.ayak]?vk.ayak:1-vk.ayak;
  let u0=0.04-basan*0.5;u0-=Math.floor(u0);a.ph=u0*6.283185307179586;
  for(let i=0;i<2;i++){a.D[i*2]=a.D[i*2+1]=0;if(i===basan||vk.yer[i]){const w=anmVkDunya(a,T[i*3],T[i*3+2],sx);a.W[i*2]=w[0];a.W[i*2+1]=w[1];a.anc[i]=1;}else a.anc[i]=0;}
  vk.Te.set(T);vk.evre=5;vk.cikT=0;vk.dondur=false;vk.e=null;vk.ofs0=vk.ofs;
}
function anmVurusDurum(a,p,dt,al,sx){
  const vk=a.vk;vk.yEk=0;vk.dy=0;vk.lean=0;vk.wG=0;vk.wT=0;
  const e=p.eylem,vur=e&&e.ad==='vurus'?e:null;
  if(vur!==vk.e){
    if(vur){if(vk.evre>=2&&vk.evre<5)anmVkCikis(a,sx);anmVkBasla(a,p,vur);}
    else if(vk.evre===1)vk.evre=0;
    else if(vk.evre===2)anmVkCikis(a,sx);
    vk.e=vur;}
  else if(e&&!vur&&vk.evre>=3&&vk.evre<5)anmVkCikis(a,sx);   /* inerken başka eylem (kontrol, düşüş …) başladı */
  /* gövde vuruşa doğru öne kayar (en çok 0,15 m): motorun vuruş yeri gövdeyi topun 0,34 m gerisinde tutar; çizimde kalça destek ayağının
     üstüne gelir, vuran bacak temasta dikleşir */
  if(vk.ofs>0){a.x+=Math.cos(vk.kd)*vk.ofs;a.z+=Math.sin(vk.kd)*vk.ofs;}
  if(vk.evre===0){vk.ofs=0;return;}
  if(vk.evre===5){vk.cikT+=dt;vk.kw=Math.max(0,1-vk.cikT/0.16);vk.ofs=vk.ofs0*vk.kw;if(vk.kw<=0){vk.evre=0;vk.kw=0;vk.ofs=0;}vk.wT=vk.kw*0.4;return;}
  const i=vk.ayak,j=1-i,T=vk.T,S=vk.S,yG=ANM_VK_YG,OF=0.15;
  if(vk.evre===1){vk.t+=dt;const tc=anmVkKalan(vk,p,vur),tW=vk.tB+vk.hazEn;vk.tc=tc;
    vk.h=clamp((tW-tc)/(tW-vk.tB),0,1);vk.wG=0.4*vk.h;vk.kw=Math.max(0,vk.kw-dt/0.16);
    if(vur.faz!=='hazirlik'||tc<=vk.tB)anmVkSonAdim(a,p,vur,tc,sx);else return;}
  /* topun gövde çerçevesinde yeri (temas yeri bundan) */
  const B=anmVkTop(al),G=anmVkGovde(a,B[0],B[2],sx),bx=G[0],bz=G[1],by=Math.max(0,B[1]);
  if(vk.evre===2){
    vk.t+=dt;const tc=anmVkKalan(vk,p,vur);vk.tc=tc;
    if(vur.faz==='hazirlik'&&(tc>vk.tB+0.3||vk.t>0.7)){anmVkCikis(a,sx);return;}
    const temas=vur.faz==='takip';
    vk.ofs=Math.max(vk.ofs,OF*(temas?1:1-clamp(tc/vk.tB,0,1)));
    /* temas yeri topu izler; temas karesinde bir önceki karenin yeri kalır (hızlı oynatmada geri salınım görülmediyse şimdiki top) */
    if(!temas||vk.t<=dt*1.01)anmVkTemas(vk,bx,bz,by,vk.C);
    if(!vk.asagi&&tc>vk.tD&&!temas){
      /* geri salınım (T4-V): ayak son adımın başındaki yerinden tepeye (arkada ve yukarıda, diz ~90°) kalan süreye bağlı durumsuz eğriyle —
         her oynatma hızında aynı yol (eski kritik sönümlü yay 4×'te sınırda, 8×'te kararsızdı); tepeye varış temposu ve kol ağırlığı kimlikten */
      const g0=clamp((vk.tB-tc)/Math.max(0.05,vk.tB-vk.tD),0,1),g=Math.pow(g0*g0*(3-2*g0),vk.tempo),k0=vk.k0,kp=vk.kp;
      kp[0]=lerp(k0[0],vk.yan*0.13,g);kp[1]=lerp(k0[1],yG+0.08+0.26*S,g);kp[2]=lerp(k0[2],-(0.12+0.26*S),g);
      vk.wG=Math.min(1,(0.4+0.6*g)*vk.kol);}
    else{
      if(!vk.asagi){vk.asagi=true;vk.D0.set(vk.kp);vk.u=0;}
      vk.u=temas?1:Math.max(vk.u,vk.tD>0?1-tc/vk.tD:1);
      ANM_VK_L[0]=vk.yan*0.11;ANM_VK_L[1]=yG+0.06;ANM_VK_L[2]=-0.05;
      anmVkBez(vk.D0,ANM_VK_L,vk.C,Math.pow(vk.u,1.5),vk.kp);
      vk.wG=Math.min(1,0.4+0.6*vk.t/0.12)*(1-vk.u);vk.wT=vk.u;}
    /* destek ayağı: basış yerine uzanır, aşağı salınımın başında (temastan tD sn önce) basar ve dünyaya kilitlenir */
    let sxw=vk.sw[0],szw=vk.sw[1],sy=yG;
    if(vk.sAd<1){const kalan=tc-vk.tD,o0=vk.sw[0],o1=vk.sw[1];anmVkBasisYeri(vk,tc);
      const m=2.5*dt,dx=vk.sw[0]-o0,dz=vk.sw[1]-o1,dd=Math.sqrt(dx*dx+dz*dz);if(dd>m){vk.sw[0]=o0+dx*m/dd;vk.sw[1]=o1+dz*m/dd;}
      vk.sAd=kalan>dt&&!temas?Math.min(1,vk.sAd+(1-vk.sAd)*dt/kalan):1;
      const f=vk.sAd*vk.sAd*(3-2*vk.sAd);sxw=lerp(vk.s0[0],vk.sw[0],f);szw=lerp(vk.s0[1],vk.sw[1],f);sy=yG+0.08*Math.sin(Math.PI*vk.sAd);}
    const sg=anmVkGovde(a,sxw,szw,sx);T[j*3]=sg[0];T[j*3+1]=sy;T[j*3+2]=sg[1];vk.yer[j]=vk.sAd>=1?1:0;vk.yer[i]=0;
    for(let k=0;k<3;k++)T[i*3+k]=vk.kp[k];
    vk.kw=1-(1-vk.kw)*Math.exp(-dt/vk.tau);vk.dy=-0.025*S*Math.max(vk.wG,vk.u);
    if(temas){
      /* temas karesi (motor 'takip'e geçti): ayak topta; takip ve inişin hedefleri, sertlik ve sıçrama */
      /* motor stili temasta kesinleştirir (şutta sert/plase/aşırtma, volede vole): takip ve sıçrama yeni stilden; üst gövde pozları aşağı
         salınım başladıysa değişmez (tek karede poz atlamasın) */
      vk.stil=vur.stil||vk.stil;vk.g=vur.guc!=null?vur.guc:0.6;if(!vk.asagi)anmVkPoz(vk);
      /* kısa vuruş (T4-V): eylem ilk kez temas karesinde görüldüyse (hızlı oynatma) ayak topa ışınlanmaz; temas noktası ayağa doğru çekilir, takip kısa */
      vk.kisa=vk.t<=dt*1.01;if(vk.kisa)for(let k=0;k<3;k++)vk.C[k]=lerp(vk.kp[k],vk.C[k],0.6);
      const st=ANM_VK_STIL[vk.stil]||ANM_VK_STIL.ust,g=vk.g;
      vk.Tk=st.T*(0.6+0.6*g)*(vk.uzun?1.2:vk.uzunYer?1.1:1)*(vk.kisa?0.7:1);vk.sert=((vk.stil==='ust'||vk.stil==='yarimVole'||vk.stil==='vole')&&g>=0.6)||(vk.uzun&&g>=0.5);
      const C=vk.C,F=vk.F,Tk=vk.Tk,Tm=Math.min(Tk,1.25),ic=vk.stil==='ic',dis=vk.stil==='dis',as=vk.stil==='asirtma';
      F[0]=C[0]+(ic?-vk.yan*0.03:dis?vk.yan*0.12:-vk.yan*0.12*Tm);F[1]=yG+(as?0.1+0.2*Tm:ic?0.08+0.3*Tm:0.12+0.55*Tm);F[2]=C[2]+0.2+0.35*Tm;
      vk.tF=0.1+0.05*Tm;vk.tIn=0.1+0.05*Tm;
      if(vk.sert){vk.hopT=vk.tF+vk.tIn-0.04;vk.hopH=0.04+0.04*clamp((g-0.6)/0.4,0,1);}else{vk.hopT=0;vk.hopH=0;}
      vk.evre=3;vk.tT=0;vk.sBos=false;for(let k=0;k<3;k++)T[i*3+k]=C[k];vk.kp.set(C);vk.wT=1;vk.wG=0;}
  }
  else if(vk.evre===3||vk.evre===4){
    vk.tT+=dt;const C=vk.C,F=vk.F,Tm=Math.min(vk.Tk,1.25),eg=vk.stil==='ic'?0.06:0.15;
    if(vk.evre===3){const v=clamp(vk.tT/vk.tF,0,1),s=1-(1-v)*(1-v);
      ANM_VK_Q[0]=lerp(C[0],F[0],0.4);ANM_VK_Q[1]=lerp(C[1],F[1],0.35)+0.03;ANM_VK_Q[2]=lerp(C[2],F[2],0.7);
      anmVkBez(C,ANM_VK_Q,F,s,vk.kp);vk.wT=1;vk.lean=-eg*Tm*s;vk.ofs=OF;
      if(v>=1){vk.evre=4;vk.tL=0;const Ln=vk.Ln,hiz=Math.sqrt(a.wvx*a.wvx+a.wvz*a.wvz);Ln[0]=vk.yan*0.1;Ln[1]=yG;Ln[2]=0.1+0.15*Tm+clamp(hiz*0.07,0,0.3);}}
    else{vk.tL+=dt;const f=clamp(vk.tL/vk.tIn,0,1),sm=f*f*(3-2*f),Ln=vk.Ln;
      vk.kp[0]=lerp(F[0],Ln[0],sm);vk.kp[2]=lerp(F[2],Ln[2],sm);vk.kp[1]=lerp(F[1],Ln[1],f*f);vk.wT=1-0.6*f;vk.lean=-eg*Tm*(1-sm);vk.ofs=OF*(1-0.4*sm);
      if(f>=1){for(let k=0;k<3;k++)T[i*3+k]=vk.kp[k];vk.yer[i]=1;anmVkCikis(a,sx,i);return;}}
    for(let k=0;k<3;k++)T[i*3+k]=vk.kp[k];vk.yer[i]=0;
    /* destek ayağı: sert vuruşta temastan 0,04 sn sonra yerden kesilir (iniş sıçraması: vuran ayağa inilir); değilse kilitli kalır, gövdenin
       0,34 m gerisine düşerse kalkar */
    const sg=anmVkGovde(a,vk.sw[0],vk.sw[1],sx);
    if(!vk.sBos&&((vk.sert&&vk.tT>=0.04)||sg[1]<-0.34)){vk.sBos=true;vk.sb[0]=sg[0];vk.sb[1]=yG;vk.sb[2]=sg[1];}
    if(vk.sBos){const f=clamp((vk.tT-0.04)/(vk.hopT>0?vk.hopT:0.25),0,1);
      T[j*3]=vk.sb[0];T[j*3+1]=yG+0.07*Math.sin(Math.PI*f);T[j*3+2]=vk.sb[2]-0.1*f;vk.yer[j]=0;}
    else{T[j*3]=sg[0];T[j*3+1]=yG;T[j*3+2]=sg[1];vk.yer[j]=1;}
    if(vk.hopT>0&&vk.tT>=0.04){const f=(vk.tT-0.04)/vk.hopT;if(f<1)vk.yEk=4*vk.hopH*f*(1-f);}
    vk.kw=1-(1-vk.kw)*Math.exp(-dt/0.03);}
  /* kalça yüksekliği: yerdeki destek ayağına uzanma */
  vk.need=9;
  for(let k=0;k<2;k++)if(vk.yer[k]){const sd=k?1:-1,dx=T[k*3]-sd*0.1,dz=T[k*3+2],iv=Math.sqrt(Math.max(0.04,0.92*0.92-dx*dx-dz*dz))+T[k*3+1]-0.91;if(iv<vk.need)vk.need=iv;}
}

/* ---- 1c. hakem, yan hakem ve 4. hakem (A2b, 2026-10-08; gerçekçilik planı Ek G7). İşaretler motor olaylarından kurulan sırayla oynar ve
   olayla aynı karede başlar; motorun hakem eylemleri (duduk, yon, avantaj, kart, penaltiGoster, bayrak) değişmez, çizim düdüğü (olaysız
   gelenler: maç öncesi, devre ve maç sonu) ve kartı onlardan alır. Faulde düdük → serbest vuruşta kol atak yönüne (20° yukarı), penaltıda kol
   aşağı noktaya; avantajda iki kol öne; ofsaytta yan hakem bayrağı dik kaldırır, düdükten sonra oyuncunun uzaklığına göre 45° aşağı / yatay /
   45° yukarı gösterir, hakem düdük çalıp kolunu endirekt için başının üstünde tutar (top başka oyuncuya değene dek); kornerde hakem köşeyi,
   yan hakem bayrakla köşe bayrağını gösterir; kale vuruşunda ikisi kale alanını; taçta kendi çizgisindeki yan hakem bayrağı 45° yukarı atak
   yönüne kaldırır (öbür çizgide hakem kolla gösterir); golde hakem santrayı gösterir; değişiklikte kulübe tarafındaki yan hakem bayrağı iki
   eliyle başının üstünde tutar; kartta hakem oyuncuyu çağırır, kartı başının üstünde gösterir (ikinci sarıda önce sarı, sonra kırmızı:
   js/mac-sahnesi.js). Kol yönü gövde çerçevesinde: kol önce öne kalkar, sonra yana açılır (aL = −(π/2 + yükseklik), aLz = yön); gövde
   hedefe yarı yarıya döner, baş bakar. Yan hakemin bayrağı sahaya yakın eldedir, işaret öbür yana gerekiyorsa el değiştirir. ---- */
const ANM_HK=new Map(),ANM_HK_KANAL=['aL','aLy','aLz','eL','aR','aRy','aRz','eR','gy','by','hx'];
const ANM_HK_DUDUK={aL:-1.1,eL:-2.15,aLz:0.32,aLy:0.45,hx:-0.06},ANM_HK_SAAT={aR:-1.25,aRz:-0.3,aRy:0.3,eR:-1.5,hx:0.42};
function anmHk(r){let h=ANM_HK.get(r);if(!h){h={sira:[],cur:null,t:0,slot:0,P:[{},{}],olayT:-9,sonE:null,saatT:30,bayrakSag:false,isaretSag:false,basKare:-1};ANM_HK.set(r,h);}return h;}
/* işaret sırası: {tur, sure, hedef {x,z} (motor), yon (±1: atak yönü), theta (kol yüksekliği, rad), p (oyuncu)}; sifirla: öncekini keser */
function anmHkIsaret(r,liste,sifirla){if(!r)return;const h=anmHk(r);if(sifirla){h.sira.length=0;h.cur=null;}for(const s of liste)h.sira.push(s);h.olayT=mac.t||0;}
/* motor olayından işaretler (animasyonOlay'dan; olay motor adımının hemen ardından gelir, işaret aynı karede başlar) */
function anmHakemOlay(ad,v){
  const R=mac.refs;if(!R||!R.length||!v)return;
  const h0=R[0],Mz=typeof MZ!=='undefined'?MZ:0,yh=x=>x>0?R[1]:R[2],dir=t=>mac.dir?mac.dir[t]:1;
  if(ad==='faul'){const pen=!!v.penalti,du=mac.durus;
    anmHkIsaret(h0,[{tur:'duduk',sure:pen?0.7:0.45},pen&&du?{tur:'yon',sure:1.6,hedef:{x:du.x,z:du.z},theta:-0.5}:{tur:'yon',sure:1.3,yon:dir(v.takim),theta:0.35}],true);}
  else if(ad==='avantaj')anmHkIsaret(h0,[{tur:'avantaj',sure:1.4,yon:dir(v.takim)}],true);
  else if(ad==='ofsayt'&&v.p){const y=yh(v.p.x),uz=Math.abs(v.p.z-y.z);
    anmHkIsaret(y,[{tur:'bayrakDik',sure:0.6},{tur:'ofsaytYon',sure:1.8,hedef:{x:y.x,z:Mz},theta:uz<23?-0.7:uz<45?0:0.7}],true);
    anmHkIsaret(h0,[{tur:'duduk',sure:0.45},{tur:'endirekt',sure:14}],true);}
  else if(ad==='kart'&&v.p){if(Math.hypot(v.p.x-h0.x,v.p.z-h0.z)>3)anmHkIsaret(h0,[{tur:'cagir',sure:0.9,p:v.p}],true);}
  else if(ad==='goal')anmHkIsaret(h0,[{tur:'bekle',sure:0.8},{tur:'yon',sure:1.8,hedef:{x:0,z:Mz},theta:-0.15}],true);
  else if(ad==='korner'||ad==='kaleVurusu'){const k=ad==='korner';
    anmHkIsaret(h0,[{tur:'yon',sure:1.3,hedef:{x:v.x,z:v.z},theta:k?0.35:-0.3}],true);
    anmHkIsaret(yh(v.x),[{tur:k?'kornerBayrak':'kaleVurusuBayrak',sure:1.6,hedef:{x:v.x,z:v.z},theta:k?-0.65:-0.05}],true);}
  else if(ad==='tac'){const y=yh(v.x);
    if((v.z>Mz)===(y.z>Mz))anmHkIsaret(y,[{tur:'tacYon',sure:1.6,yon:dir(v.team),theta:0.75}],true);
    else anmHkIsaret(h0,[{tur:'yon',sure:1.2,yon:dir(v.team),theta:0.45}],true);}
  else if(ad==='duduk'){const h=anmHk(h0);if(!(h.cur&&h.cur.tur==='endirekt'))anmHkIsaret(h0,[{tur:'duduk',sure:0.5}],true);}
  else if(ad==='kickoff')anmHkIsaret(h0,[{tur:'duduk',sure:0.7}],true);
  else if(ad==='degisiklik')anmHkIsaret(R[2],[{tur:'degisiklik',sure:2.2}],true);
}
/* kol bir yöne (gövde çerçevesinde açı ψ, sola artı; yükseklik θ, yukarı artı) */
function anmKolYon(Q,sag,psi,th){const al=-(Math.PI/2+th);
  if(sag){Q.aL=al;Q.aLz=clamp(psi,-1.6,0.45);Q.aLy=0;Q.eL=-0.06;}else{Q.aR=al;Q.aRz=clamp(psi,-0.45,1.6);Q.aRy=0;Q.eR=-0.06;}}
/* hedefin gövde çerçevesindeki açısı (motor koordinatı → dünya) */
function anmHkAci(a,x,z){const G=anmVkGovde(a,x,z-MOTOR_Z,1);return Math.atan2(G[0],G[1]);}
function anmHkPoz(a,p,c,Q){
  for(const k of ANM_HK_KANAL)Q[k]=0;Q.eL=Q.eR=-0.25;Q.aLz=-0.06;Q.aRz=0.06;
  const tur=c.tur,yan=p.kind==='lin',h=anmHk(p);
  if(tur==='duduk'){Object.assign(Q,ANM_HK_DUDUK);return;}
  if(tur==='saat'){Object.assign(Q,ANM_HK_SAAT);return;}
  if(tur==='degisiklik'){Q.aL=Q.aR=-2.75;Q.eL=Q.eR=-0.95;Q.aLz=0.4;Q.aRz=-0.4;Q.hx=-0.1;return;}
  if(tur==='endirekt'||tur==='bayrakDik'){const sag=yan?h.bayrakSag:true;if(sag){Q.aL=-3.08;Q.aLz=-0.04;Q.eL=-0.03;}else{Q.aR=-3.08;Q.aRz=0.04;Q.eR=-0.03;}return;}
  let hx=null,hz=null;
  if(c.hedef){hx=c.hedef.x;hz=c.hedef.z;}else if(c.yon!=null){hx=p.x+20*c.yon;hz=p.z;}else if(c.p){hx=c.p.x;hz=c.p.z;}
  if(tur==='kart'){Q.aL=-2.95;Q.aLz=-0.12;Q.eL=-0.05;Q.hx=-0.12;if(hx!=null){const r=anmHkAci(a,hx,hz)-(a.P.hy||0);Q.by=clamp(r,-1.1,1.1)*0.8;}return;}
  if(hx==null)return;
  const psi=anmHkAci(a,hx,hz),gy=clamp(0.45*psi,-0.6,0.6),r=psi-gy-(a.P.hy||0),th=c.theta!=null?c.theta:0;
  Q.gy=gy;Q.by=clamp(r*0.7,-1.1,1.1);
  if(tur==='avantaj'){const t=anmZarf(h.t,c.sure,0.2,0.3),th2=-0.1-0.2*t;anmKolYon(Q,true,r,th2);anmKolYon(Q,false,r,th2);return;}
  /* kol: hedef sağdaysa sağ, soldaysa sol; yan hakem bayraklı eli kullanır (gerekirse el değiştirir) */
  let sag;if(yan){if(h.t<=1/30)h.bayrakSag=r<-0.3;sag=h.bayrakSag;}else{if(h.t<=1/30)h.isaretSag=r<0.15;sag=h.isaretSag;}
  anmKolYon(Q,sag,r,th);
}
/* yan hakemin bayrağı: sahaya yakın elde (koşarken sahanın tarafı; yön değişince el değiştirir), işarette işaret eden elde */
function anmBayrakSec(a,p,h){
  const b=a.bayrak;if(!b)return;
  if(!h.cur){const Mz=typeof MZ!=='undefined'?MZ:0,r=anmHkAci(a,p.x,Mz);if(r<-0.5)h.bayrakSag=true;else if(r>0.5)h.bayrakSag=false;}
  const el=h.bayrakSag?a.m.eL:a.m.eR;if(b.parent!==el)el.add(b);
}
function anmHakemAdim(a,p,dt){
  const h=anmHk(p),e=p.eylem,st=a.st,sp=a.sp,S=ANM_S;
  /* motorun eylemleri: kart her zaman; düdük olaysız geldiyse (maç öncesi, devre ve maç sonu) */
  if(e!==h.sonE){h.sonE=e;
    if(e&&e.ad==='kart'){const ks=p.kartSira;anmHkIsaret(p,[{tur:'kart',sure:e.sure||1.7,p:ks&&ks.p}],true);}
    else if(e&&e.ad==='duduk'&&(mac.t||0)-h.olayT>0.1)anmHkIsaret(p,[{tur:'duduk',sure:Math.min(e.sure||0.6,0.9)}],true);}
  if(h.cur){h.t+=dt;const c=h.cur;let bitti=h.t>=c.sure;
    if(c.tur==='endirekt'){const du=mac.durus,sur=(mac.phase==='durus'&&du&&du.endirekt)||!!(mac.ball&&mac.ball.endirekt);bitti=bitti||(h.t>1.2&&!sur);}
    if(bitti)h.cur=null;}
  if(!h.cur&&h.sira.length){h.cur=h.sira.shift();h.t=0;h.slot^=1;h.basKare=mac.kare;}   /* basKare: işaretin başladığı motor adımı (ölçüm) */
  /* orta hakem ölü topta arada saatine bakar (kimliğin aralığıyla) */
  if(p.kind==='ref'&&!h.cur&&(mac.phase==='durus'||mac.phase==='kickoff')&&(p.spd||0)<0.6){h.saatT-=dt;
    if(h.saatT<=0){const K=a.kim||anmKimlik(a,p);h.saatT=22+18*h2(((mac.t||0)*7)|0,(K.faz*100)|0);h.cur={tur:'saat',sure:1.3};h.t=0;h.slot^=1;}}
  if(h.cur){const c=h.cur,Q=h.P[h.slot];anmHkPoz(a,p,c,Q);
    const g=c.tur==='bekle'?0:anmZarf(h.t,c.sure,c.tur==='duduk'?0.08:0.14,c.tur==='duduk'?0.12:0.22),k=h.slot?S.hkB:S.hkA;st[k]=g;sp[k]=Q;}
  if(p.kind==='lin')anmBayrakSec(a,p,h);
}

/* ---- 1d. kaleci set duruşu ve split-step (A2b, Ek G6): rakibin şut/orta/korner/serbest vuruşu temasa 0,32 sn kala kaleci küçük bir sıçrama
   (split-step, ~7 cm) yapar, şutçunun destek ayağı basarken (temastan ~0,07 sn önce) set duruşuna iner: ayaklar geniş, dizler bükük, göğüs
   dizlerin üstünde, eller önde. Vuruş bitene (+0,5 sn) ya da kaleci bir eyleme (dalış, tutuş) geçene dek tutar. Motor yalnız okunur. ---- */
const ANM_KS_TMP={kd:0};
function anmKaleciSet(a,p,dt){
  const ks=a.ks;if(p.eylem||!mac.players){ks.evre=0;return 0;}
  let k=null,e=null;
  for(const q of mac.players){if(q.team===p.team||!q.oyunda)continue;const qe=q.eylem;
    if(qe&&qe.ad==='vurus'){const tu=(qe.sec||{}).tur;if(tu==='sut'||tu==='orta'||tu==='korner'||tu==='serbest'){k=q;e=qe;break;}}}
  if(k&&ks.evre===0&&e!==ks.e){const tc=anmVkKalan(ANM_KS_TMP,k,e),d=Math.sqrt((k.x-p.x)*(k.x-p.x)+(k.z-p.z)*(k.z-p.z));
    if(tc<=0.32&&d<42){ks.evre=1;ks.t=0;ks.hopT=clamp(tc-0.07,0.1,0.24);ks.e=e;}}
  if(ks.evre===1){ks.t+=dt;const f=ks.t/ks.hopT;if(f<1){a.yEk=Math.max(a.yEk,4*0.07*f*(1-f));return clamp(f,0,1);}ks.evre=2;ks.t=0;}
  if(ks.evre===2){ks.t+=dt;if((!k||k.eylem!==ks.e)&&ks.t>0.5||ks.t>2.5){ks.evre=0;return 0;}return 1;}
  return 0;
}
/* ---- 1e. baraj (A2b, Ek G5): duran topta barajdakiler (motor: durus.barajdakiler) elleriyle korunur; vuranın temasından 0,06 sn önce
   sıçrar (0,3–0,4 m; havada ~0,5 sn, dizler toplanır, kimi başını çevirir), iner. Motorun kendi sıçraması (p.zipla) varsa çizim sıçratmaz. ---- */
const ANM_BARAJ={liste:null,kullanan:null,t:-9};
function anmBaraj(a,p,dt){
  const du=mac.durus,mt=mac.t||0;
  if(du&&du.barajdakiler){ANM_BARAJ.liste=du.barajdakiler;ANM_BARAJ.kullanan=du.kullanan;ANM_BARAJ.t=mt;}
  const B=ANM_BARAJ,bj=a.bj,uye=!!B.liste&&mt-B.t<2.5&&B.liste.includes(p);
  if(!uye&&bj.t<0)return 0;
  const k=B.kullanan,e=k&&k.eylem;
  if(uye&&bj.t<0&&e&&e.ad==='vurus'&&e!==bj.e&&!p.zipla&&(e.faz==='takip'||(e.faz==='geri'&&(e.geri||0.17)-(e.ft||0)<=0.06))){
    const K=a.kim||anmKimlik(a,p);bj.e=e;bj.t=0;bj.h=0.3+0.1*h2((p.n|0)+7,(p.team|0)+3);bj.T=2*Math.sqrt(2*bj.h/9.81);
    bj.bas=h2((p.n|0)*5+1,(p.team|0)+11)<0.4;bj.basSol=K.faz>3.14;}
  if(bj.t>=0){bj.t+=dt;const f=bj.t/bj.T;if(f<1){if(!p.zipla)a.yEk=Math.max(a.yEk,4*bj.h*f*(1-f));return 2;}if(bj.t<bj.T+0.2)return 1;bj.t=-1;return 0;}
  return uye&&(mac.phase==='durus'||(e&&e.ad==='vurus'))?1:0;
}
/* ---- 1f. ikinci top (A2b, Ek G3): havadan inen top 0,4–1,5 sn içinde oyuncunun 7 m yakınına düşecekse (oyuncu yavaşsa) hazır duruş ---- */
function anmIkinciTop(p,b){
  if(b.y<1.2||b.vy>0||b.sahip||b.tasiyan)return false;
  const v=Math.sqrt((p.vx||0)*(p.vx||0)+(p.vz||0)*(p.vz||0));if(v>2.5)return false;
  const t=(b.vy+Math.sqrt(b.vy*b.vy+2*9.81*b.y))/9.81;if(t<0.4||t>1.5)return false;
  const x=b.x+b.vx*t,z=b.z+b.vz*t;return (x-p.x)*(x-p.x)+(z-p.z)*(z-p.z)<49;
}

/* ---- 1g. kenar bekleyişleri (A2b, Ek G0.7 ve G7): kulübede oturanlar öne eğik (dirsekler dizlerde) ya da geriye yaslanır, 18–30 sn'de bir
   değişir; teknik direktör ayaktayken eller belde bekler, arada işaret eder ya da eli ağzında bağırır, takımı aleyhine faul ve kartta itiraz
   eder (motor olayından, 1,8 sn); top toplayıcı boşta topu kucağında çömelir (kimliğine göre). Seçimler kimlikten ve zamandan (rastlantısız). ---- */
const ANM_KENAR={itiraz:[-9,-9],n:0},ANM_TOPCU=new Map();
function anmKulubeOturus(a,p,dts,w){
  const K=a.kim||anmKimlik(a,p),bol=Math.floor((zaman+K.faz*5)/(18+12*K.bekle)),v=h2(bol,((K.faz*100)|0)+3);
  const wO=yumusak(a,'oturOne',v<0.45?1:0,1.5,dts),wA=yumusak(a,'oturArka',v>0.75?1:0,1.5,dts);
  if(wO>0.01)anmKar(a,ANM_POZ.oturOne,wO*w);if(wA>0.01)anmKar(a,ANM_POZ.oturArka,wA*w);}
function anmTeknikDirektor(a,p,dts,sv){
  const K=a.kim||anmKimlik(a,p),oyun=mac.phase==='play'||mac.phase==='durus',it=oyun&&ANM_KENAR.itiraz[p.team]>zaman;
  const per=9+6*K.bekle,tb=(zaman+K.faz*4)%per,v=h2(Math.floor((zaman+K.faz*4)/per),((K.faz*100)|0)+17);
  const isaret=oyun&&!it&&v<0.25&&tb<1.8,bagir=oyun&&!it&&v>=0.25&&v<0.42&&tb<1.4,ayakta=!p.oturuyor&&sv<0.5;
  anmKar(a,ANM_POZ.belde,yumusak(a,'tdBelde',ayakta&&oyun&&!isaret&&!bagir&&!it?0.85:0,2,dts));
  anmKar(a,POSE.isaret,yumusak(a,'isaret',isaret?1:0,4,dts));
  anmKar(a,ANM_POZ.jestCagir,yumusak(a,'tdBagir',bagir?1:0,5,dts));
  const wi=yumusak(a,'tdItiraz',it?1:0,6,dts);if(wi>0.01){anmKar(a,ANM_POZ.jestItiraz,wi);const q=Math.sin(zaman*6+a.faz0)*0.15*wi;a.P.aLz-=q;a.P.aRz+=q;}}
function anmKenarOlay(ad,v){
  if(ad==='faul'&&!v.avantajdan&&v.aleyhe!=null){ANM_KENAR.n++;if(v.kart||h2(ANM_KENAR.n,7)<0.55)ANM_KENAR.itiraz[v.aleyhe]=zaman+1.8;}
  else if(ad==='kart'&&v.p)ANM_KENAR.itiraz[v.p.team]=zaman+1.8;
}

/* ---- 1h. çalım, aldatılan savunmacı ve top saklama (T4g, 2026-10-09; gerçekçilik planı Ek G2 “Taşıma ve çalım”, “Top saklama”). Motor yalnız
   okunur: p.calim (faz 1 hazırlık: ft, sure, hareket, taraf; itiş: sonDokunus.calim; faz 2 kaçış), p.yutma {yon, t, sure, siddet, mek}, p.tavir
   'koru'. Hazırlıkta adımlar kısa ve sık, diz bükük. Aldatmada (makas, gövde çalımı) omuz ve kalça aldatma yanına düşer; makasta aldatma
   yanındaki ayak topun önünden dışa süpürülür ve geniş basar (salınım yolu anmYuruyus'ta), gövde çalımında aynı yana geniş bir aldatma adımı.
   Şut çalımında vuruş ayağı geri ve yukarı kalkar, karşı kol açılır (gerilme yayı), vuruş gelmez. Rulette gövde iki yarım dönüşle 360° döner (kök
   yönüne ek, en çok 9,7 rad/sn; itiş yanına), kollar açık. Dur-kalkta taban topun üstünde; tempoda duraksama; kesmede gövde kesme yanına yatar.
   İtişi (sonDokunus.calim) aldatmada itiş yanındaki ayak (dış ayak), şut çalımında vuruş ayağı yapar; patlama: gövde öne ve itiş yanına, kollar
   pompalar. Aldatılan savunmacı: aldatmada ağırlık ve kalça yanılgı yanına (geniş ve alçak duruş, kollar açık), tempoda yakalanmış dik duruş,
   kesmede ataletle fren. Top saklama: gövde yan, yakın kol rakibe doğru geride bükük, uzak kol dengede, alçak ve geniş duruş; rakibin yanı her
   karede (0,12 sn histerezisle), baş kimliğin aralığıyla rakibe döner (omuz üstünden). Seçimler rastlantısız. Taraf: motorda +1 itiş sağa
   (yon + 90°); gövde çerçevesinde x sola artıdır (aldatma yanının x işareti = taraf). ---- */
const ANM_CK={makas:'aldat',govde:'aldat',sutCalim:'sut',rulet:'rulet',durKalk:'dur',hiz:'tempo',atKos:'yaris',sagSol:'yaris',kesme:'kesme',sirtDon:'kesme'};
/* hazırlıkta yürüyüş: diz bükme (m), duruş genişliği (m), adım boyu çarpanı (kısa ve sık adım) */
const ANM_CK_YUR={aldat:[0.05,0.04,0.6],sut:[0.03,0,0.7],rulet:[0.08,0.08,0.55],dur:[0.04,0.02,0.6],tempo:[0.02,0,0.75],kesme:[0.09,0.05,0.65],yaris:[0,0,0.9]};
const anmYumus=x=>{x=x<0?0:x>1?1:x;return x*x*(3-2*x);};
function anmCkYeni(){return{e:null,mek:'',evre:0,f:0,taraf:1,PA:null,PB:null,itT:-1,itSon:undefined,itAyak:-1,itYuzey:'',basKare:-1,itKare:-1,
  sIdx:-1,sX:1,sA:0,sL:0,sH:0,sZ:0,sZ2:0,sW:0,sAcik:false,sAktif:false,sG0:0,sSon:0,sBitti:false,yaw:0,yawD:0,
  yE:null,yP:null,yS:1,yW:0,korSag:true,korT:0,korO:null,korBak:false};}
/* yeni çalım denemesi (motor hazırlığa geçti): pozlar, salınan ayak, itiş ayağı, rulet dönüşü */
function anmCkBasla(a,p,C){
  const ck=a.ck,mek=ANM_CK[C.hareket]||'aldat',tr=C.taraf>0?1:-1,sagIt=tr>0,P=ANM_POZ;
  ck.e=C;ck.mek=mek;ck.evre=1;ck.f=0;ck.taraf=tr;ck.basKare=mac.kare!=null?mac.kare:-1;ck.itAyak=-1;ck.itYuzey='';
  ck.sIdx=-1;ck.sAktif=false;ck.sBitti=false;ck.sAcik=false;ck.yawD=0;
  /* pozlar sağ yan içindir: aldatma yanı −taraf (motor gövdeyi −taraf·l'ye kaydırır), itiş yanı taraf */
  ck.PB=sagIt?P.ckIt:aynala(P.ckIt);
  if(mek==='aldat')ck.PA=sagIt?aynala(P.ckAldat):P.ckAldat;
  else if(mek==='sut')ck.PA=p.ayak==='sol'?aynala(ANM_VK_POZ.ustG):ANM_VK_POZ.ustG;
  else if(mek==='kesme')ck.PA=sagIt?P.ckKesme:aynala(P.ckKesme);
  else if(mek==='rulet')ck.PA=P.ckRulet;
  else if(mek==='dur'){const b=mac.ball;ck.PA=anmSagda(p,b.x,b.z)?P.bekle:aynala(P.bekle);}
  else if(mek==='tempo')ck.PA=P.ckTempo;
  else ck.PA=null;
  /* salınan ayak: makasta aldatma yanındaki ayak dışa süpürülür (0,26 m) ve geniş basar (0,16 m), 0,12 m yüksek ve öne; gövde çalımında aynı yana
     geniş adım (0,18 m); şut çalımında vuruş ayağı geri (0,55·(1 − g)) ve yukarı (0,2 m), hafif içe. İtişi aldatmada öbür ayak dışıyla, şut çalımında
     vuruş ayağı yapar (itiş vuruş ayağının yanına ise dış, değilse iç) */
  if(mek==='aldat'){const al=tr>0?1:0;ck.sIdx=al;ck.sX=tr;
    if(C.hareket==='makas'){ck.sA=0.26;ck.sL=0.16;ck.sH=0.12;ck.sZ=0.12;ck.sZ2=0;}else{ck.sA=0.06;ck.sL=0.18;ck.sH=0;ck.sZ=0.04;ck.sZ2=0;}
    ck.itAyak=1-al;ck.itYuzey='dis';}
  else if(mek==='sut'){const i=p.ayak==='sol'?1:0;ck.sIdx=i;ck.sX=i?1:-1;ck.sA=-0.06;ck.sL=0;ck.sH=0.2;ck.sZ=0.05;ck.sZ2=-0.55;
    ck.itAyak=i;ck.itYuzey=(i===0)===sagIt?'dis':'ic';}
  /* adım evresi: salınan ayağın kalkışı yakınsa öne alınır (en çok 0,9 rad, anmDokunus gibi); ayak salınımın başındaysa hemen işaretlenir */
  if(ck.sIdx>=0){ck.sAcik=true;const bt=a.beta;let u=a.ph/6.283185307179586+ck.sIdx*0.5;u-=Math.floor(u);let d=bt+0.01-u;d-=Math.round(d);
    if(!a.anc[ck.sIdx]&&u>=bt&&(u-bt)/(1-bt)<0.3){ck.sAktif=true;ck.sG0=(u-bt)/(1-bt);}
    else if(d>-0.05&&d<0.3)a.phItme=clamp(d*6.283185307179586,-0.3,0.9);}
  /* rulet: itiş yanına döner (motorda yon artışı sağa; yaw = π/2 − yon) */
  if(mek==='rulet')ck.yawD=-tr;
}
/* her kare (anmPozBasla'da, tavırdan önce): çalımın evresi, yuvalar (ckA hazırlık, ckB itiş ve patlama, yutma), salınım ağırlığı, rulet dönüşü */
function anmCalimDurum(a,p,dt){
  const ck=a.ck,st=a.st,sp=a.sp,S=ANM_S,C=p.calim,e=p.eylem,mt=mac.t!=null?mac.t:null;
  if(C&&C!==ck.e&&C.faz===1&&!C.bitti&&!e)anmCkBasla(a,p,C);
  if(ck.evre===1&&(!C||ck.e!==C||C.bitti||C.faz>=2||e)){ck.evre=0;ck.sAcik=false;}
  let wA=0,wB=0;const mek=ck.mek;
  if(ck.evre===1){const f=clamp(C.ft/Math.max(0.05,C.sure),0,1);ck.f=f;
    if(mek==='aldat'){wA=anmYumus(f/0.2)*(1-anmYumus((f-0.55)/0.35));wB=0.55*anmYumus((f-0.5)/0.5);if(f>0.6)ck.sAcik=false;}
    else if(mek==='sut'){wA=0.9*anmYumus(f/0.45)*(1-anmYumus((f-0.6)/0.3));wB=0.5*anmYumus((f-0.6)/0.4);if(f>0.5)ck.sAcik=false;}
    else if(mek==='rulet'){wA=anmYumus(f/0.15)*(1-anmYumus((f-0.85)/0.15));wB=0.4*anmYumus((f-0.75)/0.25);}
    else if(mek==='dur'){wA=0.85*anmYumus(f/0.25)*(1-anmYumus((f-0.8)/0.2));wB=0.6*anmYumus((f-0.75)/0.25);}
    else if(mek==='tempo'){wA=0.8*anmYumus(f/0.3)*(1-anmYumus((f-0.7)/0.3));wB=0.6*anmYumus((f-0.65)/0.35);}
    else if(mek==='kesme'){wA=0.9*anmYumus(f/0.3);wB=0.5*anmYumus((f-0.6)/0.4);}
    else wB=0.6*anmYumus(f/0.8);}
  /* itiş (motorun itiş dokunuşu, sonDokunus.calim): patlama 0,1 sn tam, 0,3 sn'de söner. Hazırlığı görülmeyen denemede (hız katları) yan şimdi */
  const sd=p.sonDokunus;
  if(sd&&sd.calim&&sd.t!==ck.itSon){ck.itSon=sd.t;
    if(mt===null||mt-sd.t<0.1){if(C&&C!==ck.e){ck.e=C;ck.mek=ANM_CK[C.hareket]||'aldat';ck.taraf=C.taraf>0?1:-1;ck.PB=ck.taraf>0?ANM_POZ.ckIt:aynala(ANM_POZ.ckIt);ck.itAyak=-1;}
      ck.itT=0;ck.itKare=mac.kare!=null?mac.kare:-1;ck.evre=0;ck.sAcik=false;}}
  if(ck.itT>=0){ck.itT+=dt;const ti=ck.itT;wB=Math.max(wB,ti<0.1?1:1-anmYumus((ti-0.1)/0.3));wA=0;if(ti>0.4)ck.itT=-1;}
  if(wA>0.001&&ck.PA){st[S.ckA]=wA;sp[S.ckA]=ck.PA;}
  if(wB>0.001&&ck.PB){st[S.ckB]=wB*(ck.mek==='yaris'||ck.mek==='tempo'||ck.mek==='dur'?1:0.85);sp[S.ckB]=ck.PB;}
  /* salınım ağırlığı: hazırlıkta ve itişten sonra 1, yoksa söner (yarıda kalan salınımda ayak yola döner) */
  if(dt>0)ck.sW+=((ck.evre===1||ck.itT>=0?1:0)-ck.sW)*Math.min(1,dt*12);
  if(!ck.sAktif&&ck.evre!==1&&ck.itT<0)ck.sIdx=-1;
  /* rulet: kök yönüne ek; dönüş hızı yamuk (0,12 sn'lik ivmelenme ve yavaşlama, tepe ≤ 9,7 rad/sn); kesilirse en yakın tam tura (0 ya da ±2π)
     9 rad/sn ile (aktorGuncelle yaw hedefine ekler) */
  if(mek==='rulet'&&ck.evre===1){const T=Math.max(0.3,0.96*C.sure),r=0.12,v=6.283185307179586/(T-r),t=clamp(C.ft-0.02*C.sure,0,T);
    ck.yaw=ck.yawD*(t<r?v*t*t/(2*r):t<T-r?v*(t-r/2):6.283185307179586-v*(T-t)*(T-t)/(2*r));}
  else if(ck.yaw!==0&&dt>0){const h=Math.abs(ck.yaw)>Math.PI?Math.sign(ck.yaw)*6.283185307179586:0,m=9*dt,d=h-ck.yaw;
    ck.yaw=Math.abs(d)<=m?0:ck.yaw+Math.sign(d)*m;}
  /* aldatılan savunmacı: yan bir kez (yanılgının yönü gövdeye göre); zarf 0,08 sn giriş, 0,18 sn çıkış; aldatmada şiddetle */
  const Y=p.yutma;
  if(Y&&Y!==ck.yE){ck.yE=Y;const sag=Math.sin(anmAci(Y.yon-p.yon))>0;
    ck.yP=Y.mek==='aldat'?(sag?ANM_POZ.ytAldat:aynala(ANM_POZ.ytAldat)):Y.mek==='kesme'?ANM_POZ.ytKay:ANM_POZ.ytDur;ck.yS=Y.mek==='aldat'?0.6+0.4*clamp(Y.siddet,0,1):0.8;}
  ck.yW=0;
  if(Y&&!e&&mt!==null){ck.yW=anmZarf(mt-Y.t,Y.sure,0.08,0.18)*ck.yS;if(ck.yW>0.001){st[S.yutma]=ck.yW;sp[S.yutma]=ck.yP;}}
}
/* top saklama: en yakın rakip (3 m içinde); yanı 0,12 sn histerezisle (gövdeye göre 0,2 m'den çok öbür yandaysa); baş kimliğin aralığıyla
   (1,3–2,0 sn) 0,6 sn rakibe döner */
function anmKorRakip(p){let o=null,ed=9;const R=mac.teams&&mac.teams[1-p.team];if(R)for(const q of R){if(!q.oyunda)continue;const d=(q.x-p.x)*(q.x-p.x)+(q.z-p.z)*(q.z-p.z);if(d<ed){ed=d;o=q;}}return o;}
function anmKoru(a,p,dt){
  const ck=a.ck,o=anmKorRakip(p);ck.korO=o;
  if(o){const yan=-(o.x-p.x)*Math.sin(p.yon)+(o.z-p.z)*Math.cos(p.yon),sg=yan>0;
    if(sg!==ck.korSag&&Math.abs(yan)>0.2){ck.korT+=dt;if(ck.korT>=0.12){ck.korSag=sg;ck.korT=0;}}else ck.korT=0;}
  const K=a.kim||anmKimlik(a,p),per=1.3+0.7*K.bekle;
  ck.korBak=!!o&&(zaman+K.faz)%per<0.6;
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
  if(ad==='tekme')anmVurusSec(a,p,e,ad);   /* maç öncesi ısınma vuruşu; maçtaki vuruş A2b'den beri vuruş katmanında (anmVurusDurum) */
  else if(ad==='kontrol'){
    /* A2b: dokunan ayak motorun son dokunuşundan (sonDokunus.ayak), yoksa topun yanından; yüzeye göre temas ve yumuşatma pozları */
    const sd=p.sonDokunus,sag=sd&&sd.tur==='kontrol'&&sd.ayak?sd.ayak!=='sol':anmSagda(p,b.x,b.z),y=e.yuzey;
    const P0=y==='uyluk'?ANM_POZ.kontrolUyluk:y==='dis'?ANM_POZ.kDis:y==='taban'?ANM_POZ.kTaban:ANM_POZ.kIc,P1=y==='uyluk'?ANM_POZ.kUyluk2:y==='dis'?ANM_POZ.kDis2:y==='taban'?ANM_POZ.kTaban2:ANM_POZ.kIc2;
    a.kP=sag?P0:aynala(P0);a.kP2=sag?P1:aynala(P1);}
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
  if(a.dokT>=0){a.dokT+=dt;if(a.dokT>a.dokS)a.dokT=-1;}
  if(a.phItme&&dt>0){const d=a.phItme*Math.min(1,dt*10);a.ph+=d;a.phItme-=d;if(Math.abs(a.phItme)<0.005)a.phItme=0;}
  if(a.kucuk||!p.oyunda)return;
  const sd=p.sonDokunus,b=mac.ball;let yeni=false,ayak=-1;
  if(sd){if(sd.t!==a.dokSon){yeni=a.dokSon!==undefined;a.dokSon=sd.t;ayak=sd.ayak==='sol'?1:sd.ayak==='sag'?0:-1;}}
  else if(b.sonDokunan===p&&b.surum!==a.dokSurum){a.dokSurum=b.surum;yeni=b.sahip===p&&b.y<0.4;}
  if(!yeni||e)return;
  /* T4g: çalım hazırlığındaki kısa kontrol dokunuşları çizilmez ve adım evresini itmez (ayaklar çalım katmanında); itişi çalım katmanının
     seçtiği ayak yapar (aldatmada dış ayak, şut çalımında vuruş ayağı), poz yüzeyden: dış, iç, üst (uzun itiş) */
  const ck=a.ck,cal=!!(sd&&sd.calim);if(!cal&&ck&&ck.evre===1)return;
  let yz=sd?sd.yuzey:null;if(cal&&ck&&ck.itAyak>=0){ayak=ck.itAyak;yz=ck.itYuzey;}
  if(ayak<0)ayak=anmSagda(p,b.x,b.z)?0:1;
  const bt=a.beta,hu=bt+0.72*(1-bt);let u=a.ph/6.283185307179586+ayak*0.5;u-=Math.floor(u);let d=hu-u;d-=Math.round(d);
  /* T2: dönüş dokunuşu (sözleşme: sonDokunus.donus) gövdeyi dönüşe yatırır, ayak topu içe/dışa çeker; T4g: taban dokunuşunda ayak topun üstünde */
  const P0=cal?(yz==='dis'?ANM_POZ.dokunDis:yz==='ust'?ANM_POZ.dokunUzun:ANM_POZ.dokunIc):sd&&sd.donus?ANM_POZ.dokunDon:yz==='taban'?ANM_POZ.dokunTaban:ANM_POZ.dokun;
  /* T4h: top saklamada (motor saniyede ~4,5 kez tabanla dokunur) dokunuş adım evresini itmez ve taban pozu hafiftir (eskiden yerdeki ayak temasın %55'inde kayıyordu) */
  const koru=p.tavir==='koru';a.dokKoru=koru;
  if(!koru)a.phItme=clamp(d*6.283185307179586,-0.9,0.9);a.dokT=0;a.dokP=ayak?aynala(P0):P0;a.dokDon=!!(sd&&sd.donus);a.dokCal=cal;a.dokS=cal?0.26:ANM.dokunus;
}

/* ---- 2. eylem yuvalarının hedef ağırlıkları ---- */
function anmEylemler(a,p,dt){
  const e=p.eylem,ad=e?e.ad:'',b=mac.ball,st=a.st,sp=a.sp,S=ANM_S,ph=mac.phase;
  if(e!==a.eyl){a.eyl=e;a.eylAd=ad;if(e)anmBasla(a,p,e,ad);}
  anmDokunus(a,p,e,dt);
  if(a.dokT>=0){st[S.dokun]=(a.dokCal?0.8:a.dokKoru?0.3:a.dokDon?0.75:0.55)*tepe(a.dokT,a.dokS);sp[S.dokun]=a.dokP;}
  /* A2b: vuruşun üst gövdesi vuruş katmanından (geri salınım ve takip ağırlıkları; iniş ve çıkış motorun eylemi bittikten sonra da sürer) */
  const vk=a.vk;
  if(vk&&vk.evre>0&&(ad==='vurus'||!ad)){if(vk.wG>0){st[S.vG]=vk.wG;sp[S.vG]=vk.pG;}if(vk.wT>0){st[S.vT]=vk.wT;sp[S.vT]=vk.pT;}}
  if(ad==='tekme'){const f=e.t/e.sure;if(f<0.33)st[S.vG]=f/0.33;else{const g=(f-0.33)/0.67;st[S.vG]=Math.max(0,1-g*3);st[S.vT]=g<0.3?g/0.3:1-(g-0.3)/0.7;}sp[S.vG]=a.vG;sp[S.vT]=a.vT;}
  /* A2b dağıtım (Ek G6): top eylemin ilk karesinde çıkar — degajda vuran bacak topun altından yükselir, kollar açılır, gövde geride, küçük
     sıçrama; elle atışta bırakış pozundan takibe (omuzdan: kol baştan öne iner; yuvarlama: çömelip kol yerden öne) */
  else if(ad==='degaj'){const t=e.t,s=e.sure||0.7,sol=p.ayak==='sol';
    if(a.dg.e!==e){a.dg.e=e;a.dg.P0=sol?aynala(ANM_POZ.degajTemas):ANM_POZ.degajTemas;a.dg.P1=sol?aynala(ANM_POZ.degajTakip):ANM_POZ.degajTakip;}
    const c=clamp((t-0.03)/0.2,0,1),son=clamp((s-t)/0.28,0,1),f=clamp((t-0.03)/0.3,0,1);
    st[S.degaj]=Math.min(1,t/0.04)*(1-c)*son;sp[S.degaj]=a.dg.P0;st[S.degajT]=c*son;sp[S.degajT]=a.dg.P1;
    if(f>0&&f<1)a.yEk=Math.max(a.yEk,0.06*Math.sin(Math.PI*f));}
  /* A2b: temas pozu eylemin ilk karesinde (temas anı) yükselir, sürenin ortasına doğru yumuşatma pozuna geçer, sonda biter */
  else if(ad==='kontrol'){const s=e.sure||0.22,z=anmZarf(e.t,s,0.04,Math.min(0.12,s*0.45))*0.9,c=clamp(e.t/(s*0.6),0,1);
    st[S.kontrol]=z*(1-c);sp[S.kontrol]=a.kP;st[S.kontrol2]=z*c;sp[S.kontrol2]=a.kP2||a.kP;}
  else if(ad==='gogus'){const s=e.sure||0.4,z=anmZarf(e.t,s,0.05,0.12),c=clamp((e.t-s*0.35)/(s*0.4),0,1);
    st[S.gogus]=z*(1-c);sp[S.gogus]=ANM_POZ.gogusAl;st[S.gogus2]=z*c;sp[S.gogus2]=ANM_POZ.gogusBirak;}
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
  else if(ad==='elleAtis'){const t=e.t,s=e.sure||0.6,sol=p.ayak==='sol',yv=e.stil==='yuvarla';
    if(a.dg.e!==e){a.dg.e=e;const A=yv?ANM_POZ.yuvarlaAt:ANM_POZ.omuzAt,B=yv?ANM_POZ.yuvarlaTakip:ANM_POZ.omuzTakip;a.dg.P0=sol?aynala(A):A;a.dg.P1=sol?aynala(B):B;}
    const c=clamp((t-0.02)/0.18,0,1),son=clamp((s-t)/0.25,0,1);
    st[S.elleAtis]=Math.min(1,t/0.04)*(1-c)*son;sp[S.elleAtis]=a.dg.P0;st[S.elleAtisT]=c*son;sp[S.elleAtisT]=a.dg.P1;}
  else if(ad==='dusus'){st[S.dusus]=1;sp[S.dusus]=a.dP;}
  else if(ad==='yerde'){st[S.yerde]=1;sp[S.yerde]=a.yP;}
  else if(ad==='kalkis'){const f=clamp(e.t/(e.sure||0.6),0,1);st[S.yerde]=Math.max(0,1-f/0.35);st[S.ucusN]=Math.max(0,1-f/0.35);
    if(a.lieTur==='kayma')st[S.kayma]=Math.max(0,1-f/0.45);st[S.kalk]=f<0.35?f/0.35:Math.max(0,1-(f-0.35)/0.6);sp[S.kalk]=a.kkP;}
  else if(ad==='itiraz'){st[S.itiraz]=Math.min(1,e.t*4)*Math.min(1,(e.sure-e.t)*4);sp[S.itiraz]=POSE.itiraz;}
  /* taç: top başın üstünde; atışta kollar öne */
  else if(ad==='tac'){st[S.tac]=1;sp[S.tac]=ANM_POZ.tac;sp[S.tacAt]=ANM_POZ.tacAt;if(e.faz!=='tut'){const f=e.ft/0.34;st[S.tacAt]=f<1?f*f:Math.max(0,1-(e.ft-0.34)/0.3);}}
  else if(ad==='atis'){const f=e.t/e.sure;st[S.tac]=f<0.4?f/0.4:0;st[S.tacAt]=f>=0.4?1-(f-0.4)/0.6:0;sp[S.tac]=ANM_POZ.tac;sp[S.tacAt]=ANM_POZ.tacAt;}
  /* A2a jest katmanı: p.jest {tur, t, sure, kol:'sol'|'sag', hedef:{x,z}} (yazan motor işi T7/T10); giriş 0,15 sn, çıkış 0,25 sn */
  const j=p.jest;if(j&&ANM_JEST[j.tur]){const P0=j.tur==='alkis'?POSE.alkis:ANM_POZ[ANM_JEST[j.tur]];st[S.jest]=anmZarf(j.t||0,j.sure||1.2,0.15,0.25);sp[S.jest]=j.kol==='sol'?aynala(P0):P0;}
  /* top elde: kaleci tutuşu, duran topu taşıyan oyuncu */
  if(b.tasiyan===p&&ad!=='tac'){st[S.elde]=1;sp[S.elde]=p.rol==='GK'?POSE.tutus:POSE.tasi;}
  /* top toplayıcı (N10): yedek topu iki eliyle önünde tutar */
  else if(p.tur==='topcu'&&p.top&&ad!=='atis'){st[S.elde]=1;sp[S.elde]=POSE.tasi;
    /* A2b: boşta bekleyen top toplayıcı (kimliğine göre) topu kucağında çömelir; elindeki topun yüksekliği js/mac-sahnesi.js'e (ANM_TOPCU) */
    const K=a.kim||anmKimlik(a,p);a.bosT=(p.spd||0)<0.2&&!p.gorev?a.bosT+dt:0;st[S.p2]=a.bosT>2.5&&K.bekle>0.4?1:0;sp[S.p2]=ANM_POZ.comel;ANM_TOPCU.set(p,a.sw[S.p2]);}
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
  /* A2b: hakem, yan hakem ve 4. hakem işaretleri */
  if(p.tur==='hakem'||p.kind==='dorduncu')anmHakemAdim(a,p,dt);
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
/* A2a: ağırlık kritik sönümlü yayla hedefe gider (kapalı biçim; ω = 3 × eski oran, yükselişte ve inişte ayrı): hız sürekli, poz
   geçişinde ivme kırılmaz; 1'i ve 0'ı aşmaz */
function anmYuvalar(a,dt){const sw=a.sw,sv=a.swV,st=a.st,sp=a.sp,N=sw.length;
  for(let i=0;i<N;i++){let w=sw[i];const h=st[i]>0?st[i]:0;
    if(dt>0&&(w!==h||sv[i]!==0)){const o=3*(h>w?ANM_SY[i]:ANM_SD[i]),x0=w-h,v0=sv[i],e=Math.exp(-o*dt),c=v0+o*x0;
      w=h+(x0+c*dt)*e;sv[i]=(v0-o*c*dt)*e;if(w<0){w=0;sv[i]=0;}else if(w>1){w=1;sv[i]=0;}
      if(Math.abs(w-h)<1e-4&&Math.abs(sv[i])<1e-3){w=h;sv[i]=0;}}
    sw[i]=w;if(w>0.001&&sp[i])anmKar(a,sp[i],w);}}
/* yuvaların üstüne eklenen hareketler: boyun vuruşu, sendeleme yönü, sevinç ritmi, itiraz ve alkış; hakem işaretleri */
function anmEkler(a,p,dt){
  const P=a.P,sw=a.sw,S=ANM_S,e=p.eylem,ad=e?e.ad:'';
  /* A2b vuruş: takipte ayak yükseldikçe gövde geriye; sert vuruşta iniş sıçraması */
  const vk=a.vk;if(vk&&vk.evre>0){P.lean+=vk.lean;if(vk.yEk>a.yEk)a.yEk=vk.yEk;}
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
  /* jest: işaret ve kol kaldırmada gövde hedefe döner; alkışta eller vurur */
  const wj=sw[S.jest],j=p.jest;if(wj>0.01&&j){if(j.hedef&&p.yon!=null){const r=-anmAci(Math.atan2(j.hedef.z-p.z,j.hedef.x-p.x)-p.yon);P.gy+=clamp(r,-0.9,0.9)*0.6*wj;P.by+=clamp(r,-0.9,0.9)*0.3*wj;}
    if(j.tur==='alkis'){const v=Math.sin(zaman*15+a.faz0)*0.22*wj;P.aLz+=v;P.aRz-=v;}}
  const wi=sw[S.itiraz];if(wi>0.01){const v=Math.sin(zaman*6+a.faz0)*0.15*wi;P.aLz-=v;P.aRz+=v;}
  /* boşta (T1): ağırlığı yavaşça bir bacaktan öbürüne verir, başı hafif oynar */
  /* boşta: ağırlığı yavaşça bir bacaktan öbürüne verir (kimliğin temposuyla), başı hafif oynar; nefes (A2a: göğüs inip kalkar, sert koşudan
     sonra hızlı ve derin; elleri dizlerindeyken gövde soluklanır) */
  const wb=sw[S.bosta],wd=sw[S.dizler];if((wb>0.01||wd>0.01)&&!a.kucuk){const K=a.kim||anmKimlik(a,p),v=Math.sin(zaman*0.55*K.nefes+a.faz0),u=Math.sin(zaman*0.37+a.faz0*1.7);
    P.gz+=0.07*v*wb;P.hz-=0.05*v*wb;P.hy+=0.12*u*wb;
    const ef=Math.min(1,a.efor),nf=Math.sin(zaman*6.2832*0.27*K.nefes*(1+0.9*ef)+K.faz)*(0.012+0.02*ef+0.02*wd)*Math.max(wb,wd);P.gx+=nf;P.aLz-=nf*0.6;P.aRz+=nf*0.6;}
  const wa=sw[S.p0+4];if(wa>0.01){const v=Math.sin(zaman*15+a.faz0)*0.22*wa;P.aLz+=v;P.aRz-=v;}
  const we=sw[S.p0];if(we>0.01){const f=0.5+0.5*Math.sin(zaman*0.9+a.faz0);anmKar(a,ANM_POZ.esneme1,we*f);anmKar(a,POSE.esneme2,we*(1-f));}
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
    let d=Math.sqrt(X*X+Y*Y+Z*Z);const dm=(ANM_L1+ANM_L2)*0.9995,ds=dm*0.96;
    /* yumuşak IK (A2a): bacak tam gerilmeye yaklaşınca uzanma üstel sıkışır; diz düzlükte kilitlenip sıçramaz */
    if(d>ds){const dn=ds+(dm-ds)*(1-Math.exp(-(d-ds)/(dm-ds))),k=dn/d;X*=k;Y*=k;Z*=k;d=dn;}if(d<0.3)d=0.3;
    const ck=clamp((d*d-ANM_L1*ANM_L1-ANM_L2*ANM_L2)/(2*ANM_L1*ANM_L2),-1,1),kk=Math.acos(ck),aa=ANM_L1+ANM_L2*ck,bb=-ANM_L2*Math.sin(kk);
    const be=Math.asin(clamp(X/aa,-1,1));let al=Math.atan2(Z,Y)-Math.atan2(bb,-aa*Math.cos(be));if(al>Math.PI)al-=6.283185307179586;else if(al<-Math.PI)al+=6.283185307179586;
    P[B.l]+=cL*al;P[B.z]+=cZ*be;P[B.k]+=cK*(kk+ANM_D0);}
}

/* ---- kare başına poz: başla (yürüyüş + yuvalar + ekler), arada ek pozlar (kenar, kulübe), bitir (IK) ---- */
function anmPozBasla(a,p,spd,dt,M){
  const P=a.P,C=a.C;for(let i=0;i<ANM_KANAL.length;i++)P[ANM_KANAL[i]]=0;C.lL=C.kL=C.lR=C.kR=C.lLy=C.lRy=C.lLz=C.lRz=1;
  a.st.fill(0);a.yEk=0;const sx=M.root.scale.x||1,sy=M.root.scale.y||1;
  a.kucuk=anmPiksel(a,sy)<ANM.kucukPiksel;
  if(p&&p.tur==='oyuncu'&&a.ck)anmCalimDurum(a,p,dt);   /* T4g: tavırdan önce (yürüyüş ayarları ve salınım yolu bu karenin durumundan) */
  anmTavir(a,p,dt);if(p&&p.tur==='oyuncu')anmVurusDurum(a,p,dt,a.al,sx);anmYuruyus(a,p,spd,dt,sx,sy);
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
    const p=a.kaynak;a.x=lerp(a.px,p.x,al);a.z=lerp(a.pz,p.z,al)-MOTOR_Z;a.al=al;
    let gorunur=p.z>T.z-0.8&&(p.tur!=='oyuncu'||p.oyunda||p.cikiyor);
    /* yedek: kulübedeyken eşofman modeli, oyuna girince forma */
    if(a.esofman){const esofmanli=p.tur==='yedek'&&!p.cikti;a.esofman.root.visible=gorunur&&esofmanli;
      if(esofmanli){a.m.root.visible=false;const E=a.esofman;if(!gorunur)return;
        aciYumusak(a,Math.atan2(Math.cos(p.yon),Math.sin(p.yon)),dts,8);
        anmPozBasla(a,p,p.oturuyor?0:p.spd,dts,E);
        if(p.oturuyor){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const kalk=yumusak(a,'kalk',a.sevinc>0||mac.phase==='toren'?1:0,5,dts);anmKar(a,ANM_POZ.otur,1-kalk);
          anmKulubeOturus(a,p,dts,1-kalk);
          if(kalk>0.5&&a.sevinc>0){anmKar(a,POSE.sevinc,kalk);a.P.dy+=Math.abs(Math.sin(zaman*7+a.faz0))*0.25*kalk;}}
        anmPozBitir(a);pose(E,a.P);E.root.position.set(a.x,0,a.z);E.root.rotation.set(0,a.yaw,0);return;}}
    a.m.root.visible=gorunur;if(!gorunur)return;
    const spd=p.oturuyor?0:(p.spd||0);
    /* dördüncü hakem tabelayı kaldırırken yüzü ana tribüne */
    if(a===DORDUNCU&&UZATMA.t>=0&&UZATMA.t<6){aciYumusak(a,Math.PI,dts,5);anmPozBasla(a,p,0,dts,a.m);anmKar(a,POSE.tabela,yumusak(a,'tabela',1,5,dts));anmPozBitir(a);pose(a.m,a.P);
      a.m.root.position.set(a.x,0,a.z);a.m.root.rotation.set(0,a.yaw,0);return;}
    /* gövde yönü motorda sınırlı hızla döner; çizim yalnız iki adım arasını yumuşatır (çift yumuşatma yok, MM1) */
    if(a.ilkYon){a.ilkYon=false;a.yaw=a.yawO=Math.atan2(Math.cos(p.yon),Math.sin(p.yon));}
    /* T4g rulet: kök yönüne çalım katmanının eki (a.ck.yaw; dönerken tavan 10,5 rad/sn) */
    const ckYaw=a.ck?a.ck.yaw:0;
    aciYumusak(a,Math.atan2(Math.cos(p.yon),Math.sin(p.yon))+ckYaw,dts,40,ckYaw!==0?10.5:9);
    anmPozBasla(a,p,spd,dts,a.m);
    if(p.tur==='kenar'){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const sv=yumusak(a,'kenarSevinc',a.sevinc>0?1:0,6,dts);
      if(p.oturuyor){anmKar(a,ANM_POZ.otur,1-sv);anmKulubeOturus(a,p,dts,1-sv);}
      if(sv>0.02){anmKar(a,POSE.sevinc,sv);a.P.dy+=Math.abs(Math.sin(zaman*7+a.faz0))*0.2*sv;}
      if(p.kind==='td')anmTeknikDirektor(a,p,dts,sv);
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
  anmHakemOlay(ad,v);if(v)anmKenarOlay(ad,v);   /* A2b: hakem işaretleri, kenarın tepkisi */
  if((ad==='faul'||ad==='avantaj')&&v&&v.faulYiyen&&v.faulYapan&&!v.avantajdan){const y=v.faulYiyen,f=v.faulYapan;
    let dx=y.x-f.x,dz=y.z-f.z;const L=Math.sqrt(dx*dx+dz*dz)||1;dx/=L;dz/=L;const s=Math.sqrt((y.vx||0)*(y.vx||0)+(y.vz||0)*(y.vz||0));
    if(s>1){const k=Math.min(0.75,0.3+s/8);dx=dx*(1-k)+y.vx/s*k;dz=dz*(1-k)+y.vz/s*k;}
    ANM_DUSUS.set(y,{yon:Math.atan2(dz,dx),t:zaman});}
}
