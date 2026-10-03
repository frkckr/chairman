/* ============ ekran üstü: yalnızca dürbün maskesi ============ */
let bino=false;
const KMR=k=>({p:[BASKAN_KOLTUGU.x,BASKAN_KOLTUGU.y+k.goz,BASKAN_KOLTUGU.z],fov:k.aci}),VIEWS={baskan:KMR(STIL.kameralar.baskan),durbun:KMR(STIL.kameralar.durbun)};
const curView=()=>bino?VIEWS.durbun:VIEWS.baskan;
/* dürbün maskesi ızgarada çizilir (hud tuvali RW×RH, js/goruntu.js) */
function drawHUD(){
  const W=hud.width,H=hud.height;hg.clearRect(0,0,W,H);
  if(!bino)return;
  hg.fillStyle='#030303';hg.fillRect(0,0,W,H);hg.globalCompositeOperation='destination-out';
  for(const cx of[W*0.35,W*0.65]){hg.beginPath();hg.arc(cx,H/2,H*0.407,0,6.3);hg.fill();}
  hg.globalCompositeOperation='source-over';
}

/* ============ arayüz ve döngü ============ */
function press(b,on){b.setAttribute('aria-pressed',on?'true':'false');}
const btnBino=$('btnBino');
/* dürbün: başkan elleriyle kaldırır; yüzüne gelince maske açılır ve bakış topa kilitlenir (js/kamera.js). İndirirken önce maske kapanır.
   Kısayol: D (maçta; oda açıkken ya da duraklatılmışken çalışmaz) */
btnBino.onclick=()=>{if(!bino&&!BASKAN.durbunHazir){press(btnBino,true);baskanDurbun(true,()=>{bino=true;});}else{bino=false;press(btnBino,false);baskanDurbun(false);}};
addEventListener('keydown',e=>{if(e.code!=='KeyD'||e.repeat||e.ctrlKey||e.altKey||e.metaKey||ON_EKRAN.sayfa!==null||btnBino.disabled)return;const t=e.target&&e.target.tagName;
  if(t==='INPUT'||t==='TEXTAREA'||(typeof MAC_TELEFON!=='undefined'&&MAC_TELEFON.acik))return;e.preventDefault();btnBino.onclick();});
/* Topu izle (2026-10-03 ikinci paket): açıkken bakış topu kendiliğinden izler (js/kamera.js); kapalıyken (varsayılan) baş fareyle ya da ok
   tuşlarıyla elle döner. Sürüklemek takibi kapatır. Kısayol: F (D ile aynı koşullarda) */
const btnTopIzle=$('btnTopIzle');btnTopIzle.onclick=()=>kameraTakipAyarla(!KAM.takip);
addEventListener('keydown',e=>{if(e.code!=='KeyF'||e.repeat||e.ctrlKey||e.altKey||e.metaKey||ON_EKRAN.sayfa!==null||btnTopIzle.disabled)return;const t=e.target&&e.target.tagName;
  if(t==='INPUT'||t==='TEXTAREA'||(typeof MAC_TELEFON!=='undefined'&&MAC_TELEFON.acik))return;e.preventDefault();btnTopIzle.onclick();});
/* duraklat: tek ortak yönetim (js/sunum-durumu.js; elle duraklatma 'elle' nedenidir). Maç, tribün, bayraklar, meşaleler, kamera, eller ve dürbün
   durur; oda, yürüyüş ve balkon da aynı yönetimle durur. Ekranı karartmayan küçük "Duraklatıldı" göstergesi açılır. Kısayol: boşluk ya da P */
const btnDuraklat=$('btnDuraklat'),duraklatGosterge=$('duraklatildi');
function duraklatDegistir(){if(duraklatmaVar('elle'))duraklatmaKaldir('elle');else duraklatmaEkle('elle');}
btnDuraklat.onclick=duraklatDegistir;
/* geliştirici panelindeki Durdur/Devam aynı ortak duraklatmayı kullanır (2.8O) */
const btnDurdur=$('btnDurdur');btnDurdur.onclick=duraklatDegistir;
duraklatmaDinle(a=>{const e=duraklatmaVar('elle');press(btnDuraklat,e);btnDuraklat.textContent=e?'Devam':'Duraklat';press(btnDurdur,e);btnDurdur.textContent=e?'Devam':'Durdur';btnBino.disabled=a;btnTopIzle.disabled=a;if(duraklatGosterge)duraklatGosterge.hidden=!a;});
/* maça geç: maç öncesini (ısınma, tören, tokalaşma, fotoğraf, yazı tura) atlar; santrada düğme kaybolur */
const btnMacaGec=$('btnMacaGec');btnMacaGec.onclick=()=>{macaGecIste();btnMacaGec.hidden=true;};
/* boşluk ya da P duraklatır (sayfa kaymaz); odaktaki düğmede boşluk düğmeyi çalıştırır. Oda açıkken kısayolu oda ekranı işler (js/ekran-oda.js) */
addEventListener('keydown',e=>{if((e.code!=='Space'&&e.code!=='KeyP')||e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;const t=e.target&&e.target.tagName;
  if(t==='INPUT'||t==='TEXTAREA'||(t==='BUTTON'&&e.code==='Space'))return;if(ON_EKRAN.sayfa==='oda')return;e.preventDefault();duraklatDegistir();});
/* geliştirici paneli (2.8O, kullanıcı kararı 2026-10-02): yalnız maç hızı ve durdurma. Doluluk, zemin ve baştan başlatma kaldırıldı;
   doluluk ve zemin stat tarifinden gelir (js/stadyum-tarifleri.js) */
{const ayarlaHiz=v=>{MAC_HIZ.deger=v;for(const b of $('hizSeg').querySelectorAll('button[data-hiz]'))press(b,+b.dataset.hiz===v);};
 for(const b of $('hizSeg').querySelectorAll('button[data-hiz]'))b.onclick=()=>ayarlaHiz(+b.dataset.hiz);ayarlaHiz(MAC_HIZ.deger);}
let last=0,time=0,onEkranCizildi=false;
function frame(now){
  /* başkan odası: stat yerine oda sahnesi çizilir; maç zamanı ilerlemez (js/oda.js). Odadan çıkınca stat yeniden çizilir */
  if(ON_EKRAN.sayfa==='oda'){odaKare(duraklatmaVar()?0:Math.min(0.05,Math.max(0,(now-last)/1000)));last=now;odaCiz();onEkranCizildi=false;requestAnimationFrame(frame);return;}
  /* maç öncesi ekranı açıkken maç günü başlamaz: stat bir kez çizilir, menünün arkasında donuk durur */
  if(ON_EKRAN.acik&&onEkranCizildi){last=now;requestAnimationFrame(frame);return;}
  const gercekDt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;
  const dt=duraklatmaVar()||ON_EKRAN.acik?0:gercekDt;time+=dt;
  SEYIRCI_ZAMAN.value=time;
  for(const f of flags){const pa=f.m.geometry.attributes.position,a=pa.array;for(let i=0;i<pa.count;i++){const u=(f.base[i*3]+1.3)/2.6;a[i*3+2]=f.base[i*3+2]+Math.sin(time*5.5-u*4+f.ph)*0.2*u;}pa.needsUpdate=true;}
  fx(dt,time);
  macKare(dt);baskanZaman(dt);
  if(typeof locaGirisKare==='function')locaGirisKare(dt);   /* js/loca-giris.js (2.8T) */
  if(!btnMacaGec.hidden&&!MAC_ONCESI.includes(mac.phase))btnMacaGec.hidden=true;
  kameraUygula(curView());   /* js/kamera.js */
  okunurlukKare();           /* js/okunurluk.js: topun asgari boyu, havadaki topun lekesi */
  camera.updateMatrixWorld();baskanKare(dt,camera);drawHUD();
  /* ornekleme katında, oda ve balkonla aynı hedefe (js/goruntu.js) */
  renderer.setRenderTarget(rt);renderer.setClearColor(STIL.ekran.arkaPlan,1);renderer.clear();renderer.render(scene,camera);
  if(!bino)baskanCiz();
  renderer.setRenderTarget(null);renderer.clear();renderer.render(post,postCam);
  onEkranCizildi=ON_EKRAN.acik;if(ON_EKRAN.acik)ON_EKRAN.cizildi=true;
  requestAnimationFrame(frame);
}
for(let i=0;i<90;i++){time+=0.12;fx(0.12,time);}
requestAnimationFrame(t=>{last=t;requestAnimationFrame(frame);});
