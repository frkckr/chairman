/* ============ Chairman — Haberler ekranı (görüntü; kural içermez; CM1-b 2026-11-03, karar 87; AR2 2026-11-05, arayuz-uygulama §3) ============
   AR2 (karar 90; önizleme prototipler/arayuz-konsept, Haberler Düzen 1): koyu CM görünümü — üstte liste, altta ayrıntı (dar alanda da alt alta).
   Liste: cevap bekleyenler (kararlar, bugünün randevuları) kırmızı blokla başta, sonra gelişmeler güne göre, yeniden eskiye; aynı günün arka plan
   satırları tek satırda (js/gelismeler.js gelismeGruplari). Satır: saat · kaynak (kişinin yüzü, kulübün arması ya da kurum kutusu) · başlık · rozet;
   okunmamış kalın, arka soluk, seçili vurgulu. Ayrıntı seçili satırın kanal görünüşüyle (gelismeAyrinti): telefon balonu, gazete kupürü, belge (raporun
   ilk üç satırı), lig skoru, kapı (“karşında oturacak”), günün satırları. Cevap bekleyen kararın tek kartı ayrıntıdadır: listeden çıkmadan karar
   (kart bileşeni js/ekran-kart.js; ev sahibi js/ekran-oda.js d.kart). Cevaplanan kararın satırı “Cevaplandı” olur, sonucu ayrıntıda.
   Bugün: listenin üstünde tek satır (son maç ve bugünün kalan işleri; gelismeBugun). Sekmeler başlık şeridinin altındaki sekme satırındadır.
     haberSatirlari(k, d)       → {ust, alt, hepsi}: d {sekme, gun, cevaplanan}; satırların kimlikleri: gelişmeninki, 'k:'+isId (karar), 'r:'+isId
                                  (randevu), 't:'+meseleId (takipte), grup:<tarih>; saf okuma (ekranın seçimi ve okundu işareti bundan)
     haberlerGorunumu(k, d, y)  d: {sekme, gun, secili, cevaplanan, kart(isId), kapi(isId)}  y: {yaz, tarihYazi, tarihKisa, saatYazi, tlYazi, smg, portre, arma}
   Seçiciler denemelerle sözleşmedir: .hb, .hb-satir[data-id][data-yeni][data-sinif][aria-current], .hb-gun, .hb-cevapBlok, .hb-ayrinti[data-kanal],
   .hb-kanal, .hb-kaynak, [data-eylem="hbSec"|"hbSonraki"|"hbHepsiOkundu"|"hbDaha"|"hbGit"|"sonraAc"|"hbAjanda"|"dosyaAc"] */
'use strict';
(function haberlerStili(){
  if(typeof document==='undefined'||document.getElementById('haberlerStili'))return;
  const st=document.createElement('style');st.id='haberlerStili';
  st.textContent=`
.hb{display:grid;grid-template-rows:minmax(9em,1fr) fit-content(56%);gap:.7em;min-height:0;height:100%;color:var(--c-pyazi)}
.hb-listePanel{min-height:0}
.hb[data-kart="1"]{grid-template-rows:fit-content(38%) minmax(0,1fr)}
.hb-listePanel>h2>span small{margin-left:.6em}
.hb-listePanel>h2 .hb-arac{display:flex;gap:.4em}
.hb-kay{overflow:auto;min-height:0;padding:.15em 0 .3em}
.hb-bugun{margin:0;padding:.45em .9em;border-bottom:1px solid var(--c-pcizgi);color:var(--c-psoluk);font-size:max(12px,.9em)}
.hb-bugun b{color:var(--c-pyazi);font-weight:700}
.hb-gun{margin:.55em .9em .15em;font:800 max(12px,.76em) var(--cerceve);letter-spacing:.08em;text-transform:uppercase;color:var(--c-pbaslik)}
.hb-gun.hb-kirmizi{color:var(--c-kotu)}
.hb-liste{list-style:none;margin:0;padding:0;display:grid}
.oda button.hb-satir{display:grid;grid-template-columns:3.6em 1.7em minmax(0,1fr) auto;align-items:center;gap:.55em;width:100%;text-align:left;padding:.32em .9em .3em;
  font:inherit;color:inherit;background:transparent;border:0;border-bottom:1px solid var(--c-pcizgi);border-radius:0;box-shadow:none;font-weight:400;cursor:pointer}
.oda button.hb-satir:hover{background:var(--c-puzerinde)}
.oda button.hb-satir[aria-current="true"]{background:var(--c-psecili);color:var(--c-pseciliYazi)}
.oda button.hb-satir[aria-current="true"] :is(time,.hb-rozet){color:inherit}
.hb-satir time{font-family:var(--mono);font-size:max(12px,.86em);color:var(--c-psoluk)}
.hb-satir .hb-bas{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.oda button.hb-satir[data-yeni="1"] .hb-bas{font-weight:700}
.oda button.hb-satir[data-sinif="arka"]:not([aria-current="true"]){color:var(--c-psoluk)}
.oda button.hb-satir.hb-bek{border-left:.25em solid var(--c-kotu)}
.oda button.hb-satir.hb-bekRandevu{border-left-color:var(--c-pvurgu)}
.hb-kaynakK{display:inline-grid;place-items:center;width:1.6em;height:1.6em;flex:none}
.hb-kaynakK img{width:1.6em;height:1.6em;image-rendering:pixelated;border-radius:50%;background:var(--c-panel2)}
.hb-kaynakK .arma{width:1.3em;height:1.5em}
.hb-kurum{display:inline-grid;place-items:center;min-width:1.6em;height:1.4em;padding:0 .15em;font:800 max(12px,.62em) var(--cerceve);letter-spacing:.03em;color:var(--c-pyazi);
  background:var(--c-panel2);border:1px solid var(--c-pcizgi2);border-radius:.15em}
.hb-rozet{font-style:normal;font-size:max(12px,.72em);font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:.05em .45em;border:1px solid currentColor;border-radius:.15em;
  white-space:nowrap;color:var(--c-psoluk)}
.hb-rozet[data-r="cevap"]{color:var(--c-kotu)}
.hb-rozet[data-r="randevu"],.hb-rozet[data-r="beklenen"]{color:var(--c-pvurgu)}
.hb-rozet[data-r="kacan"]{color:var(--c-kotu);border-style:dashed}
.hb-rozet[data-r="cevaplandi"]{color:var(--c-iyi)}
.hb-nokta{width:.5em;height:.5em;border-radius:50%;background:var(--c-haber)}
.hb-bos{margin:.6em .9em;color:var(--c-psoluk)}
.oda .hb-daha{margin:.4em .9em}
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
.hb-kartAlan{display:grid;gap:.4em;padding:.4em 0}
.hb-ayrinti .od-dugmeler,.hb-eylemler{display:flex;flex-wrap:wrap;gap:.4em}
`;
  document.head.appendChild(st);
})();
const HB_KANAL_AD={telefon:'Telefon · mesaj',kapi:'Kapı · yüz yüze',gazete:'Gazete',belge:'Belge',lig:'Lig',para:'Muhasebe',ajanda:'Ajanda',grup:'Ligden',karar:'Karar',dosya:'Dosya'};
const HB_KAT_AD={kulup:'Kulüp',transfer:'Transfer',lig:'Lig',basin:'Basın',para:'Para',karisik:''};
const HB_YER={telefon:'telefonda da',dosya:'dosyada da',karar:'defterde de'};
/* satırlar: ust (cevap bekleyenler ve bu oturumda cevaplananlar), alt (gelişmeler; arka satırlar günde tek); hepsi = ust + alt (seçim ve N sırası) */
function haberSatirlari(k,d){
  const gun=d.gun||GELISME_TEST.gun,sekme=d.sekme||'hepsi',C=d.cevaplanan||{};
  const B=gelismeBekleyenler(k),kat=id=>{const m=id&&k.meseleler[id];return m&&typeof meseleKategorisi==='function'?GELISME_MESELE_KATEGORI[meseleKategorisi(m)[0]]||'kulup':'kulup';};
  const bekleyen=B.kararlar.map(x=>({id:'k:'+x.isId,tur:'karar',isId:x.isId,baslik:x.baslik,kaynak:x.kaynak,kisiId:x.kisiId,yer:x.yer,sonCevap:x.sonCevap,
      an:x.gelis?anDakika(x.gelis.tarih,x.gelis.dakika):null,kategori:kat(x.meseleId),meseleId:x.meseleId,sinif:'cevap'}))
    .concat(B.randevular.map(x=>({id:'r:'+x.isId,tur:'randevu',isId:x.isId,baslik:x.baslik,kaynak:x.kaynak,kisiId:x.kisiId,dakika:x.dakika,sure:x.sure,eylem:x.eylem,
      an:anDakika(k.tarih,x.dakika),kategori:'kulup',sinif:'randevu'})));
  /* bu oturumda Haberler'den cevaplananlar (ekranın belleği; kayıtta geçmiş satırı): satırları ustte kalır, “Cevaplandı” */
  const cevap=Object.keys(C).filter(id=>!B.kararlar.some(x=>x.isId===id)).map(id=>Object.assign({id:'k:'+id,tur:'cevaplandi',isId:id,sinif:'cevaplandi'},C[id]));
  const takip=B.takipte.map(x=>({id:'t:'+x.meseleId,tur:'takip',meseleId:x.meseleId,baslik:x.baslik,satir:x.satir,kategori:kat(x.meseleId),sinif:'takip',kaynak:null}));
  const L=gelismeListesi(k,{gun});
  const uy=x=>sekme==='hepsi'||sekme==='cevap'||x.kategori===sekme;
  if(sekme==='cevap'){const ust=bekleyen.concat(cevap,takip);return{ust,alt:[],hepsi:ust,L};}
  const ust=bekleyen.concat(cevap).filter(uy),alt=gelismeGruplari(L.filter(uy));
  return{ust,alt,hepsi:ust.concat(alt),L};
}
function haberlerGorunumu(k,d,y){
  const yaz=y.yaz,gun=d.gun||GELISME_TEST.gun,S=haberSatirlari(k,d),sec=S.hepsi.find(x=>x.id===d.secili)||null,Sy=gelismeSayaci(k);
  const kaynakK=q=>{if(!q)return'<span class="hb-kaynakK"><span class="hb-kurum">•</span></span>';
    if(q.tur==='kisi')return'<span class="hb-kaynakK">'+(y.portre?y.portre(q.id):'')+'</span>';
    if(q.tur==='kulup')return'<span class="hb-kaynakK">'+(y.arma?y.arma(q.id):'')+'</span>';
    return'<span class="hb-kaynakK"><span class="hb-kurum" title="'+yaz(q.ad||'')+'">'+yaz(q.kisa||'·')+'</span></span>';};
  const kaynakAd=q=>!q?'':q.tur==='kisi'?((k.kisiler[q.id]||{}).ad||''):q.tur==='kulup'?((k.kulupler[q.id]||{}).ad||''):q.ad||'';
  const yeniMi=x=>!x.tur&&!x.grup&&!x.okundu&&x.sinif!=='arka';
  const saatS=x=>x.tur==='karar'?(x.an!==null?y.saatYazi(x.an%1440):''):x.tur==='randevu'?y.saatYazi(x.dakika):x.tur?'':x.tarih===k.tarih?y.saatYazi(x.dakika):yaz(y.tarihKisa(x.tarih));
  const rozet=x=>x.tur==='karar'?'<em class="hb-rozet" data-r="cevap">Cevap bekliyor</em>':x.tur==='randevu'?'<em class="hb-rozet" data-r="randevu">Randevu '+y.saatYazi(x.dakika)+'</em>'
    :x.tur==='cevaplandi'?'<em class="hb-rozet" data-r="cevaplandi">Cevaplandı</em>':x.tur==='takip'?'<em class="hb-rozet">Takipte</em>'
    :x.sinif==='kacan'?'<em class="hb-rozet" data-r="kacan">'+(x.kacan==='ulasilamadi'?'Ulaşılamadı':'Cevapsız kaldı')+'</em>'
    :x.sinif==='beklenen'&&!x.okundu?'<em class="hb-rozet" data-r="beklenen">Cevap geldi</em>':yeniMi(x)?'<i class="hb-nokta" title="okunmadı"></i>':x.grup?'<em class="hb-rozet">'+x.sayi+'</em>':'<em></em>';
  const satir=x=>'<li><button type="button" class="hb-satir'+(x.tur==='karar'?' hb-bek':x.tur==='randevu'?' hb-bek hb-bekRandevu':'')+'" data-eylem="hbSec" data-id="'+yaz(x.id)+'" data-sinif="'+yaz(x.sinif||'')+'"'+
    ' data-yeni="'+(yeniMi(x)?'1':'0')+'" aria-current="'+(sec&&sec.id===x.id?'true':'false')+'"><time>'+saatS(x)+'</time>'+kaynakK(x.kaynak)+'<span class="hb-bas">'+yaz(x.baslik)+'</span>'+rozet(x)+'</button></li>';
  /* Bugün: son maç ve bugünün kalan işleri, tek satır */
  const Bg=typeof gelismeBugun==='function'?gelismeBugun(k):null;let bugun='';
  if(Bg&&(Bg.sonMac||Bg.isler.length)){const m=Bg.sonMac,ad=id=>((k.kulupler[id]||{}).kisa||(k.kulupler[id]||{}).ad||id);
    const sm=m?'Son maç <b>'+yaz(ad(m.ev))+' '+m.skor[0]+'–'+m.skor[1]+' '+yaz(ad(m.konuk))+'</b>'+(m.sira?' · '+m.sira+'. sıra':''):'';
    const is=Bg.isler.length?'Bugün <b>'+Bg.isler.slice(0,3).map(x=>y.saatYazi(x.saat)+' '+yaz(x.baslik)).join(' · ')+'</b>'+(Bg.isler.length>3?' +'+(Bg.isler.length-3):''):'Bugün başka iş yok';
    bugun='<p class="hb-bugun">'+[sm,is].filter(Boolean).join(' · ')+'</p>';}
  let liste='';
  if(S.ust.length){const n=S.ust.filter(x=>x.tur==='karar').length,r=S.ust.filter(x=>x.tur==='randevu').length;   /* sekmenin sayısıyla aynı: kararlar; randevu ayrı */
    liste+='<div class="hb-cevapBlok"><h4 class="hb-gun'+(n||r?' hb-kirmizi">'+(n?'Cevap bekliyor · '+n:'Bugünün randevuları')+(r&&n?' · '+r+' randevu':r?' · '+r:''):'">Cevaplandı')+'</h4><ol class="hb-liste">'+S.ust.map(satir).join('')+'</ol></div>';}
  const G=new Map();for(const x of S.alt){if(!G.has(x.tarih))G.set(x.tarih,[]);G.get(x.tarih).push(x);}
  const dun=tarihEkle(k.tarih,-1),gunAdi=t=>t===k.tarih?'Bugün':t===dun?'Dün':y.tarihYazi(t);
  liste+=[...G.entries()].map(([t,X])=>'<section><h4 class="hb-gun">'+yaz(gunAdi(t))+'</h4><ol class="hb-liste">'+X.map(satir).join('')+'</ol></section>').join('');
  if(!S.hepsi.length)liste='<p class="hb-bos">'+(d.sekme==='cevap'?'Cevap bekleyen bir şey yok.':'Son '+gun+' günde gelişme yok.')+'</p>';
  const daha=d.sekme!=='cevap'&&gun<GELISME_TEST.gun*4?'<button type="button" class="cmp-dugme hb-daha" data-eylem="hbDaha">Daha eski ▸</button>':'';
  const F=S.alt.filter(yeniMi),yeni=F.length;
  const baslik=(d.sekme==='cevap'?'Cevap bekliyor':d.sekme&&d.sekme!=='hepsi'?HB_KAT_AD[d.sekme]||d.sekme:'Gelişmeler')+'<small>'+(yeni?yeni+' okunmamış':'hepsi okundu')+(Sy.cevap?' · '+Sy.cevap+' cevap bekliyor':'')+'</small>';
  const arac='<span class="hb-arac"><button type="button" class="cmp-dugme" data-eylem="hbSonraki" title="N"'+(S.hepsi.some(x=>yeniMi(x)&&x.id!==(sec&&sec.id))?'':' disabled')+'>Sonraki okunmamış ▸</button>'+
    '<button type="button" class="cmp-dugme" data-eylem="hbHepsiOkundu"'+(S.L.some(x=>!x.okundu&&x.sinif!=='arka')?'':' disabled')+'>Hepsini okundu say</button></span>';
  const listePanel='<section class="cmp-panel hb-listePanel"><h2><span>'+baslik+'</span>'+arac+'</h2>'+bugun+'<div class="hb-kay">'+liste+daha+'</div></section>';
  return'<div class="hb" data-sekme="'+yaz(d.sekme||'hepsi')+'"'+(sec&&sec.tur==='karar'?' data-kart="1"':'')+'>'+listePanel+haberAyrintiHtml(k,sec,d,y,{kaynakK,kaynakAd})+'</div>';
}
/* ayrıntı paneli: kaynak, başlık, kanalın görünüşü, eylemler; kararın kartı */
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
