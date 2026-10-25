#!/usr/bin/env python3
"""araclar/piksel-kare.py — oyunun oda sahnesini "piksel çıktılı 3B" biçiminde çizer (görsel tarz karşılaştırması, 2026-10-26).

Oyun kodu değişmez: oyun başsız Chromium'da açılır (yeni kariyer, başkan odası), sahne ve kamera oyunun kendisidir (ODA.sahne, ODA.kamera).
Sayfanın içinde üç çizim yapılır ve 2D tuvalde birleştirilir:
  1. renk: düşük ızgarada (ör. 480×360), içeride ornek katı büyüklükte çizilip kutu ortalamasıyla indirilir;
  2. normal ve derinlik: aynı ızgarada; saydam ve ağ olmayan nesneler bu iki çizimde gizlenir;
  3. dış çizgi: derinlik sıçramasının önündeki piksel koyulaşır (isteğe bağlı iç çizgi: normal kırığı);
  4. isteğe bağlı ışık denemesi (güneş pencereden, gölge) ve derinlik karartması (ortam örtmesi yaklaşığı);
  5. palet: sabit ve az renkli — "uyarlamali" (sahneden k-ortalama, sonra sabit kalır) ya da "db32" (DawnBringer 32); isteğe bağlı 4×4 titreme.
Sonuç tam sayı katıyla 1920×1440'a büyütülür (en yakın komşu).

Kullanım:  python -X utf8 araclar/piksel-kare.py            # bugünkü görünüm + beş varyant (sonuncusu ışık denemesi)
Çıktı:     araclar/referans/s1-oda-*.png (Git dışı; araclar/plan/gorsel-istem-paketi.md)
"""
import asyncio
import base64
import pathlib
import sys

KOK = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(KOK / "araclar"))
from kontrol import yerel_three, CDN_THREE  # noqa: E402

CIKTI = KOK / "araclar" / "referans"

VARYANTLAR = [
    ("s1-oda-3bpiksel-480-32-dis", {"W": 480, "H": 360, "ornek": 2, "palet": "uyarlamali", "renk": 32, "koyu": 0.42}),
    ("s1-oda-3bpiksel-480-32-ic", {"W": 480, "H": 360, "ornek": 2, "palet": "uyarlamali", "renk": 32, "koyu": 0.42, "ic": 0.7, "katKoyu": 0.78}),
    ("s1-oda-3bpiksel-320-24-dis", {"W": 320, "H": 240, "ornek": 2, "palet": "uyarlamali", "renk": 24, "koyu": 0.42}),
    ("s1-oda-3bpiksel-480-db32", {"W": 480, "H": 360, "ornek": 2, "palet": "db32", "koyu": 0.42, "titreme": 0.35}),
    # son çizim: ışık denemesi sahneyi kalıcı değiştirir (güneş pencereden, gölge açık); bu yüzden listenin sonunda
    ("s1-oda-3bpiksel-480-32-isikli", {"W": 480, "H": 360, "ornek": 2, "palet": "uyarlamali", "renk": 32, "koyu": 0.42, "ao": 0.3,
                                       "isik": {"pencere": [-1.25, 1.42, -3.43], "hedef": [-0.2, 0.76, -1.0], "renk": "#ffe2b0", "guc": 1.5, "ortam": 0.9}}),
]

BUGUN_JS = """() => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1440; const g = c.getContext('2d');
  g.imageSmoothingEnabled = false; g.drawImage(renderer.domElement, 0, 0, 1920, 1440); return c.toDataURL('image/png'); }"""

PIKSEL_JS = r"""(p) => {
  const W = p.W, H = p.H, K = p.ornek || 1, S = ODA.sahne, Kam = ODA.kamera;
  const oku = (w, h, arka) => { const t = new THREE.WebGLRenderTarget(w, h, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false });
    renderer.setRenderTarget(t); renderer.setClearColor(arka, 1); renderer.clear(); renderer.render(S, Kam);
    const px = new Uint8Array(w * h * 4); renderer.readRenderTargetPixels(t, 0, 0, w, h, px); renderer.setRenderTarget(null); t.dispose(); return px; };
  const eskiArka = renderer.getClearColor(new THREE.Color()).getHex(), eskiAlfa = renderer.getClearAlpha();
  /* 0) isteğe bağlı ışık denemesi (yalnız bu çizimde; sayfa sonra kapanır): güneş pencereden içeri vurur ve gölge düşürür, ortam ışığı azalır */
  if (p.isik) { const I = p.isik, isiklar = []; S.traverse(o => { if (o.isLight) isiklar.push(o); });
    const gun = isiklar.find(o => o.isDirectionalLight), ortam = isiklar.find(o => o.isAmbientLight);
    const hedef = new THREE.Vector3(...I.hedef), yon = hedef.clone().sub(new THREE.Vector3(...I.pencere)).normalize();
    gun.position.copy(hedef).addScaledVector(yon, -40); gun.target.position.copy(hedef); S.add(gun.target); gun.target.updateMatrixWorld();
    gun.color.set(I.renk); gun.intensity = I.guc; if (ortam) ortam.intensity *= I.ortam;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; gun.castShadow = true;
    const sc = gun.shadow.camera; sc.left = -6; sc.right = 6; sc.top = 6; sc.bottom = -6; sc.near = 1; sc.far = 80; sc.updateProjectionMatrix();
    gun.shadow.mapSize.set(2048, 2048); gun.shadow.bias = -0.0006; gun.shadow.normalBias = 0.02; gun.shadow.radius = 2;
    S.traverse(o => { if (!o.isMesh) return; const ms = Array.isArray(o.material) ? o.material : [o.material];
      o.castShadow = !ms.some(m => m && m.transparent); o.receiveShadow = true; ms.forEach(m => { if (m) m.needsUpdate = true; }); }); }
  /* 1) renk: K kat büyüklükte çiz, kutu ortalamasıyla W×H'ye indir (satırlar alttan üste okunur) */
  const CK = oku(W * K, H * K, OD.arkaPlan), R = new Float32Array(W * H * 3), WK = W * K;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let r = 0, g = 0, b = 0;
    for (let j = 0; j < K; j++) for (let i = 0; i < K; i++) { const o = ((H * K - 1 - (y * K + j)) * WK + x * K + i) * 4; r += CK[o]; g += CK[o + 1]; b += CK[o + 2]; }
    const q = (y * W + x) * 3, n = K * K; R[q] = r / n; R[q + 1] = g / n; R[q + 2] = b / n; }
  /* 2) normal ve derinlik: saydam, çizgi, nokta ve özel gölgelendiricili nesneler gizlenir */
  const gizli = []; S.traverseVisible(o => { const m = o.material, tr = Array.isArray(m) ? m.some(x => x && x.transparent) : !!(m && m.transparent);
    if ((o.isMesh && (tr || (m && m.isShaderMaterial))) || o.isPoints || o.isLine || o.isSprite) gizli.push(o); });
  gizli.forEach(o => o.visible = false);
  S.overrideMaterial = new THREE.MeshNormalMaterial(); const NP = oku(W, H, 0x8080ff);
  S.overrideMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking }); const DP = oku(W, H, 0xffffff);
  S.overrideMaterial = null; gizli.forEach(o => o.visible = true); renderer.setClearColor(eskiArka, eskiAlfa);
  const near = Kam.near, far = Kam.far, D = new Float32Array(W * H), N = new Float32Array(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = ((H - 1 - y) * W + x) * 4, i = y * W + x;
    let z = (255 / 256) * (DP[o + 3] / 255 + DP[o + 2] / 255 / 256 + DP[o + 1] / 255 / 65536 + DP[o] / 255 / 16777216); z = Math.min(z, 0.999999);
    D[i] = (near * far) / (far - z * (far - near));
    N[i * 3] = NP[o] / 127.5 - 1; N[i * 3 + 1] = NP[o + 1] / 127.5 - 1; N[i * 3 + 2] = NP[o + 2] / 127.5 - 1; }
  /* 3) dış çizgi: komşusu belirgin uzaktaysa piksel nesnenin kenarıdır; iç çizgi: aynı derinlikte normal kırığı */
  const sil = new Uint8Array(W * H), kat = new Uint8Array(W * H), esik = d => Math.max(p.esikMin || 0.05, (p.esikOran || 0.05) * d);
  /* isteğe bağlı derinlik karartması (ortam örtmesi yaklaşığı): piksel çevresinin ortalamasından derindeyse köşededir, koyulaşır */
  if (p.ao) { const kutu = (src, r) => { const a = new Float32Array(W * H), b = new Float32Array(W * H);
      for (let y = 0; y < H; y++) { let s = 0; for (let i = -r; i <= r; i++) s += src[y * W + Math.min(W - 1, Math.max(0, i))];
        for (let x = 0; x < W; x++) { a[y * W + x] = s / (2 * r + 1); s += src[y * W + Math.min(W - 1, x + r + 1)] - src[y * W + Math.max(0, x - r)]; } }
      for (let x = 0; x < W; x++) { let s = 0; for (let i = -r; i <= r; i++) s += a[Math.min(H - 1, Math.max(0, i)) * W + x];
        for (let y = 0; y < H; y++) { b[y * W + x] = s / (2 * r + 1); s += a[Math.min(H - 1, y + r + 1) * W + x] - a[Math.max(0, y - r) * W + x]; } }
      return b; };
    const Dk = D.map(v => Math.min(v, 12)), ao = new Float32Array(W * H);
    for (const [r, w, olc] of [[2, 0.5, 0.06], [6, 0.35, 0.15], [14, 0.15, 0.3]]) { const B = kutu(Dk, r); for (let i = 0; i < W * H; i++) ao[i] += w * Math.max(0, Math.min(1, (Dk[i] - B[i]) / olc)); }
    for (let i = 0; i < W * H; i++) { const k = 1 - Math.min(1, ao[i]) * p.ao; R[i * 3] *= k; R[i * 3 + 1] *= k; R[i * 3 + 2] *= k; } }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, d = D[i]; if (d > far * 0.9) continue;
    for (const [a, b] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) { if (a < 0 || b < 0 || a >= W || b >= H) continue;
      if (D[b * W + a] - d > esik(d)) { sil[i] = 1; break; } }
    if (!sil[i] && p.ic) for (const [a, b] of [[x + 1, y], [x, y + 1]]) { if (a >= W || b >= H) continue; const j = b * W + a;
      if (Math.abs(D[j] - d) < esik(d) * 1.5 && N[i * 3] * N[j * 3] + N[i * 3 + 1] * N[j * 3 + 1] + N[i * 3 + 2] * N[j * 3 + 2] < p.ic) { kat[i] = 1; break; } } }
  /* 4) palet */
  const uz = (r1, g1, b1, r2, g2, b2) => { const rm = (r1 + r2) / 2, dr = r1 - r2, dg = g1 - g2, db = b1 - b2; return (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db; };
  const DB32 = '000000 222034 45283c 663931 8f563b df7126 d9a066 eec39a fbf236 99e550 6abe30 37946e 4b692f 524b24 323c39 3f3f74 306082 5b6ee1 639bff 5fcde4 cbdbfc ffffff 9badb7 847e87 696a6a 595652 76428a ac3232 d95763 d77bba 8f974a 8a6f30'
    .split(' ').map(h => [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]);
  let PAL;
  if (p.palet === 'db32') PAL = DB32;
  else { /* k-ortalama, renk kovalarının üstünde ve karekök ağırlıkla: küçük alandaki renk (pencereden saha) de palete girer;
            k-ortalama++ başlangıcı belirlenimci tohumla */
    const k = p.renk || 32, kova = new Map();
    for (let i = 0; i < W * H; i++) { const key = (R[i * 3] >> 3) << 10 | (R[i * 3 + 1] >> 3) << 5 | (R[i * 3 + 2] >> 3);
      let v = kova.get(key); if (!v) { v = [0, 0, 0, 0]; kova.set(key, v); } v[0] += R[i * 3]; v[1] += R[i * 3 + 1]; v[2] += R[i * 3 + 2]; v[3]++; }
    const X = [...kova.values()].map(v => [v[0] / v[3], v[1] / v[3], v[2] / v[3], Math.sqrt(v[3])]), n = X.length;
    let t = 12345; const rnd = () => (t = (t * 1103515245 + 12345) >>> 0) / 4294967296;
    const C = [X.reduce((a, b) => (b[3] > a[3] ? b : a)).slice(0, 3)], dmin = new Float64Array(n).fill(Infinity);
    while (C.length < Math.min(k, n)) { const c = C[C.length - 1]; let top = 0;
      for (let i = 0; i < n; i++) { const d = uz(X[i][0], X[i][1], X[i][2], c[0], c[1], c[2]); if (d < dmin[i]) dmin[i] = d; top += dmin[i] * X[i][3]; }
      let s = rnd() * top, i = 0; for (; i < n - 1; i++) { s -= dmin[i] * X[i][3]; if (s <= 0) break; } C.push(X[i].slice(0, 3)); }
    for (let it = 0; it < 20; it++) { const top = C.map(() => [0, 0, 0, 0]);
      for (let i = 0; i < n; i++) { let en = 0, ed = Infinity; for (let c = 0; c < C.length; c++) { const d = uz(X[i][0], X[i][1], X[i][2], C[c][0], C[c][1], C[c][2]); if (d < ed) { ed = d; en = c; } }
        const T = top[en], w = X[i][3]; T[0] += X[i][0] * w; T[1] += X[i][1] * w; T[2] += X[i][2] * w; T[3] += w; }
      for (let c = 0; c < C.length; c++) if (top[c][3]) C[c] = [top[c][0] / top[c][3], top[c][1] / top[c][3], top[c][2] / top[c][3]]; }
    PAL = C.map(c => c.map(v => Math.round(v))); }
  const onbellek = new Map(), enYakin = (r, g, b) => { r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    const key = (r >> 2) << 12 | (g >> 2) << 6 | (b >> 2); let c = onbellek.get(key); if (c) return c;
    let ed = Infinity; for (const P of PAL) { const d = uz(r, g, b, P[0], P[1], P[2]); if (d < ed) { ed = d; c = P; } } onbellek.set(key, c); return c; };
  /* birleştir ve büyüt */
  const kuc = document.createElement('canvas'); kuc.width = W; kuc.height = H; const kg = kuc.getContext('2d'), im = kg.createImageData(W, H), P8 = im.data;
  const BAY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  let nSil = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; let r = R[i * 3], g = R[i * 3 + 1], b = R[i * 3 + 2];
    if (sil[i]) { r *= p.koyu; g *= p.koyu; b *= p.koyu; nSil++; } else if (kat[i]) { r *= p.katKoyu; g *= p.katKoyu; b *= p.katKoyu; }
    if (p.titreme) { const tt = (BAY[y & 3][x & 3] / 16 - 0.5) * p.titreme * 40; r += tt; g += tt; b += tt; }
    const c = enYakin(r, g, b); P8[i * 4] = c[0]; P8[i * 4 + 1] = c[1]; P8[i * 4 + 2] = c[2]; P8[i * 4 + 3] = 255; }
  kg.putImageData(im, 0, 0);
  const buyuk = document.createElement('canvas'); buyuk.width = 1920; buyuk.height = 1440; const bg = buyuk.getContext('2d'); bg.imageSmoothingEnabled = false;
  bg.drawImage(kuc, 0, 0, 1920, 1440);
  return { png: buyuk.toDataURL('image/png'), renk: PAL.length, cizgi: +(nSil / (W * H) * 100).toFixed(1), gizli: gizli.length }; }"""


def kaydet(veri_url, yol):
    yol.write_bytes(base64.b64decode(veri_url.split(",", 1)[1]))


async def ana():
    from playwright.async_api import async_playwright
    three = yerel_three()
    CIKTI.mkdir(exist_ok=True)
    async with async_playwright() as p:
        tarayici = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        pg = await tarayici.new_page(viewport={"width": 1920, "height": 1440})
        hatalar = []
        pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
        await pg.route(CDN_THREE, lambda route: route.fulfill(path=str(three), content_type="application/javascript"))
        await pg.goto((KOK / "index.html").as_uri())
        await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=30000)
        await pg.wait_for_timeout(3500)
        kaydet(await pg.evaluate(BUGUN_JS), CIKTI / "s1-oda-bugun.png")
        print("s1-oda-bugun.png: bugünkü görünüm (960×720, 5 bit renk, titreme)")
        for ad, ayar in VARYANTLAR:
            r = await pg.evaluate(PIKSEL_JS, ayar)
            kaydet(r["png"], CIKTI / f"{ad}.png")
            print(f"{ad}.png: {ayar['W']}×{ayar['H']}, {r['renk']} renk ({ayar['palet']}), dış çizgi %{r['cizgi']}, gizlenen {r['gizli']}")
        await tarayici.close()
    for h in hatalar:
        print("  - " + h)
    sys.exit(1 if hatalar else 0)


if __name__ == "__main__":
    asyncio.run(ana())
