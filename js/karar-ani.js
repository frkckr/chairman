/* ============ Chairman — karar anı kayıt defteri (yol haritası N12; yalnız veri, çizim ve kural yok) ============
   Karar anı: tokalaşma gibi bir anda, sahne durmadan açılan iki büyük cevaplı ve kısa süreli seçim (OYUN_TASARIMI §10 “Süreli cevaplar”).
   Süre seçenekler okunur olduktan sonra başlar; süre dolarsa kayıttaki cevapsız sonucu işler (üçüncü düğme değildir). Sunum js/ekran-an.js,
   sahne js/loca-giris.js'tedir. TEKNIK_PLAN §6 kayıt defteri kalıbı: içerik dosyaları KARAR_ANLARI'na kayıt ekler.
   Kayıt: {kim(o) → üst etiket (o: {rakipKulup}), cevaplar: [{id, metin, alt?}, {…}] (tam iki), sure (sn), cevapsiz: sonucun kimliği,
           tepki: {cevapKimliği: sahnedeki karşılık}} — tepkiler pozla oynanır: karsilik (gülümseyip karşılık, baş selamı), soguk (kısa soğuk
           baş selamı, yüzünü çevirir), basSelami (el bırakılır, kısa baş selamı).
   Seçimin kariyere ve ilişkiye etkisi yoktur: maç günü henüz kariyere bağlı değildir (3.5, 5.4); seçim yalnız maç oturumunda tutulur
   (MAC_PROTOKOL.karar). Etkisi varmış gibi sunulmaz. */
const KARAR_ANLARI={};
/* TEST kaydı: kullanıcının örneği (2026-10-04, N12 notu). Nihai cümleler kullanıcının; durum satırı yazılmaz */
KARAR_ANLARI.rakipTokalasma={
  kim:o=>o.rakipKulup+' Başkanı',
  cevaplar:[{id:'selam',metin:'Selam ver'},{id:'sus',metin:'Ses çıkarma'}],
  sure:5,cevapsiz:'cevapsiz',
  tepki:{selam:'karsilik',sus:'soguk',cevapsiz:'basSelami'}
};
