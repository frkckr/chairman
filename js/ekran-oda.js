/* ============ Chairman — oda ekranı: başkan odasında telefon, ajanda ve dosya (yol haritası 2.5) ============
   Görüntü katmanı. Oda (js/oda.js) görünür kalır; gündem masadaki üç nesneden ya da aynı adlı düğmelerden açılır, tek panelde gösterilir:
     Telefon  haberler: meselelere düşen son gelişmeler, karar bekleyen konu, kayıttan dönüşte "Kaldığın yer".
     Ajanda   bugünün işleri, önümüzdeki günler, kasa.
     Dosya    mesele: yürüten, bekleyen adım, bilinenler (kaynağıyla), karar seçenekleri, görüş isteme, sözler, kısa geçmiş. Mesele yoksa masada dosya yoktur.
     Gazete   yalnız çıkmış bir haber varken masadadır: manşet ve gelen teşekkür (js/soz.js).
   Ajandada ayrıca başkanın başlatabileceği girişimler ve verdiği sözler listelenir (js/yonetim.js, js/soz.js).
   Test bilgileri (ayarlar.test; GEÇİCİ, js/test-gorunum.js): katkı seviyeleri, gizli koşullar, seçenek sonuç önizlemesi ve kadro özellikleri
   ilgili satırdaki küçük "TEST" simgesinden açılan kutuda gösterilir (2.8A); ayar kapalıyken hiçbiri ekrana yazılmaz.
   Kural içermez: içerik js/ajanda.js ve js/mesele.js'in okuma işlevlerinden gelir, değişiklikler oyun.komut ile aynı kariyer komutlarına gider.
   Paneli açmak, kapamak ve nesneler arasında geçmek zamanı ilerletmez; yalnız "yeni" işaretini kaldırır.
   Önemli haber paneli kendiliğinden açmaz: telefon yanar, alt şeritte yazılır. Aynı anda tek panel açıktır.
   odaEkraniKur(kap, oyun, ayarlar):
     oyun    {kariyer, komut(f, kaydetme), kayitYazi(), kayitHata(), kayitTamam(), yenidenKaydet(), yeniKariyer() → mesaj, macaGit(),
              donus, ilkMesaj, bozukHata, bozuguSaklaVeBasla() → mesaj}
     ayarlar {yazi:'normal'|'buyuk', test, kaydet()}
   Balkon (2.7, 2.8D; js/balkon.js ve js/gozlem.js yüklüyse): kapıya tıklayınca (ya da 5) odadan balkona yürünür; paneller balkondan da açılır. Antrenman sürerken
   gözlem şeridinden süre seçilir: aralık kurulur, saat gerçek zamanlı akar ve her oyun dakikası kariyere gerçekten uygulanır (2.8B). Karar
   gerektiren haberde gözlem durur, kalan süre yazılır; kısa iş gözlemin içinde yapılır, uzun iş için önce gözlem bırakılır.
   Duraklat (2.8B, js/sunum-durumu.js): üst şeritteki düğme, P ya da boşluk. Duraklatmada oda, yürüyüş, antrenman ve gözlem durur; paneller okunur,
   süre tüketen ya da dünyayı değiştiren komutlar kapalıdır.
   Renkler STIL.kagit'ten CSS değişkeni (--k-ad) olarak yazılır. Klavye: 1 telefon, 2 ajanda, 3 dosya, 4 gazete, 5 balkon/oda, P duraklat, Esc kapat. */
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
  const DURUM={bekliyor:'',yapildi:'Yapıldı',kacirildi:'Kaçırıldı',ertelendi:'Ertelendi',cevapsiz:'Cevapsız',tamamlandi:''};
  const ROL={baskan:'başkan',teknikDirektor:'teknik direktör',yonetici:'yönetici',eskiBaskan:'eski başkan'};
  const NESNE={telefon:'Telefon',ajanda:'Ajanda',dosya:'Dosya',gazete:'Gazete'};
  const testAcik=()=>!!ayarlar.test&&typeof testOnizleme==='function';
  /* test bilgisi: küçük TEST simgesi; üzerine gelince, odakta ya da tıklayınca altında kutu açılır (salt okunur, kariyeri değiştirmez) */
  const testKutu=ic=>'<span class="od-testIpucu"><button type="button" class="od-testSimge" data-eylem="testAc" aria-expanded="false" aria-label="Test bilgisi">TEST</button>'+
    '<span class="od-test" role="tooltip">'+ic+'</span></span>';

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
  /* telefon bildirimi: kişilerden gelen okunmamış mesajlar (konunun kayıt satırları bildirim sayılmaz) */
  const haberSayisi=()=>konusmaListesi(k).reduce((t,c)=>t+c.okunmamis,0);
  const kararBekleyen=()=>acikMeseleler().map(m=>meseleOzeti(k,m.id)).filter(o=>o.karar&&o.karar.simdi);
  const bekleyenIsSayisi=()=>bugun().filter(r=>r.tur==='ajanda'&&r.durum==='bekliyor').length;
  const balkonVar=typeof odaYuru==='function'&&typeof balkonKare==='function',gozlemVar=balkonVar&&typeof gozlemOnizle==='function';
  /* gözlem gerçek zamanlı akar (2.8B): her STIL.balkon.gozlemDakikaMs gerçek sürede bir oyun dakikası komutla UYGULANIR (gozlemAdim);
     ekrandaki saat kariyerin saatidir. Disk kaydı her GOZLEM_KAYIT_DK oyun dakikasında, durmada, duraklatmada, panel açılınca ve sayfa kapanırken.
     Sayaç kendi kare döngüsüyle sayar; duraklatmada ve bir panel açıkken durur (okunan panel değişmez), sekme gizliyken sıçramaz. */
  const GOZLEM_KAYIT_DK=15;  // TEST değeri
  let izleme=null;
  function izlemeKaydet(){oyun.yenidenKaydet();if(izleme)izleme.kayitDk=k.gunIciDakika;}
  function izlemeDurdur(){if(!izleme)return;izleme=null;izlemeKaydet();}
  function izlemeBaslat(){izleme={birikim:0,son:0,kayitDk:k.gunIciDakika};requestAnimationFrame(izlemeKare);}
  function izlemeKare(t){
    const I=izleme;if(!I||I!==izleme)return;
    const dt=I.son?Math.min(0.25,Math.max(0,(t-I.son)/1000)):0;I.son=t;
    if(!duraklatmaVar()&&!acik&&ODA.yer==='balkon'&&!kap.hidden){
      I.birikim+=dt*1000;
      let adim=0;
      while(izleme===I&&I.birikim>=STIL.balkon.gozlemDakikaMs&&adim<4){
        I.birikim-=STIL.balkon.gozlemDakikaMs;adim++;
        if(!gozlemAcik(k)){izleme=null;izlemeKaydet();ciz();return;}
        let r;try{r=komut(x=>gozlemAdim(x,1),true);}catch(e){izleme=null;izlemeKaydet();hataGoster(e);return;}
        if(r.neden!=='devam'){izleme=null;izlemeKaydet();gozlemSonucu(r);return;}
        if(k.gunIciDakika-I.kayitDk>=GOZLEM_KAYIT_DK)izlemeKaydet();
      }
      if(adim)izlemeGoster();
    }
    requestAnimationFrame(izlemeKare);
  }
  /* izlerken her dakika bütün ekran yeniden kurulmaz: saat, gözlem şeridi, kayıt yazısı ve oda sahnesi güncellenir */
  function izlemeGoster(){
    const s=kap.querySelector('.od-tarih span');if(s)s.textContent=saatYazi(k.gunIciDakika);
    const g=kap.querySelector('.od-gozlem');if(g)g.outerHTML=gozlemSeridi();
    const y=kap.querySelector('.od-kayit');if(y)y.textContent=oyun.kayitYazi();
    odayiBildir();
  }
  const izler=()=>typeof odaIzleri==='function'?odaIzleri(k):{gazete:null,kart:null,yeniHaber:0,iskele:false,panoNotu:false};

  /* TEST: seçeneğin gizli katkısı (aday seçimi) ve üreteceği sonuç (kopya üzerinde denenir) */
  function testSecenek(isId,s){
    if(!testAcik())return'';
    let ic='';
    const kid=s.kisiId||s.id,kt=k.kisiler[kid]?testKisi(k,kid):null;
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
    /* karar: iki büyük cevaplı ortak kart (js/ekran-telefon.js); eski kayıtların çok seçenekli kararları da aynı kartta, eski "Görüş iste" altında */
    if(v.karar)return kararKarti(k,id,{secim:secimler[id],onay:onay==='yap:'+id,testSecenek,dosyada:acik==='dosya'})+tavsiyeBolumu(id)+
      (v.zorunluluk==='ertelenebilir'?'<div class="od-dugmeler">'+ertelemeDugmesi(is)+'</div>':'');
    const secim=secimler[id],o=ajandaOnizle(k,id,secim);
    let ic='';
    for(const e of o.engel)ic+='<p class="od-uyari">'+yaz(e)+'</p>';
    if(o.atlanacak.length)ic+='<p class="od-uyari">Bu işe gidersen kaçırılacak: '+o.atlanacak.map(x=>yaz(x.veri.baslik+' ('+saatYazi(x.dakika)+')')).join(', ')+'</p>';
    if(o.cevapsiz.length)ic+='<p class="od-uyari">Bu arada cevapsız kalacak: '+o.cevapsiz.map(x=>yaz(x.veri.baslik+' — '+zamanAsimiMetni(k,x))).join(' · ')+'</p>';
    if(o.gerceklesecek.length)ic+='<p class="od-not">Bu arada: '+o.gerceklesecek.map(x=>yaz(isAdi(x))).join(' · ')+'</p>';
    const mac=v.eylem==='macGunu',beklet=(o.atlanacak.length||o.cevapsiz.length)&&onay!=='yap:'+id,sonAralik=saatYazi(r.saat)+(o.sure?'–'+saatYazi((r.saat+o.sure)%1440):'');
    let d='';
    if(onay==='yap:'+id)d+='<button type="button" class="od-birincil" data-eylem="yap" data-is="'+id+'">Onayla ▸</button><button type="button" data-eylem="vazgec">Vazgeç</button>';
    else d+='<button type="button" class="od-birincil" data-eylem="'+(beklet?'yapSor':'yap')+'" data-is="'+id+'"'+(o.engel.length||o.secimGerekli?' disabled':'')+'>'+
      (mac?'Stada git ▸':'Katıl ▸ '+sonAralik)+'</button>';
    if(v.zorunluluk==='ertelenebilir'){const t=ertelemeTarihi(is);
      d+='<button type="button" data-eylem="ertele" data-is="'+id+'"'+(t?'':' disabled')+'>'+(t?'Ertele → '+yaz(tarihKisa(t)):'Ertelenemez: son gün')+'</button>';}
    return ic+'<div class="od-dugmeler">'+d+'</div>';
  }

  /* ---- paneller (2.8C: tek konuya odaklanan dosya, randevu ajandası, konuşma telefonu, bölümlü ayarlar) ---- */
  /* kategori: meselenin türünden; simge metinle birlikte gösterilir */
  const KATEGORI={odemeSikismasi:['Mali','₺'],sponsorOdemesi:['Mali','₺'],hocaTalebi:['Futbol','F'],basinSorusu:['Basın','B'],kosulluDestek:['Destek','D'],koltuk:['Yönetim','Y']};
  const kategori=m=>KATEGORI[m.tur]||['Kulüp','K'];
  const kategoriYazi=m=>{const [ad,s]=kategori(m);return'<span class="od-kategori"><i class="od-kSimge" aria-hidden="true">'+yaz(s)+'</i>'+yaz(ad)+'</span>';};
  /* dosya sırası bu oturumda sabittir: yeni mesele sona eklenir, gelen haber sırayı ve açık dosyayı değiştirmez */
  let dosyaSira=[],dosyaArsiv=false,dosyaSonuc=null,donusYeri=null,ajandaGun=null,ayarBolum='okuma';
  function siraGuncelle(){const L=meseleler().map(m=>m.id);dosyaSira=dosyaSira.filter(id=>L.includes(id)).concat(L.filter(id=>!dosyaSira.includes(id)));}
  const acikSira=()=>{siraGuncelle();return dosyaSira.filter(id=>k.meseleler[id].durum!=='kapandi');};
  const arsivListesi=()=>meseleler().filter(m=>m.durum==='kapandi');
  function sayaclar(){const A=acikMeseleler();return{acik:A.length,cevap:A.filter(m=>m.durum==='kararBekliyor').length,takip:A.filter(m=>m.durum==='ekipte'||m.durum==='haberBekliyor').length};}
  /* son tarih: başkandan beklenen kararın son cevap anı, yoksa bekleyen ilk adım */
  function sonTarih(o){
    if(o.karar){const x=k.isler[o.karar.isId];return x?'Son cevap: '+anYazi(x.tarih,x.dakika,false):'';}
    const a=o.adimlar[0];return a?'Beklenen: '+anYazi(a.tarih,a.dakika,a.saatsiz):'';
  }
  /* "Ne oldu?": konunun ilk olayı ve son iki gelişmesi (en çok üç cümle) */
  function neOldu(o){const L=o.olaylar;return(L.length<=3?L:[L[0]].concat(L.slice(-2))).map(x=>x.metin);}
  function donusBolumu(){
    const o=donusOzeti(k);
    let ic='<section class="od-kutu"><h4>Kaldığın yer <small>'+yaz(tarihYazi(k.tarih)+' '+saatYazi(k.gunIciDakika))+'</small></h4>';
    ic+=o.sonKarar?'<p><b>Son yaptığın</b> '+yaz(o.sonKarar.baslik)+(o.sonKarar.secimMetni?' — '+yaz(o.sonKarar.secimMetni):'')+'</p>':'<p class="od-not">Henüz bir iş yapmadın.</p>';
    for(const b of o.beklenen)ic+='<p><b>'+yaz(b.durumAdi)+'</b> '+yaz(b.metin)+' <span class="od-not">('+yaz(anYazi(b.tarih,b.dakika,b.saatsiz))+')</span></p>';
    if(o.yaklasan)ic+='<p><b>Yaklaşan</b> '+yaz(o.yaklasan.baslik)+' <span class="od-not">('+yaz(anYazi(o.yaklasan.tarih,o.yaklasan.dakika,o.yaklasan.saatsiz))+')</span></p>';
    return ic+'<div class="od-dugmeler"><button type="button" class="od-birincil" data-eylem="devam">Devam ▸</button></div></section>';
  }

  /* ---- telefon (2.8I): ana ekran → Mesajlar (kişi listesi → tek konuşma, iki cevap) / Canlı Skor; çizim js/ekran-telefon.js ----
     Telefon durumu (tel) oturumda kalır: dosyadan "◂ Mesaja dön" aynı konuşmaya döner. Konuşmayı açmak o konuların "yeni" işaretini kaldırır;
     cevap vermek ayrı bir eylemdir. Yeni haber açık konuşmayı değiştirmez */
  const tel={ekran:'ana',kisi:null,skorAc:false};
  let telAlta=false;
  function telefonPaneli(){
    const s=saymanVar();
    return telefonCiz(k,tel,{donus:donus?donusBolumu():'',secimler,onay,testSecenek,kasa:s?s.id:null,yeniler:yeniIsaret});
  }
  const saymanVar=()=>{const c=k.kulupler[kulupId()],id=c.yonetim&&c.yonetim.sayman;return id?k.kisiler[id]:null;};
  /* konuşmayı açınca: o kişinin konularındaki yeni mesajlar görüldü (zamanı ve geçmişi değiştirmez) */
  function konusmaAc(anahtar){
    tel.ekran='konusma';tel.kisi=anahtar;telAlta=true;
    const c=konusmaListesi(k).find(x=>x.anahtar===anahtar);
    /* bu açılışta yeni gelenler "yeni" diye işaretli kalır */
    yeniIsaret=new Set(c?c.mesajlar.filter(m=>m.yeni).map(m=>m.meseleId+':'+m.sira):[]);
    if(c)for(const id of c.meseleler){const m=k.meseleler[id];if(m&&m.olaylar.length>m.gorulen)try{komut(x=>meseleGoruldu(x,id));}catch(e){mesaj=e.message;}}
  }

  /* ---- ajanda (2.8I): hafif defter. Gün şeridi, seçili günün kısa saat–konu satırları, tek kaydın ayrıntısı ve yaklaşan son tarihler.
     Finans, bütün sözler ve girişim listesi burada değildir: kasa sayman konuşmasında ve mali dosyada, sözler dosyada,
     görüşme başlatmak ilgili kişinin konuşmasındadır. Ödeme yalnız kısa hatırlatma olarak satırda görünür ---- */
  const AJ_SIMGE={ajanda:'●',odeme:'₺',ekip:'↻',hatirlatma:'!'};
  function ajandaPaneli(){
    if(!ajandaGun||tarihKarsilastir(ajandaGun,k.tarih)<0)ajandaGun=k.tarih;
    const gunler=[0,1,2,3,4,5,6].map(n=>tarihEkle(k.tarih,n));
    if(!gunler.includes(ajandaGun))ajandaGun=k.tarih;
    let ic='';
    const bugunMu=ajandaGun===k.tarih,satirlar=bugunMu?bugun():ajandaGunu(k,ajandaGun);
    ic+='<div class="od-gunler" role="tablist" aria-label="Günler">'+gunler.map(t=>{const n=t===k.tarih?bugun().filter(r=>r.tur==='ajanda'&&r.durum==='bekliyor').length:ajandaGunu(k,t).filter(r=>r.tur==='ajanda').length;
      return'<button type="button" role="tab" data-eylem="gun" data-tarih="'+t+'" aria-selected="'+(t===ajandaGun?'true':'false')+'" aria-pressed="'+(t===ajandaGun?'true':'false')+'"><b>'+yaz(gunAdi(t).slice(0,3))+'</b> '+parca(t)[2]+(n?'<i class="od-rozet">'+n+'</i>':'')+'</button>';}).join('')+'</div>';
    if(!secili||!satirlar.some(r=>r.id===secili&&r.tur==='ajanda')){const b=satirlar.find(r=>r.tur==='ajanda'&&r.durum==='bekliyor');secili=b?b.id:null;}
    ic+='<h4>'+yaz(tarihYazi(ajandaGun))+(bugunMu?' <small>bugün</small>':'')+'</h4><ul class="od-liste od-sar">'+(satirlar.map(r=>{
      const x=k.isler[r.id],kisi=x&&x.veri&&x.veri.kisiId&&k.kisiler[x.veri.kisiId]?k.kisiler[x.veri.kisiId].ad:'';
      const sag=DURUM[r.durum]?'<span class="od-d-'+r.durum+'">'+DURUM[r.durum]+'</span>':r.zorunluluk?'<span class="od-etiket od-'+r.zorunluluk+'">'+ETIKET[r.zorunluluk]+'</span>':
        r.tutar!==undefined?'<span class="'+(r.tutar<0?'od-eksi':'')+'">'+tlYazi(r.tutar)+'</span>':'<span></span>';
      const ad='<span class="od-ad"><i class="od-ajSimge" aria-hidden="true">'+(r.karar?'?':AJ_SIMGE[r.tur]||'·')+'</i>'+yaz(r.baslik)+(kisi?' <span class="od-not">· '+yaz(kisi)+'</span>':'')+'</span>',bitti=r.durum!=='bekliyor'?' od-bitti':'';
      if(r.tur!=='ajanda')return'<li class="od-satir'+bitti+'"><span class="od-an">'+saatYazi(r.saat)+'</span>'+ad+sag+'</li>';
      return'<li><button type="button" class="od-satir'+bitti+'" data-is="'+r.id+'" aria-pressed="'+(r.id===secili&&r.durum!=='ertelendi'?'true':'false')+'">'+
        '<span class="od-an">'+aralik(r)+'</span>'+ad+sag+'</button></li>';}).join('')||'<li class="od-not">'+(bugunMu?'Bugün için iş yok.':'Bu gün için planlı iş yok.')+'</li>')+'</ul>';
    const r=satirlar.find(x=>x.id===secili&&x.tur==='ajanda'&&x.durum!=='ertelendi');
    if(r){
      const is=k.isler[r.id],v=is?is.veri:null;
      ic+='<section class="od-kutu"><h4>'+yaz(r.baslik)+(r.zorunluluk?' <span class="od-etiket od-'+r.zorunluluk+'">'+ETIKET[r.zorunluluk]+'</span>':'')+'</h4>'+
        '<p class="od-not">'+(bugunMu?aralik(r):saatYazi(r.saat))+(r.sure?' · '+r.sure+' dk':'')+(r.saatsiz?' · en geç '+(r.sonCevap.tarih===k.tarih?'':yaz(tarihKisa(r.sonCevap.tarih))+' ')+saatYazi(r.sonCevap.dakika):'')+
        (v&&v.kisiId?' · '+yaz(kisiYazi(v.kisiId)):'')+(v&&v.sonTarih?' · en geç '+yaz(tarihKisa(v.sonTarih)):'')+'</p>';
      if(v)ic+='<p>'+yaz(v.aciklama)+'</p>';
      if(r.durum==='yapildi'){
        if(r.secimMetni)ic+='<p><b>Kararın</b> '+yaz(r.secimMetni)+'</p>';
        ic+=r.bilgi?'<p><b>'+(r.secimMetni?'Sonuç':'Öğrendiklerin')+'</b> '+yaz(r.bilgi)+'</p>':'<p class="od-not">Yapıldı.</p>';
      }
      if(r.durum==='kacirildi')ic+='<p class="od-uyari">Bu işe katılmadın; kaçırıldı.</p>';
      /* bir konuya bağlı karar dosyadadır; ajanda yalnız randevuyu ve son cevap anını gösterir */
      const dosyada=r.meseleId&&k.meseleler[r.meseleId];
      if(dosyada)ic+='<p class="od-not">Konu: '+yaz(k.meseleler[r.meseleId].baslik)+'</p>'+(r.durum==='bekliyor'&&v&&v.karar?
        '<div class="od-dugmeler"><button type="button" class="od-birincil" data-eylem="dosyaAc" data-mesele="'+r.meseleId+'" data-donus="ajanda">Dosyada karar ver ▸</button>'+
          (v.zorunluluk==='ertelenebilir'?ertelemeDugmesi(is):'')+'</div>':'<div class="od-dugmeler"><button type="button" data-eylem="dosyaAc" data-mesele="'+r.meseleId+'" data-donus="ajanda">İlgili dosya ▸</button></div>');
      if(r.durum==='bekliyor'&&!(dosyada&&v&&v.karar))ic+=isBolumu(r.id);
      ic+='</section>';
    }
    /* hatırlatma: önümüzdeki günlerin son cevap ve ödeme tarihleri (ayrıntısı ilgili dosyada ve kasada) */
    const H=yaklasanlar(k,7).filter(x=>(x.tur==='ajanda'&&(x.veri.saatsiz||x.veri.zorunluluk==='zorunlu'))||x.tur==='odeme').slice(0,4);
    if(H.length)ic+='<h4>Yaklaşan tarihler</h4><ul class="od-liste od-sar" style="--an:10.4em">'+H.map(x=>'<li class="od-satir"><span class="od-an">'+yaz(tarihKisa(x.tarih))+' '+saatYazi(x.dakika)+'</span><span class="od-ad">'+
      (x.veri.saatsiz?'Son cevap: ':'')+yaz(isAdi(x))+'</span><span></span></li>').join('')+'</ul>';
    return ic+'<p class="od-not">Biriyle görüşme başlatmak için: <button type="button" class="od-baglanti" data-eylem="telKisiler">Telefon · Mesajlar ▸</button></p>';
  }
  function ertelemeDugmesi(is){const t=ertelemeTarihi(is);return'<button type="button" data-eylem="ertele" data-is="'+is.id+'"'+(t?'':' disabled')+'>'+(t?'Ertele → '+yaz(tarihKisa(t)):'Ertelenemez: son gün')+'</button>';}
  const SOZ_DURUM={acik:'Açık',tutuldu:'Tutuldu',bozuldu:'Bozuldu'};
  function sozlerBolumu(L,baslik){
    if(!L.length)return'';
    return'<h4>'+baslik+'</h4><ul class="od-kanit">'+L.map(s=>'<li><span class="od-an od-s-'+s.durum+'">'+SOZ_DURUM[s.durum]+'</span><span>'+yaz(sozMetni(k,s))+' <span class="od-not">— '+yaz(sozMuhatapAdi(k,s.muhatap))+'</span></span></li>').join('')+'</ul>';
  }

  /* ---- kasa: kulübün parası ve ödeme takvimi (ajandadan ve mali dosyalardan açılır) ---- */
  function kasaPaneli(){
    const d=kulupDurumu(k,kulupId()),m=d.mali;
    let ic='<dl class="od-dl"><dt>Kasadaki para</dt><dd><b>'+tlYazi(m.nakit)+'</b></dd><dt>Bekleyen gelir</dt><dd>'+tlYazi(m.bekleyenGelir)+'</dd>'+
      '<dt>Bekleyen gider</dt><dd class="'+(m.bekleyenGider<0?'od-eksi':'')+'">'+tlYazi(m.bekleyenGider)+'</dd><dt>Ödemelerden sonra</dt><dd>'+tlYazi(m.odemelerSonrasi)+'</dd>'+
      (d.yonetim?'<dt>Sayman</dt><dd class="'+(d.yonetim.sayman?'':'od-eksi')+'">'+(d.yonetim.sayman?yaz(d.yonetim.sayman.ad):'boş')+'</dd>':'')+'</dl>';
    const O=bekleyenIsler(k).filter(x=>x.tur==='odeme'&&!isGizli(x)).slice(0,8);
    ic+='<h4>Ödeme takvimi</h4><ul class="od-liste od-sar" style="--an:10.4em">'+(O.map(x=>'<li class="od-satir"><span class="od-an">'+yaz(tarihKisa(x.tarih))+' '+saatYazi(x.dakika)+'</span><span class="od-ad">'+yaz(x.veri.aciklama)+'</span>'+
      '<span class="'+(x.veri.tutar<0?'od-eksi':'')+'">'+tlYazi(x.veri.tutar)+'</span></li>').join('')||'<li class="od-not">Bekleyen ödeme yok.</li>')+'</ul>';
    const mali=acikMeseleler().filter(x=>kategori(x)[0]==='Mali');
    if(mali.length)ic+='<p class="od-not">İlgili dosya: '+mali.map(x=>'<button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+x.id+'">'+yaz(x.baslik)+'</button>').join(' · ')+'</p>';
    return ic;
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
    return'<p class="od-not">Futbolcuların gizli özellikleri (1–99) '+testKutu('Gelişim sistemi henüz olmadığı için değerler sabittir; yayında gösterilmeyecek.')+'</p>'+
      '<table class="od-kadro"><thead><tr><th>No</th><th>Futbolcu</th>'+Q.ozellikler.map(x=>'<th title="'+yaz(x)+'">'+yaz(x.slice(0,3))+'</th>').join('')+'<th>Ort</th></tr></thead><tbody>'+
      Q.oyuncular.map(o=>'<tr'+(o.yedek?' class="od-yedek"':'')+'><td>'+o.no+'</td><td>'+yaz(o.ad)+(o.yedek?' <small>'+yaz(o.mevki)+'</small>':'')+'</td>'+o.oz.map(x=>'<td>'+x+'</td>').join('')+'<td><b>'+o.ortalama+'</b></td></tr>').join('')+'</tbody></table>';
  }

  /* ---- dosya: tek konu; önceki/sıradaki dosya, sayaçlar ve ayrı arşiv ---- */
  function dosyaPaneli(){
    const L=meseleler();
    if(!L.length)return'<p class="od-not">Açık dosya yok.</p>';
    if(dosyaArsiv){
      const A=arsivListesi();
      return'<h4>Arşiv <small>kapanan konular</small></h4>'+(A.length?'<ul class="od-kanit">'+A.map(m=>'<li><span class="od-an">'+(m.kapanis?yaz(tarihKisa(m.kapanis.tarih)):'')+'</span><span>'+kategoriYazi(m)+' '+
        '<button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+m.id+'">'+yaz(m.baslik)+'</button></span></li>').join('')+'</ul>':'<p class="od-not">Henüz kapanan konu yok.</p>');
    }
    const S=acikSira();
    if(!seciliMesele||!k.meseleler[seciliMesele])seciliMesele=S[0]||L[0].id;
    const o=meseleOzeti(k,seciliMesele),m=o.mesele;
    let ic='';
    if(donusYeri&&donusYeri.panel==='telefon')ic+='<p><button type="button" class="od-baglanti" data-eylem="donus">◂ Mesaja dön</button></p>';
    else if(donusYeri&&donusYeri.panel==='ajanda')ic+='<p><button type="button" class="od-baglanti" data-eylem="donus">◂ Ajandaya dön</button></p>';
    ic+='<p class="od-dosyaUst">'+kategoriYazi(m)+'<span class="od-etiket od-m-'+m.durum+'">'+yaz(o.durumAdi)+'</span>'+
      (testAcik()?testKutu('gizli koşullar<br>'+testKosullar(k).map(x=>yaz(x.ad+': '+x.deger)).join('<br>')):'')+'</p>';
    ic+='<h4 class="od-dosyaBaslik">'+yaz(m.baslik)+'</h4>';
    const st=m.durum!=='kapandi'?sonTarih(o):'';
    /* ilgili kişi (kararı soran, yoksa konudaki ilk kişi) portresiyle; ardından kısa konu ve iki büyük cevap */
    const kis=o.karar&&k.isler[o.karar.isId]?k.isler[o.karar.isId].veri:null,yuz=k.kisiler[(kis&&(kis.soran||kis.kisiId))||(o.kisiler[0]&&o.kisiler[0].id)];
    ic+='<div class="od-kisiSatir">'+(yuz?portreHtml(yuz,'od-portre'):'')+'<p class="od-not">'+(yuz?'<b>'+yaz(yuz.ad)+'</b> · '+yaz(kisiRolu(k,yuz))+'<br>':'')+
      'Yürüten: '+(o.sorumlu?yaz(o.sorumlu.ad):'—')+(st?' · <b>'+yaz(st)+'</b>':'')+'</p></div>';
    if(dosyaSonuc&&dosyaSonuc.meseleId===m.id)ic+='<section class="od-kutu od-sonuc"><h4>Sonuç</h4><p>'+yaz(dosyaSonuc.metin)+'</p>'+(o.adimlar.length&&!o.karar?'<p class="od-not">Beklenen: '+yaz(o.adimlar[0].metin)+' ('+yaz(anYazi(o.adimlar[0].tarih,o.adimlar[0].dakika,o.adimlar[0].saatsiz))+')</p>':'')+'</section>';
    if(o.karar)ic+=isBolumu(o.karar.isId);
    else{
      if(o.olaylar.length)ic+='<section class="od-neOldu"><h4>Ne oldu?</h4>'+neOldu(o).map(x=>'<p>'+yaz(x)+'</p>').join('')+'</section>';
      if(m.durum!=='kapandi'){
        ic+=o.adimlar.length?'<p><b>Bekleyen</b> '+o.adimlar.map(a=>yaz(a.metin)+(a.tutar!==undefined?' '+yaz(tlYazi(a.tutar)):'')+' <span class="od-not">('+yaz(anYazi(a.tarih,a.dakika,a.saatsiz))+')</span>').join(' · ')+'</p>':'';
        ic+='<p><b>Şimdi</b> Yapılacak bir şey yok; haber için ilerle.</p>';
      }
    }
    if(o.bilgiler.length)ic+='<section class="od-kutu"><h4>Bilinenler</h4><ul class="od-bilinen">'+o.bilgiler.slice(-4).map(x=>'<li>'+yaz(x.metin)+' <span class="od-an">— '+yaz(x.kaynak)+'</span></li>').join('')+'</ul></section>';
    const olay=typeof meseleOlayi==='function'?meseleOlayi(k,m.id):null;
    if(olay&&typeof olaySozleri==='function')ic+=sozlerBolumu(olaySozleri(k,olay.id),'Sözler');
    if(kategori(m)[0]==='Mali')ic+='<p class="od-not">Para durumu: <button type="button" class="od-baglanti" data-eylem="ac" data-panel="kasa">Kasa ▸</button></p>';
    ic+='<details class="od-gecmis"><summary>Geçmiş ve belgeler ('+o.olaylar.length+')</summary><ul class="od-kanit">'+o.olaylar.slice().reverse().map(x=>'<li><span class="od-an">'+yaz(tarihKisa(x.tarih).split(' ').slice(0,2).join(' ')+' '+saatYazi(x.dakika))+'</span><span>'+yaz(x.metin)+'</span></li>').join('')+'</ul></details>';
    return ic;
  }
  /* dosyanın alt kenarı: önceki/sıradaki açık dosya, sayaçlar, arşiv */
  function dosyaAlti(){
    const S=acikSira(),c=sayaclar(),i=S.indexOf(seciliMesele),n=S.length,A=arsivListesi().length;
    const hedef=d=>n?S[i<0?0:(i+d+n)%n]:null,dug=(d,ad)=>{const h=hedef(d);return'<button type="button" data-eylem="dosyaAc" data-mesele="'+(h||'')+'" data-gezinti="1"'+(!h||(n<2&&i>=0)?' disabled':'')+'>'+ad+'</button>';};
    return dug(-1,'◂ Önceki dosya')+'<span class="od-sayac" title="açık · cevap bekleyen · takipte"><b>'+c.acik+'</b> açık · <b>'+c.cevap+'</b> cevap bekleyen · <b>'+c.takip+'</b> takipte</span>'+
      '<button type="button" data-eylem="arsiv" aria-pressed="'+(dosyaArsiv?'true':'false')+'"'+(A||dosyaArsiv?'':' disabled')+'>Arşiv ('+A+')</button>'+dug(1,'Sıradaki dosya ▸');
  }

  /* ---- ayarlar: Okuma, Kayıt, Geliştirici (2.8J: sakin hareket bütün oyunun standardıdır; hareket ayarı yoktur) ---- */
  function ayarPaneli(){
    const B=[['okuma','Okuma'],['kayit','Kayıt'],['gelistirici','Geliştirici']];
    if(!B.some(b=>b[0]===ayarBolum))ayarBolum='okuma';
    let ic='<div class="od-sekmeler" role="tablist">'+B.map(([a,ad])=>'<button type="button" role="tab" data-eylem="ayarBolum" data-bolum="'+a+'" aria-selected="'+(ayarBolum===a?'true':'false')+'" aria-pressed="'+(ayarBolum===a?'true':'false')+'">'+ad+'</button>').join('')+'</div>';
    const ac=(a,deger)=>'<button type="button" data-eylem="'+a+'" aria-pressed="'+(deger?'true':'false')+'">'+(deger?'Açık':'Kapalı')+'</button>';
    if(ayarBolum==='okuma')ic+='<div class="od-ayarSatir"><span>Yazı büyüklüğü</span><span class="od-dugmeler"><button type="button" data-eylem="yazi" data-yazi="normal" aria-pressed="'+(ayarlar.yazi!=='buyuk'?'true':'false')+'">Normal</button>'+
      '<button type="button" data-eylem="yazi" data-yazi="buyuk" aria-pressed="'+(ayarlar.yazi==='buyuk'?'true':'false')+'">Büyük</button></span></div>';
    else if(ayarBolum==='kayit')ic+='<div class="od-ayarSatir"><span>Kayıt durumu</span><span class="'+(oyun.kayitHata()?'od-uyari':'')+'">'+yaz(oyun.kayitYazi())+'</span></div>'+
      '<p class="od-not">Oyun her tamamlanan karardan sonra kendiliğinden kaydeder. Maçın ortasından kayıt yoktur.</p>'+
      '<div class="od-dugmeler"><button type="button" data-eylem="kayitDene">Şimdi yeniden kaydet</button></div>'+
      '<div class="od-ayarSatir"><span>Yeni kariyer</span><span class="od-dugmeler">'+(yeniOnay?'<button type="button" class="od-tehlike" data-eylem="yeniEvet">Evet, bu kariyeri bırak ve yenisini başlat</button><button type="button" data-eylem="yeniHayir">Vazgeç</button>'
        :'<button type="button" data-eylem="yeniSor">Yeni kariyer…</button>')+'</span></div>';
    else ic+='<p class="od-not">Geliştirme aşamasının araçları; yayından önce kaldırılacak.</p>'+
      '<div class="od-ayarSatir"><span>Test bilgileri</span>'+ac('test',!!ayarlar.test)+'</div>'+
      '<p class="od-not">Açıkken ilgili satırlarda küçük TEST simgesi belirir: yönetici katkıları, gizli koşullar, seçeneklerin sonucu ve futbolcu özellikleri.</p>'+
      '<div class="od-dugmeler">'+(testAcik()?'<button type="button" data-eylem="ac" data-panel="kadro">Kadro (TEST) ▸</button>':'')+
        '<button type="button" data-eylem="goruntu">Görüntüyü kaydet</button></div>'+
      '<p class="od-not">Görüntüyü kaydet o anki 3B sahneyi PNG olarak indirir (paneller dahil değildir); kariyeri ve kaydı değiştirmez.</p>';
    return ic;
  }

  /* balkonda: antrenmanın durumu ve gözlem */
  function gozlemSeridi(){
    if(!gozlemVar||ODA.yer!=='balkon')return'';
    const d=antrenmanDurumu(k);
    let ic;
    if(izleme)ic='<p><b>İzliyorsun</b> <span class="od-not">kalan '+gozlemKalan(k)+' dk'+(duraklatmaVar()?' · duraklatıldı':acik?' · panel açıkken gözlem bekler':'')+'</span></p>'+
      '<div class="od-dugmeler"><button type="button" data-eylem="gozlemBirak">Gözlemi bırak</button></div>';
    else if(gozlemAcik(k))ic='<p><b>Gözlem durdu</b> <span class="od-not">kalan '+gozlemKalan(k)+' dk · karar verirken zaman durur</span></p><div class="od-dugmeler">'+
      (()=>{const e=ilerleOnizle(k).engel.filter(x=>/Önce karar ver/.test(x));return'<button type="button" class="od-birincil" data-eylem="gozlemSurdur"'+(e.length?' disabled':'')+'>Gözleme devam et ▸</button>'+(e.length?'<small class="od-uyari">'+yaz(e[0])+'</small>':'');})()+
      '<button type="button" data-eylem="gozlemBirak">Gözlemi bırak</button></div>';
    else if(d.suruyor){
      const S=[[15,'15 dk'],[30,'30 dk'],[d.kalan,'Sonuna kadar']].filter((x,i,L)=>x[0]<=d.kalan&&L.findIndex(y=>y[0]===x[0])===i);
      const O=S.map(x=>({dk:x[0],ad:x[1],o:gozlemOnizle(k,x[0])})),engel=O.length&&O.every(x=>x.o.engel.length)?O[0].o.engel[0]:null,kisa=O.find(x=>!x.o.engel.length&&x.o.kisaldi&&x.o.sure<x.dk);
      ic='<p><b>Antrenman sürüyor</b> <span class="od-not">'+saatYazi(d.pencere.bit)+'\'ye kadar · izlemek isteğe bağlı</span></p><div class="od-dugmeler">'+
        O.map(x=>'<button type="button" data-eylem="gozlem" data-dk="'+x.dk+'"'+(x.o.engel.length?' disabled':'')+'>İzle: '+x.ad+'</button>').join('')+'</div>'+
        (engel?'<small class="od-uyari">'+yaz(engel)+'</small>':kisa?'<small class="od-not">'+yaz(kisa.o.kisaldi)+'; gözlem o zaman biter.</small>':'');
    }else ic='<p><b>Saha boş</b> <span class="od-not">'+(d.pencere?(k.gunIciDakika<d.pencere.bas?'Antrenman '+saatYazi(d.pencere.bas)+'\'te':'Bugünkü antrenman bitti'):'Bugün antrenman yok')+'</span></p>';
    return'<section class="od-gozlem" aria-label="Antrenman">'+ic+'</section>';
  }
  /* sıradaki durak ve alt şerit */
  function durakYazi(o){
    const t=anTarih(o.hedef),an=tarihKisa(t.tarih)+' '+saatYazi(t.dakika);
    return an+(o.neden==='sonCevap'?' · son cevap saati: '+o.durak.veri.baslik:o.neden==='haber'?' · beklediğin görüş gelecek':o.neden==='cevapsiz'?' · cevap vermediğin karar kapanır':o.durak?' · '+o.durak.veri.baslik:o.neden==='cakisma'?' · günün işleri çakışıyor, seçim gerekecek':' · bekleyen rutin işler');
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
        if(o.cevapsiz.length)p.push('Cevapsız kalacak: '+o.cevapsiz.map(x=>x.veri.baslik+' ('+zamanAsimiMetni(k,x)+')').join(', '));
      }
      durum=p.join(' · ');
      const sor=(o.kacirilacak.length||o.cevapsiz.length)&&onay!=='ilerle';
      dugme=onay==='ilerle'?'<button type="button" data-eylem="vazgec">Vazgeç</button><button type="button" class="od-ana" data-eylem="ilerle">Onayla ▸</button>'
        :'<button type="button" class="od-ana" data-eylem="'+(sor?'ilerleSor':'ilerle')+'"'+(o.engel.length?' disabled':'')+'>İlerle ▸</button>';
    }
    return'<footer class="od-alt"><div class="od-altYazi"><p class="od-mesaj" aria-live="polite">'+yaz(mesaj)+'</p><p class="od-durak">'+yaz(durum)+'</p></div>'+dugme+'</footer>';
  }

  function odayiBildir(){
    const [,a,g]=parca(k.tarih);
    const iz=izler(),dk=k.gunIciDakika;
    if(balkonVar){const p=typeof antrenmanPenceresi==='function'?antrenmanPenceresi(k,k.tarih):null;balkonDurum({antrenman:!!p&&dk>=p.bas&&dk<p.bit,dakika:dk});}
    odaDurum({haber:haberSayisi()+(donus?1:0),dosya:acikMeseleler().length>0,gun:String(g),ay:AYLAR[a-1].slice(0,3),gunAdi:gunAdi(k.tarih).slice(0,3),dakika:dk,
      gazete:!!iz.gazete||!!iz.kart,gazeteYeni:iz.yeniHaber>0,kart:!!iz.kart,iskele:iz.iskele,panoNotu:iz.panoNotu});
    odaOdak(acik in NESNE?acik:null);
  }
  /* duraklatmada süre tüketen ya da dünyayı değiştiren komutlar kapalıdır; okuma ve gezinti açıktır (2.8B) */
  const DURAKLATMADA_KAPALI=new Set(['yap','yapSor','ertele','ilerle','ilerleSor','tavsiye','girisim','gozlem','gozlemSurdur','gozlemBirak','yer','yeniSor','yeniEvet','bozukYeni']);
  const duraklatDegistir=()=>{if(duraklatmaVar('elle'))duraklatmaKaldir('elle');else duraklatmaEkle('elle');};
  let cizilenPanel=null;
  function ciz(odak){
    k=oyun.kariyer;
    /* aynı panel yeniden çizilirken okuma yeri korunur */
    const eski=kap.querySelector('.od-icerik'),kaydirma=eski&&cizilenPanel===acik?eski.scrollTop:0;
    const eskiTel=kap.querySelector('.tel-govde'),telKaydirma=eskiTel&&cizilenPanel==='telefon'&&acik==='telefon'&&eskiTel.parentNode.dataset.ekran===tel.ekran?eskiTel.scrollTop:null;
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
    const baslik={telefon:'Telefon',ajanda:'Ajanda',dosya:'Dosya',gazete:'Gazete',ayar:'Ayarlar',kadro:'Kadro (TEST)',kasa:'Kasa'}[acik];
    const icerik=acik==='telefon'?telefonPaneli():acik==='ajanda'?ajandaPaneli():acik==='dosya'?dosyaPaneli():acik==='gazete'?gazetePaneli():acik==='ayar'?ayarPaneli():acik==='kadro'?kadroPaneli():acik==='kasa'?kasaPaneli():'';
    const panelAlt=acik==='dosya'&&dosyaVar?'<footer class="od-panelAlt">'+dosyaAlti()+'</footer>':'';
    kap.innerHTML='<header class="od-ust"><span>'+yaz(k.kulupler[kulupId()].ad)+' · Başkan '+yaz(b?b.ad:'')+'</span>'+
      '<span class="od-ustSag"><span class="od-kayit'+(oyun.kayitHata()?' od-uyari':'')+'">'+yaz(oyun.kayitYazi())+'</span>'+(oyun.kayitTamam()?'':' <button type="button" class="od-kucuk od-tehlike" data-eylem="kayitDene">Yeniden kaydet</button>')+
        '<button type="button" class="od-duraklat" data-eylem="duraklat" aria-pressed="'+(duraklatmaVar('elle')?'true':'false')+'" title="Duraklat (P ya da boşluk)">'+(duraklatmaVar('elle')?'Devam ▸':'Duraklat')+'</button></span></header>'+
      '<div class="od-tarih" title="Okurken ve düşünürken zaman durur"><b>'+yaz(tarihYazi(k.tarih))+'</b><span>'+saatYazi(k.gunIciDakika)+'</span></div>'+
      '<nav class="od-nesneler" aria-label="Masadakiler">'+dugme('telefon',haber?String(haber):'',karar?'od-rozetAcil':'')+dugme('ajanda',is?String(is):'')+
        dugme('dosya',karar?'karar':'',karar?'od-rozetAcil':'',!dosyaVar)+(gazeteVar?dugme('gazete',iz.yeniHaber?'yeni':''):'')+
        /* balkona çıkış kapının kendisidir (tıkla ya da 5); klavye için görünmez, odakta beliren düğme. Balkonda dönüş düğmesi görünür */
        (balkonVar?(ODA.yer==='balkon'?'<button type="button" class="od-nesne od-yer" data-eylem="yer">Odaya dön</button>':
          '<button type="button" class="od-nesne od-yer od-gizli" data-eylem="yer">Balkona çık (kapı · 5)</button>'):'')+
        '<button type="button" class="od-nesne od-kucuk" data-eylem="ac" data-panel="ayar" aria-pressed="'+(acik==='ayar'?'true':'false')+'">Ayarlar</button></nav>'+gozlemSeridi()+
      (acik?'<section class="od-panel'+(acik==='kadro'?' od-genis':acik==='telefon'?' od-telefonPanel':acik==='dosya'?' od-dosyaPanel':'')+'" role="dialog" aria-label="'+baslik+'"><header><h3>'+baslik+'</h3><button type="button" class="od-kapat" data-eylem="kapat" title="Kapat (Esc)">Kapat ×</button></header><div class="od-icerik">'+icerik+'</div>'+panelAlt+'</section>':'')+
      altSerit();
    odayiBildir();
    if(duraklatmaVar())for(const d of kap.querySelectorAll('button[data-eylem]'))if(DURAKLATMADA_KAPALI.has(d.dataset.eylem)){d.disabled=true;d.title='Duraklatıldı: devam edince kullanılabilir';}
    const yeni=kap.querySelector('.od-icerik');if(yeni&&kaydirma)yeni.scrollTop=kaydirma;
    /* telefonda konuşma açılınca son mesaj ve cevap kartı görünür; aynı konuşma yeniden çizilirken okuma yeri korunur */
    const tg=kap.querySelector('.tel-govde');
    if(tg){if(telAlta){tg.scrollTop=tg.scrollHeight;telAlta=false;}else if(telKaydirma!==null)tg.scrollTop=telKaydirma;}
    cizilenPanel=acik;
    const f=odak&&kap.querySelector(odak);if(f&&!f.disabled)f.focus({preventScroll:true});
  }

  /* ---- eylemler ---- */
  /* donusPanel: dosya telefondan ya da ajandadan açıldıysa "◂ Mesaja dön"/"◂ Ajandaya dön" aynı konuşmaya, aynı güne döner */
  /* koru: telefon dosyadan dönülerek açılıyorsa aynı konuşmada kalır; masadan açılınca ana ekranla açılır */
  function panelAc(ad,mesele,donusPanel,koru){
    if(ad==='dosya'&&!meseleler().length)return;
    if(ad==='gazete'&&!izler().gazete&&!izler().kart)return;
    if(ad==='dosya'){donusYeri=donusPanel?{panel:donusPanel}:mesele&&acik==='dosya'?donusYeri:null;if(mesele)dosyaArsiv=false;
      /* masadan açılınca: seçili konu kapandıysa cevap bekleyen ilk açık dosyaya (yoksa ilk açık dosyaya) geçilir */
      const cur=!mesele&&k.meseleler[seciliMesele];
      if(!mesele&&(!cur||cur.durum==='kapandi')){const S=acikSira();seciliMesele=S.find(id=>k.meseleler[id].durum==='kararBekliyor')||S[0]||seciliMesele;}}
    if(ad==='telefon'&&!koru&&acik!=='telefon'){tel.ekran='ana';tel.kisi=null;yeniIsaret=new Set();}
    if(ad==='telefon'&&koru&&tel.ekran==='konusma')telAlta=true;
    acik=ad;onay=null;
    if(mesele)seciliMesele=mesele;
    if(izleme)izlemeKaydet();
    if(ad==='dosya'){
      /* dosyayı açmak o konunun "yeni" işaretini kaldırır; görüldü kaydı zamanı ve geçmişi değiştirmez. Telefonda yeni işaret konuşma açılınca kalkar */
      const hedef=seciliMesele&&k.meseleler[seciliMesele]?seciliMesele:acikSira()[0]||meseleler()[0].id;
      for(const m of meseleler().filter(m=>m.id===hedef))if(m.olaylar.length>m.gorulen)try{komut(x=>meseleGoruldu(x,m.id));}catch(e){mesaj=e.message;}
    }
    if(ad==='gazete'&&izler().yeniHaber)try{komut(x=>haberlerGoruldu(x));}catch(e){mesaj=e.message;}
    ciz('.od-kapat');
  }
  function kapat(){acik=null;onay=null;yeniOnay=false;ciz('.od-ana');}
  /* balkon ↔ oda: yürüyüş yalnız sunumdur; odaya dönerken açık gözlem kapanır */
  function yerDegistir(){
    if(!balkonVar||ODA.yer==='yolda')return;
    acik=null;onay=null;izlemeDurdur();
    if(ODA.yer==='balkon'){
      if(gozlemVar&&gozlemAcik(k))try{const n=komut(x=>gozlemBitir(x));mesaj='Gözlemi bıraktın.'+(n?' '+n:'');}catch(e){mesaj=e.message;}
      odaYuru('masa',()=>ciz('.od-ana'));
    }else odaYuru('balkon',()=>ciz('.od-ana'));
    ciz();
  }
  function gozlemSonucu(r){
    mesaj=r.neden==='karar'?'Telefon çaldı: karar gerektiren bir haber var. Gözlem durdu, '+r.kalan+' dk kaldı.':r.neden==='haber'?'Beklediğin görüş geldi. Gözlem durdu, '+r.kalan+' dk kaldı.'
      :'Antrenmanı izledin.'+(r.not?' '+r.not:'');
    ciz();
  }
  function hataGoster(e){mesaj=e.message;onay=null;ciz();}
  /* geliştirici: o anki 3B sahneyi PNG olarak indirir (paneller dahil değil); kariyeri ve kaydı değiştirmez */
  function goruntuKaydet(){
    try{
      if(typeof odaCiz==='function')odaCiz();
      const a=document.createElement('a');a.href=renderer.domElement.toDataURL('image/png');
      a.download='chairman-'+k.tarih+'-'+saatYazi(k.gunIciDakika).replace(':','')+'.png';document.body.appendChild(a);a.click();a.remove();
      mesaj='Görüntü kaydedildi (indirilenler klasörü).';
    }catch(e){mesaj='Görüntü kaydedilemedi: '+e.message;}
    ciz('[data-eylem="goruntu"]');
  }
  function isiYap(id){
    const is=k.isler[id];if(!is)return;
    const baslik=is.veri.baslik,mac=is.veri.eylem==='macGunu',bas=saatYazi(is.dakika),saatsiz=!!is.veri.saatsiz,karar=!!is.veri.karar;
    try{komut(x=>ajandaIsiYap(x,id,secimler[id]),mac);}catch(e){hataGoster(e);return;}
    onay=null;
    if(k.isler[id]){
      /* yolda karar gerektiren bir haber geldi: iş yerinde bekliyor, o ana kadarki ilerleme geçerli */
      if(mac)oyun.yenidenKaydet();
      mesaj=baslik+' için yola çıktın; yolda karar gerektiren bir haber geldi. İş bekliyor.';ciz();return;
    }
    delete secimler[id];
    if(mac){acik=null;oyun.macaGit();return;}
    /* kararın sonucu aynı dosyada kısa görünür; otomatik sonraki dosyaya geçilmez */
    if(is.veri.meseleId){const g=k.gecmis.slice().reverse().find(x=>x.tur==='is'&&x.isId===id),r=g&&g.sonuc;
      if(r&&(r.bilgi||r.secimMetni))dosyaSonuc={meseleId:is.veri.meseleId,metin:(r.secimMetni?r.secimMetni+(r.bilgi?' — ':''):'')+(r.bilgi||'')};}
    mesaj=baslik+' ('+(saatsiz?'karar':bas)+') tamamlandı.';
    ciz();
  }
  function ilerleOzeti(r){
    const p=[];
    for(const g of r.biten){
      if(g.isTuru==='odeme'){const h=k.hareketler.find(x=>x.id===g.sonuc.hareketId);if(h)p.push(h.aciklama+' '+tlYazi(h.tutar));}
      else if(g.isTuru==='ajanda'&&g.sonuc&&g.sonuc.durum==='kacirildi')p.push(g.sonuc.baslik+' kaçırıldı');
      else if(g.isTuru==='ajanda'&&g.sonuc&&g.sonuc.durum==='cevapsiz')p.push(g.sonuc.baslik+': cevapsız kaldı'+(g.sonuc.bilgi?' — '+g.sonuc.bilgi:''));
      else if(g.isTuru==='hatirlatma'&&g.sonuc)p.push(g.sonuc.metin);
    }
    const bas=r.neden==='karar'?'Telefon: karar gerektiren bir haber geldi.':r.neden==='haber'?'Beklediğin görüş geldi; dosyada.':r.neden==='sonCevap'?'Son cevap saati geldi; karar bekliyor. Cevap vermeden ilerlersen kartta yazan sonuç işler.':r.neden==='cevapsiz'?'Cevap vermediğin karar kartta yazan sonuçla kapandı.':r.neden==='randevu'?'Sıradaki randevuya gelindi.':r.neden==='cakisma'?'Günün işleri çakışıyor; ajandadan seçim yap.':'Bekleyen rutin işler işlendi.';
    return bas+(haberSayisi()&&r.neden!=='karar'&&r.neden!=='haber'?' Telefonda yeni haber var.':'')+(izler().yeniHaber?' Masada gazete var.':'')+(p.length?' '+p.join(' · '):'');
  }
  function ilerleEylem(){
    izleme=null;
    let r;
    try{r=komut(x=>{if(gozlemVar&&x.gozlem)gozlemBitir(x);return duragaIlerle(x);});}catch(e){hataGoster(e);return;}
    onay=null;secili=null;
    mesaj=ilerleOzeti(r);
    /* açık panel kapanır: oyuncu yeni duruma odadan bakar; haber paneli kendiliğinden açmaz */
    acik=null;ciz('.od-ana');
  }
  kap.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(!b){
      /* odaya tıklama: imlecin altındaki nesne açılır; boş yere tıklamak paneli kapatır; yürürken tıklamak yürüyüşü bitirir */
      if(e.target===kap){if(balkonVar&&ODA.yer==='yolda'){if(!duraklatmaVar())odaYuruAtla();return;}const ad=ODA.uzerinde;if(ad==='kapi'){if(!duraklatmaVar())yerDegistir();}else if(ad)panelAc(ad);else if(acik)kapat();else ciz();}
      return;
    }
    if(b.disabled)return;
    const id=b.dataset.is,ey=b.dataset.eylem,ms=b.dataset.mesele;
    if(ey==='duraklat'){duraklatDegistir();return;}
    if(duraklatmaVar()&&DURAKLATMADA_KAPALI.has(ey))return;
    if(ey==='testAc'){const u=b.parentNode,a=!u.classList.contains('acik');u.classList.toggle('acik',a);b.setAttribute('aria-expanded',a?'true':'false');return;}
    if(ey==='devam'){donus=false;ciz('.od-kapat');return;}
    if(!ey&&id){secili=id;onay=null;ciz('button.od-satir[data-is="'+id+'"]');return;}
    if(ey==='ac'){if(acik===b.dataset.panel)kapat();else panelAc(b.dataset.panel);}
    else if(ey==='dosyaAc'){if(b.dataset.gezinti)donusYeri=null;panelAc('dosya',ms,b.dataset.donus);}
    else if(ey==='donus'){const d=donusYeri;donusYeri=null;if(d)panelAc(d.panel,null,null,true);}
    else if(ey==='arsiv'){dosyaArsiv=!dosyaArsiv;ciz('[data-eylem="arsiv"]');}
    /* telefon gezintisi: zaman ve kariyer değişmez (konuşmayı açmak yalnız "yeni" işaretini kaldırır) */
    else if(ey==='telUyg'){tel.ekran=b.dataset.uyg;tel.skorAc=false;onay=null;ciz('.tel-geri');}
    else if(ey==='telEv'){tel.ekran='ana';tel.kisi=null;onay=null;ciz('.tel-uygMesaj');}
    else if(ey==='telKisi'){onay=null;konusmaAc(b.dataset.kisi);ciz('.tel-geri');}
    else if(ey==='telKisiler'){tel.ekran='mesajlar';panelAc('telefon',null,null,true);}
    else if(ey==='skorAc'){tel.skorAc=!tel.skorAc;ciz('[data-eylem="skorAc"]');}
    else if(ey==='gun'){ajandaGun=b.dataset.tarih;secili=null;onay=null;ciz('[data-eylem="gun"][data-tarih="'+ajandaGun+'"]');}
    else if(ey==='ayarBolum'){ayarBolum=b.dataset.bolum;yeniOnay=false;ciz('[data-eylem="ayarBolum"][data-bolum="'+ayarBolum+'"]');}
    else if(ey==='goruntu')goruntuKaydet();
    else if(ey==='kapat')kapat();
    else if(ey==='yap')isiYap(id);
    else if(ey==='sec'){secimler[id]=b.dataset.secim;onay=null;ciz('[data-eylem="sec"][data-secim="'+b.dataset.secim+'"]');}
    else if(ey==='yapSor'){onay='yap:'+id;ciz('[data-eylem="yap"]');}
    else if(ey==='ertele'){try{const t=komut(x=>ajandaErtele(x,id));mesaj=k.gecmis[k.gecmis.length-1].baslik+' '+tarihYazi(t)+' gününe ertelendi.';secili=null;onay=null;ciz();}catch(x){hataGoster(x);}}
    else if(ey==='ilerleSor'){onay='ilerle';ciz('[data-eylem="ilerle"]');}
    else if(ey==='ilerle')ilerleEylem();
    else if(ey==='vazgec'){onay=null;ciz();}
    else if(ey==='kayitDene'){const s=oyun.yenidenKaydet();mesaj=s.tamam?'Kayıt yazıldı.':'Kayıt yine yazılamadı.';ciz();}
    else if(ey==='yer')yerDegistir();
    else if(ey==='gozlem'){try{komut(x=>gozlemAc(x,Number(b.dataset.dk)));acik=null;mesaj='Antrenmanı izliyorsun; saat akıyor. Telefon çalarsa gözlem durur.';izlemeBaslat();ciz();}catch(x){hataGoster(x);}}
    else if(ey==='gozlemSurdur'){if(gozlemAcik(k)){acik=null;mesaj='Gözleme devam ediyorsun.';izlemeBaslat();ciz();}}
    else if(ey==='gozlemBirak'){izleme=null;try{const n=komut(x=>gozlemBitir(x));mesaj='Gözlemi bıraktın.'+(n?' '+n:'');ciz();}catch(x){hataGoster(x);}}
    else if(ey==='tavsiye'){try{mesaj=komut(x=>tavsiyeIste(x,id));ciz();}catch(x){hataGoster(x);}}
    else if(ey==='girisim'){try{mesaj=komut(x=>girisimBaslat(x,b.dataset.girisim));secili=null;ajandaGun=k.tarih;ciz();}catch(x){hataGoster(x);}}
    else if(ey==='test'){ayarlar.test=!ayarlar.test;ayarlar.kaydet();ciz('[data-eylem="test"]');}
    else if(ey==='yazi'){ayarlar.yazi=b.dataset.yazi;ayarlar.kaydet();ciz('[data-eylem="yazi"][data-yazi="'+ayarlar.yazi+'"]');}
    else if(ey==='yeniSor'){yeniOnay=true;ciz('[data-eylem="yeniHayir"]');}
    else if(ey==='yeniHayir'){yeniOnay=false;ciz();}
    else if(ey==='yeniEvet'){yeniOnay=false;mesaj=oyun.yeniKariyer();k=oyun.kariyer;acik=null;secili=null;seciliMesele=null;secimler={};donus=false;
      dosyaSira=[];dosyaArsiv=false;dosyaSonuc=null;donusYeri=null;ajandaGun=null;tel.ekran='ana';tel.kisi=null;yeniIsaret=new Set();ciz('.od-ana');}
    else if(ey==='bozukYeni'){mesaj=oyun.bozuguSaklaVeBasla();k=oyun.kariyer;ciz('.od-ana');}
  });
  /* imleç odadaki nesnenin üzerindeyken çerçevesi yanar ve el imleci görünür */
  kap.addEventListener('pointermove',e=>{
    if(e.target!==kap){if(ODA.uzerinde){odaIsaret(null);kap.style.cursor='';}return;}
    const r=kap.getBoundingClientRect(),ad=odaIsaret((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));
    kap.style.cursor=ad?'pointer':'';kap.title=ad==='kapi'?'Balkona çık (5)':ad?NESNE[ad]:'';
  });
  kap.addEventListener('pointerleave',()=>{odaIsaret(null);kap.style.cursor='';});
  addEventListener('keydown',e=>{
    if(kap.hidden||oyun.bozukHata||e.ctrlKey||e.altKey||e.metaKey)return;
    const t=e.target&&e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;
    const ad={Digit1:'telefon',Digit2:'ajanda',Digit3:'dosya',Digit4:'gazete'}[e.code];
    if(ad){e.preventDefault();if(acik===ad)kapat();else panelAc(ad);}
    else if(e.code==='Digit5'&&balkonVar){e.preventDefault();if(!duraklatmaVar())yerDegistir();}
    else if(e.code==='KeyP'||(e.code==='Space'&&t!=='BUTTON'&&!e.repeat)){e.preventDefault();duraklatDegistir();}
    else if(e.code==='Escape'&&acik){e.preventDefault();kapat();}
    else if((e.code==='BracketLeft'||e.code==='BracketRight')&&acik==='dosya'&&!dosyaArsiv){
      const S=acikSira(),n=S.length,i=S.indexOf(seciliMesele);if(!n||(n<2&&i>=0))return;
      e.preventDefault();donusYeri=null;panelAc('dosya',S[i<0?0:(i+(e.code==='BracketLeft'?-1:1)+n)%n]);}
  });
  /* duraklatma değişince düğmeler yeniden çizilir; izlerken o ana kadarki gözlem kaydedilir */
  duraklatmaDinle(a=>{if(kap.hidden||oyun.bozukHata)return;if(a&&izleme)izlemeKaydet();ciz();});
  addEventListener('pagehide',()=>{if(izleme)izlemeKaydet();});
  /* kayıttan dönüşte süren bir gözlem varsa başkan balkondadır */
  if(gozlemVar&&gozlemAcik(k))odaYerAyarla('balkon');
  return{ciz,ac:panelAc,kapat,yer:yerDegistir,get acik(){return acik;}};
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
      macaGit:()=>{kap.hidden=true;ON_EKRAN.bulteniAc();},
      donus:OYUN.donus,ilkMesaj:OYUN.mesaj,get bozukHata(){return OYUN.bozukHata;},bozuguSaklaVeBasla:oyunBozuguSakla
    },OYUN.ayarlar);
    kap.hidden=false;ekran.ciz('.od-ana');
  }else kap.hidden=true;
}
