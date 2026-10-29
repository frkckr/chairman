/* ============ Chairman — karar anı ekranı (yol haritası N12; ortak sunum bileşeni, kural içermez) ============
   Kullanıcı kararı 2026-10-04: tokalaşma gibi anlarda iki cevaplı, yaklaşık beş saniyelik karar anı açılır (STIL_REHBERI §7/§8,
   OYUN_TASARIMI §10 “Süreli cevaplar”). Sahne durmaz; karenin kenarları hafifçe kararır, üstte kim olduğu yazar, altta kâğıt kart durur.
   H1 (F4; kullanıcı kararları 2026-10-22 ve 2026-10-23, OYUN_TASARIMI §2 “Tek kart”): iki kart yerine dosyadaki, panel ve telefondaki tek kart
   (js/ekran-kart.js kartEtkilesimKur sözleşmesi): kart sola ya da sağa kaydırıldıkça yüzü o cevaba döner, eşiği geçip bırakınca o cevap seçilir,
   altında yerine yaylanır; iki kenar etiketi cevapların adıdır ve yalnız önizler. Klavye: ←/→ önizler, Enter önizleneni seçer, Esc önizlemeyi bırakır;
   1/2 doğrudan seçer (R2 eki'nden beri önizler; aşağıda). Tıklama seçmez. Sol yüz cevaplar[0], sağ yüz cevaplar[1]; sol ve sağ doğru/yanlış ya da renkle kodlanmaz.
   Süre kart yerine oturduktan sonra başlar; ortadan kenarlara eriyen ince çubuk, son saniyelerde amber; rakam yoktur. Seçilen cevap kartın yüzünde
   kısa süre kalır (amber) ve üstüne damga basılır (U2, js/ekran-kart.js kartDamga.bas), sonra kart silinir. Süre dolarsa cevapsız sonucu işler
   (önizleme açıksa yüz nötre döner; damga yok). U2: kartın üstünde dosyadaki kartın üst etiketi (sürüklerken o yönün cevabı belirir, bırakınca
   seçilecekse amber); sürüklemenin kayması kabın içinde sınırlı (ortak bileşen). Duraklat süreyi ve kartın
   hareketini dondurur (zaman karenin dt'siyle ilerler; duraklatmada seçim yapılmaz, önizleme açıktır). Yazı büyüklüğü ayarı uygulanır (OYUN.ayarlar.yazi). Ölçüler ve süreler STIL.an
   (TEST), kartın kayma ve eşik ölçüleri STIL.kagit.kart.
     kararAniAc(kayit, {kim, bitince(secim)})   açar (kayit: KARAR_ANLARI, js/karar-ani.js)
     kararAniKare(dt)                          ilerletir (js/loca-giris.js locaGirisKare)
     KARAR_ANI                                 durum: {acik, t, secim, sure, kalan, onizle} (denemeler okur)
   H2-a (2026-10-26): kariyer maçında rakip başkanın karar anı kapalıdır (js/mac-gunu.js protokol); bu ekran ?rakipBaskan= TEST parametresiyle ve
   kariyersiz adreste açılır. “Maçı bitir” perdesi açıkken karar anı açılırsa perdenin örtüsü gizlenir (js/ekran-mac-sonu.js).
   R2 eki (2026-10-29; kullanıcı kararı, YOL_HARITASI karar 62): Reigns gibi — cevaplar kartta görünmez; kenar etiketleri gizli, üst etiket boş.
   Kaydırınca ya da ←/→ ile yüz o cevaba döner (simge ve adı). 1/2 artık doğrudan seçmez, o cevabı önizler; Enter uygular (gizli cevap körlemesine
   seçilmesin). */
const KARAR_ANI={acik:false,t:0,secim:null,sure:0,kalan:0,kayit:null,bitince:null,bitisT:null,kart:[],onizle:null};
{
  const A=STIL.an,K=STIL.kagit,KA=K.kart,kok=document.getElementById('screen');
  const egimKayma=(KA.egim*KA.kayma/KA.esik).toFixed(2);
  const st=document.createElement('style');st.id='kararAniStili';
  st.textContent=`
.karar-ani{position:absolute;inset:0;z-index:5;pointer-events:none;font-family:var(--govde);font-size:var(--an-boy,var(--k-yaziBoyu,max(14px,1.5cqw)));line-height:1.3;color:${K.yazi}}
.karar-ani[hidden]{display:none}
.ka-kararti{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,rgba(0,0,0,0) 46%,rgba(0,0,0,${A.kararma}) 100%)}
.ka-kim{position:absolute;top:6%;left:50%;transform:translateX(-50%);margin:0;padding:.3em 1em .25em;background:${K.zemin};border:1px solid ${K.cizgi};box-shadow:.2em .3em 0 rgba(0,0,0,.3);
  font-family:var(--display);font-size:1.6em;line-height:1;letter-spacing:.04em;white-space:nowrap;color:${K.kulup}}
.ka-alt{position:absolute;left:6%;right:6%;bottom:6%;height:34%;display:grid;grid-template-rows:auto minmax(0,1fr);gap:.6em}
.ka-sure{position:relative;height:.32em;margin:0 18%}
.ka-sure i{position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:100%;background:${K.serit};border-radius:1em;box-shadow:0 0 0 .08em rgba(0,0,0,.45)}
.ka-sure.ka-amber i{background:${K.vurguZemin};opacity:1}
.ka-kartlar{display:grid;justify-items:center;align-items:stretch;min-height:0}
.karar-ani .ka-kart{position:relative;pointer-events:auto;box-sizing:border-box;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:.4em;width:min(100%,34em);min-width:0;min-height:0;
  padding:.6em .8em .7em;color:${K.yazi};background:${K.serit};border:1px solid ${K.cizgi};border-bottom-width:.28em;border-radius:.5em;box-shadow:.25em .35em 0 rgba(0,0,0,.35);
  touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab;transform-origin:50% 100%;transition:transform ${KA.sure}s ease-out}
.karar-ani .ka-kart.kk-surukle{transition:none;cursor:grabbing}
.karar-ani .ka-kart[data-yuz="sol"]{transform:translateX(-${KA.kayma*100}%) rotate(-${egimKayma}deg)}
.karar-ani .ka-kart[data-yuz="sag"]{transform:translateX(${KA.kayma*100}%) rotate(${egimKayma}deg)}
.karar-ani .ka-kart:focus{outline:none}
.karar-ani .ka-kart:focus-visible{outline:.14em solid ${K.kulup};outline-offset:.12em}
.karar-ani .ka-kart.ka-secildi{background:${K.vurguZemin};border-color:${K.vurgu};color:${K.vurguYazi}}
.ka-yuz{display:grid;align-content:center;justify-items:center;gap:.25em;min-height:0;text-align:center}
.ka-yuz p{margin:0}
.ka-yuz b{font-family:var(--display);font-weight:400;font-size:2.4em;line-height:1;letter-spacing:.02em}
.ka-yuz small{color:${K.soluk};font-size:max(var(--k-enKucuk,12px),.95em)}
.karar-ani .ka-kart.ka-secildi .ka-yuz small{color:${K.vurguYaziSoluk}}
.ka-kenarlar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6em}
.ka-kenarlar[hidden]{display:none}
.ka-yuz .kk-simge{font-size:.9em}
.karar-ani button.ka-kenar{display:flex;align-items:center;gap:.45em;min-width:0;padding:.35em .65em .3em;font:inherit;text-align:left;color:${K.yazi};
  background:${K.zemin};border:1px solid ${K.cizgi};border-bottom-width:.18em;border-radius:.4em;cursor:pointer}
.karar-ani button.ka-kenar[data-yon="sag"]{justify-content:flex-end;text-align:right}
.ka-kenar b{font-family:var(--govde);font-weight:600;font-size:1.15em;line-height:1.15;overflow-wrap:anywhere}
.ka-kenar i{flex:none;font-style:normal;color:${K.soluk}}
.karar-ani button.ka-kenar:hover{border-color:${K.vurgu}}
.karar-ani button.ka-kenar[aria-pressed="true"]{background:${K.vurguZemin};border-color:${K.vurgu};color:${K.vurguYazi}}
.karar-ani button.ka-kenar[aria-pressed="true"] i{color:${K.vurguYaziSoluk}}
`;
  document.head.appendChild(st);
  const E=document.createElement('section');E.className='karar-ani';E.id='kararAni';E.hidden=true;E.setAttribute('role','dialog');E.setAttribute('aria-label','Karar anı');
  E.innerHTML='<div class="ka-kararti"></div><p class="ka-kim"></p><div class="ka-alt"><div class="ka-sure"><i></i></div><div class="ka-kartlar"></div></div>';
  kok.appendChild(E);
  const kararti=E.querySelector('.ka-kararti'),kim=E.querySelector('.ka-kim'),cubuk=E.querySelector('.ka-sure'),dolum=cubuk.firstChild,kartlar=E.querySelector('.ka-kartlar');
  const yumusak=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x);};
  const yazA=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[m]);
  /* kartın yüzü: nötrde kısa yol gösterme (arayüz yazısı), önizlemede ve seçimde o cevap; kenar etiketinin basılı görünüşü yöne göre */
  const yuzYaz=()=>{
    const S=KARAR_ANI,c=S.kart[0];if(!c||!S.kayit)return;
    const y=S.onizle==='sol'||S.onizle==='sag'?S.onizle:null,x=y?S.kayit.cevaplar[y==='sol'?0:1]:null;
    c.dataset.yuz=y||'notr';
    /* U2: seçilen cevabın adı damgadadır (sec → kartDamga.bas); yüz yalnız ekran okuyucuya “Seçildi: …” der, büyük yazı damganın altında kalmaz */
    const secili=S.secilen!==null&&S.secilen!==undefined&&S.secilen>=0;
    c.querySelector('.ka-yuz').innerHTML=secili&&x?'<p style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">Seçildi: '+yazA(x.metin)+'</p>'
      :x?(typeof kartSimge==='function'?kartSimge(x.id):'')+'<p><b>'+yazA(x.metin)+'</b></p>'+(x.alt?'<p><small>'+yazA(x.alt)+'</small></p>':'')
      :'<p><small>Cevabı görmek için kaydır ya da ←/→ (1/2) ile bak, Enter ile cevapla</small></p>';
    for(const b of c.querySelectorAll('.ka-kenar'))b.setAttribute('aria-pressed',b.dataset.yon===y?'true':'false');
  };
  const onizle=y=>{const S=KARAR_ANI;if(!S.acik||S.secim!==null)return;S.onizle=y==='sol'||y==='sag'?y:null;yuzYaz();};
  /* seçim: süre kart yerine oturduktan sonra ve duraklatma yokken; seçilen cevap yüzde kalır */
  function sec(i){const S=KARAR_ANI;if(!S.acik||S.secim!==null||S.t<A.giris||duraklatmaVar())return;S.secim=S.kayit.cevaplar[i].id;S.secilen=i;S.bitisT=S.t;S.onizle=i?'sag':'sol';yuzYaz();
    if(typeof kartDamga!=='undefined'&&S.kart[0]){kartUstEsle(S.kart[0]);kartDamga.bas(S.kart[0],S.kayit.cevaplar[i].metin);}}   /* U2: seçilen cevabın damgası */
  /* sürükleme ve kenar etiketi ortak bileşenden (js/ekran-kart.js); kartta data-sol/data-sag yok: secim yönün kendisidir. Klavye aşağıdaki
     yakalayıcıdadır (karar anı odak beklemez). Kart seçimden sonra da ekranda kaldığı için damgayı sec() kendi kartına basar (damga:false) */
  if(typeof kartEtkilesimKur==='function')kartEtkilesimKur(E,{kart:'.ka-kart',kenar:'.ka-kenar',damga:false,
    uygula:(_,secim)=>sec(secim==='sol'?0:1),
    onizle:(_,y)=>onizle(y),
    kilitli:()=>duraklatmaVar()||KARAR_ANI.t<A.giris||KARAR_ANI.secim!==null});
  addEventListener('keydown',e=>{
    const S=KARAR_ANI;if(!S.acik||e.ctrlKey||e.altKey||e.metaKey)return;
    const c=e.code,i={Digit1:0,Numpad1:0,Digit2:1,Numpad2:1}[c];
    const yut=()=>{e.preventDefault();e.stopImmediatePropagation();};
    if(c==='ArrowLeft'||c==='ArrowRight'){yut();onizle(c==='ArrowLeft'?'sol':'sag');}
    else if(c==='Enter'||c==='NumpadEnter'){yut();if(S.onizle)sec(S.onizle==='sol'?0:1);}
    else if(c==='Escape'&&S.onizle&&S.secim===null){yut();onizle(null);}
    else if(i!==undefined){yut();onizle(i?'sag':'sol');}   /* R2 eki: 1/2 önizler, Enter seçer */},true);
  var kararAniAc=function(kayit,o){
    const S=KARAR_ANI;Object.assign(S,{acik:true,t:0,secim:null,secilen:null,sure:kayit.sure,kalan:kayit.sure,kayit,bitince:o.bitince,bitisT:null,onizle:null});
    E.style.setProperty('--an-boy',yaziBoyuDegeri());   /* U0: ortak ölçek (STIL.kagit.yaziBoyu) */
    kim.textContent=o.kim||'';
    const kenar=(c,i)=>'<button type="button" class="ka-kenar" data-yon="'+(i?'sag':'sol')+'" data-secim="'+yazA(c.id)+'" aria-pressed="false">'+(i?'':'<i aria-hidden="true">◂</i>')+
      '<b>'+yazA(c.metin)+'</b>'+(i?'<i aria-hidden="true">▸</i>':'')+'</button>';
    const C=kayit.cevaplar;
    kartlar.innerHTML='<section class="ka-kart" data-is="an" data-yuz="notr" tabindex="0" role="group" aria-label="Karar">'+
      '<div class="kk-ust" aria-hidden="true"><span class="kk-ustNotr"></span></div>'+
      '<div class="ka-yuz" aria-live="polite"></div>'+
      '<div class="ka-kenarlar" hidden>'+kayit.cevaplar.slice(0,2).map(kenar).join('')+'</div></section>';
    S.kart=[kartlar.querySelector('.ka-kart')];yuzYaz();E.hidden=false;kararAniKare(0);};
  var kararAniKare=function(dt){
    const S=KARAR_ANI;if(!S.acik)return;S.t+=dt;
    /* giriş: kenarlar kararır, kart aşağıdan yerine oturur; süre ancak sonra başlar. Giriş kaydırması kartın kabındadır: kartın kendi
       dönüşümü (sürükleme, önizleme kayması) ortak bileşenindir */
    const g=yumusak(S.t/A.giris);kararti.style.opacity=g;kim.style.opacity=g;
    S.kalan=S.secim===null?Math.max(0,S.sure-Math.max(0,S.t-A.giris)):S.kalan;
    /* süre doldu: sonuç cevapsızdır; önizlenen cevap yüzden ve kenardan kalkar, kart nötr yüzle söner (inceleme 2026-10-26) */
    if(S.secim===null&&S.kalan<=0){S.secim=S.kayit.cevapsiz;S.secilen=-1;S.bitisT=S.t;S.onizle=null;yuzYaz();}
    const sonra=S.bitisT===null?0:yumusak((S.t-S.bitisT)/A.sonra),secildi=S.secilen!==null&&S.secilen>=0;
    if(S.kart[0])S.kart[0].classList.toggle('ka-secildi',secildi);
    kartlar.style.transform='translateY('+((1-g)*60).toFixed(1)+'%)';
    kartlar.style.opacity=S.bitisT===null?g:secildi?1-yumusak((S.t-S.bitisT-A.sonra*0.7)/(A.sonra*0.3)):1-sonra;
    dolum.style.width=(100*S.kalan/S.sure).toFixed(2)+'%';cubuk.classList.toggle('ka-amber',S.kalan<=A.amber&&S.secim===null);
    cubuk.style.opacity=S.bitisT===null?g:1-sonra;
    if(S.bitisT!==null&&S.t-S.bitisT>=A.sonra){const f=S.bitince,s=S.secim;S.acik=false;E.hidden=true;S.bitince=null;if(f)f(s);}};
}
