'use strict';
/* Chairman — büyük kapı koşucusu (2026-11-05; CLAUDE.md “Kontrol” › Büyük kapı, karar 63, BORCLAR B64).
   `main`'e almadan önceki büyük kapının bütün adımlarını tek komutla, sırayla koşar; bir adım düşse de sonrakine geçer, sonunda tek rapor yazar.
   Gece masaüstünde koşmak içindir (dizüstünde akışın tamamı geçmez, B42). Uzun sürer (masaüstünde ~3–4 saat): uyku kapalı olmalı.

   Kullanım: node araclar/buyuk-kapi.js [--adim a,b] [--atla a,b] [--liste] [--hiz-taban <etiket>]
     --adim       yalnız bu adımlar (adlar --liste ile)
     --atla       bu adımlar dışındakiler
     --liste      adımları ve komutlarını yazar, koşmaz
     --hiz-taban  hız bütçesinin karşılaştırdığı etiket (varsayılan: main'e alınan son büyük kapının turu, HIZ_TABAN)
   Sıra: önce hız ölçümü (makine boşken), sonra Node adımları (sezon tabanları paralel), en son tarayıcı adımları tek tek (iki tarayıcı denemesi
   aynı anda bekleme sınırlarını aşar; KAPILAR). Her adımın tam çıktısı araclar/son-kapi/<ad>.txt'de, özet araclar/son-buyuk-kapi.txt'de (Git dışı).
   Çıkış kodu: bir adım kabul dışıysa 1. Kabul dışı satırların borç defteriyle eşlenmesi adımların kendi işidir (oturum-sonu, akış denemesi). */
const {spawn,execFileSync}=require('child_process');
const fs=require('fs'),path=require('path'),os=require('os');
const KOK=path.resolve(__dirname,'..'),ARAC=path.join(KOK,'araclar'),CIKTI=path.join(ARAC,'son-kapi'),RAPOR=path.join(ARAC,'son-buyuk-kapi.txt');
const ARG=process.argv.slice(2);
const secenek=(ad,deger)=>{const i=ARG.indexOf(ad);if(i<0)return null;ARG.splice(i,1);return deger?ARG.splice(i,1)[0]:true;};
const SECILI=secenek('--adim',true),ATLA=secenek('--atla',true),LISTE=!!secenek('--liste',false);
/* hız bütçesi: main'e alınan son büyük kapının turu (RK5-b, 2026-11-01). Motor o günden beri değişmedi (2026-11-05); ölçüm bilgi ve güvencedir */
const HIZ_TABAN=secenek('--hiz-taban',true)||'tur/rk5b-belgeler';
if(ARG.length){console.error('Bilinmeyen argüman: '+ARG.join(' ')+'\nKullanım: node araclar/buyuk-kapi.js [--adim a,b] [--atla a,b] [--liste] [--hiz-taban <etiket>]');process.exit(2);}

const GUNCEL=JSON.parse(fs.readFileSync(path.join(ARAC,'taban','GUNCEL.json'),'utf8'));
const taban=a=>'araclar/taban/'+a;
const PY=['-X','utf8'],SEZON_POL=['--teklif','sat','--talep','onayla','--p12','degisim'];
const HIZ_AGAC=path.join(os.tmpdir(),'chairman-hiz-taban');
/* tur: 'hiz' tek başına, 'node' paralel grup, 'tarayici' sırayla */
const ADIMLAR=[
  {ad:'hiz',tur:'hiz',bilgi:'hız bütçesi ('+HIZ_TABAN+'’e göre; ortanca artış ≤ %10, 1000 adım ≤ 250 ms)',
    once:()=>{agacKaldir();execFileSync('git',['worktree','add','--detach',HIZ_AGAC,HIZ_TABAN],{cwd:KOK,stdio:'ignore'});},
    komut:['node',['araclar/hiz-olcum.js','2','--tekrar','8','--kok',HIZ_AGAC]],sonra:()=>agacKaldir()},
  {ad:'ad',tur:'node',bilgi:'ad denetimi',komut:['node',['araclar/ad-denetimi.js']]},
  {ad:'kariyer',tur:'node',bilgi:'kariyer denemesi',komut:['node',['araclar/kariyer-deneme.js']]},
  {ad:'oturum',tur:'node',bilgi:'oturum sonu --ayni --seyrek (motor tabanı '+GUNCEL.motor+')',komut:['node',['araclar/oturum-sonu.js','--ayni','--seyrek']]},
  {ad:'kasim-t7',tur:'node',bilgi:'Kasım tarifi t7 --ayni ('+GUNCEL.sezon.t7+')',
    komut:['node',['araclar/sezon-deneme.js','18','7','--tek','--tarif','kasim',...SEZON_POL,'--karsilastir',taban(GUNCEL.sezon.t7),'--ayni']]},
  {ad:'kasim-t3',tur:'node',bilgi:'Kasım tarifi t3 kaydet–yükle --ayni ('+GUNCEL.sezon.t3+')',
    komut:['node',['araclar/sezon-deneme.js','18','3','--tarif','kasim','--kaydet','--karsilastir',taban(GUNCEL.sezon.t3),'--ayni']]},
  {ad:'yaz-t7',tur:'node',bilgi:'yaz tarifi t7 --ayni ('+GUNCEL.sezonYaz.t7+')',
    komut:['node',['araclar/sezon-deneme.js','18','7','--tek','--tarif','yaz',...SEZON_POL,'--karsilastir',taban(GUNCEL.sezonYaz.t7),'--ayni']]},
  /* yaz t3 tabanı henüz yok (CM2-b: “t3 evde”): varsa karşılaştırır, yoksa ilk tabanı yazar (GUNCEL.json'a elle, sonucu okunduktan sonra) */
  GUNCEL.sezonYaz.t3
    ?{ad:'yaz-t3',tur:'node',bilgi:'yaz tarifi t3 kaydet–yükle --ayni ('+GUNCEL.sezonYaz.t3+')',
      komut:['node',['araclar/sezon-deneme.js','18','3','--tarif','yaz','--kaydet','--karsilastir',taban(GUNCEL.sezonYaz.t3),'--ayni']]}
    :{ad:'yaz-t3',tur:'node',bilgi:'yaz tarifi t3 kaydet–yükle, ilk taban → araclar/taban/sezon-cm2-t3.json (okunduktan sonra GUNCEL.json sezonYaz.t3)',
      komut:['node',['araclar/sezon-deneme.js','18','3','--tarif','yaz','--kaydet','--json','araclar/taban/sezon-cm2-t3.json']]},
  {ad:'kontrol',tur:'tarayici',bilgi:'kontrol.py (görüntüler araclar/son-kontrol-*.png)',komut:['python',[...PY,'araclar/kontrol.py']]},
  {ad:'akis-2d',tur:'tarayici',bilgi:'2D görünüm akışı',komut:['python',[...PY,'araclar/akis-2d.py']]},
  {ad:'akis',tur:'tarayici',bilgi:'akış denemesinin tamamı',komut:['python',['-u',...PY,'araclar/akis-deneme.py']]},
  /* okunurluk: pencere başına ayrı süreç (tek süreçte beşi tarayıcıyı çökertir; AR1) */
  ...[1024,1280,1600,1920,2560].map(g=>({ad:'okunurluk-'+g,tur:'tarayici',bilgi:'okunurluk '+g+' pencere',komut:['python',[...PY,'araclar/okunurluk.py','--genislik',String(g)]]})),
];

function agacKaldir(){
  try{execFileSync('git',['worktree','remove','--force',HIZ_AGAC],{cwd:KOK,stdio:'ignore'});}catch(e){}
  try{fs.rmSync(HIZ_AGAC,{recursive:true,force:true});execFileSync('git',['worktree','prune'],{cwd:KOK,stdio:'ignore'});}catch(e){}
}

const sec=new Set((SECILI||'').split(',').filter(Boolean)),atla=new Set((ATLA||'').split(',').filter(Boolean));
for(const a of [...sec,...atla])if(!ADIMLAR.some(x=>x.ad===a)){console.error('Bilinmeyen adım: '+a+' (adlar: '+ADIMLAR.map(x=>x.ad).join(', ')+')');process.exit(2);}
const KOS=ADIMLAR.filter(a=>(!sec.size||sec.has(a.ad))&&!atla.has(a.ad));
if(LISTE){for(const a of KOS)console.log(a.ad.padEnd(16)+a.tur.padEnd(10)+a.komut[0]+' '+a.komut[1].join(' '));process.exit(0);}

const sure=ms=>{const s=Math.round(ms/1000);return s>=3600?Math.floor(s/3600)+' sa '+Math.floor(s%3600/60)+' dk':s>=60?Math.floor(s/60)+' dk '+(s%60)+' sn':s+' sn';};
const saat=()=>new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
function kos(a){
  return new Promise(coz=>{
    const t0=Date.now(),dosya=path.join(CIKTI,a.ad+'.txt'),yaz=fs.createWriteStream(dosya);
    try{if(a.once)a.once();}catch(e){yaz.end('Hazırlık düştü: '+e.message+'\n');console.log('! '+a.ad+' hazırlık düştü: '+e.message);return coz({a,kod:1,ms:0,son:['hazırlık: '+e.message]});}
    console.log(saat()+'  başladı  '+a.ad+' — '+a.bilgi);
    const p=spawn(a.komut[0],a.komut[1],{cwd:KOK,env:Object.assign({},process.env,{PYTHONUTF8:'1'}),windowsHide:true});
    let kuyruk='';const tut=b=>{const s=b.toString();yaz.write(s);kuyruk=(kuyruk+s).slice(-6000);};
    p.stdout.on('data',tut);p.stderr.on('data',tut);
    const bit=kod=>{try{if(a.sonra)a.sonra();}catch(e){}yaz.end();const ms=Date.now()-t0;
      const satirlar=kuyruk.split(/\r?\n/).filter(s=>s.trim());
      /* özet: kabul dışı (“!”) satırlar ve son satırlar */
      const unlem=satirlar.filter(s=>/^\s*!/.test(s)).slice(-12),son=satirlar.slice(-6);
      console.log(saat()+'  '+(kod===0?'geçti  ':'DÜŞTÜ  ')+' '+a.ad+' ('+sure(ms)+')');
      coz({a,kod,ms,unlem,son});};
    p.on('error',e=>{tut('Başlatılamadı: '+e.message+'\n');bit(1);});
    p.on('close',kod=>bit(kod==null?1:kod));
  });
}

(async()=>{
  fs.mkdirSync(CIKTI,{recursive:true});
  const bas=Date.now(),R=[];
  const dal=execFileSync('git',['rev-parse','--abbrev-ref','HEAD'],{cwd:KOK}).toString().trim(),
        commit=execFileSync('git',['log','-1','--format=%h %s'],{cwd:KOK}).toString().trim(),
        kirli=execFileSync('git',['status','--porcelain'],{cwd:KOK}).toString().trim();
  console.log('Büyük kapı — '+dal+' · '+commit+(kirli?' · DİKKAT: çalışma ağacında commit edilmemiş değişiklik var':'')+' · '+os.cpus().length+' çekirdek · '+KOS.length+' adım');
  for(const a of KOS.filter(a=>a.tur==='hiz'))R.push(await kos(a));
  /* Node adımları: ad ve kariyer önce (kısa), oturum sonu tek başına (bütün çekirdekleri kullanır), sezonlar birlikte */
  for(const a of KOS.filter(a=>['ad','kariyer','oturum'].includes(a.ad)))R.push(await kos(a));
  R.push(...await Promise.all(KOS.filter(a=>a.tur==='node'&&!['ad','kariyer','oturum'].includes(a.ad)).map(kos)));
  for(const a of KOS.filter(a=>a.tur==='tarayici'))R.push(await kos(a));
  const dusen=R.filter(r=>r.kod!==0);
  const S=['Chairman — büyük kapı raporu ('+new Date().toLocaleString('tr-TR')+')','Dal '+dal+' · '+commit+(kirli?' · commit edilmemiş değişiklik vardı':''),
    'Toplam '+sure(Date.now()-bas)+' · '+(R.length-dusen.length)+'/'+R.length+' adım geçti','' ];
  for(const r of R){
    S.push((r.kod===0?'  geçti ':'! DÜŞTÜ ')+r.a.ad.padEnd(16)+sure(r.ms).padEnd(14)+r.a.bilgi);
    S.push('         '+r.a.komut[0]+' '+r.a.komut[1].join(' ')+'   → araclar/son-kapi/'+r.a.ad+'.txt');
    for(const s of (r.unlem||[]))S.push('         '+s.trim().slice(0,240));
    if(r.kod!==0)for(const s of (r.son||[]))S.push('         · '+s.trim().slice(0,240));
  }
  S.push('','Okunacaklar: düşen adımın tam çıktısı araclar/son-kapi/<ad>.txt; oturum sonunun tam raporu araclar/son-oturum.txt; görüntüler araclar/son-*.png.',
    'Geçince: BORCLAR B64 kapanır, GUNCEL.json (yaz t3 yeni yazıldıysa), devam notu; main ve push kullanıcının sözüyle.');
  fs.writeFileSync(RAPOR,S.join('\n')+'\n','utf8');
  console.log('\n'+S.join('\n'));
  process.exit(dusen.length?1:0);
})();
