// Verbreitungskarte im Steckbrief: Länder mit Nachweisen eingefärbt, Fundorte als Punkte,
// automatisch auf das Fundgebiet gezoomt (mit Übersichtskarte), umschaltbar auf die ganze Welt.
(() => {
  "use strict";
  const UI = window.MANTODEA_UI;
  if (!UI) return;
  const { loadScript, esc, fmt, BYKEY, cname } = UI;
  const S = 5;                                   // Karteneinheiten pro Grad (aus weltkarte.js)
  const WORLD = { x: -180 * S, y: -84 * S, w: 360 * S, h: 142 * S };   // 84° N bis 58° S
  const NS = "http://www.w3.org/2000/svg";
  let clipNr = 0;

  // Rasterzellen -> Mittelpunkte in Karteneinheiten
  function cells(k) {
    const P = (window.MANTODEA_PTS || {}).p || {}, z = (window.MANTODEA_PTS || {}).z || 360 / 512;
    return (P[k] || []).map((i) => {
      const row = Math.floor(i / 512), col = i % 512;
      return [(-180 + (col + 0.5) * z) * S, -(90 - (row + 0.5) * z) * S];
    });
  }

  // Ausschnitt: alle Fundpunkte (sonst belegte Länder), mit Rand, Mindestgröße und passendem Seitenverhältnis
  function fitBox(pts, s, aspect) {
    const M = window.MANTODEA_MAP;
    let b = null;
    const add = (x0, y0, x1, y1) => { b = b ? [Math.min(b[0], x0), Math.min(b[1], y0), Math.max(b[2], x1), Math.max(b[3], y1)] : [x0, y0, x1, y1]; };
    pts.forEach(([x, y]) => add(x, y, x, y));
    // belegte Länder ohne Fundpunkte (nur Länderangabe) ebenfalls in den Ausschnitt nehmen
    for (const cc of s.ct || []) {
      const bb = M.b[cc];
      if (!bb || bb[2] - bb[0] > 200 * S) continue;
      if (pts.some(([x, y]) => x >= bb[0] && x <= bb[2] && y >= bb[1] && y <= bb[3])) continue;
      add(...bb);
    }
    if (!b) return null;
    let w = b[2] - b[0], h = b[3] - b[1];
    const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
    w = Math.max(w * 1.3, 34 * S); h = Math.max(h * 1.3, 22 * S);          // Rand und Mindestausschnitt (Übersicht)
    if (w / h > aspect) h = w / aspect; else w = h * aspect;
    if (w > WORLD.w * 0.8 || h > WORLD.h * 0.8) return null;              // fast weltweit: dann Weltkarte
    let x = cx - w / 2, y = cy - h / 2;
    x = Math.max(-180 * S, Math.min(x, 180 * S - w));
    y = Math.max(-90 * S, Math.min(y, 90 * S - h));
    return { x, y, w, h };
  }

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // Angaben aus der Fachliteratur (PDF-Sammlung): Punkte mit Koordinaten, Länder, frühere Gebietsnamen
  const LIT = (k) => (window.MANTODEA_LITORTE || {})[k] || null;
  const litPts = (L) => (L ? L.p : []).map((p) => [p[1] * S, -p[0] * S, p]);
  function draw(box, s, view, pts, L) {
    const M = window.MANTODEA_MAP;
    const ok = new Set(s.ct || []), q = new Set(s.cq || []);
    const lit = new Set(((L && L.c) || []).filter((c) => !ok.has(c)));
    const hist = Object.entries((L && L.h) || {});
    const vb = view === "region" && box ? box : WORLD;
    const svg = el("svg", { viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`, class: "wmap", role: "img",
      "aria-label": `Verbreitungskarte von ${s.n}` });
    el("rect", { x: -180 * S, y: -90 * S, width: 360 * S, height: 180 * S, class: "sea" }, svg);
    // Gradnetz alle 30° (bzw. 10° im Ausschnitt) zur Orientierung
    const step = vb.w < 120 * S ? 10 : 30;
    const g0 = el("g", { class: "grat" }, svg);
    for (let lon = -180; lon <= 180; lon += step) el("line", { x1: lon * S, y1: -90 * S, x2: lon * S, y2: 90 * S }, g0);
    for (let lat = -90; lat <= 90; lat += step) el("line", { x1: -180 * S, y1: -lat * S, x2: 180 * S, y2: -lat * S, class: lat === 0 ? "eq" : "" }, g0);
    const gl = el("g", { class: "land" }, svg);
    for (const cc in M.p) {
      const p = el("path", { d: M.p[cc], class: ok.has(cc) ? "ok" : lit.has(cc) ? "lit" : q.has(cc) ? "q" : "" }, gl);
      const t = el("title", {}, p); t.textContent = cname(cc) + (ok.has(cc) ? " – Nachweise vorhanden" : lit.has(cc) ? " – nur in der Fachliteratur genannt" : q.has(cc) ? " – fragliche Einzelmeldung" : "");
    }
    // frühere Gebiete (andere Namen und Grenzen als heute): schraffiert, mit dem damaligen Namen beschriftet
    if (hist.length) {
      const hw = Math.max(vb.w / 160, 1.2);
      const defs = el("defs", {}, svg);
      const pat = el("pattern", { id: "hatch-" + s.k, patternUnits: "userSpaceOnUse", width: hw, height: hw, patternTransform: "rotate(45)" }, defs);
      el("line", { x1: 0, y1: 0, x2: 0, y2: hw, class: "hatch" , "stroke-width": hw * 0.45 }, pat);
      const gh = el("g", { class: "hist" }, svg);
      for (const [name, ccs] of hist) {
        for (const cc of ccs) if (M.p[cc]) {
          const p = el("path", { d: M.p[cc], fill: `url(#hatch-${s.k})` }, gh);
          el("title", {}, p).textContent = `${name} – früherer Gebietsname (andere Grenzen als heute); umfasst heute ${ccs.map(cname).join(", ")}`;
        }
      }
    }
    // Fundpunkte: Größe passt sich dem Ausschnitt an
    const r = Math.max(vb.w / 420, 0.36 * S);
    const gp = el("g", { class: "pts" }, svg);
    for (const [x, y] of pts) el("circle", { cx: x, cy: y, r }, gp);
    // Fundorte aus der Literatur als Rauten
    const glp = el("g", { class: "litpts" }, svg), rr = r * 1.5;
    for (const [x, y, p] of litPts(L)) {
      const d = el("path", { d: `M${x} ${y - rr}L${x + rr} ${y}L${x} ${y + rr}L${x - rr} ${y}Z` }, glp);
      el("title", {}, d).textContent = `${p[2]}\nQuelle: ${(L.q[p[3]] || [""])[0]}`;
    }
    if (hist.length) {
      const fs = vb.w / 55, gt = el("g", { class: "lbl hist-lbl" }, svg);
      for (const [name, ccs] of hist) {
        const cs = ccs.map((c) => M.c[c]).filter(Boolean); if (!cs.length) continue;
        const x = cs.reduce((a, c) => a + c[0], 0) / cs.length, y = cs.reduce((a, c) => a + c[1], 0) / cs.length;
        const tx = el("text", { x, y: y + fs * 1.2, "font-size": fs, "text-anchor": "middle" }, gt); tx.textContent = "„" + name + "“";
      }
    }
    // Ländernamen im Ausschnitt
    if (view === "region" && box) {
      const fs = vb.w / (vb.w / vb.h > 1.5 ? 60 : 44), gt = el("g", { class: "lbl" }, svg);
      const labels = [...ok].filter((cc) => M.c[cc]).map((cc) => [cc, M.c[cc]])
        .filter(([, [x, y]]) => x > vb.x + vb.w * 0.04 && x < vb.x + vb.w * 0.96 && y > vb.y + vb.h * 0.06 && y < vb.y + vb.h * 0.96);
      for (const [cc, [x, y]] of labels.slice(0, 30)) {
        const name = cname(cc), half = name.length * fs * 0.3, pad = vb.w * 0.01;
        const xx = Math.min(Math.max(x, vb.x + pad + half), vb.x + vb.w - pad - half);
        const t = el("text", { x: xx, y, "font-size": fs, "text-anchor": "middle" }, gt); t.textContent = name;
      }
      // Übersichtskarte unten links mit Rahmen um den Ausschnitt
      const iw = vb.w * 0.28, ih = iw * WORLD.h / WORLD.w, ix = vb.x + vb.w * 0.015, iy = vb.y + vb.h - ih - vb.h * 0.025, k = iw / WORLD.w;
      const gi = el("g", { class: "inset", transform: `translate(${ix} ${iy}) scale(${k}) translate(${-WORLD.x} ${-WORLD.y})` }, svg);
      // Inhalt genau auf den Rahmen der Übersichtskarte zuschneiden (sonst ragen Antarktis und Pazifik heraus)
      const cid = "inset-clip-" + (++clipNr);
      const cp = el("clipPath", { id: cid, clipPathUnits: "userSpaceOnUse" }, el("defs", {}, gi));
      el("rect", { x: WORLD.x, y: WORLD.y, width: WORLD.w, height: WORLD.h }, cp);
      el("rect", { x: WORLD.x, y: WORLD.y, width: WORLD.w, height: WORLD.h, class: "isea" }, gi);
      const gic = el("g", { "clip-path": `url(#${cid})` }, gi);
      const gil = el("g", { class: "land" }, gic);
      for (const cc in M.p) el("path", { d: M.p[cc], class: ok.has(cc) ? "ok" : "" }, gil);
      el("rect", { x: box.x, y: box.y, width: box.w, height: box.h, class: "iframe" }, gic);
      el("rect", { x: WORLD.x, y: WORLD.y, width: WORLD.w, height: WORLD.h, class: "iborder" }, gi);
    }
    return svg;
  }

  // Kasten "Aus der Fachliteratur" unter der Karte
  function litBox(L) {
    const d = document.createElement("div"); d.className = "lit-orte";
    const q = (i) => { const x = L.q[i]; return x ? ` <a class="lit-q" href="${esc(x[1])}" target="_blank" rel="noopener" title="${esc(x[0])}">📄 ${esc(x[0].split(" - ")[0].split(" – ")[0])}</a>` : ""; };
    let h = `<h4 class="d-sub">📚 Aus der Fachliteratur</h4><dl>`;
    if (L.t) h += `<dt>Typusfundort</dt><dd>„${esc(L.t[0])}“${q(L.t[1])}</dd>`;
    if (L.v) h += `<dt>Verbreitung</dt><dd>„${esc(L.v[0])}“${q(L.v[1])}</dd>`;
    if (L.h) h += `<dt>Frühere Gebietsnamen</dt><dd>${Object.entries(L.h).map(([n, c]) => `<b>${esc(n)}</b> – heute ${c.map(cname).join(", ")}`).join("<br>")}<br><span class="muted small">Die Angabe stammt aus einer Zeit mit anderen Ländern und Grenzen; auf der Karte schraffiert.</span></dd>`;
    if (L.p.length) h += `<dt>Fundorte mit Koordinaten <small>${L.p.length}</small></dt><dd><details><summary>Liste anzeigen</summary><ul class="lit-pl">${L.p.map((p) => `<li>${esc(p[2])} <span class="muted">(${p[0].toFixed(2)}, ${p[1].toFixed(2)})</span>${q(p[3])}</li>`).join("")}</ul></details></dd>`;
    h += `</dl><p class="muted small">Automatisch aus ${L.q.length} ${L.q.length === 1 ? "Artikel" : "Artikeln"} der Literatursammlung ausgelesen (Abschnitt zur Art mit Belegangaben). Texterkennung alter Drucke kann Fehler enthalten.</p>`;
    d.innerHTML = h; return d;
  }

  async function fill(k) {
    const box = document.getElementById("d-map");
    if (!box) return;
    const s = BYKEY.get(String(k));
    try { await Promise.all([loadScript("data/weltkarte.js"), loadScript("data/fundorte.js")]); }
    catch (e) { box.innerHTML = `<p class="muted">Karte konnte nicht geladen werden.</p>`; return; }
    try { await loadScript("data/literaturorte.js"); } catch (e) { /* ohne Literaturangaben */ }
    const L = LIT(s.k);
    const pts = cells(s.k), lp = litPts(L).map(([x, y]) => [x, y]);
    if (!pts.length && !lp.length && !(s.ct || []).length && !(s.cq || []).length && !(L && (L.c.length || L.h))) {
      box.innerHTML = `<p class="muted">Für diese Art sind keine Fundorte mit Koordinaten oder Länderangaben bekannt.</p>`; return;
    }
    const aspect = box.clientWidth < 520 ? 1.25 : 1.75;
    const sx = Object.assign({}, s, { ct: [...new Set([...(s.ct || []), ...((L && L.c) || []), ...Object.values((L && L.h) || {}).flat()])] });
    const region = fitBox([...pts, ...lp], sx, aspect);
    let view = region ? "region" : "world";
    const render = () => {
      box.innerHTML = "";
      const head = document.createElement("div");
      head.className = "map-tools";
      head.innerHTML = `<span class="seg" role="group" aria-label="Kartenausschnitt">
          <button type="button" data-v="region" aria-pressed="${view === "region"}" ${region ? "" : "disabled"}>Fundgebiet</button>
          <button type="button" data-v="world" aria-pressed="${view === "world"}">Weltkarte</button></span>
        <button type="button" class="map-full" title="Karte groß anzeigen">⛶</button>`;
      box.appendChild(head);
      const wrap = document.createElement("div"); wrap.className = "map-wrap"; box.appendChild(wrap);
      wrap.appendChild(draw(region, s, view, pts, L));
      const leg = document.createElement("p");
      leg.className = "map-legend";
      leg.innerHTML = `<span><i class="lg-ok"></i>Land mit Nachweisen</span>${(s.cq || []).length ? `<span><i class="lg-q"></i>fragliche Meldung</span>` : ""}
        ${pts.length ? `<span><i class="lg-pt"></i>Fundorte (${fmt.format(pts.length)} Rasterfelder à ca. 80 km)</span>` : lp.length ? "" : `<span class="muted">keine Fundorte mit Koordinaten, nur Länder</span>`}
        ${lp.length ? `<span><i class="lg-lit"></i>Fundorte aus der Fachliteratur (${fmt.format(lp.length)})</span>` : ""}
        ${L && L.c.some((c) => !(s.ct || []).includes(c)) ? `<span><i class="lg-litc"></i>Land nur in der Literatur genannt</span>` : ""}
        ${L && L.h ? `<span><i class="lg-hist"></i>früheres Gebiet: ${Object.entries(L.h).map(([n, c]) => `„${esc(n)}“ (heute ${c.map(cname).join(", ")})`).join("; ")} – damals andere Namen und Grenzen</span>` : ""}`;
      box.appendChild(leg);
      if (L) box.appendChild(litBox(L));
    };
    render();
    box.onclick = (e) => {
      const b = e.target.closest("button[data-v]");
      if (b && !b.disabled) { view = b.dataset.v; render(); return; }
      if (e.target.closest(".map-full")) {
        const ov = document.createElement("div");
        ov.className = "map-overlay";
        ov.innerHTML = `<div class="map-ov-head"><b><i>${esc(s.n)}</i></b><button type="button" class="close" aria-label="Schließen">×</button></div>`;
        ov.appendChild(draw(region, s, view, pts, L));
        ov.addEventListener("click", (ev) => { if (ev.target.closest(".close") || ev.target === ov) ov.remove(); });
        (document.getElementById("detail").open ? document.getElementById("detail") : document.body).appendChild(ov);
      }
    };
  }
  document.addEventListener("mantodea:detail", (e) => fill(e.detail));
})();
