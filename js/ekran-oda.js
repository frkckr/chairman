/* ============ Chairman — oda ekranı: başkan odasında telefon, ajanda ve dosya (yol haritası 2.5) ============
   Görüntü katmanı. Oda (js/oda.js) görünür kalır; gündem masadaki üç nesneden ya da aynı adlı düğmelerden açılır, tek panelde gösterilir:
     Telefon  haberler: meselelere düşen son gelişmeler, karar bekleyen konu, kayıttan dönüşte "Kaldığın yer".
     Ajanda   bugünün işleri, önümüzdeki günler, kasa.
     Dosya    mesele: yürüten, bekleyen adım, bilinenler (kaynağıyla), karar seçenekleri, görüş isteme, sözler, kısa geçmiş. Mesele yoksa masada dosya yoktur.
     Gazete   yalnız çıkmış bir haber varken masadadır: manşet ve gelen teşekkür (js/soz.js).
   Ajandada ayrıca başkanın başlatabileceği girişimler ve verdiği sözler listelenir (js/yonetim.js, js/soz.js).
   Test bilgileri (ayarlar.test; GEÇİCİ, js/test-gorunum.js): katkı seviyeleri, gizli koşullar, seçenek sonuç önizlemesi ve kadro özellikleri kesikli
   çerçeveli "TEST" kutularında gösterilir; ayar kapalıyken hiçbiri ekrana yazılmaz.
   Kural içermez: içerik js/ajanda.js ve js/mesele.js'in okuma işlevlerinden gelir, değişiklikler oyun.komut ile aynı kariyer komutlarına gider.
   Paneli açmak, kapamak ve nesneler arasında geçmek zamanı ilerletmez; yalnız "yeni" işaretini kaldırır.
   Önemli haber paneli kendiliğinden açmaz: telefon yanar, alt şeritte yazılır. Aynı anda tek panel açıktır.
   odaEkraniKur(kap, oyun, ayarlar):
     oyun    {kariyer, komut(f, kaydetme), kayitYazi(), kayitHata(), kayitTamam(), yenidenKaydet(), yeniKariyer() → mesaj, macaGit(),
              donus, ilkMesaj, bozukHata, bozuguSaklaVeBasla() → mesaj}
     ayarlar {ses, sessiz, yazi:'normal'|'buyuk', test, kaydet()}
   Renkler STIL.kagit'ten CSS değişkeni (--k-ad) olarak yazılır. Klavye: 1 telefon, 2 ajanda, 3 dosya, 4 gazete, Esc kapat. */
function odaEkraniKur(kap,oyun,ayarlar){
  const K=STIL.kagit;
  for(const a in K)if(typeof K[a]==='string')kap.style.setProperty('--k-'+a,K[a]);
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
  const NESNE={telefon:'Telefon',ajanda:'Ajanda',dosya:'Dosya',gazete:'Gazete'};
  const testAcik=()=>!!ayarlar.test&&typeof testOnizleme==='function';
  const testKutu=ic=>'<div class="od-test"><b>TEST</b> '+ic+'</div>';

  let k=oyun.kariyer,acik=null,secili=null,seciliMesele=null,onay=null,mesaj=oyun.ilkMesaj||'',yeniOnay=false,secimler={},donus=!!oyun.donus,yeniIsaret=new Set();
  function komut(f,kaydetme){const s=oyun.komut(f,kaydetme);k=oyun.kariyer;return s;}
  const kulupId=()=>k.kisiler[k.baskanId].kulupId;
  const kisiYazi=id=>{const p=k.kisiler[id];return p?p.ad+' ('+(ROL[p.rol]||p.rol)+')':'';};
  const aralik=r=>r.saatsiz?'şimdi':saatYazi(r.saat)+(r.sure?'–'+saatYazi((r.saat+r.sure)%1440):'');
  const isAdi=x=>x.tur==='odeme'?x.veri.aciklama+' '+tlYazi(x.veri.tutar):isBasligi(k,x);
  const anYazi=(tarih,dakika,saatsiz)=>tarihKisa(tarih)+' '+(saatsiz?'en geç ':'')+saatYazi(dakika);
  const bugun=()=>ajandaGunu(k,k.tarih);
  const macIsi=()=>bugun().find(r=>r.durum==='bekliyor'&&r.eylem==='macGunu');
  const meseleler=()=>meseleListesi(k);
  const acikMeseleler=()=>meseleler().filter(m=>m.durum!=='kapandi');
  const haberSayisi=()=>meseleler().reduce((t,m)=>t+(m.olaylar.length-m.gorulen),0);
  const kararBekleyen=()=>acikMeseleler().map(m=>meseleOzeti(k,m.id)).filter(o=>o.karar&&o.karar.simdi);
  const bekleyenIsSayisi=()=>bugun().filter(r=>r.tur==='ajanda'&&r.durum==='bekliyor').length;
  const izler=()=>typeof odaIzleri==='function'?odaIzleri(k):{gazete:null,kart:null,yeniHaber:0,iskele:false,panoNotu:false};

  /* TEST: seçeneğin gizli katkısı (aday seçimi) ve üreteceği sonuç (kopya üzerinde denenir) */
  function testSecenek(isId,s){
    if(!testAcik())return'';
    let ic='';
    const kt=k.kisiler[s.id]?testKisi(k,s.id):null;
    if(kt)ic+='katkı: '+kt.map(x=>yaz(x.alan+' '+x.seviye)).join(' · ')+'<br>';
    if(!s.engel){const t=testOnizleme(k,isId,s.id);ic+=t.hata?yaz('önizleme yok: '+t.hata):'sonuç: '+t.satirlar.map(yaz).join(' → ');}
    return ic?testKutu(ic):'';
  }
  /* görüş isteme: karar başkanda kalır, kişi inceler, görüşü dosyaya düşer */
  function tavsiyeBolumu(isId){
    const t=typeof tavsiyeOnizle==='function'?tavsiyeOnizle(k,isId):null;
    if(!t)return'';
    const ad=t.kisi?t.kisi.ad:YONETIM_KOLTUKLARI[t.koltuk].ad;
    return'<p class="od-tavsiye"><button type="button" data-eylem="tavsiye" data-is="'+isId+'"'+(t.engel?' disabled':'')+'>Görüş iste: '+yaz(ad)+'</button> <span class="od-not">'+
      yaz(t.engel||YONETIM_KOLTUKLARI[t.koltuk].ad+' inceler; görüşü '+saatYazi(t.gelis%1440)+' gibi gelir. Karar sende kalır.')+'</span></p>';
  }
  /* ---- karar ve katılım: ajandada da dosyada da aynı bölüm ---- */
  function isBolumu(id){
    const is=k.isler[id];if(!is||is.tur!=='ajanda')return'';
    const v=is.veri,r=bugun().find(x=>x.id===id&&x.durum==='bekliyor');
    if(!r)return'<p class="od-not">Bu iş '+yaz(tarihKisa(is.tarih))+' günü ajandada.</p>';
    const secim=secimler[id],o=ajandaOnizle(k,id,secim);
    let ic='';
    if(o.secenekler.length)ic+='<ul class="od-secenekler">'+o.secenekler.map(s=>'<li><button type="button" class="od-secenek" data-eylem="sec" data-is="'+id+'" data-secim="'+yaz(s.id)+'" aria-pressed="'+(s.id===secim?'true':'false')+'"'+(s.engel?' disabled':'')+'>'+
      '<b>'+yaz(s.metin)+'</b>'+(s.sure!==undefined?' <small>'+s.sure+' dk</small>':'')+'</button>'+(s.engel?'<small class="od-uyari">'+yaz(s.engel)+'</small>':'')+
      (s.aciklama||[]).filter(Boolean).map(a=>'<small>'+yaz(a)+'</small>').join('')+testSecenek(id,s)+'</li>').join('')+'</ul>';
    ic+=tavsiyeBolumu(id);
    for(const e of o.engel)ic+='<p class="od-uyari">'+yaz(e)+'</p>';
    if(o.atlanacak.length)ic+='<p class="od-uyari">Bu işe gidersen kaçırılacak: '+o.atlanacak.map(x=>yaz(x.veri.baslik+' ('+saatYazi(x.dakika)+')')).join(', ')+'</p>';
    if(o.gerceklesecek.length)ic+='<p class="od-not">Bu arada: '+o.gerceklesecek.map(x=>yaz(isAdi(x))).join(' · ')+'</p>';
    const mac=v.eylem==='macGunu',beklet=o.atlanacak.length&&onay!=='yap:'+id,sonAralik=saatYazi(r.saat)+(o.sure?'–'+saatYazi((r.saat+o.sure)%1440):'');
    let d='';
    if(onay==='yap:'+id)d+='<button type="button" class="od-birincil" data-eylem="yap" data-is="'+id+'">Onayla ▸</button><button type="button" data-eylem="vazgec">Vazgeç</button>';
    else d+='<button type="button" class="od-birincil" data-eylem="'+(beklet?'yapSor':'yap')+'" data-is="'+id+'"'+(o.engel.length||o.secimGerekli?' disabled':'')+'>'+
      (mac?'Stada git ▸':o.secimGerekli?'Önce bir seçenek seç':(o.secenekler.length?'Karar ver ▸ ':'Katıl ▸ ')+sonAralik)+'</button>';
    if(v.zorunluluk==='ertelenebilir'){const t=ertelemeTarihi(is);
      d+='<button type="button" data-eylem="ertele" data-is="'+id+'"'+(t?'':' disabled')+'>'+(t?'Ertele → '+yaz(tarihKisa(t)):'Ertelenemez: son gün')+'</button>';}
    return ic+'<div class="od-dugmeler">'+d+'</div>';
  }

  /* ---- paneller ---- */
  function donusBolumu(){
    const o=donusOzeti(k);
    let ic='<section class="od-kutu"><h4>Kaldığın yer <small>'+yaz(tarihYazi(k.tarih)+' '+saatYazi(k.gunIciDakika))+'</small></h4>';
    ic+=o.sonKarar?'<p><b>Son yaptığın</b> '+yaz(o.sonKarar.baslik)+(o.sonKarar.secimMetni?' — '+yaz(o.sonKarar.secimMetni):'')+'</p>':'<p class="od-not">Henüz bir iş yapmadın.</p>';
    for(const b of o.beklenen)ic+='<p><b>'+yaz(b.durumAdi)+'</b> '+yaz(b.metin)+' <span class="od-not">('+yaz(anYazi(b.tarih,b.dakika,b.saatsiz))+')</span></p>';
    if(o.yaklasan)ic+='<p><b>Yaklaşan</b> '+yaz(o.yaklasan.baslik)+' <span class="od-not">('+yaz(anYazi(o.yaklasan.tarih,o.yaklasan.dakika,o.yaklasan.saatsiz))+')</span></p>';
    return ic+'<div class="od-dugmeler"><button type="button" class="od-birincil" data-eylem="devam">Devam ▸</button></div></section>';
  }
  function telefonPaneli(){
    let ic=donus?donusBolumu():'';
    const bekleyen=kararBekleyen();
    for(const o of bekleyen)ic+='<section class="od-kutu od-acil"><h4>Karar sende</h4><p>'+yaz(o.mesele.baslik)+'</p>'+
      '<div class="od-dugmeler"><button type="button" class="od-birincil" data-eylem="dosyaAc" data-mesele="'+o.mesele.id+'">Dosyayı aç ▸</button></div></section>';
    const H=[];
    for(const m of meseleler())meseleOzeti(k,m.id).olaylar.forEach((o,i)=>H.push({m,o,i,yeni:yeniIsaret.has(m.id+':'+i)}));
    H.sort((a,b)=>anDakika(b.o.tarih,b.o.dakika)-anDakika(a.o.tarih,a.o.dakika)||b.i-a.i);
    ic+='<h4>Haberler</h4>'+(H.length?'<ul class="od-haberler">'+H.slice(0,6).map(h=>'<li><button type="button" class="od-haber" data-eylem="dosyaAc" data-mesele="'+h.m.id+'">'+
      '<span class="od-an">'+yaz(tarihKisa(h.o.tarih).split(' ').slice(0,2).join(' ')+' '+saatYazi(h.o.dakika))+(h.yeni?' <i class="od-yeni">Yeni</i>':'')+'</span><span>'+yaz(h.o.metin)+'</span></button></li>').join('')+'</ul>'
      :'<p class="od-not">Yeni haber yok. Telefon sessiz.</p>');
    return ic;
  }
  function ajandaPaneli(){
    const satirlar=bugun();
    if(!secili||!satirlar.some(r=>r.id===secili&&r.tur==='ajanda')){const b=satirlar.find(r=>r.tur==='ajanda'&&r.durum==='bekliyor');secili=b?b.id:null;}
    let ic='<h4>Bugün <small>'+yaz(tarihKisa(k.tarih))+'</small></h4><ul class="od-liste">'+(satirlar.map(r=>{
      const sag=DURUM[r.durum]?'<span class="od-d-'+r.durum+'">'+DURUM[r.durum]+'</span>':r.zorunluluk?'<span class="od-etiket od-'+r.zorunluluk+'">'+ETIKET[r.zorunluluk]+'</span>':
        r.tutar!==undefined?'<span class="'+(r.tutar<0?'od-eksi':'')+'">'+tlYazi(r.tutar)+'</span>':'<span></span>';
      const bitti=r.durum!=='bekliyor'?' od-bitti':'';
      if(r.tur!=='ajanda')return'<li class="od-satir'+bitti+'"><span class="od-an">'+saatYazi(r.saat)+'</span><span class="od-ad">'+yaz(r.baslik)+'</span>'+sag+'</li>';
      return'<li><button type="button" class="od-satir'+bitti+'" data-is="'+r.id+'" aria-pressed="'+(r.id===secili&&r.durum!=='ertelendi'?'true':'false')+'">'+
        '<span class="od-an">'+aralik(r)+'</span><span class="od-ad">'+yaz(r.baslik)+'</span>'+sag+'</button></li>';}).join('')||'<li class="od-not">Bugün için iş yok.</li>')+'</ul>';
    const r=satirlar.find(x=>x.id===secili&&x.tur==='ajanda'&&x.durum!=='ertelendi');
    if(r){
      const is=k.isler[r.id],v=is?is.veri:null;
      ic+='<section class="od-kutu"><h4>'+yaz(r.baslik)+(r.zorunluluk?' <span class="od-etiket od-'+r.zorunluluk+'">'+ETIKET[r.zorunluluk]+'</span>':'')+'</h4>'+
        '<p class="od-not">'+aralik(r)+(r.sure?' · '+r.sure+' dk':'')+(r.saatsiz?' · en geç '+(r.sonCevap.tarih===k.tarih?'':yaz(tarihKisa(r.sonCevap.tarih))+' ')+saatYazi(r.sonCevap.dakika):'')+
        (v&&v.kisiId?' · '+yaz(kisiYazi(v.kisiId)):'')+(v&&v.sonTarih?' · en geç '+yaz(tarihKisa(v.sonTarih)):'')+'</p>';
      if(v)ic+='<p>'+yaz(v.aciklama)+'</p>';
      if(r.meseleId&&k.meseleler[r.meseleId])ic+='<p class="od-not">Konu: <button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+r.meseleId+'">'+yaz(k.meseleler[r.meseleId].baslik)+'</button></p>';
      if(r.durum==='yapildi'){
        if(r.secimMetni)ic+='<p><b>Kararın</b> '+yaz(r.secimMetni)+'</p>';
        ic+=r.bilgi?'<p><b>'+(r.secimMetni?'Sonuç':'Öğrendiklerin')+'</b> '+yaz(r.bilgi)+'</p>':'<p class="od-not">Yapıldı.</p>';
      }
      if(r.durum==='kacirildi')ic+='<p class="od-uyari">Bu işe katılmadın; kaçırıldı.</p>';
      if(r.durum==='bekliyor')ic+=isBolumu(r.id);
      ic+='</section>';
    }
    const L=yaklasanlar(k,7).slice(0,5);
    ic+='<h4>Önümüzdeki günler</h4><ul class="od-liste" style="--an:10.4em">'+(L.map(x=>'<li class="od-satir"><span class="od-an">'+yaz(tarihKisa(x.tarih))+' '+saatYazi(x.dakika)+'</span><span class="od-ad">'+yaz(isAdi(x))+'</span>'+
      (x.tur==='ajanda'?'<span class="od-etiket od-'+x.veri.zorunluluk+'">'+ETIKET[x.veri.zorunluluk]+'</span>':'<span></span>')+'</li>').join('')||'<li class="od-not">Planlı iş yok.</li>')+'</ul>';
    const G=typeof girisimListesi==='function'?girisimListesi(k):[];
    if(G.length)ic+='<h4>Girişimler <small>senin başlatabileceklerin</small></h4><ul class="od-secenekler">'+G.map(g=>'<li><button type="button" class="od-secenek" data-eylem="girisim" data-girisim="'+g.id+'"'+(g.engel?' disabled':'')+'><b>'+yaz(g.ad)+'</b></button>'+
      (g.engel?'<small class="od-uyari">'+yaz(g.engel)+'</small>':'')+'<small>'+yaz(g.aciklama)+'</small></li>').join('')+'</ul>';
    ic+=sozlerBolumu(Object.values(k.sozler||{}),'Verdiğin sözler');
    const d=kulupDurumu(k,kulupId()),m=d.mali;
    ic+='<h4>Kasa</h4><dl class="od-dl"><dt>Kasadaki para</dt><dd><b>'+tlYazi(m.nakit)+'</b></dd><dt>Bekleyen gelir</dt><dd>'+tlYazi(m.bekleyenGelir)+'</dd>'+
      '<dt>Bekleyen gider</dt><dd class="'+(m.bekleyenGider<0?'od-eksi':'')+'">'+tlYazi(m.bekleyenGider)+'</dd><dt>Ödemelerden sonra</dt><dd>'+tlYazi(m.odemelerSonrasi)+'</dd>'+
      (d.yonetim?'<dt>Sayman</dt><dd class="'+(d.yonetim.sayman?'':'od-eksi')+'">'+(d.yonetim.sayman?yaz(d.yonetim.sayman.ad):'boş')+'</dd>':'')+'</dl>';
    return ic;
  }
  const SOZ_DURUM={acik:'Açık',tutuldu:'Tutuldu',bozuldu:'Bozuldu'};
  function sozlerBolumu(L,baslik){
    if(!L.length)return'';
    return'<h4>'+baslik+'</h4><ul class="od-kanit">'+L.map(s=>'<li><span class="od-an od-s-'+s.durum+'">'+SOZ_DURUM[s.durum]+'</span><span>'+yaz(sozMetni(k,s))+' <span class="od-not">— '+yaz(sozMuhatapAdi(k,s.muhatap))+'</span></span></li>').join('')+'</ul>';
  }
  function gazetePaneli(){
    const H=(k.haberler||[]).slice().reverse();
    if(!H.length)return'<p class="od-not">Masada gazete yok.</p>';
    return H.map(h=>'<section class="od-kutu'+(h.tur==='gazete'?' od-gazete':'')+'"><h4>'+(h.tur==='gazete'?'Demirkapı Postası':'Teşekkür')+' <small>'+yaz(tarihKisa(h.tarih))+'</small></h4><p'+(h.tur==='gazete'?' class="od-manset"':'')+'>'+yaz(haberMetni(k,h))+'</p>'+
      (h.olayId&&k.olaylar[h.olayId]&&k.meseleler[k.olaylar[h.olayId].meseleId]?'<p class="od-not">Konu: <button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+k.olaylar[h.olayId].meseleId+'">'+yaz(k.meseleler[k.olaylar[h.olayId].meseleId].baslik)+'</button></p>':'')+'</section>').join('');
  }
  function kadroPaneli(){
    const Q=testKadro(kulupId());
    if(!Q)return'<p class="od-not">Kadro verisi yok.</p>';
    return testKutu('Futbolcuların gizli özellikleri (1–99). Gelişim sistemi henüz olmadığı için değerler sabittir; yayında gösterilmeyecek.')+
      '<table class="od-kadro"><thead><tr><th>No</th><th>Futbolcu</th>'+Q.ozellikler.map(x=>'<th title="'+yaz(x)+'">'+yaz(x.slice(0,3))+'</th>').join('')+'<th>Ort</th></tr></thead><tbody>'+
      Q.oyuncular.map(o=>'<tr'+(o.yedek?' class="od-yedek"':'')+'><td>'+o.no+'</td><td>'+yaz(o.ad)+(o.yedek?' <small>'+yaz(o.mevki)+'</small>':'')+'</td>'+o.oz.map(x=>'<td>'+x+'</td>').join('')+'<td><b>'+o.ortalama+'</b></td></tr>').join('')+'</tbody></table>';
  }
  function dosyaPaneli(){
    const L=meseleler();
    if(!L.length)return'<p class="od-not">Açık dosya yok.</p>';
    if(!seciliMesele||!k.meseleler[seciliMesele])seciliMesele=L[0].id;
    const o=meseleOzeti(k,seciliMesele),m=o.mesele;
    let ic='';
    if(L.length>1)ic+='<div class="od-sekmeler">'+L.map(x=>'<button type="button" data-eylem="dosyaAc" data-mesele="'+x.id+'" aria-pressed="'+(x.id===m.id?'true':'false')+'">'+yaz(x.baslik)+'</button>').join('')+'</div>';
    ic+='<h4>'+yaz(m.baslik)+' <span class="od-etiket od-m-'+m.durum+'">'+yaz(o.durumAdi)+'</span></h4>';
    ic+='<p class="od-not">Yürüten: '+(o.sorumlu?yaz(kisiYazi(o.sorumlu.id)):'—')+(o.kisiler.length?' · İlgili: '+o.kisiler.map(p=>yaz(p.ad)).join(', '):'')+'</p>';
    if(!o.karar)ic+=o.adimlar.length?'<p><b>Bekleyen</b> '+o.adimlar.map(a=>yaz(a.metin)+(a.tutar!==undefined?' '+yaz(tlYazi(a.tutar)):'')+' <span class="od-not">('+yaz(anYazi(a.tarih,a.dakika,a.saatsiz))+')</span>').join(' · ')+'</p>'
      :'<p class="od-not">Bekleyen adım kalmadı.</p>';
    if(o.bilgiler.length)ic+='<section class="od-kutu"><h4>Bilinenler</h4><ul class="od-bilinen">'+o.bilgiler.slice(-4).map(x=>'<li>'+yaz(x.metin)+' <span class="od-an">— '+yaz(x.kaynak)+'</span></li>').join('')+'</ul></section>';
    if(o.karar){
      const is=k.isler[o.karar.isId];
      ic+='<section class="od-kutu od-acil"><h4>Karar sende</h4><p>'+yaz(is.veri.aciklama)+'</p>'+isBolumu(o.karar.isId)+'</section>';
    }else if(m.durum!=='kapandi')ic+='<p><b>Şimdi</b> Yapılacak bir şey yok; haber için ilerle.</p>';
    const olay=typeof meseleOlayi==='function'?meseleOlayi(k,m.id):null;
    if(olay&&typeof olaySozleri==='function')ic+=sozlerBolumu(olaySozleri(k,olay.id),'Sözler');
    if(testAcik())ic+=testKutu('gizli koşullar<br>'+testKosullar(k).map(x=>yaz(x.ad+': '+x.deger)).join('<br>'));
    ic+='<h4>Geçmiş</h4><ul class="od-kanit">'+o.olaylar.slice(o.karar?-2:-4).reverse().map(x=>'<li><span class="od-an">'+yaz(tarihKisa(x.tarih).split(' ').slice(0,2).join(' ')+' '+saatYazi(x.dakika))+'</span><span>'+yaz(x.metin)+'</span></li>').join('')+'</ul>';
    return ic;
  }
  function ayarPaneli(){
    return'<h4>Ses</h4><p class="od-ayar"><label>Düzey <input type="range" min="0" max="100" step="5" value="'+Math.round(ayarlar.ses*100)+'" data-ayar="ses"></label>'+
      '<button type="button" data-eylem="sessiz" aria-pressed="'+(ayarlar.sessiz?'true':'false')+'">'+(ayarlar.sessiz?'Ses kapalı':'Ses açık')+'</button></p>'+
      '<p class="od-not">Sesler bilgi taşımaz; her haber ekranda da yazılıdır.</p>'+
      '<h4>Yazı büyüklüğü</h4><div class="od-dugmeler"><button type="button" data-eylem="yazi" data-yazi="normal" aria-pressed="'+(ayarlar.yazi!=='buyuk'?'true':'false')+'">Normal</button>'+
      '<button type="button" data-eylem="yazi" data-yazi="buyuk" aria-pressed="'+(ayarlar.yazi==='buyuk'?'true':'false')+'">Büyük</button></div>'+
      '<h4>Test bilgileri <small>geliştirme aşaması; yayından önce kaldırılacak</small></h4><div class="od-dugmeler"><button type="button" data-eylem="test" aria-pressed="'+(ayarlar.test?'true':'false')+'">'+(ayarlar.test?'Açık':'Kapalı')+'</button>'+
        (testAcik()?'<button type="button" data-eylem="ac" data-panel="kadro">Kadro (TEST) ▸</button>':'')+'</div>'+
      '<p class="od-not">Açıkken yönetici katkıları, gizli koşullar, seçeneklerin sonucu ve futbolcu özellikleri görünür.</p>'+
      '<h4>Kariyer</h4><div class="od-dugmeler">'+(yeniOnay?'<button type="button" class="od-tehlike" data-eylem="yeniEvet">Evet, bu kariyeri bırak ve yenisini başlat</button><button type="button" data-eylem="yeniHayir">Vazgeç</button>'
        :'<button type="button" data-eylem="yeniSor">Yeni kariyer</button>')+'</div>';
  }

  /* sıradaki durak ve alt şerit */
  function durakYazi(o){
    const t=anTarih(o.hedef),an=tarihKisa(t.tarih)+' '+saatYazi(t.dakika);
    return an+(o.neden==='sonCevap'?' · son cevap saati: '+o.durak.veri.baslik:o.neden==='haber'?' · beklediğin görüş gelecek':o.durak?' · '+o.durak.veri.baslik:o.neden==='cakisma'?' · günün işleri çakışıyor, seçim gerekecek':' · bekleyen rutin işler');
  }
  function altSerit(){
    const mac=macIsi();
    let durum,dugme;
    if(mac){
      const o=ajandaOnizle(k,mac.id);
      durum=o.engel.length?o.engel.join(' · '):'Maç '+saatYazi(mac.saat)+'\'da. Stada gidince maç günü başlar.'+(o.atlanacak.length?' Kaçırılacak: '+o.atlanacak.map(x=>x.veri.baslik).join(', ')+'.':'');
      dugme=onay==='yap:'+mac.id?'<button type="button" data-eylem="vazgec">Vazgeç</button><button type="button" class="od-ana" data-eylem="yap" data-is="'+mac.id+'">Onayla ▸</button>'
        :'<button type="button" class="od-ana" data-eylem="'+(o.atlanacak.length?'yapSor':'yap')+'" data-is="'+mac.id+'"'+(o.engel.length?' disabled':'')+'>Stada git ▸</button>';
    }else{
      const o=ilerleOnizle(k),p=[];
      if(o.engel.length)p.push('İlerlenemiyor: '+o.engel.join(' · '));
      else{
        p.push('Sıradaki durak: '+durakYazi(o));
        if(o.tasinacak.length)p.push('Ertesi güne kalacak: '+o.tasinacak.map(x=>x.veri.baslik).join(', '));
        if(o.kacirilacak.length)p.push('Kaçırılacak: '+o.kacirilacak.map(x=>x.veri.baslik).join(', '));
      }
      durum=p.join(' · ');
      const sor=o.kacirilacak.length&&onay!=='ilerle';
      dugme=onay==='ilerle'?'<button type="button" data-eylem="vazgec">Vazgeç</button><button type="button" class="od-ana" data-eylem="ilerle">Onayla ▸</button>'
        :'<button type="button" class="od-ana" data-eylem="'+(sor?'ilerleSor':'ilerle')+'"'+(o.engel.length?' disabled':'')+'>İlerle ▸</button>';
    }
    return'<footer class="od-alt"><div class="od-altYazi"><p class="od-mesaj" aria-live="polite">'+yaz(mesaj)+'</p><p class="od-durak">'+yaz(durum)+'</p></div>'+dugme+'</footer>';
  }

  function odayiBildir(){
    const [,a,g]=parca(k.tarih);
    const iz=izler();
    odaDurum({haber:haberSayisi()+(donus?1:0),dosya:acikMeseleler().length>0,gun:String(g),ay:AYLAR[a-1].slice(0,3),gunAdi:gunAdi(k.tarih).slice(0,3),dakika:k.gunIciDakika,
      gazete:!!iz.gazete||!!iz.kart,gazeteYeni:iz.yeniHaber>0,kart:!!iz.kart,iskele:iz.iskele,panoNotu:iz.panoNotu});
    odaOdak(acik in NESNE?acik:null);
  }
  function ciz(odak){
    k=oyun.kariyer;
    kap.style.setProperty('--k-yaziBoyu',K.yaziBoyu[ayarlar.yazi==='buyuk'?'buyuk':'normal']+'cqw');
    if(oyun.bozukHata){
      kap.innerHTML='<div class="od-panel od-bozuk"><header><h3>Kayıt açılamadı</h3></header><div class="od-icerik"><p>Kayıtlı kariyer açılamadı. Kayıt dosyasına dokunulmadı.</p><p class="od-not">'+yaz(oyun.bozukHata)+'</p>'+
        '<p>Yeni kariyer başlatırsan açılamayan kayıt “.bozuk” uzantısıyla ayrıca saklanır.</p><div class="od-dugmeler"><button type="button" class="od-birincil" data-eylem="bozukYeni">Kaydı sakla, yeni kariyer başlat</button></div></div></div>';
      return;
    }
    const b=k.kisiler[k.baskanId],haber=haberSayisi()+(donus?1:0),karar=kararBekleyen().length,is=bekleyenIsSayisi(),dosyaVar=meseleler().length>0;
    const dugme=(ad,rozet,sinif,kapali)=>'<button type="button" class="od-nesne" data-eylem="ac" data-panel="'+ad+'" aria-pressed="'+(acik===ad?'true':'false')+'"'+(kapali?' disabled':'')+'>'+
      NESNE[ad]+(rozet?'<i class="od-rozet'+(sinif?' '+sinif:'')+'">'+rozet+'</i>':'')+'</button>';
    const iz=izler(),gazeteVar=!!iz.gazete||!!iz.kart;
    const baslik={telefon:'Telefon',ajanda:'Ajanda',dosya:'Dosya',gazete:'Gazete',ayar:'Ayarlar',kadro:'Kadro (TEST)'}[acik];
    const icerik=acik==='telefon'?telefonPaneli():acik==='ajanda'?ajandaPaneli():acik==='dosya'?dosyaPaneli():acik==='gazete'?gazetePaneli():acik==='ayar'?ayarPaneli():acik==='kadro'?kadroPaneli():'';
    kap.innerHTML='<header class="od-ust"><span>'+yaz(k.kulupler[kulupId()].ad)+' · Başkan '+yaz(b?b.ad:'')+'</span>'+
      '<span class="'+(oyun.kayitHata()?'od-uyari':'')+'">'+yaz(oyun.kayitYazi())+(oyun.kayitTamam()?'':' <button type="button" class="od-kucuk od-tehlike" data-eylem="kayitDene">Yeniden kaydet</button>')+'</span></header>'+
      '<div class="od-tarih" title="Okurken ve düşünürken zaman durur"><b>'+yaz(tarihYazi(k.tarih))+'</b><span>'+saatYazi(k.gunIciDakika)+'</span></div>'+
      '<nav class="od-nesneler" aria-label="Masadakiler">'+dugme('telefon',haber?String(haber):'',karar?'od-rozetAcil':'')+dugme('ajanda',is?String(is):'')+
        dugme('dosya',karar?'karar':'',karar?'od-rozetAcil':'',!dosyaVar)+(gazeteVar?dugme('gazete',iz.yeniHaber?'yeni':''):'')+
        '<button type="button" class="od-nesne od-kucuk" data-eylem="ac" data-panel="ayar" aria-pressed="'+(acik==='ayar'?'true':'false')+'">Ayarlar</button></nav>'+
      (acik?'<section class="od-panel'+(acik==='kadro'?' od-genis':'')+'" role="dialog" aria-label="'+baslik+'"><header><h3>'+baslik+'</h3><button type="button" class="od-kapat" data-eylem="kapat" title="Kapat (Esc)">Kapat ×</button></header><div class="od-icerik">'+icerik+'</div></section>':'')+
      altSerit();
    odayiBildir();
    const f=odak&&kap.querySelector(odak);if(f&&!f.disabled)f.focus({preventScroll:true});
  }

  /* ---- eylemler ---- */
  function panelAc(ad,mesele){
    if(ad==='dosya'&&!meseleler().length)return;
    if(ad==='gazete'&&!izler().gazete&&!izler().kart)return;
    const degisti=acik!==ad;
    acik=ad;onay=null;
    if(mesele)seciliMesele=mesele;
    if(ad==='telefon'||ad==='dosya'){
      /* yeni haberler bu açılışta "Yeni" diye işaretli kalır; görüldü kaydı zamanı ve geçmişi değiştirmez */
      const gorulecek=ad==='telefon'?meseleler():meseleler().filter(m=>m.id===(seciliMesele||meseleler()[0].id));
      if(ad==='telefon')yeniIsaret=new Set();
      for(const m of gorulecek){
        if(ad==='telefon')for(let i=m.gorulen;i<m.olaylar.length;i++)yeniIsaret.add(m.id+':'+i);
        if(m.olaylar.length>m.gorulen)try{komut(x=>meseleGoruldu(x,m.id));}catch(e){mesaj=e.message;}
      }
    }
    if(ad==='gazete'&&izler().yeniHaber)try{komut(x=>haberlerGoruldu(x));}catch(e){mesaj=e.message;}
    if(degisti)sesCal(ad==='telefon'?'tik':'kagit');
    ciz('.od-kapat');
  }
  function kapat(){acik=null;onay=null;yeniOnay=false;ciz('.od-ana');}
  function hataGoster(e){mesaj=e.message;onay=null;ciz();}
  function isiYap(id){
    const is=k.isler[id];if(!is)return;
    const baslik=is.veri.baslik,mac=is.veri.eylem==='macGunu',bas=saatYazi(is.dakika),saatsiz=!!is.veri.saatsiz,karar=!!is.veri.karar;
    try{komut(x=>ajandaIsiYap(x,id,secimler[id]),mac);}catch(e){hataGoster(e);return;}
    onay=null;
    if(k.isler[id]){
      /* yolda karar gerektiren bir haber geldi: iş yerinde bekliyor, o ana kadarki ilerleme geçerli */
      if(mac)oyun.yenidenKaydet();
      mesaj=baslik+' için yola çıktın; yolda karar gerektiren bir haber geldi. İş bekliyor.';sesCal('bildirim');ciz();return;
    }
    delete secimler[id];
    if(mac){acik=null;oyun.macaGit();return;}
    mesaj=baslik+' ('+(saatsiz?'karar':bas)+') tamamlandı.';
    sesCal(karar?'karar':'tik');
    if(haberSayisi()&&kararBekleyen().length)sesCal('bildirim');
    ciz();
  }
  function ilerleOzeti(r){
    const p=[];
    for(const g of r.biten){
      if(g.isTuru==='odeme'){const h=k.hareketler.find(x=>x.id===g.sonuc.hareketId);if(h)p.push(h.aciklama+' '+tlYazi(h.tutar));}
      else if(g.isTuru==='ajanda'&&g.sonuc&&g.sonuc.durum==='kacirildi')p.push(g.sonuc.baslik+' kaçırıldı');
      else if(g.isTuru==='hatirlatma'&&g.sonuc)p.push(g.sonuc.metin);
    }
    const bas=r.neden==='karar'?'Telefon: karar gerektiren bir haber geldi.':r.neden==='haber'?'Beklediğin görüş geldi; dosyada.':r.neden==='sonCevap'?'Son cevap saati geldi; karar bekliyor.':r.neden==='randevu'?'Sıradaki randevuya gelindi.':r.neden==='cakisma'?'Günün işleri çakışıyor; ajandadan seçim yap.':'Bekleyen rutin işler işlendi.';
    return bas+(haberSayisi()&&r.neden!=='karar'&&r.neden!=='haber'?' Telefonda yeni haber var.':'')+(izler().yeniHaber?' Masada gazete var.':'')+(p.length?' '+p.join(' · '):'');
  }
  function ilerleEylem(){
    let r;
    try{r=komut(x=>duragaIlerle(x));}catch(e){hataGoster(e);return;}
    onay=null;secili=null;
    mesaj=ilerleOzeti(r);
    sesCal(haberSayisi()?'bildirim':'tik');
    /* açık panel kapanır: oyuncu yeni duruma odadan bakar; haber paneli kendiliğinden açmaz */
    acik=null;ciz('.od-ana');
  }
  kap.addEventListener('click',e=>{
    sesBaslat();
    const b=e.target.closest('button');
    if(!b){
      /* odaya tıklama: imlecin altındaki nesne açılır; boş yere tıklamak paneli kapatır */
      if(e.target===kap){const ad=ODA.uzerinde;if(ad)panelAc(ad);else if(acik)kapat();}
      return;
    }
    if(b.disabled)return;
    const id=b.dataset.is,ey=b.dataset.eylem,ms=b.dataset.mesele;
    if(ey==='devam'){donus=false;ciz('.od-kapat');return;}
    if(!ey&&id){secili=id;onay=null;ciz('button.od-satir[data-is="'+id+'"]');return;}
    if(ey==='ac'){if(acik===b.dataset.panel)kapat();else panelAc(b.dataset.panel);}
    else if(ey==='dosyaAc')panelAc('dosya',ms);
    else if(ey==='kapat')kapat();
    else if(ey==='yap')isiYap(id);
    else if(ey==='sec'){secimler[id]=b.dataset.secim;onay=null;ciz('[data-eylem="sec"][data-secim="'+b.dataset.secim+'"]');}
    else if(ey==='yapSor'){onay='yap:'+id;ciz('[data-eylem="yap"]');}
    else if(ey==='ertele'){try{const t=komut(x=>ajandaErtele(x,id));mesaj=k.gecmis[k.gecmis.length-1].baslik+' '+tarihYazi(t)+' gününe ertelendi.';secili=null;onay=null;ciz();}catch(x){hataGoster(x);}}
    else if(ey==='ilerleSor'){onay='ilerle';ciz('[data-eylem="ilerle"]');}
    else if(ey==='ilerle')ilerleEylem();
    else if(ey==='vazgec'){onay=null;ciz();}
    else if(ey==='kayitDene'){const s=oyun.yenidenKaydet();mesaj=s.tamam?'Kayıt yazıldı.':'Kayıt yine yazılamadı.';ciz();}
    else if(ey==='tavsiye'){try{mesaj=komut(x=>tavsiyeIste(x,id));sesCal('tik');ciz();}catch(x){hataGoster(x);}}
    else if(ey==='girisim'){try{mesaj=komut(x=>girisimBaslat(x,b.dataset.girisim));secili=null;sesCal('tik');ciz();}catch(x){hataGoster(x);}}
    else if(ey==='test'){ayarlar.test=!ayarlar.test;ayarlar.kaydet();ciz('[data-eylem="test"]');}
    else if(ey==='sessiz'){ayarlar.sessiz=!ayarlar.sessiz;sesAyarla(ayarlar.ses,ayarlar.sessiz);ayarlar.kaydet();ciz('[data-eylem="sessiz"]');}
    else if(ey==='yazi'){ayarlar.yazi=b.dataset.yazi;ayarlar.kaydet();ciz('[data-eylem="yazi"][data-yazi="'+ayarlar.yazi+'"]');}
    else if(ey==='yeniSor'){yeniOnay=true;ciz('[data-eylem="yeniHayir"]');}
    else if(ey==='yeniHayir'){yeniOnay=false;ciz();}
    else if(ey==='yeniEvet'){yeniOnay=false;mesaj=oyun.yeniKariyer();k=oyun.kariyer;acik=null;secili=null;seciliMesele=null;secimler={};donus=false;ciz('.od-ana');}
    else if(ey==='bozukYeni'){mesaj=oyun.bozuguSaklaVeBasla();k=oyun.kariyer;ciz('.od-ana');}
  });
  kap.addEventListener('input',e=>{
    if(e.target.dataset.ayar==='ses'){ayarlar.ses=e.target.value/100;sesBaslat();sesAyarla(ayarlar.ses,ayarlar.sessiz);ayarlar.kaydet();}
  });
  /* imleç odadaki nesnenin üzerindeyken çerçevesi yanar ve el imleci görünür */
  kap.addEventListener('pointermove',e=>{
    if(e.target!==kap){if(ODA.uzerinde){odaIsaret(null);kap.style.cursor='';}return;}
    const r=kap.getBoundingClientRect(),ad=odaIsaret((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));
    kap.style.cursor=ad?'pointer':'';kap.title=ad?NESNE[ad]:'';
  });
  kap.addEventListener('pointerleave',()=>{odaIsaret(null);kap.style.cursor='';});
  addEventListener('keydown',e=>{
    if(kap.hidden||oyun.bozukHata||e.ctrlKey||e.altKey||e.metaKey)return;
    const t=e.target&&e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;
    const ad={Digit1:'telefon',Digit2:'ajanda',Digit3:'dosya',Digit4:'gazete'}[e.code];
    if(ad){sesBaslat();e.preventDefault();if(acik===ad)kapat();else panelAc(ad);}
    else if(e.code==='Escape'&&acik){e.preventDefault();kapat();}
  });
  sesAyarla(ayarlar.ses,ayarlar.sessiz);sesOrtam('oda');
  return{ciz,ac:panelAc,kapat,get acik(){return acik;}};
}

/* ---- oyundaki açılış (index.html): oda varsayılan sayfadır. Prototip sayfası kendi oturumunu kurar; orada bu bölüm çalışmaz ---- */
if(typeof ON_EKRAN!=='undefined'&&typeof OYUN!=='undefined'){
  const kap=$('oda');
  if(ON_EKRAN.sayfa==='oda'){
    oyunBaslat();
    const ekran=odaEkraniKur(kap,{
      get kariyer(){return OYUN.kariyer;},komut:oyunKomut,kayitYazi:oyunKayitYazi,kayitHata:oyunKayitHata,
      kayitTamam:()=>OYUN.oturum.durum.tamam,yenidenKaydet:()=>OYUN.oturum.kaydet(),yeniKariyer:oyunYeniKariyer,
      /* maç günü: oda kapanır, bülten açılır; stat bir sonraki karede yeniden çizilir (js/arayuz.js) */
      macaGit:()=>{kap.hidden=true;sesOrtam(null);ON_EKRAN.bulteniAc();},
      donus:OYUN.donus,ilkMesaj:OYUN.mesaj,get bozukHata(){return OYUN.bozukHata;},bozuguSaklaVeBasla:oyunBozuguSakla
    },OYUN.ayarlar);
    kap.hidden=false;ekran.ciz('.od-ana');
    soyle('Başkan odası: telefon, ajanda ve dosya masada. Okurken zaman durur.');
  }else kap.hidden=true;
}
