/* ============ Chairman — Haberler ekranı (görüntü; kural içermez; CM1-b 2026-11-03, karar 87; AR2 2026-11-05; arayüz güncellemesi 2. madde 2026-11-05) ============
   2. madde (kullanıcı, 2026-11-05; araclar/plan/arayuz-guncelleme.md §2; önizleme prototipler/arayuz-guncelleme/02-tek-kart/simge/index.html?v=1): Haberler
   tamamen karttır. Liste ve ayrıntı kalktı: ekranın ortasında tek kart destesi (js/gelismeler.js haberDestesi), üstte sabit soru ve küçük tür etiketi,
   kartın yüzünde haberin kanalının rengi, kişinin büyük yüzü, kulübün arması ya da kurumun kutusu, altta krem ad plakası (ad, görev · saat). Kart sağa
   ya da sola kaydırılınca (←/→) üst yarısında o cevabın adı, kısa sonucu ve “neye dokunduğu” simgeleri; bırakınca (Enter) uygulanır, damga yok
   (js/ekran-kart.js kartEtkilesimKur, damga:false). Kararlar da destededir; haber kartına tepki gelismeTepki komutudur. Erteleme yok, sayı yok:
   destenin kalınlığı arkadaki kart sırtlarıyla görünür; deste bitmeden İlerle çalışmaz (kapı js/ekran-oda.js). Kartın ekleri altta: Ayrıntı kartın
   yanında kâğıt açar (haberde kanalın görünüşü — balon, kupür, belge, skor —, kararda hazır görüş ve bağlam), öbürleri gideceği yere götürür.
     haberDestesiGorunumu(k, d, y)  d: {ek, kilit, gelis}  y: {yaz, tarihYazi, tarihKisa, saatYazi, tlYazi, smg, portre(id)}
     haberAyrintiHtml(k, x, d, y, h)  kanalın görünüşü (ek kâğıdı; AR2'nin ayrıntı paneli)
   Seçiciler denemelerle sözleşmedir: .hbd, .hbd-kart[data-is][data-deste][data-kanal], .hbd-soru, .hbd-sirt, .hbd-ekler [data-eylem="hbdEk"|"hbGit"|"sonraAc"],
   .hbd-ek, .hbd-bos */
'use strict';
(function haberlerStili(){
  if(typeof document==='undefined'||document.getElementById('haberlerStili'))return;
  const st=document.createElement('style');st.id='haberlerStili';
  st.textContent=`
.hb-kaynakK{display:inline-grid;place-items:center;width:1.6em;height:1.6em;flex:none}
.hb-kaynakK img{width:1.6em;height:1.6em;image-rendering:pixelated;border-radius:50%;background:var(--c-panel2)}
.hb-kaynakK .arma{width:1.3em;height:1.5em}
.hb-kurum{display:inline-grid;place-items:center;min-width:1.6em;height:1.4em;padding:0 .15em;font:800 max(12px,.62em) var(--cerceve);letter-spacing:.03em;color:var(--c-pyazi);
  background:var(--c-panel2);border:1px solid var(--c-pcizgi2);border-radius:.15em}
  white-space:nowrap;color:var(--c-psoluk)}
.hb-ayrinti{min-height:0;overflow:auto}
.hb-ayrinti>.cmp-ic{display:grid;gap:.6em;align-content:start}
.hb-kaynak{display:flex;align-items:center;gap:.7em}
.hb-kaynak .hb-kaynakK{width:2.6em;height:2.6em}
.hb-kaynak .hb-kaynakK img{width:2.6em;height:2.6em}
.hb-kaynak .hb-kaynakK .arma{width:2.2em;height:2.5em}
.hb-kaynak .hb-kurum{min-width:2.6em;height:2.2em;font-size:max(12px,.8em)}
.hb-kaynak div{display:grid;min-width:0}
.hb-kaynak b{font-weight:700}
.hb-kaynak small{color:var(--c-psoluk);font-size:max(12px,.86em)}
.hb-ayrinti h3{margin:0;font:700 1.08em var(--govde);line-height:1.3}
.hb-kanal{display:grid;gap:.45em;padding:.6em .75em;background:var(--c-panel2);border:1px solid var(--c-pcizgi);border-radius:.2em}
.hb-kanalEtiket{font:800 max(12px,.72em) var(--cerceve);letter-spacing:.08em;text-transform:uppercase;color:var(--c-psoluk)}
.hb-balon{justify-self:start;max-width:40em;padding:.45em .7em;background:var(--c-panel);border:1px solid var(--c-pcizgi2);border-radius:.6em .6em .6em .15em}
.hb-balon[data-yon="giden"]{justify-self:end;border-radius:.6em .6em .15em .6em;background:var(--c-psecili);color:var(--c-pseciliYazi)}
.hb-balon[data-yon="not"]{justify-self:center;background:none;border-style:dashed;color:var(--c-psoluk)}
.hb-balon small{display:block;margin-top:.15em;color:inherit;opacity:.7;font-size:max(12px,.8em)}
.hb-kupur{justify-self:start;max-width:36em;padding:.6em .8em;color:#1d1a14;background:#ece4cf;border:1px solid #b9ad8c;box-shadow:.15em .15em 0 rgba(0,0,0,.35)}
.hb-kupur b{font:700 max(12px,.72em) var(--serif,Georgia);letter-spacing:.12em}
.hb-kupur h4{margin:.2em 0 0;font:700 1.05em var(--serif,Georgia);line-height:1.3}
.hb-kupur small{display:block;color:#5c5442;font-size:max(12px,.8em)}
.hb-belge{justify-self:start;min-width:min(100%,24em);padding:.6em .8em;color:#1d1a14;background:#f3f0e6;border:1px solid #b9b2a0}
.hb-belge>b{font:700 max(12px,.72em) var(--serif,Georgia);letter-spacing:.1em}
.hb-belge dl{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.15em 1em;margin:.35em 0 0}
.hb-belge dd{margin:0;font-variant-numeric:tabular-nums;font-weight:700;text-align:right}
.hb-skor{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:.8em}
.hb-skor>span{display:flex;align-items:center;gap:.5em;min-width:0}
.hb-skor>span:first-child{justify-content:flex-end;text-align:right}
.hb-skor>b{font:800 1.5em var(--cerceve);font-variant-numeric:tabular-nums}
.hb-skorlar{display:grid;gap:.15em}
.hb-skorlar .hb-skor>b{font-size:1.05em}
.hb-satirlar{margin:0;padding-left:1.1em;display:grid;gap:.15em}
.hb-kapi{display:flex;gap:.8em;align-items:center}
.hb-kapi .hb-kaynakK{width:3.2em;height:3.2em}
.hb-kapi .hb-kaynakK img{width:3.2em;height:3.2em}
.hb-ayrinti .od-dugmeler,.hb-eylemler{display:flex;flex-wrap:wrap;gap:.4em}

/* ---- 2. madde: deste (Simge kartı · 1 Rafine; prototipler/arayuz-guncelleme/02-tek-kart/simge/index.html?v=1) ---- */
.hbd{display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;height:100%;min-height:0;font-family:var(--cerceve);color:var(--c-pyazi)}
.hbd-soru{max-width:46em;margin:0 auto;padding:1.1em 1.2em .2em;text-align:center}
.hbd-tur{display:block;margin-bottom:.5em;font-size:max(12px,.75em);font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--c-ana)}
.hbd-soru p{margin:0;font-size:1.45em;font-weight:500;line-height:1.36;color:#F6F1E1;overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical}
.hbd-orta{display:flex;align-items:center;justify-content:center;gap:2em;min-height:0;padding:1em 0 .4em}
.hbd-yuva{position:relative;height:min(25.5em,100%);aspect-ratio:350/410;flex:none}
.hbd-sirt{position:absolute;inset:0;border-radius:1.4em;box-sizing:border-box;border:.62em solid #DDD5BF;background:repeating-linear-gradient(45deg,#14214F 0 .75em,#1a2a5e .75em 1.5em);
  transform:translateY(calc(var(--n) * .38em));box-shadow:0 2px 6px rgba(0,0,0,.3)}
.hbd .kk-kart.hbd-kart{position:absolute;inset:0;display:flex;flex-direction:column;gap:0;padding:0;box-sizing:border-box;overflow:hidden;border:.62em solid #F6F1E1;border-radius:1.4em;
  background:#F6F1E1;box-shadow:0 1.4em 2.8em rgba(0,0,0,.5);color:#fff}
.hbd .kk-kart.hbd-kart[data-hazir]{border-color:#F2C230;box-shadow:0 0 0 .18em #F2C230,0 1.4em 2.8em rgba(0,0,0,.5)}
.hbd .kk-kart.hbd-kart:focus-visible{outline:.16em solid #fff;outline-offset:.2em}
.hbd-kart .kk-yuzler{display:block;position:relative;flex:1;min-height:0}
.hbd-kart .kk-yuzKat{font-size:1em}
.hbd-kart .kk-yuzKat[data-yuz="notr"]{position:absolute;inset:0;display:flex;flex-direction:column;visibility:visible;gap:0}
.hbd-kart .kk-yuzKat[data-yuz="sol"],.hbd-kart .kk-yuzKat[data-yuz="sag"]{position:absolute;left:0;right:0;top:0;height:46%;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:.35em;padding:0 1em;box-sizing:border-box;text-align:center;background:rgba(10,18,48,.92);color:#fff}
.hbd-kanal{position:absolute;top:.55em;left:.55em;z-index:1;display:inline-flex;align-items:center;gap:.35em;padding:.25em .65em .25em .5em;border-radius:1em;font-size:max(12px,.7em);font-weight:700;
  letter-spacing:.1em;text-transform:uppercase;color:#fff;background:rgba(10,18,48,.55)}
.hbd-yuz{flex:1;display:grid;place-items:center;min-height:0;background:radial-gradient(circle at 50% 42%,color-mix(in srgb,var(--kanal) 55%,#fff) 0,var(--kanal) 72%)}
.hbd-kart img,.hbd-kart svg{pointer-events:none;-webkit-user-drag:none;user-select:none}   /* yüz resmi sürüklenmez: kart sürüklenir */
.hbd-yuz img{width:10.5em;height:10.5em;image-rendering:pixelated;border-radius:.75em;box-shadow:0 .5em 1.1em rgba(0,0,0,.25);background:#c9d3ee}
.hbd-yuz .arma{font-size:2.6em}
.hbd-kurum{display:grid;place-items:center;width:7.5em;height:7.5em;border-radius:.75em;background:rgba(10,18,48,.5);box-shadow:0 .5em 1.1em rgba(0,0,0,.25)}
.hbd-kurum b{font-size:2.6em;font-weight:700;letter-spacing:.04em}
.hbd-plaka{flex:none;display:flex;flex-direction:column;align-items:center;gap:.1em;padding:.55em .7em .7em;background:#F6F1E1;color:#14214F;text-align:center}
.hbd-plaka b{font-size:1.3em;font-weight:700;line-height:1.15;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hbd-plaka small{font-size:max(12px,.88em);color:#3A3A48;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hbd-cevapAd{display:flex;align-items:center;gap:.4em;font-size:1.55em;font-weight:700;line-height:1.15}
.hbd-cevapAd .kk-simge{font-size:.7em;color:var(--c-ana);border-color:currentColor}
.hbd-cevapNot{font-size:max(12px,.88em);line-height:1.3;color:#DDE3F5}
.hbd-kart .kk-uyari{margin:0;font-size:max(12px,.82em);color:#FF8A8A}
.hbd-ipuclari{display:flex;justify-content:center;gap:.6em}
.hbd-ip{display:flex;flex-direction:column;align-items:center;gap:.15em;font-size:max(12px,.7em);font-weight:600}
.hbd-ip>span{display:grid;place-items:center;width:2.2em;height:2.2em;border-radius:50%;background:rgba(255,255,255,.14);color:var(--c-ana);overflow:hidden;font-size:1.3em}
.hbd-ip img{width:100%;height:100%;image-rendering:pixelated}
.hbd-kilit{margin:0;padding:.3em .6em;font-size:max(12px,.8em);color:#14214F;background:#F2C230}
.hbd-ek{width:min(22em,40%);max-height:100%;overflow:auto;align-self:center;font-family:var(--govde)}
.hbd-ekler{display:flex;justify-content:center;flex-wrap:wrap;gap:.5em;padding:.8em 1em .3em}
.oda .hbd-ekler button{display:inline-flex;align-items:center;gap:.4em;padding:.4em 1em .4em .75em;font:500 max(12px,.88em) var(--cerceve);color:#F6F1E1;background:var(--c-dugmeUst);
  border:1px solid rgba(255,255,255,.16);border-radius:1em;box-shadow:none}
.oda .hbd-ekler button[aria-pressed="true"]{color:#14214F;background:var(--c-ana);border-color:var(--c-ana)}
.hbd-ekler svg{width:1em;height:1em}
.hbd-ipucu{margin:0;padding:.3em 1em .9em;text-align:center;font-size:max(12px,.8em);color:var(--c-psoluk)}
.hbd-bos{display:grid;place-items:center;height:100%;text-align:center;font-family:var(--cerceve);color:var(--c-psoluk)}
.hbd-bos b{display:block;font-size:1.6em;color:#fff;margin-bottom:.3em}
.hbd-gelis .hbd-kart{animation:hbdCevir .45s cubic-bezier(.2,.8,.2,1)}
@keyframes hbdCevir{from{transform:translateY(.38em) rotateY(80deg);filter:brightness(.6)}}
@media (prefers-reduced-motion:reduce){.hbd-gelis .hbd-kart{animation:none}}`;
  document.head.appendChild(st);
})();
const HB_KANAL_AD={telefon:'Telefon · mesaj',kapi:'Kapı · yüz yüze',gazete:'Gazete',belge:'Belge',lig:'Lig',para:'Muhasebe',ajanda:'Ajanda',grup:'Ligden',karar:'Karar',dosya:'Dosya'};
const HB_KAT_AD={kulup:'Kulüp',transfer:'Transfer',lig:'Lig',basin:'Basın',para:'Para',karisik:''};
const HB_YER={telefon:'telefonda da',dosya:'dosyada da',karar:'defterde de'};
/* ---- 2. madde (2026-11-05): deste. d: {ek (açık ekin kartı), kilit (duraklatmanın nedeni), gelis (yeni kart dönerek gelsin)}; y ekran yardımcıları ---- */
const HBD_KANAL_AD={telefon:'Mesaj',gazete:'Gazete',lig:'Lig',grup:'Ligden',dosya:'Rapor',para:'Kasa',ajanda:'Kulüp',karar:'Karar',kapi:'Kapı'};
const HBD_KANAL_SIMGE={telefon:'telefon',gazete:'gazete',lig:'mac',grup:'mac',dosya:'dosya',para:'kasa',ajanda:'takvim',karar:'dosya',kapi:'kapi'};
const HBD_IPUCU={kasa:['kasa','Kasa'],basin:['gazete','Basın'],tribun:['takim','Tribün'],is:['dosya','İş']};
function haberKaynakAdi(k,q){return!q?'':q.tur==='kisi'?((k.kisiler[q.id]||{}).ad||''):q.tur==='kulup'?((k.kulupler[q.id]||{}).ad||''):q.ad||'';}
function haberKaynakRolu(k,q){
  if(!q)return'';if(q.tur==='kisi'){const p=k.kisiler[q.id];return p&&typeof kisiRolu==='function'?kisiRolu(k,p):'';}
  return q.tur==='kulup'?'Kulüp':q.kisa==='GZT'?'Gazete':q.kisa==='TFF'?'Federasyon':q.kisa==='LİG'?'Lig':q.ad||'';
}
function haberDestesiGorunumu(k,d,y){
  const yaz=y.yaz,D=typeof haberDestesi==='function'?haberDestesi(k):[],x=D[0];
  if(!x)return'<div class="hbd hbd-bos"><p><b>Masa boş.</b>Bütün kartlara baktın; İlerle açık.</p></div>';
  const q=x.kaynak,ad=haberKaynakAdi(k,q),rol0=haberKaynakRolu(k,q),rol=rol0===ad?'':rol0,t=anTarih(x.an),zaman=(t.tarih===k.tarih?'bugün ':y.tarihKisa(t.tarih)+' ')+y.saatYazi(t.dakika);
  const kanal=(STIL.cerceve.kanal||{})[x.kanal]||'#2C3D7A',smg=a=>y.smg?y.smg(a):'';
  const yuz=!q?'<span class="hbd-kurum"><b>•</b></span>':q.tur==='kisi'?(y.portre?y.portre(q.id):''):q.tur==='kulup'?(typeof armaSvg==='function'?armaSvg(q.id,'buyuk',((k.kulupler||{})[q.id]||{}).kisa):'')
    :'<span class="hbd-kurum"><b>'+yaz(q.kisa||'·')+'</b></span>';
  const ip=L=>(L||[]).map(z=>{
    if(z.indexOf('kisi:')===0){const p=k.kisiler[z.slice(5)];return p?'<span class="hbd-ip"><span>'+(y.portre?y.portre(p.id):'')+'</span>'+yaz(String(p.ad).split(' ')[0])+'</span>':'';}
    const I=HBD_IPUCU[z];return I?'<span class="hbd-ip"><span>'+smg(I[0])+'</span>'+I[1]+'</span>':'';}).join('');
  const cevap=(c,yon)=>'<div class="kk-yuzKat" data-yuz="'+yon+'"'+(c.engel?' data-engel="1"':'')+'><b class="hbd-cevapAd">'+(x.tur==='karar'&&typeof kartSimge==='function'?kartSimge(c.id):'')+yaz(c.ad)+'</b>'+
    (c.not?'<span class="hbd-cevapNot">'+yaz(c.not)+'</span>':'')+(c.engel?'<p class="kk-uyari">'+yaz(c.engel)+'</p>':'')+(c.ipucu&&c.ipucu.length?'<span class="hbd-ipuclari">'+ip(c.ipucu)+'</span>':'')+'</div>';
  const kenar=(c,yon)=>'<button type="button" class="kk-kenar" data-yon="'+yon+'" data-secim="'+yaz(c.id)+'"'+(c.engel?' aria-disabled="true" title="'+yaz(c.engel)+'"':'')+'><b>'+yaz(c.ad)+'</b></button>';
  const veri=x.tur==='karar'?x.isId:x.id,etiket=(x.tur==='karar'?'Karar: ':'Haber: ')+ad;
  const n=Math.min(5,D.length-1),sirt=Array.from({length:n},(_,i)=>'<i class="hbd-sirt" style="--n:'+(n-i)+'"></i>').join('');
  const kart='<section class="kk-kart hbd-kart" data-is="'+yaz(veri)+'" data-deste="'+yaz(x.id)+'" data-yuz="notr" data-sol="'+yaz(x.sol.id)+'" data-sag="'+yaz(x.sag.id)+'" data-sol-ad="'+yaz(x.sol.ad)+'" data-sag-ad="'+yaz(x.sag.ad)+'"'+
    ' data-kanal="'+yaz(x.kanal)+'" style="--kanal:'+kanal+'" tabindex="0" role="group" aria-label="'+yaz(etiket)+'"'+(d.kilit?' aria-disabled="true"':'')+'>'+
    '<div class="kk-yuzler"><div class="kk-yuzKat kk-yuz" data-yuz="notr"><span class="hbd-kanal">'+(x.tur==='karar'?smg('dosya')+'Karar':smg(HBD_KANAL_SIMGE[x.kanal]||'nokta')+yaz(HBD_KANAL_AD[x.kanal]||''))+'</span>'+
      '<div class="hbd-yuz">'+yuz+'</div>'+(d.kilit?'<p class="hbd-kilit">'+yaz(d.kilit)+'</p>':'')+'<div class="hbd-plaka"><b>'+yaz(ad)+'</b><small>'+yaz([rol,zaman].filter(Boolean).join(' · '))+'</small></div></div>'+
      cevap(x.sol,'sol')+cevap(x.sag,'sag')+'</div><div class="kk-kenarlar" hidden>'+kenar(x.sol,'sol')+kenar(x.sag,'sag')+'</div></section>';
  /* ekler: kartla gelen evrak (kaydırmadan önce bakılır). Ayrıntı kartın yanında kâğıt: haberde kanalın görünüşü, kararda hazır görüş ve bağlam;
     öbürleri gideceği yere götürür (‹ Geri Haberler'e döner, kart yerinde bekler) */
  const ekAcik=d.ek===x.id,E=['<button type="button" data-eylem="hbdEk" data-deste="'+yaz(x.id)+'" aria-pressed="'+(ekAcik?'true':'false')+'">'+smg('dosya')+'Ayrıntı</button>'];
  if(x.tur==='haber'&&typeof gelismeAyrinti==='function'){const A=gelismeAyrinti(k,x.satir);
    for(const e of (A?A.eylemler:[]))E.push('<button type="button" data-eylem="hbGit" data-bolum="'+yaz(e[1])+'"'+(e[2]?' data-sekme="'+yaz(e[2])+'"':'')+(e[3]?' data-veri="'+yaz(JSON.stringify(e[3]))+'"':'')+'>'+yaz(e[0])+'</button>');}
  if(x.tur==='karar')E.push('<button type="button" data-eylem="sonraAc" data-is="'+yaz(x.isId)+'">'+(x.yer==='telefon'?'Konuşmada aç ▸':x.yer==='dosya'?'Dosyada aç ▸':'Karar panelinde aç ▸')+'</button>');
  let ek='';
  if(ekAcik){
    if(x.tur==='haber'){
      const h={kaynakK:z=>!z?'<span class="hb-kaynakK"><span class="hb-kurum">•</span></span>':z.tur==='kisi'?'<span class="hb-kaynakK">'+(y.portre?y.portre(z.id):'')+'</span>'
        :z.tur==='kulup'?'<span class="hb-kaynakK">'+(typeof armaSvg==='function'?armaSvg(z.id,'kucuk',((k.kulupler||{})[z.id]||{}).kisa):'')+'</span>':'<span class="hb-kaynakK"><span class="hb-kurum">'+yaz(z.kisa||'·')+'</span></span>',
        kaynakAd:z=>haberKaynakAdi(k,z)};
      /* AR2 ayrıntısının eylemleri ekler satırındadır (ek kâğıdında tekrarlanmaz) */
      ek='<aside class="hbd-ek">'+haberAyrintiHtml(k,x.satir,{},y,h).replace(/<div class="hb-eylemler">[\s\S]*?<\/div>(?=<\/div><\/section>$)/,'')+'</aside>';
    }else{
      const is=k.isler[x.isId],v=is?is.veri:{};
      const gor=typeof kararGorusu==='function'?kararGorusu(k,v):'',bg=is&&typeof kartBaglam==='function'?kartBaglam(k,is,null,{}):'';
      ek='<aside class="hbd-ek"><section class="cmp-panel hb-ayrinti"><div class="cmp-ic"><h3>'+yaz(x.etiket)+'</h3><p>'+yaz(x.soru)+'</p>'+(gor||'')+(bg||'')+
        (!gor&&!bg?'<p class="cmp-not">Bu kararın başka evrakı yok: bilinen her şey kartta.</p>':'')+'</div></section></aside>';
    }
  }
  return'<div class="hbd'+(d.gelis?' hbd-gelis':'')+'" data-tur="'+x.tur+'"><header class="hbd-soru"><span class="hbd-tur">'+yaz(x.etiket||HBD_KANAL_AD[x.kanal]||'')+'</span><p>'+yaz(x.soru)+'</p></header>'+
    '<div class="hbd-orta"><div class="hbd-yuva">'+sirt+kart+'</div>'+ek+'</div>'+
    '<nav class="hbd-ekler" aria-label="Kartın ekleri">'+E.join('')+'</nav>'+
    '<p class="hbd-ipucu">Kartı sağa ya da sola kaydır · ←/→ önizle, Enter uygula'+(D.length>1?'':' · son kart')+'</p></div>';
}/* ayrıntı paneli: kaynak, başlık, kanalın görünüşü, eylemler; kararın kartı */
function haberAyrintiHtml(k,x,d,y,h){
  const yaz=y.yaz;
  if(!x)return'<section class="cmp-panel hb-ayrinti" data-kanal=""><div class="cmp-ic"><p class="cmp-not">Bir satır seç; ayrıntı burada açılır, listeden ayrılmazsın.</p></div></section>';
  const zaman=x.tur==='karar'?'en geç '+(x.sonCevap.tarih===k.tarih?'bugün ':yaz(y.tarihKisa(x.sonCevap.tarih))+' ')+y.saatYazi(x.sonCevap.dakika)
    :x.tur==='randevu'?'bugün '+y.saatYazi(x.dakika)+(x.sure?'–'+y.saatYazi((x.dakika+x.sure)%1440):''):x.tarih?yaz(y.tarihYazi(x.tarih))+' · '+y.saatYazi(x.dakika):'';
  const ust='<div class="hb-kaynak">'+h.kaynakK(x.kaynak)+'<div><b>'+yaz(h.kaynakAd(x.kaynak)||(x.tur==='takip'?'Takipteki iş':''))+'</b><small>'+[zaman,HB_KAT_AD[x.kategori]||''].filter(Boolean).join(' · ')+'</small></div></div>';
  const btn=e=>'<button type="button" class="cmp-dugme" data-eylem="hbGit" data-bolum="'+yaz(e[1])+'"'+(e[2]?' data-sekme="'+yaz(e[2])+'"':'')+(e[3]?' data-veri="'+yaz(JSON.stringify(e[3]))+'"':'')+'>'+yaz(e[0])+'</button>';
  const kanal=(ad,ic,et)=>'<div class="hb-kanal hb-kanal-'+ad+'"><span class="hb-kanalEtiket">'+yaz(et||HB_KANAL_AD[ad]||ad)+'</span>'+ic+'</div>';
  const balon=m=>'<p class="hb-balon" data-yon="'+yaz(m.yon)+'">'+yaz(m.metin)+'<small>'+(m.yon==='giden'?'Sen':m.yon==='not'?'':'')+(m.tarih?' '+yaz(y.tarihKisa(m.tarih))+' '+y.saatYazi(m.dakika):'')+'</small></p>';
  /* telefonda ve gazetede başlık kanalın içinde (balon, kupür): ayrıca yazılmaz */
  const panel=(knl,ic,E)=>'<section class="cmp-panel hb-ayrinti" data-kanal="'+knl+'" data-id="'+yaz(x.id)+'"><div class="cmp-ic">'+ust+(knl==='telefon'&&!x.tur||knl==='gazete'?'':'<h3>'+yaz(x.baslik)+'</h3>')+ic+
    (E&&E.length?'<div class="hb-eylemler">'+E.join('')+'</div>':'')+'</div></section>';
  /* cevap bekleyen karar: kart ayrıntıda */
  if(x.tur==='karar'){
    const knl=x.yer==='telefon'?'telefon':x.yer==='dosya'?'dosya':'karar';
    const E=['<button type="button" class="cmp-dugme" data-eylem="sonraAc" data-is="'+yaz(x.isId)+'">'+(x.yer==='telefon'?'Konuşmada aç ▸':x.yer==='dosya'?'Dosyada aç ▸':'Karar panelinde aç ▸')+'</button>'];
    return panel(knl,'<div class="hb-kartAlan">'+(d.kart?d.kart(x.isId):'')+'</div><p class="cmp-not">Cevap bu kartla verilir; aynı kart '+yaz(HB_YER[x.yer]||'defterde de')+' durur. Sonraya bırakırsan '+zaman+' “Cevap bekliyor”da kalır.</p>',E);
  }
  if(x.tur==='cevaplandi'){
    const g=(k.gecmis||[]).slice().reverse().find(z=>z.tur==='is'&&z.isId===x.isId),s=g&&g.sonuc||{};
    const S=g&&typeof gecmisOzetSatirlari==='function'?gecmisOzetSatirlari(k,g).map(z=>z.metin):[];
    return panel('karar',kanal('karar',(s.secimMetni?'<p class="hb-balon" data-yon="giden">'+yaz(s.secimMetni)+'</p>':'')+(s.bilgi?'<p>'+yaz(s.bilgi)+'</p>':'')+(S.length?'<ul class="hb-satirlar">'+S.map(z=>'<li>'+yaz(z)+'</li>').join('')+'</ul>':'')),[]);
  }
  if(x.tur==='randevu'){
    const p=x.kisiId&&k.kisiler[x.kisiId],E=[btn(['Ajandada gör ▸','ajanda',null,{tarih:k.tarih}])];
    const kapi=d.kapi&&d.kapi(x.isId);if(kapi)E.unshift('<button type="button" class="cmp-dugme" data-eylem="hbKapi" data-is="'+yaz(x.isId)+'">Kapıya bak ▸</button>');
    return panel('kapi',kanal('kapi','<div class="hb-kapi">'+h.kaynakK(x.kaynak)+'<div><b>'+(p?yaz(p.ad)+' karşında oturacak.':yaz(x.baslik))+'</b><p class="cmp-not">'+
      (kapi?'Kapıda bekliyor.':'Saati gelince İlerle durur, kapıda karşılarsın.')+'</p></div></div>'),E);
  }
  if(x.tur==='takip'){const m=k.meseleler[x.meseleId],R=m&&m.sablon&&typeof sablonSahiplik==='function'?sablonSahiplik(k,m):null,E=['<button type="button" class="cmp-dugme" data-eylem="dosyaAc" data-mesele="'+yaz(x.meseleId)+'">Dosyayı aç ▸</button>'];
    /* AR3-b (karar 95): devredilen işi buradan da geri alırsın; sicil kişinin yürüttüğü işlerin olgusu */
    if(R&&R.devral&&!R.engel)E.push('<button type="button" class="cmp-dugme" data-eylem="sahipDevral" data-mesele="'+yaz(x.meseleId)+'">Devral ▸</button>');
    const S=R&&R.sahip&&typeof kisiSicili==='function'?kisiSicili(k,R.sahip):null,sic=S?'<p class="cmp-not">'+yaz(kisiAdi(k,R.sahip))+' · sicili: '+yaz(S.is||S.devralinan?S.satir:'ilk işi')+'</p>':'';
    return panel('ajanda',kanal('ajanda','<p>'+yaz(x.satir)+'</p>'+sic),E);}
  const A=gelismeAyrinti(k,x);if(!A)return panel('',x.baslik,[]);
  const G=A.govde,E=A.eylemler.map(btn),ad=id=>((k.kulupler[id]||{}).ad||id);
  const skor=m=>'<div class="hb-skor"><span>'+yaz(ad(m.ev))+' '+(y.arma?y.arma(m.ev):'')+'</span><b>'+(m.skor?m.skor[0]+' – '+m.skor[1]:y.saatYazi(m.dakika))+'</b><span>'+(y.arma?y.arma(m.konuk):'')+' '+yaz(ad(m.konuk))+'</span></div>';
  let ic='';
  if(A.kanal==='telefon')ic=kanal('telefon',G.mesajlar.map(balon).join('')||'<p>'+yaz(x.baslik)+'</p>');
  else if(A.kanal==='gazete')ic=kanal('gazete','<div class="hb-kupur"><b>GAZETE</b><small>'+yaz(y.tarihYazi(G.tarih))+(G.cikti?'':' · yarın sabahki sayıda')+'</small><h4>'+yaz(G.metin)+'</h4></div>');
  else if(A.kanal==='belge')ic=kanal('belge','<div class="hb-belge"><b>'+yaz(String(((k.kulupler[(k.kisiler[k.baskanId]||{}).kulupId]||{}).ad||'')).toLocaleUpperCase('tr-TR'))+' · MALİ İŞLER</b><dl>'+
    G.satirlar.map(s=>'<dt>'+yaz(s.ad)+'</dt><dd>'+yaz(y.tlYazi(s.tutar))+'</dd>').join('')+'</dl></div>');
  else if(A.kanal==='lig')ic=kanal('lig',(G.mac?skor(G.mac):'')+'<p class="cmp-not">'+(G.mac&&G.mac.hazirlik?'Hazırlık maçı':G.mac?G.mac.hafta+'. hafta':'')+'</p>');
  else if(A.kanal==='grup')ic=kanal('grup',(G.maclar.length?'<div class="hb-skorlar">'+G.maclar.map(skor).join('')+'</div>':'')+(G.obur.length?'<ul class="hb-satirlar">'+G.obur.map(z=>'<li>'+yaz(z)+'</li>').join('')+'</ul>':''),G.maclar.length?'Ligden':'Kısa haberler');
  else if(A.kanal==='para')ic=kanal('para','<p>'+yaz(G.metin)+'</p>');
  else ic=kanal('ajanda','<ul class="hb-satirlar">'+G.satirlar.map(z=>'<li>'+yaz(z)+'</li>').join('')+'</ul>');
  return panel(A.kanal,ic,E);
}
