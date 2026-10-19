/* ============ Chairman — maç motoru: plan katmanı (Z1, 2026-10-19; FUTBOL_KUTUPHANESI §1 madde 2, §12.1; kutuphane/B-ilerletme.md "Motor için notlar") ============
   Takım zekâsının ilk katmanı: birkaç saniyelik, rollü, bağlılıklı ortak niyet (plan). İlkellerin tanımı js/mac-ilkeller.js'te (veri), tarz
   ağırlıkları js/mac-tarz.js'te. Bu dosya planı açar, rolleri dağıtır, adımları ilerletir, bitirir ve sonucu olay olarak yayar.
   - Bütün durum this._pln'de, planAdim'da tembel kurulur; MOTOR_AYAR.plan 0 iken hiç kurulmaz, hiçbir kanca iş yapmaz, rastlantı çekilmez:
     motor — cizgiKoru 0 ile — T23 ile birebir (araclar/taban/t23.json --ayni). Oyuncuya, topa, b.pas'a ve seçenek nesnelerine alan eklenmez (varlik 128 sınırı).
   - Öneri (planOner): saniyede beş kez, yalnız topa sahip takım için. Her ilkelin adayı (ucuz geometri) bir oran λ taşır (1/sn: taban × bağlam önseli
     × tarz × seçme kapısı × değer × güven); tikte TEK çekilişle P(aç) = 1 − e^(−Λ·0,2) ve hangisi oranlarla seçilir (log λ üzerinde softmax'ın eşi;
     ezber yok). Açılışta derin koşu için bir çekiliş daha (koşunun pastan önceki süresi). Takım başına en çok planEs açık plan, ilkel türü başına bir.
   - Kaynak: duvar pası ve üçüncü adam TEKLİF olarak açılır (B pasa gelir ve top ister, taşıyan yeniden düşünür; pas onun seçimidir — seçmezse
     "reddedildi"); derin koşuyu ilk hareket eden koşucu açar (koşu pastan önce başlar, taşıyan bekleme payı alır); geri çevirmeyi bölge açar
     (çizgiye inen taşıyan; ön direk, geç gelen, yay).
   - Bitiş motorun izinden (planAdim her karenin başında): beklenen pasördan beklenen alıcıya yeni pas → adım; başkasına pas → vazgeçti; beklenen
     alıcı dokundu → adım ya da tamamlandı (kötü kontrol: teknik); rakip dokundu → savunma (planın pası yoldaysa ya da 3 sn içinde alındıysa) ya da
     kayıp; rol oyuncusuna ofsayt → ofsayt; pastan önce gerçek çizginin 1,5 m önüne geçen koşu → hat (taşıyanın bu koşucuya vuruş hazırlığında denetlenmez); süre → zaman (teklifte reddedildi); duruş, gol →
     duruş. Olay: on('plan', {takim, ilkel, olay: teklif|basladi|tamamlandi|bozuldu|reddedildi, neden, no, t, kosuPas, bekle, K, A, B, C, R}).
   - Oyuncu kararı planın adımını bir SEÇENEK DEĞERİ olarak görür (planEkle: secenekler0 ve tekVurusKarari0; pay kombinasyonun beklenen
     değeri, en çok planTavan); taşıyan kabul etmeyebilir (algısı, kapısı, sabır eşiği, Gumbel sapması). Planın pası koşucunun gideceği boşluğa aday olur
     (planHedefPas, pasSecenekleri). Ayar turu (Z1, 2026-10-19; 5 tur, 12–16 maç): FUTBOL_KUTUPHANESI §12.5. İstek sinyali (bit 16): açık arkadaş top ister (jest 'cagir'), taşıyan görürse o pasa küçük pay.
   Rastlantı yalnız this.rast; saf işlevler (ILK_TABLO aday/hedef) rastlantı çekmez. */
'use strict';
ayarEkle('Z',{
  plan:20,                     // Z1 (2026-10-19): plan katmanı bit maskesi — 1 duvar pası, 2 üçüncü adam, 4 derin koşu, 8 geri çevirme, 16 istek sinyali; 0: T23 motoru
                               // (cizgiKoru 0 ile birebir). Z1 kapanışında 20 (derin koşu + istek): kapılarını yalnız derin koşu geçti; 1, 2, 8 kapalı, borç (FUTBOL_KUTUPHANESI §12.5)
  planDeger:1.0,               // plan payı = planDeger × tarz × seçme kapısı × algı × zaman × planın değeri (puan, 0,5–4) × P: kombinasyonun beklenen değeri
  planTavan:2.5,               // plan payının tavanı (puan = gol olasılığı × 100; Gumbel sapması ~0,25–0,37, sabır eşiği 0,3–1,1)
  planSabir:0.7,               // teklif açıkken (duvar pası, üçüncü adam) taşıyanın sabır eşiğinin bu payı düşer: arkadaşının top istediğini görür, tutmaya daha az eğilimlidir
  planArka:0.5,                // plan&4'te eski (plansız) arka plan koşularının oranı (js/mac-topla.js derinKosu; 0: kapalı)
  planTut:0.45,                // derin koşu gençken taşıyanın 'tut' seçeneklerine bekleme payı (puan; sabır eşiğinin üstüne eklenen kadarı, baskı > 0,5'te yok)
  planIstek:0.15,              // istek sinyali payı (puan × (0,5 + 0,5·görüş); kimya Z1'de yok — Z7/Z9; plan payıyla toplanmaz, büyüğü alınır)
  planHiz:[1.5,1.0,2.5,1.0],   // ilkel başına taban öneri oranı (1/sn): duvar pası, üçüncü adam, derin koşu, geri çevirme (Z1 ayar turu: FUTBOL_KUTUPHANESI §12.5)
  planEs:2,                    // takım başına en çok açık plan (kutuphane/B "Motor için notlar" 2)
  planTeklif:[0.6,0.8],        // teklifin geçerliliği (sn): duvar pası, üçüncü adam — taşıyan bu sürede pası vermezse "reddedildi"
  planTarz:1                   // tarz ağırlıklarının etkisi (js/mac-tarz.js; 0: hepsi 1 — Z1 iskeleti; Z3 (2026-10-19 gece): 1, iki canlı arketip)
});
/* plan nesnesi (tek biçim) */
function planYeni(){return{no:0,tur:'',takim:0,durum:'teklif',i:0,K:null,A:null,B:null,C:null,R:null,D:null,nu:0,nw:0,u0:0,w0:0,yan:1,kz:1,
  t0:0,tBas:-1,son:0,tHedef:0,tKes:0,pasT:-1,kosuT:-1,dokT:-1,pas:null,ofs:false,ek:0,deger:0,kapandi:false};}
const PLN_SIRA={duvarPasi:0,ucuncuAdam:1,derinKosu:2,geriCevirme:3};
Object.assign(Match.prototype,{
  planHazirla(){return this._pln={no:0,T:[[],[]],rol:new Map(),sonPas:null,sonDok:null,sonSurum:-1,kare:-1,cizgi:[0,0],cizgiD:[0,0],
    hd:{u:0,w:0,ef:0,h:1,g:''},aday:[],istek:new Map(),istekKare:-99};},
  /* gerçek ofsayt çizgisi (sondan ikinci rakip) ve topla birlikte: t takımının çerçevesinde (u). ofsaytCizgisi her karede çağrılmaz (bellek ayırır) */
  planCizgi(t){const S=this._pln,d=this.dir[t];let a=-1e9,c=-1e9;
    for(const o of this.teams[1-t]){if(!o.oyunda)continue;const u=o.x*d;if(u>a){c=a;a=u;}else if(u>c)c=u;}
    S.cizgiD[t]=Math.max(c,0);S.cizgi[t]=Math.max(c,this.ball.x*d,0);},
  /* duruş başladı (js/mac-kurallar.js durusBaslat): açık planlar 'durus' (rol oyuncusu ofsayttaysa 'ofsayt') nedeniyle kapanır; duruş boyunca rol hedefi yok */
  planDurusKapat(){const S=this._pln;for(let t=0;t<2;t++)for(let i=S.T[t].length-1;i>=0;i--){const P=S.T[t][i];this.planKapat(P,P.durum==='teklif'?'reddedildi':'bozuldu',P.ofs?'ofsayt':'durus');}},
  /* H1 (stepPlay, takimAI'den önce): olayları oku, planları denetle, öner */
  planAdim(dt){
    const S=this._pln||this.planHazirla(),b=this.ball;
    if(S.kare>=0&&this.kare-S.kare>1)for(let t=0;t<2;t++)for(let i=S.T[t].length-1;i>=0;i--){const P=S.T[t][i];this.planKapat(P,P.durum==='teklif'?'reddedildi':'bozuldu',P.ofs?'ofsayt':'durus');}
    S.kare=this.kare;
    /* çizgi yalnız açık planı olan takım için (yeni açılan planın takımı planAc'te) */
    for(let t=0;t<2;t++)if(S.T[t].length)this.planCizgi(t);
    if(b.pas&&b.pas!==S.sonPas){S.sonPas=b.pas;this.planPas(b.pas);}
    const sd=b.sonDokunan;if(sd&&sd.team!=null&&(sd!==S.sonDok||b.surum!==S.sonSurum))this.planDokunus(sd);
    S.sonDok=sd;S.sonSurum=b.surum;
    for(let t=0;t<2;t++){const L=S.T[t];for(let i=L.length-1;i>=0;i--)this.planDenetle(L[i]);}
    /* öneri: topa sahip takım, 5 Hz; takimAI ofsayt çizgisini kurmadan (maçın ilk oyun karesi) ve taşıyan vuruş hazırlığındayken (pas kararı verilmiş) yok */
    const k=b.sahip;
    if(k&&k.team!=null&&this._ofs&&this.kare%12===(k.team?6:0)&&!(k.eylem&&(k.eylem.kilit||k.eylem.ad==='vurus'))){
      if(S.T[k.team].length<MOTOR_AYAR.planEs)this.planOner(k.team,k);
      if(MOTOR_AYAR.plan&16)this.planIstekAdim(k.team,k);}
  },
  /* adımın beklenen pasörü ve alıcısı (alıcı null: geri çevirmede rol koşucularından biri) */
  planBeklenen(P){
    switch(P.tur){
      case 'duvarPasi':return P.i===0?{v:P.K,a:P.B}:P.i===1?{v:P.B,a:P.K}:null;
      case 'ucuncuAdam':return P.i===0?{v:P.K,a:P.B}:P.i===1?{v:P.B,a:P.C}:null;
      case 'derinKosu':return P.i===1?{v:P.K,a:P.R}:null;
      case 'geriCevirme':return P.i===1?{v:P.K,a:null}:null;}
    return null;},
  /* geri çevirmenin geometrisi: hedef taşıyanın en çok 1 m önünde, kaleye 4–22 m, ortaya 12 m içinde (z-kalip ile aynı) */
  planGeriGeo(P,hx,hz){const d=this.dir[P.takim],hu=hx*d;return hu<=P.K.x*d+1&&hu>=PL-22&&hu<=PL-4&&Math.abs(hz-MZ)<12;},
  /* son plan pasının alıcısı */
  planSonAlici(P,p){
    switch(P.tur){
      case 'duvarPasi':return P.i===1?P.B:P.i===2?P.K:null;
      case 'ucuncuAdam':return P.i===1?P.B:P.i===2?P.C:null;
      case 'derinKosu':return P.i===2?P.R:null;
      case 'geriCevirme':return P.i===2&&(p===P.A||p===P.B||p===P.C)?p:null;}
    return null;},
  planPas(pas){
    const S=this._pln,b=this.ball,q=b.hedefOyuncu,t=pas.takim,L=S.T[t];if(t==null)return;
    for(let i=L.length-1;i>=0;i--){const P=L[i],bek=this.planBeklenen(P);if(!bek||pas.p!==bek.v)continue;
      const dogru=bek.a?q===bek.a:(q===P.A||q===P.B||q===P.C)&&(pas.tur==='geriCevir'||pas.hx!=null&&this.planGeriGeo(P,pas.hx,pas.hz));
      if(!dogru){this.planKapat(P,P.durum==='teklif'?'reddedildi':'bozuldu','vazgecti');continue;}
      P.i++;P.pasT=this.t;P.pas=pas;P.ofs=!!(b.ofsaytta&&b.ofsaytta.liste&&b.ofsaytta.liste.some(e=>e.q===q));
      if(P.durum==='teklif'){P.durum='basladi';P.tBas=this.t;
        if(P.tur==='duvarPasi'){S.rol.set(P.K,P);P.kosuT=this.t;P.son=this.t+2.5;this.on('kosu',{p:P.K,verKac:true});}
        else if(P.tur==='ucuncuAdam'){P.tKes=this.t+ILK_TEPKI(P.C,0.5);P.son=this.t+4;}
        this.planOlay(P,'basladi',null);}
      else if(P.tur==='duvarPasi')P.son=Math.max(P.son,this.t+1.6);
      else if(P.tur==='derinKosu'||P.tur==='geriCevirme')P.son=Math.max(P.son,this.t+2.5);}
  },
  planDokunus(p){
    const S=this._pln,b=this.ball;if(b.pas&&b.pas.p===p)return;   /* pasörün kendi vuruşu */
    for(let t=0;t<2;t++){const L=S.T[t];for(let i=L.length-1;i>=0;i--){const P=L[i];
      if(p.team!==P.takim){const sav=P.pas!=null&&this.t-P.pasT<3;this.planKapat(P,P.durum==='teklif'?'reddedildi':'bozuldu',sav?'savunma':'kayip');continue;}
      if(P.pas!=null&&P.dokT<P.pasT){const al=this.planSonAlici(P,p);
        if(al===p){P.dokT=this.t;const kotu=!!(p.eylem&&p.eylem.ad==='kontrol'&&p.eylem.kotu);
          if(kotu){this.planKapat(P,'bozuldu','teknik');continue;}
          if(P.i>=2){if(P.R&&P.R.kosu&&P.tur==='derinKosu')P.R.kosu=null;this.planKapat(P,'tamamlandi',null);}
          continue;}
        if(p!==P.K)this.planKapat(P,'bozuldu','teknik');}}}
  },
  planDenetle(P){
    if(P.kapandi)return;
    if(this.t>P.son){this.planKapat(P,P.durum==='teklif'?'reddedildi':'bozuldu',P.ofs?'ofsayt':'zaman');return;}
    for(const q of [P.K,P.A,P.B,P.C,P.R])if(q&&(!q.oyunda||q.eylem&&q.eylem.kilit&&(q.eylem.ad==='dusus'||q.eylem.ad==='yerde'||q.eylem.ad==='kalkis'))){this.planKapat(P,'bozuldu','teknik');return;}
    if(P.tur==='derinKosu'&&P.i===1){const R=P.R,d=this.dir[P.takim];
      /* çizgi: pas hazırlığında (taşıyanın vuruşu R'ye) denetlenmez — ofsayt pas anında ölçülür; başka zaman çizginin 1,5 m ötesi (dönemez) */
      const e=P.K&&P.K.eylem,haz=e&&e.ad==='vurus'&&e.sec&&e.sec.alici===R;
      if(!haz&&R.x*d>this._pln.cizgiD[P.takim]+1.5&&R.x*d>this.ball.x*d){this.planKapat(P,'bozuldu','hat');return;}
      if(!R.kosu){this.planKapat(P,'bozuldu','kesildi');return;}}
  },
  planKapat(P,olay,neden){
    if(P.kapandi)return;P.kapandi=true;
    const S=this._pln,L=S.T[P.takim],i=L.indexOf(P);if(i>=0)L.splice(i,1);
    for(const q of [P.K,P.A,P.B,P.C,P.R])if(q&&S.rol.get(q)===P)S.rol.delete(q);
    /* derin koşu vazgeçildiyse koşucu en çok 1,5 sn aldatma olarak sürer (koşu belirteci; mac-topla.js derinKosu'nun süren koşusu) */
    if(P.tur==='derinKosu'&&P.R&&P.R.kosu&&neden==='vazgecti')P.R.kosu.t=Math.min(P.R.kosu.t,1.5);
    this.planOlay(P,olay,neden);
  },
  planOlay(P,olay,neden){
    this.on('plan',{takim:P.takim,ilkel:P.tur,olay,neden,no:P.no,t:this.t,kosuPas:P.kosuT>=0&&P.pasT>=0?P.kosuT-P.pasT:null,
      bekle:P.tur==='derinKosu'&&P.pasT>=0?P.pasT-P.tBas:null,K:P.K,A:P.A,B:P.B,C:P.C,R:P.R});},
  /* öneri: ilkellerin adayları, oranlar, tek çekiliş */
  planOner(t,K){
    const S=this._pln,A=S.aday,M=MOTOR_AYAR;A.length=0;
    for(const ad of ILK_SIRA){const I=ILK_TABLO[ad];if(!(M.plan&I.bit))continue;let var_=false;for(const P of S.T[t])if(P.tur===ad){var_=true;break;}if(var_)continue;
      const n0=A.length;I.aday(this,t,K,A);if(A.length===n0)continue;
      const f=M.planHiz[PLN_SIRA[ad]]*ilkOnsel(this,t,ad)*tarzAgirlik(this,t,ad)*(1+0.3*clamp(this.guven?this.guven[t]:0,-1,1));
      for(let j=n0;j<A.length;j++)A[j].lam*=f;}
    let L=0;for(const a of A)L+=a.lam;if(!(L>0))return;
    const u=this.rast(),pa=1-Math.exp(-L*0.2);if(u>=pa)return;
    let v=u/pa*L;for(const a of A){v-=a.lam;if(v<=0){this.planAc(a);return;}}
    this.planAc(A[A.length-1]);
  },
  planAc(a){
    const S=this._pln,P=planYeni(),t=a.K.team,d=this.dir[t],bg=tarzBaglilik(this,t);
    this.planCizgi(t);   /* rol hedefi aynı karede okunur: çizgi bayat kalmasın */
    P.no=++S.no;P.tur=a.tur;P.takim=t;P.K=a.K;P.A=a.A;P.B=a.B;P.C=a.C;P.R=a.R;P.D=a.D;P.nu=a.nu;P.nw=a.nw;P.yan=a.yan;P.deger=a.deger;P.kz=a.kz;P.t0=this.t;
    if(a.tur==='duvarPasi'||a.tur==='ucuncuAdam'){P.durum='teklif';P.i=0;P.son=this.t+MOTOR_AYAR.planTeklif[a.tur==='duvarPasi'?0:1];
      S.rol.set(a.B,P);if(a.C)S.rol.set(a.C,P);
      this.jestVer(a.B,'cagir',0.8,{x:a.K.x,z:a.K.z});if(a.K.kararT>0.05)a.K.kararT=0.05;
      S.T[t].push(P);this.planOlay(P,'teklif',null);return;}
    P.durum='basladi';P.i=1;P.tBas=this.t;
    if(a.tur==='derinKosu'){const R=a.R;P.kosuT=this.t;P.u0=R.x*d;P.w0=R.z;P.yan=Math.sign(a.nw-R.z)||1;
      /* koşunun pastan önceki hedef süresi (veri: SkillCorner arkaya −0,8, IDSSE derin −0,64 sn); karar iyiyse dar */
      P.tHedef=clamp(0.9+(this.rast()-0.5)*(1-0.5*a.K.oz.karar),0.4,1.6);P.son=this.t+(P.tHedef+2.1)*bg;
      S.rol.set(R,P);S.T[t].push(P);this.kosuBaslat(R,a.K,a.nu,a.nw,'arkaya');}
    else{P.son=this.t+4.5*bg;for(const q of [a.A,a.B,a.C])if(q)S.rol.set(q,P);S.T[t].push(P);
      if(a.B)this.jestVer(a.B,'isaret',0.6,{x:(PL-11)*d,z:MZ+a.yan});}
    this.planOlay(P,'basladi',null);
  },
  /* H2 (bolgeKonumu): rol hedefi (paylaşılan nesne; aynı çağrıda yazılır ve okunur) */
  planRolKonumu(p,t){
    if(this.phase!=='play')return null;   /* duruşta rol yok (planlar durusBaslat'ta kapanır) */
    const P=this._pln.rol.get(p);if(!P||P.takim!==t)return null;
    const r=ILK_TABLO[P.tur].hedef(this,P,p,this._pln.hd);if(!r)return null;
    if(p.kosu&&P.tur==='derinKosu'&&p===P.R){p.kosu.u=r.u;p.kosu.w=r.w;if(p.kosu.t<0.5)p.kosu.t=0.5;}
    return r;},
  /* H7, H9: seçenek payları. kip 0 karar, 1 gelişine (tek vuruş), 2 kontrol sonrası. Plan payı ile istek payının büyüğü */
  planEkle(p,S,kip){
    const L=this._pln;if(!L)return;const M=MOTOR_AYAR,t=p.team,T=L.T[t];
    for(const s of S){const q=s.alici;if(!q)continue;let pay=0;
      for(const P of T){const bek=this.planBeklenen(P);if(!bek||bek.v!==p)continue;
        if(bek.a?q!==bek.a:!(q===P.A||q===P.B||q===P.C)||!(s.tur==='geriCevir'||s.hx!=null&&this.planGeriGeo(P,s.hx,s.hz)))continue;
        const kipK=P.tur==='duvarPasi'&&P.i===1&&kip!==1?0.6:1;   /* ver-kaç dönüşü en çok gelişine; kontrol edip dönmek de olur (B en çok 2 dokunuş) */
        let zaman=1;if(P.tur==='derinKosu')zaman=clamp((this.t-P.tBas)/P.tHedef,0.3,1);
        const v=M.planDeger*kipK*tarzAgirlik(this,t,P.tur)*P.kz*(ilkCanli(p,q)?1:0.5)*zaman*clamp(P.deger,0.5,4)*(s.P!=null?s.P:0.7);
        if(v>pay)pay=v;}
      if(M.plan&16){const j=q.jest;if(j&&(j.tur==='cagir'||j.tur==='isaret')&&j.t<=1.2&&ilkCanli(p,q)){const v=M.planIstek*(0.5+0.5*p.oz.gorus);if(v>pay)pay=v;}}
      if(pay>0)s.deger+=Math.min(M.planTavan,pay);}
  },
  /* H8: derin koşu gençken taşıyanın bekleme payı (sabır eşiğinin üstüne eklenen) */
  planTut(p,esik){
    const L=this._pln;if(!L)return 0;
    for(const P of L.T[p.team]){if(P.K!==p)continue;
      if(P.i===0&&(P.tur==='duvarPasi'||P.tur==='ucuncuAdam'))return -MOTOR_AYAR.planSabir*esik;   /* teklif: sabır düşer */
      if(P.tur!=='derinKosu'||P.i!==1)continue;const yas=this.t-P.tBas;
      if(yas>=P.tHedef||baskiAltinda(this,p)>0.5)return 0;return Math.max(0,MOTOR_AYAR.planTut*(1-yas/P.tHedef)-esik);}
    return 0;},
  /* H6 (uzantı): planın bu pasördan beklediği pasın hedef noktası — koşucunun gideceği boşluk (duvar dönüşü, üçüncü adamın bırakışı, derin koşu).
     Paylaşılan nesne (aynı çağrıda okunur); yoksa null */
  planHedefPas(p){const L=this._pln;if(!L)return null;const H=L.hp||(L.hp={q:null,x:0,z:0,ex:0,ez:0});
    for(const P of L.T[p.team]){if(P.i!==1)continue;let q=null;
      if((P.tur==='duvarPasi'&&P.B===p))q=P.K;else if(P.tur==='ucuncuAdam'&&P.B===p)q=P.C;else if(P.tur==='derinKosu'&&P.K===p)q=P.R;
      if(!q)continue;const d=this.dir[P.takim],x=P.nu*d,z=P.nw,r=hyp(x-q.x,z-q.z)||1;H.q=q;H.x=x;H.z=z;H.ex=(x-q.x)/r;H.ez=(z-q.z)/r;return H;}
    return null;},
  /* H6: pasSecenekleri'nde tam analize zorla girecek alıcı (planın bu pasördan beklediği) */
  planAlici(p){const L=this._pln;if(!L)return null;for(const P of L.T[p.team]){const bek=this.planBeklenen(P);if(bek&&bek.v===p&&bek.a)return bek.a;}return null;},
  /* H5: açık geri çevirme planı (gecGirisAta kutu rollerini ona bırakır) */
  planGeriAcik(t){const L=this._pln;if(!L)return false;for(const P of L.T[t])if(P.tur==='geriCevirme')return true;return false;},
  /* bit 16 — istek sinyali: açık ve oyuna dönük arkadaş 0,6 sn açık kalınca top ister (jest 'cagir'; 2,5 sn'de bir). Rastlantısız */
  planIstekAdim(t,K){
    const S=this._pln,d=this.dir[t],ku=K.x*d;
    if(this.kare-S.istekKare>12)for(const e of S.istek.values())e.acik=-1;   /* sahiplik ya da öneri kesildi: açıklık sayacı baştan */
    S.istekKare=this.kare;
    for(const q of this.teams[t]){let e=S.istek.get(q);
      if(q===K||!q.oyunda||q.rol==='GK'||q.eylem&&q.eylem.kilit){if(e)e.acik=-1;continue;}
      if(!e){e={acik:-1,son:-9};S.istek.set(q,e);}
      const L=hyp(q.x-K.x,q.z-K.z);let acik=L<=25&&q.x*d>=ku-5&&Math.cos(aciFark(q.yon,d>0?0:Math.PI))>-0.2;
      if(acik){let r=99;for(const o of this.teams[1-t]){if(!o.oyunda||o.rol==='GK')continue;const dd=hyp(o.x-q.x,o.z-q.z);if(dd<r)r=dd;}acik=r>5&&!ilkHatKesen(this,t,K.x,K.z,q.x,q.z,1.0,null);}
      if(!acik){e.acik=-1;continue;}
      if(e.acik<0)e.acik=this.t;
      if(this.t-e.acik>=0.6&&this.t-e.son>=2.5&&!q.jest){this.jestVer(q,'cagir',0.8,{x:K.x,z:K.z});e.son=this.t;}}
  }
});
