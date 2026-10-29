/* ============ Chairman — transfer piyasası: serbest oyuncular, oyuncunun geçmişi, piyasa okumaları, takip (çizim yok; R4-f, 2026-10-29) ============
   Tasarım araclar/plan/transfer-tasarim.md §3, §10; plan araclar/plan/r4-uygulama.md R4-f, R4-k.
   Serbest havuz (TEST üretim): serbestHavuzKur(k) yeni kariyerde ve eski kayıtta ilk fırsatta bir kez (k.transfer.havuz; transferTakvimiKur'dan) mevkilere
     dağılmış serbest oyuncular kurar (kulupId null, sözleşmesiz). Her birinde serbest:{tarih} (ne zamandan beri boşta) ve gizli hal (boşta kaldıkça
     düşük form; S-a). Ayrı rastlantı akışı ('serbest:havuz'); öbür üretimleri değiştirmez (kimlik sayacı ilerler, rastlantı akışları kimlikten bağımsız).
   Geçmiş ve ün: öne çıkan serbestlerde un:{yil, mac, gol, yer} — en iyi yılı ve o yılki sayıları; yer ligdeki bir kulübün kimliği ya da genel tarif
     anahtarı (UN_YERLERI). KULÜP ADI UYDURULMAZ. Ünü olan, yaşı ileri, formu düşük, maaş beklentisi yüksek oyuncu “düşüşteki eski yıldız”dır.
   Piyasa okumaları (saf): serbestSuresi(k, p) → gün | null, satilikSinyali(k, p) → metin | null (kulübünde forma bulamıyor ve mevkide fazlası var),
     sozlesmeBitiyor(k, p), piyasaListesi(k) → {serbest, satilik, bitiyor} (bizim kulüp hariç; sıralı, sınırlı).
   Takip ve izleme (kayıtta isteğe bağlı k.transfer = {havuz, takip:[{oyuncuId, tarih, kaynak}], izlenen:[{oyuncuId, tarih, kanaat}]}):
     takibeAl(k, oyuncuId, kaynak) / takiptenCikar(k, oyuncuId) — menü (karar değil); kayıt komutudur, zaman almaz.
   Bütün sayılar TEST. */
'use strict';
const SERBEST_TEST={sayi:24,mevki:[['KL',2],['DEF',8],['OS',8],['FV',6]],yas:[20,33],ay:[1,14],guc:[-8,8],yildiz:4,yildizYas:[30,34],yildizGuc:9,
  formAy:6,formEn:-60,listeEnCok:12};
const UN_YERLERI={ust:'1. Lig\'de bir kulüp',yurtdisi:'yurt dışında bir kulüp',ikinci:'2. Lig\'de bir kulüp'};
const gunFarki=(a,b)=>Math.round((anDakika(b,0)-anDakika(a,0))/1440);
const kariyerTransfer=k=>k.transfer||(k.transfer={havuz:false,takip:[],izlenen:[]});

function serbestHavuzKur(k){
  if(!k.sezon||!Array.isArray(k.sezon.takimlar)||(k.transfer&&k.transfer.havuz))return 0;
  const T=SERBEST_TEST,r=kadroRastgele(k.dunyaTohumu,'serbest:havuz'),S=kadroSablonu();
  const gucler=k.sezon.takimlar.map(c=>kulupGucu(LIG,c)),ort=gucler.reduce((a,b)=>a+b,0)/gucler.length;
  const adlar=karistirR(r,ADLAR_TEST.slice());   /* havuz içinde adlar tekrarlanmaz (ligde aynı ad olabilir) */
  const mevkiler=T.mevki.flatMap(([m,n])=>Array(n).fill(m)),takimlar=k.sezon.takimlar;
  k.oyuncular=Object.assign({},k.oyuncular);
  const L=[];
  mevkiler.forEach((m,i)=>{
    const yildiz=i%Math.floor(mevkiler.length/T.yildiz)===1&&m!=='KL'&&L.filter(x=>x.un).length<T.yildiz;
    const g=ort+T.guc[0]+(T.guc[1]-T.guc[0])*r()+(yildiz?T.yildizGuc:0);
    const p=oyuncuUret(r,{mevki:m,sablon:S.mevki[m],guc:g,yedek:false,yas:yildiz?T.yildizYas:T.yas,ad:adlar[i%adlar.length],no:2+Math.floor(r()*38),sol:r()<0.2});
    const ay=T.ay[0]+Math.floor(r()*(T.ay[1]-T.ay[0]+1));
    p.serbest={tarih:tarihEkle(k.tarih,-ay*30)};p.sozlesme=null;
    if(yildiz){const geri=3+Math.floor(r()*5),yer=r()<0.5?'ust':r()<0.5?'yurtdisi':takimlar[Math.floor(r()*takimlar.length)];
      p.un={yil:Number(k.tarih.slice(0,4))-geri,mac:24+Math.floor(r()*12),gol:m==='FV'?10+Math.floor(r()*12):m==='OS'?4+Math.floor(r()*7):1+Math.floor(r()*3),yer};}
    const id=oyuncuEkle(k,null,p);
    k.oyuncular[id].hal={kon:100,gun:k.tarih,form:Math.max(T.formEn,-T.formAy*ay),gel:0,tav:tavanKur(k,k.oyuncular[id],k.tarih)};
    L.push(k.oyuncular[id]);
  });
  kariyerTransfer(k).havuz=true;
  return L.length;
}
/* serbest süre (gün): havuzdan gelende serbest.tarih, sözleşmesi bitip ayrılanda son ayrılış kaydı */
function serbestSuresi(k,p){
  if(!p||p.kulupId!==null)return null;
  let t=p.serbest?p.serbest.tarih:null;
  if(!t)for(let i=(k.gecmis||[]).length-1;i>=0;i--){const g=k.gecmis[i];if(g&&g.oyuncuId===p.id&&(g.tur==='ayrilis'||g.tur==='transfer')){t=g.tarih;break;}}
  return t?Math.max(0,gunFarki(t,k.tarih)):null;
}
const unYeri=(k,un)=>UN_YERLERI[un.yer]||((k.kulupler[un.yer]||{}).ad)||'bir kulüp';
const unMetni=(k,p)=>p&&p.un?`En iyi yılı ${p.un.yil}: ${unYeri(k,p.un)} formasıyla ${p.un.mac} maç, ${p.un.gol} gol.`:null;
/* düşüşteki eski yıldız: ünü var, 30 yaş ve üstü, uzun süredir boşta */
const eskiYildizMi=(k,p)=>!!(p&&p.un&&p.kulupId===null&&oyuncuYasi(p,k.tarih)>=30);
function satilikSinyali(k,p){
  if(!p||!p.kulupId||p.kulupId===bizimKulup(k))return null;
  const D=k.kulupler[p.kulupId].kadro;if(!D||D.ilk11.includes(p.id))return null;
  const ayni=D.yedekler.filter(id=>(k.oyuncular[id]||{}).mevki===p.mevki).length;
  return ayni>=2?'Kulübünde forma bulamıyor; o mevkide oyuncuları fazla.':null;
}
const sozlesmeBitiyor=(k,p)=>!!(p&&p.kulupId&&p.kulupId!==bizimKulup(k)&&p.sozlesme&&p.sozlesme.bitis<=`${sezonBitisYili(k)}-06-30`);
function piyasaListesi(k){
  const T=SERBEST_TEST,biz=bizimKulup(k),O=Object.values(k.oyuncular),deger=p=>oyuncuDegeri(p,k.tarih);
  const serbest=O.filter(p=>p.kulupId===null).sort((a,b)=>(eskiYildizMi(k,b)-eskiYildizMi(k,a))||(serbestSuresi(k,a)||0)-(serbestSuresi(k,b)||0)||(a.id<b.id?-1:1));
  const satilik=O.filter(p=>p.kulupId&&p.kulupId!==biz&&satilikSinyali(k,p)).sort((a,b)=>deger(b)-deger(a)||(a.id<b.id?-1:1)).slice(0,T.listeEnCok);
  const bitiyor=O.filter(p=>sozlesmeBitiyor(k,p)&&!satilikSinyali(k,p)).sort((a,b)=>deger(b)-deger(a)||(a.id<b.id?-1:1)).slice(0,T.listeEnCok);
  return{serbest,satilik,bitiyor};
}
/* ---- takip (menü; kayıt komutu, zaman almaz) ---- */
const takipte=(k,id)=>!!(k.transfer&&k.transfer.takip.some(x=>x.oyuncuId===id));
function takibeAl(k,id,kaynak){
  const p=k.oyuncular[id];if(!p)throw new Error(`Oyuncu bulunamadı: ${id}`);
  if(p.kulupId&&p.kulupId===bizimKulup(k))throw new Error(`${p.ad} zaten bizim oyuncumuz`);
  const T=kariyerTransfer(k);if(T.takip.some(x=>x.oyuncuId===id))return false;
  T.takip=T.takip.concat([{oyuncuId:id,tarih:k.tarih,kaynak:kaynak||'baskan'}]);return true;
}
function takiptenCikar(k,id){const T=kariyerTransfer(k),n=T.takip.length;T.takip=T.takip.filter(x=>x.oyuncuId!==id);return T.takip.length<n;}
const izlemeKaydi=(k,id)=>k.transfer?k.transfer.izlenen.filter(x=>x.oyuncuId===id).slice(-1)[0]||null:null;

/* ---- doğrulama ---- */
function piyasaDogrula(k,h){
  const O=k.oyuncular||{},duz=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
  for(const p of Object.values(O)){
    if(!p)continue;const ad=`Oyuncu ${p.id}`;
    if(p.serbest!==undefined&&!(duz(p.serbest)&&tarihGecerliMi(p.serbest.tarih)))h.push(`${ad}: serbest kaydı geçersiz`);
    if(p.un!==undefined&&!(duz(p.un)&&Number.isInteger(p.un.yil)&&Number.isInteger(p.un.mac)&&Number.isInteger(p.un.gol)&&(UN_YERLERI[p.un.yer]||(k.kulupler||{})[p.un.yer])))h.push(`${ad}: ün kaydı geçersiz`);
    if(p.tescil!==undefined&&!(duz(p.tescil)&&tarihGecerliMi(p.tescil.tarih)))h.push(`${ad}: tescil kaydı geçersiz`);
  }
  const T=k.transfer;if(T===undefined)return;
  if(!duz(T)){h.push('Transfer kaydı nesne değil');return;}
  if(typeof T.havuz!=='boolean')h.push('Transfer: havuz bayrağı yok');
  if(!Array.isArray(T.takip)||!T.takip.every(x=>duz(x)&&O[x.oyuncuId]&&tarihGecerliMi(x.tarih)&&typeof x.kaynak==='string'))h.push('Transfer: takip listesi geçersiz');
  if(!Array.isArray(T.izlenen)||!T.izlenen.every(x=>duz(x)&&O[x.oyuncuId]&&tarihGecerliMi(x.tarih)&&['ilk','rotasyon','az'].includes(x.kanaat)))h.push('Transfer: izleme listesi geçersiz');
}
EK_DENETIMLER.push(piyasaDogrula);
