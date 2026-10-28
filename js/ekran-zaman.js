/* ============ Chairman — "zaman geçiyor" sahnesi ve durak özeti (görüntü katmanı; U4, 2026-10-28) ============
   Kullanıcı tercihi 6 (2026-10-28): İlerle'ye basınca odanın saati döner, geçen zamanda olanlar saat geldikçe sırayla belirir (js/zaman-ozeti.js),
   sahne en çok STIL.kagit.zaman.enCok sn sürer ve durak özeti kartıyla biter: yeni an, geçen süre, gelen birkaç şey, şimdiki durak ve sıradaki durak;
   ay başı, transfer dönemi ve sezon sonu kartın üstünde kapak olarak. Kural içermez, kariyeri değiştirmez: İlerle'nin komutu sahneden ÖNCE
   uygulanmıştır (kayıt, alt şerit ve denemeler son durumu okur); sahne yalnız sunumdur.
   Geçiş: tıklamak ya da Enter/Boşluk/Esc akışı atlar (özete geçer); özette herhangi bir tıklama ya da tuş kartı kaldırır ve tıklama işini yapar
   (masadaki nesne açılır, İlerle yeniden ilerler). Akış sırasında İlerle'ye basmak sahneyi bırakıp yeniden ilerler (beklettirmez). Duraklat akışı
   özete atlatır (sahne hareketi durur). "Hareketi azalt" tercihinde akış yoktur, özet hemen gelir.
     zamanSahnesiBaslat(o)  o: {ozet (zamanOzeti), baslik (yeni anın yazısı), durak (şimdiki durak cümlesi), sonraki (sıradaki durak), gunYazi(tarih),
                            saat(dk) (odanın saat kolları), cizim() (oda yeniden çizer; sahne bitince İlerle düğmesi eski yazısına döner)}
     zamanSahnesiHtml()     odanın çiziminde sahnenin o anki hâli (yeniden çizimde akış kaldığı yerden sürer)
     zamanSahnesiAtla() · zamanSahnesiKapat() · ZAMAN_SAHNE.acik/evre (denemeler okur) */
const ZAMAN_SAHNE={acik:false,evre:null,o:null,t0:0,sure:0,gorunen:-1,saatDk:null};
(function zamanStili(){
  if(typeof document==='undefined'||document.getElementById('zamanStili'))return;
  const st=document.createElement('style');st.id='zamanStili';
  st.textContent=`
.oda .zm-sahne{position:absolute;z-index:4;left:50%;bottom:5.7em;transform:translateX(-50%);width:min(46%,30em);max-height:62%;overflow:hidden;display:grid;gap:.35em;
  padding:.55em .85em .5em;background:var(--k-serit);border:1px solid var(--k-cizgi);border-top:.25em solid var(--k-mavi);box-shadow:.25em .35em 0 var(--k-golge);color:var(--k-yazi)}
.oda .zm-sahne p,.oda .zm-sahne h4,.oda .zm-sahne ol,.oda .zm-sahne ul{margin:0}
.zm-saat{display:flex;align-items:baseline;justify-content:space-between;gap:.6em}
.zm-saat b{font-weight:600}
.zm-saat span{font-family:var(--display);font-size:1.6em;line-height:1;font-variant-numeric:tabular-nums;color:var(--k-kulup)}
.zm-satirlar{list-style:none;padding:0;display:grid;gap:.15em;font-size:.92em}
.zm-satirlar li{display:grid;grid-template-columns:5.2em minmax(0,1fr);gap:.5em;animation:zmSatir .25s ease-out both}
.zm-satirlar li span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zm-satirlar time{color:var(--k-soluk);font-variant-numeric:tabular-nums}
.zm-ipucu{color:var(--k-soluk);font-size:.8em;text-align:right}
.zm-kapak{display:grid;gap:.1em;padding:.35em .55em;margin:0 -.3em .1em;background:var(--k-zemin);border-left:.3em solid var(--k-kirmizi)}
.zm-kapak small{color:var(--k-soluk);font-size:.82em;letter-spacing:.06em;text-transform:uppercase}
.zm-kapak b{font-family:var(--display);font-weight:400;font-size:1.5em;line-height:1.05;color:var(--k-kulup)}
.zm-sahne h4{font-weight:600;font-size:1.05em}
.zm-gecen{color:var(--k-soluk);font-size:.9em}
.zm-durak{padding-top:.3em;border-top:1px dashed var(--k-cizgi)}
.zm-durak b{font-weight:600}
.zm-sahne[data-evre="ozet"]{animation:zmOzet .22s ease-out both}
@keyframes zmSatir{from{opacity:0;transform:translateY(.3em)}to{opacity:1;transform:none}}
@keyframes zmOzet{from{opacity:.4}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.zm-satirlar li,.zm-sahne[data-evre="ozet"]{animation:none}}
`;
  document.head.appendChild(st);
})();
const yazZm=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const zmAzalt=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ilerleme (0–1): yavaş başlar, ortada hızlanır, sonda yavaşlar */
const zmIlerleme=()=>{const S=ZAMAN_SAHNE,x=Math.min(1,Math.max(0,(performance.now()-S.t0)/S.sure));return x*x*(3-2*x);};
function zamanSahnesiBaslat(o){
  const Z=STIL.kagit.zaman,S=ZAMAN_SAHNE,n=o.ozet.satirlar.length;
  Object.assign(S,{acik:true,o,t0:performance.now(),sure:Math.min(Z.enCok,Z.taban+n*Z.satir)*1000,gorunen:-1,saatDk:null,evre:zmAzalt()||(typeof duraklatmaVar==='function'&&duraklatmaVar())?'ozet':'akis'});
  if(S.evre==='akis')requestAnimationFrame(zamanKare);else zamanBitir(false);
}
/* akışta saat ve satırlar; değişmeyen karede DOM'a dokunulmaz */
function zamanKare(){
  const S=ZAMAN_SAHNE;if(!S.acik||S.evre!=='akis')return;
  const p=zmIlerleme(),Oz=S.o.ozet,an=Math.round(Oz.bas+(Oz.son-Oz.bas)*p);
  const dk=an%1440;if(dk!==S.saatDk){S.saatDk=dk;if(S.o.saat)S.o.saat(dk);}
  const E=document.querySelector('.oda .zm-sahne');
  if(E){const g=Oz.satirlar.filter(s=>s.an<=an).length;
    if(g!==S.gorunen){S.gorunen=g;E.innerHTML=zmAkisIc(an);}else{const t=E.querySelector('.zm-saat span');if(t)t.textContent=saatYazi(dk);const b=E.querySelector('.zm-saat b');if(b)b.textContent=S.o.gunYazi(anTarih(an).tarih);}}
  if(p>=1){zamanBitir(true);return;}
  requestAnimationFrame(zamanKare);
}
function zmAkisIc(an){
  const S=ZAMAN_SAHNE,Oz=S.o.ozet,L=Oz.satirlar.filter(s=>s.an<=an).slice(-4),t=anTarih(an);
  return'<p class="zm-saat"><b>'+yazZm(S.o.gunYazi(t.tarih))+'</b><span>'+saatYazi(t.dakika)+'</span></p>'+
    '<ol class="zm-satirlar">'+L.map(s=>'<li><time>'+yazZm(S.o.gunYazi(s.tarih).split(' ').pop()+' '+saatYazi(s.dakika))+'</time><span>'+yazZm(s.metin)+'</span></li>').join('')+'</ol>'+
    '<p class="zm-ipucu">Zaman geçiyor… atlamak için tıkla</p>';
}
function zmOzetIc(){
  const S=ZAMAN_SAHNE,Oz=S.o.ozet,K=Oz.kapaklar.slice(0,2);
  /* gelenler: önce gazete dışındakiler (en yeni üç), yer kalırsa son gazete */
  const A=Oz.satirlar.filter(s=>s.tur!=='gazete'),G=Oz.satirlar.filter(s=>s.tur==='gazete'),L=A.slice(-3).concat(A.length<3?G.slice(-(3-A.length)):[]).sort((x,y)=>x.an-y.an);
  const kalan=Oz.satirlar.length-L.length;
  return K.map(x=>'<div class="zm-kapak"><small>'+yazZm(gunAyYazi(x.tarih))+'</small><b>'+yazZm(x.baslik)+'</b><p>'+yazZm(x.metin)+'</p></div>').join('')+
    '<h4>'+yazZm(S.o.baslik)+'</h4><p class="zm-gecen">'+yazZm(sureYazi(Oz.gecen))+' geçti</p>'+
    (L.length?'<ol class="zm-satirlar">'+L.map(s=>'<li><time>'+yazZm(S.o.gunYazi(s.tarih).split(' ').pop()+' '+saatYazi(s.dakika))+'</time><span>'+yazZm(s.metin)+'</span></li>').join('')+'</ol>':'')+
    (kalan>0?'<p class="zm-gecen">ve '+kalan+' şey daha (defterde ve gazetede)</p>':'')+
    '<p class="zm-durak"><b>'+yazZm(S.o.durak)+'</b>'+(S.o.sonraki?'<br><small>Sıradaki: '+yazZm(S.o.sonraki)+'</small>':'')+'</p>'+
    '<p class="zm-ipucu">Devam: tıkla ya da Enter</p>';
}
function zamanSahnesiHtml(){
  const S=ZAMAN_SAHNE;if(!S.acik)return'';
  if(S.evre==='akis'){const Oz=S.o.ozet;return'<section class="zm-sahne" data-evre="akis" aria-hidden="true">'+zmAkisIc(Math.round(Oz.bas+(Oz.son-Oz.bas)*zmIlerleme()))+'</section>';}
  return'<section class="zm-sahne" data-evre="ozet" role="status" aria-label="Durak özeti">'+zmOzetIc()+'</section>';
}
/* akış biter ya da atlanır: saat gerçek ana, kart özete döner (oda yeniden çizer: İlerle düğmesi eski yazısına) */
function zamanBitir(){
  const S=ZAMAN_SAHNE;if(!S.acik)return;S.evre='ozet';
  if(S.o.saat)S.o.saat(S.o.ozet.son%1440);
  if(S.o.cizim)S.o.cizim();
}
function zamanSahnesiAtla(){if(ZAMAN_SAHNE.acik&&ZAMAN_SAHNE.evre==='akis')zamanBitir();}
function zamanSahnesiKapat(){const S=ZAMAN_SAHNE;if(!S.acik)return;S.acik=false;S.evre=null;const E=document.querySelector('.oda .zm-sahne');if(E)E.remove();}
