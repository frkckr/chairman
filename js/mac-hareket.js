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
  jokeyMesafe:0.8,             // jokey mesafesinin çarpanı (T4: 1,95 + 0,1·sürücünün hızı, 1,6–2,4 m; çarpanla 1,3–1,9 m) (C2; T4: 1,0 → 0,8)
  /* T4 (2026-10-08): bire bir (calimIstegi kalktı: çalım karar katmanının niyetinden başlar) */
  birebirYayilim:0.12,         // savunmacının ayağı top yoluna yetişme olasılığının yayılımı (sn): σ((tD − tb)/yayılım)
  birebirErisim:0.95,          // savunmacının uzanarak topa eriştiği mesafe (m; mudahaleDene'deki açık top erişimiyle aynı)
  birebirYaris:0.15,           // toplama noktasına yarışın yayılımı (sn)
  birebirKayma:1.05,           // yarışta savunmacının topa erişimi (m; kayarak müdahalenin süpürmesi)
  birebirDonus:0.3,            // itişten sonra sürücünün yeni yöne dönme kaybı (sn/rad; gövde rakibe dönük, yana hızı çevirir)
  birebirVazgec:0.12,          // yaklaşmanın sonunda tahmin bunun altındaysa çalımdan olaysız vazgeçilir
  yutmaGuc:0.8,                // savunmacının aldatılma olasılığının çarpanı (hrkYutma)
  yutmaSure:[0.25,0.45],       // aldatılan savunmacının yanılgı süresi (sn; şiddetle) + hareketin ek gecikmesi
  destekSure:[0.6,1.6],        // 1. adamın arkasındaki yardımın varış süresi: 0,6 sn'de tam yardım, 1,6 sn'de yok (destekHesapla)
  /* T4 (2026-10-08): sürüş dokunuşu */
  dokunusSiklik:[2.9,3.4],     // taşımada planlanan dokunuş sıklığı (1/sn): yavaş → hızlı (7 m/sn) sürüş; öndeki baskı ×(1 + 0,3·baskı). Dönüş ve yavaşlamayla ölçülen ~%20 düşük: 2,3 → 3,0 (Ek G2)
  dokunusUlas:[0.62,0.85]      // ayağın topa uzanma mesafesi (m, gövde merkezinden): yavaş → hızlı koşu (uzun adım topu daha önde alır)
});
/* çeviklik (0–1): top sürme, hız ve hafiflikten türetilir (kadro verisi değişmez) */
const hrkCeviklik=p=>{if(p._cev!=null)return p._cev;const o=p.oz||{},s=o.surus!=null?o.surus:0.5,h=o.hiz!=null?o.hiz:0.5;
  return p._cev=clamp(0.5*s+0.3*h+0.2*clamp((95-kutle(p))/30,0,1),0,1);};
/* C akışının kişi başı ara alanları ilk harekette hep aynı sırayla eklenir (gizli sınıf tek kalsın, erişim hızlı olsun) */
const hrkHazirla=p=>{kutle(p);p._cev=null;hrkCeviklik(p);p._hk=null;p._kacKare=-1;p._kacX=0;p._kacZ=0;p._varisHiz=0;p._varisKare=-1;p._tavirKare=-1;
  p._algS=null;p._algVx=0;p._algVz=0;p._omuzT=-9;p.calim=null;p._acikBas=0;p._acikKare=-9;p._gecS=null;p._gecT=-9;p._destek=0;p._destekK=null;};
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
/* T4: yerden itilen topun s metreyi T saniyede alması için ilk hızı (yerSure(v0, s, R) = T; v0'da tekdüze azalır, ikiye bölme). Sürüş dokunuşu,
   çalım itişi ve birebirTahmin aynısını kullanır (tahmin ile yürütme tutarlı kalsın). Saf */
const hrkItmeHizi=(s,T,R)=>{if(s<=0)return 0;let alt=s/T,ust=30;if(yerSure(ust,s,R)>T)return ust;
  for(let i=0;i<18;i++){const o=(alt+ust)/2;if(yerSure(o,s,R)>T)alt=o;else ust=o;}return(alt+ust)/2;};
/* T4: sürüş yönüne göre baskı (paylaşılan nesne; kopyala): on öndeki ±70° içindeki en yakın rakipten (baskiAltinda ölçeğinde, 0–1), arka 3 m
   içinden yaklaşan (>0,5 m/sn) rakipten (0–1). Yerdeki ya da kilitli eylemdeki rakip sayılmaz. Saf */
const HRK_BO={on:0,arka:0};
const hrkBaskiOn=(m,p,yon)=>{const c=hrkCos(yon),sn=hrkSin(yon);let on=0,ar=0;
  for(const o of m.teams[1-p.team]){if(!o.oyunda||o.eylem&&o.eylem.kilit)continue;const dx=o.x-p.x,dz=o.z-p.z,d=hrkHyp(dx,dz);if(d>4.5||d<1e-3)continue;
    const cs=(dx*c+dz*sn)/d;
    if(cs>0.342){const v=clamp((4.5-d)/3.5,0,1);if(v>on)on=v;}
    else if(cs<-0.2&&d<3&&-((o.vx-p.vx)*dx+(o.vz-p.vz)*dz)/d>0.5){const v=clamp((3-d)/2,0,1);if(v>ar)ar=v;}}
  HRK_BO.on=on;HRK_BO.arka=ar;return HRK_BO;};
/* ============ T4 (2026-10-08): bire bir — hareket tablosu, tahmin, itiş ============
   Gerçekçilik planı T4 ve Ek C. Çalım karar katmanının niyetinden başlar (mac-karar.js birebirSecenegi → p.surus.cal); karede zar yoktur.
   Deneme başına en çok iki zar: savunmacının aldatılması (yutma, hazırlığın ortasında) ve kötü itiş (hata, itişte). Tahmin (birebirTahmin) ile
   yürütme (calimAdim) aynı itiş hesabını (hrkItis) ve aynı aldatma olasılığını (hrkYutma) kullanır.
   Hareket tablosu (TEST değerleri). mek: tempo (hız değiştirme; savunmacının tepkisini geciktirir), aldat (gövde ve ayak aldatması; savunmacı
   yanılgı yönüne yüklenir), yaris (topu boşluğa atıp koşu yarışı), kesme (keskin yön değişimi; savunmacının ataleti). yet: yetenek ağırlıkları
   (profil alt özelliği ya da oz), esik: denemek için en az yetenek, kosul: sut (son 32 m), sirt (sürücünün sırtı gideceği yöne dönük), gelen
   (savunmacı üstüne geliyor ya da koşuyor), dar (savunmacı ≤ 2,2 m), atak (topu atıp koşmak için sürücü ≥ 3 m/sn ve savunmacı ≥ 2,5 m). itisL: itişte savunmacıya uzaklık (m; hazırlık, aradaki kapanma hızıyla
   itiş bu uzaklıkta olacak anda başlar: itisL + kapanma·haz, en çok tetik), tetik: hazırlığın en erken başladığı uzaklık, yakHiz: yaklaşma hızı (oran),
   haz: hazırlık süresi (sn; çizimle aynı: makas 0,45, rulet 2 × 0,4), hazHiz: hazırlıkta hız oranı, kay: gövdenin aldatma yönüne kayması (m),
   a0: itişin rakibe göre en küçük açısı (rad), gec: toplama noktasının savunmacının izdüşümünden ötesi (m; yarışta + 0,5·max(0, L − 2)),
   yanilt: aldatma gücü, gecikme: aldatılan savunmacının ek tepki süresi (sn), hata: kötü itiş tabanı, kal: tahminin logit düzeltmesi (fiziksel
   model hareketler arası yanlıdır: toparlanan savunmacıyı, yarımı ve faulü görmez; c-1v1 ve maçta modelin seçtiği denemelerin tahmin–gerçek
   farkından, %80 adımla iki tur; makasta maç ile senaryonun ortası).
   Kapalı satırlar: bacak arası (top–beden süpürme T5), şapka (seken top T6/T9b); sağından at solundan geç tabloda durur ama eşiği 9'dur (kapalı):
   sürücünün öbür yandan dolanması ve savunmacının gövdeyle kesmesi temas modeli ister (T5/T7), yürütücü bugün yalnız topu kovalatıyordu. Topu
   çekme ayrı bir geçme denemesi değil, baskıda arkaya dönüş dokunuşunun biçimidir (surusIlerle) */
const HRK_HAREKET=[
  {ad:'hiz',mek:'tempo',yet:{cabukluk:0.5,hiz:0.3,surus:0.2},esik:0,kosul:'gelen',tetik:4.5,itisL:2.2,yakHiz:0.6,haz:0.30,hazHiz:0.3,kay:0,a0:0.45,gec:1.8,yanilt:0.35,gecikme:0.18,hata:0.05,kal:-0.5},
  {ad:'durKalk',mek:'tempo',yet:{cabukluk:0.5,denge:0.3,surus:0.2},esik:0.35,kosul:'gelen',tetik:4.5,itisL:2.0,yakHiz:0.6,haz:0.35,hazHiz:0.2,kay:0,a0:0.5,gec:1.8,yanilt:0.5,gecikme:0.22,hata:0.06,kal:-1.38},
  {ad:'govde',mek:'aldat',yet:{ceviklik:0.4,yaraticilik:0.3,surus:0.3},esik:0,kosul:null,tetik:4.5,itisL:1.6,yakHiz:0.65,haz:0.30,hazHiz:0.6,kay:0.5,a0:0.75,gec:1.6,yanilt:0.75,gecikme:0.2,hata:0.05,kal:-1.34},
  {ad:'makas',mek:'aldat',yet:{surus:0.5,ceviklik:0.3,yaraticilik:0.2},esik:0.45,kosul:null,tetik:4.5,itisL:1.6,yakHiz:0.6,haz:0.45,hazHiz:0.55,kay:0.45,a0:0.75,gec:1.6,yanilt:0.9,gecikme:0.22,hata:0.08,kal:-0.6},
  {ad:'sutCalim',mek:'aldat',yet:{yaraticilik:0.4,surus:0.3,sut:0.3},esik:0.35,kosul:'sut',tetik:4.5,itisL:1.8,yakHiz:0.5,haz:0.35,hazHiz:0.4,kay:0,a0:0.9,gec:1.4,yanilt:1.0,gecikme:0.28,hata:0.07,kal:-0.2},
  {ad:'rulet',mek:'aldat',yet:{surus:0.5,denge:0.3,ceviklik:0.2},esik:0.6,kosul:'dar',tetik:3.0,itisL:1.2,yakHiz:0.4,haz:0.80,hazHiz:0.3,kay:0.35,a0:0.9,gec:1.4,yanilt:0.6,gecikme:0.2,hata:0.12,kal:-0.35},
  {ad:'atKos',mek:'yaris',yet:{hiz:0.45,surus:0.35,cabukluk:0.2},esik:0,kosul:'atak',tetik:5.5,itisL:3.0,yakHiz:0.85,haz:0.10,hazHiz:0.85,kay:0,a0:0.35,gec:2.5,yanilt:0.1,gecikme:0.05,hata:0.08,kal:-0.07},
  {ad:'sagSol',mek:'yaris',yet:{hiz:0.5,cabukluk:0.3,surus:0.2},esik:9,kosul:null,tetik:4.5,itisL:2.2,yakHiz:0.8,haz:0.12,hazHiz:0.8,kay:0,a0:0.6,gec:2.0,yanilt:0.4,gecikme:0.12,hata:0.06,kal:0.36},
  {ad:'kesme',mek:'kesme',yet:{ceviklik:0.5,surus:0.3,cabukluk:0.2},esik:0,kosul:'gelen',tetik:4.5,itisL:1.6,yakHiz:0.7,haz:0.20,hazHiz:0.5,kay:0,a0:1.0,gec:1.4,yanilt:0.45,gecikme:0.18,hata:0.06,kal:-0.5},
  {ad:'sirtDon',mek:'kesme',yet:{ceviklik:0.4,denge:0.3,ilkDokunus:0.3},esik:0,kosul:'sirt',tetik:3.0,itisL:1.2,yakHiz:0.3,haz:0.30,hazHiz:0.3,kay:0.3,a0:1.2,gec:1.4,yanilt:0.5,gecikme:0.2,hata:0.08,kal:-0.99}
];
/* yetenek (0–1): ağırlıklı ortalama; ad profil alt özelliğiyse ondan, değilse oz'dan */
const hrkYetenek=(p,w)=>{let v=0,t=0;for(const k in w){const a=p.profil&&k in p.profil.alt?p.profil.alt[k]:p.oz&&p.oz[k]!=null?p.oz[k]:0.5;v+=w[k]*a;t+=w[k];}return t?v/t:0.5;};
/* savunmacının okuması (0–1): sezgi, karar, pozisyon alma */
const hrkOkuma=o=>clamp(0.45*profilAlt(o,'sezgi',0.5)+0.35*(o.oz?o.oz.karar:0.5)+0.2*profilAlt(o,'pozisyonAlma',0.5),0,1);
/* aldatılma olasılığı: yutmaGuc · yanıltma · (3·yetenek − 0,6; 0,1–1,8) · (1,25 − okuma) · yakınlık; L hazırlığın ortasındaki uzaklık (savunmacı
   0,9–2,6 m'de aldatmaya yüklenir, 3,6 m'den uzakta yüklenmez). Yetenek çalımın en güçlü belirleyicisidir (gerçekte iyi sürücü ~%60–70, zayıf ~%35) */
const hrkYutma=(p,o,H,yet,L)=>clamp(MOTOR_AYAR.yutmaGuc*H.yanilt*clamp(3*yet-0.6,0.1,1.8)*(1.25-hrkOkuma(o))*clamp((3.6-L)/1.0,0,1)*clamp(L/0.9,0,1),0,0.9);
/* yana uzanma süresi: g metre, başlangıç yan hızı v0 (+ hedefe doğru), tavan vm, ivme a (önce ters hızı keser) */
const hrkYanSure=(g,v0,vm,a)=>{if(g<=0)return 0;let t=0,x=g;if(v0<0){t=-v0/a;x+=v0*v0/(2*a);v0=0;}if(v0>=vm)return t+x/v0;
  const da=(vm*vm-v0*v0)/(2*a);return da>=x?t+(hrkKok(v0*v0+2*a*x)-v0)/a:t+(vm-v0)/a+(x-da)/vm;};
/* varış süresi için savunmacının başka bir yerdeki/hızdaki kopyası (paylaşılan nesne; varisZamani yalnız okur) */
const HRK_HAYALET={x:0,z:0,vx:0,vz:0,spd:0,maxSpd:7,enerji:1,yorgunluk:0,_hk:null,oz:null,boy:1,kayit:null};
const hrkHayalet=(o,x,z,vx,vz)=>{const g=HRK_HAYALET;g.x=x;g.z=z;g.vx=vx;g.vz=vz;g.spd=hrkHyp(vx,vz);g.maxSpd=o.maxSpd;g.enerji=o.enerji;g.yorgunluk=o.yorgunluk;
  g._hk=o._hk||hrkSabit(o);g.oz=o.oz;g.boy=o.boy;g.kayit=o.kayit;return g;};
/* itiş (tahmin ve yürütme ortak; paylaşılan nesne, kopyala): top (bx,bz)'den savunmacının (u yönünde Lp m) t yanına hrkCalimAci açısıyla, toplama
   noktası C savunmacının izdüşümünden gec kadar öteye (saha içinde 1 m pay; çizgi engelliyorsa ok=false). Sürücü (px,pz)'den vP hızla toplama
   noktasına koşar (topla %8 yavaş; dönüş birebirDonus sn/rad, kesmede +0,08 sn; sağından-solundan geçişte 0,8 m dolanma); top oraya sürücüyle
   aynı anda varsın: v0 = hrkItmeHizi. Dönüş sürücünün gidiş yönüne (gx, gz birim) göredir: savunmacı çapraz geldiğinde itiş gidişe göre çok
   yana/geriye düşebilir (maçta 120–140°; sürücü frenleyip dönüyordu). sQ, yQ: top yolunun savunmacıya en yakın noktası (yol boyu, yanal uzaklık) */
const HRK_IT={ok:false,a:0,cx:0,cz:0,sC:0,sQ:0,yQ:0,tA:0,v0:0,th:0};
const hrkItis=(m,p,H,t,Lp,vP,bx,bz,ux,uz,px,pz,gx,gz)=>{const I=HRK_IT;I.ok=false;
  const al=hrkCalimAci(Lp,H.a0),a=hrkAtan2(uz,ux)+t*al,sC=Lp*hrkCos(al)+H.gec+(H.mek==='yaris'?0.5*hrkMax(0,Lp-2):0);
  const cx=bx+hrkCos(a)*sC,cz=bz+hrkSin(a)*sC,cx2=clamp(cx,-PL+1,PL-1),cz2=clamp(cz,1,PW-1);if(hrkHyp(cx2-cx,cz2-cz)>1.2)return I;
  const hk=p._hk||hrkSabit(p),vm=hrkTepe(p)*0.92,dx=cx2-px,dz=cz2-pz,dd=hrkHyp(dx,dz)||0.01,th=hrkAcos(clamp((dx*gx+dz*gz)/dd,-1,1));
  const tA=hrkKosuSuresi(dd+(H.ad==='sagSol'?0.8:0),hrkMax(0,vP*hrkCos(th)),vm,hk.A0*(1-0.15*(p.yorgunluk||0)),hk.S0)+MOTOR_AYAR.birebirDonus*th+(H.mek==='kesme'?0.08:0);
  const sC2=hrkHyp(cx2-bx,cz2-bz);
  I.ok=true;I.a=hrkAtan2(cz2-bz,cx2-bx);I.cx=cx2;I.cz=cz2;I.sC=sC2;I.sQ=Lp*hrkCos(al);I.yQ=Lp*hrkSin(al);I.tA=tA;I.v0=hrkMin(16,hrkItmeHizi(sC2,tA,m.R));I.th=th;
  return I;};
/* geçildi mi (paylaşılan nesne; Opta'nın "rakibini geçip topu koruma" tanımının izleme verisindeki karşılığı): savunmacı sürücünün koşu yönüne
   (hızı 2 m/sn'den azsa itiş yönüne) göre en az 1 m geride, topa en az 1,8 m uzak (hemen müdahale edemez) ve artık kale tarafında değil (sürücüden
   kaleye göre en çok 0,5 m önde). Koşu yönü kale yönü değildir: çizgiye kaçan kanat da içe kesen de kendi yönünde geçer; yanında koşan ya da
   sürücü yana kayarken kale tarafında kalan savunmacı geçilmiş sayılmaz. on: savunmacının koşu yönündeki öndeliği */
const HRK_GC={gecti:false,on:0};
const hrkGecti=(m,p,o,ey)=>{const b=m.ball,sp=p.spd,ex=sp>2?p.vx/sp:hrkCos(ey),ez=sp>2?p.vz/sp:hrkSin(ey),dx=o.x-p.x,dz=o.z-p.z,on=dx*ex+dz*ez;
  const gx=m.dir[p.team]*PL-p.x,gz=MZ-p.z,gl=hrkHyp(gx,gz)||1,kale=(dx*gx+dz*gz)/gl;
  HRK_GC.on=on;HRK_GC.gecti=on<-1&&kale<0.5&&hrkHyp(o.x-b.x,o.z-b.z)>=1.8;return HRK_GC;};
/* kötü itiş olasılığı: taban · (2,6 − 2,6·yetenek) · zayıf yan (güçlü ayağın tersi; zayıf ayak becerisiyle azalır) · başka rakibin baskısı */
const hrkHata=(p,H,yet,t,bDiger)=>clamp(H.hata*(2.6-2.6*yet)*(1+0.8*(p.ayak==='iki'||t===(p.ayak==='sol'?-1:1)?0:1-profilAlt(p,'zayifAyak',0.35)))*(1+0.5*bDiger),0,0.6);
/* topa en yakın diğer rakip (o dışında) ve baskısı (0–1) */
const hrkDigerBaski=(m,p,o)=>{const b=m.ball;let e=1e9;for(const q of m.teams[1-p.team]){if(q===o||!q.oyunda||q.eylem&&q.eylem.kilit)continue;const dd=hrkHyp(q.x-b.x,q.z-b.z);if(dd<e)e=dd;}return clamp((4.5-e)/3.5,0,1);};
/* bire bir tahmini (saf: rastlantı çekmez, alan yazmaz; paylaşılan HRK_BB döner, kopyala). p topu süren, o önündeki savunmacı, yon sürücünün
   gitmek istediği yön; zorla: yalnız bu satır (koşul ve eşik aranmaz; yürütücünün yeniden doğrulaması, senaryolar). Uygun satırlar × iki yan:
   P = [Pyut·Pmiss·PA (aldatıldı) + (1 − Pyut)·Pmiss·PA (okudu)] · Pcov · (1 − Phata); Pmiss: savunmacının ayağı top yoluna geç kalır
   σ((tD − tb)/birebirYayilim), PA: toplama noktasına sürücü önce varır σ((tDC − tA)/birebirYaris), Pcov: topa en yakın iki diğer rakip yetişemez,
   Phata: kötü itiş. Pk = 0,75·(1 − P). Seçim belirlenimli: P − 0,4·Pk + eğilim + güçlü yan; eşitlikte tablo sırası */
const HRK_BB={P:0,Pk:0,i:-1,hareket:null,taraf:1,yon2:0,cx:0,cz:0,tA:0,v0:0,Pyut:0,Lp:0,puan:-9,pmN:0,pmY:0,paN:0,paY:0,Pcov:1,Ph:0};
function birebirTahmin(m,p,o,yon,zorla){
  const b=m.ball,A=MOTOR_AYAR,d=m.dir[p.team],R=m.R,BB=HRK_BB;BB.i=-1;BB.P=0;BB.Pk=0;BB.puan=-9;BB.hareket=null;
  const ax=o.x-b.x,az=o.z-b.z,L=hrkHyp(ax,az)||0.1,ux=ax/L,uz=az/L,lx=-uz,lz=ux;
  const sirt=hrkCos(hrkAciFark(p.yon,yon))<-0.2,dar=L<=2.2,gelen=o.spd>2.5||-((o.vx-p.vx)*ux+(o.vz-p.vz)*uz)>2,sut=b.x*d>PL-32&&hrkAbs(b.z-MZ)<25;
  const tr=hrkMax(0.06,0.16-0.1*o.oz.karar),ovl=o.vx*lx+o.vz*lz,hkO=o._hk||hrkSabit(o),vmO=hrkTepe(o),yanMax=vmO*A.yanTavan,lyO=hkO.ly*(1-0.3*hrkMin(1,o.spd/vmO));
  /* sürücünün itiş anındaki hızı: hazırlık hızı ya da şimdiki hızının yaklaşma ve hazırlık boyunca (4 m/sn²) azalmış hâli (koşarak gelen hızını taşır) */
  const vmP=hrkTepe(p)*0.92,guclu=p.ayak==='sol'?-1:1,bDiger=hrkDigerBaski(m,p,o),vNow=hrkMax(0,p.vx*ux+p.vz*uz),kapanma=hrkMax(0,(p.vx-o.vx)*ux+(p.vz-o.vz)*uz);
  /* sürücünün gidiş yönü (yavaşsa topa-savunmacı doğrultusu): itişten sonraki dönüş buna göre */
  const spP=p.spd,gdx=spP>1.5?p.vx/spP:ux,gdz=spP>1.5?p.vz/spP:uz;
  /* yardım: topa en yakın iki diğer rakip (kaleci yalnız toplama noktası ceza alanındaysa) */
  let q1=null,q2=null,e1=1e9,e2=1e9;
  for(const q of m.teams[1-p.team]){if(q===o||!q.oyunda||q.eylem&&q.eylem.kilit)continue;const dd=hrkHyp(q.x-b.x,q.z-b.z);if(dd<e1){e2=e1;q2=q1;e1=dd;q1=q;}else if(dd<e2){e2=dd;q2=q;}}
  for(let i=0;i<HRK_HAREKET.length;i++){if(zorla!=null&&i!==zorla)continue;const H=HRK_HAREKET[i];
    if(zorla==null){if(H.kosul==='sut'&&!sut||H.kosul==='gelen'&&!gelen||H.kosul==='dar'&&!dar||H.kosul==='atak'&&!(vNow>=3&&L>=2.5))continue;if(H.kosul==='sirt'?!sirt:sirt&&H.kosul!=='dar')continue;}
    const yet=hrkYetenek(p,H.yet);if(zorla==null&&yet<H.esik)continue;
    /* hazırlığın başladığı uzaklık (kapanma hızıyla) ve itişteki uzaklık; aldatma zarı hazırlığın başındaki uzaklıktan */
    const Lb=hrkMin(L,hrkMin(H.tetik,H.itisL+kapanma*H.haz+0.1)),Lp=hrkMax(0.9,hrkMin(L,H.itisL)),Pyut=hrkYutma(p,o,H,yet,0.5*(Lb+Lp)),tYak=hrkMax(0,L-Lb)/hrkMax(1,vmP*H.yakHiz)+H.haz;
    const ox=b.x+ux*Lp,oz=b.z+uz*Lp,vP=hrkMax(vmP*H.hazHiz,spP-4*tYak);
    const eg=H.mek==='yaris'?profilEgilim(p,'topuAtipKosar'):H.mek==='aldat'?2*(profilAlt(p,'yaraticilik',0.5)-0.5):H.mek==='tempo'?profilEgilim(p,'topuSurer'):0;
    for(let t=1;t>=-1;t-=2){
      const it=hrkItis(m,p,H,t,Lp,vP,b.x,b.z,ux,uz,b.x-ux*0.35,b.z-uz*0.35,gdx,gdz);if(!it.ok)continue;
      const tb=yerSure(it.v0,it.sQ,R),gerek=hrkMax(0,it.yQ-A.birebirErisim);
      /* savunmacının yan hızı (+ top yoluna doğru): okuduysa şimdiki; aldatıldıysa aldatmada yanılgı yönüne, tempoda durmuş, kesmede ataletle ters */
      const vN=t*ovl*0.7,vY=H.mek==='aldat'?-(1.0+1.5*H.yanilt):H.mek==='kesme'?vN-1.0:H.mek==='tempo'?0:vN;
      const pmN=sigma((tr+hrkYanSure(gerek,vN,yanMax,lyO)-tb)/A.birebirYayilim),pmY=sigma((tr+H.gecikme+hrkYanSure(gerek+0.3*H.kay,vY,yanMax,lyO)-tb)/A.birebirYayilim);
      /* yarış: savunmacı topa kayarak da yetişir (erişim birebirKayma; mudahaleDene'deki kayma koşulu) */
      const tcN=varisZamani(hrkHayalet(o,ox,oz,o.vx*0.7,o.vz*0.7),it.cx,it.cz,A.birebirKayma,tr);
      const tcY=varisZamani(hrkHayalet(o,ox-t*lx*0.3*H.kay,oz-t*lz*0.3*H.kay,-t*lx*hrkAbs(vY),-t*lz*hrkAbs(vY)),it.cx,it.cz,A.birebirKayma,tr+H.gecikme);
      const paN=sigma((tcN-it.tA)/A.birebirYaris),paY=sigma((tcY-it.tA)/A.birebirYaris);
      let Pcov=1;for(const q of[q1,q2]){if(!q||q.rol==='GK'&&!kaleCeza(m,q,it.cx,it.cz))continue;
        Pcov*=1-0.8*sigma((tYak+it.tA+0.2-varisZamani(q,it.cx,it.cz,q.rol==='GK'?1.1:0.75,0.2))/0.2);}
      const Ph=hrkHata(p,H,yet,t,bDiger),P0=clamp((Pyut*pmY*paY+(1-Pyut)*pmN*paN)*Pcov*(1-Ph),0.01,0.99),P=1/(1+Math.exp(-(Math.log(P0/(1-P0))+H.kal)));
      const Pk=0.75*(1-P),puan=P-0.4*Pk+0.05*eg+(t===guclu?0.03:0);
      if(puan>BB.puan){BB.puan=puan;BB.P=P;BB.Pk=Pk;BB.i=i;BB.hareket=H.ad;BB.taraf=t;BB.yon2=it.a;BB.cx=it.cx;BB.cz=it.cz;BB.tA=it.tA;BB.v0=it.v0;BB.Pyut=Pyut;BB.Lp=Lp;
        BB.pmN=pmN;BB.pmY=pmY;BB.paN=paN;BB.paY=paY;BB.Pcov=Pcov;BB.Ph=Ph;}}}
  return BB;
}
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
    const M=s.koru||s.bekle?null:this.calimAdim(p,s,dt),yon=M?M.yon:s.yon,c=hrkCos(yon),sn=hrkSin(yon),A=MOTOR_AYAR;
    /* T4: baskı yalnız öndeki ±70° rakipten (topu kısa tut); arkadan yaklaşan rakip sürücüyü hızlandırır */
    const BO=hrkBaskiOn(this,p,yon),bOn=BO.on,bAr=BO.arka,serbest=!M&&!s.koru&&!s.bekle;
    /* sürüş yolunda yakın rakip varken (manevra dışı) yavaşla ve topu ayağa yakın tut: topu rakibin önüne itme */
    const yakin=!M&&!s.koru&&this.calimRakibi(p,yon,2.2,true),hiz0=M?M.hiz:yakin?hrkMin(s.hiz,0.6):s.hiz,hiz=serbest&&bAr>0?lerp(hiz0,hrkMax(hiz0,0.95),bAr):hiz0;
    const dx=b.x-p.x,dz=b.z-p.z,d=hrkHyp(dx,dz);
    /* top ile oyuncu arasına rakip girmesin: topun biraz arkasına koş (gövde çalımında gövde yana yüklenir). Top ayaktan kaçtıysa
       (0,5 m'den uzak ve uzaklaşıyor) ona yetişecek hızla kovalar; top gövdenin çok yanında kaldıysa yüzünü topa döner */
    /* T4: gidiş yönü ve istenen yöne göre fark; keskin dönüşte (hızda) önce yavaşlar */
    const sp=p.spd,va=sp>1.2?hrkAtan2(p.vz,p.vx):p.yon,fv=hrkAciFark(yon,va);
    const kac=d>0.5?(b.vx*dx+b.vz*dz)/d:0;let hz=kac>0?hrkMax(hiz,hrkMin(1,(kac+1.5)/(0.87*p.maxSpd))):hiz;
    if(serbest&&sp>2.5&&hrkAbs(fv)>0.5)hz*=clamp(1.15-0.45*hrkAbs(fv),0.5,1);
    /* topun biraz arkası: serbest sürüşte topun gidiş çizgisinde (top yan kaldığında oyuncu yana kayıp yavaşlamasın) */
    const bv=hrkHyp(b.vx,b.vz),tux=serbest&&bv>1?b.vx/bv:c,tuz=serbest&&bv>1?b.vz/bv:sn;
    if(M&&M.kac){/* T4: çalımın kaçışında top öndeyken topun ileride olacağı yere koş (öncülü takip): hedef çok yakın kalınca keskin dönüş
         sınırı sürücüyü frenletiyordu */
      const on=clamp(d/(hrkTepe(p)*0.9),0.25,0.7);p.tx=b.x+b.vx*on;p.tz=b.z+b.vz*on;}
    else{p.tx=b.x+b.vx*0.22-tux*0.34+(M&&M.kx||0);p.tz=b.z+b.vz*0.22-tuz*0.34+(M&&M.kz||0);}
    p.hizOran=hz*(0.8+0.12*p.oz.surus);p.bak=null;this.eforVer(p,hz>=0.6?1:0.85);
    /* T4: topla koşan oyuncu topa yaklaşırken frenlemez, karşılayan gibi koşarak varır (eskiden her dokunuştan önce hedefe varış freni hızı
       kesiyordu: hızlı sürüşte dokunuş olmuyordu); bekletme, koruma ve çalım bekleyişi dışında */
    const vp=hrkTepe(p)*p.hizOran;
    if(!s.koru&&!s.bekle&&!(M&&M.bekle)){p._varisHiz=0.95*vp;p._varisKare=this.kare;}
    p.yonHedef=d>0.45&&(dx*hrkCos(p.yon)+dz*hrkSin(p.yon))<0.5*d?hrkAtan2(dz,dx):yon;
    p.dokunT-=dt;
    const onde=dx*hrkCos(p.yon)+dz*hrkSin(p.yon),ulas=lerp(A.dokunusUlas[0],A.dokunusUlas[1],clamp((p.spd-3)/4,0,1));
    if((d<ulas&&p.dokunT<=0||M&&(M.itme||M.durdur)&&d<0.75)&&b.y<0.35&&onde>-0.15&&!(M&&M.bekle)){
      let a=yon;const f=hrkAciFark(a,p.yon);
      /* T4: topu çekme — öndeki baskıda arkaya (>2 rad) dönüş tabanla tek dokunuşta (sonDokunus.hareket 'cekme'); başka zaman gövdeye göre en çok 0,85 rad,
         serbest sürüşte (ve çalımın hazırlık ve kaçış dokunuşlarında) ayrıca gidiş yönüne göre oyuncunun bu hızda izleyebileceği kadar
         (θ = 0,7·yanal tutunma·Δt / hız; 0,2–0,85 rad): top gidiş çizgisinden fazla saparsa oyuncu ona dönmek için yavaşlıyor, dokunuş gecikiyordu.
         Çalım itişi (M.itme) yönünü ve hızını yürütücüden alır: rastlantı ve düzeltme yok (kötü itiş zarı yürütücüdedir) */
      const itis=!!(M&&M.itme),kacis=!!(M&&M.kac),kontrol=!!M&&!itis&&!kacis&&!M.durdur,surer=serbest||kacis||kontrol;
      const Dt0=serbest?1/(lerp(A.dokunusSiklik[0],A.dokunusSiklik[1],clamp(vp/7,0,1))*(1+0.3*bOn)):kacis?0.5:kontrol?0.3:0.22;
      const cekme=serbest&&hrkAbs(f)>2&&bOn>0.3,donus=!itis&&!cekme&&hrkAbs(f)>0.85;
      if(donus)a=hrkAciNorm(p.yon+hrkIsaret(f)*0.85);
      if(surer&&!cekme&&sp>1.2){const tm=clamp(0.7*hrkYanal(p,sp/hrkTepe(p))*Dt0/sp,0.2,0.85),f2=hrkAciFark(a,va);if(hrkAbs(f2)>tm)a=hrkAciNorm(va+hrkIsaret(f2)*tm);}
      const baski=baskiAltinda(this,p);
      /* topu rakipten uzak ayakta tut: yakın (2 m) rakip dokunuş yönünün yanındaysa top ondan biraz öteye (en çok 0,3 rad) */
      if(!itis&&!s.koru&&!cekme){const {o,d:od}=enYakinRakip(this,b.x,b.z,p.team);if(o&&od<2){const yy=hrkCos(a)*(o.z-p.z)-hrkSin(a)*(o.x-p.x);a-=hrkIsaret(yy)*0.3*(2-od)/2;}}
      if(!itis)a+=this.normal()*(0.04+0.1*(1-p.oz.surus))*(1+baski);
      const ca=hrkCos(a),sa=hrkSin(a),ileri=hrkMax(0,p.vx*ca+p.vz*sa);
      let v,Dt=0.22;
      if(itis)v=M.itme;
      else if(M&&M.durdur){v=0.2;Dt=0.5;}
      else if(s.koru||s.bekle)v=ileri*0.95+(s.koru?0.3:0.15);
      else{/* T4: dokunuş aralığı Δt = 1/f, f = lerp(dokunusSiklik; sürüş hızı)·(1 + 0,3·öndeki baskı). Top Δt sonra yine ayağın önünde olsun: yolu,
          oyuncunun bu sürede gideceği yol + (uzanma − topun şimdiki öndeliği); ilk hız top fiziğinden (hrkItmeHizi). Dönüşte oyuncunun yeni yöndeki hızı
          küçük olduğundan dokunuş kendiliğinden kısadır; çekmede top 0,8 m geri. Çalımın hazırlığında kısa (0,3 sn, top 0,45 m önde), kaçışında
          uzun (0,5 sn, top 1,8 m önde) */
        Dt=Dt0;
        const Lc=kacis?1.8:kontrol?0.45:0.9*ulas,vort=ileri+0.5*clamp(vp-ileri,-4*Dt,3*Dt),simdi=dx*ca+dz*sa;let yol=cekme?0.8:hrkMax(0.15,vort*Dt+Lc-simdi);
        /* çizgi: top kaçarsa da (0,8 m daha) saha içinde kalsın; çizgiye yakın sürücü topu kısa tutar */
        const sx=ca>0.05?(PL-0.4-b.x)/ca:ca<-0.05?(-PL+0.4-b.x)/ca:99,sz=sa>0.05?(PW-0.4-b.z)/sa:sa<-0.05?(0.4-b.z)/sa:99;
        yol=hrkMin(yol,hrkMax(0.3,hrkMin(sx,sz)-0.8));
        if(cekme)Dt=0.45;
        v=hrkMin(14,hrkItmeHizi(yol,Dt,this.R));}
      /* son dokunuş (çizim için, rastlantısız): ayak topun gövdeye göre yanı; yüzey: dönüş ayağın kendi yanına dış, öbür yana iç, düz uzun itiş üst */
      const ayak=mdhAyak(p,b.x,b.z),fy=hrkAciFark(a,p.yon);
      /* donus (T2, sözleşme): gövdeye göre keskin yönlü dokunuş (sırtı dönükken dönme, içe/dışa kesme); çizim gövdeyi dönüşe yatırır.
         T4: hareket 'cekme' (topu tabanla geri çekip dönme) */
      p.sonDokunus={t:this.t,tur:'surus',ayak,yuzey:s.koru||s.bekle||cekme?'taban':hrkAbs(fy)<0.3?(v>4.5?'ust':'ic'):(fy>0)===(ayak==='sag')?'dis':'ic',donus:cekme||donus||hrkAbs(fy)>0.7,hareket:cekme?'cekme':null};
      b.vx=ca*v;b.vz=sa*v;b.vy=0;b.y=0;b.egri=0;b.ust=0;
      p.dokunT=itis?0.3:s.koru||s.bekle?0.22:0.95*Dt;this.dokunus(p,true);
      if(itis){const C=p.calim;p.sonDokunus.calim=true;if(C){p.sonDokunus.hareket=C.hareket;C.faz=2;C.ft=0;C.yon2=a;}}
    }
  },
  /* çalım yürütücüsü (T4): niyette cal {o, i?, hareket?, taraf?, P?} varsa deneme kurulur (hareket verilmediyse birebirTahmin seçer).
     faz 0 yaklaşma: rakibe doğru yakHiz ile, tetik mesafesinde (ya da 1,6 sn sonra) aynı hareketle yeniden tahmin; birebirVazgec'in altındaysa
     olaysız vazgeçilir. faz 1 hazırlık (haz sn): tempoda yavaşlama (dur-kalkta top tabanla durur), aldatmada gövde aldatma yanına kayar, yarış ve
     kesmede kısa ayar; ortasında tek aldatma zarı (yutmaCoz). Sonunda itiş: hrkItis (tahminle aynı) ve tek kötü itiş zarı (uzun ya da rakibe doğru).
     faz 2 kaçış: topa tam eforla koşu, kaçış dokunuşları (top 1,8 m önde); savunmacı kaçış yönüne göre 1 m geride kalınca 'gecti'.
     Dönen: {yon, hiz, itme? (topun ilk hızı), bekle? (dokunma), durdur? (topu tabanla durdur), kac? (kaçış dokunuşu), kx/kz (gövde kayması)} ya da null */
  calimAdim(p,s,dt){
    let C=p.calim;
    if(C&&(C.kare<this.kare-1||C.bitti)){this.calimBitir(p,C.bitti?'yarim':this.calimSonucu(p,C));C=null;}
    /* yaklaşırken karar değişti (başka niyet): olaysız biter; kaçışta karar değiştiyse (savunmacı uzakken yeniden düşündü) o anki duruma göre biter */
    if(C&&C.faz===0&&(!s.cal||s.cal.o!==C.o)){p.calim=null;C=null;}
    if(C&&C.faz===2&&!s.cal){this.calimBitir(p,this.calimSonucu(p,C));C=null;}
    if(!C){
      const cal=s.cal;if(!cal||!cal.o)return null;const o=cal.o;
      if(!o.oyunda||o.eylem&&o.eylem.kilit){s.cal=null;return null;}
      C=p.calim={o,i:-1,hareket:null,taraf:cal.taraf||1,faz:0,t0:this.t,ft:0,kare:this.kare,sure:0,P:null,Pk:0,yon2:0,cx:0,cz:0,itme:0,T:0,
        yut:null,Pyut:0,hata:false,hataR:-1,Ph:0,bitti:false,yutDen:false,durdu:false,tah:null,minL:99};
      if(cal.i!=null&&cal.i>=0){C.i=cal.i;C.hareket=HRK_HAREKET[cal.i].ad;if(cal.P!=null)C.P=cal.P;}
      else{const bb=birebirTahmin(this,p,o,s.yon,null);if(bb.i<0){p.calim=null;s.cal=null;return null;}C.i=bb.i;C.hareket=bb.hareket;C.taraf=bb.taraf;C.P=bb.P;}
    }
    C.kare=this.kare;C.ft+=dt;
    const o=C.o,b=this.ball,H=HRK_HAREKET[C.i],ax=o.x-b.x,az=o.z-b.z,L=hrkHyp(ax,az)||0.1,ux=ax/L,uz=az/L,lx=-uz,lz=ux,ana=hrkAtan2(uz,ux);
    if(C.faz>=1&&L<C.minL)C.minL=L;   /* düello ölçüsü: hazırlıktan sonra savunmacının topa en yakın uzaklığı */
    if(!o.oyunda){this.calimBitir(p,'yarim');s.cal=null;return null;}
    if(C.faz===0){
      /* hazırlık itiş itisL'de olacak anda başlar (aradaki kapanma hızıyla) */
      const kap=hrkMax(0,(p.vx-o.vx)*ux+(p.vz-o.vz)*uz);
      if(L>hrkMin(H.tetik,H.itisL+kap*H.haz+0.1)&&C.ft<1.6&&!(o.eylem&&o.eylem.kilit))return{yon:hrkAciNorm(ana+0.5*hrkAciFark(s.yon,ana)),hiz:H.yakHiz};
      /* yeniden doğrulama: savunmacıya yakınken bütün hareketler yeniden tartılır (uzaktaki seçim kabadır); hareket değişebilir (cal.zorla: senaryo
         hareketi sabitler) */
      const bb=birebirTahmin(this,p,o,s.yon,s.cal&&s.cal.zorla?C.i:null);
      if(bb.i<0||bb.P<MOTOR_AYAR.birebirVazgec){p.calim=null;s.cal=null;p.kararT=0;return null;}
      if(bb.i!==C.i){C.i=bb.i;C.hareket=bb.hareket;}
      C.taraf=bb.taraf;C.P=bb.P;C.Pk=bb.Pk;C.Pyut=bb.Pyut;C.faz=1;C.ft=0;C.sure=HRK_HAREKET[C.i].haz;C.tah={pmN:bb.pmN,pmY:bb.pmY,paN:bb.paN,paY:bb.paY,Pcov:bb.Pcov,Ph:bb.Ph,Pyut:bb.Pyut,tA:bb.tA,v0:bb.v0};
    }
    if(C.faz===1){const H=HRK_HAREKET[C.i];
      /* aldatma zarı tahminin olasılığıyla (yaklaşmanın sonundaki uzaklıktan; tahmin ile yürütme aynı) */
      if(!C.yutDen&&C.ft>=0.5*C.sure){C.yutDen=true;C.yut=this.rast()<C.Pyut;if(C.yut)this.yutmaCoz(o,p,H,C);}
      if(C.ft<C.sure){
        if(H.ad==='durKalk'){const ilk=!C.durdu;C.durdu=true;return{yon:ana,hiz:H.hazHiz,durdur:ilk,bekle:!ilk};}
        /* aldatma: gövde hazırlığın ilk yarısında aldatma yanına yüklenir, son kısmında ağırlık geri gelir ve ayak basar (itiş anında yana hız kalmasın:
           kalırsa çıkış 0,3 sn gecikiyordu) */
        if(H.mek==='aldat'){const k=C.ft<0.55*C.sure?H.kay:0;return{yon:ana,hiz:H.hazHiz,kx:-C.taraf*lx*k,kz:-C.taraf*lz*k};}
        return{yon:ana,hiz:H.hazHiz};
      }
      /* itiş: tahminle aynı hesap (savunmacının şimdiki uzaklığı, sürücünün şimdiki hızı); kötü itiş zarı bir kez */
      const it=hrkItis(this,p,H,C.taraf,hrkMax(0.9,L),p.spd,b.x,b.z,ux,uz,p.x,p.z,p.spd>1.5?p.vx/p.spd:ux,p.spd>1.5?p.vz/p.spd:uz);
      if(!it.ok){this.calimBitir(p,'yarim');s.cal=null;p.kararT=0;return null;}
      if(C.hataR<0){C.hataR=this.rast();C.Ph=hrkHata(p,H,hrkYetenek(p,H.yet),C.taraf,hrkDigerBaski(this,p,o));C.hata=C.hataR<C.Ph;}
      let a=it.a,v0=it.v0;if(C.hata){if(C.hataR<0.5*C.Ph)v0*=1.4;else a=hrkAciNorm(a-C.taraf*0.3);}
      C.cx=it.cx;C.cz=it.cz;C.T=it.tA;C.itme=v0;
      if(C.ft>C.sure+0.8){this.calimBitir(p,'yarim');s.cal=null;p.kararT=0;return null;}   /* top ayağa gelmedi */
      return{yon:a,hiz:1,itme:v0};
    }
    /* faz 2: kaçış. Geçti: top bizde ve savunmacı geride kaldı (hrkGecti). Savunmacı kaçış yönünde öndeyken itiş yönünde, değilse kaleye doğru
       (itiş yönünden en çok 0,6 rad) */
    const hy=hrkAtan2(MZ-p.z,this.dir[p.team]*PL-p.x),g=hrkGecti(this,p,o,C.yon2);
    if(g.gecti&&b.sonTakim===p.team&&(b.sahip===p||b.sonDokunan===p)){this.calimBitir(p,'gecti');this.gecildiIsaretle(o,p);s.cal=null;p.kararT=0;return null;}
    /* düello biter: 2,5 sn geçti ya da savunmacı toparlandı (0,6 sn'den sonra topa 3,5 m'den uzak; geçmediyse kale tarafındadır). Maçta sürücü
       bundan sonra yeniden düşünür; senaryoda da aynı kural işler (tahmin ile maç tutarlı kalsın) */
    if(C.ft>2.5||C.ft>0.6&&hrkHyp(o.x-b.x,o.z-b.z)>3.5){this.calimBitir(p,this.calimSonucu(p,C));s.cal=null;p.kararT=0;return null;}
    return{yon:g.on>0.4?C.yon2:hrkAciNorm(C.yon2+clamp(hrkAciFark(hy,C.yon2),-0.6,0.6)),hiz:1,kac:true};
  },
  /* aldatılan savunmacı (T4): yanılgısı {yon (aldatma yanı), t, sure, siddet, mek}; presYap onu o yana yürütür, müdahaleye girmez (mudahaleDene).
     Aldatmaya sert yüklenen (şiddet > 0,6, 2,6 m içinde) dengesini kaybeder. Olay 'yutma' (çizim: kalça ve eğilme yanılgı yönüne, düşme adımı) */
  yutmaCoz(o,p,H,C){
    const sid=clamp(H.yanilt*(0.6+0.6*hrkYetenek(p,H.yet))*(1.2-hrkOkuma(o)),0.2,1),ax=o.x-p.x,az=o.z-p.z,L=hrkHyp(ax,az)||1,lx=-az/L,lz=ax/L,A=MOTOR_AYAR;
    o.yutma={yon:hrkAtan2(-C.taraf*lz,-C.taraf*lx),t:this.t,sure:lerp(A.yutmaSure[0],A.yutmaSure[1],sid)+H.gecikme,siddet:sid,mek:H.mek};
    this.on('yutma',{p:o,surucu:p,hareket:H.ad,siddet:sid});
    if(H.mek==='aldat'&&sid>0.6&&L<2.6)this.dengeBoz(o,0.25+0.35*(sid-0.6),-C.taraf*lx,-C.taraf*lz,'takilma',p);
  },
  /* sürüş yönünde önündeki en yakın rakip (3,2 m içinde, ±55°; koni: kosinüs eşiği); T4: kaleci yalnız kaleciDe ile (bire bir kaleciye yapılmaz, T9b) */
  calimRakibi(p,yon,menzil,kaleciDe,koni){
    const c=hrkCos(yon),sn=hrkSin(yon),ke=koni||0.57;let en=null,ed=menzil||3.2;
    for(const o of this.teams[1-p.team]){if(!o.oyunda||o.eylem&&o.eylem.kilit||o.rol==='GK'&&!kaleciDe)continue;const dx=o.x-p.x,dz=o.z-p.z,d=hrkHyp(dx,dz);
      if(d<ed&&d>0.3&&(dx*c+dz*sn)/d>ke){ed=d;en=o;}}
    return en;
  },
  /* T4 (2026-10-08): çalım denemesinin tek tanımı. Hazırlığı başlamış (faz ≥ 1) her deneme bitişinde bir kez 'calim' olayıyla bildirilir:
     {p, o, hareket, taraf, sonuc: gecti | kayip | faul | disari | yarim, P (tahmin), yut (savunmacı aldatıldı mı), duello (hazırlıktan sonra savunmacı
     topa 1,5 m'den yakın geldi)}. birak: nesne yerinde kalır
     (yalnız bildirilir; avantajda ya da top dışarıdayken eski akış sürer). Rastlantı çekmez */
  calimBitir(p,sonuc,birak){
    const C=p.calim;if(!C)return;
    if(!C.bitti){C.bitti=true;if(C.faz>=1)this.on('calim',{p,o:C.o,hareket:C.hareket||C.tur,taraf:C.taraf,sonuc,P:C.P!=null?C.P:null,yut:C.yut!=null?C.yut:null,
      duello:C.minL!=null&&C.minL<1.5});}
    if(!birak)p.calim=null;
  },
  /* sonuç (denemenin dışarıdan bitirildiği anda): top rakibe geçtiyse kayıp; top hâlâ bizdeyse ve savunmacı kale yolunda değilse geçti; değilse yarım */
  calimSonucu(p,C){
    const b=this.ball;if(b.sonTakim!==p.team)return 'kayip';
    return(b.sahip===p||!b.sahip&&b.sonDokunan===p)&&hrkGecti(this,p,C.o,C.faz===2?C.yon2:p.yon).gecti?'gecti':'yarim';
  },
  /* her karede (topluAI başında): sürüşü önceki karede sürmeyen (top kaybı, pas, şut, devralma) çalımı kapatır; süresi dolan yanılgı silinir */
  calimDenetle(){
    for(const p of this.players){const C=p.calim;if(C&&C.kare<this.kare-1)this.calimBitir(p,C.bitti?'yarim':this.calimSonucu(p,C));
      if(p.yutma&&this.t-p.yutma.t>=p.yutma.sure)p.yutma=null;}
  },
  /* 1. adam (C2): sürücüye kale tarafından, dış yanı gösterecek biçimde biraz içeriden yaklaşır: uzaktan hızla kapanır, yaklaşınca yavaşlar,
     1,6–2,4 m'de yan duruşla jokey yapar (p.tavir='jokey'); sürücüyü tepki gecikmesiyle (τr≈0,32−0,15·karar) izler. Sürücü hızla geliyorsa kalçasını
     açıp koşarak çekilir. Müdahaleye ancak top açıkta ya da sürücü sırtını dönmüşse girer (mudahaleDene, mac-mudahale.js) */
  presYap(p,s,dt){
    const b=this.ball,gx=-this.dir[p.team]*PL,mesafe=hrkHyp(p.x-s.x,p.z-s.z);
    /* T4: aldatılan savunmacı yanılgı süresince aldatma yanına yüklenir (tempoda yerinde kalır, kesmede ataletiyle sürer), müdahaleye girmez */
    const Y=p.yutma;
    if(Y){if(this.t-Y.t<Y.sure){const g=Y.mek==='aldat'?0.8+0.6*Y.siddet:0;
        if(Y.mek==='kesme'){p.tx=p.x+p.vx*0.45;p.tz=p.z+p.vz*0.45;}else{p.tx=p.x+hrkCos(Y.yon)*g;p.tz=p.z+hrkSin(Y.yon)*g;}
        p.hizOran=1;p.bak=b;p.yonHedef=Y.mek==='aldat'?Y.yon:null;return;}
      p.yutma=null;}
    /* T4: çalım sırasında aldatılmayan savunmacı sürücüyü kısa gecikmeyle izler (0,08 sn; hareketi okudu): aldatma artık süzgecin yan etkisi değil,
       yutma zarının sonucudur. İtişten sonra (tepki süresi geçince) top sürücüden 1,2 m'den fazla açıldıysa ve savunmacı topun yoluna sürücüden
       önce yetişebiliyorsa topa koşar (birebirTahmin'in yarışı); yetişemiyorsa kale tarafında jokeyini sürdürür */
    const Ci=s.calim,okudu=Ci&&Ci.o===p&&Ci.faz>=1;
    if(okudu&&Ci.faz===2&&Ci.ft>=hrkMax(0.06,0.16-0.1*p.oz.karar)&&b.y<0.5){
      if(hrkHyp(b.x-s.x,b.z-s.z)>1.2){const kn=this.yakalamaNoktasi(p,0.7);
        if(kn.t<3&&kn.t<varisZamani(s,kn.x,kn.z,0.45,0.05)+0.1){p.tx=kn.x;p.tz=kn.z;p.hizOran=1;p.bak=b;p.yonHedef=null;this.eforVer(p,1);this.mudahaleDene(p,s,dt);return;}}
      /* topa yetişemiyor: toparlanma koşusu — sürücünün 0,5 sn sonraki yerinden kaleye doğru 2,5 m'deki noktaya, koşu yönüne bakarak (yan adımla
         jokey hedefi sürücü yanından geçerken üstüne düşüyor, savunmacı duruyordu) */
      const fx=s.x+s.vx*0.5,fz=s.z+s.vz*0.5,kx=gx-fx,kz=MZ-fz,kl=hrkHyp(kx,kz)||1;
      p.tx=fx+kx/kl*2.5;p.tz=fz+kz/kl*2.5;p.hizOran=1;p.bak=b;p.yonHedef=null;this.eforVer(p,1);this.mudahaleDene(p,s,dt);return;}
    const tr=okudu?0.08:0.32-0.15*p.oz.karar,k=hrkMin(1,dt/tr);
    if(p._algS!==s){p._algS=s;p._algVx=s.vx;p._algVz=s.vz;}
    p._algVx+=(s.vx-p._algVx)*k;p._algVz+=(s.vz-p._algVz)*k;
    /* T4: aldatmanın hazırlığında aldatılmayan savunmacı gövdeyi değil topu izler (tahminle aynı: yanal hız aldatmaya kapılmaz) */
    const aldatma=okudu&&Ci.faz===1&&Ci.i>=0&&HRK_HAREKET[Ci.i].mek==='aldat';
    const ox=aldatma?b.x:s.x+p._algVx*0.3,oz=aldatma?b.z:s.z+p._algVz*0.3;
    let nx=gx-ox,nz=MZ-oz;const L=hrkHyp(nx,nz)||1;nx/=L;nz/=L;
    /* yönlendirme: kanatta dışarıyı gösterir (içeriden yaklaşır); ortada (orta çizgiden 10 m içinde) sürücünün güçlü ayağı tarafında durur, onu zayıf
       ayağına iter (T4; sezgiyle) */
    let qx=-nz,qz=nx;const orta=hrkAbs(oz-MZ)<10&&s.ayak!=='iki';
    if(orta){const sag=s.ayak!=='sol';if(!sag){qx=-qx;qz=-qz;}}else if(qz*(MZ-oz)<0){qx=-qx;qz=-qz;}
    /* mesafe: kaleye dönük sürücüye jokey (1,6–2,4 m); sırtı ya da yanı dönükse sıkı (1–1,4 m, dönmesine izin verme); vuruş hazırlığında üstüne */
    /* T4: jokey mesafesi müdahale becerisinden değil sürücünün hızından (eskiden 2,25 − 0,5·müdahale: kötü müdahaleci geride durup daha zor geçiliyordu);
       arkasında yardım varsa %20'ye kadar yakın (destekHesapla) */
    const des=this.destekHesapla(p),kale=hrkCos(s.yon)*nx+hrkSin(s.yon)*nz,R0=clamp(1.95+0.1*s.spd,1.6,2.4)*MOTOR_AYAR.jokeyMesafe*(1-0.2*des),
      R=s.eylem&&s.eylem.ad==='vurus'?hrkMin(R0,0.8):kale<0.3?lerp(0.9,R0,clamp((kale+1)/1.3,0,1)):R0;
    const al=orta?0.05+0.1*profilAlt(p,'sezgi',0.5):0.15+0.3*clamp((hrkAbs(oz-MZ)-6)/14,0,1);
    p.tx=ox+R*(nx*hrkCos(al)+qx*hrkSin(al));p.tz=oz+R*(nz*hrkCos(al)+qz*hrkSin(al));p.bak=b;
    const yaklas=hrkMax(0,(s.vx*(p.x-s.x)+s.vz*(p.z-s.z))/(mesafe||1));
    /* T4: sürücünün savunmacıya göre yan hızı (yanından geçiyor): yan adımın tavanı (~4 m/sn) yetmez, dönüp koşar */
    const yanH=hrkAbs(s.vx*(p.z-s.z)-s.vz*(p.x-s.x))/(mesafe||1);
    if(mesafe>5.5)p.hizOran=1;
    /* T4: üstüne koşan sürücüye koşarak çıkılmaz: sürücünün yaklaşma hızı arttıkça kapanma yavaşlar (hızlı yaklaş, yavaş var; Ek G3) */
    else if(mesafe>R+1.2){p.hizOran=clamp(0.9-0.3*(yaklas-1),0.15,0.9);p.yonHedef=hrkAtan2(s.z-p.z,s.x-p.x);}
    else if(yaklas>0.55*p.maxSpd||yanH>0.45*p.maxSpd)p.hizOran=1;   /* koşarak çekil ya da yanında koş: gidiş yönüne bakar */
    else if(kale<0.3){p.hizOran=1;p.yonHedef=hrkAtan2(s.z-p.z,s.x-p.x);}   /* sıkı markaj: yüzü sürücüye */
    else{p.tavir='jokey';p._tavirKare=this.kare;p.hizOran=1;
      const a=hrkAtan2(s.z-p.z,s.x-p.x),off=0.45+0.8*clamp((yaklas-2.5)/3,0,1),d1=hrkAciNorm(a+off),d2=hrkAciNorm(a-off);
      p.yonHedef=-(hrkCos(d1)*qx+hrkSin(d1)*qz)>=-(hrkCos(d2)*qx+hrkSin(d2)*qz)?d1:d2;}
    /* geçildi mi: 1. adam sürücünün kale tarafından arkasına düştüyse (yakınken) bir kez taktik faul şansı (mac-mudahale.js) */
    const arka=((p.x-s.x)*nx+(p.z-s.z)*nz)<-0.5&&mesafe<1.8;
    if(arka)this.gecildiIsaretle(p,s);else if(mesafe>2.5)p._gecS=null;
    this.mudahaleDene(p,s,dt);
  },
  /* T4: yardım (0–1): 1. adamın 3 m arkasındaki noktaya (kendi kalesine doğru) en yakın takım arkadaşının (kaleci hariç) varış süresi destekSure
     aralığında 1 → 0; 3 karede bir hesaplanır (p._destek, p._destekK). Yardım varsa savunmacı yakın durur ve erken girer, yoksa geciktirir */
  destekHesapla(p){
    if(p._destekK!=null&&this.kare-p._destekK<3)return p._destek;
    const gx=-this.dir[p.team]*PL,dx=gx-p.x,dz=MZ-p.z,L=hrkHyp(dx,dz)||1,hx=p.x+dx/L*3,hz=p.z+dz/L*3,A=MOTOR_AYAR;let en=9;
    for(const q of this.teams[p.team]){if(q===p||!q.oyunda||q.rol==='GK'||q.eylem&&q.eylem.kilit)continue;const ddx=q.x-hx,ddz=q.z-hz;if(ddx*ddx+ddz*ddz>100)continue;
      const t=varisZamani(q,hx,hz,0.5,0.2);if(t<en)en=t;}
    p._destekK=this.kare;return p._destek=clamp((A.destekSure[1]-en)/(A.destekSure[1]-A.destekSure[0]),0,1);
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
