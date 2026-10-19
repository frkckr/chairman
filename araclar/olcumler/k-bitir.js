'use strict';
/* ============ Z6-0 (2026-10-20 gece): bitiriş — FUTBOL_KUTUPHANESI §5, §12.2 (Z6), kutuphane/C-bitiris.md ============
   Sözleşme k-kurma ile aynı: rastlantı çekmez, motor yöntemi çağırmaz, oyuncuya ve topa yazmaz. Şut anında ('shot' olayı) okunur. Tanımlar:
   - Açık oran: şutçunun gördüğü kale ağzı açısının kalecinin örtmediği payı ÷ kale çizgisinin ortasında ayakta duran kalecinin bırakacağı pay
     (kalecinin uzanması ayakta ve kapanmada 1,6 m, uçuşta / kalkışta / düşüşte 0,35 m; motorun Z6a ölçüsünün bağımsız eşi). Kaleci sahada yoksa 2.
   - Boş kaleye şut: açık oran ≥ 1,8 (kaleci yerde ya da yerinden çıkmış).
   - Bire bir: şutçu kaleye 16 m içinde ve şutçuyla kale ortası arasındaki 1,5 m'lik koridorda (kaleci hariç) savunan yok.
   - Gol: şuttan sonra 4 sn içinde aynı takımın golü (ilk şut sayılır).
   - Şut türü: vuruş eyleminin planlanan türü (sutPlan.tur: plase, sert, falso, trivela, asirtma, dusen). */
const KB_PL=52.5,KB_MZ=34,KB_GW=3.66;
const KB_MED=a=>{if(!a.length)return NaN;const s=[...a].sort((x,y)=>x-y);return s[s.length>>1];};
function kbOran(m,p,x0,z0){
  const t=1-p.team,gk=m.teams[t].find(q=>q.rol==='GK'&&q.oyunda),d=m.dir[p.team],gx=d*KB_PL;if(!gk)return 2;
  const a1=Math.atan2(KB_MZ-KB_GW-z0,gx-x0),a2=Math.atan2(KB_MZ+KB_GW-z0,gx-x0),lo=Math.min(a1,a2),hi=Math.max(a1,a2),w=hi-lo;if(w<0.02)return 1;
  const ortu=(cx,cz,r)=>{const dk=Math.max(0.5,Math.hypot(cx-x0,cz-z0)),ak=Math.atan2(cz-z0,cx-x0),h=Math.atan(r/dk);return Math.max(0,Math.min(hi,ak+h)-Math.max(lo,ak-h));};
  const e=gk.eylem,yer=!!(e&&e.kilit&&(e.ad==='ucus'||e.ad==='kalkis'||e.ad==='dusus'));
  return (1-ortu(gk.x,gk.z,yer?0.35:1.6)/w)/Math.max(0.05,1-ortu(gx,KB_MZ,1.6)/w);}
const KB_TUR=['plase','sert','falso','asirtma'];
module.exports={
  bilgi:[['— Z6: bitiriş (k-bitir; Z6-0) —',null,0],
    ['Şut anında açık oran ortancası','kbOranMed',2],['Boş kaleye şut (açık oran ≥ 1,8) / maç','kbBos',2],['Boş kaleye şutta gol %','kbBosGol',1],
    ['Gol / şut: açık oran < 0,8 %','kbG0',1],['Gol / şut: açık oran 0,8–1,3 %','kbG1',1],['Gol / şut: açık oran > 1,3 %','kbG2',1],
    ['Şut payı: açık oran < 0,8 %','kbP0',1],
    ['Bire bir şut / maç','kbBb',2],['Bire birde gol %','kbBbGol',1],['Bire birde plase %','kbBbPlase',1],['Bire birde aşırtma %','kbBbAs',1],
    ...KB_TUR.map(k=>[`Şut türü: ${k} %`,'kbT_'+k,1])],
  yeni:()=>{
    const O=[],B=[0,0],G=[[0,0],[0,0],[0,0]],BB=[0,0,0,0],T={};let n=0,son=null;for(const k of KB_TUR)T[k]=0;
    return{
      dinle(ad,v,m){
        if(!m||!v)return;
        if(ad==='shot'&&v.p&&v.p.team!=null&&m.phase==='play'){const p=v.p,b=m.ball,x0=b.x,z0=b.z,d=m.dir[p.team],gx=d*KB_PL;
          const r=kbOran(m,p,x0,z0);O.push(r);n++;const k=r<0.8?0:r<=1.3?1:2;G[k][1]++;
          const bos=r>=1.8;if(bos)B[0]++;
          const L=Math.hypot(gx-x0,KB_MZ-z0);let bb=L<16;if(bb)for(const o of m.teams[1-p.team]){if(!o.oyunda||o.rol==='GK')continue;
            const ux=gx-x0,uz=KB_MZ-z0,t=((o.x-x0)*ux+(o.z-z0)*uz)/(L*L);if(t<0||t>1)continue;const px=x0+ux*t,pz=z0+uz*t;if(Math.hypot(o.x-px,o.z-pz)<1.5){bb=false;break;}}
          const e=p.eylem,tur=e&&e.sutPlan&&e.sutPlan.tur||null;if(tur&&T[tur]!=null)T[tur]++;
          if(bb){BB[0]++;if(tur==='plase')BB[2]++;if(tur==='asirtma')BB[3]++;}
          son={t:p.team,tm:m.t,k,bos,bb,gol:false};}
        else if(ad==='goal'&&son&&!son.gol&&v.team===son.t&&m.t-son.tm<=4){son.gol=true;G[son.k][0]++;if(son.bos)B[1]++;if(son.bb)BB[1]++;}
      },
      adim(){},
      bitir(){
        const r={ham:{}},med=KB_MED(O);
        r.ham.kbOranMed=O.length?[med,100]:[0,0];r.ham.kbBos=[B[0],100];r.ham.kbBosGol=[B[1],B[0]];
        for(let k=0;k<3;k++)r.ham['kbG'+k]=[G[k][0],G[k][1]];r.ham.kbP0=[G[0][1],n];
        r.ham.kbBb=[BB[0],100];r.ham.kbBbGol=[BB[1],BB[0]];r.ham.kbBbPlase=[BB[2],BB[0]];r.ham.kbBbAs=[BB[3],BB[0]];
        for(const k of KB_TUR)r.ham['kbT_'+k]=[T[k],n];
        return r;}
    };
  }
};
