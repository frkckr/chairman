/* ============ Chairman — kulüp armaları (görüntü yardımcısı; kural ve kayıt yok; R3-b, 2026-10-29) ============
   Kullanıcının isteği (2026-10-29): “takım logolarını da uyduralım ve ilgili yerlere ekleyelim”. Armalar kodla çizilen satır içi SVG'dir (dış görsel
   yok). TEST yer tutucusudur: kullanıcı ARMA_TARIFLERI'ni değiştirir; görsel turda (YOL_HARITASI karar 49) yenilenebilir. Kuruluş yılı ya da uydurma
   geçmiş yazılmaz (kulübün geçmişi içeriktir). Renkler yalnız armadadır; formalar bugünkü iki ortak formadır (STIL.formalar ev, deplasman).
     ARMA_TARIFLERI[kulüpKimliği] = {bicim, renk:[zemin, motif, kenar], motif}
       bicim: 'kalkan' | 'eskutcon' | 'daire' | 'rozet' | 'sancak'; motif: ARMA_MOTIF anahtarı (kulübün adından esinli)
     armaSvg(kulüpKimliği, boy, kısaAd) → html   boy 'kucuk' (satır, tablo, köşe skoru: düz HTML/CSS; biçim, renk ve baş harf) | 'orta' | 'buyuk'
       (SVG: biçim, motif ve kısa ad şeridi; büyükte şeritte kısa ad). Harfler CSS ::after'dadır: sayfa metnine (textContent) karışmaz. Tarifi
       olmayan kulüpte biçim ve renk kimlikten türetilir (belirlenimci), motif yerine baş harf. Arma süstür: aria-hidden; kulübün adı her yerde
       yanında yazılıdır. */
'use strict';
const ARMA_TARIFLERI={
  demirkapi:{bicim:'kalkan',renk:['#c8281e','#f2ede2','#6e140e'],motif:'kapi'},
  akdeniz:{bicim:'daire',renk:['#eef0f3','#22347a','#22347a'],motif:'dalga'},
  yildiztepe:{bicim:'eskutcon',renk:['#1d3557','#f2c230','#0f1d33'],motif:'yildizTepe'},
  karaova:{bicim:'kalkan',renk:['#1b1b1b','#5aa246','#0b0b0b'],motif:'ova'},
  camlibel:{bicim:'rozet',renk:['#1f5a3a','#f4f1e6','#123824'],motif:'cam'},
  sariyamac:{bicim:'daire',renk:['#e8b422','#7a1f2b','#7a1f2b'],motif:'gunes'},
  kocadere:{bicim:'kalkan',renk:['#2a6fb0','#f4f6f8','#173f66'],motif:'dere'},
  tasharman:{bicim:'eskutcon',renk:['#5e6168','#e08a2e','#33353a'],motif:'duvar'},
  ilicakoy:{bicim:'rozet',renk:['#23877b','#f4f1e6','#135249'],motif:'buhar'},
  bozkaya:{bicim:'kalkan',renk:['#8a7a5c','#1d1b18','#4f4535'],motif:'kaya'},
  mercanli:{bicim:'daire',renk:['#1e2f5a','#e4572e','#e4572e'],motif:'mercan'},
  degirmenalti:{bicim:'sancak',renk:['#5b3a8c','#f2c230','#34215a'],motif:'cark'},
  kuyulu:{bicim:'rozet',renk:['#7a4a2a','#f2e6cf','#4a2c18'],motif:'cikrik'},
  ardicli:{bicim:'eskutcon',renk:['#2d4a2b','#d9483b','#1a2c19'],motif:'ardic'},
  sogutlu:{bicim:'sancak',renk:['#f4f6f1','#4f8f3a','#4f8f3a'],motif:'sogut'},
  eskiharman:{bicim:'kalkan',renk:['#7a1f2b','#d4a73c','#4a121a'],motif:'basak'}
};
/* biçimler (viewBox 0 0 64 72) */
const ARMA_BICIM={
  kalkan:'M6 5h52v29c0 18-11 29-26 35C17 63 6 52 6 34z',
  eskutcon:'M4 9q14-7 28 0q14-7 28 0v23c0 20-13 31-28 37C17 63 4 52 4 32z',
  daire:'M32 4a32 32 0 1 0 .01 0z',
  rozet:'M20 4h24l16 16v32L44 68H20L4 52V20z',
  sancak:'M8 3h48v47L32 69 8 50z'
};
/* motifler: ikinci renkle (c), merkez yaklaşık (32, 44); kısa ad şeridinin altı */
const ARMA_MOTIF={
  kapi:c=>'<path d="M21 60V42a11 11 0 0 1 22 0v18z" fill="'+c+'"/><path d="M26.5 45v15M32 39.5v20.5M37.5 45v15M21 49h22" stroke="#00000055" stroke-width="2" fill="none"/><path d="M17 60V34h6v26M41 60V34h6v26" fill="'+c+'"/>',
  dalga:c=>'<path d="M12 40q5-6 10 0t10 0t10 0t10 0M12 48q5-6 10 0t10 0t10 0t10 0M12 56q5-6 10 0t10 0t10 0t10 0" stroke="'+c+'" stroke-width="3.2" fill="none" stroke-linecap="round"/>',
  yildizTepe:c=>'<path d="M10 60l14-15 7 6 11-12 12 21z" fill="'+c+'"/><path d="M42 26l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z" fill="'+c+'"/>',
  ova:c=>'<path d="M10 42h44" stroke="'+c+'" stroke-width="3"/><path d="M32 44L14 60M32 44l-6 16M32 44l6 16M32 44l18 16" stroke="'+c+'" stroke-width="2.4" fill="none"/><circle cx="32" cy="33" r="5" fill="'+c+'"/>',
  cam:c=>'<path d="M32 26l11 13h-5l8 9h-6l7 8H17l7-8h-6l8-9h-5z" fill="'+c+'"/><rect x="29.5" y="56" width="5" height="6" fill="'+c+'"/>',
  gunes:c=>'<circle cx="32" cy="45" r="8" fill="'+c+'"/><path d="M32 30v5M32 55v5M17 45h5M42 45h5M21.4 34.4l3.5 3.5M39.1 52.1l3.5 3.5M42.6 34.4l-3.5 3.5M24.9 52.1l-3.5 3.5" stroke="'+c+'" stroke-width="3" stroke-linecap="round"/>',
  dere:c=>'<path d="M20 28c14 6-8 14 6 20s-6 12 8 16" stroke="'+c+'" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M38 30c10 5-4 11 6 16" stroke="'+c+'" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
  duvar:c=>'<path d="M14 36h17v7H14zM33 36h17v7H33zM14 45h8v7h-8zM24 45h17v7H24zM43 45h7v7h-7zM14 54h17v7H14zM33 54h17v7H33z" fill="'+c+'"/>',
  buhar:c=>'<path d="M24 50c-4-5 4-8 0-13M32 50c-4-5 4-8 0-13M40 50c-4-5 4-8 0-13" stroke="'+c+'" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M15 53h34l-4 8H19z" fill="'+c+'"/>',
  kaya:c=>'<path d="M8 60l13-22 8 9 9-17 18 30z" fill="'+c+'"/><path d="M29 47l9-17 5 9" stroke="#ffffff66" stroke-width="2" fill="none"/>',
  mercan:c=>'<path d="M32 62V44M32 50l-9-9V31M32 46l9-9V28M23 39l-5-4M41 35l5-5M32 44l-4-10" stroke="'+c+'" stroke-width="3.4" fill="none" stroke-linecap="round"/>',
  cark:c=>'<circle cx="32" cy="45" r="13" fill="none" stroke="'+c+'" stroke-width="3.4"/><path d="M32 30v30M17 45h30M21.4 34.4l21.2 21.2M42.6 34.4L21.4 55.6" stroke="'+c+'" stroke-width="2.4"/><circle cx="32" cy="45" r="3.5" fill="'+c+'"/>',
  cikrik:c=>'<path d="M18 36l14-9 14 9z" fill="'+c+'"/><path d="M21 36v24M43 36v24M21 41h22" stroke="'+c+'" stroke-width="3"/><path d="M29 41v7M26 48h6v6h-6z" stroke="'+c+'" stroke-width="2" fill="'+c+'"/><path d="M15 60h34" stroke="'+c+'" stroke-width="3"/>',
  ardic:c=>'<path d="M20 60c6-10 14-18 26-30" stroke="'+c+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+[[26,48],[31,42],[36,37],[41,33],[23,53]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="3.2" fill="'+c+'"/>').join(''),
  sogut:c=>'<path d="M32 28v32" stroke="'+c+'" stroke-width="3"/>'+[[-1,34],[1,38],[-1,44],[1,49]].map(([s,y])=>'<path d="M32 '+y+'q'+(s*10)+' 4 '+(s*12)+' 14" stroke="'+c+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>').join(''),
  basak:c=>'<path d="M32 62V28" stroke="'+c+'" stroke-width="2.6"/>'+[30,36,42,48].map(y=>'<ellipse cx="27.5" cy="'+(y+2)+'" rx="2.6" ry="4.6" transform="rotate(-25 27.5 '+(y+2)+')" fill="'+c+'"/><ellipse cx="36.5" cy="'+(y+2)+'" rx="2.6" ry="4.6" transform="rotate(25 36.5 '+(y+2)+')" fill="'+c+'"/>').join('')
};
/* tarifi olmayan kulüp: biçim ve iki renk kimlikten (belirlenimci) */
const ARMA_PALET=[['#2b4c7e','#f1e9d2'],['#7a1f2b','#f1e9d2'],['#2d5a27','#f2c230'],['#3b3b3b','#e08a2e'],['#5b3a8c','#f4f1e6'],['#a3241b','#1d1b18']];
function armaTarifi(id){
  if(ARMA_TARIFLERI[id])return ARMA_TARIFLERI[id];
  let h=0;for(const ch of String(id))h=(h*31+ch.charCodeAt(0))>>>0;
  const B=Object.keys(ARMA_BICIM),P=ARMA_PALET[h%ARMA_PALET.length];
  return{bicim:B[(h>>>4)%B.length],renk:[P[0],P[1],P[0]],motif:null};
}
const armaHarf=(id,kisa)=>String(kisa||id||'?').replace(/\s+/g,'').toLocaleUpperCase('tr-TR');
function armaSvg(id,boy,kisa){
  const T=armaTarifi(id),[z,m,kn]=T.renk,yol=ARMA_BICIM[T.bicim]||ARMA_BICIM.kalkan,H=armaHarf(id,kisa),kid=String(id).replace(/[^a-z0-9_-]/gi,'');
  const harf=v=>String(v).replace(/[&<>"]/g,'');
  /* küçük (satır, tablo, köşe skoru): düz HTML ve CSS — biçim, renk, baş harf; harf ::after'dadır (sayfa metnine karışmaz) */
  if(boy==='kucuk')return'<i class="arma arma-kucuk" data-kulup="'+kid+'" data-bicim="'+T.bicim+'" data-harf="'+harf(H.slice(0,1))+'" style="--arma-z:'+z+';--arma-m:'+m+';--arma-k:'+kn+'" aria-hidden="true"></i>';
  /* orta ve büyük: SVG (biçim, kısa ad şeridi, motif); harfler yine ::after'da (büyükte şeritte, motifsiz kulüpte ortada) */
  const motif=ARMA_MOTIF[T.motif];
  const ic=motif?'<path d="M12 14h40v10H12z" fill="'+m+'"/>'+motif(m):'';
  const yazi=motif?(boy==='buyuk'?H.slice(0,3):''):H.slice(0,1);
  return'<i class="arma arma-'+(boy==='buyuk'?'buyuk':'orta')+(motif?'':' arma-harfOrta')+'" data-kulup="'+kid+'"'+(yazi?' data-harf="'+harf(yazi)+'"':'')+' style="--arma-z:'+z+';--arma-m:'+m+'" aria-hidden="true">'+
    '<svg viewBox="0 0 64 72" focusable="false"><path d="'+yol+'" fill="'+z+'" stroke="'+kn+'" stroke-width="3" stroke-linejoin="round"/>'+ic+'</svg></i>';
}
/* ortak boy: satır içi, yazının boyuna göre; küçük biçimler clip-path ile */
(function armaStili(){
  if(typeof document==='undefined'||document.getElementById('armaStili'))return;
  const st=document.createElement('style');st.id='armaStili';
  st.textContent=`
.arma{position:relative;display:inline-block;flex:none;vertical-align:-.2em;font-style:normal;line-height:1}
.arma>svg{display:block;width:100%;height:100%;overflow:visible}
.arma::after{content:attr(data-harf);position:absolute;left:0;right:0;text-align:center;font-family:var(--govde,sans-serif);font-weight:700;pointer-events:none}
.arma-kucuk{width:1em;height:1.1em;background:var(--arma-z);box-shadow:inset 0 0 0 .07em var(--arma-k)}
.arma-kucuk::after{top:50%;transform:translateY(-55%);font-size:.62em;color:var(--arma-m)}
.arma-kucuk[data-bicim="kalkan"]{clip-path:polygon(0 0,100% 0,100% 52%,50% 100%,0 52%)}
.arma-kucuk[data-bicim="eskutcon"]{clip-path:polygon(0 8%,50% 0,100% 8%,100% 52%,50% 100%,0 52%)}
.arma-kucuk[data-bicim="daire"]{height:1em;border-radius:50%}
.arma-kucuk[data-bicim="rozet"]{clip-path:polygon(28% 0,72% 0,100% 24%,100% 76%,72% 100%,28% 100%,0 76%,0 24%)}
.arma-kucuk[data-bicim="sancak"]{clip-path:polygon(0 0,100% 0,100% 68%,50% 100%,0 68%)}
.arma-kucuk[data-bicim="kalkan"]::after,.arma-kucuk[data-bicim="eskutcon"]::after,.arma-kucuk[data-bicim="sancak"]::after{transform:translateY(-70%)}
.arma-orta{width:1.6em;height:1.8em}
.arma-buyuk{width:3.2em;height:3.6em}
.arma-buyuk::after{top:19.5%;font-size:.42em;letter-spacing:.04em;color:var(--arma-z)}
.arma-harfOrta::after{top:50%;transform:translateY(-55%);font-size:.9em;color:var(--arma-m)}
.arma-orta.arma-harfOrta::after{font-size:.75em}
`;
  document.head.appendChild(st);
})();
