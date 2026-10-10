'use strict';
/* ============ Şut kaynağı ölçümü (M1, 2026-10-10; gerçekçilik planı “M1 — Hız bakımı”; T6, T9b ve T8'in ortak ölçüsü) ============
   r-karne.js ve t-takim.js ile aynı sözleşme: rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları, top, oyuncu, duruş,
   istatistik ve saat alanlarını okur. Oranlar bütün maçların toplamından (ham), diğer satırlar maç başına ortalamadır. Tanımlar:
   - Şut: 'shot' olayı ya da şut sayılan kafa ('header', shot). Kaynak öncelik sırasıyla: penaltı (penaltı duruşundan sonra kullananın ilk vuruşu);
     doğrudan serbest vuruş (serbest vuruşu kullananın ilk vuruşu şut); duran top (korner; serbest vuruş — dolaylı ya da ortalanan —; taç: duruştan
     sonra rakip topu alana ya da korner ve serbest vuruşta 10 sn, taçta 8 sn dolana kadar); ortadan (son 3 sn'de takım arkadaşının ortası; kafa
     ya da ayak); geri çevirmeden (son 3 sn'de takım arkadaşının geri çevirmesi); kalanı açık oyun. Gol, aynı takımın son şutundan ≤ 4 sn sonra
     gelirse o şutun kaynağına yazılır (dönen topla gelen gol de).
   - Rol ve mesafe: şutu atanın grubu (r-karne grupları) ve kale ortasına uzaklığı (<11, 11–16,5, 16,5–25, >25 m).
   - Başlayıp vurulmayan şut: şut kararıyla başlayan vuruş (p.eylem 'vurus', sec.tur 'sut') şut olayına varmadan bitti (müdahale, vazgeçme,
     duruş …). Yalnız ayak şutları; maç sonunda yarım kalan sayılmaz.
   - Orta sonucu: ortadan ('cross' olayı; korner ortası da) sonraki 3 sn'de ilk belirleyici olay: blok, kaleci (kurtarış, yakalama, yumruk, parmak),
     hücumun kafa şutu, hücumun diğer kafası, savunmanın kafası, hücumun ayak şutu (gelişine), hücum topu aldı, savunma topu aldı, uzaklaştırma,
     top oyun dışı; hiçbiri olmazsa “diğer”. Hava düellosu (m.ist.havaTopu arttı) ayrıca sayılır.
   - Serbest vuruş bölgesi: duruşun yeri kale ortasına ≤ 30 m (yakın) ya da uzak. Barajlı doğrudan serbest vuruşta şut başına gol T8 bandıdır
     (%6–10; d-duran senaryosunun [barajlı] tanımıyla aynı). */
const S_PL=52.5,S_MZ=34;
const S_KAYNAK=['acik','ortaKafa','ortaAyak','geriCevir','korner','serbest','dogrudan','penalti','tac'];
const S_KAYNAK_AD={acik:'açık oyun',ortaKafa:'ortadan kafa',ortaAyak:'ortadan ayak',geriCevir:'geri çevirmeden',korner:'korner',
  serbest:'serbest vuruş (dolaylı ya da ortalanan)',dogrudan:'doğrudan serbest vuruş',penalti:'penaltı',tac:'taç'};
const S_GRUP=['stoper','bek','merkez','kanat','forvet','kaleci'];
const S_MESAFE=['<11 m','11–16,5 m','16,5–25 m','>25 m'];
const S_ORTA=['blok','kaleci','kafaSut','kafaHucum','kafaSavunma','ayakSut','hucumAldi','savunmaAldi','uzaklastirma','disari','diger'];
const S_ORTA_AD={blok:'blok',kaleci:'kaleci',kafaSut:'hücumun kafa şutu',kafaHucum:'hücumun diğer kafası',kafaSavunma:'savunmanın kafası',
  ayakSut:'hücumun ayak şutu',hucumAldi:'hücum topu aldı',savunmaAldi:'savunma topu aldı',uzaklastirma:'uzaklaştırma',disari:'top oyun dışı',diger:'diğer'};
module.exports={
  bilgi:[['— Şut kaynağı (s-sut; M1 ölçümü; T6, T9b, T8) —',null,0]]
    .concat(S_KAYNAK.map(k=>['Şut: '+S_KAYNAK_AD[k]+' / maç','sS_'+k,2]))
    .concat(S_KAYNAK.map(k=>['Gol / şut: '+S_KAYNAK_AD[k]+' %','sG_'+k,1]))
    .concat(S_GRUP.map(g=>['Şut payı: '+g+' %','sR_'+g,1]))
    .concat(S_MESAFE.map((a,i)=>['Şut payı: '+a+' %','sM_'+i,1]))
    .concat([['Başlayıp vurulmayan şut / maç','sVurulmayan',2],['Başlayıp vurulmayan şut: başlayanın %','sVurulmayanOran',1],
      ['Orta / maç','sOrta',1],['Orta: hava düellosu oldu %','sOrtaHava',1]])
    .concat(S_ORTA.map(k=>['Orta sonucu: '+S_ORTA_AD[k]+' %','sO_'+k,1]))
    .concat([['Korner başına şut','sKornerSut',2],
      ['Serbest vuruş: yakın (≤30 m) / maç','sSerbestYakin',2],['Serbest vuruş: yakında doğrudan şut %','sSerbestYakinSut',1],
      ['Barajlı doğrudan serbest vuruş / maç','sBarajliSut',2],['Barajlı doğrudan serbest vuruşta şut başına gol %','sBarajliGol',1,[6,10,'T8']]]),
  yeni:()=>{
    const hyp=Math.hypot;
    const grup=q=>!q?'-':q.rol==='GK'?'kaleci':q.mevki&&q.mevki.bek?'bek':q.rol==='DEF'?'stoper':q.mevki&&q.mevki.kanat?'kanat':q.rol==='OS'?'merkez':'forvet';
    const sut={},gol={},rol={},mes=[0,0,0,0],orta={};let sutN=0,baslayan=0,vurulmayan=0,ortaN=0,ortaHava=0,korner=0,kornerSut=0;
    let syN=0,syMac=0,syDogrudan=0,bjN=0,bjGol=0;
    for(const k of S_KAYNAK){sut[k]=0;gol[k]=0;}for(const g of S_GRUP)rol[g]=0;for(const k of S_ORTA)orta[k]=0;
    let du=null;                         /* duran top bağlamı: {tur, team, taker, t0 (oyunun yeniden başladığı an), vurus, sure, ref (m.durus), yakin} */
    let sonOrta=null,sonGeri=null,sonSut=null,bekOrta=null,havaOnce=0;
    const acik=new Map(),gorulen=new WeakSet();   /* oyuncu → vurulmayı bekleyen şut eylemi; sayılmış şut eylemleri */
    /* orta biterken de hava düellosu sayılır: düello ile onu kazanan kafa aynı adımda gelince orta adim'den önce kapanır */
    let sonM=null;
    const ortaBitir=s=>{if(!bekOrta)return;if(!bekOrta.hava&&sonM&&sonM.ist.havaTopu>havaOnce)ortaHava++;orta[s]++;bekOrta=null;};
    const sutSay=(m,p,kafa)=>{if(!p||p.team==null)return;const t=p.team;let k='acik';
      if(du&&du.team===t){
        if(du.tur==='penalti'&&du.vurus===0&&p===du.taker)k='penalti';
        else if(du.tur==='serbest'&&du.vurus===0&&p===du.taker){k='dogrudan';if(du.yakin)syDogrudan++;if(du.ref&&du.ref.baraj)bjN++;}
        else if(du.tur==='korner'){k='korner';kornerSut++;}
        else if(du.tur==='serbest')k='serbest';
        else if(du.tur==='tac')k='tac';}
      if(k==='acik'){
        if(sonOrta&&sonOrta.team===t&&sonOrta.p!==p&&m.t-sonOrta.t<=3)k=kafa?'ortaKafa':'ortaAyak';
        else if(sonGeri&&sonGeri.team===t&&sonGeri.p!==p&&m.t-sonGeri.t<=3)k='geriCevir';}
      sutN++;sut[k]++;const g=grup(p);if(rol[g]!=null)rol[g]++;
      const L=hyp(m.dir[t]*S_PL-p.x,S_MZ-p.z);mes[L<11?0:L<16.5?1:L<25?2:3]++;
      sonSut={t:m.t,team:t,k,barajli:k==='dogrudan'&&!!(du&&du.ref&&du.ref.baraj)};
      if(du&&du.team===t)du.vurus++;};
    return{
      dinle(ad,v,m){if(!m)return;sonM=m;
        if(ad==='tac'||ad==='korner'||ad==='serbest'||ad==='penalti'||ad==='kaleVurusu'){
          if(ad==='kaleVurusu'){du=null;return;}
          const yakin=hyp(m.dir[v.team]*S_PL-v.x,S_MZ-v.z)<=30;
          du={tur:ad,team:v.team,taker:v.taker,t0:null,vurus:0,sure:ad==='tac'?8:10,ref:m.durus,yakin};
          if(ad==='korner')korner++;if(ad==='serbest'){syMac++;if(yakin)syN++;}return;}
        if(ad==='shot'){const p=v.p;if(p)acik.delete(p);sutSay(m,p,false);if(bekOrta&&p&&p.team===bekOrta.team)ortaBitir('ayakSut');return;}
        if(ad==='header'){const p=v.p;if(v.shot)sutSay(m,p,true);
          if(bekOrta&&p)ortaBitir(p.team===bekOrta.team?(v.shot?'kafaSut':'kafaHucum'):'kafaSavunma');return;}
        if(ad==='goal'){if(sonSut&&sonSut.team===v.team&&!v.own&&m.t-sonSut.t<=4){gol[sonSut.k]++;if(sonSut.barajli)bjGol++;}sonSut=null;du=null;return;}
        if(ad==='kickoff'){du=null;sonOrta=null;sonGeri=null;bekOrta=null;return;}
        if(ad==='pass'||ad==='cross'){const p=v.p;if(!p||p.team==null)return;
          if(du&&du.team===p.team)du.vurus++;
          if(ad==='cross'){ortaN++;sonOrta={t:m.t,team:p.team,p};bekOrta={t:m.t,team:p.team};havaOnce=m.ist.havaTopu;bekOrta.hava=false;}
          else if(v.tur==='geriCevir')sonGeri={t:m.t,team:p.team,p};
          return;}
        if(ad==='clear'||ad==='gkkick'){const p=v.p;if(du&&p&&du.team===p.team)du.vurus++;if(bekOrta&&p&&p.team!==bekOrta.team)ortaBitir('uzaklastirma');return;}
        if(bekOrta){
          if(ad==='block')ortaBitir('blok');
          else if(ad==='save'||ad==='kapan'||ad==='yumruk'||ad==='parmak')ortaBitir('kaleci');}},
      adim(m){const b=m.ball;sonM=m;
        /* başlayan şutlar: vuruş eylemi şut olayına varmadan bittiyse vurulmadı */
        for(const p of m.players){const e=p.eylem,se=e&&e.ad==='vurus'&&e.sec&&e.sec.tur==='sut'?e:null,a=acik.get(p);
          if(a&&a!==se){vurulmayan++;acik.delete(p);}
          if(se&&!gorulen.has(se)){gorulen.add(se);baslayan++;acik.set(p,se);}}
        /* duran top bağlamı: oyun yeniden başladıktan sonra rakip topu aldı ya da süre doldu */
        if(du&&m.phase==='play'){if(du.t0==null)du.t0=m.t;const s=b.sahip;if(m.t-du.t0>du.sure||(s&&s.team!=null&&s.team!==du.team))du=null;}
        /* orta sonucu */
        if(bekOrta){if(m.ist.havaTopu>havaOnce&&!bekOrta.hava){bekOrta.hava=true;ortaHava++;}
          if(m.phase!=='play')ortaBitir('disari');
          else if(b.sahip&&b.sahip.team!=null)ortaBitir(b.sahip.team===bekOrta.team?'hucumAldi':'savunmaAldi');
          else if(m.t-bekOrta.t>3)ortaBitir('diger');}},
      bitir(){
        const ham={sVurulmayanOran:[vurulmayan,baslayan],sOrtaHava:[ortaHava,ortaN],sSerbestYakinSut:[syDogrudan,syN],sBarajliGol:[bjGol,bjN]};
        for(const k of S_KAYNAK)ham['sG_'+k]=[gol[k],sut[k]];
        for(const g of S_GRUP)ham['sR_'+g]=[rol[g],sutN];
        for(let i=0;i<4;i++)ham['sM_'+i]=[mes[i],sutN];
        let oT=0;for(const k of S_ORTA)oT+=orta[k];for(const k of S_ORTA)ham['sO_'+k]=[orta[k],oT];
        const r={ham,sVurulmayan:vurulmayan,sOrta:ortaN,sKornerSut:korner?kornerSut/korner:NaN,sSerbestYakin:syN,sBarajliSut:bjN};
        for(const k of S_KAYNAK)r['sS_'+k]=sut[k];
        return r;}
    };
  }
};
