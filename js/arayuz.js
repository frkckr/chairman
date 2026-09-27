/* ============ ekran üstü: TV grafikleri, loca etiketleri, dürbün ============ */
let view='box',bino=false,tags=true;
const KMR=k=>({p:k.konum,t:k.hedef,fov:k.aci}),VIEWS={box:KMR(STIL.kameralar.loca),bino:KMR(STIL.kameralar.durbun),tv:KMR(STIL.kameralar.tv)};
const curView=()=>view==='box'&&bino?VIEWS.bino:VIEWS[view];
const PV=new THREE.Vector3();
function drawHUD(){
  hg.clearRect(0,0,RW,RH);
  const T=(s,x,y,c,sc)=>ctxText(hg,s,x,y,c,sc||1),w=s=>textW(s,1);
  if(view==='tv'){
    let x=10;const y=10;
    hg.fillStyle='#0f2d5e';hg.fillRect(x,y,30,11);T('89:47',x+(30-w('89:47'))/2|0,y+2,'#f4f1ea');x+=30;
    hg.fillStyle='rgba(8,10,16,0.88)';hg.fillRect(x,y,24,11);hg.fillStyle='#c8281e';hg.fillRect(x+2,y+2,2,7);T('DEM',x+7,y+2,'#f4f1ea');x+=24;
    hg.fillStyle='#f1ede4';hg.fillRect(x,y,19,11);T('1-1',x+(19-w('1-1'))/2|0,y+2,'#0d1522');x+=19;
    hg.fillStyle='rgba(8,10,16,0.88)';hg.fillRect(x,y,24,11);T('AKD',x+4,y+2,'#f4f1ea');hg.fillStyle='#e9edf2';hg.fillRect(x+20,y+2,2,7);
    const cw=w('CANLI')+8;hg.fillStyle='#c8281e';hg.fillRect(RW-10-cw,y,cw,11);T('CANLI',RW-10-cw+4,y+2,'#fff');
    T('1.LİG · 34.HAFTA',RW-10-w('1.LİG · 34.HAFTA'),y+14,'rgba(244,241,234,0.85)');
    const ny=RH-24;hg.fillStyle='#c8281e';hg.fillRect(10,ny,16,14);ctxText(hg,'9',10+((16-textW('9',2))>>1),ny,'#fff',2);
    hg.fillStyle='rgba(8,10,16,0.88)';hg.fillRect(26,ny,w('KADİR')+10,14);T('KADİR',31,ny+4,'#f4f1ea');
    const rx=RW-74,ry=RH-52,RWd=64,RHd=42;hg.fillStyle='rgba(20,64,30,0.8)';hg.fillRect(rx,ry,RWd,RHd);hg.fillStyle='rgba(255,255,255,0.7)';
    hg.fillRect(rx,ry,RWd,1);hg.fillRect(rx,ry+RHd-1,RWd,1);hg.fillRect(rx,ry,1,RHd);hg.fillRect(rx+RWd-1,ry,1,RHd);hg.fillRect(rx+RWd/2,ry,1,RHd);
    for(const [x0,z0,k] of radarDots){if(k==='ref')continue;hg.fillStyle=k==='home'||k==='hgk'?'#ff4a36':'#f4f4f4';hg.fillRect(Math.round(rx+(x0+52.5)/105*(RWd-3))+1,Math.round(ry+(z0+34)/68*(RHd-3))+1,2,2);}
    hg.fillStyle='#ffd23a';hg.fillRect(Math.round(rx+(43.6+52.5)/105*(RWd-3))+1,Math.round(ry+(-1.25+34)/68*(RHd-3))+1,2,2);
    return;
  }
  if(bino){
    hg.fillStyle='#030303';hg.fillRect(0,0,RW,RH);hg.globalCompositeOperation='destination-out';
    for(const cx of[RW/2-60,RW/2+60]){hg.beginPath();hg.arc(cx,RH/2,122,0,6.3);hg.fill();}
    hg.globalCompositeOperation='source-over';return;
  }
  if(!tags)return;
  for(const a of actors){
    if(a.kit!=='home')continue;
    PV.set(a.x,a.top+0.35,a.z).project(camera);if(PV.z>1)continue;
    const sx=Math.round((PV.x*0.5+0.5)*RW),sy=Math.round((-PV.y*0.5+0.5)*RH),s=String(a.num),cw=w(s)+4,bx=sx-(cw>>1),by=sy-9;
    const bg=a.signed?'#ffb530':'#c8281e';
    hg.fillStyle='rgba(0,0,0,0.45)';hg.fillRect(bx+1,by+1,cw,8);hg.fillStyle=bg;hg.fillRect(bx,by,cw,8);hg.fillRect(sx,by+8,1,2);
    T(s,bx+2,by,a.signed?'#1a1203':'#ffffff');
  }
}

/* ============ arayüz ve döngü ============ */
function press(b,on){b.setAttribute('aria-pressed',on?'true':'false');}
const viewSeg=$('viewSeg'),btnBino=$('btnBino'),btnTags=$('btnTags');
function setView(v){view=v;for(const x of viewSeg.querySelectorAll('button'))press(x,x.dataset.v===v);if(v==='tv'){bino=false;press(btnBino,false);}}
viewSeg.addEventListener('click',e=>{const b=e.target.closest('button');if(b)setView(b.dataset.v);});
btnBino.onclick=()=>{if(view!=='box')setView('box');bino=!bino;press(btnBino,bino);};
btnTags.onclick=()=>{tags=!tags;press(btnTags,tags);};
const btnCrt=$('btnCrt');btnCrt.onclick=()=>{const on=screenEl.classList.toggle('flat');press(btnCrt,!on);};
const btnDither=$('btnDither');btnDither.onclick=()=>{const on=postMat.uniforms.uDither.value<0.5;postMat.uniforms.uDither.value=on?1:0;press(btnDither,on);};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let last=0,time=0,swapT=0,crowdF=0;
function frame(now){
  const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;time+=dt;
  swapT+=dt;if(swapT>STIL.seyirci.kareSuresi){swapT=0;crowdF^=1;for(const c of crowdMats)c.m.map=crowdF?c.t1:c.t0;}
  for(const f of flags){const pa=f.m.geometry.attributes.position,a=pa.array;for(let i=0;i<pa.count;i++){const u=(f.base[i*3]+1.3)/2.6;a[i*3+2]=f.base[i*3+2]+Math.sin(time*5.5-u*4+f.ph)*0.2*u;}pa.needsUpdate=true;}
  fx(dt,time);
  const V=curView(),sw=reduce?0:1,hs=bino?sw:0;
  camera.position.set(V.p[0]+Math.sin(time*0.6)*0.06*sw,V.p[1]+Math.sin(time*0.9)*0.04*sw,V.p[2]);
  camera.lookAt(V.t[0]+Math.sin(time*1.7)*0.12*hs,V.t[1]+Math.sin(time*2.3)*0.08*hs,V.t[2]);
  if(camera.fov!==V.fov){camera.fov=V.fov;camera.updateProjectionMatrix();}
  camera.updateMatrixWorld();drawHUD();
  renderer.setRenderTarget(rt);renderer.setClearColor(STIL.ekran.arkaPlan,1);renderer.clear();renderer.render(scene,camera);
  if(view==='box'&&!bino){renderer.clearDepth();renderer.render(ov,ovCam);}
  renderer.setRenderTarget(null);renderer.clear();renderer.render(post,postCam);
  requestAnimationFrame(frame);
}
for(let i=0;i<90;i++){time+=0.12;fx(0.12,time);}
requestAnimationFrame(t=>{last=t;requestAnimationFrame(frame);});
