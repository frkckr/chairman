/* ============ Chairman — haber akışı: TV'nin bugünü ve takip (kural; DOM yok; RK8-a, 2026-11-01) ============
   Aciliyet kanaldan anlaşılır (OYUN_TASARIMI §6): gazete dünü anlatır (js/gazete.js), TV bugünü. TV'nin haberleri gazetenin kaynak defterinden
   (js/soz.js GAZETE_KAYNAKLARI) ve yalnız TV'nin kaynaklarından (HABER_KAYNAKLARI: öbür maçların sonucu maç başına saatinde, kırmızı kart) kurulur;
   gazetenin toplu satırları (haftanın öbür sonuçları, bizim maç; TV'de her maç ayrı haberdir) ve kutular (puan durumu, gol sıralaması) TV'de yoktur.
   Gazete değişmez (yalnız GAZETE_KAYNAKLARI'nı okur). Haber kayda girmez, her seferinde aynı kurulur (belirlenimci).
   Konu: haberin p'sindeki kimliklerden türetilir — fikstürdeki maç (iki kulübüyle), kulüp ve oyuncu (p'nin metin ya da metin dizisi değerleri). Takip
   filtresi konudan: takip edilen kulüp ya da oyuncu haberin konusundaysa haber takip haberidir.
   Takip (kullanıcı, 2026-11-01: Canlı Skor'da “Takip” sekmesi ve telefon simgesinde rozet): k.takip {kulupler:[kimlik], oyuncular:[kimlik]} ve
   k.takipOkunan (an: Takip sekmesinin son açılışı). İkisi de isteğe bağlıdır (yoksa takip boş, okunmamış hepsi); kayıt sürümü 12'nin içindedir.
   Konuşma ve kart açılmaz, zaman durmaz; kalıcı susturma takibi bırakmaktır.
     tvPenceresi(k)             → {bas, son}: bugün 08:00 (gün 08:00'den önceyse dün 08:00) → şimdi
     tvHaberleri(k)             → [{onem, an, anahtar, p, metin, etiket, konu}] pencerede, önem ↓ (haberAkisi sırası); en çok HABER_TEST.tvEnCok
     haberKonusu(k, h)          → {maclar, kulupler, oyuncular} (diziler)
     takipHaberleri(k)          → takip haberleri son HABER_TEST.takipGun günde, yeniden eskiye
     takipYeniSayisi(k)         → takipOkunan'dan sonraki takip haberi sayısı (rozet)
     takipEdiliyor(k, tur, id)  tur 'kulup' ya da 'oyuncu'
     takipEt(k, tur, id) · takibiBirak(k, tur, id) · takipOkundu(k)   komutlar (kopyala-yaz)
     takipDogrula               EK_DENETIMLER
   Önemler, pencere ve sayılar TEST. */
'use strict';
const HABER_TEST={tvEnCok:30,takipGun:14,takipEnCok:40,sonuc:{biz:100,fark:45,obur:30},kirmizi:{biz:55,obur:22}};
const HABER_KAYNAKLARI=[];
/* gazetenin TV'de olmayan haberleri: toplu satırlar (TV'de maç başına haber) ve kutular; kaynağı bütünüyle bunlardan olanlar hiç çağrılmaz */
const HABER_TV_DISI=new Set(['gz.mac','gz.sonuclar','gz.bos','gz.kisa']),HABER_ATLANAN_KAYNAK=new Set(['mac','tablo','golcu']);
const haberMacSonu=f=>anDakika(f.tarih,f.dakika)+(typeof LIG_TAKVIM_TEST!=='undefined'?LIG_TAKVIM_TEST.macSure:105);
HABER_KAYNAKLARI.push(
  /* maç sonucu: her oynanmış maç bittiği anda (başlama + maç süresi); bizim maç ve büyük farklı galibiyet önde */
  {ad:'sonuc',haberler:(k,P)=>(k.fikstur||[]).filter(f=>(k.maclar||{})[f.id]&&!k.maclar[f.id].hukmen).map(f=>{const s=k.maclar[f.id],an=haberMacSonu(f);
    if(an<P.bas||an>=P.son)return null;const bizde=f.ev===P.biz||f.konuk===P.biz,fark=Math.abs(s.skor[0]-s.skor[1]);
    return{onem:bizde?HABER_TEST.sonuc.biz:fark>=3?HABER_TEST.sonuc.fark:HABER_TEST.sonuc.obur,an,anahtar:'hb.sonuc',p:{macId:f.id}};}).filter(Boolean)},
  /* kırmızı kart: maçın anında (dakikasıyla); oyuncu bir maç ceza alır (TEST kuralı, js/mac-sonuc.js) */
  {ad:'kirmizi',haberler:(k,P)=>{const L=[];
    for(const f of k.fikstur||[]){const s=(k.maclar||{})[f.id];if(!s||s.hukmen)continue;const a0=anDakika(f.tarih,f.dakika);if(a0>=P.son||a0+200<P.bas)continue;
      for(const x of s.kartlar||[]){if(x.renk!=='kirmizi'&&x.renk!=='ikinciSari')continue;const c=x.takim===0?f.ev:f.konuk,an=a0+Math.min(haberMacSonu(f)-a0-1,(x.dk|0)+(x.yari===2?15:0));
        if(an<P.bas||an>=P.son)continue;
        L.push({onem:c===P.biz?HABER_TEST.kirmizi.biz:HABER_TEST.kirmizi.obur,an,anahtar:'hb.kirmizi',p:{macId:f.id,kulupId:c,oyuncuId:x.id}});}}
    return L;}}
);
const tvPenceresi=k=>{const son=simdikiAn(k),t=k.gunIciDakika>=GUN_BASLANGICI?k.tarih:tarihEkle(k.tarih,-1);return{bas:anDakika(t,GUN_BASLANGICI),son:son+1};};
/* haberin konusu: p'nin kimlik değerleri (maç, kulüp, oyuncu) */
function haberKonusu(k,h){
  const M=new Set(),C=new Set(),O=new Set(),F=new Map((k.fikstur||[]).map(f=>[f.id,f]));
  const bak=v=>{if(typeof v!=='string')return;const f=F.get(v);if(f){M.add(v);C.add(f.ev);C.add(f.konuk);}else if((k.kulupler||{})[v])C.add(v);else if((k.oyuncular||{})[v])O.add(v);};
  for(const v of Object.values(h.p||{}))Array.isArray(v)?v.forEach(bak):bak(v);
  return{maclar:[...M],kulupler:[...C],oyuncular:[...O]};
}
/* kaynakların haberleri (gazetenin haberAkisi sırası ve metni); tv: gazetenin toplu satırları ve kutuları hariç, TV kaynakları dahil */
function haberListesi(k,bas,son){
  const biz=(k.kisiler[k.baskanId]||{}).kulupId,P={tarih:anTarih(Math.max(bas,son-1)).tarih,bas,son,biz},L=[];
  [GAZETE_KAYNAKLARI,HABER_KAYNAKLARI].forEach((D,di)=>D.forEach((Q,qi)=>{if(!di&&HABER_ATLANAN_KAYNAK.has(Q.ad))return;(Q.haberler(k,P)||[]).forEach((h,i)=>{
    if(h&&!h.kutu&&!HABER_TV_DISI.has(h.anahtar)&&h.an>=bas&&h.an<son&&MESELE_OLAYLARI[h.anahtar])L.push({h,qi:di*100+qi,i});});}));
  L.sort((a,b)=>b.h.onem-a.h.onem||a.h.an-b.h.an||a.qi-b.qi||a.i-b.i);
  return L.map(({h})=>Object.assign({},h,{metin:MESELE_OLAYLARI[h.anahtar](k,h.p||{}),etiket:HABER_ETIKET[h.anahtar]||GAZETE_ETIKET[h.anahtar]||'Kulüp',konu:haberKonusu(k,h)}));
}
const tvHaberleri=k=>{const W=tvPenceresi(k);return haberListesi(k,W.bas,W.son).slice(0,HABER_TEST.tvEnCok);};
/* takip */
const takipListesi=(k,tur)=>((k.takip||{})[tur==='kulup'?'kulupler':'oyuncular'])||[];
const takipEdiliyor=(k,tur,id)=>takipListesi(k,tur).includes(id);
const takipKonusu=(k,konu)=>konu.kulupler.some(c=>takipEdiliyor(k,'kulup',c))||konu.oyuncular.some(o=>takipEdiliyor(k,'oyuncu',o));
function takipHaberleri(k){
  if(!takipListesi(k,'kulup').length&&!takipListesi(k,'oyuncu').length)return[];
  const son=simdikiAn(k)+1;
  return haberListesi(k,son-HABER_TEST.takipGun*1440,son).filter(h=>takipKonusu(k,h.konu)).sort((a,b)=>b.an-a.an).slice(0,HABER_TEST.takipEnCok);
}
const takipYeniSayisi=k=>{const o=Number.isInteger(k.takipOkunan)?k.takipOkunan:-Infinity;return takipHaberleri(k).filter(h=>h.an>o).length;};
function takipEt(k,tur,id){
  if(tur!=='kulup'&&tur!=='oyuncu')throw new Error(`Bilinmeyen takip türü: ${tur}`);
  if(tur==='kulup'?!(k.kulupler||{})[id]:!(k.oyuncular||{})[id])throw new Error(`Takip edilecek ${tur} yok: ${id}`);
  if(takipEdiliyor(k,tur,id))return;
  const T=k.takip||{kulupler:[],oyuncular:[]},a=tur==='kulup'?'kulupler':'oyuncular';
  k.takip=Object.assign({kulupler:[],oyuncular:[]},T,{[a]:(T[a]||[]).concat([id])});
}
function takibiBirak(k,tur,id){
  if(!takipEdiliyor(k,tur,id))return;const a=tur==='kulup'?'kulupler':'oyuncular';
  k.takip=Object.assign({},k.takip,{[a]:k.takip[a].filter(x=>x!==id)});
}
function takipOkundu(k){k.takipOkunan=simdikiAn(k);}
function takipDogrula(k,h=[]){   /* EK_DENETIMLER: bulgular h'ye */
  if(k.takip!==undefined){const T=k.takip;
    if(!T||typeof T!=='object'||!Array.isArray(T.kulupler)||!Array.isArray(T.oyuncular))h.push('takip listesi bozuk');
    else{for(const c of T.kulupler)if(!(k.kulupler||{})[c])h.push(`takip edilen kulüp yok: ${c}`);
      for(const o of T.oyuncular)if(!(k.oyuncular||{})[o])h.push(`takip edilen oyuncu yok: ${o}`);
      if(new Set(T.kulupler).size!==T.kulupler.length||new Set(T.oyuncular).size!==T.oyuncular.length)h.push('takip listesinde tekrar');}}
  if(k.takipOkunan!==undefined&&k.takipOkunan!==null&&(!Number.isInteger(k.takipOkunan)||k.takipOkunan>simdikiAn(k)))h.push('takipOkunan geçersiz');
  return h;
}
EK_DENETIMLER.push(takipDogrula);
/* TV'nin etiketleri ve TEST metinleri (kullanıcı değiştirir) */
const HABER_ETIKET={'hb.sonuc':'Maç sonucu','hb.kirmizi':'Kırmızı kart'};
Object.assign(MESELE_OLAYLARI,{
  'hb.sonuc':(k,p)=>{const f=(k.fikstur||[]).find(x=>x.id===p.macId),s=f&&(k.maclar||{})[f.id];return f&&s?`TEST: ${f.hafta}. hafta: ${gzSkor(k,f)}.`:'TEST: maç bitti.';},
  'hb.kirmizi':(k,p)=>{const o=(k.oyuncular||{})[p.oyuncuId],ad=o?o.ad:'bir oyuncu';return`TEST: ${gzAd(k,p.kulupId)}'dan ${ad} kırmızı kart gördü; bir maç yok.`;}
});
