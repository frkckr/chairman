/* ============ Chairman — Haberler ekranı (görüntü; kural içermez; CM1-b, 2026-11-03, YOL_HARITASI karar 87) ============
   CM 01/02'nin News ekranı: odak kabında kâğıt (Kırtasiye). Üstte “Bugün” (gün başı notunun okuması: son maç, bugünün defteri, kasa; İlerle'nin durduğu
   yer ve sıradaki durak), altında gelişmeler güne göre gruplu, yeniden eskiye (js/gelismeler.js gelismeListesi). Satır: saat · kanalın simgesi · başlık ·
   sınıf rozeti; okunmamış kalın, dünyanın gidişi (arka) soluk. Satıra dokunmak ortamı açar (js/ekran-oda.js 'hbAc': telefonda konuşma, gazetenin o
   sayısı, Canlı Skor'da maç, dosyada rapor ya da konu, defterde gün); içerik ortamda okunur, listede yalnız başlık. Bölümler (Hepsi · Cevap bekliyor ·
   Kulüp · Transfer · Lig · Basın · Para) başlık şeridinin altındaki sekme satırındadır. “Cevap bekliyor”: kararlar (Sonra yığınının kaynağı), bugünün
   randevuları, takipteki işler (aşama satırıyla).
     haberlerGorunumu(k, d, y)  d: {sekme, gun, durak, sonraki}  y: {yaz, tarihYazi, tarihKisa, saatYazi, tlYazi, smg}
   Seçiciler denemelerle sözleşmedir: .hb, .hb-bugun, .hb-satir[data-id][data-yeni], .hb-gun, .hb-bekleyen, [data-eylem="hbSonraki"|"hbHepsiOkundu"|"hbDaha"] */
'use strict';
(function haberlerStili(){
  if(typeof document==='undefined'||document.getElementById('haberlerStili'))return;
  const st=document.createElement('style');st.id='haberlerStili';
  st.textContent=`
.hb{display:grid;gap:.55em;align-content:start}
.hb-bugun{display:grid;gap:.25em;padding:.5em .7em .55em;background:var(--k-serit);border:1px solid var(--k-cizgiAcik);border-left:.3em solid var(--k-mavi)}
.hb-bugun h4{margin:0;font-size:max(var(--k-enKucuk,12px),.82em);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--k-soluk)}
.hb-bugun p{margin:0}
.hb-bugun .hb-durak{font-weight:600}
.hb-bugun small{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.86em)}
.hb-arac{display:flex;flex-wrap:wrap;gap:.4em;align-items:center;justify-content:space-between}
.hb-arac p{margin:0;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.88em)}
.hb-arac span{display:flex;gap:.4em}
.hb-gun{display:grid;gap:.1em}
.hb-gun h4{margin:.3em 0 .1em;font-size:max(var(--k-enKucuk,12px),.82em);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--k-vurgu)}
.hb-liste{list-style:none;margin:0;padding:0;display:grid}
.hb-liste li+li{border-top:1px solid var(--k-cizgiAcik)}
.oda button.hb-satir{display:grid;grid-template-columns:3.4em 1.3em minmax(0,1fr) auto;align-items:baseline;gap:.5em;width:100%;text-align:left;padding:.28em .4em .24em;
  background:transparent;border:0;border-radius:0;box-shadow:none;font-weight:400}
.oda button.hb-satir:hover:not(:disabled){background:var(--k-zeminKoyu)}
.hb-satir time{font-family:var(--mono);font-size:max(var(--k-enKucuk,12px),.9em);color:var(--k-soluk)}
.hb-satir i{font-style:normal;color:var(--k-yazi);align-self:center}
.hb-satir span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.oda button.hb-satir[data-yeni="1"] span{font-weight:700}
.oda button.hb-satir[data-sinif="arka"]{color:var(--k-soluk)}
.oda button.hb-satir[data-sinif="arka"] i{color:var(--k-soluk)}
.hb-rozet{font-style:normal;font-size:max(var(--k-enKucuk,12px),.74em);font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:.02em .45em;border:1px solid currentColor;white-space:nowrap}
.hb-rozet[data-sinif="beklenen"]{color:var(--k-vurgu)}
.hb-rozet[data-sinif="cevap"]{color:var(--k-kirmizi)}
.hb-bos{margin:0;color:var(--k-soluk)}
.hb-bekleyen{display:grid;gap:.15em}
.hb-bekleyen h4{margin:.3em 0 .1em;font-size:max(var(--k-enKucuk,12px),.82em);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--k-vurgu)}
.oda button.hb-bek{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.15em .8em;width:100%;text-align:left;padding:.35em .55em .3em;background:var(--k-serit);border:1px solid var(--k-cizgiAcik);
  border-left:.3em solid var(--k-kirmizi);box-shadow:none}
.oda button.hb-bek.hb-bekRandevu{border-left-color:var(--k-mavi)}
.oda button.hb-bek.hb-bekTakip{border-left-color:var(--k-cizgi)}
.hb-bek b{font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hb-bek small{grid-column:1/-1;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.86em)}
.hb-bek em{font-style:normal;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.86em);white-space:nowrap}
`;
  document.head.appendChild(st);
})();
const HB_SINIF_ROZET={beklenen:'Cevap geldi'};
const HB_YER={telefon:'telefonda',dosya:'dosyada',karar:'defterde'};
function haberlerGorunumu(k,d,y){
  const yaz=y.yaz,gun=d.gun||GELISME_TEST.gun,L=gelismeListesi(k,{gun}),S=gelismeSayaci(k);
  /* Bugün: gün başı notunun okuması (js/gun-notu.js gunNotu) ve İlerle'nin durduğu yer */
  const N=typeof gunNotu==='function'?gunNotu(k):null,b=[];
  if(d.durak)b.push('<p class="hb-durak">'+yaz(d.durak)+'</p>'+(d.sonraki?'<small>Sıradaki: '+yaz(d.sonraki)+'</small>':''));
  if(N&&N.sonMac){const m=N.sonMac,ad=id=>(k.kulupler[id]||{ad:id}).ad,SN={G:'galibiyet',B:'beraberlik',M:'mağlubiyet'};
    b.push('<p>'+(m.hazirlik?'Hazırlık maçı':'Son maç')+': '+yaz(ad(m.ev)+' '+m.skor[0]+'–'+m.skor[1]+' '+ad(m.konuk))+' <small>('+SN[m.sonuc]+(m.sira?', ligde '+m.sira+'.':'')+')</small></p>');}
  if(N&&N.ajanda.length)b.push('<p>Bugün: '+N.ajanda.filter(x=>x.durum==='bekliyor').slice(0,3).map(x=>yaz(y.saatYazi(x.saat)+' '+x.baslik)).join(' · ')+'</p>');
  if(N)b.push('<p><small>Kasa '+yaz(y.tlYazi(N.kasa.nakit))+(N.kasa.enDusuk!==null&&N.kasa.enDusuk<N.kasa.nakit?' · 90 günde en düşük '+yaz(y.tlYazi(N.kasa.enDusuk)):'')+'</small></p>');
  const bugun='<section class="hb-bugun"><h4>Bugün · '+yaz(y.tarihYazi(k.tarih))+'</h4>'+(b.join('')||'<p class="hb-bos">Sakin bir gün.</p>')+'</section>';
  if(d.sekme==='cevap'){
    const B=gelismeBekleyenler(k),ic=[];
    if(B.kararlar.length)ic.push('<div class="hb-bekleyen"><h4>Kararlar · '+B.kararlar.length+'</h4>'+B.kararlar.map(x=>
      '<button type="button" class="hb-bek" data-eylem="sonraAc" data-is="'+yaz(x.isId)+'"><b>'+yaz(x.baslik)+'</b><em>'+yaz(HB_YER[x.yer]||'')+'</em>'+
      '<small>en geç '+(x.sonCevap.tarih===k.tarih?'bugün ':yaz(y.tarihKisa(x.sonCevap.tarih))+' ')+y.saatYazi(x.sonCevap.dakika)+'</small></button>').join('')+'</div>');
    if(B.randevular.length)ic.push('<div class="hb-bekleyen"><h4>Bugünün randevuları</h4>'+B.randevular.map(x=>
      '<button type="button" class="hb-bek hb-bekRandevu" data-eylem="hbAjanda" data-is="'+yaz(x.isId)+'"><b>'+yaz(x.baslik)+'</b><em>'+y.saatYazi(x.dakika)+(x.sure?'–'+y.saatYazi((x.dakika+x.sure)%1440):'')+'</em></button>').join('')+'</div>');
    if(B.takipte.length)ic.push('<div class="hb-bekleyen"><h4>Takipte</h4>'+B.takipte.map(x=>
      '<button type="button" class="hb-bek hb-bekTakip" data-eylem="dosyaAc" data-mesele="'+yaz(x.meseleId)+'"><b>'+yaz(x.baslik)+'</b><small>'+yaz(x.satir)+'</small></button>').join('')+'</div>');
    return'<div class="hb" data-sekme="cevap">'+bugun+(ic.join('')||'<p class="hb-bos">Cevap bekleyen bir şey yok.</p>')+'</div>';
  }
  const F=d.sekme&&d.sekme!=='hepsi'?L.filter(x=>x.kategori===d.sekme):L,yeni=F.filter(x=>!x.okundu&&x.sinif!=='arka').length;
  const arac='<div class="hb-arac"><p>'+(yeni?yeni+' okunmamış':'Hepsi okundu')+(S.cevap?' · '+S.cevap+' cevap bekliyor':'')+'</p><span>'+
    '<button type="button" data-eylem="hbSonraki"'+(yeni?'':' disabled')+'>Sonraki okunmamış ▸</button>'+
    '<button type="button" data-eylem="hbHepsiOkundu"'+(L.some(x=>!x.okundu&&x.sinif!=='arka')?'':' disabled')+'>Hepsini okundu say</button></span></div>';
  /* günlere göre (bugün, dün, sonra gün adıyla) */
  const G=new Map();for(const x of F){if(!G.has(x.tarih))G.set(x.tarih,[]);G.get(x.tarih).push(x);}
  const dun=tarihEkle(k.tarih,-1),gunAdi=t=>t===k.tarih?'Bugün':t===dun?'Dün':y.tarihYazi(t);
  const satir=x=>'<li><button type="button" class="hb-satir" data-eylem="hbAc" data-id="'+yaz(x.id)+'" data-sinif="'+x.sinif+'" data-yeni="'+(!x.okundu&&x.sinif!=='arka'?'1':'0')+'"'+
    (x.hedef?'':' disabled')+'><time>'+y.saatYazi(x.dakika)+'</time><i aria-hidden="true">'+y.smg(x.simge)+'</i><span>'+yaz(x.baslik)+'</span>'+
    (HB_SINIF_ROZET[x.sinif]?'<em class="hb-rozet" data-sinif="'+x.sinif+'">'+HB_SINIF_ROZET[x.sinif]+'</em>':'<em></em>')+'</button></li>';
  const liste=[...G.entries()].map(([t,X])=>'<section class="hb-gun"><h4>'+yaz(gunAdi(t))+'</h4><ol class="hb-liste">'+X.map(satir).join('')+'</ol></section>').join('');
  const daha=gun<GELISME_TEST.gun*4?'<button type="button" class="od-baglanti" data-eylem="hbDaha">Daha eski ▸</button>':'';
  return'<div class="hb" data-sekme="'+yaz(d.sekme||'hepsi')+'">'+bugun+arac+(liste||'<p class="hb-bos">Son '+gun+' günde gelişme yok.</p>')+daha+'</div>';
}
