/* ============ Chairman — ses: kodla üretilen ortam sesi ve kısa işaretler (WebAudio; yol haritası 2.5) ============
   Harici ses dosyası yoktur. Ses ilk kullanıcı etkileşiminde başlar (tarayıcı kuralı); ses açılamazsa sessizce devre dışı kalır,
   oyun aynen çalışır. Sesler bilgi taşımaz: her sesin ekranda yazılı karşılığı vardır.
     sesAyarla(duzey 0–1, sessiz)  ana ses düzeyi
     sesOrtam(ad | null)           ortam sesi: 'oda' (kısık oda uğultusu ve duvar saati)
     sesCal(ad)                    kısa işaret: 'bildirim' (telefon), 'kagit' (dosya/ajanda açılır), 'karar' (karar verildi), 'tik' (düğme)
   Düzeyler TEST değeridir. */
const SES={ctx:null,ana:null,ortam:null,ortamAd:null,duzey:0.6,sessiz:false,saat:null};
function sesBaslat(){
  if(SES.ctx)return true;
  const A=typeof AudioContext!=='undefined'?AudioContext:typeof webkitAudioContext!=='undefined'?webkitAudioContext:null;
  if(!A)return false;
  try{SES.ctx=new A();SES.ana=SES.ctx.createGain();SES.ana.connect(SES.ctx.destination);sesAyarla(SES.duzey,SES.sessiz);}catch(e){SES.ctx=null;return false;}
  if(SES.ortamAd){const ad=SES.ortamAd;SES.ortamAd=null;sesOrtam(ad);}
  return true;
}
function sesAyarla(duzey,sessiz){
  SES.duzey=Math.min(1,Math.max(0,duzey));SES.sessiz=!!sessiz;
  if(SES.ana)SES.ana.gain.value=SES.sessiz?0:SES.duzey*SES.duzey;
}
/* kısa zarf: frekans, süre, tür; g: en yüksek düzey */
function sesNota(frekans,sure,tur,g,gecikme){
  const c=SES.ctx,t=c.currentTime+(gecikme||0),o=c.createOscillator(),k=c.createGain();
  o.type=tur;o.frequency.setValueAtTime(frekans,t);k.gain.setValueAtTime(0.0001,t);k.gain.exponentialRampToValueAtTime(g,t+0.012);k.gain.exponentialRampToValueAtTime(0.0001,t+sure);
  o.connect(k);k.connect(SES.ana);o.start(t);o.stop(t+sure+0.02);
}
function sesGurultu(sure,g,kesim){
  const c=SES.ctx,n=Math.floor(c.sampleRate*sure),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const s=c.createBufferSource(),f=c.createBiquadFilter(),k=c.createGain();s.buffer=b;f.type='bandpass';f.frequency.value=kesim;f.Q.value=0.8;k.gain.value=g;
  s.connect(f);f.connect(k);k.connect(SES.ana);s.start();
}
function sesCal(ad){
  if(!SES.ctx||SES.sessiz)return;
  try{
    if(ad==='bildirim'){sesNota(880,0.16,'sine',0.22);sesNota(1174.7,0.22,'sine',0.2,0.13);}
    else if(ad==='kagit')sesGurultu(0.16,0.16,2400);
    else if(ad==='karar'){sesNota(392,0.12,'triangle',0.16);sesNota(523.3,0.2,'triangle',0.16,0.09);}
    else if(ad==='tik')sesNota(1400,0.035,'square',0.04);
  }catch(e){}
}
function sesOrtam(ad){
  if(SES.ortamAd===ad)return;
  SES.ortamAd=ad;
  if(!SES.ctx)return;
  if(SES.ortam){try{SES.ortam.kaynak.stop();}catch(e){}SES.ortam=null;}
  if(SES.saat){clearInterval(SES.saat);SES.saat=null;}
  if(ad!=='oda')return;
  try{
    /* oda uğultusu: alçak geçirgenden geçmiş, döngüye alınmış gürültü */
    const c=SES.ctx,n=c.sampleRate*2,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
    let son=0;for(let i=0;i<n;i++){son=(son+0.02*(Math.random()*2-1))/1.02;d[i]=son*3;}
    const s=c.createBufferSource(),f=c.createBiquadFilter(),k=c.createGain();s.buffer=b;s.loop=true;f.type='lowpass';f.frequency.value=420;k.gain.value=0.22;
    s.connect(f);f.connect(k);k.connect(SES.ana);s.start();SES.ortam={kaynak:s};
    /* duvar saati: saniyede bir kısık tık */
    SES.saat=setInterval(()=>{if(SES.ctx&&!SES.sessiz&&SES.ctx.state==='running'&&!document.hidden)try{sesNota(2100,0.02,'square',0.012);}catch(e){}},1000);
  }catch(e){}
}
