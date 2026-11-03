/* ============ Chairman — odak kabı: masadaki bir iş açılınca oda bulanır, iş ortada büyür (görüntü katmanı; U1, 2026-10-28) ============
   Kullanıcı kararı (2026-10-28, araclar/plan/u-arayuz.md §1): "O anda ne yapıyorsam yalnız onunla ilgileneyim." Telefon, dosya, defter, gazete,
   ayarlar, karar paneli ve kadro (TEST) aynı kapta açılır:
     perde     oda statik bulanık (STIL.kagit.odak.bulanik) ve karartılmış; bulanıklık canlandırılmaz, yalnız perdenin opaklığı gelir. Bulanıklık
               desteklenmezse ya da "saydamlığı azalt" tercihinde yalnız daha koyu karartma. Perdeye tıklamak işi masaya bırakır (ekran-oda.js).
     başlık    solda ‹ Geri (yalnız bir önceki ekran varsa; etiketi hedefin adı), yanında başlık, sağda Kapat × — her işte aynı yerde. RK5-a (2026-11-01,
               karar 83 “Kırtasiye”): kâğıtlı işte başlık satırı kâğıdın üst satırıdır (kâğıdın içinde, ince çizgiyle ayrılır); dosya ve defterde nesnenin
               üstünde ince krem şerit; telefonda yalnız düğmeler. Başlık gövde yazısıyla (piksel yazı yalnız cihaz göstergelerinde).
     kâğıt     panellerde içeriğe göre boylanan kâğıt (dev boş kâğıt yok); dosya ve defter kendi nesneleriyle, telefon cihazıyla kabı doldurur. Kâğıdın
               kenarı ince, gölgesi yumuşak (STIL.kagit.odak.golge); kalın kırmızı çerçeve yok.
   Geçiş: kâğıt nesnenin ekrandaki yerinden STIL.kagit.odak.sure.belir ms'de belirir (opaklık ve küçük ölçek), kapanınca çıkış kopyası
   sure.kapan ms'de söner; "hareketi azalt" tercihinde yalnız opaklık (sure.azalt). Her ekran aynı dili kullanır (ekran başına ayrı animasyon yok).
   Kural içermez; durum ve Esc zinciri js/ekran-oda.js'tedir. Eski seçiciler takma ad olarak yaşar (.od-panel, .od-telefonPanel, .od-icerik, .od-perde).
     odakKabi(s) → html. s: {ad, boy:'genis'|'orta'|'kucuk'|'cihaz', etiket (aria-label), sinif (ek sınıflar), baslik, geri:{etiket, eylem, veri}|null,
       kagit (true: paneller .od-icerik kâğıdında; false: dosya, defter), govde (html), belir (bu çizimde belirme geçişi), yan:{baslik, govde}|null}
       yan (U3 göz atma): iş sola kayıp daralır (STIL.kagit.odak.goz.is %; telefon kendi enini korur), sağda ikinci kâğıt (goz.yan %) açılır; içinde
       düğme yoktur (göz atmanın içinden yeni iş açılmaz); ekran okuyucu okur (U7 incelemesi: inert kalktı). Kapatmak ‹ Geri ve Esc'tir (js/ekran-oda.js odakGeriHedef).
     odakCikis(kap)  kapanmadan önce çağrılır: açık kabın görünür kopyası (etkileşimsiz) kapanma geçişiyle söner
     odakKokYerlestir(kap, nokta)  belirme geçişinin kökü: nesnenin karedeki yeri ({x,y} 0–1), yoksa kabın ortası */
(function odakStili(){
  if(typeof document==='undefined'||document.getElementById('odakStili'))return;
  const O=STIL.kagit.odak,st=document.createElement('style');st.id='odakStili';
  st.textContent=`
.oda .odk-perde{position:absolute;inset:0;z-index:1;background:${O.karartma};-webkit-backdrop-filter:blur(${O.bulanik}px);backdrop-filter:blur(${O.bulanik}px)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.oda .odk-perde{background:${O.yalnizKarartma}}}
@media (prefers-reduced-transparency:reduce){.oda .odk-perde{-webkit-backdrop-filter:none;backdrop-filter:none;background:${O.yalnizKarartma}}}
.oda .od-ust,.oda .od-alt{z-index:3}
.oda section.odk{position:absolute;z-index:2;top:2.5em;bottom:5.3em;left:calc((100% - var(--odk-en)) / 2);right:auto;width:var(--odk-en);--odk-en:${O.boy.genis}%;
  display:grid;grid-template-rows:auto minmax(0,1fr);gap:.35em;background:none;border:0;box-shadow:none}
.oda section.odk[data-boy="orta"]{--odk-en:${O.boy.orta}%}
.oda section.odk[data-boy="kucuk"]{--odk-en:${O.boy.kucuk}%}
/* RK6: yarım odak (ziyaret) — perde yok, oda bulanmaz; iş sol yarıda, kapı ve karşıdaki koltuk görünür */
.oda section.odk[data-boy="yarim"]{--odk-en:${O.boy.yarim||42}%;left:3%;top:3.2em}
.oda section.odk[data-boy="cihaz"]{--odk-en:${O.boy.cihaz}%}
/* R2 (2026-10-29): odada iki sütunlu telefon — solda telefon, sağda iş paneli (js/ekran-telefon.js .tlf); kâğıt yok, kabın kendisi taşır */
.oda section.odk[data-boy="telefon"]{--odk-en:${O.boy.telefon}%}
/* RK5-a: başlık satırı — ‹ Geri, başlık (sola yaslı), Kapat × (sağda). Kâğıtlı işte kâğıdın içinde; dosya ve defterde nesnenin üstünde krem şerit */
.oda section.odk[data-kagit]{grid-template-rows:minmax(0,1fr)}
.oda .odk header.odk-ust{display:flex;align-items:center;gap:.6em;min-height:2.1em;min-width:0}
.oda .odk-kagit.odk-ipucuVar{grid-template-rows:auto auto minmax(0,1fr)}
.oda section.odk[data-ipucu]:not([data-kagit]){grid-template-rows:auto auto minmax(0,1fr)}
.oda .odk-ipucu{margin:.35em .9em 0;padding:.25em .6em;border-left:.25em solid var(--k-amber,#b8860b);background:var(--k-zemin);color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.85em)}
.oda .odk-ust h3{flex:1;min-width:0;margin:0;font-family:var(--govde);font-weight:600;font-size:1.3em;line-height:1.2;letter-spacing:0;color:var(--k-yazi);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.oda .odk-ust .odk-sol{flex:none;max-width:45%;min-width:0;display:flex}
.oda .odk-ust .odk-sol:empty{display:none}
.oda .odk-ust .odk-sag{flex:none;margin-left:auto}
.oda .odk-ust button{font-size:max(var(--k-enKucuk,12px),.92em)}
.oda .odk-ust button.odk-geri{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.oda .odk-kagit>header.odk-ust{padding:.5em .7em .45em 1em;border-bottom:1px solid var(--k-cizgiAcik)}
.oda section.odk:not([data-kagit])>header.odk-ust{padding:.3em .45em .3em .9em;background:var(--k-krom);border:1px solid var(--k-cizgi);border-radius:.2em;box-shadow:${O.golge}}
.oda .odk:is([data-boy="cihaz"],[data-boy="telefon"]) header.odk-ust{padding:0;background:none;border:0;box-shadow:none}
.oda .odk:is([data-boy="cihaz"],[data-boy="telefon"]) header.odk-ust button{box-shadow:.12em .16em 0 rgba(0,0,0,.35)}
.oda .odk-kagit{min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);align-self:start;max-height:100%;background:var(--k-zemin);border:1px solid var(--k-cizgi);border-radius:.2em;box-shadow:${O.golge}}
.oda .odk-kagit>.od-icerik{min-height:0}
.oda .odk-govde{min-height:0;display:grid}
.oda .odk .dsy,.oda .odk .dft{position:relative;inset:auto;left:auto;right:auto;top:auto;bottom:auto;min-height:0;height:100%;z-index:auto}
.oda .odk:is([data-boy="cihaz"],[data-boy="telefon"]) header.odk-ust h3{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.oda .odk:is([data-boy="cihaz"],[data-boy="telefon"]) .odk-kagit{align-self:stretch;height:100%;background:none;border:0;box-shadow:none}
.oda .odk:is([data-boy="cihaz"],[data-boy="telefon"]) .od-icerik{display:block;padding:0;overflow:hidden;height:100%}
/* U3 göz atma: iş solda daralır, sağda okunan kâğıt */
.oda section.odk[data-goz]{left:${O.goz.kenar}%}
.oda section.odk[data-goz]:not([data-boy="cihaz"]){--odk-en:${O.goz.is}%}
.oda aside.odk-goz{position:absolute;z-index:2;top:2.5em;bottom:5.3em;right:${O.goz.kenar}%;width:${O.goz.yan}%;display:grid;grid-template-rows:auto minmax(0,1fr);gap:.35em;
}
.oda aside.odk-goz.odk-gozBelir{animation:odkGoz ${O.sure.belir}ms cubic-bezier(.2,.7,.3,1) both}
.oda aside.odk-goz[data-boy="cihaz"]{width:calc(100% - ${O.boy.cihaz}% - ${3*O.goz.kenar}%)}
.oda .odk-gozUst{display:flex;align-items:baseline;justify-content:space-between;gap:.6em;min-height:2.1em;color:var(--k-serit);text-shadow:0 .08em .3em rgba(0,0,0,.45)}
.oda .odk-gozUst h4{margin:0;font-weight:600;font-size:1.1em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.oda .odk-gozUst small{flex:none;font-size:max(var(--k-enKucuk,12px),.85em);opacity:.9}
.oda .odk-gozIcerik{min-height:0;align-self:start;max-height:100%;overflow-y:auto;padding:.6em .8em;background:var(--k-serit);border:1px solid var(--k-cizgi);border-left:.3em solid var(--k-mavi);border-radius:.2em;box-shadow:${O.golge}}
@keyframes odkGoz{from{opacity:0;transform:translateX(1.5em)}to{opacity:1;transform:none}}
/* R1-f (2026-10-29) dar kare (< 820 px): yazı tabanında küçülmez, yerleşim değişir — odak kabı neredeyse tam genişlik; göz atmada yan kâğıt işin
   yanına sığmaz, işin üstüne açılır (‹ Geri ve Esc aynı) */
@container (max-width:820px){
  .oda section.odk:not([data-boy="cihaz"]):not([data-boy="kucuk"]),.oda section.odk[data-goz]:not([data-boy="cihaz"]){--odk-en:96%;left:2%}
  .oda aside.odk-goz,.oda aside.odk-goz[data-boy="cihaz"]{left:2%;right:2%;width:auto;z-index:3}
  /* RK5-a: gövde tabanı 16'ya çıkınca dar karede kap alt şeridin hemen üstüne kadar iner (masa şeridi zaten perdenin altında; --od-alt: alt şeridin
     ölçülen yüksekliği, js/ekran-oda.js); büyük yazıda telefonun iş panelindeki kart kaydırmadan görünür (B47, B48) */
  .oda section.odk:not([data-boy="yarim"]),.oda aside.odk-goz{bottom:calc(var(--od-alt,4.8em) + .45em)}
}
/* CM1-a (karar 86): CM çerçevesinde işin üst ve alt sınırı ölçülen şeritlerden (--od-ust: başlık şeridi ve sekme satırı; --od-alt: alt şerit; js/ekran-oda.js);
   masada başka ekran açıkken oda canlı zemin olarak arkada (perde STIL.cerceve.perde; balkonda yarım odak aynı) */
.screen[data-serit] .oda section.odk,.screen[data-serit] .oda aside.odk-goz{top:calc(var(--od-ust,2.6em) + .35em);bottom:calc(var(--od-alt,3em) + .35em)}
.screen[data-serit] .oda section.odk[data-boy="yarim"]{top:calc(var(--od-ust,2.6em) + .6em)}
.screen[data-serit] .oda:not([data-yer="balkon"]) .odk-perde{background:${STIL.cerceve?STIL.cerceve.perde:O.karartma}}
@media (prefers-reduced-motion:reduce){.oda aside.odk-goz.odk-gozBelir{animation:odkPerde ${O.sure.azalt}ms linear both}}
.oda .odk.odk-belir{animation:odkBelir ${O.sure.belir}ms cubic-bezier(.2,.7,.3,1) both}
.oda .odk-perde.odk-belir{animation:odkPerde ${O.sure.perde}ms ease-out both}
.oda .odk-cikis{pointer-events:none}
.oda .odk.odk-cikis{animation:odkKapan ${O.sure.kapan}ms ease-in both}
.oda .odk-perde.odk-cikis{animation:odkPerdeKapan ${O.sure.perdeKapan}ms ease-in both}
@keyframes odkBelir{from{opacity:0;transform:scale(${O.olcek})}to{opacity:1;transform:none}}
@keyframes odkKapan{from{opacity:1;transform:none}to{opacity:0;transform:scale(${O.olcek})}}
@keyframes odkPerde{from{opacity:0}to{opacity:1}}
@keyframes odkPerdeKapan{from{opacity:1}to{opacity:0}}
@media (prefers-reduced-motion:reduce){
  .oda .odk.odk-belir{animation:odkPerde ${O.sure.azalt}ms linear both}
  .oda .odk.odk-cikis{animation:odkPerdeKapan ${O.sure.azalt}ms linear both}}
`;
  document.head.appendChild(st);
})();

const yazOdk=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
function odakKabi(s){
  const g=s.geri?'<button type="button" class="odk-geri" data-eylem="'+yazOdk(s.geri.eylem)+'"'+Object.entries(s.geri.veri||{}).map(([a,v])=>' data-'+a+'="'+yazOdk(v)+'"').join('')+
    ' title="Geri (Esc)">‹ '+yazOdk(s.geri.etiket)+'</button>':'';
  const ust='<header class="odk-ust"><span class="odk-sol">'+g+'</span><h3>'+yazOdk(s.baslik)+'</h3><span class="odk-sag"><button type="button" class="od-kapat" data-eylem="kapat" title="Masaya bırak (Esc)">Kapat ×</button></span></header>';
  /* RK5-a: kâğıtlı işte başlık satırı kâğıdın içinde (üst satır) */
  const ip=s.ipucu?'<p class="odk-ipucu" role="note">'+yazOdk(s.ipucu)+'</p>':'';   /* CM2-b: alıştırma ipucu (tek satır) */
  const govde=s.kagit?'<div class="odk-kagit'+(ip?' odk-ipucuVar':'')+'">'+ust+ip+'<div class="od-icerik">'+s.govde+'</div></div>':ust+ip+'<div class="odk-govde">'+s.govde+'</div>';
  const yan=s.yan?'<aside class="odk-goz'+(s.yan.belir?' odk-gozBelir':'')+'" data-boy="'+(s.boy||'genis')+'" aria-label="Göz at: '+yazOdk(s.yan.baslik)+'"><header class="odk-gozUst"><h4>'+yazOdk(s.yan.baslik)+'</h4><small>yalnız okuma</small></header>'+
    '<div class="odk-gozIcerik">'+s.yan.govde+'</div></aside>':'';
  return(s.boy==='yarim'?'':'<div class="odk-perde od-perde'+(s.belir?' odk-belir':'')+'" data-perde="1"></div>')+
    '<section class="odk'+(s.sinif?' '+s.sinif:'')+(s.belir?' odk-belir':'')+'" data-odak="'+yazOdk(s.ad)+'" data-boy="'+(s.boy||'genis')+'"'+(s.yan?' data-goz="1"':'')+(ip&&!s.kagit?' data-ipucu="1"':'')+(s.kagit?' data-kagit="1" role="dialog" aria-label="'+yazOdk(s.etiket)+'"':'')+'>'+govde+'</section>'+yan;
}
/* kapanma: açık kabın kopyası etkileşimsiz, ekran okuyucudan gizli; karta ait kimlik ve sınıflar silinir (kart bileşeni kopyayı bulmasın) */
function odakCikis(kap){
  if(typeof document==='undefined')return;
  const ac=kap.querySelector('section.odk:not(.odk-cikis)'),pe=kap.querySelector('.odk-perde:not(.odk-cikis)');
  if(!ac)return;
  for(const el of [pe,ac]){if(!el)continue;
    const c=el.cloneNode(true);c.classList.remove('odk-belir');c.classList.add('odk-cikis');c.setAttribute('aria-hidden','true');c.inert=true;c.removeAttribute('role');
    c.removeAttribute('data-perde');for(const x of c.querySelectorAll('[id],[data-is],[data-eylem],.kk-kart,.kk-alan')){x.removeAttribute('id');x.removeAttribute('data-is');x.removeAttribute('data-eylem');x.classList.remove('kk-kart','kk-alan');}
    for(const x of [c,...c.querySelectorAll('.od-panel,.od-telefonPanel,.od-icerik,.dsy,.dft,.od-perde')])x.classList.remove('od-panel','od-telefonPanel','od-icerik','dsy','dft','od-perde');
    c.dataset.cikis='1';
    const sil=()=>c.remove();c.addEventListener('animationend',sil,{once:true});setTimeout(sil,STIL.kagit.odak.sure.kapan+120);
    odakCikislar.push(c);}
}
let odakCikislar=[];
/* yeniden çizimden sonra çıkış kopyaları kabın sonuna eklenir */
function odakCikisEkle(kap){for(const c of odakCikislar)kap.appendChild(c);odakCikislar=[];}
function odakKokYerlestir(kap,nokta){
  const s=kap.querySelector('section.odk.odk-belir');if(!s)return;
  const K=kap.getBoundingClientRect(),r=s.getBoundingClientRect();if(!r.width||!r.height)return;
  const x=nokta?K.left+nokta.x*K.width:r.left+r.width/2,y=nokta?K.top+nokta.y*K.height:r.top+r.height/2;
  s.style.transformOrigin=((x-r.left)/r.width*100).toFixed(1)+'% '+((y-r.top)/r.height*100).toFixed(1)+'%';
}
