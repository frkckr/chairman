/* ============ Chairman — Finans bölümü (görüntü; kural içermez; AR1, 2026-11-04, kararlar 90–91) ============
   Kullanıcı (2026-11-04): Finans ayrı bölüm; raporlar haftalık, aylık ve istenince; müdürle görüşme ve görev; bütçe ayarı değil (okunur). İlk hâl (AR1;
   Müdürlük — rapor iste, görev ver, yetki — ve Bütçe AR4):
     Durum     kasanın sayıları son rapordan, tarihiyle (K2 “bilgi iki türlü ve eskir”: Finans canlı kasa göstermez — H2-d'den beri mali bilgi kaynağından
               gelir; sayılar o raporun anının bilgisidir, rapor eskidikçe “n gün önceki rapor” der); sıradaki rapor (mali işler müdürünün Pazartesi işi)
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
  const yaz=y.yaz,tl=y.tlYazi,son=R.find(x=>x.h.anahtar!=='mali.uyari'),enSon=R[0]||null;
  const sonraki=Object.values(k.isler||{}).filter(x=>x.tur==='maliRapor').sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika))[0];
  const sonrakiYazi=sonraki?'Sıradaki haftalık özet '+gunAyYazi(sonraki.tarih)+' '+saatYazi(sonraki.dakika)+'.':'';
  if(!son&&!enSon)return'<div class="cmp-sayfa fn-durum"><section class="cmp-panel"><h2>Durum</h2><div class="cmp-ic"><p class="cmp-not">Mali işler müdürü henüz rapor bırakmadı. '+yaz(sonrakiYazi)+'</p></div></section></div>';
  const h=(son||enSon).h,p=h.p,O=maliRaporOkumasi(k,h),gun=Math.max(0,Math.round((anDakika(k.tarih,k.gunIciDakika)-anDakika(h.tarih,h.dakika))/1440));
  const yas=gun===0?'bugünkü rapordan':gun===1?'dünkü rapordan':gun+' gün önceki rapordan';
  const kutu=(alan,ad,tutar,alt)=>'<div class="cmp-kutu fn-kutu" data-alan="'+alan+'"><span>'+yaz(ad)+'</span><b class="cmp-buyuk'+(tutar<0?' cmp-eksi':'')+'">'+yaz(tl(tutar))+'</b>'+(alt?'<small>'+yaz(alt)+'</small>':'')+'</div>';
  /* uyarı raporu daha yeniyse kasadaki para ondan (uyarı yalnız kasayı yazar) */
  const nakitH=enSon&&enSon.h!==h&&enSon.h.anahtar==='mali.uyari'?enSon.h:h;
  const K=[kutu('nakit','Kasadaki para',nakitH.p.nakit,gunAyYazi(nakitH.tarih)+' '+saatYazi(nakitH.dakika)),
    p.maasYuku!==undefined?kutu('maas','Aylık maaş yükü',-p.maasYuku,'oyuncu ve hoca'):'',
    p.enDusuk!==undefined?kutu('enDusuk','90 gün içinde en düşük',p.enDusuk,p.enDusukTarih?gunAyYazi(p.enDusukTarih):''):'',
    p.son90!==undefined?kutu('son90','90 gün sonra (kesin)',p.son90,'bilinen gelir ve giderle'):'',
    p.belirsiz!==undefined?kutu('belirsiz','Belirsiz gelir',p.belirsiz,'bilet tahmini'):'',
    p.bekleyenGelir!==undefined?kutu('gelir','Bekleyen gelir',p.bekleyenGelir,''):'',
    p.bekleyenGider!==undefined?kutu('gider','Bekleyen gider',-p.bekleyenGider,''):''].join('');
  return'<div class="cmp-sayfa fn-durum">'+
    '<section class="cmp-panel"><h2>Durum<small>'+yaz(O.baslik+' · '+O.kaynakAd)+'</small></h2><div class="cmp-ic">'+
      '<p class="cmp-not">Sayılar '+yaz(yas)+' ('+yaz(gunAyYazi(h.tarih)+' '+saatYazi(h.dakika))+'); kasanın bugünkü hâli bir sonraki raporda. '+yaz(sonrakiYazi)+'</p>'+
      (O.uyari?'<p class="fn-uyari"><b>'+yaz(O.uyari)+'</b></p>':'')+
      '<p><button type="button" class="cmp-dugme" data-eylem="raporAc" data-rapor="'+(son||enSon).i+'">Raporu aç ▸</button></p></div></section>'+
    '<div class="cmp-kutular">'+K+'</div></div>';
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
