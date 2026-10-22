/* ============ C2 (2026-10-22): aynı sahne, iki profil ve iki seviye — FUTBOL_KUTUPHANESI §12.1 C, karar 22 ============
   Oyuncu farkının sonucu: aynı kurulumda oyuncunun profili (A, B) ve seviyesi (+δ, −δ; δ 0,12, kalecilik dışındaki 10 özellik birlikte —
   aynı adlı oyuncunun araç içi dönüşümü, yeni ad ya da kulüp yok; senaryo-ortak profilDegis). Rakipler kadronun kendi değerleriyle. Karar katmanı açık.
   S1 bire bir kanat: ev sahibinin sağ kanadı (5) rakip yarıda (orta çizgiden 18 m, c-1v1 [3] düzeni) topla, 3 m/sn; konuğun stoperi (3) 6 m önünde;
     öbürleri sahada değil (kaleciler kalır). 6 sn. Sınıf: geçti (motorun 'calim' olayı 'gecti' ya da top kanattayken u_kanat > u_bek + 3), kayıp
     (top rakipte ya da dışarıda), süre. Başarı: geçti.
   S2 uzun paslı 6: iki takım dizilişte, top ev sahibinin yarısında; ev sahibinin 6'sı (6) kaleye 64 m'de topla, yüzü ileri. 8 sn. Sınıf: uzun ileri pas
     ya da yön değiştirme tamamlandı (L ≥ 25 ve ≥ 12 m ileri ya da |Δz| ≥ 25; alıcı arkadaş), kısa pas, tuttu (süre bitti, top 6'da), kayıp.
     Başarı: uzun tamamlandı.
   Profiller: S1 hızlı kanat ↔ oyun kurucu kanat (p-tip ile aynı değerler), S2 uzun paslı 6 ↔ kesici. Kollar profil × seviye, eşli tohum (tohum·1000 + i).
   Ölçü: başarı % (kol başına), güçlü − zayıf (A profili; eşli farkın %95 aralığı), profil sonuç TVD (iki seviyenin havuzu).
   Kabul (C turu kapanışında açılır, KAPI): S1 ve S2'de güçlü − zayıf ≥ 10 puan ve aralığın alt ucu > 0; zayıf ≥ %10, güçlü ≤ %90 (futbolun belirsizliği);
   profil sonuç TVD ≥ 0,15. Kullanım: node araclar/mac-deneme.js --senaryo p-seviye [N=60 kol başına] [tohum] */
'use strict';
const KAPI=false,DELTA=0.12;
const SAHNE=[
  {ad:'S1 bire bir kanat',sure:6,profiller:[['hızlı kanat',{hiz:0.92,surus:0.85,pas:0.5,sut:0.55,gorus:0.45,karar:0.45}],['oyun kurucu kanat',{hiz:0.55,surus:0.6,pas:0.88,sut:0.55,gorus:0.9,karar:0.85}]],
    siniflar:['gecti','kayip','sure'],basari:'gecti'},
  {ad:'S2 uzun paslı 6',sure:8,profiller:[['uzun paslı 6',{pas:0.84,gorus:0.82,karar:0.72,mudahale:0.55,sertlik:0.6,surus:0.6}],['kesici',{mudahale:0.82,sertlik:0.8,pas:0.6,gorus:0.55,karar:0.6,surus:0.55}]],
    siniflar:['uzun','kisa','tuttu','kayip'],basari:'uzun'}
];
module.exports={calistir({ctx,vm,N,tohum}){
  const O=require('../senaryo-ortak')(ctx,vm),n=N||60,dt=1/60,t0=Date.now();
  const PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx);
  /* S1 */
  const s1=(i,pr,dl)=>{let m=null,ol=null;
    m=O.kur((tohum||1)*1000+i,(ad,v)=>{if(ad==='calim'&&v&&m&&v.p===m.teams[0][5]&&!ol)ol=v.sonuc;});
    const A=m.teams[0][5],D=m.teams[1][3],b=m.ball,d=m.dir[0],hy=d>0?0:Math.PI;
    O.bosalt(m,[A,D]);O.profilDegis(m,A,pr,dl);
    const ax=d*18,az=MZ+(i%5-2)*3;O.yerlestir(A,ax,az,hy,3);O.yerlestir(D,ax+d*6,az,hy+Math.PI,0);   /* c-1v1 [3] düzeni: savunmacı 6 m önde */
    O.oyunda(m);m._sonSahipTakim=0;m._sahiplikBas=m.t;O.topVer(m,A,hy,3);
    for(let k=0;k<60*6;k++){m.step(dt);if(m.phase!=='play')return 'kayip';
      if(ol==='gecti')return 'gecti';if(ol&&ol!=='gecti'&&ol!=='yarim')return 'kayip';
      if(b.sahip&&b.sahip.team===1||b.sonTakim===1)return 'kayip';
      if(b.sahip===A&&(A.x-D.x)*d>3)return 'gecti';}
    return 'sure';};
  /* S2 */
  const s2=(i,pr,dl)=>{let m=null,pas=null,son=null;
    m=O.kur((tohum||1)*1000+i,(ad,v)=>{if(!m||son||m.phase!=='play')return;const P=m.teams[0][6];
      if((ad==='pass'||ad==='cross')&&v&&v.p===P&&!pas){const bp=m.ball.pas,d=m.dir[0];if(bp){const ileri=(bp.hx-bp.x0)*d,dz=Math.abs(bp.hz-bp.z0);
        pas={uzun:bp.L>=25&&ileri>=12||dz>=25,t:m.t};}}});
    const P=m.teams[0][6],b=m.ball,d=m.dir[0],hy=d>0?0:Math.PI;
    const u0=PL-64;O.dizilis(m,0,u0,MZ-6,true);O.dizilis(m,1,-u0,MZ-6,false);   /* top ev sahibinin yarısında (u −11,5); konuk kendi çerçevesinde +11,5'te savunur */
    O.profilDegis(m,P,pr,dl);O.yerlestir(P,d*u0,MZ-6,hy,0);
    O.oyunda(m);m._sonSahipTakim=0;m._sahiplikBas=m.t;O.topVer(m,P,hy,0);
    for(let k=0;k<60*8;k++){m.step(dt);if(m.phase!=='play')return pas?(pas.uzun?'kayip':'kisa'):'kayip';
      if(pas){if(b.sahip&&b.sahip.team===0&&b.sahip!==P)return pas.uzun?'uzun':'kisa';if(b.sahip&&b.sahip.team===1||b.tasiyan&&b.tasiyan.team===1)return pas.uzun?'kayip':'kisa';
        if(m.t-pas.t>4)return pas.uzun?'kayip':'kisa';}
      else if(b.sahip&&b.sahip.team===1||b.tasiyan&&b.tasiyan.team===1)return 'kayip';}
    return pas?(pas.uzun?'kayip':'kisa'):b.sahip===P?'tuttu':'kayip';};
  const FN=[s1,s2],pc=x=>(100*x).toFixed(1).padStart(6)+'%';let cikis=0;
  console.log(`\nC2 · p-seviye · aynı sahne, iki profil × iki seviye (±${String(DELTA).replace('.',',')}) · kol başına ${n} deneme${KAPI?'':' · kapılar C kapanışında açılır (KAPI)'}`);
  SAHNE.forEach((sh,si)=>{
    const K={};for(const [pa,pr] of sh.profiller)for(const dl of [DELTA,-DELTA]){const L=[];for(let i=0;i<n;i++)L.push(FN[si](i,pr,dl));K[pa+(dl>0?' +':' −')]=L;}
    const pay=(L,c)=>L.filter(x=>x===c).length/L.length;
    console.log(`\n  ${sh.ad} (${sh.sure} sn)`);
    console.log('  kol'.padEnd(26)+sh.siniflar.map(c=>c.padStart(9)).join(''));
    for(const k in K)console.log('  '+k.padEnd(24)+sh.siniflar.map(c=>pc(pay(K[k],c)).padStart(9)).join(''));
    const [A,B]=sh.profiller.map(x=>x[0]),G=K[A+' +'],Z=K[A+' −'],bs=sh.basari;
    const fark=G.map((x,i)=>(x===bs?1:0)-(Z[i]===bs?1:0)),f=fark.reduce((a,c)=>a+c,0)/n,sd=Math.sqrt(fark.reduce((a,c)=>a+(c-f)*(c-f),0)/Math.max(1,n-1)),alt=f-1.96*sd/Math.sqrt(n);
    const havuz=pa=>K[pa+' +'].concat(K[pa+' −']),tvd=sh.siniflar.reduce((s,c)=>s+Math.abs(pay(havuz(A),c)-pay(havuz(B),c))/2,0);
    const gB=pay(G,bs),zB=pay(Z,bs),k1=f>=0.10&&alt>0,k2=zB>=0.10&&gB<=0.90,k3=tvd>=0.15;
    console.log(`  ${KAPI&&!(k1&&k2&&k3)?'!':' '} ${A}: güçlü − zayıf ${(100*f).toFixed(1)} puan [%95 alt uç ${(100*alt).toFixed(1)}] ${k1?'≥ 10, tuttu':'TUTMADI'} · zayıf ${pc(zB)} güçlü ${pc(gB)} ${k2?'(belirsizlik var)':'(UÇTA)'} · profil sonuç TVD ${tvd.toFixed(3)} ${k3?'≥ 0,15':'< 0,15'}`);
    if(KAPI&&!(k1&&k2&&k3))cikis=1;});
  console.log(`  (${((Date.now()-t0)/1000).toFixed(1)} sn)`);
  return cikis;
}};
