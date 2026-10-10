/* ============ Hava topu ölçümü (T6-0, 2026-10-10; gerçekçilik planı §4 T6 "Alt adımlar") ============
   Motora dokunmaz: olayları (dinle) ve her adımın sonunda (adim) topu, oyuncuların sıçrama (p.zipla, p.yuk) ve eylem alanlarını okur.
   Oranlar bütün maçların toplamından (ham), diğer satırlar maç başına ortalamadır. Tanımlar:
   - Yüksek top (bölüm): oyunda, sahipsiz top 2,4 m'nin üstüne çıktı. Kaynak topa son dokunuşun olayından ('cross' orta, 'pass' havadan pas ya
     da ≥ 32 m uzun top, 'clear' uzaklaştırma, 'gkkick' ve kalecinin elle atışı kaleci, 'header' kafa, 'shot' şut, 'sekme' / 'block' /
     'ilkDokunus' / kurtarış sekme); duran topun vuruşu olay yaymaz, duruşun olayından (korner, serbest vuruş, kale vuruşu, taç, penaltı → şut).
   - İniş: top bölümde ilk kez 2,6 m'nin altına inerken (vy < 0); o anda topun yerine 1,5 ve 3 m içindeki saha oyuncuları takım başına.
     Çekişmeli iniş: iki takımdan da o mesafede biri var.
   - İlk temas: bölümdeki ilk 'header' (kafa), 'ilkDokunus' (göğüs ya da ayak), 'sekme' / 'block' (gövde), kalecinin eli (topu tuttu ya da
     'yumruk', 'save', 'parmak', 'kapan'); temas yoksa yere (top 0,3 m'nin altına indi) ya da dışarı (oyun durdu).
   - Düello: bölümde m.ist.havaTopu arttı (motorun tanımı). Sıçrama: p.zipla null → nesne (bölümde oyuncu başına bir kez); koşarak: o an
     hızı > 2,5 m/sn; yükseklik p.zipla.tepe.
   - Kafa: temas anında top − alın (kafaYuksekligi − 0,1; + top alnın üstünde, m); sıçrayan kafacıda zamanlama = sıçrama evresi − tepe
     (+ geç, − erken; sn; tepe = süre/2).
   - Sonra: bölümden sonraki 3 sn içinde topa ilk sahip olan takım; atan takım tuttu %.
   - Hava faulü: 'faul', 'avantaj' ya da 'faulGorulmedi' olayında neden ya da kaynak 'hava'.
   Bantlar (T6 kabulü, gerçekçilik planı §4 T6): hava faulü 0,8–2,5/maç; hava topu mücadelesinin bandı (6–15) hedef tablosunda. */
'use strict';
const H_KAYNAK=['orta','korner','serbest','uzunTop','havaPas','uzaklastirma','kaleVurusu','kaleci','kafa','tac','sekme','sut','diger'];
const H_KAYNAK_AD={orta:'orta',korner:'korner',serbest:'serbest vuruş',uzunTop:'uzun top (≥ 32 m)',havaPas:'havadan pas',uzaklastirma:'uzaklaştırma',
  kaleVurusu:'kale vuruşu',kaleci:'kaleci (degaj, elle)',kafa:'kafa',tac:'taç',sekme:'sekme ve blok',sut:'şut',diger:'diğer'};
const H_TEMAS=['kafa','gogus','ayak','govde','el','yere','disari','yok'];
const H_TEMAS_AD={kafa:'kafa',gogus:'göğüs',ayak:'ayak',govde:'gövde (sekme, blok)',el:'kalecinin eli',yere:'yere düştü',disari:'oyun dışı',yok:'6 sn içinde yok'};
const hOrtanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b),n=S.length;return n%2?S[(n-1)/2]:(S[n/2-1]+S[n/2])/2;};
module.exports={
  bilgi:[['— Hava topu (h-hava; T6) —',null,0],['Yüksek top (2,4 m üstü) / maç','hBolum',1]]
    .concat(H_KAYNAK.map(k=>['Yüksek top kaynağı: '+H_KAYNAK_AD[k]+' %','hK_'+k,1]))
    .concat([['İniş: iki takımdan 1,5 m içinde %','hCek15',1],['İniş: iki takımdan 3 m içinde %','hCek3',1],['İniş: kimse 3 m içinde değil %','hBos3',1]])
    .concat(H_TEMAS.map(k=>['İlk temas: '+H_TEMAS_AD[k]+' %','hT_'+k,1]))
    .concat([['İlk temas kafa, çekişmeli inişte %','hCekKafa',1],['Atan takım ilk temasta %','hTemasAtan',1],
      ['Hava düellosu (bölümde) / maç','hDuello',2],['Sıçrama / maç','hSicrama',1],['Sıçrama: koşarak %','hSicramaKos',1],
      ['Sıçrama yüksekliği ort. (m)','hSicramaH',2],['Kafa (bölümde ilk temas) / maç','hKafa',2],['Kafa: top − alın ortanca (m)','hKafaFark',2],
      ['Kafa: |top − alın| ≤ 0,12 m %','hKafaAlin',1],['Kafa: sıçrayarak %','hKafaSicrama',1],['Kafa: zamanlama ortanca (sn; + geç)','hKafaZam',3],
      ['Kafa: |zamanlama| ortanca (sn)','hKafaZamMut',3],['Kafa yüzeyi (T6c): alın %','hY_alin',1],['Kafa yüzeyi: yan %','hY_yan',1],
      ['Kafa yüzeyi: tepe (sıyırma) %','hY_tepe',1],['Kafa yüzeyi: yüz ve boyun %','hY_yuz',1],['Kafa: çekişmeli (düelloda) %','hY_cek',1],
      ['Sonra: atan takım topu tuttu %','hTuttu',1],
      ['Hava faulü / maç','hFaul',2,[0.8,2.5,'T6']]]),
  yeni:()=>{
    const hyp=Math.hypot,kaynak={},temas={};for(const k of H_KAYNAK)kaynak[k]=0;for(const k of H_TEMAS)temas[k]=0;
    let bolum=0,inis=0,cek15=0,cek3=0,bos3=0,cekKafa=0,cekN=0,temasAtan=0,temasN=0,duello=0,sicrama=0,sicramaKos=0,kafaSicrama=0,kafaN=0,tuttu=0,tuttuN=0,faul=0;
    const sicH=[],kFark=[],kZam=[],yz={alin:0,yan:0,tepe:0,yuz:0};let yzN=0,yzCek=0;
    let ep=null,sonra=null,bekle=null,son='diger';
    const DURAN={korner:'korner',serbest:'serbest',kaleVurusu:'kaleVurusu',tac:'tac',penalti:'sut'};
    const kapat=(m,tur,p)=>{temas[tur]++;if(ep.cek)cekN++;
      if(p&&p.team!=null){temasN++;if(p.team===ep.takim)temasAtan++;}
      if(tur==='kafa'){kafaN++;if(ep.cek)cekKafa++;
        const alin=1.72*(p.boy||1)+0.12+(p.yuk||0)-0.1;kFark.push(m.ball.y-alin);
        if(p.zipla&&p.zipla.sure>0){kafaSicrama++;kZam.push(p.zipla.t-p.zipla.sure/2);}}
      if(m.ist.havaTopu>ep.havaOnce)duello++;
      sonra=tur==='disari'?null:{takim:ep.takim,t:m.t};ep=null;};
    return{
      dinle(ad,v,m){if(!m)return;
        if(ad==='faul'||ad==='avantaj'||ad==='faulGorulmedi'){if(v&&(v.neden==='hava'||v.kaynak==='hava'))faul++;return;}
        /* son dokunuşun kaynağı (bölüm açılınca okunur) */
        if(ad==='header'&&v&&v.yuzey){yzN++;if(yz[v.yuzey]!=null)yz[v.yuzey]++;if(v.cek)yzCek++;}   /* bütün kafalar (bölümden bağımsız) */
        if(DURAN[ad])son=DURAN[ad];
        else if(ad==='cross')son='orta';
        else if(ad==='pass')son=v&&v.p&&v.p.rol==='GK'&&!v.tip?'kaleci':v&&v.tip==='hava'?(v.long?'uzunTop':'havaPas'):'diger';
        else if(ad==='clear')son='uzaklastirma';else if(ad==='gkkick')son='kaleci';else if(ad==='header')son='kafa';else if(ad==='shot')son='sut';
        else if(ad==='sekme'||ad==='block'||ad==='ilkDokunus'||ad==='save'||ad==='parmak'||ad==='yumruk'||ad==='kotuKontrol')son='sekme';
        if(!ep||bekle)return;
        if(ad==='header')bekle=['kafa',v.p];
        else if(ad==='ilkDokunus')bekle=[v.tur==='gogus'?'gogus':'ayak',v.p];
        else if(ad==='sekme'||ad==='block')bekle=['govde',v.p];
        else if(ad==='yumruk'||ad==='save'||ad==='parmak'||ad==='kapan')bekle=['el',v.p];},
      adim(m){const b=m.ball;
        if(m.phase!=='play'){if(ep)kapat(m,'disari',null);sonra=null;bekle=null;return;}
        if(sonra){const s=b.sahip||b.tasiyan;if(s&&s.team!=null){tuttuN++;if(s.team===sonra.takim)tuttu++;sonra=null;}else if(m.t-sonra.t>3)sonra=null;}
        if(ep){
          for(const p of m.players){const z=p.zipla;if(!p.oyunda||!z||ep.sic.has(p))continue;if(z.t>2.5/60)continue;
            ep.sic.add(p);sicrama++;if(p.spd>2.5)sicramaKos++;sicH.push(z.tepe!=null?z.tepe:z.h||0);}
          if(!ep.inis&&b.vy<0&&b.y<2.6){ep.inis=true;inis++;const n15=[0,0],n3=[0,0];
            for(const p of m.players){if(!p.oyunda||p.rol==='GK')continue;const d=hyp(p.x-b.x,p.z-b.z);if(d<3){n3[p.team]++;if(d<1.5)n15[p.team]++;}}
            if(n15[0]&&n15[1]){cek15++;ep.cek=true;}if(n3[0]&&n3[1])cek3++;if(!n3[0]&&!n3[1])bos3++;}
          if(bekle){const tur=bekle[0],p=bekle[1];bekle=null;kapat(m,tur,p);}
          else if(b.tasiyan&&b.tasiyan.rol==='GK')kapat(m,'el',b.tasiyan);
          else if(ep.inis&&b.y<0.3)kapat(m,'yere',null);
          else if(m.t-ep.t0>6)kapat(m,'yok',null);
          return;}
        bekle=null;
        if(!b.sahip&&!b.tasiyan&&b.y>2.4){const k=son;bolum++;kaynak[k]++;
          ep={kaynak:k,takim:b.sonTakim,t0:m.t,havaOnce:m.ist.havaTopu,inis:false,cek:false,sic:new Set()};}},
      bitir(){
        const ham={hCek15:[cek15,inis],hCek3:[cek3,inis],hBos3:[bos3,inis],hCekKafa:[cekKafa,cekN],hTemasAtan:[temasAtan,temasN],
          hSicramaKos:[sicramaKos,sicrama],hY_alin:[yz.alin,yzN],hY_yan:[yz.yan,yzN],hY_tepe:[yz.tepe,yzN],hY_yuz:[yz.yuz,yzN],hY_cek:[yzCek,yzN],hKafaAlin:[kFark.filter(x=>Math.abs(x)<=0.12).length,kFark.length],hKafaSicrama:[kafaSicrama,kafaN],hTuttu:[tuttu,tuttuN]};
        for(const k of H_KAYNAK)ham['hK_'+k]=[kaynak[k],bolum];
        let tN=0;for(const k of H_TEMAS)tN+=temas[k];for(const k of H_TEMAS)ham['hT_'+k]=[temas[k],tN];
        return{ham,hBolum:bolum,hDuello:duello,hSicrama:sicrama,hSicramaH:sicH.length?sicH.reduce((a,c)=>a+c,0)/sicH.length:NaN,hKafa:kafaN,
          hKafaFark:hOrtanca(kFark),hKafaZam:hOrtanca(kZam),hKafaZamMut:hOrtanca(kZam.map(Math.abs)),hFaul:faul};}
    };
  }
};
