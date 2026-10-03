'use strict';
/* ============ B akışı senaryosu (MM3): pas tamamlama ızgarası ve ilk dokunuş ============
   Kullanım: node araclar/mac-deneme.js --senaryo b-pas [N]   (N: hücre başına deneme, varsayılan 40)
   1) Pas: pasör (orta saha), alıcı (forvet) ve iki savunmacı sahada kalır, diğerleri çıkarılır. Alıcı 8–45 m ötede, pasın açısı ±0,6 rad;
      baskı: pasöre en yakın rakip yok / ~3 m / ~1,5 m (önünden); ikinci savunmacı alıcıyı 4–8 m'den izler. Pas karar katmanının seçtiği
      plandır (pasSecenekleri: tür, varış hızı, hedef); vuruş ve sonrası motorun kendisidir. Sonuç: tamamlandı (arkadaş dokundu),
      kesildi, dışarı, zaman aşımı. Ayrıca gerçekleşen hedef sapması (yön hatası) ve yerden/havadan payı.
   2) İlk dokunuş: duran alıcıya 15 m'den top gelir (hız 6–22 m/sn; yerden, dize kadar 0,45 m, göğüs 1,1 m); arkasında 1,5 m'de rakip var/yok.
      Sonuç: iyi dokunuş oranı (ilkDokunus olayı). Kurulum rastlantısı senaryonun kendi tohumlu üretecindendir; motor kendi tohumunu kullanır. */
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||40;let s=(tohum||1)*2654435761>>>0;
  const r=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const G=vm.runInContext(`({pasSecenekleri,baskiAltinda,yerIlkHiz,hyp,PL,MZ})`,ctx);
  /* sahayı boşalt: yalnız verilen oyuncular ve kaleciler kalır */
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon)=>{p.x=p.tx=x;p.z=p.tz=z;p.vx=p.vz=0;p.spd=0;p.yon=yon;p.eylem=null;p.kickCd=0;p.surus=null;p.kosu=null;p.oyunda=true;};
  /* ---- 1) pas ızgarası ---- */
  const UZ=[8,15,25,35,45],BS=[[0,'yok'],[3,'~3 m'],[1.5,'~1,5 m']],T={};
  let deneme=0;
  for(const L of UZ)for(const [bm,bad] of BS){const h=T[L+'|'+bad]={n:0,tamam:0,kesildi:0,disari:0,zaman:0,sapma:0,sn:0,hava:0};
    for(let i=0;i<n;i++){deneme++;
      const m=kur((tohum||1)*1000+deneme,()=>{}),A=m.teams[0][7],B=m.teams[0][9],D1=m.teams[1][2],D2=m.teams[1][3],b=m.ball;
      bosalt(m,[A,B,D1,D2]);
      const th=(r()-0.5)*1.2,ax=-15,az=34,bx=ax+Math.cos(th)*L,bz=az+Math.sin(th)*L;
      yerlestir(A,ax,az,th);yerlestir(B,bx,bz,th+Math.PI);
      if(bm>0){const a=th+(r()-0.5)*2.0;yerlestir(D1,ax+Math.cos(a)*bm,az+Math.sin(a)*bm,a+Math.PI);}else yerlestir(D1,ax-25,az+20,0);
      {const a=r()*Math.PI*2,d=4+r()*4;yerlestir(D2,bx+Math.cos(a)*d,bz+Math.sin(a)*d,0);}
      m.phase='play';m.phaseT=1;m.durus=null;
      Object.assign(b,{x:ax+Math.cos(th)*0.32,z:az+Math.sin(th)*0.32,y:0,vx:0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:A});
      m.topDegisti();m.sahipYap(A);
      for(let k=0;k<6;k++)m.step(1/60);   /* tarama ve konumlar otursun */
      A.kararT=99;
      const S=G.pasSecenekleri(m,A,{ox:b.x,oz:b.z,t0:0,ilk:false,baski:G.baskiAltinda(m,A),ofs:99}).filter(o=>o.alici===B);
      let o=null;for(const c of S)if(!o||c.deger>o.deger)o=c;
      const sec=o?{tur:o.tur,hx:o.hx,hz:o.hz,tip:o.tip,alici:B,varisHizi:o.varis,T:o.T,yay:o.yay,mod:o.mod,ex:o.ex,ez:o.ez,es:o.es,guncelle:true}
        :{tur:'pas',hx:B.x,hz:B.z,tip:L>34?'hava':'yer',alici:B,mod:'ayak',guncelle:true};
      m.vurusBaslat(A,sec);
      const I=m.ist,p0=I.pas[0],c0=I.pasTamam[0];let sonuc='zaman',vurdu=false;
      for(let k=0;k<60*7;k++){m.step(1/60);
        if(!vurdu&&I.pas[0]>p0){if(!b.pas||b.pas.p!==A)break;   /* top kaptırıldı, pası başkası yaptı: sayılmaz */
          vurdu=true;const ph=b.pasHedef;if(ph){h.sapma+=G.hyp(ph.x-sec.hx,ph.z-sec.hz);h.sn++;}}
        if(I.pasTamam[0]>c0){sonuc='tamam';break;}
        if(m.phase!=='play'){sonuc='disari';break;}
        if(vurdu&&!b.pas){sonuc=b.sonTakim===1?'kesildi':'disari';break;}
        if(!vurdu&&!A.eylem&&b.sahip!==A&&k>30){sonuc='zaman';break;}}
      if(vurdu){h.n++;h[sonuc==='tamam'?'tamam':sonuc==='kesildi'?'kesildi':sonuc==='disari'?'disari':'zaman']++;if(sec.tip==='hava')h.hava++;}}}
  const f=(a,b)=>b?(100*a/b).toFixed(0).padStart(4)+'%':'   —';
  console.log(`\nB senaryosu (MM3) · pas ızgarası · hücre başına ${n} deneme (vuruş yapılanlar)\n`);
  console.log('  Uzunluk  Baskı      n   tamam  kesildi  dışarı  havadan  yön hatası (m, ort.)');
  const top={};
  for(const L of UZ)for(const [,bad] of BS){const h=T[L+'|'+bad];
    console.log('  '+(L+' m').padEnd(8)+' '+bad.padEnd(8)+String(h.n).padStart(5)+'  '+f(h.tamam,h.n)+'    '+f(h.kesildi,h.n)+'   '+f(h.disari,h.n)+'   '+f(h.hava,h.n)+'   '+(h.sn?(h.sapma/h.sn).toFixed(2):'—').padStart(6));
    const k=L<15?'<15':L<=30?'15–30':'>30';top[k]=top[k]||[0,0];top[k][0]+=h.tamam;top[k][1]+=h.n;}
  console.log('  Toplam: '+Object.entries(top).map(([k,v])=>k+' m '+f(v[0],v[1]).trim()).join(' · '));
  /* ---- 2) ilk dokunuş ---- */
  const HZ=[6,10,14,18,22],YK=[[0,'yerden'],[0.45,'0,45 m'],[1.1,'göğüs 1,1 m']],BK=[[false,'serbest'],[true,'arkada rakip']],K={};
  for(const v of HZ)for(const [y,yad] of YK)for(const [bas,bad] of BK){const h=K[v+'|'+yad+'|'+bad]={n:0,iyi:0};
    for(let i=0;i<n;i++){deneme++;let son=null;
      const m=kur((tohum||1)*1000+deneme,(ad,o)=>{if(ad==='ilkDokunus'&&o.p===R&&!son)son=o;}),R=m.teams[0][9],A=m.teams[0][7],D=m.teams[1][3],b=m.ball;
      bosalt(m,[R,A,D]);
      const rx=0,rz=34+(r()-0.5)*4,ox=rx-15,oz=rz+(r()-0.5)*3,a=Math.atan2(rz-oz,rx-ox);
      yerlestir(R,rx,rz,a+Math.PI);yerlestir(A,ox-3,oz,0);
      if(bas)yerlestir(D,rx+Math.cos(a)*1.5,rz+Math.sin(a)*1.5,a+Math.PI);else yerlestir(D,rx+30,rz+20,0);
      m.phase='play';m.phaseT=1;m.durus=null;
      for(let k=0;k<4;k++)m.step(1/60);
      const L=G.hyp(rx-ox,rz-oz);let vx,vy,vz,y0;
      if(y===0){const v0=G.yerIlkHiz(L,v,m.R);vx=Math.cos(a)*v0;vz=Math.sin(a)*v0;vy=0;y0=0;}
      else{const c=m.havadanCoz(ox,0.11,oz,rx,y,rz,L/v,0,0);vx=c.vx;vy=c.vy;vz=c.vz;y0=0.11;}
      Object.assign(b,{x:ox,z:oz,y:y0,vx,vz,vy,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:R,sut:null,pas:null,sonTakim:0,sonDokunan:A});
      m.topDegisti();
      for(let k=0;k<60*4&&!son;k++)m.step(1/60);
      if(son){h.n++;if(son.iyi)h.iyi++;}}}
  console.log(`\nB senaryosu (MM3) · ilk dokunuş · duran alıcıya 15 m'den · hücre başına ${n} deneme (dokunuş olanlar; kafa sayılmaz)\n`);
  console.log('  Hız (m/sn)  '+YK.map(([,a])=>BK.map(([,b])=>(a+' / '+b).padStart(27)).join('')).join(''));
  for(const v of HZ){let sat='  '+String(v).padEnd(11);
    for(const [,yad] of YK)for(const [,bad] of BK){const h=K[v+'|'+yad+'|'+bad];sat+=(f(h.iyi,h.n)+' ('+h.n+')').padStart(27);}
    console.log(sat);}
  return 0;
}};
