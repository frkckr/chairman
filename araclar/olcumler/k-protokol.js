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
     sağlıkçısının toplamı; maç öncesi dahil).
   Tanımlar (s1a_; S1a, 2026-10-20 — seremonili barajlı serbest vuruş, du.hk.s1 olan duruşlar; m.durus kimliğiyle izlenir):
   - Evreye giriş: du.hk.evre'nin ilk görüldüğü du.t (duruşun başından gerçek sn); maç başına ortanca, maçların ortalaması.
   - Varyant: du.hk.tur (sakin, olagan, uzun) %; kaosT: planlanan kaos süresi (du.hk.kaosT), ortanca.
   - Adımlamadan önce dizili: 'adim'in ilk adımında bütün üyeler (oyunda) son yerine (du.barajYer) ≤ 1 m — kaos ölçüsü, bugün (K1) %100.
   - Kaosta topa en yakın üye (m): 'kaos' boyunca üyelerin topun yerine (du.x, du.z) en küçük uzaklığı; 9,15 m içindeki savunmacı (kaleci hariç):
     kaostaki en çok sayı.
   - Üye yolu ÷ doğrudan uzaklık: duruş boyunca üyelerin yürüdüğü yolun toplamı ÷ ilk konumdan son konuma uzaklıkların toplamı (doğrudan ≥ 0,5 m).
   - İşaret ve jest / duruş: 'seremoni' tur 'it' ve 'bekle' olayları, kalecinin kaydırması (du.hk.kayI); heykel % (du.hk.heykelP).
   - Adımlamada yüz gidiş yönünde: 'adim'de hakemin hızı > 0,5 m/sn olan karelerde gövdenin yönü ile gidişin kosinüsü > 0,5 (kare payı).
   - Düdük → koşu: ilk kullanımda (m.sonKullanim'ın yeni nesnesi; vuruşta koşunun başı) du.t − du.dudukT; ≥ 1 sn %. Düdük → temas: 'kullanim'
     olayında (kullananın ilk dokunuşu) du.t − du.dudukT.
   - Düdükte hakem: 'duduk' olayı (seremonili) anında hızı ≤ 0,3 m/sn %; arkada: toptan kaleye göre ≥ 1 m geride ve gövdesi barajın ortasına
     (du.hk.wc) 45° içinde %.
   - Koşu başında kaleci: ilk kullanımda kalecinin görev yerine (du.gorev) uzaklığı (m), ortanca. */
const S1D_SAHIP=['baraj','penalti','kart','santra'];
const S1D_AD={baraj:'barajlı serbest vuruş',penalti:'penaltı',kart:'kart',santra:'santra'};
const s1Ortanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b),n=S.length;return n%2?S[(n-1)/2]:(S[n/2-1]+S[n/2])/2;};
const s1Ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN;
const S1A_EVRE=['top','kaos','adim','cizgi','dizil','yer','dur','duduk'],S1A_TUR=['sakin','olagan','uzun'];
module.exports={
  bilgi:[['— S1: sahne protokolleri (k-protokol; S1-0 ortak düdük) —',null,0],['Seremonili düdük / maç','s1D_n',2]]
    .concat(S1D_SAHIP.map(k=>['Seremonili düdük / maç: '+S1D_AD[k],'s1D_'+k,2]))
    .concat([['Düdük → kullanım ortancası (gerçek sn)','s1D_bek',2],['Düdük → kullanım ≥ 1 sn %','s1D_bek1',1],
      ['Düdükte hakem ≤ 0,3 m/sn %','s1D_dur',1],['Düdüksüz kullanım / maç (kabul 0)','s1D_dudukYok',2],
      ['Düdükten önce kullanım / maç (kabul 0)','s1D_once',2],
      ['Sağlıkçı: kulübedeki yerinden 1,5 m uzakta (kişi × gerçek sn / maç; bilgi)','s1D_saglikci',1]])
    .concat([['— S1a: seremonili barajlı serbest vuruş (k-protokol) —',null,0],['S1a: seremonili barajlı vuruş / maç','s1a_n',2]])
    .concat(S1A_EVRE.map(e=>['S1a: evreye giriş, '+e+' (duruşun başından gerçek sn; ortanca)','s1a_ev_'+e,1]))
    .concat(S1A_TUR.map(k=>['S1a: varyant '+k+' %','s1a_tur_'+k,1]))
    .concat([['S1a: planlanan kaos (gerçek sn; ortanca)','s1a_kaosT',1],['S1a: adımlamadan önce baraj dizili (≤ 1 m) %','s1a_once',1],
      ['S1a: kaosta üyenin topa en yakın uzaklığı (m; ortanca)','s1a_yakin',2],['S1a: kaosta topa 9,15 m içinde savunmacı (en çok; ortalama)','s1a_kalabalik',2],
      ['S1a: üye yolu ÷ doğrudan uzaklık (ortanca)','s1a_yol',2],['S1a: geri itme işareti / duruş','s1a_it',2],['S1a: kalecinin kaydırması / duruş','s1a_kay',2],
      ['S1a: "düdüğü bekle" işareti / duruş','s1a_bekle',2],['S1a: heykel %','s1a_heykel',1],['S1a: adımlamada yüz gidiş yönünde (kare) %','s1a_yuz',1],
      ['S1a: düdük → koşu (gerçek sn; ortanca)','s1a_dudukKos',2],['S1a: düdük → koşu ≥ 1 sn %','s1a_duduk1',1],['S1a: düdük → temas (gerçek sn; ortanca)','s1a_dudukTemas',2],
      ['S1a: düdükte hakem durmuş (≤ 0,3 m/sn) %','s1a_hkDur',1],['S1a: düdükte hakem vurucunun arkasında, yüzü barajda %','s1a_hkArka',1],
      ['S1a: koşu başında kalecinin görev yerine uzaklığı (m; ortanca)','s1a_kaleci',2]]),
  yeni:()=>{
    const N={};for(const k of S1D_SAHIP)N[k]=0;
    let n=0,dur=0,durN=0,yok=0,once=0,bek1=0,sg=0,sonK=null,oncekiDu=null;const bek=[];
    /* S1a: duruşun kaydı (A) ve kapanan kayıtlar (AL) */
    let A=null;const AL=[];
    const aYeni=du=>{const yol=new Map();for(const p of du.barajdakiler||[])yol.set(p,{s:0,x:p.x,z:p.z,x0:p.x,z0:p.z});
      return{du,ev:{},yol,once:null,yakin:Infinity,k9:0,it:0,bekle:0,adN:0,adI:0,kos:null,temas:null,hkDur:null,hkArka:null,kaleci:null};};
    const aKapat=()=>{const a=A;A=null;if(!a)return;const H=a.du.hk;a.tur=H.tur;a.kaosT=H.kaosT;a.kay=H.kayI||0;a.heykel=!!H.heykelP;
      let s=0,dd=0;for(const k of a.yol.values()){s+=k.s;dd+=Math.hypot(k.x-k.x0,k.z-k.z0);}a.yolOran=dd>=0.5?s/dd:null;AL.push(a);};
    const aIzle=(a,du,m)=>{const H=du.hk,e=H.evre,h=m.refs[0];if(a.ev[e]==null)a.ev[e]=du.t;
      for(const [p,k] of a.yol){k.s+=Math.hypot(p.x-k.x,p.z-k.z);k.x=p.x;k.z=p.z;}
      if(e==='adim'&&a.once==null){let hepsi=true;for(const [p,y] of du.barajYer)if(p.oyunda&&Math.hypot(p.x-y.x,p.z-y.z)>1.0)hepsi=false;a.once=hepsi;}
      if(e==='kaos'){for(const p of du.barajdakiler)if(p.oyunda){const L=Math.hypot(p.x-du.x,p.z-du.z);if(L<a.yakin)a.yakin=L;}
        let k9=0;for(const q of m.teams[1-du.takim])if(q.oyunda&&q.rol!=='GK'&&Math.hypot(q.x-du.x,q.z-du.z)<9.15)k9++;if(k9>a.k9)a.k9=k9;}
      if(e==='adim'&&h){const v=Math.hypot(h.vx||0,h.vz||0);if(v>0.5){a.adN++;if((Math.cos(h.yon)*h.vx+Math.sin(h.yon)*h.vz)/v>0.5)a.adI++;}}};
    return{
      dinle(ad,v,m){
        if(!v||!m)return;
        if(A&&m.durus===A.du){
          if(ad==='seremoni'){if(v.tur==='it')A.it++;else if(v.tur==='bekle')A.bekle++;}
          else if(ad==='duduk'&&v.seremoni&&A.hkDur==null){const h=m.refs[0],du=A.du,d=m.dir[du.takim],W=du.hk.wc;A.hkDur=(h.spd||0)<=0.3;
            let ok=(h.x-du.x)*d<=-1;if(ok&&W){let f=Math.atan2(W.z-h.z,W.x-h.x)-h.yon;f=Math.atan2(Math.sin(f),Math.cos(f));ok=Math.abs(f)<=Math.PI/4;}A.hkArka=ok;}}
        if(A&&ad==='kullanim'&&v.du===A.du&&A.temas==null&&A.du.dudukT!=null)A.temas=A.du.t-A.du.dudukT;
        if(ad!=='duduk'||!v.seremoni)return;n++;
        const k=v.tur==='santra'?'santra':v.sahip;if(k in N)N[k]++;
        const h=m.refs&&m.refs[0];if(h){durN++;if((h.spd||0)<=0.3)dur++;}},
      adim(m){
        const K=m.sonKullanim,du=m.phase==='durus'&&m.durus?m.durus:oncekiDu;
        if(K&&K!==sonK&&du&&du.dudukGerek){
          if(du.dudukT==null)yok++;
          else{const s=du.t-du.dudukT;bek.push(s);if(s>=1)bek1++;if(s<(du.dudukBek||0)-1e-6)once++;}}
        /* S1a: ilk kullanım (vuruşta koşunun başı) ve kalecinin görev yerine uzaklığı */
        if(A&&K&&K!==sonK&&du===A.du&&A.kos==null&&du.dudukT!=null){A.kos=du.t-du.dudukT;
          const kl=m.teams[1-du.takim].find(q=>q.rol==='GK'&&q.oyunda),g=kl&&du.gorev?du.gorev.get(kl):null;if(g&&g.hx!=null)A.kaleci=Math.hypot(kl.x-g.hx,kl.z-g.hz);}
        sonK=K;oncekiDu=m.phase==='durus'?m.durus:null;
        const cur=m.phase==='durus'&&m.durus&&m.durus.hk&&m.durus.hk.s1?m.durus:null;
        if(A&&A.du!==cur)aKapat();
        if(cur){if(!A)A=aYeni(cur);aIzle(A,cur,m);}
        if(m.kenar)for(const s of m.kenar)if(s.kind==='saglikci'&&s.ev&&Math.hypot(s.x-s.ev.x,s.z-s.ev.z)>1.5)sg+=1/60;},
      bitir(){
        aKapat();
        const r={ham:{},s1D_n:n,s1D_dudukYok:yok,s1D_once:once,s1D_bek:s1Ortanca(bek),s1D_saglikci:sg};
        for(const k of S1D_SAHIP)r['s1D_'+k]=N[k];
        r.ham.s1D_bek1=[bek1,bek.length];r.ham.s1D_dur=[dur,durN];
        /* S1a */
        const L=AL,say=f=>L.filter(f).length,sayi=f=>L.map(f).filter(x=>x!=null&&Number.isFinite(x));
        r.s1a_n=L.length;
        for(const e of S1A_EVRE)r['s1a_ev_'+e]=s1Ortanca(sayi(a=>a.ev[e]));
        for(const k of S1A_TUR)r.ham['s1a_tur_'+k]=[say(a=>a.tur===k),L.length];
        r.s1a_kaosT=s1Ortanca(sayi(a=>a.kaosT));r.ham.s1a_once=[say(a=>a.once===true),say(a=>a.once!=null)];
        r.s1a_yakin=s1Ortanca(sayi(a=>a.yakin));r.s1a_kalabalik=s1Ort(sayi(a=>a.ev.kaos!=null?a.k9:null));r.s1a_yol=s1Ortanca(sayi(a=>a.yolOran));
        r.s1a_it=s1Ort(sayi(a=>a.it));r.s1a_kay=s1Ort(sayi(a=>a.kay));r.s1a_bekle=s1Ort(sayi(a=>a.bekle));r.ham.s1a_heykel=[say(a=>a.heykel),L.length];
        r.ham.s1a_yuz=[L.reduce((x,a)=>x+a.adI,0),L.reduce((x,a)=>x+a.adN,0)];
        const K=sayi(a=>a.kos);r.s1a_dudukKos=s1Ortanca(K);r.ham.s1a_duduk1=[K.filter(x=>x>=1).length,K.length];r.s1a_dudukTemas=s1Ortanca(sayi(a=>a.temas));
        r.ham.s1a_hkDur=[say(a=>a.hkDur===true),say(a=>a.hkDur!=null)];r.ham.s1a_hkArka=[say(a=>a.hkArka===true),say(a=>a.hkArka!=null)];
        r.s1a_kaleci=s1Ortanca(sayi(a=>a.kaleci));
        return r;}
    };
  }
};
