/* ============ Gerçekçilik planı T5 senaryosu: müdahalenin teması (T5c, 2026-10-09; kurulum v2 ve kapı aynı gün akşam, masaüstü) ============
   Boş sahada hücumcu (ev sahibi orta saha) topu sürer (sürüş niyeti 0,5 ya da 1,0 → ~4,4 / ~6,8 m/sn; top ayağının 0,4 m — kontrolde — ya da 0,9 m
   önünde — açıkta); savunmacı (konuk orta saha; sürüş 0,5–0,8 sn oturduktan sonra) hücumcuya göre dört yönden gelir (önden 0°, yandan 90°, arka
   yandan 135°, arkadan 180°; yön hücumcunun gidişine göre, hücumcunun 0,18 sn sonraki yerinin çevresinde) ve ayakta müdahaleye motorun kendi
   işleviyle başlar (mudahaleBaslat; temas mudahaleSonuc). Savunmacının temas anındaki yeri: topun 0,18 sn sonraki yerinden geliş yönünde 0,62 m
   (ayak erişimi); bu yer hücumcunun gövdesine 0,74 m'den yakın düşerse (arkadan, arka yandan) aynı yönde dışarı kaydırılır — top o zaman erişimin
   ötesindedir, hamle önce adama gelir (gerçekte de arkadan girişin sonucu budur). Başlangıçta gövdeler çakışıyorsa hücre kurulmaz (yavaş
   savunmacı arkadan yetişemez; "kurulamadı"). v1 yeri topun çevresinden ölçüyordu ve "arkadan" savunmacıyı hücumcunun içine ya da önüne
   koyuyordu (gövde çarpışması ikisini itiyor, "topa önce" %72 yapay çıkıyordu). Sürücünün niyeti sabittir: rakip 2,5 m'ye girince zorlanan
   yeniden düşünme (topluAI, bVeri.yakinR) kapalı — ölçülen temasın mekaniğidir; sürücünün karar katmanındaki tepkisi (saklama, pas) T7'nin
   işidir. Savunmacının hızı bağıl (kapanma) hızı dilimlerini tarar. Başlangıçta motorun saf tahmini alınır (mudahaleTahmin: topa önce değme,
   adama değme, faul olasılığı; hakemin görmesinden önce) ve gerçekleşenle karşılaştırılır (faul: çalınan ya da hakemin görmediği).
   [1] Kabul: her yönde ve toplamda |tahmin − gerçek| ≤ 10 puan — topa önce değme ve faul.
   [2] Kabul: adama değen temaslarda faul payı her yönde bağıl hızla düzgün artar (komşu dilimde 8 puandan büyük düşüş yok; dilimde ≥ 40 adama
       teması) ve arkadan gelişte faul payı önden gelişten yüksek.
   Kabul dışıysa çıkış kodu 1. Teşhis: TEMAS_DOK=1 (yön × dilim: temas anı, bayrak payları, şiddet, sabit hızdan ve modelden konum sapması,
   dokunuşlar); TEMAS_IZ=1 TEMAS_IZ_YON=önden [TEMAS_IZ_VA=5 TEMAS_IZ_OFF=0.9 TEMAS_IZ_VD=4.5 TEMAS_IZ_I=0] tek denemenin kare kare izi.
   Kullanım: node araclar/mac-deneme.js --senaryo c-temas [N=30 hücre başına] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||30,dt=1/60,t0=Date.now(),DOK=process.env.TEMAS_DOK==='1';let sd=(tohum||1)*2654435761>>>0;
  const r=()=>{sd=(sd+0x6D2B79F5)>>>0;let t=sd;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};   /* kurulum rastlantısı (mulberry32) */
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const tahmin=vm.runInContext('mudahaleTahmin',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  /* yön: savunmacının hücumcuya göre geldiği yön (hücumcunun gidişine göre derece; 0 önden, 90 yandan, 135 arka yandan, 180 arkadan) */
  const YON=[[0,'önden'],[90,'yandan'],[135,'arka yandan'],[180,'arkadan']],VA=[2,5],OFF=[[0.4,'kontrol'],[0.9,'açık']],VD=[0,1.5,3,4.5,6];
  const DIL=['<2','2–4','4–6','6–8','≥8'],dil=v=>v<2?0:v<4?1:v<6?2:v<8?3:4;   /* bağıl (kapanma) hızı dilimleri */
  const T=0.18,GOVDE=0.74,ERISIM=0.62;
  const yeniC=()=>({n:0,pT:0,gT:0,pF:0,gF:0,pA:0,gA:0,pTs:0,gTs:0,pArka:0,gArka:0,gKalkan:0,gOnce:0,gCc:0,gCcN:0,gKontrol:0,dD:0,dS:0,dB:0,dB2:0,mD:0,mS:0,mB:0,gDok:0,mDok:0,gBv:0,mBv:0,surer:0,mBdok:0,mBdokN:0,mByok:0,mByokN:0,dkN:0,dkV:0,dkTur:{}});
  const H={};let deneme=0,olaysiz=0,kurulamadi=0,hemen=0;
  for(const [aci,ad] of YON){const G=H[ad]=Object.assign(yeniC(),{d:DIL.map(yeniC)});
    for(const va of VA)for(const [off] of OFF)for(const vd of VD)for(let i=0;i<n;i++){deneme++;let son=null;
      const DK=[];
      const m=kur((tohum||1)*1000+deneme,(ad2,v)=>{if(ad2==='mudahaleSonuc'&&v&&v.p===D&&!son)son=v;}),b=m.ball,d=m.dir[0],hy=d>0?0:Math.PI;
      const A=m.teams[0][7],D=m.teams[1][6];bosalt(m,[A,D]);
      const ax=d*(-5+10*r()),az=34+(r()-0.5)*16;
      Object.assign(A,{x:ax,z:az,tx:ax,tz:az,vx:d*va,vz:0,spd:va,yon:hy,eylem:null,kickCd:0,surus:null,denge:1,oyunda:true,calim:null,yutma:null});
      Object.assign(b,{x:ax+d*off,z:az,y:0,vx:d*va,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:A});
      m.phase='play';m.phaseT=1;m.durus=null;m.topDegisti();m.sahipYap(A);A.surus={yon:hy,hiz:va>3?1:0.5};
      /* sürüş oturur: savunmacı sahada değilken 0,5–0,8 sn sürer (top dokunuşla önde, sürücü kendi temposunda) */
      D.oyunda=false;D.x=D.tx=-300;D.z=D.tz=-300;const K0=30+Math.floor(r()*18);
      const IZ=process.env.TEMAS_IZ==='1'&&ad===process.env.TEMAS_IZ_YON&&va===+(process.env.TEMAS_IZ_VA||5)&&off===+(process.env.TEMAS_IZ_OFF||0.9)&&vd===+(process.env.TEMAS_IZ_VD||4.5)&&i===+(process.env.TEMAS_IZ_I||0);
      const iz=(etiket)=>{if(!IZ)return;const sd=A.sonDokunus||{};console.log('      IZ '+etiket.padEnd(6)+' t='+m.t.toFixed(3)+' top ön='+(d*(b.x-A.x)).toFixed(2)+' yan='+(b.z-A.z).toFixed(2)+' v='+Math.hypot(b.vx,b.vz).toFixed(2)+
        ' A v='+A.spd.toFixed(2)+' hizOran='+(A.hizOran||0).toFixed(2)+' sahip='+(b.sahip===A?'A':b.sahip?'?':'-')+' surus='+(A.surus?(A.surus.hiz||0).toFixed(2):'-')+' dokunT='+(A.dokunT||0).toFixed(3)+
        ' son='+(sd.tur||'-')+'@'+(sd.t!=null?sd.t.toFixed(3):'-')+' eylem='+(A.eylem?A.eylem.ad:'-')+(D.oyunda?' D-top='+Math.hypot(b.x-D.x,b.z-D.z).toFixed(2)+' D-A='+Math.hypot(A.x-D.x,A.z-D.z).toFixed(2)+' D v='+D.spd.toFixed(2):''));};
      for(let k=0;k<K0;k++){A.kararT=99;if(b.sahip===A&&!A.surus)A.surus={yon:hy,hiz:va>3?1:0.5};m.step(dt);if(k>=K0-6)iz('ön'+k);}
      if(b.sonDokunan!==A||Math.hypot(b.x-A.x,b.z-A.z)>1.6){olaysiz++;continue;}
      /* temas anı (T sonra): top tx,tz; hücumcu sx1,sz1. Savunmacı hücumcuya göre yön u'da, toptan ERISIM uzakta; hücumcunun gövdesine
         GOVDE'den yakın düşerse u boyunca dışarı (|B1 + u·L − S1| = GOVDE çözümü) */
      const tx=b.x+b.vx*T,tz=b.z+b.vz*T,sx1=A.x+A.vx*T,sz1=A.z+A.vz*T,yan=r()<0.5?1:-1,a=hy+yan*(aci+(r()-0.5)*20)*Math.PI/180,ux=Math.cos(a),uz=Math.sin(a);
      let L=ERISIM;{const wx=tx-sx1,wz=tz-sz1,ex=wx+ux*L,ez=wz+uz*L;
        if(ex*ex+ez*ez<GOVDE*GOVDE){const uw=ux*wx+uz*wz,disk=uw*uw-(wx*wx+wz*wz)+GOVDE*GOVDE;if(disk>0)L=Math.max(L,-uw+Math.sqrt(disk));}}
      const dx1=tx+ux*L,dz1=tz+uz*L,ya=Math.atan2(tz-dz1,tx-dx1),vx=Math.cos(ya)*vd,vz=Math.sin(ya)*vd,dx=dx1-vx*T,dz=dz1-vz*T;
      if(Math.hypot(dx-A.x,dz-A.z)<GOVDE){kurulamadi++;continue;}
      if(Math.hypot(dx-b.x,dz-b.z)<0.6)hemen++;
      Object.assign(D,{x:dx,z:dz,tx:dx,tz:dz,vx,vz,spd:vd,yon:ya,eylem:null,kickCd:0,surus:null,denge:1,oyunda:true,calim:null,yutma:null});
      const P=tahmin(m,D,A),vrel=Math.hypot(D.vx-A.vx,D.vz-A.vz),K0x=[D.x,D.z,D.vx,D.vz,A.x,A.z,A.vx,A.vz,b.x,b.z,b.vx,b.vz],tBas=m.t,dokBas=A.sonDokunus?A.sonDokunus.t:-9;
      m.mudahaleBaslat(D,A,tx,tz,aci>=135?'toparlanma':aci>=90?'yan':'acik');let sdT=A.sonDokunus?A.sonDokunus.t:-9;
      iz('başla');if(IZ)console.log('      IZ tahmin: T='+(P.T||0).toFixed(3)+' Ptop='+P.Ptop.toFixed(2)+' Pdeg='+P.Pdeg.toFixed(2)+' Pfaul='+P.Pfaul.toFixed(2)+' dokunus='+P.dokunus+' top model ön='+(d*(P.yer.bx-P.yer.sx)).toFixed(2)+' D-top model='+Math.hypot(P.yer.bx-P.yer.px,P.yer.bz-P.yer.pz).toFixed(2)+' D-A model='+Math.hypot(P.yer.sx-P.yer.px,P.yer.sz-P.yer.pz).toFixed(2));
      /* sürücünün niyeti sabit: rakip 2,5 m'ye girince zorlanan yeniden düşünme (topluAI, bVeri.yakinR) kapalı — temasın mekaniği ölçülür,
         sürücünün karar katmanındaki tepkisi (saklama, pas) T7'nin işidir */
      for(let k=0;k<60*0.8&&!son;k++){A.kararT=99;m.bVeri(A).yakinR=0;if(b.sahip===A&&!A.surus)A.surus={yon:hy,hiz:va>3?1:0.5};m.step(dt);iz('k'+(k+1));
        if(A.sonDokunus&&A.sonDokunus.t!==sdT){sdT=A.sonDokunus.t;const sd=A.sonDokunus;DK.push({v:Math.hypot(b.vx,b.vz),tur:sd.tur,yuzey:sd.yuzey,hareket:sd.hareket,kasitli:true,sahip:b.sahip===A,d:Math.hypot(b.x-A.x,b.z-A.z)});}
        if(m.phase!=='play'&&!son)break;}
      if(IZ&&son)console.log('      IZ sonuç: t='+(son.t!=null?son.t.toFixed(3):'-')+' topaOnce='+son.topaOnce+' adama='+son.adamaDegdi+' faul='+(son.faul||son.gorulmedi)+' kalkan='+son.kalkan+' kontrol='+son.kontrol+' arkadan='+son.arkadan+' sonuc='+son.sonuc);
      if(!son){olaysiz++;continue;}
      const faul=!!(son.faul||son.gorulmedi),c=G.d[dil(vrel)],tr=son.t!=null?son.t:T;
      /* temas anındaki gerçek yer ile sabit hızlı ileri sarmanın farkı (savunmacı, hücumcu, top; adımın sonunda okunur, ≤ 1 kare pay) */
      const gDok=!!(A.sonDokunus&&A.sonDokunus.t>dokBas&&A.sonDokunus.t>tBas),Y=P.yer||{},mD=Y.px!=null?Math.hypot(D.x-Y.px,D.z-Y.pz):0,mS=Y.sx!=null?Math.hypot(A.x-Y.sx,A.z-Y.sz):0,mB=Y.bx!=null?Math.hypot(b.x-Y.bx,b.z-Y.bz):0;   /* modelin öngördüğü yerden sapma */
      const sap=(x,z,x0,z0,vx0,vz0)=>Math.hypot(x-(x0+vx0*tr),z-(z0+vz0*tr)),dD=sap(D.x,D.z,K0x[0],K0x[1],K0x[2],K0x[3]),dS=sap(A.x,A.z,K0x[4],K0x[5],K0x[6],K0x[7]),dB=sap(b.x,b.z,K0x[8],K0x[9],K0x[10],K0x[11]),
        dB2=Math.hypot(b.x-(K0x[4]+K0x[6]*tr+K0x[8]-K0x[4]),b.z-(K0x[5]+K0x[7]*tr+K0x[9]-K0x[5]));   /* top hücumcuyla aynı göreli yerde kalsaydı */
      for(const X of [G,c]){X.n++;X.pT+=P.Ptop;X.pF+=P.Pfaul;X.pA+=P.Pdeg;if(son.topaOnce)X.gT++;if(faul)X.gF++;if(son.adamaDegdi)X.gA++;
        X.pTs+=P.T!=null?P.T:T;X.gTs+=son.t!=null?son.t:T;X.pArka+=P.arkadan?1:0;if(son.arkadan)X.gArka++;if(son.kalkan)X.gKalkan++;if(son.once)X.gOnce++;if(son.kontrol)X.gKontrol++;
        X.dD+=dD;X.dS+=dS;X.dB+=dB;X.dB2+=dB2;X.mD+=mD;X.mS+=mS;X.mB+=mB;if(gDok)X.gDok++;if(P.dokunus)X.mDok++;X.gBv+=Math.hypot(b.vx,b.vz);X.mBv+=Y.bv||0;if(Y.surer)X.surer++;
        if(gDok){X.mBdok+=mB;X.mBdokN++;}else{X.mByok+=mB;X.mByokN++;}
        for(const k of DK){X.dkN++;X.dkV+=k.v;const ad3=(k.tur||'?')+(k.hareket?'/'+k.hareket:'')+(k.sahip?'':'/sahipsiz');X.dkTur[ad3]=(X.dkTur[ad3]||0)+1;}if(son.siddet!=null){X.gCc+=son.siddet;X.gCcN++;}}}}
  const y=x=>(100*x).toFixed(0).padStart(4)+'%',pay=(a,b)=>b?(100*a/b).toFixed(0):'—';
  console.log(`\nT5 · müdahalenin teması · ${deneme} deneme (ayakta müdahale; tahmin = mudahaleTahmin, başlangıçta) · ${((Date.now()-t0)/1000).toFixed(1)} sn`+
    (kurulamadi||hemen?`   (kurulamadı ${kurulamadi}, başlangıçta erişimde ${hemen})`:'')+'\n');
  console.log('  Yön              n   topa önce: tahmin  gerçek     faul: tahmin  gerçek   adama: tahmin  gerçek     faul (gerçek / tahmin, n) bağıl hız: '+DIL.join(' · '));
  let ok1=true,ok2=true;const TT=yeniC(),fo={};
  for(const [,ad] of YON){const G=H[ad];if(!G.n)continue;for(const k of ['n','pT','pF','gT','gF','pA','gA'])TT[k]+=G[k];
    const dT=Math.abs(G.pT-G.gT)/G.n,dF=Math.abs(G.pF-G.gF)/G.n;if(dT>0.1||dF>0.1)ok1=false;
    /* [2] adama değen temaslarda faul payı dilimler boyunca düzgün artar */
    let onceki=-1;for(const c of G.d){if(c.gA<40)continue;const f=c.gF/c.gA;if(f<onceki-0.08)ok2=false;onceki=Math.max(onceki,f);}
    fo[ad]=G.gA?G.gF/G.gA:null;
    console.log((dT>0.1||dF>0.1?'! ':'  ')+ad.padEnd(14)+String(G.n).padStart(5)+y(G.pT/G.n).padStart(16)+y(G.gT/G.n).padStart(9)+y(G.pF/G.n).padStart(15)+y(G.gF/G.n).padStart(9)+
      y(G.pA/G.n).padStart(14)+y(G.gA/G.n).padStart(9)+'     '+G.d.map(c=>c.n?pay(c.gF,c.n)+'/'+pay(c.pF,c.n)+' ('+c.n+')':'—').join(' · '));
    console.log('    adama değende faul % (gerçek / tahmin, adama n): '+G.d.map(c=>c.gA?pay(c.gF,c.gA)+'/'+(c.pA?(100*c.pF/c.pA).toFixed(0):'—')+' ('+c.gA+')':'—').join(' · '));
    if(DOK)console.log('    DÖKÜM dokunuş dilimlere göre: gerçek dokunuş % / model dokunuş % / sürer % · top hızı temasta gerçek/model (m/sn) · top sapması dokunuşta/dokunuşsuz (m): '+
      G.d.map(c=>c.n?pay(c.gDok,c.n)+'/'+pay(c.mDok,c.n)+'/'+pay(c.surer,c.n)+' · '+(c.gBv/c.n).toFixed(1)+'/'+(c.mBv/c.n).toFixed(1)+' · '+(c.mBdokN?(c.mBdok/c.mBdokN).toFixed(2):'—')+'/'+(c.mByokN?(c.mByok/c.mByokN).toFixed(2):'—'):'—').join('  |  '));
    if(DOK)console.log('    DÖKÜM gerçek dokunuşlar (temasa kadar; deneme başına adet · dokunuştan hemen sonra top hızı · türler): '+
      G.d.map(c=>c.n?(c.dkN/c.n).toFixed(2)+' · '+(c.dkN?(c.dkV/c.dkN).toFixed(1):'—')+' · '+Object.entries(c.dkTur).map(([k,v])=>k+' '+v).join(', '):'—').join('  |  '));
    if(DOK){console.log('    DÖKÜM dilim: n · temas anı tahmin/gerçek (sn) · arkadan tahmin/gerçek % · kalkan % · önce topa % · kontrol % · şiddet ort (adama) · adama tahmin/gerçek % · sabit hızdan sapma savunmacı/hücumcu/top (m) · modelden sapma savunmacı/hücumcu/top (m)');
      for(let i=0;i<DIL.length;i++){const c=G.d[i];if(!c.n)continue;
        console.log('      '+DIL[i].padEnd(8)+String(c.n).padStart(4)+'   '+(c.pTs/c.n).toFixed(3)+'/'+(c.gTs/c.n).toFixed(3)+'   '+pay(c.pArka,c.n).padStart(3)+'/'+pay(c.gArka,c.n).padStart(3)+
          '   '+pay(c.gKalkan,c.n).padStart(3)+'   '+pay(c.gOnce,c.n).padStart(3)+'   '+pay(c.gKontrol,c.n).padStart(3)+'   '+(c.gCcN?(c.gCc/c.gCcN).toFixed(2):'—').padStart(4)+
          '   '+pay(c.pA,c.n).padStart(3)+'/'+pay(c.gA,c.n).padStart(3)+'   '+(c.dD/c.n).toFixed(2)+'/'+(c.dS/c.n).toFixed(2)+'/'+(c.dB/c.n).toFixed(2)+'   '+(c.mD/c.n).toFixed(2)+'/'+(c.mS/c.n).toFixed(2)+'/'+(c.mB/c.n).toFixed(2));}}}
  const dT=Math.abs(TT.pT-TT.gT)/TT.n,dF=Math.abs(TT.pF-TT.gF)/TT.n;if(dT>0.1||dF>0.1)ok1=false;
  console.log('  '+'toplam'.padEnd(14)+String(TT.n).padStart(5)+y(TT.pT/TT.n).padStart(16)+y(TT.gT/TT.n).padStart(9)+y(TT.pF/TT.n).padStart(15)+y(TT.gF/TT.n).padStart(9)+y(TT.pA/TT.n).padStart(14)+y(TT.gA/TT.n).padStart(9)+(olaysiz?`     (sonuçsuz ${olaysiz})`:''));
  const arkaOn=fo['arkadan']!=null&&fo['önden']!=null?fo['arkadan']>fo['önden']:true;if(!arkaOn)ok2=false;
  console.log((ok1?'  ':'! ')+`Kabul [1]: her yönde ve toplamda |tahmin − gerçek| ≤ 10 puan (topa önce, faul) → ${ok1?'evet':'HAYIR'}`);
  console.log((ok2?'  ':'! ')+`Kabul [2]: adama değende faul payı her yönde bağıl hızla düzgün artar (8 puan tolerans, dilimde ≥ 40 adama teması) ve arkadan (${fo['arkadan']!=null?(100*fo['arkadan']).toFixed(0)+'%':'—'}) > önden (${fo['önden']!=null?(100*fo['önden']).toFixed(0)+'%':'—'}) → ${ok2?'evet':'HAYIR'}`);
  return ok1&&ok2?0:1;
}};
