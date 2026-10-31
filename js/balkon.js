/* ============ Chairman — balkon ve antrenman sahası (yalnız çizim; yol haritası 2.7, 2.8D) ============
   Başkan odasının (js/oda.js) dışı: kapıdan çıkılan balkon, altında kulübün sahası, gündüz gökyüzü. ODA.dis grubuna kurulur; grup odanın
   penceresinden de görünür. Stat, maçla aynı tariften aynı kurucuyla kurulur (js/stadyum.js statKur, gündüz ve boş): balkon ana tribünün
   (ve protokol locasının) hemen arkasında ve üstündedir; konumu tariften hesaplanır (BLK_STAT). Pencerede çatısız karşı tribün, tabela,
   projektörler ve çevre (karşıda evler, doğuda kaya yamaç, ufukta tepeler; js/stadyum-cevre.js) görünür; tribün onarımının taksiti ödendiyse basamaklarda iskele durur (balkonIskele, 2.8J).
   Oyun kuralı içermez: antrenmanın sürüp sürmediğini ve saati sunum katmanı balkonDurum ile bildirir (kurallar js/gozlem.js).
   Antrenman sunum amaçlı bir canlandırmadır, maç motoru değildir: gruplar tekrarlayan basit düzenlerle çalışır (ısınma koşusu, pas çemberi,
   kaleye şut, esneme, sakatlıktan dönenin ayrı koşusu); kenarda teknik direktör, antrenörler ve fizyoterapist durur.
   R5 (2026-10-29): sahadakiler kariyerin bugünkü kadrosudur — gruplar js/gozlem.js antrenmanDuzeni'nden (hocanın programı: yoğun, toparlanma,
   hafif), oyuncular kayıttaki görünüşleriyle; figür havuzu oyuncu kimliğiyle bir kez kurulur, düzen değişince yeniden dağıtılır.
   Takvim dururken de saha hareket eder; saat ve karar durumu bununla karıştırılmaz (STIL_REHBERI §8).
     balkonDurum({antrenman, dakika, duzen})  takım sahada mı; gökyüzünün gün ışığı; duzen: {tur, kosu, rondo, sut, esneme, ayri, kaleciler, kenar,
                                       oyuncular: {id → {ten, sac, sacRenk, boy, yapi, krampon, no}}} (R5; aynı anahtarla yeniden kurulmaz)
     balkonKare(dt)                    canlandırma (js/oda.js grup görünürken çağırır)
     balkonIskele(var)                 tribün basamaklarındaki onarım iskelesi (yaşanmış olaydan; js/soz.js odaIzleri)
   RB (2026-10-30, kullanıcı: “bir gruba, oyuncuya ya da bölgeye bakmak, yakınlaşmak”): balkondan bakış. Yalnız görüntüdür: kayda girmez, kural
   çağırmaz. Göz sabit (başkan oturur), bakış hedefi ve yakınlık kademesi (STIL.balkon.yakinlik: geniş, grup, yakın) değişir; kamerayı js/oda.js sürer.
     balkonBakis(h?)          h: {tur:'saha'} | {tur:'yer', x, z} | {tur:'grup', grup} | {tur:'oyuncu', id}, kademe? (yoksa türünün varsayılanı); döner: bakış
     balkonYakinlik(yon)      +1 yaklaş, −1 uzaklaş, 0 sıradaki kademe (Z; yakından genişe döner); genişe inince saha
     balkonBakisGeri()        oyuncu → grubu → saha; yer ve grup → saha. Değiştiyse true
     balkonBakisHedefi()      {nokta: Vector3, aci} — oda kamerasının balkondaki hedefi; takip edilen sahadan çıktıysa saha
     balkonIsaret(x, y)       imlecin (−1…1) altındaki: geniş bakışta {tur:'grup', grup, fx, fz} (fx, fz: imlecin altındaki figürün yeri); yakında {tur:'oyuncu', id, grup};
                              boş zeminde {tur:'yer', x, z}; yoksa null
     balkonTakipEkrani()      takip edilen oyuncunun başının karedeki yeri {x, y} (0–1) ya da null
     balkonAktorEkrani(id)    RK1: o oyuncunun başının karedeki yeri {x, y} (0–1) ya da null (imleç etiketi ve sinyal kelimesi)
     balkonGrupEkrani(grup)   RK1: grubun bakılan noktasının üstü {x, y} (0–1) ya da null
     balkonIsaretEkrani(h)    RK1: imleç etiketinin yeri — oyuncunun ya da imlecin altındaki figürün başının üstü {x, y} (0–1) ya da null
     balkonGruplari()         sahadaki gruplar [{grup, ids}] (BLK_GRUP_SIRA; boş grup yok; teknik ekipte ids boş)
   Renkler ve ölçüler STIL.balkon'dadır. */
const BLK=STIL.balkon;
const BALKON={antrenman:false,zaman:0,aktorler:[],kosu:[],rondo:[],sut:[],esneme:[],ayri:[],kenar:[],kaleci:null,ekip:[],top:{},grup:new THREE.Group(),
  havuz:new Map(),tur:'yogun',duzenAnahtar:null,bakis:{tur:'saha',kademe:0}};
/* stadın balkona göre yeri (tariften): ana tribünün arka duvarı balkon korkuluğunun hemen önünde, tepesi (protokol locası dahil) balkon döşemesinin altında.
   Stat grubu 180° döndürülür: ana tribün balkon tarafında kalır. [CX, PY, CZ] sahanın ortası; bakış sahanın ortasına */
const BLK_STAT=(()=>{
  const t=STAT.tribunler.find(x=>x.yer==='ana'),O=tribunOlcu(t),arka=STAT_OLCU.arka.ana+0.6,ust=tribunTepe('ana')+(t.cati?0.3:1.2);
  return{CX:0,PY:-(ust+0.6),CZ:BLK.korkulukZ-0.7-arka};
})();
BLK.saha=[BLK_STAT.CX,BLK_STAT.PY,BLK_STAT.CZ];
BLK.bakis=[0,BLK_STAT.PY+1,BLK_STAT.CZ+6];
{
  const D=ODA.dis,[CX,PY,CZ]=BLK.saha,oLAM=o=>LAM(Object.assign({fog:false},o));

  /* ---- gökyüzü ---- */
  {const g=new THREE.SphereGeometry(330,16,10),p=g.attributes.position,col=[];
   for(let i=0;i<p.count;i++){const t=clamp(p.getY(i)/330*2.2,0,1),U=BLK.gokAlt,Q=BLK.gokUst;col.push(U[0]*(1-t)+Q[0]*t,U[1]*(1-t)+Q[1]*t,U[2]*(1-t)+Q[2]*t);}
   g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
   const gok=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}));gok.position.set(CX,PY,CZ);D.add(gok);BALKON.gok=gok.material;}

  /* ---- kulübün stadı: maçla aynı tarif ve kurucu; gündüz, boş tribünler ---- */
  {const S=new THREE.Group();S.position.set(CX,PY,CZ);S.rotation.y=Math.PI;D.add(S);statKur(S,{mac:false,gunduz:true});BALKON.stat=S;
   /* iskele: onarılan tribünün basamaklarında, pencereden görünen yerde (yalnız onarım başladıysa): borular, kalas, branda, çimento torbaları
      ve şeritli bariyer. Çatısız statta çatıya bağlanmaz (2.8J) */
   const c=tribunBakimYeri(),I=new THREE.Group(),demir=oLAM({color:BLK.iskele}),branda=oLAM({color:BLK.iskeleBranda}),torba=oLAM({color:BLK.iskeleTorba}),serit=oLAM({color:BLK.iskeleSerit});
   if(c){I.position.set(c.x,c.y,c.z);I.rotation.y=c.rot;S.add(I);
     for(let x=-4;x<=4;x+=2)for(const z of[-0.5,0.5])box(0.1,2.4,0.1,demir,x,1.2,z,I);
     for(const y of[0.9,1.9,2.4])box(8.3,0.1,1.2,demir,0,y,0,I);
     box(3.6,1.3,0.05,branda,-1.6,1.6,0.62,I);
     for(let i=0;i<4;i++)box(0.5,0.22,0.34,torba,2.2+(i%2)*0.55,0.11+Math.floor(i/2)*0.22,0.9,I);
     for(let x=-5;x<=5;x+=1)box(0.5,0.08,0.04,(x+5)%2?serit:demir,x,0.9,1.35,I);}
   I.visible=false;BALKON.iskele=I;}
  /* pencere artık dışarıya açılır: aynı stat odadan da görünür */
  if(typeof odaPencereAc==='function')odaPencereAc();

  /* ---- balkon: döşeme, korkuluk, küçük masa ---- */
  {const kork=oLAM({color:BLK.korkuluk}),P=[];
   box(6.6,0.14,2.2,oLAM({color:BLK.zemin}),0,-0.07,-4.65,D);
   /* balkonu taşıyan duvar: döşemeden ana tribünün arkasına iner */
   box(6.6,-PY,0.3,oLAM({color:BLK.duvar}),0,PY/2-0.07,BLK.korkulukZ-0.15,D);
   /* alçak ve ince korkuluk: oturan başkanın sahayı görmesini kapatmaz */
   for(const y of[0.1,0.8])P.push({w:6.6,h:0.04,d:0.04,x:0,y,z:-5.7});
   for(let x=-3.25;x<=3.26;x+=0.65)P.push({w:0.025,h:0.7,d:0.025,x,y:0.45,z:-5.7});
   for(const sx of[-1,1]){for(const y of[0.1,0.8])P.push({w:0.04,h:0.04,d:2.1,x:sx*3.27,y,z:-4.65});for(let z=-5.6;z<=-3.7;z+=0.65)P.push({w:0.025,h:0.7,d:0.025,x:sx*3.27,y:0.45,z});}
   D.add(new THREE.Mesh(kutuBirlestir(P),kork));
   const masa=oLAM({color:BLK.masa});
   /* 2.8R: masa korkuluğun dibinde; üstündeki telefon oturan başkanın görüşünde, alt şeridin üstünde görünür ve tıklanır */
   const M=BLK.telefonMasa;
   box(0.6,0.04,0.42,masa,M[0],0.72,M[1],D);box(0.06,0.7,0.06,oLAM({color:BLK.masaAyak}),M[0],0.35,M[1],D);box(0.4,0.03,0.4,oLAM({color:BLK.masaAyak}),M[0],0.015,M[1],D);
   ODA.balkonTelefon={x:M[0]+0.12,y:0.74,z:M[1]+0.02,donus:0.3};}

  /* ---- takım: kadrodaki görünüşlerle; antrenman eşofmanı, ortadaki oyuncuda yelek ---- */
  const G=BALKON.grup;D.add(G);G.visible=false;
  const golgeGeo=new THREE.CircleGeometry(0.5,8),golgeM=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:BLK.golge,depthWrite:false,fog:false});
  function aktor(K,x,z){
    const m=player(K);m.root.rotation.order='YXZ';G.add(m.root);
    const g=new THREE.Mesh(golgeGeo,golgeM);g.rotation.x=-Math.PI/2;g.scale.set(1.3,0.75,1);G.add(g);
    const a={m,g,x,z,yaw:0,faz:h2(BALKON.aktorler.length,3)*6,ev:{x,z}};BALKON.aktorler.push(a);return a;
  }
  const KD=KADROLAR.demirkapi;
  /* R5: oyuncu figürleri kimlikle havuzdan (balkonDuzenKur); kaleci kaleci formasıyla, öbürleri antrenman formasıyla */
  BALKON.oyuncuAktor=(id,o,kaleci)=>{let a=BALKON.havuz.get(id);if(!a){a=aktor(kitKaydi(kaleci?KD.kaleciForma:'yedekEv',o,o.no|0),0,0);BALKON.havuz.set(id,a);}return a;};
  BALKON.ekip=[aktor(kitKaydi('antrenorEv',KD.td,0),6,29),aktor(kitKaydi('antrenorEv',{ten:2,sac:'kisa',sacRenk:'#241a12',boy:1,yapi:1.04},0),33,-11),aktor(kitKaydi('antrenorEv',{ten:0,sac:'kel',sacRenk:'#8a8680',boy:0.98,yapi:1.08,biyik:true},0),15,23),
    aktor(kitKaydi('antrenorEv',{ten:1,sac:'kisa',sacRenk:'#3a2a1a',boy:0.97,yapi:0.98},0),-20,-29)];   /* R5: dördüncüsü fizyoterapist (ayrı koşu) */
  BALKON.ekip.forEach(a=>{a.kume='ekip';});
  /* toplar ve koniler */
  const topGeo=new THREE.SphereGeometry(0.14,8,6),topM=oLAM({color:0xf4f4ee});
  const top=()=>{const t=new THREE.Mesh(topGeo,topM);G.add(t);return t;};
  BALKON.top={rondo:top(),sut:top(),yedek:[0,1,2,3,4].map(i=>{const t=top();t.position.set(CX+7.5+i*0.45,PY+0.14,CZ+30.2+h2(i,5)*0.8);return t;})};
  {const K=[],N=new THREE.InstancedMesh(new THREE.ConeGeometry(0.13,0.28,6),oLAM({color:BLK.koni}),24),M=new THREE.Matrix4();
   for(let i=0;i<8;i++)K.push([22+Math.cos(i*Math.PI/4)*7.6,14+Math.sin(i*Math.PI/4)*7.6]);
   for(const c of[[-45,-26],[-8,-26],[-8,26],[-45,26],[30,-7],[30,4],[38,-3],[38,3]])K.push(c);
   K.forEach((c,i)=>{M.makeTranslation(CX+c[0],PY+0.14,CZ+c[1]);N.setMatrixAt(i,M);});N.count=K.length;N.frustumCulled=false;G.add(N);}
  BALKON.yerlestir=a=>{a.m.root.position.set(CX+a.x,PY,CZ+a.z);a.m.root.rotation.y=a.yaw;a.g.position.set(CX+a.x+0.35,PY+0.03,CZ+a.z-0.2);};
  BALKON.topKoy=(t,x,y,z)=>t.position.set(CX+x,PY+0.14+y,CZ+z);
}

/* R5: düzeni figürlere dağıtır (aynı anahtarla yeniden kurmaz); düzende olmayan figürler gizlenir */
function balkonDuzenKur(D){
  const B=BALKON,O=D.oyuncular||{},al=(id,kl)=>B.oyuncuAktor(id,O[id]||{},kl);
  for(const a of B.havuz.values()){a.m.root.visible=false;a.g.visible=false;}
  /* RB: figür kimliğini ve kümesini taşır (bakış ve tıklama) */
  const L=(ad,kl,kume)=>(D[ad]||[]).filter(id=>O[id]).map(id=>{const a=al(id,kl);a.m.root.visible=true;a.g.visible=true;a.id=id;a.kume=kume||ad;return a;});
  B.tur=D.tur||'yogun';B.kosu=L('kosu');B.rondo=L('rondo');B.sut=L('sut');B.esneme=L('esneme');B.ayri=L('ayri');
  const KL=L('kaleciler',true);
  B.kaleci=KL[0]||null;
  B.kenar=L('kenar',true,'kaleciler');
  B.ekip[3].m.root.visible=B.ekip[3].g.visible=B.ayri.length>0;
  B.top.rondo.visible=B.rondo.length>2;B.top.sut.visible=B.sut.length>0;
}
/* iki pozun ağırlıklı karışımı; g: hareketin genliği (0 = düz duruş) */
const BLK_EKLEM=['lean','dy','hx','lL','kL','lR','kR','aL','aR','aLz','aRz','eL','eR'];
function balkonPoz(m,A,B,w,g){const P={};for(const e of BLK_EKLEM)P[e]=((A[e]||0)*(1-w)+((B&&B[e])||0)*w)*g;pose(m,P);}
const BLK_DURUS={aLz:-0.08,aRz:0.08,eL:-0.15,eR:-0.15};
/* a'yı (hx, hz) noktasına doğru hiz (m/sn) ile yürütür; vardıysa true. Koşu pozu hıza göre */
function balkonGit(a,hx,hz,hiz,dt){
  const dx=hx-a.x,dz=hz-a.z,u=Math.hypot(dx,dz);
  if(u<0.15){balkonPoz(a.m,BLK_DURUS,null,0,1);return true;}
  const adim=Math.min(u,hiz*dt);a.x+=dx/u*adim;a.z+=dz/u*adim;a.yaw=Math.atan2(dx,dz);a.faz+=dt*hiz*2.3;
  balkonPoz(a.m,POSE.runA,POSE.runB,(Math.sin(a.faz)+1)/2,Math.min(1,hiz/3.4));
  return false;
}
function balkonBak(a,hx,hz){a.yaw=Math.atan2(hx-a.x,hz-a.z);}

const BLK_KOSU_YOLU=[[-45,-26],[-8,-26],[-8,26],[-45,26]],BLK_RONDO={x:22,z:14,r:5.5,sure:1.05},BLK_SUT={sure:4.4,bas:[[30,-6],[30,-3.5],[30,-1]],vurus:[38.2,0]};
/* R5: esneme (iki poz arasında yavaş), ayrı koşu (çizgi boyunca, fizyoterapistle), toparlanmada yavaş koşu */
const BLK_ESNEME={A:{lean:0.55,kL:0.25,kR:0.25,aL:-0.5,aR:-0.5,eL:-0.2,eR:-0.2},B:{lean:0.15,lL:-0.7,kL:1.1,lR:0.35,aL:-0.2,aR:-0.2,aLz:-0.25,aRz:0.25},yer:{x:-30,z:-12,ara:2.6},sure:5.5},
  BLK_AYRI={z:-29,x:[-40,0],hiz:1.6};
function balkonKare(dt){
  if(!BALKON.antrenman)return;
  const B=BALKON,t=(B.zaman+=dt);
  /* 1. ısınma koşusu: yarı sahanın çevresinde sıra hâlinde (toparlanmada yavaş) */
  {const Y=BLK_KOSU_YOLU,uz=Y.map((p,i)=>Math.hypot(Y[(i+1)%4][0]-p[0],Y[(i+1)%4][1]-p[1])),top=uz.reduce((a,b)=>a+b,0),yavas=B.tur==='toparlanma';
   B.kosu.forEach((a,i)=>{
     let s=((t*(yavas?1.7:3.1)-i*2.6)%top+top)%top,k=0;while(s>uz[k]){s-=uz[k];k++;}
     const p=Y[k],q=Y[(k+1)%4],o=s/uz[k];a.x=p[0]+(q[0]-p[0])*o;a.z=p[1]+(q[1]-p[1])*o;a.yaw=Math.atan2(q[0]-p[0],q[1]-p[1]);
     a.faz+=dt*(yavas?4.6:7.1);balkonPoz(a.m,POSE.runA,POSE.runB,(Math.sin(a.faz)+1)/2,yavas?0.5:0.85);B.yerlestir(a);});}
  /* R5: esneme — sıra hâlinde, iki poz arasında yavaş */
  {const E=BLK_ESNEME;B.esneme.forEach((a,i)=>{a.x=E.yer.x+(i%5)*E.yer.ara;a.z=E.yer.z+Math.floor(i/5)*E.yer.ara;a.yaw=Math.PI/2;
     balkonPoz(a.m,E.A,E.B,(Math.sin(t*2*Math.PI/E.sure+i*0.7)+1)/2,1);B.yerlestir(a);});}
  /* R5: ayrı koşu — dönüşe yakın sakat oyuncu çizgi boyunca yavaş koşar, fizyoterapist yanında */
  {const R=BLK_AYRI,uz=R.x[1]-R.x[0];B.ayri.forEach((a,i)=>{const s=((t*R.hiz+i*3)%(2*uz)),ileri=s<uz;a.x=R.x[0]+(ileri?s:2*uz-s);a.z=R.z+i*1.2;a.yaw=ileri?Math.PI/2:-Math.PI/2;
     a.faz+=dt*4.2;balkonPoz(a.m,POSE.runA,POSE.runB,(Math.sin(a.faz)+1)/2,0.45);B.yerlestir(a);});
   const f=B.ekip[3];if(B.ayri.length){const a=B.ayri[0];f.x=a.x-1.5;f.z=R.z-2;balkonBak(f,a.x,a.z);balkonPoz(f.m,BLK_DURUS,null,0,1);B.yerlestir(f);}}
  /* R5: kenardaki kaleci kaleci antrenörüyle hazırda */
  B.kenar.forEach((a,i)=>{a.x=44+i*1.5;a.z=9;balkonBak(a,44,0);balkonPoz(a.m,POSE.ready,null,0,0.8+0.2*Math.sin(t*2+i));B.yerlestir(a);});
  /* 2. pas çemberi: beş oyuncu çemberde paslaşır, yelekli oyuncu ortada topu kovalar */
  if(B.rondo.length>2){const R=BLK_RONDO,cember=B.rondo.filter((a,i)=>i!==0),orta=B.rondo[0],n=cember.length,tur=Math.floor(t/R.sure),o=(t/R.sure)%1;
   const kim=j=>((j*2)%n+n)%n,veren=cember[kim(tur)],alan=cember[kim(tur+1)];
   cember.forEach((a,j)=>{const ac=j*2*Math.PI/n;a.x=R.x+Math.cos(ac)*R.r;a.z=R.z+Math.sin(ac)*R.r;});
   const u=Math.min(1,o/0.45),bx=veren.x+(alan.x-veren.x)*u,bz=veren.z+(alan.z-veren.z)*u;
   cember.forEach(a=>{balkonBak(a,bx,bz);
     if(a===veren&&o<0.3)balkonPoz(a.m,POSE.pasGeri,POSE.pasTakip,Math.min(1,o/0.18),1);
     else if(a===alan&&o>0.4)balkonPoz(a.m,POSE.kontrol,null,0,Math.min(1,(o-0.4)/0.2));
     else balkonPoz(a.m,POSE.ready,null,0,0.7+0.2*Math.sin(t*3+a.faz));
     B.yerlestir(a);});
   const hx=R.x+clamp(bx-R.x,-3.4,3.4),hz=R.z+clamp(bz-R.z,-3.4,3.4);
   balkonGit(orta,hx,hz,3.4,dt);B.yerlestir(orta);
   B.topKoy(B.top.rondo,bx,0,bz);}
  /* 3. şut çalışması: sırayla koş, vur; kaleci uzanır */
  if(B.sut.length){const S=BLK_SUT,tur=Math.floor(t/S.sure),p=t%S.sure,n=B.sut.length,vuran=B.sut[tur%n],taraf=tur%2?1:-1,hz=taraf*2.6,K=B.kaleci;
   B.sut.forEach((a,i)=>{
     const j=((i-tur)%n+n)%n,yer=S.bas[j]||[30-(j-2)*1.1,-1-(j-2)*0.4];   /* R5: sıra uzunsa arkaya dizilir */
     if(a===vuran){
       if(p<1.5)balkonGit(a,S.vurus[0]-0.7,S.vurus[1],5,dt);
       else if(p<2.1){balkonBak(a,52.5,hz);balkonPoz(a.m,POSE.vurusGeri,POSE.vurusTakip,clamp((p-1.5)/0.25,0,1),1);}
       else balkonGit(a,yer[0],yer[1],3,dt)&&balkonBak(a,52.5,0);
     }else balkonGit(a,yer[0],yer[1],2.4,dt)&&balkonBak(a,52.5,0);
     B.yerlestir(a);});
   /* top: vuruş noktasında bekler, 1.65'te çıkar, 2.25'te kalede */
   const u=clamp((p-1.65)/0.6,0,1);
   B.topKoy(B.top.sut,S.vurus[0]+(52.9-S.vurus[0])*u,Math.sin(u*Math.PI)*1.4+u*0.5,S.vurus[1]+(hz-S.vurus[1])*u);
   /* kaleci: hazır bekler, şutta topun tarafına uzanır, sonra yerine döner */
   const d=clamp((p-1.75)/0.4,0,1)*(p<3.1?1:clamp((3.6-p)/0.5,0,1));
   if(K){K.x=51.2;K.z=hz*0.75*d;K.yaw=-Math.PI/2;
     balkonPoz(K.m,POSE.ready,POSE.dive,d,1);B.yerlestir(K);K.m.root.rotation.z=-taraf*1.1*d;K.m.root.position.y+=0.55*d;}}
  /* teknik ekip: hoca kenarda, ara sıra işaret eder */
  B.ekip.forEach((a,i)=>{if(i===3)return;balkonBak(a,i===1?44:20,i===1?0:8);balkonPoz(a.m,i===0&&Math.sin(t*0.7)>0.75?POSE.isaret:BLK_DURUS,null,0,1);B.yerlestir(a);});
}
function balkonIskele(v){if(BALKON.iskele)BALKON.iskele.visible=!!v;}
function balkonDurum(d){
  /* R5: düzen değişince (gün, kadro, program) figürler yeniden dağıtılır */
  if(d.duzen){const a=JSON.stringify([d.duzen.tur,d.duzen.kosu,d.duzen.rondo,d.duzen.sut,d.duzen.esneme,d.duzen.ayri,d.duzen.kaleciler,d.duzen.kenar]);
    if(a!==BALKON.duzenAnahtar){BALKON.duzenAnahtar=a;balkonDuzenKur(d.duzen);if(BALKON.antrenman)balkonKare(0.001);}}
  if(d.antrenman!==undefined&&d.antrenman!==BALKON.antrenman){BALKON.antrenman=!!d.antrenman;BALKON.grup.visible=BALKON.antrenman;if(BALKON.antrenman)balkonKare(0.001);}
  if(d.dakika!==undefined){const I=odaGunIsigi(d.dakika);BALKON.gok.color.copy(I.renk).lerp(new THREE.Color(0xffffff),0.5).multiplyScalar(0.3+0.9*I.guc);}
}

/* ---- RB: balkondan bakış (yalnız görüntü) ---- */
const BLK_GRUP_SIRA=['kosu','rondo','sut','esneme','ayri','kaleciler','ekip'];
/* sahanın ortası (yerel): geniş bakışın yere düştüğü yer */
const BLK_SAHA_ORTA=[0,6];
/* grubun bakılan noktası: koşuda sıranın ortasındaki koşucu, teknik ekipte hoca, pas çemberi ve şutta çalışmanın alanı, öbürlerinde figürlerin ortası */
const BLK_GRUP_YER={rondo:[BLK_RONDO.x,BLK_RONDO.z],sut:[41,0]};
function blkGrupAktorleri(g){
  const B=BALKON;if(!B.antrenman)return[];
  if(g==='kaleciler')return(B.kaleci?[B.kaleci]:[]).concat(B.kenar);
  if(g==='ekip')return B.ekip.filter(a=>a.m.root.visible);
  return BLK_GRUP_SIRA.includes(g)?B[g]||[]:[];
}
function balkonGruplari(){return BLK_GRUP_SIRA.map(grup=>({grup,ids:grup==='ekip'?[]:blkGrupAktorleri(grup).map(a=>a.id)})).filter(x=>x.grup==='ekip'?BALKON.antrenman:x.ids.length);}
const blkGorunur=()=>BLK_GRUP_SIRA.flatMap(blkGrupAktorleri);
const blkTakipAktor=id=>blkGorunur().find(a=>a.id===id)||null;
function balkonBakis(h){
  if(h){const tur=h.tur,v={yer:1,grup:1,oyuncu:2,saha:0}[tur];
    if(v===undefined)return BALKON.bakis;
    const b={tur,kademe:tur==='saha'?0:clamp(h.kademe===undefined?v:h.kademe|0,1,BLK.yakinlik.length-1)};
    if(tur==='yer'){b.x=+h.x||0;b.z=+h.z||0;}else if(tur==='grup')b.grup=h.grup;else if(tur==='oyuncu'){b.id=h.id;const a=blkTakipAktor(h.id);b.grup=a?a.kume:h.grup;}
    BALKON.bakis=b;}
  return BALKON.bakis;
}
function balkonYakinlik(yon){
  const b=BALKON.bakis,n=BLK.yakinlik.length;
  let kd=yon===0?(b.kademe+1)%n:clamp(b.kademe+(yon>0?1:-1),0,n-1);
  if(kd===b.kademe)return b;
  if(kd===0)return balkonBakis({tur:'saha'});
  if(b.tur==='saha')return balkonBakis({tur:'yer',x:BLK_SAHA_ORTA[0],z:BLK_SAHA_ORTA[1],kademe:kd});
  BALKON.bakis=Object.assign({},b,{kademe:kd});return BALKON.bakis;
}
function balkonBakisGeri(){
  const b=BALKON.bakis;if(b.tur==='saha')return false;
  if(b.tur==='oyuncu'&&b.grup&&blkGrupAktorleri(b.grup).length)balkonBakis({tur:'grup',grup:b.grup});else balkonBakis({tur:'saha'});
  return true;
}
const BLK_HEDEF=new THREE.Vector3();
function balkonBakisHedefi(){
  const B=BALKON,b=B.bakis,[CX,PY,CZ]=BLK.saha;
  let x,z,y=1;
  if(b.tur==='oyuncu'){const a=blkTakipAktor(b.id);if(!a)return balkonBakis({tur:'saha'}),balkonBakisHedefi();x=a.x;z=a.z;}
  else if(b.tur==='grup'){const A=blkGrupAktorleri(b.grup);if(!A.length)return balkonBakis({tur:'saha'}),balkonBakisHedefi();
    if(b.grup==='kosu'){const a=A[Math.floor((A.length-1)/2)];x=a.x;z=a.z;}
    else if(b.grup==='ekip'){x=A[0].x;z=A[0].z;}
    else if(BLK_GRUP_YER[b.grup])[x,z]=BLK_GRUP_YER[b.grup];
    else{x=A.reduce((t,a)=>t+a.x,0)/A.length;z=A.reduce((t,a)=>t+a.z,0)/A.length;}}
  else if(b.tur==='yer'){x=b.x;z=b.z;y=0.4;}
  else return{nokta:BLK_HEDEF.set(...BLK.bakis),aci:BLK.yakinlik[0]};
  return{nokta:BLK_HEDEF.set(CX+x,PY+y,CZ+z),aci:BLK.yakinlik[b.kademe]};
}
/* tıklama: figürler karede izdüşümleriyle seçilir (küçük figürde ışın tutmaz); eşikler karenin yarı yüksekliği biriminde */
const BLK_ISIN=new THREE.Raycaster(),BLK_ZEMIN=new THREE.Plane(new THREE.Vector3(0,1,0),0),BLK_V=new THREE.Vector3();
function balkonIsaret(x,y){
  const K=ODA.kamera,[CX,PY,CZ]=BLK.saha,asp=K.aspect,tY=Math.tan(K.fov*Math.PI/360),genis=BALKON.bakis.tur==='saha';
  let en=null,enD=Infinity,enH=0;
  for(const a of blkGorunur()){
    BLK_V.set(CX+a.x,PY+0.9,CZ+a.z);const u=BLK_V.distanceTo(K.position);BLK_V.project(K);if(BLK_V.z>1)continue;
    const d=Math.hypot((BLK_V.x-x)*asp,BLK_V.y-y),h=1.8/(u*tY);
    if(d<enD){en=a;enD=d;enH=h;}}
  const I=BLK.isaret;
  if(en&&genis&&enD<Math.max(I.grup,1.5*enH))return{tur:'grup',grup:en.kume,fx:en.x,fz:en.z};
  if(en&&!genis&&enD<Math.max(I.figur,0.6*enH))return en.id?{tur:'oyuncu',id:en.id,grup:en.kume}:{tur:'grup',grup:en.kume};
  BLK_ISIN.setFromCamera({x,y},K);BLK_ZEMIN.constant=-PY;
  if(!BLK_ISIN.ray.intersectPlane(BLK_ZEMIN,BLK_V))return null;
  const yx=BLK_V.x-CX,yz=BLK_V.z-CZ;
  return Math.abs(yx)<=58&&Math.abs(yz)<=38?{tur:'yer',x:yx,z:yz}:null;
}
function balkonTakipEkrani(){
  const b=BALKON.bakis;if(b.tur!=='oyuncu')return null;
  return balkonAktorEkrani(b.id);
}
/* RK1: karedeki yer (0–1); kameranın arkasında ya da karenin dışındaysa null */
function blkEkranda(x,y,z){const [CX,PY,CZ]=BLK.saha;BLK_V.set(CX+x,PY+y,CZ+z).project(ODA.kamera);
  return BLK_V.z>1||Math.abs(BLK_V.x)>1.05||Math.abs(BLK_V.y)>1.05?null:{x:(BLK_V.x+1)/2,y:(1-BLK_V.y)/2};}
function balkonAktorEkrani(id){const a=blkTakipAktor(id);return a?blkEkranda(a.x,2.15,a.z):null;}
function balkonIsaretEkrani(h){
  if(!h)return null;
  if(h.tur==='oyuncu')return balkonAktorEkrani(h.id);
  if(h.tur==='grup')return h.fx!==undefined?blkEkranda(h.fx,2.15,h.fz):balkonGrupEkrani(h.grup);
  return null;
}
function balkonGrupEkrani(g){
  const A=blkGrupAktorleri(g);if(!A.length)return null;
  let x,z;
  if(g==='kosu'){const a=A[Math.floor((A.length-1)/2)];x=a.x;z=a.z;}
  else if(g==='ekip'){x=A[0].x;z=A[0].z;}
  else if(BLK_GRUP_YER[g])[x,z]=BLK_GRUP_YER[g];
  else{x=A.reduce((t,a)=>t+a.x,0)/A.length;z=A.reduce((t,a)=>t+a.z,0)/A.length;}
  return blkEkranda(x,2.6,z);
}
