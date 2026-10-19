/* ============ Chairman — maç motoru: ilkel tablosu (Z1, 2026-10-19; FUTBOL_KUTUPHANESI §1, §2, §12.1; kutuphane/B-ilerletme.md) ============
   Kütüphanenin ilkelleri VERİ olarak: her ilkelin biti (MOTOR_AYAR.plan), rolleri, bağlılığı, önseli (Ek B-1: bağlam × hat yüksekliği), kabiliyet
   kapıları (görme, seçme, yapma — js/mac-profil.js alanları), zamanlaması (açık veriden), aday üreticisi ve rol başına hedef noktası üreticisi.
   Mantık plan katmanındadır (js/mac-plan.js); kütüphane büyüdükçe yalnız bu dosya büyür. Ezber yok: aday yalnız bağlamın izin verdiği planı tarif eder,
   açılışı plan katmanı oranla (rastlantı this.rast) seçer, rol oyuncuları her karede kendi algısıyla oynar, savunma planı bozabilir.
   Çerçeve: u = x·yön (takımın hücum yönünde), w = z. Aday nesnesi tek biçimli literal (ILK_ADAY): {tur, lam, deger, kz (seçme kapılarının çarpımı), K, A, B, C, R, D, nu, nw, yan}.
   Zamanlamanın kaynağı (Z1-v, 2026-10-19; araclar/veri-z1.py; yalnız yuvarlanmış özet): SkillCorner açık verisi (20 maç, MIT) hedeflenen koşuda koşu
   başı − pas çıkışı ortancası: savunma arkasına (behind) −0,8 sn (%10 −3,9 · %90 +0,2), topun önüne −1,3, ceza sahasına (cross receiver) −1,9, bindirme
   −2,7; IDSSE (iki Bundesliga maçı, 25 Hz, CC BY 4.0) derin pasta −0,64 sn (n 23), ileri pasta −1,18 sn (n 112). Kütüphanenin tahmin bandı
   (B.0.2: arkaya 0,5–1,5 sn) veriyle tutuyor. Kaynak atıfları FUTBOL_KUTUPHANESI "Kaynaklar — Z1".
   Saf: rastlantı çekmez, önbellek yazmaz, oyuncuya yazmaz (yalnız aday ve hedef nesnesi döner). */
'use strict';
/* kabiliyetin seçme kapısı: özelliklerin ortalaması eşiğin üstündeyse 1'e, altındaysa 0,35'e yaklaşır (eşik altı oyuncu denemez değil, seyrek dener) */
const ILK_KAPI=(v,esik)=>0.35+0.65/(1+Math.exp(-(v-esik)/0.08));
/* görme kapısı: tepki süresi (sn) — 0,2 + 0,2·(1 − sezgi) + eşik altında 0,6·açık (geç zamanlar) */
const ILK_TEPKI=(p,esik)=>{const s=profilAlt(p,'sezgi',p.oz.karar);return 0.2+0.2*(1-s)+0.6*Math.max(0,esik-s);};
/* aday nesnesi (tek biçim) */
const ILK_ADAY=()=>({tur:'',lam:0,deger:0,kz:1,K:null,A:null,B:null,C:null,R:null,D:null,nu:0,nw:0,yan:1});
/* bağlamın önseli (Ek B-1'in sade hâli): takım niyeti ve yeni kazanım */
function ilkOnsel(m,t,tur){
  const N=m._niyet&&m._niyet[t],ad=N?N.ad:'ilerlet',yeni=m._sahiplikBas!=null&&m.t-m._sahiplikBas<3;
  const T=ILK_ONSEL[tur];let v=T[ad]!=null?T[ad]:1;if(yeni&&T.yeni)v=Math.max(v,T.yeni);return v;}
const ILK_ONSEL={
  duvarPasi:  {kur:0.6,ilerlet:1.2,sonBolge:1.2,kontra:0.5,tut:0.8},
  ucuncuAdam: {kur:1.0,ilerlet:1.3,sonBolge:1.0,kontra:0.6,tut:0.8},
  derinKosu:  {kur:0.5,ilerlet:1.0,sonBolge:1.1,kontra:2.0,tut:0.4,yeni:2.0},
  geriCevirme:{kur:0,ilerlet:1.0,sonBolge:1.2,kontra:1.0,tut:0.6}
};
/* oyuncunun algısı: q, p'nin bakışının ±100°'sinde mi (canlı) */
const ilkCanli=(p,q)=>{const by=p.bakisYon!=null?p.bakisYon:p.yon;return Math.abs(aciFark(Math.atan2(q.z-p.z,q.x-p.x),by))<1.75;};
/* (x,z) noktasına rakiplerin en erken varışı (sn; kaba: uzaklık ÷ tepe hız + 0,25) ve hattı kesen rakip sayısı (segD < r) */
function ilkRakipVaris(m,t,x,z){let e=99;for(const o of m.teams[1-t]){if(!o.oyunda||o.rol==='GK'||o.eylem&&o.eylem.kilit)continue;const v=hyp(o.x-x,o.z-z)/(o.maxSpd*0.95)+0.25;if(v<e)e=v;}return e;}
function ilkHatKesen(m,t,ax,az,bx,bz,r,haric){let n=0;for(const o of m.teams[1-t]){if(!o.oyunda||o===haric||o.eylem&&o.eylem.kilit)continue;if(segD(o.x,o.z,ax,az,bx,bz)<r)n++;}return n;}
const ilkSahada=(x,z,pay)=>Math.abs(x)<PL-pay&&z>pay&&z<PW-pay;

const ILK_TABLO={
  /* ---- B.2 duvar pası / ver-kaç: A pas verir ve aynı anda savunmacının yanından koşar, B tek dokunuşla A'nın yoluna bırakır ---- */
  duvarPasi:{bit:1,ad:'duvar pası',roller:['K: pasçı ve koşucu (A)','B: duvar','D: geçilecek savunmacı'],baglilik:[0.6,2.5],
    kapi:{gorme:['sezgi'],secme:['karar','pas'],yapma:['ilkDokunus','pas']},
    aday(m,t,K,out){
      const d=m.dir[t],ku=K.x*d;if(ku<-20||ku>PL-12)return;
      /* önündeki (±60°) 1,5–7 m'de, yaklaşan ya da 3 m içindeki savunmacı */
      let D=null,dd=7;for(const o of m.teams[1-t]){if(!o.oyunda||o.rol==='GK'||o.eylem&&o.eylem.kilit)continue;const ox=o.x-K.x,oz=o.z-K.z,r=hyp(ox,oz);
        if(r<1.5||r>dd||ox*d<r*0.5)continue;const yak=-(o.vx*ox+o.vz*oz)/r;if(yak<0.3&&r>3)continue;dd=r;D=o;}
      if(!D)return;const ofs=m._ofs[t];
      for(const B of m.teams[t]){if(B===K||!B.oyunda||B.rol==='GK'||B.eylem&&B.eylem.kilit||m._pln.rol.has(B))continue;
        const bx=B.x-K.x,bz=B.z-K.z,L=hyp(bx,bz);if(L<4||L>10)continue;if(hyp(B.vx,B.vz)>3.5||B.x*d>ofs-0.3&&B.x*d>0)continue;
        if(!ilkCanli(K,B)||ilkHatKesen(m,t,K.x,K.z,B.x,B.z,1.0,null))continue;
        /* koşunun hedefi: savunmacının 4 m ötesi, B'nin yanına 0,4 yaklaşık; ikinci savunmacı 5 m içinde olmamalı, saha içinde, çizgiye en çok 4 m ötede */
        const nu=Math.min(Math.max(ku+8,D.x*d+4),ofs+4,PL-6),nw=K.z+0.4*(B.z-K.z),nx=nu*d;if(!ilkSahada(nx,nw,2))continue;
        let ikinci=false;for(const o of m.teams[1-t]){if(!o.oyunda||o===D||o.rol==='GK')continue;if(hyp(o.x-nx,o.z-nw)<5){ikinci=true;break;}}if(ikinci)continue;
        const kz=ILK_KAPI(0.5*K.oz.karar+0.5*K.oz.pas,0.45)*ILK_KAPI(0.5*profilAlt(B,'ilkDokunus',B.oz.pas)+0.5*B.oz.pas,0.45);
        const deger=Math.max(0,(xT(nu,nw)-xT(ku,K.z))*100);if(deger<1)continue;
        const a=ILK_ADAY();a.tur='duvarPasi';a.kz=kz;a.K=K;a.B=B;a.D=D;a.nu=nu;a.nw=nw;a.deger=deger;a.lam=kz*clamp(deger/5,0.4,2);out.push(a);}
    },
    hedef(m,P,p,o){
      const d=m.dir[P.takim];
      if(p===P.B&&P.i===0){o.u=p.x*d;o.w=p.z;o.ef=0.45;o.h=0.6;o.g='planDuvar';return o;}   /* teklif: duvar yerinde, taşıyana dönük (bak top) */
      if(p===P.K&&P.i===1){o.u=Math.min(P.nu,m._pln.cizgi[P.takim]-0.3);o.w=P.nw;o.ef=1;o.h=1;o.g='planDuvar';return o;}   /* pas çıktı: A koşar (dönüş çıkana dek çizginin — sondan ikinci rakip ya da top — gerisinde) */
      return null;}
  },
  /* ---- B.1 üçüncü adam: A dikey pası B'ye (sırtı kaleye), A'nın pası çıkınca C koşar, B bırakır ---- */
  ucuncuAdam:{bit:2,ad:'üçüncü adam',roller:['K: ilk pasçı (A)','B: duvar, sırtı kaleye','C: üçüncü adam (koşucu)'],baglilik:[0.8,4],
    kapi:{gorme:['sezgi','gorus'],secme:['yaraticilik','oldurucuPas'],yapma:['ilkDokunus']},
    aday(m,t,K,out){
      const d=m.dir[t],ku=K.x*d;if(ku<-30||ku>PL-18)return;const ofs=m._ofs[t];let nB=0;
      for(const B of m.teams[t]){if(nB>=3)break;if(B===K||!B.oyunda||B.rol==='GK'||B.eylem&&B.eylem.kilit||m._pln.rol.has(B))continue;
        const bu=B.x*d,ileri=bu-ku;if(ileri<8||ileri>22||bu>ofs-0.3)continue;
        if(Math.cos(aciFark(B.yon,d>0?0:Math.PI))>0)continue;   /* sırtı kaleye */
        let M=null;for(const o of m.teams[1-t]){if(!o.oyunda||o.rol==='GK')continue;if(o.x*d>bu-0.5&&hyp(o.x-B.x,o.z-B.z)<3){M=o;break;}}
        if(!M||!ilkCanli(K,B)||ilkHatKesen(m,t,K.x,K.z,B.x,B.z,1.2,M))continue;nB++;
        let nC=0;for(const C of m.teams[t]){if(nC>=2)break;if(C===K||C===B||!C.oyunda||C.rol==='GK'||C.eylem&&C.eylem.kilit||m._pln.rol.has(C))continue;
          const L=hyp(C.x-B.x,C.z-B.z);if(L<6||L>16||C.x*d>ofs-0.3)continue;
          const nu=Math.min(bu+6,ofs+3,PL-8),nw=lerp(C.z,B.z,0.3),nx=nu*d;if(!ilkSahada(nx,nw,2))continue;
          let bos=true;for(const o of m.teams[1-t]){if(!o.oyunda||o.rol==='GK')continue;if(hyp(o.x-nx,o.z-nw)<4){bos=false;break;}}if(!bos)continue;
          const tC=hyp(C.x-nx,C.z-nw)/(C.maxSpd*0.9)+0.4;if(ilkRakipVaris(m,t,nx,nw)<tC-0.3)continue;nC++;
          const kz=ILK_KAPI(0.5*profilAlt(K,'yaraticilik',K.oz.gorus)+0.5*K.oz.gorus,0.5)*ILK_KAPI(profilAlt(B,'ilkDokunus',B.oz.pas),0.45)*ILK_KAPI(profilAlt(C,'topsuzHareket',C.oz.karar),0.45);
          const deger=Math.max(0,(xT(nu,nw)-xT(ku,K.z))*100);if(deger<1)continue;
          const a=ILK_ADAY();a.tur='ucuncuAdam';a.kz=kz;a.K=K;a.B=B;a.C=C;a.D=M;a.nu=nu;a.nw=nw;a.deger=deger;a.lam=kz*clamp(deger/5,0.4,2);out.push(a);}}
    },
    hedef(m,P,p,o){
      const d=m.dir[P.takim];
      if(p===P.B&&P.i===0){const k=P.K,bu=p.x*d,ku=k.x*d,dx=(ku-bu),L=Math.abs(dx)||1;o.u=bu+dx/L*2;o.w=p.z;o.ef=0.6;o.h=0.7;o.g='planUcuncu';return o;}   /* teklif: B 2 m pasa gelir */
      if(p===P.C&&P.i===1){if(m.t<P.tKes){o.u=p.x*d;o.w=p.z;o.ef=0.5;o.h=0.6;o.g='planUcuncu';return o;}   /* tepki süresi */
        const cz=m._pln.cizgi[P.takim];o.u=Math.min(P.nu,cz-0.3);o.w=P.nw;o.ef=1;o.h=1;o.g='planUcuncu';return o;}
      return null;}
  },
  /* ---- B.9 derine koşu ve pastan önce kalkış: koşucu ilk hareket eder (planı o açar), çizgi hizasında kavisle başlar, taşıyanın hazırlığında kırar;
     taşıyan koşu gençken bekler ---- */
  derinKosu:{bit:4,ad:'derin koşu',roller:['K: taşıyan (pasçı)','R: koşucu'],baglilik:[1.2,3.5],
    kapi:{gorme:['sezgi'],secme:['topsuzHareket','kanallaraKosar'],yapma:['cabukluk']},
    aday(m,t,K,out){
      const d=m.dir[t],ku=K.x*d,yeni=m._sahiplikBas!=null&&m.t-m._sahiplikBas<3;
      if(ku<-18&&!yeni)return;
      if(K.eylem&&K.eylem.ad==='kontrol'||baskiAltinda(m,K)>=0.8)return;
      const by=K.bakisYon!=null?K.bakisYon:K.yon;if(Math.abs(aciFark(by,d>0?0:Math.PI))>1.05&&!yeni)return;   /* başı yukarıda, hücum yönünün ±60°'si */
      const ofs=m._ofs[t];if(PL-ofs<12)return;   /* çizginin arkasında ≥ 12 m boşluk */
      const GR=m._geride&&m._geride[t],AK=m._araKayit&&m._araKayit[t];
      for(const R of m.teams[t]){if(R===K||!R.oyunda||R.rol==='GK'||R.eylem&&R.eylem.kilit||m._pln.rol.has(R)||GR&&GR.has(R))continue;
        if(!(R.rol==='FV'||R.mevki.kanat||R.rol==='OS'&&!R.mevki.derin&&ku>5))continue;
        if(R.kosu&&R.kosu.tur!=='gel'&&R.kosu.tur!=='aldatma')continue;
        const ru=R.x*d;if(Math.abs(ru-ofs)>6||ru<ku-5)continue;
        const nu=Math.min(PL-8,ofs+12),nw=clamp(R.z+(MZ-R.z)*0.3,4,PW-4),nx=nu*d;
        const tR=hyp(R.x-nx,R.z-nw)/(R.maxSpd*0.95)+0.3;if(ilkRakipVaris(m,t,nx,nw)<tR-0.3)continue;
        const L=hyp(nx-K.x,nw-K.z);if(L<12)continue;if(L<32&&ilkHatKesen(m,t,K.x,K.z,nx,nw,1.6,null)>=2)continue;
        const kz=ILK_KAPI(0.5*profilAlt(R,'topsuzHareket',R.oz.karar)+0.5*(0.5+0.5*profilEgilim(R,'kanallaraKosar')),0.45);
        const deger=Math.max(0,(xT(Math.min(PL-10,nu),nw)-xT(ku,K.z))*100);if(deger<1)continue;
        const ak=AK&&AK.get(R),tet=ak&&m.t-ak.t<0.5?2:1;   /* taşıyanın son kararında bu koşucu için ara noktası bulunduysa (T7c tetiği) ×2 */
        const a=ILK_ADAY();a.tur='derinKosu';a.kz=kz;a.K=K;a.R=R;a.nu=nu;a.nw=nw;a.deger=deger;a.lam=kz*clamp(deger/6,0.4,2)*tet;out.push(a);}
    },
    hedef(m,P,p,o){
      if(p!==P.R||P.i!==1)return null;const d=m.dir[P.takim],K=P.K,yas=m.t-P.tBas,e=K&&K.eylem;
      const kir=e&&e.ad==='vurus'&&e.sec&&e.sec.alici===p||yas>P.tHedef+0.6;
      if(kir){o.u=P.nu;o.w=P.nw;o.ef=1;o.h=1;}
      else{const cz=m._pln.cizgi[P.takim];o.u=Math.min(cz-0.3,p.x*d+2);o.w=P.w0+P.yan*Math.min(3,5*yas);o.ef=0.85;o.h=0.85;}   /* kavis: çizgi hizasında, koridora doğru en çok 3 m yana */
      o.g='planKosu';return o;}
  },
  /* ---- B.13 + B.24 geri çevirme ve üç derinlikli kutu girişi: çizgiye inen taşıyan; ön direk (aldatma), penaltı noktası (geç gelen), yay (ikinci top) ---- */
  geriCevirme:{bit:8,ad:'geri çevirme',roller:['K: çizgiye inen','A: ön direk','B: penaltı noktası (geç gelen)','C: yay'],baglilik:[1.5,4.5],
    kapi:{gorme:['sezgi'],secme:['cezaSahasinaGecGirer','topsuzHareket'],yapma:['orta','pas']},
    aday(m,t,K,out){
      const d=m.dir[t],ku=K.x*d;if(ku<PL-22||Math.abs(K.z-MZ)<9)return;
      const ileri=K.vx*d;if(ileri<1&&ku<PL-12)return;   /* çizgiye iniyor (ya da çizgiye 12 m'den yakın) */
      const yan=Math.sign(K.z-MZ)||1,GR=m._geride&&m._geride[t];
      const ADAY=[];for(const q of m.teams[t]){if(q===K||!q.oyunda||q.rol==='GK'||q.rol==='DEF'||q.eylem&&q.eylem.kilit||m._pln.rol.has(q)||GR&&GR.has(q))continue;
        if(q.kosu&&(q.kosu.tur==='orta'||q.kosu.tur==='gecGiris'))continue;if(q.x*d<PL-38)continue;ADAY.push(q);}
      if(ADAY.length<2)return;
      const yer=(u,w)=>({x:u*d,z:w}),N1=yer(PL-5.5,MZ+yan*2.5),N2=yer(PL-11,MZ+yan),N3=yer(PL-18,MZ-2*yan);
      const yakin=(L,P,haric)=>{let e=null,ed=1e9;for(const q of L){if(haric.includes(q))continue;const dd=hyp(q.x-P.x,q.z-P.z);if(dd<ed){ed=dd;e=q;}}return e;};
      const A=yakin(ADAY.filter(q=>q.rol==='FV'||q.mevki.kanat),N1,[])||yakin(ADAY,N1,[]);
      /* geç gelen: penaltı noktasına 9–30 m uzakta olanların en yakını (uzaktan, zamanlı gelir) */
      const B=yakin(ADAY.filter(q=>{const r=hyp(q.x-N2.x,q.z-N2.z);return r>=9&&r<=30;}),N2,[A])||yakin(ADAY,N2,[A]);
      const C=yakin(ADAY.filter(q=>q.rol==='OS'),N3,[A,B])||yakin(ADAY,N3,[A,B]);
      if(!A||!B)return;
      const kz=ILK_KAPI(0.5*profilAlt(K,'orta',K.oz.pas)+0.5*K.oz.karar,0.45)*ILK_KAPI(0.5*profilAlt(B,'topsuzHareket',B.oz.karar)+0.5*(0.5+0.5*profilEgilim(B,'cezaSahasinaGecGirer')),0.45);
      const deger=xG(PL-11,MZ,'ayak',0.3)*100;
      const a=ILK_ADAY();a.tur='geriCevirme';a.kz=kz;a.K=K;a.A=A;a.B=B;a.C=C;a.yan=yan;a.deger=deger;a.lam=kz*clamp(deger/12,0.4,2);out.push(a);
    },
    hedef(m,P,p,o){
      if(P.i!==1)return null;const d=m.dir[P.takim],yan=P.yan,cz=m._pln.cizgi[P.takim],K=P.K;
      if(p===P.A){o.u=Math.min(PL-5.5,cz-0.3);o.w=MZ+yan*2.5;o.ef=1;o.h=1;o.g='planKutu';return o;}
      if(p===P.B){const ileri=Math.max(2,K.vx*d),tKes=Math.max(0,(PL-4-K.x*d)/ileri),tV=hyp(p.x-(PL-11)*d,p.z-(MZ+yan))/(p.maxSpd*0.9)+0.3;
        if(tKes-tV-0.2>0&&!P.ek){o.u=Math.min(PL-19,cz-0.3);o.w=MZ-3*yan;o.ef=0.6;o.h=0.7;}   /* bekler (geç gelen) */
        else{P.ek=1;o.u=Math.min(PL-11,cz-0.3);o.w=MZ+yan;o.ef=1;o.h=1;}
        o.g='planKutu';return o;}
      if(p===P.C){o.u=Math.min(PL-18,cz-0.3);o.w=MZ-2*yan;o.ef=0.7;o.h=0.8;o.g='planKutu';return o;}
      return null;}
  }
};
const ILK_SIRA=['duvarPasi','ucuncuAdam','derinKosu','geriCevirme'];
