'use strict';
/* ============ T23-0 yürüyüşün yönü (gerçekçilik planı §4 “2026-10-18 akşam”, T23; 2026-10-18) ============
   Teşhis: yürüme bandında (0,3–2 m/sn) saha oyuncusunun gövdesi gittiği yöne değil çoğunlukla topa dönük (yengeç yürüyüşü); çizimde yan adım kısa
   olduğundan kadans 2,5 adım/sn çıkıyor (gerçek 1,7–2,0; borç defteri 41). Gerçekte yürüyen insan çoğunlukla gittiği yöne bakar; yana ve geriye
   adım jokeyde, savunma hattının kısa kaymasında ve kısa geri çekilmede olur.
   Tanım: oyun sürerken (phase 'play') her karede saha oyuncusunun hız büyüklüğü (p.vx, p.vz) ve gövdenin yönü (p.yon) arası açı: ileri < 46°,
   yan 46–126°, geri > 126°. Bantlar: yürüme 0,3–2 m/sn, tırıs 2–4 m/sn. Duruma göre ayrım (ilk tutan): kilitli eylem (vuruş, müdahale …; yalnız
   sayılır), tavır (jokey, koru, bekle), topun sahibi, görev (p.gorevAd: hat, bolge, markaj, kovala, pres1–3, destek, dinlen, öteki).
   Yengeç epizodu: yürüme ya da tırıs bandında aralıksız ≥ 1 sn yan ya da geri gidiş (tavırsız, eylemsiz); oyuncu·dk başına ve ortalama süresi.
   Rastlantı çekmez, motor yöntemi çağırmaz; yalnız oyuncu alanlarını okur. */
const W_DT=1/60;
const W_DURUM=['eylem','tavir','sahip','hat','bolge','markaj','kovala','pres','destek','dinlen','diger'];
module.exports={
  bilgi:[['— W: yürüyüşün yönü (T23-0; gerçekçilik planı §4 “2026-10-18 akşam”) —',null,0],
    ['Yürüme (0,3–2 m/sn): ileri %','wYuruIleri',1],['Yürüme: yan (46–126°) %','wYuruYan',1],['Yürüme: geri (> 126°) %','wYuruGeri',1],
    ['Yürüme: yan + geri %','wYuruYG',1,[null,30,'T23']],
    ['Tırıs (2–4 m/sn): yan + geri %','wTirisYG',1],
    ['Yürüme: yan + geri, tavırsız ve eylemsiz %','wYuruYGSerbest',1],
    ...W_DURUM.map(k=>['Yürüme: yan + geri — '+k+' % (payı süre %)','wYG_'+k,1]),
    ['Yengeç epizodu (≥ 1 sn yan ya da geri) / oyuncu·dk','wYengecDk',2],['Yengeç epizodu: ortalama süre (sn)','wYengecSure',2],
    ['Yürüme bandı: oyun süresinin %','wYuruPay',1]],
  ozet(sonuclar){
    /* durum başına süre payı (yürüme bandındaki zamanın %'si) ayrı satırda */
    const T={};let top=0;for(const s of sonuclar){const d=s.wDurumSure||{};for(const k in d){T[k]=(T[k]||0)+d[k];top+=d[k];}}
    if(!top)return;console.log('  W: yürüme bandında zamanın duruma göre payı (%): '+W_DURUM.map(k=>k+' '+(100*(T[k]||0)/top).toFixed(1)).join(' · '));},
  yeni:()=>{
    const hyp=Math.hypot,aN=a=>a-2*Math.PI*Math.floor((a+Math.PI)/(2*Math.PI));
    let yI=0,yY=0,yG=0,tYG=0,tN=0,serbYG=0,serbN=0,oyunN=0;
    const D={},DS={};for(const k of W_DURUM){D[k]=[0,0];DS[k]=0;}
    const ep=new Map();let epN=0,epT=0,oyuncuSn=0;
    const durum=(m,p)=>{const e=p.eylem;if(e&&e.kilit)return'eylem';if(e&&(e.ad==='vurus'||e.ad==='mudahale'||e.ad==='kayma'||e.ad==='kafa'))return'eylem';
      if(p.tavir==='jokey'||p.tavir==='koru'||p.tavir==='bekle')return'tavir';if(m.ball.sahip===p)return'sahip';
      const g=p.gorevAd||'';if(g==='hat')return'hat';if(g==='bolge')return'bolge';if(g==='markaj')return'markaj';if(g==='kovala'||g==='kovala2')return'kovala';
      if(g==='pres1'||g==='pres2'||g==='pres3')return'pres';if(g==='destek')return'destek';if(g==='dinlen')return'dinlen';return'diger';};
    return{
      adim(m){
        if(m.phase!=='play')return;
        for(const p of m.players){if(!p.oyunda||p.rol==='GK')continue;oyunN++;oyuncuSn+=W_DT;
          const v=hyp(p.vx,p.vz);let yg=false;const dr=durum(m,p);
          if(v>=0.3&&v<4){const a=Math.abs(aN(Math.atan2(p.vz,p.vx)-p.yon));yg=a>0.8;
            if(v<2){if(a<0.8)yI++;else if(a<=2.2)yY++;else yG++;DS[dr]+=W_DT;D[dr][1]++;if(yg)D[dr][0]++;
              if(dr!=='eylem'&&dr!=='tavir'){serbN++;if(yg)serbYG++;}}
            else{tN++;if(yg)tYG++;}}
          /* yengeç epizodu: tavırsız, eylemsiz, yürüme ya da tırıs bandında yan/geri */
          let e=ep.get(p);if(!e){e={t:0};ep.set(p,e);}
          if(yg&&dr!=='eylem'&&dr!=='tavir')e.t+=W_DT;else{if(e.t>=1){epN++;epT+=e.t;}e.t=0;}}},
      bitir(){
        for(const [,e] of ep)if(e.t>=1){epN++;epT+=e.t;}
        const yN=yI+yY+yG,ham={wYuruIleri:[yI,yN],wYuruYan:[yY,yN],wYuruGeri:[yG,yN],wYuruYG:[yY+yG,yN],wTirisYG:[tYG,tN],wYuruYGSerbest:[serbYG,serbN],wYuruPay:[yN,oyunN]};
        for(const k of W_DURUM)ham['wYG_'+k]=[D[k][0],D[k][1]];
        return{ham,wYengecDk:oyuncuSn?epN/(oyuncuSn/60):NaN,wYengecSure:epN?epT/epN:NaN,wDurumSure:DS};}
    };
  }
};
