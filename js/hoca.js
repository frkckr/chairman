/* ============ Chairman — teknik direktör: hoca kişisi, tarzı ve maç kadrosu seçimi (çizim yok; F3-a, 2026-10-24) ============
   OYUN_TASARIMI §2, §8 "Teknik direktör", §9; hoca tarzları kutuphane/G. Başkan maça ve kadroya dokunmaz: kadroyu ve tarzı hoca seçer, başkan
   maçı izleyip okur. Hoca gerçek özellikleri kusursuz bilen bir seçim makinesi değildir; sürekli rastgele hata yapan biri de değildir.
   Hoca bir kişidir (k.kisiler): {id, ad, rol:'teknikDirektor', dogumTarihi, kulupId, durum, hoca:{tarz, bilgi, israr}}; kulübün hocası kulup.hocaId.
     tarz: takımın oynadığı arketip (HOCA_TARZLARI; js/mac-tarz.js TARZ_ARKETIP adları). Maça secenek.tarz [ev, konuk] olarak girer (js/mac-girdi.js);
       F3'ten önce kariyer maçı tarzı tohumdan çekiyordu ('dagilim'). Maç içi tarz değişikliği (m.hoca kapısı, tarzDegistir) Z7-2'ye kalır.
     bilgi (0–1): oyuncularını ne kadar doğru tanıdığı. Düşükse değerlendirmesi kalıcı yanılgılar taşır (aynı hoca aynı oyuncu hakkında her maç
       aynı yanılgıda; yeni hoca başka gözle bakar).
     israr (0–1): son maçın on birine bağlılığı.
   Gizli puan kuralı (OYUN_TASARIMI §9): bilgi ve israr gösterilmez (TEST bilgileri ayarı hariç); ekranda hocanın adı ve tarzının adı vardır.
   TEST değerleri (Claude, 2026-10-24): Demirkapı ve Akdeniz'in hocası js/kadrolar.js'teki td.ad ve taktik.tarz'dan (bilgi, israr HOCA_TEST'ten);
     öbür 14 kulübünkü dünya tohumundan (ad kadro üretiminin td.ad'ı, js/adlar-test.js; tarz HOCA_TARZ_PAYI ile — motorun TARZ_DAGILIM'ının payları,
     Node denemeleri motoru yüklemeden aynı sonucu alsın diye burada ayrıca yazılı). Kariyerin kayıtlı rastlantısı (k.rastlanti) çekilmez.
   hocaKadroSec(k, kulupId, tarih, tohum) → {ilk11:[11 kimlik], kulube:[≤ MAC_YEDEK_SAYISI kimlik]} (saf, belirlenimci):
     1. o gün uygun oyuncular (oyuncuUygunMu: cezasız, sakatlığı bitmiş);
     2. dizilişin yuvaları motordaki sırayla roldür (HOCA_YUVALAR: kaleci, bek, stoper, kanat, merkez, forvet…; sol ya da sağ taraf);
     3. hocanın oyuncuyu yuvada değerlendirmesi = rolün özellik ağırlıkları (HOCA_ROL) + tarzın tercihi (HOCA_TARZ_AGIRLIK) ile oz'un toplamı
        + (1 − bilgi) × HOCA_YANILGI × kalıcı yanılgı (hoca × oyuncu kimliğinden) + HOCA_FORM × günün farkı (maç tohumu × oyuncu)
        + israr × HOCA_ISRAR (son on birde aynı yuvadaysa; başka yuvadaysa yarısı) − HOCA_MEVKI_DISI (asıl hattı dışında; kaleci için
        HOCA_KALECI_DISI) + yuvanın tarafına ayak uyumu (bekte HOCA_AYAK, kanatta yarısı) + stoperde boy;
     4. en yüksek oyuncu–yuva çifti sırayla yerleşir (motorun mevki nesneleri dizideki sıradan okunur); 5. kulübe: kaleci ve her hattan en iyi
        değerlendirilen, kalanlar sırayla (kaleci başta). Kadronun ilk11'i "son maçın on biri"dir: sonuç komutu her maçtan sonra onu yazar
        (js/mac-sonuc.js, F3-a).
   Kurulum hocalariKur(k) (js/baslangic.js, kadrolardan sonra); doğrulama hocaDogrula (EK_DENETIMLER). Kayıt sürümü 8 (js/kariyer.js). */
'use strict';
const HOCA_TARZLARI=['dengeli','konumsal','iliskisel','dikey','kanatOrta','direkt'];
const HOCA_TARZ_PAYI=[['dikey',22],['iliskisel',18],['konumsal',17],['direkt',15],['kanatOrta',15],['dengeli',13]];
const HOCA_TEST={demirkapi:{bilgi:0.6,israr:0.7,dogumTarihi:'1961-03-09'},akdeniz:{bilgi:0.65,israr:0.4,dogumTarihi:'1968-08-21'}};
/* dizilişin yuvaları, motordaki oyuncu sırasıyla (js/mac-dizilis.js DIZILISLER mevkiler): rol ve taraf. Hat (KL, DEF, OS, FV) rolden gelir */
const HOCA_YUVALAR={
  '4-4-2':['KL','bek:sag','stoper','stoper','bek:sol','kanat:sag','merkez','merkez','kanat:sol','forvet','forvet'],
  '4-2-3-1':['KL','bek:sag','stoper','stoper','bek:sol','kanat:sag','merkez','merkez','kanat:sol','forvet','onOrta'],
  '4-3-3':['KL','bek:sag','stoper','stoper','bek:sol','merkez','merkez','merkez','kanatForvet:sag','forvet','kanatForvet:sol']
};
/* rolün hattı ve değerlendirmenin özellik ağırlıkları, oz sırasıyla: hız, pas, şut, kafa, top sürme, müdahale, görüş, karar, kalecilik,
   dayanıklılık, sertlik (TEST; kanat hızı ve sürüşü, stoper kafayı ve müdahaleyi, merkez pası ve görüşü öne alır) */
const HOCA_ROL={
  KL:         {cizgi:'KL', w:[0,0.05,0,0.05,0,0,0,0.1,0.8,0,0]},
  bek:        {cizgi:'DEF',w:[0.2,0.12,0,0.05,0.08,0.25,0,0.1,0,0.12,0.05]},
  stoper:     {cizgi:'DEF',w:[0.08,0.08,0,0.25,0,0.3,0.05,0.14,0,0,0.1]},
  kanat:      {cizgi:'OS', w:[0.22,0.14,0.08,0,0.2,0,0.1,0.1,0,0.1,0]},
  merkez:     {cizgi:'OS', w:[0.04,0.24,0.05,0,0.08,0.12,0.18,0.16,0,0.12,0]},
  onOrta:     {cizgi:'OS', w:[0.06,0.22,0.14,0,0.14,0,0.22,0.16,0,0.04,0]},
  forvet:     {cizgi:'FV', w:[0.14,0.05,0.3,0.16,0.12,0,0.06,0.14,0,0,0]},
  kanatForvet:{cizgi:'FV', w:[0.22,0.08,0.2,0,0.22,0,0.08,0.12,0,0.06,0]}
};
const HOCA_HAT_ROLU={KL:'KL',DEF:'stoper',OS:'merkez',FV:'forvet'};   // kulübe sırası için oyuncunun hattının genel rolü
const HOCA_AYAK=3;          // bekte ayağın yuvanın tarafına uyması (sol bekte sol ya da iki ayak); kanatta yarısı (ters ayaklı kanat olağandır)
/* tarzın tercihi: saha oyuncularında ağırlığa eklenir ({özellik sırası: ek}); kalecide yoktur */
const HOCA_TARZ_AGIRLIK={
  dengeli:{},
  konumsal:{1:0.06,6:0.05,4:0.02},
  iliskisel:{1:0.05,4:0.05,6:0.03},
  dikey:{0:0.05,1:0.03,6:0.03},
  kanatOrta:{0:0.04,3:0.05,1:0.03},
  direkt:{3:0.06,0:0.04,10:0.03}
};
const HOCA_YANILGI=12;      // bilgi 0'daki kalıcı yanılgının ölçeği (özellik puanı; bilgi 1'de yanılgı yok)
const HOCA_FORM=1.5;        // maç başına küçük fark (hocanın o hafta antrenmanda gördüğü; maç tohumundan)
const HOCA_ISRAR=6;         // son on birde olmanın en büyük payı (israr 1)
const HOCA_MEVKI_DISI=15;   // asıl mevkisi dışında oynatmanın bedeli
const HOCA_KALECI_DISI=60;  // kaleciyi sahaya ya da saha oyuncusunu kaleye koymanın bedeli

/* kulübün hocası (kişi kaydı) ya da null */
const kulupHocasi=(k,kulupId)=>{const c=k.kulupler[kulupId],h=c&&c.hocaId?k.kisiler[c.hocaId]:null;return h&&h.hoca?h:null;};
/* yeni hoca kişisi; kimliğini döndürür. o: {ad, tarz, bilgi, israr, dogumTarihi} */
function hocaKur(k,kulupId,o){
  if(!HOCA_TARZLARI.includes(o.tarz))throw new Error(`Hoca kurulamadı: bilinmeyen tarz ${o.tarz}`);
  const id=kimlikUret(k,'kisi');
  k.kisiler[id]={id,ad:o.ad,rol:'teknikDirektor',dogumTarihi:o.dogumTarihi,kulupId,durum:'aktif',hoca:{tarz:o.tarz,bilgi:o.bilgi,israr:o.israr}};
  k.kulupler[kulupId].hocaId=id;
  return id;
}
/* kadrosu olan her kulübe hoca (kulüp sırasıyla; başkanın kulübü önce) */
function hocalariKur(k){
  for(const [id,c] of Object.entries(k.kulupler)){
    if(!c.kadro||c.hocaId)continue;
    const r=kadroRastgele(k.dunyaTohumu,id+':hoca'),T=HOCA_TEST[id],KD=typeof KADROLAR!=='undefined'?KADROLAR[id]:null;
    const tarz=KD&&KD.taktik&&HOCA_TARZLARI.includes(KD.taktik.tarz)?KD.taktik.tarz:agirlikliSec(r,HOCA_TARZ_PAYI);
    const yas=44+Math.floor(r()*20),ay=1+Math.floor(r()*12),gun=1+Math.floor(r()*28),iki=n=>String(n).padStart(2,'0');
    hocaKur(k,id,{ad:c.kadro.td.ad,tarz,bilgi:T?T.bilgi:+(0.45+r()*0.35).toFixed(2),israr:T?T.israr:+(0.2+r()*0.6).toFixed(2),
      dogumTarihi:T?T.dogumTarihi:`${2026-yas}-${iki(ay)}-${iki(gun)}`});
  }
}
/* [-1, 1] aralığında, ortası sık iki zarlık sayı (tohum + ek metinden) */
const hocaZar=(tohum,ek)=>{const r=kadroRastgele(tohum,ek);return r()+r()-1;};
/* dizilişin yuvaları [{rol, taraf}] — HOCA_YUVALAR'da olmayan dizilişte hatlardan genel roller (dizilisMevkileri) */
function hocaYuvalari(dizilis){
  const Y=HOCA_YUVALAR[dizilis];if(Y)return Y.map(s=>{const [rol,taraf]=s.split(':');return{rol,taraf:taraf||null};});
  const M=dizilisMevkileri(dizilis);return M?M.map(m=>({rol:HOCA_HAT_ROLU[m],taraf:null})):null;
}
/* hocanın oyuncuyu bir yuvada değerlendirmesi (saf). Y: {rol, taraf}; yer: oyuncu son on birde bu yuvadaysa 1, başka yuvadaysa 0,5, değilse 0 */
function hocaDegeri(k,h,p,Y,tohum,yer){
  const H=h.hoca,R=HOCA_ROL[Y.rol],w=R.w,ek=R.cizgi==='KL'?null:HOCA_TARZ_AGIRLIK[H.tarz];
  let v=0;for(let j=0;j<11;j++)v+=(w[j]+(ek&&ek[j]||0))*p.oz[j];
  v+=(1-H.bilgi)*HOCA_YANILGI*hocaZar(k.dunyaTohumu,`${h.id}:${p.id}:yanilgi`);
  v+=HOCA_FORM*hocaZar(tohum,`${p.id}:form`);
  v+=yer*H.israr*HOCA_ISRAR;
  if(p.mevki!==R.cizgi)v-=(p.mevki==='KL')!==(R.cizgi==='KL')?HOCA_KALECI_DISI:HOCA_MEVKI_DISI;
  if(Y.taraf){const uyar=Y.taraf==='sol'?p.ayak!=='sag':p.ayak!=='sol';v+=(uyar?1:-1)*(Y.rol==='bek'?HOCA_AYAK:HOCA_AYAK/2);}
  if(Y.rol==='stoper')v+=((p.boy||1)-1)*20;
  return v;
}
function hocaKadroSec(k,kulupId,tarih,tohum){
  const c=k.kulupler[kulupId],D=c&&c.kadro,h=kulupHocasi(k,kulupId);
  if(!D)throw new Error(`Maç kadrosu kurulamadı: ${kulupId} kulübünün kadrosu yok`);
  if(!h)throw new Error(`Maç kadrosu kurulamadı: ${c.ad} kulübünün hocası yok`);
  const Y=hocaYuvalari(D.taktik.dizilis);
  if(!Y)throw new Error(`Maç kadrosu kurulamadı: ${c.ad} dizilişi geçersiz`);
  const uygun=kulupOyunculari(k,kulupId).filter(p=>oyuncuUygunMu(p,tarih));
  if(uygun.length<11)throw new Error(`Maç kadrosu kurulamadı: ${c.ad} on bir uygun oyuncu çıkaramıyor`);
  /* oyuncu × yuva değerleri; en yüksek çift sırayla yerleşir (eşitlikte yuva sırası, sonra kimlik) */
  const yer=(p,i)=>D.ilk11[i]===p.id?1:D.ilk11.includes(p.id)?0.5:0,C=[];
  for(let i=0;i<Y.length;i++)for(const p of uygun)C.push({i,p,v:hocaDegeri(k,h,p,Y[i],tohum,yer(p,i))});
  C.sort((a,b)=>b.v-a.v||a.i-b.i||(a.p.id<b.p.id?-1:1));
  const ilk=Array(Y.length).fill(null),secildi=new Set();
  for(const x of C){if(ilk[x.i]||secildi.has(x.p.id))continue;ilk[x.i]=x.p.id;secildi.add(x.p.id);}
  /* kulübe: kaleci ve her hattan biri (en iyi değerlendirilen), kalan koltuklar değerlendirmeyle; kaleci başta */
  const kalan=uygun.filter(p=>!secildi.has(p.id)),dk=p=>hocaDegeri(k,h,p,{rol:HOCA_HAT_ROLU[p.mevki],taraf:null},tohum,0);
  const sirali=kalan.map(p=>({p,v:dk(p)})).sort((a,b)=>b.v-a.v||(a.p.id<b.p.id?-1:1)).map(x=>x.p),kulube=[];
  for(const m of OYUNCU_MEVKILERI){const x=sirali.find(p=>p.mevki===m);if(x&&kulube.length<MAC_YEDEK_SAYISI)kulube.push(x);}
  for(const p of sirali)if(kulube.length<MAC_YEDEK_SAYISI&&!kulube.includes(p))kulube.push(p);
  const kl=kulube.find(p=>p.mevki==='KL'),kulubeSira=kl?[kl,...kulube.filter(p=>p!==kl)]:kulube;
  return{ilk11:ilk,kulube:kulubeSira.map(p=>p.id)};
}
/* doğrulama (EK_DENETIMLER): kadrosu olan her kulübün etkin bir hocası; hoca kaydının alanları */
function hocaDogrula(k,h){
  const K=k.kulupler||{},P=k.kisiler||{},oran=x=>typeof x==='number'&&x>=0&&x<=1;
  for(const [id,c] of Object.entries(K)){
    if(!c||c.kadro===undefined)continue;
    const p=P[c.hocaId],ad=`Kulüp ${id}`;
    if(!p){h.push(`${ad}: hocası yok (hocaId ${c.hocaId})`);continue;}
    if(p.rol!=='teknikDirektor'||p.kulupId!==id||p.durum!=='aktif')h.push(`${ad}: hocası ${p.id} bu kulübün etkin teknik direktörü değil`);
  }
  for(const p of Object.values(P)){
    if(!p||p.hoca===undefined){if(p&&p.rol==='teknikDirektor'&&p.durum==='aktif'&&K[p.kulupId]&&K[p.kulupId].kadro!==undefined)h.push(`Kişi ${p.id}: teknik direktör fakat hoca kaydı yok`);continue;}
    const H=p.hoca,ad=`Kişi ${p.id} (hoca)`;
    if(p.rol!=='teknikDirektor')h.push(`${ad}: hoca kaydı yalnız teknik direktörde olur (${p.rol})`);
    if(!H||typeof H!=='object'||!HOCA_TARZLARI.includes(H.tarz)||!oran(H.bilgi)||!oran(H.israr))h.push(`${ad}: tarz, bilgi ya da ısrar geçersiz`);
    else if(typeof TARZ_ARKETIP!=='undefined'&&!TARZ_ARKETIP[H.tarz])h.push(`${ad}: tarz motorda yok (${H.tarz})`);
    if(p.durum==='aktif'&&K[p.kulupId]&&K[p.kulupId].kadro!==undefined&&K[p.kulupId].hocaId!==p.id)h.push(`${ad}: etkin fakat kulübünün hocası olarak kayıtlı değil`);
  }
}
EK_DENETIMLER.push(hocaDogrula);
