'use strict';
/* ============ Pas kalibrasyonu (gerçekçilik planı T0 madde 4) ============
   Karar anında tahmin edilen başarı P (pasAnaliz; ortada Pg: ulaşma × kaleci × isabet) ile gerçekleşen sonuç karşılaştırılır. P, seçimden vuruşa
   eylemin sec alanında salt okunur taşınır (secenekUygula, tekVurusKarari). Tamamlandı: pası atan takımdan biri topa dokundu (ist.pasTamam arttı);
   rakip dokunur, top dışarı çıkar ya da oyun durursa (top.pas boşalır) tamamlanmadı. P'si olmayan vuruşlar (santra, korner, taç) sayılmaz.
   Dilimler: tür, pasın alt türü, tek vuruş, yerden/havadan, uzunluk, P aralığı. Bilgi satırlarında genel değerler; dilim tablosu ozet() ile
   basılır, tahminden 5 puandan fazla sapan dilim "!" ile işaretlenir (çıkış kodunu etkilemez). Rastlantı çekmez, motor yöntemi çağırmaz. */
const PK_DILIM=[
  ['Tür: pas','t_pas'],['Tür: ara pası','t_ara'],['Tür: uzun','t_uzun'],['Tür: orta','t_orta'],['Tür: geri çevirme','t_geriCevir'],
  ['Alt: ayağa','a_ayak'],['Alt: bırakma (yakına)','a_birak'],['Alt: boşluğa','a_bosluk'],['Alt: hedef forvete','a_hedef'],
  ['Tek vuruş (gelişine)','k_tek'],['Yerden','y_yer'],['Havadan','y_hava'],
  ['Uzunluk <15 m','l_kisa'],['Uzunluk 15–30 m','l_orta'],['Uzunluk >30 m','l_uzun'],
  ['P <0,5','p_0'],['P 0,5–0,7','p_1'],['P 0,7–0,85','p_2'],['P ≥0,85','p_3']];
const pkDilimler=a=>{const L=a.L||0,P=a.P;return['t_'+a.tur,a.alt?'a_'+a.alt:null,a.ilk?'k_tek':null,'y_'+(a.tip||'yer'),L<15?'l_kisa':L<=30?'l_orta':'l_uzun',
  P<0.5?'p_0':P<0.7?'p_1':P<0.85?'p_2':'p_3'].filter(Boolean);};
module.exports={
  bilgi:[['— P: pas kalibrasyonu (tahmin P ↔ gerçekleşen) —',null,0],
    ['P\'li pas payı % (karar katmanından)','pkKapsam',1],['Tahmin P ort. %','pkTahmin',1],['Gerçekleşen %','pkGercek',1],['Brier ×100','pkBrier',1]],
  yeni:()=>{
    const S={},say=(k,P,ok)=>{const s=S[k]||(S[k]=[0,0,0,0]);s[0]++;s[1]+=P;s[2]+=ok;s[3]+=(P-ok)*(P-ok);};
    let aktif=null,tum=0,pli=0;
    const bitir=ok=>{const a=aktif;aktif=null;say('hepsi',a.P,ok);for(const k of pkDilimler(a))say(k,a.P,ok);};
    return{
      dinle(ad,v,m){if(ad!=='pass'&&ad!=='cross')return;tum++;const I=m.ist;
        /* gelişine vuruşta dokunuş (tamamlama) ve yeni pas aynı adımdadır */
        if(aktif)bitir(I.pasTamam[0]+I.pasTamam[1]>aktif.c0?1:0);
        const e=v.p&&v.p.eylem,sec=e&&e.ad==='vurus'?e.sec:null;if(!sec||sec.P==null)return;pli++;aktif={P:sec.P,tur:v.tur,alt:sec.alt||null,ilk:!!v.ilk,tip:v.tip,L:v.L,bp:m.ball.pas,c0:I.pasTamam[0]+I.pasTamam[1]};},
      adim(m){if(!aktif)return;const I=m.ist;
        if(I.pasTamam[0]+I.pasTamam[1]>aktif.c0)bitir(1);else if(m.ball.pas!==aktif.bp)bitir(0);},
      bitir(){if(aktif)bitir(0);const h=S.hepsi||[0,0,0,0],ham={pkKapsam:[pli,tum],pkTahmin:[h[1],h[0]],pkGercek:[h[2],h[0]],pkBrier:[h[3],h[0]]};
        /* dilimler: adet, ΣP, tamam, Σ(P−sonuç)² (ozet tablosu için) */
        for(const [,k] of PK_DILIM){const s=S[k]||[0,0,0,0];ham['pkT_'+k]=[s[1],s[0]];ham['pkG_'+k]=[s[2],s[0]];ham['pkB_'+k]=[s[3],s[0]];}
        return{ham};}
    };
  },
  /* dilim tablosu: bütün maçların toplamından */
  ozet(sonuclar){
    const top=k=>{let a=0,b=0;for(const s of sonuclar){const h=s.ham&&s.ham[k];if(h){a+=h[0];b+=h[1];}}return[a,b];};
    console.log('\n  Pas kalibrasyonu (dilim · adet · tahmin P % · gerçekleşen % · fark · Brier ×100; |fark| > 5 puan "!")');
    for(const [ad,k] of PK_DILIM){const [sp,n]=top('pkT_'+k),[ok]=top('pkG_'+k),[br]=top('pkB_'+k);if(!n)continue;
      const t=100*sp/n,g=100*ok/n,f=g-t;
      console.log((Math.abs(f)>5?'! ':'  ')+ad.padEnd(26)+String(n).padStart(7)+t.toFixed(1).padStart(8)+g.toFixed(1).padStart(8)+((f>=0?'+':'')+f.toFixed(1)).padStart(8)+(100*br/n).toFixed(1).padStart(7));}
  }
};
