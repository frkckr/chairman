/* ============ Chairman — maç günü senaryosu: ısınmada kaleciler (yol haritası N1, 2026-10-04) ============
   Maç öncesini atlamadan oynatır ve ısınmayı izler. Bulunan hata: js/mac-oncesi.js antKaleci eski biçimli 'ucus' eylemi kuruyordu; MM4'ün uçuş
   adımı bu eylemde kalecinin konumunu bozuyordu (NaN). Kaleci görünmez oluyor, antrenör ve yedek kaleci ~140 sn onu bekliyordu. Kabul:
   maç öncesinde ve (ilk iki tohumda) devre arasında hiçbir kişinin konumu ya da hızı bozulmuyor; as kaleci çıkışından dönüşüne kadar sahada;
   kaleci antrenörü düzenli atış yapıyor; iki kaleci de kaleye geçiyor; kaleciler ve kaleci antrenörleri pozsuz 60 sn'den uzun yerinde durmuyor.
   Diğer kişilerin en uzun duruşu bilgi olarak yazılır (şut sırası bekleyen oyuncu, top veren kondisyoner, yerindeki 4. hakem durur).
   Kullanım: node araclar/mac-deneme.js --senaryo m-isinma [maç öncesi sayısı, varsayılan 8] */
'use strict';
const KOD=`(function(tohum,devre){
  const kulubeler=[0,1].map(t=>{const cx=t?7:-7;return{takim:t,koltuklar:[0,1,2,3,4,5].map(i=>({x:cx-2.6+i*1.04,z:-5.75})),alan:{x:cx,z:-2.4}};});
  const m=new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:-19,z:-5},kulubeler});
  const T=m.tunel,sn=m.sen,K=[];
  for(let t=0;t<2;t++){m.teams[t].forEach((p,i)=>K.push({p,tur:i===0?'kaleci':'oyuncu',t}));m.yedekler[t].forEach(p=>K.push({p,tur:p.rol==='GK'?'yedekKaleci':'oyuncu',t}));}
  m.kenar.forEach(p=>K.push({p,tur:p.kind==='kaleciAnt'?'kaleciAnt':'kenar',t:p.team}));m.refs.forEach(p=>K.push({p,tur:'hakem',t:-1}));
  for(const k of K){k.dis=0;k.dur=0;k.enUzun=0;k.px=k.p.x;k.pz=k.p.z;}
  const bozuk=p=>!(isFinite(p.x)&&isFinite(p.z)&&isFinite(p.vx)&&isFinite(p.vz));
  let nan=null,adim=0;
  const bak=faz=>{for(const k of K)if(!nan&&bozuk(k.p))nan={faz,t:+(adim/60).toFixed(1),tur:k.tur,takim:k.t};
    if(sn&&sn.toplar)for(const o of sn.toplar)if(!nan&&!(isFinite(o.x)&&isFinite(o.y)&&isFinite(o.z)))nan={faz,t:+(adim/60).toFixed(1),tur:'top',takim:-1};};
  while(m.phase==='isinma'&&adim<60*500){m.step(1/60);adim++;bak('isinma');
    for(const k of K){const p=k.p,d=Math.hypot(p.x-k.px,p.z-k.pz);k.px=p.x;k.pz=p.z;
      if(p.z>T.z+0.6){k.dis+=1/60;if(d*60<0.08&&!p.oturuyor&&!p.poz&&!p.eylem){k.dur+=1/60;k.enUzun=Math.max(k.enUzun,k.dur);}else k.dur=0;}}}
  const isinma=adim/60,kal=sn.kaleciler.map(k=>({sayac:k.sayac,iki:k.kaleciler.length>1}));
  const as=[0,1].map(t=>{const k=K.find(q=>q.tur==='kaleci'&&q.t===t),g=k.p.sg;return{dis:k.dis,beklenen:g.iceri-g.cikis};});
  const enUzun={};for(const k of K)enUzun[k.tur]=Math.max(enUzun[k.tur]||0,k.enUzun);
  /* törenin sonuna kadar; istenirse ilk yarı ve devre arası (yedeklerin şut çalışması aynı antKaleci'yi kullanır) */
  while(m.phase!=='play'&&adim<60*900){m.step(1/60);adim++;bak(m.phase);}
  const santra=m.phase==='play';let ikinci=!devre;
  if(devre&&santra){let gordu=false;const son=adim+60*900;
    while(adim<son){m.step(1/60);adim++;bak(m.phase);if(m.phase==='halftime')gordu=true;else if(gordu&&m.phase==='play'){ikinci=true;break;}}}
  return{nan,isinma,kal,as,enUzun,santra,ikinci};})`;
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||8,f=vm.runInContext(KOD,ctx),t0=Date.now();let hata=0;
  const T={nan:0,as:0,atis:0,iki:0,dur:0,santra:0,devre:0,devreN:0,enAzAtis:99,asEnAz:9,enUzun:{}};let ornek=null;
  for(let i=0;i<n;i++){const devre=i<2,x=f((tohum||1)+i,devre);
    if(!x.nan)T.nan++;else if(!ornek)ornek=x.nan;
    T.santra+=x.santra;if(devre){T.devreN++;T.devre+=x.ikinci&&!x.nan;}
    for(const a of x.as){const o=a.dis/a.beklenen;T.as+=o>=0.85;T.asEnAz=Math.min(T.asEnAz,o);}
    for(const k of x.kal){T.atis+=k.sayac>=15;T.iki+=!k.iki||k.sayac>=12;T.enAzAtis=Math.min(T.enAzAtis,k.sayac);}
    T.dur+=Math.max(x.enUzun.kaleci||0,x.enUzun.yedekKaleci||0,x.enUzun.kaleciAnt||0)<=60;
    for(const a in x.enUzun)T.enUzun[a]=Math.max(T.enUzun[a]||0,x.enUzun[a]);}
  const satir=(ad,v,top,ek)=>{const ok=v===top;if(!ok)hata++;console.log((ok?'  ':'! ')+ad.padEnd(58)+String(v).padStart(4)+' / '+top+(ek?'   '+ek:''));};
  console.log(`\nM · ısınmada kaleciler · ${n} maç öncesi (tohum ${tohum||1}…) · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  satir('Konum ve hız hiç bozulmadı (NaN yok)',T.nan,n,ornek?`ilk bozulma: ${ornek.faz} ${ornek.t}. sn, ${ornek.tur}`:'');
  satir('Maç öncesi santraya kadar tamamlandı',T.santra,n);
  satir('Devre arası şut çalışması bozulmadan geçti',T.devre,T.devreN);
  satir('As kaleci çıkıştan dönüşe sahada (sürenin ≥%85\'i)',T.as,2*n,`en az %${(T.asEnAz*100).toFixed(0)}`);
  satir('Kaleci antrenörü en az 15 atış yaptı',T.atis,2*n,`en az ${T.enAzAtis}`);
  satir('İki kaleci de kaleye geçti',T.iki,2*n);
  satir('Kaleci ve antrenörü pozsuz ≤60 sn yerinde durdu',T.dur,n);
  console.log('  bilgi · pozsuz en uzun duruş (sn): '+Object.keys(T.enUzun).map(a=>a+' '+T.enUzun[a].toFixed(0)).join(', '));
  return hata?1:0;
}};
