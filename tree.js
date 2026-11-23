// Verwandtschafts-Stammbaum der Mantodea als großes Fenster, von links nach rechts.
// Grundlage: stammesgeschichtliche Klassifikation im Catalogue of Life / Mantodea Species File (Schwarz & Roy 2019,
// beruhend auf Svenson & Whiting 2009 u. a.). Früh abgezweigte, ursprüngliche Linien stehen oben;
// je tiefer eine Gruppe verschachtelt ist, desto später hat sie sich abgespalten.
// Stufenloses Zoomen: jede Familie hat eine Mindesthöhe (ganz herausgezoomt = zusammengefaltete Übersicht).
(() => {
  "use strict";
  const UI = window.MANTODEA_UI;
  if (!UI) return;
  const { DATA, imgData, detail, esc, fmt, loadScript } = UI;

  document.body.insertAdjacentHTML("beforeend", `
  <dialog id="tree-dlg" class="tree-dlg" aria-labelledby="tr-title">
    <div class="tree-head">
      <h2 id="tr-title">🌳 Stammbaum</h2>
      <div class="tree-pick" id="tr-pick" role="tablist" aria-label="Stammbaum nach Autor"></div>
      <input type="search" id="tr-q" list="tr-names" placeholder="🔍 Gruppe, Gattung, Art" autocomplete="off">
      <datalist id="tr-names"></datalist>
      <span class="tree-btns"><button type="button" data-z="in" aria-label="Hineinzoomen">＋</button><button type="button" data-z="out" aria-label="Herauszoomen">－</button><button type="button" data-z="home" aria-label="Ganzer Baum">⌂</button><button type="button" data-z="info" aria-label="Erklärung">ⓘ</button><button type="button" class="tr-close" aria-label="Schließen">×</button></span>
    </div>
    <details class="tree-src" id="tr-src"></details>
    <div class="tree-info" id="tr-info" hidden>
      <b>So liest man den Baum:</b> Jede Verzweigung ist eine Abspaltung in der Stammesgeschichte. <b>Oben</b> stehen die Linien, die sich <b>früh</b> abgespalten haben und viele <b>ursprüngliche</b> Merkmale zeigen: Chaeteessidae, Mantoididae und Metallyticidae. Je tiefer eine Gruppe verschachtelt ist, desto später hat sie sich abgespalten, man spricht von <b>abgeleiteten</b> Gruppen. Danach teilen sich die Mantiden in die Amerimantodea (Neue Welt) und die Cernomantodea (vor allem Alte Welt). Wie die 20 Familien der Cernomantodea untereinander verwandt sind, ist noch nicht sicher geklärt. Sie stehen deshalb gleichrangig nebeneinander, ebenso die Arten innerhalb einer Gattung.
      <br><b>Quellen:</b> Klassifikation des Mantodea Species File im Catalogue of Life, nach Schwarz &amp; Roy (2019), gestützt auf die Stammbaumstudie von Svenson &amp; Whiting (2009, Cladistics 25: 468–514) und spätere Arbeiten. Die Linienlängen sind keine Zeitangaben.
      <br><b>Bedienung:</b> zwei Finger, Doppeltipp, Mausrad oder ＋/－ zum Zoomen, ein Finger zum Verschieben. Antippen holt eine Gruppe heran, eine Art öffnet den Steckbrief. ⌂ zeigt wieder alles.</div>
    <div class="tree-wrap"><div class="tree-path" id="tr-path"></div><canvas id="tr-canvas" aria-label="Zoombarer Verwandtschafts-Stammbaum der Mantodea"></canvas>
      <div class="tree-hint" id="tr-hint">Zoomen, um Gattungen und Arten mit Fotos zu sehen</div></div>
  </dialog>`);
  const dlg = document.getElementById("tree-dlg");
  const cv = document.getElementById("tr-canvas"), ctx = cv.getContext("2d");
  let built = false;

  // ---------- Ränge und Spalten
  const RANKS = ["order", "suborder", "infraorder", "parvorder", "nanorder", "superfamily", "family", "subfamily", "tribe", "subtribe", "genus", "species"];
  const RI = Object.fromEntries(RANKS.map((r, i) => [r, i]));
  const RDE = { clade: "Gruppe", order: "Ordnung", suborder: "Unterordnung", infraorder: "Teilordnung", parvorder: "Teilordnung", nanorder: "Teilordnung", superfamily: "Überfamilie", family: "Familie", subfamily: "Unterfamilie", tribe: "Tribus", subtribe: "Subtribus", genus: "Gattung" };
  const NOTE = { Chaeteessidae: "ursprünglichste Linie", Mantoididae: "sehr ursprünglich", Spinomantodea: "sehr ursprünglich", Metallyticidae: "ursprünglich", Amerimantodea: "Neue Welt", Cernomantodea: "v. a. Alte Welt", Eumantodea: "alle heutigen außer Chaeteessidae" };

  // ---------- Daten
  const nodes = [];
  let rootNode = null, ROWS = 0, byName = new Map(), FAMS = [];
  const coll = new Intl.Collator("de");
  const best = (list) => list.filter((s) => s.p).sort((a, b) => (b.p.front ? 1 : 0) - (a.p.front ? 1 : 0) || (b.io || 0) - (a.io || 0))[0] || null;
  // Jeder Baum hat eine eigene Farbe für Stamm und Äste oberhalb der Familien, Hintergrund und Wasserzeichen
  const THEME = { katalog: { line: "#2e5d27", bg: "#fbfdf7", mark: "Katalog · Klassifikation" },
    schwarzroy2019: { line: "#a24e1c", bg: "#fdf8f2", mark: "Morphologie · Schwarz & Roy 2019" },
    wieland2013: { line: "#6a3d9a", bg: "#f8f5fc", mark: "Morphologie · Wieland 2013" },
    casadei2026: { line: "#1f5f97", bg: "#f4f8fd", mark: "Genetik · Casadei-Ferreira u. a. 2026" },
    svensonwhiting2009: { line: "#0f766e", bg: "#f3fbfa", mark: "Genetik · Svenson & Whiting 2009" } };
  const TH = () => THEME[curTree] || THEME.katalog;
  let curTree = "katalog", diffCount = 0, diffWith = "";
  try { curTree = localStorage.getItem("mantodea-tree") || "katalog"; } catch (e) { /* egal */ }
  const PHYLOS = () => window.MANTODEA_PHYLOS || [{ id: "katalog", titel: "Katalog" }];
  // ---------- Unterschiede: nächste Verwandte (Schwestergruppe) jeder Familie im Vergleich zu einem anderen Baum
  function sisterMap(tree) {
    const out = new Map(), skip = new Set();
    const famsOf = (n) => n.r === "family" ? [n.n] : (n.c || []).flatMap(famsOf);
    const walk = (n, chain) => {
      if (n.last) { famsOf(n).forEach((f) => skip.add(f)); return; }
      if (n.r === "family") {
        for (let i = chain.length - 1; i >= 0; i--) {
          const [anc, child] = chain[i]; const all = famsOf(anc), mine = new Set(famsOf(child));
          const sis = all.filter((f) => !mine.has(f));
          if (sis.length) { out.set(n.n, new Set(sis)); return; }
        }
        return;
      }
      for (const c of n.c || []) walk(c, [...chain, [n, c]]);
    };
    walk(tree, []);
    skip.forEach((f) => out.delete(f));
    return out;
  }
  function markDiffs(meta) {
    diffCount = 0; diffWith = "";
    if (!meta.tree) return;   // der Katalog kennt die Verzweigungen zwischen vielen Familien nicht, ein Vergleich wäre irreführend
    const P = PHYLOS(), other = meta.id === "schwarzroy2019" ? P.find((p) => p.id === "casadei2026") : P.find((p) => p.id === "schwarzroy2019");
    if (!other || !other.tree) return;
    const mine = sisterMap(meta.tree || window.MANTODEA_PHYLO), theirs = sisterMap(other.tree);
    const common = new Set([...mine.keys()].filter((f) => theirs.has(f)));
    diffWith = other.titel;
    const visit = (n) => {
      if (n.rank === "family" && common.has(n.name)) {
        const a = [...mine.get(n.name)].filter((f) => common.has(f)).sort().join(), b = [...theirs.get(n.name)].filter((f) => common.has(f)).sort().join();
        if (a !== b) { n.diff = true; diffCount++; }
      }
      if (n.rank !== "genus") n.kids.forEach(visit);
    };
    visit(rootNode);
  }
  function build() {
    const meta = PHYLOS().find((p) => p.id === curTree) || PHYLOS().find((p) => p.id === "katalog") || PHYLOS()[0];
    curTree = meta.id; dlg.dataset.tree = curTree;
    const PH = meta.tree || window.MANTODEA_PHYLO;
    // in der Studie untersuchte Arten (bzw. Gattungen bei Proben, die nur bis zur Gattung bestimmt sind)
    const ST = meta.studie || { arten: [], gattungen: [], hinweis: {} };
    const sA = new Set(ST.arten), sG = new Set(ST.gattungen);
    nodes.length = 0; imgsReset();
    const T = (window.MANTODEA_TAXA || { g: {} }).g;
    const live = DATA.filter((s) => !s.x);
    const byGenus = new Map();
    for (const s of live) { if (!byGenus.has(s.g)) byGenus.set(s.g, []); byGenus.get(s.g).push(s); }
    const used = new Set();
    const famColor = new Map();
    let fi = 0;
    function make(src, parent, fam) {
      const n = { name: src.n, rank: src.r, ri: RI[src.r] ?? (src.r === "clade" ? 1 : 10), parent, kids: [], fam, age: src.age, note: src.note, last: !!src.last };
      if (src.r === "family") { n.fam = n; famColor.set(n, `hsl(${Math.round((fi++ * 137.5) % 360)} 52% 34%)`); }
      if (src.r === "genus") {
        const sp = byGenus.get(src.n);
        if (!sp || used.has(src.n)) return null;
        used.add(src.n);
        n.year = T[src.n] ? T[src.n][0] : null; n.auth = T[src.n] ? T[src.n][1] : "";
        n.kids = sp.sort((a, b) => (a.y || 9999) - (b.y || 9999) || coll.compare(a.n, b.n))
          .map((s) => ({ name: s.n, rank: "species", ri: RI.species, s, parent: n, kids: [], rep: s.p ? s : null, year: s.y, fam: n.fam, studied: sA.has(s.n), hint: (ST.hinweis || {})[s.n] }));
        n.studied = sG.has(src.n);
        n.rep = best(sp);
        return n;
      }
      for (const c of src.c || []) { const k = make(c, n, n.fam); if (k) n.kids.push(k); }
      if (src.r === "family") n.rep = best(n.kids.flatMap(function all(k) { return k.rank === "species" ? [k.s] : k.kids.flatMap(all); }));
      return n.kids.length ? n : null;
    }
    rootNode = make(PH, null, null);
    markDiffs(meta);
    // Autoren-Bäume: Verzweigungen oberhalb der Familie nach ihrer Tiefe auf die Spalten verteilen
    if (meta.tree) {
      let dMax = 1;
      const depth = (n, d) => { n.d = d; if (n.rank === "family") dMax = Math.max(dMax, d); else if (n.ri < RI.family) n.kids.forEach((k) => depth(k, d + 1)); };
      depth(rootNode, 0);
      const setRi = (n) => { if (n.ri < RI.family || n.rank === "clade") { n.ri = (n.d / dMax) * (RI.family - 0.5); n.kids.forEach(setRi); } };
      setRi(rootNode);
    }
    const rest = [...byGenus.keys()].filter((g) => !used.has(g));
    if (rest.length) {
      const extra = { name: "ohne genaue Einordnung", rank: "family", ri: RI.family, parent: rootNode, kids: [] };
      extra.fam = extra; famColor.set(extra, "hsl(0 0% 40%)");
      for (const g of rest.sort(coll.compare)) {
        const sp = byGenus.get(g);
        const gn = { name: g, rank: "genus", ri: RI.genus, parent: extra, kids: [], fam: extra, year: T[g] ? T[g][0] : null, auth: T[g] ? T[g][1] : "", rep: best(sp) };
        gn.kids = sp.map((s) => ({ name: s.n, rank: "species", ri: RI.species, s, parent: gn, kids: [], rep: s.p ? s : null, year: s.y, fam: extra }));
        extra.kids.push(gn);
      }
      rootNode.extra = extra;
    }
    // Größe und Leiterordnung: die kleinere Schwestergruppe (früher abgespalten) nach oben;
    // ungeklärte Verwandtschaft (viele gleichrangige Gruppen) alphabetisch, Gattungen nach Beschreibungsjahr
    const size = (n) => (n.rank === "species" ? 1 : (n.n = n.kids.reduce((a, k) => a + size(k), 0)));
    size(rootNode);
    const stud = (n) => (n.rank === "species" ? (n.studied ? 1 : 0) : (n.nst = n.kids.reduce((a, k) => a + stud(k), 0) + (n.studied ? 1 : 0)));
    stud(rootNode);
    const order = (n) => {
      if (n.rank === "genus") return;
      const allGen = n.kids.every((k) => k.rank === "genus");
      if (allGen) n.kids.sort((a, b) => (a.year || 9999) - (b.year || 9999) || coll.compare(a.name, b.name));
      else if (n.kids.length > 3) n.kids.sort((a, b) => (a.rank === "genus") - (b.rank === "genus") || coll.compare(a.name, b.name));
      else n.kids.sort((a, b) => a.n - b.n);
      n.kids.sort((a, b) => (a.last ? 1 : 0) - (b.last ? 1 : 0));
      n.kids.forEach(order);
    };
    order(rootNode);
    if (rootNode.extra) { rootNode.kids.push(rootNode.extra); rootNode.n += rootNode.extra.kids.reduce((t, g) => t + g.kids.length, 0); rootNode.extra.n = rootNode.extra.kids.reduce((t, g) => t + g.kids.length, 0); rootNode.extra.kids.forEach((g) => (g.n = g.kids.length)); }
    let row = 0, lastFam = null;
    const place = (n) => {
      n.color = n.fam ? famColor.get(n.fam) : "#2e5d27";
      if (n.rank === "species") { if (n.fam !== lastFam) { row += 1.2; lastFam = n.fam; } n.y = row; row += 1; n.y0 = n.y1 = n.y; nodes.push(n); return; }
      if (n.rank === "genus") row += 0.35;
      n.kids.forEach(place);
      n.y0 = n.kids[0].y0; n.y1 = n.kids[n.kids.length - 1].y1;
      n.y = (n.kids[0].y + n.kids[n.kids.length - 1].y) / 2;
      nodes.push(n);
    };
    place(rootNode);
    ROWS = row + 1.2;
    FAMS = nodes.filter((n) => n.rank === "family").sort((a, b) => a.y0 - b.y0);
    byName = new Map(nodes.map((n) => [n.name.toLowerCase(), n]));
    document.getElementById("tr-names").innerHTML = nodes.filter((n) => n.parent).map((n) => `<option value="${esc(n.name)}">${RDE[n.rank] || ""}</option>`).join("");
    segments();
    built = true;
  }
  function imgsReset() { if (typeof imgsResetImpl === "function") imgsResetImpl(); }
  const shortName = (n) => { const p = n.split(" "); return p.length > 1 ? `${p[0][0]}. ${p.slice(1).join(" ")}` : n; };
  const lineage = (n) => { const a = []; for (let x = n; x; x = x.parent) a.unshift(x); return a; };

  // ---------- Stufenlose senkrechte Abbildung (Familien mit Mindesthöhe)
  let W = 0, H = 0, DPR = 1;
  const view = { py: 0, rh: 1, x: 0 };
  let homeRH = 1, started = false;
  let SEG = [], TOTAL = 0, MINH = 24;
  function segments() {
    SEG = FAMS.map((f, i) => ({ f, a: i ? (FAMS[i - 1].y1 + f.y0) / 2 : f.y0 - 1.2, b: i < FAMS.length - 1 ? (f.y1 + FAMS[i + 1].y0) / 2 : f.y1 + 1.2 }));
    for (const g of SEG) g.f.seg = g;
  }
  function layoutFor(rh) {
    let top = 44;
    for (const g of SEG) { g.h = Math.max((g.b - g.a) * rh, MINH); g.k = g.h / (g.b - g.a); g.top = top; top += g.h; }
    TOTAL = top + 16;
  }
  function P(r) {
    if (r <= SEG[0].a) return SEG[0].top + (r - SEG[0].a) * SEG[0].k;
    const L = SEG[SEG.length - 1];
    if (r >= L.b) return L.top + L.h + (r - L.b) * L.k;
    let lo = 0, hi = SEG.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (SEG[m].a <= r) lo = m; else hi = m - 1; }
    const g = SEG[lo]; return g.top + (r - g.a) * g.k;
  }
  function R(c) {
    if (c <= SEG[0].top) return SEG[0].a + (c - SEG[0].top) / SEG[0].k;
    const L = SEG[SEG.length - 1];
    if (c >= L.top + L.h) return L.b + (c - L.top - L.h) / L.k;
    let lo = 0, hi = SEG.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (SEG[m].top <= c) lo = m; else hi = m - 1; }
    const g = SEG[lo]; return g.a + (c - g.top) / g.k;
  }
  const kOf = (n) => (n.fam && n.fam.seg ? n.fam.seg.k : view.rh);
  const sy = (y) => P(y) - view.py;
  const yOf = (py) => R(py + view.py);

  // Spalten je Rang; sie rücken beim Hineinzoomen zusammen, damit die Arten Platz haben
  let colX = () => 0, spX = 0, narrow = true;
  function columns() {
    narrow = W < 560;
    // maßgeblich ist der Zoom der Familie in der Bildmitte (kleine Familien sind schon früher groß)
    let zk = view.rh;
    if (SEG.length && H) { const c = view.py + H / 2; const g = SEG.find((x) => c >= x.top && c <= x.top + x.h); if (g) zk = Math.max(zk, g.k); }
    const tz = Math.max(0, Math.min(1, narrow ? (zk - 2) / 10 : (zk - 4) / 14));
    const x0 = narrow ? 14 : 22;
    const genA = narrow ? W - 76 : Math.min(W - 180, 900), genB = narrow ? 96 : 300;
    const genX = genA + (genB - genA) * tz;
    // Gewichte je Rang: höhere Ebenen (bis Überfamilie) werden beim Hineinzoomen schmal, Familie bis Gattung breit
    const wHi = 1 - 0.85 * Math.max(0, Math.min(1, narrow ? (zk - 0.8) / 1.6 : (zk - 1.5) / 6));
    const w = RANKS.slice(0, RI.genus).map((r, i) => (i < RI.family ? wHi : 1));
    const tot = w.reduce((a, b) => a + b, 0), cum = [0];
    for (const v of w) cum.push(cum[cum.length - 1] + v);
    colX = (ri) => { ri = Math.max(0, Math.min(ri, RI.genus)); const i = Math.floor(ri), f = ri - i; const c = cum[i] + (i < cum.length - 1 ? f * (cum[i + 1] - cum[i]) : 0); return x0 + (c / tot) * (genX - x0); };
    spX = genX + (narrow ? 118 : 190);
  }
  function resize() {
    const r = cv.parentElement.getBoundingClientRect();
    if (!r.width || !built) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + "px"; cv.style.height = H + "px";
    MINH = Math.max(14, Math.min(40, (H - 70) / Math.max(1, SEG.length)));
    let lo = 0.001, hi = 20;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; layoutFor(m); if (TOTAL <= H) lo = m; else hi = m; }
    homeRH = lo;
    if (!started) { view.rh = homeRH; view.py = 0; started = true; }
    clamp(); draw();
  }
  function clamp() {
    view.rh = Math.max(homeRH, Math.min(90, view.rh));
    layoutFor(view.rh);
    if (TOTAL <= H) view.py = (TOTAL - H) / 2;
    else view.py = Math.max(-H * 0.25, Math.min(TOTAL - H * 0.75, view.py));
    columns();
    view.x = Math.max(-W * 0.2, Math.min(Math.max(0, spX + 260 - W), view.x));
  }

  // ---------- Zeichnen
  const imgs = new Map(), loading = new Set();
  function imgsResetImpl() { /* Fotos bleiben im Speicher, sie gelten für alle Bäume */ }
  let queue = 0;
  function getImg(rec) {
    if (!rec) return null;
    if (imgs.has(rec.k)) return imgs.get(rec.k);
    if (!loading.has(rec.k) && queue < 6) {
      loading.add(rec.k); queue++;
      imgData(rec).then((src) => { const im = new Image(); im.onload = () => { imgs.set(rec.k, im); queue--; draw(); }; im.onerror = () => { queue--; }; im.src = src; })
        .catch(() => { queue--; });
    }
    return null;
  }
  function photo(rec, x, y, d, color) {
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, d / 2, 0, Math.PI * 2); ctx.closePath();
    ctx.fillStyle = "#e8eee2"; ctx.fill();
    const im = getImg(rec);
    if (im) { ctx.clip(); const s = Math.max(d / im.width, d / im.height); ctx.drawImage(im, x - (im.width * s) / 2, y - (im.height * s) / 2, im.width * s, im.height * s); }
    else if (!rec) { ctx.fillStyle = "#a9b5a0"; ctx.font = `${Math.round(d * 0.45)}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("?", x, y + 1); }
    ctx.restore();
    ctx.beginPath(); ctx.arc(x, y, d / 2, 0, Math.PI * 2); ctx.lineWidth = Math.max(1.5, d / 20); ctx.strokeStyle = color; ctx.stroke();
  }
  function label(text, x, y, size, color, weight, italic, maxW, base) {
    if (maxW !== undefined && maxW < 24) return false;
    ctx.font = `${italic ? "italic " : ""}${weight} ${size}px system-ui, sans-serif`;
    ctx.textAlign = "left"; ctx.textBaseline = base || "middle";
    let t = text;
    if (maxW && ctx.measureText(t).width > maxW) { while (t.length > 3 && ctx.measureText(t + "…").width > maxW) t = t.slice(0, -1); t += "…"; }
    ctx.lineWidth = 3; ctx.strokeStyle = "rgba(251,253,247,.94)"; ctx.strokeText(t, x, y);
    ctx.fillStyle = color; ctx.fillText(t, x, y);
    return true;
  }
  function stickY(n, pad) {
    const a = sy(n.y0), b = sy(n.y1), c = sy(n.y);
    if (b < pad || a > H - pad) return c;
    return Math.min(Math.max(c, Math.max(a, pad)), Math.min(b, H - pad));
  }
  const xOf = (n) => (n.rank === "species" ? spX : colX(n.ri));
  const padOf = (n) => 34 + Math.min(6, n.ri) * 3;

  let raf = 0, pathKey = "", pathNodes = [];
  function draw() { if (!raf) raf = requestAnimationFrame(render); }
  function render() {
    raf = 0;
    if (!built || !W) return;
    columns();
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = TH().bg; ctx.fillRect(0, 0, W, H);
    // Wasserzeichen unten rechts: welcher Baum gerade gezeigt wird
    ctx.save(); ctx.font = `700 ${narrow ? 15 : 22}px Georgia, serif`; ctx.fillStyle = TH().line; ctx.globalAlpha = 0.28; ctx.textAlign = "right"; ctx.textBaseline = "top";
    ctx.fillText(TH().mark, W - 14, narrow ? 30 : 12); ctx.restore();
    ctx.translate(-view.x, 0);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const yMin = yOf(-60), yMax = yOf(H + 60);
    const vis = (n) => n.y1 >= yMin && n.y0 <= yMax;
    const pos = new Map();
    const posOf = (n) => { if (!pos.has(n)) pos.set(n, n.rank === "species" ? sy(n.y) : (vis(n) ? stickY(n, padOf(n)) : sy(n.y))); return pos.get(n); };

    // Äste: Knoten -> senkrechte Schiene kurz vor der Spalte der Kinder -> Kinder
    const visible = [];
    const walk = (n) => {
      if (!vis(n)) return;
      visible.push(n);
      if (n.rank === "species") return;
      if (n.rank === "genus" && kOf(n) < 7) return;
      const x0 = xOf(n), y0 = posOf(n);
      const kids = n.kids.filter((k) => k.y1 >= yMin - 400 && k.y0 <= yMax + 400);
      if (!kids.length) return;
      const minKX = Math.min(...kids.map(xOf));
      const bx = Math.max(x0 + 2, minKX - Math.min(10, (minKX - x0) * 0.4));
      ctx.strokeStyle = n.fam ? n.color : TH().line;
      ctx.lineWidth = n.ri < RI.family ? 2.2 : n.rank === "genus" ? Math.max(0.8, Math.min(1.6, kOf(n) * 0.08)) : 1.5;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(bx, y0);
      const ys = kids.map((k) => Math.max(-500, Math.min(H + 500, posOf(k))));
      ctx.moveTo(bx, Math.min(y0, ...ys)); ctx.lineTo(bx, Math.max(y0, ...ys));
      kids.forEach((k, i) => { ctx.moveTo(bx, ys[i]); ctx.lineTo(xOf(k), ys[i]); });
      ctx.stroke();
      kids.forEach(walk);
    };
    walk(rootNode);

    // Arten
    for (const n of visible) {
      if (n.rank !== "species") continue;
      const rh = kOf(n);
      if (rh < 7) continue;
      const y = posOf(n); if (y < -40 || y > H + 40) continue;
      const spPhoto = rh >= 18, d = Math.min(rh * 0.95, 60);
      if (spPhoto) photo(n.rep, spX + d / 2, y, d, n.color);
      else { ctx.beginPath(); ctx.arc(spX + 2, y, Math.max(n.studied ? 3 : 1.5, rh * 0.18), 0, Math.PI * 2); ctx.fillStyle = n.studied ? "#e8890c" : n.color; ctx.fill(); }
      if (rh >= 10) {
        const lx = spX + (spPhoto ? d + 6 : 7), fs = Math.max(10, Math.min(15, rh * 0.42)), room = W + view.x - lx - 6;
        ctx.font = `italic 500 ${fs}px system-ui`;
        const t = ctx.measureText(n.name).width <= room ? n.name : shortName(n.name);
        // wissenschaftlicher Name mit Autor und Jahr der Beschreibung, z. B. Mantis religiosa (Linnaeus, 1758)
        if (n.studied) ctx.font = `italic 700 ${fs}px system-ui, sans-serif`;
        const au = n.s.a || "", tw = ctx.measureText((n.studied ? "★ " : "") + t).width;
        ctx.font = `400 ${fs * 0.88}px system-ui`;
        const inline = au && tw + 5 + ctx.measureText(au).width <= room;
        const sub = [inline ? "" : (rh >= 24 ? au : ""), n.studied && rh >= 24 ? "in der Studie untersucht" + (n.hint ? ` (${n.hint})` : "") : "", rh >= 34 ? n.s.de || n.s.en : ""].filter(Boolean).join(" · ");
        const yy = y - (sub ? fs * 0.45 : 0);
        if (n.studied) { ctx.beginPath(); ctx.arc(spPhoto ? spX + d / 2 : spX + 2, y, spPhoto ? d / 2 + 2.5 : Math.max(3, rh * 0.25), 0, Math.PI * 2); ctx.lineWidth = 3; ctx.strokeStyle = "#e8890c"; ctx.stroke(); }
        label((n.studied ? "★ " : "") + t, lx, yy, fs, n.studied ? "#b35c00" : "#1b2a17", n.studied ? 700 : 500, true, room);
        if (inline) label(au, lx + tw + 5, yy, fs * 0.88, "#4a5a44", 400, false, room - tw - 5);
        if (sub) label(sub, lx, y + fs * 0.7, fs * 0.78, "#5b6b55", 400, false, room);
      }
    }
    // innere Knoten: Punkt (Familie: Foto in der Übersicht) und Name auf dem Ast
    const lastY = {};
    const inner = visible.filter((n) => n.rank !== "species").sort((a, b) => a.ri - b.ri || a.y - b.y);
    for (const n of inner) {
      const x = xOf(n), y = posOf(n);
      if (y < -30 || y > H + 30) continue;
      const rh = kOf(n), span = (n.y1 - n.y0 + 1) * rh;
      const isFam = n.rank === "family", famPhoto = isFam && span >= 16 && rh < 7;
      if (famPhoto) photo(n.rep, x, y, Math.min(span * 0.8, 30), n.color);
      else { ctx.beginPath(); ctx.arc(x, y, n.ri <= RI.family ? 4 : 3, 0, Math.PI * 2); ctx.fillStyle = n.fam ? n.color : TH().line; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = "#fff"; ctx.stroke(); }
      // Familie steht anders als im Vergleichsbaum: oranger Ring
      if (n.diff) { ctx.beginPath(); ctx.arc(x, y, famPhoto ? Math.min(span * 0.4, 15) + 4 : 8, 0, Math.PI * 2); ctx.lineWidth = 2.5; ctx.strokeStyle = "#e8890c"; ctx.stroke(); }
      const fs = n.rank === "genus" ? Math.max(11, Math.min(15, 10 + rh * 0.12)) : isFam ? Math.max(11, Math.min(15, 10 + span * 0.02)) : 11.5;
      const lk = Math.round(n.ri * 2);
      if (lastY[lk] !== undefined && Math.abs(y - lastY[lk]) < fs * 2) continue;
      if (n.rank === "genus" && span < 9 && rh < 6) continue;
      const mid = n.ri > RI.family && n.ri < RI.genus;
      if (mid && (span < (narrow ? 18 : 14) || colX(n.ri + 1) - x < (narrow ? 12 : 8))) continue;
      const lx = x + (famPhoto ? Math.min(span * 0.4, 15) + 4 : 6);
      // Platz: Gattung bis zu den Arten, sonst bis zur Spalte der Gattungen (Namen dürfen über Äste laufen)
      const limit = n.rank === "genus" ? (rh >= 7 ? spX - 6 : W + view.x - 6) : Math.max(colX(n.ri + 2), colX(RI.genus) - 8);
      const nm = n.name || (n.age ? `${n.age} Mio. J.` : "");
      if (!nm) continue;
      // Verzweigungen ohne Rang (Autoren-Bäume): nur beschriften, wenn genug Platz ist
      if (n.rank === "clade" || (n.ri < RI.family && n.ri % 1)) {
        if (span < (narrow ? 70 : 30)) continue;
        const room = Math.min(...n.kids.map(xOf)) - x;
        if (narrow && room < 46 && span < 140) continue;
      }
      const shown = label((n.rank === "genus" && (n.studied || n.nst) ? "★ " : "") + nm, lx, y - 2, fs, n.fam ? n.color : "#1b3a12", n.ri <= RI.family ? 700 : 600, n.rank === "genus", limit - lx, "bottom");
      if (!shown) continue;
      lastY[lk] = y;
      const hint = n.note || (n.diff ? `Stellung anders als bei ${diffWith}` : "") || NOTE[n.name];
      const info = n.rank === "genus" ? `${n.year || "?"} · ${n.n} ${n.n === 1 ? "Art" : "Arten"}${n.studied ? " · ★ Probe (Art unbestimmt) in der Studie" : n.nst ? ` · ★ ${n.nst} untersucht` : ""}` : n.nst && n.rank === "family" ? `${RDE.family} · ${fmt.format(n.n)} Arten · ★ ${n.nst} untersucht` : hint ? hint + (n.age && n.name ? ` · vor ${n.age} Mio. J.` : "")
        : n.age && n.name ? `vor ${n.age} Mio. J. · ${fmt.format(n.n)} Arten` : !n.name ? "" : ((RDE[n.rank] || "") + ` · ${fmt.format(n.n)} Arten`);
      if (info && (span >= 22 || hint)) label(info, lx, y + 2, fs * 0.78, hint ? "#a0522d" : "#5b6b55", hint ? 600 : 400, false, limit - lx, "top");
    }
    // Pfad oben: Abstammungslinie des Bereichs in der Bildmitte
    const yc = yOf(H / 2);
    let cur = rootNode;
    while (cur && cur.kids.length && cur.rank !== "species") {
      const k = cur.kids.find((c) => yc >= c.y0 - 0.6 && yc <= c.y1 + 0.6);
      if (!k || k.rank === "species" || (k.rank === "genus" && kOf(k) < 4)) break;
      cur = k;
    }
    const named = lineage(cur).filter((n) => n.name);
    const key = curTree + "|" + named.map((n) => n.name).join("/") + (view.rh <= homeRH * 1.05 ? "|home" : "");
    if (key !== pathKey) {
      pathKey = key; pathNodes = named;
      const item = (n, i) => `<button type="button" class="tp-i tp-${n.rank}" data-pi="${i}" title="${esc((RDE[n.rank] || "Gruppe") + " " + n.name)} – antippen zum Heranholen"><small>${esc(RDE[n.rank] || "Gruppe")}</small><span>${n.rank === "genus" ? `<i>${esc(n.name)}</i>` : esc(n.name)}</span></button>`;
      document.getElementById("tr-path").innerHTML = view.rh <= homeRH * 1.05 || named.length <= 1
        ? `<span class="tp-sum">Mantodea · ${fmt.format(FAMS.length)} Familien · ${fmt.format(nodes.filter((n) => n.rank === "genus").length)} Gattungen · ${fmt.format(nodes.filter((n) => n.rank === "species").length)} Arten – zum Erkunden hineinzoomen oder eine Familie antippen</span>`
        : named.map(item).join('<span class="tp-sep" aria-hidden="true">›</span>');
    }
    // Spaltenköpfe: welcher Rang in welcher Spalte steht (sobald die Spalten auseinandergezogen sind)
    const heads = [["family", "Familie"], ["subfamily", "Unterfamilie"], ["tribe", "Tribus"], ["genus", "Gattung"]];
    const hy = (document.getElementById("tr-path").offsetHeight || 26) + 4;
    let lastHX = -1e9;
    ctx.save(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (view.rh > homeRH * 2) {
      ctx.fillStyle = "rgba(251,253,247,.88)"; ctx.fillRect(0, hy - 2, W, 18);
      for (const [r, t] of [...heads, ["species", "Art"]]) {
        const x = (r === "species" ? spX : colX(RI[r])) - view.x;
        if (x < 4 || x > W - 20 || x - lastHX < 62) continue;
        lastHX = x;
        ctx.font = "700 10.5px system-ui, sans-serif"; ctx.fillStyle = "#5b6b55"; ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText(t.toUpperCase(), x, hy + 1);
      }
    }
    ctx.restore();
    document.getElementById("tr-hint").style.opacity = view.rh > homeRH * 3 ? "0" : "1";
  }

  // ---------- Bedienung
  function zoomAt(py, f) {
    f = Math.max(0.8, Math.min(1.25, f));
    const r = yOf(py);
    view.rh *= f; clamp();
    view.py = P(r) - py; clamp(); draw();
  }
  let anim = 0;
  function flyTo(row, rh, x) {
    cancelAnimationFrame(anim);
    const r0 = yOf(H / 2), k0 = view.rh, x0 = view.x, t0 = performance.now(), T = 700, tx = x === undefined ? 0 : x;
    const step = (t) => {
      const u = Math.min(1, (t - t0) / T), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      view.rh = Math.exp(Math.log(k0) + (Math.log(rh) - Math.log(k0)) * e); clamp();
      view.py = P(r0 + (row - r0) * e) - H / 2; view.x = x0 + (tx - x0) * e; clamp(); draw();
      if (u < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  function focus(n) {
    if (n === rootNode) return flyTo((rootNode.y0 + rootNode.y1) / 2, homeRH);
    if (n.rank === "species") return flyTo(n.y, Math.max(view.rh, 46));
    const rows = n.y1 - n.y0 + 2;
    const rh = Math.max(Math.min((H - 70) / rows, n.rank === "genus" ? 56 : 30), n.rank === "genus" ? 24 : homeRH);
    flyTo((n.y0 + n.y1) / 2, rh);
  }
  cv.addEventListener("wheel", (e) => {
    e.preventDefault();
    const r = cv.getBoundingClientRect();
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) { view.x += (e.deltaX || e.deltaY); clamp(); draw(); return; }
    zoomAt(e.clientY - r.top, Math.exp(-Math.max(-120, Math.min(120, e.deltaY)) * 0.0015));
  }, { passive: false });
  const ptr = new Map();
  let moved = false, pinch0 = null, lastTap = 0;
  cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); moved = false; cancelAnimationFrame(anim); });
  cv.addEventListener("pointermove", (e) => {
    if (!ptr.has(e.pointerId)) return;
    const prev = ptr.get(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptr.size === 1) {
      const dx = e.clientX - prev[0], dy = e.clientY - prev[1];
      if (Math.abs(dx) + Math.abs(dy) > 1) moved = true;
      view.py -= dy; view.x -= dx; clamp(); draw();
    } else if (ptr.size === 2) {
      moved = true;
      const [a, b] = [...ptr.values()], d = Math.max(30, Math.hypot(a[0] - b[0], a[1] - b[1]));
      const r = cv.getBoundingClientRect(), cy = (a[1] + b[1]) / 2 - r.top;
      if (pinch0) zoomAt(cy, Math.pow(d / pinch0, 1.1));
      pinch0 = d;
    }
  });
  cv.addEventListener("pointerup", (e) => {
    ptr.delete(e.pointerId); if (ptr.size < 2) pinch0 = null;
    if (moved || ptr.size) return;
    const r = cv.getBoundingClientRect(), px = e.clientX - r.left + view.x, py = e.clientY - r.top, now = Date.now();
    if (now - lastTap < 300) { lastTap = 0; flyTo(yOf(py), Math.min(90, view.rh * 2.5)); return; }
    lastTap = now;
    const hit = pick(px, py);
    if (hit) setTimeout(() => { if (lastTap === now) { if (hit.rank === "species" && kOf(hit) >= 16) detail(hit.s.k); else focus(hit); } }, 280);
  });
  cv.addEventListener("pointercancel", (e) => { ptr.delete(e.pointerId); pinch0 = null; });
  function pick(px, py) {
    let bestN = null, bd = 1e9;
    for (const n of nodes) {
      if (n.rank === "species" && kOf(n) < 7) continue;
      const y = n.rank === "species" ? sy(n.y) : stickY(n, padOf(n));
      if (y < -20 || y > H + 20) continue;
      const x = xOf(n) + (n.rank === "species" ? 20 : 30);
      const d = Math.hypot((x - px) * 0.5, y - py);
      if (d < bd) { bd = d; bestN = n; }
    }
    return bd < Math.max(16, view.rh * 0.7) ? bestN : null;
  }
  dlg.querySelector(".tree-btns").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.z === "in") flyTo(yOf(H / 2), Math.min(90, view.rh * 1.8));
    if (b.dataset.z === "out") flyTo(yOf(H / 2), Math.max(homeRH, view.rh / 1.8));
    if (b.dataset.z === "home") focus(rootNode);
    if (b.dataset.z === "info") { const i = document.getElementById("tr-info"); i.hidden = !i.hidden; setTimeout(resize, 20); }
    if (b.classList.contains("tr-close")) dlg.close();
  });
  document.getElementById("tr-path").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pi]"); if (!b) return;
    const n = pathNodes[+b.dataset.pi]; if (n) focus(n);
  });
  document.getElementById("tr-q").addEventListener("change", (e) => {
    const n = byName.get(e.target.value.trim().toLowerCase());
    if (n) { focus(n); e.target.blur(); }
  });
  new ResizeObserver(() => { if (dlg.open) resize(); }).observe(cv.parentElement);

  function drawPick() {
    const P = PHYLOS(), m = P.find((p) => p.id === curTree) || P.find((p) => p.id === "katalog") || P[0];
    const cls = (p) => (p.id === "wieland2013" ? "wie" : p.art === "genetisch" ? "gen" : p.art === "morphologisch" ? "mor" : "kat");
    document.getElementById("tr-pick").innerHTML = P.map((p) => `<button type="button" role="tab" class="${cls(p)}" data-tree="${esc(p.id)}" aria-selected="${p.id === curTree}"><span class="lg">${esc(p.titel === "Katalog" ? "Catalogue of Life (aktuell)" : p.titel)}</span></button>`).join("");
    const src = document.getElementById("tr-src"), wasOpen = src.open;
    const SHORT = { Klassifikation: "offizielle Einteilung aller Gruppen", morphologisch: "nach dem Körperbau, vor allem den Genitalien", genetisch: "nach dem Erbgut, 1.160 Gene, mit Altersangaben" };
    src.innerHTML = m.zitat ? `<summary><span class="tag ${cls(m)}">${esc(m.art)}</span><span class="short">${esc(m.kurztext || SHORT[m.art] || "")}</span><span class="ibtn" role="button" aria-label="Information zu diesem Stammbaum" title="Information zu diesem Stammbaum">i</span></summary>
      <div class="src-body"><p>${esc(m.text || "")}</p><p class="cite">${esc(m.zitat)}</p><p class="links"><a href="${esc(m.url)}" target="_blank" rel="noopener">📄 Zur Veröffentlichung ↗</a>${m.daten ? `<a href="${esc(m.daten)}" target="_blank" rel="noopener">🧬 Originaldaten ↗</a>` : ""}</p></div>` : "";
    src.open = wasOpen;
  }
  document.getElementById("tr-pick").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tree]"); if (!b || b.dataset.tree === curTree) return;
    curTree = b.dataset.tree; try { localStorage.setItem("mantodea-tree", curTree); } catch (err) { /* egal */ }
    build(); started = false; drawPick(); setTimeout(resize, 20);
  });
  async function open() {
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
    if (!built) {
      try { await Promise.all([loadScript("data/stammbaum.js"), loadScript("data/stammbaeume.js").catch(() => null), loadScript("data/gattungen.js").catch(() => null)]); }
      catch (e) { document.getElementById("tr-path").textContent = "Stammbaum konnte nicht geladen werden."; return; }
      build(); started = false; drawPick();
    }
    setTimeout(resize, 20);
  }
  dlg.addEventListener("close", () => document.dispatchEvent(new CustomEvent("mantodea:tree-closed")));
  if (location.hash === "#stammbaum") setTimeout(open, 50);
  window.MANTODEA_TREE = { open, focusName: (n) => { const x = byName.get(String(n).toLowerCase()); if (x) focus(x); } };
})();
