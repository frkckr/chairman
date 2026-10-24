/* ============ Gerçekçilik planı T10 senaryosu: sakatlık ve tedavi (o-sakatlik; T10c, 2026-10-11) ============
   [1] Şiddet → derece: temaslı düşüşte (sakatlikTemas, rakip kaynaklı 'faul') şiddet 0,2 / 0,5 / 0,8 / 1,0 için N zar — sakatlık olasılığı ve
       sakatlıkta çıkış payı şiddetle artar (monoton).
   [2] Kramp yalnız yorgunlukta: 75. dakikada koşan (4 m/sn) oyuncularda yorgunluk 0,2 ve 0,85 ile sakatlikAdim'in temassız zarı (N × 22 oyuncu ×
       60 adım) — yorgunluk 0,2'de kramp 0, 0,85'te > 0.
   [3] Tedavi akışı (oyun sürerken, 40 deneme): orta saha oyuncusu 'tedavi' derecesiyle yere düşer → hakem atağın bitmesini bekler (en çok 12 sn)
       ve durdurur (hakem topu topu son oynayan takıma; ceza sahasında kaleciye) → sağlıkçılar → tedavi → oyuncu kenara → oyun başlar → hakemin
       işaretiyle döner. Kabul: hepsinde akış biter, bekleme (sakatlıktan oyunun durmasına) ≤ 12,5 sn, duraklama (oyunun durmasından yeniden
       başlamasına) 15–35 sn (≥ %90), oyuncu dönmeden önce takım 10 kişi, döndükten sonra 11 (≥ %90).
   [4] Çıkış akışı (40 deneme): hakem 1 sn'de durdurur → sedye → değişiklik (yedek girer, olay oyuncuGirdi sakatlik); bekleme ≤ 1,5 sn,
       duraklama 20–45 sn; takım yine 11.
   [5] Çıkış, hak yok: takımın 5 değişikliği kullanılmış → takım 10 kişi kalır.
   [6] Kaleci çıkışı: hak varsa yedek kaleci girer; hak yoksa bir saha oyuncusu kaleye geçer (kaleyeGecti).
   [7] Kaleci tedavisi: sahada tedavi edilir, yerinde kalır (takım 11).
   Çıkış kodu 1: kabul dışı. Kullanım: node araclar/mac-deneme.js --senaryo o-sakatlik [N=40] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||40,dt=1/60,t0=Date.now();let kabulDisi=0;
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const kapi=(ok,metin)=>{if(!ok)kabulDisi++;console.log((ok?'  ':'! ')+'Kapı: '+metin);};
  const yz=(a,c)=>c?(100*a/c).toFixed(1)+'%':'—';
  console.log(`\nT10 · o-sakatlik (sakatlık ve tedavi)`);
  /* [1] şiddet → derece */
  /* G1-c (2026-10-24): çıkış payı yarıya indi (sakatCikisPay 0,5); 10 × N denemede şiddet başına ~5 çıkış kaldı ve 3 puanlık tolerans gürültüye
     yenildi (400 denemede 1,0 şiddette %6,4 < 0,8'de %10,5; 2000 denemede tekdüze) → deneme sayısı 50 × N */
  const Z1=50;
  {const S=[0.2,0.5,0.8,1.0],R=[];
    for(const s of S){let sak=0,cik=0,ted=0;
      for(let i=0;i<n*Z1;i++){const m=kur((tohum||1)*100000+i*7+Math.round(s*10),()=>{});const p=m.teams[0][7],k=m.teams[1][6];
        const L=m.kayit.sakatliklar.length;m.sakatlikTemas(p,s,'faul',k);const yeni=m.kayit.sakatliklar.slice(L);
        if(yeni.length){sak++;if(yeni[0].derece==='cikis')cik++;else if(yeni[0].derece==='tedavi')ted++;}}
      R.push({s,P:sak/(n*Z1),C:sak?cik/sak:0,T:sak?ted/sak:0});
      console.log(`  [1] şiddet ${s.toFixed(1)}: sakatlık ${yz(sak,n*Z1)} · çıkış payı ${yz(cik,sak)} · tedavi payı ${yz(ted,sak)}`);}
    let mono=true;for(let i=1;i<R.length;i++)if(R[i].P<R[i-1].P||R[i].C<R[i-1].C-0.03)mono=false;
    kapi(mono,'[1] sakatlık olasılığı ve çıkış payı şiddetle artar');}
  /* [2] kramp yalnız yorgunlukta */
  {const sayac={};
    for(const y of[0.2,0.85]){let kr=0;
      for(let i=0;i<n;i++){const m=kur((tohum||1)*200000+i,()=>{});m.half=2;m.gameSec=4500;m.phase='play';
        for(let a=0;a<60;a++){for(const p of m.players){if(!p.oyunda||p.rol==='GK')continue;p.yorgunluk=y;p.spd=4;p.vx=4;p.vz=0;}
          m.kare=(Math.floor((m.kare||0)/6)+1)*6;const L=m.kayit.sakatliklar.length;m.sakatlikAdim(dt);
          for(const s of m.kayit.sakatliklar.slice(L))if(s.tur==='kramp')kr++;
          for(const p of m.players){p.sakat=null;p.eylem=null;}m.sakatlikSira.length=0;}}
      sayac[y]=kr;console.log(`  [2] yorgunluk ${y}: kramp ${kr} (${n} maç × 60 deneme)`);}
    kapi(sayac[0.2]===0&&sayac[0.85]>0,'[2] kramp yalnız yorgunlukta (0,2 → 0; 0,85 → > 0)');}
  /* akış denemesi: oyun sürerken p'ye sakatlık verilir; sakatlıktan oyunun yeniden başlamasına süre, son durum */
  const akis=(tohumN,secici,derece,hazirla)=>{
    const ol={hakemTopu:null,girdi:null,dondu:null,kaleyeGecti:false};let m=null;
    m=kur(tohumN,(ad,v)=>{if(!m)return;if(ad==='hakemTopu')ol.hakemTopu=v;else if(ad==='oyuncuGirdi')ol.girdi=v;else if(ad==='oyunaDondu')ol.dondu=m.t;else if(ad==='kaleyeGecti')ol.kaleyeGecti=true;});
    for(let a=0;a<60*20&&m.phase!=='play';a++)m.step(dt);
    for(let a=0;a<60*4;a++)m.step(dt);   /* oyun otursun */
    if(m.phase!=='play')return null;
    const p=secici(m),t=p.team;if(hazirla)hazirla(m,p);
    const tS=m.t;m.sakatlikBaslat(p,'temas','diz',derece);
    let tBas=null,on=null,donus=null,durdu=false,tDur=null;
    for(let a=0;a<60*90;a++){m.step(dt);
      /* oyun durdu (hakem topu, top dışarıda ya da faul) ve yeniden başladı: duraklamanın sonu */
      if(!durdu&&m.phase!=='play'){durdu=true;tDur=m.t;}
      if(tBas==null&&durdu&&m.phase==='play'){tBas=m.t;on=m.teams[t].filter(q=>q.oyunda).length;}
      if(!m.sakatlikAkis&&!m.sakatlikSira.length&&tBas!=null&&(derece!=='tedavi'||ol.dondu!=null||p.rol==='GK')){donus=m.teams[t].filter(q=>q.oyunda).length;break;}}
    return{sure:tBas!=null?tBas-tDur:null,bekle:tDur!=null?tDur-tS:null,onDonus:on,son:donus!=null?donus:m.teams[t].filter(q=>q.oyunda).length,ol,bitti:!m.sakatlikAkis,p,m,
      iz:m.sakatlikAkis?`evre ${m.sakatlikAkis.evre} · faz ${m.phase} · don ${m.sakatlikAkis.don!=null?(m.sakatlikAkis.don-m.t).toFixed(1):'—'} · topa ${Math.hypot(m.ball.x-p.x,m.ball.z-p.z).toFixed(1)} m`+
        (m.durus?` · duruş ${m.durus.tur}/${m.durus.sinif||'-'} aşama ${m.durus.asama} t ${m.durus.t.toFixed(1)} kullanan ${m.durus.kullanan?m.durus.kullanan.name+(m.durus.kullanan.oyunda?'':' (oyunda değil)'):'yok'} · değişiklik ${m.degisiklik?'sürüyor':'yok'} · bekletir ${m.sakatlikBekletir()}`:''):null};};
  const ozet=(ad,L,altS,ustS)=>{const G=L.filter(Boolean),S=G.map(o=>o.sure).filter(x=>x!=null).sort((a,b)=>a-b),ort=S.length?S[Math.floor(S.length/2)]:NaN;
    const ic=S.filter(x=>x>=altS&&x<=ustS).length,B=G.map(o=>o.bekle).filter(x=>x!=null).sort((a,b)=>a-b),bm=B.length?B[B.length-1]:NaN;
    console.log(`  ${ad}: ${G.length} deneme · akış bitti ${G.filter(o=>o.bitti).length} · hakem topu ${G.filter(o=>o.ol.hakemTopu).length} · bekleme ortanca ${B.length?B[B.length>>1].toFixed(1):'—'}, en çok ${Number.isNaN(bm)?'—':bm.toFixed(1)} sn · duraklama ortanca ${Number.isNaN(ort)?'—':ort.toFixed(1)} sn (${altS}–${ustS} sn içinde ${ic}/${S.length})`);
    return{G,S,ic,bm};};
  const orta=m=>m.teams[0][7];
  /* [3] tedavi */
  {const L=[];for(let i=0;i<n;i++)L.push(akis((tohum||1)*300000+i,orta,'tedavi'));const o=ozet('[3] tedavi',L,15,35);
    const on10=o.G.filter(x=>x.onDonus===10).length,son11=o.G.filter(x=>x.son===11).length;
    console.log(`      oyun başlarken takım 10 kişi ${on10}/${o.G.length} · dönüşten sonra 11 kişi ${son11}/${o.G.length}`);
    for(const x of o.G)if(!x.bitti)console.log(`      bitmeyen: ${x.iz}`);
    if(process.env.SENARYO_AYRINTI)for(const x of o.G)if(x.onDonus!==10||x.son!==11)console.log(`      ayrık: başlarken ${x.onDonus} · sonra ${x.son} · bekleme ${x.bekle!=null?x.bekle.toFixed(1):'—'} · duraklama ${x.sure!=null?x.sure.toFixed(1):'—'} · hakem topu ${!!x.ol.hakemTopu} · döndü ${x.ol.dondu!=null}`);
    kapi(o.G.length>=n*0.9&&o.G.every(x=>x.bitti)&&o.bm<=12.5&&o.ic>=o.S.length*0.9&&on10>=o.G.length*0.9&&son11>=o.G.length*0.9,'[3] tedavi: akış biter, bekleme ≤ 12,5 sn, duraklama 15–35 sn (≥ %90; T10 kararı 20–30 sn), oyuncu kenardayken 10, dönünce 11');}
  /* [4] çıkış, değişiklik */
  {const L=[];for(let i=0;i<n;i++)L.push(akis((tohum||1)*400000+i,orta,'cikis'));const o=ozet('[4] çıkış (değişiklik)',L,20,45);
    const deg=o.G.filter(x=>x.ol.girdi&&x.ol.girdi.cikan===x.p).length,son11=o.G.filter(x=>x.son===11).length;
    console.log(`      sakatın yerine yedek girdi ${deg}/${o.G.length} · sonra 11 kişi ${son11}/${o.G.length}`);
    kapi(o.G.length>=n*0.9&&deg>=o.G.length*0.9&&son11>=o.G.length*0.9&&o.bm<=1.5&&o.ic>=o.S.length*0.9,'[4] çıkış: hakem 1 sn içinde durdurur, sedye ve değişiklik, duraklama 20–45 sn (≥ %90), takım 11');}
  /* [5] çıkış, hak yok */
  {const L=[];for(let i=0;i<Math.ceil(n/4);i++)L.push(akis((tohum||1)*500000+i,orta,'cikis',(m,p)=>{m.ist.degisiklik[p.team]=5;}));const G=L.filter(Boolean);
    const on=G.filter(x=>x.son===10).length;console.log(`  [5] çıkış, hak yok: ${G.length} deneme · takım 10 kişi ${on}/${G.length}`);
    kapi(G.length>0&&on===G.length,'[5] hak yokken takım eksik (10) kalır');}
  /* [6] kaleci çıkışı */
  {const gk=m=>m.teams[0][0];
    const A=[];for(let i=0;i<Math.ceil(n/4);i++)A.push(akis((tohum||1)*600000+i,gk,'cikis'));const GA=A.filter(Boolean);
    const yk=GA.filter(x=>x.ol.girdi&&x.ol.girdi.giren.rol==='GK').length;
    const B=[];for(let i=0;i<Math.ceil(n/4);i++)B.push(akis((tohum||1)*700000+i,gk,'cikis',(m,p)=>{m.ist.degisiklik[p.team]=5;}));const GB=B.filter(Boolean);
    const kg=GB.filter(x=>x.ol.kaleyeGecti).length;
    console.log(`  [6] kaleci çıkışı: hak varken yedek kaleci girdi ${yk}/${GA.length} · hak yokken saha oyuncusu kaleye ${kg}/${GB.length}`);
    kapi(GA.length>0&&yk===GA.length&&GB.length>0&&kg===GB.length,'[6] kalecinin yerine yedek kaleci; hak yoksa saha oyuncusu kaleye');}
  /* [7] kaleci tedavisi */
  {const gk=m=>m.teams[0][0];const L=[];for(let i=0;i<Math.ceil(n/4);i++)L.push(akis((tohum||1)*800000+i,gk,'tedavi'));const G=L.filter(Boolean);
    const yerinde=G.filter(x=>x.son===11&&x.onDonus===11).length;console.log(`  [7] kaleci tedavisi: ${G.length} deneme · sahada kaldı (11) ${yerinde}/${G.length}`);
    kapi(G.length>0&&yerinde===G.length,'[7] kaleci sahada tedavi edilir, takım 11');}
  console.log(`  Toplam ${((Date.now()-t0)/1000).toFixed(1)} sn · kapı dışı ${kabulDisi}`);
  return kabulDisi?1:0;
}};
