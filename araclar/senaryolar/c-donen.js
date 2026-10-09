/* ============ Gerçekçilik planı T5 senaryosu: dönen top (T5e, 2026-10-09) ============
   Ceza sahasında kurtarıştan dönen top: konuk kalecisi kale çizgisinde yerde (kalkışta, 1,2 sn), top penaltı noktası çevresinden kaleden dışarı
   döner. Değişkenler: dönüş yönü (−50° / 0 / +50°) × hız (2 / 5 / 8 m/sn) × hedef varış farkı Δ* (−0,45 … 0,45 sn): hücumcu (ev sahibi forvet)
   dışarıdan 5–8 m'den gelir, savunmacının (konuk stoper, kale yanından) uzaklığı Δ*'ı verecek biçimde ikiye bölmeyle bulunur. Δ = yakalama
   süresi(hücumcu) − yakalama süresi(savunmacı) (yakalamaNoktasi, başlangıçta; takım AI'ının kovalayan seçimiyle aynı tahmin).
   [1] İlk dokunuş. Kabul: dönen topa ilk dokunan varış zamanı önde olandır — |Δ| > 0,3 sn'de önde olanın payı ≥ %85; hücumcunun payı Δ arttıkça
       azalır (komşu dilimde 5 puandan büyük artış yok) ve basamak değildir (−0,05…0,05 diliminde %25–75; ±0,05…0,15 dilimlerinde önde olan
       ≤ %97).
   [2] Efor. Kabul: top ceza sahasında sahipsizken 0,5 sn içinde iki takımın oyuncusunun da eforu 0,9'un üstüne çıkar (denemelerin ≥ %95'i;
       ilk dokunuş 0,5 sn'den önce olduysa o ana kadar).
   [3] Kale çizgisi (bilgi): her üç denemeden birinde ikinci savunmacı (kaleden 12 m); kaleci yerdeyken kovalamayan savunmacı 1 sn'de kale
       çizgisindeki noktaya en az 2 m yaklaşır.
   Kabul dışıysa çıkış kodu 1. Kullanım: node araclar/mac-deneme.js --senaryo c-donen [N=12 hücre başına] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||12,dt=1/60,t0=Date.now(),PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx);
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:0,vz:0,spd:0,yon,eylem:null,kickCd:0,surus:null,kosu:null,oyunda:true,denge:1});};
  const YON=[-50,0,50],HIZ=[2,5,8],FARK=[-0.45,-0.3,-0.2,-0.1,-0.05,0,0.05,0.1,0.2,0.3,0.45];
  const S=['<−0,3','−0,3…−0,15','−0,15…−0,05','−0,05…0,05','0,05…0,15','0,15…0,3','>0,3'],SS=[-0.3,-0.15,-0.05,0.05,0.15,0.3],kova=dl=>S[SS.filter(s=>dl>=s).length];
  const K={};let deneme=0,eforOk=0,eforN=0,cizgiOk=0,cizgiN=0;
  for(const yd of YON)for(const v of HIZ)for(const f of FARK)for(let i=0;i<n;i++){deneme++;let faul=false;
    const m=kur((tohum||1)*1000+deneme,ad=>{if(ad==='faul'||ad==='avantaj')faul=true;}),b=m.ball,d=m.dir[0];
    const A=m.teams[0][9],B=m.teams[1][3],B2=m.teams[1][2],GK=m.teams[1].find(p=>p.rol==='GK'),ikinci=i%3===0;
    bosalt(m,ikinci?[A,B,B2]:[A,B]);
    const bx=d*(PL-9-(i%3)),bz=MZ+(i%5-2)*2.5,yo=((i%2?1:-1)*0.8),dA=5+(i%4);
    /* hücumcu dışarıdan (kaleden uzak yan), savunmacı kale tarafının yanından */
    yerlestir(A,bx-d*0.6*dA,bz+yo*dA,Math.atan2(-yo,d*0.6));const Bx=r=>bx+d*0.4*r,Bz=r=>bz-yo*0.92/0.8*r;yerlestir(B,Bx(6),Bz(6),Math.atan2(yo*0.92/0.8,-d*0.4));
    if(ikinci)yerlestir(B2,d*(PL-12),MZ-yo*7.5,d>0?0:Math.PI);
    Object.assign(GK,{x:d*(PL-0.5),z:MZ+(i%3-1)*1.5,vx:0,vz:0,spd:0,eylem:{ad:'kalkis',t:0,sure:1.2,kilit:true,fren:12,kaleci:true}});
    m.phase='play';m.phaseT=1;m.durus=null;
    const a=yd*Math.PI/180;
    Object.assign(b,{x:bx,z:bz,y:0,vx:-d*Math.cos(a)*v,vz:Math.sin(a)*v,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:1,sonDokunan:GK});
    m.topDegisti();
    /* savunmacının uzaklığı: Δ = Δ* olacak biçimde ikiye bölme (1,5–20 m; Δ uzaklıkla azalır) */
    const tA=m.yakalamaNoktasi(A,0.7).t;let lo=1.5,hi=20;
    for(let j=0;j<22;j++){const r=(lo+hi)/2;B.x=B.tx=Bx(r);B.z=B.tz=Bz(r);if(tA-m.yakalamaNoktasi(B,0.7).t>f)lo=r;else hi=r;}
    B.x=B.tx=Bx((lo+hi)/2);B.z=B.tz=Bz((lo+hi)/2);
    const dl=tA-m.yakalamaNoktasi(B,0.7).t;
    const cizgi=()=>({x:d*(PL-0.5),z:MZ+Math.max(-2.6,Math.min(2.6,(b.z-MZ)*0.5))});
    let ilk=null,effA=false,effB=false,cizgiD0=null,cizgiOyuncu=null;
    for(let k=0;k<60*4&&!ilk&&!faul;k++){m.step(dt);const t=(k+1)*dt;
      if(t<=0.5+1e-9){if(A.efor>0.9)effA=true;if(B.efor>0.9||ikinci&&B2.efor>0.9)effB=true;}
      if(ikinci&&k===5){const L=m._kov&&m._kov.liste,kov=L?L[1]:null;cizgiOyuncu=kov===B?B2:kov===B2?B:null;
        if(cizgiOyuncu){const c=cizgi();cizgiD0=Math.hypot(cizgiOyuncu.x-c.x,cizgiOyuncu.z-c.z);}}
      if(cizgiOyuncu&&k===65){const c=cizgi();cizgiN++;if(cizgiD0-Math.hypot(cizgiOyuncu.x-c.x,cizgiOyuncu.z-c.z)>=2)cizgiOk++;}
      if(b.sonDokunan!==GK&&b.sonDokunan)ilk=b.sonDokunan===A?'A':b.sonDokunan===GK?null:'B';
      if(m.phase!=='play')break;}
    eforN++;if(effA&&effB)eforOk++;
    const c=K[kova(dl)]||(K[kova(dl)]={n:0,A:0,B:0,faul:0,yok:0,dl:0});c.n++;c.dl+=dl;
    if(faul)c.faul++;else if(ilk==='A')c.A++;else if(ilk==='B')c.B++;else c.yok++;}
  const y=(a,c)=>c?(100*a/c).toFixed(0).padStart(4)+'%':'   —';
  console.log(`\nT5 · dönen top · ${deneme} deneme (kaleci yerde; Δ = yakalama(hücumcu) − yakalama(savunmacı)) · ${((Date.now()-t0)/1000).toFixed(1)} sn\n`);
  console.log('  [1] Δ (sn)        n   Δ ort.   hücumcu ilk   savunmacı ilk   faul   dokunan yok');
  let tutarli=true,onceki=101;const pay={};
  for(const k of S){const c=K[k];if(!c)continue;const pA=100*c.A/Math.max(1,c.A+c.B);pay[k]=pA;if(pA>onceki+5)tutarli=false;onceki=Math.min(onceki,pA);
    console.log('      '+k.padEnd(12)+String(c.n).padStart(5)+(c.dl/c.n).toFixed(2).padStart(9)+y(c.A,c.n).padStart(14)+y(c.B,c.n).padStart(16)+y(c.faul,c.n).padStart(7)+y(c.yok,c.n).padStart(14));}
  const uc=(pay['<−0,3']==null||pay['<−0,3']>=85)&&(pay['>0,3']==null||100-pay['>0,3']>=85),pm=pay['−0,05…0,05'];
  const orta=(pm==null||pm>=25&&pm<=75)&&(pay['−0,15…−0,05']==null||pay['−0,15…−0,05']<=97)&&(pay['0,05…0,15']==null||100-pay['0,05…0,15']<=97);
  const ok1=tutarli&&uc&&orta,eforP=100*eforOk/Math.max(1,eforN),ok2=eforP>=95;
  console.log((ok1?'      ':'    ! ')+`Kabul [1]: |Δ| > 0,3'te önde olanın payı ≥ %85 (Δ<−0,3: hücumcu %${(pay['<−0,3']||0).toFixed(0)}, Δ>0,3: savunmacı %${(100-(pay['>0,3']||0)).toFixed(0)}); Δ'yla düzgün azalma ${tutarli?'var':'YOK'}; basamak değil (−0,05…0,05 %25–75, ±0,05…0,15'te önde olan ≤ %97: ${orta?'evet':'HAYIR'})`);
  console.log((ok2?'  ':'! ')+`[2] İki takımın oyuncusu da 0,5 sn içinde efor > 0,9: %${eforP.toFixed(1)} (${eforOk}/${eforN}; kabul ≥ %95)`);
  console.log(`  [3] Kaleci yerdeyken kovalamayan savunmacı 1 sn'de kale çizgisine ≥ 2 m yaklaştı (bilgi): %${(100*cizgiOk/Math.max(1,cizgiN)).toFixed(0)} (${cizgiOk}/${cizgiN})`);
  return ok1&&ok2?0:1;
}};
