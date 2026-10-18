'use strict';
/* ============ H1 (2026-10-15): hareketin robotluğu — taşıma yönü, gövde dönüşü, bakış (gerçekçilik planı §4 H1, Ek I) ============
   Top oyundayken, oyundaki saha oyuncuları (kaleci hariç). Rastlantı çekmez, motorun yöntemlerini çağırmaz; yalnız oyuncu ve top alanlarını okur.
   Taşıma: topu süren (b.sahip) serbest sürüşte (koruma, bekletme, çalım niyeti ve denemesi dışında; eylemsiz).
     dokunuşta yön değişimi  ardışık iki sürüş dokunuşunda (aynı sürücü, ≤ 1,2 sn arayla) topun gidiş yönü farkı
     45° ızgarası            niyet yönünün (p.surus.yon) hücum yönüne göre 45°'nin katına ±2° olduğu kare payı (8 yönlü taşıma seçeneği)
     niyet yönü değişimi     ardışık karelerde niyet yönünün 5°'den çok değişmesi (sıklık ve büyüklük)
     kırık                   0,1 sn'lik ardışık pencerelerde sürücünün hızının yönü 20°'den çok döndü (hız > 2 m/sn)
   Gövde (p.yon; eylemsiz kareler): dönüş hızı |Δyon|/dt dönen karelerde (> 30°/sn), yerinde (hız < 1) ve koşarken (≥ 2) ayrı; dönüş ivmesi
     |Δω|/dt (ardışık iki eylemsiz karede, birinde dönüş > 30°/sn).
   Bakış (p.bakisYon, motor iki karede bir yazar): 2 karelik pencerede dünyadaki ve gövdeye göre dönüş hızı; > 60° sıçrama; 90°+ gövde dönüşünde öncülük
     (animasyon-olcum.py “A: baş” tanımının motor karşılığı: 0,8 sn içinde gövde 90°'den çok döndüyse, gövdenin ve bakışın dönüşün yarısına
     varış anları farkı; çizim başı bu hedefe yayla götürür). */
const H_PI=Math.PI,H_ACI=(a,b)=>{let r=a-b;r=Math.atan2(Math.sin(r),Math.cos(r));return r;};
/* histogram: kutu genişliği w, n kutu (son kutu taşanlar) */
const hHist=(w,n)=>({w,a:new Float64Array(n),N:0});
const hEkle=(H,x)=>{let i=Math.floor(x/H.w);if(i<0)i=0;if(i>=H.a.length)i=H.a.length-1;H.a[i]++;H.N++;};
const hYuzde=(H,q)=>{if(!H.N)return NaN;const hedef=q*H.N;let s=0;for(let i=0;i<H.a.length;i++){s+=H.a[i];if(s>=hedef)return(i+0.5)*H.w;}return(H.a.length-0.5)*H.w;};
module.exports={
  bilgi:[
    ['— H: hareketin robotluğu (H1; gerçekçilik planı §4 H1) —',null,0],
    ['Taşıma: dokunuşta yön değişimi ortanca (°)','hTasDon',1,[null,20,'H1']],['Taşıma: dokunuşta yön değişimi ≥ 30° %','hTasDon30',1],
    ['Taşıma: niyet yönü 45° ızgarasında %','hTasIzgara',1],['Taşıma: niyet yönü değişimi / taşıma·sn','hTasKararSn',2],
    ['Taşıma: niyet yönü değişimi ortanca (°)','hTasKararAci',1,[null,25,'H1']],['Taşıma: kırık (0,1 sn\'de > 20°) / taşıma·sn','hTasKirik',2],
    ['Gövde: yerinde dönüş hızı p99 (°/sn)','hGovdeYer99',0],['Gövde: koşarken dönüş hızı p99 (°/sn)','hGovdeKos99',0],
    ['Gövde: dönüş ivmesi p99 (rad/sn²)','hGovdeIvme99',0,[null,120,'H1']],
    ['Bakış: dünyada dönüş hızı p99 (°/sn)','hBakis99',0],['Bakış: gövdeye göre dönüş hızı p99 (°/sn)','hBakisG99',0,[null,410,'H1']],['Bakış: > 60° sıçrama / oyuncu·dk','hBakisSic',2,[null,1,'H1']],
    ['Bakış: 90°+ gövde dönüşünde öncülük ortanca (ms)','hOnculuk',0],['Bakış: öncülük ≥ 150 ms olan dönüş % (bütün başlangıçlar; bilgi — T23-0)','hOnc150',1],
    /* T23-0 (2026-10-18): öncülük başlangıçtaki baş–gövde hizasına göre (çizimdeki A6-0 tanımı): hizalı |baş − gövde| ≤ 0,35 rad, önde (baş dönüş yönünde
       zaten önde: ölçü bir yarım dönüş daha istediği için sayamaz — boyun sınırı), ters (taramanın geri dönüşü sahte öncülük verir). Kabul hizalı satırla
       (borç defteri 14); eski bütün başlangıçlar satırı bilgi */
    ['Bakış: öncülük ≥ 150 ms, hizalı başlayan dönüş %','hOnc150H',1,[50,null,'T23']],['Bakış: öncülük ≥ 150 ms, önde başlayan %','hOnc150O',1],
    ['Bakış: öncülük ≥ 150 ms, ters başlayan %','hOnc150T',1],['Bakış: hizalı başlayan dönüşün payı %','hHizaliPay',1],
    ['Gövde: 90°+ dönüş / oyuncu·dk','hDonusDk',2]],
  yeni:()=>{
    const ortanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b);return S[Math.floor(S.length/2)];};
    const dt=1/60,iz=new Map();let adim=0,tOy=0;
    /* taşıma */
    let tasSon=null,tasDon=[],tasDon30=0,izgara=0,serbestKare=0,kararN=0,kararAci=[],kararSon=null,tasT=0,kirik=0,kirikPen=null;
    /* gövde ve bakış */
    const yer=hHist(10,400),kos=hHist(10,400),ivme=hHist(5,800),bak=hHist(10,400),bakG=hHist(10,400);let bakSic=0;const onc=[];let onc150=0,donusN=0;const oH=[0,0],oO=[0,0],oT=[0,0];   /* T23-0: [≥ 150 ms, hepsi] hizalı / önde / ters */
    return{
      adim(m){adim++;if(m.phase!=='play'){tasSon=null;kirikPen=null;return;}const b=m.ball,t=m.t;
        /* taşıma */
        const s=b.sahip,su=s&&s.surus,serbest=!!(s&&su&&!su.koru&&!su.bekle&&!su.cal&&!s.calim&&!s.eylem&&s.rol!=='GK');
        if(serbest){serbestKare++;tasT+=dt;const hA=m.dir[s.team]>0?0:H_PI,r=H_ACI(su.yon,hA),k=Math.abs(r/(H_PI/4)-Math.round(r/(H_PI/4)))*(H_PI/4);if(k<0.0349)izgara++;
          const sd=s.sonDokunus;
          if(sd&&sd.tur==='surus'&&sd.t===t){const a=Math.atan2(b.vz,b.vx);if(tasSon&&tasSon.p===s&&t-tasSon.t<=1.2){const f=Math.abs(H_ACI(a,tasSon.a))*57.2958;tasDon.push(f);if(f>=30)tasDon30++;}tasSon={p:s,t,a};}
          if(kararSon&&kararSon.p===s&&kararSon.k===adim-1){const f=Math.abs(H_ACI(su.yon,kararSon.yon))*57.2958;if(f>5){kararN++;kararAci.push(f);}}
          kararSon={p:s,yon:su.yon,k:adim};   /* oyuncu nesnesine alan yazılmaz (varlik 128 alan sınırı; TEKNIK_PLAN §8) */
          const sp=Math.hypot(s.vx,s.vz);
          if(!kirikPen||kirikPen.p!==s)kirikPen={p:s,n:0,a:null};
          kirikPen.n++;if(kirikPen.n>=6){kirikPen.n=0;const a=sp>2?Math.atan2(s.vz,s.vx):null;if(a!=null&&kirikPen.a!=null&&Math.abs(H_ACI(a,kirikPen.a))>0.349)kirik++;kirikPen.a=a;}}
        else{if(!s||!tasSon||tasSon.p!==s)tasSon=null;kirikPen=null;}
        /* gövde, bakış, öncülük */
        for(let pi=0;pi<m.players.length;pi++){const p=m.players[pi];if(!p.oyunda||p.rol==='GK')continue;tOy+=dt;
          let h=iz.get(p);if(!h){h={yon:p.yon,w:0,ws:false,bak:[null,null],yz:null,yzY:0,yzK:-9,yu:0,bu:0,bOk:false,g:[],son:-9,k:-9};iz.set(p,h);}
          /* yalnız art arda iki oyun karesi ölçülür (duruşta biriken dönüş ilk oyun karesine yazılmasın) */
          const ard=h.k===adim-1;if(!ard){h.g.length=0;h.bak[0]=h.bak[1]=null;h.yz=null;h.bOk=false;h.ws=false;h.w=0;}
          const dy=ard?H_ACI(p.yon,h.yon):0,w=dy/dt,eylemsiz=!p.eylem,sp=Math.hypot(p.vx,p.vz),wd=Math.abs(w)*57.2958;
          if(eylemsiz&&ard){if(wd>30){if(sp<1)hEkle(yer,wd);else if(sp>=2)hEkle(kos,wd);}
            if(h.ws&&(wd>30||Math.abs(h.w)*57.2958>30))hEkle(ivme,Math.abs(w-h.w)/dt);}
          const yonOnce=h.yon;h.w=w;h.ws=eylemsiz&&ard;h.yon=p.yon;h.yu+=dy;h.k=adim;
          /* bakış: motor her oyuncunun bakışını iki karede bir, sırasına göre değişen karede yazar ((sıra + kare) çift; js/mac-topla.js taramaAdim);
             hızlar oyuncunun ardışık iki yazımından — dünyada ve yazım anındaki gövdeye göre (bakış adımın başında, gövde moveP'de döner: önceki
             karenin gövde yönü) */
          const by=p.bakisYon;
          if(((pi+m.kare)&1)===0&&by!=null){
            if(h.yz!=null&&h.yzK===m.kare-2){const f=Math.abs(H_ACI(by,h.yz));hEkle(bak,f/(2*dt)*57.2958);if(f>1.047)bakSic++;
              hEkle(bakG,Math.abs(H_ACI(H_ACI(by,yonOnce),H_ACI(h.yz,h.yzY)))/(2*dt)*57.2958);}
            h.yz=by;h.yzY=yonOnce;h.yzK=m.kare;}
          if(by!=null){if(h.bOk)h.bu+=H_ACI(by,h.bak[0]);else{h.bu=h.yu+H_ACI(by,p.yon);h.bOk=true;}}else h.bOk=false;
          h.bak[1]=h.bak[0];h.bak[0]=by;
          /* öncülük: son 1,2 sn geçmiş, 0,8 sn içinde gövde 90°'den çok döndüyse */
          if(h.bOk){h.g.push(t,h.yu,h.bu);while(h.g.length&&t-h.g[0]>1.2)h.g.splice(0,3);}else h.g.length=0;
          if(h.bOk&&t-h.son>1.2){const g=h.g;let i0=-1;for(let j=0;j<g.length;j+=3)if(t-g[j]<=0.8){i0=j;break;}
            if(i0>=0&&Math.abs(h.yu-g[i0+1])>H_PI/2){h.son=t;donusN++;const top=h.yu-g[i0+1],sg=Math.sign(top);let tk=null,tb=null;
              for(let j=i0;j<g.length;j+=3){if(tk===null&&(g[j+1]-g[i0+1])*sg>=Math.abs(top)/2)tk=g[j];if(tb===null&&(g[j+2]-g[i0+2])*sg>=Math.abs(top)/2)tb=g[j];}
              if(tk!==null&&tb!==null){const ms=(tk-tb)*1000;onc.push(ms);if(ms>=150)onc150++;
                const bas0=(g[i0+2]-g[i0+1])*sg,K=Math.abs(bas0)<=0.35?oH:bas0>0?oO:oT;K[1]++;if(ms>=150)K[0]++;}}}}},
      bitir(){return{ham:{hTasDon30:[tasDon30,tasDon.length],hTasIzgara:[izgara,serbestKare],hOnc150:[onc150,onc.length],hOnc150H:oH,hOnc150O:oO,hOnc150T:oT,hHizaliPay:[oH[1],onc.length]},
        hTasDon:ortanca(tasDon),hTasKararSn:tasT?kararN/tasT:NaN,hTasKararAci:ortanca(kararAci),hTasKirik:tasT?kirik/tasT:NaN,
        hGovdeYer99:hYuzde(yer,0.99),hGovdeKos99:hYuzde(kos,0.99),hGovdeIvme99:hYuzde(ivme,0.99),
        hBakis99:hYuzde(bak,0.99),hBakisG99:hYuzde(bakG,0.99),hBakisSic:tOy?bakSic/(tOy/60):NaN,hOnculuk:ortanca(onc),hDonusDk:tOy?donusN/(tOy/60):NaN};}
    };
  }
};
