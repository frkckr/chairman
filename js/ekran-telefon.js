/* ============ Chairman — telefon ve karar kartı: oda, balkon ve maçta ortak çizim (görüntü katmanı; yol haritası 2.8I, N7) ============
   Kural içermez: içerik js/mesajlar.js (konusmaListesi), js/ajanda.js (ajandaOnizle) ve js/mesele.js okuma işlevlerinden gelir.
   Düğmeler data-eylem taşır; ev sahibi ekran (js/ekran-oda.js, js/ekran-mac-telefon.js) tıklamayı ortak kariyer komutuna çevirir.
   Karar kartı H1'den (F4) beri js/ekran-kart.js'tedir (kararKarti, kararGorusu, yazT; tek kart). Konuşmada kart alttaki cevap alanındadır ve özetsizdir:
     konu ve hazır görüş konuşmanın akışında durur (N7). Aynı karar telefonda ve dosyada bir kez uygulanır (ajandaIsiYap işi kapatır).
   telefonCiz(k, T, s)      T: {ekran:'ana'|'mesajlar'|'konusma'|'skor', kisi, skorAc (H2-b: açık Canlı Skor satırının maç kimliği ya da null)}. s: {macta, mac, onizleler, kapali, kasa, acilis, yeniler, testSecenek}
     onizleler: karar başına kartta önizlenen yön ('sol'|'sag'; ev sahibinin görünüm durumu, js/ekran-oda.js). kapali: kart kilitli, nedeni yüzde (maçta)
     Ana ekran: tarih, büyük saat, bildirim kartları (yalnız okunmamış ya da cevap bekleyen konuşmalar; N14, 2026-10-18: maç gününün Canlı Skor
     kartı kalktı), altta sabit sırada iki uygulama (Mesajlar, Canlı Skor). Mesajlar: kişi listesi → tek konuşma (konuşma yoksa boş liste, yazı
     yok). Canlı Skor: günün maçları → ayrıntı. acilis: ekran yeni açıldı
     (kısa büyüyerek belirme; aynı ekran yeniden çizilirken verilmez).
     Maçta görünüm aynıdır; cevap verilmez (maç içi kariyer cevabı Aşama 3'te). Diğer maçlar F7'den beri bağlıdır (canlı skor ve sonuçlar);
     bağlanınca aynı tek satır kalıbıyla listeye gelirler, eksikleri için uyarı yazılmaz (N2, kullanıcı kararı 2026-10-04). */
/* bileşenin görünüşü: oda (.oda) ve maç telefonu (.macTelefon) içinde aynı. Renkler STIL.kagit'ten (--k-*), telefonunkiler STIL.kagit.telefon'dan.
   Masaüstü kopyası yalnız js/ klasörünü taşıdığı için stil burada belgeye eklenir.
   N7 (kullanıcı kararı 2026-10-04; onaylı taslak tur/p2'deki prototipler/8-telefon.html): tanıdık akıllı telefon düzeni. Cihaz gövdesi, kamera adası, durum
   çubuğu, büyük saatli ana ekran ve bildirim kartları, altta sabit sırada iki uygulama; konuşmada iki cevap alttaki sabit cevap alanındadır
   (klavyenin yeri). Gerçek marka arayüzü birebir kopyalanmaz; masaüstünde okunur boyut: yazı büyüyünce cihaz da genişler, dar gerçek telefon
   ölçeğine zorlanmaz. Durum çubuğundaki sinyal ve pil süstür, düğme değildir. */
(function telefonStili(){
  if(typeof document==='undefined'||document.getElementById('telefonStili'))return;
  const T=STIL.kagit.telefon,KT=STIL.kagit.kart,st=document.createElement('style');st.id='telefonStili';
  /* H1-b: dar cevap alanında (panelin %41'i) önizleme kayması küçüktür; alanın yan boşluğu ve kartın eğimi ona göre (js/ekran-kart.js kalıbı) */
  const telYan=(KT.telefon.kayma/(1+2*KT.telefon.kayma)*100).toFixed(2),telEgim=(KT.egim*KT.telefon.kayma/KT.esik).toFixed(2);
  st.textContent=`
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
/* tek kart (H1): en az yükseklik (yüz dönünce kenarlar yerinde; yüz üstte, kenarlar altta), küçük önizleme kayması */
.tel .tel-cevap .kk-alan{padding:0 ${telYan}%}
.tel .tel-cevap .kk-kart{gap:.4em;padding:.45em .55em;background:#fff;border-radius:.8em;min-height:min(${KT.telefon.yukseklik},40cqh);grid-template-rows:minmax(0,1fr);grid-auto-rows:auto}
.tel .tel-cevap .kk-kart[data-yuz="sol"]{transform:translateX(-${KT.telefon.kayma*100}%) rotate(-${telEgim}deg)}
.tel .tel-cevap .kk-kart[data-yuz="sag"]{transform:translateX(${KT.telefon.kayma*100}%) rotate(${telEgim}deg)}
.tel-cevap .kk-alan+.tel-cevapBas{padding-top:.4em;border-top:1px dashed var(--k-cizgi)}
.tel .tel-cevap .kk-kenar{border-radius:.8em}
.tel-cevap .kk-kart>.kk-not:last-child{text-align:center}
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
/* H2-b: maçın ayrıntısı — goller, kartlar, sakatlıklar iki sütunda (ev solda), altında tablo; uzun satır kesilir, yatay taşma yok */
.tel-ayrinti{display:grid;gap:.4em;min-width:0}
.tel-olaylar{display:grid;gap:.1em;min-width:0;padding:.35em .55em;background:#fff;border:1px solid var(--k-cizgi);border-radius:.8em}
.tel h6{margin:0;font-size:.72em;letter-spacing:.1em;text-transform:uppercase;color:var(--k-vurgu);font-weight:600}
.tel-olayIki{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 .8em;min-width:0}
.tel-olayIki ul{margin:0;padding:0;list-style:none;display:grid;align-content:start;gap:.05em;min-width:0}
.tel-olay{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.9em}
.tel-olay small{color:var(--k-soluk)}
.tel-dk{display:inline-block;min-width:2.3em;color:var(--k-soluk);font-variant-numeric:tabular-nums}
.tel-kartRenk{display:inline-block;width:.55em;height:.8em;margin-right:.35em;vertical-align:-.08em;border:1px solid rgba(0,0,0,.35);border-radius:.08em}
.tel-olayYok{margin:0;color:var(--k-soluk);font-size:.9em}
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
const telKisaAd=ad=>{
  /* F1-b: önce kariyerdeki kulüp kadrosunun kısa adı (bütün lig), yoksa geliştirme verisi (js/lig.js, js/kadrolar.js) */
  const k=typeof OYUN!=='undefined'&&OYUN.kariyer,c=k&&k.kulupler&&Object.values(k.kulupler).find(x=>x.ad===ad);if(c&&c.kadro)return c.kadro.ad;
  const t=typeof LIG!=='undefined'&&LIG.takimlar.find(x=>x.ad===ad);return t&&typeof KADROLAR!=='undefined'&&KADROLAR[t.id]?KADROLAR[t.id].ad:ad;};
/* Canlı Skor satırı (N2): tek satır. m: {sol: saat ya da dakika/durum, canli, ev, orta: skor ya da “–”, dep, durum: okunur durum}; nitelik verilirse satır düğmedir */
function telMacSatiri(m,nitelik){
  const ic='<small'+(m.canli?' class="tel-macCanli"':'')+'>'+yazT(m.sol)+'</small><span class="tel-macEv">'+yazT(telKisaAd(m.ev))+'</span><b>'+yazT(m.orta)+'</b><span class="tel-macDep">'+yazT(telKisaAd(m.dep))+'</span>';
  const baslik=' title="'+yazT(m.ev+' – '+m.dep+' · '+m.durum)+'"';
  return nitelik?'<button type="button" class="tel-mac" '+nitelik+baslik+'>'+ic+'</button>':'<div class="tel-mac"'+baslik+'>'+ic+'</div>';
}

/* H2-b (2026-10-26, kullanıcı isteği 6): maçın ayrıntısı — macAyrintisi çıktısı (js/mac-okuma.js), bizim maç ve öbür maçlar, canlı ya da kayıttan.
   Goller, Kartlar, Sakatlıklar iki sütunda (ev solda; her satırda dakika, ad, kartta renk kutucuğu); olay yoksa tek soluk satır; altında 10 satırlık
   tablo. Hükmende tek not. evKisa, depKisa: tablonun başlığı ve hükmen notunun adı */
const TEL_SAKAT_DERECE={tedavi:'tedavi gördü',cikis:'oyundan çıktı'};
function telMacAyrinti(A,evKisa,depKisa){
  if(!A)return'';
  if(A.hukmen)return'<div class="tel-ayrinti"><p class="tel-not">'+yazT(A.hukmen==='cift'?'İki takım da on bir uygun oyuncu çıkaramadı; maç oynanmadı (hükmen, TEST).'
    :(A.hukmen==='ev'?evKisa:depKisa)+' on bir uygun oyuncu çıkaramadı; maç hükmen (TEST).')+'</p></div>';
  const R=STIL.kagit.kartRenk,dk=x=>'<span class="tel-dk">'+x.dk+'\'</span>';
  const blok=(tur,baslik,L,yok,f)=>'<div class="tel-olaylar" data-tur="'+tur+'"><h6>'+baslik+'</h6>'+(L.length?'<div class="tel-olayIki">'+
    [0,1].map(t=>'<ul>'+L.filter(x=>x.t===t).map(x=>'<li class="tel-olay">'+dk(x)+f(x)+'</li>').join('')+'</ul>').join('')+'</div>':'<p class="tel-olayYok">'+yok+'</p>')+'</div>';
  return'<div class="tel-ayrinti">'+
    blok('gol','Goller',A.goller,'Gol yok.',g=>yazT(g.ad)+(g.kk?' <small>(k.k.)</small>':''))+
    blok('kart','Kartlar',A.kartlar,'Kart yok.',c=>'<i class="tel-kartRenk" style="background:'+(R[c.renk]||R.sari)+'" title="'+(c.renk==='sari'?'Sarı kart':c.renk==='ikinciSari'?'İkinci sarıdan kırmızı':'Kırmızı kart')+'"></i>'+yazT(c.ad))+
    blok('sakat','Sakatlıklar',A.sakat,'Sakatlık yok.',x=>yazT(x.ad)+' <small>'+(TEL_SAKAT_DERECE[x.derece]||'')+(x.gun>0?' · ~'+x.gun+' gün':'')+'</small>')+
    '<table class="tel-ist"><thead><tr><th>'+yazT(evKisa||'')+'</th><th></th><th>'+yazT(depKisa||'')+'</th></tr></thead><tbody>'+
      A.satirlar.map(r=>'<tr><td>'+yazT(r[1])+'</td><th scope="row">'+yazT(r[0])+'</th><td>'+yazT(r[2])+'</td></tr>').join('')+'</tbody></table></div>';
}
/* H2-b: dokunulur Canlı Skor satırının niteliği (T.skorAc açık satırın maç kimliği ya da null) */
const telSkorNitelik=(T,id)=>'data-eylem="skorAc" data-mac="'+yazT(id)+'" aria-expanded="'+(T.skorAc===id?'true':'false')+'"';

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
    /* bildirimler: yalnız okunmamış ya da cevap bekleyen konuşmalar (en çok dört). N14 (kullanıcı kararı 2026-10-18): maç gününün Canlı Skor kartı
       kalktı — ana ekranda skor “açık” görünüyordu; Canlı Skor yalnız uygulamasından açılır (odada ve maçta aynı) */
    const B=L.filter(c=>c.okunmamis>0||c.cevapBekliyor).slice(0,4).map(c=>{
      const son=c.mesajlar[c.mesajlar.length-1];
      return'<button type="button" class="tel-bildirim" data-eylem="telKisi" data-kisi="'+yazT(c.anahtar)+'">'+telSimge('mesajlar')+'<b>'+yazT(c.ad)+'</b><time>'+(son?yazT(telKisaAn(k,son.tarih,son.dakika)):'')+'</time>'+
        '<span>'+(c.cevapBekliyor?'<span class="tel-bekliyor">Cevap bekliyor</span> · ':'')+yazT(telOnizle(c))+'</span></button>';
    });
    const rozet=cevap?'<i class="tel-rozet">'+cevap+'</i>':okunmamis?'<i class="tel-rozet">'+okunmamis+'</i>':'';
    ic='<div class="tel-saatBlok"><p class="tel-tarih">'+(k?yazT(telGunAdi(k.tarih)+', '+gunAyYazi(k.tarih)):'Maç günü')+'</p><p class="tel-saat">'+yazT(saat)+'</p></div>'+
      '<div class="tel-bildirimler" aria-label="Bildirimler">'+B.join('')+'</div>'+
      '<div class="tel-sabit">'+
        '<button type="button" class="tel-uyg tel-uygMesaj" data-eylem="telUyg" data-uyg="mesajlar" aria-label="Mesajlar'+(cevap?', cevap bekleyen '+cevap:okunmamis?', okunmamış '+okunmamis:'')+'">'+telSimge('mesajlar',rozet)+'Mesajlar</button>'+
        '<button type="button" class="tel-uyg tel-uygSkor" data-eylem="telUyg" data-uyg="skor">'+telSimge('skor')+'Canlı Skor</button></div>';
  }else if(ekran==='mesajlar'){
    ic='<header class="tel-nav">'+geri('telEv','','Ana ekran')+'</header><h4 class="tel-buyukBaslik">Mesajlar</h4>';
    /* N14 (kullanıcı kararı 2026-10-18): konuşma yoksa liste boş kalır, boş durum yazısı yok (eskiden “Mesaj yok. Telefon sessiz.”) */
    if(L.length)ic+='<ul class="tel-liste">'+L.map(c=>{
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
      kararKarti(k,id,{onizle:(s.onizleler||{})[id]||null,ozetsiz:true,kapali:s.kapali||null,dosyaBaglanti:!s.macta,testSecenek:s.testSecenek})).join('')+'</div>';
  }else if(ekran==='skor'){
    ic='<header class="tel-nav">'+geri('telEv','','Ana ekran')+'</header><h4 class="tel-buyukBaslik">Canlı Skor</h4><div class="tel-skor">';
    if(M){
      /* H2-b: bizim maç ve santramızdan sonra öbür maçlar dokunulur; ayrıntı yalnız açık satır için (ev sahibi hesaplar: M.ayrinti, d.ayrinti) */
      ic+='<h5>Bugün</h5>'+telMacSatiri({sol:M.kisaDurum||M.durum,canli:!!M.canli,ev:M.ev,orta:M.skor,dep:M.dep,durum:M.durum},telSkorNitelik(T,M.id));
      if(T.skorAc===M.id&&M.ayrinti)ic+=telMacAyrinti(M.ayrinti,M.evKisa,M.depKisa);
      /* F7: haftanın öbür maçları, canlı */
      if(M.digerleri&&M.digerleri.length)ic+=M.digerleri.map(d=>telMacSatiri({sol:d.kisaDurum,canli:d.canli,ev:d.ev,orta:d.skor,dep:d.dep,durum:d.durum},d.dokunur?telSkorNitelik(T,d.macId):'')+
        (T.skorAc===d.macId&&d.ayrinti?telMacAyrinti(d.ayrinti,d.evKisa,d.depKisa):'')).join('');
    }else if(k){
      const mac=bekleyenIsler(k).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
      /* F1-b: takımlar fikstürden (maç günü işinin maç kimliği); eski kayıtta başlıktan */
      const f=mac&&k.fikstur&&k.fikstur.find(x=>x.id===mac.veri.macId);
      if(mac){const [ev,dep]=f?[k.kulupler[f.ev].ad,k.kulupler[f.konuk].ad]:mac.veri.baslik.replace(/^Maç: /,'').split(' – '),bugun=mac.tarih===k.tarih;
        ic+=(bugun?'<h5>Bugün</h5>':'<p class="tel-bos">Bugün maç yok.</p><h5>Sıradaki · '+yazT(telGunAdi(mac.tarih)+' '+gunAyYazi(mac.tarih))+'</h5>')+
          telMacSatiri({sol:saatYazi(mac.dakika),ev,orta:'–',dep:dep||'',durum:'başlamadı'});}
      else ic+='<p class="tel-bos">Yaklaşan maç yok.</p>';
      /* F2: kulübün son oynanan maçı (js/mac-sonuc.js kulubunSonMaci); F7'den beri haftanın öbür sonuçları da */
      const son=typeof kulubunSonMaci==='function'&&k.fikstur?kulubunSonMaci(k,(k.kisiler[k.baskanId]||{}).kulupId):null;
      /* H2-b: o haftanın bütün satırları dokunulur; ayrıntı kayıttan (js/mac-okuma.js macAyrintisi; adlar kariyerin oyuncularından, kısa kayıtta
         beklenen gol kayıttaki değer). Oynanmış son haftanın maçları; daha eski haftalar arasında gezinti yok (kullanıcıya soru, h2-uygulama) */
      const satir=f=>{const s=k.maclar[f.id],ac=T.skorAc===f.id;
        return telMacSatiri({sol:'Bitti',ev:k.kulupler[f.ev].ad,orta:s.skor[0]+' – '+s.skor[1],dep:k.kulupler[f.konuk].ad,durum:'bitti'},telSkorNitelik(T,f.id))+
          (ac&&typeof macAyrintisi==='function'?telMacAyrinti(macAyrintisi(s,id=>(k.oyuncular[id]||{}).ad),k.kulupler[f.ev].kisa||'',k.kulupler[f.konuk].kisa||''):'');};
      if(son)ic+='<h5>Son maç · '+yazT(son.f.hafta+'. hafta')+'</h5>'+satir(son.f);
      /* F7: o haftanın öbür sonuçları (ligin bütün maçları oynanır) */
      if(son){const D=k.fikstur.filter(x=>x.hafta===son.f.hafta&&x.id!==son.f.id&&k.maclar[x.id]);
        if(D.length)ic+='<h5>'+yazT(son.f.hafta+'. haftanın öbür sonuçları')+'</h5>'+D.map(x=>satir(x)).join('');}
    }
    ic+='</div>';
  }
  return'<div class="tel-yer"><div class="tel" data-ekran="'+ekran+'"><div class="tel-ekran" data-ekran="'+ekran+'"><i class="tel-ada" aria-hidden="true"></i>'+
    '<div class="tel-durum"><b>'+yazT(saat)+'</b><span aria-hidden="true"><span class="tel-sinyal"><i></i><i></i><i></i><i></i></span><span class="tel-pil"><i></i></span></span></div>'+
    '<div class="tel-govde'+(s.acilis?' tel-acilis':'')+'">'+ic+'</div>'+alt+
    '<div class="tel-alt"><button type="button" class="tel-ev" data-eylem="telEv" aria-label="Ana ekran" title="Ana ekran (Esc)"></button></div></div></div></div>';
}
