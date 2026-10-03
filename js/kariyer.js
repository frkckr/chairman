/* ============ Chairman — kariyer durumu: oluşturma, kimlik ve doğrulama (çizim yok) ============
   Kariyer durumu kaydedilebilir sade veridir: düz nesne, dizi, metin, sonlu sayı, true/false ve null.
   Three.js nesnesi, DOM öğesi, fonksiyon, Date ya da undefined içermez. Sözleşme TEKNIK_PLAN.md §3'tedir.
   Örnek başlangıç verisi js/kariyer-ornek.js'tedir. Deneme: node araclar/kariyer-deneme.js
   Yükleme sırası: kariyer.js → takvim.js → maliye.js (kariyerDogrula diğer ikisinin denetimlerini de çağırır).
   Sürüm 2 (yol haritası 2.3): meseleler ve sonrakiNo.mesele eklendi; sürüm 1 kayıtlarını js/kayit.js dönüştürür.
   Sürüm 3 (yol haritası 2.4A): icerik {surum, baslangic}, kosullar, rastlanti {durum}, olaylar ve sonrakiNo.olay eklendi.
     icerik.surum: içerik sürümü (kayıt sürümünden ayrı); 0 = eski sabit TEST haftası, yeni olay paketi açılmaz.
     kosullar: devralınan dünya gerçekleri; başlangıçta bir kez kurulur (js/baslangic.js). olaylar: js/olay.js.
   Sürüm 4 (yol haritası 2.6, 2.8): sozler (js/soz.js), haberler (gazete ve teşekkür kayıtları) ve sonrakiNo.soz eklendi;
     kulüpte isteğe bağlı sorumluluklar (kalıcı yetki devri, js/yonetim.js). İçerik sürümü 2: tavsiye, hoca, basın ve destek paketleri.
   Sürüm 5 (yol haritası 2.7): gozlem (süren antrenman gözlemi: null ya da {tarih, bas, bitis}; js/gozlem.js).
   Sürüm 6 (yol haritası 2.8L, 2026-10-02): alanlar sürüm 5 ile aynıdır; oyunun bütün içeriği kaldırıldığı için 1–5 sürümlü kayıtlar
     dönüştürülmez, açılırken nedeni söylenerek reddedilir (js/kayit.js). İçerik sürümü 4 boş içeriktir. */
const KARIYER_SURUM=6;
const GOREV_DURUMLARI=['taraftar','aday','gorevde','gorevDisi','yenidenAday','kariyerSonu'];
const KISI_DURUMLARI=['aktif','emekli','ayrildi','vefat'];
/* sonradan yüklenen kural dosyalarının ek doğrulamaları (ör. js/yonetim.js): (k, hatalar) => void. Dosya yüklü değilse alanı denetlenmez */
const EK_DENETIMLER=[];
/* kimlikUret'in tanıdığı türler ve kayıtlarının bulunduğu alan (nesne ya da dizi) */
const KIMLIK_TURLERI={kisi:'kisiler',is:'isler',hareket:'hareketler',mesele:'meseleler',olay:'olaylar',soz:'sozler'};

/* başlangıç verisinin bağımsız kopyası: oyun ilerledikçe başlangıç verisi değişmez */
const kariyerOlustur=baslangic=>JSON.parse(JSON.stringify(baslangic));

/* güvenli komut: f kariyerin kopyasına uygulanır, kopya doğrulanır; geçerliyse {kariyer: yeni durum, sonuc: f'nin döndürdüğü} döner.
   f hata verirse ya da kopya tutarsız kalırsa hata fırlatılır ve verilen kariyer hiç değişmez. Ajanda, oda ve telefon aynı yolu kullanır */
function kariyerKomut(k,f){
  const y=kariyerOlustur(k),sonuc=f(y),h=kariyerDogrula(y);
  if(h.length)throw new Error('Komut kariyeri tutarsız bıraktı: '+h.slice(0,3).join('; '));
  return{kariyer:y,sonuc};
}

/* kayıtlı rastlantı: dünya tohumundan başlar, durumu kariyerde saklanır (k.rastlanti.durum); [0,1) aralığında sayı verir.
   Hesap js/ortak.js'teki tohumluRastgele ile aynıdır (mulberry32). Yalnız komut içinde çekilir: önizleme, özet ve çizim çekmez.
   Maç ve görsel rastlantıdan bağımsızdır; aynı tohum ve aynı kararlarla aynı dizi tekrarlanır */
const rastlantiBaslat=tohum=>({durum:tohum>>>0});
function rastlantiCek(k){
  const a=(k.rastlanti.durum+0x6D2B79F5)|0;
  k.rastlanti.durum=a>>>0;
  let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;
  return((t^(t>>>14))>>>0)/4294967296;
}

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
  const duz=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
  if(!duz(k.icerik)||!Number.isInteger(k.icerik.surum)||k.icerik.surum<0||(k.icerik.baslangic!==null&&typeof k.icerik.baslangic!=='string'))h.push('İçerik kaydı (icerik) geçersiz');
  if(!duz(k.kosullar))h.push('Devralınan koşullar (kosullar) yok');
  if(!duz(k.rastlanti)||!Number.isInteger(k.rastlanti.durum)||k.rastlanti.durum<0||k.rastlanti.durum>0xFFFFFFFF)h.push('Rastlantı durumu (rastlanti) geçersiz');
  if(!duz(k.olaylar))h.push('Olay listesi (olaylar) yok');
  if(!duz(k.sozler))h.push('Söz listesi (sozler) yok');
  if(!Array.isArray(k.haberler))h.push('Haber listesi (haberler) yok');
  if(k.gozlem===undefined)h.push('Gözlem alanı (gozlem) yok');

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
  for(const d of EK_DENETIMLER)d(k,h);
  return h;
}
