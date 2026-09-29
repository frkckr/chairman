/* ============ Chairman — maç öncesi ekranı ("maç bülteni") ============
   Görüntü katmanı: veriyi js/lig.js ve js/kadrolar.js'ten okur, 4:3 oyun karesinin içinde tek sayfalık bir menü kurar:
   iki takımın ligdeki yeri ve formu, olası ilk 11'ler (dizilişe göre küçük sahada), eksikler (sakat, cezalı, kart sınırı),
   son 5 maç, puan durumu, aradaki son maçlar; altta hakem, hava, seyirci ve İlerle düğmesi. Rastgelelik yoktur.
   Oyuncu İlerle'ye basana kadar maç günü başlamaz (js/arayuz.js, ON_EKRAN.acik iken zamanı ilerletmez; arkada stat donuk durur).
   ?ekran=mac adres parametresi menüyü atlar. Renkler STIL.menu'den CSS değişkeni (--m-ad) olarak gelir. */
const ON_EKRAN={acik:(()=>{try{return new URLSearchParams(location.search).get('ekran')!=='mac';}catch(e){return true;}})()};
{
  const E=$('onEkran'),M=STIL.menu,B=LIG.buMac,TABLO=puanDurumu(LIG);
  for(const k in M)E.style.setProperty('--m-'+k,M[k]);
  {const h=parseInt(M.zemin.slice(1),16);E.style.setProperty('--m-ortuRenk','rgba('+(h>>16)+','+((h>>8)&255)+','+(h&255)+','+M.ortu+')');}
  const yaz=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const takimAdi=id=>{const t=LIG.takimlar.find(t=>t.id===id);return t?t.ad:id;};
  const sira=id=>TABLO.findIndex(t=>t.id===id)+1;
  const skor=m=>m.a+'-'+m.y;
  const formKutu=r=>'<b class="oe-f oe-'+r+'">'+r+'</b>';
  const avaj=n=>(n>0?'+':'')+n;
  /* iki taraf: ev sahibi (bizim kulüp) ve konuk */
  const TARAF=[B.ev,B.konuk].map((id,i)=>{const kd=KADROLAR[id],f=STIL.formalar[kd.forma];
    return{id,kd,i,renk:i?'rakip':'kulup',forma:f,kaleci:STIL.formalar[kd.kaleciForma],satir:TABLO.find(t=>t.id===id),son:LIG.sonMaclar[id]||[]};});

  /* üst şerit ve karşılaşma */
  const kart=T=>{const golcu=T.kd.oyuncular.concat(T.kd.yedekler).filter(o=>o.gol).sort((a,b)=>b.gol-a.gol)[0];
    return '<div class="oe-takim'+(T.i?' sag':'')+'" style="--t:var(--m-'+T.renk+')">'+
      '<i class="oe-arma" style="--a:'+T.forma.shirt+';--b:'+(T.forma.sash||T.forma.trim)+'"></i>'+
      '<div class="oe-kimlik"><b class="oe-ad">'+yaz(takimAdi(T.id))+'</b>'+
        '<small>'+sira(T.id)+'. sıra · '+T.satir.P+' puan · averaj '+avaj(T.satir.AV)+'</small>'+
        (golcu?'<small>En golcü: '+yaz(golcu.ad)+' ('+golcu.gol+')</small>':'')+'</div>'+
      '<span class="oe-form" title="Son 5 maç, eskiden yeniye">'+T.son.map(m=>formKutu(macSonucu(m))).join('')+'</span></div>';};
  const ust='<header class="oe-ust"><span>'+yaz(LIG.ad+' · '+LIG.grup+' · '+B.hafta+'. hafta')+'</span>'+
    '<span>'+yaz(B.gun+' '+B.saat+' · '+STAT.ad)+'</span></header>'+
    '<div class="oe-karsilasma">'+kart(TARAF[0])+'<div class="oe-vs">VS<small>iç saha</small></div>'+kart(TARAF[1])+'</div>';

  /* olası 11: dizilişin mevkileri küçük sahaya yerleşir. Hücum yukarı; w = 0 sağ taç çizgisi, 68 sol */
  const HAT={KL:90,DEF:70,OS:45,FV:19};
  const saha=T=>{const diz=DIZILISLER[T.kd.taktik.dizilis]||DIZILISLER['4-4-2'];
    const oy=T.kd.oyuncular.map((o,n)=>{const m=diz.mevkiler[n],f=m.cizgi==='KL'?T.kaleci:T.forma;
      return '<div class="oe-oy" style="left:'+(100-m.w/68*100).toFixed(1)+'%;top:'+HAT[m.cizgi]+'%" title="'+yaz(o.no+' '+o.ad+' · '+m.ad)+'">'+
        '<i style="--f:'+f.shirt+';--y:'+(f.gk?f.trim:(T.forma.sash||T.forma.trim))+'">'+o.no+'</i><span>'+yaz(o.ad)+'</span>'+
        (o.kaptan?'<em class="oe-k">K</em>':'')+(o.sari>=3?'<em class="oe-s" title="Bir sarı kartta ceza"></em>':'')+'</div>';}).join('');
    return '<div class="oe-saha"><svg viewBox="0 0 68 60" aria-hidden="true"><rect x="1" y="1" width="66" height="58"/><line x1="1" y1="30" x2="67" y2="30"/>'+
      '<circle cx="34" cy="30" r="5.5"/><rect x="14" y="1" width="40" height="10"/><rect x="25" y="1" width="18" height="3.5"/>'+
      '<rect x="14" y="49" width="40" height="10"/><rect x="25" y="55.5" width="18" height="3.5"/></svg>'+oy+'</div>';};
  const panel=(baslik,ek,ic,sinif)=>'<section class="oe-panel'+(sinif?' '+sinif:'')+'"><h2>'+baslik+(ek?'<small>'+ek+'</small>':'')+'</h2>'+ic+'</section>';
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

  /* puan durumu ve aradaki maçlar */
  const Z=LIG.bolgeler||{},ara=(r,n)=>!!r&&n>=r[0]&&n<=r[1],bolge=n=>ara(Z.cikma,n)?'cikma':ara(Z.playoff,n)?'playoff':ara(Z.dusme,n)?'dusme':'';
  const tablo='<table class="oe-tablo"><thead><tr><th>#</th><th class="oe-sol">Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>A:Y</th><th>AV</th><th>P</th></tr></thead><tbody>'+
    TABLO.map((t,i)=>{const T=TARAF.find(T=>T.id===t.id);
      return '<tr class="'+(T?'oe-'+T.renk:'')+'"><td class="oe-b-'+bolge(i+1)+'">'+(i+1)+'</td><td class="oe-sol">'+yaz(t.ad)+'</td><td>'+t.O+'</td><td>'+t.G+'</td><td>'+t.B+'</td><td>'+t.M+'</td>'+
        '<td>'+t.A+':'+t.Y+'</td><td>'+avaj(t.AV)+'</td><td><b>'+t.P+'</b></td></tr>';}).join('')+'</tbody></table>'+
    '<p class="oe-lejant"><span class="oe-b-cikma">Şampiyon çıkar</span><span class="oe-b-playoff">Play-off</span><span class="oe-b-dusme">Küme düşer</span></p>';
  const aradaki='<ul class="oe-liste oe-aradaki">'+B.aradaki.map(m=>'<li><span class="oe-soluk">'+yaz(m.sezon+' '+m.yarisma)+'</span>'+
    '<b>'+yaz(KADROLAR[m.ev].ad)+'</b><span class="oe-skor">'+m.a+'-'+m.y+'</span><b>'+yaz(KADROLAR[m.konuk].ad)+'</b></li>').join('')+'</ul>';
  const orta='<div class="oe-kol">'+panel('Puan durumu',yaz(LIG.sezon+' · '+(B.hafta-1)+' hafta'),tablo)+panel('Aradaki son maçlar','',aradaki)+'</div>';

  /* alt şerit */
  const seyirci=Math.round(SEYIRCI_SAYISI/10)*10;
  const alt='<footer class="oe-alt"><span><b>Hakem</b> '+yaz(B.hakem)+'</span><span><b>Hava</b> '+yaz(B.hava)+'</span>'+
    '<span><b>Beklenen</b> ~'+seyirci.toLocaleString('tr-TR')+' seyirci</span>'+
    '<button type="button" class="oe-ilerle" id="btnIlerle" title="Stada geç, maç gününü başlat">İlerle ▸</button></footer>';

  E.innerHTML=ust+'<div class="oe-govde">'+kolon(TARAF[0])+orta+kolon(TARAF[1])+'</div>'+alt;

  /* İlerle: menü kapanır, başkan düğmeleri görünür, maç günü baştan başlar */
  const baskanDugmeleri=$('baskanDugmeleri'),btnIlerle=$('btnIlerle');
  function ilerle(){if(!ON_EKRAN.acik)return;ON_EKRAN.acik=false;E.hidden=true;baskanDugmeleri.hidden=false;soyle('Stat doluyor, takımlar tünelde.');}
  btnIlerle.onclick=ilerle;
  if(ON_EKRAN.acik){E.hidden=false;baskanDugmeleri.hidden=true;soyle('Maç bülteni: kadroları incele, hazır olunca İlerle\'ye bas.');btnIlerle.focus({preventScroll:true});}
  else{E.hidden=true;baskanDugmeleri.hidden=false;}
}
