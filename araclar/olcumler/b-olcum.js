'use strict';
/* ============ B akışı ölçümleri (MM3: pas, şut, ilk dokunuş) ============
   Rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları, top ve eylem alanlarını okur. Oranlar maç başına hesaplanıp
   maçlar üzerinden ortalanır (bilgi amaçlı).
   V1-0b (2026-10-20; FUTBOL_KUTUPHANESI §12.14, kutuphane/J J.10): vuruş ve pas dili. Temas anı ayak vuruşunun olaylarıdır (pass, cross, shot, clear,
   gkkick; duran topta 'kullanim' — aynı eylem bir kez sayılır); olay anında top çıkış hızındadır. Vuruşun dili (p.eylem.dil, V1-0a) temasta yazılır
   (vurusDili evre 2, olaydan sonra aynı adımda): kayıt adımın sonunda (adim) okunur. Karar anındaki açı dil.don.a0'dan (yoksa eylemin ilk görüldüğü
   adımdaki gövdeden), geri salınımın başındaki açı dil.don.kalan'dan (evre 1; yoksa geri evresinin ilk görüldüğü adımdan), temastaki açı topun çıkış
   yönüyle gövde arasından ölçülür. Açılar: f (dünya, + hedef sağda, motorun işareti); fk = f·(vuran ayak sol ? −1 : +1), + = vuran ayağın dış
   yanı; fs = f·(güçlü ayak), + = güçlü ayağın dış yanı. "Açık oyun yerden pas": pass olayı, tip yer, duran top değil (gelişine dahil).
   Yüzey: dış (stil dis), zayıf (vuran ayak tercih edilen değil), üst (stil ust; yerden pasta v > 20), güçlü iç (kalanı). Yanlış yan: dış ayak
   dışındaki vuruşta fk > 15° (0,26 rad) ya da > 30°. Dışta "zaman vardı": V1a'nın zamanYok'unun tersi — motor e.vp.zamanYok yazınca o, yazmadan
   önce yaklaşığı (gelişine değil ∧ baskı ≤ 0,5 ∧ rakibin topa varışı ≥ hazırlık + geri + koni dışı dönüş / dönüş hızı + 0,15; eylemin ilk görüldüğü
   adımda). Trivela: L ≤ 28 ∧ dış ayak becerisi ≥ 0,66 (V1a disAyak). Aile: sec.aile (V1c) ya da çıkış hızından (< 8,5 bırakma, < 14 itme, < 19 sert
   iç, ötesi sürülmüş). Eğri: topun kopyası (Match.yerEgriSapma, saf) 20 m'de telafisiz yanal sapma; kiriş sehimi pasın boyunda dört noktadan.
   Uçuş: topun kopyası (topFizikAdim) ilk inişe. Kalıcı olmayan ham diziler _bV1'de (ozet havuzlanmış tabloları basar). */
const O=require('../olcum-ortak');
const BV_AILE=['birak','itme','sert','surulmus'],BV_AILEAD={birak:'bırakma',itme:'itme',sert:'sert iç',surulmus:'sürülmüş'};
const BV_SEMA=['itme','sertIc','surulmus','lofted','chip','dis','vole'];
const BV_YOL=['hizali','pelvis','adim','acik','dis'],BV_YOLAD={hizali:'hizalı',pelvis:'pelvis',adim:'adım',acik:'açık',dis:'dış'};
const BV_EGRI=['itme','sert','surulmus','dis','plase'],BV_EGRIAD={itme:'itme / bırakma',sert:'sert iç',surulmus:'sürülmüş',dis:'dış ayak',plase:'plase'};
const BV_SINIF=['yer22','yer22+','hava','hava28','uzak','sut','ilk'],BV_SINIFAD={yer22:'yerden ≤ 22 m','yer22+':'yerden > 22 m',hava:'havadan < 28 m',hava28:'havadan ≥ 28 m',uzak:'uzaklaştırma',sut:'şut',ilk:'gelişine'};
const BV_BAS=[0,0.3,0.6,9],BV_BASAD=['baskı < 0,3','0,3–0,6','≥ 0,6'];
const BV_FS=[-9,-0.26,0.26,0.70,1.40,9],BV_FSAD=['iç yanda (< −15°)','önde (±15°)','dış 15–40°','dış 40–80°','dış > 80°'];
const BV_YUZ=['dis','zayif','guclu','ust'],BV_YUZAD={dis:'dış',zayif:'zayıf',guclu:'güçlü iç',ust:'üst'};
const bvAile=v=>v<8.5?'birak':v<14?'itme':v<19?'sert':'surulmus';
const R2=x=>Math.round(x*100)/100;
module.exports={
  bilgi:[
    ['— B: karar ve vuruş —',null,0],
    ['Planlı (yönlü) iyi ilk dokunuş %','bPlanli',1],
    ['Kötü dokunuşta ağır dokunuş payı %','bAgir',1],
    ['Ver-kaç koşusu (adet)','bVerKac',1],
    ['Dış ayakla pas %','bDis',1],
    ['Şut türü: plase %','bPlase',1],['Şut türü: sert %','bSert',1],['Şut türü: falso %','bFalso',1],['Şut türü: aşırtma %','bAsirtma',1],
    ['Orta: alçak sert (adet)','bAlcak',2],['Orta: kesme (adet)','bKesme',2],['Orta: arka direğe asma (adet)','bAsma',2],
    /* T4-V (2026-10-09; gerçekçilik planı §4 T4 madde 6): vuruş hazırlığı. Karar→temas = eylemin başından (vurusBaslat) temasa geçen süre (e.t
       olay anında); hazırlık = hazirlik → geri evresine geçiş anı (e.hazirlikT); acele = karar anında baskı > 0,5 (e.baski); vazgeçme = hat kapandı
       olayı; zayıf ayak = vuran ayak tercih edilen değil. Ortancalar maç başına, sonra maçlar üzerinden ortalanır */
    ['Vuruş: karar→temas ortanca (sn) yerden pas ≤ 22 m','bVtPas',2,[0.40,0.55,'T4-V']],['Vuruş: karar→temas ortanca (sn) şut','bVtSut',2,[0.50,0.65,'T4-V']],
    ['Vuruş: karar→temas ortanca (sn) uzun (yer > 22 m ya da havadan)','bVtUzun',2,[0.55,0.75,'T4-V']],['Vuruş: karar→temas ortanca (sn) gelişine','bVtIlk',2],
    ['Vuruş: hazırlık ortanca (sn; hazırlık → geri)','bVtHaz',2],['Vuruş: acele (karar anında baskı) %','bVtAcele',1],
    ['Vuruş: vazgeçme (hat kapandı) / maç','bVazgec',1],['Vuruş: zayıf ayakla %','bZayif',1],
    /* V1-0b: vuruş ve pas dili (J.10). Kabul hedefleri V1-plan "kabul"dedir; burada yalnız bilgi */
    ['— V1: vuruş ve pas dili (b-olcum; V1-0b) — açık oyun yerden pas (gelişine dahil) —',null,0],
    ['Yerden pas: dış ayak %','bV1Dis',1],['  dışta L ≤ 12 m ya da trivela %','bV1DisKisa',1],['  dışta zaman vardı %','bV1DisZaman',1],
    ['Yerden pas: zayıf ayak %','bV1Zayif',1],['Yerden pas: güçlü iç %','bV1Guclu',1],['Yerden pas: üst (sürülmüş) %','bV1Ust',1],
    ...BV_YOL.map(k=>[`Yol (dil): ${BV_YOLAD[k]} %`,'bV1Y_'+k,1]),
    ['Geri başında yanlış yan > 15° % (gelişine ve dış hariç; açık yol hariç)','bV1G15',1],['Geri başında yanlış yan > 30° % (aynı)','bV1G30',1],
    ['Geri başında yanlış yan > 15° % (açık yol dahil)','bV1G15A',1],
    ['Temasta yanlış yan > 15° % (güçlü iç; gelişine hariç)','bV1T15',1],['Temasta yanlış yan > 30° % (güçlü iç)','bV1T30',1],
    ['Temasta yanlış yan > 15° % (güçlü iç; gelişine)','bV1T15I',1],
    ['Stoperin dış yandaki (fs > 20°) pası: dış %','bV1SDis',1],['  zayıf %','bV1SZay',1],['  adım (yol) %','bV1SAdim',1],
    ['Karar→temas ortanca (sn): havadan ≥ 28 m (açık oyun)','bV1VtH28',2],['Karar→temas ortanca (sn): uzaklaştırma','bV1VtUz',2],
    ['Sıfır hazırlıkla ≥ 28 m havadan vuruş / maç (karar→temas < 0,35 sn, uçuş ≥ 28 m)','bV1Sifir',2],
    ['Yerden çıkış hızı %10 (m/sn)','bV1V10',1],['Yerden çıkış hızı %50 (m/sn)','bV1V50',1],['Yerden çıkış hızı %90 (m/sn)','bV1V90',1],
    ...BV_AILE.map(a=>[`Aile: ${BV_AILEAD[a]} %`,'bV1A_'+a,1]),
    ...BV_AILE.map(a=>[`  ${BV_AILEAD[a]}: tamamlama %`,'bV1AT_'+a,1]),
    ...BV_AILE.map(a=>[`  ${BV_AILEAD[a]}: kötü ilk dokunuş %`,'bV1AK_'+a,1]),
    ['Yerden pasta havalanma (vy > 0,3) %','bV1Kalkis',1],
    ...BV_EGRI.map(k=>[`Eğri 20 m telafisiz ortanca (m): ${BV_EGRIAD[k]}`,'bV1E_'+k,2]),
    ['Plase payı (yerden) %','bV1Plase',1],['Alçak havadan kısa pas / maç (yay alcakPas ya da L ≤ 16, tepe ≤ 1,6 m)','bV1Alcak',2],
    ...BV_SEMA.map(k=>[`Şema (bütün ayak vuruşları): ${k} %`,'bV1S_'+k,1]),
    ['Adımlı vuruş (dil.adim.n > 0) %','bV1Adim',1],['Mod tam %','bV1ModTam',1],
    ['Sağ ayaklı pasör: sağa pas % (yanal pas, hücum yönüne göre)','bV1Sag',1]
  ],
  yeni:(ctx)=>{
    const s={iyi:0,planli:0,kotu:0,agir:0,verKac:0,pas:0,dis:0,plase:0,sert:0,falso:0,asirtma:0,dusen:0,alcak:0,kesme:0,asma:0,
      vt:{pas:[],sut:[],uzun:[],ilk:[]},haz:[],vN:0,acele:0,vazgec:0,zayif:0};let son=null;
    const ortanca=a=>{if(!a.length)return NaN;const b=a.slice().sort((x,y)=>x-y),n=b.length;return n%2?b[(n-1)/2]:(b[n/2-1]+b[n/2])/2;};
    /* ---- V1-0b ---- */
    const F=O.bagla(ctx);
    const V={yer:0,yuz:{dis:0,zayif:0,guclu:0,ust:0},disKisa:0,disZaman:0,yol:{},yolN:0,g15:0,g30:0,gN:0,g15A:0,gNA:0,t15:0,t30:0,tN:0,t15I:0,tNI:0,
      sN:0,sDis:0,sZay:0,sAdim:0,vt:{},sifir:0,vYer:[],aile:{},ailT:{},ailK:{},kalkis:0,egri:{},sehim:{},plaseN:0,alcak:0,sema:{},dilN:0,adim:0,modTam:0,
      sag:0,sagN:0,yuzTab:{},sal:{},kol:{},on:{},yan:{},mod:{},nS:{}};
    for(const a of BV_AILE){V.aile[a]=0;V.ailT[a]=[0,0];V.ailK[a]=[0,0];}
    const ilkG=new WeakMap(),geriG=new WeakMap(),kayitli=new WeakSet(),bek=[],paslar=[],ilkBu=[];
    const ekle=(M,k,x)=>{if(x==null||x!==x)return;(M[k]||(M[k]=[])).push(R2(x));};
    const say=(M,k)=>{M[k]=(M[k]||0)+1;};
    /* temas kaydı (olay anı; top çıkış hızında) */
    const kaydet=(m,p,e,ad)=>{
      const b=m.ball,sec=e.sec||{},sut=sec.tur==='sut',tip=sec.tip||'yer',duran=!!(sec.duran||sec.penalti),sg=e.ayak==='sol'?-1:1;
      const vx=b.vx,vy=b.vy,vz=b.vz,vh=Math.hypot(vx,vz),L=Math.hypot((sec.hx!=null?sec.hx:b.x)-b.x,(sec.hz!=null?sec.hz:b.z)-b.z);
      const ig=ilkG.get(e),D=e.dil;
      const r={p,e,sec,ad,sut,tip,duran,ilk:!!sec.ilk,L,vh,vy,sg,sgG:p.ayak==='sol'?-1:1,zy:p.ayak!=='iki'&&!!e.ayak&&e.ayak!==p.ayak,
        f0:D&&D.don?D.don.a0*sg:ig?ig.f0:NaN,fkG:geriG.has(e)?geriG.get(e):NaN,fkT:O.aciFark(Math.atan2(vz,vx),p.yon)*sg,t:e.t,baski:e.baski||0,stil:e.stil,
        bx:b.x,bz:b.z,team:p.team,zv:e.vp&&e.vp.zamanYok!=null?!e.vp.zamanYok:ig?ig.zv:null,u:null,e20:null,seh:null,aile:null,ilk1:null};
      r.acikYer=ad==='pass'&&!duran&&!sut&&tip==='yer';
      if(tip==='hava'||sec.tur==='uzaklastir')r.u=O.ucus(F,m,b);
      if(r.acikYer){const eg=b.egri||0;
        if(Math.abs(eg)>1e-6&&m.yerEgriSapma){r.e20=Math.abs(m.yerEgriSapma(b.x,b.z,vx,vz,eg,20));
          const Lp=Math.max(4,Math.min(L,40)),dL=m.yerEgriSapma(b.x,b.z,vx,vz,eg,Lp);let sh=0;
          for(const k of[0.25,0.5,0.75]){const dk=m.yerEgriSapma(b.x,b.z,vx,vz,eg,Lp*k);sh=Math.max(sh,Math.abs(dk-dL*k));}r.seh=sh;}
        else{r.e20=0;r.seh=0;}
        if(b.pas&&b.pas.p===p)paslar.push({P:b.pas,p,team:p.team,t:m.t,r});}
      bek.push(r);};
    /* adımın sonunda: dil temasta yazıldı */
    const topla=(m,r)=>{
      const e=r.e,D=e.dil,sec=r.sec;
      if(D){V.dilN++;say(V.sema,D.sema);ekle(V.sal,D.sema,D.sal);ekle(V.kol,D.sema,D.kol);ekle(V.on,D.sema,D.egim.on);ekle(V.yan,D.sema,D.egim.yan);
        say(V.mod,D.mod);say(V.nS,D.adim.n);if(D.adim.n>0)V.adim++;if(D.mod==='tam')V.modTam++;}
      if(!r.duran){const sn=r.sut?'sut':r.ilk?'ilk':sec.tur==='uzaklastir'?'uzak':r.tip==='hava'?(r.L>=28?'hava28':'hava'):(r.L>22?'yer22+':'yer22');
        ekle(V.vt,sn+'|'+O.dilim(BV_BAS,r.baski),r.t);
        if(!r.sut&&!r.ilk&&r.tip==='hava'&&r.u&&r.u.inis&&r.u.inis.L>=28&&r.t<0.35)V.sifir++;}
      if(r.ad==='pass'&&!r.duran&&r.tip==='hava'&&(sec.yay==='alcakPas'||r.L<=16&&r.u&&r.u.tepe<=1.6))V.alcak++;
      if(r.ad==='pass'&&!r.duran&&r.p.ayak==='sag'&&sec.hx!=null){const d=m.dir[r.team],fa=O.aciFark(Math.atan2(sec.hz-r.bz,sec.hx-r.bx),d>0?0:Math.PI);
        if(Math.abs(fa)>0.26&&Math.abs(fa)<Math.PI-0.26){V.sagN++;if(fa>0)V.sag++;}}
      if(!r.acikYer)return;
      V.yer++;
      const yuz=r.stil==='dis'?'dis':r.zy?'zayif':r.stil==='ust'?'ust':'guclu';V.yuz[yuz]++;
      const fs=r.f0*r.sgG;if(fs===fs)say(V.yuzTab,O.dilim(BV_FS,fs)+'|'+yuz);
      if(yuz==='dis'){if(r.L<=12||r.L<=28&&O.disBeceri(F,r.p)>=0.66)V.disKisa++;if(r.zv)V.disZaman++;}
      if(D&&D.don){say(V.yol,D.don.yol);V.yolN++;}
      const acik=!!(D&&D.don&&D.don.yol==='acik');
      if(!r.ilk&&r.stil!=='dis'&&r.fkG===r.fkG){V.gNA++;if(r.fkG>0.26)V.g15A++;if(!acik){V.gN++;if(r.fkG>0.26)V.g15++;if(r.fkG>0.52)V.g30++;}}
      if(r.stil!=='dis'&&!r.zy&&r.stil!=='ust'){if(r.ilk){V.tNI++;if(r.fkT>0.26)V.t15I++;}else{V.tN++;if(r.fkT>0.26)V.t15++;if(r.fkT>0.52)V.t30++;}}
      if(r.p.rol==='DEF'&&!(r.p.mevki&&r.p.mevki.bek)&&fs>0.35){V.sN++;if(yuz==='dis')V.sDis++;if(r.zy)V.sZay++;if(D&&D.don&&D.don.yol==='adim')V.sAdim++;}
      V.vYer.push(R2(r.vh));
      const aile=sec.aile||(D&&D.aile)||bvAile(r.vh);r.aile=aile;if(aile in V.aile)V.aile[aile]++;
      if(r.vy>0.3)V.kalkis++;
      const plase=!!(D&&D.plase)||!!(e.vp&&e.vp.plase);if(plase)V.plaseN++;
      const ek=plase?'plase':r.stil==='dis'?'dis':aile==='surulmus'||r.stil==='ust'?'surulmus':aile==='sert'?'sert':'itme';
      ekle(V.egri,ek,r.e20);ekle(V.sehim,ek,r.seh);};
    return{
      dinle(ad,v,m){
        if(ad==='ilkDokunus'&&v.tur==='ayak'){if(v.iyi){s.iyi++;if(v.plan)s.planli++;}else{s.kotu++;if(v.agir)s.agir++;}}
        else if(ad==='kosu'&&v.verKac)s.verKac++;
        else if(ad==='vazgecti')s.vazgec++;
        else if(ad==='pass'||ad==='cross'||ad==='shot'){const e=v.p&&v.p.eylem;if(e&&e.ad==='vurus'){
          if(ad!=='shot'){s.pas++;if(e.stil==='dis')s.dis++;
            if(ad==='cross'){const sec=e.sec||{};if(sec.tip==='yer')s.alcak++;else if(sec.yay==='asma')s.asma++;else s.kesme++;}}
          /* T4-V: vuruş zamanlaması (olay vurusSon içinde atılır; e.t eylemin yaşı, evre hâlâ 'geri') */
          const sec=e.sec||{},L=v.L||0,grup=sec.ilk?'ilk':ad==='shot'?'sut':(sec.tip==='hava'||L>22)?'uzun':'pas';
          if(e.t!=null)s.vt[grup].push(e.t);if(e.hazirlikT!=null)s.haz.push(e.hazirlikT);
          s.vN++;if(e.baski!=null&&e.baski>0.5)s.acele++;
          const p=v.p;if(p.ayak&&p.ayak!=='iki'&&e.ayak&&e.ayak!==p.ayak)s.zayif++;}}
        /* V1-0b */
        if(ad==='ilkDokunus'&&v&&v.p)ilkBu.push(v);
        if(m&&v&&v.p&&(ad==='pass'||ad==='cross'||ad==='shot'||ad==='clear'||ad==='gkkick'||ad==='kullanim')){const e=v.p.eylem;
          if(e&&e.ad==='vurus'&&!kayitli.has(e)){kayitli.add(e);kaydet(m,v.p,e,ad);}}
      },
      /* şut türü (b.sut.tur): şut nesnesi ilk görüldüğü adımda sayılır */
      adim(m){const su=m.ball.sut;if(su&&su!==son){son=su;if(su.tur&&su.tur in s)s[su.tur]++;}
        /* V1-0b: bu adımın temas kayıtları (dil temasta yazıldı), eylemlerin ilk görülüşü ve geri salınımın başı, pasların sonucu */
        for(const r of bek)topla(m,r);bek.length=0;
        const b=m.ball;
        for(const p of m.players){const e=p.eylem;if(!e||e.ad!=='vurus')continue;const sec=e.sec||{},sg=e.ayak==='sol'?-1:1;
          if(!ilkG.has(e)){const D=e.dil,f0=D&&D.don?D.don.a0*sg:O.aciFark(Math.atan2(sec.hz-b.z,sec.hx-b.x),p.yon);let zv=null;
            if(e.stil==='dis'&&F&&F.zamanButcesi&&F.vurusSureleri){const bas=e.baski||0;
              if(sec.ilk||bas>0.5)zv=false;
              else{const L=Math.hypot(sec.hx-b.x,sec.hz-b.z),tR=F.zamanButcesi(m,p,b.x,b.z,m.teams[1-p.team]),vs=F.vurusSureleri(L>22?'uzunYer':'pas',bas),fk=f0*sg;
                const need=fk>0.26?fk-0.26:fk<-0.70?-0.70-fk:0,A=F.MOTOR_AYAR,da=A&&A.donusAdim,rate=da&&da[0]>0?da[0]:F.hrkVurusDonus?F.hrkVurusDonus(p):6;
                zv=tR>=vs.haz+vs.geri+need/rate+(da?da[2]:0.15);}}
            ilkG.set(e,{f0,zv});}
          if(e.faz==='geri'&&!geriG.has(e)){const D=e.dil;geriG.set(e,D&&D.don?D.don.kalan:O.aciFark(Math.atan2(sec.hz-b.z,sec.hx-b.x),p.yon)*sg);}}
        for(let i=paslar.length-1;i>=0;i--){const X=paslar[i];let ok=null;
          if(b.pas!==X.P){const q=b.sonDokunan;ok=!!(q&&q!==X.p&&q.team===X.team);if(ok){const il=ilkBu.find(o=>o.p===q);if(il)X.r.ilk1=il.iyi?1:0;}}
          else if(m.phase!=='play'||m.t-X.t>8)ok=false;
          if(ok!==null){const a=X.r.aile;if(a&&V.ailT[a]){V.ailT[a][1]++;if(ok)V.ailT[a][0]++;if(ok&&X.r.ilk1!=null){V.ailK[a][1]++;if(!X.r.ilk1)V.ailK[a][0]++;}}paslar.splice(i,1);}}
        ilkBu.length=0;},
      bitir(){const y=(a,c)=>c?100*a/c:NaN,ts=s.plase+s.sert+s.falso+s.asirtma+s.dusen;
        const r={bPlanli:y(s.planli,s.iyi),bAgir:y(s.agir,s.kotu),bVerKac:s.verKac,bDis:y(s.dis,s.pas),
          bPlase:y(s.plase,ts),bSert:y(s.sert,ts),bFalso:y(s.falso,ts),bAsirtma:y(s.asirtma,ts),bAlcak:s.alcak,bKesme:s.kesme,bAsma:s.asma,
          bVtPas:ortanca(s.vt.pas),bVtSut:ortanca(s.vt.sut),bVtUzun:ortanca(s.vt.uzun),bVtIlk:ortanca(s.vt.ilk),bVtHaz:ortanca(s.haz),
          bVtAcele:y(s.acele,s.vN),bVazgec:s.vazgec,bZayif:y(s.zayif,s.vN)};
        /* V1-0b: oranlar havuzlanır (ham: [pay, payda]) */
        const H=r.ham={},n=V.yer,dis=V.yuz.dis;
        H.bV1Dis=[dis,n];H.bV1DisKisa=[V.disKisa,dis];H.bV1DisZaman=[V.disZaman,dis];H.bV1Zayif=[V.yuz.zayif,n];H.bV1Guclu=[V.yuz.guclu,n];H.bV1Ust=[V.yuz.ust,n];
        for(const k of BV_YOL)H['bV1Y_'+k]=[V.yol[k]||0,V.yolN];
        H.bV1G15=[V.g15,V.gN];H.bV1G30=[V.g30,V.gN];H.bV1G15A=[V.g15A,V.gNA];H.bV1T15=[V.t15,V.tN];H.bV1T30=[V.t30,V.tN];H.bV1T15I=[V.t15I,V.tNI];
        H.bV1SDis=[V.sDis,V.sN];H.bV1SZay=[V.sZay,V.sN];H.bV1SAdim=[V.sAdim,V.sN];
        for(const a of BV_AILE){H['bV1A_'+a]=[V.aile[a],n];H['bV1AT_'+a]=V.ailT[a];H['bV1AK_'+a]=V.ailK[a];}
        H.bV1Kalkis=[V.kalkis,n];H.bV1Plase=[V.plaseN,n];
        for(const k of BV_SEMA)H['bV1S_'+k]=[V.sema[k]||0,V.dilN];
        H.bV1Adim=[V.adim,V.dilN];H.bV1ModTam=[V.modTam,V.dilN];H.bV1Sag=[V.sag,V.sagN];
        const vtB=k=>[0,1,2].reduce((a,i)=>a.concat(V.vt[k+'|'+i]||[]),[]);
        r.bV1VtH28=ortanca(vtB('hava28'));r.bV1VtUz=ortanca(vtB('uzak'));r.bV1Sifir=V.sifir;r.bV1Alcak=V.alcak;
        r.bV1V10=O.yuzde(V.vYer,0.1);r.bV1V50=O.yuzde(V.vYer,0.5);r.bV1V90=O.yuzde(V.vYer,0.9);
        for(const k of BV_EGRI)r['bV1E_'+k]=V.egri[k]?ortanca(V.egri[k]):NaN;
        r._bV1={yuzTab:V.yuzTab,vt:V.vt,vYer:V.vYer,sal:V.sal,kol:V.kol,on:V.on,yan:V.yan,egri:V.egri,sehim:V.sehim,yol:V.yol,mod:V.mod,nS:V.nS};
        return r;}
    };
  },
  /* V1-0b: havuzlanmış tablolar (bütün maçlar) */
  ozet(sonuclar){
    const S=sonuclar.map(s=>s._bV1).filter(Boolean);if(!S.length)return;
    const birles=k=>{const M={};for(const x of S){const A=x[k]||{};for(const a in A){const v=A[a];if(Array.isArray(v))(M[a]||(M[a]=[])).push(...v);else M[a]=(M[a]||0)+v;}}return M;};
    const f=(x,n)=>x===x&&x!=null?x.toFixed(n==null?2:n):'—',yz=(a,c)=>c?(100*a/c).toFixed(0)+'%':'—',P3=a=>`${f(O.yuzde(a,0.1))} / ${f(O.yuzde(a,0.5))} / ${f(O.yuzde(a,0.9))}`;
    /* 1) yüzey × karar anındaki açı (güçlü ayağın çerçevesinde) */
    const YT=birles('yuzTab');
    console.log('\n  V1 (b-olcum): açık oyun yerden pasta yüzey × karar anında hedefin yeri (fs, güçlü ayağın çerçevesinde; satır payları)');
    console.log('  '+''.padEnd(22)+'n'.padStart(6)+BV_YUZ.map(k=>BV_YUZAD[k].padStart(10)).join(''));
    for(let i=0;i<BV_FSAD.length;i++){const n=BV_YUZ.reduce((a,k)=>a+(YT[i+'|'+k]||0),0);if(!n)continue;
      console.log('  '+BV_FSAD[i].padEnd(22)+String(n).padStart(6)+BV_YUZ.map(k=>yz(YT[i+'|'+k]||0,n).padStart(10)).join(''));}
    /* 2) karar→temas %10/50/90 sınıf × baskı */
    const VT=birles('vt');
    console.log('\n  V1: karar→temas %10 / %50 / %90 (sn; açık oyun) — sınıf × karar anındaki baskı');
    console.log('  '+''.padEnd(18)+BV_BASAD.map(a=>a.padStart(30)).join(''));
    for(const k of BV_SINIF){let sat='  '+BV_SINIFAD[k].padEnd(18),var_=false;
      for(let i=0;i<3;i++){const a=VT[k+'|'+i]||[];if(a.length)var_=true;sat+=(a.length?P3(a)+` (${a.length})`:'—').padStart(30);}
      if(var_)console.log(sat);}
    /* 3) yerden çıkış hızı: yüzdelikler, 2 m/sn histogramı ve tepe sayısı */
    const VY=[].concat(...S.map(x=>x.vYer||[]));
    if(VY.length){const H=[];for(const v of VY){const i=Math.min(15,Math.floor(v/2));H[i]=(H[i]||0)+1;}for(let i=0;i<16;i++)H[i]=H[i]||0;
      const n=VY.length,tepe=[];for(let i=0;i<16;i++){const c=H[i];if(c>=0.04*n&&c>=(i?H[i-1]:0)&&c>(i<15?H[i+1]:0))tepe.push(i);}
      /* ayrı tepe: aradaki çukur küçük tepenin 0,8'inden düşük */
      let ayri=tepe.length?1:0;for(let j=1;j<tepe.length;j++){const a=tepe[j-1],c=tepe[j];let cuk=Infinity;for(let i=a;i<=c;i++)cuk=Math.min(cuk,H[i]);if(cuk<=0.8*Math.min(H[a],H[c]))ayri++;}
      console.log(`\n  V1: açık oyun yerden pas çıkış hızı %10 / %50 / %90 = ${P3(VY)} m/sn (n ${n}; %10–%90 aralığı ${f(O.yuzde(VY,0.9)-O.yuzde(VY,0.1),1)}) · ayrı tepe ${ayri}`);
      console.log('  histogram (2 m/sn): '+H.map((c,i)=>c?`${2*i}–${2*i+2}: ${(100*c/n).toFixed(0)}%`:null).filter(Boolean).join(' · '));}
    /* 4) dil: şema × salınım, kol, eğim; yol, mod, adım */
    const SAL=birles('sal'),KOL=birles('kol'),ON=birles('on'),YAN=birles('yan');
    console.log('\n  V1: vuruşun dili (bütün ayak vuruşları) — şema: n · sal %10/50/90 · kol %10/50/90 · eğim öne %50 · yana %50');
    for(const k of BV_SEMA){const a=SAL[k]||[];if(!a.length)continue;
      console.log('  '+k.padEnd(10)+String(a.length).padStart(6)+'  sal '+P3(a)+'  kol '+P3(KOL[k]||[])+'  öne '+f(O.ortanca(ON[k]||[]))+'  yana '+f(O.ortanca(YAN[k]||[])));}
    const YOL=birles('yol'),MOD=birles('mod'),NS=birles('nS'),top=o=>Object.values(o).reduce((a,c)=>a+c,0);
    console.log('  yol: '+Object.keys(YOL).sort().map(k=>`${k} ${yz(YOL[k],top(YOL))}`).join(' · ')+' · mod: '+Object.keys(MOD).sort().map(k=>`${k} ${yz(MOD[k],top(MOD))}`).join(' · ')+
      ' · adım n: '+Object.keys(NS).sort().map(k=>`${k} ${yz(NS[k],top(NS))}`).join(' · '));
    /* 5) eğri */
    const EG=birles('egri'),SH=birles('sehim');
    console.log('  eğri (açık oyun yerden pas; m): '+BV_EGRI.filter(k=>(EG[k]||[]).length).map(k=>`${BV_EGRIAD[k]} n ${EG[k].length}: 20 m'de ortanca ${f(O.ortanca(EG[k]))} %90 ${f(O.yuzde(EG[k],0.9))}, sehim ${f(O.ortanca(SH[k]||[]))}`).join(' · '));
  }
};
