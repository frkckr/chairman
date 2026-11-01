/* RK3 taslağı (2026-11-01): dört ekran × iki dil. Veri TEST (oyunun bugünkü örneklerine benzer); yüz ve arma oyunun işlevleriyle.
   Ortak iskelet: tek krom çubuk (kulüp · tarih ve saat · kayıt · Duraklat), odak kâğıdı (başlık kâğıdın üstünde, Kapat kâğıdın köşesinde, ana eylem
   kâğıdın alt kenarında), tek satırlık alt şerit. v1 Kırtasiye: temiz kâğıt, piktogram + kelime, eşit genişlikli rakam, tek renk zebra.
   v2 Kulüp evrakı 1999: antetli kâğıt, resmî yazı biçimi (Sayı, Konu, Bilgilerinize arz ederim), daktilo alanlar, mühür ve paraf, karbon kopya renkleri,
   mantar pano. Ölçüler ikisinde de aynı: gövde ≥ 15 px, en küçük 12 px, kontrast ≥ 4,5:1 (cek.py ölçer). */
'use strict';
const Q=new URLSearchParams(location.search),V=Q.get('v')==='2'?2:1,S=Q.get('s')||'mali';
document.getElementById('varyant').href='v'+V+'.css';
document.body.dataset.v=V;document.body.dataset.s=S;
const TARIH='2026-12-01',ay=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const yaz=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tl=n=>(n<0?'−':'')+Math.abs(n).toLocaleString('tr-TR')+' ₺';
const milyon=n=>(n/1e6).toLocaleString('tr-TR',{maximumFractionDigits:2})+' milyon ₺';
const ikon=(ad,k)=>simgeSvg(ad,k||16);
const kunyeKulup={ad:'Demirkapı SK',baskan:'Haluk Demirel'};
const krom='<header class="krom"><span class="krom-kulup">'+(V===2?armaSvg('demirkapi','kucuk')+' ':'')+'Demirkapı SK · Başkan Haluk Demirel</span>'+
  '<span class="krom-sag"><span class="krom-tarih">1 Aralık Salı · <b>08:00</b></span><span class="krom-kayit">Kaydedildi</span><button class="krom-dur">Duraklat</button></span></header>';
const serit=(yazi,dugme)=>'<footer class="serit"><p>'+yazi+'</p>'+(dugme||'')+'</footer>';
const kagit=(o)=>'<article class="kagit kagit-'+S+'"'+(o.genis?' data-genis':'')+'>'+
  (V===2&&o.antet?'<div class="antet">'+armaSvg('demirkapi','orta')+'<div><b>DEMİRKAPI SPOR KULÜBÜ</b><small>'+yaz(o.antet)+'</small></div></div>':'')+
  '<div class="kagit-bas"><div><p class="kat">'+(o.ikon?ikon(o.ikon):'')+yaz(o.kat)+'</p><h1>'+yaz(o.baslik)+'</h1>'+(o.alt?'<p class="kagit-alt">'+o.alt+'</p>':'')+'</div>'+
  '<button class="kapat">Kapat '+ikon('kapat',12)+'</button></div>'+
  '<div class="kagit-ic">'+o.ic+'</div>'+(o.eylem?'<div class="kagit-eylem">'+o.eylem+'</div>':'')+'</article>';
/* ---------------- mali rapor ---------------- */
function mali(){
  const H=[['1 Kas','Lig payı · Kasım',350000],['1 Kas','Oyuncu maaşları · 22 kişi',-448000],['1 Kas','Teknik ekip ve personel',-38500],['8 Kas','Bilet geliri · Demirkapı–Akdeniz',96400],
    ['15 Kas','Saha bakımı (fatura)',-24000],['22 Kas','Bilet geliri · Demirkapı–Yıldıztepe',71250],['28 Kas','Bilet geliri · Demirkapı–Akdeniz',64150],['30 Kas','Kırtasiye ve sarf',-3800]];
  const seri=[4820,4610,4520,4430,4880,4690,4310,4020,3960,4440,4250,4160,4060];   /* bin ₺, haftalık (1 Ara → 1 Mar) */
  const W=360,Hh=56,mn=Math.min(...seri),mx=Math.max(...seri),px=i=>8+i*(W-16)/(seri.length-1),py=v=>6+(Hh-12)*(1-(v-mn)/(mx-mn));
  const yol=seri.map((v,i)=>(i?'L':'M')+px(i).toFixed(1)+' '+py(v).toFixed(1)).join(' '),im=seri.indexOf(mn);
  const sparka='<svg class="seyir" viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="90 günlük kasa seyri"><path d="'+yol+'" fill="none" stroke="currentColor" stroke-width="2"/>'+
    '<circle cx="'+px(im)+'" cy="'+py(mn)+'" r="4" class="seyir-dip"/><text x="'+(px(im)+7)+'" y="'+(py(mn)+4)+'" class="seyir-yazi">1 Şubat</text></svg>';
  const uc='<div class="uc">'+
    '<div><span class="uc-ad">Kasada bugün</span><b>4,82 milyon ₺</b><small class="dusus">▼ 0,38 milyon · geçen aya göre</small></div>'+
    '<div><span class="uc-ad">90 günde en düşük</span><b>3,96 milyon ₺</b><small>1 Şubat · maaş günü</small></div>'+
    '<div><span class="uc-ad">90 gün sonra</span><b>4,06 milyon ₺</b><small>kesinleşmiş hareketlerle</small></div></div>';
  const dl='<dl class="kv"><dt>Aylık maaş yükü</dt><dd>486.500 ₺</dd><dt>Bekleyen gelir (bilet tahmini, kesin değil)</dt><dd>1.204.350 ₺</dd><dt>Bekleyen gider (3 ay)</dt><dd>1.459.500 ₺</dd></dl>';
  const tablo='<table class="cizelge"><caption>Kasım hareketleri</caption><thead><tr><th>Tarih</th><th>Açıklama</th><th class="sayi">Giriş</th><th class="sayi">Çıkış</th></tr></thead><tbody>'+
    H.map(([t,a,n])=>'<tr><td>'+t+'</td><td>'+yaz(a)+'</td><td class="sayi">'+(n>0?n.toLocaleString('tr-TR'):'')+'</td><td class="sayi">'+(n<0?(-n).toLocaleString('tr-TR'):'')+'</td></tr>').join('')+
    '</tbody><tfoot><tr><td></td><td>Ay toplamı</td><td class="sayi">581.800</td><td class="sayi">514.300</td></tr></tfoot></table>';
  const v1ic=uc+'<div class="seyir-kutu"><span class="uc-ad">Önümüzdeki 90 gün</span>'+sparka+'</div>'+dl+tablo;
  const v2ic='<div class="resmi"><p class="resmi-ust"><span>Sayı: <b>2026/12-01</b></span><span>1 Aralık 2026</span></p><p class="resmi-ust"><span>Konu: <b>Kasım ayı mali durum raporu</b></span></p>'+
    '<p class="resmi-hitap">BAŞKANLIK MAKAMINA,</p><p class="resmi-metin">Kulübümüzün Kasım ayı sonundaki mali durumu aşağıda sunulmuştur. Şubat başındaki maaş gününde kasa yılın en düşük düzeyine iner; bilet gelirleri tahmindir.</p>'+
    uc+'<div class="seyir-kutu"><span class="uc-ad">Önümüzdeki 90 gün</span>'+sparka+'</div>'+dl+tablo+
    '<p class="resmi-kapanis">Bilgilerinize arz ederim.</p><div class="imza"><svg class="paraf" viewBox="0 0 120 40"><path d="M6 28c10-18 18-20 22-8s-6 16 2 6 14-22 20-14-4 18 6 12 18-16 26-10 6 10 14 2 16-8 18-6" fill="none" stroke="#2c3e7a" stroke-width="2.2" stroke-linecap="round"/></svg><b>Nusret Bey</b><small>Mali İşler Müdürü</small></div>'+
    '<span class="muhur">ALINDI<small>1.12.2026</small></span></div>';
  return krom+'<main class="sahne">'+kagit({kat:V===2?'Mali İşler Müdürlüğü':'Raporlar · Mali işler',ikon:'kasa',baslik:V===2?'Aylık mali rapor':'Aylık mali rapor · Kasım',alt:V===2?'':'Nusret Bey · 1 Aralık Salı 08:00',antet:'Mali İşler Müdürlüğü',genis:1,
    ic:V===2?v2ic:v1ic,eylem:'<button class="ikinci">'+ikon('mesaj',14)+'Müdüre sor</button><span class="bosluk"></span><button class="ikinci">‹ Ekim raporu</button><button class="ana" disabled>Kasım</button>'})+'</main>'+
    serit('Okurken zaman durur.','');
}
/* ---------------- oyuncu kartı ---------------- */
const ENGIN={id:'oyuncu-1',ad:'Engin',no:1,mevki:'KL',kulupId:'demirkapi',dogumTarihi:'2002-05-25',sac:'kisa',sacRenk:'#241a12',boy:1.07};
function kart(){
  const yuz=oyuncuPortreHtml(ENGIN,'kart-yuz',3,TARIH),son5=['G','B','M','G','B'];
  const kutu=son5.map(x=>'<i class="sonuc" data-s="'+x+'">'+x+'</i>').join('');
  const notlar=[['antrenman','24 Kas','Antrenman','Kalede güven veriyor; çıkışlarda kararlı.'],['mac','21 Kas','Maç','Akdeniz maçında iki önemli kurtarış.'],['hoca','18 Kas','Şükrü Hoca','“İlk yarıda dağınıktı ama toparlandı.”']];
  const not='<ol class="notlar">'+notlar.map(([t,g,k,m])=>'<li data-tur="'+t+'"><time>'+g+'</time><b>'+k+'</b><span>'+m+'</span></li>').join('')+'</ol>';
  const v1='<div class="kart-iki"><section class="kart-sol"><header class="kart-bas">'+yuz+'<div><p class="kart-ad"><b>Engin</b><span class="forma">1</span></p>'+
    '<p class="kunye"><span class="mevki" data-m="KL">Kaleci</span><span>24 yaş</span><span>1,93 m</span><span>Sağ ayak</span></p><p class="kunye">'+armaSvg('demirkapi','kucuk')+' Demirkapı SK</p></div></header>'+
    '<div class="sezon"><span class="uc-ad">Bu sezon</span><dl><dt>Maç</dt><dd>12</dd><dt>Dakika</dt><dd>1.080</dd><dt>Gol</dt><dd>0</dd><dt>Kart</dt><dd>0 / 0</dd></dl><div class="son5"><span class="uc-ad">Son beş</span>'+kutu+'</div></div>'+
    '<dl class="kv"><dt>Durum</dt><dd>Oynayabilir</dd><dt>Sözleşme</dt><dd>31 Mayıs 2028</dd><dt>Aylık</dt><dd>28.000 ₺</dd></dl></section>'+
    '<section class="kart-sag"><h2>'+ikon('not')+'Notlar</h2>'+not+'</section></div>';
  const v2='<div class="lisans"><div class="lisans-foto">'+yuz+'<span class="atas"></span></div><div class="lisans-alan">'+
    [['Adı','Engin'],['Forma','1'],['Mevki','Kaleci'],['Doğum','25 Mayıs 2002 (24)'],['Boy','1,93 m'],['Ayak','Sağ'],['Kulübü','Demirkapı SK'],['Sözleşme','31.05.2028 · aylık 28.000 ₺']].map(([a,b])=>'<p><span>'+a+'</span><b>'+yaz(b)+'</b></p>').join('')+
    '</div><span class="muhur muhur-mavi">DEMİRKAPI SK<small>LİSANSLI</small></span></div>'+
    '<div class="sezon"><span class="uc-ad">Bu sezon</span><dl><dt>Maç</dt><dd>12</dd><dt>Dakika</dt><dd>1.080</dd><dt>Gol</dt><dd>0</dd><dt>Kart</dt><dd>0 / 0</dd></dl><div class="son5"><span class="uc-ad">Son beş</span>'+kutu+'</div></div>'+
    '<section class="kart-sag sari-not"><h2>Notlar</h2>'+not+'</section>';
  return krom+'<main class="sahne">'+kagit({kat:V===2?'Futbolcu sicil fişi':'Kadro · Oyuncu dosyası',ikon:'takim',baslik:'Engin',antet:'Futbol Şubesi',genis:1,ic:V===2?v2:v1,
    eylem:'<button class="ikinci">‹ Kadro</button><span class="bosluk"></span><button class="ikinci">'+ikon('gozlem',14)+'Antrenmanda izle</button><button class="ana">'+ikon('mesaj',14)+'Hocaya sor</button>'})+'</main>'+serit('Okurken zaman durur.','');
}
/* ---------------- transfer: Pano · Liste · Ara · Geçmiş ---------------- */
function transfer(){
  const sek=['Pano','Liste','Ara','Geçmiş'].map((s,i)=>'<button role="tab" aria-selected="'+(i===2?'true':'false')+'">'+s+'</button>').join('');
  const L=[['Savunma',[['Tahsin',31,'Serbest · 12 aydır boşta','Hoca','Hava toplarında güçlü; hızlı forvete karşı zorlanır.'],['Kamil',21,'Kocadere İY · sözleşmesi Haziran\'da bitiyor','Menajer','“Avrupa\'dan teklif var.” (menajer abartır)']]],
    ['Orta saha',[['Serkan',23,'Serbest · 6 aydır boşta','Yardımcı','Pas açısı iyi; kondisyonu belirsiz.'],['Hasan',31,'Serbest','Basın','Eski yıldız; iki sezondur sakat.']]],
    ['Forvet',[['Yakup',32,'Serbest · 6 aydır boşta','Hoca','Ceza sahasında soğukkanlı; tempoya yetişemiyor.']]]];
  const liste=L.map(([m,O])=>'<section class="liste-grup"><h3>'+m+' <small>'+O.length+'</small></h3>'+O.map(([a,y,d,k,n])=>'<div class="liste-satir"><p><b>'+a+'</b> · '+y+' yaş <span class="kaynak" data-k="'+k+'">'+k+'</span></p><p class="liste-durum">'+yaz(d)+'</p><p class="liste-not">'+yaz(n)+'</p></div>').join('')+'</section>').join('');
  const ara='<div class="ara"><label class="ara-kutu">'+ikon('arama')+'<input value="sol bek" aria-label="Oyuncu ara"><kbd>Enter</kbd></label>'+
    '<div class="cipler"><button aria-pressed="true">Savunma</button><button aria-pressed="true">≤ 25 yaş</button><button>Sözleşmesi bitenler</button><button>Serbestler</button><button>Boy ≥ 1,80</button></div>'+
    '<table class="cizelge ara-sonuc"><thead><tr><th>Oyuncu</th><th>Kulüp</th><th class="sayi">Yaş</th><th class="sayi">Boy</th><th>Sözleşme</th><th></th></tr></thead><tbody>'+
    [['Kamil','Kocadere İY',21,'1,78','Haziran 2027'],['Taner','Yıldıztepe SK',23,'1,81','Haziran 2028'],['Emre','Akdeniz FK',19,'1,76','Haziran 2027']].map(([a,k,y,b,s])=>
      '<tr><td><b>'+a+'</b></td><td>'+k+'</td><td class="sayi">'+y+'</td><td class="sayi">'+b+'</td><td>'+s+'</td><td class="eylem-hucre"><button class="kucuk">Araştırt</button><button class="kucuk">'+ikon('menajer',12)+'Menajeri</button></td></tr>').join('')+
    '</tbody></table><p class="dipnot">Bildiğimiz kadarı: yaş, kulüp, boy, sözleşme bitişi kamuya açık. Ne kadar iyi olduğunu, isteyip istemediğini ve kaça geleceğini ancak araştırtınca ya da menajerine sorunca öğrenirsin.</p></div>';
  const ust='<div class="donem">'+ikon('takvim')+'<span><b>Kış transfer dönemi</b> · açılışa <b>34 gün</b> (4 Ocak)</span><span class="bosluk"></span><span>Kasa 4,82 milyon ₺</span></div>';
  const v2gelen='<div class="teleks"><span class="teleks-bas">TELEKS · 30 KAS 16:42</span>MENAJER C. URAL (TEST) / 4 OYUNCU / SAVUNMA 2 ORTA 1 FORVET 1 / ÖZGEÇMİŞLER ZARFTA / CEVAP BEKLENİR</div>';
  const ic=ust+'<nav class="sekmeler" role="tablist">'+sek+'</nav>'+(V===2?v2gelen:'')+'<div class="iki-sutun"><section>'+ara+'</section><section class="liste"><h2>'+ikon('transfer')+'Kısa liste</h2>'+liste+'</section></div>';
  return krom+'<main class="sahne">'+kagit({kat:V===2?'Transfer panosu':'Transfer',ikon:'transfer',baslik:V===2?'Transfer panosu':'Oyuncu ara',genis:1,ic,
    eylem:'<button class="ikinci">'+ikon('menajer',14)+'Menajerlere duyur</button><span class="bosluk"></span><button class="ana">'+ikon('arama',14)+'Hocaya araştırt</button>'})+'</main>'+serit('Okurken zaman durur.','');
}
/* ---------------- gün başı kâğıdı ---------------- */
function gunbasi(){
  const ajanda=[['11:00','Şükrü Hoca görüşmeye gelecek','kapı'],['15:00–17:00','Antrenman · yoğun çalışma','balkondan izlenebilir'],['Cuma 20:00','Değirmenaltı SK – Demirkapı SK','14. hafta']];
  const bek=[['Sponsor teklifi · Karaburun Lastik','Karar · 2 gün kaldı','kart'],['Hocanın isteği · savunmaya oyuncu','Fırsat · 4 gün','transfer']];
  const ic='<div class="gb">'+
    '<section class="gb-dun">'+ikon('mac')+'<div><span class="uc-ad">Pazar</span><p class="gb-skor">Demirkapı SK <b>3–3</b> Akdeniz FK</p><p>Ligde 5. sıradayız · Erdal üç gol attı.</p></div></section>'+
    '<section class="gb-bugun"><h2>'+ikon('takvim')+'Bugün</h2><ol>'+ajanda.map(([s,a,n])=>'<li><time>'+s+'</time><span>'+a+'</span><small>'+n+'</small></li>').join('')+'</ol></section>'+
    '<section class="gb-bekleyen"><h2>'+ikon('uyari')+'Cevap bekleyenler</h2><ul>'+bek.map(([a,n,i])=>'<li>'+ikon(i)+'<span>'+a+'</span><small>'+n+'</small></li>').join('')+'</ul></section>'+
    '<section class="gb-kasa">'+ikon('kasa')+'<div><span class="uc-ad">Kasa</span><b>4,82 milyon ₺</b><small>en düşük 3,96 milyon · 1 Şubat</small></div></section>'+
    '<section class="gb-manset">'+ikon('gazete')+'<div><span class="uc-ad">Gazete</span><p>“Karaova\'da hoca değişti”</p></div></section></div>';
  return krom+'<main class="sahne">'+kagit({kat:V===2?'Özel kalem':'Asistanın notu',ikon:'not',baslik:'Salı, 1 Aralık',alt:V===2?'Sekreter Ayla Hanım':'Ayla · 08:00',antet:'Başkanlık Özel Kalemi',ic,
    eylem:'<button class="ikinci">'+ikon('defter',14)+'Defteri aç</button><span class="bosluk"></span><button class="ana">Güne başla '+ikon('ilerle',14)+'</button>'})+'</main>'+serit('Yeni gün. Okurken zaman durur.','');
}
/* ---------------- simge seti ---------------- */
function simge(){
  const A=Object.keys(SIMGE_TANIM),ad={telefon:'Telefon',defter:'Defter',dosya:'Dosya',gazete:'Gazete',transfer:'Transfer',tv:'TV',kasa:'Kasa',takvim:'Takvim',mac:'Maç',sakatlik:'Sakatlık',kart:'Kart',arama:'Ara',menajer:'Menajer',not:'Not',saat:'Saat',uyari:'Uyarı',onay:'Onay',takim:'Takım',gozlem:'Gözlem',mesaj:'Mesaj',ilerle:'İlerle',kapat:'Kapat'};
  return krom+'<main class="sahne">'+kagit({kat:'Arayüz dili',ikon:'not',baslik:'Simgeler · 16 piksel, 1-bit',genis:1,ic:'<div class="simgeler">'+A.map(a=>'<figure>'+ikon(a,32)+ikon(a,16)+'<figcaption>'+ad[a]+'</figcaption></figure>').join('')+'</div>'+
    '<p class="dipnot">Kurallar: tek ızgara (16), tek çizgi (1 piksel), mürekkep rengi; simgenin yanında her zaman kelime; damga yalnız durum için (ALINDI, ÖDENDİ, TESCİL).</p>'})+'</main>'+serit('','');
}
document.getElementById('ekran').innerHTML=({mali,kart,transfer,gunbasi,simge}[S]||mali)();
