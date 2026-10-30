# Antrenman — gerçek dünya araştırması ve oyuna uyarlama kaydı (2026-10-30)

Durum: **araştırma kaydı; karar değil.** Kullanıcının isteğiyle (2026-10-30 notları: “antrenman konusunu bir araştır, gerçekçi olarak dünyada futbolda nasıl yapılıyor … illa şimdi yapmıyorsak da olması gereken planın yerine araştır ve yerleştir”) hazırlandı. Önerilen yeri: **R6b-2 antrenman kuralı** turu (günün menüsü, personel ve tesisle açılan çeşitlilik, yük ve sakatlık riski) ve antrenman canlandırma serisi (F5'in kalanı, görsel). Kaynak araştırmayı Claude'un araştırma alt ajanı yaptı (web araması; akademik özetler, UEFA ECIS yayınları, kulüp ve basın haberleri); birincil kaynağa inilemeyen yerler “ikincil” ya da “kaynak bulunamadı” diye işaretlidir. “Balkondan görünen” sütunu oyun için çıkarımdır, kaynağı yoktur.

## 0. Bugünkü kodla eşleme (Claude; tur planlanırken okunur)

| Bugün | Araştırmanın karşılığı | Tur |
|---|---|---|
| `antrenmanProgrami` üç gün türü: yoğun, toparlanma, hafif (+ maç, dinlenme); yük hoca tarzından katsayı (`ANTRENMAN_TARZ_YUK`) | Maça göre gün modeli MD+1 … MD-1 (§2): her günün baskın niteliği, alan büyüklüğü ve yük biçimi farklı; haftada iki maçta dört günlük döngü | R6b-2: gün türü MD±N'e genişler, “günün menüsü” buradan türer |
| `antrenmanDuzeni` beş grup: koşu, rondo, şut, esneme, ayrı koşu (+ kaleci, kenar); sabit sayılar (`ANTRENMAN_DUZEN_TEST`) | Çalışma kataloğu (§1): 15 tür; günün menüsü 2–4 eşzamanlı kümeden kurulur | R6b-2 kural; canlandırmalar seri hâlinde (her turda 2–3) |
| Personelin antrenmana etkisi yok; TEST yardımcı antrenör ve mali işler müdürü | Personel → açılan türler ve kalite (§4, §6 tablosu); kondisyoner ve doktor değişimi hamstring yükünü belirgin artırır | R6b-1/2: personel slotu; P12 hoca değişiminde “kendi kondisyonerini getirdi” kıvrımı |
| S-a: yük kondisyonun toparlanmasını ve gelişimi etkiler; antrenmanda sakatlık yok | Yük yönetimi (§3): ceza “çok antrenman”a değil ani sıçramaya ve düşük kronik yüke; antrenman sakatlığı maçın onda biri | R6b-2: “ani sıçrama” kuralı (kronik yük + haftalık yük); antrenman sakatlığı nadir ve yüke bağlı; sezon öncesi kamp H3 ile |
| Tek saha, tarifte tesis yok | Tesis (§5): tek saha paylaşımı, suni çim, ışık, salon, kamp | Aşama 8 tesis; R6b-2'de yalnız “saha sayısı” bayrağı TEST |
| Balkon sinyalleri: dönen sakat, yorgun, parlayan genç, durgun | Görünür türler ve dolaylı işaretler (§6): boş saha = içeride çalışma | R-balkon ve R6b-2: sinyal baktığın kümeden gelir |

## 1. Çalışma türleri kataloğu

| Tür | Kişi | Alan / yer | Süre | Gün (maça göre) | Balkondan görünen |
|---|---|---|---|---|---|
| Isınma (koşu, hareketlilik, FIFA 11+) | Tüm takım | Sahanın bir yarısı, çizgi boyu | 15–20 dk | Her gün | Sıra hâlinde yavaş koşu, kolektif esneme |
| Rondo (4v2 aslı; 5v2, 6v3) | 6–9 kişilik gruplar | ~11×11 m kare, sahanın köşelerinde | 10–15 dk | Her gün, çoğu zaman ısınma sonrası; MD-1'de önerilir | Küçük kareler, ortada 2 kişi, hızlı kısa paslar |
| Küçük alan oyunu (3v3–5v5) | 6–10 | 5v5 için 40×30 m (~120 m²/kişi); 4v4 maçtan türetilmiş derinlik ~16 m | 3–4 dk set, 3–6 set (genel uygulama; kesin kaynak bulunamadı) | MD-4 (kuvvet) ve MD-2 (hız) | Küçük kalelerle 2–3 paralel oyun |
| Orta alan oyunu (7v7–8v8) | 14–16 | Maçtan türetilmiş 7v7 ≈ 28×32 m | 20–30 dk | MD-4 / MD-2 | Yarı sahada orta kalelerle tek oyun |
| Büyük alan / 11v11, 11v10 | 20–22 | Tam saha ya da 2/3 saha | 25–40 dk | MD-3 (“dayanıklılık” günü) | İki takım tam dizilişle, uzun süre |
| Hat/ünite çalışması (savunma, orta, forvet) | 3 grup, her grupta bir antrenör | Üç ayrı bölge, sonra birleşme | 15 dk izole + 20 dk birleşik | Boş haftada en az iki kez; MD-4 | Üç ayrı küme, her kümede ayrı antrenör |
| Teknik tekrar (pas, kontrol, orta, kafa, çalım) | 4–8 kişilik istasyonlar | Köşeler, 20–30 m koridorlar | 15–20 dk | MD+2, MD-4 | Koni sıraları, kalıplı pas ağları |
| Bitiriş / şut | 6–12 | Ceza sahası ve kaleler | 15–20 dk | MD-4, MD-2 | Kaleye sırayla şut, toplar kalenin arkasında birikir |
| Taktik: şekil, pres, oyun kurma | Tüm takım, çoğu zaman rakipsiz ya da gölge | Tam saha | 20–30 dk | MD-3 (rakip planı), MD-1 (son ayar) | Hoca ortada, takım duraklayıp yer değiştiriyor |
| Duran top | Tüm takım | Ceza sahası | 10–15 dk bloklar (Jover) | MD-1; yoğun fikstürde “ara bulup” | Kalabalık ceza sahası, tekrar tekrar aynı korner |
| Kuvvet (salon) | Bireysel / küçük grup | Salon, saha dışı | Çoğunlukla öğleden sonra, saha sonrası (ekiplerin %78–89'u “eşzamanlı” uygular) | MD-4 / MD-3 eğilimi (hamstring egzersizleri için anket) | Saha boş; birkaç oyuncu binaya giriyor |
| Hız / tekrarlı sprint | Tüm takım | 30–40 m düz koridor | 10–15 dk | MD-4 vs MD-3 (maça yaklaştıkça ağrı artar) | Düz çizgide sprint, uzun bekleme |
| Toparlanma (yavaş koşu, esneme, soğuk su, masaj) | Oynayanlar / oynamayanlar ayrı | Saha kenarı + bina | 30–45 dk | MD+1 (pasif) ve MD+2 (aktif) | Oynayanlar ağır yürüyüş/esneme, oynamayanlar ayrı oyun |
| Kaleci özel | 2–3 kaleci + antrenör | Bir kale ve 18–36 m yay | 30–45 dk | Her gün, takımdan önce/ayrı | Kale önünde 3 kişi; ortalar, yere atışlar |
| Video analiz | Tüm takım ya da birey | Toplantı odası | 5–7 dk video, ~20 dk oturum; MD+2 sunum | MD+2 (geçmiş), MD-3/MD-1 (rakip) | Saha boş; herkes içeride |

Notlar: Rondonun kökeni Laureano Ruiz'e bağlanır, Cruyff Barcelona'da yaygınlaştırdı; tam kare ölçüsü standart değildir. Küçük formatlar (<3v3) fizyolojik olarak daha ağır, 4v4 üstü formatlar daha fazla koşu; alan/kişi büyüdükçe mesafe, laktat ve RPE artar. Kaleci seansı ısınma → tutuş → orta ve dağıtım, rakipsizden rakipliye ilerler. Toparlanmada soğuk su için 10 randomize çalışmanın meta-analizi (2026): kas kuvveti ve sıçramada 48. saatte iyileşme, sprintte etki yok, güven aralıkları sıfırı içeriyor; masaj ve soğuk su özellikle algılanan toparlanmada önerilir. Tam seansın toplam süresi için güvenilir kaynak bulunamadı; MD-1 yaklaşık 1 saattir (Spielverlagerung).

Kaynaklar: [Rondo tarihi](https://hawksmoorpublishing.com/rondo-training-ideas-and-practices) · [Rondo 4v2](https://footballgpt.co/practices/rondo-4v2) · [SSG format meta-analizi, Clemente 2025](https://www.thieme-connect.com/products/ejournals/pdf/10.1055/a-2591-6995.pdf) · [Alan büyüklüğü, Rumpf 2025](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2025.1592536/pdf) · [Maçtan türetilmiş 4v4/7v7 alanları](https://www.scitepress.org/Papers/2014/51912/) · [5v5 40×30 tablosu](https://pmc.ncbi.nlm.nih.gov/articles/PMC9331353/table/t0005) · [Mevkiye özel gruplar](https://elitesoccercoaching.net/other/position-specific-coaching) · [Jover duran top blokları](https://ca.sports.yahoo.com/news/arsenal-became-set-piece-masters-151602616.html) · [Kuvvet antrenmanı uygulayıcı anketi](https://pureportal.coventry.ac.uk/en/publications/practices-of-strength-and-conditioning-coaches-in-professional-sp/) · [Hamstring egzersizi günü anketi](https://esploro.umontpellier.fr/esploro/outputs/journalArticle/Weekly-Programming-of-Hamstring-Related-Training-Contents/9936169409311) · [Tekrarlı sprint MD-4 vs MD-3](https://www.citedrive.com/en/discovery/scheduling-repeated-sprint-training-on-different-microcycle-days-in-professional-soccer-players-a-randomized-crossover-study/) · [Soğuk su meta-analizi 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC12767754) · [Toparlanma yöntemleri 2022](https://pubmed.ncbi.nlm.nih.gov/35961644/) · [Kaleci: ortalar ve dağıtım](https://elitesoccercoaching.net/out-of-possession/keepers-crossing-and-distribution) · [Video analist haftası](https://once.sport/blog/how-do-professionals-analyse/) · [20 dk maç sonrası video](https://www.veo.com/article/the-20-minute-post-match-video-review-session-that-actually-works)

## 2. Haftalık mikrodöngü

**Ölçülen yük (La Liga yedek takımı, GPS, 2015/16):** Yük MD-4 → MD-3 → MD-2 → MD-1 düzenli düşer (etki büyüklüğü 0,4–3,1). Hızlanma/yavaşlama sayısı maçın yüzdesi olarak: MD+1 (az oynayanlar) %80–86, MD-4 %71–72, MD-3 %62–69, MD-2 %56–61. Bekler MD-3 ve MD-4'te diğer mevkilerden daha fazla yüksek hız koşusu yapar. Başka çalışmalar MD+1, MD-4 ve MD-3'ü en ağır, MD-2'yi en hafif gün bulur; altı günlük döngüde MD-4 en ağır, MD-3 bazen izin günü. Yani etiketler ortak bir şablon, dağılım hocaya göre değişir.

**Taktik periyotlama (Frade/Mourinho) morfosiklüsü — Pazar maçı örneği:**

| Gün | Baskın nitelik | İlke düzeyi | Alan / kişi | Yük biçimi |
|---|---|---|---|---|
| MD+1 | Pasif dinlenme; zihinsel yorgunluk öncelikli | — | — | İzin |
| MD+2 | Aktif toparlanma | Genel oyun modeli ya da maç tekrarı; rakip yok | Kısa, basit, bol dinlenme | Az oynayana daha çok yük |
| MD-4 | Kuvvet (hızlanma, yön değişimi, sıçrama, şut) | Alt ve alt-alt ilkeler; birey/grup/hat | Dar alan | Kısa, yüksek şiddet, uzun dinlenme |
| MD-3 | Süre (özgül dayanıklılık); en karmaşık gün | Ana ilkeler; kolektif | 11v11, 11v10, 10v10, büyük alan | Uzun aralıklar; rakip planı girer |
| MD-2 | Hız (fiziksel, karar, tepki) | Alt ilkeler | Dar alan, sayısal dengesizlik | Kısa patlamalar, düz sprint, aşırı yük yok |
| MD-1 | Aktivasyon | Duran top, son ayrıntılar | Yarı ya da 2/3 sahada 11v11, rondo | ~1 saat, tam dinlenme |

Klasik periyotlamadan farkı: “periyot” fiziksel yükün değil taktik ilkelerin sıralanmasıdır; ayrı bir fiziksel hazırlık dönemi yoktur (ilk kamp haftası hariç), kondisyon taktik performansla ölçülür, yorgunluk “taktik yorgunluk” (merkezi sinir sistemi) sayılır. Klasik okul MD-4'ü kuvvet, MD-3'ü dayanıklılık, MD-2'yi hız diye fiziksel etiketler, ama akademik veri hocaların yükü farklı dağıttığını gösterir.

**Haftada iki maç:** Sıkışık fikstür 96 saatten kısa aralık olarak tanımlanır. Dört günlük döngü MD+1, MD-2, MD-1, MD olur; üç günlük döngü ölçülmemiştir. İki maçlı haftada toplam mesafe (maç + antrenman) tek maçlı haftadan yüksektir; Ligue 1 örneğinde oyuncuların yalnız %25–40'ı iki–üç maçlık döngünün bütün maçlarını tamamlar (rotasyon zorunlu). Sakatlık kanıtı karışık; seyahat ve akşam maçı toparlanmayı ayrıca bozar.

Kaynaklar: [Martín-García 2018](https://researchonline.ljmu.ac.uk/id/eprint/9011/) · [Mikrodöngü planlama karşılaştırması](https://data.mendeley.com/datasets/v2xb82x423) · [Spielverlagerung taktik periyotlama](https://spielverlagerung.com/2020/05/23/understanding-the-tactical-periodization-methodology/) · [Taktik periyotlama uygulaması](https://maloneperform.substack.com/p/how-to-implement-tactical-periodisation) · [DU Sport Sense gün örnekleri](https://www.du.edu/sport-sense/news/training-tactical-periodization-game-idea-principle-example-ball-progression) · [Fikstür sıkışıklığı meta-analizi, Julian 2020](https://eprints.glos.ac.uk/8915/1/8915-Julian-(2020)-The-effect-of-fixture-congestion-on-performance.pdf) · [Sıkışık dönem ve sakatlık 2022](https://e-space.mmu.ac.uk/631095/3/s40279-022-01799-5.pdf) · [Rotasyon ve iki maçlı hafta](https://pmc.ncbi.nlm.nih.gov/articles/PMC7846542)

## 3. Yük yönetimi ve sakatlık

**Temel oranlar (UEFA ECIS):** 2001–2008'de 23 elit takımda 8,0 sakatlık/1000 saat; maçta 27,5, antrenmanda 4,1; en sık tek tip uyluk kas zedelenmesi (%17). Hamstring 2001–2022: 2,1 milyon saatte 2.636 yaralanma, üçte biri antrenmanda, maç riski antrenmanın ~9–10 katı, ortalama 13 gün kayıp. Antrenmandaki hamstring insidansı 2014/15–2021/22 arasında yılda ~%6,7, yükü ~%9 arttı. Hamstringlerin ~%70'i sprint/yüksek hızda (tez; birincil kaynakta doğrulanamadı). Risk etkenleri: en güçlüsü önceki yaralanma; yaş 23 üstünde ~2,5 kat (ikincil kaynak, çelişen çalışmalar var).

**Sezon öncesi (“hoca çok yüklendi” haberinin arkası):** 44 takım, 244 takım-sezon: hazırlık döneminde ortalama 30 antrenman (10–51); daha fazla seans, beş ölçünün dördünde sezon içi daha az sakatlık; her +10 seans ≈ 22 gün/1000 saat daha az kayıp. Yani sorun “çok antrenman” değil, kötü dağıtılmış yük ve ani sıçramadır. Karşı kanıt: Coppalle 2019'da hazırlık yükü ile sakatlık arası ilişki yok; Ritzmann 2020'de ACWR sıçramaları sakatlıkla ilişkisiz. Türkiye örneği: Beşiktaş 2022 — Ismael'in yaz kampındaki ağır yüklemeler, Kasım'da 14 sakat (çoğu adale ve kasık), Güneş “genel fiziksel sorun” dedi; Tudor ise sakatlıkların idmandan değil maçtan geldiğini savundu. Çift antrenman: 12 yarı profesyonelde ikinci seans 24 saat sonra nöromüsküler güç, ruh hâli ve hormon göstergelerinde küçük düşüş; öneri, ağır çift seans günlerini hafif teknik-taktik günlerle dönüşümlü kurmak.

**Akut:kronik yük (ACWR):** Son 7 günün yükü / son 3–6 haftanın (çoğunlukla 28 gün) yükü. Premier League GPS çalışması (n=33): kronik yavaşlama yükü düşükken ACWR > 2,0 olunca temassız sakatlık riski 6,7 kat. Sistematik incelemeler (2022, 2024) ilişkiyi “sonuçsuz” bulur, eşik kurulamaz; sRPE tabanlı ACWR temassız sakatlıkla ilişkili olabilir. Kronik yükü yükseltmek dayanıklılığı artırır (gençlerde). Oyunda: kural olarak değil, “düşük kronik + ani sıçrama = risk” olarak kullanılmalı.

**Takip:** 82 üst düzey kulübe anket, 41 cevap: 40'ı her saha antrenmanında her oyuncudan kalp atımı ve GPS toplar; en çok kullanılan dış yük GPS, iç yük RPE.

**Personel değişimi (ECIS, 14 kulüp, 42 takım-sezon):** Kondisyoner/performans antrenörü değişince hamstring yükü %63 arttı (p=0,017); doktor değişince %81 (p=0,011); yeni hocanın kendi kondisyonerini getirmesi 45 vs 16 gün/1000 saat (p<0,001). Yalnız hoca değişimi %19 (anlamsız). Yazarların önerisi: destek personeli sabit, devir teslim dikkatli, yeni antrenmana “asgari müdahale”.

**Rotasyon:** Rotasyonun sakatlığı azalttığına dair doğrudan kaynak bulunamadı; yalnız yukarıdaki %25–40 tamamlama verisi var.

Kaynaklar: [ECIS 2011](https://bjsm.bmj.com/content/45/7/553) · [Hamstring 21 sezon, BJSM 2023](https://bjsm.bmj.com/content/57/5/292) · [BJSM blog hamstring yükü](https://blogs.bmj.com/bjsm/2023/01/20/footballs-burden-hamstring-injuries-in-professional-mens-football-2/) · [Hamstring risk etkenleri, Aspetar](https://journal.aspetar.com/en/journals/volume-2-targeted-topic-hamstring-injuries/risk-factors-for-hamstring-injuries-a-current-view-of-the-literature) · [Hazırlık seansları ve sakatlık, Ekstrand 2020](https://pubmed.ncbi.nlm.nih.gov/31990574/) · [Barça Innovation Hub özeti](https://elearning.barcainnovationhub.com/can-the-preseason-reduce-the-risk-of-injury/) · [Sezon başı sakatlıkları](https://analyticsfc.co.uk/blog/2023/09/29/change-acclimation-or-load-management-why-is-the-beginning-of-the-season-so-bad-for-injuries/) · [Coppalle 2019](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2019.00409/full) · [Ritzmann 2020](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.00075/pdf) · [Beşiktaş–Ismael yüklemeleri](https://www.posta.com.tr/galeri/ismaelin-yuklemeleri-senol-gunese-yuk-oldu-sakatliklar-onun-yuzunden-mi-2582928) · [Tudor açıklaması](https://www.diken.com.tr/?p=407603) · [Tek vs çift seans](https://lida.sport-iat.de/ta/Record/4058405) · [ACWR sistematik inceleme 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9602492) · [ACWR 2024 inceleme](https://doaj.org/article/1e3fd3e95f4b4e26ad7288b9c619fa61) · [Premier League ACWR > 2,0](https://bjsm.bmj.com/content/54/12/731) · [Akenhead & Nassis 2016](https://pubmed.ncbi.nlm.nih.gov/26456711/) · [Personel değişimi ve hamstring, ECIS](https://pmc.ncbi.nlm.nih.gov/articles/PMC10660205/)

## 4. Antrenman ekibi

| Rol | Mümkün kıldığı / kalitesini belirlediği çalışma |
|---|---|
| Teknik direktör | Oyun modeli, taktik günler (MD-3, MD-1), yük kararı son sözde onda |
| Yardımcı antrenör(ler) | Paralel gruplar (hat/ünite çalışması her gruba bir antrenör ister), bireysel teknik, rakip çalışması |
| Kondisyoner / performans antrenörü | Mikrodöngü yük dağılımı, kuvvet ve hız günleri, GPS/RPE okuma; değişimi hamstring yükünü %63 artırır |
| Kaleci antrenörü | Kaleci özel çalışması; yoksa kaleciler takımla “forvet” olur |
| Fizyoterapist / doktor | Toparlanma günleri, dönüş programı; doktor değişimi %81 artış |
| Analist | Video günleri, rakip planı, canlı maç analizi; yoksa hoca ya da yardımcı üstlenir (arama özeti; birincil kaynak yok) |
| Duran top antrenörü | Ayrı bloklar hâlinde duran top (Arsenal–Jover) |
| Masör, malzemeci | Toparlanma kapasitesi; çift antrenman lojistiği |

**Türkiye örnekleri:** Süper Lig Kayserispor 2024 (Burak Yılmaz): 1 yardımcı, 1 atletik performans, 1 kaleci antrenörü, 1 analist; Çağdaş Atan döneminde 7 kişi (3 yardımcı, 1 kaleci, 1 atletik performans). Antalyaspor (Nuri Şahin): teknik sorumlu, yardımcı, performans uzmanı, kaleci antrenörü. Fenerbahçe (Mourinho): kondisyoner Antonio Dias ve iki yardımcı ekibe eklendi. 3. Lig Altay (Yusuf Şimşek): 4 yardımcı, kaleci antrenörü, atletik performans antrenörü — yani düşmüş büyük kulüp lig seviyesinin üstünde ekip taşıyabilir. İngiltere alt lig (Hartlepool United 2025/26): baş fizyoterapist, kuvvet-kondisyon antrenörü, analiz başkanı, malzeme sorumlusu ayrı kadrolar.

**Alt ligde daralma:** Fatih Terim'e göre 3. Lig'deki 55 kulübün 12'sinde altyapı yok, bazılarında saha ya da teknik adam yok (TamSaha). Aydınspor 1923 (2. Lig) “normal boyutlarda idman sahası yok” dedi. Karşıyaka'da (3. Lig) bakımsız zemin beş oyuncunun sakatlanmasıyla haberleşti. İstanbul Fatih'te 56 amatör kulübe 2 saha. Sarıkamış'ta −25°C'de antrenman. TFF lisans talimatında lige göre zorunlu personel listesi: kaynak bulunamadı (talimat tff.org'da doğrudan okunmalı). Yarı zamanlı personel ve işçi futbolcu için doğrudan haber bulunamadı; sözleşmesiz oyuncu kampı (TPFD, 24 oyuncu) dolaylı gösterge.

**“Ekip büyüdükçe çeşitlilik ve verim artar” kanıtı:** (a) hat çalışması her gruba antrenör ister; (b) GPS/RPE takibi 41 üst kulübün 40'ında her seansta, bu bir performans ekibi demek; (c) kondisyoner ve doktor sabitliği hamstring yükünü belirgin düşürür; (d) Brezilya antrenör anketi: %93 kuvveti periyotlar ama çoğunluk maç takvimi ve altyapı yüzünden uygulamakta zorlanır; (e) hazırlıkta daha çok seans (ortalama 30) daha az sezon içi kayıp.

Kaynaklar: [Kayserispor ekibi 2024](https://www.turkgun.com/spor/burak-yilmazin-ekibi-belli-oldu/231561) · [Çağdaş Atan ekibi](https://www.fanatik.com.tr/kayserispor/kayserisporda-cagdas-atanin-ekibi-belli-oldu-2288433) · [Antalyaspor ekibi](https://beinsports.com.tr/haber/nuri-sahinin-ekibi-belli-oldu) · [Fenerbahçe ekibi](https://www.cnnturk.com/spor/futbol/fenerbahcede-jose-mourinhonun-ekibi-degisti-yeni-isimler-belli-oldu-2307316) · [Altay ekibi](https://www.ntv.com.tr/sporskor/altayda-yusuf-simsekin-ekibi-belli-oldu,5IGg1LCU50q1uF8Ps_rgKQ) · [Hartlepool kadro](https://www.hartlepoolunited.co.uk/?p=5785) · [Terim, TamSaha](https://www.tff.org/Resources/Tamsaha/145/files/assets/basic-html/page-106-107.html) · [Aydınspor saha sıkıntısı](https://www.haberler.com/aydinspor-1923-te-saha-sikintisi-tekrar-gundemde-8109821-haberi/) · [Karşıyaka zemin krizi](https://www.turkgun.com/futbol/karsiyakada-antrenman-sahasi-krizi-zemin-alarm-veriyor/279658) · [Sarıkamış](https://www.cnnturk.com/spor/futbol/sarikamis-sogugunda-iki-afrikali-718377) · [Sözleşmesiz futbolcu kampı](https://www.cumhuriyet.com.tr/haber/issiz-futbolcular-kampi-314281) · [Brezilya kuvvet anketi](https://repositorio.ufjf.br/jspui/handle/ufjf/13941) · [Arsenal duran top antrenörü](https://arseblog.news/2024/12/arteta-opens-up-on-close-relationship-with-assistant-jover/)

## 5. Saha ve tesis

- **Saha sayısı:** Premier League: Bournemouth 16 saha (4 nizami) + kapalı saha; Everton 10 nizami; Watford 4 doğal + 1 suni + 2 yedili; Manchester United kapalı tam boy sentetik; West Ham “küçük, zemin ısıtması yok”. League Two Mansfield'ın yeni tesisi 3 doğal + 1 ışıklı 3G. Türkiye: Florya'da nizami saha sayısı kaynaklara göre 1 ya da 2 (çelişkili), Kemerburgaz ~130 dönüm; Samandıra 80 dönüm, saha sayısı bulunamadı. Tek saha demek: A takım, kaleciler ve varsa altyapı aynı çimi paylaşır, büyük ve küçük alan aynı seansta yan yana kurulamaz, zemin yorulur (Karşıyaka örneği).
- **Suni çim:** Meta-analiz (22 çalışma): profesyonellerde suni çimde sakatlık %21 daha az (IRR 0,79), amatörde fark yok; antrenman sakatlığı 2,91 vs 2,68/1000 saat (yakın). Yalnız 5 çalışma karıştırıcıları düzeltmiş; ayak bileği suni çimde daha sık (ikincil). Oyunda suni saha “antrenman yapılabilirlik” sağlar, sakatlık cezası gerektirmez.
- **Aydınlatma ve salon:** Kapalı salon hava koşulundan bağımsız antrenman (Stoke, Man Utd). Aydınlatmanın antrenman saatine etkisi için kaynak bulunamadı.
- **Saatler:** Süper Lig haberlerinde sabah 10:30 (Beşiktaş, Trabzonspor) ve öğleden sonra 14:00 ikinci seans geçer. Çift antrenman kamp haberlerinde görülür (Gençlerbirliği, Bolu).
- **Kamp:** Bolu (39 otel, bir sezonda 120 takım; “oksijen deposu”), Erzurum Palandöken (yüksek irtifa, bir sezonda 8 takım), yurt dışında Avusturya (Konyaspor). Süre: 15 gün tek etap ya da 3 etap × 12 gün (Şanlıurfaspor); Gaziantep FK kampında 4 hazırlık maçı. Elit kulüplerde hazırlık ortalaması 30 seans.

Kaynaklar: [Bournemouth tesisi](https://www.nss-sports.com/en/long-form/40614/bournemouth-new-training-center) · [Trafford Training Centre](https://en.wikipedia.org/wiki/Trafford_Training_Centre) · [Watford sahaları](https://weuro-teamcatalogue.uefa.com/training_ground/watford-fc-training-ground/) · [Premier League tesisleri](https://www.goal.com/en-us/lists/premier-league-training-grounds-man-utd-to-liverpool-chelsea-to-arsenal---every-location/1k6l0wa2qb8my1o6dh96mcyjhy) · [Mansfield tesisi](https://www.theleaguepaper.com/latest-news/football-league-championship/349534/stags-get-training-site-lift) · [Florya tek saha](https://www.fanatik.com.tr/galatasaray/galatasarayda-dursun-ozbekten-kemerburgaz-metin-oktay-tesisleri-aciklamasi-hayalimi-kurmustum-2576049) · [Suni çim meta-analizi 2023](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10139885/) · [Suni çim 2013](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4590909/) · [Trabzonspor 10:30 / 14:00](https://www.aspor.com.tr/trabzonspor/2023/12/21/trabzonsporda-basaksehir-hazirliklari) · [Beşiktaş 10:30](https://www.aspor.com.tr/besiktas/2022/10/13/besiktas-trabzonspor-maci-hazirliklarini-surdurdu/amp) · [Bolu kamp merkezi](https://beinsports.com.tr/haber/kamp-merkezi-boluda-13-ekip-yeni-sezona-hazirlaniyor) · [Erzurum kampları](https://www.gazetebirlik.com/spor/palandokende-futbol-takimlari-sezon-hazirliklarina-devam-ediyor/1055425) · [Şanlıurfaspor 3 etap](https://www.urfanatik.com/sanliurfasporun-yeni-sezon-kamp-programi-aciklandi) · [Gençlerbirliği çift antrenman](https://www.yeniankara.com.tr/spor/genclerbirligi-hazirliklarini-boluda-surdurecek-117804)

## 6. Oyuna uyarlama önerisi (kaynaksız, tasarım çıkarımı)

**Balkondan ayırt edilebilenler (geometriyle):** rondo kareleri · küçük kaleli paralel oyunlar · yarı sahada orta oyun · tam sahada 11v11 · üç ayrı küme (hat çalışması) · düz sprint koridoru · ceza sahasında kalabalık tekrar (duran top) · kaleye sıralı şut · yavaş koşu ve esneme halkası (toparlanma) · kale önünde 3 kişi (kaleci) · boş saha (salon/video/izin). Ayırt edilemeyenler (içeride): kuvvet, soğuk su, masaj, video — bunlar “saha boş, bina ışıklı” gibi dolaylı işaretle gösterilir.

**“Çeşitli” hissi:** haftada en az 5 farklı görünür tür ve her gün en az 2 eşzamanlı küme; aynı günün aynı şablonla iki kez görünmemesi. Gerçek morfosiklüs zaten günleri ayrıştırır: MD+1 boş/yavaş, MD+2 iki ayrı grup, MD-4 dar alan + kümeler, MD-3 tam saha, MD-2 sprint + dar oyun, MD-1 duran top + rondo.

**Personel ve tesis seviyesine göre açılan türler:**

| Seviye | Ekip | Tesis | Görünür türler |
|---|---|---|---|
| 3. Lig çekirdek | Hoca + 1 yardımcı | Tek saha, paylaşılan | Isınma, teknik tekrar, tek dar alan oyunu, 11v11, bitiriş; kaleciler takımla |
| + kaleci antrenörü | | | Kaleci özel kümesi |
| + kondisyoner | | | Sprint koridoru, MD-4/MD-2 ayrışması, toparlanma günü düzeni; sakatlık riski düşer (ECIS) |
| + 2. yardımcı / analist | | + salon ya da 2. saha | Üç küme hat çalışması, video günleri (boş saha), paralel oyunlar |
| + fizyoterapist, doktor sabit | | + suni saha, ışık | Dönüşe yakın sakat ayrı koşu, kış ve akşam antrenmanı |
| Üst lig tam ekip | + duran top antrenörü, 2. kondisyoner | 2+ saha, kapalı alan | Duran top blokları, çift antrenman, kamp varyasyonları |

**Hoca tarzına göre portföy (taktik periyotlamanın “oynadığın gibi antrene et” ilkesinden çıkarım):** konumsal → rondo ve pozisyon oyunu ağır, MD-3'te 11v11 yer değiştirme; direkt → hava topu/ikinci top ve bitiriş, uzun koridor; kanat ve orta → kanat koridorlarında orta-kafa istasyonları, ceza sahası kalabalığı; dikey/geçiş → dar alan sayısal dengesizlik, sprint, geçiş oyunları; ilişkisel → küçük gruplu dar alan, çok rondo, az kalıplı tekrar; dengeli → şablon dağılımı. Bu farkların gerçek ölçümü için kaynak bulunamadı; oyunda yalnız görünür türlerin ağırlığını değiştiren katsayı olarak kullanılması önerilir.

**Oyun için kritik gerçekler:** (1) hazırlıkta çok antrenman değil, ani yük sıçraması ve düşük kronik yük cezalandırılır; (2) kondisyoner/doktor değişimi kadro sağlığını hoca değişiminden daha çok bozar — hoca değişiminde “kendi kondisyonerini getirdi” en pahalı birleşim; (3) iki maçlı haftada kadronun ancak %25–40'ı her maçı tamamlar, rotasyon zorunlu; (4) maç sakatlığı antrenmanın ~7–10 katı, antrenman sakatlığı az ama kondisyonersiz ekipte hamstring eğilimi artar.
