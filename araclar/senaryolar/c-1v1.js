/* ============ Gerçekçilik planı T0 senaryosu: bire bir (top süren hücumcu × tek savunmacı) ============
   Boş sahada hücumcu (ev sahibi forvet) topla, savunmacı (konuk stoper) 6 m önünde, kaleler kalecili. Hücumcu kaleye doğru çalım niyetiyle sürer
   (p.surus={…,cal:true}; karar katmanı kapalı: kararT büyük); savunmacının işi takım AI'ındır (1. adam: jokey, müdahale). Değişkenler: hücumcunun
   başlangıç hızı (0 / 3 / 6 m/sn) ve beceri farkı (sürüş − müdahale: −0,4 / 0 / +0,4). Sonuç (5 sn içinde ilk gelen): geçti (savunmacı 1 m geride,
   top hücumcuda), kayıp (savunmacı topa dokundu; dürtüp hücumcunun geri aldığı top da), faul, dışarı, sonuçsuz. Kabul (T4, bilgi): geçme %30–65 ve beceri farkıyla artar.
   T0'da ölçümdür: kabul dışı "!" ile yazılır, çıkış kodu 0. Kullanım: node araclar/mac-deneme.js --senaryo c-1v1 [N=40 hücre başına] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||40,dt=1/60,t0=Date.now();
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const profilKur=vm.runInContext('profilKur',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,v)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:Math.cos(yon)*v,vz:Math.sin(yon)*v,spd:v,yon,eylem:null,kickCd:0,surus:null,kosu:null,oyunda:true,denge:1,_calim:null});};
  const HIZ=[0,3,6],FARK=[-0.4,0,0.4],T={};let deneme=0;
  for(const fk of FARK)for(const v0 of HIZ){const h=T[fk+'|'+v0]={n:0,gecti:0,kayip:0,faul:0,disari:0,sonucsuz:0,manevra:0};
    for(let i=0;i<n;i++){deneme++;let faul=false;
      const m=kur((tohum||1)*1000+deneme,ad=>{if(ad==='faul'||ad==='avantaj')faul=true;}),A=m.teams[0][9],D=m.teams[1][3],b=m.ball,d=m.dir[0],hy=d>0?0:Math.PI;
      bosalt(m,[A,D]);
      A.oz.surus=0.6+fk/2;D.oz.mudahale=0.6-fk/2;profilKur(A,m.tohum);profilKur(D,m.tohum);   /* T3: profil özellikten türetilir */
      const ax=d*18,az=34+(i%5-2)*3;yerlestir(A,ax,az,hy,v0);yerlestir(D,ax+d*6,az,hy+Math.PI,0);
      m.phase='play';m.phaseT=1;m.durus=null;
      Object.assign(b,{x:ax+d*0.45,z:az,y:0,vx:d*v0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:A});
      m.topDegisti();m.sahipYap(A);
      let sonuc='sonucsuz',man=false;
      for(let k=0;k<60*5;k++){A.kararT=99;if(b.sahip===A&&!A.surus)A.surus={yon:hy,hiz:1,cal:true};
        m.step(dt);if(A._calim&&A._calim.faz>=1)man=true;
        if(faul){sonuc='faul';break;}
        if(m.phase!=='play'){sonuc='disari';break;}
        if(b.sonDokunan===D||b.sahip===D){sonuc='kayip';break;}
        if((D.x-A.x)*d<-1&&b.sonDokunan===A&&Math.hypot(b.x-A.x,b.z-A.z)<2.5){sonuc='gecti';break;}}
      h.n++;h[sonuc]++;if(man)h.manevra++;}}
  const y=(a,c)=>c?(100*a/c).toFixed(0).padStart(4)+'%':'   —';
  console.log(`\nT0 · bire bir · hücre başına ${n} deneme · ${((Date.now()-t0)/1000).toFixed(1)} sn\n`);
  console.log('  Beceri farkı  Başlangıç hızı    n   geçti   kayıp   faul  dışarı  sonuçsuz  çalım manevrası');
  const fo={};
  for(const fk of FARK){fo[fk]=[0,0];for(const v0 of HIZ){const h=T[fk+'|'+v0];fo[fk][0]+=h.gecti;fo[fk][1]+=h.n;
    console.log('  '+((fk>0?'+':'')+fk.toFixed(1)).padEnd(13)+(v0+' m/sn').padEnd(16)+String(h.n).padStart(5)+y(h.gecti,h.n).padStart(8)+y(h.kayip,h.n).padStart(8)+y(h.faul,h.n).padStart(7)+y(h.disari,h.n).padStart(8)+y(h.sonucsuz,h.n).padStart(10)+y(h.manevra,h.n).padStart(17));}}
  const g=FARK.map(fk=>100*fo[fk][0]/fo[fk][1]),hep=FARK.reduce((a,fk)=>a+fo[fk][0],0)/FARK.reduce((a,fk)=>a+fo[fk][1],0)*100;
  const ok=hep>=30&&hep<=65&&g[0]<g[1]&&g[1]<g[2];
  console.log('\n  Geçme oranı beceri farkına göre: '+FARK.map((fk,i)=>((fk>0?'+':'')+fk.toFixed(1))+' %'+g[i].toFixed(0)).join(' · '));
  console.log((ok?'  ':'! ')+`Kabul (T4, bilgi): geçme %30–65 ve beceri farkıyla artar → genel %${hep.toFixed(1)}, ${g[0]<g[1]&&g[1]<g[2]?'artıyor':'ARTMIYOR'}`);
  return 0;
}};
