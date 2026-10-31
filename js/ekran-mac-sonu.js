/* ============ Chairman — maç sonu kartı ve "Odaya dön" (F2, 2026-10-23; ortak sunum bileşeni, kural içermez) ============
   Kariyerden açılan maç (js/mac-gunu.js MAC_GUNU.kariyer) bitince, düdükten STIL.macSonu.kartSn motor saniyesi sonra (sevinç ve çöküş
   izlenir; "Maçı bitir (TEST)" ile bitince hemen) maçın üstünde açık kâğıt bir kart açılır. Arkada maç sonu sürer (tokalaşma, alkış, tünel);
   maç durdurulmaz. Telefon açıksa kart telefon kapanınca açılır; kart açıkken telefon açılmaz (ON_EKRAN.sayfa 'macSonu', loca'nın kalıbı).
   Kartta: hafta, iki kulüp ve skor (bizim kulüp vurgulu), goller (dakika, ad, kulüp; kendi kalesine), kartlar, sakatlıklar (ağrı yazılmaz);
   "Test bilgileri" açıkken ikiz motorun durumu (TEST). Tek düğme "Odaya dön ▸".
   Odaya dön (YOL_HARITASI karar 38): sonuç komutu (js/mac-sonuc.js macSonucuUygula) bir kez uygulanır ve kaydedilir (oyunKomut), kayıt
   yazılınca sayfa parametresiz açılır (oda, 21:00). Kayıt yazılamazsa sayfa yenilenmez: "Yeniden dene" yalnız kaydeder (komut ikinci kez
   uygulanmaz); sayfa kapanırsa kayıt maç günündedir ve maç aynı tohumla yeniden oynanır. Komut reddedilirse (belirlenimci; yeniden denemek
   işe yaramaz) neden yazılır, düğme "Odaya dön (sonuç yazılmadan)" olur.
   Kariyersiz geliştirme adreslerinde (?ekran=mac) kart açılmaz. Yazı büyüklüğü ayarı uygulanır; renkler STIL.kagit, ölçüler STIL.macSonu (TEST).
   H2-a (2026-10-26): "Maçı bitir" perdesi (js/mac-sahnesi.js HIZLI_BITIR.perde) açıkken kartın kâğıt dilinde "Maç hesaplanıyor…" örtüsü (#macHesap):
   işçisiz yolda yanında maçın dakikası, duraklatmada "Duraklatıldı"; kart, karar anı ya da tepe anı açıkken gizli. "Odaya dön" iki kipte de öbür
   maçlar sürdükçe sayfayı dondurmadan bekler ("Öbür maçlar tamamlanıyor… n/7"; kalanı ligCanliHizli bitirir). İşçi yolunda bekleme
   MAC_SONU.isciBekle'yi (TEST, duraklatma sayılmaz) aşarsa işçi bırakılır (arkaDus), kalanı ana iplik bitirir; eşzamanlı ligCanliBitir yalnız son
   çaredir. Dosyanın sonunda TEST "Maçı izleme" başlatması (js/mac-gunu.js MAC_GUNU.izlemesiz): şerit gizlenir, perde ilk kareden açılır.
     macSonuKare(dt)   her karede (js/arayuz.js)
     MAC_SONU          durum: {acik, sonuc, uygulandi, red, bekliyor, isciBekle} (denemeler okur) */
const MAC_SONU={acik:false,sonuc:null,uygulandi:false,red:false,redAn:0,isliyor:false,bekliyor:null,isciBekle:60000,bekleGecen:0,bekleSon:0};
{
  const A=STIL.macSonu,K=STIL.kagit,kok=document.getElementById('screen');
  const st=document.createElement('style');st.id='macSonuStili';
  st.textContent=`
.mac-sonu{position:absolute;inset:0;z-index:5;display:grid;place-items:center;pointer-events:none;font-family:var(--govde);font-size:var(--ms-boy,var(--k-yaziBoyu,max(14px,1.5cqw)));line-height:1.35;color:${K.yazi}}
.mac-sonu[hidden]{display:none}
.ms-kararti{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 46%,rgba(0,0,0,0) 40%,rgba(0,0,0,${A.kararma}) 100%)}
.ms-kart{position:relative;pointer-events:auto;width:min(62%,44em);max-height:88%;overflow:auto;display:grid;gap:.7em;padding:.9em 1.3em 1em;background:${K.zemin};border:1px solid ${K.cizgi};box-shadow:.35em .45em 0 ${K.golge}}
.ms-ust{margin:0;padding-bottom:.3em;border-bottom:.18em solid ${K.kulup};color:${K.soluk};font-size:max(var(--k-enKucuk,12px),.9em);letter-spacing:.12em;text-transform:uppercase}
.ms-skor{display:grid;grid-template-columns:minmax(0,1fr) auto auto auto minmax(0,1fr);align-items:center;gap:.6em}
.ms-skor .arma{font-size:.9em}
.ms-skor span:not(.ms-arma){min-width:0;font-family:var(--display);font-size:1.9em;line-height:1;letter-spacing:.03em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ms-skor span:first-child{text-align:right}
.ms-skor .ms-arma{display:grid;place-items:center}
.ms-skor span.ms-biz{color:${K.kulup}}
.ms-skor b{font-family:var(--display);font-weight:400;font-size:3.2em;line-height:.85;font-variant-numeric:tabular-nums}
.ms-bolum{display:grid;gap:.15em}
.ms-bolum h4{margin:0;color:${K.vurgu};font-size:max(var(--k-enKucuk,12px),.78em);font-weight:600;letter-spacing:.12em;text-transform:uppercase}
.ms-iki{display:grid;grid-template-columns:1fr 1fr;gap:0 1.4em}
.ms-bolum ul{margin:0;padding:0;list-style:none;display:grid;align-content:start;gap:.1em;min-width:0}
.ms-bolum li{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ms-bolum small{color:${K.soluk}}
.ms-dk{display:inline-block;min-width:2.6em;color:${K.soluk};font-variant-numeric:tabular-nums}
.ms-kartRenk{display:inline-block;width:.6em;height:.85em;margin-right:.4em;vertical-align:-.1em;border:1px solid rgba(0,0,0,.35);border-radius:.08em}
.ms-yok{margin:0;color:${K.soluk}}
.ms-test{margin:0;padding:.25em .6em;border:1px dashed ${K.cizgi};color:${K.soluk};font-size:max(var(--k-enKucuk,12px),.85em)}
.ms-test b{color:${K.vurgu};font-size:max(var(--k-enKucuk,12px),.85em);letter-spacing:.1em;margin-right:.4em}
.ms-alt{display:flex;align-items:center;justify-content:space-between;gap:1em;padding-top:.6em;border-top:.18em solid ${K.cizgi};
  position:sticky;bottom:-1em;margin-bottom:-1em;padding-bottom:1em;background:${K.zemin}}   /* R1-f: kart kayarken Odaya dön hep görünür */
/* R1-f: dar karede (yazı tabanında) kart genişler */
@container (max-width:820px){.ms-kart{width:94%;max-height:94%}}
.ms-durum{margin:0;min-width:0;color:${K.soluk}}
.ms-durum.ms-hata{color:${K.kirmizi}}
.mac-sonu button.ms-don{flex:none;font:inherit;font-weight:600;color:${K.vurguYazi};background:${K.vurguZemin};border:1px solid ${K.vurgu};border-bottom-width:.2em;border-radius:.2em;padding:.4em 1.1em .32em;cursor:pointer}
.mac-sonu button.ms-don:disabled{opacity:.6;cursor:progress}
.ms-kart:focus{outline:none}
.mac-sonu button.ms-don:focus-visible{outline:.14em solid ${K.kulup};outline-offset:.12em}
.mac-sonu .ms-hesap{width:min(46%,26em);justify-items:center;text-align:center;gap:.35em}
/* U4 (envanter 22): kart belirir — kenarlar kararır, kâğıt aşağıdan yerine oturur; "hareketi azalt"ta yalnız opaklık */
.mac-sonu.ms-belir .ms-kararti{animation:msGel .35s ease-out both}
.mac-sonu.ms-belir .ms-kart{animation:msKart .32s cubic-bezier(.2,.7,.3,1) both}
@keyframes msGel{from{opacity:0}to{opacity:1}}
@keyframes msKart{from{opacity:0;transform:translateY(1.2em) scale(.98)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.mac-sonu.ms-belir .ms-kart{animation:msGel .15s linear both}}
.ms-hesap p{margin:0}
.ms-hesap b{font-family:var(--display);font-weight:400;font-size:1.9em;line-height:1;letter-spacing:.03em}
`;
  document.head.appendChild(st);
  const E=document.createElement('section');E.className='mac-sonu';E.id='macSonu';E.hidden=true;E.setAttribute('role','dialog');E.setAttribute('aria-label','Maç sonu');
  kok.appendChild(E);
  /* H2-a: perdenin örtüsü (kartın kâğıt dilinde; yeni görsel dil yok) */
  const O=document.createElement('section');O.className='mac-sonu';O.id='macHesap';O.hidden=true;O.setAttribute('aria-label','Maç hesaplanıyor');
  O.innerHTML='<div class="ms-kararti"></div><div class="ms-kart ms-hesap"><p class="ms-ust">'+(MAC_GUNU.bulten&&MAC_GUNU.bulten.hafta?String(MAC_GUNU.bulten.hafta).replace(/[&<>"]/g,'')+'. hafta':'Maç')+'</p>'+
    '<p role="status"><b>Maç hesaplanıyor…</b></p><p class="ms-yok ms-hesapAlt"></p></div>';
  kok.appendChild(O);
  const hesapAlt=O.querySelector('.ms-hesapAlt');let hesapYazi=null;
  const hesapKare=()=>{
    const H=HIZLI_BITIR,g=H.perde&&!MAC_SONU.acik&&!KARAR_ANI.acik&&!TEPE_AN.aktif;
    if(O.hidden===g){O.hidden=!g;if(g)O.style.setProperty('--ms-boy',yaziBoyuDegeri());}
    if(!g)return;
    const dk=MAC_ARKA.kip!=='isci'&&!H.anlik?mac.minuteLabel():'',d=duraklatmaVar()?'Duraklatıldı':dk?(/^\d/.test(dk)?dk+'\'':dk):'';
    /* U4 (envanter 30): haftanın öbür maçlarından biten sayısı (n/7); bekleme bilgi taşısın */
    const L=typeof LIG_CANLI!=='undefined'?LIG_CANLI:[],n=L.filter(x=>x.m?x.m.phase==='fulltime':!!x.son).length;
    const y=[d,L.length?'öbür maçlar '+n+'/'+L.length:''].filter(Boolean).join(' · ');
    if(y!==hesapYazi){hesapYazi=y;hesapAlt.textContent=y;}
  };
  const yaz=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const G=MAC_GUNU,adi=t=>(G.kadro[t].tamAd||G.kadro[t].ad),kisa=t=>G.kadro[t].kisa||G.kadro[t].ad;
  /* R3: başlıkta skorun iki yanında kulübün arması (js/arma.js, büyük; çizim yoksa boş hücre) */
  const arma=t=>'<span class="ms-arma">'+(typeof armaSvg==='function'&&G.kadro[t].id?armaSvg(G.kadro[t].id,'buyuk',G.kadro[t].kisa||null):'')+'</span>';
  const KART_RENK=STIL.kagit.kartRenk;   /* H2-b: Canlı Skor'un ayrıntısıyla ortak */
  const DERECE={tedavi:'tedavi gördü',cikis:'oyundan çıktı'};
  /* satır: takımın sütununda (ev solda, konuk sağda; iki ayrı liste, satırlar kaymaz) */
  const satir=(t,ic)=>({t,ic:'<li>'+ic+'</li>'});
  const bolum=(baslik,L)=>L.length?'<div class="ms-bolum"><h4>'+baslik+'</h4><div class="ms-iki">'+[0,1].map(t=>'<ul>'+L.filter(x=>x.t===t).map(x=>x.ic).join('')+'</ul>').join('')+'</div></div>':'';
  function msIcerik(S){
    const B=G.bulten||{},biz=G.tv?-1:G.biz;   /* RK8-a: TV'de vurgu yok */
    const hk=S.hukmen?(S.hukmen==='cift'?'İki takım da on bir uygun oyuncu çıkaramadı; maç oynanmadı.':adi(S.hukmen==='ev'?0:1)+' on bir uygun oyuncu çıkaramadı; maç hükmen.')+' (TEST)':'';
    const goller=hk?[]:S.goller.map(g=>satir(g.takim,'<span class="ms-dk">'+g.dakika+'\'</span>'+yaz(g.ad||'—')+(g.kendiKalesine?' <small>(k.k.)</small>':'')));
    const kartlar=S.kartlar.map(c=>satir(c.takim,'<span class="ms-dk">'+c.dakika+'\'</span><i class="ms-kartRenk" style="background:'+KART_RENK[c.renk]+'" title="'+(c.renk==='sari'?'Sarı kart':c.renk==='ikinciSari'?'İkinci sarıdan kırmızı':'Kırmızı kart')+'"></i>'+yaz(c.ad)));
    const sakat=S.sakatliklar.filter(x=>x.derece!=='agri').map(x=>satir(x.takim,'<span class="ms-dk">'+x.dakika+'\'</span>'+yaz(x.ad)+' <small>'+(DERECE[x.derece]||'')+(x.gun>0?' · ~'+x.gun+' gün':'')+'</small>'));
    let test='';
    if(typeof OYUN!=='undefined'&&OYUN.ayarlar&&OYUN.ayarlar.test){
      const I=typeof MAC_IZLEME!=='undefined'?MAC_IZLEME:null,s=I&&I.son;
      const Ar=MAC_ARKA;
      test='<p class="ms-test"><b>TEST</b>ikiz motor: '+(!I?'yok':s&&s.atlandi?'atlandı (maç hızlı bitirildi)':s?(s.ayni?'aynı':'farklı'):'bırakıldı')+(I&&I.sapma?' · sapma '+I.sapma:'')+
        ' · arka: '+(Ar.kip==='isci'?'işçi':'ana iplik'+(Ar.hata?' ('+yaz(Ar.hata)+')':''))+' · sonuç ikizi: '+(HIZLI_BITIR.anlik?'kullanıldı':Ar.ikizAyni===null?'—':Ar.ikizAyni?'aynı':'farklı')+'</p>';
    }
    return'<div class="ms-kararti"></div><div class="ms-kart" tabindex="-1">'+
      '<p class="ms-ust">'+(G.tv?'TV · ':'')+'Maç sonu'+(B.hafta?' · '+yaz((B.ligAd?B.ligAd+' ':'')+B.hafta+'. hafta'):'')+'</p>'+
      '<div class="ms-skor"><span class="'+(biz===0?'ms-biz':'')+'" title="'+yaz(adi(0))+'">'+yaz(adi(0))+'</span>'+arma(0)+'<b>'+S.skor[0]+'–'+S.skor[1]+'</b>'+arma(1)+'<span class="'+(biz===1?'ms-biz':'')+'" title="'+yaz(adi(1))+'">'+yaz(adi(1))+'</span></div>'+
      /* F3-b: beklenen gol (motorun şut listesinden; karar 34) */
      (hk?'<p class="ms-yok">'+yaz(hk)+'</p>':'')+(!hk&&Array.isArray(S.sutlar)&&typeof macBeklenenGol==='function'?(xg=>'<p class="ms-yok">Beklenen gol '+xg.map(x=>x.toFixed(2).replace('.',',')).join(' – ')+' · şut '+S.ist.sut[0]+' – '+S.ist.sut[1]+'</p>')(macBeklenenGol(S.sutlar.map(x=>({takim:x.takim,xg:x.xg,pen:x.pen})))):'')+
      (hk||goller.length+kartlar.length+sakat.length?'':'<p class="ms-yok">Gol, kart ve sakatlık yok.</p>')+
      bolum('Goller',goller)+bolum('Kartlar',kartlar)+bolum('Sakatlıklar',sakat)+test+
      '<div class="ms-alt"><p class="ms-durum" role="status">'+yaz(kisa(0)+' '+S.skor[0]+' – '+S.skor[1]+' '+kisa(1))+'</p><button type="button" class="ms-don" data-eylem="odayaDon">Odaya dön ▸</button></div></div>';
  }
  const durumYaz=(m,hata)=>{const p=E.querySelector('.ms-durum');if(p){p.textContent=m;p.classList.toggle('ms-hata',!!hata);}};
  function msAc(){
    const S=MAC_SONU;S.acik=true;ON_EKRAN.sayfa='macSonu';
    /* G1-a: bizim maç hükmense motor sonucu kullanılmaz. G1-e: "Maçı bitir" sonuç ikiziyle bittiyse ikizin sonucu (H2-a: anlık dalın aldığı kopya,
       js/mac-sahnesi.js HIZLI_BITIR.sonuc; sonradan işçi düşse de) */
    S.sonuc=G.hukmen?hukmenSonucu(G.hukmen):HIZLI_BITIR.anlik?JSON.parse(JSON.stringify(HIZLI_BITIR.sonuc)):mac.sonucKaydi();
    E.style.setProperty('--ms-boy',yaziBoyuDegeri());   /* U0: ortak ölçek */
    E.innerHTML=msIcerik(S.sonuc);E.classList.add('ms-belir');E.hidden=false;
    /* odak kartta (F2 incelemesi): kart kendiliğinden açılır; odak düğmede olsaydı maç boyu duraklatan Boşluk sonucu uygulayıp sayfadan çıkarırdı.
       Sekme düğmeye götürür */
    const kart=E.querySelector('.ms-kart');if(kart)kart.focus({preventScroll:true});
  }
  /* "Odaya dön": sonuç bir kez uygulanır ve kaydedilir; kayıt yazılınca oda açılır */
  function msOdayaDon(){
    const S=MAC_SONU,b=E.querySelector('.ms-don');if(S.isliyor)return;
    /* red sonrası düğme yeni anlamıyla ancak kısa bir süre sonra çalışır: çift tıklamanın ikincisi ya da Enter'ın tekrarı hata metnini atlamasın */
    if(S.red){if(performance.now()-S.redAn<800)return;location.replace(location.pathname);return;}
    S.isliyor=true;if(b)b.disabled=true;
    try{
      if(!S.uygulandi){
        const P=typeof MAC_PROTOKOL!=='undefined'&&MAC_PROTOKOL.karar?{id:MAC_PROTOKOL.karar.id,secim:MAC_PROTOKOL.karar.secim,an:MAC_PROTOKOL.karar.an==null?null:MAC_PROTOKOL.karar.an}:null;
        /* F7: haftanın öbür maçları — kalanı tamamlanır, sekiz sonuç tek komutla (biri reddedilirse hiçbiri yazılmaz) */
        const L=typeof LIG_CANLI!=='undefined'?LIG_CANLI:[];
        /* G1-e, H2-a: öbür maçlar sürüyorsa (işçide ya da ana iplikte) sayfa dondurulmadan beklenir; kalanı ligCanliHizli bitirir (macSonuKare) */
        if(L.length&&ligCanliSuruyor()&&S.bekliyor===null){S.bekliyor=performance.now();S.bekleGecen=0;S.bekleSon=S.bekliyor;S.isliyor=false;bekleYaz();return;}
        /* son çare: bekleme bittiği hâlde motoru ve sonucu olmayan maç kaldıysa eşzamanlı tamamlanır */
        if(L.length&&ligCanliSuruyor()&&!ligCanliBitir())throw new Error('Haftanın öbür maçları bitmedi');
        const D=L.map(x=>({macId:x.d.macId,sonuc:x.m?x.m.sonucKaydi():x.son,tohum:x.d.tohum}));   /* G1-a: hükmen öbür maç */
        /* RK8-a: TV'de maç — izlenen ve aynı saatteki sonuçlar lig maçı işleriyle, saat maçın sonuna (js/lig-takvimi.js tvMacSonucuUygula) */
        oyunKomut(k=>G.tv?tvMacSonucuUygula(k,G.macId,S.sonuc,D):D.length?haftaSonuclariUygula(k,G.macId,S.sonuc,G.tohum,{protokol:P},D):macSonucuUygula(k,G.macId,S.sonuc,G.tohum,{protokol:P}));
        S.uygulandi=true;
      }else OYUN.oturum.kaydet();
    }catch(e){
      if(typeof console!=='undefined')console.error('Maç sonucu işlenemedi',e);
      S.red=true;S.redAn=performance.now();S.isliyor=false;durumYaz(e.message+' (TEST). Odaya dönülürse kayıt maç gününden öncedir; maç yeniden oynanır.',true);
      if(b){b.disabled=false;b.textContent='Odaya dön (sonuç yazılmadan) ▸';b.focus({preventScroll:true});}
      return;}
    /* replace: tarayıcının Geri tuşu oynanmış maçın adresine dönmesin (F2 incelemesi) */
    if(OYUN.oturum.durum.tamam&&OYUN.depo!=='bellek'){
      /* U4: dönüş kartı — maç sonu skoru odanın ilk boyamasına taşınır (js/gecis-karti.js) */
      if(typeof gecisKartiGoster==='function'){const o={tur:'donus',ust:'Maç sonu'+(G.bulten&&G.bulten.hafta?' · '+G.bulten.hafta+'. hafta':''),baslik:adi(0)+' '+S.sonuc.skor[0]+' – '+S.sonuc.skor[1]+' '+adi(1),alt:'Odaya dönülüyor…'};
        gecisKartiKaydet(o);gecisKartiGoster(o,true);}
      location.replace(location.pathname);return;}
    S.isliyor=false;
    durumYaz('Kaydedilemedi: '+(OYUN.depo==='bellek'?'tarayıcı deposu kullanılamıyor':OYUN.oturum.durum.hata)+'. Sayfa kapanırsa maç yeniden oynanır.',true);
    if(b){b.disabled=false;b.textContent='Yeniden dene ▸';b.focus({preventScroll:true});}
  }
  E.addEventListener('click',e=>{const b=e.target.closest('button[data-eylem="odayaDon"]');if(b&&!b.disabled)msOdayaDon();});
  /* H2-a: Odaya dön beklemesinin durum satırı: biten öbür maç sayısı */
  /* inceleme (H2-e): canlı bölge her karede yeniden yazılmaz (yalnız değişince); duraklatmada bekleme durur ve bunu söyler */
  const bekleYaz=()=>{const L=LIG_CANLI,n=L.filter(x=>x.m?x.m.phase==='fulltime':!!x.son).length,p=E.querySelector('.ms-durum');
    const t=(duraklatmaVar()?'Duraklatıldı · öbür maçlar ':'Öbür maçlar tamamlanıyor… ')+n+'/'+L.length;if(!p||p.textContent!==t)durumYaz(t);};
  var macSonuKare=function(){
    const S=MAC_SONU;
    hesapKare();   /* H2-a: perdenin örtüsü (kariyersiz adreste de) */
    if(!G.kariyer||S.acik&&!S.bekliyor)return;
    /* G1-a: bizim maç hükmense kart bülten kapanınca hemen açılır (maç oynanmaz) */
    if(S.bekliyor){
      /* G1-e, H2-a: öbür maçlar işçide ya da kartın arkasında (ligCanliHizli) bitiyor. Bekleme süresi duraklatmada sayılmaz */
      const simdi=performance.now();if(!duraklatmaVar())S.bekleGecen+=simdi-S.bekleSon;S.bekleSon=simdi;
      const canliMotor=LIG_CANLI.some(x=>x.m&&x.m.phase!=='fulltime');
      if(!ligCanliSuruyor()||(MAC_ARKA.kip!=='isci'&&!canliMotor)){S.bekliyor=0;msOdayaDon();return;}
      if(MAC_ARKA.kip==='isci'&&S.bekleGecen>S.isciBekle)arkaDus('zaman aşımı');   /* işçi bırakılır; kalanı ana iplikte bütçeyle (MAC_ARKA.dusus) */
      bekleYaz();return;}
    if(S.acik)return;
    if(!G.hukmen&&!HIZLI_BITIR.anlik&&(mac.phase!=='fulltime'||!(mac.phaseT>=A.kartSn||HIZLI_BITIR.bitti)))return;
    if(ON_EKRAN.sayfa!==null||(typeof MAC_TELEFON!=='undefined'&&MAC_TELEFON.acik))return;
    msAc();
  };
}
/* H2-a (TEST "Maçı izleme"; yayından önce kalkar): odadan ?ekran=mac&izle=0&mac=<kimlik> ile açılan maç izlenmez — şerit gizlenir, perde ilk
   kareden açılır (js/mac-sahnesi.js hizliBitirIste): santra doğal maç öncesiyle gelir, sonuç ikizi hazırsa anında (yarış), değilse ana iplikte;
   sonra kart. Sahne ve stat kurulur ama çizilmez (MAC_SECENEK stat tarifine bağlı; sahnesiz kurulum sonucu değiştirirdi). Bizim maç hükmense bir
   şey yapılmaz (kart ilk karede açılır). Bu dosya son yüklenen betiktir: btnMacaGec'in sarmalayıcısı (js/loca-giris.js) kurulmuştur */
if(MAC_GUNU.izlemesiz&&!MAC_GUNU.hata){document.getElementById('baskanDugmeleri').hidden=true;if(!MAC_GUNU.hukmen)hizliBitirIste();}
