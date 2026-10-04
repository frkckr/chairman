/* ============ Chairman — karar anı ekranı (yol haritası N12; ortak sunum bileşeni, kural içermez) ============
   Kullanıcı kararı 2026-10-04: tokalaşma gibi anlarda iki büyük cevaplı, yaklaşık beş saniyelik karar anı açılır (STIL_REHBERI §7/§8,
   OYUN_TASARIMI §10 “Süreli cevaplar”). Sahne durmaz; karenin kenarları hafifçe kararır, üstte kim olduğu yazar, altta iki büyük kâğıt kart
   durur. Sol ve sağ doğru/yanlış diye kodlanmaz. Süre kartlar yerine oturduktan sonra başlar; ortadan kenarlara eriyen ince çubuk, son
   saniyelerde amber; rakam yoktur. Fare, ←/→ ya da 1/2 ile seçilir. Seçilen kart kısa süre kalır, öbürü silinir. Süre dolarsa cevapsız
   sonucu işler. Duraklat süreyi ve kartların hareketini dondurur (zaman karenin dt'siyle ilerler; duraklatmada seçim yapılmaz).
   Yazı büyüklüğü ayarı uygulanır (OYUN.ayarlar.yazi). Ölçüler ve süreler STIL.an (TEST).
     kararAniAc(kayit, {kim, bitince(secim)})   açar (kayit: KARAR_ANLARI, js/karar-ani.js)
     kararAniKare(dt)                          ilerletir (js/loca-giris.js locaGirisKare)
     KARAR_ANI                                 durum: {acik, t, secim, sure, kalan} (denemeler okur) */
const KARAR_ANI={acik:false,t:0,secim:null,sure:0,kalan:0,kayit:null,bitince:null,bitisT:null,kart:[]};
{
  const A=STIL.an,K=STIL.kagit,kok=document.getElementById('screen');
  const st=document.createElement('style');st.id='kararAniStili';
  st.textContent=`
.karar-ani{position:absolute;inset:0;z-index:5;pointer-events:none;font-family:var(--mono);font-size:var(--an-boy,1.3cqw);line-height:1.3;color:${K.yazi}}
.karar-ani[hidden]{display:none}
.ka-kararti{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,rgba(0,0,0,0) 46%,rgba(0,0,0,${A.kararma}) 100%)}
.ka-kim{position:absolute;top:6%;left:50%;transform:translateX(-50%);margin:0;padding:.3em 1em .25em;background:${K.zemin};border:1px solid ${K.cizgi};box-shadow:.2em .3em 0 rgba(0,0,0,.3);
  font-family:var(--display);font-size:1.6em;line-height:1;letter-spacing:.04em;white-space:nowrap;color:${K.kulup}}
.ka-alt{position:absolute;left:6%;right:6%;bottom:6%;height:34%;display:grid;grid-template-rows:auto 1fr;gap:.6em}
.ka-sure{position:relative;height:.32em;margin:0 18%}
.ka-sure i{position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:100%;background:${K.serit};border-radius:1em;box-shadow:0 0 0 .08em rgba(0,0,0,.45)}
.ka-sure.ka-amber i{background:${K.vurguZemin};opacity:1}
.ka-kartlar{display:grid;grid-template-columns:1fr 1fr;gap:4%;align-items:stretch}
.karar-ani button.ka-kart{pointer-events:auto;display:grid;align-content:center;gap:.3em;min-width:0;padding:.7em 1em;text-align:center;cursor:pointer;
  font:inherit;color:${K.yazi};background:${K.serit};border:1px solid ${K.cizgi};border-bottom-width:.28em;border-radius:.5em;box-shadow:.25em .35em 0 rgba(0,0,0,.35)}
.karar-ani button.ka-kart b{font-family:var(--display);font-weight:400;font-size:2.4em;line-height:1;letter-spacing:.02em}
.karar-ani button.ka-kart small{color:${K.soluk};font-size:.95em}
.karar-ani button.ka-kart:hover{border-color:${K.vurgu}}
.karar-ani button.ka-kart:focus-visible{outline:.14em solid ${K.kulup};outline-offset:.12em}
.karar-ani button.ka-kart.ka-secildi{background:${K.vurguZemin};border-color:${K.vurgu};color:#1a1203}
`;
  document.head.appendChild(st);
  const E=document.createElement('section');E.className='karar-ani';E.id='kararAni';E.hidden=true;E.setAttribute('role','dialog');E.setAttribute('aria-label','Karar anı');
  E.innerHTML='<div class="ka-kararti"></div><p class="ka-kim"></p><div class="ka-alt"><div class="ka-sure"><i></i></div><div class="ka-kartlar"></div></div>';
  kok.appendChild(E);
  const kararti=E.querySelector('.ka-kararti'),kim=E.querySelector('.ka-kim'),cubuk=E.querySelector('.ka-sure'),dolum=cubuk.firstChild,kartlar=E.querySelector('.ka-kartlar');
  const yumusak=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x);};
  function sec(i){const S=KARAR_ANI;if(!S.acik||S.secim!==null||S.t<A.giris||duraklatmaVar())return;S.secim=S.kayit.cevaplar[i].id;S.secilen=i;S.bitisT=S.t;}
  kartlar.addEventListener('click',e=>{const b=e.target.closest('.ka-kart');if(b)sec(+b.dataset.i);});
  addEventListener('keydown',e=>{if(!KARAR_ANI.acik)return;const i={ArrowLeft:0,Digit1:0,Numpad1:0,ArrowRight:1,Digit2:1,Numpad2:1}[e.code];
    if(i!==undefined){e.preventDefault();e.stopImmediatePropagation();sec(i);}},true);
  var kararAniAc=function(kayit,o){
    const S=KARAR_ANI;Object.assign(S,{acik:true,t:0,secim:null,secilen:null,sure:kayit.sure,kalan:kayit.sure,kayit,bitince:o.bitince,bitisT:null});
    const buyuk=typeof OYUN!=='undefined'&&OYUN.ayarlar&&OYUN.ayarlar.yazi==='buyuk';E.style.setProperty('--an-boy',(buyuk?A.yazi.buyuk:A.yazi.normal)+'cqw');
    kim.textContent=o.kim||'';
    kartlar.innerHTML=kayit.cevaplar.map((c,i)=>'<button type="button" class="ka-kart" data-i="'+i+'"><b>'+c.metin.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[m])+'</b>'+(c.alt?'<small>'+c.alt+'</small>':'')+'</button>').join('');
    S.kart=[...kartlar.children];E.hidden=false;kararAniKare(0);};
  var kararAniKare=function(dt){
    const S=KARAR_ANI;if(!S.acik)return;S.t+=dt;
    /* giriş: kenarlar kararır, kartlar aşağıdan yerine oturur; süre ancak sonra başlar */
    const g=yumusak(S.t/A.giris);kararti.style.opacity=g;kim.style.opacity=g;
    S.kalan=S.secim===null?Math.max(0,S.sure-Math.max(0,S.t-A.giris)):S.kalan;
    if(S.secim===null&&S.kalan<=0){S.secim=S.kayit.cevapsiz;S.secilen=-1;S.bitisT=S.t;}
    const sonra=S.bitisT===null?0:yumusak((S.t-S.bitisT)/A.sonra);
    S.kart.forEach((b,i)=>{const kalan=S.secilen===i;b.classList.toggle('ka-secildi',kalan);
      b.style.transform='translateY('+((1-g)*60).toFixed(1)+'%)';b.style.opacity=S.bitisT===null?g:kalan?1-yumusak((S.t-S.bitisT-A.sonra*0.7)/(A.sonra*0.3)):1-sonra;});
    dolum.style.width=(100*S.kalan/S.sure).toFixed(2)+'%';cubuk.classList.toggle('ka-amber',S.kalan<=A.amber&&S.secim===null);
    cubuk.style.opacity=S.bitisT===null?g:1-sonra;
    if(S.bitisT!==null&&S.t-S.bitisT>=A.sonra){const f=S.bitince,s=S.secim;S.acik=false;E.hidden=true;S.bitince=null;if(f)f(s);}};
}
