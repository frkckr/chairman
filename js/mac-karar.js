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
  if(u>PL-24){const k=clamp((u-(PL-24))/20,0,1)*clamp((Math.abs(w-MZ)-6)/12,0,1),XK=MOTOR_AYAR.xtKanat;t=Math.max(t,XK[0]+XK[1]*k);}   /* T12c: kanat değeri MOTOR_AYAR.xtKanat */
  return t;}
/* ---- zaman modelleri ---- */
/* bir oyuncunun bir noktaya varış süresi: tepki + dönüş + mesafe/hız */
/* (varisZamani yön cezasında kayan nokta yüzünden nadiren NaN verebilir: o durumda düz koşu süresi) */
function varisSuresi(o,x,z,menzil){const t=varisZamani(o,x,z,menzil,0.22);return t===t?t:0.22+Math.max(0,hyp(x-o.x,z-o.z)-(menzil||0))/(o.maxSpd*0.95);}
/* ---- ortak pas planı (MM3): karar, hedef tazeleme ve vuruş aynı hızı ve uçuşu kullanır ----
   yerden: istenen varış hızından ilk hız ve süre. Havadan: uçuş süresi yaya göre (düz havadan pas, aşırtma, orta kesme/asma, korner) */
/* Z2b (sahne&2): kornerHizli — kornerin uçuşu 1,2–2,0 sn (kutuphane/F F.8.1 K5; eski 'korner' 34 m'de 2,3 sn), alcak — alçak sert içe dönen (~1,4 sn) */
function havaSure(L,yay){return yay==='asirtma'?0.95+L/22:yay==='asma'?1.05+L/30:yay==='kesme'?0.72+L/40:yay==='korner'?1.15+L/30:yay==='kornerHizli'?0.85+L/30:yay==='alcak'?0.55+L/38:0.75+L/28;}
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
/* f'yi p gözlemciyken çalıştırır (iç içe güvenli; karar giriş noktaları kapanış yaratmamak için aynı kalıbı doğrudan kullanır) */
function gozlemle(p,f){const e=GOZ.p;GOZ.p=p;try{return f();}finally{GOZ.p=e;}}
/* T7c'de (§7.10) rakibin ve alıcının saatini vuruştan başlatan kesilme modeli (pasT0, pasOku, pasOkuAlici; pasOkuma, rakipSuzul) denendi,
   iyimser çıktı ve kapalı kaldı; 2026-10-10 bakımında kaldırıldı (gerçekçilik planı §7 madde 10; kod tur/t7 etiketinde). Rakibin saati karar
   anından başlar (varisSuresi, 0,22 sn tepki). */

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
  /* T10a (yalnız açık oyunda havadan orta, o.orta — uzun top ve kornerde maç içi kalibrasyon zaten tutuyordu; genellemesi 40 maçta uzun pası
     %14 → 18'e çıkardı, pas isabetini 8 puan düşürdü, korner verimini bozdu): alıcı topu başıyla karşılar (kafa erişimi ~1 m; ayakta 0,6) ve inişe
     koşu içinde gelir — aliciPay'in duran/dönen oyuncu payı eklenmez (c-orta: alıcının inişe yetişmesi tahmini %70'te kalıyordu) */
  const hvO=tip==='hava'&&!!o.orta;
  if(alici){const ek=hvO?0:MOTOR_AYAR.aliciPay,mz=hvO?1.0:0.6;for(let i=0;i<N;i++)PA_TA[i]=varisSuresi(alici,PA_X[i],PA_Z[i],mz)+ek;}
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
    /* T7c: vuruşa t0 kalırken pasörün dibindeki rakibin o anki yeri (şimdiki hızıyla) */
    let yakinP=0;if(tip==='yer'&&t0<0.05){const yk=segD(op.x+op.vx*t0,op.z+op.vz*t0,ox,oz,ox+ux*Math.min(4,L),oz+uz*Math.min(4,L));if(yk<1.0)yakinP=0.85-yk*0.35;}
    for(let i=0;i<N;i++){const kc=kaleci&&kaleCeza(m,op,PA_X[i],PA_Z[i]);PA_KC[i]=kc?1:0;PA_TO[i]=varisSuresi(op,PA_X[i],PA_Z[i],kc?1.1:0.75);}
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
        /* T6d: ikisi de inişteyse düello tahmini (havaDuelloTahmin, js/mac-hava.js; eskiden sabit 0,35), yalnız rakip oradaysa 0,85 */
        /* T10a: düelloda varış hızı (inişe uzaklık / uçuş süresi): koşarak gelen koşarak sıçrar (yürütmeyle aynı) */
        /* T10a (yalnız ortada, hvO): alıcı havadan topa koşusunu inişe göre ayarlar (topa nişan alınan odur): yetişme payı 0,25 sn geniş (tam zamanında varan %88, eskiden
           %73); varış hızı en az şimdiki hızı (koşudaki alıcı koşarak sıçrar) */
        else if(tip==='hava'){const dP=sigma((tb+0.25-to)/0.25),rP=sigma((tb+(hvO?0.5:0.25)-tr[k])/0.25),Tu=Math.max(0.3,tb-t0);
          const va=hvO&&alici?Math.max(hyp(alici.vx||0,alici.vz||0),hyp(alici.x-PA_X[i],alici.z-PA_Z[i])/Tu):0,vd=hvO?Math.max(hyp(op.vx||0,op.vz||0),hyp(op.x-PA_X[i],op.z-PA_Z[i])/Tu):0;
          const Pd=alici?1-havaDuelloTahmin(m,alici,op,PA_H[i],va,vd):0.5;pr=dP*((1-rP)*0.85+rP*Pd);
          if(o.iz)(o.iz.L||(o.iz.L=[])).push({gk:kaleci,dP,rP,Pd,pr});}
        else pr=(o.orta&&MOTOR_AYAR.yerdenOrtaKesme!=null?MOTOR_AYAR.yerdenOrtaKesme:0.7)*sigma((Math.min(tr[k],tb+0.3)-to-0.05)/0.16);   /* T17d: yerden orta ve geri çevirmede tavan yerdenOrtaKesme */
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
    /* T6d: havadan pasta alıcı inişte orada olmalı (top seker, sürer; yerden pasta olduğu gibi koşup yetişemez): geç kalma cezası sert */
    let al=1;if(alici){const gec=tr[k]-PA_TB[k*N+N-1];if(gec>0.05)al=tip==='hava'?clamp(1-gec*2.5,0.02,1):clamp(1-gec*0.9,0.25,1);}
    if(o.iz&&tip==='hava')Object.assign(o.iz,{kalma:kalma[k],al,kalab:kalab[k],enIyi:enIyiH[k],gec:alici?tr[k]-PA_TB[k*N+N-1]:0});
    const r=ir[k],va=tip==='yer'?yerHiz(v0[k],L*(r+1)/N,R):hyp(L/T,G*T*0.3),ya=tip==='yer'?0:0.45;
    const bs=clamp((0.8-marj[k])/1.2,0,1),pk=alici&&alici.oz?kontrolOlasiligi(alici,va,ya,bs,Math.abs(aciFark(gelA,hucA))):1;
    const s=kalma[k]*al*(0.55+0.45*pk);if(s>enS){enS=s;enK=k;Pk=pk;bk=bs;Pt=kalma[k]*al;}}
  const teknik=1-(0.01+L/420*(1.25-oz2.pas)+baski*0.05+(tip==='hava'?0.05:0))*(o.ilk?1.35:1)*(o.vole?1.5:1);
  /* T2 (pas kalibrasyonu): vuruş hatası. Yön ve uzunluk hatası vurusHatasi ölçeğinde (pas becerisi, baskı, gelişine/vole, yorgunluk, mesafe;
     havadan ×1,6); alıcının en yakın rakipten önce varma payı (marj) ne kadar büyükse o kadar sapma affedilir: dar pencereli ara pası ve uzun top
     sapmaya duyarlıdır, boştaki arkadaşa kısa pas değildir */
  /* T9b-a: mesafe çarpanı (1 + L/200) yerine vuruşun gücü (vurusSapma ile aynı; gucHataCarpani, pasGucu) */
  const PT=MOTOR_AYAR.pasTol,sd0=(0.028+0.075*(1-oz2.pas))*(1+baski*0.9)*(o.ilk?1.35:1)*(o.vole?1.5:1)*(1+0.35*(p.yorgunluk||0))
    *gucHataCarpani(pasGucu(tip,v0[enK],L,T),VURUS_GUC_REF.pas)*MOTOR_AYAR.pasSapma*(tip==='hava'?1.6:1)*(o.ayakK||1);   /* T14c: ortada zayıf ayağın beklenen payı (vurusAyakK) */
  /* T10a (yalnız ortada, hvO): havadan topta tolerans en az pasTolHava — isabet topun indiği bölgeye göredir (c-orta: hedeften 5 m'ye kadar sapma ilk temas payını
     değiştirmiyor; kalabalıkta marj ~0 iken 1,2 m'lik tolerans ortanın tahminini 5 kat kötümser yapıyordu) */
  const tol=Math.max(PT[0]+PT[1]*Math.max(0,marj[enK]),hvO?MOTOR_AYAR.pasTolHava:0),Pex=(2*normalDagilim(tol/Math.max(0.05,sd0*L))-1)*(2*normalDagilim(tol/Math.max(0.05,sd0*(tip==='hava'?1.3:1+L/40)*L*PT[2]))-1);
  return{P:clamp(Pt*teknik*Pex,0.02,0.99),Pk,baskiK:bk,sure:sure[enK],v0:v0[enK],varis:V[enK],T:tip==='yer'?PA_TB[enK*N+N-1]-t0:T,L,marj:marj[enK],Pex,Pt,teknik};}
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
function araNoktasi(m,g,ox,oz,t0,varis,ofs,d){
  const qh=hyp(g.vx,g.vz);let rx,rz;
  if(qh>2&&g.vx*d>0.4){rx=g.vx/qh;rz=g.vz/qh;}else{rx=d;rz=clamp((MZ-g.z)*0.015,-0.4,0.4);const n=hyp(rx,rz);rx/=n;rz/=n;}
  const RK=rakipler(m,g.team);
  let en=null;
  for(let s=2;s<=22;s+=2){
    const x=g.x+rx*s,z=g.z+rz*s;if(x*d>PL-3||z<2||z>PW-2)break;
    if(x*d<ofs-0.5)continue;
    const tq=varisZamani(g,x,z,0.5,0.05),L=hyp(x-ox,z-oz);
    const tb=t0+yerSure(Math.min(29,yerIlkHiz(L,varis||pasVarisHizi(L)+2,m.R)),L,m.R);
    if(tq>tb+0.35)continue;
    let td=99;for(const o of RK){if(!o.oyunda)continue;const kc=o.rol==='GK'&&kaleCeza(m,o,x,z);td=Math.min(td,varisZamani(o,x,z,kc?1.1:0.75,0.2));}
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
    const P=Math.exp(-1.2*kapali),U=P*(xT(ru,rz)*100+(ru-u)*A.ilerleme*m.taktik[q.team].ilerle)-(1-P)*pasKaybi(m,q,(x+rx)/2,(z+rz)/2);if(U>en)en=U;}
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
  /* (hız: blok ancak blokuz şut değeri en iyiyi geçiyorsa hesaplanır — sonuç aynı) */
  if(u>PL-30){const sv=xG(u,z,'ayak',1-acik)*100*(0.85+q.oz.sut*0.3);if(sv>en)en=Math.max(en,sv*(1-sutBlokOlasiligi(m,q,x,z,d*PL,MZ,'sert')));}
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
  /* T14c (2026-10-14; gerçekçilik planı §4 T14): kanattaki alıcının orta devamı — son 35 m'de ve kanatta (|z − orta| > 12) top çizgiye
     taşınıp ortalanabilir. Değer = taşımanın serbestliği (açıklık, yüz) × ortanın ucuz tahmini: ilk temas olasılığı ceza sahası önündeki (kaleye
     18 m, ortaya 12 m) hücumcu (1 sn önünü okuyarak) ve savunmacı sayısından 0,08 + 0,09·hücumcu − 0,025·savunmacı (0,02–0,45; maç içi ortalama
     ~0,22, T14c'nin kalibre ortasıyla aynı), şansı penaltı noktasının önünden kafa — × ortaIstegi × devamOrta. Önceden kanattaki alıcının devamı
     oranın tehdidi, taşıma ve bire birdi; orta yoktu (kanada pas %12) */
  if(A.devamOrta>0&&u>PL-35&&Math.abs(z-MZ)>12&&sirt<0.7){let na=0,nd=0;
    for(const r of m.teams[q.team]){if(r===q||!r.oyunda||r.rol==='GK')continue;if((r.x+r.vx)*d>PL-18&&Math.abs(r.z+r.vz-MZ)<12)na++;}
    for(const r of rakipler(m,q.team)){if(!r.oyunda||r.rol==='GK')continue;if(r.x*d>PL-18&&Math.abs(r.z-MZ)<12)nd++;}
    const Pg=clamp(0.08+0.09*na-0.025*nd,0.02,0.45),v=acik*(1-0.6*sirt)*(Pg*(xG(PL-8,MZ,'kafa',0.3)*100+0.8)-(1-Pg)*0.4)*A.ortaIstegi*A.devamOrta;
    if(v>en)en=v;
    /* T17d (cizgiyeIn): çizgiye yakın (son 22 m) ve çizgi açıkken geri çevirme devamı — yay ve penaltı noktası önündeki (kaleye 7–21 m, ortaya 12 m) arkadaşa yerden
       geri pas; ilk temas olasılığı oradaki hücumcu ve savunmacı sayısından (T17-0: markajlı alımda %50, boşta %76), şansı penaltı noktası önünden ayakla vuruş */
    if(A.cizgiyeIn>0&&u>PL-22){let na2=0,nd2=0;
      for(const r of m.teams[q.team]){if(r===q||!r.oyunda||r.rol==='GK')continue;const ru=(r.x+r.vx)*d;if(ru>PL-21&&ru<PL-7&&Math.abs(r.z+r.vz-MZ)<12)na2++;}
      for(const r of rakipler(m,q.team)){if(!r.oyunda||r.rol==='GK')continue;const ru=r.x*d;if(ru>PL-21&&ru<PL-7&&Math.abs(r.z-MZ)<12)nd2++;}
      if(na2>0){const Pg2=clamp(0.12+0.12*na2-0.04*nd2,0.03,0.5),v2=acik*(1-0.6*sirt)*(Pg2*(xG(PL-12,MZ,'ayak',0.3)*100+0.8)-(1-Pg2)*0.4)*A.ortaIstegi*A.cizgiyeIn;
        if(v2>en)en=v2;}}}
  /* ön puan tam analizden iyimserdir (alıcının baskısı, vuruş hatası yok): devamPas kadar sayılır */
  const ip=ileriPasOnPuani(m,q,x,z,0);if(ip>-9)en=Math.max(en,ip*A.devamPas*(1-0.7*sirt));
  const g=clamp(0.62+0.38*acik-0.15*iki,0.4,1);
  return en*g-(1-g)*pasKaybi(m,q,x,z)*0.6;}
/* taşıma: 8 yön × 5 ve 10 m (dönmesi gereken yönde 2,5 m de). Başarı: yol üzerindeki noktalara (2,5 m'de bir) rakiplerin varış süresi ile
   taşıyanınki (dönüş + ivmelenme + mesafe/hız); her rakip için en kötü noktadan sigmoid, ulaşan rakip topu her zaman almaz (×0,7).
   Boş alanda ~0,97. Değer: yeni yerdeki devam değeri (yüzü taşıma yönünde) − kayıp */
const TS_N=4,TS_ADIM=2.5,TS_P=new Float64Array(TS_N),TS_X=new Float64Array(TS_N),TS_Z=new Float64Array(TS_N),TS_T=new Float64Array(TS_N);
/* H1a (2026-10-15; gerçekçilik planı §4 H1): yönler 8 kaba yön (hücum yönüne göre 45°'lik ızgara) ve tasiInce açıkken en iyi kaba yönün ±22,5°'si
   ile sürmekte olan yön (topu süren serbest sürüşteyse niyetinin yönü, değilse 1,5 m/sn üstünde gidişi). Yön değiştirmenin bedeli: sürmekte olan
   yönden açıyla orantılı, 45°'de tasiDevam puan (çok yakın iki değer arasında karar her düşünme anında komşu ızgara çizgisine zıplamasın; eskiden
   niyet saniyede ~1,3 kez tam 45° değişiyordu). Bir yönün seçeneklerini S'ye ekler, en büyük değeri döndürür */
/* T21d: ters ayaklı kanat — fiziksel kanadına (hücum yönüne bakınca sağ: (z − MZ)·yön > 0) göre sağda sol ayaklı ya da solda sağ ayaklı (mevki adı değil: dizilişteki
   “SĞK” etiketi takımın yönüne göre fiziksel sol kanada düşebiliyor — 2026-10-18 denemesi). Saf */
function tersAyakKanat(m,p){const mv=p.mevki;if(!mv||!mv.kanat||p.ayak==='iki')return false;const yan=(p.z-MZ)*m.dir[p.team];return yan>0?p.ayak==='sol':yan<0?p.ayak==='sag':false;}
function tasimaYonu(m,p,S,a,dv0,rakip,vC){
  const b=m.ball,d=m.dir[p.team],A=MOTOR_AYAR,takim=m.taktik[p.team];
  const c=Math.cos(a),s=Math.sin(a),don=Math.max(0,Math.abs(aciFark(a,p.yon))-0.6)/4,bedel=dv0===null?0:A.tasiDevam*Math.min(1,Math.abs(aciFark(a,dv0))/(Math.PI/4));
  let n=0;for(let i=0;i<TS_N;i++){const x=b.x+c*TS_ADIM*(i+1),z=b.z+s*TS_ADIM*(i+1);if(Math.abs(x)>PL-1||z<1||z>PW-1)break;
    TS_X[i]=x;TS_Z[i]=z;TS_T[i]=don+0.25+TS_ADIM*(i+1)/vC;TS_P[i]=1;n++;}
  if(n<1)return -1e9;
  /* her rakip: noktalara varış; i. noktaya kadarki en kötü risk (TS_P[i]: o noktaya kadar topu kaptırmama) */
  for(const o of rakip){if(!o.oyunda||(o.eylem&&o.eylem.kilit))continue;
    const ox=o.x-b.x,oz=o.z-b.z,r=o.maxSpd*1.1*(TS_T[n-1]+0.5)+TS_ADIM*n+1;if(ox*ox+oz*oz>r*r)continue;
    let en=0;for(let i=0;i<n;i++){const to=varisZamani(o,TS_X[i],TS_Z[i],0.8,0.2),rr=sigma((TS_T[i]+0.1-to)/0.18);if(rr>en)en=rr;TS_P[i]*=1-0.7*en;}}
  /* T7c: şut bölgesinde (kaleye 24 m) kısa taşıma da tartılır: tek dokunuşla şut açısını açmak */
  const uz=[];if(don>0.15||b.x*d>PL-24)uz.push(0);if(n>=2)uz.push(1);if(n>=4)uz.push(3);
  /* değer: yeni yerin devam değeri + taşımanın kendi kazandırdığı (kaybettirdiği) alan (paslardaki ilerleme teriminin aynısı; olmasa geriye
     taşıyıp ileri pas atmak, oradan pas daha çok metre kazandırdığı için, ileri taşımak kadar değerli görünüyordu) */
  let enD=-1e9;
  for(const i of uz){const P=clamp(TS_P[i],0.05,0.98),x=TS_X[i],z=TS_Z[i];
    const dv=devamDegeri(m,p,x,z,TS_T[i],a),mx=(b.x+x)/2,mz=(b.z+z)/2,ilr=(x-b.x)*d*A.ilerleme*m.taktik[p.team].ilerle;
    /* T21d (tersKanat): ters ayaklı kanat son 35 m'de içe (kaleye) kesen taşımayı daha değerli bulur (güçlü ayağına alıp içe dönen orta ya da şut) */
    const ic=A.tersKanat&&tersAyakKanat(m,p)&&b.x*d>PL-35&&Math.abs(b.z-MZ)>8?A.tersKanat*Math.max(0,Math.cos(aciFark(a,Math.atan2(MZ-b.z,d*PL-b.x)))):0;
    const deger=P*(dv+ilr+ic)-(1-P)*pasKaybi(m,p,mx,mz)*takim.risk*A.risk-bedel;if(deger>enD)enD=deger;
    S.push({tur:'tasi',hx:x,hz:z,yon:a,mesafe:TS_ADIM*(i+1),deger,P,dv});}
  return enD;}
function tasimaSecenekleri(m,p,S){
  const b=m.ball,d=m.dir[p.team],hA=d>0?0:Math.PI,A=MOTOR_AYAR,rakip=rakipler(m,p.team);
  const vC=p.maxSpd*0.72*(0.8+0.12*p.oz.surus)/0.86,ince=!!A.tasiInce;
  let dv0=null;
  if(ince){const su=p.surus;if(b.sahip===p&&su&&!su.koru&&!su.bekle&&!su.cal)dv0=su.yon;else if(hyp(p.vx,p.vz)>1.5)dv0=Math.atan2(p.vz,p.vx);}
  let enA=null,enD=-1e9;
  for(let j=0;j<8;j++){const a=aciNorm(hA+j*Math.PI/4),v=tasimaYonu(m,p,S,a,dv0,rakip,vC);if(v>enD){enD=v;enA=a;}}
  if(!ince||enA===null)return;
  const a1=aciNorm(enA+Math.PI/8),a2=aciNorm(enA-Math.PI/8);tasimaYonu(m,p,S,a1,dv0,rakip,vC);tasimaYonu(m,p,S,a2,dv0,rakip,vC);
  /* sürmekte olan yön, değerlendirilen yönlerden 3°'den uzaksa ayrıca */
  if(dv0!==null){const k=aciFark(dv0,hA)/(Math.PI/4),uzak=Math.abs(k-Math.round(k))*(Math.PI/4)>0.052;
    if(uzak&&Math.abs(aciFark(dv0,a1))>0.052&&Math.abs(aciFark(dv0,a2))>0.052)tasimaYonu(m,p,S,aciNorm(dv0),dv0,rakip,vC);}
}
/* T22a (2026-10-18; surukle): sürükleme — 15 / 22 / 30 m'lik uzun taşıma (kullanıcı notu: kanadın hızlanıp basıp gitmesi). Yön hücum yönü ve kaleye doğru; sürücü
   tepe hızın ~0,88'iyle gider. Başarı: yol boyunca 5 m'de bir rakiplerin varışı (tasimaYonu'nun ölçeği); değer: yolun sonundaki devam değeri + ilerleme
   − kayıp. Kendi yarısının derininde ve kaleci için yok. Saf */
const SR_L=[15,22,30];
function surukleSecenegi(m,p,S){
  const A=MOTOR_AYAR;if(!A.surukle||p.rol==='GK')return;
  const b=m.ball,d=m.dir[p.team],u=b.x*d;if(u<-15)return;
  const hA=d>0?0:Math.PI,gA=Math.atan2(MZ-b.z,d*PL-b.x),vC=p.maxSpd*0.88,rakip=rakipler(m,p.team),takim=m.taktik[p.team];
  const YON=Math.abs(aciFark(gA,hA))>0.2?[hA,gA]:[hA];
  for(const a of YON){const c=Math.cos(a),s=Math.sin(a);let P=1,son=0;
    for(let i=1;i<=6;i++){const L=5*i,x=b.x+c*L,z=b.z+s*L;if(Math.abs(x)>PL-2||z<2||z>PW-2)break;const tp=0.3+L/vC;let en=0;
      for(const o of rakip){if(!o.oyunda||(o.eylem&&o.eylem.kilit))continue;const rr=sigma((tp+0.1-varisZamani(o,x,z,1.0,0.2))/0.2);if(rr>en)en=rr;}
      P*=1-0.75*en;son=L;
      if(SR_L.includes(L)){const Pk=clamp(P,0.05,0.97),dv=devamDegeri(m,p,x,z,tp,a),ilr=(x-b.x)*d*A.ilerleme*m.taktik[p.team].ilerle;
        const deger=Pk*(dv+ilr+(p.mevki&&p.mevki.kanat?A.surukleKanat:0))-(1-Pk)*pasKaybi(m,p,b.x+c*L/2,b.z+s*L/2)*takim.risk*A.risk;   /* kanadın basıp gitmesi */
        S.push({tur:'surukle',hx:x,hz:z,yon:a,mesafe:L,deger,P:Pk,dv});}}
    if(son<15)continue;}}
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
  const tempo=A.koruTempo*m.taktik[p.team].koruK*tutT;   /* B3: topu tutmanın bedeli iştahla (koruK) */
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
    const dv=devamDegeri(m,p,bb.cx,bb.cz,tYak+bb.tA,Math.atan2(MZ-bb.cz,d*PL-bb.cx),o),ilr=(bb.cx-b.x)*d*A.ilerleme*m.taktik[p.team].ilerle;
    const deger=bb.P*(dv+ilr+A.birebirDeger)-bb.Pk*pasKaybi(m,p,b.x,b.z)*m.taktik[p.team].risk*A.risk*A.birebirKayip;
    if(deger>enD){enD=deger;en={tur:'gec',yon,o,i:bb.i,hareket:bb.hareket,taraf:bb.taraf,P:bb.P,Pk:bb.Pk,hx:bb.cx,hz:bb.cz,deger,tYak};}}
  if(en)S.push(en);}
/* hedefin değeri (türden bağımsız kısım): tehdit, ilerleme, geri pasla topu tutma, ara pası, boşluğa, yön değiştirme, ver-kaç dönüşü */
function pasDegeri(m,p,o,hx,hz,alt,q){
  const d=m.dir[p.team],u=o.ox*d,A=MOTOR_AYAR,takim=m.taktik[p.team],hu=hx*d,ilerleme=hu-u;
  /* alıcı topu aldığı an sıkıştırılacaksa o yerin değeri tam gerçekleşmez (topu tutamaz, geri döner) */
  const qB=enYakinRakip(m,hx,hz,p.team).d,sik=clamp((4-qB)/3,0,1);
  /* ara pasında alıcı savunmanın arkasında topu kaleye taşır: tehdit 5 m ileriden ölçülür (kaleciyle karşı karşıya kalma değeri) */
  let v=xT(alt==='ara'?Math.min(PL-8,hu+5):hu,hz)*100*(1-A.sikisma*sik)+ilerleme*(A.ilerleme*takim.ilerle+0.015*takim.direkt)*(ilerleme<0?0.3:1-0.5*sik);
  if(ilerleme<-4){   /* geri pas: topu tutmak, baskıda güvenli çıkış */
    /* B1 (geriPasAmac; 2026-10-22): topu tutma payı yalnız önü kapalıyken tam — pasörün en iyi ileri seçeneği bulunduğu yerin değerinden geriPasK
       puandan çok fazlaysa (önü açık) pay söner; aynı takım sahipliğinde ardışık geri paslarda yarı yarıya söner (amaçsız dolaşım); planın beklediği
       pas (rakibi çekme, üçüncü adam) muaf. Baskı terimi aynen */
    /* B1b (tarzSabir): kapının genişliği ve zincir bütçesi tarzın sabrından — konumsal (sabir 0,85) kapı 2,0, bütçe 2,7 pas; direkt (0,15) 0,7 ve 1,3 */
    let fs=1;const e=A.geriPasAmac;
    if(e>0&&!(m._pln&&m.planAlici(p)===q)){const V=A.tarzSabir>0?tarzTakim(m,p.team):null,es=V?A.tarzSabir:0;
      const K=A.geriPasK*(es?Math.max(0.7,1+2.5*es*(V.sabir-0.45)):1);
      const g=Math.max(0,(o.onIleri!=null?o.onIleri:-9)-xT(u,o.oz)*100),fk=clamp(1-g/K,0,1);
      const G=m._geriN&&m._geriN[p.team],ayni=G&&G.bas===m._sahiplikBas;
      const fz=es?Math.max(0,1-(ayni?G.c:0)/(2+es*A.tarzSabirZincir*(2*V.sabir-1))):Math.max(0,1-(ayni?G.n:0)/2);
      fs=1-e*(1-fk*fz);}
    v+=takim.sakin*A.geriPas*fs+o.baski*0.8;}
  /* Z4c (bindirme&2; B.4): bindiren ya da içten bindiren, ileri koşan beke pas — kanatta ikiye bir */
  if(A.bindirme&2&&(q.gorevAd==='bindirme'||q.gorevAd==='icBindirme')&&(q.vx*d)>3)v+=A.bindirmeDeger;
  if(alt==='ara')v+=A.araDeger*(0.5+takim.direkt);else if(alt==='bosluk')v+=A.boslukDeger;else if(alt==='hedef')v+=A.hedefDeger*(0.4+takim.direkt);
  if(q.rol==='GK'){const KA=(MOTOR_AYAR.kurma&2)?tarzTakim(m,p.team):null;v-=KA?0.3*(1-0.7*KA.kaleciArti):0.3;}   /* Z3: kaleci +1 tarzda geri pas cezası küçük */
  /* Z3 (tarzEtki; G1.1): tarzın açık oyundaki izi — kisaPay 16 m'den kısa pasa küçük pay (0,5'in altında ceza). Tarzsız takımda yok */
  {const V=MOTOR_AYAR.tarzEtki>0?tarzTakim(m,p.team):null;if(V){const L=hyp(hx-o.ox,hz-o.oz),e=MOTOR_AYAR.tarzEtki;
    if(L<16)v+=e*(V.kisaPay-0.5)*0.5;}}   /* uzun top payı başarıdan bağımsız: tarzUzunEk (U0, pasAdayiTam) */
  if(Math.abs(hz-o.oz)>=25){v+=A.donusDeger;if(A.donusBos)v+=A.donusBos*clamp((qB-4)/8,0,1);}   /* T21c (donusBos): boş uzak kanada yön değiştirme daha değerli */
  const vq=m._bv&&m._bv.get(q);if(vq&&vq.vk&&vq.vk.q===p)v+=A.verKacDeger;
  return v;}
const pasTurDegeri=(m,p,tip,yay)=>tip==='hava'?m.taktik[p.team].direkt*0.4+MOTOR_AYAR.havaDeger:0;  /* havadan pas: kontrolü zor, uzun top takımın tarzına bağlı */
const PAS_ALT_SIRA={ayak:0,birak:0,bosluk:1,ara:2,hedef:3};
/* ucuz ön puan ve tür seçimi: hattın ilk %60'ı kapalıysa ve iniş yeri boşsa havadan, değilse yerden; sınırdaysa ikisi de tam analize girer */
function pasAdayiEkle(m,p,o,C,q,g,hx,hz,alt,ex,ez,es,ek){
  const d=m.dir[p.team],ox=o.ox,oz=o.oz;
  if(hz<1||hz>PW-1||Math.abs(hx)>PL-1||hx*d>PL-1)return;
  const L=hyp(hx-ox,hz-oz);if(L<3||L>66)return;
  if((alt==='ara'&&L<15)||(alt==='bosluk'&&(L<8||o.ilk&&!MOTOR_AYAR.tekKoni)))return;   /* kısa ara pası, kısa ya da tek vuruşla boşluğa pas: tutmaz (T20c: tekKoni açıkken gelişine boşluğa pas olur) */
  if(o.ilk&&(L>(alt==='ara'?30:25)||Math.abs(aciFark(Math.atan2(hz-oz,hx-ox),o.gelA+Math.PI))>o.sinirA))return;
  const ux=(hx-ox)/L,uz=(hz-oz)/L,vOrt=10+L*0.25;
  let r60=0,rSon=0,inis=99,blok=99;
  for(const r of rakipler(m,p.team)){if(!r.oyunda)continue;
    const rx=r.x-ox,rz=r.z-oz,boy=rx*ux+rz*uz,yan=Math.abs(rx*uz-rz*ux);
    if(boy>-1&&boy<L+3){const t=o.t0+Math.max(0,boy)/vOrt,ul=r.maxSpd*0.75*t+0.8;
      if(yan<ul){if(boy<L*0.6){r60+=1-yan/ul;if(boy<7&&yan<1.6&&boy<blok)blok=boy;}else rSon+=1-yan/ul;}}
    const di=hyp(r.x-hx,r.z-hz);if(di<inis)inis=di;}
  /* tür: hat açıksa yerden (38 m'ye kadar; uzunda sert), ilk %60'ı kapalıysa ve iniş yeri boşsa havadan, kısa mesafede rakip dibindeyse aşırtma */
  let tip='yer',yay=null;
  const havaUygun=!o.ilk&&L>=10&&(inis>2.5||rSon<r60);
  if(L>38||(r60>0.6&&havaUygun)){tip='hava';yay=L<24&&blok<7?'asirtma':null;}
  const hh=alt==='hedef'?hedefHavaP(m,q,hx,hz):null,Ph=hh?hh.kazan:0,Pi=hh?hh.ikinci:0;if(alt==='hedef'){tip='hava';yay=null;}
  if(tip==='hava'&&(o.ilk||alt==='bosluk'&&!(MOTOR_AYAR.uzunKosu&&L>=15)))return;   /* T21c (uzunKosu): koşana savunma arkasına havadan */
  const P0=alt==='hedef'?Ph:Math.exp(-1.2*(tip==='yer'?r60+rSon:rSon*1.2+(yay==='asirtma'?0:r60*0.15)))*(tip==='hava'?0.85:1);
  const dg=pasDegeri(m,p,o,hx,hz,alt,q)+(ek||0),kay=pasKaybi(m,p,hx,hz);
  const U0=P0*(dg+pasTurDegeri(m,p,tip,yay))-(1-P0)*kay*(alt==='hedef'?1-Pi:tip==='hava'?MOTOR_AYAR.ikinciTop*tarzIkinciK(m,p):1)+tarzUzunEk(m,p,L,(hx-o.ox)*m.dir[p.team],tip,hx*m.dir[p.team]);
  C.push({q,g,hx,hz,alt,ex,ez,es,tip,yay,dg,kay,U0,Ph,Pi,iki:!o.ilk&&(alt!=='bosluk'||!!MOTOR_AYAR.uzunKosu)&&alt!=='hedef'&&L>=12&&L<=38&&r60>0.3&&r60<1.4});}
/* hedef forvete uzun top (T2: iki ayrı terim). kazan: forvet topa ilk dokunur (iniş yerinde boşsa yüksek; çekişmeliyse kafa, boy ve gövde
   düellosu); pasın tamamlanmasıdır. ikinci: kaybedilen düelloda dönen topun takımda kalma olasılığı; tamamlanma sayılmaz, kaybın bedelini
   azaltır (eskiden ikisi tek olasılıktı ve tahmin gerçekleşenden 17 puan iyimserdi). Rastlantısız; paylaşılan nesne (HH) döner */
const HH={kazan:0,ikinci:0};
function hedefHavaP(m,q,hx,hz){
  let e=null,ed=99;for(const r of rakipler(m,q.team)){if(!r.oyunda||r.rol==='GK')continue;const dd=hyp(r.x-hx,r.z-hz);if(dd<ed){ed=dd;e=r;}}
  HH.ikinci=MOTOR_AYAR.ikinciTopHedef;
  if(!e||ed>4){HH.kazan=0.8;return HH;}
  const duello=havaDuelloTahmin(m,q,e,2.1),bos=clamp((ed-1)/3,0,1);   /* T6d: düello tahmini (js/mac-hava.js; eskiden kafa, kütle ve boy formülü) */
  HH.kazan=clamp(lerp(duello,0.8,bos),0.1,0.85);return HH;}
/* Z3 (tarzEtki; G1.5 direkt oyun ve ikinci top): tarzın uzun top eğilimi — ileriye 28 m'den uzun pasın faydasına başarıdan bağımsız pay (alan ve ikinci
   top; uzunHedef 0,5'in altında ceza), havadan kaybın bedeli ikinciTop ile azalır. Tarzsız takımda 0 / 1 (birebir) */
function tarzUzunEk(m,p,L,il,tip,hu){const V=MOTOR_AYAR.tarzEtki>0?tarzTakim(m,p.team):null;if(!V||L<28)return 0;
  const e=MOTOR_AYAR.tarzEtki,r=clamp((L-28)/12,0,1);
  if(il>=12){let v=e*(V.uzunHedef-0.5)*MOTOR_AYAR.tarzUzun*r*(tip==='hava'?1:0.6);
    /* Z7a (tarzArka; G2.3): yüksek hatta uzun top — hedef rakibin çizgisinin (sondan ikinci) arkasındaysa ve hattı kalesinden 28 m'den uzaksa pay */
    const TA=MOTOR_AYAR.tarzArka;if(TA>0&&hu!=null&&m._ofs){const ofs=m._ofs[p.team],hat=PL-ofs;if(hu>ofs-1&&hat>28)v+=e*TA*Math.max(0,V.uzunHedef-0.3)*clamp((hat-28)/10,0,1);}
    return v;}
  return -e*Math.max(0,V.kisaPay-0.5)*MOTOR_AYAR.tarzYanUzun*r;}   /* kısa kuran tarz dolaşımı kısa paslarla yapar: savunmanın 30 m'yi aşan yan ve geri pası seyrek */
function tarzIkinciK(m,p){const V=MOTOR_AYAR.tarzEtki>0?tarzTakim(m,p.team):null;return V?1-0.6*MOTOR_AYAR.tarzEtki*(V.ikinciTop-0.5):1;}
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
  const U=A.P*(c.dg+dEk+pasTurDegeri(m,p,tip,yay))*(0.7+0.3*A.Pk)-(1-A.P)*c.kay*(hedef?1-c.Pi:tip==='hava'?MA.ikinciTop*tarzIkinciK(m,p):1)*takim.risk*MA.risk+tarzUzunEk(m,p,A.L,(c.hx-o.ox)*d,tip,c.hx*d);
  return{tur:c.alt==='ara'?'ara':A.L>34?'uzun':'pas',alici:c.q,hx:c.hx,hz:c.hz,tip,yay,varis:A.varis,T:tip==='hava'?A.T:null,
    mod:c.alt==='ara'?'ara':c.alt==='bosluk'?'bosluk':'ayak',ex:c.ex,ez:c.ez,es:c.es,deger:U,P:A.P,Pk:A.Pk,sure:A.sure,L:A.L,alt:c.alt,dv,marj:A.marj};}   /* T23a2: marj salt okunur (alıcının rahat noktası) */
/* bütün pas seçenekleri. o: {ox,oz: topun çıkacağı yer, t0: vuruşa kalan süre, ilk: gelişine (tek vuruş), gelA: gelen topun yönü,
   sinirA: hizalanma sınırı, baski: pasörün baskısı, ofs: algılanan ofsayt çizgisi, vole: top havada} */
const BOSLUK_KISA=[3,6],BOSLUK_UZUN=[3,6,10];
function pasSecenekleri(m,p,o){
  const d=m.dir[p.team],u=o.ox*d,C=[];
  if(MOTOR_AYAR.geriPasAmac>0)o.onIleri=ileriPasOnPuani(m,p,o.ox,o.oz,0);   /* B1: pasörün en iyi ileri seçeneği (geri pas payının "önü kapalı" çarpanı; saf) */
  for(const q of m.teams[p.team]){
    if(q===p||!q.oyunda||(q.eylem&&q.eylem.kilit))continue;
    /* Z3 (kurma&2; A4): kaleci +1 — tarzın kaleciArti ≥ 0,5 iken kurma niyetinde geri pas kaleciye daha erken ve daha az baskıda açılır */
    {const KA=(MOTOR_AYAR.kurma&2)&&q.rol==='GK'?tarzTakim(m,p.team):null,kaU=!!(KA&&KA.kaleciArti>=0.5&&m._niyet&&m._niyet[p.team]&&m._niyet[p.team].ad==='kur');
      if(q.rol==='GK'&&(kaU?(u>-15||o.baski<0.12):(u>-10||o.baski<0.3)))continue;}
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
      /* T21c (uzunKosu): derin koşudaki (p.kosu: arkaya, geniş) alıcının 10 m önündeki boşluğa da (savunma arkasına havadan; pasAdayiEkle türü seçer) */
      if((ex||ez)&&q.rol!=='GK')for(const s of MOTOR_AYAR.uzunKosu&&q.kosu&&(q.kosu.tur==='arkaya'||q.kosu.tur==='genis')?BOSLUK_UZUN:BOSLUK_KISA){const z=mt.z+ez*s;if(z>3&&z<PW-3)pasAdayiEkle(m,p,o,C,q,g,mt.x+ex*s,z,'bosluk',ex,ez,s);}
    }
    /* hedef forvete uzun top (birleştirme, 2026-10-03): önde bekleyen hedef forvete ya da forvete havadan; iniş yeri çekişmeli olsa da
       hava düellosu ve ikinci top değerlidir (alt ligde sık oyun). Takımın direkt ayarıyla değerlenir */
    if(!o.ilk&&!ofsaytta&&q.rol==='FV'&&qu>u+12){const L=hyp(g.x-o.ox,g.z-o.oz);if(L>=22&&L<=58)pasAdayiEkle(m,p,o,C,q,g,g.x+g.vx*0.6,g.z+g.vz*0.6,'hedef',0,0,0);}
    /* ara pası: ofsayt çizgisine yakın, kendi tarafındaki hücumcu (ya da bindiren bek) savunma arkasına */
    if(qu<=o.ofs+0.5&&q.rol!=='GK'&&(q.rol!=='DEF'||q.mevki.bek)&&qu>o.ofs-12&&qu>u-8){
      const h=araNoktasi(m,g,o.ox,o.oz,o.t0,null,o.ofs,d);
      if(h){pasAdayiEkle(m,p,o,C,q,g,h.x,h.z,'ara',0,0,0,-Math.max(0,0.25-h.marj)*MOTOR_AYAR.araDar);
        /* T7c: tetikli koşunun kaydı — alıcı bu noktaya koşabilir (mac-topla.js derinKosu; 0,5 sn geçerli) */
        const AK=m._araKayit||(m._araKayit=[new Map(),new Map()]),e=AK[p.team].get(q);if(e){e.x=h.x;e.z=h.z;e.t=m.t;}else AK[p.team].set(q,{x:h.x,z:h.z,t:m.t});}}
  }
  /* Z1 (H6 uzantısı): planın pası koşucunun gideceği boşluğa aday olur (plan 0'da m._pln yok) */
  if(m._pln){const h=m.planHedefPas(p);if(h){const g=algilanan(m,p,h.q);if(g){const L=hyp(h.x-o.ox,h.z-o.oz);pasAdayiEkle(m,p,o,C,h.q,g,h.x,h.z,L>=8?'bosluk':'ayak',h.ex,h.ez,0);}}}
  C.sort((a,c)=>c.U0-a.U0||a.q.n-c.q.n||PAS_ALT_SIRA[a.alt]-PAS_ALT_SIRA[c.alt]||(a.es||0)-(c.es||0));
  const K=Math.min(C.length,o.ilk?6:10),S=[];
  /* Z1 (H6): planın bu pasördan beklediği alıcının en iyi ön adayı tam analize zorla girer (plan 0'da m._pln yok) */
  if(m._pln&&K>0){const hq=m.planAlici(p);if(hq){let j=-1;for(let i=0;i<C.length;i++)if(C[i].q===hq){j=i;break;}if(j>=K){const c=C[j];C.splice(j,1);C.splice(K-1,0,c);}}}
  for(let i=0;i<K;i++){const c=C[i];let r=pasAdayiTam(m,p,o,c,c.tip,c.yay);
    if(c.iki){const t2=c.tip==='yer'?'hava':'yer',r2=pasAdayiTam(m,p,o,c,t2,t2==='hava'&&hyp(c.hx-o.ox,c.hz-o.oz)<24?'asirtma':null);if(r2.deger>r.deger)r=r2;}
    S.push(r);}
  return S;}

/* T14c (2026-10-14; gerçekçilik planı §4 T14): vuruşun yön hatasında zayıf ayağın beklenen çarpanı (saf; vurusBaslat'ın ayak kuralının aynası,
   zar yerine olasılık). Hedef çok yandaysa o yanın iç ayağı ya da top gövdenin zayıf ayak yanındaysa zayıf ayak olasılığı profilden (baskıda ve
   hedef yandayken artar); çarpan 1 + P·1,2·(1 − zayıf ayak) (vurusSapma). İki ayaklı 1. T14-0: maç içi ortaların %32'si zayıf ayakla, sapması
   8,7 m (güçlü ayakta 4,9) — planlayıcı bilmiyordu */
function vurusAyakK(m,p,ox,oz,hx,hz,baski){if(p.ayak==='iki')return 1;
  const f=aciFark(Math.atan2(hz-oz,hx-ox),p.yon),zayif=p.ayak==='sag'?'sol':'sag',geo=Math.abs(f)>0.9?(f>0?'sol':'sag'):null;
  const yanU=Math.cos(p.yon)*(oz-p.z)-Math.sin(p.yon)*(ox-p.x),yakin=Math.abs(yanU)>0.18?(yanU>0?'sag':'sol'):null;
  if(geo!==zayif&&yakin!==zayif)return 1;
  const za=profilAlt(p,'zayifAyak',0.35);let P=clamp(0.1+0.45*za-0.25*profilEgilim(p,'zayifAyaktanKacinir'),0.05,0.8);
  if(geo===zayif)P*=1.3;if(baski>0.5)P*=1.25;
  return 1+Math.min(1,P)*1.2*(1-za);}
/* ---- orta (MM3) ---- */
/* hücumcuların varış noktalarına ve kaleciyle savunma arasına. Türler: alçak sert (yerden, altıpasın önünden), kesme (düz ve hızlı, kafa/vole
   yüksekliği), arka direğe asma, geri çevirme (ceza sahası içine yerden geri). Değer = xG(kafa/vole) × P(ulaşır) × (1 − kaleciHavaTahmin) */
function ortaSecenekleri(m,p,o,S){
  const d=m.dir[p.team],u=o.ox*d,yakin=Math.sign(o.oz-MZ)||1,gk=m.kaleci(1-p.team),A=MOTOR_AYAR,takim=m.taktik[p.team],C=[];
  /* T6e: havadan ortanın hedefi ceza sahasında (kaleye 16 m; 16–20 m'deki oyuncuya havadan top orta değil, kafası 14 m'nin ötesinden şut olmaz);
     yerden geri çevirme yaya (20 m) kadar */
  const ekle=(q,g,hx,hz,tip,yay,hy,T,tur)=>{const tu=hx*d;if(tu>PL-2||tu<PL-(tip==='hava'?16:20)||Math.abs(hz-MZ)>12)return;C.push({q,g,hx,hz,tip,yay,hy,T,tur});};
  for(const q of m.teams[p.team]){
    if(q===p||!q.oyunda||q.rol==='GK'||(q.eylem&&q.eylem.kilit))continue;
    const g=algilanan(m,p,q);if(!g)continue;
    const qu=g.x*d;if(qu<PL-24||Math.abs(g.z-MZ)>19||(qu>o.ofs+0.3&&qu>u))continue;
    const L0=hyp(g.x-o.ox,g.z-o.oz),uzak=Math.sign(g.z-MZ)!==yakin||Math.abs(g.z-MZ)<2.5;
    const nok=T=>{const k=Math.min(T,0.9);return{x:g.x+g.vx*k,z:g.z+g.vz*k};};
    if(u>PL-22&&qu>PL-11){const t=L0/17,n=nok(t);ekle(q,g,d*Math.min(n.x*d,PL-2.5),n.z,'yer',null,0,null,'alcak');}
    /* T6d: kesme ortası başın hizasına (1,75 m; eskiden 1,35 — göğse iniyordu), arka direğe asma sıçrayan başa (2,0 m) */
    {const T=havaSure(L0,'kesme'),n=nok(T);ekle(q,g,n.x,n.z,'hava','kesme',1.75,T,'kesme');}
    if(uzak){const T=havaSure(L0,'asma'),n=nok(T);ekle(q,g,n.x,n.z,'hava','asma',2.0,T,'asma');}
    /* T7c (plan T7 madde 4, çizgiye inip geri çevirme): ortacı ceza sahası derinliğinde (17 m), alıcı penaltı noktası ile zon 14'ün önü arasında
       (7–21 m; eskiden ortacı 15 m, alıcı 8–19 m: kanat o kadar derine nadiren indiği için 80 maçta 22 deneme) */
    if(u>PL-17&&qu<PL-7&&qu>PL-21&&Math.abs(g.z-MZ)<12){const mt=bulusmaNoktasi(m,g,o.ox,o.oz,0,'yer');ekle(q,g,mt.x,mt.z,'yer',null,0,null,'geri');}}
  /* bölgeler: ön direk, arka direk, penaltı noktası ve kaleciyle savunma arası (altıpasın önü) — oraya en erken varacak arkadaşa */
  for(const [zu,zw,yay,hy] of[[PL-5.5,MZ+yakin*2.2,'kesme',1.75],[PL-6.5,MZ-yakin*4,'asma',2.0],[PL-11,MZ,'kesme',1.8],[PL-6,MZ-yakin,'kesme',1.6]]){   /* T6d: başın hizası */
    const zx=d*zu;let en=null,eg=null,enT=99;
    for(const q of m.teams[p.team]){if(q===p||!q.oyunda||q.rol==='GK'||(q.eylem&&q.eylem.kilit))continue;const g=algilanan(m,p,q);if(!g||(g.x*d>o.ofs+0.3&&g.x*d>u))continue;
      const t=varisSuresi(g,zx,zw,0.8);if(t<enT){enT=t;en=q;eg=g;}}
    /* T6d: bölgeye orta yalnız uçuş süresinde (+0,3 sn) oraya varabilecek arkadaşa (eskiden 3 sn: top o inmeden çoktan düşüyordu) */
    const Tz=havaSure(hyp(zx-o.ox,zw-o.oz),yay);if(en&&enT<Tz+0.3)ekle(en,eg,zx,zw,'hava',yay,hy,Tz,yay);}
  for(const c of C){
    const ayakK=A.ortaAyak?vurusAyakK(m,p,o.ox,o.oz,c.hx,c.hz,o.baski):1;
    /* ortacının önündeki rakip bacağı ortayı kesebilir — T5 (2026-10-09): motorla aynı saf işlev (ortaBlokTahmin, js/mac-mudahale.js); ilk hız
       uçuş süresinden (havadan: yatay L/T, dikey (hy + gT²/2)/T; yerden 18 m/sn), yön belirsizliği 0,25 m */
    const L=hyp(c.hx-o.ox,c.hz-o.oz)||1,ux=(c.hx-o.ox)/L,uz=(c.hz-o.oz)/L,Tu=c.tip==='hava'&&c.T>0?c.T:0,vh=Tu?L/Tu:18,vy0=Tu?((c.hy||0)+0.5*G*Tu*Tu)/Tu:0;
    /* T14c: hazırlık süresi (karar → temas): asgari hazırlık ya da gövdenin hedefe dönüşü (vurusIlerle'nin hizalanma sınırına kadar) + geri salınım;
       1. adam bu sürede ortanın yoluna adım atar (ortaBlokTahmin) ve ortacının vuruş anındaki baskısı onun yerinden (baskiAltinda; motor vuruş
       hatasını temas anındaki baskıdan hesaplar — planlayıcı eskiden karar anınınkini kullanıyordu) */
    const vs=vurusSureleri(c.tip==='hava'?'hava':L>22?'uzunYer':'pas',o.baski||0),don=Math.max(0,Math.abs(aciFark(Math.atan2(uz,ux),p.yon))-A.vurusHizalama*1.35)/hrkVurusDonus(p);
    const acik=ortaBlokTahmin(m,p.team,o.ox,o.oz,0.11,ux*vh,uz*vh,vy0,0.25,Math.max(vs.haz,don)+vs.geri).acik;
    const bK=A.ortaTemas&&OB_V.on?Math.max(o.baski||0,clamp((4.5-hyp(OB_V.x-p.x,OB_V.z-p.z))/3.5,0,1)):o.baski;
    const iz=o.hepsi?{}:null,A2=pasAnaliz(m,p,c.hx,c.hz,c.tip,c.g,{ox:o.ox,oz:o.oz,T:c.T,yay:c.yay,hy:c.hy,varislar:c.tur==='alcak'?varisAdaylari(hyp(c.hx-o.ox,c.hz-o.oz),'orta'):null,baski:bK,iz,orta:true,ayakK});
    const tu=c.hx*d,parca=c.tip==='hava'?(c.hy>1.3?'kafa':'vole'):'ayak';
    const bec=parca==='kafa'?0.6+0.8*c.q.oz.kafa:parca==='vole'?0.7+0.6*c.q.oz.sut:0.8+0.4*c.q.oz.sut;
    const sans=xG(tu,c.hz,parca,A2.baskiK)*bec;
    /* isabet: ortanın hücumcudan 2,5 m'den fazla sapmaması (yön hatası vurusHatasi ile aynı ölçekte; baskı altında orta kötüleşir) */
    const sdO=(0.028+0.075*(1-p.oz.pas))*(1+o.baski*0.9)*(c.tip==='hava'?1.6:1)*(1+0.35*(p.yorgunluk||0)),Pis=2*normalDagilim(2.5/Math.max(0.1,sdO*L))-1;
    /* T10a: isabet yalnız pas analizinde (Pex); ortanın kendi isabeti (Pis) ikinci kez çarpılıyordu — yalnız c-orta raporuna gider */
    const kal=c.tip==='hava'&&gk.oyunda?kaleciHavaTahmin(m,gk,c.hx,c.hz,c.hy,c.T).P:0,Pg0=A2.P*(1-kal)*acik;
    /* T10a: havadan ortanın inişine alıcıdan başka hücumcu da gelir (c-orta: topa ilk dokunan hücumcu alıcıdan ~8 puan çok) — inişe uçuş süresinde
       (+0,3 sn) yetişebilen her diğer arkadaş, alıcının kaybettiği topun ortaDestek'i kadarını alır (en çok 0,4) */
    let nd=0;if(c.tip==='hava')for(const q of m.teams[p.team]){if(q===p||q===c.q||!q.oyunda||q.rol==='GK')continue;const g=algilanan(m,p,q);
      if(g&&varisSuresi(g,c.hx,c.hz,1.0)<(c.T||A2.T||1)+0.3)nd++;}
    /* T14c (2026-10-14): destek yalnız inişteki çekişmeye — bloklanan ya da kalecinin aldığı ortaya, isabetsiz ortaya başka hücumcu yetişmez
       (eskiden kaybın tamamına ekleniyordu: 2 m'den yakın baskıda bloklanan ortanın tahmini %30 kalıyordu, gerçek %10; T14-0 teşhisi) */
    const Pg=A.ortaTemas?(1-kal)*acik*Math.min(0.99,A2.P+A2.teknik*A2.Pex*(1-A2.Pt)*Math.min(0.4,A.ortaDestek*nd)):Pg0+(1-Pg0)*Math.min(0.4,A.ortaDestek*nd);
    /* T10-0 (2026-10-11): o.hepsi — c-orta senaryosu eşiksiz listeyi ve tahminin bileşenlerini alır (kalibrasyon); karar yolu aynı */
    /* T17c (ortaDevam): bloklanan orta çoğu zaman kale çizgisine doğru seker (ortaBlokUygula %60) — kornerin değeri ortanın devamıdır; bloklanması muhtemel orta
       eşiğin altında kalmaz. T14c'den beri ortacı baskıdaki ortayı bırakıp adamını geçmeye ya da pasa dönüyordu (orta bloğu %2, gerçekte ~%25, orta kaynaklı korner yok) */
    const devam=A.ortaDevam?(1-acik)*A.ortaBlokKorner*A.ortaKornerDeger:0;
    if((A.ortaDevam?Pg+devam/100<A.ortaEsik:Pg<0.1)&&!o.hepsi)continue;   /* umutsuz orta düşünülmez */
    /* T21d (ortaIkinci): ilk teması alamayan ortada inişin tehdidinin bir payı (ikinci top, dönen top; eskiden yalnız ilk temasın xG'si) */
    const ik=A.ortaIkinci?(1-Pg)*A.ortaIkinci*xT(c.hx*d,c.hz)*100:0;
    const U=(Pg*(sans*100+0.8)+devam+ik-(1-Pg)*pasKaybi(m,p,c.hx,c.hz)*0.5*takim.risk)*A.ortaIstegi;
    S.push({tur:c.tur==='geri'?'geriCevir':'orta',alici:c.q,hx:c.hx,hz:c.hz,tip:c.tip,yay:c.yay,hy:c.hy,T:c.tip==='hava'?A2.T:null,varis:A2.varis,
      mod:c.tip==='hava'?null:'ayak',deger:U,P:Pg,Pk:A2.Pk,sure:A2.sure,L:A2.L,ortaTuru:c.tur});
    if(o.hepsi)S[S.length-1].bilesen={P2:A2.P,Pex:A2.Pex,Pt:A2.Pt,teknik:A2.teknik,kal,acik,Pis,sans,iz};}
}
/* korner: kafa vuranların ve koşuların noktası ya da bölge (ön direk, penaltı noktası); değer = xG(kafa) × kafa becerisi × P(ulaşır) × (1 − kaleci) */
/* Z2b: yay — uçuşun modeli (havaSure; varsayılan 'korner'): kornerin ve serbest vuruş ortasının kendi teslimi sahne&2'de 'kornerHizli', uzun taç eski uçuşla */
function kornerSecenekleri(m,p,ox,oz,yay){
  const d=m.dir[p.team],yan=Math.sign(oz-MZ)||1,gk=m.kaleci(1-p.team),S=[];
  const deg=(q,hx,hz,hy)=>{const L=hyp(hx-ox,hz-oz),T=havaSure(L,yay||'korner'),A2=pasAnaliz(m,p,hx,hz,'hava',q,{ox,oz,T,hy,baski:0});
    const kal=gk.oyunda?kaleciHavaTahmin(m,gk,hx,hz,hy,T).P:0,sans=xG(hx*d,hz,'kafa',A2.baskiK)*(0.5+q.oz.kafa);
    S.push({q,hx,hz,hy,T,deger:A2.P*(1-kal)*(sans*100+0.8)});};
  /* T8b: görevli kafacıların koşu noktaları (p.duranRol kx, kz; js/mac-durantop.js), top sıçrayan başın hizasında (ayaktaki alın + 0,25; en çok 2,0 m) */
  let rolVar=false;
  for(const q of m.teams[p.team]){const G=q.duranRol;if(q===p||!q.oyunda||!G||G.kx==null||!DT_HEDEF.has(G.rol))continue;rolVar=true;deg(q,G.kx,G.kz,Math.min(2.0,hvAlinDur(q)+0.25));}
  if(!rolVar)for(const q of m.teams[p.team]){if(q===p||!q.oyunda||q.rol==='GK')continue;const qu=q.x*d;if(qu<PL-15||Math.abs(q.z-MZ)>10)continue;
    deg(q,d*clamp((q.x+q.vx*0.5)*d,PL-12,PL-3),clamp(q.z+q.vz*0.5,MZ-8,MZ+8),1.8);}
  for(const [zu,zw] of[[PL-5.5,MZ+yan*1.5],[PL-11,MZ]]){let en=null,enT=99;
    for(const q of m.teams[p.team]){if(q===p||!q.oyunda||q.rol==='GK')continue;const t=varisSuresi(q,d*zu,zw,0.8);if(t<enT){enT=t;en=q;}}
    if(en)deg(en,d*zu,zw,1.75);}
  return S;}

/* ---- şut planı (MM3): ~8 hedef × tür. P(gol) = P(çerçeve: hatanın normal dağılımı kalenin içinde) × (1 − kaleciTahmin) × (1 − blok) ----
   T9b-a (2026-10-10): hedef × tür × güç. Hız = güç × stilin hız payı × şutçunun azami hızı (sutHizTavani; zayıf ayakta az); yön ve yükseklik
   hatası türün çarpanı × gücün çarpanı (gucHataCarpani: güç arttıkça dik artar). Güçlü şut kalecinin tepkisini geçer, isabeti düşer: plan
   ikisini tartar. Tür: plase iç ayak, sert üst, falso içüstü (eğri), düşen (serbest vuruş), aşırtma */
const SUT_Z=[-3.4,-3.0,-2.0,2.0,3.0,3.4],SUT_Y=[0.35,1.75],SUT_GUC=[0.6,0.75,0.9,1.0];
/* T8c: serbest vuruşta türün hedef yükseklikleri — barajın üstünden falso ve düşen üst köşeye, sert iki yükseklikte, plase sıçrayan barajın altından */
const SUT_YS={falso:[1.75,2.05],dusen:[1.95,2.2],sert:SUT_Y,plase:[0.3]};
/* T9b-a: kalenin ağzı hücrelere bölünür (kale ortasına göre z sınırları, y sınırları; dış sınırlar topun yarıçapı kadar içeride). Kalecinin
   kurtarma olasılığı hücre ortalarında okunur (tür ve güç başına bir kez); nişanın normal dağılımı hücrelere dağıtılır:
   P(gol) = (1 − blok) × Σ P(hücre) × (1 − kurtarış(hücre)). Eskiden kurtarış nişan noktasında okunuyordu: büyük hatalı (güçlü, uzak) köşe şutu
   çerçeveyi bulunca hep köşeye gidiyor sayılıyordu (25 m'den köşeye tam güç P(gol) ~0,23) */
const SUT_HZ=[-3.54,-3.0,-2.2,-1.4,-0.6,0.6,1.4,2.2,3.0,3.54],SUT_HY=[-99,0.6,1.3,2.32],SUT_HZM=[],SUT_HYM=[0.25,0.95,1.8];
for(let i=0;i+1<SUT_HZ.length;i++)SUT_HZM.push((SUT_HZ[i]+SUT_HZ[i+1])/2);
const SUT_PS=new Float64Array(SUT_HZM.length*SUT_HYM.length),SUT_FZ=new Float64Array(SUT_HZ.length),SUT_FY=new Float64Array(SUT_HY.length);
const SUT_TUR={plase:{stil:'ic',kz:0.9,ky:0.85},sert:{stil:'ust',kz:1.0,ky:1.1},falso:{stil:'falso',kz:1.0,ky:0.85},dusen:{stil:'ust',kz:1.05,ky:0.85},
  asirtma:{stil:'asirtma',kz:0.9,ky:0.7},trivela:{stil:'dis',kz:1.3,ky:0.9}};   /* trivela: dış ayağın 1,22 çarpanı vurusSapma'da (toplam ~1,6); yalnız şut ≥ 0,65 */
/* T9b-c: eğrinin yönü vuran ayaktan — iç ayakla falso sağ ayakta sola döner: top sağ direğin (vuranın gözünden) dışından içeri girer; dış ayakla
   (trivela) sağa döner: sol direğin dışından. Sol ayakta tersi. zt·d > 0 vuranın sağıdır. Ayak bilinmiyorsa (eski çağrı) iki yan da */
function sutEgriYani(tur,ayak,zt,d){if(tur!=='falso'&&tur!=='trivela'||!ayak||ayak==='iki')return true;const sag=zt*d>0;return(ayak==='sag')===(tur==='falso'?sag:!sag);}
/* atış hattındaki savunmacı bloklayabilir (aşırtma ve düşen top ilk metrelerden sonra üstünden geçer, falso hattı biraz kaçırır) */
/* T8c (2026-10-11): 3B — yt (kale çizgisindeki hedef yükseklik) ve T (uçuş süresi) verilirse engelin hizasında topun yüksekliği
   yOn = 0,11 + (yt − 0,11)·f + ½·g′·T²·f·(1 − f) (f = engelin uzaklığı / mesafe; düşende üst dönüşle g′ = 1,3 g); erişim Ry = 1,8·boy + 0,15
   (barajda + durarak sıçrama × barajZipla). P_i = yanal × [(Ry − yOn)/0,35 + 0,5] (0–1; erişimin ±0,175 m'si sıçramanın zamanı ve topun
   yükseklik hatasıyla belirsiz — ilk denemede rampa erişimin altında kalıyordu, plan barajı sıyıran düşen şutu temiz sanıyor, fizikte %41'i
   baraja çarpıyordu); barajda yanal (0,5 − yan)/0,2 (omuz omuza duvar), havadaki
   barajın altından (yOn < 0,45) ×0,4. yt verilmezse eski 2B (türün payı: plase ve sert 0,6, falso 0,45, uzaktaki engele düşen 0,3) */
/* T19a (2026-10-17): t0 — kararın gördüğü hazırlık süresi (karar → temas, sn; sutSecenegi verir). Motorda topa sutHamle m içindeki savunmacı tepkisinden
   (0,12 + 0,12·(1 − karar) sn) sonra şutun hattına atılır ve bacağını uzatır (sutHamleYap, js/mac-hareket.js; erişim blokErisim): planlayıcı onu
   hatta (toptan en az 1 m öteye) kalan sürede alabileceği yolla (3·τ² m; duruştan ~6 m/sn² ivme) yaklaşmış ve uzanma payı (blokErisim − 0,6)
   genişlemiş sayar. t0 verilmezse (kaleye vuruşun planı; savunmacılar zaten hatta) eski hesap */
function sutBlokOlasiligi(m,p,ox,oz,tx,tz,tur,yt,T,t0){
  const Lk=hyp(tx-ox,tz-oz)||1,ucY=yt!=null,H=t0>0&&MOTOR_AYAR.sutHamle?MOTOR_AYAR:null;let acik=1;
  for(const o of rakipler(m,p.team)){if(!o.oyunda||o.rol==='GK')continue;let on=((o.x-ox)*(tx-ox)+(o.z-oz)*(tz-oz))/Lk,yan=-1,R=1.3;
    if(H&&on>=-0.3&&hyp(o.x-ox,o.z-oz)<=H.sutHamle){const tau=Math.max(0,t0-0.12-0.12*(1-o.oz.karar));
      yan=Math.max(0,segD(o.x,o.z,ox,oz,tx,tz)-4*tau);on=clamp(on,1,Math.max(1,Math.min(6,Lk-1)));R=1.3+H.blokErisim-0.6;}
    if(on<0.5||on>Math.min(14,Lk-1))continue;
    if(tur==='asirtma'&&on>4)continue;
    /* Z2c: yatan barajcı alçak şutu keser (barajın doğrultusunda ±0,9 m, 0,32 m'ye dek; ayaktaki gövdesi yok) */
    const YR=o.duranRol&&o.duranRol.rol==='yatan'&&o.duranRol.yatik&&(m.phase==='durus'||o.eylem&&o.eylem.ad==='kalkis'&&o.eylem.neden==='yatan')?o.duranRol:null;   /* fizikle aynı yüklem; kalkınca ayaktaki gövde */
    if(YR){if(!ucY)continue;if(yan<0)yan=segD(o.x,o.z,ox,oz,tx,tz);if(yan>=0.9)continue;const f=on/Lk,yOn=0.11+(yt-0.11)*f+0.5*G*(tur==='dusen'?1.3:1)*T*T*f*(1-f);
      if(yOn<0.32)acik*=0.08;continue;}
    const bj=!!(o.duranRol&&o.duranRol.rol==='baraj');if(yan<0)yan=segD(o.x,o.z,ox,oz,tx,tz);let P;
    if(bj){if(yan>=0.5)continue;P=Math.min(1,(0.5-yan)/0.2);}
    else{if(yan>=R)continue;P=(ucY?0.6:tur==='falso'?0.45:tur==='dusen'&&on>4?0.3:0.6)*(1-yan/R);}
    if(ucY){const f=on/Lk,yOn=0.11+(yt-0.11)*f+0.5*G*(tur==='dusen'?1.3:1)*T*T*f*(1-f),Ry=1.8*(o.boy||1)+(bj?hvSicramaH(o,0)*MOTOR_AYAR.barajZipla:0)+0.15;
      P*=clamp((Ry-yOn)/0.35+0.5,0,1);if(bj&&yOn<0.45)P*=0.4;}
    acik*=1-P;}
  return 1-acik;}
/* sd: temel yön hatası (rad; vurusSapma, güç çarpanı 1). o: {serbest, tur (sabit tür), guc (sabit güç), zayif (zayıf ayak: azami hız düşer), acele
   (T9b-b: kısa geri salınım azami hızı en çok %15 düşürür), stil (sabit stil: burun)}. Seçim sıcaklıklıdır: kararlı şutçu en iyi hedefi daha
   tutarlı seçer */
function sutPlani(m,p,ox,oz,sd,o){
  const A=sutAdaylari(m,p,ox,oz,sd,o),Ls=A.Ls,en=A.en;
  /* T9b-a: sıcaklık en iyi adayın değerine göre (göreli): uzak şutta bütün adayların P(gol)'ü küçükken mutlak sıcaklık seçimi neredeyse rastgele
     yapıyordu (25 m'de plan tam güçlü vuruşu en iyi bulsa da ortalama güç 0,84 çıkıyordu); karar 0,6'da 16 m'de eskisiyle aynı keskinlik */
  const tau=Math.max(0.004,(0.06+0.18*(1-p.oz.karar))*en);let top=0;
  /* Z6b (sutEgilim): plase vuran ve kaleciyi aşırtan şutçunun türü — seçimde pay (P(gol) değişmez; yürütme aynı) */
  const SE=MOTOR_AYAR.sutEgilim,eP=SE?SE*0.15*en*profilEgilim(p,'plaseVurur'):0,eA=SE?SE*0.25*en*profilEgilim(p,'kaleciyiAsirtir'):0;
  for(const c of Ls){c.a=Math.exp((c.Pg+(c.tur==='plase'?eP:c.tur==='asirtma'?eA:0)-en)/tau);top+=c.a;}
  let r=m.rast()*top;for(const c of Ls){r-=c.a;if(r<=0)return c;}
  return Ls[Ls.length-1];}
/* T8c: şut adayları ve en iyisinin P(gol)'ü (saf; rastlantı çekmez): serbest vuruş kararı (serbestKarar) seçmeden değerlendirir */
function sutAdaylari(m,p,ox,oz,sd,o){
  o=o||{};const d=m.dir[p.team],gx=d*PL,gk=m.kaleci(1-p.team),L=Math.max(1,hyp(gx-ox,MZ-oz)),onde=gk.oyunda?Math.abs(gk.x-gx):0;
  /* T9b-c: aşırtma kaleci 3,5 m'den öndeyse ve 9 m'den uzaktan (eskiden 5 m ve 11 m: maçta şutların ~%0,6'sında); dış ayakla falso yalnız becerili şutçuda */
  const tv=p.oz.sut>=0.65?['trivela']:[];
  const turler=o.tur?[o.tur]:o.serbest?['falso','dusen','sert','plase']:onde>3.5&&L>9?['plase','sert','falso',...tv,'asirtma']:L>(MOTOR_AYAR.sutYeni?9:14)?['plase','sert','falso',...tv]:['plase','sert'];
  const gucler=o.guc!=null?[o.guc]:SUT_GUC,vMax=sutHizTavani(p,!!o.zayif)*(1-0.15*(o.acele||0)),R=VURUS_GUC_REF.sut;
  const Ls=[],sapma=Math.max(0,L-18)*0.01;let en=0;
  const nZ=SUT_HZM.length,nY=SUT_HYM.length;
  /* T22b (sutYeni): plase ve aşırtma isabetli, sert hatalı (serbest vuruş hariç) — yerleştirmenin isabet kazancı gücün tepki kazancıyla tartılsın (eskiden sert %81) */
  for(const tur of turler){const TT=SUT_TUR[tur]||SUT_TUR.plase,kz=MOTOR_AYAR.sutYeni&&!o.serbest?(tur==='plase'?0.65:tur==='sert'?1.15:tur==='asirtma'?0.75:TT.kz):TT.kz,ky=TT.ky,BL=[],stil=o.stil||TT.stil;
    for(const g of gucler){const v=Math.max(8,g*VURUS_STIL[stil].hiz*vMax),fg=gucHataCarpani(g,R),T=L/v*1.06*(tur==='falso'?1.08:1);
      /* kalecinin hücre ortalarındaki kurtarışı (bu tür ve güçle uçuş süresi T) */
      /* T9b-c: aşırtmanın kurtarışı da kalecinin modelinden (eski ×0,3 düzeltmesi kalktı): top kalecinin düzleminde erişiminin üstünden geçer,
         kale çizgisine çapraz geri çekilmesi (kaleciTahmin) yetişirse kurtarır */
      const ek=tur==='falso'||tur==='trivela'?MOTOR_AYAR.kaleciEgri:0;   /* dönen topu kaleci geç okur (yürütmede kaleciTehdit aynı süreyi ekler) */
      for(let i=0;i<nZ;i++)for(let j=0;j<nY;j++)SUT_PS[i*nY+j]=gk.oyunda?kaleciTahmin(m,gk,MZ+SUT_HZM[i],SUT_HYM[j],T,ek).P:0;
      for(let k=0;k<SUT_Z.length;k++){const zt=SUT_Z[k];
        if(tur==='asirtma'&&Math.abs(zt)>2.6||!sutEgriYani(tur,o.ayak,zt,d))continue;
        /* blok olasılığı güçten bağımsız: tür ve hedef başına bir kez. T8c: serbest vuruşta 3B (barajın yüksekliği; yükseklik ve uçuş başına) */
        let bl=o.serbest?0:BL[k];if(!o.serbest&&bl===undefined)bl=BL[k]=sutBlokOlasiligi(m,p,ox,oz,gx,MZ+zt,tur);
        const sz=Math.max(0.05,sd*kz*fg*L);for(let i=0;i<SUT_HZ.length;i++)SUT_FZ[i]=normalDagilim((SUT_HZ[i]-zt)/sz);
        for(const y0 of(o.serbest?SUT_YS[tur]:tur==='asirtma'?[2.0]:tur==='dusen'?[1.9]:SUT_Y)){
          /* T8c: serbest vuruşta barajın üstünden giden şutun (hedef yüksekliği ≥ 1 m; türü ne olursa olsun) yükseklik hatası yanal hatayla aynı
             açıda (ky = kz / 0,35; açık oyunda yükseklik hatası yanalın 0,35'i — alçak şut yüksekliği tutar): üstten hem barajı aşıp hem üst direğin
             altına inmek fırlatma açısını, hızı ve dönüşü birlikte tutturmayı ister. Tarama (18 m merkez, 40 vuruş): düşen ve falsoda 1,4 katında
             gol %27, 2 katında %35; yalnız onlara uygulanınca plan barajın üstüne 'sert' şut seçti (30 şutta 15 gol) */
          /* T12a (2026-10-12): T8c kuralı açık oyuna da — 1 m ve üstüne nişanda yükseklik hatası yanal hatayla aynı açıda (ky = kz / 0,35); alçak
             şut yüksekliğini tutar (0,35). Eskiden açık oyunda yüksek köşe (1,75 m) dikeyde neredeyse hatasızdı: 11–20 m'den çerçeveyi bulan şutların
             %22'si üst köşedeydi, %30'u kurtarıldı (T12-0 teşhisi) */
          const kyY=y0>=1&&(o.serbest||tur!=='asirtma')?kz*(o.serbest?1:MOTOR_AYAR.sutDikey)/0.35:ky,yt=y0+sapma,sy=Math.max(0.05,sd*kyY*fg*L*0.35);if(o.serbest)bl=sutBlokOlasiligi(m,p,ox,oz,gx,MZ+zt,tur,yt,T);for(let j=0;j<SUT_HY.length;j++)SUT_FY[j]=normalDagilim((SUT_HY[j]-yt)/sy);
          let Pon=0,Pk=0;
          for(let i=0;i<nZ;i++){const pz=SUT_FZ[i+1]-SUT_FZ[i];if(pz<1e-4)continue;
            for(let j=0;j<nY;j++){const pc=pz*(SUT_FY[j+1]-SUT_FY[j]);Pon+=pc;Pk+=pc*(1-SUT_PS[i*nY+j]);}}
          const Pg=Pk*(1-bl);
          Ls.push({tur,zt,yt:y0,v,g,kz,ky:kyY,fg,stil,Pg,Pon});if(Pg>en)en=Pg;}}}}
  return{Ls,en};}

/* ---- T8d: penaltı planı (saf; rastlantı çekmez) ----
   Adaylar: hedef (köşe ±2,9, yanın ortası ±1,8, orta 0) × yükseklik (alçak 0,3, orta 1,0, yüksek 2,0; ortaya alçak ve orta) × güç (0,7 / 0,85 / 1,0;
   0,9 üstü sert vuruş, altı plase). P(gol) = P(çerçeve) × (1 − P(kurtarış)). Hata modeli açık oyunla aynı (yön σ = sd·kz·fg·L, yükseklik
   σ = sd·ky·fg·L·0,35; L = 11 m). Kurtarış: kaleci ~%45 aynı yana uçar (iyi kaleci biraz daha çok), %10 ortada kalır; aynı yana uçanın erişimi
   kaleciPay'den (temastan 0,1 sn önce kalkar) × 0,6 — tahmin ettiği noktaya uçar, elleri topa tepkiden sonra döner (d-penalti: doğru yana uçan
   kaleci %33 kurtarıyor); ortada kalan ayakta tepkiyle; ters yana uçan yalnız ortaya gelen topa (%25, bacak). Köşe kurtarılmaz ama dışarı da
   gidebilir: plan isabetle kurtarışı tartar */
function penaltiPlani(m,p,gk,sd){
  const Lp=PENALTI_U,R=VURUS_GUC_REF.sut,vMax=sutHizTavani(p,false),k=gk&&gk.oyunda?gk.oz.kalecilik:0,ayni=0.45+0.1*(k-0.5),orta=0.1,Ls=[];let en=0;
  /* T19c: direğe 0,46 m köşe adayı (penaltiKose) — gerçekte penaltıların ~%7'si dışarı ya da direğe gider; motorda ±2,9 m köşe kaçırmayı neredeyse sıfırlıyordu */
  const PK=MOTOR_AYAR.penaltiKose,ZT=PK?[-PK,-2.9,-1.8,0,1.8,2.9,PK]:[-2.9,-1.8,0,1.8,2.9];
  for(const zt of ZT)for(const yt of zt===0?[0.3,1.0]:[0.3,1.0,2.0])for(const g of[0.7,0.85,1.0]){
    const tur=g>=0.9?'sert':'plase',TT=SUT_TUR[tur],v=Math.max(8,g*VURUS_STIL[TT.stil].hiz*vMax),fg=gucHataCarpani(g,R),T=Lp/v;
    const sz=Math.max(0.05,sd*TT.kz*fg*Lp),sy=Math.max(0.05,sd*TT.ky*fg*Lp*0.35);
    const Pon=(normalDagilim((GW2-0.12-zt)/sz)-normalDagilim((-GW2+0.12-zt)/sz))*normalDagilim((GH-0.12-yt)/sy);
    let Ps=0;if(gk&&gk.oyunda){const rS=sigma(1.702*kaleciPay(gk,Math.abs(zt),yt,T+0.1,0,1).pay/KL_M.sapma)*0.6,rO=sigma(1.702*kaleciPay(gk,Math.abs(zt),yt,T,0.25,1).pay/KL_M.sapma);
      Ps=zt===0?orta*rO+(1-orta)*0.25:ayni*rS+orta*rO;}
    const Pg=Pon*(1-Ps);Ls.push({zt,yt,g,v,tur,kz:TT.kz,ky:TT.ky,fg,Pg,Pon});if(Pg>en)en=Pg;}
  return{Ls,en};}
/* Z6a (sutKaleci; FUTBOL_KUTUPHANESI §5, kutuphane/C §1): şutçunun gördüğü kale ağzının (direkten direğe açı) kalecinin örtmediği payı. Kalecinin
   örtüsü uzanma yarıçapıyla (ayakta ve kapanmada 1,6 m; uçuşta, kalkışta ya da düşüşte 0,35 m) kaleciye uzaklıktan açı aralığıdır. Oran: bu payın, kale
   çizgisinin ortasında ayakta duran kalecinin bırakacağı paya oranı (konum xG'si bu ortalama kaleciyle kurulu). Saf; rastlantı çekmez */
function kaleciAcikOran(m,p,x0,z0){
  const gk=m.kaleci(1-p.team),d=m.dir[p.team],gx=d*PL;if(!gk||!gk.oyunda)return 2;
  const a1=Math.atan2(MZ-GW2-z0,gx-x0),a2=Math.atan2(MZ+GW2-z0,gx-x0),lo=Math.min(a1,a2),hi=Math.max(a1,a2),w=hi-lo;if(w<0.02)return 1;
  const ortu=(cx,cz,r)=>{const dk=Math.max(0.5,hyp(cx-x0,cz-z0)),ak=Math.atan2(cz-z0,cx-x0),h=Math.atan(r/dk);return Math.max(0,Math.min(hi,ak+h)-Math.max(lo,ak-h));};
  const e=gk.eylem,yer=!!(e&&e.kilit&&(e.ad==='ucus'||e.ad==='kalkis'||e.ad==='dusus'));   /* kapanma (ayağa yatış) örtü sayılır: kaleci şutçunun üstünde */
  const acik=1-ortu(gk.x,gk.z,yer?0.35:1.6)/w,ref=Math.max(0.05,1-ortu(gx,MZ,1.6)/w);
  return acik/ref;}
/* şut seçeneği: iyi pozisyonda istekle; uzaktan ancak iyi şutçu ve önü boşsa. Atış hattındaki savunmacı bloklayabilir */

function sutSecenegi(m,p,x0,z0,baski){
  const d=m.dir[p.team],u=x0*d;if(u<=PL-38)return null;
  /* T19a: blok olasılığı hazırlık süresiyle (savunmacının hamlesi; sutBlokOlasiligi t0) — pBlok seçeneğe yazılır (v-verim kalibrasyonu okur) */
  /* hazırlık süresi orta planlayıcısındaki gibi (T14c): asgari hazırlık, gövdenin kaleye dönüşü (vurusHizalama sınırına kadar) ya da topa varış + geri salınım */
  let t0=0;if(MOTOR_AYAR.sutHamle){const vs=vurusSureleri('sut',baski),don=Math.max(0,Math.abs(aciFark(Math.atan2(MZ-z0,d*PL-x0),p.yon))-MOTOR_AYAR.vurusHizalama)/hrkVurusDonus(p),
    vr=Math.max(0,hyp(p.x-x0,p.z-z0)-0.5)/Math.max(0.7,p.spd||0);t0=Math.max(vs.haz,don,vr)+vs.geri;}
  const pBlok=sutBlokOlasiligi(m,p,x0,z0,d*PL,MZ,'sert',undefined,undefined,t0);
  const gx=d*PL,Lk=hyp(gx-x0,MZ-z0),oz=p.oz;let x=xG(u,z0,'ayak',baski*0.4)*(1-pBlok);   /* 2B (T8c: 3B yalnız serbest vuruşun planında) */
  /* Z6a (sutKaleci): kaleciyi gören karar — açık açının ortalama kaleciye oranı (0,5–2 kat; karar becerisi okumayı keskinleştirir) */
  if(MOTOR_AYAR.sutKaleci>0){const r=kaleciAcikOran(m,p,x0,z0),k=MOTOR_AYAR.sutKaleci*(0.6+0.4*oz.karar);x*=clamp(1+k*(r-1),0.5,2);}
  /* T9b-c: şutçunun niteliği yakında şut becerisinden, 18 m'den sonra giderek gücünden (sutGucu; uzak şutu güç taşır). Gol olmayan şutun değeri:
     dönen top ve korner (sutIkinci; 13 m'ye kadar tam, 25 m'de sıfır — uzak şutun çoğu tutulur ya da auta gider, çelme ve blok yakında doğar)
     eksi top kaybı (0,4; eskiden yalnız kayıp cezası). İlk denemede mesafeden bağımsız değer 25 m ötesinden şutu %7'den %36'ya çıkarmıştı */
  const kU=clamp((Lk-18)/10,0,1),q=(0.85+oz.sut*0.3)*(1-kU)+(0.55+0.9*profilAlt(p,'sutGucu',0.5))*kU,ik=MOTOR_AYAR.sutIkinci*clamp((25-Lk)/12,0,1)-0.4;
  /* şut isteği iyi pozisyonda tam, uzaklaştıkça azalır: 14 m'ye kadar tam, 22 m'de yalnız şutun kendi değeri, daha uzakta isteksiz.
     T3: uzaktan vurma eğilimi 14 m'den sonra isteği ±%60 değiştirir (kararVer'de ayrıca eğilim puanı); uzak şutun kapısı eğilimle de açılır */
  const uv=profilEgilim(p,'uzaktanVurur');
  /* T12c: isteğin tam olduğu ve bittiği mesafe MOTOR_AYAR.sutIstekMesafe [tam, biter] (eskiden sabit 14 ve 22 m) */
  const IM=MOTOR_AYAR.sutIstekMesafe,istek=(Lk<IM[1]?1+(MOTOR_AYAR.sutIstegi-1)*clamp((IM[1]-Lk)/(IM[1]-IM[0]),0,1):1-clamp((Lk-IM[1])/14,0,0.5))*(1+0.6*uv*clamp((Lk-14)/8,0,1));
  if(x>=0.017)return{tur:'sut',deger:x*100*q*istek+(1-x)*ik,xg:x,pBlok};
  if(x>=0.008&&(oz.sut>0.5||uv>0.3)&&baski<0.6)return{tur:'sut',deger:x*100*q*(0.5+0.5*istek)+(1-x)*ik,xg:x,pBlok};
  return null;}
/* ---- seçenekler ---- */
/* bütün değerler aynı ölçüdedir: gol olasılığı × 100 ("puan"). Pas = başarı × hedefin tehdidi − kayıp × rakibin oradaki tehdidi */
function secenekler(m,p){const e=GOZ.p;GOZ.p=p;try{return secenekler0(m,p);}finally{GOZ.p=e;}}
function secenekler0(m,p){
  const b=m.ball,d=m.dir[p.team],u=b.x*d,w=b.z,oz=p.oz,S=[];
  const baski=baskiAltinda(m,p);
  /* ofsayt çizgisini oyuncu hatasız göremez: görüşü düşük olan daha çok yanılır */
  const ofs=ofsaytCizgisi(m,p.team)+m.normal()*MOTOR_AYAR.ofsaytAlgi*(1.2-oz.gorus);
  /* dolaylı serbest vuruşu kullanan doğrudan kaleye vurmaz (başkası dokunmadan gol olmaz) */
  if(!(b.endirekt&&b.endirekt.p===p)){const s=sutSecenegi(m,p,b.x,b.z,baski);if(s)S.push(s);}
  /* paslar. t0 = 0: top hemen çıkıyor sayılır. T4-V'de vuruşa kalan süre (vurusSureleri) denendi ve geri alındı: t0 = hazırlık + geri 40 maçta
     vazgeçmeyi 2,6 → 8/maça (yakinP cezası t0 < 0,05 ile kapanıyordu), yalnız t0 = geri ise pası 108 → 96'ya, sahiplik başına pası 2,17 → 1,75'e
     düşürdü (kesilme modeli rakibin tepki gecikmesini bilmez, uzayan süre her hattı kapalı gösterir). T7c'de rakibin saatini de vuruştan
     başlatan model denendi, o da iyimser çıktı (gerçekçilik planı §7 madde 10); t0 = 0 kalibre olandır */
  for(const s of pasSecenekleri(m,p,{ox:b.x,oz:b.z,t0:0,ilk:false,baski,ofs}))S.push(s);
  /* orta ve geri çevirme: kanatta, son üçte birde */
  if((u>PL-30||MOTOR_AYAR.ortaErken&&u>PL-40&&p.mevki&&(p.mevki.kanat||p.mevki.bek))&&Math.abs(w-MZ)>8)ortaSecenekleri(m,p,{ox:b.x,oz:b.z,baski,ofs},S);   /* T21d: erken orta */
  /* T2: taşıma (8 yön × 5/10 m; eskiden 5 yön × 6 m, boş alanda bile başarı 0,6 + 0,35·sürüş ve değer buranın tehdidi + 2,5 ile sınırlıydı) */
  tasimaSecenekleri(m,p,S);
  /* T22a: sürükleme (15–30 m) */
  surukleSecenegi(m,p,S);
  /* T4: rakibi geç (bire bir) */
  birebirSecenegi(m,p,S);
  /* uzaklaştırma: kendi bölgesinde baskı altında; kaleye yaklaştıkça ve baskı arttıkça daha cazip (birleştirme 2026-10-03: alt ligde sık,
     çoğu zaman taça ya da hava mücadelesine gider) */
  /* T7e (plan T7 madde 11): şuttan sonra 3 sn kendi ceza sahamızda dönen topu alan savunmacı için uzaklaştırma daha değerli (baskı yoksa pas yine seçilebilir) */
  const dn=!!m._donenT&&m.t-m._donenT[p.team]<3&&m.kendiCezaSahasinda(p,b.x,b.z);
  if(u<-PL+30&&(baski>0.3||dn))S.push({tur:'uzaklastir',deger:MOTOR_AYAR.uzaklastirDeger+baski*1.1+(u<-PL+18?0.4:0)+(dn?MOTOR_AYAR.donenUzak:0)});
  /* T2: bekleme ya da gövdeyle koruma (eskiden yalnız koru: değeri her zaman eksiydi) */
  bekleSecenegi(m,p,S);koruSecenegi(m,p,S);
  if(m._pln)m.planEkle(p,S,0);   /* Z1 (H7): planın adımı ve istek sinyali seçenek değerine (koruSecenegi'nden sonra: koruma payı devralmasın) */
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
function kararVer(m,p){const e=GOZ.p;GOZ.p=p;try{return kararVer0(m,p);}finally{GOZ.p=e;}}
function kararVer0(m,p){
  const S=secenekler(m,p);if(!S.length)return{tur:'bekle'};
  const v=m.bVeri(p),b=m.ball;if(!v.gur||v.gur.no!==m.sahiplikNo)v.gur={no:m.sahiplikNo,M:new Map(),t0:m.t};
  const G=v.gur.M,tau=0.1+0.5*(1-profilAlt(p,'tutarlilik',0.5+0.4*p.oz.karar)),esik=sabirEsigi(m,p,baskiSuresi(m,p.team,b.x,b.z,0).t1,m.t-v.gur.t0);
  const pt=m._pln?m.planTut(p,esik):0;   /* Z1 (H8): derin koşu gençken bekleme payı (sabır eşiğinin üstüne) */
  let en=S[0],enP=-1e9;
  for(const s of S){const k=s.tur==='tasi'||s.tur==='bekle'||s.tur==='koru'?'tut':s.alici?(s.tur==='orta'||s.tur==='geriCevir'?'o':'p')+s.alici.n:s.tur;
    let g=G.get(k);if(g===undefined){const r=Math.max(1e-12,m.rast());g=-Math.log(-Math.log(r))*tau;G.set(k,g);}
    const puan=s.deger+g+profilEgilimPuani(m,p,s)+(k==='tut'?esik+pt:0);if(puan>enP){enP=puan;en=s;}}
  /* T7c (Ek H 6): en iyi pasın hedefi — taşırken gövde ona açılır (mac-hareket.js surusIlerle) */
  if(MOTOR_AYAR.govdeAc){let bp=null;for(const s of S)if(s.alici&&(!bp||s.deger>bp.deger))bp=s;v.enPas=bp?{hx:bp.hx,hz:bp.hz,t:m.t}:null;}
  return en;
}
/* ---- gelişine tek vuruş (MM3): top gelirken alıcı tek vuruşla pası (geri, bırakma, ara) kontrol edip oynamakla (+~0,5 sn, daha çok baskı)
   karşılaştırır. k: karşılama noktası {x,z,t}, s: topun o anki durumu (topTahmin). Dönüş: {sec: tek vuruş seçimi ya da null, hedef: kontrol
   sonrası en iyi pasın hedefi (yönlü ilk dokunuş için)} */
function tekVurusKarari(m,p,k,s,yakin){const e=GOZ.p;GOZ.p=p;try{return tekVurusKarari0(m,p,k,s,yakin);}finally{GOZ.p=e;}}
function tekVurusKarari0(m,p,k,s,yakin){
  const b=m.ball,d=m.dir[p.team],gelA=Math.atan2(b.vz,b.vx);
  let dd=99;for(const o of rakipler(m,p.team))if(o.oyunda)dd=Math.min(dd,hyp(o.x-k.x,o.z-k.z)-o.maxSpd*k.t*0.6);
  const baski=clamp((4.5-dd)/3.5,0,1),ofs=ofsaytCizgisi(m,p.team)+m.normal()*MOTOR_AYAR.ofsaytAlgi*(1.2-p.oz.gorus);
  const ktr=pasSecenekleri(m,p,{ox:k.x,oz:k.z,t0:k.t+0.45,ilk:false,baski:Math.min(1,baski+0.15),ofs});
  if(m._pln)m.planEkle(p,ktr,2);   /* Z1 (H9) */
  let en2=null;for(const c of ktr)if(!en2||c.deger>en2.deger)en2=c;
  const Pk=kontrolOlasiligi(p,s.v||hyp(b.vx,b.vz),s.y,baski,0.8),kay=pasKaybi(m,p,k.x,k.z);
  /* kontrol sonrası: en iyi pas, şut ya da topu tutmak (T2: oranın devam değeri ve sabır eşiği; eskiden buranın tehdidi − baskı) */
  const tut=devamDegeri(m,p,k.x,k.z,k.t+0.45,gelA+Math.PI)+sabirEsigi(m,p,baskiSuresi(m,p.team,k.x,k.z,k.t).t1),sut=sutSecenegi(m,p,k.x,k.z,Math.min(1,baski+0.15));
  const U2=Math.max(en2?en2.deger:-9,tut,sut?sut.deger:-9)*(0.9+0.1*Pk)-(1-Pk)*kay*0.4;
  const hedef=en2&&en2.deger>tut&&!(sut&&sut.deger>en2.deger)?{x:en2.hx,z:en2.hz}:null;
  /* tek vuruş yalnız top ayağına (yerden ya da yarım yükseklikte) gelirken ve karşılama noktasına yakınken; koşarak yetişilen ya da havadan
     inen topu önce kontrol eder */
  if(p.rol==='GK'||s.y>0.45||!yakin)return{sec:null,hedef};
  /* T20c (tekKoni): yönlendirme konisi 90–120° (eskiden 34–54°: gelişine pas yalnız pasöre doğru) */
  const ilk=pasSecenekleri(m,p,{ox:k.x,oz:k.z,t0:k.t,ilk:true,gelA,sinirA:MOTOR_AYAR.tekKoni?MOTOR_AYAR.tekKoni*(0.75+0.25*p.oz.pas):0.6+0.35*p.oz.pas,baski,ofs,vole:s.y>0.15});
  if(m._pln)m.planEkle(p,ilk,1);   /* Z1 (H9): ver-kaç dönüşü ve üçüncü adam bırakışı gelişine */
  let en1=null;for(const c of ilk)if(!en1||c.deger>en1.deger)en1=c;
  if(!en1)return{sec:null,hedef};
  /* tek vuruşun kendi riski: top ayağa tam gelmeyebilir */
  const U1=en1.deger*0.92;
  /* T3: tek vuruş eğilimi (±0,5·egilimGuc puan) gelişine oynamayı kolaylaştırır ya da zorlaştırır */
  const tau=0.12+0.42*(1-p.oz.karar),P1=1/(1+Math.exp((U2-U1-MOTOR_AYAR.tekVurus-0.5*MOTOR_AYAR.egilimGuc*profilEgilim(p,'tekVurus'))/tau));
  if(m.rast()>=P1)return{sec:null,hedef};
  return{sec:{tur:en1.tur,hx:en1.hx,hz:en1.hz,tip:en1.tip,alici:en1.alici,varisHizi:en1.varis,mod:en1.mod,ex:en1.ex,ez:en1.ez,es:en1.es,
    guncelle:true,ilk:true,tekDokunus:true,P:en1.P,Pk:en1.Pk,alt:en1.alt,marj:en1.marj},hedef};   /* P, Pk, alt salt okunur (ölçüm) */
}
/* ---- kafa: ceza sahasında kaleye, geride uzaklaştırma, ileride arkadaşa indirme ya da koşana uzatma ---- */
function kafaKarari(m,p){
  const b=m.ball,d=m.dir[p.team],u=b.x*d,w=b.z,baski=baskiAltinda(m,p);
  /* Z2b (sahne&2; kutuphane/F F.1.3): ön direk sıyırması — kornerin rutininde sıyırıcı, kornerden sonraki ilk 2,5 sn'de ve dar açıda (ortadan 1,6 m'den
     yanda) topu kafayla arka direğe uzatır; oradaki en yakın arkadaş alıcıdır. Rastlantı çekmez */
  if(MOTOR_AYAR.sahne&2){const R=p.duranRol,DS=m._duranSonrasi;
    if(R&&R.siyir&&DS&&DS.takim===p.team&&DS.tur==='korner'&&m.t-DS.t0<2.5&&u>PL-9&&Math.abs(w-MZ)>1.6){const hx=d*(PL-4.2),hz=MZ-(R.siyirYan||1)*2.6;
      let q=null,qd=9;for(const o of m.teams[p.team]){if(o===p||!o.oyunda||o.rol==='GK')continue;const dd=hyp(o.x-hx,o.z-hz);if(dd<qd){qd=dd;q=o;}}
      if(q)return{tur:'pas',alt:'siyir',hx,hz,v:7.5,vy:2.2,alici:q};}}
  if(u>PL-16&&Math.abs(w-MZ)<12){const x=xG(u,w,'kafa',baski*0.5);   /* T6e: ceza sahası çizgisine kadar (eskiden 14 m); 14–16 m'de gol beklentisi çoğu zaman 0,03 altı */
    if(x>0.03||u>PL-7){
      /* hedef: köşeler ve yükseklik; kaleciTahmin ile en açık yer (sıcaklıklı) */
      const gk=m.kaleci(1-p.team),hx=d*PL,v=9+p.oz.kafa*5,sig=(0.05+0.1*(1-p.oz.kafa))*(1+baski*0.5)*(1+MOTOR_AYAR.kafaDonus*hvDonus(b.vx,b.vz,hx-b.x,MZ-b.z));   /* T8b: saptırma */
      let top=0,en=0;const Ls=[];
      for(const zt of[-3.0,-2.0,2.0,3.0])for(const yt of[0.3,1.7]){const L=hyp(hx-b.x,MZ+zt-b.z),sz=Math.max(0.05,sig*L),sy=Math.max(0.05,sig*6*L/v);
        const Pon=(normalDagilim((GW2-0.12-zt)/sz)-normalDagilim((-GW2+0.12-zt)/sz))*normalDagilim((GH-0.12-yt)/sy);
        const Pg=Pon*(1-(gk.oyunda?kaleciTahmin(m,gk,MZ+zt,yt,L/v).P:0));Ls.push({zt,yt,Pg});if(Pg>en)en=Pg;}
      for(const c of Ls){c.a=Math.exp((c.Pg-en)/0.03);top+=c.a;}
      let r=m.rast()*top,c=Ls[Ls.length-1];for(const c2 of Ls){r-=c2.a;if(r<=0){c=c2;break;}}
      const hz=MZ+c.zt,L=hyp(hx-b.x,hz-b.z),T=L/v,hy=c.yt;
      return{tur:'sut',hx,hz,v,vy:(hy-b.y+0.5*G*T*T)/T,xg:x,hy};}}
  /* baskı altındaki savunmacının kafası güvenliğe, gerekirse taça gider (birleştirme 2026-10-03). T6c: kendi üçte birimizde ya da savunmacının
     kendi yarısında yalnız rakip yakınken (baskı 0,12 / 0,3 üstü: ~4 / 3,5 m içinde) uzaklaştırır; baskısız kafa arkadaşa gider (indirme) */
  if((u<-PL+30&&baski>0.12)||(p.rol==='DEF'&&u<5&&baski>0.3)||(baski>0.7&&u<10)){   /* T6e: panik uzaklaştırması rakip yarının derinliğinde yok */const yan=w<MZ?-1:1,ds=baski>0.45,hx=b.x+d*(16+m.rast()*12),hz=clamp(b.z+yan*(4+m.rast()*12),ds?-3:3,ds?PW+3:PW-3);
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
