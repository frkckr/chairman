/* ============ Demirkapı '99 — stadyum tarifleri ============
   Yalnızca veri; çizim kodu yoktur. Görüntü katmanı (js/stadyum.js, js/seyirci.js) bu tarifleri okur.
   Kariyer 3. Lig kasaba statında başlar. İleride oyun ekonomisi (para, başarı) statı geliştirecek ve doluluğu belirleyecek.

   Tribün yerleri: ana = başkanın oturduğu uzun kenar, karsi = karşı uzun kenar, kale1 = batı kale arkası, kale2 = doğu kale arkası.
   Tribün tipleri: oturma = koltuklu, ayakta = beton basamak, set = toprak/çim set.
   cati: tribünün arkadan ne kadarının örtülü olduğu (0 = çatısız, 1 = tamamı).
   taraftar: ev | karisik. bolumler: tribünün bir kısmını başka taraftara ayırır (from/to metre, tribün ortasına göre).
   zemin: 0 (tarla) – 1 (halı gibi). pist: yok | toprak | tartan.
   projektor.tip: direk = köşelerde direk, cati = çatı kenarında lamba sırası. */
const STADYUMLAR={
  kasaba:{
    ad:'Demirkapı İlçe Stadı',lig:'3. Lig',
    pist:'toprak',zemin:0.22,cevre:'apartman',
    projektor:{tip:'direk',konumlar:[[-60,-42],[60,-42],[-60,42],[60,42]],yukseklik:22,guc:0.8},
    reklam:0.45,telOrgu:['karsi','kale1','kale2'],
    tabela:{tip:'elle',konum:[-63,-30]},
    tribunler:[
      {yer:'ana',tip:'oturma',uzunluk:46,sira:10,cati:0.5,koltuk:'#b8b2a4',taraftar:'karisik',baskanSira:3},
      {yer:'karsi',tip:'ayakta',uzunluk:72,sira:7,taraftar:'ev',mesale:true},
      {yer:'kale1',tip:'set',uzunluk:40,sira:6,taraftar:'karisik',bolumler:[{from:-20,to:20,taraftar:'deplasman'}]},
      {yer:'kale2',tip:'set',uzunluk:36,sira:5,taraftar:'karisik'}
    ]
  },
  sehir:{
    ad:'Demirkapı Şehir Stadı',lig:'1. Lig',
    pist:'tartan',zemin:0.72,cevre:'yok',
    projektor:{tip:'cati',konumlar:[[-72,-58],[72,-58],[-72,58],[72,58]],yukseklik:40,guc:1},
    reklam:1,telOrgu:['kale2'],
    tabela:{tip:'ampullu',konum:[74,-46]},
    tribunler:[
      {yer:'ana',tip:'oturma',uzunluk:124,sira:27,egim:0.58,cati:0.6,koltuk:'#9a2a22',taraftar:'karisik',baskanSira:9,
       bolumler:[{from:34,to:38,taraftar:'bos'},{from:38,to:62,taraftar:'deplasman'}]},
      {yer:'karsi',tip:'oturma',uzunluk:124,sira:15,egim:0.49,koltuk:'#9a2a22',taraftar:'karisik'},
      {yer:'kale1',tip:'oturma',uzunluk:80,sira:25,egim:0.55,cati:0.6,koltuk:'#9a2a22',taraftar:'karisik'},
      {yer:'kale2',tip:'oturma',uzunluk:80,sira:25,egim:0.55,cati:0.6,koltuk:'#9a2a22',taraftar:'ev',mesale:true}
    ]
  },
  arena:{
    ad:'Demirkapı Arena',lig:'Avrupa',
    pist:'yok',zemin:0.95,cevre:'yok',
    projektor:{tip:'cati',konumlar:[[-62,-48],[62,-48],[-62,48],[62,48]],yukseklik:34,guc:1.15},
    reklam:1,telOrgu:[],
    tabela:{tip:'ampullu',konum:[62,-46]},
    tribunler:[
      {yer:'ana',tip:'oturma',uzunluk:112,sira:30,egim:0.62,cati:1,koltuk:'#b0241c',taraftar:'karisik',baskanSira:8},
      {yer:'karsi',tip:'oturma',uzunluk:112,sira:30,egim:0.62,cati:1,koltuk:'#b0241c',taraftar:'karisik'},
      {yer:'kale1',tip:'oturma',uzunluk:74,sira:26,egim:0.62,cati:1,koltuk:'#b0241c',taraftar:'karisik',
       bolumler:[{from:14,to:37,taraftar:'deplasman'}]},
      {yer:'kale2',tip:'oturma',uzunluk:74,sira:26,egim:0.62,cati:1,koltuk:'#b0241c',taraftar:'ev',mesale:true}
    ]
  }
};

/* Maç günü: tariften ayrı durur. doluluk ve deplasman 0–1 arası.
   Şimdilik deneme için adres satırından okunur (örnek: index.html?stat=sehir&doluluk=0.8&zemin=0.5).
   İleride bu değerleri oyun ekonomisi ve maçın önemi belirleyecek. */
const VARSAYILAN_DOLULUK={kasaba:0.3,sehir:0.75,arena:0.95};
const MAC_GUNU=(()=>{
  let q=null;try{q=new URLSearchParams(location.search);}catch(e){}
  const sayi=(ad,varsayilan)=>{const v=q&&parseFloat(q.get(ad));return isFinite(v)?clamp(v,0,1):varsayilan;};
  const stat=q&&STADYUMLAR[q.get('stat')]?q.get('stat'):'kasaba';
  return{stat,doluluk:sayi('doluluk',VARSAYILAN_DOLULUK[stat]),deplasman:sayi('deplasman',0.08),zemin:sayi('zemin',STADYUMLAR[stat].zemin)};
})();
const STAT={...STADYUMLAR[MAC_GUNU.stat],zemin:MAC_GUNU.zemin};
