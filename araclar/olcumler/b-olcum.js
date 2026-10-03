'use strict';
/* ============ B akışı ölçümleri (MM3: pas, şut, ilk dokunuş) ============
   Rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları, top ve eylem alanlarını okur. Oranlar maç başına hesaplanıp
   maçlar üzerinden ortalanır (bilgi amaçlı). */
module.exports={
  bilgi:[
    ['— B: karar ve vuruş —',null,0],
    ['Planlı (yönlü) iyi ilk dokunuş %','bPlanli',1],
    ['Kötü dokunuşta ağır dokunuş payı %','bAgir',1],
    ['Ver-kaç koşusu (adet)','bVerKac',1],
    ['Dış ayakla pas %','bDis',1],
    ['Şut türü: plase %','bPlase',1],['Şut türü: sert %','bSert',1],['Şut türü: falso %','bFalso',1],['Şut türü: aşırtma %','bAsirtma',1],
    ['Orta: alçak sert (adet)','bAlcak',2],['Orta: kesme (adet)','bKesme',2],['Orta: arka direğe asma (adet)','bAsma',2]
  ],
  yeni:()=>{
    const s={iyi:0,planli:0,kotu:0,agir:0,verKac:0,pas:0,dis:0,plase:0,sert:0,falso:0,asirtma:0,dusen:0,alcak:0,kesme:0,asma:0};let son=null;
    return{
      dinle(ad,v){
        if(ad==='ilkDokunus'&&v.tur==='ayak'){if(v.iyi){s.iyi++;if(v.plan)s.planli++;}else{s.kotu++;if(v.agir)s.agir++;}}
        else if(ad==='kosu'&&v.verKac)s.verKac++;
        else if(ad==='pass'||ad==='cross'){const e=v.p&&v.p.eylem;if(e&&e.ad==='vurus'){s.pas++;if(e.stil==='dis')s.dis++;
          if(ad==='cross'){const sec=e.sec||{};if(sec.tip==='yer')s.alcak++;else if(sec.yay==='asma')s.asma++;else s.kesme++;}}}
      },
      /* şut türü (b.sut.tur): şut nesnesi ilk görüldüğü adımda sayılır */
      adim(m){const su=m.ball.sut;if(su&&su!==son){son=su;if(su.tur&&su.tur in s)s[su.tur]++;}},
      bitir(){const y=(a,c)=>c?100*a/c:NaN,ts=s.plase+s.sert+s.falso+s.asirtma+s.dusen;
        return{bPlanli:y(s.planli,s.iyi),bAgir:y(s.agir,s.kotu),bVerKac:s.verKac,bDis:y(s.dis,s.pas),
          bPlase:y(s.plase,ts),bSert:y(s.sert,ts),bFalso:y(s.falso,ts),bAsirtma:y(s.asirtma,ts),bAlcak:s.alcak,bKesme:s.kesme,bAsma:s.asma};}
    };
  }
};
