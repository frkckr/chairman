/* ============ Chairman — stadyum: kulübün stat tarifini (STAT, js/stadyum-tarifleri.js) okuyup statı kurar ============
   Tek kurucu (2.8D): statKur(kok, {mac, gunduz}) aynı tariften aynı yapıyı verilen gruba kurar:
     saha ve zemin kalitesi, reklam panoları, tribünler (basamak, koltuk, başkan bölümü, çatı), tel örgü, skor tabelası,
     tünel ağzı ve yedek kulübeleri, projektörler, çevre, kaleler.
   mac: true  → maç sahnesi. Seyirci yerleri (YERLER), başkan koltuğu (BASKAN_KOLTUGU), pankart/bayrak/meşale, projektör ışıkları,
                canlı skor tabelası (TABELA), tünel ve kulübe verisi (TUNEL, KULUBELER) burada üretilir.
   mac: false → balkon ve oda penceresi (js/balkon.js): aynı yapı gündüz, boş tribünlerle; maç günü eşyası ve seyirci yeri üretilmez.
   gunduz: çevredeki apartmanların ve dış zeminin gündüz renkleri (STIL.balkon). Maçtaki hâl ile aynı yapıdır, yalnız ışık/doluluk değişir. */
const SK=STIL.stadyum;
const PISTLI=STAT.pist!=='yok';
const YAN_MESAFE={tartan:44,toprak:42,yok:40}[STAT.pist],KALE_MESAFE={tartan:64,toprak:61,yok:59}[STAT.pist];
const SIRA={oturma:{derinlik:0.8,egim:0.5,kisi:0.5},ayakta:{derinlik:0.55,egim:0.28,kisi:0.45},set:{derinlik:1,egim:0.4,kisi:0.6}};

/* ---- saha: zemin kalitesi düştükçe çim sararır, kel ve çamurlu alanlar çoğalır, çizgiler solar ---- */
const RGB=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];},mixRGB=(a,b,t)=>'rgb('+a.map((v,i)=>Math.round(v*(1-t)+b[i]*t)).join(',')+')';
function pitchCv(q){
  const S=STIL.saha.pikselMetre,W=132*S,H=92*S,cv=mk(W,H),g=cv.getContext('2d'),X=x=>(x+66)*S,Z=z=>(z+46)*S,kuru=(1-q)*0.4;
  if(STAT.pist==='tartan'){
    g.fillStyle=STIL.saha.pist;g.fillRect(0,0,W,H);
    g.fillStyle=STIL.saha.pistCizgi;for(let k=0;k<5;k++){const d=41.2+k*1.22;g.fillRect(0,Z(-d),W,1);g.fillRect(0,Z(d),W,1);g.fillRect(X(-d-20.5),0,1,H);g.fillRect(X(d+20.5),0,1,H);}
  }else if(STAT.pist==='toprak'){
    g.fillStyle=SK.toprakPist;g.fillRect(0,0,W,H);
    for(let i=0;i<5000;i++){g.fillStyle=h2(i,7)>0.5?'rgba(0,0,0,0.12)':'rgba(255,230,200,0.08)';g.fillRect(h2(i,1)*W|0,h2(i,2)*H|0,2,2);}
  }else{g.fillStyle=SK.pistsizKenar;g.fillRect(0,0,W,H);}
  const koyu=mixRGB(RGB(STIL.saha.cimKoyu),RGB(SK.kuruCim),kuru),acik=mixRGB(RGB(STIL.saha.cimAcik),RGB(SK.kuruCim),kuru);
  g.fillStyle=koyu;g.fillRect(X(-60.5),Z(-40.5),121*S,81*S);
  {const SW=STIL.saha.seritGenisligi;g.fillStyle=acik;g.globalAlpha=0.2+0.8*q;
   for(let x0=-52.5-2*SW;x0<60.5;x0+=2*SW){const p=Math.max(-60.5,x0),r=Math.min(60.5,x0+SW);if(r>p)g.fillRect(X(p),Z(-40.5),(r-p)*S,81*S);}
   if(q>0.85){g.globalAlpha=0.08;for(let z0=-40.5;z0<40.5;z0+=2*SW)g.fillRect(X(-60.5),Z(z0),121*S,SW*S);}
   g.globalAlpha=1;}
  /* düzensiz renk lekeleri: kötü sahada çim yamalı görünür */
  for(let i=0;i<Math.round(60*(1-q));i++){const x=-55+h2(i,41)*110,z=-37+h2(i,43)*74,r=2+h2(i,47)*5;g.fillStyle='rgba(120,110,50,'+(0.12+0.18*(1-q)).toFixed(2)+')';g.beginPath();g.ellipse(X(x),Z(z),r*S,r*0.7*S,h2(i,5)*3,0,6.3);g.fill();}
  g.strokeStyle=STIL.saha.cizgi;g.fillStyle=STIL.saha.cizgi;g.lineWidth=2;g.globalAlpha=0.45+0.55*q;
  const arc=(cx,cz,r,a0,a1)=>{g.beginPath();g.arc(X(cx),Z(cz),r*S,a0,a1);g.stroke();};
  g.strokeRect(X(-52.5),Z(-34),105*S,68*S);g.beginPath();g.moveTo(X(0),Z(-34));g.lineTo(X(0),Z(34));g.stroke();
  arc(0,0,9.15,0,Math.PI*2);g.fillRect(X(0)-2,Z(0)-2,4,4);
  const th=Math.acos(5.5/9.15);
  for(const sd of[-1,1]){
    g.strokeRect(X(sd>0?36:-52.5),Z(-20.16),16.5*S,40.32*S);g.strokeRect(X(sd>0?47:-52.5),Z(-9.16),5.5*S,18.32*S);
    if(sd>0)arc(41.5,0,9.15,Math.PI-th,Math.PI+th);else arc(-41.5,0,9.15,-th,th);
    g.fillRect(X(sd*41.5)-2,Z(0)-2,4,4);
    for(const t of[-1,1]){const a0=sd>0?(t>0?Math.PI:Math.PI/2):(t>0?1.5*Math.PI:0);arc(sd*52.5,t*34,1,a0,a0+Math.PI/2);}
  }
  g.globalAlpha=1;
  /* aşınma: kale ağızları ve orta saha her sahada, kötü sahada kel ve çamurlu alanlar da (çizgilerin üstünü örter) */
  const wear=(cx,cz,r,a,col)=>{const gr=g.createRadialGradient(X(cx),Z(cz),0,X(cx),Z(cz),r*S);gr.addColorStop(0,'rgba('+col+','+a.toFixed(2)+')');gr.addColorStop(0.6,'rgba('+col+','+(a*0.6).toFixed(2)+')');gr.addColorStop(1,'rgba('+col+',0)');g.fillStyle=gr;g.fillRect(X(cx)-r*S,Z(cz)-r*S,2*r*S,2*r*S);};
  const u=1-q;
  wear(48.5,0,5+4*u,0.3+0.6*u,STIL.saha.asinma);wear(-48.5,0,5+4*u,0.3+0.6*u,STIL.saha.asinma);wear(0,0,4+4*u,0.15+0.55*u,STIL.saha.asinma);
  wear(41.5,0,2.5+2*u,0.2+0.4*u,STIL.saha.asinma);wear(-41.5,0,2.5+2*u,0.2+0.4*u,STIL.saha.asinma);
  if(u>0.35){wear(50.5,0,2.5*u+1,0.7*u,SK.camur);wear(-50.5,0,2.5*u+1,0.7*u,SK.camur);}
  for(let i=0;i<Math.round(Math.pow(u,1.5)*34);i++){
    const x=-50+h2(i,11)*100,z=-32+h2(i,13)*64,mud=h2(i,17)<0.3;
    wear(x,z,1.2+h2(i,19)*3.5,(0.35+0.4*h2(i,23))*u,mud?SK.camur:STIL.saha.asinma);}
  return cv;
}

/* ---- ortak ölçüler ve dokular (sahneden bağımsız) ---- */
const ADS_CV=(()=>{const cv=mk(1024,16),g=cv.getContext('2d');ADS.forEach((a,i)=>{const x=i*128;g.fillStyle='rgb('+a[1]+')';g.fillRect(x,0,128,16);
  ctxText(g,a[0],x+((128-textW(a[0],2))>>1),1,'rgb('+a[2]+')',2);g.fillStyle='rgba(0,0,0,0.35)';g.fillRect(x,0,1,16);});return cv;})();
/* ana tribün tarafında orta çizginin iki yanı boş: tünel ağzı ve yedek kulübeleri orada */
const KULUBE_BOSLUK=16,TUNEL_X=STAT.tunelX||0;
/* tribün ölçüleri ve kapasite (kişi) */
function tribunOlcu(t){
  const S=SIRA[t.tip],eg=t.egim||S.egim,y0=t.tip==='set'?0.2:PISTLI?1.2:1.0;
  return{S,dp:S.derinlik,eg,y0,D:t.sira*S.derinlik,y1:y0+t.sira*eg,kap:Math.floor(t.uzunluk/S.kisi)*t.sira};
}
const STAT_KAPASITE=STAT.tribunler.reduce((s,t)=>s+tribunOlcu(t).kap,0);
function tribunYeri(yer){return{ana:{pos:[0,-YAN_MESAFE],rot:0},karsi:{pos:[0,YAN_MESAFE],rot:Math.PI},kale1:{pos:[-KALE_MESAFE,0],rot:Math.PI/2},kale2:{pos:[KALE_MESAFE,0],rot:-Math.PI/2}}[yer];}
/* tribünün en yüksek noktası (stat koordinatında metre): çatı, yoksa en üst sıra; protokol locası yükseltilmişse onun üstü. Balkon bunun üstündedir */
/* başkan locasının döşeme yüksekliği: balkon döşemesinin (tribün tepesi + 1,8 m) kat metre üstü (js/balkon.js BLK_STAT ile aynı hesap) */
const locaZemini=t=>tribunTepe('ana')+(t.cati?0.9:1.8)+t.loca.kat;
function tribunTepe(yer){
  const t=STAT.tribunler.find(x=>x.yer===yer);if(!t)return 0;
  const O=tribunOlcu(t);return t.cati?O.y1+4:O.y1+(t.protokol||0);
}
/* tribün onarımının yeri (STAT.bakim): basamakların ortasında, tribün boyunca u kadar kayık. İskele gibi izler buraya konur (2.8J: çatısız stat) */
function tribunBakimYeri(){
  const B=STAT.bakim,t=B&&STAT.tribunler.find(x=>x.yer===B.yer);if(!t)return null;
  const O=tribunOlcu(t),Y=tribunYeri(t.yer),f=-O.D*0.5,u=(B.u||0)*t.uzunluk,c=Math.cos(Y.rot),s=Math.sin(Y.rot);
  return{x:Y.pos[0]+f*s+u*c,y:O.y0+(O.y1-O.y0)*0.5,z:Y.pos[1]+f*c-u*s,rot:Y.rot,uzunluk:t.uzunluk};
}
/* koltuk: oturak, sırtlık ve ayak; başlangıç noktası basamak yüzeyi, yüzü sahaya (+z) */
const KOLTUK_GEO=kutuBirlestir([{w:0.44,h:0.08,d:0.4,y:0.38,z:0.02},{w:0.44,h:0.4,d:0.06,y:0.6,z:-0.19},{w:0.3,h:0.34,d:0.06,y:0.17,z:0.1,renk:[0.3,0.3,0.32]}]);
const KOLTUK_UZAK_GEO=kutuBirlestir([{w:0.44,h:0.62,d:0.3,y:0.31,z:-0.07}]); // uzaktan tek parça
const KOLTUK_YUKSEKLIGI=0.42,BB=STIL.baskanBolumu;
const FENCE_CV=(()=>{const cv=mk(8,8),g=cv.getContext('2d');g.fillStyle='rgba(176,182,190,0.95)';for(let i=0;i<8;i++){g.fillRect(i,i,1,1);g.fillRect(7-i,i,1,1);}return cv;})();
const NET_CV=(()=>{const cv=mk(8,8),g=cv.getContext('2d');g.fillStyle='rgba(235,235,235,1)';g.fillRect(0,0,8,1);g.fillRect(0,0,1,8);return cv;})();
const POSTM=LAM({color:0xf4f4f0});
function netM(w,h){return LAM({map:tx(NET_CV,'m',[w/0.16,h/0.16]),transparent:true,depthWrite:false,side:THREE.DoubleSide});}

/* maç sahnesinin ürettiği paylaşılan veriler (seyirci, efektler, maç sahnesi, başkan ve arayüz okur) */
/* YERLER: seyircinin oturabileceği ya da durabileceği her nokta (dünya matrisi, tip, bölüm) */
const lamps=[],TRIBUNLER={},YERLER=[],flags=[],MESALE_YERLERI=[],TABELA={ciz(){}},KULUBELER=[];
const TUNEL={x:TUNEL_X,z:-(YAN_MESAFE-2.2)}; // tünel ağzı tribün önünde kısa bir körük
let BASKAN_KOLTUGU=null;

function statKur(kok,sec){
  const mac=!!(sec&&sec.mac),gunduz=!!(sec&&sec.gunduz),GB=STIL.balkon;
  const kutu=(w,h,d,m,x,y,z,p)=>box(w,h,d,m,x,y,z,p||kok);
  {const gr=new THREE.Mesh(new THREE.PlaneGeometry(132,92,24,16),LAM({map:tx(pitchCv(STAT.zemin),'l')}));gr.rotation.x=-Math.PI/2;kok.add(gr);
   const out=new THREE.Mesh(new THREE.PlaneGeometry(700,700),new THREE.MeshLambertMaterial({color:gunduz?GB.disZemin:SK.disZemin}));out.rotation.x=-Math.PI/2;out.position.y=-0.3;kok.add(out);}

  /* ---- reklam panoları (piksel yazı); küçük statta panolar seyrek ---- */
  function board(len,x,z,rot,ofs){const side=LAM({color:0x202226}),t=tx(ADS_CV,'m',[len/64,1]);t.offset.x=ofs||0;const face=BAS({map:t});
    const b=new THREE.Mesh(new THREE.BoxGeometry(len,0.9,0.12),[side,side,side,side,face,side]);b.position.set(x,0.45,z);b.rotation.y=rot;kok.add(b);}
  if(STAT.reklam>=1&&!TUNEL_X){board(56-KULUBE_BOSLUK,-(56+KULUBE_BOSLUK)/2,-38.2,0);board(56-KULUBE_BOSLUK,(56+KULUBE_BOSLUK)/2,-38.2,0,0.5);board(76,57.8,0,-Math.PI/2);board(76,-57.8,0,Math.PI/2);board(112,0,38.2,Math.PI);}
  else{let n=0;for(const [len,cx,cz,rot] of[[112,0,-38.2,0],[76,57.8,0,-Math.PI/2],[76,-57.8,0,Math.PI/2],[112,0,38.2,Math.PI]]){
    const k=Math.floor(len/8);for(let i=0;i<k;i++){const u=-len/2+4+i*8;if((STAT.reklam<1&&h2(i,n*7+3)>STAT.reklam)||(n===0&&(Math.abs(u)<KULUBE_BOSLUK||Math.abs(u-TUNEL_X)<4)))continue;const c=Math.cos(rot),s=Math.sin(rot);board(8,cx+u*c,cz-u*s,rot,((i+n*3)%8)/8);}n++;}}

  /* ---- tribünler: tarifteki her tribün. Basamaklar ve koltuklar burada; seyirciler js/seyirci.js'te koltuk yerlerine oturur (yalnız maçta) ---- */
  const tribunler={};
  function stand(t){
    const O=tribunOlcu(t),{D,y0,y1,dp,eg}=O,L=t.uzunluk,Y=tribunYeri(t.yer),g=new THREE.Group();
    g.position.set(Y.pos[0],0,Y.pos[1]);g.rotation.y=Y.rot;kok.add(g);g.updateMatrixWorld(true);
    /* basamaklar (set tipinde düz eğimli toprak) */
    if(t.tip==='set'){const sl=Math.hypot(y1-y0,D),pl=new THREE.Mesh(new THREE.PlaneGeometry(L,sl,Math.max(2,Math.round(L/8)),4),LAM({color:SK.set}));
      pl.rotation.x=-(Math.PI/2-Math.atan2(y1-y0,D));pl.position.set(0,(y0+y1)/2,-D/2);g.add(pl);}
    else{const bm=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),LAM({color:t.tip==='ayakta'?SK.basamak:SK.beton}),t.sira),M=new THREE.Matrix4();
      for(let r=0;r<t.sira;r++){const yr=y0+r*eg;M.makeScale(L,eg,dp).setPosition(0,yr-eg/2,-(r+0.5)*dp);bm.setMatrixAt(r,M);}bm.frustumCulled=false;g.add(bm);
      box(L,y0,0.4,LAM({color:SK.beton}),0,y0/2,0.2,g);
      box(L,y1+1,0.6,LAM({color:SK.betonKoyu}),0,(y1+1)/2,-D-0.3,g);
      for(const sx of[-1,1])box(0.5,y1+1,D,LAM({color:SK.yanDuvar}),sx*(L/2+0.25),(y1+1)/2,-D/2,g);}
    if(t.tip==='ayakta')for(let r=3;r<t.sira;r+=3)box(L-1,0.06,0.06,LAM({color:SK.direk}),0,y0+r*eg+1.0,-r*dp,g); // korkuluklar
    if(t.cati){const f=-D*(1-t.cati),b=-D-1,ry=y1+4;
      box(L+4,0.6,f-b,LAM({color:SK.cati}),0,ry,(f+b)/2,g);box(L+4,1,0.8,LAM({color:SK.catiKenar}),0,ry-0.7,f,g);
      for(let x=-L/2;x<=L/2+0.1;x+=L/Math.max(2,Math.round(L/20)))box(0.5,ry,0.5,LAM({color:SK.direk}),x,ry/2,b+0.5,g);
      if(STAT.projektor.tip==='cati')for(let x=-L/2+4;x<=L/2-3.9;x+=8){box(2,0.5,0.4,BAS({color:0xfff4d8}),x,ry-1.3,f+0.3,g);
        if(mac){const s=glow(0xffe9c0,7,0.55*STAT.projektor.guc);s.position.set(x,ry-1.3,f+1.2);g.add(s);lamps.push(s);}}}
    /* bölümler: tribün boyunca parçalar. Başkan bölümü ana tribünün ortasında 4 sıra; başkan ön sırada, önünde boş bir geçit ve korkuluk var */
    const VG=4.2,cuts=[{from:-L/2,to:L/2,taraftar:t.taraftar},...(t.bolumler||[])],bs=t.baskanSira,vipSira=r=>bs!=null&&r>=bs&&r<=bs+3,PH=t.protokol||0;
    if(bs!=null)cuts.push({from:-VG,to:VG,taraftar:'baskan'});
    const edges=[...new Set(cuts.flatMap(c=>[c.from,c.to]))].filter(v=>v>=-L/2&&v<=L/2).sort((a,b)=>a-b);
    const koltuklar=[],K=new THREE.Matrix4(),Q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Y.rot),V=new THREE.Vector3(),BIR=new THREE.Vector3(1,1,1);
    const yer=(x,y,z,bolum,r,ek)=>{if(!mac)return;V.set(x,y,z);g.localToWorld(V);YERLER.push({m:new THREE.Matrix4().compose(V.clone(),Q,BIR),tip:t.tip,bolum,r,u:2*x/L,...ek});};
    edges.forEach((a,i)=>{const b=edges[i+1];if(b==null||b-a<0.01)return;const mid=(a+b)/2;let tr=t.taraftar;for(const c of cuts)if(mid>c.from&&mid<c.to)tr=c.taraftar;
      const bolum={taraftar:tr==='baskan'?t.taraftar:tr,yer:t.yer,kap:Math.floor((b-a)/O.S.kisi)*t.sira};
      for(let r=0;r<t.sira;r++){const yr=y0+r*eg;
        if(tr==='baskan'&&r===bs-1)continue; // geçit
        if(tr==='baskan'&&vipSira(r)){/* başkan bölümü: döşemeli koltuklar, yöneticiler; protokol locası PH kadar yükseltilmiş */
          for(let k=-6;k<=6;k++){const x=k*0.6,z=-(r+0.55)*dp,baskan=r===bs&&k===0,vy=yr+PH+KOLTUK_YUKSEKLIGI*1.14;
            koltuklar.push([x,yr+PH,z,1.2,baskan?BB.koltuk:STIL.seyirci.vipKoltuk]);
            /* 2.8O: başkan bu bölümde değil, binadaki locadadır; ön sıranın ortası diğer yöneticilerin */
            yer(x,vy,z,{taraftar:'vip',yer:t.yer,kap:1},r,{vip:true});}
          continue;}
        const n=Math.floor((b-a)/O.S.kisi);
        for(let k=0;k<n;k++){const x=a+(k+0.5)*(b-a)/n;
          if(t.tip==='oturma'){const z=-(r+0.55)*dp;koltuklar.push([x,yr,z,1,t.koltuk]);yer(x,yr+KOLTUK_YUKSEKLIGI,z,bolum,r);}
          else{const jx=(h2(k,r*31+i)-0.5)*0.24,jz=(h2(k+7,r*17+i)-0.5)*0.16*dp;
            yer(x+jx,t.tip==='set'?y0+(r+0.5)*eg:yr,-(r+0.5)*dp+jz,bolum,r);}}
      }});
    /* koltuklar: başkana yakın olanlar ayrıntılı, uzaktakiler tek parça */
    if(koltuklar.length){const C=new THREE.Color(),yakin=[],uzak=[];
      koltuklar.forEach((k,j)=>{(bs!=null&&Math.abs(k[0])<14&&k[1]<y0+(bs+8)*eg?yakin:uzak).push([...k,j]);});
      for(const [liste,geo] of[[yakin,KOLTUK_GEO],[uzak,KOLTUK_UZAK_GEO]]){if(!liste.length)continue;const km=new THREE.InstancedMesh(geo,LAM({vertexColors:true}),liste.length);
        liste.forEach(([x,y,z,sc,renk,j],n)=>{K.makeScale(sc,sc*0.95,sc).setPosition(x,y,z);km.setMatrixAt(n,K);C.set(renk).multiplyScalar(0.85+0.2*h2(j,t.sira));km.setColorAt(n,C);});
        km.frustumCulled=false;g.add(km);}}
    if(bs!=null){/* başkan bölümü: önünde geçit, yükseltilmiş beton loca (protokol) ve korkuluk, yerde halı, iki yanda ahşap bölme.
      Başkanın masası ve elleri js/baskan.js'te (ön plan) */
      const rm=LAM({color:STIL.seyirci.vipKorkuluk}),beton=LAM({color:SK.beton}),betonKoyu=LAM({color:SK.betonKoyu});
      if(PH>0)for(let r=bs;r<=bs+3&&r<t.sira;r++){const ry=y0+r*eg,rz=-(r+0.5)*dp;box(2*VG+0.4,PH,dp,beton,0,ry+PH/2,rz,g);}
      if(PH>0)box(2*VG+0.4,PH+1.2,0.6,betonKoyu,0,y1+1+PH/2-0.4,-D-0.3,g);
      const kyr=y0+(PH>0?bs:bs-1)*eg+PH,kz=-(PH>0?bs:bs-1)*dp-0.05;box(2*VG,0.05,0.05,rm,0,kyr+0.95,kz,g);
      for(let x=-VG;x<=VG+0.01;x+=VG/3)box(0.04,0.95,0.04,rm,x,kyr+0.47,kz,g);
      const hali=LAM({color:BB.hali}),bolme=LAM({color:BB.bolme}),bolmeUst=LAM({color:BB.bolmeUst});
      for(let r=bs-1;r<=bs+3&&r<t.sira;r++){const ry=y0+r*eg+(r>=bs?PH:0),rz=-(r+0.5)*dp;box(2*VG,0.02,dp,hali,0,ry+0.01,rz,g);
        if(r>=bs)for(const sx of[-1,1]){box(0.08,1.0,dp,bolme,sx*VG,ry+0.5,rz,g);box(0.12,0.05,dp+0.02,bolmeUst,sx*VG,ry+1.02,rz,g);}}
}
    tribunler[t.yer]={t,g,O};
    if(mac)TRIBUNLER[t.yer]=tribunler[t.yer];
    return g;
  }
  for(const t of STAT.tribunler)stand(t);
  /* ---- başkan locası (2.8O): ana tribünün arkasındaki kulüp binasında, balkonun bir kat üstünde. Beton döşeme, alçak ön bordür (başkanın
     masası korkuluk işini görür), yan duvarlar ve öndeki iki ayak; başkanın koltuğu ön kenardadır. Kamera buradan bakar. Yalnız maçta kurulur
     (2026-10-03): balkon ve pencere statı ters döndüğünden döşeme odanın içine, baş hizasına düşüyordu ---- */
  {const t=STAT.tribunler.find(x=>x.yer==='ana');
   if(t&&t.loca&&mac){const L=t.loca,O=tribunOlcu(t),arka=YAN_MESAFE+O.D+0.6,zemin=locaZemini(t),on=-(arka+L.geri)+0.7,W=L.genislik,D=L.derinlik;
     const beton=LAM({color:SK.beton}),koyu=LAM({color:SK.betonKoyu});
     kutu(W+0.4,0.35,D,beton,0,zemin-0.18,on-D/2);kutu(W+0.4,0.22,0.18,koyu,0,zemin+0.11,on);
     for(const sx of[-1,1]){kutu(0.25,2.6,D,koyu,sx*(W/2+0.1),zemin+1.3,on-D/2);kutu(0.5,zemin,0.5,beton,sx*(W/2-0.3),zemin/2,on-0.4);}
     kutu(W,2.8,0.25,koyu,0,zemin+1.4,on-D);
     if(mac)BASKAN_KOLTUGU=new THREE.Vector3(0,zemin+KOLTUK_YUKSEKLIGI*1.14,on-0.55);}}
  if(mac&&!BASKAN_KOLTUGU)BASKAN_KOLTUGU=new THREE.Vector3(0,6,-YAN_MESAFE-6);

  /* ---- tel örgü ---- */
  function fence(len,x,z,rot){const gr=new THREE.Group();gr.position.set(x,0,z);gr.rotation.y=rot;kok.add(gr);
    const f=new THREE.Mesh(new THREE.PlaneGeometry(len,3,8,1),LAM({map:tx(FENCE_CV,'m',[len/0.4,3/0.4]),transparent:true,depthWrite:false,side:THREE.DoubleSide}));f.position.y=1.5;gr.add(f);
    const pm=LAM({color:0x7a7f86});box(len,0.08,0.08,pm,0,3,0,gr);for(let u=-len/2;u<=len/2+0.1;u+=4)box(0.08,3,0.08,pm,u,1.5,0,gr);}
  for(const yer of STAT.telOrgu){const T=tribunler[yer];if(!T)continue;const Y=tribunYeri(yer),n=[Math.sign(Y.pos[0]),Math.sign(Y.pos[1])];
    fence(T.t.uzunluk,Y.pos[0]-n[0]*1.4,Y.pos[1]-n[1]*1.4,Y.rot);}

  /* ---- taraftar çekirdeği (yalnız maç günü): pankart, bayraklar, meşaleler (tarifte mesale:true olan tribün) ---- */
  {const T=STAT.tribunler.map(t=>tribunler[t.yer]).find(T=>T.t.mesale);
   if(mac&&T&&MAC_GUNU.doluluk>0.12){
    const{g,O,t}=T,L=t.uzunluk,at=(u,f)=>[u,O.y0+f*(O.y1-O.y0),-f*O.D];
    {const s='DEMİRKAPI SENİ SEVİYORUZ',cv=mk(textW(s,1)+6,11),c=cv.getContext('2d');c.fillStyle=STIL.pankart.zemin;c.fillRect(0,0,cv.width,11);c.fillStyle=STIL.pankart.yazi;c.fillRect(0,0,cv.width,1);c.fillRect(0,10,cv.width,1);
     ctxText(c,s,3,2,STIL.pankart.yazi,1);const bw=Math.min(34,L*0.45),b=new THREE.Mesh(new THREE.PlaneGeometry(bw,bw*3.2/34),LAM({map:tx(cv,'m')}));b.position.set(-L*0.12,O.y0+1.6,-1.2);b.rotation.x=-0.25;g.add(b);}
    const FLAG_CV=[(()=>{const cv=mk(24,16),c=cv.getContext('2d');c.fillStyle='#d61e24';c.fillRect(0,0,24,16);c.fillStyle='#fff';
       c.beginPath();c.arc(9,8,4.4,0,6.3);c.fill();c.fillStyle='#d61e24';c.beginPath();c.arc(10.3,8,3.5,0,6.3);c.fill();c.fillStyle='#fff';c.fillRect(14,7,2,2);c.fillRect(15,6,1,4);c.fillRect(14,8,3,1);return cv;})(),
      (()=>{const cv=mk(24,16),c=cv.getContext('2d');c.fillStyle='#c8281e';c.fillRect(0,0,24,8);c.fillStyle='#efe9dc';c.fillRect(0,8,24,8);return cv;})()];
    for(const [u,f,k] of[[-0.38,0.35,1],[-0.27,0.62,0],[-0.1,0.28,1],[-0.01,0.5,0],[-0.44,0.7,0],[0.05,0.25,1]]){
      const [x,y,lz]=at(u*L,f),m=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.7,6,1),LAM({map:tx(FLAG_CV[k],'n'),side:THREE.DoubleSide}));
      m.position.set(x+1.3,y+2.4,lz);g.add(m);box(0.05,2.8,0.05,LAM({color:0x9a9a9a}),x,y+1.6,lz,g);
      flags.push({m,base:Float32Array.from(m.geometry.attributes.position.array),ph:rnd()*6});}
    const n=Math.round(clamp(MAC_GUNU.doluluk*1.5,0.3,1)*7);
    for(const [u,f] of[[-0.38,0.3],[-0.3,0.55],[-0.21,0.2],[-0.14,0.45],[-0.06,0.35],[0.01,0.6],[-0.44,0.5]].slice(0,n)){const [x,y,lz]=at(u*L,f);MESALE_YERLERI.push(g.localToWorld(new THREE.Vector3(x,y+1,lz)));}
   }}

  /* ---- skor tabelası: tek fiziksel tabela (2.8J). Büyük statta ampullü; kasabada direkler üstünde sade tabela: iki arma, skor ve dakika/durum.
     Başkanın yerine döner, normal bakışta okunur. Maçta TABELA.ciz() yeniden yazar (js/mac-sahnesi.js tabelaGuncelle); balkon ve pencere
     maç dışındadır: tabelada yalnız kulübün arması ve adı durur, hayalî skor gösterilmez ---- */
  {const T=STAT.tabela,sb=new THREE.Group();sb.position.set(T.konum[0],0,T.konum[1]);sb.rotation.y=Math.atan2(-T.konum[0],-YAN_MESAFE-T.konum[1]);kok.add(sb);
   const lm=LAM({color:0x3a3d42});let ciz;
   if(T.tip==='ampullu'){
    const cv=mk(96,24),g=cv.getContext('2d'),dk=tx(cv,'n');
    ciz=(ev,dep,skor,alt)=>{g.fillStyle=STIL.tabela.zemin;g.fillRect(0,0,96,24);g.fillStyle='#24160a';for(let y=0;y<24;y+=2)for(let x=(y>>1)&1;x<96;x+=2)g.fillRect(x,y,1,1);
      const ust=skor?ev+' '+skor[0]+'-'+skor[1]+' '+dep:ev;ctxText(g,ust,(96-textW(ust,2))>>1,0,STIL.tabela.ampul,2);if(alt)ctxText(g,alt,(96-textW(alt,1))>>1,16,STIL.tabela.ikincil,1);dk.needsUpdate=true;};
    box(0.6,5.6,0.6,lm,-4.5,2.8,0,sb);box(0.6,5.6,0.6,lm,4.5,2.8,0,sb);box(13.4,4.8,1,LAM({color:0x1c1d20}),0,7.6,-0.3,sb);
    const f=new THREE.Mesh(new THREE.PlaneGeometry(12.6,3.9),BAS({map:dk}));f.position.set(0,7.6,0.22);sb.add(f);
    if(mac){const s=glow(0xffb530,16,0.28);s.position.set(0,7.6,1.2);sb.add(s);}
   }else{
    const W=64,HH=32,cv=mk(W,HH),g=cv.getContext('2d'),dk=tx(cv,'n'),Y=STIL.tabela.elleYazi,gen=T.genislik||6,yuk=gen/2,dh=T.yukseklik||3.2;
    /* küçük piksel arma: kulübün forma renkleriyle kalkan ve ortada şerit */
    const armaRenk=kisa=>{const kd=Object.values(KADROLAR).find(x=>x.kisa===kisa),f=kd&&STIL.formalar[kd.forma];return f?[f.shirt,f.sash||f.trim]:[Y,STIL.tabela.elleZemin];};
    const arma=(x,y,kisa)=>{const [a,b]=armaRenk(kisa);g.fillStyle=Y;g.fillRect(x-1,y-1,9,7);g.fillRect(x,y+6,7,2);g.fillRect(x+2,y+8,3,1);
      g.fillStyle=a;g.fillRect(x,y,7,6);g.fillRect(x+1,y+6,5,1);g.fillRect(x+2,y+7,3,1);g.fillStyle=b;g.fillRect(x+3,y,1,8);};
    ciz=(ev,dep,skor,alt)=>{g.fillStyle=STIL.tabela.elleZemin;g.fillRect(0,0,W,HH);g.fillStyle=Y;g.fillRect(0,0,W,1);g.fillRect(0,HH-1,W,1);g.fillRect(0,0,1,HH);g.fillRect(W-1,0,1,HH);
      if(!skor){arma(28,4,ev);const ad=STAT.ad.split(' ')[0];ctxText(g,ad,(W-textW(ad,1))>>1,17,Y,1);dk.needsUpdate=true;return;}
      arma(3,3,ev);arma(W-10,3,dep);ctxText(g,ev,13,3,Y,1);ctxText(g,dep,W-13-textW(dep,1),3,Y,1);
      const sk=skor[0]+'-'+skor[1];ctxText(g,sk,(W-textW(sk,2))>>1,9,Y,2);
      if(alt)ctxText(g,alt,(W-textW(alt,1))>>1,HH-9,STIL.tabela.ikincil,1);dk.needsUpdate=true;};
    for(const sx of[-1,1])box(0.32,dh,0.32,lm,sx*gen*0.36,dh/2,0,sb);
    const f=new THREE.Mesh(new THREE.PlaneGeometry(gen,yuk),LAM({map:dk}));f.position.set(0,dh+yuk/2,0.07);sb.add(f);box(gen+0.3,yuk+0.3,0.14,LAM({color:0x2a2c30}),0,dh+yuk/2,-0.04,sb);
   }
   if(mac){TABELA.ciz=ciz;TABELA.grup=sb;TABELA.boyut=[T.genislik||6,(T.genislik||6)/2,T.yukseklik||3.2];ciz('DEM','AKD',[0,0],'MAÇ ÖNCESİ');}
   else ciz('DEM');}

  /* ---- tünel ağzı ve yedek kulübeleri (ana tribün önünde, orta çizginin iki yanında) ---- */
  {const K=STIL.kulube,duvar=LAM({color:K.duvar}),cam=LAM({color:K.cam,transparent:true,opacity:0.35,depthWrite:false}),ic=BAS({color:0x050507});
   const L=YAN_MESAFE-(-TUNEL.z),zc=TUNEL.z-L/2;
   const tx0=TUNEL.x;for(const sx of[-1,1])kutu(0.15,2.3,L,duvar,tx0+sx*1.45,1.15,zc);kutu(3.05,0.12,L,duvar,tx0,2.35,zc);kutu(2.8,2.2,0.05,ic,tx0,1.1,-YAN_MESAFE+0.1);
   kutu(3.2,0.25,0.2,LAM({color:K.serit}),tx0,2.3,TUNEL.z);
   const KX=STAT.kulubeX||11.5;
   for(const [takim,cx] of[[0,-KX],[1,KX]]){
     const g=new THREE.Group();g.position.set(cx,0,-39.2);kok.add(g);
     box(6.5,2.1,0.12,duvar,0,1.05,-0.9,g);for(const sx of[-1,1])box(0.06,1.9,1.8,cam,sx*3.25,0.95,0,g);
     const cati=box(6.7,0.06,2.1,cam,0,2.12,-0.05,g);cati.rotation.x=0.08;box(6.5,0.12,0.12,duvar,0,2.14,0.95,g);
     box(6.2,0.45,0.5,LAM({color:K.bank}),0,0.22,-0.55,g);box(6.2,0.08,0.52,LAM({color:takim?STIL.formalar.deplasman.trim:STIL.formalar.ev.shirt}),0,0.49,-0.55,g);
     if(mac){const koltuklar=[];for(let i=0;i<6;i++)koltuklar.push({x:cx-2.6+i*1.04,y:0.53,z:-39.2-0.55});
       KULUBELER.push({takim,x:cx,z:-39.2,koltuklar,alan:{x:cx,z:-36.4}});}}}

  /* ---- projektör direkleri (küçük statta); ışık parlaması yalnız maç gecesinde ---- */
  if(STAT.projektor.tip==='direk')for(const [x,z] of STAT.projektor.konumlar){
    const H=STAT.projektor.yukseklik,d=new THREE.Group();d.position.set(x,0,z);d.rotation.y=Math.atan2(-x,-z);kok.add(d);
    box(0.5,H,0.5,LAM({color:SK.direk}),0,H/2,0,d);box(4.4,2.6,0.4,LAM({color:0x2a2c30}),0,H+0.6,0,d);
    for(let i=0;i<4;i++)for(let j=0;j<2;j++)box(0.8,0.8,0.1,BAS({color:gunduz?0xd8d4c4:0xfff2cc}),-1.5+i,H+0.05+j*1.1,0.25,d);
    if(mac){const s=glow(0xffe9c0,10,0.5*STAT.projektor.guc);s.position.set(0,H+0.6,1.2);d.add(s);lamps.push(s);}}

  /* ---- çevre: kasaba statının arkasında apartmanlar (gece ışıkları yanar; gündüz cephe renkleri) ---- */
  if(STAT.cevre==='apartman'){
    const renk=gunduz?GB.apartman:SK.apartman;
    const wcv=seed=>{const cv=mk(16,32),g=cv.getContext('2d'),dv=renk[seed%renk.length];g.fillStyle=dv;g.fillRect(0,0,16,32);
      for(let f=0;f<4;f++)for(let w=0;w<3;w++){g.fillStyle=gunduz?GB.pencere:h2(seed*9+w,f*5)<0.35?SK.pencere:'#15171c';g.fillRect(1+w*5,f*8+2,3,4);}return cv;};
    for(let i=0;i<34;i++){
      const a=i/34*Math.PI*2+h2(i,3)*0.1,r=112+h2(i,5)*45,x=Math.cos(a)*r*1.15,z=Math.sin(a)*r*0.85,fl=3+Math.floor(h2(i,7)*4),w=12+h2(i,9)*10,dp=10+h2(i,11)*6,h=fl*3;
      const side=gunduz?LAM({map:tx(wcv(i),'m',[w/9,fl/4])}):BAS({map:tx(wcv(i),'m',[w/9,fl/4])}),roof=gunduz?LAM({color:0x6a6c70}):BAS({color:0x1c1d21});
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,dp),[side,side,roof,roof,side,side]);b.position.set(x,h/2-0.3,z);b.rotation.y=-a+h2(i,13)*0.4;kok.add(b);}
  }

  /* ---- kaleler ---- */
  for(const sd of[-1,1]){
    const gx=sd*52.5,bx=sd*54.4;
    for(const z of[-3.72,3.72]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,2.5,6),POSTM);p.position.set(gx+sd*0.07,1.25,z);kok.add(p);
      kutu(0.05,2.2,0.05,LAM({color:0x8a8e94}),bx,1.1,z);}
    const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,7.58,6),POSTM);bar.rotation.x=Math.PI/2;bar.position.set(gx+sd*0.07,2.47,0);kok.add(bar);
    const back=new THREE.Mesh(new THREE.PlaneGeometry(7.44,2.2),netM(7.44,2.2));back.rotation.y=Math.PI/2;back.position.set(bx,1.1,0);kok.add(back);
    const top=new THREE.Mesh(new THREE.PlaneGeometry(1.9,7.44),netM(1.9,7.44));top.rotation.x=-Math.PI/2;top.position.set((gx+bx)/2,2.34,0);kok.add(top);
    for(const z of[-3.72,3.72]){const sn=new THREE.Mesh(new THREE.PlaneGeometry(1.9,2.4),netM(1.9,2.4));sn.position.set((gx+bx)/2,1.2,z);kok.add(sn);}
    for(const t of[-1,1]){kutu(0.04,1.5,0.04,POSTM,gx,0.75,t*34);const fl=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.3),LAM({color:0xd8281e,side:THREE.DoubleSide}));fl.position.set(gx-sd*0.2,1.35,t*34);kok.add(fl);}
  }
  return{tribunler};
}

/* maç sahnesi: stat tarifinden maç günüyle kurulur */
statKur(scene,{mac:true});
