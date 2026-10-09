'use strict';
/* ============ T5 teşhisi: rakip gövde çarpışmaları (gerçekçilik planı T5, 2026-10-09) ============
   Yalnız MAC_DENEME_TEMAS=1 iken çalışır. govdeTemasi olayından (js/mac-mudahale.js): kapanma hızı vk, saldıranın mağdura göre yönü (arka < −0,3
   arkadan, < 0,3 yandan, değilse önden), topun kimde olduğu ve mağdurun topa uzaklığı. Maç başına adet; vk bandı × yön × top tablosu. T5'te
   pres yapanın topu sürene çarpmasını (temas faulünün başlıca kaynağı) bulmak için kullanıldı; rakibe çarpmama (moveP) ve saldıranın kendi
   yaklaşmasından şiddet sonrası tabloyu izlemek için kalır. Rastlantı çekmez. Kullanım: MAC_DENEME_TEMAS=1 node araclar/mac-deneme.js 12 */
const GT_ACIK=process.env.MAC_DENEME_TEMAS==='1',GT_VK=[[1.5,'1–1,5'],[2,'1,5–2'],[3,'2–3'],[99,'>3']],GT_YON=['arkadan','yandan','önden'];
module.exports={
  bilgi:GT_ACIK?[['— G: rakip gövde çarpışmaları (T5 teşhisi) —',null,0],['Çarpışma (vk > 1 m/sn) / maç','gtN',1]]:[],
  yeni:()=>{if(!GT_ACIK)return{};const T={};let n=0;
    return{dinle(ad,v){if(ad!=='govdeTemasi')return;n++;
        const y=v.arka<-0.3?0:v.arka<0.3?1:2,k=GT_VK.findIndex(([s])=>v.vk<s),
          ilgi=v.sahipS?'saldıran topta':v.sahipM?'mağdur topta':v.topa<2.5?'top yakın':'top uzak',key=y+'|'+k+'|'+ilgi;T[key]=(T[key]||0)+1;},
      bitir(){return{gtN:n,gtT:T};}};},
  ozet(sonuclar){if(!GT_ACIK)return;const T={};for(const r of sonuclar){const t=r.gtT;if(!t)continue;for(const k in t)T[k]=(T[k]||0)+t[k];}
    const n=sonuclar.length;
    console.log('  Rakip gövde çarpışmaları (maç başına; vk bandı × yön × top):');
    const ilgiler=['saldıran topta','mağdur topta','top yakın','top uzak'];
    for(let y=0;y<3;y++)for(const ilgi of ilgiler){const satir=GT_VK.map((_,k)=>((T[y+'|'+k+'|'+ilgi]||0)/n).toFixed(2));
      if(satir.every(x=>x==='0.00'))continue;console.log('    '+(GT_YON[y]+' · '+ilgi).padEnd(30)+GT_VK.map(([_,a],i)=>a+' '+satir[i]).join('  '));}}
};
