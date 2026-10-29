/* ============ Chairman — sayfa geçiş kartı: bilet (odadan maça) ve dönüş (maçtan odaya) (görüntü katmanı; U4, 2026-10-28) ============
   Maç sınırı sayfa yeniden yüklemesidir (F1-b): Stada git ve Odaya dön'de bir an boş, siyah kare görünüyordu. Giden sayfa kartı gösterir ve
   oturum deposuna (sessionStorage) yazar; yeni sayfa ilk boyamada aynı kartı çizer (bu betik #screen'den hemen sonra, Three.js ve oyun betiklerinden
   önce yüklenir), sayfa hazır olunca kart söner: oyunun ilk karesi çizilince (js/arayuz.js frame; odada da maçta da), en az GECIS_EN_AZ ms
   görünür kalarak (yanıp sönmesin), en geç GECIS_EN_COK ms sonra. Giden sayfadaki kart (kal) sayfa gidene dek durur. Kart tıklanmaz, beklettirmez (envanter 31: tek dokunuş, iskelet yok); okunan kart bir kez gösterilir.
   Bu betik STIL'den önce yüklenir: renkler STIL.kagit'in değerleriyle aynıdır (değişirse ikisi birlikte), yazılar oyunun yazı değişkenleri.
     gecisKartiGoster(o, kal)  o: {tur:'bilet'|'donus', ust, baslik, alt, not}   karartma ve kart hemen; kal: giden sayfada, kendiliğinden sönmez
     gecisKartiKaydet(o)  sonraki sayfa için yazar · gecisKartiKaldir()  söndürür (yoksa bir şey yapmaz) */
const GECIS_EN_COK=12000,GECIS_EN_AZ=700,GECIS_ANAHTAR='chairman.gecis';
function gecisKartiGoster(o,kal){
  if(typeof document==='undefined'||!o)return;
  const ekran=document.getElementById('screen');if(!ekran)return;
  if(!document.getElementById('gecisStili')){
    const st=document.createElement('style');st.id='gecisStili';
    st.textContent=`
.gecis{position:absolute;inset:0;z-index:30;display:grid;place-items:center;background:rgba(14,11,8,.9);font-family:var(--govde,system-ui);font-size:var(--k-yaziBoyu,max(14px,1.5cqw));
  animation:gecisGel .3s ease-out both;pointer-events:none}
.gecis.gecis-son{animation:gecisGit .25s ease-in both}
.gecis-kart{display:grid;grid-template-columns:auto minmax(0,1fr);min-width:min(60%,30em);max-width:80%;background:#fbf7ec;color:#26221c;border:1px solid #c9b994;box-shadow:.35em .45em 0 rgba(0,0,0,.45)}
.gecis-kocan{display:grid;place-items:center;padding:.6em .5em;border-right:.18em dashed #c9b994;background:#b4241c;color:#fbf7ec;writing-mode:vertical-rl;transform:rotate(180deg);
  font-family:var(--display,inherit);font-size:1.2em;letter-spacing:.2em}
.gecis-ic{display:grid;gap:.25em;padding:.8em 1.1em .9em}
.gecis-ic p{margin:0}
.gecis-ust{color:#6d6353;font-size:max(var(--k-enKucuk,12px),.85em);font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.gecis-baslik{font-family:var(--display,inherit);font-size:2em;line-height:1.05;color:#b4241c}
.gecis-alt{font-size:1.05em}
.gecis-not{color:#6d6353}
@keyframes gecisGel{from{opacity:0}to{opacity:1}}
@keyframes gecisGit{from{opacity:1}to{opacity:0}}
@media (prefers-reduced-motion:reduce){.gecis,.gecis.gecis-son{animation-duration:.01s}}
`;
    document.head.appendChild(st);
  }
  gecisKartiKaldir(true);
  const y=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const E=document.createElement('div');E.className='gecis';E.id='gecisKarti';E.setAttribute('role','status');E.dataset.tur=o.tur||'';E.dataset.t0=String(Date.now());if(kal)E.dataset.kal='1';
  E.innerHTML='<div class="gecis-kart"><div class="gecis-kocan" aria-hidden="true">'+(o.tur==='donus'?'MAÇ SONU':'BİLET')+'</div><div class="gecis-ic">'+
    (o.ust?'<p class="gecis-ust">'+y(o.ust)+'</p>':'')+'<p class="gecis-baslik">'+y(o.baslik)+'</p>'+(o.alt?'<p class="gecis-alt">'+y(o.alt)+'</p>':'')+(o.not?'<p class="gecis-not">'+y(o.not)+'</p>':'')+'</div></div>';
  ekran.appendChild(E);
  if(!kal)setTimeout(()=>gecisKartiKaldir(),GECIS_EN_COK);
}
function gecisKartiKaydet(o){try{sessionStorage.setItem(GECIS_ANAHTAR,JSON.stringify(o));}catch(_){}}
function gecisKartiKaldir(hemen){
  const E=typeof document!=='undefined'&&document.getElementById('gecisKarti');if(!E)return;
  if(hemen){E.remove();return;}
  if(E.dataset.kal||E.classList.contains('gecis-son'))return;
  const kalan=GECIS_EN_AZ-(Date.now()-Number(E.dataset.t0||0));if(kalan>0){if(!E.dataset.bekle){E.dataset.bekle='1';setTimeout(()=>{delete E.dataset.bekle;gecisKartiKaldir();},kalan);}return;}
  E.classList.add('gecis-son');setTimeout(()=>E.remove(),300);
}
/* ilk boyama: önceki sayfanın bıraktığı kart (bir kez) */
(function gecisIlkBoyama(){
  if(typeof sessionStorage==='undefined')return;
  let o=null;try{const s=sessionStorage.getItem(GECIS_ANAHTAR);if(s){sessionStorage.removeItem(GECIS_ANAHTAR);o=JSON.parse(s);}}catch(_){}
  if(o)gecisKartiGoster(o);
})();
