/* ============ Chairman — Transfer masası: duvardaki mantar pano (görüntü katmanı; R4-k, 2026-10-29) ============
   Kural içermez: veri js/transfer-alim.js transferMasasi / transferOyuncu'dan (kayıttan okunur). Odak kabında geniş kâğıt (js/ekran-oda.js transferPaneli).
   Odadaki karşılığı duvarda mantar panodur (kullanıcı kararı, 2026-10-29); 3B çizimi görsel turda (karar 49), bugün kâğıt düzen (STIL.kagit).
     sekmeler  Pano · Takip · Piyasa · Geçmiş (data-eylem="tmBolum")
     Pano      dönem sayacı (son gün kırmızı), kasa, açık transfer dosyaları tek satır ve aşamasıyla, cevap bekleyen gelen teklifler
     Takip     izlenen oyuncular: ne zamandan beri, kaynağı, izlemedeki kanaat
     Piyasa    bildiğimiz kadarı: serbestler (ne zamandır boşta), satılık sinyali olanlar, sözleşmesi bitecekler
     Geçmiş    gelen, giden ve kaçan (kaçanın bugünkü kulübü ve sayıları)
     oyuncu    satıra dokununca oyuncu kâğıdı: künye, bu sezon, bildiklerimiz (kaynaklı); Takibe al / bırak, Hocaya araştırt, İzlemeye git
   Kararlar yine tek karttır (dosyada, telefonda); masa göz atma ve girişim yeridir, başkan listeden “satın al”maz.
   Seçiciler denemelerle sözleşmedir: .tm-masa[data-bolum], .tm-sekmeler [data-bolum], .tm-donem(.tm-sonGun), .tm-dosya, .tm-oyuncu[data-oyuncu],
   .tm-kagit, .tm-eylemler [data-eylem]. Gizli değer, maaş ve sözleşme tutarı yoktur.
     transferMasasiGorunumu(k, d, y) → html. d: {bolum, oyuncu}. y: {yaz, tarihYazi, paraYazi} */
'use strict';
(function transferStili(){
  if(typeof document==='undefined'||document.getElementById('transferStili'))return;
  const K=STIL.kagit,st=document.createElement('style');st.id='transferStili';
  st.textContent=`
.tm-masa{display:grid;gap:.7em}
.tm-ust{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.4em .8em;padding:.45em .6em;background:${K.serit};border:1px solid ${K.cizgi};border-left:.3em solid ${K.murekkep}}
.tm-donem b{font-variant-numeric:tabular-nums}
.tm-donem.tm-sonGun{color:${K.kirmizi}}
.tm-donem.tm-sonGun b{color:${K.kirmizi}}
.tm-kasa{color:${K.soluk};font-variant-numeric:tabular-nums}
.tm-bolum{display:grid;gap:.3em}
.oda .tm-bolum h4,.tm-bolum h4{margin:.2em 0 0;font-size:max(var(--k-enKucuk,12px),.82em);letter-spacing:.1em;text-transform:uppercase;color:${K.soluk}}
.tm-liste{list-style:none;margin:0;padding:0;display:grid;gap:.15em}
.oda button.tm-satir,.tm-satir{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:.2em .8em;width:100%;text-align:left;padding:.3em .5em;
  background:transparent;border:1px solid transparent;border-bottom-color:${K.cizgi}}
.oda button.tm-satir:hover,.oda button.tm-satir:focus-visible{background:${K.serit};border-color:${K.vurgu}}
.tm-satir b{font-weight:600}
.tm-satir small{display:block;grid-column:1/-1;color:${K.soluk};font-size:max(var(--k-enKucuk,12px),.88em)}
.tm-satir .tm-sag{color:${K.soluk};font-variant-numeric:tabular-nums;white-space:nowrap}
.tm-satir.tm-karar .tm-sag{color:${K.vurgu};font-weight:600}
.tm-bos{margin:0;color:${K.soluk};font-style:italic}
.tm-kagit{display:grid;gap:.6em;padding:.6em .8em;background:${K.serit};border:1px solid ${K.cizgi}}
.oda .tm-kagit h4,.tm-kagit h4{margin:0;font-size:1.25em}
.tm-kunye{color:${K.soluk}}
.tm-bilgi{list-style:none;margin:0;padding:0;display:grid;gap:.3em}
.tm-bilgi li{display:grid;gap:.05em}
.tm-bilgi small{color:${K.soluk};font-size:max(var(--k-enKucuk,12px),.85em)}
.tm-eylemler{display:flex;flex-wrap:wrap;gap:.4em}
.tm-eylemler small{flex-basis:100%;color:${K.soluk}}
.tm-not{margin:0;color:${K.soluk};font-size:max(var(--k-enKucuk,12px),.92em)}
`;
  document.head.appendChild(st);
})();
const TM_BOLUMLER=[['pano','Pano'],['takip','Takip'],['piyasa','Piyasa'],['gecmis','Geçmiş']];
const TM_KAYNAK={baskan:'senin notun',izleme:'izlemeden',hoca:'hocadan'};
function transferMasasiGorunumu(k,d,y){
  const yaz=y.yaz,M=transferMasasi(k),bolum=TM_BOLUMLER.some(b=>b[0]===d.bolum)?d.bolum:'pano';
  const O=id=>k.oyuncular[id]||null,kulup=id=>id?(k.kulupler[id]||{ad:id}).ad:'serbest',MV={KL:'Kaleci',DEF:'Defans',OS:'Orta saha',FV:'Forvet'};
  const yas=p=>typeof oyuncuYasi==='function'?oyuncuYasi(p,k.tarih):'';
  const satir=(p,alt,sag,ek)=>p?'<li><button type="button" class="tm-satir tm-oyuncu" data-eylem="tmOyuncu" data-oyuncu="'+yaz(p.id)+'">'+
    '<span><b>'+yaz(p.ad)+'</b> · '+yaz(MV[p.mevki]||p.mevki)+', '+yas(p)+' yaş</span><span class="tm-sag">'+yaz(sag||kulup(p.kulupId))+'</span>'+(alt?'<small>'+yaz(alt)+'</small>':'')+(ek||'')+'</button></li>':'';
  const liste=(L,bos)=>L.length?'<ul class="tm-liste">'+L.join('')+'</ul>':'<p class="tm-bos">'+yaz(bos)+'</p>';
  /* dönem sayacı (her bölümün üstünde) */
  const D=M.donem;let ust;
  if(!D)ust='<span class="tm-donem">Bu sezon transfer dönemi kalmadı.</span>';
  else if(D.acik)ust='<span class="tm-donem'+(D.sonGun?' tm-sonGun':'')+'">'+(D.sonGun?'<b>Transfer döneminin son günü</b>':'Transfer dönemi açık · kapanışa <b>'+D.kalanGun+' gün</b>')+' ('+yaz(y.tarihYazi(D.bitis))+')</span>';
  else ust='<span class="tm-donem">Transfer dönemi kapalı · açılışa <b>'+D.kalanGun+' gün</b> ('+yaz(y.tarihYazi(D.bas))+'). Serbest oyuncu dönem dışında da alınabilir.</span>';
  ust='<div class="tm-ust">'+ust+'<span class="tm-kasa">Kasa '+yaz(y.paraYazi(M.kasa))+'</span></div>';
  const sekme='<div class="od-sekmeler tm-sekmeler" role="tablist">'+TM_BOLUMLER.map(([a,ad])=>'<button type="button" role="tab" data-eylem="tmBolum" data-bolum="'+a+'" aria-selected="'+(bolum===a&&!d.oyuncu?'true':'false')+'" aria-pressed="'+(bolum===a&&!d.oyuncu?'true':'false')+'">'+ad+
    (a==='takip'&&M.takip.length?' ('+M.takip.length+')':'')+'</button>').join('')+'</div>';
  let ic='';
  if(d.oyuncu&&O(d.oyuncu))ic=transferOyuncuKagidi(k,d.oyuncu,y);
  else if(bolum==='pano'){
    const dosya=x=>'<li><button type="button" class="tm-satir tm-dosya'+(x.karar?' tm-karar':'')+'" data-eylem="dosyaAc" data-mesele="'+yaz(x.id)+'" data-donus="transfer">'+
      '<span><b>'+yaz(x.baslik)+'</b></span><span class="tm-sag">'+(x.karar?'Karar bekliyor':'')+'</span><small>'+yaz(x.satir)+'</small></button></li>';
    const teklif=x=>{const p=O(x.oyuncuId);return p?'<li><button type="button" class="tm-satir tm-dosya tm-karar" data-eylem="dosyaAc" data-mesele="'+yaz(x.meseleId||'')+'" data-donus="transfer">'+
      '<span><b>'+yaz(p.ad)+'</b> için '+yaz(kulup(x.alici))+' teklifi</span><span class="tm-sag">'+yaz(y.paraYazi(x.bedel))+'</span><small>Cevap bekliyor; karar dosyada.</small></button></li>':'';};
    ic='<section class="tm-bolum"><h4>Açık işler</h4>'+liste(M.dosyalar.map(dosya),'Açık transfer dosyası yok. Hocaya telefondan bir hat için oyuncu isteyebilir ya da Piyasa’dan bir oyuncuyu araştırtabilirsin.')+'</section>'+
      (M.teklifler.length?'<section class="tm-bolum"><h4>Gelen teklifler</h4>'+liste(M.teklifler.map(teklif),'')+'</section>':'')+
      '<section class="tm-bolum"><h4>Takipteki oyuncular</h4>'+liste(M.takip.slice(0,5).map(x=>satir(O(x.oyuncuId),x.dosya?'Dosyası açık.':x.kanaat?TA_KANAAT_METIN[x.kanaat]:null)),'Takipte oyuncu yok.')+'</section>';
  }
  else if(bolum==='takip')ic='<section class="tm-bolum">'+liste(M.takip.map(x=>{const p=O(x.oyuncuId);
      return satir(p,(x.kanaat?TA_KANAAT_METIN[x.kanaat]+' ':'')+'Takipte '+y.tarihYazi(x.tarih)+' tarihinden beri ('+(TM_KAYNAK[x.kaynak]||x.kaynak)+')'+(x.dosya?' · dosyası açık':'')+'.');}),
      'Takipte oyuncu yok. Piyasa’dan ya da Canlı Skor’dan bir oyuncuyu takibe alabilirsin.')+'</section>';
  else if(bolum==='piyasa'){
    const serbest=M.piyasa.serbest.map(id=>{const p=O(id),g=serbestSuresi(k,p);return satir(p,(p.un?'Eski yıldız. ':'')+(g!==null?(g<60?g+' gündür':Math.round(g/30)+' aydır')+' boşta.':'Boşta.'),'serbest');});
    ic='<section class="tm-bolum"><h4>Serbest oyuncular</h4>'+liste(serbest,'Serbest oyuncu yok.')+'</section>'+
      '<section class="tm-bolum"><h4>Kulübünde forma bulamayanlar</h4>'+liste(M.piyasa.satilik.map(id=>satir(O(id),'Kulislerden: forma bulamıyor.')),'Kulislerde böyle bir haber yok.')+'</section>'+
      '<section class="tm-bolum"><h4>Sözleşmesi bitecekler</h4>'+liste(M.piyasa.bitiyor.map(id=>satir(O(id),'Sözleşmesi bu sezonun sonunda bitiyor.')),'Bilinen yok.')+'</section>'+
      '<p class="tm-not">Bildiğimiz kadarı: kulisler ve basın; hoca bir oyuncuya ancak araştırınca ya da izleyince bakar.</p>';
  }
  else{
    const G=M.gecmis;
    ic='<section class="tm-bolum"><h4>Gelenler</h4>'+liste(G.gelen.map(x=>satir(O(x.oyuncuId),y.tarihYazi(x.tarih)+' · '+kulup(x.eski)+(x.bedel?' · '+y.paraYazi(x.bedel):' · bedelsiz'),'bizde')),'Bu sezon gelen yok.')+'</section>'+
      '<section class="tm-bolum"><h4>Gidenler</h4>'+liste(G.giden.map(x=>satir(O(x.oyuncuId),y.tarihYazi(x.tarih)+(x.bedel?' · '+y.paraYazi(x.bedel):''))),'Bu sezon giden yok.')+'</section>'+
      '<section class="tm-bolum"><h4>Kaçanlar</h4>'+liste(G.kacan.map(x=>{const p=O(x.oyuncuId);return satir(p,x.sonuc+(x.tarih?' ('+y.tarihYazi(x.tarih)+')':'')+'. Bu sezon '+(x.mac===null?'—':x.mac)+' maç, '+x.gol+' gol.');}),'Kaçan oyuncu yok.')+'</section>';
  }
  return'<div class="tm-masa" data-bolum="'+(d.oyuncu?'oyuncu':bolum)+'">'+ust+sekme+ic+'</div>';
}
/* oyuncu kâğıdı: künye, bu sezon, bildiklerimiz (kaynaklı), eylemler (engel varsa düğme kapalı ve gerekçesi altında) */
function transferOyuncuKagidi(k,id,y){
  const yaz=y.yaz,B=transferOyuncu(k,id),S=B.kimlik,MV={KL:'Kaleci',DEF:'Defans',OS:'Orta saha',FV:'Forvet'};
  const sez=S.sezon,sayi=v=>v===null?'—':v;
  const dugme=(ey,ad,engel)=>'<button type="button" data-eylem="'+ey+'" data-oyuncu="'+yaz(id)+'"'+(engel?' disabled title="'+yaz(engel)+'"':'')+'>'+yaz(ad)+'</button>';
  const E=B.engel,notlar=[E.arastirt&&!B.dosya?'Araştırma: '+E.arastirt:null,B.izleme?'İzleme: '+y.tarihYazi(B.izleme.tarih)+' '+saatYazi(B.izleme.dakika)+'.':E.izle?'İzleme: '+E.izle:null].filter(Boolean);
  return'<article class="tm-kagit" data-oyuncu="'+yaz(id)+'"><h4>'+yaz(S.ad)+'</h4>'+
    '<p class="tm-kunye">'+yaz(MV[S.mevki]||S.mevki)+' · '+S.yas+' yaş · '+yaz(S.kulup||'Serbest')+(S.durum==='sakat'?' · sakat':S.durum==='cezali'?' · cezalı':'')+'</p>'+
    '<p>Bu sezon: '+sayi(sez.mac)+' maç, '+sayi(sez.dk)+' dakika, '+sez.gol+' gol, '+sez.sari+' sarı'+(sez.kirmizi?', '+sez.kirmizi+' kırmızı':'')+'.</p>'+
    (B.bildiklerimiz.length?'<ul class="tm-bilgi">'+B.bildiklerimiz.map(b=>'<li><span>'+yaz(b.metin)+'</span><small>'+yaz(b.kaynak)+'</small></li>').join('')+'</ul>':'<p class="tm-not">Hakkında bildiğimiz bir şey yok.</p>')+
    (B.dosya?'<p><button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+yaz(B.dosya)+'" data-donus="transfer">Dosyası açık ▸</button></p>':'')+
    '<div class="tm-eylemler">'+(B.takipte?dugme('tmTakipBirak','Takipten çıkar',E.takip):dugme('tmTakip','Takibe al',E.takip))+
      (B.dosya?'':dugme('tmArastirt','Hocaya araştırt',E.arastirt))+dugme('tmIzle','İzlemeye git',E.izle||(B.izleme?'İzleme planlandı.':null))+
      (notlar.length?'<small>'+notlar.map(yaz).join(' · ')+'</small>':'')+'</div>'+
    '<p class="tm-not">Takip zaman almaz. Araştırmayı hoca birkaç günde yapar; izleme hocayla birlikte bir öğleden sonranı alır ve yol masrafı kasadan düşer.</p></article>';
}
