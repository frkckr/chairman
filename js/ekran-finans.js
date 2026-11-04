/* ============ Chairman — Finans bölümü (görüntü; kural içermez; AR1, 2026-11-04, kararlar 90–91) ============
   Kullanıcı (2026-11-04): Finans ayrı bölüm; raporlar haftalık, aylık ve istenince; müdürle görüşme ve görev; bütçe ayarı değil (okunur). İlk hâl (AR1;
   Müdürlük — rapor iste, görev ver, yetki — ve Bütçe AR4):
     Durum     K2 (karar 91, “bilgi iki türlüdür”): kulübün defteri her an ve bedava — kasadaki para ve aylık maaş yükü bugünün (js/kulup-mali.js maliDurum,
               aylikMaas); “olacak olan” rapordan ve eskir — 90 günün en düşüğü, 90 gün sonrası, belirsiz gelir, bekleyen gelir ve gider son raporun anının
               bilgisidir, tarihi ve yaşıyla (“n gün önceki rapordan”); sıradaki rapor (mali işler müdürünün Pazartesi işi). Taze rapor istemek AR4
     Raporlar  raporların listesi ve seçili raporun resmî yazısı (js/ekran-dosya.js maliRaporBelgesi: antet, Sayı, üç rakam, seyir, “Müdüre sor”)
   Raporlar Kulüp'ten (dosyanın Raporlar sekmesi) buraya taşındı. Okur; raporu açmak yalnız görüldü işaretler (raporGoruldu; js/ekran-oda.js).
     finansGorunumu(k, D, y) → html   D: {sekme:'durum'|'raporlar', rapor (haberler dizisindeki sıra)}, y: {yaz, tlYazi}
   Seçiciler denemelerle sözleşmedir: .fn-durum, .fn-raporlar, .fn-kutu[data-alan], [data-eylem="finSekme"], [data-eylem="raporAc"]. */
'use strict';
const FINANS_SEKMELERI=[['durum','Durum'],['raporlar','Raporlar']];
function finansGorunumu(k,D,y){
  const R=typeof maliRaporlari==='function'?maliRaporlari(k):[];
  return D.sekme==='raporlar'?finansRaporlar(k,R,D.rapor,y):finansDurum(k,R,y);
}
function finansDurum(k,R,y){
  const yaz=y.yaz,tl=y.tlYazi,son=R.find(x=>x.h.anahtar!=='mali.uyari'),biz=((k.kisiler||{})[k.baskanId]||{}).kulupId;
  const sonraki=Object.values(k.isler||{}).filter(x=>x.tur==='maliRapor').sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika))[0];
  const sonrakiYazi=sonraki?'Sıradaki haftalık özet '+gunAyYazi(sonraki.tarih)+' '+saatYazi(sonraki.dakika)+'.':'';
  const kutu=(alan,ad,tutar,alt,eski)=>'<div class="cmp-kutu fn-kutu'+(eski?' fn-eski':'')+'" data-alan="'+alan+'"><span>'+yaz(ad)+'</span><b class="cmp-buyuk'+(tutar<0?' cmp-eksi':'')+'">'+yaz(tl(tutar))+'</b>'+(alt?'<small>'+yaz(alt)+'</small>':'')+'</div>';
  /* kulübün defteri: bugün */
  const nakit=typeof maliDurum==='function'&&biz?maliDurum(k,biz).nakit:(k.kulupler[biz]||{}).nakit,maas=typeof aylikMaas==='function'&&biz?aylikMaas(k,biz,true):null;
  const bugun='<section class="cmp-panel fn-bugun"><h2>Kulübün defteri<small>bugün · '+yaz(gunAyYazi(k.tarih)+' '+saatYazi(k.gunIciDakika))+'</small></h2><div class="cmp-ic"><div class="cmp-kutular">'+
    kutu('nakit','Kasadaki para',nakit,'banka hesabı')+(maas!==null?kutu('maas','Aylık maaş yükü',-maas,'oyuncu ve hoca'):'')+'</div></div></section>';
  if(!son)return'<div class="cmp-sayfa fn-durum">'+bugun+'<section class="cmp-panel fn-rapor"><h2>Mali işler müdürünün raporu</h2><div class="cmp-ic"><p class="cmp-not">Henüz rapor yok. '+yaz(sonrakiYazi)+'</p></div></section></div>';
  const h=son.h,p=h.p,O=maliRaporOkumasi(k,h),gun=Math.max(0,Math.floor((anDakika(k.tarih,k.gunIciDakika)-anDakika(h.tarih,h.dakika))/1440));
  const yas=gun===0?'bugünkü rapordan':gun===1?'dünkü rapordan':gun+' gün önceki rapordan',eski=gun>=7;
  const K=[p.enDusuk!==undefined?kutu('enDusuk','90 gün içinde en düşük',p.enDusuk,p.enDusukTarih?gunAyYazi(p.enDusukTarih):'',eski):'',
    p.son90!==undefined?kutu('son90','90 gün sonra (kesin)',p.son90,'bilinen gelir ve giderle',eski):'',
    p.belirsiz!==undefined?kutu('belirsiz','Belirsiz gelir',p.belirsiz,'bilet tahmini',eski):'',
    p.bekleyenGelir!==undefined?kutu('gelir','Bekleyen gelir',p.bekleyenGelir,'',eski):'',
    p.bekleyenGider!==undefined?kutu('gider','Bekleyen gider',-p.bekleyenGider,'',eski):''].join('');
  return'<div class="cmp-sayfa fn-durum">'+bugun+
    '<section class="cmp-panel fn-rapor"><h2>Mali işler müdürünün raporu<small>'+yaz(O.baslik+' · '+O.kaynakAd+' · '+gunAyYazi(h.tarih))+'</small></h2><div class="cmp-ic">'+
      '<p class="cmp-not">Tahminler '+yaz(yas)+' ('+yaz(gunAyYazi(h.tarih)+' '+saatYazi(h.dakika))+'). '+yaz(sonrakiYazi)+'</p>'+
      (O.uyari?'<p class="fn-uyari"><b>'+yaz(O.uyari)+'</b></p>':'')+'<div class="cmp-kutular">'+K+'</div>'+
      '<p><button type="button" class="cmp-dugme" data-eylem="raporAc" data-rapor="'+son.i+'">Raporu aç ▸</button></p></div></section></div>';
}
function finansRaporlar(k,R,sec,y){
  const yaz=y.yaz;
  if(!R.length)return'<div class="cmp-sayfa fn-raporlar"><section class="cmp-panel"><h2>Raporlar</h2><div class="cmp-ic"><p class="cmp-not">Henüz rapor yok.</p></div></section></div>';
  const s=R.some(x=>x.i===sec)?sec:R[0].i;
  const liste='<section class="cmp-panel fn-liste"><h2>Raporlar<small>'+R.length+'</small></h2><div class="cmp-liste">'+R.map(x=>{const B=maliRaporOkumasi(k,x.h);
    return'<button type="button" class="cmp-satir" data-eylem="raporAc" data-rapor="'+x.i+'" aria-current="'+(x.i===s?'true':'false')+'"><b'+(x.h.gorulen?'':' class="cmp-yeni"')+'>'+yaz(B.baslik)+
      (x.h.gorulen?'':'<span class="dsy-gizli"> (yeni)</span>')+'</b><span class="cmp-soluk">'+yaz(gunAyYazi(x.h.tarih))+'</span></button>';}).join('')+'</div></section>';
  const belge=typeof maliRaporBelgesi==='function'?maliRaporBelgesi(k,s,{yaz}):'';
  return'<div class="cmp-sayfa fn-raporlar"><div class="fn-duzen">'+liste+'<div class="cmp-kagitSayfa fn-belge">'+belge+'</div></div></div>';
}
(function finansStili(){
  if(typeof document==='undefined'||document.getElementById('finansStili'))return;
  const st=document.createElement('style');st.id='finansStili';
  st.textContent=`
.fn-duzen{display:grid;grid-template-columns:minmax(14em,20em) minmax(0,1fr);gap:.8em;align-items:start;min-height:0}
@container (max-width:900px){.fn-duzen{grid-template-columns:minmax(0,1fr)}}
.fn-eski{background:linear-gradient(rgba(214,180,90,.08),rgba(214,180,90,.08)),var(--c-panel)}
.fn-eski>small::after{content:' · eski';color:var(--c-orta)}
.fn-uyari{margin:.4em 0;padding:.35em .6em;border-left:.25em solid var(--c-kotu);color:var(--c-pyazi)}
.lg-fikstur{justify-self:center;width:min(100%,64em)}
.lg-hazirlik{color:var(--c-psoluk)}
.lg-bolge{display:inline-flex;align-items:center;gap:.35em}
.lg-bolge::before{content:'';display:inline-block;width:.3em;height:1em;background:var(--c-psoluk)}
.lg-bolge[data-bolge="cikma"]::before,.lg-bolge[data-bolge="playoff"]::before{background:var(--c-iyi)}
.lg-bolge[data-bolge="dusme"]::before{background:var(--c-kotu)}
.cmp-tablo td.cmp-bolge[data-bolge="cikma"],.cmp-tablo td.cmp-bolge[data-bolge="playoff"]{border-left-color:var(--c-iyi)}
`;
  document.head.appendChild(st);
})();
