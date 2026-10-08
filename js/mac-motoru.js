/* ============ Chairman — maç motoru: görüntüden bağımsız oyun mantığı ============
   Koordinatlar: x −52,5…52,5 (kaleler), z 0…68 (z=0 ana tribün tarafındaki taç çizgisi). Görüntü katmanı z'den 34 çıkarır.
   Zaman: motor sabit adımla (1/60 sn) ilerler. Hareketler gerçek hızdadır; maç saati 9 kat hızlı akar (90 dk ≈ 10 dk).
   Evreler: isinma → giris → toren → selam → yazitura (maç günü: js/mac-oncesi.js) → kickoff → play ⇄ durus (taç, korner, aut,
   serbest vuruş, penaltı) / goal → halftime → … → fulltime.
   Oyuncunun gerçek bir bakış yönü (yon) vardır ve dönüşü sınırlıdır: hızlı koşarken yavaş döner, geri geri koşamaz.
   Topla her iş bir eylemdir: vuruşta önce hazırlık (hedefe dön, topu vuran ayağın önüne al), sonra geri salınım ve temas, sonra takip.
   Top fiziği: yuvarlanma, sekme, hava direnci, falso; direk, üst direk, ağ. Top sürme dokunuşlarla olur, aradaki anlarda top serbesttir.
   Top toplayıcılar (N10, kullanıcı kararı 2026-10-04): dışarı çıkan top yuvarlanıp panolarda durur; taç, korner ve autta en yakın çocuk
   elindeki yedek topu atana verir, eski topu boştaki çocuk toplar (js/mac-kurallar.js). 2.8O/MM0b'deki koniler kaldırıldı.
   Diziliş ve topsuz oyun js/mac-dizilis.js'te, topla karar js/mac-karar.js'te, kurallar ve duran toplar js/mac-kurallar.js'tedir.
   Faz 0 (2026-10-03) dosya sahipliği: hareket ve beden js/mac-hareket.js, ikili mücadele/faul/avantaj js/mac-mudahale.js, vuruş/pas/şut/ilk dokunuş
   js/mac-topla.js, kaleci js/mac-kaleci.js; bu dosya çekirdektir (top fiziği, aşamalar, temas sırası). Ayrıntı TEKNIK_PLAN §8.
   Olaylar on(ad, veri) ile bildirilir; görüntü bunları dinler. Rastgelelik tohumludur (this.rast): aynı tohum aynı maçı verir.
   MM1 (2026-10-02; fizik, temas, beden): topun yan (egri) ve üst/kesik (ust) dönüşü Magnus etkisi yaratır (falsolu şut, düşen sert şut,
   havada asılı kalan orta); kötü zeminde sekme düzensizdir. İlk dokunuş gelen topun hızının bir kısmını taşır, kafa vuruşu gelen hızı kullanır,
   erişemediği topa çarpan beden topu yansıtır (blok ve bacaktan sekme de yansımadır; hakem de engeldir). Oyuncuların kütlesi (boy, yapı, sertlik)
   çarpışmada momentumu paylaştırır; ivme düşük hızda güçlü, tepe hıza yaklaştıkça azalır; hava topunda oyuncu gerçekten sıçrar (p.yuk) ve
   temas anında en yükseğe ulaşan avantajlıdır. Yorgunluk hız, ivme, vuruş isabeti ve karar süresini etkiler; duraklamada ve devre arasında azalır. */
const PL=52.5,PW=68,MZ=34,GH=2.44,GW2=3.66,GPR=9,G=9.81;
/* ---- top fiziği (T9a, 2026-10-07; gerçekçilik planı §4 T9 "Top"): sürükleme hıza bağlı, dönüş açısal hızla ve doyan Magnus, sekmede dik
   geri sekme çarpma hızıyla azalır ve sürtünme itkisi kaymayı giderir, yerde kayma → yuvarlanma, koşul kapısı (ıslak, rüzgâr). Dönüş iki açısal
   hızla tutulur (wYan düşey eksen: falso; wUst enine eksen: üst/kesik dönüş; rad/sn); egri ve ust vuruşun girdisi ve her adımda dönüşten yeniden
   yazılan okunur alanlardır (çizim sözleşmesi: js/animasyon.js, js/kamera.js). Boylamsal bileşenin uçuşta etkisi olmadığından vektör yerine iki
   bileşen tutulur; sekmede yön değişimi için yan dönüşün ekseni eğik varsayılır (egikEksen). TEST değerleri ---- */
const TOP_YARICAP=0.11,DIREK_R=0.06;
const TOP_FIZIK={
  surukleYavas:0.025,surukleHizli:0.012,gecisHiz:14,gecisGen:1.5,     // hava direnci a = k(v)·v² (1/m): yavaş topta 0,025, hızlı topta 0,012; geçiş ~14 m/sn (Ek E)
  magnus:0.053,clEnCok:0.33,clS0:0.18,                                 // Magnus a = magnus·C_L(S)·v², C_L = clEnCok·S/(S + clS0), S = ω·r/v (doyar)
  yanOlcek:2.5,ustOlcek:1.0,donusSonum:0.1,                            // egri/ust → dönüş oranı (vuruş anındaki hızla); havada dönüşün saniyelik sönümü
  sekmeE:[0.65,0.45],sekmeEgim:0.0105,sekmeSurtunme:0.4,egikEksen:0.5, // dik geri sekme e = 0,65 − 0,0105·(vn − 2) (0,45–0,65); sürtünme μ; yan dönüşün eğik ekseni
  kayma:0.4,yerDirenc:0.0125,yuvarlanma:[1.5,0.6],                     // yerde kayma sürtünmesi (×g); yuvarlanan topun hava direnci (1/m); yuvarlanma yavaşlaması zemin 0 → 1 (m/sn²)
  islak:{kayma:0.55,sekme:0.85,yuvarlanma:0.8}                          // ıslak zemin çarpanları (T9a kapısı; görünümü §7.8, T10)
};
const ROLL=lerp(TOP_FIZIK.yuvarlanma[0],TOP_FIZIK.yuvarlanma[1],0.7),TOP_KOSUL_YOK={islak:0,ruzgar:null};
/* zeminden yuvarlanma yavaşlaması (zemin 0 tarla … 1 halı; ıslakta top daha uzun gider) */
function zeminYuvarlanma(zemin,islak){return lerp(TOP_FIZIK.yuvarlanma[0],TOP_FIZIK.yuvarlanma[1],clamp(zemin==null?0.7:zemin,0,1))*(islak?TOP_FIZIK.islak.yuvarlanma:1);}
const topSurukleme=v=>TOP_FIZIK.surukleYavas+(TOP_FIZIK.surukleHizli-TOP_FIZIK.surukleYavas)/(1+Math.exp(-(v-TOP_FIZIK.gecisHiz)/TOP_FIZIK.gecisGen));
const topKaldirma=S=>TOP_FIZIK.clEnCok*S/(S+TOP_FIZIK.clS0);
const CEZA_U=16.5,CEZA_W=20.16,ALTIPAS_U=5.5,ALTIPAS_W=9.16,PENALTI_U=11;
const MAC_ONCESI=['isinma','giris','toren','selam','yazitura'],DEVRE_ARASI=45;
/* oyuncu özellikleri (kadrolar.js'te 1–99 arası, aynı sırayla) */
const OZ_SIRA=['hiz','pas','sut','kafa','surus','mudahale','gorus','karar','kalecilik','dayaniklilik','sertlik'];
const VARSAYILAN_OZ=[62,58,55,55,56,55,55,56,8,66,50];
const VARSAYILAN_TAKTIK={dizilis:'4-4-2',sakin:0.5,direkt:0.5,risk:1,pres:0.5,tempo:0.5};
/* ayar katsayıları: araclar/mac-deneme.js ile hedef tabloya göre ayarlanır. Çekirdekte yalnız takım düzeni ayarları kalır; her akış kendi
   dosyasında ayarEkle ile kendi anahtarlarını ekler (aynı anahtar iki kez eklenemez; Faz 0, 2026-10-03) */
const MOTOR_AYAR={
  gecis:0.7,                   // topu kaybeden takımın savunma düzenine geçme gecikmesi (sn)
  donus:0.75,                  // savunmaya dönüşte topa uzak oyuncunun hız oranı (birleştirme 2026-10-03: 0,85 → 0,75, koşu mesafesi)
  karsiPres:3.0,               // top kaybından sonra karşı pres süresi (sn; takımın pres ayarıyla 0,6–1,4 katı) (MM2)
  sekilGecikme:0,              // T1: topu yeni kazanan takımın hücum düzenine geçme gecikmesi (sn; kısa sahiplikte şekil değişmez)
  blokYumusak:4,               // T1: bölge hedefinin izlediği top yerinin yumuşatma süresi (sn; 0: ham): tehlikesiz yönde
  blokHizli:4,                 // T1: aynısı tehlikede (savunmada top kalemize gelirken, hücumda top ileri giderken)
  hucumGecikme:1               // T1: hücumdaki takımın bölge oyuncuları da kişisel tepkiyle kayar: 1 topun gerisindekiler, 2 hepsi, 0 hiçbiri
};
const MOTOR_AYAR_SAHIBI={gecis:'cekirdek',donus:'cekirdek',karsiPres:'cekirdek',sekilGecikme:'cekirdek',blokYumusak:'cekirdek',blokHizli:'cekirdek',hucumGecikme:'cekirdek'};
function ayarEkle(akis,o){for(const k in o){if(Object.prototype.hasOwnProperty.call(MOTOR_AYAR,k))throw new Error('MOTOR_AYAR.'+k+' iki kez eklendi ('+MOTOR_AYAR_SAHIBI[k]+', '+akis+')');
  MOTOR_AYAR[k]=o[k];MOTOR_AYAR_SAHIBI[k]=akis;}}
/* eylem adımları: eylem adı → işlev(p, e, dt), this maçtır; sahibinin dosyasında kaydedilir (Faz 0) */
const EYLEM_ADIM={};

/* ---- açı ve geometri yardımcıları (Math.hypot yavaş olduğu için karekökle) ---- */
const hyp=(a,b)=>Math.sqrt(a*a+b*b),hyp3=(a,b,c)=>Math.sqrt(a*a+b*b+c*c);
const aciNorm=a=>a-2*Math.PI*Math.floor((a+Math.PI)/(2*Math.PI));
const aciFark=(a,b)=>aciNorm(a-b);
function segD(px,pz,ax,az,bx,bz){const vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az;const L2=vx*vx+vz*vz||1;const t=clamp((vx*wx+vz*wz)/L2,0,1);return hyp(px-ax-vx*t,pz-az-vz*t);}
/* ortak yardımcılar (eskiden js/mac-karar.js'teydi; bütün akışlar kullanır) */
const sigma=x=>1/(1+Math.exp(-x));
/* baskı: en yakın rakibin yakınlığı (0 = serbest, 1 = üstünde) */
function baskiAltinda(m,p){let d=99;for(const o of m.teams[1-p.team])if(o.oyunda)d=Math.min(d,hyp(o.x-p.x,o.z-p.z));return clamp((4.5-d)/3.5,0,1);}
function enYakinRakip(m,x,z,t){let e=null,d=1e9;for(const o of m.teams[1-t])if(o.oyunda){const dd=hyp(o.x-x,o.z-z);if(dd<d){d=dd;e=o;}}return{o:e,d};}
/* ofsayt çizgisi: rakibin sondan ikinci oyuncusunun u'su (hücum eden takımın çerçevesinde) */
function ofsaytCizgisi(m,t){const d=m.dir[t],us=m.teams[1-t].filter(o=>o.oyunda).map(o=>o.x*d).sort((a,b)=>b-a);return Math.max(us[1]||0,0);}
/* kütle (kg): boy ve yapıdan; sertlik gövde mücadelesinde etkin kütleyi artırır. Hakemler sıradan bir yetişkin */
function kutle(p){if(p._kutle)return p._kutle;const y=(p.kayit&&p.kayit.yapi)||1,s=p.oz&&p.oz.sertlik!=null?p.oz.sertlik:0.5;
  return p._kutle=72*(p.boy||1)*(p.boy||1)*y*(0.85+0.3*s);}
/* başın o anki yüksekliği (m): ayakta boyla, sıçrarken p.yuk kadar yukarıda */
const kafaYuksekligi=p=>1.72*(p.boy||1)+0.12+(p.yuk||0);
function ozellikler(k){const v=(k&&k.oz)||VARSAYILAN_OZ,o={};OZ_SIRA.forEach((a,i)=>{o[a]=(v[i]!=null?v[i]:VARSAYILAN_OZ[i])/100;});return o;}
/* yerden vurulan (dönüşsüz) top önce KAYAR: yavaşlama μg, yüzey hızı 2,5 katı artar; hızı 5/7'ye inince YUVARLANIR (kayma yolu s1 = (24/49)·v0²/(2μg),
   süresi (2/7)·v0/μg). Yuvarlanırken v² mesafeyle üstel azalır (R yuvarlanma yavaşlaması, c hava direnci). Buradan hız, ilk hız ve süre: pas
   planlayıcısı (js/mac-karar.js) bunlarla fizikle tutarlı kalır. K: koşullar (ıslakta kayma uzar; verilmezse kuru) */
const yerKayma=K=>TOP_FIZIK.kayma*G*(K&&K.islak?TOP_FIZIK.islak.kayma:1);
function yerHiz(v0,s,R,K){const a=yerKayma(K),s1=(24/49)*v0*v0/(2*a);
  if(s<=s1){const w=v0*v0-2*a*s;return w>0?Math.sqrt(w):0;}
  const v1=v0*5/7,c=TOP_FIZIK.yerDirenc,k=(R||ROLL)/c,w=(v1*v1+k)*Math.exp(-2*c*(s-s1))-k;return w>0?Math.sqrt(w):0;}
function yerIlkHiz(L,varis,R,K){const a=yerKayma(K);
  const vk=Math.sqrt(varis*varis+2*a*L);if((24/49)*vk*vk/(2*a)>=L)return vk;   /* yalnız kayarak varır */
  /* kayma + yuvarlanma: yerHiz(v0, L) = varis için v0 (v0'da tekdüze artar); ikiye bölme, 16 adım (~0,001 m/sn) */
  let alt=vk,ust=60;for(let i=0;i<16;i++){const o=(alt+ust)/2;if(yerHiz(o,L,R,K)<varis)alt=o;else ust=o;}
  return (alt+ust)/2;}
function yerSure(v0,s,R,K){const a=yerKayma(K),s1=Math.min(s,(24/49)*v0*v0/(2*a));
  let t=(v0-Math.sqrt(Math.max(0,v0*v0-2*a*s1)))/a,v=yerHiz(v0,s1,R,K);const kalan=s-s1;if(kalan<=0)return t;
  const ds=kalan/4;for(let i=1;i<=4;i++){const v2=yerHiz(v0,s1+ds*i,R,K);if(v2<=0.05)return 99;t+=ds/((v+v2)/2);v=v2;}return t;}
/* pasın alıcıya varış hızı: kısa pas yumuşak, uzun pas sert */
const pasVarisHizi=L=>clamp(7+L*0.15,8,12);
/* vuruşun girdilerinden (egri, ust; vuruş anındaki hızla) açısal hızlar. Gerçek top her dokunuşta (surum) yeniden kurar; sürümü olmayan tahmin
   kopyaları (havadanCoz, kamera) okunur alanlardan her adımda yeniden kurar (okunur alanlar dönüşle tutarlı yazıldığından aynı sonuç) */
function topDonusHazirla(b){
  if(b.surum!==undefined&&b._donSurum===b.surum)return;
  const v=hyp3(b.vx,b.vy,b.vz)||1;b.wYan=(b.egri||0)*TOP_FIZIK.yanOlcek*v/TOP_YARICAP;b.wUst=(b.ust||0)*TOP_FIZIK.ustOlcek*v/TOP_YARICAP;b._donSurum=b.surum;
  b.sw=b.wUst*TOP_YARICAP;   /* yüzey hızı: yerde kayma ↔ yuvarlanma */
}
function topDonusYaz(b,v){const k=TOP_YARICAP/(v||1);b.egri=b.wYan*k/TOP_FIZIK.yanOlcek;b.ust=b.wUst*k/TOP_FIZIK.ustOlcek;}
/* tek adım top fiziği (gerçek top da tahmin de bununla ilerler). ucus: yere çarpmayı yok say (vuruş çözümü için). R: yuvarlanma yavaşlaması,
   K: koşullar {islak, ruzgar:{x,z}} (verilmezse kuru ve rüzgârsız) */
function topFizikAdim(b,dt,ucus,R,K){
  topDonusHazirla(b);K=K||TOP_KOSUL_YOK;
  if(ucus||b.y>0.001||b.vy>0.001){
    /* sürükleme havaya göre hızla (rüzgâr), katsayı hıza bağlı: yavaşlayan aşırtma ve asılan orta sonda "ölür" */
    const rw=K.ruzgar,rvx=b.vx-(rw?rw.x:0),rvz=b.vz-(rw?rw.z:0),v=hyp3(rvx,b.vy,rvz),k=topSurukleme(v)*v*dt;
    b.vx-=rvx*k;b.vy-=b.vy*k;b.vz-=rvz*k;
    /* Magnus: yan dönüş yana, üst dönüş aşağı (kesik yukarı); dönüş oranı S = ω·r/v hız düştükçe büyür, C_L doyar; dönüş yavaş söner */
    if(b.wYan){const S=Math.abs(b.wYan)*TOP_YARICAP/(v||1),a=TOP_FIZIK.magnus*topKaldirma(S)*v*v*Math.sign(b.wYan)/(hyp(rvx,rvz)||1);
      b.vx-=rvz*a*dt;b.vz+=rvx*a*dt;b.wYan*=1-TOP_FIZIK.donusSonum*dt;}
    if(b.wUst){const S=Math.abs(b.wUst)*TOP_YARICAP/(v||1);b.vy-=TOP_FIZIK.magnus*topKaldirma(S)*v*v*Math.sign(b.wUst)*dt;b.wUst*=1-TOP_FIZIK.donusSonum*dt;}
    b.vy-=G*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;
    if(!ucus&&b.y<=0){b.y=0;
      if(b.vy<-1.3){/* sekme: dik geri sekme çarpma hızıyla azalır; yatayda sürtünme itkisi (≤ μ·(1+e)·vn) kaymayı giderir — üst dönüşlü top ileri
           fırlar, kesik dönüşlü top frenler, yüzey hızı değişir; yan dönüşlü top eğik eksen varsayımıyla yana itilir (yön değiştirir); ıslakta düşük ve kaygan */
        const vn=-b.vy,isl=K.islak?1:0,e=clamp(TOP_FIZIK.sekmeE[0]-TOP_FIZIK.sekmeEgim*(vn-2),TOP_FIZIK.sekmeE[1],TOP_FIZIK.sekmeE[0])*(isl?TOP_FIZIK.islak.sekme:1);
        const J=TOP_FIZIK.sekmeSurtunme*(isl?TOP_FIZIK.islak.kayma:1)*(1+e)*vn,vh=hyp(b.vx,b.vz)||1,ux=b.vx/vh,uz=b.vz/vh;
        const sw=b.wUst*TOP_YARICAP,slip=vh-sw,sg=Math.sign(slip),m=Math.min(J,(2/7)*Math.abs(slip)),nv=vh-sg*m;b.wUst=(sw+2.5*sg*m)/TOP_YARICAP;
        const ys=b.wYan*TOP_YARICAP*TOP_FIZIK.egikEksen,ml=Math.min(J*0.5,(2/7)*Math.abs(ys))*Math.sign(ys);
        b.vx=ux*nv-uz*ml;b.vz=uz*nv+ux*ml;b.vy=vn*e;b.wYan*=0.7;}
      else b.vy=0;
      b.sw=b.wUst*TOP_YARICAP;}
    topDonusYaz(b,v);
  }else{
    b.y=0;b.vy=0;const s=hyp(b.vx,b.vz);
    if(s>0){/* kayma: yüzey hızı topun hızına yetişene kadar μg ile yavaşlar (yüzey hızı 2,5 katı artar; üst dönüşlü top ileri çıkar); sonra
         yuvarlanma: R + c·v² */
      const a=yerKayma(K),slip=s-b.sw;let ns;
      if(Math.abs(slip)>0.05){const f=a*dt*Math.sign(slip);if(Math.abs(slip)<=3.5*Math.abs(f)){ns=s-slip*(2/7);b.sw=ns;}else{ns=s-f;b.sw+=2.5*f;}}
      else{ns=Math.max(0,s-((R||ROLL)+TOP_FIZIK.yerDirenc*s*s)*dt);b.sw=ns;}
      b.vx*=ns/s;b.vz*=ns/s;b.wUst=b.sw/TOP_YARICAP;b.wYan*=1-1.5*dt;}
    else{b.sw=0;b.wUst=0;}
    b.x+=b.vx*dt;b.z+=b.vz*dt;topDonusYaz(b,hyp(b.vx,b.vz));
  }
}

class Match{
  /* secenek.kadro: [ev, konuk] (js/kadrolar.js), secenek.tunel: {x,z} tünel ağzı, secenek.tohum: rastgele tohumu,
     secenek.kulubeler: [{takim, koltuklar:[{x,z}], alan:{x,z}}] (motor koordinatı; verilmezse varsayılan),
     secenek.taraftarYeri / deplasmanYeri: {x,z,nx,nz} maç sonunda takımın alkışlayacağı tribünün önü (n: tribüne doğru birim yön) */
  constructor(on,secenek){
    secenek=secenek||{};this.on=on||(()=>{});this.kadro=secenek.kadro||null;this.tunel=secenek.tunel||{x:0,z:-6};
    this.kulubeler=secenek.kulubeler||[0,1].map(t=>({takim:t,koltuklar:[0,1,2,3,4,5].map(i=>({x:(t?11.5:-11.5)-2.6+i*1.04,z:-5.75})),alan:{x:t?11.5:-11.5,z:-2.4}}));
    this.tohum=(secenek.tohum!=null?secenek.tohum:Math.floor(Math.random()*4294967296))>>>0;this.rast=tohumluRastgele(this.tohum);
    /* zemin 0 (tarla) – 1 (halı gibi): kötü zeminde top çabuk durur, sekmesi düzensizdir. T9a koşul kapısı: secenek.kosullar = {zemin, islak,
       ruzgar:{x,z} m/sn}; varsayılan kuru ve rüzgârsız (görünüm ve kullanım §7.8, T10). Pas planlayıcısı kuru varsayar */
    this.kosullar=Object.assign({islak:0,ruzgar:null},secenek.kosullar||{});
    this.zemin=clamp(this.kosullar.zemin!=null?this.kosullar.zemin:secenek.zemin!=null?secenek.zemin:0.7,0,1);this.kosullar.zemin=this.zemin;
    this.R=zeminYuvarlanma(this.zemin,this.kosullar.islak);
    this.taraftarYeri=secenek.taraftarYeri||{x:0,z:PW-4,nx:0,nz:1};this.deplasmanYeri=secenek.deplasmanYeri||null;
    this.reset();
  }
  normal(){let u=0;while(u===0)u=this.rast();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*this.rast());}
  reset(){
    this.score=[0,0];this.half=1;this.gameSec=0;this.t=0;this.phase='kickoff';this.phaseT=0;this.dir=[1,-1];
    this.yaziTura=null;this.ilkSantra=0;this.tuneleGitti=false;this.celeb=null;this.durus=null;this.sp=null;this.sahiplikNo=0;
    this.ist={sut:[0,0],isabet:[0,0],korner:[0,0],tac:[0,0],kaleVurusu:[0,0],faul:[0,0],sari:[0,0],kirmizi:[0,0],ofsayt:[0,0],
      pas:[0,0],pasTamam:[0,0],pasYon:{ileri:0,yan:0,geri:0},uzunPas:0,havaTopu:0,uzatma:[0,0],degisiklik:[0,0],oyunda:0,toplam:0,sahiplik:[0,0]};
    this.shots=this.ist.sut;this.poss=this.ist.sahiplik;
    this.duranSure=[0,0];this.added=[60,120];this.uzatmaIlan=[false,false];
    this.taktik=[0,1].map(t=>Object.assign({},VARSAYILAN_TAKTIK,this.kadro&&this.kadro[t].taktik));
    this.players=[];this.teams=[[],[]];
    for(let t=0;t<2;t++){const diz=DIZILISLER[this.taktik[t].dizilis]||DIZILISLER['4-4-2'];
      for(let n=0;n<11;n++){const p=this.oyuncuKur(t,n,this.kadro&&this.kadro[t].oyuncular[n],diz.mevkiler[n]);this.players.push(p);this.teams[t].push(p);}}
    /* hakemler: orta hakem, sağ yarının yan hakemi (karşı taç), sol yarının yan hakemi (ana tribün tacı) */
    this.refs=[this.hakemKur('ref',-6,26),this.hakemKur('lin',20,PW+1.3),this.hakemKur('lin',-20,-1.3)];
    this.topcular=this.topculariKur();this.disToplar=[];
    this.yedekleriKur();this.kenarKur();
    this.ball={x:0,z:MZ,y:0,vx:0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,sonDokunan:null,sonTakim:0,hedefOyuncu:null,sut:null,pas:null,
      surum:0,agda:false,direk:false,px:0,py:0,pz:0,
      /* T9a: açısal hızlar (rad/sn), yüzey hızı (m/sn) ve dönüşün kurulduğu sürüm (topDonusHazirla) */
      wYan:0,wUst:0,sw:0,_donSurum:-1};
    this.kuralHazirla();
    this.oncesiHazirla();
  }
  /* bütün insanlar (oyuncu, hakem, top toplayıcı, yedek) aynı alanlarla başlar */
  varlik(tur,x,z,ek){
    return Object.assign({tur,kind:null,team:null,n:-1,rol:null,mevki:null,name:'',no:0,kaptan:false,kayit:null,oz:null,ayak:'sag',boy:1,
      x,z,vx:0,vz:0,spd:0,yon:0,maxSpd:7,tx:x,tz:z,hizOran:1,bak:null,yonHedef:null,eylem:null,kickCd:0,kararT:0,dokunT:0,surus:null,
      oyunda:false,cikiyor:false,kart:0,yorgunluk:0,destek:null,kosu:null,gorev:null,sevinc:false,hedef:null,tutus:null,_cikis:null,
      ilkSoruldu:-1,penaltiTahmin:0,ev:null,top:false,topBos:0,kartSira:null,gir:0,_kar:null,oturuyor:false,koltuk:null,cikti:false,poz:null,sg:null,yuk:0,zipla:null,
      /* motor → çizim sözleşmesi (Faz 0; TEKNIK_PLAN §8): tavır, bakış yönü, denge, sprint enerjisi, son dokunuş */
      tavir:null,bakisYon:null,denge:1,enerji:1,sonDokunus:null,
      /* T3 (profil kapısı): oyuncu ve yedekte profilKur ile dolar {alt, rol, egilim, form, grup} (js/mac-profil.js); hakem ve top toplayıcıda null */
      profil:null,
      /* T1 (insan gibi hareket): efor 0–1, hız kipi (dur/yuru/tiris/kos/hizli/depar; çizim okur), son düşünme anı (sn) */
      efor:1,kip:'dur',dusunT:0,
      /* A2a (2026-10-08): jest {tur: kol|isaret|itiraz|cagir|basEl|alkis, t, sure, kol, hedef} — motor → çizim; yazan iş T7/T10 (bugün null) */
      jest:null,
      /* akışların oyuncuya sonradan yazdığı iç alanlar baştan (undefined) tanımlı: nesnenin biçimi değişmez, motor yavaşlamaz (birleştirme, 2026-10-03) */
      _cev:undefined,_hk:undefined,_kacKare:undefined,_kacX:undefined,_kacZ:undefined,_varisHiz:undefined,_varisKare:undefined,_tavirKare:undefined,
      _algS:undefined,_algVx:undefined,_algVz:undefined,_omuzT:undefined,_calim:undefined,_acikBas:undefined,_acikKare:undefined,_gecS:undefined,
      _kp:undefined,_duz:undefined,_pen:undefined,_poz:undefined,_sonKurt:undefined,
      /* T1 iç alanları: kararlı hedef, efor karesi, kip ve süresi, son ivme (karede hız değişimi), düşünme aralığı (kare) */
      _hdfX:0,_hdfZ:0,_hdfK:-9,_eforK:-1,_kipI:0,_kipT:0,_iax:0,_iaz:0,_dusP:0},ek);
  }
  oyuncuKur(t,n,k,mevki){
    const oz=ozellikler(k),rol=mevki.cizgi==='KL'?'GK':mevki.cizgi;
    const p=this.varlik('oyuncu',0,MZ,{team:t,n,rol,mevki,name:k?k.ad:TEAMS[t].names[n],no:k?k.no:n+1,kaptan:!!(k&&k.kaptan),kayit:k||null,oz,
      ayak:(k&&k.ayak)||'sag',boy:(k&&k.boy)||1,yon:t?Math.PI:0,maxSpd:6.4+2.4*oz.hiz,oyunda:true});
    profilKur(p,this.tohum);   /* T3: alt özellikler, rol, eğilimler ve gün formu (js/mac-profil.js); rastlantı çekmez */
    return p;
  }
  hakemKur(kind,x,z){return this.varlik('hakem',x,z,{kind,maxSpd:7.2,oz:{hiz:0.6}});}
  focus(){const c=this.celeb,b=this.ball;if(this.phase==='goal'&&c&&c.scorer&&!c.own)return{x:c.scorer.x,y:1,z:c.scorer.z};
    const h=b.tasiyan;if(h)return{x:h.x,y:1,z:h.z};return{x:b.x,y:b.y,z:b.z};}
  minuteLabel(){
    if(this.phase==='halftime')return 'İY';if(this.phase==='fulltime')return 'MS';if(MAC_ONCESI.includes(this.phase))return '';
    const s=this.gameSec;
    if(this.half===1&&s>=2700)return '45+'+(Math.floor((s-2700)/60)+1);
    if(this.half===2&&s>=5400)return '90+'+(Math.floor((s-5400)/60)+1);
    return String(Math.floor(s/60)+1);
  }
  kaleci(t){return this.teams[t][0];}
  /* santra rolleri dizilişteki mevkiden gelir (MM2; eskiden sabit forma sırası 9/10/7): santrayı hedef forvet yapar, yanında ikinci forvet
     ya da 10 numara durur, ilk pası ortadaki (derin olmayan) orta saha alır. Oyuncu eksikse en uygun saha oyuncusu */
  santraci(t){const L=this.sahadakiler(t).filter(p=>p.rol!=='GK');
    return L.find(p=>p.mevki.hedef)||L.find(p=>p.rol==='FV')||L.find(p=>p.mevki.onOrta)||L.reduce((a,c)=>Math.abs(c.mevki.w-MZ)<Math.abs(a.mevki.w-MZ)?c:a);}
  santraYardimcisi(t){const s=this.santraci(t),L=this.sahadakiler(t).filter(p=>p.rol!=='GK'&&p!==s);
    return L.find(p=>p.rol==='FV'&&!p.mevki.kanat)||L.find(p=>p.mevki.onOrta)||L.find(p=>p.rol==='FV')||null;}
  santraAlici(t){const s=this.santraci(t),y=this.santraYardimcisi(t),L=this.sahadakiler(t).filter(p=>p.rol==='OS'&&p!==s&&p!==y);
    const uz=p=>Math.abs(p.mevki.w-MZ)+(p.mevki.derin?6:0)+(p.mevki.kanat?20:0);
    return L.length?L.reduce((a,c)=>uz(c)<uz(a)?c:a):this.sahadakiler(t).find(p=>p.rol!=='GK'&&p!==s)||s;}
  sahadakiler(t){return this.teams[t].filter(p=>p.oyunda);}

  /* ============ ana döngü ============ */
  step(dt){
    this.t+=dt;this.phaseT+=dt;this.kare=(this.kare||0)+1;
    const saat=this.phase!=='halftime'&&this.phase!=='fulltime'&&!MAC_ONCESI.includes(this.phase);
    if(saat){this.gameSec+=dt*GPR;this.ist.toplam+=dt;if(this.phase==='play')this.ist.oyunda+=dt;}
    this.hakemAI(dt);
    switch(this.phase){
      case 'isinma':this.stepIsinma(dt);break;
      case 'giris':this.stepGiris(dt);break;
      case 'toren':this.stepToren(dt);break;
      case 'selam':this.stepSelam(dt);break;
      case 'yazitura':this.stepYazitura(dt);break;
      case 'kickoff':this.stepKick(dt);break;
      case 'play':this.stepPlay(dt);break;
      case 'durus':this.stepDurus(dt);break;
      case 'goal':this.stepGoal(dt);break;
      default:this.stepBreak(dt);
    }
    if(['kickoff','play','durus','goal'].includes(this.phase))this.kenarAI(dt);
    /* sıçramalar ve dinlenme: oyun dururken ve devre arasında yorgunluk biraz azalır */
    const dinlen=this.phase==='halftime'?0.004:this.phase==='durus'||this.phase==='goal'||this.phase==='kickoff'?0.0015:0;
    for(const p of this.players){if(p.zipla){const z=p.zipla;z.t+=dt;const f=z.t/z.sure;p.yuk=f<1?z.tepe*4*f*(1-f):0;if(f>=1)p.zipla=null;}
      if(dinlen&&p.yorgunluk>0)p.yorgunluk=Math.max(0,p.yorgunluk-dinlen*dt);}
    this.topcuAI(dt);this.disToplarAdim(dt);
    if(saat)this.devreSonuKontrol();
  }

  /* maç öncesi, devre arası ve maç sonu (maç günü akışı) js/mac-oncesi.js'tedir */

  /* ============ santra ============ */
  santraKonumu(p,takim){
    const d=this.dir[p.team],k=dizilisKonumu(this.taktik[p.team].dizilis,p.n,0,MZ,p.team===takim);
    let u=Math.min(k.u,p.rol==='GK'?k.u:-1.2),w=k.w;
    if(p.team===takim&&p===this.santraci(takim)){u=-0.3;w=MZ-0.2;}
    else if(p.team===takim&&p===this.santraYardimcisi(takim)){u=-0.9;w=MZ+2.6;}
    else if(p.team!==takim&&p.rol!=='GK'){const dz=w-MZ,dd=hyp(u,dz);if(dd<10){const s=10/(dd||1);u=-Math.abs(u*s||10);w=MZ+dz*s;}}
    return{x:u*d,z:w};
  }
  santraHazirla(takim,isinla){
    this.phase='kickoff';this.phaseT=0;this.kickTeam=takim;this.durus=null;this.celeb=null;
    const b=this.ball;
    if(isinla||b.agda)this.topuSifirla(0,MZ);
    for(const p of this.players){
      if(!p.oyunda)continue;
      const k=this.santraKonumu(p,takim);p.tx=k.x;p.tz=k.z;p.hizOran=0.55;p.eylem=null;p.surus=null;p.kickCd=0;p.sevinc=false;p.kosu=null;p.destek=null;
      p.bak=b;p.yonHedef=null;
      if(isinla){p.x=k.x;p.z=k.z;p.vx=p.vz=0;p.yon=this.dir[p.team]>0?0:Math.PI;}
    }
    if(isinla){const r=this.refs[0];r.x=-6;r.z=26;}
  }
  stepKick(dt){
    this.taramaAdim(dt);   /* santrada da etrafa bakılır (bakış yönü ve algı güncel kalır) */
    const b=this.ball,tk=this.santraci(this.kickTeam);
    /* top orta noktada değilse santrayı yapacak oyuncu alır, orta noktaya koyar */
    const yerinde=hyp(b.x,b.z-MZ)<0.3&&!b.tasiyan&&b.y<0.05&&hyp(b.vx,b.vz)<0.2;
    if(!yerinde){
      if(b.tasiyan===tk){tk.tx=-0.35*this.dir[tk.team];tk.tz=MZ-0.25;tk.hizOran=0.5;if(hyp(tk.x,tk.z-MZ)<0.7)this.topuSifirla(0,MZ);}
      else if(!b.tasiyan){/* kalecinin gönderdiği topu santrayı yapacak oyuncu karşılar, eliyle ya da ayağıyla tutar */
        const k=this.yakalamaNoktasi(tk,2.2);tk.tx=k.x;tk.tz=k.z;tk.hizOran=0.8;tk.bak=b;
        if(hyp(b.x-tk.x,b.z-tk.z)<1.2&&b.y<2.2){b.tasiyan=tk;this.topDegisti();}}
    }else{const k=this.santraKonumu(tk,this.kickTeam);tk.tx=k.x;tk.tz=k.z;}
    this.hareketHepsi(dt);this.topAdim(dt);
    let hazir=yerinde;
    if(hazir)for(const p of this.players)if(p.oyunda&&hyp(p.tx-p.x,p.tz-p.z)>1.3){hazir=false;break;}
    if(hazir&&this.phaseT>1.6||this.phaseT>22){
      if(!yerinde)this.topuSifirla(0,MZ);
      const al=this.santraAlici(this.kickTeam);
      this.on('kickoff',{team:this.kickTeam,half:this.half});this.refs[0].eylem={ad:'duduk',t:0,sure:0.8};
      this.phase='play';this.phaseT=0;
      tk.x=-0.35*this.dir[tk.team];tk.z=MZ-0.25;tk.vx=tk.vz=0;tk.yon=this.dir[tk.team]>0?0:Math.PI;
      this.sahipYap(tk);this.vurusBaslat(tk,{tur:'pas',hx:al.x,hz:al.z,tip:'yer',alici:al});
    }
  }

  /* ============ oyun ============ */
  stepPlay(dt){
    const b=this.ball;
    if(b.sahip)this.ist.sahiplik[b.sahip.team]+=dt;
    this.bedenAdim(dt);    /* yorgunluk ve beden (mac-hareket.js) */
    this.taramaAdim(dt);   /* etrafa bakma (mac-topla.js) */
    this.takimAI(dt);
    this.topluAI(dt);
    this.hareketHepsi(dt);
    this.topAdim(dt);
    if(this.phase!=='play')return;
    this.temaslar(dt);
    if(this.phase!=='play')return;
    this.sinirlar();
    this.kuralAdim(dt);
  }

  /* ============ top ============ */
  topuSifirla(x,z){const b=this.ball;Object.assign(b,{x,z,y:0,vx:0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,agda:false,direk:false,endirekt:null,tac:null});b.surum++;}
  topDegisti(){this.ball.surum++;this._degisimT=this.t;}
  /* topun gelecekteki yolu (3,5 sn, 1/60 adım). Top her dokunuşta değişir; o zamana kadar hesap önbellekte kalır */
  topYolu(){
    const b=this.ball;
    if(this._yol&&this._yolSurum===b.surum&&this.t-this._yolT0<1.2)return this._yol;
    const s={x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:b.egri,ust:b.ust||0,wYan:b.wYan,wUst:b.wUst,sw:b.sw,surum:b.surum,_donSurum:b._donSurum},yol=[];
    for(let i=0;i<210;i++){topFizikAdim(s,1/60,false,this.R,this.kosullar);yol.push({x:s.x,y:s.y,z:s.z,v:hyp(s.vx,s.vz)});}
    this._yol=yol;this._yolSurum=b.surum;this._yolT0=this.t;return yol;
  }
  /* t saniye sonra top nerede */
  topTahmin(t){const yol=this.topYolu(),i=clamp(Math.round((this.t-this._yolT0+t)*60)-1,0,yol.length-1);return yol[i];}
  topAdim(dt){
    const b=this.ball;b.px=b.x;b.py=b.y;b.pz=b.z;
    if(b.tasiyan){const h=b.tasiyan,c=Math.cos(h.yon),s=Math.sin(h.yon),tac=h.eylem&&h.eylem.ad==='tac';
      b.x=h.x+c*(tac?0.05:0.32);b.z=h.z+s*(tac?0.05:0.32);b.y=tac?2.05*h.boy:1.05*h.boy;b.vx=h.vx;b.vz=h.vz;b.vy=0;return;}
    const once=b.vy;
    topFizikAdim(b,dt,false,this.R,this.kosullar);
    /* kötü zeminde sekme düzensizdir: yön ve yükseklik biraz sapar (tahmin bunu bilmez; oyuncu gerçek sekmeye tepki verir) */
    if(once<-1.3&&b.vy>0&&b.y===0&&this.zemin<0.95){const k=1-this.zemin,a=this.normal()*0.16*k,c=Math.cos(a),s=Math.sin(a),vx=b.vx;
      b.vx=vx*c-b.vz*s;b.vz=vx*s+b.vz*c;b.vy*=clamp(1+this.normal()*0.18*k,0.6,1.4);this.topDegisti();}
    if(b.agda)this.agIcinde();
  }
  agIcinde(){
    const b=this.ball,sx=Math.sign(b.x);
    if(Math.abs(b.x)>PL+1.9){b.x=sx*(PL+1.9);b.vx*=-0.15;}
    if(Math.abs(b.z-MZ)>GW2-0.12){b.z=MZ+Math.sign(b.z-MZ)*(GW2-0.12);b.vz*=-0.2;}
    if(b.y>GH-0.12){b.y=GH-0.12;b.vy=-Math.abs(b.vy)*0.3;}
    b.vx*=0.97;b.vz*=0.97;
  }
  /* bir oyuncunun (ya da topun) kale ağzına ait çarpışmaları: direk, üst direk, yan ağ. Gol ise true */
  kaleCarpismalari(){
    const b=this.ball;
    for(const sx of[-1,1]){
      const gx=sx*PL,once=(b.px-gx)*sx,simdi=(b.x-gx)*sx;
      /* direkler: kale çizgisindeki iki dikey silindir */
      if(Math.abs(b.x-gx)<0.4&&b.y<GH+0.1)for(const pz of[MZ-GW2-DIREK_R,MZ+GW2+DIREK_R]){
        const dx=b.x-(gx+sx*DIREK_R),dz=b.z-pz,dd=hyp(dx,dz);
        if(dd<DIREK_R+TOP_YARICAP&&dd>1e-4){const nx=dx/dd,nz=dz/dd,vn=b.vx*nx+b.vz*nz;
          if(vn<0){b.vx-=1.55*vn*nx;b.vz-=1.55*vn*nz;b.x=gx+sx*DIREK_R+nx*(DIREK_R+TOP_YARICAP);b.z=pz+nz*(DIREK_R+TOP_YARICAP);this.direkVurdu();return false;}}}
      /* üst direk */
      if(Math.abs(b.x-gx)<0.3&&Math.abs(b.z-MZ)<GW2+0.1){const dy=b.y-(GH+DIREK_R),dx=b.x-(gx+sx*DIREK_R),dd=hyp(dx,dy);
        if(dd<DIREK_R+TOP_YARICAP&&dd>1e-4){const nx=dx/dd,ny=dy/dd,vn=b.vx*nx+b.vy*ny;
          if(vn<0){b.vx-=1.5*vn*nx;b.vy-=1.5*vn*ny;b.x=gx+sx*DIREK_R+nx*(DIREK_R+TOP_YARICAP);b.y=GH+DIREK_R+ny*(DIREK_R+TOP_YARICAP);this.direkVurdu();return false;}}}
      /* çizgiyi geçti mi: topun tamamı kale çizgisinin ötesinde ve direklerin arasında, üst direğin altında */
      if(once<=TOP_YARICAP&&simdi>TOP_YARICAP&&!b.agda){
        const f=(TOP_YARICAP-once)/((simdi-once)||1),z=b.pz+(b.z-b.pz)*f,y=b.py+(b.y-b.py)*f;
        if(Math.abs(z-MZ)<GW2-TOP_YARICAP*0.2&&y<GH-TOP_YARICAP*0.2)return sx;
      }
      /* yan ağ: kale dışından gelen top ağa çarpar ("gol sandık") */
      if(simdi>0&&simdi<1.9&&b.y<GH&&!b.agda){const kz=Math.abs(b.z-MZ),okz=Math.abs(b.pz-MZ);
        if(okz>=GW2+0.05&&kz<GW2+0.05){b.z=MZ+Math.sign(b.z-MZ)*(GW2+0.06);b.vz*=-0.15;b.vx*=0.3;this.topDegisti();this.on('yanAg',{p:b.sonDokunan});}}
    }
    return false;
  }
  direkVurdu(){const b=this.ball;b.direk=true;if(b.sut)b.sut.direk=true;this.topDegisti();this.on('wood',{p:b.sonDokunan});}

  /* bir oyuncu topa dokundu (kimin son dokunduğu: taç/korner/aut ve ofsayt için) */
  dokunus(p,kasitli){
    const b=this.ball;b.sonDokunan=p;b.sonTakim=p.team;b.hedefOyuncu=null;b.direk=false;
    if(b.endirekt&&p!==b.endirekt.p)b.endirekt=null;if(b.tac&&p!==b.tac.p)b.tac=null;
    if(b.pas&&p!==b.pas.p){if(p.team===b.pas.takim)this.ist.pasTamam[p.team]++;b.pas=null;}
    if(b.sut&&p!==b.sut.by)b.sut=null;
    this.ofsaytDokunus(p,kasitli);
    this.topDegisti();
  }
  /* sahiplikNo (T2): her yeni sahiplikte artar; topla kararın kişisel sapması sahiplik boyunca aynı kalır (kararVer) */
  sahipYap(p){const b=this.ball;b.sahip=p;b.tasiyan=null;p.surus=null;p.kararT=this.kararSuresi(p);this.sahiplikNo++;}


  /* ============ eylemler ============
     Her eylemin adımı sahibinin dosyasında EYLEM_ADIM'a kayıtlıdır (vuruş mac-topla.js, kayma/düşme/müdahale mac-mudahale.js, uçuş mac-kaleci.js,
     taç mac-kurallar.js). true dönen adım eylemin bitişini kendisi yönetmiştir; yoksa süresi dolan eylem biter (Faz 0) */
  eylemIlerle(p,e,dt){
    e.t+=dt;const f=EYLEM_ADIM[e.ad];
    if(f&&f.call(this,p,e,dt))return;
    if(e.t>=e.sure&&p.eylem===e)p.eylem=null;
  }
  pasSay(p,hx,hz,L,tur){
    const b=this.ball,d=this.dir[p.team],ileri=(hx-b.x)*d,yan=Math.abs(hz-b.z),a=Math.atan2(yan,ileri);
    this.ist.pas[p.team]++;b.pas={p,takim:p.team,t:this.t,tur,L,x0:b.x,z0:b.z,hx,hz};
    if(a<Math.PI/4)this.ist.pasYon.ileri++;else if(a>Math.PI*3/4)this.ist.pasYon.geri++;else this.ist.pasYon.yan++;
    if(L>=32)this.ist.uzunPas++;
  }
  /* havadan vuruş: top T saniye sonra (hx,hy,hz)'de olsun; hava direnci ve falso ile, düzeltmeli çözüm */
  havadanCoz(x0,y0,z0,hx,hy,hz,T,egri,ust){
    let vx=(hx-x0)/T,vz=(hz-z0)/T,vy=(hy-y0+0.5*G*T*T)/T;const n=Math.max(1,Math.round(T*60));
    for(let k=0;k<3;k++){const s={x:x0,y:y0,z:z0,vx,vy,vz,egri,ust:ust||0};for(let i=0;i<n;i++)topFizikAdim(s,1/60,true,undefined,this.kosullar);
      vx+=(hx-s.x)/T;vy+=(hy-s.y)/T;vz+=(hz-s.z)/T;}
    return{vx,vy,vz};
  }
  /* şut çerçeveyi bulacak mı (kaleci ve oyuncular olmasa) */
  cerceveyeGider(t){
    const gx=this.dir[t]*PL,yol=this.topYolu();
    for(let i=1;i<yol.length;i++){const a=yol[i-1],c=yol[i];if((a.x-gx)*(c.x-gx)<=0){const f=(gx-a.x)/((c.x-a.x)||1),z=a.z+(c.z-a.z)*f,y=a.y+(c.y-a.y)*f;return Math.abs(z-MZ)<GW2&&y<GH;}}
    return false;
  }


  /* ============ temaslar: kontrol, araya girme, kafa, blok, kaleci ============
     Çekirdek yalnız sırayı tutar; işler sahip dosyalardadır: kaleci mac-kaleci.js, beden ve mücadele mac-mudahale.js, dokunuş mac-topla.js (Faz 0) */
  temaslar(dt){
    const b=this.ball;if(b.tasiyan)return;
    this.kaleciTemas();
    if(this.phase!=='play'||b.tasiyan)return;
    this.ziplamalar();
    const ad=[];
    for(const p of this.players){
      if(!p.oyunda||p.kickCd>0)continue;const e=p.eylem;
      if(e&&(e.kilit||e.ad==='tac'))continue;
      const dx=b.x-p.x,dz=b.z-p.z,d=hyp(dx,dz);if(d>1.3)continue;
      const tur=this.erisim(p,d);if(tur)ad.push({p,d,tur});
    }
    /* topa erişemeyen beden: top ona çarpıp yansır */
    if(this.govdeCarpmasi(ad))return;
    if(!ad.length)return;
    /* top sürücünün kontrolündeyse rakip onu ancak müdahaleyle alır */
    if(this.surucuKoru(ad))return;
    if(this.sutBlok(ad))return;
    /* kaleci eliyle (ceza sahasında önceliklidir) */
    const el=ad.find(a=>a.tur==='el');if(el){this.kaleciYakala(el.p);return;}
    /* hava topu: kafa mücadelesi */
    const kafa=ad.filter(a=>a.tur==='kafa').sort((x,y)=>x.d-y.d);
    if(kafa.length){this.kafaAdaylari(kafa);this.havaTopu(kafa);return;}
    const kazanan=this.kazananSec(ad);if(!kazanan)return;
    this.topaDokun(kazanan);
  }
  kendiCezaSahasinda(p,x,z){const gx=-this.dir[p.team]*PL;return Math.abs(x-gx)<CEZA_U&&Math.abs(z-MZ)<CEZA_W;}




  /* ============ oyun alanı sınırları: gol, taç, korner, aut ============ */
  sinirlar(){
    const b=this.ball;
    const gol=this.kaleCarpismalari();if(gol){this.gol(gol);return;}
    if(b.agda)return;
    if(b.tasiyan)return;
    const ax=Math.abs(b.x);
    if(ax>PL+TOP_YARICAP){
      const side=Math.sign(b.x),def=this.dir[0]===-side?0:1;
      this.topDisari();
      if(b.sonTakim===def)this.durusBaslat('korner',1-def,side*(PL-0.4),b.z<MZ?0.4:PW-0.4);
      else this.durusBaslat('kaleVurusu',def,side*(PL-ALTIPAS_U+0.5),MZ+(b.z<MZ?-4:4));
      return;
    }
    if(b.z<-TOP_YARICAP||b.z>PW+TOP_YARICAP){this.topDisari();this.durusBaslat('tac',1-b.sonTakim,clamp(b.x,-PL+0.5,PL-0.5),b.z<0?-0.15:PW+0.15);}
  }
  /* oyundaki top dışarı çıktı: yuvarlanmaya devam eder (panolarda durur); duran topu kim nasıl alacak durusBaslat'ta seçilir */
  topDisari(){
    const b=this.ball;
    for(const p of this.players)if(p.eylem&&p.eylem.ad==='vurus')p.eylem=null;
    b.sahip=null;b.sut=null;b.hedefOyuncu=null;b.pas=null;
    for(const t of[0,1]){const gk=this.kaleci(t);if(gk.eylem&&gk.eylem.ad==='ucus')continue;}
  }
  /* saha dışındaki top: reklam panoları (yanlarda 4,1 m, kale arkasında 5,2 m ötede) topu durdurur; üstünden aşan top tribüne gider (false).
     Kale ağına giden top ağın arkasında kalır */
  panoSiniri(o){
    if(o.z<-4.1&&o.vz<0){if(o.y>1.0)return false;o.z=-4.1;o.vz*=-0.25;}
    if(o.z>PW+4.1&&o.vz>0){if(o.y>1.0)return false;o.z=PW+4.1;o.vz*=-0.25;}
    if(Math.abs(o.x)>PL+5.2&&o.vx*Math.sign(o.x)>0){if(o.y>1.0)return false;o.x=Math.sign(o.x)*(PL+5.2);o.vx*=-0.25;}
    if(Math.abs(o.x)>PL&&Math.abs(o.x)<PL+2&&Math.abs(o.z-MZ)<GW2+0.1&&o.y<GH){o.vx*=0.5;o.vz*=0.5;}
    return true;
  }
  /* yedek top kullanılınca eski top saha dışında kalır: yuvarlanır, durur; en çok 4 tane görünür kalır (görevliler toplar) */
  disToplarAdim(dt){
    for(let i=this.disToplar.length-1;i>=0;i--){const o=this.disToplar[i];o.t+=dt;
      topFizikAdim(o,dt,false,this.R,this.kosullar);
      if(!this.panoSiniri(o)){this.disToplar.splice(i,1);continue;}
      /* panodan seken eski top sahaya geri yuvarlanmaz: çizginin 0,8 m dışında durur (N10; oyunda ikinci top olmaz) */
      if(Math.abs(o.x)<PL&&o.z>0&&o.z<PW){const dx=PL-Math.abs(o.x),dz=Math.min(o.z,PW-o.z);
        if(dx<dz)o.x=Math.sign(o.x||1)*(PL+0.8);else o.z=o.z<MZ?-0.8:PW+0.8;
        o.vx=o.vy=o.vz=0;o.y=0;}}
    while(this.disToplar.length>4)this.disToplar.shift();
  }

  /* ============ gol ============ */
  gol(side){
    const b=this.ball,def=this.dir[0]===-side?0:1,att=1-def;
    /* dolaylı serbest vuruş başka bir oyuncuya değmeden kaleye girerse gol olmaz: aut (kendi kalesine girerse korner) */
    if(b.endirekt){const own=b.endirekt.p.team===def;b.endirekt=null;this.topDisari();
      if(own)this.durusBaslat('korner',att,side*(PL-0.4),b.z<MZ?0.4:PW-0.4);else this.durusBaslat('kaleVurusu',def,side*(PL-ALTIPAS_U+0.5),MZ+(b.z<MZ?-4:4));
      this.on('endirektGol',{});return;}
    this.score[att]++;const own=b.sonTakim===def,scorer=b.sonDokunan;
    if(b.sut&&!own)this.ist.isabet[att]++;
    b.agda=true;b.sut=null;b.sahip=null;b.hedefOyuncu=null;b.pas=null;
    for(const p of this.players)if(p.eylem&&p.eylem.ad==='vurus')p.eylem=null;
    this.phase='goal';this.phaseT=0;this.celeb={team:att,side,scorer,own};this.duranSure[this.half-1]+=50;
    this.on('goal',{team:att,scorer,own,score:this.score.slice()});
  }
  stepGoal(dt){
    const c=this.celeb,sc=c.own?null:c.scorer,cx=c.side*(PL-3),cz=c.side>0?PW-3:3,b=this.ball,gk=this.kaleci(1-c.team);
    for(const p of this.players){
      if(!p.oyunda)continue;p.surus=null;
      if(p===gk){/* kaleci topu ağdan alır, orta noktaya doğru atar */
        if(!b.tasiyan&&b.agda&&this.phaseT>2.2){p.tx=b.x-c.side*0.4;p.tz=b.z;p.hizOran=0.4;p.bak=b;
          if(hyp(p.x-b.x,p.z-b.z)<0.9){b.agda=false;b.tasiyan=p;this.topDegisti();}}
        else if(b.tasiyan===p){p.tx=c.side*(PL-2);p.tz=MZ;p.bak={x:0,z:MZ};
          if(this.phaseT>5.2&&Math.abs(p.x-c.side*(PL-2))<1.2){b.tasiyan=null;const cz2=this.havadanCoz(b.x,1.2,b.z,-c.side*1.5,0,MZ,2.2,0);b.x=p.x;b.y=1.2;b.z=p.z;b.vx=cz2.vx;b.vy=cz2.vy;b.vz=cz2.vz;this.topDegisti();
            p.eylem={ad:'degaj',t:0,sure:0.5};}}
        else{p.tx=c.side*(PL-1.5);p.tz=MZ;p.hizOran=0.4;}
        continue;}
      if(p.team===c.team&&p.rol!=='GK'){
        if(p===sc){p.tx=cx;p.tz=cz;p.hizOran=1;}
        else{const g=sc||{x:cx,z:cz};p.tx=g.x-c.side*(1.2+(p.n%3)*0.9);p.tz=g.z-(cz>MZ?1:-1)*(1+(p.n%4)*0.9);p.hizOran=0.9;}
        p.sevinc=this.phaseT>0.5;p.bak=null;
      }else{const k=this.santraKonumu(p,1-c.team);p.tx=k.x;p.tz=k.z;p.hizOran=0.3;p.bak=null;}
    }
    this.hareketHepsi(dt);this.topAdim(dt);
    if(this.phaseT>7){for(const p of this.players)p.sevinc=false;this.santraHazirla(1-c.team,false);}
  }

  /* ============ devre / maç sonu ============ */
  devreSonuKontrol(){
    const h=this.half-1,sinir=h?5400:2700;
    if(!this.uzatmaIlan[h]&&this.gameSec>=sinir-20){
      const dk=clamp(Math.round((this.duranSure[h]+30)/60),h?2:1,8);this.added[h]=dk*60;this.uzatmaIlan[h]=true;this.ist.uzatma[h]=dk;
      this.on('uzatma',{dakika:dk,yari:this.half});}
    if(this.phase!=='play'&&this.phase!=='kickoff')return;
    const lim=sinir+this.added[h],b=this.ball;
    if(this.gameSec>=lim&&(Math.abs(b.x)<30||this.gameSec>lim+100)&&!b.sut)this.endHalf();
  }

}
