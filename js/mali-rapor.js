/* ============ Chairman — mali işler müdürünün raporu (çizim yok; H2-d, 2026-10-26) ============
   Kullanıcı istekleri 1–2 (YOL_HARITASI karar 50): odadaki Kasa düğmesi kalkar; mali bilgi kaynağından gelir — TEST mali işler müdürünün her Pazartesi
   kısa, ay başında ayrıntılı raporu dosyaya düşer (Raporlar sekmesi), müdüre telefondan “Kasa ne durumda?” diye sorulur (js/yazisma.js). İlke: az
   düğme, bilgi kaynağından gelir (OYUN_TASARIMI §2).
   Saf kural dosyasıdır: üst düzeyde DOM yok, Node'da da yüklenir.
     maliOzet(k, kulüp, harici iş?) → {nakit, bekleyenGelir, bekleyenGider, maasYuku, enDusuk, enDusukTarih, son90, belirsiz} — bugünkü kasa panelinin bütün
       sayıları (maliDurum, nakitUfku 90 gün, aylikMaas). harici: ufku hesaplarken dışarıda bırakılacak ay başı işi (ay başının içinde o ayın maaşı iki kez
       sayılmasın; takvim işi uygula döndükten sonra silinir)
     maliRaporBirak(k, kulüp, tür, harici?) — müdür varsa ve başkan görevdeyse haber kaydı {tur:'rapor', anahtar:'mali.'+tür, p:{kaynak, kulupId, ...özet}};
       aylıkta p.odemeler (ilk 8 bekleyen ödeme). Kayda yalnız sayılar ve tarih girer; metin ve hareket listesi saklanmaz (okurken türetilir)
     maliRaporKur(k, kulüp, harici?) — bugünden sonraki ilk Pazartesi 09:00'a haftalık rapor işi; o Pazartesi ayın 1'iyse bir hafta sonrası (o gün aylık
       rapor gelir); sezon sonu kaydı varsa kurulmaz
     maliRaporBaslat(k) — yeni kariyer: açılış anında ilk haftalık özet ve zincir (js/baslangic.js)
     maliRaporlari(k) → [{i, h}] (yeniden eskiye) · maliRaporOkumasi(k, h) → {baslik, kaynakAd, tarih, dakika, satirlar, odemeler, hareketler, uyari}
     raporGoruldu(k, i) — yalnız o raporu görüldü işaretler
   Eksi kasa uyarısı (G2 kararı 44'ün “eksi kasa işaretlenir” güvencesi; Kasa düğmesinin kırmızı rozeti kalktı): başkanın kulübünün nakdi eksiye düşer ve
     son raporun nakdi eksi değilse (rapor yoksa da) müdür kısa uyarı bırakır; aynı eksi dönemde ikinci uyarı yazılmaz. Kriz içeriği değildir (P01 kullanıcının).
   METİNLER TEST TASLAĞIDIR (karar 35 kipi). */
'use strict';
const MALI_RAPOR_TEST={saat:540,odemeSay:8};
const RAPOR_BASLIK={haftalik:'Haftalık mali özet',aylik:'Aylık mali rapor',uyari:'Kasa uyarısı'};

function maliOzet(k,kulupId,haricIsId){
  const D=maliDurum(k,kulupId),U=nakitUfku(k,kulupId,MALI_TEST.ufukGun,haricIsId);
  return{nakit:D.nakit,bekleyenGelir:D.bekleyenGelir,bekleyenGider:D.bekleyenGider,maasYuku:aylikMaas(k,kulupId,true),
    enDusuk:U.kesin.enDusuk,enDusukTarih:U.kesin.enDusukTarih,son90:U.kesin.son,belirsiz:U.belirsizGelir};
}
const maliMudurKisisi=k=>typeof personelKisisi==='function'?personelKisisi(k,'maliMudur'):null;
function maliRaporBirak(k,kulupId,tur,haricIsId){
  const m=maliMudurKisisi(k);if(!m||k.gorevDurumu!=='gorevde'||kulupId!==(k.kisiler[k.baskanId]||{}).kulupId)return null;
  const p=Object.assign({kaynak:m.id,kulupId},maliOzet(k,kulupId,haricIsId));
  if(tur==='aylik')p.odemeler=bekleyenIsler(k).filter(x=>x.tur==='odeme'&&x.veri.kulupId===kulupId).slice(0,MALI_RAPOR_TEST.odemeSay)
    .map(x=>({tarih:x.tarih,tutar:x.veri.tutar,kalem:String(x.veri.aciklama||x.veri.kalem||'')}));
  return haberEkle(k,{tur:'rapor',anahtar:'mali.'+tur,p});
}
function maliRaporKur(k,kulupId,haricIsId){
  if(k.sezon&&k.sezon.sonuc)return null;
  if(Object.values(k.isler).some(x=>x.tur==='maliRapor'&&x.veri.kulupId===kulupId&&x.id!==haricIsId))return null;
  const [y,a,g]=k.tarih.split('-').map(Number),gun=new Date(Date.UTC(y,a-1,g)).getUTCDay();
  let t=tarihEkle(k.tarih,((8-gun)%7)||7);
  if(/-01$/.test(t))t=tarihEkle(t,7);
  return isEkle(k,{tur:'maliRapor',tarih:t,dakika:MALI_RAPOR_TEST.saat,veri:{kulupId}});
}
function maliRaporBaslat(k){
  const biz=(k.kisiler[k.baskanId]||{}).kulupId;if(!biz)return;
  maliRaporBirak(k,biz,'haftalik');maliRaporKur(k,biz);
}
/* görünür rutin iş: İlerle'yi durdurmaz (OYUN_TASARIMI §6); metni ilerleme özetine yazılır */
IS_TURLERI.maliRapor={
  denetle:(k,v)=>v&&k.kulupler&&k.kulupler[v.kulupId]?[]:['mali rapor: kulüp bulunamadı'],
  baslik:()=>'Haftalık mali özet',
  uygula:(k,is)=>{const r=maliRaporBirak(k,is.veri.kulupId,'haftalik');maliRaporKur(k,is.veri.kulupId,is.id);
    return{metin:r?'Mali işler müdürü haftalık özeti dosyaya bıraktı.':'Haftalık özet gelmedi.'};}
};
/* ay başında ayrıntılı rapor (maaş ve lig payı hareketlerinden sonra; o ay başı ufuktan dışarıda) */
AY_BASI_EKLERI.push((k,is)=>maliRaporBirak(k,is.veri.kulupId,'aylik',is.id)?'Aylık mali rapor dosyada.':null);
/* eksi kasa uyarısı */
IS_SONRASI.push(k=>{
  const biz=(k.kisiler[k.baskanId]||{}).kulupId,c=biz&&k.kulupler[biz];if(!c||c.nakit>=0||!Array.isArray(k.haberler))return;
  const son=k.haberler.filter(h=>h.tur==='rapor').pop();
  if(!son||son.p.nakit>=0)maliRaporBirak(k,biz,'uyari');
});

Object.assign(MESELE_OLAYLARI,{
  'mali.haftalik':(k,p)=>`Kasada ${paraYazi(p.nakit)}; 90 gün içinde en düşük ${paraYazi(p.enDusuk)} (${gunAyYazi(p.enDusukTarih)}).`,
  'mali.aylik':(k,p)=>`Aylık rapor: kasada ${paraYazi(p.nakit)}; aylık maaş yükü ${paraYazi(p.maasYuku)}.`,
  'mali.uyari':(k,p)=>`Kasa eksiye düştü: ${paraYazi(p.nakit)}.`
});

function maliRaporlari(k){
  const L=[];(k.haberler||[]).forEach((h,i)=>{if(h.tur==='rapor')L.push({i,h});});
  return L.reverse();
}
function maliRaporOkumasi(k,h){
  const p=h.p,tur=h.anahtar.replace(/^mali\./,''),S=[];
  S.push({ad:'Kasadaki para',tutar:p.nakit});
  if(tur!=='uyari'){
    S.push({ad:'90 gün içinde en düşük',tutar:p.enDusuk,tarih:p.enDusukTarih},{ad:'90 gün sonra (kesin)',tutar:p.son90},{ad:'Belirsiz gelir (bilet tahmini)',tutar:p.belirsiz});
    if(tur==='aylik')S.push({ad:'Aylık maaş yükü',tutar:-p.maasYuku},{ad:'Bekleyen gelir',tutar:p.bekleyenGelir},{ad:'Bekleyen gider',tutar:p.bekleyenGider});
  }
  /* aylık raporun hareketleri: önceki ay başından sonra (o ay başının kendi maaş ve lig payı önceki raporda; inceleme H2-e) raporun anına dek (bu ayın
     maaşı ve lig payı dahil) */
  let hareketler=[];
  if(tur==='aylik'){const [y,a]=h.tarih.split('-').map(Number),O=a===1?`${y-1}-12-01`:`${y}-${String(a-1).padStart(2,'0')}-01`,bas=anDakika(O,MALI_TEST.saat),son=anDakika(h.tarih,h.dakika);
    hareketler=(k.hareketler||[]).filter(x=>x.kulupId===p.kulupId&&anDakika(x.tarih,x.dakika)>bas&&anDakika(x.tarih,x.dakika)<=son).map(x=>({tarih:x.tarih,dakika:x.dakika,aciklama:x.aciklama,tutar:x.tutar}));}
  const uyari=tur==='uyari'||p.nakit<0?'Kasa eksiye düştü.':p.enDusuk<0?`Kasa ${gunAyYazi(p.enDusukTarih)} eksiye düşüyor.`:null;
  return{baslik:RAPOR_BASLIK[tur]||'Rapor',kaynakAd:kisiAdi(k,p.kaynak),tarih:h.tarih,dakika:h.dakika,satirlar:S,odemeler:p.odemeler||[],hareketler,uyari};
}
function raporGoruldu(k,i){const h=(k.haberler||[])[i];if(h&&h.tur==='rapor')h.gorulen=true;}

/* telefon: müdüre “Kasa ne durumda?” (günde bir; cevap anındaki sayılar kayda girer, dosyaya ayrı rapor bırakmaz) */
const kasaCevapMetni=(k,p)=>`Kasada ${paraYazi(p.nakit)}. 90 gün içinde en düşük ${paraYazi(p.enDusuk)} (${gunAyYazi(p.enDusukTarih)}). Aylık maaş yükü ${paraYazi(p.maasYuku)}. Ayrıntısı Pazartesi özetinde.`;
yazismaKonusuEkle('kasa',{kategori:'kasa',ad:'Kasa ne durumda?',roller:['maliMudur'],aralik:1,aciklama:'Kasayı sorarsın; günde bir kez.',
  goruntu:k=>maliOzet(k,(k.kisiler[k.baskanId]||{}).kulupId),metin:{maliMudur:(k,y)=>kasaCevapMetni(k,y.p)}});
