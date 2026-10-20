'use strict';
/* ============ T5 teşhisi: rakip gövde çarpışmaları (gerçekçilik planı T5, 2026-10-09) ============
   Yalnız MAC_DENEME_TEMAS=1 iken çalışır. govdeTemasi olayından (js/mac-mudahale.js): kapanma hızı vk, saldıranın mağdura göre yönü (arka < −0,3
   arkadan, < 0,3 yandan, değilse önden), topun kimde olduğu ve mağdurun topa uzaklığı. Maç başına adet; vk bandı × yön × top tablosu. T5'te
   pres yapanın topu sürene çarpmasını (temas faulünün başlıca kaynağı) bulmak için kullanıldı; rakibe çarpmama (moveP) ve saldıranın kendi
   yaklaşmasından şiddet sonrası tabloyu izlemek için kalır. Rastlantı çekmez. Kullanım: MAC_DENEME_TEMAS=1 node araclar/mac-deneme.js 12 */
const GT_ACIK=process.env.MAC_DENEME_TEMAS==='1',GT_VK=[[1.5,'1–1,5'],[2,'1,5–2'],[3,'2–3'],[99,'>3']],GT_YON=['arkadan','yandan','önden'];
/* A11a (2026-10-20): 'darbe' olayı (js/mac-mudahale.js mdhDarbeOlay) — gerçek hız değişimi olan türler (çarpışma, omuz kaybedeni, tutulan) dv bandına,
   topun bedene çarpması temas yüksekliği (p.yuk üstünde, m) × bağıl hız bandına; maç başına adet */
const GT_DV=[[0.5,'0,25–0,5'],[1,'0,5–1'],[2,'1–2'],[99,'≥2']],GT_TY=[[0.5,'< 0,5 m'],[1,'0,5–1 m'],[1.5,'1–1,5 m'],[99,'≥ 1,5 m']],GT_TV=[[8,'< 8'],[12,'8–12'],[20,'12–20'],[999,'≥ 20']];
module.exports={
  bilgi:GT_ACIK?[['— G: rakip gövde çarpışmaları (T5 teşhisi) —',null,0],['Çarpışma (vk > 1 m/sn) / maç','gtN',1]]:[],
  yeni:()=>{if(!GT_ACIK)return{};const T={},DV={},TY={};let n=0;
    return{dinle(ad,v){
        if(ad==='darbe'){if(v.dv!=null){const k=v.tur+'|'+GT_DV.findIndex(([s])=>v.dv<s);DV[k]=(DV[k]||0)+1;}
          if(v.tur==='top'&&v.v!=null){const k=GT_TY.findIndex(([s])=>v.y<s)+'|'+GT_TV.findIndex(([s])=>v.v<s);TY[k]=(TY[k]||0)+1;}return;}
        if(ad!=='govdeTemasi')return;n++;
        const y=v.arka<-0.3?0:v.arka<0.3?1:2,k=GT_VK.findIndex(([s])=>v.vk<s),
          ilgi=v.sahipS?'saldıran topta':v.sahipM?'mağdur topta':v.topa<2.5?'top yakın':'top uzak',key=y+'|'+k+'|'+ilgi;T[key]=(T[key]||0)+1;},
      bitir(){return{gtN:n,gtT:T,gtDV:DV,gtTY:TY};}};},
  ozet(sonuclar){if(!GT_ACIK)return;const T={};for(const r of sonuclar){const t=r.gtT;if(!t)continue;for(const k in t)T[k]=(T[k]||0)+t[k];}
    const n=sonuclar.length;
    console.log('  Rakip gövde çarpışmaları (maç başına; vk bandı × yön × top):');
    const ilgiler=['saldıran topta','mağdur topta','top yakın','top uzak'];
    for(let y=0;y<3;y++)for(const ilgi of ilgiler){const satir=GT_VK.map((_,k)=>((T[y+'|'+k+'|'+ilgi]||0)/n).toFixed(2));
      if(satir.every(x=>x==='0.00'))continue;console.log('    '+(GT_YON[y]+' · '+ilgi).padEnd(30)+GT_VK.map(([_,a],i)=>a+' '+satir[i]).join('  '));}
    /* A11a: darbe olayı */
    const DV={},TY={};for(const r of sonuclar){for(const k in r.gtDV||{})DV[k]=(DV[k]||0)+r.gtDV[k];for(const k in r.gtTY||{})TY[k]=(TY[k]||0)+r.gtTY[k];}
    if(Object.keys(DV).length){console.log('  Darbe olayı (A11a; maç başına): tür × dv bandı (m/sn)');
      for(const t of [...new Set(Object.keys(DV).map(k=>k.split('|')[0]))].sort())console.log('    '+t.padEnd(12)+GT_DV.map(([_,a],i)=>a+' '+((DV[t+'|'+i]||0)/n).toFixed(2)).join('  '));}
    if(Object.keys(TY).length){console.log('  Darbe olayı (A11a; maç başına): topun bedene çarpması — temas yüksekliği × bağıl hız (m/sn)');
      GT_TY.forEach(([_,ya],i)=>console.log('    '+ya.padEnd(12)+GT_TV.map(([_,a],j)=>a+' '+((TY[i+'|'+j]||0)/n).toFixed(2)).join('  ')));}}
};
