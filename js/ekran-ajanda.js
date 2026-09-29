/* ============ Chairman — ajanda ekranı (yol haritası 2.1) ============
   Görüntü katmanı: kuralları js/ajanda.js'ten çağırır, kariyeri kayıt deposundan yükler. Oyun bu ekranla açılır
   (ON_EKRAN.sayfa==='ajanda'); arkada stat donuk durur. Solda günün işleri ve seçili işin ayrıntısı, sağda kulüp durumu,
   önümüzdeki günler ve son olaylar; altta günü bitirme. Maç işine gelinince ajanda kapanır, maç bülteni açılır.
   Karar işlerinde (js/yonetim.js) seçenekler ayrıntıda listelenir; seçim yapılmadan katılınamaz. Gizli katkı seviyeleri gösterilmez.
   Kayıt: gün sınırında (günü bitirince, yeni kariyerde) 'oyun-1' yuvasına. Depo: masaüstü → tarayıcı → yalnız bellek.
   Maç sınırında kayıt yoktur: sayfa yenilenirse son gün başından devam edilir. Lig bilgisi js/lig.js'teki sabit veridir. */
const AJANDA_EKRANI={depo:null,kariyer:null};
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

  let k=null,secili=null,onay=null,mesaj='',kayitYazi='',kayitHata=false,bozukHata=null,yeniOnay=false,secimler={};
  function kaydet(){
    const s=kariyerKaydet(depo,YUVA,k);
    kayitHata=!s.tamam;
    kayitYazi=s.tamam?'Kaydedildi · '+tarihKisa(k.tarih)+' '+saatYazi(k.gunIciDakika):'Kaydedilemedi: '+s.hata;
    if(s.tamam&&AJANDA_EKRANI.depo==='bellek')kayitYazi='Kayıt yalnız bu oturumda: tarayıcı deposu kullanılamıyor';
  }
  function yeniKariyer(){k=kariyerOlustur(KARIYER_BASLANGIC);AJANDA_EKRANI.kariyer=k;secili=null;onay=null;mesaj='Yeni kariyer başladı. Haftanın işleri ajandada.';kaydet();}
  /* açılış: kayıt varsa devam, yoksa yeni kariyer; açılamayan kayda dokunulmaz */
  function baslat(){
    let y;
    try{y=kariyerYukle(depo,YUVA);}catch(e){y={tamam:false,bos:false,hata:e.message};}
    if(y.tamam){
      k=y.kariyer;AJANDA_EKRANI.kariyer=k;
      kayitYazi='Kayıttan devam · '+tarihKisa(k.tarih)+' '+saatYazi(k.gunIciDakika);
      if(y.kaynak!=='ana'){kayitHata=true;mesaj='Son kayıt açılamadı; '+(y.kaynak==='onceki'?'bir önceki sağlam kayıttan':'yarım kalan yazımın tamamlanmış kopyasından')+' devam ediliyor. '+y.uyarilar.join(' · ');}
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
  const aralik=r=>saatYazi(r.saat)+(r.sure?'–'+saatYazi((r.saat+r.sure)%1440):'');
  const isAdi=x=>x.tur==='ajanda'?x.veri.baslik:x.tur==='odeme'?x.veri.aciklama+' '+tlYazi(x.veri.tutar):x.tur==='hatirlatma'?x.veri.metin:x.tur;
  const bugun=()=>ajandaGunu(k,k.tarih);
  const macIsi=()=>bugun().find(r=>r.durum==='bekliyor'&&r.eylem==='macGunu');
  function varsayilanSecim(){const s=bugun().filter(r=>r.tur==='ajanda');const b=s.find(r=>r.durum==='bekliyor');return b?b.id:s.length?s[s.length-1].id:null;}
  const panel=(baslik,ek,ic,sinif)=>'<section class="oe-panel'+(sinif?' '+sinif:'')+'"><h2>'+baslik+(ek?'<small>'+ek+'</small>':'')+'</h2>'+ic+'</section>';

  /* ---- bölümler ---- */
  function bugunPaneli(satirlar){
    const li=satirlar.map(r=>{
      const etiket=r.zorunluluk?'<span class="aj-etiket aj-'+r.zorunluluk+'">'+ETIKET[r.zorunluluk]+'</span>':'';
      const durum=DURUM[r.durum]?'<span class="aj-durum aj-d-'+r.durum+'">'+DURUM[r.durum]+'</span>':'';
      const bitti=r.durum!=='bekliyor'?' aj-bitti':'';
      if(r.tur!=='ajanda')return '<li class="aj-satir aj-takvim'+bitti+'"><span class="aj-saat">'+saatYazi(r.saat)+'</span><span class="aj-ad">'+yaz(r.baslik)+'</span>'+
        (r.tutar!==undefined?'<span class="aj-tutar'+(r.tutar<0?' aj-eksi':'')+'">'+tlYazi(r.tutar)+'</span>':'<span></span>')+'</li>';
      return '<li><button type="button" class="aj-satir'+bitti+'" data-is="'+r.id+'" data-durum="'+r.durum+'" aria-pressed="'+(r.id===secili&&r.durum!=='ertelendi'?'true':'false')+'">'+
        '<span class="aj-saat">'+aralik(r)+'</span><span class="aj-ad">'+yaz(r.baslik)+'</span><span class="aj-sag">'+(durum||etiket)+'</span></button></li>';
    }).join('');
    return panel('Bugün',yaz(tarihKisa(k.tarih)),'<ul class="aj-liste">'+(li||'<li class="aj-bos">Bugün için iş yok.</li>')+'</ul>','aj-p-bugun');
  }
  function ayrintiPaneli(satirlar){
    const r=satirlar.find(x=>x.id===secili&&x.durum!=='ertelendi');
    if(!r)return panel('Ayrıntı','','<div class="aj-ayrinti"><p class="aj-not">Bir iş seç.</p></div>','aj-p-ayrinti');
    const is=k.isler[r.id],v=is?is.veri:null;
    let ic='<p class="aj-is-baslik"><b>'+yaz(r.baslik)+'</b> '+(r.zorunluluk?'<span class="aj-etiket aj-'+r.zorunluluk+'">'+ETIKET[r.zorunluluk]+'</span>':'')+'</p>'+
      '<p class="aj-not">'+aralik(r)+(r.sure?' · '+r.sure+' dk':'')+(v&&v.kisiId?' · '+yaz(kisiYazi(v.kisiId)):'')+(v&&v.sonTarih?' · en geç '+yaz(tarihKisa(v.sonTarih)):'')+'</p>';
    if(v)ic+='<p>'+yaz(v.aciklama)+'</p>';
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
  function olayYazi(g){
    if(g.tur==='erteleme')return yaz(g.baslik)+' → '+yaz(tarihKisa(g.yeni))+(g.otomatik?' (gün bitince)':'');
    if(g.tur==='iptal')return yaz(g.baslik)+' — iptal: '+yaz(g.neden);
    const r=g.sonuc||{};
    if(g.isTuru==='ajanda')return yaz(r.baslik)+' — '+(r.durum==='yapildi'?(r.secimMetni?yaz(r.secimMetni):'yapıldı'):'kaçırıldı');
    if(g.isTuru==='odeme'){const h=k.hareketler.find(x=>x.id===r.hareketId);return h?yaz(h.aciklama)+' <span class="'+(h.tutar<0?'aj-eksi':'')+'">'+tlYazi(h.tutar)+'</span>':'Ödeme';}
    return yaz(r.metin||g.isTuru);
  }
  function olayPaneli(){
    /* ajanda işi kendi saatiyle gösterilir (kaçırılan iş takvimde bir dakika sonra kapanır) */
    const an=g=>g.isTuru==='ajanda'&&g.sonuc?[g.sonuc.gun,g.sonuc.saat]:[g.tarih,g.dakika];
    const L=k.gecmis.slice(-6).reverse().map(g=>{const [t,d]=an(g);return '<li class="aj-satir aj-takvim"><span class="aj-saat">'+yaz(tarihKisa(t).split(' ').slice(0,2).join(' '))+' '+saatYazi(d)+'</span><span class="aj-ad">'+olayYazi(g)+'</span><span></span></li>';}).join('');
    return panel('Son olaylar','','<ul class="aj-liste">'+(L||'<li class="aj-bos">Henüz bir şey olmadı.</li>')+'</ul>','aj-p-olay');
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
      const o=gunuBitirOnizle(k),parca=[];
      if(o.engel.length)parca.push('Gün bitmiyor: '+o.engel.join(' · '));
      else{
        if(o.tasinacak.length)parca.push('Ertesi güne kalacak: '+o.tasinacak.map(x=>x.veri.baslik).join(', '));
        if(o.kacirilacak.length)parca.push('Kaçırılacak: '+o.kacirilacak.map(x=>x.veri.baslik).join(', '));
        if(o.gerceklesecek.length)parca.push('Bu arada: '+o.gerceklesecek.map(isAdi).join(' · '));
        if(!parca.length)parca.push('Günün işleri tamam. Günü bitirince oyun kaydedilir.');
      }
      durum=parca.join(' · ');
      const sor=o.kacirilacak.length&&onay!=='gun';
      dugme=onay==='gun'?'<button type="button" data-eylem="vazgec">Vazgeç</button><button type="button" class="aj-ana" data-eylem="gunuBitir">Onayla ▸</button>'
        :'<button type="button" class="aj-ana" data-eylem="'+(sor?'gunSor':'gunuBitir')+'"'+(o.engel.length?' disabled':'')+'>Günü bitir ▸</button>';
    }
    const yeni=yeniOnay?'<button type="button" class="aj-kucuk aj-tehlike" data-eylem="yeniEvet">Evet, Pazartesiden baştan başla</button><button type="button" class="aj-kucuk" data-eylem="yeniHayir">Vazgeç</button>'
      :'<button type="button" class="aj-kucuk" data-eylem="yeniSor" title="Kariyeri Pazartesi sabahından yeniden başlat">Yeni kariyer</button>';
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
    if(!secili||!bugun().some(r=>r.id===secili))secili=varsayilanSecim();
    const satirlar=bugun(),b=k.kisiler[k.baskanId];
    A.innerHTML='<header class="oe-ust"><span>Ajanda · '+yaz(k.kulupler[KULUP].ad)+' · Başkan '+yaz(b?b.ad:'')+'</span>'+
      '<span class="'+(kayitHata?'aj-hata':'')+'">'+yaz(kayitYazi)+'</span></header>'+
      '<div class="aj-bas"><div class="aj-tarih">'+yaz(tarihYazi(k.tarih))+'<small>'+parca(k.tarih)[0]+'</small></div>'+
      '<p class="aj-mesaj" aria-live="polite">'+yaz(mesaj)+'</p><div class="aj-saatBuyuk">'+saatYazi(k.gunIciDakika)+'</div></div>'+
      '<div class="aj-govde"><div class="aj-kol">'+bugunPaneli(satirlar)+ayrintiPaneli(satirlar)+'</div>'+
      '<div class="aj-kol">'+kulupPaneli()+yaklasanPaneli()+olayPaneli()+'</div></div>'+altSerit();
    const f=odak&&A.querySelector(odak);if(f&&!f.disabled)f.focus({preventScroll:true});
  }

  /* ---- eylemler ---- */
  function hataGoster(e){mesaj=e.message;onay=null;ciz();}
  function isiYap(id){
    const is=k.isler[id];if(!is)return;
    const baslik=is.veri.baslik,mac=is.veri.eylem==='macGunu',bas=saatYazi(is.dakika);
    try{ajandaIsiYap(k,id,secimler[id]);}catch(e){hataGoster(e);return;}
    onay=null;secili=id;delete secimler[id];
    if(mac){A.hidden=true;ON_EKRAN.bulteniAc();return;}
    mesaj=baslik+' ('+bas+') tamamlandı.';
    soyle(mesaj);ciz('button.aj-satir[data-is="'+id+'"]');
  }
  function gunBitir(){
    const eski=k.tarih;
    try{gunuBitir(k);}catch(e){hataGoster(e);return;}
    onay=null;secili=null;kaydet();
    mesaj=gunAdi(eski)+' bitti. Yeni gün: '+tarihYazi(k.tarih)+'.';
    soyle(mesaj);ciz('.aj-ana');
  }
  A.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    const id=b.dataset.is,ey=b.dataset.eylem;
    if(!ey&&id){secili=id;onay=null;ciz('button.aj-satir[data-is="'+id+'"]');return;}
    if(ey==='yap')isiYap(id);
    else if(ey==='sec'){secimler[id]=b.dataset.secim;onay=null;ciz('[data-eylem="sec"][data-secim="'+b.dataset.secim+'"]');}
    else if(ey==='yapSor'){onay='yap:'+id;secili=k.isler[id]&&k.isler[id].veri.eylem==='macGunu'?secili:id;ciz('[data-eylem="yap"]');}
    else if(ey==='ertele'){try{const t=ajandaErtele(k,id);mesaj=k.gecmis[k.gecmis.length-1].baslik+' '+tarihYazi(t)+' gününe ertelendi.';secili=null;onay=null;soyle(mesaj);ciz();}catch(x){hataGoster(x);}}
    else if(ey==='gunSor'){onay='gun';ciz('[data-eylem="gunuBitir"]');}
    else if(ey==='gunuBitir')gunBitir();
    else if(ey==='vazgec'){onay=null;ciz();}
    else if(ey==='yeniSor'){yeniOnay=true;ciz('[data-eylem="yeniHayir"]');}
    else if(ey==='yeniHayir'){yeniOnay=false;ciz();}
    else if(ey==='yeniEvet'){yeniOnay=false;yeniKariyer();ciz('.aj-ana');}
    else if(ey==='bozukYeni'){bozuguSaklaVeBasla();ciz('.aj-ana');}
  });

  if(ON_EKRAN.sayfa==='ajanda'){baslat();A.hidden=false;ciz('.aj-ana');soyle('Ajanda: günün işlerini seç, bitince günü bitir.');}
  else A.hidden=true;
}
