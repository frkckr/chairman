'use strict';
/* ============ Z4-0 (2026-10-20 gece): ilerletme ve son üçte bir — FUTBOL_KUTUPHANESI §4, §12.2 (Z4), kutuphane/B-ilerletme.md "Ölçüler" ============
   Sözleşme k-kurma ile aynı: rastlantı çekmez, motor yöntemi çağırmaz, oyuncuya ve topa yazmaz; plan durumunu okumaz (bağımsız). Takım başına (0 ev,
   1 konuk) satırlar. Tanımlar:
   - Bindirme (B.4): takımın kanattaki taşıyanı (topun sahibi; ortaya ≥ 12 m yanda, rakip yarıda ya da orta sahada u > −15) ve aynı kanattaki bek;
     bek taşıyanın ≥ 1 m gerisindeyken başlayıp 3 sn içinde taşıyanın ≥ 2 m önüne, dışından (ortaya uzaklığı taşıyanınkinden büyük) ve ≥ 4,2 m/sn
     hızla geçerse — bu sırada rakip topu almadan (top yolda olabilir). İç bindirme (B.5): aynı geçiş içeriden (bek ortaya daha yakın). Bindirmeye pas: geçişten sonra 2 sn
     içinde bekin aldığı pas. Kutuphane bandı: bindirme ve iç bindirme birlikte 2–7 / maç (tarzla 3,5 kata dek oynar).
   - Oyunu çevirme (B.10, B.23): açık oyunda tek pasla topun bir kanattan (ortaya ≥ 10 m) öbür kanada (ters yanda ortaya ≥ 10 m) ve ≥ 25 m yana
     gidişi; iki pasla (≤ 4 sn) olanı ayrı satır. Kutuphane bandı: 4–12 / maç (tahmin).
   - Uzun topun hazırlığı (6. not; B "Motor için notlar" 1): açık oyunda ≥ 30 m pasın vuruş eylemi boyunca pasörün bakışının (bakisYon, yoksa
     gövde) hedefe 25°'den yakın kaldığı toplam süre (sn; temasta topa inmesi doğaldır) ve vuruş eyleminin uzunluğu (karardan temasa, sn). Hedef: hedefe bakış ≥ 0,6 sn.
   - Uzun top (≥ 30 m) / maç; içinde ileriye (≥ 15 m ileri) pay. */
const KI_PL=52.5,KI_MZ=34,KI_V1=4.2;
const KI_ACI=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return Math.abs(d);};
const KI_MED=a=>{if(!a.length)return NaN;const s=[...a].sort((x,y)=>x-y);return s[s.length>>1];};
module.exports={
  bilgi:[['— Z4: ilerletme (k-ilerlet; Z4-0) —',null,0]]
    .concat(...[0,1].map(t=>{const T=t?'konuk':'ev';return[
      [`${T}: bindirme / maç`,'kiBin'+t,2],[`${T}: iç bindirme / maç`,'kiIc'+t,2],[`${T}: bindirmeye pas %`,'kiBinPas'+t,1],
      [`${T}: oyunu çevirme, tek pas / maç`,'kiCev'+t,2],[`${T}: oyunu çevirme, iki pas / maç`,'kiCev2'+t,2],
      [`${T}: uzun top (≥ 30 m) / maç`,'kiUz'+t,2],[`${T}: uzun topun ileriye payı %`,'kiUzIl'+t,1]];}),
      [['Uzun top: hedefe bakış ortancası (sn)','kiBakMed',2],['Uzun top: hedefe bakış ≥ 0,6 sn %','kiBak06',1],['Uzun top: vuruş eylemi ortancası (sn)','kiEylMed',2]]),
  yeni:()=>{
    const B=[[0,0,0,0],[0,0,0,0]],C=[[0,0],[0,0]],U=[[0,0],[0,0]],bak=[],eyl=[];   /* B[t] = [bindirme, iç, bindirmeye pas, bindirme+iç] */
    let aday=[],son=[],sonPas=null;const iz=new Map();   /* aday: {t, bek, tas, t0, dis}; son: biten geçişler {t, bek, tB}; iz: pasör → {t0, bak} */
    return{
      dinle(ad,v,m){
        if(!m||!v)return;
        if(ad==='pass'&&v.p&&v.p.team!=null&&m.phase==='play'){const t=v.p.team,d=m.dir[t];
          /* bindirmeye pas */
          if(v.q)for(const s of son)if(s.t===t&&s.bek===v.q&&m.t-s.tB<=2&&!s.pas){s.pas=true;B[t][2]++;}
          /* çevirme */
          const z0=v.z0!=null?v.z0:v.p.z,hz=v.hz!=null?v.hz:z0;
          if(Math.abs(z0-KI_MZ)>=10&&Math.abs(hz-KI_MZ)>=10&&Math.sign(z0-KI_MZ)!==Math.sign(hz-KI_MZ)&&Math.abs(hz-z0)>=25)C[t][0]++;
          else if(sonPas&&sonPas.t===t&&m.t-sonPas.tm<=4&&Math.abs(sonPas.z0-KI_MZ)>=10&&Math.abs(hz-KI_MZ)>=10&&Math.sign(sonPas.z0-KI_MZ)!==Math.sign(hz-KI_MZ)&&Math.abs(hz-sonPas.z0)>=25){C[t][1]++;sonPas=null;}
          if(!sonPas||sonPas.t!==t||m.t-sonPas.tm>4)sonPas={t,tm:m.t,z0};
          /* uzun top ve hazırlığı */
          const L=v.L||0;if(L>=30){U[t][0]++;if(((v.hx!=null?v.hx:v.p.x)-(v.x0!=null?v.x0:v.p.x))*d>=15)U[t][1]++;
            const I=iz.get(v.p);if(I){bak.push(I.bak);eyl.push(m.t-I.t0);}}
          iz.delete(v.p);}
      },
      adim(m){
        if(m.phase!=='play'){aday=[];return;}
        const dt=1/60;
        /* uzun pas hazırlığı: vuruş eylemindeki pasörün hedefe bakışı (eylem boyunca toplam; son anda topa inmesi doğaldır) */
        for(const p of m.players){const e=p.eylem;if(!e||e.ad!=='vurus'||!e.sec||e.sec.tur==='sut'||e.sec.hx==null){continue;}
          let I=iz.get(p);if(!I){I={t0:m.t,bak:0};iz.set(p,I);}
          const hd=Math.atan2(e.sec.hz-p.z,e.sec.hx-p.x),by=p.bakisYon!=null?p.bakisYon:p.yon;
          if(KI_ACI(by,hd)<0.436)I.bak+=dt;}
        for(const [p,I] of iz)if(!p.eylem||p.eylem.ad!=='vurus'){if(m.t-I.t0>0.05)iz.delete(p);}
        /* bindirme */
        const s=m.ball.sahip;
        if(s&&s.team!=null&&s.rol!=='GK'&&!(s.mevki&&s.mevki.bek)){const t=s.team,d=m.dir[t],su=s.x*d,sw=s.z-KI_MZ;
          if(Math.abs(sw)>=12&&su>-15)for(const p of m.teams[t]){if(!p.oyunda||!p.mevki||!p.mevki.bek||p===s)continue;const pw=p.z-KI_MZ;if(Math.sign(pw)!==Math.sign(sw))continue;
            if(p.x*d<su-1&&!aday.some(a=>a.bek===p))aday.push({t,bek:p,tas:s,t0:m.t});}}
        for(let i=aday.length-1;i>=0;i--){const a=aday[i],p=a.bek,q=a.tas,d=m.dir[a.t];
          if(m.t-a.t0>3||m.ball.sahip&&m.ball.sahip.team!==a.t){aday.splice(i,1);continue;}   /* top yolda olabilir (kanat pas verdi); rakip alınca biter */
          const pu=p.x*d,qu=q.x*d,hz=Math.hypot(p.vx,p.vz);
          if(pu>qu+2&&hz>=KI_V1){const dis=Math.abs(p.z-KI_MZ)>Math.abs(q.z-KI_MZ);B[a.t][dis?0:1]++;son.push({t:a.t,bek:p,tB:m.t,pas:false});aday.splice(i,1);}}
        if(son.length>8)son.splice(0,son.length-8);
      },
      bitir(){
        const r={ham:{}};
        /* ham [pay, payda]: mac-deneme 100 × Σpay ÷ Σpayda yazar — maç başı sayılar ve ortancalar payda 100 ile (ortanca: maçların ortancalarının ortalaması) */
        for(let t=0;t<2;t++){r.ham['kiBin'+t]=[B[t][0],100];r.ham['kiIc'+t]=[B[t][1],100];r.ham['kiBinPas'+t]=[B[t][2],B[t][0]+B[t][1]];
          r.ham['kiCev'+t]=[C[t][0],100];r.ham['kiCev2'+t]=[C[t][1],100];r.ham['kiUz'+t]=[U[t][0],100];r.ham['kiUzIl'+t]=[U[t][1],U[t][0]];}
        const mb=KI_MED(bak),me=KI_MED(eyl);
        r.ham.kiBakMed=bak.length?[mb,100]:[0,0];r.ham.kiBak06=[bak.filter(x=>x>=0.6).length,bak.length];r.ham.kiEylMed=eyl.length?[me,100]:[0,0];
        return r;}
    };
  }
};
