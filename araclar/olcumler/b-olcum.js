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
    ['Orta: alçak sert (adet)','bAlcak',2],['Orta: kesme (adet)','bKesme',2],['Orta: arka direğe asma (adet)','bAsma',2],
    /* T4-V (2026-10-09; gerçekçilik planı §4 T4 madde 6): vuruş hazırlığı. Karar→temas = eylemin başından (vurusBaslat) temasa geçen süre (e.t
       olay anında); hazırlık = hazirlik → geri evresine geçiş anı (e.hazirlikT); acele = karar anında baskı > 0,5 (e.baski); vazgeçme = hat kapandı
       olayı; zayıf ayak = vuran ayak tercih edilen değil. Ortancalar maç başına, sonra maçlar üzerinden ortalanır */
    ['Vuruş: karar→temas ortanca (sn) yerden pas ≤ 22 m','bVtPas',2,[0.40,0.55,'T4-V']],['Vuruş: karar→temas ortanca (sn) şut','bVtSut',2,[0.50,0.65,'T4-V']],
    ['Vuruş: karar→temas ortanca (sn) uzun (yer > 22 m ya da havadan)','bVtUzun',2,[0.55,0.75,'T4-V']],['Vuruş: karar→temas ortanca (sn) gelişine','bVtIlk',2],
    ['Vuruş: hazırlık ortanca (sn; hazırlık → geri)','bVtHaz',2],['Vuruş: acele (karar anında baskı) %','bVtAcele',1],
    ['Vuruş: vazgeçme (hat kapandı) / maç','bVazgec',1],['Vuruş: zayıf ayakla %','bZayif',1]
  ],
  yeni:()=>{
    const s={iyi:0,planli:0,kotu:0,agir:0,verKac:0,pas:0,dis:0,plase:0,sert:0,falso:0,asirtma:0,dusen:0,alcak:0,kesme:0,asma:0,
      vt:{pas:[],sut:[],uzun:[],ilk:[]},haz:[],vN:0,acele:0,vazgec:0,zayif:0};let son=null;
    const ortanca=a=>{if(!a.length)return NaN;const b=a.slice().sort((x,y)=>x-y),n=b.length;return n%2?b[(n-1)/2]:(b[n/2-1]+b[n/2])/2;};
    return{
      dinle(ad,v){
        if(ad==='ilkDokunus'&&v.tur==='ayak'){if(v.iyi){s.iyi++;if(v.plan)s.planli++;}else{s.kotu++;if(v.agir)s.agir++;}}
        else if(ad==='kosu'&&v.verKac)s.verKac++;
        else if(ad==='vazgecti')s.vazgec++;
        else if(ad==='pass'||ad==='cross'||ad==='shot'){const e=v.p&&v.p.eylem;if(e&&e.ad==='vurus'){
          if(ad!=='shot'){s.pas++;if(e.stil==='dis')s.dis++;
            if(ad==='cross'){const sec=e.sec||{};if(sec.tip==='yer')s.alcak++;else if(sec.yay==='asma')s.asma++;else s.kesme++;}}
          /* T4-V: vuruş zamanlaması (olay vurusSon içinde atılır; e.t eylemin yaşı, evre hâlâ 'geri') */
          const sec=e.sec||{},L=v.L||0,grup=sec.ilk?'ilk':ad==='shot'?'sut':(sec.tip==='hava'||L>22)?'uzun':'pas';
          if(e.t!=null)s.vt[grup].push(e.t);if(e.hazirlikT!=null)s.haz.push(e.hazirlikT);
          s.vN++;if(e.baski!=null&&e.baski>0.5)s.acele++;
          const p=v.p;if(p.ayak&&p.ayak!=='iki'&&e.ayak&&e.ayak!==p.ayak)s.zayif++;}}
      },
      /* şut türü (b.sut.tur): şut nesnesi ilk görüldüğü adımda sayılır */
      adim(m){const su=m.ball.sut;if(su&&su!==son){son=su;if(su.tur&&su.tur in s)s[su.tur]++;}},
      bitir(){const y=(a,c)=>c?100*a/c:NaN,ts=s.plase+s.sert+s.falso+s.asirtma+s.dusen;
        return{bPlanli:y(s.planli,s.iyi),bAgir:y(s.agir,s.kotu),bVerKac:s.verKac,bDis:y(s.dis,s.pas),
          bPlase:y(s.plase,ts),bSert:y(s.sert,ts),bFalso:y(s.falso,ts),bAsirtma:y(s.asirtma,ts),bAlcak:s.alcak,bKesme:s.kesme,bAsma:s.asma,
          bVtPas:ortanca(s.vt.pas),bVtSut:ortanca(s.vt.sut),bVtUzun:ortanca(s.vt.uzun),bVtIlk:ortanca(s.vt.ilk),bVtHaz:ortanca(s.haz),
          bVtAcele:y(s.acele,s.vN),bVazgec:s.vazgec,bZayif:y(s.zayif,s.vN)};}
    };
  }
};
