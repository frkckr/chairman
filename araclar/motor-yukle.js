/* ============ Chairman — maç motorunu Node'da yükleme (M0, 2026-10-07) ============
   Motor dosyaları index.html'deki sırayla yüklenir: js/goruntu.js'ten önceki mantık dosyaları (stil ve stat tarifleri hariç; motor onlara
   bağlı değildir). Kullananlar: araclar/mac-deneme.js (ve senaryoları), araclar/oyuncu-karnesi.js, araclar/hiz-olcum.js.
   Bağlam vm.constants.DONT_CONTEXTIFY ile kurulur: tarayıcıdaki gibi sıradan bir genel nesnedir. Eski yol (createContext({console,Math,Date}))
   genel nesneyi bir ara katmanla (interceptor) sarıyordu; Math, Object ve "function" ile bildirilen üst düzey adlara her erişim bu katmandan
   geçtiği için motor tarayıcıdakinden belirgin yavaş koşuyordu (mac-hareket.js'teki "hızlı matematik" notu bunun içindi).
   Sonuç değişmez: motor yalnız kendi tohumlu rastlantısını kullanır, Math işlevleri aynı V8 uygulamasıdır; üst düzey işlev bildirimleri yine
   genel nesnenin alanıdır (ctx.topFizikAdim), const/let adlarına vm.runInContext('AD', ctx) ile erişilir.
   MOTOR_YUKLE_ESKI=1 eski yolu seçer (karşılaştırma için). */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const KOK=path.join(__dirname,'..');
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
  return{ctx,mantik,kip:eski?'eski (sarılı bağlam)':'hızlı (sıradan genel nesne)'};
}
module.exports={motorYukle,mantikDosyalari,KOK};
