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

  function draw(box, s, view, pts) {
    const M = window.MANTODEA_MAP;
    const ok = new Set(s.ct || []), q = new Set(s.cq || []);
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
      const p = el("path", { d: M.p[cc], class: ok.has(cc) ? "ok" : q.has(cc) ? "q" : "" }, gl);
      const t = el("title", {}, p); t.textContent = cname(cc) + (ok.has(cc) ? " – Nachweise vorhanden" : q.has(cc) ? " – fragliche Einzelmeldung" : "");
    }
    // Fundpunkte: Größe passt sich dem Ausschnitt an
    const r = Math.max(vb.w / 420, 0.36 * S);
    const gp = el("g", { class: "pts" }, svg);
    for (const [x, y] of pts) el("circle", { cx: x, cy: y, r }, gp);
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
      el("rect", { x: WORLD.x, y: WORLD.y, width: WORLD.w, height: WORLD.h, class: "isea" }, gi);
      const gil = el("g", { class: "land" }, gi);
      for (const cc in M.p) el("path", { d: M.p[cc], class: ok.has(cc) ? "ok" : "" }, gil);
      el("rect", { x: box.x, y: box.y, width: box.w, height: box.h, class: "iframe" }, gi);
    }
    return svg;
  }

  async function fill(k) {
    const box = document.getElementById("d-map");
    if (!box) return;
    const s = BYKEY.get(String(k));
    try { await Promise.all([loadScript("data/weltkarte.js"), loadScript("data/fundorte.js")]); }
    catch (e) { box.innerHTML = `<p class="muted">Karte konnte nicht geladen werden.</p>`; return; }
    const pts = cells(s.k);
    if (!pts.length && !(s.ct || []).length && !(s.cq || []).length) {
      box.innerHTML = `<p class="muted">Für diese Art sind keine Fundorte mit Koordinaten oder Länderangaben bekannt.</p>`; return;
    }
    const aspect = box.clientWidth < 520 ? 1.25 : 1.75;
    const region = fitBox(pts, s, aspect);
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
      wrap.appendChild(draw(region, s, view, pts));
      const leg = document.createElement("p");
      leg.className = "map-legend";
      leg.innerHTML = `<span><i class="lg-ok"></i>Land mit Nachweisen</span>${(s.cq || []).length ? `<span><i class="lg-q"></i>fragliche Meldung</span>` : ""}
        ${pts.length ? `<span><i class="lg-pt"></i>Fundorte (${fmt.format(pts.length)} Rasterfelder à ca. 80 km)</span>` : `<span class="muted">keine Fundorte mit Koordinaten, nur Länder</span>`}`;
      box.appendChild(leg);
    };
    render();
    box.onclick = (e) => {
      const b = e.target.closest("button[data-v]");
      if (b && !b.disabled) { view = b.dataset.v; render(); return; }
      if (e.target.closest(".map-full")) {
        const ov = document.createElement("div");
        ov.className = "map-overlay";
        ov.innerHTML = `<div class="map-ov-head"><b><i>${esc(s.n)}</i></b><button type="button" class="close" aria-label="Schließen">×</button></div>`;
        ov.appendChild(draw(region, s, view, pts));
        ov.addEventListener("click", (ev) => { if (ev.target.closest(".close") || ev.target === ov) ov.remove(); });
        (document.getElementById("detail").open ? document.getElementById("detail") : document.body).appendChild(ov);
      }
    };
  }
  document.addEventListener("mantodea:detail", (e) => fill(e.detail));
})();
