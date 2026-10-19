/* DONDURULMUŞ KOPYA — js/animasyon.js, git d35f573, 2026-10-19 (araclar/karsilastir/dondur.js a9).
   Doğrudan yüklenmez: araclar/karsilastir/once-yukle.js bu dosyayı bir işlevin içinde çalıştırır. POSE ve STIL.animasyon o anki değerleriyle sabittir. */
const POSE={"runA":{"lean":0.2,"lL":-0.75,"kL":0.35,"lR":0.6,"kR":1.35,"aL":0.65,"aR":-0.7,"eL":-1.1,"eR":-1.1,"aLz":-0.1,"aRz":0.1},"runB":{"lean":0.2,"lL":0.6,"kL":1.35,"lR":-0.75,"kR":0.35,"aL":-0.7,"aR":0.65,"eL":-1.1,"eR":-1.1,"aLz":-0.1,"aRz":0.1},"dive":{"lL":0.25,"kL":0.5,"lR":-0.35,"kR":0.2,"aLz":-2.9,"aRz":2.9,"eL":-0.1,"eR":-0.1},"ready":{"lean":0.25,"dy":-0.08,"lL":-0.2,"kL":0.45,"lR":0.15,"kR":0.4,"aL":-0.3,"aR":-0.3,"aLz":-0.35,"aRz":0.35,"eL":-0.6,"eR":-0.6},"otur":{"dy":-0.4,"lL":-1.45,"kL":1.45,"lR":-1.45,"kR":1.45,"aL":-0.35,"aR":-0.35,"eL":-0.9,"eR":-0.9,"aLz":-0.05,"aRz":0.05},"sevinc":{"aLz":-2.6,"aRz":2.6,"eL":-0.2,"eR":-0.2,"hx":-0.25},"kafa":{"hx":-0.45,"dy":0.25,"aLz":-0.5,"aRz":0.5,"lL":-0.2,"kL":0.5},"tac":{"aL":-2.8,"aR":-2.8,"eL":-0.5,"eR":-0.5,"lean":-0.15},"tutus":{"aL":-1.1,"aR":-1.1,"eL":-0.8,"eR":-0.8},"mars":{"aR":-0.55,"eR":-1.95,"aRz":0.3,"aL":0.02,"aLz":-0.05},"isaret":{"aR":-2.2,"eR":-0.1,"aRz":0.4},"vurusGeri":{"lean":0.06,"lL":0.8,"kL":1.3,"lR":-0.12,"kR":0.3,"aL":0.35,"aLz":-0.55,"aR":-0.4,"aRz":0.7,"eL":-0.4,"eR":-0.3,"hx":0.18},"vurusTakip":{"lean":-0.28,"lL":-1.35,"kL":0.12,"lR":0.22,"kR":0.35,"aL":-0.35,"aLz":-0.9,"aR":0.5,"aRz":1,"eL":-0.4,"eR":-0.3,"hx":0.2},"pasGeri":{"lean":0.04,"lL":0.45,"kL":0.7,"lR":-0.08,"kR":0.25,"aL":0.2,"aLz":-0.35,"aR":-0.2,"aRz":0.4,"eL":-0.4,"eR":-0.4,"hx":0.2},"pasTakip":{"lean":-0.12,"lL":-0.75,"kL":0.2,"lR":0.12,"kR":0.3,"aL":-0.2,"aLz":-0.5,"aR":0.3,"aRz":0.55,"eL":-0.4,"eR":-0.4,"hx":0.2},"kontrol":{"lean":0.12,"lL":-0.35,"kL":0.55,"lR":0.05,"kR":0.25,"aLz":-0.35,"aRz":0.35,"hx":0.35},"gogus":{"lean":-0.32,"aL":-0.4,"aR":-0.4,"aLz":-0.85,"aRz":0.85,"eL":-0.3,"eR":-0.3,"hx":0.3,"lL":-0.1,"kL":0.3,"lR":0.1,"kR":0.3},"mudahale":{"lean":-0.12,"dy":-0.12,"lL":-1.05,"kL":0.15,"lR":0.35,"kR":0.95,"aL":0.35,"aR":-0.4,"aLz":-0.6,"aRz":0.6,"eL":-0.5,"eR":-0.5},"blok":{"lean":0.05,"aL":0.15,"aR":0.15,"aLz":-0.12,"aRz":0.12,"eL":-2.3,"eR":-2.3,"lL":-0.2,"kL":0.3,"lR":0.2,"kR":0.3},"dusus":{"aL":-2.2,"aR":-2.2,"eL":-0.2,"eR":-0.2,"lL":0.2,"lR":-0.1,"kL":0.4,"kR":0.3,"hx":-0.4},"yerde":{"aL":-2.6,"aR":-0.4,"aLz":-0.4,"aRz":0.3,"eL":-0.4,"eR":-0.6,"lL":0.1,"kL":0.6,"lR":-0.2,"kR":0.2,"hx":-0.3},"yumruk":{"aL":-3,"aR":-3,"eL":-0.05,"eR":-0.05,"dy":0.18,"hx":-0.35,"lL":-0.3,"kL":0.6},"elleAtis":{"lean":0.15,"aL":-2.2,"eL":-0.2,"aR":0.4,"aRz":0.3,"lL":0.2,"lR":-0.4,"kR":0.3},"tacAt":{"lean":0.25,"aL":-1.1,"aR":-1.1,"eL":-0.4,"eR":-0.4,"lL":0.25,"lR":-0.35,"kL":0.2,"kR":0.4},"tasi":{"aL":-0.85,"aR":-0.85,"eL":-0.9,"eR":-0.9,"aLz":0.15,"aRz":-0.15},"itiraz":{"aL":-0.5,"aR":-0.5,"aLz":-0.7,"aRz":0.7,"eL":-1.25,"eR":-1.25,"hx":-0.15},"bayrak":{"aR":-3,"eR":0,"aRz":0.05},"tabela":{"aL":-2.9,"aR":-2.9,"eL":-0.3,"eR":-0.3,"aLz":0.2,"aRz":-0.2},"esneme1":{"lean":0.35,"dy":-0.25,"lL":-0.9,"kL":1.1,"lR":0.6,"kR":0.2,"aL":-0.2,"aR":-0.2,"aLz":-0.2,"aRz":0.2},"esneme2":{"aL":-2.9,"aR":-2.9,"aLz":0.3,"aRz":-0.3,"eL":-0.2,"eR":-0.2,"lean":-0.05},"tokalas":{"aL":-1.1,"eL":-0.35,"aLz":0.15},"comel":{"dy":-0.45,"lR":-1.5,"kR":1.5,"lL":0.1,"kL":1.6,"lean":0.1,"aL":-0.7,"eL":-0.9,"aR":-0.7,"eR":-0.9},"fotoCek":{"dy":-0.45,"lR":-1.5,"kR":1.5,"lL":0.1,"kL":1.6,"lean":0.05,"aL":-1.45,"eL":-1.35,"aR":-1.45,"eR":-1.35,"aLz":0.25,"aRz":-0.25},"foto":{"aL":-0.35,"aR":-0.35,"eL":-1.9,"eR":-1.9,"aLz":0.25,"aRz":-0.25},"alkis":{"aL":-1,"aR":-1,"eL":-1,"eR":-1,"aLz":0.35,"aRz":-0.35},"cember":{"lean":0.45,"aL":-1.6,"aR":-1.6,"aLz":-1,"aRz":1,"eL":-0.2,"eR":-0.2,"hx":0.3},"yorgun":{"lean":0.75,"dy":-0.08,"aL":-0.55,"aR":-0.55,"eL":-0.35,"eR":-0.35,"lL":-0.2,"lR":-0.2,"kL":0.35,"kR":0.35,"hx":-0.3}};
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
   T4g (2026-10-09): çalım hazırlığı ve itişi, aldatılan savunmacı, top saklama (1h; motorun p.calim, p.yutma, tavır 'koru' alanlarından).
   T6f (2026-10-10, Ek G4/G6): sıçrama katmanı (motorun p.zipla'sı: hazırlık, durarak ve koşarak uçuş, iniş), havada düello kolu, kafanın yüzeyi
   (kafa.yuzey: alın, tepe, yan, yüz), başın topun yoluna uzanması (1i; gövde en çok 0,4 m kayar, kalanı eğilerek; top gelirken sırt yay gibi
   gerilir, kırılma temasta, temas karesinde baş topta), müdahale bacağının topa IK'sı (temas karesinde uzanan ayak topta), kalecinin yüksek
   tutuşta ve yumrukta sıçraması. */
/* ---- kanallar: eski 13 eklem (balkon ve eski pozlar) + iskelet 2 kanalları (js/oyuncular.js pose) ---- */
const EKLEM=['lean','dy','hx','lL','kL','lR','kR','aL','aR','aLz','aRz','eL','eR'];
const ANM_KANAL=EKLEM.concat(['hy','hz','gx','gy','gz','by','bz','lLy','lRy','lLz','lRz','aLy','aRy']);
const ANM_BACAK={lL:1,kL:1,lR:1,kR:1,lLy:1,lRy:1,lLz:1,lRz:1};
const ANM={"adim":{"yuvar":0.05,"kaldirEn":0.06,"kaldirHiz":0.055,"kaldirTavan":0.42,"geri":0.75,"yanEn":0.3,"yanHiz":0.08,"yanTavan":0.5,"donusKadans":3.2},"kalcaDonus":0.5,"kalcaSalinim":[0.05,0.1],"kalcaGecikme":0.65,"yaylanma":[0.04,0.022],"egilme":{"kosu":0.2,"ivme":0.8,"yatis":0.8,"ivmeAlt":-0.4,"ivmeUst":0.42,"ivmeUstDepar":0.65,"yatisTavan":0.35},"fren":{"adim":0.3,"yer":0.08,"kalca":0.08,"kol":0.3,"ayak":0.08},"donus":{"yer":0.2,"kalca":0.03,"kol":0.12,"basma":20,"kaldir":0.09},"viraj":{"kol":0.22},"bas":{"yay":22,"hiz":7,"ivme":90,"sinir":1.22,"govde":0.7,"oncu":0.32,"govdeSinir":null,"govdeHiz":3},"kol":{"genlik":[0.16,0.74],"dirsek":[0.28,1.1]},"dusus":{"aci":1.45,"yuzY":0.12,"yanY":0.16},"dokunus":0.18,"kucukPiksel":12,"top":{"ust":300,"egri":150,"kare":0.6},"sevincCesit":4,"koru":{"dokunus":1},"zipla":{"inis":0.6,"kes":1,"capa":1},"blok":{"acik":1,"erisim":0.95,"tut":0.15,"hiz":14,"kok":0.5,"yuksek":0.25,"yukAyak":0.2},"a8":{"dokunus":1,"dokSal":1,"alisAyak":1,"dokAlcak":1,"capaCiz":1,"bakis":0.45,"surukle":1,"alis":0.45,"sutEgim":0.12,"yarim":1},"a9":{"yanEn":0.45,"yanTavan":0.6,"geri":0.65,"kalTut":1,"kosuBoy":0.06,"basDunya":10,"basIleri":1,"basKok":1,"basSon":1.38,"kolSigma":0.025,"dokItme":20,"kolYay":10,"dokTepe":1,"dokDirsek":1,"elTemas":0.3,"govdeIvme":12,"vkSurek":1,"vkGec":0.2,"vkUzan":0.4,"ikYan":0.85,"destek":1,"capaIK":20,"salIK":1,"salYan":0.25,"vkHiz":15,"z":0},"egri":{"acik":1,"ayak":1,"kalca":1,"egim":1,"legen":1,"kol":1,"kolOlcek":1,"depar":0.5,"aciklik":0.07,"surus":{"adim":0.8,"egim":0.06,"kol":0.3},"vurus":1}};   /* dondurulmuş STIL.animasyon */
/* tam gövde pozu: verilmeyen kanallar 0 (düşüş, yerde yatış, kayma gibi bütün bedeni kaplayan pozlara koşu katmanı sızmasın) */
function anmTam(P){const T={};for(const k of ANM_KANAL)T[k]=P[k]||0;return T;}
/* bacağı veren poz bacağın bütün kanallarını tutar (yana açma ve burulma IK'dan sızmasın) */
function anmGenis(P){const T=Object.assign({},P);if('lL' in P){if(!('lLz' in P))T.lLz=0;if(!('lLy' in P))T.lLy=0;if(!('kL' in P))T.kL=0;}
  if('lR' in P){if(!('lRz' in P))T.lRz=0;if(!('lRy' in P))T.lRy=0;if(!('kR' in P))T.kR=0;}return T;}

/* ---- yeni pozlar (sağ ayak/kol için; L harfli kemikler oyuncunun sağıdır, sol taraf aynala() ile). İşaretler: lean+ öne, lL− uyluk öne, kL+ diz büker,
   aL− kol öne/yukarı, aLz− sağ kol yana açılır, eL− dirsek büker, hy+/gy+/by+ sola döner, hz+/gz+/bz+ sağa yatar, lLz− sağ bacak yana açılır, lLy− sağ ayak ucu dışa.
   Eklemler (pose, js/oyuncular.js): lean/hy/hz kalçayı — bacaklarla bütün bedeni —, gx/gy/gz gövdeyi, hx/by/bz başı döndürür (T6f: baş için by/bz) ---- */
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
  /* T6f (Ek G4): sıçrama — hazırlık (kalça alçalır, gövde öne, kollar geride; bacaklar yerde: dizleri IK büker, ayak kilitli kalır), uçuş (durarak:
     dizler hafif bükük, kollar yukarı; koşarak: serbest diz yukarıda, kalkış bacağı aşağıda, kollar yukarı; sağ kalkış, solda aynalanır), iniş */
  zHazD:{lean:0.22,dy:-0.18,aL:0.7,aR:0.7,aLz:-0.2,aRz:0.2,eL:-0.4,eR:-0.4,hx:0.15},
  zHazK:{lean:0.1,dy:-0.1,aL:0.55,aR:0.6,aLz:-0.2,aRz:0.25,eL:-0.5,eR:-0.4,hx:0.1},
  zUcD:G({lean:-0.06,lL:-0.2,kL:0.5,lR:-0.2,kR:0.5,aL:-1.45,aR:-1.45,aLz:-0.35,aRz:0.35,eL:-0.5,eR:-0.5,hx:-0.3}),
  zUcK:G({lean:-0.04,lL:0.2,kL:0.35,lR:-1.3,kR:1.45,aL:-1.25,aR:-1.6,aLz:-0.45,aRz:0.3,eL:-0.6,eR:-0.4,hx:-0.3}),
  zIn:{lean:0.16,dy:-0.15,aL:-0.35,aR:-0.35,aLz:-0.5,aRz:0.5,eL:-0.5,eR:-0.5,hx:0.1},
  /* havada düello (rakip sağda): sağ kol bükük ve rakibe kalkık (yaslanır, korunur), gövde rakibe yatar */
  hvDuello:{aL:-1.0,aLz:-0.85,eL:-1.4,aR:-1.3,aRz:0.3,eR:-0.4,gz:0.16,hz:0.06,hy:-0.08},
  /* kafanın yüzeyi (yalnız üst gövde: havadaki bacaklar sıçrama pozundan): alın (gövde yaydan öne kırılır, anmEkler), tepe (baş geride: sıyırma),
     yan (top sağda: baş topa döner, gövde yana yatar), yüz (top yüze geldi: baş kaçar, kollar korur) */
  kafaAlin:{hx:-0.45,aLz:-0.6,aRz:0.6,aL:-0.5,aR:-0.5,eL:-0.6,eR:-0.6,gx:-0.08},
  kafaTepe:{hx:-0.8,lean:-0.1,gx:-0.15,aLz:-0.6,aRz:0.6,aL:-0.6,aR:-0.6,eL:-0.6,eR:-0.6},
  kafaYan:{hx:-0.25,by:-0.45,bz:0.2,gz:0.12,hy:-0.12,hz:0.04,aLz:-0.75,aRz:0.45,aL:-0.4,aR:-0.6,eL:-0.6,eR:-0.6},
  kafaYuz:{hx:0.35,by:0.45,bz:-0.1,aL:-0.95,aR:-0.75,aLz:-0.4,aRz:0.4,eL:-1.3,eR:-1.2},
  /* ikili mücadele: rakip sağda */
  omuz:{lean:0.22,gz:0.28,hz:0.08,aL:0.15,aLz:-0.12,eL:-1.5,aR:-0.25,aRz:0.75,eR:-0.5,hy:-0.1,gy:-0.12,hx:0.1},
  /* T4g top saklama (rakip sağda ya da sağ arkada; Ek G2): gövde yana döner (sağ omuz rakibe), sağ kol rakibe doğru geride ve bükük (tutar, itmez),
     sol kol dengede açık, gövde alçak ve hafif öne, baş topta (diz bükme ve geniş duruş yürüyüşten) */
  koru:{lean:0.16,gz:0.1,gy:-0.25,hy:-0.3,aL:0.55,aLz:-0.75,eL:-0.75,aR:-0.3,aRz:0.6,eR:-0.6,hx:0.3},
  jokey:{lean:0.28,aL:-0.25,aR:-0.25,aLz:-0.5,aRz:0.5,eL:-0.9,eR:-0.9,hx:0.15},
  /* T2: topu ayağının altında bekletme (sağ taban topun üstünde, gövde hafif geride, kollar dengede, baş yukarıda); taşıma (hafif öne,
     kollar dengede; bacaklar koşu döngüsünden); dönüş dokunuşu (sağ ayak içe/dışa çeker, gövde dönüşe yatar) */
  bekle:G({lean:-0.04,dy:-0.03,lL:-1.15,kL:1.1,lLy:-0.15,lR:0.1,kR:0.22,aLz:-0.3,aRz:0.25,eL:-0.45,eR:-0.4,hx:0.05}),
  /* A7b (2026-10-17): top sürmede kollar denge için hafif açık, baş topa; dirsek ve eğim yuvada değil (dirsek veriden — eskiden 31°'ye kilitliyordu —,
     eğim yürüyüş katmanında üste eklenir: yuva mutlak değere çektiği için koşu eğimini 4°'ye düşürüyordu) */
  tasi:{aLz:-0.26,aRz:0.26,hx:0.1},
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
  /* T5f (2026-10-09; Ek G4 T5): şut bloğuna atlama (bacaklar çekik ve bitişik, kollar arkada), düşüşün ilk yarısı (kollar koruyucu uzanır, gövde
     henüz dik; yüzüstü öne-aşağı, sırtüstü geriye-yana, yan düşüşte düşülen yana), dizlerin üstünde ara poz (uzun kalkış), forma çeken kol
     (sağ kol öne-yukarı uzanır, gövde döner), iki kolla itiş */
  blokZipla:Tm({lean:0.12,dy:-0.08,lL:-0.55,kL:1.1,lR:-0.55,kR:1.1,aL:0.5,aR:0.5,aLz:-0.25,aRz:0.25,eL:-0.5,eR:-0.5,hx:0.3}),
  dususElYuz:Tm({lean:0.25,aL:-1.5,aR:-1.5,aLz:-0.5,aRz:0.5,eL:-0.5,eR:-0.5,lL:-0.35,kL:0.5,lR:0.25,kR:0.35,hx:-0.3}),
  dususElSirt:Tm({lean:-0.2,aL:0.9,aR:0.9,aLz:-0.8,aRz:0.8,eL:-0.4,eR:-0.4,lL:-0.4,kL:0.6,lR:0.1,kR:0.3,hx:0.4}),
  dususElYan:Tm({lean:0.05,aL:-0.6,aLz:-1.5,eL:-0.3,aR:-0.5,aRz:0.3,eR:-1.0,lL:-0.3,kL:0.5,lR:-0.2,kR:0.6,gz:-0.25,hx:0.1}),
  kalkDiz:Tm({lean:0.75,dy:-0.55,lL:-1.6,kL:2.1,lR:-1.6,kR:2.1,aL:-1.3,aR:-1.3,aLz:-0.25,aRz:0.25,eL:-0.15,eR:-0.15,hx:-0.3}),
  cekme:{lean:0.22,gy:-0.25,aL:-1.15,aLz:-0.15,eL:-0.45,aR:0.25,aRz:0.55,eR:-0.85,hx:0.15,hy:-0.15},
  itme:{lean:0.3,aL:-1.1,aR:-1.1,aLz:-0.2,aRz:0.2,eL:-0.35,eR:-0.35,hx:0.1},
  /* kaleci: itiş, havada (iki el / tek el, sağa uçuş), iniş, kapanma, hazır duruş, tutuş çeşitleri */
  ucusItis:Tm({lean:0.2,dy:-0.18,lL:-0.45,kL:0.9,lR:-0.35,kR:0.8,aL:-0.8,aR:-0.8,aLz:-0.9,aRz:0.9,eL:-0.5,eR:-0.5,hx:0.1}),
  ucusCift:Tm({lL:0.25,kL:0.5,lR:-0.35,kR:0.2,aLz:-2.9,aRz:2.9,eL:-0.1,eR:-0.1,aL:-0.25,aR:-0.25,hx:-0.1}),
  ucusTek:Tm({lL:0.2,kL:0.4,lR:-0.3,kR:0.3,aRz:2.9,eR:-0.05,aR:-0.2,aL:-0.9,aLz:-0.6,eL:-1.3,hx:-0.15}),
  ucusIn:Tm({lL:0.1,kL:0.5,lR:-0.4,kR:0.6,aL:-1.5,aR:-1.2,aLz:-0.1,aRz:-0.15,eL:-0.4,eR:-0.6,hx:0.1}),
  kapan:Tm({lean:0.5,dy:-0.42,lL:-0.9,kL:1.5,lR:-0.9,kR:1.5,lLz:-0.55,lRz:0.55,aL:-0.5,aR:-0.5,aLz:-1.25,aRz:1.25,eL:-0.15,eR:-0.15,hx:-0.2}),
  kaleciHazir:{lean:0.22,aL:-0.5,aR:-0.5,aLz:-0.5,aRz:0.5,eL:-0.75,eR:-0.75,hx:0.05},
  /* A2b (Ek G6): set duruşu — göğüs dizlerin üstünde, dirsekler önde, eller ayakların önünde, baş topta (diz ~60°, ayaklar geniş: tavır) */
  kaleciSet:{lean:0.38,gx:0.06,aL:-0.9,aR:-0.9,aLz:-0.28,aRz:0.28,eL:-0.5,eR:-0.5,hx:-0.08},
  /* T9b-e (Ek G6): çökme dalışı — yakın alçak topa kaleci itmez, yakın bacağı çöker: itişte dizler bükük, kollar aşağıda; havada bacaklar
     katlanmış, kollar başın üstünden topa (sağa; solda aynalanır). Bire birde kapanma türleri (sözleşme kapan.tur): K-blok (top sağda: sağ bacak
     yana açık ve yerde, sol diz yerde, gövde dik, kollar aşağıda yana açık), yıldız (ayakta büyür: bacaklar ve kollar yana açık, küçük sıçrama) */
  cokmeItis:Tm({lean:0.25,dy:-0.3,lL:-0.55,kL:1.25,lR:-0.45,kR:1.15,lLz:-0.15,aL:-0.9,aR:-0.9,aLz:-0.7,aRz:0.7,eL:-0.45,eR:-0.45,hx:0.15}),
  ucusCokme:Tm({lean:0.12,lL:-0.85,kL:1.45,lR:-0.35,kR:1.0,aL:-0.45,aR:-0.35,aLz:-2.55,aRz:2.6,eL:-0.35,eR:-0.4,hx:0.1}),
  kapanKblok:Tm({lean:0.18,dy:-0.47,lL:-0.15,lLz:-0.92,kL:0.2,lR:-0.35,kR:1.85,lRz:0.1,aL:0.15,aR:0.15,aLz:-0.75,aRz:0.75,eL:-0.35,eR:-0.35,hx:0.35}),
  kapanYildiz:Tm({lean:0.04,dy:-0.04,lL:-0.05,kL:0.2,lR:-0.05,kR:0.2,lLz:-0.42,lRz:0.42,aL:-0.3,aR:-0.3,aLz:-1.3,aRz:1.3,eL:-0.12,eR:-0.12,hx:0.05}),
  /* T9b-e kötü vuruşta (ıska, altına girme) denge: kollar yana açılır, gövde geride */
  vkDenge:{lean:-0.1,aL:-0.5,aR:-0.5,aLz:-1.2,aRz:1.2,eL:-0.35,eR:-0.35,hx:-0.12},
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
  /* T8e (Ek G5): motorun baraj sıçramasının hazırlığı (çömelme; eller önde kalır); topu yerleştirme (eğilme, el topta); uzun taçta koşu (top başın
     arkasında, gövde geride); koşarak alçak topa yarı plonjon kafa (gövde öne yatar, kollar öne; motor düşürmez) */
  barajHaz:{aL:0.12,aR:0.12,aLz:0.32,aRz:-0.32,aLy:-0.2,aRy:0.2,eL:-0.75,eR:-0.75,hx:0.12,dy:-0.1,lean:0.08},
  yerlestir:{lean:0.8,gx:0.25,dy:-0.2,aL:0.2,aLz:-0.1,eL:-0.4,aR:-0.3,aRz:0.15,eR:-0.1,hx:0.35},
  tacKosu:{aL:-2.9,aR:-2.9,eL:-0.6,eR:-0.6,lean:-0.3,hx:-0.1},
  kafaPlonjon:G({lean:0.55,hx:-0.3,aL:-1.3,aR:-1.3,aLz:-0.3,aRz:0.3,eL:-0.2,eR:-0.2,lL:0.3,kL:0.4,lR:-0.4,kR:0.6}),
  /* T14e (Ek G4): tam plonjon — kök yatar (anmKok), gövde düz, kollar öne ve hafif açık (inişi karşılar), bacaklar geride uzun, baş kalkık (topa bakar) */
  kafaPlonjonTam:Tm({aL:-2.3,aR:-2.3,aLz:-0.35,aRz:0.35,eL:-0.35,eR:-0.35,lL:0.08,kL:0.25,lR:-0.05,kR:0.35,hx:-0.75,lean:0}),
  /* A2b ikinci top için hazır duruş (Ek G3): dizler hafif bükük, kollar dengede */
  izle:{lean:0.14,aL:-0.12,aR:-0.12,aLz:-0.32,aRz:0.32,eL:-0.55,eR:-0.55},
  /* A2b bekleyiş kıpırtıları (Ek G0.7): kalecinin eldiveni; ölü topta esneme (sağ bacak; solda aynalanır) */
  eldiven:{aL:-1.0,aR:-1.0,aLz:0.32,aRz:-0.32,eL:-1.45,eR:-1.45,hx:0.35},
  esnemeArka:G({lL:0.25,kL:2.25,aL:0.55,eL:-0.55,aLz:-0.1,aR:-0.2,aRz:0.55,eR:-0.2,hx:0.1}),
  esnemeOn:G({lean:0.55,dy:-0.08,lL:-0.5,kL:0.05,aL:-0.55,aR:-0.55,aLz:0.1,aRz:-0.1,eL:-0.35,eR:-0.35,hx:0.35}),
  tutGogus:{lean:0.2,aL:-1.0,aR:-1.0,eL:-1.1,eR:-1.1,aLz:0.25,aRz:-0.25,hx:0.35},
  tutYuksek:{aL:-2.85,aR:-2.85,eL:-0.45,eR:-0.45,aLz:0.15,aRz:-0.15,hx:-0.45,lean:-0.08},
  tutYer:{lean:0.75,aL:-1.25,aR:-1.25,eL:-0.25,eR:-0.25,aLz:0.15,aRz:-0.15,hx:0.3},
  /* T15d (2026-10-14; Ek G6): tutuşun türleri (sözleşme tutus.tur: 'yer' kepçe, 'gogus' kucak, 'W', 'yukari'; motorun kaleciTutusTuru'ndan). Kepçe —
     diz altı: ayaklar geniş, çömelir, avuçlar topun altında öne rampa; ikinci karede top göğse çekilir (tutKepce2; a.tMix ile karışır). W — baş
     hizası: eller yüzün önünde, başparmaklar bitişik (kol IK'sı elleri topun arkasına koyar), dirsekler içeride. Kucak tutGogus, yukarı tutYuksek */
  tutKepce:Tm({lean:0.62,dy:-0.3,lL:-0.55,kL:1.05,lR:-0.55,kR:1.05,lLz:-0.22,lRz:0.22,aL:-0.85,aR:-0.85,eL:-0.15,eR:-0.15,aLz:0.1,aRz:-0.1,hx:0.4}),
  tutKepce2:Tm({lean:0.35,dy:-0.16,lL:-0.35,kL:0.65,lR:-0.35,kR:0.65,lLz:-0.15,lRz:0.15,aL:-0.75,aR:-0.75,eL:-1.55,eR:-1.55,aLz:0.32,aRz:-0.32,hx:0.45}),
  tutW:{lean:0.04,aL:-1.95,aR:-1.95,eL:-0.75,eR:-0.75,aLz:0.2,aRz:-0.2,hx:-0.15},
  /* T15d (Ek G5): duraklı penaltı koşusunda tereddüt — gövde dik, ağırlık geride, kollar dengeye açık (sözleşme vurus.kosu 'durak') */
  kosuDurak:{lean:-0.08,aL:0.15,aR:-0.25,aLz:-0.45,aRz:0.45,eL:-0.55,eR:-0.45,hx:0.12},
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
  /* T10f sevinç çeşitleri (profilden; anmSevincSec): armayı öpme, parmak dudakta, el kulakta, sakin (tek kol havada) */
  sevArma:{aR:-1.25,aRz:0.25,eR:-2.3,aL:-0.2,aLz:-0.35,eL:-0.4,hx:0.45,lean:0.08},
  sevSus:{aR:-1.55,aRz:0.1,eR:-2.6,aRy:-0.3,aL:0.15,aLz:-0.3,eL:-0.3,hx:-0.05},
  sevKulak:{aR:-2.1,aRz:1.0,eR:-2.3,aL:-1.2,aLz:-1.0,eL:-0.4,hx:-0.15},
  sevSakin:{aR:-2.6,aRz:0.25,eR:-0.25,aL:0.1,aLz:-0.15,eL:-0.35,hx:-0.1},
  /* T10f sakatlık (Ek G4): yerde sakat yeri tutma — sırtüstü dize/bileğe uzanan eller (diz göğse), başı tutma (kafa, omuz), yan yatarak büzülme,
     yüzüstü elin arka adaleye uzanması; kramp: sırtüstü bacak havada düz; sağlıkçı: gerdirme (bacağı iter), sedyeyi tutma */
  sakatDiz:Tm({lL:-1.55,kL:2.15,lR:-0.25,kR:0.4,aL:-0.75,aR:-0.7,aLz:0.3,aRz:-0.32,eL:-0.55,eR:-0.6,lean:0.55,hx:0.65}),
  sakatBas:Tm({aL:-2.5,aR:-2.45,aLz:-0.7,aRz:0.7,eL:-2.15,eR:-2.1,lL:-0.5,kL:0.8,lR:-0.15,kR:0.3,hx:0.2,lean:0.15}),
  sakatYan:Tm({lL:-1.25,kL:1.75,lR:-1.0,kR:1.5,aL:-1.35,aLz:0.15,eL:-1.0,aR:-1.15,aRz:-0.1,eR:-1.15,lean:0.5,hx:0.45}),
  sakatYuz:Tm({aL:-2.4,aLz:-0.4,eL:-0.8,aR:0.55,aRz:0.25,eR:-0.5,lL:0.05,kL:0.4,lR:-0.1,kR:1.2,hx:-0.3}),
  kramp:Tm({lL:-1.35,kL:0.05,lR:-0.2,kR:0.35,aL:-0.4,aR:-0.4,aLz:-1.1,aRz:1.1,eL:-0.2,eR:-0.2,lean:0.1,hx:0.25}),
  gerdir:G({lean:0.35,dy:-0.08,lL:-0.2,kL:0.3,lR:0.15,kR:0.25,aL:-1.55,aR:-1.55,aLz:-0.1,aRz:0.1,eL:-0.45,eR:-0.45,hx:0.15}),
  sedyeTut:{aL:-0.3,aR:-0.3,aLz:-0.12,aRz:0.12,eL:-0.2,eR:-0.2,lean:0.06,hx:0.15},
  /* T10f (T7'den): pres koşusu duruşu (kollar geniş, gövde öne) ve markajda el teması (rakibin sırtına uzanan kol) */
  presKos:{lean:0.18,aLz:-0.45,aRz:0.45,eL:-0.55,eR:-0.55,hx:0.15},
  elTemas:{aL:-1.05,aLz:-0.2,eL:-0.35,aLy:0.2},
  /* A4-3: yerden kalkan arkadaşına el uzatma — belden öne eğik (gövde), kalça geride, dizler bükük; uzanan kol kare sonunda IK'da (anmYardimIK) */
  yardim:{lean:0.1,gx:0.5,dy:-0.1,lL:-0.35,kL:0.6,lR:-0.25,kR:0.55,hx:0.1,aL:0.05,aR:0.05,aLz:-0.12,aRz:0.12,eL:-0.35,eR:-0.35},
  /* eski pozların bacak kanallarını tutan ve tam gövde sürümleri */
  otur:Tm(P.otur),kafaEski:G(P.kafa),tac:P.tac,tacAt:G(P.tacAt),vurusTakip:G(P.vurusTakip),yumruk:G(P.yumruk),elleAtis:G(P.elleAtis),
  esneme1:Tm(P.esneme1),comel:Tm(P.comel),fotoCek:Tm(P.fotoCek),yorgun:G(P.yorgun)
};})();
const ANM_JEST={kol:'jestKol',isaret:'jestIsaret',itiraz:'jestItiraz',cagir:'jestCagir',basEl:'jestBasEl',alkis:'alkis'};
const ANM_VURUS={ic:['icG','icT'],dis:['disG','disT'],ust:['ustG','ustT'],asirtma:['asirtmaG','asirtmaT'],vole:['voleG','voleT'],yarimVole:['yarimVoleG','yarimVoleT']};
const ANM_SEVINC=[ANM_POZ.sevKollar,ANM_POZ.sevUcak,ANM_POZ.sevYumruk,ANM_POZ.sevGok,ANM_POZ.sevArma,ANM_POZ.sevSus,ANM_POZ.sevKulak,ANM_POZ.sevSakin],ANM_UZGUN=[ANM_POZ.basEl,ANM_POZ.belEl,ANM_POZ.egik];

/* ---- eylem yuvaları: sıra karışım sırasıdır (sonraki baskın). [ad, yükselme hızı, inme hızı] (ağırlık/sn) ---- */
/* T4g: yutma (aldatılan savunmacı), koru/koruS (top saklama; rakip sağda/solda, çapraz geçiş), ckA (çalım hazırlığı), ckB (itiş ve patlama) */
const ANM_SLOT=[['bosta',2,4],['dizler',2.5,1.6],['kipirti',3,2.5],['hazir',5,4],['set',12,5],['jokey',5,4],['pres',4,4],['yutma',10,5],['koru',6,5],['koruS',6,5],['bekle',3,3],['tasi',4,4],
  ['ckA',12,8],['ckB',14,6],['izle',3,2],['baraj',4,4],['barajZ',14,5],
  ['dokun',40,10],['kontrol',30,8],['kontrol2',20,8],['gogus',30,8],['gogus2',20,8],['vG',40,8],['vT',40,8],['vD',20,6],['degaj',30,8],['degajT',20,6],
  ['zHaz',14,8],['zUc',12,6],['zIn',16,6],['hvDuello',10,6],['kafa',16,16],['omuz',12,8],['sendele',15,6],['mudahale',30,7],['blok',30,8],['kayma',24,3],['ucusI',30,6],['ucusH',30,5],['ucusN',30,5],['kapan',12,6],
  ['tutus',25,8],['yumruk',30,8],['elleAtis',30,8],['elleAtisT',20,6],['dusus',10,4],['yerde',4,3],['sakat',3,3],['kalk',20,5],['kalk2',12,5],['tac',6,5],['tacAt',30,6],['yerlestir',8,5],['elde',10,10],['gerdir',5,5],['sedyeTut',6,6],['itiraz',30,8],['cekme',14,6],['tepki',8,5],['jest',8,5],['yardim',4,4],
  ['p0',5,5],['p1',10,10],['p2',5,5],['p3',5,5],['p4',5,5],['p5',5,5],['p6',5,5],['p7',5,5],['sevinc',6,6],['sarilma',4,4],['dizKayma',5,4],['uzgun',2,3],['mars',3,3],
  /* A2b: hakem işaretleri iki yuvada sırayla (biri biterken öbürü başlar: çapraz geçiş) */
  ['hkA',10,6],['hkB',10,6],
  /* A8 (alisAyak): alış pozunun dokunan bacağı ayrı yuvada — ayak yere basınca bu yuva hızla söner (gövde ve kollar ana yuvada sürer; ani geçiş bacağı burup ayağı kaydırıyordu) */
  ['kontrolB',30,16],['kontrol2B',20,16]];
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
    wvx:0,wvz:0,awx:0,awz:0,awxV:0,awzV:0,mX:0,mZ:1,sapma:0,W:new Float32Array(4),D:new Float32Array(4),anc:new Uint8Array(2),yawO:0,don:0,donY:0,yonM:null,cadS:0,fr:0,dn:0,ayakYaw:null,T:new Float32Array([-0.1,-0.034,0.025,0.1,-0.034,0.025]),qA:new Float32Array(2),beta:0.6,dyR:0,dyV:0,hy:0,hyV:0,hyT:0,hyTV:0,by:0,byV:0,byH:0,kim:null,
    gDrop:0,gGen:0,gAdim:1,gHy:0,gKal:1,kalS:new Float32Array(2),tvSon:null,jYan:1,bekP:null,yEk:0,kucuk:false,phItme:0,phItmeV:0,dokT:-1,dokSon:undefined,dokSurum:-1,dokP:null,dokDon:false,dokCal:false,dokKoru:false,dokS:ANM.dokunus,dokAyak:-1,dokSal:false,bjwO:0,blkW:0,blkI:-1,blkT:null,blkE:null,blkP:null,egW:0,egWk:0,egWkV:0,egVa:0,egVaV:0,ctSag:null,
    /* T4g: çalım, aldatılan savunmacı ve top saklama katmanının durumu (anmCalimDurum) */
    ck:anmCkYeni(),
    /* eylem: son görülen eylem nesnesi ve başında seçilenler */
    eyl:null,eylAd:'',oSag:1,vG:null,vT:null,vGm:1,vTm:1,vStil:null,kP:null,mP:null,bP:null,kyP:null,oP:null,tP:null,uP:null,uY:0.8,uFaz:'',uG:0,
    sdX:0,sdZ:1,sdS:0.6,bosT:0,bosP:null,efor:0,bosK:null,bkW:new Float32Array(2),bkH:0,bkT:0,bkN:0,dizT:0,kpT:20,kpN:0,kpS:-1,kpTur:0,bakinH:0,sevSon:false,sevC:0,sevH:8,sevDiz:false,dizAktif:false,uzP:null,
    /* kök: yatış ekseni (gövde çerçevesinde x,z), açısı, uzun eksen etrafında dönüş; düşüş/kalkış pozları */
    lkx:1,lkz:0,lth:0,lps:0,lps0:0,lieTur:'',lieSag:true,dP:null,yP:null,kkP:null,kTh0:0,kPs0:0,
    /* T14e: tam plonjon kafanın temas karesindeki açısı ve kökün topa kayması (anmEylemler → anmKok) */
    pjTh0:0,pjOfs:0,pjKd:0,
    /* T5f: düşüşün ilk yarısı pozu ve karışım tamponu, uzun kalkışın diz pozu, blok sıçraması */
    dEl:null,dMix:anmTam({}),kkP2:null,bZip:false,
    /* A2b: vuruş katmanının durumu (anmVurusDurum) ve iki motor adımı arasındaki oran (topun çizilen yeri için) */
    vk:anmVkYeni(),al:1,
    /* A2b: kalecinin set/split-step durumu, baraj sıçraması, dağıtım pozları */
    ks:{evre:0,t:0,hopT:0.2,e:null},hxU:0,hxUV:0,kP2:null,bj:{e:null,t:-1,h:0.35,T:0.53,bas:false},dg:{e:null,P0:null,P1:null},kpSol:false,
    /* T6f: sıçrama katmanı (son görülen p.zipla, pozları, iniş saati), kafanın pozu, müdahale bacağı (IK hedefi, gövde çerçevesinde), başın uzanması */
    zipE:null,zipVar:false,inisT:-1,zHazP:null,zUcP:null,kfP:null,mI:0,mT:null,mAn:null,mAnT:0,kf:{ofs:0,kd:0,egim:0,yuk:0,e:null,tOfs:0,tEgim:0,tYuk:0,on:0},kyOx:0,kyOz:0,kfOx:0,kfOz:0,kfOy:0,
    /* T9b-e: dalışın itiş pozu ve çökme dalışı, kapanmanın pozu, kalecinin kol IK'sı (ağırlık, temas karesinden geçen süre, hedef, eller) */
    uIP:null,uCok:false,kpnP:null,mOx:0,mOz:0,kl:{w:0,temas:false,tT:0,tx:0,ty:0,tz:0,sx:0,sy:1,sz:0,el:'cift',kol:0,kolE:null,ox:0,oy:0,oz:0,q:[new THREE.Quaternion(),new THREE.Quaternion()],e:[0,0],niyet:null,celN:null},kh:{y:0.9,t:-1},
    /* T15d: tutuşun türü (çizilen), kepçenin karışım pozu */
    tK:'',tMix:null};
}

/* ---- pozlar: sürekli karışım ---- */
const kar=(J,P,w)=>{if(w<=0.001)return;for(const k in P)J[k]=J[k]+(P[k]-J[k])*w;};
/* aktörün poz karışımı: bacak kanallarında pozun payı da tutulur (kalan pay IK'nındır) */
function anmKar(a,P,w){if(w<=0.001)return;const J=a.P,C=a.C;if(w>1)w=1;for(const k in P){J[k]+=(P[k]-J[k])*w;if(ANM_BACAK[k]===1)C[k]*=1-w;}}
function yumusak(a,ad,hedef,hiz,dt){const v=a.w[ad]||0;a.w[ad]=v+(hedef-v)*Math.min(1,dt*hiz);return a.w[ad];}
/* kök yönü hedefe yaklaşır; tavan verilirse en çok tavan rad/sn (A2a: motorun ani yön atlamaları çizimde tek karede dönüş olmaz) */
function aciYumusak(a,h,dt,hiz,tavan){let d=h-a.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));let s=d*Math.min(1,dt*hiz);if(tavan){const m=tavan*dt;if(s>m)s=m;else if(s<-m)s=-m;}a.yaw+=s;}
const tepe=(t,s)=>Math.sin(Math.PI*clamp(t/s,0,1));
/* giriş-tutma-çıkış zarfı: g sn'de yükselir, sürenin son c sn'sinde iner */
const anmZarf=(t,s,g,c)=>Math.max(0,Math.min(1,t/g,(s-t)/c));
/* (x,z) noktası oyuncunun sağında mı (motor koordinatı; sağ = yon + 90°) */
const anmSagda=(p,x,z)=>-(x-p.x)*Math.sin(p.yon)+(z-p.z)*Math.cos(p.yon)>0;
const ANM_DUSUS=new Map();
/* T5f: temas olayından tepki (animasyonOlay): {tur: cekme | itme | tepki, t0 (çizim saati), sure, hedef {x,z}}; oyuncu başına son olay */
const ANM_TEMAS=new Map();
/* T6f: kayarak müdahalenin topa değdiği motor adımı (animasyonOlay 'mudahaleSonuc'); anmKok o karede uzanan ayağı topa getirir */
const ANM_KAYMA=new Map(),ANM_MUD=new Map(),ANM_KV=new THREE.Vector3();
/* iki tam pozun karışımı (T: tampon; c 0 → A, 1 → B) */
function anmPozKaris(T,A,B,c){for(let i=0;i<ANM_KANAL.length;i++){const k=ANM_KANAL[i],x=A[k]||0;T[k]=x+((B[k]||0)-x)*c;}return T;}
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
/* ---- A7 (2026-10-17; gerçekçilik planı §4 "A7", Ek G1): hareket verisinin adım döngüsü eğrileri (js/hareket-egrileri.js: CMU mocap ve Fukuchi 2017
   koşu verisinden yalnız sayı tabloları). Bantlar boya göre hızdan (vn) karışır: yürüyüş → koşu gecis aralığında, koşu bantları (2,5 / 3,5 / 4,5 m/sn)
   arasında doğrusal, 4,5'in üstü depar bandına (uzatma) ANM.egri.depar dozuyla. Veri, çizimin evresinde (u: ayak 0'ın basışından) duruş ve salınım
   ayrı ayrı gerilerek okunur (çizimin temas payı beta ↔ bandınki). Yürüyüş katmanı eğrileri ileri harekette kullanır; yana ve geri adımda,
   yerinde dönüşte ve çok yavaşta eski elle yazılmış eğriler kalır ---- */
const ANM_EG=(()=>{if(typeof HAREKET_EGRI==='undefined')return null;const H=HAREKET_EGRI,K=H.kanal;
  return{n:H.harmonik,g:H.gecis,nY:H.bant.filter(b=>b.yuru).length,B:H.bant.map(b=>({v:b.v,beta:b.beta,F:K.map(k=>Float64Array.from(b.F[k]))}))};})();
const ANM_EGW=new Float64Array(ANM_EG?ANM_EG.B.length:1),ANM_EGD=[0,1,2,3].map(()=>new Float64Array(8)),ANM_EGA=new Float64Array(2),ANM_DER=Math.PI/180,ANM_EGKG=[1.8,3];
/* bant karışımı → ANM_EGW (bant başına ağırlık): yürüyüş bantları arasında ve koşu bantları arasında yumuşak geçiş (smoothstep; bant noktalarında türev
   sürekli — doğrusal karışımın köşesinde kol hızı değişirken dirsek karede 6–9° kırılıyordu), ikisi g aralığında yine yumuşakça birleşir (bacaklar
   verinin yürüyüş → koşu geçişinde, H.gecis 2–2,5 m/sn; kollar ANM_EGKG 1,8–3: veride dirsek 0,5 m/sn içinde 79° bükülüyor, hızlanan oyuncuda karede
   10°'den çok dönüyordu). kosu: yalnız koşu bantları (temas payı için). Döndürdüğü: karışımın temas payı */
function anmEgriKaris(vn,kosu,g){const E=ANM_EG,B=E.B,n=B.length,nY=E.nY,W=ANM_EGW;g=g||E.g;let v=vn;if(kosu&&v<g[1])v=g[1];
  if(v>B[n-2].v)v=B[n-2].v+(v-B[n-2].v)*ANM.egri.depar;
  W.fill(0);
  const ara=(i0,i1,k)=>{if(k<=0)return;if(v<=B[i0].v){W[i0]+=k;return;}for(let i=i0;i<i1;i++)if(v<B[i+1].v){let w=(v-B[i].v)/(B[i+1].v-B[i].v);w=w*w*(3-2*w);W[i]+=k*(1-w);W[i+1]+=k*w;return;}W[i1]+=k;};
  let wk=clamp((v-g[0])/(g[1]-g[0]),0,1);wk=wk*wk*(3-2*wk);ara(0,nY-1,1-wk);ara(nY,n-1,wk);
  let b=0;for(let i=0;i<n;i++)b+=W[i]*B[i].beta;return b;}
/* kanallar (uyluk, diz, omuz, dirsek, egim, legen, gogus: derece; kalcaH: oran) çizimin evresinde u ∈ [0, 1) ve temas payında beta → o[8];
   g (A9, isteğe bağlı): harmonik başına kazanç (g[k], k = 1 … n; ortalama F[0] değişmez) */
function anmEgriDeger(u,beta,o,g){const E=ANM_EG;o.fill(0);
  for(let j=0;j<E.B.length;j++){const w=ANM_EGW[j];if(w<=0)continue;const b=E.B[j];
    const ub=u<beta?u/beta*b.beta:b.beta+(u-beta)/(1-beta)*(1-b.beta),t=6.283185307179586*ub,c1=Math.cos(t),s1=Math.sin(t);
    for(let c=0;c<8;c++){const F=b.F[c];let ck=c1,sk=s1,s=F[0];for(let k=1;k<=E.n;k++){s+=g?(F[2*k-1]*ck+F[2*k]*sk)*g[k]:F[2*k-1]*ck+F[2*k]*sk;const cn=ck*c1-sk*s1;sk=sk*c1+ck*s1;ck=cn;}o[c]+=w*s;}}
  return o;}
/* A9 (kolSigma): kol eğrisinin zaman ekseninde sıfır gecikmeli Gauss yumuşatması — adım döngüsünün frekansında (f = kadans / 2, Hz) k. harmoniğin kazancı
   exp(−(2π·k·f·σ)² / 2) → ANM_EGG; yavaşta ~1, deparda ve frende (kadans yüksek) üst harmonikler söner */
const ANM_EGG=new Float64Array((ANM_EG?ANM_EG.n:6)+1);
function anmEgriKazanc(f,sig){const g=ANM_EGG;g[0]=1;for(let k=1;k<g.length;k++){const x=6.283185307179586*k*f*sig;g[k]=Math.exp(-0.5*x*x);}return g;}
const anmEgriOrt=c=>{let s=0;for(let j=0;j<ANM_EG.B.length;j++)if(ANM_EGW[j]>0)s+=ANM_EGW[j]*ANM_EG.B[j].F[c][0];return s;};
/* uyluk ve diz açısından (D[0], D[1]) tabanın kalça eklemine göre yeri (model birimi; ileri, yukarı): uyluk 0,44, baldır 0,5, taban 0,05 önde (anmBacakIK) */
function anmEgriAyak(D,o){const t=D[0]*ANM_DER,s=t-D[1]*ANM_DER;o[0]=0.44*Math.sin(t)+0.5*Math.sin(s)+0.05*Math.cos(s);o[1]=-0.44*Math.cos(t)-0.5*Math.cos(s)+0.05*Math.sin(s);return o;}
function anmYuruyus(a,p,spd,dt,sx,sy){
  const P=a.P,A=ANM.adim,T=a.T,E=ANM.egilme,K=a.kim||anmKimlik(a,p),TAU=6.283185307179586;
  /* gerçek hız: çizilen yerin iki motor adımı arasındaki değişimi; yumuşatılmış hız ve ivme (dünya m/sn) */
  let vx=0,vz=0;if(p&&spd>0){vx=(p.x-a.px)/ADIM;vz=(p.z-a.pz)/ADIM;if(vx*vx+vz*vz>225)vx=vz=0;}
  /* A9 (govdeIvme): ivme (eğilmenin ve yatışın kaynağı) kritik sönümlü yayla (ω rad/sn) — birinci derecede motorun hızı bir adımda değişince (yön değişimi, fren)
     ivmenin hızı ilk karede birden değişiyor, gövde eğimi (lean) ve yatışı (hz) karede 0,06 rad'dan çok kırılıyordu; 0: eski (birinci derece, 6/sn) */
  if(dt>0){const k=Math.min(1,dt*12),ox=a.wvx,oz=a.wvz;a.wvx+=(vx-a.wvx)*k;a.wvz+=(vz-a.wvz)*k;const hax=(a.wvx-ox)/dt,haz=(a.wvz-oz)/dt,iY=ANM.a9&&ANM.a9.govdeIvme>0?ANM.a9.govdeIvme:0;
    if(iY>0){const n=anmAltAdim(iY,dt),h=dt/n;for(let s=0;s<n;s++){a.awxV+=(iY*iY*(hax-a.awx)-2*iY*a.awxV)*h;a.awx+=a.awxV*h;a.awzV+=(iY*iY*(haz-a.awz)-2*iY*a.awzV)*h;a.awz+=a.awzV*h;}}
    else{const k2=Math.min(1,dt*6);a.awx+=(hax-a.awx)*k2;a.awz+=(haz-a.awz)*k2;}}
  const sY=Math.sin(a.yaw),cY=Math.cos(a.yaw),vf=a.wvx*sY+a.wvz*cY,vr=-a.wvx*cY+a.wvz*sY,v=Math.sqrt(vf*vf+vr*vr);
  const af=a.awx*sY+a.awz*cY,ar=-a.awx*cY+a.awz*sY;
  /* A3a/A3b (2026-10-13; Ek G0.2–G0.3): fren ve dönüş ağırlıkları motorun ivmesinden okunur (p._iax, p._iaz: adımdaki hız değişimi, ÷ ADIM = m/sn²;
     sarsıntı sınırlı, kare hızından bağımsız). Fren: hızın yönündeki bileşen −1,5 m/sn²'nin altında (−4'te tam), koşuda (> 1,5 m/sn); dönüş: hızın yönünün dönüş hızı (dik bileşen ÷ hız)
     1,5 rad/sn'nin üstünde, koşuda (> 2 m/sn). Ağırlıklar ~0,1 sn'lik yayla izlenir */
  if(dt>0){let fH=0,dH=0;const ms=p&&p.spd||0;
    if(ms>1.5&&p._iax!=null){const ux=p.vx/ms,uz=p.vz/ms,aV=(p._iax*ux+p._iaz*uz)/ADIM,aD=(p._iaz*ux-p._iax*uz)/ADIM;
      fH=clamp((-aV-1.5)/2.5,0,1)*clamp((ms-1.5)/2,0,1);if(ms>2)dH=clamp((Math.abs(aD/ms)-1.5)/2,0,1)*clamp((ms-2)/2,0,1);}
    const vkw=a.vk&&a.vk.kw||0;fH*=1-vkw;dH*=1-vkw;   /* vuruş katmanı etkinken (bacaklar vuruşta) fren ve dönüş duruşu yok */
    a.fr+=(fH-a.fr)*Math.min(1,dt*10);a.dn+=(dH-a.dn)*Math.min(1,dt*12);}
  const fr=a.fr,dn=a.dn,FR=ANM.fren,DN=ANM.donus;
  if(v>0.05&&dt>0){const k=Math.min(1,dt*(3+4*v/sx));a.mX+=(-vr/v-a.mX)*k;a.mZ+=(vf/v-a.mZ)*k;const L=Math.sqrt(a.mX*a.mX+a.mZ*a.mZ)||1;a.mX/=L;a.mZ/=L;}
  const mX=a.mX,mZ=a.mZ,wF=mZ>0?mZ*mZ:0,wB=mZ<0?mZ*mZ:0,wS=mX*mX;
  /* kök dönüşü; ayakların yönü yalnız basışta köke yaklaşır: aradaki fark yerinde dönüşte basma ister, kalça bu farkla geride kalır */
  if(dt>0){const d=anmAci(a.yaw-a.yawO);a.don+=(Math.abs(d)/dt-a.don)*Math.min(1,dt*14);
    if(p&&p.yon!=null){const ym=Math.atan2(Math.cos(p.yon),Math.sin(p.yon));if(a.yonM!==null)a.donY+=(anmAci(ym-a.yonM)/dt-a.donY)*Math.min(1,dt*20);a.yonM=ym;}}a.yawO=a.yaw;
  if(a.ayakYaw===null)a.ayakYaw=a.yaw;
  const fark=anmAci(a.yaw-a.ayakYaw),piv=v<1.2?clamp((Math.abs(fark)-0.05)/0.2+a.don/3,0,1)*(1-v/1.2):0;   /* A3b: yerinde dönüşte basma erken başlar (eskiden fark 0,08, dönüş hızı /4, yay dt·6) */
  /* adım boyu (dünya m) ve kadans; koşu payı (yürüyüş → koşu 2–2,5 m/sn, boya göre) */
  const A9ad=ANM.a9||{};   /* A9-adim */
  const vn=v/Math.sqrt(sy),kos=clamp((vn-2)/0.5,0,1),Lf=anmAdimBoyu(vn)*sy*(1+(A9ad.kosuBoy||0)*clamp((vn-3)/2,0,1)),yor=clamp((0.6-(p&&p.enerji!=null?p.enerji:1))/0.6,0,1);   /* yor: yorgun koşu */
  /* T4h (2026-10-09): hızlı yan harekette (motorun vuruş hazırlığında gövde pas yönüne erken döner, oyuncu topa koşmayı sürdürür) yan adım 2 m/sn'den
     sonra uzar (yan galop, çapraz adım; 4,5 m/sn'de 0,95 m) ve adım sıklığı insan sınırında kalır (en çok 4,8 adım/sn): eskiden yan koşuda 7–9
     adım/sn çıkıyor, dizler karede 20°'den çok sıçrıyordu */
  const yEn=A9ad.yanEn||A.yanEn,Ly=clamp(yEn+A.yanHiz*v,yEn,A9ad.yanTavan||A.yanTavan),Lyan=v>2?lerp(Ly,0.95,clamp((v-2)/2.5,0,1)):Ly;
  const wS2=wS*wS,wFB=wF+wB||1,gO=A9ad.geri?lerp(A9ad.geri,A.geri,kos):A.geri,L=Math.max(0.12,v/4.8,((1-wS2)*(wF*Lf+wB*gO*Lf)/wFB+wS2*sy*Lyan)*K.adim*a.gAdim*(1-FR.adim*fr));   /* A3a: frende kısa kesik adım (kadans v/L ile artar) */
  let cad=Math.max(v/L,piv*A.donusKadans*(0.7+0.5*Math.min(1,Math.abs(fark)/1.5)),clamp((a.sapma-0.28)/0.2,0,1)*A.donusKadans);
  /* durunca havadaki ayak adımını tamamlar (süzülerek yerine gitmez) */
  if(cad<1.6&&(!a.anc[0]||!a.anc[1]))cad=1.6;
  if(dt>0){a.cadS+=(cad-a.cadS)*Math.min(1,dt*(10+DN.basma*piv));cad=a.cadS;}   /* A3b: yerinde dönüşte basma gecikmesiz başlar (ayak burkulmaz) */
  /* A7: veri eğrilerinin ağırlığı — ileri harekette (wF), yerinde dönüşte ve 0,4–0,9 m/sn'nin altında söner. Koşuda temas payı veriden (RBDS'nin kuvvet
     plakası; yürüyüşte eski değer: CMU'nun temas tespiti yürüyüşte payı ~0,04 büyük buluyor) */
  const EG=ANM.egri,egAcik=!!(ANM_EG&&EG.acik);
  /* ağırlık ~0,15 sn'lik yayla izlenir: yön değişince eski ve veri pozu arasında (özellikle dirsekte ~50°) sıçramasın */
  /* tavırlarda (top saklama, jokey, bekletme, kalecinin hazır duruşu) yavaş ve düzensiz adım kendi yolunda kalır: veri yolu A6a'nın top saklama ayarını
     bozuyordu (--koru 30: kayma %14,2 → 24,9, salınımdaki ayak yere sürtüyordu) */
  if(egAcik&&dt>0){const hW=wF*clamp((v-0.4)/0.5,0,1)*(1-piv)*(p&&p.tavir?0:1);a.egW+=(hW-a.egW)*Math.min(1,dt*7);
    /* A9 (kolYay): kolların veri ağırlığı (a.egWk) aynı hedefi kritik sönümlü yayla izler (ω rad/sn; hızı sürekli) — birinci derecede hedef sıçrayınca (tavır,
       yerinde dönüşün piv'i) ağırlığın hızı ilk karede birden değişiyor, eski ve veri kolunun farkıyla (dirsekte ~50°) kol karede 0,06 rad'dan çok kırılıyordu;
       bacaklar, eğim ve leğen eski ağırlıkta kalır (ayak yolu değişmez); 0: kollar da eski ağırlıkta */
    const yW=ANM.a9&&ANM.a9.kolYay>0?ANM.a9.kolYay:0;
    if(yW>0){const n=anmAltAdim(yW,dt),h=dt/n;for(let s=0;s<n;s++){a.egWkV+=(yW*yW*(hW-a.egWk)-2*yW*a.egWkV)*h;a.egWk+=a.egWkV*h;}if(a.egWk<0){a.egWk=0;a.egWkV=0;}else if(a.egWk>1){a.egWk=1;a.egWkV=0;}}}
  const eW=egAcik?a.egW:0,egB=egAcik?anmEgriKaris(vn,true):0;
  const betaH=lerp(lerp(clamp(0.62-0.03*vn,0.55,0.62),lerp(clamp(0.4-0.025*(vn-2.5),0.25,0.4),egB,eW*EG.ayak)+0.04*yor,kos),0.45,piv)+(DN.yer*dn+FR.yer*fr)*Math.min(1,v/1.5);   /* A3: fren ve dönüş adımı yerde uzun kalır (keskin dönüşte basma düşük hızda gelir) */if(dt>0)a.beta+=(lerp(betaH,0.42,wS2*Math.min(1,v))-a.beta)*Math.min(1,dt*6);const beta=a.beta;
  const vk=a.vk;   /* A2b: vuruşta adım döngüsü durur (bacaklar vuruş katmanında) */
  /* T10f (Ek G4): topallama (p.topal) — sakat bacak (numaradan) yerdeyken evre kb = 1 + (1 − oran)·1,15 kat hızlı ilerler, öbür bacakta döngü
     süresi aynı kalacak kadar yavaşlar: sakat bacağın basma süresi öbürününkinin ~oran'ı (yürüyüşte ve koşuda 0,6–0,7) */
  let tHiz=1;a.topU=-1;const tp=p&&p.topal;
  if(tp&&tp.oran>0&&tp.oran<1&&!(vk&&vk.evre>0)&&v>0.3){if(a.topBacak==null)a.topBacak=h2((p.no|0)*7+2,(p.team|0)+1)<0.5?0:1;
    const kb=1+(1-tp.oran)*1.15;let ub=a.ph/TAU+a.topBacak*0.5;ub-=Math.floor(ub);a.topU=ub;tHiz=ub<beta?kb:(1-beta)/Math.max(0.05,1-beta/kb);}
  if(dt>0&&cad>0.02&&!(vk&&vk.dondur)){a.ph+=dt*Math.PI*cad*tHiz;if(a.ph>TAU)a.ph-=TAU;}
  const Lm=L/sx,R=2*beta*Lm*Math.min(1,v/Math.max(1e-3,cad*L)),run=Math.min(1,v/7.5);
  let kal=clamp(A.kaldirEn+A.kaldirHiz*v,A.kaldirEn,A.kaldirTavan)*(wF+0.85*wB+0.75*wS)*K.kaldir*(1-0.2*yor*kos)*a.gKal;kal=Math.max(Math.min(kal,Math.max(0.035,0.5*L)),DN.kaldir*piv)/sy;   /* A3b: yerinde dönüşün adımı yerden belirgin kalkar (eskiden ~4 cm: sürüyordu) */
  /* A7: salınan ayak veri açılarının ileri kinematiğinden (anmEgriAyak: uyluk ve diz → taban, kalça eklemine göre; IK aynı açıları geri verir).
     Yatayda uçlar çizimin duruş geometrisinde kalır (verinin kalkış ve basış yerine farkı salınım boyunca yumuşakça kapanır); dikeyde taban kalçanın
     o anki yüksekliğine göre, kalkışta ve inişte yere söner (modelde ayak bileği yok: veride bilek kalkışta ~0,1–0,17 yukarıda, ayak ucu itiyor),
     en az yerden EG.aciklik·(1 − (2g − 1)⁴) ve uçların seviyesinden 0,012·(1 − (2g − 1)⁴) yukarıda (eski yolun geç ve kısa inişi: inişten önce yere sürtmez). Kimliğin kaldırması ve yorgunluk salınımdaki diz bükülmesine. Duruşun ortası (zOff) verinin basış ve kalkış
     yerlerinin ortası. Kalça yüksekliği verinin eğrisi + duruşun ortasında açılarla tutarlı kayma (egDy: kalça CMU'dan, koşuda diz RBDS'den; ikisi
     ~4 cm tutmuyor, duruşta bacağı açılar belirlesin) */
  const ED=ANM_EGD[0],ED1=ANM_EGD[1],ED2=ANM_EGD[2],EA=ANM_EGA;let egS0=0,egS1=0,egDy=0,egKf=1;
  if(eW>0){anmEgriKaris(vn,false);anmEgriAyak(anmEgriDeger(beta,beta,ED),EA);egS0=EA[0];anmEgriAyak(anmEgriDeger(0,beta,ED),EA);egS1=EA[0];
    anmEgriAyak(anmEgriDeger(beta/2,beta,ED),EA);egDy=-EA[1]-0.944*ED[7];
    egKf=K.kaldir*(1-0.1*yor*kos)*a.gKal;
    const u1=a.ph/TAU;let u2=u1+0.5;u2-=Math.floor(u2);anmEgriDeger(u1,beta,ED1);anmEgriDeger(u2,beta,ED2);}
  const gen=Math.max(0,(Math.abs(mX)*R-0.12)/2)+a.gGen,zOff=lerp(0.025-0.05*run-0.12*R*kos*wF,(egS0+egS1)/2*wF,eW*EG.ayak)+FR.ayak*fr*wF,yuv=A.yuvar*4*Math.min(1,R/0.5),yuvA=yuv*(1.1+1.9*run),Lr=0.92,W=a.W,Dv=a.D,us=lerp(1,0.75,kos);
  let need=9,sapma=0;const u0=a.ph/TAU,ck=a.ck;
  const A8y=ANM.a8,dLow=!!(A8y&&A8y.dokAlcak&&a.dokLow&&a.dokT>=0),dLowW=dLow?tepe(a.dokT,a.dokS):0,capaC=!!(A8y&&A8y.capaCiz);   /* A8 */
  /* A9-vurus2 (salIK): salınan bacağın IK uzanması (kalça eklemi → taban) veri dizinin ileri kinematiğindeki uzanmayı aşmaz (a.ikS: veri uzanması, a.ikW: ağırlık,
     a.ikT: bu karenin döngü hedefi — anmBacakIK okur). Koşuda çizilen duruş verininkinden uzun (kayma bağı: ±0,5·R, veride ±0,43), adımın uçlarında hedef
     veri yolundan kaydırılır (kalkışta geriye, inişte öne; Hermite uçları ayrıca 0,14·R taşar) ve duruşun çapası (Dv) salınıma taşınır: hedef bacağın
     erişimini aşıyor, yumuşak IK dizi düzlükte kilitleyip açıyordu — geç salınımda diz karede 20–30° açılıyor, kalkıştan sonra düz kalıp karede 20–28°
     bükülerek veriye yetişiyordu (A9b-0: eylemsiz bacak >20° sıçramasının %64'ü geç salınımda uzanma, %25'i erken salınımda bükülme; veri en çok 12–18°/kare).
     Ağırlık koşuda (kos) ve veri yolunda (eW), kalkıştan sonra 0,1 salınımda yumuşakça gelir; vuruş katmanında (1 − kw), dokunuşun alçak süpürmesinde ve
     çalım salınımında söner; başka bir katman hedefi değiştirdiyse (müdahale, blok) anmBacakIK'da söner. Yön değişmez (uyluk hedefe), yalnız uzaklık */
  /* A9-vurus2 (salYan, m): salınımda yana açmanın yumuşak tekilliği — a.ikA (ağırlık; koşuda, döngünün salınımında, veri yolundan bağımsız) anmBacakIK'da */
  const sIK=A9ad.salIK||0,sYa=A9ad.salYan||0;if((sIK||sYa)&&!a.ikW){a.ikW=new Float32Array(2);a.ikS=new Float32Array(2);a.ikT=new Float32Array(6);a.ikA=new Float32Array(2);}else if(!sIK&&!sYa&&a.ikW){a.ikW.fill(0);a.ikA.fill(0);}
  const kT=!!A9ad.kalTut;   /* A9-adim: salınımın yüksekliği kalkıştan beri en yükseği (hız düşünce ayak salınımda inmez) */
  for(let i=0;i<2;i++){let u=u0+i*0.5;u-=Math.floor(u);let q,h=0,g=0;const yer=u<beta;
    /* salınım: yatayda Hermite eğrisi (kalkışta ve inişte ayak yere göre durur); dikeyde 1 − (2g−1)⁴: hızlı kalkış, düz tepe, geç ve kısa iniş
       (uçlarda eğim sonlu); koşuda tepe öne kayar (topuk erken kalkar) */
    if(yer){q=0.5-u/beta;if(kT)a.kalS[i]=0;}else{g=(u-beta)/(1-beta);const m=-(1-beta)/beta;q=g*g*(3-2*g)-0.5+m*g*(2*g-1)*(g-1);const xg=2*Math.pow(g,us)-1;h=(kT?(a.kalS[i]=Math.max(a.kalS[i],kal)):kal)*(1-xg*xg*xg*xg);
      if(eW>0){anmEgriDeger(u,beta,ED);const sn=Math.sin(Math.PI*g);ED[1]*=1+(egKf-1)*sn;anmEgriAyak(ED,EA);if(sIK)a.ikS[i]=Math.sqrt(EA[0]*EA[0]+EA[1]*EA[1]);   /* A9-vurus2 */
        const w=eW*EG.ayak,S=g*g*(3-2*g),sN=EA[0]+(zOff-0.5*R-egS0)*(1-S)+(zOff+0.5*R-egS1)*S,qN=R>1e-3?(sN-zOff)/R:q,
          zf=g<0.15?(g/0.15)*(g/0.15)*(3-2*g/0.15):g>0.88?((1-g)/0.12)*((1-g)/0.12)*(3-2*(1-g)/0.12):1,
          yU=-0.034+lerp(yuvA,yuv,S)*0.25,xg4=(2*g-1)*(2*g-1)*(2*g-1)*(2*g-1),yN=Math.max(lerp(yU,0.91+a.dyR+EA[1],zf),-0.034+EG.aciklik*(1-xg4),yU+0.012*(1-xg4));
        /* yatayda uçlarda eski Hermite yolu (kalkışta ve inişte ayak yere göre durur, duruşun hızıyla sürekli): veri yolu ortada */
        const zq=g<0.2?(g/0.2)*(g/0.2)*(3-2*g/0.2):g>0.8?((1-g)/0.2)*((1-g)/0.2)*(3-2*(1-g)/0.2):1,qD=lerp(q,qN,zq);
        q=lerp(q,qD,w);h=lerp(h,yN+0.034-(qD*mZ<0?yuvA:yuv)*qD*qD,w);}}
    if(dLow&&i===a.dokAyak&&!yer)h*=1-0.55*dLowW;   /* A8 (dokAlcak): dokunan ayak alçaktan süpürür */
    const sd=i?1:-1,j=i*3,k2=i*2;let x=sd*(0.1+gen)+mX*q*R,z=zOff+mZ*q*R,y=-0.034+h+(q*mZ<0?yuvA:yuv)*q*q;
    /* T4g çalım salınımı (makas, gövde çalımı, şut çalımı; anmCkBasla): pencere açıkken kalkan ayağın salınımı işaretlenir ve yolu sapar (dışa
       süpürme, yüksek kaldırma, öne ya da geri); iniş, sapmanın son yanal payıyla (geniş basış) kilitlenir */
    const ckS=!!ck&&ck.sIdx===i;
    if(ckS&&yer&&ck.sAktif&&!a.anc[i]){x+=ck.sSon;ck.sAktif=false;ck.sBitti=true;}
    /* yerdeki ayak dünyaya çivilenir; sapma 0,6 m'yi aşarsa sürüklenir. Basışta ayakların yönü köke yaklaşır. Kalkan ayak sapmayı salınımda kapatır */
    if(yer){if(!a.anc[i]){W[k2]=a.x+(x*cY+z*sY)*sx;W[k2+1]=a.z+(-x*sY+z*cY)*sx;
        /* A8 (capaCiz): önceki karede bir poz bu bacağı tutuyorduysa (IK güveni < 0,6: alış, dokunuş …) ayak çizildiği yere basar — eskiden çapa döngünün yerine
           konuyor, poz sönünce ayak oraya kayıyordu */
        if(capaC&&a.legC&&a.legC[i]<(ANM.a9&&ANM.a9.capaIK?0.99:0.6)&&a.m){const kb=i?a.m.kR:a.m.kL;if(kb){ANM_KV.set(0,-0.5,0.05).applyMatrix4(kb.matrixWorld);W[k2]=ANM_KV.x;W[k2+1]=ANM_KV.z;}}
        a.anc[i]=1;a.ayakYaw+=anmAci(a.yaw-a.ayakYaw)*(0.85+0.15*dn);}
      const dx=W[k2]-a.x,dz=W[k2+1]-a.z,ax=(dx*cY-dz*sY)/sx,az=(dx*sY+dz*cY)/sx;let ex=ax-x,ez=az-z;const e=Math.sqrt(ex*ex+ez*ez);
      if(e>0.6){const k=0.6/e;ex*=k;ez*=k;W[k2]=a.x+((x+ex)*cY+(z+ez)*sY)*sx;W[k2+1]=a.z+(-(x+ex)*sY+(z+ez)*cY)*sx;}
      x+=ex;z+=ez;Dv[k2]=ex;Dv[k2+1]=ez;if(e>sapma)sapma=e;}
    else{if(ckS&&a.anc[i]&&ck.sAcik&&!ck.sAktif&&!ck.sBitti){ck.sAktif=true;ck.sG0=g;}
      a.anc[i]=0;const f=1-g*g*(3-2*g);x+=Dv[k2]*f;z+=Dv[k2+1]*f;
      if(ckS&&ck.sAktif){const s=Math.sin(Math.PI*g),w=ck.sW*clamp((g-ck.sG0)/0.2,0,1),sm=g*g*(3-2*g);ck.sSon=ck.sX*ck.sL*sm*w;
        x+=ck.sX*ck.sA*Math.pow(s,0.8)*w+ck.sSon;y+=ck.sH*s*w;z+=(ck.sZ+ck.sZ2*(1-g))*s*w;}}
    T[j]=x;T[j+1]=y;T[j+2]=z;a.qA[i]=2*q*mZ;
    if(sIK||sYa){let cw=0,ca=0;if(!yer){const fi=Math.min(1,g/0.1);ca=kos*fi*fi*(3-2*fi);if(dLow&&i===a.dokAyak)ca*=1-dLowW;if(ckS&&ck.sAktif)ca*=1-clamp(ck.sW*clamp((g-ck.sG0)/0.2,0,1),0,1);cw=eW>0?sIK*eW*EG.ayak*ca:0;}a.ikW[i]=cw;a.ikA[i]=sYa?ca:0;}   /* A9-vurus2 */
    /* yerdeki ayağa uzanmak için kalçanın inmesi gereken yer */
    if(yer){const dx=x-sd*0.1,dh2=dx*dx+z*z,iv=Math.sqrt(Math.max(0.04,Lr*Lr-dh2))+y-0.91;if(iv<need)need=iv;}
    /* A7: kalça uçuşta veriyle yükselir; inişten önce gelen ayağın basış yerine (salınımın son %35'i), kalkıştan sonra kalkan ayağa (ilk %25) uzanma
       sınırı sönerek sürer — sınır basışta birden gelince kalça karede 3 cm'den çok iniyordu */
    else if(eW>0){let iv=0;
      if(g<0.25){const dx=x-sd*0.1,dh2=dx*dx+z*z,s=g/0.25;iv=(Math.sqrt(Math.max(0.04,Lr*Lr-dh2))+y-0.91)*(1-s*s*(3-2*s));}
      else if(g>0.65){const dx=sd*gen+mX*0.5*R,zl=zOff+mZ*0.5*R,s=(g-0.65)/0.35;iv=(Math.sqrt(Math.max(0.04,Lr*Lr-dx*dx-zl*zl))+yuv*0.25-0.944)*s*s*(3-2*s);}
      iv*=eW*EG.kalca;if(iv<0&&iv<need)need=iv;}}
  a.sapma=sapma;
  /* A2b vuruş katmanı: ayak hedefleri vuruşun hedeflerine (çıkışta son vuruş hedeflerinden döngüye) ağırlıkla geçer */
  if(vk&&vk.kw>0){const w=vk.kw,V=vk.evre===5?vk.Te:vk.T;for(let k=0;k<6;k++)T[k]+=(V[k]-T[k])*w;}
  if(sIK||sYa){if(vk&&vk.kw>0){a.ikW[0]*=1-vk.kw;a.ikW[1]*=1-vk.kw;a.ikA[0]*=1-vk.kw;a.ikA[1]*=1-vk.kw;}for(let k=0;k<6;k++)a.ikT[k]=T[k];}   /* A9-vurus2 */
  /* kalça yüksekliği: yerdeki ayağa uzanma ve koşuda yaylanma (duruşun ortasında alçak, uçuşta yüksek); hızlı kritik sönümlü yayla izlenir */
  if(need>8)need=lerp(a.dyR,0,eW*EG.kalca);need=Math.min(0,need);   /* A7: iki ayak havadayken kalça eskiden korunurdu (yalnız inebilirdi); veride uçuşta yükselir */
  if(vk&&vk.kw>0&&vk.evre!==5)need=lerp(need,vk.need<8?Math.min(0,vk.need)+vk.dy:a.dyR,vk.kw);   /* iki ayak havadayken kalça yüksekliği korunur */
  const yay=kos*K.yay*(1+0.5*yor)*lerp(ANM.yaylanma[0],ANM.yaylanma[1],clamp((v-3)/5,0,1))/sy;
  /* iniş sınırı: gerçek yürüyüşte kütle merkezi 4–5 cm iner (geride kalan ayağın topuğu kalkar; hızlı yürüyüşte daha çok); yetişemeyen ayağı yumuşak IK kısa bırakır */
  /* A7: kalça yüksekliği veriden (kalça eklemlerinin yüksekliği / ayaktaki 0,944; yerdeki ayağa uzanma sınırı aynı) */
  let dyC=-yay*Math.cos(2*TAU*(u0-beta/2)),dyA=-lerp(0.09,0.1,kos)/sy;
  if(eW>0){const d=0.944*(ED1[7]-1)+egDy;dyC=lerp(dyC,d,eW*EG.kalca);dyA=Math.min(dyA,d-0.01);}
  const dyH=Math.max(Math.min(need,dyC),dyA);
  if(dt>0){const w=34,n=anmAltAdim(w,dt),h=dt/n;for(let s=0;s<n;s++){a.dyV+=(w*w*(dyH-a.dyR)-2*w*a.dyV)*h;a.dyR+=a.dyV*h;}}
  P.dy=Math.min(-a.gDrop,a.dyR)-(a.gTop||0)-(FR.kalca*fr+DN.kalca*dn)/sy;   /* A3: frende ve dönüşte kalça alçalır (dizler bükülür) */
  /* eğilme: koşu duruşu (kimlikle), ivmeden öne/arkaya, virajda içe (atan(a/g)) */
  /* A3d: depar başında (hız düşükken) ivmenin öne eğdirme tavanı yüksek (Ek G0.2: ilk adımlarda 40–50°), hız 3 m/sn'ye çıkınca normal */
  /* A7: koşu duruşunun eğimi veriden (kalça eklemleri → omuzlar; yürüyüşte 2° kabul, hareket-egrileri.py); ivme, fren ve viraj terimleri üstte aynı */
  const wSur=a.sw[ANM_S.tasi]||0;   /* A7b: top sürme (yuvanın ağırlığı, önceki kare; yayla yumuşak) */
  P.lean=Math.min(0.75,(lerp(E.kosu*run,ED1[4]*ANM_DER,eW*EG.egim)+K.egim*kos+EG.surus.egim*wSur)*wF+0.05*wB*Math.min(1,v)+clamp(Math.atan(af/9.81)*E.ivme,E.ivmeAlt,lerp(E.ivmeUstDepar,E.ivmeUst,clamp(v/3,0,1)))+0.6*a.gDrop);
  P.hz=clamp(Math.atan(ar/9.81)*E.yatis,-E.yatisTavan,E.yatisTavan)*Math.min(1,v/3);
  /* T10f: topallayan sakat bacağa basarken gövde o yana yatar, kalça biraz çöker */
  if(a.topU>=0&&a.topU<beta){const s=Math.sin(Math.PI*a.topU/beta);P.hz+=(a.topBacak?-0.09:0.09)*s;a.gTop=0.02*s;}else a.gTop=0;
  /* kalça: hareket çizgisine döner (geri koşuda düz), adımla salınır, dönüşte ayakların yönünde geride kalır; gövde ters döner ve kökle gider */
  let fl=Math.atan2(-mX,mZ);if(fl>1.5708)fl-=Math.PI;else if(fl<-1.5708)fl+=Math.PI;
  /* tam yana harekette kalça kare kalır (±90°'de yön değiştirirken kalça öbür yana kapanmaz); kritik sönümlü yayla */
  const fy=Math.abs(fl)/1.5708,hyH=-clamp(fl*0.7,-ANM.kalcaDonus,ANM.kalcaDonus)*Math.min(1,v/1.5)*(1-fy*fy*fy*fy)+a.gHy;
  if(dt>0){const w=9,n=anmAltAdim(w,dt),h=dt/n;for(let s=0;s<n;s++){a.hyV+=(w*w*(hyH-a.hy)-2*w*a.hyV)*h;a.hy+=a.hyV*h;}}
  if(dt>0){const w=12,h=clamp(-fark*ANM.kalcaGecikme,-0.5,0.5),n=anmAltAdim(w,dt),k=dt/n;for(let s=0;s<n;s++){a.hyTV+=(w*w*(h-a.hyT)-2*w*a.hyTV)*k;a.hyT+=a.hyTV*k;}}
  /* A7: leğenin ve omuz hattının adım salınımı veriden (koşuda leğen yürüyüşün tersine döner: sağ ayak basarken sağ kalça geride; omuzlar karşıt) */
  let sal=lerp(ANM.kalcaSalinim[0],ANM.kalcaSalinim[1],run)*Math.min(1,v)*Math.cos(TAU*u0),gyS=-1.5*sal;
  if(eW>0){const w=eW*EG.legen;sal=lerp(sal,ED1[5]*ANM_DER,w);gyS=lerp(gyS,(ED1[6]-ED1[5])*ANM_DER,w);}
  P.hy=a.hy+sal+a.hyT;P.gy=-a.hy*0.8+gyS-a.hyT;
  /* kollar: bacakla ters fazda (sağ ayak basarken sağ kol geride), genlik hızla ve kimlikle; öne gelen kolun dirseği daha kapalı */
  const KL=ANM.kol,cs=Math.cos(TAU*u0),yk=clamp((mZ+0.2)/0.4,-1,1);   /* geri koşuda kollar ters; geçiş sürekli */
  const kolA=(KL.genlik[0]+KL.genlik[1]*run)*K.kol*(wF+0.6*wB+0.25*wS)*Math.min(1,v/0.4+piv*0.5);
  P.aL=kolA*cs*yk;P.aR=-kolA*cs*yk;
  /* A7: kolun bandı hızı ~0,3 sn gecikmeyle izler (a.egVa): yürüyüşten koşuya geçişte (2–2,5 m/sn) dirseğin ortalaması 29°'den 108°'e çıkıyor; hız
     birden değişince kol karede 10°'den çok sıçrıyordu. İnsan da dirseğini koşuya geçerken bir iki adımda büker. Kritik sönümlü yay (ω 6): birinci
     dereceden gecikme değişimin başında kolu birden hareketlendiriyordu (dirsekte ikinci fark) */
  if(egAcik){if(dt>0){const w=6,n=anmAltAdim(w,dt),h=dt/n;for(let s=0;s<n;s++){a.egVaV+=(w*w*(vn-a.egVa)-2*w*a.egVaV)*h;a.egVa+=a.egVaV*h;}}anmEgriKaris(Math.max(0,a.egVa),false,ANM_EGKG);}
  let dB=KL.dirsek[0]+KL.dirsek[1]*run;if(egAcik)dB=lerp(dB,anmEgriOrt(3)*ANM_DER,EG.kol*clamp((v-0.4)/0.8,0,1));   /* A7: yana ve geri koşuda da dirsek verinin ortalamasında */
  P.eL=P.eR=-(dB+K.dirsek);P.eL-=0.09*run*(1-cs*yk);P.eR-=0.09*run*(1+cs*yk);
  /* A7: omuz ve dirsek veriden (sağ kol ayak 0'ın evresinde, sol yarım döngü sonra); kimliğin kol genliği ortalamanın çevresinde, dirseği eklenir */
  /* A9 (kolSigma): kol eğrisi adım frekansında Gauss süzgecinden (anmEgriKazanc; σ sn) — deparda (4,3 adım/sn) ve frende (kısa adım, kadans yüksek) verinin
     üst harmonikleri omzu karede 0,06 rad'dan çok ivmelendiriyordu (A9-0: üst gövde kırılmasının ~%30'u deparda omuz) */
  const A9k=ANM.a9,kSig=A9k&&A9k.kolSigma>0?A9k.kolSigma:0;
  const eWk=egAcik?(ANM.a9&&ANM.a9.kolYay>0?a.egWk:a.egW):0;
  if(eWk>0){const w=eWk*EG.kol,ko=K.kol*EG.kolOlcek*(1-EG.surus.kol*wSur),om=anmEgriOrt(2),E3=ANM_EGD[3],u1=u0+0.5-Math.floor(u0+0.5),gK=kSig>0?anmEgriKazanc(cad/2,kSig):null;
    anmEgriDeger(u0,beta,E3,gK);P.aL=lerp(P.aL,-(om+(E3[2]-om)*ko)*ANM_DER,w);P.eL=lerp(P.eL,-E3[3]*ANM_DER-K.dirsek,w);
    anmEgriDeger(u1,beta,E3,gK);P.aR=lerp(P.aR,-(om+(E3[2]-om)*ko)*ANM_DER,w);P.eR=lerp(P.eR,-E3[3]*ANM_DER-K.dirsek,w);}
  P.aLz=-0.08-0.06*run-0.2*wS*Math.min(1,v)-FR.kol*fr-DN.kol*dn;P.aRz=-P.aLz;   /* A3: frende ve dönüşte kollar yana açılır (denge) */
  {const c=-ANM.viraj.kol*P.hz/E.yatisTavan;P.aLz+=c;P.aRz+=c;}   /* A3d: virajda içteki kol gövdeye yakın, dıştaki açık (yatışla) */
  /* baş (bakış zinciri): hedef p.bakisYon ya da top; arkada kalan hedefte baş döndüğü omuzda kalır (öbür omuza fırlamaz); dönüşte baş önden
     gider; hız sınırlı kritik sönümlü yay; baş–gövde sınırını aşan kısmı gövde alır */
  const ph=mac.phase,B=ANM.bas,A9b=ANM.a9;let yH=0;
  let hxU=0;
  if(p&&!a.kucuk&&p.yon!=null&&(ph==='play'||ph==='durus'||ph==='kickoff')){const b=mac.ball,dx=b.x-p.x,dz=b.z-p.z,d2=dx*dx+dz*dz;
    /* A2b uzun top ve orta (Ek G3): top havadayken herkes taramayı bırakıp topa bakar, baş topun yüksekliğine kalkar (çok yüksekte gövde de
       geriye) */
    const ucan=!b.sahip&&!b.tasiyan&&(b.y>1.2||(!!b.pas&&b.pas.L>20&&b.y>0.4));
    let hed=ucan&&d2>0.25?Math.atan2(dz,dx):p.bakisYon;if(hed==null&&d2>0.25)hed=Math.atan2(dz,dx);
    /* A8 (bakis): uzun topta (havadan > 22 m, uzun yerden pas, orta, korner; uzaklaştırma değil) hazırlığın ilk ANM.a8.bakis sn'sinde baş hedefe — bakar, açar,
       gerilir; son adımdan 0,2 sn önce topa döner, yakındaki topa eğilmez (motorun bakışı — p.bakisYon — değişmez) */
    const A8b=ANM.a8,vkB=a.vk;let hedU=false;
    if(!ucan&&A8b&&A8b.bakis>0&&vkB&&vkB.evre===1&&(vkB.uzun||vkB.uzunYer)&&vkB.t<A8b.bakis&&vkB.tc>vkB.tB+0.2){const sc=vkB.e&&vkB.e.sec;
      if(sc&&sc.hx!=null&&sc.tur!=='uzaklastir'){hed=Math.atan2(sc.hz-p.z,sc.hx-p.x);hedU=true;}}
    /* T4g top saklama: baş arada rakibe döner (omuz üstünden; anmKoru) */
    if(!ucan&&ck&&ck.korBak&&ck.korO&&p.tavir==='koru')hed=Math.atan2(ck.korO.z-p.z,ck.korO.x-p.x);
    if(ucan&&d2>0.25)hxU=-clamp(Math.atan2(b.y+0.14-1.62*sy,Math.sqrt(d2)),0,1.15)*0.72;
    /* A6b (2026-10-17): başın hedefi çizilen gövdeye göre (eskiden motorun yönüne göre; gövde dönüşte başın gerisinde kalınca baş da onunla gecikirdi) */
    const yonC=B.govdeSinir!=null||(A9b&&A9b.basKok)?Math.PI/2-a.yaw:p.yon;   /* A9 (basKok): hedef çizilen köke göre (dönüşte kök motorun gerisindeyken baş da gerisinde kalmasın) */
    if(hed!=null){yH=-anmAci(hed-yonC);if(Math.abs(yH)>2.2&&yH*a.by<0&&Math.abs(a.by)>0.3)yH+=yH>0?-TAU:TAU;}
    yH+=clamp(a.donY*B.oncu,-1.5,1.5)+(a.kpS>=0&&a.kpTur===1?a.bakinH*Math.sin(Math.PI*Math.min(1,a.kpS/2.2)):0);
    /* yakındaki topa baş eğilir; bakış (tarama) topun yönünden uzaklaştıkça baş kalkar (T2 bakınma: omuz üstünden bakan başını kaldırır) */
    if(d2<16){let k=1;if(hedU)k=0;else if(p.bakisYon!=null&&d2>0.01){const r=anmAci(p.bakisYon-Math.atan2(dz,dx));k=clamp(Math.cos(r),0,1);}
      P.hx+=0.25*(1-Math.sqrt(d2)/4)*k;}}
  /* başın topa kalkması kritik sönümlü yayla (top inince ya da sahip olunca sıçramasın) */
  if(dt>0){const w=12,n=anmAltAdim(w,dt),h=dt/n;for(let s=0;s<n;s++){a.hxUV+=(w*w*(hxU-a.hxU)-2*w*a.hxUV)*h;a.hxU+=a.hxUV*h;}}
  P.hx+=a.hxU;if(a.hxU<-0.45)P.gx+=(a.hxU+0.45)*0.35;
  yH=clamp(yH,-(B.sinir+B.govde),B.sinir+B.govde);a.byH=yH;
  /* A9 (bas; 2026-10-18): basIleri — hedefin hızı yaya ileri beslenir (iki karelik pencere: motor bakışı iki karede bir yazar; hedef sıçrarsa 0): yay
     motorun bakışını ~2/yay sn geriden izliyordu, bakışın öncülüğü çizimde yitiyordu. basDunya — başın dünyadaki hızı (kökün dönüşü + başın köke göre
     hızı) yumuşak tavanla (dizi 0,8·tavanda başlar): kök hızla dönerken baş aynı yöne de dönünce toplam ~900°/sn'yi buluyordu; tavanda baş dünyada
     sabitlenir (göz-baş dengesi), kalanı kök durunca alır */
  let ffV=0,kW=0;const bD=A9b&&A9b.basDunya>0?A9b.basDunya:0,S9=A9b&&(A9b.basIleri>0||bD>0)?a.b9||(a.b9={y1:0,y2:0,r:0,k:0,n:0}):null;
  if(S9&&dt>0){kW=S9.n>=1?anmAci(a.yaw-S9.k)/dt:0;if(Math.abs(kW)>14){kW=0;S9.n=0;}
    if(S9.n>=2){const d=anmAci(yH-S9.y2);S9.r+=((Math.abs(d)<0.8?d/(2*dt):0)-S9.r)*Math.min(1,dt*20);}else S9.r=0;
    S9.y2=S9.n>=1?S9.y1:yH;S9.y1=yH;S9.k=a.yaw;S9.n++;ffV=(A9b.basIleri||0)*S9.r;}
  /* hız sınırı ve gövdenin payı yumuşak (tanh, softplus): sınırda ivme kırılmaz */
  if(dt>0){const w=B.yay,n=anmAltAdim(w,dt),h=dt/n;for(let s=0;s<n;s++){const ac=clamp(w*w*(yH-a.by)+2*w*(ffV-a.byV),-B.ivme,B.ivme);a.byV+=ac*h;a.byV=B.hiz*Math.tanh(a.byV/B.hiz);
      if(bD>0){const vW=kW+a.byV,x=Math.abs(vW),kn=0.8*bD;if(x>kn)a.byV=(vW>0?1:-1)*(kn+(bD-kn)*Math.tanh((x-kn)/(bD-kn)))-kW;}
      a.by+=a.byV*h;}}
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

/* A4-6: yorgun orta hakemin bekleyişi — eller arkadan bele (hkBekle → belde, w ile; aktörün kendi nesnesi) */
const ANM_HKY_KANAL=[...new Set(Object.keys(ANM_POZ.hkBekle).concat(Object.keys(ANM_POZ.belde)))];
function anmHkYorgunPoz(a,w){const P=a.hkYP||(a.hkYP={}),A=ANM_POZ.hkBekle,B=ANM_POZ.belde;for(const k of ANM_HKY_KANAL)P[k]=(A[k]||0)*(1-w)+(B[k]||0)*w;return P;}
/* ---- tavır (sözleşme: p.tavir) → yürüyüş parametreleri ve üst gövde ---- */
function anmTavir(a,p,dt){
  let drop=0,gen=0,adim=1,hyE=0,yanA=false,kalK=1;
  if(p&&p.tur==='oyuncu'){const tv=p.tavir,b=mac.ball,st=a.st,sp=a.sp,S=ANM_S;
    let hazir=tv==='hazir';if(tv==null&&p.rol==='GK'&&b.sut&&b.sut.team!==p.team&&mac.phase==='play'&&!p.eylem)hazir=true;
    /* T9b-e (Ek G6 dalış zinciri): kalecinin yana adımı (eylem yanAdim) — çömelik hazır duruşta kısa, sık ve geniş adım (ayaklar çaprazlanmaz:
       yürüyüşün yan kayması), eller önde */
    if(p.rol==='GK'&&p.eylem&&p.eylem.ad==='yanAdim'){hazir=true;yanA=true;}
    if(tv!==a.tvSon){a.tvSon=tv;if(tv==='jokey')a.jYan=anmSagda(p,b.x,b.z)?1:-1;
      /* T4g: top saklamanın başında rakibin yanı (sonra her karede histerezisle, anmKoru) */
      if(tv==='koru'){const o=anmKorRakip(p);a.ck.korSag=!o||anmSagda(p,o.x,o.z);a.ck.korT=0;}
      if(tv==='bekle')a.bekP=p.ayak==='sol'?aynala(ANM_POZ.bekle):ANM_POZ.bekle;}
    /* A2b kaleci: şutçunun basışına zamanlanmış split-step ve set duruşu (anmKaleciSet) */
    const ks=p.rol==='GK'?anmKaleciSet(a,p,dt):0;
    const bjw=p.rol!=='GK'?anmBaraj(a,p,dt):0;
    if(hazir||ks>0){st[S.hazir]=1;sp[S.hazir]=ANM_POZ.kaleciHazir;st[S.set]=yanA?0.5:ks;sp[S.set]=ANM_POZ.kaleciSet;drop=0.13+0.07*ks;gen=0.12+0.06*ks;adim=0.6-0.2*ks;
      if(yanA){drop=0.15;gen=0.16;adim=0.5;kalK=0.4;}}   /* yana adımda ayak yerden az kalkar */
    else if(tv==='jokey'){st[S.jokey]=1;sp[S.jokey]=ANM_POZ.jokey;drop=0.12;gen=0.07;adim=0.65;hyE=-0.35*a.jYan;}
    /* T4g top saklama: rakibin yanı her karede (anmKoru); iki yuva (sağ/sol) çapraz geçer; alçak, geniş, kısa adım */
    else if(tv==='koru'){anmKoru(a,p,dt);const sg=a.ck.korSag;st[S.koru]=sg?1:0;sp[S.koru]=ANM_POZ.koru;st[S.koruS]=sg?0:1;sp[S.koruS]=aynala(ANM_POZ.koru);drop=0.1;gen=0.12;adim=0.7;}
    else if(tv==='bekle'){st[S.bekle]=1;sp[S.bekle]=a.bekP||ANM_POZ.bekle;adim=0.7;}
    /* T2 taşıma: topu süren oyuncu (eylemsiz, tavırsız) koşarken hafif öne eğik, kollar dengede (hızla artar) */
    const v=Math.sqrt((p.vx||0)*(p.vx||0)+(p.vz||0)*(p.vz||0)),sahip=b.sahip===p;
    if(sahip&&!tv&&!p.eylem){let wt=clamp((v-1.2)/2,0,1);
      /* A8 (surukle): topu atıp koşmada (top gidiş yönünde 1,8 m'den önde, hız > 4,5 m/sn) top sürme adımı söner — uzun itişten sonra iki üç adım dokunmadan depar */
      const A8s=ANM.a8;if(A8s&&A8s.surukle&&v>4.5){const on=((b.x-p.x)*(p.vx||0)+(b.z-p.z)*(p.vz||0))/v;wt*=1-clamp((on-1.8)/0.8,0,1);}
      st[S.tasi]=wt;sp[S.tasi]=ANM_POZ.tasi;adim=lerp(1,ANM.egri.surus.adim,wt);}   /* A7b: topla kısa ve sık adım */
    /* boşta (T1; sözleşme: p.kip, yoksa hızdan): bir süre duran oyuncu eller belde ya da gevşek durur, ağırlığını değiştirir (anmEkler);
       yürürken yarı ağırlıkla. Oyuncuya göre sabit seçim (h2), rastlantısız. Topu süren boşta duruşa girmez (T2) */
    const ph=mac.phase,kip=p.kip!=null?p.kip:v<0.2?'dur':v<2?'yuru':'';
    /* A2a: yakın geçmişteki sert koşu (sn eşdeğeri; 8 sn'de söner) — durunca soluklanma */
    if(dt>0)a.efor+=dt*((v>5.5?1:v>4?0.4:0)-a.efor/8);
    /* A6a (2026-10-17): barajın sıçrama pozu (bacaklar toplu) inişte hemen kalkar — yuvası sönerken yere basan ayağın IK'sını eziyordu (A6-0: yapay duran
       toplarda inişteki kaymanın %96'sı barajcılardaydı); ANM.zipla.kes */
    if(a.bjwO===2&&bjw!==2&&ANM.zipla&&ANM.zipla.kes){a.sw[S.barajZ]=0;a.swV[S.barajZ]=0;}a.bjwO=bjw;
    /* A2b baraj: eller önde; vuruşla sıçrama (anmBaraj) */
    if(bjw){st[S.baraj]=1;sp[S.baraj]=ANM_POZ.baraj;if(bjw===2){st[S.barajZ]=1;sp[S.barajZ]=a.bj.bas?(a.bj.basSol?aynala(ANM_POZ.barajZiplaBas):ANM_POZ.barajZiplaBas):ANM_POZ.barajZipla;}
      else if(bjw===3){st[S.barajZ]=1;sp[S.barajZ]=ANM_POZ.barajHaz;}}   /* T8e: motor sıçramasının hazırlığı */
    /* A2b ikinci top: havadan inen top yakına düşecekse dizler bükük, baş topta */
    else if(!p.eylem&&!sahip&&mac.phase==='play'&&anmIkinciTop(p,b)){st[S.izle]=0.7;sp[S.izle]=ANM_POZ.izle;drop=Math.max(drop,0.05);}
    if(!tv&&!hazir&&!bjw&&!sahip&&!p.eylem&&!p.poz&&!p.sevinc&&(ph==='play'||ph==='durus'||ph==='kickoff')){
      a.bosT=kip==='dur'?a.bosT+dt:0;
      anmBekleyis(a,p,dt,kip==='dur');
      st[S.bosta]=kip==='dur'?(a.bosT>1.2?1:0):kip==='yuru'?0.45:0;sp[S.bosta]=a.bosK;
      st[S.dizler]=a.dizT>0?1:0;sp[S.dizler]=ANM_POZ.dizler;
      if(a.kpS>=0&&a.kpTur>=2){const K=ANM_KIPIRTI[a.kpTur];st[S.kipirti]=anmZarf(a.kpS,K.s,K.g,K.c);sp[S.kipirti]=a.kpTur>=4&&a.kpSol?aynala(K.P):K.P;}}
    else{a.bosT=0;a.dizT=0;a.kpS=-1;a.bakinH=0;}}
  /* A2b hakem bekleyişi: duran orta hakem eller arkada, yan hakem gevşek, 4. hakem eller önde (işaret yokken). A4-6: orta hakemin yorgunluğu (motorun
     hkYorgun'u, son 15 dk; 0,12'de tam): duruşta eller arkadan bele, sert koşudan sonra nefes daha derin ve hızlı (a.efor), koşuda adım biraz kısa */
  else if(p&&(p.tur==='hakem'||p.kind==='dorduncu')){const st=a.st,sp=a.sp,S=ANM_S,v=Math.sqrt((p.vx||0)*(p.vx||0)+(p.vz||0)*(p.vz||0)),h=ANM_HK.get(p);
    a.bosT=v<0.3&&!(h&&(h.cur||h.sira.length))?a.bosT+dt:0;
    const yw=p.tur==='hakem'&&p.kind!=='lin'&&mac&&mac.half===2&&typeof hkYorgun==='function'?clamp(hkYorgun(mac)/0.12,0,1):0;
    if(dt>0)a.efor+=dt*((v>5.5?1:v>4?0.4:0)*(1+yw)-a.efor/8);
    if(yw>0){adim=1-0.12*yw;drop=0.02*yw;}
    if(a.bosT>0.8){st[S.bosta]=1;sp[S.bosta]=p.kind==='lin'?ANM_POZ.gevsek:p.kind==='dorduncu'?ANM_POZ.hkOnde:yw>0.02?anmHkYorgunPoz(a,yw):ANM_POZ.hkBekle;}}
  /* T4g: çalım hazırlığında kısa ve sık adım, diz bükük (harekete göre); aldatılan savunmacı alçak ve geniş basar */
  const ck=a.ck;let hizli=!!(a.ks&&a.ks.evre)||yanA;
  /* T5f (Ek G4): tökezleme — sendelerken 1–3 kısa, sık ve alçak adım (adım boyu 0,55; gövde öne sendele pozundan) */
  if(p&&p.eylem&&p.eylem.ad==='sendele'){drop=Math.max(drop,0.08);gen=Math.max(gen,0.1);adim=Math.min(adim,0.55);hizli=true;}
  if(ck){if(ck.evre===1){const Y=ANM_CK_YUR[ck.mek]||ANM_CK_YUR.aldat;drop=Math.max(drop,Y[0]);gen=Math.max(gen,Y[1]);adim=Math.min(adim,Y[2]);hizli=true;}
    if(ck.yW>0.01&&ck.yE&&ck.yE.mek==='aldat'){drop=Math.max(drop,0.1*ck.yW);gen=Math.max(gen,0.12*ck.yW);hizli=true;}}
  if(dt>0){const k=Math.min(1,dt*(hizli?12:5));a.gDrop+=(drop-a.gDrop)*k;a.gGen+=(gen-a.gGen)*k;a.gAdim+=(adim-a.gAdim)*k;a.gHy+=(hyE-a.gHy)*k;a.gKal+=(kalK-a.gKal)*k;}
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
  /* A8 (yarim): yarım vole — topun sekmesinden hemen sonra üstle; gövde topun üstünde (öne), kollar daha toplu, takip kısa */
  yarimG:{lean:0.06,gy:0.32,hy:-0.22,gz:-0.06,aR:0.25,aRz:1.3,eR:-0.25,aL:-0.35,aLz:-0.45,eL:-0.7,hx:0.45,lLy:0},
  yarimT:{lean:0.16,gy:-0.34,hy:0.26,gz:0.04,aR:-0.45,aRz:0.8,eR:-0.45,aL:0.4,aLz:-0.55,eL:-0.45,hx:0.42,lLy:0},
  uzunG:{lean:-0.16,gx:-0.06,gy:0.42,hy:-0.3,gz:-0.1,aR:0.45,aRz:1.6,eR:-0.2,aL:-0.45,aLz:-0.5,eL:-0.7,hx:0.32,lLy:0},
  uzunT:{lean:-0.18,gx:-0.1,gy:-0.4,hy:0.32,aR:-0.7,aRz:0.95,eR:-0.4,aL:0.55,aLz:-0.7,eL:-0.4,hx:0.2,lLy:0},
  asirtmaG:{lean:-0.1,gy:0.25,hy:-0.2,aR:0.22,aRz:1.15,eR:-0.3,aL:-0.3,aLz:-0.5,eL:-0.65,hx:0.34,lLy:0},
  asirtmaT:{lean:-0.24,gx:-0.08,gy:-0.1,hy:0.12,aR:-0.2,aRz:1.05,eR:-0.35,aL:0.2,aLz:-0.85,eL:-0.4,hx:0.15,lLy:0},
  voleG:{lean:-0.1,gz:-0.34,hz:-0.18,gy:0.28,hy:-0.3,aR:0.1,aRz:1.45,eR:-0.3,aL:-0.2,aLz:-1.1,eL:-0.4,hx:0.2,lLy:0},
  voleT:{lean:-0.05,gz:-0.45,hz:-0.22,gy:-0.28,hy:0.36,aR:-0.3,aRz:1.05,eR:-0.35,aL:0.3,aLz:-1.3,eL:-0.4,hx:0.25,lLy:0},
  /* T9b-e: falso (iç ayakla içüstü, açılı yaklaşma: kalça daha açık, gövde destek yanına yatar, karşı kol geniş; takipte bacak gövdenin önünden
     çapraz süpürür, kalça sola döner) ve burunla dürtme (kısa saplama: gövde topun üstünde ve dik, kollar toplu) */
  falsoG:{lean:-0.06,gy:0.36,hy:-0.28,gz:-0.15,aR:0.15,aRz:1.5,eR:-0.25,aL:-0.35,aLz:-0.5,eL:-0.7,hx:0.4,lLy:-0.2},
  falsoT:{lean:-0.02,gy:-0.5,hy:0.42,gz:-0.1,aR:-0.4,aRz:0.9,eR:-0.5,aL:0.45,aLz:-0.6,eL:-0.45,hx:0.36,lLy:-0.3},
  burunG:{lean:0.1,gy:0.08,hy:-0.06,aR:0.05,aRz:0.55,eR:-0.6,aL:-0.1,aLz:-0.35,eL:-0.7,hx:0.42,lLy:0.05},
  burunT:{lean:0.14,gy:-0.08,hy:0.1,aR:-0.15,aRz:0.5,eR:-0.6,aL:0.15,aLz:-0.35,eL:-0.6,hx:0.38,lLy:0.05}};
/* stile göre geri salınımın (S) ve takibin (T) büyüklüğü; güç ve uzun top ölçekler */
const ANM_VK_STIL={ic:{S:0.45,T:0.4},dis:{S:0.6,T:0.6},ust:{S:1,T:1},yarimVole:{S:0.85,T:0.85},asirtma:{S:0.7,T:0.4},vole:{S:0.9,T:0.9},falso:{S:0.85,T:0.9},burun:{S:0.25,T:0.35}};
const ANM_VK_YG=-0.034,ANM_VK_G=new Float32Array(2),ANM_VK_B=new Float32Array(3),ANM_VK_Q=new Float32Array(3),ANM_VK_L=new Float32Array(3);
function anmVkYeni(){const f=n=>new Float32Array(n);return{evre:0,e:null,t:0,tT:0,tL:0,ayak:0,yan:-1,stil:'ic',uzun:false,sert0:false,sert:false,S:1,Tk:1,g:0.6,
  tD:0.1,tB:0.3,tF:0.2,tIn:0.15,hopT:0,hopH:0,h:0,tc:9,u:0,asagi:false,kd:0,ofs:0,ofs0:0,kp:f(3),kv:f(3),D0:f(3),C:f(3),F:f(3),Ln:f(3),
  sw:f(2),s0:f(2),sAd:1,sDur:0.1,sBos:false,sb:f(3),T:f(6),Te:f(6),kw:0,dondur:false,need:9,yer:new Uint8Array(2),
  wG:0,wT:0,pG:null,pT:null,yEk:0,dy:0,lean:0,cikT:0,hazEn:0.22,uzunYer:false,k0:f(3),kisa:false,tempo:1,kol:1,tau:0.045,pk:'',kotu:null,kotuT:0,kLean:0,C0:f(3),
  s0y:0,v0:f(2),dur:0.1,tPl:0.1,fw:f(4),fwV:f(4),fwN:0,ox:0,oz:0,oyw:0,gP:f(6),gN:0,gZ:0,dtK:0};}   /* A9 (vkSurek): ayakların önceki karedeki dünya yeri ve hızı, son adımın başı */
/* gövde çerçevesi (x sola, z öne; js/animasyon.js adım döngüsüyle aynı) ↔ dünya */
function anmVkGovde(a,wx,wz,sx){const c=Math.cos(a.yaw),s=Math.sin(a.yaw),dx=wx-a.x,dz=wz-a.z;ANM_VK_G[0]=(dx*c-dz*s)/sx;ANM_VK_G[1]=(dx*s+dz*c)/sx;return ANM_VK_G;}
function anmVkDunya(a,x,z,sx){const c=Math.cos(a.yaw),s=Math.sin(a.yaw);ANM_VK_G[0]=a.x+(x*c+z*s)*sx;ANM_VK_G[1]=a.z+(-x*s+z*c)*sx;return ANM_VK_G;}
/* topun çizilen yeri (iki motor adımı arası; aktörlerle aynı oran) */
/* T9b-e: topun temas karesi — top son motor adımında dokunulduysa (sürümü değişti) çizim onu bu karede temas yerinde, adımın başındaki yerinde
   gösterir. Çizim adımın sonundaki durumu gösterdiğinden (iki adım arası oran ≈ 1) top vuruş adımında 0,2–0,5 m ilerlemiş çiziliyor, vuruşun,
   kafanın, müdahalenin ve kurtarışın çarpma karesi hiç görünmüyordu (temasta ayak topun 0,25 m gerisinde). Bir kare; sonra top yoluna devam
   eder. Yalnız tek adımlık karede (1× oynatma) ve topun adımdaki yolu 1,5 m'den kısaysa (sıfırlama değil); motorun adım sayacı yoksa (poz galerisi) yok */
const ANM_TOPT={surum:-1,kare:-1,tut:false};
function anmTopTut(){const b=mac.ball,k=mac.kare,P=typeof TOP!=='undefined'?TOP:null;if(k==null||!P)return false;
  if(k!==ANM_TOPT.kare){ANM_TOPT.tut=ANM_TOPT.kare>=0&&k-ANM_TOPT.kare===1&&b.surum!==ANM_TOPT.surum&&Math.abs(b.x-P.px)+Math.abs(b.z-P.pz)<1.5;ANM_TOPT.kare=k;ANM_TOPT.surum=b.surum;}
  return ANM_TOPT.tut;}
function anmVkTop(al){const b=mac.ball,P=typeof TOP!=='undefined'?TOP:null;if(P&&anmTopTut())al=0;
  ANM_VK_B[0]=P?lerp(P.px,b.x,al):b.x;ANM_VK_B[1]=P?lerp(P.py,b.y,al):b.y;ANM_VK_B[2]=(P?lerp(P.pz,b.z,al):b.z)-MOTOR_Z;anmEldeKar(ANM_VK_B,al);return ANM_VK_B;}
/* T15d (2026-10-14): kalecinin tuttuğu top — motor topu tutuşun bir sonraki adımında göğüs hizasına (1,05·boy, 0,32 m önde) taşır; çizimde top
   temas noktasından o yere 0,3 sn'de (motor saatiyle; yoksa tutuş eyleminin süresiyle) yumuşakça geçer — kepçede topun göğse çekilişi görünür.
   Başlangıç save olayında (catch) topun yeri; top kalecinin elinde değilse ya da süre dolduysa etkisiz. Topun çizimi (topCiz) ve kol IK'sı
   (anmVkTop) aynı yeri okur */
const ANM_ELDE={p:null,kare:null,x:0,y:0,z:0};
function anmEldeKar(o,al){const E=ANM_ELDE,b=mac.ball;if(!E.p||b.tasiyan!==E.p)return;
  const e=E.p.eylem,t=mac.kare!=null&&E.kare!=null?(mac.kare-E.kare+(al||0))/60:e&&e.ad==='tutus'&&!e.kurtar?e.t:1;if(!(t<0.3))return;
  const f=clamp(t/0.3,0,1),s=f*f*(3-2*f);o[0]=E.x+(o[0]-E.x)*s;o[1]=E.y+(o[1]-E.y)*s;o[2]=E.z-MOTOR_Z+(o[2]-(E.z-MOTOR_Z))*s;}
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
function anmVkPoz(vk){const st=vk.stil,k=st==='ic'?(vk.uzunYer?'ust':'ic'):st==='dis'?'dis':st==='asirtma'?'asirtma':st==='vole'?'vole':st==='falso'?'falso':st==='burun'?'burun':st==='yarimVole'&&ANM.a8&&ANM.a8.yarim?'yarim':vk.uzun?'uzun':'ust';
  const G=ANM_VK_POZ[k+'G'],T=ANM_VK_POZ[k+'T'];vk.pk=k;vk.pG=vk.ayak?aynala(G):G;vk.pT=vk.ayak?aynala(T):T;}
/* temas yeri (gövde çerçevesi): üstle top ortasının arkası, iç ayakla topun yanı, dış ayakla öbür yanı, aşırtmada altı, volede top
   yüksekliğinde; bacağın erişimine sığdırılır */
function anmVkTemas(vk,bx,bz,by,o){
  const y=vk.yan,st=vk.stil;let x=bx,z=bz-0.15,h=by+0.05;
  if(st==='ic'){x=bx+y*0.1;z=bz-0.04;h=by+0.02;}else if(st==='dis'){x=bx-y*0.09;z=bz-0.06;h=by+0.03;}
  else if(st==='asirtma'){z=bz-0.12;h=by;}else if(st==='vole'){x=bx+y*0.04;z=bz-0.1;h=by+0.06;}
  else if(st==='falso'){x=bx+y*0.07;z=bz-0.11;h=by+0.04;}else if(st==='burun'){x=bx+y*0.02;z=bz-0.24;h=by+0.02;}
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
  vk.h=0;vk.asagi=false;vk.u=0;vk.sBos=false;vk.sAd=1;vk.tc=9;vk.kisa=false;vk.kotu=null;vk.kLean=0;anmVkPoz(vk);
}
/* destek ayağının basacağı yer (dünya): tahmini temas anındaki topun 0,12 m gerisi, 0,22–0,27 m yanı */
function anmVkBasisYeri(vk,tc){
  const b=mac.ball,cx=Math.cos(vk.kd),cz=Math.sin(vk.kd),dS=vk.sert0?0.27:0.22,tt=Math.min(tc,0.5);
  vk.sw[0]=b.x+b.vx*tt-cx*0.12+(vk.yan<0?cz:-cz)*dS;vk.sw[1]=b.z+b.vz*tt-MOTOR_Z-cz*0.12+(vk.yan<0?-cx:cx)*dS;}
/* son adım: vuran ayak geri salınıma kalkar, destek ayağı basış yerine uzanır (yerdeyse ve basış yeri 0,12 m'den yakınsa yerinde kalır) */
function anmVkSonAdim(a,p,vur,tc,sx){
  const vk=a.vk,i=vk.ayak,j=1-i,T=a.T;
  vk.evre=2;vk.t=0;vk.dondur=true;vk.asagi=false;vk.u=0;if(a.dokT>=0&&a.dokUzun&&!a.dokLow)a.dokT=-1;   /* A8: hazırlık dokunuşunun bacaklı pozu son adıma taşmaz (bacaksız alçak dokunuş kendi zarfıyla söner: kesilince döngünün ayak yüksekliği zıplıyordu) */
  if(ANM.a8&&ANM.a8.dokSal){a.phItme=0;a.phItmeV=0;}   /* A8: dokunuşun adım evresi itişi son adımda biter (döngü donuk; itiş vuruş katmanına karışan döngü hedeflerini oynatıyordu) */
  for(let k=0;k<3;k++){vk.kp[k]=T[i*3+k];vk.kv[k]=0;vk.k0[k]=T[i*3+k];}
  anmVkBasisYeri(vk,tc);
  const w=anmVkDunya(a,T[j*3],T[j*3+2],sx),ex=w[0]-vk.sw[0],ez=w[1]-vk.sw[1];vk.s0[0]=w[0];vk.s0[1]=w[1];
  if(a.anc[j]&&ex*ex+ez*ez<0.0144){vk.sw[0]=w[0];vk.sw[1]=w[1];vk.sAd=1;}else vk.sAd=0;
  /* A9 (vkSurek): destek ayağı önceki karede çizildiği yerden, o anki hızıyla ve yüksekliğinden çıkar (yerdeyse hız 0); hız, yolu taşırmasın diye
     ortalama hızın iki katıyla sınırlı. Eskiden adım döngüsünde havada ve öne giden ayak son adımın ilk karesinde yere ve durağana alınıyordu.
     vkGec: son adım vkGec sn'den kısaysa destek ayağı temastan tD önce değil, en geç 0,02 sn önce basar (aşağı salınımın içinde; kısa geri salınımda
     ayak 0,08 sn'de 1 m gidiyordu) */
  const A9=ANM.a9,gec=A9&&A9.vkGec||0;vk.tPl=gec>0?clamp(vk.tD-Math.max(0,gec-(tc-vk.tD)),0.02,vk.tD):vk.tD;
  vk.s0y=ANM_VK_YG;vk.v0[0]=vk.v0[1]=0;vk.dur=Math.max(2/60,tc-vk.tPl);
  if(A9&&A9.vkSurek&&vk.sAd<1&&vk.fwN>1){vk.s0[0]=vk.fw[j*2];vk.s0[1]=vk.fw[j*2+1];vk.s0y=Math.max(ANM_VK_YG,T[j*3+1]);
    if(!a.anc[j]&&vk.fwN>2){let vx=vk.fwV[j*2],vz=vk.fwV[j*2+1];const dx=vk.sw[0]-vk.s0[0],dz=vk.sw[1]-vk.s0[1],vm=2*Math.sqrt(dx*dx+dz*dz)/vk.dur,v=Math.sqrt(vx*vx+vz*vz);
      if(v>vm){vx*=vm/v;vz*=vm/v;}vk.v0[0]=vx;vk.v0[1]=vz;}}
}
/* A9 (vkSurek): ayakların önceki karede çizilen dünya yeri (önceki karenin kökü ve hedefleri) ve kareler arası hızı — hazırlıkta her kare */
function anmVkIz(a,vk,sx,dt){const T=a.T,F=vk.fw,V=vk.fwV;
  if(vk.fwN>0){const c=Math.cos(vk.oyw),s=Math.sin(vk.oyw);for(let k=0;k<2;k++){const x=T[k*3],z=T[k*3+2],wx=vk.ox+(x*c+z*s)*sx,wz=vk.oz+(-x*s+z*c)*sx;
    if(vk.fwN>1){V[k*2]=(wx-F[k*2])/dt;V[k*2+1]=(wz-F[k*2+1])/dt;}F[k*2]=wx;F[k*2+1]=wz;}}
  vk.ox=a.x;vk.oz=a.z;vk.oyw=a.yaw;if(vk.fwN<9)vk.fwN++;}
/* adım döngüsüne dönüş: yere basan ayak (ya da ayaklar) dünyaya kilitlenir, döngünün evresi o ayağın basışının başına alınır;
   geçiş 0,16 sn'de son vuruş hedeflerinden döngünün hedeflerine iner */
function anmVkCikis(a,sx,basan){
  const vk=a.vk,T=vk.T;if(basan==null)basan=vk.yer[vk.ayak]?vk.ayak:1-vk.ayak;
  let u0=0.04-basan*0.5;u0-=Math.floor(u0);a.ph=u0*6.283185307179586;
  for(let i=0;i<2;i++){a.D[i*2]=a.D[i*2+1]=0;if(i===basan||vk.yer[i]){const w=anmVkDunya(a,T[i*3],T[i*3+2],sx);a.W[i*2]=w[0];a.W[i*2+1]=w[1];a.anc[i]=1;}else a.anc[i]=0;}
  vk.Te.set(T);vk.evre=5;vk.cikT=0;vk.dondur=false;vk.e=null;vk.ofs0=vk.ofs;vk.fwN=0;
}
function anmVurusDurum(a,p,dt,al,sx){
  const vk=a.vk;vk.dtK=dt;vk.yEk=0;vk.dy=0;vk.lean=0;vk.wG=0;vk.wT=0;if(vk.kotu){vk.kotuT+=dt;if(vk.kotuT>0.75)vk.kotu=null;}
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
  const A9=ANM.a9;if(A9&&A9.vkSurek&&dt>0&&vk.evre<=1)anmVkIz(a,vk,sx,dt);
  if(vk.evre===0){vk.ofs=0;return;}
  if(vk.evre===5){vk.cikT+=dt;vk.kw=Math.max(0,1-vk.cikT/0.16);vk.ofs=vk.ofs0*vk.kw;if(vk.kw<=0){vk.evre=0;vk.kw=0;vk.ofs=0;}vk.wT=vk.kw*0.4;return;}
  const i=vk.ayak,j=1-i,T=vk.T,S=vk.S,yG=ANM_VK_YG,OF=0.15;
  /* A7c (2026-10-17): dolu vuruşta (geri salınım S ≥ 0,9: üstten, vole, falso; iç ve dış ayak, burun değişmez) geri salınımın tepesi, takibin yüksekliği
     ve destek dizi CMU vuruşlarından (10 vuruş; temas = vuran bilek destek bileğini geçtiği an): tepede uyluk ~27° geride, diz ~83° (ayak kalçadan
     0,69 m geride, yerden 0,65 m yukarıda; eskiden 0,38 / 0,31), takipte uyluk en çok ~77° (ayak ~0,4 m; sert şutta eskiden 0,78), destek dizi daha bükük */
  const wI=ANM_EG&&ANM.egri.acik?ANM.egri.vurus*clamp((S-0.6)/0.3,0,1):0;vk.wI=wI;   /* ölçüm (animasyon-olcum.py: tepe/plan) okur */
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
    if(!temas||vk.t<=dt*1.01||anmTopTut())anmVkTemas(vk,bx,bz,by,vk.C);   /* T9b-e: tutulan temas karesinde top temas yerinde */
    if(!vk.asagi&&tc>vk.tD&&!temas){
      /* geri salınım (T4-V): ayak son adımın başındaki yerinden tepeye (arkada ve yukarıda, diz ~90°) kalan süreye bağlı durumsuz eğriyle —
         her oynatma hızında aynı yol (eski kritik sönümlü yay 4×'te sınırda, 8×'te kararsızdı); tepeye varış temposu ve kol ağırlığı kimlikten */
      const g0=clamp((vk.tB-tc)/Math.max(0.05,vk.tB-vk.tD),0,1),g=Math.pow(g0*g0*(3-2*g0),vk.tempo),k0=vk.k0,kp=vk.kp;
      kp[0]=lerp(k0[0],vk.yan*0.13,g);kp[1]=lerp(k0[1],yG+0.08+lerp(0.26,0.6,wI)*S,g);kp[2]=lerp(k0[2],-(0.12+lerp(0.26,0.57,wI)*S),g);
      vk.wG=Math.min(1,(0.4+0.6*g)*vk.kol);}
    else{
      if(!vk.asagi){vk.asagi=true;vk.D0.set(vk.kp);vk.u=0;}
      vk.u=temas?1:Math.max(vk.u,vk.tD>0?1-tc/vk.tD:1);
      ANM_VK_L[0]=vk.yan*0.11;ANM_VK_L[1]=yG+0.06;ANM_VK_L[2]=-0.05;
      anmVkBez(vk.D0,ANM_VK_L,vk.C,Math.pow(vk.u,1.5),vk.kp);
      vk.wG=Math.min(1,0.4+0.6*vk.t/0.12)*(1-vk.u);vk.wT=vk.u;}
    /* destek ayağı: basış yerine uzanır, aşağı salınımın başında (temastan tD sn önce) basar ve dünyaya kilitlenir */
    let sxw=vk.sw[0],szw=vk.sw[1],sy=yG;
    if(vk.sAd<1){const kalan=tc-vk.tPl,o0=vk.sw[0],o1=vk.sw[1];anmVkBasisYeri(vk,tc);
      const m=2.5*dt,dx=vk.sw[0]-o0,dz=vk.sw[1]-o1,dd=Math.sqrt(dx*dx+dz*dz);if(dd>m){vk.sw[0]=o0+dx*m/dd;vk.sw[1]=o1+dz*m/dd;}
      vk.sAd=kalan>dt&&!temas?Math.min(1,vk.sAd+(1-vk.sAd)*dt/kalan):1;
      /* A9 (vkUzan): basış yeri gövdenin vkUzan önündeyse ayak basmaz, gövde yetişene dek önde ve yerden biraz yukarıda bekler (hızlı koşuda basış yeri
         gövdenin 1 m önüne düşüyor, bacak gerilirken destek dizi karede 25–35° açılıyordu); yol gövdeye göre vkUzan + 0,12'de yumuşakça tutulur */
      const uz=A9&&A9.vkUzan||0,zS=uz>0?anmVkGovde(a,vk.sw[0],vk.sw[1],sx)[1]:0;
      if(uz>0&&vk.sAd>=1&&!temas&&zS>uz)vk.sAd=0.999;
      const s=vk.sAd,f=s*s*(3-2*s);
      if(A9&&A9.vkSurek){const h10=s*(1-s)*(1-s)*vk.dur,y0=vk.s0y-yG,hop=0.08*clamp(vk.dur/0.2,0.4,1);   /* A9: Hermite — başta ayağın hızı, basışta 0; yükseklik çıktığı yerden iner, yerden çıkan ayak alçak adım (kısa adımda daha alçak) */
        sxw=lerp(vk.s0[0],vk.sw[0],f)+h10*vk.v0[0];szw=lerp(vk.s0[1],vk.sw[1],f)+h10*vk.v0[1];sy=yG+y0*(1-f)+hop*Math.max(0,1-y0/hop)*Math.sin(Math.PI*s);}
      else{sxw=lerp(vk.s0[0],vk.sw[0],f);szw=lerp(vk.s0[1],vk.sw[1],f);sy=yG+0.08*Math.sin(Math.PI*s);}
      if(uz>0){const g=anmVkGovde(a,sxw,szw,sx),z0=uz-0.03,e=g[1]-z0;if(e>0){const w=anmVkDunya(a,g[0],z0+e/(1+e/0.15),sx);sxw=w[0];szw=w[1];}
        if(zS>uz)sy+=0.03*clamp((zS-uz)/0.1,0,1)*f;}}
    const sg=anmVkGovde(a,sxw,szw,sx);T[j*3]=sg[0];T[j*3+1]=sy;T[j*3+2]=sg[1];vk.yer[j]=vk.sAd>=1?1:0;vk.yer[i]=0;
    for(let k=0;k<3;k++)T[i*3+k]=vk.kp[k];
    vk.kw=1-(1-vk.kw)*Math.exp(-dt/vk.tau);vk.dy=-lerp(0.025,0.06,wI)*S*Math.max(vk.wG,vk.u);
    if(temas){
      /* temas karesi (motor 'takip'e geçti): ayak topta; takip ve inişin hedefleri, sertlik ve sıçrama */
      /* motor stili temasta kesinleştirir (şutta sert/plase/aşırtma, volede vole): takip ve sıçrama yeni stilden; üst gövde pozları aşağı
         salınım başladıysa değişmez (tek karede poz atlamasın) */
      vk.stil=vur.stil||vk.stil;vk.g=vur.guc!=null?vur.guc:0.6;if(!vk.asagi)anmVkPoz(vk);
      /* kısa vuruş (T4-V): eylem ilk kez temas karesinde görüldüyse (hızlı oynatma) ayak topa ışınlanmaz; temas noktası ayağa doğru çekilir, takip kısa */
      vk.kisa=vk.t<=dt*1.01;if(vk.kisa)for(let k=0;k<3;k++)vk.C[k]=lerp(vk.kp[k],vk.C[k],0.6);
      /* T9b-e: kötü vuruş (sözleşme vurus.kotu; motor temas adımında seçer) — temas yeri türden: ıskada ayak topun üstünden ve yanından geçer,
         altına girmede topun altına ve önüne uzanır (gövde geride), üstüne vurmada topun üst yarısında (gövde topun üstünde), ayağın kenarında
         topun iç yanında. Ayak bu karede aşağı salınımın en hızlı yerinde (~15 m/sn): yer değişimi salınımın içinde kalır */
      const ku=vur.kotu||null;vk.kotu=ku;vk.kotuT=0;vk.kLean=0;vk.C0.set(vk.C);   /* C0: normal temas yeri (ölçüm okur) */
      if(ku==='iska'){vk.C[1]+=0.2;vk.C[2]+=0.04;vk.C[0]+=vk.yan*0.06;}
      else if(ku==='alt'){vk.C[1]=Math.max(yG+0.01,vk.C[1]-0.06);vk.C[2]+=0.06;vk.kLean=-0.12;}
      else if(ku==='ust'){vk.C[1]+=0.1;vk.C[2]-=0.03;vk.kLean=0.08;}
      else if(ku==='kenar')vk.C[0]-=vk.yan*0.08;
      const st=ANM_VK_STIL[vk.stil]||ANM_VK_STIL.ust,g=vk.g;
      vk.Tk=st.T*(0.6+0.6*g)*(vk.uzun?1.2:vk.uzunYer?1.1:1)*(vk.kisa?0.7:1)*(ku==='iska'?1.15:ku==='ust'?0.6:1);
      vk.sert=((vk.stil==='ust'||vk.stil==='yarimVole'||vk.stil==='vole'||vk.stil==='falso'&&g>=0.7)&&g>=0.6)||(vk.uzun&&g>=0.5);
      const C=vk.C,F=vk.F,Tk=vk.Tk,Tm=Math.min(Tk,1.25),ic=vk.stil==='ic',dis=vk.stil==='dis',as=vk.stil==='asirtma',fa=vk.stil==='falso',bu=vk.stil==='burun';
      /* takip: iç ayakta kısa ve alçak, dış ayakta dışa, falsoda gövdenin önünden çapraz (sağ ayakta sola), burunda kısa saplama */
      F[0]=C[0]+(ic?-vk.yan*0.03:dis?vk.yan*0.12:fa?-vk.yan*0.3*Tm:bu?0:-vk.yan*0.12*Tm);F[1]=yG+(as?0.1+0.2*Tm:ic?0.08+0.3*Tm:bu?0.06+0.12*Tm:fa?0.1+lerp(0.45,0.3,wI)*Tm:0.12+lerp(0.55,0.3,wI)*Tm);
      F[2]=C[2]+(bu?0.12+0.2*Tm:fa?0.15+0.3*Tm:0.2+0.35*Tm);
      /* kötü vuruşun takibi: ıskada boşa savrulur, altına girmede yüksek, üstüne vurmada alçak ve kısa, kenardan vuruşta dışa kaçar */
      if(ku==='iska')F[1]+=0.1;else if(ku==='alt')F[1]+=0.25;else if(ku==='ust'){F[1]=yG+0.04+0.1*Tm;F[2]=C[2]+0.25;}else if(ku==='kenar')F[0]+=vk.yan*0.22*Tm;
      /* A8 (sutEgim): şutun takibinde gövde topun yükselişinden (temas karesinde topun hızı) — yerden sert şutta (< 4°) topun üstünde (öne) ve takip alçak,
         yükselen şutta (> 10°) geride; yarım volede takip alçak (diz topun üstünde) */
      {const A8=ANM.a8,sc=vur.sec||{};if(A8&&A8.sutEgim&&!ku&&sc.tur==='sut'&&(vk.stil==='ust'||vk.stil==='yarimVole'||vk.stil==='falso')){const bb=mac.ball,bh=Math.hypot(bb.vx||0,bb.vz||0);
        if(bh>8){const yk=Math.atan2(bb.vy||0,bh),f=yk<0.07?1:yk>0.17?-0.6:1-1.6*(yk-0.07)/0.1;vk.kLean+=A8.sutEgim*f;if(f>0)F[1]=Math.max(yG+0.06,F[1]-0.12*f*Tm);}}
       if(A8&&A8.yarim&&vk.stil==='yarimVole')F[1]=Math.max(yG+0.06,F[1]-0.1);}
      vk.tF=0.1+0.05*Tm;vk.tIn=0.1+0.05*Tm;
      if(vk.sert){vk.hopT=vk.tF+vk.tIn-0.04;vk.hopH=0.04+0.04*clamp((g-0.6)/0.4,0,1);}else{vk.hopT=0;vk.hopH=0;}
      vk.evre=3;vk.tT=0;vk.sBos=false;for(let k=0;k<3;k++)T[i*3+k]=C[k];vk.kp.set(C);vk.wT=1;vk.wG=0;}
  }
  else if(vk.evre===3||vk.evre===4){
    vk.tT+=dt;const C=vk.C,F=vk.F,Tm=Math.min(vk.Tk,1.25),eg=vk.stil==='ic'?0.06:vk.stil==='burun'?0.02:0.15;
    if(vk.evre===3){const v=clamp(vk.tT/vk.tF,0,1),s=1-(1-v)*(1-v);
      ANM_VK_Q[0]=lerp(C[0],F[0],0.4);ANM_VK_Q[1]=lerp(C[1],F[1],0.35)+0.03;ANM_VK_Q[2]=lerp(C[2],F[2],0.7);
      anmVkBez(C,ANM_VK_Q,F,s,vk.kp);vk.wT=1;vk.lean=(vk.kLean-eg*Tm)*s;vk.ofs=OF;
      if(v>=1){vk.evre=4;vk.tL=0;const Ln=vk.Ln,hiz=Math.sqrt(a.wvx*a.wvx+a.wvz*a.wvz);Ln[0]=vk.yan*0.1;Ln[1]=yG;Ln[2]=0.1+0.15*Tm+clamp(hiz*0.07,0,0.3);}}
    else{vk.tL+=dt;const f=clamp(vk.tL/vk.tIn,0,1),sm=f*f*(3-2*f),Ln=vk.Ln;
      vk.kp[0]=lerp(F[0],Ln[0],sm);vk.kp[2]=lerp(F[2],Ln[2],sm);vk.kp[1]=lerp(F[1],Ln[1],f*f);vk.wT=1-0.6*f;vk.lean=(vk.kLean-eg*Tm)*(1-sm);vk.ofs=OF*(1-0.4*sm);
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
/* T10f: hakem topunu bırakma (iki el önde, top bel hizasında; motor hakemde eylem 'birak') */
const ANM_HK_BIRAK={aL:-0.95,aR:-0.95,aLz:-0.15,aRz:0.15,eL:-0.6,eR:-0.6,hx:0.45};
function anmHk(r){let h=ANM_HK.get(r);if(!h){h={sira:[],cur:null,t:0,slot:0,P:[{},{}],olayT:-9,sonE:null,saatT:30,bayrakSag:false,isaretSag:false,basKare:-1};ANM_HK.set(r,h);}return h;}
/* işaret sırası: {tur, sure, hedef {x,z} (motor), yon (±1: atak yönü), theta (kol yüksekliği, rad), p (oyuncu)}; sifirla: öncekini keser */
function anmHkIsaret(r,liste,sifirla){if(!r)return;const h=anmHk(r);if(sifirla){h.sira.length=0;h.cur=null;}for(const s of liste)h.sira.push(s);h.olayT=mac.t||0;}
/* motor olayından işaretler (animasyonOlay'dan; olay motor adımının hemen ardından gelir, işaret aynı karede başlar) */
function anmHakemOlay(ad,v){
  const R=mac.refs;if(!R||!R.length||!v)return;
  const h0=R[0],Mz=typeof MZ!=='undefined'?MZ:0,yh=x=>x>0?R[1]:R[2],dir=t=>mac.dir?mac.dir[t]:1;
  if(ad==='faul'){const pen=!!v.penalti,du=mac.durus;
    anmHkIsaret(h0,[{tur:'duduk',sure:pen?0.7:0.45},pen&&du?{tur:'yon',sure:1.6,hedef:{x:du.x,z:du.z},theta:-0.5}:{tur:'yon',sure:1.3,yon:dir(v.takim),theta:0.35}],true);
    if(v.endirekt)anmHkIsaret(h0,[{tur:'endirekt',sure:14}]);}   /* T10f: dolaylı serbest vuruşta (yüksek ayak) kol top başka oyuncuya değene dek havada */
  /* T10f: zaman geçirmede uyarı — oyuncuya parmak sallar, saatine vurur; sakatlıkta sağlıkçıları kulübeden çağırır */
  else if(ad==='uyari'&&v.p)anmHkIsaret(h0,[{tur:'uyari',sure:1.1,p:v.p},{tur:'saat',sure:0.9}],true);
  else if(ad==='tedaviBasladi'&&v.p&&mac.kulubeler){const kb=mac.kulubeler[v.p.team];if(kb)anmHkIsaret(h0,[{tur:'cagir',sure:1.4,hedef:{x:kb.alan.x,z:kb.alan.z},theta:0.5}],true);}
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
  else if(ad==='duduk'){const h=anmHk(h0);if(!(h.cur&&h.cur.tur==='endirekt'||h.sira.some(s=>s.tur==='endirekt')))anmHkIsaret(h0,[{tur:'duduk',sure:0.5}],true);}   /* T10f: bekleyen endirekt işareti silinmez */
  /* T8e (Ek G5): barajlı serbest vuruşta hakem barajın ucunda 9,15 m'yi gösterir (motor olayı barajYeri; hedef top) */
  else if(ad==='barajYeri'&&v.hedef)anmHkIsaret(h0,[{tur:'yon',sure:1.2,hedef:v.hedef,theta:-0.25}],true);
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
  if(tur==='birak'){Object.assign(Q,ANM_HK_BIRAK);return;}
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
  /* T10f uyarı: işaret parmağı oyuncuya, kol hafifçe sallanır; çağırmada el kendine doğru */
  if(tur==='uyari'){const w=0.2*Math.sin(h.t*13);if(sag){Q.aLz+=w;Q.eL=-0.45;}else{Q.aRz-=w;Q.eR=-0.45;}}
  else if(tur==='cagir'){const w=0.5+0.5*Math.sin(h.t*9);if(sag)Q.eL=-0.2-1.3*w;else Q.eR=-0.2-1.3*w;}
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
    else if(e&&e.ad==='duduk'&&(mac.t||0)-h.olayT>0.1)anmHkIsaret(p,[{tur:'duduk',sure:Math.min(e.sure||0.6,0.9)}],true);
    else if(e&&e.ad==='birak')anmHkIsaret(p,[{tur:'birak',sure:e.sure||0.7}],true);}   /* T10f: hakem topu (motor eylemi) */
  if(h.cur){h.t+=dt;const c=h.cur;let bitti=h.t>=c.sure;
    if(c.tur==='endirekt'){const du=mac.durus,sur=(mac.phase==='durus'&&du&&du.endirekt)||!!(mac.ball&&mac.ball.endirekt);bitti=bitti||(h.t>1.2&&!sur);}
    /* T10f: serbest vuruş kullanıldı (oyun başladı), endirekt işareti sırada — yön işareti kesilir, kol hemen kalkar */
    else if(mac.phase==='play'&&mac.ball&&mac.ball.endirekt&&h.sira.length&&h.sira[0].tur==='endirekt')bitti=true;
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
    if(qe&&qe.ad==='vurus'){const tu=(qe.sec||{}).tur;if(tu==='sut'||tu==='orta'||tu==='korner'){k=q;e=qe;break;}}}   /* T8e: 'serbest' türü yok (şut/orta) */
  if(k&&ks.evre===0&&e!==ks.e){const tc=anmVkKalan(ANM_KS_TMP,k,e),d=Math.sqrt((k.x-p.x)*(k.x-p.x)+(k.z-p.z)*(k.z-p.z));
    if(tc<=0.32&&d<42){ks.evre=1;ks.t=0;ks.hopT=clamp(tc-0.07,0.1,0.24);ks.e=e;}}
  if(ks.evre===1){ks.t+=dt;const f=ks.t/ks.hopT;if(f<1){a.yEk=Math.max(a.yEk,4*0.07*f*(1-f));return clamp(f,0,1);}ks.evre=2;ks.t=0;}
  if(ks.evre===2){ks.t+=dt;if((!k||k.eylem!==ks.e)&&ks.t>0.5||ks.t>2.5){ks.evre=0;return 0;}return 1;}
  return 0;
}
/* ---- 1e. baraj (A2b, Ek G5; T8e): üyelik motorun görevinden (p.duranRol.rol 'baraj'; T8c). Motor doğrudan şutta kendisi sıçratır (barajZipla →
   p.zipla, p.yuk; zipla katmanı baraj pozlarını kullanır): bekleme eller önde (1), hazırlıkta çömelme (3), uçuş (2); vuruştan sonra oyuna döner.
   Eski yol (durus.barajdakiler listesi, vuranın temasından 0,06 sn önce 0,3–0,4 m sahte sıçrama) yalnız görevsiz üyede kalır (dondurulmuş
   kopyalar, yedek davranış). ---- */
const ANM_BARAJ={liste:null,kullanan:null,t:-9};
function anmBaraj(a,p,dt){
  const du=mac.durus,mt=mac.t||0,G=p.duranRol,gorevli=!!(G&&G.rol==='baraj');
  if(du&&du.barajdakiler){ANM_BARAJ.liste=du.barajdakiler;ANM_BARAJ.kullanan=du.kullanan;ANM_BARAJ.t=mt;}
  const B=ANM_BARAJ,bj=a.bj;
  if(gorevli){bj.t=-1;const z=p.zipla;
    if(z){if(bj.e!==z){bj.e=z;const K=a.kim||anmKimlik(a,p);bj.bas=h2((p.n|0)*5+1,(p.team|0)+11)<0.4;bj.basSol=K.faz>3.14;}return z.t<0?3:2;}
    return mac.phase==='durus'?1:0;}
  const uye=!G&&!!B.liste&&mt-B.t<2.5&&B.liste.includes(p);
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
const ANM_CK={makas:'aldat',govde:'aldat',sutCalim:'sut',rulet:'rulet',durKalk:'dur',hiz:'tempo',atKos:'yaris',sagSol:'yaris',kesme:'kesme',sirtDon:'kesme',cruyff:'sut'};   /* A4-5: Cruyff vuruş taklidi + iç ayakla sürükleme */
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
  /* A4-1: barajlı serbest vuruşta aldatma koşusu (motor: duranRol 'ikinci', aldatma): topun yanından geçerken vuruş taklidi — vuruş gerilmesi pozu
     topa 0,95 m'den yakınken artar, 0,35 m'de tam (0,85); vuran ayağa göre aynalı (önbellek aktörde) */
  const R=p.duranRol;
  if(R&&R.rol==='ikinci'&&R.aldatma&&!e&&mac.ball){const b=mac.ball,L=Math.hypot(b.x-p.x,b.z-p.z),w=0.85*(1-anmYumus((L-0.35)/0.6));
    if(w>0.001&&w>st[S.ckA]){st[S.ckA]=w;sp[S.ckA]=p.ayak==='sol'?(a._aldP||(a._aldP=aynala(ANM_VK_POZ.ustG))):ANM_VK_POZ.ustG;}}
}
/* top saklama: en yakın rakip (3 m içinde); yanı 0,12 sn histerezisle (gövdeye göre 0,2 m'den çok öbür yandaysa); baş kimliğin aralığıyla
   (1,3–2,0 sn) 0,6 sn rakibe döner */
/* T8e: duruşta kutudaki görevliler (yer kapma) ve r m içindeki en yakın rakip */
const ANM_KUTU_ROL=new Set(['hedefOn','hedefOrta','hedefArka','hedefNokta','hedefUzak','perde','perdeAdam','adam','bolge','direk']);   /* A4-2: perdeci markajcıyla itişir */
function anmYakinRakip(p,r){let o=null,ed=r*r;const R=mac.teams&&mac.teams[1-p.team];if(R)for(const q of R){if(!q.oyunda)continue;const d=(q.x-p.x)*(q.x-p.x)+(q.z-p.z)*(q.z-p.z);if(d<ed){ed=d;o=q;}}return o;}
function anmKorRakip(p){let o=null,ed=9;const R=mac.teams&&mac.teams[1-p.team];if(R)for(const q of R){if(!q.oyunda)continue;const d=(q.x-p.x)*(q.x-p.x)+(q.z-p.z)*(q.z-p.z);if(d<ed){ed=d;o=q;}}return o;}
function anmKoru(a,p,dt){
  const ck=a.ck,o=anmKorRakip(p);ck.korO=o;
  if(o){const yan=-(o.x-p.x)*Math.sin(p.yon)+(o.z-p.z)*Math.cos(p.yon),sg=yan>0;
    if(sg!==ck.korSag&&Math.abs(yan)>0.2){ck.korT+=dt;if(ck.korT>=0.12){ck.korSag=sg;ck.korT=0;}}else ck.korT=0;}
  const K=a.kim||anmKimlik(a,p),per=1.3+0.7*K.bekle;
  ck.korBak=!!o&&(zaman+K.faz)%per<0.6;
}

/* ---- 1i. T6f kafaya uzanma (Ek G4): top başın yakınından geçecekken (yatayda 2 m içinde bize doğru gelir; başın 0,3 m altından 0,45 m üstüne)
   ya da kafa eyleminin ilk 0,3 sn'sinde çizim gövdeyi topun yolunun başa en yakın noktasına doğru en çok 0,4 m kaydırır; kalanını öne ve yana
   eğilerek (en çok 0,5 rad) kapatır (anmEkler, kf.egim): motorun kafa teması baş merkezinin 0,23 m + uzanma (0,35–0,45 m) içindedir, çizilen baş
   temas karesinde topta olur (o karede anında). Yumuşatma 0,04 sn; motora yazılmaz.
   Hazırlık (kf.on): topun yolunun başa en yakın noktasına 0,3 sn kala yükselir, 0,05 sn kala tamdır — gövde yay gibi geriye gerilir (anmEkler);
   kırılma temasta başlar (motorun kafa eylemi temasla başlar) ---- */
function anmKafaUzan(a,p,dt,sy){
  const kf=a.kf,e=p.eylem,b=mac.ball;let ofs=0,egim=0,yuk=0,on=0;
  const kafa=!!e&&e.ad==='kafa'&&!e.bos,ilk=kafa&&(e!==kf.e||e.t<=(dt||0.017)*1.01);
  /* temastan sonra uzaklaşan topu izlemez: temas karesinin hedefi 0,05 sn tutulur, 0,2 sn'de söner */
  if(kafa&&!ilk){const f=clamp(1-(e.t-0.03)/0.17,0,1);ofs=kf.tOfs*f;egim=kf.tEgim*f;yuk=kf.tYuk*f;}
  /* T8e: barajdaki oyuncu (p.duranRol 'baraj') üstünden geçen topa uzanmaz (korunur; eskiden 0,4 m'ye dek kayıp başını kaldırıyordu) */
  else if(p.rol!=='GK'&&p.oyunda&&!(e&&(e.kilit||e.ad==='vurus'))&&!a.kucuk&&(kafa||!b.sahip&&!b.tasiyan)&&!(p.duranRol&&p.duranRol.rol==='baraj'&&!kafa)){
    const tb=anmVkTop(a.al),dx=tb[0]-a.x,dz=tb[2]-a.z,d=Math.sqrt(dx*dx+dz*dz),by=tb[1]+0.11,hy=1.79*sy+(p.yuk||0),vx=b.vx||0,vz=b.vz||0,v2=vx*vx+vz*vz;
    const gelir=vx*dx+vz*dz<0;
    if(kafa||(!e&&gelir&&d<2&&by>hy-0.3&&by<hy+0.45)){
      /* topun yolunun başa en yakın noktası (eylemde topun şimdiki yeri) */
      let cx=dx,cz=dz;if(!kafa&&v2>1){const ts=-(dx*vx+dz*vz)/v2;cx=dx+vx*ts;cz=dz+vz*ts;on=clamp(1-(ts-0.05)/0.25,0,1);}
      const dc=Math.sqrt(cx*cx+cz*cz);if(dc>0.05){kf.kd=Math.atan2(cz,cx);ofs=clamp(dc-0.12,0,0.4);egim=clamp((dc-0.12-ofs)/0.84,0,0.5);}
      /* eğilmenin alçalttığı kadar baş kalkar (boyun ve gövde uzanır); topun hizasına kalan dikey fark temas karesinde kök düzeltmesiyle (anmKok) */
      yuk=0.84*sy*(1-Math.cos(egim));}
    if(ilk){kf.e=e;kf.tOfs=ofs;kf.tEgim=egim;kf.tYuk=yuk;}}
  /* kafanın temas karesinde (eylemin ilk karesi) baş topa anında varır; öncesinde ve sonrasında 0,04 sn yumuşatma */
  const k=ilk?1:Math.min(1,dt/0.04);kf.ofs+=(ofs-kf.ofs)*k;kf.egim+=(egim-kf.egim)*k;kf.yuk+=(yuk-kf.yuk)*k;kf.on+=(on-kf.on)*Math.min(1,dt/0.05);
  if(kf.ofs>0.002){a.x+=Math.cos(kf.kd)*kf.ofs;a.z+=Math.sin(kf.kd)*kf.ofs;}
  if(kf.yuk>0.002)a.yEk=Math.max(a.yEk,kf.yuk);
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
  a.dEl=tur==='yuz'?ANM_POZ.dususElYuz:tur==='sirt'?ANM_POZ.dususElSirt:sag?ANM_POZ.dususElYan:aynala(ANM_POZ.dususElYan);   /* T5f: önce kollar */
  const yS=rnd()<0.5?ANM_POZ.yerdeSirt:ANM_POZ.yerdeSirt2,ay=rnd()<0.5;
  a.yP=tur==='yuz'?ANM_POZ.yerdeYuz:a.lieTur==='yan'?(sag?ANM_POZ.yerdeYan:aynala(ANM_POZ.yerdeYan)):(ay?aynala(yS):yS);
}
/* T10f (Ek G4): yerdeki sakatın tuttuğu yer — yatış türünden (yan: büzülür, yüz: el arka adaleye) ve sakatlıktan (kramp: bacak havada; kafa ve
   omuz: başı tutar; diz, bilek, baldır: dize uzanır); taraf yan yatışta yatıştan, öbürlerinde numaradan (rastlantısız) */
function anmSakatPoz(a,p){const s=p.sakat||{},t=a.lieTur,sol=h2((p.no|0)*5+1,(p.team|0)+3)<0.5;a.skSol=sol;
  if(s.tur==='kramp')return sol?aynala(ANM_POZ.kramp):ANM_POZ.kramp;
  if(t==='yan')return a.lieSag?ANM_POZ.sakatYan:aynala(ANM_POZ.sakatYan);
  const P0=t==='yuz'?ANM_POZ.sakatYuz:s.bolge==='kafa'||s.bolge==='omuz'?ANM_POZ.sakatBas:ANM_POZ.sakatDiz;return sol?aynala(P0):P0;}
/* T10f: gol sevinci profilden — golcüde her çeşidin puanı kimliğinden (agresiflik: yumruk, el kulakta; yaratıcılık: uçak; soğukkanlılık: parmak
   dudakta, sakin; çalışkanlık: kollar, arma) + numara ve golden küçük pay; arkadaşlar ilk dört çeşitten */
function anmSevincSec(p,h,golcu){if(!golcu)return Math.floor(h*ANM.sevincCesit)%Math.min(4,ANM.sevincCesit);
  const al=p.profil&&p.profil.alt,f=k=>al&&al[k]!=null?al[k]:0.5,n=(p.no|0)+(p.team|0)*31;
  const s=[0.5+0.3*f('caliskanlik'),0.3+0.6*f('yaraticilik'),0.3+0.7*f('agresiflik'),0.4+0.2*f('tutarlilik'),0.35+0.4*f('caliskanlik'),0.2+0.6*f('sogukkanlilik'),0.2+0.6*f('agresiflik'),0.15+0.6*f('sogukkanlilik')];
  let en=0,ev=-9;for(let i=0;i<s.length;i++){const v=s[i]+0.45*h2(n*17+i,(h*997)|0);if(v>ev){ev=v;en=i;}}return en;}
function anmBasla(a,p,e,ad){
  const b=mac.ball;
  if(ad==='tekme')anmVurusSec(a,p,e,ad);   /* maç öncesi ısınma vuruşu; maçtaki vuruş A2b'den beri vuruş katmanında (anmVurusDurum) */
  else if(ad==='kontrol'){
    /* A2b: dokunan ayak motorun son dokunuşundan (sonDokunus.ayak), yoksa topun yanından; yüzeye göre temas ve yumuşatma pozları */
    const sd=p.sonDokunus,y=e.yuzey;let sag=sd&&sd.tur==='kontrol'&&sd.ayak?sd.ayak!=='sol':anmSagda(p,b.x,b.z);
    /* A8 (alisAyak): dokunan ayak yerdeyse (adım döngüsünde çapada) ve öbürü havadaysa alış havadaki ayakla (gövdenin önünden, açık beden); yerdeki destek
       bacağının kanalları pozdan çıkar (IK çapada tutar). A8-0: kontrol pozu iki bacağın kanallarını yazıyor, yuva bacağın IK güvenini düşürüyordu — yerdeki
       ayak çapasından 0,1–0,3 m kayıp yere gömülüyor, poz sönünce geri sürükleniyordu (alıştan sonraki pencerede kaymanın çoğu) */
    const A8k=ANM.a8,an=a.anc;let destek=-1;
    if(A8k&&A8k.alisAyak&&an&&y!=='uyluk'){let i=sag?0:1;if(an[i]&&!an[1-i]){sag=!sag;i=1-i;}if(an[1-i]||(ANM.a9&&ANM.a9.destek))destek=1-i;}   /* A9 (destek): destek bacağı hep IK'da */
    const P0=y==='uyluk'?ANM_POZ.kontrolUyluk:y==='dis'?ANM_POZ.kDis:y==='taban'?ANM_POZ.kTaban:ANM_POZ.kIc,P1=y==='uyluk'?ANM_POZ.kUyluk2:y==='dis'?ANM_POZ.kDis2:y==='taban'?ANM_POZ.kTaban2:ANM_POZ.kIc2;
    a.kP=sag?P0:aynala(P0);a.kP2=sag?P1:aynala(P1);
    if(destek>=0){const B=ANM_IK[destek],cik=Q=>{const R=Object.assign({},Q);delete R[B.l];delete R[B.k];delete R[B.z];delete R[B.l+'y'];return R;};a.kP=cik(a.kP);a.kP2=cik(a.kP2);}
    /* A8 (alis): yönlü alışta (dokunuşun yönü — kontrol.yon — çizilen gövdenin önünden 30°'den çok sapıyor; kötü dokunuş ve uyluk hariç) kalça ve gövde o yöne
       açılır — yana süpüren iç ayak, açık beden; kalça payı ANM.a8.alis × açı (en çok ±1,3 rad), gövde yarısı. Kök dönüşünden önde gider (baş gibi) */
    const A8=ANM.a8;if(A8&&A8.alis>0&&e.yon!=null&&!e.kotu&&y!=='uyluk'){const G=anmVkGovde(a,a.x+Math.cos(e.yon),a.z+Math.sin(e.yon),1),th=Math.atan2(G[0],G[1]);
      if(Math.abs(th)>0.5){const k=A8.alis*clamp(th,-1.3,1.3),ac=Q=>Object.assign({},Q,{hy:(Q.hy||0)+k,gy:(Q.gy||0)+0.5*k});a.kP=ac(a.kP);a.kP2=ac(a.kP2);}}
    /* A8 (alisAyak): dokunan bacak (a.kI) yerdeyken pozun o bacaktaki kanalları da çıkar (a.kPu, a.kP2u) — yerdeki ayak IK'da çapada kalır (ayakta alışta bacak
       kalkmaz, gövde ve kollar alışı gösterir; alış sırasında basan ayak capaCiz ile çizildiği yere çivilenip oradan kaymaz) */
    a.kI=sag?0:1;a.kPu=null;
    if(A8k&&A8k.alisAyak){const B=ANM_IK[a.kI],L=[B.l,B.k,B.z,B.l+'y'],ayir=Q=>{const U={},G={};for(const k in Q){if(L.includes(k))G[k]=Q[k];else U[k]=Q[k];}return[U,G];};
      [a.kPu,a.kPb]=ayir(a.kP);[a.kP2u,a.kP2b]=ayir(a.kP2);}}
  /* T5f: müdahalenin türü (sözleşme mudahale.tur): yan ve toparlanma yandan uzanma; acik — hızla üstüne gelen topta önden blok duruşu, yoksa uzanma;
     erken ve donus çoğu zaman blok duruşu */
  else if(ad==='mudahale'){const tur=e.tur||'acik',bv=Math.hypot(b.vx||0,b.vz||0),gelen=bv>4&&((b.x-p.x)*(b.vx||0)+(b.z-p.z)*(b.vz||0))<0;
    const B=tur==='erken'||tur==='donus'?rnd()<0.6:tur==='acik'?gelen:false,P0=B?ANM_POZ.mudahaleB:ANM_POZ.mudahaleV,sg=anmSagda(p,b.x,b.z);a.mP=sg?P0:aynala(P0);a.mI=sg?0:1;a.mT=null;}
  /* T6f: kafanın yüzeyi (sözleşme kafa.yuzey; düellonun kaybedeni alın) */
  else if(ad==='kafa'){const y=e.yuzey||'alin',sag=anmSagda(p,b.x,b.z);
    /* T8e (Ek G4/G5): koşarak (> 4,5 m/sn) alnın 0,15 m altındaki topa kafa — yarı plonjon: gövde öne yatar, kollar öne (motor oyuncuyu
       düşürmez; tam plonjon — motorun dalışı ve yere inişi — T14e'de, aşağıda) */
    const plonjon=!e.bos&&!p.zipla&&(p.spd||0)>4.5&&b.y<1.72*(p.boy||1)+0.02-0.15;
    a.kfP=plonjon?ANM_POZ.kafaPlonjon:y==='tepe'?ANM_POZ.kafaTepe:y==='yuz'?(sag?ANM_POZ.kafaYuz:aynala(ANM_POZ.kafaYuz)):y==='yan'?(sag?ANM_POZ.kafaYan:aynala(ANM_POZ.kafaYan)):ANM_POZ.kafaAlin;
    /* T14e: tam plonjon (motor kafa.plonjon): temas karesinde baş topa — gövde topun yüksekliğine göre öne yatar (baş merkezi kökten 1,72·boy),
       kalan yatay fark kökün topa kaymasıyla; yüzüstü iniş ve kalkış (yerde, kalkis) bu yatıştan sürer */
    if(e.plonjon){a.kfP=ANM_POZ.kafaPlonjonTam;const tb=anmVkTop(a.al),dx=tb[0]-a.x,dz=tb[2]-a.z,Lh=1.72*(p.boy||1),th0=Math.acos(clamp((tb[1]+0.11)/Lh,0.15,1));
      a.pjTh0=th0;a.pjOfs=clamp(Math.sqrt(dx*dx+dz*dz)-Lh*Math.sin(th0),-0.6,0.6);a.pjKd=Math.atan2(dz,dx);a.lkx=1;a.lkz=0;a.lps0=0;a.lieTur='yuz';a.lieSag=true;a.yP=ANM_POZ.yerdeYuz;}}
  /* T5f: şut bloğuna atlama — hızlı gelen topta (> 12 m/sn) bacaklar çekilir, küçük sıçrama (anmEylemler) */
  else if(ad==='blok'){a.bZip=Math.hypot(b.vx||0,b.vz||0)>12&&!(ANM.blok&&ANM.blok.acik&&e.by!=null&&e.by-(p.yuk||0)<0.8);   /* A6c: alçak topta sıçramaz, bacak uzanır */const P0=a.bZip?ANM_POZ.blokZipla:ANM_POZ.blok;a.bP=anmSagda(p,b.x,b.z)?P0:aynala(P0);}
  else if(ad==='kayma'){const sag=anmSagda(p,b.x,b.z);a.kyP=sag?ANM_POZ.kayma:aynala(ANM_POZ.kayma);if(a.lth<0.1){a.lkx=0;a.lkz=sag?-1:1;}a.lieTur='kayma';a.lieSag=!sag;}
  else if(ad==='dusus')anmDususBasla(a,p,e);
  else if(ad==='yerde'){if(a.lth<0.3)anmDususBasla(a,p,e);}
  else if(ad==='kalkis'){a.kTh0=a.lth;a.kPs0=a.lps;const t=a.lth<0.25?'':a.lieTur,sag=a.lieSag;
    a.kkP=t==='yuz'?ANM_POZ.kalkYuz:t==='yan'||t==='ucus'||t==='kapan'||e.kaleci?(sag?ANM_POZ.kalkYan:aynala(ANM_POZ.kalkYan)):ANM_POZ.kalkSirt;
    a.kkP2=(e.sure||0.6)>=1.4&&(t==='yuz'||t==='sirt'||t==='yanSirt'||t==='')?ANM_POZ.kalkDiz:null;}   /* T5f: uzun kalkışta (1,6 sn) dizlerin üstünden */
  /* T9b-e: dalışın yönü motorun dalış ekseninden (ucus.lx/lz; yoksa yan), çökme dalışı (ucus.tur 'cokme') kendi pozlarıyla */
  else if(ad==='ucus'){const vx=e.lx!=null?e.lx:e.vx||0,vz=e.lz!=null?e.lz:e.vz!=null?e.vz:(e.yan||1);let r=-vx*Math.sin(p.yon)+vz*Math.cos(p.yon);if(!r)r=e.yan||1;const sag=r>0;
    a.uY=e.hedefY!=null?e.hedefY:e.y!=null?e.y:0.8;const tek=e.el?e.el==='tek':a.uY>1.6;a.uCok=e.tur==='cokme';
    a.uP=a.uCok?(sag?ANM_POZ.ucusCokme:aynala(ANM_POZ.ucusCokme)):tek?(sag?ANM_POZ.ucusTek:aynala(ANM_POZ.ucusTek)):ANM_POZ.ucusCift;a.uNP=sag?ANM_POZ.ucusIn:aynala(ANM_POZ.ucusIn);
    a.uIP=a.uCok?(sag?ANM_POZ.cokmeItis:aynala(ANM_POZ.cokmeItis)):ANM_POZ.ucusItis;
    if(a.lth<0.1){a.lkx=0;a.lkz=sag?1:-1;}a.lieTur='ucus';a.lieSag=sag;}
  /* T6f: motor 'yukari' yazar; T15d: tür motorun kaleciTutusTuru'ndan (yoksa aynı eşiklerle topun yüksekliğinden: 0,55 · 1,25 · 1,9 m); kepçe iki
     anahtar karelidir (a.tMix, anmEylemler) */
  else if(ad==='tutus'){const B=p.boy||1,tur=e.tur==='yuksek'?'yukari':e.tur||(b.y<0.55*B?'yer':b.y<1.25*B?'gogus':b.y<1.9*B?'W':'yukari');a.tK=tur;
    a.tP=tur==='yukari'?ANM_POZ.tutYuksek:tur==='W'?ANM_POZ.tutW:tur==='yer'?(a.tMix||(a.tMix=Object.assign({},ANM_POZ.tutKepce))):ANM_POZ.tutGogus;}
  else if(ad==='omuz'){const r=e.rakip;const sag=r&&r.x!=null?anmSagda(p,r.x,r.z):(e.taraf==='sag'||e.taraf>0);a.oP=sag?ANM_POZ.omuz:aynala(ANM_POZ.omuz);a.oSag=sag?1:-1;}
  else if(ad==='sendele'){const y=e.yon!=null?e.yon:Math.atan2(p.vz||0,p.vx||1),r=y-p.yon;a.sdX=-Math.sin(r);a.sdZ=Math.cos(r);a.sdS=e.siddet!=null?clamp(e.siddet,0.2,1):0.6;}
  /* T9b-e: kapanmanın türü (sözleşme kapan.tur): yayıl (yere yayılma, eski kapanma), K-blok (bacak topun yanına), yıldız (ayakta) */
  else if(ad==='kapan'){let sag;if(e.yon!=null)sag=Math.sin(e.yon-p.yon)>0;else sag=anmSagda(p,b.x,b.z);const ty=e.tur||'yayil';
    a.kpnP=ty==='kblok'?(anmSagda(p,b.x,b.z)?ANM_POZ.kapanKblok:aynala(ANM_POZ.kapanKblok)):ty==='yildiz'?ANM_POZ.kapanYildiz:ANM_POZ.kapan;
    if(ty!=='yayil')a.lieTur='';else{if(a.lth<0.1){a.lkx=0;a.lkz=sag?1:-1;}a.lieTur='kapan';a.lieSag=sag;}}
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
  /* A9 (dokItme): dokunuşun adım evresi itişi kritik sönümlü yayla (ω = dokItme rad/sn; evrenin hızı sürekli) — birinci dereceden itiş evrenin hızını ilk karede
     birden değiştiriyor, veri eğrisindeki kol ve dirsek karede 0,06 rad'dan çok kırılıyordu (A9-0: üst gövde kırılmasının ~%19'u top sürmede itişte); 0: eski */
  const iw=ANM.a9&&ANM.a9.dokItme>0?ANM.a9.dokItme:0;
  if(iw>0){if((a.phItme||a.phItmeV)&&dt>0){const n=anmAltAdim(iw,dt),h=dt/n;for(let s=0;s<n;s++){a.phItmeV+=(iw*iw*a.phItme-2*iw*a.phItmeV)*h;const d=a.phItmeV*h;a.ph+=d;a.phItme-=d;}
    if(Math.abs(a.phItme)<0.005&&Math.abs(a.phItmeV)<0.3){a.phItme=0;a.phItmeV=0;}}}
  else if(a.phItme&&dt>0){const d=a.phItme*Math.min(1,dt*10);a.ph+=d;a.phItme-=d;if(Math.abs(a.phItme)<0.005)a.phItme=0;}
  if(a.kucuk||!p.oyunda)return;
  const sd=p.sonDokunus,b=mac.ball;let yeni=false,ayak=-1;
  if(sd){if(sd.t!==a.dokSon){yeni=a.dokSon!==undefined;a.dokSon=sd.t;ayak=sd.ayak==='sol'?1:sd.ayak==='sag'?0:-1;}}
  else if(b.sonDokunan===p&&b.surum!==a.dokSurum){a.dokSurum=b.surum;yeni=b.sahip===p&&b.y<0.4;}
  if(!yeni)return;
  /* A8 (dokunus): vuruş hazırlığında (son adımdan önce) motorun sürüş dokunuşları çizilir — uzun topta açma (T21c), ters yöne kaçan topu tabanla durdurma
     (T20b); eskiden eylem sürerken hiçbir dokunuş çizilmiyordu (top ayaksız kayıyordu) */
  const A8=ANM.a8,vkD=!!(e&&A8&&A8.dokunus&&e.ad==='vurus'&&sd&&sd.tur==='surus'&&a.vk&&a.vk.evre<=1);
  if(e&&!vkD)return;
  /* T4g: çalım hazırlığındaki kısa kontrol dokunuşları çizilmez ve adım evresini itmez (ayaklar çalım katmanında); itişi çalım katmanının
     seçtiği ayak yapar (aldatmada dış ayak, şut çalımında vuruş ayağı), poz yüzeyden: dış, iç, üst (uzun itiş) */
  const ck=a.ck,cal=!!(sd&&sd.calim);if(!cal&&ck&&ck.evre===1)return;
  let yz=sd?sd.yuzey:null;if(cal&&ck&&ck.itAyak>=0){ayak=ck.itAyak;yz=ck.itYuzey;}
  if(ayak<0)ayak=anmSagda(p,b.x,b.z)?0:1;
  /* A6a (2026-10-17): top saklamada taban dokunuşu yalnız salınımdaki ayakla (ANM.koru.dokunus 1): seçilen ayak yerdeyse öbürü havadaysa o, ikisi de
     yerdeyse dokunuş çizilmez — yerdeki ayağın bacak pozu IK'yı ezip ayağı çapasından çekiyordu (A6-0: top saklama kaymasının %68'i); 0: hiç çizilmez */
  const koruK=p.tavir==='koru'&&ANM.koru?ANM.koru.dokunus:2;
  if(koruK===0){a.dokKoru=true;return;}
  if(koruK===1&&a.anc){if(a.anc[ayak]){if(!a.anc[1-ayak])ayak=1-ayak;else{a.dokKoru=true;return;}}}
  /* A8 (dokSal): top sürmede de (çalım dışı) dokunuş yalnız salınımdaki ayakla — A6a'nın top saklama kuralı: seçilen ayak yerdeyse öbürü havadaysa o, ikisi de
     yerdeyse çizilmez; ayak yere basınca poz kalkar. A8-0: alıştan sonraki pencerede yerdeki ayağın %67'si kayıyordu — dokunuş pozu çapadaki ayağı 0,1–0,5 m
     sürüklüyor, yere 3–12 cm gömüyordu (genel kayma satırında top süren tek oyuncu olduğundan görünmüyordu) */
  const salK=!!(!cal&&koruK===2&&A8&&A8.dokSal&&a.anc);
  if(salK&&a.anc[ayak]){if(!a.anc[1-ayak])ayak=1-ayak;else return;}
  const bt=a.beta,hu=bt+0.72*(1-bt);let u=a.ph/6.283185307179586+ayak*0.5;u-=Math.floor(u);let d=hu-u;d-=Math.round(d);
  /* T2: dönüş dokunuşu (sözleşme: sonDokunus.donus) gövdeyi dönüşe yatırır, ayak topu içe/dışa çeker; T4g: taban dokunuşunda ayak topun üstünde */
  /* A8: tabanla geri çekme (sonDokunus.hareket 'cekme') taban pozuyla (ayak topun üstünde; eskiden dönüş dokunuşu); ileri uzun itişte (yüzey 'ust', top oyuncudan
     1,5 m/sn'den hızlı) uzun itiş pozu (surukle); açma dokunuşu iç ayak itişiyle — dokAlcak açıkken (varsayılan) pozların yalnız bacaksız kısmı kalır:
     dokunuşu adım evresi itişi ve alçak süpürme çizer */
  const cek=!!(A8&&A8.dokunus&&!cal&&sd&&sd.hareket==='cekme'),bvD=Math.hypot(b.vx||0,b.vz||0),uzunIt=!!(A8&&A8.surukle&&!cal&&!cek&&yz==='ust'&&bvD>Math.hypot(p.vx||0,p.vz||0)+1.5);
  const P0=cal?(yz==='dis'?ANM_POZ.dokunDis:yz==='ust'?ANM_POZ.dokunUzun:ANM_POZ.dokunIc):cek?ANM_POZ.dokunTaban:sd&&sd.donus?ANM_POZ.dokunDon:yz==='taban'?ANM_POZ.dokunTaban:uzunIt?ANM_POZ.dokunUzun:vkD?ANM_POZ.dokunIc:ANM_POZ.dokun;
  /* T4h: top saklamada (motor saniyede ~4,5 kez tabanla dokunur) dokunuş adım evresini itmez ve taban pozu hafiftir (eskiden yerdeki ayak temasın %55'inde kayıyordu) */
  const koru=p.tavir==='koru';a.dokKoru=koru;
  /* A8 (dokAlcak): top sürmede (çalım ve top saklama dışı) dokunuşun bacak kanalları pozdan çıkar — salınan ayak IK'da kalır, salınımı alçalır (adım döngüsü:
     ayak topa doğru alçaktan süpürür, yerin altına inmez); A8-0: bacak pozu salınan ayağı yerin 5–13 cm altına indiriyordu */
  const dAl=!!(A8&&A8.dokAlcak&&!cal&&koruK===2);a.dokLow=dAl;
  if(!koru)a.phItme=clamp(d*6.283185307179586,-0.9,0.9);a.dokT=0;a.dokP=dAl?(P0===ANM_POZ.dokunDon&&ANM.a9&&ANM.a9.dokDirsek?anmUstPozD(ayak?aynala(P0):P0):anmUstPoz(ayak?aynala(P0):P0)):ayak?aynala(P0):P0;a.dokDon=!!(sd&&sd.donus);a.dokCal=cal;a.dokS=cal?0.26:uzunIt||vkD?0.24:ANM.dokunus;a.dokAyak=ayak;a.dokSal=koru&&koruK===1||salK;a.dokUzun=uzunIt||vkD;
}

/* A8: pozun bacak kanalları dışındaki kısmı (önbellekli; aynalanmış pozlar da önbellekten geldiğinden kimlik sabit) */
const ANM_UST=new Map();
function anmUstPoz(P){let U=ANM_UST.get(P);if(!U){U={};for(const k in P)if(ANM_BACAK[k]!==1)U[k]=P[k];ANM_UST.set(P,U);}return U;}
/* A9 (dokDirsek): dirseksiz sürümü — top sürmede dönüş dokunuşu (dokunDon) dirseği 0,09 sn'de koşunun ~105°'sinden ~25°'ye açıyordu (karede 0,1–0,2 rad'lık
   ikinci fark; A9-0: üst gövde kırılmasının kalanının en büyük kaynağı); kolun yana açılması, gövdenin yatışı ve eğimi kalır */
const ANM_UST_D=new Map();
function anmUstPozD(P){let U=ANM_UST_D.get(P);if(!U){U={};for(const k in P)if(ANM_BACAK[k]!==1&&k!=='eL'&&k!=='eR')U[k]=P[k];ANM_UST_D.set(P,U);}return U;}
/* ---- 2. eylem yuvalarının hedef ağırlıkları ---- */
function anmEylemler(a,p,dt){
  const e=p.eylem,ad=e?e.ad:'',b=mac.ball,st=a.st,sp=a.sp,S=ANM_S,ph=mac.phase;
  if(e!==a.eyl){a.eyl=e;a.eylAd=ad;if(e)anmBasla(a,p,e,ad);}
  anmDokunus(a,p,e,dt);
  /* A9 (dokTepe): bacaksız dokunuşta (dokAlcak: yalnız gövde, kol ve baş kanalları) yuvanın zarfı sin² — sin zarfı başta ve sonda eğimli: dönüş dokunuşunun
     kolu ve dirseği karede 0,06 rad'dan çok kırılıyordu; bacaklı pozlar (çalım, top saklama) eski zarfta; 0: eski */
  if(a.dokT>=0){const tpD=tepe(a.dokT,a.dokS);st[S.dokun]=(a.dokCal?0.8:a.dokKoru?0.3:a.dokDon?0.75:a.dokUzun?0.7:0.55)*(a.dokLow&&ANM.a9&&ANM.a9.dokTepe?tpD*tpD:tpD);sp[S.dokun]=a.dokP;
    /* A6a: salınımdaki ayakla dokunuşta ayak yere basınca poz hemen kalkar (yuvanın sönmesi beklenmez: bacak IK'sı çapayı tutar) */
    if(a.dokSal&&a.anc&&a.anc[a.dokAyak]){a.dokT=-1;st[S.dokun]=0;a.sw[S.dokun]=0;a.swV[S.dokun]=0;}}
  /* A2b: vuruşun üst gövdesi vuruş katmanından (geri salınım ve takip ağırlıkları; iniş ve çıkış motorun eylemi bittikten sonra da sürer) */
  const vk=a.vk;
  if(vk&&vk.evre>0&&(ad==='vurus'||!ad)){if(vk.wG>0){st[S.vG]=vk.wG;sp[S.vG]=vk.pG;}if(vk.wT>0){st[S.vT]=vk.wT;sp[S.vT]=vk.pT;}}
  /* T9b-e: kötü vuruşta (ıska, altına girme) denge — kollar yana açılır, gövde geride (temastan 0,75 sn; iniş ve çıkış eylem bittikten sonra da) */
  if(vk&&vk.kotu&&(vk.kotu==='iska'||vk.kotu==='alt')&&(ad==='vurus'||!ad)){st[S.vD]=0.85*anmZarf(vk.kotuT,0.75,0.06,0.35);sp[S.vD]=ANM_POZ.vkDenge;}
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
    /* A8 (alisAyak): dokunan bacağın kanalları ayrı yuvada, o ayak havadayken (adım döngüsünde çapada değilken) */
    if(a.kPu&&ANM.a8&&ANM.a8.alisAyak){const lw=a.anc&&a.anc[a.kI]?0:1;st[S.kontrol]=z*(1-c);sp[S.kontrol]=a.kPu;st[S.kontrol2]=z*c;sp[S.kontrol2]=a.kP2u;
      st[S.kontrolB]=z*(1-c)*lw;sp[S.kontrolB]=a.kPb;st[S.kontrol2B]=z*c*lw;sp[S.kontrol2B]=a.kP2b;}
    else{st[S.kontrol]=z*(1-c);sp[S.kontrol]=a.kP;st[S.kontrol2]=z*c;sp[S.kontrol2]=a.kP2||a.kP;}}
  else if(ad==='gogus'){const s=e.sure||0.4,z=anmZarf(e.t,s,0.05,0.12),c=clamp((e.t-s*0.35)/(s*0.4),0,1);
    st[S.gogus]=z*(1-c);sp[S.gogus]=ANM_POZ.gogusAl;st[S.gogus2]=z*c;sp[S.gogus2]=ANM_POZ.gogusBirak;}
  /* T6f: kafa pozu temasta gelir (kırılma), 0,12 sn sonra söner (motorun eylemi 0,5 sn; son 0,38 sn'de çıkış) */
  else if(ad==='kafa'){st[S.kafa]=anmZarf(e.t,e.sure||0.5,0.01,0.38);sp[S.kafa]=a.kfP||ANM_POZ.kafa;}
  else if(ad==='omuz'){st[S.omuz]=anmZarf(e.t,e.sure||0.5,0.1,0.15);sp[S.omuz]=a.oP;}
  else if(ad==='sendele'){st[S.sendele]=anmZarf(e.t,e.sure||0.6,0.06,0.2);sp[S.sendele]=ANM_POZ.sendele;}
  /* T5f: uzanan bacak (sözleşme mudahale.bacak; temastan sonra 0,25 sn yerinde) sürerken poz tam ağırlıkta kalır */
  else if(ad==='mudahale'){const s=e.sure||0.5,t=e.t,tm=e.temas||0.16;st[S.mudahale]=t<tm?t/tm:(e.bacak||t<tm+0.14)?1:Math.max(0,1-(t-tm-0.14)/Math.max(0.05,s-tm-0.14));sp[S.mudahale]=a.mP;}
  /* T6f: kayma 0,09 sn'de açılır (yuva 24/sn; eskiden 0,12 ve 12/sn): motorun kayma erişimi ilk adımdan 1,05 m, topa 0,12 sn'de değebiliyor */
  else if(ad==='kayma'){st[S.kayma]=Math.min(1,e.t/0.09);sp[S.kayma]=a.kyP;}
  else if(ad==='blok'){st[S.blok]=tepe(e.t,e.sure);sp[S.blok]=a.bP;if(a.bZip){const f=clamp(e.t/(e.sure||0.45),0,1);a.yEk=Math.max(a.yEk,0.14*Math.sin(Math.PI*f));}}
  else if(ad==='ucus')anmUcus(a,p,e);
  else if(ad==='kapan'){const ty=e.tur||'yayil';sp[S.kapan]=a.kpnP||ANM_POZ.kapan;
    st[S.kapan]=ty==='yildiz'?anmZarf(e.t,e.sure||0.55,0.08,0.18):ty==='kblok'?anmZarf(e.t,e.sure||0.5,0.1,0.15):anmZarf(e.t,e.sure||0.8,0.15,0.25);
    if(ty==='yildiz'){const f=clamp(e.t/0.3,0,1);a.yEk=Math.max(a.yEk,0.06*Math.sin(Math.PI*f));}}   /* yıldızda küçük sıçrama (motor kapan.hy) */
  /* T6f (Ek G6): yüksek tutuşta ve yüksek topa yumrukta kaleci sıçrar (kök) */
  else if(ad==='tutus'){st[S.tutus]=anmZarf(e.t,e.sure||0.35,0.07,0.12);
    /* T15d kepçe: avuçlar topun altında; tutuşta (kurtarış eylemi değil) 0,12 sn'den sonra top 0,18 sn'de göğse çekilir */
    if(a.tK==='yer'&&a.tMix){const f=e.kurtar?0:clamp((e.t-0.12)/0.18,0,1),A=ANM_POZ.tutKepce,C=ANM_POZ.tutKepce2;for(const k in A)a.tMix[k]=A[k]+(C[k]-A[k])*f;}
    sp[S.tutus]=a.tP;if(a.tP===ANM_POZ.tutYuksek){const f=clamp(e.t/(e.sure||0.35),0,1);a.yEk=Math.max(a.yEk,0.28*Math.sin(Math.PI*f));}}
  else if(ad==='yumruk'){st[S.yumruk]=tepe(e.t,e.sure);sp[S.yumruk]=ANM_POZ.yumruk;if(p.rol==='GK')a.yEk=Math.max(a.yEk,0.25*tepe(e.t,e.sure||0.5));}
  else if(ad==='elleAtis'){const t=e.t,s=e.sure||0.6,sol=p.ayak==='sol',yv=e.stil==='yuvarla';
    if(a.dg.e!==e){a.dg.e=e;const A=yv?ANM_POZ.yuvarlaAt:ANM_POZ.omuzAt,B=yv?ANM_POZ.yuvarlaTakip:ANM_POZ.omuzTakip;a.dg.P0=sol?aynala(A):A;a.dg.P1=sol?aynala(B):B;}
    const c=clamp((t-0.02)/0.18,0,1),son=clamp((s-t)/0.25,0,1);
    st[S.elleAtis]=Math.min(1,t/0.04)*(1-c)*son;sp[S.elleAtis]=a.dg.P0;st[S.elleAtisT]=c*son;sp[S.elleAtisT]=a.dg.P1;}
  /* T5f düşüş (Ek G4): önce kollar (koruyucu) uzanır, gövde sonra katlanır — ilk yarı pozu ikinci yarıda düşüş pozuna karışır */
  else if(ad==='dusus'){st[S.dusus]=1;if(a.dEl&&a.dP){const f=clamp(e.t/(e.sure||0.45),0,1),c=clamp((f-0.25)/0.5,0,1);sp[S.dusus]=anmPozKaris(a.dMix,a.dEl,a.dP,c*c*(3-2*c));}else sp[S.dusus]=a.dP;}
  else if(ad==='yerde'){st[S.yerde]=1;sp[S.yerde]=a.yP;}
  /* kalkış: süre motordan (T5: kaymadan 0,7, yandan 1,1, yüzüstü/sırtüstü 1,6 sn); T5f: uzun kalkışta doğrulma → dizlerin üstünde → ayağa */
  else if(ad==='kalkis'){const f=clamp(e.t/(e.sure||0.6),0,1);st[S.yerde]=Math.max(0,1-f/0.35);st[S.ucusN]=Math.max(0,1-f/0.35);
    if(a.lieTur==='kayma')st[S.kayma]=Math.max(0,1-f/0.45);
    if(a.kkP2){st[S.kalk]=f<0.25?f/0.25:Math.max(0,1-(f-0.25)/0.3);sp[S.kalk]=a.kkP;st[S.kalk2]=f<0.4?clamp((f-0.2)/0.2,0,1):Math.max(0,1-(f-0.6)/0.35);sp[S.kalk2]=a.kkP2;}
    else{st[S.kalk]=f<0.35?f/0.35:Math.max(0,1-(f-0.35)/0.6);sp[S.kalk]=a.kkP;}}
  else if(ad==='itiraz'){st[S.itiraz]=Math.min(1,e.t*4)*Math.min(1,(e.sure-e.t)*4);sp[S.itiraz]=POSE.itiraz;}
  /* T8e (Ek G5): topu yerleştirme (motor yerlestir 0,6 sn): eğilir, elini topa uzatır, doğrulur */
  else if(ad==='yerlestir'){st[S.yerlestir]=anmZarf(e.t,e.sure||0.6,0.18,0.22);sp[S.yerlestir]=ANM_POZ.yerlestir;}
  /* taç: top başın üstünde; atışta kollar öne. T8e: uzun taçta koşu evresi (tac.faz 'kosu') — top başın arkasında, gövde geride; bırakış 'at'ta */
  else if(ad==='tac'){if(e.faz==='kosu'){st[S.tac]=1;sp[S.tac]=ANM_POZ.tacKosu;}
    else{st[S.tac]=1;sp[S.tac]=ANM_POZ.tac;sp[S.tacAt]=ANM_POZ.tacAt;if(e.faz!=='tut'){const f=e.ft/0.34;st[S.tacAt]=f<1?f*f:Math.max(0,1-(e.ft-0.34)/0.3);}}}
  /* top toplayıcının atışı; T8e: yuvarlamada (atis.stil 'yuvarla') çömelip yerden (eskiden yuvarlama da baş üstünden çiziliyordu) */
  else if(ad==='atis'){const f=e.t/e.sure;
    if(e.stil==='yuvarla'){const c=clamp((f-0.1)/0.35,0,1),son=clamp((1-f)/0.3,0,1);st[S.elleAtis]=Math.min(1,f/0.08)*(1-c)*son;sp[S.elleAtis]=ANM_POZ.yuvarlaAt;st[S.elleAtisT]=c*son;sp[S.elleAtisT]=ANM_POZ.yuvarlaTakip;}
    else{st[S.tac]=f<0.4?f/0.4:0;st[S.tacAt]=f>=0.4?1-(f-0.4)/0.6:0;sp[S.tac]=ANM_POZ.tac;sp[S.tacAt]=ANM_POZ.tacAt;}}
  /* T10f (Ek G4): yerdeki sakat (tedavi ve çıkışta p.sakat; ağrıda topal) sakat yeri tutar — düşüşün son %40'ından, yatarken */
  if((p.sakat||p.topal)&&(ad==='yerde'||ad==='dusus'&&e.t>(e.sure||0.45)*0.6)){if(a.skE!==(p.sakat||p.topal)){a.skE=p.sakat||p.topal;a.skP=anmSakatPoz(a,p);}st[S.sakat]=1;sp[S.sakat]=a.skP;}
  /* T10f: sağlıkçı — kramp tedavisinde biri bacağı gerdirir (çömelme yerine), sedyede iki uçta sedyeyi tutar */
  a.gerdirAktif=false;if(p.kind==='saglikci'&&p.gorev){const A=p.gorev,hasta=A.p;
    if(mac.sedye&&mac.sedye.p===hasta){st[S.sedyeTut]=1;sp[S.sedyeTut]=ANM_POZ.sedyeTut;}
    else if(p.poz==='comel'&&hasta&&hasta.sakat&&hasta.sakat.tur==='kramp'){const M=mac.saglikcilar?mac.saglikcilar(p.team):null;if(M&&M[0]===p){a.gerdirAktif=true;st[S.gerdir]=1;sp[S.gerdir]=ANM_POZ.gerdir;}}}
  /* T10f (T7'den): pres koşusu duruşu — takımın birinci baskıcısı (motor _pres1) hızla rakibe giderken; markajda el teması — adamına 1 m'den
     yakın markajcı (motor _markaj) kolunu rakibin sırtına uzatır (eylemsiz, oyunda) */
  if(!e&&ph==='play'&&p.tur==='oyuncu'){const P1=mac._pres1;if(P1&&P1[p.team]===p&&(p.spd||0)>3.2){st[S.pres]=0.7;sp[S.pres]=ANM_POZ.presKos;}
    const MK=mac._markaj&&mac._markaj[p.team],o=MK&&MK.get(p);if(o&&o.oyunda&&!st[S.cekme]){const dx=o.x-p.x,dz=o.z-p.z,eT=ANM.a9&&ANM.a9.elTemas>0?ANM.a9.elTemas:0;
      /* A9 (elTemas): ağırlık uzaklıkla 1 m çevresinde elTemas m'lik geçişle (eskiden 1 m'de aç-kapa), el temasının yanı yuva sönükken seçilir (rakip arkadan geçince
         poz aynasına sıçrıyordu); 0: eski */
      if(eT>0){const w=anmYumus((1+eT/2-Math.sqrt(dx*dx+dz*dz))/eT);if(w>0){if(a.ctSag==null||a.sw[S.cekme]<0.03)a.ctSag=anmSagda(p,o.x,o.z);st[S.cekme]=0.35*w;sp[S.cekme]=a.ctSag?aynala(ANM_POZ.elTemas):ANM_POZ.elTemas;}}
      else if(dx*dx+dz*dz<1.0){st[S.cekme]=0.35;sp[S.cekme]=anmSagda(p,o.x,o.z)?aynala(ANM_POZ.elTemas):ANM_POZ.elTemas;}}}
  /* A4-3: yerden kalkan arkadaşına el uzatan (motor: kalkis eyleminin yardim alanı) — öne eğilir; düşene dönüş aktorGuncelle'de, kol IK'sı kare sonunda */
  if(p.tur==='oyuncu'){const q=anmYardimHarita().get(p);if(anmYardimUygun(p,q)){st[S.yardim]=1;sp[S.yardim]=ANM_POZ.yardim;a.yrQ=q;}else if(a.sw[S.yardim]<0.01)a.yrQ=null;}
  /* T6f (Ek G4): sıçrama katmanı — motorun p.zipla'sı: t < 0 hazırlık, 0…sure uçuş (koşarak kalkışta kalkış bacağı güçlü ayağın tersi), sonra
     0,22 sn iniş (diz bükülmesi; düşüşte yok); havada düello: 1,1 m içinde havadaki rakip varsa kol rakibe kalkık, gövde rakibe yatar */
  const z=p.zipla,zBaraj=!!(z&&p.duranRol&&p.duranRol.rol==='baraj');   /* T8e: barajın motor sıçraması baraj pozlarıyla (anmBaraj; kollar önde kalır) */
  if(z&&p.tur==='oyuncu'){if(a.zipE!==z){a.zipE=z;const sol=p.ayak!=='sol';a.zHazP=z.kos?(sol?aynala(ANM_POZ.zHazK):ANM_POZ.zHazK):ANM_POZ.zHazD;
      a.zUcP=z.kos?(sol?aynala(ANM_POZ.zUcK):ANM_POZ.zUcK):ANM_POZ.zUcD;}
    a.zipVar=true;a.inisT=-1;
    /* A6a (2026-10-17): uçuş pozu ANM.zipla.inis'ten sonra iner (bacaklar inişe uzanır; eskiden son %20'de) — inişte kalan bacak pozu yere basan ayağın
       IK'sını eziyordu (A6-0: inişin 0,12–0,22 sn'sinde temasların %85'i kayıyordu); inişte kalan pay aşağıda hemen kalkar */
    if(!zBaraj){if(z.t<0){st[S.zHaz]=1;sp[S.zHaz]=a.zHazP;}else{const f=z.t/(z.sure||0.55),fi=ANM.zipla?ANM.zipla.inis:0.8;st[S.zUc]=f<fi?1:Math.max(0,(1-f)/(1-fi));sp[S.zUc]=a.zUcP;}
    const R=mac.teams&&mac.teams[1-p.team];if(R)for(const o of R){if(!o.oyunda||!o.zipla)continue;const dx=o.x-p.x,dz=o.z-p.z;
      if(dx*dx+dz*dz<1.21){st[S.hvDuello]=1;sp[S.hvDuello]=anmSagda(p,o.x,o.z)?ANM_POZ.hvDuello:aynala(ANM_POZ.hvDuello);break;}}}}
  else if(a.zipVar){a.zipVar=false;a.zipE=null;a.inisT=e&&e.kilit?-1:0;if(ANM.zipla&&ANM.zipla.kes){a.sw[S.zUc]=0;a.swV[S.zUc]=0;}
    /* A6a: uçuşta adım döngüsünün koyduğu çapalar inişte geçersiz (kök o arada uçtu): ayaklar bastıkları yerde yeniden çivilenir, sapma sıfırlanır */
    if(ANM.zipla&&ANM.zipla.capa&&a.anc){a.anc[0]=a.anc[1]=0;if(a.D)a.D.fill(0);}}
  if(a.inisT>=0){a.inisT+=dt;if(a.inisT>0.22||(e&&e.kilit))a.inisT=-1;else{st[S.zIn]=anmZarf(a.inisT,0.22,0.03,0.15);sp[S.zIn]=ANM_POZ.zIn;}}
  /* A2a jest katmanı: p.jest {tur, t, sure, kol:'sol'|'sag', hedef:{x,z}} (yazan motor işi T7/T10); giriş 0,15 sn, çıkış 0,25 sn */
  const j=p.jest;if(j&&ANM_JEST[j.tur]){const P0=j.tur==='alkis'?POSE.alkis:ANM_POZ[ANM_JEST[j.tur]];st[S.jest]=anmZarf(j.t||0,j.sure||1.2,0.15,0.25);sp[S.jest]=j.kol==='sol'?aynala(P0):P0;}
  /* T5f (Ek G4): temas olaylarından tepkiler (ANM_TEMAS): forma çekme (taktik faul; çekenin kolu yiyene uzanır), gövdeyle çarpma (iki kol önde itiş),
     görülmeyen faulde yiyenin kollarını açıp hakeme dönmesi (0,5 sn sonra). Kilitli eylemde (düşüş, kayma) çizilmez */
  const tm=ANM_TEMAS.get(p);if(tm){const k=zaman-tm.t0;if(k>tm.sure+0.35)ANM_TEMAS.delete(p);else if(k>=0&&!(e&&e.kilit)){const w=anmZarf(k,tm.sure,0.12,0.25);
    if(tm.tur==='tepki'){st[S.tepki]=w;sp[S.tepki]=ANM_POZ.jestItiraz;}
    else{const h=tm.hedef,sag=h&&h.x!=null?anmSagda(p,h.x,h.z):true,P0=tm.tur==='itme'?ANM_POZ.itme:ANM_POZ.cekme;st[S.cekme]=w;sp[S.cekme]=sag?P0:aynala(P0);}}}
  /* T8e (Ek G5): kutuda yer kapma — duruşta kutudaki görevli (hücumcu ya da markajcı; motor p.duranRol) 0,9 m içindeki rakibe kolla yer tutar ya
     da iter (hafif ağırlık; kimliğe göre itme/tutma; eylemsiz ve dururken). Temas tepkisi (ANM_TEMAS) varsa o baskındır */
  if(!e&&ph==='durus'&&p.duranRol&&ANM_KUTU_ROL.has(p.duranRol.rol)&&!st[S.cekme]){const eT=ANM.a9&&ANM.a9.elTemas>0?ANM.a9.elTemas:0;
    /* A9 (elTemas): kutudaki itişmede ağırlık uzaklık (0,9 m çevresinde) ve hızla (1,2 m/sn çevresinde) yumuşak, yan yuva sönükken seçilir; 0: eski (aç-kapa) */
    if(eT>0){const o=anmYakinRakip(p,0.9+eT/2);if(o){const w=anmYumus((0.9+eT/2-Math.hypot(o.x-p.x,o.z-p.z))/eT)*anmYumus((1.3-(p.spd||0))/0.2);
      if(w>0){const it=h2((p.n|0)*3+1,(p.team|0)+5)<0.5,P0=it?ANM_POZ.itme:ANM_POZ.cekme;if(a.ctSag==null||a.sw[S.cekme]<0.03)a.ctSag=anmSagda(p,o.x,o.z);st[S.cekme]=0.4*w;sp[S.cekme]=a.ctSag?P0:aynala(P0);}}}
    else if((p.spd||0)<1.2){const o=anmYakinRakip(p,0.9);
    if(o){const it=h2((p.n|0)*3+1,(p.team|0)+5)<0.5,P0=it?ANM_POZ.itme:ANM_POZ.cekme;st[S.cekme]=0.4;sp[S.cekme]=anmSagda(p,o.x,o.z)?P0:aynala(P0);}}}
  /* top elde: kaleci tutuşu, duran topu taşıyan oyuncu */
  if(b.tasiyan===p&&ad!=='tac'){st[S.elde]=1;sp[S.elde]=p.rol==='GK'?POSE.tutus:POSE.tasi;}
  /* top toplayıcı (N10): yedek topu iki eliyle önünde tutar */
  else if(p.tur==='topcu'&&p.top&&ad!=='atis'){st[S.elde]=1;sp[S.elde]=POSE.tasi;
    /* A2b: boşta bekleyen top toplayıcı (kimliğine göre) topu kucağında çömelir; elindeki topun yüksekliği js/mac-sahnesi.js'e (ANM_TOPCU) */
    const K=a.kim||anmKimlik(a,p);a.bosT=(p.spd||0)<0.2&&!p.gorev?a.bosT+dt:0;st[S.p2]=a.bosT>2.5&&K.bekle>0.4?1:0;sp[S.p2]=ANM_POZ.comel;ANM_TOPCU.set(p,a.sw[S.p2]);}
  /* maç günü poz etiketleri */
  if(p.poz)for(let i=0;i<8;i++)if(p.poz===POZ_ETIKET[i]&&!(i===2&&a.gerdirAktif)){st[S.p0+i]=1;sp[S.p0+i]=i===2&&p.kind==='foto'?ANM_POZ.fotoCek:ANM_ETIKET_POZ[i];}   /* T10f: gerdiren sağlıkçı çömelmez */
  /* gol sevinci: oyuncuya ve gole göre çeşit, kendi zamanlaması; golcünün yanındakiler sarılır; golcü dizlerinin üstünde kayabilir */
  const c=mac.celeb;
  if(p.sevinc){if(!a.sevSon){a.sevSon=true;const n=(p.n!=null?p.n:p.no||0)|0,gol=mac.score?mac.score[0]+mac.score[1]:0,h=h2(n*7+(p.team|0),gol*13+5);
      a.sevC=anmSevincSec(p,h,!!(c&&c.scorer===p));   /* T10f: golcüde profilden */a.sevH=7+2*h2(n,3);a.sevDiz=!!(c&&c.scorer===p)&&h2(n+11,gol)<0.5;a.dizAktif=false;}
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
  sp[S.ucusI]=a.uIP||ANM_POZ.ucusItis;sp[S.ucusH]=a.uP;sp[S.ucusN]=a.uNP;
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
  /* T9b-e: kalecinin ayakta kurtarışında çizilen kalça motorun kalça yüksekliğinde (tutus.hy; alçak topa motor kalçayı indirir, elin erişimi
     buradan) — kalça iner, dizleri bacak IK'sı büker; tutuşa geçen eylemde (hy yok) son yükseklik 0,35 sn'de söner */
  if(p.rol==='GK'&&p.tur==='oyuncu'&&a.kh){const kh=a.kh;
    if(ad==='tutus'&&e.hy!=null){kh.y=e.hy;kh.t=0;}else if(kh.t>=0){kh.t+=dt;if(kh.t>0.35)kh.t=-1;}
    if(kh.t>=0){const sy=a.m.root.scale.y||1,w=kh.t<0.1?1:Math.max(0,1-(kh.t-0.1)/0.25),dyH=kh.y/sy-0.95;if(dyH<P.dy)P.dy+=(dyH-P.dy)*w;}}
  /* A2b vuruş: takipte ayak yükseldikçe gövde geriye; sert vuruşta iniş sıçraması */
  const vk=a.vk;if(vk&&vk.evre>0){P.lean+=vk.lean;if(vk.yEk>a.yEk)a.yEk=vk.yEk;}
  /* T15d: duraklı penaltı koşusunda tereddüt pozu (vurus.kosu 'durak'; ~0,1 sn'de gelir, ~0,15 sn'de söner) */
  {const dk=ad==='vurus'&&e.kosu==='durak'?1:0,w=yumusak(a,'durak',dk,dk?10:7,dt);if(w>0.01)anmKar(a,ANM_POZ.kosuDurak,w);}
  /* T6f: kafada gövde yaydan öne kırılır — alında tam, yanda 0,6; tepeyle sıyırmada ve yüze gelen topta kırılma yok; ayakta parmak ucuna kalkar */
  const wk=sw[S.kafa];if(wk>0.01&&ad==='kafa'){const f=clamp((e.t+0.04)/0.16,0,1),sm=f*f*(3-2*f),y=e.yuzey,k=e.bos?0.5:y==='tepe'||y==='yuz'?0:y==='yan'?0.6:1;
    P.hx+=wk*k*(0.8*sm-0.1);P.gx+=wk*k*(0.55*sm-0.3);if(!p.zipla)P.dy+=0.12*wk*(1-sm);}
  /* hazırlık (anmKafaUzan, kf.on): top başa gelirken sırt yay gibi gerilir, baş geride ve sabit; kırılma temasta (yukarıda) */
  if(a.kf&&a.kf.on>0.01){const o=a.kf.on;P.gx-=0.3*o;P.hx-=0.12*o;P.lean-=0.06*o;}   /* temasta söner (0,05 sn), kırılma üstüne biner */
  /* T6f (1i): başın topun yoluna uzanması — kaymadan kalanı öne ve yana eğilerek (kf.egim; yön gövdeye göre) */
  const kf=a.kf;if(kf&&kf.egim>0.004&&p.yon!=null){const r=kf.kd-p.yon,fw=Math.cos(r),lt=Math.sin(r);P.lean+=kf.egim*Math.max(0,fw);P.gz+=kf.egim*lt*0.8;P.hz+=kf.egim*lt*0.2;P.bz+=kf.egim*lt*0.3;}
  /* T6f: müdahale bacağının topa IK'sı ("A: temas" ≤ 0,15 m; T5f'nin sabit pozu topa uzanmıyordu) — uzanan bacak temasa kadar topun yanına
     (taban ortası topun merkezine 0,12 m geride, merkezin 0,06 m altında) uzanır, temasta kalır, eylemin sonunda poza döner; o bacağın pozu IK'ya bırakılır */
  /* temas planlanandan önce olursa (top ayağa erken geldi; 'mudahaleSonuc' olayı) bacak o karede topa varır, sonra temasın yerinde kalır */
  if(ad==='mudahale'&&!a.kucuk&&a.T){const s=e.sure||0.5,t=e.t,tm=e.temas||0.16,u=clamp(t/tm,0,1),an=ANM_MUD.has(p);if(an){ANM_MUD.delete(p);a.mAn=e;
      /* T9b-e: temas karesinde top gövdenin öbür yanına 0,15 m'den çok geçtiyse uzanan bacak o yanın bacağıdır (bacak eylemin başında topun
         yanından seçiliyordu; çapraz bacak topa erişemiyor, IK onu yatay kaldırıyordu: ayak 0,76 m yükseklikte) */
      const tb=anmVkTop(a.al),G=anmVkGovde(a,tb[0],tb[2],a.m.root.scale.x||1);if(a.mI===1&&G[0]<-0.15||a.mI===0&&G[0]>0.15){a.mI=1-a.mI;a.mP=aynala(a.mP);}}
    const tt=a.mAn===e,g=tt||t>=tm?((e.bacak||t<Math.max(tm,a.mAnT||0)+0.14)?1:Math.max(0,1-(t-tm-0.14)/Math.max(0.05,s-tm-0.14))):u*u*(3-2*u);
    if(an)a.mAnT=t;
    if(g>0.01){const i=a.mI,B=ANM_IK[i],T=a.T,R=a.m.root,sx=R.scale.x||1,sy=R.scale.y||1;
      if(an||(!tt&&t<=tm+0.02)||!a.mT){const tb=anmVkTop(a.al),dx=tb[0]-a.x,dz=tb[2]-a.z,dd=Math.sqrt(dx*dx+dz*dz)||1,L=anmVkGovde(a,tb[0]-dx/dd*0.12,tb[2]-dz/dd*0.12,sx);
        if(!a.mT)a.mT=new Float32Array(3);a.mT[0]=L[0];a.mT[1]=Math.max(0.03,(tb[1]+0.05-R.position.y)/sy);a.mT[2]=L[1];}
      for(let k=0;k<3;k++)T[i*3+k]+=(a.mT[k]-T[i*3+k])*g;
      const C=a.C;P[B.l]*=1-g;P[B.k]*=1-g;P[B.z]*=1-g;C[B.l]=C[B.l]*(1-g)+g;C[B.k]=C[B.k]*(1-g)+g;C[B.z]=C[B.z]*(1-g)+g;}}
  /* A6c (2026-10-17): şut ve orta bloğunda bacak — motorun hamlesi sürerken (p._ortaBlokT son 0,06 sn: sutHamleYap ya da presYap'ın orta hamlesi) topa
     yakın bacak topa uzanır (taban topun merkezine 0,12 m geride; yatayda kökten en çok ANM.blok.erisim), blok temasında (eylem 'blok', e.bx/bz/by) temas
     noktasına; top beden yüksekliğinin altındayken (< 0,8 m). Temastan ANM.blok.tut sn sonra poza döner; o bacağın pozu IK'ya bırakılır (müdahale
     kalıbı). A6-0: blok temasında çizilen ayak topa 0,9 m uzaktaydı (poz bacakları toplayan sıçramaydı) */
  {const BK=ANM.blok;if(BK&&BK.acik&&!a.kucuk&&a.T&&p.tur==='oyuncu'&&p.rol!=='GK'){const b=mac.ball;let hx=null,hz=0,hyB=0,hed=0;
    const be=ad==='blok'&&e.bx!=null&&e.by-(p.yuk||0)<0.8?e:null;
    /* temas: çizilen top temas karesinde bir önceki yerinde tutulur (anmTopTut) — hedef o yer; sonraki karelerde (top sekip gider) aynı noktada kalır */
    if(be){if(a.blkE!==be){const tb=anmVkTop(a.al);a.blkP=[tb[0],tb[1],tb[2]];}hx=a.blkP[0];hz=a.blkP[2];hyB=a.blkP[1];hed=e.t<BK.tut?1:0;}
    else if(!e&&mac.t!=null&&mac.t-(p._ortaBlokT!=null?p._ortaBlokT:-9)<0.06&&b.y<0.8){const tb=anmVkTop(a.al);hx=tb[0];hz=tb[2];hyB=tb[1];hed=1;}
    if(dt>0)a.blkW+=(hed-a.blkW)*Math.min(1,dt*(hed>a.blkW?BK.hiz:6));
    if(hx!==null&&a.blkW>0.01){const R=a.m.root,sx=R.scale.x||1,sy=R.scale.y||1,dx=hx-a.x,dz=hz-a.z,dd=Math.sqrt(dx*dx+dz*dz)||1,
        L=anmVkGovde(a,hx-dx/dd*0.12,hz-dz/dd*0.12,sx),lx=L[0],lz=L[1],lr=Math.hypot(lx,lz),mx=BK.erisim/sx,k=lr>mx?mx/lr:1;
      /* temasın ilk karesinde bacak topun yanından yeniden seçilir ve tam ağırlıktadır (hamlenin başında top öndeydi; çapraz bacak topa erişemez) */
      if(be&&a.blkE!==be){a.blkE=be;if(Math.abs(lx)>0.05)a.blkI=lx<0?0:1;a.blkW=1;}
      if(a.blkI<0||a.blkW<0.05)a.blkI=lx<0?0:1;
      /* yüksek topta (taban > ANM.blok.yuksek m) ayak topun altına basar: top bacağa (incik, diz) değer — ayak topa kaldırılmaz */
      const yk=hyB>(BK.yuksek||9);
      if(!a.blkT)a.blkT=new Float32Array(3);a.blkT[0]=lx*k;a.blkT[1]=yk?(BK.yukAyak?Math.max(0.03,(hyB-BK.yukAyak-R.position.y)/sy):0.03):Math.max(0.03,(hyB+0.05-R.position.y)/sy);   /* A8: bel hizasında diz ve incik topa (yukAyak) */a.blkT[2]=lz*k;}
    if(a.blkW>0.01&&a.blkT){const g=a.blkW,i=a.blkI<0?0:a.blkI,B=ANM_IK[i],T=a.T,C=a.C;for(let q=0;q<3;q++)T[i*3+q]+=(a.blkT[q]-T[i*3+q])*g;
      P[B.l]*=1-g;P[B.k]*=1-g;P[B.z]*=1-g;C[B.l]=C[B.l]*(1-g)+g;C[B.k]=C[B.k]*(1-g)+g;C[B.z]=C[B.z]*(1-g)+g;}
    else if(a.blkW<=0.01)a.blkI=-1;}}
  const ws=sw[S.sendele];if(ws>0.01){const s=a.sdS*ws;P.lean+=0.45*a.sdZ*s;P.gx+=0.15*a.sdZ*s;P.gz-=0.5*a.sdX*s;P.hz-=0.15*a.sdX*s;
    if(!a.kucuk){const w=Math.sin(zaman*15+a.faz0);P.aL+=0.5*w*ws;P.aR-=0.5*w*ws;}}
  const wv=sw[S.sevinc];if(wv>0.01&&!a.kucuk){const w=Math.sin(zaman*a.sevH+a.faz0),c=a.sevC;
    if(c===0){P.aL+=0.3*w*wv;P.aR-=0.3*w*wv;if(p.spd<1.2)a.yEk=Math.max(a.yEk,Math.abs(w)*0.14*wv);}
    else if(c===1){const v=Math.sin(zaman*1.8+a.faz0);P.hz+=v*0.32*wv;P.gz+=v*0.15*wv;}
    else if(c===2){P.aL+=0.45*w*wv;P.eL+=0.35*w*wv;}
    else if(c===3){P.aLz-=0.1*w*wv;P.aRz+=0.1*w*wv;}
    else if(c===6){P.hz+=0.12*w*wv;P.by+=0.25*Math.sin(zaman*1.3+a.faz0)*wv;}   /* T10f: el kulakta — tribüne döner */
    else if(c===4||c===5){P.hx+=0.08*Math.abs(w)*wv;}}
  /* T10f (Ek G4): yerdeki sakat kıvranır (gövde yana, bacak; tedavi ve sedyede sakinleşir), krampta havadaki bacak titrer; sedyedeki sakat sedye
     yüksekliğinde (kök 0,72 m; sedye taşınmaya başlayınca 0,4 sn'de kalkar) */
  const wsk=sw[S.sakat];if(wsk>0.01&&!a.kucuk){const A=mac.sakatlikAkis,sakin=A&&A.p===p&&(A.evre==='tedavi'||A.evre==='sedye')?0.3:1;
    P.gz+=0.1*Math.sin(zaman*2.4+a.faz0)*wsk*sakin;P.lean+=0.06*Math.sin(zaman*1.7+a.faz0)*wsk*sakin;
    if(p.sakat&&p.sakat.tur==='kramp'){const k=a.skSol?'kR':'kL';P[k]+=0.06*Math.sin(zaman*11+a.faz0)*wsk;}}
  const sdW=yumusak(a,'sedye',mac.sedye&&mac.sedye.p===p?1:0,6,dt);if(sdW>0.01)a.yEk=Math.max(a.yEk,0.72*sdW);
  /* omuz mücadelesini kaybeden ikinci yarıda rakipten uzağa itilir */
  const wo=sw[S.omuz];if(wo>0.01&&ad==='omuz'&&e.kazandi===false){const f=clamp(e.t/(e.sure||0.5)*2-1,0,1)*wo;P.gz-=0.55*a.oSag*f;P.hz-=0.2*a.oSag*f;P.aRz+=0.5*f;P.aLz-=0.5*f;}
  const wh=sw[S.sarilma];if(wh>0.01)a.yEk=Math.max(a.yEk,Math.abs(Math.sin(zaman*6+a.faz0*0.3))*0.1*wh);
  /* jest: işaret ve kol kaldırmada gövde hedefe döner; alkışta eller vurur */
  /* A3c (2026-10-13): jest ve temas katmanında hedef tam arkaya geçerken dönüş payı ±0,9'dan sıçramasın — arkada (|r| > 2,2) sıfıra iner (eskiden
     hedef arkadan geçince baş ve gövde bir karede ~100° dönüyordu: baş hızı en çok ~6000°/sn) */
  const wj=sw[S.jest],j=p.jest;if(wj>0.01&&j){if(j.hedef&&p.yon!=null){const r=-anmAci(Math.atan2(j.hedef.z-p.z,j.hedef.x-p.x)-p.yon),rk=clamp(r,-0.9,0.9)*Math.min(1,(Math.PI-Math.abs(r))/0.94);P.gy+=rk*0.6*wj;P.by+=rk*0.3*wj;}
    if(j.tur==='alkis'){const v=Math.sin(zaman*15+a.faz0)*0.22*wj;P.aLz+=v;P.aRz-=v;}}
  const wi=sw[S.itiraz];if(wi>0.01){const v=Math.sin(zaman*6+a.faz0)*0.15*wi;P.aLz-=v;P.aRz+=v;}
  /* T5f: çeken/iten ve itiraz eden gövdesini hedefe (yiyen ya da hakem) döndürür */
  const wc=sw[S.cekme]+sw[S.tepki];if(wc>0.01){const tmE=ANM_TEMAS.get(p);if(tmE&&tmE.hedef&&tmE.hedef.x!=null&&p.yon!=null){const r=-anmAci(Math.atan2(tmE.hedef.z-p.z,tmE.hedef.x-p.x)-p.yon),rk=clamp(r,-0.9,0.9)*Math.min(1,(Math.PI-Math.abs(r))/0.94);P.gy+=rk*0.5*wc;P.by+=rk*0.3*wc;}
    if(sw[S.tepki]>0.01){const v=Math.sin(zaman*5+a.faz0)*0.12*sw[S.tepki];P.aLz-=v;P.aRz+=v;}}
  /* boşta (T1): ağırlığı yavaşça bir bacaktan öbürüne verir, başı hafif oynar */
  /* boşta: ağırlığı yavaşça bir bacaktan öbürüne verir (kimliğin temposuyla), başı hafif oynar; nefes (A2a: göğüs inip kalkar, sert koşudan
     sonra hızlı ve derin; elleri dizlerindeyken gövde soluklanır) */
  const wb=sw[S.bosta],wd=sw[S.dizler];if((wb>0.01||wd>0.01)&&!a.kucuk){const K=a.kim||anmKimlik(a,p),v=Math.sin(zaman*0.55*K.nefes+a.faz0),u=Math.sin(zaman*0.37+a.faz0*1.7);
    P.gz+=0.07*v*wb;P.hz-=0.05*v*wb;P.hy+=0.12*u*wb;
    const ef=Math.min(1,a.efor),nf=Math.sin(zaman*6.2832*0.27*K.nefes*(1+0.9*ef)+K.faz)*(0.012+0.02*ef+0.02*wd)*Math.max(wb,wd);P.gx+=nf;P.aLz-=nf*0.6;P.aRz+=nf*0.6;}
  const wa=sw[S.p0+4];if(wa>0.01){const v=Math.sin(zaman*15+a.faz0)*0.22*wa;P.aLz+=v;P.aRz-=v;}
  const we=sw[S.p0];if(we>0.01){const f=0.5+0.5*Math.sin(zaman*0.9+a.faz0);anmKar(a,ANM_POZ.esneme1,we*f);anmKar(a,POSE.esneme2,we*(1-f));}
  /* A9 (basSon): boyun sınırı katmanlardan sonra — jest, tepki ve sevinç başı sınırdaki boyunun üstüne döndürüyordu (|baş − gövde| en çok 91°) */
  {const A9=ANM.a9;if(A9&&A9.basSon>0)P.by=clamp(P.by,-A9.basSon,A9.basSon);}
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
    /* A9-vurus2 (salIK; anmYuruyus): salınan bacağın uzanması veri dizinin uzanmasına iner (C¹ geçişli en küçük, ±0,015); hedefi başka katman değiştirdiyse söner */
    let ikG=0;if(a.ikW&&(a.ikW[i]>0.001||a.ikA[i]>0.001)){const q=a.ikT,j=i*3;ikG=clamp(1-(Math.abs(T[j]-q[j])+Math.abs(T[j+1]-q[j+1])+Math.abs(T[j+2]-q[j+2]))/0.05,0,1);}
    {const w=a.ikW?a.ikW[i]*ikG:0;if(w>0.001&&d>1e-6){const e=0.015,x=d-a.ikS[i],sp=x<=-e?0:x>=e?x:(x+e)*(x+e)/(4*e);if(sp>0){const k=(d-w*sp)/d;X*=k;Y*=k;Z*=k;d*=k;}}}
    /* yumuşak IK (A2a): bacak tam gerilmeye yaklaşınca uzanma üstel sıkışır; diz düzlükte kilitlenip sıçramaz */
    if(d>ds){const dn=ds+(dm-ds)*(1-Math.exp(-(d-ds)/(dm-ds))),k=dn/d;X*=k;Y*=k;Z*=k;d=dn;}if(d<0.3)d=0.3;
    const ck=clamp((d*d-ANM_L1*ANM_L1-ANM_L2*ANM_L2)/(2*ANM_L1*ANM_L2),-1,1),kk=Math.acos(ck),aa=ANM_L1+ANM_L2*ck,bb=-ANM_L2*Math.sin(kk);
    /* A9 (capaIK): burulmalı bacakta (Euler XYZ: Rx(uyluk)·Ry(burulma)·Rz(yana açma)) taban vektörü (0, −aa, bb) burulmayla döner — yana açma ve uyluk ona göre;
       yana açmayla erişilemeyen burulma (çok bükük dizde büyük burulma) yarıya iner (en çok 4 kez) ve poza yazılır */
    /* A9 (ikYan): uyluğun yana açılması, yan erişimin ikYan payından sonra yumuşakça 0,97'de doyar — diz çok bükükken ayak yanda ve gövdeye yakınsa
       (yana dönen koşuda salınan ayak) asin ±90°'ye dayanıp uyluk karede 20–40° atlıyordu; yalnız burulmasız bacakta (capaIK burulmalı bacakta tam IK ister) */
    let tw=a.capaB&&a.capaB[i]?P[B.l+'y']||0:0;if(tw){const t0=tw;for(let n=0;n<4&&Math.abs(X-bb*Math.sin(tw))>aa*Math.cos(tw);n++)tw*=0.5;if(tw!==t0)P[B.l+'y']=tw;}
    const ct=Math.cos(tw),stw=Math.sin(tw);
    /* A9-vurus2 (salYan): salınımda (a.ikA) yana açma √(aa² + w·salYan²)'den — diz ~120° bükükken aa ~0,2: kalçanın dönüşüyle (çapraz koşu) hedefin yanal payı karede
       değişirken uyluk karede 20–40° yana açılıp kapanıyordu; ayak salınımın ortasında yana daha az gider, düz bacakta fark ~%4 */
    const aY=!tw&&a.ikA&&a.ikA[i]>0.001?Math.sqrt(aa*aa+a.ikA[i]*ikG*(ANM.a9.salYan||0)*(ANM.a9.salYan||0)):aa;
    let rY=tw?(X-bb*stw)/(aa*ct):X/aY;const iY=ANM.a9&&ANM.a9.ikYan;if(iY>0&&!tw){const q=Math.min(9,Math.abs(rY));if(q>iY){const e=q-iY;rY=(rY<0?-1:1)*(iY+e/(1+e/(0.97-iY)));}}
    const be=Math.asin(clamp(rY,-1,1));let al=Math.atan2(Z,Y)-(tw?Math.atan2(-aa*Math.sin(be)*stw+bb*ct,-aa*Math.cos(be)):Math.atan2(bb,-aa*Math.cos(be)));if(al>Math.PI)al-=6.283185307179586;else if(al<-Math.PI)al+=6.283185307179586;
    P[B.l]+=cL*al;P[B.z]+=cZ*be;P[B.k]+=cK*(kk+ANM_D0);}
}

/* ---- kare başına poz: başla (yürüyüş + yuvalar + ekler), arada ek pozlar (kenar, kulübe), bitir (IK) ---- */
function anmPozBasla(a,p,spd,dt,M){
  const P=a.P,C=a.C;for(let i=0;i<ANM_KANAL.length;i++)P[ANM_KANAL[i]]=0;C.lL=C.kL=C.lR=C.kR=C.lLy=C.lRy=C.lLz=C.lRz=1;
  a.st.fill(0);a.yEk=0;const sx=M.root.scale.x||1,sy=M.root.scale.y||1;
  a.kucuk=anmPiksel(a,sy)<ANM.kucukPiksel;
  if(p&&p.tur==='oyuncu'&&a.ck)anmCalimDurum(a,p,dt);   /* T4g: tavırdan önce (yürüyüş ayarları ve salınım yolu bu karenin durumundan) */
  anmTavir(a,p,dt);if(p&&p.tur==='oyuncu'){anmVurusDurum(a,p,dt,a.al,sx);anmKafaUzan(a,p,dt,sy);}anmYuruyus(a,p,spd,dt,sx,sy);
  if(p)anmEylemler(a,p,dt);
  anmYuvalar(a,dt);
  if(p)anmEkler(a,p,dt);
  if(p&&p.tur==='oyuncu')anmCapaIK(a,dt);   /* A9 (capaIK) */
}
function anmPozBitir(a){const C=a.C;if(!a.legC){a.legC=new Float32Array(2);a.capaB=new Uint8Array(2);a.capaR=new Float32Array(2);a.capaY=new Float32Array(2);}   /* A9: capaIK'nın durumu da burada (bütün aktörlerde aynı biçim) */
  a.legC[0]=Math.min(C.lL,C.kL);a.legC[1]=Math.min(C.lR,C.kR);anmBacakIK(a);if(a.vk)anmVkHiz(a);}   /* A8: capaCiz bu karenin bacak güvenini okur; A9-vurus2: IK'dan sonra */
/* A9-vurus2 (borç 38; anmPozBitir'in sonunda, IK'dan sonra): vuruş penceresinde (hazırlık, geri ve aşağı salınım, iniş, çıkış) yerde olmayan bacağın uyluk, diz ve
   yana açma açıları kare başına insan eklem hızının tavanında kalır — diz ANM.a9.vkHiz rad/sn (3 m/sn'ye dek; 8 m/sn'de ×1,5), uyluk bunun 0,8'i, yana açma 0,6'sı;
   aşağı salınımda vuran bacakta ×2,5 (vuruşun kendisi: diz ~1500–2000°/sn). A9a ölçümü (tohum 3 ve 5): evre sınırı dışı sıçramaların %50–86'sı hazırlıkta
   adım döngüsünün salınan bacağında (vuruş katmanının ağırlığı kw orada 0), kalanı geri salınımda katmanın kendi yolunda: hedef ayak bacağın erişiminin
   dışından (hızlanmanın öne eğimi, gövdenin topa dönüşü 6–7 rad/sn) birkaç karede içeri giriyor, diz düz bacaktan karede 25–30° bükülüyordu; geri salınımda
   önde kalan ayak 0,2 sn'de geriye ve yukarı, destek ayağı yüksekten öne (uyluk karede ~26°). Gerçekte koşuda diz ~800–1000°/sn, kalça ~500–800°/sn'yi geçmez.
   Tavan yalnız açının hedefe yaklaşma hızını sınırlar (hedef yavaşlayınca açı yetişir); yerdeki bacak (adım döngüsünün çapası, vuruşta destek ayağı), temas
   ve takip (evre 3) ile çıkışta başka eylem sınırsız. Önceki karenin açıları her karede saklanır (vk.gP; aktör kare atladıysa — tünelde görünmez — tavan o kare yok) */
function anmVkHiz(a){const vk=a.vk,P=a.P,G=vk.gP,hz=ANM.a9&&ANM.a9.vkHiz||0,dt=vk.dtK,p=a.kaynak,z=typeof zaman==='number'?zaman:0;
  if(hz>0&&dt>0&&vk.gN&&Math.abs(z-dt-vk.gZ)<1e-6&&vk.evre>=1&&!(vk.evre===5&&p&&p.eylem)){const v=Math.sqrt(a.wvx*a.wvx+a.wvz*a.wvz),m=hz*dt*(1+0.1*clamp(v-3,0,5));
    for(let i=0;i<2;i++){if(vk.evre>=2&&vk.evre<=4?vk.yer[i]:!a.anc||a.anc[i])continue;const vur=i===vk.ayak;if(vur&&vk.evre===3)continue;
      const k=vur&&vk.evre===2&&vk.asagi?2.5*m:m,B=ANM_IK[i],j=i*3;
      P[B.l]=G[j]+clamp(P[B.l]-G[j],-0.8*k,0.8*k);P[B.k]=G[j+1]+clamp(P[B.k]-G[j+1],-k,k);P[B.z]=G[j+2]+clamp(P[B.z]-G[j+2],-0.6*k,0.6*k);}}
  for(let i=0;i<2;i++){const B=ANM_IK[i],j=i*3;G[j]=P[B.l];G[j+1]=P[B.k];G[j+2]=P[B.z];}vk.gN=1;vk.gZ=z;}
/* A9 (capaIK; anmPozBasla'nın sonunda): adım döngüsünde çapadaki (a.anc) bacağı yalnız alış ve dokunuş yuvaları tutuyorsa uyluk, diz ve yana açma IK'ya kalır
   (pozun payı silinir; bırakış a.capaR = 1); burulma (lLy) pozdan kalır ve IK'ya katılır (a.capaB) — ayak çapada kalır, burulma tabanı yerinde döndürür (pivot).
   Bırakış başlarken çapa ayağın önceki karede çizildiği yere alınır; poz ayağı havada tutuyorduysa hedef o yükseklikten capaIK 1/sn hızla yere iner (a.capaY;
   eskiden IK ayağı karede yere çekiyor, diz 20°'den çok sıçrıyordu). Başka yuva da tutuyorsa, vuruş katmanında ya da ayak kalkınca bırakış aynı hızla söner */
const ANM_CAPA_YUVA=new Uint8Array(ANM_SLOT.length);for(const s of['kontrol','kontrol2','kontrolB','kontrol2B','dokun'])ANM_CAPA_YUVA[ANM_S[s]]=1;
function anmCapaIK(a,dt){if(!a.legC)return;const B9=a.capaB,R=a.capaR,Y9=a.capaY,hz=ANM.a9?ANM.a9.capaIK:0;B9[0]=B9[1]=0;
  if(!hz||!a.anc||!a.m){R[0]=R[1]=Y9[0]=Y9[1]=0;return;}const P=a.P,C=a.C,T=a.T,W=a.W,sw=a.sw,sp=a.sp,dus=dt>0?Math.exp(-hz*dt):1,vkw=a.vk&&a.vk.kw>0.001;
  for(let i=0;i<2;i++){const B=ANM_IK[i],j=i*3,k2=i*2;if(C[B.l]>0.999&&C[B.k]>0.999&&C[B.z]>0.999){R[i]=Y9[i]=0;continue;}
    let ok=!!a.anc[i]&&!vkw;for(let q=0;q<sw.length&&ok;q++){const pq=sp[q];if(sw[q]>0.001&&pq&&!ANM_CAPA_YUVA[q]&&(B.l in pq||B.k in pq||B.z in pq))ok=false;}
    const r0=R[i];R[i]=ok?1:R[i]*dus;const r=R[i];if(r<0.001){R[i]=Y9[i]=0;continue;}
    if(ok){const sx=a.m.root.scale.x||1,sy=a.m.root.scale.y||1;
      if(r0<0.999){const kb=i?a.m.kR:a.m.kL;ANM_KV.set(0,-0.5,0.05).applyMatrix4(kb.matrixWorld);W[k2]=ANM_KV.x;W[k2+1]=ANM_KV.z;Y9[i]=Math.max(0,ANM_KV.y/sy-T[j+1]);}
      const dx=W[k2]-a.x,dz=W[k2+1]-a.z,cY=Math.cos(a.yaw),sY=Math.sin(a.yaw);T[j]=(dx*cY-dz*sY)/sx;T[j+2]=(dx*sY+dz*cY)/sx;}
    if(Y9[i]>0){T[j+1]+=Y9[i];Y9[i]*=dus;if(Y9[i]<0.002)Y9[i]=0;}
    const u=1-r;P[B.l]*=u;P[B.k]*=u;P[B.z]*=u;C[B.l]=1-(1-C[B.l])*u;C[B.k]=1-(1-C[B.k])*u;C[B.z]=1-(1-C[B.z])*u;B9[i]=1;}}
function uygula(a,J){for(const k of EKLEM)a.J[k]=J[k]||0;pose(a.m,a.J);}

/* ---- 4. kök: düşüş/yatış/kalkış ekseni ve açısı, kaleci uçuşunun yayı, sıçrama ve sevinç zıplaması ---- */
const ANM_Y=new THREE.Vector3(0,1,0),ANM_V=new THREE.Vector3(),ANM_Q1=new THREE.Quaternion(),ANM_Q2=new THREE.Quaternion();
function anmKok(a,p,dt,M){
  const e=p.eylem,ad=e?e.ad:'',D=ANM.dusus;let th=0,ps=0,hiz=10,ekY=0;
  if(ad==='dusus'){const f=clamp(e.t/(e.sure||0.45),0,1);th=D.aci*f*f;ps=a.lps0*f*f;hiz=40;}
  else if(ad==='yerde'){th=D.aci;ps=a.lps0+(a.lieTur!=='yuz'?Math.sin(zaman*3+a.faz0)*0.08:0);hiz=10;}
  /* T5f: uzun kalkışta (1,6 sn; dizlerin üstünden) gövde sürenin yarısında dikilir, kalanı diz üstünden ayağa */
  else if(ad==='kalkis'){const s=e.sure||0.6,f=clamp(e.t/s,0,1),g=clamp((f-0.08)/(s>=1.4?0.5:0.85),0,1);th=a.kTh0*(1-g*g*(3-2*g));ps=a.kPs0*Math.max(0,1-f*2);hiz=40;}
  else if(ad==='kayma'){th=0.42*Math.min(1,e.t/0.1);hiz=35;}   /* T6f: 0,14 → 0,1 sn, 25 → 35 (yukarıdaki kayma yuvasıyla) */
  else if(ad==='ucus'){const hi=clamp((a.uY-0.4)/1.6,0,1),thA=1.35-0.55*hi,g=a.uG;hiz=40;
    /* T9b-e çökme dalışı: itişte gövde yakın yana düşmeye başlar, havada hemen yatar, yay yok */
    if(a.uFaz==='itis')th=(a.uCok?0.45:0.22)*g;
    /* alçak topa gövde hemen yatar (yavaşlayan eğri), yüksek topa önce uzanır */
    else if(a.uFaz==='havada'){const sm=g*g*(3-2*g),c=1-(1-g)*(1-g)*(1-g);
      if(a.uCok)th=0.45+(1.38-0.45)*c;else{th=0.22+(thA-0.22)*Math.min(1,(c+(sm*1.6-c)*hi));ekY=(0.2+0.4*hi)*Math.sin(Math.PI*g);}}
    else th=thA+(1.42-thA)*g*g*(3-2*g);}
  else if(ad==='kapan'){th=e.tur==='yildiz'||e.tur==='kblok'?0:0.3*a.sw[ANM_S.kapan];hiz=20;}
  /* T14e (Ek G4): tam plonjon kafa — temas karesinde başı topa getiren açı (pjTh0) anında, 0,15 sn'de yatay (yüzüstü), kök topa doğru kayar
     ve 0,3 sn'de motorun yerine döner; ardından yerde */
  else if(ad==='kafa'&&e.plonjon){const f=clamp(e.t/0.15,0,1),g=clamp(1-e.t/0.3,0,1);th=a.pjTh0+(D.aci-a.pjTh0)*f*(2-f);hiz=e.t<0.02?1e3:40;
    a.x+=Math.cos(a.pjKd)*a.pjOfs*g;a.z+=Math.sin(a.pjKd)*a.pjOfs*g;}
  if(dt>0){const k=Math.min(1,dt*hiz);a.lth+=(th-a.lth)*k;a.lps+=(ps-a.lps)*k;}
  /* yatarken gövde kalınlığı kadar yukarı */
  const yat=clamp((1-Math.cos(a.lth))/(1-Math.cos(D.aci)),0,1),yy=(a.lieTur==='yuz'||a.lieTur==='sirt'?D.yuzY:D.yanY)*yat;
  const R=M.root;R.position.set(a.x,(p.yuk||0)+ekY+yy+a.yEk,a.z);
  if(a.lth<1e-3&&Math.abs(a.lps)<1e-3)R.rotation.set(0,a.yaw,0);
  else{ANM_V.set(a.lkx,0,a.lkz).normalize();ANM_Q1.setFromAxisAngle(ANM_V,a.lth);ANM_Q2.setFromAxisAngle(ANM_Y,a.lps);ANM_Q1.multiply(ANM_Q2);
    R.quaternion.setFromAxisAngle(ANM_Y,a.yaw).multiply(ANM_Q1);}
  /* T9b-e (Ek G6): kalecinin dalışında ve kalkışında çizilen kalça motorun kalçasındadır — motorun beden modelinde kalecinin yeri (x, z) kalçadır,
     yüksekliği ucus.hy (kurtarışın el, gövde ve bacak kapsülleri buradan); çizim kökü ayaklardan döndürdüğü için yatan gövdenin kalçası ~0,9 m
     dalış yönüne kayıyor, eller topun ötesinde kalıyordu. Kök, çizilen kalça motorun kalçasına gelecek kadar kayar: uçuşun ilk %30'unda girer,
     inişte tam, kalkışta yatış açısıyla söner (kalça kökün üstüne gelince fark kalmaz); itişte ayaklar yerde kalır */
  if(p.rol==='GK'&&!a.kucuk&&(ad==='ucus'&&a.uFaz!=='itis'||ad==='kalkis'&&e.kaleci)){
    const w=ad==='ucus'&&a.uFaz==='havada'?clamp(a.uG/0.3,0,1):1;
    R.updateMatrixWorld(true);M.hip.getWorldPosition(ANM_KV);
    R.position.x+=(a.x-ANM_KV.x)*w;R.position.z+=(a.z-ANM_KV.z)*w;
    if(ad==='ucus'&&e.hy!=null)R.position.y=Math.max(0,R.position.y+(e.hy-ANM_KV.y)*w);}
  /* T6f: kafanın temas karesinde (eylemin ilk karesi) çizilen baş topa değer — başın dünyadaki yeri okunur, kök başı topun merkezinin 0,12 m
     önüne getirecek kadar (yatayda en çok 0,4 m) kayar ve topun hizasına en çok 0,15 m kalkar (motor topun yüksekliğini temasta merkez sayar, çizim
     topu yarıçap kadar yukarıda gösterir; koşan oyuncunun öne yatık gövdesi başı kökün önüne taşır); sonra 0,15 sn'de söner */
  if(ad==='kafa'&&!e.bos&&e.t<=(dt||0.017)*1.01&&p.tur==='oyuncu'&&!a.kucuk){R.updateMatrixWorld(true);M.head.getWorldPosition(ANM_KV);const tb=anmVkTop(a.al);
    const dx=tb[0]-ANM_KV.x,dz=tb[2]-ANM_KV.z,dh=Math.sqrt(dx*dx+dz*dz),k=dh>0.12?Math.min(dh-0.12,0.4)/dh:0;
    a.kfOx=dx*k;a.kfOz=dz*k;a.kfOy=clamp(tb[1]+0.11-ANM_KV.y,0,0.15);}
  if(a.kfOx||a.kfOz||a.kfOy){R.position.x+=a.kfOx;R.position.z+=a.kfOz;R.position.y+=a.kfOy;const s=dt>0?Math.max(0,1-dt/0.15):1;a.kfOx*=s;a.kfOz*=s;a.kfOy*=s;
    if(Math.abs(a.kfOx)+Math.abs(a.kfOz)+a.kfOy<0.002){a.kfOx=0;a.kfOz=0;a.kfOy=0;}}
  /* T6f: kayarak müdahalenin temas karesinde uzanan ayak topa değer — çizilen kök, topa yakın ayağın taban ortasını topun merkezinin 0,12 m yanına
     getirecek kadar (yatayda en çok 0,7 m) kayar, sonra 0,25 sn'de söner (motorun yeri değişmez; kayma pozu yan yatmış kökle çizilir, IK'ya bırakılmaz) */
  if(ANM_KAYMA.has(p)){ANM_KAYMA.delete(p);if(ad==='kayma'){R.updateMatrixWorld(true);const tb=anmVkTop(a.al),cx=tb[0],cy=tb[1]+0.11,cz=tb[2];let en=9,fx=0,fz=0;
    for(const kb of[M.kL,M.kR]){ANM_KV.set(0,-0.5,0.05).applyMatrix4(kb.matrixWorld);const d=Math.hypot(ANM_KV.x-cx,ANM_KV.y-cy,ANM_KV.z-cz);if(d<en){en=d;fx=ANM_KV.x;fz=ANM_KV.z;}}
    if(en>0.15){const ox=cx-fx,oz=cz-fz,ol=Math.sqrt(ox*ox+oz*oz)||1,k=Math.min(Math.max(0,ol-0.12),0.7)/ol;a.kyOx=ox*k;a.kyOz=oz*k;}}}
  if(a.kyOx||a.kyOz){R.position.x+=a.kyOx;R.position.z+=a.kyOz;const s=dt>0?Math.max(0,1-dt/0.25):1;a.kyOx*=s;a.kyOz*=s;if(Math.abs(a.kyOx)+Math.abs(a.kyOz)<0.002){a.kyOx=0;a.kyOz=0;}}
  /* T9b-e: ayakta müdahalenin temas karesinde (mudahaleSonuc) uzanan ayak topa erişemediyse — motor topu 0,7–1 m'den de keser, bacak IK'sı
     erişimin içinde kalır — kök kalan pay kadar topa kayar (en çok 0,5 m: uzanma hamlesi), 0,2 sn'de söner (kaymadaki gibi) */
  if(ad==='mudahale'&&a.mAn===e&&a.mAnT===e.t&&a.mT&&!a.kucuk&&p.tur==='oyuncu'){R.updateMatrixWorld(true);ANM_KV.set(0,-0.5,0.05).applyMatrix4((a.mI?M.kR:M.kL).matrixWorld);
    const tb=anmVkTop(a.al),dx=tb[0]-ANM_KV.x,dz=tb[2]-ANM_KV.z,dl=Math.sqrt(dx*dx+dz*dz),r=dl-0.12;
    if(r>0.03){const k=Math.min(r,0.5)/dl;a.mOx=dx*k;a.mOz=dz*k;}}
  /* A6c: şut bloğunun temas karesinde uzanan ayak topa erişemediyse kök kalan pay kadar topa kayar (en çok ANM.blok.kok m; öne atılma), müdahaledeki gibi
     0,2 sn'de söner — motorun hamledeki erişimi 0,95 m, ayakta bacağın yatay erişimi ~0,4 m */
  if(ad==='blok'&&ANM.blok&&ANM.blok.acik&&a.blkE===e&&e.t<=dt*1.01&&a.blkP&&a.blkW>0.5&&!a.kucuk&&p.tur==='oyuncu'){R.updateMatrixWorld(true);ANM_KV.set(0,-0.5,0.05).applyMatrix4((a.blkI?M.kR:M.kL).matrixWorld);
    const dx=a.blkP[0]-ANM_KV.x,dz=a.blkP[2]-ANM_KV.z,dl=Math.sqrt(dx*dx+dz*dz),r=dl-0.12;
    if(r>0.03){const k=Math.min(r,ANM.blok.kok)/dl;a.mOx=dx*k;a.mOz=dz*k;}}
  if(a.mOx||a.mOz){R.position.x+=a.mOx;R.position.z+=a.mOz;const s=dt>0?Math.max(0,1-dt/0.2):1;a.mOx*=s;a.mOz*=s;if(Math.abs(a.mOx)+Math.abs(a.mOz)<0.002){a.mOx=0;a.mOz=0;}}
}

/* ---- 4b. T9b-e kalecinin kolu topa (Ek G6): iki kemikli kol IK'sı (bacak IK'sının kalıbı; omuz 0,3 m, ön kol ve eldiven 0,3 m). Uçuşta, ayakta
   kurtarışta (tutuş), yumrukta ve yere yayılan kapanmada top yaklaşırken eller topun yolunun göğse en yakın noktasına uzanır (o noktaya 0,4 sn
   kala girer, top göğüsten 1,6 m'den uzaksa girmez); elle temasın motor adımında (olay 'save' parca 'el', 'yumruk', 'parmak') eller topun çizilen
   yerindedir — iki elde topun iki yanında, tek elde omzu topa yakın kol —; sonra kollar temastaki açılarını gövdeye göre 0,1 sn korur (gövde
   düşerken eller dünyadaki temas noktasında asılı kalmaz; tutulan topta eller topu izler), 0,2 sn'de poza döner.
   Çözüm gövde kemiğinin çerçevesinde: dirsek açısı omuz–hedef uzaklığından, kolun yana açılması (z) ve öne kalkışı (x) hedefin yönünden, kol
   burulması 0; iki çözümden poza yakın olanı. Kök ve poz bittikten sonra (anmKok) yalnız kol kemiklerine yazılır ---- */
/* omuzun dönüşü poz ile çözüm arasında dördeyle (en kısa yoldan) karışır: Euler açılarının doğrudan karışımı kolu ara pozlarda gökyüzüne süpürüyordu */
const ANM_KOL=new Map(),ANM_KM=new THREE.Matrix4(),ANM_KV2=new THREE.Vector3(),ANM_QA=new THREE.Quaternion(),ANM_QB=new THREE.Quaternion(),ANM_QC=new THREE.Quaternion(),ANM_EU=new THREE.Euler();
/* kolun omuz dönüşünü (Euler XYZ) q'ya doğru w kadar döndürür, dirseği e'ye doğru; kemiklere yazar */
function anmKolKar(a,i,q,e,w){
  const P=a.P,ka=i?'aR':'aL',kz=ka+'z',ky=ka+'y',ke=i?'eR':'eL',M=a.m;
  ANM_EU.set(P[ka],P[ky],P[kz],'XYZ');ANM_QA.setFromEuler(ANM_EU).slerp(q,w);ANM_EU.setFromQuaternion(ANM_QA,'XYZ');
  P[ka]=ANM_EU.x;P[ky]=ANM_EU.y;P[kz]=ANM_EU.z;P[ke]+=(e-P[ke])*w;
  (i?M.aR:M.aL).rotation.set(P[ka],P[ky],P[kz]);(i?M.eR:M.eL).rotation.x=P[ke];
}
function anmKolCoz(a,i,tx,ty,tz,w){
  const P=a.P,ka=i?'aR':'aL',kz=ka+'z',ky=ka+'y';
  ANM_KV2.set(tx,ty,tz).applyMatrix4(ANM_KM);
  let X=ANM_KV2.x-(i?0.27:-0.27),Y=ANM_KV2.y-0.48,Z=ANM_KV2.z,d=Math.sqrt(X*X+Y*Y+Z*Z);
  if(d>0.598){const k=0.598/d;X*=k;Y*=k;Z*=k;d=0.598;}else if(d<0.1)d=0.1;
  const cf=clamp((d*d-0.18)/0.18,-1,1),fi=Math.acos(cf),hy=-0.3*(1+cf),hz=0.3*Math.sin(fi),c1=Math.asin(clamp(X/(-hy),-1,1));
  /* iki çözümden omuz dönüşü poza yakın olan */
  ANM_EU.set(P[ka],P[ky],P[kz],'XYZ');ANM_QA.setFromEuler(ANM_EU);let en=-1;
  for(const c of[c1,Math.PI-c1]){ANM_EU.set(Math.atan2(Z,Y)-Math.atan2(hz,hy*Math.cos(c)),0,c,'XYZ');ANM_QC.setFromEuler(ANM_EU);const dd=Math.abs(ANM_QA.dot(ANM_QC));if(dd>en){en=dd;ANM_QB.copy(ANM_QC);}}
  anmKolKar(a,i,ANM_QB,-fi,w);
}
function anmKolIK(a,p,dt){
  const k=a.kl,e=p.eylem,ad=e?e.ad:'',b=mac.ball,M=a.m,el=ANM_KOL.get(p);
  if(el!==undefined)ANM_KOL.delete(p);
  if(a.kucuk||!p.oyunda){k.w=0;k.temas=false;k.ox=k.oy=k.oz=0;return;}
  /* temasta erişilemeyen pay: kök o kadar (en çok 0,35 m) topa kaymıştı, 0,15 sn'de söner (kafa ve kaymadaki gibi) */
  if(k.ox||k.oy||k.oz){const R=M.root;R.position.x+=k.ox;R.position.y+=k.oy;R.position.z+=k.oz;const s=dt>0?Math.max(0,1-dt/0.15):1;k.ox*=s;k.oy*=s;k.oz*=s;
    if(Math.abs(k.ox)+Math.abs(k.oy)+Math.abs(k.oz)<0.002)k.ox=k.oy=k.oz=0;}
  if(k.temas){k.tT+=dt;if(k.tT>0.3)k.temas=false;}
  if(el!==undefined){const B=anmVkTop(a.al);k.tx=B[0];k.ty=B[1]+0.11;k.tz=B[2];k.tT=0;k.temas=true;k.el=ad==='ucus'&&e.el?e.el:el.el;k.niyet=el.niyet;k.celN=el.celN;}
  /* T15d: planlı çelmede (olayın niyeti 'cel' ve normali) temastan sonra eller normalin yönünde 0,25 m'ye dek iter (takip); kol IK'sı sürer */
  const takip=k.temas&&k.niyet==='cel'&&k.celN&&b.tasiyan!==p;
  /* temastan sonra (çelinen top): kollar temas karesindeki açılarda (gövdeye göre), 0,1 sn sonra 0,2 sn'de poza */
  if(k.temas&&k.tT>0&&b.tasiyan!==p&&!takip){const w=k.tT<0.1?1:Math.max(0,1-(k.tT-0.1)/0.2);for(let i=0;i<2;i++)anmKolKar(a,i,k.q[i],k.e[i],w);k.w=0;return;}
  const iz=ad==='ucus'&&e.faz!=='inis'||ad==='tutus'||ad==='yumruk'||ad==='kapan'&&(e.tur||'yayil')==='yayil';
  if(!k.temas&&!iz&&k.w<0.01){k.w=0;return;}
  /* hedef: temasta tutulan yer (tutulan topta topun kendisi), yaklaşırken topun yolundaki nokta; sönerken son hedef */
  let w=0,tx=k.temas?k.tx:k.sx,ty=k.temas?k.ty:k.sy,tz=k.temas?k.tz:k.sz;
  M.root.updateMatrixWorld(true);const E=M.govde.matrixWorld.elements,gx=E[12]+E[4]*0.3,gy=E[13]+E[5]*0.3,gz=E[14]+E[6]*0.3;   /* göğüs: gövde kemiğinin 0,3 m üstü */
  if(k.temas){w=k.tT<0.1?1:Math.max(0,1-(k.tT-0.1)/0.2);if(b.tasiyan===p){const B=anmVkTop(a.al);tx=B[0];ty=B[1]+0.11;tz=B[2];}
    else if(takip){const d=Math.min(0.25,k.tT*1.8),N=k.celN;tx=k.tx+N[0]*d;ty=k.ty+N[1]*d;tz=k.tz+N[2]*d;}}
  else if(!b.tasiyan&&iz){
    const B=anmVkTop(a.al),bx=B[0],by=B[1]+0.11,bz=B[2],vx=b.vx||0,vy=b.vy||0,vz=b.vz||0,v2=vx*vx+vy*vy+vz*vz;
    const tc=v2>1?((gx-bx)*vx+(gy-by)*vy+(gz-bz)*vz)/v2:-1;
    if(tc>0&&tc<0.45){tx=bx+vx*tc;ty=Math.max(0.11,by+vy*tc-4.9*tc*tc);tz=bz+vz*tc;const dd=Math.sqrt((tx-gx)*(tx-gx)+(ty-gy)*(ty-gy)+(tz-gz)*(tz-gz));
      w=clamp((0.4-tc)/0.3,0,1)*clamp((1.6-dd)/0.5,0,1);if(w>0){k.sx=tx;k.sy=ty;k.sz=tz;}}}
  if(k.temas){k.sx=tx;k.sy=ty;k.sz=tz;}
  k.w=k.temas?w:k.w+(w-k.w)*Math.min(1,dt/0.05);
  if(k.w<0.01){k.w=0;return;}
  /* eller topun gövdeye bakan yanında: iki elde gövdenin yan ekseninde ±0,1 m, göğse doğru 0,04 m. T15d (Ek G6): tutuşun türüne göre — kepçe
     avuçlar topun altında (±0,07, 0,07 aşağı, göğse 0,06), W topun arkasında başparmaklar bitişik (±0,07, 0,02 yukarı, göğse 0,09), yukarı ±0,09;
     planlı çelmede avuç topun itilen yanının tersinde (normalin tersine 0,06; iki elde ±0,06) */
  const xl=Math.sqrt(E[0]*E[0]+E[1]*E[1]+E[2]*E[2])||1,Xx=E[0]/xl,Xy=E[1]/xl,Xz=E[2]/xl;
  const cel=k.temas?k.niyet==='cel':(ad==='ucus'||ad==='tutus')&&e.niyet==='cel',tk=ad==='tutus'?a.tK:ty<0.55?'yer':ty<1.25?'gogus':ty<1.9?'W':'yukari';
  const yA=cel?0.06:tk==='yer'||tk==='W'?0.07:tk==='yukari'?0.09:0.1,gA=cel?0:tk==='yer'?0.06:tk==='W'?0.09:tk==='yukari'?0.05:0.04,dA=cel?0:tk==='yer'?-0.07:tk==='W'||tk==='yukari'?0.02:0;
  let cx=gx-tx,cy=gy-ty,cz=gz-tz;const cl=Math.sqrt(cx*cx+cy*cy+cz*cz)||1;cx*=gA/cl;cy=cy*gA/cl+dA;cz*=gA/cl;
  if(cel){let nx,ny,nz;if(k.temas&&k.celN){[nx,ny,nz]=k.celN;}else{nx=tx-gx;ny=0;nz=tz-gz;}const nl=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;cx-=nx/nl*0.06;cy-=ny/nl*0.06;cz-=nz/nl*0.06;}
  ANM_KM.copy(M.govde.matrixWorld).invert();
  /* tek el: omzu topa yakın olan kol (eylem boyunca aynı; temasta öbür omuz 0,25 m'den yakınsa ona geçer) */
  const tek=k.temas?k.el==='tek':ad==='ucus'&&e.el==='tek';
  if(tek){const q=s=>{const ox=E[12]+E[0]*s+E[4]*0.48-tx,oy=E[13]+E[1]*s+E[5]*0.48-ty,oz=E[14]+E[2]*s+E[6]*0.48-tz;return Math.sqrt(ox*ox+oy*oy+oz*oz);},d0=q(-0.27),d1=q(0.27);
    if(k.kolE!==e){k.kolE=e;k.kol=d0<=d1?0:1;}else if(k.temas&&k.tT===0&&Math.abs(d0-d1)>0.25)k.kol=d0<d1?0:1;
    anmKolCoz(a,k.kol,tx+cx,ty+cy,tz+cz,k.w);}
  else{anmKolCoz(a,0,tx-Xx*yA+cx,ty-Xy*yA+cy,tz-Xz*yA+cz,k.w);anmKolCoz(a,1,tx+Xx*yA+cx,ty+Xy*yA+cy,tz+Xz*yA+cz,k.w);}
  /* temas karesi: kolun erişemediği pay kalırsa (çizilen beden motorun kapsüllerinden kaba; tam uzanmada, alçak topta) kök topa kayar, en çok
     0,35 m; kök yerin altına inmez */
  if(k.temas&&k.tT===0){const R=M.root,P=a.P;
    for(let i=0;i<2;i++){const ka=i?'aR':'aL';ANM_EU.set(P[ka],P[ka+'y'],P[ka+'z'],'XYZ');k.q[i].setFromEuler(ANM_EU);k.e[i]=P[i?'eR':'eL'];}
    R.updateMatrixWorld(true);let en=9,rx=0,ry=0,rz=0;
    for(let i=0;i<2;i++){if(tek&&i!==k.kol)continue;const s=tek?0:i?yA:-yA;ANM_KV.set(0,-0.3,0).applyMatrix4((i?M.eR:M.eL).matrixWorld);
      const dx=tx+Xx*s+cx-ANM_KV.x,dy=ty+Xy*s+cy-ANM_KV.y,dz=tz+Xz*s+cz-ANM_KV.z,d=Math.sqrt(dx*dx+dy*dy+dz*dz);if(d<en){en=d;rx=dx;ry=dy;rz=dz;}}
    if(en>0.05){const f=Math.min(en-0.03,0.35)/en;k.ox=rx*f;k.oy=Math.max(-R.position.y,ry*f);k.oz=rz*f;R.position.x+=k.ox;R.position.y+=k.oy;R.position.z+=k.oz;}}
}
/* ---- A4-3 (2026-10-15; Ek G4): yerden kaldırma. Motor duruşta kalkana 2 m içindeki boştaki arkadaşı kalkis eyleminin yardim alanına yazar (yalnız
   okunur). Yardım eden 2,3 m içinde, eylemsiz ve yavaşsa (< 1,5 m/sn) düşene döner ve öne eğilir (yardim yuvası); kare sonunda (bütün aktörler
   güncellendikten sonra) iki kol ortak noktaya uzanır: yardım edenin düşene yakın omzu ile düşenin ona yakın omzunun ortası (her kol en çok
   0,6 m; omuzlar 1,2–1,3 m'de uzanma söner; ayağa kalkıp 0,85 m'den yakınlaşınca eller bırakılır — kol çözücüsü yakın ve yana düşen hedefte
   sapıyordu). Düşenin kolu kalkışın ilk %15'inde kalkar, son %20'sinde bırakır; yardım eden aynı ağırlıkla ---- */
const ANM_YR={z:-1,m:new Map()},ANM_AK=new Map();let ANM_AK_L=null;
function anmYardimHarita(){if(ANM_YR.z===zaman)return ANM_YR.m;ANM_YR.z=zaman;ANM_YR.m.clear();
  for(const q of mac.players){const e=q.eylem;if(q.oyunda&&e&&e.ad==='kalkis'&&e.yardim)ANM_YR.m.set(e.yardim,q);}return ANM_YR.m;}
const anmYardimUygun=(p,q)=>!!q&&q.oyunda&&!p.eylem&&(p.spd||0)<1.5&&Math.hypot(q.x-p.x,q.z-p.z)<=2.3;
/* yardım edenin kök yönüne ek: düşene doğru (önceki karenin yumuşatılmış ağırlığıyla) */
function anmYardimYaw(a,p,yaw){const q=a.yrQ,w=q?a.sw[ANM_S.yardim]:0;if(w<0.01)return 0;const f=Math.atan2(q.z-p.z,q.x-p.x);return anmAci(Math.atan2(Math.cos(f),Math.sin(f))-yaw)*w;}
function anmYardimIK(L){
  for(const a of L){const q=a.yrQ;if(!q)continue;a.yrW=0;const w=a.sw[ANM_S.yardim],e=q.eylem;if(w<0.01||!e||e.ad!=='kalkis')continue;
    if(L!==ANM_AK_L||ANM_AK.size!==L.length){ANM_AK_L=L;ANM_AK.clear();for(const x of L)ANM_AK.set(x.kaynak,x);}
    const b=ANM_AK.get(q);if(!b||!b.m.root.visible||!a.m.root.visible)continue;
    a.m.root.updateMatrixWorld(true);b.m.root.updateMatrixWorld(true);
    /* omuzlar gövde kemiğinde (±0,27, 0,48): her birinin öbürüne yakın omzu */
    const om=(A,i)=>{const E=A.m.govde.matrixWorld.elements,s=i?0.27:-0.27;return[E[12]+E[0]*s+E[4]*0.48,E[13]+E[1]*s+E[5]*0.48,E[14]+E[2]*s+E[6]*0.48];};
    const d2=(u,v)=>(u[0]-v[0])*(u[0]-v[0])+(u[1]-v[1])*(u[1]-v[1])+(u[2]-v[2])*(u[2]-v[2]);
    const A0=om(a,0),A1=om(a,1),B0=om(b,0),B1=om(b,1),ia=Math.min(d2(A0,B0),d2(A0,B1))<=Math.min(d2(A1,B0),d2(A1,B1))?0:1,Sa=ia?A1:A0;
    const ib=d2(B0,Sa)<=d2(B1,Sa)?0:1,Sb=ib?B1:B0,d=Math.sqrt(d2(Sa,Sb)),f=e.t/(e.sure||1);
    const wy=w*clamp(f/0.15,0,1)*clamp((1-f)/0.2,0,1)*clamp((1.3-d)/0.1,0,1)*clamp((d-0.72)/0.13,0,1);if(wy<0.01)continue;a.yrW=wy;   /* uygulanan ağırlık (ölçüm okur) */
    const mx=(Sa[0]+Sb[0])/2,my=(Sa[1]+Sb[1])/2,mz=(Sa[2]+Sb[2])/2;a.yrM=[mx,my,mz,d];
    ANM_KM.copy(a.m.govde.matrixWorld).invert();anmKolCoz(a,ia,mx,my,mz,wy);
    ANM_KM.copy(b.m.govde.matrixWorld).invert();anmKolCoz(b,ib,mx,my,mz,wy);}
}
/* A4-7 (2026-10-15): ısınan yedeğin yeleği — eşofman modelinin atlasında forma önü ve arkası (KARE, 16'lık iki kare) kolsuz yelekle yeniden çizilir:
   gövde ve iki omuz askısı yelek, kollar, omuz başı, yaka ve yanlar eşofman; ısınma bitince ya da oyuna çağrılınca (yeleği çıkarır) eski kareler
   geri konur. Motor yalnız okunur (p.isiniyor, p.oturuyor, mac.degisiklik) */
function anmYelek(a,E,on){const map=E.mesh.material.map,g=map.image.getContext('2d');
  if(on){a.yelekEski=g.getImageData(0,0,32,16);const r=STIL.yedekYelek[a.kaynak.team]||STIL.yedekYelek[0],koyu=dk(r,0.72);
    for(const ox of[0,16]){g.fillStyle=r;g.fillRect(ox+1,3,14,13);g.fillRect(ox+3,0,3,3);g.fillRect(ox+10,0,3,3);
      g.fillStyle=koyu;g.fillRect(ox+1,15,14,1);if(!ox)g.fillRect(ox+6,3,4,1);}}
  else if(a.yelekEski)g.putImageData(a.yelekEski,0,0);
  a.yelekli=on;map.needsUpdate=true;}
/* ---- her kare: aktörün ara değerli yeri, görünürlüğü, pozu ve kökü. al: iki motor adımı arası oran, T: tünel ---- */
function aktorGuncelle(a,al,dts,T){
    const p=a.kaynak;a.x=lerp(a.px,p.x,al);a.z=lerp(a.pz,p.z,al)-MOTOR_Z;a.al=al;
    let gorunur=p.z>T.z-0.8&&(p.tur!=='oyuncu'||p.oyunda||p.cikiyor);
    /* yedek: kulübedeyken eşofman modeli, oyuna girince forma */
    if(a.esofman){const esofmanli=p.tur==='yedek'&&!p.cikti;a.esofman.root.visible=gorunur&&esofmanli;
      if(esofmanli){a.m.root.visible=false;const E=a.esofman;if(!gorunur)return;
        const yel=!!p.isiniyor&&!p.oturuyor&&!(mac.degisiklik&&mac.degisiklik.giren===p);if(yel!==!!a.yelekli)anmYelek(a,E,yel);   /* A4-7 */
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
    const ckYaw=a.ck?a.ck.yaw:0,yw0=Math.atan2(Math.cos(p.yon),Math.sin(p.yon)),yrYaw=a.yrQ?anmYardimYaw(a,p,yw0):0;   /* A4-3: yardım eden düşene döner */
    /* A6b (2026-10-17; Ek G0 baş öncülüğü): kasıtlı dönüşte gövde başın gerisinde kalır — kök hedefine 0,35 rad'dan uzaksa, başın hedefi (a.byH, önceki
       kare) dönüş yönündeyse ve baş gövdenin önünde ANM.bas.govdeSinir kadar değilse kök en çok govdeHiz rad/sn döner (baş 7 rad/sn ile önden gider,
       sonra gövde 9 rad/sn ile yetişir). Eylemde, çalımda, kalecide ve başı başka yöne bakarken (tarama) kök sınırsızdır. A6-0: dönüşe baş gövdeyle hizalı
       başladığında başın öncülüğü ≥ 150 ms dönüşlerin %33'ündeydi */
    let kokTavan=ckYaw!==0?10.5:9;const BS=ANM.bas;
    if(BS.govdeSinir!=null&&!ckYaw&&!yrYaw&&!p.eylem&&p.rol!=='GK'&&p.tur==='oyuncu'){const kal=anmAci(yw0-a.yaw),s=Math.abs(kal)>0.05?(kal>0?1:-1):(a.donY>0?1:-1);
      if((Math.abs(a.donY)>1.5||Math.abs(kal)>0.35)&&Math.abs(kal)<1.2&&a.byH*s>0.2&&a.by*s<BS.govdeSinir)kokTavan=BS.govdeHiz;}
    aciYumusak(a,yw0+ckYaw+yrYaw,dts,40,kokTavan);
    anmPozBasla(a,p,spd,dts,a.m);
    if(p.tur==='kenar'){a.sevinc=Math.max(0,(a.sevinc||0)-dts);const sv=yumusak(a,'kenarSevinc',a.sevinc>0?1:0,6,dts);
      if(p.oturuyor){anmKar(a,ANM_POZ.otur,1-sv);anmKulubeOturus(a,p,dts,1-sv);}
      if(sv>0.02){anmKar(a,POSE.sevinc,sv);a.P.dy+=Math.abs(Math.sin(zaman*7+a.faz0))*0.2*sv;}
      if(p.kind==='td')anmTeknikDirektor(a,p,dts,sv);
      if(a===DORDUNCU)anmKar(a,POSE.tabela,yumusak(a,'tabela',0,5,dts));}
    else if(p.oturuyor)anmKar(a,ANM_POZ.otur,1);
    anmPozBitir(a);pose(a.m,a.P);
    anmKok(a,p,dts,a.m);
    if(p.rol==='GK'&&p.tur==='oyuncu')anmKolIK(a,p,dts);   /* T9b-e: kökten sonra (gövdenin dünyadaki yeri belli) */
}
/* ---- top: ara değerli yer; dönüş yerde yuvarlanma, havada üst/kesik (ust) ve yan (egri) dönüş; elde taşınırken dönmez; tünelin içinde gizli ---- */
const ANM_TOP={w:new THREE.Vector3(),h:new THREE.Vector3(),e:new THREE.Vector3()};
function topCiz(b,al,bx,bz,dts,T){
  if(anmTopTut()){bx=TOP.px;bz=TOP.pz-MOTOR_Z;al=0;}   /* T9b-e: temas karesi */
  let by=lerp(TOP.py,b.y,al);
  {const o=ANM_VK_B;o[0]=bx;o[1]=by;o[2]=bz;anmEldeKar(o,al);bx=o[0];by=o[1];bz=o[2];}   /* T15d: tutulan topun göğse geçişi */
  topMesh.position.set(bx,TOP_R+by,bz);
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
  if(ad==='mudahaleSonuc'&&v&&v.p&&v.topaDegdi){if(v.kayma)ANM_KAYMA.set(v.p,true);else ANM_MUD.set(v.p,true);}   /* T6f: temas karesi */
  /* T9b-e: kalecinin eliyle topa değdiği motor adımı (kurtarışta parca 'el', yumruk, kaleye giden parmak ucu) — el o karede topta (anmKolIK) */
  if(v&&v.p&&v.p.rol==='GK'&&(ad==='save'&&(!v.parca||v.parca==='el')||ad==='yumruk'||ad==='parmak'))ANM_KOL.set(v.p,{el:v.el||'cift',niyet:ad==='save'&&!v.catch?v.niyet||null:null,celN:v.celN||null});   /* T15d: planlı çelmenin normali */
  if(ad==='save'&&v&&v.catch&&v.p){const b=mac.ball;ANM_ELDE.p=v.p;ANM_ELDE.kare=mac.kare!=null?mac.kare:null;ANM_ELDE.x=b.x;ANM_ELDE.y=b.y;ANM_ELDE.z=b.z;}   /* T15d: tutulan topun başlangıcı */
  if((ad==='faul'||ad==='avantaj')&&v&&v.faulYiyen&&v.faulYapan&&!v.avantajdan){const y=v.faulYiyen,f=v.faulYapan;
    let dx=y.x-f.x,dz=y.z-f.z;const L=Math.sqrt(dx*dx+dz*dz)||1;dx/=L;dz/=L;const s=Math.sqrt((y.vx||0)*(y.vx||0)+(y.vz||0)*(y.vz||0));
    if(s>1){const k=Math.min(0.75,0.3+s/8);dx=dx*(1-k)+y.vx/s*k;dz=dz*(1-k)+y.vz/s*k;}
    ANM_DUSUS.set(y,{yon:Math.atan2(dz,dx),t:zaman});}
  /* T5f (Ek G4): forma çekme (faul kaynağı taktik), gövdeyle çarpma (carpma), görülmeyen faulde yiyenin itirazı (0,5 sn sonra, hakeme dönük) */
  if(v&&v.faulYapan&&v.faulYiyen&&(ad==='faul'||ad==='avantaj'||ad==='faulGorulmedi')&&!v.avantajdan){
    if(v.kaynak==='taktik')ANM_TEMAS.set(v.faulYapan,{tur:'cekme',t0:zaman-0.05,sure:0.7,hedef:v.faulYiyen});
    else if(v.kaynak==='carpma')ANM_TEMAS.set(v.faulYapan,{tur:'itme',t0:zaman-0.05,sure:0.45,hedef:v.faulYiyen});
    if(ad==='faulGorulmedi')ANM_TEMAS.set(v.faulYiyen,{tur:'tepki',t0:zaman+0.5,sure:1.3,hedef:(typeof mac!=='undefined'&&mac.refs&&mac.refs[0])||null});
    /* T10f (T8'den): kutuda itişme ve tutma faulünde faul yapan kollarını açıp hakeme döner (“dokunmadım”) */
    else if(ad==='faul'&&(v.kaynak==='tutma'||v.kaynak==='itme'||v.kaynak==='carpma')&&!ANM_TEMAS.has(v.faulYapan))ANM_TEMAS.set(v.faulYapan,{tur:'tepki',t0:zaman+0.4,sure:1.4,hedef:(mac.refs&&mac.refs[0])||null});}
  /* T10f: gol iptali — golü atan ve 15 m içindeki takım arkadaşları bayrağı kaldıran yan hakeme itiraz eder */
  if(ad==='golIptal'&&v&&v.p&&typeof mac!=='undefined'&&mac.refs){const yh=v.p.x>0?mac.refs[1]:mac.refs[2];
    for(const q of mac.teams[v.p.team])if(q.oyunda&&q.rol!=='GK'&&Math.hypot(q.x-v.p.x,q.z-v.p.z)<15)ANM_TEMAS.set(q,{tur:'tepki',t0:zaman+0.3+0.25*h2((q.no|0)+3,7),sure:1.6,hedef:yh});}
}
