/* ============ Chairman — stadyum tarifi ============
   Yalnızca veri; çizim kodu yoktur. Görüntü katmanı (js/stadyum.js statKur, js/seyirci.js) bu tarifi okur.
   Kulübün tek stadı vardır (2.8D, kullanıcı kararı 2026-10-01): oda penceresi, balkon ve ev sahibi maçı aynı tariften kurulur; gündüz boş
   tribün ile gece dolu tribün aynı yapının farklı hâlleridir. Ayrı şehir stadı kaldırıldı; stat, kariyerdeki yatırımla etap etap gelişecek
   (yol haritası 8.3). Lig değişimi otomatik stat değişimi yaratmaz. Avrupa arenası şimdilik yok.

   2026-10-02 kararı (2.8J): başlangıç stadı mütevazı, ÇATISIZ bir kasaba/ilçe stadıdır: kısa beton tribünler, az koltuk, alçak kale arkası setleri,
   seyrek reklam, alçak projektörler. Çatı, koltuk ve kapsamlı iyileştirmeler yatırımla gelir (8.3); tarif o zaman etap etap değişir.

   Tribün yerleri: ana = başkanın oturduğu uzun kenar, karsi = karşı uzun kenar, kale1 = batı kale arkası, kale2 = doğu kale arkası.
   Tribün tipleri: oturma = koltuklu, ayakta = beton basamak, set = toprak/çim set, yamac = kayaya oyulmuş ayakta basamaklar (P2: arkası
     doğrudan kaya yamaç; js/stadyum-cevre.js yamacı terasların hemen arkasından yükseltir).
   P2 (kullanıcı kararı 2026-10-21 gece; tarif v2): mesafe = çizgiden (taç ya da kale çizgisi) tribünün önüne metre; verilmezse pistli statta
     8, pistsizde 6. uzunluk tribünün boyu (kompakt kasaba stadında uzun kenarlar tam boy). bolumler[].durum: acik (varsayılan) | kapali
     (boş bölüm, seyirci oturmaz) | insaat (basamaklar brandayla örtülü, iskele ve bariyer; yer ve kapasite yok). Reklam panoları, tel
     örgü, çevre duvarı, kapı yolları, tabelanın dönüşü, tünel körüğü ve (verilmezse) projektör direkleri bu ölçülerden türetilir (js/stadyum.js
     STAT_OLCU). Motorun okuduğu tünel, kulübe ve taraftar noktaları değişmez (TEKNIK_PLAN §8).
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
     TEST değerleri.
   cevre (N8, kullanıcı kararı 2026-10-04): stadın çevresi, her cephe ayrı (çizim js/stadyum-cevre.js). Kasaba stadı: yüksek bina zorunlu değil,
     ufukta boşluk kalmaz; örnek, bir kale arkası kaya yamaca yaslanan Braga stadı. Kulübün şehri açık karar olduğundan belirli bir şehri gösteren
     yapı yoktur.
     cepheler: {yer: tribünün yeri, tip}. yamac = basamaklı kaya yüzü (yukseklik m, basamak sayısı), üstte çamlar; evler = sokak, bahçe duvarlı
       bir-iki katlı kiremit çatılı evler, kavaklar (sira: arka arkaya ev sırası); kapi = çevre duvarında stat kapısı ve gişeler, sokak, lambalar,
       araçlar, az katlı dükkânlar; kulupBinasi = locayı taşıyan kulüp binası, armalı giriş, otopark, bahçe duvarı, arka sokak. kulupBinasi yalnız
       maç kurulumunda kurulur: balkon ve pencere kurulumunda stat 180° döner, bina odanın içine düşer (loca ile aynı kural).
     ufuk: stadı çevreleyen tepe sıraları {yaricap, yukseklik: [en az, en çok]} (yakından uzağa). duvar: çevre duvarının yüksekliği.
   kapilar (N8; seyircinin girişi N9): {tribun, u: tribün boyunca −0.5…0.5}. Oturma ve ayakta tribünde arka duvarda giriş ağzı, setin girişi
     çevredeki kapıdan; her girişin karşısında çevre duvarında (ya da tel örgüde) kapı vardır. */
const STADYUMLAR={
  kulup:{
    ad:'Demirkapı İlçe Stadı',lig:'3. Lig',
    pist:'yok',zemin:0.22,
    cevre:{
      cepheler:[{yer:'kale2',tip:'yamac',yukseklik:30,basamak:5},{yer:'karsi',tip:'evler',sira:4},{yer:'kale1',tip:'kapi'},{yer:'ana',tip:'kulupBinasi'}],
      ufuk:[{yaricap:205,yukseklik:[17,36]},{yaricap:290,yukseklik:[34,78]}],duvar:2.4
    },
    kapilar:[{tribun:'ana',u:-0.38},{tribun:'ana',u:0.38},{tribun:'karsi',u:-0.3},{tribun:'karsi',u:0.3},{tribun:'kale1',u:0},{tribun:'kale2',u:-0.5}],
    projektor:{tip:'direk',yukseklik:17,guc:0.75},
    reklam:0.32,telOrgu:['karsi','kale1','kale2'],
    tabela:{tip:'elle',konum:[-20,47],yukseklik:6.5,genislik:13},
    bakim:{yer:'karsi',u:0.41},tunelX:-19,kulubeX:7,
    /* P2 (2026-10-21 gece): kompakt kasaba stadı — pist yok, üç tarafta tribün (uzun kenarlar tam boy, çatısız), doğu kale arkası kaya yamaçta
       ayakta basamaklar (Braga). Ana tribün çizgiye 6,7 m (yedek kulübelerinin arkası), karşı 5, batı kale arkası 5,5, yamaç 6. Karşıda demo
       inşaat bölümü (tribün gelişimi maçta görünür). TEST değerleri */
    tribunler:[
      {yer:'ana',tip:'oturma',mesafe:6.7,uzunluk:100,sira:9,koltuk:'#b8b2a4',taraftar:'karisik',baskanSira:5,protokol:1.5,loca:{kat:3.0,geri:6.2,genislik:9,derinlik:4.2}},
      {yer:'karsi',tip:'ayakta',mesafe:5,uzunluk:100,sira:7,taraftar:'ev',mesale:true,bolumler:[{from:32,to:50,taraftar:'bos',durum:'insaat'}]},
      {yer:'kale1',tip:'set',mesafe:5.5,uzunluk:40,sira:4,taraftar:'karisik',bolumler:[{from:-17,to:17,taraftar:'deplasman'}]},
      {yer:'kale2',tip:'yamac',mesafe:6,uzunluk:44,sira:5,taraftar:'ev'}
    ]
  }
};

/* F1-c (2026-10-23; OYUN_TASARIMI §11: başka kulüplerin statları aynı tarif modelinden): ligin öbür kulüplerinin statı aynı kompakt kasaba
   stadı modelinden kulübün kimliğiyle üretilir (özet → tohumlu rastlantı); her kariyerde aynı kulübün statı aynıdır. Hep çatısız ve pistsiz;
   ana tribün koltuklu (başkan bölümü, protokol ve loca — konuk başkan oradadır); karşı tribün ayakta, koltuklu ya da set (ev taraftarı); batı kale
   arkasında deplasman bölümü (motorun deplasman taraftarı noktası buradan); doğu kale arkası set, ayakta ya da boş. Yamaç Demirkapı'nındır.
   Ad, koltuk rengi, ölçüler ve çevre TEST değeridir: kulüplerin kimliği kullanıcıdan gelince tarif kulübe özel yazılabilir.
   statTarifiUret(kulüp kimliği, kulübün adı) → STADYUMLAR.kulup biçiminde tarif */
const STAT_KOLTUKLAR=['#b8b2a4','#8e3a32','#2f5a8a','#3d6b45','#c9a43a','#6b6f78','#7a4a8a'];
function statTarifiUret(kulupId,kulupAdi){
  const r=tohumluRastgele(parseInt(saglamaHesapla('stat:'+kulupId),16)),sec=L=>L[Math.floor(r()*L.length)],ara=(a,b,o)=>+(a+r()*(b-a)).toFixed(o||0);
  const ilk=String(kulupAdi||kulupId).split(' ')[0],anaSira=ara(7,10),karsiTip=sec(['ayakta','ayakta','oturma','set']),kale2Tip=sec(['set','ayakta',null]);
  const karsi={yer:'karsi',tip:karsiTip,mesafe:ara(5,6.5,1),uzunluk:ara(70,100),sira:ara(4,8),taraftar:'ev'};
  if(karsiTip==='oturma')karsi.koltuk=sec(STAT_KOLTUKLAR);
  if(r()<0.5)karsi.mesale=true;
  const tribunler=[
    /* ana tribün en az 6,7 m: yedek kulübeleri sabit yerde (js/stadyum.js, z −39,2) ve tribünün ön duvarı onların arkasında kalmalı (F1-c incelemesi) */
    {yer:'ana',tip:'oturma',mesafe:ara(6.7,7.4,1),uzunluk:ara(70,100),sira:anaSira,koltuk:sec(STAT_KOLTUKLAR),taraftar:'karisik',baskanSira:anaSira-4,protokol:1.5,
      loca:{kat:3.0,geri:6.2,genislik:9,derinlik:4.2}},
    karsi,
    {yer:'kale1',tip:sec(['set','ayakta']),mesafe:ara(5,6.5,1),uzunluk:ara(32,44),sira:ara(3,5),taraftar:'karisik',bolumler:[{from:-15,to:15,taraftar:'deplasman'}]}];
  if(kale2Tip)tribunler.push({yer:'kale2',tip:kale2Tip,mesafe:ara(5,6.5,1),uzunluk:ara(30,44),sira:ara(3,5),taraftar:'ev'});
  /* tabela karşı tribünün arkasında (sıra derinliği js/stadyum.js SIRA ile aynı) ve karşı kapılarından birinin ekseninde: seyircinin yolu iki
     direğin arasından geçer (F1-c incelemesi: ±20 m'deki tabelanın direği bir statta kapı yolunun üstüne düşüyordu) */
  const tabelaZ=34+karsi.mesafe+{oturma:0.8,ayakta:0.55,set:1}[karsiTip]*karsi.sira+3;
  return{ad:ilk+' '+sec(['İlçe Stadı','Şehir Stadı','Stadı']),lig:'3. Lig',pist:'yok',zemin:ara(0.12,0.3,2),
    cevre:{cepheler:[{yer:'karsi',tip:'evler',sira:ara(2,5)},{yer:'kale1',tip:'kapi'},{yer:'ana',tip:'kulupBinasi'}],
      ufuk:[{yaricap:205,yukseklik:[ara(6,17),ara(20,36)]},{yaricap:290,yukseklik:[ara(18,34),ara(40,78)]}],duvar:ara(2.2,2.6,1)},
    kapilar:[{tribun:'ana',u:-0.38},{tribun:'ana',u:0.38},{tribun:'karsi',u:-0.3},{tribun:'karsi',u:0.3},{tribun:'kale1',u:0}].concat(kale2Tip?[{tribun:'kale2',u:0}]:[]),
    projektor:{tip:'direk',yukseklik:ara(14,18),guc:ara(0.6,0.85,2)},
    reklam:ara(0.15,0.45,2),telOrgu:['karsi','kale1'].concat(kale2Tip?['kale2']:[]),
    tabela:{tip:'elle',konum:[+((r()<0.5?-1:1)*0.3*karsi.uzunluk).toFixed(1),+tabelaZ.toFixed(1)],yukseklik:6.5,genislik:13},
    tunelX:sec([-19,-14,14,19]),kulubeX:7,
    tribunler};
}

/* Maç günü (MAC_GUNU) ve bu maçın stat tarifi (STAT) F1-b'den (2026-10-23) beri js/mac-gunu.js'tedir: maç kariyerden kurulur, stat maçın
   ev sahibinden seçilir. Doluluk ve deplasman payı orada (2.8O'dan beri sabit, TEST). */
