/* ============ Chairman — D akışı senaryosu: penaltı (kaleci, MM4) ============
   Gerçek akış: her atış ayrı tohumlu maçta durusBaslat('penalti') ile; atıcı (B'nin penaltiAtisi) ve kaleci (penaltiKaleciHazirla, kurtarış)
   motorun kendi kodudur. Sonuç ilk gelen olaydır: gol, kurtarış ya da top oyundan çıktı (direk/dışarı). Kabul: atışların %70–82'si gol.
   Kullanım: node araclar/mac-deneme.js --senaryo d-penalti [atış, varsayılan 400] */
'use strict';
const KOD=`(function(tohum){
  const m=new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();
  let sonuc=null,atis=-1,yan=0,kyan=null,direk=false;
  m.on=(ad,v)=>{if(ad==='shot'&&atis<0){atis=m.t;const b=m.ball;yan=Math.sign(b.vz)||0;}
    else if(ad==='dive'&&kyan==null&&v&&v.p)kyan=v.yan!=null?v.yan:(v.p.eylem&&v.p.eylem.yan)||0;
    else if(ad==='wood')direk=true;
    else if(ad==='goal'&&!sonuc)sonuc='gol';else if(ad==='save'&&!sonuc)sonuc='kurtaris';};
  const px=m.dir[0]*(PL-PENALTI_U);m.topuSifirla(px-m.dir[0]*0.8,MZ+0.5);m.phase='play';
  m.durusBaslat('penalti',0,px,MZ,{bekle:0.3});
  const gk=m.kaleci(1);
  for(let i=0;i<60*25&&!sonuc;i++){m.step(1/60);
    if(atis>=0&&!sonuc&&m.ball.tasiyan===gk)sonuc='kurtaris';
    if(atis>=0&&m.phase!=='play'&&!sonuc)sonuc=direk?'direk':'disari';
    if(atis>=0&&m.t-atis>3&&!sonuc)sonuc='yok';}
  if(kyan==null)kyan=0;
  return{sonuc:sonuc||'yok',yan,kyan};})`;
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||400,f=vm.runInContext(KOD,ctx),say={},dogru={n:0,kurt:0},t0=Date.now();
  for(let i=0;i<n;i++){const x=f((tohum||1)*1000+i);say[x.sonuc]=(say[x.sonuc]||0)+1;
    if(x.kyan&&x.yan&&x.kyan===x.yan){dogru.n++;if(x.sonuc==='kurtaris')dogru.kurt++;}}
  const gol=say.gol||0,oran=100*gol/n;
  console.log(`\nD · penaltı · ${n} atış (tohum ${(tohum||1)*1000}…) · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  console.log('  Sonuçlar: '+Object.keys(say).sort().map(k=>k+' '+say[k]+' (%'+(100*say[k]/n).toFixed(1)+')').join(' · '));
  if(dogru.n)console.log(`  Kaleci doğru tarafa uçtu: ${dogru.n} (%${(100*dogru.n/n).toFixed(1)}), bunların %${(100*dogru.kurt/dogru.n).toFixed(1)}'i kurtarış`);
  const ok=oran>=70&&oran<=82;
  console.log((ok?'  ':'! ')+'Gol oranı'.padEnd(30)+oran.toFixed(1).padStart(6)+'%   hedef 70–82');
  return ok?0:1;
}};
