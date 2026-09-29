/* ============ Chairman — kadrolar ============
   Yalnızca veri. Her oyuncu tek kayıttır: isim, numara, mevki, görünüş (boy, yapı, ten, saç, bıyık/sakal, çorap, krampon), ayak ve özellikler.
   Sıra maç motorundaki dizilişle aynıdır: 0 kaleci, 1–4 defans, 5–8 orta saha, 9–10 forvet. Sonra yedekler ve teknik direktör.
   boy: 0,9–1,1; yapi: 0,93–1,12; ten: STIL.tenler sırası; sac: kisa | kel | uzun | mullet | kivircik.
   ayak: sag | sol | iki (tercih edilen ayak). oz: özellikler 1–99, sırası:
     hız, pas, şut, kafa, top sürme, müdahale, görüş, karar, kalecilik, dayanıklılık, sertlik
   Yedeklerde mevki: KL | DEF | OS | FV (oyuna girerken kimin yerine geçeceği).
   taktik: dizilis; sakin (topu tutma, yan ve geri pas isteği 0–1); direkt (uzun top isteği 0–1);
     risk (top kaybından çekinme, 1 = normal); pres (ne kadar önde baskı 0–1); tempo (karar hızı 0–1). */
const KADROLAR={
  demirkapi:{ad:'Demirkapı',kisa:'DEM',forma:'ev',kaleciForma:'evKaleci',
    taktik:{dizilis:'4-4-2',sakin:0.4,direkt:0.62,risk:0.95,pres:0.55,tempo:0.6},
    td:{ad:'Şükrü Hoca',ten:1,sac:'kel',sacRenk:'#8a8680',biyik:true,boy:1.02,yapi:1.1},
    oyuncular:[
      {ad:'Engin',no:1,ten:0,sac:'kisa',sacRenk:'#241a12',boy:1.08,yapi:1.04,oz:[44,46,20,32,26,22,52,64,74,62,40]},
      {ad:'Hüseyin',no:2,ten:2,sac:'kisa',sacRenk:'#141212',boy:0.98,yapi:1.02,biyik:true,oz:[70,58,40,55,55,65,52,58,5,76,62],ayak:'sag'},
      {ad:'Ziya',no:4,ten:1,sac:'kel',sacRenk:'#3c2616',boy:1.06,yapi:1.12,oz:[55,50,35,76,38,71,46,60,5,66,76]},
      {ad:'Cengiz',no:5,ten:0,sac:'kivircik',sacRenk:'#141212',boy:1.04,yapi:1.08,kaptan:true,biyik:true,oz:[58,60,42,74,45,73,58,72,5,68,66]},
      {ad:'Rıza',no:3,ten:3,sac:'kisa',sacRenk:'#141212',boy:0.95,yapi:0.98,sirik:true,oz:[73,56,45,50,60,61,50,55,5,78,55],ayak:'sol'},
      {ad:'Oğuz',no:7,ten:4,sac:'uzun',sacRenk:'#5a4028',boy:0.96,yapi:0.94,oz:[79,64,58,45,73,40,62,60,5,70,40]},
      {ad:'Metin',no:6,ten:1,sac:'kisa',sacRenk:'#241a12',boy:1.0,yapi:1.05,sakal:true,oz:[58,66,55,63,55,69,64,67,5,80,72]},
      {ad:'Selçuk',no:8,ten:2,sac:'mullet',sacRenk:'#3c2616',boy:0.99,yapi:1.0,oz:[64,71,65,52,66,52,71,67,5,72,48]},
      {ad:'Bülent',no:11,ten:3,sac:'kivircik',sacRenk:'#141212',boy:0.9,yapi:1.08,sirik:true,oz:[77,64,60,42,75,38,62,58,5,68,42],ayak:'sol'},
      {ad:'Kadir',no:9,ten:1,sac:'kisa',sacRenk:'#241a12',boy:1.02,yapi:1.06,biyik:true,oz:[63,58,77,82,58,35,58,65,5,66,60]},
      {ad:'Erdal',no:10,ten:4,sac:'mullet',sacRenk:'#dcb660',boy:1.09,yapi:0.93,krampon:'#f2f2f2',oz:[75,73,79,55,81,30,77,71,5,62,40],ayak:'sol'}
    ],
    yedekler:[
      {ad:'Tamer',no:12,ten:0,sac:'kisa',sacRenk:'#241a12',boy:1.07,yapi:1.02,mevki:'KL',oz:[40,42,18,30,24,20,48,58,64,60,40]},
      {ad:'Levent',no:14,ten:1,sac:'kisa',sacRenk:'#3c2616',boy:1.0,yapi:1.0,mevki:'DEF',oz:[62,52,34,68,40,64,46,56,5,70,64]},
      {ad:'Hakan',no:15,ten:2,sac:'kel',sacRenk:'#241a12',boy:1.03,yapi:1.06,mevki:'OS',oz:[60,62,56,56,58,58,60,60,5,74,58]},
      {ad:'Murat',no:16,ten:4,sac:'uzun',sacRenk:'#8a6a3a',boy:0.97,yapi:0.95,mevki:'OS',oz:[76,62,58,44,72,38,60,56,5,70,40],ayak:'sol'},
      {ad:'Sinan',no:17,ten:3,sac:'kivircik',sacRenk:'#141212',boy:0.94,yapi:1.0,mevki:'FV',oz:[74,56,70,62,68,32,56,58,5,68,50]}
    ]},
  akdeniz:{ad:'Akdeniz',kisa:'AKD',forma:'deplasman',kaleciForma:'deplasmanKaleci',
    taktik:{dizilis:'4-4-2',sakin:0.62,direkt:0.38,risk:1.05,pres:0.45,tempo:0.52},
    td:{ad:'Nuri Hoca',ten:0,sac:'kisa',sacRenk:'#cfcac0',boy:0.98,yapi:1.04},
    oyuncular:[
      {ad:'Nihat',no:1,ten:0,sac:'kel',sacRenk:'#141212',boy:1.1,yapi:1.0,oz:[42,44,18,30,24,20,50,62,71,60,38]},
      {ad:'Yaşar',no:2,ten:1,sac:'kisa',sacRenk:'#241a12',boy:1.0,yapi:1.0,oz:[68,60,38,54,56,63,54,60,5,74,56]},
      {ad:'Turgut',no:4,ten:2,sac:'kisa',sacRenk:'#3c2616',boy:1.02,yapi:1.12,sakal:true,oz:[52,52,34,75,36,72,48,62,5,64,74]},
      {ad:'İlyas',no:5,ten:4,sac:'uzun',sacRenk:'#5a4028',boy:1.06,yapi:1.0,oz:[57,61,40,71,44,70,56,66,5,66,60]},
      {ad:'Nevzat',no:3,ten:1,sac:'kel',sacRenk:'#241a12',boy:0.93,yapi:1.05,biyik:true,oz:[70,58,42,48,62,60,52,57,5,76,52],ayak:'sol'},
      {ad:'Halil',no:7,ten:0,sac:'kisa',sacRenk:'#a0522d',boy:0.97,yapi:0.96,sirik:true,oz:[76,66,57,44,72,40,64,60,5,70,42]},
      {ad:'Sadi',no:6,ten:3,sac:'kivircik',sacRenk:'#141212',boy:1.0,yapi:1.06,oz:[57,69,52,60,57,67,66,68,5,78,66]},
      {ad:'Fikret',no:8,ten:2,sac:'kisa',sacRenk:'#241a12',boy:1.01,yapi:1.0,kaptan:true,biyik:true,oz:[62,73,63,52,66,55,73,70,5,72,50]},
      {ad:'Yılmaz',no:11,ten:1,sac:'mullet',sacRenk:'#3c2616',boy:0.95,yapi:0.97,oz:[75,66,58,42,74,38,64,58,5,68,44],ayak:'sol'},
      {ad:'Orhan',no:9,ten:3,sac:'kisa',sacRenk:'#141212',boy:1.05,yapi:1.08,oz:[64,56,75,79,58,36,56,63,5,68,58]},
      {ad:'Levent',no:10,ten:4,sac:'uzun',sacRenk:'#c8a060',boy:1.0,yapi:0.94,oz:[73,70,76,54,78,32,74,69,5,64,42]}
    ],
    yedekler:[
      {ad:'Kemal',no:12,ten:0,sac:'kisa',sacRenk:'#241a12',boy:1.06,yapi:1.0,mevki:'KL',oz:[40,42,18,30,24,20,48,58,63,60,40]},
      {ad:'Emre',no:14,ten:1,sac:'kisa',sacRenk:'#141212',boy:0.98,yapi:0.98,mevki:'DEF',oz:[60,54,34,70,40,65,48,58,5,70,62]},
      {ad:'Ahmet',no:15,ten:2,sac:'kel',sacRenk:'#241a12',boy:1.0,yapi:1.08,mevki:'OS',oz:[58,64,55,56,58,60,62,62,5,74,56]},
      {ad:'Cemil',no:16,ten:3,sac:'kivircik',sacRenk:'#141212',boy:0.96,yapi:1.02,mevki:'OS',oz:[74,62,56,44,72,40,60,56,5,70,42]},
      {ad:'Ferhat',no:17,ten:4,sac:'mullet',sacRenk:'#5a4028',boy:1.02,yapi:0.96,mevki:'FV',oz:[72,56,71,64,66,32,56,58,5,68,52]}
    ]}
};
/* bu maçın ev sahibi ve konuğu (ileride fikstürden gelecek) */
const MAC_KADRO=[KADROLAR.demirkapi,KADROLAR.akdeniz];
