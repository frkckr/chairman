'use strict';
/* ============ Z1 (2026-10-19): plan katmanının kendi sayaçları — FUTBOL_KUTUPHANESI §11.1 madde 1 ============
   Yalnız 'plan' olaylarını okur (js/mac-plan.js planOlay): ilkel başına teklif, başlatma, tamamlanma, bozulma nedenleri; derin koşuda koşu başı −
   pas çıkışı ve taşıyanın bekleme süresi. Plan katmanının kendi sayımıdır: görünürlük kabulü bağımsız ölçüdedir (z-kalip.js); burada sağlık ve teşhis
   (teklif kabulü, zaman aşımı payı). Rastlantı çekmez, motor yöntemi çağırmaz. MOTOR_AYAR.plan 0 iken bütün satırlar 0 ya da —. */
const ZP_ILK=['duvarPasi','ucuncuAdam','derinKosu','geriCevirme'],ZP_AD={duvarPasi:'duvar pası',ucuncuAdam:'üçüncü adam',derinKosu:'derin koşu',geriCevirme:'geri çevirme'};
const ZP_NEDEN=['savunma','teknik','vazgecti','zaman','kayip','ofsayt','hat','kesildi','durus'];
const ZP_MED=a=>{if(!a.length)return NaN;const s=[...a].sort((x,y)=>x-y);return s[s.length>>1];};
module.exports={
  bilgi:[['— Z: plan katmanı (kendi sayaçları; teşhis — kabul bağımsız ölçüde, z-kalip) —',null,0]]
    .concat(...ZP_ILK.map(k=>[[`Plan ${ZP_AD[k]}: teklif / maç`,'zpT_'+k,2],[`Plan ${ZP_AD[k]}: başladı / maç`,'zpB_'+k,2],[`Plan ${ZP_AD[k]}: tamamlandı / maç`,'zpOk_'+k,2],
      [`Plan ${ZP_AD[k]}: tamamlanma % (başlayanda)`,'zpOkP_'+k,1]]))
    .concat([['Plan: teklif kabulü % (duvar pası ve üçüncü adam)','zpKabul',1]])
    .concat(ZP_NEDEN.map(n=>[`Plan: bozulma nedeni ${n} % (bütün bozulmalar)`,'zpN_'+n,1]))
    .concat([['Plan derin koşu: koşu başı − pas çıkışı ortancası (sn)','zpKosuPas',2],['Plan derin koşu: taşıyanın bekleme ortancası (sn)','zpBekle',2],
      ['Plan üçüncü adam: C koşusu B’nin pasından önce % (tamamlananlarda; B2b)','zpUcOnce',1]]),
  ozet(sonuclar){
    let n=0;for(const s of sonuclar)for(const k of ZP_ILK)n+=s['zpB_'+k]||0;if(!n)return;
    const dt=[];for(const s of sonuclar)if(s._zpKP)dt.push(...s._zpKP);
    console.log(`  Z plan (havuz): derin koşuda koşu başı − pas çıkışı ortanca ${ZP_MED(dt).toFixed(2)} sn (n ${dt.length})`);},
  yeni:()=>{
    const T={},B={},OK={},N={},KP=[],BK=[];let teklif=0,kabul=0,boz=0,ucOnce=0,ucN=0;for(const k of ZP_ILK){T[k]=0;B[k]=0;OK[k]=0;}for(const n of ZP_NEDEN)N[n]=0;
    return{
      dinle(ad,v){if(ad!=='plan')return;const k=v.ilkel;if(!(k in T))return;
        if(v.olay==='teklif'){T[k]++;teklif++;}
        else if(v.olay==='basladi'){B[k]++;if(k==='duvarPasi'||k==='ucuncuAdam')kabul++;}
        else if(v.olay==='tamamlandi'){OK[k]++;if(v.kosuPas!=null&&k==='derinKosu')KP.push(+v.kosuPas.toFixed(2));if(v.bekle!=null)BK.push(v.bekle);
          if(k==='ucuncuAdam'&&v.kosuPas!=null){ucN++;if(v.kosuPas<0)ucOnce++;}}
        else if(v.olay==='bozuldu'){boz++;if(v.neden in N)N[v.neden]++;if(v.kosuPas!=null&&k==='derinKosu')KP.push(+v.kosuPas.toFixed(2));}},
      bitir(){const r={ham:{zpKabul:[kabul,teklif],zpUcOnce:[ucOnce,ucN]},zpKosuPas:ZP_MED(KP),zpBekle:ZP_MED(BK),_zpKP:KP};
        for(const k of ZP_ILK){r['zpT_'+k]=T[k];r['zpB_'+k]=B[k];r['zpOk_'+k]=OK[k];r.ham['zpOkP_'+k]=[OK[k],B[k]];}
        for(const n of ZP_NEDEN)r.ham['zpN_'+n]=[N[n],boz];
        return r;}
    };
  }
};
