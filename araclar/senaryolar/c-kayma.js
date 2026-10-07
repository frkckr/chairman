/* ============ Gerçekçilik planı T0 senaryosu: kayarak müdahale ============
   Boş sahada hücumcu (ev sahibi kanat) 4,5–6,5 m/sn ile kaleye sürer, topu ~1,6 m önünde (uzun dokunuş); savunmacı (konuk bek) 5–7 m/sn ile yandan,
   çaprazdan ya da arkadan-yandan gelir. Kayma motorun kendi işlevleriyle başlar (kaymaBaslat; temas kaymaTemas → mudahaleSonuc): hedef, motorun
   karar koşulundaki gibi savunmacının topa yetişeceği nokta. Değişkenler: geliş açısı ve savunmacının müdahale becerisi (0,4 / 0,8).
   Sonuç: temiz / dürttü (top kazanıldı), blok, geçildi (ıska), faul; ayrıca faulsüz temasta hücumcunun düşmesi (dusus, neden 'kayma').
   Kabul (T5, bilgi): kayma kaynaklı faulsüz düşüş sıfırdan büyük. Kullanım: node araclar/mac-deneme.js --senaryo c-kayma [N=60 hücre başına] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||60,dt=1/60,t0=Date.now();let sd=(tohum||1)*2654435761>>>0;
  const r=()=>{sd=(sd+0x6D2B79F5)>>>0;let t=sd;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};   /* kurulum rastlantısı (mulberry32) */
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const profilKur=vm.runInContext('profilKur',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  /* geliş açısı: savunmacının hücumcunun koşu yönüne göre yeri (derece; 90 yandan, 135 arkadan-yandan, 60 önden-çapraz) */
  const ACI=[[60,'önden çapraz (60°)'],[90,'yandan (90°)'],[135,'arkadan-yandan (135°)']],BEC=[0.4,0.8],T={};let deneme=0;
  const SONUC=['temiz','durttu','blok','gecildi','faul'];
  for(const [aci] of ACI)for(const bc of BEC){const h=T[aci+'|'+bc]={n:0,dusus:0,kart:0,yok:0};for(const s of SONUC)h[s]=0;
    for(let i=0;i<n;i++){deneme++;let son=null,dusus=false,kart=false;
      const m=kur((tohum||1)*1000+deneme,(ad,v)=>{if(ad==='mudahaleSonuc'&&!son)son=v;else if(ad==='dusus'&&v&&v.p===A&&v.neden==='kayma')dusus=true;else if(ad==='faul'&&v&&v.kart)kart=true;});
      const A=m.teams[0][7],D=m.teams[1][2],b=m.ball,d=m.dir[0],hy=d>0?0:Math.PI;bosalt(m,[A,D]);
      D.oz.mudahale=bc;profilKur(D,m.tohum);   /* T3: profil özellikten türetilir */
      const yan=i%2?1:-1,ax=d*10,az=34+yan*8,v=4.5+2*r();
      Object.assign(A,{x:ax,z:az,tx:ax,tz:az,vx:d*v,vz:0,spd:v,yon:hy,eylem:null,kickCd:0,surus:null,denge:1,oyunda:true,_calim:null});
      Object.assign(b,{x:ax+d*1.6,z:az,y:0,vx:d*7,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:A});
      /* savunmacı topun 2–3,4 m ötesinde, açıya göre (±15°); topa doğru 5–7 m/sn */
      const a=hy+yan*(aci+(r()-0.5)*30)*Math.PI/180,R=2.0+1.4*r(),vd=5+2*r(),dx=b.x+Math.cos(a)*R,dz=b.z+Math.sin(a)*R,ya=Math.atan2(b.z-dz,b.x-dx);
      Object.assign(D,{x:dx,z:dz,tx:dx,tz:dz,vx:Math.cos(ya)*vd,vz:Math.sin(ya)*vd,spd:vd,yon:ya,eylem:null,kickCd:0,surus:null,denge:1,oyunda:true});
      m.phase='play';m.phaseT=1;m.durus=null;m.topDegisti();m.sahipYap(A);A.surus={yon:hy,hiz:1};
      /* motorun koşulundaki gibi: savunmacının topa yetişme anı ve yeri */
      const db=Math.hypot(b.x-D.x,b.z-D.z),tK=(db-1.1)/(D.spd+1.2);m.kaymaBaslat(D,A,b.x+b.vx*tK,b.z+b.vz*tK);
      for(let k=0;k<60*2.5;k++){A.kararT=99;if(b.sahip===A&&!A.surus)A.surus={yon:hy,hiz:1};m.step(dt);if(son&&k>40)break;if(m.phase!=='play'&&son)break;}
      h.n++;if(!son)h.yok++;else h[son.faul?'faul':son.sonuc||'gecildi']++;if(dusus&&!(son&&son.faul))h.dusus++;if(kart)h.kart++;}}
  const y=(a,c)=>c?(100*a/c).toFixed(0).padStart(4)+'%':'   —';
  console.log(`\nT0 · kayarak müdahale · hücre başına ${n} deneme · ${((Date.now()-t0)/1000).toFixed(1)} sn\n`);
  console.log('  Geliş                   müdahale    n   temiz  dürttü    blok  geçildi   faul   kart   faulsüz düşüş   temas yok');
  let dus=0;
  for(const [aci,ad] of ACI)for(const bc of BEC){const h=T[aci+'|'+bc];dus+=h.dusus;
    console.log('  '+ad.padEnd(24)+bc.toFixed(1).padStart(8)+String(h.n).padStart(5)+SONUC.map(s=>y(h[s],h.n).padStart(s==='gecildi'?9:8)).join('')+y(h.kart,h.n).padStart(7)+y(h.dusus,h.n).padStart(16)+y(h.yok,h.n).padStart(12));}
  console.log((dus>0?'  ':'! ')+`Kabul (T5, bilgi): kayma kaynaklı faulsüz düşüş > 0 → ${dus} düşüş`);
  return 0;
}};
