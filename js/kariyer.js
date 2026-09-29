/* ============ Chairman — kariyer durumu: oluşturma, kimlik ve doğrulama (çizim yok) ============
   Kariyer durumu kaydedilebilir sade veridir: düz nesne, dizi, metin, sonlu sayı, true/false ve null.
   Three.js nesnesi, DOM öğesi, fonksiyon, Date ya da undefined içermez. Sözleşme TEKNIK_PLAN.md §3'tedir.
   Örnek başlangıç verisi js/kariyer-ornek.js'tedir. Deneme: node araclar/kariyer-deneme.js
   Yükleme sırası: kariyer.js → takvim.js → maliye.js (kariyerDogrula diğer ikisinin denetimlerini de çağırır). */
const KARIYER_SURUM=1;
const GOREV_DURUMLARI=['taraftar','aday','gorevde','gorevDisi','yenidenAday','kariyerSonu'];
const KISI_DURUMLARI=['aktif','emekli','ayrildi','vefat'];
/* kimlikUret'in tanıdığı türler ve kayıtlarının bulunduğu alan (nesne ya da dizi) */
const KIMLIK_TURLERI={kisi:'kisiler',is:'isler',hareket:'hareketler'};

/* başlangıç verisinin bağımsız kopyası: oyun ilerledikçe başlangıç verisi değişmez */
const kariyerOlustur=baslangic=>JSON.parse(JSON.stringify(baslangic));

/* yeni kalıcı kimlik: 'kisi-8', 'is-4' gibi; sayacı ilerletir, var olan bir kimliği asla yeniden vermez */
function kimlikUret(k,tur){
  const alan=KIMLIK_TURLERI[tur];
  if(!alan)throw new Error(`Bilinmeyen kimlik türü: ${tur}`);
  const no=k.sonrakiNo[tur];
  if(!Number.isInteger(no)||no<1)throw new Error(`sonrakiNo.${tur} geçersiz: ${no}`);
  const id=`${tur}-${no}`,kap=k[alan];
  if(Array.isArray(kap)?kap.some(x=>x.id===id):kap[id])throw new Error(`Kimlik çakışması: ${id} zaten var`);
  k.sonrakiNo[tur]=no+1;
  return id;
}
/* kimlik 'tur-N' biçiminde mi ve sayaç onu geçmiş mi; hatayı listeye yazar */
function kimlikDenetle(k,h,ad,id,tur){
  const m=new RegExp(`^${tur}-(\\d+)$`).exec(id);
  if(!m)h.push(`${ad}: kimlik '${tur}-N' biçiminde değil`);
  else if(!(Number(m[1])<(k.sonrakiNo||{})[tur]))h.push(`${ad}: sonrakiNo.${tur} (${(k.sonrakiNo||{})[tur]}) bu kimlikten büyük olmalı; yeni kimlikler çakışır`);
}

/* tarih: 'YYYY-AA-GG' ve takvimde gerçekten olan bir gün (2026-02-30 geçersiz). Yerel saat dilimine bağlı değildir */
function tarihGecerliMi(s){
  if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
  const [y,a,g]=s.split('-').map(Number),d=new Date(Date.UTC(y,a-1,g));
  return d.getUTCFullYear()===y&&d.getUTCMonth()===a-1&&d.getUTCDate()===g;
}
/* aynı biçimdeki iki tarih metin olarak sıralanabilir: <0 önce, 0 aynı gün, >0 sonra */
const tarihKarsilastir=(a,b)=>a<b?-1:a>b?1:0;

/* kaydedilebilir mi: yalnız düz veri. Hatalı alanların yolunu hatalar listesine yazar */
function sadeVeriDenetle(v,yol,hatalar){
  if(v===null||typeof v==='string'||typeof v==='boolean')return;
  if(typeof v==='number'){if(!Number.isFinite(v))hatalar.push(`${yol}: sonlu sayı değil (${v})`);return;}
  if(Array.isArray(v)){v.forEach((x,i)=>sadeVeriDenetle(x,`${yol}[${i}]`,hatalar));return;}
  if(typeof v==='object'){
    const p=Object.getPrototypeOf(v);
    if(Object.prototype.toString.call(v)!=='[object Object]'||(p!==null&&Object.getPrototypeOf(p)!==null)){
      hatalar.push(`${yol}: düz nesne değil`);return;}
    for(const a of Object.keys(v))sadeVeriDenetle(v[a],`${yol}.${a}`,hatalar);
    return;
  }
  hatalar.push(`${yol}: kaydedilemeyen değer (${typeof v})`);
}

/* kariyer durumunu doğrular; hataları Türkçe açıklamalarla döndürür. Boş liste = geçerli */
function kariyerDogrula(k){
  const h=[];
  if(!k||typeof k!=='object')return['Kariyer verisi yok'];
  sadeVeriDenetle(k,'kariyer',h);
  if(k.kayitSurumu!==KARIYER_SURUM)h.push(`Desteklenmeyen kayıt sürümü: ${k.kayitSurumu} (beklenen ${KARIYER_SURUM})`);
  if(!Number.isInteger(k.dunyaTohumu))h.push('Dünya tohumu tamsayı değil');
  if(!tarihGecerliMi(k.tarih))h.push(`Geçersiz tarih: ${k.tarih}`);
  if(!Number.isInteger(k.gunIciDakika)||k.gunIciDakika<0||k.gunIciDakika>1439)h.push(`Gün içi dakika 0–1439 arasında değil: ${k.gunIciDakika}`);
  if(!GOREV_DURUMLARI.includes(k.gorevDurumu))h.push(`Bilinmeyen görev durumu: ${k.gorevDurumu}`);
  if(k.final!==null&&(typeof k.final!=='object'||Array.isArray(k.final)))h.push('final null ya da nesne olmalı');
  const kulupler=k.kulupler||{},kisiler=k.kisiler||{};
  if(!k.kulupler)h.push('Kulüp listesi yok');
  if(!k.kisiler)h.push('Kişi listesi yok');
  if(!k.sonrakiNo)h.push('sonrakiNo yok');

  for(const [anahtar,c] of Object.entries(kulupler)){
    const ad=`Kulüp ${anahtar}`;
    if(!c||c.id!==anahtar){h.push(`${ad}: kimliği anahtarıyla aynı değil (${c&&c.id})`);continue;}
    if(!/^[a-z0-9]+$/.test(anahtar))h.push(`${ad}: kimlik yalnız küçük harf ve rakam olmalı`);
    if(typeof c.ad!=='string'||!c.ad)h.push(`${ad}: adı yok`);
    if(![1,2,3].includes(c.kademe))h.push(`${ad}: kademe 1, 2 ya da 3 olmalı (${c.kademe})`);
    if(c.baskanId!==null&&!kisiler[c.baskanId])h.push(`${ad}: başkanı bulunamadı (${c.baskanId})`);
  }
  for(const [anahtar,p] of Object.entries(kisiler)){
    const ad=`Kişi ${anahtar}`;
    if(!p||p.id!==anahtar){h.push(`${ad}: kimliği anahtarıyla aynı değil (${p&&p.id})`);continue;}
    kimlikDenetle(k,h,ad,anahtar,'kisi');
    if(typeof p.ad!=='string'||!p.ad)h.push(`${ad}: adı yok`);
    if(typeof p.rol!=='string'||!p.rol)h.push(`${ad}: rolü yok`);
    if(!KISI_DURUMLARI.includes(p.durum))h.push(`${ad}: bilinmeyen durum (${p.durum})`);
    if(!tarihGecerliMi(p.dogumTarihi))h.push(`${ad}: geçersiz doğum tarihi (${p.dogumTarihi})`);
    else if(tarihGecerliMi(k.tarih)&&tarihKarsilastir(p.dogumTarihi,k.tarih)>=0)h.push(`${ad}: doğum tarihi bugünden önce değil`);
    if(p.kulupId!==null&&!kulupler[p.kulupId])h.push(`${ad}: kulübü bulunamadı (${p.kulupId})`);
  }

  const b=kisiler[k.baskanId];
  if(!b)h.push(`Başkan bulunamadı (${k.baskanId})`);
  else if(k.gorevDurumu==='gorevde'){
    const c=kulupler[b.kulupId];
    if(!c||c.baskanId!==k.baskanId)h.push('Başkan görevde görünüyor fakat kulübünün başkanı olarak kayıtlı değil');
  }
  takvimDogrula(k,h);
  maliyeDogrula(k,h);
  return h;
}
