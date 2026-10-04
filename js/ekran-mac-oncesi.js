/* ============ Chairman — maç öncesi ekranı (yol haritası 2.8E, 2.8J, 2.8N, 2.8S) ============
   Görüntü katmanı: veriyi js/lig.js ve js/kadrolar.js'ten okur. Açık kâğıt tonlarında tek ekrandır (2.8J); 2.8S'den beri (kullanıcı kararı
   2026-10-03 ikinci paket) iki sayfası vardır ve STIL.program.sayfaSn (5 sn) etkin sürede bir kendiliğinden döner:
     Üst satır  lig · hafta · gün ve saat · stat; sağda sayfa göstergesi (tıklanınca o sayfa açılır, hazırlık sayacı sıfırlanmaz).
     Sayfa 1    Kadrolar: iki büyük arma ve takım adı (sıra ve puan); her takımın ilk 11'i küçük sahada dizilişe göre forma renkli numaralar ve
                adlar (kaptan işaretli), teknik direktörün adı (diziliş hocanındır), altında sakatlar ve cezalılar (neden, dönüş). 2.8N'deki
                "eksikler gösterilmez" kararının yerini alır.
     Sayfa 2    Lig: puan durumu (bölge renkleri, iki takımın satırı vurgulu) ve iki takımın son 5 maçı (hafta, iç/dış, rakip, skor, G/B/M).
                Veri yoksa satır uydurulmaz.
     Alt        dolan "Maç öncesi hazırlık" çubuğu ve Maça geç.
   Hakem ve bağlam cümlesi 2.8N'de kaldırıldı. Sayfa dönüşü hazırlık sayacından hesaplanır: duraklatmada durur, gizli sekmeden dönüşte sıçramaz.
   Hazırlık: dolan "Maç öncesi hazırlık" çubuğu en az STIL.program.hazirlikSn (TEST: 10) sn ETKİN süreyi gösterir; sayaç kendi kare döngüsüyle sayar,
   duraklatmada durur, gizli sekmeden dönüşte sıçramaz. Ayrıca kaynaklar hazır olmalıdır: yazı tipleri yüklenmiş ve stat en az bir kez çizilmiş
   (js/arayuz.js ON_EKRAN.cizildi). Çubuk dosya yükleme yüzdesi değildir. İkisi sağlanınca "Maça geç" etkinleşir; geçiş yalnız oyuncunun eylemiyle olur.
   Ekran açıkken maç günü, tören ve takvim ilerlemez (js/arayuz.js, ON_EKRAN.acik iken zaman ilerlemez; arkada stat donuk durur).
   Açılış sayfası (ON_EKRAN.sayfa): 'oda' varsayılan (js/ekran-oda.js; maç saati gelince bu ekranı açar), ?ekran=ajanda eski koyu ajanda
   (js/ekran-ajanda.js; geliştirici görünümü), ?ekran=bulten doğrudan bu ekran, ?ekran=mac menüleri atlar (null).
   Renkler STIL.program.renk'ten CSS değişkeni (--m-ad) olarak gelir. */
const ON_EKRAN=(()=>{let e=null;try{e=new URLSearchParams(location.search).get('ekran');}catch(x){}
  const sayfa=e==='mac'?null:e==='bulten'?'bulten':e==='ajanda'?'ajanda':'oda';return{acik:sayfa!==null,sayfa,cizildi:false};})();
{
  const E=$('onEkran'),M=STIL.program.renk,B=LIG.buMac,TABLO=puanDurumu(LIG);
  for(const k in M)E.style.setProperty('--m-'+k,M[k]);
  const yaz=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const takimAdi=id=>{const t=LIG.takimlar.find(t=>t.id===id);return t?t.ad:id;};
  const sira=id=>TABLO.findIndex(t=>t.id===id)+1;
  const formKutu=r=>'<b class="oe-f oe-'+r+'">'+r+'</b>';
  /* iki taraf: ev sahibi (bizim kulüp) ve konuk */
  const TARAF=[B.ev,B.konuk].map((id,i)=>{const kd=KADROLAR[id],f=STIL.formalar[kd.forma];
    return{id,kd,i,forma:f,kaleci:STIL.formalar[kd.kaleciForma],satir:TABLO.find(t=>t.id===id),son:LIG.sonMaclar[id]||[]};});
  const arma=T=>'<i class="oe-arma" style="--a:'+T.forma.shirt+';--b:'+(T.forma.sash||T.forma.trim)+'"></i>';

  /* ---- ilk 11: hocanın dizilişi küçük sahada; takım yukarı hücum eder ---- */
  const HAT={KL:88,DEF:68,OS:44,FV:20};
  const ilk11=T=>{const diz=DIZILISLER[T.kd.taktik.dizilis]||DIZILISLER['4-4-2'];
    const oy=T.kd.oyuncular.map((o,n)=>{const m=diz.mevkiler[n],f=m.cizgi==='KL'?T.kaleci:T.forma;
      return'<div class="oe-oy" style="left:'+(100-m.w/68*100).toFixed(1)+'%;top:'+(HAT[m.cizgi]-(m.ileri||0)*1.6).toFixed(1)+'%" title="'+yaz(o.no+' '+o.ad+' · '+m.ad)+'">'+
        '<i style="--f:'+f.shirt+';--y:'+(f.gk?f.trim:(T.forma.sash||T.forma.trim))+'">'+o.no+'</i><span>'+yaz(o.ad)+'</span>'+(o.kaptan?'<em class="oe-k" title="Kaptan">K</em>':'')+'</div>';}).join('');
    return'<div class="oe-saha prg-saha"><svg viewBox="0 0 68 60" aria-hidden="true"><rect x="1" y="1" width="66" height="58"/><line x1="1" y1="30" x2="67" y2="30"/>'+
      '<circle cx="34" cy="30" r="5.5"/><rect x="14" y="1" width="40" height="10"/><rect x="25" y="1" width="18" height="3.5"/>'+
      '<rect x="14" y="49" width="40" height="10"/><rect x="25" y="55.5" width="18" height="3.5"/></svg>'+oy+'</div>';};
  /* son 5 maç: yeniden eskiye; veri yoksa uydurulmaz */
  const sonMaclar=T=>T.son.length?'<ul class="oe-liste oe-son">'+T.son.slice().reverse().map(m=>'<li><span class="oe-soluk">'+m.hafta+'. hf</span><span class="oe-soluk">'+(m.yer==='i'?'İç':'Dış')+'</span>'+
    '<b>'+yaz(takimAdi(m.rakip))+'</b><span class="prg-skor">'+m.a+'–'+m.y+'</span>'+formKutu(macSonucu(m))+'</li>').join('')+'</ul>':'<p class="prg-yok">—</p>';
  /* sakatlar ve cezalılar (2.8S): kadronun eksikler kaydından; yoksa "Eksik yok" */
  const eksikler=T=>{const L=T.kd.eksikler||[];
    return'<ul class="oe-liste oe-eksik prg-eksik">'+(L.length?L.map(o=>'<li><i class="oe-'+o.durum+'" title="'+(o.durum==='sakat'?'Sakat':'Cezalı')+'"></i><span>'+o.no+'</span>'+
      '<b>'+yaz(o.ad)+' <small>'+yaz(o.mevki)+'</small></b><span class="oe-soluk">'+yaz(o.neden)+'</span><span>'+yaz(o.donus)+'</span></li>').join(''):'<li class="oe-bos">Eksik yok</li>')+'</ul>';};
  const taraf=T=>'<section class="prg-taraf" aria-label="'+yaz(takimAdi(T.id))+'">'+
    '<header class="prg-takim">'+arma(T)+'<div><b class="oe-ad">'+yaz(takimAdi(T.id))+'</b><small>'+sira(T.id)+'. sıra · '+T.satir.P+' puan</small></div></header>'+
    '<h3>İlk 11 <small>'+yaz(T.kd.taktik.dizilis)+'</small></h3>'+ilk11(T)+'<p class="prg-td">Teknik direktör: <b>'+yaz(T.kd.td.ad)+'</b></p>'+
    '<h3>Sakat ve cezalı</h3>'+eksikler(T)+'</section>';
  /* puan durumu: bölgeler (şampiyon, play-off, küme düşme) sol kenarda; iki takımın satırı kendi renginde */
  const Z=LIG.bolgeler||{},ara=(r,n)=>!!r&&n>=r[0]&&n<=r[1],bolge=n=>ara(Z.cikma,n)?'cikma':ara(Z.playoff,n)?'playoff':ara(Z.dusme,n)?'dusme':'';
  const tablo='<table class="oe-tablo prg-tablo"><thead><tr><th>#</th><th class="oe-sol">Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>A:Y</th><th>AV</th><th>P</th></tr></thead><tbody>'+
    TABLO.map((t,i)=>{const T=TARAF.findIndex(x=>x.id===t.id);
      return'<tr class="'+(T===0?'oe-kulup':T===1?'oe-rakip':'')+'"><td class="oe-b-'+bolge(i+1)+'">'+(i+1)+'</td><td class="oe-sol">'+yaz(t.ad)+'</td><td>'+t.O+'</td><td>'+t.G+'</td><td>'+t.B+'</td><td>'+t.M+'</td>'+
        '<td>'+t.A+':'+t.Y+'</td><td>'+(t.AV>0?'+':'')+t.AV+'</td><td><b>'+t.P+'</b></td></tr>';}).join('')+'</tbody></table>'+
    '<p class="oe-lejant"><span class="oe-b-cikma">Şampiyon çıkar</span><span class="oe-b-playoff">Play-off</span><span class="oe-b-dusme">Küme düşer</span></p>';
  const sonTaraf=T=>'<section class="prg-taraf"><h3>'+yaz(takimAdi(T.id))+' <small>Son 5 maç</small></h3>'+sonMaclar(T)+'</section>';
  const SAYFA_ADI=['Kadrolar','Lig'];
  E.innerHTML='<div class="prg-kart">'+
    '<header class="prg-ust"><span>'+yaz(LIG.ad+' · '+B.hafta+'. hafta · '+B.gun+' '+B.saat+' · '+STAT.ad)+'</span>'+
      '<span class="prg-gosterge" role="tablist" aria-label="Sayfalar">'+SAYFA_ADI.map((a,i)=>'<button type="button" role="tab" data-sayfa="'+i+'" aria-selected="'+(i?'false':'true')+'">'+(i+1)+' · '+a+'</button>').join('')+'</span>'+
      '<b>Maç günü</b></header>'+
    '<div class="prg-yaprak">'+
      '<div class="prg-govde prg-sayfa" data-sayfa="0">'+taraf(TARAF[0])+'<div class="prg-vs"><b>'+yaz(B.saat)+'</b><span>'+yaz(B.gun)+'</span></div>'+taraf(TARAF[1])+'</div>'+
      '<div class="prg-lig prg-sayfa" data-sayfa="1" aria-hidden="true"><section class="prg-taraf"><h3>Puan durumu <small>'+yaz(LIG.sezon+' · '+(B.hafta-1)+' hafta')+'</small></h3>'+tablo+'</section>'+
        '<div class="prg-sonlar">'+sonTaraf(TARAF[0])+sonTaraf(TARAF[1])+'</div></div>'+
    '</div>'+
    '<footer class="prg-alt"><div class="prg-hazirlik"><span class="prg-etiket">Maç öncesi hazırlık</span><div class="prg-cubuk" role="progressbar" aria-label="Maç öncesi hazırlık" aria-valuemin="0" aria-valuemax="'+STIL.program.hazirlikSn+'" aria-valuenow="0"><i></i></div>'+
      '<p class="prg-durum" aria-live="polite"></p></div>'+
      /* N3 (kullanıcı kararı 2026-10-04): GEÇİCİ test düğmesi; 10 sn hazırlığı beklemeden geçer. Yayından önce test görünümüyle birlikte kaldırılır */
      '<button type="button" class="prg-atla" id="btnBeklemedenGec" title="Test aşaması: hazırlık süresini beklemeden maça geçer (yayından önce kaldırılacak)"><small>TEST</small> Beklemeden geç</button>'+
      '<button type="button" class="oe-ilerle" id="btnIlerle" disabled title="Maç gününü başlat">Maça geç ▸</button></footer></div>';

  /* hazırlık: en az hazirlikSn etkin süre + gerçek kaynak hazırlığı; ikisi de olmadan geçiş yok */
  const baskanDugmeleri=$('baskanDugmeleri'),btnIlerle=$('btnIlerle'),btnAtla=$('btnBeklemedenGec'),durumP=E.querySelector('.prg-durum'),cubuk=E.querySelector('.prg-cubuk'),dolgu=cubuk.firstChild;
  const P={acik:false,gecen:0,son:0,yazi:'',kaydir:0,sayfa:-1,atla:false,fontlar:!(document.fonts&&document.fonts.ready)};
  /* gösterilen sayfa: hazırlık sayacından (etkin süre); göstergeye tıklamak yalnız kaydırmayı değiştirir */
  const sayfalar=[...E.querySelectorAll('.prg-sayfa')],gosterge=[...E.querySelectorAll('.prg-gosterge button')];
  const sayfaNo=()=>(Math.floor(P.gecen/STIL.program.sayfaSn)+P.kaydir)%2;
  function sayfaYaz(){const n=sayfaNo();if(n===P.sayfa)return;P.sayfa=n;
    sayfalar.forEach((s,i)=>{s.classList.toggle('prg-gizli',i!==n);s.setAttribute('aria-hidden',i===n?'false':'true');});
    gosterge.forEach((b,i)=>b.setAttribute('aria-selected',i===n?'true':'false'));}
  for(const b of gosterge)b.onclick=()=>{P.kaydir=((Number(b.dataset.sayfa)-Math.floor(P.gecen/STIL.program.sayfaSn))%2+2)%2;sayfaYaz();};
  if(!P.fontlar)document.fonts.ready.then(()=>{P.fontlar=true;},()=>{P.fontlar=true;});
  const kaynakHazir=()=>P.fontlar&&ON_EKRAN.cizildi;
  const kaynakHatasi=()=>typeof renderer!=='undefined'&&!renderer?'Maç sahnesi çizilemedi: bu tarayıcıda WebGL açılamadı.':null;
  ON_EKRAN.programDurumu=()=>({gecen:P.gecen,kaynak:kaynakHazir(),hazir:!btnIlerle.disabled,sayfa:P.sayfa});
  function hazirlikYaz(){
    const hata=kaynakHatasi(),sure=P.gecen>=STIL.program.hazirlikSn,hazir=sure&&kaynakHazir()&&!hata&&!duraklatmaVar();
    const yazi=hata?hata:duraklatmaVar()?'Duraklatıldı · hazırlık bekliyor':hazir?'Takımlar hazır. Hazır olduğunda maça geç.':sure?'Saha hazırlanıyor…':'Takımlar ısınıyor…';
    if(yazi!==P.yazi){P.yazi=yazi;durumP.textContent=yazi;durumP.classList.toggle('prg-hata',!!hata);}
    /* çubuk geçen ETKİN süreyi gösterir (yükleme yüzdesi değildir) */
    const oran=Math.min(1,P.gecen/STIL.program.hazirlikSn),n=Math.floor(Math.min(P.gecen,STIL.program.hazirlikSn));
    dolgu.style.width=(oran*100).toFixed(1)+'%';if(cubuk.getAttribute('aria-valuenow')!==String(n))cubuk.setAttribute('aria-valuenow',String(n));
    if(btnIlerle.disabled===hazir)btnIlerle.disabled=!hazir;
    const atlaKapali=!!hata||duraklatmaVar();if(btnAtla.disabled!==atlaKapali)btnAtla.disabled=atlaKapali;
    sayfaYaz();
    /* “Beklemeden geç” basıldıysa: kaynaklar hazır olur olmaz geçilir */
    if(P.atla&&hazir){P.atla=false;ilerle();}
  }
  function hazirlikKare(t){
    if(!P.acik)return;
    /* kare başına en çok 1 sn: düşük kare hızında da gerçek süreye yakın sayar; gizli sekmeden dönüşte sıçramaz */
    const dt=P.son?Math.min(1,Math.max(0,(t-P.son)/1000)):0;P.son=t;
    if(!duraklatmaVar())P.gecen+=dt;
    hazirlikYaz();requestAnimationFrame(hazirlikKare);
  }
  duraklatmaDinle(()=>{if(P.acik)hazirlikYaz();});
  /* Maça geç: program kapanır, başkan düğmeleri görünür, maç günü baştan başlar */
  /* 2.8T: ardından başkan merdivenden locaya çıkar, rakip başkanla tokalaşır ve oturur (js/loca-giris.js; atlanabilir) */
  function ilerle(){if(ON_EKRAN.sayfa!=='bulten'||btnIlerle.disabled)return;P.acik=false;ON_EKRAN.acik=false;ON_EKRAN.sayfa=null;E.hidden=true;baskanDugmeleri.hidden=false;
    if(typeof locaGirisBaslat==='function')locaGirisBaslat();}
  btnIlerle.onclick=ilerle;
  /* N3: süre koşulunu tamamlanmış sayar; kaynak hazırlığı ve Duraklat yine beklenir (hazirlikYaz geçirir) */
  btnAtla.onclick=()=>{if(ON_EKRAN.sayfa!=='bulten'||btnAtla.disabled)return;P.atla=true;P.gecen=Math.max(P.gecen,STIL.program.hazirlikSn);hazirlikYaz();};
  /* programı aç: açılışta (?ekran=bulten) ya da odada/ajandada maç saati gelince. Hazırlık her açılışta baştan sayılır */
  ON_EKRAN.bulteniAc=()=>{ON_EKRAN.acik=true;ON_EKRAN.sayfa='bulten';E.hidden=false;baskanDugmeleri.hidden=true;
    ON_EKRAN.cizildi=false;P.gecen=0;P.son=0;P.yazi='';P.kaydir=0;P.sayfa=-1;P.atla=false;P.acik=true;hazirlikYaz();requestAnimationFrame(hazirlikKare);
    btnIlerle.focus({preventScroll:true});};
  if(ON_EKRAN.sayfa==='bulten')ON_EKRAN.bulteniAc();
  else{E.hidden=true;baskanDugmeleri.hidden=ON_EKRAN.acik;}
}
