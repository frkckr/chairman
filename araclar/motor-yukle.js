/* ============ Chairman — maç motorunu Node'da yükleme (M0, 2026-10-07) ============
   Motor dosyaları index.html'deki sırayla yüklenir: js/goruntu.js'ten önceki mantık dosyaları (stil ve stat tarifleri hariç; motor onlara
   bağlı değildir). Kullananlar: araclar/mac-deneme.js (ve senaryoları), araclar/oyuncu-karnesi.js, araclar/hiz-olcum.js.
   Bağlam vm.constants.DONT_CONTEXTIFY ile kurulur: tarayıcıdaki gibi sıradan bir genel nesnedir. Eski yol (createContext({console,Math,Date}))
   genel nesneyi bir ara katmanla (interceptor) sarıyordu; Math, Object ve "function" ile bildirilen üst düzey adlara her erişim bu katmandan
   geçtiği için motor tarayıcıdakinden belirgin yavaş koşuyordu (mac-hareket.js'teki "hızlı matematik" notu bunun içindi).
   Sonuç değişmez: motor yalnız kendi tohumlu rastlantısını kullanır, Math işlevleri aynı V8 uygulamasıdır; üst düzey işlev bildirimleri yine
   genel nesnenin alanıdır (ctx.topFizikAdim), const/let adlarına vm.runInContext('AD', ctx) ile erişilir.
   MOTOR_YUKLE_ESKI=1 eski yolu seçer (karşılaştırma için).
   M1 (2026-10-10): MOTOR_KOK=<klasör> motoru başka bir çalışma ağacından yükler (index.html ve js/ o klasörden, araçlar bu depodan): hız
   kabulünde önceki turun kodu aynı araçla ölçülür (git worktree add --detach <klasör> <commit>; klasör depo dışında). ayarUygula
   MAC_DENEME_AYAR'ı (JSON) MOTOR_AYAR'a yazar; geçersiz JSON ya da MOTOR_AYAR'da bildirilmemiş anahtar çıkış 2'dir (mac-deneme.js,
   oyuncu-karnesi.js, hiz-olcum.js). */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const KOK=process.env.MOTOR_KOK?path.resolve(process.env.MOTOR_KOK):path.join(__dirname,'..');
const DISARIDA=new Set(['js/stil-99.js','js/sunum-durumu.js','js/stadyum-tarifleri.js']);
function mantikDosyalari(){
  const html=fs.readFileSync(path.join(KOK,'index.html'),'utf8');
  const sira=[...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m=>m[1]);
  return sira.slice(0,sira.indexOf('js/goruntu.js')).filter(f=>!DISARIDA.has(f));
}
/* ek: bağlama konacak ek adlar (ör. oyuncu-karnesi'nin __kayit'ı) */
function motorYukle(ek){
  const mantik=mantikDosyalari();
  const eski=process.env.MOTOR_YUKLE_ESKI==='1'||!(vm.constants&&vm.constants.DONT_CONTEXTIFY);
  let ctx;
  if(eski)ctx=vm.createContext(Object.assign({console,Math,Date},ek));
  else{ctx=vm.createContext(vm.constants.DONT_CONTEXTIFY);ctx.console=console;if(ek)Object.assign(ctx,ek);}
  for(const f of mantik)vm.runInContext(fs.readFileSync(path.join(KOK,f),'utf8'),ctx,{filename:f});
  /* M1 (2026-10-10): MOTOR_AYAR'da bildirilip değeri hiçbir akışta atanmamış anahtar (js/mac-motoru.js MOTOR_AYAR, ayarEkle) */
  const bos=vm.runInContext('Object.keys(MOTOR_AYAR).filter(k=>MOTOR_AYAR[k]===undefined)',ctx);
  if(bos.length)throw new Error('MOTOR_AYAR: değeri atanmamış anahtar: '+bos.join(', ')+' (akışın ayarEkle\'sine ekleyin)');
  return{ctx,mantik,kip:(eski?'eski (sarılı bağlam)':'hızlı (sıradan genel nesne)')+(process.env.MOTOR_KOK?' · motor '+KOK:'')};
}
/* metin: MAC_DENEME_AYAR biçiminde JSON (boşsa bir şey yapmaz). Döner: uygulanan nesne ya da null */
function ayarUygula(ctx,metin){
  if(!metin)return null;
  let o;try{o=JSON.parse(metin);}catch(e){console.error('MAC_DENEME_AYAR geçerli JSON değil: '+e.message);process.exit(2);}
  const yok=Object.keys(o).filter(k=>!vm.runInContext(`Object.prototype.hasOwnProperty.call(MOTOR_AYAR,${JSON.stringify(k)})`,ctx));
  if(yok.length){console.error('MAC_DENEME_AYAR: MOTOR_AYAR içinde olmayan anahtar: '+yok.join(', '));process.exit(2);}
  vm.runInContext(`Object.assign(MOTOR_AYAR,${JSON.stringify(o)})`,ctx);
  return o;
}
module.exports={motorYukle,mantikDosyalari,ayarUygula,KOK};
