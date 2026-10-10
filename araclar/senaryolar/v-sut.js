/* ============ Gerçekçilik planı T9b senaryosu: vuruş modeli — şutun yürütülmesi (T9b-0, 2026-10-10; B kapısı) ============
   Karar katmanı kapalıdır: şut kararı verilmiş sayılır ve motorun kendi vuruş zinciri çalışır (vurusBaslat → vurusIlerle → sutVur; gelişine
   vuruşta sec.ilk). Boş sahada şutçu (ev sahibi forvet) ve rakip kaleci; kaleci önce arada bir savunmacı varmış gibi yerini alır (d-sut ile
   aynı: bire bir çıkışı değil olağan yer tutması ölçülür), sonra o savunmacı kalkar; şut hazırlığını gören kaleci hazır duruşa geçer.
   Baskı durumunda bir savunmacı (konuk stoper) şutçunun 1,6 m yanında durur ("yakın") ya da 2,6 m yandan 5,5 m/sn ile koşarak gelir ("acele");
   ikisinde de takım düzeni onu şutçuya bastırır. Hakemler oyun dışıdır. Her deneme ayrı tohumlu maçtır.
   Değişkenler: mesafe (kale ortasına, m) ve açı, şutçunun şut özelliği (0,3 / 0,6 / 0,9; profil yeniden kurulur), vuran ayak (zayıf ayak
   zorlanır), baskı (yok / yakın / acele), topun durumu (duran, yuvarlanan — yandan gelen pas, seken, havada — vole), güç (T9b-a'dan beri
   sec.guc ile sabitlenebilir; yoksa şut planı seçer), kalecinin kalesinden uzaklığı (aşırtma).
   Sonuç: şut atıldı mı (eylem şut olayına varmadan biterse vurulmadı), vuruş anında çerçeveye gidiyor mu (b.sut.cerceve), gol, kurtarış
   (kurtarıştan 1,5 sn içinde gol olursa gol), blok, dışarı; topun hızı, eylemin gücü ve stili, şut türü, açısal sapma, kötü vuruş ('kotuVurus'
   olayı; T9b-b'den) ve acele (eylemin acele alanı; T9b-b'den).
   Kapılar (gerçekçilik planı §4 T9 “T9b alt adımları”; KAPI açılınca kabul dışı çıkış kodu 1, T9b-0'da bilgi):
   [1] güç: 16 m ortadan güç 0,65 → 1,0 çerçeveye giden en az 10 puan düşer (T9b-a)
   [2] beceri: 16 m ortadan şut 0,9 olan 0,3 olandan en az 10 puan çok çerçeveye gönderir ve gol oranı en az 2 katı (T9b-a)
   [3] zayıf ayak: çerçeveye giden en az 5 puan, gol oranı en az %30 düşer; kötü vuruş olasılığı en az 2 katı (T9b-b)
   [4] acele: koşarak gelen savunmacı karşısında çerçeveye giden en az 10 puan düşer (T9b-b)
   [5] mesafe: ortalama şut hızı mesafeyle artar (11 → 25 m, adım başına en çok 0,5 m/sn geri düşebilir), 25 m'den çerçeveye giden 16 m'den az (T9b-a)
   [6] top: kötü vuruş olasılığı duran topta ≤ %3, seken ya da havadaki topta %8–20 (T9b-b)
   [7] aşırtma: kaleci 8 m öndeyken 18 m'den aşırtma seçilir (≥ %25) ve aşırtmaların en az %70'i gol (T9b-c)
   T9b-b (2026-10-10, Claude kararı): [2] ve [3] çerçeve payıyla tek başına ölçülmez — plan hatasını bilir, becerisi düşük ya da zayıf ayağıyla
   vuran oyuncu daha güvenli (ortaya yakın) nişan seçer; becerinin ve zayıf ayağın asıl bedeli gol olasılığındadır (16 m'de şut 0,3 → 0,9 gol
   %9 → 37; zayıf ayakla %22 → 7). Kötü vuruş kapıları modelin olasılığıyla (eylemin kotuP'si; deneme başına bir zarın sonucu 200 denemede ±1,5
   puan oynuyordu); gerçekleşen kötü vuruş tabloda. [7] aşırtma ile plase/sert golü kıyaslanmaz: 8 m öndeki kaleciye 10 m'den plase de çoğu
   zaman goldür; kapı aşırtmanın seçilip işlediğini sınar. Hücre başına 200 deneme (60'ta çerçeve payı ±6 puan oynuyordu).
   Kullanım: node araclar/mac-deneme.js --senaryo v-sut [N=200 hücre başına] [tohum] */
'use strict';
const KAPI={1:true,2:true,3:true,4:true,5:true,6:true,7:true};   /* T9b-a: [1] [2] [5]; T9b-b: [3] [4] [6]; T9b-c: [7] açık */
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||200,dt=1/60,t0=Date.now();
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();
    m.hakemAI=function(){};for(const r of m.refs){r.x=0;r.z=-25;r.tx=0;r.tz=-25;}return m;}`,ctx);
  const profilKur=vm.runInContext('profilKur',ctx),PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,v)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:Math.cos(yon)*(v||0),vz:Math.sin(yon)*(v||0),spd:v||0,yon,eylem:null,kickCd:0,surus:null,kosu:null,
    oyunda:true,denge:1,calim:null,yutma:null,zipla:null,yuk:0,tavir:null});};
  let deneme=0;
  /* o: {L, w (kale ortasına göre yanal), sut, zayif, baski 'yok'|'yakin'|'acele', top 'duran'|'yuvarlanan'|'seken'|'havada', guc, kaleciOnde} */
  const dene=o=>{deneme++;
    const r={atildi:false,neden:null,cer:false,sonuc:'yok',v:NaN,guc:NaN,gucPlan:NaN,stil:null,tur:null,kotu:null,kotuP:NaN,acele:false,sap:NaN};
    let atisT=-1,kurtT=-1;
    const m=kur((tohum||1)*1000+deneme,(ad,v)=>{
      if(ad==='shot'&&v&&v.p===A&&!r.atildi){r.atildi=true;atisT=m.t;const b=m.ball,s=b.sut||{},e=A.eylem||{};
        r.v=Math.hypot(b.vx,b.vy,b.vz);r.cer=!!s.cerceve;r.guc=e.guc;r.gucPlan=e.gucPlan;r.stil=e.stil;r.tur=s.tur;r.acele=e.acele!=null?!!e.acele:(e.baski||0)>0.5;
        if(e.kotu)r.kotu=e.kotu;if(e.kotuP!=null)r.kotuP=e.kotuP;if(s.nisanZ!=null&&s.hedefZ!=null)r.sap=Math.atan2(Math.abs(s.nisanZ-s.hedefZ),Math.max(1,v.dist||o.L))*180/Math.PI;}
      else if(ad==='kotuVurus'&&v&&v.p===A){r.kotu=v.tur;const e=A.eylem;if(e&&e.kotuP!=null)r.kotuP=e.kotuP;}
      else if(r.atildi&&r.sonuc==='yok'||r.sonuc==='kurtaris'){
        if(ad==='goal')r.sonuc='gol';else if(ad==='save'&&r.sonuc==='yok'){r.sonuc='kurtaris';kurtT=m.t;}else if(ad==='block'&&r.sonuc==='yok')r.sonuc='blok';}});
    const A=m.teams[0][9],K=m.teams[1][0],G=m.teams[1][3],D=m.teams[1][4],b=m.ball,d=m.dir[0],gx=d*PL;
    bosalt(m,o.baski==='yok'?[A,K,G]:[A,K,G,D]);
    if(A.ayak==='iki')A.ayak='sag';
    A.oz.sut=o.sut;A._kutle=0;A._cev=null;A._hk=undefined;profilKur(A,m.tohum);
    /* top ve şutçu: kale ortasına L m, yanal w m; şutçu topun 0,36 m gerisinde, kaleye dönük */
    const ux=Math.sqrt(Math.max(1,o.L*o.L-o.w*o.w)),bx=gx-d*ux,bz=MZ+o.w,ay=Math.atan2(MZ-bz,gx-bx),c=Math.cos(ay),s=Math.sin(ay);
    yerlestir(A,bx-c*0.36,bz-s*0.36,ay,0);
    /* kaleci yerini alır (arada savunmacı varken), sonra savunmacı kalkar */
    const Lk=Math.hypot(gx-bx,MZ-bz);yerlestir(G,bx+(gx-bx)/Lk*2.2,bz+(MZ-bz)/Lk*2.2,ay+Math.PI,0);
    Object.assign(K,{x:gx-d*1.2,z:MZ,vx:0,vz:0,spd:0,eylem:null,tavir:null,penaltiTahmin:0,yon:d>0?Math.PI:0,zipla:null,yuk:0});
    m.phase='play';m.phaseT=1;m.gameSec=600;m.durus=null;m.avantaj=null;
    Object.assign(b,{x:bx,z:bz,y:0,vx:0,vy:0,vz:0,egri:0,ust:0,sahip:null,tasiyan:null,sut:null,pas:null,agda:false,direk:false,hedefOyuncu:null,endirekt:null,tac:null,ofsaytta:null,sonTakim:0,sonDokunan:A});
    b.px=b.x;b.py=b.y;b.pz=b.z;m.topDegisti();
    for(let i=0;i<90;i++){m.t+=dt;m.kare=(m.kare||0)+1;m.kaleciKonum(K,dt);m.moveP(K,dt);}
    G.oyunda=false;G.x=G.tx=-300;G.z=G.tz=-300;
    if(o.kaleciOnde){K.x=gx-d*o.kaleciOnde;K.z=MZ;K.vx=K.vz=0;K.tx=K.x;K.tz=K.z;}
    /* baskı: yakın (1,6 m, kale tarafında çaprazda) ya da acele (2,6 m yandan koşarak gelir) */
    if(o.baski==='yakin'){const a=ay+0.9;yerlestir(D,bx+Math.cos(a)*1.6,bz+Math.sin(a)*1.6,a+Math.PI,0);}
    else if(o.baski==='acele'){const a=ay+1.5,x=bx+Math.cos(a)*2.6,z=bz+Math.sin(a)*2.6;yerlestir(D,x,z,a+Math.PI,5.5);D.tx=bx;D.tz=bz;}
    /* topun durumu */
    const sec={tur:'sut',hx:gx,hz:MZ,xg:0.08};if(o.guc!=null)sec.guc=o.guc;
    if(o.top==='duran'){m.sahipYap(A);}
    else{sec.ilk=true;sec.tekDokunus=true;const fx=A.x+c*0.45,fz=A.z+s*0.45,ga=ay+(o.w>=0?-1.75:1.75);
      if(o.top==='yuvarlanan'){const x0=fx+Math.cos(ga)*8,z0=fz+Math.sin(ga)*8,a=Math.atan2(fz-z0,fx-x0);Object.assign(b,{x:x0,z:z0,y:0,vx:Math.cos(a)*8.5,vz:Math.sin(a)*8.5,vy:0});}
      else if(o.top==='seken'){const x0=fx+Math.cos(ga)*3.2,z0=fz+Math.sin(ga)*3.2,a=Math.atan2(fz-z0,fx-x0);Object.assign(b,{x:x0,z:z0,y:1.7,vx:Math.cos(a)*2.7,vz:Math.sin(a)*2.7,vy:0});}
      else{const x0=fx+Math.cos(ga)*14,z0=fz+Math.sin(ga)*14,cz=m.havadanCoz(x0,0.3,z0,fx,0.75,fz,0.95,0,-0.03);Object.assign(b,{x:x0,z:z0,y:0.3,vx:cz.vx,vy:cz.vy,vz:cz.vz,ust:-0.03});}
      b.px=b.x;b.py=b.y;b.pz=b.z;m.topDegisti();}
    m.vurusBaslat(A,sec);const e0=A.eylem;
    if(o.zayif&&e0)e0.ayak=A.ayak==='sag'?'sol':'sag';
    for(let k=0;k<60*4;k++){A.kararT=99;m.step(dt);
      if(!r.atildi&&A.eylem!==e0){r.neden=m.phase!=='play'?'durus':b.sonDokunan&&b.sonDokunan.team===1?'rakip':'bitti';break;}
      if(r.atildi){if(r.sonuc==='gol'||r.sonuc==='blok')break;if(r.sonuc==='kurtaris'&&m.t-kurtT>1.5)break;
        if(m.phase!=='play'){if(r.sonuc==='yok')r.sonuc='disari';break;}if(m.t-atisT>3)break;}}
    return r;};
  /* hücreler */
  const H=[];const hucre=(ad,grup,o)=>H.push({ad,grup,o:Object.assign({L:16,w:0,sut:0.6,zayif:false,baski:'yok',top:'duran',guc:null,kaleciOnde:0},o)});
  for(const L of[11,16,20,25,30])for(const s of[0.3,0.6,0.9])hucre(`${L} m orta · şut ${s}`,'A',{L,sut:s});
  hucre('12 m açılı (w 7) · şut 0.6','B',{L:12,w:7});hucre('16 m açılı (w −10) · şut 0.6','B',{L:16,w:-10});
  hucre('16 m · güç 0,65','C',{guc:0.65});hucre('16 m · güç 1,0','C',{guc:1.0});
  hucre('16 m · zayıf ayak','D',{zayif:true});
  hucre('16 m · baskı yakın (1,6 m)','E',{baski:'yakin'});hucre('16 m · acele (koşarak gelen)','E',{baski:'acele'});
  hucre('12 m · yuvarlanan (gelişine)','F',{L:12,top:'yuvarlanan'});hucre('12 m · seken','F',{L:12,top:'seken'});hucre('12 m · havada (vole)','F',{L:12,top:'havada'});
  hucre('12 m · duran','F',{L:12});
  hucre('18 m · kaleci 8 m önde','G',{L:18,kaleciOnde:8});
  const STIL=['ic','ust','dis','asirtma','vole','yarimVole','burun'],TUR=['plase','sert','falso','asirtma','dusen'];
  const R=new Map();
  for(const h of H){const L=[];for(let i=0;i<n;i++)L.push(dene(h.o));R.set(h,L);}
  /* özet */
  const y=(a,c)=>c?100*a/c:NaN,f=(x,k)=>Number.isNaN(x)?'—':x.toFixed(k),ort=L=>L.length?L.reduce((a,c)=>a+c,0)/L.length:NaN;
  const med=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b);return S[Math.floor(S.length/2)];};
  const oz=L=>{const A=L.filter(r=>r.atildi),st={},tu={};for(const k of STIL)st[k]=A.filter(r=>r.stil===k).length;for(const k of TUR)tu[k]=A.filter(r=>r.tur===k).length;
    return{n:L.length,at:A.length,cer:y(A.filter(r=>r.cer).length,A.length),gol:y(A.filter(r=>r.sonuc==='gol').length,A.length),kurt:y(A.filter(r=>r.sonuc==='kurtaris').length,A.length),
      blok:y(A.filter(r=>r.sonuc==='blok').length,A.length),dis:y(A.filter(r=>r.sonuc==='disari').length,A.length),v:ort(A.map(r=>r.v)),guc:ort(A.map(r=>r.guc).filter(x=>x===x)),
      gucPlan:ort(A.map(r=>r.gucPlan).filter(x=>x===x)),kotu:y(A.filter(r=>r.kotu).length,A.length),kotuP:100*ort(L.map(r=>r.kotuP).filter(x=>x===x)),acele:y(A.filter(r=>r.acele).length,A.length),
      sap:med(A.map(r=>r.sap).filter(x=>x===x)),st,tu,A,vurulmayan:y(L.length-A.length,L.length)};};
  console.log(`\nT9b · vuruş modeli: şutun yürütülmesi · hücre başına ${n} deneme · ${H.length} hücre · ${((Date.now()-t0)/1000).toFixed(1)} sn\n`);
  console.log('  Hücre                                    atıldı  çerçeve   gol  kurt.  blok  dışarı  hız m/sn  güç (plan)   kötü (P)  acele  sapma°  stil (iç/üst/dış/aşırtma/vole/yarım/burun)   tür (plase/sert/falso/aşırtma/düşen)');
  const O=new Map();
  for(const h of H){const s=oz(R.get(h));O.set(h.ad,s);const SS=STIL.map(k=>s.st[k]).join('/'),TT=TUR.map(k=>s.tu[k]).join('/');
    console.log('  '+h.ad.padEnd(40)+(f(100-s.vurulmayan,0)+'%').padStart(7)+(f(s.cer,0)+'%').padStart(9)+(f(s.gol,0)+'%').padStart(6)+(f(s.kurt,0)+'%').padStart(7)+(f(s.blok,0)+'%').padStart(6)
      +(f(s.dis,0)+'%').padStart(8)+f(s.v,1).padStart(10)+(f(s.guc,2)+' ('+f(s.gucPlan,2)+')').padStart(13)+(f(s.kotu,0)+'% ('+f(s.kotuP,1)+')').padStart(11)+(f(s.acele,0)+'%').padStart(7)+f(s.sap,1).padStart(8)+'  '+SS.padEnd(44)+TT);}
  /* kapılar */
  const g=a=>O.get(a);let ok=true;const kapi=(k,kosul,metin)=>{const acik=KAPI[k];if(acik&&!kosul)ok=false;console.log((kosul?'  ':'! ')+`[${k}] ${metin}${acik?'':' (bilgi; kapı kapalı)'}`);};
  {const a=g('16 m · güç 0,65'),b2=g('16 m · güç 1,0');kapi(1,a.cer-b2.cer>=10,`güç 0,65 → 1,0: çerçeveye giden %${f(a.cer,0)} → %${f(b2.cer,0)} (en az 10 puan düşer); hız ${f(a.v,1)} → ${f(b2.v,1)} m/sn`);}
  {const a=g('16 m orta · şut 0.3'),b2=g('16 m orta · şut 0.9');kapi(2,b2.cer-a.cer>=10&&b2.gol>=2*a.gol,`şut 0,3 → 0,9 (16 m): çerçeveye giden %${f(a.cer,0)} → %${f(b2.cer,0)} (en az +10 puan), gol %${f(a.gol,0)} → %${f(b2.gol,0)} (en az 2 katı)`);}
  {const a=g('16 m orta · şut 0.6'),z=g('16 m · zayıf ayak'),fark=a.cer-z.cer;
    kapi(3,fark>=5&&z.gol<=0.7*a.gol&&z.kotuP>=2*a.kotuP,`zayıf ayak: çerçeveye giden %${f(a.cer,0)} → %${f(z.cer,0)} (en az 5 puan düşer), gol %${f(a.gol,0)} → %${f(z.gol,0)} (en az %30 düşer), kötü vuruş olasılığı %${f(a.kotuP,1)} → %${f(z.kotuP,1)} (en az 2 katı)`);}
  {const a=g('16 m orta · şut 0.6'),z=g('16 m · acele (koşarak gelen)');kapi(4,a.cer-z.cer>=10,`acele: çerçeveye giden %${f(a.cer,0)} → %${f(z.cer,0)} (en az 10 puan düşer); acele payı %${f(z.acele,0)}, vurulmayan %${f(z.vurulmayan,0)}`);}
  {const V=[11,16,20,25].map(L=>g(`${L} m orta · şut 0.6`).v);let artar=true;for(let i=1;i<V.length;i++)if(V[i]<V[i-1]-0.5)artar=false;
    const c16=g('16 m orta · şut 0.6').cer,c25=g('25 m orta · şut 0.6').cer;
    kapi(5,artar&&c25<c16,`mesafe: ortalama hız 11/16/20/25 m ${V.map(v=>f(v,1)).join(' / ')} m/sn (artar), çerçeveye giden 16 m %${f(c16,0)} > 25 m %${f(c25,0)}`);}
  {const du=g('12 m · duran'),se=g('12 m · seken'),ha=g('12 m · havada (vole)');
    kapi(6,du.kotuP<=3&&se.kotuP>=8&&se.kotuP<=20&&ha.kotuP>=8&&ha.kotuP<=20,`top: kötü vuruş olasılığı duran %${f(du.kotuP,1)} (≤ 3), seken %${f(se.kotuP,1)}, havada %${f(ha.kotuP,1)} (8–20); gerçekleşen %${f(du.kotu,1)} / %${f(se.kotu,1)} / %${f(ha.kotu,1)}`);}
  {const k=g('18 m · kaleci 8 m önde'),A=k.A,as=A.filter(r=>r.tur==='asirtma'),di=A.filter(r=>r.tur==='plase'||r.tur==='sert');
    const ga=y(as.filter(r=>r.sonuc==='gol').length,as.length),gd=y(di.filter(r=>r.sonuc==='gol').length,di.length),pay=y(as.length,A.length);
    kapi(7,pay>=25&&ga>=70,`aşırtma (kaleci 8 m önde, 18 m): seçilme %${f(pay,0)} (≥ 25), aşırtmanın golü %${f(ga,0)} (≥ 70; plase/sert %${f(gd,0)})`);}
  return ok?0:1;
}};
