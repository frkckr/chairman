/* ============ S1 senaryosu: sahne protokolleri (d-sahne; S1, 2026-10-20 — S1 planı §1.12, kutuphane/L-sahne-protokolleri.md) ============
   Seyrek senaryo (araclar/oturum-sonu.js SEYREK); sahibi js/mac-sahne.js. Hücreler alt adımlarıyla gelir:
   [1] Kart sahnesi (S1d; protokol bit 2): her deneme ayrı tohumlu maçta 20–40 sn oyundan sonra topun sahibine en yakın rakip (6 m içinde) faul yapar
       (m.faul, kaynak 'mudahale', ciddiyet 0,6 — her üçüncü denemede 0,85); kart çıkmadıysa sarı (her sekizinci denemede kırmızı) gösterilir
       (m.kartGoster). Ölçülen kartın kendisi
       değil sahnesidir: duruş bitene dek (en çok 90 sn) izlenir. Avantajla süren faul sayılmaz (yeni deneme; en çok 2N). Ölçü k-protokol'ün
       s1dIzleyici'si (araclar/olcumler/k-protokol.js; tam maçtaki s1d_ satırlarıyla aynı tanımlar), havuz bütün denemeler.
       Kapılar (S1 planı, kabul): gösterilmeden biten kart 0; kart sürerken kullanılan duran top 0; yavaşladıktan sonra 5 m/sn'yi aşan sahne 0;
       hakemin tepe hızı ortancası ≤ 3,5 m/sn; gösterilirken hakem–oyuncu ≤ 5 m ≥ %95 (uzaktan hariç); yürür tarzında oyuncu durur ≥ %70 (kare);
       tek tarz ≤ %80; kartın düdüğünden kullanıma 1–2 sn %100; kırmızı gören karardan 12 sn sonra sahada 0.
   [2] Penaltı sahnesi (S1b; protokol bit 4): her deneme ayrı tohumlu maçta 20–40 sn oyundan sonra (en çok 4 dk beklenir) topun sahibi ceza sahasının
       5 m yakınındayken (kaleye 21,5 m, ortadan 25 m içinde) ona en yakın rakip (8 m içinde) faul yapar; faulün yeri ceza sahasına izdüşür (m.faul, kaynak
       'mudahale', ciddiyet 0,3 — her üçüncü denemede 0,5: kartlı penaltı). Penaltının duruşu bitene dek (en çok 90 sn) ve 5 sn sonrası izlenir. Ölçü
       k-protokol'ün s1bIzleyici'si (tam maçtaki s1b_ satırlarıyla aynı tanımlar), havuz bütün penaltılar.
       Kapılar (S1 planı, kabul): düdük kullanımdan ≥ 0,4 sn önce %100; düdükte ceza sahası ve yay boş (vurucu ve kaleciler hariç) ≥ %95; faulden temasa
       ortanca 32–48 sn, %10 ≥ 25, %90 ≤ 58; itiraz eden (hakemin 4 m içine gelen) ortalaması ≥ 2,5; kaptan işareti ≥ %90; hakemin itiraz ve boşaltmadaki
       tepe hızı (kart hariç; penaltı başına en çok) %90'ı ≤ 2,5 m/sn; düdükten önceki son 20 sn'de hareketsiz ≤ %65; duruş 90 sn içinde biter.
   [3] Gol sonrası (S1c; protokol bit 8 ve 16): her deneme ayrı tohumlu maçta 20–40 sn oyundan sonra (en çok 4 dk) atan takım topa son üçte birde
       sahipken yapay gol: top ağa konur, son dokunan topa en yakın hücumcu (kendi kalesine bağlamında savunan), m.gol(side). Altı bağlam (her biri N/6,
       sırayla): tarafsız (birinci yarı, 0-0), gol yiyen geride (ikinci yarı, 70. dk, gol yiyen 0-1 geride: T10d), atan takım acele (85. dk, atan 0-1 geride
       atar), gol yiyen önde (76. dk, gol yiyen 2-0 öndeyken yer), kendi kalesine (birinci yarı), avantaj kartlı (birinci yarı; gol anında avantajdan sarı).
       Santra vurulana dek (en çok 90 sn) izlenir. Ölçü k-protokol s1cIzleyici. Kapılar (S1 planı, kabul): tarafsız gol → santra ortancası 28–42;
       acele ≤ tarafsız ≤ koru (ortancalar); topun atan takımın yarısına geçmesi 0; santracı kovalaması ve ışınlanma 0; düdüksüz santra 0; Law 8 ihlali 0;
       kartsız denemelerde hakemin tepe hızı %90'ı ≤ 3,2 m/sn; tavana (55 sn) varan 0; sevinç evresinin ≥ %95'inde odak kümede; santra 90 sn içinde.
   Çıkış kodu 1: kabul dışı. Kullanım: node araclar/mac-deneme.js --senaryo d-sahne [N=80] [tohum]; DSAHNE_HUCRE=1 (ya da 1,2; 3) yalnız o hücreler */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||80,dt=1/60,t0=Date.now(),HUC=process.env.DSAHNE_HUCRE?process.env.DSAHNE_HUCRE.split(',').map(Number):null,acik=i=>!HUC||HUC.includes(i);
  const O=require('../senaryo-ortak')(ctx,vm),KP=require('../olcumler/k-protokol.js');let kabulDisi=0;
  const kapi=(ok,metin)=>{if(!ok)kabulDisi++;console.log((ok?'  ':'! ')+'Kapı: '+metin);};
  const yz=(a,c)=>c?(100*a/c).toFixed(1)+'%':'—',f1=x=>Number.isFinite(x)?x.toFixed(1):'—',f2=x=>Number.isFinite(x)?x.toFixed(2):'—';
  const ortanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b),k=S.length;return k%2?S[(k-1)/2]:(S[k/2-1]+S[k/2])/2;};
  const yuzde=(L,q)=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b);return S[Math.min(S.length-1,Math.floor(q*S.length))];};
  const P=vm.runInContext('MOTOR_AYAR.protokol',ctx);
  console.log(`\nS1 · d-sahne (sahne protokolleri) · protokol ${P}`);
  /* ---- [1] kart sahnesi ---- */
  if(acik(1)){
    if(!(P&2))console.log('  [1] kart sahnesi: protokol bit 2 kapalı — yalnız bilgi (kapılar sahneli kartta)');
    const D=KP.s1dIzleyici();let gecerli=0,deneme=0,avantaj=0,bitmeyen=0,elle=0,kutu=0;
    for(let i=0;gecerli<n&&i<2*n;i++){deneme++;
      let m=null;m=O.kur((tohum||1)*10007+i*31,(ad,v)=>{if(m)D.dinle(ad,v,m);});
      const T=20+(i*7)%21;for(let a=0;a<60*T;a++){m.step(dt);D.adim(m);}
      /* faul: oyun sürerken topun sahibine en yakın rakip (6 m içinde; en çok 30 sn beklenir) */
      let yapan=null;
      for(let a=0;a<1800&&!yapan;a++){
        if(m.phase==='play'){const s=m.ball.sahip;if(s&&s.oyunda&&s.rol!=='GK'){let en=null,ed=6;for(const q of m.teams[1-s.team]){if(!q.oyunda||q.rol==='GK')continue;const d=Math.hypot(q.x-s.x,q.z-s.z);if(d<ed){ed=d;en=q;}}
          if(en){yapan=en;m.faul(en,s,{x:s.x,z:s.z,ciddiyet:i%3===2?0.85:0.6,kaynak:'mudahale'});break;}}}
        m.step(dt);D.adim(m);}
      if(!yapan)continue;
      if(m.phase!=='durus'){avantaj++;continue;}
      gecerli++;if(m.durus.tur==='penalti')kutu++;
      const r=m.refs[0];if(!r.kartSira&&!(r.kartKuyruk&&r.kartKuyruk.length)&&(yapan.kart||0)<2){m.kartGoster(yapan,i%8===7?'kirmizi':'sari');elle++;}
      let s=0;for(;m.phase==='durus'&&s<60*90;s++){m.step(dt);D.adim(m);}
      if(m.phase==='durus')bitmeyen++;
      for(let a=0;a<60*3;a++){m.step(dt);D.adim(m);}}
    D.bitir();
    const K=D.K,say=f=>K.filter(f).length,top=say(x=>x.tarz!=null),sahneli=say(x=>x.sahne);
    console.log(`  [1] ${gecerli} geçerli deneme (${deneme} deneme; avantajla süren ${avantaj}, penaltı ${kutu}, elle kart ${elle}) · ${K.length} kart (${sahneli} sahneli) · duruşu bitmeyen ${bitmeyen}`);
    const tarzlar=['yuru','cagir','kalabalik','uzak'],AD={yuru:'yürür',cagir:'çağırır',kalabalik:'kalabalık',uzak:'uzaktan'};
    console.log('      tarz: '+tarzlar.map(t=>`${AD[t]} ${yz(say(x=>x.tarz===t),top)}`).join(' · '));
    console.log('      sahne süresi (gerçek sn, %10 / ortanca / %90): '+tarzlar.map(t=>{const L=K.filter(x=>x.tarz===t&&x.sure!=null).map(x=>x.sure);return `${AD[t]} ${f1(yuzde(L,0.1))} / ${f1(ortanca(L))} / ${f1(yuzde(L,0.9))}`;}).join(' · '));
    const G=K.filter(x=>x.tarz!=='uzak'&&x.gosterT!=null).map(x=>x.gosterT-x.t0);
    console.log(`      düdükten kartın gösterilmesine (uzaktan hariç; %10 / ortanca / %90): ${f1(yuzde(G,0.1))} / ${f1(ortanca(G))} / ${f1(yuzde(G,0.9))} sn`);
    const TP=K.filter(x=>x.yavas).map(x=>x.tepe),dep=say(x=>x.depar),yav=say(x=>x.yavas);
    console.log(`      hakemin tepe hızı, yavaşladıktan sonra (ortanca / %90): ${f2(ortanca(TP))} / ${f2(yuzde(TP,0.9))} m/sn · 5 m/sn'yi aşan sahne ${dep}/${yav}`);
    const dN=K.reduce((a,x)=>a+x.durN,0),dK=K.reduce((a,x)=>a+x.durK,0);
    const Y=K.filter(x=>x.tarz!=='uzak'&&x.gosterD!=null),y5=Y.filter(x=>x.gosterD<=5).length,y3=Y.filter(x=>x.gosterD<=3).length;
    const gor=say(x=>x.bitti!=null&&x.gosterT==null),bit=say(x=>x.bitti!=null);
    console.log(`      yürürde oyuncu durur ${yz(dK,dN)} (${dN} kare) · gösterilirken ≤ 3 m ${yz(y3,Y.length)}, ≤ 5 m ${yz(y5,Y.length)} · gösterilmeden biten ${gor}/${bit} · kart sürerken kullanım ${D.kul}`);
    const DK=D.dudKul,dk12=DK.filter(x=>x>=1-1e-6&&x<=2+1/60+1e-6).length,KAL=K.filter(x=>x.tarz==='kalabalik').map(x=>x.kal);
    console.log(`      kartın düdüğünden kullanıma (ortanca / en az / en çok): ${f2(ortanca(DK))} / ${f2(DK.length?Math.min(...DK):NaN)} / ${f2(DK.length?Math.max(...DK):NaN)} sn, 1–2 sn ${dk12}/${DK.length}`+
      ` · kalabalık kişi (%10 / ortanca / %90) ${f1(yuzde(KAL,0.1))} / ${f1(ortanca(KAL))} / ${f1(yuzde(KAL,0.9))} · kaptan işareti ${say(x=>x.tip==='kaptan')} · uyarı ${say(x=>x.tip==='uyari')}`);
    if(process.env.SENARYO_AYRINTI)for(let j=0;j<DK.length;j++)if(DK[j]<1-1e-6||DK[j]>2+1/60+1e-6)console.log('      ayrık düdük → kullanım: '+JSON.stringify(D.dudKulDu[j]));
    const kir=K.filter(x=>x.renk!=='sari'),kirS=say(x=>x.kirSahada===true);
    console.log(`      kırmızı ${kir.length} (12 sn sonra sahada ${kirS}) · kartlı duruşun süresi (ortanca, gerçek sn): `+
      ['baraj','uzak','geri','kenar','penalti','tac','korner','kaleVurusu'].map(t=>{const L=D.DU.filter(x=>x.tur===t).map(x=>x.sure);return L.length?`${t} ${f1(ortanca(L))} (${L.length})`:null;}).filter(Boolean).join(' · '));
    if(P&2){
      kapi(gor===0,`[1] gösterilmeden biten kart 0 (${gor})`);
      kapi(D.kul===0,`[1] kart sürerken kullanılan duran top 0 (${D.kul})`);
      kapi(dep===0,`[1] yavaşladıktan sonra 5 m/sn'yi aşan sahne 0 (${dep})`);
      kapi(ortanca(TP)<=3.5,`[1] hakemin tepe hızı ortancası ≤ 3,5 m/sn (${f2(ortanca(TP))})`);
      kapi(Y.length>0&&y5>=0.95*Y.length,`[1] gösterilirken hakem–oyuncu ≤ 5 m ≥ %95, uzaktan hariç (${yz(y5,Y.length)})`);
      kapi(dN>0&&dK>=0.7*dN,`[1] yürür tarzında oyuncu durur ≥ %70 (${yz(dK,dN)})`);
      const enCok=Math.max(...tarzlar.map(t=>say(x=>x.tarz===t)));kapi(top>0&&enCok<=0.8*top,`[1] tek tarz ≤ %80 (${yz(enCok,top)})`);
      kapi(DK.length>0&&dk12===DK.length,`[1] kartın düdüğünden kullanıma 1–2 sn %100 (${dk12}/${DK.length})`);
      kapi(kirS===0,`[1] kırmızı gören karardan 12 sn sonra sahada 0 (${kirS})`);
      kapi(bitmeyen===0,`[1] duruş 90 sn içinde biter (${bitmeyen})`);}
  }
  /* ---- [2] penaltı sahnesi ---- */
  if(acik(2)){
    if(!(P&4))console.log('  [2] penaltı sahnesi: protokol bit 4 kapalı — yalnız bilgi (bugünkü değerler; kapılar sahneli penaltıda)');
    const PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx),cl=(x,a,b)=>Math.max(a,Math.min(b,x));
    const D=KP.s1bIzleyici();let gecerli=0,deneme=0,bulunamadi=0,bitmeyen=0,kartli=0;
    for(let i=0;gecerli<n&&i<2*n;i++){deneme++;
      let m=null;m=O.kur((tohum||1)*20011+i*37,(ad,v)=>{if(m)D.dinle(ad,v,m);});
      const T=20+(i*7)%21;for(let a=0;a<60*T;a++){m.step(dt);D.adim(m);}
      /* faul: topun sahibi ceza sahasının 5 m yakınında, en yakın rakip 8 m içinde; yer ceza sahasına izdüşer */
      let yapan=null;
      for(let a=0;a<60*240&&!yapan;a++){
        if(m.phase==='play'){const s=m.ball.sahip;if(s&&s.oyunda&&s.rol!=='GK'){const d=m.dir[s.team],u=s.x*d;
          if(u>PL-21.5&&Math.abs(s.z-MZ)<25){let en=null,ed=8;for(const q of m.teams[1-s.team]){if(!q.oyunda||q.rol==='GK')continue;const e=Math.hypot(q.x-s.x,q.z-s.z);if(e<ed){ed=e;en=q;}}
            if(en){yapan=en;m.faul(en,s,{x:d*cl(u,PL-15.5,PL-1),z:cl(s.z,MZ-19,MZ+19),ciddiyet:i%3===2?0.5:0.3,kaynak:'mudahale'});break;}}}}
        m.step(dt);D.adim(m);}
      if(!yapan){bulunamadi++;continue;}
      if(m.phase!=='durus'||!m.durus||m.durus.tur!=='penalti')continue;
      gecerli++;if(m.refs[0].kartSira||(m.refs[0].kartKuyruk&&m.refs[0].kartKuyruk.length))kartli++;
      let s=0;for(;m.phase==='durus'&&s<60*90;s++){m.step(dt);D.adim(m);}
      if(m.phase==='durus')bitmeyen++;
      for(let a=0;a<60*5;a++){m.step(dt);D.adim(m);}}
    D.bitir();
    const L=D.L,say=f=>L.filter(f).length,sayi=f=>L.map(f).filter(x=>x!=null&&Number.isFinite(x)),S=L.filter(x=>x.sahneli),R=KP.s1bOzet(L);
    console.log(`  [2] ${gecerli} geçerli deneme (${deneme} deneme; faul yeri bulunamayan ${bulunamadi}, kartlı ${kartli}) · ${L.length} penaltı (${S.length} sahneli) · duruşu bitmeyen ${bitmeyen}`);
    const TM=sayi(x=>x.temas),DT=sayi(x=>x.temas!=null&&x.duduk!=null?x.temas-x.duduk:null),DU=sayi(x=>x.duduk);
    console.log(`      faulden temasa (gerçek sn, %10 / ortanca / %90): ${f1(yuzde(TM,0.1))} / ${f1(ortanca(TM))} / ${f1(yuzde(TM,0.9))} · faulden düdüğe ortanca ${f1(ortanca(DU))} · düdük → temas ortanca ${f2(ortanca(DT))}`);
    console.log('      evre süresi (ortanca gerçek sn): '+['goster','itiraz','bosalt','hazir','duduk'].map(e=>`${e} ${f1(R['s1b_ev_'+e])}`).join(' · ')+` · kaos ortalaması ${f2(R.s1b_kaos)}`);
    console.log('      varyant: '+['kaleciItiraz','kaleciOyun','karsi','duzelt','sari'].map(k=>`${k} ${yz(R.ham['s1b_'+k][0],R.ham['s1b_'+k][1])}`).join(' · '));
    const KB=L.filter(x=>x.kul!=null&&x.duduk!=null),k04=KB.filter(x=>x.kul-x.duduk>=0.4-1e-6).length,dyok=say(x=>x.kul!=null&&x.duduk==null);
    const KD=L.filter(x=>x.kutuD!=null),k0=KD.filter(x=>x.kutuD===0).length,HK=sayi(x=>x.duduk!=null||x.kul!=null?x.hk:null),DG=R.ham.s1b_durgun;
    console.log(`      düdükten kullanıma ≥ 0,4 sn ${k04}/${KB.length} (düdüksüz kullanım ${dyok}) · düdükte ceza sahası ve yay boş ${yz(k0,KD.length)} (ortalama ${f2(R.s1b_kutuD)} kişi) · 5. sn ${f2(R.s1b_kutu5)} · 15. sn ${f2(R.s1b_kutu15)}`);
    console.log(`      itiraz eden ortalaması ${f2(R.s1b_kalabalik)} · itiraz ${f1(R.s1b_itirazSn)} oyuncu·sn · kaptan işareti ${yz(R.ham.s1b_kaptan[0],R.ham.s1b_kaptan[1])} · işaretten 2 sn sonra 4 m içinde ${f2(R.s1b_ihlal)} kişi`);
    console.log(`      hakemin tepe hızı (itiraz ve boşaltma, kart hariç; ortanca / %90 / en çok): ${f2(ortanca(HK))} / ${f2(yuzde(HK,0.9))} / ${f2(HK.length?Math.max(...HK):NaN)} m/sn · son 20 sn'de hareketsiz ${yz(DG[0],DG[1])}`);
    console.log(`      gol ${yz(say(x=>x.gol),say(x=>x.temas!=null))} (n küçük; kabul d-penalti'de) · duruşta kart ${L.reduce((a,x)=>a+x.kart,0)}`);
    if(P&4){
      kapi(KB.length>0&&k04===KB.length&&dyok===0,`[2] düdük kullanımdan ≥ 0,4 sn önce %100 (${k04}/${KB.length}; düdüksüz ${dyok})`);
      kapi(KD.length>0&&k0>=0.95*KD.length,`[2] düdükte ceza sahası ve yay boş ≥ %95 (${yz(k0,KD.length)})`);
      const o=ortanca(TM),q1=yuzde(TM,0.1),q9=yuzde(TM,0.9);
      kapi(o>=32&&o<=48&&q1>=25&&q9<=58,`[2] faulden temasa ortanca 32–48, %10 ≥ 25, %90 ≤ 58 (${f1(o)} / ${f1(q1)} / ${f1(q9)})`);
      kapi(R.s1b_kalabalik>=2.5,`[2] itiraz eden ortalaması ≥ 2,5 (${f2(R.s1b_kalabalik)})`);
      kapi(R.ham.s1b_kaptan[1]>0&&R.ham.s1b_kaptan[0]>=0.9*R.ham.s1b_kaptan[1],`[2] kaptan işareti ≥ %90 (${yz(R.ham.s1b_kaptan[0],R.ham.s1b_kaptan[1])})`);
      kapi(HK.length>0&&yuzde(HK,0.9)<=2.5,`[2] hakemin itiraz ve boşaltmadaki tepe hızı (kart hariç) %90'ı ≤ 2,5 m/sn (${f2(yuzde(HK,0.9))})`);
      kapi(DG[1]>0&&DG[0]<=0.65*DG[1],`[2] düdükten önceki son 20 sn'de hareketsiz ≤ %65 (${yz(DG[0],DG[1])})`);
      kapi(bitmeyen===0,`[2] duruş 90 sn içinde biter (${bitmeyen})`);}
  }
  /* ---- [3] gol sonrası ---- */
  if(acik(3)){
    if(!(P&8))console.log('  [3] gol sonrası: protokol bit 8 kapalı — yalnız bilgi (bugünkü değerler; kapılar sahneli golde)');
    const PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx),BAG=['std','acele','atan','koru','kendi','kart'],BAD={std:'tarafsız',acele:'gol yiyen geride',atan:'atan acele',koru:'gol yiyen önde',kendi:'kendi kalesine',kart:'avantaj kartlı'};
    const D=KP.s1cIzleyici();let gecerli=0,deneme=0,bulunamadi=0,bitmeyen=0;const B=[];
    for(let i=0;gecerli<n&&i<2*n;i++){deneme++;const bag=BAG[gecerli%6];
      let m=null,izle=false;m=O.kur((tohum||1)*30011+i*41,(ad,v)=>{if(m&&izle)D.dinle(ad,v,m);});   /* yalnız yapay gol izlenir (ısınmadaki doğal goller değil) */
      const T=20+(i*7)%21;for(let a=0;a<60*T;a++)m.step(dt);
      /* atan takım: tek bağlamlarda 0, çiftlerde 1 (iki takım da atar) */
      const att=i%2,kt=1-att;let tamam=false;
      for(let a=0;a<60*240&&!tamam;a++){
        if(m.phase==='play'){const s=m.ball.sahip;if(s&&s.oyunda&&s.team===att&&s.rol!=='GK'&&s.x*m.dir[att]>PL-30){
          const b=m.ball,side=m.dir[att],kendi=bag==='kendi';
          if(bag==='std'||bag==='kendi'||bag==='kart'){m.half=1;m.gameSec=Math.min(m.gameSec,2400);m.score[0]=m.score[1]=0;}
          else if(bag==='acele'){m.half=2;m.gameSec=4200;m.score[att]=0;m.score[kt]=0;}    /* gol sonrası 1-0: gol yiyen geride, ikinci yarı */
          else if(bag==='atan'){m.half=2;m.gameSec=5100;m.score[att]=0;m.score[kt]=1;}     /* atan 0-1 gerideyken eşitler, 85. dk */
          else if(bag==='koru'){m.half=2;m.gameSec=4560;m.score[att]=0;m.score[kt]=2;}     /* gol yiyen 2-0 önde, 76. dk (atan 1-2 geride ama aceleye geçmedi) */
          let sc=null,ed=1e9;for(const q of m.teams[kendi?kt:att]){if(!q.oyunda||q.rol==='GK')continue;const d=Math.hypot(q.x-side*PL,q.z-MZ);if(d<ed){ed=d;sc=q;}}
          if(bag==='kart'){let y=null,ey=1e9;for(const q of m.teams[kt]){if(!q.oyunda||q.rol==='GK')continue;const d=Math.hypot(q.x-s.x,q.z-s.z);if(d<ey){ey=d;y=q;}}
            if(y)m.avantaj={t:m.t,kare:m.kare,takim:att,x:s.x,z:s.z,kart:'sari',yapan:y,yiyen:s,neden:'mudahale',tuttu:true,u0:0};}
          m.ofsaytBekleyen=null;b.hakemDegdi=null;b.endirekt=null;b.sahip=null;b.tasiyan=null;
          Object.assign(b,{x:side*(PL+0.6),z:MZ+((i%3)-1)*1.5,y:0.3,vx:0,vy:0,vz:0,sonDokunan:sc,sonTakim:kendi?kt:att});m.topDegisti();
          for(const q of m.players)if(q.eylem&&!q.eylem.kilit)q.eylem=null;
          izle=true;m.gol(side);tamam=m.phase==='goal';if(tamam)B.push(bag);else izle=false;break;}}
        m.step(dt);}
      if(!tamam){bulunamadi++;continue;}
      gecerli++;
      let s=0;for(;m.phase!=='play'&&s<60*90;s++){m.step(dt);D.adim(m);}
      if(m.phase!=='play')bitmeyen++;
      izle=false;}
    D.bitir();
    const L=D.L,say=f=>L.filter(f).length,sayi=f=>L.map(f).filter(x=>x!=null&&Number.isFinite(x)),R=KP.s1cOzet(L);
    L.forEach((x,j)=>{x.bag=B[j];});
    console.log(`  [3] ${gecerli} geçerli deneme (${deneme} deneme; gol yeri bulunamayan ${bulunamadi}) · ${L.length} gol (${say(x=>x.sahneli)} sahneli) · santrası 90 sn'de vurulmayan ${bitmeyen}`);
    const ST=k=>sayi(x=>x.bag===k?x.santra:null);
    console.log('      gol → santra (gerçek sn; %10 / ortanca / %90): '+BAG.map(k=>{const Lk=ST(k);return `${BAD[k]} ${f1(yuzde(Lk,0.1))} / ${f1(ortanca(Lk))} / ${f1(yuzde(Lk,0.9))}`;}).join(' · '));
    console.log('      izleyicinin bağlamı (gol → santra ortancası): '+['std','acele','atan','koru'].map(k=>`${k} ${f1(R['s1c_santra_'+k])} (${say(x=>x.baglam===k)})`).join(' · '));
    console.log(`      sevinç evresi ortanca ${f1(R.s1c_kutla)} sn · küme ilk an ${f1(R.s1c_kumeT)} sn · kümeli ${yz(R.ham.s1c_kumeP[0],R.ham.s1c_kumeP[1])} · top noktada ${f1(R.s1c_nokta)} sn · zincir ${f2(R.s1c_zincir)}`);
    console.log('      koşu türü: '+['kose','tribun','pasci','kulube','yerinde','atan'].map(k=>`${k} ${yz(R.ham['s1c_tur_'+k][0],R.ham['s1c_tur_'+k][1])}`).join(' · '));
    console.log('      topu ağdan alan: '+['kaleci','savunan','atan','T10d'].map(k=>`${k} ${yz(R.ham['s1c_alan_'+k][0],R.ham['s1c_alan_'+k][1])}`).join(' · '));
    const HK=sayi(x=>x.kart?null:x.hkTepe),LW=sayi(x=>x.law8);
    console.log(`      top en uzak ${f1(R.s1c_topUzak)} m · geçti ${R.ham.s1c_gecti[0]} · kovala ${R.ham.s1c_kovala[0]}/${R.ham.s1c_kovala[1]} · ışınla ${R.ham.s1c_isinla[0]} · tavan ${R.ham.s1c_tavan[0]} · düdüksüz ${R.ham.s1c_duduksuz[0]}/${R.ham.s1c_duduksuz[1]} · Law 8 ihlali ${LW.reduce((a,x)=>a+x,0)} · yan hakem çizgiye ${R.ham.s1c_yh[0]}`);
    console.log(`      hakem: tepe hız kartsız (ortanca / %90 / en çok) ${f2(ortanca(HK))} / ${f2(yuzde(HK,0.9))} / ${f2(HK.length?Math.max(...HK):NaN)} m/sn · yol ${f1(R.s1c_hkYol)} m · santra yerinde bekleme ${f1(R.s1c_hkBek)} sn · düdük → santra ${f2(R.s1c_dudukSantra)} sn · odak kümede ${yz(R.ham.s1c_odak[0],R.ham.s1c_odak[1])}`);
    if(P&8){const o=k=>ortanca(ST(k)),os=o('std'),oa=o('acele'),ok=o('koru');
      kapi(os>=28&&os<=42,`[3] tarafsız gol → santra ortancası 28–42 (${f1(os)})`);
      kapi(oa<=os&&os<=ok,`[3] acele ≤ tarafsız ≤ gol yiyen önde (${f1(oa)} / ${f1(os)} / ${f1(ok)})`);
      kapi(R.ham.s1c_gecti[0]===0,`[3] topun atan takımın yarısına geçmesi 0 (${R.ham.s1c_gecti[0]})`);
      kapi(R.ham.s1c_kovala[0]===0&&R.ham.s1c_isinla[0]===0,`[3] santracı kovalaması ve ışınlanma 0 (${R.ham.s1c_kovala[0]} / ${R.ham.s1c_isinla[0]})`);
      kapi(R.ham.s1c_duduksuz[0]===0,`[3] düdüksüz santra 0 (${R.ham.s1c_duduksuz[0]})`);
      kapi(LW.length>0&&LW.every(x=>x===0),`[3] santrada Law 8 ihlali 0 (${LW.reduce((a,x)=>a+x,0)})`);
      kapi(HK.length>0&&yuzde(HK,0.9)<=3.2,`[3] kartsız hakemin tepe hızı %90'ı ≤ 3,2 m/sn (${f2(yuzde(HK,0.9))})`);
      kapi(R.ham.s1c_tavan[0]===0,`[3] tavana (55 sn) varan 0 (${R.ham.s1c_tavan[0]})`);
      kapi(R.ham.s1c_odak[1]>0&&R.ham.s1c_odak[0]>=0.95*R.ham.s1c_odak[1],`[3] sevinç evresinde odak kümede ≥ %95 (${yz(R.ham.s1c_odak[0],R.ham.s1c_odak[1])})`);
      kapi(bitmeyen===0,`[3] santra 90 sn içinde (${bitmeyen})`);}
  }
  console.log(`  Toplam ${((Date.now()-t0)/1000).toFixed(1)} sn · kapı dışı ${kabulDisi}`);
  return kabulDisi?1:0;
}};
