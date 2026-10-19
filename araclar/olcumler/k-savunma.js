'use strict';
/* ============ Z5-0 (2026-10-20 gece): savunma ve geçişler — FUTBOL_KUTUPHANESI §6.1–6.2, §12.2 (Z5), kutuphane/D-savunma.md, E-gecisler.md ============
   Sözleşme k-kurma ile aynı: rastlantı çekmez, motor yöntemi çağırmaz, oyuncuya ve topa yazmaz; görev etiketlerini okumaz (bağımsız). Takım başına
   (0 ev, 1 konuk; savunan takımın gözüyle) satırlar. Tanımlar:
   - Sürüş: aynı oyuncunun topu ayağında tuttuğu dizi (sahip değişmeden; aradaki kısa dokunuşlar sahipsiz olabilir — en çok 0,6 sn). Rakip
     kalesine doğru ≥ 10 m ilerleyen sürüş sayılır.
   - Müdahalesiz sürüş (2. not): bu ilerleyen sürüşlerden, sürüş boyunca hiçbir savunanın taşıyana 2,5 m'den yaklaşmadığı pay.
   - Sürüşe çıkma süresi: taşıyan kalemize doğru 2,5 m/sn'den hızlı ilerlemeye başladıktan savunanlardan birinin 3 m içine girmesine dek süre (sn;
     ortanca; 4 sn'de kesilir, kesilenler 4 sayılır).
   - Geri koşu (D11): topa sahip olmayan takımın saha oyuncusu, top kendisinin kalesi tarafındayken (≥ 2 m) kendi kalesine doğru ≥ 5 m/sn
     (en az 1 sn kesintisiz) koşarsa bir geri koşu (oyuncu başına bir kez, top onun önüne geçene dek).
   - Karşı pres (E1): top kaybından 0,4–5 sn arasında kaybeden takımın bir oyuncusunun yeni taşıyana (ya da topa) 2,5 m'den yaklaşması (StatsBomb
     karşı pres kesrinin eşi; kayıp anındaki yakınlık sayılmaz); geri kazanım: baskıdan sonra 5 sn içinde topun yeniden kaybedene geçmesi. Lig karşı
     pres kesri ~0,47. */
const KS_PL=52.5;
const KS_MED=a=>{if(!a.length)return NaN;const s=[...a].sort((x,y)=>x-y);return s[s.length>>1];};
module.exports={
  bilgi:[['— Z5: savunma ve geçişler (k-savunma; Z5-0) —',null,0]]
    .concat(...[0,1].map(t=>{const T=t?'konuk':'ev';return[
      [`${T} savunurken: ilerleyen sürüş (≥ 10 m) / maç`,'ksSur'+t,2],[`${T} savunurken: müdahalesiz sürüş %`,'ksMud'+t,1],
      [`${T} savunurken: sürüşe çıkma ortancası (sn)`,'ksCik'+t,2],[`${T}: geri koşu / maç`,'ksGeri'+t,2],
      [`${T}: karşı pres kesri %`,'ksKp'+t,1],[`${T}: karşı presle geri kazanım %`,'ksKpK'+t,1]];})),
  yeni:()=>{
    const SUR=[[0,0],[0,0]],CIK=[[],[]],GERI=[0,0],KP=[[0,0,0],[0,0,0]];   /* SUR[savunan] = [ilerleyen, müdahalesiz]; KP[kaybeden] = [kayıp, baskı, geri kazanım] */
    let sur=null,sonSahip=null,sonSahipT=-9,sonTakim=-1,kayip=null;const geri=new Map();
    const bitirSur=m=>{if(!sur)return;const t=1-sur.p.team;if(sur.ilerleme>=10){SUR[t][0]++;if(!sur.yakin)SUR[t][1]++;}
      if(sur.cikBas!=null&&sur.cikT==null)CIK[t].push(Math.min(4,m.t-sur.cikBas));sur=null;};
    return{
      dinle(){},
      adim(m){
        if(m.phase!=='play'){if(sur)bitirSur(m);kayip=null;geri.clear();sonTakim=-1;return;}
        const b=m.ball,s=b.sahip,dt=1/60;
        /* sürüş */
        if(s&&s.team!=null&&s.rol!=='GK'){
          if(!sur||sur.p!==s){if(sur)bitirSur(m);sur={p:s,u0:s.x*m.dir[s.team],ilerleme:0,yakin:false,cikBas:null,cikT:null};}
          const t=s.team,d=m.dir[t],u=s.x*d;sur.ilerleme=Math.max(sur.ilerleme,u-sur.u0);
          let en=99;for(const o of m.teams[1-t]){if(!o.oyunda||o.rol==='GK')continue;const r=Math.hypot(o.x-s.x,o.z-s.z);if(r<en)en=r;}
          if(en<2.5)sur.yakin=true;
          if(sur.cikBas==null&&s.vx*d>2.5)sur.cikBas=m.t;
          if(sur.cikBas!=null&&sur.cikT==null){if(en<3){sur.cikT=m.t;CIK[1-t].push(m.t-sur.cikBas);}else if(m.t-sur.cikBas>4){sur.cikT=m.t;CIK[1-t].push(4);}}
          sonSahip=s;sonSahipT=m.t;}
        else if(sur&&(m.t-sonSahipT>0.6||s&&s.team==null))bitirSur(m);
        /* karşı pres: sahiplik takımı değişti */
        const st=s&&s.team!=null?s.team:-1;
        /* geri kazanım önce (aynı karede yeni kayıp açılmadan) */
        if(kayip){if(m.t-kayip.t0>5)kayip=null;else if(st===kayip.t){if(kayip.baski)KP[kayip.t][2]++;kayip=null;}}
        if(st>=0&&st!==sonTakim){if(sonTakim>=0){KP[sonTakim][0]++;kayip={t:sonTakim,t0:m.t,baski:false};}sonTakim=st;}
        /* baskı: kayıptan 0,4–5 sn arasında kaybeden takımdan biri yeni taşıyana (ya da topa) 2,5 m içinde — kayıp anındaki yakınlık sayılmaz */
        if(kayip&&!kayip.baski&&m.t-kayip.t0>=0.4){const hx=s?s.x:b.x,hz=s?s.z:b.z;for(const o of m.teams[kayip.t]){if(!o.oyunda||o.rol==='GK')continue;if(Math.hypot(o.x-hx,o.z-hz)<2.5){kayip.baski=true;KP[kayip.t][1]++;break;}}}
        /* geri koşu: topa sahip olmayan takım (son sahip takımın rakibi) */
        if(sonTakim>=0){const t=1-sonTakim,d=m.dir[t],tu=b.x*d;
          for(const p of m.teams[t]){if(!p.oyunda||p.rol==='GK')continue;const pu=p.x*d;let g=geri.get(p);
            if(tu<pu-2&&-p.vx*d>=5){if(!g){g={t:0,say:false};geri.set(p,g);}g.t+=dt;if(g.t>=1&&!g.say){g.say=true;GERI[t]++;}}
            else if(g&&(tu>=pu||-p.vx*d<3.5)){if(tu>=pu)geri.delete(p);else g.t=0;}}}
      },
      bitir(m){
        if(sur&&m)bitirSur(m);
        const r={ham:{}};
        for(let t=0;t<2;t++){r.ham['ksSur'+t]=[SUR[t][0],100];r.ham['ksMud'+t]=[SUR[t][1],SUR[t][0]];
          const c=KS_MED(CIK[t]);r.ham['ksCik'+t]=CIK[t].length?[c,100]:[0,0];r.ham['ksGeri'+t]=[GERI[t],100];
          r.ham['ksKp'+t]=[KP[t][1],KP[t][0]];r.ham['ksKpK'+t]=[KP[t][2],KP[t][1]];}
        return r;}
    };
  }
};
