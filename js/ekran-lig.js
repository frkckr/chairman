/* ============ Chairman — Lig bölümü (görüntü; kural içermez; AR1, 2026-11-04, karar 90) ============
   Kullanıcı (2026-11-04): “Lig'e basınca telefon açılıyor, olmaz; lig menüsü olsun.” Lig bölümü şeridin Lig düğmesi (5) ve odadaki TV'den (canlı maç
   yokken) açılır; odada telefonun Canlı Skor'u açılmaz (balkonda ve maçta kalır). İlk hâl (AR1; Gol krallığı ve İstatistik AR5):
     Puan durumu  bütün sütunlar (O G B M A Y AV P), bölge çizgisi (çıkma, play-off, düşme), son beş; yanda kulübün özeti (sıra, son beş, sıradaki maç,
                  golcüler). Kulübe dokununca kulüp sayfası
     Fikstür      hafta görünümü (‹ N. hafta ›), gün başlıklı; satıra dokununca maç sayfası
     Kulüpler     16 kulüp (arma, sıra, hoca, stat); dokununca kulüp sayfası
   Alt sayfalar (kulüp, oyuncu, maç) Canlı Skor'un sayfaları (js/ekran-canli.js csSayfaHtml; okumalar js/canli-skor.js) kâğıtta, içerik alanında; yığın
   D.sayfalar, eylemler csAc/csBolum/csGeri (js/ekran-telefon.js telGezinti) — AR5'te koyu tam sayfalar. Bütün kulüpler aynı biçimde (Demirkapı yalnız
   satır vurgusuyla ayrılır); kamuya açık bilgi.
     ligGorunumu(k, D, y) → html   D: {sekme:'puan'|'fikstur'|'kulupler', hafta, sayfalar}, y: {yaz}
   Seçiciler denemelerle sözleşmedir: .lg-puan, .lg-fikstur, .lg-kulupler, .lg-altSayfa, [data-eylem="ligSekme"], [data-eylem="ligHafta"]. */
'use strict';
const LIG_SEKMELERI=[['puan','Puan durumu'],['fikstur','Fikstür'],['kulupler','Kulüpler']];
const LIG_GUN=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const ligGunBasligi=t=>{const [y,a,g]=t.split('-').map(Number);return LIG_GUN[new Date(Date.UTC(y,a-1,g)).getUTCDay()]+' '+gunAyYazi(t);};
const ligArma=(k,id,boy)=>typeof armaSvg==='function'?armaSvg(id,boy||'kucuk',((k.kulupler||{})[id]||{}).kisa):'';
const ligBiz=k=>((k.kisiler||{})[k.baskanId]||{}).kulupId;
const ligKulupDug=(k,id,y)=>'<button type="button" class="cmp-bag" data-eylem="csAc" data-tur="kulup" data-id="'+y.yaz(id)+'">'+ligArma(k,id)+'<span>'+y.yaz(((k.kulupler||{})[id]||{ad:id}).ad)+'</span></button>';
function ligSonBes(L){
  return'<span class="cmp-son5" aria-label="Son beş maç">'+(L||[]).map(x=>{const s=x.a>x.y?'G':x.a<x.y?'M':'B';return'<i data-s="'+s+'" title="'+x.a+'–'+x.y+'">'+s+'</i>';}).join('')+'</span>';
}
function ligGorunumu(k,D,y){
  if(!k||!k.sezon)return'<p class="cmp-not">Lig bilgisi yok.</p>';
  const Y=D.sayfalar||[];
  if(Y.length&&typeof csSayfaHtml==='function')return'<div class="cmp-sayfa"><div class="cmp-kagitSayfa lg-altSayfa">'+csSayfaHtml(k,D,{panel:false})+'</div></div>';
  if(D.sekme==='fikstur')return ligFikstur(k,D,y);
  if(D.sekme==='kulupler')return ligKulupler(k,y);
  return ligPuan(k,y);
}
function ligPuan(k,y){
  const yaz=y.yaz,T=sezonTablosu(k),Z=k.sezon.bolgeler,biz=ligBiz(k),av=v=>(v>0?'+':'')+v;
  const tablo='<table class="cmp-tablo"><thead><tr><th class="sol">#</th><th class="sol">Takım</th><th><abbr title="Oynanan">O</abbr></th><th><abbr title="Galibiyet">G</abbr></th>'+
    '<th><abbr title="Beraberlik">B</abbr></th><th><abbr title="Mağlubiyet">M</abbr></th><th><abbr title="Attığı">A</abbr></th><th><abbr title="Yediği">Y</abbr></th><th><abbr title="Averaj">AV</abbr></th>'+
    '<th><abbr title="Puan">P</abbr></th><th class="sol">Son beş</th></tr></thead><tbody>'+
    T.map((t,i)=>{const b=typeof ligBolgesi==='function'?ligBolgesi(Z,i+1):'';
      return'<tr'+(t.id===biz?' class="cmp-biz"':'')+'><td class="sol cmp-bolge"'+(b?' data-bolge="'+b+'"':'')+'>'+(i+1)+'</td><td class="sol">'+ligKulupDug(k,t.id,y)+'</td><td>'+t.O+'</td><td>'+t.G+'</td><td>'+t.B+'</td><td>'+t.M+'</td>'+
        '<td>'+t.A+'</td><td>'+t.Y+'</td><td>'+av(t.AV)+'</td><td><b>'+t.P+'</b></td><td class="sol">'+ligSonBes(sonBesMac(k,t.id))+'</td></tr>';}).join('')+'</tbody></table>';
  const bolge=[['cikma','Üst lige çıkma'],['playoff','Play-off'],['dusme','Düşme']].filter(([b])=>Z&&Z[b]).map(([b,ad])=>'<span class="lg-bolge" data-bolge="'+b+'">'+ad+' '+Z[b][0]+(Z[b][1]!==Z[b][0]?'–'+Z[b][1]:'')+'</span>').join(' · ');
  const O=typeof kulupOzeti==='function'&&biz?kulupOzeti(k,biz,T):null;
  const yan=O?'<section class="cmp-panel lg-ozet"><h2>'+yaz(O.ad)+'<small>'+O.sira+'. sıra · '+O.P+' puan</small></h2><div class="cmp-ic">'+
      '<p>'+ligSonBes(O.son)+'</p>'+
      (O.siradaki?'<p><span class="cmp-soluk">Sıradaki maç:</span> '+(O.siradaki.yer==='i'?'İç saha':'Deplasman')+' · '+ligKulupDug(k,O.siradaki.rakip,y)+'<br><span class="cmp-soluk">'+yaz(ligGunBasligi(O.siradaki.tarih))+' · '+saatYazi(O.siradaki.dakika)+'</span></p>':'')+
      (O.golculer.length?'<p><span class="cmp-soluk">Golcüler:</span> '+O.golculer.map(g=>'<button type="button" class="cmp-bag" data-eylem="csAc" data-tur="oyuncu" data-id="'+yaz(g.id)+'">'+yaz(g.ad)+'</button> '+g.gol).join(', ')+'</p>':'')+
      (O.hoca?'<p><span class="cmp-soluk">Hoca:</span> '+yaz(O.hoca.ad)+(O.hoca.tarzAdi?' · '+yaz(O.hoca.tarzAdi):'')+'</p>':'')+
      '<p><span class="cmp-soluk">Stat:</span> '+yaz(O.stat.ad)+(O.stat.kapasite?' · '+O.stat.kapasite.toLocaleString('tr-TR')+' kişi':'')+'</p></div></section>':'';
  return'<div class="cmp-sayfa lg-puan"><div class="cmp-iki"><section class="cmp-panel"><h2>Puan durumu<small>'+yaz(k.sezon.ad||'')+'</small></h2><div class="cmp-ic">'+tablo+
    (bolge?'<p class="cmp-not">'+bolge+'</p>':'')+'</div></section>'+yan+'</div></div>';
}
function ligFikstur(k,D,y){
  const yaz=y.yaz,h0=D.hafta||(typeof canliVarsayilanHafta==='function'?canliVarsayilanHafta(k):null)||k.sezon.ilkHafta,H=canliHafta(k,h0),biz=ligBiz(k);
  /* satırın durum kısaltması, başlığı (title) ve gün başlıkları telefonun hafta görünümüyle aynı dilde (js/ekran-telefon.js telHafta) */
  const satir=m=>{const d=m.durum,ert=m.ertelendi&&d!=='bitti'&&d!=='hukmen',bek=ert&&m.ertelendi.bekliyor;
    const ust=bek?'Ert.':d==='baslamadi'?(m.hazirlik?saatYazi(m.dakika):m.aciklandi?saatYazi(m.dakika):'—'):d==='hukmen'?'Hük.':'Bitti';
    const dy=m.hazirlik?(d==='baslamadi'?'hazırlık maçı, '+gunAyYazi(m.tarih)+' '+saatYazi(m.dakika):'hazırlık maçı, bitti'):bek?'ertelendi':ert?'ertelendi, yeni tarihinde':d==='baslamadi'?(m.aciklandi?'başlamadı':'saati açıklanmadı'):d==='hukmen'?'hükmen':'bitti';
    const evAd=((k.kulupler||{})[m.ev]||{ad:m.ev}).ad,koAd=((k.kulupler||{})[m.konuk]||{ad:m.konuk}).ad;
    return'<button type="button" class="cmp-mac'+(m.ev===biz||m.konuk===biz?' cmp-biz':'')+'" data-eylem="csAc" data-tur="mac" data-id="'+yaz(m.id)+'" title="'+yaz(evAd+' – '+koAd+' · '+dy)+'">'+
      '<span class="cmp-saat">'+yaz(ust)+'</span><span class="cmp-ev"><span>'+yaz(evAd)+'</span>'+ligArma(k,m.ev)+'</span>'+
      '<span class="cmp-skor">'+(m.skor?m.skor[0]+'–'+m.skor[1]:'–')+'</span><span class="cmp-konuk">'+ligArma(k,m.konuk)+'<span>'+yaz(koAd)+'</span></span></button>';};
  const gunlu=L=>{const S=[];let b0=null;for(const m of L){const b=m.ertelendi&&m.ertelendi.bekliyor?'Ertelendi · yeni tarih açıklanacak':!m.aciklandi&&!m.hazirlik?'Program açıklanmadı':ligGunBasligi(m.tarih);
    if(b!==b0){b0=b;S.push('<h3 class="cmp-gun">'+yaz(b)+'</h3>');}S.push(satir(m));}return S.join('');};
  const lig=H.maclar;
  const nav='<div class="cmp-hafta"><button type="button" class="cmp-dugme" data-eylem="ligHafta" data-yon="geri" data-hafta="'+(H.hafta-1)+'"'+(H.hafta<=H.ilk?' disabled':'')+' aria-label="Önceki hafta">‹</button>'+
    '<b>'+H.hafta+'. hafta</b><button type="button" class="cmp-dugme" data-eylem="ligHafta" data-yon="ileri" data-hafta="'+(H.hafta+1)+'"'+(H.hafta>=H.son?' disabled':'')+' aria-label="Sonraki hafta">›</button></div>';
  return'<div class="cmp-sayfa lg-fikstur"><section class="cmp-panel"><h2>Fikstür<small>'+yaz(k.sezon.ad||'')+'</small></h2><div class="cmp-ic">'+nav+
    (H.hazirlik.length?'<h3 class="cmp-gun lg-hazirlik">Hazırlık maçları</h3>'+H.hazirlik.map(satir).join(''):'')+
    (H.hazirlik.length&&lig.length?'<h3 class="cmp-gun lg-hazirlik">Lig</h3>':'')+(lig.length?gunlu(lig):'<p class="cmp-not">Bu hafta maç yok.</p>')+
    '<p class="cmp-not">Saati açıklanmamış maçlarda “—”: TFF programı her Pazartesi üç hafta sonrasını açıklar.</p></div></section></div>';
}
function ligKulupler(k,y){
  const yaz=y.yaz,T=sezonTablosu(k),biz=ligBiz(k);
  const L=T.map(t=>{const O=typeof kulupOzeti==='function'?kulupOzeti(k,t.id,T):null;
    return'<button type="button" class="cmp-kulup'+(t.id===biz?' cmp-biz':'')+'" data-eylem="csAc" data-tur="kulup" data-id="'+yaz(t.id)+'">'+ligArma(k,t.id,'orta')+'<b>'+yaz(t.ad)+'</b>'+
      '<small>'+(O?O.sira+'. sıra · '+O.P+' puan'+(O.hoca?' · '+yaz(O.hoca.ad):''):'')+'</small></button>';});
  return'<div class="cmp-sayfa lg-kulupler"><section class="cmp-panel"><h2>Kulüpler<small>'+T.length+' kulüp</small></h2><div class="cmp-ic"><div class="cmp-kulupler">'+L.join('')+'</div></div></section></div>';
}
