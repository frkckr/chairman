/* ============ Chairman — maç motoru: görüntüden bağımsız oyun mantığı ============
   Koordinatlar: x −52,5…52,5 (kaleler), z 0…68 (z=0 ana tribün tarafındaki taç çizgisi). Görüntü katmanı z'den 34 çıkarır.
   Zaman: motor sabit adımla (1/60 sn) ilerler. Hareketler gerçek hızdadır; maç saati 90/macSuresiDk kat hızlı akar (U1, 2026-10-12: maçın
   gerçek süresi MOTOR_AYAR.macSuresiDk; eskiden sabit GPR=9, 90 dk ≈ 10 dk).
   Evreler: isinma → giris → toren → selam → yazitura (maç günü: js/mac-oncesi.js) → kickoff → play ⇄ durus (taç, korner, aut,
   serbest vuruş, penaltı) / goal → halftime → … → fulltime.
   Oyuncunun gerçek bir bakış yönü (yon) vardır ve dönüşü sınırlıdır: hızlı koşarken yavaş döner, geri geri koşamaz.
   Topla her iş bir eylemdir: vuruşta önce hazırlık (hedefe dön, topu vuran ayağın önüne al), sonra geri salınım ve temas, sonra takip.
   Top fiziği: yuvarlanma, sekme, hava direnci, falso; direk, üst direk, ağ. Top sürme dokunuşlarla olur, aradaki anlarda top serbesttir.
   Top toplayıcılar (N10, kullanıcı kararı 2026-10-04): dışarı çıkan top yuvarlanıp panolarda durur; taç, korner ve autta en yakın çocuk
   elindeki yedek topu atana verir, eski topu boştaki çocuk toplar (js/mac-kurallar.js). 2.8O/MM0b'deki koniler kaldırıldı.
   Diziliş ve topsuz oyun js/mac-dizilis.js'te, topla karar js/mac-karar.js'te, kurallar ve duran toplar js/mac-kurallar.js'tedir.
   Faz 0 (2026-10-03) dosya sahipliği: hareket ve beden js/mac-hareket.js, ikili mücadele/faul/avantaj js/mac-mudahale.js, vuruş/pas/şut/ilk dokunuş
   js/mac-topla.js, kaleci js/mac-kaleci.js; bu dosya çekirdektir (top fiziği, aşamalar, temas sırası). Ayrıntı TEKNIK_PLAN §8.
   Olaylar on(ad, veri) ile bildirilir; görüntü bunları dinler. Rastgelelik tohumludur (this.rast): aynı tohum aynı maçı verir.
   MM1 (2026-10-02; fizik, temas, beden): topun yan (egri) ve üst/kesik (ust) dönüşü Magnus etkisi yaratır (falsolu şut, düşen sert şut,
   havada asılı kalan orta); kötü zeminde sekme düzensizdir. İlk dokunuş gelen topun hızının bir kısmını taşır, kafa vuruşu gelen hızı kullanır,
   erişemediği topa çarpan beden topu yansıtır (blok ve bacaktan sekme de yansımadır; hakem de engeldir). Oyuncuların kütlesi (boy, yapı, sertlik)
   çarpışmada momentumu paylaştırır; ivme düşük hızda güçlü, tepe hıza yaklaştıkça azalır; hava topunda oyuncu gerçekten sıçrar (p.yuk) ve
   temas anında en yükseğe ulaşan avantajlıdır. Yorgunluk hız, ivme, vuruş isabeti ve karar süresini etkiler; duraklamada ve devre arasında azalır. */
const PL=52.5,PW=68,MZ=34,GH=2.44,GW2=3.66,G=9.81;
/* ---- top fiziği (T9a, 2026-10-07; gerçekçilik planı §4 T9 "Top"): sürükleme hıza bağlı, dönüş açısal hızla ve doyan Magnus, sekmede dik
   geri sekme çarpma hızıyla azalır ve sürtünme itkisi kaymayı giderir, yerde kayma → yuvarlanma, koşul kapısı (ıslak, rüzgâr). Dönüş iki açısal
   hızla tutulur (wYan düşey eksen: falso; wUst enine eksen: üst/kesik dönüş; rad/sn); egri ve ust vuruşun girdisi ve her adımda dönüşten yeniden
   yazılan okunur alanlardır (çizim sözleşmesi: js/animasyon.js, js/kamera.js). Boylamsal bileşenin uçuşta etkisi olmadığından vektör yerine iki
   bileşen tutulur; sekmede yön değişimi için yan dönüşün ekseni eğik varsayılır (egikEksen). TEST değerleri ---- */
const TOP_YARICAP=0.11,DIREK_R=0.06;
const TOP_FIZIK={
  surukleYavas:0.025,surukleHizli:0.012,gecisHiz:14,gecisGen:1.5,     // hava direnci a = k(v)·v² (1/m): yavaş topta 0,025, hızlı topta 0,012; geçiş ~14 m/sn (Ek E)
  magnus:0.053,clEnCok:0.33,clS0:0.18,                                 // Magnus a = magnus·C_L(S)·v², C_L = clEnCok·S/(S + clS0), S = ω·r/v (doyar)
  yanOlcek:2.5,ustOlcek:1.0,donusSonum:0.1,                            // egri/ust → dönüş oranı (vuruş anındaki hızla); havada dönüşün saniyelik sönümü
  sekmeE:[0.65,0.45],sekmeEgim:0.0105,sekmeSurtunme:0.4,egikEksen:0.5, // dik geri sekme e = 0,65 − 0,0105·(vn − 2) (0,45–0,65); sürtünme μ; yan dönüşün eğik ekseni
  kayma:0.4,yerDirenc:0.0125,yuvarlanma:[1.5,0.6],                     // yerde kayma sürtünmesi (×g); yuvarlanan topun hava direnci (1/m); yuvarlanma yavaşlaması zemin 0 → 1 (m/sn²)
  islak:{kayma:0.55,sekme:0.85,yuvarlanma:0.8}                          // ıslak zemin çarpanları (T9a kapısı; görünümü §7.8, T10)
};
const ROLL=lerp(TOP_FIZIK.yuvarlanma[0],TOP_FIZIK.yuvarlanma[1],0.7),TOP_KOSUL_YOK={islak:0,ruzgar:null};
/* zeminden yuvarlanma yavaşlaması (zemin 0 tarla … 1 halı; ıslakta top daha uzun gider) */
function zeminYuvarlanma(zemin,islak){return lerp(TOP_FIZIK.yuvarlanma[0],TOP_FIZIK.yuvarlanma[1],clamp(zemin==null?0.7:zemin,0,1))*(islak?TOP_FIZIK.islak.yuvarlanma:1);}
const topSurukleme=v=>TOP_FIZIK.surukleYavas+(TOP_FIZIK.surukleHizli-TOP_FIZIK.surukleYavas)/(1+Math.exp(-(v-TOP_FIZIK.gecisHiz)/TOP_FIZIK.gecisGen));
const topKaldirma=S=>TOP_FIZIK.clEnCok*S/(S+TOP_FIZIK.clS0);
const CEZA_U=16.5,CEZA_W=20.16,ALTIPAS_U=5.5,ALTIPAS_W=9.16,PENALTI_U=11;
const MAC_ONCESI=['isinma','giris','toren','selam','yazitura'],DEVRE_ARASI=45;
/* oyuncu özellikleri (kadrolar.js'te 1–99 arası, aynı sırayla) */
const OZ_SIRA=['hiz','pas','sut','kafa','surus','mudahale','gorus','karar','kalecilik','dayaniklilik','sertlik'];
const VARSAYILAN_OZ=[62,58,55,55,56,55,55,56,8,66,50];
const VARSAYILAN_TAKTIK={dizilis:'4-4-2',sakin:0.5,direkt:0.5,risk:1,pres:0.5,tempo:0.5,ilerle:1,koruK:1};   /* B3: ilerle, koruK etkin taktikte tarzın iştahından (1: nötr) */
/* ayar katsayıları: araclar/mac-deneme.js ile hedef tabloya göre ayarlanır. Çekirdekte yalnız takım düzeni ayarlarının değeri vardır; her akış
   kendi dosyasında ayarEkle ile kendi anahtarlarının değerini atar (sahiplik; Faz 0, 2026-10-03).
   M1 (2026-10-10, hız): bütün anahtarlar burada, yüklenme sırasıyla bildirilir (akışlarınki undefined, değeri ayarEkle atar). Sonradan eklenen
   130'u aşkın anahtar V8'de nesneyi sözlük kipine düşürüyor, motorun her ayar okumasını yavaşlatıyordu; bildirilmiş nesne hızlı kalır, değerler
   aynıdır. Yeni anahtar: önce buraya (sahibinin satırına), sonra akışın ayarEkle'sine. ayarEkle bildirilmemiş ya da iki kez atanan anahtarda hata
   verir; araclar/motor-yukle.js yüklemeden sonra değeri atanmamış anahtarı hata sayar, araclar/ad-denetimi.js ikisini kaynakta denetler. */
const MOTOR_AYAR={
  macSuresiDk:20,              // U1 (2026-10-12, kullanıcı kararı; eskiden 10): maçın gerçek süresi (dk; uzatma ve devre arası hariç): maç saati 90/macSuresiDk kat hızlı akar (saatCarpani)
  gecis:0.7,                   // topu kaybeden takımın savunma düzenine geçme gecikmesi (sn)
  donus:0.75,                  // savunmaya dönüşte topa uzak oyuncunun hız oranı (birleştirme 2026-10-03: 0,85 → 0,75, koşu mesafesi)
  karsiPres:3.0,               // top kaybından sonra karşı pres süresi (sn; takımın pres ayarıyla 0,6–1,4 katı) (MM2)
  blokYumusak:4,               // T1: bölge hedefinin izlediği top yerinin yumuşatma süresi (sn; 0: ham): tehlikesiz yönde
  blokHizli:4,                 // T1: aynısı tehlikede (savunmada top kalemize gelirken, hücumda top ileri giderken)
  hucumGecikme:1,              // T1: hücumdaki takımın bölge oyuncuları da kişisel tepkiyle kayar: 1 topun gerisindekiler, 2 hepsi, 0 hiçbiri
  presHisterezis:1.5,          // T4: 1. adam seçimi kare kare değişmesin: önceki 1. adam yeni adaydan bu kadar (puan, ~m) kötü olmadıkça kalır
  yerFalso:0.5,                // T21a (2026-10-18): yerde kayan ve yuvarlanan topun yan dönüşü yolu kıvırır (eğik eksen; çimle sürtünme): yanal ivme = yerFalso × wYan·r
                               // (kayarken tam, yuvarlanırken yarısı); 0: eski (yerde yan dönüş yalnız söner — T9b-c'nin “top yerde dönmez” reddi)
  santraTek:1,                 // T20d (2026-10-18, kullanıcı kararı): santrada topun başında tek oyuncu (2016 kuralı), ilk pası geriye verir ve alıcıya dönük durur; 0: eski iki kişilik santra (yardımcı topun 2,8 m yanında)
  durusSaat:2,                 // Z2a (2026-10-19 gece, kullanıcı kararı "tempo B"): oyun dışında (duran top, gol, golden sonra santra) maç saatinin hızı (maç sn / gerçek sn);
                               // oyunda saatCarpani (20 dk'da 4,5). Duruşlar gerçeğin yarısına uzayınca oyunun maç dakikası azalmasın; 0: eski (her evrede saatCarpani)

  /* P — js/mac-profil.js */
  egilimGuc:undefined,formSapma:undefined,egilimGoreli:undefined,uzunEgilim:undefined,cikisEgilim:undefined,
  /* C — js/mac-hareket.js */
  ivme:undefined,hizAralik:undefined,ivmeRahat:undefined,frenRahat:undefined,yanRahat:undefined,varisRahat:undefined,sarsinti:undefined,sarsintiAzami:undefined,
  kipSure:undefined,kipDur:undefined,donusYerinde:undefined,dinlenUzak:undefined,hedefOlu:undefined,hedefOluAzami:undefined,kovalaPay:undefined,
  yorgunlukHiz:undefined,devreDinlenme:undefined,
  dinlenKos:undefined,tepkiCarpan:undefined,eforUs:undefined,kipKos:undefined,fren:undefined,yanTutus:undefined,enerjiHarca:undefined,
  enerjiTopla:undefined,yanTavan:undefined,geriTavan:undefined,donusSiniri:undefined,ayakBas:undefined,varisHizi:undefined,varisFren:undefined,
  jokeyMesafe:undefined,birebirYayilim:undefined,birebirErisim:undefined,birebirYaris:undefined,birebirKayma:undefined,birebirDonus:undefined,
  birebirVazgec:undefined,yutmaGuc:undefined,yutmaSure:undefined,destekSure:undefined,kapatYakin:undefined,dokunusSiklik:undefined,
  kovalaAtalet:undefined,kovalaSadik:undefined,gidisGovde:undefined,gidisAcik:undefined,gidisTopYakin:undefined,gidisMesafe:undefined,gidisHat:undefined,alisAcik:undefined,niyetDonus:undefined,dokunusUlas:undefined,vurusDonus:undefined,temasFren:undefined,temasHiz:undefined,govdeDinamik:undefined,donusIvme:undefined,bakOlu:undefined,donusGecikme:undefined,bakisOnce:undefined,bakisBekle:undefined,bakisBekleEfor:undefined,bakisBekleUzak:undefined,cruyff:undefined,cruyffKal:undefined,cruyffKanat:undefined,sirtGovde:undefined,sutHamle:undefined,blokErisim:undefined,sagSolAc:undefined,surusYetis:undefined,surusYuz:undefined,geriTopla:undefined,cizgiKoru:undefined,
  /* C — js/mac-mudahale.js */
  mudahaleIstegi:undefined,yanIstek:undefined,faulEsik:undefined,kutuIstek:undefined,sabirsiz:undefined,omuzGuc:undefined,kartEsik:undefined,
  acikIstek:undefined,kaymaIstek:undefined,taktikFaul:undefined,sariAtak:undefined,firsatKirmizi:undefined,elOlasilik:undefined,tutmaIstek:undefined,ortaTemas:undefined,blokGercek:undefined,govdeDar:undefined,
  /* C — js/mac-hava.js (T6) */
  sicramaDur:undefined,sicramaKos:undefined,sicramaHazir:undefined,sicramaZaman:undefined,sicramaYatay:undefined,havaIvme:undefined,havaOkuma:undefined,havaEgilme:undefined,havaDuello:undefined,havaKol:undefined,plonjon:undefined,plonjonHiz:undefined,plonjonYerde:undefined,kafaDonus:undefined,
  /* B — js/mac-topla.js */
  kararGecikme:undefined,ilerleme:undefined,risk:undefined,surusKarar:undefined,vurusHizalama:undefined,sutIstegi:undefined,ortaIstegi:undefined,ortaDevam:undefined,ortaKornerDeger:undefined,ortaBlokKorner:undefined,ortaEsik:undefined,cizgiyeIn:undefined,yerdenOrtaKesme:undefined,
  sutSapma:undefined,uzaklastirCizgi:undefined,pasSapma:undefined,sikisma:undefined,geriPas:undefined,geriPasAmac:undefined,geriPasK:undefined,kontrolZorluk:undefined,tekVurus:undefined,verKacIstegi:undefined,
  verKacDeger:undefined,boslukDeger:undefined,ikinciTop:undefined,havaDeger:undefined,araDeger:undefined,araDar:undefined,donusDeger:undefined,
  ofsaytAlgi:undefined,kosuIstegi:undefined,aliciPay:undefined,uzaklastirDeger:undefined,hedefDeger:undefined,devamAgirlik:undefined,
  devamHedef:undefined,sabir:undefined,sabirSure:undefined,devamPas:undefined,bekleOran:undefined,koruDeger:undefined,koruSure:undefined,
  koruTempo:undefined,dusunHz:undefined,pasTol:undefined,pasTolHava:undefined,ortaDestek:undefined,ikinciTopHedef:undefined,araKalib:undefined,birebirMenzil:undefined,birebirKayip:undefined,
  birebirDeger:undefined,devamBirebir:undefined,gucHata:undefined,sutHiz:undefined,kotuVurus:undefined,sutUzak:undefined,sutIkinci:undefined,sutIstekMesafe:undefined,xtKanat:undefined,sutDikey:undefined,duranSapma:undefined,duranUzak:undefined,ortaAyak:undefined,devamOrta:undefined,penaltiDurak:undefined,tasiInce:undefined,tasiDevam:undefined,bakisDinamik:undefined,bakisHiz:undefined,taramaAralik:undefined,taramaGenislik:undefined,taramaTut:undefined,taramaYan:undefined,bakisDonus:undefined,surukle:undefined,surukleKanat:undefined,sutYeni:undefined,gidisBakis:undefined,bakisHerKare:undefined,pasFalso:undefined,falsoProfil:undefined,pasEgriKat:undefined,uzunKosu:undefined,acmaDokunus:undefined,donusBos:undefined,ortaIkinci:undefined,ortaErken:undefined,tersKanat:undefined,vurusYaklas:undefined,pasAcik:undefined,pasDogal:undefined,alisYon:undefined,alisNiyet:undefined,alisCizgi:undefined,tekKoni:undefined,
  vurusDil:undefined,
  pasAile:undefined,pasAileHiz:undefined,pasTavan:undefined,pasZaman:undefined,pasPasif:undefined,pasAsim:undefined,pasEgri:undefined,pasPlase:undefined,pasKalkis:undefined,ortaEgriKat:undefined,alcakPas:undefined,uzakAmac:undefined,uzakBlok:undefined,uzakBlokKay:undefined,uzakTac:undefined,uzakKorner:undefined,uzakTehlike:undefined,uzakPay:undefined,uzakTarz:undefined,uzakIleri:undefined,uzakSerit:undefined,uzakAdimL:undefined,uzakHaz:undefined,uzakGeri:undefined,kaleciHata:undefined,kaleciAgiz:undefined,uzakKafaVy:undefined,
  /* D — js/mac-kaleci.js */
  kurma:undefined,kvBekle:undefined,kvPres:undefined,kvKurmaU:undefined,
  kaleciTepki:undefined,kaleciErisim:undefined,kaleciUcus:undefined,kaleciTutma:undefined,kaleciCikis:undefined,penaltiOku:undefined,penaltiKanma:undefined,penaltiBakis:undefined,kaleciNiyet:undefined,kaleciNiyetEsik:undefined,kaleciBekle:undefined,kaleciEgri:undefined,
  /* T — js/mac-takim.js */
  niyetEtki:undefined,macDurumEtki:undefined,niyetYenile:undefined,kontraSure:undefined,kurmaStoperW:undefined,gerideEk:undefined,rakipAlgi:undefined,
  kosuTetik:undefined,kosuRastgele:undefined,kosuEs:undefined,zon14:undefined,govdeAc:undefined,osDestek:undefined,presTetikSure:undefined,
  presTetikMesafe:undefined,golgePres:undefined,kosucuTakip:undefined,hatCik:undefined,kutuSavunma:undefined,kutuKapiAnlik:undefined,kompakt:undefined,
  mdhTahminEtki:undefined,takipSayi:undefined,donenUzak:undefined,kapatKalici:undefined,markajKalici:undefined,kosuSil:undefined,yorgunBlok:undefined,yorgunPres:undefined,yorgunKosu:undefined,yorgunKip:undefined,guvenEtki:undefined,guvenRisk:undefined,guvenSure:undefined,evGuven:undefined,
  kanatRol:undefined,kanatBas:undefined,kanatCizgi:undefined,kanatDerin:undefined,kanatOnde:undefined,kanatUzak:undefined,gecGiris:undefined,
  tutEtki:undefined,kovala2Pay:undefined,kapatSon:undefined,kapiFaz:undefined,
  /* Z — js/mac-plan.js (Z1, 2026-10-19: plan katmanı; js/mac-ilkeller.js ilkel tablosu, js/mac-tarz.js tarz iskeleti) */
  plan:undefined,planDeger:undefined,planTavan:undefined,planTut:undefined,planSabir:undefined,planArka:undefined,planIstek:undefined,planHiz:undefined,planEs:undefined,planTeklif:undefined,planRed:undefined,planTarz:undefined,tarzEtki:undefined,tarzGecis:undefined,tarzIstah:undefined,tarzSabir:undefined,tarzSabirZincir:undefined,tarzSecim:undefined,tarzTalimat:undefined,tarzUzun:undefined,tarzYanUzun:undefined,uzunBakis:undefined,uzunHaz:undefined,verKacKalkis:undefined,verKacTarz:undefined,bindirme:undefined,bindirmeDeger:undefined,surenCik:undefined,geriKosu:undefined,karsiKarar:undefined,sutKaleci:undefined,sutEgilim:undefined,tarzArka:undefined,
  /* Kurallar — js/mac-kurallar.js (T10b: hakem kişiliği) */
  hakemSabit:undefined,hakemFaul:undefined,hakemKart:undefined,hakemYorgun:undefined,hakemGeriDon:undefined,itirazKart:undefined,kartliHosgoru:undefined,evEtki:undefined,ofsaytLag:undefined,ofsaytHata:undefined,ofsaytPay:undefined,
  ofsaytBayrak:undefined,ofsaytBekle:undefined,
  /* K — js/mac-durantop.js (T8) */
  duranSure:undefined,duranHazir:undefined,duranYerinde:undefined,duranGeri:undefined,penaltiSure:undefined,hizliSerbest:undefined,kornerKutu:undefined,
  kornerKisa:undefined,duranKosFaz:undefined,duranRolSure:undefined,barajZipla:undefined,barajZiplaZaman:undefined,serbestDevam:undefined,serbestOrta:undefined,serbestRutin:undefined,serbestTau:undefined,penaltiSapma:undefined,
  serbestIkili:undefined,serbestAldatma:undefined,aldatmaTepki:undefined,kornerPerde:undefined,kornerGeri:undefined,markajYan:undefined,penaltiKose:undefined,
  /* K — Z2 (2026-10-19 gece): duran top sahnesi (js/mac-durantop.js) */
  sahne:undefined,tempo:undefined,tempoBaglam:undefined,tempoSapma:undefined,duranYay:undefined,kornerIce:undefined,kornerRutin:undefined,kornerOncelik:undefined,
  yatanBaraj:undefined,barajYani:undefined,uzakDolum:undefined,tacPres:undefined,tacSayim:undefined,
  /* S — js/mac-sakatlik.js (T10c) */
  sakatTemas:undefined,sakatKas:undefined,sakatKramp:undefined,tedaviSure:undefined,tedaviDonus:undefined,
  /* S1 — js/mac-sahne.js (S1, 2026-10-20: sahne protokolleri; bit maskesi S1_BIT, parametre anahtarları kendi alt adımında) */
  protokol:undefined,seremoni:undefined,kartAyar:undefined,penaltiSahne:undefined,golTempo:undefined,kRutin:undefined
};
const MOTOR_AYAR_SAHIBI={macSuresiDk:'cekirdek',gecis:'cekirdek',donus:'cekirdek',karsiPres:'cekirdek',blokYumusak:'cekirdek',blokHizli:'cekirdek',hucumGecikme:'cekirdek',presHisterezis:'cekirdek',santraTek:'cekirdek',yerFalso:'cekirdek',durusSaat:'cekirdek'};
function ayarEkle(akis,o){for(const k in o){
  if(!Object.prototype.hasOwnProperty.call(MOTOR_AYAR,k))throw new Error('MOTOR_AYAR.'+k+' bildirilmemiş ('+akis+'; önce js/mac-motoru.js MOTOR_AYAR)');
  if(MOTOR_AYAR_SAHIBI[k])throw new Error('MOTOR_AYAR.'+k+' iki kez eklendi ('+MOTOR_AYAR_SAHIBI[k]+', '+akis+')');
  MOTOR_AYAR[k]=o[k];MOTOR_AYAR_SAHIBI[k]=akis;}}
/* U1 (2026-10-12): maç saatinin hızı (eski GPR; 10 dk'da 9) ve gerçek saniye başına tanımlı, 10 dakikalık maça göre ayarlanmış oranların
   (maç boyu yorgunluk, sakatlık tehlikesi) çarpanı: oran × sureOlcek aynı maç dakikasında aynı değeri verir (10 dk'da 1). Duran top, sakatlık
   duraklaması, sevinç gibi gerçek saniyeyle tanımlı süreler ölçeklenmez (izlenebilirlik kararları; gerçekçilik planı “U1”) */
const saatCarpani=()=>90/MOTOR_AYAR.macSuresiDk,sureOlcek=()=>10/MOTOR_AYAR.macSuresiDk;
/* Z2a (2026-10-19 gece, tempo B): bu adımda maç saatinin hızı — oyunda saatCarpani, oyun dışında (duran top, gol, golden sonra santra) durusSaat
   (0 iken her evrede saatCarpani; ifade birebir aynı kalır) */
const saatHizi=m=>m.phase!=='play'&&MOTOR_AYAR.durusSaat>0?MOTOR_AYAR.durusSaat:saatCarpani();
/* eylem adımları: eylem adı → işlev(p, e, dt), this maçtır; sahibinin dosyasında kaydedilir (Faz 0) */
const EYLEM_ADIM={};

/* ---- açı ve geometri yardımcıları (Math.hypot yavaş olduğu için karekökle) ---- */
const hyp=(a,b)=>Math.sqrt(a*a+b*b),hyp3=(a,b,c)=>Math.sqrt(a*a+b*b+c*c);
const aciNorm=a=>a-2*Math.PI*Math.floor((a+Math.PI)/(2*Math.PI));
const aciFark=(a,b)=>aciNorm(a-b);
function segD(px,pz,ax,az,bx,bz){const vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az;const L2=vx*vx+vz*vz||1;const t=clamp((vx*wx+vz*wz)/L2,0,1);return hyp(px-ax-vx*t,pz-az-vz*t);}
/* ortak yardımcılar (eskiden js/mac-karar.js'teydi; bütün akışlar kullanır) */
const sigma=x=>1/(1+Math.exp(-x));
/* baskı: en yakın rakibin yakınlığı (0 = serbest, 1 = üstünde) */
function baskiAltinda(m,p){let d=99;for(const o of m.teams[1-p.team])if(o.oyunda)d=Math.min(d,hyp(o.x-p.x,o.z-p.z));return clamp((4.5-d)/3.5,0,1);}
function enYakinRakip(m,x,z,t){let e=null,d=1e9;for(const o of m.teams[1-t])if(o.oyunda){const dd=hyp(o.x-x,o.z-z);if(dd<d){d=dd;e=o;}}return{o:e,d};}
/* ofsayt çizgisi: rakibin sondan ikinci oyuncusunun u'su (hücum eden takımın çerçevesinde) */
function ofsaytCizgisi(m,t){const d=m.dir[t],us=m.teams[1-t].filter(o=>o.oyunda).map(o=>o.x*d).sort((a,b)=>b-a);return Math.max(us[1]||0,0);}
/* kütle (kg): boy ve yapıdan; sertlik gövde mücadelesinde etkin kütleyi artırır. Hakemler sıradan bir yetişkin */
function kutle(p){if(p._kutle)return p._kutle;const y=(p.kayit&&p.kayit.yapi)||1,s=p.oz&&p.oz.sertlik!=null?p.oz.sertlik:0.5;
  return p._kutle=72*(p.boy||1)*(p.boy||1)*y*(0.85+0.3*s);}
/* başın o anki yüksekliği (m): ayakta boyla, sıçrarken p.yuk kadar yukarıda */
const kafaYuksekligi=p=>1.72*(p.boy||1)+0.12+(p.yuk||0);
function ozellikler(k){const v=(k&&k.oz)||VARSAYILAN_OZ,o={};OZ_SIRA.forEach((a,i)=>{o[a]=(v[i]!=null?v[i]:VARSAYILAN_OZ[i])/100;});return o;}
/* yerden vurulan (dönüşsüz) top önce KAYAR: yavaşlama μg, yüzey hızı 2,5 katı artar; hızı 5/7'ye inince YUVARLANIR (kayma yolu s1 = (24/49)·v0²/(2μg),
   süresi (2/7)·v0/μg). Yuvarlanırken v² mesafeyle üstel azalır (R yuvarlanma yavaşlaması, c hava direnci). Buradan hız, ilk hız ve süre: pas
   planlayıcısı (js/mac-karar.js) bunlarla fizikle tutarlı kalır. K: koşullar (ıslakta kayma uzar; verilmezse kuru) */
const yerKayma=K=>TOP_FIZIK.kayma*G*(K&&K.islak?TOP_FIZIK.islak.kayma:1);
function yerHiz(v0,s,R,K){const a=yerKayma(K),s1=(24/49)*v0*v0/(2*a);
  if(s<=s1){const w=v0*v0-2*a*s;return w>0?Math.sqrt(w):0;}
  const v1=v0*5/7,c=TOP_FIZIK.yerDirenc,k=(R||ROLL)/c,w=(v1*v1+k)*Math.exp(-2*c*(s-s1))-k;return w>0?Math.sqrt(w):0;}
function yerIlkHiz(L,varis,R,K){const a=yerKayma(K);
  const vk=Math.sqrt(varis*varis+2*a*L);if((24/49)*vk*vk/(2*a)>=L)return vk;   /* yalnız kayarak varır */
  /* kayma + yuvarlanma: yerHiz(v0, L) = varis için v0 (v0'da tekdüze artar); ikiye bölme, 16 adım (~0,001 m/sn). T8-0b (2026-10-11): arama
     [varis, 60] aralığında — eskiden alt sınır salt kaymanın çözümü vk idi; kayma 5/7 hızda bitip yuvarlanma daha az yavaşlattığından kök vk'nin
     altındadır, arama hep ~vk döndürüyordu: yerden pas planlanandan 0,3–0,6 m/sn hızlı varıyordu, yavaş varışlı uzun topta (top toplayıcının
     yuvarladığı, durdurulup geri verilen top) hata 2–5 m/sn idi (araclar: 13 m'de 1,2 m/sn istenen top 5,9 m/sn ile varıyordu) */
  let alt=varis,ust=60;for(let i=0;i<16;i++){const o=(alt+ust)/2;if(yerHiz(o,L,R,K)<varis)alt=o;else ust=o;}
  return (alt+ust)/2;}
function yerSure(v0,s,R,K){const a=yerKayma(K),s1=Math.min(s,(24/49)*v0*v0/(2*a));
  let t=(v0-Math.sqrt(Math.max(0,v0*v0-2*a*s1)))/a,v=yerHiz(v0,s1,R,K);const kalan=s-s1;if(kalan<=0)return t;
  const ds=kalan/4;for(let i=1;i<=4;i++){const v2=yerHiz(v0,s1+ds*i,R,K);if(v2<=0.05)return 99;t+=ds/((v+v2)/2);v=v2;}return t;}
/* pasın alıcıya varış hızı: kısa pas yumuşak, uzun pas sert */
const pasVarisHizi=L=>clamp(7+L*0.15,8,12);
/* vuruşun girdilerinden (egri, ust; vuruş anındaki hızla) açısal hızlar. Gerçek top her dokunuşta (surum) yeniden kurar; sürümü olmayan tahmin
   kopyaları (havadanCoz, kamera) okunur alanlardan her adımda yeniden kurar (okunur alanlar dönüşle tutarlı yazıldığından aynı sonuç) */
function topDonusHazirla(b){
  if(b.surum!==undefined&&b._donSurum===b.surum)return;
  const v=hyp3(b.vx,b.vy,b.vz)||1;b.wYan=(b.egri||0)*TOP_FIZIK.yanOlcek*v/TOP_YARICAP;b.wUst=(b.ust||0)*TOP_FIZIK.ustOlcek*v/TOP_YARICAP;b._donSurum=b.surum;
  b.sw=b.wUst*TOP_YARICAP;   /* yüzey hızı: yerde kayma ↔ yuvarlanma */
}
function topDonusYaz(b,v){const k=TOP_YARICAP/(v||1);b.egri=b.wYan*k/TOP_FIZIK.yanOlcek;b.ust=b.wUst*k/TOP_FIZIK.ustOlcek;}
/* tek adım top fiziği (gerçek top da tahmin de bununla ilerler). ucus: yere çarpmayı yok say (vuruş çözümü için). R: yuvarlanma yavaşlaması,
   K: koşullar {islak, ruzgar:{x,z}} (verilmezse kuru ve rüzgârsız) */
/* T5 (2026-10-09): süpürme — (ax,az)→(bx,bz) parçasında ilerleyen noktanın (cx,cz) merkezli R yarıçaplı çembere ilk girdiği oran (0–1); başta
   içerideyse 0, girmiyorsa −1 (direk ve üst direkte hızlı top bir adımda çarpışma yarıçapını atlamasın). Saf */
function topSupurmeT(ax,az,bx,bz,cx,cz,R){const dx=bx-ax,dz=bz-az,fx=ax-cx,fz=az-cz,c=fx*fx+fz*fz-R*R;if(c<=0)return 0;
  const a=dx*dx+dz*dz;if(a<1e-12)return -1;const k=fx*dx+fz*dz;if(k>=0)return -1;const d=k*k-a*c;if(d<0)return -1;
  const t=(-k-Math.sqrt(d))/a;return t<=1?t:-1;}
function topFizikAdim(b,dt,ucus,R,K){
  topDonusHazirla(b);K=K||TOP_KOSUL_YOK;
  if(ucus||b.y>0.001||b.vy>0.001){
    /* sürükleme havaya göre hızla (rüzgâr), katsayı hıza bağlı: yavaşlayan aşırtma ve asılan orta sonda "ölür" */
    const rw=K.ruzgar,rvx=b.vx-(rw?rw.x:0),rvz=b.vz-(rw?rw.z:0),v=hyp3(rvx,b.vy,rvz),k=topSurukleme(v)*v*dt;
    b.vx-=rvx*k;b.vy-=b.vy*k;b.vz-=rvz*k;
    /* Magnus: yan dönüş yana, üst dönüş aşağı (kesik yukarı); dönüş oranı S = ω·r/v hız düştükçe büyür, C_L doyar; dönüş yavaş söner */
    if(b.wYan){const S=Math.abs(b.wYan)*TOP_YARICAP/(v||1),a=TOP_FIZIK.magnus*topKaldirma(S)*v*v*Math.sign(b.wYan)/(hyp(rvx,rvz)||1);
      b.vx-=rvz*a*dt;b.vz+=rvx*a*dt;b.wYan*=1-TOP_FIZIK.donusSonum*dt;}
    if(b.wUst){const S=Math.abs(b.wUst)*TOP_YARICAP/(v||1);b.vy-=TOP_FIZIK.magnus*topKaldirma(S)*v*v*Math.sign(b.wUst)*dt;b.wUst*=1-TOP_FIZIK.donusSonum*dt;}
    b.vy-=G*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;
    if(!ucus&&b.y<=0){b.y=0;
      if(b.vy<-1.3){/* sekme: dik geri sekme çarpma hızıyla azalır; yatayda sürtünme itkisi (≤ μ·(1+e)·vn) kaymayı giderir — üst dönüşlü top ileri
           fırlar, kesik dönüşlü top frenler, yüzey hızı değişir; yan dönüşlü top eğik eksen varsayımıyla yana itilir (yön değiştirir); ıslakta düşük ve kaygan */
        const vn=-b.vy,isl=K.islak?1:0,e=clamp(TOP_FIZIK.sekmeE[0]-TOP_FIZIK.sekmeEgim*(vn-2),TOP_FIZIK.sekmeE[1],TOP_FIZIK.sekmeE[0])*(isl?TOP_FIZIK.islak.sekme:1);
        const J=TOP_FIZIK.sekmeSurtunme*(isl?TOP_FIZIK.islak.kayma:1)*(1+e)*vn,vh=hyp(b.vx,b.vz)||1,ux=b.vx/vh,uz=b.vz/vh;
        const sw=b.wUst*TOP_YARICAP,slip=vh-sw,sg=Math.sign(slip),m=Math.min(J,(2/7)*Math.abs(slip)),nv=vh-sg*m;b.wUst=(sw+2.5*sg*m)/TOP_YARICAP;
        const ys=b.wYan*TOP_YARICAP*TOP_FIZIK.egikEksen,ml=Math.min(J*0.5,(2/7)*Math.abs(ys))*Math.sign(ys);
        b.vx=ux*nv-uz*ml;b.vz=uz*nv+ux*ml;b.vy=vn*e;b.wYan*=0.7;}
      else b.vy=0;
      b.sw=b.wUst*TOP_YARICAP;}
    topDonusYaz(b,v);
  }else{
    b.y=0;b.vy=0;const s=hyp(b.vx,b.vz);
    if(s>0){/* kayma: yüzey hızı topun hızına yetişene kadar μg ile yavaşlar (yüzey hızı 2,5 katı artar; üst dönüşlü top ileri çıkar); sonra
         yuvarlanma: R + c·v² */
      const a=yerKayma(K),slip=s-b.sw;let ns;
      if(Math.abs(slip)>0.05){const f=a*dt*Math.sign(slip);if(Math.abs(slip)<=3.5*Math.abs(f)){ns=s-slip*(2/7);b.sw=ns;}else{ns=s-f;b.sw+=2.5*f;}}
      else{ns=Math.max(0,s-((R||ROLL)+TOP_FIZIK.yerDirenc*s*s)*dt);b.sw=ns;}
      b.vx*=ns/s;b.vz*=ns/s;
      /* T21a (yerFalso): yan dönüşlü top yerde de kıvrılır — eğik eksenli dönüşün çime sürtünmesi (kayarken tam, yuvarlanırken yarısı); hızı değiştirmez, yönü döndürür.
         Yön havadaki Magnus'la aynı (wYan > 0 hızı sola döndürür) */
      if(MOTOR_AYAR.yerFalso&&b.wYan&&ns>0.5){const k=MOTOR_AYAR.yerFalso*(Math.abs(slip)>0.05?1:0.5)*b.wYan*TOP_YARICAP*dt/ns,vx=b.vx;b.vx-=b.vz*k;b.vz+=vx*k;}
      b.wUst=b.sw/TOP_YARICAP;b.wYan*=1-1.5*dt;}
    else{b.sw=0;b.wUst=0;}
    b.x+=b.vx*dt;b.z+=b.vz*dt;topDonusYaz(b,hyp(b.vx,b.vz));
  }
}

class Match{
  /* secenek.kadro: [ev, konuk] (js/kadrolar.js), secenek.tunel: {x,z} tünel ağzı, secenek.tohum: rastgele tohumu,
     secenek.kulubeler: [{takim, koltuklar:[{x,z}], alan:{x,z}}] (motor koordinatı; verilmezse varsayılan),
     secenek.taraftarYeri / deplasmanYeri: {x,z,nx,nz} maç sonunda takımın alkışlayacağı tribünün önü (n: tribüne doğru birim yön) */
  constructor(on,secenek){
    secenek=secenek||{};this.on=on||(()=>{});this.kadro=secenek.kadro||null;this.hoca=typeof secenek.hoca==='function'?secenek.hoca:null;this.tunel=secenek.tunel||{x:0,z:-6};
    this.kulubeler=secenek.kulubeler||[0,1].map(t=>({takim:t,koltuklar:[0,1,2,3,4,5].map(i=>({x:(t?11.5:-11.5)-2.6+i*1.04,z:-5.75})),alan:{x:t?11.5:-11.5,z:-2.4}}));
    this.tohum=(secenek.tohum!=null?secenek.tohum:Math.floor(Math.random()*4294967296))>>>0;this.rast=tohumluRastgele(this.tohum);
    /* zemin 0 (tarla) – 1 (halı gibi): kötü zeminde top çabuk durur, sekmesi düzensizdir. T9a koşul kapısı: secenek.kosullar = {zemin, islak,
       ruzgar:{x,z} m/sn}; varsayılan kuru ve rüzgârsız (görünüm ve kullanım §7.8, T10). Pas planlayıcısı kuru varsayar */
    /* T10e: atmosfer 0–1 (statın doluluğu ve sesi; tarayıcıda maç günü tarifinden, js/mac-sahnesi.js): hakemin ev sahibi eğilimi ve deplasmanın
       güven tabanı. Ev sahibi takım 0 (secenek.evSahibi) */
    this.kosullar=Object.assign({islak:0,ruzgar:null,atmosfer:0.5},secenek.kosullar||{});this.evSahibi=secenek.evSahibi!=null?secenek.evSahibi:0;
    this.zemin=clamp(this.kosullar.zemin!=null?this.kosullar.zemin:secenek.zemin!=null?secenek.zemin:0.7,0,1);this.kosullar.zemin=this.zemin;
    this.R=zeminYuvarlanma(this.zemin,this.kosullar.islak);
    /* T10b: hakem kişiliği (secenek.hakem ya da tohumdan; js/mac-kurallar.js hakemKisilik) */
    this.hakem=hakemKisilik(secenek.hakem,this.tohum);
    /* B4: maçın tarz seçimi (js/mac-tarz.js tarzKur): [ev, konuk] arketip adı ya da harmanı; 'dagilim' tohumdan seçer (oyun ve mac-deneme); yoksa kadronun tarzı */
    this.tarzSec=secenek.tarz!=null?secenek.tarz:null;
    this.taraftarYeri=secenek.taraftarYeri||{x:0,z:PW-4,nx:0,nz:1};this.deplasmanYeri=secenek.deplasmanYeri||null;
    this.reset();
  }
  normal(){let u=0;while(u===0)u=this.rast();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*this.rast());}
  reset(){
    this.score=[0,0];this.half=1;this.gameSec=0;this.t=0;this.phase='kickoff';this.phaseT=0;this.dir=[1,-1];
    this.yaziTura=null;this.ilkSantra=0;this.tuneleGitti=false;this.celeb=null;this.durus=null;this.sahiplikNo=0;
    this._pkB=null;   /* K1: penaltıda kalecinin bakış kilidi (js/mac-topla.js taramaAdim; {p, by: taramanın bakışı, r: kilidin gövdeye göre açısı, k: son kare, tk: vurucu}) */
    this.ist={sut:[0,0],isabet:[0,0],korner:[0,0],tac:[0,0],kaleVurusu:[0,0],faul:[0,0],sari:[0,0],kirmizi:[0,0],ofsayt:[0,0],
      pas:[0,0],pasTamam:[0,0],pasYon:{ileri:0,yan:0,geri:0},uzunPas:0,havaTopu:0,uzatma:[0,0],degisiklik:[0,0],oyunda:0,toplam:0,sahiplik:[0,0]};
    this.shots=this.ist.sut;this.poss=this.ist.sahiplik;
    /* uzatmanın birikimi (maç saati sn; yarı başına: gol 50, değişiklik 30, kart 30 (U1; eskiden faul 15 + kart 15), penaltı 60, sakatlık 60/90,
       zaman geçirme kaybın üçte biri). T10d (T10 teşhisi
       hata 7): eski adı duranSure'ydi, MOTOR_AYAR.duranSure (duran topun hazırlığı) ile aynı adı taşıyordu */
    this.uzatmaBirikim=[0,0];this.added=[60,120];this.uzatmaIlan=[false,false];
    this.taktik=[0,1].map(t=>Object.assign({},VARSAYILAN_TAKTIK,this.kadro&&this.kadro[t].taktik));
    /* T7a: hocanın tabanı; taktik etkin taktiktir (taban + niyet + maç durumu; js/mac-takim.js) */
    this.taktikTaban=this.taktik.map(o=>Object.assign({},o));this._niyet=null;
    this.players=[];this.teams=[[],[]];
    for(let t=0;t<2;t++){const diz=DIZILISLER[this.taktik[t].dizilis]||DIZILISLER['4-4-2'];
      for(let n=0;n<11;n++){const p=this.oyuncuKur(t,n,this.kadro&&this.kadro[t].oyuncular[n],diz.mevkiler[n]);this.players.push(p);this.teams[t].push(p);}}
    /* hakemler: orta hakem, sağ yarının yan hakemi (karşı taç), sol yarının yan hakemi (ana tribün tacı) */
    this.refs=[this.hakemKur('ref',-6,26),this.hakemKur('lin',20,PW+1.3),this.hakemKur('lin',-20,-1.3)];
    this.topcular=this.topculariKur();this.disToplar=[];
    this.yedekleriKur();this.kenarKur();
    /* T10c: maçın kaydı (kariyer Aşama 3'te sonucKaydi ile okur) ve sağlıkçılar (js/mac-sakatlik.js) */
    this.kayit={goller:[],kartlar:[],sakatliklar:[],degisiklikler:[]};
    this.zgUyari=[0,0];   /* T10d: zaman geçirmede hakemin uyarısı (takım başına; js/mac-kurallar.js zamanGecirmeGoruldu) */
    this.guvenHazirla();   /* T10e: takım güveni (js/mac-takim.js) */
    this.ofsaytBekleyen=null;   /* T10d: bayrağı geç kalkacak ofsayt {p, t, x, z, fark, yanlis, g} (js/mac-kurallar.js ofsaytDokunus) */
    this.santraAcele=false;   /* T10d: gerideki takım topu ağdan alıp koştu: santra kurala göre (stepKick) */
    this._asist=null;this._santraS1=null;   /* S1c (js/mac-sahne.js): son tamamlanan pas {p, q, t} (dokunus yazar, gol okur) ve golden sonra düdüklü santra {t} (golDuduk yazar, stepKick okur) */
    this.yariSantra=true;   /* T16a: yarının ilk santrası hazırlanıyor — maç saati düdükle başlar (step; santraHazirla) */
    this._aldatmaT=null;   /* A4-1: barajlı serbest vuruşta aldatma koşusunun topun yanından geçtiği an (js/mac-durantop.js; kaleciTepkiSuresi okur) */
    this.sakatlikHazirla();
    this.ball={x:0,z:MZ,y:0,vx:0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,sonDokunan:null,sonTakim:0,hedefOyuncu:null,sut:null,pas:null,
      surum:0,agda:false,direk:false,px:0,py:0,pz:0,ortaBlok:null,hakemDegdi:null,
      /* T8-0: duran topun kullanımı {tur, p, t0, x, z, cikti, du}: durusKullan (ve santra) kurar, kullananın ilk dokunuşu 'kullanim' olayını yayar,
         başka oyuncunun dokunuşu siler (dokunus; js/mac-durantop.js) */
      kullanim:null,
      /* T9a: açısal hızlar (rad/sn), yüzey hızı (m/sn) ve dönüşün kurulduğu sürüm (topDonusHazirla) */
      wYan:0,wUst:0,sw:0,_donSurum:-1};
    this.kuralHazirla();
    this.oncesiHazirla();
  }
  /* bütün insanlar (oyuncu, hakem, top toplayıcı, yedek) aynı alanlarla başlar */
  varlik(tur,x,z,ek){
    return Object.assign({tur,kind:null,team:null,n:-1,rol:null,mevki:null,name:'',no:0,kaptan:false,kayit:null,oz:null,ayak:'sag',boy:1,
      x,z,vx:0,vz:0,spd:0,yon:0,maxSpd:7,tx:x,tz:z,hizOran:1,bak:null,yonHedef:null,eylem:null,kickCd:0,kararT:0,dokunT:0,surus:null,
      oyunda:false,cikiyor:false,kart:0,yorgunluk:0,destek:null,kosu:null,gorev:null,sevinc:false,hedef:null,tutus:null,_cikis:null,_asim:0,_ortaBlokT:-9,
      ilkSoruldu:-1,penaltiTahmin:0,ev:null,top:false,topBos:0,kartSira:null,kartKuyruk:null,sakat:null,topal:null,tedavide:false,guven:0,isiniyor:false,isinma:null,gir:0,_kar:null,oturuyor:false,koltuk:null,cikti:false,poz:null,sg:null,yuk:0,zipla:null,
      /* motor → çizim sözleşmesi (Faz 0; TEKNIK_PLAN §8): tavır, bakış yönü, denge, sprint enerjisi, son dokunuş */
      tavir:null,bakisYon:null,denge:1,enerji:1,sonDokunus:null,
      /* T3 (profil kapısı): oyuncu ve yedekte profilKur ile dolar {alt, rol, egilim, form, grup} (js/mac-profil.js); hakem ve top toplayıcıda null */
      profil:null,
      /* T1 (insan gibi hareket): efor 0–1, hız kipi (dur/yuru/tiris/kos/hizli/depar; çizim okur), son düşünme anı (sn) */
      efor:1,kip:'dur',dusunT:0,
      /* T13-0 (2026-10-13): oyuncunun bu karedeki görevi (takimAI, bolgeKonumu, durusYerlesim yazar: kovala, pres1, markaj, bolge …), önceki
         görevi ve görevin başladığı an (sn). Rastlantısız; ölçüm (araclar/olcumler/r-ivme.js, r-karne.js) ve T13 eforu okur, çizim okumaz */
      gorevAd:null,_gorevOnce:null,_gorevT:-9,
      /* A2a (2026-10-08): jest {tur: kol|isaret|itiraz|cagir|basEl|alkis|yonlendir|kolIki, t, sure, kol, hedef} — motor → çizim; yazan iş T7/T10, S1 (yonlendir kalecide S1a, kolIki S1e) */
      jest:null,
      /* T4 (2026-10-08, bire bir): çalım denemesi {o, hareket, taraf, faz 0 yaklaşma / 1 hazırlık / 2 geçme, ft, t0, kare, …} ve aldatılan
         savunmacının yanılgısı {yon, t, sure, siddet} — motor → çizim (js/mac-hareket.js) */
      calim:null,yutma:null,
      /* T8 (2026-10-11, duran toplar; js/mac-durantop.js): duran topta görevi {rol, hx, hz, hedef, …} — duruşta ve vuruştan sonra 6 sn (motor → çizim;
         T8-0'da yazılmaz) */
      duranRol:null,
      /* akışların oyuncuya sonradan yazdığı iç alanlar baştan (undefined) tanımlı: nesnenin biçimi değişmez, motor yavaşlamaz (birleştirme, 2026-10-03) */
      _cev:undefined,_hk:undefined,_kacKare:undefined,_kacX:undefined,_kacZ:undefined,_varisHiz:undefined,_varisKare:undefined,_tavirKare:undefined,
      _algS:undefined,_algVx:undefined,_algVz:undefined,_omuzT:undefined,_tmsS:undefined,_tmsT:undefined,_tepkiS:undefined,_tepkiJ:undefined,_acikBas:undefined,_acikKare:undefined,_gecS:undefined,_gecT:undefined,_destek:undefined,_destekK:undefined,
      _kp:undefined,_duz:undefined,_pen:undefined,_poz:undefined,_sonKurt:undefined,
      /* T6a: sıçramanın zamanlama hatası (top sürümü, sn; js/mac-hava.js sicramalar) */
      /* H1-0b (2026-10-15): T6a'nın yedi seyrek alanı tek nesnede (varlik 128 alan sınırı; TEKNIK_PLAN §8): S top sürümü, E zamanlama, D/L okuma
         derinlik/yanal, Ts/Ty/Td kafa temasının kesri, top − baş ve yatay uzaklığı */
      _hv:{S:-1,E:0,D:0,L:0,Ts:0,Ty:0,Td:0},
      /* H1 (2026-10-15): gövde dönüşünün ve bakışın durumu (js/mac-hareket.js hrkGovdeDon, js/mac-topla.js taramaAdim; çizim okumaz): w açısal
         hız (rad/sn), ok hedef tanımlı mı, hx son ham hedef, he etkin hedef, t0 hedef sıçramasının anı, yeni bakılan şeye yeniden yönelme sürüyor
         mu, bt bakışın yeni yöne önden gittiği sürenin bitiş anı */
      don:{w:0,ok:false,hx:0,he:0,t0:-9,yeni:false,bt:-9,gm:false,ya:1},   /* T23b: gm gidiş kipi (hrkGidis), ya arkadaki topa açılımın yanı */
      /* T7d: müdahale tahmininin önbelleği (çarpan, kare, rakip; js/mac-takim.js mudahaleTahminCarpani) */
      _mt:undefined,_mtK:undefined,_mtS:undefined,
      /* T1 iç alanları: kararlı hedef, efor karesi, kip ve süresi, son ivme (karede hız değişimi), düşünme aralığı (kare) */
      _hdfX:0,_hdfZ:0,_hdfK:-9,_eforK:-1,_kipI:0,_kipT:0,_iax:0,_iaz:0,_dusP:0},ek);
  }
  oyuncuKur(t,n,k,mevki){
    const oz=ozellikler(k),rol=mevki.cizgi==='KL'?'GK':mevki.cizgi;
    const p=this.varlik('oyuncu',0,MZ,{team:t,n,rol,mevki,name:k?k.ad:TEAMS[t].names[n],no:k?k.no:n+1,kaptan:!!(k&&k.kaptan),kayit:k||null,oz,
      ayak:(k&&k.ayak)||'sag',boy:(k&&k.boy)||1,yon:t?Math.PI:0,maxSpd:oyuncuTepeHiz(oz,rol==='GK'),oyunda:true});   /* C3: hizAralik (js/mac-hareket.js) */
    profilKur(p,this.tohum);   /* T3: alt özellikler, rol, eğilimler ve gün formu (js/mac-profil.js); rastlantı çekmez */
    return p;
  }
  hakemKur(kind,x,z){return this.varlik('hakem',x,z,{kind,maxSpd:7.2,oz:{hiz:0.6}});}
  focus(){const c=this.celeb,b=this.ball;if(this.phase==='goal'&&c&&c.scorer&&!c.own)return{x:c.scorer.x,y:1,z:c.scorer.z};
    const h=b.tasiyan;if(h)return{x:h.x,y:1,z:h.z};return{x:b.x,y:b.y,z:b.z};}
  minuteLabel(){
    if(this.phase==='halftime')return 'İY';if(this.phase==='fulltime')return 'MS';if(MAC_ONCESI.includes(this.phase))return '';
    const s=this.gameSec;
    if(this.half===1&&s>=2700)return '45+'+(Math.floor((s-2700)/60)+1);
    if(this.half===2&&s>=5400)return '90+'+(Math.floor((s-5400)/60)+1);
    return String(Math.floor(s/60)+1);
  }
  kaleci(t){return this.teams[t][0];}
  /* santra rolleri dizilişteki mevkiden gelir (MM2; eskiden sabit forma sırası 9/10/7): santrayı hedef forvet yapar, yanında ikinci forvet
     ya da 10 numara durur, ilk pası ortadaki (derin olmayan) orta saha alır. Oyuncu eksikse en uygun saha oyuncusu */
  santraci(t){const L=this.sahadakiler(t).filter(p=>p.rol!=='GK');
    return L.find(p=>p.mevki.hedef)||L.find(p=>p.rol==='FV')||L.find(p=>p.mevki.onOrta)||L.reduce((a,c)=>Math.abs(c.mevki.w-MZ)<Math.abs(a.mevki.w-MZ)?c:a);}
  santraYardimcisi(t){const s=this.santraci(t),L=this.sahadakiler(t).filter(p=>p.rol!=='GK'&&p!==s);
    return L.find(p=>p.rol==='FV'&&!p.mevki.kanat)||L.find(p=>p.mevki.onOrta)||L.find(p=>p.rol==='FV')||null;}
  santraAlici(t){const s=this.santraci(t),y=this.santraYardimcisi(t),L=this.sahadakiler(t).filter(p=>p.rol==='OS'&&p!==s&&p!==y);
    const uz=p=>Math.abs(p.mevki.w-MZ)+(p.mevki.derin?6:0)+(p.mevki.kanat?20:0);
    return L.length?L.reduce((a,c)=>uz(c)<uz(a)?c:a):this.sahadakiler(t).find(p=>p.rol!=='GK'&&p!==s)||s;}
  sahadakiler(t){return this.teams[t].filter(p=>p.oyunda);}

  /* ============ ana döngü ============ */
  step(dt){
    this.t+=dt;this.phaseT+=dt;this.kare=(this.kare||0)+1;
    if(this._tarzG)tarzGecisAdim(this);   /* B4b: maç içi tarz değişikliği (js/mac-tarz.js; yalnız komut varken) */
    /* T16a (2026-10-15): yarının ilk santrası hazırlanırken saat akmaz (ikinci yarıda oyuncular tünelden yürürken yarı 86 maç sn kaybediyordu);
       gol sonrası santrada akar (uzatmaya gol başına 50 sn girer) */
    const saat=this.phase!=='halftime'&&this.phase!=='fulltime'&&!MAC_ONCESI.includes(this.phase)&&!(this.yariSantra&&this.phase==='kickoff');
    if(saat){this.gameSec+=dt*saatHizi(this);this.ist.toplam+=dt;if(this.phase==='play')this.ist.oyunda+=dt;}
    this.hakemAI(dt);
    switch(this.phase){
      case 'isinma':this.stepIsinma(dt);break;
      case 'giris':this.stepGiris(dt);break;
      case 'toren':this.stepToren(dt);break;
      case 'selam':this.stepSelam(dt);break;
      case 'yazitura':this.stepYazitura(dt);break;
      case 'kickoff':this.stepKick(dt);break;
      case 'play':this.stepPlay(dt);break;
      case 'durus':this.stepDurus(dt);break;
      case 'goal':this.stepGoal(dt);break;
      default:this.stepBreak(dt);
    }
    if(['kickoff','play','durus','goal'].includes(this.phase)){this.kenarAI(dt);this.sakatlikAdim(dt);this.guvenAdim(dt);this.isinmaAdim(dt);}   /* T10c: sakatlık akışı (js/mac-sakatlik.js); T10e: güven (js/mac-takim.js), ısınan yedekler (js/mac-kurallar.js) */
    /* sıçramalar. T10c: maç boyu yorgunluk kısa duruşta azalmaz (eski dinlenme birikimi siliyordu; kısa toparlanma sprint enerjisindedir), devre
       arasında azalır (devreDinlen, js/mac-hareket.js) */
    for(const p of this.players)if(p.zipla)ziplaIlerle(p,dt);   /* T6a: kalkış hazırlığı, uçuş ve iniş (js/mac-hava.js) */
    this.topcuAI(dt);this.disToplarAdim(dt);
    if(saat)this.devreSonuKontrol();
  }

  /* T10c (2026-10-11; TEKNIK_PLAN §8 “maç sonucu sabit bir kayıt hâline gelir”): kariyere aktarılacak sonuç kaydı — skor, goller, kartlar,
     sakatlıklar (kaç gün), değişiklikler ve temel istatistik. Salt okunur kopya; kariyer Aşama 3'te maç kimliğiyle bir kez uygular */
  sonucKaydi(){const I=this.ist,K=this.kayit,s=I.sahiplik[0]+I.sahiplik[1]||1;
    return{skor:this.score.slice(),bitti:this.phase==='fulltime',goller:K.goller.map(o=>({...o})),kartlar:K.kartlar.map(o=>({...o})),
      sakatliklar:K.sakatliklar.map(o=>({...o})),degisiklikler:K.degisiklikler.map(o=>({...o})),
      ist:{sut:I.sut.slice(),isabet:I.isabet.slice(),korner:I.korner.slice(),faul:I.faul.slice(),sari:I.sari.slice(),kirmizi:I.kirmizi.slice(),
        ofsayt:I.ofsayt.slice(),sahiplik:[I.sahiplik[0]/s,I.sahiplik[1]/s]}};}

  /* maç öncesi, devre arası ve maç sonu (maç günü akışı) js/mac-oncesi.js'tedir */

  /* ============ santra ============ */
  santraKonumu(p,takim){
    const d=this.dir[p.team],k=dizilisKonumu(this.taktik[p.team].dizilis,p.n,0,MZ,p.team===takim);
    let u=Math.min(k.u,p.rol==='GK'?k.u:-1.2),w=k.w;
    if(p.team===takim&&p===this.santraci(takim)){u=-0.3;w=MZ-0.2;}
    else if(!MOTOR_AYAR.santraTek&&p.team===takim&&p===this.santraYardimcisi(takim)){u=-0.9;w=MZ+2.6;}   /* T20d: santraTek açıkken yardımcı dizilişteki yerinde */
    else if(p.team!==takim&&p.rol!=='GK'){const dz=w-MZ,dd=hyp(u,dz);if(dd<10){const s=10/(dd||1);u=-Math.abs(u*s||10);w=MZ+dz*s;}}
    return{x:u*d,z:w};
  }
  santraHazirla(takim,isinla){
    this._santraS1=null;   /* S1c: düdüklü santranın bayrağını yalnız golDuduk (bu çağrıdan sonra) kurar */
    this.phase='kickoff';this.phaseT=0;this.kickTeam=takim;this.durus=null;this.celeb=null;this.duranSonrasiBitir();   /* T8b */
    this.yariSantra=this.gameSec<=(this.half-1)*2700;   /* T16a: yarının başı (maç başı ya da devre arası sonrası; gol sonrası değil) */
    const b=this.ball;
    if(isinla||b.agda)this.topuSifirla(0,MZ);
    for(const p of this.players){
      if(!p.oyunda||p.sakat)continue;   /* T10c: yerdeki sakat tedavisini bekler */
      const k=this.santraKonumu(p,takim);p.tx=k.x;p.tz=k.z;p.hizOran=0.55;p.eylem=null;p.surus=null;p.kickCd=0;p.sevinc=false;p.kosu=null;p.destek=null;
      p.bak=b;p.yonHedef=null;
      if(isinla){p.x=k.x;p.z=k.z;p.vx=p.vz=0;p.yon=this.dir[p.team]>0?0:Math.PI;}
    }
    if(isinla){const r=this.refs[0];r.x=-6;r.z=26;}
  }
  stepKick(dt){
    this.taramaAdim(dt);   /* santrada da etrafa bakılır (bakış yönü ve algı güncel kalır) */
    const b=this.ball,tk=this.santraci(this.kickTeam);
    /* top orta noktada değilse santrayı yapacak oyuncu alır, orta noktaya koyar */
    const yerinde=hyp(b.x,b.z-MZ)<0.3&&!b.tasiyan&&b.y<0.05&&hyp(b.vx,b.vz)<0.2;
    if(!yerinde){
      if(b.tasiyan===tk){tk.tx=-0.35*this.dir[tk.team];tk.tz=MZ-0.25;tk.hizOran=0.5;if(hyp(tk.x,tk.z-MZ)<0.7)this.topuSifirla(0,MZ);}
      /* T10d: topu ağdan alan gerideki takımın oyuncusu orta noktaya koşup koyar */
      else if(b.tasiyan&&b.tasiyan.team===this.kickTeam&&b.tasiyan.rol!=='GK'){const c=b.tasiyan;c.tx=0;c.tz=MZ;c.hizOran=1;c.bak=null;if(hyp(c.x,c.z-MZ)<0.8){this.topuSifirla(0,MZ);
        /* T20d (santraTek): topu koyan oyuncu santracı değilse yerine döner (eskiden orta noktada kalıyordu: topun başında iki kişi) */
        if(MOTOR_AYAR.santraTek&&c!==tk){const k=this.santraKonumu(c,this.kickTeam);c.tx=k.x;c.tz=k.z;c.hizOran=0.8;}}}
      else if(!b.tasiyan){/* kalecinin gönderdiği topu santrayı yapacak oyuncu karşılar, eliyle ya da ayağıyla tutar */
        const k=this.yakalamaNoktasi(tk,2.2);tk.tx=k.x;tk.tz=k.z;tk.hizOran=0.8;tk.bak=b;
        if(hyp(b.x-tk.x,b.z-tk.z)<1.2&&b.y<2.2){b.tasiyan=tk;this.topDegisti();}}
    }else{const k=this.santraKonumu(tk,this.kickTeam);tk.tx=k.x;tk.tz=k.z;}
    this.hareketHepsi(dt);this.topAdim(dt);
    let hazir=yerinde;
    /* T10d: topu ağdan alıp koşan gerideki takımın santrasında kural yeter: herkes kendi yarısında, rakipler çemberin dışında (santracı yerinde) */
    /* S1c (js/mac-sahne.js golDuduk): golden sonra düdükle başlayan santra — hazırlık Law 8 kuralıyla (topun başında tek oyuncu, 3 m) */
    const S1=this._santraS1;
    if(hazir){const ac=this.santraAcele||!!S1,r1=S1?3:2;
      for(const p of this.players){if(!p.oyunda||p.sakat)continue;
        if(ac&&p!==tk){if(p.x*this.dir[p.team]>0.3||p.team!==this.kickTeam&&hyp(p.x,p.z-MZ)<9.15||MOTOR_AYAR.santraTek&&hyp(p.x,p.z-MZ)<r1){hazir=false;break;}}   /* T20d: topun başında tek kişi */
        else if(hyp(p.tx-p.x,p.tz-p.z)>1.3){hazir=false;break;}}}
    /* T8d: gerideyken ve süre azalmışken (acele) santra çabuk: 1,6 → 0,9 sn. T10c: tedavi ya da sedye sürerken santra bekler */
    if(!this.sakatlikBekletir()&&(hazir&&this.phaseT>(this.macDurumu(this.kickTeam).acele>0.5?0.9:1.6)||this.phaseT>22)){
      if(!yerinde)this.topuSifirla(0,MZ);
      const al=this.santraAlici(this.kickTeam),t0=this.t-this.phaseT;
      /* S1c: düdük santradan önce çaldı (golDuduk) — ikinci düdük yok, olayda dudukOnce */
      if(S1){this.on('kickoff',{team:this.kickTeam,half:this.half,dudukOnce:true});this._santraS1=null;}
      else{this.on('kickoff',{team:this.kickTeam,half:this.half});this.refs[0].eylem={ad:'duduk',t:0,sure:0.8};}
      this.phase='play';this.phaseT=0;this.santraAcele=false;this.yariSantra=false;this.kullanimBaslat('santra',tk,null,t0);   /* T8-0 */
      tk.x=-0.35*this.dir[tk.team];tk.z=MZ-0.25;tk.vx=tk.vz=0;tk.yon=this.dir[tk.team]>0?0:Math.PI;
      /* T20d: tek santracı geriye oynayacağı alıcıya yarı dönük durur (ayak içiyle geri pas; eskiden hücum yönüne bakıp 180° dönüyordu) */
      if(MOTOR_AYAR.santraTek)tk.yon=aciNorm(tk.yon+0.6*aciFark(Math.atan2(al.z-tk.z,al.x-tk.x),tk.yon));
      this.sahipYap(tk);this.vurusBaslat(tk,{tur:'pas',hx:al.x,hz:al.z,tip:'yer',alici:al});
    }
  }

  /* ============ oyun ============ */
  stepPlay(dt){
    const b=this.ball;
    if(b.sahip)this.ist.sahiplik[b.sahip.team]+=dt;
    this.bedenAdim(dt);    /* yorgunluk ve beden (mac-hareket.js) */
    this.taramaAdim(dt);   /* etrafa bakma (mac-topla.js) */
    if(MOTOR_AYAR.plan)this.planAdim(dt);   /* Z1: plan katmanı (js/mac-plan.js) — 0 iken çağrılmaz; plan 0 ve cizgiKoru 0 ile motor T23 ile birebir */
    this.takimAI(dt);
    this.topluAI(dt);
    this.hareketHepsi(dt);
    this.topAdim(dt);
    if(this.phase!=='play')return;
    this.temaslar(dt);
    if(this.phase!=='play')return;
    this.sinirlar();
    this.kuralAdim(dt);
  }

  /* ============ top ============ */
  topuSifirla(x,z){const b=this.ball;Object.assign(b,{x,z,y:0,vx:0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,agda:false,direk:false,endirekt:null,tac:null,ortaBlok:null,kullanim:null});b.surum++;}
  topDegisti(){this.ball.surum++;this._degisimT=this.t;}
  /* topun gelecekteki yolu (3,5 sn, 1/60 adım). Top her dokunuşta değişir; o zamana kadar hesap önbellekte kalır */
  topYolu(){
    const b=this.ball;
    if(this._yol&&this._yolSurum===b.surum&&this.t-this._yolT0<1.2)return this._yol;
    const s={x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:b.egri,ust:b.ust||0,wYan:b.wYan,wUst:b.wUst,sw:b.sw,surum:b.surum,_donSurum:b._donSurum},yol=[];
    for(let i=0;i<210;i++){topFizikAdim(s,1/60,false,this.R,this.kosullar);yol.push({x:s.x,y:s.y,z:s.z,v:hyp(s.vx,s.vz)});}
    this._yol=yol;this._yolSurum=b.surum;this._yolT0=this.t;return yol;
  }
  /* t saniye sonra top nerede */
  topTahmin(t){const yol=this.topYolu(),i=clamp(Math.round((this.t-this._yolT0+t)*60)-1,0,yol.length-1);return yol[i];}
  topAdim(dt){
    const b=this.ball;b.px=b.x;b.py=b.y;b.pz=b.z;
    if(b.tasiyan){const h=b.tasiyan,c=Math.cos(h.yon),s=Math.sin(h.yon),tac=h.eylem&&h.eylem.ad==='tac';
      /* T8b (2026-10-11): topu tutan kaleci kendi kale çizgisini geçmez — plonjonun ivmesi onu topla ağlara taşıyor, kendi kalesine gol
         sayılıyordu (kornerde 400'de 2). Kalecinin topu tuttuğu yer çizginin 0,45 m önünde kalır, geriye giden hızı kesilir */
      if(h.rol==='GK'&&Math.abs(h.z-MZ)<GW2+1){const d=this.dir[h.team];if(d*h.x+PL<0.45){h.x=-d*(PL-0.45);if(d*h.vx<0)h.vx=0;}}
      b.x=h.x+c*(tac?0.05:0.32);b.z=h.z+s*(tac?0.05:0.32);b.y=tac?2.05*h.boy:1.05*h.boy;b.vx=h.vx;b.vz=h.vz;b.vy=0;return;}
    const once=b.vy;
    topFizikAdim(b,dt,false,this.R,this.kosullar);
    /* kötü zeminde sekme düzensizdir: yön ve yükseklik biraz sapar (tahmin bunu bilmez; oyuncu gerçek sekmeye tepki verir) */
    if(once<-1.3&&b.vy>0&&b.y===0&&this.zemin<0.95){const k=1-this.zemin,a=this.normal()*0.16*k,c=Math.cos(a),s=Math.sin(a),vx=b.vx;
      b.vx=vx*c-b.vz*s;b.vz=vx*s+b.vz*c;b.vy*=clamp(1+this.normal()*0.18*k,0.6,1.4);this.topDegisti();}
    if(b.agda)this.agIcinde();
  }
  agIcinde(){
    const b=this.ball,sx=Math.sign(b.x);
    if(Math.abs(b.x)>PL+1.9){b.x=sx*(PL+1.9);b.vx*=-0.15;}
    if(Math.abs(b.z-MZ)>GW2-0.12){b.z=MZ+Math.sign(b.z-MZ)*(GW2-0.12);b.vz*=-0.2;}
    if(b.y>GH-0.12){b.y=GH-0.12;b.vy=-Math.abs(b.vy)*0.3;}
    b.vx*=0.97;b.vz*=0.97;
  }
  /* bir oyuncunun (ya da topun) kale ağzına ait çarpışmaları: direk, üst direk, yan ağ. Gol ise true */
  kaleCarpismalari(){
    const b=this.ball;
    for(const sx of[-1,1]){
      const gx=sx*PL,once=(b.px-gx)*sx,simdi=(b.x-gx)*sx;
      /* direkler: kale çizgisindeki iki dikey silindir. T5 (2026-10-09): süpürme — topun bu adımdaki yolu (önceki → şimdiki yer) silindire ilk
         girdiği anda çarpar (30 m/sn'lik şut adımda 0,5 m gider, çarpışma yarıçapı 0,17 m: anlık sınama direği atlayabiliyordu) */
      const RR=DIREK_R+TOP_YARICAP,cx=gx+sx*DIREK_R;
      if(Math.min(Math.abs(b.x-gx),Math.abs(b.px-gx))<0.6&&Math.min(b.y,b.py)<GH+0.1)for(const pz of[MZ-GW2-DIREK_R,MZ+GW2+DIREK_R]){
        const t=topSupurmeT(b.px,b.pz,b.x,b.z,cx,pz,RR);if(t<0)continue;
        const x=b.px+(b.x-b.px)*t,z=b.pz+(b.z-b.pz)*t,y=b.py+(b.y-b.py)*t;if(y>=GH+0.1)continue;
        const dx=x-cx,dz=z-pz,dd=hyp(dx,dz);if(dd<1e-4)continue;const nx=dx/dd,nz=dz/dd,vn=b.vx*nx+b.vz*nz;
        if(vn<0){b.vx-=1.55*vn*nx;b.vz-=1.55*vn*nz;b.x=cx+nx*RR;b.z=pz+nz*RR;b.y=y;this.direkVurdu();return false;}}
      /* üst direk (süpürme, x–y düzleminde; temas anında top kale genişliğinde) */
      if(Math.min(Math.abs(b.x-gx),Math.abs(b.px-gx))<0.6){const cy=GH+DIREK_R,t=topSupurmeT(b.px,b.py,b.x,b.y,cx,cy,RR);
        if(t>=0){const z=b.pz+(b.z-b.pz)*t;if(Math.abs(z-MZ)<GW2+0.1){const x=b.px+(b.x-b.px)*t,y=b.py+(b.y-b.py)*t,dx=x-cx,dy=y-cy,dd=hyp(dx,dy);
          if(dd>1e-4){const nx=dx/dd,ny=dy/dd,vn=b.vx*nx+b.vy*ny;
            if(vn<0){b.vx-=1.5*vn*nx;b.vy-=1.5*vn*ny;b.x=cx+nx*RR;b.y=cy+ny*RR;b.z=z;this.direkVurdu();return false;}}}}}
      /* çizgiyi geçti mi: topun tamamı kale çizgisinin ötesinde ve direklerin arasında, üst direğin altında */
      if(once<=TOP_YARICAP&&simdi>TOP_YARICAP&&!b.agda){
        const f=(TOP_YARICAP-once)/((simdi-once)||1),z=b.pz+(b.z-b.pz)*f,y=b.py+(b.y-b.py)*f;
        if(Math.abs(z-MZ)<GW2-TOP_YARICAP*0.2&&y<GH-TOP_YARICAP*0.2)return sx;
      }
      /* yan ağ: kale dışından gelen top ağa çarpar ("gol sandık") */
      if(simdi>0&&simdi<1.9&&b.y<GH&&!b.agda){const kz=Math.abs(b.z-MZ),okz=Math.abs(b.pz-MZ);
        if(okz>=GW2+0.05&&kz<GW2+0.05){b.z=MZ+Math.sign(b.z-MZ)*(GW2+0.06);b.vz*=-0.15;b.vx*=0.3;this.topDegisti();this.on('yanAg',{p:b.sonDokunan});}}
    }
    return false;
  }
  direkVurdu(){const b=this.ball;b.direk=true;if(b.sut)b.sut.direk=true;this.topDegisti();this.on('wood',{p:b.sonDokunan});}

  /* bir oyuncu topa dokundu (kimin son dokunduğu: taç/korner/aut ve ofsayt için) */
  dokunus(p,kasitli){
    const b=this.ball,K=b.kullanim;
    /* T8-0: duran topu kullananın ilk dokunuşu kullanımdır (vuruş, taç atışı, sürüş ya da elle alma; js/mac-durantop.js); başkasının dokunuşu biter */
    if(K){if(p===K.p){if(!K.cikti){K.cikti=true;this.kullanimBildir(p,K);}}else b.kullanim=null;}
    b.sonDokunan=p;b.sonTakim=p.team;b.hedefOyuncu=null;b.direk=false;
    if(b.endirekt&&p!==b.endirekt.p)b.endirekt=null;if(b.tac&&p!==b.tac.p)b.tac=null;
    if(b.pas&&p!==b.pas.p){if(p.team===b.pas.takim){this.ist.pasTamam[p.team]++;const A=this._asist||(this._asist={p:null,q:null,t:0});A.p=b.pas.p;A.q=p;A.t=this.t;}b.pas=null;}   /* S1c: asist kaydı (yalnız kayıt) */
    if(b.sut&&p!==b.sut.by)b.sut=null;
    this.ofsaytDokunus(p,kasitli);
    this.topDegisti();
  }
  /* sahiplikNo (T2): her yeni sahiplikte artar; topla kararın kişisel sapması sahiplik boyunca aynı kalır (kararVer) */
  sahipYap(p){const b=this.ball;b.sahip=p;b.tasiyan=null;p.surus=null;p.kararT=this.kararSuresi(p);this.sahiplikNo++;}


  /* ============ eylemler ============
     Her eylemin adımı sahibinin dosyasında EYLEM_ADIM'a kayıtlıdır (vuruş mac-topla.js, kayma/düşme/müdahale mac-mudahale.js, uçuş mac-kaleci.js,
     taç mac-kurallar.js). true dönen adım eylemin bitişini kendisi yönetmiştir; yoksa süresi dolan eylem biter (Faz 0) */
  eylemIlerle(p,e,dt){
    e.t+=dt;const f=EYLEM_ADIM[e.ad];
    if(f&&f.call(this,p,e,dt))return;
    if(e.t>=e.sure&&p.eylem===e)p.eylem=null;
  }
  pasSay(p,hx,hz,L,tur){
    const b=this.ball,d=this.dir[p.team],ileri=(hx-b.x)*d,yan=Math.abs(hz-b.z),a=Math.atan2(yan,ileri);
    this.ist.pas[p.team]++;b.pas={p,takim:p.team,t:this.t,tur,L,x0:b.x,z0:b.z,hx,hz};
    if(a<Math.PI/4)this.ist.pasYon.ileri++;else if(a>Math.PI*3/4)this.ist.pasYon.geri++;else this.ist.pasYon.yan++;
    if(L>=32)this.ist.uzunPas++;
    /* B1: takım sahipliği içinde ardışık geri pas sayısı (ilerleme < −4 m, kararın eşiği; js/mac-karar.js pasDegeri okur) */
    if(MOTOR_AYAR.geriPasAmac>0){const G=this._geriN||(this._geriN=[{bas:-1,n:0,c:0,u1:null},{bas:-1,n:0,c:0,u1:null}]),g=G[p.team];
      if(g.bas!==this._sahiplikBas){g.bas=this._sahiplikBas;g.n=0;g.c=0;g.u1=null;}if(ileri<-4)g.n++;else g.n=0;
      /* B1b (tarzSabir): amaçsız zincirin sayacı B0'nun tanımıyla — baskısız (pasöre en yakın rakip ≥ 4,5 m) ileri olmayan pas sayılır; 45° ileri pas,
         ≥ 5 m ilerleyen pas, baskılı pas ve iki pas arasında ≥ 5 m ileri taşıma sıfırlar */
      if(MOTOR_AYAR.tarzSabir>0){const u0=b.x*d;if(g.u1!=null&&u0-g.u1>=5)g.c=0;
        if(a<Math.PI/4||ileri>=5||enYakinRakip(this,b.x,b.z,p.team).d<4.5)g.c=0;else g.c++;g.u1=hx*d;}}
  }
  /* havadan vuruş: top T saniye sonra (hx,hy,hz)'de olsun; hava direnci ve falso ile, düzeltmeli çözüm */
  havadanCoz(x0,y0,z0,hx,hy,hz,T,egri,ust){
    let vx=(hx-x0)/T,vz=(hz-z0)/T,vy=(hy-y0+0.5*G*T*T)/T;const n=Math.max(1,Math.round(T*60));
    for(let k=0;k<3;k++){const s={x:x0,y:y0,z:z0,vx,vy,vz,egri,ust:ust||0};for(let i=0;i<n;i++)topFizikAdim(s,1/60,true,undefined,this.kosullar);
      vx+=(hx-s.x)/T;vy+=(hy-s.y)/T;vz+=(hz-s.z)/T;}
    return{vx,vy,vz};
  }
  /* şut çerçeveyi bulacak mı (kaleci ve oyuncular olmasa) */
  cerceveyeGider(t){
    const gx=this.dir[t]*PL,yol=this.topYolu();
    for(let i=1;i<yol.length;i++){const a=yol[i-1],c=yol[i];if((a.x-gx)*(c.x-gx)<=0){const f=(gx-a.x)/((c.x-a.x)||1),z=a.z+(c.z-a.z)*f,y=a.y+(c.y-a.y)*f;return Math.abs(z-MZ)<GW2&&y<GH;}}
    return false;
  }


  /* ============ temaslar: kontrol, araya girme, kafa, blok, kaleci ============
     Çekirdek yalnız sırayı tutar; işler sahip dosyalardadır: kaleci mac-kaleci.js, beden ve mücadele mac-mudahale.js, dokunuş mac-topla.js (Faz 0) */
  temaslar(dt){
    const b=this.ball;if(b.tasiyan)return;
    this.kaleciTemas();
    if(this.phase!=='play'||b.tasiyan)return;
    /* T5: orta bloğu topun bacağa vardığı anda (ortaBlok, js/mac-mudahale.js) */
    const OB=b.ortaBlok;if(OB){if(OB.surum!==b.surum||!OB.o.oyunda||OB.o.eylem&&OB.o.eylem.kilit)b.ortaBlok=null;else if(this.t>=OB.t){b.ortaBlok=null;this.ortaBlokUygula(OB);return;}}
    this.sicramalar();   /* T6a: sıçrama planı (js/mac-hava.js) */
    const ad=[],ks=b.sut&&b.sut.cerceve&&!b.sut.direk&&b.sonDokunan===b.sut.by?b.sut.team:-1;   /* T8f: direkten ya da bedenden dönen top oynanır */
    for(const p of this.players){
      if(!p.oyunda||p.kickCd>0)continue;const e=p.eylem;
      if(e&&(e.kilit||e.ad==='tac'))continue;
      /* T8b (2026-10-11): takım arkadaşının çerçeveye giden şutunu oynamaz (yolundaysa top bedenine çarpar: govdeCarpmasi). Kornerde kaleye giden
         kafa şutlarının %12'sine yoldaki arkadaş yeniden kafa vuruyordu (üçte biri gol); çerçeve dışına giden topu yine kaleye çevirebilir */
      if(p.team===ks)continue;
      const dx=b.x-p.x,dz=b.z-p.z,d=hyp(dx,dz);if(d>1.3)continue;
      const tur=this.erisim(p,d);if(tur)ad.push({p,d,tur});
    }
    /* topa erişemeyen beden: top ona çarpıp yansır */
    if(this.govdeCarpmasi(ad))return;
    if(!ad.length)return;
    /* top sürücünün kontrolündeyse rakip onu ancak müdahaleyle alır */
    if(this.surucuKoru(ad))return;
    if(this.sutBlok(ad))return;
    /* kaleci eliyle (ceza sahasında önceliklidir) */
    const el=ad.find(a=>a.tur==='el');if(el){this.kaleciYakala(el.p);return;}
    /* hava topu: kafa mücadelesi */
    const kafa=ad.filter(a=>a.tur==='kafa').sort((x,y)=>x.d-y.d);
    if(kafa.length){this.havaTopu(kafa);return;}   /* T6b: topa ilk değen baş (js/mac-hava.js) */
    const kazanan=this.kazananSec(ad);if(!kazanan)return;
    this.topaDokun(kazanan);
  }
  kendiCezaSahasinda(p,x,z){const gx=-this.dir[p.team]*PL;return Math.abs(x-gx)<CEZA_U&&Math.abs(z-MZ)<CEZA_W;}




  /* ============ oyun alanı sınırları: gol, taç, korner, aut ============ */
  sinirlar(){
    const b=this.ball;
    const gol=this.kaleCarpismalari();if(gol){this.gol(gol);return;}
    if(b.agda)return;
    if(b.tasiyan)return;
    const ax=Math.abs(b.x);
    if(ax>PL+TOP_YARICAP){
      const side=Math.sign(b.x),def=this.dir[0]===-side?0:1;
      this.topDisari();
      if(b.sonTakim===def)this.durusBaslat('korner',1-def,side*(PL-0.4),b.z<MZ?0.4:PW-0.4);
      else this.durusBaslat('kaleVurusu',def,side*(PL-ALTIPAS_U+0.5),MZ+(b.z<MZ?-4:4));
      return;
    }
    if(b.z<-TOP_YARICAP||b.z>PW+TOP_YARICAP){this.topDisari();this.durusBaslat('tac',1-b.sonTakim,clamp(b.x,-PL+0.5,PL-0.5),b.z<0?-0.15:PW+0.15);}
  }
  /* oyundaki top dışarı çıktı: yuvarlanmaya devam eder (panolarda durur); duran topu kim nasıl alacak durusBaslat'ta seçilir */
  topDisari(){
    const b=this.ball;
    for(const p of this.players){if(p.eylem&&p.eylem.ad==='vurus')p.eylem=null;if(p.calim)this.calimBitir(p,'disari',true);}
    b.sahip=null;b.sut=null;b.hedefOyuncu=null;b.pas=null;
    for(const t of[0,1]){const gk=this.kaleci(t);if(gk.eylem&&gk.eylem.ad==='ucus')continue;}
  }
  /* saha dışındaki top: reklam panoları (yanlarda 4,1 m, kale arkasında 5,2 m ötede) topu durdurur; üstünden aşan top tribüne gider (false).
     Kale ağına giden top ağın arkasında kalır */
  panoSiniri(o){
    if(o.z<-4.1&&o.vz<0){if(o.y>1.0)return false;o.z=-4.1;o.vz*=-0.25;}
    if(o.z>PW+4.1&&o.vz>0){if(o.y>1.0)return false;o.z=PW+4.1;o.vz*=-0.25;}
    if(Math.abs(o.x)>PL+5.2&&o.vx*Math.sign(o.x)>0){if(o.y>1.0)return false;o.x=Math.sign(o.x)*(PL+5.2);o.vx*=-0.25;}
    if(Math.abs(o.x)>PL&&Math.abs(o.x)<PL+2&&Math.abs(o.z-MZ)<GW2+0.1&&o.y<GH){o.vx*=0.5;o.vz*=0.5;}
    return true;
  }
  /* yedek top kullanılınca eski top saha dışında kalır: yuvarlanır, durur; en çok 4 tane görünür kalır (görevliler toplar) */
  disToplarAdim(dt){
    for(let i=this.disToplar.length-1;i>=0;i--){const o=this.disToplar[i];o.t+=dt;
      topFizikAdim(o,dt,false,this.R,this.kosullar);
      if(!this.panoSiniri(o)){this.disToplar.splice(i,1);continue;}
      /* panodan seken eski top sahaya geri yuvarlanmaz: çizginin 0,8 m dışında durur (N10; oyunda ikinci top olmaz) */
      if(Math.abs(o.x)<PL&&o.z>0&&o.z<PW){const dx=PL-Math.abs(o.x),dz=Math.min(o.z,PW-o.z);
        if(dx<dz)o.x=Math.sign(o.x||1)*(PL+0.8);else o.z=o.z<MZ?-0.8:PW+0.8;
        o.vx=o.vy=o.vz=0;o.y=0;}}
    while(this.disToplar.length>4)this.disToplar.shift();
  }

  /* ============ gol ============ */
  gol(side){
    const b=this.ball,def=this.dir[0]===-side?0:1,att=1-def;
    /* dolaylı serbest vuruş başka bir oyuncuya değmeden kaleye girerse gol olmaz: aut (kendi kalesine girerse korner) */
    if(b.endirekt){const own=b.endirekt.p.team===def;b.endirekt=null;this.topDisari();
      if(own)this.durusBaslat('korner',att,side*(PL-0.4),b.z<MZ?0.4:PW-0.4);else this.durusBaslat('kaleVurusu',def,side*(PL-ALTIPAS_U+0.5),MZ+(b.z<MZ?-4:4));
      this.on('endirektGol',{});return;}
    if(this.golIptalMi(side))return;   /* T10d: geç kalkan ofsayt bayrağı ya da hakeme çarpıp giren top (js/mac-kurallar.js) */
    this.score[att]++;const own=b.sonTakim===def,scorer=b.sonDokunan;
    if(b.sut&&!own)this.ist.isabet[att]++;
    b.agda=true;b.sut=null;b.sahip=null;b.hedefOyuncu=null;b.pas=null;
    for(const p of this.players)if(p.eylem&&p.eylem.ad==='vurus')p.eylem=null;
    this.phase='goal';this.phaseT=0;this.celeb={team:att,side,scorer,own};this.uzatmaBirikim[this.half-1]+=50;
    /* S1c (protokol bit 8; js/mac-sahne.js): gol sonrası sahnenin planı bir kez kurulur; olaya sevinç süresi, golcünün koşu türü ve asist */
    const c=this.celeb,gv={team:att,scorer,own,score:this.score.slice()};
    if(MOTOR_AYAR.protokol&S1_BIT.GOL){this.golSahneKur(c);gv.sevincT=c.sevincT;gv.tur=c.tur;gv.asist=c.asist;}
    this.on('goal',gv);
    this.guvenOlay(att,'golAtti');this.guvenOlay(def,'golYedi');if(own)this.guvenOlay(def,'kendiKale');   /* T10e */
    this.kayit.goller.push({ad:scorer?scorer.name:'',no:scorer?scorer.no:0,takim:att,kendiKalesine:!!own,dakika:Math.floor(this.gameSec/60)+1});   /* T10c */
    /* T10b (T10 teşhisi hata 5): avantaj sürerken gol — avantaj tutulmuştur, kart şimdi gösterilir (sevinç sürerken hakem oyuncuya gider) */
    if(this.avantaj){const a=this.avantaj;this.avantaj=null;this.on('avantajSonuc',{tutuldu:true});if(a.kart&&a.yapan.oyunda){if(c.s1)c.kartBekle=a;else this.kartGoster(a.yapan,a.kart);}}   /* S1c: kart sevinçten sonra */
  }
  stepGoal(dt){
    if(this.celeb&&this.celeb.s1){this.golSahneAdim(dt);return;}   /* S1c (js/mac-sahne.js): gol sonrası akış */
    const c=this.celeb,sc=c.own?null:c.scorer,cx=c.side*(PL-3),cz=c.side>0?PW-3:3,b=this.ball,gk=this.kaleci(1-c.team);
    /* T10d: gol yiyen takım hâlâ gerideyse (ikinci yarıda ya da acelede) kaleye en yakın saha oyuncusu topu ağdan alır, orta noktaya koşup koyar
       (olay topuAgdanAldi); santra kurala göre hazırlanır (stepKick santraAcele) */
    if(c.alan===undefined){c.alan=null;const t=1-c.team;
      if(this.score[t]<this.score[c.team]&&(this.half===2||this.macDurumu(t).acele>0)){let en=1e9;
        for(const q of this.teams[t])if(q.oyunda&&q.rol!=='GK'&&!q.sakat){const dq=hyp(q.x-b.x,q.z-b.z);if(dq<en){en=dq;c.alan=q;}}}}
    const al=c.alan;
    for(const p of this.players){
      if(!p.oyunda)continue;p.surus=null;
      if(p===al){p.sevinc=false;
        if(!b.tasiyan&&b.agda&&this.phaseT>0.6){p.tx=b.x-c.side*0.4;p.tz=b.z;p.hizOran=1;p.bak=b;
          if(hyp(p.x-b.x,p.z-b.z)<0.9){b.agda=false;b.tasiyan=p;this.topDegisti();this.on('topuAgdanAldi',{p});}}
        else if(b.tasiyan===p){p.tx=0;p.tz=MZ;p.hizOran=1;p.bak=null;
          if(hyp(p.x,p.z-MZ)<0.8){b.tasiyan=null;Object.assign(b,{x:0,z:MZ,y:0,vx:0,vy:0,vz:0});this.topDegisti();c.hazir=true;}}
        else{const k=this.santraKonumu(p,1-c.team);p.tx=k.x;p.tz=k.z;p.hizOran=0.6;}
        continue;}
      if(p===gk&&al){p.tx=c.side*(PL-1.5);p.tz=MZ;p.hizOran=0.4;continue;}
      if(p===gk){/* kaleci topu ağdan alır, orta noktaya doğru atar */
        if(!b.tasiyan&&b.agda&&this.phaseT>2.2){p.tx=b.x-c.side*0.4;p.tz=b.z;p.hizOran=0.4;p.bak=b;
          if(hyp(p.x-b.x,p.z-b.z)<0.9){b.agda=false;b.tasiyan=p;this.topDegisti();}}
        else if(b.tasiyan===p){p.tx=c.side*(PL-2);p.tz=MZ;p.bak={x:0,z:MZ};
          if(this.phaseT>5.2&&Math.abs(p.x-c.side*(PL-2))<1.2){b.tasiyan=null;const cz2=this.havadanCoz(b.x,1.2,b.z,-c.side*1.5,0,MZ,2.2,0);b.x=p.x;b.y=1.2;b.z=p.z;b.vx=cz2.vx;b.vy=cz2.vy;b.vz=cz2.vz;this.topDegisti();
            p.eylem={ad:'degaj',t:0,sure:0.5};}}
        else{p.tx=c.side*(PL-1.5);p.tz=MZ;p.hizOran=0.4;}
        continue;}
      if(p.team===c.team&&p.rol!=='GK'){
        if(p===sc){p.tx=cx;p.tz=cz;p.hizOran=1;}
        else{const g=sc||{x:cx,z:cz};p.tx=g.x-c.side*(1.2+(p.n%3)*0.9);p.tz=g.z-(cz>MZ?1:-1)*(1+(p.n%4)*0.9);p.hizOran=0.9;}
        p.sevinc=this.phaseT>0.5;p.bak=null;
      }else{const k=this.santraKonumu(p,1-c.team);p.tx=k.x;p.tz=k.z;p.hizOran=0.3;p.bak=null;}
    }
    this.hareketHepsi(dt);this.topAdim(dt);
    if(this.phaseT>7){for(const p of this.players)p.sevinc=false;this.santraHazirla(1-c.team,false);this.santraAcele=!!al;}
  }

  /* ============ devre / maç sonu ============ */
  devreSonuKontrol(){
    const h=this.half-1,sinir=h?5400:2700;
    if(!this.uzatmaIlan[h]&&this.gameSec>=sinir-20){
      const dk=clamp(Math.round((this.uzatmaBirikim[h]+30)/60),h?2:1,8);this.added[h]=dk*60;this.uzatmaIlan[h]=true;this.ist.uzatma[h]=dk;
      this.on('uzatma',{dakika:dk,yari:this.half});}
    if(this.phase!=='play'&&this.phase!=='kickoff')return;
    const lim=sinir+this.added[h],b=this.ball;
    if(this.gameSec>=lim&&(Math.abs(b.x)<30||this.gameSec>lim+100)&&!b.sut)this.endHalf();
  }

}
