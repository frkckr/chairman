/* ============ Chairman — telefon ve karar kartı: oda, balkon ve maçta ortak çizim (görüntü katmanı; yol haritası 2.8I) ============
   Kural içermez: içerik js/mesajlar.js (konusmaListesi), js/ajanda.js (ajandaOnizle) ve js/mesele.js okuma işlevlerinden gelir.
   Düğmeler data-eylem taşır; ev sahibi ekran (js/ekran-oda.js, js/ekran-mac-telefon.js) tıklamayı ortak kariyer komutuna çevirir.
   kararKarti(k, isId, s)   iki büyük cevaplı kart (dosya ve konuşma aynı kartı kullanır). s: {secim, onay, gorus, kapali, dosyaBaglanti, dosyada, testSecenek}
     Cevaba basmak seçer; "Onayla" kararı verir (aynı karar telefonda ve dosyada bir kez uygulanır: ajandaIsiYap işi kapatır).
     Bilinen bedel (tutar, tarih, taahhüt, belirsizlik) seçenek açıklamasında, cevapsız kalırsa olacak olan kartın altında yazar.
     İkiden fazla seçenek yalnız eski kayıtların kararlarında görülür (js/uyum-icerik2.js); aynı kart onları sırayla dizer.
   telefonCiz(k, T, s)      T: {ekran:'ana'|'mesajlar'|'konusma'|'skor', kisi, skorAc}. s: {macta, mac, secimler, onay, kapali, kasa}
     Ana ekran: saat ve iki uygulama (Mesajlar, Canlı Skor). Mesajlar: kişi listesi → tek konuşma. Canlı Skor: günün maçları → ayrıntı.
     Maçta görünüm aynıdır; cevap verilmez (maç içi kariyer cevabı Aşama 3'te). Diğer maçların verisi 3.8'e kadar bağlı değildir. */
const yazT=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
/* bileşenin görünüşü: oda (.oda) ve maç telefonu (.macTelefon) içinde aynı. Renkler STIL.kagit'ten (--k-*), telefonunkiler STIL.kagit.telefon'dan.
   Masaüstü kopyası yalnız js/ klasörünü taşıdığı için stil burada belgeye eklenir */
(function telefonStili(){
  if(typeof document==='undefined'||document.getElementById('telefonStili'))return;
  const T=STIL.kagit.telefon,st=document.createElement('style');st.id='telefonStili';
  st.textContent=`
.kk{display:grid;gap:.5em;padding:.6em .7em;background:var(--k-serit);border:1px solid var(--k-cizgi);border-left:.3em solid var(--k-kirmizi)}
.kk p{margin:0}
.kk-konu{font-size:1.05em;line-height:1.35}
.kk-gorus{padding:.2em .5em;border-left:.2em solid var(--k-vurguZemin);font-size:.92em}
.kk-gorus b{margin-right:.3em}
.kk-cevaplar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5em}
.kk-sutun{display:grid;gap:.15em;align-content:start;min-width:0}
.kk-sutun small{color:var(--k-soluk);font-size:.86em;line-height:1.25}
.kk button.kk-cevap{display:grid;gap:.12em;min-height:3.3em;width:100%;text-align:left;padding:.45em .65em .4em;background:var(--k-zemin);border:1px solid var(--k-cizgi);border-bottom-width:.22em;border-radius:.3em;color:var(--k-yazi)}
.kk button.kk-cevap b{font-size:1.08em;line-height:1.15;font-weight:600}
.kk button.kk-cevap small{font-weight:400;color:var(--k-soluk)}
.kk button.kk-cevap[aria-pressed="true"]{background:var(--k-vurguZemin);border-color:var(--k-vurgu);color:#1a1203}
.kk button.kk-cevap[aria-pressed="true"] small{color:#3a2a08}
.kk button.kk-cevap:disabled{opacity:.5;cursor:not-allowed}
.kk-not{color:var(--k-soluk);font-size:.9em}
.kk .kk-uyari,.kk-sutun small.kk-uyari{color:var(--k-kirmizi)}
.kk-onay{display:flex;flex-wrap:wrap;align-items:center;gap:.4em .6em;padding-top:.35em;border-top:1px dashed var(--k-cizgi)}
.kk-onay span{flex:1 1 12em}
.kk button.kk-gonder{background:var(--k-vurguZemin);border-color:var(--k-vurgu);color:#1a1203;font-weight:600}
.od-kisiSatir{display:flex;gap:.6em;align-items:center}
.od-portre,.tel-portre{image-rendering:pixelated;image-rendering:crisp-edges;border-radius:.25em;flex:none}
.od-portre{width:2.9em;height:2.9em}
.portre-bos{display:inline-grid;place-items:center;width:2.4em;height:2.4em;background:var(--k-zeminKoyu);color:var(--k-soluk);font-weight:600}
.od-ajSimge{font-style:normal;display:inline-block;width:1.3em;color:var(--k-vurgu);font-weight:600}
.oda .od-panel.od-telefonPanel{width:41%}
.oda .od-panel.od-dosyaPanel{width:61%}
.od-telefonPanel .od-icerik{display:block;padding:.45em;overflow:hidden}
.tel{height:100%;display:grid;grid-template-rows:auto minmax(0,1fr) auto;background:${T.ekran};border:.45em solid ${T.kasa};border-radius:1.3em;overflow:hidden;color:var(--k-yazi)}
.tel p{margin:0}
.tel-ust{display:flex;justify-content:space-between;align-items:baseline;gap:.6em;padding:.25em .9em .15em;font-size:.86em;color:var(--k-soluk)}
.tel-ust b{font-family:var(--display);font-weight:400;font-size:1.5em;line-height:1;color:var(--k-yazi)}
.tel-govde{overflow-y:auto;padding:.3em .6em .5em;display:grid;gap:.45em;align-content:start}
.tel-alt{display:grid;place-items:center;padding:.2em 0 .3em}
.tel button.tel-ev{width:5.5em;height:.45em;padding:0;border:0;border-radius:1em;background:${T.kasa};opacity:.55}
.tel-ana{display:grid;gap:.8em;align-content:start;padding-top:.6em}
.tel-uyglar{display:grid;grid-template-columns:1fr 1fr;gap:.8em;justify-items:center;padding:.6em 0}
.tel button.tel-uyg{display:grid;justify-items:center;gap:.35em;background:transparent;border:0;padding:.2em;font-weight:600}
.tel-simge{position:relative;display:grid;place-items:center;width:4.4em;height:4.4em;border-radius:1.05em;color:#fff}
.tel-uygMesaj .tel-simge{background:${T.mesajSimge}}.tel-uygSkor .tel-simge{background:${T.skorSimge}}
.tel-simge svg{width:2.6em;height:2.6em}
.tel-rozet{font-style:normal;font-weight:600;font-size:.8em;min-width:1.5em;padding:.05em .4em;border-radius:1em;background:var(--k-vurguZemin);color:#1a1203;text-align:center}
.tel-simge .tel-rozet{position:absolute;top:-.4em;right:-.5em}
.tel-acil{background:var(--k-kirmizi);color:#fff}
.tel-baslik{display:flex;align-items:center;gap:.5em;padding-bottom:.3em;border-bottom:1px solid var(--k-cizgi);position:sticky;top:-.3em;background:${T.ekran};z-index:1}
.tel-baslik h4{margin:0;display:grid;font-size:1.05em;line-height:1.2}
.tel-baslik h4 small{font-weight:400;font-size:.8em;color:var(--k-soluk)}
.tel button.tel-geri{padding:.1em .55em;font-weight:600}
.tel-portre{width:2.5em;height:2.5em}
.tel-liste{list-style:none;margin:0;padding:0;display:grid}
.tel button.tel-kisi{display:grid;grid-template-columns:2.7em minmax(0,1fr) auto;gap:.5em;align-items:center;width:100%;text-align:left;background:transparent;border:0;border-bottom:1px solid var(--k-cizgi);border-radius:0;padding:.4em .1em}
.tel-kisiAd{display:grid;min-width:0;line-height:1.25}
.tel-kisiAd small{color:var(--k-soluk);font-size:.8em}
.tel-onizle{color:var(--k-soluk);font-size:.88em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-kisiSag{display:grid;justify-items:end;gap:.2em}
.tel-kisiSag small{color:var(--k-soluk);font-size:.78em}
.tel-etiket{font-style:normal;font-size:.72em;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--k-kirmizi);white-space:nowrap}
.tel-konusma{display:grid;gap:.4em;align-content:start}
.tel-gun{justify-self:center;font-size:.78em;letter-spacing:.06em;text-transform:uppercase;color:var(--k-soluk)}
.tel-not{justify-self:center;max-width:94%;text-align:center;font-size:.84em;color:var(--k-soluk)}
.tel-balon{max-width:86%;display:grid;gap:.15em;padding:.35em .6em;border:1px solid var(--k-cizgi);border-radius:.9em}
.tel-balon small{font-size:.74em;color:var(--k-soluk)}
.tel-gelen{justify-self:start;background:${T.gelen};border-bottom-left-radius:.2em}
.tel-giden{justify-self:end;background:${T.giden};border-color:${T.gidenCizgi};border-bottom-right-radius:.2em}
.tel-yeni{box-shadow:0 0 0 .14em var(--k-vurguZemin)}
.tel-dosya{font-style:normal}
.tel-oneri{display:grid;gap:.15em;justify-items:start;padding:.3em .5em;border:1px dashed var(--k-cizgi);border-radius:.5em}
.tel-oneri small{color:var(--k-soluk);font-size:.84em}
.tel-bos{color:var(--k-soluk);text-align:center;padding:1em 0}
.tel-skor{display:grid;gap:.45em}
.tel-skor h5{margin:0;font-size:.8em;letter-spacing:.1em;text-transform:uppercase;color:var(--k-vurgu)}
.tel .tel-mac{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:.2em .6em;width:100%;text-align:center;padding:.4em .5em;background:var(--k-serit);border:1px solid var(--k-cizgi);border-radius:.4em}
.tel-mac b{font-family:var(--display);font-weight:400;font-size:1.7em;line-height:1}
.tel-mac small{grid-column:1/-1;color:var(--k-soluk)}
.tel-ist{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
.tel-ist th,.tel-ist td{padding:.15em .3em;border-bottom:1px solid var(--k-cizgi);text-align:center}
.tel-ist tbody th{font-weight:400;color:var(--k-soluk)}
.tel .kk{border-left-width:.25em;border-radius:.4em}
.tel .kk-cevaplar{grid-template-columns:1fr 1fr}
`;
  document.head.appendChild(st);
})();
const TEL_GUNLER=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const telGunAdi=t=>{const [y,a,g]=t.split('-').map(Number);return TEL_GUNLER[new Date(Date.UTC(y,a-1,g)).getUTCDay()];};
const telTarih=(k,t)=>t===k.tarih?'Bugün':t===tarihEkle(k.tarih,-1)?'Dün':gunAyYazi(t)+' '+telGunAdi(t);

/* ---- karar kartı ---- */
function kararKarti(k,isId,s={}){
  const is=k.isler[isId];
  if(!is||is.tur!=='ajanda'||!is.veri.karar)return'';
  const v=is.veri,o=ajandaOnizle(k,isId,s.secim),S=o.secenekler,iki=S.length===2;
  let ic='<section class="kk'+(iki?' kk-iki':'')+'" aria-label="Karar">';
  ic+='<p class="kk-konu">'+yazT(v.aciklama)+'</p>';
  /* hazır görüş: kararı soranın ya da ilgili yöneticinin görüşü (konuşmada gösterilir; dosyada "Bilinenler"dedir) */
  if(s.gorus&&typeof meseleOlayi==='function'&&v.meseleId){
    const ol=meseleOlayi(k,v.meseleId),G=ol?ol.bilgiler.filter(b=>k.kisiler[b.kaynak]&&b.kaynak!==k.baskanId&&/\.tavsiye\./.test(b.anahtar)):[];
    for(const b of G.slice(-1))ic+='<p class="kk-gorus"><b>'+yazT(k.kisiler[b.kaynak].ad)+'</b> '+yazT(MESELE_OLAYLARI[b.anahtar](k,b.p))+'</p>';
  }
  ic+='<div class="kk-cevaplar">'+S.map(x=>{
    const sec=x.id===s.secim,kapali=!!x.engel||!!s.kapali,ac=(x.aciklama||[]).filter(Boolean),sure=x.sure!==undefined?x.sure:v.sure;
    return'<div class="kk-sutun"><button type="button" class="kk-cevap" data-eylem="sec" data-is="'+isId+'" data-secim="'+yazT(x.id)+'" aria-pressed="'+(sec?'true':'false')+'"'+(kapali?' disabled':'')+'>'+
      '<b>'+yazT(x.metin)+'</b><small>'+(sure?sure+' dk':'zaman almaz')+'</small></button>'+
      (x.engel?'<small class="kk-uyari">'+yazT(x.engel)+'</small>':'')+ac.map(a=>'<small>'+yazT(a)+'</small>').join('')+(s.testSecenek?s.testSecenek(isId,x):'')+'</div>';
  }).join('')+'</div>';
  const alt=[];
  if(is.veri.saatsiz&&!s.dosyada)alt.push('Son cevap: '+(is.tarih===k.tarih?'bugün ':gunAyYazi(is.tarih)+' ')+saatYazi(is.dakika));
  if(zamanAsimiVar(is))alt.push(zamanAsimiMetni(k,is));
  if(alt.length)ic+='<p class="kk-not">'+alt.map(yazT).join(' · ')+'</p>';
  if(s.kapali)ic+='<p class="kk-not">'+yazT(s.kapali)+'</p>';
  else{
    for(const e of o.engel.filter(e=>!/Bir seçenek/.test(e)))ic+='<p class="kk-uyari">'+yazT(e)+'</p>';
    if(o.atlanacak.length)ic+='<p class="kk-uyari">Bu karar zaman alır; kaçırılacak: '+o.atlanacak.map(x=>yazT(x.veri.baslik+' ('+saatYazi(x.dakika)+')')).join(', ')+'</p>';
    if(o.cevapsiz.length)ic+='<p class="kk-uyari">Bu arada cevapsız kalacak: '+o.cevapsiz.map(x=>yazT(x.veri.baslik)).join(', ')+'</p>';
    if(s.secim&&o.secenek){
      const uyar=(o.atlanacak.length||o.cevapsiz.length)&&!s.onay;
      ic+='<div class="kk-onay"><span>Kararın: <b>'+yazT(o.secenek.metin)+'</b></span>'+
        '<button type="button" class="kk-gonder" data-eylem="'+(uyar?'yapSor':'yap')+'" data-is="'+isId+'"'+(o.engel.length?' disabled':'')+'>'+(uyar?'Yine de onayla ▸':'Onayla ▸')+'</button>'+
        '<button type="button" data-eylem="vazgec">Vazgeç</button></div>';
    }
  }
  if(s.dosyaBaglanti&&v.meseleId)ic+='<p class="kk-not"><button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+v.meseleId+'" data-donus="telefon">Dosyayı aç ▸</button></p>';
  return ic+'</section>';
}

/* ---- telefon ---- */
const TEL_SIMGE={
  mesajlar:'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="8" rx="2" fill="currentColor"/><path d="M5 11 L4 14 L8 11 Z" fill="currentColor"/></svg>',
  skor:'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="4.5" y="6" width="2" height="4" fill="currentColor"/><rect x="9.5" y="6" width="2" height="4" fill="currentColor"/></svg>'
};
function telefonCiz(k,T,s={}){
  const saat=k?saatYazi(k.gunIciDakika):s.mac?s.mac.saat||'':'';
  const L=k?konusmaListesi(k):[],okunmamis=L.reduce((t,c)=>t+c.okunmamis,0),cevap=L.filter(c=>c.cevapBekliyor).length;
  let ust='<div class="tel-ust"><b>'+yazT(saat)+'</b><span>'+(k?yazT(telGunAdi(k.tarih)+' · '+gunAyYazi(k.tarih)):'')+'</span></div>',ic='';
  if(T.ekran==='ana'||!T.ekran){
    const rozet=cevap?'<i class="tel-rozet tel-acil">'+cevap+'</i>':okunmamis?'<i class="tel-rozet">'+okunmamis+'</i>':'';
    ic='<div class="tel-ana"><div class="tel-uyglar">'+
      '<button type="button" class="tel-uyg tel-uygMesaj" data-eylem="telUyg" data-uyg="mesajlar" aria-label="Mesajlar'+(cevap?', cevap bekleyen '+cevap:'')+'"><span class="tel-simge">'+TEL_SIMGE.mesajlar+rozet+'</span>Mesajlar</button>'+
      '<button type="button" class="tel-uyg tel-uygSkor" data-eylem="telUyg" data-uyg="skor"><span class="tel-simge">'+TEL_SIMGE.skor+'</span>Canlı Skor</button></div></div>';
  }else if(T.ekran==='mesajlar'){
    ic='<header class="tel-baslik"><button type="button" class="tel-geri" data-eylem="telEv" aria-label="Ana ekran">◂</button><h4>Mesajlar</h4></header>';
    if(!L.length)ic+='<p class="tel-bos">Mesaj yok. Telefon sessiz.</p>';
    else ic+='<ul class="tel-liste">'+L.map(c=>{
      const son=c.mesajlar[c.mesajlar.length-1],onizle=son?(son.yon==='giden'?'Sen: ':'')+son.metin:c.girisimler.length?c.girisimler[0].aciklama:'';
      return'<li><button type="button" class="tel-kisi" data-eylem="telKisi" data-kisi="'+yazT(c.anahtar)+'">'+portreHtml(c.kisi,'tel-portre')+
        '<span class="tel-kisiAd"><b>'+yazT(c.ad)+'</b><small>'+yazT(c.rol)+'</small><span class="tel-onizle">'+yazT(onizle)+'</span></span>'+
        '<span class="tel-kisiSag"><small>'+(son?yazT(son.tarih===k.tarih?saatYazi(son.dakika):telTarih(k,son.tarih)):'')+'</small>'+
        (c.cevapBekliyor?'<i class="tel-etiket">Cevap bekliyor</i>':c.okunmamis?'<i class="tel-rozet">'+c.okunmamis+'</i>':'')+'</span></button></li>';
    }).join('')+'</ul>';
  }else if(T.ekran==='konusma'){
    const c=L.find(x=>x.anahtar===T.kisi);
    if(!c)return telefonCiz(k,Object.assign(T,{ekran:'mesajlar'}),s);
    ic='<header class="tel-baslik"><button type="button" class="tel-geri" data-eylem="telUyg" data-uyg="mesajlar" aria-label="Mesajlar">◂</button>'+portreHtml(c.kisi,'tel-portre')+
      '<h4>'+yazT(c.ad)+'<small>'+yazT(c.rol)+'</small></h4></header><div class="tel-konusma">';
    let gun=null;
    for(const m of c.mesajlar){
      if(m.tarih!==gun){gun=m.tarih;ic+='<p class="tel-gun">'+yazT(telTarih(k,gun))+'</p>';}
      const yeni=m.yeni||!!(s.yeniler&&s.yeniler.has(m.meseleId+':'+m.sira));
      ic+=m.yon==='not'?'<p class="tel-not">'+yazT(m.metin)+'</p>'
        :'<div class="tel-balon tel-'+m.yon+(yeni?' tel-yeni':'')+'"><p>'+yazT(m.metin)+'</p><small>'+saatYazi(m.dakika)+(yeni?' · yeni':'')+'</small></div>';
    }
    if(!c.mesajlar.length)ic+='<p class="tel-bos">Henüz yazışma yok.</p>';
    for(const id of c.kararlar)ic+=kararKarti(k,id,{secim:(s.secimler||{})[id],onay:s.onay==='yap:'+id,gorus:true,kapali:s.kapali||null,dosyaBaglanti:!s.macta,testSecenek:s.testSecenek});
    for(const mid of c.dosyaKarar)ic+='<p class="tel-not tel-dosya">Bu konuda karar dosyada bekliyor. '+(s.macta?'':'<button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+mid+'" data-donus="telefon">Dosyayı aç ▸</button>')+'</p>';
    if(!s.macta){
      for(const G of c.girisimler)ic+='<div class="tel-oneri"><button type="button" data-eylem="girisim" data-girisim="'+G.id+'"'+(G.engel?' disabled':'')+'>'+yazT(G.ad)+' ▸</button><small>'+yazT(G.engel||G.aciklama)+'</small></div>';
      if(s.kasa&&c.kisi&&c.kisi.id===s.kasa)ic+='<div class="tel-oneri"><button type="button" data-eylem="ac" data-panel="kasa">Kasaya bak ▸</button><small>Kasadaki para ve ödeme takvimi.</small></div>';
    }
    ic+='</div>';
  }else if(T.ekran==='skor'){
    ic='<header class="tel-baslik"><button type="button" class="tel-geri" data-eylem="telEv" aria-label="Ana ekran">◂</button><h4>Canlı Skor</h4></header><div class="tel-skor">';
    if(s.mac){
      const M=s.mac;
      ic+='<h5>Bugün</h5><button type="button" class="tel-mac" data-eylem="skorAc" aria-expanded="'+(T.skorAc?'true':'false')+'"><span>'+yazT(M.ev)+'</span><b>'+yazT(M.skor)+'</b><span>'+yazT(M.dep)+'</span><small>'+yazT(M.durum)+'</small></button>';
      if(T.skorAc&&M.ist)ic+='<table class="tel-ist"><thead><tr><th>'+yazT(M.evKisa)+'</th><th></th><th>'+yazT(M.depKisa)+'</th></tr></thead><tbody>'+
        M.ist.map(r=>'<tr><td>'+yazT(r[1])+'</td><th scope="row">'+yazT(r[0])+'</th><td>'+yazT(r[2])+'</td></tr>').join('')+'</tbody></table>';
    }else if(k){
      const mac=bekleyenIsler(k).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
      ic+=mac?(mac.tarih===k.tarih?'<h5>Bugün</h5><div class="tel-mac"><span>'+yazT(mac.veri.baslik.replace(/^Maç: /,''))+'</span><small>'+saatYazi(mac.dakika)+' · başlamadı</small></div>'
        :'<p class="tel-bos">Bugün maç yok. Sıradaki: '+yazT(gunAyYazi(mac.tarih)+' '+telGunAdi(mac.tarih)+' '+saatYazi(mac.dakika))+' · '+yazT(mac.veri.baslik.replace(/^Maç: /,''))+'</p>'):'<p class="tel-bos">Yaklaşan maç yok.</p>';
    }
    ic+='<p class="tel-not">Diğer maçların verisi henüz bağlı değil.</p></div>';
  }
  return'<div class="tel" data-ekran="'+(T.ekran||'ana')+'">'+ust+'<div class="tel-govde">'+ic+'</div><div class="tel-alt"><button type="button" class="tel-ev" data-eylem="telEv" aria-label="Ana ekran"></button></div></div>';
}
