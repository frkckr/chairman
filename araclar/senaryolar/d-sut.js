/* ============ Chairman — D akışı senaryosu: yapay şut ızgarası (kaleci, MM4) ============
   B'nin şut seçiminden bağımsızdır: topun yeri × hedef (orta alt, orta üst, yan orta, alt köşe, üst köşe) × hız (B'nin o mesafedeki tipik şut
   hızı −3 / 0 / +3 m/sn; kabul oranları üç sütunun toplamından). Sahada yalnız kaleci
   (ve şutu atan, vuruş anında oyundan alınır) vardır; kaleci şuttan önce kendi yer tutmasıyla yerleşir (önünde bir savunmacı varken; bire bir değil).
   Şut topun bir kopyası gibi havadanCoz ile hedefe gönderilir (sutVur'daki gibi T = mesafe/hız·1,06, alçak şutta üst dönüş). Sonuç: gol, kurtarış
   (tutma/çelme; çelmeden sonraki 1,5 sn içinde gol olursa gol), dışarı. Kabul: orta alçak şut ≤20 m'den %90+, üst köşe ≥18 m'den ≤%25,
   16 m'den alt köşe %35–60 (U1'den T12'ye dek bilgi: KAPI_ALT); hız ve mesafeyle düzgün düşüş. Kaleci her şutta dinçtir (U1).
   T9b-0 (2026-10-10): çelmenin sonu — kendi kalesine (çelmeden sonra gol), oyun dışına (oyun durdu), kalecinin yeniden tuttuğu, tehlikeli bölgeye
   (top yavaşladığında ya da 1,5 sn sonra kale çizgisine 11 m ve kale ortasına 9,16 m içinde), güvenli (geri kalanı). İkinci bölüm kalecinin
   niteliğine göre (kalecilik 0,85 iyi / 0,45 kötü; 11, 16, 20 m ve 16 m açılı × beş hedef × tipik hız). Kapılar (T9b-d; KAPI_D açılınca kabul dışı
   çıkış kodu 1, T9b-0'da bilgi): iyi kalecide çelmenin dışa (oyun dışı ya da güvenli) giden payı ≥ %60, kendi kalesine ≤ %5, tehlikeli bölgeye
   ≤ %25; kötü kalecide kendi kalesine ≤ %12.
   T15-0 (2026-10-14): oyun dışı ayrılır — korner (kalecinin çizgi dışına çeldiği top her zaman kornerdir) ve öteki oyun dışı (taç); iyi
   kalecide çelmenin kornere payı bilgi satırıdır (KAPI_KORNER; T15a'nın niyetli çelmesiyle kapı olur).
   Kullanım: node araclar/mac-deneme.js --senaryo d-sut [tekrar, varsayılan 24] */
'use strict';
const KAPI_D=true;   /* T9b-d: açık */
/* U1 (2026-10-12): "alt köşe 16 m" T9b'den beri ızgaradaki yorgunluk birikimiyle (kaleci ~80 dk eylem sonrası) tutuyordu; dinç kalecide %31
   (bant 35–60) — maçta da ceza sahası içinden kurtarış %40 (gerçekte %55–65). Kaleci ve şut verimi T12'nin işi: o güne dek bilgi, T12 kabulünde kapı */
const KAPI_ALT=true;   /* T12a (2026-10-12): yeniden kapı — kalecinin hazır avantajı ve kararın adım gecikmesi düzeldi, kaleciTepki 0,27 */
const KAPI_KORNER=null;   /* T15-0: iyi kalecide çelmenin kornere payı — null: bilgi; T15a'da alt sınır (%) */
const KOD=`(function(){
  const dt=1/60;
  function hazirla(tohum){
    const m=new Match(()=>{},{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();
    m.hakemAI=function(){};for(const r of m.refs){r.x=0;r.z=-25;r.tx=0;r.tz=-25;}
    return m;}
  /* o: {u: kale çizgisine uzaklık, w: yanal (MZ'den), tz, ty: hedef (kale çizgisinde, MZ'den), v: hız (m/sn)} */
  function dene(m,o,izle){
    const t=1,gk=m.kaleci(t),d=m.dir[t],gx=-d*PL,at=m.teams[1-t][9],df=m.teams[t][3],b=m.ball;
    const bx=gx+d*o.u,bz=MZ+o.w;
    m.phase='play';m.phaseT=0;m.gameSec=600;m.durus=null;m.avantaj=null;
    for(const p of m.players){p.oyunda=false;p.eylem=null;p.kickCd=0;p.surus=null;p.tutus=null;p.x=-d*30;p.z=-20;p.vx=p.vz=0;p.tx=p.x;p.tz=p.z;}
    for(const k in gk)if(k.charAt(0)==='_'&&k!=='_kutle')gk[k]=null;
    /* U1 (2026-10-12): kaleci her şutta dinç (yorgunluk 0, sprint enerjisi tam). Eskiden ızgaranın 2520 şutu aynı maçta art arda atılırken maç boyu
       yorgunluk birikiyordu (~80 dk eylem); sonuç maçın uzunluğuna bağlıydı (yorgunluk birikimi gerçek saniye başına) */
    Object.assign(gk,{oyunda:true,x:gx+d*1.2,z:MZ,vx:0,vz:0,spd:0,eylem:null,tavir:null,penaltiTahmin:0,yon:d>0?0:Math.PI,zipla:null,yuk:0,yorgunluk:0,enerji:1});
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
    let sonuc=null,kurt=null,kurtT=0,bicim='',golSonra=false;
    m.on=(ad,v)=>{if(ad==='goal'){golSonra=true;if(!sonuc)sonuc='gol';}else if(ad==='save'&&!kurt){kurt=v.catch?'tut':'celme';kurtT=m.t;bicim=v.bicim||'';}};
    for(let i=0;i<240&&!sonuc;i++){m.step(dt);
      if(!kurt&&b.tasiyan===gk){kurt='tut';kurtT=m.t;}
      if(kurt==='tut'||(kurt&&m.t-kurtT>1.5)){sonuc=kurt;break;}
      if(m.phase!=='play'&&!sonuc)sonuc=kurt||'disari';}
    /* T9b-0: çelmenin sonu (top yavaşlayana ya da 1,5 sn daha); yalnız nitelik bölümünde (izle): ana ızgara aynı maçı sırayla kullanır, ek adımlar
       sonraki şutların rastlantısını değiştirmesin */
    let cy=null;
    if(izle&&kurt==='celme'){if(sonuc==='gol')cy='kale';
      else for(let i=0;i<=90;i++){
        if(golSonra){cy='kale';break;}if(m.phase!=='play'){cy=m.phase==='durus'&&m.durus&&m.durus.tur==='korner'?'korner':'disari';break;}if(b.tasiyan===gk){cy='tutus';break;}
        if((Math.hypot(b.vx,b.vz)<4&&b.y<0.5)||i===90){cy=Math.abs(b.x-gx)<11&&Math.abs(b.z-MZ)<9.16&&Math.abs(b.x)<PL?'tehlike':'disa';break;}
        m.step(dt);}}
    return{sonuc:sonuc||kurt||'yok',bicim,cy};}
  return{hazirla,dene};})()`;
module.exports={calistir({ctx,vm,N,tohum}){
  const R=N||24,S=vm.runInContext(KOD,ctx),GW2=3.66,GH=2.44;
  const yerler=[{ad:'6 m',u:6,w:0},{ad:'11 m',u:11,w:0},{ad:'16 m',u:16,w:0},{ad:'20 m',u:20,w:0},{ad:'25 m',u:25,w:0},{ad:'12 m açılı',u:12,w:9},{ad:'16 m açılı',u:16,w:-12}];
  const hedefler=[{ad:'orta alt',tz:0,ty:0.3},{ad:'orta üst',tz:0,ty:1.9},{ad:'yan orta',tz:1.9,ty:1.1},{ad:'alt köşe',tz:GW2-0.45,ty:0.3},{ad:'üst köşe',tz:GW2-0.45,ty:GH-0.4}];
  /* hız sütunları: B'nin o mesafedeki tipik şut hızı (sutVur: 16 + 14·güç, güç ortalaması <11 m 0,5 · <18 m 0,7 · 18+ m 0,875) −3 / 0 / +3 m/sn */
  const hyp2=(a,b)=>Math.sqrt(a*a+b*b),tipik=u=>16+14*(u<11?0.5:u<18?0.7:0.875),hizlar=[-3,0,3],hizAd=['yavaş (−3)','tipik','sert (+3)'];
  const m=S.hazirla(tohum||1),tablo={},bicimler={},CY=['kale','korner','disari','tutus','tehlike','disa'];let n=0;
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
  const sat=(ad,x,a,b,bilgi)=>{const ok=x>=a&&x<=b;console.log((ok?'  ':'! ')+ad.padEnd(46)+x.toFixed(1).padStart(6)+'%'+`   hedef ${a}–${b}`+(bilgi?` (${bilgi})`:''));return ok||!!bilgi;};
  let ok=true;
  ok=sat('Orta alçak şut ≤20 m kurtarış',orta,90,100)&&ok;
  ok=sat('Üst köşe ≥18 m kurtarış',ust,0,25)&&ok;
  ok=sat('Alt köşe 16 m kurtarış',alt,35,60,KAPI_ALT?null:'bilgi; T12 kapısı')&&ok;
  console.log('  '+'Bütün ızgara kurtarış (bilgi)'.padEnd(46)+genel.toFixed(1).padStart(6)+'%');
  console.log('  Kurtarış biçimleri: '+Object.keys(bicimler).sort().map(k=>k+' '+bicimler[k]).join(' · '));
  /* T9b-0: çelmenin sonu; kalecinin niteliğine göre (iyi 0,85 / kötü 0,45) */
  const CYAD={kale:'kendi kalesine',korner:'kornere',disari:'başka oyun dışı',tutus:'kaleci yeniden tuttu',tehlike:'tehlikeli bölgeye',disa:'güvenli'};
  const cyYaz=(ad,T)=>{const N2=CY.reduce((a,k)=>a+T[k],0);console.log('  '+ad.padEnd(28)+`çelme ${N2}: `+CY.map(k=>CYAD[k]+' '+(N2?(100*T[k]/N2).toFixed(0):'—')+'%').join(' · '));return N2;};
  console.log('');
  const nitelik={};
  for(const [ad,k] of[['iyi',0.85],['kötü',0.45]]){const m2=S.hazirla((tohum||1)+100+Math.round(k*100)),T={};for(const c of CY)T[c]=0;m2.kaleci(1).oz.kalecilik=k;
    let kurt=0,gol=0;
    for(const y of yerler.filter(y=>['11 m','16 m','20 m','16 m açılı'].includes(y.ad)))for(const h of hedefler)for(let r=0;r<R;r++){const s=r%2?1:-1;
      const x=S.dene(m2,{u:y.u,w:y.w,tz:h.tz*s,ty:h.ty,v:tipik(hyp2(y.u,y.w))},true);if(x.cy)T[x.cy]++;if(x.sonuc==='gol')gol++;else if(x.sonuc==='tut'||x.sonuc==='celme')kurt++;}
    const N2=cyYaz(`Kaleci ${ad} (kalecilik ${k})`,T);console.log('  '+''.padEnd(28)+`kurtarış %${(100*kurt/Math.max(1,kurt+gol)).toFixed(0)}`);nitelik[ad]={T,N2};}
  {const I=nitelik['iyi'],K2=nitelik['kötü'],p=(T,k,N2)=>N2?100*T[k]/N2:NaN;
    const disa=p(I.T,'korner',I.N2)+p(I.T,'disari',I.N2)+p(I.T,'disa',I.N2)+p(I.T,'tutus',I.N2),kale=p(I.T,'kale',I.N2),teh=p(I.T,'tehlike',I.N2),kaleK=p(K2.T,'kale',K2.N2);
    const kor=p(I.T,'korner',I.N2),korK=p(K2.T,'korner',K2.N2);
    const G=[[disa>=60,`iyi kalecide çelme dışa (oyun dışı, güvenli, yeniden tutuş) %${disa.toFixed(0)} (≥ 60)`],[kale<=5,`iyi kalecide kendi kalesine %${kale.toFixed(1)} (≤ 5)`],
      [teh<=25,`iyi kalecide tehlikeli bölgeye %${teh.toFixed(0)} (≤ 25)`],[kaleK<=12,`kötü kalecide kendi kalesine %${kaleK.toFixed(1)} (≤ 12)`]];
    for(const [g,a] of G){if(KAPI_D&&!g)ok=false;console.log((g?'  ':'! ')+'Kapı (T9b-d): '+a+(KAPI_D?'':' (bilgi; kapı kapalı)'));}
    {const g=KAPI_KORNER==null||kor>=KAPI_KORNER;if(!g)ok=false;
     console.log((g?'  ':'! ')+(KAPI_KORNER==null?'Bilgi (T15-0): ':'Kapı (T15a): ')+`çelmenin kornere payı iyi kalecide %${kor.toFixed(0)}, kötü kalecide %${korK.toFixed(0)}`+(KAPI_KORNER==null?'':` (iyi ≥ ${KAPI_KORNER})`));}}
  return ok?0:1;
}};
