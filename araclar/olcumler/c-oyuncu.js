'use strict';
/* ============ C1 (2026-10-22): oyuncu görünürlüğü — FUTBOL_KUTUPHANESI §12.1 C, karar 22 (YOL_HARITASI); araclar/plan/c-uygulama.md C1 ============
   Sözleşme b0-zincir ile aynı: rastlantı çekmez, motor yöntemi çağırmaz, oyuncuya ve topa yazmaz (oyuncu nesnesi yalnız Map anahtarıdır). Oyuncu başına
   sayaçlar; anahtar takım:forma numarası (p.n değişiklikte girene geçer, forma numarası kadroda tektir). Kadronun kendi adı (p.name), profil.rol ve
   profil.grup basılır; ad uydurulmaz. Bilgi satırları az; oyuncu tablosu ve profil kapısı ozet()'te. Sıklıklar oyuncunun top oyundayken sahada
   geçirdiği 10 dakika başınadır (adım başına 1/60 sn; m.phase 'play' ve p.oyunda).
   Tanımlar:
   - Pas: oyundayken 'pass' olayı (m.ball.pas aynı pasın kaydıysa; kaleci pası dahil, orta 'cross' ve kafa pası hariç). Geometri pasSay'in kaydından
     (çıkış x0,z0; amaçlanan hedef hx,hz): ileri = (hx − x0)·yön, yanal = |hz − z0|. Tamamlanma: pastan sonra topu alan (m.ball.sahip; tek dokunuşta
     sahip olunmadan vurulduğu için yoksa m.ball.sonDokunan) pasörden başka ilk oyuncu takım arkadaşıysa tamamlandı; rakipse ya da oyun ondan önce
     durursa tamamlanmadı (motorun dokunus → pasTamam tanımıyla aynı; yalnız ofsaytta oyun aynı karede durursa motor tamamlandı sayar).
   - Taşıma: aynı oyuncunun kesintisiz sahipliği (m.ball.sahip). Sahipsiz ama son dokunanın kendisi olduğu ≤ 0,5 sn kesinti (kötü kontrol, uzun
     sürüş dokunuşu) sürer; vuruşu (pass, cross, shot, clear, gkkick, header), başkasının sahipliği ve duruş bitirir. Boyu sahipliğin başındaki ve
     sonundaki topun yeri arası düz uzaklık; ilerisi takımın yönünde.
   - Hızlı kanat: 'calim' olayı sonuc 'gecti' (js/mac-hareket.js calimBitir; deneme = her 'calim' olayı) ve ≥ 15 m taşıma; tepe hız = maçtaki en büyük
     hypot(vx, vz) (oyuncu-maçların ortalaması); depar metresi ≥ 7 m/sn.
   - Uzun paslı 6: tamamlanan pas L ≥ 30 ve ≥ 15 m ileri; tek pasla yön değiştirme: tamamlanan, |hz − z0| ≥ 25 (profilEgilimPuani yonDegistirir eşiği).
   - Falsolu 10: falso endeksi = oyuncunun L ≥ 18 m ayaklı paslarında Σ|b.egri| ÷ beklenen (tür başına — yerden / havadan, olayın tip'i — bütün
     oyuncuların ortalaması × oyuncunun o türdeki pas sayısı). b.egri 'pass' olayı anında yazılıdır (js/mac-topla.js yerPasVur, havaPasVur → vurusSon).
   - Hava hâkimi 9: 'header' olayı cek (hava düellosunda kazananın 1,25 m içinde rakip vardı; js/mac-hava.js havaTopu) — kazanan olayın oyuncusudur.
   - Oyun kuran stoper: kendi yarısında başlayıp ≥ 10 m ileri giden tamamlanan pas; ≥ 10 m ileri taşıma; uzaklaştırma payı = uzaklaştırma ('clear'
     olayı ve tur 'uzaklastir' kafa) ÷ top eylemi (pass, cross, shot, clear, gkkick, header olayları).
   - Hat kıran pas: tamamlanmış, ≥ 10 m ileri; pas anında derinlikte çıkışla hedef arasında duran ve pas doğrusuna (çıkış–hedef parçası) uzaklığı
     ≤ 12 m olan ≥ 2 rakip saha oyuncusu (kaleci hariç).
   - İlkel başlatma: 'plan' olayı 'basladi' (js/mac-plan.js planOlay) — taşıyan K ve koşucu R; ver-kaç: 'kosu' olayı verKac. Aynı oyuncunun 0,5 sn içindeki
     ver-kaçı ve plan başlangıcı (duvar pası planı K'nın ver-kaçını kendisi açar ya da devralır) bir kez sayılır, takım sayısında da.
   - Genel falso: oyundaki ayaklı 'pass' olaylarında (olayda tip var; kaleci pasında yok) ortalama |b.egri| ve |b.egri| > 0,02 payı.
   Profil kapısı (ozet): profilin rolündeki oyuncu-maçlar ÷ aynı gruptaki öteki oyuncu-maçlar (iki takım), sıklık oranı; %95 aralık Poisson
   yaklaşımıyla (ln oranın SE'si √(1/n₁ + 1/n₂); araclar/oyuncu-karnesi.js [7b]); falso endeksinde SE türün havuzlanmış |eğri| varyansından, uzaklaştırma
   payında oranlar oranı (√(1/a₁ − 1/b₁ + 1/a₂ − 1/b₂)). Hedef oran ≥ 1,5 ve alt uç > 1; profil bütün kapı satırları geçince geçer. Tepe hız, depar ve
   uzaklaştırma payı bilgi satırıdır (sayım değil ya da yönü kapı tanımında yok). Profilin üyesi ya da karşılaştırma grubu yoksa '—'. */
const CO_DT=1/60,CO_KESINTI=0.5,CO_DEPAR=7,CO_ILK_PENCERE=0.5,CO_HAT_YAN=12,CO_FALSO_L=18,CO_FALSO_ESIK=0.02;
const CO_VURUS=new Set(['pass','cross','shot','clear','gkkick','header']);
/* beş profil: [ad, rol, grup, imzalar [ad, alan, tür ('say' Poisson, 'oran' sıklık oranı, 'ort' ortalama, 'falso', 'pay'), kapı mı]] */
const CO_PROFIL=[
  ['Hızlı kanat','cizgiKanadi','kanat',[['çalım geçti','gec','say',1],['≥ 15 m taşıma','t15','say',1],['depar metresi','dep','oran',0],['tepe hız','tepe','ort',0]]],
  ['Uzun paslı 6','oyunKurucu','merkez',[['uzun ileri pas (L ≥ 30, ≥ 15 m)','uzun','say',1],['yön değiştirme (|Δz| ≥ 25)','yon','say',1]]],
  ['Falsolu 10','derineGelen','FV',[['falso endeksi (L ≥ 18)','falso','falso',1]]],
  ['Hava hâkimi 9','hedefForvet','FV',[['çekişmeli kafa kazanılan','kafaC','say',1]]],
  ['Oyun kuran stoper','oyunKuranStoper','stoper',[['kendi yarısından ≥ 10 m ileri pas','stP','say',1],['≥ 10 m ileri taşıma','ti10','say',1],['uzaklaştırma payı (beklenen < 1)','uzk','pay',0]]]
];
const CO_SAY=['sn','dep','gec','cal','t15','ti10','pas','pasT','uzun','yon','stP','hk','kafaC','uzk','eyl','ilk'];
function coYeni(){return{sn:0,tepe:0,dep:0,gec:0,cal:0,t15:0,ti10:0,pas:0,pasT:0,uzun:0,yon:0,stP:0,hk:0,kafaC:0,uzk:0,eyl:0,ilk:0,eg:[0,0,0,0,0,0]};}   /* eg: yerden Σ|e|, Σe², n; havadan Σ|e|, Σe², n (L ≥ 18) */
const coF=(x,n)=>x==null||Number.isNaN(x)||!Number.isFinite(x)?'—':x.toFixed(n);
module.exports={
  bilgi:[['— C1: oyuncu görünürlüğü (c-oyuncu; oyuncu tablosu ve profil kapısı aşağıda) —',null,0],
    ['Pas tamamlanma % (pass olayı; eklentinin tanımı)','cPasTamam',1],
    ['Genel falso: ortalama |eğri| ×1000 (ayaklı pas)','cFalsoOrt',1],
    ['Genel falso: |eğri| > 0,02 payı %','cFalsoPay',1],
    ['Hat kıran pas / takım·maç','cHatKir',2],
    ['İlkel başlatma (plan K/R, ver-kaç) / takım·maç','cIlkel',2]],
  yeni:()=>{
    const O=new Map(),IL=[0,0],GF=[0,0,0],VK=new Map();let C=null,PB=null;   /* C: taşıma {p,x0,z0,x1,z1,tb}; PB: sonucu bekleyen pas; VK: oyuncunun son ver-kaç anı */
    const kayit=p=>{let r=O.get(p);if(!r){r=coYeni();O.set(p,r);}return r;};
    const tasBitir=m=>{const c=C;C=null;if(!c)return;const r=kayit(c.p),L=Math.hypot(c.x1-c.x0,c.z1-c.z0),ilr=(c.x1-c.x0)*m.dir[c.p.team];
      if(L>=15)r.t15++;if(ilr>=10)r.ti10++;};
    /* pasın sonucu: pasörden başka ilk alan (sahip, yoksa son dokunan); zorla: oyun durdu ya da yeni pas — alan yoksa tamamlanmadı */
    const pasCoz=(m,zorla)=>{if(!PB)return;const b=m.ball,q=b.sahip&&b.sahip!==PB.p?b.sahip:b.sonDokunan;
      if(q&&q!==PB.p){if(q.team===PB.t){const r=PB.r;r.pasT++;if(PB.uzun)r.uzun++;if(PB.yon)r.yon++;if(PB.stP)r.stP++;if(PB.hk)r.hk++;}PB=null;}
      else if(zorla)PB=null;};
    return{
      dinle(ad,v,m){
        if(!m||!v)return;
        if(C&&v.p===C.p&&CO_VURUS.has(ad)){C.x1=m.ball.x;C.z1=m.ball.z;tasBitir(m);}
        if(m.phase!=='play')return;
        if(ad==='pass'){pasCoz(m,true);const P=m.ball.pas;if(!P||P.p!==v.p||P.takim==null)return;
          const p=v.p,r=kayit(p),t=P.takim,d=m.dir[t],ilr=(P.hx-P.x0)*d;r.pas++;r.eyl++;
          let hk=false;if(ilr>=10){const u0=P.x0*d,u1=P.hx*d,vx=P.hx-P.x0,vz=P.hz-P.z0,L2=vx*vx+vz*vz||1;let n=0;
            for(const o of m.teams[1-t]){if(!o.oyunda||o.rol==='GK')continue;const u=o.x*d;if(u<=u0||u>=u1)continue;
              const s=Math.max(0,Math.min(1,((o.x-P.x0)*vx+(o.z-P.z0)*vz)/L2)),ex=P.x0+vx*s-o.x,ez=P.z0+vz*s-o.z;
              if(ex*ex+ez*ez<=CO_HAT_YAN*CO_HAT_YAN&&++n>=2){hk=true;break;}}}
          PB={p,t,r,uzun:P.L>=30&&ilr>=15,yon:Math.abs(P.hz-P.z0)>=25,stP:P.x0*d<0&&ilr>=10,hk};
          if(v.tip){const e=Math.abs(m.ball.egri||0);GF[0]+=e;GF[1]++;if(e>CO_FALSO_ESIK)GF[2]++;
            if(P.L>=CO_FALSO_L){const i=v.tip==='hava'?3:0;r.eg[i]+=e;r.eg[i+1]+=e*e;r.eg[i+2]++;}}
          return;}
        if(ad==='cross'||ad==='shot'||ad==='gkkick'){if(v.p)kayit(v.p).eyl++;return;}
        if(ad==='clear'){if(v.p){const r=kayit(v.p);r.eyl++;r.uzk++;}return;}
        if(ad==='header'){if(!v.p)return;const r=kayit(v.p);r.eyl++;if(v.tur==='uzaklastir')r.uzk++;if(v.cek)r.kafaC++;return;}
        if(ad==='calim'){if(!v.p)return;const r=kayit(v.p);r.cal++;if(v.sonuc==='gecti')r.gec++;return;}
        if(ad==='kosu'){if(!v.verKac||!v.p)return;kayit(v.p).ilk++;IL[v.p.team]++;VK.set(v.p,m.t);return;}
        if(ad==='plan'&&v.olay==='basladi'){let es=false;
          for(const q of v.K===v.R?[v.K]:[v.K,v.R]){if(!q)continue;const tv=VK.get(q);if(tv!=null&&m.t-tv<=CO_ILK_PENCERE){VK.delete(q);es=true;continue;}kayit(q).ilk++;}
          if(!es)IL[v.takim]++;}
      },
      adim(m){
        const oy=m.phase==='play',b=m.ball;
        pasCoz(m,!oy);
        if(!oy){if(C)tasBitir(m);return;}
        for(let t=0;t<2;t++)for(const p of m.teams[t]){if(!p.oyunda)continue;const r=kayit(p),s=Math.sqrt(p.vx*p.vx+p.vz*p.vz);r.sn+=CO_DT;if(s>r.tepe)r.tepe=s;if(s>=CO_DEPAR)r.dep+=s*CO_DT;}
        const s=b.sahip;
        if(s){if(C&&C.p===s){C.x1=b.x;C.z1=b.z;C.tb=-1;}else{if(C)tasBitir(m);C={p:s,x0:b.x,z0:b.z,x1:b.x,z1:b.z,tb:-1};}}
        else if(C){if(b.sonDokunan!==C.p)tasBitir(m);else if(C.tb<0)C.tb=m.t;else if(m.t-C.tb>CO_KESINTI)tasBitir(m);}
      },
      bitir(m){
        pasCoz(m,true);tasBitir(m);
        const L=[],HK=[0,0];let pas=0,pasT=0;
        for(const [p,r] of O){if(!(r.sn>0))continue;const pr=p.profil||{},no=p.no!=null?p.no:p.n+1;
          pas+=r.pas;pasT+=r.pasT;HK[p.team]+=r.hk;
          L.push(Object.assign({k:p.team+':'+no,t:p.team,no,ad:p.name||'',rol:pr.rol||'—',grup:pr.grup||'—'},r,
            {sn:+r.sn.toFixed(2),tepe:+r.tepe.toFixed(3),dep:+r.dep.toFixed(1),eg:r.eg.map(x=>+x.toFixed(7))}));}
        return{ham:{cPasTamam:[pasT,pas],cFalsoOrt:[1000*GF[0],100*GF[1]],cFalsoPay:[GF[2],GF[1]],cHatKir:[HK[0]+HK[1],200],cIlkel:[IL[0]+IL[1],200]},_cOyuncu:L};}
    };
  },
  ozet(sonuclar){
    const PM=[];for(const s of sonuclar)if(s._cOyuncu)for(const r of s._cOyuncu)PM.push(r);
    if(!PM.length)return;
    /* falso endeksinin beklenen değeri: tür başına bütün oyuncu-maçların ortalaması; varyans kapının SE'si için */
    const G=[0,0,0,0,0,0];for(const r of PM)for(let i=0;i<6;i++)G[i]+=r.eg[i];
    const mY=G[2]?G[0]/G[2]:0,mH=G[5]?G[3]/G[5]:0,vY=G[2]?Math.max(0,G[1]/G[2]-mY*mY):0,vH=G[5]?Math.max(0,G[4]/G[5]-mH*mH):0;
    const bek=r=>r.eg[2]*mY+r.eg[5]*mH,fS=r=>r.eg[0]+r.eg[3],fV=r=>r.eg[2]*vY+r.eg[5]*vH;
    /* oyuncu başına toplam (bütün maçlar) */
    const A=new Map();
    for(const r of PM){let a=A.get(r.k);if(!a){a={k:r.k,t:r.t,no:r.no,ad:r.ad,n:0,tepeS:0,fS:0,fB:0,rg:{}};for(const x of CO_SAY)a[x]=0;A.set(r.k,a);}
      a.n++;a.tepeS+=r.tepe;a.fS+=fS(r);a.fB+=bek(r);for(const x of CO_SAY)a[x]+=r[x]||0;const g=r.rol+'|'+r.grup;a.rg[g]=(a.rg[g]||0)+1;}
    const S=[...A.values()].sort((a,b)=>a.t-b.t||a.no-b.no);
    console.log('\n  C1 oyuncu tablosu (bütün maçlar toplamı; sıklıklar top oyundayken sahada 10 dk başına; rol ve grup oyuncu-maçların çoğunluğu, * değişken)');
    console.log('    çlm: geçen çalım (deneme) · t15: ≥ 15 m taşıma · tepe: tepe hız m/sn · dep: depar m · uzun: L ≥ 30, ≥ 15 m ileri tamamlanan · yön: |Δz| ≥ 25 · falso: endeks');
    console.log('    kafa: çekişmeli kafa kazanılan · stP: kendi yarısından ≥ 10 m ileri tamamlanan · ti10: ≥ 10 m ileri taşıma · uzk%: uzaklaştırma ÷ top eylemi · hat: hat kıran · ilk: ilkel başlatma');
    console.log('    '+'tk no ad'.padEnd(17)+'rol'.padEnd(16)+'grup'.padEnd(7)+'dk'.padStart(5)+' │'+'çlm'.padStart(10)+'t15'.padStart(5)+'tepe'.padStart(6)+'dep'.padStart(6)+' │'+'uzun'.padStart(5)+'yön'.padStart(5)+' │'+'falso'.padStart(6)+' │'+'kafa'.padStart(5)+' │'+'stP'.padStart(5)+'ti10'.padStart(5)+'uzk%'.padStart(6)+' │'+'hat'.padStart(5)+'ilk'.padStart(5));
    for(const a of S){const k=a.sn>0?600/a.sn:NaN,ro=Object.entries(a.rg).sort((x,y)=>y[1]-x[1]),[rol,grup]=ro[0][0].split('|'),f1=x=>coF(x*k,1);
      console.log('    '+(String(a.t)+' '+String(a.no).padStart(2)+' '+a.ad).padEnd(17).slice(0,17)+(rol+(ro.length>1?'*':'')).padEnd(16)+grup.padEnd(7)+coF(a.sn/60,0).padStart(5)+' │'+
        (f1(a.gec)+' ('+f1(a.cal)+')').padStart(10)+f1(a.t15).padStart(5)+coF(a.tepeS/a.n,2).padStart(6)+coF(a.dep*k,0).padStart(6)+' │'+
        f1(a.uzun).padStart(5)+f1(a.yon).padStart(5)+' │'+coF(a.fB>0?a.fS/a.fB:NaN,2).padStart(6)+' │'+f1(a.kafaC).padStart(5)+' │'+
        f1(a.stP).padStart(5)+f1(a.ti10).padStart(5)+coF(a.eyl?100*a.uzk/a.eyl:NaN,1).padStart(6)+' │'+f1(a.hk).padStart(5)+f1(a.ilk).padStart(5));}
    /* profil kapısı: oyuncu-maç birimiyle; üyeler profilin rolü ve grubu, karşılaştırma aynı grubun öteki rolleri (iki takım) */
    console.log('\n  C1 profil kapısı: profilin rolü ÷ aynı grubun öteki oyuncuları (iki takım; oyuncu-maç), oran [%95 GA] (n₁ / n₂); hedef oran ≥ 1,5 ve alt uç > 1');
    let gecen=0;
    for(const [ad,rol,grup,imza] of CO_PROFIL){
      const M=PM.filter(r=>r.grup===grup&&r.rol===rol),D=PM.filter(r=>r.grup===grup&&r.rol!==rol);
      const kisi=L=>new Set(L.map(r=>r.k)).size;
      console.log(`    ${ad} (${rol}, ${grup}): ${kisi(M)} oyuncu / ${M.length} oyuncu-maç · öteki ${kisi(D)} / ${D.length}${D.length?' ('+[...new Set(D.map(r=>r.rol))].join(', ')+')':''}`);
      if(!M.length||!D.length){console.log('      —');continue;}
      const top=(L,f)=>L.reduce((s,r)=>s+f(r),0),sn1=top(M,r=>r.sn),sn2=top(D,r=>r.sn);let hepsi=true;
      for(const [iad,al,tur,kapi] of imza){let o=NaN,lo=NaN,hi=NaN,ek='';
        if(tur==='say'||tur==='oran'){const n1=top(M,r=>r[al]),n2=top(D,r=>r[al]);o=sn1&&sn2&&n2?(n1/sn1)/(n2/sn2):NaN;ek=` (${coF(n1,0)} / ${coF(n2,0)})`;
          if(tur==='say'){const se=Math.sqrt(1/Math.max(1,n1)+1/Math.max(1,n2));lo=o*Math.exp(-1.96*se);hi=o*Math.exp(1.96*se);}}
        else if(tur==='ort'){o=top(M,r=>r[al])/M.length/(top(D,r=>r[al])/D.length);ek=` (${coF(top(M,r=>r[al])/M.length,2)} / ${coF(top(D,r=>r[al])/D.length,2)} m/sn)`;}
        else if(tur==='falso'){const s1=top(M,fS),e1=top(M,bek),s2=top(D,fS),e2=top(D,bek),v1=top(M,fV),v2=top(D,fV);
          o=e1&&e2&&s2?(s1/e1)/(s2/e2):NaN;const se=s1&&s2?Math.sqrt(v1/(s1*s1)+v2/(s2*s2)):NaN;lo=o*Math.exp(-1.96*se);hi=o*Math.exp(1.96*se);
          ek=` (endeks ${coF(e1?s1/e1:NaN,2)} / ${coF(e2?s2/e2:NaN,2)}; pas ${top(M,r=>r.eg[2]+r.eg[5])} / ${top(D,r=>r.eg[2]+r.eg[5])})`;}
        else if(tur==='pay'){const a1=top(M,r=>r[al]),b1=top(M,r=>r.eyl),a2=top(D,r=>r[al]),b2=top(D,r=>r.eyl);o=b1&&b2&&a2?(a1/b1)/(a2/b2):NaN;
          const se=Math.sqrt(Math.max(0,1/Math.max(1,a1)-1/Math.max(1,b1)+1/Math.max(1,a2)-1/Math.max(1,b2)));lo=o*Math.exp(-1.96*se);hi=o*Math.exp(1.96*se);ek=` (${a1}/${b1} · ${a2}/${b2})`;}
        if(!(o>0)){lo=NaN;hi=NaN;}   /* pay ya da payda 0: aralık yok (kapı geçmez) */
        const ok=o>=1.5&&lo>1;if(kapi&&!ok)hepsi=false;
        console.log((kapi&&!ok?'!     ':'      ')+(iad+(kapi?'':' (bilgi)')).padEnd(44)+coF(o,2).padStart(6)+(Number.isNaN(lo)?'':'  ['+coF(lo,2)+'–'+coF(hi,2)+']')+ek);}
      if(hepsi)gecen++;
      console.log('      → '+(hepsi?'geçti':'geçmedi'));}
    console.log(`    Kapıdan geçen profil: ${gecen} / ${CO_PROFIL.length} (oran '—': karşılaştırma grubunda olay yok ya da süre yok)`);
  }
};
