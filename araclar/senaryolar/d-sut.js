/* ============ Chairman — D akışı senaryosu: yapay şut ızgarası (kaleci, MM4) ============
   B'nin şut seçiminden bağımsızdır: topun yeri × hedef (orta alt, orta üst, yan orta, alt köşe, üst köşe) × hız (B'nin o mesafedeki tipik şut
   hızı −3 / 0 / +3 m/sn; kabul oranları üç sütunun toplamından). Sahada yalnız kaleci
   (ve şutu atan, vuruş anında oyundan alınır) vardır; kaleci şuttan önce kendi yer tutmasıyla yerleşir (önünde bir savunmacı varken; bire bir değil).
   Şut topun bir kopyası gibi havadanCoz ile hedefe gönderilir (sutVur'daki gibi T = mesafe/hız·1,06, alçak şutta üst dönüş). Sonuç: gol, kurtarış
   (tutma/çelme; çelmeden sonraki 1,5 sn içinde gol olursa gol), dışarı. Kabul: orta alçak şut ≤20 m'den %90+, üst köşe ≥18 m'den ≤%25,
   16 m'den alt köşe %35–60; hız ve mesafeyle düzgün düşüş.
   Kullanım: node araclar/mac-deneme.js --senaryo d-sut [tekrar, varsayılan 24] */
'use strict';
const KOD=`(function(){
  const dt=1/60;
  function hazirla(tohum){
    const m=new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();
    m.hakemAI=function(){};for(const r of m.refs){r.x=0;r.z=-25;r.tx=0;r.tz=-25;}
    return m;}
  /* o: {u: kale çizgisine uzaklık, w: yanal (MZ'den), tz, ty: hedef (kale çizgisinde, MZ'den), v: hız (m/sn)} */
  function dene(m,o){
    const t=1,gk=m.kaleci(t),d=m.dir[t],gx=-d*PL,at=m.teams[1-t][9],df=m.teams[t][3],b=m.ball;
    const bx=gx+d*o.u,bz=MZ+o.w;
    m.phase='play';m.phaseT=0;m.gameSec=600;m.durus=null;m.avantaj=null;
    for(const p of m.players){p.oyunda=false;p.eylem=null;p.kickCd=0;p.surus=null;p.tutus=null;p.x=-d*30;p.z=-20;p.vx=p.vz=0;p.tx=p.x;p.tz=p.z;}
    for(const k in gk)if(k.charAt(0)==='_'&&k!=='_kutle')gk[k]=null;
    Object.assign(gk,{oyunda:true,x:gx+d*1.2,z:MZ,vx:0,vz:0,spd:0,eylem:null,tavir:null,penaltiTahmin:0,yon:d>0?0:Math.PI,zipla:null,yuk:0});
    Object.assign(at,{oyunda:true,x:bx-d*0.35,z:bz,yon:d>0?Math.PI:0});
    /* savunmacı şutçu ile kale arasında (kaleci bire bir çıkmasın); vuruştan önce oyundan alınır */
    const L=hyp(gx-bx,MZ-bz);Object.assign(df,{oyunda:true,x:bx+(gx-bx)/L*2.2,z:bz+(MZ-bz)/L*2.2,vx:0,vz:0});
    Object.assign(b,{x:bx,z:bz,y:0,vx:0,vy:0,vz:0,egri:0,ust:0,sahip:at,tasiyan:null,sut:null,pas:null,agda:false,direk:false,hedefOyuncu:null,endirekt:null,tac:null,ofsaytta:null});
    b.px=b.x;b.py=b.y;b.pz=b.z;m.topDegisti();
    for(let i=0;i<90;i++){m.t+=dt;m.kare=(m.kare||0)+1;m.kaleciKonum(gk,dt);m.moveP(gk,dt);}
    /* şut: vuruş hazırlığı görülür (kaleci yerleşir), sonra top ayaktan çıkar */
    at.eylem={ad:'vurus',faz:'geri',t:0,ft:0,sec:{tur:'sut',hx:gx,hz:MZ+o.tz},ayak:'sag',geri:0.17};
    for(let i=0;i<10;i++){m.t+=dt;m.kare++;m.kaleciKonum(gk,dt);m.moveP(gk,dt);}
    at.eylem=null;df.oyunda=false;df.x=-d*30;df.z=-20;
    const hx=gx,hz=MZ+o.tz,hy=o.ty,T=hyp(hx-bx,hz-bz)/o.v*1.06,ust=hy<0.9?0.08:0.02;
    const c=m.havadanCoz(bx,0.11,bz,hx,hy,hz,T,0,ust);
    b.sahip=null;b.y=0.11;b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.ust=ust;b.egri=0;
    m.dokunus(at,true);at.oyunda=false;at.x=-d*30;at.z=-25;
    b.sut={team:1-t,by:at,gkDone:false,cerceve:m.cerceveyeGider(1-t),xg:0,t:m.t};
    let sonuc=null,kurt=null,kurtT=0,bicim='';
    m.on=(ad,v)=>{if(ad==='goal'&&!sonuc)sonuc='gol';else if(ad==='save'&&!kurt){kurt=v.catch?'tut':'celme';kurtT=m.t;bicim=v.bicim||'';}};
    for(let i=0;i<240&&!sonuc;i++){m.step(dt);
      if(!kurt&&b.tasiyan===gk){kurt='tut';kurtT=m.t;}
      if(kurt==='tut'||(kurt&&m.t-kurtT>1.5)){sonuc=kurt;break;}
      if(m.phase!=='play'&&!sonuc)sonuc=kurt||'disari';}
    return{sonuc:sonuc||kurt||'yok',bicim};}
  return{hazirla,dene};})()`;
module.exports={calistir({ctx,vm,N,tohum}){
  const R=N||24,S=vm.runInContext(KOD,ctx),GW2=3.66,GH=2.44;
  const yerler=[{ad:'6 m',u:6,w:0},{ad:'11 m',u:11,w:0},{ad:'16 m',u:16,w:0},{ad:'20 m',u:20,w:0},{ad:'25 m',u:25,w:0},{ad:'12 m açılı',u:12,w:9},{ad:'16 m açılı',u:16,w:-12}];
  const hedefler=[{ad:'orta alt',tz:0,ty:0.3},{ad:'orta üst',tz:0,ty:1.9},{ad:'yan orta',tz:1.9,ty:1.1},{ad:'alt köşe',tz:GW2-0.45,ty:0.3},{ad:'üst köşe',tz:GW2-0.45,ty:GH-0.4}];
  /* hız sütunları: B'nin o mesafedeki tipik şut hızı (sutVur: 16 + 14·güç, güç ortalaması <11 m 0,5 · <18 m 0,7 · 18+ m 0,875) −3 / 0 / +3 m/sn */
  const hyp2=(a,b)=>Math.sqrt(a*a+b*b),tipik=u=>16+14*(u<11?0.5:u<18?0.7:0.875),hizlar=[-3,0,3],hizAd=['yavaş (−3)','tipik','sert (+3)'];
  const m=S.hazirla(tohum||1),tablo={},bicimler={};let n=0;
  for(const y of yerler)for(const h of hedefler)for(const dv of hizlar){let kurt=0,tut=0,gol=0,dis=0;const v=tipik(hyp2(y.u,y.w))+dv;
    for(let r=0;r<R;r++){const s=r%2?1:-1,o={u:y.u,w:y.w,tz:h.tz*s,ty:h.ty,v};const x=S.dene(m,o);n++;
      if(x.sonuc==='gol')gol++;else if(x.sonuc==='tut'){kurt++;tut++;}else if(x.sonuc==='celme')kurt++;else dis++;
      if(x.bicim&&x.sonuc!=='gol')bicimler[x.bicim]=(bicimler[x.bicim]||0)+1;}
    tablo[y.ad+'|'+h.ad+'|'+dv]={kurt,tut,gol,dis,n:R,v};}
  const yuzde=(a,b)=>b?Math.round(100*a/b):NaN;
  console.log(`\nD · yapay şut ızgarası · ${n} şut (${R} tekrar/hücre, tohum ${tohum||1}) · hücre: kurtarış % (tutma %) [gol/dışarı]\n`);
  console.log('  '+'Yer / hedef'.padEnd(24)+hizAd.map(v=>v.padStart(20)).join(''));
  for(const y of yerler){console.log('  '+y.ad+' (tipik '+tipik(hyp2(y.u,y.w)).toFixed(1)+' m/sn)');for(const h of hedefler){let s='    '+h.ad.padEnd(22);
      for(const v of hizlar){const c=tablo[y.ad+'|'+h.ad+'|'+v],ic=c.kurt+c.gol;s+=(`${yuzde(c.kurt,ic)}% (${yuzde(c.tut,c.kurt)||0}%) [${c.gol}/${c.dis}]`).padStart(20);}
      console.log(s);}console.log('');}
  /* kabul */
  const top=(f)=>{let k=0,g=0;for(const [a,c] of Object.entries(tablo)){const [y,h,v]=a.split('|');if(f(y,h,+v)){k+=c.kurt;g+=c.gol;}}return k+g?100*k/(k+g):NaN;};
  const orta=top((y,h)=>h==='orta alt'&&['6 m','11 m','16 m','20 m'].includes(y));
  const ust=top((y,h)=>h==='üst köşe'&&['20 m','25 m'].includes(y));
  const alt=top((y,h)=>h==='alt köşe'&&y==='16 m');
  const genel=top(()=>true);
  const sat=(ad,x,a,b)=>{const ok=x>=a&&x<=b;console.log((ok?'  ':'! ')+ad.padEnd(46)+x.toFixed(1).padStart(6)+'%'+`   hedef ${a}–${b}`);return ok;};
  let ok=true;
  ok=sat('Orta alçak şut ≤20 m kurtarış',orta,90,100)&&ok;
  ok=sat('Üst köşe ≥18 m kurtarış',ust,0,25)&&ok;
  ok=sat('Alt köşe 16 m kurtarış',alt,35,60)&&ok;
  console.log('  '+'Bütün ızgara kurtarış (bilgi)'.padEnd(46)+genel.toFixed(1).padStart(6)+'%');
  console.log('  Kurtarış biçimleri: '+Object.keys(bicimler).sort().map(k=>k+' '+bicimler[k]).join(' · '));
  return ok?0:1;
}};
