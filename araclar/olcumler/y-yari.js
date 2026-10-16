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
    /* dilim × skor durumu (önde, berabere, geride): takım·oyun süresi ve şut; dilim başına penaltısız konum xG ve ondan gelen gol */
    const dX=[0,0,0,0,0,0],dGs=[0,0,0,0,0,0],dTd=new Array(18).fill(0),dSd=new Array(18).fill(0);
    /* T18-0 (2026-10-16): dilimlere göre yüksek şiddetli koşu (> 5,5 m/sn; 6 karede bir örnek), ivmelenme (r-karne tanımı; saha oyuncusu·sn), savunan takımın boyu, 1. adamın
       topa uzaklığı (topa sahip rakibin en yakın savunmacısı; 6 karede bir) */
    const dHsk=[0,0,0,0,0,0],dHskN=[0,0,0,0,0,0],dIv=[0,0,0,0,0,0],dOyun=[0,0,0,0,0,0],dBoy=[0,0,0,0,0,0],dBoyN=[0,0,0,0,0,0],dAdam=[0,0,0,0,0,0],dAdamN=[0,0,0,0,0,0];const ivH=new Map();
    let adimN=0,tut2=0,takim2=0,yedekSut=0;
    const dilim=m=>m.half===1?Math.min(2,Math.floor(m.gameSec/900)):3+Math.min(2,Math.max(0,Math.floor((m.gameSec-2700)/900)));
    const durum=(m,t)=>{const f=m.score[t]-m.score[1-t];return f>0?0:f===0?1:2;};
    const sutYaz=(m,p,v,kafa)=>{if(!p||p.team==null)return;const h=m.half-1,t=p.team,e=p.eylem,s=m.ball.sut,b=dilim(m),du=durum(m,t);
      const pen=!kafa&&!!(e&&e.ad==='vurus'&&e.sec&&e.sec.penalti);
      sut[h]++;dS[b]++;dSd[b*3+du]++;
      if(!pen){const x=s&&s.xgYer!=null?s.xgYer:(v&&v.xg)||0;xg[h]+=x;dX[b]+=x;}
      if(h===1){durumS[du]++;if(yedek.has(p))yedekSut++;}
      sonSut[t]={t:m.t,h,pen,b};};
    return{
      dinle(ad,v,m){if(!m)return;
        if(ad==='shot')sutYaz(m,v&&v.p,v,false);
        else if(ad==='header'){if(v&&v.shot)sutYaz(m,v.p,v,true);}
        else if(ad==='goal'){dG[dilim(m)]++;const s=sonSut[v.team];if(!v.own&&s&&!s.pen&&m.t-s.t<=8){golS[s.h]++;dGs[s.b]++;}}
        else if(ad==='kickoff'){const h=(v&&v.half||m.half)-1;if(kayip[h]!==kayip[h])kayip[h]=m.gameSec-(h?2700:0);}
        else if(ad==='kosu'){if(m.phase==='play')kosu[m.half-1]++;}
        else if(ad==='oyuncuGirdi'){if(v&&v.giren)yedek.add(v.giren);}},
      adim(m){adimN++;if(m.phase!=='play')return;const h=m.half-1,b=dilim(m);oy[h]+=dt;dOy[b]+=dt;
        /* T18-0: ivmelenme dilime (r-karne tanımı: 0,2 sn pencerede hız > 3 m/sn² artış, 1 sn'de tek) */
        for(const p of m.players){if(!p.oyunda||p.rol==='GK'||p.tur!=='oyuncu')continue;const sp=Math.hypot(p.vx,p.vz);dOyun[b]+=dt;
          let q=ivH.get(p);if(!q){q={v:new Float64Array(12),i:0,n:0,ust:false,son:-9};ivH.set(p,q);}
          if(q.n>=12&&!(p.eylem&&p.eylem.kilit)){const a=(sp-q.v[q.i])/0.2;if(a>3){if(!q.ust&&m.t-q.son>1){dIv[b]++;q.son=m.t;}q.ust=true;}else q.ust=false;}
          q.v[q.i]=sp;q.i=(q.i+1)%12;q.n++;}
        for(let t=0;t<2;t++)dTd[b*3+durum(m,t)]+=dt;
        if(h===1){for(let t=0;t<2;t++){takim2+=dt;durumT[durum(m,t)]+=dt;const N=m._niyet&&m._niyet[t];if(N&&N.ad==='tut')tut2+=dt;}}
        if(adimN%6)return;
        for(const p of m.players){if(!p.oyunda||p.rol==='GK'||p.tur!=='oyuncu')continue;kosN[h]++;if(Y_KOS.has(p.kip))kos[h]++;dHskN[b]++;if(Math.hypot(p.vx,p.vz)>5.5)dHsk[b]++;}
        const s=m.ball.sahip;if(!s||s.team==null)return;const d=1-s.team;let en=1e9,ek=-1e9;
        for(const q of m.teams[d]){if(!q.oyunda||q.rol==='GK')continue;const u=q.x*m.dir[s.team];if(u<en)en=u;if(u>ek)ek=u;}
        if(ek>en){boy[h]+=ek-en;boyN[h]++;dBoy[b]+=ek-en;dBoyN[b]++;}
        {let ad=1e9;for(const q of m.teams[d]){if(!q.oyunda||q.rol==='GK')continue;const dd=Math.hypot(q.x-s.x,q.z-s.z);if(dd<ad)ad=dd;}if(ad<1e8){dAdam[b]+=ad;dAdamN[b]++;}}},
      bitir(){
        return{yKayip1:kayip[0],yKayip2:kayip[1],ySutDk1:oy[0]?sut[0]/(oy[0]/60):NaN,ySutDk2:oy[1]?sut[1]/(oy[1]/60):NaN,
          yKosu1:oy[0]?kosu[0]/(oy[0]/60):NaN,yKosu2:oy[1]?kosu[1]/(oy[1]/60):NaN,yBoy1:boyN[0]?boy[0]/boyN[0]:NaN,yBoy2:boyN[1]?boy[1]/boyN[1]:NaN,
          yDilim:{g:dG,s:dS,oy:dOy,x:dX,gs:dGs,td:dTd,sd:dSd,hsk:dHsk,hskN:dHskN,iv:dIv,oyun:dOyun,boy:dBoy,boyN:dBoyN,adam:dAdam,adamN:dAdamN},
          /* oran satırları 100·pay/payda yazar: ÷ xG ve dakika başına satırlarda payda 100 ile çarpılır (v-verim vvOranH gibi) */
          ham:{yOyun2:[oy[1],oy[0]],ySut2:[sut[1],sut[0]+sut[1]],yXg2:[xg[1],xg[0]+xg[1]],yOran1:[golS[0],100*xg[0]],yOran2:[golS[1],100*xg[1]],
            ySutOnde:[durumS[0],100*durumT[0]/60],ySutBer:[durumS[1],100*durumT[1]/60],ySutGeri:[durumS[2],100*durumT[2]/60],yTut2:[tut2,takim2],
            yKos1:[kos[0],kosN[0]],yKos2:[kos[1],kosN[1]],yYedekSut:[yedekSut,sut[1]]}};}
    };
  },
  /* dilimler: bütün maçların toplamı — gol payı, şut payı, şut / oyun dk, penaltısız xG / şut ve gol ÷ xG, skor durumu (öndeyken, berabereyken,
     gerideyken takım·oyun dk başına şut; önde olan takımın bulunduğu oyun süresi payı) */
  ozet(sonuclar){
    const G=[0,0,0,0,0,0],S=[0,0,0,0,0,0],O=[0,0,0,0,0,0],X=[0,0,0,0,0,0],GS=[0,0,0,0,0,0],TD=new Array(18).fill(0),SD=new Array(18).fill(0);
    const HS=[0,0,0,0,0,0],HN=[0,0,0,0,0,0],IV=[0,0,0,0,0,0],OY=[0,0,0,0,0,0],BY=[0,0,0,0,0,0],BN=[0,0,0,0,0,0],AD=[0,0,0,0,0,0],AN=[0,0,0,0,0,0];
    for(const r of sonuclar){const d=r.yDilim;if(!d)continue;
      for(let i=0;i<6;i++){G[i]+=d.g[i]||0;S[i]+=d.s[i]||0;O[i]+=d.oy[i]||0;X[i]+=d.x?d.x[i]||0:0;GS[i]+=d.gs?d.gs[i]||0:0;
        if(d.hsk){HS[i]+=d.hsk[i]||0;HN[i]+=d.hskN[i]||0;IV[i]+=d.iv[i]||0;OY[i]+=d.oyun[i]||0;BY[i]+=d.boy[i]||0;BN[i]+=d.boyN[i]||0;AD[i]+=d.adam[i]||0;AN[i]+=d.adamN[i]||0;}}
      if(d.td)for(let i=0;i<18;i++){TD[i]+=d.td[i]||0;SD[i]+=d.sd[i]||0;}}
    const gT=G.reduce((a,b)=>a+b,0),sT=S.reduce((a,b)=>a+b,0);if(!sT)return;
    const f=(x,n)=>String(x).padStart(n),hiz=(s,t)=>t>0?(s/(t/60)).toFixed(2):'—';
    console.log('\n  Yarılar (y-yari; T16-0): 15 dakikalık dilim · gol % · şut % · şut / oyun dk · xG / şut · gol ÷ xG (penaltısız) │ takım·oyun dk başına şut: önde · berabere · geride │ önde olan var %');
    console.log('  (gerçek gol payı: 1–15 ~%13, 76–90+ ~%22, ikinci yarı ~%55; uzatma son dilime girer)');
    for(let i=0;i<6;i++){const td=TD.slice(i*3,i*3+3),sd=SD.slice(i*3,i*3+3),tum=td[0]+td[1]+td[2];
      console.log('  '+Y_DILIM[i].padEnd(8)+f(gT?(100*G[i]/gT).toFixed(1):'—',7)+f((100*S[i]/sT).toFixed(1),7)+f(hiz(S[i],O[i]),7)+f(S[i]?(X[i]/S[i]).toFixed(3):'—',8)+f(X[i]>0?(GS[i]/X[i]).toFixed(2):'—',7)
        +'  │'+f(hiz(sd[0],td[0]),6)+f(hiz(sd[1],td[1]),7)+f(hiz(sd[2],td[2]),7)+'  │'+f(tum?(100*2*td[0]/tum).toFixed(1):'—',7));}
    /* T18-0: dilimlere göre yüksek şiddetli koşu payı, ivmelenme, savunan takımın boyu, 1. adamın topa uzaklığı (gerçek: HŞK son 15 ÷ ilk 15 ≈ 0,80 toplam süreyle, 0,86–0,93 etkin süreyle;
       ivmelenme ilk → son dilim −15…−21 %; takım uzunluğu yarılar arasında +1,4 m, anlamsız — Bradley 2009/2010, Linke 2018, Akenhead 2013, Praça 2020) */
    if(HN.some(x=>x)){console.log('  Dilimlere göre hareket (T18-0): dilim · yüksek şiddetli koşu (> 5,5 m/sn) % · > 3 m/sn² ivmelenme / oyuncu·dk · savunan takımın boyu (m) · 1. adamın topa uzaklığı (m)');
      for(let i=0;i<6;i++)console.log('  '+Y_DILIM[i].padEnd(8)+f(HN[i]?(100*HS[i]/HN[i]).toFixed(2):'—',8)+f(OY[i]?(IV[i]/(OY[i]/60)).toFixed(2):'—',9)+f(BN[i]?(BY[i]/BN[i]).toFixed(1):'—',8)+f(AN[i]?(AD[i]/AN[i]).toFixed(2):'—',8));}
  }
};
