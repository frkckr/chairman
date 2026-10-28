/* ============ Chairman — tek karar kartı: dosya, karar paneli, telefon konuşması ve karar anı için ortak bileşen (görüntü katmanı; H1, F4, U2) ============
   Kullanıcı kararları (2026-10-22, 2026-10-23; OYUN_TASARIMI §2 “Tek kart”): başkanlık kararı tek karttır. Kart sola ya da sağa kaydırıldıkça yüzü o
   yönün cevabına döner; bırakınca o cevap uygulanır. Sol yüz secenekler[0], sağ yüz secenekler[1]; sol ve sağ doğru/yanlış ya da renkle kodlanmaz.
   Kural içermez: içerik js/ajanda.js ajandaOnizle'den gelir; uygulama ev sahibinin tek komutudur (ajandaIsiYap(k,id,secim)). Görünüm seçenek kesmez,
   seçmez. Renkler bugünkü kâğıt dilinden (STIL.kagit, --k-*); ölçü ve hareket STIL.kagit.kart (TEST). Dosya ve telefon ölçüleri kendi dosyalarında.
     kararKarti(k, isId, s) → html. s: {onizle:'sol'|'sag'|null, gorus, ozetsiz, kapali, dosyaBaglanti, dosyada, testSecenek, ustNotr}
       DOM: div.kk-alan (dar kap sorgusu “kk”) > section.kk-kart[data-is][data-yuz=notr|sol|sag][data-sol=<id>][data-sag=<id>] (tabindex=0, role=group,
       aria-label “Karar”; kilitliyken aria-disabled="true", görünen yüzün engeli varken data-engel) >
         .kk-ust (U2, üst etiket; aria-hidden): .kk-ustNotr (dinlenirken: s.ustNotr ya da işin başlığı) ve iki span[data-yon] (cevabın adı, ok yönde);
           önizlemede o yönün adı görünür, sürüklerken opaklığı kaymayla artar, bırakınca uygulanacak eşikte kart data-hazir alır (amber, seçili dili);
         .kk-yuzler > üç .kk-yuzKat[data-yuz] aynı ızgara hücresinde (U2): nötr (konu, hazır görüşler, son cevap, cevapsız sonucu), sol ve sağ (cevabın
           metni, süresi, bilinen sonuçları, engel, kaçırılacak ve cevapsız kalacak işler, TEST kutusu). Kart en uzun yüz kadar uzundur, yüz dönünce
           kenar etiketleri kıpırdamaz. Görünen yüz ayrıca .kk-yuz sınıfını taşır (öbürleri visibility:hidden); canlı bölge değildir, görünen yüz kalıcı
           #kartDuyuru'dan duyurulur (kartDuyur). Yüzün engeli varsa kat data-engel taşır;
         .kk-kenarlar (iki button.kk-kenar[data-yon][data-secim][data-eylem="kartOnizle"]; engelli cevabın kenarı aria-disabled ve nedeni kısa), .kk-not.
       Önizlenen yüzün uyarıları o cevabın süresiyle hesaplanır (ajandaOnizle o seçeneğin kimliğiyle çağrılır). İki cevaplı olmayan kararda kart kurulmaz.
       kapali: kart kilitli, nedeni yüzde (maç telefonu); duraklatmada da kilitli (“Duraklatıldı: devam edince cevaplanır.”).
       Metin tavanı (U2, envanter 29): konu en çok STIL.kagit.kart.tavan.konu harf (üç kısa paragraf ölçüsü), cevap adı tavan.cevap harf, cevabın
       bilinen sonuçları tavan.satir satır; aşılırsa kart yine kurulur, geliştirici konsoluna bir kez uyarı yazılır (fazlası görüşme sahnesine).
     kartEtkilesimKur(kok, {uygula(isId, secim, yon), onizle(isId, yon|null), kilitli(), kart, kenar, damga})  kök başına bir kez; delege olaylar.
       Önizleme (U2): yüz kartın içinde döner (üç kat kurulu; ev sahibi yeniden çizmek zorunda değil, onizle yalnız durumunu kaydetmesi içindir; yeniden
       çizerse kart data-is ile yeniden bulunur, duruşu yeni karta taşınır). Kendi katı olmayan kart (karar anı) yüzünü onizle'de kendisi yazar.
       Sürükleme: işaretçinin kayması dx; kayma kart genişliğinin onizle katını geçince yüz o yönün cevabına döner (geri dönüşte küçük bir pay), bırakınca
       |dx| esik katını geçmişse, yüz hâlâ o yöndeyse ve cevap engelsiz, kart kilitsiz ise uygular; aksi hâlde kart sure içinde yerine yaylanır ve yüz
       nötre döner. Kartın görünen kayması sınırlıdır (U2, “kaptan çıkmaz”): sürükleme başında kartı kırpan ilk atanın (overflow) iç kutusuna kalan yer
       ölçülür; kayma bu yere yumuşak yaklaşır (L·(1−e^(−|dx|/L))), eğim en çok egim derece ve yerin izin verdiği kadar (kartın dibi kabın dibinden, üst
       köşesi tepesinden taşmaz). Eşik işaretçidedir, kartın görünen yerinde değil. Dikey hareket sayfayı kaydırır (touch-action: pan-y).
       Klavye (kart odaktayken): ←/→ önizler (kart kayma kadar kayar), Enter önizlenen cevabı uygular, Esc yalnız önizleme varken onu bırakır (olay yutulur;
       yoksa ev sahibinin Esc'i çalışır). Kenar etiketine tıklamak önizler (aynı kenara ikinci tıklama önizlemeyi bırakır; tıklama hiçbir zaman
       uygulamaz); kart gövdesine tıklamak hiçbir şey yapmaz. Sürüklemeden sonraki tıklama yutulur. secim: kartın data-sol/data-sag değeri (yoksa yön).
       kart/kenar: seçiciler (varsayılan .kk-kart, .kk-kenar; karar anı kendi sınıflarını verir).
       Damga (U2, envanter 13): uygulanan kartın görünüşü uygulamadan hemen önce dondurulur (hesaplanmış stiller satır içine, kapalı gölge ağacında; seçiciler
       ve sayfa metni onu görmez), ev sahibi kararı uygulayıp kartı kaldırdıysa kopya kartın yerinde damgalanır (cevabın adı, mürekkep, egim derece), kısa
       durur ve aşağı oturarak söner (STIL.kagit.kart.damga: bas, bekle, gir sn). Kart yerinde kaldıysa (yolda haber, engel) damga basılmaz.
       “Hareketi azalt” tercihinde yalnız opaklık. damga:false (karar anı) kopya kurmaz; karar anı seçimde kendi kartına kartDamga.bas ile basar.
       Ayrıntı TEKNIK_PLAN §10, STIL_REHBERI §7.
     kartUstEsle(kart, yon, oran, hazir)  üst etiketi sürüklemeye eşler (yon yoksa satır içi değerler kalkar, CSS data-yuz'a göre gösterir).
     kartDamga.bas(kart, metin)  kartın içine damga basar (karar anı); kartDamga.hayalet / goster bileşenin içindir.
     kartDuyur(kart)  görünen yüzün metnini kalıcı canlı bölgeye (#kartDuyuru) yazar; kartEtkilesimKur önizlemede, maç telefonu kendi kenar
       tıklamasında çağırır. */
const yazT=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
/* stil masaüstü kopyası yalnız js/ klasörünü taşıdığı için buradan belgeye eklenir */
(function kartStili(){
  if(typeof document==='undefined'||document.getElementById('kartStili'))return;
  const A=STIL.kagit.kart,K=STIL.kagit,st=document.createElement('style');st.id='kartStili';
  /* alan kartın iki yanında önizleme kayması kadar boşluk bırakır (klavye ya da kenar önizlemesinde kart alanın içinde kalır); sürüklemede kartın
     görünen kayması kartı kırpan kabın iç kutusuyla sınırlıdır (kartEtkilesimKur), alan kırpmaz */
  const egimKayma=(A.egim*A.kayma/A.esik).toFixed(2),yan=(A.kayma/(1+2*A.kayma)*100).toFixed(2);
  st.textContent=`
.kk-alan{display:grid;padding:0 ${yan}%;container:kk / inline-size}
.kk-kart{position:relative;display:grid;gap:.45em;min-width:0;padding:.5em .7em .6em;background:var(--k-serit);border:1px solid var(--k-cizgi);border-top:.3em solid var(--k-kirmizi);
  border-radius:.3em;box-shadow:.12em .18em 0 var(--k-golge);color:var(--k-yazi);touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab;
  transform-origin:50% 100%;transition:transform ${A.sure}s ease-out}
.kk-kart:focus{outline:none}
.kk-kart:focus-visible{outline:.14em solid var(--k-kulup);outline-offset:.12em}
.kk-kart.kk-surukle{transition:none;cursor:grabbing}
.kk-kart[data-yuz="sol"]{transform:translateX(-${A.kayma*100}%) rotate(-${egimKayma}deg)}
.kk-kart[data-yuz="sag"]{transform:translateX(${A.kayma*100}%) rotate(${egimKayma}deg)}
.kk-kart[aria-disabled="true"]{cursor:default}
.kk-kart p{margin:0}
/* üst etiket: dinlenirken işin adı, önizlemede ve sürüklerken o yönün cevabı; bırakınca uygulanacaksa amber (seçili dili) */
.kk-ust{display:grid;min-width:0;font-size:.78em;line-height:1.5;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--k-soluk)}
.kk-ust>span{grid-area:1/1;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:opacity .12s ease-out}
.kk-ust>[data-yon]{opacity:0;padding:0 .45em;border-radius:.25em;color:var(--k-yazi);background:var(--k-zeminKoyu,${K.zeminKoyu})}
.kk-ust>[data-yon="sol"]{justify-self:start}
.kk-ust>[data-yon="sag"]{justify-self:end}
[data-yuz="sol"]>.kk-ust>[data-yon="sol"],[data-yuz="sag"]>.kk-ust>[data-yon="sag"]{opacity:1}
[data-yuz="sol"]>.kk-ust>.kk-ustNotr,[data-yuz="sag"]>.kk-ust>.kk-ustNotr{opacity:0}
.kk-surukle>.kk-ust>span{transition:none}
[data-hazir]>.kk-ust>[data-yon]{background:var(--k-vurguZemin,${K.vurguZemin});color:var(--k-vurguYazi,${K.vurguYazi})}
/* üç yüz aynı hücrede: kart en uzun yüz kadar uzun, yüz dönünce kenarlar yerinde */
.kk-yuzler{display:grid;min-width:0}
.kk-yuzKat{grid-area:1/1;display:grid;gap:.35em;align-content:start;min-width:0;font-size:${A.yuz.normal}em;visibility:hidden}
.kk-yuzKat.kk-yuz{visibility:visible}
.kk-konu{font-size:1.05em;line-height:1.35}
.kk-gorusler{display:grid;gap:.2em}
.kk-gorus{padding:.2em .5em;border-left:.2em solid var(--k-mavi,${K.mavi});font-size:.92em}
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
.kk-kart .kk-kenar[aria-pressed="true"]{background:var(--k-vurguZemin);border-color:var(--k-vurgu);color:var(--k-vurguYazi,${K.vurguYazi})}
.kk-kart .kk-kenar[aria-pressed="true"] small,.kk-kart .kk-kenar[aria-pressed="true"] .kk-ok{color:var(--k-vurguYaziSoluk,${K.vurguYaziSoluk})}
.kk-kart .kk-kenar[aria-disabled="true"]{opacity:.6;border-style:dashed}
.kk-kart .kk-kenar[aria-disabled="true"] small{color:var(--k-kirmizi)}
/* dar kap (U2, envanter 3): telefonun cevap alanı gibi dar yerde boşluklar sıkışır; kenar etiketleri yan yana kalır (sol ve sağ kaydırmanın eşi) */
@container kk (max-width:${A.dar}){
.kk-kart{gap:.35em;padding:.4em .5em .5em}
.kk-kenarlar{gap:.35em}
.kk-kart .kk-kenar{gap:.25em;padding:.3em .4em .25em}
.kk-kenar small{font-size:.78em}
.kk-ust{font-size:.74em}
}
#kartDuyuru{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;
  document.head.appendChild(st);
})();

/* ---- hazır görüş: kararı soranın ya da ilgili yöneticinin görüşü (konuşmada ve karar panelinde gösterilir; dosyada "Bilinenler"dedir).
   U2 (envanter 29): en çok iki kişinin tek satırlık görüşü, her kişinin son görüşü; bugün tek kaynak hazır görüştür, ikinci yer Y2'nin asistanı içindir ---- */
function kararGorusu(k,v){
  if(typeof meseleOlayi!=='function'||!v.meseleId)return'';
  const ol=meseleOlayi(k,v.meseleId),G=ol?ol.bilgiler.filter(b=>k.kisiler[b.kaynak]&&b.kaynak!==k.baskanId&&/\.tavsiye\./.test(b.anahtar)):[];
  const son=new Map();for(const b of G){son.delete(b.kaynak);son.set(b.kaynak,b);}
  const L=[...son.values()].slice(-2);
  return L.length?'<div class="kk-gorusler">'+L.map(b=>'<p class="kk-gorus"><b>'+yazT(k.kisiler[b.kaynak].ad)+'</b> '+yazT(MESELE_OLAYLARI[b.anahtar](k,b.p))+'</p>').join('')+'</div>':'';
}

/* ---- metin tavanı: aşan kart yine kurulur; geliştirici konsoluna iş başına bir kez uyarı (içerik yazarı için) ---- */
const kartTavanDenetle=(()=>{const U=new Set();return(isId,v,S)=>{
  const T=STIL.kagit.kart.tavan;if(!T||U.has(isId))return;
  const a=[],n=String(v.aciklama||'').length;if(n>T.konu)a.push('konu '+n+' harf (tavan '+T.konu+')');
  for(const x of S){if(String(x.metin).length>T.cevap)a.push('cevap “'+x.metin+'” '+String(x.metin).length+' harf (tavan '+T.cevap+')');
    const s=(x.aciklama||[]).filter(Boolean).length;if(s>T.satir)a.push('cevap “'+x.metin+'” '+s+' satır (tavan '+T.satir+')');}
  if(a.length){U.add(isId);if(typeof console!=='undefined')console.warn('Kart metni tavanı aşıldı ('+(v.baslik||isId)+'): '+a.join('; '));}};})();

/* ---- tek kart ---- */
function kararKarti(k,isId,s={}){
  const is=k.isler[isId];
  if(!is||is.tur!=='ajanda'||!is.veri.karar)return'';
  const v=is.veri,o0=ajandaOnizle(k,isId),S=o0.secenekler;
  /* bugün tek canlı yol iki seçenektir (KARAR_TURLERI sözleşmesi); başka sayıda seçenek kart kurmaz, karar da uygulanmaz */
  if(S.length!==2)return'<p class="kk-uyari">Bu karar iki cevaplı değil.</p>';
  kartTavanDenetle(isId,v,S);
  const yon=s.onizle==='sol'||s.onizle==='sag'?s.onizle:null,gor=yon||'notr';
  const kilit=s.kapali||(typeof duraklatmaVar==='function'&&duraklatmaVar()?'Duraklatıldı: devam edince cevaplanır.':null);
  const engelleri=o=>o.engel.filter(e=>!/Bir seçenek/.test(e));
  const sureYazi=c=>{const d=c.sure!==undefined?c.sure:v.sure;return d?d+' dk':'zaman almaz';};
  /* nötr yüz: konu ve hazır görüşler (özetsizde konuşmanın akışındadır), son cevap, cevapsız sonucu, genel engel */
  const notr=()=>{
    let y='';
    if(!s.ozetsiz){y+='<p class="kk-konu">'+yazT(v.aciklama)+'</p>';if(s.gorus)y+=kararGorusu(k,v);}
    const alt=[];
    if(v.saatsiz&&!s.dosyada)alt.push('Son cevap: '+(is.tarih===k.tarih?'bugün ':gunAyYazi(is.tarih)+' ')+saatYazi(is.dakika));
    if(zamanAsimiVar(is))alt.push(zamanAsimiMetni(k,is));
    if(alt.length)y+='<p class="kk-not">'+alt.map(yazT).join(' · ')+'</p>';
    if(!s.kapali)for(const e of engelleri(o0))y+='<p class="kk-uyari">'+yazT(e)+'</p>';
    return{y,engel:false};
  };
  /* cevabın yüzü: o seçeneğin kimliğiyle önizleme (süre, kaçırılacak ve cevapsız kalacak işler o cevaba göre) */
  const cevap=i=>{
    const x=S[i],o=ajandaOnizle(k,isId,x.id),xs=o.secenek||x,engel=engelleri(o);
    let y='<p class="kk-secenek"><b>'+yazT(xs.metin)+'</b><span class="kk-sure">'+yazT(sureYazi(xs))+'</span></p>';
    for(const a of (xs.aciklama||[]).filter(Boolean))y+='<p class="kk-bilgi">'+yazT(a)+'</p>';
    for(const e of engel)y+='<p class="kk-uyari">'+yazT(e)+'</p>';
    if(!s.kapali){
      if(o.atlanacak.length)y+='<p class="kk-uyari">Bu karar zaman alır; kaçırılacak: '+o.atlanacak.map(a=>yazT(a.veri.baslik+' ('+saatYazi(a.dakika)+')')).join(', ')+'</p>';
      if(o.cevapsiz.length)y+='<p class="kk-uyari">Bu arada cevapsız kalacak: '+o.cevapsiz.map(a=>yazT(a.veri.baslik)).join(', ')+'</p>';
    }
    if(s.testSecenek)y+=s.testSecenek(isId,xs);
    return{y,engel:engel.length>0};
  };
  const F={notr:notr(),sol:cevap(0),sag:cevap(1)},kilitP=kilit?'<p class="kk-not">'+yazT(kilit)+'</p>':'';
  const kat=ad=>'<div class="kk-yuzKat'+(ad===gor?' kk-yuz':'')+'" data-yuz="'+ad+'"'+(F[ad].engel?' data-engel="1"':'')+'>'+F[ad].y+kilitP+'</div>';
  const kenar=i=>{
    const c=S[i],y=i?'sag':'sol',ok='<i class="kk-ok" aria-hidden="true">'+(i?'▸':'◂')+'</i>';
    return'<button type="button" class="kk-kenar" data-eylem="kartOnizle" data-yon="'+y+'" data-secim="'+yazT(c.id)+'" aria-pressed="'+(yon===y?'true':'false')+'"'+
      (c.engel?' aria-disabled="true" title="'+yazT(c.engel)+'"':'')+'>'+(i?'':ok)+'<span><b>'+yazT(c.metin)+'</b><small>'+yazT(c.engel||sureYazi(c))+'</small></span>'+(i?ok:'')+'</button>';
  };
  const ust='<div class="kk-ust" aria-hidden="true"><span class="kk-ustNotr">'+yazT(s.ustNotr||v.baslik||'Karar')+'</span><span data-yon="sol">◂ '+yazT(S[0].metin)+'</span>'+
    '<span data-yon="sag">'+yazT(S[1].metin)+' ▸</span></div>';
  let ic='<div class="kk-alan"><section class="kk-kart" data-is="'+yazT(isId)+'" data-yuz="'+gor+'" data-sol="'+yazT(S[0].id)+'" data-sag="'+yazT(S[1].id)+'" tabindex="0" role="group" aria-label="Karar"'+
    (kilit?' aria-disabled="true"':'')+(F[gor].engel?' data-engel="1"':'')+'>'+ust+
    '<div class="kk-yuzler">'+kat('notr')+kat('sol')+kat('sag')+'</div><div class="kk-kenarlar">'+kenar(0)+kenar(1)+'</div>';
  if(s.dosyaBaglanti&&v.meseleId)ic+='<p class="kk-not"><button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+v.meseleId+'" data-donus="telefon">Dosyayı aç ▸</button></p>';
  return ic+'</section></div>';
}

/* ---- duyuru: kartın içinde değişen metin ekran okuyucuya duyurulmaz. Görünen yüzün metni belgede kalıcı tek canlı bölgeye (#kartDuyuru, görünmez)
   yazılır; aynı metin yeniden duyurulsun diye önce boşaltılır (inceleme 2026-10-26) ---- */
/* metinDuyur(metin): aynı kalıcı bölgeye düz metin (H2-e: kişiye yazınca şeridin metni; oda her eylemde yeniden çizildiği için .od-mesaj duyurulmaz) */
const metinDuyur=(()=>{let z=null;return t=>{
  if(!t||typeof document==='undefined'||!document.body)return;
  let d=document.getElementById('kartDuyuru');
  if(!d){d=document.createElement('div');d.id='kartDuyuru';d.setAttribute('role','status');d.setAttribute('aria-live','polite');d.setAttribute('aria-atomic','true');document.body.appendChild(d);}
  d.textContent='';clearTimeout(z);z=setTimeout(()=>{d.textContent=String(t);},50);};})();
const kartDuyur=c=>{const y=c&&c.querySelector('.kk-yuz');if(!y)return;metinDuyur((y.innerText||y.textContent||'').replace(/\s+/g,' ').trim());};

/* ---- üst etiket: sürüklerken yönün cevabı belirir (kaymayla güçlenir), işin adı söner; hazir: bırakınca uygulanır. yon yoksa satır içi değerler kalkar ---- */
function kartUstEsle(c,yon,oran,hazir){
  const U=c&&c.querySelector(':scope>.kk-ust');if(!U)return;
  const o=Math.max(0,Math.min(1,oran||0));
  for(const s of U.children)s.style.opacity=!yon?'':s.dataset.yon===yon?Math.min(1,.25+o).toFixed(2):s.dataset.yon?'0':Math.max(0,1-2*o).toFixed(2);
  c.toggleAttribute('data-hazir',!!(yon&&hazir));
}

/* ---- damga: uygulanan kartın donmuş kopyası kartın yerinde damgalanır, kısa durur, aşağı oturarak söner (U2). Kopya kapalı gölge ağacındadır ---- */
const kartDamga=(()=>{
  const DONDUR=['display','box-sizing','width','height','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left',
    'border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-style','border-right-style','border-bottom-style','border-left-style',
    'border-top-color','border-right-color','border-bottom-color','border-left-color','border-top-left-radius','border-top-right-radius','border-bottom-right-radius',
    'border-bottom-left-radius','background-color','background-image','box-shadow','color','opacity','visibility','overflow-x','overflow-y','font-family','font-size',
    'font-weight','font-style','font-variant-numeric','line-height','letter-spacing','text-align','text-transform','text-overflow','white-space','overflow-wrap','word-break',
    'vertical-align','grid-template-columns','grid-template-rows','grid-row-start','grid-row-end','grid-column-start','grid-column-end','row-gap','column-gap',
    'justify-content','justify-items','justify-self','align-items','align-content','align-self','flex-direction','flex-wrap','flex-grow','flex-shrink','flex-basis',
    'position','top','right','bottom','left','transform','transform-origin','list-style-type'];
  const az=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* kartın içine damga: cevabın adı büyük harfle, mürekkep, egim derece; basma bas sn */
  function bas(kart,metin){
    if(!kart||typeof document==='undefined')return null;
    const M=STIL.kagit.kart.damga,d=document.createElement('div'),son='translate(-50%,-50%) rotate('+M.egim+'deg)';
    d.className='kk-damga';d.setAttribute('aria-hidden','true');d.textContent=String(metin||'').toLocaleUpperCase('tr-TR');
    d.style.cssText='position:absolute;left:50%;top:46%;z-index:2;transform:'+son+';box-sizing:border-box;max-width:92%;padding:.14em .5em .06em;border:.16em solid currentColor;'+
      'border-radius:.3em;color:var(--k-murekkep,'+STIL.kagit.murekkep+');background:transparent;font-family:var(--display);font-size:2.3em;font-weight:400;line-height:1;'+
      'letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;opacity:.9;mix-blend-mode:multiply';
    kart.appendChild(d);
    /* dar kartta (telefon) uzun cevap adı sığsın: yazı kartın %88'ine iner (en çok yarıya); yine sığmazsa üç nokta */
    const en=kart.clientWidth*.88;
    if(en>0&&d.scrollWidth>en){const f=parseFloat(getComputedStyle(d).fontSize)||16;d.style.fontSize=Math.max(f*en/d.scrollWidth,f*.5).toFixed(1)+'px';}
    if(d.animate)d.animate(az()?[{opacity:0},{opacity:.9}]:[{opacity:0,transform:son+' scale(1.8)'},{opacity:.9,transform:son+' scale(1)'}],
      {duration:(az()?.12:M.bas)*1000,easing:az()?'linear':'cubic-bezier(.2,1.3,.4,1)',fill:'backwards'});
    return d;
  }
  /* uygulamadan önce: kartın ve içindekilerin hesaplanmış görünüşü satır içine; öznitelikler (sınıf, kimlik, data-*, rol) kalkar. b: yerleşik kutu */
  function hayalet(c,b){
    if(!c||typeof getComputedStyle!=='function')return null;
    const kopya=c.cloneNode(true),A1=[c,...c.querySelectorAll('*')],A2=[kopya,...kopya.querySelectorAll('*')];
    for(let i=0;i<A1.length;i++){
      const s=getComputedStyle(A1[i]),e=A2[i];let css='';
      for(const p of DONDUR)css+=p+':'+s.getPropertyValue(p)+';';
      for(const a of [...e.attributes])e.removeAttribute(a.name);
      e.style.cssText=css;
    }
    Object.assign(kopya.style,{position:'absolute',left:'0',top:'0',margin:'0',transition:'none',pointerEvents:'none'});
    return{kopya,b};
  }
  /* karar uygulandıktan sonra: kopya kökte kartın eski yerinde, damga basılır, bekle sn durur, gir sn'de aşağı oturarak söner */
  function goster(kok,h,metin){
    if(!kok||!h)return;
    const M=STIL.kagit.kart.damga,yavas=!az(),kat=document.createElement('div');
    kat.className='kk-damgaKat';kat.setAttribute('aria-hidden','true');kat.inert=true;
    kat.style.cssText='position:absolute;left:0;top:0;margin:0;padding:0;border:0;width:'+h.b.width+'px;height:'+h.b.height+'px;pointer-events:none;z-index:60';
    (kat.attachShadow?kat.attachShadow({mode:'closed'}):kat).appendChild(h.kopya);
    kok.appendChild(kat);
    const r=kat.getBoundingClientRect();kat.style.left=(h.b.left-r.left).toFixed(1)+'px';kat.style.top=(h.b.top-r.top).toFixed(1)+'px';
    bas(h.kopya,metin);
    const T0=h.kopya.style.transform&&h.kopya.style.transform!=='none'?h.kopya.style.transform:'',bitir=()=>{if(kat.isConnected)kat.remove();};
    if(h.kopya.animate){
      const a=h.kopya.animate(yavas?[{opacity:1,transform:T0||'none'},{opacity:0,transform:(T0+' translateY(.6em) scale(.95)').trim()}]:[{opacity:1},{opacity:0}],
        {duration:(yavas?M.gir:.15)*1000,delay:(yavas?M.bas+M.bekle:.32)*1000,easing:'ease-in',fill:'forwards'});
      a.onfinish=bitir;
    }
    setTimeout(bitir,(M.bas+M.bekle+M.gir)*1000+400);
  }
  return{bas,hayalet,goster};
})();

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
  const odakla=c=>{if(c&&c.isConnected&&!c.contains(document.activeElement))c.focus({preventScroll:true});};
  /* kartın dönüşümsüz yeri (ekran koordinatı): ebeveynin kutusu + kartın ebeveyndeki yeri; kartın kendi kayması ve eğimi sayılmaz */
  const yerlesik=c=>{
    const p=c.parentElement,pr=p.getBoundingClientRect(),w=c.offsetWidth,h=c.offsetHeight;let x,y;
    if(c.offsetParent===p){x=pr.left+p.clientLeft+c.offsetLeft;y=pr.top+p.clientTop+c.offsetTop;}else{x=pr.left+c.offsetLeft-p.offsetLeft;y=pr.top+c.offsetTop-p.offsetTop;}
    return{left:x,top:y,right:x+w,bottom:y+h,width:w,height:h};
  };
  /* kartı kırpan ilk ata (overflow görünür değil): iç kutusu; yoksa pencere */
  const kirpan=c=>{
    for(let a=c.parentElement;a&&a!==document.documentElement;a=a.parentElement){
      const s=getComputedStyle(a);
      if(s.overflowX!=='visible'||s.overflowY!=='visible'){const r=a.getBoundingClientRect(),l=r.left+a.clientLeft,t=r.top+a.clientTop;return{left:l,top:t,right:l+a.clientWidth,bottom:t+a.clientHeight};}
    }
    return{left:0,top:0,right:innerWidth,bottom:innerHeight};
  };
  /* sürükleme başında yer ölçüsü: her yön için yumuşak kayma sınırı L ve en çok eğim th (radyan). Eğim kartın dibinin ortasından: öndeki üst köşe
     H·sin(th) dışarı, alt köşe ve karşı üst köşe g/2·sin(th) aşağı/yukarı; yer bunlara ve kaymaya bölünür */
  function olc(c){
    const g=c.offsetWidth||1,H=c.offsetHeight||1,b=yerlesik(c),k=kirpan(c),m=.3*(parseFloat(getComputedStyle(c).fontSize)||16);
    const dik=Math.max(0,Math.min(1,Math.min(b.top-k.top-m,k.bottom-m-b.bottom)/(g/2))),en=A.egim*Math.PI/180;
    const yon=yer=>{yer=Math.max(0,yer);const th=Math.min(en,Math.asin(dik),Math.asin(Math.min(1,yer/(2*H))));return{L:Math.max(0,yer-H*Math.sin(th)),th};};
    return{g,sol:yon(b.left-k.left-m),sag:yon(k.right-m-b.right)};
  }
  const ileri=(d,L)=>L>0?L*(1-Math.exp(-d/L)):0;
  const geriSay=(v,L)=>L>0?-L*Math.log(1-Math.min(v/L,.98)):0;
  /* yüzü kartın içinde çevirir (üç kat kurulu kartta); kendi katı olmayan kartta ev sahibi çevirir */
  function cevir(c,y){
    const K=c.querySelectorAll(':scope>.kk-yuzler>.kk-yuzKat');if(!K.length)return false;
    const ad=y||'notr';let eng=false;c.dataset.yuz=ad;
    for(const f of K){const ac=f.dataset.yuz===ad;f.classList.toggle('kk-yuz',ac);if(ac)eng=f.hasAttribute('data-engel');}
    c.toggleAttribute('data-engel',eng);
    for(const b of c.querySelectorAll(KENAR))b.setAttribute('aria-pressed',b.dataset.yon===y?'true':'false');
    return true;
  }
  /* önizleme: yüz yerinde döner, ev sahibi durumunu kaydeder; ev sahibi yeniden çizdiyse eski kartın duruşu yeni karta taşınır ve CSS geçişi oradan sürer */
  function onizle(id,y,surukle){
    const eski=bul(id),tr=eski&&!surukle?getComputedStyle(eski).transform:'none',yerinde=!!eski&&cevir(eski,y);
    if(o.onizle)o.onizle(id,y);
    const yeni=bul(id);
    if(yeni&&yeni!==eski&&tr&&tr!=='none'){yeni.style.transition='none';yeni.style.transform=tr;void yeni.offsetWidth;yeni.style.transition='';yeni.style.transform='';}
    /* görünen yüz kalıcı canlı bölgeden duyurulur (aynı düğümü güncelleyen karar anı kendi canlı .ka-yuz'unu kullanır) */
    if(yeni&&(yeni!==eski||yerinde))kartDuyur(yeni);
    return yeni;
  }
  const cevapAdi=(c,y)=>{const b=c.querySelector(KENAR+'[data-yon="'+y+'"] b');return b?b.textContent:'';};
  /* uygula: damga için kart önce dondurulur; ev sahibi kararı uygulayıp kartı kaldırdıysa kopya damgalanır */
  function uygula(c,y){
    if(!o.uygula)return;
    const id=c.dataset.is,h=o.damga===false?null:kartDamga.hayalet(c,yerlesik(c)),ad=cevapAdi(c,y);
    o.uygula(id,c.dataset[y]||y,y);
    if(h&&!bul(id))kartDamga.goster(kok,h,ad);
  }
  /* sürükleme */
  let D=null,bastir=false;
  function kartDur(c){
    const sg=D.dx<0?-1:1,y=sg<0?'sol':'sag',Y=D.olc[y],ad=Math.abs(D.dx),esik=A.esik*D.olc.g,oran=Math.min(1,ad/esik);
    const v=ileri(ad,Y.L),r=Y.th*180/Math.PI*oran;
    c.classList.add('kk-surukle');c.style.transform='translateX('+(sg*v).toFixed(1)+'px) rotate('+(sg*r).toFixed(2)+'deg)';
    kartUstEsle(c,y,oran,ad>=esik&&yonu(c)===y&&uygulanir(c,y));
    try{if(!c.hasPointerCapture(D.pid))c.setPointerCapture(D.pid);}catch(_){}
  }
  function birak(e,iptal){
    if(!D||e.pointerId!==D.pid)return;
    const d=D;D=null;
    if(!d.tasindi)return;
    /* sürüklemenin sonundaki tıklama (kart gövdesi, kenar ya da oda) yutulur */
    bastir=true;setTimeout(()=>{bastir=false;},0);
    let c=bul(d.id);if(!c)return;
    /* yüz bırakıldığı anda da sürüklenen yöndeyse uygulanır: sürüklerken klavyeyle (←/→, Esc; karar anının yakalayıcısı dahil) çevrilen ya da
       bırakılan önizlemede yüzde görünmeyen cevap uygulanmaz, kart yerine yaylanır (inceleme 2026-10-26) */
    if(!iptal&&Math.abs(d.dx)>=A.esik*d.olc.g&&d.yon&&yonu(c)===d.yon&&uygulanir(c,d.yon)){
      uygula(c,d.yon);
      c=bul(d.id);if(c){kartUstEsle(c);if(c.classList.contains('kk-surukle')){c.classList.remove('kk-surukle');c.style.transform='';}}
      return;
    }
    /* yerine yaylan: yüz nötre döner, kart bıraktığı yerden geri kayar */
    const tr=c.style.transform;
    kartUstEsle(c);
    if(yonu(c))c=onizle(d.id,null,true);
    if(!c)return;
    c.style.transition='none';c.style.transform=tr;c.classList.remove('kk-surukle');void c.offsetWidth;
    c.style.transition='';c.style.transform='';
    odakla(c);
  }
  kok.addEventListener('pointerdown',e=>{
    if(D||e.button!==0)return;
    const c=e.target.closest(KART);if(!c||!kok.contains(c))return;
    /* önizlenen kart kaymış durur: sürükleme kartın göründüğü yerden başlar (ev sahibi kaymayı kendi ölçüsüyle verebilir; telefon) */
    const y=yonu(c);let v0=0;
    if(y)try{const m=getComputedStyle(c).transform;if(m&&m!=='none')v0=new DOMMatrixReadOnly(m).m41;}catch(_){}
    D={id:c.dataset.is,pid:e.pointerId,x0:e.clientX,y0:e.clientY,v0,yon:y,tasindi:false,olc:null,ofs:0,dx:0};
  });
  addEventListener('pointermove',e=>{
    if(!D||e.pointerId!==D.pid)return;
    const mx=e.clientX-D.x0,my=e.clientY-D.y0;
    if(!D.tasindi){
      if(Math.abs(mx)<ESIK_PX&&Math.abs(my)<ESIK_PX)return;
      if(Math.abs(my)>Math.abs(mx)){D=null;return;}   /* dikey: sayfa kayar, kart kıpırdamaz */
      const c=bul(D.id);if(!c){D=null;return;}
      D.tasindi=true;D.olc=olc(c);
      /* önizlemeden başlayan sürükleme: görünen kaymanın işaretçideki karşılığından, en az önizleme eşiği kadar (yüz hemen dönmez) */
      if(D.yon){const sg=D.yon==='sol'?-1:1;D.ofs=sg*Math.max(geriSay(Math.abs(D.v0),D.olc[D.yon].L),A.onizle*D.olc.g+1);}
    }
    e.preventDefault();
    D.dx=D.ofs+mx;
    const ad=Math.abs(D.dx),sg=D.dx<0?'sol':'sag',on=A.onizle*D.olc.g,pay=Math.max(ESIK_PX,.02*D.olc.g);
    const y=ad>on?sg:D.yon===sg&&ad>on-pay?sg:null;
    if(y!==D.yon){D.yon=y;onizle(D.id,y,true);if(!D)return;}
    const c=bul(D.id);if(!c){D=null;return;}
    kartDur(c);
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
