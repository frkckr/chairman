/* ============ Chairman — STİL DOSYASI ============
   Oyunun görünüşüne dair bütün ayarlar burada toplanır.
   Stili değiştirmek istediğinde önce bu dosyaya bak; oyun mantığı (maç motoru, yönetim) bu dosyayı kullanmaz.
   Renkler: '#rrggbb' metin ya da 0xrrggbb sayı olarak. */
const STIL={
  ad:"Chairman",

  /* Ekran: 4:3, PS1'in yüksek çözünürlük modu (640x480), 15 bit renk + 4x4 titreme.
     Köşe titremesi (köşelerin piksellere yapışması) kapalı: hareket pürüzsüz aksın diye. titremeGucu: renk titremesinin şiddeti (0–1). */
  ekran:{genislik:640,yukseklik:480,renkBiti:5,titreme:true,titremeGucu:0.7,koseTitremesi:false,arkaPlan:0x070b16},

  /* Gece havası */
  sis:{renk:0x0c1322,yakin:150,uzak:380},
  gokyuzu:{ufuk:[0.1,0.13,0.21],tepe:[0.015,0.025,0.07],yildiz:0xc8d0e8},
  isik:{
    ortam:{renk:0x56607c,guc:0.72},
    ana:{renk:0xffe8c4,guc:0.82,konum:[60,80,55]},      // sıcak projektör ışığı
    dolgu:{renk:0xcfd8ff,guc:0.45,konum:[-50,70,-45]}   // soğuk karşı ışık
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
    deplasmanKaleci:{shirt:'#3c9254',trim:'#141414',shorts:'#1c1c1e',socks:'#3c9254',glove:'#f2f2f2',gk:true},
    hakem:{shirt:'#1a1a1c',trim:'#f2f2f2',shorts:'#1a1a1c',socks:'#1a1a1c'},
    /* yedekler eşofmanla, teknik direktör takım elbiseyle (pant: uzun pantolon, ls: uzun kol) */
    yedekEv:{shirt:'#7a1812',trim:'#f2ede2',shorts:'#1c1c20',socks:'#1c1c20',ls:true,pant:true},
    yedekDeplasman:{shirt:'#22347a',trim:'#eef0f3',shorts:'#1c1c20',socks:'#1c1c20',ls:true,pant:true},
    takimElbise:{shirt:'#23262e',trim:'#e8e4da',shorts:'#23262e',socks:'#23262e',ls:true,pant:true,boots:'#0e0e10'},
    /* top toplayıcı çocuklar: lacivert eşofman, sarı yelek (çocuk boyu, bkz. topcuBoy) */
    topcu:{shirt:'#e8c21e',trim:'#1e2a5a',shorts:'#1e2a5a',socks:'#1e2a5a',ls:true,pant:true},
    /* antrenörler (kaleci antrenörü, kondisyoner) koyu eşofmanla; fotoğrafçılar turuncu yelek, elde fotoğraf makinesi */
    antrenorEv:{shirt:'#1c1c20',trim:'#c8281e',shorts:'#1c1c20',socks:'#1c1c20',ls:true,pant:true},
    antrenorDeplasman:{shirt:'#2c3446',trim:'#eef0f3',shorts:'#2c3446',socks:'#2c3446',ls:true,pant:true},
    foto:{shirt:'#d8661e',trim:'#1c1c1e',shorts:'#2a2c30',socks:'#2a2c30',ls:true,pant:true,boots:'#141416',
      ekParcalar:[{kemik:'eR',w:0.13,h:0.1,d:0.12,x:0.08,y:-0.34,z:0.1,renk:'ek1'},{kemik:'eR',w:0.07,h:0.07,d:0.12,x:0.08,y:-0.34,z:0.2,renk:'ek2'}],
      ekRenkler:{ek1:'#141416',ek2:'#3a3a42'}}
  },
  /* antrenman: koniler, fotoğraf flaşı */
  antrenman:{koni:0xff7a1e,flas:0xfff4dc},
  topcuBoy:{h:0.74,w:0.8},
  tenler:['#e2b48c','#cf9a70','#b07650','#8a5a3c','#ecc49e'],

  /* Gece maçında her projektör için bir gölge (90'ların dörtlü gölgesi): oyuncunun silüeti ışıktan zemine izdüşer (js/golgeler.js).
     opaklik: tek bir ışığın gölgesinin koyuluğu. Projektörlerin yeri stadyum tarifindedir. */
  golge:{opaklik:0.2},

  /* Başkanın bedeni (ön plan katmanı, js/baskan.js): masa, takım elbise, ten, saat renkleri.
     aci: ön plan kamerasının görüş açısı; dinlenmeEgimi: bakışın sahaya dinlenirken eğimi (radyan). */
  baskan:{aci:50,masa:'#5a3620',masaKoyu:'#4a2c18',masaAcik:'#6a4228',pirinc:0xb89a4a,sumen:0x5a1a1c,takim:0x27324e,ten:0xd2a07a,saat:0xd4af37,dinlenmeEgimi:-0.2},

  /* Başkan bölümü: halı, ahşap bölmeler, başkanın koltuğu */
  baskanBolumu:{hali:0x5e1a1c,bolme:0x3a2618,bolmeUst:0x6a4a2c,masa:0x4a2c18,masaUst:0x6a4228,koltuk:'#3a0e0c'},

  /* Stat yapı malzemeleri (tribün betonu, çatı, direk, toprak pist, set, kötü zemin renkleri, kasaba apartmanları) */
  stadyum:{
    beton:0x6d6e72,betonKoyu:0x4d4e53,yanDuvar:0x5a5b60,basamak:0x66665f,set:0x4c5a2c,cati:0x8c9096,catiKenar:0x3c3f44,direk:0x4a4d52,disZemin:0x232428,
    toprakPist:'#6e4a33',pistsizKenar:'#2a6526',kuruCim:'#8f8a44',camur:'78,56,34',
    apartman:['#3a3530','#463d34','#34363a','#3e362c'],pencere:'#ffd98a'
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

  /* Başkan odası (js/oda.js): aydınlık, gün ışığı alan oda; başkanın masasından bakış. Ölçüler metre.
     goz/bakis: kameranın yeri ve dinlenirken baktığı nokta; odakAci: bir nesneye odaklanınca görüş açısı;
     odakKayma: panel sağda açıkken nesne solda görünsün diye bakışın sağa kayması (metre).
     gunIsigi: saate göre [saat, güç, renk] — sabah, öğle ve akşam odada hissedilsin diye. TEST değerleri. */
  oda:{aci:56,odakAci:52,odakKayma:0.5,goz:[0,1.28,0.62],bakis:[0,0.95,-1.4],arkaPlan:0xd8e4ea,
    duvar:0xece4d2,lambri:0xcdbb98,supurgelik:0x8a6a44,tavan:0xf6f1e6,zemin:'#b08252',zeminKoyu:'#966a3e',zeminAcik:'#c0935f',hali:0x8e2f28,haliKenar:0xd8c08a,
    cerceve:0xf4f1e8,gokUst:'#9fd0ee',gokAlt:'#e8f4f8',cim:'#3a8c33',tribun:'#8a8c90',direk:'#5a5d62',
    dolap:0x7a5634,dolapKoyu:0x5e4026,koltuk:0x7a2420,koltukAyak:0x3a2a1c,lamba:0x2e5a46,lambaIc:0xfff2c8,
    telefon:0x1a1b1f,telefonEkran:'#10202c',telefonHaber:'#ffb530',defter:'#f3ecdc',defterCizgi:'#c9bfa8',defterYazi:'#2a2622',defterSerit:'#c8281e',
    dosya:0xc8281e,dosyaEtiket:0xf2ede2,kagit:0xf6f1e4,kalemlik:0x2a2c33,saatKasa:0x3a2a1c,saatYuz:0xf4f1e8,saatIbre:0x1c1a18,
    flama:'#c8281e',flamaSerit:'#f2ede2',vurgu:0xffb530,gunesLekesi:0xfff1c4,gazete:'#e9e4d6',notKagidi:'#f2d96a',iskele:'#4a3a2a',iskeleBranda:'#3a6ea8',
    ortam:{renk:0xfff3df,guc:0.62},gunes:{renk:0xfff0cf,konum:[-3.2,3.6,-2.2]},dolgu:{renk:0xdfe8ff,guc:0.28,konum:[2.5,2,2]},
    gunIsigi:[[6,0.25,0xffc890],[9,0.62,0xfff0cf],[13,0.78,0xfffaf0],[17,0.6,0xffe0b0],[19.5,0.28,0xff9a5a],[22,0.1,0x6a78a8]]},

  /* Açık renkli yönetim arayüzü (js/ekran-oda.js): kâğıt zemin, koyu okunur metin, ahşap çizgi, ölçülü kulüp rengi.
     Ekran bu renkleri CSS değişkeni (--k-ad) olarak yazar. yaziBoyu: karenin genişliğine oranla yazı (cqw). TEST değerleri. */
  kagit:{zemin:'#f4eedf',zeminKoyu:'#e9e0cb',serit:'#fbf7ec',cizgi:'#c9b994',yazi:'#26221c',soluk:'#6d6353',vurgu:'#a5620a',vurguZemin:'#ffb530',
    kulup:'#b4241c',kirmizi:'#b4241c',yesil:'#2c6f28',golge:'rgba(40,28,12,.28)',yaziBoyu:{normal:1.42,buyuk:1.72}},

  /* Kameralar: hedef [x,y,z], aci = dikey görüş açısı (derece).
     Maç başkanın gözünden izlenir: ana tribünün ortasında, açık tribündeki başkan koltuğu. Dürbün isteğe bağlı. */
  kameralar:{
    /* konum stadyum tarifindeki başkan koltuğundan gelir; goz = koltuk üstünde göz yüksekliği (metre).
       Bakış topu ve olan biteni yumuşak bir yayla izler: yay = yayın sertliği, egim = bakışın odağın ne kadar altına indiği (masa ve ön sıralar görünsün),
       asagiSinir = bakışın en fazla kaç radyan aşağı inebileceği. */
    baskan:{goz:0.78,hedef:[0,1,-30],aci:30,egim:0.09,yay:2.2,asagiSinir:0.38},
    durbun:{goz:0.78,aci:11}
  }
};
