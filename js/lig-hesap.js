/* ============ Chairman — odada lig maçlarının arkada hesabı (görüntü katmanı; kural yok; RK7, 2026-11-01) ============
   Öbür maçlar kendi saatinde lig maçı işiyle oynanır (js/lig-takvimi.js). Bir maçın motor hesabı birkaç saniyedir; İlerle hafta sonunu geçerken ana
   iplikte art arda hesaplansa ekran donardı. Zamanı ilerleten komut önce kariyerin kopyasında denenir: sağlayıcı havuzda olmayan ilk maçta durur ve o
   maçın o anki planını (seçenek, tohum) bildirir. O maç ve sonraki dört günde (hafta sonunun hepsi) bitecek öbür maçlar (denemenin o anki kopyasından planlanır)
   maç işçilerinde (js/mac-isci.js) paralel hesaplanır, sonuçlar LIG_MAC_HAVUZU'na girer, deneme yinelenir; deneme maç istemeden biterse gerçek komut
   havuzla uygulanır. Böylece İlerle yolda erken durursa (karar, haber) ilerideki maçlar boşuna beklenmez; havuzdaki sonuç yalnız seçeneği ve tohumu
   birebir aynı maçta kullanılır (kural kendisi de hesaplayabilir; sonuç her yolda aynıdır).
   İşçi kurulamazsa (file:// adresi, ?arka=0) maçlar ana iplikte birer birer hesaplanır, arada ekran çizilir.
     ligMaclariniHazirla(k, komut, ilerleme(n, tahmin), bitince)  komut: kariyer → (zamanı ilerleten kural komutu); maç gerekmezse bitince aynı çağrıda
     ligHesapSuruyor() → true: ekran başka komut başlatmaz */
'use strict';
const LIG_HESAP={isciler:[],kurulamadi:false,suruyor:false,ISCI_EN_COK:8,PENCERE:5760,gunluk:[]};   /* gunluk: son hesapların ölçüsü (akış denetimi okur) */
const ligGunluk=(olay,n)=>{const G=LIG_HESAP.gunluk;G.push({t:Math.round(performance.now()),olay,n});if(G.length>60)G.shift();};
const LIG_IHTIYAC={lig:'ihtiyac'};
const ligHesapSuruyor=()=>LIG_HESAP.suruyor;
function ligHesapIsciKur(n){
  const H=LIG_HESAP;if(H.kurulamadi||typeof Worker==='undefined')return false;
  try{if(/(^|[?&])arka=0(&|$)/.test(location.search.slice(1))||location.protocol==='file:')return false;}catch(e){}
  if(H.isciler.length>=n)return true;
  let dosyalar;
  try{dosyalar=arkaDosyalari([...document.scripts].map(s=>s.getAttribute('src')).filter(Boolean)).map(f=>new URL(f,location.href).href);}catch(e){H.kurulamadi=true;return false;}
  try{while(H.isciler.length<n){const w=new Worker('js/mac-isci.js'),I={w,hazir:false,is:null};
      w.onmessage=e=>{if((e.data||{}).tur==='hazir')I.hazir=true;};w.postMessage({tur:'kur',dosyalar});H.isciler.push(I);}}
  catch(e){H.kurulamadi=true;for(const I of H.isciler)try{I.w.terminate();}catch(x){}H.isciler.length=0;return false;}
  return true;
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
  const bitti=()=>{H.suruyor=false;bitince();};
  if(ilerleme)ilerleme(0,tahmin());
  const sayi=Math.max(1,Math.min(H.ISCI_EN_COK,((typeof navigator!=='undefined'&&navigator.hardwareConcurrency)||2)-1));
  const isci=ligHesapIsciKur(sayi);
  /* bir topluluğu hesaplar, sonra yeniden dener */
  const tur=()=>{
    const is=ligTopluluk(ih).filter(j=>!LIG_MAC_HAVUZU.has(j.a));ligGunluk('topluluk',is.length);
    const sonra=()=>{ligGunluk('dene',0);ih=ligDene(k,komut);ligGunluk('denendi',ih?1:0);if(!ih){bitti();return;}tur();};
    if(!is.length){/* plan havuza girdi ama deneme yine istedi: ana iplikte (güvenlik) */try{LIG_MAC_HAVUZU.set(ligMacAnahtari(ih.plan),arkaMacOynat(Match,ih.plan.secenek,{oncesi:false}).son);}catch(e){bitti();return;}n++;sonra();return;}
    const yaz=(j,son)=>{LIG_MAC_HAVUZU.set(j.a,son);n++;ligGunluk('mac',n);if(ilerleme)ilerleme(n,tahmin());};
    if(!isci||!H.isciler.length){
      const adim=()=>{const j=is.shift();if(!j){sonra();return;}try{yaz(j,arkaMacOynat(Match,j.P.secenek,{oncesi:false}).son);}catch(e){}setTimeout(adim,0);};
      setTimeout(adim,30);return;}
    const kuyruk=is.slice();let kalan=is.length,dustu=false;
    const dagit=()=>{for(const I of H.isciler){if(!I.hazir||I.is||!kuyruk.length)continue;const j=kuyruk.shift();I.is=j;
      I.w.postMessage({tur:'oyna',anahtar:j.a,surum:0,secenek:j.P.secenek,oncesi:false,komutlar:[]});}};
    const dus=()=>{if(dustu)return;dustu=true;for(const I of H.isciler){try{I.w.terminate();}catch(x){}}H.isciler.length=0;H.kurulamadi=true;
      const geri=is.filter(j=>!LIG_MAC_HAVUZU.has(j.a));const adim=()=>{const j=geri.shift();if(!j){sonra();return;}try{yaz(j,arkaMacOynat(Match,j.P.secenek,{oncesi:false}).son);}catch(e){}setTimeout(adim,0);};setTimeout(adim,30);};
    for(const I of H.isciler){
      I.w.onmessage=e=>{const M=e.data||{};if(dustu)return;
        if(M.tur==='hazir'){I.hazir=true;dagit();return;}
        if(M.tur==='hata'){dus();return;}
        if(M.tur==='son'){const j=I.is;I.is=null;if(j&&M.bitti)yaz(j,M.son);kalan--;if(kalan<=0){sonra();return;}dagit();}};
      I.w.onerror=e=>{if(e&&e.preventDefault)e.preventDefault();dus();};
    }
    dagit();
  };
  tur();
}
