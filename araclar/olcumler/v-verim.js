'use strict';
/* ============ Şutun verimi, kalecinin kalibrasyonu ve uzaklaştırma (T12-0, 2026-10-12; gerçekçilik planı §4 T12) ============
   r-karne, s-sut ve v-vurus ile aynı sözleşme: rastlantı çekmez, motor yöntemi çağırmaz; olayları ('shot', 'header', 'save', 'goal', 'block',
   'cross', 'pass', 'clear') ve her adımın sonunda topu, şut nesnesini (b.sut), duruşu ve kaleciyi okur. Oranlar bütün maçların toplamından (ham).
   Tanımlar:
   - Şut: 'shot' (ayak) ve şut sayılan 'header'. Penaltı (vuruş eyleminin sec.penalti'si) kalibrasyona girmez, ayrı sayılır.
   - xG: kararın gördüğü değer (olaydaki xg; konum modeli × (1 − blok), js/mac-karar.js xG — gerçek konum tablolarına oturtulmuş). Kalibrasyon:
     xG dilimlerinde gerçekleşen gol / şut ve gerçekleşen ÷ xG. Gerçek maçta oran ~1'dir (model gerçek verilere oturtulduysa).
   - Kalecinin tahmini (T12-0'da motorun şut nesnesine eklendi; salt okunur, sonucu değiştirmez): pKurt = kaleciTahmin(m, kaleci, z, y, T) —
     hatası uygulanmış nişanın kale çizgisindeki yeri ve uçuş süresiyle (kafada topun hızından). Kalibrasyon: çerçeveye giden (b.sut.cerceve) ve
     bloklanmayan şutlarda pKurt dilimlerinde gerçekleşen kurtarış = kurtarış / (kurtarış + gol). Fark büyükse kalecinin yürütmesi modelinden
     kötüdür; fark küçük ve kurtarış düşükse model (yer tutma, tepki, erişim) zayıftır.
   - Kalecinin durumu (şut anında): hazır duruş (tavir 'hazir'), hızı (≥ 1,2 m/sn hareketli), yer hatası: topla iki direk arasındaki açıortaya
     yanal uzaklığı (m; kaleciKonum açıortayda durur), şutun çizgisine yanal uzaklığı (kalecinin düzleminde, m).
   - Şutun türü: yerleşik, gelişine (sec.ilk), kafa, ortadan (aynı takımın son 3 sn'de ortası ya da geri çevirmesi; gelişine ya da kafa da olabilir).
   - Sonuç (v-vurus ile aynı): şut nesnesi değişince — aynı adımda gol olduysa gol; kurtarış olayı ya da kaleci topu tuttuysa kurtarış; 'block'
     olduysa blok; değilse diğer (dışarı, direk, kendi kalesine …).
   - Uzaklaştırma: 'clear' (ayak) ve uzaklaştırma kararıyla kafa ('header', tur 'uzaklastir'); 4 sn içindeki ilk durum: korner (rakibe), taç,
     kale vuruşu, kendi takımı topu aldı, rakip aldı; hiçbiri değilse havada/boşta.
   Gerçek değerler (Ek E; Opta/StatsBomb özetleri, yaklaşık): gol/şut penaltısız ~%10, ceza sahası içinden ~%12–13, dışından ~%3–4; çerçeveye
   giden şutta kurtarış içeriden ~%60–66, dışarıdan ~%85. */
const VV_X=[0,0.03,0.06,0.1,0.2,0.35,9],VV_XAD=['<0,03','0,03–0,06','0,06–0,10','0,10–0,20','0,20–0,35','≥0,35'];
const VV_P=[0,0.2,0.4,0.6,0.8,9],VV_PAD=['<0,2','0,2–0,4','0,4–0,6','0,6–0,8','≥0,8'];
const VV_TUR=['yer','ilk','kafa','orta'],VV_TURAD={yer:'yerleşik',ilk:'gelişine (ayak)',kafa:'kafa',orta:'ortadan (hepsi)'};
const VV_DUR=['hazir','durgun','hareket'],VV_DURAD={hazir:'hazır duruşta',durgun:'hazır değil, durgun',hareket:'hareketli (≥ 1,2 m/sn)'};
const VV_YER=[0,0.5,1.5,9],VV_YERAD=['<0,5 m','0,5–1,5 m','≥1,5 m'];
const VV_CIZ=[0,1,2,3,9],VV_CIZAD=['<1 m','1–2 m','2–3 m','≥3 m'];
const VV_UZ=['korner','tac','kaleVurusu','takim','rakip','bos'],VV_UZAD={korner:'korner',tac:'taç',kaleVurusu:'kale vuruşu',takim:'takımı aldı',rakip:'rakip aldı',bos:'boşta / havada'};
const vvDilim=(S,x)=>{for(let i=0;i<S.length-1;i++)if(x<S[i+1])return i;return S.length-2;};
const VV_DOKUM=process.env.MAC_DENEME_SUTLAR||null;
const VV_MES=[0,6,11,16.5,20,25,99],VV_MESAD=['<6 m','6–11 m','11–16,5 m','16,5–20 m','20–25 m','≥25 m'];
module.exports={
  bilgi:[['— Şutun verimi ve kaleci (v-verim; T12-0) —',null,0],
    ['Gol / şut (penaltısız) %','vvGolSut',1],['Konum xG / şut (penaltısız; baskısız, bloksuz)','vvXgK',3],['Gerçekleşen ÷ konum xG (penaltısız; maç oranlarının ortalaması)','vvOranK',2],
    ['Gerçekleşen ÷ konum xG (havuz: Σ gol ÷ Σ xG; penaltısız)','vvOranH',2,[0.85,1.25,'T15']],
    ['Kurtarış ceza sahası içinden % (penaltısız, çerçeveye giden, bloksuz; kafa dahil)','vvKurtIc',1,[50,65,'T15']],
    ['xG / şut (penaltısız; kararın değeri)','vvXg',3],['Gerçekleşen ÷ kararın xG\'si (penaltısız)','vvOran',2],
    ['Kaleci: tahmin − gerçekleşen kurtarış (puan; çerçeveye giden, bloksuz)','vvKalib',1],['Kaleci: tahmin edilen kurtarış ort. %','vvKTahmin',1],
    ['Şut anında kaleci hazır duruşta %','vvHazir',1],['Şut anında kaleci hareketli %','vvHareket',1],['Kalecinin açıortaya uzaklığı ortanca (m)','vvYer',2],
    ['Uzaklaştırma / maç','vvUz',1]].concat(VV_UZ.map(k=>['Uzaklaştırma sonrası: '+VV_UZAD[k]+' %','vvU_'+k,1]))
    .concat(['<1,5','1,5–3','3–5','≥5'].map((a,i)=>['Orta anında en yakın rakip '+a+' m %','vvOY_'+i,1]))
    .concat([['Orta anında topun önünde rakip (4 m, ±1,5 m) %','vvOO',1]]),
  yeni:()=>{
    const hyp=Math.hypot,PL=52.5,MZ=34,GW2=3.66;
    const sut=[],yerL=[];let aktif=null,uzN=0;const uzS={};for(const k of VV_UZ)uzS[k]=0;
    const sonOrta=[-9,-9],bu={goal:false,save:false,block:false},uzA=[],ortaYakin=[0,0,0,0];let ortaN=0,ortaOnde=0;
    /* şut kaydı: ad 'shot' ya da 'header' (şut); b.sut ve kaleci şut anında */
    function kaydet(m,p,v,kafa){
      const b=m.ball,s=b.sut;if(!p||!s)return;const t=p.team,d=m.dir[t],gx=d*PL,e=p.eylem,sec=e&&e.ad==='vurus'?e.sec:null;
      const pen=!!(sec&&sec.penalti),ilk=!kafa&&!!(sec&&sec.ilk),orta=m.t-sonOrta[t]<3;
      const gk=m.teams[1-t].find(q=>q.rol==='GK'&&q.oyunda)||null;let hazir=false,hiz=0,yer=NaN,ciz=NaN;
      if(gk){hazir=gk.tavir==='hazir';hiz=hyp(gk.vx,gk.vz);
        /* açıortay: toptan iki direğe birim yönlerin toplamı */
        const ax=gx-b.x,az1=MZ-GW2-b.z,az2=MZ+GW2-b.z,l1=hyp(ax,az1)||1,l2=hyp(ax,az2)||1,ux=ax/l1+ax/l2,uz=az1/l1+az2/l2,ul=hyp(ux,uz)||1;
        yer=Math.abs((gk.x-b.x)*(-uz/ul)+(gk.z-b.z)*(ux/ul));
        /* şutun çizgisi: toptan nişanın kale çizgisindeki yerine */
        const zn=s.nisanZ!=null?s.nisanZ:s.hedefZ!=null?s.hedefZ:MZ,lx=gx-b.x,lz=zn-b.z,ll=hyp(lx,lz)||1;
        ciz=Math.abs((gk.x-b.x)*(-lz/ll)+(gk.z-b.z)*(lx/ll));}
      const gkx=gx,ic=Math.abs(b.x-gkx)<16.5&&Math.abs(b.z-MZ)<20.16;
      const Lk=hyp(gx-b.x,MZ-b.z);
      const r={L:Lk,t,pen,kafa,ilk,orta,xg:v&&v.xg||0,xgK:s.xgYer!=null?s.xgYer:null,pK:s.pKurt,cer:!!s.cerceve,hazir,hiz,yer,ciz,ic,sonuc:null};
      /* MAC_DENEME_SUTLAR=<dosya>: şut başına kayıt (çözümleme için; işçi başına <dosya>.<pid>) */
      if(VV_DOKUM){const sp=hyp(b.vx,b.vy,b.vz),L=hyp(gx-b.x,MZ-b.z);
        Object.assign(r,{tohum:m.tohum,dk:Math.round(m.gameSec/6)/10,L:+L.toFixed(2),w:+(b.z-MZ).toFixed(2),v:+sp.toFixed(1),zA:s.nisanZ!=null?+(s.nisanZ-MZ).toFixed(2):null,
          yA:s.nisanY!=null?+s.nisanY.toFixed(2):null,zH:s.hedefZ!=null?+(s.hedefZ-MZ).toFixed(2):null,pPg:s.pPg,pPon:s.pPon,tur:s.tur||null,
          gkD:gk?+Math.abs(gk.x-gx).toFixed(2):null,gkW:gk?+(gk.z-MZ).toFixed(2):null,kalecilik:gk?gk.oz.kalecilik:null,sut:p.oz.sut,rol:p.rol,
          stil:e&&e.ad==='vurus'?e.stil:null,guc:e&&e.ad==='vurus'?e.guc:null,acele:e&&e.ad==='vurus'?e.acele||0:0,baski:e&&e.ad==='vurus'?e.baski:null,yor:+(p.yorgunluk||0).toFixed(3),tepki:s.gkTepki!=null?+s.gkTepki.toFixed(3):null});}
      sut.push(r);if(gk&&!pen)yerL.push(yer);aktif={s,r};}
    return{
      dinle(ad,v,m){if(!m)return;
        if(ad==='goal'){bu.goal=true;return;}
        if(ad==='save'){bu.save=true;return;}
        if(ad==='block'){if(!(v&&v.orta))bu.block=true;return;}
        if(ad==='cross'||ad==='pass'&&v&&v.tur==='geriCevir'){if(v&&v.p){sonOrta[v.p.team]=m.t;
          /* T12b: orta anında savunmanın ortacıya yakınlığı — en yakın rakip (m) ve topun gidişinin önünde (±1,5 m yanal, 4 m içinde) rakip */
          if(ad==='cross'){const b=m.ball,vh=hyp(b.vx,b.vz)||1,ux=b.vx/vh,uz=b.vz/vh;let en=99,onde=false;
            for(const o of m.teams[1-v.p.team]){if(!o.oyunda||o.rol==='GK')continue;const dx=o.x-b.x,dz=o.z-b.z,dd=hyp(dx,dz);if(dd<en)en=dd;const ileri=dx*ux+dz*uz,yan=Math.abs(-dx*uz+dz*ux);if(ileri>0&&ileri<4&&yan<1.5)onde=true;}
            ortaN++;if(en<1.5)ortaYakin[0]++;else if(en<3)ortaYakin[1]++;else if(en<5)ortaYakin[2]++;else ortaYakin[3]++;if(onde)ortaOnde++;}}return;}
        if(ad==='clear'||ad==='header'&&v&&v.tur==='uzaklastir'){if(v&&v.p){uzN++;uzA.push({t:m.t,team:v.p.team,surum:m.ball.surum});}return;}
        if(ad==='shot'){kaydet(m,v&&v.p,v,false);return;}
        if(ad==='header'&&v&&v.shot){kaydet(m,v.p,v,true);return;}},
      adim(m){const b=m.ball;
        if(aktif&&b.sut!==aktif.s){const r=aktif.r,gk=b.tasiyan&&b.tasiyan.rol==='GK'&&b.tasiyan.team!==r.t;
          r.sonuc=bu.goal?'gol':bu.save||gk?'kurt':bu.block?'blok':'diger';aktif=null;}
        bu.goal=false;bu.save=false;bu.block=false;
        /* uzaklaştırmanın sonu */
        for(let i=uzA.length-1;i>=0;i--){const u=uzA[i];let k=null;
          if(m.phase==='durus'&&m.durus){const du=m.durus;k=du.tur==='korner'?'korner':du.tur==='tac'?'tac':du.tur==='kaleVurusu'?'kaleVurusu':(du.takim===u.team?'takim':'rakip');}
          else if(m.phase!=='play'&&m.phase!=='durus')k='bos';
          else if(b.sahip&&b.sahip.team!=null)k=b.sahip.team===u.team?'takim':'rakip';
          else if(b.tasiyan&&b.tasiyan.team!=null)k=b.tasiyan.team===u.team?'takim':'rakip';
          else if(m.t-u.t>4)k='bos';
          if(k){uzS[k]++;uzA.splice(i,1);}}},
      bitir(){
        if(VV_DOKUM&&sut.length){try{require('fs').appendFileSync(VV_DOKUM+'.'+process.pid,sut.map(r=>JSON.stringify(r)).join('\n')+'\n');}catch(e){}}
        const ham={},S=sut.filter(r=>!r.pen&&r.sonuc);let g=0,x=0,xk=0,kT=0,kN=0,kG=0,hz=0,hr=0,nG=0;
        for(const r of S){if(r.sonuc==='gol')g++;x+=r.xg;xk+=r.xgK||0;if(r.hazir)hz++;if(r.hiz>=1.2)hr++;
          if(r.cer&&r.pK!=null&&(r.sonuc==='gol'||r.sonuc==='kurt')){kN++;kT+=r.pK;if(r.sonuc==='kurt')kG++;}}
        nG=S.length;
        ham.vvGolSut=[g,nG];ham.vvHazir=[hz,nG];ham.vvHareket=[hr,nG];ham.vvKTahmin=[kT,kN];
        /* T15-0 (2026-10-14): havuz oranı — xG'si olan şutların golleri ÷ xG toplamı (oran satırı 100·pay/payda yazar: payda 100·xG); vvOranK maç
           oranlarının ortalamasıdır (gürültülü, yukarı çarpık). Ceza sahası içinden kurtarış: penaltısız, çerçeveye giden ve bloklanmayan şutlarda
           kurtarış ÷ (kurtarış + gol), kafa dahil (v-vurus'un vK_ic'i ayak şutu ve penaltı dahildir) */
        {let gH=0,xH=0,ki=0,kn=0;for(const r of S){if(r.xgK!=null){xH+=r.xgK;if(r.sonuc==='gol')gH++;}
          if(r.ic&&r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt')){kn++;if(r.sonuc==='kurt')ki++;}}
         ham.vvOranH=[gH,100*xH];ham.vvKurtIc=[ki,kn];}
        /* dilim tabloları (ozet okur): [pay, payda] */
        const xk1=r=>r.xgK!=null?r.xgK:r.xg;
        for(let i=0;i<VV_XAD.length;i++){const D=S.filter(r=>vvDilim(VV_X,xk1(r))===i);ham['vvX_'+i]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvXs_'+i]=[D.reduce((a,r)=>a+xk1(r),0),D.length];}
        /* mesafe dilimleri (konum xG'siyle): gol, xG toplamı, çerçeve ve kurtarış */
        for(let i=0;i<VV_MESAD.length;i++){const D=S.filter(r=>r.L>=VV_MES[i]&&r.L<VV_MES[i+1]),Dc=D.filter(r=>r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt'));
          ham['vvM_'+i]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvMx_'+i]=[D.reduce((a,r)=>a+(r.xgK||0),0),D.length];
          ham['vvMc_'+i]=[D.filter(r=>r.cer).length,D.length];ham['vvMk_'+i]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];}
        const C=S.filter(r=>r.cer&&r.pK!=null&&(r.sonuc==='gol'||r.sonuc==='kurt'));
        for(let i=0;i<VV_PAD.length;i++){const D=C.filter(r=>vvDilim(VV_P,r.pK)===i);ham['vvP_'+i]=[D.filter(r=>r.sonuc==='kurt').length,D.length];ham['vvPs_'+i]=[D.reduce((a,r)=>a+r.pK,0),D.length];}
        const tur=r=>r.kafa?'kafa':r.ilk?'ilk':'yer';
        for(const k of VV_TUR){const D=S.filter(r=>k==='orta'?r.orta:tur(r)===k),Dc=D.filter(r=>r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt'));
          ham['vvT_'+k]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvTc_'+k]=[D.filter(r=>r.cer).length,D.length];ham['vvTk_'+k]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];
          ham['vvTp_'+k]=[Dc.reduce((a,r)=>a+(r.pK||0),0),Dc.length];ham['vvTx_'+k]=[D.reduce((a,r)=>a+r.xg,0),D.length];}
        const dur=r=>r.hazir?'hazir':r.hiz>=1.2?'hareket':'durgun';
        for(const k of VV_DUR){const D=S.filter(r=>dur(r)===k),Dc=D.filter(r=>r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt'));
          ham['vvD_'+k]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvDk_'+k]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];ham['vvDp_'+k]=[Dc.reduce((a,r)=>a+(r.pK||0),0),Dc.length];}
        for(let i=0;i<VV_YERAD.length;i++){const D=S.filter(r=>r.yer===r.yer&&vvDilim(VV_YER,r.yer)===i),Dc=D.filter(r=>r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt'));
          ham['vvY_'+i]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvYk_'+i]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];}
        for(let i=0;i<VV_CIZAD.length;i++){const Dc=C.filter(r=>r.ciz===r.ciz&&vvDilim(VV_CIZ,r.ciz)===i);
          ham['vvC_'+i]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];ham['vvCp_'+i]=[Dc.reduce((a,r)=>a+r.pK,0),Dc.length];}
        /* kutu içi ve dışı (penaltısız), sonuç dağılımı */
        for(const k of['ic','dis']){const D=S.filter(r=>r.ic===(k==='ic'));ham['vvK_'+k]=[D.filter(r=>r.sonuc==='gol').length,D.length];
          for(const s of['gol','kurt','blok','diger'])ham['vvS_'+k+'_'+s]=[D.filter(r=>r.sonuc===s).length,D.length];}
        const pen=sut.filter(r=>r.pen&&r.sonuc);ham.vvPen=[pen.filter(r=>r.sonuc==='gol').length,pen.length];
        let uT=0;for(const k of VV_UZ)uT+=uzS[k];for(const k of VV_UZ)ham['vvU_'+k]=[uzS[k],uT];
        for(let i=0;i<4;i++)ham['vvOY_'+i]=[ortaYakin[i],ortaN];ham.vvOO=[ortaOnde,ortaN];
        const sy=yerL.filter(v=>v===v).sort((a,b)=>a-b),yo=sy.length?(sy.length%2?sy[(sy.length-1)/2]:(sy[sy.length/2-1]+sy[sy.length/2])/2):NaN;
        return{ham,vvXg:nG?x/nG:NaN,vvOran:x>0?g/x:NaN,vvXgK:nG?xk/nG:NaN,vvOranK:xk>0?g/xk:NaN,vvKalib:kN?100*(kT-kG)/kN:NaN,vvYer:yo,vvUz:uzN};}
    };
  },
  /* dilim tabloları: bütün maçların toplamından */
  ozet(sonuclar){
    const T={};for(const s of sonuclar){const h=s.ham||{};for(const k in h)if(k.startsWith('vv')){const a=T[k]||(T[k]=[0,0]);a[0]+=h[k][0];a[1]+=h[k][1];}}
    const o=k=>T[k]||[0,0],yuz=(a,b)=>b?(100*a/b).toFixed(1):'—',f=(s,n)=>String(s).padStart(n);
    console.log('\n  Şutun verimi (v-verim; T12-0; penaltısız): konum xG dilimi · adet · ort. xG · gerçekleşen gol % · gerçekleşen ÷ xG');
    for(let i=0;i<VV_XAD.length;i++){const [g,n]=o('vvX_'+i),[xs]=o('vvXs_'+i);const xo=n?xs/n:NaN;
      console.log('  '+('xG '+VV_XAD[i]).padEnd(22)+f(n,6)+f(n?xo.toFixed(3):'—',9)+f(yuz(g,n),9)+f(n&&xo>0?(g/n/xo).toFixed(2):'—',8));}
    console.log('  Mesafe (konum xG; gerçekte ÷ ~1): adet · gol % · konum xG % · gerçekleşen ÷ xG · çerçeve % · kurtarış %');
    for(let i=0;i<VV_MESAD.length;i++){const [g,n]=o('vvM_'+i),[xs]=o('vvMx_'+i),[c]=o('vvMc_'+i),[kk,kn]=o('vvMk_'+i);
      console.log('  '+VV_MESAD[i].padEnd(22)+f(n,6)+f(yuz(g,n),8)+f(n?(100*xs/n).toFixed(1):'—',8)+f(xs>0?(g/xs).toFixed(2):'—',8)+f(yuz(c,n),8)+f(yuz(kk,kn),8));}
    console.log('  Kaleci kalibrasyonu (çerçeveye giden, bloksuz): tahmin dilimi · adet · ort. tahmin % · gerçekleşen kurtarış % · fark (|fark| > 10 "!")');
    for(let i=0;i<VV_PAD.length;i++){const [k,n]=o('vvP_'+i),[ps]=o('vvPs_'+i);const po=n?100*ps/n:NaN,gz=n?100*k/n:NaN,fk=gz-po;
      console.log((n>=20&&Math.abs(fk)>10?'! ':'  ')+('P(kurtarış) '+VV_PAD[i]).padEnd(22)+f(n,6)+f(n?po.toFixed(1):'—',9)+f(n?gz.toFixed(1):'—',9)+f(n?(fk>0?'+':'')+fk.toFixed(1):'—',8));}
    console.log('  Şutun türü: adet · çerçeve % · kurtarış % (tahmin %) · gol/şut % (ort. xG)');
    for(const k of VV_TUR){const [g,n]=o('vvT_'+k),[c]=o('vvTc_'+k),[kk,kn]=o('vvTk_'+k),[tp]=o('vvTp_'+k),[tx]=o('vvTx_'+k);
      console.log('  '+VV_TURAD[k].padEnd(22)+f(n,6)+f(yuz(c,n),9)+f(yuz(kk,kn),9)+' ('+(kn?(100*tp/kn).toFixed(0):'—')+')'+f(yuz(g,n),8)+' ('+(n?(tx/n).toFixed(3):'—')+')');}
    console.log('  Kalecinin durumu (şut anında): adet · kurtarış % (tahmin %) · gol/şut %');
    for(const k of VV_DUR){const [g,n]=o('vvD_'+k),[kk,kn]=o('vvDk_'+k),[tp]=o('vvDp_'+k);
      console.log('  '+VV_DURAD[k].padEnd(26)+f(n,6)+f(yuz(kk,kn),9)+' ('+(kn?(100*tp/kn).toFixed(0):'—')+')'+f(yuz(g,n),8));}
    console.log('  Kalecinin açıortaya uzaklığı: adet · kurtarış % · gol/şut %');
    for(let i=0;i<VV_YERAD.length;i++){const [g,n]=o('vvY_'+i),[kk,kn]=o('vvYk_'+i);console.log('  '+VV_YERAD[i].padEnd(22)+f(n,6)+f(yuz(kk,kn),9)+f(yuz(g,n),9));}
    console.log('  Şut çizgisinin kaleciye uzaklığı (çerçeveye giden, bloksuz): adet · kurtarış % · tahmin %');
    for(let i=0;i<VV_CIZAD.length;i++){const [kk,n]=o('vvC_'+i),[ps]=o('vvCp_'+i);console.log('  '+VV_CIZAD[i].padEnd(22)+f(n,6)+f(yuz(kk,n),9)+f(n?(100*ps/n).toFixed(1):'—',9));}
    console.log('  Sonuç dağılımı (penaltısız): içeriden / dışarıdan · gol · kurtarış · blok · diğer %');
    for(const k of['ic','dis']){const [, n]=o('vvK_'+k);console.log('  '+(k==='ic'?'ceza sahası içinden':'ceza sahası dışından').padEnd(22)+f(n,6)+['gol','kurt','blok','diger'].map(s=>f(yuz(o('vvS_'+k+'_'+s)[0],n),8)).join(''));}
    const [pg,pn]=o('vvPen');console.log('  Penaltı: '+pn+' · gol '+yuz(pg,pn)+' %');
  }
};
