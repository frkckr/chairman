/* ============ Chairman — haftanın maçları arkada: Web Worker havuzu (G1-e, 2026-10-24; kullanıcı isteği: "Maçı bitir" doğrudan sonuca) ============
   Maç sayfası açılınca haftanın öbür maçları ve bizim maçın sonuç ikizi işçilerde (js/mac-isci.js) baştan sonuna oynanır; ana iplik yalnız çizer.
     · Öbür maçlar: sonuç (son) ve 5 motor sn'de bir örnek (ornekler). Canlı Skor onları bizim santramızdan beri geçen motor karesine göre okur
       (MAC_ARKA.T0; kilit adımlı eski yolla aynı an, js/lig-maclari.js arkaMacDurum).
     · Sonuç ikizi: bizim maç aynı seçenek ve tohumla, maç öncesi doğal adımlanarak (canlı motor gibi) ve geliştirici panelinin TEST tarz komutları
       karesiyle (komut gelince ikiz yeniden oynanır). "Maçı bitir" basılınca ikiz hazırsa ve izleme ikizi sapmamışsa kart hemen ikizin sonucuyla
       açılır, canlı motor durur (HIZLI_BITIR.anlik; js/mac-sahnesi.js); hazır değilse bizim kalan maç ana iplikte parça parça bitirilir.
       H2-a: perde açıkken ana iplik ile ikiz yarışır — her karenin başında ikize bakılır (maç öncesinde de), hangisi önce biterse.
     · Doğal biten maçta ikizin sonucu canlı motorunkiyle karşılaştırılır (MAC_ARKA.ikizAyni; kartın TEST satırı, akis-deneme).
   Worker kurulamazsa (tarayıcıda file:// adresi; ?arka=0) ya da hata verirse kip 'anaIs': öbür maçlar F7'deki gibi kilit adımlı motorlarla ana
   iplikte oynanır (MAC_ARKA.dusus, js/mac-sahnesi.js ligCanliKur; H2-a: bizim maç bittiyse ya da perde açıksa sıfır adımla kurulur, kalanı
   ligCanliHizli bütçeyle bitirir). Node araçları bu dosyayı yüklemez (js/goruntu.js'ten sonra; motor-yukle).
     arkaBaslat(liste, ikizSecenegi) → kip 'isci' kurulduysa true · arkaIkizKomut({t, hedef, kare}) · arkaIkizHazir() · arkaIkizKarsilastir(mac) */
const MAC_ARKA={kip:'anaIs',hata:null,havuz:[],kuyruk:[],liste:[],ikiz:null,T0:null,ikizAyni:null,dusus:null,bekleme:null};
const ARKA_ISCI_EN_COK=8;
function arkaKapali(){try{return/(^|[?&])arka=0(&|$)/.test(location.search.slice(1));}catch(e){return false;}}
function arkaBaslat(liste,ikizSecenegi,ikizAyar){
  const A=MAC_ARKA;A.liste=liste;
  if(!MAC_GUNU.kariyer||typeof Worker==='undefined'||arkaKapali())return false;
  let dosyalar;
  try{dosyalar=arkaDosyalari([...document.scripts].map(s=>s.getAttribute('src')).filter(Boolean)).map(f=>new URL(f,location.href).href);}
  catch(e){A.hata=String(e&&e.message||e);return false;}
  const isler=liste.filter(x=>!x.son).length+(ikizSecenegi?1:0);
  if(!isler)return false;
  const n=Math.max(1,Math.min(ARKA_ISCI_EN_COK,((typeof navigator!=='undefined'&&navigator.hardwareConcurrency)||2)-1,isler));
  try{for(let i=0;i<n;i++){const w=new Worker('js/mac-isci.js'),I={w,hazir:false,is:null};
      w.onmessage=e=>arkaIleti(I,e.data);w.onerror=e=>{e.preventDefault&&e.preventDefault();arkaDus('işçi hatası: '+(e.message||'yüklenemedi'));};
      w.postMessage({tur:'kur',dosyalar});A.havuz.push(I);}}
  catch(e){for(const I of A.havuz)try{I.w.terminate();}catch(x){}A.havuz.length=0;A.hata=String(e&&e.message||e);return false;}
  A.kip='isci';
  if(ikizSecenegi){A.ikiz={secenek:ikizSecenegi,komutlar:[],surum:0,son:null,oncesi:!(ikizAyar&&ikizAyar.oncesi===false)};arkaIsEkle('ikiz');}   /* RK8-a: TV'de maç öncesisiz */
  for(const x of liste)if(!x.son)arkaIsEkle(x.d.macId);
  return true;
}
function arkaIsEkle(anahtar){const A=MAC_ARKA;if(!A.kuyruk.includes(anahtar))A.kuyruk.push(anahtar);arkaDagit();}
function arkaDagit(){
  const A=MAC_ARKA;if(A.kip!=='isci')return;
  for(const I of A.havuz){
    if(!I.hazir||I.is||!A.kuyruk.length)continue;
    const anahtar=A.kuyruk.shift();
    if(anahtar==='ikiz'){const Z=A.ikiz;if(!Z)continue;I.is={anahtar,surum:Z.surum};
      I.w.postMessage({tur:'oyna',anahtar,surum:Z.surum,secenek:Z.secenek,oncesi:Z.oncesi!==false,komutlar:Z.komutlar});}
    else{const x=A.liste.find(y=>y.d.macId===anahtar);if(!x||x.son)continue;I.is={anahtar,surum:0};
      I.w.postMessage({tur:'oyna',anahtar,surum:0,secenek:x.d.secenek,oncesi:false,komutlar:[]});}
  }
}
function arkaIleti(I,M){
  const A=MAC_ARKA;if(A.kip!=='isci'||!M)return;
  if(M.tur==='hazir'){I.hazir=true;arkaDagit();return;}
  if(M.tur==='hata'){arkaDus('işçi: '+M.mesaj);return;}
  if(M.tur!=='son')return;
  I.is=null;
  if(M.anahtar==='ikiz'){if(A.ikiz&&M.surum===A.ikiz.surum&&M.bitti)A.ikiz.son=M.son;}
  else{const x=A.liste.find(y=>y.d.macId===M.anahtar);if(x&&!x.son&&M.bitti){x.son=M.son;x.ornekler=M.ornekler;}}
  arkaDagit();
}
/* işçi yolu bozuldu: işçiler kapanır, kalan maçlar ana iplikte kilit adımla (MAC_ARKA.dusus) */
function arkaDus(mesaj){
  const A=MAC_ARKA;if(A.kip!=='isci')return;
  for(const I of A.havuz)try{I.w.terminate();}catch(x){}
  A.havuz.length=0;A.kuyruk.length=0;A.kip='anaIs';A.hata=mesaj;A.ikiz=null;
  if(typeof console!=='undefined')console.warn('Arka maçlar ana iplikte: '+mesaj);
  if(A.dusus)A.dusus();
}
/* geliştirici panelinin TEST tarz komutu: ikiz komut listesiyle yeniden oynar */
function arkaIkizKomut(c){const Z=MAC_ARKA.ikiz;if(!Z||MAC_ARKA.kip!=='isci')return;Z.komutlar=Z.komutlar.concat([c]);Z.surum++;Z.son=null;arkaIsEkle('ikiz');}
/* "Maçı bitir" ikizin sonucunu kullanabilir mi: ikiz bitti, komutları güncel, izleme ikizi canlı motordan sapmadı */
function arkaIkizHazir(){
  const A=MAC_ARKA,Z=A.ikiz,I=typeof MAC_IZLEME!=='undefined'?MAC_IZLEME:null;
  return A.kip==='isci'&&!!Z&&!!Z.son&&!(I&&I.sapma>0);
}
/* doğal biten maçta (bir kez): ikizin sonucu canlı motorunkiyle aynı mı */
function arkaIkizKarsilastir(m){
  const A=MAC_ARKA;if(A.ikizAyni!==null||!A.ikiz||!A.ikiz.son||m.phase!=='fulltime')return;
  A.ikizAyni=JSON.stringify(m.sonucKaydi())===JSON.stringify(A.ikiz.son);
  if(!A.ikizAyni&&typeof console!=='undefined')console.warn('Sonuç ikizi canlı maçtan farklı');
}
