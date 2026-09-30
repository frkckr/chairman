/* ============ Chairman — masaüstü ana süreç (Electron) ============
   Platform katmanıdır; oyun kurallarını bilmez. Görevleri:
   - masaustu/oyun/ kopyasını (hazirla.js üretir) pencerede açmak. F11 tam ekran.
   - Çevrimdışı çalışmayı zorlamak: file:, data:, blob: dışındaki bütün istekler engellenir ve kaydedilir.
   - Kayıt deposu: onyukleme.js köprüsünden gelen oku/yaz/sil isteklerini kullanıcı veri klasöründe dosyaya çevirmek.
     Windows: %APPDATA%\Chairman\kayitlar\<ad>.json. Yazım önce geçici dosyaya yapılır, diske işlenir, sonra yerine taşınır.
   Deneme bayrakları (masaustu/deneme.js kullanır):
     --deneme=<sonuç klasörü> --asama=1|2   1: oyunu aç, hataları/engellenen istekleri topla, ekran görüntüsü al, kaydet.
                                            2: ayrı açılışta kaydı yükle ve devam et. Sonuç sonuc-<aşama>.json.
     --kayit-dizini=<klasör>                kullanıcı veri klasörünü değiştirir (Türkçe karakterli yol denemesi için). */
'use strict';
const {app,BrowserWindow,ipcMain,session,Menu}=require('electron');
const fs=require('fs'),path=require('path');

const bayrak=ad=>{const a=process.argv.find(x=>x.startsWith(`--${ad}=`));return a?a.slice(ad.length+3):null;};
const DENEME=bayrak('deneme'),ASAMA=bayrak('asama')||'1',KAYIT_KOK=bayrak('kayit-dizini');
if(KAYIT_KOK)app.setPath('userData',KAYIT_KOK);
const OYUN=path.join(__dirname,'oyun');
const engellenen=[];

/* ---- tek açık kopya: iki pencere aynı kaydı aynı anda yazmasın ---- */
if(!DENEME&&!app.requestSingleInstanceLock()){app.quit();}

/* ---- kayıt deposu ---- */
const kayitDizini=()=>path.join(app.getPath('userData'),'kayitlar');
function dosya(ad){
  if(!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(ad)||ad.includes('..'))throw new Error(`Geçersiz kayıt adı: ${ad}`);
  return path.join(kayitDizini(),ad+'.json');
}
function guvenliYaz(f,metin){
  fs.mkdirSync(path.dirname(f),{recursive:true});
  const gecici=f+'.gecici',fd=fs.openSync(gecici,'w');
  try{fs.writeSync(fd,metin,null,'utf8');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  fs.renameSync(gecici,f);
}
const yanit=(e,is)=>{try{e.returnValue=Object.assign({tamam:true},is());}catch(x){e.returnValue={tamam:false,hata:x.message};}};
ipcMain.on('depo:oku',(e,ad)=>yanit(e,()=>{const f=dosya(ad);return{metin:fs.existsSync(f)?fs.readFileSync(f,'utf8'):null};}));
ipcMain.on('depo:yaz',(e,ad,metin)=>yanit(e,()=>{guvenliYaz(dosya(ad),metin);return{};}));
ipcMain.on('depo:sil',(e,ad)=>yanit(e,()=>{fs.rmSync(dosya(ad),{force:true});return{};}));
ipcMain.on('depo:dizin',e=>{e.returnValue=kayitDizini();});

function pencereAc(){
  Menu.setApplicationMenu(null);
  const p=new BrowserWindow({
    width:1280,height:860,minWidth:960,minHeight:640,title:'Chairman',backgroundColor:'#000000',show:!DENEME,
    webPreferences:{preload:path.join(__dirname,'onyukleme.js'),contextIsolation:true,sandbox:true,nodeIntegration:false}
  });
  p.webContents.on('before-input-event',(e,g)=>{if(g.type==='keyDown'&&g.key==='F11'){p.setFullScreen(!p.isFullScreen());e.preventDefault();}});
  p.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  p.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('file:'))e.preventDefault();});
  return p;
}

const bekle=ms=>new Promise(r=>setTimeout(r,ms));
async function deneme(p){
  const wc=p.webContents,sonuc={asama:ASAMA,electron:process.versions.electron,chrome:process.versions.chrome,
    uygulamaYolu:__dirname,paketli:app.isPackaged,kayitDizini:kayitDizini(),hatalar:[],engellenen};
  wc.on('console-message',(e,seviye,mesaj)=>{
    const sv=e&&e.level!==undefined?e.level:seviye,m=e&&e.message!==undefined?e.message:mesaj;
    if(sv==='error'||sv===3)sonuc.hatalar.push('Konsol: '+m);
  });
  wc.on('preload-error',(e,yol,hata)=>sonuc.hatalar.push('Ön yükleme: '+hata.message));
  wc.on('render-process-gone',(e,d)=>sonuc.hatalar.push('Sayfa süreci kapandı: '+d.reason));
  wc.on('did-fail-load',(e,kod,aciklama,url)=>sonuc.hatalar.push(`Yüklenemedi: ${url} (${aciklama})`));
  try{
    if(ASAMA==='1'){
      /* açılış ekranı başkan odasıdır: kariyer diskten yüklenir ya da yeni kariyer oluşturulup kaydedilir */
      await p.loadFile(path.join(OYUN,'index.html'));
      await bekle(8000);
      fs.writeFileSync(path.join(DENEME,'oyun.png'),(await wc.capturePage()).toPNG());
      sonuc.acilis=await wc.executeJavaScript(`(()=>{const a=document.getElementById('oda');const e=typeof OYUN!=='undefined'?OYUN:{};
        return{gorunur:!!a&&!a.hidden&&!!a.querySelector('.od-ana'),depo:e.depo||null,tarih:e.kariyer?e.kariyer.tarih:null};})()`);
      /* bülten doğrudan açılır; İlerle: bülten kapanır, 3B maç günü (WebGL) başlar */
      await p.loadFile(path.join(OYUN,'index.html'),{query:{ekran:'bulten'}});
      await bekle(6000);
      sonuc.ilerle=await wc.executeJavaScript(`(()=>{const b=document.getElementById('btnIlerle');if(!b)return false;b.click();return true;})()`);
      await bekle(10000);
      fs.writeFileSync(path.join(DENEME,'mac-gunu.png'),(await wc.capturePage()).toPNG());
      sonuc.webgl=await wc.executeJavaScript(`(()=>{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'));})()`);
      sonuc.oyun=await wc.executeJavaScript(`document.fonts.ready.then(()=>({baslik:document.title,
        three:typeof THREE!=='undefined'?THREE.REVISION:null,
        yaziTipleri:[...new Set([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replace(/"/g,'')+' '+f.weight))]}))`);
    }
    await p.loadFile(path.join(OYUN,'araclar','kayit-deneme.html'),{query:{depo:'masaustu',asama:ASAMA}});
    for(let i=0;i<50&&!sonuc.kayit;i++){sonuc.kayit=await wc.executeJavaScript('window.__denemeSonucu||null');if(!sonuc.kayit)await bekle(200);}
    if(!sonuc.kayit)sonuc.hatalar.push('Kayıt denemesi sonuç vermedi');
  }catch(x){sonuc.hatalar.push('Deneme hatası: '+x.message);}
  /* kayıt sayfası bilinçli olarak bozuk kayıt denediğinde sayfa hatası üretmez; başarısızlık yalnız sonuçtan okunur */
  sonuc.tamam=!sonuc.hatalar.length&&!engellenen.length&&!!(sonuc.kayit&&sonuc.kayit.tamam);
  fs.writeFileSync(path.join(DENEME,`sonuc-${ASAMA}.json`),JSON.stringify(sonuc,null,2));
  app.exit(sonuc.tamam?0:1);
}

app.whenReady().then(()=>{
  session.defaultSession.webRequest.onBeforeRequest((d,cb)=>{
    if(/^(file|data|blob|devtools):/.test(d.url)){cb({});return;}
    engellenen.push(d.url);cb({cancel:true});
  });
  session.defaultSession.setPermissionRequestHandler((wc,izin,cb)=>cb(false));
  const p=pencereAc();
  if(DENEME){fs.mkdirSync(DENEME,{recursive:true});deneme(p);}
  else p.loadFile(path.join(OYUN,'index.html'));
});
app.on('window-all-closed',()=>app.quit());
