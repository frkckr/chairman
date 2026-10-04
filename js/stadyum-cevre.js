/* ============ Chairman — stadın çevresi: her cephe ayrı (yol haritası N8, kullanıcı kararı 2026-10-04) ============
   Görüntü katmanı; kural içermez. statKur (js/stadyum.js) çağırır: cevreKur(kok, {mac, gunduz}). Tarif STAT.cevre ve STAT.kapilar
   (js/stadyum-tarifleri.js), renkler STIL.cevre. Kasaba stadı: yüksek bina zorunlu değil, ufukta boşluk kalmaz; örnek, bir kale arkası kaya
   yamaca yaslanan Braga stadı. Kulübün şehri açık karar olduğundan belirli bir şehri gösteren yapı yoktur.
     yamac        doğu kale arkası: setin hemen arkasında basamaklı kaya yüzü, çıkıntılarda çalı, üstteki düzlükte çamlar
     evler        karşı uzun kenar (başkanın en çok baktığı cephe): sokak ve lambalar, bahçe duvarlı bir-iki katlı kiremit çatılı evler, kavaklar
     kapi         batı kale arkası: çevre duvarında yazılı stat kapısı ve iki gişe, sokak ve lambalar, park etmiş araçlar, tenteli dükkânlar
     kulupBinasi  ana tribünün arkası: locayı taşıyan kulüp binası (locanın önünde bina tribün tepesini geçmez, başkanın bakışı değişmez),
                  armalı giriş, otopark, bahçe duvarı, arka sokak ve evler. Yalnız maç kurulumunda: balkon ve pencere kurulumunda stat 180°
                  döner, bina odanın içine düşer (loca ile aynı kural)
   Ortak: stadı çevreleyen iki sıra tepe (her yönde ufku kapatır), iç zemin, kesintisiz çevre duvarı (doğuda kaya dibinde tel örgü), setlerin
   arka duvarı, tarlalar. Tribün girişleri ve karşılarındaki çevre kapıları STAT.kapilar'dan; KAPILAR seyircinin yolunu verir (N9).
   Gündüz (balkon, pencere) yapılar Lambert ile aydınlanır; gece (maç) ışıksız koyu renklerdir, yüzeyin yönüne göre hafif gölgelenir,
   pencerelerin bir kısmı ve sokak lambaları yanar (yeni ışık kaynağı yok). Yerleşim ve renk h2 karmasıyla seçilir: rnd() çekilmez, maçın
   ve denemelerin rastlantısı değişmez. Aynı türden parçalar tek geometride birleşir (geoBirlestir): yapılar, yanık pencereler, tepeler ve
   lamba ışıkları birer çizimdir. */
/* KAPILAR: seyircinin girdiği yerler (stat koordinatı; maç sahnesinde dünya). {tribun, u: tribün boyunca metre, kapi: [x, z] çevre kapısı,
   uzak: [x, z] seyircinin sokaktan geldiği yer, dis: [x, z] kapının dışı, ic: [x, y, z] tribünün arka kapısının (setlerde arka duvardaki açıklığın basamak dibinin) önü, giris: [x, y, z]
   tribüne çıkılan yer (giriş ağzının ağzı; setlerde basamağın tepesi), gizli: ic → giris arası tribünün içinden geçer (görünmez)}.
   Yalnız maç kurulumunda doldurulur; seyircinin yolu (N9, js/seyirci.js) buradan kurulur */
const KAPILAR=[];
function cevreKur(kok,sec){
  const CV=STAT.cevre;if(!CV)return;
  const mac=!!sec.mac,gunduz=!!sec.gunduz,R=STIL.cevre[gunduz?'gunduz':'gece'],Z0=-0.3;   /* Z0: dış zeminin yüksekliği */
  const P=[],ISIK=[],LAMBA=[],tmp=new THREE.Object3D(),C3=new THREE.Color();
  const rk=(h,k)=>{C3.set(h);if(k!==undefined)C3.multiplyScalar(k);return[C3.r,C3.g,C3.b];};
  const sec1=(L,a,b)=>L[Math.floor(h2(a,b)*L.length)%L.length];
  const mat=(x,y,z,ry)=>{tmp.position.set(x,y,z);tmp.rotation.set(0,ry||0,0);tmp.updateMatrix();return tmp.matrix.clone();};
  const kutu=(w,h,d,x,y,z,ry,r,L)=>(L||P).push({g:new THREE.BoxGeometry(w,h,d),m:mat(x,y,z,ry),renk:r});
  /* yerel çerçevede parça: M yapının matrisi, (x,y,z,ry) yapının içinde */
  const ykutu=(M,w,h,d,x,y,z,ry,r,L)=>(L||P).push({g:new THREE.BoxGeometry(w,h,d),m:M.clone().multiply(mat(x,y,z,ry)),renk:r});
  const yduz=(M,w,h,x,y,z,ry,r,L)=>(L||P).push({g:new THREE.PlaneGeometry(w,h),m:M.clone().multiply(mat(x,y,z,ry)),renk:r});
  /* üçgen kesitli çatı: x boyunca w, z boyunca d, mahya h; tabanı y=0 */
  const catiGeo=(w,d,h)=>{const a=w/2,b=d/2,g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute([-a,0,b,a,0,b,a,h,0,-a,0,b,a,h,0,-a,h,0, a,0,-b,-a,0,-b,-a,h,0,a,0,-b,-a,h,0,a,h,0,
      -a,0,-b,-a,0,b,-a,h,0, a,0,b,a,0,-b,a,h,0],3));g.computeVertexNormals();return g;};
  /* gece pencere: oran kadarı yanar (ayrı, ışıksız parlak çizim); gündüz cam rengi */
  const pencere=(M,w,h,x,y,z,ry,anahtar,isikRenk,koyuRenk,oran)=>{
    const yan=!gunduz&&h2(anahtar,7)<(oran===undefined?R.pencereOrani:oran);
    yduz(M,w,h,x,y,z,ry,yan?rk(isikRenk||R.pencereIsik):rk(koyuRenk||R.pencere),yan?ISIK:P);};
  const W={bati:-(KALE_MESAFE+7),kuzey:YAN_MESAFE+10,guney:-(YAN_MESAFE+11),dogu:KALE_MESAFE+5.5},DH=CV.duvar||2.4;
  const cephe=t=>CV.cepheler.find(c=>c.tip===t),kurulan=[];   /* kurulan: kurulan cephelerin tipleri (kok.userData.cevre; akış denemesi okur) */

  /* ---- ev: ön yüzü yerel +z'de; kat sayısı, kiremit çatı ya da düz dam ---- */
  function ev(x,z,ry,w,d,kat,i,o={}){
    const H=kat*(o.katBoy||3),M=mat(x,Z0,z,ry),duvar=rk(o.renk||sec1(R.duvar,i,3),0.92+0.16*h2(i,5));
    ykutu(M,w,H,d,0,H/2,0,0,duvar);
    if(o.dam){for(const [ww,dd,xx,zz] of[[w,0.25,0,d/2],[w,0.25,0,-d/2],[0.25,d,w/2,0],[0.25,d,-w/2,0]])ykutu(M,ww,0.45,dd,xx,H+0.22,zz,0,rk(R.duvarUst));}
    else{P.push({g:catiGeo(w+0.5,d+0.7,1.3+h2(i,9)*0.9),m:M.clone().multiply(mat(0,H,0,0)),renk:rk(sec1(R.kiremit,i,11),0.9+0.2*h2(i,13))});
      if(h2(i,15)<0.3)ykutu(M,0.55,1.6,0.55,(h2(i,17)-0.5)*w*0.6,H+1.1,(h2(i,19)-0.5)*d*0.3,0,rk(R.duvarUst));}
    const kb=o.katBoy||3,n=Math.max(1,Math.floor((w-1)/2.6));
    for(let f=0;f<kat;f++)for(const [yz,yr,yuz] of[[d/2+0.03,0,0],[-d/2-0.03,Math.PI,1]])for(let j=0;j<n;j++){
      const px=-w/2+(j+0.5)*w/n;
      if(f===0&&yuz===0&&j===Math.floor(n/2)&&!o.dukkan){yduz(M,1.0,2.1,px,1.05,yz,yr,rk(R.kapi));continue;}
      if(o.dukkan&&f===0&&yuz===0)continue;
      pencere(M,0.95,1.2,px,f*kb+1.75,yz,yr,i*97+f*13+j*3+yuz);}
    if(d>8)for(let f=0;f<kat;f++)for(const sx of[-1,1])pencere(M,0.9,1.2,sx*(w/2+0.03),f*kb+1.75,0,sx*Math.PI/2,i*89+f*5+(sx>0?1:2));
    if(o.dukkan){/* dükkân: zemin katta vitrin ve tente */
      pencere(M,w-1.4,2.1,0,1.3,d/2+0.04,0,i*71+5,R.vitrinIsik,R.vitrin,0.75);
      ykutu(M,w-0.6,0.14,1.5,0,2.75,d/2+0.75,0,rk(sec1(R.tente,i,23)));}
    return M;
  }
  /* bir eksen boyunca ev sırası. eksen 'x': z=sabit, 'z': x=sabit; ry: ön yüzün yönü; bos: atlanacak aralıklar [bas, son] */
  function evSirasi(o){
    let s=o.bas,i=o.tohum||0;
    while(s<o.son){i++;
      const w=(o.en||[8,13])[0]+h2(i,31)*((o.en||[8,13])[1]-(o.en||[8,13])[0]),ara=(o.ara||[1.5,4.5])[0]+h2(i,33)*((o.ara||[1.5,4.5])[1]-(o.ara||[1.5,4.5])[0]);
      const m=s+w/2;
      if(s+w>o.son)break;
      const atla=(o.bos||[]).some(([a,b])=>s+w>a&&s<b)||h2(i,35)<(o.seyrek||0);
      if(!atla){
        const d=(o.derin||[7,10])[0]+h2(i,37)*((o.derin||[7,10])[1]-(o.derin||[7,10])[0]),kay=(h2(i,39)-0.5)*(o.kayma||1.5);
        const kat=o.kat?o.kat(i):(h2(i,41)<0.55?1:2),c=o.eksen==='x'?[m,o.sabit+kay]:[o.sabit+kay,m];
        ev(c[0],c[1],o.ry+(h2(i,43)-0.5)*(o.egik||0.08),w,d,kat,i,{dukkan:o.dukkan,dam:o.dam||kat>2,katBoy:o.katBoy});
        /* önde bahçe duvarı */
        if(o.bahce){const on=d/2+2.4,x=o.eksen==='x'?m:o.sabit+kay+Math.sin(o.ry)*on,z=o.eksen==='x'?o.sabit+kay+Math.cos(o.ry)*on:m;
          kutu(o.eksen==='x'?w+ara:0.25,0.9,o.eksen==='x'?0.25:w+ara,x,Z0+0.45,z,0,rk(R.tasDuvar,0.9+0.2*h2(i,45)));}
      }
      /* aralıkta ağaç: kavak ya da yuvarlak */
      if(ara>2.5&&h2(i,47)<(o.agac===undefined?0.6:o.agac)){const t=s+w+ara/2,c=o.eksen==='x'?[t,o.sabit+(h2(i,49)-0.5)*4]:[o.sabit+(h2(i,49)-0.5)*4,t];agac(c[0],c[1],i,h2(i,51)<0.6?'kavak':'yuvarlak');}
      s+=w+ara;
    }
  }
  /* ağaçlar: kavak (ince uzun), çam (iki koni), yuvarlak (taç) */
  function agac(x,z,i,tur,y){
    const y0=y===undefined?Z0:y,gv=rk(R.govde);
    if(tur==='kavak'){const h=10+h2(i,61)*6,r=0.9+h2(i,63)*0.5;kutu(0.3,1.4,0.3,x,y0+0.7,z,0,gv);P.push({g:new THREE.ConeGeometry(r,h,6),m:mat(x,y0+1.2+h/2,z,h2(i,65)),renk:rk(R.kavak,0.85+0.3*h2(i,67))});}
    else if(tur==='cam'){const h=5+h2(i,61)*4,r=1.5+h2(i,63)*1.1,c=rk(R.cam,0.82+0.32*h2(i,67));kutu(0.35,1.6,0.35,x,y0+0.8,z,0,gv);
      P.push({g:new THREE.ConeGeometry(r,h*0.65,7),m:mat(x,y0+1.4+h*0.32,z,h2(i,65)),renk:c});P.push({g:new THREE.ConeGeometry(r*0.68,h*0.55,7),m:mat(x,y0+1.4+h*0.7,z,h2(i,69)),renk:c});}
    else{const r=1.6+h2(i,61)*1.4;kutu(0.35,2,0.35,x,y0+1,z,0,gv);P.push({g:new THREE.IcosahedronGeometry(r,0),m:mat(x,y0+2+r*0.8,z,h2(i,65)*3),renk:rk(R.cali,0.8+0.3*h2(i,67))});}
  }
  /* sokak lambası: direk, kol, baş; gece başta ışık noktası. kol: başın direğe göre yönü [dx, dz] */
  function lamba(x,z,kol){
    kutu(0.16,6,0.16,x,Z0+3,z,0,rk(R.direk));kutu(Math.abs(kol[0])>0?1.3:0.1,0.1,Math.abs(kol[1])>0?1.3:0.1,x+kol[0]*0.6,Z0+5.95,z+kol[1]*0.6,0,rk(R.direk));
    kutu(0.55,0.18,0.55,x+kol[0]*1.2,Z0+5.85,z+kol[1]*1.2,0,rk(R.lamba));
    if(!gunduz)LAMBA.push(x+kol[0]*1.2,Z0+5.6,z+kol[1]*1.2);}
  /* araç: gövde ve kabin; boyu ry yönünde */
  function arac(x,z,ry,i){const c=rk(sec1(R.arac,i,81),0.9+0.2*h2(i,83)),M=mat(x,Z0,z,ry);
    ykutu(M,1.8,0.85,4.2,0,0.62,0,0,c);ykutu(M,1.6,0.7,2.2,0,1.38,-0.2,0,c);yduz(M,1.4,0.5,0,1.42,0.92,0,rk(R.pencere));}
  /* yer şeridi: asfalt, kaldırım, tarla (dış zeminin 10 cm üstünde: gündüz kamerasında da titremesin) */
  const serit=(x0,z0,x1,z1,r,y)=>kutu(Math.abs(x1-x0),0.08,Math.abs(z1-z0),(x0+x1)/2,(y===undefined?-0.24:y),(z0+z1)/2,0,r);
  /* çevre duvarı: eksene paralel; kapılar boyuna koordinatta merkezleriyle. ana kapı yazılı ve geniş */
  function duvar(x0,z0,x1,z1,kapilar){
    const yatay=z0===z1,a=Math.min(yatay?x0:z0,yatay?x1:z1),b=Math.max(yatay?x0:z0,yatay?x1:z1),renk=rk(R.cevreDuvar),ust=rk(R.duvarUst);
    const parca=(s,e)=>{if(e-s<0.2)return;const m=(s+e)/2,L=e-s;
      if(yatay){kutu(L,DH,0.35,m,Z0+DH/2,z0,0,renk);kutu(L,0.14,0.5,m,Z0+DH+0.07,z0,0,ust);}else{kutu(0.35,DH,L,x0,Z0+DH/2,m,0,renk);kutu(0.5,0.14,L,x0,Z0+DH+0.07,m,0,ust);}};
    let s=a;
    for(const k of kapilar.filter(k=>k.u>a&&k.u<b).sort((p,q)=>p.u-q.u)){
      const g=k.en||4,e=k.u-g/2;parca(s,e);
      for(const sx of[-1,1]){const u=k.u+sx*(g/2+0.35),px=yatay?u:x0,pz=yatay?z0:u;kutu(0.7,DH+0.9,0.7,px,Z0+(DH+0.9)/2,pz,0,ust);
        /* açık kanat: menteşeden içeri doğru dönmüş demir kapı */
        const ka=g/2-0.1,ac=1.15,hu=k.u+sx*g/2,hx=yatay?hu:x0,hz=yatay?z0:hu;
        const dx=yatay?-sx*Math.cos(ac):k.ic*Math.sin(ac),dz=yatay?k.ic*Math.sin(ac):-sx*Math.cos(ac);
        kutu(ka,2.1,0.06,hx+dx*ka/2,Z0+1.15,hz+dz*ka/2,Math.atan2(-dz,dx),rk(R.direk));}
      s=k.u+g/2;}
    parca(s,b);
  }
  /* piksel yazılı levha (stat kapısı, kulüp binası): düzlem; gündüz ışıklı, gece ışıksız */
  function levha(metin,en,x,y,z,ry,zemin,yazi){
    const cv=mk(textW(metin,1)+8,11),g=cv.getContext('2d');g.fillStyle=zemin;g.fillRect(0,0,cv.width,11);ctxText(g,metin,4,2,yazi,1);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(en,en*11/cv.width),(gunduz?LAM:BAS)({map:tx(cv,'n')}));m.position.set(x,y,z);m.rotation.y=ry;kok.add(m);}
  /* tel örgü parçası (doğuda kaya dibi): saydam düzlem ve direkler */
  function telOrgu(x,z0,z1){const L=z1-z0;if(L<0.5)return;
    const f=new THREE.Mesh(new THREE.PlaneGeometry(L,2.6),LAM({map:tx(FENCE_CV,'m',[L/0.4,2.6/0.4]),transparent:true,depthWrite:false,side:THREE.DoubleSide}));
    f.position.set(x,Z0+1.3,(z0+z1)/2);f.rotation.y=Math.PI/2;kok.add(f);
    for(let z=z0;z<=z1+0.01;z+=4)kutu(0.08,2.7,0.08,x,Z0+1.35,z,0,rk(R.direk));kutu(0.06,0.06,L,x,Z0+2.6,(z0+z1)/2,0,rk(R.direk));}
  /* tribünün yerel noktası → stat koordinatı (u: tribün boyunca, f: sahadan geriye doğru negatif) */
  const yerel=(t,u,f)=>{const Y=tribunYeri(t.yer),c=Math.cos(Y.rot),s=Math.sin(Y.rot);return[Y.pos[0]+f*s+u*c,Y.pos[1]+f*c-u*s];};

  /* ---- iç zemin: çevre duvarının içi (saha düzleminin altında); dış zemin yalnız duvarın dışında görünür ---- */
  kutu(W.dogu-W.bati,0.1,W.kuzey-W.guney,(W.dogu+W.bati)/2,-0.12,(W.kuzey+W.guney)/2,0,rk(R.ic));

  /* ---- setlerin arka duvarı (set tek yüzlü eğimli düzlemdir; arkadan bakınca altı görünmesin) ---- */
  /* N9: girişin olduğu yerde duvarda ~2,4 m açıklık; dışında setin tepesine çıkan üç basamak */
  for(const t of STAT.tribunler)if(t.tip==='set'){const O=tribunOlcu(t),Y=tribunYeri(t.yer),L=t.uzunluk,H=O.y1+0.35,b=rk(R.cevreDuvar);
    const ac=(STAT.kapilar||[]).filter(k=>k.tribun===t.yer).map(k=>k.u*L).sort((a,c)=>a-c);let s=-L/2;
    const parca=(a,c)=>{if(c-a<0.1)return;const [x,z]=yerel(t,(a+c)/2,-O.D-0.2);kutu(c-a,H,0.4,x,H/2-0.05,z,Y.rot,b);};
    for(const u of ac){parca(s,u-1.2);s=u+1.2;
      for(let i=0;i<3;i++){const h=O.y1*(i+1)/3,[x,z]=yerel(t,u,-O.D-1.45+i*0.45);kutu(2.3,h+0.05,0.46,x,h/2-0.05,z,Y.rot,rk(R.duvarUst));}}
    parca(s,L/2);}

  /* ---- tribün girişleri ve karşılarındaki çevre kapıları ---- */
  const kapi={bati:[],kuzey:[],guney:[],dogu:[]};
  for(const k of STAT.kapilar||[]){
    const t=STAT.tribunler.find(x=>x.yer===k.tribun);if(!t)continue;
    const O=tribunOlcu(t),Y=tribunYeri(t.yer),u=k.u*t.uzunluk,b=rk(R.cevreDuvar),koyu=rk(R.agiz);
    let giris,ic;
    /* basamak yüzeyinin yüksekliği: f derinliğindeki sıranın tabanı */
    const taban=f=>O.y0+Math.max(0,Math.min(t.sira-1,Math.floor(-f/O.dp)))*O.eg;
    if(t.tip==='set'){/* setin girişi: çevre kapısından basamakları çıkıp duvardaki açıklıktan setin tepesine */
      const g=yerel(t,u,-O.D+0.4),a=yerel(t,u,-O.D-1.9);giris=[g[0],O.y1,g[1]];ic=[a[0],0,a[1]];}
    else{/* arka duvarda kapı (dışarıdan) ve oturma tribününde basamakların üstünde giriş ağzı */
      const [dx,dz]=yerel(t,u,-O.D-0.63),M=mat(dx,0,dz,Y.rot);
      yduz(M,1.8,2.4,0,1.2,0,Math.PI,koyu);ykutu(M,0.25,2.7,0.3,-1.05,1.35,0.05,0,b);ykutu(M,0.25,2.7,0.3,1.05,1.35,0.05,0,b);ykutu(M,2.35,0.3,0.3,0,2.55,0.05,0,b);
      const a=yerel(t,u,-O.D-1.1);ic=[a[0],0,a[1]];
      if(t.tip==='oturma'){const [ax,az]=yerel(t,u,-O.D+0.85),A=mat(ax,0,az,Y.rot);
        ykutu(A,1.7,1.3,1.7,0,O.y1-0.4,0,0,koyu);ykutu(A,0.22,1.7,1.8,-0.96,O.y1-0.25,0,0,b);ykutu(A,0.22,1.7,1.8,0.96,O.y1-0.25,0,0,b);ykutu(A,2.15,0.25,1.8,0,O.y1+0.55,0,0,b);
        const g=yerel(t,u,-O.D+1.8);giris=[g[0],taban(-O.D+1.8),g[1]];}
      else{/* N9: ayakta tribünde de üst basamağın arkasında küçük giriş ağzı */
        const [ax,az]=yerel(t,u,-O.D+0.45),A=mat(ax,0,az,Y.rot);
        ykutu(A,1.4,1.15,0.9,0,O.y1+0.2,0,0,koyu);ykutu(A,0.2,1.45,1.0,-0.8,O.y1+0.32,0,0,b);ykutu(A,0.2,1.45,1.0,0.8,O.y1+0.32,0,0,b);ykutu(A,1.8,0.22,1.0,0,O.y1+0.95,0,0,b);
        const g=yerel(t,u,-O.D+1.0);giris=[g[0],taban(-O.D+1.0),g[1]];}}
    /* karşısındaki çevre kapısı */
    const [gx,gz]=yerel(t,u,-O.D-1);
    const yan=t.yer==='ana'?'guney':t.yer==='karsi'?'kuzey':t.yer==='kale1'?'bati':'dogu';
    const ana=t.yer==='kale1'&&cephe('kapi');
    const kp=yan==='bati'||yan==='dogu'?{u:gz,ic:yan==='bati'?1:-1,en:ana?7:4,kapi:[W[yan],gz]}:{u:gx,ic:yan==='kuzey'?-1:1,en:4,kapi:[gx,W[yan]]};
    kapi[yan].push(kp);
    if(mac){const dis=yan==='bati'?[W.bati-4,gz]:yan==='dogu'?[W.dogu+1.2,gz]:yan==='kuzey'?[gx,W.kuzey+3]:[gx,W.guney-3];
      /* uzak: seyircinin geldiği yer (sokaktan; güneyde arka sokak, kuzeyde ön sokak, batıda ana sokak, doğuda kaya dibi) */
      const uzak=yan==='bati'?[W.bati-8,gz+30]:yan==='dogu'?[W.dogu+1.2,-40]:yan==='kuzey'?[gx,W.kuzey+9]:[gx,W.guney-36];
      KAPILAR.push({tribun:t.yer,u,kapi:kp.kapi,uzak,dis,ic,giris,gizli:t.tip!=='set'});}
  }

  /* ---- çevre duvarı (kuzey, batı; güney yalnız maçta: kulüp binasının iki yanı) ve doğuda tel örgü ---- */
  duvar(W.bati,W.kuzey,W.dogu,W.kuzey,kapi.kuzey);
  duvar(W.bati,W.guney,W.bati,W.kuzey,kapi.bati);
  const binaX=12;
  if(mac&&cephe('kulupBinasi')){duvar(W.bati,W.guney,-binaX,W.guney,kapi.guney);duvar(binaX,W.guney,W.dogu,W.guney,kapi.guney);}
  {const g=kapi.dogu.map(k=>k.u).sort((a,b)=>a-b);let s=W.guney;for(const u of g){telOrgu(W.dogu,s,u-2);s=u+2;}telOrgu(W.dogu,s,W.kuzey);}

  /* ---- doğu: kaya yamaç (Braga esinli) ---- */
  {const c=cephe('yamac');
   if(c){kurulan.push(c.tip);const H=c.yukseklik||30,N=c.basamak||5,x0=W.dogu+1.5,adim=4.5,ZY=100,isik=R.yamacIsik||[1,1];
    for(let t=0;t<N;t++){const xt=x0+t*adim,yTop=(t+1)*H/N,k=gunduz?1:isik[0]+(isik[1]-isik[0])*t/Math.max(1,N-1);
      for(let z=-ZY,i=0;z<ZY;i++){const w=5+h2(i,t*7+1)*5,zc=z+w/2,uc=Math.min(1,Math.max(0.25,(ZY+6-Math.abs(zc))/30)),j=(h2(i,t*7+2)-0.5)*2.4;
        const top=yTop*uc+j,dp=adim+3,jx=(h2(i,t*7+3)-0.5)*1.4;
        kutu(dp,top-Z0,w+0.6,xt+dp/2+jx,(top+Z0)/2,zc,(h2(i,t*7+4)-0.5)*0.16,rk(sec1(R.kaya,i,t*7+5),k*(0.88+0.24*h2(i,t*7+6))));
        /* yüzde çıkıntılar: kesme taş düzgünlüğünü bozan küçük kaya kütleleri */
        for(let q=0;q<2;q++)if(h2(i,t*7+30+q)<0.7){const bw=1.4+h2(i,t*7+32+q)*2.6,bh=1.2+h2(i,t*7+34+q)*2.8,by=yTop*uc-(t?H/N:0)*h2(i,t*7+36+q)+bh*0.2;
          kutu(1.2+h2(i,t*7+38+q)*1.4,bh,bw,xt+jx-0.3,Math.max(Z0+bh/2,by),zc+(h2(i,t*7+40+q)-0.5)*(w-bw),(h2(i,t*7+42+q)-0.5)*0.6,rk(sec1(R.kaya,i+q,t*7+44),k*(0.75+0.35*h2(i,t*7+46+q))));}
        if(h2(i,t*7+8)<0.45){const r=0.5+h2(i,t*7+9)*0.7;P.push({g:new THREE.IcosahedronGeometry(r,0),m:mat(xt+jx+0.6+h2(i,t*7+10)*1.4,top+r*0.5,zc+(h2(i,t*7+11)-0.5)*w*0.6,h2(i,t*7+12)*3),renk:rk(R.cali,k*(0.8+0.3*h2(i,t*7+13)))});}
        if(h2(i,t*7+14)<0.1)agac(xt+jx+1.8,zc,i*31+t,'cam',top);
        z+=w;}}
    /* üstteki düzlük: hafif dalgalı, çam ormanı */
    const xp=x0+N*adim,yp=(x,z)=>H*Math.min(1,Math.max(0.25,(ZY+6-Math.abs(z))/30))+Math.floor(h2(Math.floor(x/12),Math.floor(z/12)+99)*3)*1.6;
    for(let x=xp;x<170;x+=12)for(let z=-ZY;z<ZY;z+=12){const y=yp(x,z+6);kutu(12.4,y-Z0,12.4,x+6,(y+Z0)/2,z+6,0,rk(sec1(R.tarla,Math.floor(x),Math.floor(z)),gunduz?0.8:1));}
    let n=0;for(let x=xp+2;x<168;x+=6.5)for(let z=-ZY+3;z<ZY-3;z+=6.5){n++;if(h2(n,201)>0.62)continue;const px=x+(h2(n,203)-0.5)*4,pz=z+(h2(n,205)-0.5)*4;agac(px,pz,n,'cam',yp(px,pz));}}}

  /* ---- karşı uzun kenar: sokak, lambalar, evler ve kavaklar ---- */
  {const c=cephe('evler');
   if(c){kurulan.push(c.tip);const z0=W.kuzey+0.2;
    serit(W.bati-13,z0+3,W.dogu+1.5,z0+10,rk(R.asfalt));serit(W.bati,z0,W.dogu,z0+3,rk(R.kaldirim),-0.18);serit(W.bati-11,z0+10,W.dogu,z0+12,rk(R.kaldirim),-0.18);
    for(let x=W.bati+8;x<W.dogu-4;x+=20)lamba(x,z0+2.4,[0,1]);
    for(let r=0;r<(c.sira||4);r++)evSirasi({eksen:'x',sabit:z0+18+r*17,bas:W.bati+2,son:W.dogu-4,ry:Math.PI,tohum:1000+r*100,bahce:r===0,seyrek:r*0.1,
      ara:r===0?[1.5,4]:[2,7],kat:i=>r>=2&&h2(i,53)<0.1?3:h2(i,41)<(r===0?0.45:0.6)?1:2,agac:0.55+r*0.1});}}

  /* ---- batı: stat kapısı, gişeler, sokak, araçlar, dükkânlar ---- */
  {const c=cephe('kapi');
   if(c){kurulan.push(c.tip);const x0=W.bati-0.2,ana=kapi.bati.find(k=>k.en>4);
    serit(x0-3,-150,x0,150,rk(R.kaldirim),-0.18);serit(x0-11,-150,x0-3,150,rk(R.asfalt));serit(x0-13,-150,x0-11,150,rk(R.kaldirim),-0.18);
    for(let z=-130;z<=130;z+=20)lamba(x0-0.6,z,[-1,0]);
    if(ana){/* yazılı kemer ve gişeler */
      kutu(0.6,1.1,ana.en+1.4,W.bati,Z0+DH+1.45,ana.u,0,rk(R.duvarUst));
      levha(STAT.ad,ana.en+0.6,W.bati-0.33,Z0+DH+1.45,ana.u,-Math.PI/2,R.tabela,R.tabelaYazi);
      for(const sz of[-1,1]){const M=mat(W.bati-2.2,Z0,ana.u+sz*(ana.en/2+2.4),-Math.PI/2);
        ykutu(M,2.4,2.6,2.2,0,1.3,0,0,rk(R.bina));ykutu(M,2.9,0.2,2.7,0,2.7,0,0,rk(R.duvarUst));pencere(M,1.4,0.9,0,1.5,1.12,0,700+sz,R.vitrinIsik,R.vitrin,0.9);}}
    for(let i=0,z=-118;z<120;i++,z+=20+h2(i,85)*6){if(h2(i,87)<0.35)continue;arac(x0-4.3,z,0,i);}
    for(let i=0,z=-110;z<115;i++,z+=30+h2(i,89)*10){if(h2(i,91)<0.5)continue;arac(x0-9.7,z,Math.PI,i+40);}
    const bos=[[W.kuzey-1,W.kuzey+13]].concat(mac?[[W.guney-46,W.guney-31]]:[]);
    evSirasi({eksen:'z',sabit:x0-19.5,bas:-150,son:150,ry:Math.PI/2,tohum:2000,dukkan:true,dam:true,kat:i=>2+(h2(i,55)<0.4?1:0),katBoy:3.2,en:[9,15],ara:[0.3,1.5],derin:[11,13],kayma:0.6,egik:0,agac:0,bos});
    for(let r=0;r<3;r++)evSirasi({eksen:'z',sabit:x0-40-r*17,bas:-150,son:150,ry:Math.PI/2,tohum:2100+r*100,seyrek:0.15+r*0.1,ara:[2,8],agac:0.6,bos});}}

  /* ---- ana tribünün arkası: kulüp binası, giriş, otopark, arka sokak (yalnız maç) ---- */
  {const c=cephe('kulupBinasi');
   if(c&&mac&&LOCA){kurulan.push(c.tip);const zOn=LOCA.on,zArka=zOn-10.7;LOCA.binaArka=zArka;   /* N11: stada varış sokak kapısının önünde başlar */
    const zT=-(YAN_MESAFE+tribunOlcu(STAT.tribunler.find(x=>x.yer==='ana')).D+0.8),altUst=tribunTepe('ana')-0.2;
    const bina=rk(R.bina),koyu=rk(R.binaKoyu),ust=LOCA.zemin-0.36;
    /* locanın önündeki alçak kısım tribün tepesini geçmez (başkanın bakışı); locanın altında üç katlı gövde */
    kutu(2*binaX,altUst-Z0,zOn-zT,0,(altUst+Z0)/2,(zOn+zT)/2,0,koyu);
    kutu(2*binaX,ust-Z0,zOn-zArka,0,(ust+Z0)/2,(zOn+zArka)/2,0,bina);
    const yl=LOCA.W/2+0.3;
    for(const sx of[-1,1]){kutu(binaX-yl,0.5,0.25,sx*(binaX+yl)/2,ust+0.25,zOn,0,koyu);kutu(0.25,0.5,zOn-zArka,sx*binaX,ust+0.25,(zOn+zArka)/2,0,koyu);}
    kutu(2*binaX,0.5,0.25,0,ust+0.25,zArka,0,koyu);
    const M=mat(0,Z0,zArka,Math.PI);   /* arka cephe: yerel +z sokağa bakar */
    for(let f=0;f<3;f++)for(let j=0;j<9;j++){const px=-10.4+j*2.6;if(f===0&&Math.abs(px)<2.4)continue;pencere(M,1.3,1.6,px,f*3.8+2.1,0.04,0,900+f*17+j,undefined,undefined,0.45);}
    /* sahaya bakan yüz: alçak kısmın üstünde bir sıra pencere (odanın katı; locanın ayakları ortada) */
    {const O=mat(0,Z0,zOn,0);for(let j=0;j<9;j++){const px=-10.4+j*2.6;if(Math.abs(Math.abs(px)-4.2)<0.9)continue;pencere(O,1.3,1.5,px,altUst-Z0+2.2,0.04,0,960+j,undefined,undefined,0.5);}}
    for(const sx of[-1,1])for(let f=0;f<3;f++)for(let j=0;j<3;j++)pencere(mat(sx*(binaX+0.03),Z0,zArka+2.2+j*3,sx*Math.PI/2),1.1,1.5,0,f*3.8+2.1,0,0,950+f*7+j*3+(sx>0?1:0),undefined,undefined,0.4);
    pencere(M,2.6,2.6,0,1.3,0.05,0,990,R.vitrinIsik,R.vitrin,1);
    ykutu(M,5,0.25,2,0,3.05,1,0,koyu);ykutu(M,0.2,2.95,0.2,-2.3,1.5,1.9,0,koyu);ykutu(M,0.2,2.95,0.2,2.3,1.5,1.9,0,koyu);
    ykutu(M,4,0.2,1.2,0,0.1,0.7,0,koyu);ykutu(M,3.4,0.2,0.8,0,0.3,0.45,0,koyu);
    /* arma: kulüp renkleriyle kalkan ve ortada şerit; altında kulübün adı */
    ykutu(M,1.7,2.0,0.12,0,4.75,0.08,0,rk(R.kulupAcik));ykutu(M,1.45,1.75,0.14,0,4.78,0.1,0,rk(R.kulup));ykutu(M,0.36,1.75,0.16,0,4.78,0.11,0,rk(R.kulupAcik));
    levha(STAT.ad.split(' ')[0]+' SPOR KULÜBÜ',8.5,0,Z0+6.3,zArka-0.06,Math.PI,R.tabela,R.tabelaYazi);
    /* otopark: asfalt, çizgiler, araçlar; bahçe duvarı ve kapısı */
    const zp=zArka-10;serit(-30,zp-7,18,zp+7,rk(R.asfalt));
    for(let i=0;i<=17;i++){const x=-29+i*2.7;for(const zz of[zp+4.4,zp-4.4])kutu(0.12,0.02,4.4,x,-0.19,zz,0,rk(R.cizgi));
      for(const [zz,ry] of[[zp+4.4,0],[zp-4.4,Math.PI]])if(i<17&&h2(i,ry?301:303)<0.42)arac(x+1.35,zz,ry,i*3+(ry?1:0));}
    const zb=zArka-19;
    for(const [a,b] of[[-40,-3.5],[3.5,40]])kutu(b-a,1.2,0.3,(a+b)/2,Z0+0.6,zb,0,rk(R.tasDuvar));
    for(const sx of[-1,1])kutu(0.6,1.8,0.6,sx*3.8,Z0+0.9,zb,0,rk(R.duvarUst));
    /* arka sokak ve evler */
    serit(W.bati-13,zb-10,W.dogu+1.5,zb-3,rk(R.asfalt));serit(W.bati-11,zb-3,W.dogu,zb-1,rk(R.kaldirim),-0.18);
    for(let x=W.bati+8;x<W.dogu-4;x+=20)lamba(x,zb-1.6,[0,-1]);
    for(let r=0;r<3;r++)evSirasi({eksen:'x',sabit:zb-18-r*17,bas:W.bati+2,son:W.dogu-4,ry:0,tohum:3000+r*100,seyrek:0.1+r*0.1,ara:[2,7],agac:0.6});}}

  /* ---- tarlalar ve taş duvarlar: evlerin ardında, ufuk tepelerinin önünde ---- */
  {let n=0;
   const tarla=(x0,z0,x1,z1)=>{for(let x=x0;x<x1;){const w=22+h2(n,401)*30;for(let z=z0;z<z1;){n++;const d=14+h2(n,403)*20;
       if(Math.hypot(x+w/2,z+d/2)<198){serit(x,z,Math.min(x+w,x1),Math.min(z+d,z1),rk(sec1(R.tarla,n,405),0.9+0.2*h2(n,407)),-0.22);
         if(h2(n,409)<0.4)kutu(Math.min(w,x1-x),0.8,0.4,x+Math.min(w,x1-x)/2,Z0+0.4,z,0,rk(R.tasDuvar));
         if(h2(n,411)<0.3)agac(x+h2(n,413)*w,z+h2(n,415)*d,n,'yuvarlak');}
       z+=d;}x+=w;}};
   tarla(-150,W.kuzey+80,W.dogu,200);tarla(-200,-150,-150,150);
   if(mac)tarla(-150,-200,W.dogu,W.guney-90);}

  /* ---- ufuk: stadı çevreleyen tepe sıraları (her yönde ufku kapatır; gece sisle koyulaşır) ---- */
  {const pos=[],col=[],N=144;
   (CV.ufuk||[]).forEach((u,s)=>{const f=[2,3,5,8,13,21],a=[0.3,0.25,0.18,0.12,0.08,0.05],ph=f.map((_,k)=>h2(k,s*17+3)*Math.PI*2),A=a.reduce((x,y)=>x+y,0);
     const hgt=t=>{let v=0;for(let k=0;k<f.length;k++)v+=a[k]*Math.sin(f[k]*t+ph[k]);return u.yukseklik[0]+(u.yukseklik[1]-u.yukseklik[0])*(0.5+0.5*v/A);};
     const alt=rk(s?R.tepeUzak:R.tepeYakin,gunduz?0.82:1),tep=rk(s?R.tepeUzak:R.tepeYakin,gunduz?1.06:1);
     for(let i=0;i<N;i++){const t0=i/N*Math.PI*2,t1=(i+1)/N*Math.PI*2,r=u.yaricap,r2=r+18;
       const A0=[Math.cos(t0)*r,Z0-0.4,Math.sin(t0)*r],A1=[Math.cos(t1)*r,Z0-0.4,Math.sin(t1)*r],B0=[Math.cos(t0)*r2,hgt(t0),Math.sin(t0)*r2],B1=[Math.cos(t1)*r2,hgt(t1),Math.sin(t1)*r2];
       pos.push(...A0,...B0,...A1,...A1,...B0,...B1);col.push(...alt,...tep,...alt,...alt,...tep,...tep);}});
   if(pos.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
     kok.add(new THREE.Mesh(g,BAS({vertexColors:true,side:THREE.DoubleSide})));}}

  kok.userData.cevre=kurulan;
  /* ---- birleştirme: yapılar (gece yüzeyin yönüyle hafif gölgeli), yanık pencereler, lamba ışıkları ---- */
  if(P.length){const g=geoBirlestir(P);
    if(!gunduz){const n=g.attributes.normal.array,c=g.attributes.color.array;for(let i=0;i<n.length;i+=3){const k=0.72+0.28*Math.max(0,n[i+1])+0.1*n[i]-0.06*Math.abs(n[i+2]);c[i]*=k;c[i+1]*=k;c[i+2]*=k;}}
    kok.add(new THREE.Mesh(g,(gunduz?LAM:BAS)({vertexColors:true})));}
  if(ISIK.length)kok.add(new THREE.Mesh(geoBirlestir(ISIK),BAS({vertexColors:true})));
  if(LAMBA.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(LAMBA,3));
    kok.add(new THREE.Points(g,new THREE.PointsMaterial({map:GLOWT,color:R.lambaIsik,size:4,sizeAttenuation:true,transparent:true,opacity:0.85,blending:THREE.AdditiveBlending,depthWrite:false,fog:false})));}
}
