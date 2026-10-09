/* ============ C akışı ölçümü: müdahale türü ve sonucu, omuz mücadelesi, düşüş ve faul nedenleri, kart gerekçesi, avantaj ============
   Olaylardan sayar (rastlantı çekmez, motor yöntemi çağırmaz). Değerler maç başına adettir. */
'use strict';
const TUR=['acik','donus','erken','kayma','yan','toparlanma']   /* T4'ten beri motor sırttan dalış yerine 'donus' yayar (2026-10-09 düzeltme) */,SONUC=['temiz','durttu','blok','gecildi','faul'],NEDEN=['faul','omuz','kayma','hava','takilma'],FN=['mudahale','kayma','itme','hava'],KART=['siddet','atak','firsat','asiri'];
const bas=s=>s.charAt(0).toUpperCase()+s.slice(1);
/* T5 (2026-10-09): faulün kaynağı (temastan: müdahale, kayma, gövde çarpması, omuz, ayağa basma, hava; kasıt: taktik) ve hakemin görmediği faul */
const KAYNAK=['mudahale','kayma','carpma','omuz','basma','hava','taktik'];
module.exports={
  bilgi:[['— C: müdahale, omuz, düşüş, kart —',null,0]]
    .concat(TUR.map(t=>['Müdahale türü: '+t,'cMt'+bas(t),1]))
    .concat(TUR.map(t=>['Müdahale kazandı (adet, '+t+')','cMk'+bas(t),1]))
    .concat(TUR.map(t=>['Müdahale faulü (adet, '+t+'; T5)','cMf'+bas(t),2]))
    .concat(SONUC.map(t=>['Müdahale sonucu (adet): '+t,'cMs'+bas(t),1]))
    .concat([['Omuz mücadelesi (olay, ikili)','cOmuz',1],['Omuzda faul (itme)','cOmuzFaul',2]])
    .concat(NEDEN.map(t=>['Düşüş nedeni: '+t,'cDn'+bas(t),2]))
    .concat(FN.map(t=>['Faul nedeni: '+t,'cFn'+bas(t),2]))
    .concat(KART.map(t=>['Sarı/kırmızı gerekçesi: '+t,'cK'+bas(t),2]))
    .concat([['Avantaj döndü (faule)','cAvDon',2]])
    .concat(KAYNAK.map(t=>['Faul kaynağı (T5): '+t,'cFk'+bas(t),2]))
    .concat([['Görülmeyen faul (T5; hakem görmedi, oyun sürdü)','cFg',2]]),
  yeni:()=>{const say={};let N=0;const art=k=>{say[k]=(say[k]||0)+1;};
    return{
      dinle(ad,v){
        if(ad==='mudahale')art('cMt'+bas(v.kayma?'kayma':v.tur||'acik'));
        else if(ad==='mudahaleSonuc'){N++;art('cMs'+bas(v.faul?'faul':v.sonuc||'gecildi'));const t=bas(v.tur||(v.kayma?'kayma':'acik'));art('cMn'+t);if(v.kazan)art('cMw'+t);if(v.faul)art('cMf'+t);}
        else if(ad==='omuz')art('cOmuz');
        else if(ad==='dusus')art('cDn'+bas(v.neden||'faul'));
        else if((ad==='faul'&&!v.avantajdan)||ad==='avantaj'){art('cFn'+bas(v.neden||'mudahale'));if(v.omuz)art('cOmuzFaul');if(v.kartNeden)art('cK'+bas(v.kartNeden));if(v.kaynak)art('cFk'+bas(v.kaynak));}
        else if(ad==='faulGorulmedi')art('cFg');
        else if(ad==='avantajSonuc'&&!v.tutuldu)art('cAvDon');},
      bitir(){const o={};
        for(const t of TUR)o['cMt'+bas(t)]=say['cMt'+bas(t)]||0;
        for(const t of SONUC)o['cMs'+bas(t)]=say['cMs'+bas(t)]||0;
        for(const t of TUR)o['cMk'+bas(t)]=say['cMw'+bas(t)]||0;
        for(const t of TUR)o['cMf'+bas(t)]=say['cMf'+bas(t)]||0;
        o.cOmuz=say.cOmuz||0;o.cOmuzFaul=say.cOmuzFaul||0;
        for(const t of NEDEN)o['cDn'+bas(t)]=say['cDn'+bas(t)]||0;
        for(const t of FN)o['cFn'+bas(t)]=say['cFn'+bas(t)]||0;
        for(const t of KART)o['cK'+bas(t)]=say['cK'+bas(t)]||0;
        o.cAvDon=say.cAvDon||0;for(const t of KAYNAK)o['cFk'+bas(t)]=say['cFk'+bas(t)]||0;o.cFg=say.cFg||0;return o;}};}
};
