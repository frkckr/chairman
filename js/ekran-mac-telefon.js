/* ============ Chairman — maç telefonu (yol haritası 2.8F, 2.8I) ============
   Görüntü katmanı; kural içermez, kariyeri değiştirmez. Maçta masadaki telefona (js/baskan.js BK_TEL; ön plan kamerası BASKAN.kamera ile
   isabet denetimi) tıklanınca, “Telefon” düğmesiyle ya da T tuşuyla açılır; T ile kapanır. Esc bir adım geri (U2, odadaki zincir; N7'nin “ana ekrana
   döner”i değişti): konuşma → Mesajlar → ana ekran, kulüp → Canlı Skor → ana ekran; ana ekranda kapatır. Üstte yalnız Kapat × (U2: “Telefon” başlığı
   kalktı); telefonun durum çubuğu maç sürüyorsa “Durdu · dk” der (telefon açıkken maç durur; ekranın “Duraklatıldı” etiketi yalnız elle duraklatmada).
   Oda ve balkondakiyle aynı telefondur (js/ekran-telefon.js telefonCiz): ana ekran → Mesajlar (kişi listesi → konuşma) / Canlı Skor.
     Mesajlar   kariyerdeki konuşmalar okunur; karar kartı görünür ama cevap maçta verilmez (maç içi kariyer cevabı Aşama 3'te zaman
                bağlantısıyla açılır). Okumak maçta "yeni" işaretini de değiştirmez: maç sınırında kariyer değişmez. Kariyer yoksa boş durum.
     Canlı Skor o maç gününün karşılaşmaları: kendi maçın motorun anlık skoru/dakikası/durumu; tıklanınca motorun ürettiği istatistikler
                (şut, isabet, topa sahip olma, korner, faul, kart, ofsayt). Her karşılaşma tek satırdır (N2, kullanıcı kararı 2026-10-04).
                F7 (2026-10-24): haftanın öbür maçları (js/mac-sahnesi.js LIG_CANLI) kendi maçın altında canlı skor ve dakikayla; bizim santramızdan
                önce 'başlamadı'. H2-b (2026-10-26, kullanıcı isteği 6): santramızdan sonra öbür maçların satırları da dokunulur. R3 (2026-10-29):
                satır maç sayfasını açar (js/ekran-canli.js; telefonun içinde, ‹ Geri ile); bugünkü haftanın sayfaları canlı kayıttan (canliKayit).
   Telefon açıkken ortak duraklatmaya 'telefon' nedeni eklenir (js/sunum-durumu.js): maç ve çevresi durur; kapanınca yalnız bu neden kalkar,
   elle duraklatma varsa maç durmaya devam eder. Gösterilen skor ve istatistik donmuş motor anına aittir.
   S-d (2026-10-27): Canlı Skor'un Puan durumu sekmesi canlı tablodur: bültenin tablosu + satırların o anki skoru (js/fikstur.js canliTablo; santradan
   önce skor yok). Kariyerde takıma dokununca kulüp ekranı (sıra ve puan canlı, son beş önceki haftalar) ve Fikstür sekmesi; kariyersiz adreste yalnız tablo. */
const MAC_TELEFON={acik:false,T:{ekran:'ana',kisi:null,skorSekme:'maclar',hafta:null,sayfalar:[]},onizleler:{}};
{
  const E=$('macTelefon'),K=STIL.kagit,yaz=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  for(const a in K)if(typeof K[a]==='string')E.style.setProperty('--k-'+a,K[a]);
  yaziBoyuUygula();   /* U0: maç telefonu da ortak ölçeği ve büyük yazıyı alır */
  const btn=$('btnTelefon'),isin=new THREE.Raycaster(),T=MAC_TELEFON.T;
  /* H2-a: sonuç ikiziyle anında bittiyse (HIZLI_BITIR.anlik) skor, durum ve sayılar ikizin sonucunun kopyasından (HIZLI_BITIR.sonuc) */
  const anlik=()=>HIZLI_BITIR.anlik&&HIZLI_BITIR.sonuc?HIZLI_BITIR.sonuc:null;
  const durumYazi=()=>{const ph=anlik()?'fulltime':mac.phase;return MAC_ONCESI.includes(ph)?'başlamadı':ph==='halftime'?'devre arası':ph==='fulltime'?'maç sonu':mac.minuteLabel()+'\'';};
  /* H2-b: bizim maçın Canlı Skor kimliği (kariyersiz sayfada 'biz') ve sayılarının tek kaynağı (tabelanın kalıbı): hükmen, anlık ikiz ya da canlı motor */
  const bizId=()=>MAC_GUNU.macId||'biz';
  const bizKayit=()=>MAC_GUNU.hukmen?hukmenSonucu(MAC_GUNU.hukmen):anlik()||mac.sonucKaydi();
  /* öbür kulübün kısa adı (tablonun başlığı): kariyerin kulüp kaydından, yoksa telefonun kısa ad eşlemesi */
  const kisaAd=(id,ad)=>{const k=typeof OYUN!=='undefined'&&OYUN.kariyer,c=k&&k.kulupler&&k.kulupler[id];return c&&c.kisa||telKisaAd(ad);};
  /* F7: öbür maçların satırları (bizim santramızdan önce başlamamış görünürler). H2-b: santramızdan sonra satır dokunulur; ayrıntı yalnız açık
     satır için — hükmende x.son, kilit adımda x.m.sonucKaydi(), işçi yolunda arkaMacAnlik(x.son, o anın örneği); anlık bittiyse ya da T0 yoksa son örnek */
  function digerVerisi(once){
    const L=typeof LIG_CANLI!=='undefined'?LIG_CANLI:[],ad=id=>(MAC_GUNU.bulten.adlar||{})[id]||id;
    return L.map(x=>{const m=x.m,id=x.d.macId,Y={macId:id,evId:x.d.ev,depId:x.d.konuk,sk:null,ev:ad(x.d.ev),dep:ad(x.d.konuk),evKisa:kisaAd(x.d.ev,ad(x.d.ev)),depKisa:kisaAd(x.d.konuk,ad(x.d.konuk))};
      if(!m&&x.d.hukmen){const s=x.d.hukmen.skor;return Object.assign(Y,{sk:s.slice(),skor:s[0]+' – '+s[1],durum:'hükmen',kisaDurum:'Hük.',canli:false,dokunur:!once});}   /* G1-a */
      /* G1-e: işçi kipinde örneklerden, bizim santramızdan beri geçen kareye göre (js/mac-arka.js) */
      const sonOrnek=x.ornekler&&x.ornekler.length?x.ornekler[x.ornekler.length-1]:null;
      const o=m||once?null:HIZLI_BITIR.anlik||MAC_ARKA.T0===null?sonOrnek:arkaMacDurum(x.ornekler,(mac.kare||0)-MAC_ARKA.T0);
      if(!m&&!o)return Object.assign(Y,{skor:'–',durum:'başlamadı',kisaDurum:MAC_GUNU.bulten.saat||'',canli:false,dokunur:false});
      const ph=m?m.phase:o.faz,dk=(m?m.minuteLabel():o.dk)+"'",sk=m?m.score:o.skor;
      const durum=once?'başlamadı':ph==='halftime'?'devre arası':ph==='fulltime'?'maç sonu':dk;
      return Object.assign(Y,{sk:once?null:sk.slice(),skor:once?'–':sk[0]+' – '+sk[1],durum,kisaDurum:once?MAC_GUNU.bulten.saat||'':ph==='halftime'?'Devre':ph==='fulltime'?'Bitti':dk,
        canli:!once&&ph!=='halftime'&&ph!=='fulltime',dokunur:!once});});
  }
  function macVerisi(){
    const A=anlik(),ev=MAC_GUNU.kadro[0],dep=MAC_GUNU.kadro[1],id=bizId();
    /* N2: satırın sol sütunu kısa durumdur: başlamadıysa başlama saati, oyunda dakika, arada “Devre”, sonunda “Bitti” */
    const ph=A?'fulltime':mac.phase,once=MAC_ONCESI.includes(ph),canli=!once&&ph!=='halftime'&&ph!=='fulltime',sk=A?A.skor:mac.score;
    const kisaDurum=once?MAC_GUNU.bulten.saat||'Bugün':ph==='halftime'?'Devre':ph==='fulltime'?'Bitti':durumYazi();
    /* H2-b: ayrıntı (goller, kartlar, sakatlıklar, 10 satırlık tablo; beklenen gol canlı, isabetli şut maç sonu kaydıyla aynı) bizimkiyle öbür maçlarda aynı görünüm */
    return{id,evId:MAC_GUNU.ev||ev.id,depId:MAC_GUNU.konuk||dep.id,sk:once?null:sk.slice(),saat:durumYazi(),ev:ev.tamAd||ev.ad,dep:dep.tamAd||dep.ad,evKisa:ev.kisa,depKisa:dep.kisa,skor:once?'–':sk[0]+' – '+sk[1],durum:durumYazi(),kisaDurum,canli,
      durumCubugu:canli?'Durdu · '+kisaDurum:kisaDurum,
      digerleri:digerVerisi(once)};
  }
  /* S-d: Canlı Skor'un lig verisi — canlı tablo (bülten + o anki skorlar); kariyerde kulüp ekranı ve fikstür (kariyer maç anındadır: bu hafta oynanmadı) */
  function ligVerisi(M){
    const B=MAC_GUNU.bulten;if(!B||!Array.isArray(B.tablo))return null;
    const k=typeof OYUN!=='undefined'?OYUN.kariyer:null,kar=!!MAC_GUNU.kariyer&&!!k&&!!k.sezon,R=[M].concat(M.digerleri||[]);
    const tablo=canliTablo(B.tablo,R.map(x=>({ev:x.evId,konuk:x.depId,skor:x.sk})));
    return{tablo,bolgeler:B.bolgeler,biz:kar?(k.kisiler[k.baskanId]||{}).kulupId:null,dokunur:kar,fikstur:kar,hafta:B.hafta,
      canli:R.some(x=>x.sk)&&!R.every(x=>x.durum==='maç sonu'||x.durum==='hükmen'),ozet:kar?id=>kulupOzeti(k,id,tablo):null,ad:id=>(B.adlar||{})[id]||id};
  }
  /* R3: Canlı Skor'un canlı maç sayfası için o anki maçın kaydı (js/canli-skor.js macSayfasi canli): bizim maç motordan (ya da anlık ikizden), öbürleri
     kilit adımda motordan, işçi yolunda arkaMacAnlik'ten. Başlamamış maçta null (sayfa kayıttan önizleme gösterir) */
  function canliKayit(id){
    const tablo=(ligVerisi(macVerisi())||{}).tablo;
    if(id===bizId()){const ph=anlik()?'fulltime':mac.phase;if(MAC_ONCESI.includes(ph))return null;
      return{s:bizKayit(),durum:ph==='fulltime'?'bitti':'canli',dk:durumYazi(),tablo,ikinciYari:ph==='halftime'||mac.half===2};}
    const x=(typeof LIG_CANLI!=='undefined'?LIG_CANLI:[]).find(y=>y.d.macId===id);if(!x||MAC_ONCESI.includes(mac.phase)&&!anlik())return null;
    if(!x.m&&x.d.hukmen)return x.son?{s:x.son,durum:'bitti',tablo}:null;
    const sonOrnek=x.ornekler&&x.ornekler.length?x.ornekler[x.ornekler.length-1]:null;
    const o=x.m?null:HIZLI_BITIR.anlik||MAC_ARKA.T0===null?sonOrnek:arkaMacDurum(x.ornekler,(mac.kare||0)-MAC_ARKA.T0);
    if(!x.m&&!o)return null;const ph=x.m?x.m.phase:o.faz;
    return{s:x.m?x.m.sonucKaydi():arkaMacAnlik(x.son,o),durum:ph==='fulltime'?'bitti':'canli',dk:(x.m?x.m.minuteLabel():o.dk)+"'",tablo,
      ikinciYari:ph==='halftime'||(x.m?x.m.half===2:o.yari===2)};
  }
  /* gecis: telefonda ekran değişti (kısa açılış geçişi yalnız o çizimde; N7). Maçın durumu telefonun durum çubuğunda ve ana ekranındadır */
  function ciz(odak,gecis){
    const k=typeof OYUN!=='undefined'?OYUN.kariyer:null;
    E.innerHTML='<div class="mt-cihaz"><header class="mt-ust"><button type="button" data-mt="kapat" title="Kapat (T)">Kapat ×</button></header>'+
      (()=>{const M=macVerisi();return telefonCiz(k,T,{macta:true,mac:M,lig:ligVerisi(M),canliKayit,acilis:!!gecis,onizleler:MAC_TELEFON.onizleler,kapali:'Maç sürerken cevap verilmez; maçtan sonra odadan cevaplayabilirsin.'});})()+'</div>';
    const f=odak&&E.querySelector(odak);if(f)f.focus({preventScroll:true});
  }
  /* R3: okuma yeri sayfa başına (odadaki telSkorYerleri'nin eşi; H2-e'nin “okuma yeri korunur”u, B44): Canlı Skor'da liste ve her sayfa kendi
     kaydırmasıyla döner, yeni açılan sayfa baştan; anahtar listenin sekmesi ve haftası ya da sayfanın türü, kimliği ve bölümü */
  const yerler=new Map();
  const sayfaAnahtari=()=>{const Y=T.sayfalar||[],P=Y[Y.length-1];return P?P.tur+'|'+P.id+'|'+(P.bolum||''):'liste|'+(T.skorSekme||'')+'|'+(T.hafta||'');};
  const gezin=b=>{
    const g=E.querySelector('.tel-govde'),once=sayfaAnahtari();if(g&&T.ekran==='skor')yerler.set(once,g.scrollTop);
    const o=telGezinti(T,b);if(o===undefined)return false;
    const ey=b.dataset.eylem;ciz(o,ey==='csAc'||ey==='csGeri');
    const g2=E.querySelector('.tel-govde');if(g2)g2.scrollTop=ey==='csAc'?0:yerler.get(sayfaAnahtari())||0;
    return true;
  };
  /* H2-a: "Maçı bitir" perdesi açıkken telefon açılmaz ("kart açıkken telefon açılmaz" kuralının eşi) */
  function ac(){if(MAC_TELEFON.acik||ON_EKRAN.sayfa!==null||HIZLI_BITIR.perde)return;MAC_TELEFON.acik=true;duraklatmaEkle('telefon');E.hidden=false;btn.setAttribute('aria-pressed','true');ciz('[data-mt="kapat"]');}
  function kapat(){if(!MAC_TELEFON.acik)return;MAC_TELEFON.acik=false;E.hidden=true;btn.setAttribute('aria-pressed','false');duraklatmaKaldir('telefon');}
  MAC_TELEFON.ac=ac;MAC_TELEFON.kapat=kapat;
  btn.onclick=()=>MAC_TELEFON.acik?kapat():ac();
  /* gezinti yalnız görünüm durumunu değiştirir; cevap, girişim ve dosya bağlantıları maçta çizilmez. H1 (tek kart): kart kilitlidir (kapali →
     aria-disabled, nedeni yüzde); uygulanmaz. R2 eki: cevaplar gizli, kenar etiketi yok; kart yalnız okumak için kaydırılır ya da ←/→ ile önizlenir
     (ortak bileşen; kilitli kart eşikte de uygulanmaz, yerine yaylanır) */
  if(typeof kartEtkilesimKur==='function')kartEtkilesimKur(E,{kilitli:()=>true,onizle:(id,y)=>{const O=MAC_TELEFON.onizleler;if(y)O[id]=y;else delete O[id];}});
  E.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.mt==='kapat'){kapat();return;}
    const ey=b.dataset.eylem;
    /* S-d: lig gezintisi (sekme, fikstür haftası, kulüp ekranı) — js/ekran-telefon.js telGezinti, odadakiyle aynı */
    if(gezin(b))return;
    if(ey==='kartOnizle'){const c=b.closest('.kk-kart');if(!c)return;const O=MAC_TELEFON.onizleler,id=c.dataset.is,y=b.dataset.yon;
      const yer=['.tel-govde','.tel-cevap'].map(s=>{const x=E.querySelector(s);return x?x.scrollTop:0;});
      if(O[id]===y)delete O[id];else O[id]=y;ciz('.kk-kart[data-is="'+id+'"]');
      ['.tel-govde','.tel-cevap'].forEach((s,i)=>{const x=E.querySelector(s);if(x)x.scrollTop=yer[i];});
      /* yeniden kurulan kartın yüzü kalıcı canlı bölgeden duyurulur (js/ekran-kart.js kartDuyur; inceleme 2026-10-26) */
      const yeni=E.querySelector('.kk-kart[data-is="'+id+'"]');if(yeni&&typeof kartDuyur==='function')kartDuyur(yeni);}
    else if(ey==='telUyg'){T.ekran=b.dataset.uyg;T.skorSekme='maclar';T.hafta=null;T.sayfalar=[];ciz('.tel-geri',true);}
    else if(ey==='telEv'){T.ekran='ana';T.kisi=null;T.skorSekme='maclar';T.hafta=null;T.sayfalar=[];ciz('.tel-uygMesaj',true);}
    else if(ey==='telKisi'){T.ekran='konusma';T.kisi=b.dataset.kisi;ciz('.tel-geri',true);const g=E.querySelector('.tel-govde');if(g)g.scrollTop=g.scrollHeight;}
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
    /* Esc bir adım geri (U2; telefondaki ‹ Geri ile aynı yer): konuşma → Mesajlar (o kişinin satırı odakta), Canlı Skor'un sayfası → bir önceki (R3),
       öbür uygulama → ana ekran; ana ekrandaysa telefonu kapatır */
    else if(e.code==='Escape'&&MAC_TELEFON.acik){e.preventDefault();if(T.ekran==='skor'&&(T.sayfalar||[]).length){gezin({dataset:{eylem:'csGeri'}});}
      else if(T.ekran==='konusma'){const kisi=T.kisi;T.ekran='mesajlar';T.kisi=null;ciz(null,true);
        const f=[...E.querySelectorAll('[data-eylem="telKisi"]')].find(b=>b.dataset.kisi===kisi);if(f)f.focus({preventScroll:true});}
      else if(T.ekran!=='ana'){T.ekran='ana';T.kisi=null;T.skorSekme='maclar';T.hafta=null;T.sayfalar=[];ciz('.tel-uygMesaj',true);}else kapat();}});
  /* açıkken skor/dakika satırı motorun donmuş anını gösterir; elle duraklatma kalkıp telefon tek neden kalınca da değişmez */
  duraklatmaDinle(()=>{if(MAC_TELEFON.acik)ciz();});
}
