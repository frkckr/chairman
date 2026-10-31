#!/usr/bin/env node
/* ============ Chairman — sezon denemesi: görüntüsüz haftalar, maç sonucu kariyere (F2, 2026-10-23; yol haritası 3.6) ============
   Yeni kariyer kurulur; her hafta oyuncunun yolu izlenir: İlerle (duragaIlerle) → maç günü işi (ajandaIsiYap) → maç girdisi (macGirdisi) →
   görüntüsüz maç (Match, macaGec, 1/60 sn adımlarla sonuna dek) → sonuç komutu. F7 (2026-10-24): haftanın öbür yedi maçı da oynanır
   (js/lig-maclari.js digerMacSecenegi — tarayıcıdaki LIG_CANLI ile aynı seçenek) ve sekiz sonuç tek komutla uygulanır (haftaSonuclariUygula).
   Ölçülenler: bizim maçın ve haftanın sekiz maçının süresi, sayaçlar (gol, kart, sakatlık, cezalı ve sakat), puan durumundaki yerimiz,
   bütün kulüplerin oynadığı maç sayısının eşitliği ve kayıt boyu. Aynı tohumla ikinci koşu birebir aynı kariyeri vermelidir (belirlenimcilik); --kaydet her haftadan sonra kariyeri
   bellek deposuna yazıp geri yükler ve yüklenenle sürer.
   Not: maç tarayıcıdaki maçla birebir aynı değildir — tarayıcı Match seçeneğine stadın zemin, atmosfer, kulübe ve tribün alanlarını da verir
   (js/mac-sahnesi.js MAC_SECENEK; stat tarifleri motor yükleyicinin dışındadır). Bu araç maliyet ve belirlenim ölçüsüdür, denge ölçüsü değildir
   (denge: araclar/mac-deneme.js).
   F6-a (2026-10-24): kötü gidişte P12 "Hocaya sabır mı, değişim mi?" açılır (js/icerik-p12.js); İlerle maç gününe dek birkaç kez durabilir.
     --p12 cevapsiz (varsayılan; karar cevapsız kalır) | sabir | degisim (adaylarla görüşülür, ilk aday göreve alınır): oyuncunun cevabı.
   G2 (2026-10-24 gece): ay başı maaşları, iç saha bilet geliri, transfer dönemi. --teklif cevapsiz (varsayılan) | sat | reddet: gelen teklife cevap;
     --talep cevapsiz (varsayılan) | onayla | reddet: hocanın transfer isteğine cevap. Tabloda haftanın sonundaki kasa; sonda sezon boyu para özeti.
   H1 (F1 borcu, 2026-10-25): başta diziliş tutarlılığı — motorun her dizilişinde (js/mac-dizilis.js DIZILISLER) kariyerin yuva mevkileri
     (js/kariyer-kadro.js dizilisMevkileri), motorun yuva hattı (mevkiler[i].cizgi) ve hocanın yuva rolünün hattı (js/hoca.js HOCA_YUVALAR, HOCA_ROL)
     aynı olmalı; DIZILIS_YUVA_MEVKI motorda olmayan diziliş taşımamalı. Tutmazsa “!” satırı ve çıkış 1 (motor tablosu değişince kırar: istenen).
   H2-0 (2026-10-26): --kayit-yaz DOSYA@hafta=N | DOSYA@sezonSonu — kariyerin kayıt zarfını (js/kayit.js kayitMetni) o anda DOSYA'ya yazar
     (örnek kayıtlar araclar/ornekler/kayit-s9-*.json). @hafta=N: N. fikstür haftasının sonuç komutundan sonra (o Cumartesi 21:00);
     @sezonSonu: sezon sonu döngüsünden sonra (sözleşme kartları cevapsız geçildi, İlerle engelde). Yazılan an ve açık karar türleri
     (veri.karar taşıyan bekleyen işler, son cevap anıyla) ekrana basılır; an oynanmadıysa “!” satırı ve çıkış 1.
   S-0 (2026-10-27): her satırda haftanın parmak izi `iz` (haftanın sekiz maçının fikstür sırasıyla [kimlik, skor, goller, kartlar, sakatlıklar, ilk 11]
     kaydından saglamaHesapla; oyuncu ve kayıt alanları ize girmez); JSON'a `ozet` (p12, degisim, transferler, para, hukmen, sezonSonu, raporlar) ve
     `ayar`. --karsilastir DOSYA [--ayni]: ortak haftaların skor, adim, haftaGol, gol, kart, sakatlik, cezali, sakat, sira, puan, kasa, an, iz alanları
     (hafta sayısı eşitse ozet de) tabanla karşılaştırılır; farklar “! fark: …” satırı, --ayni ile fark çıkış 1. Ortam değişkeni SEZON_DENEME_AYAR
     ('{"GLOBAL_AD":{alan:değer}}'): her sezon() başında motorYukle'den hemen sonra Object.assign(GLOBAL_AD, değer); tanımsız ad kullanım hatası (2).
   RK7 (2026-11-01): maçlar Cuma–Pazartesi şablonunda (js/lig-takvimi.js); maç sayfasında yalnız bizimle aynı saattekiler oynanır, haftanın kalanı
     İlerle'de lig maçı işiyle (motor, aynı seçenek; süresi “lig maçları” satırında). Maç günü işi yolda değişebilir (erteleme, program): her adımda yeniden
     bulunur. Satırda maçımızın günü ve saati; hafta içinde kulüplerin maç sayısı eşit olmayabilir (denetim: oynanan ≤ hafta, sezon sonunda hepsi eşit);
     iz o haftanın maçlarından o ana dek oynananlar, izOnceki önceki haftanın tamamı.
   R4 (2026-10-29): hocanın isteği transfer dosyasını açar (js/transfer-alim.js); --talep onayla zinciri politikalarla yürütür, cevapsızda kart düşer:
     --aday 1|2 (varsayılan 1) · --pazarlik temkinli|guclu|devir (guclu; devir: mali işler müdürüne bırak, sonucu onayla) · --oyuncu telefon|git
     (telefon) · --saglik al|vazgec (al). --girisim TARİH[:HAT] o günden sonraki ilk durakta hocaya “<hat> hattına oyuncu bulalım” (HAT DEF|OS|FV,
     varsayılan OS); --serbest TARİH o günden sonraki ilk durakta piyasanın ilk serbest oyuncusunu hocaya araştırtır. Haftada durak sınırı 60.
   Kullanım:  node araclar/sezon-deneme.js [hafta=3] [tohum=7] [--kaydet] [--tek] [--p12 cevapsiz|sabir|degisim] [--teklif …] [--talep …] [--json DOSYA] [--kayit-yaz DOSYA@hafta=N|DOSYA@sezonSonu] [--karsilastir DOSYA [--ayni]]   (hafta en çok sezonun kalanı: 18)
     --tek   ikinci (belirlenimcilik) koşusunu atlar.   Çıkış kodu: fark ya da doğrulama hatası 1, kullanım hatası 2. */
'use strict';
const fs=require('fs'),vm=require('vm');
const {motorYukle}=require('./motor-yukle');
const A=process.argv.slice(2),bayrak=a=>A.includes(a),deger=a=>{const i=A.indexOf(a);return i>=0?A[i+1]:null;};
const sayilar=A.filter((a,i)=>/^\d+$/.test(a)&&!['--json','--karsilastir','--kayit-yaz'].includes(A[i-1])).map(Number),P12=deger('--p12')||'cevapsiz';
if(!['cevapsiz','sabir','degisim'].includes(P12)){console.error('--p12 cevapsiz | sabir | degisim olmalı');process.exit(2);}
const TEKLIF=deger('--teklif')||'cevapsiz',TALEP=deger('--talep')||'cevapsiz';
if(!['cevapsiz','sat','reddet'].includes(TEKLIF)||!['cevapsiz','onayla','reddet'].includes(TALEP)){console.error('--teklif cevapsiz|sat|reddet, --talep cevapsiz|onayla|reddet');process.exit(2);}
/* R4: transfer zincirinin politikaları (şablon kartının aşamasına göre) */
const ADAY=deger('--aday')||'1',PAZ=deger('--pazarlik')||'guclu',OYU=deger('--oyuncu')||'telefon',SAG=deger('--saglik')||'al';
const GIRISIM=deger('--girisim'),SERBEST=deger('--serbest');
if(!['1','2'].includes(ADAY)||!['temkinli','guclu','devir'].includes(PAZ)||!['telefon','git'].includes(OYU)||!['al','vazgec'].includes(SAG)
  ||GIRISIM&&!/^\d{4}-\d\d-\d\d(:(DEF|OS|FV))?$/.test(GIRISIM)||SERBEST&&!/^\d{4}-\d\d-\d\d$/.test(SERBEST)){
  console.error('--aday 1|2, --pazarlik temkinli|guclu|devir, --oyuncu telefon|git, --saglik al|vazgec, --girisim TARİH[:DEF|OS|FV], --serbest TARİH');process.exit(2);}
const ZINCIR={ihtiyac:TALEP,aday:ADAY==='2'?'adayB':'adayA',gorus:'gorus',yurutme:PAZ==='devir'?'devret':'kendim',kulupPazarlik:PAZ==='temkinli'?'temkinli':'guclu',
  devirOnay:'imza',bedelArtti:'farkiOde',temas:OYU,oyuncuPazarlik:'guclu',saglikKarari:SAG==='al'?'risk':'vazgec',alternatif:'obur'};
const HAFTA=sayilar[0]||3,TOHUM=sayilar[1]!=null?sayilar[1]:7,KAYDET=bayrak('--kaydet'),TEK=bayrak('--tek'),JSON_DOSYA=deger('--json');
if(HAFTA<1){console.error('hafta en az 1 olmalı');process.exit(2);}
/* H2-0: --kayit-yaz DOSYA@hafta=N | DOSYA@sezonSonu */
const KAYIT_YAZ=(()=>{const v=deger('--kayit-yaz');if(v===null)return null;
  const i=v?v.lastIndexOf('@'):-1,dosya=i>0?v.slice(0,i):'',an=i>0?v.slice(i+1):'',m=/^hafta=(\d+)$/.exec(an);
  if(!dosya||!(m||an==='sezonSonu')){console.error('--kayit-yaz DOSYA@hafta=N | DOSYA@sezonSonu olmalı');process.exit(2);}
  return{dosya,hafta:m?Number(m[1]):null,sezonSonu:an==='sezonSonu',ad:an};})();
/* S-0: --karsilastir DOSYA [--ayni] ve SEZON_DENEME_AYAR */
const KARSI=deger('--karsilastir'),AYNI=bayrak('--ayni');
if(bayrak('--karsilastir')&&!KARSI){console.error('--karsilastir DOSYA olmalı');process.exit(2);}
const AYAR=(()=>{const v=process.env.SEZON_DENEME_AYAR;if(!v)return null;let o;
  try{o=JSON.parse(v);}catch(e){console.error('SEZON_DENEME_AYAR JSON değil: '+e.message);process.exit(2);}
  if(!o||typeof o!=='object'||Array.isArray(o)||Object.values(o).some(x=>!x||typeof x!=='object'||Array.isArray(x))){console.error('SEZON_DENEME_AYAR biçimi {"GLOBAL_AD":{alan:değer}} olmalı');process.exit(2);}
  return o;})();
const ayarUygulaSezon=G=>{if(!AYAR)return;for(const [ad,d] of Object.entries(AYAR)){
  if(!/^[A-Za-z_$][\w$]*$/.test(ad)||G(`typeof ${ad}`)!=='object'){console.error(`SEZON_DENEME_AYAR: ${ad} tanımlı bir nesne değil`);process.exit(2);}
  Object.assign(G(ad),d);}};
const MAKS=60*60*60;   /* güvenlik sınırı: 60 dakikalık adım (20 dakikalık maç ~23 dakikada biter) */

/* H1: diziliş tutarlılığı (kariyer yuva mevkisi = motorun yuva hattı = hocanın yuva rolünün hattı) */
function dizilisTutarliligi(){
  const {ctx}=motorYukle(),G=a=>vm.runInContext(a,ctx),D=G('DIZILISLER'),dm=G('dizilisMevkileri'),HY=G('HOCA_YUVALAR'),HR=G('HOCA_ROL'),T=G('DIZILIS_YUVA_MEVKI');
  const fark=[];
  for(const d of Object.keys(D)){
    const a=JSON.stringify(dm(d)),m=JSON.stringify(D[d].mevkiler.map(x=>x.cizgi));
    const h=HY[d]?JSON.stringify(HY[d].map(s=>(HR[s.split(':')[0]]||{cizgi:'?'}).cizgi)):'(HOCA_YUVALAR\'da yok)';
    if(a!==m||a!==h)fark.push(`${d}: kariyer ${a} · motor ${m} · hoca ${h}`);
  }
  for(const d of Object.keys(T))if(!D[d])fark.push(`${d}: DIZILIS_YUVA_MEVKI'de var, motorda (DIZILISLER) yok`);
  return{dizilisler:Object.keys(D),fark};
}

function sezon(){
  const {ctx}=motorYukle(),G=a=>vm.runInContext(a,ctx);
  ayarUygulaSezon(G);
  const [kariyerBaslat,KK,duragaIlerle,ajandaIsiYap,macGirdisi,dogrula,sezonTablosu,kariyerKaydet,kariyerYukle,bellekDeposu,kulupOyunculari,Match,haftaninDigerMaclari,digerMacPlani,haftaUygula,hukmenSonucu]=
    ['kariyerBaslat','kariyerKomut','duragaIlerle','ajandaIsiYap','macGirdisi','kariyerDogrula','sezonTablosu','kariyerKaydet','kariyerYukle','bellekDeposu','kulupOyunculari','Match','haftaninDigerMaclari','digerMacPlani','haftaSonuclariUygula','hukmenSonucu'].map(G);
  const oyna=sec=>{const m=new Match(()=>{},sec);m.macaGec();let n=0;while(m.phase!=='fulltime'&&n<MAKS){m.step(1/60);n++;}return{m,n};};
  /* RK7: lig maçı işinin sonucu motorla (kuralın varsayılan yoluyla aynı: arkaMacOynat, macaGec); süre ve sayı ölçülür */
  const LIG={ms:0,n:0};vm.runInContext('globalThis.__ligOlc=null',ctx);ctx.__ligOlc=LIG;
  vm.runInContext('LIG_MAC_SAGLAYICI=(k,p)=>{const t=Date.now(),s=arkaMacOynat(Match,p.secenek,{oncesi:false}).son;__ligOlc.ms+=Date.now()-t;__ligOlc.n++;return s;}',ctx);
  /* H2-0: --kayit-yaz anlık görüntüsü (yazım sezon() dönünce, yalnız ilk koşudan) */
  const saat=d=>`${String(Math.floor(d/60)).padStart(2,'0')}:${String(d%60).padStart(2,'0')}`;
  let kayitAni=null;
  const kayitAl=x=>{try{return{metin:G('kayitMetni')(x),an:`${x.tarih} ${saat(x.gunIciDakika)}`,
      kararlar:Object.values(x.isler).filter(i=>i.veri&&i.veri.karar).map(i=>`${i.veri.karar} (son cevap ${i.tarih} ${saat(i.dakika)})`),
      sonuc:!!x.sezon.sonuc,engel:G('ilerleOnizle')(x).engel};}
    catch(e){hatalar.push(`--kayit-yaz ${KAYIT_YAZ.ad}: kayıt metni yazılamadı — ${e.message}`);return null;}};
  let k=kariyerBaslat({tohum:TOHUM});
  const biz=k.kisiler[k.baskanId].kulupId,satirlar=[],hatalar=[];let hukmenToplam=0,girisimYapildi=false,serbestYapildi=false;
  /* S-a: oyuncunun haftası ölçüleri (gizli, TEST): maç anında ilk 11'in kondisyonu, dinlenen (önceki on birde, maç günü uygun, on birde değil),
     art arda dışarıda kalma, yaş grubuna göre gelişim ölçüsü farkı, form dağılımı, haftanın sakatlıkları */
  const OKon=G('oyuncuKondisyonu'),OGel=G('gelisimOrt'),OYas=G('oyuncuYasi'),OUyg=G('oyuncuUygunMu'),OH={kon:[],dinlenen:0,kulupMac:0,seri:new Map(),rekor:0,sakat:0};
  const gel0=new Map(Object.values(k.oyuncular).filter(p=>p.kulupId).map(p=>{const y=OYas(p,k.tarih);return[p.id,{g:OGel(p),grup:y<=21?'genc':y<=29?'orta':'yasli'}];}));
  /* sezonun oynanacak haftaları (TEST tarifi: 13–30, 18 hafta); fazlası istenirse sezon sonunda durulur (F2 incelemesi) */
  const kalan=k.sezon.haftaSayisi-k.sezon.ilkHafta+1,N=Math.min(HAFTA,kalan);
  /* R4-j: oynama ölçüsü (TEST; davranışa dokunmaz) — karar işleri ilk görüldükleri haftaya sayılır, dosyalar açıldıkları ve kapandıkları haftaya */
  const KS=new Map(),DS=new Map(),DK=new Map();
  const olcuGor=hi=>{for(const x of Object.values(k.isler))if(x.tur==='ajanda'&&x.veri&&x.veri.karar&&!KS.has(x.id))KS.set(x.id,{h:hi,tur:x.veri.karar});
    for(const m of Object.values(k.meseleler||{})){if(!DS.has(m.id))DS.set(m.id,hi);if(m.durum==='kapandi'&&!DK.has(m.id))DK.set(m.id,hi);}};
  for(let h=0;h<N;h++){
    olcuGor(h);
    const mgBul=()=>Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');let is=mgBul();
    if(!is){hatalar.push('maç günü işi yok ama sezon bitmedi');break;}
    /* maç gününe dek İlerle; P12 kararı, aday görüşmesi ve aday kartı --p12'ye göre cevaplanır (F6-a). RK7: iş yolda değişebilir (erteleme, program) */
    for(let g=0;g<60&&is&&!(k.tarih===is.tarih&&k.gunIciDakika===is.dakika);g++,is=mgBul()){
      olcuGor(h);
      const B=t=>Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.karar===t),ad=B('hocaAdayi'),kr=B('hocaKarari');
      const rd=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.etki==='hocaAdayGorusmesi'&&x.tarih===k.tarih&&x.dakika===k.gunIciDakika);
      if(ad){k=KK(k,x=>ajandaIsiYap(x,ad.id,'al')).kariyer;continue;}
      if(rd){k=KK(k,x=>ajandaIsiYap(x,rd.id)).kariyer;continue;}
      if(kr&&P12!=='cevapsiz'){k=KK(k,x=>ajandaIsiYap(x,kr.id,P12)).kariyer;continue;}
      const tk=B('teklifKarari'),tb=B('transferButcesi');   /* G2: transfer kararları */
      if(tk&&TEKLIF!=='cevapsiz'){k=KK(k,x=>ajandaIsiYap(x,tk.id,TEKLIF)).kariyer;continue;}
      if(tb&&TALEP!=='cevapsiz'){k=KK(k,x=>ajandaIsiYap(x,tb.id,TALEP)).kariyer;continue;}
      /* R4: şablon kartı (transfer zinciri) aşamasına göre; --talep cevapsizde kart düşer. Başkanın girişimi bir kez, verilen günden sonraki ilk durakta */
      if(TALEP!=='cevapsiz'){const sk=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.karar==='sablonKarti');
        if(sk){const a=k.meseleler[sk.veri.meseleId].sablon.asama,S=G('ajandaOnizle')(k,sk.id).secenekler;let s=ZINCIR[a];
          if(!S.some(o=>o.id===s&&!o.engel))s=(S.find(o=>!o.engel)||S[0]).id;
          k=KK(k,x=>ajandaIsiYap(x,sk.id,s)).kariyer;continue;}}
      if(GIRISIM&&!girisimYapildi&&k.tarih>=GIRISIM.slice(0,10)){girisimYapildi=true;const g='yaz.teknikDirektor.transfer'+(GIRISIM.slice(11)||'OS'),u=G('GIRISIMLER')[g].uygun(k);
        if(u===true){k=KK(k,x=>G('girisimBaslat')(x,g)).kariyer;continue;}hatalar.push(`--girisim ${GIRISIM}: başlatılamadı (${u})`);}
      if(SERBEST&&!serbestYapildi&&k.tarih>=SERBEST){serbestYapildi=true;const p=G('piyasaListesi')(k).serbest[0];
        try{k=KK(k,x=>G('transferArastirt')(x,p.id)).kariyer;continue;}catch(e){hatalar.push(`--serbest ${SERBEST}: ${e.message}`);}}
      k=KK(k,x=>duragaIlerle(x)).kariyer;
    }
    if(!is||!k.isler[is.id]||k.tarih!==is.tarih||k.gunIciDakika!==is.dakika){hatalar.push(`İlerle maç gününe gitmedi (${k.tarih} ${k.gunIciDakika})`);break;}
    /* maç girdileri ve haftanın planı (G1-a: 11 uygun oyuncu çıkaramayan tarafın maçı hükmen; motor oynamaz) — beklenmeyen hata çökmeden raporlanır */
    let Gi,D;
    try{Gi=macGirdisi(k,is.veri.macId);D=haftaninDigerMaclari(k,Gi.macId).map(f=>digerMacPlani(k,f));}
    catch(e){hatalar.push(`${k.tarih}: hafta kurulamadı — ${e.message}`);break;}
    k=KK(k,x=>ajandaIsiYap(x,is.id)).kariyer;
    {const kadrolar=[...Gi.kadro,...D.filter(d=>d.secenek&&d.secenek.kadro).flatMap(d=>d.secenek.kadro)];
     for(const K of kadrolar)for(const o of K.oyuncular||[])if(k.oyuncular[o.id])OH.kon.push(OKon(k,k.oyuncular[o.id],Gi.tarih));}
    const onceki=new Map(k.sezon.takimlar.map(id=>[id,(k.kulupler[id].kadro||{ilk11:[]}).ilk11.slice()])),oncekiO=k.oyuncular;
    const t0=process.hrtime.bigint(),{m,n}=Gi.hukmen?{m:null,n:0}:oyna({kadro:Gi.kadro,tohum:Gi.tohum,tunel:{x:0,z:-6},tarz:Gi.tarz.slice()});
    const ms=Number(process.hrtime.bigint()-t0)/1e6;
    const O=D.map(d=>d.hukmen?{d,m:null,sonuc:hukmenSonucu(d.hukmen)}:Object.assign({d},oyna(d.secenek))),msHafta=Number(process.hrtime.bigint()-t0)/1e6;
    if(m&&m.phase!=='fulltime'||O.some(o=>o.m&&o.m.phase!=='fulltime')){hatalar.push(`${Gi.macId}: haftanın bir maçı ${MAKS} adımda bitmedi`);break;}
    const S=Gi.hukmen?hukmenSonucu(Gi.hukmen):m.sonucKaydi();
    for(const o of O)if(o.m)o.sonuc=o.m.sonucKaydi();
    hukmenToplam+=(Gi.hukmen?1:0)+O.filter(o=>!o.m).length;
    k=KK(k,x=>haftaUygula(x,Gi.macId,S,Gi.tohum,{},O.map(o=>({macId:o.d.macId,sonuc:o.sonuc,tohum:o.d.tohum})))).kariyer;
    olcuGor(h);
    for(const [id,L] of onceki){const yeni=new Set((k.kulupler[id].kadro||{ilk11:[]}).ilk11);OH.kulupMac++;
      for(const pid of L){const p=oncekiO[pid];if(!p||p.kulupId!==id)continue;
        if(!yeni.has(pid)&&OUyg(p,Gi.tarih)){OH.dinlenen++;const s=(OH.seri.get(pid)||0)+1;OH.seri.set(pid,s);if(s>OH.rekor)OH.rekor=s;}else OH.seri.delete(pid);}}
    OH.sakat+=S.sakatliklar.length+O.reduce((a,o)=>a+(o.sonuc.sakatliklar||[]).length,0);
    if(KAYDET){const d=bellekDeposu();kariyerKaydet(d,'s',k);const y=kariyerYukle(d,'s');
      if(!y.tamam||JSON.stringify(y.kariyer)!==JSON.stringify(k)){hatalar.push(`${Gi.macId}: kaydet–yükle farklı`);break;}k=y.kariyer;}
    if(KAYIT_YAZ&&KAYIT_YAZ.hafta===Gi.hafta)kayitAni=kayitAl(k);
    /* S-0: haftanın parmak izi (yalnız maç kayıtlarından; oyuncu ve kayıt alanları girmez) */
    const izH=hh=>G('saglamaHesapla')(JSON.stringify(k.fikstur.filter(f=>f.hafta===hh).map(f=>{const s=k.maclar[f.id]||{};
      return[f.id,s.skor||null,(s.goller||[]).map(g=>[g.id,g.dk,!!g.kk]),(s.kartlar||[]).map(c=>[c.id,c.renk,c.dk]),(s.sakatliklar||[]).map(x=>[x.id,x.derece,x.gun]),s.ilk11||null];})));
    const iz=izH(Gi.hafta),izOnceki=izH(Gi.hafta-1),fm=k.fikstur.find(f=>f.id===Gi.macId),GUN=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'],gunu=GUN[new Date(fm.tarih+'T00:00:00Z').getUTCDay()]+' '+saat(fm.dakika);
    const tb=sezonTablosu(k),sira=tb.findIndex(t=>t.id===biz)+1,Op=kulupOyunculari(k,biz);
    {const enH=Math.max(...k.fikstur.filter(f=>k.maclar[f.id]).map(f=>f.hafta));
     if(tb.some(t=>t.O>enH)){hatalar.push(`${Gi.hafta}. hafta: bir kulüp oynanmış haftadan çok maç yapmış`);break;}}   /* RK7: hafta içinde eşit olmayabilir */
    satirlar.push({hafta:Gi.hafta,mac:Gi.macId,gunu,ev:k.kulupler[Gi.ev].kisa,konuk:k.kulupler[Gi.konuk].kisa,skor:S.skor.join('-'),adim:n,ms:Math.round(ms),msHafta:Math.round(msHafta),
      haftaGol:S.goller.length+O.reduce((a,o)=>a+o.sonuc.skor[0]+o.sonuc.skor[1],0),
      gol:S.goller.length,kart:S.kartlar.length,sakatlik:S.sakatliklar.length,cezali:Op.filter(p=>p.ceza).length,sakat:Op.filter(p=>p.sakat).length,
      sira,puan:tb[sira-1].P,kasa:k.kulupler[biz].nakit,izOnceki,an:`${k.tarih} ${String(Math.floor(k.gunIciDakika/60)).padStart(2,'0')}:${String(k.gunIciDakika%60).padStart(2,'0')}`,kayit:JSON.stringify(k).length,iz});
  }
  if(N===kalan&&!hatalar.length&&Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'))hatalar.push('sezon bitti ama maç günü işi duruyor');
  /* RK7: son haftanın bizden sonraki maçları kendi saatinde; sezon sonu kaydını son maç yazar */
  if(N===kalan&&!hatalar.length){for(let g=0;g<30&&!k.sezon.sonuc&&!G('ilerleOnizle')(k).engel.length;g++)k=KK(k,x=>duragaIlerle(x)).kariyer;
    if(!k.sezon.sonuc)hatalar.push('sezonun bütün maçları oynanmadı: '+k.fikstur.filter(f=>f.hafta>=k.sezon.ilkHafta&&!k.maclar[f.id]).map(f=>f.id).slice(0,3).join(', '));
    else{const tb=sezonTablosu(k);if(new Set(tb.map(t=>t.O)).size!==1)hatalar.push('sezon sonunda kulüplerin maç sayısı eşit değil');}}
  const ertelenen=k.fikstur.filter(f=>f.ertelendi).map(f=>`${f.id.replace(/^mac-\d+-/,'')} ${f.ertelendi.tarih}→${f.tarihBekliyor?'?':f.tarih} (${f.ertelendi.neden})`);
  const h=dogrula(k);if(h.length)hatalar.push('kariyer geçersiz: '+h.slice(0,3).join('; '));
  const p12=Object.values(k.olaylar).filter(o=>o.paket==='hocaDegerlendirme').map(o=>`${o.acilis.tarih} ${o.varyant} (${o.durum})`);
  const degisim=k.gecmis.filter(g=>g.tur==='hocaDegisimi').map(g=>`${g.tarih} ${k.kisiler[g.eskiId].ad} → ${k.kisiler[g.yeniId].ad} (${k.kisiler[g.yeniId].hoca.tarz})`);
  /* G1-d: sezon sonu kaydı ve İlerle'nin engel metni */
  let sezonSonu=null;
  if(k.sezon.sonuc){const R=k.sezon.sonuc,ad=id=>k.kulupler[id].ad;let c=k;
    /* G2: sezon sonundaki sözleşme kartları cevapsız geçilir (her biri bir hafta bekleyebilir; zaman aşımında oyuncu ayrılır) */
    for(let g=0;g<120&&!G('ilerleOnizle')(c).engel.length;g++)c=KK(c,x=>duragaIlerle(x)).kariyer;
    const ayr=c.gecmis.filter(g=>g.tur==='ayrilis'&&g.tarih>=R.tarih).length,kart=Object.values(c.isler).filter(x=>x.tur==='ajanda'&&x.veri.karar==='sozlesmeYenile').length;
    const hs=dogrula(c);if(hs.length)hatalar.push('sezon sonundan sonra kariyer geçersiz: '+hs.slice(0,3).join('; '));
    if(KAYIT_YAZ&&KAYIT_YAZ.sezonSonu)kayitAni=kayitAl(c);
    sezonSonu=`şampiyon ${ad(R.sampiyon)} (${R.tablo[0].P} puan) · biz ${R.bizimSira}. sıra, ${R.bizimPuan} puan · sözleşmesi biten ${ayr} oyuncu cevapsız kartlarla ayrıldı (${c.tarih}; kadro ${c.kulupler[biz].kadro.ilk11.length+c.kulupler[biz].kadro.yedekler.length}) · İlerle: ${G('ilerleOnizle')(c).engel.join('; ')||'(engel yok)'}`;}
  /* R4: dönem kapanınca kulüplü oyuncu için açık transfer dosyası kalmaz (serbest oyuncunun dosyası dönem dışında da sürebilir) */
  if(k.tarih>'2027-02-01'){const A=Object.values(k.meseleler||{}).filter(m=>m.durum!=='kapandi'&&m.sablon&&m.sablon.ad==='transferAlim');
    const kulup=A.filter(m=>{const id=m.sablon.veri.hedef||m.sablon.veri.istenen;return!id||(k.oyuncular[id]||{}).kulupId;});
    if(kulup.length)hatalar.push('dönemden sonra açık transfer dosyası: '+kulup.map(m=>m.id+' '+m.sablon.asama).join(', '));}
  /* G2: sezon boyu para (başkanın kulübü; kalem başına) ve transferler */
  const para={};for(const h of k.hareketler)if(h.kulupId===biz)para[h.kalem]=(para[h.kalem]||0)+h.tutar;
  const transferler=k.gecmis.filter(g=>g.tur==='transfer'||g.tur==='ayrilis').map(g=>`${g.tarih} ${k.oyuncular[g.oyuncuId].ad} ${g.eski||'serbest'} → ${g.yeni||'serbest'}${g.bedel?' '+(g.bedel/100).toLocaleString('tr-TR')+' ₺':''}`);
  if(KAYIT_YAZ&&!kayitAni&&!hatalar.length)hatalar.push(`--kayit-yaz ${KAYIT_YAZ.ad}: bu an oynanmadı (${KAYIT_YAZ.sezonSonu?'sezon sonu kaydı yok':`oynanan haftalar ${satirlar.length?satirlar[0].hafta+'–'+satirlar[satirlar.length-1].hafta:'yok'}`})`);
  /* H2-d: mali işler müdürünün raporları (haftalık, aylık, eksi kasa uyarısı) ve son raporun tarihi */
  const raporlar={haftalik:0,aylik:0,uyari:0,son:null};for(const h of k.haberler)if(h.tur==='rapor'){raporlar[h.anahtar.replace(/^mali\./,'')]++;raporlar.son=h.tarih;}
  /* S-a: oyuncunun haftası özeti */
  const gf={genc:[],orta:[],yasli:[]};for(const [id,a] of gel0){const p=k.oyuncular[id];if(p)gf[a.grup].push(OGel(p)-a.g);}
  const ort=L=>L.length?Math.round(L.reduce((a,b)=>a+b,0)/L.length*100)/100:null,F=Object.values(k.oyuncular).filter(p=>p.hal).map(p=>p.hal.form);
  const fo=F.length?F.reduce((a,b)=>a+b,0)/F.length:0,oyuncuHaftasi={kapali:!G('oyuncuHaftasiAcik')(),konOrt:ort(OH.kon),konMin:OH.kon.length?Math.min(...OH.kon):null,
    dinlenen:OH.dinlenen,dinlenenKulupMac:OH.kulupMac?Math.round(OH.dinlenen/OH.kulupMac*100)/100:0,rekor:OH.rekor,gelisim:{genc:ort(gf.genc),orta:ort(gf.orta),yasli:ort(gf.yasli)},
    formSd:F.length?Math.round(Math.sqrt(F.reduce((a,b)=>a+(b-fo)*(b-fo),0)/F.length)*10)/10:null,sakatlik:OH.sakat,hukmen:hukmenToplam};
  /* R4-j: hafta başına karar, kararsız hafta, karar türleri; dosyalar (açılan, kapanan, başkanın başlattığı); transfer sayaçları */
  const H=satirlar.length,kh=Array.from({length:H},()=>0),turler={};
  for(const v of KS.values()){if(v.h<H)kh[v.h]++;turler[v.tur]=(turler[v.tur]||0)+1;}
  const ML=Object.values(k.meseleler||{}),bas=ML.filter(m=>m.sablon&&m.sablon.kaynak==='baskan').length,sb=ML.filter(m=>m.sablon);
  const tr={imza:k.gecmis.filter(g=>g.tur==='transfer'&&g.yeni===biz).length,satis:k.gecmis.filter(g=>g.tur==='transfer'&&g.eski===biz).length,
    rakibe:k.gecmis.filter(g=>g.tur==='transfer'&&g.eski!==biz&&g.yeni!==biz&&g.eski).length};
  const olcu={kararHafta:kh,kararOrt:H?Math.round(kh.reduce((a,b)=>a+b,0)/H*100)/100:0,kararEnCok:H?Math.max(...kh):0,kararsiz:kh.filter(x=>!x).length,turler,
    dosya:{acilan:DS.size,kapanan:DK.size,sablonlu:sb.length,baskan:bas,girisimPay:sb.length?Math.round(bas/sb.length*100):null,
      sonuc:sb.reduce((o,m)=>{const r=m.sablon.sonuc||'acik';o[r]=(o[r]||0)+1;return o;},{})},transfer:tr};
  return{k,satirlar,hatalar,kalan,lig:LIG,ertelenen,p12,degisim,hukmen:hukmenToplam,sezonSonu,para,transferler,kasa:k.kulupler[biz].nakit,metin:JSON.stringify(k),kayitAni,raporlar,oyuncuHaftasi,olcu};
}

const t0=Date.now();
console.log(`Chairman sezon denemesi · ${HAFTA} hafta · dünya tohumu ${TOHUM}${KAYDET?' · her hafta kaydet–yükle':''}`);
const DZ=dizilisTutarliligi();
if(DZ.fark.length)for(const f of DZ.fark)console.log(`! Diziliş tutarlılığı (H1): ${f}`);
else console.log(`  Diziliş tutarlılığı (H1): ${DZ.dizilisler.join(', ')} — kariyerin yuva mevkileri = motorun yuva hattı = hocanın yuva rolü`);
const R=sezon();
if(HAFTA>R.kalan)console.log(`  (sezonun oynanacak haftası ${R.kalan}; ${HAFTA} yerine ${R.kalan} hafta oynandı, sezon sonunda maç günü işi kalmadı)`);
console.log('  (RK7: maçımızın günü ve saati: '+R.satirlar.map(s=>s.hafta+' '+s.gunu).join(' · ')+')');
console.log('  hafta  maç            skor   adım    ms  hafta ms  hafta gol  gol kart sakat · bizde cezalı/sakat · sıra puan · oda an            kayıt     kasa ₺');
for(const s of R.satirlar)console.log(`  ${String(s.hafta).padStart(5)}  ${(s.ev+'–'+s.konuk).padEnd(13)} ${s.skor.padEnd(6)} ${String(s.adim).padStart(6)} ${String(s.ms).padStart(5)} ${String(s.msHafta).padStart(8)} ${String(s.haftaGol).padStart(9)}  ${String(s.gol).padStart(3)} ${String(s.kart).padStart(4)} ${String(s.sakatlik).padStart(5)} · ${String(s.cezali).padStart(6)}/${s.sakat}        · ${String(s.sira).padStart(4)} ${String(s.puan).padStart(5)} · ${s.an} ${String(Math.round(s.kayit/1024)).padStart(5)} KB ${String(Math.round(s.kasa/100).toLocaleString('tr-TR')).padStart(10)}`);
const ms=R.satirlar.map(s=>s.ms),ort=ms.length?ms.reduce((a,b)=>a+b,0)/ms.length:0,adim=R.satirlar.reduce((a,s)=>a+s.adim,0),hOrt=R.satirlar.length?R.satirlar.reduce((a,s)=>a+s.msHafta,0)/R.satirlar.length:0;
console.log(`  Bizim maç ${Math.round(ort)} ms (${R.satirlar.length} hafta; 1000 adım ${adim?(ms.reduce((a,b)=>a+b,0)/adim*1000).toFixed(1):'—'} ms) · aynı saatteki maçlarla ${(hOrt/1000).toFixed(1)} sn · hafta başına gol ${(R.satirlar.reduce((a,s)=>a+s.haftaGol,0)/Math.max(1,R.satirlar.length)).toFixed(1)}`);
console.log(`  Hükmen (G1-a): ${R.hukmen} maç`);
console.log(`  Lig maçları kendi saatinde (RK7): ${R.lig.n} maç, ${(R.lig.ms/1000).toFixed(1)} sn (maç başına ${R.lig.n?Math.round(R.lig.ms/R.lig.n):0} ms) · ertelenen ${R.ertelenen.length}${R.ertelenen.length?': '+R.ertelenen.join(' · '):''}`);
{const tl=x=>(x/100).toLocaleString('tr-TR',{maximumFractionDigits:0})+' ₺';
 console.log(`  Para (G2; --teklif ${TEKLIF} · --talep ${TALEP}): kasa ${tl(R.kasa)} · `+Object.entries(R.para).map(([a,v])=>`${a} ${tl(v)}`).join(' · '));
 if(R.transferler.length)console.log(`  Transferler: ${R.transferler.join(' · ')}`);}
if(R.sezonSonu)console.log(`  Sezon sonu (G1-d): ${R.sezonSonu}`);
console.log(`  P12 (--p12 ${P12}): ${R.p12.length?R.p12.join(' · '):'açılmadı'}${R.degisim.length?' · hoca değişimi: '+R.degisim.join(' · '):''}`);
console.log(`  Mali raporlar (H2-d): haftalık ${R.raporlar.haftalik} · aylık ${R.raporlar.aylik} · uyarı ${R.raporlar.uyari} · son ${R.raporlar.son||'—'}`);
{const H=R.oyuncuHaftasi,s=x=>x==null?'—':(x>0?'+':'')+x;
 console.log(`  Oyuncunun haftası (S-a; gizli, TEST${H.kapali?'; anahtar kapalı':''}): maç anı ilk 11 kondisyonu ort ${H.konOrt==null?'—':H.konOrt} · en düşük ${H.konMin==null?'—':H.konMin} · dinlenen ${H.dinlenen} (kulüp-maç başına ${H.dinlenenKulupMac}) · art arda dışarıda en çok ${H.rekor} · gelişim ölçüsü farkı ≤21 ${s(H.gelisim.genc)} · 22–29 ${s(H.gelisim.orta)} · 30+ ${s(H.gelisim.yasli)} · form sd ${H.formSd==null?'—':H.formSd} · sakatlık ${H.sakatlik} · hükmen ${H.hukmen}`);}
{const O=R.olcu;
 console.log(`  Oynama ölçüsü (R4-j; TEST): karar/hafta ort ${O.kararOrt} · en çok ${O.kararEnCok} · kararsız hafta ${O.kararsiz}/${O.kararHafta.length} · haftalar [${O.kararHafta.join(' ')}] · türler ${Object.entries(O.turler).map(([a,v])=>a+' '+v).join(', ')||'—'}`);
 console.log(`  Dosyalar: açılan ${O.dosya.acilan} · kapanan ${O.dosya.kapanan} · şablonlu ${O.dosya.sablonlu} (başkanın ${O.dosya.baskan}${O.dosya.girisimPay==null?'':', pay %'+O.dosya.girisimPay}) · sonuç ${Object.entries(O.dosya.sonuc).map(([a,v])=>a+' '+v).join(', ')||'—'} · transfer: gelen ${O.transfer.imza}, giden ${O.transfer.satis}, başka kulüpler arası ${O.transfer.rakibe}`);}
if(KAYIT_YAZ&&R.kayitAni){const Y=R.kayitAni;fs.writeFileSync(KAYIT_YAZ.dosya,Y.metin);
  console.log(`  Kayıt yazıldı (H2-0; @${KAYIT_YAZ.ad}): ${KAYIT_YAZ.dosya} · an ${Y.an} · ${Math.round(Y.metin.length/1024)} KB · açık kararlar: ${Y.kararlar.length?Y.kararlar.join(', '):'yok'} · sezon sonucu ${Y.sonuc?'var':'yok'} · İlerle engeli: ${Y.engel.join('; ')||'(yok)'}`);}
let ayni=null;
if(!TEK&&!R.hatalar.length){const R2=sezon();ayni=R2.metin===R.metin&&!R2.hatalar.length;
  console.log(ayni?'  Belirlenimcilik: aynı tohumla ikinci koşu birebir aynı kariyer':'! Belirlenimcilik: ikinci koşu farklı'+(R2.hatalar.length?' ('+R2.hatalar.join('; ')+')':''));}
for(const h of R.hatalar)console.log('! '+h);
const OZET={p12:R.p12,degisim:R.degisim,transferler:R.transferler,para:R.para,hukmen:R.hukmen,sezonSonu:R.sezonSonu,raporlar:R.raporlar,ertelenen:R.ertelenen};
if(JSON_DOSYA)fs.writeFileSync(JSON_DOSYA,JSON.stringify({hafta:HAFTA,tohum:TOHUM,kaydet:KAYDET,satirlar:R.satirlar,ortMs:Math.round(ort),haftaMs:Math.round(hOrt),ayni,hatalar:R.hatalar,dizilis:DZ.fark,raporlar:R.raporlar,ozet:OZET,ayar:AYAR,oyuncuHaftasi:R.oyuncuHaftasi,olcu:R.olcu},null,1));
/* S-0: tabanla karşılaştırma (ms, msHafta ve kayıt bilgi; tabanda olmayan alan atlanır) */
let farkSay=0;
if(KARSI){let T;try{T=JSON.parse(fs.readFileSync(KARSI,'utf8'));}catch(e){console.error(`--karsilastir ${KARSI}: okunamadı — ${e.message}`);process.exit(2);}
  const ALAN=['skor','adim','haftaGol','gol','kart','sakatlik','cezali','sakat','sira','puan','kasa','an','iz','izOnceki','gunu'],fark=[];
  const th=new Map((T.satirlar||[]).map(s=>[s.hafta,s]));let ortak=0;
  for(const s of R.satirlar){const t=th.get(s.hafta);if(!t)continue;ortak++;
    for(const a of ALAN)if(a in t&&JSON.stringify(t[a])!==JSON.stringify(s[a]))fark.push(`hafta ${s.hafta} ${a}: ${JSON.stringify(t[a])} → ${JSON.stringify(s[a])}`);}
  if(T.ozet&&(T.satirlar||[]).length===R.satirlar.length)for(const [a,v] of Object.entries(T.ozet))if(JSON.stringify(v)!==JSON.stringify(OZET[a]))fark.push(`özet ${a}: ${JSON.stringify(v).slice(0,120)} → ${JSON.stringify(OZET[a]).slice(0,120)}`);
  farkSay=fark.length;
  for(const f of fark.slice(0,10))console.log('! fark: '+f);
  console.log(fark.length?`${AYNI?'!':' '} Karşılaştırma (${KARSI}): ${ortak} ortak hafta, ${fark.length} fark${fark.length>10?' (ilk 10 yazıldı)':''}`:`  Karşılaştırma (${KARSI}): ${ortak} ortak hafta birebir aynı`);
  if(!ortak&&AYNI){console.log('! Karşılaştırma: ortak hafta yok');farkSay=1;}}
if(AYAR)console.log(`  SEZON_DENEME_AYAR: ${JSON.stringify(AYAR)}`);
console.log(`  Süre ${((Date.now()-t0)/1000).toFixed(1)} sn`);
process.exit(R.hatalar.length||ayni===false||DZ.fark.length||(AYNI&&farkSay)?1:0);
