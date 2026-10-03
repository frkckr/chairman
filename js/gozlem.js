/* ============ Chairman — antrenman gözlemi: balkondan isteğe bağlı izleme (çizim yok; yol haritası 2.7) ============
   Antrenman penceresi bir takvim işi değildir: hafta içi belirli saatlerde takım sahadadır (antrenmanPenceresi). İzlenmezse hiçbir şey
   kaçırılmış sayılmaz; geçmişe "kaçırıldı" kaydı düşmez.
   Gözlem takvimde bir ARALIKTIR (k.gozlem = {tarih, bas, bitis} ya da null/yok), süre tüketen ayrı bir iş değildir:
     gozlemAc aralığı kurar; gozlemAdim zamanı bitişe doğru parça parça, gozlemBaslat/gozlemSurdur tek parça ilerletir. Karar gerektiren bir gelişme ya da beklenen bir görüş gelirse zaman o anda
     DURUR; aralık açık kalır (kalan süre = bitis − şimdi). Karar verilirken zaman ilerlemez. gozlemSurdur kalan süreyi ilerletir.
     Aralık açıkken yapılan kısa iş (süresi KISA_IS dakikayı aşmayan) aralığın içinde geçer: gözlem süresi iki kez harcanmaz.
     Tam dikkat isteyen uzun iş için önce gözlem bırakılır (ajandaOnizle engeli).
     Zaman aralığın sonuna ya da başka bir güne geçtiğinde aralık kendiliğinden kapanır (ZAMAN_SONRASI) ve geçmişe
     {tur:'gozlem', tarih, dakika, bas, bitis, izlenen, not?} yazılır.
   Gözlem ödül toplama işi değildir: GOZLEM_NOT_ESIGI dakikadan uzun izlenirse geçmişe o günün çalışmasından tek cümlelik bir not düşer
     (tarihe göre belirlenimli; rastlantı çekmez). Para, moral ya da gizli bilgi kazandırmaz; izlememek hiçbir şey kaybettirmez.
   Saatler ve eşikler TEST değeridir. */
const ANTRENMAN_SAATI={bas:900,bit:1020};  // hafta içi 15:00–17:00 (TEST değeri)
const KISA_IS=15;                          // gözlemin içine sığan işin en uzun süresi, dakika (TEST değeri)
const GOZLEM_NOT_ESIGI=30;                 // bundan kısa gözlem not bırakmaz (TEST değeri)
/* gözlem notlarının olay anahtarları (MESELE_OLAYLARI); içerik dosyaları ekler. Boşsa gözlem not bırakmaz (2.8L) */
const GOZLEM_NOTLARI=[];

const gunNo=tarih=>{const [y,a,g]=tarih.split('-').map(Number);return Date.UTC(y,a-1,g)/86400000;};
/* o günün antrenman saatleri ya da null (hafta sonu ve maç günü antrenman yok) */
function antrenmanPenceresi(k,tarih){
  const hg=(gunNo(tarih)+4)%7;                                     // 0 = Pazar
  if(hg===0||hg===6)return null;
  if(Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'&&x.tarih===tarih))return null;
  return{bas:ANTRENMAN_SAATI.bas,bit:ANTRENMAN_SAATI.bit};
}
/* şu anki durum (kariyeri değiştirmez): {pencere, suruyor, kalan: antrenmanın bitmesine kalan dakika} */
function antrenmanDurumu(k){
  const p=antrenmanPenceresi(k,k.tarih),suruyor=!!p&&k.gunIciDakika>=p.bas&&k.gunIciDakika<p.bit;
  return{pencere:p,suruyor,kalan:suruyor?p.bit-k.gunIciDakika:0};
}
const gozlemAcik=k=>!!k.gozlem&&k.gozlem.tarih===k.tarih&&k.gunIciDakika<k.gozlem.bitis;
const gozlemKalan=k=>gozlemAcik(k)?k.gozlem.bitis-k.gunIciDakika:0;

/* gözlemi başlatmadan önce (kariyeri değiştirmez): {sure: gerçekleşecek dakika, bitis: gün içi dakika, engel: [metin], kisaldi: neden | null,
   gerceklesecek: arada işlenecek rutin işler} */
function gozlemOnizle(k,dakika){
  const d=antrenmanDurumu(k),engel=[],simdi=simdikiAn(k),gun=anDakika(k.tarih,0);
  if(gozlemAcik(k))engel.push('Zaten izliyorsun');
  if(!d.pencere)engel.push('Bugün antrenman yok');
  else if(k.gunIciDakika<d.pencere.bas)engel.push(`Antrenman ${saatYazi(d.pencere.bas)}'te başlıyor`);
  else if(!d.suruyor)engel.push('Antrenman bitti');
  if(!Number.isInteger(dakika)||dakika<1)engel.push('Geçersiz süre');
  if(engel.length)return{sure:0,bitis:k.gunIciDakika,engel,kisaldi:null,gerceklesecek:[]};
  let bitis=Math.min(simdi+dakika,gun+d.pencere.bit),kisaldi=bitis<simdi+dakika?'Antrenman o saatte bitiyor':null;
  for(const x of bekleyenIsler(k)){
    if(x.tur!=='ajanda')continue;
    const v=x.veri,an=isAn(x);
    /* saatli iş başlangıcında ve acil kararın son cevap anında gözlem biter: kimse sessizce kaçırılmaz */
    if(!v.saatsiz&&an>=simdi&&an<bitis){bitis=an;kisaldi=`${v.baslik} ${saatYazi(x.dakika)}'te`;}
    if(v.saatsiz&&an<=bitis){if(v.bekleyebilir&&an>simdi){bitis=an;kisaldi=`${v.baslik} için son cevap ${saatYazi(x.dakika)}`;}else engel.push(`Önce karar ver: ${v.baslik} (son cevap ${sonCevapYazi(k,x)})`);}
  }
  if(!engel.length&&bitis<=simdi)engel.push(kisaldi||'İzlenecek süre yok');
  return{sure:Math.max(0,bitis-simdi),bitis:bitis-gun,engel,kisaldi,gerceklesecek:bekleyenIsler(k).filter(x=>x.tur!=='ajanda'&&!isGizli(x)&&isSonAn(x)<=bitis)};
}
/* gözlemi kapatır (şu anki saatle) ve geçmişe yazar; bıraktığı notun metnini ya da null döndürür */
function gozlemBitir(k){
  const g=k.gozlem;
  if(!g)return null;
  const ayniGun=g.tarih===k.tarih,bit=ayniGun?Math.min(k.gunIciDakika,g.bitis):g.bitis,izlenen=Math.max(0,bit-g.bas);
  const kayit={tur:'gozlem',tarih:g.tarih,dakika:bit,bas:g.bas,bitis:bit,izlenen};
  if(izlenen>=GOZLEM_NOT_ESIGI&&GOZLEM_NOTLARI.length)kayit.not=GOZLEM_NOTLARI[gunNo(g.tarih)%GOZLEM_NOTLARI.length];
  k.gecmis.push(kayit);
  k.gozlem=null;
  return kayit.not?MESELE_OLAYLARI[kayit.not](k,{}):null;
}
/* açık gözlemi en çok `dakika` kadar ilerletir (2.8B: ekran gözlemi oyun dakikası oyun dakikası uygular; görünen saat kayıtlı saattir).
   Aralığın bitişi ve durma sorguları tek parça ilerlemeyle aynıdır: parça parça ilerlemek aynı dünya sonucunu verir.
   {biten, durdu, neden: 'devam'|'karar'|'haber'|'bitti', kalan, not} döndürür */
function gozlemAdim(k,dakika){
  if(!gozlemAcik(k))throw new Error('Süren bir gözlem yok');
  if(!(dakika>0))throw new Error('Geçersiz adım');
  const son=anDakika(k.gozlem.tarih,k.gozlem.bitis),hedef=Math.min(son,simdikiAn(k)+dakika);
  const r=zamanIlerletAna(k,hedef,durakSorgusu(k)),b=r.biten[r.biten.length-1],acik=gozlemAcik(k);
  const g=k.gecmis[k.gecmis.length-1];
  return{biten:r.biten,durdu:r.durdu,neden:r.durdu?(b&&b.sonuc&&b.sonuc.haber?'haber':'karar'):acik?'devam':'bitti',kalan:gozlemKalan(k),
    not:!r.durdu&&!acik&&g&&g.tur==='gozlem'&&g.not?MESELE_OLAYLARI[g.not](k,{}):null};
}
/* kalan gözlem süresini tek parça ilerletir */
function gozlemSurdur(k){return gozlemAdim(k,Infinity);}
/* gözlem aralığını kurar, zamanı ilerletmez; ekran sonra gozlemAdim ile ilerletir */
function gozlemAc(k,dakika){
  const o=gozlemOnizle(k,dakika);
  if(o.engel.length)throw new Error('Gözlem başlatılamadı: '+o.engel.join('; '));
  k.gozlem={tarih:k.tarih,bas:k.gunIciDakika,bitis:o.bitis};
  return{bitis:o.bitis,kalan:gozlemKalan(k)};
}
/* gözlemi kurar ve tek parça sonuna kadar ilerletir (kural denemeleri ve tek seferde izleme) */
function gozlemBaslat(k,dakika){gozlemAc(k,dakika);return gozlemSurdur(k);}

/* zaman aralığın sonuna ya da başka bir güne geçtiyse gözlem kapanır */
ZAMAN_SONRASI.push(k=>{if(k.gozlem&&!gozlemAcik(k))gozlemBitir(k);});
/* gözlem sürerken tam dikkat isteyen iş: önce balkondan ayrılmak gerekir */
AJANDA_ENGELLERI.push((k,is,sure)=>gozlemAcik(k)&&sure>KISA_IS?'Bu iş tam dikkat ister; önce gözlemi bırak':null);

/* gözlem alanının doğrulaması (kariyerDogrula EK_DENETIMLER üzerinden çağırır) */
function gozlemDogrula(k,h){
  const g=k.gozlem;
  if(g===undefined||g===null)return;
  if(typeof g!=='object'||!tarihGecerliMi(g.tarih)||!Number.isInteger(g.bas)||!Number.isInteger(g.bitis)||g.bas>g.bitis){h.push('Gözlem kaydı geçersiz');return;}
  if(g.tarih!==k.tarih||k.gunIciDakika<g.bas||k.gunIciDakika>=g.bitis)h.push('Gözlem aralığı geçmiş fakat kapanmamış');
}
EK_DENETIMLER.push(gozlemDogrula);
