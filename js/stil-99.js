/* ============ Chairman — STİL DOSYASI ============
   Oyunun görünüşüne dair bütün ayarlar burada toplanır.
   Stili değiştirmek istediğinde önce bu dosyaya bak; oyun mantığı (maç motoru, yönetim) bu dosyayı kullanmaz.
   Renkler: '#rrggbb' metin ya da 0xrrggbb sayı olarak. */
const STIL={
  ad:"Chairman",

  /* Ekran: 4:3, tek ızgara genislik×yukseklik (960×720), 15 bit renk + 4x4 titreme. 2026-10-03 kullanıcı kararı: maçtaki görüntü kalitesi
     standarttır; oda, balkon ve maç aynı ızgarayı ve örneklemeyi kullanır (eskiden oda ve balkon 640×480, maç ayrı 960×720 ızgaradaydı).
     Köşe titremesi (köşelerin piksellere yapışması) kapalı: hareket pürüzsüz aksın diye. titremeGucu: renk titremesinin şiddeti (0–1).
     ornekleme (A akışı, 2026-10-03, kullanıcı kararı): sahne ızgaranın bu katında çizilip ortalanarak ızgaraya indirilir (2 = 1920×1440);
     renk biti ve titreme değişmez, uzaktaki ince çizgi ve küçük oyuncular kırılmaz. */
  ekran:{genislik:960,yukseklik:720,renkBiti:5,titreme:true,titremeGucu:0.7,koseTitremesi:false,arkaPlan:0x070b16,ornekleme:2},

  /* Gece havası */
  sis:{renk:0x0c1322,yakin:150,uzak:380},
  gokyuzu:{ufuk:[0.1,0.13,0.21],tepe:[0.015,0.025,0.07],yildiz:0xc8d0e8},
  /* Maç ışıkları (yalnız maç sahnesi, js/goruntu.js; oda ve balkonun kendi ışığı var). A akışı (2026-10-03): sıcak ana ışık başkanın
     tarafından gelir (eskiden karşıdan: oyuncular locadan ters ışıkta koyu leke görünüyordu); soğuk karşı ışık uzak taraftan, gece havası korunur */
  isik:{
    ortam:{renk:0x56607c,guc:0.72},
    ana:{renk:0xffe8c4,guc:0.82,konum:[20,80,-70]},     // sıcak projektör ışığı (loca tarafından)
    dolgu:{renk:0xcfd8ff,guc:0.45,konum:[-50,70,45]}    // soğuk karşı ışık (uzak taraftan)
  },

  /* Saha dokusu (metre başına piksel = pikselMetre) */
  saha:{pist:'#8c3f2f',pistCizgi:'#d8cbb8',cimKoyu:'#2f7a2a',cimAcik:'#3a8c33',seritGenisligi:5.25,cizgi:'#f2f2ea',asinma:'112,92,52',pikselMetre:8},

  /* Tribün: her seyirci kutulardan kurulu küçük bir insan (gövde, kollar, bacak, baş, saç/bere); iki kareyle sallanır.
     Paletler üst giysi renkleridir. bere: başında bere/şapka olma olasılığı, kel: kel olma olasılığı. */
  seyirci:{
    ev:['#c8281e','#c8281e','#c8281e','#ece6da','#ece6da','#1c1c20','#d8b030'],
    karisik:['#c8281e','#ece6da','#3a3c44','#5a4630','#2a4a8a','#1c1c20','#7a6a50','#c8281e','#4a5a3a','#6a2a2a'],
    deplasman:['#e8eaee','#22347a','#e8eaee','#1c1c20'],
    vip:['#1e1f24','#2a2c33','#3a3228','#23262e','#2e2a26'],
    sac:['#241a12','#3c2616','#141212','#5a4028','#8a8680','#1c1714'],
    bere:0.16,kel:0.1,
    /* N9 (2026-10-04): kapıdan yerine yürüyen seyirci. hiz: yürüme hızı aralığı (m/sn, kişiden kişiye), adim: adım boyu (m),
       salinim: bacak salınımı (radyan), sekme: adımdaki iniş-çıkış (m). TEST değerleri */
    yuruyen:{hiz:[1.15,1.45],adim:0.62,salinim:0.42,sekme:0.03},
    /* maç olaylarında tribünün heyecanı (0–1) ve sönme süresi (sn) */
    heyecan:{giris:0.8,santra:0.5,sut:0.35,kurtaris:0.4,direk:0.6,gol:1,macSonu:0.8,sonme:6},
    vipKoltuk:'#8a1c16',vipKorkuluk:0xb8bcc2,
    kareSuresi:0.3
  },

  /* Formalar (anahtarlar kodda kullanılır: shirt=forma, trim=yaka/numara, shorts=şort, socks=çorap, out=numara kenarı, sash=çapraz şerit) */
  formalar:{
    ev:{shirt:'#c8281e',trim:'#f2ede2',shorts:'#f2ede2',socks:'#c8281e',out:'#6e140e'},
    evKaleci:{shirt:'#e0b828',trim:'#141414',shorts:'#1c1c1e',socks:'#e0b828',glove:'#f2f2f2',gk:true},
    deplasman:{shirt:'#eef0f3',trim:'#22347a',shorts:'#22347a',socks:'#eef0f3',sash:'#22347a'},
    /* A akışı (2026-10-03): deplasman kalecisi yeşildi, çimle aynı tonda locadan seçilmiyordu; mor */
    deplasmanKaleci:{shirt:'#8a4fc4',trim:'#141414',shorts:'#1c1c1e',socks:'#8a4fc4',glove:'#f2f2f2',gk:true},
    hakem:{shirt:'#1a1a1c',trim:'#f2f2f2',shorts:'#1a1a1c',socks:'#1a1a1c'},
    /* yedekler eşofmanla, teknik direktör takım elbiseyle (pant: uzun pantolon, ls: uzun kol) */
    yedekEv:{shirt:'#7a1812',trim:'#f2ede2',shorts:'#1c1c20',socks:'#1c1c20',ls:true,pant:true},
    yedekDeplasman:{shirt:'#22347a',trim:'#eef0f3',shorts:'#1c1c20',socks:'#1c1c20',ls:true,pant:true},
    takimElbise:{shirt:'#23262e',trim:'#e8e4da',shorts:'#23262e',socks:'#23262e',ls:true,pant:true,boots:'#0e0e10'},
    /* top toplayıcı çocuklar (N10): lacivert eşofman, sarı yelek (çocuk boyu: topcuBoy) */
    topcu:{shirt:'#e8c21e',trim:'#1e2a5a',shorts:'#1e2a5a',socks:'#1e2a5a',ls:true,pant:true},
    /* antrenörler (kaleci antrenörü, kondisyoner) koyu eşofmanla; fotoğrafçılar turuncu yelek, elde fotoğraf makinesi */
    antrenorEv:{shirt:'#1c1c20',trim:'#c8281e',shorts:'#1c1c20',socks:'#1c1c20',ls:true,pant:true},
    antrenorDeplasman:{shirt:'#2c3446',trim:'#eef0f3',shorts:'#2c3446',socks:'#2c3446',ls:true,pant:true},
    foto:{shirt:'#d8661e',trim:'#1c1c1e',shorts:'#2a2c30',socks:'#2a2c30',ls:true,pant:true,boots:'#141416',
      ekParcalar:[{kemik:'eR',w:0.13,h:0.1,d:0.12,x:0.08,y:-0.34,z:0.1,renk:'ek1'},{kemik:'eR',w:0.07,h:0.07,d:0.12,x:0.08,y:-0.34,z:0.2,renk:'ek2'}],
      ekRenkler:{ek1:'#141416',ek2:'#3a3a42'}},
    /* T10f: sağlıkçılar beyaz eşofmanla (kırmızı şerit), sol elde kırmızı ilk yardım çantası (beyaz haç) */
    saglikci:{shirt:'#ecebe6',trim:'#c8281e',shorts:'#ecebe6',socks:'#2a2c30',ls:true,pant:true,boots:'#141416',
      ekParcalar:[{kemik:'eL',w:0.24,h:0.17,d:0.12,x:-0.02,y:-0.42,z:0.02,renk:'ek1'},{kemik:'eL',w:0.03,h:0.1,d:0.125,x:-0.02,y:-0.42,z:0.02,renk:'ek2'},{kemik:'eL',w:0.1,h:0.03,d:0.125,x:-0.02,y:-0.42,z:0.02,renk:'ek2'}],
      ekRenkler:{ek1:'#c8281e',ek2:'#f4f4f0'}}
  },
  /* T10f: sedye (çerçeve ve bez; js/mac-sahnesi.js) */
  sedye:{cerceve:0x8c8c90,bez:0xc8642a},
  /* K1 (D-saglikci, 2026-10-20): sağlıkçı kulübedeki yerine bu kadar yakınken (m) görünmez (js/animasyon.js aktorGuncelle; yer kulübenin açık
     önünden ~0,65 m içeride: belirme ve kaybolma kulübenin önünde) */
  saglikciGizle:0.6,
  /* top toplayıcı çocukların boyu ve eni (yetişkine oran) */
  topcuBoy:{h:0.74,w:0.8},
  /* A4-7 (2026-10-15): ısınan yedeklerin kolsuz yeleği (eşofmanın üstünde; js/animasyon.js anmYelek): ev, deplasman. Top toplayıcının sarısı,
     fotoğrafçının turuncusu ve ev kalecisinin sarısından ayrı */
  yedekYelek:['#a2dc34','#ee5a9c'],
  /* antrenman: koniler, fotoğraf flaşı */
  antrenman:{koni:0xff7a1e,flas:0xfff4dc},

  tenler:['#e2b48c','#cf9a70','#b07650','#8a5a3c','#ecc49e'],
  /* A5 (2026-10-15; gerçekçilik planı §4 A5): insan modeli (js/oyuncular.js). tur 'kesit' değişken kesitli halkalardan tek kemikli mesh | 'kutu' eski
     kutular (karşılaştırma için; kullanıcı A5'i değerlendirene dek, sonra kalkar); normal 'yumusak' Gouraud | 'duz' dilim başına düz gölge (PS1 gibi; köşe iki katı) — A5-0 titreme
     ölçüsünde (A5'in titreme aracı, tur/a5'te; 10 an, aynı pozlar) dama payı kutu %23,0 · düz %20,8 · yumuşak %20,4: yumuşak gölge titremede gürültü yapmıyor; dilim çevredeki köşe sayısı;
     eklem diz ve dirsek halkasının şişme payı (bükülünce büzülmesin); sacPay saç kabının kafadan uzaklığı (m). Adres anahtarı ?model=kutu|duz|yumusak. TEST */
  model:{tur:'kesit',normal:'yumusak',dilim:8,eklem:1.1,sacPay:0.013},

  /* Oyuncu animasyonu (js/animasyon.js; E akışı, 2026-10-03; A2a 2026-10-08): yalnız görünüş ayarları, motoru etkilemez. Gerçek değerler
     gerçekçilik planı Ek G0/G1'dedir; adım boyu ve yerde kalma payı hızdan ve boydan hesaplanır (anmAdimBoyu).
     adim: yuvar: adımın uçlarında taban ortasının yükselmesi (m); kaldirEn/kaldirHiz/kaldirTavan: salınan ayağın tepe yüksekliği
       = kaldirEn + kaldirHiz·hız (m; en çok kaldirTavan, adımın yarısını geçmez); geri: geri adımın boy çarpanı; yanEn/yanHiz/yanTavan: yana
       adımın boyu (m); donusKadans: yerinde dönerken basma sıklığı (adım/sn; dönüş farkı büyüdükçe artar).
     kalcaDonus: kalçanın hareket yönüne dönüşü (rad, gövde ters döner); kalcaSalinim: adımla kalça dönüşü (rad; yürüyüş, koşu);
       kalcaGecikme: dönüşte kalçanın ayakların yönünde kalan payı; yaylanma: koşuda kalçanın inip kalkması (m; yavaş koşu, hızlı koşu).
     egilme: kosu koşuda öne eğilme (rad); ivme/yatis: ivmeden öne-arkaya ve virajda içe yatış (atan(a/g) çarpanı); ivmeAlt/ivmeUst/yatisTavan sınırlar (rad);
       ivmeUstDepar: depar başında (hız 0) öne eğilme tavanı, hız 3 m/sn'ye çıkınca ivmeUst (A3d).
     fren (A3a; motorun hız yönündeki ivmesi < −2 m/sn², koşuda): adim adım boyunun kısalma payı, yer yerde kalma payına ek, kalca kalçanın inişi (m),
       kol kolların yana açılması (rad), ayak basan ayağın kütle merkezinin önüne kayması (m). donus (A3b; hızın yönü 1,5 rad/sn'den hızlı dönerken):
       yer, kalca, kol aynı anlamda; basma yerinde dönüşte adım sıklığının izlenme hızına ek (1/sn); kaldir yerinde dönüş adımında ayağın en az kalkışı (m).
     viraj (A3d): virajda içteki kolun gövdeye yaklaşması, dıştakinin açılması (rad; yatış tavanında).
     bas: bakış zinciri — yay (1/sn), hiz (en çok rad/sn), ivme (en çok rad/sn²), sinir (baş–gövde, rad; ötesini gövde alır, en çok govde rad), oncu (dönüşte baş, kökün
       dönüş hızının bu kadar saniye ilerisine bakar). A6b (2026-10-17): govdeSinir — kasıtlı dönüşte baş dönüş yönünde gövdenin bu kadar (rad) önünde
       değilse kök en çok govdeHiz rad/sn döner (gövde başın gerisinde kalır); başın hedefi çizilen gövdeye göredir. govdeSinir null: eski yol. Denendi ve null
       (tohum 3, 180 sn): [0,25; 3] hizalı başlayan dönüşte ≥ 150 ms %33 → 36, [0,45; 2] %37, baş hızı 10 ve öncü 0,45 ile %38 (başın gövdeye göre hızı p99
       397°/sn, tavan 400) — hedef %50'nin altında, darboğaz motorun dönüşü önceden haber vermemesi (bakış öncülüğü motorda; borç defteri §5a satır 14).
     kol: kol salınımının genliği (rad; yürüyüş + koşu payı) ve dirsek bükülmesi (rad; yürüyüş + koşu payı).
     dusus: yerde yatış açısı (rad) ve gövde kalınlığı (yüzüstü/sırtüstü, yan). dokunus: top sürerken ayak dokunuşunun süresi (sn).
     kucukPiksel: ekranda (720 satırlık ızgarada) bundan kısa görünen oyuncuda bakış ve dokunuş gibi ayrıntı katmanları atlanır (480 satırdaki 8 ile aynı eşik).
     top: havadaki topun üst/kesik (ust) ve yan (egri) dönüşünün görünür hız çarpanları; kare: bir karede en çok dönüş (rad, örnekleme kırılmasın).
     sevincCesit: gol sevinci çeşidi sayısı (oyuncu ve gole göre karışık seçilir)
     zipla (A6a, 2026-10-17): sıçramanın uçuş pozu uçuşun bu payından sonra iner (inis; eski 0,8) ve inişte kalan uçuş pozu hemen kalkar (kes 1; 0: yuva
       kendi hızıyla söner) — inişte bacak pozu yere basan ayağın IK'sını eziyordu.
     blok (A6c, 2026-10-17): şut ve orta bloğunda bacak — acik (0: eski poz), erisim (uzanan bacağın kökten yatay erişimi, m; motorun blokErisim'i 0,95),
       tut (temastan sonra bacağın temas noktasında kaldığı süre, sn), hiz (hamlede uzanmanın hızı, 1/sn), kok (temasta ayak yetişmezse kökün topa kayması, en çok m),
       yuksek (topun tabanı bundan yüksekse ayak topun altına basar, top bacağa değer; m).
     koru (A6a, 2026-10-17): top saklama — dokunus: motorun taban dokunuşunun çizimi (0: çizilmez; 1: yalnız salınımdaki ayakla, ayak yere basınca poz
       hemen kalkar; 2: eski — seçilen ayakla, yerdeyse bacak pozu IK'yı ezer). A6-0: top saklamada kayan karelerin %68'inde bilek çapadan kopuyordu */
  animasyon:{
    adim:{yuvar:0.05,kaldirEn:0.06,kaldirHiz:0.055,kaldirTavan:0.42,geri:0.75,yanEn:0.3,yanHiz:0.08,yanTavan:0.5,donusKadans:3.2},
    kalcaDonus:0.5,kalcaSalinim:[0.05,0.1],kalcaGecikme:0.65,yaylanma:[0.04,0.022],
    egilme:{kosu:0.2,ivme:0.8,yatis:0.8,ivmeAlt:-0.4,ivmeUst:0.42,ivmeUstDepar:0.65,yatisTavan:0.35},
    fren:{adim:0.3,yer:0.08,kalca:0.08,kol:0.3,ayak:0.08},donus:{yer:0.2,kalca:0.03,kol:0.12,basma:20,kaldir:0.09},viraj:{kol:0.22},
    bas:{yay:22,hiz:7,ivme:90,sinir:1.22,govde:0.7,oncu:0.32,govdeSinir:null,govdeHiz:3},
    kol:{genlik:[0.16,0.74],dirsek:[0.28,1.1]},
    dusus:{aci:1.45,yuzY:0.12,yanY:0.16},dokunus:0.18,kucukPiksel:12,
    top:{ust:300,egri:150,kare:0.6},sevincCesit:4,
    koru:{dokunus:1},zipla:{inis:0.6,kes:1,capa:1},blok:{acik:1,erisim:0.95,tut:0.15,hiz:14,kok:0.5,yuksek:0.25,yukAyak:0.2},
    /* A8 (2026-10-18): T20–T22'nin yeni tetiklerinin hareketi — dokunus (vuruş hazırlığındaki sürüş dokunuşları çizilir: uzun topta açma, ters yöne kaçan topu
       tabanla durdurma; tabanla geri çekme taban pozuyla), bakis (uzun topta hazırlığın ilk bakis sn'sinde baş hedefe), surukle (top 1,8 m'den öndeyken ve 4,5 m/sn'den
       hızlıyken top sürme adımı söner — depar adımı; ileri uzun itişte süpürme 0,24 sn), alis (yönlü alışta kalça dokunuşun yönüne açılır, rad/rad; gövde yarısı),
       sutEgim (şutun takibinde gövde topun yükselişinden: yerden sertte öne, yükselende geriye; rad), yarim (yarım vole kendi pozuyla). blok.yukAyak (tarama 0 / 0,15 / 0,2 / 0,25 / 0,3 / 0,4 / 0,55: --blok 252'de %89,0 / 99,5 / 99,0 / 97,6 / 94,8 / 89,5 / 89,0): bel hizasındaki
       topta ayak topun yukAyak m altına kalkar (diz ve incik topa; 0: ayak yerde, eski); dokSal (top sürmede dokunuş yalnız salınımdaki ayakla; A6a'nın top saklama
       kuralı), alisAyak (alışta dokunan ayak yerdeyse havadaki ayak alır; yerdeki destek bacağı pozdan çıkar), dokAlcak (top sürme dokunuşunda bacak kanalları
       pozdan çıkar, salınan ayak alçaktan süpürür), capaCiz (poz bacağı tutarken basan ayak çizildiği yere çivilenir) — her biri 0: eski */
    a8:{dokunus:1,dokSal:1,alisAyak:1,dokAlcak:1,capaCiz:1,bakis:0.45,surukle:1,alis:0.45,sutEgim:0.12,yarim:1},
    /* A9 (2026-10-18; gerçekçilik planı §4 “A9”): adım ve baş temposu — her anahtar 0'da eski çizim (anahtarların açıklaması kendi satırında) */
    a9:{
      /* A9-adim: yanEn/yanTavan yan adımın en kısası ve tavanı (m; artış eski adim.yanHiz·v; 0: eski 0,3 / 0,5; veride yan adım ~0,5–0,6 m) · geri yürüyüşte geri adımın ileri adıma oranı (koşuya geçerken eski adim.geri 0,75'e döner; 0: eski) · kalTut salınan ayağın yüksekliği kalkıştan beri en yükseği, hız düşünce ayak salınımda inmez (0: eski — kalecinin ve yavaş yürüyenin kesik hızında ayak salınımın ortasında yere değip kalkıyordu) · kosuBoy koşu adımının uzaması (3 m/sn'de 0, 5 m/sn'den hızlıda tam; 0: eski) */
      /*A9-adim*/yanEn:0.45,yanTavan:0.6,geri:0.65,kalTut:1,kosuBoy:0.06,
      /* A9 bas: basDunya başın dünyadaki dönüş hızının yumuşak tavanı (rad/sn; kök + başın köke göre hızı; 0 tavansız), basIleri başın yayına hedefin
         hızının ileri beslenme payı (0–1; 0: yay hedefi ~2/yay sn geriden izler), basKok başın hedefi çizilen köke göre (0: motorun yönüne göre),
         basSon katmanlardan sonra boyun sınırı (rad; 0 yok) — her biri 0: eski */
      /*A9-bas*/basDunya:10,basIleri:1,basKok:1,basSon:1.38,
      /* A9-govde (borç 23, üst gövde kırılması): kolSigma kol eğrisinin (omuz, dirsek) adım frekansında Gauss süzgeci (σ sn; anmEgriKazanc — yavaşta etkisiz, deparda
         ve frende üst harmonikler söner); dokItme dokunuşun adım evresi itişinin kritik sönümlü yayı (ω rad/sn; eskiden birinci derece); kolYay kolların veri ağırlığının
         kritik sönümlü yayı (ω rad/sn; a.egWk — bacaklar, eğim ve leğen eski birinci derece ağırlıkta); dokTepe bacaksız dokunuş yuvasının zarfı sin² (1; eskiden sin);
         dokDirsek top sürmede dönüş dokunuşunun bacaksız pozu dirseksiz (1; koşunun dirseği kalır); elTemas markajda el temasının ve kutudaki itişmenin uzaklığa göre
         geçiş aralığı (m; yan yuva sönükken seçilir; eskiden aç-kapa); govdeIvme gövde eğimi ve yatışının kaynağı olan çizilen ivmenin kritik sönümlü yayı (ω rad/sn;
         eskiden birinci derece 6/sn) — her biri 0: eski */
      /*A9-govde*/kolSigma:0.025,dokItme:20,kolYay:10,dokTepe:1,dokDirsek:1,elTemas:0.3,govdeIvme:12,
      /* A9-vurus (borç 38): vkSurek — son adımda destek ayağı önceki karenin yerinden, hızıyla ve yüksekliğinden sürer (Hermite; eskiden yerden ve durağan başlıyordu, havadaki ayak karede yere çekiliyordu);
         vkGec — son adım bundan kısaysa (sn) destek ayağı temastan tD önce değil, en geç 0,02 sn önce basar; vkUzan — basış yeri gövdenin bu kadar önündeyse (m) ayak gövde yetişene dek havada bekler
         (hızlı koşuda bacak gerilip diz açılıyordu); ikYan — bacak IK'sında uyluğun yana açılması bu yan erişim oranından sonra yumuşakça doyar (asin ±90°'de atlıyordu) — her biri 0: eski */
      /*A9-vurus*/vkSurek:1,vkGec:0.2,vkUzan:0.4,ikYan:0.85,
      /* A9-pivot (borç 36; alıştan sonra yerdeki ayağın kayması): destek — alışta destek bacağının kanalları hep pozdan çıkar (A8'de yalnız alışın başında yerdeyse;
         uçuştaki destek ayağı poz tutarken basıp kayıyordu); capaIK — adım döngüsünde çapadaki ayağı yalnız alış ve dokunuş yuvaları (kontrol, kontrol2, kontrolB,
         kontrol2B, dokun) tutuyorsa uyluk ve diz IK'ya kalır (burulma pozdan kalır, IK onu hesaba katar; bırakış başlarken ayak çizildiği yere çivilenir, poz
         havada tutuyorduysa capaIK 1/sn hızla yere iner), ayak kalkınca pozun payı aynı hızla geri gelir (0: kapalı) — A9-0: alış penceresinde kayan karelerin
         %75'inde bu yuvalar yerdeki bacağı tutuyordu (tutmadığında kayma %5) */
      /*A9-pivot*/destek:1,capaIK:20,
      /* A9-vurus2 (borç 38; A9b, koşu döngüsünün kaynağı): salIK — salınan bacağın IK uzanması (kalça → taban) veri dizinin ileri kinematiğindeki uzanmayı aşmaz (koşuda,
         veri yolunda; ağırlık 0–1): uzun çizilen duruş, adım uçlarının kaydırması ve duruşun çapası hedefi bacağın erişiminin dışına itiyor, yumuşak IK dizi geç
         salınımda karede 20–30° açıp kalkıştan sonra düz tutuyordu (vuruşa yaklaşmada da: evre 1); yön aynı, uyluk hedefe döner — 0: eski */
      /* salYan (m): salınımda (koşuda) uyluğun yana açılması √(aa² + salYan²)'den — bükük dizde (aa: bacağın uyluk eksenindeki payı, ~0,2) yanal hedef payı uyluğu
         karede 20–40° yana açıp kapatıyordu (çapraz koşu, vuruşa yaklaşma) — 0: eski */
      /*A9-vurus2*/salIK:1,salYan:0.25,
      /* A9-vurus3 (borç 38; A9b, vuruş penceresinin güvenlik tavanı — kök salIK/salYanda): vkHiz — vuruş penceresinde (hazırlıktan çıkışa) yerde olmayan bacağın dizi en çok vkHiz rad/sn döner (3 m/sn'ye dek; 8 m/sn'de ×1,5), uyluk 0,8'i,
         yana açma 0,6'sı, aşağı salınımda vuran bacak ×2,5; temas, takip ve yerdeki bacak sınırsız (anmVkHiz) — 0: eski */
      /*A9-vurus3*/vkHiz:15,
      /*A9-son*/z:0},
    /* Z2e (2026-10-19; duran topların evreli sahnesi, FUTBOL_KUTUPHANESI §12.2 Z2, gerçekçilik planı Ek G5/G7) — her anahtar 0'da eski çizim (tetikler motordan):
       sprey hakemin spreyi (olay sprey: 'top' topun yanında çömelme, köpük topun önünde yarım yay; 'cizgi' eğilip yürüme, köpük barajın çizgisi; sprey kutusu
       elde yalnız sıkarken), spreyOmur köpüğün ömrü (sn, maç saati), spreySolma son kaç saniyede solar; sayim hakemin 5 sn sayımı (olay sayim: kol dik, el açık;
       süre bitince ya da kullanımda iner); yatan yatan barajcı (rol 'yatan': barajın arkasında yan yatış, yüzü topa; vuruştaki kalkışa yumuşak geçiş),
       yatanSure yere yatışın süresi (sn); bakis duran topu kullananın başı mac.durus.bakis'e ve topa sırayla döner (0,8–1,5 sn); kolHedef hedefli kol jestinde
       (jest 'kol', hedef) kolun hedefe doğru yüksekliği (rad, yatayın üstü; 0: eski dik kol); yayKalca yay koşusunda (duran topta, koşunun vuruş yönüne açısı vuran
       ayağın ters yanından) kalçanın açılma payı (rad/rad; göğüs 0,6'sı karşıya); tacPres taçta markajcının alçak yan duruşu (rol tacMarkaj, alıcıya dönük);
       tacPerde taçta atana 2 m'deki perdenin açık kolları ve yaylanması; istek alıcının topu istemesi (rol taç alıcısı, istek: el aşağı ileri, önünü gösterir);
       spreyBirak (K1, 2026-10-20) motor gövdeyi spreyden çevirince (olayın zamanı, js/mac-durantop.js DT_SPREY.don; 'cizgi'de topa) elin hedefi, kol, gövde ve
       baş kaç saniyede bırakır (sn; 0: bırakış yok, el çizginin ucunda zarfla söner) */
    z2:{sprey:1,spreyOmur:45,spreySolma:15,sayim:1,yatan:1,yatanSure:0.8,bakis:1,kolHedef:1,yayKalca:0.6,tacPres:1,tacPerde:1,istek:1,spreyBirak:0.12},
    /* Z2e: hakem spreyinin köpüğü ve kutusunun rengi */
    z2Renk:{kopuk:0xf3f3ee,kutu:0xe4e8ec},
    /* S1 (2026-10-20; FUTBOL_KUTUPHANESI §12.15, kutuphane/L-sahne-protokolleri.md): sahne protokollerinin çizimi (tetikler motordan, js/mac-sahne.js) —
       duduk seremonili düdüğün işaret süresi (sn; olay 'duduk' v.seremoni: barajlı serbest vuruş, penaltı, kart sonrası, santra; 0: eski 0,5 sn);
       defterRenk hakemin not defterinin rengi (S1d ve S1c'nin 'not' eylemi, js/mac-sahnesi.js DEFTER). Alanların anahtarları (serbest, kart, kaptan,
       bosalt, gol, rutin …) kendi alt adımında eklenir; her biri 0'da eski çizim.
       S1a (seremonili barajlı serbest vuruş; olay 'seremoni', kalecinin jesti 'yonlendir', baraj üyesinin g.dizik): serbest 1 — hakemin "düdüğü bekle"
       (dudukBekle, 1,1 sn) ve "geri it" (geriIt, 1,0 sn) işaretleri, kalecinin yönlendirmesi, kaosta baraj pozunun kalkması, hakem restart yerinde
       dururken saat bakışının bastırılması; 0'da hiçbiri çizilmez. itHz geri itmede dirseklerin açılıp kapanma sıklığı (Hz; iki itme), yonHz ve
       yonSalinim kalecinin yönlendiren kolunun sağa sola sallanması (Hz, rad), yonTh kolun yatayın üstündeki açısı (rad).
       S1d (kart sahnesi; olaylar 'kartSahne', 'kaptanIsareti' kaynak 'kart', hakem eylemleri 'kart' ve 'not'): kart 1 — yaklaşırken "yerinde kal" (durdur)
       ya da çağırma işareti motorun evresiyle, kaptan işareti (kaptanCapraz, kaptanDur), ikinci sarıda kolun inip kalkması, deftere yazma (not) ve sol
       eldeki DEFTER, teknik direktörün itirazı kartın gösterildiği anda; 0'da eski çizim ('kart' olayında 3 m'den uzaksa çağırma, defter yok).
       S1b (penaltı sahnesi; olaylar 'penaltiSahne', 'kaptanIsareti' kaynak 'penalti'): kaptan 1 — kaptan işareti (kaptanCapraz, kaptanDur); bosalt 1 — kutuyu
       boşaltma işareti (1,6 sn); cizgi 1 — hazırda kaleciye çizgiyi gösterme ('yon', 0,9 sn) ve son yerinde saat bakışının bastırılması; goster faulde noktayı
       gösteren kolun süresi (sn; eski 1,6). 0'da eski çizim.
       S1c (gol sonrası; motor this.celeb: c.s1, c.sc, c.tur, c.es, c.cift, c.hk, c.evre; olaylar 'goal' {sevincT}, 'kickoff' {dudukOnce}): gol nesnesi —
       not 1: hakemin santraya yürürken deftere yazması (S1d'nin 'not' pozu ve DEFTER'i; kart 0 ise kapalı) ve gol evresinde santra yerinde saatine bakması;
       sevincTur 1: golcünün sevinç çeşidi koşu türünden (pasçı: sevGoster, iki kol pasöre; tribün: el kulakta ya da kollar; yerinde: kollar ya da sakin;
       kulübe: yumruk; köşe: profilden), sevincPay arkadaşların çeşit payları [kollar, yumruk, el kulakta, uçak, göğe işaret] (L.3); esli 1: eşli sevinçte
       golcünün eşi aynı pozu aynalı yapar; cift 1: uzaktaki ikililer sarılır; uzgunSure yenen takımın üzgün pozu en çok bu kadar (sn), sonra yalnız
       dururken; goster 1: santrada ikinci düdük işareti yok (düdük golDuduk'ta). 0'da eski çizim.
       S1e (kullananın rutini; motor du.kr: bakis, evre, okuSon; jest 'kolIki'): rutin 1 — rutinli kullananın başı kr.bakis'e döner (geri geri yürürken top,
       kutuya bakışta ön direkten arka direğe, el işaretinde arkadaş, okumada kaleci; okumanın son 0,35 sn'sinde top), rutin sürerken kıpırtı (bakınma) başlamaz;
       kolIki 1 — iki kol kodu (jestKolIki; 0'da tek kol). 0'da eski çizim */
    s1:{duduk:0.8,defterRenk:0x22262b,serbest:1,itHz:2.5,yonHz:2.5,yonSalinim:0.2,yonTh:0.15,kart:1,kaptan:1,bosalt:1,cizgi:1,goster:2.4,
      gol:{not:1,sevincTur:1,sevincPay:[0.30,0.27,0.16,0.12,0.15],esli:1,cift:1,uzgunSure:6,goster:1},rutin:1,kolIki:1},
    /* K1h (2026-10-20; kullanıcı notu 7 "topla giderken ayağı havada kaldı, ~2 sn topla çizgi şeklinde kaydı"): topu ayağın altında bekletme pozunun (tavır 'bekle'
       ve çalımda dur-kalk hazırlığı; ANM_POZ.bekle iki bacağı da tutar: taban topun üstünde, destek bacağı dik) ağırlığı çizilen hızdan — bekleHiz[0] m/sn'ye dek
       tam, bekleHiz[1]'de 0 (yumuşak); kalan payı adım döngüsü alır (bacak IK'sı, adım boyu, veri eğrisi). null: eski (hızdan bağımsız tam ağırlık; motor tavrı
       4–7 m/sn'den yavaşlarken de verdiğinden ayak top hizasında havada kalıp destek ayağı ve gövde topla kayıyordu) */
    bekleHiz:[0.8,1.5],
    /* K1 (2026-10-20; FUTBOL_KUTUPHANESI §12.13 kullanıcı notu, kutuphane/L L.2): penaltıda çizgideki kalecinin bekleyişi (js/animasyon.js anmPenaltiKaleci;
       tetik motorun penaltiKaleciBakis'i; MOTOR_AYAR.penaltiBakis 0 iken de kapalı) — acik 0'da eski çizim (bekleyiş katmanı: eller belde, bakınma, eldiven);
       dik hazır duruşun eğilme ve diz payı (1 tam kaleciHazir); kolAc kolların iki yana açılması (rad, jestin tepesinde), kolInis kolun önden yana inişi (rad),
       dirsek dirseğin açılması (rad); ilk ilk jestin varıştan gecikmesi (×0,5–1,5 sn), aralik jestler arası (sn), sure bir açıp kapamanın süresi (sn);
       salinim ağırlık aktarımında kalçanın yatışı (rad), salinimSure bir gidip gelişin süresi (sn); tut tetiğin histerezisi (sn: kısa düşüşte bekleyiş sürer) */
    penaltiKaleci:{acik:1,dik:0.6,kolAc:0.75,kolInis:0.2,dirsek:0.5,ilk:1.5,aralik:[2.4,4.2],sure:1.4,salinim:0.035,salinimSure:2.8,tut:0.3},
    /* A7 (2026-10-17): hareket verisinin eğrileri (js/hareket-egrileri.js) — acik 0 eski elle yazılmış eğriler; ayak (salınan ayağın yolu, duruşun ortası,
       koşuda temas payı), kalca (yükseklik), egim (koşu eğimi), legen (leğen ve omuz hattının salınımı), kol (omuz, dirsek) ağırlıkları; kolOlcek omuz
       salınımının veriye oranı (A7a taraması: ×0,85 omuzda veriden 2,4° uzak, 1,0); depar 4,5 m/sn'nin üstünde uzatma bandının dozu (A7a taraması: 0,5
       üst gövde sıçramasını 36,8 → 25,2/oyuncu·dk, A6 26,7); aciklik salınımın ortasında tabanın en az yüksekliği (model birimi) */
    egri:{acik:1,ayak:1,kalca:1,egim:1,legen:1,kol:1,kolOlcek:1,depar:0.5,aciklik:0.07,
      /* A7b: top sürme — adım boyu çarpanı, koşu eğimine ek (rad), kol salınımından düşülen pay */
      surus:{adim:0.8,egim:0.06,kol:0.3},
      /* A7c: dolu vuruşta geri salınım, takip ve destek dizi veriden (0: eski) */
      vurus:1}
  },


  /* Gece maçında her projektör için bir gölge (90'ların dörtlü gölgesi): oyuncunun silüeti ışıktan zemine izdüşer (js/golgeler.js).
     opaklik: tek bir ışığın gölgesinin koyuluğu. Projektörlerin yeri stadyum tarifindedir. */
  golge:{opaklik:0.2},

  /* Başkanın bedeni (ön plan katmanı, js/baskan.js): masa, takım elbise, ten, saat renkleri.
     aci: ön plan kamerasının görüş açısı; dinlenmeEgimi: bakışın sahaya dinlenirken eğimi (radyan). A akışı (2026-10-03): bakış topa odaklıdır
     (eğim orta sahada ≈ -0,22, uzak taçta ≈ -0,13); dinlenmeEgimi uzak tarafa yakın seçildi, egimUst: ön planın yukarı dönüşünün sınırı (radyan;
     masa en çok bu kadar iner, telefon ekranda kalır), govdeHiz: ön planın bakışa yetişme hızı (radyan/sn; telefon kıpırdamadan tıklanır). */
  /* stada varış ve locaya giriş (N11, kullanıcı kararı 2026-10-04; 2.8T'nin yerini aldı; js/loca-giris.js). aci: yürürken görüş açısı,
     acilisAci: karanlıktan açılışta (geniş; yürürken aci'ya daralır), elAci: tokalaşırken (karar anı); goz: ayakta göz yüksekliği (m); kapi: locanın arka duvarındaki kapı; merdiven: kapının ardındaki
     sahanlık ve son kat basamakları; dis: başkanın binanın sokak kapısının önünde başladığı uzaklık (m); yol: ortak yürüyüşün hızı ve
     merdivendeki hızı (js/yuruyus.js yrYolKur); sure: karanlıktan açılış, ilk adıma kadar bekleyiş, kapıda kesme (kararma, siyah, açılma),
     rakip başkanın kalkışı, tepki, geri adım, oturma ve raf (sn; oturduktan sonra ön plandaki masa ve ellerin gelişi, ad N5'ten); rakip: rakip başkanın koltuğu (x), tokalaşma mesafesi, görünüşü (diğer
     loca kişileriyle aynı insan ölçeği); kalabalik: önde iki yönetici (x), arkada basamak (ön kenardan uzaklık, yükseklik) ve konuklar (x);
     sonra: rakip başkan sonra gelirse başkan oturduktan kaç sn sonra (aralık; takımlar ısınmaya çıkmadan, senaryo sn sinir'den önce).
     TEST değerleri */
  locaGiris:{tepeGecikme:2,aci:46,acilisAci:58,elAci:42,goz:1.62,kapi:{x:-3.0,en:1.0,boy:2.15},merdiven:{basamak:8,yukseklik:0.17,derinlik:0.3,sahanlik:1.4},
    dis:6.5,yol:{hiz:1.3,viraj:0.4,ivme:1.0,merdivenHiz:0.62},
    sure:{acilis:1.6,bekle:1.2,kesmeKarar:0.8,kesmeSiyah:0.25,kesmeAc:0.45,kalk:1.3,tepki:1.5,geri:1.0,otur:2.2,raf:0.5,selamKalk:1.6},
    rakip:{x:1.5,mesafe:1.35,gorunus:{ten:2,sac:'kisa',sacRenk:'#8a8680',biyik:true,boy:1.0,yapi:1.0}},
    kalabalik:{on:[-1.4,-2.6],arka:{geri:2.1,yukseklik:0.35,x:[-1.9,-0.6,0.7,2.0,3.3]}},
    sonra:[8,20],sinir:44,
    renk:{cerceve:0xd8d2c4,kapi:0x6a4a2c,ic:0x8a8274,lamba:0xfff0d0,pencere:0x0e1420,koltuk:0x4a1e18,basamak:0x5a5b60}},
  /* karar anı ekranı (N12, js/ekran-an.js): kenar kararması (0–1), kartların yerine oturma süresi (süre ondan sonra başlar), seçimden sonra
     kartın kalış süresi, son kaç saniyede çubuk amber olur (sn); yazı büyüklüğü (cqw; normal, büyük). TEST değerleri */
  an:{kararma:0.35,giris:0.4,sonra:0.9,amber:1.5,yazi:{normal:1.3,buyuk:1.6}},
  /* maç sonu kartı (F2, 2026-10-23; js/ekran-mac-sonu.js): kartSn düdükten kartın açılmasına motor saniyesi (sevinç ve çöküş izlenir; "Maçı bitir
     (TEST)" ile bitince hemen), kenar kararması (0–1), yazı büyüklüğü (cqw; normal, büyük). TEST değerleri */
  macSonu:{kartSn:8,kararma:0.3,yazi:{normal:1.3,buyuk:1.6}},
  /* onMasa (K1, kullanıcı kararı 2026-10-20; kullanıcının 1. maç notu "masa tüm ekranı kaplamasın, önde kare ayaklı bir masa gözüksün"; N5'in
     2,6 m'lik rafının ve altındaki ön duvarın yerini aldı): başkanın önündeki küçük masa, ön plan kamerasına göre metre. en × derinlik = tabla,
     uzak = tablanın yakın kenarının gözden uzaklığı, y = tablanın üst yüzeyi (gözün altında), kalinlik = tabla, etek = tablanın altındaki
     kuşağın yüksekliği, etekKalinlik = kuşağın kalınlığı, boy = masanın yerden yüksekliği (göz yerden 1,2 m), ayak = kare kesitli ayağın
     kenarı, ayakIc = ayağın tabla kenarından içerisi (tabla ayakların dışına taşar; eller köşelerde ayakların üstünde durur, kollar ayakların
     dışından iner), ayakRenk = ayak ve etek; panel = uzak ayakların arasında etekten yere yakın inen ön panel (renk, kalınlık, yerden boşluk;
     ayakların arası locanın dışını, ana tribünü göstermez; tablanın altının gölgesi gibi koyu); serit = uzak kenardaki pirinç şeridin
     yüksekliği (üstü tablanın 3 mm üstünde) ve derinliği; tel = telefonun masadaki yeri (x, yakın kenardan içerisi, y ekseninde dönüş rad);
     telAlan = telefonun çizilmeyen tıklama kutusu (en, yükseklik, boy). Tabla odadaki masayla aynı ceviz dokudadır (masa, masaKoyu, masaAcik).
     K1i (2026-10-20, bağımsız inceleme): ilk K1 masası (0,9 × 0,5 m, 1,8 m ötede) ekranın alttan %27'sine çıkıp yakın yan çizgiyi kesiyor,
     ayaklarının arasından ana tribünün seyircisi görünüyor, uzaktaki ellere inen ön kollar ayaklara paralel dikey direkler gibi okunuyordu.
     Ekran payı (oturuşta; 50° dikey, 4:3: yatayda yarım genişlik 0,622·uzaklık, dikeyde 0,466·uzaklık): yakın kenar ekran genişliğinin
     %39,6'sı (0,64 / (2·0,622·1,3)), uzak kenar %33; tabla ekranın alttan %10,4–17,2'sinde (720 satırda 596–645; ≤ %18 kapısı), tablanın
     altı %7,9'da; ayakların üst 0,13–0,17 m'si görünür (yakın ve uzak ayak ekranda üst üste biner, yanda boşluk kalmaz), uçları ekranın çok
     altındadır. Ayakta (kamera +0,34 yukarı, 0,1 geri) masa ekranın altından çıkar (yarı kalkışta şerit alttan %7). Telefon ekranda ~39×25
     piksel (N5 rafında 57×43, ilk K1 masasında 42×20). 0,64 m: telefon ve iki el sığan küçük masa; 1,3 m eller N5 rafındaki uzaklıktadır
     (1,24 m), ön kollar alt köşelerden doğal perspektifle gelir.
     govde (Z1, kullanıcı kararı 2026-10-19): ön planın bakışı izleme çarpanları [eğim, sapma] — 0: masa ve telefon ekranda sabit (eskiden 0,22 ve 0,25: baş dönünce raf kayıyordu) */
  baskan:{govde:[0,0],aci:50,masa:'#5a3620',masaKoyu:'#4a2c18',masaAcik:'#6a4228',pirinc:0xb89a4a,sumen:0x5a1a1c,
    onMasa:{en:0.64,derinlik:0.27,uzak:1.3,y:-0.48,kalinlik:0.03,etek:0.04,etekKalinlik:0.02,boy:0.72,ayak:0.045,ayakIc:0.07,ayakRenk:'#4a2c18',
      panel:{renk:'#26160d',kalinlik:0.015,yerden:0.2},serit:[0.012,0.02],tel:[0.03,0.13,-0.3],telAlan:[0.1,0.06,0.19]},
    takim:0x27324e,ten:0xd2a07a,saat:0xd4af37,dinlenmeEgimi:-0.15,egimUst:0.02,govdeHiz:0.05},

  /* Başkan bölümü: halı, ahşap bölmeler, başkanın koltuğu */
  baskanBolumu:{hali:0x5e1a1c,bolme:0x3a2618,bolmeUst:0x6a4a2c,masa:0x4a2c18,masaUst:0x6a4228,koltuk:'#3a0e0c'},

  /* Stat yapı malzemeleri (tribün betonu, çatı, direk, toprak pist, set, kötü zemin renkleri) */
  stadyum:{
    beton:0x6d6e72,betonKoyu:0x4d4e53,yanDuvar:0x5a5b60,basamak:0x66665f,set:0x4c5a2c,cati:0x8c9096,catiKenar:0x3c3f44,direk:0x4a4d52,disZemin:0x232428,
    toprakPist:'#6e4a33',pistsizKenar:'#2a6526',kuruCim:'#8f8a44',camur:'78,56,34',
    /* P2 (2026-10-21 gece): yamaç basamakları ve kenarı (kaya, projektörle aydınlanır); reklamPay/telPay: panoların ve tel örgünün tribün önünden
       sahaya doğru uzaklığı (m). TEST değerleri */
    yamac:0x6b6457,yamacKenar:0x57514a,reklamPay:1.2,telPay:0.5
  },
  /* stadın çevresi (N8, js/stadyum-cevre.js): gündüz (balkon, pencere; Lambert ile aydınlanır) ve gece (maç; ışıksız koyu renkler, yanık pencere
     ve lamba). Listelerde renk karmayla seçilir. kaya: Braga esinli yamaç; duvar/kiremit: evler; tente: dükkân tenteleri; tepe: ufuktaki iki sıra.
     yamacIsik: gece projektörün yamacın alt basamaklarına vurması (alttan üste parlaklık çarpanı). pencereOrani: gece yanık pencerelerin payı. TEST değerleri */
  cevre:{
    gunduz:{kaya:['#a39a8a','#958c7c','#b0a796','#8a8272','#9c9080'],cali:'#6c7a40',cam:'#3f5a32',govde:'#5a4232',kavak:'#5d7a3c',
      duvar:['#e8e0cc','#d9c9a8','#efe6d2','#cdb892','#e4d4b4','#d8cfc0'],kiremit:['#a4553a','#b0603f','#94492f','#9c5a3a'],pencere:'#4a5866',kapi:'#5a3e2a',
      cevreDuvar:'#b8b2a4',duvarUst:'#9e988a',asfalt:'#5e5e60',kaldirim:'#a8a49a',cizgi:'#e8e6dc',ic:'#8f8a78',tarla:['#9a9560','#7d8c4c','#b0a46e','#6f7f45'],
      tasDuvar:'#a09a88',tepeYakin:'#6f7d50',tepeUzak:'#94a3a8',arac:['#b33a2e','#2e4f8a','#d8d4c8','#3a3d42','#8a8f94'],tente:['#b4241c','#2c6f28','#22347a','#c98a1c'],
      vitrin:'#3c4650',direk:'#5a5d62',lamba:'#d8d4c4',bina:'#d8cfba',binaKoyu:'#b9ae96',agiz:'#141416',tabela:'#2a2c30',tabelaYazi:'#f2ede2',kulup:'#c8281e',kulupAcik:'#f2ede2'},
    gece:{kaya:['#34332f','#2e2d2a','#3a3834','#2a2927','#33312c'],cali:'#151b10',cam:'#0f150e',govde:'#16120f',kavak:'#111810',
      duvar:['#2c2925','#2a2620','#302c26','#27231e','#2d2923','#2b2824'],kiremit:['#2c1b15','#301d16','#27170f','#2a1a10'],pencere:'#15171c',kapi:'#1a140f',
      cevreDuvar:'#3c3c3e',duvarUst:'#303032',asfalt:'#18191c',kaldirim:'#2c2d30',cizgi:'#5c5c5a',ic:'#262624',tarla:['#1b1d15','#181c13','#1f1f16','#161a12'],
      tasDuvar:'#2b2a27',tepeYakin:'#07090b',tepeUzak:'#0a0d13',arac:['#3a1512','#141e33','#4a4844','#18191c','#2e3134'],tente:['#3a120f','#0f2410','#0e1530','#3a2a0c'],
      vitrin:'#20242a',direk:'#2a2c30',lamba:'#fff2cc',bina:'#3c3832',binaKoyu:'#2e2a25',agiz:'#060607',tabela:'#1c1d20',tabelaYazi:'#e8e0cc',kulup:'#7a1a14',kulupAcik:'#8a8478',
      pencereIsik:'#ffd98a',vitrinIsik:'#fff0c8',lambaIsik:0xffd9a0,yamacIsik:[1.7,1.0],pencereOrani:0.35}
  },

  /* tünel ağzı ve yedek kulübeleri */
  kulube:{duvar:0x2c2f36,cam:0xa8c4d8,bank:0x3a3d44,serit:0xc8281e},

  tabela:{zemin:'#140c04',ampul:'#ffb530',ikincil:'#ffd98a',elleZemin:'#1d2a22',elleYazi:'#f0ece0'},
  pankart:{zemin:'#efe9dc',yazi:'#c8281e'},

  /* Maç programı (js/ekran-mac-oncesi.js, 2.8E): açık kâğıt tonlarında basılı program. hazirlikSn: "Maça geç" etkinleşmeden önceki en kısa
     etkin hazırlık süresi (TEST değeri). renk: ekran bunları CSS değişkeni (--m-ad) olarak yazar; ortak .oe- bileşenleri bu değişkenleri kullanır. */
  program:{hazirlikSn:10,sayfaSn:5,renk:{zemin:'#f4eedf',panel:'#fbf7ec',panelUst:'#e9e0cb',cizgi:'#c9b994',yazi:'#26221c',soluk:'#6d6353',vurgu:'#a5620a',vurguZemin:'#ffb530',
    kulup:'#b4241c',rakip:'#2f4f9a',galibiyet:'#2c6f28',beraberlik:'#8a8478',maglubiyet:'#b4241c',sari:'#e0b81a',kirmizi:'#b4241c',
    cim:'#3a8c33',cimAcik:'#44973c',sahaCizgi:'#f2f2ea',pist:'#a85f45',tribun:'#9c968a',beton:'#b9b5ad',set:'#7d8b52',cati:'#5f6268',golge:'rgba(40,28,12,.28)'}},

  /* Başkan odası (js/oda.js): aydınlık, gün ışığı alan oda; başkanın masasından bakış. Ölçüler metre.
     goz/bakis: kameranın yeri ve dinlenirken baktığı nokta; odakAci: bir nesneye odaklanınca görüş açısı;
     odakKayma: panel sağda açıkken nesne solda görünsün diye bakışın sağa kayması (metre).
     gunIsigi: saate göre [saat, güç, renk] — sabah, öğle ve akşam odada hissedilsin diye. vurguCizgi: üzerine gelinen nesnenin amber
     çerçevesinin kalınlığı (ızgara pikseli; js/goruntu.js kalinCizgi). TEST değerleri. */
  oda:{aci:56,odakAci:52,odakKayma:0.5,goz:[0,1.28,0.62],bakis:[0,0.95,-1.4],arkaPlan:0xd8e4ea,
    duvar:0xece4d2,lambri:0xcdbb98,supurgelik:0x8a6a44,tavan:0xf6f1e6,zemin:'#b08252',zeminKoyu:'#966a3e',zeminAcik:'#c0935f',hali:0x8e2f28,haliKenar:0xd8c08a,
    cerceve:0xf4f1e8,gokUst:'#9fd0ee',gokAlt:'#e8f4f8',cim:'#3a8c33',tribun:'#8a8c90',direk:'#5a5d62',
    dolap:0x7a5634,dolapKoyu:0x5e4026,koltuk:0x7a2420,koltukAyak:0x3a2a1c,lamba:0x2e5a46,lambaIc:0xfff2c8,
    telefon:0x1a1b1f,telefonEkran:'#10202c',telefonHaber:'#ffb530',defter:'#f3ecdc',defterCizgi:'#c9bfa8',defterYazi:'#2a2622',defterSerit:'#c8281e',
    dosya:0xc8281e,dosyaEtiket:0xf2ede2,kagit:0xf6f1e4,kalemlik:0x2a2c33,saatKasa:0x3a2a1c,saatYuz:0xf4f1e8,saatIbre:0x1c1a18,
    flama:'#c8281e',flamaSerit:'#f2ede2',vurgu:0xffb530,vurguCizgi:1.5,gunesLekesi:0xfff1c4,gazete:'#e9e4d6',notKagidi:'#f2d96a',iskele:'#4a3a2a',iskeleBranda:'#3a6ea8',
    ortam:{renk:0xfff3df,guc:0.62},gunes:{renk:0xfff0cf,konum:[-3.2,3.6,-2.2]},dolgu:{renk:0xdfe8ff,guc:0.28,konum:[2.5,2,2]},
    gunIsigi:[[6,0.25,0xffc890],[9,0.62,0xfff0cf],[13,0.78,0xfffaf0],[17,0.6,0xffe0b0],[19.5,0.28,0xff9a5a],[22,0.1,0x6a78a8]],
    /* balkon kapısı (uzak duvarda, x0–x1 arası, h yüksekliğinde; tıklanır, üstünde levha) ve pencere boşluğu (pencere; balkon kuruluysa dışarı
       gerçekten görünür). kapiCam: kapının camı */
    kapi:{x0:0.9,x1:1.75,h:2.1,renk:0xf4f1e8,cam:0xbfe0f2,kol:0xb89a4a},pencere:{x0:-2.2,x1:-0.3,y0:0.6,y1:2.245},levha:'#2a2c30',levhaYazi:'#f2ede2',
    /* yürüyüş (2.8D, 2.8R, N6): yol = ayakta göz hizasında yürüme noktaları (koltuğun yanından masanın ucuna, kapıya, balkon sandalyesinin yanına);
       noktalar köşeleri yuvarlatılmış bir eğriyle (Catmull-Rom) birleşir. adim: düzlükteki yürüme hızı (m/sn), dönüşte yavaşlama (viraj: 1 rad/m'lik
       dönüşte hız 1/(1+viraj) katına iner), hızlanma/yavaşlama ivmesi (m/sn²). Kalkış, oturma, adım ve el ayarları ortak STIL.yuruyus'tadır
       (N6, kullanıcı kararı 2026-10-04). TEST değerleri */
    yol:[[0.58,1.62,0.58],[1.42,1.62,0.18],[1.36,1.62,-2.7],[1.3,1.62,-4.15],[-0.3,1.62,-4.6]],
    adim:{hiz:1.5,viraj:0.35,ivme:1.1},
    /* arka duvar (2.8R): başkanın koltuğunun arkası (z). Masadan bakınca görünmez; kalkınca ve odaya dönerken görünür.
       koltuk: yüksek arkalıklı başkan koltuğu (deri, ayak); kalkarken geriye itilir (itme, m). pano: kulübün arması ve adı (ahşap çerçeve).
       bayrak: köşedeki direkte kulüp bayrağı. TEST değerleri */
    arkaDuvarZ:2.3,
    baskanKoltugu:{z:0.86,deri:0x4a1e18,dikis:0x6a2c22,ayak:0x2a2c33,itme:0.32},
    pano:{x:-0.7,y:1.78,en:1.25,boy:0.95,cerceve:0x6a4a2c,zemin:'#f2ede2'},
    bayrak:{x:1.7,z:2.0,direk:0xb89a4a}},

  /* Başkanın beden hareketi (N6, kullanıcı kararı 2026-10-04; js/yuruyus.js): odada, balkonda ve locaya girişte ortak.
     yonel: otururken başın yola dönmesi (sn). kalk: sure (sn), egilPay = öne eğilmenin bittiği an (0–1), adimPay = yerine adım atmanın başladığı an,
     egil = gözün öne gittiği yol (m), cok = eğilirken gözün alçaldığı (m). otur: sure, yerPay = koltuğun önüne geçişin bittiği an, basla = alçalmanın
     başladığı, yaslan = yaslanmanın başladığı an, egil/cok = alçalırken öne eğilme (m), geri = yaslanırken geri gidilen yol (m).
     adim: boy = normal hızda adım boyu (m), hiz = o hız (m/sn), dikey = adımda gözün iniş-çıkışı (m), yanal = ağırlık aktarımı (m),
     nabiz = adım içinde ilerlemenin dalgalanması (adım boyuna oran). el: sure (sn), tut = elin nesneye vardığı an (0–1), bekle = orada kaldığı pay,
     kavis = uzanırken elin yükseldiği (m), bak = bakışın nesneye dönme payı (0–1), bas = elin çıktığı yer (göze göre: sağ, aşağı, ileri; m).
     TEST değerleri */
  yuruyus:{yonel:0.5,
    kalk:{sure:1.6,egilPay:0.36,adimPay:0.34,egil:0.18,cok:0.05},
    otur:{sure:2.2,yerPay:0.55,basla:0.25,yaslan:0.82,egil:0.1,cok:0.03,geri:0.04},
    adim:{boy:0.66,hiz:1.4,dikey:0.024,yanal:0.012,nabiz:0.012},
    el:{sure:0.85,tut:0.45,bekle:0.12,kavis:0.05,bak:0.55,bas:[0.26,-0.5,0.2]}},

  /* Balkon ve antrenman sahası (js/balkon.js): odanın dışı, gündüz. Ölçüler metre; saha merkezi oda koordinatındadır (balkon sahanın üstünde,
     ana tribünün tepesinde). aci/bakis: balkondaki sandalyeden bakış. TEST değerleri. */
  balkon:{aci:46,odakAci:42,goz:[-0.55,1.3,-4.45],bakis:[0,-7,-47],
    saha:[0,-7,-58],gokUst:[0.42,0.66,0.9],gokAlt:[0.86,0.93,0.96],disZemin:0x8a8672,zemin:0x9a958a,korkuluk:0x3a3d44,masa:0x6a4228,masaAyak:0x2a2c33,sandalye:0x7a2420,
    beton:0x9a9b9e,betonKoyu:0x7d7e82,koltuk:0xb4322a,koltukAcik:0xe6e0d2,cati:0x8c9096,direk:0x5a5d62,kalePost:0xf4f4f0,
    agac:0x3f6a34,golge:0.22,koni:0xff7a1e,yelek:'#e8c21e',
    /* gözlemde bir oyun dakikasının gerçek süresi, ms (2.8B; TEST değeri: 120 dakikalık antrenman ≈ 8,4 sn) */
    gozlemDakikaMs:70,
    /* 2.8D: saha konumu (saha) ve bakış tariften hesaplanır (js/balkon.js BLK_STAT); korkulukZ balkonun ön kenarı */
    korkulukZ:-5.7,
    /* balkon masası [x, z] (2.8R): telefon üstündedir */
    telefonMasa:[-0.72,-5.48],duvar:0xc9bfae,iskele:0x8a8f96,iskeleBranda:0x3d6a8a,iskeleTorba:0xc9b98f,iskeleSerit:0xd8402a},

  /* Açık renkli yönetim arayüzü (js/ekran-oda.js): kâğıt zemin, koyu okunur metin, ahşap çizgi, ölçülü kulüp rengi.
     Ekran bu renkleri CSS değişkeni (--k-ad) olarak yazar. yaziBoyu: karenin genişliğine oranla yazı (cqw). TEST değerleri. */
  kagit:{zemin:'#f4eedf',zeminKoyu:'#e9e0cb',serit:'#fbf7ec',cizgi:'#c9b994',yazi:'#26221c',soluk:'#6d6353',vurgu:'#a5620a',vurguZemin:'#ffb530',
    kulup:'#b4241c',kirmizi:'#b4241c',yesil:'#2c6f28',golge:'rgba(40,28,12,.28)',yaziBoyu:{normal:1.42,buyuk:1.72},
    /* telefon (2.8I): açık tonlu cihaz; gelen/giden baloncuk ve ana ekran simgeleri. N7 (2026-10-04): cihaz çerçevesi ve kamera adası, ana ekranın
       dikey zemini (üst, orta, alt), alttaki sabit sıranın zemini, geri/okunmamış mavisi, satır ayracı */
    telefon:{kasa:'#1d1e22',cerceve:'#34363c',ada:'#0c0c0e',ekran:'#f7f2e6',anaZemin:['#efe6d0','#f7f2e6','#f1e8d4'],sabit:'rgba(201,185,148,.42)',
      baglanti:'#22347a',ayrac:'rgba(201,185,148,.6)',gelen:'#fbf7ec',giden:'#ffd27a',gidenCizgi:'#c98a1c',mesajSimge:'#2c6f28',skorSimge:'#22347a'},
    /* dosya (2.8M, js/ekran-dosya.js): masada açılan kırmızı karton dosya; perde odayı hafif karartır */
    dosya:{perde:'rgba(24,16,8,.42)',kapak:'#a8291f',kapakKoyu:'#7a1c15',sekme:'#e9dcc0',sayfa:'#fbf6e8',cizgi:'#d8c9a6',not:'#fffdf6',atas:'#8a8f98',mavi:'#22347a'},
    /* ajanda (2.8M, js/ekran-defter.js): iki sayfalı spiral defter; kayıtlar mürekkep renginde */
    defter:{kapak:'#2c3442',sayfa:'#fbf8ef',cizgi:'#e3d9c2',spiral:'#5a5d62',kurdele:'#b4241c',murekkep:'#22347a',kayit:'#eef1fa',kayitCizgi:'#c4cbe0',secili:'#fff1c4',kart:'#fffdf6'}},

  /* Kişi portreleri (js/portre.js, 2.8I): 16×16 piksel, kodla çizilir. Tanınır kişilerin görünüşü burada sabittir; listede olmayan kişi
     kimliğinden belirlenimli görünüş alır. ten 0–2, sac: renk adı, tip: 'kisa'|'seyrek'|'kel'|'uzun'|'topuz'|'dalgali', biyik: 0 yok, 1 ince, 2 gür,
     gozluk, giysi: üst giysinin rengi, yaka: gömlek/forma rengi. Görünüş başlangıç verisidir; TEST değeri */
  portre:{
    tenler:['#f0c9a0','#d9a679','#b98257'],
    saclar:{siyah:'#1f1a17',kahve:'#5a3a22',kir:'#8f8a84',beyaz:'#d9d5cf',sari:'#c9a24a'},
    zemin:{baskan:'#c8281e',teknikDirektor:'#2c6f28',yonetici:'#22347a',yoneticiAdayi:'#6d6353',personel:'#a5620a',diger:'#6d6353'},
    kisiler:{
      'kisi-1':{ten:1,sac:'kir',tip:'kisa',biyik:2,giysi:'#2a2f3d',yaka:'#f2ede2'}              // Haluk Demirel (2.8L: diğer kişiler içerikle kaldırıldı)
    }
  },

  /* Kameralar: hedef [x,y,z], aci = dikey görüş açısı (derece).
     Maç başkanın gözünden izlenir: ana tribünün arkasındaki binada, başkanın locası. Dürbün 2026-10-07'de kullanıcı kararıyla tamamen
     kaldırıldı (ayarı da). */
  kameralar:{
    /* konum stadyum tarifindeki başkan koltuğundan gelir; goz = koltuk üstünde göz yüksekliği (metre). js/kamera.js
       Z1 (kullanıcı kararı 2026-10-19; kullanıcının 9. maç notu "kamera yakınlaşıp uzaklaşıyor, raf kayıyor"): görüş açısı maç günü boyunca SABİTTİR
       (oyunda yakınlaşma yok — eski oyunAci 21–26°, ölü topta ve maç dışında 36° yolu kalktı). aci: dikey görüş açısı — Z1'de 32°; K1 (kullanıcı
       kararı 2026-10-20, 10. maç notu "bir tık daha uzaklaşalım"): 36° (4:3'te yatayda ~47°; sabit açı kuralı sürer, yalnız değer değişti).
       olcekAci: pencere, top.butce ve egim bu açıda (32°, Z1) ayarlandı; başka bir açıda ekrandaki oranları aynı kalsın diye js/kamera.js onları
       tan(aci/2) / tan(olcekAci/2) ile çarpar (36°'de ×1,13: pencere ~±10,2° / ±5,7°, egim ~1,8°) — top ekranın aynı oranındaki pencerede ve aynı
       yükseklikte kalır. Bakış topu PENCEREYLE izler: top bakış merkezinin yatayda ±pencere[0]°, dikeyde ±pencere[1]° (olcekAci'de) içindeyken
       baş kıpırdamaz; dışına çıkınca topu pencerenin kenarına getirecek kadar döner (N4'ün "bakış hep topu izler" kuralı gevşedi: top ortada tutulmaz, geniş pencerede kalır). ileriSure:
       pencere kenarına itilen hedefin açısal hızının yumuşatma süresi (sn); yay bu hızı ileri besleme olarak alır (yoksa hızlı pasta yay sabit
       gecikmeyle geride kalıyor, top ekranın kenarına kayıyordu; akis-deneme §17: pencere bandında %76 → %99). yayOyun: oyunda bakış
       yayının açısal sıklığı (1/sn), hizSiniri: bakışın en hızlı dönüşü (derece/sn) — ikisi de yavaş baş dönüşü için düşük; yay ve sahneSinir aynısı oyun
       dışı (ilgi noktaları) için (açıyla ölçeklenmez: baş dünyada aynı hızla döner, geniş açıda görüntü ekranda biraz daha yavaş kayar). egim: oyunda
       bakışın topun ne kadar altına indiği (derece, olcekAci'de; top ekranın ortasının biraz üstünde durur — K1'den beri alttaki raf yok; dikey
       pencerenin alt ucunda bile alt ortadaki küçük masanın tablasının üstünde kalır).
       sahneEgim: oyun dışında bakışın odağın altına inme payı (uzaklığa oran; ölçeklenmez — 2.8U'dan Z1'e 36°'lik oyun dışı açıyla kullanıldı).
       asagiSinir/yukariSinir: takipte bakışın en çok aşağı/yukarı eğimi (radyan; dünyadaki sınır, ölçeklenmez). top: onde = taşıyanın önüne bakış (m), ongoru = serbest topta balistik öngörü (sn), inis = [başlangıç sn, süre sn, en çok pay] uzun
       havadan topta iniş yerine kayma, kale = son üçte birde kale ağzına kayma payı, korner = kornerde penaltı noktasına kayma payı, butce = [sapma,
       eğim] nişanın topun yönünden en çok sapması (derece, olcekAci'de). TEST değerleri (açı kullanıcı kararı) */
    /* kartIzle (S1d, 2026-10-20): kart sahnesi hakemi tutarken yaklaşmada ve kalabalıkta bakış hakemle oyuncunun ortasına (0: kapalı; js/kamera.js bakisOdagi) */
    baskan:{goz:0.78,hedef:[0,1,0],aci:36,olcekAci:32,pencere:[9,5],ileriSure:0.15,yayOyun:2.2,hizSiniri:40,yay:1.0,sahneSinir:60,kartIzle:1,
      egim:1.6,sahneEgim:0.18,asagiSinir:0.5,yukariSinir:0.12,
      top:{onde:0.6,ongoru:0.35,inis:[0.5,1.6,0.55],kale:0.25,korner:0.45,butce:[2.5,1.6]}}
  },

  /* Maçın okunurluğu (js/okunurluk.js, js/goruntu.js; A akışı, 2026-10-03): locadan uzaktaki maçın net görünmesi için çizim ayarları.
     cizgi: saha çizgilerinin üstüne ekranda sabit genişlikli şerit (acik, genislik = iç çözünürlükte piksel, opak = saydamlık (zemin kalitesiyle
     çarpılır), parlaklik = ışıklı çizgi rengine çarpan, y = zeminden yükseklik m). topEnAz: topun ekrandaki en küçük çapı (maç ızgarasında
     piksel; daha uzakta büyütülür), topEnCok: en çok büyütme katı. topLeke: havadaki topun altındaki koyu leke (opak, boy = top yarıçapına oran, yukseklik = top
     yerden bu kadar (m) yükselince). parlama: oyuncu dokusunun kendi renginden ışıma payı (gece ışığında koyu leke olmasınlar).
     disCizgi: oyuncu ve topun çevresinde 1 piksellik koyu çizgi denemesi (karşılaştırma için; varsayılan kapalı). TEST değerleri */
  okunurluk:{cizgi:{acik:true,genislik:1,opak:0.7,parlaklik:1,y:0.02},topEnAz:4.5,topEnCok:3,topLeke:{opak:0.5,boy:2.2,yukseklik:0.3},parlama:0.12,disCizgi:false},
  /* P1 (2026-10-21 akşam), P2 (2026-10-21 gece; kullanıcı kararı kesin): 2D maç görünümü (js/pul.js) — maçta sahadaki her insan aynı numaralı pul
     olarak çizilir (FM 2D gibi; boy, saç, yapı ayrımı yok). 2D varsayılandır; loca bakışı TEST (Ayarlar > Geliştirici, G tuşu, ?pul=0).
     yaricap/yukseklik: pulun boyu (m). enAzPx: pulun ekrandaki
     en küçük yarıçapı (960 ızgara pikseli; uzakta büyütülür, en çok enCokKat). doku: üst yüzün piksel boyu; sayiOlcek: numaranın piksel ölçeği; halka: kenar
     halkasının kalınlığı (doku pikseli). yanKoyu: yan yüzün forma rengine oranı. yatDim: yatan oyuncunun kararma payı. oturmaY: kulübede oturanın pul
     yüksekliği (m). topcuOran: top toplayıcı pulunun oranı. golge: pulun altındaki koyu lekenin opaklığı (havadayken yerde kalır: yükseklik ipucu).
     ayak: iki ayak çizgisi (en, boy, yandan uzaklık, on: merkezin pul kenarından öne taşması, adım salınımı m; parlak: vuran ayağın rengi).
     tepe (kullanıcı kararı, 2026-10-21 akşam): 2D maç görünümü — başkanın loca bakışı yerine FM gibi tepeden bakan kamera (js/kamera.js tepeKamera);
     pullar düz yatar. yukseklik: kameranın yerden yüksekliği (m). genislik: yakınlık seviyelerinde ekranda görünen dikey uzunluk (m; Z tuşu sırayla
     değiştirir); maç öncesinde bütün stat (P2: tribün arkalarından türetilir, js/pul.js PUL.stat). seviye: açılıştaki seviye. takip: topu izlemenin
     yumuşaklığı (sn), yakinlik: seviye geçişinin yumuşaklığı (sn). kenar: kameranın tribün arkalarının ötesinde gösterebileceği pay (m; P2: statın
     dışı görünmesin). yaricapKat: tepeden pulun büyütülmesi. golgeKay: pul lekesinin kayması (dünya x, z; m — ekranda sağ aşağı).
     top (P2, kullanıcı: "topun havada olduğu anlaşılmıyor"): 2D'de topun boyu kat, havada yukseklik payı kadar büyür (tepe m'de tam); yumuşak
     gölgesi yükseldikçe ekranda sağ-aşağı kayar (kay m / m yükseklik, enCok m'ye dek; taban yerdeki kayma), büyür ve solar; hızlı ya da havadaki
     topun ardında kısa iz (sayi örnek, aralik sn, sure sn ömür, hiz m/sn ve y m eşikleri, boy topun yarıçapına oran: baş, son; parlak: izin
     parlaklığı); havadaki topun ineceği yerde halka (inis). TEST değerleri */
  pul:{yaricap:0.5,yukseklik:0.12,enAzPx:6,enCokKat:3,doku:32,sayiOlcek:3,halka:2.5,yanKoyu:0.55,yatDim:0.4,oturmaY:0.55,topcuOran:0.75,golge:0.3,
    ayak:{en:0.12,boy:0.24,yan:0.2,on:0.02,adim:0.1,parlak:'#ffb530'},
    tepe:{yukseklik:110,genislik:[34,46,70],seviye:1,takip:0.35,yakinlik:0.6,kenar:3,yaricapKat:1.7,golgeKay:[-0.14,-0.14]},
    top:{kat:2.0,yukseklik:0.6,tepe:6,golge:{opak:0.45,boy:1.6,kay:[-0.35,-0.35],enCok:4,taban:0.1},
      iz:{sayi:24,aralik:0.05,sure:0.6,hiz:9,y:0.4,boy:[0.85,0.3],parlak:0.65},inis:{acik:true,yaricap:0.9,opak:0.5}},
    /* E (2026-10-23): kopuş — 2D'de figür animasyonu çalışmaz, pul motorun alanlarından beslenir (js/pul.js pulAktor); false: P2'nin yolu (figür
       pozları arka planda hesaplanır). Adım: kadans = hız ÷ (taban + eğim·hız) adım/sn; yatış: motorun yere düşme eylemleriyle, hızı 1/sn */
    kopus:true,adim2:{taban:0.6,egim:0.12},yatHiz:6,
    /* E: olay simgeleri ve etiketler — ekrandaki boyları (piksel, 960 genişliğe göre), pulun üstündeki boşluk (pul yarıçapı katı), süreler (sn) */
    simge:{px:22,bosluk:1.25,kart:3.2,ofsayt:2.2,degisiklik:4,sakat:true,istek:true,istekPx:18},
    etiket:{acik:true,px:18,golge:'rgba(16,14,12,0.72)',renk:'#f4f2ea',gecis:0.25,bosluk:1.3},
    /* E3: kalabalıkta pul en çok bu kadar küçülür (komşu pulların merkezleri arası < 2·yarıçap iken) */
    kalabalik:{acik:true,enKucuk:0.75}}
};
