/* ============ Gerçekçilik planı T6 senaryosu: hava topu düellosu (T0'da kuruldu; T6-0'da, 2026-10-10, kapıya hazırlandı) ============
   Boş sahada havadan gelen top iki (ya da üç) oyuncunun arasına iner; hepsi takım AI'ının kovalayanıdır (başka saha oyuncusu yok; kaleciler
   yerinde). Profiller: güçlü (boy 1,07, kafa 0,85, sertlik 0,7), orta (1,00 / 0,60 / 0,5), zayıf (0,95 / 0,45 / 0,4); hız ve karar 0,6. Takım ve
   kadro farkı kalksın diye profiller ev/konuk ve forvet/stoper kaydı arasında yer değiştirir; kütle profilden. Kişisel profil sapması (±0,08)
   ve gün formu kalır (eşit durum tam eşit değildir).
   Top A (yan top): orta sahada yandan 24 m, 1,3 sn, iniş yerinde ~2,0 m. Yerleşim: dur — iniş yerinin iki yanında 0,4 m (uçuşa dik); kos — ~3,5 m
   çaprazdan duruştan koşarak (top gelirken hızlanır); gec — iniş yerinin 2,5 m gerisinden (topun gittiği yönde) duruştan.
   Top B (orta benzeri): sağ kanattan (u = 40, w = 6) arka direğe (u = 43,5, w = MZ+3; ~2,0 m), 1,25 sn; hücumcu ceza sahası dışından koşar,
   savunmacı kale tarafında (rakip kaleci yerinde).
   Top C (iki hücumcu, bir savunmacı): top A; hücumcular iniş yerinin iki yanında 0,6 m, savunmacı 0,6 m gerisinde.
   Sonuç: topa ilk dokunan ve türü (kafa, göğüs, ayak, gövde, kalecinin eli); düello (m.ist.havaTopu arttı); hava faulü; temas anında top − alın
   (m); sıçrayan. "X payı" kafa olanlarda X'in payı.
   T6 kapıları (gerçekçilik planı §4 T6 "Kabul"; KAPI açıkken kabul dışı çıkış kodu 1, kapalıyken bilgi): güçlü × zayıf (duruyor) %60–75;
   eşit profilde koşarak sıçrayan > %50; eşit ve ikisi duruyor %40–60; top A durumlarında (1–6) kafa yok ≤ %10.
   Kullanım: node araclar/mac-deneme.js --senaryo c-hava [N=60 durum başına] [tohum] */
'use strict';
const KAPI=false;   /* T6-0: bilgi; motorun T6 modeli gelince (T6b) kapı açılır */
const HV_PROFIL={guclu:{boy:1.07,kafa:0.85,sertlik:0.7},orta:{boy:1,kafa:0.6,sertlik:0.5},zayif:{boy:0.95,kafa:0.45,sertlik:0.4}};
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||60,dt=1/60,t0=Date.now();
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const profilKur=vm.runInContext('profilKur',ctx),PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,pr)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:0,vz:0,spd:0,yon,eylem:null,kickCd:0,surus:null,kosu:null,oyunda:true,denge:1,zipla:null,yuk:0,boy:pr.boy,_kutle:0});
    p.oz.kafa=pr.kafa;p.oz.sertlik=pr.sertlik;p.oz.karar=0.6;p.oz.hiz=0.6;p.maxSpd=6.4+2.4*0.6;p._hk=null;p._cev=null;profilKur(p,0);   /* T3: profil özellikten türetilir */
    p._kutle=72*pr.boy*pr.boy*(0.85+0.3*pr.sertlik);};   /* kütle önbelleği: kadronun yapı farkı kalksın (kutle() formülü, yapı 1) */
  /* durum: [ad, top, X profili, Y profili, X yerleşimi, Y yerleşimi, (Z profili, Z yerleşimi)] — X'in kazanma payı raporlanır */
  const DURUM=[['eşit (orta × orta), ikisi duruyor','A','orta','orta','dur','dur'],['güçlü × zayıf, ikisi duruyor','A','guclu','zayif','dur','dur'],
    ['güçlü × zayıf, ikisi koşarak','A','guclu','zayif','kos','kos'],['eşit: X koşarak × Y duruyor','A','orta','orta','kos','dur'],
    ['zayıf koşarak × güçlü duruyor','A','zayif','guclu','kos','dur'],['eşit: X geç (2,5 m geriden) × Y duruyor','A','orta','orta','gec','dur'],
    ['orta: hücumcu koşarak × savunmacı (eşit)','B','orta','orta','kos','dur'],['iki hücumcu (X, Z) × bir savunmacı (Y)','C','orta','orta','dur','dur','orta','dur']];
  const R=[];let deneme=0;
  for(const [ad,top,pX,pY,yX,yY,pZ] of DURUM){const h={ad,top,n:0,X:0,Y:0,Z:0,duello:0,faul:0,yok:0,gogus:0,ayak:0,el:0,fark:[],sX:0,sY:0};
    for(let i=0;i<n;i++){deneme++;let ilk=null,tur=null,faul=false,fark=null;
      const m=kur((tohum||1)*1000+deneme,(a,v)=>{if(ilk||faul)return;
        if(a==='header'&&v&&v.p){ilk=v.p;tur='kafa';const p=v.p;fark=m.ball.y-(1.72*(p.boy||1)+0.12+(p.yuk||0)-0.1);}
        else if(a==='ilkDokunus'&&v&&v.p){ilk=v.p;tur=v.tur==='gogus'?'gogus':'ayak';}
        else if((a==='sekme'||a==='block')&&v&&v.p){ilk=v.p;tur='ayak';}
        else if((a==='faul'||a==='avantaj'||a==='faulGorulmedi')&&v&&(v.neden==='hava'||v.kaynak==='hava'))faul=true;}),b=m.ball;
      const ev=i%2===0,sx=i%4<2?9:3,sy=12-sx;
      /* top C: X ve Z hücumcu (aynı takım), Y savunmacı */
      const X=m.teams[ev?0:1][sx],Y=m.teams[ev?1:0][sy],Z=pZ?m.teams[ev?0:1][sx===9?10:2]:null;
      bosalt(m,Z?[X,Y,Z]:[X,Y]);
      let ox,oz,hx,hz,hy=2.0,T=1.3;
      const yan=i%4<2?1:-1;
      if(top==='B'){/* takım X'in hücum yönünde: kanattan arka direğe */const d=m.dir[X.team];hx=d*(PL-9);hz=MZ+3*yan;ox=d*(PL-12.5);oz=yan>0?6:62;T=1.25;
        const ux=d*(PL-15),uz=MZ+6*yan;yerlestir(X,ux,uz,Math.atan2(hz-uz,hx-ux),HV_PROFIL[pX]);
        const vx=d*(PL-7.5),vz=MZ+2.2*yan;yerlestir(Y,vx,vz,Math.atan2(oz-vz,ox-vx),HV_PROFIL[pY]);}
      else{hx=(i%3-1)*4;hz=34;ox=hx;oz=hz-yan*24;
        /* dur: iniş yerinin iki yanında 0,4 m (C: 0,6 m; savunmacı 0,6 m geride); kos: ~3,5 m çaprazdan; gec: topun gittiği yönde 2,5 m geriden */
        const yer=(p,pr,y,s,ara)=>{const x=y==='kos'?hx+s*2.5:y==='gec'?hx:hx+s*ara,z=y==='kos'?hz-yan*2.5:y==='gec'?hz+yan*2.5:hz;yerlestir(p,x,z,Math.atan2(oz-z,ox-x),pr);};
        if(top==='C'){yer(X,HV_PROFIL[pX],'dur',1,0.6);yer(Z,HV_PROFIL[pZ],'dur',-1,0.6);yerlestir(Y,hx,hz+yan*0.6,Math.atan2(oz-hz,ox-hx),HV_PROFIL[pY]);}
        else{yer(X,HV_PROFIL[pX],yX,1,0.4);yer(Y,HV_PROFIL[pY],yY,-1,0.4);}}
      m.phase='play';m.phaseT=1;m.durus=null;
      const c=m.havadanCoz(ox,0.11,oz,hx,hy,hz,T,0,-0.04),h0=m.ist.havaTopu;let zX=false,zY=false;
      Object.assign(b,{x:ox,z:oz,y:0.11,vx:c.vx,vy:c.vy,vz:c.vz,egri:0,ust:-0.04,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:Y.team,sonDokunan:null});
      m.topDegisti();
      for(let k=0;k<60*2.5&&!ilk&&!faul;k++){m.step(dt);if(m.phase!=='play')break;if(X.zipla)zX=true;if(Y.zipla)zY=true;
        if(!ilk&&b.tasiyan&&b.tasiyan.rol==='GK'){ilk=b.tasiyan;tur='el';}}
      h.n++;if(m.ist.havaTopu>h0)h.duello++;if(zX)h.sX++;if(zY)h.sY++;
      if(faul)h.faul++;
      else if(tur==='kafa'){if(ilk===X)h.X++;else if(ilk===Y)h.Y++;else if(ilk===Z)h.Z++;h.fark.push(fark);}
      else if(tur==='gogus')h.gogus++;else if(tur==='ayak')h.ayak++;else if(tur==='el')h.el++;else h.yok++;}
    R.push(h);}
  const y=(a,c)=>c?(100*a/c).toFixed(0).padStart(4)+'%':'   —';
  const med=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b);return S[Math.floor(S.length/2)];};
  console.log(`\nT6 · hava topu düellosu · durum başına ${n} deneme · ${((Date.now()-t0)/1000).toFixed(1)} sn · kapı ${KAPI?'açık':'kapalı (bilgi)'}\n`);
  console.log('  Durum (X × Y)                                   n  X kafa  Y kafa  Z kafa  düello  hava f.  göğüs  ayak   el  kafa yok  X payı  top−alın  X sıçr.  Y sıçr.');
  for(const h of R){const fk=med(h.fark);
    console.log('  '+h.ad.padEnd(44)+String(h.n).padStart(5)+y(h.X,h.n).padStart(8)+y(h.Y,h.n).padStart(8)+(h.top==='C'?y(h.Z,h.n):'      —').padStart(8)+y(h.duello,h.n).padStart(8)+y(h.faul,h.n).padStart(9)
      +y(h.gogus,h.n).padStart(7)+y(h.ayak,h.n).padStart(6)+y(h.el,h.n).padStart(5)+y(h.yok+h.gogus+h.ayak,h.n).padStart(10)+y(h.X,h.X+h.Y).padStart(8)
      +(Number.isNaN(fk)?'—':(fk>=0?'+':'')+fk.toFixed(2)).padStart(10)+y(h.sX,h.n).padStart(9)+y(h.sY,h.n).padStart(9));}
  const pay=h=>100*h.X/Math.max(1,h.X+h.Y),k1=pay(R[1]),k2=pay(R[3]),k0=pay(R[0]);
  let yokT=0,nT=0;for(const h of R.slice(0,6)){yokT+=h.yok+h.gogus+h.ayak;nT+=h.n;}const yokP=100*yokT/Math.max(1,nT);
  const G=[[k1>=60&&k1<=75,`güçlü kafacı (duruyor) %60–75 kazanır → %${k1.toFixed(0)}`],[k2>50,`eşit profilde koşarak sıçrayan > %50 → %${k2.toFixed(0)}`],
    [k0>=40&&k0<=60,`eşit ve ikisi duruyor %40–60 → %${k0.toFixed(0)}`],[yokP<=10,`top A durumlarında kafa yok ≤ %10 → %${yokP.toFixed(0)}`]];
  let ok=true;for(const [g,ad] of G){if(!g)ok=false;console.log((g?'  ':'! ')+'Kapı (T6): '+ad);}
  return KAPI&&!ok?1:0;
}};
