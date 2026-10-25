# Görsel tarz kararı — ChatGPT istem paketi (2026-10-26)

Amaç: iki aday tarzı (piksel sanatı, izometrik az poligon diorama) üç ekranda yan yana görüp **birini seçmek**. Bu görseller referanstır,
oyuna girmez; seçilen tarzda oyunun içinde tek gerçek ekran (oda + kart + telefon) Claude tarafından kurulur ("dikey dilim"), gerisi mantık
bittikten sonra. Kayıt: `ui-mimari-ve-gorsel-yon.md` §2, YOL_HARITASI 46.

## Nasıl kullanılır

1. ChatGPT'de **her tarz için ayrı bir sohbet** açın. Önce o tarzın "stil kilidi" paragrafını gönderin ("tamam" demesi yeter).
2. Sonra üç ekran istemini sırayla gönderin; her istemi **2–3 kez** üretin, en iyi 1–2 kareyi saklayın. Sonraki istemlerde "aynı tarzı
   koru" demeye gerek yok, stil kilidi aynı sohbette geçerlidir; yine de uzaklaşırsa "same style as the first image" ekleyin.
3. Bulanık ya da yumuşatılmış piksel gelirse: "render at native pixel scale, crisp square pixels, no smoothing" diye yeniden isteyin.
   Metinler bozuk çıkarsa önemsemeyin (seçim ölçütü değil); çok bozuksa "no legible text, use blank blocks" ekleyin.
4. Dosyaları `araclar/referans/` klasörüne kaydedin (Git dışı; Claude `.gitignore`'a ekler): `s1-oda-piksel-a.png`, `s1-oda-diorama-a.png`,
   `s2-telefon-piksel-a.png`, … Sonra sohbette "görseller hazır" deyin; birlikte bakarız, seçim sizin.

Her istemin sonunda aynı ORTAK ŞARTLAR paragrafı vardır (kopyalarken birlikte alın).

## ORTAK ŞARTLAR (her isteme eklenir)

```
COMMON RULES: Fictional small-town Turkish football club "Demirkapı SK". Club colours: red (#c8281e) and cream white (#f2ede2); crest: a simple red shield with a white iron-gate silhouette. No real brands, logos, sponsors or team names; advertising boards show only invented generic Turkish words (SÜT, BANKA, SİGORTA, LASTİK) or blank colour blocks. No player ratings, stars or stat bars anywhere. No photorealism, no modern AAA look. Landscape 4:3 composition. Era feel: a late-1990s computer game, but a modern smartphone exists. Any text is short and in Turkish.
```

## Tarz A — Piksel sanatı

**Stil kilidi (sohbetin ilk mesajı):**

```
STYLE LOCK — PIXEL ART. From now on every image you make in this conversation is authentic 1990s PC pixel art: drawn at a low resolution of about 480×360 pixels and shown enlarged with crisp square pixels (no smoothing, no anti-aliasing blur, no painterly brush strokes), a limited palette of about 32 colours, clean 1-pixel outlines where needed, dithering only in gradients and shadows, warm daylight. Think Amiga/DOS point-and-click adventure backgrounds and classic football manager screens. Reply "ok" and wait for the first scene.
```

**A1 — Başkan odası (hub):**

```
Scene 1 — the chairman's office. First-person view from the chairman's chair: the desk in front, the window beyond. On the desk: an open red cardboard folder with a few papers, an open two-page notebook with a pen, a modern smartphone lying face up (screen dark), a Turkish tea glass on a saucer, a green desk lamp. Behind the desk: a large window showing a small compact town stadium in daylight (low roofless stands, four floodlight masts, green pitch) and hills; on the wall a red-and-white club pennant, a round wall clock, a shelf with two or three modest trophies. Calm, tidy, bright room. No menus, no icons, no labels, no overlaid UI.
COMMON RULES: (yukarıdaki paragraf)
```

**A2 — Telefon ve tek karar kartı:**

```
Scene 2 — a game UI mockup on a modern smartphone, drawn in the same pixel art style. The phone fills the image height, slightly tilted, held in a hand at the bottom-right. Screen: a messages app in a warm paper-and-ink colour scheme (cream background, dark ink text, small red accents). Top: a list of five conversations, each with a small round pixel portrait, bold name, one-line preview and time — fictional Turkish names: Şükrü Hoca, Sayman Nevzat, Muhabir Elif, Menajer Kaya, Taraftar Derneği. Below: one open conversation with three speech bubbles. At the bottom of the screen: a SINGLE decision card (like a playing card) that can be swiped left or right: on its face a two-line question in Turkish, on its left edge and right edge two short answer labels, and a faint arrow hint on each side. No "accept/decline" buttons, no stars, no numbers. Bitmap pixel font, all text short Turkish.
COMMON RULES: (yukarıdaki paragraf)
```

**A3 — Tepeden maç ve stat:**

```
Scene 3 — the match screen, top-down 2D like a 1990s pixel football manager. The whole stadium is visible from directly above: a large green pitch with mowing stripes and white lines, goals with nets; players are small round numbered tokens (red team and blue team, 11 each) with a white ball; around the pitch a ring of small advertising boards (invented Turkish words only); a compact small-town stadium: four low, roofless concrete stands with a sparse crowd in red and white, four floodlight masts at the corners, a tiny manual scoreboard behind one stand; just outside: a bit of surroundings with no buildings — a rocky seashore on one side with a small breakwater and lighthouse, a few pine trees and a road on the other side. The pitch stays large and readable; no HUD, no menus, no text overlays except the scoreboard.
COMMON RULES: (yukarıdaki paragraf)
```

## Tarz B — İzometrik az poligon diorama

**Stil kilidi (sohbetin ilk mesajı):**

```
STYLE LOCK — LOW-POLY ISOMETRIC DIORAMA. From now on every image you make in this conversation is a small cutaway diorama seen from a fixed isometric camera (orthographic, no perspective distortion): low-poly geometry with flat colours and soft shading, no detailed textures, a slight retro video-game look as if rendered by a 1999 console at a modest resolution and then upscaled (visible but gentle pixel grid, no blur), a dark neutral background around the diorama, warm daylight, clean and calm. Think a tabletop model of the place. Reply "ok" and wait for the first scene.
```

**B1 — Başkan odası (hub):**

```
Scene 1 — the chairman's office as a cutaway isometric diorama: two walls and the floor, the room open toward the camera. Inside: a wooden desk with an open red cardboard folder, an open two-page notebook with a pen, a modern smartphone lying face up, a Turkish tea glass, a green desk lamp; the chairman's empty chair; two visitor chairs; a filing cabinet; a door to the corridor; a window showing a glimpse of a small compact town stadium and hills in daylight; on the wall a red-and-white club pennant, a round clock, a shelf with two or three modest trophies. No menus, no icons, no labels, no overlaid UI.
COMMON RULES: (yukarıdaki paragraf)
```

**B2 — Telefon ve tek karar kartı:**

```
Scene 2 — a game UI mockup: a modern smartphone standing on the desk of the same low-poly diorama office, large in frame; the phone body is low-poly, but its screen content is flat, clean and readable (the UI is not 3D). Screen: a messages app in a warm paper-and-ink colour scheme (cream background, dark ink text, small red accents). Top: a list of five conversations, each with a small round portrait, bold name, one-line preview and time — fictional Turkish names: Şükrü Hoca, Sayman Nevzat, Muhabir Elif, Menajer Kaya, Taraftar Derneği. Below: one open conversation with three speech bubbles. At the bottom: a SINGLE decision card that can be swiped left or right: a two-line Turkish question on its face, two short answer labels on its left and right edges, a faint arrow hint on each side. No accept/decline buttons, no stars, no numbers. Simple bitmap-like font, all text short Turkish.
COMMON RULES: (yukarıdaki paragraf)
```

**B3 — Tepeden maç ve stat:**

```
Scene 3 — the match screen as a low-poly diorama seen from directly above with the slightest tilt (orthographic): a large green pitch with mowing stripes and white lines, goals with nets; players are flat round numbered discs (red team and blue team, 11 each) with a small white ball; around the pitch a ring of small advertising boards (invented Turkish words only); a compact small-town stadium made of chunky low-poly blocks: four low, roofless concrete stands with a sparse crowd in red and white, four floodlight masts at the corners, a tiny manual scoreboard; just outside: a bit of surroundings with no buildings — a rocky seashore with a small breakwater and lighthouse on one side, a few pine trees and a road on the other; the diorama sits on a dark neutral background. The pitch stays large and readable; no HUD, no menus, no text overlays except the scoreboard.
COMMON RULES: (yukarıdaki paragraf)
```

## İsteğe bağlı dördüncü kare (her iki tarz)

Büyümeyi görmek için: "Scene 4 — the same stadium fifteen years later, same place and camera: taller stands with partial roofs, more crowd, a
full ring of advertising boards and a video screen; the surroundings unchanged." Tarz seçimine girmez, ama ileride statın gelişimini aynı dilde
görmek için işe yarar.

## Seçim ölçütleri (birlikte bakarken)

1. **Okunabilirlik:** telefon ve kart metni, saha ve pullar ilk bakışta okunuyor mu?
2. **Sakinlik:** oda ve kart telaşsız mı, dikkat tek konuda mı kalıyor (tasarım ilkesi: tek meseleye odaklanma)?
3. **Bütünlük:** üç ekran aynı dünyadan mı görünüyor?
4. **Üretilebilirlik:** bu tarzda yeni bir ekran ya da eşya üretmek kolay mı (piksel: resim + palet; diorama: az poligon model)? Hangi araçlarla
   (ChatGPT, PixelLab, Blender MCP, Meshy) sürdürülebilir?
5. **Retro his:** 1999 oyunu hissi var mı, "modern mobil oyun" gibi mi duruyor?
6. **Ekrana uyum:** 4:3 ve 960×720 ızgarada (piksel için 480×360 ya da 320×240 alt ızgara) çalışır mı?

Seçimden sonra Claude: görsel sözleşmeyi yazar (ızgara, palet, yazı tipi, oda bakışı, varlık boru hattı, lisans defteri), `araclar/referans/`
klasörünü Git dışına alır ve dikey dilimi (oda + kart + telefon) oyunun içinde kurar.
