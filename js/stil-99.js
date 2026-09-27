/* ============ Demirkapı '99 — STİL DOSYASI ============
   Oyunun görünüşüne dair bütün ayarlar burada toplanır.
   Stili değiştirmek istediğinde önce bu dosyaya bak; oyun mantığı (maç motoru, yönetim) bu dosyayı kullanmaz.
   Renkler: '#rrggbb' metin ya da 0xrrggbb sayı olarak. */
const STIL={
  ad:"Demirkapı '99",

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
    vipKoltuk:'#8a1c16',vipKorkuluk:0xb8bcc2,
    kareSuresi:0.3
  },

  /* Formalar (anahtarlar kodda kullanılır: shirt=forma, trim=yaka/numara, shorts=şort, socks=çorap, out=numara kenarı, sash=çapraz şerit) */
  formalar:{
    ev:{shirt:'#c8281e',trim:'#f2ede2',shorts:'#f2ede2',socks:'#c8281e',out:'#6e140e'},
    deplasman:{shirt:'#eef0f3',trim:'#22347a',shorts:'#22347a',socks:'#eef0f3',sash:'#22347a'},
    deplasmanKaleci:{shirt:'#3c9254',trim:'#141414',shorts:'#1c1c1e',socks:'#3c9254',glove:'#f2f2f2',gk:true},
    hakem:{shirt:'#1a1a1c',trim:'#f2f2f2',shorts:'#1a1a1c',socks:'#1a1a1c'}
  },
  tenler:['#e2b48c','#cf9a70','#b07650','#8a5a3c','#ecc49e'],

  /* Gece maçında her projektör için bir soluk gölge (90'ların dörtlü gölgesi). Projektörlerin yeri stadyum tarifindedir. */
  golge:{opaklik:0.16},

  /* Stat yapı malzemeleri (tribün betonu, çatı, direk, toprak pist, set, kötü zemin renkleri, kasaba apartmanları) */
  stadyum:{
    beton:0x6d6e72,betonKoyu:0x4d4e53,yanDuvar:0x5a5b60,basamak:0x66665f,set:0x4c5a2c,cati:0x8c9096,catiKenar:0x3c3f44,direk:0x4a4d52,disZemin:0x232428,
    toprakPist:'#6e4a33',pistsizKenar:'#2a6526',kuruCim:'#8f8a44',camur:'78,56,34',
    apartman:['#3a3530','#463d34','#34363a','#3e362c'],pencere:'#ffd98a'
  },

  tabela:{zemin:'#140c04',ampul:'#ffb530',ikincil:'#ffd98a',elleZemin:'#1d2a22',elleYazi:'#f0ece0'},
  pankart:{zemin:'#efe9dc',yazi:'#c8281e'},

  /* Kameralar: hedef [x,y,z], aci = dikey görüş açısı (derece).
     Maç başkanın gözünden izlenir: ana tribünün ortasında, açık tribündeki başkan koltuğu. Dürbün isteğe bağlı. */
  kameralar:{
    /* konum stadyum tarifindeki başkan koltuğundan gelir; goz = koltuk üstünde göz yüksekliği (metre) */
    baskan:{goz:0.78,hedef:[34,-7,-6],aci:30},
    durbun:{goz:0.78,hedef:[43,1.1,-1],aci:11}
  }
};
