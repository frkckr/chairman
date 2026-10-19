'use strict';
/* ============ Z1-0 (2026-10-19): bağımsız örüntü ölçüsü — FUTBOL_KUTUPHANESI §11.1, Z1 planı ============
   Plan katmanından BAĞIMSIZDIR: plan durumunu (m._pln), 'plan' ve 'kosu' olaylarını, görev etiketlerini (p.gorevAd) ve koşu belirtecini (p.kosu)
   okumaz. Yalnız pas, orta, şut, çalım ve ofsayt olaylarını, topu ve oyuncuların konum, hız, yön, bakış ve jest alanlarını okur; rastlantı çekmez,
   motor yöntemi çağırmaz. Plan katmanının ürettiği örüntü böylece kendi sayaçlarından (z-plan.js) ayrı doğrulanır. Tanımlar:
   - Koşu: hız ≥ 4,2 m/sn (15 km/sa) en az 0,7 sn (SkillCorner, Gradient); başlangıcı serinin ilk karesidir (hız 3,6 m/sn'nin altında 0,2 sn'den
     uzun kalınca seri biter). Konumlar 0,1 sn'de bir 3 sn'lik halkada tutulur.
   - Dokunuş: topun son dokunanı ya da sürümü değişti (b.sonDokunan, b.surum).
   - Ver-kaç: A→B yerden ≤ 15 m pas; 2 sn içinde B'nin A'ya pası (B en çok 2 dokunuş, arada başkası dokunmadan); A'nın koşusu ilk pastan en çok
     0,3 sn önce ile 0,8 sn sonra arasında başlamış ve A ikinci pasa kadar ≥ 4 m ileri gitmiş. Tamamlanan: ikinci pastan sonra ilk dokunan A
     (2,5 sn içinde). Savunmacı elendi: ilk pas anında A'nın önünde (ileri yönde) 8 m içindeki en yakın rakip, A topu aldığında A'nın gerisinde.
   - Üçüncü adam: A→B ileri pas (B'nin alışı A'nın yerinden ≥ 6 m ileride), B alışta sırtı kaleye (gövdesi hücum yönünden > 90° dönük), B en çok
     2 dokunuşla 1,6 sn içinde C'ye (C ≠ A) pas, hedef B'nin en çok 3 m gerisi; C'nin koşusu ilk pastan 0,5 sn önce ile B'nin pasından 0,2 sn önce
     arasında başlamış. Tamamlanan: sonra ilk dokunan C (2,5 sn içinde); C ileri gidiyor: alışta C'nin ileri hızı > 2 m/sn.
   - Derin pas: hedefi pas anındaki ofsayt çizgisinin (sondan ikinci rakip) 1 m gerisini geçen ya da türü 'ara' olan açık oyun pası. Alıcının koşu
     başı − pas anı (Δt): erken ≤ −0,3 sn, aynı an |Δt| < 0,3, geç > +0,3 (paylar koşanlar arasında; IDSSE ölçümüyle aynı tanım), koşusuz (1,5 sn içinde koşu yok). Ofsayt: 3 sn içinde alıcıya ofsayt.
   - Geri çevirme (geometri; Opta "pull-back"): kale çizgisine ≤ 11 m ve orta noktadan 5–20 m yanda başlayan, geriye ya da yana (hedef başlangıcın
     en çok 1 m önünde), hedefi kaleye 4–22 m ve ortaya 12 m içinde yerden pas. Pas anında hücumcunun üç bandı: ön direk (kaleye ≤ 7 m), penaltı
     noktası (7–14 m), yay (14–22 m); ortaya 10–12 m içinde. Geç gelen: ön direk ya da penaltı noktası bandındaki, 1,5 sn önce ceza sahası dışında
     olan hücumcu. Tamamlanma: 2 sn içinde ilk dokunan takım arkadaşı; şut: 2 sn içinde takımın şutu.
   - İstek: topa sahip takımda yeni 'cagir' ya da 'isaret' jesti ve taşıyanın bakışının 1,75 rad içinde; 1,5 sn içinde taşıyandan jestçiye pas.
   - Çeşitlilik: sahiplik başına belirteç dizisi — ^ başlangıç, $ son; T taşıma ≥ 5 m (pas ya da şuttan önce), pas: 1 gelişine, a ara, g geri
     (hedef 3 m geride), k < 12 m, o 12–25 m, u > 25 m, c orta, r geri çevirme; d çalım; s şut. Takım·maç başına 3'lülerin Shannon entropisi (H3,
     bit) ve en sık üç 3'lünün payı; pasör rolü → alıcı rolü çiftinin entropisi. Havuz değerleri özette.
   - Kendi kendine çıkış: taç, aut ya da korner; son dokunan duruşu kaybeden takımda ve son dokunuşu kendi sürüş dokunuşu (sürüş, koruma, bekleme,
     vuruş hazırlığı) 2 sn içinde — "kötü ilk dokunuş"tan çıkış ayrı satır. */
const Z_PL=52.5,Z_MZ=34,Z_V1=4.2,Z_V0=3.6,Z_RING=30;
const Z_ROL=p=>!p||!p.mevki?'-':p.rol==='GK'?'k':p.mevki.bek?'b':p.rol==='DEF'?'s':p.mevki.kanat?'n':p.rol==='OS'?'m':'f';
const Z_ENT=M=>{let n=0;for(const k in M)n+=M[k];if(!n)return NaN;let h=0;for(const k in M){const q=M[k]/n;h-=q*Math.log2(q);}return h;};
const Z_TOP3=M=>{const v=Object.values(M).sort((a,b)=>b-a);let n=0;for(const x of v)n+=x;return n?100*(v[0]+(v[1]||0)+(v[2]||0))/n:NaN;};
const Z_MED=a=>{if(!a.length)return NaN;const s=[...a].sort((x,y)=>x-y);return s[s.length>>1];};
const Z_YUZ=(a,q)=>{if(!a.length)return NaN;const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.floor(q*s.length))];};
module.exports={
  bilgi:[['— Z: örüntüler (bağımsız ölçü; FUTBOL_KUTUPHANESI §11.1, Z1) —',null,0],
    ['Ver-kaç: deneme / maç','zVkD',2],['Ver-kaç: tamamlanan / maç','zVkT',2],['Ver-kaç: savunmacı elendi % (tamamlananda)','zVkElen',1],
    ['Üçüncü adam: deneme / maç','zUaD',2],['Üçüncü adam: tamamlanan / maç','zUaT',2],['Üçüncü adam: C, B\'nin pasından önce koşuyor %','zUaOnce',1],
    ['Üçüncü adam: C ileri gidiyor % (tamamlananda)','zUaIleri',1],
    ['Derin pas (çizgi − 1 m ötesine ya da ara) / maç','zDpN',2],['Derin pas: alıcı koşmuyor (1,5 sn içinde koşu yok) %','zDpYok',1],
    ['Derin pas, koşanlarda: erken (Δt ≤ −0,3 sn) %','zDpErken',1],['Derin pas, koşanlarda: aynı an (|Δt| < 0,3 sn) %','zDpAyni',1],['Derin pas, koşanlarda: geç (> +0,3 sn) %','zDpGec',1],
    ['Derin pas: Δt ortancası (sn; koşanlar)','zDpDt',2],
    ['Derin pas: alıcı aldı %','zDpAldi',1],['Derin pas: 3 sn içinde ofsayt %','zDpOfs',1],
    ['Geri çevirme (geometri) / maç','zGcN',2],['Geri çevirme: pas anında ≥ 2 bantta hücumcu %','zGc2',1],['Geri çevirme: 3 bantta %','zGc3',1],
    ['Geri çevirme: geç gelen var %','zGcGec',1],['Geri çevirme: tamamlanma %','zGcTam',1],['Geri çevirme: 2 sn içinde şut %','zGcSut',1],
    ['İstek (cagir/isaret, taşıyan görüyor) / maç','zIstN',2],['İstek: 1,5 sn içinde jestçiye pas %','zIstPas',1],
    ['Çeşitlilik: sahiplik 3\'lüsü entropisi H3 (bit; takım·maç)','zH3',2],['Çeşitlilik: en sık üç 3\'lünün payı % (takım·maç)','zTop3',1],
    ['Çeşitlilik: pasör → alıcı rol çifti entropisi (bit; takım·maç)','zRolH',2],
    ['Kendi kendine çıkış: sürüş dokunuşundan (taç, aut, korner) / maç','zKendi',2],['Kendi kendine çıkış: kötü ilk dokunuştan / maç','zKendiK',2]],
  ozet(sonuclar){
    const T={},R={},dt=[];let vkD=0,vkT=0,uaD=0,uaT=0,gc=0;
    for(const s of sonuclar){for(const t of [0,1]){const M=s.zTri&&s.zTri[t];if(M)for(const k in M)T[k]=(T[k]||0)+M[k];const Q=s.zRolM&&s.zRolM[t];if(Q)for(const k in Q)R[k]=(R[k]||0)+Q[k];}
      if(s.zDtL)dt.push(...s.zDtL);vkD+=s.zVkD||0;vkT+=s.zVkT||0;uaD+=s.zUaD||0;uaT+=s.zUaT||0;gc+=s.zGcN||0;}
    const en=Object.entries(T).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>k+' '+v).join(' · ');
    console.log(`  Z (havuz): H3 ${Z_ENT(T).toFixed(2)} bit · ilk üç 3'lü %${Z_TOP3(T).toFixed(1)} · rol çifti ${Z_ENT(R).toFixed(2)} bit · en sık: ${en}`);
    console.log(`  Z (havuz): derin pasta Δt ortanca ${Z_MED(dt).toFixed(2)} sn (%10 ${Z_YUZ(dt,0.1).toFixed(2)} · %90 ${Z_YUZ(dt,0.9).toFixed(2)}; n ${dt.length}) · toplam ver-kaç ${vkD}/${vkT} · üçüncü adam ${uaD}/${uaT} · geri çevirme ${gc}`);},
  yeni:()=>{
    const hyp=(a,b)=>Math.sqrt(a*a+b*b),aN=a=>a-2*Math.PI*Math.floor((a+Math.PI)/(2*Math.PI));
    /* oyuncu durumu: koşu serisi ve konum halkası */
    const S=new Map();let ringI=0,adimN=0;
    const durum=p=>{let o=S.get(p);if(!o){o={ks:-1,alt:0,rx:new Float32Array(Z_RING),rz:new Float32Array(Z_RING),dolu:0,jest:null};S.set(p,o);}return o;};
    const kosuBasi=(p,t)=>{const o=S.get(p);return o&&o.ks>=0&&t-o.ks>=0?o.ks:-1;};
    const eskiYer=(p,geri)=>{const o=S.get(p);if(!o||o.dolu<=geri)return null;const j=((ringI-1-geri)%Z_RING+Z_RING)%Z_RING;return{x:o.rx[j],z:o.rz[j]};};
    /* olay günlükleri */
    const pas=[];   /* son paslar {t,p,q,team,d,u0,x0,z0,hx,hz,hu,tur,tip,ilk,L,D,Du,Au,yon} */
    const dok=[];   /* dokunuşlar {t,p,yon} */
    let sonDok=null,sonSurum=-1;
    let vkD=0,vkT=0,vkElen=0,uaD=0,uaT=0,uaOnce=0,uaIleri=0;
    let dpN=0,dpE=0,dpA=0,dpG=0,dpY=0,dpAldi=0,dpOfs=0;const dpBek=[],dtL=[];
    let gcN=0,gc2=0,gc3=0,gcGec=0,gcTam=0,gcSut=0;const gcBek=[];
    let istN=0,istPas=0;const istBek=[];
    const vkBek=[],uaBek=[];
    let kendi=0,kendiK=0,oncekiFaz=null;
    /* çeşitlilik */
    const TRI=[{},{}],ROL=[{},{}],HT=[[],[]];let pos=null;   /* pos: {team, tok:[...], sahip, sx, sz} */
    const tri=(t,a)=>{const M=TRI[t];for(let i=0;i+2<a.length;i++){const k=a[i]+a[i+1]+a[i+2];M[k]=(M[k]||0)+1;}};
    const posBitir=()=>{if(pos){pos.tok.push('$');tri(pos.team,pos.tok);pos=null;}};
    const posTok=(t,c)=>{if(!pos||pos.team!==t){posBitir();pos={team:t,tok:['^'],sahip:null,sx:0,sz:0};}pos.tok.push(c);};
    const cizgi=(m,t)=>{const d=m.dir[t];let a=-1e9,b=-1e9;for(const o of m.teams[1-t]){if(!o.oyunda)continue;const u=o.x*d;if(u>a){b=a;a=u;}else if(u>b)b=u;}return Math.max(b,0);};
    const sonrakiDokunan=(t0,t1)=>{for(const k of dok)if(k.t>t0&&k.t<=t1)return k;return null;};
    return{
      dinle(ad,v,m){
        if(!m||m.phase!=='play'&&ad!=='ofsayt')return;
        if(ad==='pass'||ad==='cross'){const p=v.p;if(!p||p.team==null)return;const t=p.team,d=m.dir[t];
          const x0=v.x0!=null?v.x0:p.x,z0=v.z0!=null?v.z0:p.z,hx=v.hx!=null?v.hx:(v.q?v.q.x:x0),hz=v.hz!=null?v.hz:(v.q?v.q.z:z0);
          const P={t:m.t,p,q:v.q||null,team:t,d,x0,z0,hx,hz,u0:x0*d,hu:hx*d,tur:v.tur||'pas',tip:v.tip||'yer',ilk:!!v.ilk,L:v.L!=null?v.L:hyp(hx-x0,hz-z0),D:null,Du:0,Au:p.x*d};
          /* A'nın önündeki en yakın rakip (ver-kaç: savunmacı elendi mi) */
          {let e=null,ed=8;for(const o of m.teams[1-t]){if(!o.oyunda||o.rol==='GK')continue;const f=(o.x-p.x)*d;if(f<=0)continue;const dd=hyp(o.x-p.x,o.z-p.z);if(dd<ed){ed=dd;e=o;}}P.D=e;P.Du=e?e.x*d:0;}
          pas.push(P);if(pas.length>8)pas.shift();
          /* çeşitlilik belirteci */
          const tasidi=pos&&pos.sahip===p&&hyp(p.x-pos.sx,p.z-pos.sz)>=5;
          if(tasidi)posTok(t,'T');
          const gcMu=ad==='pass'&&P.tip!=='hava'&&P.u0>Z_PL-11&&Math.abs(z0-Z_MZ)>5&&Math.abs(z0-Z_MZ)<20&&P.hu<=P.u0+1&&P.hu>=Z_PL-22&&P.hu<=Z_PL-4&&Math.abs(hz-Z_MZ)<12;
          posTok(t,ad==='cross'?'c':gcMu?'r':P.ilk?'1':P.tur==='ara'?'a':P.hu<P.u0-3?'g':P.L<12?'k':P.L<=25?'o':'u');
          if(v.q){const k=Z_ROL(p)+Z_ROL(v.q);ROL[t][k]=(ROL[t][k]||0)+1;}
          /* ver-kaç ve üçüncü adam: bu pas, önceki pasın alıcısının pası mı */
          const P1=pas.length>=2?pas[pas.length-2]:null;
          if(P1&&P1.q===p&&P1.team===t&&P.t-P1.t<=2.5){
            let nB=0,baska=false;for(const k of dok)if(k.t>P1.t&&k.t<=P.t){if(k.p===p)nB++;else baska=true;}
            if(!baska&&nB<=2){
              if(P.q===P1.p&&P1.tip!=='hava'&&P1.L<=15&&P.t-P1.t<=2){const A=P1.p,ks=kosuBasi(A,P.t);
                if(ks>=P1.t-0.3&&ks<=P1.t+0.8&&(A.x*d-P1.Au)>=4){vkD++;vkBek.push({P1,P,A});}}
              else if(P.q&&P.q!==P1.p&&P.q.team===t){const B=p,C=P.q,ilkB=dok.find(k=>k.t>P1.t&&k.p===B);
                if(ilkB&&ilkB.u-P1.Au>=6&&Math.cos(aN(ilkB.yon-(d>0?0:Math.PI)))<0&&P.t-ilkB.t<=1.6&&P.hu>=ilkB.u-3){uaD++;const ks=kosuBasi(C,P.t);
                  if(ks>=P1.t-0.5&&ks<=P.t-0.2)uaOnce++;uaBek.push({P,C});}}}}
          /* derin pas */
          if(ad==='pass'&&P.q&&P.q.team===t){const c=cizgi(m,t);if(P.hu>c-1&&P.hu>P.u0||P.tur==='ara'){dpN++;dpBek.push({P,q:P.q,son:null});}}
          /* geri çevirme: bantlar ve geç gelen */
          if(gcMu){gcN++;let ne=0,sp=0,ar=0,gec=false;
            for(const r of m.teams[t]){if(r===p||!r.oyunda||r.rol==='GK')continue;const u=r.x*d,w=Math.abs(r.z-Z_MZ);
              if(u>=Z_PL-7&&w<=10)ne++;else if(u>=Z_PL-14&&u<Z_PL-7&&w<=10)sp++;else if(u>=Z_PL-22&&u<Z_PL-14&&w<=12)ar++;
              if(u>=Z_PL-14&&w<=10){const e=eskiYer(r,15);if(e&&(e.x*d<Z_PL-16.5||Math.abs(e.z-Z_MZ)>20.16))gec=true;}}
            const nb=(ne>0)+(sp>0)+(ar>0);if(nb>=2)gc2++;if(nb>=3)gc3++;if(gec)gcGec++;gcBek.push({P,son:false});}
          /* istek: taşıyandan jestçiye pas */
          for(const I of istBek)if(!I.son&&I.c===p&&P.q===I.p&&P.t-I.t<=1.5){I.son=true;istPas++;}
          return;}
        if(ad==='shot'&&v.p){posTok(v.p.team,'s');for(const G of gcBek)if(!G.sut&&m.t-G.P.t<=2&&v.p.team===G.P.team){G.sut=true;gcSut++;}return;}
        if(ad==='calim'&&v.p){posTok(v.p.team,'d');return;}
        if(ad==='ofsayt'&&v.p){for(const B of dpBek)if(B.q===v.p&&m.t-B.P.t<=3&&!B.ofs){B.ofs=true;dpOfs++;}return;}
      },
      adim(m){
        const b=m.ball,t=m.t;adimN++;
        /* duruş başı: kendi kendine çıkış; sahiplik biter */
        if(m.phase!==oncekiFaz){if(oncekiFaz==='play'&&m.phase==='durus'&&m.durus){const du=m.durus,sd=b.sonDokunan,sd2=sd&&sd.sonDokunus;
            if((du.tur==='tac'||du.tur==='kaleVurusu'||du.tur==='korner')&&sd&&sd.team!=null&&sd.team!==du.takim&&sd2&&t-sd2.t<2){if(sd2.tur==='surus')kendi++;else if(sd2.tur==='kontrol')kendiK++;}}
          if(m.phase!=='play')posBitir();oncekiFaz=m.phase;}
        if(m.phase!=='play')return;
        /* koşu serileri ve konum halkası */
        const halka=adimN%6===0;
        for(const p of m.players){if(!p.oyunda||p.rol==='GK'||p.team==null)continue;const o=durum(p),v=hyp(p.vx,p.vz);
          if(v>=Z_V1){if(o.ks<0)o.ks=t;o.alt=0;}else if(o.ks>=0){if(v<Z_V0){o.alt+=1/60;if(o.alt>0.2){o.ks=-1;o.alt=0;}}else o.alt=0;}
          if(halka){o.rx[ringI]=p.x;o.rz[ringI]=p.z;if(o.dolu<Z_RING)o.dolu++;}
          /* istek: topa sahip takımda yeni jest */
          const j=p.jest;if(j!==o.jest){o.jest=j;const c=b.sahip;
            if(j&&(j.tur==='cagir'||j.tur==='isaret')&&c&&c!==p&&c.team===p.team){const by=c.bakisYon!=null?c.bakisYon:c.yon;
              if(Math.abs(aN(Math.atan2(p.z-c.z,p.x-c.x)-by))<=1.75){istN++;istBek.push({p,c,t,son:false});}}}}
        if(halka)ringI=(ringI+1)%Z_RING;
        /* dokunuşlar */
        const sd=b.sonDokunan;
        if(sd&&(sd!==sonDok||b.surum!==sonSurum)){const d=sd.team!=null?m.dir[sd.team]:1;dok.push({t,p:sd,yon:sd.yon,u:sd.x*d,team:sd.team});if(dok.length>40)dok.shift();}
        sonDok=sd;sonSurum=b.surum;
        /* sahiplik (çeşitlilik): taşıma başlangıcı */
        const sh=b.sahip;if(sh&&sh.team!=null){if(!pos||pos.team!==sh.team){posBitir();pos={team:sh.team,tok:['^'],sahip:sh,sx:sh.x,sz:sh.z};}
          else if(pos.sahip!==sh){pos.sahip=sh;pos.sx=sh.x;pos.sz=sh.z;}}
        /* bekleyenleri sonuçlandır */
        for(let i=vkBek.length-1;i>=0;i--){const V=vkBek[i],k=sonrakiDokunan(V.P.t,t);
          if(k){if(k.p===V.A&&k.t-V.P.t<=2.5){vkT++;const D=V.P1.D,d=V.P1.d;if(D&&D.x*d<V.A.x*d-0.5)vkElen++;}vkBek.splice(i,1);}else if(t-V.P.t>2.5)vkBek.splice(i,1);}
        for(let i=uaBek.length-1;i>=0;i--){const U=uaBek[i],k=sonrakiDokunan(U.P.t,t);
          if(k){if(k.p===U.C&&k.t-U.P.t<=2.5){uaT++;const d=U.P.d;if(U.C.vx*d>2)uaIleri++;}uaBek.splice(i,1);}else if(t-U.P.t>2.5)uaBek.splice(i,1);}
        for(let i=dpBek.length-1;i>=0;i--){const B=dpBek[i];
          if(B.son===null){const ks=kosuBasi(B.q,t);
            if(ks>=0&&t-ks>=0.7){const dt=ks-B.P.t;B.son=dt;dtL.push(+dt.toFixed(2));if(dt<=-0.3)dpE++;else if(dt<0.3)dpA++;else dpG++;}
            else if(t-B.P.t>1.5){B.son=99;dpY++;}}
          if(B.aldi==null){const k=sonrakiDokunan(B.P.t,t);if(k){B.aldi=k.p===B.q;if(B.aldi)dpAldi++;}}
          if(B.son!==null&&B.aldi!=null&&t-B.P.t>3)dpBek.splice(i,1);else if(t-B.P.t>6)dpBek.splice(i,1);}
        for(let i=gcBek.length-1;i>=0;i--){const G=gcBek[i];if(!G.son){const k=sonrakiDokunan(G.P.t,t);if(k){G.son=true;if(k.team===G.P.team&&k.t-G.P.t<=2)gcTam++;}}
          if(t-G.P.t>2.5)gcBek.splice(i,1);}
        for(let i=istBek.length-1;i>=0;i--)if(istBek[i].son||t-istBek[i].t>1.5)istBek.splice(i,1);
      },
      bitir(){
        posBitir();
        const H=[],P3=[],RH=[];for(const t of [0,1]){H.push(Z_ENT(TRI[t]));P3.push(Z_TOP3(TRI[t]));RH.push(Z_ENT(ROL[t]));}
        const ort=a=>{const v=a.filter(x=>x===x);return v.length?v.reduce((s,x)=>s+x,0)/v.length:NaN;};
        const dtv=dtL.filter(x=>x<5);
        return{ham:{zVkElen:[vkElen,vkT],zUaOnce:[uaOnce,uaD],zUaIleri:[uaIleri,uaT],zDpYok:[dpY,dpN],zDpErken:[dpE,dpE+dpA+dpG],zDpAyni:[dpA,dpE+dpA+dpG],zDpGec:[dpG,dpE+dpA+dpG],zDpAldi:[dpAldi,dpN],zDpOfs:[dpOfs,dpN],
            zGc2:[gc2,gcN],zGc3:[gc3,gcN],zGcGec:[gcGec,gcN],zGcTam:[gcTam,gcN],zGcSut:[gcSut,gcN],zIstPas:[istPas,istN]},
          zVkD:vkD,zVkT:vkT,zUaD:uaD,zUaT:uaT,zDpN:dpN,zDpDt:Z_MED(dtv),zGcN:gcN,zIstN:istN,zH3:ort(H),zTop3:ort(P3),zRolH:ort(RH),zKendi:kendi,zKendiK:kendiK,
          zTri:TRI,zRolM:ROL,zDtL:dtv};}
    };
  }
};
