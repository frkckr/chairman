/* Chairman — A2 karşılaştırması: maç sayfasında (index.html) çizimi dondurulmuş "önce" animasyonuna çevirir (2026-10-08).
   Dondurulmuş dosya (araclar/karsilastir/once/animasyon.js, araclar/karsilastir/dondur.js üretir) bir işlevin içinde çalıştırılır: üst
   düzey adları (EKLEM, ANM_POZ, POSE …) yerel kalır, oyunun adlarıyla çakışmaz. Aktörlerin modelleri korunur; her aktörün animasyon
   durumu eski kurulumla yeniden kurulur ve js/mac-sahnesi.js'in adıyla çağırdığı aktorKur, aktorGuncelle, topCiz, animasyonOlay
   eskisine döner. Motor değişmez (aynı tohumla aynı maç). Sayfa yüklendikten sonra, ilk maç karesinden önce çağrılır.
   Kullananlar: araclar/animasyon-karsilastir.html, araclar/animasyon-olcum.py --once, araclar/an-yakala.py --anm once. */
function anmOnceYukle(w,kaynak){
  const once=w.eval('(function(){\n'+kaynak+'\n;return {aktorKur,aktorGuncelle,topCiz,animasyonOlay};\n})()');
  const AKTORLER=w.eval('AKTORLER'),asilPlayer=w.player,asilGolge=w.golgeEkle;
  try{
    w.golgeEkle=()=>{};
    for(const a of AKTORLER){
      w.player=()=>a.m;
      const y=once.aktorKur(null,a.kaynak,a.boy);
      for(const k in y)a[k]=y[k];   /* model ve kaynak aynı; eşofman (a.esofman) gibi dış alanlar kalır */
    }
  }finally{w.player=asilPlayer;w.golgeEkle=asilGolge;}
  w.aktorKur=once.aktorKur;w.aktorGuncelle=once.aktorGuncelle;w.topCiz=once.topCiz;w.animasyonOlay=once.animasyonOlay;
  w.ANM_SURUM='once';
  return AKTORLER.length;
}
