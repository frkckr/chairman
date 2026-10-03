/* ============ Chairman — balkon ve antrenman sahası (yalnız çizim; yol haritası 2.7, 2.8D) ============
   Başkan odasının (js/oda.js) dışı: kapıdan çıkılan balkon, altında kulübün sahası, gündüz gökyüzü. ODA.dis grubuna kurulur; grup odanın
   penceresinden de görünür. Stat, maçla aynı tariften aynı kurucuyla kurulur (js/stadyum.js statKur, gündüz ve boş): balkon ana tribünün
   (ve protokol locasının) hemen arkasında ve üstündedir; konumu tariften hesaplanır (BLK_STAT). Pencerede çatısız karşı tribün, tabela,
   projektörler ve çevredeki apartmanlar görünür; tribün onarımının taksiti ödendiyse basamaklarda iskele durur (balkonIskele, 2.8J).
   Oyun kuralı içermez: antrenmanın sürüp sürmediğini ve saati sunum katmanı balkonDurum ile bildirir (kurallar js/gozlem.js).
   Antrenman sunum amaçlı bir canlandırmadır, maç motoru değildir: üç grup tekrarlayan basit bir düzenle çalışır (ısınma koşusu, pas çemberi,
   kaleye şut); kenarda teknik direktör ve antrenörler durur. Oyuncular kadrodaki görünüşleriyle kurulur (js/kadrolar.js, js/oyuncular.js).
   Takvim dururken de saha hareket eder; saat ve karar durumu bununla karıştırılmaz (STIL_REHBERI §8).
     balkonDurum({antrenman, dakika})  takım sahada mı; gökyüzünün gün ışığı
     balkonKare(dt)                    canlandırma (js/oda.js grup görünürken çağırır)
     balkonIskele(var)                 tribün basamaklarındaki onarım iskelesi (yaşanmış olaydan; js/soz.js odaIzleri)
   Renkler ve ölçüler STIL.balkon'dadır. */
const BLK=STIL.balkon;
const BALKON={antrenman:false,zaman:0,aktorler:[],kosu:[],rondo:[],sut:[],kaleci:null,ekip:[],top:{},grup:new THREE.Group()};
/* stadın balkona göre yeri (tariften): ana tribünün arka duvarı balkon korkuluğunun hemen önünde, tepesi (protokol locası dahil) balkon döşemesinin altında.
   Stat grubu 180° döndürülür: ana tribün balkon tarafında kalır. [CX, PY, CZ] sahanın ortası; bakış sahanın ortasına */
const BLK_STAT=(()=>{
  const t=STAT.tribunler.find(x=>x.yer==='ana'),O=tribunOlcu(t),arka=YAN_MESAFE+O.D+0.6,ust=tribunTepe('ana')+(t.cati?0.3:1.2);
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
  const KD=KADROLAR.demirkapi,hepsi=KD.oyuncular.concat(KD.yedekler||[]),saha=hepsi.slice(1);
  BALKON.kaleci=aktor(kitKaydi(KD.kaleciForma,hepsi[0],hepsi[0].no),51.2,0);
  saha.forEach((o,i)=>{
    const yelekli=i===6,K=kitKaydi('yedekEv',o,o.no);
    const a=aktor(yelekli?Object.assign({},K,{shirt:BLK.yelek,trim:'#1c1c20'}):K,0,0);
    (i<6?BALKON.kosu:i<12?BALKON.rondo:BALKON.sut).push(a);
  });
  BALKON.ekip=[aktor(kitKaydi('antrenorEv',KD.td,0),6,29),aktor(kitKaydi('antrenorEv',{ten:2,sac:'kisa',sacRenk:'#241a12',boy:1,yapi:1.04},0),33,-11),aktor(kitKaydi('antrenorEv',{ten:0,sac:'kel',sacRenk:'#8a8680',boy:0.98,yapi:1.08,biyik:true},0),15,23)];
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
function balkonKare(dt){
  if(!BALKON.antrenman)return;
  const B=BALKON,t=(B.zaman+=dt);
  /* 1. ısınma koşusu: altı oyuncu yarı sahanın çevresinde sıra hâlinde */
  {const Y=BLK_KOSU_YOLU,uz=Y.map((p,i)=>Math.hypot(Y[(i+1)%4][0]-p[0],Y[(i+1)%4][1]-p[1])),top=uz.reduce((a,b)=>a+b,0);
   B.kosu.forEach((a,i)=>{
     let s=((t*3.1-i*2.6)%top+top)%top,k=0;while(s>uz[k]){s-=uz[k];k++;}
     const p=Y[k],q=Y[(k+1)%4],o=s/uz[k];a.x=p[0]+(q[0]-p[0])*o;a.z=p[1]+(q[1]-p[1])*o;a.yaw=Math.atan2(q[0]-p[0],q[1]-p[1]);
     a.faz+=dt*7.1;balkonPoz(a.m,POSE.runA,POSE.runB,(Math.sin(a.faz)+1)/2,0.85);B.yerlestir(a);});}
  /* 2. pas çemberi: beş oyuncu çemberde paslaşır, yelekli oyuncu ortada topu kovalar */
  {const R=BLK_RONDO,cember=B.rondo.filter((a,i)=>i!==0),orta=B.rondo[0],n=cember.length,tur=Math.floor(t/R.sure),o=(t/R.sure)%1;
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
  {const S=BLK_SUT,tur=Math.floor(t/S.sure),p=t%S.sure,n=B.sut.length,vuran=B.sut[tur%n],taraf=tur%2?1:-1,hz=taraf*2.6,K=B.kaleci;
   B.sut.forEach((a,i)=>{
     const yer=S.bas[((i-tur)%n+n)%n];
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
   K.x=51.2;K.z=hz*0.75*d;K.yaw=-Math.PI/2;
   balkonPoz(K.m,POSE.ready,POSE.dive,d,1);B.yerlestir(K);K.m.root.rotation.z=-taraf*1.1*d;K.m.root.position.y+=0.55*d;}
  /* teknik ekip: hoca kenarda, ara sıra işaret eder */
  B.ekip.forEach((a,i)=>{balkonBak(a,i===1?44:20,i===1?0:8);balkonPoz(a.m,i===0&&Math.sin(t*0.7)>0.75?POSE.isaret:BLK_DURUS,null,0,1);B.yerlestir(a);});
}
function balkonIskele(v){if(BALKON.iskele)BALKON.iskele.visible=!!v;}
function balkonDurum(d){
  if(d.antrenman!==undefined&&d.antrenman!==BALKON.antrenman){BALKON.antrenman=!!d.antrenman;BALKON.grup.visible=BALKON.antrenman;if(BALKON.antrenman)balkonKare(0.001);}
  if(d.dakika!==undefined){const I=odaGunIsigi(d.dakika);BALKON.gok.color.copy(I.renk).lerp(new THREE.Color(0xffffff),0.5).multiplyScalar(0.3+0.9*I.guc);}
}
