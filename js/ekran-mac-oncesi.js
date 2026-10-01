/* ============ Chairman — maç programı (maç öncesi ekranı; yol haritası 2.8E) ============
   Görüntü katmanı: veriyi js/lig.js, js/kadrolar.js ve stat tarifinden (STAT) okur. Kulübün basılı maç programı gibi açık kâğıt tonlarında,
   sayfalı bir kitapçıktır; sayfalar kendiliğinden dönmez:
     Kapak     iki kulüp, karşılaşma, tarih/saat/yer, bir satır bağlam, kodla çizilmiş küçük stat planı, hakem/hava/seyirci.
     Kadrolar  hocanın olası 11'leri (dizilişe göre küçük sahada), eksikler ve son 5 maç. Başkan kadro seçmez.
     Lig       puan durumu ve aradaki son maçlar.
   Hazırlık: "Maç hazırlanıyor…" en az STIL.program.hazirlikSn (TEST: 10) sn ETKİN sunum süresi görünür; sayaç kendi kare döngüsüyle sayar,
   duraklatmada durur, sayfa değişimi onu sıfırlamaz. Ayrıca kaynaklar hazır olmalıdır: yazı tipleri yüklenmiş ve stat en az bir kez çizilmiş
   (js/arayuz.js ON_EKRAN.cizildi). İkisi sağlanınca "Maça geç" etkinleşir; geçiş yalnız oyuncunun eylemiyle olur. Sahte yüzde yoktur.
   Program açıkken maç günü, tören ve takvim ilerlemez (js/arayuz.js, ON_EKRAN.acik iken zaman ilerlemez; arkada stat donuk durur).
   Açılış sayfası (ON_EKRAN.sayfa): 'oda' varsayılan (js/ekran-oda.js; maç saati gelince programı açar), ?ekran=ajanda eski koyu ajanda
   (js/ekran-ajanda.js; geliştirici görünümü), ?ekran=bulten doğrudan program, ?ekran=mac menüleri atlar (null).
   Renkler STIL.program.renk'ten CSS değişkeni (--m-ad) olarak gelir. */
const ON_EKRAN=(()=>{let e=null;try{e=new URLSearchParams(location.search).get('ekran');}catch(x){}
  const sayfa=e==='mac'?null:e==='bulten'?'bulten':e==='ajanda'?'ajanda':'oda';return{acik:sayfa!==null,sayfa,cizildi:false};})();
{
  const E=$('onEkran'),M=STIL.program.renk,B=LIG.buMac,TABLO=puanDurumu(LIG);
  for(const k in M)E.style.setProperty('--m-'+k,M[k]);
  const yaz=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const takimAdi=id=>{const t=LIG.takimlar.find(t=>t.id===id);return t?t.ad:id;};
  const sira=id=>TABLO.findIndex(t=>t.id===id)+1;
  const skor=m=>m.a+'-'+m.y;
  const formKutu=r=>'<b class="oe-f oe-'+r+'">'+r+'</b>';
  const avaj=n=>(n>0?'+':'')+n;
  /* iki taraf: ev sahibi (bizim kulüp) ve konuk */
  const TARAF=[B.ev,B.konuk].map((id,i)=>{const kd=KADROLAR[id],f=STIL.formalar[kd.forma];
    return{id,kd,i,renk:i?'rakip':'kulup',forma:f,kaleci:STIL.formalar[kd.kaleciForma],satir:TABLO.find(t=>t.id===id),son:LIG.sonMaclar[id]||[]};});
  const arma=T=>'<i class="oe-arma" style="--a:'+T.forma.shirt+';--b:'+(T.forma.sash||T.forma.trim)+'"></i>';
  const panel=(baslik,ek,ic,sinif)=>'<section class="oe-panel'+(sinif?' '+sinif:'')+'"><h2>'+baslik+(ek?'<small>'+ek+'</small>':'')+'</h2>'+ic+'</section>';

  /* ---- kapak ---- */
  /* stat planı: tarifin tribünlerinden kuşbakışı; ana tribün (başkanın yeri) altta. Ölçüler metre, saha 105×68 */
  function statPlani(){
    const W=170,H=124,cx=W/2,cy=H/2,S=0.82,PL=105*S/2,PW=68*S/2,REN={oturma:'var(--m-tribun)',ayakta:'var(--m-beton)',set:'var(--m-set)'};
    let g='<rect x="'+(cx-PL-5)+'" y="'+(cy-PW-5)+'" width="'+(2*PL+10)+'" height="'+(2*PW+10)+'" fill="var(--m-pist)"/>'+
      '<rect x="'+(cx-PL)+'" y="'+(cy-PW)+'" width="'+2*PL+'" height="'+2*PW+'" fill="var(--m-cim)" stroke="var(--m-sahaCizgi)" stroke-width=".6"/>'+
      '<line x1="'+cx+'" y1="'+(cy-PW)+'" x2="'+cx+'" y2="'+(cy+PW)+'" stroke="var(--m-sahaCizgi)" stroke-width=".6"/><circle cx="'+cx+'" cy="'+cy+'" r="7.5" fill="none" stroke="var(--m-sahaCizgi)" stroke-width=".6"/>';
    for(const t of STAT.tribunler){
      const d=Math.max(3,t.sira*0.9),u=t.uzunluk*S,yatay=t.yer==='ana'||t.yer==='karsi';
      const x=yatay?cx-u/2:t.yer==='kale1'?cx-PL-7-d:cx+PL+7,y=yatay?(t.yer==='ana'?cy+PW+7:cy-PW-7-d):cy-u/2;
      g+='<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+(yatay?u:d).toFixed(1)+'" height="'+(yatay?d:u).toFixed(1)+'" fill="'+REN[t.tip]+'"/>';
      if(t.cati)g+='<rect x="'+x.toFixed(1)+'" y="'+(t.yer==='ana'?y+d*(1-t.cati):y).toFixed(1)+'" width="'+(yatay?u:d*t.cati).toFixed(1)+'" height="'+(yatay?d*t.cati:u).toFixed(1)+'" fill="var(--m-cati)" opacity=".75"/>';
    }
    const ana=STAT.tribunler.find(t=>t.yer==='ana');
    if(ana)g+='<rect x="'+(cx-3)+'" y="'+(cy+PW+7+Math.max(3,ana.sira*0.9)*0.45).toFixed(1)+'" width="6" height="2.4" fill="var(--m-kulup)"><title>Başkanın yeri</title></rect>';
    for(const [px,pz] of STAT.projektor.konumlar)g+='<circle cx="'+(cx+px*S*0.98).toFixed(1)+'" cy="'+(cy-pz*S*0.98).toFixed(1)+'" r="1.8" fill="var(--m-yazi)"/>';
    return'<svg class="prg-stat" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+yaz(STAT.ad+' planı')+'">'+g+'</svg>';
  }
  const seyirci=Math.round(SEYIRCI_SAYISI/10)*10;
  const takimKapak=T=>'<div class="prg-takim">'+arma(T)+'<b class="oe-ad">'+yaz(takimAdi(T.id))+'</b><small>'+sira(T.id)+'. sıra · '+T.satir.P+' puan</small>'+
    '<span class="oe-form" title="Son 5 maç, eskiden yeniye">'+T.son.map(m=>formKutu(macSonucu(m))).join('')+'</span></div>';
  const golcu=T=>T.kd.oyuncular.concat(T.kd.yedekler).filter(o=>o.gol).sort((a,b)=>b.gol-a.gol)[0];
  const baglam=(()=>{const [a,b]=TARAF,fark=a.satir.P-b.satir.P,g=golcu(a);
    return yaz(takimAdi(a.id))+' '+sira(a.id)+'. sırada, '+yaz(takimAdi(b.id))+' '+sira(b.id)+'. sırada'+(fark?'; aradaki fark '+Math.abs(fark)+' puan':'; puanlar eşit')+'.'+
      (g?' Takımın en golcüsü '+yaz(g.ad)+' ('+g.gol+' gol).':'');})();
  const kapak='<div class="prg-kapak">'+
    '<div class="prg-karsilasma">'+takimKapak(TARAF[0])+'<div class="prg-vs"><b>'+yaz(B.saat)+'</b><span>'+yaz(B.gun)+'</span><small>'+B.hafta+'. hafta</small></div>'+takimKapak(TARAF[1])+'</div>'+
    '<p class="prg-baglam">'+baglam+'</p>'+
    '<div class="prg-yer">'+statPlani()+'<dl class="prg-bilgi"><dt>Yer</dt><dd>'+yaz(STAT.ad)+'</dd><dt>Hakem</dt><dd>'+yaz(B.hakem)+'</dd><dt>Hava</dt><dd>'+yaz(B.hava)+'</dd>'+
      '<dt>Beklenen</dt><dd>~'+seyirci.toLocaleString('tr-TR')+' seyirci</dd><dt>Kapasite</dt><dd>'+STAT_KAPASITE.toLocaleString('tr-TR')+'</dd></dl></div></div>';

  /* ---- kadrolar: hocanın olası 11'i, eksikler, son 5 maç ---- */
  const HAT={KL:90,DEF:70,OS:45,FV:19};
  const saha=T=>{const diz=DIZILISLER[T.kd.taktik.dizilis]||DIZILISLER['4-4-2'];
    const oy=T.kd.oyuncular.map((o,n)=>{const m=diz.mevkiler[n],f=m.cizgi==='KL'?T.kaleci:T.forma;
      return '<div class="oe-oy" style="left:'+(100-m.w/68*100).toFixed(1)+'%;top:'+HAT[m.cizgi]+'%" title="'+yaz(o.no+' '+o.ad+' · '+m.ad)+'">'+
        '<i style="--f:'+f.shirt+';--y:'+(f.gk?f.trim:(T.forma.sash||T.forma.trim))+'">'+o.no+'</i><span>'+yaz(o.ad)+'</span>'+
        (o.kaptan?'<em class="oe-k">K</em>':'')+(o.sari>=3?'<em class="oe-s" title="Bir sarı kartta ceza"></em>':'')+'</div>';}).join('');
    return '<div class="oe-saha"><svg viewBox="0 0 68 60" aria-hidden="true"><rect x="1" y="1" width="66" height="58"/><line x1="1" y1="30" x2="67" y2="30"/>'+
      '<circle cx="34" cy="30" r="5.5"/><rect x="14" y="1" width="40" height="10"/><rect x="25" y="1" width="18" height="3.5"/>'+
      '<rect x="14" y="49" width="40" height="10"/><rect x="25" y="55.5" width="18" height="3.5"/></svg>'+oy+'</div>';};
  const eksikler=T=>{const L=T.kd.eksikler||[],sinir=T.kd.oyuncular.filter(o=>o.sari>=3);
    let s=L.map(o=>'<li><i class="oe-'+o.durum+'" title="'+(o.durum==='sakat'?'Sakat':'Cezalı')+'"></i><span>'+o.no+'</span><b>'+yaz(o.ad)+' <small>'+o.mevki+'</small></b>'+
      '<span class="oe-soluk">'+yaz(o.neden)+'</span><span>'+yaz(o.donus)+'</span></li>').join('');
    if(!L.length)s='<li class="oe-bos">Eksik yok</li>';
    if(sinir.length)s+='<li class="oe-sinir"><i class="oe-sari"></i><b>Bir sarıda ceza:</b><span>'+sinir.map(o=>yaz(o.ad)+' ('+o.no+')').join(', ')+'</span></li>';
    return '<ul class="oe-liste oe-eksik">'+s+'</ul>';};
  const sonMaclar=T=>'<ul class="oe-liste oe-son">'+T.son.slice().reverse().map(m=>'<li><span class="oe-soluk">'+m.hafta+'.H</span><span>'+(m.yer==='i'?'İ':'D')+'</span>'+
    '<b>'+yaz(takimAdi(m.rakip))+'</b><span>'+skor(m)+'</span>'+formKutu(macSonucu(m))+'</li>').join('')+'</ul>';
  const kolon=T=>'<div class="oe-kol">'+
    panel('Olası 11',yaz(T.kd.kisa+' · '+T.kd.taktik.dizilis),saha(T),'oe-p-saha')+
    panel('Eksikler','',eksikler(T))+
    panel('Son 5 maç','',sonMaclar(T))+'</div>';
  const kadrolar='<div class="prg-iki">'+kolon(TARAF[0])+kolon(TARAF[1])+'</div>'+
    '<p class="prg-not">Kadroyu ve dizilişi teknik direktörler belirler; bu sayfa beklenen 11\'leri gösterir.</p>';

  /* ---- lig: puan durumu ve aradaki maçlar ---- */
  const Z=LIG.bolgeler||{},ara=(r,n)=>!!r&&n>=r[0]&&n<=r[1],bolge=n=>ara(Z.cikma,n)?'cikma':ara(Z.playoff,n)?'playoff':ara(Z.dusme,n)?'dusme':'';
  const tablo='<table class="oe-tablo"><thead><tr><th>#</th><th class="oe-sol">Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>A:Y</th><th>AV</th><th>P</th></tr></thead><tbody>'+
    TABLO.map((t,i)=>{const T=TARAF.find(T=>T.id===t.id);
      return '<tr class="'+(T?'oe-'+T.renk:'')+'"><td class="oe-b-'+bolge(i+1)+'">'+(i+1)+'</td><td class="oe-sol">'+yaz(t.ad)+'</td><td>'+t.O+'</td><td>'+t.G+'</td><td>'+t.B+'</td><td>'+t.M+'</td>'+
        '<td>'+t.A+':'+t.Y+'</td><td>'+avaj(t.AV)+'</td><td><b>'+t.P+'</b></td></tr>';}).join('')+'</tbody></table>'+
    '<p class="oe-lejant"><span class="oe-b-cikma">Şampiyon çıkar</span><span class="oe-b-playoff">Play-off</span><span class="oe-b-dusme">Küme düşer</span></p>';
  const aradaki='<ul class="oe-liste oe-aradaki">'+B.aradaki.map(m=>'<li><span class="oe-soluk">'+yaz(m.sezon+' '+m.yarisma)+'</span>'+
    '<b>'+yaz(KADROLAR[m.ev].ad)+'</b><span class="oe-skor">'+m.a+'-'+m.y+'</span><b>'+yaz(KADROLAR[m.konuk].ad)+'</b></li>').join('')+'</ul>';
  const lig='<div class="prg-lig">'+panel('Puan durumu',yaz(LIG.sezon+' · '+(B.hafta-1)+' hafta'),tablo)+panel('Aradaki son maçlar','',aradaki)+'</div>';

  const SAYFALAR=[['kapak','Kapak',kapak],['kadrolar','Kadrolar',kadrolar],['lig','Lig',lig]];
  E.innerHTML='<div class="prg-kart">'+
    '<header class="prg-ust"><span>'+yaz(LIG.ad+' · '+LIG.grup+' · '+B.hafta+'. hafta · '+LIG.sezon)+'</span><b>Maç programı</b></header>'+
    '<nav class="prg-sayfalar" role="tablist" aria-label="Program sayfaları">'+SAYFALAR.map(([a,ad],i)=>'<button type="button" role="tab" data-sayfa="'+a+'" aria-selected="'+(i?'false':'true')+'" aria-pressed="'+(i?'false':'true')+'">'+ad+'</button>').join('')+'</nav>'+
    SAYFALAR.map(([a,,ic],i)=>'<div class="prg-govde" data-sayfa="'+a+'" role="tabpanel"'+(i?' hidden':'')+'>'+ic+'</div>').join('')+
    '<footer class="prg-alt"><p class="prg-hazirlik" aria-live="polite"></p><button type="button" class="oe-ilerle" id="btnIlerle" disabled title="Maç gününü başlat">Maça geç ▸</button></footer></div>';

  /* sayfalar: yalnız oyuncu değiştirir; hazırlık sayacını etkilemez */
  const sayfaGoster=a=>{for(const b of E.querySelectorAll('.prg-sayfalar button')){const s=b.dataset.sayfa===a;b.setAttribute('aria-selected',s?'true':'false');b.setAttribute('aria-pressed',s?'true':'false');}
    for(const g of E.querySelectorAll('.prg-govde'))g.hidden=g.dataset.sayfa!==a;};
  E.querySelector('.prg-sayfalar').addEventListener('click',e=>{const b=e.target.closest('button[data-sayfa]');if(b)sayfaGoster(b.dataset.sayfa);});

  /* hazırlık: en az hazirlikSn etkin süre + gerçek kaynak hazırlığı; ikisi de olmadan geçiş yok */
  const baskanDugmeleri=$('baskanDugmeleri'),btnIlerle=$('btnIlerle'),durumP=E.querySelector('.prg-hazirlik');
  const P={acik:false,gecen:0,son:0,yazi:'',fontlar:!(document.fonts&&document.fonts.ready)};
  if(!P.fontlar)document.fonts.ready.then(()=>{P.fontlar=true;},()=>{P.fontlar=true;});
  const kaynakHazir=()=>P.fontlar&&ON_EKRAN.cizildi;
  const kaynakHatasi=()=>typeof renderer!=='undefined'&&!renderer?'Maç sahnesi çizilemedi: bu tarayıcıda WebGL açılamadı.':null;
  ON_EKRAN.programDurumu=()=>({gecen:P.gecen,kaynak:kaynakHazir(),hazir:!btnIlerle.disabled});
  function hazirlikYaz(){
    const hata=kaynakHatasi(),sure=P.gecen>=STIL.program.hazirlikSn,hazir=sure&&kaynakHazir()&&!hata&&!duraklatmaVar();
    const yazi=hata?hata:duraklatmaVar()?'Duraklatıldı · hazırlık bekliyor':hazir?'Takımlar hazır. Hazır olduğunda maça geç.':'Maç hazırlanıyor…';
    if(yazi!==P.yazi){P.yazi=yazi;durumP.textContent=yazi;durumP.classList.toggle('prg-hata',!!hata);}
    if(btnIlerle.disabled===hazir)btnIlerle.disabled=!hazir;
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
  function ilerle(){if(ON_EKRAN.sayfa!=='bulten'||btnIlerle.disabled)return;P.acik=false;ON_EKRAN.acik=false;ON_EKRAN.sayfa=null;E.hidden=true;baskanDugmeleri.hidden=false;}
  btnIlerle.onclick=ilerle;
  /* programı aç: açılışta (?ekran=bulten) ya da odada/ajandada maç saati gelince. Hazırlık her açılışta baştan sayılır */
  ON_EKRAN.bulteniAc=()=>{ON_EKRAN.acik=true;ON_EKRAN.sayfa='bulten';E.hidden=false;baskanDugmeleri.hidden=true;
    sayfaGoster('kapak');ON_EKRAN.cizildi=false;P.gecen=0;P.son=0;P.yazi='';P.acik=true;hazirlikYaz();requestAnimationFrame(hazirlikKare);
    const ilk=E.querySelector('.prg-sayfalar button');if(ilk)ilk.focus({preventScroll:true});};
  if(ON_EKRAN.sayfa==='bulten')ON_EKRAN.bulteniAc();
  else{E.hidden=true;baskanDugmeleri.hidden=ON_EKRAN.acik;}
}
