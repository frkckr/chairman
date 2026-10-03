/* ============ Gerçekçilik planı T0 senaryosu: yarı yarıya top ============
   Boş sahada duran (ya da yavaş yuvarlanan) serbest topa iki rakip (ev sahibi orta saha, konuk orta saha) farklı uzaklıklardan koşar; ikisi de
   takım AI'ının kovalayanıdır. Varış farkı Δ = tahmini varış(ev) − varış(konuk) (varisZamani, başlangıçta). Sonuç: topa ilk kim dokundu, faul
   (yarı yarıyada itme/basma), aynı ana yakın varış (iki oyuncu da topa 0,8 m içindeyken ilk dokunuş). Bugün yakın varışta çekiliş
   (ikiliMucadele, mac-mudahale.js) çözer; T5'te iki ayağın varış zamanı farkıyla çözülecek. Kabul (T5, bilgi): Δ ile düzgün değişen kazanma eğrisi,
   Δ≈0'da ~%50. Kullanım: node araclar/mac-deneme.js --senaryo c-yariyariya [N=40 hücre başına] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||40,dt=1/60,t0=Date.now(),VZ=vm.runInContext('varisZamani',ctx);
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:0,vz:0,spd:0,yon,eylem:null,kickCd:0,surus:null,kosu:null,oyunda:true,denge:1});};
  const FARK=[-3,-1.5,-0.7,-0.3,0,0.3,0.7,1.5,3],TOP=[[0,'duran top'],[2,'yavaş yuvarlanan (2 m/sn)']],K={};let deneme=0;
  const S=['<−0,3','−0,3…−0,1','−0,1…−0,03','−0,03…0,03','0,03…0,1','0,1…0,3','>0,3'],SS=[-0.3,-0.1,-0.03,0.03,0.1,0.3],kova=dl=>S[SS.filter(s=>dl>=s).length];
  for(const [vt] of TOP)for(const f of FARK)for(let i=0;i<n;i++){deneme++;let faul=false,ilk=null,yakin=false;
    const m=kur((tohum||1)*1000+deneme,(ad,v)=>{if(ad==='faul'||ad==='avantaj')faul=true;}),A=m.teams[0][6],B=m.teams[1][6],b=m.ball;
    bosalt(m,[A,B]);
    /* top orta sahada; A ve B topa karşı yanlardan, aralarında ~100–160° */
    const bx=(i%3-1)*6,bz=34,aA=Math.PI/2+(i%4-1.5)*0.2,aB=-Math.PI/2+(i%5-2)*0.25,dA=9+Math.max(0,-f),dB=9+Math.max(0,f);
    yerlestir(A,bx+Math.cos(aA)*dA,bz+Math.sin(aA)*dA,aA+Math.PI);yerlestir(B,bx+Math.cos(aB)*dB,bz+Math.sin(aB)*dB,aB+Math.PI);
    m.phase='play';m.phaseT=1;m.durus=null;
    Object.assign(b,{x:bx,z:bz,y:0,vx:vt,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:i%2,sonDokunan:null});
    m.topDegisti();
    const dl=VZ(A,bx+vt*0.8,bz,0.6,0.2)-VZ(B,bx+vt*0.8,bz,0.6,0.2);
    for(let k=0;k<60*5&&!ilk&&!faul;k++){m.step(dt);
      if(b.sonDokunan===A||b.sonDokunan===B){ilk=b.sonDokunan;yakin=Math.hypot(A.x-b.x,A.z-b.z)<0.8&&Math.hypot(B.x-b.x,B.z-b.z)<0.8;}
      if(m.phase!=='play')break;}
    const c=K[kova(dl)]||(K[kova(dl)]={n:0,A:0,faul:0,yakin:0,yok:0,dl:0});c.n++;c.dl+=dl;
    if(faul)c.faul++;else if(ilk===A)c.A++;else if(!ilk)c.yok++;if(yakin)c.yakin++;}
  const y=(a,c)=>c?(100*a/c).toFixed(0).padStart(4)+'%':'   —';
  console.log(`\nT0 · yarı yarıya top · ${deneme} deneme (duran ve yavaş top, Δ = varış(ev) − varış(konuk)) · ${((Date.now()-t0)/1000).toFixed(1)} sn\n`);
  console.log('  Δ (sn)           n   Δ ort.   ev ilk   konuk ilk   faul   iki oyuncu 0,8 m içinde   dokunan yok');
  let ok=true,onceki=101;
  for(const k of S){const c=K[k];if(!c)continue;const pA=100*c.A/Math.max(1,c.n-c.faul-c.yok);if(pA>onceki+5)ok=false;onceki=Math.min(onceki,pA);
    console.log('  '+k.padEnd(14)+String(c.n).padStart(5)+(c.dl/c.n).toFixed(2).padStart(9)+y(c.A,c.n).padStart(9)+y(c.n-c.A-c.faul-c.yok,c.n).padStart(12)+y(c.faul,c.n).padStart(7)+y(c.yakin,c.n).padStart(26)+y(c.yok,c.n).padStart(14));}
  const o=K['−0,03…0,03'],orta=o?100*o.A/Math.max(1,o.n-o.faul-o.yok):NaN;
  ok=ok&&orta>=35&&orta<=65;
  console.log((ok?'  ':'! ')+`Kabul (T5, bilgi): ev ilk dokunuş payı Δ arttıkça azalır (5 puan tolerans), Δ≈0'da %35–65 → Δ≈0 %${orta.toFixed(0)}, ${ok?'tutarlı':'TUTARSIZ'}`);
  return 0;
}};
