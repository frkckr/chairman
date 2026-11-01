/* ============ Chairman — gün başı notu: her sabah 08:00'de masada özel kalemin notu (kural; DOM yok; RK5-b, 2026-11-01; karar 83) ============
   Karar 83 (kullanıcı: “Önerdiğin karışım”; DIL.md soru 2 varsayılanla): gün başı notu masada rozetle bekler, kendiliğinden açılmaz; okumak zaman almaz.
   Masa gelen kutusudur (OYUN_TASARIMI §2): not ayrı bir ana ekran değil, günün ilk kâğıdıdır. Not saklanmaz: gunNotu(k) notu kayıttan her seferinde
   aynı kurar (gazete gibi, js/gazete.js); kayda yalnız k.notOkunan (son okunan notun tarihi; isteğe bağlı, kayıt sürümü 12'nin içinde) girer.
     gunNotuTarihi(k)   son notun tarihi: 08:00 geçtiyse bugün, geçmediyse dün; kariyerin başından (BASLANGIC_TARIHI) önce null
     gunNotu(k)         → {tarih, kulupId, sonMac, ajanda, bekleyen, kasa, manset} ya da null
       sonMac    {macId, tarih, hafta, ev, konuk, skor:[ev, konuk], biz:0|1, sonuc:'G'|'B'|'M', hukmen, sira} | null — kulübün şimdiye dek son oynanmış maçı;
                 sira: bugünkü puan durumundaki yeri
       ajanda    [{saat, bitis?, baslik, durum, tur, eylem?}] — notun gününün defter satırları (saatsiz kararlar hariç: onlar bekleyende), saat sırasıyla;
                 antrenman penceresi varsa ayrı satır (tur 'antrenman')
       bekleyen  [{isId, baslik, sinif?, tarih, dakika}] — cevap bekleyen kararlar (sonraKararlari; son cevabı yakın olan önde)
       kasa      {nakit, enDusuk, enDusukTarih} — bugünkü kasa ve 90 gün içindeki en düşüğü (js/mali-rapor.js maliOzet)
       manset    {metin, etiket} | null — o günün gazetesinin manşeti (boş ya da kısa sayıda null)
     sonraKararlari(k)  masada cevap bekleyen kararlar (gelişi şimdiden önce saatsiz ajanda kararları), son cevap anına göre; masadaki “Sonra” yığını da
                        bunu okur (js/ekran-oda.js)
     notYeni(k)         bugünün notu var ve okunmadı (masadaki rozet)
     notOkundu(k)       yalnız son not için k.notOkunan = tarih (komut; zaman ve geçmiş değişmez)
     notDogrula         notOkunan yok, null ya da k.tarih'ten ileri olmayan geçerli tarih (EK_DENETIMLER)
   Metin yoktur (kayıttan sayılar ve adlar); görünüm js/ekran-not.js. */
'use strict';
function gunNotuTarihi(k){
  if(!tarihGecerliMi(k.tarih)||!Number.isInteger(k.gunIciDakika))return null;
  const t=k.gunIciDakika>=GUN_BASLANGICI?k.tarih:tarihEkle(k.tarih,-1),b=typeof BASLANGIC_TARIHI!=='undefined'?BASLANGIC_TARIHI:null;
  return b&&tarihKarsilastir(t,b)>=0?t:null;
}
function sonraKararlari(k){
  const an=simdikiAn(k);
  return Object.values(k.isler).filter(x=>x.tur==='ajanda'&&x.veri.karar&&x.veri.saatsiz&&x.veri.gelis&&anDakika(x.veri.gelis.tarih,x.veri.gelis.dakika)<=an)
    .sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika)||(a.id<b.id?-1:1));
}
function gunNotuSonMac(k,biz){
  const an=simdikiAn(k);let s=null;
  for(const f of k.fikstur||[]){
    if(f.ev!==biz&&f.konuk!==biz)continue;const m=(k.maclar||{})[f.id];if(!m)continue;
    const a=anDakika(f.tarih,f.dakika);if(a>an)continue;if(!s||a>s.a)s={f,m,a};
  }
  if(!s)return null;
  const {f,m}=s,b=f.ev===biz?0:1,biz0=m.skor[b],rak=m.skor[1-b];
  const T=k.sezon&&typeof sezonTablosu==='function'?sezonTablosu(k):[],sira=T.findIndex(x=>x.id===biz)+1;
  return{macId:f.id,tarih:f.tarih,hafta:f.hafta,ev:f.ev,konuk:f.konuk,skor:m.skor.slice(),biz:b,sonuc:biz0>rak?'G':biz0<rak?'M':'B',hukmen:!!m.hukmen,sira:sira||null};
}
function gunNotu(k){
  const tarih=gunNotuTarihi(k),biz=(k.kisiler[k.baskanId]||{}).kulupId;
  if(!tarih||!biz||!k.kulupler[biz])return null;
  const ajanda=(typeof ajandaGunu==='function'?ajandaGunu(k,tarih):[]).filter(r=>r.tur==='ajanda'&&!r.saatsiz)
    .map(r=>{const x={saat:r.saat,baslik:r.baslik,durum:r.durum,tur:'ajanda'};if(r.sure)x.bitis=r.saat+r.sure;if(r.eylem)x.eylem=r.eylem;return x;});
  const p=typeof antrenmanPenceresi==='function'?antrenmanPenceresi(k,tarih):null;
  if(p&&Number.isFinite(p.bas)&&Number.isFinite(p.bit))ajanda.push({saat:p.bas,bitis:p.bit,baslik:'Antrenman',durum:'bekliyor',tur:'antrenman'});
  ajanda.sort((a,b)=>a.saat-b.saat);
  const bekleyen=sonraKararlari(k).map(x=>{const r={isId:x.id,baslik:String(x.veri.baslik||''),tarih:x.tarih,dakika:x.dakika};if(x.veri.sinif)r.sinif=x.veri.sinif;return r;});
  const M=typeof maliOzet==='function'?maliOzet(k,biz):null;
  const g=typeof gazeteSayisi==='function'?gazeteSayisi(k,tarih):null;
  return{tarih,kulupId:biz,sonMac:gunNotuSonMac(k,biz),ajanda,bekleyen,
    kasa:M?{nakit:M.nakit,enDusuk:M.enDusuk,enDusukTarih:M.enDusukTarih}:{nakit:k.kulupler[biz].nakit,enDusuk:null,enDusukTarih:null},
    manset:g&&!g.bos&&!g.kisa&&g.manset?{metin:String(g.manset.metin||''),etiket:g.manset.etiket||''}:null};
}
const notYeni=k=>{const t=gunNotuTarihi(k);return!!t&&t===k.tarih&&k.notOkunan!==t;};
function notOkundu(k){const t=gunNotuTarihi(k);if(t)k.notOkunan=t;}
function notDogrula(k,h){
  const g=k.notOkunan;if(g===undefined||g===null)return;
  if(!tarihGecerliMi(g)||(tarihGecerliMi(k.tarih)&&tarihKarsilastir(g,k.tarih)>0))h.push(`Gün başı notu: okunan not geçersiz (${g})`);
}
EK_DENETIMLER.push(notDogrula);
