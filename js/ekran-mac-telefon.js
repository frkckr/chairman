/* ============ Chairman — maç telefonu (yol haritası 2.8F) ============
   Görüntü katmanı; kural içermez, kariyeri değiştirmez. Maçta masadaki telefona (js/baskan.js BK_TEL; ön plan kamerası BASKAN.kamera ile
   isabet denetimi) tıklanınca, “Telefon” düğmesiyle ya da T tuşuyla açılır; Esc ya da T ile kapanır.
     Mesajlar   kariyerdeki konuşmalar salt okunur (her mesele bir konuşma; cevap maçtan sonra odadaki dosyadan verilir). Kariyer yoksa boş durum.
     Canlı Skor o maç gününün karşılaşmaları: kendi maçın motorun anlık skoru/dakikası/durumu; tıklanınca motorun ürettiği istatistikler
                (şut, isabet, topa sahip olma, korner, faul, kart, ofsayt). Diğer maçlar henüz simüle edilmez (3.8): açıkça yazılır.
   Telefon açıkken ortak duraklatmaya 'telefon' nedeni eklenir (js/sunum-durumu.js): maç ve çevresi durur; kapanınca yalnız bu neden kalkar,
   elle duraklatma varsa maç durmaya devam eder. Gösterilen skor ve istatistik donmuş motor anına aittir. */
const MAC_TELEFON={acik:false,uyg:'skor',mac:false};
{
  const E=$('macTelefon'),K=STIL.kagit,yaz=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  for(const a in K)if(typeof K[a]==='string')E.style.setProperty('--k-'+a,K[a]);
  const btn=$('btnTelefon'),isin=new THREE.Raycaster();
  const durumYazi=()=>{const ph=mac.phase;return MAC_ONCESI.includes(ph)?'başlamadı':ph==='halftime'?'devre arası':ph==='fulltime'?'maç sonu':mac.minuteLabel()+'\'';};
  const satir=(ad,a,b)=>'<tr><td>'+a+'</td><th>'+ad+'</th><td>'+b+'</td></tr>';
  function istatistik(){
    const I=mac.ist,s=I.sahiplik[0]+I.sahiplik[1],y=s>0?Math.round(I.sahiplik[0]/s*100):50;
    return'<table class="mt-ist"><thead><tr><th>'+yaz(MAC_KADRO[0].kisa)+'</th><th></th><th>'+yaz(MAC_KADRO[1].kisa)+'</th></tr></thead><tbody>'+
      satir('Şut',I.sut[0],I.sut[1])+satir('İsabetli şut',I.isabet[0],I.isabet[1])+satir('Topa sahip olma',(s>0?y+'%':'—'),(s>0?(100-y)+'%':'—'))+
      satir('Korner',I.korner[0],I.korner[1])+satir('Faul',I.faul[0],I.faul[1])+satir('Sarı kart',I.sari[0],I.sari[1])+satir('Kırmızı kart',I.kirmizi[0],I.kirmizi[1])+
      satir('Ofsayt',I.ofsayt[0],I.ofsayt[1])+'</tbody></table>';
  }
  function skorUyg(){
    const ev=MAC_KADRO[0],dep=MAC_KADRO[1],s=mac.score;
    let ic='<h4>Bugünün maçları</h4><ul class="mt-skorlar"><li><button type="button" data-mt="mac" aria-pressed="'+(MAC_TELEFON.mac?'true':'false')+'">'+
      '<span>'+yaz(ev.kisa)+'</span><b>'+s[0]+' – '+s[1]+'</b><span>'+yaz(dep.kisa)+'</span><small>'+yaz(durumYazi())+'</small></button></li></ul>';
    if(MAC_TELEFON.mac)ic+='<h4>'+yaz(ev.ad)+' – '+yaz(dep.ad)+' <small>'+yaz(durumYazi())+'</small></h4>'+istatistik()+
      '<p class="mt-not">Değerler maç motorunun bu anki kaydıdır; xG gibi üretilmeyen değerler yoktur.</p>';
    return ic+'<p class="mt-not">Diğer maç verileri henüz bağlı değil.</p>';
  }
  function mesajUyg(){
    const k=typeof OYUN!=='undefined'?OYUN.kariyer:null;
    const L=k&&typeof meseleListesi==='function'?meseleListesi(k):[];
    if(!L.length)return'<p class="mt-not">Maç sırasında yeni mesaj yok.</p>';
    return'<ul class="mt-mesajlar">'+L.map(m=>{const o=meseleOzeti(k,m.id),son=o.olaylar[o.olaylar.length-1],p=o.kisiler.find(x=>x.id!==k.baskanId)||o.sorumlu;
      return'<li><b>'+yaz(p?p.ad:'Kulüp')+'</b> <small>'+yaz(o.durumAdi)+'</small><p>'+yaz(son?son.metin:m.baslik)+'</p></li>';}).join('')+'</ul>'+
      '<p class="mt-not">Maçta yalnız okunur; cevap maçtan sonra odadaki dosyadan verilir.</p>';
  }
  function ciz(odak){
    E.innerHTML='<div class="mt-cihaz"><header class="mt-ust"><span>'+yaz(durumYazi())+'</span><b>Telefon</b><button type="button" data-mt="kapat" title="Kapat (Esc)">Kapat ×</button></header>'+
      '<nav class="mt-uyglar" role="tablist">'+[['mesajlar','Mesajlar'],['skor','Canlı Skor']].map(([a,ad])=>'<button type="button" role="tab" data-mt="uyg" data-uyg="'+a+'" aria-selected="'+(MAC_TELEFON.uyg===a?'true':'false')+'" aria-pressed="'+(MAC_TELEFON.uyg===a?'true':'false')+'">'+ad+'</button>').join('')+'</nav>'+
      '<div class="mt-icerik">'+(MAC_TELEFON.uyg==='skor'?skorUyg():mesajUyg())+'</div></div>';
    const f=odak&&E.querySelector(odak);if(f)f.focus({preventScroll:true});
  }
  function ac(){if(MAC_TELEFON.acik||ON_EKRAN.sayfa!==null)return;MAC_TELEFON.acik=true;duraklatmaEkle('telefon');E.hidden=false;btn.setAttribute('aria-pressed','true');ciz('[data-mt="kapat"]');}
  function kapat(){if(!MAC_TELEFON.acik)return;MAC_TELEFON.acik=false;E.hidden=true;btn.setAttribute('aria-pressed','false');duraklatmaKaldir('telefon');}
  MAC_TELEFON.ac=ac;MAC_TELEFON.kapat=kapat;
  btn.onclick=()=>MAC_TELEFON.acik?kapat():ac();
  E.addEventListener('click',e=>{const b=e.target.closest('button[data-mt]');if(!b)return;const t=b.dataset.mt;
    if(t==='kapat')kapat();else if(t==='uyg'){MAC_TELEFON.uyg=b.dataset.uyg;ciz('[data-mt="uyg"][data-uyg="'+MAC_TELEFON.uyg+'"]');}
    else if(t==='mac'){MAC_TELEFON.mac=!MAC_TELEFON.mac;ciz('[data-mt="mac"]');}});
  /* masadaki telefon: ön plan kamerasıyla isabet; üzerindeyken el imleci */
  const telefonUstunde=e=>{
    if(ON_EKRAN.sayfa!==null||bino)return false;
    const r=canvas.getBoundingClientRect();isin.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-((e.clientY-r.top)/r.height*2-1)},BASKAN.kamera);
    return isin.intersectObject(BK_TEL,true).length>0;};
  hud.addEventListener('click',e=>{if(telefonUstunde(e))ac();});
  hud.addEventListener('pointermove',e=>{const u=telefonUstunde(e);hud.style.cursor=u?'pointer':'';hud.title=u?'Telefon (T)':'';});
  addEventListener('keydown',e=>{
    if(ON_EKRAN.sayfa!==null||e.ctrlKey||e.altKey||e.metaKey)return;const t=e.target&&e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;
    if(e.code==='KeyT'){e.preventDefault();MAC_TELEFON.acik?kapat():ac();}
    else if(e.code==='Escape'&&MAC_TELEFON.acik){e.preventDefault();kapat();}});
  /* açıkken skor/dakika satırı motorun donmuş anını gösterir; elle duraklatma kalkıp telefon tek neden kalınca da değişmez */
  duraklatmaDinle(()=>{if(MAC_TELEFON.acik)ciz();});
}
