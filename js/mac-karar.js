/* ============ Chairman — topla karar (mantık, çizimsiz) ============
   Topu tutan oyuncu önündeki seçenekleri görür, her birinin başarı olasılığını ve değerini tartar, birini seçer.
   - xG: şutun gol olma olasılığı. Kaleyi görme açısı θ = atan(7,32·x / (x²+y²−3,66²)) ve mesafeden lojistik model.
     Katsayılar hedef noktalara oturtuldu (penaltı noktası ~0,15, altıpas ~0,46, ceza sahası çizgisi ~0,07, 25 m ~0,03).
   - xT: bölge tehdidi (Singh). Topu bir yere taşımanın değeri = hedefin tehdidi − buranın tehdidi.
   - Pas başarısı: topun yol boyunca her noktaya varış zamanı ile her rakibin oraya varış zamanı karşılaştırılır
     (Spearman'ın "pitch control" fikrinin sade biçimi). Alıcı topa zamanında yetişemezse olasılık düşer.
   - Seçim: fayda = başarı × değer − başarısızlık × kayıp. Seçenekler "sıcaklıklı" rastgele seçilir: karar özelliği
     yüksek oyuncu en iyiyi daha tutarlı seçer; görüşü yüksek oyuncu daha çok seçenek görür (Football Manager yaklaşımı).
   Koordinatlar takımın hücum yönünde: u = x·yön, w = z. */
const KALE_EN=7.32,XG_K={a:-2.994,b:2.844,c:-0.0498},XG_CARPAN={ayak:1,kafa:0.5,vole:0.72};
function sutAcisi(u,w){const x=Math.max(0.3,PL-u),y=Math.abs(w-MZ);return(Math.atan2(KALE_EN*x,x*x+y*y-(KALE_EN/2)*(KALE_EN/2))+Math.PI)%Math.PI;}
function xG(u,w,parca,baski){
  if(u>PL-0.2)return 0.01;
  const t=sutAcisi(u,w),d=hyp(PL-u,w-MZ),L=XG_K.a+XG_K.b*t+XG_K.c*d;
  return 1/(1+Math.exp(-L))*(XG_CARPAN[parca||'ayak']||1)*(1-0.45*clamp(baski||0,0,1));}
/* xT: buradan topu tutan takımın golü bulma olasılığı. Kendi yarıda ~0,003, orta sahada ~0,005, ceza sahası önünde ~0,02,
   ceza sahası içinde şut olasılığıyla hızla yükselir; son üçte birin kanatları (orta ve geri çevirme bölgesi) ~0,02–0,04 */
function xT(u,w){
  const ilerleme=(u+PL)/(2*PL),yan=Math.abs(w-MZ)/MZ;
  let t=0.003+0.016*ilerleme*ilerleme*ilerleme*(1-0.15*yan);
  if(u>12)t=Math.max(t,0.75*xG(u,w,'ayak',0));
  if(u>PL-24){const k=clamp((u-(PL-24))/20,0,1)*clamp((Math.abs(w-MZ)-6)/12,0,1);t=Math.max(t,0.01+0.022*k);}
  return t;}
/* ---- zaman modelleri ---- */
/* bir oyuncunun bir noktaya varış süresi: tepki + dönüş + mesafe/hız */
function varisSuresi(o,x,z,menzil){return varisZamani(o,x,z,menzil,0.22);}
const sigma=x=>1/(1+Math.exp(-x));
/* pas analizi: başarı olasılığı, topun varış süresi. tip: 'yer' | 'hava' */
function pasAnaliz(m,p,hx,hz,tip,alici){
  const b=m.ball,L=hyp(hx-b.x,hz-b.z),rakip=m.teams[1-p.team],R=m.R,N=8;
  let v0=0,havaT=0;
  if(tip==='yer')v0=Math.min(29,yerIlkHiz(L,pasVarisHizi(L),R));else havaT=0.75+L/28;
  const px=[],pz=[],tb=[];
  for(let i=1;i<=N;i++){const f=i/N;px.push(b.x+(hx-b.x)*f);pz.push(b.z+(hz-b.z)*f);tb.push(tip==='yer'?yerSure(v0,L*f,R):havaT*f);}
  /* alıcı topu karşılar: yolda topa ondan önce yetişebildiği ilk nokta (havadan pasta yalnız iniş yeri) */
  let ir=N-1,tr=tb[N-1];
  if(alici){for(let i=tip==='hava'?N-2:0;i<N;i++){const t=varisSuresi(alici,px[i],pz[i],0.6);if(t<=tb[i]+0.05){ir=i;tr=Math.max(t,tb[i]);break;}if(i===N-1)tr=t;}}
  const sureT=Math.max(tb[ir],tr);
  let kalma=1,enIyiHava=0,kalabalik=0;const ux=(hx-b.x)/(L||1),uz=(hz-b.z)/(L||1);
  for(const o of rakip){
    if(!o.oyunda)continue;
    const ds=segD(o.x,o.z,b.x,b.z,hx,hz);if(ds>o.maxSpd*(sureT+0.2)+1.5)continue;
    /* alıcının arkasındaki (kale tarafındaki) rakip topa ancak alıcının etrafından dolaşarak gelir */
    const boy=(o.x-b.x)*ux+(o.z-b.z)*uz,arkada=alici&&boy>L*(ir+1)/N-0.4?0.35:0;
    let enIyi=0;const kaleci=o.rol==='GK';
    /* pasörün dibindeki rakip: top ilk metrelerde bacağına yakın geçerse çoğu zaman bloklanır */
    if(tip==='yer'){const yakin=segD(o.x,o.z,b.x,b.z,b.x+ux*Math.min(4,L),b.z+uz*Math.min(4,L));if(yakin<1.0)enIyi=0.85-yakin*0.35;}
    for(let i=0;i<=ir;i++){const x=px[i],z=pz[i];
      if(tip==='hava'){const t=tb[i],h=(G*havaT/2)*t-G*t*t/2;if(h>(kaleci&&kaleCeza(m,o,x,z)?2.6:2.3))continue;}
      const to=varisSuresi(o,x,z,kaleci&&kaleCeza(m,o,x,z)?1.1:0.75)+arkada;
      /* yolda: rakip toptan önce gelmeli. Karşılama noktasında: alıcıdan da önce (itişme, yarı yarıya).
         Havadan gelen topta iniş yeri bir hava mücadelesidir: rakip biraz geç kalsa da kafaya girebilir */
      const pr=i<ir?sigma((tb[i]-to-0.1)/0.14):tip==='hava'?0.75*sigma((Math.min(tr,tb[i]+0.3)-to+0.25)/0.3):0.7*sigma((Math.min(tr,tb[i]+0.3)-to-0.05)/0.16);
      if(pr>enIyi)enIyi=pr;}
    /* yerden pasta her rakip ayrı ayrı araya girebilir; havadan topta iniş yerinde asıl çekişme en iyi rakiple */
    if(tip==='hava'){enIyiHava=Math.max(enIyiHava,enIyi);if(enIyi>0.15)kalabalik++;}
    else kalma*=1-Math.min(0.97,enIyi);}
  if(tip==='hava')kalma=(1-Math.min(0.95,enIyiHava))*Math.pow(0.95,Math.max(0,kalabalik-1));
  let alinma=1;
  if(alici){if(tr>tb[N-1]+0.6)alinma=0.6;else if(tr>tb[N-1]+0.25)alinma=0.85;}
  const oz=p.oz,baski=baskiAltinda(m,p);
  const teknik=1-(0.01+L/420*(1.25-oz.pas)+baski*0.05+(tip==='hava'?0.05:0));
  return{P:clamp(kalma*alinma*teknik,0.02,0.99),sure:sureT,v0,L};}
function kaleCeza(m,o,x,z){const gx=-m.dir[o.team]*PL;return Math.abs(x-gx)<16.5&&Math.abs(z-MZ)<20.2;}
/* baskı: en yakın rakibin yakınlığı (0 = serbest, 1 = üstünde) */
function baskiAltinda(m,p){let d=99;for(const o of m.teams[1-p.team])if(o.oyunda)d=Math.min(d,hyp(o.x-p.x,o.z-p.z));return clamp((4.5-d)/3.5,0,1);}
function enYakinRakip(m,x,z,t){let e=null,d=1e9;for(const o of m.teams[1-t])if(o.oyunda){const dd=hyp(o.x-x,o.z-z);if(dd<d){d=dd;e=o;}}return{o:e,d};}
/* ofsayt çizgisi: rakibin sondan ikinci oyuncusunun u'su (hücum eden takımın çerçevesinde) */
function ofsaytCizgisi(m,t){const d=m.dir[t],us=m.teams[1-t].filter(o=>o.oyunda).map(o=>o.x*d).sort((a,b)=>b-a);return Math.max(us[1]||0,0);}

/* ---- seçenekler ---- */
/* bütün değerler aynı ölçüdedir: gol olasılığı × 100 ("puan"). Pas = başarı × hedefin tehdidi − kayıp × rakibin oradaki tehdidi */
function secenekler(m,p){
  const b=m.ball,d=m.dir[p.team],u=b.x*d,w=b.z,oz=p.oz,S=[],takim=m.taktik[p.team];
  const buradaXT=xT(u,w)*100,baski=baskiAltinda(m,p);
  /* ofsayt çizgisini oyuncu hatasız göremez: görüşü düşük olan daha çok yanılır */
  const ofs=ofsaytCizgisi(m,p.team)+m.normal()*1.4*(1.2-oz.gorus);
  const kayip=(x,z)=>0.3+xT(-x*d,z)*100;
  /* görüş: önündekileri hep görür; arkasındakileri daha önce etrafı taradıysa (görüş özelliği) */
  const gorur=(x,z,uzun)=>{const a=Math.abs(aciFark(Math.atan2(z-p.z,x-p.x),p.yon));if(a<1.9)return true;return m.rast()<oz.gorus*(uzun?0.5:0.95)*(1-(a-1.9)/2.6);};
  /* şut */
  /* şut: iyi pozisyonda istekle; uzaktan ancak iyi şutçu ve önü boşsa. Atış hattındaki savunmacı bloklayabilir */
  /* dolaylı serbest vuruşu kullanan doğrudan kaleye vurmaz (başkası dokunmadan gol olmaz) */
  if(u>PL-38&&!(b.endirekt&&b.endirekt.p===p)){let x=xG(u,w,'ayak',baski*0.4);
    const gx=d*PL,Lk=hyp(gx-b.x,MZ-b.z);let acik=1;
    for(const o of m.teams[1-p.team]){if(!o.oyunda||o.rol==='GK')continue;const on=((o.x-b.x)*(gx-b.x)+(o.z-b.z)*(MZ-b.z))/Lk;if(on<0.5||on>Math.min(14,Lk-1))continue;
      const yan=segD(o.x,o.z,b.x,b.z,gx,MZ);if(yan<1.3)acik*=1-0.6*(1-yan/1.3);}
    x*=acik;
    /* şut isteği iyi pozisyonda tam, uzaklaştıkça azalır: 18 m'ye kadar tam, 30 m'de yalnız şutun kendi değeri */
    const istek=1+(MOTOR_AYAR.sutIstegi-1)*clamp((30-Lk)/12,0,1);
    if(x>=0.017)S.push({tur:'sut',deger:x*100*(0.85+oz.sut*0.3)*istek-(1-x)*0.4,xg:x});
    else if(x>=0.008&&oz.sut>0.5&&baski<0.6)S.push({tur:'sut',deger:x*100*(0.85+oz.sut*0.3)*(0.5+0.5*istek)-(1-x)*0.4,xg:x});}
  /* paslar */
  for(const q of m.teams[p.team]){
    if(q===p||!q.oyunda)continue;const qu=q.x*d;
    if(q.rol==='GK'&&(u>-10||baski<0.3))continue;
    const k0=Math.min(1,hyp(q.x-b.x,q.z-b.z)/16),px=q.x+q.vx*k0,pz=q.z+q.vz*k0,L=hyp(px-b.x,pz-b.z);
    if(L<5||L>62)continue;
    if(!gorur(px,pz,L>35))continue;
    const ofsaytta=qu>ofs+0.3&&qu>u&&qu>0;
    const hedefler=[[px,pz,L>34?'hava':'yer','pas']];
    /* ara pası: koşan oyuncunun önüne, savunma arkasına */
    const qhiz=hyp(q.vx,q.vz);
    if((q.kosu||(q.rol!=='DEF'&&q.rol!=='GK'&&qhiz>5.5))&&q.vx*d>3&&qu>u&&qu<ofs+0.5){const k=Math.min(9,4+qhiz*0.7);hedefler.push([q.x+q.vx/qhiz*k,q.z+q.vz/qhiz*k,L>30?'hava':'yer','ara']);}
    for(const [hx,hz,tip,alt] of hedefler){
      if(hx*d>PL-1||hz<1||hz>PW-1)continue;
      if(alt==='pas'&&ofsaytta)continue;
      const A=pasAnaliz(m,p,hx,hz,tip,q),hu=hx*d,ilerleme=hu-u;
      /* alıcı topu aldığı an sıkıştırılacaksa o yerin değeri tam gerçekleşmez (topu tutamaz, geri döner) */
      const qBaski=enYakinRakip(m,hx,hz,p.team).d,sikisma=clamp((4-qBaski)/3,0,1);
      let deger=xT(hu,hz)*100*(1-MOTOR_AYAR.sikisma*sikisma)+ilerleme*(MOTOR_AYAR.ilerleme+0.015*takim.direkt)*(ilerleme<0?0.3:1-0.5*sikisma);
      if(ilerleme<-4)deger+=takim.sakin*MOTOR_AYAR.geriPas+baski*0.8;    /* geri pas: topu tutmak, baskıda güvenli çıkış */
      if(alt==='ara')deger+=0.3+takim.direkt*0.3;
      if(tip==='hava')deger+=takim.direkt*0.4-0.85;        /* havadan pas: kontrolü zor, uzun top takımın tarzına bağlı */
      if(q.rol==='GK')deger-=0.3;
      const U=A.P*deger-(1-A.P)*kayip(hx,hz)*takim.risk*MOTOR_AYAR.risk;
      S.push({tur:alt==='ara'?'ara':(tip==='hava'&&L>34?'uzun':'pas'),alici:q,hx,hz,tip,deger:U,P:A.P,v0:A.v0,sure:A.sure,L:A.L});}
  }
  /* orta ve geri çevirme: kanatta, son üçte birde */
  if(u>PL-30&&Math.abs(w-MZ)>9){
    const yakin=Math.sign(w-MZ);
    for(const [tu,tw,tip,ad] of[[PL-5,MZ+yakin*2.5,'hava','onDirek'],[PL-6.5,MZ-yakin*4,'hava','arkaDirek'],[PL-11,MZ,'hava','penalti'],[PL-12.5,MZ+yakin*6,'yer','geriCevir']]){
      const hx=tu*d,hz=tw;let en=null,enT=99;
      for(const q of m.teams[p.team]){if(q===p||!q.oyunda||q.rol==='GK'||q.rol==='DEF')continue;const t=varisSuresi(q,hx,hz,0.8);if(t<enT){enT=t;en=q;}}
      if(!en)continue;
      const A=pasAnaliz(m,p,hx,hz,tip,en),sans=xG(tu,tw,tip==='hava'?'kafa':'vole',0.35);
      const U=(A.P*(sans*100+0.8)-(1-A.P)*kayip(hx,hz)*0.5*takim.risk)*MOTOR_AYAR.ortaIstegi;
      S.push({tur:tip==='hava'?'orta':'geriCevir',alici:en,hx,hz,tip,deger:U,P:A.P,v0:A.v0,sure:A.sure,L:A.L,ortaYeri:ad});}
  }
  /* top sürme: kaleye doğru (son üçte birde kale ortasına eğilimli), boşluğa, yana */
  {const hedefYon=Math.atan2(MZ-w,(PL-u))*(u>PL-30?1:0.35);
   for(const sapma of[0,-0.6,0.6,-1.2,1.2]){
     const a=(d>0?0:Math.PI)+(d>0?1:-1)*(hedefYon+sapma),k=6,x=b.x+Math.cos(a)*k,z=clamp(b.z+Math.sin(a)*k,1.5,PW-1.5);
     if(Math.abs(x)>PL-1)continue;
     /* sürme yolu: yolun üstündeki ya da yoluna yetişebilecek her rakip (kaleci dahil) topu kesebilir.
        Yolun önündeki rakip en tehlikelisi; yandaki/arkadaki ancak sürenden önce yola girebilirse */
     let P=0.6+oz.surus*0.35;const tSur=1.1;
     for(const r of m.teams[1-p.team]){if(!r.oyunda)continue;const dy=segD(r.x,r.z,b.x,b.z,x,z);if(dy>3.2)continue;
       const ileri=((r.x-b.x)*Math.cos(a)+(r.z-b.z)*Math.sin(a)),onde=ileri>0.5,tr=varisZamani(r,b.x+(x-b.x)*0.5,b.z+(z-b.z)*0.5,0.8,0.15);
       const kes=(1-dy/3.2)*(onde?0.75:0.45)*(0.6+r.oz.mudahale*0.6)*(tr<tSur?1:0.4)*(1.15-oz.surus*0.3);
       P*=1-clamp(kes,0,0.9);}
     P=clamp(P,0.05,0.95);
     /* sürmekle kazanılan değer sınırlıdır: savunma ve kaleci kapanır (kalenin dibine kadar sürme olmaz) */
     let deger=Math.min(xT(x*d,z)*100,buradaXT+2.5)+(x*d-u)*MOTOR_AYAR.ilerleme*0.8;
     if(u>PL-18&&Math.abs(z-MZ)>Math.abs(w-MZ)+1&&Math.abs(z-MZ)>GW2+3)deger-=0.8;  /* kalenin dibine, çizgiye doğru sürme */
     S.push({tur:'sur',hx:x,hz:z,deger:P*deger-(1-P)*kayip(b.x,b.z)*0.9*takim.risk*MOTOR_AYAR.risk,P,yon:a});}}
  /* uzaklaştırma: kendi ceza sahasında baskı altında */
  if(u<-PL+24&&baski>0.3)S.push({tur:'uzaklastir',deger:-0.8+baski*0.4});
  /* topu koruma: değer yerinde kalır ama baskı arttıkça riskli */
  S.push({tur:'koru',deger:buradaXT*0.85-baski*1.5-0.2});
  return S;
}
/* seçim: sıcaklıklı rastgele (softmax); karar özelliği yüksek oyuncu en iyiyi daha tutarlı seçer */
function kararVer(m,p){
  let S=secenekler(m,p);if(!S.length)return{tur:'koru'};
  /* aynı türden çok sayıda sürme seçeneği seçimi şişirmesin: en iyi ikisi kalır */
  const sur=S.filter(s=>s.tur==='sur').sort((a,c)=>c.deger-a.deger);S=S.filter(s=>s.tur!=='sur').concat(sur.slice(0,2));
  const tau=0.12+0.42*(1-p.oz.karar);let top=0,en=-1e9;
  for(const s of S)en=Math.max(en,s.deger);
  for(const s of S){s.a=Math.exp((s.deger-en)/tau);top+=s.a;}
  let r=m.rast()*top;for(const s of S){r-=s.a;if(r<=0)return s;}
  return S[S.length-1];
}
/* ---- kafa: ceza sahasında kaleye, geride uzaklaştırma, ileride arkadaşa indirme ya da koşana uzatma ---- */
function kafaKarari(m,p){
  const b=m.ball,d=m.dir[p.team],u=b.x*d,w=b.z,baski=baskiAltinda(m,p);
  if(u>PL-14&&Math.abs(w-MZ)<12){const x=xG(u,w,'kafa',baski*0.5);
    if(x>0.03||u>PL-7){const gk=m.kaleci(1-p.team),yan=(Math.sign(MZ-gk.z)||1)*(m.rast()<0.7?1:-1),hz=MZ+yan*(GW2-0.5-m.rast()*1.3),hx=d*PL;
      const L=hyp(hx-b.x,hz-b.z),v=9+p.oz.kafa*5,T=L/v,hy=0.25+m.rast()*1.5;
      return{tur:'sut',hx,hz,v,vy:(hy-b.y+0.5*G*T*T)/T,xg:x};}}
  if(u<-PL+30||(p.rol==='DEF'&&u<5)||baski>0.7){const yan=w<MZ?-1:1,hx=b.x+d*(16+m.rast()*12),hz=clamp(b.z+yan*(4+m.rast()*12),3,PW-3);
    return{tur:'uzaklastir',hx,hz,v:10+p.oz.kafa*5,vy:5+m.rast()*3};}
  let en=null,enP=-1e9;
  for(const q of m.teams[p.team]){if(q===p||!q.oyunda||q.rol==='GK')continue;const L=hyp(q.x-b.x,q.z-b.z);if(L<3||L>17)continue;
    const bos=enYakinRakip(m,q.x,q.z,p.team).d,ileri=(q.x-b.x)*d,P=Math.min(bos,6)*0.6+ileri*0.08-L*0.05+m.rast()*0.6;if(P>enP){enP=P;en=q;}}
  if(en){const L=hyp(en.x-b.x,en.z-b.z);
    if((en.x-b.x)*d>4&&hyp(en.vx,en.vz)>4&&m.rast()<0.55){const hx=en.x+en.vx*0.9,hz=en.z+en.vz*0.9;return{tur:'pas',alt:'uzatma',hx,hz,v:Math.min(14,L*0.8+5),vy:3.2,alici:en};}
    return{tur:'indirme',hx:en.x+en.vx*0.4,hz:en.z+en.vz*0.4,v:Math.min(10,L*0.72+2.5),vy:1.2,alici:en};}
  return{tur:'uzaklastir',hx:b.x+d*14,hz:b.z,v:10,vy:4};
}
/* ---- gelişine vuruş: pas ya da orta gelirken alıcı, top gelmeden şutu seçebilir ---- */
function ilkDokunusSutu(m,p,x,z,y){
  const d=m.dir[p.team],u=x*d;if(u<PL-24||Math.abs(z-MZ)>16)return null;
  const parca=y>1.4?'kafa':y>0.45?'vole':'ayak',x2=xG(u,z,parca,baskiAltinda(m,p)*0.7);
  if(parca==='kafa')return null;  /* kafayı temas anı belirler */
  const esik=0.07-p.oz.sut*0.03;
  return x2>esik&&m.rast()<0.5+x2*4?{tur:'sut',hx:d*PL,hz:MZ,xg:x2,ilk:true}:null;
}
/* ---- kaleci topu elinde: kısa atış (açıktaki arkadaşa) ya da uzun degaj (forvete) ---- */
function kaleciDagitim(m,gk){
  const d=m.dir[gk.team],tk=m.taktik[gk.team];let en=null,enP=-1e9;
  for(const q of m.teams[gk.team]){if(q===gk||!q.oyunda)continue;const L=hyp(q.x-gk.x,q.z-gk.z);if(L<9)continue;
    const bos=enYakinRakip(m,q.x,q.z,gk.team).d;
    if(L<34&&bos>5){const P=Math.min(bos,12)*0.3-L*0.04+(1-tk.direkt)*1.6+m.rast()*1.1;if(P>enP){enP=P;en={q,tur:'elleAtis'};}}
    if((q.rol==='FV'||q.rol==='OS')&&q.x*d>-8){const P=tk.direkt*2.6+q.oz.kafa*1.4+Math.min(bos,8)*0.12+m.rast()*1.4-0.8;if(P>enP){enP=P;en={q,tur:'degaj'};}}}
  return en;
}
