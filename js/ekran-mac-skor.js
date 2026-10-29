/* ============ Chairman — 2D maçta köşe skoru (görüntü katmanı; U5, 2026-10-28; kullanıcı tercihi 9) ============
   Tepeden 2D maçta (js/pul.js pulTepe) karenin sol üst köşesinde küçük kâğıt etiket: iki kulübün kısa adı forma rengiyle ve küçük armasıyla (R3),
   skor ve dakika (“DEM 1–0 AKD · 34'”); devrede “Devre”, sonunda “Bitti”. Maç öncesinde, bültende, figürlü loca bakışında ve “Maç hesaplanıyor” perdesinde
   görünmez. Motoru yalnız okur; kendi kare döngüsü yalnız yazı değişince DOM'a dokunur. Renkler STIL.kagit, ölçek ortak yazı ölçeği. */
{
  const ekran=document.getElementById('screen');
  if(ekran&&typeof mac!=='undefined'&&typeof MAC_GUNU!=='undefined'){
    const K=STIL.kagit,st=document.createElement('style');st.id='macSkorStili';
    st.textContent=`
.mac-skor{position:absolute;z-index:4;top:2.2%;left:1.6%;display:flex;align-items:center;gap:.45em;padding:.2em .6em .15em;font-family:var(--govde);font-size:var(--k-yaziBoyu,max(14px,1.5cqw));
  font-weight:600;font-variant-numeric:tabular-nums;color:${K.yazi};background:${K.serit};border:1px solid ${K.cizgi};border-left:.25em solid ${K.kulup};box-shadow:.15em .2em 0 rgba(0,0,0,.35);pointer-events:none}
.mac-skor[hidden]{display:none}
.mac-skor i.mk-forma{display:inline-block;width:.55em;height:.85em;border:1px solid rgba(0,0,0,.35);border-radius:.1em}
.mac-skor b{font-family:var(--display);font-weight:400;font-size:1.35em;line-height:1}
.mac-skor small{color:${K.soluk};font-size:max(var(--k-enKucuk,12px),.9em)}
`;
    document.head.appendChild(st);
    const E=document.createElement('div');E.className='mac-skor';E.id='macSkor';E.hidden=true;E.setAttribute('aria-hidden','true');   /* U7 incelemesi: canlı bölge değil (her dakika konuşmasın); skor tabelada ve maç telefonunda okunur */
    ekran.appendChild(E);
    const kisa=t=>{const d=MAC_GUNU.kadro&&MAC_GUNU.kadro[t];return d?(d.kisa||String(d.ad||'').slice(0,3).toLocaleUpperCase('tr-TR')):(t?'DEP':'EV');};
    /* R3: forma rengi kutusu sahadaki pulları tanıtır (kalır); yanında kulübün küçük arması (js/arma.js) */
    const arma=t=>{const d=MAC_GUNU.kadro&&MAC_GUNU.kadro[t];return d&&d.id&&typeof armaSvg==='function'?armaSvg(d.id,'kucuk',d.kisa||null):'';};
    const renk=t=>{const d=MAC_GUNU.kadro&&MAC_GUNU.kadro[t],f=d&&STIL.formalar&&STIL.formalar[d.forma];return f?f.shirt:K.cizgi;};
    let son=null;
    const kare=()=>{
      const H=typeof HIZLI_BITIR!=='undefined'?HIZLI_BITIR:{},once=typeof MAC_ONCESI!=='undefined'&&MAC_ONCESI.includes(mac.phase);
      const gorunur=typeof pulTepe==='function'&&pulTepe()&&!(typeof ON_EKRAN!=='undefined'&&ON_EKRAN.acik)&&!once&&!H.perde&&!(typeof MAC_SONU!=='undefined'&&MAC_SONU.acik);
      if(E.hidden===gorunur){E.hidden=!gorunur;if(gorunur&&typeof yaziBoyuDegeri==='function')E.style.setProperty('--k-yaziBoyu',yaziBoyuDegeri());}
      if(gorunur){
        const s=mac.score||[0,0],d=mac.phase==='halftime'?'Devre':mac.phase==='fulltime'?'Bitti':mac.minuteLabel()+'\'';
        const y=kisa(0)+'|'+s[0]+'|'+s[1]+'|'+kisa(1)+'|'+d;
        if(y!==son){son=y;E.innerHTML='<i class="mk-forma" style="background:'+renk(0)+'"></i>'+arma(0)+kisa(0)+' <b>'+s[0]+'–'+s[1]+'</b> '+kisa(1)+arma(1)+'<i class="mk-forma" style="background:'+renk(1)+'"></i><small>'+d+'</small>';}
      }
      requestAnimationFrame(kare);
    };
    requestAnimationFrame(kare);
  }
}
