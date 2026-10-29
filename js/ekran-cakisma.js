/* ============ Chairman — kayıt çakışması örtüsü (görüntü katmanı; R1-a, 2026-10-29) ============
   Aynı kariyer iki pencerede açıksa geride kalan pencere öbürünün ilerlemesinin üstüne yazmasın: kayıt oturumu yazmadan ve komut uygulamadan önce
   kayıttaki ana metni kendi gördüğüyle karşılaştırır (js/kayit.js kayitOturumu). Fark varsa komut uygulanmaz, kayıt yazılmaz ve bu örtü açılır.
   Tarayıcıda başka pencerenin yazımı storage olayıyla da gelir (js/oyun-oturumu.js): örtü oyuncu bir şeye dokunmadan önce belirir.
   Örtü bütün oyun karesini (#screen) kaplar, oda, bülten ve maçta aynıdır; sahneyi genel duraklatmayla dondurur ('cakisma' nedeni), alttaki her şeyi
   etkileşimsiz yapar. Tek düğme: kayıttan yeniden açmak (oda; maç sayfasındaysa da odaya döner: maç günü kayıtta geçmiş olabilir). Üstüne yazma
   seçeneği yoktur (R1 Claude kararı: kayıttaki daha yeni ilerleme oyuncunun tek tıklamasıyla kaybolmasın).
   Kural içermez. Kariyerin anı ve kayıttaki an oturum durumundan gelir: durum.cakisma = {kayittaki:{tarih,dakika}|null} */
'use strict';
(function cakismaStili(){
  if(typeof document==='undefined'||document.getElementById('cakismaStili'))return;
  const K=STIL.kagit,st=document.createElement('style');st.id='cakismaStili';
  st.textContent=`
.ckm-ortu{position:absolute;inset:0;z-index:40;display:grid;place-items:center;padding:1em;background:rgba(18,14,10,.72);
  font-family:var(--govde);font-size:var(--k-yaziBoyu,1.5cqw);line-height:1.4;color:${K.yazi}}
.ckm-kart{max-width:min(34em,92%);display:grid;gap:.7em;padding:1.2em 1.4em;background:${K.zemin};border:1px solid ${K.cizgi};box-shadow:.35em .45em 0 ${K.golge}}
.ckm-kart h3{margin:0;font-size:1.25em;line-height:1.25}
.ckm-kart p{margin:0}
.ckm-kart .ckm-an{color:${K.soluk};font-variant-numeric:tabular-nums}
.ckm-kart button{justify-self:start;font:inherit;font-weight:600;padding:.45em 1em;color:${K.vurguYazi};background:${K.vurguZemin};border:1px solid ${K.vurgu};cursor:pointer}
.ckm-kart button:focus-visible{outline:.15em solid ${K.mavi};outline-offset:.15em}`;
  document.head.appendChild(st);
})();
function cakismaAnYazi(t){return t&&t.tarih?gunAyYazi(t.tarih)+' '+saatYazi(t.dakika|0):null;}
function cakismaOrtusuGoster(durum){
  if(typeof document==='undefined')return;
  const ekran=document.getElementById('screen');if(!ekran||ekran.querySelector('.ckm-ortu'))return;
  if(typeof duraklatmaEkle==='function')duraklatmaEkle('cakisma');
  for(const c of ekran.children)c.inert=true;
  const c=durum&&durum.cakisma||{},kayittaki=cakismaAnYazi(c.kayittaki),bu=typeof OYUN!=='undefined'&&OYUN.kariyer?cakismaAnYazi({tarih:OYUN.kariyer.tarih,dakika:OYUN.kariyer.gunIciDakika}):null;
  const o=document.createElement('div');o.className='ckm-ortu';o.setAttribute('role','alertdialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-labelledby','ckmBaslik');
  o.innerHTML='<div class="ckm-kart"><h3 id="ckmBaslik">Bu kariyer başka bir pencerede ilerledi</h3>'+
    '<p>Bu penceredeki son değişiklik kaydedilmedi; kayıttaki daha yeni ilerleme korunuyor.</p>'+
    (kayittaki||bu?'<p class="ckm-an">'+(kayittaki?'Kayıtta: '+kayittaki:'')+(kayittaki&&bu?' · ':'')+(bu?'Bu pencerede: '+bu:'')+'</p>':'')+
    '<p>Öbür pencereyi kapatıp kariyere kayıttan devam et.</p>'+
    '<button type="button" class="ckm-ac">Kayıttan yeniden aç</button></div>';
  ekran.appendChild(o);
  const b=o.querySelector('.ckm-ac');
  b.addEventListener('click',()=>{location.href=location.pathname;});
  o.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();b.focus();}e.stopPropagation();},true);
  /* odak örtünün dışındaysa (boşluğa tıklandı) tuşlar alttaki oyuna gitmez */
  addEventListener('keydown',e=>{if(!o.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();b.focus({preventScroll:true});}},true);
  b.focus({preventScroll:true});
}
if(typeof oyunCakismaDinle==='function')oyunCakismaDinle(cakismaOrtusuGoster);
