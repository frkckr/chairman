/* ============ Chairman — oda ekranı: başkan odasında telefon, ajanda ve dosya (yol haritası 2.5) ============
   Görüntü katmanı. Oda (js/oda.js) görünür kalır; gündem masadaki nesnelerden ya da aynı adlı düğmelerden açılır. Aynı anda tek nesne açıktır:
     Telefon  sağ panelde cihaz: kişi konuşmaları ve Canlı Skor (js/ekran-telefon.js; "Kaldığın yer" 2.8L'de kaldırıldı).
     Ajanda   odanın ortasında iki sayfalı açık defter (2.8M, js/ekran-defter.js): hafta, günün saatleri, tek kaydın kartı.
     Dosya    odanın ortasında açık karton dosya (2.8M, js/ekran-dosya.js): konu sekmeleri, kanıtlar, kişi ve tek karar kartı (H1). Mesele yoksa masada dosya yoktur.
     Gazete   yalnız çıkmış bir haber varken masadadır: manşet ve gelen teşekkür (js/soz.js).
   Ajandada ayrıca başkanın başlatabileceği girişimler ve verdiği sözler listelenir (js/yonetim.js, js/soz.js).
   Test bilgileri (ayarlar.test; GEÇİCİ, js/test-gorunum.js): katkı seviyeleri, gizli koşullar, seçenek sonuç önizlemesi ve kadro özellikleri
   ilgili satırdaki küçük "TEST" simgesinden açılan kutuda gösterilir (2.8A); ayar kapalıyken hiçbiri ekrana yazılmaz.
   Kural içermez: içerik js/ajanda.js ve js/mesele.js'in okuma işlevlerinden gelir, değişiklikler oyun.komut ile aynı kariyer komutlarına gider.
   Paneli açmak, kapamak ve nesneler arasında geçmek zamanı ilerletmez; yalnız "yeni" işaretini kaldırır.
   Önemli haber paneli kendiliğinden açmaz: telefon yanar, alt şeritte yazılır. Aynı anda tek panel açıktır.
   odaEkraniKur(kap, oyun, ayarlar):
     oyun    {kariyer, komut(f, kaydetme), kayitYazi(), kayitHata(), kayitTamam(), kayitCakisma() (R1-a: başka pencere ilerledi; Yeniden kaydet gösterilmez), yenidenKaydet(), yeniKariyer() → mesaj, macaGit(macId, {izle}?),
              ilkMesaj, bozukHata, bozuguSaklaVeBasla() → mesaj}
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
  const ROL={baskan:'başkan',teknikDirektor:'teknik direktör',yardimciAntrenor:'yardımcı antrenör',maliMudur:'mali işler müdürü',yonetici:'yönetici',eskiBaskan:'eski başkan'};
  const NESNE={telefon:'Telefon',ajanda:'Ajanda',dosya:'Dosya',gazete:'Gazete'};   /* H2-d: Kasa kalktı (kullanıcı isteği 1–2) */
  const ODAK_BOY={telefon:'cihaz',ajanda:'genis',dosya:'genis',gazete:'genis',kadro:'genis',karar:'orta',ayar:'kucuk'};   /* U1: odak kabının genişliği (STIL.kagit.odak.boy) */
  const testAcik=()=>!!ayarlar.test&&typeof testOnizleme==='function';
  /* test bilgisi: küçük TEST simgesi; üzerine gelince, odakta ya da tıklayınca altında kutu açılır (salt okunur, kariyeri değiştirmez) */
  const testKutu=ic=>'<span class="od-testIpucu"><button type="button" class="od-testSimge" data-eylem="testAc" aria-expanded="false" aria-label="Test bilgisi">TEST</button>'+
    '<span class="od-test" role="tooltip">'+ic+'</span></span>';

  /* onizleler: karar kartında önizlenen yön, karar başına ('sol'|'sag'|null; H1, tek kart). Yalnız görünümdür; yeniden çizimde, panel ve konuşma
     değişince korunur (aynı karar telefonda ve dosyada aynı yüzle görünür). onay yalnız Katıl / Stada git / İlerle'nin onay adımıdır (karar değil) */
  let k=oyun.kariyer,acik=null,secili=null,seciliMesele=null,onay=null,mesaj=oyun.ilkMesaj||'',yeniOnay=false,onizleler={},yeniIsaret=new Set();
  let iceOnay=null;   /* R1-b: seçilen kayıt dosyası onay bekliyor: {metin, ozet, gecisler} */
  /* U3 göz atma: odaktaki işi bırakmadan yanında okunan ikinci kâğıt ({tur:'gun'|'kasa'|'oyuncu', tarih, dakika, sure, oyuncu, isId} ya da null).
     Kartın bağlam satırındaki bağlantıyla açılır (js/ekran-kart.js), içinde eylem yoktur (inert); Esc ve ‹ Geri önce onu kapatır, iş yerinde kalır */
  let goz=null;
  function komut(f,kaydetme){const s=oyun.komut(f,kaydetme);k=oyun.kariyer;return s;}
  const kulupId=()=>k.kisiler[k.baskanId].kulupId;
  const kisiYazi=id=>{const p=k.kisiler[id];return p?p.ad+' ('+(ROL[p.rol]||p.rol)+')':'';};
  const aralik=r=>r.saatsiz?'şimdi':saatYazi(r.saat)+(r.sure?'–'+saatYazi((r.saat+r.sure)%1440):'');
  const isAdi=x=>x.tur==='odeme'?x.veri.aciklama+' '+tlYazi(x.veri.tutar):isBasligi(k,x);
  const anYazi=(tarih,dakika,saatsiz)=>tarihKisa(tarih)+' '+(saatsiz?'en geç ':'')+saatYazi(dakika);
  const bugun=()=>ajandaGunu(k,k.tarih);
  const macIsi=()=>bugun().find(r=>r.durum==='bekliyor'&&r.eylem==='macGunu');
  const meseleler=()=>meseleListesi(k);
  /* H2-d: mali işler müdürünün raporları (yeniden eskiye) ve görülmemiş olanı */
  const raporlar=()=>typeof maliRaporlari==='function'?maliRaporlari(k):[],yeniRapor=()=>{const R=raporlar();return R.length&&!R[0].h.gorulen?R[0]:null;};   /* inceleme (H2-e): yalnız en yeni rapor “yeni”dir; eskisi onun altında kalır */
  const kadroAcilir=()=>typeof kadroVar==='function'&&kadroVar(k);   /* S-c: Dosya'nın Kadro sekmesi (konu ve rapor yokken de dosya açılır) */
  const raporlariGor=()=>{if(!raporlar().some(x=>!x.h.gorulen))return;try{komut(x=>{for(const r of maliRaporlari(x))if(!r.h.gorulen)raporGoruldu(x,r.i);});}catch(e){mesaj=e.message;}};
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
        if(r.yeni&&r.yeni.length){mesaj=r.yeni.map(s=>gozlemSinyalMetni(k,s)).filter(Boolean).join(' ');ciz();   /* S-b: görülen sinyal şeritte */
          if(typeof metinDuyur==='function')metinDuyur(mesaj);}   /* inceleme: oda yeniden çizildiği için .od-mesaj duyurulmaz (js/ekran-kart.js) */
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
    rozetYaz();
    odayiBildir();
  }
  /* inceleme (H2-e): gözlemi kesmeyen haber (yazışma cevabı, rapor) menünün rozetini yerinde yakar; düğmeler yeniden kurulmaz, odak kalır */
  function rozetYaz(){
    const karar=kararBekleyen().length,haber=haberSayisi(),is=bekleyenIsSayisi();
    const yaz1=(ad,rozet,sinif)=>{const d=kap.querySelector('.od-nesne[data-panel="'+ad+'"]');if(!d)return;let i=d.querySelector('.od-rozet');
      if(!rozet){if(i)i.remove();return;}if(!i){i=document.createElement('i');d.appendChild(i);}i.className='od-rozet'+(sinif?' '+sinif:'');i.dataset.rozet=rozet==='yeni'||rozet==='karar'?rozet:'sayi';if(i.textContent!==rozet)i.textContent=rozet;};
    yaz1('telefon',haber?String(haber):'',karar?'od-rozetAcil':'');yaz1('ajanda',is?String(is):'');
    yaz1('dosya',karar?'karar':yeniRapor()?'yeni':'',karar?'od-rozetAcil':'');
    const d=kap.querySelector('.od-nesne[data-panel="dosya"]');if(d)d.disabled=!(meseleler().length>0||raporlar().length>0||kadroAcilir());
  }
  const izler=()=>typeof odaIzleri==='function'?odaIzleri(k):{gazete:null,kart:null,yeniHaber:0,iskele:false,panoNotu:false};

  /* TEST: seçeneğin gizli katkısı (aday seçimi) ve üreteceği sonuç (kopya üzerinde denenir) */
  function testSecenek(isId,s){
    if(!testAcik())return'';
    let ic='';
    const kid=s.kisiId||s.id,kt=k.kisiler[kid]?testKisi(k,kid):null;
    if(kt)ic+='katkı: '+kt.map(x=>yaz(x.alan+' '+x.seviye)).join(' · ')+'<br>';
    /* F6-a: kişi kaydı olmayan seçeneğin gizli verisi (ör. hoca adayının bilgi ve ısrarı; s.gizli, yalnız bu kutuda) */
    if(s.gizli&&typeof s.gizli==='object')ic+='gizli: '+Object.entries(s.gizli).map(([a,x])=>yaz(a+' '+x)).join(' · ')+'<br>';
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
    /* karar: tek kart (js/ekran-kart.js; H1). Kaydırıp bırakınca ya da ←/→ + Enter ile uygulanır (kartEtkilesimKur, aşağıda); onay adımı yoktur.
       "Görüş iste" ve erteleme kartın dışında, altında */
    if(v.karar)return kararKarti(k,id,{onizle:onizleler[id]||null,gorus:true,testSecenek,dosyada:acik==='dosya',gozAt:true,ipucu:true})+tavsiyeBolumu(id)+
      (v.zorunluluk==='ertelenebilir'?'<div class="od-dugmeler">'+ertelemeDugmesi(is)+'</div>':'');
    const o=ajandaOnizle(k,id);
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
  const kategori=meseleKategorisi;
  const kategoriYazi=m=>{const [ad,s]=kategori(m);return'<span class="od-kategori"><i class="od-kSimge" aria-hidden="true">'+yaz(s)+'</i>'+yaz(ad)+'</span>';};
  /* dosya sırası bu oturumda sabittir: yeni mesele sona eklenir, gelen haber sırayı ve açık dosyayı değiştirmez */
  let dosyaKadro=false,seciliOyuncu=null;   /* S-c: dosyanın Kadro görünümü ve açık oyuncu dosyası (oyuncu kimliği); Raporlar ve Arşiv ile birbirini dışlar */
  let dosyaRapor=false,seciliRapor=null;   /* H2-d: dosyanın Raporlar görünümü ve seçili rapor (haberler dizisindeki sıra); Arşiv ile birbirini dışlar */
  let dosyaSira=[],dosyaArsiv=false,dosyaSonuc=null,donusYeri=null,ajandaGun=null,ajandaHafta=0,ayarBolum='okuma';
  function siraGuncelle(){const L=meseleler().map(m=>m.id);dosyaSira=dosyaSira.filter(id=>L.includes(id)).concat(L.filter(id=>!dosyaSira.includes(id)));}
  const acikSira=()=>{siraGuncelle();return dosyaSira.filter(id=>k.meseleler[id].durum!=='kapandi');};
  const arsivListesi=()=>meseleler().filter(m=>m.durum==='kapandi');
  /* son tarih: başkandan beklenen kararın son cevap anı, yoksa bekleyen ilk adım */
  function sonTarih(o){
    if(o.karar){const x=k.isler[o.karar.isId];return x?'Son cevap: '+anYazi(x.tarih,x.dakika,false):'';}
    const a=o.adimlar[0];return a?'Beklenen: '+anYazi(a.tarih,a.dakika,a.saatsiz):'';
  }
  /* "Ne oldu?": konunun ilk olayı ve son iki gelişmesi (en çok üç cümle) */
  function neOldu(o){const L=o.olaylar;return(L.length<=3?L:[L[0]].concat(L.slice(-2))).map(x=>x.metin);}
  /* ---- telefon (2.8I): ana ekran → Mesajlar (kişi listesi → tek konuşma, iki cevap) / Canlı Skor; çizim js/ekran-telefon.js ----
     Telefon durumu (tel) oturumda kalır: dosyadan "◂ Mesaja dön" aynı konuşmaya döner. Konuşmayı açmak o konuların "yeni" işaretini kaldırır;
     cevap vermek ayrı bir eylemdir. Yeni haber açık konuşmayı değiştirmez */
  const tel={ekran:'ana',kisi:null,skorAc:null,skorSekme:'maclar',hafta:null,kulup:null,oyuncuSec:null};   /* H2-b: skorAc açık Canlı Skor satırının maç kimliği; S-d: lig sekmesi, fikstür haftası, kulüp ekranı; R2-e: oyuncu seçimi açık konu */
  const telLigSifirla=()=>{tel.skorSekme='maclar';tel.hafta=null;tel.kulup=null;};
  /* telefonun görünüm anahtarı: aynı görünüm yeniden çizilirken okuma yeri korunur (S-d: Canlı Skor'da sekme ve hafta, kulüp ekranında kulüp) */
  const telAnahtar=()=>tel.ekran+(tel.ekran==='skor'?':'+(tel.skorSekme||'maclar')+':'+(tel.hafta||''):tel.ekran==='kulup'?':'+tel.kulup:tel.ekran==='konusma'?':'+tel.kisi:'');
  /* R2 (2026-10-29): odada iki sütun (solda telefon, sağda iş paneli); balkonda tek telefon (iş sağ yarıda, R5) */
  const telIkiSutun=()=>!(balkonVar&&ODA.yer==='balkon');
  /* R2-b: konuşma başına okuma yeri (oturumda): {y, alt}. Konuşma yeniden açılınca yer geri gelir; arada yeni mesaj geldiyse ilk yeni mesaja kayar.
     telAcYeri: bu çizimde uygulanacak açılış kuralı {kisi, yeni} (konusmaAc kurar) */
  const telOkuma=new Map();let telAcYeri=null;
  let cizilenTel=null,telSkorYeri=0;   /* inceleme: kulüp ekranına geçerken Canlı Skor'un okuma yeri */
  const telSkorYeriGeri=id=>{const g=kap.querySelector('.tel-govde');if(!g)return;g.scrollTop=telSkorYeri;const f=g.querySelector('[data-eylem="kulupAc"][data-kulup="'+id+'"]');
    if(f){const a=g.getBoundingClientRect(),b=f.getBoundingClientRect();if(b.top<a.top)g.scrollTop-=a.top-b.top;else if(b.bottom>a.bottom)g.scrollTop+=b.bottom-a.bottom;}};
  /* telGecis: telefonda ekran değişti (kısa açılış geçişi yalnız o çizimde; N7) */
  let telAlta=false,telGecis=false;
  function telefonPaneli(){
    const acilis=telGecis;telGecis=false;
    if(!telIkiSutun())return telefonCiz(k,tel,{onizleler,testSecenek,yeniler:yeniIsaret,acilis,gozAt:true});
    /* R2-a: telefon yalnız konuşmayı taşır; kararlar, bekleme ve konular sağdaki iş panelinde (konuşma dışında Bekleyenler). Sekme sırası telefon, sonra panel */
    return'<div class="tlf"><div class="tlf-sol">'+telefonCiz(k,tel,{onizleler,testSecenek,yeniler:yeniIsaret,acilis,ikiSutun:true})+'</div>'+telefonIsPaneli(k,tel,{onizleler,testSecenek})+'</div>';
  }
  function telAnaEkran(){tel.ekran='ana';tel.kisi=null;tel.oyuncuSec=null;telLigSifirla();onay=null;telGecis=true;ciz('.tel-uygMesaj');}
  /* konuşmayı açınca: o kişinin konularındaki yeni mesajlar görüldü (zamanı ve geçmişi değiştirmez) */
  function konusmaAc(anahtar){
    if(tel.kisi!==anahtar)tel.oyuncuSec=null;
    tel.ekran='konusma';tel.kisi=anahtar;
    const c=konusmaListesi(k).find(x=>x.anahtar===anahtar);
    /* bu açılışta yeni gelenler "yeni" diye işaretli kalır */
    yeniIsaret=new Set(c?c.mesajlar.filter(m=>m.yeni).map(m=>m.meseleId+':'+m.sira):[]);
    telAcYeri={kisi:anahtar,yeni:yeniIsaret.size>0};   /* R2-b: yeni mesaj varsa ilk yenisine, yoksa son okunan yere (ilk açılışta en alta) */
    if(c)for(const id of c.meseleler){const m=k.meseleler[id];if(m&&m.olaylar.length>m.gorulen)try{komut(x=>meseleGoruldu(x,id));}catch(e){mesaj=e.message;}}
    /* H2-c: yazışmanın yeni cevabı görüldü (kişinin okunan anı; js/yazisma.js) */
    if(c&&c.mesajlar.some(m=>m.yeni&&m.meseleId===null)&&typeof yazismaGoruldu==='function')try{komut(x=>yazismaGoruldu(x,anahtar));}catch(e){mesaj=e.message;}
  }

  /* ---- ajanda (2.8M): iki sayfalı açık defter (çizim js/ekran-defter.js). Sol sayfa hafta, sağ sayfa seçili günün saatleri; kayda tıklayınca
     altta kısa kart açılır. Finans, bütün sözler ve girişim listesi burada değildir (kasa sayman konuşmasında ve mali dosyada, sözler dosyada) ---- */
  function ajandaAyrinti(r,bugunMu){
    const is=k.isler[r.id],v=is?is.veri:null;
    let ic='<section class="dft-ayrinti"><h4>'+yaz(r.baslik)+(r.zorunluluk?' <span class="od-etiket od-'+r.zorunluluk+'">'+ETIKET[r.zorunluluk]+'</span>':'')+
      (DURUM[r.durum]?' <span class="od-d-'+r.durum+'">'+DURUM[r.durum]+'</span>':'')+'</h4>'+
      '<p class="od-not">'+(bugunMu?aralik(r):saatYazi(r.saat))+(r.sure?' · '+r.sure+' dk':'')+(r.saatsiz?' · en geç '+(r.sonCevap.tarih===k.tarih?'':yaz(tarihKisa(r.sonCevap.tarih))+' ')+saatYazi(r.sonCevap.dakika):'')+
      (v&&v.kisiId?' · '+yaz(kisiYazi(v.kisiId)):'')+(v&&v.sonTarih?' · en geç '+yaz(tarihKisa(v.sonTarih)):'')+'</p>';
    if(v)ic+='<p>'+yaz(v.aciklama)+'</p>';
    if(r.durum==='yapildi'){
      if(r.secimMetni)ic+='<p><b>Kararın</b> '+yaz(r.secimMetni)+'</p>';
      ic+=r.bilgi?'<p><b>'+(r.secimMetni?'Sonuç':'Öğrendiklerin')+'</b> '+yaz(r.bilgi)+'</p>':'';
    }
    if(r.durum==='kacirildi')ic+='<p class="od-uyari">Bu işe katılmadın; kaçırıldı.</p>';
    if(r.durum==='ertelendi')ic+='<p class="od-not">'+yaz(tarihKisa(r.yeni))+' gününe ertelendi.</p>';
    /* 2.8Q: ajanda yalnız gösterir. Bir konuya bağlı karar dosyadadır; katılma, erteleme ve karar alt şeritten yapılır */
    if(r.meseleId&&k.meseleler[r.meseleId])ic+='<p class="od-not">Konu: '+yaz(k.meseleler[r.meseleId].baslik)+'</p>';
    if(r.durum==='bekliyor'&&v&&bugunMu)ic+='<p class="dft-ipucu">'+(v.karar?'Cevabın bekleniyor: alttaki “Karar ver”.':v.eylem==='macGunu'?'Alttaki “Stada git” ile maç günü başlar.':'Katılmak ya da ertelemek için alttaki şerit.')+'</p>';
    return ic+'</section>';
  }
  function ajandaPaneli(){
    /* gösterilen hafta: bu hafta (0) ya da en çok iki hafta sonrası; seçili gün o haftada değilse haftanın ilk uygun günü */
    const pzt=tarihEkle(k.tarih,7*ajandaHafta-((new Date(k.tarih+'T00:00:00Z').getUTCDay()+6)%7)),son=tarihEkle(pzt,6);
    if(!ajandaGun||tarihKarsilastir(ajandaGun,pzt)<0||tarihKarsilastir(ajandaGun,son)>0)ajandaGun=ajandaHafta?pzt:k.tarih;
    /* seçili gün yoksa o günün bekleyen ilk randevusu seçilir */
    const R=ajandaGunu(k,ajandaGun);
    if(!secili||!R.some(r=>r.id===secili&&r.tur==='ajanda')){const b=R.find(r=>r.tur==='ajanda'&&r.durum==='bekliyor');secili=b?b.id:null;}
    return defterGorunumu(k,{gun:ajandaGun,hafta:ajandaHafta,secili,ayrinti:ajandaAyrinti},{yaz,tarihYazi,tarihKisa});
  }
  function ertelemeDugmesi(is){const t=ertelemeTarihi(is);return'<button type="button" data-eylem="ertele" data-is="'+is.id+'"'+(t?'':' disabled')+'>'+(t?'Ertele → '+yaz(tarihKisa(t)):'Ertelenemez: son gün')+'</button>';}
  const SOZ_DURUM={acik:'Açık',tutuldu:'Tutuldu',bozuldu:'Bozuldu'};
  function sozlerBolumu(L,baslik){
    if(!L.length)return'';
    return'<h4>'+baslik+'</h4><ul class="od-kanit">'+L.map(s=>'<li><span class="od-an od-s-'+s.durum+'">'+SOZ_DURUM[s.durum]+'</span><span>'+yaz(sozMetni(k,s))+' <span class="od-not">— '+yaz(sozMuhatapAdi(k,s.muhatap))+'</span></span></li>').join('')+'</ul>';
  }

  /* H2-d (2026-10-26): kasa paneli kalktı; mali bilgi mali işler müdürünün raporuyla dosyada (js/mali-rapor.js, js/ekran-dosya.js Raporlar) */
  /* S-e (2026-10-27): günlük gazete (js/gazete.js gazeteSayisi): künye, manşet, haberler, kutular ve sayılar arasında gezinti ([ ve ]); altta masadaki
     not (teşekkür kartı) ve eski kayıtların haber kayıtları. gazeteGun: açık sayının tarihi (null: son sayı) */
  let gazeteGun=null;
  const gazeteGosterilen=()=>{const son=izler().sayi;return son?(gazeteGun&&gazeteGun<son?gazeteGun:son):null;};
  /* inceleme: sayı değişince odak aynı yöndeki gezinti düğmesinde kalır; uca gelindiyse öbürüne geçer */
  const gazeteOdak=geri=>{const t=gazeteGosterilen(),g=!!t&&!!gazeteSayisi(k,tarihEkle(t,-1)),i=!!t&&tarihEkle(t,1)<=izler().sayi;
    return'.gz-gezinti [data-yon="'+(geri?(g?'geri':'ileri'):(i?'ileri':'geri'))+'"]';};
  function gazetePaneli(){
    const t=gazeteGosterilen(),G=t&&typeof gazeteSayisi==='function'?gazeteSayisi(k,t):null;
    const konu=m=>m&&k.meseleler[m]?'<p class="od-not gz-konu">Konu: <button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+m+'">'+yaz(k.meseleler[m].baslik)+'</button></p>':'';
    let ic='';
    /* U5: gazete sayfası (js/ekran-gazete.js): künye, manşet, sütunlar, yan kutular, eski sayıda sararma, “Sayı n / N” */
    if(G){const son=izler().sayi,sonG=son?gazeteSayisi(k,son):null;
      ic=gazeteGorunumu(k,G,{yaz,tarihYazi,konu,son,sonNo:sonG?sonG.no:null,onceVar:!!gazeteSayisi(k,tarihEkle(G.tarih,-1)),sonraVar:!!son&&tarihEkle(G.tarih,1)<=son});}
    const H=(k.haberler||[]).filter(h=>h.tur!=='rapor'&&(h.tur!=='gazete'||!G)).slice().reverse();   /* H2-d: rapor dosyadadır; S-e: gazete kayıtları sayının içinde (eskileri geçmişten kurulur) */
    if(!G&&!H.length)return'<p class="od-not">Masada gazete yok.</p>';
    return ic+(H.length?(G?'<h4>Masadaki notlar</h4>':'')+
      H.map(h=>'<section class="od-kutu'+(h.tur==='gazete'?' od-gazete':'')+'"><h4>'+yaz(haberBasligi(k,h))+' <small>'+yaz(tarihKisa(h.tarih))+'</small></h4><p'+(h.tur==='gazete'?' class="od-manset"':'')+'>'+yaz(haberMetni(k,h))+'</p>'+
      (h.olayId&&k.olaylar[h.olayId]&&k.meseleler[k.olaylar[h.olayId].meseleId]?'<p class="od-not">Konu: <button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+k.olaylar[h.olayId].meseleId+'">'+yaz(k.meseleler[k.olaylar[h.olayId].meseleId].baslik)+'</button></p>':'')+'</section>').join(''):'');
  }
  function kadroPaneli(){
    const Q=testKadro(kulupId(),k);
    if(!Q)return'<p class="od-not">Kadro verisi yok.</p>';
    const H=Q.hoca?'<p class="od-not">Hoca: '+yaz(Q.hoca.ad)+' · tarz '+yaz(typeof TARZ_ARKETIP!=='undefined'&&TARZ_ARKETIP[Q.hoca.tarz]?TARZ_ARKETIP[Q.hoca.tarz].ad:Q.hoca.tarz)+' · bilgi '+Math.round(Q.hoca.bilgi*100)+' · ısrar '+Math.round(Q.hoca.israr*100)+' '+testKutu('Hocanın gizli değerleri (0–100): bilgi oyuncuları ne kadar doğru tanıdığı, ısrar son on bire bağlılığı; yayında gösterilmeyecek.')+'</p>':'';   /* F3-a */
    return H+'<p class="od-not">Futbolcuların gizli özellikleri (1–99) '+testKutu('S-a: gelişim haftalık işler; kondisyon (Kon) ve form gizlidir, yayında gösterilmeyecek.'+(Q.program?' Bugün: '+Q.program.tur+'.':''))+'</p>'+
      '<table class="od-kadro"><thead><tr><th>No</th><th>Futbolcu</th>'+Q.ozellikler.map(x=>'<th title="'+yaz(x)+'">'+yaz(x.slice(0,3))+'</th>').join('')+'<th>Ort</th><th title="Kondisyon (gizli)">Kon</th><th title="Form (gizli)">Frm</th></tr></thead><tbody>'+
      Q.oyuncular.map(o=>'<tr'+(o.yedek?' class="od-yedek"':'')+'><td>'+o.no+'</td><td>'+yaz(o.ad)+(o.yedek?' <small>'+yaz(o.mevki)+'</small>':'')+'</td>'+o.oz.map(x=>'<td>'+x+'</td>').join('')+'<td><b>'+o.ortalama+'</b></td><td>'+(o.kon==null?'—':o.kon)+'</td><td>'+(o.form==null?'—':o.form)+'</td></tr>').join('')+'</tbody></table>';
  }

  /* ---- dosya (2.8M): masada açık karton dosya (çizim js/ekran-dosya.js). Üstte açık konuların sekmeleri ve arşiv; [ ve ] ile gezilir ---- */
  function dosyaPaneli(){
    const L=meseleler(),S=acikSira();
    if(!seciliMesele||!k.meseleler[seciliMesele])seciliMesele=S[0]||(L[0]&&L[0].id)||null;
    const olayi=id=>typeof meseleOlayi==='function'?meseleOlayi(k,id):null;
    const R=raporlar();if(dosyaRapor&&R.length&&(seciliRapor===null||!R.some(x=>x.i===seciliRapor)))seciliRapor=R[0].i;
    return dosyaGorunumu(k,{kadro:dosyaKadro||!L.length&&!R.length,seciliOyuncu,secili:seciliMesele,sira:S,arsiv:!dosyaRapor&&(dosyaArsiv||!S.length&&!(seciliMesele&&k.meseleler[seciliMesele])&&!R.length),rapor:dosyaRapor||!S.length&&!(seciliMesele&&k.meseleler[seciliMesele])&&!dosyaArsiv&&R.length>0,seciliRapor,sonuc:dosyaSonuc,donus:donusYeri&&donusYeri.panel,
      karar:isId=>isBolumu(isId)},
      {yaz,kategoriYazi,tarihKisa,anYazi,sonTarih,neOldu,tlYazi,maliBaglantisi:m=>kategori(m)[0]==='Mali',
       oyuncuTest:testAcik()?id=>{const p=k.oyuncular[id];if(!p)return'';const h=p.hal;   /* S-c: gizli değerler yalnız TEST kutusunda */
         return testKutu('gizli (TEST)<br>özellik ortalaması '+Math.round(p.oz.reduce((a,b)=>a+b,0)/p.oz.length)+'<br>kondisyon '+(typeof oyuncuKondisyonu==='function'?oyuncuKondisyonu(k,p,k.tarih):'—')+' · form '+(h?h.form:0)+'<br>tavan '+(h?h.tav:'—')+' · birikim '+(h?h.gel:'—'));}:null,
       testKutu:testAcik()?()=>testKutu('gizli koşullar<br>'+testKosullar(k).map(x=>yaz(x.ad+': '+x.deger)).join('<br>')):null,
       sozler:o=>{const ol=olayi(o.mesele.id);return ol&&typeof olaySozleri==='function'?sozlerBolumu(olaySozleri(k,ol.id),'Sözler'):'';}});
  }

  /* ---- ayarlar: Okuma, Maç, Kayıt, Geliştirici (2.8J: sakin hareket bütün oyunun standardıdır; hareket ayarı yoktur). U1 (2026-10-12): Maç —
     izleme hızı (maçtaki üst şeritle aynı seçim) ve önemli anlarda normal hız ---- */
  /* R1-b: kaydı dışa ve içe aktarma (Ayarlar › Kayıt). Dosya seçici panelde gizli durur; seçilen dosya önce doğrulanır, onaydan sonra yazılır */
  const tasimaAnYazi=z=>z&&z.tarih?gunAyYazi(z.tarih)+' '+saatYazi(z.dakika|0):'—';
  function kayitTasimaHtml(){
    const b=(k&&k.kisiler[k.baskanId])||{},c=(k&&k.kulupler[b.kulupId])||{};
    let ic='<div class="od-ayarSatir"><span>Kaydı taşı</span><span class="od-dugmeler"><button type="button" data-eylem="kayitDisa">Kaydı dışa aktar</button>'+
      '<button type="button" data-eylem="kayitIce">Kayıt dosyası yükle…</button></span></div>'+
      '<input type="file" class="od-iceDosya" accept=".json,application/json" hidden tabindex="-1" aria-hidden="true">';
    if(iceOnay){const z=iceOnay.ozet;
      ic+='<div class="od-iceOnay" role="group" aria-label="Kayıt dosyasını yükle">'+
        '<p>Dosyadaki kariyer: <b>'+yaz((z.kulup||'—')+' · '+(z.baskan||'—'))+'</b>, '+yaz(tasimaAnYazi(z))+(iceOnay.gecisler.length?' (eski sürüm: '+yaz(iceOnay.gecisler.join(', '))+')':'')+'</p>'+
        '<p>Şimdiki kariyer: '+yaz((c.ad||'—')+' · '+(b.ad||'—'))+', '+yaz(tasimaAnYazi(k&&{tarih:k.tarih,dakika:k.gunIciDakika}))+'</p>'+
        '<p class="od-not">Yüklenince şimdiki kayıt yedek olarak saklanır ve oyun dosyadaki kariyerle yeniden açılır.</p>'+
        '<span class="od-dugmeler"><button type="button" class="od-tehlike" data-eylem="kayitIceYukle">Yükle</button><button type="button" data-eylem="kayitIceVazgec">Vazgeç</button></span></div>';}
    return ic+'<p class="od-not">Dışa aktarılan dosya kaydın kendisidir; başka bir bilgisayarda ya da tarayıcıda “Kayıt dosyası yükle” ile açılır.</p>';
  }
  function kayitDisaAktar(){
    const d=oyun.kayitDisa();if(!d){mesaj='Dışa aktarılacak kayıt yok.';return;}
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([d.metin],{type:'application/json'}));a.download=d.ad;a.hidden=true;
    document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);
    mesaj='Kayıt dosyası indirildi: '+d.ad;
  }
  async function kayitDosyasiSecildi(g){
    const f=g.files&&g.files[0];g.value='';if(!f)return;
    if(f.size>KAYIT_ICE_AZAMI){mesaj='Kayıt dosyası açılamadı: dosya çok büyük (en çok 20 MB).';iceOnay=null;ciz();return;}
    let metin;try{metin=await f.text();}catch(e){mesaj='Kayıt dosyası okunamadı: '+e.message;ciz();return;}
    const o=oyun.kayitIceOnizle(metin);
    if(!o.tamam){mesaj='Kayıt dosyası açılamadı: '+o.hata;iceOnay=null;ciz();return;}
    iceOnay={metin,ozet:o.ozet,gecisler:o.gecisler};mesaj='';ciz('[data-eylem="kayitIceVazgec"]');
  }
  function ayarPaneli(){
    const B=[['okuma','Okuma'],['mac','Maç'],['kayit','Kayıt'],['gelistirici','Geliştirici']];
    if(!B.some(b=>b[0]===ayarBolum))ayarBolum='okuma';
    let ic='<div class="od-sekmeler" role="tablist">'+B.map(([a,ad])=>'<button type="button" role="tab" data-eylem="ayarBolum" data-bolum="'+a+'" aria-selected="'+(ayarBolum===a?'true':'false')+'" aria-pressed="'+(ayarBolum===a?'true':'false')+'">'+ad+'</button>').join('')+'</div>';
    const ac=(a,deger)=>'<button type="button" data-eylem="'+a+'" aria-pressed="'+(deger?'true':'false')+'">'+(deger?'Açık':'Kapalı')+'</button>';
    if(ayarBolum==='okuma')ic+='<div class="od-ayarSatir"><span>Yazı büyüklüğü</span><span class="od-dugmeler"><button type="button" data-eylem="yazi" data-yazi="normal" aria-pressed="'+(ayarlar.yazi!=='buyuk'?'true':'false')+'">Normal</button>'+
      '<button type="button" data-eylem="yazi" data-yazi="buyuk" aria-pressed="'+(ayarlar.yazi==='buyuk'?'true':'false')+'">Büyük</button></span></div>';
    else if(ayarBolum==='mac'){const h=[1,2,4].includes(ayarlar.macHizi)?ayarlar.macHizi:1;
      ic+='<div class="od-ayarSatir"><span>Maç hızı</span><span class="od-dugmeler">'+[1,2,4].map(v=>'<button type="button" data-eylem="macHizi" data-hiz="'+v+'" aria-pressed="'+(h===v?'true':'false')+'">×'+v+'</button>').join('')+'</span></div>'+
        '<div class="od-ayarSatir"><span>Önemli anlarda normal hız</span>'+ac('otoYavas',ayarlar.otoYavas!==false)+'</div>'+
        '<p class="od-not">Maç 20 dakika sürer; ×2 ve ×4 ile hızlı izlersin. Gol, şut, faul ve kart, sakatlık, korner, tehlikeli serbest vuruş ve ofsaytta maç birkaç saniye önce normal hıza iner, an geçince seçtiğin hıza döner. Maçta 1, 2 ve 4 tuşlarıyla da seçilir; maçın sonucu hızdan etkilenmez. Maç tepeden izlenir; Z tuşu yakınlaştırır ve uzaklaştırır.</p>';}
    else if(ayarBolum==='kayit')ic+='<div class="od-ayarSatir"><span>Kayıt durumu</span><span class="'+(oyun.kayitHata()?'od-uyari':'')+'">'+yaz(oyun.kayitYazi())+'</span></div>'+
      '<p class="od-not">Oyun her tamamlanan karardan sonra kendiliğinden kaydeder. Maçın ortasından kayıt yoktur.</p>'+
      '<div class="od-dugmeler"><button type="button" data-eylem="kayitDene">Şimdi yeniden kaydet</button></div>'+
      '<div class="od-ayarSatir"><span>Yeni kariyer</span><span class="od-dugmeler">'+(yeniOnay?'<button type="button" class="od-tehlike" data-eylem="yeniEvet">Evet, bu kariyeri bırak ve yenisini başlat</button><button type="button" data-eylem="yeniHayir">Vazgeç</button>'
        :'<button type="button" data-eylem="yeniSor">Yeni kariyer…</button>')+'</span></div>'+
      (oyun.kayitDisa?kayitTasimaHtml():'');
    else ic+='<p class="od-not">Geliştirme aşamasının araçları; yayından önce kaldırılacak.</p>'+
      '<div class="od-ayarSatir"><span>Test bilgileri</span>'+ac('test',!!ayarlar.test)+'</div>'+
      '<div class="od-ayarSatir"><span>Maçta loca bakışı (TEST)</span>'+ac('locaBakisi',!!ayarlar.locaBakisi)+'</div>'+
      '<p class="od-not">Maç tepeden 2D izlenir. Açıkken maç eski figürlü loca bakışıyla açılır (geliştirme için); maçta G tuşu da değiştirir.</p>'+
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
    /* S-b: günün türü ve gördüklerin (dondurulmuş sinyallerden geçilmiş olanlar); TEST bilgileri açıkken günün adayları */
    const P=typeof antrenmanProgrami==='function'?antrenmanProgrami(k,kulupId(),k.tarih):null,gunTuru={toparlanma:'toparlanma',yogun:'yoğun',hafif:'hafif'}[P&&P.tur]||'';
    const gS=k.gozlem&&gozlemAcik(k)?(k.gozlem.sinyaller||[]).filter(s=>s.dk<k.gunIciDakika):[],gorduk=gS.length?'<ul class="od-liste od-gorduklerin" aria-label="Gördüklerin"><li>'+yaz(gozlemSinyalMetni(k,gS[gS.length-1])||'')+'</li></ul>'+
      (gS.length>1?'<small class="od-not">'+gS.length+' not oyuncuların dosyasına düştü.</small>':''):'';   /* inceleme: yalnız son görülen (büyük yazıda şerit masa düğmelerine uzanmasın) */
    const testAday=testAcik()&&typeof antrenmanSinyalleri==='function'?testKutu('Günün adayları: '+(antrenmanSinyalleri(k,k.tarih).map(s=>s.tur+'@'+saatYazi(s.dk)+' '+((k.oyuncular[s.oyuncuId]||{}).ad||'')).join(', ')||'yok')):'';
    if(izleme)ic='<p><b>İzliyorsun</b> <span class="od-not">kalan '+gozlemKalan(k)+' dk'+(duraklatmaVar()?' · duraklatıldı':acik?' · panel açıkken gözlem bekler':'')+'</span></p>'+
      '<div class="od-dugmeler"><button type="button" data-eylem="gozlemBirak">Gözlemi bırak</button></div>'+gorduk;
    else if(gozlemAcik(k))ic='<p><b>Gözlem durdu</b> <span class="od-not">kalan '+gozlemKalan(k)+' dk · karar verirken zaman durur</span></p><div class="od-dugmeler">'+
      (()=>{const e=ilerleOnizle(k).engel.filter(x=>/Önce karar ver/.test(x));return'<button type="button" class="od-birincil" data-eylem="gozlemSurdur"'+(e.length?' disabled':'')+'>Gözleme devam et ▸</button>'+(e.length?'<small class="od-uyari">'+yaz(e[0])+'</small>':'');})()+
      '<button type="button" data-eylem="gozlemBirak">Gözlemi bırak</button></div>'+gorduk;
    else if(d.suruyor){
      const S=[[15,'15 dk'],[30,'30 dk'],[d.kalan,'Sonuna kadar']].filter((x,i,L)=>x[0]<=d.kalan&&L.findIndex(y=>y[0]===x[0])===i);
      const O=S.map(x=>({dk:x[0],ad:x[1],o:gozlemOnizle(k,x[0])})),engel=O.length&&O.every(x=>x.o.engel.length)?O[0].o.engel[0]:null,kisa=O.find(x=>!x.o.engel.length&&x.o.kisaldi&&x.o.sure<x.dk);
      ic='<p><b>Antrenman sürüyor</b>'+(gunTuru?' · '+gunTuru+' gün <small>(TEST)</small>':'')+' <span class="od-not">'+saatYazi(d.pencere.bit)+'\'ye kadar · izlemek isteğe bağlı</span></p><div class="od-dugmeler">'+
        O.map(x=>'<button type="button" data-eylem="gozlem" data-dk="'+x.dk+'"'+(x.o.engel.length?' disabled':'')+'>İzle: '+x.ad+'</button>').join('')+'</div>'+
        (engel?'<small class="od-uyari">'+yaz(engel)+'</small>':kisa?'<small class="od-not">'+yaz(kisa.o.kisaldi)+'; gözlem o zaman biter.</small>':'');
    }else ic='<p><b>Saha boş</b> <span class="od-not">'+(d.pencere?(k.gunIciDakika<d.pencere.bas?'Antrenman '+saatYazi(d.pencere.bas)+'\'te':'Bugünkü antrenman bitti'):'Bugün antrenman yok')+'</span></p>';
    return'<section class="od-gozlem" aria-label="Antrenman"'+(acik?' inert':'')+'>'+ic+testAday+'</section>';   /* U1: odakta perdenin arkasında, etkileşimsiz */
  }
  /* sıradaki durak ve alt şerit */
  function durakYazi(o){
    const t=anTarih(o.hedef),an=tarihKisa(t.tarih)+' '+saatYazi(t.dakika);
    return an+(o.neden==='sonCevap'?' · son cevap saati: '+o.durak.veri.baslik:o.neden==='haber'?(o.haberIsi&&o.haberIsi.tur==='gelisme'?' · beklediğin cevap gelecek':' · beklediğin görüş gelecek'):o.neden==='cevapsiz'?' · cevap vermediğin karar kapanır':o.durak?' · '+o.durak.veri.baslik:o.neden==='cakisma'?' · günün işleri çakışıyor, seçim gerekecek':' · bekleyen rutin işler');
  }
  /* 2.8Q: defterde seçili, bugün bekleyen randevu ya da karar; eylemleri alt şeritte */
  const seciliIs=()=>acik==='ajanda'&&secili&&ajandaGun===k.tarih?bugun().find(r=>r.id===secili&&r.tur==='ajanda'&&r.durum==='bekliyor')||null:null;
  /* bir işin şeridi: durum yazısı ve düğmeler (ana düğme sağda, .od-ana tek kalır) */
  function isSeridi(r){
    const id=r.id,is=k.isler[id],v=is.veri,ert=v.zorunluluk==='ertelenebilir'?ertelemeDugmesi(is).replace('<button type="button"','<button type="button" class="od-ikinci"'):'';
    if(v.karar){
      /* dosyalı karar dosyada, dosyasız karar sağdaki karar panelinde verilir */
      const dosyada=r.meseleId&&k.meseleler[r.meseleId];
      return{durum:yaz(v.baslik)+' · cevabın bekleniyor'+(r.saatsiz&&r.sonCevap?' · en geç '+(r.sonCevap.tarih===k.tarih?'':yaz(tarihKisa(r.sonCevap.tarih))+' ')+saatYazi(r.sonCevap.dakika):''),
        dugme:ert+'<button type="button" class="od-ana" data-eylem="'+(dosyada?'dosyaAc':'kararAc')+'" data-is="'+id+'"'+(dosyada?' data-mesele="'+r.meseleId+'" data-donus="ajanda"':'')+'>Karar ver ▸</button>'};
    }
    const o=ajandaOnizle(k,id),mac=v.eylem==='macGunu',p=[];
    if(o.engel.length)p.push('<span class="od-uyari">'+o.engel.map(yaz).join(' · ')+'</span>');
    else p.push(mac?'Maç '+saatYazi(r.saat)+'\'da. Stada gidince maç günü başlar.':yaz(v.baslik)+' · '+saatYazi(r.saat)+(o.sure?'–'+saatYazi((r.saat+o.sure)%1440):''));
    if(o.atlanacak.length)p.push('<span class="od-uyari">Kaçırılacak: '+o.atlanacak.map(x=>yaz(x.veri.baslik+' ('+saatYazi(x.dakika)+')')).join(', ')+'</span>');
    if(o.cevapsiz.length)p.push('<span class="od-uyari">Cevapsız kalacak: '+o.cevapsiz.map(x=>yaz(x.veri.baslik+' — '+zamanAsimiMetni(k,x))).join(' · ')+'</span>');
    if(o.gerceklesecek.length)p.push('Bu arada: '+o.gerceklesecek.map(x=>yaz(isAdi(x))).join(' · '));
    const sor=(o.atlanacak.length||o.cevapsiz.length)&&onay!=='yap:'+id,dosya=r.meseleId&&k.meseleler[r.meseleId]?
      '<button type="button" class="od-ikinci" data-eylem="dosyaAc" data-mesele="'+r.meseleId+'" data-donus="ajanda">İlgili dosya ▸</button>':'';
    /* H2-a (TEST, yayından önce kalkar): maç gününde "Stada git"in yanında "Maçı izleme" — maç izlenmeden hesaplanır, sonuç kartı açılır
       (js/ekran-mac-sonu.js). Yalnız engel ve kaçırılacak iş onayı yokken; onaylı akış Stada git'te kalır */
    const izlemesiz=mac&&v.macId&&!o.engel.length&&!o.secimGerekli&&!o.atlanacak.length&&!o.cevapsiz.length&&onay!=='yap:'+id?
      '<button type="button" class="od-ikinci" data-eylem="yapIzlemesiz" data-is="'+id+'" title="Test aşaması: maç izlenmeden hesaplanır, sonuç kartı açılır (yayından önce kaldırılacak)"><small>TEST</small> Maçı izleme</button>':'';
    const dugme=onay==='yap:'+id?'<button type="button" class="od-ikinci" data-eylem="vazgec">Vazgeç</button><button type="button" class="od-ana" data-eylem="yap" data-is="'+id+'">Onayla ▸</button>'
      :dosya+ert+izlemesiz+'<button type="button" class="od-ana" data-eylem="'+(sor?'yapSor':'yap')+'" data-is="'+id+'"'+(o.engel.length||o.secimGerekli?' disabled':'')+'>'+(mac?'Stada git ▸':'Katıl ▸')+'</button>';
    return{durum:p.join(' · '),dugme,uyari:o.atlanacak.length||o.cevapsiz.length||o.engel.length};
  }
  function altSerit(){
    const r=seciliIs()||(!acik||acik==='ajanda'?macIsi():null);
    let durum,dugme,uyari=false;
    if(r)({durum,dugme,uyari}=isSeridi(r));
    /* U1: odakta İlerle yoktur; okurken zaman durur, iş masaya bırakılınca ilerlenir */
    else if(acik){durum=yaz('Okurken zaman durur · Esc: geri · Kapat: masaya bırak');dugme='';}
    else{
      const o=ilerleOnizle(k),p=[];
      if(o.engel.length)p.push('İlerlenemiyor: '+o.engel.join(' · '));
      else{
        p.push('Sıradaki durak: '+durakYazi(o));
        if(o.tasinacak.length)p.push('Ertesi güne kalacak: '+o.tasinacak.map(x=>x.veri.baslik).join(', '));
        if(o.kacirilacak.length)p.push('Kaçırılacak: '+o.kacirilacak.map(x=>x.veri.baslik).join(', '));
        if(o.cevapsiz.length)p.push('Cevapsız kalacak: '+o.cevapsiz.map(x=>x.veri.baslik+' ('+zamanAsimiMetni(k,x)+')').join(', '));
      }
      durum=yaz(p.join(' · '));
      const sor=(o.kacirilacak.length||o.cevapsiz.length)&&onay!=='ilerle';
      dugme=onay==='ilerle'?'<button type="button" class="od-ikinci" data-eylem="vazgec">Vazgeç</button><button type="button" class="od-ana" data-eylem="ilerle">Onayla ▸</button>'
        :'<button type="button" class="od-ana" data-eylem="'+(sor?'ilerleSor':'ilerle')+'"'+(o.engel.length?' disabled':'')+'>İlerle ▸</button>';
    }
    return'<footer class="od-alt"><div class="od-altYazi"><p class="od-mesaj" aria-live="polite">'+yaz(mesaj)+'</p><p class="od-durak'+(uyari?' od-durakUyari':'')+'">'+durum+'</p></div>'+
      '<div class="od-altDugmeler">'+dugme+'</div></footer>';
  }
  /* dosyasız karar (2.8Q): sağdaki karar panelinde aynı tek kart (H1); cevaptan sonra ajandaya dönülür */
  let kararIs=null;
  function kararPaneli(){return kararIs&&k.isler[kararIs]?isBolumu(kararIs):'<p class="od-not">Bu karar artık beklemiyor.</p>';}

  /* ---- U3 göz atma içerikleri (yalnız okuma): defterin o günü, kasa özeti, oyuncunun künyesi ---- */
  const GOZ_IS={telefon:'Konuşma',dosya:'Dosya',karar:'Karar'};
  let cizilenGoz=null;
  const gozAnahtar=()=>gozVar()?[goz.tur,goz.tarih,goz.dakika,goz.oyuncu].join('|'):null;   /* göz atma kâğıdı yalnız açılışta belirir */
  const gozVar=()=>!!goz&&!!GOZ_IS[acik]&&(!goz.isId||!!k.isler[goz.isId]);
  function gozBaslik(){return goz.tur==='gun'?'Defter · '+tarihYazi(goz.tarih):goz.tur==='kasa'?'Kasa':((k.oyuncular||{})[goz.oyuncu]||{ad:'Oyuncu'}).ad;}
  function gozIcerik(){
    if(goz.tur==='gun'){
      const D=typeof gunDolulugu==='function'?gunDolulugu(k,goz.tarih,goz.isId):[],ant=typeof antrenmanPenceresi==='function'?antrenmanPenceresi(k,goz.tarih):null,i=goz.dakika>=0&&goz.sure?{dakika:goz.dakika,sure:goz.sure}:null;
      const S=D.map(x=>({a:x.dakika,b:x.dakika+x.sure,ad:x.baslik,s:x.durum!=='bekliyor'?'od-gozBitti':x.eylem==='macGunu'?'od-gozMac':''}));
      if(ant)S.push({a:ant.bas,b:ant.bit,ad:'Antrenman',s:'od-gozAnt'});
      const cak=i&&D.some(x=>x.durum==='bekliyor'&&x.dakika<i.dakika+i.sure&&x.dakika+Math.max(x.sure,1)>i.dakika);
      if(i)S.push({a:i.dakika,b:i.dakika+i.sure,ad:(goz.ad||'İşaretli an')+(cak?' (çakışıyor)':''),s:cak?'od-gozCakis':'od-gozIsaret'});
      S.sort((x,y)=>x.a-y.a||(x.s==='od-gozIsaret'?1:-1));
      return(S.length?'<ul class="od-gozGun">'+S.map(x=>'<li class="'+x.s+'"><time>'+saatYazi(x.a)+(x.b>x.a?'–'+saatYazi(x.b%1440):'')+'</time><span>'+yaz(x.ad)+'</span></li>').join('')+'</ul>':'<p class="od-not">Bu gün defter boş.</p>')+
        '<p class="od-not">Göz atıyorsun: yalnız okunur. ‹ '+GOZ_IS[acik]+' ya da Esc ile işe dönersin.</p>';
    }
    if(goz.tur==='kasa'&&typeof maliOzet==='function'){const M=maliOzet(k,kulupId());
      return'<dl class="od-gozKasa"><dt>Kasadaki para</dt><dd>'+yaz(tlYazi(M.nakit))+'</dd><dt>Bekleyen gelir</dt><dd>'+yaz(tlYazi(M.bekleyenGelir))+'</dd><dt>Bekleyen gider</dt><dd>'+yaz(tlYazi(M.bekleyenGider))+'</dd>'+
        '<dt>90 gün içinde en düşük</dt><dd'+(M.enDusuk<0?' class="od-uyari"':'')+'>'+yaz(tlYazi(M.enDusuk))+(M.enDusukTarih?' <small>'+yaz(tarihKisa(M.enDusukTarih))+'</small>':'')+'</dd>'+
        '<dt>90 gün sonra</dt><dd>'+yaz(tlYazi(M.son90))+'</dd><dt>Aylık maaş yükü</dt><dd>'+yaz(tlYazi(M.maasYuku))+'</dd></dl>'+
        '<p class="od-not">Göz atıyorsun: yalnız okunur. Ayrıntı dosyadaki raporlarda.</p>';}
    if(goz.tur==='oyuncu'&&typeof kadroSatirlari==='function'){const p=(k.oyuncular||{})[goz.oyuncu],r=p&&kadroSatirlari(k,p.kulupId).find(x=>x.id===p.id);
      if(!r)return'<p class="od-not">Oyuncu bulunamadı.</p>';
      const durum=r.sakat?'Sakat · dönüş '+tarihKisa(r.sakat.donus):r.ceza?'Cezalı':'Hazır';
      return'<dl class="od-gozKasa"><dt>Forma</dt><dd>'+r.no+'</dd><dt>Mevki</dt><dd>'+yaz(r.mevki)+'</dd><dt>Yaş</dt><dd>'+r.yas+'</dd><dt>Bu sezon</dt><dd>'+yaz(r.mac+' maç · '+r.dk+' dk · '+r.gol+' gol')+'</dd>'+
        '<dt>Durum</dt><dd>'+yaz(durum)+'</dd><dt>Sözleşme</dt><dd>'+(r.bitis?yaz(tarihKisa(r.bitis))+(r.maas?' · '+yaz(tlYazi(r.maas))+'/ay':''):'—')+'</dd></dl>'+
        '<p class="od-not">Göz atıyorsun: yalnız okunur. Notlar dosyadaki Kadro sekmesinde.</p>';}
    return'';
  }
  /* ---- U3 “Sonra” yığını (envanter 26): masada cevap bekleyen kararlar, son cevabı en yakın olan üstte (durağı gelen öne çıkar), en çok üç kâğıt.
     Masaya bırakmak ertelemektir: kâğıt burada durur, dokununca kararın kendi yerinde açılır (soranın konuşması, dosyası ya da karar paneli) ---- */
  const SONRA_EN_COK=3;
  const sonraKararlar=()=>Object.values(k.isler).filter(x=>x.tur==='ajanda'&&x.veri.karar&&x.veri.saatsiz&&x.veri.gelis&&anDakika(x.veri.gelis.tarih,x.veri.gelis.dakika)<=simdikiAn(k))
    .sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika)||(a.id<b.id?-1:1));
  const kararYerAdi=is=>mesajKisiAktif(k,is.veri.soran)?'telefonda':is.veri.meseleId&&k.meseleler[is.veri.meseleId]?'dosyada':'defterde';
  function sonraYigini(){
    const L=sonraKararlar();if(!L.length)return'';
    return'<section class="od-sonra" aria-label="Sonra: cevap bekleyen kararlar"'+(acik?' inert':'')+'><h4>Sonra</h4>'+L.slice(0,SONRA_EN_COK).map(x=>
      '<button type="button" class="od-sonraKagit" data-eylem="sonraAc" data-is="'+x.id+'"><b>'+yaz(x.veri.baslik)+'</b><small>en geç '+(x.tarih===k.tarih?'bugün ':yaz(tarihKisa(x.tarih))+' ')+saatYazi(x.dakika)+' · '+kararYerAdi(x)+'</small></button>').join('')+
      (L.length>SONRA_EN_COK?'<small class="od-not">ve '+(L.length-SONRA_EN_COK)+' karar daha (defterde)</small>':'')+'</section>';
  }
  /* kararı kendi yerinde açar: soran aktifse telefonda o konuşma, konusu varsa dosyada, yoksa karar panelinde */
  function kararYerindeAc(id){
    const is=k.isler[id];if(!is)return;const v=is.veri;
    if(mesajKisiAktif(k,v.soran)){konusmaAc(v.soran);panelAc('telefon',null,null,true);return;}
    if(v.meseleId&&k.meseleler[v.meseleId]){dosyaRapor=false;panelAc('dosya',v.meseleId);return;}
    kararIs=id;panelAc('karar');
  }

  function odayiBildir(){
    const [,a,g]=parca(k.tarih);
    const iz=izler(),dk=k.gunIciDakika;
    if(balkonVar){const p=typeof antrenmanPenceresi==='function'?antrenmanPenceresi(k,k.tarih):null;balkonDurum({antrenman:!!p&&dk>=p.bas&&dk<p.bit,dakika:dk});}
    kap.dataset.yer=balkonVar?ODA.yer:'masa';   /* U6: balkonda yarım odak (CSS) */
    odaDurum({haber:haberSayisi(),isler:bekleyenIsSayisi(),dosyaSayi:acikMeseleler().length,dosya:acikMeseleler().length>0||raporlar().length>0||kadroAcilir(),gun:String(g),ay:AYLAR[a-1].slice(0,3),gunAdi:gunAdi(k.tarih).slice(0,3),dakika:dk,
      gazete:!!iz.sayi||!!iz.gazete||!!iz.kart,gazeteYeni:iz.gazeteYeni||iz.yeniHaber>0,kart:!!iz.kart,iskele:iz.iskele,panoNotu:iz.panoNotu});
    odaOdak(acik in NESNE?acik:null);
    if(typeof odaPanel==='function')odaPanel(!!acik);   /* U1: odak açıkken 3B oda kamera yerleşince donar (js/oda.js odaDondur) */
  }
  /* duraklatmada süre tüketen ya da dünyayı değiştiren komutlar kapalıdır; okuma ve gezinti açıktır (2.8B) */
  const DURAKLATMADA_KAPALI=new Set(['yap','yapSor','yapIzlemesiz','ertele','ilerle','ilerleSor','tavsiye','girisim','oyuncuSec','gozlem','gozlemSurdur','gozlemBirak','yer','yeniSor','yeniEvet','bozukYeni']);
  const duraklatDegistir=()=>{if(duraklatmaVar('elle'))duraklatmaKaldir('elle');else duraklatmaEkle('elle');};
  let cizilenPanel=null,cizilenGorunum=null;
  const gorunumAnahtari=()=>acik!=='dosya'?acik:dosyaKadro||!meseleler().length&&!raporlar().length?'kadro:'+(seciliOyuncu||''):dosyaRapor?'rapor:'+seciliRapor:dosyaArsiv?'arsiv':'konu:'+seciliMesele;
  function ciz(odak){
    k=oyun.kariyer;
    /* aynı panel yeniden çizilirken okuma yeri korunur */
    const eski=kap.querySelector('.od-icerik'),kaydirma=eski&&cizilenPanel===acik?eski.scrollTop:0;
    const eskiTel=kap.querySelector('.tel-govde'),telKaydirma=eskiTel&&cizilenPanel==='telefon'&&acik==='telefon'&&cizilenTel===telAnahtar()?eskiTel.scrollTop:null;
    /* H1: kartın önizlemesi yeniden çizdiğinde telefonun cevap alanının okuma yeri de korunur */
    const eskiCevap=telKaydirma!==null?kap.querySelector('.tel-cevap'):null,cevapKaydirma=eskiCevap?eskiCevap.scrollTop:0;
    /* R2: iş panelinin okuma yeri aynı telefon görünümünde korunur; R2-b: konuşmadan çıkarken (ya da yeniden çizerken) o konuşmanın yeri saklanır */
    const eskiIs=telKaydirma!==null?kap.querySelector('.tlf-is'):null,isKaydirma=eskiIs?eskiIs.scrollTop:0;
    if(eskiTel&&cizilenPanel==='telefon'&&cizilenTel&&cizilenTel.startsWith('konusma:'))
      telOkuma.set(cizilenTel.slice(8),{y:eskiTel.scrollTop,alt:eskiTel.scrollTop+eskiTel.clientHeight>=eskiTel.scrollHeight-8});
    yaziBoyuUygula();   /* U0: tek ölçek, oyun karesine yazılır */
    if(oyun.bozukHata){
      kap.innerHTML='<div class="od-panel od-bozuk"><header><h3>Kayıt açılamadı</h3></header><div class="od-icerik"><p>Kayıtlı kariyer açılamadı. Kayıt dosyasına dokunulmadı.</p><p class="od-not">'+yaz(oyun.bozukHata)+'</p>'+
        '<p>Yeni kariyer başlatırsan açılamayan kayıt “.bozuk” uzantısıyla ayrıca saklanır.</p><div class="od-dugmeler"><button type="button" class="od-birincil" data-eylem="bozukYeni">Kaydı sakla, yeni kariyer başlat</button></div></div></div>';
      return;
    }
    const b=k.kisiler[k.baskanId],haber=haberSayisi(),karar=kararBekleyen().length,is=bekleyenIsSayisi(),dosyaVar=meseleler().length>0||raporlar().length>0||kadroAcilir();
    /* U0 rozet dili: data-rozet sayı, karar ya da yeni (görünüş index.html .od-rozet) */
    const rozetTuru=r=>r==='yeni'||r==='karar'?r:'sayi';
    const dugme=(ad,rozet,sinif,kapali)=>'<button type="button" class="od-nesne" data-eylem="ac" data-panel="'+ad+'" aria-pressed="'+(acik===ad?'true':'false')+'"'+(kapali?' disabled':'')+'>'+
      NESNE[ad]+(rozet?'<i class="od-rozet'+(sinif?' '+sinif:'')+'" data-rozet="'+rozetTuru(rozet)+'">'+rozet+'</i>':'')+'</button>';
    const iz=izler(),gazeteVar=!!iz.sayi||!!iz.gazete||!!iz.kart;   /* S-e: son sayı her sabah masada */
    const baslik={telefon:'Telefon',ajanda:'Ajanda',dosya:'Dosya',gazete:'Gazete',ayar:'Ayarlar',kadro:'Kadro (TEST)',karar:'Karar'}[acik];
    const icerik=acik==='telefon'?telefonPaneli():acik==='ajanda'?ajandaPaneli():acik==='dosya'?dosyaPaneli():acik==='gazete'?gazetePaneli():acik==='ayar'?ayarPaneli():acik==='kadro'?kadroPaneli():acik==='karar'?kararPaneli():'';
    /* aynı görünüm yeniden çizilirken sayfaların okuma yeri korunur; dosyada görünüm konu, rapor, arşiv, kadro ya da oyuncudur (S-c; konu ↔ rapor kayması da kalktı) */
    const gorunum=gorunumAnahtari(),sayfaKaydirma=cizilenPanel===acik&&cizilenGorunum===gorunum?[...kap.querySelectorAll('.dsy-sayfa,.dft-sayfa')].map(x=>x.scrollTop):[];
    /* U1 odak kabı (js/ekran-odak.js): iş açılınca belirme geçişi yalnız ilk çizimde; masaya dönerken açık kabın kopyası söner */
    const belir=!!acik&&cizilenPanel!==acik;if(!acik&&cizilenPanel&&typeof odakCikis==='function')odakCikis(kap);
    const odakta=acik?' inert':'';
    kap.innerHTML='<header class="od-ust"><span>'+yaz(k.kulupler[kulupId()].ad)+' · Başkan '+yaz(b?b.ad:'')+'</span>'+
      '<span class="od-ustSag"><span class="od-kayit'+(oyun.kayitHata()?' od-uyari':'')+'">'+yaz(oyun.kayitYazi())+'</span>'+(oyun.kayitTamam()||(oyun.kayitCakisma&&oyun.kayitCakisma())?'':' <button type="button" class="od-kucuk od-tehlike" data-eylem="kayitDene">Yeniden kaydet</button>')+
        '<button type="button" class="od-duraklat" data-eylem="duraklat" aria-pressed="'+(duraklatmaVar('elle')?'true':'false')+'" title="Duraklat (P ya da boşluk)">'+(duraklatmaVar('elle')?'Devam ▸':'Duraklat')+'</button></span></header>'+
      '<div class="od-tarih" title="Okurken ve düşünürken zaman durur"'+odakta+'><b>'+yaz(tarihYazi(k.tarih))+'</b><span>'+saatYazi(k.gunIciDakika)+'</span></div>'+
      '<nav class="od-nesneler" aria-label="Masadakiler"'+odakta+'>'+dugme('telefon',haber?String(haber):'',karar?'od-rozetAcil':'')+dugme('ajanda',is?String(is):'')+
        /* H2-d: dosyanın rozeti önce karar, karar yoksa görülmemiş raporda “yeni” */
        dugme('dosya',karar?'karar':yeniRapor()?'yeni':'',karar?'od-rozetAcil':'',!dosyaVar)+(gazeteVar?dugme('gazete',iz.gazeteYeni||iz.yeniHaber?'yeni':''):'')+
        /* balkona çıkış kapının kendisidir (tıkla ya da 5); klavye için görünmez, odakta beliren düğme. Balkonda dönüş düğmesi görünür */
        (balkonVar?(ODA.yer==='balkon'?'<button type="button" class="od-nesne od-yer" data-eylem="yer">Odaya dön</button>':
          '<button type="button" class="od-nesne od-yer od-gizli" data-eylem="yer">Balkona çık (kapı · 5)</button>'):'')+
        '<button type="button" class="od-nesne od-kucuk" data-eylem="ac" data-panel="ayar" aria-pressed="'+(acik==='ayar'?'true':'false')+'">Ayarlar</button></nav>'+gozlemSeridi()+
      /* U1: her iş aynı odak kabında: oda bulanır, iş ortada; başlıkta ‹ Geri · başlık · Kapat (dosya ve defter kendi nesneleriyle kabı doldurur) */
      (acik?odakKabi({ad:acik,boy:acik==='telefon'&&telIkiSutun()?'telefon':ODAK_BOY[acik]||'genis',etiket:baslik,baslik,belir,kagit:acik!=='dosya'&&acik!=='ajanda',
        sinif:acik==='dosya'||acik==='ajanda'?'':'od-panel'+(acik==='kadro'?' od-genis':acik==='telefon'?' od-telefonPanel':''),
        geri:acik==='telefon'&&!gozVar()?null:(h=>h&&{etiket:h.etiket,eylem:h.eylem||'odakGeri'})(odakGeriHedef()),govde:icerik,
        yan:gozVar()?{baslik:gozBaslik(),govde:gozIcerik(),belir:gozAnahtar()!==cizilenGoz}:null}):'')+
      sonraYigini()+altSerit()+(!acik&&typeof zamanSahnesiHtml==='function'?zamanSahnesiHtml():'');
    /* U4: akış sürerken İlerle “İlerliyor…” der (basmak sahneyi bırakıp yeniden ilerler) */
    if(typeof ZAMAN_SAHNE!=='undefined'&&ZAMAN_SAHNE.evre==='akis'){const b=kap.querySelector('.od-alt .od-ana[data-eylem="ilerle"]');if(b)b.textContent='İlerliyor…';}
    if(typeof odakCikisEkle==='function')odakCikisEkle(kap);
    if(belir&&typeof odakKokYerlestir==='function')odakKokYerlestir(kap,typeof odaNesneEkrani==='function'?odaNesneEkrani(acik):null);
    odayiBildir();
    if(duraklatmaVar())for(const d of kap.querySelectorAll('button[data-eylem]'))if(DURAKLATMADA_KAPALI.has(d.dataset.eylem)){d.disabled=true;d.title='Duraklatıldı: devam edince kullanılabilir';}
    const yeni=kap.querySelector('.od-icerik');if(yeni&&kaydirma)yeni.scrollTop=kaydirma;
    kap.querySelectorAll('.dsy-sayfa,.dft-sayfa').forEach((x,i)=>{if(sayfaKaydirma[i])x.scrollTop=sayfaKaydirma[i];});
    /* telefonda konuşma açılınca son mesaj ve cevap kartı görünür; aynı konuşma yeniden çizilirken okuma yeri korunur */
    const tg=kap.querySelector('.tel-govde');
    /* R2-b: konuşma açılışı: yeni mesaj varsa ilk yenisi üstte, yoksa son okunan yer (en alttaysa en alt). Gönderince (telAlta) en alt */
    const ay=telAcYeri;telAcYeri=null;
    if(tg){if(telAlta){tg.scrollTop=tg.scrollHeight;telAlta=false;}
      else if(ay&&acik==='telefon'&&tel.ekran==='konusma'&&ay.kisi===tel.kisi){const y=ay.yeni&&tg.querySelector('.tel-yeni'),o=telOkuma.get(ay.kisi);
        if(y){const g=y.previousElementSibling&&y.previousElementSibling.classList.contains('tel-gun')?y.previousElementSibling:y;tg.scrollTop+=g.getBoundingClientRect().top-tg.getBoundingClientRect().top-6;}
        else if(o&&!o.alt)tg.scrollTop=o.y;else tg.scrollTop=tg.scrollHeight;}
      else if(telKaydirma!==null){tg.scrollTop=telKaydirma;const tc=kap.querySelector('.tel-cevap');if(tc&&cevapKaydirma)tc.scrollTop=cevapKaydirma;}}
    const ti=kap.querySelector('.tlf-is');if(ti&&isKaydirma)ti.scrollTop=isKaydirma;
    /* R2-d: konuşma açılınca iş panelindeki ilk kart (kenarları ve ipucuyla) kaydırmadan görünür; kartın üstü panelin üstünden yukarı çıkmaz */
    else if(ti&&ay){const c=ti.querySelector('.kk-alan');if(c){const a=ti.getBoundingClientRect(),b=c.getBoundingClientRect(),fazla=b.bottom-a.bottom+4;if(fazla>0)ti.scrollTop+=Math.min(fazla,b.top-a.top-4);}}
    cizilenPanel=acik;cizilenGorunum=gorunum;cizilenTel=telAnahtar();cizilenGoz=gozAnahtar();
    const f=odak&&kap.querySelector(odak);if(f&&!f.disabled)f.focus({preventScroll:true});
  }

  /* ---- eylemler ---- */
  /* donusPanel: dosya telefondan ya da ajandadan açıldıysa "◂ Mesaja dön"/"◂ Ajandaya dön" aynı konuşmaya, aynı güne döner */
  /* koru: telefon dosyadan dönülerek açılıyorsa aynı konuşmada kalır; masadan açılınca ana ekranla açılır */
  function panelAc(ad,mesele,donusPanel,koru){
    if(ad==='dosya'&&!meseleler().length&&!raporlar().length&&!kadroAcilir())return;
    if(ad==='gazete'&&!izler().sayi&&!izler().gazete&&!izler().kart)return;
    if(ad==='gazete'&&acik!=='gazete')gazeteGun=null;   /* S-e: masadan açılınca son sayı */
    if(ad==='dosya'){donusYeri=donusPanel?{panel:donusPanel}:mesele&&acik==='dosya'?donusYeri:null;if(mesele)dosyaArsiv=false;
      /* S-c: Kadro yalnız konu ve rapor yokken açılıştır; masadan ya da bağlantıyla açılış öbür önceliği değiştirmez */
      dosyaKadro=!meseleler().length&&!raporlar().length;seciliOyuncu=null;
      /* masadan açılınca öncelik (H2-d): cevap bekleyen konu > görülmemiş rapor > açık konu (seçili konu kapandıysa cevap bekleyen ilk açık dosya, yoksa ilk
         açık dosya) > seçili ya da son konu (kapanmış dahil) > en son rapor. Bağlantıyla açılan konu rapor görünümünü kapatır */
      const cur=!mesele&&k.meseleler[seciliMesele],S=acikSira(),bekleyen=S.find(id=>k.meseleler[id].durum==='kararBekliyor'),yeni=yeniRapor(),R=raporlar();
      if(mesele)dosyaRapor=false;
      else if(bekleyen&&!(cur&&cur.durum==='kararBekliyor')){dosyaRapor=false;dosyaArsiv=false;seciliMesele=bekleyen;}   /* inceleme (H2-e): karar öndedir */
      else if(!bekleyen&&yeni){dosyaRapor=true;dosyaArsiv=false;seciliRapor=yeni.i;}
      else{dosyaRapor=false;if(!cur||cur.durum==='kapandi')seciliMesele=bekleyen||S[0]||seciliMesele;
        if(!(seciliMesele&&k.meseleler[seciliMesele])){const L=meseleler();seciliMesele=(L[0]&&L[0].id)||null;}   /* seçili yoksa (ör. yenilemeden sonra) son konu, dosyaPaneli'yle aynı */
        if(!seciliMesele&&R.length){dosyaRapor=true;seciliRapor=R[0].i;}}}
    if(ad==='ajanda'&&!koru&&acik!=='ajanda'){ajandaHafta=0;ajandaGun=k.tarih;secili=null;}
    if(ad==='telefon'&&!koru&&acik!=='telefon'){tel.ekran='ana';tel.kisi=null;telLigSifirla();yeniIsaret=new Set();}
    /* R2-b: dosyadan “‹ Mesajlar” ile dönüş de açılış kuralını kullanır (yeni gelen varsa ona, yoksa okunan yere) */
    if(ad==='telefon'&&koru&&tel.ekran==='konusma')konusmaAc(tel.kisi);
    acik=ad;onay=null;goz=null;
    if(typeof zamanSahnesiKapat==='function')zamanSahnesiKapat();   /* U4: iş açılınca durak özeti masada kalmaz */
    if(mesele)seciliMesele=mesele;
    if(izleme)izlemeKaydet();
    if(ad==='dosya'){
      /* dosyayı açmak o konunun "yeni" işaretini kaldırır; görüldü kaydı zamanı ve geçmişi değiştirmez. Telefonda yeni işaret konuşma açılınca kalkar */
      if(dosyaRapor)raporlariGor();
      else{const hedef=seciliMesele&&k.meseleler[seciliMesele]?seciliMesele:acikSira()[0]||(meseleler()[0]||{}).id;
      for(const m of meseleler().filter(m=>m.id===hedef))if(m.olaylar.length>m.gorulen)try{komut(x=>meseleGoruldu(x,m.id));}catch(e){mesaj=e.message;}}
    }
    if(ad==='gazete'){const iz=izler();   /* S-e: son sayıyı açmak okundu yazar (yalnız gazeteOkunan; zaman ve geçmiş değişmez) */
      if(iz.gazeteYeni)try{komut(x=>gazeteOkundu(x,iz.sayi));}catch(e){mesaj=e.message;}
      if(izler().yeniHaber)try{komut(x=>haberlerGoruldu(x));}catch(e){mesaj=e.message;}}
    ciz('.od-kapat');
  }
  /* S-c: dosya Kadro görünümünde mi (seçili ya da konu ve rapor yokken tek görünüm); oyuncu dosyasından listeye dönüş, odak o oyuncunun adında */
  const kadroGorunur=()=>kadroAcilir()&&(dosyaKadro||!meseleler().length&&!raporlar().length);
  let kadroYeri=0;   /* inceleme: oyuncu dosyası açılırken listenin okuma yeri; dönünce geri gelir, o oyuncunun satırı görünür */
  const gorunurYap=(kutu,f)=>{if(!kutu||!f)return;const a=kutu.getBoundingClientRect(),b=f.getBoundingClientRect();if(b.top<a.top)kutu.scrollTop-=a.top-b.top;else if(b.bottom>a.bottom)kutu.scrollTop+=b.bottom-a.bottom;};
  function kadroDon(){const o=seciliOyuncu;seciliOyuncu=null;ciz(o?'[data-eylem="oyuncuAc"][data-oyuncu="'+o+'"]':'[data-eylem="kadroSekme"]');
    const g=kap.querySelector('.dsy-genis');if(g){g.scrollTop=kadroYeri;gorunurYap(g,o&&g.querySelector('[data-oyuncu="'+o+'"]'));}}
  /* U1: Kapat × ve perde işi masaya bırakır (karar paneli de; ajandaya dönüş başlıktaki ‹ Ajanda ve Esc'tir). Odak masadaki nesneye döner */
  function kapat(){acik=null;onay=null;yeniOnay=false;iceOnay=null;kararIs=null;goz=null;ciz('.od-ana');}
  /* U1 tek geri zinciri: işin iç geri adımı, sonra kaynağı (dosyayı açan konuşma ya da defter; karar panelinin defteri; kadronun ayarları).
     Başlıktaki ‹ Geri bunun etiketini taşır; Esc önce onay adımını bırakır, sonra bu adımı atar, adım yoksa masaya bırakır. Telefonun geri düğmesi
     cihazın içindedir (aynı zincir) */
  function odakGeriHedef(){
    if(gozVar())return{etiket:GOZ_IS[acik],f:()=>{goz=null;ciz('.kk-yuz [data-eylem="gozAt"]');}};
    if(acik==='telefon'){
      if(tel.ekran==='kulup')return{etiket:'Canlı Skor',f:()=>{const id=tel.kulup;tel.ekran='skor';tel.kulup=null;telGecis=true;ciz('[data-eylem="kulupAc"][data-kulup="'+id+'"]');telSkorYeriGeri(id);}};
      if(tel.ekran==='konusma')return{etiket:'Mesajlar',f:()=>{const ki=tel.kisi;tel.ekran='mesajlar';tel.kisi=null;tel.oyuncuSec=null;onay=null;telGecis=true;ciz('.tel [data-eylem="telKisi"][data-kisi="'+ki+'"]');}};
      if(tel.ekran!=='ana')return{etiket:'Ana ekran',f:telAnaEkran};
      return null;}
    if(acik==='dosya'&&kadroGorunur()&&seciliOyuncu)return{etiket:'Kadro',eylem:'kadroDon',f:kadroDon};
    if(acik==='dosya'&&donusYeri)return{etiket:donusYeri.panel==='telefon'?'Mesajlar':'Ajanda',eylem:'donus',f:()=>{const d=donusYeri;donusYeri=null;panelAc(d.panel,null,null,true);}};
    if(acik==='karar')return{etiket:'Ajanda',f:()=>{kararIs=null;panelAc('ajanda',null,null,true);}};
    if(acik==='kadro')return{etiket:'Ayarlar',f:()=>{ayarBolum='gelistirici';panelAc('ayar');}};
    return null;
  }
  function odakEsc(){if(onay||yeniOnay||iceOnay){onay=null;yeniOnay=false;iceOnay=null;ciz();return;}
    /* R2-e: açık oyuncu seçimi önce kapanır (odak konusuna döner) */
    if(acik==='telefon'&&tel.oyuncuSec){const g=tel.oyuncuSec;tel.oyuncuSec=null;ciz('.tlf-konu[data-girisim="'+g+'"]');return;}
    const h=odakGeriHedef();if(h)h.f();else kapat();}
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
  /* durdurulan gelişmenin özeti (G2 incelemesi): bu anda gelen karar varsa yeri — soranın konuşmasında ya da konusunun telefondaki konuşmasında dosya
     bağlantısıyla duruyorsa telefon (H1'den beri gelen teklif de: hocanın konuşması), yoksa masadaki dosya; karar açmayan durak (transfer imzası)
     'yeni gelişme' (js/mesajlar.js) */
  const kararYeri=()=>{const Y=simdiGelenKararlar(k);return !Y.length?null:Y.some(x=>kararTelefondaMi(k,x))?'tel':'masa';};
  const kararMetni=(y,tel,masa,diger)=>y==='tel'?tel:y==='masa'?masa:diger;
  function gozlemSonucu(r){
    mesaj=r.neden==='karar'?kararMetni(kararYeri(),'Telefon çaldı: karar gerektiren bir haber var.','Masaya yeni dosya geldi: karar bekleyen bir konu var.','Yeni bir gelişme var.')+' Gözlem durdu, '+r.kalan+' dk kaldı.':r.neden==='haber'?'Beklediğin görüş geldi. Gözlem durdu, '+r.kalan+' dk kaldı.'
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
  /* secim: kararın seçenek kimliği (tek karttan; kartEtkilesimKur), randevu ve maç gününde yok. Komut aynı tek komuttur (ajandaIsiYap); karar bir kez
     uygulanır (iş kapanır), yolda karar gerektiren haber gelirse iş yerinde bekler. git: maç gününde macaGit'e (H2-a TEST: {izle:false}) */
  function isiYap(id,secim,git){
    const is=k.isler[id];if(!is)return;
    const baslik=is.veri.baslik,mac=is.veri.eylem==='macGunu',bas=saatYazi(is.dakika),saatsiz=!!is.veri.saatsiz,karar=!!is.veri.karar;
    /* F1-b: kariyerden açılan maçta maç günü işi odada uygulanmaz, kopyada denenir. Yolda karar gerektiren haber gelirse o ana dek ilerleme normal
       komutla kaydedilir; gelmezse kariyere dokunulmadan sayfa maçın kimliğiyle açılır (js/mac-gunu.js işi orada, bellekte yapar). Böylece odaya
       tarayıcının Geri tuşuyla dönülse de bekleyen iş yerindedir */
    if(mac&&is.veri.macId){
      let r;try{r=kariyerKomut(k,x=>ajandaIsiYap(x,id,secim)).kariyer;}catch(e){hataGoster(e);return;}
      onay=null;
      if(r.isler[id]){try{komut(x=>ajandaIsiYap(x,id,secim));}catch(e){hataGoster(e);return;}
        mesaj=baslik+' için yola çıktın; yolda karar gerektiren bir haber geldi. İş bekliyor.';ciz();return;}
      const engel=oyun.macaGit(is.veri.macId,git);
      if(engel){mesaj=engel;ciz();return;}
      delete onizleler[id];acik=null;return;
    }
    try{komut(x=>ajandaIsiYap(x,id,secim),mac);}catch(e){hataGoster(e);return;}
    onay=null;
    if(k.isler[id]){
      /* yolda karar gerektiren bir haber geldi: iş yerinde bekliyor, o ana kadarki ilerleme geçerli */
      if(mac)oyun.yenidenKaydet();
      mesaj=baslik+' için yola çıktın; yolda karar gerektiren bir haber geldi. İş bekliyor.';ciz();return;
    }
    delete onizleler[id];goz=null;
    if(mac){acik=null;oyun.macaGit(is.veri.macId);return;}
    if(acik==='karar'){acik='ajanda';kararIs=null;}
    /* kararın sonucu aynı dosyada kısa görünür; otomatik sonraki dosyaya geçilmez */
    if(is.veri.meseleId){const g=k.gecmis.slice().reverse().find(x=>x.tur==='is'&&x.isId===id),r=g&&g.sonuc;
      if(r&&(r.bilgi||r.secimMetni))dosyaSonuc={meseleId:is.veri.meseleId,metin:(r.secimMetni?r.secimMetni+(r.bilgi?' — ':''):'')+(r.bilgi||'')};}
    mesaj=baslik+' ('+(saatsiz?'karar':bas)+') tamamlandı.';
    ciz();
  }
  function ilerleOzeti(r,sayi0){   /* S-e: sayi0 İlerle'den önceki son sayı; yeni gazete yalnız sayı değiştiyse söylenir */
    const p=[];
    for(const g of r.biten){
      if(g.isTuru==='odeme'){const h=k.hareketler.find(x=>x.id===g.sonuc.hareketId);if(h)p.push(h.aciklama+' '+tlYazi(h.tutar));}
      else if(g.isTuru==='ajanda'&&g.sonuc&&g.sonuc.durum==='kacirildi')p.push(g.sonuc.baslik+' kaçırıldı');
      else if(g.isTuru==='ajanda'&&g.sonuc&&g.sonuc.durum==='cevapsiz')p.push(g.sonuc.baslik+': cevapsız kaldı'+(g.sonuc.bilgi?' — '+g.sonuc.bilgi:''));
      else if(g.isTuru==='hatirlatma'&&g.sonuc)p.push(g.sonuc.metin);
      else if((g.isTuru==='maliRapor'||g.isTuru==='ayBasi')&&g.sonuc&&g.sonuc.metin)p.push(g.sonuc.metin);   /* H2-d */
    }
    const y=r.neden==='karar'?kararYeri():null;
    const bas=ilerleBas(r,y);
    return bas+(haberSayisi()&&!y&&r.neden!=='haber'?' Telefonda yeni haber var.':'')+(izler().sayi&&izler().sayi!==sayi0&&izler().gazeteYeni?' Masada yeni gazete var.':izler().yeniHaber&&!izler().sayi?' Masada gazete var.':'')+(yeniRapor()?' Dosyada yeni rapor var.':'')+(p.length?' '+p.join(' · '):'');
  }
  /* İlerle'nin durduğu yerin cümlesi (alt şerit ve U4 durak özeti) */
  function ilerleBas(r,y){
    if(y===undefined)y=r.neden==='karar'?kararYeri():null;
    return r.neden==='karar'?kararMetni(y,'Telefon: karar gerektiren bir haber geldi.','Masada yeni dosya: karar bekleyen bir konu açıldı.','Yeni bir gelişme var; dosyada.'):r.neden==='haber'?(r.biten.some(g=>g.sonuc&&g.sonuc.yazisma)?'Cevap geldi; telefonda.':'Beklediğin görüş geldi; dosyada.'):r.neden==='sonCevap'?'Son cevap saati geldi; karar bekliyor. Cevap vermeden ilerlersen kartta yazan sonuç işler.':r.neden==='cevapsiz'?'Cevap vermediğin karar kartta yazan sonuçla kapandı.':r.neden==='randevu'?'Sıradaki randevuya gelindi.':r.neden==='cakisma'?'Günün işleri çakışıyor; ajandadan seçim yap.':'Bekleyen rutin işler işlendi.';
  }
  function ilerleEylem(){
    izleme=null;
    let r;
    const sayi0=izler().sayi,once={tarih:k.tarih,dakika:k.gunIciDakika};
    if(typeof zamanSahnesiKapat==='function')zamanSahnesiKapat();
    try{r=komut(x=>{if(gozlemVar&&x.gozlem)gozlemBitir(x);return duragaIlerle(x);});}catch(e){hataGoster(e);return;}
    onay=null;secili=null;
    mesaj=ilerleOzeti(r,sayi0);
    /* açık panel kapanır: oyuncu yeni duruma odadan bakar; haber paneli kendiliğinden açmaz */
    acik=null;
    /* U4: zaman geçiyor sahnesi (yalnız sunum; komut yukarıda uygulandı): saat kolları döner, olanlar sırayla, sonunda durak özeti */
    if(typeof zamanSahnesiBaslat==='function'&&typeof zamanOzeti==='function'){
      const o=ilerleOnizle(k);
      zamanSahnesiBaslat({ozet:zamanOzeti(k,once,r),baslik:tarihYazi(k.tarih)+' · '+saatYazi(k.gunIciDakika),durak:ilerleBas(r),
        sonraki:o.engel.length?null:durakYazi(o),gunYazi:t=>tarihKisa(t),saat:dk=>{if(typeof odaSaatGoster==='function')odaSaatGoster(dk);},
        /* U7 incelemesi: sahne bitince odak İlerle'de ya da Duraklat'ta kalır */
        cizim:()=>{const ae=document.activeElement,s=ae&&kap.contains(ae)?(ae.classList.contains('od-ana')?'.od-alt .od-ana':ae.dataset&&ae.dataset.eylem==='duraklat'?'.od-duraklat':undefined):undefined;ciz(s);}});
    }
    ciz('.od-ana');
  }
  /* U4: zaman sahnesi açıkken: bir düğmeye basmak sahneyi kaldırır ve düğmenin işi yapılır (İlerle yeniden ilerler; Duraklat akışı özete atlatır);
     boş yere ya da sahneye tıklamak akışı atlatır, özeti kaldırır (odada boş yer tıklaması o zaman nesne de açar). Tuşlar: Enter ve Esc akışı atlatır,
     özeti kaldırır; öbür tuşlar (1–4, Boşluk/P) işini yapar */
  kap.addEventListener('click',e=>{
    const Z=typeof ZAMAN_SAHNE!=='undefined'?ZAMAN_SAHNE:null;if(!Z||!Z.acik)return;
    const b0=e.target.closest('button'),ey0=b0&&b0.dataset.eylem;
    if(b0){if(ey0!=='duraklat')zamanSahnesiKapat();return;}
    const kart=!!e.target.closest('.zm-sahne');
    if(Z.evre==='akis'){zamanSahnesiAtla();e.stopImmediatePropagation();return;}
    zamanSahnesiKapat();if(kart)e.stopImmediatePropagation();
  },true);
  addEventListener('keydown',e=>{
    const Z=typeof ZAMAN_SAHNE!=='undefined'?ZAMAN_SAHNE:null;if(!Z||!Z.acik||kap.hidden||e.ctrlKey||e.altKey||e.metaKey)return;
    if(['Enter','NumpadEnter','Escape'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(Z.evre==='akis')zamanSahnesiAtla();else{zamanSahnesiKapat();ciz('.od-ana');}return;}
  },true);
  kap.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(!b){
      /* odaya tıklama: imlecin altındaki nesne açılır; boş yere tıklamak paneli kapatır; yürürken tıklamak yürüyüşü bitirir */
      if(e.target.dataset&&e.target.dataset.perde){kapat();return;}
      if(e.target===kap){if(balkonVar&&ODA.yer==='yolda'){if(!duraklatmaVar())odaYuruAtla();return;}const ad=ODA.uzerinde;if(ad==='kapi'){if(!duraklatmaVar())yerDegistir();}else if(ad)panelAc(ad);else if(acik)kapat();else ciz();}
      return;
    }
    if(b.disabled)return;
    const id=b.dataset.is,ey=b.dataset.eylem,ms=b.dataset.mesele;
    /* U7 incelemesi: işin içinde başka yere gidilince (telefonda geri, dosyada sekme…) göz atma kapanır */
    if(goz&&!['gozAt','odakGeri','kapat','duraklat','kartOnizle','testAc'].includes(ey))goz=null;
    if(ey==='duraklat'){duraklatDegistir();return;}
    if(duraklatmaVar()&&DURAKLATMADA_KAPALI.has(ey))return;
    if(ey==='testAc'){const u=b.parentNode,a=!u.classList.contains('acik');u.classList.toggle('acik',a);b.setAttribute('aria-expanded',a?'true':'false');return;}
    if(!ey&&id){secili=id;onay=null;ciz('button[data-is="'+id+'"]:not([data-eylem])');return;}
    if(ey==='ac'){if(acik===b.dataset.panel)kapat();else panelAc(b.dataset.panel);}
    else if(ey==='dosyaAc'){if(b.dataset.gezinti)donusYeri=null;dosyaRapor=false;panelAc('dosya',ms,b.dataset.donus);}
    /* S-c: Kadro sekmesi, oyuncu dosyası ve listeye dönüş (okuma; Duraklat'ta da açık) */
    else if(ey==='kadroSekme'){dosyaKadro=true;seciliOyuncu=null;dosyaArsiv=false;dosyaRapor=false;ciz('[data-eylem="kadroSekme"]');}
    else if(ey==='oyuncuAc'){const g=kap.querySelector('.dsy-genis');if(g)kadroYeri=g.scrollTop;dosyaKadro=true;seciliOyuncu=b.dataset.oyuncu;ciz('[data-eylem="kadroDon"]');}
    else if(ey==='kadroDon')kadroDon();
    else if(ey==='kararAc'){kararIs=id;panelAc('karar');}
    /* U3: göz atma (okuma; Duraklat'ta da açık) ve Sonra yığınındaki kâğıt */
    else if(ey==='gozAt'){goz={tur:b.dataset.goz,tarih:b.dataset.tarih||null,dakika:b.dataset.dakika!==undefined?Number(b.dataset.dakika):-1,sure:Number(b.dataset.sure)||0,ad:b.dataset.ad||null,oyuncu:b.dataset.oyuncu||null,isId:b.dataset.is||null};
      ciz('.odk-geri');}
    else if(ey==='sonraAc')kararYerindeAc(id);
    else if(ey==='donus'){const d=donusYeri;donusYeri=null;if(d)panelAc(d.panel,null,null,true);}
    else if(ey==='arsiv'){dosyaArsiv=!dosyaArsiv||dosyaKadro;dosyaRapor=false;dosyaKadro=false;ciz('[data-eylem="arsiv"]');}
    /* H2-d: dosyanın Raporlar sekmesi ve bir rapor (okumak zaman ilerletmez; Duraklat'ta da açıktır) */
    else if(ey==='raporlar'){dosyaRapor=true;dosyaArsiv=false;dosyaKadro=false;const R=raporlar(),y=yeniRapor();seciliRapor=y?y.i:R.length?R[0].i:null;
      raporlariGor();
      if(acik!=='dosya')panelAc('dosya');else ciz('[data-eylem="raporlar"]');}
    else if(ey==='raporAc'){seciliRapor=Number(b.dataset.rapor);dosyaRapor=true;dosyaArsiv=false;dosyaKadro=false;const h=k.haberler[seciliRapor];
      if(h&&!h.gorulen)try{komut(x=>raporGoruldu(x,seciliRapor));}catch(e){mesaj=e.message;}ciz('[data-eylem="raporAc"][data-rapor="'+seciliRapor+'"]');}
    /* telefon gezintisi: zaman ve kariyer değişmez (konuşmayı açmak yalnız "yeni" işaretini kaldırır) */
    else if(ey==='telUyg'){tel.ekran=b.dataset.uyg;tel.skorAc=null;telLigSifirla();onay=null;telGecis=true;ciz('.tel-geri');}
    /* S-d: Canlı Skor'un lig gezintisi (sekme, fikstür haftası, kulüp ekranı; js/ekran-telefon.js telGezinti; okuma) */
    else if(ey==='skorSekme'||ey==='fiksturHafta'||ey==='kulupAc'||ey==='skorGeri'){if(ey==='kulupAc'){const g=kap.querySelector('.tel-govde');telSkorYeri=g?g.scrollTop:0;}
      const id=tel.kulup,o=telGezinti(tel,b);telGecis=ey==='kulupAc'||ey==='skorGeri';ciz(o);if(ey==='skorGeri')telSkorYeriGeri(id);}
    else if(ey==='telEv'){telAnaEkran();}
    else if(ey==='telKisi'){onay=null;konusmaAc(b.dataset.kisi);telGecis=true;ciz('.tel-geri');}
    else if(ey==='telKisiler'){tel.ekran='mesajlar';panelAc('telefon',null,null,true);}
    else if(ey==='skorAc'){const id=b.dataset.mac||null;tel.skorAc=tel.skorAc===id?null:id;ciz('[data-eylem="skorAc"][data-mac="'+id+'"]');}
    else if(ey==='gun'){ajandaGun=b.dataset.tarih;secili=null;onay=null;ciz('[data-eylem="gun"][data-tarih="'+ajandaGun+'"]');}
    else if(ey==='hafta'){ajandaHafta=Math.max(0,Math.min(2,Number(b.dataset.hafta)));ajandaGun=ajandaHafta?tarihEkle(k.tarih,7*ajandaHafta-((new Date(k.tarih+'T00:00:00Z').getUTCDay()+6)%7)):k.tarih;
      secili=null;onay=null;ciz('[data-eylem="hafta"][data-hafta="'+(ajandaHafta+(Number(b.dataset.hafta)>=ajandaHafta?1:-1))+'"]');}
    else if(ey==='gazeteSayi'){gazeteGun=b.dataset.tarih;ciz(gazeteOdak(b.dataset.yon==='geri'));}   /* S-e: sayılar arasında (okuma) */
    else if(ey==='kayitDisa'){kayitDisaAktar();ciz('[data-eylem="kayitDisa"]');}
    else if(ey==='kayitIce'){const g=kap.querySelector('.od-iceDosya');if(g)g.click();}
    else if(ey==='kayitIceVazgec'){iceOnay=null;ciz('[data-eylem="kayitIce"]');}
    else if(ey==='kayitIceYukle'){const s=iceOnay?oyun.kayitIce(iceOnay.metin):{tamam:false,hata:'dosya seçilmedi'};iceOnay=null;
      if(s.tamam)location.href=location.pathname;else{mesaj='Kayıt yüklenemedi: '+s.hata;ciz();}}
    else if(ey==='ayarBolum'){ayarBolum=b.dataset.bolum;yeniOnay=false;iceOnay=null;ciz('[data-eylem="ayarBolum"][data-bolum="'+ayarBolum+'"]');}
    else if(ey==='goruntu')goruntuKaydet();
    else if(ey==='kapat')kapat();
    else if(ey==='odakGeri'){const h=odakGeriHedef();if(h)h.f();}
    else if(ey==='yap')isiYap(id);
    else if(ey==='yapSor'){onay='yap:'+id;ciz('[data-eylem="yap"]');}
    else if(ey==='yapIzlemesiz')isiYap(id,undefined,{izle:false});   /* H2-a TEST: Maçı izleme */
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
    /* R2-e: argümanlı konu (oyuncu sorusu): önce seçim açılır (aynı konuya yeniden basınca kapanır); seçim girişimi data-arg ile başlatır */
    else if(ey==='oyuncuSec'){const g=b.dataset.girisim;tel.oyuncuSec=tel.oyuncuSec===g?null:g;ciz(tel.oyuncuSec?'.tlf-oyuncular [data-arg]':'.tlf-konu[data-girisim="'+g+'"]');}
    else if(ey==='oyuncuSecKapat'){const g=tel.oyuncuSec;tel.oyuncuSec=null;ciz('.tlf-konu[data-girisim="'+g+'"]');}
    else if(ey==='girisim'){try{mesaj=komut(x=>girisimBaslat(x,b.dataset.girisim,b.dataset.arg||undefined));tel.oyuncuSec=null;secili=null;ajandaGun=k.tarih;ajandaHafta=0;telAlta=true;ciz();
      /* H2-c: gönderince konuşma alta kayar. İnceleme (H2-e): odak konuşmada kalır (sıradaki açık konu, yoksa geri), şerit metni duyurulur. R2: konular iş panelinde */
      const f=acik!=='telefon'?null:kap.querySelector('.tlf-is .tlf-konu:not([disabled])')||kap.querySelector('.tel [data-eylem="girisim"]:not([disabled])')||kap.querySelector('.tel .tel-geri');if(f)f.focus({preventScroll:true});
      if(typeof metinDuyur==='function')metinDuyur(mesaj);}catch(x){hataGoster(x);}}
    else if(ey==='test'){ayarlar.test=!ayarlar.test;ayarlar.kaydet();ciz('[data-eylem="test"]');}
    else if(ey==='yazi'){ayarlar.yazi=b.dataset.yazi;ayarlar.kaydet();ciz('[data-eylem="yazi"][data-yazi="'+ayarlar.yazi+'"]');}
    /* U1: maç hızı ve önemli anlarda normal hız (js/arayuz.js izlemeHizSec ve MAC_HIZ aynı seçimi okur) */
    else if(ey==='macHizi'){ayarlar.macHizi=Number(b.dataset.hiz);ayarlar.kaydet();if(typeof izlemeHizSec==='function')izlemeHizSec(ayarlar.macHizi,false);ciz('[data-eylem="macHizi"][data-hiz="'+ayarlar.macHizi+'"]');}
    else if(ey==='locaBakisi'){ayarlar.locaBakisi=!ayarlar.locaBakisi;ayarlar.kaydet();if(typeof pulUygula==='function')pulUygula(!ayarlar.locaBakisi);ciz('[data-eylem="locaBakisi"]');}   /* P2 (TEST) */
    else if(ey==='otoYavas'){ayarlar.otoYavas=ayarlar.otoYavas===false;ayarlar.kaydet();if(typeof MAC_HIZ!=='undefined')MAC_HIZ.oto=ayarlar.otoYavas;ciz('[data-eylem="otoYavas"]');}
    else if(ey==='yeniSor'){yeniOnay=true;ciz('[data-eylem="yeniHayir"]');}
    else if(ey==='yeniHayir'){yeniOnay=false;ciz();}
    else if(ey==='yeniEvet'){yeniOnay=false;mesaj=oyun.yeniKariyer();k=oyun.kariyer;acik=null;secili=null;seciliMesele=null;onizleler={};
      dosyaSira=[];dosyaArsiv=false;dosyaSonuc=null;donusYeri=null;dosyaKadro=false;seciliOyuncu=null;ajandaGun=null;ajandaHafta=0;tel.ekran='ana';tel.kisi=null;telLigSifirla();yeniIsaret=new Set();ciz('.od-ana');}
    else if(ey==='bozukYeni'){mesaj=oyun.bozuguSaklaVeBasla();k=oyun.kariyer;ciz('.od-ana');}
  });
  /* imleç odadaki nesnenin üzerindeyken çerçevesi yanar ve el imleci görünür */
  kap.addEventListener('change',e=>{if(e.target&&e.target.classList&&e.target.classList.contains('od-iceDosya'))kayitDosyasiSecildi(e.target);});
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
    /* U1: Esc bir adım geri (onay → işin iç adımı → kaynak → masaya bırak; N7'nin "uygulamadan ana ekrana" kuralının yerine, u-arayuz §4).
       Masada bekleyen İlerle onayını da bırakır */
    else if(e.code==='Escape'&&acik){e.preventDefault();odakEsc();}
    else if(e.code==='Escape'&&onay){e.preventDefault();onay=null;ciz('.od-ana');}
    /* S-c: oyuncu dosyasında [ ve ] önceki ve sonraki oyuncu (kadro listesinin sırası); kadro listesinde bir şey yapmaz */
    /* S-e: gazetede [ ve ] önceki ve sonraki sayı */
    else if((e.code==='BracketLeft'||e.code==='BracketRight')&&acik==='gazete'){const t=gazeteGosterilen();if(!t)return;const y=tarihEkle(t,e.code==='BracketLeft'?-1:1);
      if(typeof gazeteSayisi==='function'&&gazeteSayisi(k,y)){e.preventDefault();gazeteGun=y;ciz(gazeteOdak(e.code==='BracketLeft'));}}
    else if((e.code==='BracketLeft'||e.code==='BracketRight')&&acik==='dosya'&&kadroGorunur()){
      if(!seciliOyuncu)return;const S=kadroSatirlari(k,kulupId()).map(x=>x.id),n=S.length,i=S.indexOf(seciliOyuncu);if(n<2)return;
      e.preventDefault();seciliOyuncu=S[i<0?0:(i+(e.code==='BracketLeft'?-1:1)+n)%n];ciz('[data-eylem="kadroDon"]');}
    else if((e.code==='BracketLeft'||e.code==='BracketRight')&&acik==='dosya'&&!dosyaArsiv){
      const S=acikSira(),n=S.length,i=S.indexOf(seciliMesele);if(!n||(n<2&&i>=0))return;
      e.preventDefault();donusYeri=null;panelAc('dosya',S[i<0?0:(i+(e.code==='BracketLeft'?-1:1)+n)%n]);}
  });
  /* tek kart (H1, F4; js/ekran-kart.js): dosya, karar paneli ve telefon konuşması aynı kökte, aynı sözleşmeyle. Kaydırıp bırakmak ya da ←/→ + Enter
     uygular (isiYap, seçenek kimliğiyle; uygulanınca kartın kopyası damgalanır); kenar etiketi ve ←/→ yalnız önizler; Esc önizleme varken onu bırakır,
     yoksa odak zincirinde bir adım geri. U2: yüz kartın içinde döner, oda yeniden çizmez (önizleme yalnız kaydedilir; sonraki çizimler aynı yüzü
     kurar), odak kartta kalır. Duraklatmada kart kilitli: önizlenir, uygulanmaz (kart nedenini yüzünde yazar) */
  if(typeof kartEtkilesimKur==='function')kartEtkilesimKur(kap,{
    uygula:(id,secim)=>isiYap(id,secim),
    /* R2-d: kart yerinde döner; telefonun iş panelinde yanındaki bağlam önizlenen cevaba göre yenilenir */
    onizle:(id,y)=>{if(y)onizleler[id]=y;else delete onizleler[id];if(typeof tlfBaglamEsle==='function')tlfBaglamEsle(kap,k,id,y||null);},
    kilitli:()=>duraklatmaVar()});
  /* duraklatma değişince düğmeler yeniden çizilir; izlerken o ana kadarki gözlem kaydedilir. Odak kartta (ya da kenar etiketinde) ya da Duraklat
     düğmesindeyse yeniden çizimden sonra aynı yere döner: Boşluk/P ile duraklatıp devam eden klavye kullanıcısı ←/→/Enter'ı kaybetmez (inceleme 2026-10-26) */
  const odakSecici=()=>{const ae=document.activeElement,ic=ae&&ae!==kap&&kap.contains(ae)?ae:null,c=ic&&ic.closest('.kk-kart');
    return c?'.kk-kart[data-is="'+c.dataset.is+'"]'+(ic.classList.contains('kk-kenar')?' .kk-kenar[data-yon="'+ic.dataset.yon+'"]':''):ic&&ic.dataset.eylem==='duraklat'?'.od-duraklat':undefined;};
  duraklatmaDinle(a=>{if(kap.hidden||oyun.bozukHata)return;if(a&&izleme)izlemeKaydet();const s=odakSecici();if(a&&typeof zamanSahnesiAtla==='function')zamanSahnesiAtla();ciz(s);});   /* U4: Duraklat akışı özete atlatır */
  addEventListener('pagehide',()=>{if(izleme)izlemeKaydet();});
  /* kayıttan dönüşte süren bir gözlem varsa başkan balkondadır */
  if(gozlemVar&&k&&gozlemAcik(k))odaYerAyarla('balkon');
  return{ciz,ac:panelAc,kapat,yer:yerDegistir,get acik(){return acik;}};
}

/* ---- oyundaki açılış (index.html): oda varsayılan sayfadır. Prototip sayfası kendi oturumunu kurar; orada bu bölüm çalışmaz ---- */
if(typeof ON_EKRAN!=='undefined'&&typeof OYUN!=='undefined'){
  const kap=$('oda');
  if(ON_EKRAN.sayfa==='oda'){
    oyunBaslat();
    const ekran=odaEkraniKur(kap,{
      get kariyer(){return OYUN.kariyer;},komut:oyunKomut,kayitYazi:oyunKayitYazi,kayitHata:oyunKayitHata,
      kayitTamam:()=>OYUN.oturum.durum.tamam,kayitCakisma:()=>!!OYUN.oturum.durum.cakisma,kayitDisa:oyunKayitDisa,kayitIceOnizle:kayitIceOnizle,kayitIce:oyunKayitIce,yenidenKaydet:()=>OYUN.oturum.kaydet(),yeniKariyer:oyunYeniKariyer,
      /* maç günü (F1-b, 2026-10-23): maç sınırı sayfa yeniden yüklemesidir. "Stada git" kaydedilmez; sayfa maçın kimliğiyle açılır, js/mac-gunu.js
         kayıtlı kariyerden maç gününü kurar ve bülten açılır (stat, seyirci ve maç o maça göre kurulur). Maç kimliği yoksa (eski davranış) bülten */
      /* H2-a (TEST "Maçı izleme"): {izle:false} ile adres ?ekran=mac&izle=0&mac=<kimlik> — bülten açılmaz, maç perdenin arkasında hesaplanır.
         Kayıt koşulu Stada git'inkiyle aynı; F1-b gereği kaydedilmez */
      macaGit:(macId,git)=>{
        if(macId){
          /* maç sayfası kariyeri kayıttan açar: kayıt yazılamıyorsa (yalnız bellek ya da kaydedilmemiş değişiklik ve kayıt hatası) gitmek
             bellekteki ilerlemeyi atar; o zaman gidilmez, nedeni söylenir (F1-b incelemesi) */
          const o=OYUN.oturum;
          if(OYUN.depo==='bellek'||(o.durum.bekleyen&&!o.kaydet().tamam))return'Maç açılamıyor: kayıt yazılamıyor ('+oyunKayitYazi()+'). Kayıt düzelince Stada git yeniden denenebilir.';
          /* U4: bilet kartı — oda kararır, kart gösterilir ve yeni sayfanın ilk boyamasına taşınır (js/gecis-karti.js); 300 ms sonra gidilir */
          const adres=location.pathname+(git&&git.izle===false?'?ekran=mac&izle=0':'?ekran=bulten')+'&mac='+encodeURIComponent(macId);
          const k=OYUN.kariyer,f=(k.fikstur||[]).find(x=>x.id===macId),biz=(k.kisiler[k.baskanId]||{}).kulupId;
          if(f&&typeof gecisKartiGoster==='function'){const ad=id=>(k.kulupler[id]||{ad:id}).ad,G=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],[y,a,g]=f.tarih.split('-').map(Number);
            const stat=typeof kulupStatTarifi==='function'?(kulupStatTarifi(k,f.ev)||{}).ad:null;
            const o={tur:'bilet',ust:f.hafta+'. hafta'+(k.sezon&&k.sezon.ad?' · '+k.sezon.ad:''),baslik:ad(f.ev)+' – '+ad(f.konuk),alt:G[new Date(Date.UTC(y,a-1,g)).getUTCDay()]+' '+gunAyYazi(f.tarih)+' · '+saatYazi(f.dakika),
              not:(f.konuk===biz?'Deplasman · ':'')+(stat||'')};
            gecisKartiKaydet(o);gecisKartiGoster(o,true);}
          setTimeout(()=>{location.href=adres;},typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches?0:300);return null;}
        kap.hidden=true;ON_EKRAN.bulteniAc();return null;},
      ilkMesaj:OYUN.mesaj,get bozukHata(){return OYUN.bozukHata;},bozuguSaklaVeBasla:oyunBozuguSakla
    },OYUN.ayarlar);
    kap.hidden=false;ekran.ciz('.od-ana');
  }else kap.hidden=true;
}
