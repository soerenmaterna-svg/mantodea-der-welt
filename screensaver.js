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
  // ---------- Einstellungen: welche Fotos (gespeichert im Browser)
  const F0 = { cont: "", land: "", fam: "", gen: "", abc: "", front: false, order: "zufall", speed: 8 };
  let F = { ...F0 };
  try { F = { ...F0, ...JSON.parse(localStorage.getItem("mantodea-ss") || "{}") }; } catch (e) { /* egal */ }
  const coll = new Intl.Collator("de");
  const match = (s, f) => (!f.cont || (s.c || []).includes(f.cont)) && (!f.land || (s.ct || []).includes(f.land)) &&
    (!f.fam || s.f === f.fam) && (!f.gen || s.g === f.gen) && (!f.abc || s.n[0].toUpperCase() === f.abc) && (!f.front || s.p.front);
  function shuffle() {
    const sel = pool.filter((s) => match(s, F));
    const list = sel.length ? sel : pool;
    if (F.order === "abc") return [...list].sort((a, b) => coll.compare(a.n, b.n));
    if (F.order === "gattung") return [...list].sort((a, b) => coll.compare(a.f, b.f) || coll.compare(a.g, b.g) || coll.compare(a.n, b.n));
    return list.map((s) => [s, Math.random() * weight(s)]).sort((x, y) => y[1] - x[1]).map((x) => x[0]);
  }
  const panel = document.createElement("div");
  panel.className = "ss-set"; panel.hidden = true;
  box.appendChild(panel);
  const opts = (arr, sel, all) => `<option value="">${all}</option>` + arr.map(([v, t]) => `<option value="${UI.esc(v)}"${v === sel ? " selected" : ""}>${UI.esc(t)}</option>`).join("");
  function drawPanel() {
    const famC = {}, genC = {}, landC = {}, abcC = {};
    pool.filter((s) => match(s, { ...F, fam: "", gen: "" })).forEach((s) => { famC[s.f] = (famC[s.f] || 0) + 1; });
    pool.filter((s) => match(s, { ...F, gen: "" })).forEach((s) => { genC[s.g] = (genC[s.g] || 0) + 1; });
    pool.filter((s) => match(s, { ...F, land: "" })).forEach((s) => (s.ct || []).forEach((c) => (landC[c] = (landC[c] || 0) + 1)));
    pool.filter((s) => match(s, { ...F, abc: "" })).forEach((s) => { const l = s.n[0].toUpperCase(); abcC[l] = (abcC[l] || 0) + 1; });
    const n = pool.filter((s) => match(s, F)).length;
    panel.innerHTML = `<div class="ss-set-head"><b>⚙ Welche Fotos sollen gezeigt werden?</b><button type="button" data-set="close" aria-label="Schließen">×</button></div>
      <div class="ss-set-grid">
        <label>Kontinent<select data-f="cont">${opts(UI.CONT_ORDER.filter((c) => c !== "NONE").map((c) => [c, UI.CONT[c]]), F.cont, "alle Kontinente")}</select></label>
        <label>Land<select data-f="land">${opts(Object.keys(landC).sort((a, b) => coll.compare(UI.cname(a), UI.cname(b))).map((c) => [c, `${UI.cname(c)} (${landC[c]})`]), F.land, "alle Länder")}</select></label>
        <label>Familie<select data-f="fam">${opts(Object.keys(famC).sort(coll.compare).map((f) => [f, `${f} (${famC[f]})`]), F.fam, "alle Familien")}</select></label>
        <label>Gattung<select data-f="gen">${opts(Object.keys(genC).sort(coll.compare).map((g) => [g, `${g} (${genC[g]})`]), F.gen, "alle Gattungen")}</select></label>
        <label>Anfangsbuchstabe<select data-f="abc">${opts(Object.keys(abcC).sort().map((l) => [l, `${l} (${abcC[l]})`]), F.abc, "alle Buchstaben")}</select></label>
        <label>Reihenfolge<select data-f="order">${[["zufall", "zufällig (schönste zuerst)"], ["abc", "Artname A–Z"], ["gattung", "nach Familie und Gattung"]].map(([v, t]) => `<option value="${v}"${v === F.order ? " selected" : ""}>${t}</option>`).join("")}</select></label>
        <label>Anzeigedauer<select data-f="speed">${[5, 8, 12, 20, 30].map((v) => `<option value="${v}"${v == F.speed ? " selected" : ""}>${v} Sekunden</option>`).join("")}</select></label>
        <label class="chk"><input type="checkbox" data-f="front"${F.front ? " checked" : ""}> nur adulte Weibchen</label>
      </div>
      <div class="ss-set-foot"><span>${n ? `${n} Arten mit Foto` : "Keine Fotos für diese Auswahl – es werden alle gezeigt"}</span>
        <button type="button" data-set="reset">Zurücksetzen</button><button type="button" class="ok" data-set="ok">Übernehmen</button></div>`;
  }
  let wasPaused = null;
  panel.addEventListener("click", (e) => { e.stopPropagation(); const b = e.target.closest("[data-set]"); if (!b) return;
    if (b.dataset.set === "reset") { F = { ...F0 }; drawPanel(); return; }
    panel.hidden = true;
    if (b.dataset.set === "ok") { try { localStorage.setItem("mantodea-ss", JSON.stringify(F)); } catch (err) { /* egal */ } order = shuffle(); paused = false; setPause(false); show(0); return; }
    if (wasPaused === false) setPause(false); });
  panel.addEventListener("change", (e) => { const el = e.target.closest("[data-f]"); if (!el) return;
    const k = el.dataset.f; F[k] = el.type === "checkbox" ? el.checked : el.value;
    if (k === "fam") F.gen = ""; if (k === "cont") F.land = ""; drawPanel(); });
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
      const land = (UI.ortOf && UI.ortOf(s.p.ref)) || place(s);
      document.getElementById("ss-name").innerHTML = `<i>${UI.esc(s.n)}</i>${s.de || s.en ? ` · ${UI.esc(s.de || s.en)}` : ""}${land ? `<span class="ss-land">📍 ${UI.esc(land)}</span>` : ""}`;
      document.getElementById("ss-credit").textContent = `Foto: ${s.p.by || "siehe Quelle"} · ${LIC[s.p.l] || s.p.l} · ${s.p.src || "iNaturalist"}`;
      // nächstes Foto schon vorladen
      const nx = order[(pos + 1) % order.length]; UI.bigSrc(nx).then((u) => { if (u) { const p = new Image(); p.src = u; } }).catch(() => {});
      schedule((+F.speed || 8) * 1000);
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
    if (UI.loadOrte) UI.loadOrte();
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
  // Mauszeiger: beim Bewegen sichtbar, nach 2 Sekunden Ruhe wieder ausgeblendet
  let curT = null;
  box.addEventListener("mousemove", () => { box.classList.add("show-cursor"); clearTimeout(curT); curT = setTimeout(() => box.classList.remove("show-cursor"), 2000); });
  // Klick auf den Artnamen unten: Diashow beenden und den Steckbrief der Art öffnen
  const nameEl = document.getElementById("ss-name");
  nameEl.style.cursor = "pointer"; nameEl.title = "Steckbrief dieser Art öffnen";
  nameEl.addEventListener("click", (e) => {
    e.stopPropagation();
    const s = order[pos]; if (!s) return;
    stop();
    setTimeout(() => UI.detail(s.k), 150);
  });
  // ---------- Auf den Fernseher übertragen
  // Chrome/Edge: Präsentations-Schnittstelle (Chromecast, Google TV) – der Fernseher lädt die GitHub-Seite und startet
  // die Diashow mit denselben Einstellungen. Sonst: kurze Anleitung zur Bildschirmspiegelung (AirPlay, Miracast, Chrome „Streamen“).
  const TV_URL = "https://soerenmaterna-svg.github.io/mantodea-der-welt/";
  const tvUrl = () => TV_URL + "?diashow=" + encodeURIComponent(JSON.stringify(F)) + "#diashow";
  const tvPanel = document.createElement("div");
  tvPanel.className = "ss-set ss-tv"; tvPanel.hidden = true; box.appendChild(tvPanel);
  function tvHelp(msg) {
    tvPanel.innerHTML = `<div class="ss-set-head"><b>📺 Diashow auf dem Fernseher</b><button type="button" data-tv="close" aria-label="Schließen">×</button></div>
      ${msg ? `<p class="tv-msg">${UI.esc(msg)}</p>` : ""}
      <ul class="tv-list">
        <li><b>Chromecast / Google TV:</b> in Chrome oder Edge oben rechts ⋮ → <i>Streamen…</i> → Fernseher wählen.</li>
        <li><b>iPhone / iPad / Mac:</b> Kontrollzentrum → <i>Bildschirmsynchronisierung</i> (AirPlay) → Apple TV oder AirPlay-Fernseher.</li>
        <li><b>Android:</b> Schnelleinstellungen → <i>Bildschirm übertragen</i> bzw. <i>Smart View</i>.</li>
        <li><b>Windows:</b> <kbd>Win</kbd> + <kbd>K</kbd> → Fernseher wählen (Miracast).</li>
        <li><b>Smart-TV mit Browser:</b> diese Adresse öffnen, die Diashow startet von selbst:<br><a href="${UI.esc(tvUrl())}" target="_blank" rel="noopener" class="tv-url">${UI.esc(TV_URL)}?diashow</a></li>
      </ul>`;
    tvPanel.hidden = false;
  }
  tvPanel.addEventListener("click", (e) => { e.stopPropagation(); if (e.target.closest("[data-tv=close]")) { tvPanel.hidden = true; if (wasPausedTV === false) setPause(false); } });
  let wasPausedTV = null, conn = null;
  async function castTV() {
    wasPausedTV = paused;
    if (window.PresentationRequest) {
      try {
        const req = new PresentationRequest([tvUrl()]);
        conn = await req.start();      // öffnet die Geräteauswahl des Browsers
        setPause(true);
        tvPanel.innerHTML = `<div class="ss-set-head"><b>📺 Läuft auf dem Fernseher</b><button type="button" data-tv="stop">Übertragung beenden</button></div>`;
        tvPanel.hidden = false;
        tvPanel.querySelector("[data-tv=stop]").onclick = (ev) => { ev.stopPropagation(); try { conn.terminate(); } catch (err) { /* egal */ } tvPanel.hidden = true; setPause(false); };
        conn.onterminate = conn.onclose = () => { tvPanel.hidden = true; };
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;   // Auswahl abgebrochen
        setPause(true); tvHelp("Kein Fernseher gefunden oder Übertragung hier nicht möglich. So geht es trotzdem:"); return;
      }
    }
    setPause(true); tvHelp("");
  }
  // Empfangsseite: ?diashow=… startet die Diashow sofort mit den übergebenen Einstellungen (z. B. auf dem Fernseher)
  try {
    const q = new URLSearchParams(location.search).get("diashow");
    if (q !== null || location.hash === "#diashow") {
      if (q) F = { ...F0, ...JSON.parse(q) };
      setTimeout(start, 600);
    }
  } catch (e) { /* egal */ }
  btn.addEventListener("click", start);
  box.querySelector(".ss-nav").addEventListener("click", (e) => {
    e.stopPropagation();
    const b = e.target.closest("[data-ss]"); if (!b) return;
    if (b.dataset.ss === "stop") stop();
    if (b.dataset.ss === "tv") { castTV(); return; }
    if (b.dataset.ss === "set") { wasPaused = paused; setPause(true); drawPanel(); panel.hidden = false; return; }
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
