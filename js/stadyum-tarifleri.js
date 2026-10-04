/* ============ Chairman — stadyum tarifi ============
   Yalnızca veri; çizim kodu yoktur. Görüntü katmanı (js/stadyum.js statKur, js/seyirci.js) bu tarifi okur.
   Kulübün tek stadı vardır (2.8D, kullanıcı kararı 2026-10-01): oda penceresi, balkon ve ev sahibi maçı aynı tariften kurulur; gündüz boş
   tribün ile gece dolu tribün aynı yapının farklı hâlleridir. Ayrı şehir stadı kaldırıldı; stat, kariyerdeki yatırımla etap etap gelişecek
   (yol haritası 8.3). Lig değişimi otomatik stat değişimi yaratmaz. Avrupa arenası şimdilik yok.

   2026-10-02 kararı (2.8J): başlangıç stadı mütevazı, ÇATISIZ bir kasaba/ilçe stadıdır: kısa beton tribünler, az koltuk, alçak kale arkası setleri,
   seyrek reklam, alçak projektörler. Çatı, koltuk ve kapsamlı iyileştirmeler yatırımla gelir (8.3); tarif o zaman etap etap değişir.

   Tribün yerleri: ana = başkanın oturduğu uzun kenar, karsi = karşı uzun kenar, kale1 = batı kale arkası, kale2 = doğu kale arkası.
   Tribün tipleri: oturma = koltuklu, ayakta = beton basamak, set = toprak/çim set.
   cati: tribünün arkadan ne kadarının örtülü olduğu (0 ya da yok = çatısız, 1 = tamamı). Başlangıç stadında hiçbir tribünün çatısı yoktur.
   taraftar: ev | karisik. bolumler: tribünün bir kısmını başka taraftara ayırır (from/to metre, tribün ortasına göre).
   baskanSira: başkan bölümünün ilk sırası (altında geçit; başkan bölümü 4 sıradır). Altındaki sıralar maçta başkanın önünde görünür.
   protokol: başkan bölümünün tribünün üstünde yükseltilmiş beton loca olarak ne kadar (metre) yukarıda olduğu; küçük tribünde başkanın
     yüksek bakışını korur (2.8D'nin yüksek koltuğu). Başkan koltuğu ve kamera bu geometriden hesaplanır.
   bakim: {yer, u} tribün onarımının yapıldığı yer (u: tribün boyunca -0.5…0.5); onarım başlayınca iskele burada durur (js/balkon.js).
   tabela: tek fiziksel tabela. konum [x, z] metre, yukseklik: direklerin boyu, genislik: tabelanın eni. Başkanın yerine döner.
   zemin: 0 (tarla) – 1 (halı gibi). pist: yok | toprak | tartan.
   projektor.tip: direk = köşelerde direk, cati = çatı kenarında lamba sırası.
   tunelX: oyuncuların sahaya çıktığı tünelin yeri (ana tribün önünde, orta çizgiden metre; verilmezse 0 = başkanın altı).
   kulubeX: yedek kulübelerinin orta çizgiden uzaklığı (metre; ev sahibi solda).
   loca (2.8O, kullanıcı kararı 2026-10-02): başkanın maçı izlediği yer. Ana tribünün arkasındaki kulüp binasında, odanın balkonunun bir kat
     üstündedir (balkon döşemesinden kat metre yukarıda, tribünün arka duvarından geri metre geride); genislik/derinlik locanın ölçüsü.
     Yüksek ve geniş bakış: yedek kulübeleri ve sahanın büyük kısmı başını çevirmeden görünür. Başkan koltuğu ve kamera buradan hesaplanır;
     tribündeki protokol bölümü diğer yöneticilerindir. N5 (kullanıcı kararı 2026-10-04): başkanın yeri biraz yükseldi (kat 2,2 → 3,0).
     TEST değerleri. */
const STADYUMLAR={
  kulup:{
    ad:'Demirkapı İlçe Stadı',lig:'3. Lig',
    pist:'toprak',zemin:0.22,cevre:'apartman',
    projektor:{tip:'direk',konumlar:[[-58,-40],[58,-40],[-58,40],[58,40]],yukseklik:17,guc:0.75},
    reklam:0.32,telOrgu:['karsi','kale1','kale2'],
    tabela:{tip:'elle',konum:[-20,49],yukseklik:6.5,genislik:13},
    bakim:{yer:'karsi',u:0.3},tunelX:-19,kulubeX:7,
    tribunler:[
      {yer:'ana',tip:'oturma',uzunluk:40,sira:9,koltuk:'#b8b2a4',taraftar:'karisik',baskanSira:5,protokol:1.5,loca:{kat:3.0,geri:6.2,genislik:9,derinlik:4.2}},
      {yer:'karsi',tip:'ayakta',uzunluk:60,sira:5,taraftar:'ev',mesale:true},
      {yer:'kale1',tip:'set',uzunluk:34,sira:4,taraftar:'karisik',bolumler:[{from:-17,to:17,taraftar:'deplasman'}]},
      {yer:'kale2',tip:'set',uzunluk:28,sira:3,taraftar:'karisik'}
    ]
  }
};

/* Maç günü: tariften ayrı durur. doluluk ve deplasman 0–1 arası. 2.8O (2026-10-02): geliştirici panelindeki doluluk/zemin ayarı ve
   ?doluluk/?zemin/?deplasman adres parametreleri kaldırıldı; değerler sabittir. İleride oyun ekonomisi ve maçın önemi belirleyecek. */
const VARSAYILAN_DOLULUK=0.3;
const MAC_GUNU={stat:'kulup',doluluk:VARSAYILAN_DOLULUK,deplasman:0.08,zemin:STADYUMLAR.kulup.zemin};
const STAT={...STADYUMLAR[MAC_GUNU.stat],zemin:MAC_GUNU.zemin};
