/* ============ Chairman — topla karar (mantık, çizimsiz) ============
   Topu tutan (ya da topu gelmekte olan) oyuncu önündeki seçenekleri görür, her birinin başarı olasılığını ve değerini tartar, birini seçer.
   - xG: şutun gol olma olasılığı. Kaleyi görme açısı θ = atan(7,32·x / (x²+y²−3,66²)) ve mesafeden lojistik model.
     Katsayılar hedef noktalara oturtuldu (penaltı noktası ~0,15, altıpas ~0,46, ceza sahası çizgisi ~0,07, 25 m ~0,03).
   - xT: bölge tehdidi (Singh). Topu bir yere taşımanın değeri = hedefin tehdidi − buranın tehdidi.
   - Pas başarısı: topun yol boyunca her noktaya varış zamanı ile her rakibin oraya varış zamanı karşılaştırılır
     (Spearman'ın "pitch control" fikrinin sade biçimi). Alıcı topa zamanında yetişemezse olasılık düşer.
   - Seçim: fayda = başarı × değer − başarısızlık × kayıp. Seçenekler "sıcaklıklı" rastgele seçilir: karar özelliği
     yüksek oyuncu en iyiyi daha tutarlı seçer (Football Manager yaklaşımı).
   MM3 (2026-10-03, B akışı; bireysel karar zekâsı):
   - Algı: oyuncu bakışının ±100°'sini canlı görür; 8 m içindeki rakip görüş hattındaki arkadaşını gizleyebilir. Koninin dışını son
     taramasından (mac-topla.js taramaAdim; en çok 1,5 sn eski, ölü hesapla) bilir. Görmediği arkadaşa pas düşünmez.
   - Pas adayları: ayağa (zamanlanmış buluşma), önündeki boşluğa (3/6 m), ara pası (koşu çizgisinde alıcının her savunmacıdan 0,25 sn önce
     vardığı ilk nokta), oyunun yönünü değiştirme, kısa bırakma. Ucuz ön puanla en iyi ~10 aday tam analize girer.
   - Ortak pas planı (pasPlani): karar, hedef tazeleme ve vuruş aynı hızı ve uçuşu kullanır. Tür seçilir: hattın ilk %60'ı kapalı ve iniş
     yeri boşsa havadan (kısa mesafede aşırtma), değilse yerden (uzun yerden sert pas dahil). Varış hızı birkaç aday arasından
     P(kesilmez)×P(kontrol) en iyi olandır; kontrol olasılığı kontrolEt ile aynı modeldir (kontrolOlasiligi).
   - Şut (sutPlani): ~8 hedef × tür (plase, sert, falso, kaleci öndeyse aşırtma); P(gol) = P(çerçeve) × (1 − kaleciTahmin) × (1 − blok).
   - Orta: hücumcuların varış noktalarına ve kaleciyle savunma arasına; alçak sert, kesme, arka direğe asma, geri çevirme.
     Değer = xG(kafa/vole) × P(ulaşır) × (1 − kaleciHavaTahmin). Korner aynı hedef mantığını kullanır.
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
/* (varisZamani yön cezasında kayan nokta yüzünden nadiren NaN verebilir: o durumda düz koşu süresi) */
function varisSuresi(o,x,z,menzil){const t=varisZamani(o,x,z,menzil,0.22);return t===t?t:0.22+Math.max(0,hyp(x-o.x,z-o.z)-(menzil||0))/(o.maxSpd*0.95);}
/* ---- ortak pas planı (MM3): karar, hedef tazeleme ve vuruş aynı hızı ve uçuşu kullanır ----
   yerden: istenen varış hızından ilk hız ve süre. Havadan: uçuş süresi yaya göre (düz havadan pas, aşırtma, orta kesme/asma, korner) */
function havaSure(L,yay){return yay==='asirtma'?0.95+L/22:yay==='asma'?1.05+L/30:yay==='kesme'?0.72+L/40:yay==='korner'?1.15+L/30:0.75+L/28;}
function pasPlani(m,L,tip,varis,yay){
  if(tip==='yer'){const v0=Math.min(29,yerIlkHiz(L,varis||pasVarisHizi(L),m.R));return{tip,L,v0,T:yerSure(v0,L,m.R)};}
  return{tip,L,v0:0,T:havaSure(L,yay)};}
/* yerden pasın varış hızı adayları (yumuşak … sert): ara pası daha sert, kısa bırakma yumuşak, alçak orta çok sert */
function varisAdaylari(L,alt){const v=pasVarisHizi(L);
  return alt==='ara'?[v,v+2,v+4]:alt==='birak'?[Math.max(4.5,v-3),v-1.2,v+1]:alt==='orta'?[v+3,v+6]:[Math.max(4.5,v-2.5),v,v+2.5];}
/* ilk dokunuşun iyi olma olasılığı (saf; kontrolEt ve pas planı aynı modeli kullanır). v: topun hızı (m/sn), y: yüksekliği (m), baski 0–1,
   aci: gelen topun yönüyle dokunuş yönü arası (rad; topu geldiği yöne çevirmek en zoru, yoluna devam ettirmek en kolayı) */
function kontrolOlasiligi(q,v,y,baski,aci){
  const teknik=q.oz.surus*0.55+q.oz.pas*0.45;
  const z=clamp((v-6)/14,0,1.4)*0.5+(y>0.2?0.1+clamp((y-0.2)/0.6,0,1)*0.14:0)+baski*0.16+(1-Math.cos(aci||0))*0.05*clamp(v/8,0.3,1.5);
  return clamp(1-z*(1.15-teknik)*MOTOR_AYAR.kontrolZorluk,0.3,0.995);}
/* standart normal dağılım işlevi Φ(x) (Abramowitz–Stegun) */
function normalDagilim(x){const t=1/(1+0.2316419*Math.abs(x)),y=t*(0.31938153+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));
  const p=1-0.3989422804*Math.exp(-x*x/2)*y;return x>=0?p:1-p;}

/* ---- algı (MM3) ---- */
/* p, q'yu nerede biliyor: bakışının ±100°'sinde ve görüş hattı kapalı değilse canlı (q'nun kendisi); değilse son taramasından
   (en çok 1,5 sn eski) ölü hesapla bir vekil; hiç bilmiyorsa null. Görüş hattı: 8 m içindeki rakip arkasındakini gizler */
function algilanan(m,p,q){
  const dx=q.x-p.x,dz=q.z-p.z,r=hyp(dx,dz),a=Math.atan2(dz,dx),by=p.bakisYon!=null?p.bakisYon:p.yon;
  if(Math.abs(aciFark(a,by))<1.75){let kapali=false;
    for(const o of m.teams[1-p.team]){if(!o.oyunda)continue;const ox=o.x-p.x,oz=o.z-p.z,ro=hyp(ox,oz);
      if(ro>8||ro<0.4||ro>r-1.5)continue;if(Math.abs(aciFark(Math.atan2(oz,ox),a))<Math.atan2(0.42,ro)){kapali=true;break;}}
    if(!kapali)return q;}
  const bv=m._bv&&m._bv.get(p),T=bv&&bv.tara;if(!T||!T.ok)return null;const yas=m.t-T.t;if(yas>1.5)return null;
  const i=m.players.indexOf(q);if(i<0)return null;
  return{x:T.x[i]+T.vx[i]*yas,z:T.z[i]+T.vz[i]*yas,vx:T.vx[i],vz:T.vz[i],yon:q.yon,maxSpd:q.maxSpd,oz:q.oz,rol:q.rol,n:q.n,team:q.team,mevki:q.mevki,vekil:true};}
/* T7c (Ek H 26, 2026-10-10): karar anının rakip bilgisi. Gözlemci (GOZ.p: kararını veren topu tutan ya da tek vuruşu tartan alıcı) bakışının
   ±100°'sindeki rakibi canlı görür; dışındakini son taramasından bilir (yer + hız × yaş, en çok 1,5 sn ilerletilir; hafıza eskise de son görülen
   yer kalır, rakip “yok” sayılmaz). Vekil (rakipVekil) hareket hesabına yeten alanları taşır, kaynak gerçek oyuncudur. Gözlemci başına karede bir
   kez kurulur. Karar dışında (vuruşun yürütülmesi, takım düzeni, kaleci) ve rakipAlgi 0 iken gerçek liste */
const GOZ={p:null},RA={m:null,p:null,kare:-1,L:null};
/* vekil: tek gizli sınıf (Object.create zinciri her oyuncu için ayrı biçim açıp varisZamani gibi sıcak işlevleri çok biçimli yapıyordu: 1000 adım
   54 → 126 ms) */
function rakipVekil(o,x,z,vx,vz){const k=o.kaynak||o;return{x,z,vx,vz,yon:o.yon,bakisYon:o.bakisYon,maxSpd:o.maxSpd,enerji:o.enerji,yorgunluk:o.yorgunluk,
  _hk:k._hk||hrkSabit(k),_kutle:k._kutle||kutle(k),oz:o.oz,profil:o.profil,rol:o.rol,team:o.team,n:o.n,mevki:o.mevki,oyunda:o.oyunda,eylem:o.eylem,boy:o.boy,kayit:o.kayit,kaynak:k};}
function rakipAlgisi(m,p){
  if(RA.m===m&&RA.p===p&&RA.kare===m.kare)return RA.L;
  const by=p.bakisYon!=null?p.bakisYon:p.yon,bv=m._bv&&m._bv.get(p),T=bv&&bv.tara,L=[];
  for(const o of m.teams[1-p.team]){
    if(!o.oyunda||!T||!T.ok||Math.abs(aciFark(Math.atan2(o.z-p.z,o.x-p.x),by))<1.75){L.push(o);continue;}
    const i=m.players.indexOf(o);if(i<0){L.push(o);continue;}
    const yas=Math.min(1.5,Math.max(0,m.t-T.t));L.push(rakipVekil(o,T.x[i]+T.vx[i]*yas,T.z[i]+T.vz[i]*yas,T.vx[i],T.vz[i]));}
  RA.m=m;RA.p=p;RA.kare=m.kare;RA.L=L;return L;}
/* team takımının karar anında hesaba kattığı rakipler (gözlemci o takımdansa algısı) */
function rakipler(m,team){const g=GOZ.p;return g&&g.team===team&&MOTOR_AYAR.rakipAlgi?rakipAlgisi(m,g):m.teams[1-team];}
/* f'yi p gözlemciyken çalıştırır (iç içe güvenli) */
function gozlemle(p,f){const e=GOZ.p;GOZ.p=p;try{return f();}finally{GOZ.p=e;}}
/* T7c (§7.10, 2026-10-10): pas kesilme modelinde rakibin saati. Vuruşa t0 sn varken rakip pasın yönünü ancak vuruşta öğrenir; hazırlığı okuyan
   (sezgi; yüzü pasöre dönük) bir kısmını önceden okur: tepkiye başlama t0·(1 − okuma), o ana kadar şimdiki hızıyla (en çok 0,6 sn) süzülür,
   sonra varisSuresi gibi (0,22 sn tepki). t0 = 0'da varisSuresi'nin aynısı. pasT0 0 iken okuma kapalı (eski model) */
function pasOkuma(op,p){const A=MOTOR_AYAR;if(!A.pasOku)return 0;const by=op.bakisYon!=null?op.bakisYon:op.yon,bak=Math.abs(aciFark(Math.atan2(p.z-op.z,p.x-op.x),by))<1.2;
  return A.pasOku*(0.5+0.5*profilAlt(op,'sezgi',0.5))*(bak?1:0.4);}
/* rakibin vuruş anındaki yeri (şimdiki hızıyla, en çok 0,6 sn): vekil; ts 0 iken kendisi */
function rakipSuzul(op,ts){if(ts<=0)return op;const k=Math.min(ts,0.6);return rakipVekil(op,op.x+op.vx*k,op.z+op.vz*k,op.vx,op.vz);}

/* ---- pas analizi ---- */
const PA_N=8,PA_X=new Float64Array(PA_N),PA_Z=new Float64Array(PA_N),PA_TB=new Float64Array(PA_N*3),PA_TA=new Float64Array(PA_N),PA_H=new Float64Array(PA_N),PA_TO=new Float64Array(PA_N),PA_KC=new Uint8Array(PA_N);
/* başarı olasılığı, kontrol olasılığı, seçilen varış hızı ve süre. tip: 'yer' | 'hava'. alici gerçek oyuncu ya da algı vekili olabilir.
   o: {ox,oz: topun çıkacağı yer (yoksa top), t0: vuruşa kalan süre, alt, yay, T, hy, varislar, ilk (gelişine), vole, baski (pasörün)} */
function pasAnaliz(m,p,hx,hz,tip,alici,o){
  o=o||{};
  const b=m.ball,ox=o.ox!=null?o.ox:b.x,oz=o.oz!=null?o.oz:b.z,t0=o.t0||0,R=m.R,N=PA_N;
  const L=hyp(hx-ox,hz-oz)||0.1,ux=(hx-ox)/L,uz=(hz-oz)/L,rakip=rakipler(m,p.team);
  const V=tip==='yer'?(o.varislar||varisAdaylari(L,o.alt)):[0],K=V.length,v0=[0,0,0];
  for(let i=0;i<N;i++){const f=(i+1)/N;PA_X[i]=ox+(hx-ox)*f;PA_Z[i]=oz+(hz-oz)*f;}
  let T=0;
  if(tip==='yer'){for(let k=0;k<K;k++){v0[k]=Math.min(29,yerIlkHiz(L,V[k],R));for(let i=0;i<N;i++)PA_TB[k*N+i]=t0+yerSure(v0[k],L*(i+1)/N,R);}}
  else{T=o.T||havaSure(L,o.yay);const hy=o.hy||0;for(let i=0;i<N;i++){const f=(i+1)/N,t=T*f;PA_TB[i]=t0+t;PA_H[i]=hy*f+G/2*t*(T-t);}}
  /* alıcı topu karşılar: yolda topa ondan önce yetişebildiği ilk nokta (havadan pasta yalnız iniş yeri) */
  /* T7c (§7.10): alıcı da topa vuruşla yönelir; pasörü rakipten iyi okur (pasOkuAlici), o ana kadar koşusunu sürdürür */
  if(alici){const ek=MOTOR_AYAR.aliciPay,tr=MOTOR_AYAR.pasT0&&t0>0?t0*(1-MOTOR_AYAR.pasOkuAlici):0,av=rakipSuzul(alici,tr);
    for(let i=0;i<N;i++)PA_TA[i]=tr+varisSuresi(av,PA_X[i],PA_Z[i],0.6)+ek;}
  const ir=[N-1,N-1,N-1],tr=[0,0,0],sure=[0,0,0];let sureMax=0;
  /* boşluğa ve ara pasında alıcı noktaya toptan biraz önce varmalı (koşu içinde yolu kesmek dar bir pencere) */
  const pay=o.alt==='bosluk'||o.alt==='ara'?-0.05:0.05;
  for(let k=0;k<K;k++){let r=N-1,t=alici?PA_TA[N-1]:PA_TB[k*N+N-1];
    /* havadan pasta alıcı topu iniş yerinde alır (iniş yeri hava mücadelesidir) */
    if(alici)for(let i=tip==='hava'?N-1:0;i<N;i++){const tb=PA_TB[k*N+i];if(PA_TA[i]<=tb+pay){r=i;t=Math.max(PA_TA[i],tb);break;}if(i===N-1)t=PA_TA[i];}
    ir[k]=r;tr[k]=t;sure[k]=Math.max(PA_TB[k*N+r],t);if(sure[k]>sureMax)sureMax=sure[k];}
  const kalma=[1,1,1],enIyiH=[0,0,0],kalab=[0,0,0],marj=[9,9,9];
  for(const op of rakip){
    if(!op.oyunda)continue;
    const ds=segD(op.x,op.z,ox,oz,hx,hz);if(ds>op.maxSpd*(sureMax+0.2)+1.5)continue;
    const kaleci=op.rol==='GK',boy=(op.x-ox)*ux+(op.z-oz)*uz;
    /* pasörün dibindeki rakip: top ilk metrelerde bacağına yakın geçerse çoğu zaman bloklanır */
    /* T7c: vuruşa t0 kalırken pasörün dibindeki rakibin o anki yeri (şimdiki hızıyla; eskiden t0 > 0'da bu ceza hiç sayılmıyordu) */
    let yakinP=0;if(tip==='yer'&&(t0<0.05||MOTOR_AYAR.pasT0)){const kt=Math.min(t0,0.6),yk=segD(op.x+op.vx*kt,op.z+op.vz*kt,ox,oz,ox+ux*Math.min(4,L),oz+uz*Math.min(4,L));if(yk<1.0)yakinP=0.85-yk*0.35;}
    const ts=MOTOR_AYAR.pasT0&&t0>0?t0*(1-pasOkuma(op,p)):0,opv=rakipSuzul(op,ts);
    for(let i=0;i<N;i++){const kc=kaleci&&kaleCeza(m,op,PA_X[i],PA_Z[i]);PA_KC[i]=kc?1:0;PA_TO[i]=ts+varisSuresi(opv,PA_X[i],PA_Z[i],kc?1.1:0.75);}
    for(let k=0;k<K;k++){
      /* alıcının arkasındaki (kale tarafındaki) rakip topa ancak alıcının etrafından dolaşarak gelir */
      const r=ir[k],arkada=alici&&boy>L*(r+1)/N-0.4?0.35:0;let en=yakinP;
      for(let i=0;i<=r;i++){
        if(tip==='hava'&&i<r&&PA_H[i]>(PA_KC[i]?2.6:2.3))continue;
        const to=PA_TO[i]+arkada,tb=PA_TB[k*N+i];
        /* yolda: rakip toptan önce gelmeli. Karşılama noktasında: alıcıdan da önce (itişme, yarı yarıya).
           Havadan gelen topta iniş yeri bir hava mücadelesidir: kimin önce vardığı değil, top inerken orada kimin olduğu belirler
           (ikisi de oradaysa alıcı biraz önde — topa hazırlanan odur —, yalnız rakip oradaysa çoğu zaman rakip) */
        let pr;
        if(i<r)pr=sigma((tb-to-0.1)/0.14);
        else if(tip==='hava'){const dP=sigma((tb+0.25-to)/0.25),rP=sigma((tb+0.25-tr[k])/0.25);pr=dP*(0.7-0.35*rP);}
        else pr=0.7*sigma((Math.min(tr[k],tb+0.3)-to-0.05)/0.16);
        if(pr>en)en=pr;}
      /* yerden pasta her rakip ayrı ayrı araya girebilir; havadan topta iniş yerinde asıl çekişme en iyi rakiple */
      if(tip==='hava'){if(en>enIyiH[k])enIyiH[k]=en;if(en>0.15)kalab[k]++;}else kalma[k]*=1-Math.min(0.97,en);
      const mg=PA_TO[r]+arkada-sure[k];if(mg<marj[k])marj[k]=mg;}}
  /* hız seçimi: P(kesilmez) × P(kontrol) en iyi olan */
  const oz2=p.oz,baski=o.baski!=null?o.baski:baskiAltinda(m,p),gelA=Math.atan2(uz,ux),hucA=m.dir[p.team]>0?0:Math.PI;
  let enK=0,enS=-1,Pk=1,bk=0,Pt=0;
  for(let k=0;k<K;k++){
    if(tip==='hava')kalma[k]=(1-Math.min(0.95,enIyiH[k]))*Math.pow(0.95,Math.max(0,kalab[k]-1));
    /* alıcı geç kalırsa top hedefin ötesine yuvarlanır: geciktikçe alma olasılığı düşer */
    let al=1;if(alici){const gec=tr[k]-PA_TB[k*N+N-1];if(gec>0.05)al=clamp(1-gec*0.9,0.25,1);}
    const r=ir[k],va=tip==='yer'?yerHiz(v0[k],L*(r+1)/N,R):hyp(L/T,G*T*0.3),ya=tip==='yer'?0:0.45;
    const bs=clamp((0.8-marj[k])/1.2,0,1),pk=alici&&alici.oz?kontrolOlasiligi(alici,va,ya,bs,Math.abs(aciFark(gelA,hucA))):1;
    const s=kalma[k]*al*(0.55+0.45*pk);if(s>enS){enS=s;enK=k;Pk=pk;bk=bs;Pt=kalma[k]*al;}}
  const teknik=1-(0.01+L/420*(1.25-oz2.pas)+baski*0.05+(tip==='hava'?0.05:0))*(o.ilk?1.35:1)*(o.vole?1.5:1);
  /* T2 (pas kalibrasyonu): vuruş hatası. Yön ve uzunluk hatası vurusHatasi ölçeğinde (pas becerisi, baskı, gelişine/vole, yorgunluk, mesafe;
     havadan ×1,6); alıcının en yakın rakipten önce varma payı (marj) ne kadar büyükse o kadar sapma affedilir: dar pencereli ara pası ve uzun top
     sapmaya duyarlıdır, boştaki arkadaşa kısa pas değildir */
  const PT=MOTOR_AYAR.pasTol,sd0=(0.028+0.075*(1-oz2.pas))*(1+baski*0.9)*(o.ilk?1.35:1)*(o.vole?1.5:1)*(1+0.35*(p.yorgunluk||0))*(1+L/200)*MOTOR_AYAR.pasSapma*(tip==='hava'?1.6:1);
  const tol=PT[0]+PT[1]*Math.max(0,marj[enK]),Pex=(2*normalDagilim(tol/Math.max(0.05,sd0*L))-1)*(2*normalDagilim(tol/Math.max(0.05,sd0*(tip==='hava'?1.3:1+L/40)*L*PT[2]))-1);
  return{P:clamp(Pt*teknik*Pex,0.02,0.99),Pk,baskiK:bk,sure:sure[enK],v0:v0[enK],varis:V[enK],T:tip==='yer'?PA_TB[enK*N+N-1]-t0:T,L,marj:marj[enK],Pex};}
function kaleCeza(m,o,x,z){const gx=-m.dir[o.team]*PL;return Math.abs(x-gx)<16.5&&Math.abs(z-MZ)<20.2;}

/* ---- pas adayları (MM3) ---- */
/* buluşma noktası: alıcı koşusunu ~1 sn sürdürür; topun oraya (ortak plana göre) varış süresiyle sabit nokta yinelemesi */
function bulusmaNoktasi(m,g,ox,oz,t0,tip,varis,yay){
  let x=g.x,z=g.z,t=hyp(x-ox,z-oz)/14;
  for(let i=0;i<3;i++){const k=Math.min(t0+t,1.0);x=g.x+g.vx*k;z=g.z+g.vz*k;const L=hyp(x-ox,z-oz);
    t=pasPlani(m,L,tip,varis,yay).T;}
  return{x:clamp(x,-PL+0.5,PL-0.5),z:clamp(z,0.8,PW-0.8)};}
/* ara pası noktası: koşu çizgisinde (koşmuyorsa hücum yönünde) savunma çizgisinin gerisinde, alıcının her savunmacıdan en az 0,25 sn önce
   vardığı ve topun da alıcıdan çok önce geçmediği ilk nokta; yoksa alıcının hâlâ önde olduğu en iyi nokta (dar pencere: riskli, değeri düşer).
   g: alıcı (algı vekili olabilir), ofs: ofsayt çizgisi (u) */
function araNoktasi(m,g,ox,oz,t0,varis,ofs,d,pasor){
  const qh=hyp(g.vx,g.vz);let rx,rz;
  if(qh>2&&g.vx*d>0.4){rx=g.vx/qh;rz=g.vz/qh;}else{rx=d;rz=clamp((MZ-g.z)*0.015,-0.4,0.4);const n=hyp(rx,rz);rx/=n;rz/=n;}
  /* T7c (§7.10): rakip ara pasını vuruşta öğrenir (pasT0; pasör verildiyse hazırlığı okuma payıyla); rakip başına bir kez */
  const RV=[];for(const o of rakipler(m,g.team)){if(!o.oyunda)continue;const ts=MOTOR_AYAR.pasT0&&t0>0&&pasor?t0*(1-pasOkuma(o,pasor)):0;RV.push({o,ts,v:rakipSuzul(o,ts)});}
  let en=null;
  for(let s=2;s<=22;s+=2){
    const x=g.x+rx*s,z=g.z+rz*s;if(x*d>PL-3||z<2||z>PW-2)break;
    if(x*d<ofs-0.5)continue;
    const tq=varisZamani(g,x,z,0.5,0.05),L=hyp(x-ox,z-oz);
    const tb=t0+yerSure(Math.min(29,yerIlkHiz(L,varis||pasVarisHizi(L)+2,m.R)),L,m.R);
    if(tq>tb+0.35)continue;
    let td=99;for(const r of RV){const kc=r.o.rol==='GK'&&kaleCeza(m,r.o,x,z);td=Math.min(td,r.ts+varisZamani(r.v,x,z,kc?1.1:0.75,0.2));}
    const mj=td-tq;if(mj>=0.25)return{x,z,s,marj:mj};
    if(mj>=0&&(!en||mj>en.marj))en={x,z,s,marj:mj};}
  return en;}
/* kaybın bedeli: rakibin oradaki tehdidi */
function pasKaybi(m,p,x,z){return 0.3+xT(-x*m.dir[p.team],z)*100;}

/* ============ T2 (2026-10-07, gerçekçilik planı): baskı süresi, devam değeri, taşıma, bekleme ============
   Topu alan oyuncu bakabilsin, taşıyabilsin, bekleyebilsin; pas en ilerideki adama değil devamı olan adama gitsin. Hepsi saf (rastlantı yok). */
/* baskı süresi: topu t sn sonra (x,z)'de tutan oyuncuya en yakın iki rakibin varış süresi − t (sn; 9: baskı yok). Yerdeki ya da kilitli
   eylemdeki rakip sayılmaz. Ufkun (t + 2,5 sn) ötesindeki rakip sonucu değiştirmez (açıklık 1,8 sn'de doyar). Paylaşılan nesne döner (kopyala) */
const BS={t1:9,t2:9,o1:null};
/* haric (T4): sayılmayan rakip (rakibi geç seçeneğinde geçilmiş savunmacı). o1 (T4 1c): en önce varan rakip */
function baskiSuresi(m,team,x,z,t,haric){
  let t1=9,t2=9,o1=null;const ufuk=t+2.5;
  for(const o of rakipler(m,team)){if(!o.oyunda||(o.eylem&&o.eylem.kilit)||(o.kaynak||o)===haric)continue;
    const dx=o.x-x,dz=o.z-z,r=o.maxSpd*1.1*ufuk+0.8;if(dx*dx+dz*dz>r*r)continue;
    const v=varisZamani(o,x,z,0.8,0.2)-t;if(v<t1){t2=t1;t1=v;o1=o.kaynak||o;}else if(v<t2)t2=v;}
  BS.t1=t1;BS.t2=t2;BS.o1=o1;return BS;}
/* açıklık (0–1): 0 rakip topla aynı anda gelir, 1 en az 1,8 sn serbest */
const acikOran=t1=>clamp((t1-0.2)/1.6,0,1);
/* (x,z)'den ileriye en iyi pasın ucuz ön puanı: ileride ya da hizadaki arkadaşlar (ofsaytta olmayan), hattı kapatan rakipler (pasAdayiEkle'nin
   ön puanıyla aynı biçim). tau > 0: yalnız ileri koşan arkadaşlar (≥2,5 m/sn), tau sn sonraki yerlerinde (beklerse açılacak pas). Yoksa −9 */
function ileriPasOnPuani(m,q,x,z,tau){
  const d=m.dir[q.team],u=x*d,A=MOTOR_AYAR,ofs=ofsaytCizgisi(m,q.team),k=tau||0;let en=-9;
  for(const r of m.teams[q.team]){if(r===q||!r.oyunda||r.rol==='GK'||(k>0&&r.vx*d<2.5))continue;
    const rx=r.x+r.vx*k,rz=r.z+r.vz*k,ru=rx*d;if(ru<u-2||(ru>ofs+0.3&&ru>u&&ru>0))continue;
    const L=hyp(rx-x,rz-z);if(L<5||L>40)continue;
    const ux=(rx-x)/L,uz=(rz-z)/L,vOrt=10+L*0.25;let kapali=0;
    for(const o of rakipler(m,q.team)){if(!o.oyunda)continue;const ox=o.x-x,oz=o.z-z,boy=ox*ux+oz*uz;if(boy<-1||boy>L+2)continue;
      const yan=Math.abs(ox*uz-oz*ux),ul=o.maxSpd*0.75*Math.max(0,boy)/vOrt+0.8;if(yan<ul)kapali+=1-yan/ul;}
    const P=Math.exp(-1.2*kapali),U=P*(xT(ru,rz)*100+(ru-u)*A.ilerleme)-(1-P)*pasKaybi(m,q,(x+rx)/2,(z+rz)/2);if(U>en)en=U;}
  return en;}
/* devam değeri (puan): q topu t sn sonra (x,z)'de, bakis yönüne dönük alırsa elindeki en iyi işin ucuz tahmini. Taban oranın tehdidi (xT);
   seçenekler şut (xG), önündeki boşluğa taşıma, ileri pas. Baskı ve yön azaltır: sırtı dönük ve sıkışık alıcı topu ancak geri bırakır (ileri
   seçenekleri kapanır), rakip dibindeyse işi bitiremeyebilir (kayıp payı); iki rakip arasında daha da zor. Yüzü oyuna dönük ve önü açık
   alıcıda yüksektir */
function devamDegeri(m,q,x,z,t,bakis,haric){
  const d=m.dir[q.team],u=x*d,A=MOTOR_AYAR,bs=baskiSuresi(m,q.team,x,z,t,haric),acik=acikOran(bs.t1),iki=clamp((0.9-bs.t2)/0.9,0,1)*(1-acik);
  const sirt=bakis==null?0:clamp(-Math.cos(aciFark(bakis,d>0?0:Math.PI)),0,1)*(1-acik);
  let en=xT(u,z)*100;
  /* T7c (plan T7 madde 6, şut açısı): şutun devamı atış hattındaki blokla azalır — açısı açık yere taşıma ve pas, kapalıdan değerli */
  if(u>PL-30)en=Math.max(en,xG(u,z,'ayak',1-acik)*100*(0.85+q.oz.sut*0.3)*(1-sutBlokOlasiligi(m,q,x,z,d*PL,MZ,'sert')));
  const k=10*acik*(1-sirt);
  if(k>1){const u2=Math.min(PL-11,u+k);en=Math.max(en,xT(u2,z+(MZ-z)*0.15)*100+(u2-u)*A.ilerleme*0.8);}
  /* T4 (1c): alıcının bire bir devamı. Önündeki tek savunmacıya (ilki 1,6 sn içinde ve önünde, ikincisi ondan en az 0,6 sn geç; kaleci değil)
     yüzü dönük alıcı onu geçmeyi dener: P1 sürüş becerisinden (0,15 + 0,5·sürüş) ve yalnızlıktan (0,6–1,6 sn: 0 → 1); kazanç 9 m ötenin
     tehdidi + ilerleme + adam geçme değerinin yarısı (bir adım ötede, kesin değil), kayıp bu yerin bedeli (gec seçeneğinin 0,75 oranıyla).
     Önceden önü kapalı alıcının devamı yalnız oranın tehdidiydi: beke karşı yalnız kalan kanat oyuncusuna pas en iyi seçenek olmuyordu
     (rakip yarıda %3; kanada pas %10, çalımların kanat payı %20) */
  const o1=bs.o1;
  if(A.devamBirebir>0&&o1&&o1.rol!=='GK'&&u>-12&&bs.t1<1.6&&sirt<0.5&&(o1.x-x)*d>0.5){const iso=clamp((bs.t2-bs.t1-0.6)/1.0,0,1);
    if(iso>0){const P1=clamp(0.15+0.5*q.oz.surus,0.1,0.65)*iso*(1-sirt),u2=Math.min(PL-8,u+9);
      const v1=(P1*(xT(u2,z+(MZ-z)*0.15)*100+9*A.ilerleme+0.5*A.birebirDeger)-(1-P1)*0.75*pasKaybi(m,q,x,z))*A.devamBirebir;if(v1>en)en=v1;}}
  /* ön puan tam analizden iyimserdir (alıcının baskısı, vuruş hatası yok): devamPas kadar sayılır */
  const ip=ileriPasOnPuani(m,q,x,z,0);if(ip>-9)en=Math.max(en,ip*A.devamPas*(1-0.7*sirt));
  const g=clamp(0.62+0.38*acik-0.15*iki,0.4,1);
  return en*g-(1-g)*pasKaybi(m,q,x,z)*0.6;}
/* taşıma: 8 yön × 5 ve 10 m (dönmesi gereken yönde 2,5 m de). Başarı: yol üzerindeki noktalara (2,5 m'de bir) rakiplerin varış süresi ile
   taşıyanınki (dönüş + ivmelenme + mesafe/hız); her rakip için en kötü noktadan sigmoid, ulaşan rakip topu her zaman almaz (×0,7).
   Boş alanda ~0,97. Değer: yeni yerdeki devam değeri (yüzü taşıma yönünde) − kayıp */
const TS_N=4,TS_ADIM=2.5,TS_P=new Float64Array(TS_N),TS_X=new Float64Array(TS_N),TS_Z=new Float64Array(TS_N),TS_T=new Float64Array(TS_N);
function tasimaSecenekleri(m,p,S){
  const b=m.ball,d=m.dir[p.team],hA=d>0?0:Math.PI,A=MOTOR_AYAR,takim=m.taktik[p.team],rakip=rakipler(m,p.team);
  const vC=p.maxSpd*0.72*(0.8+0.12*p.oz.surus)/0.86;
  for(let j=0;j<8;j++){
    const a=aciNorm(hA+j*Math.PI/4),c=Math.cos(a),s=Math.sin(a),don=Math.max(0,Math.abs(aciFark(a,p.yon))-0.6)/4;
    let n=0;for(let i=0;i<TS_N;i++){const x=b.x+c*TS_ADIM*(i+1),z=b.z+s*TS_ADIM*(i+1);if(Math.abs(x)>PL-1||z<1||z>PW-1)break;
      TS_X[i]=x;TS_Z[i]=z;TS_T[i]=don+0.25+TS_ADIM*(i+1)/vC;TS_P[i]=1;n++;}
    if(n<1)continue;
    /* her rakip: noktalara varış; i. noktaya kadarki en kötü risk (TS_P[i]: o noktaya kadar topu kaptırmama) */
    for(const o of rakip){if(!o.oyunda||(o.eylem&&o.eylem.kilit))continue;
      const ox=o.x-b.x,oz=o.z-b.z,r=o.maxSpd*1.1*(TS_T[n-1]+0.5)+TS_ADIM*n+1;if(ox*ox+oz*oz>r*r)continue;
      let en=0;for(let i=0;i<n;i++){const to=varisZamani(o,TS_X[i],TS_Z[i],0.8,0.2),rr=sigma((TS_T[i]+0.1-to)/0.18);if(rr>en)en=rr;TS_P[i]*=1-0.7*en;}}
    /* T7c: şut bölgesinde (kaleye 24 m) kısa taşıma da tartılır: tek dokunuşla şut açısını açmak */
    const uz=[];if(don>0.15||b.x*d>PL-24)uz.push(0);if(n>=2)uz.push(1);if(n>=4)uz.push(3);
    /* değer: yeni yerin devam değeri + taşımanın kendi kazandırdığı (kaybettirdiği) alan (paslardaki ilerleme teriminin aynısı; olmasa geriye
       taşıyıp ileri pas atmak, oradan pas daha çok metre kazandırdığı için, ileri taşımak kadar değerli görünüyordu) */
    for(const i of uz){const P=clamp(TS_P[i],0.05,0.98),x=TS_X[i],z=TS_Z[i];
      const dv=devamDegeri(m,p,x,z,TS_T[i],a),mx=(b.x+x)/2,mz=(b.z+z)/2,ilr=(x-b.x)*d*A.ilerleme;
      S.push({tur:'tasi',hx:x,hz:z,yon:a,mesafe:TS_ADIM*(i+1),deger:P*(dv+ilr)-(1-P)*pasKaybi(m,p,mx,mz)*takim.risk*A.risk,P,dv});}}
}
/* bekle / koru: top ayağın altında, yerinde. Rakip yakınsa gövdeyle korur (koru), değilse başı yukarıda bekler (bekle). Tutma olasılığı baskı
   süresinden ve korumadan (top sürme, sertlik, kütle). Değer: buranın tehdidi ya da koşusu süren arkadaşa 0,6 sn sonra açılacak pas (yalnız
   ileri koşanlar: duran arkadaşın pası şimdi de var, beklemek onu iyileştirmez) */
function bekleSecenegi(m,p,S){
  const b=m.ball,A=MOTOR_AYAR,t1=baskiSuresi(m,p.team,b.x,b.z,0).t1;
  if(t1<0.7)return;   /* T4e: rakip dibindeyse tutma koruSecenegi'nin işi */
  const kalkan=clamp(0.5*p.oz.surus+0.3*p.oz.sertlik+0.2*clamp((kutle(p)-65)/30,0,1),0,1);
  /* tam baskıda (rakip topla aynı anda) korumayla ~%45–60 (maçta müdahalelerin yarısı topu alıyor; 0,55 katsayısı fazla iyimserdi, T2) */
  const P=clamp(0.98-0.7*clamp((1.0-t1)/1.2,0,1)*(1.25-kalkan),0.25,0.98);
  /* bekleOran: yerinde beklemek oranın tehdidini tam korumaz (savunma yerleşir, atak söner; eski koru değeri de buranın tehdidinin %85'iydi) */
  const v=Math.max(xT(b.x*m.dir[p.team],b.z)*100*A.bekleOran,ileriPasOnPuani(m,p,b.x,b.z,0.6)*A.devamPas);
  S.push({tur:'bekle',deger:P*v-(1-P)*pasKaybi(m,p,b.x,b.z)*m.taktik[p.team].risk*A.risk,P});}
/* T4e (2026-10-09): bırakma pasının ucuz ön puanı — (x,z)'den tau sn sonra 4–16 m'deki bir arkadaşa (her yönde: destek geriden gelir) kısa pas.
   Alıcı tau sn sonraki yerinde; hattı kapatan rakipler ileriPasOnPuani biçiminde (tau'nun yarısı kadar ilerletilir); değer alıcının yerinin
   tehdidi (açıklığıyla) + ilerleme, kesilme payıyla; yoksa −9. tau 0: şimdi */
function birakOnPuani(m,q,x,z,tau){
  const d=m.dir[q.team],u=x*d,A=MOTOR_AYAR,k=tau||0;let en=-9;
  for(const r of m.teams[q.team]){if(r===q||!r.oyunda||r.rol==='GK')continue;
    const rx=r.x+r.vx*k,rz=r.z+r.vz*k,ru=rx*d,L=hyp(rx-x,rz-z);if(L<4||L>16)continue;
    const ux=(rx-x)/L,uz=(rz-z)/L,vOrt=10+L*0.25;let kapali=0;
    for(const o of rakipler(m,q.team)){if(!o.oyunda)continue;const ox=o.x+o.vx*k*0.5-x,oz=o.z+o.vz*k*0.5-z,boy=ox*ux+oz*uz;if(boy<-1||boy>L+2)continue;
      const yan=Math.abs(ox*uz-oz*ux),ul=o.maxSpd*0.75*Math.max(0,boy)/vOrt+0.8;if(yan<ul)kapali+=1-yan/ul;}
    const P=Math.exp(-1.2*kapali),acik=acikOran(baskiSuresi(m,q.team,rx,rz,k).t1);
    const U=P*(xT(ru,rz)*100*(0.7+0.3*acik)+(ru-u)*A.ilerleme)-(1-P)*pasKaybi(m,q,(x+rx)/2,(z+rz)/2);if(U>en)en=U;}
  return en;}
/* T4e: top saklama — rakip dibindeyken (0,8 sn içinde ya da 1,6 m'de) gövdeyi araya koyup destek gelene dek tutma (gerçekçilik planı §4 T4
   madde 5, Ek G2 "koru"). Değer: tutma olasılığı (bekleSecenegi'nin kalkan modeli: sürüş, sertlik, kütle; 0,6 sn'lik olasılığın süreyle üssü) ×
   tau sonra açılacak en iyi işin ucuz puanı (bırakma pası birakOnPuani, ileri pas ileriPasOnPuani, oranın tehdidi × bekleOran) − kayıp;
   koruDeger × kalkan küçük eğilim payı (MOTOR_AYAR; c-koru geçtikten sonra ayarlanır). tau 0,5 / 0,9 / 1,3 sn denenir, en iyisi seçeneğin
   süresi olur (yürütme kararT'yi ona bağlar: tutma sürer, düşünme aralığında bozulmaz) */
function koruSecenegi(m,p,S){
  if(p.rol==='GK')return;
  const b=m.ball,A=MOTOR_AYAR,bs=baskiSuresi(m,p.team,b.x,b.z,0),t1=bs.t1;
  if(t1>=0.8&&!(bs.o1&&hyp(bs.o1.x-b.x,bs.o1.z-b.z)<1.6))return;
  /* gövde araya girince 0,6 sn'lik tutma olasılığı kalkandan (arkadan temas çoğu zaman faul, kayıp daha çok kendi hatası): 0,55 → 0,9.
     0,7 → 0,97 denendi: tutma herkese bedava göründü (40 maçta koruma 21–23 sn ama pas −10, PPDA −1, düello bandın altı) */
  const kalkan=clamp(0.5*p.oz.surus+0.3*p.oz.sertlik+0.2*clamp((kutle(p)-65)/30,0,1),0,1),P0=clamp(0.55+0.35*kalkan,0.5,0.92);
  const kayip=pasKaybi(m,p,b.x,b.z)*m.taktik[p.team].risk*A.risk,tehdit=xT(b.x*m.dir[p.team],b.z)*100*A.bekleOran;
  /* şimdiki en iyi iş (pas, taşıma, şut, çalım; listede önce gelirler) tutulursa kalır; beklemek ucuz ön puanlardaki artış kadar kazandırır */
  let enS=tehdit;for(const s of S)if(s.deger>enS)enS=s.deger;
  const b0=birakOnPuani(m,p,b.x,b.z,0),i0=ileriPasOnPuani(m,p,b.x,b.z,0);
  /* eğilim payı bu sahiplikte topu tutma süresiyle söner (koruSure): yerleşip bakar, sonra indirir — sonsuza dek tutmaz. Beklemenin kazancı eksi
     de olabilir (destek geldiyse ya da uzaklaşıyorsa, rakip yaklaşıyorsa beklemek değer kaybettirir): o zaman bırakır */
  const g=m.bVeri(p).gur,tutT=g&&g.no===m.sahiplikNo?m.t-g.t0:0,egilim=A.koruDeger*kalkan*Math.max(0,1-tutT/A.koruSure);
  /* tempo bedeli: top tutuldukça atak söner, savunma yerleşir (koruTempo puan/sn; ucuz ön puanlar bunu görmez) */
  const tempo=A.koruTempo*tutT;
  let en=null;
  for(const tau of KORU_SURE){
    /* ikinci rakip tutma bitmeden gelirse (t2 < tau) gövde ikisini birden kapatamaz: olasılık 0,55'e dek iner */
    const P=Math.pow(P0,tau/0.6)*(bs.t2<tau?lerp(1,0.55,clamp((tau-bs.t2)/tau,0,1)):1);
    const kazanc=Math.max(birakOnPuani(m,p,b.x,b.z,tau)-b0,ileriPasOnPuani(m,p,b.x,b.z,tau)-i0)*A.devamPas;
    const deger=P*(enS+kazanc)-(1-P)*kayip+egilim-tempo;
    if(!en||deger>en.deger)en={tur:'koru',deger,P,sure:tau,o:bs.o1};}
  S.push(en);}
const KORU_SURE=[0.5,0.9,1.3];
/* T4 (2026-10-08): rakibi geç. Önünde (ilerleme yönünde ya da kaleye doğru, birebirMenzil içinde) savunmacı varsa birebirTahmin (js/mac-hareket.js)
   hareketi, yanı ve olasılığı verir. Değer: P · (toplama noktasındaki devam değeri (geçilen savunmacı sayılmadan) + kazandırılan alan + birebirDeger)
   − Pk · buradaki kayıp · risk · birebirKayip.
   Kaleciye bire bir yapılmaz (calimRakibi kaleciyi saymaz; T9b). Taşıma seçenekleri saf yarış kalır (aynı şerit iki kez sayılmaz: taşıma rakibin
   üstüne sürmeyi kötü bulur, bu seçenek onu aşmayı tartar) */
const BB_YON=[0,0,null];
function birebirSecenegi(m,p,S){
  if(p.rol==='GK')return;
  const b=m.ball,d=m.dir[p.team],A=MOTOR_AYAR,hA=d>0?0:Math.PI,gy=Math.atan2(MZ-b.z,d*PL-b.x);let en=null,enD=-1e9;
  /* yönler: hücum yönü, kaleye doğru, topu sürüyorsa kendi gidiş yönü; savunmacı ±66° içinde */
  const YON=BB_YON;YON[0]=hA;YON[1]=gy;YON[2]=p.surus&&!p.surus.bekle&&!p.surus.koru?p.surus.yon:null;
  for(const yon of YON){if(yon==null)continue;const o=m.calimRakibi(p,yon,A.birebirMenzil,false,0.4);if(!o||en&&en.o===o)continue;
    /* düelloya giren savunmacı çalımlanır: 4 m içinde ve 3 m/sn'den hızlı geri çekilmiyor ya da menzil içinde ve 1 m/sn'den hızlı kaçmıyor (hatla birlikte geri
       çekilen savunmacıya topla yürünür; ona yapılan çalım düellosuz biter) */
    const L0=hyp(o.x-b.x,o.z-b.z),geri=(o.vx*(o.x-b.x)+o.vz*(o.z-b.z))/(L0||1);if(!(L0<=4&&geri<3||geri<1))continue;
    const bb=birebirTahmin(m,p,o,yon,null);if(bb.i<0)continue;
    const H=HRK_HAREKET[bb.i],L=L0,tYak=Math.max(0,L-H.itisL)/Math.max(1,hrkTepe(p)*0.92*H.yakHiz)+H.haz;
    /* devam değeri geçilen savunmacı sayılmadan (başarıda o geride kalmıştır) */
    const dv=devamDegeri(m,p,bb.cx,bb.cz,tYak+bb.tA,Math.atan2(MZ-bb.cz,d*PL-bb.cx),o),ilr=(bb.cx-b.x)*d*A.ilerleme;
    const deger=bb.P*(dv+ilr+A.birebirDeger)-bb.Pk*pasKaybi(m,p,b.x,b.z)*m.taktik[p.team].risk*A.risk*A.birebirKayip;
    if(deger>enD){enD=deger;en={tur:'gec',yon,o,i:bb.i,hareket:bb.hareket,taraf:bb.taraf,P:bb.P,Pk:bb.Pk,hx:bb.cx,hz:bb.cz,deger,tYak};}}
  if(en)S.push(en);}
/* hedefin değeri (türden bağımsız kısım): tehdit, ilerleme, geri pasla topu tutma, ara pası, boşluğa, yön değiştirme, ver-kaç dönüşü */
function pasDegeri(m,p,o,hx,hz,alt,q){
  const d=m.dir[p.team],u=o.ox*d,A=MOTOR_AYAR,takim=m.taktik[p.team],hu=hx*d,ilerleme=hu-u;
  /* alıcı topu aldığı an sıkıştırılacaksa o yerin değeri tam gerçekleşmez (topu tutamaz, geri döner) */
  const qB=enYakinRakip(m,hx,hz,p.team).d,sik=clamp((4-qB)/3,0,1);
  /* ara pasında alıcı savunmanın arkasında topu kaleye taşır: tehdit 5 m ileriden ölçülür (kaleciyle karşı karşıya kalma değeri) */
  let v=xT(alt==='ara'?Math.min(PL-8,hu+5):hu,hz)*100*(1-A.sikisma*sik)+ilerleme*(A.ilerleme+0.015*takim.direkt)*(ilerleme<0?0.3:1-0.5*sik);
  if(ilerleme<-4)v+=takim.sakin*A.geriPas+o.baski*0.8;    /* geri pas: topu tutmak, baskıda güvenli çıkış */
  if(alt==='ara')v+=A.araDeger*(0.5+takim.direkt);else if(alt==='bosluk')v+=A.boslukDeger;else if(alt==='hedef')v+=A.hedefDeger*(0.4+takim.direkt);
  if(q.rol==='GK')v-=0.3;
  if(Math.abs(hz-o.oz)>=25)v+=A.donusDeger;
  const vq=m._bv&&m._bv.get(q);if(vq&&vq.vk&&vq.vk.q===p)v+=A.verKacDeger;
  return v;}
const pasTurDegeri=(m,p,tip,yay)=>tip==='hava'?m.taktik[p.team].direkt*0.4+MOTOR_AYAR.havaDeger:0;  /* havadan pas: kontrolü zor, uzun top takımın tarzına bağlı */
const PAS_ALT_SIRA={ayak:0,birak:0,bosluk:1,ara:2,hedef:3};
/* ucuz ön puan ve tür seçimi: hattın ilk %60'ı kapalıysa ve iniş yeri boşsa havadan, değilse yerden; sınırdaysa ikisi de tam analize girer */
function pasAdayiEkle(m,p,o,C,q,g,hx,hz,alt,ex,ez,es,ek){
  const d=m.dir[p.team],ox=o.ox,oz=o.oz;
  if(hz<1||hz>PW-1||Math.abs(hx)>PL-1||hx*d>PL-1)return;
  const L=hyp(hx-ox,hz-oz);if(L<3||L>66)return;
  if((alt==='ara'&&L<15)||(alt==='bosluk'&&(L<8||o.ilk)))return;   /* kısa ara pası, kısa ya da tek vuruşla boşluğa pas: tutmaz */
  if(o.ilk&&(L>(alt==='ara'?30:25)||Math.abs(aciFark(Math.atan2(hz-oz,hx-ox),o.gelA+Math.PI))>o.sinirA))return;
  const ux=(hx-ox)/L,uz=(hz-oz)/L,vOrt=10+L*0.25;
  let r60=0,rSon=0,inis=99,blok=99;
  for(const r of rakipler(m,p.team)){if(!r.oyunda)continue;
    const rx=r.x-ox,rz=r.z-oz,boy=rx*ux+rz*uz,yan=Math.abs(rx*uz-rz*ux);
    /* T7c (§7.10): ön puanda da rakip vuruşa kadar yalnız hazırlığı okuduğu kadar yaklaşır (tam analizle aynı saat; ortalama okuma ~0,75·pasOku) */
    if(boy>-1&&boy<L+3){const t=(MOTOR_AYAR.pasT0?o.t0*0.75*MOTOR_AYAR.pasOku:o.t0)+Math.max(0,boy)/vOrt,ul=r.maxSpd*0.75*t+0.8;
      if(yan<ul){if(boy<L*0.6){r60+=1-yan/ul;if(boy<7&&yan<1.6&&boy<blok)blok=boy;}else rSon+=1-yan/ul;}}
    const di=hyp(r.x-hx,r.z-hz);if(di<inis)inis=di;}
  /* tür: hat açıksa yerden (38 m'ye kadar; uzunda sert), ilk %60'ı kapalıysa ve iniş yeri boşsa havadan, kısa mesafede rakip dibindeyse aşırtma */
  let tip='yer',yay=null;
  const havaUygun=!o.ilk&&L>=10&&(inis>2.5||rSon<r60);
  if(L>38||(r60>0.6&&havaUygun)){tip='hava';yay=L<24&&blok<7?'asirtma':null;}
  const hh=alt==='hedef'?hedefHavaP(m,q,hx,hz):null,Ph=hh?hh.kazan:0,Pi=hh?hh.ikinci:0;if(alt==='hedef'){tip='hava';yay=null;}
  if(tip==='hava'&&(o.ilk||alt==='bosluk'))return;
  const P0=alt==='hedef'?Ph:Math.exp(-1.2*(tip==='yer'?r60+rSon:rSon*1.2+(yay==='asirtma'?0:r60*0.15)))*(tip==='hava'?0.85:1);
  const dg=pasDegeri(m,p,o,hx,hz,alt,q)+(ek||0),kay=pasKaybi(m,p,hx,hz);
  const U0=P0*(dg+pasTurDegeri(m,p,tip,yay))-(1-P0)*kay*(alt==='hedef'?1-Pi:tip==='hava'?MOTOR_AYAR.ikinciTop:1);
  C.push({q,g,hx,hz,alt,ex,ez,es,tip,yay,dg,kay,U0,Ph,Pi,iki:!o.ilk&&alt!=='bosluk'&&alt!=='hedef'&&L>=12&&L<=38&&r60>0.3&&r60<1.4});}
/* hedef forvete uzun top (T2: iki ayrı terim). kazan: forvet topa ilk dokunur (iniş yerinde boşsa yüksek; çekişmeliyse kafa, boy ve gövde
   düellosu); pasın tamamlanmasıdır. ikinci: kaybedilen düelloda dönen topun takımda kalma olasılığı; tamamlanma sayılmaz, kaybın bedelini
   azaltır (eskiden ikisi tek olasılıktı ve tahmin gerçekleşenden 17 puan iyimserdi). Rastlantısız; paylaşılan nesne (HH) döner */
const HH={kazan:0,ikinci:0};
function hedefHavaP(m,q,hx,hz){
  let e=null,ed=99;for(const r of rakipler(m,q.team)){if(!r.oyunda||r.rol==='GK')continue;const dd=hyp(r.x-hx,r.z-hz);if(dd<ed){ed=dd;e=r;}}
  HH.ikinci=MOTOR_AYAR.ikinciTopHedef;
  if(!e||ed>4){HH.kazan=0.8;return HH;}
  const duello=clamp(0.5+0.6*(q.oz.kafa-e.oz.kafa)+(kutle(q)-kutle(e))/120+((q.boy||1)-(e.boy||1))*1.5,0.15,0.85),bos=clamp((ed-1)/3,0,1);
  HH.kazan=clamp(lerp(duello,0.8,bos),0.1,0.85);return HH;}
/* tam analiz: seçilen türde (sınırdaysa diğerinde de) pasAnaliz ve fayda. T2: alıcının devam değeri; alıcı topu pasın geldiği yöne (pasöre)
   dönük alır, ara pasında ve boşluğa koşarak yüzü koşu yönündedir. Devam değeri oranın tehdidinden (xT) ne kadar farklıysa (devamAgirlik) değer
   o kadar düzelir: sırtı dönük ve markajdaki forvete pas eksi, önü açık ve yüzü oyuna dönük arkadaşa artı */
function pasAdayiTam(m,p,o,c,tip,yay){
  const A=pasAnaliz(m,p,c.hx,c.hz,tip,c.g,{ox:o.ox,oz:o.oz,t0:o.t0,alt:c.alt,yay,ilk:o.ilk,baski:o.baski,vole:o.vole}),takim=m.taktik[p.team],MA=MOTOR_AYAR,d=m.dir[p.team];
  const hedef=c.alt==='hedef';
  /* hedef forvete: düello tahmini ile iniş yeri çekişmesinin (pasAnaliz) iyisi; yalnız düello 30 puan karamsardı (T2 ölçümü, 8 maç) */
  if(hedef)A.P=clamp(Math.max(c.Ph*A.Pex,A.P),0.02,0.99);
  /* ara pası: ölçülen kalibrasyon düzeltmesi (T2, 8 maç: tahmin %77, gerçekleşen %58; başarısızların %57'sini savunmacı kesiyor, ofsayt %3;
     0,75 seçimi fazla daraltıp tahmini karamsar yaptı, 0,85). Kök neden geriye koşan savunmacının varış/uzanma modelindedir (T5); o tura
     kadar çarpanla kapatılır */
  if(c.alt==='ara')A.P*=MA.araKalib;
  /* ofsayt riski (T2 kalibrasyon): pasör çizgiyi hatasız göremez (secenekler'deki algı hatasıyla aynı ölçek); ilerideki alıcı algılanan çizgiye
     yakınsa gerçekte ofsaytta olabilir: P(ofsayt) = Φ((alıcı − algılanan çizgi) / σ) */
  if(o.ofs!=null){const gu=c.g.x*d,u=o.ox*d;if(gu>u&&gu>0){const sg=Math.max(0.3,MA.ofsaytAlgi*(1.2-p.oz.gorus));A.P*=1-normalDagilim((gu-o.ofs)/sg);}}
  const bakis=c.alt==='ara'?(d>0?0:Math.PI):c.alt==='bosluk'&&(c.ex||c.ez)?Math.atan2(c.ez,c.ex):Math.atan2(o.oz-c.hz,o.ox-c.hx);
  /* hedef forvete uzun topun değeri çoğunlukla alan ve ikinci toptur, forvetin devamı daha az belirler (devamHedef) */
  const dv=devamDegeri(m,c.q,c.hx,c.hz,A.sure,bakis),dEk=MA.devamAgirlik*(hedef?MA.devamHedef:1)*(dv-xT(c.hx*d,c.hz)*100);
  /* havadan topta kaybedilen hava mücadelesi çoğu zaman ikinci top olur (temiz kayıp değil): kaybın bedeli daha az */
  const U=A.P*(c.dg+dEk+pasTurDegeri(m,p,tip,yay))*(0.7+0.3*A.Pk)-(1-A.P)*c.kay*(hedef?1-c.Pi:tip==='hava'?MA.ikinciTop:1)*takim.risk*MA.risk;
  return{tur:c.alt==='ara'?'ara':A.L>34?'uzun':'pas',alici:c.q,hx:c.hx,hz:c.hz,tip,yay,varis:A.varis,T:tip==='hava'?A.T:null,
    mod:c.alt==='ara'?'ara':c.alt==='bosluk'?'bosluk':'ayak',ex:c.ex,ez:c.ez,es:c.es,deger:U,P:A.P,Pk:A.Pk,sure:A.sure,L:A.L,alt:c.alt,dv};}
/* bütün pas seçenekleri. o: {ox,oz: topun çıkacağı yer, t0: vuruşa kalan süre, ilk: gelişine (tek vuruş), gelA: gelen topun yönü,
   sinirA: hizalanma sınırı, baski: pasörün baskısı, ofs: algılanan ofsayt çizgisi, vole: top havada} */
function pasSecenekleri(m,p,o){
  const d=m.dir[p.team],u=o.ox*d,C=[];
  for(const q of m.teams[p.team]){
    if(q===p||!q.oyunda||(q.eylem&&q.eylem.kilit))continue;
    if(q.rol==='GK'&&(u>-10||o.baski<0.3))continue;
    const g=algilanan(m,p,q);if(!g)continue;
    const dq=hyp(g.x-o.ox,g.z-o.oz);if(dq<3||dq>64)continue;
    const qu=g.x*d,ofsaytta=qu>o.ofs+0.3&&qu>u&&qu>0;
    if(!ofsaytta){
      const mt=bulusmaNoktasi(m,g,o.ox,o.oz,o.t0,dq>34?'hava':'yer');
      pasAdayiEkle(m,p,o,C,q,g,mt.x,mt.z,dq<11&&qu<u+2?'birak':'ayak',0,0,0);
      /* önündeki boşluğa: yalnız ileri koşan alıcının koşu yönüne (kenar çizgisinden içeride).
         Duran ya da yana/geriye koşan alıcıyı döndürüp hızlandıracak pas düşünülmez */
      const qh=hyp(g.vx,g.vz);let ex=0,ez=0;
      if(qh>3&&g.vx/qh*d>0.6){ex=g.vx/qh;ez=g.vz/qh;}
      if((ex||ez)&&q.rol!=='GK')for(const s of[3,6]){const z=mt.z+ez*s;if(z>3&&z<PW-3)pasAdayiEkle(m,p,o,C,q,g,mt.x+ex*s,z,'bosluk',ex,ez,s);}
    }
    /* hedef forvete uzun top (birleştirme, 2026-10-03): önde bekleyen hedef forvete ya da forvete havadan; iniş yeri çekişmeli olsa da
       hava düellosu ve ikinci top değerlidir (alt ligde sık oyun). Takımın direkt ayarıyla değerlenir */
    if(!o.ilk&&!ofsaytta&&q.rol==='FV'&&qu>u+12){const L=hyp(g.x-o.ox,g.z-o.oz);if(L>=22&&L<=58)pasAdayiEkle(m,p,o,C,q,g,g.x+g.vx*0.6,g.z+g.vz*0.6,'hedef',0,0,0);}
    /* ara pası: ofsayt çizgisine yakın, kendi tarafındaki hücumcu (ya da bindiren bek) savunma arkasına */
    if(qu<=o.ofs+0.5&&q.rol!=='GK'&&(q.rol!=='DEF'||q.mevki.bek)&&qu>o.ofs-12&&qu>u-8){
      const h=araNoktasi(m,g,o.ox,o.oz,o.t0,null,o.ofs,d,p);
      if(h){pasAdayiEkle(m,p,o,C,q,g,h.x,h.z,'ara',0,0,0,-Math.max(0,0.25-h.marj)*MOTOR_AYAR.araDar);
        /* T7c: tetikli koşunun kaydı — alıcı bu noktaya koşabilir (mac-topla.js derinKosu; 0,5 sn geçerli) */
        const AK=m._araKayit||(m._araKayit=[new Map(),new Map()]),e=AK[p.team].get(q);if(e){e.x=h.x;e.z=h.z;e.t=m.t;}else AK[p.team].set(q,{x:h.x,z:h.z,t:m.t});}}
  }
  C.sort((a,c)=>c.U0-a.U0||a.q.n-c.q.n||PAS_ALT_SIRA[a.alt]-PAS_ALT_SIRA[c.alt]||(a.es||0)-(c.es||0));
  const K=Math.min(C.length,o.ilk?6:10),S=[];
  for(let i=0;i<K;i++){const c=C[i];let r=pasAdayiTam(m,p,o,c,c.tip,c.yay);
    if(c.iki){const t2=c.tip==='yer'?'hava':'yer',r2=pasAdayiTam(m,p,o,c,t2,t2==='hava'&&hyp(c.hx-o.ox,c.hz-o.oz)<24?'asirtma':null);if(r2.deger>r.deger)r=r2;}
    S.push(r);}
  return S;}

/* ---- orta (MM3) ---- */
/* hücumcuların varış noktalarına ve kaleciyle savunma arasına. Türler: alçak sert (yerden, altıpasın önünden), kesme (düz ve hızlı, kafa/vole
   yüksekliği), arka direğe asma, geri çevirme (ceza sahası içine yerden geri). Değer = xG(kafa/vole) × P(ulaşır) × (1 − kaleciHavaTahmin) */
function ortaSecenekleri(m,p,o,S){
  const d=m.dir[p.team],u=o.ox*d,yakin=Math.sign(o.oz-MZ)||1,gk=m.kaleci(1-p.team),A=MOTOR_AYAR,takim=m.taktik[p.team],C=[];
  const ekle=(q,g,hx,hz,tip,yay,hy,T,tur)=>{const tu=hx*d;if(tu>PL-2||tu<PL-20||Math.abs(hz-MZ)>12)return;C.push({q,g,hx,hz,tip,yay,hy,T,tur});};
  for(const q of m.teams[p.team]){
    if(q===p||!q.oyunda||q.rol==='GK'||(q.eylem&&q.eylem.kilit))continue;
    const g=algilanan(m,p,q);if(!g)continue;
    const qu=g.x*d;if(qu<PL-24||Math.abs(g.z-MZ)>19||(qu>o.ofs+0.3&&qu>u))continue;
    const L0=hyp(g.x-o.ox,g.z-o.oz),uzak=Math.sign(g.z-MZ)!==yakin||Math.abs(g.z-MZ)<2.5;
    const nok=T=>{const k=Math.min(T,0.9);return{x:g.x+g.vx*k,z:g.z+g.vz*k};};
    if(u>PL-22&&qu>PL-11){const t=L0/17,n=nok(t);ekle(q,g,d*Math.min(n.x*d,PL-2.5),n.z,'yer',null,0,null,'alcak');}
    {const T=havaSure(L0,'kesme'),n=nok(T);ekle(q,g,n.x,n.z,'hava','kesme',1.35,T,'kesme');}
    if(uzak){const T=havaSure(L0,'asma'),n=nok(T);ekle(q,g,n.x,n.z,'hava','asma',1.8,T,'asma');}
    /* T7c (plan T7 madde 4, çizgiye inip geri çevirme): ortacı ceza sahası derinliğinde (17 m), alıcı penaltı noktası ile zon 14'ün önü arasında
       (7–21 m; eskiden ortacı 15 m, alıcı 8–19 m: kanat o kadar derine nadiren indiği için 80 maçta 22 deneme) */
    if(u>PL-17&&qu<PL-7&&qu>PL-21&&Math.abs(g.z-MZ)<12){const mt=bulusmaNoktasi(m,g,o.ox,o.oz,0,'yer');ekle(q,g,mt.x,mt.z,'yer',null,0,null,'geri');}}
  /* bölgeler: ön direk, arka direk, penaltı noktası ve kaleciyle savunma arası (altıpasın önü) — oraya en erken varacak arkadaşa */
  for(const [zu,zw,yay,hy] of[[PL-5.5,MZ+yakin*2.2,'kesme',1.6],[PL-6.5,MZ-yakin*4,'asma',1.8],[PL-11,MZ,'kesme',1.5],[PL-6,MZ-yakin,'kesme',1.3]]){
    const zx=d*zu;let en=null,eg=null,enT=99;
    for(const q of m.teams[p.team]){if(q===p||!q.oyunda||q.rol==='GK'||(q.eylem&&q.eylem.kilit))continue;const g=algilanan(m,p,q);if(!g||(g.x*d>o.ofs+0.3&&g.x*d>u))continue;
      const t=varisSuresi(g,zx,zw,0.8);if(t<enT){enT=t;en=q;eg=g;}}
    if(en&&enT<3)ekle(en,eg,zx,zw,'hava',yay,hy,havaSure(hyp(zx-o.ox,zw-o.oz),yay),yay);}
  for(const c of C){
    const A2=pasAnaliz(m,p,c.hx,c.hz,c.tip,c.g,{ox:o.ox,oz:o.oz,T:c.T,yay:c.yay,hy:c.hy,varislar:c.tur==='alcak'?varisAdaylari(hyp(c.hx-o.ox,c.hz-o.oz),'orta'):null,baski:o.baski});
    /* ortacının önündeki rakip bacağı ortayı kesebilir — T5 (2026-10-09): motorla aynı saf işlev (ortaBlokTahmin, js/mac-mudahale.js); ilk hız
       uçuş süresinden (havadan: yatay L/T, dikey (hy + gT²/2)/T; yerden 18 m/sn), yön belirsizliği 0,25 m */
    const L=hyp(c.hx-o.ox,c.hz-o.oz)||1,ux=(c.hx-o.ox)/L,uz=(c.hz-o.oz)/L,Tu=c.tip==='hava'&&c.T>0?c.T:0,vh=Tu?L/Tu:18,vy0=Tu?((c.hy||0)+0.5*G*Tu*Tu)/Tu:0;
    const acik=ortaBlokTahmin(m,p.team,o.ox,o.oz,0.11,ux*vh,uz*vh,vy0,0.25).acik;
    const tu=c.hx*d,parca=c.tip==='hava'?(c.hy>1.3?'kafa':'vole'):'ayak';
    const bec=parca==='kafa'?0.6+0.8*c.q.oz.kafa:parca==='vole'?0.7+0.6*c.q.oz.sut:0.8+0.4*c.q.oz.sut;
    const sans=xG(tu,c.hz,parca,A2.baskiK)*bec;
    /* isabet: ortanın hücumcudan 2,5 m'den fazla sapmaması (yön hatası vurusHatasi ile aynı ölçekte; baskı altında orta kötüleşir) */
    const sdO=(0.028+0.075*(1-p.oz.pas))*(1+o.baski*0.9)*(c.tip==='hava'?1.6:1)*(1+0.35*(p.yorgunluk||0)),Pis=2*normalDagilim(2.5/Math.max(0.1,sdO*L))-1;
    const kal=c.tip==='hava'&&gk.oyunda?kaleciHavaTahmin(m,gk,c.hx,c.hz,c.hy,c.T).P:0,Pg=A2.P*(1-kal)*acik*Pis;
    if(Pg<0.1)continue;   /* umutsuz orta düşünülmez */
    const U=(Pg*(sans*100+0.8)-(1-Pg)*pasKaybi(m,p,c.hx,c.hz)*0.5*takim.risk)*A.ortaIstegi;
    S.push({tur:c.tur==='geri'?'geriCevir':'orta',alici:c.q,hx:c.hx,hz:c.hz,tip:c.tip,yay:c.yay,hy:c.hy,T:c.tip==='hava'?A2.T:null,varis:A2.varis,
      mod:c.tip==='hava'?null:'ayak',deger:U,P:Pg,Pk:A2.Pk,sure:A2.sure,L:A2.L,ortaTuru:c.tur});}
}
/* korner: kafa vuranların ve koşuların noktası ya da bölge (ön direk, penaltı noktası); değer = xG(kafa) × kafa becerisi × P(ulaşır) × (1 − kaleci) */
function kornerSecenekleri(m,p,ox,oz){
  const d=m.dir[p.team],yan=Math.sign(oz-MZ)||1,gk=m.kaleci(1-p.team),S=[];
  const deg=(q,hx,hz,hy)=>{const L=hyp(hx-ox,hz-oz),T=havaSure(L,'korner'),A2=pasAnaliz(m,p,hx,hz,'hava',q,{ox,oz,T,hy,baski:0});
    const kal=gk.oyunda?kaleciHavaTahmin(m,gk,hx,hz,hy,T).P:0,sans=xG(hx*d,hz,'kafa',A2.baskiK)*(0.5+q.oz.kafa);
    S.push({q,hx,hz,hy,T,deger:A2.P*(1-kal)*(sans*100+0.8)});};
  for(const q of m.teams[p.team]){if(q===p||!q.oyunda||q.rol==='GK')continue;const qu=q.x*d;if(qu<PL-15||Math.abs(q.z-MZ)>10)continue;
    deg(q,d*clamp((q.x+q.vx*0.5)*d,PL-12,PL-3),clamp(q.z+q.vz*0.5,MZ-8,MZ+8),1.8);}
  for(const [zu,zw] of[[PL-5.5,MZ+yan*1.5],[PL-11,MZ]]){let en=null,enT=99;
    for(const q of m.teams[p.team]){if(q===p||!q.oyunda||q.rol==='GK')continue;const t=varisSuresi(q,d*zu,zw,0.8);if(t<enT){enT=t;en=q;}}
    if(en)deg(en,d*zu,zw,1.75);}
  return S;}

/* ---- şut planı (MM3): ~8 hedef × tür. P(gol) = P(çerçeve: hatanın normal dağılımı kalenin içinde) × (1 − kaleciTahmin) × (1 − blok) ---- */
const SUT_Z=[-3.4,-3.0,3.0,3.4],SUT_Y=[0.35,1.75];
/* atış hattındaki savunmacı bloklayabilir (aşırtma ve düşen top ilk metrelerden sonra üstünden geçer, falso hattı biraz kaçırır) */
function sutBlokOlasiligi(m,p,ox,oz,tx,tz,tur){
  const Lk=hyp(tx-ox,tz-oz)||1;let acik=1;
  for(const o of rakipler(m,p.team)){if(!o.oyunda||o.rol==='GK')continue;const on=((o.x-ox)*(tx-ox)+(o.z-oz)*(tz-oz))/Lk;if(on<0.5||on>Math.min(14,Lk-1))continue;
    if(tur==='asirtma'&&on>4)continue;
    const yan=segD(o.x,o.z,ox,oz,tx,tz);if(yan<1.3)acik*=1-(tur==='falso'?0.45:tur==='dusen'&&on>4?0.3:0.6)*(1-yan/1.3);}
  return 1-acik;}
/* sd: temel yön hatası (rad). o: {serbest}. Seçim sıcaklıklıdır: kararlı şutçu en iyi hedefi daha tutarlı seçer */
function sutPlani(m,p,ox,oz,sd,o){
  o=o||{};const d=m.dir[p.team],gx=d*PL,gk=m.kaleci(1-p.team),L=Math.max(1,hyp(gx-ox,MZ-oz)),s=p.oz.sut,onde=gk.oyunda?Math.abs(gk.x-gx):0;
  const turler=o.serbest?['falso','dusen']:onde>5&&L>11?['plase','sert','falso','asirtma']:L>14?['plase','sert','falso']:['plase','sert'];
  const Ls=[],sapma=Math.max(0,L-18)*0.01;let en=0;
  for(const tur of turler){
    const v=tur==='plase'?(L<11?15:18)+5*s:tur==='sert'?25+6*s:tur==='falso'?20+5*s:tur==='dusen'?21+3*s:13+3*s;
    const kz=tur==='plase'?0.9:tur==='sert'?1.2:tur==='falso'?1.0:tur==='dusen'?1.05:0.9,ky=tur==='sert'?1.25:tur==='asirtma'?0.7:0.85;
    for(const zt of SUT_Z)for(const y0 of(tur==='asirtma'?[2.0]:tur==='dusen'?[1.9]:SUT_Y)){
      if(tur==='asirtma'&&Math.abs(zt)>2.6)continue;
      const yt=y0+sapma,sz=Math.max(0.05,sd*kz*L),sy=Math.max(0.05,sd*ky*L*0.35);
      const Pon=(normalDagilim((GW2-0.12-zt)/sz)-normalDagilim((-GW2+0.12-zt)/sz))*normalDagilim((GH-0.12-yt)/sy);
      const T=L/v*1.06*(tur==='falso'?1.08:1);
      const Ps=gk.oyunda?kaleciTahmin(m,gk,MZ+zt,y0,T).P*(tur==='asirtma'?0.3:1):0;
      const Pg=Pon*(1-Ps)*(1-sutBlokOlasiligi(m,p,ox,oz,gx,MZ+zt,tur));
      Ls.push({tur,zt,yt:y0,v,kz,ky,Pg});if(Pg>en)en=Pg;}}
  const tau=0.012+0.035*(1-p.oz.karar);let top=0;
  for(const c of Ls){c.a=Math.exp((c.Pg-en)/tau);top+=c.a;}
  let r=m.rast()*top;for(const c of Ls){r-=c.a;if(r<=0)return c;}
  return Ls[Ls.length-1];}

/* şut seçeneği: iyi pozisyonda istekle; uzaktan ancak iyi şutçu ve önü boşsa. Atış hattındaki savunmacı bloklayabilir */
function sutSecenegi(m,p,x0,z0,baski){
  const d=m.dir[p.team],u=x0*d;if(u<=PL-38)return null;
  const gx=d*PL,Lk=hyp(gx-x0,MZ-z0),oz=p.oz;let x=xG(u,z0,'ayak',baski*0.4)*(1-sutBlokOlasiligi(m,p,x0,z0,gx,MZ,'sert'));
  /* şut isteği iyi pozisyonda tam, uzaklaştıkça azalır: 14 m'ye kadar tam, 22 m'de yalnız şutun kendi değeri, daha uzakta isteksiz.
     T3: uzaktan vurma eğilimi 14 m'den sonra isteği ±%60 değiştirir (kararVer'de ayrıca eğilim puanı); uzak şutun kapısı eğilimle de açılır */
  const uv=profilEgilim(p,'uzaktanVurur');
  const istek=(Lk<22?1+(MOTOR_AYAR.sutIstegi-1)*clamp((22-Lk)/8,0,1):1-clamp((Lk-22)/14,0,0.5))*(1+0.6*uv*clamp((Lk-14)/8,0,1));
  if(x>=0.017)return{tur:'sut',deger:x*100*(0.85+oz.sut*0.3)*istek-(1-x)*0.4,xg:x};
  if(x>=0.008&&(oz.sut>0.5||uv>0.3)&&baski<0.6)return{tur:'sut',deger:x*100*(0.85+oz.sut*0.3)*(0.5+0.5*istek)-(1-x)*0.4,xg:x};
  return null;}
/* ---- seçenekler ---- */
/* bütün değerler aynı ölçüdedir: gol olasılığı × 100 ("puan"). Pas = başarı × hedefin tehdidi − kayıp × rakibin oradaki tehdidi */
function secenekler(m,p){return gozlemle(p,()=>secenekler0(m,p));}
function secenekler0(m,p){
  const b=m.ball,d=m.dir[p.team],u=b.x*d,w=b.z,oz=p.oz,S=[];
  const baski=baskiAltinda(m,p);
  /* ofsayt çizgisini oyuncu hatasız göremez: görüşü düşük olan daha çok yanılır */
  const ofs=ofsaytCizgisi(m,p.team)+m.normal()*MOTOR_AYAR.ofsaytAlgi*(1.2-oz.gorus);
  /* dolaylı serbest vuruşu kullanan doğrudan kaleye vurmaz (başkası dokunmadan gol olmaz) */
  if(!(b.endirekt&&b.endirekt.p===p)){const s=sutSecenegi(m,p,b.x,b.z,baski);if(s)S.push(s);}
  /* paslar. t0 = 0: top hemen çıkıyor sayılır. T4-V'de vuruşa kalan süre (vurusSureleri) denendi ve geri alındı: t0 = hazırlık + geri 40 maçta
     vazgeçmeyi 2,6 → 8/maça (yakinP cezası t0 < 0,05 ile kapanıyordu), yalnız t0 = geri ise pası 108 → 96'ya, sahiplik başına pası 2,17 → 1,75'e
     düşürdü (kesilme modeli rakibin tepki gecikmesini bilmez, uzayan süre her hattı kapalı gösterir); karar modelinin bu kısmı T7'de ele alınır */
  /* T7c (§7.10): t0 = vuruşa kalan süre (hazırlık + geri salınım; vurusSureleri), kesilme modeli rakibin saatini de vuruştan başlatır */
  const vs=MOTOR_AYAR.pasT0?vurusSureleri('pas',baski):null;
  for(const s of pasSecenekleri(m,p,{ox:b.x,oz:b.z,t0:vs?vs.haz+vs.geri:0,ilk:false,baski,ofs}))S.push(s);
  /* orta ve geri çevirme: kanatta, son üçte birde */
  if(u>PL-30&&Math.abs(w-MZ)>8)ortaSecenekleri(m,p,{ox:b.x,oz:b.z,baski,ofs},S);
  /* T2: taşıma (8 yön × 5/10 m; eskiden 5 yön × 6 m, boş alanda bile başarı 0,6 + 0,35·sürüş ve değer buranın tehdidi + 2,5 ile sınırlıydı) */
  tasimaSecenekleri(m,p,S);
  /* T4: rakibi geç (bire bir) */
  birebirSecenegi(m,p,S);
  /* uzaklaştırma: kendi bölgesinde baskı altında; kaleye yaklaştıkça ve baskı arttıkça daha cazip (birleştirme 2026-10-03: alt ligde sık,
     çoğu zaman taça ya da hava mücadelesine gider) */
  if(u<-PL+30&&baski>0.3)S.push({tur:'uzaklastir',deger:MOTOR_AYAR.uzaklastirDeger+baski*1.1+(u<-PL+18?0.4:0)});
  /* T2: bekleme ya da gövdeyle koruma (eskiden yalnız koru: değeri her zaman eksiydi) */
  bekleSecenegi(m,p,S);koruSecenegi(m,p,S);
  return S;
}
/* sabır eşiği (T2, puan): topu tutmanın (taşıma, bekleme) pasa göre ek değeri. Takımın sakin ve tempo ayarından 0,1–0,6; oyuncunun önü açıksa
   tam, baskıda azalır (rakip dibindeyken topu tutmak sabır değil risktir); topu tuttukça söner (sabirSure sn'de sıfır: sabır, bitmeyen bekleyiş
   değildir; savunma bu arada yerleşir). t1: oyuncunun baskı süresi, tutT: bu sahiplikte topu tuttuğu süre */
function sabirEsigi(m,p,t1,tutT){const A=MOTOR_AYAR,tk=m.taktik[p.team],u=m.ball.x*m.dir[p.team];
  /* son üçte birde sabır azalır: oyun kurarken sabır, bitirirken tempo (kaleye 42 m'den uzakta tam, ceza sahası çizgisinde %20) */
  const bolge=clamp((PL-16-u)/26,0.2,1);
  /* T3: oyuncunun eğilimi — topu tutan sabırlı, tek vuruş oynayan sabırsız (×0,4–1,6) */
  const eg=clamp(1+0.35*profilEgilim(p,'topuTutar')-0.25*profilEgilim(p,'tekVurus'),0.4,1.6);
  return(A.sabir[0]+(A.sabir[1]-A.sabir[0])*(0.6*tk.sakin+0.4*(1-tk.tempo)))*(0.3+0.7*acikOran(t1))*clamp(1-(tutT||0)/A.sabirSure,0,1)*bolge*eg;}
/* seçim (T2): her seçeneğin değerine kişisel bir sapma eklenir (Gumbel; ölçeği T3'ten beri profilin tutarlılığından: 0,1 + 0,5·(1 − tutarlılık),
   eskiden 0,12 + 0,42·(1 − karar)) ve en büyüğü seçilir. Sapma bir sahiplik boyunca aynı kalır (topu tutma, şut, uzaklaştırma ve alıcı başına):
   oyuncu her düşünme anında (5–8 Hz) yeniden zar atmaz, kararı tutarlıdır; taşırken durum değişince karar değişir. Taşıma ve beklemeye sabır
   eşiği eklenir. T3: her seçeneğe oyuncunun eğilim puanı eklenir (profilEgilimPuani, js/mac-profil.js); çekiliş sayısı ve sırası değişmez */
function kararVer(m,p){return gozlemle(p,()=>kararVer0(m,p));}
function kararVer0(m,p){
  const S=secenekler(m,p);if(!S.length)return{tur:'bekle'};
  const v=m.bVeri(p),b=m.ball;if(!v.gur||v.gur.no!==m.sahiplikNo)v.gur={no:m.sahiplikNo,M:new Map(),t0:m.t};
  const G=v.gur.M,tau=0.1+0.5*(1-profilAlt(p,'tutarlilik',0.5+0.4*p.oz.karar)),esik=sabirEsigi(m,p,baskiSuresi(m,p.team,b.x,b.z,0).t1,m.t-v.gur.t0);
  let en=S[0],enP=-1e9;
  for(const s of S){const k=s.tur==='tasi'||s.tur==='bekle'||s.tur==='koru'?'tut':s.alici?(s.tur==='orta'||s.tur==='geriCevir'?'o':'p')+s.alici.n:s.tur;
    let g=G.get(k);if(g===undefined){const r=Math.max(1e-12,m.rast());g=-Math.log(-Math.log(r))*tau;G.set(k,g);}
    const puan=s.deger+g+profilEgilimPuani(m,p,s)+(k==='tut'?esik:0);if(puan>enP){enP=puan;en=s;}}
  /* T7c (Ek H 6): en iyi pasın hedefi — taşırken gövde ona açılır (mac-hareket.js surusIlerle) */
  if(MOTOR_AYAR.govdeAc){let bp=null;for(const s of S)if(s.alici&&(!bp||s.deger>bp.deger))bp=s;v.enPas=bp?{hx:bp.hx,hz:bp.hz,t:m.t}:null;}
  return en;
}
/* ---- gelişine tek vuruş (MM3): top gelirken alıcı tek vuruşla pası (geri, bırakma, ara) kontrol edip oynamakla (+~0,5 sn, daha çok baskı)
   karşılaştırır. k: karşılama noktası {x,z,t}, s: topun o anki durumu (topTahmin). Dönüş: {sec: tek vuruş seçimi ya da null, hedef: kontrol
   sonrası en iyi pasın hedefi (yönlü ilk dokunuş için)} */
function tekVurusKarari(m,p,k,s,yakin){return gozlemle(p,()=>tekVurusKarari0(m,p,k,s,yakin));}
function tekVurusKarari0(m,p,k,s,yakin){
  const b=m.ball,d=m.dir[p.team],gelA=Math.atan2(b.vz,b.vx);
  let dd=99;for(const o of rakipler(m,p.team))if(o.oyunda)dd=Math.min(dd,hyp(o.x-k.x,o.z-k.z)-o.maxSpd*k.t*0.6);
  const baski=clamp((4.5-dd)/3.5,0,1),ofs=ofsaytCizgisi(m,p.team)+m.normal()*MOTOR_AYAR.ofsaytAlgi*(1.2-p.oz.gorus);
  const ktr=pasSecenekleri(m,p,{ox:k.x,oz:k.z,t0:k.t+0.45,ilk:false,baski:Math.min(1,baski+0.15),ofs});
  let en2=null;for(const c of ktr)if(!en2||c.deger>en2.deger)en2=c;
  const Pk=kontrolOlasiligi(p,s.v||hyp(b.vx,b.vz),s.y,baski,0.8),kay=pasKaybi(m,p,k.x,k.z);
  /* kontrol sonrası: en iyi pas, şut ya da topu tutmak (T2: oranın devam değeri ve sabır eşiği; eskiden buranın tehdidi − baskı) */
  const tut=devamDegeri(m,p,k.x,k.z,k.t+0.45,gelA+Math.PI)+sabirEsigi(m,p,baskiSuresi(m,p.team,k.x,k.z,k.t).t1),sut=sutSecenegi(m,p,k.x,k.z,Math.min(1,baski+0.15));
  const U2=Math.max(en2?en2.deger:-9,tut,sut?sut.deger:-9)*(0.9+0.1*Pk)-(1-Pk)*kay*0.4;
  const hedef=en2&&en2.deger>tut&&!(sut&&sut.deger>en2.deger)?{x:en2.hx,z:en2.hz}:null;
  /* tek vuruş yalnız top ayağına (yerden ya da yarım yükseklikte) gelirken ve karşılama noktasına yakınken; koşarak yetişilen ya da havadan
     inen topu önce kontrol eder */
  if(p.rol==='GK'||s.y>0.45||!yakin)return{sec:null,hedef};
  const ilk=pasSecenekleri(m,p,{ox:k.x,oz:k.z,t0:k.t,ilk:true,gelA,sinirA:0.6+0.35*p.oz.pas,baski,ofs,vole:s.y>0.15});
  let en1=null;for(const c of ilk)if(!en1||c.deger>en1.deger)en1=c;
  if(!en1)return{sec:null,hedef};
  /* tek vuruşun kendi riski: top ayağa tam gelmeyebilir */
  const U1=en1.deger*0.92;
  /* T3: tek vuruş eğilimi (±0,5·egilimGuc puan) gelişine oynamayı kolaylaştırır ya da zorlaştırır */
  const tau=0.12+0.42*(1-p.oz.karar),P1=1/(1+Math.exp((U2-U1-MOTOR_AYAR.tekVurus-0.5*MOTOR_AYAR.egilimGuc*profilEgilim(p,'tekVurus'))/tau));
  if(m.rast()>=P1)return{sec:null,hedef};
  return{sec:{tur:en1.tur,hx:en1.hx,hz:en1.hz,tip:en1.tip,alici:en1.alici,varisHizi:en1.varis,mod:en1.mod,ex:en1.ex,ez:en1.ez,es:en1.es,
    guncelle:true,ilk:true,tekDokunus:true,P:en1.P,Pk:en1.Pk,alt:en1.alt},hedef};   /* P, Pk, alt salt okunur (ölçüm) */
}
/* ---- kafa: ceza sahasında kaleye, geride uzaklaştırma, ileride arkadaşa indirme ya da koşana uzatma ---- */
function kafaKarari(m,p){
  const b=m.ball,d=m.dir[p.team],u=b.x*d,w=b.z,baski=baskiAltinda(m,p);
  if(u>PL-14&&Math.abs(w-MZ)<12){const x=xG(u,w,'kafa',baski*0.5);
    if(x>0.03||u>PL-7){
      /* hedef: köşeler ve yükseklik; kaleciTahmin ile en açık yer (sıcaklıklı) */
      const gk=m.kaleci(1-p.team),hx=d*PL,v=9+p.oz.kafa*5,sig=(0.05+0.1*(1-p.oz.kafa))*(1+baski*0.5);
      let top=0,en=0;const Ls=[];
      for(const zt of[-3.0,-2.0,2.0,3.0])for(const yt of[0.3,1.7]){const L=hyp(hx-b.x,MZ+zt-b.z),sz=Math.max(0.05,sig*L),sy=Math.max(0.05,sig*6*L/v);
        const Pon=(normalDagilim((GW2-0.12-zt)/sz)-normalDagilim((-GW2+0.12-zt)/sz))*normalDagilim((GH-0.12-yt)/sy);
        const Pg=Pon*(1-(gk.oyunda?kaleciTahmin(m,gk,MZ+zt,yt,L/v).P:0));Ls.push({zt,yt,Pg});if(Pg>en)en=Pg;}
      for(const c of Ls){c.a=Math.exp((c.Pg-en)/0.03);top+=c.a;}
      let r=m.rast()*top,c=Ls[Ls.length-1];for(const c2 of Ls){r-=c2.a;if(r<=0){c=c2;break;}}
      const hz=MZ+c.zt,L=hyp(hx-b.x,hz-b.z),T=L/v,hy=c.yt;
      return{tur:'sut',hx,hz,v,vy:(hy-b.y+0.5*G*T*T)/T,xg:x,hy};}}
  /* baskı altındaki savunmacının kafası güvenliğe, gerekirse taça gider (birleştirme 2026-10-03) */
  if(u<-PL+30||(p.rol==='DEF'&&u<5)||baski>0.7){const yan=w<MZ?-1:1,ds=baski>0.45,hx=b.x+d*(16+m.rast()*12),hz=clamp(b.z+yan*(4+m.rast()*12),ds?-3:3,ds?PW+3:PW-3);
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
  return x2>esik&&m.rast()<0.5+x2*4?{tur:'sut',hx:d*PL,hz:MZ,xg:x2,ilk:true,tekDokunus:true}:null;
}
