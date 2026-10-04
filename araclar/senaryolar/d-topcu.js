/* ============ Chairman — duran top senaryosu: top toplayıcılar (yol haritası N10, 2026-10-04) ============
   Tam maç oynatır (maç öncesi atlanır) ve taç, korner, aut duruşlarını izler. Kabul:
   top toplayıcının verdiği top atana ulaşıyor (zorla teslim yok); atan topu almak için çizginin 2 m'den fazla dışına çıkmıyor (top
   çocuğun elindeyken atanın nerede olduğu sayılmaz: topun peşinden dışarı taşmış kaleci önce çizgiye döner, çocuk ondan sonra atar);
   çocuklar sahaya girmiyor; dışarıdaki eski top sahaya geri yuvarlanmıyor; konum bozulmuyor (NaN yok).
   Bilgi: duruş başına hazırlık süresi (başlangıçtan kullanıma) ve topun atana ulaşma süresi; top toplayıcısız eski kodda da çalışır
   (karşılaştırma için: çocuk yoksa ilgili satırlar “—” yazar).
   Kullanım: node araclar/mac-deneme.js --senaryo d-topcu [maç, varsayılan 12] */
'use strict';
const KOD=`(function(tohum){
  const m=new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();
  const T={tac:{n:0,cocuk:0,hazir:0,teslim:0,teslimN:0,zorla:0},korner:{n:0,cocuk:0,hazir:0,teslim:0,teslimN:0,zorla:0},kaleVurusu:{n:0,cocuk:0,hazir:0,teslim:0,teslimN:0,zorla:0}};
  let du0=null,kayit=null,adim=0,atanDis=0,atanDisN=0,cocukIc=0,topIc=0,nan=0,toplanan=0,onceki=0;const asan=[];
  const dis=p=>Math.max(0,Math.abs(p.x)-PL,-p.z,p.z-PW),ic=p=>Math.abs(p.x)<PL&&p.z>0&&p.z<PW?Math.min(PL-Math.abs(p.x),p.z,PW-p.z):0;
  const bitir=()=>{if(!kayit)return;const R=T[kayit.tur];R.hazir+=kayit.t;if(kayit.teslim!=null){R.teslim+=kayit.teslim;R.teslimN++;}if(kayit.zorla)R.zorla++;
    if(kayit.dis>atanDis)atanDis=kayit.dis;if(kayit.dis>2){atanDisN++;asan.push(kayit.tur+(kayit.cocuk?' çocuklu':' çocuksuz')+' '+kayit.dis.toFixed(1)+' m');}kayit=null;};
  while(m.phase!=='fulltime'&&adim<60*60*30){m.step(1/60);adim++;
    const du=m.phase==='durus'?m.durus:null,K=m.topcular||[];
    if(du!==du0){bitir();du0=du;if(du&&T[du.tur]){T[du.tur].n++;if(du.topcu)T[du.tur].cocuk++;kayit={tur:du.tur,t:0,teslim:null,zorla:false,dis:0,asama:du.asama,cocuk:!!du.topcu};}}
    if(du&&kayit){kayit.t=du.t;const tk=du.kullanan;
      if(kayit.teslim==null&&(du.asama==='yerles'||du.asama==='hazir')){kayit.teslim=du.t;if(du.t>16)kayit.zorla=true;}
      /* yalnız top çocuğun elinden çıktıktan (ya da çocuk yoksa baştan) sonra: atan topu almak için ne kadar dışarı gitti */
      if(tk&&kayit.teslim==null&&!(m.ball.tasiyan&&m.ball.tasiyan.tur==='topcu')){const d=dis(tk);if(d>kayit.dis)kayit.dis=d;}}
    for(const k of K){const d=ic(k);if(d>cocukIc)cocukIc=d;if(!(isFinite(k.x)&&isFinite(k.z)))nan++;}
    for(const o of m.disToplar)if(ic(o)>0.05)topIc++;
    const b=m.ball;if(!(isFinite(b.x)&&isFinite(b.y)&&isFinite(b.z)))nan++;
    const top=K.filter(k=>k.top).length;if(top>onceki&&adim>1)toplanan+=top-onceki;onceki=top;}
  bitir();
  return{T,atanDis,atanDisN,asan,cocukIc,topIc,nan,toplanan,cocuk:(m.topcular||[]).length,bitti:m.phase==='fulltime'};})`;
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||12,f=vm.runInContext(KOD,ctx),t0=Date.now();let hata=0;
  const S={tac:{n:0,cocuk:0,hazir:0,teslim:0,teslimN:0,zorla:0},korner:{n:0,cocuk:0,hazir:0,teslim:0,teslimN:0,zorla:0},kaleVurusu:{n:0,cocuk:0,hazir:0,teslim:0,teslimN:0,zorla:0}};
  let atanDis=0,atanDisN=0,cocukIc=0,topIc=0,nan=0,toplanan=0,cocuk=0,bitti=0;const asan=[];
  for(let i=0;i<n;i++){const x=f((tohum||1)+i);cocuk=x.cocuk;bitti+=x.bitti;
    for(const a in S)for(const k in S[a])S[a][k]+=x.T[a][k];
    atanDis=Math.max(atanDis,x.atanDis);atanDisN+=x.atanDisN;asan.push(...x.asan);cocukIc=Math.max(cocukIc,x.cocukIc);topIc+=x.topIc;nan+=x.nan;toplanan+=x.toplanan;}
  const top=S.tac.n+S.korner.n+S.kaleVurusu.n,zorla=S.tac.zorla+S.korner.zorla+S.kaleVurusu.zorla;
  const satir=(ad,tamam,deger)=>{if(!tamam)hata++;console.log((tamam?'  ':'! ')+ad.padEnd(62)+deger);};
  console.log(`\nD · top toplayıcılar · ${n} maç (tohum ${tohum||1}…) · ${cocuk} çocuk · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  satir('Maçlar sonuna kadar oynandı',bitti===n,`${bitti} / ${n}`);
  satir('Konum bozulmadı (NaN yok)',nan===0,String(nan));
  satir('Top atana ulaştı (16 sn sonra zorla teslim yok)',zorla===0,`${top-zorla} / ${top} duruş`);
  satir('Atan topu almak için çizginin ≤2 m dışına çıktı',atanDisN===0,`2 m'yi aşan ${atanDisN} duruş · en çok ${atanDis.toFixed(1)} m`+(asan.length?' · '+asan.slice(0,6).join(', '):''));
  if(cocuk){satir('Çocuklar sahaya girmedi (≤0,3 m)',cocukIc<=0.3,`en çok ${cocukIc.toFixed(2)} m`);
    satir('Dışarıdaki eski top sahaya geri gelmedi',topIc===0,`${topIc} adım`);}
  for(const [a,ad] of [['tac','Taç'],['korner','Korner'],['kaleVurusu','Aut']]){const R=S[a];
    console.log('  bilgi · '+ad.padEnd(7)+`maç başına ${(R.n/n).toFixed(1)} · çocuk verdi %${R.n?(R.cocuk/R.n*100).toFixed(0):'—'} · top atanda ${R.teslimN?(R.teslim/R.teslimN).toFixed(1):'—'} sn · kullanım ${R.n?(R.hazir/R.n).toFixed(1):'—'} sn`);}
  if(cocuk)console.log(`  bilgi · çocukların topladığı ya da yenilenen top: maç başına ${(toplanan/n).toFixed(1)}`);
  return hata?1:0;
}};
