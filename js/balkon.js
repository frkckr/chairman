/* ============ Chairman — balkon ve antrenman sahası (yalnız çizim; yol haritası 2.7, 2.8D) ============
   Başkan odasının (js/oda.js) dışı: kapıdan çıkılan balkon, altında kulübün sahası, gündüz gökyüzü. ODA.dis grubuna kurulur; grup odanın
   penceresinden de görünür. Stat, maçla aynı tariften aynı kurucuyla kurulur (js/stadyum.js statKur, gündüz ve boş): balkon ana tribünün
   (ve protokol locasının) hemen arkasında ve üstündedir; konumu tariften hesaplanır (BLK_STAT). Pencerede çatısız karşı tribün, tabela,
   projektörler ve çevre (karşıda evler, doğuda kaya yamaç, ufukta tepeler; js/stadyum-cevre.js) görünür; tribün onarımının taksiti ödendiyse basamaklarda iskele durur (balkonIskele, 2.8J).
   Oyun kuralı içermez: antrenmanın sürüp sürmediğini ve saati sunum katmanı balkonDurum ile bildirir (kurallar js/gozlem.js).
   Antrenman sunum amaçlı bir canlandırmadır, maç motoru değildir: gruplar ısınma koşusu, pas çemberi, kaleye şut, esneme ve sakatlıktan dönenin ayrı
   koşusuyla çalışır; kenarda kaleciler kaleci antrenörüyle, hoca gruplar arasında dolaşır, fizyoterapist ayrı koşanın yanında. RK1 (2026-10-31): herkes
   kendi adımı ve temposuyla, pas sırası ve şutun sonucu belirlenimli rastlantıyla, top uçar ve düşer, kaleci uzanır ve kalkar (aşağıda “RK1”).
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
    const a={m,g,x,z,yaw:0,faz:h2(BALKON.aktorler.length,3)*6,ev:{x,z},renk:K.shirt||'#3a3a3a'};BALKON.aktorler.push(a);if(BALKON.uzak)blkUzakUygula(a);return a;
  }
  const KD=KADROLAR.demirkapi;
  /* R5: oyuncu figürleri kimlikle havuzdan (balkonDuzenKur); kaleci kaleci formasıyla, öbürleri antrenman formasıyla */
  BALKON.oyuncuAktor=(id,o,kaleci)=>{let a=BALKON.havuz.get(id);if(!a){a=aktor(kitKaydi(kaleci?KD.kaleciForma:'yedekEv',o,o.no|0),0,0);BALKON.havuz.set(id,a);}return a;};
  BALKON.ekip=[aktor(kitKaydi('antrenorEv',KD.td,0),6,29),aktor(kitKaydi('antrenorEv',{ten:2,sac:'kisa',sacRenk:'#241a12',boy:1,yapi:1.04},0),33,-11),aktor(kitKaydi('antrenorEv',{ten:0,sac:'kel',sacRenk:'#8a8680',boy:0.98,yapi:1.08,biyik:true},0),15,23),
    aktor(kitKaydi('antrenorEv',{ten:1,sac:'kisa',sacRenk:'#3a2a1a',boy:0.97,yapi:0.98},0),-20,-29)];   /* R5: dördüncüsü fizyoterapist (ayrı koşu) */
  BALKON.ekip.forEach((a,i)=>{a.kume='ekip';a.kim=blkKimlik('ekip-'+i);});   /* RK1: ekibin de kendi yürüyüşü */
  /* toplar ve koniler */
  const topGeo=new THREE.SphereGeometry(0.14,8,6),topM=oLAM({color:0xf4f4ee});
  const top=()=>{const t=new THREE.Mesh(topGeo,topM);G.add(t);return t;};
  /* RK1: şut çalışmasının beş toplu havuzu ve kenardaki kalecilerin topu */
  BALKON.top={rondo:top(),sut:[0,1,2,3,4].map(()=>top()),kenar:top(),yedek:[0,1,2,3,4].map(i=>{const t=top();t.position.set(CX+7.5+i*0.45,PY+0.14,CZ+30.2+h2(i,5)*0.8);return t;})};
  {const K=[],N=new THREE.InstancedMesh(new THREE.ConeGeometry(0.13,0.28,6),oLAM({color:BLK.koni}),24),M=new THREE.Matrix4();
   for(let i=0;i<8;i++)K.push([22+Math.cos(i*Math.PI/4)*7.6,14+Math.sin(i*Math.PI/4)*7.6]);
   for(const c of[[-45,-26],[-8,-26],[-8,26],[-45,26],[30,-7],[30,4],[38,-3],[38,3]])K.push(c);
   K.forEach((c,i)=>{M.makeTranslation(CX+c[0],PY+0.14,CZ+c[1]);N.setMatrixAt(i,M);});N.count=K.length;N.frustumCulled=false;G.add(N);}
  BALKON.yerlestir=a=>{a.m.root.position.set(CX+a.x,PY,CZ+a.z);a.m.root.rotation.y=a.yaw;a.g.position.set(CX+a.x+0.35,PY+0.03,CZ+a.z-0.2);};
  BALKON.topKoy=(t,x,y,z)=>t.position.set(CX+x,PY+0.14+y,CZ+z);
}

/* R5: düzeni figürlere dağıtır (aynı anahtarla yeniden kurmaz); düzende olmayan figürler gizlenir. RK1: figür oyuncunun ayağını ve özelliklerini
   (a.o: ayak, oz, boy) ve kimliğini (a.kim) taşır; düzen değişince çalışmaların durumu baştan kurulur */
function balkonDuzenKur(D){
  const B=BALKON,O=D.oyuncular||{},al=(id,kl)=>B.oyuncuAktor(id,O[id]||{},kl);
  for(const a of B.havuz.values()){a.m.root.visible=false;a.g.visible=false;}
  /* RB: figür kimliğini ve kümesini taşır (bakış ve tıklama) */
  const L=(ad,kl,kume)=>(D[ad]||[]).filter(id=>O[id]).map(id=>{const a=al(id,kl);a.m.root.visible=true;a.g.visible=true;a.id=id;a.kume=kume||ad;
    a.o=O[id];a.kim=a.kim||blkKimlik(id);a.poz=null;a.is=null;a.tepki=null;a.m.root.rotation.z=0;return a;});
  B.tur=D.tur||'yogun';B.kosu=L('kosu');B.rondo=L('rondo');B.sut=L('sut');B.esneme=L('esneme');B.ayri=L('ayri');
  const KL=L('kaleciler',true);
  B.kaleci=KL[0]||null;
  B.kenar=L('kenar',true,'kaleciler');
  B.ekip[3].m.root.visible=B.ekip[3].g.visible=B.ayri.length>0;
  B.top.rondo.visible=B.rondo.length>2;for(const t of B.top.sut)t.visible=B.sut.length>0;B.top.kenar.visible=B.kenar.length>0;
  blkCalismaKur();
}
/* iki pozun ağırlıklı karışımı; g: hareketin genliği (0 = düz duruş) */
const BLK_EKLEM=['lean','dy','hx','lL','kL','lR','kR','aL','aR','aLz','aRz','eL','eR'];
function balkonPoz(m,A,B,w,g){const P={};for(const e of BLK_EKLEM)P[e]=((A[e]||0)*(1-w)+((B&&B[e])||0)*w)*g;pose(m,P);}
const BLK_DURUS={aLz:-0.08,aRz:0.08,eL:-0.15,eR:-0.15};
function balkonBak(a,hx,hz){a.yaw=Math.atan2(hx-a.x,hz-a.z);}
const BLK_KOSU_YOLU=[[-45,-26],[-8,-26],[-8,26],[-45,26]],BLK_RONDO={x:22,z:14,r:5.5,sure:1.05},BLK_SUT={sure:4.4,bas:[[30,-6],[30,-3.5],[30,-1]],vurus:[38.2,0]};
/* R5: esneme (kişiye göre sırayla esneme hareketleri), ayrı koşu (çizgi boyunca, fizyoterapistle), toparlanmada yavaş koşu.
   RK1: öne devrilen esneme pozu kalktı; hamle (B) kalça indirilerek; öbür esneme hareketleri maç öncesi ısınmanınkiler (POSE.esneme1, esneme2) */
const BLK_ESNEME={B:{lean:0.15,dy:-0.2,lL:-0.7,kL:1.1,lR:0.35,aL:-0.2,aR:-0.2,aLz:-0.25,aRz:0.25},yer:{x:-30,z:-12,ara:2.6},sure:5.5},
  BLK_AYRI={z:-29,x:[-40,0],hiz:1.6};

/* ---- RK1 (2026-10-31; kullanıcı: “antrenmanda oyuncular çok robotik — hepsi aynı anda, aynı şekilde koşuyor; pas hep aynı sıra, hata yok;
   şut gelince top havada kalıyor, yedek kaleci duruyor; antrenörler dolaşmıyor”): ucuz düzeltmeler. Yeni figür biçimi yok; kalecinin gerçek uçuş yayı,
   top fiziğinin ayrıntısı, oturum yayı ve oyuncunun günü RK9'da. Rastlantı çizimdedir ve belirlenimlidir (h2 karması; kariyerin rastlantısını
   çekmez): aynı düzen aynı antrenmanı oynar. ---- */
/* kimlik: oyuncuya göre sabit hareket parametreleri (aynı oyuncu her gün aynı koşar): adım boyu, kol salınımı, dirsek, eğim, tempo, faz, bekleyiş
   duruşu, grupta geride kalma eğilimi, koşu hızı */
function blkKarma(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function blkKimlik(id){const n=blkKarma(String(id))%1000003,u=i=>h2(n,i*7919+13);
  return{adim:0.84+0.36*u(1),kol:0.78+0.44*u(2),dirsek:0.3*(u(3)-0.5),egim:0.08*(u(4)-0.5),tempo:0.86+0.28*u(5),faz:u(6)*6.283,bekle:Math.floor(u(7)*3),
    geri:0.14*(u(8)-0.5),hiz:0.95+0.1*u(9),n};}
/* RK1: yürüyüş (yürüyen ekip ve sıraya dönenler; gerçek yürüme döngüsü RK9'da) — dizler az bükülür, havada evre yok */
const BLK_YURU={A:{lean:0.05,lL:-0.42,kL:0.12,lR:0.36,kR:0.5,aL:0.32,aR:-0.3,eL:-0.25,eR:-0.25,aLz:-0.06,aRz:0.06},
  B:{lean:0.05,lL:0.36,kL:0.5,lR:-0.42,kR:0.12,aL:-0.3,aR:0.32,eL:-0.25,eR:-0.25,aLz:-0.06,aRz:0.06}};
const BLK_SUT_YER={cizgi:52.5,direk:3.66,ust:2.44,ag:1.3,pano:6};   /* kale çizgisi x, direklerin z'si, üst direk, ağın derinliği, kale arkası pano (m) */
const BLK_YN={x:0,z:0,tx:1,tz:0},BLK_G=9.81;
const blkPuruz=(n,i)=>h2(n|0,i|0);   /* belirlenimli rastlantı (0–1): olayın sırası ve tür kimliği */
const blkYumusak=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
/* iki pozun karışımı (figürün yeniden kullanılan nesnesine; ayna: sol ayaklı oyuncu için aynala) */
function blkKarisim(a,A,B,w,g,ayna){const P=a._P||(a._P={});if(ayna){A=aynala(A);if(B)B=aynala(B);}
  for(const e of BLK_EKLEM)P[e]=((A[e]||0)*(1-w)+((B&&B[e])||0)*w)*g;return P;}
/* pozu yumuşak uygular: her kanal hedefe üstel yaklaşır (k 1/sn); ilk karede, büyük atlamada ve dt yokken doğrudan */
function blkPozUygula(a,P,dt,k){
  if(!a.poz||!(dt>0)||dt>0.3){a.poz={};for(const e of BLK_EKLEM)a.poz[e]=P[e]||0;}
  else{const f=1-Math.exp(-(k||14)*dt);for(const e of BLK_EKLEM)a.poz[e]+=((P[e]||0)-a.poz[e])*f;}
  pose(a.m,a.poz);
}
/* yön: en kısa yoldan, en çok hiz rad/sn (dt yoksa hemen) */
function blkDon(a,h,dt,hiz){let d=h-a.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));const m=(hiz||4)*(dt>0?dt:1e9);a.yaw+=clamp(d,-m,m);}
function blkBakYon(a,hx,hz,dt,hiz){const dx=hx-a.x,dz=hz-a.z;if(dx*dx+dz*dz>1e-4)blkDon(a,Math.atan2(dx,dz),dt,hiz);}
/* koşu adımının boyu (m): hızdan, boydan, kimlikten ve hız özelliğinden (hızlı oyuncu uzun adımlı) */
function blkAdimBoyu(a,v){const boy=(a.o&&a.o.boy)||1,hz=(a.o&&a.o.oz&&a.o.oz[0])||60;return boy*a.kim.adim*(0.45+0.25*v)*clamp(0.9+0.2*(hz-55)/45,0.82,1.12);}
/* koşu: kadans hızdan ve adım boyundan; kol, dirsek ve eğim kimlikten; adımda gövde hafifçe iner */
function blkKosuPoz(a,v,dt){
  /* adım boyu kişinin kendi temposuyla hafifçe dalgalanır: aynı boydaki iki koşucu da adım adım kilitlenmez */
  const k=a.kim,L=blkAdimBoyu(a,v)*(1+0.035*Math.sin(BALKON.zaman*0.27*k.tempo+k.faz));
  a.faz+=(dt||0)*Math.PI*v/Math.max(0.3,L);a.adimBoy=L;a.kadans=v/Math.max(0.3,L);
  const g=Math.min(1,v/3.4)*1.12,P=blkKarisim(a,POSE.runA,POSE.runB,(Math.sin(a.faz)+1)/2,g);
  P.aL*=k.kol;P.aR*=k.kol;P.eL+=k.dirsek;P.eR+=k.dirsek;P.lean+=k.egim+0.05*Math.min(1,v/4);P.dy-=0.03*g*Math.abs(Math.cos(a.faz));
  blkPozUygula(a,P,dt);
}
function blkYuruPoz(a,v,dt){
  const k=a.kim,boy=(a.o&&a.o.boy)||1,L=boy*k.adim*(0.5+0.18*v);
  a.faz+=(dt||0)*Math.PI*v/Math.max(0.3,L);a.adimBoy=L;a.kadans=v/Math.max(0.3,L);
  const g=Math.min(1,0.45+v/2.6),P=blkKarisim(a,BLK_YURU.A,BLK_YURU.B,(Math.sin(a.faz)+1)/2,g);
  P.aL*=k.kol;P.aR*=k.kol;P.lean+=k.egim;P.dy-=0.012*Math.abs(Math.cos(a.faz));
  blkPozUygula(a,P,dt);
}
/* bekleyiş: kimliğe göre eller belde, izler ya da hazırda; nefesle küçük iniş çıkış, ara sıra baş döner (fazlar kişiye göre) */
function blkBekle(a,dt,tur){
  const k=a.kim,t=BALKON.zaman,AP=typeof ANM_POZ!=='undefined'?ANM_POZ:null;
  const S=tur==='hazir'?POSE.ready:[AP&&AP.belde||BLK_DURUS,AP&&AP.izle||BLK_DURUS,POSE.ready][k.bekle];
  const P=blkKarisim(a,S,null,0,S===POSE.ready?0.55+0.15*Math.sin(t*1.7*k.tempo+k.faz):1);
  P.dy+=0.007*Math.sin(t*1.5*k.tempo+k.faz);P.hx+=0.08*Math.sin(t*0.37*k.tempo+k.faz*2);
  blkPozUygula(a,P,dt,8);
}
/* bir noktaya gider: 2 m/sn'den yavaşsa yürür, değilse koşar; varışa yaklaşırken yavaşlar; yön en çok 4 rad/sn döner. Vardıysa true (poz çağırana) */
function blkGit(a,hx,hz,v,dt){
  const dx=hx-a.x,dz=hz-a.z,u=Math.hypot(dx,dz);
  if(u<0.12||!(dt>0))return u<0.12;
  const yavas=Math.min(v,Math.max(0.6,u*2.2)),adim=Math.min(u,yavas*dt);a.x+=dx/u*adim;a.z+=dz/u*adim;
  blkDon(a,Math.atan2(dx,dz),dt);
  if(yavas<2)blkYuruPoz(a,yavas,dt);else blkKosuPoz(a,yavas,dt);
  return false;
}

/* koşu yolu: yarı sahanın çevresinde köşeleri yuvarlatılmış dikdörtgen (yay uzunluğuna göre örneklenir) */
const BLK_KOSU_YOL=(()=>{const C=BLK_KOSU_YOLU,R=3.5,P=[];
  for(let i=0;i<4;i++){const a=C[(i+3)%4],b=C[i],c=C[(i+1)%4],ux=b[0]-a[0],uz=b[1]-a[1],vx=c[0]-b[0],vz=c[1]-b[1],lu=Math.hypot(ux,uz),lv=Math.hypot(vx,vz);
    const p0=[b[0]-ux/lu*R,b[1]-uz/lu*R],p1=[b[0]+vx/lv*R,b[1]+vz/lv*R];
    for(let k=0;k<=8;k++){const t=k/8,m=1-t;P.push([m*m*p0[0]+2*m*t*b[0]+t*t*p1[0],m*m*p0[1]+2*m*t*b[1]+t*t*p1[1]]);}}
  const L=[0];for(let i=1;i<=P.length;i++){const p=P[i-1],q=P[i%P.length];L.push(L[i-1]+Math.hypot(q[0]-p[0],q[1]-p[1]));}
  return{P,L,top:L[L.length-1]};})();
function blkYolNokta(s,o){const Y=BLK_KOSU_YOL,n=Y.P.length;s=((s%Y.top)+Y.top)%Y.top;
  let a=0,b=n;while(b-a>1){const m=(a+b)>>1;if(Y.L[m]<=s)a=m;else b=m;}
  const p=Y.P[a],q=Y.P[(a+1)%n],w=(s-Y.L[a])/Math.max(1e-6,Y.L[a+1]-Y.L[a]),dx=q[0]-p[0],dz=q[1]-p[1],l=Math.hypot(dx,dz)||1;
  o.x=p[0]+dx*w;o.z=p[1]+dz*w;o.tx=dx/l;o.tz=dz/l;return o;}

/* çalışmaların durumu (düzen değişince baştan); ölçüm sayaçları BALKON.olcu (araclar/antrenman-olcum.py okur; görüntüden başka işe yaramaz) */
function blkCalismaKur(){
  const B=BALKON;
  B.kosuD={lider:0};B.kosu.forEach(a=>{a.s=undefined;});
  B.rondoD=null;B.sutD=null;B.kenarD=null;B.ekipD=null;
  B.olcu={dokunus:{},pas:0,kesme:0,kotuKontrol:0,sut:{atis:0,gol:0,kurtaris:0,iska:0},kaleciHazir:[]};
  /* ilk yerleşim: herkes çalışmasının başındaki yerinde (gün değişince; yoksa sahanın ortasından yürüyerek gelirlerdi) */
  const koy=(a,x,z,yaw)=>{if(!a)return;a.x=x;a.z=z;if(yaw!==undefined)a.yaw=yaw;a.poz=null;};
  {const R=BLK_RONDO,C=B.rondo.slice(1),n=C.length;koy(B.rondo[0],R.x,R.z);C.forEach((a,j)=>koy(a,R.x+Math.cos(j*2*Math.PI/n)*R.r,R.z+Math.sin(j*2*Math.PI/n)*R.r,0));}
  B.sut.forEach((a,j)=>{const [x,z]=blkSiraYer(j);koy(a,x,z,Math.PI/2);});
  koy(B.kaleci,BLK_SUT_YER.cizgi-1.3,0,-Math.PI/2);
  B.kenar.forEach((a,i)=>koy(a,45.5+(i?1.8:0),10+(i?2.4+(i-1)*0.8:0),-Math.PI/2));
  koy(B.ekip[0],BLK_HOCA_YERLERI[0][0],BLK_HOCA_YERLERI[0][1]);koy(B.ekip[1],B.kenar.length?40.2:33,B.kenar.length?10:-11,Math.PI/2);
  if(B.ayri.length)koy(B.ekip[3],BLK_AYRI.x[0]-1.6,BLK_AYRI.z-1.4);
}

/* ---- pas çemberi: tutan topu bir süre tutar (kişiye göre), alıcıyı seçer (az dokunana ağırlıklı, belirlenimli), geri salınımda topu bırakır;
   top yerden (bazen havadan) gider; ortadaki topa koşar; kimi pas kesilir (kesen çembere, veren ortaya), kimi kötü kontrol edilir (top sekip
   biraz uzaklaşır, alan gidip oradan oynar); ortadaki en geç 40 sn'de değişir ---- */
const BLK_RONDO_AYAR={kesme:0.08,kotu:0.06,havadan:0.15,tutEn:0.45,tutEnCok:1.15,hiz:[11,14],degis:40};
function blkRondoKur(){const B=BALKON;return{cember:B.rondo.slice(1),orta:B.rondo[0],tutan:0,evre:'tut',t:0,tut:0.8,hedef:1,n:0,son:B.zaman,son2:-1,yakin:{},
  top:{x:BLK_RONDO.x,z:BLK_RONDO.z,y:0},ucus:null,degis:null,kotuYer:null,vardi:false};}
function blkRondoAlici(D){
  const n=D.cember.length,C=[];let top=0;
  for(let j=0;j<n;j++){if(j===D.tutan||(n>3&&j===D.son2))continue;const w=1/(1+(D.yakin[D.cember[j].id]||0));C.push([j,w]);top+=w;}
  if(!C.length)return(D.tutan+1)%n;
  let r=blkPuruz(D.n*31+7,D.cember[D.tutan].kim.n%997)*top;for(const [j,w] of C){if((r-=w)<=0)return j;}return C[C.length-1][0];
}
function blkRondo(dt){
  const B=BALKON,R=BLK_RONDO,A=BLK_RONDO_AYAR,D=B.rondoD||(B.rondoD=blkRondoKur()),n=D.cember.length,yuva=j=>{const ac=j*2*Math.PI/n;return[R.x+Math.cos(ac)*R.r,R.z+Math.sin(ac)*R.r];};
  if(dt>0){D.t+=dt;for(const k in D.yakin)D.yakin[k]*=Math.exp(-dt/25);}
  const tutan=D.cember[D.tutan],T=D.top;
  /* rol değişimi: kesen (ya da sırası gelen ortadaki) topla çemberdeki yuvaya gider, veren ortaya */
  if(D.degis){const G=D.degis,[yx,yz]=yuva(G.yuva),v1=blkGit(G.giren,yx,yz,2.8,dt),v2=blkGit(G.cikan,R.x,R.z,2.8,dt);
    T.x=G.giren.x+Math.sin(G.giren.yaw)*0.45;T.z=G.giren.z+Math.cos(G.giren.yaw)*0.45;T.y=0;
    if(v1)blkBekle(G.giren,dt,'hazir');if(v2)blkBekle(G.cikan,dt,'hazir');
    D.cember.forEach((a,j)=>{if(a===G.cikan)return;const [x,z]=yuva(j);if(blkGit(a,x,z,3,dt)){blkBakYon(a,T.x,T.z,dt,4);blkBekle(a,dt,'hazir');}});
    if((v1&&v2)||D.t>3.5){D.cember[G.yuva]=G.giren;D.orta=G.cikan;D.tutan=G.yuva;D.degis=null;D.son=B.zaman;D.evre='tut';D.t=0;D.tut=0.7;D.hedef=blkRondoAlici(D);}
    B.topKoy(B.top.rondo,T.x,0,T.z);return;}
  /* çember: herkes yuvasına döner ve topa bakar; tutan topu ayağında tutar, alıcıya döner */
  D.cember.forEach((a,j)=>{
    if(a===tutan&&D.evre!=='ucus'){const [yx,yz]=D.kotuYer||yuva(j);
      D.vardi=blkGit(a,yx,yz,2.6,dt);
      if(D.vardi){const al=D.cember[D.hedef];blkBakYon(a,al.x,al.z,dt,5);
        if(D.evre==='pas'){const sol=a.o&&a.o.ayak==='sol';blkPozUygula(a,blkKarisim(a,D.t<0.2?POSE.pasGeri:POSE.pasTakip,null,0,1,sol),dt,D.t<0.2?18:10);}
        else blkBekle(a,dt,'hazir');}
      T.x=a.x+Math.sin(a.yaw)*0.4;T.z=a.z+Math.cos(a.yaw)*0.4;T.y=0;return;}
    const [yx,yz]=yuva(j);
    if(blkGit(a,yx,yz,3,dt)){blkBakYon(a,T.x,T.z,dt,4);
      if(D.evre==='ucus'&&D.ucus&&D.ucus.alan===a&&D.ucus.u>0.65)blkPozUygula(a,blkKarisim(a,POSE.kontrol,null,0,1),dt,10);else blkBekle(a,dt,'hazir');}
  });
  /* ortadaki: topun gideceği yere doğru koşar (çemberin içinde kalır) */
  {const o=D.orta;let hx=T.x,hz=T.z;if(D.ucus){hx=D.ucus.bx+(D.ucus.cx-D.ucus.bx)*0.55;hz=D.ucus.bz+(D.ucus.cz-D.ucus.bz)*0.55;}
   const dx=hx-R.x,dz=hz-R.z,u=Math.hypot(dx,dz),m=Math.min(1,3.4/Math.max(u,1e-6));
   if(blkGit(o,R.x+dx*m,R.z+dz*m,3.6*o.kim.hiz,dt)){blkBakYon(o,T.x,T.z,dt,5);blkBekle(o,dt,'hazir');}}
  if(D.evre==='tut'&&D.t>=D.tut&&D.vardi&&dt>0){
    if(B.zaman-D.son>A.degis){D.degis={giren:D.orta,cikan:tutan,yuva:D.tutan};D.t=0;}
    else{D.evre='pas';D.t=0;}}
  else if(D.evre==='pas'&&D.t>=0.2){
    /* top bırakılır: alıcıya; kimi kesilir, kimi kötü kontrol edilir */
    D.n++;B.olcu.pas++;const al=D.cember[D.hedef],kes=blkPuruz(D.n*13+5,n)<A.kesme,kotu=!kes&&blkPuruz(D.n*17+3,41)<A.kotu;
    const bx=T.x,bz=T.z,cx=al.x,cz=al.z,uz=Math.hypot(cx-bx,cz-bz)||1,hiz=A.hiz[0]+(A.hiz[1]-A.hiz[0])*blkPuruz(D.n,59),hava=blkPuruz(D.n*7+1,61)<A.havadan;
    let ex=cx-(cx-bx)/uz*0.35,ez=cz-(cz-bz)/uz*0.35;if(kotu){ex=cx+(cx-bx)/uz*1.3;ez=cz+(cz-bz)/uz*1.3;}
    if(kes){ex=bx+(cx-bx)*0.55;ez=bz+(cz-bz)*0.55;B.olcu.kesme++;}
    D.ucus={bx,bz,cx:ex,cz:ez,sure:Math.hypot(ex-bx,ez-bz)/(hava?hiz*0.7:hiz),u:0,hava,kes,kotu,alan:kes?D.orta:al};D.evre='ucus';D.t=0;D.son2=D.tutan;D.kotuYer=null;}
  if(D.evre==='ucus'){const U=D.ucus;U.u=clamp(D.t/U.sure,0,1);const w=U.hava?U.u:1-0.15*(1-U.u)*(1-U.u)-0.85*(1-U.u);   /* yerden: hafif yavaşlar */
    T.x=U.bx+(U.cx-U.bx)*w;T.z=U.bz+(U.cz-U.bz)*w;T.y=U.hava?Math.sin(Math.PI*U.u)*1.3:0;
    if(U.u>=1&&dt>0){const al=U.alan;B.olcu.dokunus[al.id]=(B.olcu.dokunus[al.id]||0)+1;D.yakin[al.id]=(D.yakin[al.id]||0)+1;D.ucus=null;D.t=0;
      if(U.kes)D.degis={giren:D.orta,cikan:tutan,yuva:D.tutan};
      else{D.tutan=D.cember.indexOf(al);D.kotuYer=U.kotu?[U.cx,U.cz]:null;if(U.kotu)B.olcu.kotuKontrol++;D.vardi=false;
        D.evre='tut';D.tut=A.tutEn+(A.tutEnCok-A.tutEn)*blkPuruz(D.n*3+11,al.kim.n%101)/al.kim.tempo;D.hedef=blkRondoAlici(D);}}}
  B.topKoy(B.top.rondo,T.x,T.y,T.z);
}

/* ---- şut: sıradaki koşar, topa basıp vurur (sol ayaklı solla); hedef ve ıska şut özelliğinden, kurtarış kalecilikten (belirlenimli). Top uçar:
   gol ağda yavaşlayıp düşer, ıska kalenin arkasına düşüp panodan seker, tutulan top elde kalır ve kaleci onu sıraya yuvarlar, çelinen top yana sekip
   düşer. Kaleci tepki süresinden sonra uzanır, yere iner, kalkar ve yan adımlarla ortaya döner. Beş toplu havuz (en eskisi yeniden kullanılır) ---- */
function blkSutKur(){const B=BALKON;return{sira:B.sut.slice(),evre:'hazirlik',t:0,n:0,vuran:null,top:null,hedef:null,sol:false,gol:null,
  toplar:B.top.sut.map((m,i)=>({m,x:36.6+0.42*i,y:0,z:-2.2+0.3*(i%2),vx:0,vy:0,vz:0,dur:true})),kaleci:{evre:'hazir',t:0,z0:0,hz:0,hy:0,atti:false,atis:-9}};}
const blkSiraYer=j=>[30-0.18*j,-1.2-1.15*j];
function blkTopUcur(U,dt){
  /* yer çekimi, yerde sekme ve sürtünme; ağda hızla durur; kale arkasındaki panodan seker */
  if(U.dur||U.elde||!(dt>0))return;const Y=BLK_SUT_YER;
  U.vy-=BLK_G*dt;U.x+=U.vx*dt;U.y+=U.vy*dt;U.z+=U.vz*dt;
  if(U.ag&&U.x>Y.cizgi){const s=Math.exp(-9*dt);U.vx*=s;U.vz*=s;if(U.x>Y.cizgi+Y.ag){U.x=Y.cizgi+Y.ag;U.vx=-Math.abs(U.vx)*0.1;}}
  if(U.x>Y.cizgi+Y.pano){U.x=Y.cizgi+Y.pano;U.vx=-Math.abs(U.vx)*0.3;}
  if(U.y<=0){U.y=0;if(U.vy<-1.2){U.vy=-U.vy*0.42;U.vx*=0.78;U.vz*=0.78;}else{U.vy=0;const s=Math.exp(-1.6*dt);U.vx*=s;U.vz*=s;}}
  if(U.y===0&&U.vy===0&&Math.hypot(U.vx,U.vz)<0.12)U.dur=true;
}
function blkSut(dt){
  const B=BALKON,S=BLK_SUT,Y=BLK_SUT_YER,D=B.sutD||(B.sutD=blkSutKur()),K=B.kaleci,KD=D.kaleci;
  if(dt>0)D.t+=dt;
  /* sıra: baştakinden arkaya; vuran kendi işinde; tepki gösteren durur; sıraya dönen koşar */
  D.sira.forEach((a,j)=>{if(a===D.vuran)return;
    if(a.tepki&&B.zaman<a.tepki.son){blkPozUygula(a,blkKarisim(a,a.tepki.poz,null,0,1),dt,9);return;}
    const [x,z]=blkSiraYer(j);if(blkGit(a,x,z,a.is==='donus'?3.2:1.6,dt)){a.is=null;blkBakYon(a,Y.cizgi,0,dt,3);blkBekle(a,dt);}});
  /* hazırlık: havuzun sıradaki topu noktaya, baştaki koşar; hedef ve ıska şut özelliğinden */
  if(D.evre==='hazirlik'&&D.sira.length&&dt>0){
    if(K)B.olcu.kaleciHazir.push({y:+(K.m.root.position.y-BLK.saha[1]).toFixed(3),rz:+K.m.root.rotation.z.toFixed(3)});
    D.top=D.toplar[D.n%D.toplar.length];Object.assign(D.top,{x:S.vurus[0],y:0,z:S.vurus[1],vx:0,vy:0,vz:0,dur:true,elde:false,ag:false,kurtar:false,cizgi:false});
    D.vuran=D.sira.shift();D.sira.push(D.vuran);D.evre='kos';D.t=0;D.n++;
    const v=D.vuran,oz=(v.o&&v.o.oz)||[],sut=oz[2]||55,r1=blkPuruz(D.n*19+3,v.kim.n%211),r2=blkPuruz(D.n*23+5,71),r3=blkPuruz(D.n*29+7,83);
    const iska=r1<clamp(0.45-(sut-50)/150,0.12,0.55),yuksek=iska&&r3>0.55;
    const tz=iska&&!yuksek?(r2<0.5?-1:1)*(Y.direk+0.4+1.6*r3):(r2*2-1)*(Y.direk-0.35),ty=yuksek?Y.ust+0.3+0.9*r2:0.15+(Y.ust-0.45)*r3*r3;
    D.hedef={z:tz,y:ty,iska,hiz:19+7*clamp((sut-30)/60,0,1)*(0.85+0.3*r2)};D.sol=!!(v.o&&v.o.ayak==='sol');}
  if(D.vuran&&D.evre==='kos'){const v=D.vuran,yan=D.sol?0.35:-0.35;
    if(blkGit(v,S.vurus[0]-0.75,S.vurus[1]+yan,4.6*v.kim.hiz,dt)||D.t>4){D.evre='vur';D.t=0;}}
  if(D.vuran&&D.evre==='vur'){const v=D.vuran;blkBakYon(v,Y.cizgi,D.hedef.z*0.6,dt,6);
    blkPozUygula(v,blkKarisim(v,POSE.vurusGeri,POSE.vurusTakip,blkYumusak((D.t-0.08)/0.16),1,D.sol),dt,22);
    if(D.t>=0.22&&dt>0){/* temas: top uçar; kaleci tepki verir */const H=D.hedef,T=(Y.cizgi-S.vurus[0])/H.hiz;
      Object.assign(D.top,{vx:H.hiz,vz:(H.z-S.vurus[1])/T,vy:(H.y+BLK_G*T*T/2)/T,dur:false});
      B.olcu.sut.atis++;D.evre='ucus';D.t=0;
      const oz=(K&&K.o&&K.o.oz)||[],kl=oz[8]||60;
      D.kurtar=!!K&&!H.iska&&blkPuruz(D.n*37+11,97)<clamp(0.28+(kl-50)/110-(Math.abs(H.z)-1)/6-(H.hiz-20)/40,0.05,0.78);
      if(K){KD.evre='tepki';KD.t=0;KD.hz=clamp(H.z,-Y.direk+0.4,Y.direk-0.4);KD.hy=H.y;KD.tepki=0.2-0.06*clamp((kl-50)/40,0,1);}}}
  if(D.evre==='ucus'&&D.vuran){const v=D.vuran;if(D.t<0.35)blkPozUygula(v,blkKarisim(v,POSE.vurusTakip,null,0,1,D.sol),dt,10);else{v.is='donus';D.vuran=null;}}
  /* toplar: uçan, seken ve yuvarlanan; şutun topu kale çizgisinde karara bağlanır */
  for(const U of D.toplar){const x0=U.x;blkTopUcur(U,dt);
    if(U!==D.top||D.evre!=='ucus'&&D.evre!=='bekle')continue;
    if(!U.kurtar&&D.kurtar&&x0<Y.cizgi-1.1&&U.x>=Y.cizgi-1.1){U.kurtar=true;B.olcu.sut.kurtaris++;
      if(Math.abs(U.z)<1.4&&U.y<1.7){U.elde=true;U.vx=U.vy=U.vz=0;}
      else{U.vx=-3-2*blkPuruz(D.n,5);U.vz=(U.z>0?1:-1)*(3+2*blkPuruz(D.n,6));U.vy=2.5;}
      blkSutTepki(D,'kurtaris');}
    if(!U.kurtar&&!U.cizgi&&x0<Y.cizgi&&U.x>=Y.cizgi){U.cizgi=true;
      if(Math.abs(U.z)<Y.direk&&U.y<Y.ust){U.ag=true;B.olcu.sut.gol++;blkSutTepki(D,'gol');}else{B.olcu.sut.iska++;blkSutTepki(D,'iska');}}}
  if(D.top&&D.top.elde&&K){const U=D.top;U.x=K.x-0.45;U.z=K.z;U.y=KD.evre==='ucus'||KD.evre==='yer'?0.25:0.85;}
  if(D.evre==='ucus'&&D.t>1.1){D.evre='bekle';D.t=0;}
  if(D.evre==='bekle'&&D.t>0.6&&KD.evre==='hazir'&&(!D.top.elde||KD.atti)&&B.zaman-KD.atis>0.5){KD.atti=false;D.evre='hazirlik';D.t=0;}
  for(const U of D.toplar)B.topKoy(U.m,U.x,U.y,U.z);
  /* kaleci: hazır (set; yan adımla ortaya) → tepki → ortaya gelen topu tutar ya da uzanır (itiş, uçuş, yerde, kalkış); tutulan topu sıraya yuvarlar */
  if(!K)return;
  if(dt>0)KD.t+=dt;
  const yaw=-Math.PI/2,kx=Y.cizgi-1.3;let P,rz=0,y=0;
  if(KD.evre==='hazir'){
    const dz=-K.z,dx=kx-K.x,hareket=Math.abs(dz)>0.05||Math.abs(dx)>0.05;
    if(dt>0){K.z+=Math.sign(dz)*Math.min(Math.abs(dz),1.9*dt);K.x+=Math.sign(dx)*Math.min(Math.abs(dx),1.9*dt);}
    blkDon(K,yaw,dt,5);
    if(B.zaman-KD.atis<0.45)P=blkKarisim(K,POSE.elleAtis,null,0,1);
    else{P=blkKarisim(K,POSE.ready,null,0,1);if(hareket)P.dy-=0.05*Math.abs(Math.sin(B.zaman*11));}
    if(D.top&&D.top.elde&&!KD.atti&&KD.t>0.7){KD.atti=true;KD.atis=B.zaman;const U=D.top;U.elde=false;U.dur=false;U.ag=false;
      U.x=K.x-0.6;U.y=0.25;U.vx=-6.5;U.vz=(blkSiraYer(0)[1]-U.z)/2.4;U.vy=0.6;}}
  else if(KD.evre==='tepki'){P=blkKarisim(K,POSE.ready,null,0,1.15);if(KD.t>=KD.tepki){KD.evre=Math.abs(KD.hz)<0.9?'orta':'ucus';KD.t=0;KD.z0=K.z;}}
  else if(KD.evre==='orta'){P=blkKarisim(K,KD.hy>1.4?POSE.tac:POSE.tutus,null,0,1);if(KD.t>0.9){KD.evre='hazir';KD.t=0;}}
  else{/* uzanış: itiş 0,12 sn, uçuş 0,32 sn, yerde 0,6 sn, kalkış 0,65 sn */
    const itis=0.12,ucus=0.32,yer=0.6,kalk=0.65,t=KD.t;let d=1;
    if(t<itis){d=0.15*t/itis;P=blkKarisim(K,POSE.ready,null,0,1.2);}
    else if(t<itis+ucus){const u=(t-itis)/ucus;d=0.15+0.85*blkYumusak(u);y=Math.sin(Math.PI*Math.min(1,u*1.15))*0.45*(1-0.4*u)+0.12*u;rz=1.35*blkYumusak(u);P=blkKarisim(K,POSE.ready,POSE.dive,blkYumusak(u*1.6),1);}
    else if(t<itis+ucus+yer){KD.evre='yer';y=0.12;rz=1.45;P=blkKarisim(K,POSE.dive,POSE.yerde,blkYumusak((t-itis-ucus)/0.3),1);}
    else if(t<itis+ucus+yer+kalk){const u=(t-itis-ucus-yer)/kalk;y=0.12*(1-u);rz=1.45*(1-blkYumusak(u));P=blkKarisim(K,POSE.yerde,POSE.ready,blkYumusak(u),1);}
    else{KD.evre='hazir';KD.t=0;P=blkKarisim(K,POSE.ready,null,0,1);}
    if(KD.evre!=='hazir'){K.x=kx;K.z=KD.z0+(KD.hz*0.85-KD.z0)*d;K.yaw=yaw;}
    if(KD.evre==='yer'&&t>=itis+ucus+yer)KD.evre='ucus';}
  blkPozUygula(K,P,dt,16);B.yerlestir(K);K.m.root.rotation.z=-(KD.hz>0?1:-1)*rz;K.m.root.position.y+=y;
}
/* vuranın tepkisi (sıraya dönerken bir an durur): gol sevinci, ıskada eller başta, kurtarışta eller belde (bazen) */
function blkSutTepki(D,sonuc){
  const B=BALKON,v=D.sira[D.sira.length-1],r=blkPuruz(D.n*41+9,101),AP=typeof ANM_POZ!=='undefined'?ANM_POZ:null;if(!v)return;
  const poz=sonuc==='gol'&&r<0.45?POSE.yumruk:sonuc==='iska'&&r<0.55&&AP?AP.basEl:sonuc==='kurtaris'&&r<0.35&&AP?AP.belEl:null;
  if(poz)v.tepki={poz,son:B.zaman+0.9+0.4*r};
}

/* ---- kenardaki kaleciler: kaleci antrenörü (ekip[1]) topu atar; sıradaki kaleci tutar ya da yana uzanıp çeler, topu geri atar; kaleciler altı
   atışta bir yer değiştirir ---- */
function blkKenar(dt){
  const B=BALKON,E=B.ekip[1],L=B.kenar,Kx=45.5,Kz=10,Cx=40.2,Cz=10;
  if(!L.length){if(blkGit(E,33,-11,1.4,dt)){blkBakYon(E,40,0,dt,2);blkBekle(E,dt);}B.yerlestir(E);return;}
  const D=B.kenarD||(B.kenarD={evre:'tut',t:0,n:0,sira:0,top:{x:Cx+0.45,y:1.1,z:Cz}}),T=D.top;
  if(dt>0)D.t+=dt;
  const aktif=L[D.sira%L.length],r1=blkPuruz(D.n*7+1,33),yan=(r1*2-1)*1.7,ust=0.4+1.4*blkPuruz(D.n*11+3,35),uzan=Math.abs(yan)>1.0;
  L.forEach((a,i)=>{if(a===aktif)return;a.m.root.rotation.z=0;if(blkGit(a,Kx+1.8,Kz+2.4+i*0.8,1.5,dt)){blkBakYon(a,Cx,Cz,dt,3);blkBekle(a,dt);}B.yerlestir(a);});
  const eVar=blkGit(E,Cx,Cz,1.5,dt);
  let kP=null,eP=null,rz=0,kz=Kz;
  if(D.evre==='tut'){eP=POSE.tutus;T.x=E.x+0.45;T.z=E.z;T.y=1.1;if(D.t>0.8&&eVar){D.evre='at';D.t=0;}}
  else if(D.evre==='at'){eP=POSE.elleAtis;const u=clamp(D.t/0.8,0,1);T.x=E.x+0.45+(Kx-0.4-E.x-0.45)*u;T.z=E.z+(Kz+yan-E.z)*u;T.y=1.1+(ust-1.1)*u+Math.sin(Math.PI*u)*1.2;
    if(u>=1){D.evre='kurtar';D.t=0;}}
  else if(D.evre==='kurtar'){const u=clamp(D.t/0.9,0,1);
    if(uzan){rz=(yan>0?-1:1)*0.9*Math.sin(Math.PI*u);kz=Kz+yan*0.7*Math.sin(Math.PI*u);kP=u<0.6?POSE.dive:POSE.ready;}else kP=ust>1.4?POSE.tac:POSE.tutus;
    T.x=aktif.x-0.4;T.z=aktif.z;T.y=Math.max(0.3,ust*(1-u)+0.9*u);if(u>=1){D.evre='geri';D.t=0;}}
  else if(D.evre==='geri'){kP=POSE.elleAtis;const u=clamp(D.t/0.9,0,1);T.x=aktif.x-0.4+(E.x+0.45-aktif.x+0.4)*u;T.z=aktif.z+(E.z-aktif.z)*u;T.y=0.9+Math.sin(Math.PI*u)*1.4+0.2*u;
    if(u>=1){D.evre='tut';D.t=0;D.n++;if(D.n%6===0)D.sira++;}}
  const kVar=D.evre==='kurtar'||blkGit(aktif,Kx,kz,2.5,dt);
  if(kVar){if(D.evre==='kurtar'){aktif.x=Kx;aktif.z=kz;}blkBakYon(aktif,Cx,Cz,dt,5);blkPozUygula(aktif,blkKarisim(aktif,kP||POSE.ready,null,0,1),dt,14);}
  B.yerlestir(aktif);aktif.m.root.rotation.z=rz;
  if(eVar){blkBakYon(E,aktif.x,aktif.z,dt,4);if(eP)blkPozUygula(E,blkKarisim(E,eP,null,0,1),dt,10);else blkBekle(E,dt);}
  B.yerlestir(E);B.topKoy(B.top.kenar,T.x,Math.max(0,T.y-0.14),T.z);
}

/* ---- teknik ekip: hoca gruplar arasında yürür, durur, eller belde izler, arada işaret eder; gol olunca yakınsa alkışlar. Yardımcı kendi yerinde ---- */
const BLK_HOCA_YERLERI=[[20,7],[33,-8],[-12,-20],[27,21],[8,2]];
function blkEkip(dt){
  const B=BALKON,D=B.ekipD||(B.ekipD={hedef:0,son:B.zaman,alkis:-9,gol:0}),H=B.ekip[0],Y=B.ekip[2],gol=B.olcu.sut.gol;
  if(B.zaman-D.son>14+8*blkPuruz(D.hedef*5+3,77)){D.son=B.zaman;D.hedef=(D.hedef+1+Math.floor(blkPuruz(D.hedef+9,79)*(BLK_HOCA_YERLERI.length-1)))%BLK_HOCA_YERLERI.length;}
  if(gol>D.gol){D.gol=gol;D.alkis=B.zaman+1.2;}
  const [hx,hz]=BLK_HOCA_YERLERI[D.hedef],gx=B.rondo.length>2?BLK_RONDO.x:40,gz=B.rondo.length>2?BLK_RONDO.z:0;
  if(blkGit(H,hx,hz,1.3,dt)){blkBakYon(H,gx,gz,dt,2.5);
    if(B.zaman<D.alkis&&Math.hypot(H.x-40,H.z)<30)blkPozUygula(H,blkKarisim(H,POSE.alkis,null,0,1),dt,10);
    else if(Math.sin(B.zaman*0.43+H.kim.faz)>0.86)blkPozUygula(H,blkKarisim(H,POSE.isaret,null,0,1),dt,7);
    else blkBekle(H,dt);}
  B.yerlestir(H);
  blkBakYon(Y,gx,gz,dt,2);
  if(B.zaman<D.alkis+0.3&&Math.hypot(Y.x-40,Y.z)<30)blkPozUygula(Y,blkKarisim(Y,POSE.alkis,null,0,1),dt,10);else blkBekle(Y,dt);
  B.yerlestir(Y);
}

function balkonKare(dt){
  if(!BALKON.antrenman)return;
  const B=BALKON;B.zaman+=dt;if(!B.olcu)blkCalismaKur();
  /* 1. ısınma koşusu: grup yuvarlatılmış yolda; önde gidenin hızı sabit, her koşucu kendi yerini tutmaya çalışır — hızlı ve dayanıklı olan
     önde, yavaş olan biraz geride; ikişerli şerit, aralıklar zamanla nefes alır; kadans hızdan ve adım boyundan */
  {const yavas=B.tur==='toparlanma',v0=yavas?1.7:3.1,D=B.kosuD;D.lider+=v0*dt;
   B.kosu.forEach((a,i)=>{
     const oz=(a.o&&a.o.oz)||[],k=a.kim,geri=clamp((62-((oz[0]||60)+(oz[9]||60))/2)/120,0,0.22)+k.geri;
     const hedef=D.lider-i*2.3*(1+geri)-0.8*Math.sin(B.zaman*0.11*k.tempo+k.faz);
     if(a.s===undefined)a.s=hedef;
     const v=clamp(v0+(hedef-a.s)*0.7,v0*0.75,v0*1.3);if(dt>0)a.s+=v*dt;
     blkYolNokta(a.s,BLK_YN);const yan=(i%2?0.6:-0.6)+0.3*Math.sin(B.zaman*0.07*k.tempo+k.faz);
     a.x=BLK_YN.x-BLK_YN.tz*yan;a.z=BLK_YN.z+BLK_YN.tx*yan;blkDon(a,Math.atan2(BLK_YN.tx,BLK_YN.tz),dt);
     blkKosuPoz(a,v,dt);B.yerlestir(a);});}
  /* esneme: herkes kendi sırasıyla ve temposuyla (hareketin %75'inde durur, kalanında öbürüne geçer); yarısı aynalı; yer ve yön kişiye göre */
  {const E=BLK_ESNEME,S=[POSE.esneme1,E.B,POSE.esneme2,BLK_DURUS];B.esneme.forEach((a,i)=>{const k=a.kim;
     if(a.is!=='esneme'){a.x=E.yer.x+(i%5)*E.yer.ara+1.6*(k.adim-1.01);a.z=E.yer.z+Math.floor(i/5)*E.yer.ara+1.2*(k.kol-1);a.yaw=Math.PI/2+6*k.egim;a.is='esneme';}
     const t2=B.zaman*k.tempo/E.sure+k.faz/6.283*S.length,j=Math.floor(t2)%S.length,f=t2-Math.floor(t2);
     blkPozUygula(a,blkKarisim(a,S[j],S[(j+1)%S.length],blkYumusak((f-0.75)/0.25),1,k.faz>3.14),dt,6);B.yerlestir(a);});}
  /* ayrı koşu: çizgi boyunca gidip gelir, uçlarda yavaşlar, durur ve döner; fizyoterapist arkasında yürür */
  {const R=BLK_AYRI,uz=R.x[1]-R.x[0],git=uz/R.hiz,dur=1.4;B.ayri.forEach((a,i)=>{
     if(a.p===undefined)a.p=i*3;if(dt>0)a.p+=dt;
     const q=a.p%(2*(git+dur)),ileri=q<git+dur,u=ileri?q:q-git-dur,m=clamp(u/git,0,1),s=uz*(1-Math.cos(Math.PI*m))/2;
     const x=ileri?R.x[0]+s:R.x[1]-s,v=dt>0?Math.abs(x-a.x)/dt:0;a.x=x;a.z=R.z+i*1.2;
     if(u<git)blkDon(a,ileri?Math.PI/2:-Math.PI/2,dt,3);else blkDon(a,ileri?-Math.PI/2:Math.PI/2,dt,2.2);
     if(v>0.3&&u<git)blkKosuPoz(a,Math.min(v,R.hiz*1.6),dt);else blkBekle(a,dt);B.yerlestir(a);});
   const f=B.ekip[3];if(B.ayri.length){const a=B.ayri[0],hx=a.x-Math.sin(a.yaw)*1.6,hz=a.z-1.4;
     if(blkGit(f,hx,hz,2.2,dt)){blkBakYon(f,a.x,a.z,dt,3);blkBekle(f,dt);}B.yerlestir(f);}}
  /* kenardaki kaleciler kaleci antrenörüyle */
  blkKenar(dt);
  /* 2. pas çemberi */
  if(B.rondo.length>2){blkRondo(dt);for(const a of B.rondo)B.yerlestir(a);}
  /* 3. şut çalışması */
  if(B.sut.length){blkSut(dt);for(const a of B.sut)B.yerlestir(a);}
  /* teknik ekip */
  blkEkip(dt);
}
function balkonIskele(v){if(BALKON.iskele)BALKON.iskele.visible=!!v;}
/* RK2 (2026-10-31; TEST): masadan pencerede uzak figürler iki üç pikseldir ve titremenin deseninde kıpırdar: masadayken forma renginde düz (gölgesiz)
   siluet ve isteğe bağlı büyütme (STIL.oda.pencere.siluet, olcek). js/oda.js odaYerAyarla ve odaYuru çağırır */
const BLK_SILUET=new Map();
function blkSiluetMat(renk){let m=BLK_SILUET.get(renk);if(!m){m=new THREE.MeshBasicMaterial({color:new THREE.Color(renk).multiplyScalar(0.62),skinning:true,fog:false});BLK_SILUET.set(renk,m);}return m;}
function blkUzakUygula(a){
  const u=!!BALKON.uzak,M=a.m.mesh;
  if(u){if(!a.matAsil)a.matAsil=M.material;M.material=blkSiluetMat(a.renk);}else if(a.matAsil)M.material=a.matAsil;
  const k=u?STIL.oda.pencere.olcek||1:1,o=a.olcek||1;if(k!==o){a.m.root.scale.multiplyScalar(k/o);a.g.scale.multiplyScalar(k/o);a.olcek=k;}
}
function balkonUzak(acik){const v=!!acik&&!!STIL.oda.pencere.siluet;if(!!BALKON.uzak===v)return;BALKON.uzak=v;for(const a of BALKON.aktorler)blkUzakUygula(a);}
if(typeof ODA!=='undefined'&&ODA.yer==='masa')balkonUzak(true);
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
