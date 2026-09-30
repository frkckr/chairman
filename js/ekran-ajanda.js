/* ============ Chairman — ajanda ekranı (yol haritası 2.1, 2.3, 2.4) ============
   Görüntü katmanı: kuralları js/ajanda.js ve js/mesele.js'ten çağırır, kariyeri kayıt deposundan yükler. Oyun bu ekranla açılır
   (ON_EKRAN.sayfa==='ajanda'); arkada stat donuk durur. Solda günün işleri ve seçili işin (ya da meselenin) ayrıntısı, sağda kulüp durumu,
   önümüzdeki günler ve meseleler; altta "İlerle". Maç işine gelinince ajanda kapanır, maç bülteni açılır.
   Üç soru kolay cevaplanmalı: kim ilgileniyor, ne bekliyorum, şimdi ne yapabilirim. Mesele ayrıntısı bunları üstte verir.
   Karar işlerinde (js/yonetim.js) seçenekler ayrıntıda listelenir; seçim yapılmadan katılınamaz. Gizli katkı seviyeleri gösterilmez.
   Bütün değişiklikler kayıt oturumu (js/kayit.js) üzerinden yapılır: komut kariyerin kopyasında uygulanır, kabul edilirse kaydedilir.
   Kayıt: her tamamlanan komuttan sonra 'oyun-1' yuvasına. Depo: masaüstü → tarayıcı → yalnız bellek. Tek istisna "Stada git": maç sonucu
   kariyere bağlı olmadığı için maç sınırında kayıt yapılmaz; sayfa yenilenirse son karardan devam edilir ve "Stada git" yeniden açılır.
   Kayıttan devam edilince "Kaldığın yer" özeti gösterilir. Lig bilgisi js/lig.js'teki sabit veridir. */
const AJANDA_EKRANI={depo:null,kariyer:null,oturum:null};
{
  const A=$('ajanda'),M=STIL.menu,YUVA='oyun-1',KULUP='demirkapi';
  for(const k in M)A.style.setProperty('--m-'+k,M[k]);
  {const h=parseInt(M.zemin.slice(1),16);A.style.setProperty('--m-ortuRenk','rgba('+(h>>16)+','+((h>>8)&255)+','+(h&255)+','+M.ortu+')');}
  const yaz=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const GUNLER=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const AYLAR=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const parca=t=>t.split('-').map(Number);
  const gunAdi=t=>{const [y,a,g]=parca(t);return GUNLER[new Date(Date.UTC(y,a-1,g)).getUTCDay()];};
  const tarihYazi=t=>{const [,a,g]=parca(t);return g+' '+AYLAR[a-1]+' '+gunAdi(t);};
  const tarihKisa=t=>{const [,a,g]=parca(t);return g+' '+AYLAR[a-1].slice(0,3)+' '+gunAdi(t).slice(0,3);};
  const tlYazi=kurus=>paraYazi(kurus).replace(/,\d\d ₺$/,' ₺');
  const ETIKET={zorunlu:'Zorunlu',ertelenebilir:'Ertelenebilir',istege:'İsteğe bağlı'};
  const DURUM={bekliyor:'',yapildi:'Yapıldı',kacirildi:'Kaçırıldı',ertelendi:'Ertelendi',tamamlandi:''};
  const ROL={baskan:'başkan',teknikDirektor:'teknik direktör',yonetici:'yönetici',eskiBaskan:'eski başkan'};

  /* ---- kayıt deposu ---- */
  let depo=null;
  try{depo=masaustuDeposu();if(depo)AJANDA_EKRANI.depo='masaustu';}catch(e){depo=null;}
  if(!depo){depo=tarayiciDeposu('chairman:');if(depo)AJANDA_EKRANI.depo='tarayici';}
  if(!depo){depo=bellekDeposu();AJANDA_EKRANI.depo='bellek';}

  let oturum=null,k=null,secili=null,seciliMesele=null,onay=null,mesaj='',bozukHata=null,yeniOnay=false,secimler={},donus=false;
  function yerlestir(o){oturum=o;k=o.kariyer;AJANDA_EKRANI.oturum=o;AJANDA_EKRANI.kariyer=k;}
  /* komut: kariyerin kopyasında uygulanır, geçerliyse kabul edilir ve kaydedilir (kaydetme:true ise kaydedilmez). Hata olursa kariyer değişmez */
  function komut(f,kaydetme){const s=oturum.uygula(f,kaydetme);k=oturum.kariyer;AJANDA_EKRANI.kariyer=k;return s;}
  const kayitHata=()=>!oturum.durum.tamam||AJANDA_EKRANI.depo==='bellek';
  function kayitYazi(){
    const d=oturum.durum,son=d.tarih?tarihKisa(d.tarih)+' '+saatYazi(d.dakika):null;
    if(!d.tamam)return'Kaydedilemedi: '+d.hata+' · karar uygulandı, kayıt bekliyor'+(son?' · son kayıt '+son:'');
    if(AJANDA_EKRANI.depo==='bellek')return'Kayıt yalnız bu oturumda: tarayıcı deposu kullanılamıyor';
    return son?(d.bekleyen?'Son kayıt · ':'Kaydedildi · ')+son:'Kayıt bekliyor';
  }
  function yeniKariyer(){
    yerlestir(kayitOturumu(depo,YUVA,kariyerOlustur(KARIYER_BASLANGIC),false));oturum.kaydet();
    secili=null;seciliMesele=null;onay=null;donus=false;secimler={};mesaj='Yeni kariyer başladı. Haftanın işleri ajandada.';
  }
  /* açılış: kayıt varsa devam, yoksa yeni kariyer; açılamayan kayda dokunulmaz */
  function baslat(){
    let y;
    try{y=kariyerYukle(depo,YUVA);}catch(e){y={tamam:false,bos:false,hata:e.message};}
    if(y.tamam){
      yerlestir(kayitOturumu(depo,YUVA,y.kariyer,y.kaynak==='ana'&&!y.gecisler.length));
      donus=k.gecmis.length>0;
      if(y.kaynak!=='ana')mesaj='Son kayıt açılamadı; '+(y.kaynak==='onceki'?'bir önceki sağlam kayıttan':'yarım kalan yazımın tamamlanmış kopyasından')+' devam ediliyor. '+y.uyarilar.join(' · ');
      else if(y.gecisler.length){oturum.kaydet();mesaj='Eski kayıt yeni biçime dönüştürüldü ('+y.gecisler.join(', ')+'); önceki kayıt yedek olarak saklandı.';}
    }else if(y.bos)yeniKariyer();
    else bozukHata=y.hata;
  }
  /* bozuk kayıt: üzerine yazmadan önce kopyasını saklar */
  function bozuguSaklaVeBasla(){
    for(const ad of [YUVA,YUVA+'.yeni',YUVA+'.onceki']){const m=depo.oku(ad);if(m!==null)depo.yaz(ad+'.bozuk',m);}
    bozukHata=null;yeniKariyer();
  }

  /* ---- yardımcılar ---- */
  const kisiYazi=id=>{const p=k.kisiler[id];return p?p.ad+' ('+(ROL[p.rol]||p.rol)+')':'';};
  const aralik=r=>r.saatsiz?'şimdi':saatYazi(r.saat)+(r.sure?'–'+saatYazi((r.saat+r.sure)%1440):'');
  const isAdi=x=>x.tur==='odeme'?x.veri.aciklama+' '+tlYazi(x.veri.tutar):isBasligi(k,x);
  const anYazi=(tarih,dakika,saatsiz)=>tarihKisa(tarih)+' '+(saatsiz?'en geç ':'')+saatYazi(dakika);
  const bugun=()=>ajandaGunu(k,k.tarih);
  const macIsi=()=>bugun().find(r=>r.durum==='bekliyor'&&r.eylem==='macGunu');
  function varsayilanSecim(){const s=bugun().filter(r=>r.tur==='ajanda');const b=s.find(r=>r.durum==='bekliyor');return b?b.id:s.length?s[s.length-1].id:null;}
  const panel=(baslik,ek,ic,sinif)=>'<section class="oe-panel'+(sinif?' '+sinif:'')+'"><h2>'+baslik+(ek?'<small>'+ek+'</small>':'')+'</h2>'+ic+'</section>';
  const baglanti=id=>k.meseleler&&k.meseleler[id]?'<p class="aj-not">Konu: <button type="button" class="aj-baglanti" data-mesele="'+id+'">'+yaz(k.meseleler[id].baslik)+'</button></p>':'';

  /* ---- bölümler ---- */
  function bugunPaneli(satirlar){
    const li=satirlar.map(r=>{
      const etiket=r.zorunluluk?'<span class="aj-etiket aj-'+r.zorunluluk+'">'+ETIKET[r.zorunluluk]+'</span>':'';
      const durum=DURUM[r.durum]?'<span class="aj-durum aj-d-'+r.durum+'">'+DURUM[r.durum]+'</span>':'';
      const bitti=r.durum!=='bekliyor'?' aj-bitti':'';
      if(r.tur!=='ajanda')return '<li class="aj-satir aj-takvim'+bitti+'"><span class="aj-saat">'+saatYazi(r.saat)+'</span><span class="aj-ad">'+yaz(r.baslik)+'</span>'+
        (r.tutar!==undefined?'<span class="aj-tutar'+(r.tutar<0?' aj-eksi':'')+'">'+tlYazi(r.tutar)+'</span>':'<span></span>')+'</li>';
      return '<li><button type="button" class="aj-satir'+bitti+'" data-is="'+r.id+'" data-durum="'+r.durum+'" aria-pressed="'+(r.id===secili&&!seciliMesele&&!donus&&r.durum!=='ertelendi'?'true':'false')+'">'+
        '<span class="aj-saat">'+aralik(r)+'</span><span class="aj-ad">'+yaz(r.baslik)+'</span><span class="aj-sag">'+(durum||etiket)+'</span></button></li>';
    }).join('');
    return panel('Bugün',yaz(tarihKisa(k.tarih)),'<ul class="aj-liste">'+(li||'<li class="aj-bos">Bugün için iş yok.</li>')+'</ul>','aj-p-bugun');
  }
  /* oyuna dönüş: son karar, beklenen haber, yaklaşan iş (donusOzeti kariyeri değiştirmez) */
  function donusAyrintisi(){
    const o=donusOzeti(k);
    let ic='<p class="aj-is-baslik"><b>Kaldığın yer</b> <span class="aj-not">'+yaz(tarihYazi(k.tarih)+' '+saatYazi(k.gunIciDakika))+'</span></p>';
    ic+=o.sonKarar?'<p class="aj-bilgi"><b>Son yaptığın</b> '+yaz(o.sonKarar.baslik)+(o.sonKarar.secimMetni?' — '+yaz(o.sonKarar.secimMetni):'')+'</p>':'<p class="aj-not">Henüz bir iş yapmadın.</p>';
    for(const b of o.beklenen)ic+='<p class="aj-bilgi"><b>'+yaz(b.durumAdi)+'</b> '+yaz(b.metin)+' <span class="aj-not">('+yaz(anYazi(b.tarih,b.dakika,b.saatsiz))+')</span></p>';
    if(o.yaklasan)ic+='<p class="aj-bilgi"><b>Yaklaşan</b> '+yaz(o.yaklasan.baslik)+' <span class="aj-not">('+yaz(anYazi(o.yaklasan.tarih,o.yaklasan.dakika,o.yaklasan.saatsiz))+')</span></p>';
    ic+='<div class="aj-dugmeler"><button type="button" class="aj-birincil" data-eylem="devam">Devam ▸</button></div>';
    return panel('Ayrıntı','','<div class="aj-ayrinti">'+ic+'</div>','aj-p-ayrinti');
  }
  /* meselenin dosyası: yürüten, bekleyen, şimdi yapılabilecek, geçmiş */
  function meseleAyrintisi(){
    const o=meseleOzeti(k,seciliMesele),m=o.mesele;
    let ic='<p class="aj-is-baslik"><b>'+yaz(m.baslik)+'</b> <span class="aj-etiket aj-m-'+m.durum+'">'+yaz(o.durumAdi)+'</span></p>';
    ic+='<p class="aj-not">Yürüten: '+(o.sorumlu?yaz(kisiYazi(o.sorumlu.id)):'—')+(o.kisiler.length?' · İlgili: '+o.kisiler.map(p=>yaz(p.ad)).join(', '):'')+'</p>';
    ic+=o.adimlar.length?'<p class="aj-bilgi"><b>Bekleyen</b> '+o.adimlar.map(a=>yaz(a.metin)+(a.tutar!==undefined?' '+yaz(tlYazi(a.tutar)):'')+' <span class="aj-not">('+yaz(anYazi(a.tarih,a.dakika,a.saatsiz))+')</span>').join(' · ')+'</p>'
      :'<p class="aj-not">Bekleyen adım kalmadı.</p>';
    if(o.karar)ic+='<p class="aj-bilgi"><b>Şimdi</b> Karar sende.</p><div class="aj-dugmeler"><button type="button" class="aj-birincil" data-eylem="kararAc" data-is="'+o.karar.isId+'">Kararı aç ▸</button></div>';
    else if(m.durum!=='kapandi')ic+='<p class="aj-bilgi"><b>Şimdi</b> Yapılacak bir şey yok; haber için ilerle.</p>';
    ic+='<ul class="aj-olaylar">'+o.olaylar.slice(-4).reverse().map(x=>'<li><span class="aj-saat">'+yaz(tarihKisa(x.tarih).split(' ').slice(0,2).join(' ')+' '+saatYazi(x.dakika))+'</span><span>'+yaz(x.metin)+'</span></li>').join('')+'</ul>';
    return panel('Mesele','','<div class="aj-ayrinti">'+ic+'</div>','aj-p-ayrinti');
  }
  function ayrintiPaneli(satirlar){
    if(donus)return donusAyrintisi();
    if(seciliMesele)return meseleAyrintisi();
    const r=satirlar.find(x=>x.id===secili&&x.durum!=='ertelendi');
    if(!r)return panel('Ayrıntı','','<div class="aj-ayrinti"><p class="aj-not">Bir iş seç.</p></div>','aj-p-ayrinti');
    const is=k.isler[r.id],v=is?is.veri:null;
    let ic='<p class="aj-is-baslik"><b>'+yaz(r.baslik)+'</b> '+(r.zorunluluk?'<span class="aj-etiket aj-'+r.zorunluluk+'">'+ETIKET[r.zorunluluk]+'</span>':'')+'</p>'+
      '<p class="aj-not">'+aralik(r)+(r.sure?' · '+r.sure+' dk':'')+(r.saatsiz?' · en geç '+saatYazi(r.sonCevap.dakika):'')+(v&&v.kisiId?' · '+yaz(kisiYazi(v.kisiId)):'')+(v&&v.sonTarih?' · en geç '+yaz(tarihKisa(v.sonTarih)):'')+'</p>';
    if(v)ic+='<p>'+yaz(v.aciklama)+'</p>';
    if(r.meseleId)ic+=baglanti(r.meseleId);
    if(r.durum==='yapildi'){
      if(r.secimMetni)ic+='<p class="aj-bilgi"><b>Kararın</b> '+yaz(r.secimMetni)+'</p>';
      ic+=r.bilgi?'<p class="aj-bilgi"><b>'+(r.secimMetni?'Sonuç':'Öğrendiklerin')+'</b> '+yaz(r.bilgi)+'</p>':'<p class="aj-not">Yapıldı.</p>';
    }
    if(r.durum==='kacirildi')ic+='<p class="aj-uyari">Bu işe katılmadın; kaçırıldı.</p>';
    if(r.durum==='bekliyor'&&v){
      const secim=secimler[r.id],o=ajandaOnizle(k,r.id,secim);
      /* karar işi: seçenekler; seçim katılımda uygulanır */
      if(o.secenekler.length)ic+='<ul class="aj-secenekler">'+o.secenekler.map(s=>'<li><button type="button" class="aj-secenek" data-eylem="sec" data-is="'+r.id+'" data-secim="'+yaz(s.id)+'" aria-pressed="'+(s.id===secim?'true':'false')+'"'+(s.engel?' disabled':'')+'>'+
        '<b>'+yaz(s.metin)+'</b>'+(s.sure!==undefined?' <small>'+s.sure+' dk</small>':'')+(s.engel?' <small class="aj-uyari">'+yaz(s.engel)+'</small>':'')+'</button>'+
        (s.aciklama||[]).filter(Boolean).map(a=>'<small>'+yaz(a)+'</small>').join('')+'</li>').join('')+'</ul>';
      for(const e of o.engel)ic+='<p class="aj-uyari">'+yaz(e)+'</p>';
      if(o.atlanacak.length)ic+='<p class="aj-uyari">Bu işe gidersen kaçırılacak: '+o.atlanacak.map(x=>yaz(x.veri.baslik+' ('+saatYazi(x.dakika)+')')).join(', ')+'</p>';
      if(o.gerceklesecek.length)ic+='<p class="aj-not">Bu arada: '+o.gerceklesecek.map(x=>yaz(isAdi(x))).join(' · ')+'</p>';
      const mac=v.eylem==='macGunu',beklet=o.atlanacak.length&&onay!=='yap:'+r.id,sonAralik=saatYazi(r.saat)+(o.sure?'–'+saatYazi((r.saat+o.sure)%1440):'');
      let d='';
      if(onay==='yap:'+r.id)d+='<button type="button" class="aj-birincil" data-eylem="yap" data-is="'+r.id+'">Onayla ▸</button><button type="button" data-eylem="vazgec">Vazgeç</button>';
      else d+='<button type="button" class="aj-birincil" data-eylem="'+(beklet?'yapSor':'yap')+'" data-is="'+r.id+'"'+(o.engel.length||o.secimGerekli?' disabled':'')+'>'+
        (mac?'Stada git ▸':o.secimGerekli?'Önce bir seçenek seç':(o.secenekler.length?'Karar ver ▸ ':'Katıl ▸ ')+sonAralik)+'</button>';
      if(v.zorunluluk==='ertelenebilir'){const t=ertelemeTarihi(is);
        d+='<button type="button" data-eylem="ertele" data-is="'+r.id+'"'+(t?'':' disabled')+'>'+(t?'Ertele → '+yaz(tarihKisa(t)):'Ertelenemez: son gün')+'</button>';}
      ic+='<div class="aj-dugmeler">'+d+'</div>';
    }
    return panel('Ayrıntı','','<div class="aj-ayrinti">'+ic+'</div>','aj-p-ayrinti');
  }
  function kulupPaneli(){
    const d=kulupDurumu(k,KULUP),m=d.mali,T=puanDurumu(LIG),sira=T.findIndex(t=>t.id===KULUP)+1,satir=T.find(t=>t.id===KULUP);
    const form=(LIG.sonMaclar[KULUP]||[]).map(x=>{const s=macSonucu(x);return '<b class="oe-f oe-'+s+'">'+s+'</b>';}).join('');
    const dd=(ad,deger,sinif)=>'<dt>'+ad+'</dt><dd'+(sinif?' class="'+sinif+'"':'')+'>'+deger+'</dd>';
    return panel('Kulüp durumu',yaz(d.kulup.ad),'<dl class="aj-dl">'+
      dd('Kasadaki para',tlYazi(m.nakit),'aj-vurgu')+
      dd('Bekleyen gelir',tlYazi(m.bekleyenGelir))+
      dd('Bekleyen gider',tlYazi(m.bekleyenGider),m.bekleyenGider<0?'aj-eksi':'')+
      dd('Ödemelerden sonra',tlYazi(m.odemelerSonrasi))+
      dd('Lig',yaz(LIG.ad+' · '+sira+'. sıra · '+satir.P+' puan'))+
      dd('Son maçlar','<span class="oe-form">'+form+'</span>')+
      dd('Teknik direktör',d.hoca?yaz(d.hoca.ad):'—')+
      (d.yonetim?Object.entries(d.yonetim).map(([x,p])=>dd(yaz(YONETIM_KOLTUKLARI[x].ad),p?yaz(p.ad):'boş',p?'':'aj-eksi')).join('')
        :dd('Yönetim',yaz(d.yoneticiler.map(p=>p.ad).join(', ')||'—')))+
      '</dl><p class="aj-dipnot">Lig bilgisi sabit örnek veridir; maç sonuçları kariyere Aşama 3\'te bağlanacak.</p>');
  }
  function yaklasanPaneli(){
    const L=yaklasanlar(k,7).slice(0,7).map(x=>'<li class="aj-satir aj-takvim"><span class="aj-saat">'+yaz(tarihKisa(x.tarih))+'</span><span class="aj-ad">'+
      saatYazi(x.dakika)+' '+yaz(isAdi(x))+'</span>'+(x.tur==='ajanda'?'<span class="aj-etiket aj-'+x.veri.zorunluluk+'">'+ETIKET[x.veri.zorunluluk][0]+'</span>':'<span></span>')+'</li>').join('');
    return panel('Önümüzdeki günler','7 gün','<ul class="aj-liste">'+(L||'<li class="aj-bos">Planlı iş yok.</li>')+'</ul>');
  }
  /* meseleler: kim yürütüyor ve durum bir bakışta; yeni haber işaretli */
  function mesellerPaneli(){
    const L=meseleListesi(k);
    const li=L.map(m=>{const o=meseleOzeti(k,m.id);
      return '<li><button type="button" class="aj-satir aj-mesele'+(m.durum==='kapandi'?' aj-bitti':'')+'" data-mesele="'+m.id+'" aria-pressed="'+(m.id===seciliMesele&&!donus?'true':'false')+'">'+
        '<span class="aj-saat aj-m-'+m.durum+'">'+yaz(o.durumAdi)+'</span><span class="aj-ad">'+yaz(m.baslik)+'</span><span class="aj-sag">'+(o.yeni>0?'<span class="aj-yeni">Yeni</span>':'')+'</span></button></li>';}).join('');
    return panel('Meseleler',L.filter(m=>m.durum!=='kapandi').length+' açık','<ul class="aj-liste">'+(li||'<li class="aj-bos">Henüz bir mesele yok.</li>')+'</ul>','aj-p-olay');
  }
  /* sıradaki durak: nereye gidilecek ve nedeni */
  function durakYazi(o){
    const t=anTarih(o.hedef),an=tarihKisa(t.tarih)+' '+saatYazi(t.dakika);
    return an+(o.durak?' · '+o.durak.veri.baslik:o.neden==='cakisma'?' · günün işleri çakışıyor, seçim gerekecek':' · bekleyen rutin işler');
  }
  function altSerit(){
    const mac=macIsi();
    let durum,dugme;
    if(mac){
      const o=ajandaOnizle(k,mac.id);
      durum=o.engel.length?o.engel.join(' · '):'Maç '+saatYazi(mac.saat)+'\'da. Stada gidince maç günü başlar; maç sonucu kariyere henüz işlenmiyor (Aşama 3).'+(o.atlanacak.length?' Kaçırılacak: '+o.atlanacak.map(x=>x.veri.baslik).join(', ')+'.':'');
      dugme=onay==='yap:'+mac.id?'<button type="button" data-eylem="vazgec">Vazgeç</button><button type="button" class="aj-ana" data-eylem="yap" data-is="'+mac.id+'">Onayla ▸</button>'
        :'<button type="button" class="aj-ana" data-eylem="'+(o.atlanacak.length?'yapSor':'yap')+'" data-is="'+mac.id+'"'+(o.engel.length?' disabled':'')+'>Stada git ▸</button>';
    }else{
      const o=ilerleOnizle(k),p=[];
      if(o.engel.length)p.push('İlerlenemiyor: '+o.engel.join(' · '));
      else{
        p.push('Sıradaki durak: '+durakYazi(o));
        if(o.tasinacak.length)p.push('Ertesi güne kalacak: '+o.tasinacak.map(x=>x.veri.baslik).join(', '));
        if(o.kacirilacak.length)p.push('Kaçırılacak: '+o.kacirilacak.map(x=>x.veri.baslik).join(', '));
        if(o.gerceklesecek.length)p.push('Bu arada: '+o.gerceklesecek.map(isAdi).join(' · '));
      }
      durum=p.join(' · ');
      const sor=o.kacirilacak.length&&onay!=='ilerle';
      dugme=onay==='ilerle'?'<button type="button" data-eylem="vazgec">Vazgeç</button><button type="button" class="aj-ana" data-eylem="ilerle">Onayla ▸</button>'
        :'<button type="button" class="aj-ana" data-eylem="'+(sor?'ilerleSor':'ilerle')+'"'+(o.engel.length?' disabled':'')+'>İlerle ▸</button>';
    }
    const yeni=yeniOnay?'<button type="button" class="aj-kucuk aj-tehlike" data-eylem="yeniEvet">Evet, Pazartesiden baştan başla</button><button type="button" class="aj-kucuk" data-eylem="yeniHayir">Vazgeç</button>'
      :'<button type="button" class="aj-kucuk" data-eylem="yeniSor" title="Kariyeri Pazartesi sabahından yeniden başlat">Yeni kariyer</button>'+
        (oturum.durum.tamam?'':'<button type="button" class="aj-kucuk aj-tehlike" data-eylem="kayitDene">Yeniden kaydet</button>');
    return '<footer class="aj-alt">'+yeni+'<p class="aj-altDurum" aria-live="polite">'+yaz(durum)+'</p>'+dugme+'</footer>';
  }

  function ciz(odak){
    if(bozukHata){
      A.innerHTML='<header class="oe-ust"><span>Ajanda</span><span class="aj-hata">Kayıt açılamadı</span></header>'+
        '<div class="aj-bozuk"><p>Kayıtlı kariyer açılamadı. Kayıt dosyasına dokunulmadı.</p><p class="aj-not">'+yaz(bozukHata)+'</p>'+
        '<p>Yeni kariyer başlatırsan açılamayan kayıt “.bozuk” uzantısıyla ayrıca saklanır.</p>'+
        '<div class="aj-dugmeler"><button type="button" class="aj-birincil" data-eylem="bozukYeni">Kaydı sakla, yeni kariyer başlat</button></div></div>';
      return;
    }
    if(!seciliMesele&&(!secili||!bugun().some(r=>r.id===secili)))secili=varsayilanSecim();
    const satirlar=bugun(),b=k.kisiler[k.baskanId];
    A.innerHTML='<header class="oe-ust"><span>Ajanda · '+yaz(k.kulupler[KULUP].ad)+' · Başkan '+yaz(b?b.ad:'')+'</span>'+
      '<span class="'+(kayitHata()?'aj-hata':'')+'">'+yaz(kayitYazi())+'</span></header>'+
      '<div class="aj-bas"><div class="aj-tarih">'+yaz(tarihYazi(k.tarih))+'<small>'+parca(k.tarih)[0]+'</small></div>'+
      '<p class="aj-mesaj" aria-live="polite">'+yaz(mesaj)+'</p><div class="aj-saatBuyuk" title="Okurken ve düşünürken zaman durur">'+saatYazi(k.gunIciDakika)+'</div></div>'+
      '<div class="aj-govde"><div class="aj-kol">'+bugunPaneli(satirlar)+ayrintiPaneli(satirlar)+'</div>'+
      '<div class="aj-kol">'+kulupPaneli()+yaklasanPaneli()+mesellerPaneli()+'</div></div>'+altSerit();
    const f=odak&&A.querySelector(odak);if(f&&!f.disabled)f.focus({preventScroll:true});
  }

  /* ---- eylemler ---- */
  function hataGoster(e){mesaj=e.message;onay=null;ciz();}
  function isiYap(id){
    const is=k.isler[id];if(!is)return;
    const baslik=is.veri.baslik,mac=is.veri.eylem==='macGunu',bas=saatYazi(is.dakika),saatsiz=!!is.veri.saatsiz;
    try{komut(x=>ajandaIsiYap(x,id,secimler[id]),mac);}catch(e){hataGoster(e);return;}
    onay=null;
    if(k.isler[id]){
      /* yolda karar gerektiren bir haber geldi: iş yerinde bekliyor, o ana kadarki ilerleme geçerli */
      if(mac)oturum.kaydet();
      secili=null;seciliMesele=null;
      mesaj=baslik+' için yola çıktın; yolda karar gerektiren bir haber geldi. İş bekliyor.';soyle(mesaj);ciz();return;
    }
    secili=id;seciliMesele=null;delete secimler[id];
    if(mac){A.hidden=true;ON_EKRAN.bulteniAc();return;}
    mesaj=baslik+' ('+(saatsiz?'karar':bas)+') tamamlandı.';
    soyle(mesaj);ciz('button.aj-satir[data-is="'+id+'"]');
  }
  /* ilerlemenin kısa özeti: neden durdu, arada ne işlendi */
  function ilerleOzeti(r){
    const p=[];
    for(const g of r.biten){
      if(g.isTuru==='odeme'){const h=k.hareketler.find(x=>x.id===g.sonuc.hareketId);if(h)p.push(h.aciklama+' '+tlYazi(h.tutar));}
      else if(g.isTuru==='ekip'&&g.sonuc&&g.sonuc.bilgi)p.push(g.sonuc.bilgi);
      else if(g.isTuru==='ajanda'&&g.sonuc&&g.sonuc.durum==='kacirildi')p.push(g.sonuc.baslik+' kaçırıldı');
      else if(g.isTuru==='hatirlatma'&&g.sonuc)p.push(g.sonuc.metin);
    }
    const bas=r.neden==='karar'?'Karar gerektiren bir haber geldi.':r.neden==='randevu'?'Sıradaki randevuya gelindi.':r.neden==='cakisma'?'Günün işleri çakışıyor; seçim yap.':'Bekleyen rutin işler işlendi.';
    return tarihKisa(k.tarih)+' '+saatYazi(k.gunIciDakika)+' · '+bas+(p.length?' '+p.join(' · '):'');
  }
  function ilerleEylem(){
    let r;
    try{r=komut(x=>duragaIlerle(x));}catch(e){hataGoster(e);return;}
    onay=null;secili=null;
    mesaj=ilerleOzeti(r);
    soyle(mesaj);ciz('.aj-ana');
  }
  A.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    const id=b.dataset.is,ey=b.dataset.eylem,ms=b.dataset.mesele;
    if(ey==='devam'){donus=false;ciz('.aj-ana');return;}
    donus=false;
    if(!ey&&ms){
      seciliMesele=ms;secili=null;onay=null;
      try{if(meseleOzeti(k,ms).yeni>0)komut(x=>meseleGoruldu(x,ms));}catch(x){hataGoster(x);return;}
      ciz('button.aj-mesele[data-mesele="'+ms+'"]');return;
    }
    if(!ey&&id){secili=id;seciliMesele=null;onay=null;ciz('button.aj-satir[data-is="'+id+'"]');return;}
    if(ey==='yap')isiYap(id);
    else if(ey==='sec'){secimler[id]=b.dataset.secim;onay=null;ciz('[data-eylem="sec"][data-secim="'+b.dataset.secim+'"]');}
    else if(ey==='kararAc'){secili=id;seciliMesele=null;onay=null;ciz('[data-eylem="sec"]');}
    else if(ey==='yapSor'){onay='yap:'+id;secili=k.isler[id]&&k.isler[id].veri.eylem==='macGunu'?secili:id;ciz('[data-eylem="yap"]');}
    else if(ey==='ertele'){try{const t=komut(x=>ajandaErtele(x,id));mesaj=k.gecmis[k.gecmis.length-1].baslik+' '+tarihYazi(t)+' gününe ertelendi.';secili=null;onay=null;soyle(mesaj);ciz();}catch(x){hataGoster(x);}}
    else if(ey==='ilerleSor'){onay='ilerle';ciz('[data-eylem="ilerle"]');}
    else if(ey==='ilerle')ilerleEylem();
    else if(ey==='kayitDene'){const s=oturum.kaydet();mesaj=s.tamam?'Kayıt yazıldı.':'Kayıt yine yazılamadı.';ciz('.aj-ana');}
    else if(ey==='vazgec'){onay=null;ciz();}
    else if(ey==='yeniSor'){yeniOnay=true;ciz('[data-eylem="yeniHayir"]');}
    else if(ey==='yeniHayir'){yeniOnay=false;ciz();}
    else if(ey==='yeniEvet'){yeniOnay=false;yeniKariyer();ciz('.aj-ana');}
    else if(ey==='bozukYeni'){bozuguSaklaVeBasla();ciz('.aj-ana');}
  });

  if(ON_EKRAN.sayfa==='ajanda'){baslat();A.hidden=false;ciz('.aj-ana');soyle('Ajanda: günün işlerini seç, hazır olunca ilerle. Okurken zaman durur.');}
  else A.hidden=true;
}
