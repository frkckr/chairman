/* ============ Chairman — Canlı Skor'un sayfaları (görüntü; kural içermez; R3, 2026-10-29) ============
   Veri js/canli-skor.js'in saf okumalarından (macSayfasi, takimSayfasi, oyuncuSayfasi); armalar js/arma.js. Sayfa yığını telefonun durumundadır:
   T.sayfalar = [{tur:'mac'|'kulup'|'oyuncu', id, bolum}] (en üstteki görünür). Odada (iki sütun) sayfa sağdaki iş panelinde, telefon listeyi tutar;
   balkonda ve maç telefonunda sayfa telefonun içinde (js/ekran-telefon.js telefonCiz). Eylemler (data-eylem; js/ekran-telefon.js telGezinti):
   csAc (data-tur, data-id) sayfa açar, csBolum (data-bolum) bölüm seçer, csGeri bir sayfa geri.
     csSayfaHtml(k, T, s) → html   s: {panel (sağ panelde mi), canliKayit(macId) → {s, durum, dk, tablo} | null (maç telefonu: o anki maç; takım ve
       oyuncu sayfası o zaman “bugünkü maçlar sonra işlenir” notunu taşır)}
     csSayfaBasligi(k, P) → kısa ad (geri düğmesinin yazısı)
   Bütün kulüpler aynı biçimde (Demirkapı ayrıcalıksız); kamuya açık bilgi: maaş, sözleşme, dönüş tarihi ve gizli değer yok (js/canli-skor.js). */
'use strict';
const csYaz=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const CS_BOLUM={mac:[['ozet','Özet'],['ist','İstatistikler'],['kadro','Kadrolar'],['tablo','Puan durumu']],kulup:[['genel','Genel'],['maclar','Maçlar'],['kadro','Kadro'],['ist','İstatistik']]};
const CS_AYAK={sag:'Sağ ayak',sol:'Sol ayak',iki:'İki ayak'};
const CS_KART={sari:'Sarı kart',ikinciSari:'İkinci sarıdan kırmızı',kirmizi:'Kırmızı kart'};
const csKulup=(k,id)=>(k.kulupler||{})[id]||{ad:id,kisa:String(id).slice(0,3).toUpperCase()};
const csArma=(k,id,boy)=>typeof armaSvg==='function'?armaSvg(id,boy,csKulup(k,id).kisa):'';
const csKulupDug=(k,id,ic,sinif)=>'<button type="button" class="cs-bag'+(sinif?' '+sinif:'')+'" data-eylem="csAc" data-tur="kulup" data-id="'+csYaz(id)+'">'+ic+'</button>';
const csOyuncuDug=(id,ad)=>id?'<button type="button" class="cs-bag" data-eylem="csAc" data-tur="oyuncu" data-id="'+csYaz(id)+'">'+csYaz(ad)+'</button>':csYaz(ad);
const csMacDug=(id,ic,sinif)=>'<button type="button" class="cs-satir'+(sinif?' '+sinif:'')+'" data-eylem="csAc" data-tur="mac" data-id="'+csYaz(id)+'">'+ic+'</button>';
/* kayıtlı maçlar sezonun ilk kariyer haftasından başlar (öncekiler devralınan haftalar: sayaçlarda var, maç kaydında yok) */
const csIlkHafta=k=>(k&&k.sezon&&k.sezon.ilkHafta)||13;
const csGun=t=>{const [y,a,g]=t.split('-').map(Number);return['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'][new Date(Date.UTC(y,a-1,g)).getUTCDay()]+' '+g+' '+(typeof TR_AYLAR!=='undefined'?TR_AYLAR[a-1]:a);};
function csSekmeler(tur,sec){
  return'<nav class="cs-sekmeler" role="tablist" aria-label="Bölümler">'+CS_BOLUM[tur].map(([id,ad])=>'<button type="button" class="cs-sekme" role="tab" data-eylem="csBolum" data-bolum="'+id+'" aria-selected="'+(sec===id?'true':'false')+'">'+ad+'</button>').join('')+'</nav>';
}
function csSayfaBasligi(k,P){
  if(!P)return'Canlı Skor';
  if(P.tur==='mac'){const f=(k.fikstur||[]).find(x=>x.id===P.id);return f?(csKulup(k,f.ev).kisa||'')+' – '+(csKulup(k,f.konuk).kisa||''):'Maç';}
  if(P.tur==='kulup')return csKulup(k,P.id).ad;
  return((k.oyuncular||{})[P.id]||{ad:'Oyuncu'}).ad;
}
/* puan durumu: armalı, ilgili kulüpler işaretli; kulübe dokununca takım sayfası */
function csTablo(k,tablo,ilgili,bolgeler){
  const a=v=>(v>0?'+':'')+v,I=new Set(ilgili||[]);
  return'<table class="cs-tablo"><thead><tr><th>#</th><th>Takım</th><th><abbr title="Oynanan">O</abbr></th><th><abbr title="Averaj">AV</abbr></th><th><abbr title="Puan">P</abbr></th></tr></thead><tbody>'+
    tablo.map((t,i)=>{const b=typeof ligBolgesi==='function'?ligBolgesi(bolgeler,i+1):null;
      return'<tr'+(I.has(t.id)?' class="cs-ilgili"':'')+'><td'+(b?' class="tel-b-'+b+'"':'')+'>'+(i+1)+'</td><td>'+csKulupDug(k,t.id,csArma(k,t.id,'kucuk')+'<span>'+csYaz(t.ad)+'</span>','cs-tabloAd')+'</td><td>'+t.O+'</td><td>'+a(t.AV)+'</td><td><b>'+t.P+'</b></td></tr>';}).join('')+'</tbody></table>';
}
/* ---- maç sayfası ---- */
function csOlay(k,o){
  if(o.tur==='devre')return'<li class="cs-ayrac">Devre arası · '+o.skor.join('–')+'</li>';
  if(o.tur==='bitis')return'<li class="cs-ayrac">Maç sonu · '+o.skor.join('–')+'</li>';
  const R=STIL.kagit.kartRenk||{};let sim='',m='';
  if(o.tur==='gol'){sim=typeof kartSimgeHtml==='function'?kartSimgeHtml('top','cs-simge'):'';m='<b>'+csYaz(o.ad)+'</b>'+(o.kk?' <small>(k.k.)</small>':'')+' <span class="cs-araSkor">'+o.skor.join('–')+'</span>';}
  else if(o.tur==='kart'){sim='<i class="cs-kart" style="background:'+(R[o.renk]||R.sari||'#e8c33a')+'" aria-hidden="true"></i>';m=csYaz(o.ad)+' <small>'+CS_KART[o.renk]+'</small>';}
  else if(o.tur==='sakatlik'){sim='<i class="cs-sakat" aria-hidden="true">+</i>';m=csYaz(o.ad)+' <small>'+csYaz(o.bolge||'Sakatlık')+(o.derece==='cikis'?' · oyundan çıktı':' · tedavi gördü')+'</small>';}
  else{sim=typeof kartSimgeHtml==='function'?kartSimgeHtml('degis','cs-simge'):'';
    m='<span class="cs-giren">'+csOyuncuDug(o.girenId,o.giren)+'</span> <span class="cs-cikan">'+csOyuncuDug(o.cikanId,o.cikan)+'</span>'+(o.sakatlik?' <small>sakatlık</small>':'');}
  return'<li class="cs-olay" data-t="'+o.t+'" data-tur="'+o.tur+'"><span class="cs-dk">'+csYaz(o.yazi)+'</span>'+sim+'<span class="cs-olayMetin">'+m+'</span></li>';
}
function csKadro(k,K,kulupId){
  const satir=o=>'<li><span class="cs-no">'+(o.no||'')+'</span>'+csOyuncuDug(o.id,o.ad)+'<small>'+csYaz(o.mevki||'')+'</small></li>';
  const yok='<p class="cs-yok">Kayıtta yok.</p>';
  return'<section class="cs-kadro"><h5>'+csArma(k,kulupId,'kucuk')+'<span>'+csYaz(csKulup(k,kulupId).ad)+'</span>'+(K.dizilis?'<small>'+csYaz(K.dizilis)+'</small>':'')+'</h5>'+
    '<h6>İlk on bir</h6><ul class="cs-liste">'+K.ilk.map(satir).join('')+'</ul>'+
    '<h6>Yedekler</h6>'+(K.yedek?(K.yedek.length?'<ul class="cs-liste">'+K.yedek.map(satir).join('')+'</ul>':'<p class="cs-yok">Yedek yok.</p>'):yok)+
    '<h6>Değişiklikler</h6>'+(K.degisiklik.length?'<ul class="cs-liste cs-degisiklik">'+K.degisiklik.map(d=>'<li><span class="cs-dk">'+csYaz(d.yazi)+'</span><span class="cs-giren">'+csOyuncuDug(d.girenId,d.giren)+
      '</span><span class="cs-cikan">'+csOyuncuDug(d.cikanId,d.cikan)+'</span>'+(d.sakatlik?'<small>sakatlık</small>':'')+'</li>').join('')+'</ul>':'<p class="cs-yok">Değişiklik yok.</p>')+
    '<h6>Eksikler</h6>'+(K.eksik?(K.eksik.length?'<ul class="cs-liste">'+K.eksik.map(o=>'<li><span class="cs-no">'+(o.no||'')+'</span>'+csOyuncuDug(o.id,o.ad)+'<small>'+(o.tur==='cezali'?'Cezalı':'Sakat')+'</small></li>').join('')+'</ul>'
      :'<p class="cs-yok">Eksik yok.</p>'):yok)+'</section>';
}
function csMac(k,P,bolum){
  const ev=P.ev,ko=P.konuk,oyn=P.durum!=='baslamadi';
  /* RK7: ertelenen maç (yeni tarihi bekliyorsa “Ertelendi”), saati açıklanmamış maç */
  const E=P.ertelendi,bekliyor=!oyn&&E&&E.bekliyor,NEDEN={kar:'kar',firtina:'fırtına',olaganustu:'olağanüstü olay'};
  const durum=bekliyor?'Ertelendi':!oyn?(P.aciklandi===false?'Saati açıklanmadı':'Başlama '+saatYazi(P.dakika)):P.durum==='hukmen'?'Hükmen':P.canli&&P.durum!=='bitti'?(P.dk||'Canlı'):'Maç sonu';
  const zaman=bekliyor?'ertelendi ('+(NEDEN[E.neden]||E.neden)+'), yeni tarih açıklanacak':P.aciklandi===false?csGun(P.tarih)+' haftası · saati açıklanmadı':csGun(P.tarih)+' '+saatYazi(P.dakika)+(E?' · ertelenmişti ('+(NEDEN[E.neden]||E.neden)+')':'');
  let h='<header class="cs-macBas">'+csKulupDug(k,ev,csArma(k,ev,'buyuk')+'<span>'+csYaz(csKulup(k,ev).ad)+'</span>','cs-takim')+
    '<div class="cs-skor"><b>'+(P.skor?P.skor.join(' – '):'–')+'</b>'+(P.iy?'<small>İY '+P.iy.join('–')+'</small>':'')+'<small'+(P.canli&&P.durum!=='bitti'?' class="cs-canli"':'')+'>'+csYaz(durum)+'</small></div>'+
    csKulupDug(k,ko,csArma(k,ko,'buyuk')+'<span>'+csYaz(csKulup(k,ko).ad)+'</span>','cs-takim')+'</header>'+
    '<p class="cs-kunye">'+P.hafta+'. hafta · '+csYaz(zaman)+(P.stat?' · '+csYaz(P.stat):'')+'</p>';
  const b=CS_BOLUM.mac.some(x=>x[0]===bolum)?bolum:'ozet';h+=csSekmeler('mac',b);
  if(b==='tablo')return h+csTablo(k,P.tablo,[ev,ko],k.sezon&&k.sezon.bolgeler);
  if(!oyn){
    if(b!=='ozet')return h+'<p class="cs-yok">Maçtan sonra.</p>';
    return h+'<div class="cs-onizleme">'+[ev,ko].map((id,i)=>{const O=P.onizleme[i];if(!O)return'';
      return'<section><h5>'+csArma(k,id,'kucuk')+'<span>'+csYaz(csKulup(k,id).ad)+'</span></h5><p>'+(O.sira>0?O.sira+'. sıra · ':'')+O.P+' puan</p>'+
        '<p class="cs-son">'+(O.son||[]).map(x=>{const r=x.a>x.y?'G':x.a<x.y?'M':'B';return'<i class="tel-sonuc tel-s'+r+'" title="'+csYaz(x.a+'–'+x.y)+'">'+r+'</i>';}).join('')+'</p>'+
        (O.hoca?'<p><small>'+csYaz(O.hoca.ad)+(O.hoca.tarzAdi?' · '+csYaz(O.hoca.tarzAdi):'')+'</small></p>':'')+'</section>';}).join('')+'</div>';
  }
  if(P.hukmen)return h+'<p class="cs-yok">'+(P.hukmen==='cift'?'İki takım da on bir uygun oyuncu çıkaramadı; maç oynanmadı (hükmen).':csYaz(csKulup(k,P.hukmen==='ev'?ev:ko).ad)+' on bir uygun oyuncu çıkaramadı; maç hükmen.')+'</p>';
  if(b==='ozet')return h+(P.akis.length?'<ol class="cs-akis">'+P.akis.map(o=>csOlay(k,o)).join('')+'</ol>':'<p class="cs-yok">Henüz olay yok.</p>');
  if(b==='ist')return h+'<table class="cs-ist"><thead><tr><th>'+csArma(k,ev,'kucuk')+' '+csYaz(csKulup(k,ev).kisa||'')+'</th><th></th><th>'+csYaz(csKulup(k,ko).kisa||'')+' '+csArma(k,ko,'kucuk')+'</th></tr></thead><tbody>'+
    P.satirlar.map(r=>'<tr><td>'+csYaz(r[1])+'</td><th scope="row">'+csYaz(r[0])+'</th><td>'+csYaz(r[2])+'</td></tr>').join('')+'</tbody></table>';
  return h+(P.kadro?'<div class="cs-kadrolar">'+csKadro(k,P.kadro[0],ev)+csKadro(k,P.kadro[1],ko)+'</div>':'<p class="cs-yok">Bu maçın kadro kaydı yok.</p>');
}
/* ---- takım sayfası ---- */
/* RK8-a: takip düğmesi (kural js/haber.js takipEt/takibiBirak; eylem js/ekran-oda.js) */
const csTakipDug=(k,tur,id)=>{if(typeof takipEdiliyor!=='function')return'';const a=takipEdiliyor(k,tur,id);
  return'<button type="button" class="cs-takip" data-eylem="takip" data-tur="'+tur+'" data-id="'+csYaz(id)+'" data-ac="'+(a?'0':'1')+'" aria-pressed="'+(a?'true':'false')+'">'+(a?'Takibi bırak':'Takip et ▸')+'</button>';};
function csKulupSayfa(k,P,bolum,s){
  const g=P.genel,a=v=>(v>0?'+':'')+v;
  let h='<header class="cs-kulupBas">'+csArma(k,g.id,'buyuk')+'<div><h4>'+csYaz(g.ad)+'</h4><small>'+(g.sira>0?g.sira+'. sıra · ':'')+g.P+' puan</small></div>'+(s&&s.takip?csTakipDug(k,'kulup',g.id):'')+'</header>';
  const b=CS_BOLUM.kulup.some(x=>x[0]===bolum)?bolum:'genel';h+=csSekmeler('kulup',b);
  if(b==='genel'){const sr=g.siradaki;
    return h+'<dl class="cs-dl"><dt>G-B-M</dt><dd>'+g.G+'-'+g.B+'-'+g.M+'</dd><dt>Goller</dt><dd>'+g.A+' attı, '+g.Y+' yedi · AV '+a(g.AV)+'</dd>'+
      '<dt>Son 5</dt><dd class="cs-son">'+((g.son||[]).map(x=>{const r=x.a>x.y?'G':x.a<x.y?'M':'B';return'<i class="tel-sonuc tel-s'+r+'" title="'+csYaz((x.yer==='i'?'':'@ ')+csKulup(k,x.rakip).ad+' '+x.a+'–'+x.y)+'">'+r+'</i>';}).join('')||'—')+'</dd>'+
      '<dt>Sıradaki</dt><dd>'+(sr?csMacDug(sr.id,(sr.yer==='i'?'':'@ ')+csArma(k,sr.rakip,'kucuk')+' '+csYaz(csKulup(k,sr.rakip).ad)+' · '+csYaz(csGun(sr.tarih))+' '+saatYazi(sr.dakika),'cs-satirKisa'):'—')+'</dd>'+
      '<dt>Teknik direktör</dt><dd>'+(g.hoca?csYaz(g.hoca.ad)+(g.hoca.tarzAdi?' <small>'+csYaz(g.hoca.tarzAdi)+'</small>':''):'—')+'</dd>'+
      '<dt>Stat</dt><dd>'+csYaz(g.stat.ad)+' <small>'+csYaz(g.stat.kapasite.toLocaleString('tr-TR'))+' kişi</small></dd></dl>';}
  if(b==='maclar')return h+'<ul class="cs-maclar">'+P.maclar.map(m=>{const r=m.a==null?'':m.a>m.y?'G':m.a<m.y?'M':'B';
    return'<li>'+csMacDug(m.id,'<span class="cs-hafta">'+m.hafta+'.</span><span class="cs-rakip">'+(m.yer==='d'?'@ ':'')+csArma(k,m.rakip,'kucuk')+' '+csYaz(csKulup(k,m.rakip).ad)+'</span>'+
      (m.a==null?'<small>'+csYaz(csGun(m.tarih))+'</small>':'<b>'+m.a+'–'+m.y+'</b><i class="tel-sonuc tel-s'+r+'" aria-label="'+({G:'Galibiyet',B:'Beraberlik',M:'Mağlubiyet'})[r]+'">'+r+'</i>'))+'</li>';}).join('')+'</ul>';
  if(b==='kadro')return h+'<div class="cs-tabloKap"><table class="cs-kadroTablo"><thead><tr><th><abbr title="Forma numarası">No</abbr></th><th>Oyuncu</th><th><abbr title="Mevki">Mvk</abbr></th><th>Yaş</th><th><abbr title="Maç">M</abbr></th><th><abbr title="Dakika">Dk</abbr></th><th><abbr title="Gol">G</abbr></th><th>Durum</th></tr></thead><tbody>'+
    P.kadro.map(o=>'<tr><td>'+o.no+'</td><td>'+csOyuncuDug(o.id,o.ad)+'</td><td>'+csYaz(o.mevki)+'</td><td>'+o.yas+'</td><td>'+(o.mac==null?'—':o.mac)+'</td><td>'+(o.dk==null?'—':o.dk)+'</td><td>'+o.gol+'</td><td>'+(o.durum==='sakat'?'Sakat':o.durum==='cezali'?'Cezalı':'')+'</td></tr>').join('')+'</tbody></table></div>';
  const I=P.istatistik;
  return h+'<dl class="cs-dl"><dt>Goller (sezon)</dt><dd>'+I.A+' attı, '+I.Y+' yedi</dd><dt>Kayıtlı maç</dt><dd>'+I.kayitli+' <small>('+csIlkHafta(k)+'. haftadan beri)</small></dd>'+
    '<dt>Beklenen gol</dt><dd>'+String(I.xgLehte).replace('.',',')+' lehte · '+String(I.xgAleyhte).replace('.',',')+' aleyhte</dd><dt>Şut</dt><dd>'+I.sut+' <small>(isabetli '+I.isabet+')</small></dd>'+
    '<dt>Topa sahip olma</dt><dd>'+(I.sahiplik==null?'—':'%'+I.sahiplik+' ortalama')+'</dd><dt>Kartlar</dt><dd>'+I.sari+' sarı, '+I.kirmizi+' kırmızı</dd>'+
    '<dt>Golcüler</dt><dd>'+(I.golculer.length?I.golculer.map(x=>csOyuncuDug(x.id,x.ad)+' '+x.gol).join(', '):'—')+'</dd></dl>';
}
/* ---- oyuncu sayfası ---- */
function csOyuncuSayfa(k,P,s){
  const kulup=csKulupDug(k,P.kulupId,csArma(k,P.kulupId,'kucuk')+'<span>'+csYaz(P.kulup)+'</span>','cs-oyuncuKulup');
  /* RK4-a: başta ortak oyuncu kartı (kamu bağlamı: durum yalnız oynayabilir, sakat, cezalı; sözleşme, dönüş ve doğum yok); kart yoksa eski künye */
  let h=typeof oyuncuKarti==='function'?oyuncuKarti(k,P.id,'kamu',{kulup,alt:s&&s.takip?'<p class="cs-takipKap">'+csTakipDug(k,'oyuncu',P.id)+'</p>':''}):
    '<header class="cs-oyuncuBas"><span class="cs-forma">'+P.no+'</span><div><h4>'+csYaz(P.ad)+'</h4><small>'+csYaz(P.mevki)+' · '+P.yas+' yaş</small>'+kulup+'</div></header>'+
    '<p class="cs-durum">'+(P.durum==='sakat'?'Sakat':P.durum==='cezali'?'Cezalı':'Oynayabilir')+'</p>';
  h+='<h5>Maçları <small>'+csIlkHafta(k)+'. haftadan beri</small></h5>'+(P.maclar.length?'<ul class="cs-maclar">'+P.maclar.slice().reverse().map(m=>'<li>'+csMacDug(m.id,'<span class="cs-hafta">'+m.hafta+'.</span><span class="cs-rakip">'+(m.yer==='d'?'@ ':'')+
    csArma(k,m.rakip,'kucuk')+' '+csYaz(csKulup(k,m.rakip).ad)+'</span><b>'+m.a+'–'+m.y+'</b><small>'+m.dk+' dk'+(m.gol?' · '+m.gol+' gol':'')+(m.kartlar.length?' · '+m.kartlar.map(r=>CS_KART[r]).join(', '):'')+'</small>')+'</li>').join('')+'</ul>'
    :'<p class="cs-yok">'+csIlkHafta(k)+'. haftadan beri oynadığı maç yok.</p>');
  h+='<h5>Sağlık geçmişi</h5>'+(P.saglik.length?'<ul class="cs-liste">'+P.saglik.map(x=>'<li><span class="cs-dk">'+x.hafta+'.</span><span>'+csYaz(x.bolge||'Sakatlık')+' · '+csYaz(csKulup(k,x.rakip).ad)+' maçı, '+csYaz(x.yazi)+'</span><small>'+(x.derece==='cikis'?'oyundan çıktı':'tedavi gördü')+'</small></li>').join('')+'</ul>'
    :'<p class="cs-yok">Maçta görülen sakatlık yok.</p>');
  return h;
}
function csSayfaHtml(k,T,s){
  s=s||{};const Y=T.sayfalar||[],P=Y[Y.length-1];if(!P||!k)return'';
  let ic='';
  if(P.tur==='mac'){const c=s.canliKayit?s.canliKayit(P.id):null,D=typeof macSayfasi==='function'?macSayfasi(k,P.id,c||undefined):null;
    if(D&&c)D.dk=c.dk||null;ic=D?csMac(k,D,P.bolum):'<p class="cs-yok">Maç bulunamadı.</p>';}
  else if(P.tur==='kulup'){const D=typeof takimSayfasi==='function'?takimSayfasi(k,P.id):null;ic=D?csKulupSayfa(k,D,P.bolum,{takip:!s.canliKayit}):'<p class="cs-yok">Kulüp bulunamadı.</p>';}
  else{const D=typeof oyuncuSayfasi==='function'?oyuncuSayfasi(k,P.id):null;ic=D?csOyuncuSayfa(k,D,{takip:!s.canliKayit}):'<p class="cs-yok">Oyuncu bulunamadı.</p>';}
  /* maç telefonunda takım ve oyuncu sayfası kariyerden (maç öncesi) okunur: bugünkü maçlar Odaya dön'de işlenir; sayfa bunu söyler (S-d'nin kulüp ekranı gibi) */
  if(s.canliKayit&&P.tur!=='mac')ic='<p class="cs-not">Bugünkü maçlar, maç bitince işlenir.</p>'+ic;
  /* sağ panelde kendi geri çubuğu (telefonun içinde telefonun ‹ Geri'si) */
  const geri=s.panel?'<nav class="cs-ust"><button type="button" class="cs-geri" data-eylem="csGeri">‹ '+csYaz(csSayfaBasligi(k,Y[Y.length-2]))+'</button></nav>':'';
  return'<div class="cs-sayfa" data-tur="'+P.tur+'">'+geri+ic+'</div>';
}
(function csStili(){
  if(typeof document==='undefined'||document.getElementById('csStili'))return;
  const st=document.createElement('style');st.id='csStili';
  st.textContent=`
.cs-sayfa{container:cs / inline-size;display:grid;gap:.55em;min-width:0;color:var(--k-yazi)}
.cs-sayfa p,.cs-sayfa h4,.cs-sayfa h5,.cs-sayfa h6,.cs-sayfa dl,.cs-sayfa ul,.cs-sayfa ol{margin:0}
.cs-sayfa h5{font-size:max(var(--k-enKucuk,12px),.8em);letter-spacing:.08em;text-transform:uppercase;color:var(--k-vurgu);font-weight:600;display:flex;align-items:center;gap:.35em}
.cs-sayfa h5 small{text-transform:none;letter-spacing:0;font-weight:400;color:var(--k-soluk)}
.cs-sayfa h6{font-size:max(var(--k-enKucuk,12px),.78em);color:var(--k-soluk);font-weight:600;margin-top:.35em}
.cs-ust{display:flex}
.cs-sayfa button{font:inherit;color:inherit}
.cs-sayfa .cs-geri{padding:.2em .5em;border:0;background:transparent;color:var(--k-mavi,#22347a)!important;cursor:pointer;font-weight:600}
.cs-sayfa .cs-bag{display:inline-flex;align-items:center;gap:.3em;min-width:0;padding:0;border:0;background:transparent;text-align:left;cursor:pointer}
.cs-sayfa .cs-bag:hover span,.cs-sayfa .cs-bag:hover{text-decoration:underline}
.cs-macBas{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:.4em}
.cs-macBas .cs-takim{display:grid;justify-items:center;gap:.2em;text-align:center;font-weight:600;line-height:1.2}
.cs-macBas .cs-takim span{overflow-wrap:anywhere}
.cs-skor{display:grid;justify-items:center;gap:.1em}
.cs-skor b{font-family:var(--display);font-weight:400;font-size:2.2em;line-height:1;white-space:nowrap}
.cs-skor small{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.82em)}
.cs-skor small.cs-canli{color:var(--k-kirmizi);font-weight:600}
.cs-kunye{text-align:center;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.84em)}
.cs-sekmeler{display:flex;gap:.2em;border-bottom:1px solid var(--k-cizgi)}
.cs-sayfa .cs-sekme{flex:1 1 auto;min-width:0;padding:.3em .15em;border:0;border-bottom:.18em solid transparent;background:transparent;color:var(--k-soluk)!important;cursor:pointer;
  font-size:max(var(--k-enKucuk,12px),.86em);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cs-sayfa .cs-sekme[aria-selected="true"]{color:var(--k-yazi)!important;font-weight:600;border-bottom-color:var(--k-vurgu)}
.cs-yok{color:var(--k-soluk);font-style:italic}
.cs-not{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.84em)}
.cs-akis{list-style:none;padding:0;display:grid;gap:.3em}
.cs-olay{display:flex;align-items:center;gap:.4em;min-width:0}
.cs-olay[data-t="1"]{flex-direction:row-reverse;text-align:right}
.cs-olayMetin{min-width:0;overflow-wrap:anywhere}
.cs-olayMetin small,.cs-liste small,.cs-maclar small{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.84em)}
.cs-dk{flex:none;min-width:2.6em;font-variant-numeric:tabular-nums;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.86em)}
.cs-olay[data-t="1"] .cs-dk{text-align:right}
.cs-simge{display:inline-grid;place-items:center;flex:none;width:1.4em;height:1.4em}
.cs-simge svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.cs-kart{flex:none;width:.7em;height:.95em;border-radius:.1em;box-shadow:0 0 0 1px #0003}
.cs-sakat{flex:none;width:1.1em;height:1.1em;display:grid;place-items:center;border-radius:50%;background:var(--k-kirmizi);color:#fff;font-style:normal;font-weight:700;line-height:1}
.cs-araSkor{font-weight:600}
.cs-giren::before{content:"↑ ";color:var(--k-yesil)}.cs-cikan::before{content:"↓ ";color:var(--k-kirmizi)}
.cs-ayrac{display:flex;align-items:center;gap:.6em;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.84em);font-weight:600}
.cs-ayrac::before,.cs-ayrac::after{content:"";flex:1;border-top:1px solid var(--k-cizgi)}
.cs-ist{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
.cs-ist th,.cs-ist td{padding:.28em .4em;border-bottom:1px solid var(--k-cizgi);text-align:center}
.cs-ist thead th{font-size:max(var(--k-enKucuk,12px),.86em)}
.cs-ist tbody th{font-weight:400;color:var(--k-soluk)}
.cs-kadrolar{display:grid;gap:.8em}
@container cs (min-width:30em){.cs-kadrolar{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.cs-onizleme{grid-template-columns:1fr 1fr}}
.cs-liste{list-style:none;padding:0;display:grid;gap:.15em}
.cs-liste li{display:flex;align-items:baseline;gap:.4em;min-width:0}
.cs-liste li>small{margin-left:auto}
.cs-no{flex:none;min-width:1.6em;text-align:right;font-variant-numeric:tabular-nums;color:var(--k-soluk)}
.cs-degisiklik li{flex-wrap:wrap}
.cs-onizleme{display:grid;gap:.6em}
.cs-onizleme section{display:grid;gap:.25em}
.cs-son{display:flex;gap:.2em}
.cs-tablo{width:100%;table-layout:fixed;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:max(var(--k-enKucuk,12px),.9em)}
.cs-tablo th{font-weight:600;color:var(--k-soluk);text-align:right;padding:.15em .25em}
.cs-tablo th:first-child{width:2em}.cs-tablo th:nth-child(3){width:2.2em}.cs-tablo th:nth-child(4){width:2.8em}.cs-tablo th:nth-child(5){width:2.3em}
.cs-tablo th:nth-child(2),.cs-tablo td:nth-child(2){text-align:left}
.cs-tablo td{padding:.16em .25em;text-align:right;border-top:1px solid var(--k-cizgi);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cs-tablo td:first-child{border-left:.22em solid transparent}
.cs-tablo tr.cs-ilgili td{background:var(--k-zeminKoyu,#00000010);font-weight:600}
.cs-tabloAd{max-width:100%;overflow:hidden}.cs-tabloAd span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cs-kulupBas,.cs-oyuncuBas{display:flex;align-items:center;gap:.6em}
.cs-kulupBas .cs-takip{margin-left:auto}
.cs-takip{appearance:none;flex:none;border:1px solid var(--k-cizgi);background:var(--k-serit);color:var(--k-yazi);font:inherit;font-size:max(var(--k-enKucuk,12px),.88em);padding:.2em .6em;cursor:pointer}
.cs-takip[aria-pressed="true"]{background:transparent;color:var(--k-soluk)}
.cs-takip:hover,.cs-takip:focus-visible{border-color:var(--k-vurgu)}
.cs-takipKap{margin:0;display:flex;justify-content:flex-end}
.cs-kulupBas h4,.cs-oyuncuBas h4{font-family:var(--display);font-weight:400;font-size:1.6em;line-height:1}
.cs-kulupBas small,.cs-oyuncuBas small{color:var(--k-soluk)}
.cs-oyuncuBas div{display:grid;gap:.15em;justify-items:start}
.cs-forma{flex:none;display:grid;place-items:center;width:2.2em;height:2.2em;border-radius:.3em;background:var(--k-zeminKoyu,#00000014);font-family:var(--display);font-size:1.4em}
.cs-durum{font-weight:600}
.cs-dl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.25em .7em}
.cs-dl dt{color:var(--k-soluk)}.cs-dl dd{margin:0;overflow-wrap:anywhere}
.cs-maclar{list-style:none;padding:0;display:grid;gap:.2em}
.cs-sayfa .cs-satir{display:grid;grid-template-columns:2em minmax(0,1fr) auto auto;align-items:center;gap:.45em;width:100%;padding:.3em .4em;border:1px solid var(--k-cizgi);border-radius:.3em;
  background:var(--k-zemin);text-align:left;cursor:pointer}
.cs-sayfa .cs-satir.cs-satirKisa{display:inline-flex;width:auto;padding:.1em .35em}
.cs-hafta{color:var(--k-soluk);font-variant-numeric:tabular-nums}
.cs-rakip{display:flex;align-items:center;gap:.3em;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.cs-tabloKap{overflow-x:auto}
.cs-kadroTablo{width:100%;min-width:24em;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:max(var(--k-enKucuk,12px),.88em)}
.cs-kadroTablo th,.cs-kadroTablo td{padding:.16em .3em;border-top:1px solid var(--k-cizgi);text-align:right;white-space:nowrap}
.cs-kadroTablo th:nth-child(2),.cs-kadroTablo td:nth-child(2),.cs-kadroTablo td:last-child{text-align:left}
.cs-kadroTablo thead th{color:var(--k-soluk);border-top:0}
.tlf-is.cs-panel{align-self:stretch}
`;
  document.head.appendChild(st);
})();
