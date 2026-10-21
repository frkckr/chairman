/* ============ Chairman — D akışı senaryosu: penaltı (kaleci, MM4) ============
   Gerçek akış: her atış ayrı tohumlu maçta durusBaslat('penalti') ile; atıcı (B'nin penaltiAtisi) ve kaleci (penaltiKaleciHazirla, kurtarış)
   motorun kendi kodudur. Sonuç ilk gelen olaydır: gol, kurtarış ya da top oyundan çıktı (direk/dışarı). Kabul: atışların %70–82'si gol
   (kapı; T15 kabulü %72–80, 1600 atışla okunur — 400 atışta σ ≈ 2 puan).
   T15-0 (2026-10-14) bilgi satırları: koşunun türü (vuruş eyleminin sec.kosu'su; T15c'den önce hep düz), türe göre gol ve kalecinin doğru
   tarafa uçması; kalecinin kalkışı — dalışın başı ile temas (şut olayı) arasındaki süre (eksi: temastan önce; Ek G5 −0,145 … +0,009),
   ortancası ve [−0,15, +0,02] içindeki payı.
   T24-0 (2026-10-18): direğe çarpıp 3 sn içinde gol, kurtarış ya da oyun dışıyla bitmeyen top ('direkOyun'; eskiden 'yok' sayılıyordu — tohum 1'de
   1600 atışta 33 'yok'un 33'ü direkten sonra oyunda kalan toptu) kaçırmaya sayılır, ayrı sütunda yazılır; direğe çarpan atışların dökümü.
   S1b (2026-10-20): penaltı sahnesiyle (MOTOR_AYAR.protokol&4) duruş ~40 sn sürer — adım tavanı 60·50 → 60·80; bilgi satırı: sahnenin hedef süresi
   (du.sahneT) ve düdükten temasa (penaltının 'duduk' olayından 'kullanim'a). Senaryoda faul yapan yoktur: kalabalık uzaktaki savunmacılardan kurulur.
   Kullanım: node araclar/mac-deneme.js --senaryo d-penalti [atış, varsayılan 400] */
'use strict';
const KOD=`(function(tohum){
  const m=new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();
  let sonuc=null,atis=-1,yan=0,kyan=null,direk=false,kosu='duz',dalis=null,dud=null,kulT=null;
  m.on=(ad,v)=>{if(ad==='shot'&&atis<0){atis=m.t;const b=m.ball;yan=Math.sign(b.vz)||0;const e=v&&v.p&&v.p.eylem;if(e&&e.sec&&e.sec.kosu)kosu=e.sec.kosu;}
    else if(ad==='dive'&&kyan==null&&v&&v.p){kyan=v.yan!=null?v.yan:(v.p.eylem&&v.p.eylem.yan)||0;dalis=m.t;}
    else if(ad==='wood')direk=true;
    else if(ad==='duduk'&&v&&v.tur==='penalti'&&dud==null)dud=m.t;else if(ad==='kullanim'&&kulT==null)kulT=m.t;
    else if(ad==='goal'&&!sonuc)sonuc='gol';else if(ad==='save'&&!sonuc)sonuc='kurtaris';};
  const px=m.dir[0]*(PL-PENALTI_U);m.topuSifirla(px-m.dir[0]*0.8,MZ+0.5);m.phase='play';
  m.durusBaslat('penalti',0,px,MZ,{bekle:0.3});const t0=m.t,sT=m.durus&&m.durus.sahneT||null;
  const gk=m.kaleci(1);
  for(let i=0;i<60*80&&!sonuc;i++){m.step(1/60);
    if(atis>=0&&!sonuc&&m.ball.tasiyan===gk)sonuc='kurtaris';
    if(atis>=0&&m.phase!=='play'&&!sonuc)sonuc=direk?'direk':'disari';
    if(atis>=0&&m.t-atis>3&&!sonuc)sonuc=direk?'direkOyun':'yok';}
  if(kyan==null)kyan=0;
  return{sonuc:sonuc||'yok',yan,kyan,kosu,direk,kalkis:dalis!=null&&atis>=0?dalis-atis:null,sT,dt:dud!=null&&kulT!=null?kulT-dud:null,ft:kulT!=null?kulT-t0:null};})`;
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||400,f=vm.runInContext(KOD,ctx),say={},dogru={n:0,kurt:0},t0=Date.now(),tur={},kalkis=[],dk={},S1=[[],[],[]];let dkN=0;
  for(let i=0;i<n;i++){const x=f((tohum||1)*1000+i);say[x.sonuc]=(say[x.sonuc]||0)+1;if(x.direk){dkN++;dk[x.sonuc]=(dk[x.sonuc]||0)+1;}
    if(x.kyan&&x.yan&&x.kyan===x.yan){dogru.n++;if(x.sonuc==='kurtaris')dogru.kurt++;}
    const T=tur[x.kosu]||(tur[x.kosu]={n:0,gol:0,dogru:0,uctu:0});T.n++;if(x.sonuc==='gol')T.gol++;if(x.kyan){T.uctu++;if(x.yan&&x.kyan===x.yan)T.dogru++;}
    if(x.kalkis!=null)kalkis.push(x.kalkis);if(x.sT!=null)S1[0].push(x.sT);if(x.dt!=null)S1[1].push(x.dt);if(x.ft!=null)S1[2].push(x.ft);}
  const gol=say.gol||0,oran=100*gol/n;
  console.log(`\nD · penaltı · ${n} atış (tohum ${(tohum||1)*1000}…) · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  console.log('  Sonuçlar: '+Object.keys(say).sort().map(k=>k+' '+say[k]+' (%'+(100*say[k]/n).toFixed(1)+')').join(' · '));
  if(dogru.n)console.log(`  Kaleci doğru tarafa uçtu: ${dogru.n} (%${(100*dogru.n/n).toFixed(1)}), bunların %${(100*dogru.kurt/dogru.n).toFixed(1)}'i kurtarış`);
  console.log('  Koşu (T15-0): '+Object.keys(tur).sort().map(k=>{const T=tur[k];return `${k} %${(100*T.n/n).toFixed(0)} (gol %${(100*T.gol/T.n).toFixed(1)}, kaleci doğru tarafta %${T.uctu?(100*T.dogru/T.uctu).toFixed(0):'—'})`;}).join(' · '));
  if(kalkis.length){const s=kalkis.slice().sort((a,b)=>a-b),o=s[Math.floor(s.length/2)],ic=s.filter(x=>x>=-0.15&&x<=0.02).length;
    console.log(`  Kalecinin kalkışı − temas (sn): ortanca ${o.toFixed(3)} · [−0,15, +0,02] içinde %${(100*ic/s.length).toFixed(0)} · erken (< −0,15) %${(100*s.filter(x=>x<-0.15).length/s.length).toFixed(0)} · ${s.length} dalış`);}
  /* T19-0 (2026-10-17; bilgi, T19c kabulü): kaçırma (direk + dışarı) ve kurtarış payı — gerçek lig ortalamaları kabaca gol %76–78, kurtarış
     %16–20, kaçırma %4–8 */
  /* T24-0 (2026-10-18): kaçırma = direkten dışarı ('direk') + dışarı + direkten oyunda kalan ('direkOyun'); eski tanım (direkten oyunda kalan hariç) karşılaştırma için yazılır */
  {const dd=say.direk||0,ds=say.disari||0,dO=say.direkOyun||0,kac=dd+ds+dO,ku=say.kurtaris||0,y=k=>(100*k/n).toFixed(1);
    console.log(`  T19: gol %${oran.toFixed(1)} (kabul 76–78, 4 × 1600) · kurtarış %${y(ku)} (16–20) · kaçırma %${y(kac)} (4–8)`);
    console.log(`  Kaçırma (T24-0): direkten dışarı %${y(dd)} · dışarı %${y(ds)} · direkten oyunda kalan %${y(dO)} · eski tanım (direk + dışarı) %${y(dd+ds)}`);
    if(dkN)console.log(`  Direğe çarpan (T24-0): ${dkN} (%${y(dkN)}) → `+Object.keys(dk).sort().map(k=>k+' '+dk[k]).join(' · '));}
  /* S1b (bilgi): sahnenin hedef süresi, duruşun başından temasa ve düdükten temasa (ortanca, gerçek sn) */
  {const o=L=>{if(!L.length)return'—';const s=L.slice().sort((a,b)=>a-b);return s[Math.floor(s.length/2)].toFixed(2);};
    console.log(`  S1b: sahnenin hedef süresi ortancası ${o(S1[0])} sn · duruşun başından temasa ${o(S1[2])} · düdükten temasa ${o(S1[1])} sn`);}
  const ok=oran>=70&&oran<=82;
  console.log((ok?'  ':'! ')+'Gol oranı'.padEnd(30)+oran.toFixed(1).padStart(6)+'%   hedef 70–82 (T15 kabulü 72–80, 1600 atış)');
  return ok?0:1;
}};
