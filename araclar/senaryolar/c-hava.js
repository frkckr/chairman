/* ============ Gerçekçilik planı T0 senaryosu: hava topu düellosu ============
   Boş orta sahada yandan gelen havadan top (25 m, 1,3 sn, iniş yerinde ~2,0 m yükseklik) iki rakibin arasına iner; ikisi de takım AI'ının
   kovalayanıdır. Profiller: güçlü (boy 1,07, kafa 0,85, sertlik 0,7), orta (1,00 / 0,60 / 0,5), zayıf (0,95 / 0,45 / 0,4). Durum: duruyor (iniş
   yerinin 0,4 m yanında) ya da koşarak (iniş yerine ~3,5 m'den, çapraz). Takım ve kadro farkı kalksın diye profiller ev/konuk ve forvet/stoper kaydı arasında yer değiştirir; kütle profilden.
   Sonuç: topa kafayla ilk dokunan; düello (ist.havaTopu arttı); hava faulü; kafa yok (top göğse/yere indi). Bugün düelloyu çekişli bir puan
   (havaTopu, mac-mudahale.js) çözer. Kabul (T6, bilgi): uzun ve iyi kafa vuran %60–75 kazanır; koşarak sıçramanın üstünlüğü ölçülür.
   Kullanım: node araclar/mac-deneme.js --senaryo c-hava [N=60 durum başına] [tohum] */
'use strict';
const HV_PROFIL={guclu:{boy:1.07,kafa:0.85,sertlik:0.7},orta:{boy:1,kafa:0.6,sertlik:0.5},zayif:{boy:0.95,kafa:0.45,sertlik:0.4}};
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||60,dt=1/60,t0=Date.now();
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,pr)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:0,vz:0,spd:0,yon,eylem:null,kickCd:0,surus:null,kosu:null,oyunda:true,denge:1,zipla:null,yuk:0,boy:pr.boy,_kutle:0});
    p.oz.kafa=pr.kafa;p.oz.sertlik=pr.sertlik;p.oz.karar=0.6;
    p._kutle=72*pr.boy*pr.boy*(0.85+0.3*pr.sertlik);};   /* kütle önbelleği: kadronun yapı farkı kalksın (kutle() formülü, yapı 1) */
  /* durum: [ad, X profili, Y profili, X koşuyor mu, Y koşuyor mu] — X'in kazanma payı raporlanır */
  const DURUM=[['orta × orta, ikisi duruyor','orta','orta',false,false],['güçlü × zayıf, ikisi duruyor','guclu','zayif',false,false],
    ['güçlü × zayıf, ikisi koşarak','guclu','zayif',true,true],['orta: koşarak × duruyor','orta','orta',true,false],['zayıf koşarak × güçlü duruyor','zayif','guclu',true,false]];
  const R=[];let deneme=0;
  for(const [ad,pX,pY,kX,kY] of DURUM){const h={ad,n:0,X:0,Y:0,duello:0,faul:0,yok:0};
    for(let i=0;i<n;i++){deneme++;let ilk=null,faul=false;
      const m=kur((tohum||1)*1000+deneme,(a,v)=>{if(a==='header'&&!ilk&&v&&v.p)ilk=v.p;else if((a==='faul'||a==='avantaj')&&v&&v.neden==='hava')faul=true;}),b=m.ball;
      const ev=i%2===0,sx=i%4<2?9:3,sy=12-sx,X=m.teams[ev?0:1][sx],Y=m.teams[ev?1:0][sy];bosalt(m,[X,Y]);
      const hx=(i%3-1)*4,hz=34,yan=i%4<2?1:-1;
      /* duran: iniş yerinin iki yanında 0,4 m; koşan: ~3,5 m çaprazdan (top 2,0 m'den yüksek inerse koşan oyuncu kafa noktasını hedeflemiyor: kovala hMax) */
      const yer=(p,pr,kos,s)=>{const x=kos?hx+s*2.5:hx+s*0.4,z=kos?hz-yan*2.5:hz;yerlestir(p,x,z,Math.atan2(hz-z,hx-x),pr);};
      yer(X,HV_PROFIL[pX],kX,1);yer(Y,HV_PROFIL[pY],kY,-1);
      m.phase='play';m.phaseT=1;m.durus=null;
      const ox=hx,oz=hz-yan*24,T=1.3,c=m.havadanCoz(ox,0.11,oz,hx,2.0,hz,T,0,-0.04),h0=m.ist.havaTopu;
      Object.assign(b,{x:ox,z:oz,y:0.11,vx:c.vx,vy:c.vy,vz:c.vz,egri:0,ust:-0.04,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:ev?0:1,sonDokunan:null});
      m.topDegisti();
      for(let k=0;k<60*2.5&&!ilk&&!faul;k++){m.step(dt);if(m.phase!=='play')break;}
      h.n++;if(m.ist.havaTopu>h0)h.duello++;if(faul)h.faul++;else if(ilk===X)h.X++;else if(ilk===Y)h.Y++;else h.yok++;}
    R.push(h);}
  const y=(a,c)=>c?(100*a/c).toFixed(0).padStart(4)+'%':'   —';
  console.log(`\nT0 · hava topu düellosu · durum başına ${n} deneme · ${((Date.now()-t0)/1000).toFixed(1)} sn\n`);
  console.log('  Durum (X × Y)                         n   X kafa   Y kafa   düello   hava faulü   kafa yok   X payı (kafa olanlarda)');
  for(const h of R)console.log('  '+h.ad.padEnd(34)+String(h.n).padStart(5)+y(h.X,h.n).padStart(9)+y(h.Y,h.n).padStart(9)+y(h.duello,h.n).padStart(9)+y(h.faul,h.n).padStart(13)+y(h.yok,h.n).padStart(11)+y(h.X,h.X+h.Y).padStart(16));
  const g=R[1],p=100*g.X/Math.max(1,g.X+g.Y),kos=R[3],pk=100*kos.X/Math.max(1,kos.X+kos.Y),ok=p>=60&&p<=75;
  console.log((ok?'  ':'! ')+`Kabul (T6, bilgi): güçlü kafacı (duruyor) %60–75 kazanır → %${p.toFixed(0)}`);
  console.log(`  Koşarak sıçrama (eşit profil) kazanma payı: %${pk.toFixed(0)} (bilgi; >%50 koşanın üstünlüğü)`);
  return 0;
}};
