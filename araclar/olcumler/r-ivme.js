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
   T13-0 (2026-10-13; gerçekçilik planı §4 T13): motorun görev etiketiyle (p.gorevAd, p._gorevT; js/mac-dizilis.js gorevYaz) ayrım:
   - Görev değişimi: ivmelenme görevin başlamasından ≤ 0,5 sn sonra; hedef sıçraması görev değişmeden (aynı görevde hedef > 3 m).
   - Efor (p.efor; moveP'nin bu karede kullandığı): < 0,5, 0,5–0,8, ≥ 0,8.
   - Görev tablosu (ozet): görev başına süre payı, ivmelenme payı, görevdeki dakika başına ivmelenme, görev değişiminden ≤ 0,5 sn payı.
   - Eşzamanlılık (“herkes birlikte fırlıyor”): ivmelenme anında son 0,3 sn içinde (kendisi dahil) en az 3 saha oyuncusunun ivmelendiği küme payı.
   Rastlantı çekmez, motor yöntemi çağırmaz. Kullanım: MAC_DENEME_IVME=1 node araclar/mac-deneme.js 10 */
const RI_ACIK=process.env.MAC_DENEME_IVME==='1';
const RI_SINIF=[['v0_dur','başlangıç < 1 m/sn'],['v0_orta','başlangıç 1–3 m/sn'],['v0_hizli','başlangıç ≥ 3 m/sn'],
  ['k_dur','kip dur'],['k_yuru','kip yürü'],['k_tiris','kip tırıs'],['k_kos','kip koş'],['k_hizli','kip hızlı'],['k_depar','kip depar'],['k_yok','kip yok'],
  ['b_sahip','topu süren'],['b_yakin','topa ≤ 5 m'],['b_orta','topa 5–25 m'],['b_uzak','topa > 25 m'],
  ['t_sahip','takımı topa sahip'],['t_savunma','takımı savunmada'],['t_bos','top boşta'],
  ['g_eylem','tetik: kilitli eylem bitti (≤ 0,5 sn)'],['g_hedef','tetik: hedef > 3 m sıçradı (≤ 0,5 sn)'],['g_oyun','tetik: oyun başladı (≤ 1 sn)'],['g_yok','tetik: hiçbiri'],
  /* T13-0 */
  ['g_gorev','görev değişiminden ≤ 0,5 sn'],['g_hedefAyni','aynı görevde hedef > 3 m sıçradı (≤ 0,5 sn)'],
  ['e_dusuk','efor < 0,5'],['e_orta','efor 0,5–0,8'],['e_yuksek','efor ≥ 0,8'],['s_es','eşzamanlı (0,3 sn içinde ≥ 3 oyuncu)'],
  /* T13 teşhisi: kovalama ivmelenmeleri — pasın alıcısı mı, serbest top mu, hedefe uzaklık */
  ['kv_alici','kovala: pasın alıcısı'],['kv_serbest','kovala: serbest top'],['kv_yakin','kovala: hedef < 3 m'],['kv_orta','kovala: hedef 3–7,5 m'],['kv_uzak','kovala: hedef > 7,5 m'],
  /* T18-0 (2026-10-16): aynı karede aynı takımdan ≥ 3 oyuncunun ivmelenmesi (karede eşzamanlılık) */
  ['s_kare','eşzamanlı (aynı karede aynı takımdan ≥ 3)']];
/* T18-0: aynı karede hedefi > 3 m sıçrayan oyuncu sayısı (takım başına) ≥ 3 olan kareler, olayın sınıfına göre: pas çıkışı (sahip bu karede boşaldı, pas var),
   alış (sahip bu karede doldu), kayıp (son sahip takım değişti), duruş sonu (oyun ≤ 1 sn önce başladı), diğer; birim: takım·dk (saha oyuncusu·dk ÷ 10) */
const RI_KARE=[['pas','pas çıkışı'],['alis','alış'],['kayip','top kaybı'],['durus','duruş sonu'],['diger','diğer']];
module.exports={
  bilgi:RI_ACIK?[['— R: ivmelenme teşhisi (T12-0; > 3 m/sn², r-karne tanımı) —',null,0],['İvmelenme / oyuncu·dk (r-ivme)','riToplam',2]]
    .concat(RI_SINIF.map(([k,ad])=>['İvmelenme: '+ad+' / oyuncu·dk','ri_'+k,2]),
      [['Görev değişimi / oyuncu·dk (T13-0)','riGorevDegisim',2],['Görev değişimi (yeni görev efor ≥ 0,8) / oyuncu·dk (T18-0)','riGorevYuksek',2]],
      RI_KARE.map(([k,ad])=>['Aynı karede ≥ 3 oyuncunun hedefi sıçradı: '+ad+' / takım·dk (T18-0)','riKare_'+k,2]),
      [['Aynı karede hedefi sıçrayan oyuncu (≥ 1 olan karelerde ort.; T18-0)','riKareOrt',2]]):[],
  yeni:()=>{
    if(!RI_ACIK)return{};
    const hyp=Math.hypot,dt=1/60,H=new Map(),say={};for(const [k] of RI_SINIF)say[k]=0;let tOy=0,top=0,oyunT=-9,onceki=null,degisim=0;const son=[];   /* son ivmelenmelerin anları (eşzamanlılık) */
    /* görev tablosu: görev → [ivmelenme, süre (oyuncu·sn), görev değişiminden ≤ 0,5 sn ivmelenme] */
    const G={};
    /* T18-0 */
    const kare={pas:0,alis:0,kayip:0,durus:0,diger:0};let yuksekDegisim=0,kareSic=0,kareN=0,oncekiSahip=-2,oncekiSon=-1;
    const kareIv=[0,0],kareSicT=[0,0];
    return{
      adim(m){
        if(m.phase==='play'&&onceki!=='play')oyunT=m.t;onceki=m.phase;
        /* T23-0 (2026-10-18): hız halkası oyun dışında da dolar (r-karne ile aynı düzeltme; eskiden duruşta donuyordu, oyun başı sahte ivmelenme) */
        if(m.phase!=='play'){oncekiSahip=-2;for(const p of m.players){const h=H.get(p);if(!h||!p.oyunda||p.rol==='GK')continue;h.v[h.i]=hyp(p.vx,p.vz);h.i=(h.i+1)%12;h.n++;}return;}
        const b=m.ball,s=b.sahip,st=s&&s.team!=null?s.team:-1;
        /* T18-0: bu karenin olay sınıfı */
        let olay='diger';if(m.t-oyunT<=1)olay='durus';else if(oncekiSahip>=0&&st<0&&(b.pas||b.pasHedef))olay='pas';else if(oncekiSahip<0&&st>=0&&oncekiSahip!==-2)olay='alis';
        if(b.sonTakim!=null&&oncekiSon>=0&&b.sonTakim!==oncekiSon&&olay!=='durus')olay='kayip';
        kareIv[0]=kareIv[1]=0;kareSicT[0]=kareSicT[1]=0;
        for(const p of m.players){if(!p.oyunda||p.rol==='GK')continue;const sp=hyp(p.vx,p.vz);tOy+=dt;
          let h=H.get(p);if(!h){h={v:new Float64Array(12),i:0,n:0,ust:false,son:-9,kilitSon:-9,tx:p.tx,tz:p.tz,hedefT:-9,hedefAyniT:-9,gorevT:p._gorevT};H.set(p,h);}
          const kilit=!!(p.eylem&&p.eylem.kilit);if(kilit)h.kilitSon=m.t;
          const bvk=m._bv&&m._bv.get(p),gAd=bvk&&bvk.vk?'verKac':(p.gorevAd||'yok'),gr=G[gAd]||(G[gAd]=[0,0,0,0]);gr[1]+=dt;   /* T18-0: ver-kaç yan tablodan (motor etiketi yok) */
          if(p._gorevT!==h.gorevT){h.gorevT=p._gorevT;degisim++;gr[3]++;if((p.efor!=null?p.efor:1)>=0.8)yuksekDegisim++;}
          const gorevYeni=m.t-p._gorevT<=0.5;
          if(p.tx!=null&&hyp(p.tx-h.tx,p.tz-h.tz)>3){h.hedefT=m.t;if(!gorevYeni)h.hedefAyniT=m.t;kareSicT[p.team]++;}h.tx=p.tx;h.tz=p.tz;
          if(h.n>=12&&!kilit){const v0=h.v[h.i],a=(sp-v0)/0.2;
            if(a>3){if(!h.ust&&m.t-h.son>1){h.son=m.t;top++;gr[0]++;kareIv[p.team]++;
              say[v0<1?'v0_dur':v0<3?'v0_orta':'v0_hizli']++;
              const k='k_'+(p.kip||'yok');if(say[k]!=null)say[k]++;else say.k_yok++;
              const db=hyp(p.x-b.x,p.z-b.z);say[s===p?'b_sahip':db<=5?'b_yakin':db<=25?'b_orta':'b_uzak']++;
              say[st<0?'t_bos':st===p.team?'t_sahip':'t_savunma']++;
              let g=false;if(m.t-h.kilitSon<=0.5){say.g_eylem++;g=true;}if(m.t-h.hedefT<=0.5){say.g_hedef++;g=true;}if(m.t-oyunT<=1){say.g_oyun++;g=true;}if(!g)say.g_yok++;
              if(gorevYeni){say.g_gorev++;gr[2]++;}if(m.t-h.hedefAyniT<=0.5)say.g_hedefAyni++;
              const ef=p.efor!=null?p.efor:1;say[ef<0.5?'e_dusuk':ef<0.8?'e_orta':'e_yuksek']++;
              while(son.length&&m.t-son[0]>0.3)son.shift();son.push(m.t);if(son.length>=3)say.s_es++;
              if(gAd==='kovala'){say[b.hedefOyuncu===p?'kv_alici':'kv_serbest']++;const dh=hyp(p.tx-p.x,p.tz-p.z);say[dh<3?'kv_yakin':dh<7.5?'kv_orta':'kv_uzak']++;}}
              h.ust=true;}else h.ust=false;}
          h.v[h.i]=sp;h.i=(h.i+1)%12;h.n++;}
        /* T18-0: kare sonu — aynı takımdan ≥ 3 ivmelenme; aynı karede ≥ 3 hedef sıçraması (olay sınıfına göre) */
        for(let t=0;t<2;t++){if(kareIv[t]>=3)say.s_kare+=kareIv[t];if(kareSicT[t]>=1){kareN++;kareSic+=kareSicT[t];}if(kareSicT[t]>=3)kare[olay]++;}
        oncekiSahip=st;oncekiSon=b.sonTakim!=null?b.sonTakim:oncekiSon;},
      bitir(){const dk=tOy/60,tdk=dk/10,r={riToplam:dk?top/dk:NaN,riGorevDegisim:dk?degisim/dk:NaN,riGorevYuksek:dk?yuksekDegisim/dk:NaN,riKareOrt:kareN?kareSic/kareN:NaN,riGorev:G};
        for(const [k] of RI_SINIF)r['ri_'+k]=dk?say[k]/dk:NaN;for(const [k] of RI_KARE)r['riKare_'+k]=tdk?kare[k]/tdk:NaN;return r;}
    };
  },
  /* T13-0: görev tablosu (bütün maçlar): süre payı %, ivmelenme payı %, görevdeki oyuncu·dk başına ivmelenme, görev değişiminden ≤ 0,5 sn % */
  ozet(sonuclar){
    if(!RI_ACIK)return;const T={};let tS=0,tI=0;
    for(const r of sonuclar){const G=r.riGorev;if(!G)continue;for(const k in G){const a=T[k]||(T[k]=[0,0,0,0]);for(let i=0;i<4;i++)a[i]+=G[k][i]||0;tI+=G[k][0];tS+=G[k][1];}}
    if(!tS)return;const f=(x,n)=>Number.isFinite(x)?x.toFixed(n):'—';
    console.log('\n  T13-0 görev tablosu (saha oyuncusu, oyunda): görev · süre % · ivmelenme % · ivmelenme / görev·dk · görev değişiminden ≤ 0,5 sn % · ortalama süre (sn) · giriş / oyuncu·dk');
    for(const [k,a] of Object.entries(T).sort((x,y)=>y[1][0]-x[1][0]))
      console.log('  '+k.padEnd(12)+f(100*a[1]/tS,1).padStart(8)+f(100*a[0]/(tI||1),1).padStart(9)+f(a[1]?a[0]/(a[1]/60):NaN,2).padStart(9)+f(a[0]?100*a[2]/a[0]:NaN,1).padStart(9)+f(a[3]?a[1]/a[3]:NaN,2).padStart(8)+f(a[3]/(tS/60),2).padStart(8));
  }
};
