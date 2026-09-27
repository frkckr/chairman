/* ============ ekran üstü: yalnızca dürbün maskesi ============ */
let bino=false;
const KMR=k=>({p:[BASKAN_KOLTUGU.x,BASKAN_KOLTUGU.y+k.goz,BASKAN_KOLTUGU.z],t:k.hedef,fov:k.aci}),VIEWS={baskan:KMR(STIL.kameralar.baskan),durbun:KMR(STIL.kameralar.durbun)};
const curView=()=>bino?VIEWS.durbun:VIEWS.baskan;
function drawHUD(){
  hg.clearRect(0,0,RW,RH);
  if(!bino)return;
  hg.fillStyle='#030303';hg.fillRect(0,0,RW,RH);hg.globalCompositeOperation='destination-out';
  for(const cx of[RW/2-60,RW/2+60]){hg.beginPath();hg.arc(cx,RH/2,122,0,6.3);hg.fill();}
  hg.globalCompositeOperation='source-over';
}

/* ============ arayüz ve döngü ============ */
function press(b,on){b.setAttribute('aria-pressed',on?'true':'false');}
const btnBino=$('btnBino');
btnBino.onclick=()=>{bino=!bino;press(btnBino,bino);};
/* deneme paneli: stat, doluluk ve zemin adres satırına yazılır, sayfa yeni ayarla yeniden açılır */
{const ayarla=(k,v)=>{const q=new URLSearchParams(location.search);q.set(k,v);if(k==='stat'){q.delete('doluluk');q.delete('zemin');}location.search=q.toString();};
 for(const b of $('statSeg').querySelectorAll('button')){press(b,b.dataset.stat===MAC_GUNU.stat);b.onclick=()=>ayarla('stat',b.dataset.stat);}
 const yuzde=v=>Math.round(v*100)+'%';
 for(const [id,deger] of[['doluluk',MAC_GUNU.doluluk],['zemin',MAC_GUNU.zemin]]){const el=$(id),out=$(id+'Deger');el.value=Math.round(deger*100);out.textContent=yuzde(deger);
   el.oninput=()=>{out.textContent=el.value+'%';};el.onchange=()=>ayarla(id,(el.value/100).toFixed(2));}
 $('statBilgi').textContent=STAT.ad+' · '+STAT.lig+' · kapasite '+STAT_KAPASITE.toLocaleString('tr-TR')+' · bu akşam '+SEYIRCI_SAYISI.toLocaleString('tr-TR')+' seyirci';}
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
  renderer.setRenderTarget(null);renderer.clear();renderer.render(post,postCam);
  requestAnimationFrame(frame);
}
for(let i=0;i<90;i++){time+=0.12;fx(0.12,time);}
requestAnimationFrame(t=>{last=t;requestAnimationFrame(frame);});
