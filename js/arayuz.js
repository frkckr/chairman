/* ============ ekran üstü: yalnızca dürbün maskesi ============ */
let bino=false;
const KMR=k=>({p:[BASKAN_KOLTUGU.x,BASKAN_KOLTUGU.y+k.goz,BASKAN_KOLTUGU.z],fov:k.aci}),VIEWS={baskan:KMR(STIL.kameralar.baskan),durbun:KMR(STIL.kameralar.durbun)};
const curView=()=>bino?VIEWS.durbun:VIEWS.baskan;
function drawHUD(){
  hg.clearRect(0,0,RW,RH);
  if(!bino)return;
  hg.fillStyle='#030303';hg.fillRect(0,0,RW,RH);hg.globalCompositeOperation='destination-out';
  for(const cx of[RW*0.35,RW*0.65]){hg.beginPath();hg.arc(cx,RH/2,RH*0.407,0,6.3);hg.fill();}
  hg.globalCompositeOperation='source-over';
}

/* ============ arayüz ve döngü ============ */
function press(b,on){b.setAttribute('aria-pressed',on?'true':'false');}
const btnBino=$('btnBino');
/* dürbün: başkan elleriyle kaldırır; yüzüne gelince maske açılır. İndirirken önce maske kapanır */
btnBino.onclick=()=>{if(!bino&&!BASKAN.durbunHazir){press(btnBino,true);baskanDurbun(true,()=>{bino=true;});}else{bino=false;press(btnBino,false);baskanDurbun(false);}};
/* duraklat: tek ortak yönetim (js/sunum-durumu.js; elle duraklatma 'elle' nedenidir). Maç, tribün, bayraklar, meşaleler, kamera, eller ve dürbün
   durur; oda, yürüyüş ve balkon da aynı yönetimle durur. Ekranı karartmayan küçük "Duraklatıldı" göstergesi açılır. Kısayol: boşluk ya da P */
const btnDuraklat=$('btnDuraklat'),duraklatGosterge=$('duraklatildi');
function duraklatDegistir(){if(duraklatmaVar('elle'))duraklatmaKaldir('elle');else duraklatmaEkle('elle');}
btnDuraklat.onclick=duraklatDegistir;
duraklatmaDinle(a=>{const e=duraklatmaVar('elle');press(btnDuraklat,e);btnDuraklat.textContent=e?'Devam':'Duraklat';btnBino.disabled=a;if(duraklatGosterge)duraklatGosterge.hidden=!a;});
/* maça geç: maç öncesini (ısınma, tören, tokalaşma, fotoğraf, yazı tura) atlar; santrada düğme kaybolur */
const btnMacaGec=$('btnMacaGec');btnMacaGec.onclick=()=>{macaGecIste();btnMacaGec.hidden=true;};
/* boşluk ya da P duraklatır (sayfa kaymaz); odaktaki düğmede boşluk düğmeyi çalıştırır. Oda açıkken kısayolu oda ekranı işler (js/ekran-oda.js) */
addEventListener('keydown',e=>{if((e.code!=='Space'&&e.code!=='KeyP')||e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;const t=e.target&&e.target.tagName;
  if(t==='INPUT'||t==='TEXTAREA'||(t==='BUTTON'&&e.code==='Space'))return;if(ON_EKRAN.sayfa==='oda')return;e.preventDefault();duraklatDegistir();});
/* maç hızı ve baştan başlatma */
{const ayarlaHiz=v=>{MAC_HIZ.deger=v;for(const b of $('hizSeg').querySelectorAll('button[data-hiz]'))press(b,+b.dataset.hiz===v);};
 for(const b of $('hizSeg').querySelectorAll('button[data-hiz]'))b.onclick=()=>ayarlaHiz(+b.dataset.hiz);ayarlaHiz(MAC_HIZ.deger);
 $('btnBastan').onclick=()=>location.reload();}
/* deneme paneli: doluluk ve zemin adres satırına yazılır, sayfa yeni ayarla yeniden açılır (tek kulüp stadı; stat seçimi yok, 2.8D) */
{const ayarla=(k,v)=>{const q=new URLSearchParams(location.search);q.set(k,v);q.delete('stat');location.search=q.toString();};
 const yuzde=v=>Math.round(v*100)+'%';
 for(const [id,deger] of[['doluluk',MAC_GUNU.doluluk],['zemin',MAC_GUNU.zemin]]){const el=$(id),out=$(id+'Deger');el.value=Math.round(deger*100);out.textContent=yuzde(deger);
   el.oninput=()=>{out.textContent=el.value+'%';};el.onchange=()=>ayarla(id,(el.value/100).toFixed(2));}
 $('statBilgi').textContent=STAT.ad+' · '+STAT.lig+' · kapasite '+STAT_KAPASITE.toLocaleString('tr-TR')+' · bu akşam '+SEYIRCI_SAYISI.toLocaleString('tr-TR')+' seyirci';}
let last=0,time=0,onEkranCizildi=false;
function frame(now){
  /* başkan odası: stat yerine oda sahnesi çizilir; maç zamanı ilerlemez (js/oda.js). Odadan çıkınca stat yeniden çizilir */
  if(ON_EKRAN.sayfa==='oda'){odaKare(duraklatmaVar()?0:Math.min(0.05,Math.max(0,(now-last)/1000)));last=now;odaCiz();onEkranCizildi=false;requestAnimationFrame(frame);return;}
  /* maç öncesi ekranı açıkken maç günü başlamaz: stat bir kez çizilir, menünün arkasında donuk durur */
  if(ON_EKRAN.acik&&onEkranCizildi){last=now;requestAnimationFrame(frame);return;}
  const gercekDt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;
  const dt=duraklatmaVar()||ON_EKRAN.acik?0:gercekDt;time+=dt;
  const az=hareketAz();
  if(!az)SEYIRCI_ZAMAN.value=time;
  for(const f of flags){const pa=f.m.geometry.attributes.position,a=pa.array;for(let i=0;i<pa.count;i++){const u=(f.base[i*3]+1.3)/2.6;a[i*3+2]=f.base[i*3+2]+Math.sin(time*5.5-u*4+f.ph)*0.2*u;}pa.needsUpdate=true;}
  fx(dt,time);
  macKare(dt);baskanZaman(dt);
  if(!btnMacaGec.hidden&&!MAC_ONCESI.includes(mac.phase))btnMacaGec.hidden=true;
  const V=curView(),sw=az?0:1,hs=bino?sw:0,B=BAKIS,ug=Math.hypot(B.x-V.p[0],B.z-V.p[2])*(bino?0.015:STIL.kameralar.baskan.egim);
  const kalk=BASKAN.kalk,sars=kalk>0.4?(Math.sin(time*31)*0.012+Math.sin(time*23)*0.008)*sw:0;
  camera.position.set(V.p[0]+Math.sin(time*0.6)*0.03*sw+sars,V.p[1]+Math.sin(time*0.9)*0.02*sw+kalk*0.38,V.p[2]+kalk*0.12);
  /* bakış çok dik aşağı inmesin: masa ve tünel ağzı ekranı kaplamasın */
  const yat=Math.hypot(B.x-camera.position.x,B.z-camera.position.z),ly=Math.max(B.y-ug,camera.position.y-yat*Math.tan(STIL.kameralar.baskan.asagiSinir));
  camera.lookAt(B.x+Math.sin(time*1.7)*0.08*hs,ly+Math.sin(time*2.3)*0.05*hs,B.z);
  if(camera.fov!==V.fov){camera.fov=V.fov;camera.updateProjectionMatrix();}
  camera.updateMatrixWorld();baskanKare(dt,camera);drawHUD();
  renderer.setRenderTarget(rt);renderer.setClearColor(STIL.ekran.arkaPlan,1);renderer.clear();renderer.render(scene,camera);
  if(!bino)baskanCiz();
  renderer.setRenderTarget(null);renderer.clear();renderer.render(post,postCam);
  onEkranCizildi=ON_EKRAN.acik;if(ON_EKRAN.acik)ON_EKRAN.cizildi=true;
  requestAnimationFrame(frame);
}
for(let i=0;i<90;i++){time+=0.12;fx(0.12,time);}
requestAnimationFrame(t=>{last=t;requestAnimationFrame(frame);});
