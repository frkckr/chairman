'use strict';
/* ============ T16-0 (2026-10-15): yarılar — "Y:" satırları (gerçekçilik planı §4 T16) ============
   İkinci yarının gol payının (o-olay oGolIkinci; gerçek ~%55) kaynağını ayırır. r-karne, o-olay ve t-takim ile aynı sözleşme: rastlantı çekmez, motorun
   yöntemlerini çağırmaz, oyuncu nesnesine alan yazmaz (yedekler Set'te); yalnız olayları, top, oyuncu, niyet, skor ve saat alanlarını okur.
   - Oyun süresi: top oyundayken (m.phase 'play') geçen gerçek saniye, yarıya göre. Yarı başı saat kaybı: yarının ilk santrasında (olay kickoff)
     maç saatinin yarının başlangıcından (0 ya da 2700) ilerisi — santra hazırlanırken akan saat (maç sn).
   - Şut: 'shot' ve şut sayılan 'header' (penaltı dahil). Konum xG: şut anında b.sut.xgYer (yoksa olaydaki xg), penaltısız. Gerçekleşen ÷ xG: penaltısız
     şutlardan gelen goller (gol, aynı takımın son şutundan ≤ 8 sn sonra; kendi kalesine hariç) ÷ Σ konum xG (havuz).
   - Skor durumu (2. yarı): şutu atan takımın şut anındaki skor farkı; süre takım başına top oyundayken. Niyet: m._niyet[t].ad (T7a).
   - Kip: sahadaki saha oyuncularının koşu, hızlı ve depar kiplerindeki süre payı (6 karede bir örnek). Topsuz koşu: 'kosu' olayı.
   - Savunan takımın boyu: top bir takımdayken rakibin sahadaki saha oyuncularının hücum yönündeki yayılımı (en geri – en ileri, m; 6 karede bir).
   - Sonradan giren: oyuncuGirdi olayıyla oyuna giren yedek. Dilimler (özet): yarı içinde 15'er maç dakikası; uzatma son dilime girer. */
const Y_KOS=new Set(['kos','hizli','depar']);
const Y_DILIM=['1–15','16–30','31–45+','46–60','61–75','76–90+'];
module.exports={
  bilgi:[
    ['— Y: yarılar (T16; gerçekçilik planı §4 T16) —',null,0],
    ['Oyun süresi: 2. yarı ÷ 1. yarı %','yOyun2',1],
    ['Yarı başı saat kaybı (maç sn): 1. yarı','yKayip1',0],['Yarı başı saat kaybı (maç sn): 2. yarı','yKayip2',0],
    ['Şut: 2. yarı payı %','ySut2',1],['Konum xG (penaltısız): 2. yarı payı %','yXg2',1],
    ['Şut / oyun dk: 1. yarı','ySutDk1',2],['Şut / oyun dk: 2. yarı','ySutDk2',2],
    ['Gerçekleşen ÷ konum xG (havuz, penaltısız): 1. yarı','yOran1',2],['Gerçekleşen ÷ konum xG (havuz, penaltısız): 2. yarı','yOran2',2],
    ['2. yarı şut / takım·oyun dk: önde','ySutOnde',2],['2. yarı şut / takım·oyun dk: berabere','ySutBer',2],['2. yarı şut / takım·oyun dk: geride','ySutGeri',2],
    ['2. yarı: tut niyeti (takım süresi %)','yTut2',1],
    ['Koşu kipi ve üstü (saha oyuncusu süresi %): 1. yarı','yKos1',1],['Koşu kipi ve üstü (saha oyuncusu süresi %): 2. yarı','yKos2',1],
    ['Topsuz koşu (olay) / oyun dk: 1. yarı','yKosu1',2],['Topsuz koşu (olay) / oyun dk: 2. yarı','yKosu2',2],
    ['Savunan takımın boyu ort. (m): 1. yarı','yBoy1',1],['Savunan takımın boyu ort. (m): 2. yarı','yBoy2',1],
    ['2. yarı şut: sonradan girenden %','yYedekSut',1]],
  yeni:()=>{
    const dt=1/60,oy=[0,0],kayip=[NaN,NaN],sut=[0,0],xg=[0,0],golS=[0,0],kos=[0,0],kosN=[0,0],kosu=[0,0],boy=[0,0],boyN=[0,0];
    const durumT=[0,0,0],durumS=[0,0,0],yedek=new Set(),sonSut=[null,null],dG=[0,0,0,0,0,0],dS=[0,0,0,0,0,0],dOy=[0,0,0,0,0,0];
    let adimN=0,tut2=0,takim2=0,yedekSut=0;
    const dilim=m=>m.half===1?Math.min(2,Math.floor(m.gameSec/900)):3+Math.min(2,Math.max(0,Math.floor((m.gameSec-2700)/900)));
    const durum=(m,t)=>{const f=m.score[t]-m.score[1-t];return f>0?0:f===0?1:2;};
    const sutYaz=(m,p,v,kafa)=>{if(!p||p.team==null)return;const h=m.half-1,t=p.team,e=p.eylem,s=m.ball.sut;
      const pen=!kafa&&!!(e&&e.ad==='vurus'&&e.sec&&e.sec.penalti);
      sut[h]++;dS[dilim(m)]++;
      if(!pen)xg[h]+=s&&s.xgYer!=null?s.xgYer:(v&&v.xg)||0;
      if(h===1){durumS[durum(m,t)]++;if(yedek.has(p))yedekSut++;}
      sonSut[t]={t:m.t,h,pen};};
    return{
      dinle(ad,v,m){if(!m)return;
        if(ad==='shot')sutYaz(m,v&&v.p,v,false);
        else if(ad==='header'){if(v&&v.shot)sutYaz(m,v.p,v,true);}
        else if(ad==='goal'){dG[dilim(m)]++;const s=sonSut[v.team];if(!v.own&&s&&!s.pen&&m.t-s.t<=8)golS[s.h]++;}
        else if(ad==='kickoff'){const h=(v&&v.half||m.half)-1;if(kayip[h]!==kayip[h])kayip[h]=m.gameSec-(h?2700:0);}
        else if(ad==='kosu'){if(m.phase==='play')kosu[m.half-1]++;}
        else if(ad==='oyuncuGirdi'){if(v&&v.giren)yedek.add(v.giren);}},
      adim(m){adimN++;if(m.phase!=='play')return;const h=m.half-1;oy[h]+=dt;dOy[dilim(m)]+=dt;
        if(h===1){for(let t=0;t<2;t++){takim2+=dt;durumT[durum(m,t)]+=dt;const N=m._niyet&&m._niyet[t];if(N&&N.ad==='tut')tut2+=dt;}}
        if(adimN%6)return;
        for(const p of m.players){if(!p.oyunda||p.rol==='GK'||p.tur!=='oyuncu')continue;kosN[h]++;if(Y_KOS.has(p.kip))kos[h]++;}
        const s=m.ball.sahip;if(!s||s.team==null)return;const d=1-s.team;let en=1e9,ek=-1e9;
        for(const q of m.teams[d]){if(!q.oyunda||q.rol==='GK')continue;const u=q.x*m.dir[s.team];if(u<en)en=u;if(u>ek)ek=u;}
        if(ek>en){boy[h]+=ek-en;boyN[h]++;}},
      bitir(){
        return{yKayip1:kayip[0],yKayip2:kayip[1],ySutDk1:oy[0]?sut[0]/(oy[0]/60):NaN,ySutDk2:oy[1]?sut[1]/(oy[1]/60):NaN,
          yKosu1:oy[0]?kosu[0]/(oy[0]/60):NaN,yKosu2:oy[1]?kosu[1]/(oy[1]/60):NaN,yBoy1:boyN[0]?boy[0]/boyN[0]:NaN,yBoy2:boyN[1]?boy[1]/boyN[1]:NaN,
          yDilim:{g:dG,s:dS,oy:dOy},
          /* oran satırları 100·pay/payda yazar: ÷ xG ve dakika başına satırlarda payda 100 ile çarpılır (v-verim vvOranH gibi) */
          ham:{yOyun2:[oy[1],oy[0]],ySut2:[sut[1],sut[0]+sut[1]],yXg2:[xg[1],xg[0]+xg[1]],yOran1:[golS[0],100*xg[0]],yOran2:[golS[1],100*xg[1]],
            ySutOnde:[durumS[0],100*durumT[0]/60],ySutBer:[durumS[1],100*durumT[1]/60],ySutGeri:[durumS[2],100*durumT[2]/60],yTut2:[tut2,takim2],
            yKos1:[kos[0],kosN[0]],yKos2:[kos[1],kosN[1]],yYedekSut:[yedekSut,sut[1]]}};}
    };
  },
  /* dilimler: bütün maçların toplamı — gol payı, şut payı, şut / oyun dk */
  ozet(sonuclar){
    const G=[0,0,0,0,0,0],S=[0,0,0,0,0,0],O=[0,0,0,0,0,0];
    for(const r of sonuclar){const d=r.yDilim;if(!d)continue;for(let i=0;i<6;i++){G[i]+=d.g[i]||0;S[i]+=d.s[i]||0;O[i]+=d.oy[i]||0;}}
    const gT=G.reduce((a,b)=>a+b,0),sT=S.reduce((a,b)=>a+b,0);if(!sT)return;
    const f=(x,n)=>String(x).padStart(n);
    console.log('\n  Yarılar (y-yari; T16-0): 15 dakikalık dilim · gol % · şut % · şut / oyun dk (gerçek gol payı: 1–15 ~%13, 76–90+ ~%22, ikinci yarı ~%55)');
    for(let i=0;i<6;i++)console.log('  '+Y_DILIM[i].padEnd(8)+f(gT?(100*G[i]/gT).toFixed(1):'—',8)+f((100*S[i]/sT).toFixed(1),8)+f(O[i]?(S[i]/(O[i]/60)).toFixed(2):'—',8));
  }
};
