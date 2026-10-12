'use strict';
/* ============ İvmelenme teşhisi (T12-0, 2026-10-12; gerçekçilik planı §4 T12 “kısa ivmelenme teşhisi”, T1 kabulü ≤ 5 / oyuncu·dk) ============
   Yalnız MAC_DENEME_IVME=1 iken çalışır (teşhis aracıdır; varsayılan çıktı ve süre değişmesin). r-karne'nin tanımıyla aynı sayım: saha oyuncusu,
   kilitli eylemde değil, 0,2 sn pencerede hız büyüklüğü 3 m/sn²'den hızlı artıyor, 1 sn içinde tek. Her sayılan ivmelenme o anki duruma göre
   sınıflanır (bir ivmelenme birden çok sınıfa girebilir; paylar sınıf başına):
   - Başlangıç hızı (pencerenin başı): < 1 m/sn (duruştan), 1–3, ≥ 3.
   - Kip (p.kip; T1): dur, yuru, tiris, kos, hizli, depar.
   - Topla ilişki: topu süren, topa ≤ 5 m, 5–25 m, > 25 m.
   - Takımın durumu: topa sahip, savunmada, boşta (kimse sahip değil).
   - Tetik: kilitli eylem son 0,5 sn içinde bitti (eylem sonu); hedef (tx, tz) son 0,5 sn içinde > 3 m sıçradı; oyun son 1 sn içinde başladı
     (duruştan, santradan); hiçbiri.
   Rastlantı çekmez, motor yöntemi çağırmaz. Kullanım: MAC_DENEME_IVME=1 node araclar/mac-deneme.js 10 */
const RI_ACIK=process.env.MAC_DENEME_IVME==='1';
const RI_SINIF=[['v0_dur','başlangıç < 1 m/sn'],['v0_orta','başlangıç 1–3 m/sn'],['v0_hizli','başlangıç ≥ 3 m/sn'],
  ['k_dur','kip dur'],['k_yuru','kip yürü'],['k_tiris','kip tırıs'],['k_kos','kip koş'],['k_hizli','kip hızlı'],['k_depar','kip depar'],['k_yok','kip yok'],
  ['b_sahip','topu süren'],['b_yakin','topa ≤ 5 m'],['b_orta','topa 5–25 m'],['b_uzak','topa > 25 m'],
  ['t_sahip','takımı topa sahip'],['t_savunma','takımı savunmada'],['t_bos','top boşta'],
  ['g_eylem','tetik: kilitli eylem bitti (≤ 0,5 sn)'],['g_hedef','tetik: hedef > 3 m sıçradı (≤ 0,5 sn)'],['g_oyun','tetik: oyun başladı (≤ 1 sn)'],['g_yok','tetik: hiçbiri']];
module.exports={
  bilgi:RI_ACIK?[['— R: ivmelenme teşhisi (T12-0; > 3 m/sn², r-karne tanımı) —',null,0],['İvmelenme / oyuncu·dk (r-ivme)','riToplam',2]]
    .concat(RI_SINIF.map(([k,ad])=>['İvmelenme: '+ad+' / oyuncu·dk','ri_'+k,2])):[],
  yeni:()=>{
    if(!RI_ACIK)return{};
    const hyp=Math.hypot,dt=1/60,H=new Map(),say={};for(const [k] of RI_SINIF)say[k]=0;let tOy=0,top=0,oyunT=-9,onceki=null;
    return{
      adim(m){
        if(m.phase==='play'&&onceki!=='play')oyunT=m.t;onceki=m.phase;
        if(m.phase!=='play')return;   /* r-karne gibi: yalnız oyunda (hız halkası duruşta donar) */
        const b=m.ball,s=b.sahip,st=s&&s.team!=null?s.team:-1;
        for(const p of m.players){if(!p.oyunda||p.rol==='GK')continue;const sp=hyp(p.vx,p.vz);tOy+=dt;
          let h=H.get(p);if(!h){h={v:new Float64Array(12),i:0,n:0,ust:false,son:-9,kilitSon:-9,tx:p.tx,tz:p.tz,hedefT:-9};H.set(p,h);}
          const kilit=!!(p.eylem&&p.eylem.kilit);if(kilit)h.kilitSon=m.t;
          if(p.tx!=null&&hyp(p.tx-h.tx,p.tz-h.tz)>3){h.hedefT=m.t;}h.tx=p.tx;h.tz=p.tz;
          if(h.n>=12&&!kilit){const v0=h.v[h.i],a=(sp-v0)/0.2;
            if(a>3){if(!h.ust&&m.t-h.son>1){h.son=m.t;top++;
              say[v0<1?'v0_dur':v0<3?'v0_orta':'v0_hizli']++;
              const k='k_'+(p.kip||'yok');if(say[k]!=null)say[k]++;else say.k_yok++;
              const db=hyp(p.x-b.x,p.z-b.z);say[s===p?'b_sahip':db<=5?'b_yakin':db<=25?'b_orta':'b_uzak']++;
              say[st<0?'t_bos':st===p.team?'t_sahip':'t_savunma']++;
              let g=false;if(m.t-h.kilitSon<=0.5){say.g_eylem++;g=true;}if(m.t-h.hedefT<=0.5){say.g_hedef++;g=true;}if(m.t-oyunT<=1){say.g_oyun++;g=true;}if(!g)say.g_yok++;}
              h.ust=true;}else h.ust=false;}
          h.v[h.i]=sp;h.i=(h.i+1)%12;h.n++;}},
      bitir(){const dk=tOy/60,r={riToplam:dk?top/dk:NaN};for(const [k] of RI_SINIF)r['ri_'+k]=dk?say[k]/dk:NaN;return r;}
    };
  }
};
