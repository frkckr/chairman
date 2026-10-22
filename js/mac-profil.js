/* ============ Chairman — maç motoru: oyuncu profili (gerçekçilik planı T3, profil kapısı; 2026-10-07) ============
   Yalnız veri ve saf işlev; çizim yok, rastlantı çekmez, önbellek yazmaz. Kabiliyet ekonomisinin (kim neyi yapabilir; ileride veritabanıyla)
   tek giriş kapısıdır: kadro verisine özellik EKLENMEZ, her şey mevcut 11 özellikten (js/kadrolar.js), boy, yapı ve ayaktan türetilir.
   Ağırlıklar ayar değil veridir (aşağıdaki tablolar; MAC_MOTORU_GERCEKCILIK_PLANI.md Ek A ve Ek B); ayarlar egilimGuc, egilimGoreli, uzunEgilim, cikisEgilim (C3) ve formSapma.
   Oyuncuya Match.oyuncuKur ve yedekleriKur içinde bir kez yazılır: p.profil = {alt, rol, egilim, form, grup}.
     alt     türetilmiş alt özellikler 0–1 (Ek A); her birine adın özetinden ±0,08 kişisel sapma (aynı kadro, farklı oyuncu, farklı profil).
             ceviklik hrkCeviklik ile aynıdır (js/mac-hareket.js; hareket değişmez).
     rol     mevki grubuna göre 2–3 rolden profile en uygun olan (Ek B); kadro kaydındaki isteğe bağlı rol alanı ezer (ileride hoca seçer, 3.3).
     egilim  −1…+1 eğilimler (Ek B): özelliklerden türetilir, rolün varsayılanı eklenir; kadro kaydındaki isteğe bağlı egilimler alanı ezer.
     form    gün formu (±formSapma): tohum, takım ve forma numarasının özetinden; m.rast TÜKETİLMEZ (çekiliş sırası değişmez). Kadro kaydındaki
             isteğe bağlı form alanı ezer (kariyer kapısı: moral ve form Aşama 3'te buradan gelir).
   Kullanım yerleri (T3; her biri mevcut bir ifadenin yerine): çalışkanlık (mac-dizilis), seçim ve sabır (mac-karar kararVer, sabirEsigi,
   sutSecenegi, tekVurusKarari), rakibi geç seçeneği (T4: profilEgilimPuani 'gec'; hareketin yeteneği hrkYetenek), müdahale isteği ve faul çekilişleri (mac-mudahale; çekilişler T5'te
   kalkar, agresiflik girdi olarak kalır), duran top görevlileri (mac-kurallar kullananSec, durusYerlesim). Sonraki turlar aynı kapıyı okur
   (T4 hareket listesi, T7 topsuz rol, T8 duran top görevleri, T9b zayıf ayak, T10 disiplin).
   Senaryolar oyuncunun oz değerlerini değiştirirse profilKur(p, m.tohum) yeniden çağrılır (araclar/senaryolar/p-tip.js, c-1v1.js …). */
'use strict';
ayarEkle('P',{
  egilimGuc:1.0,               // T3: eğilimin karar seçeneğine eklediği puan (|eğilim| = 1'de; puan = gol olasılığı × 100). Gumbel sapması 0,15–0,3 puan.
                               // C5 (2026-10-22): 0,5 → 1,0 (p-tip: eğilim kanatta gürültünün üstünde, dört çiftte TVD ≥ 0,15; 1,5'te forvette seviye ÷ profil 0,81)
  egilimGoreli:1,              // C3 (2026-10-22): eğilim ve rol oyuncunun kendi ortalamasına göre (κ): r = 0,5 + κ·(10 saha özelliğinin ortalaması − 0,5) referans olur;
                               // aynı şeklin güçlüsü ve zayıfı aynı zihniyetle oynar (karar 22), seviye isabet, hız ve kapıdan gelir. 0: mutlak (eski)
  uzunEgilim:1,                // C3: uzunPasAtar eğilimi ileri uzun pasa (L 28–40 m ile artar) pay verir (profilEgilimPuani); 0: eski
  cikisEgilim:1,               // C3: oynayarakCikar eğilimi kendi yarısından (u < −10) ileri pasa (≥ 10 m) ve ileri ≥ 5 m taşımaya pay verir (oyun kuran stoper); 0: eski
  formSapma:0.04               // T3: gün formunun ±payı (çarpan 1 ± formSapma)
});
/* ---- Ek A: alt özellikler. [ad, {kaynak: ağırlık}, sabit]. Kaynak: oz anahtarı, daha önce türetilmiş alt özellik ya da özel kaynak
   (hafiflik = 1 − kütle01, kutle = kütle01, kararTers = 1 − karar, bitirme = forvette şut / diğerlerinde pas, boy). Sıra önemlidir ---- */
const PRF_ALT=[
  ['cabukluk',{hiz:0.55,hafiflik:0.25,surus:0.2}],
  ['ceviklik',null],                                   // hrkCeviklik(p): 0,5 sürüş + 0,3 hız + 0,2 hafiflik (sapmasız; hareket değişmez)
  ['guc',{sertlik:0.5,kutle:0.5}],
  ['denge',{guc:0.4,ceviklik:0.3,sertlik:0.3}],
  ['sicrama',{kafa:0.6,hiz:0.2,guc:0.2}],
  ['ilkDokunus',{surus:0.55,pas:0.45}],
  ['sogukkanlilik',{karar:0.6,bitirme:0.4}],
  ['sezgi',{karar:0.5,gorus:0.5}],
  ['pozisyonAlma',{mudahale:0.5,karar:0.5}],
  ['topsuzHareket',{gorus:0.4,karar:0.3,hiz:0.3}],
  ['yaraticilik',{gorus:0.5,surus:0.3,pas:0.2}],
  ['caliskanlik',{dayaniklilik:0.6,sertlik:0.2,karar:0.2}],
  ['agresiflik',{sertlik:0.7,kararTers:0.3}],
  ['zayifAyak',{ilkDokunus:0.4},0.35],                 // iki ayaklıda 1
  ['duranTop',{pas:0.5,sut:0.3,gorus:0.2}],
  ['orta',{pas:0.6,surus:0.2,gorus:0.2}],
  ['sutGucu',{sut:0.6,guc:0.4}],
  ['tutarlilik',{karar:0.4},0.5]
];
/* ---- Ek B: roller. Grup → [ad, uyum ağırlıkları]; uyum = Σ w·(değer − 0,5), en yüksek seçilir ---- */
const PRF_ROLLER={
  KL:[['cizgiKalecisi',{kalecilik:0.6,karar:0.4}],['supurucu',{hiz:0.5,karar:0.3,pas:0.2}]],
  stoper:[['sertStoper',{mudahale:0.5,sertlik:0.3,kafa:0.2}],['oyunKuranStoper',{pas:0.5,gorus:0.3,surus:0.2}]],
  bek:[['savunmaciBek',{mudahale:0.6,pozisyonAlma:0.4}],['bindirenBek',{hiz:0.4,dayaniklilik:0.3,orta:0.3}]],
  merkez:[['kesici',{mudahale:0.5,caliskanlik:0.3,sertlik:0.2}],['oyunKurucu',{pas:0.4,gorus:0.4,yaraticilik:0.2}],['ikiYonlu',{dayaniklilik:0.4,sut:0.3,karar:0.3}]],
  kanat:[['cizgiKanadi',{hiz:0.4,orta:0.3,cabukluk:0.3}],['iceKatEden',{sut:0.4,surus:0.4,zayifAyak:0.2}],['oyunKuranKanat',{pas:0.4,gorus:0.4,yaraticilik:0.2}]],
  FV:[['hedefForvet',{kafa:0.4,guc:0.4,boy:0.2}],['firsatci',{sut:0.4,topsuzHareket:0.3,cabukluk:0.3}],['derineGelen',{pas:0.4,gorus:0.3,yaraticilik:0.3}]]
};
/* rolün eğilimlere eklediği varsayılan (−1…+1 ölçeğinde) */
const PRF_ROL_EGILIM={
  cizgiKalecisi:{},supurucu:{oynayarakCikar:0.3},
  sertStoper:{sikiMarkaj:0.3,kayarakGirer:0.3,oynayarakCikar:-0.5,uzaktanVurur:-0.3},
  oyunKuranStoper:{oynayarakCikar:0.5,topuTutar:0.2,oldurucuPas:0.2,topuSurer:0.2},
  savunmaciBek:{sikiMarkaj:0.3,topuAtipKosar:-0.2,cizgiyeIner:-0.2},
  bindirenBek:{topuAtipKosar:0.3,cizgiyeIner:0.4},
  kesici:{sikiMarkaj:0.4,kayarakGirer:0.3,tekVurus:0.3,oldurucuPas:-0.3,uzaktanVurur:-0.2,topuSurer:-0.3},
  oyunKurucu:{yonDegistirir:0.5,oldurucuPas:0.4,topuTutar:0.2},
  ikiYonlu:{uzaktanVurur:0.5,cezaSahasinaGecGirer:0.5},
  cizgiKanadi:{topuAtipKosar:0.5,cizgiyeIner:0.5,iceKatEder:-0.3,topuSurer:0.3},
  iceKatEden:{iceKatEder:0.6,uzaktanVurur:0.4,cizgiyeIner:-0.3,topuSurer:0.4},
  oyunKuranKanat:{oldurucuPas:0.4,yonDegistirir:0.3,topuTutar:0.2,topuAtipKosar:-0.3,uzaktanVurur:0.1},
  hedefForvet:{sirtiDonuk:0.5,kanallaraKosar:-0.3,derineGelir:-0.2,topuSurer:-0.3,uzaktanVurur:-0.3},
  firsatci:{tekVurus:0.4,kanallaraKosar:0.3,topuTutar:-0.3,uzaktanVurur:-0.4},
  derineGelen:{derineGelir:0.5,oldurucuPas:0.3,sirtiDonuk:-0.3,uzaktanVurur:0.1}
};
/* ---- Ek B: eğilimler. [ad, {kaynak: ağırlık}]; eğilim = clamp(3·Σ w·(değer − ref) + rolün varsayılanı, −1, 1); ref 0,5, egilimGoreli > 0 iken oyuncunun kendi seviyesi (C3).
   Bugün okunanlar: topuTutar, topuSurer, tekVurus, oldurucuPas, yonDegistirir, uzaktanVurur, topuAtipKosar, cizgiyeIner, sirtiDonuk,
   kayarakGirer, sikiMarkaj, oynayarakCikar; C3'ten beri falsoluPas (mac-topla falsoKatsayi) ve uzunPasAtar (profilEgilimPuani). Ötekiler sonraki turların kapısıdır (T7 koşular, T9b vuruş, T10 itiraz) ---- */
const PRF_EGILIMLER=[
  ['topuTutar',{surus:0.5,sogukkanlilik:0.3,cabukluk:-0.2}],
  ['topuSurer',{surus:0.6,cabukluk:0.2,pas:-0.2}],
  ['tekVurus',{karar:0.4,pas:0.3,surus:-0.3}],
  ['oldurucuPas',{gorus:0.5,yaraticilik:0.3,pas:0.2}],
  ['yonDegistirir',{gorus:0.4,pas:0.4,sogukkanlilik:0.2}],
  ['uzaktanVurur',{sut:0.3,sutGucu:0.3}],              // rol belirler (iki yönlü, içe kat eden); forvet kutuda bekler
  ['plaseVurur',{sogukkanlilik:0.6,sut:0.4}],
  ['kaleciyiAsirtir',{yaraticilik:0.6,sogukkanlilik:0.4}],
  ['topuAtipKosar',{cabukluk:0.5,hiz:0.3,pas:-0.2}],
  ['iceKatEder',{sut:0.5,surus:0.5}],
  ['cizgiyeIner',{orta:0.5,hiz:0.3,cabukluk:0.2}],
  ['sirtiDonuk',{guc:0.5,denge:0.3,ilkDokunus:0.2}],
  ['kanallaraKosar',{topsuzHareket:0.5,hiz:0.3,cabukluk:0.2}],
  ['cezaSahasinaGecGirer',{topsuzHareket:0.4,sut:0.3,dayaniklilik:0.3}],
  ['derineGelir',{pas:0.4,gorus:0.3,kafa:-0.3}],
  ['kayarakGirer',{mudahale:0.4,agresiflik:0.4,karar:-0.2}],
  ['sikiMarkaj',{pozisyonAlma:0.4,caliskanlik:0.3,sertlik:0.3}],
  ['oynayarakCikar',{pas:0.4,sogukkanlilik:0.3,surus:0.3}],
  ['zayifAyaktanKacinir',{zayifAyak:-1}],
  ['hakemeItiraz',{agresiflik:0.6,karar:-0.4}],
  /* C3 (2026-10-22): sona eklendi (önceki 20 eğilim ve kişisel sapmalar aynı kalır) — falsoluPas pasın eğrisine (falsoProfil), uzunPasAtar ileri uzun pasa (uzunEgilim) */
  ['falsoluPas',{pas:0.4,duranTop:0.3,yaraticilik:0.3}],
  ['uzunPasAtar',{pas:0.4,gorus:0.3,sutGucu:0.3}]
];
/* FNV-1a (32 bit) + son karıştırma (murmur3 fmix: benzer kısa dizgiler de bütün aralığa yayılır) → [0, 1): ad özeti ve gün formu;
   rastlantı değil, aynı girdi aynı sonuç */
function profilOzet(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193);}
  h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return (h>>>0)/4294967296;}
/* kişisel sapma ±0,08: adın (ve forma numarasının) özetinden, alt özellik sırasına göre farklı */
function profilAdOzeti(ad,i){return (profilOzet(ad+'#'+i)-0.5)*0.16;}
/* mevki grubu: KL, stoper, bek, merkez, kanat, FV (yedekte mevki yoktur: stoper / merkez sayılır) */
function profilGrup(p){
  return p.rol==='GK'?'KL':p.rol==='DEF'?(p.mevki&&p.mevki.bek?'bek':'stoper'):p.rol==='FV'?'FV':(p.mevki&&p.mevki.kanat?'kanat':'merkez');}
/* profile en uygun rol (uyum = Σ w·(değer − ref), ref yoksa 0,5 — C3 egilimGoreli; eşitlikte ilk) */
function profilRolSec(grup,kaynak,ref){
  let en=null,eu=-1e9;for(const [ad,w] of PRF_ROLLER[grup]||PRF_ROLLER.merkez){let u=0;if(ref)for(const a in w)u+=w[a]*(kaynak(a)-ref(a));else for(const a in w)u+=w[a]*(kaynak(a)-0.5);if(u>eu){eu=u;en=ad;}}return en;}
/* oyuncunun profili (bir kez; oz değişirse yeniden çağrılır). tohum: gün formu için maçın tohumu */
function profilKur(p,tohum){
  const oz=p.oz||{},k=p.kayit||{},alt={},ad0=(p.name||'')+'#'+(p.no||0);
  const kut=clamp((kutle(p)-55)/45,0,1),boy01=clamp(((p.boy||1)-1)*5+0.5,0,1),o=a=>oz[a]!=null?oz[a]:0.5;
  const kaynak=a=>a in alt?alt[a]:a==='hafiflik'?1-kut:a==='kutle'?kut:a==='kararTers'?1-o('karar'):a==='bitirme'?(p.rol==='FV'?o('sut'):o('pas')):a==='boy'?boy01:o(a);
  PRF_ALT.forEach(([ad,w,sabit],i)=>{let v;
    if(!w)v=hrkCeviklik(p);
    else{v=sabit||0;for(const a in w)v+=w[a]*kaynak(a);v+=profilAdOzeti(ad0,i);}
    alt[ad]=clamp(v,0,1);});
  if(p.ayak==='iki')alt.zayifAyak=1;
  const grup=profilGrup(p),roller=PRF_ROLLER[grup]||PRF_ROLLER.merkez;
  /* C3 (egilimGoreli κ): referans oyuncunun kendi seviyesi — gövde ve tutarlılık kaynakları 0,5'te, kararTers 1 − r'de kalır */
  const kap=MOTOR_AYAR.egilimGoreli;let ref=null;
  if(kap&&grup!=='KL'){let s=0,c=0;for(const a of OZ_SIRA)if(a!=='kalecilik'){s+=o(a);c++;}const r=0.5+kap*(s/c-0.5);
    /* türetilmiş alt özelliklerin referansı: aynı ağırlıklarla, bütün özellikleri r olan (gövde kaynakları 0,5) oyuncunun değeri (gözden geçirme: seviye
       alt özelliklerden eğilime sızıyordu); zayıf ayak ve tutarlılık 0,5'te kalır (beceri sayılır); çeviklik hrkCeviklik gibi 0,5 sürüş + 0,3 hız + 0,2·0,5 */
    const b=a=>a==='hafiflik'||a==='kutle'||a==='boy'?0.5:a==='kararTers'?1-r:r,rA={zayifAyak:0.5,tutarlilik:0.5};
    for(const [ad,w,sabit] of PRF_ALT)if(!(ad in rA)){if(!w){rA[ad]=0.8*r+0.1;continue;}let v=sabit||0;for(const a in w)v+=w[a]*(a in rA?rA[a]:b(a));rA[ad]=v;}
    ref=a=>a in rA?rA[a]:b(a);}
  const rol=k.rol&&roller.some(r=>r[0]===k.rol)?k.rol:profilRolSec(grup,kaynak,ref);
  const egilim={},ro=PRF_ROL_EGILIM[rol]||{};
  for(const [ad,w] of PRF_EGILIMLER){let v=0;if(ref)for(const a in w)v+=w[a]*(kaynak(a)-ref(a));else for(const a in w)v+=w[a]*(kaynak(a)-0.5);egilim[ad]=clamp(3*v+(ro[ad]||0),-1,1);}
  if(k.egilimler)for(const ad in k.egilimler)if(ad in egilim)egilim[ad]=clamp(+k.egilimler[ad]||0,-1,1);
  const form=k.form!=null?clamp(+k.form,0.9,1.1):1+(profilOzet(tohum+':'+p.team+':'+(p.no||p.n))-0.5)*2*MOTOR_AYAR.formSapma;
  /* M1 (2026-10-10): anahtar anahtar kurulan eğilim nesnesi (20 anahtar) V8'de sözlük kipine düşüyor, her okuması yavaşlıyordu; kopyası hızlıdır
     (aynı anahtarlar, aynı sıra, aynı değerler) */
  return p.profil={alt:{...alt},rol,egilim:{...egilim},form,grup};
}
/* eğilimin karar seçeneğine eklediği puan (kararVer; saf). Şut: uzaktan vurma eğilimi 14 m'den sonra (sutSecenegi'nde ayrıca çarpan) */
function profilEgilimPuani(m,p,s){
  const pr=p.profil;if(!pr)return 0;const e=pr.egilim,g=MOTOR_AYAR.egilimGuc;
  switch(s.tur){
    case 'sut':{const d=m.dir[p.team],Lk=hyp(d*PL-m.ball.x,MZ-m.ball.z);return g*e.uzaktanVurur*clamp((Lk-14)/8,0,1);}
    case 'ara':return g*e.oldurucuPas;
    case 'pas':case 'uzun':{const v=s.hz!=null&&Math.abs(s.hz-m.ball.z)>=25?g*e.yonDegistirir:0,A=MOTOR_AYAR;
      if(!(A.uzunEgilim>0||A.cikisEgilim>0))return v;
      /* C3: uzun paslı 6 ileri uzun pası, oyun kuran stoper kendi yarısından ileri pası sever */
      const d=m.dir[p.team],il=(s.hx-m.ball.x)*d,u=m.ball.x*d;let w=v;
      if(A.uzunEgilim>0&&il>=0&&s.L!=null)w+=g*A.uzunEgilim*e.uzunPasAtar*clamp((s.L-28)/12,0,1);
      if(A.cikisEgilim>0&&u<-10&&il>=10)w+=g*A.cikisEgilim*0.5*e.oynayarakCikar;
      return w;}
    case 'tasi':{const v=g*(0.5*e.topuSurer+0.4*e.topuAtipKosar*(s.mesafe>=10?1:0.2)),d=m.dir[p.team];
      /* C3: topla çıkış yalnız ileri taşımaya (yönü ileriye 45°'den yakın; gözden geçirme: geri ve yan taşıma da pay alıyordu) */
      return MOTOR_AYAR.cikisEgilim>0&&m.ball.x*d<-10&&s.mesafe>=5&&s.hx!=null&&(s.hx-m.ball.x)*d>=0.7*s.mesafe?v+g*MOTOR_AYAR.cikisEgilim*0.5*e.oynayarakCikar:v;}
    case 'surukle':return g*(0.4*e.topuSurer+0.6*e.topuAtipKosar);   /* T22a: sürükleme — topu atıp koşan ve top süren */
    case 'bekle':return g*(0.8*e.topuTutar-0.4*e.tekVurus);
    case 'koru':return g*(0.5*e.topuTutar+0.5*e.sirtiDonuk);
    /* T4: rakibi geç — top süren ve (yarış hareketlerinde) topu atıp koşan */
    case 'gec':return g*(0.6*e.topuSurer+0.4*e.topuAtipKosar*(s.i>=0&&HRK_HAREKET[s.i].mek==='yaris'?1:0.3));
    case 'orta':case 'geriCevir':return g*0.5*e.cizgiyeIner;
    case 'uzaklastir':return -g*0.6*e.oynayarakCikar;
    default:return 0;}
}
/* alt özellik ya da eğilim okuma (profili olmayan varlık için yedek değer) */
const profilAlt=(p,ad,yedek)=>p.profil?p.profil.alt[ad]:yedek;
const profilEgilim=(p,ad)=>p.profil?p.profil.egilim[ad]:0;
