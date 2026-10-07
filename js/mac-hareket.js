/* ============ Chairman — maç motoru: hareket ve beden (mantık, çizimsiz) ============
   Sahibi: C akışı (2026-10-03 maç motoru güncellemesi). Oyuncunun hedefe gidişi, ivme ve dönüş, gövde çarpışmaları, yorgunluk, topu kovalama,
   top sürme dokunuşları ve pres. varisZamani bütün akışların kullandığı varış süresi modelidir; moveP ile tutarlı kalmalıdır (B↔C sözleşmesi).
   C1 (2026-10-03): ivme hızın yönünde ve ona dik ayrı sınırlanır — ileri itiş A(v)=(ivme+2,6·hız)·(1−v/vmax)^0,8, fren, çeviklikten yanal
   tutunma; hızlıyken keskin dönüşte önce fren; yana adım ~%52, geri geri ~%42 tavan. Sprint enerjisi (p.enerji) tepe hızı düşürür, denge
   (p.denge) çarpışma ve mücadelede azalır. Karşılayan koşarak varır, takım arkadaşları birbirinin içinden geçmez, yanından dolaşır.
   varisZamani kapalı biçimlidir (tepki + dönüş + ivmelenme + sabit hız); araclar/senaryolar/c-hareket.js moveP ile karşılaştırır.
   T1 (2026-10-03, insan gibi hareket): hedef yazan her yer eforu da yazar (eforVer; 0–1). İzin verilen ivme lerp(rahat, azami, efor^1,5),
   ivme vektörü sarsıntı sınırıyla (J·dt) değişir; ileri itiş a(v)=A0·(1−v/S0) (A0 çabukluk, S0 hız; ivme tipi boy, yapı, çeviklikten).
   Eforu 0,8'in altındaki saha oyuncusu hız kiplerinden (dur, yürü, tırıs, koş, hızlı) birini seçer, kip en az 0,8 sn sürer (p.kip çizime gider).
   Bölge hedefi oyuncunun düşünme anında güncellenir ve ölü bölgeyle kararlıdır (hedefVer). Efor verilmeyen hareket (maç öncesi, hakem, kenar)
   eforu hız oranından alır ve eski sürekli hız seçimini kullanır. */
'use strict';
/* hızlı matematik: Node vm bağlamında Math ve global işlev bildirimlerine erişim pahalıdır (her çağrıda genel nesne araması); sık çağrılan
   hareket ve varış hesapları sabitlere bağlı kopyaları kullanır (sonuç aynıdır) */
const hrkKok=Math.sqrt,hrkUs=Math.pow,hrkMin=Math.min,hrkMax=Math.max,hrkAbs=Math.abs,hrkAtan2=Math.atan2,hrkCos=Math.cos,hrkSin=Math.sin,
  hrkTaban=Math.floor,hrkIsaret=Math.sign,HRK_PI=Math.PI,HRK_2PI=2*Math.PI;
const hrkHyp=(a,b)=>hrkKok(a*a+b*b);
const hrkAciNorm=a=>a-HRK_2PI*hrkTaban((a+HRK_PI)/HRK_2PI),hrkAciFark=(a,b)=>hrkAciNorm(a-b);
ayarEkle('C',{
  ivme:6.0,                    // T1: ivme–hız profilinin A0 tabanı (m/sn²; hız +1,1, çeviklik +0,7, ivme tipi ±0,45; 6,0–7,8); a(v)=A0·(1−v/S0)
  ivmeRahat:2.3,               // T1: düşük eforda ileri ivme (m/sn²; yer tutma ve destek koşusu 3 m/sn² altında kalsın)
  frenRahat:3.0,               // T1: düşük eforda fren (m/sn²)
  yanRahat:3.0,                // T1: düşük eforda yanal tutunma (m/sn²)
  varisRahat:2.4,              // T1: düşük eforda hedefe varırken yavaşlama (m/sn²; efor 1'de varisFren)
  sarsinti:30,                 // T1: ivmenin değişim sınırı (m/sn³); efor 1'de sarsintiAzami
  sarsintiAzami:80,
  kipSure:0.8,                 // T1: hız kipinin en kısa süresi (sn; duruş ve depar hariç)
  kipDur:2.5,                  // T1: dönüş koşusu hedefe bu kadar (m) yaklaşınca biter, oyuncu yine yürür
  donusYerinde:5.5,            // T1: yerinde dönüş hızı (rad/sn; çeviklikle +2,5)
  dinlenUzak:30,               // T1: topa bu kadar uzak ve tehdit yokken oyuncu dinlenir (yürür, yüzü topa) (m)
  hedefOlu:1,                  // T1: kararlı hedefin ölü bölgesi: clamp(hedefOlu + 0,08·topaUzaklık, hedefOlu, hedefOluAzami) (m)
  hedefOluAzami:4,
  kovalaPay:0.5,               // T1: topa rakibinden bu kadar (sn) geç yetişecek kovalayan sakin yaklaşır (efor 0,5)
  dinlenKos:18,                // T1: dinlenen oyuncu hedefi bu kadar (m) uzaklaşınca yerine koşar
  tepkiCarpan:1.0,             // T1: kişisel tepki süresinin çarpanı (0,25–0,7 sn)
  eforUs:4,                    // T1: ivme sınırının eforla artışı lerp(rahat, azami, efor^eforUs) (plan 1,5; 4 ile yer tutma ve destek ivmesi ≤3 m/sn²)
  kipKos:8,                    // T1: yerindeki oyuncunun hedefi bu kadar (m) uzaklaşınca yerine koşar (2 katından uzaksa hızlı)
  fren:7.5,                   // fren ivmesi (m/sn²; hız özelliğiyle +1,5); itiş + yanal toplamı da bunu aşamaz (C1)
  yanTutus:6.0,                // yanal tutunma (m/sn²; çeviklikle +3,5), hızla %30'a kadar azalır (C1)
  enerjiHarca:0.05,            // tepe hızda sprint enerjisinin saniyelik azalması (0,85·vmax üstünde) (C1)
  enerjiTopla:0.05,            // dururken sprint enerjisinin saniyelik dolması (0,55·vmax altında) (C1)
  yanTavan:0.52,               // yana adımda tepe hıza oran (C1)
  geriTavan:0.42,              // geri geri koşuda tepe hıza oran (C1)
  donusSiniri:1,               // dönüş hızı sınırının yarıçap çarpanı (0: yok) (C1)
  ayakBas:0.35,                // hızlıyken >100° dönüşte yanal ivme payı (ayak basıp fren) (C1)
  varisHizi:0.4,               // karşılayanın topa varış hızı (tepe hıza oran; zamanı ancak yetiyorsa) (C1)
  varisFren:5.5,               // hedefe varırken yavaşlama (m/sn²; MM1 değeri)
  jokeyMesafe:1.0,             // jokey mesafesinin çarpanı (1,6–2,4 m) (C2)
  calimIstegi:4                // önü kapalı hızlı sürüşte çalım manevrasına girme sıklığı (1/sn; top sürme becerisiyle) (C2)
});
/* çeviklik (0–1): top sürme, hız ve hafiflikten türetilir (kadro verisi değişmez) */
const hrkCeviklik=p=>{if(p._cev!=null)return p._cev;const o=p.oz||{},s=o.surus!=null?o.surus:0.5,h=o.hiz!=null?o.hiz:0.5;
  return p._cev=clamp(0.5*s+0.3*h+0.2*clamp((95-kutle(p))/30,0,1),0,1);};
/* C akışının kişi başı ara alanları ilk harekette hep aynı sırayla eklenir (gizli sınıf tek kalsın, erişim hızlı olsun) */
const hrkHazirla=p=>{kutle(p);p._cev=null;hrkCeviklik(p);p._hk=null;p._kacKare=-1;p._kacX=0;p._kacZ=0;p._varisHiz=0;p._varisKare=-1;p._tavirKare=-1;
  p._algS=null;p._algVx=0;p._algVz=0;p._omuzT=-9;p._calim=null;p._acikBas=0;p._acikKare=-9;p._gecS=null;};
/* oyuncunun hızdan bağımsız hareket sabitleri (bir kez): ivme–hız profili A0 (m/sn²) ve S0 (m/sn), fren B, yanal tutunma tabanı ly, yerinde dönüş w0.
   İvme tipi (T1): kısa, çevik ve hafif oyuncu patlayıcıdır (A0 yüksek, S0 düşük), uzun ve iri olan uzun adımlı (tersi); ötekiler dengeli */
const hrkSabit=p=>{const k=p._hk;if(k)return k;if(k===undefined)hrkHazirla(p);const h=p.oz&&p.oz.hiz!=null?p.oz.hiz:0.5,c=hrkCeviklik(p),A=MOTOR_AYAR;
  const tip=clamp((1-(p.boy||1))*6+(c-0.5)*1.2-(((p.kayit&&p.kayit.yapi)||1)-1)*4,-1,1);
  return p._hk={A0:clamp(A.ivme+1.1*h+0.7*c+0.45*tip,6.0,7.8),S0:clamp(p.maxSpd+1.25-0.3*tip,8.6,10.0),B:A.fren+1.5*h,ly:A.yanTutus+3.5*c,w0:A.donusYerinde+2.5*c};};
/* o anki tepe hız: sprint enerjisi ve yorgunluk düşürür */
const hrkTepe=p=>p.maxSpd*(0.86+0.14*(p.enerji!=null?p.enerji:1))*(1-0.12*(p.yorgunluk||0));
/* gövdenin baktığı yöne göre hız tavanı (oran; c: bakış ile gidiş yönü arasındaki açının kosinüsü): ileri 1, yana adım ~0,52, geri geri ~0,42 */
const hrkYonTavan=c=>{const y=MOTOR_AYAR.yanTavan;return c>=0?y+(1-y)*c:y+(y-MOTOR_AYAR.geriTavan)*c;};
/* yanal tutunma (k=v/vmax) */
const hrkYanal=(p,k)=>hrkSabit(p).ly*(1-0.3*hrkMin(1,k));
/* ivmelenerek koşu süresi (T1): dv/dt=A0·(1−v/S0), τ=S0/A0; v(t)=S0−(S0−v0)·e^(−t/τ), yol(t)=S0·t−τ·(S0−v0)·(1−e^(−t/τ)); tepe hıza (vm<S0)
   ta=τ·ln((S0−v0)/(S0−vm)) sürede varılır, sonra sabit hız. Tepe hıza varmadan biten koşuda süre boyutsuz biçimden (ν=v0/S0, δ=D/(S0·τ),
   s=t/τ: δ=s−(1−ν)(1−e^(−s))) yüklemede ikiye bölmeyle çözülüp √δ ve ν üzerinde tablolanır */
const HRK_KT=(()=>{const NU=24,NS=48,NM=0.97,SM=hrkKok(3.4),T=new Float64Array((NU+1)*(NS+1));
  for(let i=0;i<=NU;i++){const nu=i/NU*NM;
    for(let j=0;j<=NS;j++){const d=(j*SM/NS)**2;let a=0,b=d+2;
      for(let n=0;n<60;n++){const s=(a+b)/2;if(s-(1-nu)*(1-Math.exp(-s))<d)a=s;else b=s;}
      T[i*(NS+1)+j]=(a+b)/2;}}
  return{NU,NS,NM,SM,T};})();
const hrkKosuSuresi=(D,v0,vm,A0,S0)=>{
  if(D<=0)return 0;
  if(vm>0.97*S0)vm=0.97*S0;if(v0>=vm)return D/vm;if(v0<0)v0=0;
  const tau=S0/A0,ta=tau*Math.log((S0-v0)/(S0-vm)),da=S0*ta-tau*(vm-v0);
  if(D>=da)return ta+(D-da)/vm;
  const K=HRK_KT,nu=v0/S0/K.NM*K.NU,i=hrkMin(K.NU-1,hrkTaban(nu)),fi=nu-i,N1=K.NS+1;
  const sj=hrkKok(hrkMin(D/(S0*tau),3.4))/K.SM*K.NS,j=hrkMin(K.NS-1,hrkTaban(sj)),fj=sj-j,T=K.T,o=i*N1+j;
  return((T[o]*(1-fj)+T[o+1]*fj)*(1-fi)+(T[o+N1]*(1-fj)+T[o+N1+1]*fj)*fi)*tau;
};
/* hız kipleri (T1): dur, yürü, tırıs, koş, hızlı, depar (tepe hız). Çizim p.kip'i okur (boşta pozlar) */
const HRK_KIP=['dur','yuru','tiris','kos','hizli','depar'],HRK_KIP_HIZ=[0,1.6,3.2,5.0,6.5,99];
const hrkKipAdi=s=>s<0.2?'dur':s<2?'yuru':s<4?'tiris':s<5.75?'kos':s<7?'hizli':'depar';
/* çalımda topun itileceği açı (rakibe göre): top rakibin ~1,25 m yanından geçsin (yakın rakipte daha geniş), en az a0, en çok 1,2 rad */
const hrkCalimAci=(L,a0)=>hrkMin(1.2,hrkMax(a0,L>1.3?Math.asin(1.25/L)+0.1:1.2));
/* acos yaklaşığı (Abramowitz–Stegun 4.4.45, hata < 1e-4) */
const hrkAcos=x=>{const a=hrkAbs(x),r=hrkKok(1-a)*(1.5707288+a*(-0.2121144+a*(0.074261-0.0187293*a)));return x>=0?r:HRK_PI-r;};
/* bir oyuncunun bir noktaya varış süresi (sn), kapalı biçim (O(1)): tepki süresince mevcut hızıyla gider (bu arada hedefin yanından geçerse
   o an); sonra hedef yandaysa dönebileceği hıza frenler (v²≤a·R), hızının yönünü yanal tutunmayla çevirir (hızlıyken keskin dönüşte ayak
   basar), sonra ivmelenir ve tepe hızda koşar. menzil: ayağın/elin uzandığı mesafe. Karşılayan gibi koşarak varır (moveP'de _varisHiz).
   Katsayılar (HRK_VZ) c-hareket senaryosuyla moveP benzetimine oturtuldu */
const HRK_VZ={vc:0.55,don:0.65,il:0.985,ayak:0.97};   // T1: yeni ivme–hız profili ve sarsıntı sınırıyla yeniden oturtuldu
const varisZamani=(p,x,z,menzil,tepki)=>{
  const tp=tepki!=null?tepki:0.2,mz=menzil||0,rx=p.x+p.vx*tp,rz=p.z+p.vz*tp,dx=x-rx,dz=z-rz,L0=hrkHyp(dx,dz),D=L0-mz;
  if(D<=0)return tp;
  const hk=p._hk||hrkSabit(p),sp=hrkHyp(p.vx,p.vz),vm=hrkTepe(p),A0=hk.A0*(1-0.15*(p.yorgunluk||0)),S0=hk.S0;
  if(sp<=0.5)return tp+hrkKosuSuresi(D,0,vm,A0,S0);
  if(tp>0){const wx=x-p.x,wz=z-p.z,s1=(wx*p.vx+wz*p.vz)/sp;if(s1>0&&s1<sp*tp){const q2=wx*wx+wz*wz-s1*s1;if(q2<mz*mz)return hrkMax(0,s1-hrkKok(mz*mz-q2))/sp;}}
  const cs=clamp((dx*p.vx+dz*p.vz)/(L0*sp),-1,1);
  if(cs>=0.985)return tp+hrkKosuSuresi(D,sp*cs,vm,A0,S0);
  const K=HRK_VZ,th=hrkAcos(cs),R=cs>0?L0/(2*hrkMax(hrkKok(1-cs*cs),0.05)):L0*0.5;
  const v1=hrkMin(sp,hrkMax(1.6,hrkKok(hk.ly*(1-0.3*hrkMin(1,sp/vm))*R)*K.vc));
  const tb=(sp-v1)/hk.B,db=(sp*sp-v1*v1)/(2*hk.B),tt=v1*th/(hk.ly*(1-0.3*hrkMin(1,v1/vm))*(cs<-0.17&&sp>3?K.ayak:1))*K.don;
  return tp+tb+tt+hrkKosuSuresi(hrkMax(0,D-db*cs-v1*tt*hrkSin(th)/th*K.il),v1,vm,A0,S0);
};
Object.assign(Match.prototype,{
  /* beden adımı: yorgunluk koştukça (özellikle depar) birikir, dayanıklılık yavaşlatır. Kısa süreli depar yorgunluğunu sprint enerjisi taşır;
     yorgunluk maç boyu birikendir (C1: birikim 2/3'e indi, top daha uzun oyunda kalıyor) */
  bedenAdim(dt){
    for(const p of this.players)if(p.oyunda){const k=p.spd/p.maxSpd;p.yorgunluk=hrkMin(1,p.yorgunluk+dt*(0.00053+0.0016*k*k)*(1.25-p.oz.dayaniklilik));}
  },
  /* ============ hareket ============ */
  hareketHepsi(dt,carpismaYok){
    const P=this.players;
    /* takım düzeni sırasında geçilen savunmacının taktik faulü burada (düzen ortasında oyun durmasın) */
    if(this._gecFaul){const g=this._gecFaul;this._gecFaul=null;if(this.phase==='play')this.gecildiFaulu(g[0],g[1]);}
    /* oyunda takım arkadaşları çarpışma rotasındaysa yanından dolaşır (hareketten önce hesaplanır) */
    if(!carpismaYok&&this.phase==='play')this.kacinmaHesapla();
    this._hrkOyun=!carpismaYok;
    for(const p of P)if(p.oyunda||p.cikiyor)this.moveP(p,dt);
    for(const r of this.refs)this.moveP(r,dt);
    for(const Y of this.yedekler)for(const p of Y)if(!p.oturuyor)this.moveP(p,dt);
    if(this.kenar)for(const p of this.kenar)if(!p.oturuyor)this.moveP(p,dt);
    if(carpismaYok)return;
    /* gövdeler: kütle (boy, yapı, sertlik) çarpışmayı paylaştırır. Üst üste binme ağır olanı daha az iter; birbirine doğru gelen hızların
       ortak kısmı paylaşılır (esnek olmayan çarpışma): güçlü oyuncu omuz omuza mücadelede yerini korur. Hakemler de engeldir.
       Çarpışmanın hız değişimi dengeyi bozar (C2) */
    const L=this._govdeler||(this._govdeler=[]);L.length=0;
    for(const p of P)if(p.oyunda&&!(p.eylem&&p.eylem.ad==='ucus'))L.push(p);
    for(const r of this.refs)L.push(r);
    for(let i=0;i<L.length;i++){const a=L[i],ia=1/(a._kutle||kutle(a));
      for(let j=i+1;j<L.length;j++){const c=L[j],dx=c.x-a.x,dz=c.z-a.z,d2=dx*dx+dz*dz;
        if(d2>=0.49||d2<=1e-6)continue;
        const dd=hrkKok(d2),ux=dx/dd,uz=dz/dd,ic=1/(c._kutle||kutle(c)),w=(0.7-dd)*0.5/(ia+ic);
        a.x-=ux*w*ia;a.z-=uz*w*ia;c.x+=ux*w*ic;c.z+=uz*w*ic;
        const vr=(c.vx-a.vx)*ux+(c.vz-a.vz)*uz;
        if(vr<0){const J=-vr*0.8/(ia+ic);a.vx-=J*ia*ux;a.vz-=J*ia*uz;c.vx+=J*ic*ux;c.vz+=J*ic*uz;
          if(this.phase==='play'){const va=J*ia,vc=J*ic;if(va>1.2&&a.tur==='oyuncu')this.dengeBoz(a,0.16*(va-1.2),-ux,-uz,'takilma',c);if(vc>1.2&&c.tur==='oyuncu')this.dengeBoz(c,0.16*(vc-1.2),ux,uz,'takilma',a);}}}}
    if(this.phase==='play')this.omuzlar(dt);
  },
  /* takım arkadaşları birbirine doğru koşuyorsa (0,7 sn içinde 0,9 m'den yakın geçecekse) yanlara ayrılır; topu süren ve vuran yolunu değiştirmez */
  kacinmaHesapla(){
    const b=this.ball,k=this.kare;
    for(let t=0;t<2;t++){const T=this.teams[t];
      for(let i=0;i<T.length;i++){const a=T[i];if(!a.oyunda||a.rol==='GK')continue;
        for(let j=i+1;j<T.length;j++){const c=T[j];if(!c.oyunda||c.rol==='GK')continue;
          const rx=c.x-a.x,rz=c.z-a.z;if(rx*rx+rz*rz>16)continue;
          const wx=c.vx-a.vx,wz=c.vz-a.vz,w2=wx*wx+wz*wz;if(w2<1)continue;
          const tc=-(rx*wx+rz*wz)/w2;if(tc<=0||tc>0.7)continue;
          const mx=rx+wx*tc,mz=rz+wz*tc,dm=hrkHyp(mx,mz);if(dm>0.9)continue;
          const w=hrkKok(w2),nx=dm>0.05?mx/dm:-wz/w,nz=dm>0.05?mz/dm:wx/w,g=(0.9-dm)/0.9*0.8;
          const sa=a===b.sahip||(a.eylem&&(a.eylem.ad==='vurus'||a.eylem.kilit)),sc=c===b.sahip||(c.eylem&&(c.eylem.ad==='vurus'||c.eylem.kilit));
          const ga=sa?0:sc?g*2:g,gc=sc?0:sa?g*2:g;
          if(a._kacKare!==k){a._kacKare=k;a._kacX=0;a._kacZ=0;}if(c._kacKare!==k){c._kacKare=k;c._kacX=0;c._kacZ=0;}
          a._kacX-=nx*ga;a._kacZ-=nz*ga;c._kacX+=nx*gc;c._kacZ+=nz*gc;}}}
  },
  /* hedefe yürü/koş: varışta yavaşla (karşılayan koşarak varır), gövde yönü sınırlı hızda döner, yana ve geri adım yavaştır.
     İvme hızın yönünde (itiş ya da fren) ve ona dik (yanal tutunma) ayrı sınırlanır. T1: sınırlar eforla rahat değerden azamiye çıkar,
     ivme sarsıntı sınırıyla değişir; düşük eforlu saha oyuncusu hız kipi seçer */
  moveP(p,dt){
    if(p._hk===undefined)hrkSabit(p);
    if(p.kickCd>0)p.kickCd-=dt;
    const e=p.eylem;
    if(e)this.eylemIlerle(p,e,dt);
    const e2=p.eylem,oyun=this._hrkOyun,A=MOTOR_AYAR,hk=p._hk||hrkSabit(p);
    if(oyun&&p.denge<1)p.denge=hrkMin(1,p.denge+dt*(e2&&e2.kilit?0.35:0.9));
    if(e2&&e2.kilit){/* düşme, yerde yatma, kayma, uçuş: kendi hareketi */
      p.x+=p.vx*dt;p.z+=p.vz*dt;const s=hrkHyp(p.vx,p.vz),ns=hrkMax(0,s-(e2.fren||9)*dt);if(s>0){p.vx*=ns/s;p.vz*=ns/s;}p.spd=ns;
      p._iax=0;p._iaz=0;p.kip=hrkKipAdi(ns);return;}
    /* tavır (jokey, koru) her karede tazelenir; tazelenmediyse kalkar */
    if((p.tavir==='jokey'||p.tavir==='koru'||p.tavir==='bekle')&&p._tavirKare!==this.kare)p.tavir=null;
    /* tünelden geçerken önce ağza yürü (tribün duvarının içinden geçmesin) */
    let tx=p.tx,tz=p.tz;const T=this.tunel,ic=p.z<T.z+0.5;
    if(ic!==(tz<T.z+0.5)){const ax=T.x+clamp(p.x-T.x,-0.7,0.7);
      if(ic){tx=ax;tz=hrkAbs(p.x-ax)>0.2?p.z:T.z+2;}else if(hrkHyp(p.x-ax,p.z-T.z-1.5)>0.6){tx=ax;tz=T.z+1.5;}else tx=ax;}
    const dx=tx-p.x,dz=tz-p.z,d=hrkHyp(dx,dz),vm=hrkTepe(p);
    /* efor (T1): bu karede verildiyse o, verilmediyse hız oranından (maç öncesi, hakem, kenar; eski sürekli hız seçimi) */
    const acik=p._eforK===this.kare,ef=acik?p.efor:p.hizOran>=0.95?1:0.2+0.6*p.hizOran,w=ef>=1?1:hrkUs(ef,A.eforUs),saha=p.tur==='oyuncu'&&p.rol!=='GK';
    if(!acik)p.efor=ef;
    /* varış hızı: karşılayan (kovala) bu karede verdiyse hedefe koşarak varır, yoksa durur; yavaşlama eforla rahattan azamiye */
    const vA=p._varisKare===this.kare?p._varisHiz:0,aV=A.varisRahat+(A.varisFren-A.varisRahat)*w;
    let hedefHiz=d<0.04?0:hrkMin(vm*p.hizOran,hrkKok(vA*vA+aV*2*hrkMax(0,d-0.03))+0.2);
    /* hız kipi: eforu 0,8'in altındaki saha oyuncusu */
    /* kovalayan (bu karede karşılama verdi) ve eylemdeki (vuruş hazırlığı) düşük eforda kip seçmez: rahat ivmeyle hedefe kadar gider */
    if(acik&&saha&&ef<0.8&&!e2&&p._varisKare!==this.kare)hedefHiz=hrkMin(hedefHiz,this.kipSec(p,d,ef,vm,dt));else p._kipT=0;
    /* bakış: açıkça verilmişse ona; yavaş ve kısa hareketlerde bakılan şeye (topa); koşuda gidilen yöne */
    let yh=p.yonHedef;
    if(yh==null){
      /* hızlı gitmesi gereken oyuncu gideceği yöne döner ve koşar; bir iki adımlık ayarda yüzü topa (bakılan şeye) dönük kalır */
      if(hedefHiz>2.8&&d>1.2)yh=hrkAtan2(dz,dx);
      else if(p.bak){const bx=p.bak.x-p.x,bz=p.bak.z-p.z;if(bx*bx+bz*bz>0.04)yh=hrkAtan2(bz,bx);}
      else if(hedefHiz>0.4)yh=hrkAtan2(dz,dx);
    }
    /* dönüş hızı: saha oyuncusu yerinde 5,5–8 rad/sn (çeviklik), hızlanınca yarıya yakın; kaleci ve diğerleri eski değer */
    if(yh!=null){const k=hrkMin(1,p.spd/p.maxSpd),f=hrkAciFark(yh,p.yon),oran=(saha&&!(e2&&e2.ad==='vurus')?hk.w0*(1-0.5*k):11-7*k)*dt;p.yon=hrkAciNorm(p.yon+clamp(f,-oran,oran));}
    let ux=0,uz=0;if(d>0.04){ux=dx/d;uz=dz/d;}
    if(p._kacKare===this.kare&&d>0.6){ux+=p._kacX;uz+=p._kacZ;const n=hrkHyp(ux,uz)||1;ux/=n;uz/=n;}
    let s=hrkMin(hedefHiz,vm*hrkYonTavan(ux*hrkCos(p.yon)+uz*hrkSin(p.yon)));
    /* ivme sınırları: havada (sıçrama) çok az, sendelerken ve denge düşükken az */
    const sp=hrkHyp(p.vx,p.vz),dk=(p.yuk>0.02?0.25:1)*(e2&&e2.ad==='sendele'?0.45+0.25*(1-(e2.siddet||0.5)):1)*(0.65+0.35*clamp(p.denge!=null?p.denge:1,0,1));
    const LyA=hrkYanal(p,sp/vm),LyR=hrkMin(A.yanRahat,LyA),Ly0=(LyR+(LyA-LyR)*w)*dk;
    /* dönüş hızı: hedef yakın ve yandaysa, hıza dik tutunmayla dönebileceği hıza (v²≤a·R, R=d/(2·sinθ)) frenler; yörüngeye girip dolanmaz */
    if(sp>2&&d>0.3&&A.donusSiniri){const cs=(ux*p.vx+uz*p.vz)/sp;if(cs<0.9){const sn=hrkKok(hrkMax(0,1-cs*cs)),R=cs>0?(d+1)/(2*hrkMax(sn,0.05)):d*0.5;s=hrkMin(s,hrkMax(1.6,hrkKok(Ly0*R*A.donusSiniri)));}}
    p.kip=hrkKipAdi(s);
    let ax=ux*s-p.vx,az=uz*s-p.vz;
    /* ileri itiş a(v)=A0·(1−v/S0) (yorgunluk düşürür); rahat değer bunu aşamaz */
    const Aa=hk.A0*(1-0.15*(p.yorgunluk||0))*hrkMax(0,1-sp/hk.S0),Ar=hrkMin(A.ivmeRahat,Aa);
    const Ac=(Ar+(Aa-Ar)*w)*dk*dt,B=(A.frenRahat+(hk.B-A.frenRahat)*w)*dk*dt,Ly=Ly0*dt;
    if(sp<0.6){const al=hrkHyp(ax,az),lim=s>sp?hrkMin(B,ef>=0.8?hrkMax(Ac,Ly):Ac):B;if(al>lim){ax*=lim/al;az*=lim/al;}}
    else{const ex=p.vx/sp,ez=p.vz/sp;let ap=ax*ex+az*ez,qx=ax-ap*ex,qz=az-ap*ez;
      /* hızlıyken keskin dönüş (>100°): ayak basılır, önce fren, sonra yeni yöne */
      if(sp>3&&s>0.5&&ux*ex+uz*ez<-0.17){qx*=A.ayakBas;qz*=A.ayakBas;}
      const aq=hrkHyp(qx,qz);
      /* itiş ve yanal ayrı sınırlanır, toplamı ayağın tutunmasını (fren ivmesi kadar) aşamaz; frende fren–yanal elipsi */
      if(ap>=0){if(ap>Ac)ap=Ac;let aq2=aq;if(aq2>Ly){qx*=Ly/aq2;qz*=Ly/aq2;aq2=Ly;}const t2=ap*ap+aq2*aq2;if(t2>B*B){const k=B/hrkKok(t2);ap*=k;qx*=k;qz*=k;}}
      else{const q=(ap/B)*(ap/B)+(aq/Ly)*(aq/Ly);if(q>1){const k=1/hrkKok(q);ap*=k;qx*=k;qz*=k;}}
      ax=ap*ex+qx;az=ap*ez+qz;}
    /* sarsıntı sınırı: ivme vektörü karede en çok J·dt değişir (hız eğrisi çan biçimli; efor 1'de J azami) */
    const J=(A.sarsinti+(A.sarsintiAzami-A.sarsinti)*ef*ef*ef)*dt*dt,jx=ax-p._iax,jz=az-p._iaz,jl=hrkHyp(jx,jz);
    if(jl>J){ax=p._iax+jx*J/jl;az=p._iaz+jz*J/jl;}
    p._iax=ax;p._iaz=az;
    p.vx+=ax;p.vz+=az;p.x+=p.vx*dt;p.z+=p.vz*dt;p.spd=hrkHyp(p.vx,p.vz);
    /* sprint enerjisi: 0,85·vmax üstünde azalır, 0,55·vmax altında dolar (dayanıklılık etkiler); oyun dışında (devre arası) dolar */
    if(p.tur==='oyuncu'){const k=p.spd/p.maxSpd;
      if(!oyun){if(p.enerji<1)p.enerji=hrkMin(1,p.enerji+dt*0.2);}
      else if(k>0.85)p.enerji=hrkMax(0,p.enerji-dt*MOTOR_AYAR.enerjiHarca*(k-0.85)/0.15*(1.3-0.6*(p.oz.dayaniklilik||0.6)));
      else if(k<0.55&&p.enerji<1)p.enerji=hrkMin(1,p.enerji+dt*MOTOR_AYAR.enerjiTopla*(1-0.6*k/0.55)*(0.7+0.6*(p.oz.dayaniklilik||0.6)));}
  },
  /* ============ T1: efor, hız kipi, kararlı hedef ============ */
  /* hedef yazan her yer eforu da yazar (0–1): kovalama, pres, markaj, derin koşu, vuruş hazırlığı 1; karşı pres 0,9; destek 0,6; bölge 0,25–0,5;
     duran top yerleşimi 0,4. Bu karede yazılmadıysa moveP eforu hız oranından alır */
  eforVer(p,ef){p.efor=ef;p._eforK=this.kare;},
  /* hız kipi: yerindeki oyuncu yürür ya da durur; hedefi kipKos'tan uzaklaşınca kısa ve net bir koşuyla (koş; 2·kipKos'tan uzaksa hızlı)
     yerine döner, kipDur'a girince yine yürür. Dinlenmede (efor <0,2) eşik dinlenKos ve en çok koş; destekte (≥0,6) eşik yarı.
     Kip en az kipSure sürer; duruşa geçiş beklemez. Dönen: hız tavanı (m/sn) */
  kipSec(p,d,ef,vm,dt){
    const A=MOTOR_AYAR;p._kipT-=dt;
    let i=0;
    if(d>0.35){const esik=ef<0.2?A.dinlenKos:ef>=0.6?A.kipKos*0.5:A.kipKos;
      if(p._kipI>=2?d>A.kipDur:d>esik)i=ef>=0.2&&d>2*A.kipKos?4:3;
      else i=1;}
    if(i!==p._kipI&&(i===0||p._kipT<=0)){p._kipI=i;p._kipT=A.kipSure;}
    return HRK_KIP_HIZ[p._kipI];
  },
  /* kararlı hedef: bölge hedefi oyuncunun düşünme anında (0,3–0,6 sn; oyuncuya göre kaydırılmış) güncellenir; yeni hedef eskisine
     clamp(1+0,08·topaUzaklık, 1, 4) m'den yakınsa eski kalır. Topa 12 m'den yakınken her kare düşünür; eforu 0,8 üstü görevde hedef doğrudan.
     xSerbest: x hep güncel (savunma çizgisi düz kalsın), ölü bölge yalnız yana; zorla: hemen güncelle (ofsayttan dönüş) */
  hedefVer(p,x,z,ef,xSerbest,zorla){
    this.eforVer(p,ef);
    const k=this.kare;
    if(ef>=0.8||zorla||p._hdfK!==k-1){p._hdfX=x;p._hdfZ=z;p.dusunT=this.t;}
    else{const A=MOTOR_AYAR,b=this.ball,db=hrkHyp(p.x-b.x,p.z-b.z),P=p._dusP||(p._dusP=18+((this.tohum+p.n*13+p.team*5)%19));
      if(db<12||(k+p.n*7+p.team*3)%P===0){p.dusunT=this.t;
        if((xSerbest?hrkAbs(z-p._hdfZ):hrkHyp(x-p._hdfX,z-p._hdfZ))>clamp(A.hedefOlu+0.08*db,A.hedefOlu,A.hedefOluAzami)){p._hdfX=x;p._hdfZ=z;}}
      if(xSerbest)p._hdfX=x;}
    p._hdfK=k;p.tx=p._hdfX;p.tz=p._hdfZ;
  },
  kovala(p,ef){
    const b=this.ball;this.eforVer(p,ef!=null?ef:1);
    /* tepki süresi: top yön değiştirdikten sonra oyuncu bir an eski hedefine gider (pası bekleyen alıcı daha çabuk) */
    const tepki=b.hedefOyuncu===p?0.05:0.3-p.oz.karar*0.15;
    if(this.t-(this._degisimT||0)<tepki){p.hizOran=1;p.bak=b;return;}
    const havada=b.y>1.3||b.vy>2;let hMax=havada?1.72*p.boy+0.5:0.7;
    /* kendisine atılan havadan pası rakip zorlamıyorsa topun inmesini bekler: göğüs ya da ayakla alır, kafayla oynamaz */
    if(havada&&b.hedefOyuncu===p){const k2=this.yakalamaNoktasi(p,1.5);if(enYakinRakip(this,k2.x,k2.z,p.team).d>3.5)hMax=1.5;}
    let k=this.yakalamaNoktasi(p,hMax);
    /* kararlılık: önceki karşılama noktası hâlâ yetişilebilir durumdaysa ona sadık kal (hedef sürekli zıplamasın) */
    const on=p._kar;
    if(on&&on.surum===b.surum&&hrkHyp(on.x-k.x,on.z-k.z)>1.5){const yol=this.topYolu(),i0=hrkMax(0,Math.round((this.t-this._yolT0)*60)-1);
      let tb=null;for(let i=i0;i<yol.length;i+=2){const s=yol[i];if(hrkHyp(s.x-on.x,s.z-on.z)<0.9&&s.y<(havada?2.3:0.8)){tb=(i-i0)/60;break;}}
      if(tb!=null&&varisZamani(p,on.x,on.z,0.45,0.1)<=tb+0.15)k={x:on.x,z:on.z,t:tb};}
    p._kar={x:k.x,z:k.z,surum:b.surum};
    /* ara pasında alıcı koşusuna devam eder: pasın hedefine top gelmeden yetişebiliyorsa oraya gider */
    const ph=b.pasHedef;
    if(b.hedefOyuncu===p&&ph&&ph.tur==='ara'){const yol=this.topYolu(),i0=hrkMax(0,Math.round((this.t-this._yolT0)*60)-1);
      let tb=null;for(let i=i0;i<yol.length;i+=3){const s=yol[i];if(hrkHyp(s.x-ph.x,s.z-ph.z)<1.5&&s.y<0.8){tb=(i-i0)/60;break;}}
      if(tb!=null&&varisZamani(p,ph.x,ph.z,0.45,0.1)<=tb+0.1&&k.t>0.4)k={x:ph.x,z:ph.z,t:tb};}
    p.tx=clamp(k.x,-PL-1,PL+1);p.tz=clamp(k.z,-1,PW+1);p.hizOran=1;p.bak=b;
    if(hrkHyp(k.x-p.x,k.z-p.z)<1.5)p.yonHedef=hrkAtan2(b.z-p.z,b.x-p.x);
    /* karşılayan koşarak varır: topa zamanında ancak yetişecekse hızını kesmez, payı çoksa durur; üstüne gelen topa doğru yavaş.
       Pasın alıcısı topu kontrollü karşılar (koşarak geçip topun gerisinde kalmasın), yalnız geç kalıyorsa koşarak */
    /* çizgiye yakın karşılamada (3 m) koşarak varılmaz: hem top hem oyuncu sahada kalsın */
    const pay=k.t-varisZamani(p,k.x,k.z,0.45,0.1),vo=hrkAbs(k.x)>PL-3||k.z<3||k.z>PW-3?0:MOTOR_AYAR.varisHizi*p.maxSpd;
    if(b.hedefOyuncu===p)p._varisHiz=pay<0.1?0.6*vo:0;
    else p._varisHiz=(pay<0.25?vo:pay<0.8?vo*(0.8-pay)/0.55:0)*((b.vx*(p.x-k.x)+b.vz*(p.z-k.z))>0?0.45:1);
    p._varisKare=this.kare;
    /* gelişine karar (şut, ileride tek vuruşla pas): mac-topla.js */
    this.gelisineKarar(p,k);
  },
  /* dokunuşlarla top sürme: top öne itilir, oyuncu yetişince yeniden dokunur. Rakip yakınsa dokunuşlar kısa. B niyeti verir (p.surus);
     koruma niyetinde gövde rakiple top arasında (p.tavir='koru'), önünde rakip varsa çalım manevrası (calimAdim). Her dokunuş p.sonDokunus */
  surusIlerle(p,dt){
    const b=this.ball;if(!p.surus)p.surus={yon:b.vx*b.vx+b.vz*b.vz>0.64?hrkAtan2(b.vz,b.vx):p.yon,hiz:0.5};   /* niyet gelmeden: topun gidişine */
    const s=p.surus;
    /* T2: bekleme niyetinde (s.bekle) top ayağın altında kalır, baş yukarıda (p.tavir='bekle'; çizim okur) */
    if(s.koru||s.bekle){p.tavir=s.koru?'koru':'bekle';p._tavirKare=this.kare;}
    const M=s.koru||s.bekle?null:this.calimAdim(p,s,dt),yon=M?M.yon:s.yon,c=hrkCos(yon),sn=hrkSin(yon);
    /* sürüş yolunda yakın rakip varken (manevra dışı) yavaşla ve topu ayağa yakın tut: topu rakibin önüne itme */
    const yakin=!M&&!s.koru&&this.calimRakibi(p,yon,2.2),hiz=M?M.hiz:yakin?hrkMin(s.hiz,0.6):s.hiz;
    const dx=b.x-p.x,dz=b.z-p.z,d=hrkHyp(dx,dz);
    /* top ile oyuncu arasına rakip girmesin: topun biraz arkasına koş (gövde çalımında gövde yana yüklenir). Top ayaktan kaçtıysa
       (0,5 m'den uzak ve uzaklaşıyor) ona yetişecek hızla kovalar; top gövdenin çok yanında kaldıysa yüzünü topa döner */
    const kac=d>0.5?(b.vx*dx+b.vz*dz)/d:0,hz=kac>0?hrkMax(hiz,hrkMin(1,(kac+1.5)/(0.87*p.maxSpd))):hiz;
    p.tx=b.x+b.vx*0.22-c*0.34+(M&&M.kx||0);p.tz=b.z+b.vz*0.22-sn*0.34+(M&&M.kz||0);p.hizOran=hz*(0.8+0.12*p.oz.surus);p.bak=null;this.eforVer(p,hz>=0.6?1:0.85);
    p.yonHedef=d>0.45&&(dx*hrkCos(p.yon)+dz*hrkSin(p.yon))<0.5*d?hrkAtan2(dz,dx):yon;
    p.dokunT-=dt;
    const onde=dx*hrkCos(p.yon)+dz*hrkSin(p.yon);
    if((d<0.62&&p.dokunT<=0||M&&M.itme&&d<0.75)&&b.y<0.35&&onde>-0.15&&!(M&&M.bekle)){
      let a=yon;const f=hrkAciFark(a,p.yon),donus=hrkAbs(f)>0.85;
      if(donus)a=hrkAciNorm(p.yon+hrkIsaret(f)*0.85);
      const baski=baskiAltinda(this,p);
      /* topu rakipten uzak ayakta tut: yakın (2 m) rakip dokunuş yönünün yanındaysa top ondan biraz öteye (en çok 0,3 rad) */
      if(!(M&&M.itme)&&!s.koru){const {o,d:od}=enYakinRakip(this,b.x,b.z,p.team);if(o&&od<2){const yy=hrkCos(a)*(o.z-p.z)-hrkSin(a)*(o.x-p.x);a-=hrkIsaret(yy)*0.3*(2-od)/2;}}
      a+=this.normal()*(0.04+0.1*(1-p.oz.surus))*(1+baski);
      /* önünde yakın rakip varken (manevra dışı) kısa dokunuş: top ayaktan uzaklaşmasın */
      const itme=M&&M.itme?M.itme:s.koru?0.3:s.bekle?0.15:lerp(1.9,0.65,baski)*(donus?0.45:1)*(0.75+0.5*hiz)*(yakin?0.6:1);
      /* son dokunuş (çizim için, rastlantısız): ayak topun gövdeye göre yanı; yüzey: dönüş ayağın kendi yanına dış, öbür yana iç, düz uzun itiş üst */
      const ayak=mdhAyak(p,b.x,b.z),fy=hrkAciFark(a,p.yon);
      /* donus (T2, sözleşme): gövdeye göre keskin yönlü dokunuş (sırtı dönükken dönme, içe/dışa kesme); çizim gövdeyi dönüşe yatırır */
      p.sonDokunus={t:this.t,tur:'surus',ayak,yuzey:s.koru||s.bekle?'taban':hrkAbs(fy)<0.3?(itme>1.5?'ust':'ic'):(fy>0)===(ayak==='sag')?'dis':'ic',donus:donus||hrkAbs(fy)>0.7};
      const ileri=hrkMax(0,p.vx*hrkCos(a)+p.vz*hrkSin(a)),v=ileri*0.95+itme;
      b.vx=hrkCos(a)*v;b.vz=hrkSin(a)*v;b.vy=0;b.y=0;b.egri=0;b.ust=0;
      p.dokunT=0.22;this.dokunus(p,true);
      if(M&&M.itme){p.sonDokunus.calim=true;const C=p._calim;if(C){C.faz=2;C.ft=0;C.yon2=a;}}
    }
  },
  /* çalım (C2): sürüş yönünde önde rakip (3,2 m, ±55°) varken B'nin niyetinde cal varsa ya da hızlı sürüşte yol kapalıysa manevra seçilir:
     hız değişimi — yavaşla (jokey yapan da yavaşlar), sonra topu rakibin açık yanından uzun it ve depara kalk;
     gövde çalımı — dokunmadan bir yana yüklen, rakip tepki gecikmesiyle o yana kayarken topu öbür yana it; yüklenen rakip dengesini kaybeder.
     Dönen: {yon, hiz, itme?, bekle? (dokunma), kx/kz (gövde kayması)} ya da null */
  calimAdim(p,s,dt){
    let C=p._calim;
    if(C&&(C.kare<this.kare-1||this.t-C.t0>1.8||!C.o.oyunda||C.o.eylem&&C.o.eylem.kilit&&C.faz<2))C=p._calim=null;
    if(!C){
      if(!(s.cal||s.hiz>=0.6))return null;
      /* rakip sürüş yönünde ya da (ileri sürerken) kaleye giden yolda önde */
      const hy=this.dir[p.team]>0?0:HRK_PI,ileri=hrkCos(s.yon-hy)>0.17,o=this.calimRakibi(p,s.yon)||(ileri?this.calimRakibi(p,hy,3):null);if(!o)return null;
      if(!s.cal&&this.rast()>dt*MOTOR_AYAR.calimIstegi*(0.5+p.oz.surus))return null;
      C=p._calim={o,tur:this.rast()<0.3+0.55*p.oz.surus?'aldat':'hiz',taraf:this.calimTarafi(p,o),faz:0,t0:this.t,ft:0,kare:this.kare,yon2:0};
    }
    C.kare=this.kare;C.ft+=dt;
    const o=C.o,ax=o.x-p.x,az=o.z-p.z,L=hrkHyp(ax,az)||1,ux=ax/L,uz=az/L,lx=-uz,lz=ux,ana=hrkAtan2(uz,ux);
    if(C.faz===2){/* itti: rakibin yanından geç, hizasına gelince kaleye dön; rakip 1,2 m geride kalınca biter */
      const d=this.dir[p.team],geri=(o.x-p.x)*d,gecti=geri<-1.2;
      if(gecti||C.ft>1.2){p._calim=null;if(gecti)this._gecFaul=[o,p];return null;}
      return{yon:geri<0.4?hrkAciNorm((d>0?0:HRK_PI)+clamp(hrkAciFark(C.yon2,d>0?0:HRK_PI),-0.5,0.5)):C.yon2,hiz:1};}
    if(C.tur==='hiz'){
      if(C.faz===0){if(C.ft<0.22&&L>1.3)return{yon:ana,hiz:0.38};C.faz=1;C.ft=0;}
      return{yon:hrkAciNorm(ana+C.taraf*hrkCalimAci(L,0.55)),hiz:1,itme:2.4+0.8*p.oz.surus};}
    if(C.faz===0){if(C.ft<0.2)return{yon:ana,hiz:0.5,bekle:true,kx:-C.taraf*lx*0.7,kz:-C.taraf*lz*0.7};
      C.faz=1;C.ft=0;
      /* rakip aldatma yönüne yüklendiyse (o yana >1 m/sn kayıyor) dengesini kaybeder */
      const vy=-(o.vx*lx+o.vz*lz)*C.taraf;if(vy>1&&L<2.8)this.dengeBoz(o,0.3+0.25*(vy-1),-C.taraf*lx,-C.taraf*lz,'takilma',p);}
    return{yon:hrkAciNorm(ana+C.taraf*hrkCalimAci(L,0.75)),hiz:1,itme:2.2+0.8*p.oz.surus};
  },
  /* sürüş yönünde önündeki en yakın rakip (3,2 m içinde, ±55°) */
  calimRakibi(p,yon,menzil){
    const c=hrkCos(yon),sn=hrkSin(yon);let en=null,ed=menzil||3.2;
    for(const o of this.teams[1-p.team]){if(!o.oyunda||o.eylem&&o.eylem.kilit)continue;const dx=o.x-p.x,dz=o.z-p.z,d=hrkHyp(dx,dz);
      if(d<ed&&d>0.3&&(dx*c+dz*sn)/d>0.57){ed=d;en=o;}}
    return en;
  },
  /* çalımın açık yanı (+1 sağ, −1 sol; rakibe göre): taç çizgisinden ve öbür rakiplerden uzak, rakibin kaydığı yönün tersi */
  calimTarafi(p,o){
    const ax=o.x-p.x,az=o.z-p.z,L=hrkHyp(ax,az)||1,ux=ax/L,uz=az/L,lx=-uz,lz=ux;let en=1,eP=-1e9;
    for(const t of[1,-1]){const hx=p.x+(ux*0.8+lx*t*0.6)*3.2,hz=p.z+(uz*0.8+lz*t*0.6)*3.2;
      let P=hrkMin(4,hrkMin(hz-1,PW-1-hz,PL-hrkAbs(hx)))*0.8-(o.vx*lx+o.vz*lz)*t*0.5;
      for(const q of this.teams[1-p.team])if(q!==o&&q.oyunda)P-=hrkMax(0,4-hrkHyp(q.x-hx,q.z-hz))*0.6;
      if(P>eP){eP=P;en=t;}}
    return en;
  },
  /* 1. adam (C2): sürücüye kale tarafından, dış yanı gösterecek biçimde biraz içeriden yaklaşır: uzaktan hızla kapanır, yaklaşınca yavaşlar,
     1,6–2,4 m'de yan duruşla jokey yapar (p.tavir='jokey'); sürücüyü tepki gecikmesiyle (τr≈0,32−0,15·karar) izler. Sürücü hızla geliyorsa kalçasını
     açıp koşarak çekilir. Müdahaleye ancak top açıkta ya da sürücü sırtını dönmüşse girer (mudahaleDene, mac-mudahale.js) */
  presYap(p,s,dt){
    const b=this.ball,gx=-this.dir[p.team]*PL,mesafe=hrkHyp(p.x-s.x,p.z-s.z);
    const tr=0.32-0.15*p.oz.karar,k=hrkMin(1,dt/tr);
    if(p._algS!==s){p._algS=s;p._algVx=s.vx;p._algVz=s.vz;}
    p._algVx+=(s.vx-p._algVx)*k;p._algVz+=(s.vz-p._algVz)*k;
    const ox=s.x+p._algVx*0.3,oz=s.z+p._algVz*0.3;
    let nx=gx-ox,nz=MZ-oz;const L=hrkHyp(nx,nz)||1;nx/=L;nz/=L;
    let qx=-nz,qz=nx;if(qz*(MZ-oz)<0){qx=-qx;qz=-qz;}
    /* mesafe: kaleye dönük sürücüye jokey (1,6–2,4 m); sırtı ya da yanı dönükse sıkı (1–1,4 m, dönmesine izin verme); vuruş hazırlığında üstüne */
    const kale=hrkCos(s.yon)*nx+hrkSin(s.yon)*nz,R0=clamp(2.25-0.5*p.oz.mudahale+0.1*s.spd,1.6,2.4)*MOTOR_AYAR.jokeyMesafe,
      R=s.eylem&&s.eylem.ad==='vurus'?hrkMin(R0,0.8):kale<0.3?lerp(0.9,R0,clamp((kale+1)/1.3,0,1)):R0;
    const al=0.15+0.3*clamp((hrkAbs(oz-MZ)-6)/14,0,1);
    p.tx=ox+R*(nx*hrkCos(al)+qx*hrkSin(al));p.tz=oz+R*(nz*hrkCos(al)+qz*hrkSin(al));p.bak=b;
    const yaklas=hrkMax(0,(s.vx*(p.x-s.x)+s.vz*(p.z-s.z))/(mesafe||1));
    if(mesafe>5.5)p.hizOran=1;
    else if(mesafe>R+1.2){p.hizOran=0.9;p.yonHedef=hrkAtan2(s.z-p.z,s.x-p.x);}
    else if(yaklas>0.55*p.maxSpd)p.hizOran=1;   /* koşarak çekil: gidiş yönüne bakar */
    else if(kale<0.3){p.hizOran=1;p.yonHedef=hrkAtan2(s.z-p.z,s.x-p.x);}   /* sıkı markaj: yüzü sürücüye */
    else{p.tavir='jokey';p._tavirKare=this.kare;p.hizOran=1;
      const a=hrkAtan2(s.z-p.z,s.x-p.x),off=0.45+0.8*clamp((yaklas-2.5)/3,0,1),d1=hrkAciNorm(a+off),d2=hrkAciNorm(a-off);
      p.yonHedef=-(hrkCos(d1)*qx+hrkSin(d1)*qz)>=-(hrkCos(d2)*qx+hrkSin(d2)*qz)?d1:d2;}
    /* geçildi mi: 1. adam sürücünün kale tarafından arkasına düştüyse (yakınken) bir kez taktik faul şansı (mac-mudahale.js) */
    const arka=((p.x-s.x)*nx+(p.z-s.z)*nz)<-0.5&&mesafe<1.8;
    if(arka&&p._gecS!==s){p._gecS=s;this._gecFaul=[p,s];}else if(!arka&&mesafe>2.5)p._gecS=null;
    this.mudahaleDene(p,s,dt);
  },
  /* 2. adam: 1. adamın arkasında, top ile kale arasında */
  kapat(p,s){
    if(!s)return;
    const gx=-this.dir[p.team]*PL,dx=gx-s.x,dz=MZ-s.z,L=hrkHyp(dx,dz)||1,k=hrkMin(10,L*0.4);
    p.tx=s.x+dx/L*k;p.tz=s.z+dz/L*k;p.hizOran=0.8;p.bak=this.ball;
  },
  /* karşı preste 3. adam: topu tutana en yakın rakip alıcıyla top arasındaki pas yolunu keser (yolun %40'ında) */
  yolKapat(p,s){
    if(!s)return;
    let q=null,ed=1e9;for(const o of this.teams[s.team]){if(o===s||!o.oyunda||o.rol==='GK')continue;const dd=hrkHyp(o.x-s.x,o.z-s.z);if(dd<ed){ed=dd;q=o;}}
    if(!q){this.kapat(p,s);return;}
    p.tx=s.x+(q.x-s.x)*0.4;p.tz=s.z+(q.z-s.z)*0.4;p.hizOran=1;p.bak=this.ball;
  }
});
