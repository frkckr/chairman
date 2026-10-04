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
      ekRenkler:{ek1:'#141416',ek2:'#3a3a42'}}
  },
  /* top toplayıcı çocukların boyu ve eni (yetişkine oran) */
  topcuBoy:{h:0.74,w:0.8},
  /* antrenman: koniler, fotoğraf flaşı */
  antrenman:{koni:0xff7a1e,flas:0xfff4dc},

  tenler:['#e2b48c','#cf9a70','#b07650','#8a5a3c','#ecc49e'],

  /* Oyuncu animasyonu (js/animasyon.js; E akışı, 2026-10-03): yalnız görünüş ayarları, motoru etkilemez.
     adim: adım boyu = boy·(kisa + uzun·min(1, hız/1,4)) + hizBoy·hız (m); yer: ayağın yerde kaldığı döngü payı (yürüyüş), yerHiz ile hızlandıkça
       yerEn'e iner; kaldir/kaldirHiz/kaldirTavan: salınan ayağın yüksekliği (m); geri/yan: geri ve yana adımın boy çarpanı;
       yuvar: adımın uçlarında taban ortasının yükselmesi (topuk ve burun yere değer, m).
     kalcaDonus: kalçanın hareket yönüne dönüşü (rad, gövde ters döner). egilme: koşuda öne eğilme, ileri ivmeden eğilme ve yan ivmeden yatış katsayıları.
     dusus: yerde yatış açısı (rad) ve gövde kalınlığı (yüzüstü/sırtüstü, yan). dokunus: top sürerken ayak dokunuşunun süresi (sn).
     kucukPiksel: ekranda (720 satırlık ızgarada) bundan kısa görünen oyuncuda bakış ve dokunuş gibi ayrıntı katmanları atlanır (480 satırdaki 8 ile aynı eşik).
     top: havadaki topun üst/kesik (ust) ve yan (egri) dönüşünün görünür hız çarpanları; kare: bir karede en çok dönüş (rad, örnekleme kırılmasın).
     sevincCesit: gol sevinci çeşidi sayısı (oyuncu ve gole göre karışık seçilir) */
  animasyon:{
    adim:{kisa:0.25,uzun:0.37,hizBoy:0.17,yer:0.6,yerHiz:0.05,yerEn:0.22,kaldir:0.06,kaldirHiz:0.05,kaldirTavan:0.42,geri:0.7,yan:0.45,yuvar:0.05},
    kalcaDonus:0.5,egilme:{kosu:0.2,ivme:0.025,yatis:0.03},
    dusus:{aci:1.45,yuzY:0.12,yanY:0.16},dokunus:0.18,kucukPiksel:12,
    top:{ust:300,egri:150,kare:0.6},sevincCesit:4
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
     rakip başkanın kalkışı, tepki, geri adım, oturma ve raf (sn); rakip: rakip başkanın koltuğu (x), tokalaşma mesafesi, görünüşü (diğer
     loca kişileriyle aynı insan ölçeği); kalabalik: önde iki yönetici (x), arkada basamak (ön kenardan uzaklık, yükseklik) ve konuklar (x);
     sonra: rakip başkan sonra gelirse başkan oturduktan kaç sn sonra (aralık; takımlar ısınmaya çıkmadan, senaryo sn sinir'den önce).
     TEST değerleri */
  locaGiris:{aci:46,acilisAci:58,elAci:42,goz:1.62,kapi:{x:-3.0,en:1.0,boy:2.15},merdiven:{basamak:8,yukseklik:0.17,derinlik:0.3,sahanlik:1.4},
    dis:6.5,yol:{hiz:1.3,viraj:0.4,ivme:1.0,merdivenHiz:0.62},
    sure:{acilis:1.6,bekle:1.2,kesmeKarar:0.8,kesmeSiyah:0.25,kesmeAc:0.45,kalk:1.3,tepki:1.5,geri:1.0,otur:2.2,raf:0.5,selamKalk:1.6},
    rakip:{x:1.5,mesafe:1.35,gorunus:{ten:2,sac:'kisa',sacRenk:'#8a8680',biyik:true,boy:1.0,yapi:1.0}},
    kalabalik:{on:[-1.4,-2.6],arka:{geri:2.1,yukseklik:0.35,x:[-1.9,-0.6,0.7,2.0,3.3]}},
    sonra:[8,20],sinir:44,
    renk:{cerceve:0xd8d2c4,kapi:0x6a4a2c,ic:0x8a8274,lamba:0xfff0d0,pencere:0x0e1420,koltuk:0x4a1e18,basamak:0x5a5b60}},
  /* karar anı ekranı (N12, js/ekran-an.js): kenar kararması (0–1), kartların yerine oturma süresi (süre ondan sonra başlar), seçimden sonra
     kartın kalış süresi, son kaç saniyede çubuk amber olur (sn); yazı büyüklüğü (cqw; normal, büyük). TEST değerleri */
  an:{kararma:0.35,giris:0.4,sonra:0.9,amber:1.5,yazi:{normal:1.3,buyuk:1.6}},
  /* raf (N5, 2026-10-04): y = rafın üst yüzeyi (ön plan kamerasına göre metre; eski masa -0,47'deydi), derinlik = rafın eni (m), duvar = altındaki ön duvarın iç yüzü */
  baskan:{aci:50,masa:'#5a3620',masaKoyu:'#4a2c18',masaAcik:'#6a4228',pirinc:0xb89a4a,sumen:0x5a1a1c,raf:{y:-0.56,derinlik:0.3,duvar:0x44474d},takim:0x27324e,ten:0xd2a07a,saat:0xd4af37,dinlenmeEgimi:-0.15,egimUst:0.02,govdeHiz:0.05},

  /* Başkan bölümü: halı, ahşap bölmeler, başkanın koltuğu */
  baskanBolumu:{hali:0x5e1a1c,bolme:0x3a2618,bolmeUst:0x6a4a2c,masa:0x4a2c18,masaUst:0x6a4228,koltuk:'#3a0e0c'},

  /* Stat yapı malzemeleri (tribün betonu, çatı, direk, toprak pist, set, kötü zemin renkleri) */
  stadyum:{
    beton:0x6d6e72,betonKoyu:0x4d4e53,yanDuvar:0x5a5b60,basamak:0x66665f,set:0x4c5a2c,cati:0x8c9096,catiKenar:0x3c3f44,direk:0x4a4d52,disZemin:0x232428,
    toprakPist:'#6e4a33',pistsizKenar:'#2a6526',kuruCim:'#8f8a44',camur:'78,56,34'
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

  /* Menü ekranları (maç öncesi bülteni gibi): 4:3 oyun karesinin içinde, stadın önünde koyu bir panel.
     Ekran bu renkleri CSS değişkeni (--m-ad) olarak yazar. ortu: panelin arkasındaki donuk stadı ne kadar örttüğü (0–1).
     galibiyet/beraberlik/maglubiyet: form kutucukları; sari/kirmizi: kart ve ceza işaretleri; cim/sahaCizgi: mini saha. */
  menu:{zemin:'#0c0b0a',ortu:0.9,panel:'#191816',panelUst:'#221f1b',cizgi:'#3b372f',yazi:'#efe7d6',soluk:'#9a9282',
    vurgu:'#ffb530',kulup:'#c8281e',rakip:'#3a5aa8',galibiyet:'#3a8c33',beraberlik:'#8a8478',maglubiyet:'#c8281e',
    sari:'#f2d21d',kirmizi:'#d8201e',cim:'#2f7a2a',cimAcik:'#3a8c33',sahaCizgi:'#f2f2ea'},

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
     Maç başkanın gözünden izlenir: ana tribünün arkasındaki binada, başkanın locası. Dürbün isteğe bağlı. */
  kameralar:{
    /* konum stadyum tarifindeki başkan koltuğundan gelir; goz = koltuk üstünde göz yüksekliği (metre). js/kamera.js
       N4 (kullanıcı kararı 2026-10-04): bakış hep topu izler; fareyle/ok tuşlarıyla elle bakış ve “Topu izle” düğmesi kaldırıldı (elleAci ve
       elle ayarları da). Bakış topa odaklıdır: görüş açısı oyunda oyunAci aralığında, ölü topta
       oluGecikme saniye sonra, maç öncesi/sonrası, devre arası ve törende aci'ye (geniş) döner. aciSure: görüş açısı yumuşama süresi (sn, maç
       zamanı). yayOyun: oyunda bakış yayının açısal sıklığı (1/sn), hizSiniri: bakışın en hızlı dönüşü (derece/sn); yay ve sahneSinir aynısı
       oyun dışı (ilgi noktaları) için. oluBolge: [derece (oyunAci[1]'de), m/sn] top bu hızdan yavaşken bakışın kıpırdamadığı açı. egim: oyunda
       bakışın topun ne kadar altına indiği (derece, oyunAci[1]'de; top alttaki masanın açıkta bıraktığı alanın ortasına yakın). sahneEgim: oyun
       dışında bakışın odağın altına inme payı (uzaklığa oran). asagiSinir/yukariSinir: takipte bakışın en çok aşağı/yukarı eğimi (radyan).
       top: onde = taşıyanın önüne bakış (m), ongoru = serbest topta balistik öngörü (sn), inis = [başlangıç sn, süre sn, en çok pay] uzun havadan
       topta iniş yerine kayma, kale = son üçte birde kale ağzına kayma payı, korner = kornerde penaltı noktasına kayma payı, butce = [sapma, eğim]
       nişanın topun yönünden en çok sapması (derece, oyunAci[1]'de). genislik (görüş açısı için 0 dar – 1 geniş): hiz = top hızı aralığı (m/sn),
       kale = kaleye uzaklık aralığı (m, yakında geniş), yayilim = [m, m, pay] topa üçüncü en yakın oyuncunun uzaklığı (dağınık oyunda geniş).
       TEST değerleri */
    baskan:{goz:0.78,hedef:[0,1,0],aci:36,oyunAci:[21,26],aciSure:0.8,oluGecikme:1.5,yayOyun:5,hizSiniri:120,yay:1.0,sahneSinir:60,
      oluBolge:[0.8,2.5],egim:1.6,sahneEgim:0.18,asagiSinir:0.5,yukariSinir:0.12,
      top:{onde:0.6,ongoru:0.35,inis:[0.5,1.6,0.55],kale:0.25,korner:0.45,butce:[2.5,1.6]},
      genislik:{hiz:[7,22],kale:[30,12],yayilim:[6,18,0.6]}},
    /* dürbün elle açılır ve topa kilitlenir. aci = oyun dışı görüş açısı, oyunAci =
       oyunda [dar, geniş] (oyunun genişliğine göre), ongoru = topta öngörü (sn), yay = açısal sıklık (1/sn), hizSiniri = derece/sn, butce = [sapma,
       eğim] derece (oyunAci[1]'de), aciSure = görüş açısı yumuşaması (sn), gecisSure = açılış/kapanış geçişi (sn, gerçek zaman). TEST değerleri */
    durbun:{goz:0.78,aci:8.5,oyunAci:[7,10],ongoru:0.12,yay:7,hizSiniri:160,butce:[0.6,0.4],aciSure:0.6,gecisSure:0.35}
  },

  /* Maçın okunurluğu (js/okunurluk.js, js/goruntu.js; A akışı, 2026-10-03): locadan uzaktaki maçın net görünmesi için çizim ayarları.
     cizgi: saha çizgilerinin üstüne ekranda sabit genişlikli şerit (acik, genislik = iç çözünürlükte piksel, opak = saydamlık (zemin kalitesiyle
     çarpılır), parlaklik = ışıklı çizgi rengine çarpan, y = zeminden yükseklik m). topEnAz: topun ekrandaki en küçük çapı (maç ızgarasında
     piksel; daha uzakta büyütülür), topEnCok: en çok büyütme katı. topLeke: havadaki topun altındaki koyu leke (opak, boy = top yarıçapına oran, yukseklik = top
     yerden bu kadar (m) yükselince). parlama: oyuncu dokusunun kendi renginden ışıma payı (gece ışığında koyu leke olmasınlar).
     disCizgi: oyuncu ve topun çevresinde 1 piksellik koyu çizgi denemesi (karşılaştırma için; varsayılan kapalı). TEST değerleri */
  okunurluk:{cizgi:{acik:true,genislik:1,opak:0.7,parlaklik:1,y:0.02},topEnAz:4.5,topEnCok:3,topLeke:{opak:0.5,boy:2.2,yukseklik:0.3},parlama:0.12,disCizgi:false}
};
