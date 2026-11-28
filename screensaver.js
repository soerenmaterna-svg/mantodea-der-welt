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
  // Alle Bilder: Titelbilder, Galerien, Fotos aus dem Netz (frei und – wenn gewünscht – ©), unbestimmte Funde, auch fossile Arten.
  // Jedes Foto nur einmal (gleiche Adresse/gleiches iNaturalist-Foto zählt als eins). Bereits gezeigte Fotos werden im Browser
  // gemerkt und kommen erst wieder, wenn alle Fotos der Auswahl einmal gezeigt wurden – auch über mehrere Diashows hinweg.
  const RM = window.MANTODEA_REMOTE || {};
  const RMU = RM.u || {};
  const hasTitle = (s) => !!((s.p && s.p.b != null) || (RM[s.k] && RM[s.k].f));
  const NETZ = {}, UNFREI = {};
  for (const [k, arr] of Object.entries((window.MANTODEA_NETZ || {}).fotos || {})) for (const x of arr) ((x.frei ? NETZ : UNFREI)[k] = (x.frei ? NETZ : UNFREI)[k] || []).push(x);
  for (const [k, arr] of Object.entries(window.MANTODEA_UNFREI || {})) for (const x of arr) (UNFREI[k] = UNFREI[k] || []).push(x);
  const unfreiAn = () => { try { return localStorage.getItem("mantodea-unfrei") !== "0"; } catch (e) { return true; } };
  const groesser = (u) => (u || "").replace(/\/full\/\^?\d+,\//, "/full/^1600,/");
  const pool = UI.DATA.filter((s) => hasTitle(s) || ((RM[s.k] || {}).g || []).length || NETZ[s.k] || UNFREI[s.k]);
  // unbestimmte Funde (nur bis zur Gattung oder Familie bestimmt) als eigene Einträge
  let UNB = [];
  const buildUnb = () => (window.MANTODEA_UNBESTIMMT || []).filter((o) => RMU[o.k] && !/artificially-generated/.test(RMU[o.k])).map((o) => ({
    s: { k: o.k, n: o.t || "Mantodea", de: (o.tn ? o.tn + " – " : "") + "unbestimmter Fund", ct: [], unb: true },
    url: RMU[o.k], by: o.p && o.p.by, l: o.p && o.p.l, q: (o.p && o.p.src) || "iNaturalist", ref: o.p && o.p.ref, pl: o.pl }));
  // die Liste der unbestimmten Funde wird sonst erst in ihrer Ansicht geladen
  if (window.MANTODEA_UNBESTIMMT) UNB = buildUnb();
  else if (UI.loadScript) UI.loadScript("data/unbestimmt.js").then(() => { UNB = buildUnb(); }).catch(() => {});
  const weight = (s) => (s.p && s.p.front ? 4 : 1) + Math.min(4, Math.log10(1 + (s.io || 0)));
  let order = [], pos = -1, timer = null, cur = 0, running = false, paused = false, endTimer = null, lock = null;
  // ---------- Einstellungen: welche Fotos (gespeichert im Browser)
  // bilder: "alle" = alle Fotos, "titel" = nur ein Titelbild je Art, "weibchen" = nur Titelbilder adulter Weibchen
  const F0 = { cont: "", land: "", fam: "", gen: "", abc: "", bilder: "alle", uf: null, unb: true, order: "zufall", speed: 8 };
  let F = { ...F0 };
  const loadF = (o) => { const r = { ...F0, ...o }; if (o && o.front && !o.bilder) r.bilder = "alle"; delete r.front; return r; };
  try { F = loadF(JSON.parse(localStorage.getItem("mantodea-ss") || "{}")); } catch (e) { /* egal */ }
  const ufAn = () => (F.uf == null ? unfreiAn() : !!F.uf);
  const coll = new Intl.Collator("de");
  const taxFilter = (f) => !!(f.cont || f.land || f.fam || f.gen || f.abc);
  const match = (s, f) => (!f.cont || (s.c || []).includes(f.cont)) && (!f.land || (s.ct || []).includes(f.land)) &&
    (!f.fam || s.f === f.fam) && (!f.gen || s.g === f.gen) && (!f.abc || s.n[0].toUpperCase() === f.abc) &&
    (f.bilder !== "weibchen" || !!(s.p && s.p.front)) && (f.bilder !== "titel" || hasTitle(s));
  // Schlüssel eines Fotos: gleiches iNaturalist-Foto in anderer Größe oder unter anderer Adresse zählt als dasselbe
  function imgKey(u) {
    u = String(u || "");
    const m = u.match(/(?:inaturalist[^/]*\/photos|static\.inaturalist\.org\/photos)\/(\d+)\//);
    if (m) return "i" + m[1];
    return u.replace(/^https?:\/\//, "").replace(/\/full\/\^?\d+,\//, "/full/").replace(/\/(\d+)px-[^/]+$/, "").replace(/_[a-z]\.(jpe?g|png)$/i, ".$1").replace(/[?#].*$/, "");
  }
  function hash(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
  // gezeigte Fotos (Kurzschlüssel), im Browser gespeichert
  const SEEN_KEY = "mantodea-ss-gesehen";
  let seen = new Set();
  try { seen = new Set((localStorage.getItem(SEEN_KEY) || "").split(" ").filter(Boolean)); } catch (e) { /* egal */ }
  let seenDirty = 0;
  const saveSeen = () => { seenDirty = 0; try { localStorage.setItem(SEEN_KEY, [...seen].join(" ")); } catch (e) { /* Speicher voll: egal */ } };
  function itemsOf(s) {
    const out = [], r = RM[s.k] || {};
    if (hasTitle(s)) out.push({ s, title: true, url: r.f, key: r.f ? imgKey(r.f) : "t:" + s.k });
    if (F.bilder !== "alle") return out;            // nur Titelbilder
    for (const x of r.g || []) if (x && x[0]) out.push({ s, url: x[0], by: x[1], l: x[2], q: x[3], ref: x[4] });
    for (const x of NETZ[s.k] || []) if (x.u || x.big) out.push({ s, url: groesser(x.u) || x.big, by: x.by, l: x.l, q: x.src || "Quelle", ref: x.ref });
    if (ufAn()) for (const x of UNFREI[s.k] || []) if (x.u || x.big) out.push({ s, url: x.big || x.u, by: x.by, l: "©", q: x.src || "iNaturalist", ref: x.ref, uf: true });
    return out;
  }
  // alle Fotos der Auswahl, jedes nur einmal
  function collect(list, withUnb) {
    const done = new Set(), out = [];
    const take = (it) => { const k = it.key || imgKey(it.url); if (done.has(k)) return; done.add(k); it.h = hash(k); out.push(it); };
    for (const s of list) itemsOf(s).forEach(take);
    if (withUnb) UNB.forEach((it) => take({ ...it }));
    return out;
  }
  const selection = () => { const sel = pool.filter((s) => match(s, F)); return sel.length ? sel : pool; };
  const useUnb = () => F.unb && F.bilder === "alle" && !taxFilter(F);
  function shuffle() {
    const list = selection();
    let all = collect(list, useUnb());
    if (!all.length) return all;
    if (F.order === "abc" || F.order === "gattung") {
      const cmp = F.order === "abc" ? (a, b) => coll.compare(a.s.n, b.s.n) : (a, b) => coll.compare(a.s.f || "~", b.s.f || "~") || coll.compare(a.s.g || "~", b.s.g || "~") || coll.compare(a.s.n, b.s.n);
      all = all.map((it, i) => [it, i]).sort((x, y) => cmp(x[0], y[0]) || x[1] - y[1]).map((x) => x[0]);
    } else {
      // zufällig, schöne Titelbilder etwas bevorzugt
      all = all.map((it) => [it, Math.random() * (it.title ? weight(it.s) : 1.5)]).sort((x, y) => y[1] - x[1]).map((x) => x[0]);
    }
    // noch nicht gezeigte Fotos zuerst; sind alle schon gezeigt, beginnt die Runde für diese Auswahl von vorn
    let fresh = all.filter((it) => !seen.has(it.h));
    if (!fresh.length) { all.forEach((it) => seen.delete(it.h)); saveSeen(); fresh = all; }
    const res = fresh.length === all.length ? all : fresh.concat(all.filter((it) => seen.has(it.h)));
    if (F.order === "zufall") for (let i = 1; i < res.length; i++) {   // gleiche Art direkt hintereinander? mit einem späteren Foto tauschen
      if (res[i].s !== res[i - 1].s) continue;
      for (let j = i + 1; j < Math.min(res.length, i + 60); j++) if (res[j].s !== res[i - 1].s) { const t = res[i]; res[i] = res[j]; res[j] = t; break; }
    }
    return res;
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
    const items = n ? collect(pool.filter((s) => match(s, F)), useUnb()) : [];
    const tot = items.length, neu = items.filter((it) => !seen.has(it.h)).length;
    panel.innerHTML = `<div class="ss-set-head"><b>⚙ Welche Fotos sollen gezeigt werden?</b><button type="button" data-set="close" aria-label="Schließen">×</button></div>
      <div class="ss-set-grid">
        <label>Kontinent<select data-f="cont">${opts(UI.CONT_ORDER.filter((c) => c !== "NONE").map((c) => [c, UI.CONT[c]]), F.cont, "alle Kontinente")}</select></label>
        <label>Land<select data-f="land">${opts(Object.keys(landC).sort((a, b) => coll.compare(UI.cname(a), UI.cname(b))).map((c) => [c, `${UI.cname(c)} (${landC[c]})`]), F.land, "alle Länder")}</select></label>
        <label>Familie<select data-f="fam">${opts(Object.keys(famC).sort(coll.compare).map((f) => [f, `${f} (${famC[f]})`]), F.fam, "alle Familien")}</select></label>
        <label>Gattung<select data-f="gen">${opts(Object.keys(genC).sort(coll.compare).map((g) => [g, `${g} (${genC[g]})`]), F.gen, "alle Gattungen")}</select></label>
        <label>Anfangsbuchstabe<select data-f="abc">${opts(Object.keys(abcC).sort().map((l) => [l, `${l} (${abcC[l]})`]), F.abc, "alle Buchstaben")}</select></label>
        <label>Reihenfolge<select data-f="order">${[["zufall", "zufällig (schönste zuerst)"], ["abc", "Artname A–Z"], ["gattung", "nach Familie und Gattung"]].map(([v, t]) => `<option value="${v}"${v === F.order ? " selected" : ""}>${t}</option>`).join("")}</select></label>
        <label>Anzeigedauer<select data-f="speed">${[5, 8, 12, 20, 30].map((v) => `<option value="${v}"${v == F.speed ? " selected" : ""}>${v} Sekunden</option>`).join("")}</select></label>
        <label class="wide">Bilder<select data-f="bilder">${[["alle", "alle Fotos (Titelbilder, Galerien, Netzfotos)"], ["titel", "nur Titelbilder (eins je Art)"], ["weibchen", "nur Titelbilder adulter Weibchen"]].map(([v, t]) => `<option value="${v}"${v === F.bilder ? " selected" : ""}>${t}</option>`).join("")}</select></label>
        <label class="chk"><input type="checkbox" data-f="uf"${ufAn() ? " checked" : ""}${F.bilder !== "alle" ? " disabled" : ""}> auch nicht frei lizenzierte Fotos (©)</label>
        <label class="chk"><input type="checkbox" data-f="unb"${F.unb ? " checked" : ""}${F.bilder !== "alle" || taxFilter(F) ? " disabled" : ""}> auch unbestimmte Funde (${UNB.length})${taxFilter(F) ? " – nur ohne Kontinent-, Land- und Artfilter" : ""}</label>
      </div>
      <div class="ss-set-foot"><span>${n ? `${n.toLocaleString("de-DE")} Arten · ${tot.toLocaleString("de-DE")} Fotos, jedes nur einmal<br>${neu === tot ? "noch keins davon gezeigt" : neu ? `${neu.toLocaleString("de-DE")} noch nicht gezeigt` : "alle schon gezeigt – die nächste Runde beginnt von vorn"}` : "Keine Fotos für diese Auswahl – es werden alle gezeigt"}</span>
        ${neu < tot ? `<button type="button" data-set="seen" title="Bereits gezeigte Fotos vergessen und wieder von vorn beginnen">Von vorn</button>` : ""}
        <button type="button" data-set="reset">Zurücksetzen</button><button type="button" class="ok" data-set="ok">Übernehmen</button></div>`;
  }
  let wasPaused = null;
  panel.addEventListener("click", (e) => { e.stopPropagation(); const b = e.target.closest("[data-set]"); if (!b) return;
    if (b.dataset.set === "reset") { F = { ...F0 }; drawPanel(); return; }
    if (b.dataset.set === "seen") { collect(selection(), useUnb()).forEach((it) => seen.delete(it.h)); saveSeen(); drawPanel(); return; }
    panel.hidden = true;
    if (b.dataset.set === "ok") { try { localStorage.setItem("mantodea-ss", JSON.stringify(F)); } catch (err) { /* egal */ } order = shuffle(); paused = false; setPause(false); show(0); return; }
    if (wasPaused === false) setPause(false); });
  panel.addEventListener("change", (e) => { const el = e.target.closest("[data-f]"); if (!el) return;
    const k = el.dataset.f; F[k] = el.type === "checkbox" ? el.checked : el.value;
    if (k === "speed") F.speed = +F.speed || 8;
    if (k === "fam") F.gen = ""; if (k === "cont") F.land = ""; drawPanel(); });
  const place = (s) => {
    if (!s.ct || !s.ct.length) return "";
    const first = UI.cname(s.ct[0]);
    return s.ct.length > 1 ? `${first} u. a.` : first;
  };
  async function show(i) {
    if (!running) return;
    if (i >= order.length) { order = shuffle(); i = 0; }   // Runde zu Ende: neu mischen, Ungezeigtes zuerst
    if (!order.length) return;
    pos = (i + order.length) % order.length;
    const it = order[pos], s = it.s, my = pos;
    let src;
    try { src = it.url || await UI.bigSrc(s); } catch (e) { src = null; }
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
      if (it.h && !seen.has(it.h)) { seen.add(it.h); if (++seenDirty >= 5) saveSeen(); }
      const land = (UI.ortOf && UI.ortOf(it.ref || (s.p && s.p.ref))) || it.pl || place(s);
      document.getElementById("ss-name").innerHTML = `<i>${UI.esc(s.n)}</i>${s.de || s.en ? ` · ${UI.esc(s.de || s.en)}` : ""}${land ? `<span class="ss-land">📍 ${UI.esc(land)}</span>` : ""}`;
      const c = it.url ? { by: it.by, l: it.l, src: it.q } : s.p;
      if (it.uf) { document.getElementById("ss-credit").textContent = `© ${c.by || "Fotograf"} · alle Rechte vorbehalten · ${c.src}`; }
      else
      document.getElementById("ss-credit").textContent = `Foto: ${c.by || "siehe Quelle"} · ${LIC[c.l] || c.l} · ${c.src || "iNaturalist"}`;
      // nächstes Foto schon vorladen
      const nx = order[(pos + 1) % order.length]; if (nx) (nx.url ? Promise.resolve(nx.url) : UI.bigSrc(nx.s)).then((u) => { if (u) { const p = new Image(); p.src = u; } }).catch(() => {});
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
  document.addEventListener("visibilitychange", () => { if (running && document.visibilityState === "visible") keepAwake(); if (document.visibilityState === "hidden" && seenDirty) saveSeen(); });
  window.addEventListener("pagehide", () => { if (seenDirty) saveSeen(); });
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
    running = false; clearTimeout(timer); clearTimeout(endTimer); saveSeen();
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
    const s = order[pos] && order[pos].s; if (!s || s.unb) return;   // unbestimmte Funde haben keinen Steckbrief
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
      <p class="tv-note">Am Fernseher muss nichts installiert werden – es genügt eine Funktion, die die meisten Smart-TVs schon eingebaut haben:</p>
      <ul class="tv-list">
        <li class="tv-best"><b>Am einfachsten – Browser des Fernsehers</b> (vorinstalliert, geht mit jedem Smart-TV): diese kurze Adresse eintippen und als Lesezeichen speichern – die Diashow startet von selbst:<br><a href="${UI.esc(TV_URL)}tv" target="_blank" rel="noopener" class="tv-url">${UI.esc(TV_URL.replace("https://", ""))}tv</a></li>
        <li><b>Chromecast eingebaut</b> (Google TV, Android TV, viele Sony, Philips, TCL, Hisense): in Chrome oder Edge ⋮ → <i>Streamen…</i> → Fernseher wählen.</li>
        <li><b>AirPlay eingebaut</b> (Apple TV, viele Samsung, LG, Sony, Philips ab 2019): iPhone/iPad/Mac → Kontrollzentrum → <i>Bildschirmsynchronisierung</i>.</li>
        <li><b>Bildschirmspiegelung / Miracast</b> (fast alle Smart-TVs, z. B. Samsung „Smart View“, LG „Screen Share“): Android → <i>Bildschirm übertragen</i>, Windows → <kbd>Win</kbd> + <kbd>K</kbd>.</li>

      </ul>`;
    tvPanel.hidden = false;
  }
  tvPanel.addEventListener("click", (e) => { e.stopPropagation(); if (e.target.closest("[data-tv=close]")) { tvPanel.hidden = true; if (wasPausedTV === false) setPause(false); } });
  let wasPausedTV = null, conn = null;
  async function castTV() {
    wasPausedTV = paused;
    // Innerhalb von claude.ai läuft die Seite in einem abgeschirmten Rahmen, dort darf der Browser keine Fernseher suchen.
    // Dann die GitHub-Fassung in einem neuen Tab öffnen, dort erscheint der Knopf zum Übertragen sofort.
    if (!window.MANTODEA_STANDALONE) {
      setPause(true);
      tvPanel.innerHTML = `<div class="ss-set-head"><b>📺 Diashow auf dem Fernseher</b><button type="button" data-tv="close" aria-label="Schließen">×</button></div>
        <p class="tv-note">Auf claude.ai darf der Browser aus Sicherheitsgründen keine Fernseher suchen. Die Übertragung startet deshalb auf der GitHub-Fassung der Seite:</p>
        <p><a class="tv-go" href="${UI.esc(tvUrl().replace("#diashow", "") + "&cast=1")}" target="_blank" rel="noopener">📺 Diashow öffnen und übertragen ↗</a></p>`;
      tvPanel.hidden = false; return;
    }
    if (window.PresentationRequest) {
      try {
        const req = new PresentationRequest([tvUrl()]);
        // erst prüfen, ob überhaupt ein Fernseher erreichbar ist – sonst nicht das leere Chrome-Fenster zeigen
        let avail = null;
        try { avail = await Promise.race([req.getAvailability(), new Promise((r) => setTimeout(() => r(null), 2500))]); } catch (e) { avail = null; }
        if (!avail || !avail.value) { setPause(true); tvHelp("In Ihrem WLAN wurde kein Fernseher gefunden, an den der Browser direkt senden kann. So geht es trotzdem – am einfachsten mit dem Browser des Fernsehers:"); return; }
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
      if (q) F = loadF(JSON.parse(q));
      setTimeout(() => {
        start();
        if (new URLSearchParams(location.search).get("cast") === "1") {
          setPause(true);
          tvPanel.innerHTML = `<div class="ss-set-head"><b>📺 Auf den Fernseher übertragen</b><button type="button" data-tv="close" aria-label="Schließen">×</button></div>
            <p class="tv-note">Antippen, dann den Fernseher in der Liste wählen:</p><p><button type="button" class="tv-go" data-tv="go">📺 Fernseher suchen</button></p>`;
          tvPanel.hidden = false;
          tvPanel.querySelector("[data-tv=go]").onclick = (ev) => { ev.stopPropagation(); tvPanel.hidden = true; castTV(); };
        }
      }, 600);
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
