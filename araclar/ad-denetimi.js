#!/usr/bin/env node
/* ============ Chairman — ad ve sınır denetimi (2026-10-03, maç motoru güncellemesi Faz 0) ============
   Betikler index.html'de sırayla yüklenen klasik betiklerdir: üst düzey adlar ortaktır, maç motorunun yöntemleri birden çok dosyadan
   Match.prototype'a eklenir. Paralel çalışan akışların birbirini sessizce bozmaması için şunlar denetlenir:
   (a) betikler arasında aynı üst düzey ad: let/const/class çakışması tarayıcıda sözdizimi hatasıdır (bütün betikler tek gövdede
       ayrıştırılarak bulunur); aynı adlı iki işlev bildirimi (blok içindekiler dahil, tarayıcıda global'e sızar) sessizce birbirini ezer.
   (b) class Match ile Object.assign(Match.prototype,{…}) blokları arasında aynı yöntem adı (sonra yüklenen öncekini sessizce ezer).
   (c) çizim dosyaları motoru yalnız okur: mac.rast/normal ve önbellek yazan yöntemler (topYolu, topTahmin, yakalamaNoktasi, cerceveyeGider)
       çağrılmaz; oyuncu (p.) ve top (mac.ball., b.) alanlarına yazılmaz. Motoru ilerleten tek yer js/mac-sahnesi.js'tir (mac.step, mac.macaGec).
   (d) motor dosyalarında (js/mac-*.js) tohumsuz rastlantı yok: Math.random ve rnd( kullanılmaz (varsayılan tohum seçimi hariç).
   Kullanım: node araclar/ad-denetimi.js   (bulgu varsa çıkış kodu 1) */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const KOK=process.env.AD_DENETIMI_KOK||path.join(__dirname,'..');
const html=fs.readFileSync(path.join(KOK,'index.html'),'utf8');
const dosyalar=[...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m=>m[1]);
const kaynak=Object.fromEntries(dosyalar.map(f=>[f,fs.readFileSync(path.join(KOK,f),'utf8')]));
const bulgular=[],bilinen=[];
const bul=(tur,metin)=>bulgular.push(`[${tur}] ${metin}`);

/* yorumları ve dizgileri boşlukla değiştir (satır numaraları korunur) */
function temizle(s){
  let o='',i=0;const n=s.length;
  while(i<n){const c=s[i],d=s[i+1];
    if(c==='/'&&d==='*'){const j=s.indexOf('*/',i+2);const e=j<0?n:j+2;o+=s.slice(i,e).replace(/[^\n]/g,' ');i=e;continue;}
    if(c==='/'&&d==='/'){const j=s.indexOf('\n',i);const e=j<0?n:j;o+=' '.repeat(e-i);i=e;continue;}
    if(c==='"'||c==="'"||c==='`'){let j=i+1;while(j<n&&s[j]!==c){if(s[j]==='\\')j++;j++;}o+=c+s.slice(i+1,j).replace(/[^\n]/g,' ')+c;i=j+1;continue;}
    o+=c;i++;}
  return o;
}
const temiz=Object.fromEntries(dosyalar.map(f=>[f,temizle(kaynak[f])]));
const satirNo=(s,i)=>s.slice(0,i).split('\n').length;

/* (a1) let/const/class çakışmaları: bütün betikleri tek işlev gövdesinde ayrıştır; her hata bulununca o bildirimi geçici olarak yeniden adlandır */
{let birlesik='',parcalar=[];
  for(const f of dosyalar){parcalar.push({f,bas:birlesik.length});birlesik+=kaynak[f].replace(/^'use strict';/m,"'';")+'\n;\n';}
  const hangi=i=>{let p=parcalar[0];for(const q of parcalar)if(q.bas<=i)p=q;return p;};
  for(let deneme=0;deneme<50;deneme++){
    try{new vm.Script('(function(){'+birlesik+'\n})');break;}
    catch(e){const m=/Identifier '([^']+)' has already been declared/.exec(e.message);
      if(!m){bul('sözdizimi',e.message);break;}
      const ad=m[1],re=new RegExp(`\\b(const|let|class|var|function)\\s+${ad.replace(/\$/g,'\\$')}\\b`,'g');const yerler=[];let x;
      while((x=re.exec(birlesik)))yerler.push(x.index);
      const yer=yerler.map(i=>{const p=hangi(i);return `${p.f}:${satirNo(birlesik.slice(p.bas),i-p.bas)}`;});
      bul('aynı üst düzey ad',`${ad}: ${yer.join(', ')}`);
      if(!yerler.length)break;const son=yerler[yerler.length-1];
      birlesik=birlesik.slice(0,son)+birlesik.slice(son).replace(new RegExp(`\\b${ad}\\b`),'__cift_'+deneme+'_'+ad);}}
}
/* (a2) aynı adlı işlev bildirimleri: üst düzeyde ya da yalnız bloklar içinde (if/for/düz blok) olanlar global'e sızar; işlev gövdesindekiler yereldir */
function sizanIslevler(s){
  const out=[],yigin=[];   /* yigin: 'f' işlev gövdesi, 'b' blok, 'o' nesne */
  const oncekiKelime=j=>{while(j>=0&&/\s/.test(s[j]))j--;let e=j;while(j>=0&&/[\w$]/.test(s[j]))j--;return{kelime:s.slice(j+1,e+1),j};};
  const eslesenAc=j=>{let d=0;for(;j>=0;j--){if(s[j]===')')d++;else if(s[j]==='('){d--;if(!d)return j;}}return -1;};
  for(let i=0;i<s.length;i++){const c=s[i];
    if(c==='{'){let j=i-1;while(j>=0&&/\s/.test(s[j]))j--;let tur='b';
      if(s[j]==='>'&&s[j-1]==='=')tur='f';
      else if(s[j]===')'){const a=eslesenAc(j),k=oncekiKelime(a-1).kelime;tur=['if','for','while','switch','catch','with'].includes(k)?'b':'f';}
      else if(/[\w$]/.test(s[j])){const k=oncekiKelime(j).kelime;tur=['else','try','finally','do'].includes(k)?'b':k==='return'||k==='typeof'?'o':'b';}
      else if(j<0||';{}'.includes(s[j]))tur='b';
      else tur='o';
      yigin.push(tur);}
    else if(c==='}')yigin.pop();
    else if(c==='f'&&s.startsWith('function',i)&&!/[\w$]/.test(s[i-1]||' ')){const m=/^function\s+([A-Za-z_$][\w$]*)\s*\(/.exec(s.slice(i,i+80));
      if(m){let j=i-1;while(j>=0&&/\s/.test(s[j]))j--;const bildirim=j<0||';{}'.includes(s[j])||s.slice(Math.max(0,j-3),j+1)==='else';
        if(bildirim&&!yigin.includes('f')&&!yigin.includes('o'))out.push({ad:m[1],i});}}}
  return out;
}
/* bilinen ve zararsız (Faz 0'da vardı): ekran dosyalarının kendi üst düzey blokları içindeki yardımcılar; her blok kendi işlevini çağırır,
   global ada kimse başvurmaz. Yeni bir çakışma hata sayılır. (2026-10-10: eski koyu ajanda kalkınca durakYazi, altSerit, hataGoster, isiYap,
   ilerleOzeti, ilerleEylem tekilleşti) */
const BILINEN_SIZINTI=new Set(['ciz','kapat']);
{const ad=Object.create(null);
  for(const f of dosyalar){const s=temiz[f];for(const x of sizanIslevler(s))(ad[x.ad]||(ad[x.ad]=[])).push(`${f}:${satirNo(s,x.i)}`);}
  for(const [k,L] of Object.entries(ad))if(L.length>1){if(BILINEN_SIZINTI.has(k))bilinen.push(`${k}: ${L.join(', ')}`);else bul('aynı işlev adı',`${k}: ${L.join(', ')}`);}
}
/* (b) Match yöntemleri */
{const yontem=Object.create(null);
  const ekle=(f,s,bas,son)=>{const govde=s.slice(bas,son),re=/\n  ([A-Za-z_$][\w$]*)\s*\(/g;let m;
    while((m=re.exec(govde))){if(['if','for','while','switch','return','function'].includes(m[1]))continue;
      (yontem[m[1]]||(yontem[m[1]]=[])).push(`${f}:${satirNo(s,bas+m.index+1)}`);}};
  const kapanis=(s,i)=>{let d=0;for(let j=i;j<s.length;j++){if(s[j]==='{')d++;else if(s[j]==='}'){d--;if(!d)return j;}}return s.length;};
  for(const f of dosyalar){const s=temiz[f];
    let i=s.search(/\bclass Match\s*\{/);if(i>=0){const a=s.indexOf('{',i);ekle(f,s,a,kapanis(s,a));}
    const re=/Object\.assign\(Match\.prototype,\s*\{/g;let m;while((m=re.exec(s))){const a=s.indexOf('{',m.index);ekle(f,s,a,kapanis(s,a));}}
  for(const [k,L] of Object.entries(yontem))if(L.length>1)bul('aynı Match yöntemi',`${k}: ${L.join(', ')}`);
}
/* (c) çizim dosyaları motoru yalnız okur */
{const CIZIM=['js/mac-sahnesi.js','js/animasyon.js','js/kamera.js','js/okunurluk.js','js/baskan.js'];
  const YASAK_CAGRI=/\bmac\.(rast|normal|topYolu|topTahmin|yakalamaNoktasi|cerceveyeGider|step|macaGec|kararVer)\s*\(/g;
  const IZIN={'js/mac-sahnesi.js':new Set(['step','macaGec'])};
  const YAZMA=[/\bp\.[A-Za-z_$][\w$]*(\.[\w$]+)*\s*(=(?!=)|\+=|-=|\*=|\/=|\+\+|--)/g,/\bmac\.ball\.[\w$.]+\s*(=(?!=)|\+=|-=|\*=)/g,/\bmac\.(players|refs|teams|ball|ist|score|phase|durus)\s*(=(?!=))/g];
  for(const f of CIZIM){const s=temiz[f];if(s==null)continue;let m;
    while((m=YASAK_CAGRI.exec(s))){if(IZIN[f]&&IZIN[f].has(m[1]))continue;bul('çizim motoru ilerletiyor/önbellek yazıyor',`${f}:${satirNo(s,m.index)} mac.${m[1]}(`);}
    for(const re of YAZMA){re.lastIndex=0;while((m=re.exec(s)))bul('çizim motor alanına yazıyor',`${f}:${satirNo(s,m.index)} ${m[0].trim()}`);}
    /* top: b=mac.ball takma adıyla yazma */
    if(/\bconst\s+b\s*=\s*mac\.ball\b|\bb\s*=\s*mac\.ball\b/.test(s)){const re=/\bb\.(x|y|z|vx|vy|vz|sahip|tasiyan|sut|pas|egri|ust)\s*(=(?!=)|\+=|-=)/g;
      while((m=re.exec(s)))bul('çizim topa yazıyor',`${f}:${satirNo(s,m.index)} ${m[0].trim()}`);}}
}
/* (d) motor dosyalarında tohumsuz rastlantı */
for(const f of dosyalar.filter(f=>/^js\/mac-/.test(f)&&f!=='js/mac-sahnesi.js')){const s=temiz[f];
  s.split('\n').forEach((L,i)=>{if(/Math\.random\s*\(|\brnd\s*\(/.test(L)&&!/secenek\.tohum/.test(L))bul('motor tohumsuz rastlantı',`${f}:${i+1}`);});}

if(bulgular.length){console.log(`Ad ve sınır denetimi: ${bulgular.length} bulgu`);for(const b of bulgular)console.log('  ! '+b);process.exitCode=1;}
else console.log(`Ad ve sınır denetimi: ${dosyalar.length} betik, bulgu yok`+(bilinen.length?` (bilinen zararsız blok içi işlev adları: ${bilinen.length})`:''));
