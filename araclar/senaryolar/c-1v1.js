/* ============ Gerçekçilik planı T4 senaryosu: bire bir (v2, 2026-10-08; T0'da ölçümdü) ============
   Boş sahada hücumcu (ev sahibi forvet) topla, savunmacı (konuk stoper) 6 m önünde; kaleler kalecili, diğer oyuncular sahada değil.
   Değişkenler: beceri farkı (hücumcunun sürüşü 0,6 + fark: 0,2 … 1,0; savunmacı 0,6) ve hücumcunun başlangıç hızı (0 / 3 / 6 m/sn). Deneme 6 sn'dir.
   T4 kararı (Claude, 2026-10-08): eksen yalnız hücumcunun sürüş becerisidir. Savunmacının müdahalesi de değişince istekli savunmacı daha çok kayarak
   giriyor ve faul modeli (T5) eğriyi bozuyordu; savunmacının okuması ve savunma kalitesi [4]'te ayrı ölçülür.
   Sonuç motorun 'calim' olayından (gecti / kayip / faul / disari / yarim); olay yoksa vazgeçti (yaklaşmanın sonunda tahmin düşüktü) ya da sonuçsuz.
   [1] Mekanik: hücumcu çalım niyetiyle sürer (p.surus.cal = {o}; hareketi ve yanı birebirTahmin seçer), karar katmanı kapalı. Kabul: geçme
       (denemeler içinde) %30–65; her beceri satırı %10–85; vazgeçme ≤ %25; beceri farkıyla artar (beş satırın doğrusal eğimi 0,8'lik aralıkta
       ≥ 15 puan, komşu satırlar arasında 5 puandan büyük düşüş yok; faulsüz eğri bilgi olarak yazılır).
   [2] Kalibrasyon: denemenin tahmini (yaklaşmanın sonundaki birebirTahmin P'si) ile gerçekleşen. Kabul: |ortalama P − başarı| ≤ 10 puan; Brier bilgi.
   [3] Karar açık: aynı kurulum, karar katmanı açık (rakibi geç kararı 'gec'; bilgi).
   [4] Savunmacı: okuması düşük ↔ yüksek savunmacı (karar ve görüş 0,3 ↔ 0,9). [4a] kabul: aldatılma oranı düşük okumada en az 1,5 kat.
       [4b] (T4d, 2026-10-08) arkada 3 m'de yardımcı savunmacı: "geçti" ilk adamın geçilmesidir, yardımcının işi sonra başlar; geçtikten sonra
       1,5 sn içinde top kaybı, yardımcının topu alması (kaçışta ya da geçildikten sonra) ve temiz geçiş (geçti ve 1,5 sn top bizde) ölçülür;
       payda düelloya giren her deneme. Kabul: temiz geçiş yardımsızın en çok 0,75 katı, yardımcı düellonun en az dörtte birinde topu alır. [4c] savunma kalitesi (müdahale, karar, görüş birlikte
       0,3 ↔ 0,9; bilgi: faul modeli T5'te).
   Kabul dışıysa çıkış kodu 1. Kullanım: node araclar/mac-deneme.js --senaryo c-1v1 [N=60 hücre başına; beceri etkisi 30'da gürültü içinde] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||60,dt=1/60,t0=Date.now();let cikis=0;
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const profilKur=vm.runInContext('profilKur',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,v)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:Math.cos(yon)*v,vz:Math.sin(yon)*v,spd:v,yon,eylem:null,kickCd:0,surus:null,kosu:null,oyunda:true,denge:1,calim:null,yutma:null});};
  /* bir deneme: fk beceri farkı, v0 hız, kip: 'zorla' (çalım niyeti) | 'karar' (karar katmanı açık), ok: savunmacının karar/görüş (null: kadro), yardim: arkada ikinci savunmacı */
  let deneme=0;
  const dene=(fk,v0,i,kip,ok,yardim,sk)=>{deneme++;let ol=null,gecSecildi=false,olT=0,kayipSonra=null,kim=null;
    /* kim: topu alan savunmacı (D ya da D2; olay anında ya da geçildikten sonra son dokunan) */
    const kimBul=()=>b.sonDokunan===D?'D':yardim&&b.sonDokunan===D2?'D2':b.sahip===D?'D':yardim&&b.sahip===D2?'D2':null;
    const m=kur((tohum||1)*1000+deneme,(ad,v)=>{if(ad==='calim'&&v&&v.p===A&&!ol){ol=v;olT=m.t;if(v.sonuc==='kayip')kim=kimBul();}else if(ad==='faul'&&!ol){ol={sonuc:'faul',P:null,yut:null,dis:true};olT=m.t;}});
    const A=m.teams[0][9],D=m.teams[1][3],D2=m.teams[1][2],b=m.ball,d=m.dir[0],hy=d>0?0:Math.PI;
    bosalt(m,yardim?[A,D,D2]:[A,D]);
    /* beceri farkı: hücumcunun sürüşü (savunmacı 0,6); ok: savunmacının okuması (karar, görüş); sk: savunma kalitesi (müdahale, karar, görüş) */
    A.oz.surus=0.6+fk;D.oz.mudahale=0.6;D.oz.karar=0.6;D.oz.gorus=0.6;if(ok!=null){D.oz.karar=ok;D.oz.gorus=ok;}if(sk!=null){D.oz.mudahale=sk;D.oz.karar=sk;D.oz.gorus=sk;}
    A._kutle=0;A._cev=null;D._kutle=0;D._cev=null;A._hk=undefined;D._hk=undefined;profilKur(A,m.tohum);profilKur(D,m.tohum);   /* T3: profil özellikten türetilir */
    const ax=d*18,az=34+(i%5-2)*3;yerlestir(A,ax,az,hy,v0);yerlestir(D,ax+d*6,az,hy+Math.PI,0);
    if(yardim)yerlestir(D2,ax+d*9,az+(i%2?1:-1)*1.5,hy+Math.PI,0);
    m.phase='play';m.phaseT=1;m.durus=null;
    Object.assign(b,{x:ax+d*0.45,z:az,y:0,vx:d*v0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:A});
    m.topDegisti();m.sahipYap(A);
    let vardi=false,ilkD=null;
    for(let k=0;k<60*6;k++){
      /* T4 (2): çalım niyeti yalnız olaya kadar zorlanır; geçtikten sonra hücumcu düz sürer (eskiden niyet yeniden kurulup geride kalan savunmacıya dönüyordu) */
      if(kip==='zorla'){A.kararT=99;if(!ol&&b.sahip===A&&(!A.surus||!A.surus.cal)&&!A.calim)A.surus={yon:hy,hiz:1,cal:{o:D}};}
      m.step(dt);if(A.calim){vardi=true;if(ilkD==null&&A.calim.faz>=1)ilkD=Math.hypot(D.x-A.x,D.z-A.z);}
      if(kip==='karar'&&A.surus&&A.surus.cal)gecSecildi=true;
      if(m.phase!=='play')break;
      if(!ol&&(b.sonDokunan===D||b.sahip===D||yardim&&(b.sonDokunan===D2||b.sahip===D2))){ol={sonuc:'kayip',P:null,yut:null,dis:true};kim=kimBul();break;}
      /* T4 (2): geçtikten sonra 1,5 sn izlenir — top rakibe geçerse (yardımcı dahil) "geçtikten sonra kayıp", geçmezse "temiz geçiş" */
      if(ol){if(ol.sonuc==='gecti'&&kayipSonra==null){if(b.sonTakim!==0||b.sahip&&b.sahip.team===1){kayipSonra=true;kim=kimBul();}else if(m.t-olT>=1.5)kayipSonra=false;}
        if(ol.sonuc!=='gecti'||kayipSonra!=null)break;}}
    const sonuc=ol?ol.sonuc:vardi?'vazgecti':'sonucsuz';
    return{sonuc,P:ol&&!ol.dis?ol.P:null,yut:ol?ol.yut:null,hareket:ol&&ol.hareket,deneme:!!ol&&!ol.dis,gecSecildi,ilkD,kayipSonra,kim};};
  const y=(a,c)=>c?(100*a/c).toFixed(0).padStart(4)+'%':'   —';
  /* [1] + [2] */
  const FARK=[-0.4,-0.2,0,0.2,0.4],HIZ=[0,3,6],T={},kal=[],HAR={};
  for(const fk of FARK)for(const v0 of HIZ){const h=T[fk+'|'+v0]={n:0,den:0,gecti:0,kayip:0,faul:0,disari:0,yarim:0,vazgecti:0,sonucsuz:0,Pt:0,Pn:0};
    for(let i=0;i<n;i++){const r=dene(fk,v0,i,'zorla',null,false);h.n++;h[r.sonuc]=(h[r.sonuc]||0)+1;
      if(r.sonuc!=='vazgecti'&&r.sonuc!=='sonucsuz')h.den++;
      if(r.P!=null){kal.push([r.P,r.sonuc==='gecti'?1:0]);h.Pt+=r.P;h.Pn++;}
      if(r.hareket){const t=HAR[r.hareket]||(HAR[r.hareket]=[0,0,0]);t[0]++;if(r.sonuc==='gecti')t[1]++;if(r.P!=null)t[2]+=r.P;}}}
  console.log(`\nT4 · bire bir · hücre başına ${n} deneme · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  console.log('\n[1] Mekanik (çalım niyeti; hareket ve yan birebirTahmin\'den)');
  console.log('  Beceri farkı  Başlangıç hızı    n  deneme   geçti   kayıp   faul  dışarı   yarım  vazgeçti  sonuçsuz  tahmin');
  const fo={},ff={};let topDen=0,topGec=0,topN=0,topVaz=0;
  for(const fk of FARK){fo[fk]=[0,0];ff[fk]=[0,0];for(const v0 of HIZ){const h=T[fk+'|'+v0];fo[fk][0]+=h.gecti;fo[fk][1]+=h.den;ff[fk][0]+=h.gecti;ff[fk][1]+=h.den-h.faul;topDen+=h.den;topGec+=h.gecti;topN+=h.n;topVaz+=h.vazgecti;
    console.log('  '+((fk>0?'+':'')+fk.toFixed(1)).padEnd(13)+(v0+' m/sn').padEnd(16)+String(h.n).padStart(5)+String(h.den).padStart(8)+y(h.gecti,h.den).padStart(8)+y(h.kayip,h.den).padStart(8)+y(h.faul,h.den).padStart(7)+y(h.disari,h.den).padStart(8)+y(h.yarim,h.den).padStart(8)+y(h.vazgecti,h.n).padStart(10)+y(h.sonucsuz,h.n).padStart(10)+y(h.Pt,h.Pn).padStart(8));}}
  const g=FARK.map(fk=>fo[fk][1]?100*fo[fk][0]/fo[fk][1]:0),gf=FARK.map(fk=>ff[fk][1]?100*ff[fk][0]/ff[fk][1]:0),hep=topDen?100*topGec/topDen:0,vaz=100*topVaz/topN;
  /* beceri etkisi: beş satırın doğrusal eğimi (0,8'lik aralık boyunca puan; uç satırlar tek başına gürültülü) */
  const egim=FARK.reduce((a,fk,i)=>a+fk*g[i],0)/FARK.reduce((a,fk)=>a+fk*fk,0)*0.8;
  const artar=egim>=15&&g.every((x,i)=>i===0||x>=g[i-1]-5),hucre=g.every(x=>x>=10&&x<=85),ok1=hep>=30&&hep<=65&&artar&&hucre&&vaz<=25;
  console.log('  Geçme (denemelerde) beceri farkına göre: '+FARK.map((fk,i)=>((fk>0?'+':'')+fk.toFixed(1))+' %'+g[i].toFixed(0)).join(' · ')+' · faulsüz: '+gf.map(x=>'%'+x.toFixed(0)).join(' · ')+' · hareketler: '+Object.keys(HAR).sort((a,b)=>HAR[b][0]-HAR[a][0]).map(k=>k+' '+HAR[k][0]+' (%'+(100*HAR[k][1]/HAR[k][0]).toFixed(0)+' · tahmin %'+(100*HAR[k][2]/HAR[k][0]).toFixed(0)+')').join(', '));
  console.log((ok1?'  ':'! ')+`[1] Kabul (T4): geçme %30–65 → %${hep.toFixed(1)}; beceri farkıyla ${artar?'artıyor':'ARTMIYOR'} (eğim ${egim.toFixed(1)} puan, ≥15); satırlar %10–85 ${hucre?'evet':'HAYIR'}; vazgeçme %${vaz.toFixed(1)} (≤25)`);
  if(!ok1)cikis=1;
  /* [2] kalibrasyon */
  const Pm=kal.length?kal.reduce((a,k)=>a+k[0],0)/kal.length:NaN,Gm=kal.length?kal.reduce((a,k)=>a+k[1],0)/kal.length:NaN,brier=kal.length?kal.reduce((a,k)=>a+(k[0]-k[1])**2,0)/kal.length:NaN;
  const kova=[[0,0.3],[0.3,0.5],[0.5,0.7],[0.7,1.01]].map(([a,b])=>{const L=kal.filter(k=>k[0]>=a&&k[0]<b);return L.length?`${a.toFixed(1)}–${Math.min(1,b).toFixed(1)}: tahmin %${(100*L.reduce((s,k)=>s+k[0],0)/L.length).toFixed(0)} · gerçek %${(100*L.reduce((s,k)=>s+k[1],0)/L.length).toFixed(0)} (${L.length})`:null;}).filter(Boolean);
  const ok2=kal.length>=30&&Math.abs(Pm-Gm)<=0.10;
  console.log('\n[2] Kalibrasyon (tahmin = yaklaşmanın sonundaki birebirTahmin)');
  console.log('  '+kova.join('  |  '));
  console.log((ok2?'  ':'! ')+`[2] Kabul (T4): |ort. tahmin − başarı| ≤ 10 puan → tahmin %${(100*Pm).toFixed(1)}, gerçek %${(100*Gm).toFixed(1)} (${kal.length} deneme) · Brier ${brier.toFixed(3)}`);
  if(!ok2)cikis=1;
  /* [3] karar açık */
  {let gs=0,den=0,gec=0;const N3=n;for(let i=0;i<N3;i++){const r=dene(0,3,i,'karar',null,false);if(r.gecSecildi)gs++;if(r.deneme){den++;if(r.sonuc==='gecti')gec++;}}
   console.log(`\n[3] Karar açık (beceri farkı 0, 3 m/sn; ${N3} deneme): "rakibi geç" seçildi %${(100*gs/N3).toFixed(0)} · çalım denemesi ${den} · geçme %${den?(100*gec/den).toFixed(0):'—'} (bilgi)`);}
  /* [4] savunmacı */
  /* T4 (2): payda [1]'deki gibi düelloya giren her deneme (olaysız biten kayıplar dahil; eskiden yalnız olaylı denemeler sayılıyor, yardımcının
     kaçışta aldığı toplar paydadan düşüyordu). ortu: yardımcının topu alması (düello sırasında ya da geçildikten sonra 1,5 sn içinde) */
  {const N4=n*2,say=(ok,yardim)=>{let yd=0,yy=0,den=0,gec=0,dS=0,dN=0,ks=0,tz=0,ortu=0;for(let i=0;i<N4;i++){const r=dene(0,3,i,'zorla',ok,yardim);if(r.yut!=null){yd++;if(r.yut)yy++;}
        if(r.sonuc!=='vazgecti'&&r.sonuc!=='sonucsuz'){den++;if(r.sonuc==='gecti'){gec++;if(r.kayipSonra===true)ks++;else if(r.kayipSonra===false)tz++;}if(r.kim==='D2')ortu++;}if(r.ilkD!=null){dS+=r.ilkD;dN++;}}
      return{yut:yd?yy/yd:NaN,yd,gec:den?gec/den:NaN,den,ilkD:dN?dS/dN:NaN,temiz:den?tz/den:NaN,kayipSonra:gec?ks/gec:NaN,ortu:den?ortu/den:NaN};};
   const dus=say(0.3,false),yuk=say(0.9,false),oran=dus.yut/Math.max(1e-6,yuk.yut),ok4=oran>=1.5&&dus.yd>=20&&yuk.yd>=20;
   console.log(`\n[4] Savunmacı (beceri farkı 0, 3 m/sn; ${N4} deneme)`);
   console.log(`  okuma düşük (karar/görüş 0,3): aldatıldı %${(100*dus.yut).toFixed(0)} (${dus.yd}) · geçme %${(100*dus.gec).toFixed(0)} (${dus.den})`);
   console.log(`  okuma yüksek (karar/görüş 0,9): aldatıldı %${(100*yuk.yut).toFixed(0)} (${yuk.yd}) · geçme %${(100*yuk.gec).toFixed(0)} (${yuk.den})`);
   console.log((ok4?'  ':'! ')+`[4a] Kabul (T4): aldatılma oranı düşük okumada ≥ 1,5 kat → ${oran.toFixed(2)} kat`);
   if(!ok4)cikis=1;
   const tek=say(null,false),yard=say(null,true);
   /* T4 (2): yardımcı 3 m arkada — "geçti" ilk adamın geçilmesidir (Opta), yardımcının işi ondan sonra başlar: kaçışta ya da geçildikten sonra
      1,5 sn içinde topu alması ve temiz geçiş (geçti ve 1,5 sn top bizde) ölçülür. Kabul: temiz geçiş yardımsızın en çok 0,75 katı; yardımcı
      düellonun en az dörtte birinde topu alır */
   const ok4b=yard.temiz<=0.75*tek.temiz&&yard.ortu>=0.25;
   console.log(`  yardımcı savunmacı yok → 3 m arkada: geçme %${(100*tek.gec).toFixed(0)} → %${(100*yard.gec).toFixed(0)} · geçtikten sonra 1,5 sn içinde kayıp %${(100*tek.kayipSonra).toFixed(0)} → %${(100*yard.kayipSonra).toFixed(0)} · temiz geçiş %${(100*tek.temiz).toFixed(0)} → %${(100*yard.temiz).toFixed(0)} · yardımcı topu aldı %${(100*yard.ortu).toFixed(0)} (${yard.den} deneme) · hazırlıkta uzaklık ${tek.ilkD.toFixed(2)} → ${yard.ilkD.toFixed(2)} m`);
   console.log((ok4b?'  ':'! ')+`[4b] Kabul (T4): yardımcıyla temiz geçiş ≤ 0,75 × yardımsız (${(100*yard.temiz).toFixed(0)} / ${(100*tek.temiz).toFixed(0)}) ve yardımcı topu alır ≥ %25 (%${(100*yard.ortu).toFixed(0)})`);
   if(!ok4b)cikis=1;
   const say2=sk=>{let den=0,gec=0,faul=0;for(let i=0;i<N4;i++){const r=dene(0,3,i,'zorla',null,false,sk);if(r.sonuc!=='vazgecti'&&r.sonuc!=='sonucsuz'){den++;if(r.sonuc==='gecti')gec++;if(r.sonuc==='faul')faul++;}}return{gec:den?gec/den:NaN,faul:den?faul/den:NaN};};
   const zayif=say2(0.3),iyi=say2(0.9);
   console.log(`  [4c] (bilgi; faul modeli T5) savunma kalitesi 0,3 → 0,9: geçme %${(100*zayif.gec).toFixed(0)} → %${(100*iyi.gec).toFixed(0)} · faulle biten %${(100*zayif.faul).toFixed(0)} → %${(100*iyi.faul).toFixed(0)}`);}
  return cikis;
}};
