/* ============ Chairman — tek karar kartı: dosya, karar paneli, telefon konuşması ve karar anı için ortak bileşen (görüntü katmanı; H1, F4) ============
   Kullanıcı kararları (2026-10-22, 2026-10-23; OYUN_TASARIMI §2 “Tek kart”): başkanlık kararı tek karttır. Kart sola ya da sağa kaydırıldıkça yüzü o
   yönün cevabına döner; bırakınca o cevap uygulanır. Sol yüz secenekler[0], sağ yüz secenekler[1]; sol ve sağ doğru/yanlış ya da renkle kodlanmaz.
   Kural içermez: içerik js/ajanda.js ajandaOnizle'den gelir; uygulama ev sahibinin tek komutudur (ajandaIsiYap(k,id,secim)). Görünüm seçenek kesmez,
   seçmez. Renkler bugünkü kâğıt dilinden (STIL.kagit, --k-*); ölçü ve hareket STIL.kagit.kart (TEST). Dosya ve telefon ölçüleri kendi dosyalarında.
     kararKarti(k, isId, s) → html. s: {onizle:'sol'|'sag'|null, gorus, ozetsiz, kapali, dosyaBaglanti, dosyada, testSecenek}
       DOM: div.kk-alan > section.kk-kart[data-is][data-yuz=notr|sol|sag][data-sol=<id>][data-sag=<id>] (tabindex=0, role=group, aria-label “Karar”;
       kilitliyken aria-disabled="true", önizlenen yüzün engeli varken data-engel) > .kk-yuz (nötr: konu, hazır görüş, son cevap, cevapsız sonucu;
       önizlemede: cevabın metni, süresi, bilinen sonuçları, engel, kaçırılacak ve cevapsız kalacak işler, TEST kutusu), .kk-kenarlar (iki
       button.kk-kenar[data-yon][data-secim][data-eylem="kartOnizle"]; engelli cevabın kenarı aria-disabled ve nedeni kısa), .kk-not (dosya bağlantısı).
       Önizlenen yüzün uyarıları o cevabın süresiyle hesaplanır (ajandaOnizle o seçeneğin kimliğiyle çağrılır). İki cevaplı olmayan kararda kart kurulmaz.
       kapali: kart kilitli, nedeni yüzde (maç telefonu); duraklatmada da kilitli (“Duraklatıldı: devam edince cevaplanır.”).
     kartEtkilesimKur(kok, {uygula(isId, secim, yon), onizle(isId, yon|null), kilitli(), kart, kenar})  kök başına bir kez; delege olaylar.
       Sürükleme: kart yatay kayar (translateX ve en çok STIL.kagit.kart.egim derece eğim); kayma kart genişliğinin onizle katını geçince yüz o yönün
       cevabına döner (onizle), bırakınca kayma esik katını geçmişse ve cevap engelsiz, kart kilitsiz ise uygula; aksi hâlde kart sure içinde yerine
       yaylanır ve yüz nötre döner. Dikey hareket sayfayı kaydırır (touch-action: pan-y). Klavye (kart odaktayken): ←/→ önizler (kart kayma kadar
       kayar), Enter önizlenen cevabı uygular, Esc yalnız önizleme varken onu bırakır (olay yutulur; yoksa ev sahibinin Esc'i çalışır). Kenar etiketine
       tıklamak önizler (aynı kenara ikinci tıklama önizlemeyi bırakır; tıklama hiçbir zaman uygulamaz); kart gövdesine tıklamak hiçbir şey yapmaz.
       Sürüklemeden sonraki tıklama yutulur. Ev sahibi önizlemede yeniden çizebilir: kart data-is ile yeniden bulunur, duruşu ve işaretçi yakalaması
       yeni karta taşınır. secim: kartın data-sol/data-sag değeri (yoksa yön). kart/kenar: seçiciler (varsayılan .kk-kart, .kk-kenar; karar anı kendi
       sınıflarını verebilir). Ayrıntı TEKNIK_PLAN §10, STIL_REHBERI §7. */
const yazT=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
/* stil masaüstü kopyası yalnız js/ klasörünü taşıdığı için buradan belgeye eklenir */
(function kartStili(){
  if(typeof document==='undefined'||document.getElementById('kartStili'))return;
  const A=STIL.kagit.kart,st=document.createElement('style');st.id='kartStili';
  /* alan kartın iki yanında önizleme kayması kadar boşluk bırakır (klavye ya da kenar önizlemesinde kart kırpılmaz); sürüklemede kenardan taşan kısım
     kırpılır, sayfa yatay kaymaz */
  const egimKayma=(A.egim*A.kayma/A.esik).toFixed(2),yan=(A.kayma/(1+2*A.kayma)*100).toFixed(2);
  st.textContent=`
.kk-alan{display:grid;padding:0 ${yan}%;overflow-x:clip;overflow-clip-margin:.6em}
.kk-kart{position:relative;display:grid;gap:.5em;min-width:0;padding:.6em .7em;background:var(--k-serit);border:1px solid var(--k-cizgi);border-top:.3em solid var(--k-kirmizi);
  border-radius:.3em;box-shadow:.12em .18em 0 var(--k-golge);color:var(--k-yazi);touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab;
  transform-origin:50% 100%;transition:transform ${A.sure}s ease-out}
.kk-kart:focus{outline:none}
.kk-kart:focus-visible{outline:.14em solid var(--k-kulup);outline-offset:.12em}
.kk-kart.kk-surukle{transition:none;cursor:grabbing}
.kk-kart[data-yuz="sol"]{transform:translateX(-${A.kayma*100}%) rotate(-${egimKayma}deg)}
.kk-kart[data-yuz="sag"]{transform:translateX(${A.kayma*100}%) rotate(${egimKayma}deg)}
.kk-kart[aria-disabled="true"]{cursor:default}
.kk-kart p{margin:0}
.kk-yuz{display:grid;gap:.35em;align-content:start;min-width:0;font-size:${A.yuz.normal}em}
.kk-konu{font-size:1.05em;line-height:1.35}
.kk-gorus{padding:.2em .5em;border-left:.2em solid var(--k-vurguZemin);font-size:.92em}
.kk-gorus b{margin-right:.3em}
.kk-secenek{display:flex;flex-wrap:wrap;align-items:baseline;gap:.2em .6em}
.kk-secenek b{font-size:1.15em;line-height:1.2;font-weight:600}
.kk-sure{color:var(--k-soluk);font-size:.9em}
.kk-bilgi{color:var(--k-soluk);font-size:.92em;line-height:1.3}
.kk-not{color:var(--k-soluk);font-size:.9em}
.kk-uyari,.kk-kart .kk-uyari{color:var(--k-kirmizi)}
.kk-kenarlar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5em}
.kk-kart .kk-kenar{display:flex;align-items:center;gap:.4em;min-width:0;width:100%;padding:.35em .55em .3em;font:inherit;text-align:left;color:var(--k-yazi);
  background:var(--k-zemin);border:1px solid var(--k-cizgi);border-bottom-width:.18em;border-radius:.3em;cursor:pointer}
.kk-kart .kk-kenar[data-yon="sag"]{justify-content:flex-end;text-align:right}
.kk-kenar>span{display:grid;gap:.05em;min-width:0}
.kk-kenar b{font-weight:600;line-height:1.15;overflow-wrap:anywhere}
.kk-kenar small{color:var(--k-soluk);font-size:.84em;line-height:1.2;overflow-wrap:anywhere}
.kk-kenar .kk-ok{flex:none;font-style:normal;color:var(--k-soluk)}
.kk-kart .kk-kenar[aria-pressed="true"]{background:var(--k-vurguZemin);border-color:var(--k-vurgu);color:#1a1203}
.kk-kart .kk-kenar[aria-pressed="true"] small,.kk-kart .kk-kenar[aria-pressed="true"] .kk-ok{color:#3a2a08}
.kk-kart .kk-kenar[aria-disabled="true"]{opacity:.6;border-style:dashed}
.kk-kart .kk-kenar[aria-disabled="true"] small{color:var(--k-kirmizi)}
`;
  document.head.appendChild(st);
})();

/* ---- hazır görüş: kararı soranın ya da ilgili yöneticinin görüşü (konuşmada ve karar panelinde gösterilir; dosyada "Bilinenler"dedir) ---- */
function kararGorusu(k,v){
  if(typeof meseleOlayi!=='function'||!v.meseleId)return'';
  const ol=meseleOlayi(k,v.meseleId),G=ol?ol.bilgiler.filter(b=>k.kisiler[b.kaynak]&&b.kaynak!==k.baskanId&&/\.tavsiye\./.test(b.anahtar)):[];
  return G.slice(-1).map(b=>'<p class="kk-gorus"><b>'+yazT(k.kisiler[b.kaynak].ad)+'</b> '+yazT(MESELE_OLAYLARI[b.anahtar](k,b.p))+'</p>').join('');
}

/* ---- tek kart ---- */
function kararKarti(k,isId,s={}){
  const is=k.isler[isId];
  if(!is||is.tur!=='ajanda'||!is.veri.karar)return'';
  const v=is.veri,o0=ajandaOnizle(k,isId),S=o0.secenekler;
  /* bugün tek canlı yol iki seçenektir (KARAR_TURLERI sözleşmesi); başka sayıda seçenek kart kurmaz, karar da uygulanmaz */
  if(S.length!==2)return'<p class="kk-uyari">Bu karar iki cevaplı değil.</p>';
  /* H1-a geçici uyumluluk: önizleme vermeyen eski ev sahibinin seçimi (s.secim) önizlenen yüze çevrilir; H1-b'den sonra ev sahipleri s.onizle verir */
  let yon=s.onizle!==undefined?s.onizle:s.secim===S[0].id?'sol':s.secim===S[1].id?'sag':null;
  if(yon!=='sol'&&yon!=='sag')yon=null;
  const x=yon?S[yon==='sol'?0:1]:null,o=x?ajandaOnizle(k,isId,x.id):o0,xs=x?(o.secenek||x):null;
  const kilit=s.kapali||(typeof duraklatmaVar==='function'&&duraklatmaVar()?'Duraklatıldı: devam edince cevaplanır.':null);
  const engel=o.engel.filter(e=>!/Bir seçenek/.test(e));
  const sureYazi=c=>{const d=c.sure!==undefined?c.sure:v.sure;return d?d+' dk':'zaman almaz';};
  let yuz='';
  if(!xs){
    if(!s.ozetsiz){yuz+='<p class="kk-konu">'+yazT(v.aciklama)+'</p>';if(s.gorus)yuz+=kararGorusu(k,v);}
    const alt=[];
    if(v.saatsiz&&!s.dosyada)alt.push('Son cevap: '+(is.tarih===k.tarih?'bugün ':gunAyYazi(is.tarih)+' ')+saatYazi(is.dakika));
    if(zamanAsimiVar(is))alt.push(zamanAsimiMetni(k,is));
    if(alt.length)yuz+='<p class="kk-not">'+alt.map(yazT).join(' · ')+'</p>';
    if(!s.kapali)for(const e of engel)yuz+='<p class="kk-uyari">'+yazT(e)+'</p>';
  }else{
    yuz+='<p class="kk-secenek"><b>'+yazT(xs.metin)+'</b><span class="kk-sure">'+yazT(sureYazi(xs))+'</span></p>';
    for(const a of (xs.aciklama||[]).filter(Boolean))yuz+='<p class="kk-bilgi">'+yazT(a)+'</p>';
    for(const e of engel)yuz+='<p class="kk-uyari">'+yazT(e)+'</p>';
    if(!s.kapali){
      if(o.atlanacak.length)yuz+='<p class="kk-uyari">Bu karar zaman alır; kaçırılacak: '+o.atlanacak.map(a=>yazT(a.veri.baslik+' ('+saatYazi(a.dakika)+')')).join(', ')+'</p>';
      if(o.cevapsiz.length)yuz+='<p class="kk-uyari">Bu arada cevapsız kalacak: '+o.cevapsiz.map(a=>yazT(a.veri.baslik)).join(', ')+'</p>';
    }
    if(s.testSecenek)yuz+=s.testSecenek(isId,xs);
  }
  if(kilit)yuz+='<p class="kk-not">'+yazT(kilit)+'</p>';
  const kenar=i=>{
    const c=S[i],y=i?'sag':'sol',ok='<i class="kk-ok" aria-hidden="true">'+(i?'▸':'◂')+'</i>';
    return'<button type="button" class="kk-kenar" data-eylem="kartOnizle" data-yon="'+y+'" data-secim="'+yazT(c.id)+'" aria-pressed="'+(yon===y?'true':'false')+'"'+
      (c.engel?' aria-disabled="true" title="'+yazT(c.engel)+'"':'')+'>'+(i?'':ok)+'<span><b>'+yazT(c.metin)+'</b><small>'+yazT(c.engel||sureYazi(c))+'</small></span>'+(i?ok:'')+'</button>';
  };
  let ic='<div class="kk-alan"><section class="kk-kart" data-is="'+yazT(isId)+'" data-yuz="'+(yon||'notr')+'" data-sol="'+yazT(S[0].id)+'" data-sag="'+yazT(S[1].id)+'" tabindex="0" role="group" aria-label="Karar"'+
    (kilit?' aria-disabled="true"':'')+(xs&&engel.length?' data-engel="1"':'')+'>'+
    '<div class="kk-yuz" aria-live="polite">'+yuz+'</div><div class="kk-kenarlar">'+kenar(0)+kenar(1)+'</div>';
  if(s.dosyaBaglanti&&v.meseleId)ic+='<p class="kk-not"><button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+v.meseleId+'" data-donus="telefon">Dosyayı aç ▸</button></p>';
  return ic+'</section></div>';
}

/* ---- etkileşim: sürükleme, kenar etiketi ve klavye; kök başına bir kez kurulur ---- */
function kartEtkilesimKur(kok,o){
  if(!kok||kok.dataset.kartEtkilesim)return;
  kok.dataset.kartEtkilesim='1';
  const A=STIL.kagit.kart,KART=o.kart||'.kk-kart',KENAR=o.kenar||'.kk-kenar',ESIK_PX=6;
  const bul=id=>{for(const c of kok.querySelectorAll(KART))if(c.dataset.is===id)return c;return null;};
  const yonu=c=>c&&(c.dataset.yuz==='sol'||c.dataset.yuz==='sag')?c.dataset.yuz:null;
  const kilitli=()=>!!(o.kilitli&&o.kilitli());
  const kenarKapali=(c,y)=>{const e=c.querySelector(KENAR+'[data-yon="'+y+'"]');return!!e&&e.getAttribute('aria-disabled')==='true';};
  /* uygulanabilir: yön var, kart kilitsiz, o cevabın kenarı ve (yüz o cevaptaysa) yüzü engelsiz */
  const uygulanir=(c,y)=>!!c&&!!y&&c.getAttribute('aria-disabled')!=='true'&&!kenarKapali(c,y)&&!(yonu(c)===y&&c.hasAttribute('data-engel'))&&!kilitli();
  const uygula=(c,y)=>{if(o.uygula)o.uygula(c.dataset.is,c.dataset[y]||y,y);};
  const odakla=c=>{if(c&&c.isConnected&&!c.contains(document.activeElement))c.focus({preventScroll:true});};
  /* önizlemeyi ev sahibine bildirir; ev sahibi yeniden çizdiyse eski kartın duruşu yeni karta taşınır ve CSS geçişi oradan sürer */
  function onizle(id,y,surukle){
    const eski=bul(id),tr=eski&&!surukle?getComputedStyle(eski).transform:'none';
    if(o.onizle)o.onizle(id,y);
    const yeni=bul(id);
    if(yeni&&yeni!==eski&&tr&&tr!=='none'){yeni.style.transition='none';yeni.style.transform=tr;void yeni.offsetWidth;yeni.style.transition='';yeni.style.transform='';}
    return yeni;
  }
  /* sürükleme */
  let D=null,bastir=false;
  function kartDur(){
    const c=bul(D.id);if(!c){D=null;return;}
    const r=Math.max(-1,Math.min(1,D.dx/(A.esik*D.g)))*A.egim;
    c.classList.add('kk-surukle');c.style.transform='translateX('+D.dx.toFixed(1)+'px) rotate('+r.toFixed(2)+'deg)';
    try{if(!c.hasPointerCapture(D.pid))c.setPointerCapture(D.pid);}catch(_){}
  }
  function birak(e,iptal){
    if(!D||e.pointerId!==D.pid)return;
    const d=D;D=null;
    if(!d.tasindi)return;
    /* sürüklemenin sonundaki tıklama (kart gövdesi, kenar ya da oda) yutulur */
    bastir=true;setTimeout(()=>{bastir=false;},0);
    let c=bul(d.id);if(!c)return;
    if(!iptal&&Math.abs(d.dx)>=A.esik*d.g&&d.yon&&uygulanir(c,d.yon)){
      uygula(c,d.yon);
      c=bul(d.id);if(c&&c.classList.contains('kk-surukle')){c.classList.remove('kk-surukle');c.style.transform='';}
      return;
    }
    /* yerine yaylan: yüz nötre döner, kart bıraktığı yerden geri kayar */
    const tr=c.style.transform;
    if(yonu(c))c=onizle(d.id,null,true);
    if(!c)return;
    c.style.transition='none';c.style.transform=tr;c.classList.remove('kk-surukle');void c.offsetWidth;
    c.style.transition='';c.style.transform='';
    odakla(c);
  }
  kok.addEventListener('pointerdown',e=>{
    if(D||e.button!==0)return;
    const c=e.target.closest(KART);if(!c||!kok.contains(c))return;
    const g=c.offsetWidth||1,y=yonu(c),ofs=(y==='sol'?-1:y==='sag'?1:0)*A.kayma*g;
    D={id:c.dataset.is,pid:e.pointerId,x0:e.clientX,y0:e.clientY,g,ofs,dx:ofs,yon:y,tasindi:false};
  });
  addEventListener('pointermove',e=>{
    if(!D||e.pointerId!==D.pid)return;
    const mx=e.clientX-D.x0,my=e.clientY-D.y0;
    if(!D.tasindi){
      if(Math.abs(mx)<ESIK_PX&&Math.abs(my)<ESIK_PX)return;
      if(Math.abs(my)>Math.abs(mx)){D=null;return;}   /* dikey: sayfa kayar, kart kıpırdamaz */
      D.tasindi=true;
    }
    e.preventDefault();
    D.dx=D.ofs+mx;
    const y=Math.abs(D.dx)>A.onizle*D.g?(D.dx<0?'sol':'sag'):null;
    if(y!==D.yon){D.yon=y;onizle(D.id,y,true);if(!D)return;}
    kartDur();
  });
  addEventListener('pointerup',e=>birak(e,false));
  addEventListener('pointercancel',e=>birak(e,true));
  addEventListener('click',e=>{if(bastir){bastir=false;e.stopImmediatePropagation();e.preventDefault();}},true);
  /* kenar etiketi: yalnız önizler (aynı kenara ikinci tıklama önizlemeyi bırakır) */
  kok.addEventListener('click',e=>{
    const b=e.target.closest(KENAR);if(!b||!kok.contains(b))return;
    const c=b.closest(KART);if(!c)return;
    const y=b.dataset.yon||(b.dataset.secim===c.dataset.sol?'sol':'sag');
    odakla(onizle(c.dataset.is,yonu(c)===y?null:y));
  });
  /* klavye: kart (ya da içindeki bir düğme) odaktayken */
  kok.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.altKey||e.metaKey)return;
    const c=e.target&&e.target.closest?e.target.closest(KART):null;if(!c||!kok.contains(c))return;
    const id=c.dataset.is,y=yonu(c);
    if(e.code==='ArrowLeft'||e.code==='ArrowRight'){
      e.preventDefault();e.stopPropagation();
      const yy=e.code==='ArrowLeft'?'sol':'sag';
      if(y!==yy)odakla(onizle(id,yy));
    }else if((e.code==='Enter'||e.code==='NumpadEnter')&&e.target===c){
      e.preventDefault();e.stopPropagation();
      if(y&&uygulanir(c,y))uygula(c,y);
    }else if(e.code==='Escape'&&y){
      e.preventDefault();e.stopPropagation();
      odakla(onizle(id,null));
    }
  });
}
