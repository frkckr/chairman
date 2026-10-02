/* ============ Chairman — maç öncesi ekranı (yol haritası 2.8E, 2.8J) ============
   Görüntü katmanı: veriyi js/lig.js ve js/kadrolar.js'ten okur. Açık kâğıt tonlarında TEK kompakt ekrandır (2026-10-02 kararı; 2.8E'nin üç sayfalı
   programı ve stat çizimi kaldırıldı): iki arma ve takım adı, lig/hafta/saat, kısa sıra/puan/form karşılaştırması ve tek cümle bağlam.
   Kadro ve diziliş teknik direktörlerindir; ekran başkanın kadro seçtiği izlenimi vermez.
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
  const avaj=n=>(n>0?'+':'')+n;
  /* iki taraf: ev sahibi (bizim kulüp) ve konuk */
  const TARAF=[B.ev,B.konuk].map((id,i)=>{const kd=KADROLAR[id],f=STIL.formalar[kd.forma];
    return{id,kd,i,renk:i?'rakip':'kulup',forma:f,kaleci:STIL.formalar[kd.kaleciForma],satir:TABLO.find(t=>t.id===id),son:LIG.sonMaclar[id]||[]};});
  const arma=T=>'<i class="oe-arma" style="--a:'+T.forma.shirt+';--b:'+(T.forma.sash||T.forma.trim)+'"></i>';

  /* ---- tek ekran: karşılaşma, kısa karşılaştırma, bağlam ---- */
  const takimKutu=T=>'<div class="prg-takim">'+arma(T)+'<b class="oe-ad">'+yaz(takimAdi(T.id))+'</b>'+
    '<span class="oe-form" title="Son 5 maç, eskiden yeniye">'+T.son.map(m=>formKutu(macSonucu(m))).join('')+'</span></div>';
  const golcu=T=>T.kd.oyuncular.concat(T.kd.yedekler).filter(o=>o.gol).sort((a,b)=>b.gol-a.gol)[0];
  const baglam=(()=>{const [a,b]=TARAF,fark=a.satir.P-b.satir.P,g=golcu(a);
    return(fark?yaz(takimAdi(fark>0?a.id:b.id))+' '+Math.abs(fark)+' puan önde':'Puanlar eşit')+(g?'; takımın en golcüsü '+yaz(g.ad)+' ('+g.gol+' gol).':'.');})();
  const kars=(ad,f)=>'<tr><td>'+f(TARAF[0])+'</td><th scope="row">'+ad+'</th><td>'+f(TARAF[1])+'</td></tr>';
  const karsilastirma='<table class="prg-kars"><tbody>'+kars('Sıra',T=>sira(T.id)+'.')+kars('Puan',T=>T.satir.P)+kars('Averaj',T=>avaj(T.satir.AV))+'</tbody></table>';
  E.innerHTML='<div class="prg-kart">'+
    '<header class="prg-ust"><span>'+yaz(LIG.ad+' · '+LIG.grup+' · '+B.hafta+'. hafta · '+STAT.ad+' · Hakem '+B.hakem)+'</span><b>Maç günü</b></header>'+
    '<div class="prg-karsilasma">'+takimKutu(TARAF[0])+'<div class="prg-vs"><b>'+yaz(B.saat)+'</b><span>'+yaz(B.gun)+'</span>'+karsilastirma+'</div>'+takimKutu(TARAF[1])+'</div>'+
    '<p class="prg-baglam">'+baglam+'</p>'+
    '<footer class="prg-alt"><div class="prg-hazirlik"><span class="prg-etiket">Maç öncesi hazırlık</span><div class="prg-cubuk" role="progressbar" aria-label="Maç öncesi hazırlık" aria-valuemin="0" aria-valuemax="'+STIL.program.hazirlikSn+'" aria-valuenow="0"><i></i></div>'+
      '<p class="prg-durum" aria-live="polite"></p></div><button type="button" class="oe-ilerle" id="btnIlerle" disabled title="Maç gününü başlat">Maça geç ▸</button></footer></div>';

  /* hazırlık: en az hazirlikSn etkin süre + gerçek kaynak hazırlığı; ikisi de olmadan geçiş yok */
  const baskanDugmeleri=$('baskanDugmeleri'),btnIlerle=$('btnIlerle'),durumP=E.querySelector('.prg-durum'),cubuk=E.querySelector('.prg-cubuk'),dolgu=cubuk.firstChild;
  const P={acik:false,gecen:0,son:0,yazi:'',fontlar:!(document.fonts&&document.fonts.ready)};
  if(!P.fontlar)document.fonts.ready.then(()=>{P.fontlar=true;},()=>{P.fontlar=true;});
  const kaynakHazir=()=>P.fontlar&&ON_EKRAN.cizildi;
  const kaynakHatasi=()=>typeof renderer!=='undefined'&&!renderer?'Maç sahnesi çizilemedi: bu tarayıcıda WebGL açılamadı.':null;
  ON_EKRAN.programDurumu=()=>({gecen:P.gecen,kaynak:kaynakHazir(),hazir:!btnIlerle.disabled});
  function hazirlikYaz(){
    const hata=kaynakHatasi(),sure=P.gecen>=STIL.program.hazirlikSn,hazir=sure&&kaynakHazir()&&!hata&&!duraklatmaVar();
    const yazi=hata?hata:duraklatmaVar()?'Duraklatıldı · hazırlık bekliyor':hazir?'Takımlar hazır. Hazır olduğunda maça geç.':sure?'Saha hazırlanıyor…':'Takımlar ısınıyor…';
    if(yazi!==P.yazi){P.yazi=yazi;durumP.textContent=yazi;durumP.classList.toggle('prg-hata',!!hata);}
    /* çubuk geçen ETKİN süreyi gösterir (yükleme yüzdesi değildir) */
    const oran=Math.min(1,P.gecen/STIL.program.hazirlikSn),n=Math.floor(Math.min(P.gecen,STIL.program.hazirlikSn));
    dolgu.style.width=(oran*100).toFixed(1)+'%';if(cubuk.getAttribute('aria-valuenow')!==String(n))cubuk.setAttribute('aria-valuenow',String(n));
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
    ON_EKRAN.cizildi=false;P.gecen=0;P.son=0;P.yazi='';P.acik=true;hazirlikYaz();requestAnimationFrame(hazirlikKare);
    btnIlerle.focus({preventScroll:true});};
  if(ON_EKRAN.sayfa==='bulten')ON_EKRAN.bulteniAc();
  else{E.hidden=true;baskanDugmeleri.hidden=ON_EKRAN.acik;}
}
