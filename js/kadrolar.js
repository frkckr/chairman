/* ============ Demirkapı '99 — kadrolar ============
   Yalnızca veri. Her oyuncu tek kayıttır: isim, numara, mevki, görünüş (boy, yapı, ten, saç, bıyık/sakal, çorap, krampon) ve yetenek.
   Sıra maç motorundaki dizilişle aynıdır: 0 kaleci, 1–4 defans, 5–8 orta saha, 9–10 forvet. Sonra yedekler ve teknik direktör.
   boy: 0,9–1,1; yapi: 0,93–1,12; ten: STIL.tenler sırası; sac: kisa | kel | uzun | mullet | kivircik; yetenek: 0–1. */
const KADROLAR={
  demirkapi:{ad:'Demirkapı',kisa:'DEM',forma:'ev',kaleciForma:'evKaleci',
    td:{ad:'Şükrü Hoca',ten:1,sac:'kel',sacRenk:'#8a8680',biyik:true,boy:1.02,yapi:1.1},
    oyuncular:[
      {ad:'Engin',no:1,ten:0,sac:'kisa',sacRenk:'#241a12',boy:1.08,yapi:1.04,yetenek:0.72},
      {ad:'Hüseyin',no:2,ten:2,sac:'kisa',sacRenk:'#141212',boy:0.98,yapi:1.02,yetenek:0.62,biyik:true},
      {ad:'Ziya',no:4,ten:1,sac:'kel',sacRenk:'#3c2616',boy:1.06,yapi:1.12,yetenek:0.66},
      {ad:'Cengiz',no:5,ten:0,sac:'kivircik',sacRenk:'#141212',boy:1.04,yapi:1.08,yetenek:0.68,kaptan:true,biyik:true},
      {ad:'Rıza',no:3,ten:3,sac:'kisa',sacRenk:'#141212',boy:0.95,yapi:0.98,yetenek:0.6,sirik:true},
      {ad:'Oğuz',no:7,ten:4,sac:'uzun',sacRenk:'#5a4028',boy:0.96,yapi:0.94,yetenek:0.7},
      {ad:'Metin',no:6,ten:1,sac:'kisa',sacRenk:'#241a12',boy:1.0,yapi:1.05,yetenek:0.66,sakal:true},
      {ad:'Selçuk',no:8,ten:2,sac:'mullet',sacRenk:'#3c2616',boy:0.99,yapi:1.0,yetenek:0.69},
      {ad:'Bülent',no:11,ten:3,sac:'kivircik',sacRenk:'#141212',boy:0.9,yapi:1.08,yetenek:0.71,sirik:true},
      {ad:'Kadir',no:9,ten:1,sac:'kisa',sacRenk:'#241a12',boy:1.02,yapi:1.06,yetenek:0.78,biyik:true},
      {ad:'Erdal',no:10,ten:4,sac:'mullet',sacRenk:'#dcb660',boy:1.09,yapi:0.93,yetenek:0.8,krampon:'#f2f2f2'}
    ],
    yedekler:[
      {ad:'Tamer',no:12,ten:0,sac:'kisa',sacRenk:'#241a12',boy:1.07,yapi:1.02},
      {ad:'Levent',no:14,ten:1,sac:'kisa',sacRenk:'#3c2616',boy:1.0,yapi:1.0},
      {ad:'Hakan',no:15,ten:2,sac:'kel',sacRenk:'#241a12',boy:1.03,yapi:1.06},
      {ad:'Murat',no:16,ten:4,sac:'uzun',sacRenk:'#8a6a3a',boy:0.97,yapi:0.95},
      {ad:'Sinan',no:17,ten:3,sac:'kivircik',sacRenk:'#141212',boy:0.94,yapi:1.0}
    ]},
  akdeniz:{ad:'Akdeniz',kisa:'AKD',forma:'deplasman',kaleciForma:'deplasmanKaleci',
    td:{ad:'Nuri Hoca',ten:0,sac:'kisa',sacRenk:'#cfcac0',boy:0.98,yapi:1.04},
    oyuncular:[
      {ad:'Nihat',no:1,ten:0,sac:'kel',sacRenk:'#141212',boy:1.1,yapi:1.0,yetenek:0.7},
      {ad:'Yaşar',no:2,ten:1,sac:'kisa',sacRenk:'#241a12',boy:1.0,yapi:1.0,yetenek:0.6},
      {ad:'Turgut',no:4,ten:2,sac:'kisa',sacRenk:'#3c2616',boy:1.02,yapi:1.12,yetenek:0.64,sakal:true},
      {ad:'İlyas',no:5,ten:4,sac:'uzun',sacRenk:'#5a4028',boy:1.06,yapi:1.0,yetenek:0.66},
      {ad:'Nevzat',no:3,ten:1,sac:'kel',sacRenk:'#241a12',boy:0.93,yapi:1.05,yetenek:0.61,biyik:true},
      {ad:'Halil',no:7,ten:0,sac:'kisa',sacRenk:'#a0522d',boy:0.97,yapi:0.96,yetenek:0.67,sirik:true},
      {ad:'Sadi',no:6,ten:3,sac:'kivircik',sacRenk:'#141212',boy:1.0,yapi:1.06,yetenek:0.65},
      {ad:'Fikret',no:8,ten:2,sac:'kisa',sacRenk:'#241a12',boy:1.01,yapi:1.0,yetenek:0.68,kaptan:true,biyik:true},
      {ad:'Yılmaz',no:11,ten:1,sac:'mullet',sacRenk:'#3c2616',boy:0.95,yapi:0.97,yetenek:0.69},
      {ad:'Orhan',no:9,ten:3,sac:'kisa',sacRenk:'#141212',boy:1.05,yapi:1.08,yetenek:0.74},
      {ad:'Levent',no:10,ten:4,sac:'uzun',sacRenk:'#c8a060',boy:1.0,yapi:0.94,yetenek:0.73}
    ],
    yedekler:[
      {ad:'Kemal',no:12,ten:0,sac:'kisa',sacRenk:'#241a12',boy:1.06,yapi:1.0},
      {ad:'Emre',no:14,ten:1,sac:'kisa',sacRenk:'#141212',boy:0.98,yapi:0.98},
      {ad:'Ahmet',no:15,ten:2,sac:'kel',sacRenk:'#241a12',boy:1.0,yapi:1.08},
      {ad:'Cemil',no:16,ten:3,sac:'kivircik',sacRenk:'#141212',boy:0.96,yapi:1.02},
      {ad:'Ferhat',no:17,ten:4,sac:'mullet',sacRenk:'#5a4028',boy:1.02,yapi:0.96}
    ]}
};
/* bu maçın ev sahibi ve konuğu (ileride fikstürden gelecek) */
const MAC_KADRO=[KADROLAR.demirkapi,KADROLAR.akdeniz];
