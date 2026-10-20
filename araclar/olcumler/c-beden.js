/* ============ C akışı ölçümü: müdahale türü ve sonucu, omuz mücadelesi, düşüş ve faul nedenleri, kart gerekçesi, avantaj ============
   Olaylardan sayar (rastlantı çekmez, motor yöntemi çağırmaz). Değerler maç başına adettir. */
'use strict';
const TUR=['acik','donus','erken','kayma','yan','toparlanma']   /* T4'ten beri motor sırttan dalış yerine 'donus' yayar (2026-10-09 düzeltme) */,SONUC=['temiz','durttu','blok','gecildi','faul'],NEDEN=['faul','omuz','kayma','hava','takilma'],FN=['mudahale','kayma','itme','hava','el'],KART=['siddet','atak','firsat','asiri','el','itiraz'];
const bas=s=>s.charAt(0).toUpperCase()+s.slice(1);
/* T5 (2026-10-09): faulün kaynağı (temastan: müdahale, kayma, gövde çarpması, omuz, ayağa basma, hava; kasıt: taktik) ve hakemin görmediği faul.
   T10b (2026-10-11): markajda tutma, elle oynama, kaleciye çarpma, yüksek ayak; kart gerekçesine el ve itiraz (itiraz sarısı 'kart' olayının nedeninden) */
const KAYNAK=['mudahale','kayma','carpma','omuz','basma','hava','taktik','tutma','el','kaleci','yuksekAyak'];
/* A11a (2026-10-20): motor → çizim temas sözleşmesi (eylemde e.darbe, 'dusus' olayının darbe'si, 'darbe' olayı; js/mac-mudahale.js mdhDarbe, mdhDarbeOlay).
   Düşüşün ailesi (darbe.tip), sendelemenin ailesi ('darbe' olayı, sonuc 'sendele'), 'darbe' olayının türü ve sonucu, düşüşün şiddeti ve düşenin temas
   anındaki hızı (düşüş itkisinden önce), darbesiz düşüş. Bant yok, dağılımdır; özet tablosu: tür (faul/faulsüz) × şiddet dilimi — maç başına adet, hız
   ortancası ve kalkış yan payı (darbe.kalk 1,1 sn). MOTOR_AYAR.darbe 0'da satırlar 0'dır */
const DTIP=['takilma','kayarak','itilme','cekilme','havaInis','aldatma'],DTUR=['carpisma','top','omuz','hava','gecilme','tutma','bacak','aldatma','mudahale','kayma','ikili','diger'],
  DSON=['yok','sendele','dusus'],DS=['< 0,5','0,5–0,8','≥ 0,8'],DV=['< 2','2–5','≥ 5'],dsi=x=>x<0.5?0:x<0.8?1:2,dvi=x=>x<2?0:x<5?1:2;
module.exports={
  bilgi:[['— C: müdahale, omuz, düşüş, kart —',null,0]]
    .concat(TUR.map(t=>['Müdahale türü: '+t,'cMt'+bas(t),1]))
    .concat(TUR.map(t=>['Müdahale kazandı (adet, '+t+')','cMk'+bas(t),1]))
    .concat(TUR.map(t=>['Müdahale faulü (adet, '+t+'; T5)','cMf'+bas(t),2]))
    .concat(SONUC.map(t=>['Müdahale sonucu (adet): '+t,'cMs'+bas(t),1]))
    .concat([['Omuz mücadelesi (olay, ikili)','cOmuz',1],['Omuzda faul (itme)','cOmuzFaul',2]])
    .concat(NEDEN.map(t=>['Düşüş nedeni: '+t,'cDn'+bas(t),2]))
    .concat(FN.map(t=>['Faul nedeni: '+t,'cFn'+bas(t),2]))
    .concat(KART.map(t=>['Sarı/kırmızı gerekçesi: '+t,'cK'+bas(t),2]))
    .concat([['Avantaj döndü (faule)','cAvDon',2]])
    .concat(KAYNAK.map(t=>['Faul kaynağı (T5): '+t,'cFk'+bas(t),2]))
    .concat([['Görülmeyen faul (T5; hakem görmedi, oyun sürdü)','cFg',2]])
    .concat(DTIP.map(t=>['Düşüş ailesi (A11a): '+t,'cDa'+bas(t),2]))
    .concat(DTIP.map(t=>['Sendeleme ailesi (A11a): '+t,'cSa'+bas(t),2]))
    .concat([['Darbe olayı (A11a): toplam','cDbN',1]])
    .concat(DTUR.map(t=>['Darbe olayı türü: '+t,'cDb'+bas(t),1]))
    .concat(DSON.map(t=>['Darbe olayı sonucu: '+t,'cDo'+bas(t),1]))
    .concat(DS.map((t,i)=>['Düşüş şiddeti (A11a): '+t,'cDs'+i,2]))
    .concat(DV.map((t,i)=>['Düşenin hızı (A11a; m/sn): '+t,'cDv'+i,2]))
    .concat([['Darbesiz düşüş (A11a; dusus olayı)','cDdz',2]]),
  yeni:()=>{const say={};let N=0;const art=k=>{say[k]=(say[k]||0)+1;};
    const DT={},TS={};   /* A11a: düşüş tür × şiddet hücreleri [adet, hızlar, yan] ve darbe tür × sonuç */
    return{
      dinle(ad,v){
        if(ad==='mudahale')art('cMt'+bas(v.kayma?'kayma':v.tur||'acik'));
        else if(ad==='mudahaleSonuc'){N++;art('cMs'+bas(v.faul?'faul':v.sonuc||'gecildi'));const t=bas(v.tur||(v.kayma?'kayma':'acik'));art('cMn'+t);if(v.kazan)art('cMw'+t);if(v.faul)art('cMf'+t);}
        else if(ad==='omuz')art('cOmuz');
        else if(ad==='dusus'){art('cDn'+bas(v.neden||'faul'));const D=v.darbe;
          if(!D)art('cDdz');
          else{const h=Math.hypot(D.vx,D.vz),si=dsi(v.siddet||0),k=D.tur+(D.faul?' (faul)':'')+'|'+si,c=DT[k]||(DT[k]=[0,[],0]);
            art('cDa'+bas(D.tip));art('cDs'+si);art('cDv'+dvi(h));c[0]++;c[1].push(Math.round(h*100)/100);if(D.kalk===1.1)c[2]++;}}
        else if(ad==='darbe'){art('cDbN');const t=DTUR.includes(v.tur)?v.tur:'diger';art('cDb'+bas(t));art('cDo'+bas(v.sonuc));TS[t+'|'+v.sonuc]=(TS[t+'|'+v.sonuc]||0)+1;
          if(v.sonuc==='sendele'&&v.darbe)art('cSa'+bas(v.darbe.tip));}
        else if((ad==='faul'&&!v.avantajdan)||ad==='avantaj'){art('cFn'+bas(v.neden||'mudahale'));if(v.omuz)art('cOmuzFaul');if(v.kartNeden)art('cK'+bas(v.kartNeden));if(v.kaynak)art('cFk'+bas(v.kaynak));}
        else if(ad==='faulGorulmedi')art('cFg');
        else if(ad==='kart'&&v.neden)art('cK'+bas(v.neden));
        else if(ad==='avantajSonuc'&&!v.tutuldu)art('cAvDon');},
      bitir(){const o={};
        for(const t of TUR)o['cMt'+bas(t)]=say['cMt'+bas(t)]||0;
        for(const t of SONUC)o['cMs'+bas(t)]=say['cMs'+bas(t)]||0;
        for(const t of TUR)o['cMk'+bas(t)]=say['cMw'+bas(t)]||0;
        for(const t of TUR)o['cMf'+bas(t)]=say['cMf'+bas(t)]||0;
        o.cOmuz=say.cOmuz||0;o.cOmuzFaul=say.cOmuzFaul||0;
        for(const t of NEDEN)o['cDn'+bas(t)]=say['cDn'+bas(t)]||0;
        for(const t of FN)o['cFn'+bas(t)]=say['cFn'+bas(t)]||0;
        for(const t of KART)o['cK'+bas(t)]=say['cK'+bas(t)]||0;
        o.cAvDon=say.cAvDon||0;for(const t of KAYNAK)o['cFk'+bas(t)]=say['cFk'+bas(t)]||0;o.cFg=say.cFg||0;
        for(const t of DTIP){o['cDa'+bas(t)]=say['cDa'+bas(t)]||0;o['cSa'+bas(t)]=say['cSa'+bas(t)]||0;}
        o.cDbN=say.cDbN||0;for(const t of DTUR)o['cDb'+bas(t)]=say['cDb'+bas(t)]||0;for(const t of DSON)o['cDo'+bas(t)]=say['cDo'+bas(t)]||0;
        for(let i=0;i<3;i++){o['cDs'+i]=say['cDs'+i]||0;o['cDv'+i]=say['cDv'+i]||0;}o.cDdz=say.cDdz||0;o.cBdDT=DT;o.cBdTS=TS;return o;}};},
  /* A11a: özet tabloları (maç başına; bilgi) */
  ozet(sonuclar){const n=sonuclar.length,DT={},TS={};let var_=false;
    for(const r of sonuclar){for(const [k,c] of Object.entries(r.cBdDT||{})){const d=DT[k]||(DT[k]=[0,[],0]);d[0]+=c[0];d[1].push(...c[1]);d[2]+=c[2];var_=true;}
      for(const [k,c] of Object.entries(r.cBdTS||{})){TS[k]=(TS[k]||0)+c;var_=true;}}
    if(!var_||!n)return;const f=(x,b)=>Number.isFinite(x)?x.toFixed(b):'—',med=L=>{if(!L.length)return NaN;const a=L.slice().sort((x,y)=>x-y);return a[a.length>>1];};
    console.log('  Darbe olayı (A11a; maç başına): tür × sonuç '+DSON.join(' / '));
    for(const t of DTUR){const L=DSON.map(s=>(TS[t+'|'+s]||0)/n);if(L.every(x=>!x))continue;console.log('    '+t.padEnd(12)+L.map(x=>f(x,2).padStart(8)).join(''));}
    console.log('  Düşüş (A11a; maç başına): tür (faul/faulsüz) × şiddet dilimi '+DS.join(' · ')+' — hücre: adet · hız ortancası (m/sn) · kalkış yan payı %');
    const turler=[...new Set(Object.keys(DT).map(k=>k.split('|')[0]))].sort();
    for(const t of turler){console.log('    '+t.padEnd(18)+[0,1,2].map(i=>{const c=DT[t+'|'+i];return(c?f(c[0]/n,2)+' · '+f(med(c[1]),1)+' · '+f(100*c[2]/c[0],0):'—').padStart(20);}).join(''));}}
};
