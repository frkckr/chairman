/* ============ Chairman — maç günü senaryosu: yalnızca veri ============
   Maç öncesinin zaman çizelgesi. Kaynaklar: Premier League ısınma protokolü (kaleciler maçtan ~45 dk, takımlar ~35 dk önce çıkar,
   saha ~10 dk önce boşalır; hakemler orta çizgi boyunca koşar), TFF statüsü (İstiklal Marşı, tokalaşma: misafir takım kaptanı
   önde önce hakemlerle sonra ev sahibiyle; ardından ev sahibi hakemlerle), IFAB Kural 8 (yazı tura: kazanan kaleyi ya da santrayı seçer).
   Süreler gerçek saniyedir (motor saniyesi). [a, b] biçimindeki değerler rastgele aralıktır: her maç biraz farklı akar.
   Yürütücü js/mac-oncesi.js'tir; görüntü (tribünün dolması, bakış) bu çizelgeyi okur. */
const MAC_SENARYOSU={
  /* maça kalan dakika (skor tabelası): [senaryo saniyesi, kalan dakika] noktaları arasında doğrusal */
  kalan:[[0,60],[20,45],[55,35],[190,15],[215,10],[262,3],[330,0]],
  /* tribünün dolması: [senaryo saniyesi, gelenlerin oranı]. Ev taraftarı erken gelir, deplasman otobüsle topluca, locadakiler geç */
  tribun:[[0,0.18],[50,0.3],[140,0.58],[215,0.82],[262,0.95],[300,1]],
  kaleciler:[[15,19],[21,27]],        // ev sahibi ve misafir kalecileri, kaleci antrenörleriyle
  hakemler:{cikis:[36,42],iceri:[150,158]},
  takimlar:{cikis:[[46,50],[52,58]],iceri:[186,206]},   // her oyuncu kendi anında içeri girer
  /* takım ısınması, sırasıyla: [ad, süre sn]. Yardımcı antrenör koni dizer, kondisyoner el çırpar */
  driller:[['kosu',18],['esneme',15],['rondo',32],['paslasma',22],['sut',30],['depar',10]],
  dorduncu:[196,202],                 // 4. hakem tabelasıyla çıkar
  yedekler:[204,236],                 // yedekler ve antrenörler rastgele anlarda kulübeye
  fotografcilar:[222,232],            // yalnız çekiliş: fotoğrafçılar marştan sonra çıkar, bu aralık çıkış gecikmesini (0–1,5 sn) verir
  teknikDirektorler:[240,254],        // en son teknik direktörler
  giris:262,                          // tünelden çıkış: önde 3 hakem, arkada iki sıra oyuncu
  mars:26,                            // İstiklal Marşı (sn)
  selamAdim:0.95,                     // tokalaşmada bir kişiden ötekine geçiş süresi (sn)
  foto:8,                             // takım fotoğrafı (sn)
  yazitura:10,
  santraSecimi:0.6                    // yazı turayı kazananın santrayı seçme olasılığı (yoksa kaleyi seçer)
};
