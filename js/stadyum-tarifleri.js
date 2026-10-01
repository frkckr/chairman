/* ============ Chairman — stadyum tarifi ============
   Yalnızca veri; çizim kodu yoktur. Görüntü katmanı (js/stadyum.js statKur, js/seyirci.js) bu tarifi okur.
   Kulübün tek stadı vardır (2.8D, kullanıcı kararı 2026-10-01): oda penceresi, balkon ve ev sahibi maçı aynı tariften kurulur; gündüz boş
   tribün ile gece dolu tribün aynı yapının farklı hâlleridir. Ayrı şehir stadı kaldırıldı; stat, kariyerdeki yatırımla etap etap gelişecek
   (yol haritası 8.3). Lig değişimi otomatik stat değişimi yaratmaz. Avrupa arenası şimdilik yok.

   Tribün yerleri: ana = başkanın oturduğu uzun kenar, karsi = karşı uzun kenar, kale1 = batı kale arkası, kale2 = doğu kale arkası.
   Tribün tipleri: oturma = koltuklu, ayakta = beton basamak, set = toprak/çim set.
   cati: tribünün arkadan ne kadarının örtülü olduğu (0 = çatısız, 1 = tamamı).
   taraftar: ev | karisik. bolumler: tribünün bir kısmını başka taraftara ayırır (from/to metre, tribün ortasına göre).
   baskanSira: başkan bölümünün ilk sırası (altında geçit; başkan bölümü 4 sıradır). Altındaki sıralar maçta başkanın önünde görünür.
   zemin: 0 (tarla) – 1 (halı gibi). pist: yok | toprak | tartan.
   projektor.tip: direk = köşelerde direk, cati = çatı kenarında lamba sırası.
   tunelX: oyuncuların sahaya çıktığı tünelin yeri (ana tribün önünde, orta çizgiden metre; verilmezse 0 = başkanın altı). TEST değerleri. */
const STADYUMLAR={
  kulup:{
    ad:'Demirkapı İlçe Stadı',lig:'3. Lig',
    pist:'toprak',zemin:0.22,cevre:'apartman',
    projektor:{tip:'direk',konumlar:[[-60,-42],[60,-42],[-60,42],[60,42]],yukseklik:22,guc:0.8},
    reklam:0.45,telOrgu:['karsi','kale1','kale2'],
    tabela:{tip:'elle',konum:[-63,-30]},tunelX:-19,
    tribunler:[
      {yer:'ana',tip:'oturma',uzunluk:46,sira:12,koltuk:'#b8b2a4',taraftar:'karisik',baskanSira:8},
      {yer:'karsi',tip:'ayakta',uzunluk:72,sira:7,cati:0.45,taraftar:'ev',mesale:true},
      {yer:'kale1',tip:'set',uzunluk:40,sira:6,taraftar:'karisik',bolumler:[{from:-20,to:20,taraftar:'deplasman'}]},
      {yer:'kale2',tip:'set',uzunluk:36,sira:5,taraftar:'karisik'}
    ]
  }
};

/* Maç günü: tariften ayrı durur. doluluk ve deplasman 0–1 arası.
   Şimdilik deneme için adres satırından okunur (örnek: index.html?doluluk=0.8&zemin=0.5). Eski ?stat= değeri yok sayılır (tek stat).
   İleride bu değerleri oyun ekonomisi ve maçın önemi belirleyecek. */
const VARSAYILAN_DOLULUK=0.3;
const MAC_GUNU=(()=>{
  let q=null;try{q=new URLSearchParams(location.search);}catch(e){}
  const sayi=(ad,varsayilan)=>{const v=q&&parseFloat(q.get(ad));return isFinite(v)?clamp(v,0,1):varsayilan;};
  return{stat:'kulup',doluluk:sayi('doluluk',VARSAYILAN_DOLULUK),deplasman:sayi('deplasman',0.08),zemin:sayi('zemin',STADYUMLAR.kulup.zemin)};
})();
const STAT={...STADYUMLAR[MAC_GUNU.stat],zemin:MAC_GUNU.zemin};
