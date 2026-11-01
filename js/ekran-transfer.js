/* ============ Chairman — Transfer masası: duvardaki mantar pano (görüntü katmanı; R4-k, 2026-10-29) ============
   Kural içermez: veri js/transfer-alim.js transferMasasi / transferOyuncu'dan (kayıttan okunur). Odak kabında geniş kâğıt (js/ekran-oda.js transferPaneli).
   Odadaki karşılığı duvarda mantar panodur (kullanıcı kararı, 2026-10-29); 3B çizimi görsel turda (karar 49), bugün kâğıt düzen (STIL.kagit).
     sekmeler  Pano · Liste · Ara · Geçmiş (data-eylem="tmBolum"; R6b-1', 2026-11-01: Takip → Liste, Piyasa kalktı, Ara geldi)
     Pano      dönem sayacı (son gün kırmızı), kasa, açık transfer dosyaları tek satır ve aşamasıyla, cevap bekleyen gelen teklifler, menajerlerin
               önerileri (son üç hafta; satırda Listeye al)
     Liste     kulübün kısa listesi mevkiye göre: ne zamandan beri, kaynağı (senin notun, hoca, izleme, menajer), izlemedeki kanaat
     Ara       kamu künyesinde arama: ad ya da kulüp (klavyeyle; .tm-araGirdi, sonuç .tm-araSonuc yerinde yenilenir) ve süzgeçler (mevki, yaş, serbest,
               sözleşmesi biten, boy; data-eylem="tmCip")
     Geçmiş    gelen ve giden (RK-D'den beri kaçan oyuncunun kâğıdında)
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
.tm-oneriSatir{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:.4em}
.oda button.tm-al{font-size:max(var(--k-enKucuk,12px),.88em);padding:.15em .55em;white-space:nowrap}
.tm-listede{color:${K.soluk};font-size:max(var(--k-enKucuk,12px),.88em);padding:0 .55em}
.tm-araKutu{display:flex;align-items:center;gap:.5em;padding:.35em .6em;background:#fffdf8;border:1.5px solid ${K.cizgi};border-radius:.2em}
.tm-araKutu span{font-size:max(var(--k-enKucuk,12px),.82em);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${K.soluk}}
.tm-araGirdi{flex:1;min-width:0;border:0;background:transparent;font:inherit;font-size:1.05em;color:${K.yazi};outline:0}
.tm-araKutu:focus-within{border-color:${K.vurgu}}
.tm-cipler{display:flex;flex-wrap:wrap;gap:.35em}
.oda button.tm-cip{font-size:max(var(--k-enKucuk,12px),.9em);padding:.12em .65em;border-radius:1em}
.oda button.tm-cip[aria-pressed="true"]{background:${K.yazi};color:${K.zemin};border-color:${K.yazi}}
.tm-sayi{margin:0;color:${K.soluk};font-size:max(var(--k-enKucuk,12px),.88em)}
`;
  document.head.appendChild(st);
})();
const TM_BOLUMLER=[['pano','Pano'],['liste','Liste'],['ara','Ara'],['gecmis','Geçmiş']];
const TM_ESKI_BOLUM={takip:'liste',piyasa:'ara'};
const TM_KAYNAK={baskan:'senin notun',izleme:'izlemeden',hoca:'hocadan',menajer:'menajerden'};
const TM_MEVKI_SIRA=[['KL','Kaleci'],['DEF','Defans'],['OS','Orta saha'],['FV','Forvet']];
/* R6b-1': Ara'nın sonuç bölümü (kamu bilgisi: mevki, yaş, kulüp, boy, sözleşmenin bittiği yıl); girdide her tuşta yerinde yenilenir */
function transferAraSonucu(k,A,y){
  const yaz=y.yaz,s={metin:A.metin,mevki:A.mevki,yasEnCok:A.yas==='genc'?23:0,yasEnAz:A.yas==='tecrube'?30:0,serbest:A.durum==='serbest',bitiyor:A.durum==='bitiyor',boyEnAz:A.boy?+A.boy:0};
  if(!String(A.metin||'').trim()&&!A.mevki&&!A.yas&&!A.durum&&!A.boy)return'<p class="tm-bos">Bir ad ya da kulüp yaz, ya da bir süzgeç seç.</p>';
  const R=oyuncuAra(k,s),MV={KL:'Kaleci',DEF:'Defans',OS:'Orta saha',FV:'Forvet'},kulup=id=>id?(k.kulupler[id]||{ad:id}).ad:'serbest';
  if(!R.toplam)return'<p class="tm-bos">Bu ölçülere uyan oyuncu yok.</p>';
  return'<p class="tm-sayi">'+R.toplam+' oyuncu'+(R.toplam>R.liste.length?' · ilk '+R.liste.length:'')+'</p><ul class="tm-liste">'+R.liste.map(id=>{const p=k.oyuncular[id];
    const alt=(typeof boyYazi==='function'?boyYazi(p)+' · ':'')+(p.kulupId?(p.sozlesme?'sözleşme '+p.sozlesme.bitis.slice(0,4)+'\'te bitiyor':'sözleşmeli'):'serbest')+(takipte(k,id)?' · listede':'');
    return'<li><button type="button" class="tm-satir tm-oyuncu" data-eylem="tmOyuncu" data-oyuncu="'+yaz(id)+'"><span><b>'+yaz(p.ad)+'</b> · '+yaz(MV[p.mevki]||p.mevki)+', '+oyuncuYasi(p,k.tarih)+' yaş</span>'+
      '<span class="tm-sag">'+yaz(kulup(p.kulupId))+'</span><small>'+yaz(alt)+'</small></button></li>';}).join('')+'</ul>';
}
function transferMasasiGorunumu(k,d,y){
  const yaz=y.yaz,M=transferMasasi(k),b0=TM_ESKI_BOLUM[d.bolum]||d.bolum,bolum=TM_BOLUMLER.some(b=>b[0]===b0)?b0:'pano';
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
    (a==='liste'&&M.takip.length?' ('+M.takip.length+')':'')+'</button>').join('')+'</div>';
  let ic='';
  if(d.oyuncu&&O(d.oyuncu))ic=transferOyuncuKagidi(k,d.oyuncu,y);
  else if(bolum==='pano'){
    const dosya=x=>'<li><button type="button" class="tm-satir tm-dosya'+(x.karar?' tm-karar':'')+'" data-eylem="dosyaAc" data-mesele="'+yaz(x.id)+'" data-donus="transfer">'+
      '<span><b>'+yaz(x.baslik)+'</b></span><span class="tm-sag">'+(x.karar?'Karar bekliyor':'')+'</span><small>'+yaz(x.satir)+'</small></button></li>';
    const teklif=x=>{const p=O(x.oyuncuId);return p?'<li><button type="button" class="tm-satir tm-dosya tm-karar" data-eylem="dosyaAc" data-mesele="'+yaz(x.meseleId||'')+'" data-donus="transfer">'+
      '<span><b>'+yaz(p.ad)+'</b> için '+yaz(kulup(x.alici))+' teklifi</span><span class="tm-sag">'+yaz(y.paraYazi(x.bedel))+'</span><small>Cevap bekliyor; karar dosyada.</small></button></li>':'';};
    /* R6b-1': menajerlerin önerileri (Pazartesi; gürültü çoktur, menajer abartır); satırda Listeye al (kaynak menajer) */
    const oneri=m=>'<section class="tm-bolum tm-oneri"><h4>'+yaz(m.menajer)+' (menajer, TEST) · '+yaz(y.tarihYazi(m.tarih))+' · '+m.oyuncular.length+' oyuncu</h4><ul class="tm-liste">'+
      m.oyuncular.map(x=>{const p=O(x.oyuncuId);if(!p)return'';const sat=satir(p,x.not,null).replace(/^<li>|<\/li>$/g,'');
        return'<li class="tm-oneriSatir">'+sat+(takipte(k,p.id)?'<span class="tm-listede">Listede</span>':'<button type="button" class="tm-al" data-eylem="tmTakip" data-kaynak="menajer" data-oyuncu="'+yaz(p.id)+'">Listeye al</button>')+'</li>';}).join('')+'</ul></section>';
    ic='<section class="tm-bolum"><h4>Açık işler</h4>'+liste(M.dosyalar.map(dosya),'Açık transfer dosyası yok. Hocaya telefondan bir hat için oyuncu isteyebilir ya da Ara’dan bir oyuncu bulup araştırtabilirsin.')+'</section>'+
      (M.teklifler.length?'<section class="tm-bolum"><h4>Gelen teklifler</h4>'+liste(M.teklifler.map(teklif),'')+'</section>':'')+
      (M.oneriler&&M.oneriler.length?M.oneriler.map(oneri).join(''):'<section class="tm-bolum"><h4>Menajerlerin önerileri</h4><p class="tm-bos">Bu hafta öneri gelmedi. Transfer döneminde menajerler her Pazartesi yazar.</p></section>')+
      '<section class="tm-bolum"><h4>Listedeki oyuncular</h4>'+liste(M.takip.slice(0,5).map(x=>satir(O(x.oyuncuId),x.dosya?'Dosyası açık.':x.kanaat?TA_KANAAT_METIN[x.kanaat]:null)),'Listede oyuncu yok.')+'</section>';
  }
  else if(bolum==='liste'){
    /* R6b-1': kulübün kısa listesi mevkiye göre (gerçek kulüplerde mevki başına birkaç ad; kaynak her satırda) */
    const G=TM_MEVKI_SIRA.map(([mv,ad])=>[ad,M.takip.filter(x=>(O(x.oyuncuId)||{}).mevki===mv)]).filter(([,L])=>L.length);
    ic=G.length?G.map(([ad,L])=>'<section class="tm-bolum"><h4>'+ad+' · '+L.length+'</h4>'+liste(L.map(x=>{const p=O(x.oyuncuId);
      return satir(p,(x.kanaat?TA_KANAAT_METIN[x.kanaat]+' ':'')+'Listede '+y.tarihYazi(x.tarih)+' tarihinden beri ('+(TM_KAYNAK[x.kaynak]||x.kaynak)+')'+(x.dosya?' · dosyası açık':'')+'.');}),'')+'</section>').join('')
      :'<section class="tm-bolum"><p class="tm-bos">Listede oyuncu yok. Ara’dan, menajer önerilerinden ya da Canlı Skor’dan bir oyuncuyu listeye alabilirsin.</p></section>';
  }
  else if(bolum==='ara'){
    const A=d.ara||{},cip=(a,v,ad)=>'<button type="button" class="tm-cip" data-eylem="tmCip" data-cip="'+a+'" data-deger="'+v+'" aria-pressed="'+(A[a]===v?'true':'false')+'">'+ad+'</button>';
    ic='<section class="tm-bolum tm-ara"><label class="tm-araKutu"><span>Ara</span><input type="search" class="tm-araGirdi" value="'+yaz(A.metin||'')+'" placeholder="Oyuncu ya da kulüp adı" aria-label="Oyuncu ara" autocomplete="off" spellcheck="false"></label>'+
      '<div class="tm-cipler" role="group" aria-label="Süzgeçler">'+cip('mevki','KL','Kaleci')+cip('mevki','DEF','Defans')+cip('mevki','OS','Orta saha')+cip('mevki','FV','Forvet')+
        cip('yas','genc','23 ve altı')+cip('yas','tecrube','30 ve üstü')+cip('durum','serbest','Serbestler')+cip('durum','bitiyor','Sözleşmesi bitenler')+cip('boy','185','Boy ≥ 1,85')+'</div>'+
      '<div class="tm-araSonuc" aria-live="polite">'+transferAraSonucu(k,A,y)+'</div>'+
      '<p class="tm-not">Kamuya açık bilgi: yaş, kulüp, boy, sözleşmenin bittiği yıl. Ne kadar iyi olduğunu, kulübünün satıp satmayacağını ve kaça geleceğini ancak hocaya araştırtınca, izleyince ya da menajeriyle konuşunca öğrenirsin.</p></section>';
  }
  else{
    const G=M.gecmis;
    ic='<section class="tm-bolum"><h4>Gelenler</h4>'+liste(G.gelen.map(x=>satir(O(x.oyuncuId),y.tarihYazi(x.tarih)+' · '+kulup(x.eski)+(x.bedel?' · '+y.paraYazi(x.bedel):' · bedelsiz'),'bizde')),'Bu sezon gelen yok.')+'</section>'+
      '<section class="tm-bolum"><h4>Gidenler</h4>'+liste(G.giden.map(x=>satir(O(x.oyuncuId),y.tarihYazi(x.tarih)+(x.bedel?' · '+y.paraYazi(x.bedel):''))),'Bu sezon giden yok.')+'</section>';
    /* RK-D (2026-11-01, kullanıcı: “kaçanlar ne? kaldıralım”): Kaçanlar bölümü yok; kapanan alım dosyasının sonucu oyuncunun kâğıdında
       “Bildiklerimiz”de (kaynak Transfer dosyası), rakibe gidişi gazetede (tr.dunya) */
  }
  return'<div class="tm-masa" data-bolum="'+(d.oyuncu?'oyuncu':bolum)+'">'+ust+sekme+ic+'</div>';
}
/* oyuncu kâğıdı: künye, bu sezon, bildiklerimiz (kaynaklı), eylemler (engel varsa düğme kapalı ve gerekçesi altında) */
function transferOyuncuKagidi(k,id,y){
  const yaz=y.yaz,B=transferOyuncu(k,id),S=B.kimlik,MV={KL:'Kaleci',DEF:'Defans',OS:'Orta saha',FV:'Forvet'};
  const sez=S.sezon,sayi=v=>v===null?'—':v;
  const dugme=(ey,ad,engel)=>'<button type="button" data-eylem="'+ey+'" data-oyuncu="'+yaz(id)+'"'+(engel?' disabled title="'+yaz(engel)+'"':'')+'>'+yaz(ad)+'</button>';
  const E=B.engel,notlar=[E.arastirt&&!B.dosya?'Araştırma: '+E.arastirt:null,B.izleme?'İzleme: '+y.tarihYazi(B.izleme.tarih)+' '+saatYazi(B.izleme.dakika)+'.':E.izle?'İzleme: '+E.izle:null].filter(Boolean);
  /* RK4-a: başta ortak oyuncu kartı (transfer bağlamı: kamu bilgisi ve kulüp); kart yoksa eski künye */
  return'<article class="tm-kagit" data-oyuncu="'+yaz(id)+'">'+(typeof oyuncuKarti==='function'&&(k.oyuncular||{})[id]?oyuncuKarti(k,id,'transfer'):'<h4>'+yaz(S.ad)+'</h4>'+
    '<p class="tm-kunye">'+yaz(MV[S.mevki]||S.mevki)+' · '+S.yas+' yaş · '+yaz(S.kulup||'Serbest')+(S.durum==='sakat'?' · sakat':S.durum==='cezali'?' · cezalı':'')+'</p>'+
    '<p>Bu sezon: '+sayi(sez.mac)+' maç, '+sayi(sez.dk)+' dakika, '+sez.gol+' gol, '+sez.sari+' sarı'+(sez.kirmizi?', '+sez.kirmizi+' kırmızı':'')+'.</p>')+
    (B.bildiklerimiz.length?'<ul class="tm-bilgi">'+B.bildiklerimiz.map(b=>'<li><span>'+yaz(b.metin)+'</span><small>'+yaz(b.kaynak)+'</small></li>').join('')+'</ul>':'<p class="tm-not">Hakkında bildiğimiz bir şey yok.</p>')+
    (B.dosya?'<p><button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+yaz(B.dosya)+'" data-donus="transfer">Dosyası açık ▸</button></p>':'')+
    '<div class="tm-eylemler">'+(B.takipte?dugme('tmTakipBirak','Takipten çıkar',E.takip):dugme('tmTakip','Takibe al',E.takip))+
      (B.dosya?'':dugme('tmArastirt','Hocaya araştırt',E.arastirt))+dugme('tmIzle','İzlemeye git',E.izle||(B.izleme?'İzleme planlandı.':null))+
      (notlar.length?'<small>'+notlar.map(yaz).join(' · ')+'</small>':'')+'</div>'+
    '<p class="tm-not">Takip zaman almaz. Araştırmayı hoca birkaç günde yapar; izleme hocayla birlikte bir öğleden sonranı alır ve yol masrafı kasadan düşer.</p></article>';
}
