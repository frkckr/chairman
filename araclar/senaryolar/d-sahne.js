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
   [2] Penaltı sahnesi (S1b) ve [3] gol sonrası (S1c): kendi alt adımlarında eklenir.
   Çıkış kodu 1: kabul dışı. Kullanım: node araclar/mac-deneme.js --senaryo d-sahne [N=80] [tohum]; DSAHNE_HUCRE=1 yalnız o hücre */
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
  console.log(`  Toplam ${((Date.now()-t0)/1000).toFixed(1)} sn · kapı dışı ${kabulDisi}`);
  return kabulDisi?1:0;
}};
