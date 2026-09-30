/* ============ Chairman — balkon ve antrenman sahası (yalnız çizim; yol haritası 2.7) ============
   Başkan odasının (js/oda.js) dışı: kapıdan çıkılan balkon, altında kulübün sahası, boş tribünler, gündüz gökyüzü. ODA.dis grubuna kurulur;
   grup yalnız balkona yürürken ve balkondayken görünür. Oyun kuralı içermez: antrenmanın sürüp sürmediğini ve saati sunum katmanı
   balkonDurum ile bildirir (kurallar js/gozlem.js).
   Antrenman sunum amaçlı bir canlandırmadır, maç motoru değildir: üç grup tekrarlayan basit bir düzenle çalışır (ısınma koşusu, pas çemberi,
   kaleye şut); kenarda teknik direktör ve antrenörler durur. Oyuncular kadrodaki görünüşleriyle kurulur (js/kadrolar.js, js/oyuncular.js).
   Takvim dururken de saha hareket eder; saat ve karar durumu bununla karıştırılmaz (STIL_REHBERI §8).
     balkonDurum({antrenman, dakika})  takım sahada mı; gökyüzünün gün ışığı
     balkonKare(dt)                    canlandırma (js/oda.js grup görünürken çağırır)
   Renkler ve ölçüler STIL.balkon'dadır. */
const BLK=STIL.balkon;
const BALKON={antrenman:false,zaman:0,aktorler:[],kosu:[],rondo:[],sut:[],kaleci:null,ekip:[],top:{},grup:new THREE.Group()};
{
  const D=ODA.dis,[CX,PY,CZ]=BLK.saha,oLAM=o=>LAM(Object.assign({fog:false},o));
  const rgb=h=>[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255];

  /* ---- gökyüzü, çevre zemini, saha ---- */
  {const g=new THREE.SphereGeometry(330,16,10),p=g.attributes.position,col=[];
   for(let i=0;i<p.count;i++){const t=clamp(p.getY(i)/330*2.2,0,1),U=BLK.gokAlt,Q=BLK.gokUst;col.push(U[0]*(1-t)+Q[0]*t,U[1]*(1-t)+Q[1]*t,U[2]*(1-t)+Q[2]*t);}
   g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
   const gok=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}));gok.position.set(CX,PY,CZ);D.add(gok);BALKON.gok=gok.material;}
  {const z=new THREE.Mesh(new THREE.PlaneGeometry(700,700),oLAM({color:BLK.disZemin}));z.rotation.x=-Math.PI/2;z.position.set(CX,PY-0.3,CZ);D.add(z);
   const saha=new THREE.Mesh(new THREE.PlaneGeometry(132,92),oLAM({map:tx(pitchCv(STAT.zemin),'l')}));saha.rotation.x=-Math.PI/2;saha.position.set(CX,PY,CZ);D.add(saha);}

  /* ---- boş tribünler: basamaklar ve koltuk sıraları tek geometride (köşe renkli) ---- */
  {const P=[],beton=rgb(BLK.beton),koyu=rgb(BLK.betonKoyu),k1=rgb(BLK.koltuk),k2=rgb(BLK.koltukAcik);
   const sira=(x,y,z,w,yon,renk)=>{P.push({w,h:0.5,d:1.2,x,y:y-0.25,z,renk:beton});
     for(let s=-w/2+3;s<w/2-2;s+=6)P.push({w:5.2,h:0.34,d:0.5,x:x+s+2.6,y:y+0.17,z:z-yon*0.2,renk});};
   /* ana tribün: balkonun altından sahaya iner */
   for(let i=0;i<12;i++)sira(CX,-0.75-i*0.5,-6.4-i*1.2,64,1,i%4===3?k2:k1);
   P.push({w:64,h:1.1,d:0.3,x:CX,y:PY+0.55,z:-21.2,renk:koyu});
   /* karşı tribün: sahanın öbür yanında yükselir */
   for(let i=0;i<10;i++)sira(CX,PY+0.9+i*0.5,CZ-42-i*1.2,88,-1,i%3===2?k2:k1);
   P.push({w:88,h:6.4,d:0.4,x:CX,y:PY+3.2,z:CZ-54.4,renk:koyu});
   /* kale arkası setleri */
   for(const sx of[-1,1])for(let i=0;i<5;i++)P.push({w:1.4,h:0.45,d:56,x:CX+sx*(60+i*1.4),y:PY+0.3+i*0.45,z:CZ,renk:i%2?beton:koyu});
   D.add(new THREE.Mesh(kutuBirlestir(P),oLAM({vertexColors:true})));
   /* karşı tribünün çatısı ve direkleri */
   box(88,0.3,9,oLAM({color:BLK.cati}),CX,PY+9.2,CZ-49,D);
   for(let x=-40;x<=40;x+=20)box(0.4,9,0.4,oLAM({color:BLK.direk}),CX+x,PY+4.6,CZ-53.6,D);}

  /* ---- kaleler, projektör direkleri, uzakta kasaba ---- */
  {const post=oLAM({color:BLK.kalePost});
   for(const sx of[-1,1]){for(const v of[-3.66,3.66])box(0.12,2.44,0.12,post,CX+sx*52.5,PY+1.22,CZ+v,D);box(0.12,0.12,7.44,post,CX+sx*52.5,PY+2.44,CZ,D);
     const ag=new THREE.Mesh(new THREE.PlaneGeometry(7.32,2.4),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.22,side:THREE.DoubleSide,depthWrite:false,fog:false}));
     ag.rotation.y=Math.PI/2;ag.position.set(CX+sx*54.2,PY+1.2,CZ);D.add(ag);}
   const direk=oLAM({color:BLK.direk});
   for(const sx of[-1,1])for(const sz of[-1,1]){box(0.7,24,0.7,direk,CX+sx*64,PY+12,CZ+sz*44,D);box(4,2.6,0.6,direk,CX+sx*64,PY+25,CZ+sz*44,D);}
   const cv=mk(16,16),g=cv.getContext('2d');g.fillStyle='#ffffff';g.fillRect(0,0,16,16);g.fillStyle=BLK.pencere;for(let y=2;y<16;y+=4)for(let x=2;x<16;x+=4)g.fillRect(x,y,2,2);
   for(let i=0;i<11;i++){const w=10+h2(i,3)*9,h=9+h2(i,5)*14,d=9+h2(i,7)*6,yan=oLAM({color:BLK.apartman[i%4],map:tx(cv,'n',[Math.round(w/4),Math.round(h/3.5)])});
     box(w,h,d,yan,CX-105+i*21+h2(i,11)*6,PY+h/2-0.3,CZ-78-h2(i,13)*26,D);}
   const agac=oLAM({color:BLK.agac});
   for(let i=0;i<9;i++){const x=CX-84+i*21+h2(i,17)*8;box(0.5,3,0.5,oLAM({color:0x5a4028}),x,PY+1.5,CZ-66,D);box(4.2,4.4,4.2,agac,x,PY+5,CZ-66,D);}}

  /* ---- balkon: döşeme, korkuluk, küçük masa, çay ---- */
  {const kork=oLAM({color:BLK.korkuluk}),P=[];
   box(6.6,0.14,2.2,oLAM({color:BLK.zemin}),0,-0.07,-4.65,D);
   /* alçak ve ince korkuluk: oturan başkanın sahayı görmesini kapatmaz */
   for(const y of[0.1,0.8])P.push({w:6.6,h:0.04,d:0.04,x:0,y,z:-5.7});
   for(let x=-3.25;x<=3.26;x+=0.65)P.push({w:0.025,h:0.7,d:0.025,x,y:0.45,z:-5.7});
   for(const sx of[-1,1]){for(const y of[0.1,0.8])P.push({w:0.04,h:0.04,d:2.1,x:sx*3.27,y,z:-4.65});for(let z=-5.6;z<=-3.7;z+=0.65)P.push({w:0.025,h:0.7,d:0.025,x:sx*3.27,y:0.45,z});}
   D.add(new THREE.Mesh(kutuBirlestir(P),kork));
   const masa=oLAM({color:BLK.masa});
   box(0.9,0.04,0.62,masa,-0.6,0.72,-5.12,D);box(0.06,0.7,0.06,oLAM({color:BLK.masaAyak}),-0.6,0.35,-5.12,D);box(0.4,0.03,0.4,oLAM({color:BLK.masaAyak}),-0.6,0.015,-5.12,D);
   const tabak=new THREE.Mesh(new THREE.CylinderGeometry(0.062,0.05,0.01,12),oLAM({color:0xefece4}));tabak.position.set(-0.32,0.745,-5.12);D.add(tabak);
   const cay=new THREE.Mesh(new THREE.CylinderGeometry(0.026,0.02,0.085,10),oLAM({color:0x9a2a0c}));cay.position.set(-0.32,0.792,-5.12);D.add(cay);
   ODA.balkonTelefon={x:-0.86,y:0.74,z:-5.08,donus:0.35};}

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
function balkonDurum(d){
  if(d.antrenman!==undefined&&d.antrenman!==BALKON.antrenman){BALKON.antrenman=!!d.antrenman;BALKON.grup.visible=BALKON.antrenman;if(BALKON.antrenman)balkonKare(0.001);}
  if(d.dakika!==undefined){const I=odaGunIsigi(d.dakika);BALKON.gok.color.copy(I.renk).lerp(new THREE.Color(0xffffff),0.5).multiplyScalar(0.3+0.9*I.guc);}
}
