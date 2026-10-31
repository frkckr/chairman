/* ============ Chairman — odada lig maçlarının arkada hesabı (görüntü katmanı; kural yok; RK7, 2026-11-01) ============
   Öbür maçlar kendi saatinde lig maçı işiyle oynanır (js/lig-takvimi.js). Bir maçın motor hesabı birkaç saniyedir; İlerle hafta sonunu geçerken ana
   iplikte art arda hesaplansa ekran donardı. Zamanı ilerleten komut önce kariyerin kopyasında denenir: sağlayıcı havuzda olmayan ilk maçta durur ve o
   maçın o anki planını (seçenek, tohum) bildirir. O maç ve sonraki dört günde (hafta sonunun hepsi) bitecek öbür maçlar (denemenin o anki kopyasından planlanır)
   maç işçilerinde (js/mac-isci.js) paralel hesaplanır, sonuçlar LIG_MAC_HAVUZU'na girer, deneme yinelenir; deneme maç istemeden biterse gerçek komut
   havuzla uygulanır. Böylece İlerle yolda erken durursa (karar, haber) ilerideki maçlar boşuna beklenmez; havuzdaki sonuç yalnız seçeneği ve tohumu
   birebir aynı maçta kullanılır (kural kendisi de hesaplayabilir; aynı motorda sonuç her yolda aynıdır).
   Ön hesap: oda boştayken (kariyer değiştikten bir an sonra) sıradaki İlerle aynı yolla denenir ve gereken maçlar işçilerin yarısıyla arkada hesaplanmaya
   başlar (örtü yok, çizim sürer); İlerle'ye basılınca yalnız kalanı beklenir ve bütün işçiler kullanılır. Kariyer arada değişirse (karar, transfer) plan
   değişen maçın sonucu kullanılmaz (anahtar tutmaz), boşa gider; doğruluk etkilenmez.
   İşçi kurulamazsa (file:// adresi, ?arka=0) ön hesap yoktur, maçlar İlerle'de ana iplikte birer birer hesaplanır, arada ekran çizilir.
     ligMaclariniHazirla(k, komut, ilerleme(n, tahmin), bitince)  komut: kariyer → (zamanı ilerleten kural komutu); maç gerekmezse bitince aynı çağrıda
     ligHesapSuruyor() → true: ekran başka komut başlatmaz
     ligOnHesapKontrol()        oda sayfasında saniyede bir (kariyer değiştiyse sıradaki İlerle'nin maçları arkada) */
'use strict';
const LIG_HESAP={isciler:[],kurulamadi:false,suruyor:false,ISCI_EN_COK:8,PENCERE:5760,gunluk:[],kuyruk:[],yolda:new Map(),dinleyici:null,onSon:null,onAcik:true};   /* gunluk: son hesapların ölçüsü (akış denetimi okur) */
const ligGunluk=(olay,n)=>{const G=LIG_HESAP.gunluk;G.push({t:Math.round(performance.now()),olay,n});if(G.length>80)G.shift();};
const LIG_IHTIYAC={lig:'ihtiyac'};
const ligHesapSuruyor=()=>LIG_HESAP.suruyor;
const ligIsciSayisi=()=>Math.max(1,Math.min(LIG_HESAP.ISCI_EN_COK,((typeof navigator!=='undefined'&&navigator.hardwareConcurrency)||2)-1));
/* işçi kurulabilir mi (kurmadan): file:// adresinde ve ?arka=0'da yok */
function ligIsciMumkun(){
  if(LIG_HESAP.kurulamadi||typeof Worker==='undefined')return false;
  try{return!(/(^|[?&])arka=0(&|$)/.test(location.search.slice(1))||location.protocol==='file:');}catch(e){return false;}
}
function ligHesapIsciKur(n){
  const H=LIG_HESAP;if(!ligIsciMumkun())return false;
  if(H.isciler.length>=n)return true;
  let dosyalar;
  try{dosyalar=arkaDosyalari([...document.scripts].map(s=>s.getAttribute('src')).filter(Boolean)).map(f=>new URL(f,location.href).href);}catch(e){H.kurulamadi=true;return false;}
  try{while(H.isciler.length<n){const w=new Worker('js/mac-isci.js'),I={w,hazir:false,is:null};
      w.onmessage=e=>ligIsciIleti(I,e.data);w.onerror=e=>{if(e&&e.preventDefault)e.preventDefault();ligIsciDus();};
      w.postMessage({tur:'kur',dosyalar});H.isciler.push(I);}}
  catch(e){ligIsciDus();return false;}
  return true;
}
/* iş kuyruğu: öncelikli (İlerle'nin beklediği) işler öne; arkada (ön hesap) en çok işçilerin yarısı çalışır */
function ligIsEkle(j,oncelik){
  const H=LIG_HESAP;if(LIG_MAC_HAVUZU.has(j.a)||H.yolda.has(j.a))return;
  const i=H.kuyruk.findIndex(x=>x.a===j.a);if(i>=0){if(!oncelik)return;H.kuyruk.splice(i,1);}
  if(oncelik)H.kuyruk.unshift(j);else H.kuyruk.push(j);
}
function ligDagit(){
  const H=LIG_HESAP,sinir=H.suruyor?Infinity:Math.max(1,Math.floor(H.isciler.length/2));let mesgul=H.isciler.filter(I=>I.is).length;
  for(const I of H.isciler){
    if(!I.hazir||I.is)continue;
    let j=H.kuyruk.shift();while(j&&LIG_MAC_HAVUZU.has(j.a))j=H.kuyruk.shift();
    if(!j)break;if(mesgul>=sinir){H.kuyruk.unshift(j);break;}
    I.is=j;H.yolda.set(j.a,j);mesgul++;ligGunluk(H.suruyor?'gonder':'onGonder',1);
    I.w.postMessage({tur:'oyna',anahtar:j.a,surum:0,secenek:j.P.secenek,oncesi:false,komutlar:[]});
  }
}
function ligIsciIleti(I,M){
  const H=LIG_HESAP;M=M||{};
  if(M.tur==='hazir'){I.hazir=true;ligDagit();return;}
  if(M.tur==='hata'){ligIsciDus();return;}
  if(M.tur!=='son')return;
  const j=I.is;I.is=null;
  if(j){H.yolda.delete(j.a);if(M.bitti){LIG_MAC_HAVUZU.set(j.a,M.son);ligGunluk(H.suruyor?'mac':'onMac',1);}}
  ligDagit();if(H.dinleyici)H.dinleyici();
}
/* işçi yolu bozuldu: işçiler kapanır, yoldaki işler kuyruğa döner; bekleyen İlerle kalanı ana iplikte hesaplar */
function ligIsciDus(){
  const H=LIG_HESAP;for(const I of H.isciler){try{I.w.terminate();}catch(x){}}
  H.isciler.length=0;H.kurulamadi=true;for(const j of H.yolda.values())H.kuyruk.unshift(j);H.yolda.clear();
  if(H.dinleyici)H.dinleyici();
}
/* komutu kopyada dener: havuzda olmayan ilk maçın {plan, k (o anki kopya), an} ya da null */
function ligDene(k,komut){
  const eski=LIG_MAC_SAGLAYICI;let ihtiyac=null;
  LIG_MAC_SAGLAYICI=(kk,p)=>{ihtiyac={plan:p,k:kk,an:simdikiAn(kk)};throw LIG_IHTIYAC;};
  try{kariyerKomut(k,komut);}catch(e){}finally{LIG_MAC_SAGLAYICI=eski;}
  return ihtiyac;
}
/* ihtiyaçtan sonra hesaplanacaklar: o maç ve o anki kopyada önümüzdeki PENCERE dk içinde bitecek, havuzda olmayan öbür maçlar */
function ligTopluluk(ih){
  const L=[{a:ligMacAnahtari(ih.plan),P:ih.plan}],gor=new Set([L[0].a]);
  for(const x of Object.values(ih.k.isler).filter(x=>x.tur==='ligMaci'&&isSonAn(x)<=ih.an+LIG_HESAP.PENCERE)){
    const f=ih.k.fikstur.find(y=>y.id===x.veri.macId);if(!f||ih.k.maclar[f.id]||f.tarihBekliyor)continue;
    let P;try{P=digerMacPlani(ih.k,f);}catch(e){continue;}
    if(P.hukmen)continue;const a=ligMacAnahtari(P);if(gor.has(a)||LIG_MAC_HAVUZU.has(a))continue;gor.add(a);L.push({a,P});}
  return L;
}
function ligMaclariniHazirla(k,komut,ilerleme,bitince){
  const H=LIG_HESAP;let ih=ligDene(k,komut);
  if(!ih){bitince();return;}
  H.suruyor=true;let n=0;
  const tahmin=()=>{let t=0;try{const o=ilerleOnizle(k);t=o&&o.hedef!=null?yaklasanLigMaclari(k,o.hedef).length:0;}catch(e){}return Math.max(t,n+1);};
  const bitti=()=>{H.suruyor=false;H.dinleyici=null;ligDagit();bitince();};
  if(ilerleme)ilerleme(0,tahmin());
  const isci=ligHesapIsciKur(ligIsciSayisi());
  /* ana iplikte birer birer (işçi yok ya da düştü); arada ekran çizilir */
  const anaIplik=(is,sonra)=>{const adim=()=>{let j=is.shift();while(j&&LIG_MAC_HAVUZU.has(j.a))j=is.shift();if(!j){sonra();return;}
      try{LIG_MAC_HAVUZU.set(j.a,arkaMacOynat(Match,j.P.secenek,{oncesi:false}).son);n++;ligGunluk('mac',n);if(ilerleme)ilerleme(n,tahmin());}catch(e){}setTimeout(adim,0);};setTimeout(adim,30);};
  /* bir topluluğu hesaplar (ön hesabın bitirdikleri ve yoldakiler sayılır), sonra yeniden dener */
  const tur=()=>{
    const is=ligTopluluk(ih);ligGunluk('topluluk',is.filter(j=>!LIG_MAC_HAVUZU.has(j.a)).length);
    const sonra=()=>{ligGunluk('dene',0);ih=ligDene(k,komut);ligGunluk('denendi',ih?1:0);if(!ih){bitti();return;}tur();};
    if(is.every(j=>LIG_MAC_HAVUZU.has(j.a))){/* plan havuzda ama deneme yine istedi: ana iplikte (güvenlik) */try{LIG_MAC_HAVUZU.set(ligMacAnahtari(ih.plan),arkaMacOynat(Match,ih.plan.secenek,{oncesi:false}).son);}catch(e){bitti();return;}n++;sonra();return;}
    if(!isci||!H.isciler.length){anaIplik(is.slice(),sonra);return;}
    for(const j of is.slice().reverse())ligIsEkle(j,true);
    let son=-1;
    H.dinleyici=()=>{
      const kalan=is.filter(j=>!LIG_MAC_HAVUZU.has(j.a)).length,yapilan=is.length-kalan;
      if(yapilan!==son){son=yapilan;n=Math.max(n,yapilan);if(ilerleme)ilerleme(n,Math.max(tahmin(),is.length));}
      if(!kalan){H.dinleyici=null;sonra();return;}
      if(!H.isciler.length){H.dinleyici=null;anaIplik(is.filter(j=>!LIG_MAC_HAVUZU.has(j.a)),sonra);}
    };
    ligDagit();H.dinleyici();
  };
  tur();
}
/* ön hesap: kariyer değiştiyse (komut, gözlem) sıradaki İlerle kopyada denenir; gereken maçlar arkada (işçilerin yarısıyla) kuyruğa girer */
function ligOnHesapKontrol(){
  const H=LIG_HESAP;if(!H.onAcik||H.suruyor||!ligIsciMumkun()||typeof OYUN==='undefined')return;
  const k=OYUN.kariyer;if(!k||k===H.onSon)return;
  if(typeof MAC_GUNU!=='undefined'&&MAC_GUNU.macId)return;   /* maç sayfası: haftanın maçları js/mac-arka.js'te */
  H.onSon=k;
  let ih=null;try{ih=ligDene(k,x=>duragaIlerle(x));}catch(e){ih=null;}
  if(!ih||!ligHesapIsciKur(ligIsciSayisi()))return;
  const is=ligTopluluk(ih);ligGunluk('onTopluluk',is.length);
  for(const j of is)ligIsEkle(j,false);
  ligDagit();
}
if(typeof window!=='undefined'&&typeof setInterval==='function')setInterval(()=>{try{ligOnHesapKontrol();}catch(e){}},1000);
