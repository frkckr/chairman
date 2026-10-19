'use strict';
/* ============ Z2-0 (2026-10-19): duran top sahnesi ölçüsü — FUTBOL_KUTUPHANESI §12.2 (Z2), kutuphane/F-duran-toplar.md F.8 ============
   k-duran.js'in (T8) tanımlarına dokunmaz; onun yanında duruşun SAHNESİNİ ölçer. Sözleşme k-duran ile aynı: rastlantı çekmez, motor yöntemi
   çağırmaz, oyuncuya ve topa yazmaz; yalnız m.durus, m.phase, m.t, m.gameSec, m.score, m.half, top ve oyuncu alanlarını okur.
   Tanımlar:
   - Duruş: m.phase 'durus' ve m.durus nesnesi (kimliğiyle izlenir). Süresi duruşun başından oyunun yeniden başlamasına (m.phase 'play' ya da
     başka evre) gerçek saniyedir; vuruşla kullanılan duran topta bu kullananın temasıdır (k-duran'ın hazırlığıyla aynı an). Tür: taç, korner,
     kale vuruşu, penaltı; serbest vuruş sınıfıyla (barajlı, kenar, diğer — uzak, geri, ofsayt ve endirekt dahil); çabuk serbest vuruş (du.hizli)
     ayrı; hakem topu sayılmaz. Zaman geçirme (du.zgEk > 0) ve sakatlık bekleyişi (du.sakatBekledi) olan duruşlar süre ortalamasından çıkar
     (k-duran gibi), ayrı sayılır.
   - Bağlam (duruşun başında, kullanan takımın gözünden): önde ve kalan ≤ 20 dk → 'onde'; geride ve kalan ≤ 20 dk → 'geride'; değilse 'notr'.
     Kalan dakika js/mac-takim.js macDurumu'nun formülüyle (uzatma sayılmaz).
   - Evreler: du.asama'nın (bekle, getir, yerles, hazir, kullan) her birinde geçen gerçek saniye; Z2'de motor du.evre yazarsa o da sayılır.
   - Topu getiren: top toplayıcı (du.topcu), rakip ya da arkadaş (faulden sonra topu durdurup yerine yuvarlayan, du.durduran'ın takımı), kullanan
     (kendisi aldı).
   - Saat: maç saatinin aktığı adımlarda Δ maç sn ÷ Δ gerçek sn — oyunda ('play') ve duruşta (öbür evreler: durus, goal, kickoff). Gerçek dakikalar
     yalnız saatin aktığı adımlardan (devre arası, maç öncesi ve yarının ilk santrası hariç).
   - Taç: atışta (kullanım olayı) alıcıya en yakın rakip (m), alıcı 2,5 m içinde markajlı mı, atana 10 m içindeki rakip sayısı.
   - Korner: rutin (du.rutin), vurucunun ayağı içe dönen ayak mı (ön direk yanından içe dönen: köşeye ve hücum yönüne göre), kullanımın alt'ı.
   - Barajlı serbest vuruş: hakemin barajı dizdiği an (du.hakemHazir ilk true olduğunda, duruşun başından sn). */
const KS_TUR=['tac','korner','kaleVurusu','baraj','kenar','serbest','hizli','penalti'];
const KS_AD={tac:'taç',korner:'korner',kaleVurusu:'kale vuruşu',baraj:'barajlı serbest vuruş',kenar:'kenar serbest vuruşu',serbest:'diğer serbest vuruş',
  hizli:'çabuk serbest vuruş',penalti:'penaltı'};
const KS_BAG=['notr','onde','geride'],KS_EVRE=['bekle','getir','yerles','hazir','kullan'];
const KS_GETIREN=['topcu','kendisi','rakip','arkadas'],KS_GETIREN_AD={topcu:'top toplayıcı',kendisi:'kullanan kendisi',rakip:'rakip',arkadas:'arkadaş'};
const KS_RUTIN=['orta','kisa','geri','onDirek','arkaDirek','tren','alcak'];   /* geri: ceza sahası dışına yerden kesme (F.1.9) */
const KS_MZ=34,KS_PL=52.5;
const ksOrt=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b),n=S.length;return n%2?S[(n-1)/2]:(S[n/2-1]+S[n/2])/2;};
function ksTur(du){
  if(du.hakemTopu)return null;
  if(du.tur==='serbest'){if(du.hizli)return 'hizli';return du.sinif==='baraj'?'baraj':du.sinif==='kenar'?'kenar':'serbest';}
  return KS_TUR.includes(du.tur)?du.tur:null;}
function ksBaglam(m,t){
  const s=m.score||[0,0],fark=s[t]-s[1-t],kalan=m.half===1?45+Math.max(0,2700-m.gameSec)/60:Math.max(0,5400-m.gameSec)/60;
  return kalan<=20&&fark>0?'onde':kalan<=20&&fark<0?'geride':'notr';}
module.exports={
  bilgi:[['— Z2: duran top sahnesi (k-sahne; Z2-0) —',null,0]]
    .concat(KS_TUR.map(k=>['Duruş süresi (gerçek sn): '+KS_AD[k],'ksS_'+k,1]))
    .concat([['Duruş süresi (gerçek sn): bütün türler','ksS_hepsi',1],['Duruş / maç (hakem topu hariç)','ksN',1],
      ['Zaman geçirmeli ya da sakatlık bekleyişli duruş / maç','ksNzg',2]])
    .concat([['Maç (gerçek dk; saatin aktığı adımlar)','ksMacDk',2],['Oyun (gerçek dk / maç)','ksOyunDk',2],['Duruş, gol ve santra (gerçek dk / maç)','ksDurDk',2],
      ['Top oyunda, maç saatiyle %','ksOyunSaatP',1],['Maç saatinin hızı: oyunda (maç sn / gerçek sn)','ksSaatOyun',2],['Maç saatinin hızı: duruşta','ksSaatDur',2]])
    .concat(KS_GETIREN.map(k=>['Topu getiren: '+KS_GETIREN_AD[k]+' %','ksG_'+k,1]))
    .concat(KS_RUTIN.map(k=>['Korner rutini: '+k+' %','ksR_'+k,1]))
    .concat([['Korner: vurucunun ayağı içe dönen ayak %','ksKIceAyak',1],['Korner: kullanımda içe dönen (ortalananlarda) %','ksKIce',1]])
    .concat([['Taç: atışta alıcıya en yakın rakip (m, ortalama)','ksTRakip',2],['Taç: alıcı markajlı (2,5 m içinde rakip) %','ksTMark',1],
      ['Taç: atana 10 m içinde rakip (ortalama)','ksTPres',2]])
    .concat([['Barajlı serbest vuruş: hakem barajı dizdi (duruşun başından sn)','ksBHakem',1]]),
  ozet(sonuclar){
    /* tür × bağlam ve tür × evre (havuz ortalamaları) */
    const T={},E={};for(const k of KS_TUR){T[k]={};E[k]={};for(const b of KS_BAG)T[k][b]=[0,0];for(const e of KS_EVRE)E[k][e]=[0,0];}
    for(const s of sonuclar){const X=s._ksTB,Y=s._ksEv;if(!X)continue;
      for(const k of KS_TUR){for(const b of KS_BAG){T[k][b][0]+=X[k][b][0];T[k][b][1]+=X[k][b][1];}for(const e of KS_EVRE){E[k][e][0]+=Y[k][e][0];E[k][e][1]+=Y[k][e][1];}}}
    const f=a=>a[1]?(a[0]/a[1]).toFixed(1)+' ('+a[1]+')':'—';
    console.log('  Z2 sahne (havuz): duruş süresi, gerçek sn (n) — tür × bağlam');
    console.log('    '+'tür'.padEnd(24)+KS_BAG.map(b=>b.padStart(13)).join(''));
    for(const k of KS_TUR)console.log('    '+KS_AD[k].padEnd(24)+KS_BAG.map(b=>f(T[k][b]).padStart(13)).join(''));
    console.log('  Z2 sahne (havuz): evrelerde geçen ortalama gerçek sn — tür × evre');
    console.log('    '+'tür'.padEnd(24)+KS_EVRE.map(e=>e.padStart(9)).join(''));
    const g=a=>a[1]?(a[0]/a[1]).toFixed(1):'—';
    for(const k of KS_TUR)console.log('    '+KS_AD[k].padEnd(24)+KS_EVRE.map(e=>g(E[k][e]).padStart(9)).join(''));
  },
  yeni:()=>{
    const S={},N={},TB={},EV={},G={},R={};let n=0,nzg=0,su=0,sn=0;
    for(const k of KS_TUR){S[k]=[0,0];TB[k]={};EV[k]={};for(const b of KS_BAG)TB[k][b]=[0,0];for(const e of KS_EVRE)EV[k][e]=[0,0];}
    for(const k of KS_GETIREN)G[k]=0;for(const k of KS_RUTIN)R[k]=0;let nG=0,nR=0;
    let pR=0,pG=0,dR=0,dG=0,onceFaz=null,onceT=null,onceSaat=null;
    let kIce=0,kIceN=0,kIceAyak=0,kIceAyakN=0;const tR=[];let tMark=0,tN=0,tPres=0;const bH=[];
    let cur=null;   /* {du, tur, bag, t0, ev: {asama: sn}, getiren, hakem} */
    const bitir=(m)=>{const c=cur;cur=null;if(!c||!c.tur)return;
      const sure=m.t-c.t0;n++;
      if(c.du.zgEk>0||c.du.sakatBekledi){nzg++;return;}
      S[c.tur][0]+=sure;S[c.tur][1]++;su+=sure;sn++;TB[c.tur][c.bag][0]+=sure;TB[c.tur][c.bag][1]++;
      for(const e of KS_EVRE){EV[c.tur][e][0]+=c.ev[e]||0;EV[c.tur][e][1]++;}
      if(c.getiren){G[c.getiren]++;nG++;}
      if(c.tur==='korner'){const r=c.du.rutin||'orta';if(r in R)R[r]++;nR++;}
      if(c.hakem!=null)bH.push(c.hakem);};
    return{
      dinle(ad,v,m){
        if(!m||ad!=='kullanim'||!v||!v.du)return;const du=v.du;
        if(v.tur==='korner'&&(v.alt==='ice'||v.alt==='disa')){kIceN++;if(v.alt==='ice')kIce++;
          const d=m.dir[v.takim],iceAyak=Math.sign(du.z-KS_MZ)*d>0?'sol':'sag',a=v.p&&v.p.ayak;
          if(a==='sag'||a==='sol'){kIceAyakN++;if(a===iceAyak)kIceAyak++;}}
        if(v.tur==='tac'){const q=v.hedef&&v.hedef.alici;
          if(q){let r=99;for(const o of m.teams[1-v.takim]){if(!o.oyunda||o.rol==='GK')continue;const dd=Math.hypot(o.x-q.x,o.z-q.z);if(dd<r)r=dd;}
            tR.push(r);tN++;if(r<2.5)tMark++;}
          let k=0;for(const o of m.teams[1-v.takim]){if(!o.oyunda||o.rol==='GK')continue;if(Math.hypot(o.x-v.p.x,o.z-v.p.z)<10)k++;}tPres+=k;}
      },
      adim(m){
        /* saat: bu adımın evresi önceki adımın sonundaki evredir (step saati switch'ten önce akıtır) */
        if(onceSaat!=null){const dg=m.gameSec-onceSaat,dt=m.t-onceT;
          if(dg>1e-9&&dt>0){if(onceFaz==='play'){pR+=dt;pG+=dg;}else{dR+=dt;dG+=dg;}}}
        onceSaat=m.gameSec;onceT=m.t;onceFaz=m.phase;
        const du=m.phase==='durus'?m.durus:null;
        if(cur&&cur.du!==du)bitir(m);
        if(du&&!cur){cur={du,tur:ksTur(du),bag:ksBaglam(m,du.takim),t0:m.t-(du.t||0),ev:{},getiren:null,hakem:null,durduran:null};}
        if(cur){const c=cur,dt=1/60;
          if(du.asama in {bekle:1,getir:1,yerles:1,hazir:1,kullan:1})c.ev[du.asama]=(c.ev[du.asama]||0)+dt;
          if(du.durduran)c.durduran=du.durduran;
          if(!c.getiren){if(du.topcu)c.getiren='topcu';
            else if(du.asama==='yerles'||du.asama==='hazir'||du.asama==='kullan'){
              c.getiren=c.durduran&&c.durduran!==du.kullanan?(c.durduran.team===du.takim?'arkadas':'rakip'):'kendisi';}}
          if(c.hakem==null&&du.hakemHazir)c.hakem=du.t;}
      },
      bitir(m){
        if(cur&&m)bitir(m);
        const r={ham:{},ksN:n,ksNzg:nzg,ksMacDk:(pR+dR)/60,ksOyunDk:pR/60,ksDurDk:dR/60,
          ksSaatOyun:pR>0?pG/pR:NaN,ksSaatDur:dR>0?dG/dR:NaN,ksTRakip:tR.length?tR.reduce((a,b)=>a+b,0)/tR.length:NaN,
          ksTPres:tN?tPres/tN:NaN,ksBHakem:bH.length?bH.reduce((a,b)=>a+b,0)/bH.length:NaN,_ksTB:TB,_ksEv:EV};
        for(const k of KS_TUR)r.ham['ksS_'+k]=[S[k][0],100*S[k][1]];
        r.ham.ksS_hepsi=[su,100*sn];
        r.ham.ksOyunSaatP=[pG,pG+dG];
        for(const k of KS_GETIREN)r.ham['ksG_'+k]=[G[k],nG];
        for(const k of KS_RUTIN)r.ham['ksR_'+k]=[R[k],nR];
        r.ham.ksKIceAyak=[kIceAyak,kIceAyakN];r.ham.ksKIce=[kIce,kIceN];r.ham.ksTMark=[tMark,tN];
        return r;}
    };
  }
};
