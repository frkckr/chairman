/* ============ Gerçekçilik planı T5 senaryosu: müdahalenin teması (T5c, 2026-10-09) ============
   Boş sahada hücumcu (ev sahibi orta saha) topu sürer (2 ya da 5 m/sn; top ayağının 0,4 m — kontrolde — ya da 0,9 m önünde — açıkta); savunmacı
   (konuk orta saha; sürüş 0,5–0,8 sn oturduktan sonra) dört yönden gelir (önden, yandan, arka yandan, arkadan) ve ayakta müdahaleye motorun kendi işleviyle başlar (mudahaleBaslat;
   temas mudahaleSonuc). Savunmacının hızı bağıl hız dilimlerini tarar. Başlangıçta motorun saf tahmini alınır (mudahaleTahmin: topa önce değme,
   faul olasılığı; hakemin görmesinden önce) ve gerçekleşenle karşılaştırılır (faul: çalınan ya da hakemin görmediği).
   [1] Kabul: her yönde ve toplamda |tahmin − gerçek| ≤ 10 puan — topa önce değme ve faul.
   [2] Kabul: her yönde faul oranı bağıl hızla düzgün artar (komşu dilimde 5 puandan büyük düşüş yok; dilimde ≥ 20 deneme).
   ARA DURUM (2026-10-09 akşam, T5c sürüyor): kabul satırları yazılır, çıkış kodu daima 0 (bilgi). Tahmin önden ve arkadan dilimlerinde gerçekten
   uzak (önden faul tahmini düşük, arkadan topa önce değme tahmini düşük) ve gerçek faul arkadan dilimlerinde hızla azalıyor; düzeltme ve kapıya
   yükseltme YOL_HARITASI devam notundaki sıradaki iştir. Kullanım: node araclar/mac-deneme.js --senaryo c-temas [N=30 hücre başına] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||30,dt=1/60,t0=Date.now();let sd=(tohum||1)*2654435761>>>0;
  const r=()=>{sd=(sd+0x6D2B79F5)>>>0;let t=sd;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};   /* kurulum rastlantısı (mulberry32) */
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const tahmin=vm.runInContext('mudahaleTahmin',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  /* yön: savunmacının topun temas anındaki yerine göre geldiği yön (hücumcunun gidişine göre derece; 0 önden, 90 yandan, 135 arka yandan, 180 arkadan) */
  const YON=[[0,'önden'],[90,'yandan'],[135,'arka yandan'],[180,'arkadan']],VA=[2,5],OFF=[[0.4,'kontrol'],[0.9,'açık']],VD=[0,1.5,3,4.5,6];
  const DIL=['<2','2–3,5','3,5–5','≥5'],dil=v=>v<2?0:v<3.5?1:v<5?2:3;
  const H={};let deneme=0,olaysiz=0;
  for(const [aci,ad] of YON){const G=H[ad]={n:0,pT:0,pF:0,gT:0,gF:0,pA:0,gA:0,d:DIL.map(()=>({n:0,f:0,pF:0}))};
    for(const va of VA)for(const [off] of OFF)for(const vd of VD)for(let i=0;i<n;i++){deneme++;let son=null;
      const m=kur((tohum||1)*1000+deneme,(ad2,v)=>{if(ad2==='mudahaleSonuc'&&v&&v.p===D&&!son)son=v;}),b=m.ball,d=m.dir[0],hy=d>0?0:Math.PI;
      const A=m.teams[0][7],D=m.teams[1][6];bosalt(m,[A,D]);
      const ax=d*(-5+10*r()),az=34+(r()-0.5)*16;
      Object.assign(A,{x:ax,z:az,tx:ax,tz:az,vx:d*va,vz:0,spd:va,yon:hy,eylem:null,kickCd:0,surus:null,denge:1,oyunda:true,calim:null,yutma:null});
      Object.assign(b,{x:ax+d*off,z:az,y:0,vx:d*va,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:A});
      m.phase='play';m.phaseT=1;m.durus=null;m.topDegisti();m.sahipYap(A);A.surus={yon:hy,hiz:va>3?1:0.5};
      /* sürüş oturur: savunmacı sahada değilken 0,5–0,8 sn sürer (top dokunuşla önde, sürücü kendi temposunda) */
      D.oyunda=false;D.x=D.tx=-300;D.z=D.tz=-300;const K0=30+Math.floor(r()*18);
      for(let k=0;k<K0;k++){A.kararT=99;if(b.sahip===A&&!A.surus)A.surus={yon:hy,hiz:va>3?1:0.5};m.step(dt);}
      if(b.sonDokunan!==A||Math.hypot(b.x-A.x,b.z-A.z)>1.6){olaysiz++;continue;}
      /* savunmacı: topun 0,18 sn sonraki yerinin, gelişi yönünde 0,75 m (erişim) + kendi yolu kadar ötesinde, ona doğru vd hızla (±10°) */
      const T=0.18,tx=b.x+b.vx*T,tz=b.z+b.vz*T,yan=r()<0.5?1:-1,a=hy+yan*(aci+(r()-0.5)*20)*Math.PI/180,L=0.78+vd*T*0.6;
      const dx=tx+Math.cos(a)*L,dz=tz+Math.sin(a)*L,ya=Math.atan2(tz-dz,tx-dx);
      Object.assign(D,{x:dx,z:dz,tx:dx,tz:dz,vx:Math.cos(ya)*vd,vz:Math.sin(ya)*vd,spd:vd,yon:ya,eylem:null,kickCd:0,surus:null,denge:1,oyunda:true,calim:null,yutma:null});
      const P=tahmin(m,D,A),vrel=Math.hypot(D.vx-A.vx,D.vz-A.vz);
      m.mudahaleBaslat(D,A,tx,tz,aci>=135?'toparlanma':aci>=90?'yan':'acik');
      for(let k=0;k<60*0.8&&!son;k++){A.kararT=99;if(b.sahip===A&&!A.surus)A.surus={yon:hy,hiz:va>3?1:0.5};m.step(dt);if(m.phase!=='play'&&!son)break;}
      if(!son){olaysiz++;continue;}
      const faul=!!(son.faul||son.gorulmedi);G.n++;G.pT+=P.Ptop;G.pF+=P.Pfaul;if(son.topaOnce)G.gT++;if(faul)G.gF++;G.pA+=P.Pdeg;if(son.adamaDegdi)G.gA++;
      const c=G.d[dil(vrel)];c.n++;c.pF+=P.Pfaul;if(faul)c.f++;}}
  const y=x=>(100*x).toFixed(0).padStart(4)+'%';
  console.log(`\nT5 · müdahalenin teması · ${deneme} deneme (ayakta müdahale; tahmin = mudahaleTahmin, başlangıçta) · ${((Date.now()-t0)/1000).toFixed(1)} sn\n`);
  console.log('  Yön              n   topa önce: tahmin  gerçek     faul: tahmin  gerçek     faul (gerçek / tahmin) bağıl hız: '+DIL.join(' · '));
  let ok1=true,ok2=true;const T={n:0,pT:0,pF:0,gT:0,gF:0};
  for(const [,ad] of YON){const G=H[ad];if(!G.n)continue;for(const k of ['n','pT','pF','gT','gF'])T[k]+=G[k];
    const dT=Math.abs(G.pT-G.gT)/G.n,dF=Math.abs(G.pF-G.gF)/G.n;if(dT>0.1||dF>0.1)ok1=false;
    let onceki=-1;for(const c of G.d){if(c.n<20)continue;const f=c.f/c.n;if(f<onceki-0.05)ok2=false;onceki=Math.max(onceki,f);}
    console.log((dT>0.1||dF>0.1?'! ':'  ')+ad.padEnd(14)+String(G.n).padStart(5)+y(G.pT/G.n).padStart(16)+y(G.gT/G.n).padStart(9)+y(G.pF/G.n).padStart(15)+y(G.gF/G.n).padStart(9)+'     '+
      G.d.map(c=>c.n?(100*c.f/c.n).toFixed(0)+'/'+(100*c.pF/c.n).toFixed(0)+' ('+c.n+')':'—').join(' · ')+`   adama değdi: tahmin ${(100*G.pA/G.n).toFixed(0)}% gerçek ${(100*G.gA/G.n).toFixed(0)}%`);}
  const dT=Math.abs(T.pT-T.gT)/T.n,dF=Math.abs(T.pF-T.gF)/T.n;if(dT>0.1||dF>0.1)ok1=false;
  console.log('  '+'toplam'.padEnd(14)+String(T.n).padStart(5)+y(T.pT/T.n).padStart(16)+y(T.gT/T.n).padStart(9)+y(T.pF/T.n).padStart(15)+y(T.gF/T.n).padStart(9)+(olaysiz?`     (sonuçsuz ${olaysiz})`:''));
  console.log((ok1?'  ':'! ')+`Kabul [1]: her yönde ve toplamda |tahmin − gerçek| ≤ 10 puan (topa önce, faul) → ${ok1?'evet':'HAYIR'}`);
  console.log((ok2?'  ':'! ')+`Kabul [2]: her yönde faul oranı bağıl hızla düzgün artar (5 puan tolerans) → ${ok2?'evet':'HAYIR'}`);
  return 0;   /* ara durum: bilgi (kapı T5c bitince: ok1&&ok2?0:1) */
}};
