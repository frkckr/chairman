/* ============ Chairman — maç telefonu (yol haritası 2.8F, 2.8I) ============
   Görüntü katmanı; kural içermez, kariyeri değiştirmez. Maçta masadaki telefona (js/baskan.js BK_TEL; ön plan kamerası BASKAN.kamera ile
   isabet denetimi) tıklanınca, “Telefon” düğmesiyle ya da T tuşuyla açılır; T ile kapanır. Esc bir uygulamadan ana ekrana döner, ana ekranda kapatır (N7).
   Oda ve balkondakiyle aynı telefondur (js/ekran-telefon.js telefonCiz): ana ekran → Mesajlar (kişi listesi → konuşma) / Canlı Skor.
     Mesajlar   kariyerdeki konuşmalar okunur; karar kartı görünür ama cevap maçta verilmez (maç içi kariyer cevabı Aşama 3'te zaman
                bağlantısıyla açılır). Okumak maçta "yeni" işaretini de değiştirmez: maç sınırında kariyer değişmez. Kariyer yoksa boş durum.
     Canlı Skor o maç gününün karşılaşmaları: kendi maçın motorun anlık skoru/dakikası/durumu; tıklanınca motorun ürettiği istatistikler
                (şut, isabet, topa sahip olma, korner, faul, kart, ofsayt). Her karşılaşma tek satırdır (N2, kullanıcı kararı 2026-10-04).
                F7 (2026-10-24): haftanın öbür maçları (js/mac-sahnesi.js LIG_CANLI) kendi maçın altında canlı skor ve dakikayla; bizim santramızdan
                önce 'başlamadı'. Dokunulmazlar (istatistikleri yalnız kendi maçında).
   Telefon açıkken ortak duraklatmaya 'telefon' nedeni eklenir (js/sunum-durumu.js): maç ve çevresi durur; kapanınca yalnız bu neden kalkar,
   elle duraklatma varsa maç durmaya devam eder. Gösterilen skor ve istatistik donmuş motor anına aittir. */
const MAC_TELEFON={acik:false,T:{ekran:'ana',kisi:null,skorAc:false},onizleler:{}};
{
  const E=$('macTelefon'),K=STIL.kagit,yaz=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  for(const a in K)if(typeof K[a]==='string')E.style.setProperty('--k-'+a,K[a]);
  const btn=$('btnTelefon'),isin=new THREE.Raycaster(),T=MAC_TELEFON.T;
  const durumYazi=()=>{const ph=mac.phase;return MAC_ONCESI.includes(ph)?'başlamadı':ph==='halftime'?'devre arası':ph==='fulltime'?'maç sonu':mac.minuteLabel()+'\'';};
  /* F7: öbür maçların satırları (bizim santramızdan önce başlamamış görünürler) */
  function digerVerisi(once){
    const L=typeof LIG_CANLI!=='undefined'?LIG_CANLI:[],ad=id=>(MAC_GUNU.bulten.adlar||{})[id]||id;
    return L.map(x=>{const m=x.m;
      if(!m&&x.d.hukmen){const s=x.d.hukmen.skor;return{ev:ad(x.d.ev),dep:ad(x.d.konuk),skor:s[0]+' – '+s[1],durum:'hükmen',kisaDurum:'Hük.',canli:false};}   /* G1-a */
      /* G1-e: işçi kipinde örneklerden, bizim santramızdan beri geçen kareye göre (js/mac-arka.js) */
      const o=m?null:(once||MAC_ARKA.T0===null?null:arkaMacDurum(x.ornekler,(mac.kare||0)-MAC_ARKA.T0));
      if(!m&&!o)return{ev:ad(x.d.ev),dep:ad(x.d.konuk),skor:'–',durum:'başlamadı',kisaDurum:MAC_GUNU.bulten.saat||'',canli:false};
      const ph=m?m.phase:o.faz,dk=(m?m.minuteLabel():o.dk)+"'",sk=m?m.score:o.skor;
      const durum=once?'başlamadı':ph==='halftime'?'devre arası':ph==='fulltime'?'maç sonu':dk;
      return{ev:ad(x.d.ev),dep:ad(x.d.konuk),skor:once?'–':sk[0]+' – '+sk[1],durum,kisaDurum:once?MAC_GUNU.bulten.saat||'':ph==='halftime'?'Devre':ph==='fulltime'?'Bitti':dk,
        canli:!once&&ph!=='halftime'&&ph!=='fulltime'};});
  }
  function macVerisi(){
    const I=mac.ist,s=I.sahiplik[0]+I.sahiplik[1],y=s>0?Math.round(I.sahiplik[0]/s*100):50,ev=MAC_GUNU.kadro[0],dep=MAC_GUNU.kadro[1];
    /* N2: satırın sol sütunu kısa durumdur: başlamadıysa başlama saati, oyunda dakika, arada “Devre”, sonunda “Bitti” */
    const ph=mac.phase,once=MAC_ONCESI.includes(ph),canli=!once&&ph!=='halftime'&&ph!=='fulltime';
    const kisaDurum=once?MAC_GUNU.bulten.saat||'Bugün':ph==='halftime'?'Devre':ph==='fulltime'?'Bitti':durumYazi();
    return{saat:durumYazi(),ev:ev.tamAd||ev.ad,dep:dep.tamAd||dep.ad,evKisa:ev.kisa,depKisa:dep.kisa,skor:once?'–':mac.score[0]+' – '+mac.score[1],durum:durumYazi(),kisaDurum,canli,
      ist:[['Şut',I.sut[0],I.sut[1]],['İsabetli şut',I.isabet[0],I.isabet[1]],['Topa sahip olma',s>0?y+'%':'—',s>0?(100-y)+'%':'—'],['Korner',I.korner[0],I.korner[1]],
        ['Faul',I.faul[0],I.faul[1]],['Sarı kart',I.sari[0],I.sari[1]],['Kırmızı kart',I.kirmizi[0],I.kirmizi[1]],['Ofsayt',I.ofsayt[0],I.ofsayt[1]]],
      digerleri:digerVerisi(once)};
  }
  /* gecis: telefonda ekran değişti (kısa açılış geçişi yalnız o çizimde; N7). Maçın durumu telefonun durum çubuğunda ve ana ekranındadır */
  function ciz(odak,gecis){
    const k=typeof OYUN!=='undefined'?OYUN.kariyer:null;
    E.innerHTML='<div class="mt-cihaz"><header class="mt-ust"><b>Telefon</b><button type="button" data-mt="kapat" title="Kapat (Esc)">Kapat ×</button></header>'+
      telefonCiz(k,T,{macta:true,mac:macVerisi(),acilis:!!gecis,onizleler:MAC_TELEFON.onizleler,kapali:'Maç sürerken cevap verilmez; maçtan sonra odadan cevaplayabilirsin.'})+'</div>';
    const f=odak&&E.querySelector(odak);if(f)f.focus({preventScroll:true});
  }
  function ac(){if(MAC_TELEFON.acik||ON_EKRAN.sayfa!==null)return;MAC_TELEFON.acik=true;duraklatmaEkle('telefon');E.hidden=false;btn.setAttribute('aria-pressed','true');ciz('[data-mt="kapat"]');}
  function kapat(){if(!MAC_TELEFON.acik)return;MAC_TELEFON.acik=false;E.hidden=true;btn.setAttribute('aria-pressed','false');duraklatmaKaldir('telefon');}
  MAC_TELEFON.ac=ac;MAC_TELEFON.kapat=kapat;
  btn.onclick=()=>MAC_TELEFON.acik?kapat():ac();
  /* gezinti yalnız görünüm durumunu değiştirir; cevap, girişim ve dosya bağlantıları maçta çizilmez. H1 (tek kart): kart kilitlidir (kapali →
     aria-disabled, nedeni yüzde); sürüklenmez, uygulanmaz. Kenar etiketi yalnız okumak için o cevabın yüzünü açar (aynı kenar kapatır) */
  E.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.mt==='kapat'){kapat();return;}
    const ey=b.dataset.eylem;
    if(ey==='kartOnizle'){const c=b.closest('.kk-kart');if(!c)return;const O=MAC_TELEFON.onizleler,id=c.dataset.is,y=b.dataset.yon;
      const yer=['.tel-govde','.tel-cevap'].map(s=>{const x=E.querySelector(s);return x?x.scrollTop:0;});
      if(O[id]===y)delete O[id];else O[id]=y;ciz('.kk-kart[data-is="'+id+'"]');
      ['.tel-govde','.tel-cevap'].forEach((s,i)=>{const x=E.querySelector(s);if(x)x.scrollTop=yer[i];});}
    else if(ey==='telUyg'){T.ekran=b.dataset.uyg;T.skorAc=false;ciz('.tel-geri',true);}
    else if(ey==='telEv'){T.ekran='ana';T.kisi=null;ciz('.tel-uygMesaj',true);}
    else if(ey==='telKisi'){T.ekran='konusma';T.kisi=b.dataset.kisi;ciz('.tel-geri',true);const g=E.querySelector('.tel-govde');if(g)g.scrollTop=g.scrollHeight;}
    else if(ey==='skorAc'){T.skorAc=!T.skorAc;ciz('[data-eylem="skorAc"]');}
  });
  /* masadaki telefon: ön plan kamerasıyla isabet; üzerindeyken el imleci */
  const telefonUstunde=e=>{
    if(ON_EKRAN.sayfa!==null)return false;
    const r=canvas.getBoundingClientRect();isin.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-((e.clientY-r.top)/r.height*2-1)},BASKAN.kamera);
    return isin.intersectObject(BK_TEL,true).length>0;};
  /* işaretçi olayları oyun tuvalinde (#view; ekran üstü maske tuvali dürbünle birlikte 2026-10-07'de kalktı) */
  canvas.addEventListener('click',e=>{if(telefonUstunde(e))ac();});
  canvas.addEventListener('pointermove',e=>{const u=telefonUstunde(e);canvas.style.cursor=u?'pointer':'';canvas.title=u?'Telefon (T)':'';});
  addEventListener('keydown',e=>{
    if(ON_EKRAN.sayfa!==null||e.ctrlKey||e.altKey||e.metaKey)return;const t=e.target&&e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;
    if(e.code==='KeyT'){e.preventDefault();MAC_TELEFON.acik?kapat():ac();}
    /* Esc: bir uygulama açıksa önce ana ekrana döner, ana ekrandaysa telefonu kapatır (N7) */
    else if(e.code==='Escape'&&MAC_TELEFON.acik){e.preventDefault();if(T.ekran!=='ana'){T.ekran='ana';T.kisi=null;ciz('.tel-uygMesaj',true);}else kapat();}});
  /* açıkken skor/dakika satırı motorun donmuş anını gösterir; elle duraklatma kalkıp telefon tek neden kalınca da değişmez */
  duraklatmaDinle(()=>{if(MAC_TELEFON.acik)ciz();});
}
