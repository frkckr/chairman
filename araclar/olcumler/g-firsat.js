'use strict';
/* ============ Bire bir fırsatı teşhisi (gerçekçilik planı T4, madde 1; 2026-10-08) ============
   Yalnız MAC_DENEME_FIRSAT=1 iken çalışır (teşhis aracıdır; varsayılan çıktı ve süre değişmesin). "Düello durumu": top oyundayken topu süren
   saha oyuncusunun 3 m içinde ve hücum yönüne göre önünde (gerisinde olmayan) bir rakip saha oyuncusu; aynı sahiplikte aynı çift bir kez
   sayılır. Çalım denendi: o sahiplikte sürücünün 'calim' olayı var (hazırlığı başlamış deneme). Jokey: durum boyunca savunmacının tavrı bir
   kez olsun 'jokey'. Niyet süresi: sürücünün çalım niyeti (p.surus.cal) ya da denemesi (p.calim) sürerken geçen süre. Gruplar r-karne'deki
   gibi (stoper, bek, merkez, kanat, forvet). Rastlantı çekmez, motor yöntemi çağırmaz. Kullanım: MAC_DENEME_FIRSAT=1 node araclar/mac-deneme.js 40 */
const GF_ACIK=process.env.MAC_DENEME_FIRSAT==='1';
const gfGrup=q=>!q?'-':q.rol==='GK'?'kaleci':q.mevki&&q.mevki.bek?'bek':q.rol==='DEF'?'stoper':q.mevki&&q.mevki.kanat?'kanat':q.rol==='OS'?'merkez':'forvet';
module.exports={
  bilgi:GF_ACIK?[['— G: bire bir fırsatı teşhisi (T4) —',null,0],['Düello durumu (sürücünün önünde ≤3 m savunmacı) / maç','gFirsat',1],
    ['Düello durumu: çalım denendi %','gFirsatCalim',1],['Düello durumu: savunmacı jokeyde %','gFirsatJokey',1],
    ['Düello durumu: kanat oyuncusu payı %','gFirsatKanat',1],['Düello durumu: kanat, çalım denendi %','gFirsatKanatCalim',1],
    ['Düello durumu: forvet payı %','gFirsatForvet',1],['Düello durumu: forvet, çalım denendi %','gFirsatForvetCalim',1],
    ['Çalım niyetinde geçen süre (sn / maç)','gNiyetSure',1]]:[],
  yeni:()=>{
    if(!GF_ACIK)return{};
    const hyp=Math.hypot,DUR=new Map(),CAL=new Set(),dt=1/60;let niyet=0;
    return{
      dinle(ad,v,m){if(m&&ad==='calim'&&v.p)CAL.add(m.sahiplikNo+':'+v.p.team+':'+v.p.n);},
      adim(m){if(m.phase!=='play')return;const b=m.ball,p=b.sahip;if(!p||p.rol==='GK'||b.tasiyan)return;
        if(p.surus&&p.surus.cal||p.calim)niyet+=dt;
        const d=m.dir[p.team],ck=m.sahiplikNo+':'+p.team+':'+p.n;
        for(const o of m.teams[1-p.team]){if(!o.oyunda||o.rol==='GK')continue;const dx=o.x-p.x,dz=o.z-p.z,L=hyp(dx,dz);if(L>3||L<1e-3||dx*d/L<-0.3)continue;
          const k=ck+':'+o.n;let r=DUR.get(k);if(!r){r={g:gfGrup(p),jok:false,ck};DUR.set(k,r);}if(o.tavir==='jokey')r.jok=true;}},
      bitir(){const R=[...DUR.values()],K=R.filter(r=>r.g==='kanat'),F=R.filter(r=>r.g==='forvet'),den=r=>CAL.has(r.ck);
        return{gFirsat:R.length,gNiyetSure:niyet,ham:{gFirsatCalim:[R.filter(den).length,R.length],gFirsatJokey:[R.filter(r=>r.jok).length,R.length],
          gFirsatKanat:[K.length,R.length],gFirsatKanatCalim:[K.filter(den).length,K.length],gFirsatForvet:[F.length,R.length],gFirsatForvetCalim:[F.filter(den).length,F.length]}};}
    };
  }
};
