'use strict';
/* ============ B0 (2026-10-22): atak zihniyeti ve amaçsız pas — FUTBOL_KUTUPHANESI §11.1 madde 6, §12.1 B ============
   Sözleşme k-kurma ile aynı: rastlantı çekmez, motor yöntemi çağırmaz, oyuncuya ve topa yazmaz. Takım başına (0 ev, 1 konuk) satırlar ve tarz başına
   özet tablo. Görev çalkantısının (aynı karede birçok oyuncunun fırlaması) ölçüsü ayrı kurulmaz: r-karne "ivmelenme kümesi / takım·dk" (rIvmeKume).
   Tanımlar:
   - Pas: oyundayken 'pass' olayı (m.ball.pas aynı pasın kaydıysa). Yön motorun pasSay sınıfıyla aynı: ileri yalnız 45°'lik dilim, geri 135°'nin ötesi,
     arası yan. Duran top pasları ('pass' olayı yayılmaz) sayılmaz.
   - Baskısız: pas anında pasöre (topun çıkış noktasına) en yakın rakip ≥ 4,5 m (motorun baskiAltinda tanımında baskı 0).
   - Takım sahipliği: topun sahibi takım değişince ya da oyun durunca biter.
   - Amaçsız zincir: aynı takım sahipliğinde ardışık ≥ 3 geri ya da yan ve baskısız pas; zincirin net ilerlemesi (ilk pasın çıkışından son pasın
     hedefine, takımın yönünde) ≤ 0. İleri pas, baskı altındaki pas, şut, orta, pasların arasında ≥ 5 m ileri taşıma ya da sahipliğin bitişi zinciri kapatır.
   - Amaçlı geri pas: geri pastan (ilerleme < −4 m, kararın eşiği) sonra aynı takım sahipliğinde 3 sn içinde ileri ve ≥ 25 m bir pas.
   - Sahiplik başına net ilerleme: takım sahipliğinin başındaki ve sonundaki topun yeri arasındaki fark (m, takımın yönünde). */
const B0_ESIK_BASKI=4.5,B0_ZINCIR=3,B0_AMAC_SN=3,B0_AMAC_L=25,B0_TASI=5;
function b0Yon(d,x0,z0,hx,hz){const a=Math.atan2(Math.abs(hz-z0),(hx-x0)*d);return a<Math.PI/4?1:a>Math.PI*3/4?-1:0;}
function b0Yakin(m,t,x,z){let e=99;for(const o of m.teams[1-t]){if(!o.oyunda)continue;const r=Math.hypot(o.x-x,o.z-z);if(r<e)e=r;}return e;}
/* takımın tarzı (salt okunur): m.tarz harmanının en büyük payı, yoksa kadronun tarz adı, o da yoksa 'yok' */
function b0Tarz(m,t){
  const T=m.tarz&&m.tarz[t];if(T&&T.harman){let en=null,ep=-1;for(const a in T.harman)if(T.harman[a]>ep){ep=T.harman[a];en=a;}if(en)return en;}
  const k=m.kadro&&m.kadro[t]&&m.kadro[t].taktik&&m.kadro[t].taktik.tarz;return typeof k==='string'?k:'yok';}
module.exports={
  bilgi:[['— B0: atak zihniyeti ve amaçsız pas (b0-zincir) —',null,0]]
    .concat(...[0,1].map(t=>{const T=t?'konuk':'ev';return[
      [`${T}: amaçsız geri/yan pas zinciri / maç`,'b0Zincir'+t,2],
      [`${T}: amaçsız zincirdeki pas %`,'b0ZincirPas'+t,1],
      [`${T}: amaçlı geri pas (3 sn'de ≥ 25 m ileri) %`,'b0Amacli'+t,1],
      [`${T}: ileri pas % (açık oyun)`,'b0Ileri'+t,1],
      [`${T}: takım sahipliği başına net ilerleme (m)`,'b0Net'+t,1]];})),
  yeni:()=>{
    const Z=[0,0],ZP=[0,0],PN=[0,0],IL=[0,0],GR=[0,0],AM=[0,0],NT=[0,0],NN=[0,0];
    let zin=null,sah=null;const bek=[[],[]];   /* zin: {t,n,u0,u1}; sah: {t,u0,u1}; bek: amaçlı sayılmayı bekleyen geri pasların zamanları */
    const kapat=()=>{if(zin&&zin.n>=B0_ZINCIR&&zin.u1-zin.u0<=0){Z[zin.t]++;ZP[zin.t]+=zin.n;}zin=null;};
    const sahBit=()=>{if(sah){NT[sah.t]+=sah.u1-sah.u0;NN[sah.t]++;}sah=null;bek[0].length=0;bek[1].length=0;};
    return{
      dinle(ad,v,m){
        if(!m||m.phase!=='play')return;
        if(ad==='shot'||ad==='cross'||ad==='header'&&v&&v.shot){kapat();return;}
        if(ad!=='pass'||!v)return;
        const P=m.ball.pas;if(!P||P.p!==v.p||P.takim==null)return;
        const t=P.takim,d=m.dir[t],y=b0Yon(d,P.x0,P.z0,P.hx,P.hz),ilr=(P.hx-P.x0)*d;
        PN[t]++;if(y===1)IL[t]++;
        /* amaçlı geri pas: bekleyen geri paslardan 3 sn içindekiler bu ileri uzun pasla amaçlı olur */
        if(y===1&&P.L>=B0_AMAC_L){const B=bek[t];for(const tb of B)if(m.t-tb<=B0_AMAC_SN)AM[t]++;B.length=0;}
        if(ilr<-4){GR[t]++;bek[t].push(m.t);}
        const baskisiz=b0Yakin(m,t,P.x0,P.z0)>=B0_ESIK_BASKI;
        if(y<1&&baskisiz){
          if(zin&&(zin.t!==t||P.x0*d-zin.u1>=B0_TASI))kapat();   /* takım değişti ya da pasların arasında ileri taşıma */
          if(!zin)zin={t,n:0,u0:P.x0*d,u1:P.x0*d};
          zin.n++;zin.u1=P.hx*d;}
        else kapat();
      },
      adim(m){
        if(m.phase!=='play'){kapat();sahBit();return;}
        const s=m.ball.sahip;if(!s||s.team==null)return;
        const t=s.team,u=m.ball.x*m.dir[t];
        if(!sah||sah.t!==t){kapat();sahBit();sah={t,u0:u,u1:u};}else sah.u1=u;
      },
      bitir(m){
        kapat();sahBit();
        const r={ham:{},b0T:[0,1].map(t=>({tarz:b0Tarz(m,t),zincir:Z[t],ileri:IL[t],pas:PN[t],gol:m.score[t]}))};
        for(let t=0;t<2;t++){
          r.ham['b0Zincir'+t]=[Z[t],100];r.ham['b0ZincirPas'+t]=[ZP[t],PN[t]];r.ham['b0Amacli'+t]=[AM[t],GR[t]];
          r.ham['b0Ileri'+t]=[IL[t],PN[t]];r.ham['b0Net'+t]=[NT[t],100*NN[t]];}
        return r;}
    };
  },
  /* tarz başına özet (B4'ten sonra ev/konuk karışımını çözer; bugün ev = kadronun tarzı) */
  ozet(sonuclar){
    const T={};for(const s of sonuclar){if(!s.b0T)continue;for(const x of s.b0T){const a=T[x.tarz]||(T[x.tarz]={n:0,zincir:0,ileri:0,pas:0,gol:0});
      a.n++;a.zincir+=x.zincir;a.ileri+=x.ileri;a.pas+=x.pas;a.gol+=x.gol;}}
    const ad=Object.keys(T).sort();if(!ad.length)return;
    console.log('\n  B0 tarz başına (takım·maç): tarz · n · amaçsız zincir / maç · ileri pas % · gol / maç');
    for(const a of ad){const x=T[a];console.log(`    ${a.padEnd(10)} ${String(x.n).padStart(4)}   ${(x.zincir/x.n).toFixed(2).padStart(5)}   ${(x.pas?100*x.ileri/x.pas:0).toFixed(1).padStart(5)}   ${(x.gol/x.n).toFixed(2).padStart(5)}`);}
  }
};
