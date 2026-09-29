/* ============ Chairman — lig: yalnızca veri (ve puan durumunu hesaplayan küçük bir mantık) ============
   Şimdilik sabittir: her açılışta aynı lig, aynı fikstür. İleride kayıt sistemi (veritabanı) bu verinin yerini alacak;
   ekranlar veriyi yalnızca buradan ve js/kadrolar.js'ten okur. Bütün takımlar, isimler ve hakemler kurgusaldır.
   takimlar: oynanan haftalardan sonraki durum. G/B/M = galibiyet, beraberlik, mağlubiyet; A/Y = atılan, yenilen gol.
     Puan, oynanan maç ve averaj elle yazılmaz, puanDurumu() hesaplar. id, js/kadrolar.js'teki kulüp anahtarıyla aynıdır.
   sonMaclar: takımın son beş maçı, eskiden yeniye: rakip (takım id), yer (i = iç saha, d = deplasman), a/y (atılan/yenilen).
   buMac: oynanacak maçın bilgileri; ev/konuk js/kadrolar.js'teki kulüp anahtarlarıdır. aradaki: iki takımın aralarındaki son maçlar, yeniden eskiye. */
const LIG={
  ad:'3. Lig',grup:'2. Grup',sezon:'2026–27',
  /* puan durumundaki bölgeler (sıra aralıkları): şampiyon doğrudan çıkar, 2–5 play-off oynar, son üç küme düşer */
  bolgeler:{cikma:[1,1],playoff:[2,5],dusme:[14,16]},
  takimlar:[
    {id:'yildiztepe',ad:'Yıldıztepe SK',G:8,B:3,M:1,A:20,Y:9},
    {id:'akdeniz',ad:'Akdeniz FK',G:8,B:2,M:2,A:21,Y:11},
    {id:'karaova',ad:'Karaova Belediyespor',G:7,B:3,M:2,A:18,Y:12},
    {id:'camlibel',ad:'Çamlıbel SK',G:6,B:4,M:2,A:16,Y:11},
    {id:'demirkapi',ad:'Demirkapı SK',G:6,B:3,M:3,A:18,Y:13},
    {id:'sariyamac',ad:'Sarıyamaç Spor',G:5,B:3,M:4,A:15,Y:14},
    {id:'kocadere',ad:'Kocadere İdman Yurdu',G:4,B:4,M:4,A:15,Y:13},
    {id:'tasharman',ad:'Taşharman SK',G:4,B:4,M:4,A:14,Y:15},
    {id:'ilicakoy',ad:'Ilıcaköy SK',G:4,B:4,M:4,A:13,Y:13},
    {id:'bozkaya',ad:'Bozkaya Spor',G:3,B:4,M:5,A:14,Y:16},
    {id:'mercanli',ad:'Mercanlı SK',G:3,B:4,M:5,A:12,Y:15},
    {id:'degirmenalti',ad:'Değirmenaltı SK',G:2,B:5,M:5,A:12,Y:15},
    {id:'kuyulu',ad:'Kuyulu Gençlik',G:2,B:4,M:6,A:11,Y:17},
    {id:'ardicli',ad:'Ardıçlı SK',G:2,B:4,M:6,A:10,Y:17},
    {id:'sogutlu',ad:'Söğütlü Belediyespor',G:2,B:3,M:7,A:9,Y:18},
    {id:'eskiharman',ad:'Eskiharman SK',G:1,B:4,M:7,A:10,Y:19}
  ],
  sonMaclar:{
    demirkapi:[
      {hafta:8,rakip:'ilicakoy',yer:'i',a:2,y:0},
      {hafta:9,rakip:'sogutlu',yer:'d',a:3,y:1},
      {hafta:10,rakip:'camlibel',yer:'i',a:1,y:1},
      {hafta:11,rakip:'yildiztepe',yer:'d',a:0,y:2},
      {hafta:12,rakip:'mercanli',yer:'i',a:2,y:1}
    ],
    akdeniz:[
      {hafta:8,rakip:'kuyulu',yer:'i',a:3,y:0},
      {hafta:9,rakip:'sariyamac',yer:'d',a:2,y:2},
      {hafta:10,rakip:'eskiharman',yer:'i',a:4,y:1},
      {hafta:11,rakip:'bozkaya',yer:'d',a:2,y:0},
      {hafta:12,rakip:'karaova',yer:'i',a:1,y:2}
    ]
  },
  buMac:{
    hafta:13,gun:'Cumartesi',saat:'19:00',ev:'demirkapi',konuk:'akdeniz',
    hakem:'Kenan Soylu',hava:'Gece · açık · 14°',
    aradaki:[
      {sezon:'2025–26',yarisma:'3. Lig',ev:'akdeniz',konuk:'demirkapi',a:1,y:1},
      {sezon:'2025–26',yarisma:'3. Lig',ev:'demirkapi',konuk:'akdeniz',a:2,y:1},
      {sezon:'2024–25',yarisma:'Kupa',ev:'akdeniz',konuk:'demirkapi',a:3,y:0}
    ]
  }
};
/* puan durumu: oynanan maç, puan ve averajı hesaplar; puan, averaj, atılan gol ve ada göre sıralar */
function puanDurumu(lig){
  return lig.takimlar.map(t=>({...t,O:t.G+t.B+t.M,P:t.G*3+t.B,AV:t.A-t.Y}))
    .sort((a,b)=>b.P-a.P||b.AV-a.AV||b.A-a.A||a.ad.localeCompare(b.ad,'tr'));
}
/* bir maçın sonucu, o takımın gözünden: G, B ya da M */
const macSonucu=m=>m.a>m.y?'G':m.a<m.y?'M':'B';
/* bu maçın ev sahibi ve konuğu (maç motoru ve sahne bu sırayı kullanır) */
const MAC_KADRO=[KADROLAR[LIG.buMac.ev],KADROLAR[LIG.buMac.konuk]];
