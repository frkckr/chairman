#!/usr/bin/env node
/* ============ Chairman — ikiz motor ve izleme süresi denetimi (U1, 2026-10-12) ============
   Maçı izlerken önemli anları önceden bilmek için tarayıcı aynı tohumla ikinci bir motor (ikiz) çalıştırır (js/mac-izleme.js). Bu araç:
   (1) Aynılık: aynı tohumla tek başına oynatılan maç ile ikizli oynatılan maçın (ana motor) parmak izleri, olayları ve sonuç kaydı birebir aynı
       mı; ikiz ana motordan ayrılmadı mı (sapma 0) ve maç sonunda ikizin kaydı ana motorunkiyle aynı mı. Ana motor tarayıcıdaki gibi önce maç
       öncesini oynar, --oncesi ADIM'da "Santraya geç" (macaGec) alır; ikiz o ana dek aynı karede yürür, sonra IZLEME.onde saniye öne geçer.
       --esit: ikiz bütün maç aynı karede yürür (iki örneğin aynı kareyi paylaştığı en kötü durum: kare anahtarlı ortak önbellek varsa yakalanır).
   (2) İzleme süresi: önemli anların penceresi ve 1×, 2×, 4× seçiminde santradan maç sonuna gerçek izleme süresi (tarayıcıyla aynı hız eğrisi:
       izlemeHedefHiz; tarayıcı bunu kare başına uygular, burada adım başına — fark kare hızının altındadır). Maç öncesi ve devre arası dahil değildir.
   (3) B4b --tarz-komut: maçın ortasında dışarıdan tarz komutları (geliştirici panelindeki gibi: js/mac-izleme.js izlemeKomut ile iki motora aynı karede;
       santradan 150 sn sonra ev, 400 ve 405 sn sonra konuk — ikincisi ilkinin yerini alır). Önce ikizli oynatılır; tek başına oynatma aynı kareli
       komutları alır. Hocanın maç içi kararı kapıya bağlanınca da ikizin aynılığı bununla sınanır.
   Kullanım: node araclar/ikiz-deneme.js [maç, varsayılan 4] [ilk tohum, varsayılan 1] [--oncesi ADIM, varsayılan 600] [--esit] [--tarz-komut]
   MAC_DENEME_AYAR mac-deneme.js'teki gibi (ör. '{"macSuresiDk":20}'). Çıkış kodu: aynılık bozulursa 1. Tek süreçte, sırayla oynatır. */
'use strict';
const {motorYukle,ayarUygula}=require('./motor-yukle');
const vm=require('vm');
const ARG=process.argv.slice(2);
function secenek(ad,degerli){const i=ARG.indexOf(ad);if(i<0)return null;if(!degerli){ARG.splice(i,1);return true;}return ARG.splice(i,2)[1];}
const ONCESI=Math.max(0,parseInt(secenek('--oncesi',true)||'600',10)),ESIT=!!secenek('--esit',false),TK=!!secenek('--tarz-komut',false);
const N=Math.max(1,parseInt(ARG[0]||'4',10)),T0=parseInt(ARG[1]||'1',10);
const {ctx,kip}=motorYukle();
const AYAR=ayarUygula(ctx,process.env.MAC_DENEME_AYAR);
const G=ad=>vm.runInContext(ad,ctx);
const Match=G('Match'),KADRO=G('MAC_KADRO'),IZLEME=G('IZLEME'),MAC_ONCESI=G('MAC_ONCESI'),MOTOR_AYAR=G('MOTOR_AYAR');
if(ESIT)IZLEME.onde=0;
const secenekler=tohum=>({kadro:KADRO,tohum,tunel:{x:0,z:-6},tarz:'dagilim'});   /* B4: oyundaki gibi tarz tohumdan */
const dt=1/60,MAKS=60*60*60;

/* parmak izi (araclar/mac-deneme.js ile aynı ölçü): topun ve oyuncuların durumu her 30 adımda FNV-1a; 600 adımda bir kontrol noktası */
const IZ_F=new Float64Array(8+5*64),IZ_U=new Uint8Array(IZ_F.buffer);
function izDurum(h,m){const b=m.ball;let n=0;IZ_F[n++]=b.x;IZ_F[n++]=b.y;IZ_F[n++]=b.z;IZ_F[n++]=b.vx;IZ_F[n++]=b.vy;IZ_F[n++]=b.vz;IZ_F[n++]=m.score[0];IZ_F[n++]=m.score[1];
  for(const p of m.players){IZ_F[n++]=p.x;IZ_F[n++]=p.z;IZ_F[n++]=p.vx;IZ_F[n++]=p.vz;IZ_F[n++]=p.yon;}
  for(let i=0;i<n*8;i++){h^=IZ_U[i];h=Math.imul(h,16777619)>>>0;}return h;}
function izMetin(h,s){for(let i=0;i<s.length;i++){h^=s.charCodeAt(i)&255;h=Math.imul(h,16777619)>>>0;h^=s.charCodeAt(i)>>8;h=Math.imul(h,16777619)>>>0;}return h;}

/* bir maç: ikiz true ise tarayıcıdaki gibi izleme kurulur (js/mac-sahnesi.js düzeni: olaylar on geri çağrısında izlemeAnaOlay'a, her adımdan sonra izlemeAdim) */
/* B4b: tarz komutları (santradan sonraki adım, takım, hedef: o anki baskın tarzdan farklı) */
const KOMUT=[{s:150,t:0,h:b=>b==='dikey'?'konumsal':'dikey'},{s:400,t:1,h:b=>b==='direkt'?'iliskisel':'direkt'},{s:405,t:1,h:()=>({konumsal:0.5,dikey:0.5})}];
function oyna(tohum,ikiz,komutKare){
  let m=null,I=null,h=2166136261,ho=2166136261,adim=0,santra=-1,son=-1,anda=0;const kontrol=[],say={},sure={1:0,2:0,4:0};let ikizNs=0n,anaNs=0n;const kk=[];
  m=new Match((ad,v)=>{if(!m)return;ho=izMetin(ho,m.kare+':'+ad+'|');
    if(!MAC_ONCESI.includes(m.phase)){const A=IZLEME.anlar[ad];if(A&&(!A.kosul||A.kosul(v)))say[ad]=(say[ad]||0)+1;}
    if(I)ctx.izlemeAnaOlay(I,ad,v);},secenekler(tohum));
  if(ikiz)I=ctx.izlemeKur(m,Match,secenekler(tohum));
  while(m.phase!=='fulltime'&&adim<MAKS){
    if(adim===ONCESI&&MAC_ONCESI.includes(m.phase)){m.macaGec();if(I)ctx.izlemeMacaGec(I);}
    if(TK)for(const c of KOMUT)if(adim===ONCESI+c.s*60){const hd=c.h(ctx.tarzBaskin(m,c.t));
      const k=komutKare?komutKare[kk.length]:ctx.izlemeKomut(I,m,(Z,k)=>ctx.tarzDegistir(Z,c.t,hd,k));ctx.tarzDegistir(m,c.t,hd,k);kk.push(k);}
    const t0=process.hrtime.bigint();m.step(dt);const t1=process.hrtime.bigint();adim++;anaNs+=t1-t0;
    if(I){ctx.izlemeAdim(I);ikizNs+=process.hrtime.bigint()-t1;}
    if(adim%30===0)h=izDurum(h,m);if(adim%600===0)kontrol.push(h);
    /* izleme süresi: santradan maç sonuna, devre arası hariç */
    if(santra<0&&!MAC_ONCESI.includes(m.phase))santra=adim;
    if(I&&santra>=0&&m.phase!=='halftime'){for(const s of[1,2,4])sure[s]+=dt/ctx.izlemeHedefHiz(I,s);if(ctx.izlemeAnda(I))anda+=dt;}}
  son=adim;
  return{tohum,adim,kontrol,olay:ho,kayit:JSON.stringify(m.sonucKaydi()),skor:m.score.join('-'),say,sure,anda,
    komutKare:kk,sapma:I?I.sapma:0,sapmaYer:I?I.sapmaYer:null,sonAyni:I?!!(I.son&&I.son.ayni):null,ikizAdim:I?I.ikizAdim:0,ms:{ana:Number(anaNs)/1e6,ikiz:Number(ikizNs)/1e6},oyun:(son-santra)*dt};
}

const f1=x=>x.toFixed(1),dk=s=>(s/60).toFixed(1);
console.log(`\nChairman ikiz motor denetimi · ${N} maç · tohum ${T0}…${T0+N-1} · bağlam ${kip} · Node ${process.version}`);
console.log(`  Maç süresi ${MOTOR_AYAR.macSuresiDk} dk${AYAR?' (MAC_DENEME_AYAR '+JSON.stringify(AYAR)+')':''} · Santraya geç ${ONCESI}. adımda · ikiz ${ESIT?'aynı karede (--esit)':IZLEME.onde+' sn önde'}${TK?' · tarz komutları (--tarz-komut)':''}`);
let bozuk=0;const T={oyun:0,s1:0,s2:0,s4:0,anda:0,ana:0,ikiz:0},SAY={};
for(let t=T0;t<T0+N;t++){
  let a,b;if(TK){b=oyna(t,true);a=oyna(t,false,b.komutKare);}else{a=oyna(t,false);b=oyna(t,true);}
  const iz=a.kontrol.length===b.kontrol.length&&a.kontrol.every((x,i)=>x===b.kontrol[i]),ayni=iz&&a.olay===b.olay&&a.kayit===b.kayit&&a.adim===b.adim;
  const tamam=ayni&&b.sapma===0&&b.sonAyni===true;if(!tamam)bozuk++;
  let ilk=-1;if(!iz)for(let i=0;i<Math.min(a.kontrol.length,b.kontrol.length);i++)if(a.kontrol[i]!==b.kontrol[i]){ilk=i;break;}
  console.log(`${tamam?'  ':'! '}tohum ${String(t).padStart(3)} · ${a.skor} · tek başına ↔ ikizli: ${ayni?'aynı':'FARKLI'+(ilk>=0?' (ilk ayrılan kontrol noktası '+(ilk+1)*10+'. sn)':'')}`+
    ` · sapma ${b.sapma}${b.sapmaYer?' ('+b.sapmaYer+')':''} · maç sonu kaydı ${b.sonAyni?'aynı':'FARKLI'}`+
    ` · izleme ${dk(b.sure[1])} / ${dk(b.sure[2])} / ${dk(b.sure[4])} dk (1×/2×/4×) · anda %${f1(100*b.anda/b.sure[1])}`);
  T.oyun+=b.sure[1];T.s1+=b.sure[1];T.s2+=b.sure[2];T.s4+=b.sure[4];T.anda+=b.anda;T.ana+=b.ms.ana;T.ikiz+=b.ms.ikiz;
  for(const k in a.say)SAY[k]=(SAY[k]||0)+a.say[k];
}
console.log(`\n  İzleme süresi ort. (santradan maç sonuna, devre arası hariç): 1× ${dk(T.s1/N)} dk · 2× ${dk(T.s2/N)} dk · 4× ${dk(T.s4/N)} dk`);
console.log(`  Önemli anların penceresinde geçen motor süresi: %${f1(100*T.anda/T.s1)} (${dk(T.anda/N)} dk / maç)`);
console.log('  Pencere açan olay / maç: '+Object.keys(SAY).sort().map(k=>`${k} ${(SAY[k]/N).toFixed(1)}`).join(' · '));
console.log(`  Süre: ana motor ${f1(T.ana/N/1000)} sn / maç · ikiz ve izleme ${f1(T.ikiz/N/1000)} sn / maç (oran ${(T.ikiz/T.ana).toFixed(2)})`);
console.log(`\n  Aynılık: ${N-bozuk}/${N} maç${bozuk?' — ikizli oynatma ana motoru değiştirdi ya da ikiz ayrıldı':''}`);
process.exitCode=bozuk?1:0;
