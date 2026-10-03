/* ============ Chairman — ajanda: iki sayfalı açık defter (görüntü katmanı; yol haritası 2.8M) ============
   Kullanıcı kararı (2026-10-02): ajanda odanın ortasında açık bir spiral defter olarak açılır; oda arkada hafif kararır.
     Sol sayfa  ay ve hafta; haftanın yedi günü satır satır. Bugün kırmızı daireyle, seçili gün vurguyla işaretlenir; günde kayıt varsa nokta
                ve sayı, son tarih varsa "!", maç varsa top simgesi görünür. Hafta okları bu hafta ile en çok iki hafta sonrası arasında gezer.
                Altta yaklaşan gerçek son tarihler kısa hatırlatma olarak durur.
     Sağ sayfa  seçili günün tarihi ve 08–22 saat çizgileri; randevular saat aralığına yerleşmiş, mürekkep renginde bloklardır (süresiz kayıt
                ince çizgi). Bloğa tıklayınca altta kısa kart açılır: süre, kişi, durum, açıklama ve uygun eylem. Tamamlanan kaydın üstü çizilir.
                Boş gün boş sayfadır.
   Kasa, finans tablosu ve söz listesi ajandada yoktur (OYUN_TASARIMI §2). Kural içermez: satırlar js/ajanda.js ajandaGunu/yaklasanlar'dan gelir.
   defterGorunumu(k, D, Y) → html
     D: {gun: seçili tarih, hafta: 0–2, secili: iş kimliği, ayrinti(satir, bugunMu) → html}
     Y: {yaz, tarihYazi, tarihKisa}
   Renk ve ölçüler STIL.kagit.defter'dedir; stil belgeye buradan eklenir. */
const DEFTER_SAAT={bas:8,bit:22};            // sağ sayfadaki saat çizgileri (TEST değeri)
(function defterStili(){
  if(typeof document==='undefined'||document.getElementById('defterStili'))return;
  const F=STIL.kagit.defter,st=document.createElement('style');st.id='defterStili';
  st.textContent=`
.dft{position:absolute;z-index:1;left:17%;right:2.2%;top:2.9em;bottom:5.4em;display:grid}
.dft-kapak{position:relative;min-height:0;display:grid;padding:.55em;background:${F.kapak};border-radius:.5em;box-shadow:.4em .55em 0 var(--k-golge)}
.dft-sayfalar{min-height:0;display:grid;grid-template-columns:minmax(0,.9fr) 1.6em minmax(0,1.25fr)}
.dft-sayfa{min-height:0;overflow-y:auto;background:${F.sayfa};padding:.8em 1em .9em;display:grid;gap:.5em;align-content:start}
.dft-sol{border-radius:.25em 0 0 .25em;box-shadow:inset -.7em 0 .9em -.8em rgba(40,30,10,.35)}
.dft-sag{border-radius:0 .25em .25em 0;box-shadow:inset .7em 0 .9em -.8em rgba(40,30,10,.35)}
.dft-spiral{background:${F.sayfa};background-image:radial-gradient(circle at 50% 50%,${F.spiral} 0 .28em,transparent .3em),linear-gradient(90deg,rgba(40,30,10,.25),transparent 30%,transparent 70%,rgba(40,30,10,.25));
  background-size:100% 1.4em,100% 100%}
.dft-ust{display:flex;align-items:baseline;justify-content:space-between;gap:.6em;padding-bottom:.2em;border-bottom:.14em solid ${F.kurdele}}
.oda .dft-ust .od-kapat{font-size:.85em;align-self:center}
.dft-ust b{font-family:var(--display);font-weight:400;font-size:1.9em;line-height:1;letter-spacing:.04em;color:var(--k-yazi)}
.dft-ust small{color:var(--k-soluk);letter-spacing:.08em;text-transform:uppercase;font-size:.82em}
.dft-oklar{display:flex;gap:.25em}
.oda .dft-oklar button{padding:.05em .45em;font-size:.9em}
.dft-gunler{list-style:none;margin:0;padding:0;display:grid}
.oda .dft button.dft-gun{display:grid;grid-template-columns:2.6em 2.1em minmax(0,1fr);align-items:center;gap:.4em;width:100%;min-height:2.6em;padding:.2em .3em;text-align:left;
  background:transparent;border:0;border-bottom:1px solid ${F.cizgi};border-radius:0;color:var(--k-yazi)}
.oda .dft button.dft-gun[aria-pressed="true"]{background:${F.secili}}
.dft-gunAd{color:var(--k-soluk);text-transform:uppercase;font-size:.86em;letter-spacing:.06em}
.dft-gunNo{font-family:var(--display);font-size:1.55em;line-height:1;justify-self:center;display:grid;place-items:center;width:1.6em;height:1.6em}
.dft-bugun .dft-gunNo{border:.13em solid ${F.kurdele};border-radius:50% 45% 50% 40%;color:${F.kurdele};transform:rotate(-6deg)}
.dft-gecmis .dft-gunAd,.dft-gecmis .dft-gunNo{opacity:.55}
.dft-isaret{display:flex;gap:.45em;align-items:center;justify-content:flex-end;font-size:.88em;color:${F.murekkep}}
.dft-isaret .dft-son{color:var(--k-kirmizi);font-weight:600}
.dft-mac{font-style:normal;font-size:.8em;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:var(--k-kirmizi);padding:.05em .4em;border-radius:.2em}
.dft-hatir{display:grid;gap:.15em;font-size:.86em;color:var(--k-soluk)}
.dft-hatir b{color:var(--k-kirmizi);font-weight:600}
.dft-saatler{position:relative;height:calc(${DEFTER_SAAT.bit-DEFTER_SAAT.bas} * 1.35em);margin:.5em 0 .3em 2.9em;border-left:1px solid ${F.kurdele}}
.dft-saatCizgi{position:absolute;left:-.4em;right:0;border-top:1px solid ${F.cizgi}}
.dft-saat{position:absolute;left:-2.9em;width:2.4em;text-align:right;font-size:.8em;color:var(--k-soluk);transform:translateY(-.55em)}
.oda .dft button.dft-kayit{position:absolute;left:calc(.4em + var(--sutun,0) * var(--gen,100%));width:calc(var(--gen,100%) - .6em);min-height:1.3em;overflow:hidden;
  display:block;padding:.05em .45em;text-align:left;font-style:italic;font-size:.94em;line-height:1.25;color:${F.murekkep};
  background:${F.kayit};border:1px solid ${F.kayitCizgi};border-left:.25em solid ${F.murekkep};border-radius:.15em}
.oda .dft button.dft-kayit.dft-zorunlu{border-left-color:var(--k-kirmizi)}
.oda .dft button.dft-kayit.dft-bitti{text-decoration:line-through;opacity:.6}
.oda .dft button.dft-kayit[aria-pressed="true"]{background:var(--k-vurguZemin);color:#1a1203;border-color:var(--k-vurgu)}
.dft-cizgi{position:absolute;left:.4em;right:.2em;font-size:.82em;color:${F.murekkep};border-top:1px dashed ${F.murekkep};padding-left:.3em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dft-simdi{position:absolute;left:-.3em;right:0;border-top:.14em solid var(--k-kirmizi)}
.dft-bos{position:absolute;top:35%;left:0;right:0;text-align:center;font-style:italic;color:var(--k-soluk)}
.dft-ayrinti{display:grid;gap:.4em;padding:.6em .7em;background:${F.kart};border:1px solid ${F.cizgi};box-shadow:.15em .2em 0 rgba(40,30,10,.15)}
.dft-ayrinti h4{margin:0;display:flex;flex-wrap:wrap;gap:.2em .6em;align-items:baseline;font-size:1em}
`;
  document.head.appendChild(st);
})();

function defterGorunumu(k,D,Y){
  const yaz=Y.yaz,AY=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const GUN=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
  const p=t=>t.split('-').map(Number),hg=t=>{const [y,a,g]=p(t);return new Date(Date.UTC(y,a-1,g)).getUTCDay();};
  /* haftanın pazartesisi ve ISO hafta numarası */
  const pazartesi=t=>tarihEkle(t,-((hg(t)+6)%7));
  const isoHafta=t=>{const [y,a,g]=p(t),d=new Date(Date.UTC(y,a-1,g)),n=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-n+3);
    const ilk=new Date(Date.UTC(d.getUTCFullYear(),0,4));return 1+Math.round(((d-ilk)/86400000-3+((ilk.getUTCDay()+6)%7))/7);};
  const bas=tarihEkle(pazartesi(k.tarih),7*D.hafta),gunler=[0,1,2,3,4,5,6].map(n=>tarihEkle(bas,n));
  const satirlar=t=>ajandaGunu(k,t);
  /* sol sayfa: hafta */
  let sol='<header class="dft-ust"><span><b>'+yaz(AY[p(bas)[1]-1])+'</b> <small>'+isoHafta(bas)+'. hafta</small></span><span class="dft-oklar">'+
    '<button type="button" data-eylem="hafta" data-hafta="'+(D.hafta-1)+'"'+(D.hafta<=0?' disabled':'')+' aria-label="Önceki hafta">◂</button>'+
    '<button type="button" data-eylem="hafta" data-hafta="'+(D.hafta+1)+'"'+(D.hafta>=2?' disabled':'')+' aria-label="Sonraki hafta">▸</button></span></header>';
  sol+='<ol class="dft-gunler">'+gunler.map(t=>{
    const R=satirlar(t),ajanda=R.filter(r=>r.tur==='ajanda'),bekleyen=ajanda.filter(r=>r.durum==='bekliyor'&&!r.eylem);
    const mac=R.some(r=>r.eylem==='macGunu'),son=Object.values(k.isler).some(x=>x.tur==='ajanda'&&!isGizli(x)&&x.tarih===t&&(x.veri.saatsiz||(x.veri.sonTarih===t))),odeme=R.some(r=>r.tur==='odeme');
    const sinif=(t===k.tarih?' dft-bugun':'')+(tarihKarsilastir(t,k.tarih)<0?' dft-gecmis':'');
    const isaret=(bekleyen.length?'<span title="bekleyen randevu">● '+bekleyen.length+'</span>':'')+(son?'<span class="dft-son" title="son tarih">!</span>':'')+
      (odeme?'<span title="ödeme">₺</span>':'')+(mac?'<i class="dft-mac">Maç</i>':'');
    const [,,g]=p(t);
    return'<li><button type="button" class="dft-gun'+sinif+'" data-eylem="gun" data-tarih="'+t+'" aria-pressed="'+(t===D.gun?'true':'false')+'"><span class="dft-gunAd">'+GUN[hg(t)]+'</span>'+
      '<span class="dft-gunNo">'+g+'</span><span class="dft-isaret">'+isaret+'</span></button></li>';
  }).join('')+'</ol>';
  const H=yaklasanlar(k,14).filter(x=>x.tur==='ajanda'&&(x.veri.saatsiz||x.veri.zorunluluk==='zorunlu'||x.veri.sonTarih)).slice(0,3);
  if(H.length)sol+='<div class="dft-hatir"><span>Yaklaşan</span>'+H.map(x=>'<span><b>'+yaz(Y.tarihKisa(x.veri.sonTarih&&!x.veri.saatsiz?x.veri.sonTarih:x.tarih))+'</b> '+
    (x.veri.saatsiz?'son cevap · ':x.veri.sonTarih?'en geç · ':saatYazi(x.dakika)+' · ')+yaz(x.veri.baslik)+'</span>').join('')+'</div>';
  /* sağ sayfa: seçili günün saatleri */
  /* sağ sayfa yalnız takvim kayıtlarını yazar: gelen haberler (gelişmeler) telefonda ve dosyadadır */
  const bugunMu=D.gun===k.tarih,R=satirlar(D.gun).filter(r=>r.tur!=='gelisme'),toplam=(DEFTER_SAAT.bit-DEFTER_SAAT.bas)*60;
  const y=dk=>Math.max(0,Math.min(toplam,dk-DEFTER_SAAT.bas*60))/toplam*100;
  let sag='<header class="dft-ust"><span><b>'+yaz(Y.tarihYazi(D.gun))+'</b>'+(bugunMu?' <small>bugün</small>':'')+'</span><button type="button" class="od-kapat" data-eylem="kapat" title="Kapat (Esc)">Kapat ×</button></header><div class="dft-saatler">';
  for(let s=DEFTER_SAAT.bas;s<=DEFTER_SAAT.bit;s++)sag+='<i class="dft-saatCizgi" style="top:'+y(s*60).toFixed(2)+'%"></i>'+(s%2===0?'<span class="dft-saat" style="top:'+y(s*60).toFixed(2)+'%">'+String(s).padStart(2,'0')+':00</span>':'');
  /* bloklar: süreli ajanda kayıtları; çakışanlar yan yana sütunlara ayrılır */
  const bloklar=R.filter(r=>r.tur==='ajanda'&&r.sure>0).map(r=>({r,b:r.saat,s:r.saat+r.sure})).sort((a,b)=>a.b-b.b);
  const kume=[];for(const x of bloklar){const c=kume[kume.length-1];if(c&&x.b<c.son){c.L.push(x);c.son=Math.max(c.son,x.s);}else kume.push({L:[x],son:x.s});}
  for(const c of kume){const sut=[];for(const x of c.L){let i=sut.findIndex(e=>e<=x.b);if(i<0){i=sut.length;sut.push(0);}sut[i]=x.s;x.sutun=i;}c.n=sut.length;}
  for(const c of kume)for(const x of c.L){
    const r=x.r,bitti=r.durum!=='bekliyor',sec=r.id===D.secili;
    sag+='<button type="button" class="dft-kayit'+(r.zorunluluk==='zorunlu'?' dft-zorunlu':'')+(bitti?' dft-bitti':'')+'" data-is="'+r.id+'" aria-pressed="'+(sec?'true':'false')+'" style="top:'+y(x.b).toFixed(2)+'%;height:'+Math.max(3.5,y(x.s)-y(x.b)).toFixed(2)+'%;--sutun:'+x.sutun+';--gen:'+(100/c.n).toFixed(2)+'%">'+
      saatYazi(r.saat)+' '+yaz(r.baslik)+'</button>';
  }
  /* süresiz kayıtlar (maç, ödeme, saati serbest karar, tamamlanan rutin) ince çizgidir; ajanda kaydıysa seçilebilir */
  for(const r of R.filter(r=>!(r.tur==='ajanda'&&r.sure>0))){
    const ad=(r.eylem==='macGunu'?'':r.tur==='odeme'?'₺ ':r.karar?'? ':'')+r.baslik+(r.tutar!==undefined?' '+paraYazi(r.tutar).replace(/,\d\d ₺$/,' ₺'):'');
    if(r.tur==='ajanda')sag+='<button type="button" class="dft-kayit'+(r.zorunluluk==='zorunlu'?' dft-zorunlu':'')+(r.durum!=='bekliyor'?' dft-bitti':'')+'" data-is="'+r.id+'" aria-pressed="'+(r.id===D.secili?'true':'false')+
      '" style="top:'+y(r.saat).toFixed(2)+'%;height:3.5%">'+(r.saatsiz?'şimdi':saatYazi(r.saat))+' '+yaz(ad)+'</button>';
    else sag+='<span class="dft-cizgi" style="top:'+y(r.saat).toFixed(2)+'%">'+saatYazi(r.saat)+' '+yaz(ad)+'</span>';
  }
  if(bugunMu)sag+='<span class="dft-simdi" style="top:'+y(k.gunIciDakika).toFixed(2)+'%" title="şimdi"></span>';
  if(!R.length)sag+='<p class="dft-bos">Boş gün.</p>';
  sag+='</div>';
  const s=R.find(r=>r.id===D.secili&&r.tur==='ajanda');
  if(s)sag+=D.ayrinti(s,bugunMu);
  return'<div class="dft" role="dialog" aria-label="Ajanda"><div class="dft-kapak"><div class="dft-sayfalar">'+
    '<section class="dft-sayfa dft-sol">'+sol+'</section><div class="dft-spiral" aria-hidden="true"></div><section class="dft-sayfa dft-sag">'+sag+'</section></div></div></div>';
}
