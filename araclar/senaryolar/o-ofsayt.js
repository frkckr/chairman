/* ============ Gerçekçilik planı T10 senaryosu: ofsayt — yan hakemin kararı, geç bayrak ve gol iptali (o-ofsayt; T10d, 2026-10-11) ============
   Kurulum: oyunda bir maç durdurulur, pasör orta çizgide topla; savunan takımın sondan ikinci oyuncusu çizgide (u 30 m), kaleci 50 m'de, öbürleri
   geride; hücumcu çizginin f m önünde/gerisinde (f > 0 ofsayt). Yan hakem çizginin hizasında ya da 1,5 m gerisinde. ofsaytPasAni doğrudan çağrılır
   (pas anının değerlendirmesi; gürültü motorun rastlantısından, deneme başına ayrı tohum).
   [1] Açık pozisyon (|f| ≥ 1 m), yan hakem hizada: doğru karar ≥ %95 (hücumcu duruyor ya da 6 m/sn koşuyor).
   [2] Ucu ucuna (|f| ≤ 0,5 m), yan hakem hizada: hata %10–40 (gerçekte ~%25; Helsen 2006).
   [3] Ucu ucuna, koşan hücumcu (6 m/sn): yanlış bayrak > kaçan ofsayt (hareket yanılgısı; gerçekte hataların çoğu yanlış bayrak).
   [4] Yan hakem 1,5 m geride, hücumcu yan hakemden 15 m daha uzakta: ucu ucuna hatası hizadakinden yüksek (bakış açısı; bilgi + kapı).
   [5] Bekle ve gör: ofsayttaki oyuncu topa dokunur, bayrak kalkmadan top kaleye girer → gol iptal (golIptal, ofsayt serbest vuruşu); ofsaytta
       olmayanın golü geçerli; bayrağın gecikmesi ucu ucuna pozisyonda açık pozisyondakinden ≥ 0,3 sn uzun.
   Çıkış kodu 1: kabul dışı. Kullanım: node araclar/mac-deneme.js --senaryo o-ofsayt [N=200] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||200,dt=1/60,t0=Date.now();let kabulDisi=0;
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const kapi=(ok,metin)=>{if(!ok)kabulDisi++;console.log((ok?'  ':'! ')+'Kapı: '+metin);};
  const yz=(a,c)=>c?(100*a/c).toFixed(1)+'%':'—';
  console.log(`\nT10 · o-ofsayt (yan hakemin kararı, geç bayrak, gol iptali)`);
  /* maç kurulur (oynatılmaz); algı denemelerinde aynı maçta konumlar her seferinde yeniden kurulur, gürültü motorun dizisinden ilerler */
  const hazirla=(tohumN,olay)=>kur(tohumN,olay||(()=>{}));
  /* yerleşim: t=0 hücum eder (d=m.dir[0]); çizgi u=30. f: hücumcunun çizgiye göre farkı; mis: yan hakemin çizgiye göre yeri (+ ileri, − geri);
     va: hücumcunun ileri hızı; zA, zD: hücumcunun ve çizgideki savunmacının z'si */
  const yerlestir=(m,f,mis,va,zA,zD)=>{
    const d=m.dir[0],U=30,T0=m.teams[0],T1=m.teams[1],b=m.ball;
    const pasor=T0.find(p=>p.rol!=='GK'&&p.oyunda),hucumcu=T0.find(p=>p.rol!=='GK'&&p.oyunda&&p!==pasor);
    T0.forEach((p,i)=>{if(!p.oyunda)return;p.vx=p.vz=0;p.eylem=null;p.surus=null;if(p===pasor){p.x=0;p.z=MZ0;}else if(p===hucumcu){p.x=(U+f)*d;p.z=zA;p.vx=va*d;}else{p.x=-10*d-i*1.5*d;p.z=8+i*5;}});
    const gk=T1.find(p=>p.rol==='GK');let s2=null;
    T1.forEach((p,i)=>{if(!p.oyunda)return;p.vx=p.vz=0;p.eylem=null;p.surus=null;if(p===gk){p.x=50*d;p.z=MZ0;}else if(!s2){s2=p;p.x=U*d;p.z=zD;}else{p.x=(12-i)*d;p.z=6+i*5;}});
    b.x=pasor.x;b.z=pasor.z;b.y=0;b.vx=b.vz=b.vy=0;b.sahip=pasor;b.ofsaytta=null;m.ofsaytBekleyen=null;
    const yh=U*d>0?m.refs[1]:m.refs[2];yh.x=(U+mis)*d;yh.vx=yh.vz=0;
    return{pasor,hucumcu,s2,d,yh};};
  const MZ0=34;
  /* tek karar: hücumcu bayrak listesinde mi */
  const karar=(m,P)=>{m.ofsaytPasAni(P.pasor);const o=m.ball.ofsaytta;return!!(o&&o.liste.some(a=>a.q===P.hucumcu));};
  const dene=(f,mis,va,zA,zD,tN)=>{let bayrak=0;const m=hazirla(tN);for(let i=0;i<n;i++){const P=yerlestir(m,f,mis,va,zA,zD);if(karar(m,P))bayrak++;}return bayrak/n;};
  const Fs=[-2,-1,-0.5,-0.25,0.25,0.5,1,2];
  const tablo=(ad,mis,va,zA,zD,tN)=>{const R={};for(const f of Fs)R[f]=dene(f,mis,va,zA,zD,tN+Math.round((f+3)*1000));
    console.log(`  ${ad}: `+Fs.map(f=>`${f>0?'+':''}${f} m → bayrak ${(100*R[f]).toFixed(0)}%`).join(' · '));return R;};
  const hata=(R,sec)=>{let h=0,c=0;for(const f of sec){const yanlis=f>0?1-R[f]:R[f];h+=yanlis;c++;}return h/c;};
  const tN=(tohum||1)*1000000;
  /* yan hakem uzak çizgide (refs[1], z = PW+1,3) ya da yakın çizgide; hücumcu ve savunmacı ortada */
  const H0=tablo('[1–2] hizada, hücumcu duruyor ',0,0,30,30,tN);
  const H6=tablo('[1–3] hizada, hücumcu 6 m/sn    ',0,6,30,30,tN+50000);
  const G6=tablo('[4] 1,5 m geride, hücumcu 15 m uzakta',-1.5,0,MZ0-20,MZ0-5,tN+100000);
  const acik=[-2,-1,1,2],ucu=[-0.5,-0.25,0.25,0.5];
  const d1=1-Math.max(hata(H0,acik),hata(H6,acik));
  kapi(d1>=0.95,`[1] açık pozisyonda (|f| ≥ 1 m) doğru karar ${(100*d1).toFixed(1)}% ≥ %95`);
  const h2=hata(H0,ucu);
  kapi(h2>=0.10&&h2<=0.40,`[2] ucu ucuna (|f| ≤ 0,5 m), hizada hata ${(100*h2).toFixed(1)}% (%10–40; gerçekte ~%25)`);
  const yb=(H6[-0.5]+H6[-0.25])/2,ko=(2-H6[0.25]-H6[0.5])/2;
  kapi(yb>ko,`[3] ucu ucuna koşan hücumcuda yanlış bayrak ${(100*yb).toFixed(1)}% > kaçan ofsayt ${(100*ko).toFixed(1)}%`);
  const h4=hata(G6,ucu);
  kapi(h4>h2,`[4] yan hakem 1,5 m geride, hücumcu uzakta: ucu ucuna hata ${(100*h4).toFixed(1)}% > hizada ${(100*h2).toFixed(1)}%`);
  /* [5] bekle ve gör: dokunuştan sonra top kaleye girer */
  {let iptal=0,gecerli=0,ofFk=0,nG=Math.max(20,Math.round(n/5));const gec={ucu:[],acik:[]};
    for(let i=0;i<nG;i++){
      for(const [f,beklenen] of [[1.5,'iptal'],[-1.5,'gecerli']]){
        const ol={iptal:false,gol:false};let m=null;
        m=hazirla(tN+200000+i*7+(f>0?1:0),(ad)=>{if(!m)return;if(ad==='golIptal')ol.iptal=true;else if(ad==='goal')ol.gol=true;});
        const P=yerlestir(m,f,0,0,30,30);m.ofsaytPasAni(P.pasor);m.ball.sahip=null;m.dokunus(P.hucumcu,true);m.ofsaytDokunus(P.hucumcu,true);
        /* top kaleye: hücumcunun önünden kale çizgisine (bayrak kalkmadan, aynı adımda) */
        const d=P.d,side=d;m.ball.x=side*(52.5+0.3);m.ball.z=MZ0;m.ball.y=0.5;m.gol(side);
        if(beklenen==='iptal'){if(ol.iptal&&!ol.gol){iptal++;if(m.phase==='durus'&&m.durus&&m.durus.ofsayt)ofFk++;}}
        else if(ol.gol&&!ol.iptal)gecerli++;}
      /* bayrağın gecikmesi: ucu ucuna (0,3 m) ve açık (2 m); hücumcu durur */
      for(const [f,k] of [[0.3,'ucu'],[2,'acik']]){
        const m=hazirla(tN+300000+i*11+(k==='ucu'?1:0));const P=yerlestir(m,f,0,0,30,30);m.ofsaytPasAni(P.pasor);m.ball.sahip=null;
        const o=m.ball.ofsaytta;if(!(o&&o.liste.some(a=>a.q===P.hucumcu)))continue;m.ofsaytDokunus(P.hucumcu,true);if(m.ofsaytBekleyen)gec[k].push(m.ofsaytBekleyen.g);}}
    const ort=L=>L.length?L.reduce((a,c)=>a+c,0)/L.length:NaN;
    console.log(`  [5] bekle ve gör: ofsayttan gol iptal ${iptal}/${nG} (ofsayt serbest vuruşu ${ofFk}) · ofsaytsız gol geçerli ${gecerli}/${nG} · bayrak gecikmesi ucu ucuna ${ort(gec.ucu).toFixed(2)} sn (n ${gec.ucu.length}), açık ${ort(gec.acik).toFixed(2)} sn (n ${gec.acik.length})`);
    kapi(iptal===nG&&ofFk===nG&&gecerli===nG&&ort(gec.ucu)-ort(gec.acik)>=0.3,'[5] bayrak kalkmadan giren gol iptal (ofsayt serbest vuruşu), ofsaytsız gol geçerli, ucu ucuna bayrak ≥ 0,3 sn geç');}
  console.log(`  Toplam ${((Date.now()-t0)/1000).toFixed(1)} sn · kapı dışı ${kabulDisi}`);
  return kabulDisi?1:0;
}};
