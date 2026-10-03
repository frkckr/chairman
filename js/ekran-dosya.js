/* ============ Chairman — dosya: masada açılan karton dosya (görüntü katmanı; yol haritası 2.8M) ============
   Kullanıcı kararı (2026-10-02): dosya sağdaki dar panel değil, odanın ortasında büyük ve gerçek bir nesne olarak açılır; oda arkada hafif kararır.
     Üst kenar   açık konuların sekmeleri (kategori simgesi ve kısa başlık; cevap bekleyen sekmede kırmızı nokta) ve ayrı Arşiv sekmesi.
     Sol sayfa   kategori, büyük başlık, durum damgası, yürüten ve son tarih; ataşlı küçük kâğıtlar hâlinde "Bilinenler" (kaynağıyla), sözler,
                 açılır "Geçmiş".
     Sağ sayfa   ilgili kişinin portresi ve görevi; karar varsa konu alıntısı ve iki büyük cevap (js/ekran-telefon.js kararKarti; "Onayla" ikinci
                 adımdır); karar yoksa ne olduğu ve beklenen adım. Karardan sonra kısa sonuç aynı sayfada görünür.
   Kural içermez: veri js/mesele.js (meseleOzeti) ve js/ajanda.js okuma işlevlerinden gelir; düğmeler js/ekran-oda.js'in data-eylem yoluna gider.
   dosyaGorunumu(k, D, Y) → html
     D: {secili, sira:[açık mesele kimlikleri], arsiv, sonuc, donus, karar(isId) → html}
     Y: {yaz, kategoriYazi, tarihKisa, anYazi, sonTarih(ozet), neOldu(ozet), sozler(ozet) → html, testKutu?, kasaBaglantisi(mesele) → bool}
   Renk ve ölçüler STIL.kagit.dosya'dadır. Stil, masaüstü kopyasında da gelsin diye belgeye buradan eklenir. */
(function dosyaStili(){
  if(typeof document==='undefined'||document.getElementById('dosyaStili'))return;
  const D=STIL.kagit.dosya,st=document.createElement('style');st.id='dosyaStili';
  st.textContent=`
.od-perde{position:absolute;inset:0;z-index:0;background:${D.perde}}
.oda .od-ust,.oda .od-nesneler,.oda .od-alt{z-index:2}
.dsy{position:absolute;z-index:1;left:17%;right:2.2%;top:2.9em;bottom:5.4em;display:grid;grid-template-rows:auto minmax(0,1fr)}
.dsy-sekmeler{display:flex;align-items:flex-end;gap:.25em;padding:0 1.2em;min-width:0;overflow:hidden}
.oda .dsy button.dsy-sekme{display:flex;align-items:center;gap:.4em;max-width:16em;min-width:0;padding:.35em .8em .3em;border:1px solid ${D.kapakKoyu};border-bottom:0;
  border-radius:.5em .5em 0 0;background:${D.sekme};color:var(--k-yazi);font-size:.9em;white-space:nowrap}
.dsy-sekme span{overflow:hidden;text-overflow:ellipsis}
.oda .dsy button.dsy-sekme[aria-selected="true"]{background:${D.sayfa};font-weight:600;padding-bottom:.45em;position:relative;top:1px}
.oda .dsy button.dsy-sekme.dsy-arsivSekme{margin-left:auto;background:${D.kapakKoyu};color:${D.sayfa};border-color:${D.kapakKoyu}}
.oda .dsy button.dsy-sekme.dsy-arsivSekme[aria-selected="true"]{background:${D.sayfa};color:var(--k-yazi)}
.dsy-nokta{width:.55em;height:.55em;border-radius:50%;background:var(--k-kirmizi);flex:none}
.dsy-kapak{min-height:0;display:grid;padding:.7em;background:${D.kapak};border-radius:.4em;box-shadow:.4em .55em 0 var(--k-golge),inset 0 0 0 .2em ${D.kapakKoyu}}
.dsy-ic{min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.12fr);background:${D.sayfa};border-radius:.2em;box-shadow:0 .15em .3em rgba(0,0,0,.25)}
.dsy-sayfa{min-height:0;overflow-y:auto;padding:.9em 1.1em 1em;display:grid;gap:.6em;align-content:start;position:relative}
.dsy-sol{border-right:1px solid ${D.cizgi};box-shadow:inset -.6em 0 .8em -.7em rgba(60,40,10,.25)}
.dsy-kat{display:flex;align-items:center;gap:.5em;font-size:.82em;letter-spacing:.12em;text-transform:uppercase;color:var(--k-soluk)}
.dsy-baslik{margin:0;font-family:var(--display);font-weight:400;font-size:2.1em;line-height:.95;letter-spacing:.02em;color:var(--k-yazi)}
.dsy-damga{justify-self:start;padding:.15em .55em .05em;border:.16em solid currentColor;border-radius:.2em;font-family:var(--display);font-size:1.25em;letter-spacing:.08em;
  text-transform:uppercase;transform:rotate(-4deg);opacity:.85}
.dsy-d-kararBekliyor{color:var(--k-kirmizi)}.dsy-d-ekipte,.dsy-d-haberBekliyor{color:${D.mavi}}.dsy-d-kapandi{color:var(--k-soluk)}
.dsy-kunye{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.15em .8em;margin:0;font-size:.92em}
.dsy-kunye dt{color:var(--k-soluk)}.dsy-kunye dd{margin:0}
.dsy-sayfa h4{margin:.3em 0 0;font-size:.8em;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--k-vurgu)}
.dsy-notlar{list-style:none;margin:0;padding:0;display:grid;gap:.55em}
.dsy-not{position:relative;padding:.55em .7em .45em;background:${D.not};border:1px solid ${D.cizgi};box-shadow:.12em .18em 0 rgba(60,40,10,.15);transform:rotate(-.6deg)}
.dsy-not:nth-child(even){transform:rotate(.5deg)}
.dsy-not::before{content:"";position:absolute;top:-.55em;left:1.1em;width:.55em;height:1.5em;border:.16em solid ${D.atas};border-radius:.4em;background:transparent}
.dsy-not small{display:block;margin-top:.2em;color:var(--k-soluk);font-size:.84em}
.dsy-gecmis summary{cursor:pointer;color:var(--k-soluk);font-size:.9em}
.dsy-gecmis ul{list-style:none;margin:.3em 0 0;padding:0;display:grid;gap:.2em;font-size:.9em}
.dsy-gecmis li{display:grid;grid-template-columns:7.2em minmax(0,1fr);gap:.5em}
.dsy-gecmis li span:first-child{color:var(--k-soluk)}
.dsy-kisi{display:flex;gap:.7em;align-items:center;padding-bottom:.5em;border-bottom:1px dashed ${D.cizgi}}
.dsy-kisi .od-portre{width:3.6em;height:3.6em;box-shadow:.12em .15em 0 rgba(60,40,10,.2)}
.dsy-kisi b{display:block;font-size:1.15em}
.dsy-kisi small{color:var(--k-soluk)}
.dsy .kk{background:transparent;border:0;padding:0;gap:.7em}
.dsy .kk-konu{font-size:1.12em;line-height:1.4;padding:.2em 0 .2em .8em;border-left:.22em solid ${D.cizgi};font-style:italic}
.dsy .kk button.kk-cevap{min-height:4.6em;padding:.6em .8em .5em;border-radius:.35em}
.dsy .kk button.kk-cevap b{font-size:1.2em}
.dsy-sonuc{padding:.5em .7em;background:${D.not};border-left:.25em solid var(--k-yesil)}
.dsy-bos{color:var(--k-soluk);font-style:italic}
.dsy-arsiv{list-style:none;margin:0;padding:0;display:grid}
.dsy-arsiv li{display:grid;grid-template-columns:6.5em minmax(0,1fr);gap:.6em;padding:.3em 0;border-bottom:1px solid ${D.cizgi}}
.dsy-arsiv li span:first-child{color:var(--k-soluk)}
.oda .dsy-sekmeler .od-kapat{align-self:center;margin:0 0 .3em .5em;font-size:.9em;flex:none}
`;
  document.head.appendChild(st);
})();

function dosyaGorunumu(k,D,Y){
  const yaz=Y.yaz,L=meseleListesi(k),arsivL=L.filter(m=>m.durum==='kapandi');
  const DAMGA={kararBekliyor:'Cevap bekliyor',ekipte:'Takipte',haberBekliyor:'Takipte',kapandi:'Kapandı'};
  /* sekmeler: açık konular sırayla; seçili konu kapandıysa (arşivden açıldıysa) kendi sekmesiyle görünür */
  const sekmeKimlik=D.sira.slice();
  if(!D.arsiv&&D.secili&&k.meseleler[D.secili]&&!sekmeKimlik.includes(D.secili))sekmeKimlik.push(D.secili);
  const sekme=id=>{const m=k.meseleler[id],[ad,s]=meseleKategorisi(m),sec=!D.arsiv&&id===D.secili;
    return'<button type="button" class="dsy-sekme" role="tab" data-eylem="dosyaAc" data-mesele="'+id+'" data-gezinti="1" aria-selected="'+(sec?'true':'false')+'" title="'+yaz(m.baslik)+'">'+
      '<i class="od-kSimge" aria-hidden="true">'+yaz(s)+'</i><span>'+yaz(m.baslik)+'</span>'+(m.durum==='kararBekliyor'?'<i class="dsy-nokta" aria-label="cevap bekliyor"></i>':'')+'</button>';};
  let ic='<nav class="dsy-sekmeler" role="tablist" aria-label="Açık dosyalar">'+sekmeKimlik.map(sekme).join('')+
    '<button type="button" class="dsy-sekme dsy-arsivSekme" role="tab" data-eylem="arsiv" aria-selected="'+(D.arsiv?'true':'false')+'"'+(arsivL.length||D.arsiv?'':' disabled')+'>Arşiv ('+arsivL.length+')</button>'+
    '<button type="button" class="od-kapat" data-eylem="kapat" title="Kapat (Esc)">Kapat ×</button></nav>';
  let sol='',sag='';
  if(D.arsiv||!D.secili||!k.meseleler[D.secili]){
    sol='<p class="dsy-kat">Arşiv</p><h3 class="dsy-baslik">Kapanan konular</h3>'+(arsivL.length?'<ul class="dsy-arsiv">'+arsivL.map(m=>'<li><span>'+(m.kapanis?yaz(Y.tarihKisa(m.kapanis.tarih)):'')+'</span><span>'+
      Y.kategoriYazi(m)+' <button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+m.id+'">'+yaz(m.baslik)+'</button></span></li>').join('')+'</ul>':'<p class="dsy-bos">Henüz kapanan konu yok.</p>');
    sag='<p class="dsy-bos">'+(sekmeKimlik.length?'Açık bir konu seçmek için üstteki sekmelere bak.':'Açık dosya yok.')+'</p>';
  }else{
    const o=meseleOzeti(k,D.secili),m=o.mesele,[katAd,katS]=meseleKategorisi(m);
    const st=m.durum!=='kapandi'?Y.sonTarih(o):'';
    if(D.donus)sol+='<p><button type="button" class="od-baglanti" data-eylem="donus">◂ '+(D.donus==='telefon'?'Mesaja dön':'Ajandaya dön')+'</button></p>';
    sol+='<p class="dsy-kat"><i class="od-kSimge" aria-hidden="true">'+yaz(katS)+'</i>'+yaz(katAd)+(Y.testKutu?Y.testKutu():'')+'</p>'+
      '<h3 class="dsy-baslik">'+yaz(m.baslik)+'</h3><span class="dsy-damga dsy-d-'+m.durum+'">'+yaz(DAMGA[m.durum]||o.durumAdi)+'</span>'+
      '<dl class="dsy-kunye"><dt>Yürüten</dt><dd>'+(o.sorumlu?yaz(o.sorumlu.ad):'—')+'</dd>'+(st?'<dt>'+yaz(st.split(': ')[0])+'</dt><dd><b>'+yaz(st.split(': ').slice(1).join(': '))+'</b></dd>':'')+'</dl>';
    if(o.bilgiler.length)sol+='<h4>Bilinenler</h4><ul class="dsy-notlar">'+o.bilgiler.slice(-4).map(x=>'<li class="dsy-not">'+yaz(x.metin)+'<small>— '+yaz(x.kaynak)+'</small></li>').join('')+'</ul>';
    sol+=Y.sozler(o);
    if(Y.kasaBaglantisi(m))sol+='<p class="od-not">Para durumu: <button type="button" class="od-baglanti" data-eylem="ac" data-panel="kasa">Kasa ▸</button></p>';
    sol+='<details class="dsy-gecmis"><summary>Geçmiş ve belgeler ('+o.olaylar.length+')</summary><ul>'+o.olaylar.slice().reverse().map(x=>'<li><span>'+yaz(Y.tarihKisa(x.tarih).split(' ').slice(0,2).join(' ')+' '+saatYazi(x.dakika))+'</span><span>'+yaz(x.metin)+'</span></li>').join('')+'</ul></details>';
    /* sağ sayfa: kişi, sonuç, karar ya da beklenen adım */
    const kis=o.karar&&k.isler[o.karar.isId]?k.isler[o.karar.isId].veri:null,yuz=k.kisiler[(kis&&(kis.soran||kis.kisiId))||(o.kisiler[0]&&o.kisiler[0].id)];
    if(yuz)sag+='<div class="dsy-kisi">'+portreHtml(yuz,'od-portre')+'<p><b>'+yaz(yuz.ad)+'</b><small>'+yaz(kisiRolu(k,yuz))+'</small></p></div>';
    if(D.sonuc&&D.sonuc.meseleId===m.id)sag+='<section class="dsy-sonuc"><p><b>Sonuç</b> '+yaz(D.sonuc.metin)+'</p>'+(o.adimlar.length&&!o.karar?'<p class="od-not">Beklenen: '+yaz(o.adimlar[0].metin)+' ('+yaz(Y.anYazi(o.adimlar[0].tarih,o.adimlar[0].dakika,o.adimlar[0].saatsiz))+')</p>':'')+'</section>';
    if(o.karar)sag+=D.karar(o.karar.isId);
    else{
      const n=Y.neOldu(o);
      if(n.length)sag+='<h4>Ne oldu?</h4>'+n.map(x=>'<p>'+yaz(x)+'</p>').join('');
      if(m.durum!=='kapandi'){
        if(o.adimlar.length)sag+='<p><b>Bekleyen</b> '+o.adimlar.map(a=>yaz(a.metin)+(a.tutar!==undefined?' '+yaz(paraYazi(a.tutar).replace(/,\d\d ₺$/,' ₺')):'')+' <span class="od-not">('+yaz(Y.anYazi(a.tarih,a.dakika,a.saatsiz))+')</span>').join(' · ')+'</p>';
        sag+='<p class="dsy-bos">Şimdi yapılacak bir şey yok; haber için ilerle.</p>';
      }
    }
  }
  return'<div class="dsy" role="dialog" aria-label="Dosya">'+ic+'<div class="dsy-kapak"><div class="dsy-ic"><article class="dsy-sayfa dsy-sol">'+sol+'</article><article class="dsy-sayfa dsy-sag">'+sag+'</article></div></div></div>';
}
