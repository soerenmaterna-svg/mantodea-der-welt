// Bildschirmschoner: startet sofort, zeigt die größten verfügbaren Fotos (Titelbilder der Arten) als Vollbild-Diashow.
// Fußleiste: Artname mit Land, dazu Zurück, Pause, Vor, Stopp. Hält den Bildschirm wach und endet nach einer Stunde.
(() => {
  "use strict";
  const UI = window.MANTODEA_UI;
  const box = document.getElementById("ss"), btn = document.getElementById("ss-btn");
  if (!UI || !box || !btn) return;
  const layers = [...box.querySelectorAll(".ss-layer")];
  layers.forEach((L) => { L.innerHTML = `<div class="ss-bg"></div><div class="ss-fg"></div>`; });
  const LIC = { "cc0": "CC0", "pd": "Public Domain", "cc-by": "CC BY", "cc-by-sa": "CC BY-SA", "cc-by-nd": "CC BY-ND", "cc-by-nc": "CC BY-NC", "cc-by-nc-sa": "CC BY-NC-SA", "cc-by-nc-nd": "CC BY-NC-ND" };
  const SHOW = 8000, MAX_MS = 60 * 60 * 1000;
  // schöne Auswahl zuerst: adulte Weibchen und häufig beobachtete Arten
  const pool = UI.DATA.filter((s) => s.p && s.p.b != null && !s.x);
  const weight = (s) => (s.p.front ? 4 : 1) + Math.min(4, Math.log10(1 + (s.io || 0)));
  let order = [], pos = -1, timer = null, cur = 0, running = false, paused = false, endTimer = null, lock = null;
  function shuffle() {
    const a = pool.map((s) => [s, Math.random() * weight(s)]).sort((x, y) => y[1] - x[1]).map((x) => x[0]);
    return a;
  }
  const place = (s) => {
    if (!s.ct || !s.ct.length) return "";
    const first = UI.cname(s.ct[0]);
    return s.ct.length > 1 ? `${first} u. a.` : first;
  };
  async function show(i) {
    if (!running) return;
    pos = (i + order.length) % order.length;
    const s = order[pos], my = pos;
    let src;
    try { src = await UI.bigSrc(s); } catch (e) { src = null; }
    if (!running || my !== pos) return;
    if (!src) { schedule(300); return; }
    const img = new Image();
    img.onload = () => {
      if (!running || my !== pos) return;
      cur = 1 - cur;
      const L = layers[cur];
      L.querySelector(".ss-bg").style.backgroundImage = `url("${src}")`;
      L.querySelector(".ss-fg").style.backgroundImage = `url("${src}")`;
      L.classList.remove("zoom"); void L.offsetWidth; L.classList.add("zoom");
      L.classList.add("on"); layers[1 - cur].classList.remove("on");
      const land = place(s);
      document.getElementById("ss-name").innerHTML = `<i>${UI.esc(s.n)}</i>${s.de || s.en ? ` · ${UI.esc(s.de || s.en)}` : ""}${land ? `<span class="ss-land">📍 ${UI.esc(land)}</span>` : ""}`;
      document.getElementById("ss-credit").textContent = `Foto: ${s.p.by || "siehe Quelle"} · ${LIC[s.p.l] || s.p.l} · ${s.p.src || "iNaturalist"}`;
      // nächstes Foto schon vorladen
      const nx = order[(pos + 1) % order.length]; UI.bigSrc(nx).then((u) => { if (u) { const p = new Image(); p.src = u; } }).catch(() => {});
      schedule(SHOW);
    };
    img.onerror = () => schedule(300);
    img.src = src;
  }
  function schedule(ms) { clearTimeout(timer); if (!paused) timer = setTimeout(() => show(pos + 1), ms); }
  function setPause(v) {
    paused = v; box.classList.toggle("paused", paused);
    const b = box.querySelector('[data-ss="pause"]'); b.textContent = paused ? "▶︎❚" : "⏸"; b.setAttribute("aria-label", paused ? "Weiter" : "Pause");
    if (paused) clearTimeout(timer); else schedule(1200);
  }
  async function keepAwake() { try { if (navigator.wakeLock) lock = await navigator.wakeLock.request("screen"); } catch (e) { /* nicht erlaubt */ } }
  document.addEventListener("visibilitychange", () => { if (running && document.visibilityState === "visible") keepAwake(); });
  function start() {
    if (!pool.length) return;
    running = true; order = shuffle(); box.hidden = false; document.body.style.overflow = "hidden";
    setPause(false); keepAwake(); clearTimeout(endTimer); endTimer = setTimeout(stop, MAX_MS);
    try { const r = box.requestFullscreen && box.requestFullscreen(); if (r && r.catch) r.catch(() => {}); } catch (e) { /* ohne Vollbild */ }
    show(0);
  }
  function stop() {
    if (!running) return;
    running = false; clearTimeout(timer); clearTimeout(endTimer);
    try { if (lock) lock.release(); } catch (e) { /* egal */ } lock = null;
    box.hidden = true; document.body.style.overflow = "";
    layers.forEach((l) => { l.classList.remove("on", "zoom"); l.querySelectorAll("div").forEach((d) => (d.style.backgroundImage = "")); });
    try { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch (e) { /* egal */ }
  }
  btn.addEventListener("click", start);
  box.querySelector(".ss-nav").addEventListener("click", (e) => {
    e.stopPropagation();
    const b = e.target.closest("[data-ss]"); if (!b) return;
    if (b.dataset.ss === "stop") stop();
    if (b.dataset.ss === "pause") setPause(!paused);
    if (b.dataset.ss === "next") { clearTimeout(timer); show(pos + 1); }
    if (b.dataset.ss === "prev") { clearTimeout(timer); show(pos - 1); }
  });
  document.addEventListener("keydown", (e) => {
    if (!running) return;
    if (e.key === " ") { e.preventDefault(); setPause(!paused); }
    else if (e.key === "ArrowRight") show(pos + 1);
    else if (e.key === "ArrowLeft") show(pos - 1);
    else if (e.key === "Escape") stop();
  });
  document.addEventListener("fullscreenchange", () => { if (running && !document.fullscreenElement) stop(); });
})();
