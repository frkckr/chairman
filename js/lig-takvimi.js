/* ============ Chairman — lig takvimi: maç saatleri, TFF programı, erteleme ve öbür maçların kendi saatinde oynanması (kural; çizim yok; RK7, 2026-11-01) ============
   Kullanıcı (31 Ekim notu 9; 1 Kasım cevapları): fikstür gerçekçi yayılsın, ertelemeler olsun; bir iki maç aynı saatte (maç telefonunda canlı akış
   korunur); devre arası ve hafta içi lig haftası yeni sezonla (H3). Plan araclar/plan/rk-program.md §11. Bütün sayılar TEST.
   Hafta şablonu (LIG_TAKVIM_TEST.sablon; haftanın Cumartesisine göre gün): Cuma 20:00 · Cumartesi 17:00 ×2, 20:00 · Pazar 17:00 ×2, 20:00 · Pazartesi 20:00.
     Büyük maç (puan durumunda sıraları toplamı en küçük çift) Cumartesi ya da Pazar 20:00'de tek; başkanın kulübünün maçı çoğunlukla 17:00'de (bir
     maçla aynı saatte), ara sıra öbür 20:00'de, Cuma ya da Pazartesi. Atama dünya tohumu ve haftadan belirlenimli; büyük maç açıklama anının puan durumundan.
   İlk hafta (sezonun ilkHafta'sı) devralınan programla oynanır: bütün maçlar Cumartesi 19:00 (TEST; oyunun ilk maç günü ve onun canlı Canlı Skor'u aynı kalır).
   TFF programı (IS_TURLERI.program, gizli): her Pazartesi 10:00'da üç hafta sonrasının gün ve saati açıklanır (k.sezon.programAciklanan: açıklanan son
     hafta). Açıklanmamış haftanın maçları geçici olarak Cumartesi 19:00'dadır (ekranlar “saati açıklanmadı” der). Açıklama o haftanın öbür maçlarına
     lig maçı işini, Aralık–Şubat haftalarına hava denetimini kurar, ertelenmiş maçlara yeni tarih verir, başkanın maç günü işini fikstürle eşler.
   Erteleme (IS_TURLERI.hava, gizli): Aralık–Şubat haftalarında Perşembe 10:00'da haftanın maçları denetlenir: maç başına olasılık LIG_TAKVIM_TEST.erteleme
     (stat tarifinde kaya yamaca yaslanan kulüplerde katlanır); neden kar ya da fırtına, çok nadir olağanüstü olay. Ertelenen maç f.ertelendi = {tarih,
     dakika, neden} ve f.tarihBekliyor; sonraki programda iki ile beş hafta sonraki ilk boş Çarşamba 20:00'ye konur (iki takımın da önceki ve sonraki gün
     maçı olmayan). Başkanın kulübünün maçı ertelenirse maç günü işi kalkar ve İlerle durur (haber sonucun metninde: durağın özeti).
   Öbür maçlar (IS_TURLERI.ligMaci, gizli; pay LIG_TAKVIM_TEST.macSure dk): başlama saatinde kurulur, maç bitince (başlama + macSure) sonucu yazar
     (macKaydiYaz, kısa kayıt) — havuzdaki sonuç (LIG_MAC_HAVUZU: aynı seçenek ve tohumla daha önce hesaplanmış) ya da sağlayıcı (LIG_MAC_SAGLAYICI;
     araçlar değiştirebilir) ya da motor (Match, js/lig-maclari.js arkaMacOynat; tarayıcıda maç sayfasındaki öbür maçlarla birebir). Sonucu zaten yazılmış
     maç (başkanın maçıyla aynı saatte oynanıp “Odaya dön”le yazılan) atlanır. Maçtan sonra iki kulübün dönüşü gelmiş sakatlıkları temizlenir, sezon
     bittiyse sezon sonu kaydı yazılır.
   Geçmişe {tur:'ligProgram', hafta}, {tur:'macErteleme', macId, neden}, {tur:'macYeniTarih', macId, yeniTarih, yeniDakika} yazılır (gazete ve zaman özeti).
     ligTakvimiKur(k)           yeni kariyer: ilk üç hafta açıklanmış, sıradaki program işi (js/fikstur.js sezonTakvimiKur çağırır)
     haftaAtamasi(k, hafta)     → Map(maçKimliği → {tarih, dakika}) (saf)
     programAcikla(k, hafta, sessiz) · macErtele(k, f, neden) · yeniTarihVer(k) · macGunuEsle(k)
     saatiAciklandi(k, f)       maçın gün ve saati açıklandı mı (ertelenmiş ve tarih bekleyen maçta false)
     ligMacSonucu(k, plan)      → sonucKaydi (havuz, sağlayıcı ya da motor)
     yaklasanLigMaclari(k, hedefAn) → hedef ana dek sonucu yazılacak lig maçı işleri (ekran İlerle'de örtüyü açar) */
'use strict';
const LIG_TAKVIM_TEST={
  sablon:[{gun:-1,dakika:1200},{gun:0,dakika:1020},{gun:0,dakika:1020},{gun:0,dakika:1200},{gun:1,dakika:1020},{gun:1,dakika:1020},{gun:1,dakika:1200},{gun:2,dakika:1200}],
  buyukSlot:[3,6],ikiliSlot:[1,2,4,5],aksamSlot:[3,6],kenarSlot:[0,7],
  bizim:{ikili:0.7,aksam:0.15},     /* başkanın kulübünün maçı: 17:00 (bir maçla), öbür 20:00, kalanı Cuma ya da Pazartesi */
  ilkHaftaDakika:1140,               /* devralınan program: ilk haftanın bütün maçları Cumartesi bu saatte */
  onceden:3,                         /* program kaç hafta önceden açıklanır */
  program:{gun:-5,dakika:600},       /* açıklanan haftadan üç hafta önceki haftanın Cumartesisinden 5 gün önce (Pazartesi) 10:00 */
  erteleme:{aylar:[12,1,2],olasilik:0.025,yamac:2,olaganustu:0.002,gun:-2,dakika:600,kar:0.6},   /* Perşembe 10:00 */
  yeniTarih:{enAz:2,enCok:5,gun:-3,dakika:1200,onceden:7},   /* Çarşamba 20:00; en az onceden gün sonrası */
  macSure:105
};
const LIG_MAC_HAVUZU=new Map();   /* sonuç önbelleği: anahtar (maç, tohum, seçenek) → sonucKaydi; oturum içi, kayda girmez */
const LIG_MAC_HAVUZ_EN_COK=96;
let LIG_MAC_SAGLAYICI=null;       /* (k, plan) → sonucKaydi; null ise motor */
/* belirlenimli 0–1 (FNV-1a + karıştırma): rastlantı akışı çekilmez */
function ligKarma01(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
  h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return(h>>>0)/4294967296;}
const ligBizimKulup=k=>((k.kisiler||{})[k.baskanId]||{}).kulupId||null;
const saatiAciklandi=(k,f)=>!!f&&!f.tarihBekliyor&&(!!f.ertelendi||f.hafta<=((k.sezon||{}).programAciklanan|0));
/* hafta şablonuna atama (saf). Haftanın oynanmamış, ertelenmemiş maçları */
function haftaAtamasi(k,hafta){
  const S=k.sezon,T=LIG_TAKVIM_TEST,cmt=haftaTarihi(S,hafta),biz=ligBizimKulup(k),A=new Map();
  const M=(k.fikstur||[]).filter(f=>f.hafta===hafta&&!(k.maclar||{})[f.id]&&!f.ertelendi);
  if(!M.length)return A;
  if(hafta===S.ilkHafta){for(const f of M)A.set(f.id,{tarih:cmt,dakika:T.ilkHaftaDakika});return A;}
  const r=tohumluRastgele((k.dunyaTohumu^Math.imul(hafta,0x9E3779B1)^0x1D2C3B4A)>>>0);
  const sira=new Map(sezonTablosu(k).map((t,i)=>[t.id,i+1])),puan=f=>(sira.get(f.ev)||99)+(sira.get(f.konuk)||99);
  const B=M.slice().sort((a,b)=>puan(a)-puan(b)||Math.min(sira.get(a.ev),sira.get(a.konuk))-Math.min(sira.get(b.ev),sira.get(b.konuk))||(a.id<b.id?-1:1))[0];
  const bos=new Set(T.sablon.map((_,i)=>i)),yerlestir=(f,i)=>{bos.delete(i);const s=T.sablon[i];A.set(f.id,{tarih:tarihEkle(cmt,s.gun),dakika:s.dakika});};
  const sec=L=>{const F=L.filter(i=>bos.has(i));return F.length?F[Math.floor(r()*F.length)%F.length]:null;};
  const bs=T.buyukSlot[r()<0.5?0:1];yerlestir(B,bs);
  const bizim=M.find(f=>f.ev===biz||f.konuk===biz);
  if(bizim&&bizim!==B){const u=r();let i=u<T.bizim.ikili?sec(T.ikiliSlot):u<T.bizim.ikili+T.bizim.aksam?sec(T.aksamSlot):sec(T.kenarSlot);
    if(i===null)i=sec([...bos]);yerlestir(bizim,i);}
  const kalan=M.filter(f=>!A.has(f.id));
  for(let i=kalan.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[kalan[i],kalan[j]]=[kalan[j],kalan[i]];}
  const S8=[...bos].sort((a,b)=>a-b);kalan.forEach((f,i)=>{if(i<S8.length)yerlestir(f,S8[i]);else A.set(f.id,{tarih:cmt,dakika:T.ilkHaftaDakika});});
  return A;
}
const ligProgramAni=(S,hafta)=>{const P=LIG_TAKVIM_TEST.program;return{tarih:tarihEkle(haftaTarihi(S,hafta-LIG_TAKVIM_TEST.onceden),P.gun),dakika:P.dakika};};
const ligSimdiSonra=(k,t)=>anDakika(t.tarih,t.dakika)>=simdikiAn(k)?t:{tarih:k.tarih,dakika:k.gunIciDakika};
function ligMaciIsiKur(k,f){
  if(f.ev===ligBizimKulup(k)||f.konuk===ligBizimKulup(k)||(k.maclar||{})[f.id]||f.tarihBekliyor)return null;
  if(Object.values(k.isler).some(x=>x.tur==='ligMaci'&&x.veri.macId===f.id))return null;
  const t=ligSimdiSonra(k,{tarih:f.tarih,dakika:f.dakika});
  return isEkle(k,{tur:'ligMaci',tarih:t.tarih,dakika:t.dakika,veri:{macId:f.id}});
}
function programAcikla(k,hafta,sessiz){
  const S=k.sezon;if(!S||hafta>S.haftaSayisi||hafta<=(S.programAciklanan|0))return false;
  const A=haftaAtamasi(k,hafta);
  if(A.size)k.fikstur=k.fikstur.map(f=>A.has(f.id)?Object.assign({},f,A.get(f.id)):f);
  k.sezon=Object.assign({},k.sezon,{programAciklanan:hafta});
  for(const f of k.fikstur)if(f.hafta===hafta)ligMaciIsiKur(k,f);
  /* hava denetimi: haftanın Cumartesisi Aralık–Şubat'taysa Perşembe 10:00 */
  const E=LIG_TAKVIM_TEST.erteleme,cmt=haftaTarihi(k.sezon,hafta);
  if(E.aylar.includes(Number(cmt.slice(5,7)))){const t={tarih:tarihEkle(cmt,E.gun),dakika:E.dakika};
    if(anDakika(t.tarih,t.dakika)>=simdikiAn(k))isEkle(k,{tur:'hava',tarih:t.tarih,dakika:t.dakika,veri:{hafta}});}
  if(!sessiz)k.gecmis.push({tur:'ligProgram',hafta,tarih:k.tarih,dakika:k.gunIciDakika});
  return true;
}
/* yeni kariyer: ilk hafta devralınan programla, sonraki iki hafta şablonla açıklanmış; sıradaki program işi */
function ligTakvimiKur(k){
  const S=k.sezon;if(!S)return;
  k.sezon=Object.assign({},k.sezon,{programAciklanan:S.ilkHafta-1});
  for(let h=S.ilkHafta;h<S.ilkHafta+LIG_TAKVIM_TEST.onceden&&h<=S.haftaSayisi;h++)programAcikla(k,h,true);
  ligProgramIsiKur(k);
}
function ligProgramIsiKur(k){
  const S=k.sezon,h=(S.programAciklanan|0)+1;if(h>S.haftaSayisi)return null;
  const t=ligSimdiSonra(k,ligProgramAni(S,h));
  return isEkle(k,{tur:'program',tarih:t.tarih,dakika:t.dakika,veri:{hafta:h}});
}
/* stat tarifinde kaya yamaç (tribün ya da çevre) */
const ligYamacli=(k,kulupId)=>{try{return JSON.stringify(kulupStatTarifi(k,kulupId)).includes('"yamac"');}catch(e){return false;}};
function macErtele(k,f,neden){
  k.fikstur=k.fikstur.map(x=>x.id===f.id?Object.assign({},x,{ertelendi:{tarih:x.tarih,dakika:x.dakika,neden},tarihBekliyor:true}):x);
  for(const x of Object.values(k.isler))if(x.tur==='ligMaci'&&x.veri.macId===f.id)isIptal(k,x.id,'Maç ertelendi');
  k.gecmis.push({tur:'macErteleme',macId:f.id,neden,tarih:k.tarih,dakika:k.gunIciDakika});
}
/* ertelenmiş ve tarih bekleyen maçlara yeni tarih: iki ile beş hafta sonraki ilk boş Çarşamba (yoksa sezon sonuna dek ilk boş Çarşamba, sonra Salı ya da Perşembe) */
function yeniTarihVer(k){
  const S=k.sezon,Y=LIG_TAKVIM_TEST.yeniTarih,simdi=simdikiAn(k);let n=0;
  const doluMu=(takim,tarih,haric)=>k.fikstur.some(g=>g.id!==haric&&!g.tarihBekliyor&&(g.ev===takim||g.konuk===takim)&&Math.abs(gunNo(g.tarih)-gunNo(tarih))<=1);
  for(const f0 of k.fikstur.filter(f=>f.tarihBekliyor).sort((a,b)=>(a.ertelendi.tarih<b.ertelendi.tarih?-1:a.ertelendi.tarih>b.ertelendi.tarih?1:a.id<b.id?-1:1))){
    const f=k.fikstur.find(x=>x.id===f0.id),aday=[];
    for(const fark of [Y.gun,Y.gun+1,Y.gun-1])for(let w=f.hafta+Y.enAz;w<=S.haftaSayisi;w++){const t=tarihEkle(haftaTarihi(S,w),fark);aday.push({w,t,o:fark===Y.gun?0:1});}
    aday.sort((a,b)=>a.o-b.o||(a.w<=f.hafta+Y.enCok?0:1)-(b.w<=f.hafta+Y.enCok?0:1)||a.w-b.w);
    const s=aday.find(a=>anDakika(a.t,Y.dakika)>=simdi+Y.onceden*1440&&!doluMu(f.ev,a.t,f.id)&&!doluMu(f.konuk,a.t,f.id));
    if(!s)continue;
    k.fikstur=k.fikstur.map(x=>{if(x.id!==f.id)return x;const y=Object.assign({},x,{tarih:s.t,dakika:Y.dakika});delete y.tarihBekliyor;return y;});
    ligMaciIsiKur(k,k.fikstur.find(x=>x.id===f.id));
    k.gecmis.push({tur:'macYeniTarih',macId:f.id,yeniTarih:s.t,yeniDakika:Y.dakika,tarih:k.tarih,dakika:k.gunIciDakika});n++;
  }
  return n;
}
/* başkanın tek bekleyen maç günü işi sıradaki maçla (zamana göre) eş olmalı: değilse kalkar ve yenisi kurulur */
function macGunuEsle(k){
  const biz=ligBizimKulup(k);if(k.gorevDurumu!=='gorevde'||!biz||!k.sezon)return;
  const s=siradakiMac(k,biz),L=Object.values(k.isler).filter(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu');
  for(const x of L)if(!s||x.veri.macId!==s.id||x.tarih!==s.tarih||x.dakika!==s.dakika)isIptal(k,x.id,'Maç programı değişti');
  if(s&&!Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu')&&anDakika(s.tarih,s.dakika)>=simdikiAn(k))macGunuIsiKur(k,s.id);
}
/* lig maçının sonucu: hükmen, havuz, sağlayıcı ya da motor */
const ligMacAnahtari=plan=>{let h=2166136261;const s=JSON.stringify([plan.macId,plan.tohum,plan.secenek]);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return plan.macId+':'+(h>>>0).toString(16)+':'+s.length;};
function ligMacSonucu(k,plan){
  if(plan.hukmen)return hukmenSonucu(plan.hukmen);
  const a=ligMacAnahtari(plan);if(LIG_MAC_HAVUZU.has(a))return LIG_MAC_HAVUZU.get(a);
  let s;
  if(typeof LIG_MAC_SAGLAYICI==='function')s=LIG_MAC_SAGLAYICI(k,plan);
  else if(typeof Match==='function'&&typeof arkaMacOynat==='function')s=arkaMacOynat(Match,plan.secenek,{oncesi:false}).son;
  else throw new Error(`Lig maçı hesaplanamadı (${plan.macId}): maç motoru yüklü değil`);
  LIG_MAC_HAVUZU.set(a,s);
  while(LIG_MAC_HAVUZU.size>LIG_MAC_HAVUZ_EN_COK)LIG_MAC_HAVUZU.delete(LIG_MAC_HAVUZU.keys().next().value);
  return s;
}
/* ekran için: hedef ana dek sonucu yazılacak (henüz yazılmamış) lig maçı işleri */
const yaklasanLigMaclari=(k,hedefAn)=>Object.values(k.isler).filter(x=>x.tur==='ligMaci'&&isSonAn(x)<=hedefAn&&!(k.maclar||{})[x.veri.macId]);

IS_TURLERI.program={gizli:true,
  denetle:(k,v)=>!v||!Number.isInteger(v.hafta)?['program haftası yok']:[],
  baslik:(k,is)=>`TFF ${is.veri.hafta}. hafta programı`,
  uygula:(k,is)=>{const h=is.veri.hafta;programAcikla(k,h);const n=yeniTarihVer(k);macGunuEsle(k);ligProgramIsiKur(k);return{hafta:h,yeniTarih:n};}
};
IS_TURLERI.hava={gizli:true,
  denetle:(k,v)=>!v||!Number.isInteger(v.hafta)?['hava haftası yok']:[],
  baslik:(k,is)=>`${is.veri.hafta}. hafta hava denetimi`,
  uygula:(k,is)=>{
    const E=LIG_TAKVIM_TEST.erteleme,biz=ligBizimKulup(k),R=[];let bizim=false;
    for(const f of k.fikstur.filter(x=>x.hafta===is.veri.hafta&&!(k.maclar||{})[x.id]&&!x.ertelendi)){
      if(!E.aylar.includes(Number(f.tarih.slice(5,7))))continue;
      const p=E.olasilik*(ligYamacli(k,f.ev)?E.yamac:1),u=ligKarma01(`${k.dunyaTohumu>>>0}:${f.id}:hava`);
      const neden=u<p?(ligKarma01(`${k.dunyaTohumu>>>0}:${f.id}:neden`)<E.kar?'kar':'firtina'):u<p+E.olaganustu?'olaganustu':null;
      if(!neden)continue;
      macErtele(k,f,neden);R.push(f.id);if(f.ev===biz||f.konuk===biz)bizim=true;
    }
    /* bizim maç ertelendiyse İlerle durur; haber durağın özetinde (metin; ayrı hatırlatma işi durağın arkasında bekleyen iş olarak kalırdı) */
    if(!bizim)return{hafta:is.veri.hafta,ertelenen:R};
    macGunuEsle(k);const f=k.fikstur.find(x=>R.includes(x.id)&&(x.ev===biz||x.konuk===biz)),ad=id=>(k.kulupler[id]||{ad:id}).ad;
    return{hafta:is.veri.hafta,ertelenen:R,dur:true,metin:LIG_TAKVIM_METIN.bizimErteleme(ad(f.ev),ad(f.konuk),f.ertelendi.neden)};
  }
};
IS_TURLERI.ligMaci={gizli:true,pay:LIG_TAKVIM_TEST.macSure,
  denetle:(k,v)=>!v||typeof v.macId!=='string'||!(k.fikstur||[]).some(f=>f.id===v.macId)?[`lig maçı fikstürde yok (${v&&v.macId})`]:[],
  baslik:(k,is)=>{const f=(k.fikstur||[]).find(x=>x.id===is.veri.macId),ad=id=>(k.kulupler[id]||{ad:id}).ad;return f?`${ad(f.ev)} – ${ad(f.konuk)}`:is.veri.macId;},
  uygula:(k,is)=>{
    const f=k.fikstur.find(x=>x.id===is.veri.macId);
    if(!f||(k.maclar||{})[f.id]||f.tarihBekliyor)return{macId:is.veri.macId,atlandi:true};
    const P=digerMacPlani(k,f),s=ligMacSonucu(k,P);
    macKaydiYaz(k,f,s,P.tohum,{},true);
    const temiz={};
    for(const c of [f.ev,f.konuk])for(const p of kulupOyunculari(k,c))if(p.sakat&&tarihKarsilastir(p.sakat.donus,k.tarih)<=0)temiz[p.id]=Object.assign({},p,{sakat:null});
    if(Object.keys(temiz).length)k.oyuncular=Object.assign({},k.oyuncular,temiz);
    sezonSonuYaz(k);
    return{macId:f.id,skor:k.maclar[f.id].skor.slice()};
  }
};
/* TEST metinleri (kullanıcı değiştirir) */
const LIG_ERTELEME_NEDEN={kar:'kar',firtina:'fırtına',olaganustu:'olağanüstü bir olay'};
const LIG_TAKVIM_METIN={
  bizimErteleme:(ev,konuk,n)=>`Maç ertelendi: ${ev} – ${konuk} (${LIG_ERTELEME_NEDEN[n]||n}). Yeni tarihi TFF'nin programı açıklayacak.`
};
/* gazete (js/gazete.js): haftanın programı (kutu), erteleme ve yeni tarih; önemler TEST */
GAZETE_KAYNAKLARI.push({ad:'ligTakvimi',haberler:(k,P)=>{
  const L=[],bizde=f=>!!f&&(f.ev===P.biz||f.konuk===P.biz),bul=id=>(k.fikstur||[]).find(f=>f.id===id);
  for(const g of k.gecmis||[]){const an=anDakika(g.tarih,g.dakika);if(an<P.bas||an>=P.son)continue;
    if(g.tur==='ligProgram')L.push({onem:30,an,anahtar:'gz.program',kutu:true,p:{hafta:g.hafta}});
    else if(g.tur==='macErteleme')L.push({onem:bizde(bul(g.macId))?95:40,an,anahtar:'gz.erteleme',p:{macId:g.macId,neden:g.neden}});
    else if(g.tur==='macYeniTarih')L.push({onem:bizde(bul(g.macId))?55:20,an,anahtar:'gz.yeniTarih',p:{macId:g.macId,tarih:g.yeniTarih,dakika:g.yeniDakika}});}
  return L;}});
const ligGzAd=(k,id)=>(k.kulupler[id]||{ad:id}).ad;
Object.assign(MESELE_OLAYLARI,{
  'gz.program':(k,p)=>{const F=(k.fikstur||[]).filter(f=>f.hafta===p.hafta&&!f.ertelendi).sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika));
    return`TEST: TFF ${p.hafta}. haftanın programını açıkladı: `+F.map(f=>`${macGunAdi(f.tarih)} ${saatYazi(f.dakika)} ${ligGzAd(k,f.ev)} – ${ligGzAd(k,f.konuk)}`).join('; ')+'.';},
  'gz.erteleme':(k,p)=>{const f=(k.fikstur||[]).find(x=>x.id===p.macId);return f?`TEST: ${ligGzAd(k,f.ev)} – ${ligGzAd(k,f.konuk)} maçı ${LIG_ERTELEME_NEDEN[p.neden]||p.neden} nedeniyle ertelendi.`:'TEST: bir maç ertelendi.';},
  'gz.yeniTarih':(k,p)=>{const f=(k.fikstur||[]).find(x=>x.id===p.macId);return f?`TEST: Ertelenen ${ligGzAd(k,f.ev)} – ${ligGzAd(k,f.konuk)} maçı ${gunAyYazi(p.tarih)} ${macGunAdi(p.tarih)} ${typeof saatBulunma==='function'?saatBulunma(p.dakika):saatYazi(p.dakika)} oynanacak.`:'TEST: ertelenen maçın yeni tarihi açıklandı.';}
});
/* doğrulama: program haftası ve lig maçı işleri */
function ligTakvimiDogrula(k,h){
  const S=k.sezon;if(!S||S.programAciklanan===undefined)return;
  if(!Number.isInteger(S.programAciklanan)||S.programAciklanan<S.ilkHafta-1||S.programAciklanan>S.haftaSayisi)h.push(`Lig takvimi: açıklanan program haftası geçersiz (${S.programAciklanan})`);
  for(const x of Object.values(k.isler||{}))if(x&&x.tur==='ligMaci'){const f=(k.fikstur||[]).find(y=>y.id===x.veri.macId);
    if(f&&!f.tarihBekliyor&&!(k.maclar||{})[f.id]&&(x.tarih!==f.tarih||x.dakika!==f.dakika)&&anDakika(x.tarih,x.dakika)<anDakika(f.tarih,f.dakika))h.push(`Lig takvimi: ${f.id} işi maçın saatinden önce`);}
}
EK_DENETIMLER.push(ligTakvimiDogrula);
