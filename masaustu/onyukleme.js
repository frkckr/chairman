/* ============ Chairman — masaüstü ön yükleme ============
   Sayfaya yalnız kayıt deposu köprüsünü açar (window.chairmanMasaustu). Sayfa Node.js'e ve dosya sistemine doğrudan erişemez;
   dosya işlemlerini ana süreç (ana.js) yapar. Kullanan: js/depo-masaustu.js */
'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('chairmanMasaustu',{
  depo:{
    oku:ad=>ipcRenderer.sendSync('depo:oku',String(ad)),
    yaz:(ad,metin)=>ipcRenderer.sendSync('depo:yaz',String(ad),String(metin)),
    sil:ad=>ipcRenderer.sendSync('depo:sil',String(ad)),
    dizin:()=>ipcRenderer.sendSync('depo:dizin')
  }
});
