/* ============ Demirkapı '99 — STİL DOSYASI ============
   Oyunun görünüşüne dair bütün ayarlar burada toplanır.
   Stili değiştirmek istediğinde önce bu dosyaya bak; oyun mantığı (maç motoru, yönetim) bu dosyayı kullanmaz.
   Renkler: '#rrggbb' metin ya da 0xrrggbb sayı olarak. */
const STIL={
  ad:"Demirkapı '99",

  /* Ekran: 4:3 tüplü TV, düşük iç çözünürlük, 15 bit renk + 4x4 titreme, PS1 köşe titremesi */
  ekran:{genislik:400,yukseklik:300,renkBiti:5,titreme:true,koseTitremesi:true,arkaPlan:0x070b16},

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

  /* Tribün: her kişi 4x8 piksel, iki kareyle sallanır */
  seyirci:{
    ev:['#c8281e','#c8281e','#c8281e','#ece6da','#ece6da','#1c1c20','#d8b030'],
    karisik:['#c8281e','#ece6da','#3a3c44','#5a4630','#2a4a8a','#1c1c20','#7a6a50','#c8281e'],
    deplasman:['#e8eaee','#22347a','#e8eaee','#1c1c20'],
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

  /* Gece maçında her projektör için bir soluk gölge (90'ların dörtlü gölgesi) */
  golge:{opaklik:0.16,projektorler:[[-72,-58],[72,-58],[-72,58],[72,58]],projektorYuksekligi:40},

  tabela:{zemin:'#140c04',ampul:'#ffb530',ikincil:'#ffd98a'},
  pankart:{zemin:'#efe9dc',yazi:'#c8281e'},

  /* Kameralar: konum [x,y,z], hedef [x,y,z], aci = dikey görüş açısı (derece).
     Maç başkanın gözünden izlenir: ana tribünün ortasında, açık tribündeki başkan koltuğu. Dürbün isteğe bağlı. */
  kameralar:{
    baskan:{konum:[0,6.3,-49.5],hedef:[34,-1.5,-6],aci:40},
    durbun:{konum:[0,6.3,-49.5],hedef:[43,1.1,-1],aci:9}
  }
};
