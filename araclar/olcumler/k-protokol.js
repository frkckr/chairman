'use strict';
/* ============ S1-0 (2026-10-20): sahne protokolleri ölçüsü — S1 planı §1.12, FUTBOL_KUTUPHANESI §12.15, kutuphane/L-sahne-protokolleri.md ============
   k-sahne.js'e (Z2) dokunmaz; onun süre satırları (ksS_*) sahnelerin süresini zaten yansıtır. Sözleşme k-sahne ile aynı: rastlantı çekmez,
   motor yöntemi çağırmaz, oyuncuya, hakeme ve topa yazmaz; yalnız olayları ve m.phase, m.durus, m.sonKullanim, m.refs, m.kenar alanlarını okur.
   Satır önekleri: s1D_ ortak düdük (S1-0); alanlar kendi adımında s1a_ (serbest vuruş), s1d_ (kart), s1b_ (penaltı), s1c_ (gol), s1e_ (rutin) ekler.
   Tanımlar (s1D_):
   - Seremonili düdük: 'duduk' olayı v.seremoni ile (js/mac-sahne.js dudukCal; gol sonrası santrada S1c). Sahibi v.sahip ('baraj', 'penalti',
     'kart'); santrada v.tur 'santra'. Sayılar maç başına.
   - Kullanım: duruşun kullanılması — m.sonKullanim'ın yeni nesnesi (js/mac-kurallar.js durusKullan; kısa geri dönüşte ikinci kez). Duruş, kullanım
     oyunu hemen başlatsa da (m.durus boşalır) önceki adımın duruşudur; düdük alanları (du.dudukGerek, du.dudukT, du.dudukBek) ve du.t o adımda okunur.
   - Düdük → kullanım: kullanımda du.t − du.dudukT (gerçek sn); ortanca maç başına ortancanın ortalaması (k-duran gibi), ≥ 1 sn % havuzdan.
   - Düdükte hakem durmuş: olay anında orta hakemin hızı (spd; önceki adımın hareketi) ≤ 0,3 m/sn, havuzdan.
   - Düdüksüz kullanım: du.dudukGerek var, du.dudukT yok (kabul 0). Düdükten önce kullanım: du.dudukT var, kullanım düdüğün beklemesi dolmadan
     (du.t < dudukT + dudukBek; kabul 0).
   - Sağlıkçı (bilgi; L.9 madde 5, K1'in sonucu): sağlıkçının kulübedeki yerinden (ev) 1,5 m'den uzakta geçirdiği gerçek sn / maç (iki takımın dört
     sağlıkçısının toplamı; maç öncesi dahil). */
const S1D_SAHIP=['baraj','penalti','kart','santra'];
const S1D_AD={baraj:'barajlı serbest vuruş',penalti:'penaltı',kart:'kart',santra:'santra'};
const s1Ortanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b),n=S.length;return n%2?S[(n-1)/2]:(S[n/2-1]+S[n/2])/2;};
module.exports={
  bilgi:[['— S1: sahne protokolleri (k-protokol; S1-0 ortak düdük) —',null,0],['Seremonili düdük / maç','s1D_n',2]]
    .concat(S1D_SAHIP.map(k=>['Seremonili düdük / maç: '+S1D_AD[k],'s1D_'+k,2]))
    .concat([['Düdük → kullanım ortancası (gerçek sn)','s1D_bek',2],['Düdük → kullanım ≥ 1 sn %','s1D_bek1',1],
      ['Düdükte hakem ≤ 0,3 m/sn %','s1D_dur',1],['Düdüksüz kullanım / maç (kabul 0)','s1D_dudukYok',2],
      ['Düdükten önce kullanım / maç (kabul 0)','s1D_once',2],
      ['Sağlıkçı: kulübedeki yerinden 1,5 m uzakta (kişi × gerçek sn / maç; bilgi)','s1D_saglikci',1]]),
  yeni:()=>{
    const N={};for(const k of S1D_SAHIP)N[k]=0;
    let n=0,dur=0,durN=0,yok=0,once=0,bek1=0,sg=0,sonK=null,oncekiDu=null;const bek=[];
    return{
      dinle(ad,v,m){
        if(ad!=='duduk'||!v||!v.seremoni||!m)return;n++;
        const k=v.tur==='santra'?'santra':v.sahip;if(k in N)N[k]++;
        const h=m.refs&&m.refs[0];if(h){durN++;if((h.spd||0)<=0.3)dur++;}},
      adim(m){
        const K=m.sonKullanim,du=m.phase==='durus'&&m.durus?m.durus:oncekiDu;
        if(K&&K!==sonK&&du&&du.dudukGerek){
          if(du.dudukT==null)yok++;
          else{const s=du.t-du.dudukT;bek.push(s);if(s>=1)bek1++;if(s<(du.dudukBek||0)-1e-6)once++;}}
        sonK=K;oncekiDu=m.phase==='durus'?m.durus:null;
        if(m.kenar)for(const s of m.kenar)if(s.kind==='saglikci'&&s.ev&&Math.hypot(s.x-s.ev.x,s.z-s.ev.z)>1.5)sg+=1/60;},
      bitir(){
        const r={ham:{},s1D_n:n,s1D_dudukYok:yok,s1D_once:once,s1D_bek:s1Ortanca(bek),s1D_saglikci:sg};
        for(const k of S1D_SAHIP)r['s1D_'+k]=N[k];
        r.ham.s1D_bek1=[bek1,bek.length];r.ham.s1D_dur=[dur,durN];
        return r;}
    };
  }
};
