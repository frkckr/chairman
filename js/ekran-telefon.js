/* ============ Chairman — telefon ve karar kartı: oda, balkon ve maçta ortak çizim (görüntü katmanı; yol haritası 2.8I, N7) ============
   Kural içermez: içerik js/mesajlar.js (konusmaListesi), js/ajanda.js (ajandaOnizle) ve js/mesele.js okuma işlevlerinden gelir.
   Düğmeler data-eylem taşır; ev sahibi ekran (js/ekran-oda.js, js/ekran-mac-telefon.js) tıklamayı ortak kariyer komutuna çevirir.
   kararKarti(k, isId, s)   iki büyük cevaplı kart (dosya ve konuşma aynı kartı kullanır). s: {secim, onay, gorus, ozetsiz, kapali, dosyaBaglanti, dosyada, testSecenek}
     Cevaba basmak seçer; "Onayla" kararı verir (aynı karar telefonda ve dosyada bir kez uygulanır: ajandaIsiYap işi kapatır).
     Bilinen bedel (tutar, tarih, taahhüt, belirsizlik) seçenek açıklamasında, cevapsız kalırsa olacak olan kartın altında yazar.
     ozetsiz: konu ve hazır görüş kartta yazılmaz (telefonda konuşmanın akışında durur, kart alttaki cevap alanındadır; N7).
     İkiden fazla seçenek yalnız eski kayıtların kararlarında görülür (js/uyum-icerik2.js); aynı kart onları sırayla dizer.
   telefonCiz(k, T, s)      T: {ekran:'ana'|'mesajlar'|'konusma'|'skor', kisi, skorAc}. s: {macta, mac, secimler, onay, kapali, kasa, acilis}
     Ana ekran: tarih, büyük saat, bildirim kartları (okunmamış ya da cevap bekleyen konuşmalar; bugün maç varsa Canlı Skor), altta sabit sırada
     iki uygulama (Mesajlar, Canlı Skor). Mesajlar: kişi listesi → tek konuşma. Canlı Skor: günün maçları → ayrıntı. acilis: ekran yeni açıldı
     (kısa büyüyerek belirme; aynı ekran yeniden çizilirken verilmez).
     Maçta görünüm aynıdır; cevap verilmez (maç içi kariyer cevabı Aşama 3'te). Diğer maçların verisi 3.8'e kadar bağlı değildir;
     bağlanınca aynı tek satır kalıbıyla listeye gelirler, eksikleri için uyarı yazılmaz (N2, kullanıcı kararı 2026-10-04). */
const yazT=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
/* bileşenin görünüşü: oda (.oda) ve maç telefonu (.macTelefon) içinde aynı. Renkler STIL.kagit'ten (--k-*), telefonunkiler STIL.kagit.telefon'dan.
   Masaüstü kopyası yalnız js/ klasörünü taşıdığı için stil burada belgeye eklenir.
   N7 (kullanıcı kararı 2026-10-04; onaylı taslak prototipler/8-telefon.html): tanıdık akıllı telefon düzeni. Cihaz gövdesi, kamera adası, durum
   çubuğu, büyük saatli ana ekran ve bildirim kartları, altta sabit sırada iki uygulama; konuşmada iki cevap alttaki sabit cevap alanındadır
   (klavyenin yeri). Gerçek marka arayüzü birebir kopyalanmaz; masaüstünde okunur boyut: yazı büyüyünce cihaz da genişler, dar gerçek telefon
   ölçeğine zorlanmaz. Durum çubuğundaki sinyal ve pil süstür, düğme değildir. */
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
.oda .od-panel.od-telefonPanel{width:41%;background:transparent;border:0;box-shadow:none}
.oda .od-panel.od-dosyaPanel{width:61%}
/* telefon paneli: kâğıt panel yerine cihazın kendisi; başlık yalnız ekran okuyucu için, sağ üstte “Kapat” */
.od-telefonPanel>header{justify-content:flex-end;padding:0 0 .3em;background:transparent;border:0}
.od-telefonPanel>header h3{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.od-telefonPanel .od-icerik{display:block;padding:0;overflow:hidden}
/* ---- cihaz: yuvarlak köşeli gövde, ince çerçeve, kamera adası, ana ekran çizgisi ---- */
.tel-yer{container-type:size;width:100%;height:100%;min-height:0;display:grid;place-items:center}
.tel{box-sizing:border-box;height:100cqh;width:min(100cqw,max(49cqh,21em));padding:.55em;display:grid;background:${T.kasa};border-radius:2.6em;
  box-shadow:0 1.1em 2.4em rgba(0,0,0,.45),inset 0 0 0 .14em ${T.cerceve};color:var(--k-yazi)}
.tel p{margin:0}
.tel-ekran{position:relative;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;border-radius:2.1em;overflow:hidden;background:${T.ekran}}
.tel-ekran[data-ekran="ana"]{background:linear-gradient(180deg,${T.anaZemin[0]} 0%,${T.anaZemin[1]} 38%,${T.anaZemin[2]} 100%)}
.tel-ada{position:absolute;top:.6em;left:50%;transform:translateX(-50%);width:6em;height:1.75em;border-radius:1em;background:${T.ada};z-index:3}
.tel-durum{display:flex;justify-content:space-between;align-items:center;gap:.5em;min-height:2.95em;padding:.75em 1.55em .25em;font-weight:600;font-size:.92em;font-variant-numeric:tabular-nums}
.tel-durum>span{display:flex;gap:.35em;align-items:center}
.tel-sinyal{display:flex;gap:.14em;align-items:flex-end;height:.8em}.tel-sinyal i{width:.22em;background:var(--k-yazi);border-radius:.06em}
.tel-sinyal i:nth-child(1){height:30%}.tel-sinyal i:nth-child(2){height:50%}.tel-sinyal i:nth-child(3){height:75%}.tel-sinyal i:nth-child(4){height:100%}
.tel-pil{position:relative;width:1.65em;height:.8em;padding:.08em;border:.1em solid var(--k-yazi);border-radius:.22em}
.tel-pil::after{content:"";position:absolute;right:-.3em;top:.18em;width:.14em;height:.3em;background:var(--k-yazi);border-radius:0 .1em .1em 0}
.tel-pil i{display:block;height:100%;width:72%;background:var(--k-yazi);border-radius:.08em}
.tel-govde{min-height:0;overflow-y:auto;display:grid;gap:.45em;align-content:start;padding:.2em .7em .5em}
.tel-acilis{animation:telAc .18s ease-out}
@keyframes telAc{from{opacity:0;transform:scale(.965)}to{opacity:1;transform:none}}
.tel-alt{display:grid;place-items:center;padding:.25em 0 .45em}
.tel button.tel-ev{width:8em;height:.36em;padding:0;border:0;border-radius:1em;background:var(--k-yazi);opacity:.8}
.tel button.tel-ev:hover:not(:disabled){opacity:1}
/* ---- ana ekran: tarih ve büyük saat, bildirim kartları, altta sabit sıra ---- */
.tel-ekran[data-ekran="ana"] .tel-govde{grid-template-rows:auto 1fr auto;align-content:stretch;padding:0 .8em .2em}
.tel-saatBlok{display:grid;justify-items:center;padding-top:.6em}
.tel-tarih{color:var(--k-soluk);font-weight:500}
.tel-saat{font-family:var(--display);font-size:5.2em;line-height:.9;letter-spacing:.02em;font-variant-numeric:tabular-nums}
.tel-bildirimler{display:grid;gap:.55em;align-content:start;padding-top:.9em}
.tel button.tel-bildirim{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:.1em .7em;align-items:center;width:100%;text-align:left;padding:.6em .75em;
  background:rgba(251,247,236,.92);border:1px solid var(--k-cizgi);border-radius:1.1em;box-shadow:0 .15em .4em rgba(40,28,12,.12)}
.tel-bildirim .tel-simge{grid-row:span 2;width:2.3em;height:2.3em;border-radius:.6em}
.tel-bildirim b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-bildirim time{color:var(--k-soluk);font-size:.82em;white-space:nowrap}
.tel-bildirim>span:last-child{grid-column:2/-1;color:var(--k-soluk);font-size:.9em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-bekliyor{color:var(--k-kirmizi);font-weight:600}
.tel-sabit{display:flex;justify-content:center;gap:1.8em;margin-top:.6em;padding:.65em 1em;border-radius:1.8em;background:${T.sabit}}
.tel button.tel-uyg{display:grid;justify-items:center;gap:.3em;padding:.1em;background:transparent;border:0;font-size:.8em;font-weight:500}
.tel-uyg .tel-simge{width:4.3em;height:4.3em;border-radius:1.1em}
.tel-simge{position:relative;display:grid;place-items:center;color:#fff;box-shadow:inset 0 -.2em 0 rgba(0,0,0,.18)}
.tel-simge svg{width:58%;height:58%}
.tel-simgeMesaj{background:${T.mesajSimge}}.tel-simgeSkor{background:${T.skorSimge}}
.tel-rozet{font-style:normal;display:inline-grid;place-items:center;min-width:1.55em;height:1.55em;padding:0 .35em;border-radius:1em;background:var(--k-kirmizi);color:#fff;font-size:.74em;font-weight:600}
.tel-simge .tel-rozet{position:absolute;top:-.35em;right:-.45em;border:.14em solid ${T.ekran};font-size:.95em}
/* ---- uygulama başlığı: küçük geri, büyük başlık ---- */
.tel-nav{display:flex;align-items:center;min-height:1.9em}
.tel button.tel-geri{display:inline-flex;align-items:center;gap:.15em;padding:.15em .1em;background:transparent;border:0;color:${T.baglanti};font-weight:500}
.tel button.tel-geri::before{content:"";width:.55em;height:.55em;border-left:.13em solid currentColor;border-bottom:.13em solid currentColor;transform:rotate(45deg);margin:0 .15em 0 .2em}
.tel h4.tel-buyukBaslik{display:block;margin:0;font-family:var(--display);font-weight:400;font-size:2.5em;line-height:1;letter-spacing:.02em;text-transform:none;color:var(--k-yazi);padding:0 .05em .15em}
/* ---- Mesajlar: kişi satırları ---- */
.tel-portre{width:2.5em;height:2.5em}
.tel .tel-portre{border-radius:50%;border:1px solid var(--k-cizgi);background:var(--k-serit)}
.tel-liste{list-style:none;margin:0 -.7em;padding:0;display:grid}
.tel button.tel-kisi{display:grid;grid-template-columns:.6em auto minmax(0,1fr) auto;gap:.1em .6em;align-items:center;width:100%;text-align:left;
  padding:.55em .9em .55em .5em;background:transparent;border:0;border-bottom:1px solid ${T.ayrac};border-radius:0}
.tel-nokta{grid-row:1/span 3;width:.6em;height:.6em;border-radius:50%}.tel-nokta.tel-okunmamis{background:${T.baglanti}}
.tel-kisi .tel-portre{grid-row:1/span 3;width:2.9em;height:2.9em}
.tel-kisi b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-kisi time{color:var(--k-soluk);font-size:.82em;white-space:nowrap}
.tel-onizle{grid-column:3/-1;display:flex;gap:.5em;align-items:baseline;min-width:0;color:var(--k-soluk);font-size:.9em}
.tel-onizle span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tel-kisi .tel-rozet{flex:none}
.tel-etiket{grid-column:3/-1;font-style:normal;font-size:.76em;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--k-kirmizi);white-space:nowrap}
/* ---- konuşma: üstte kişi, baloncuklar; altta sabit cevap alanı ---- */
.tel-ekran[data-ekran="konusma"] .tel-govde{display:flex;flex-direction:column;gap:0;padding-top:0}
.tel-kisiBas{position:sticky;top:0;z-index:1;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin:0 -.7em;padding:0 .6em .35em;background:${T.ekran};border-bottom:1px solid var(--k-cizgi)}
.tel-kisiBas>div{display:grid;justify-items:center;gap:.05em;font-size:.86em;font-weight:600;text-align:center;line-height:1.2}
.tel-kisiBas small{font-weight:400;color:var(--k-soluk)}
.tel-konusma{margin-top:auto;display:grid;gap:.4em;align-content:end;padding-top:.6em}
.tel-gun{justify-self:center;font-size:.76em;letter-spacing:.04em;color:var(--k-soluk)}
.tel-not{justify-self:center;max-width:94%;text-align:center;font-size:.84em;color:var(--k-soluk)}
.tel-balon{max-width:84%;display:grid;gap:.1em;padding:.45em .75em;border-radius:1.1em;line-height:1.35}
.tel-balon small{font-size:.74em;color:var(--k-soluk)}
.tel-gelen{justify-self:start;background:${T.gelen};border:1px solid var(--k-cizgi);border-bottom-left-radius:.35em}
.tel-giden{justify-self:end;background:${T.giden};border:1px solid ${T.gidenCizgi};border-bottom-right-radius:.35em}
.tel-yeni{box-shadow:0 0 0 .14em var(--k-vurguZemin)}
.tel-dosya{font-style:normal}
.tel-kararOzet{display:grid;gap:.3em;padding:.45em .6em;border:1px dashed var(--k-cizgi);border-radius:.8em;font-size:.92em}
.tel-oneri{display:grid;gap:.15em;justify-items:start;padding:.3em .5em;border:1px dashed var(--k-cizgi);border-radius:.5em}
.tel-oneri small{color:var(--k-soluk);font-size:.84em}
.tel-bos{color:var(--k-soluk);text-align:center;padding:1em 0}
.tel-cevap{display:grid;gap:.45em;max-height:55cqh;overflow-y:auto;padding:.5em .65em .2em;background:var(--k-serit);border-top:1px solid var(--k-cizgi)}
.tel-cevapBas{font-size:.8em;color:var(--k-soluk)}
.tel-cevap .kk{padding:0;gap:.4em;background:transparent;border:0}
.tel-cevap .kk+.tel-cevapBas{padding-top:.4em;border-top:1px dashed var(--k-cizgi)}
.tel .tel-cevap .kk-cevaplar{grid-template-columns:1fr 1fr;gap:.5em}
.tel .kk button.kk-cevap{background:#fff;border-radius:.8em;border-bottom-width:.2em}
.tel .kk button.kk-cevap[aria-pressed="true"]{background:var(--k-vurguZemin)}
.tel-cevap .kk-not:last-child{text-align:center}
/* ---- Canlı Skor ---- */
.tel-skor{display:grid;gap:.45em}
.tel-skor h5{margin:.3em 0 0;font-size:.76em;letter-spacing:.1em;text-transform:uppercase;color:var(--k-vurgu);font-weight:600}
/* N2 (2026-10-04): her karşılaşma tek satır: saat ya da dakika/durum · ev sahibi · skor · deplasman; sığmayan ad kesilir, satır kaymaz */
.tel .tel-mac{display:grid;grid-template-columns:3.4em minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:.5em;width:100%;padding:.55em .6em;white-space:nowrap;line-height:1.2;background:var(--k-serit);border:1px solid var(--k-cizgi);border-radius:.8em}
.tel-mac span{overflow:hidden;text-overflow:ellipsis}
.tel-mac .tel-macEv{text-align:right}.tel-mac .tel-macDep{text-align:left}
.tel-mac b{font-family:var(--display);font-weight:400;font-size:1.3em;line-height:1}
.tel-mac small{color:var(--k-soluk);text-align:left;font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis}
.tel-mac small.tel-macCanli{color:var(--k-kirmizi);font-weight:600}
.tel-ist{width:100%;border-collapse:separate;border-spacing:0;font-variant-numeric:tabular-nums;background:#fff;border:1px solid var(--k-cizgi);border-radius:.8em;overflow:hidden}
.tel-ist th,.tel-ist td{padding:.3em .5em;border-bottom:1px solid ${T.ayrac};text-align:center}
.tel-ist thead th{background:var(--k-zemin);font-size:.88em}
.tel-ist tbody tr:last-child>*{border-bottom:0}
.tel-ist tbody th{font-weight:400;color:var(--k-soluk)}
.tel .kk{border-left-width:.25em;border-radius:.4em}
`;
  document.head.appendChild(st);
})();
const TEL_GUNLER=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const telGunAdi=t=>{const [y,a,g]=t.split('-').map(Number);return TEL_GUNLER[new Date(Date.UTC(y,a-1,g)).getUTCDay()];};
const telTarih=(k,t)=>t===k.tarih?'Bugün':t===tarihEkle(k.tarih,-1)?'Dün':gunAyYazi(t)+' '+telGunAdi(t);
/* kişi satırı ve bildirim kartındaki kısa an: bugün saat, dün “dün”, son bir haftada gün adı, daha eskisi gün ve ay */
const telKisaAn=(k,t,dk)=>{if(t===k.tarih)return saatYazi(dk);const f=Math.round((anDakika(k.tarih,0)-anDakika(t,0))/1440);
  return f===1?'dün':f>1&&f<7?telGunAdi(t):gunAyYazi(t);};
/* Canlı Skor satırında kulübün kısa adı (N7, onaylı taslaktaki gibi “Demirkapı – Akdeniz”): lig kaydındaki tam addan kadro adına; kadrosu yoksa tam ad.
   Tam ad satırın başlığında (title) kalır. Yalnız görüntü eşlemesidir; kariyer verisi değişmez */
const telKisaAd=ad=>{const t=typeof LIG!=='undefined'&&LIG.takimlar.find(x=>x.ad===ad);return t&&typeof KADROLAR!=='undefined'&&KADROLAR[t.id]?KADROLAR[t.id].ad:ad;};
/* Canlı Skor satırı (N2): tek satır. m: {sol: saat ya da dakika/durum, canli, ev, orta: skor ya da “–”, dep, durum: okunur durum}; nitelik verilirse satır düğmedir */
function telMacSatiri(m,nitelik){
  const ic='<small'+(m.canli?' class="tel-macCanli"':'')+'>'+yazT(m.sol)+'</small><span class="tel-macEv">'+yazT(telKisaAd(m.ev))+'</span><b>'+yazT(m.orta)+'</b><span class="tel-macDep">'+yazT(telKisaAd(m.dep))+'</span>';
  const baslik=' title="'+yazT(m.ev+' – '+m.dep+' · '+m.durum)+'"';
  return nitelik?'<button type="button" class="tel-mac" '+nitelik+baslik+'>'+ic+'</button>':'<div class="tel-mac"'+baslik+'>'+ic+'</div>';
}

/* ---- karar kartı ---- */
/* hazır görüş: kararı soranın ya da ilgili yöneticinin görüşü (konuşmada gösterilir; dosyada "Bilinenler"dedir) */
function kararGorusu(k,v){
  if(typeof meseleOlayi!=='function'||!v.meseleId)return'';
  const ol=meseleOlayi(k,v.meseleId),G=ol?ol.bilgiler.filter(b=>k.kisiler[b.kaynak]&&b.kaynak!==k.baskanId&&/\.tavsiye\./.test(b.anahtar)):[];
  return G.slice(-1).map(b=>'<p class="kk-gorus"><b>'+yazT(k.kisiler[b.kaynak].ad)+'</b> '+yazT(MESELE_OLAYLARI[b.anahtar](k,b.p))+'</p>').join('');
}
function kararKarti(k,isId,s={}){
  const is=k.isler[isId];
  if(!is||is.tur!=='ajanda'||!is.veri.karar)return'';
  const v=is.veri,o=ajandaOnizle(k,isId,s.secim),S=o.secenekler,iki=S.length===2;
  let ic='<section class="kk'+(iki?' kk-iki':'')+'" aria-label="Karar">';
  if(!s.ozetsiz){
    ic+='<p class="kk-konu">'+yazT(v.aciklama)+'</p>';
    if(s.gorus)ic+=kararGorusu(k,v);
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
  mesajlar:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>',
  skor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5l4 3-1.5 4.5h-5L8 10.5z" fill="currentColor" stroke="none"/></svg>'
};
const telSimge=(ad,ek)=>'<span class="tel-simge tel-simge'+(ad==='mesajlar'?'Mesaj':'Skor')+'">'+TEL_SIMGE[ad]+(ek||'')+'</span>';
/* konuşmanın önizleme satırı: son mesaj (giden “Sen: ” ile); yazışma yoksa ilk öneri */
const telOnizle=c=>{const son=c.mesajlar[c.mesajlar.length-1];return son?(son.yon==='giden'?'Sen: ':'')+son.metin:c.girisimler.length?c.girisimler[0].aciklama:'';};
function telefonCiz(k,T,s={}){
  const ekran=T.ekran||'ana',M=s.mac||null;
  /* maçta saat yerine maçın kısa durumu (başlama saati, dakika, Devre, Bitti) */
  const saat=M?M.kisaDurum||M.saat||'':k?saatYazi(k.gunIciDakika):'';
  const L=k?konusmaListesi(k):[],okunmamis=L.reduce((t,c)=>t+c.okunmamis,0),cevap=L.filter(c=>c.cevapBekliyor).length;
  const geri=(ey,ek,etiket)=>'<button type="button" class="tel-geri" data-eylem="'+ey+'"'+(ek||'')+' aria-label="'+etiket+'">Geri</button>';
  let ic='',alt='';
  if(ekran==='ana'){
    /* bildirimler: okunmamış ya da cevap bekleyen konuşmalar (en çok dört), bugün maç varsa Canlı Skor */
    const B=L.filter(c=>c.okunmamis>0||c.cevapBekliyor).slice(0,4).map(c=>{
      const son=c.mesajlar[c.mesajlar.length-1];
      return'<button type="button" class="tel-bildirim" data-eylem="telKisi" data-kisi="'+yazT(c.anahtar)+'">'+telSimge('mesajlar')+'<b>'+yazT(c.ad)+'</b><time>'+(son?yazT(telKisaAn(k,son.tarih,son.dakika)):'')+'</time>'+
        '<span>'+(c.cevapBekliyor?'<span class="tel-bekliyor">Cevap bekliyor</span> · ':'')+yazT(telOnizle(c))+'</span></button>';
    });
    if(M)B.push('<button type="button" class="tel-bildirim" data-eylem="telUyg" data-uyg="skor">'+telSimge('skor')+'<b>Canlı Skor</b><time>'+(M.canli?'şimdi':'bugün')+'</time>'+
      '<span>'+yazT(M.ev+' '+M.skor+' '+M.dep+' · '+(M.kisaDurum||M.durum))+'</span></button>');
    else if(k){
      const mac=bekleyenIsler(k).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'&&x.tarih===k.tarih);
      if(mac)B.push('<button type="button" class="tel-bildirim" data-eylem="telUyg" data-uyg="skor">'+telSimge('skor')+'<b>Canlı Skor</b><time>bugün</time>'+
        '<span>'+yazT(mac.veri.baslik.replace(/^Maç: /,'')+' · '+saatYazi(mac.dakika))+'</span></button>');
    }
    const rozet=cevap?'<i class="tel-rozet">'+cevap+'</i>':okunmamis?'<i class="tel-rozet">'+okunmamis+'</i>':'';
    ic='<div class="tel-saatBlok"><p class="tel-tarih">'+(k?yazT(telGunAdi(k.tarih)+', '+gunAyYazi(k.tarih)):'Maç günü')+'</p><p class="tel-saat">'+yazT(saat)+'</p></div>'+
      '<div class="tel-bildirimler" aria-label="Bildirimler">'+B.join('')+'</div>'+
      '<div class="tel-sabit">'+
        '<button type="button" class="tel-uyg tel-uygMesaj" data-eylem="telUyg" data-uyg="mesajlar" aria-label="Mesajlar'+(cevap?', cevap bekleyen '+cevap:okunmamis?', okunmamış '+okunmamis:'')+'">'+telSimge('mesajlar',rozet)+'Mesajlar</button>'+
        '<button type="button" class="tel-uyg tel-uygSkor" data-eylem="telUyg" data-uyg="skor">'+telSimge('skor')+'Canlı Skor</button></div>';
  }else if(ekran==='mesajlar'){
    ic='<header class="tel-nav">'+geri('telEv','','Ana ekran')+'</header><h4 class="tel-buyukBaslik">Mesajlar</h4>';
    if(!L.length)ic+='<p class="tel-bos">Mesaj yok. Telefon sessiz.</p>';
    else ic+='<ul class="tel-liste">'+L.map(c=>{
      const son=c.mesajlar[c.mesajlar.length-1];
      return'<li><button type="button" class="tel-kisi" data-eylem="telKisi" data-kisi="'+yazT(c.anahtar)+'"><i class="tel-nokta'+(c.okunmamis?' tel-okunmamis':'')+'" aria-hidden="true"></i>'+portreHtml(c.kisi,'tel-portre')+
        '<b>'+yazT(c.ad)+'</b><time>'+(son?yazT(telKisaAn(k,son.tarih,son.dakika)):'')+'</time>'+
        '<span class="tel-onizle"><span>'+yazT(telOnizle(c))+'</span>'+(!c.cevapBekliyor&&c.okunmamis?'<i class="tel-rozet">'+c.okunmamis+'</i>':'')+'</span>'+
        (c.cevapBekliyor?'<i class="tel-etiket">Cevap bekliyor</i>':'')+'</button></li>';
    }).join('')+'</ul>';
  }else if(ekran==='konusma'){
    const c=L.find(x=>x.anahtar===T.kisi);
    if(!c)return telefonCiz(k,Object.assign(T,{ekran:'mesajlar'}),s);
    ic='<header class="tel-kisiBas">'+geri('telUyg',' data-uyg="mesajlar"','Mesajlar')+'<div>'+portreHtml(c.kisi,'tel-portre')+yazT(c.ad)+'<small>'+yazT(c.rol)+'</small></div><span></span></header><div class="tel-konusma">';
    let gun=null;
    for(const m of c.mesajlar){
      if(m.tarih!==gun){gun=m.tarih;ic+='<p class="tel-gun">'+yazT(telTarih(k,gun))+'</p>';}
      const yeni=m.yeni||!!(s.yeniler&&s.yeniler.has(m.meseleId+':'+m.sira));
      ic+=m.yon==='not'?'<p class="tel-not">'+yazT(m.metin)+'</p>'
        :'<div class="tel-balon tel-'+m.yon+(yeni?' tel-yeni':'')+'"><p>'+yazT(m.metin)+'</p><small>'+saatYazi(m.dakika)+(yeni?' · yeni':'')+'</small></div>';
    }
    if(!c.mesajlar.length)ic+='<p class="tel-bos">Henüz yazışma yok.</p>';
    /* bekleyen kararın konusu ve hazır görüş akışın sonunda; iki cevap alttaki sabit alanda (klavyenin yeri) */
    for(const id of c.kararlar){const is=k.isler[id];if(is&&is.veri&&is.veri.karar)ic+='<div class="tel-kararOzet"><p class="kk-konu">'+yazT(is.veri.aciklama)+'</p>'+kararGorusu(k,is.veri)+'</div>';}
    for(const mid of c.dosyaKarar)ic+='<p class="tel-not tel-dosya">Bu konuda karar dosyada bekliyor. '+(s.macta?'':'<button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+mid+'" data-donus="telefon">Dosyayı aç ▸</button>')+'</p>';
    if(!s.macta){
      for(const G of c.girisimler)ic+='<div class="tel-oneri"><button type="button" data-eylem="girisim" data-girisim="'+G.id+'"'+(G.engel?' disabled':'')+'>'+yazT(G.ad)+' ▸</button><small>'+yazT(G.engel||G.aciklama)+'</small></div>';
      if(s.kasa&&c.kisi&&c.kisi.id===s.kasa)ic+='<div class="tel-oneri"><button type="button" data-eylem="ac" data-panel="kasa">Kasaya bak ▸</button><small>Kasadaki para ve ödeme takvimi.</small></div>';
    }
    ic+='</div>';
    const K=c.kararlar.filter(id=>k.isler[id]);
    if(K.length)alt='<div class="tel-cevap" aria-label="Cevap">'+K.map(id=>'<p class="tel-cevapBas">'+yazT(k.isler[id].veri.baslik||'Karar')+'</p>'+
      kararKarti(k,id,{secim:(s.secimler||{})[id],onay:s.onay==='yap:'+id,ozetsiz:true,kapali:s.kapali||null,dosyaBaglanti:!s.macta,testSecenek:s.testSecenek})).join('')+'</div>';
  }else if(ekran==='skor'){
    ic='<header class="tel-nav">'+geri('telEv','','Ana ekran')+'</header><h4 class="tel-buyukBaslik">Canlı Skor</h4><div class="tel-skor">';
    if(M){
      ic+='<h5>Bugün</h5>'+telMacSatiri({sol:M.kisaDurum||M.durum,canli:!!M.canli,ev:M.ev,orta:M.skor,dep:M.dep,durum:M.durum},'data-eylem="skorAc" aria-expanded="'+(T.skorAc?'true':'false')+'"');
      if(T.skorAc&&M.ist)ic+='<table class="tel-ist"><thead><tr><th>'+yazT(M.evKisa)+'</th><th></th><th>'+yazT(M.depKisa)+'</th></tr></thead><tbody>'+
        M.ist.map(r=>'<tr><td>'+yazT(r[1])+'</td><th scope="row">'+yazT(r[0])+'</th><td>'+yazT(r[2])+'</td></tr>').join('')+'</tbody></table>';
    }else if(k){
      const mac=bekleyenIsler(k).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
      if(mac){const [ev,dep]=mac.veri.baslik.replace(/^Maç: /,'').split(' – '),bugun=mac.tarih===k.tarih;
        ic+=(bugun?'<h5>Bugün</h5>':'<p class="tel-bos">Bugün maç yok.</p><h5>Sıradaki · '+yazT(telGunAdi(mac.tarih)+' '+gunAyYazi(mac.tarih))+'</h5>')+
          telMacSatiri({sol:saatYazi(mac.dakika),ev,orta:'–',dep:dep||'',durum:'başlamadı'});}
      else ic+='<p class="tel-bos">Yaklaşan maç yok.</p>';
    }
    ic+='</div>';
  }
  return'<div class="tel-yer"><div class="tel" data-ekran="'+ekran+'"><div class="tel-ekran" data-ekran="'+ekran+'"><i class="tel-ada" aria-hidden="true"></i>'+
    '<div class="tel-durum"><b>'+yazT(saat)+'</b><span aria-hidden="true"><span class="tel-sinyal"><i></i><i></i><i></i><i></i></span><span class="tel-pil"><i></i></span></span></div>'+
    '<div class="tel-govde'+(s.acilis?' tel-acilis':'')+'">'+ic+'</div>'+alt+
    '<div class="tel-alt"><button type="button" class="tel-ev" data-eylem="telEv" aria-label="Ana ekran" title="Ana ekran (Esc)"></button></div></div></div></div>';
}
