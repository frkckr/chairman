/* ============ Chairman — maç motoru: hava topu (mantık, çizimsiz) ============
   Sahibi: C akışı (T6, 2026-10-10; gerçekçilik planı §4 T6). Sıçrama (planı ve yürütmesi), hava teması, hava düellosu ve hava faulü. T6'ya kadar
   sıçrama (ziplamalar), kafa adayları, düello ve hava faulü js/mac-mudahale.js'teydi; buraya taşındı.
   T6a (sıçrama modeli): sıçrama planlı eylemdir — p.zipla {t, sure, tepe, kos, hz}: t < 0 kalkış hazırlığı (−hz'den başlar), 0'da kalkış, sure'de
   iniş; p.yuk = tepe·4f(1 − f), f = t/sure (motor → çizim). Yükseklik sıçrama alt özelliğinden (durarak 0,30–0,42 m, koşarak +0,08–0,12;
   yorgunluk düşürür), uçuş süresi fizikten (sure = 2√(2·tepe/g)). Kalkış temas anını hedefler: oyuncu topun alnının erişiminden geçeceği ilk anı
   (tc) görür; hazırlık + tepeye çıkış kalınca kalkar. Zamanlama hatası ε (sn; + geç: tepe temastan sonra) oyuncu ve top sürümü başına tek zar,
   σ = taban + çarpan × (1 − okuma), okuma = sezgi ve kafa; top 15 m/sn'den hızlı gelirse büyür. Havada ivme yok (moveP havaIvme); durarak sıçrayan
   hazırlıkta frenler, kalkışta yatay hızının %35'ini, koşarak sıçrayan sicramaYatay'ını korur. Çekişmede (2 m içinde rakip) en yükseğe, yoksa
   gerektiği kadar sıçrar. Rakipsiz pası bekleyen alıcı sıçramaz (topun inmesini bekler; kovala). Düşen oyuncunun havadaki sıçraması iniş sürer
   (eskiden zipla silinip p.yuk kalıyordu: oyuncu havada asılı kalabiliyordu).
   T6b (yer kapma ve düello geometriden): kafa teması adım içinde baş ile topun geometrisinden bulunur (hvTemas): baş merkezi alında (hvAlin),
   gövde ve boyunla yatayda en çok hvEgilme kadar topa uzanır; top merkezi baş merkezine 0,23 m'den (iki yarıçap) yaklaştığı ilk ara noktada
   değer (adım 6 ara noktada taranır; temasın kesri s, baş–top dikey farkı dy, yatay uzaklık dh). Birden çok aday varsa topa yolu boyunca ilk değen
   (en küçük s) kazanır — inen topa yüksek baş önce değer; eşitlikte güçlü olan (kütle, sertlik) yerini korur. Düello: kazananın 1,25 m içinde
   havadaki, sıçramaya hazırlanan ya da teması olan rakip; rakibin başı 0,1 sn içinde değecekse temas anları sapmayla (havaDuello, σ 0,035 sn;
   boyun ve gövdenin son uzanması, itişme) karşılaştırılır. Düelloya girenler boş kafa eylemi alır, gövde gövdeye itişir, hava faulü sınanır
   (meşru omuz temasının payı düşülür). Sıçrama planlanan temas noktasına yönelir (kalkışta yatay hız).
   Topun uçuşunu okuma (kovala): oyuncu ve top sürümü başına iki zar daha — derinlik (topun gidişi yönünde) ve yanal hata (m; σ = taban +
   çarpan × (1 − okuma), yanal yarısı); karşılama noktası bu kadar kayar, top yaklaştıkça (karşılamaya 1 sn kalandan) en çok %60'a iner.
   T6c (kafa kalitesi): temasın yüzeyi geometriden (hvYuzey) — alın (top baş merkezinin ±0,12 m'sinde, baş gövdeyle uzanma sınırında), yan
   (uzanmanın 0,06 m ötesi: başın yanıyla), tepe (top 0,12 m üstte: sıyırma), yüz (0,12 m altta: fazla yüksek sıçradı, top yüze ya da boyna
   gelir). İsabet (σ çarpanı) ve güç yüzeyden (HV_YUZEY), çekişmede σ ×1,4 ve güç ×0,9; tepeyle sıyırmada top gelişini büyük ölçüde korur
   (uzatma) ve yukarı kalkar (js/mac-topla.js kafaVur).
   T6d (ortak tahmin): havaDuelloTahmin saftır (rastlantısız): iki oyuncu da inişteyken topu kim alır — inen topa yüksek baş önce değer, erişim
   (ayaktaki alın + durarak sıçrama + 0,12) farkından lojistik (ölçek 0,105 m; c-hava'daki güçlü × orta %75–85 ile ayarlı); topa erişemeyen
   kaybeder. Pas analizi (havadan pasın inişi: orta, korner, uzun top), hedef forvete uzun top (hedefHavaP) aynı modeli okur (tasarım ilkesi 1).
   Baş: kafaYuksekligi başın tepesidir; alın (baş merkezi) 0,10 m altı (hvAlin). */
'use strict';
ayarEkle('C',{
  sicramaDur:[0.30,0.12],      // T6a: durarak (çift ayak, karşı hareketli) sıçrama: taban + çarpan × sıçrama alt özelliği (m; Ek G4: 0,40–0,45 kol salınımıyla)
  sicramaKos:[0.08,0.04],      // T6a: koşarak (tek ayak) ek yükseklik: taban + çarpan × min(1, (hız − 2,5)/3) (m); koşarak sayılması için hız ≥ 2,5 m/sn
  sicramaHazir:[0.15,0.08],    // T6a: kalkıştan önce hazırlık (sn): durarak karşı hareket, koşarak son adım
  sicramaZaman:[0.04,0.08],    // T6a: zamanlama hatasının σ'sı: taban + çarpan × (1 − okuma) (sn; Claude kararı 0,04–0,12)
  sicramaYatay:0.7,            // T6a: koşarak sıçramada kalkışta korunan yatay hız oranı (durarak 0,35)
  havaIvme:0.05,               // T6a: havadayken ivme sınırının çarpanı (ayak yerde değil; eskiden 0,25)
  havaOkuma:[0.12,0.36],       // T6b: topun uçuşunu okuma hatası (derinlik) σ = taban + çarpan × (1 − okuma) (m; yanal hata yarısı)
  havaEgilme:[0.35,0.10],      // T6b: başın gövde ve boyunla yatayda topa uzanması (m): ayakta / koşarak sıçrarken ek
  havaDuello:0.035             // T6b: düelloda neredeyse aynı anda varan başların temas anı sapması σ (sn; boyun ve gövdenin son uzanması, itişme; fiziksel aralık 0,025–0,05)
});
/* alnın yüksekliği (m; sıçrayarak) ve ayaktaki yüksekliği: başın tepesinin (kafaYuksekligi) 0,10 m altı */
const hvAlin=p=>1.72*(p.boy||1)+0.02+(p.yuk||0),hvAlinDur=p=>1.72*(p.boy||1)+0.02;
/* topun uçuşunu okuma (0–1): sezgi ve kafa */
const hvOkuma=p=>0.5*profilAlt(p,'sezgi',p.oz.karar)+0.5*p.oz.kafa;
/* sıçrama yüksekliği (m): v kalkıştaki hız (≥ 2,5 m/sn koşarak) */
const hvSicramaH=(p,v)=>{const A=MOTOR_AYAR,D=A.sicramaDur,K=A.sicramaKos;let h=D[0]+D[1]*profilAlt(p,'sicrama',p.oz.kafa);
  if(v>=2.5)h+=K[0]+K[1]*Math.min(1,(v-2.5)/3);return h*(1-0.15*(p.yorgunluk||0));};
const hvUcus=h=>2*Math.sqrt(2*h/G);
/* başın yatay uzanması (m): koşarak sıçrayan daha çok uzanır */
const hvEgilme=p=>{const E=MOTOR_AYAR.havaEgilme;return E[0]+(p.zipla&&p.zipla.kos&&p.zipla.t>=0?E[1]:0);};
/* okuma ve zamanlama zarları: oyuncu ve top sürümü başına bir kez (sırası sabit: zamanlama, derinlik, yanal) */
function hvHataAl(m,p){const b=m.ball;if(p._hvS===b.surum)return;p._hvS=b.surum;const A=MOTOR_AYAR,Z=A.sicramaZaman,O=A.havaOkuma,ok=1-hvOkuma(p),v=hyp(b.vx,b.vz);
  p._hvE=m.normal()*(Z[0]+Z[1]*ok)*(1+0.3*clamp((v-15)/10,0,1));const sd=O[0]+O[1]*ok;p._hvD=m.normal()*sd;p._hvL=m.normal()*sd*0.5;}
/* kafa teması (adımın topu b.p* → b.*): baş merkezi (p.x, hvAlin, p.z) yatayda hvEgilme'ye kadar topa uzanır; top merkezi baş merkezine
   0,23 m'den (iki yarıçap) yaklaşınca erişimdedir. Oyuncu alnını topun hizasına getirir: erişimdeki top alnın 0,12 m üstünden alçaksa değer
   (−0,12 altı: fazla yüksek sıçradı, top yüze ya da boyna gelir); daha yüksekse ve inerken alnın hizasına gelmeden erişimden çıkmayacaksa bekler,
   çıkacaksa başın tepesiyle sıyırır. Adım 6 ara noktada taranır. Rastlantısız; temas yoksa false; varsa p._hvTs (kesir 0–1), p._hvTy (top − baş,
   m), p._hvTd (yatay uzaklık, m) yazılır (oyuncu nesnesinde, ayırma yok) */
const HV_T={s:0,e:0,dh:0};
/* genel sınama: top a → b parçası (hız v), baş merkezi (px, hy, pz), uzanma L. Temas varsa HV_T doldurulur (s kesir, e top − baş, dh topun
   yolunun başa en yakın yatay uzaklığı), kesir döner; yoksa −1 */
function hvTemasG(ax,ay,az,bx,by,bz,vx,vy,vz,px,hy,pz,L){const dx=bx-ax,dy=by-ay,dz=bz-az;
  for(let k=0;k<=6;k++){const s=k/6,y=ay+dy*s,e=y-hy;if(e>0.23||e<-0.23)continue;
    const x=ax+dx*s-px,z=az+dz*s-pz,dh=Math.sqrt(x*x+z*z),r=L+Math.sqrt(0.0529-e*e);
    if(dh>r)continue;
    if(e>0.12&&vy<-0.5){/* top alnın üstünde: inip alnın hizasına (0,12) erişimden çıkmadan gelecek mi */
      const t=(e-0.12)/-vy,x2=x+vx*t,z2=z+vz*t;if(Math.sqrt(x2*x2+z2*z2)<=L+0.196)continue;}
    /* T6c: yanal uzanma topun yolunun başa en yakın geçtiği yatay uzaklıktan (ilk temas erişimin kenarında olur; oyuncu alnını yola getirir) */
    const v2=vx*vx+vz*vz,ca=v2>0.01?Math.abs(x*vz-z*vx)/Math.sqrt(v2):dh;
    HV_T.s=s;HV_T.e=e;HV_T.dh=ca<dh?ca:dh;return s;}
  return -1;}
function hvTemas(m,p){const b=m.ball;if(hvTemasG(b.px,b.py,b.pz,b.x,b.y,b.z,b.vx,b.vy,b.vz,p.x,hvAlin(p),p.z,hvEgilme(p))<0)return false;
  p._hvTs=HV_T.s;p._hvTy=HV_T.e;p._hvTd=HV_T.dh;return true;}
/* T6b: bu adımda teması olmayan düellocunun başı topa önümüzdeki n adımda değer mi (topun öngörülen yolu, sıçramanın parabolü, yatay hızı);
   değerse süre (sn), değmezse −1. Rastlantısız */
function hvTemasOnu(m,p,n){const yol=m.topYolu(),i0=Math.max(0,Math.round((m.t-m._yolT0)*60)-1),z=p.zipla,b=m.ball,dt=1/60,aD=hvAlinDur(p),L=hvEgilme(p);
  let a=b;for(let k=1;k<=n&&i0+k<yol.length;k++){const c=yol[i0+k],t=k*dt;let yk=p.yuk||0;
    if(z){const f=(z.t+t)/z.sure;yk=f>0&&f<1?z.tepe*4*f*(1-f):0;}
    const s=hvTemasG(a.x,a.y,a.z,c.x,c.y,c.z,(c.x-a.x)/dt,(c.y-a.y)/dt,(c.z-a.z)/dt,p.x+p.vx*t,aD+yk,p.z+p.vz*t,L);
    if(s>=0)return(k-1+s)*dt;a=c;}
  return -1;}
/* T6c: kafanın teması (bu adımın temasından: p._hvTy, p._hvTd) ve yüzeye göre [isabet σ çarpanı, güç çarpanı] */
const hvYuzey=p=>{const e=p._hvTy;if(e>0.12)return 'tepe';if(e<-0.12)return 'yuz';return p._hvTd>hvEgilme(p)+0.06?'yan':'alin';};
const HV_YUZEY={alin:[1,1],yan:[1.6,0.85],tepe:[2.4,0.55],yuz:[3,0.4]};
/* T6d: algı vekilinin (karar katmanı) kaynağı: vekil boy ve profil taşımayabilir */
const hvKaynak=(m,o)=>o.kaynak||(o.vekil&&m.teams[o.team]?m.teams[o.team][o.n]:o)||o;
/* başın temiz temas erişimi (m): ayaktaki alın + durarak sıçrama + 0,12 */
const hvErisim=p=>hvAlinDur(p)+hvSicramaH(p,0)+0.12;
/* T6d: hava düellosu tahmini (saf): ikisi de inişteyken a, d'ye karşı y yüksekliğindeki topu alır mı (0,05–0,95). Topa (erişim + 0,11) yetişemeyen
   kaybeder; ikisi de yetişemezse 0,5 */
function havaDuelloTahmin(m,a,d,y){const A=hvKaynak(m,a),D=hvKaynak(m,d),ra=hvErisim(A),rd=hvErisim(D),ua=y>ra+0.11,ud=y>rd+0.11;
  if(ua&&ud)return 0.5;if(ua)return 0.05;if(ud)return 0.95;return clamp(1/(1+Math.exp(-(ra-rd)/0.105)),0.05,0.95);}
/* eşit temasta yerini koruyan: kütle ve sertlik */
const hvGuc=p=>kutle(p)*(0.8+0.4*(p.oz.sertlik!=null?p.oz.sertlik:0.5));
/* sıçramanın ilerlemesi (çekirdeğin adım döngüsünden). T6b: kalkışta sıçrama planlanan temas noktasına (z.cx, z.cz; kalkıştan z.tt sn sonra)
   yönelir — yatay hız en çok koşarak kalkıştaki hızın sicramaYatay'ı (≤ 4,5 m/sn), durarak 1 m/sn (eskiden yalnız hızın bir payı korunuyordu:
   koşarak gelen topun 0,8 m yanından geçebiliyordu) */
function ziplaIlerle(p,dt){const z=p.zipla,t0=z.t;z.t+=dt;
  if(t0<0&&z.t>=0){const dx=z.cx-p.x,dz=z.cz-p.z,d=Math.sqrt(dx*dx+dz*dz),vM=z.kos?Math.min(4.5,MOTOR_AYAR.sicramaYatay*Math.max(p.spd,z.v0)):1.0,v=Math.min(vM,d/Math.max(0.1,z.tt));
    if(d>1e-3){p.vx=dx/d*v;p.vz=dz/d*v;}else{p.vx=0;p.vz=0;}p.spd=v;}
  const f=z.t/z.sure;p.yuk=f>0&&f<1?z.tepe*4*f*(1-f):0;if(f>=1)p.zipla=null;}
Object.assign(Match.prototype,{
  /* ============ T6a: sıçrama planı (temaslar'ın başında, her adım) ============
     Top sahipsiz ve havadayken (yükselirken ya da 0,9 m üstünde) saha oyuncularının her biri topun önümüzdeki 0,9 sn'lik yolunda alnının
     erişimine (yatayda 0,55 m, koşarak 0,65; dikeyde ayaktaki alın − 0,25 … alın + en yüksek sıçrama + 0,15) ilk girdiği anı arar. Yatay yer:
     koşan oyuncu hazırlıkta hızıyla, kalkıştan sonra sicramaYatay'la ilerler; duran yerinde kalır. Sıçrama gerekmiyorsa (top ayaktaki alnın
     0,05 m üstünden alçak) ya da çok yüksekse (çekişme yokken en yüksek sıçramanın 0,12 m, çekişmede 0,25 m üstü) plan yok */
  sicramalar(){
    const b=this.ball;if(b.sahip||b.tasiyan||b.sut||(b.y<0.9&&b.vy<=0.5))return;   /* T6b: şutta sıçranmaz (blok sutBlok'ta) */
    const A=MOTOR_AYAR,yol=this.topYolu(),i0=Math.max(0,Math.round((this.t-this._yolT0)*60)-1),iN=Math.min(yol.length-1,i0+54);
    for(const p of this.players){
      if(!p.oyunda||p.rol==='GK'||p.zipla||p.kickCd>0)continue;
      const e=p.eylem;if(e&&(e.kilit||e.ad==='vurus'||e.ad==='tac'||e.ad==='kafa'))continue;
      const dx0=b.x-p.x,dz0=b.z-p.z;if(dx0*dx0+dz0*dz0>400)continue;
      /* rakipsiz pası bekleyen alıcı sıçramaz (kovala: topun inmesini bekler; T6e: ortanın alıcısı beklemez) */
      if(b.hedefOyuncu===p&&!(b.pasHedef&&b.pasHedef.tur==='orta')&&enYakinRakip(this,p.x,p.z,p.team).d>3.5)continue;
      const sp=p.spd,kos=sp>=2.5,hz=kos?A.sicramaHazir[1]:A.sicramaHazir[0],hM=hvSicramaH(p,sp),aD=hvAlinDur(p),R=A.havaEgilme[0]+(kos?A.havaEgilme[1]:0)+0.2;
      /* T6b: kalkış yeri — hazırlıkta hedefine doğru hızıyla (koşarak; durarak yerinde); kalkıştan temasa sıçrama temas noktasına yönelir (koşarak
         ≤ min(4,5, sicramaYatay·hız), durarak ≤ 1 m/sn); baş erişimi R */
      const gx=p.tx-p.x,gz=p.tz-p.z,gL=Math.sqrt(gx*gx+gz*gz),ux=gL>0.05?gx/gL:0,uz=gL>0.05?gz/gL:0,ad=kos?Math.min(gL,sp*hz):0,kx=p.x+ux*ad,kz=p.z+uz*ad,vS=kos?Math.min(4.5,A.sicramaYatay*sp):1.0;
      let tc=-1,yc=0,cx=0,cz=0;
      for(let i=i0+2;i<=iN;i+=2){const s=yol[i],t=(i-i0)/60;if(t<=hz+0.05||s.y<aD-0.23||s.y>aD+hM+0.23)continue;
        const dx=s.x-kx,dz=s.z-kz,d=Math.sqrt(dx*dx+dz*dz),sR=vS*(t-hz)+R;if(d>sR)continue;
        /* başın erişimine kadar sıçrayarak yaklaşır: temas noktası topa R'den yakın değilse topa doğru R kadar geride */
        const k=d>R?(d-R*0.6)/d:0;tc=t;yc=s.y;cx=kx+dx*k;cz=kz+dz*k;break;}
      /* T6d: çekişme sıçraması — top erişimime girmiyor ama 1,3 m içindeki bir rakibin başına inecekse onu zorlamak için topa doğru sıçrarım
         (markajdaki savunmacı hücumcunun arkasından, hücumcu uzaklaştıran savunmacıya); düelloya girer, kafayı zorlaştırır */
      let zorla=false;
      if(tc<0)for(let i=i0+2;i<=iN;i+=2){const s=yol[i],t=(i-i0)/60;if(t<=hz+0.05||s.y<aD-0.23||s.y>aD+hM+0.5)continue;
        const dx=s.x-kx,dz=s.z-kz,d=Math.sqrt(dx*dx+dz*dz);if(d>vS*(t-hz)+R+0.75)continue;
        const k2=Math.min(t,0.5);let yakin=false;for(const o of this.teams[1-p.team]){if(!o.oyunda||o.rol==='GK')continue;const ox=o.x+o.vx*k2-s.x,oz=o.z+o.vz*k2-s.z;if(ox*ox+oz*oz<1.69){yakin=true;break;}}
        if(!yakin)continue;const k=d>R?(d-R*0.6)/d:0;tc=t;yc=Math.min(s.y,aD+hM);cx=kx+dx*k;cz=kz+dz*k;zorla=true;break;}
      if(tc<0)continue;
      const ihtiyac=yc-aD;if(ihtiyac<0.05)continue;
      let cek=zorla;if(!cek)for(const o of this.teams[1-p.team]){if(!o.oyunda||o.rol==='GK')continue;const k=Math.min(tc,0.5),ox=o.x+o.vx*k-cx,oz=o.z+o.vz*k-cz;if(ox*ox+oz*oz<4){cek=true;break;}}
      if(ihtiyac>hM+(cek?0.25:0.12))continue;
      /* T6b: takım arkadaşının başkasına attığı pasta çekişme yoksa sıçranmaz (amaçsız sıçrama oyuncuyu havada ~0,7 sn oyun dışı bırakır) */
      if(!cek&&b.sonTakim===p.team&&b.hedefOyuncu&&b.hedefOyuncu!==p)continue;
      /* zamanlama hatası: oyuncu ve top sürümü başına tek zar (okuma; hızlı top; T6b: okuma zarlarıyla birlikte hvHataAl) */
      hvHataAl(this,p);
      const h=cek?hM:clamp(ihtiyac+0.06,0.12,hM),T=hvUcus(h);
      /* kalkış anı: tepe temas anında (+ ε); kalkış temasa yetişmiyorsa (temastan en az 0,08 sn önce yerden kesilemiyorsa) sıçranmaz */
      if(tc+p._hvE<=hz+T/2+0.5/60&&tc-hz>=0.08)p.zipla={t:-hz,sure:T,tepe:h,kos,hz,cx,cz,tt:tc-hz,v0:sp};
    }
  },
  /* ============ T6b: hava topu — topa yolu boyunca ilk değen baş kazanır ============
     kafa: bu adımda kafa teması olanlar (erisim → hvTemas; p._hvTs, p._hvTy, p._hvTd). Düello: kazananın 1,25 m içinde havadaki, sıçramaya
     hazırlanan ya da teması olan rakip (kaleci ve kilitli eylemdeki hariç). Düelloya girenler boş kafa eylemi alır; güçlü ve daha yükseğe çıkan
     rakibi iter (havadaki oyuncu yere dengesiz inebilir); en yakın rakiple hava faulü sınanır */
  havaTopu(kafa){
    let w=kafa[0];
    for(const a of kafa){if(a===w)continue;const p=a.p,q=w.p;if(p._hvTs<q._hvTs-1e-9||(p._hvTs<=q._hvTs+1e-9&&hvGuc(p)>hvGuc(q)))w=a;}
    let W=w.p;const R=this._hvR||(this._hvR=[]);R.length=0;
    for(const o of this.teams[1-W.team]){if(!o.oyunda||o.rol==='GK'||(o.eylem&&o.eylem.kilit))continue;const d=hrkHyp(o.x-W.x,o.z-W.z);if(d>1.25)continue;
      if(o.zipla||kafa.some(a=>a.p===o))R.push(o);}
    if(R.length){this.ist.havaTopu++;let kay=null,kd=9;
      /* neredeyse aynı anda varış: rakibin başı topa 0,1 sn içinde değecekse temas anları (+ sapma havaDuello) karşılaştırılır; erken olan kazanır */
      const sd=MOTOR_AYAR.havaDuello;let enT=W._hvTs/60+this.normal()*sd,en=-1;
      for(let i=0;i<R.length;i++){const q=R[i],ak=kafa.some(a=>a.p===q),t0=ak?q._hvTs/60:hvTemasOnu(this,q,6);if(t0<0)continue;
        if(!ak){q._hvTs=HV_T.s;q._hvTy=HV_T.e;q._hvTd=HV_T.dh;}   /* T6c: öngörülen temasın yüzeyi */
        const t=t0+this.normal()*sd;if(t<enT){enT=t;en=i;}}
      if(en>=0){const q=R[en];R[en]=W;W=q;}
      for(const q of R){q.eylem={ad:'kafa',t:0,sure:0.5,bos:true};q.kickCd=0.4;
        const dx=q.x-W.x,dz=q.z-W.z,n=hrkHyp(dx,dz)||1,yuk=(W.yuk||0)-(q.yuk||0);if(n<kd){kd=n;kay=q;}
        if(n<1.2)this.dengeBoz(q,(0.12+0.3*clamp((kutle(W)-kutle(q))/25+yuk*1.5,0,1)+0.1*W.oz.sertlik)*(1+(q.yuk||0)*2),dx/n,dz/n,'hava',W);}
      if(kay&&this.havaFaulu(W,kay))return;}
    this.kafaVur(W,R.length>0);
  },
  /* T5 (2026-10-09): hava topunda faul temastan — kaybeden kazanana (1,2 m'den yakın) çarpar; tek zar hakemin görmesi. T6b: şiddet = 1,8 m/sn'yi
     aşan kapanma hızı / 3,5 (omuz omuza ikisi de topa sıçrarken yaklaşma meşru temastır; eskiden kapanma/5 bütün yaklaşmayı sayıyordu) + arkadan
     0,3 + geç sıçrayıp (yerde ya da kalkışta) havadakine girme 0,15 + agresiflik */
  havaFaulu(kazanan,kaybeden){
    const w=kazanan,q=kaybeden,dx=w.x-q.x,dz=w.z-q.z,d=hrkHyp(dx,dz);if(d>1.2||d<1e-3)return false;
    const vk=hrkMax(0,((q.vx-w.vx)*dx+(q.vz-w.vz)*dz)/d),arka=(-dx*hrkCos(w.yon)-dz*hrkSin(w.yon))/d;   /* arka < −0,3: kaybeden kazananın arkasında */
    const gec=(w.yuk||0)>0.1&&(!q.zipla||q.zipla.t<0||(q.yuk||0)<(w.yuk||0)-0.15);
    const cc=hrkMax(0,vk-1.8)/3.5+(arka<-0.3?0.3:0)+(gec?0.15:0)+(profilAlt(q,'agresiflik',q.oz.sertlik)-0.5)*0.5;
    return this.temasFaulu(q,w,cc,{hava:true,arkadan:arka<-0.3,kaynak:'hava',x:w.x,z:w.z});
  }
});
