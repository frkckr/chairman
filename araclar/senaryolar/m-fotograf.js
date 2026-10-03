/* ============ Chairman — maç günü senaryosu: takım fotoğrafı ve fotoğrafçılar (2026-10-03, kullanıcı kararı) ============
   Maç öncesini atlamadan oynatır (ısınma, giriş, marş, tokalaşma, fotoğraf, yazı tura) ve fotoğrafçıları izler. Kabul:
   takım başına bir fotoğrafçı; her biri tek flaş, kendi takımının poz penceresinde ve takımın hepsi pozdayken; çekimden sonra yüzü takımda
   en az 0,8 m geri çekilir; sahada yalnız çekim için (poz anından en çok 5,2 sn önce girer, çekimden en geç 16 sn sonra çıkar), ısınma
   ve marş boyunca sahaya hiç girmez; maçta kale arkasındaki yerinde çömelir. Kulübe ve tünel yerleri tarayıcıdaki statla aynıdır.
   Kullanım: node araclar/mac-deneme.js --senaryo m-fotograf [maç, varsayılan 12] */
'use strict';
const KOD=`(function(tohum){
  const kulubeler=[0,1].map(t=>{const cx=t?7:-7;return{takim:t,koltuklar:[0,1,2,3,4,5].map(i=>({x:cx-2.6+i*1.04,z:-5.75})),alan:{x:cx,z:-2.4}};});
  const flas=[];let m=null,sn=0;
  m=new Match((ad,v)=>{if(ad!=='flas'||!m)return;const t=v.takim;
    flas.push({t:sn,takim:t,x:v.x,z:v.z,hazir:m.dizi[t].every(q=>q.poz==='foto'||q.poz==='comel'),faz:m.phase});},
    {kadro:MAC_KADRO,tohum,tunel:{x:-19,z:-5},kulubeler});
  const F=m.kenar.filter(p=>p.kind==='foto'),S=MAC_SENARYOSU,A=S.selamAdim,bas=[(10+4)*A+(2+11+1)*A,(10+13.5)*A+9];
  const iz=F.map(()=>[]);let selam=null,santra=null;
  const sahada=p=>Math.abs(p.x)<PL-0.3&&p.z>0.3&&p.z<PW-0.3;
  for(let i=0;i<60*560;i++){m.step(1/60);sn=(i+1)/60;
    if(m.phase==='selam'&&selam==null)selam=sn-m.phaseT;
    if((m.phase==='kickoff'||m.phase==='play')&&santra==null)santra=sn;
    F.forEach((p,k)=>iz[k].push({t:sn,x:p.x,z:p.z,yon:p.yon,poz:p.poz,faz:m.phase,saha:sahada(p)}));
    if(santra!=null&&sn-santra>75)break;}
  const sonuc=F.map((p,k)=>{const f=flas.filter(o=>o.takim===k),r={flas:f.length,hazir:f.length===1&&f[0].hazir,pencere:false,geri:0,sahaIhlal:0,evde:false};
    if(selam==null)return r;const b=selam+bas[k];
    if(f.length===1){const c=f[0].t;r.pencere=c>=b+1&&c<=b+S.foto&&f[0].faz==='selam';
      /* geri çekilme: çekimden 0,8–2,6 sn sonra, yüzü takımda (+z) z'nin azalması */
      const a=iz[k].filter(o=>o.t>=c+0.8&&o.t<=c+2.7);if(a.length){const z0=a[0].z;r.geri=Math.max(0,...a.filter(o=>Math.sin(o.yon)>0.7).map(o=>z0-o.z));}
      r.sahaIhlal=iz[k].filter(o=>o.saha&&(o.t<b-5.2||o.t>c+16)).length;}
    else r.sahaIhlal=iz[k].filter(o=>o.saha).length;
    const son=iz[k][iz[k].length-1];r.evde=Math.hypot(son.x-p.ev.x,son.z-p.ev.z)<1&&son.poz==='comel';
    return r;});
  return{sayi:F.length,sonuc,selam:selam!=null,santra:santra!=null};})`;
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||12,f=vm.runInContext(KOD,ctx),t0=Date.now();let hata=0;const T={sayi:0,flas:0,hazir:0,pencere:0,geri:0,saha:0,evde:0,geriTop:0,geriEnAz:9};
  for(let i=0;i<n;i++){const x=f((tohum||1)+i);
    if(x.sayi===2&&x.selam&&x.santra)T.sayi++;
    for(const r of x.sonuc){T.flas+=r.flas===1;T.hazir+=r.hazir;T.pencere+=r.pencere;T.geri+=r.geri>=0.8;T.saha+=r.sahaIhlal===0;T.evde+=r.evde;
      T.geriTop+=r.geri;T.geriEnAz=Math.min(T.geriEnAz,r.geri);}}
  const k=2*n,satir=(ad,v,top,ek)=>{const ok=v===top;if(!ok)hata++;console.log((ok?'  ':'! ')+ad.padEnd(52)+String(v).padStart(4)+' / '+top+(ek?'   '+ek:''));};
  console.log(`\nM · takım fotoğrafı ve fotoğrafçılar · ${n} maç öncesi (tohum ${tohum||1}…) · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  satir('İki fotoğrafçı, maç öncesi ve santra tamam',T.sayi,n);
  satir('Fotoğrafçı başına tek flaş',T.flas,k);
  satir('Flaş kendi takımının poz penceresinde',T.pencere,k);
  satir('Flaş anında takımın hepsi pozda',T.hazir,k);
  satir('Çekimden sonra yüzü takımda ≥0,8 m geri çekildi',T.geri,k,`ortalama ${(T.geriTop/k).toFixed(2)} m, en az ${T.geriEnAz.toFixed(2)} m`);
  satir('Sahada yalnız çekim için (ısınma ve marşta hiç)',T.saha,k);
  satir('Maçta kale arkasındaki yerinde çömeliyor',T.evde,k);
  return hata?1:0;
}};
