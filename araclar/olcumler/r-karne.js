'use strict';
/* ============ Robotluk karnesi (gerçekçilik planı T0; MAC_MOTORU_GERCEKCILIK_PLANI.md Ek F) ============
   Hareketin temposu, topun ayakta kalışı, sahiplik zincirleri, top kaybının nedeni, PPDA, şutun yeri, gollerin kaynağı ve duran top düzeni.
   Top oyundayken ve saha oyuncuları (kaleci hariç) için ölçülür. Rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları,
   top ve oyuncu alanlarını okur. Oranlar bütün maçların toplamından (ham), diğer satırlar maç başına ortalamadır. Gerçek futbol karşılıkları planın
   §1 tablosundadır. */
const R_PL=52.5,R_MZ=34,R_CU=16.5,R_CW=20.16;
const R_KAYIP=[['pas','kesilen / isabetsiz pas'],['diger','çalım, sürüş kaybı, seken top'],['hava','hava topu, kafa sonrası'],['mudahale','müdahale'],['kontrol','kötü ilk dokunuş']];
/* T0: satırlara planın tur kabul hedefleri bağlandı (4. öğe [alt, üst, tur]; bilgi amaçlı, dışındaysa "!", çıkış kodu değişmez).
   T1/T2 hedefleri §4 "Kabul"den; T8 satırları da aynı tanımı ölçtüğü için eklendi. Hedefsiz satırların planda doğrudan karşılığı yok
   (ör. barajlı serbest vuruşta T8 hedefi doğrudan şut başınadır, burada 8 sn içindeki gol; ayrı ölçüm d-duran senaryosunda) */
module.exports={
  bilgi:[
    ['— R: robotluk karnesi (gerçekçilik planı Ek F) —',null,0],
    ['Hareket: durma + yürüme (<2 m/sn) %','rDurYuru',1,[40,null,'T1']],['Hareket: depar (≥7 m/sn) %','rDepar',1,[null,3,'T1']],
    ['Hareket: topa >25 m iken >4 m/sn %','rUzakKosu',1,[null,25,'T1']],['Hareket: 16+ saha oyuncusu koşuyor (anların) %','rKalabalik',1,[null,25,'T1']],
    ['Hareket: ortalama hız (m/dk)','rHizDk',0,[140,180,'T1']],['Hareket: >3 m/sn² ivmelenme / oyuncu·dk','rIvme',1,[null,5,'T1']],
    ['Top ayakta: ortanca (sn)','rAyakta',2,[1.2,2.0,'T2']],['Top ayakta: 1 sn\'den kısa %','rAyaktaKisa',1,[null,45,'T2']],['Top taşıma: >5 m %','rTasima',1,[25,35,'T2']],
    ['Sahiplik: tamamlanan pas ort.','rSeqPas',2,[2.5,4,'T2']],['Sahiplik: ortalama süre (sn)','rSeqSure',1],['Sahiplik: pas yapılamadan biten %','rSeqBos',1,[null,25,'T2']],
    /* T2 (2026-10-07): 10+ paslı sahiplik, pasın alıcısı (karar katmanının hedeflediği arkadaş; oyuncu-karnesi.js'teki gruplarla aynı), pas boyu */
    ['Sahiplik: 10+ paslı %','rSeq10',1,[3,null,'T2']],
    ['Pas alıcısı: forvet %','rAliciForvet',1,[null,30,'T2']],['Pas alıcısı: kanat %','rAliciKanat',1,[15,null,'T2']],['Pas boyu ort. (m)','rPasBoy',1,[16,20,'T2']]]
    .concat(R_KAYIP.map(([k,ad])=>['Top kaybı nedeni: '+ad+' %','rKayip_'+k,1]))
    .concat([['PPDA (rakibin kendi %60\'ında pas / savunma eylemi)','rPpda',1,[7,12,'T2']],
    ['Şut: ceza sahası içinden %','rSutKutu',1,[55,null,'T2']],['Şut: ortanca mesafe (m)','rSutMesafe',1,[14,16,'T2']],
    ['Şut: forvet dışı %','rSutForvetDisi',1,[30,null,'T3']],
    ['Gol: duran toptan (korner, serbest, penaltı) %','rGolDuran',1,[25,35,'T8']],
    ['Korner: 8 sn içinde gol %','rKornerGol',1,[3,5,'T8']],['Korner: ceza sahasındaki hücumcu','rKornerKutu',1],
    ['Korner: geride kalanların hızı − takım ort. (özellik)','rKornerGeriHiz',2,[0,null,'T8']],
    ['Barajlı serbest vuruş: 8 sn içinde gol %','rBarajGol',1],['Barajlı serbest vuruş: barajdaki kişi','rBarajKisi',1],
    ['Barajsız serbest vuruş (son 40 m): ceza sahasındaki hücumcu','rSerbestKutu',1,[4,6,'T8']],
    ['Tehlikeli duran topta hazırlık (sn, ortanca)','rDuranHazirlik',1,[10,14,'T8']]]),
  yeni:()=>{
    const hyp=Math.hypot,ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN,ortanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b);return S[Math.floor(S.length/2)];};
    /* hareket */
    let tOy=0,tDY=0,tDep=0,tUzak=0,tUzakKosu=0,mes=0,orn=0,kalabalik=0,efor=0,adim=0;const iv=new Map();
    /* top */
    const ayakta=[],tasima=[];let sahipP=null,sahipT=0,tas=null;
    /* sahiplik ve kayıp */
    const seqs=[],kayip={};let seq=null;const son={steal:null,kotu:null,pas:null,kafa:null};let ppdaPas=0,ppdaEylem=0;
    /* şut ve gol */
    let sut=0,sutKutu=0,sutDisi=0,gol=0,golDuran=0;const sutL=[];
    /* duran top */
    let onceki=null,lastDu=null,duT0=0;const bekleyen=[],korner=[],baraj=[],serbest=[],hazirlik=[];
    /* pasın alıcısı ve boyu (T2) */
    const grup=q=>!q?'-':q.rol==='GK'?'kaleci':q.mevki&&q.mevki.bek?'bek':q.rol==='DEF'?'stoper':q.mevki&&q.mevki.kanat?'kanat':q.rol==='OS'?'merkez':'forvet';
    let pasN=0,pasL=0,alFv=0,alKn=0,alN=0;
    const kapat=(m,neden)=>{if(!seq)return;seqs.push({sure:m.t-seq.t0,pas:m.ist.pasTamam[seq.team]-seq.pt0,neden});seq=null;};
    const kutuda=(m,p,t)=>{const gx=m.dir[t]*R_PL;return Math.abs(p.x-gx)<R_CU&&Math.abs(p.z-R_MZ)<R_CW;};
    return{
      dinle(ad,v,m){if(!m)return;const b=m.ball;
        if(ad==='pass'||ad==='cross'){if(v.p&&sahipP===v.p)ayakta.push(m.t-sahipT);if(v.p){son.pas={t:m.t,team:v.p.team};if(b.x*m.dir[v.p.team]<10.5)ppdaPas++;}
          if(ad==='pass'&&v.L!=null){pasN++;pasL+=v.L;}
          if(v.q&&v.q.team!=null){const g=grup(v.q);alN++;if(g==='forvet')alFv++;else if(g==='kanat')alKn++;}}
        else if(ad==='shot'){sut++;if(v.p&&kutuda(m,v.p,v.p.team))sutKutu++;if(v.p&&v.p.rol!=='FV')sutDisi++;if(v.dist!=null)sutL.push(v.dist);if(v.p&&sahipP===v.p)ayakta.push(m.t-sahipT);}
        else if(ad==='header'){son.kafa={t:m.t};if(v.shot){sut++;sutKutu++;if(v.p&&v.p.rol!=='FV')sutDisi++;}}
        else if(ad==='mudahale'){if(v.p&&b.x*m.dir[1-v.p.team]<10.5)ppdaEylem++;}
        else if(ad==='steal'){if(v.p)son.steal={t:m.t,team:v.p.team};}
        else if((ad==='faul'&&!v.avantajdan)||ad==='avantaj'){const f=v.faulYapan;if(f&&b.x*m.dir[1-f.team]<10.5)ppdaEylem++;}
        else if(ad==='kotuKontrol'){if(v.p)son.kotu={t:m.t,team:v.p.team};}
        else if(ad==='goal'){gol++;const sk=m.sonKullanim;if(!v.own&&sk&&m.t-sk.t<10&&sk.p&&sk.p.team===v.team&&(sk.tur==='korner'||sk.tur==='serbest'||sk.tur==='penalti'))golDuran++;}},
      adim(m){adim++;const b=m.ball,ph=m.phase;
        /* duran top: oyuna dönüş anında düzen; 8 sn sonra şut/gol */
        if(ph==='durus'){if(onceki!=='durus')duT0=m.t;lastDu=m.durus;}
        if(onceki==='durus'&&ph==='play'&&lastDu){const du=lastDu,att=du.takim,d=m.dir[att];
          const A=m.teams[att].filter(p=>p.oyunda&&p.rol!=='GK'&&p!==du.kullanan),D=m.teams[1-att].filter(p=>p.oyunda&&p.rol!=='GK'),kutu=p=>kutuda(m,p,att);
          if(du.tur==='korner'){const geri=A.filter(p=>p.x*d<0),o={kutu:A.filter(kutu).length,geriHiz:geri.length?ort(geri.map(p=>p.oz.hiz))-ort(A.map(p=>p.oz.hiz)):NaN,gol:false};
            korner.push(o);hazirlik.push(m.t-duT0);bekleyen.push({t:m.t+8,att,g0:m.score[att],o});}
          else if(du.tur==='serbest'&&du.x*d>0){const n=du.barajdakiler?du.barajdakiler.length:0,mesafe=hyp(d*R_PL-du.x,R_MZ-du.z);
            if(n){const o={kisi:n,gol:false};baraj.push(o);hazirlik.push(m.t-duT0);bekleyen.push({t:m.t+8,att,g0:m.score[att],o});}
            else if(mesafe<40)serbest.push(A.filter(kutu).length);}
          void D;}
        for(let i=bekleyen.length-1;i>=0;i--){const q=bekleyen[i];if(m.t>=q.t){q.o.gol=m.score[q.att]>q.g0;bekleyen.splice(i,1);}}
        onceki=ph;
        if(ph!=='play'){if(seq)kapat(m,'durdu');if(tas)tasima.push(tas);tas=null;sahipP=null;return;}
        /* sahiplik zinciri, top ayakta, taşıma */
        const s=b.sahip;
        if(s!==sahipP){if(tas)tasima.push(tas);sahipP=s;sahipT=m.t;tas=s?{yol:0}:null;}
        if(s&&tas)tas.yol+=hyp(s.vx,s.vz)/60;
        if(s){const st=s.team;
          if(!seq||seq.team!==st){
            if(seq){let k='diger';
              if(son.steal&&m.t-son.steal.t<1.5&&son.steal.team===st)k='mudahale';
              else if(son.kotu&&m.t-son.kotu.t<2.5&&son.kotu.team===seq.team)k='kontrol';
              else if(son.kafa&&m.t-son.kafa.t<2.5)k='hava';
              else if(son.pas&&m.t-son.pas.t<4&&son.pas.team===seq.team){k='pas';if(b.x*m.dir[seq.team]<10.5)ppdaEylem++;}
              kayip[k]=(kayip[k]||0)+1;kapat(m,'kayip');}
            seq={team:st,t0:m.t,pt0:m.ist.pasTamam[st]};}}
        /* hareket: hız bölgeleri, topa uzaklık, ivmelenme (0,2 sn pencerede hız büyüklüğü değişimi; 1 sn içinde tek sayılır) */
        let n=0;const dt=1/60;
        for(const p of m.players){if(!p.oyunda||p.rol==='GK')continue;const sp=hyp(p.vx,p.vz);tOy+=dt;mes+=sp*dt;if(sp<2)tDY+=dt;if(sp>=7)tDep+=dt;if(sp>2)n++;
          if(hyp(p.x-b.x,p.z-b.z)>25){tUzak+=dt;if(sp>4)tUzakKosu+=dt;}
          let h=iv.get(p);if(!h){h={v:new Float64Array(12),i:0,n:0,ust:false,son:-9};iv.set(p,h);}
          if(h.n>=12&&!(p.eylem&&p.eylem.kilit)){const a=(sp-h.v[h.i])/0.2;if(a>3){if(!h.ust&&m.t-h.son>1){efor++;h.son=m.t;}h.ust=true;}else h.ust=false;}
          h.v[h.i]=sp;h.i=(h.i+1)%12;h.n++;}
        if(adim%30===0){orn++;if(n>=16)kalabalik++;}},
      bitir(){const tk=Object.values(kayip).reduce((a,c)=>a+c,0),ham={
          rDurYuru:[tDY,tOy],rDepar:[tDep,tOy],rUzakKosu:[tUzakKosu,tUzak],rKalabalik:[kalabalik,orn],
          rAyaktaKisa:[ayakta.filter(x=>x<1).length,ayakta.length],rTasima:[tasima.filter(t=>t.yol>5).length,tasima.length],
          rSeqBos:[seqs.filter(s=>s.pas===0).length,seqs.length],rSeq10:[seqs.filter(s=>s.pas>=10).length,seqs.length],
          rAliciForvet:[alFv,alN],rAliciKanat:[alKn,alN],rSutKutu:[sutKutu,sut],rSutForvetDisi:[sutDisi,sut],rGolDuran:[golDuran,gol],
          rKornerGol:[korner.filter(k=>k.gol).length,korner.length],rBarajGol:[baraj.filter(k=>k.gol).length,baraj.length]};
        for(const [k] of R_KAYIP)ham['rKayip_'+k]=[kayip[k]||0,tk];
        return{ham,rPasBoy:pasN?pasL/pasN:NaN,rHizDk:tOy?mes/tOy*60:NaN,rIvme:tOy?efor/(tOy/60):NaN,rAyakta:ortanca(ayakta),rSeqPas:ort(seqs.map(s=>s.pas)),rSeqSure:ort(seqs.map(s=>s.sure)),
          rPpda:ppdaEylem?ppdaPas/ppdaEylem:NaN,rSutMesafe:ortanca(sutL),rKornerKutu:ort(korner.map(k=>k.kutu)),rKornerGeriHiz:ort(korner.map(k=>k.geriHiz).filter(x=>x===x)),
          rBarajKisi:ort(baraj.map(k=>k.kisi)),rSerbestKutu:ort(serbest),rDuranHazirlik:ortanca(hazirlik)};}
    };
  }
};
