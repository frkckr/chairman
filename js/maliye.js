/* ============ Chairman — maliye: kulübün parası, para hareketleri ve gelecekteki ödemeler (çizim yok) ============
   Bütün tutarlar kuruş cinsinden tamsayıdır (1 ₺ = 100); kayan nokta kullanılmaz. Gelir artı, gider eksi işaretlidir.
   Kulüp: acilisNakit (kariyer başındaki para) ve nakit (şu anki para). nakit = acilisNakit + o kulübün hareketlerinin toplamı.
   Para hareketi (k.hareketler): {id:'hareket-N', kulupId, tarih, dakika, tutar, kalem, aciklama, kaynak}.
     kaynak: hareketi doğuran işin kimliği ('is-N') ya da null. Aynı kaynak ikinci kez işlenemez.
   Gelecekteki ödeme = takvimdeki 'odeme' türü bekleyen iş. Zamanı gelince bir kez para hareketine dönüşür.
     Mevcut para (nakit) ile henüz ödenmemiş taahhütler bu yüzden ayrı durur; maliDurum ikisini birlikte özetler. */

/* hareket bilgilerinin denetimi (kimlik ve tarih hariç): hata listesi */
function hareketDenetle(k,v){
  const h=[];
  if(!v||typeof v!=='object')return['ödeme bilgisi yok'];
  if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);
  if(!Number.isSafeInteger(v.tutar)||v.tutar===0)h.push(`tutar sıfırdan farklı tamsayı kuruş olmalı (${v.tutar})`);
  if(typeof v.kalem!=='string'||!v.kalem)h.push('kalem yok');
  if(typeof v.aciklama!=='string')h.push('açıklama metin değil');
  return h;
}

IS_TURLERI.odeme={
  denetle:hareketDenetle,
  baslik:(k,is)=>is.veri.aciklama,
  uygula:(k,is)=>({hareketId:paraHareketi(k,Object.assign({},is.veri,{kaynak:is.id}))})
};

/* şu anki tarihte bir para hareketi işler, kulübün nakdini günceller; hareket kimliğini döndürür */
function paraHareketi(k,{kulupId,tutar,kalem,aciklama,kaynak=null}){
  const h=hareketDenetle(k,{kulupId,tutar,kalem,aciklama});
  if(kaynak!==null&&k.hareketler.some(x=>x.kaynak===kaynak))h.push(`${kaynak} için para hareketi zaten işlenmiş`);
  const yeni=h.length?0:k.kulupler[kulupId].nakit+tutar;
  if(!h.length&&!Number.isSafeInteger(yeni))h.push('nakit güvenli tamsayı sınırını aşıyor');
  if(h.length)throw new Error('Para hareketi reddedildi: '+h.join('; '));
  const id=kimlikUret(k,'hareket');
  k.hareketler.push({id,kulupId,tarih:k.tarih,dakika:k.gunIciDakika,tutar,kalem,aciklama,kaynak});
  k.kulupler[kulupId].nakit=yeni;
  return id;
}
/* belirli bir ana gelecekteki ödeme/tahsilat kurar (takvimde 'odeme' işi); iş kimliğini döndürür.
   meseleId: ödemenin bağlı olduğu mesele (js/mesele.js); verilmezse ödeme bir meseleye bağlı değildir */
const odemePlanla=(k,{kulupId,tarih,dakika,tutar,kalem,aciklama,meseleId})=>
  isEkle(k,{tur:'odeme',tarih,dakika,veri:Object.assign({kulupId,tutar,kalem,aciklama},meseleId===undefined?{}:{meseleId})});

/* kulübün henüz işlenmemiş ödemeleri, tarih sırasıyla */
const bekleyenOdemeler=(k,kulupId)=>Object.values(k.isler).filter(is=>is.tur==='odeme'&&is.veri.kulupId===kulupId)
  .sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika)||isNo(a.id)-isNo(b.id));
/* mevcut para ile bekleyen taahhütlerin ayrı özeti */
function maliDurum(k,kulupId){
  let gelir=0,gider=0;
  for(const is of bekleyenOdemeler(k,kulupId))if(is.veri.tutar>0)gelir+=is.veri.tutar;else gider+=is.veri.tutar;
  const nakit=k.kulupler[kulupId].nakit;
  return{nakit,bekleyenGelir:gelir,bekleyenGider:gider,odemelerSonrasi:nakit+gelir+gider};
}
/* kuruşu okunur yazar: -320000000 → '-3.200.000,00 ₺' (yerel ayara bağlı değil) */
function paraYazi(kurus){
  const m=Math.abs(kurus),tl=String(Math.floor(m/100)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  return`${kurus<0?'-':''}${tl},${String(m%100).padStart(2,'0')} ₺`;
}

/* maliye alanlarının doğrulaması; kariyerDogrula çağırır */
function maliyeDogrula(k,h){
  if(!Array.isArray(k.hareketler)){h.push('Para hareketleri listesi yok');return;}
  const kulupler=k.kulupler||{},toplam={};
  for(const [id,c] of Object.entries(kulupler)){
    if(!c)continue;
    if(!Number.isSafeInteger(c.acilisNakit))h.push(`Kulüp ${id}: açılış nakdi tamsayı kuruş değil (${c.acilisNakit})`);
    if(!Number.isSafeInteger(c.nakit))h.push(`Kulüp ${id}: nakit tamsayı kuruş değil (${c.nakit})`);
    toplam[id]=0;
  }
  const simdi=tarihGecerliMi(k.tarih)&&Number.isInteger(k.gunIciDakika)?simdikiAn(k):null;
  const bekleyen=k.isler||{},tamamlanan=new Set((Array.isArray(k.gecmis)?k.gecmis:[]).filter(g=>g&&g.tur==='is').map(g=>g.isId));
  const kimlikler=new Set(),kaynaklar=new Set();
  k.hareketler.forEach((x,i)=>{
    if(!x||typeof x!=='object'){h.push(`Para hareketi [${i}]: kayıt değil`);return;}
    const ad=`Para hareketi ${x.id}`;
    kimlikDenetle(k,h,ad,String(x.id),'hareket');
    if(kimlikler.has(x.id))h.push(`${ad}: kimlik iki kez kullanılmış`);
    kimlikler.add(x.id);
    for(const e of hareketDenetle(k,x))h.push(`${ad}: ${e}`);
    if(!tarihGecerliMi(x.tarih)||!Number.isInteger(x.dakika))h.push(`${ad}: geçersiz tarih/dakika`);
    else if(simdi!==null&&anDakika(x.tarih,x.dakika)>simdi)h.push(`${ad}: gelecekte işlenmiş görünüyor`);
    if(x.kaynak!==null){
      if(typeof x.kaynak!=='string')h.push(`${ad}: kaynak metin ya da null olmalı`);
      else{
        if(kaynaklar.has(x.kaynak))h.push(`${ad}: ${x.kaynak} iki kez işlenmiş`);
        kaynaklar.add(x.kaynak);
        if(bekleyen[x.kaynak])h.push(`${ad}: kaynağı ${x.kaynak} hâlâ bekliyor`);
        else if(!tamamlanan.has(x.kaynak))h.push(`${ad}: kaynağı ${x.kaynak} tamamlanmış görünmüyor`);
      }
    }
    if(x.kulupId in toplam&&Number.isSafeInteger(x.tutar))toplam[x.kulupId]+=x.tutar;
  });
  for(const [id,t] of Object.entries(toplam)){
    const c=kulupler[id];
    if(Number.isSafeInteger(c.acilisNakit)&&Number.isSafeInteger(c.nakit)&&c.acilisNakit+t!==c.nakit)
      h.push(`Kulüp ${id}: nakit (${paraYazi(c.nakit)}) açılış + hareketler toplamıyla (${paraYazi(c.acilisNakit+t)}) tutmuyor`);
  }
}
