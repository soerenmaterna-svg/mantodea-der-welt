(() => {
  "use strict";

  const M = window.MANTODEA || {};
  const DATA = M.species || [];
  const STATUS = M.status || {};
  const PAGE = 96;
  // Versionskennung gegen veraltete Dateien im Browser-Cache (wird bei jedem Lauf in index.html erneuert)
  const VER = (() => { const sc = document.querySelector('script[src*="species.js"]'); const m = sc && sc.src.match(/[?&]v=([^&]+)/); return m ? m[1] : (M.generated || ""); })();
  const vq = (u) => VER ? `${u}${u.includes("?") ? "&" : "?"}v=${encodeURIComponent(VER)}` : u;

  const CONT = {
    AFRICA: "Afrika", ASIA: "Asien", EUROPE: "Europa",
    NORTH_AMERICA: "Nordamerika", SOUTH_AMERICA: "Südamerika", OCEANIA: "Australien & Ozeanien",
    NONE: "ohne Fundortdaten",
  };
  const CONT_ORDER = ["AFRICA", "ASIA", "EUROPE", "NORTH_AMERICA", "SOUTH_AMERICA", "OCEANIA", "NONE"];
  const LIC = {
    "cc0": ["CC0 (gemeinfrei)", "https://creativecommons.org/publicdomain/zero/1.0/deed.de"],
    "pd": ["Public Domain", "https://creativecommons.org/publicdomain/mark/1.0/deed.de"],
    "cc-by": ["CC BY", "https://creativecommons.org/licenses/by/4.0/deed.de"],
    "cc-by-sa": ["CC BY-SA", "https://creativecommons.org/licenses/by-sa/4.0/deed.de"],
    "cc-by-nd": ["CC BY-ND", "https://creativecommons.org/licenses/by-nd/4.0/deed.de"],
    "cc-by-nc": ["CC BY-NC", "https://creativecommons.org/licenses/by-nc/4.0/deed.de"],
    "cc-by-nc-sa": ["CC BY-NC-SA", "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de"],
    "cc-by-nc-nd": ["CC BY-NC-ND", "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.de"],
  };
  const SRC_LINK = {
    COL: (s) => s.col && `https://www.catalogueoflife.org/data/taxon/${encodeURIComponent(s.col)}`,
    GBIF: (s) => s.gk && `https://www.gbif.org/species/${s.gk}`,
    Wikidata: (s) => s.wd && `https://www.wikidata.org/wiki/${s.wd}`,
    iNaturalist: (s) => s.i && `https://www.inaturalist.org/taxa/${s.i}`,
  };
  const SRC_NAME = { COL: "Catalogue of Life", GBIF: "GBIF", Wikidata: "Wikidata", iNaturalist: "iNaturalist" };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const coll = new Intl.Collator("de", { sensitivity: "base" });
  const fmt = new Intl.NumberFormat("de-DE");
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return d; } };

  const NEW = new Set(STATUS.neu_seit_letztem_lauf || []);
  const CCONT = M.countries || {};
  let regionNames = null;
  try { regionNames = new Intl.DisplayNames(["de"], { type: "region" }); } catch (e) { /* alter Browser */ }
  const cname = (cc) => { try { return (regionNames && regionNames.of(cc)) || cc; } catch (e) { return cc; } };
  for (const s of DATA) {
    if (s.p && s.p.b == null) delete s.p;
    s.f = s.f || "(Familie unbekannt)";
    s.sf = s.sf || "(ohne Unterfamilie)";
    s.g = s.g || s.n.split(" ")[0];
    const y = (s.a || "").match(/(1[6-9]\d\d|20\d\d)/);
    s.y = y ? +y[1] : null;
    s.cc = s.c && s.c.length ? s.c : ["NONE"];
    s.ct = s.ct || [];
    s.hay = [s.n, s.a, s.f, s.sf, s.g, s.de, s.en, ...(s.syn || []), ...s.ct.map(cname)].filter(Boolean).join(" ").toLowerCase();
  }
  const BYKEY = new Map(DATA.map((s) => [String(s.k), s]));

  const state = {
    q: "", sort: "name", group: "", family: "", genus: "", license: "", status: "", country: "", corder: "cont",
    conts: new Set(), onlyPhoto: false, hideFossil: true, view: "grid", shown: PAGE,
  };
  try {
    const saved = JSON.parse(localStorage.getItem("mantodea-state") || "{}");
    for (const k of ["sort", "group", "view"]) if (saved[k] != null) state[k] = saved[k];
  } catch (e) { /* egal */ }
  const save = () => { try { localStorage.setItem("mantodea-state", JSON.stringify({ sort: state.sort, group: state.group, view: state.view })); } catch (e) { /* egal */ } };

  // ---------- Kopfzeile
  const fams = [...new Set(DATA.map((s) => s.f))].sort(coll.compare);
  $("stats").innerHTML = [
    [DATA.filter((s) => !s.x).length, "rezente Arten"],
    [new Set(DATA.map((s) => s.g)).size, "Gattungen"],
    [fams.filter((f) => !f.startsWith("(")).length, "Familien"],
    [DATA.filter((s) => s.p).length, "Arten mit Foto"],
  ].map(([n, l]) => `<div><b>${fmt.format(n)}</b><span>${l}</span></div>`).join("");
  if (M.generated) $("generated").textContent = "Datenstand: " + fmtDate(M.generated);

  // ---------- Bilder (gebündelt, bei Bedarf geladen)
  const chunks = {}, waiting = {};
  window.__mantodeaImg = (n, imgs) => { chunks[n] = imgs; (waiting[n] || []).forEach((f) => f()); delete waiting[n]; };
  function loadChunk(n) {
    if (chunks[n]) return Promise.resolve();
    return new Promise((res, rej) => {
      const first = !waiting[n];
      (waiting[n] = waiting[n] || []).push(res);
      if (first) {
        const sc = document.createElement("script");
        sc.src = vq(`data/img/${n}.js`);
        sc.onerror = () => { delete waiting[n]; rej(); };
        document.head.appendChild(sc);
      }
    });
  }
  const RECS = new Map();
  const imgTag = (rec, alt) => { RECS.set(String(rec.k), rec); return `<img data-ik="${esc(rec.k)}" alt="${esc(alt)}" decoding="async">`; };
  // ---------- Eigenständige Fassung (außerhalb von claude.ai): Bilder live von der Quelle, mit Vorausladen
  const SA = !!window.MANTODEA_STANDALONE;
  const RM = window.MANTODEA_REMOTE || { u: {} };
  const smallUrl = (u) => !u ? u : u.replace("/large.", "/medium.").replace(/\/1024px-/, "/500px-").replace(/_b\.(jpg|png)$/, "_z.$1");
  const TITEL = window.MANTODEA_TITEL || {};
  const liveTitle = {};
  const titleRef = (k) => liveTitle[k] || TITEL[k] || null;
  const bigOf = (rec) => {
    if (!rec || !rec.k) return null;
    if (String(rec.k).startsWith("u")) return RM.u[rec.k] || null;
    const r = RM[rec.k] || {}, t = TITEL[rec.k];
    if (t) { const g = (r.g || []).find((x) => x[4] === t); if (g && g[0]) return g[0]; }
    return r.f || null;
  };
  const pre = new Set();
  function prefetch(u) { if (!SA || !u || pre.has(u) || pre.size > 400) return; pre.add(u); const im = new Image(); im.decoding = "async"; im.src = u; }
  function prefetchSpecies(k) {
    if (!SA) return; const r = RM[k]; if (!r) return;
    prefetch(r.f); (r.g || []).forEach((g) => prefetch(g[0]));
  }
  async function fill(img) {
    const rec = RECS.get(img.dataset.ik);
    img.removeAttribute("data-ik");
    if (SA) {
      const u = bigOf(rec);
      if (u) {
        // Reihenfolge: mittlere Größe -> große Größe -> gespeichertes kleines Foto
        const tries = [smallUrl(u), u];
        img.onerror = async () => {
          const next = tries.shift();
          if (next) { img.src = next; return; }
          img.onerror = null;
          try { await loadChunk(rec.p.b); img.src = "data:image/jpeg;base64," + chunks[rec.p.b][rec.k]; } catch (e) { img.replaceWith(Object.assign(document.createElement("div"), { className: "ph", textContent: "Foto konnte nicht geladen werden" })); }
        };
        img.src = tries.shift(); return;
      }
    }
    try {
      const ts = rec.p && !String(rec.k).startsWith("u") ? await titleSrcFor(rec) : null;
      if (ts) { img.src = ts; return; }
      await loadChunk(rec.p.b);
      img.src = "data:image/jpeg;base64," + chunks[rec.p.b][rec.k];
    } catch (e) {
      img.replaceWith(Object.assign(document.createElement("div"), { className: "ph", textContent: "Foto konnte nicht geladen werden" }));
    }
  }
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); fill(e.target); } }), { rootMargin: "400px" })
    : null;
  async function imgData(rec) { if (SA && bigOf(rec)) return smallUrl(bigOf(rec)); await loadChunk(rec.p.b); return "data:image/jpeg;base64," + chunks[rec.p.b][rec.k]; }
  const lazy = (root) => root.querySelectorAll("img[data-ik]").forEach((img) => io ? io.observe(img) : fill(img));

  function credit(p, short) {
    const [lab, url] = LIC[p.l] || [p.l, "#"];
    const src = p.src || "iNaturalist";
    const ref = p.ref || "#";
    if (short) return `Foto: ${esc(p.by || "unbekannt")} · ${esc(lab)} · ${esc(src.length > 40 ? src.slice(0, 38) + "…" : src)}`;
    return `Foto: <a href="${esc(ref)}" target="_blank" rel="noopener">${esc(p.by || "Urheber siehe Quelle")}</a>` +
      ` · Lizenz: <a href="${url}" target="_blank" rel="noopener license">${esc(lab)}</a>` +
      ` · Quelle: <a href="${esc(ref)}" target="_blank" rel="noopener">${esc(src)}</a>`;
  }
  const PLACEHOLDER = `<div class="ph"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M40 10c3 0 5 2 5 5s-2 4-4 4l-4 8 6 4-2 2-6-3-3 7 9 16-3 1-9-14-4 6 2 10h-3l-2-11 5-9-8-6-8 4-1-3 9-5 7 4 4-8-4-6-6 2-1-3 8-2 5 6 4-7c-1-1-1-2-1-3 0-3 2-5 5-5z" fill="currentColor"/></svg><span>Kein frei lizenziertes Foto verfügbar</span></div>`;

  // ---------- Bedienelemente
  $("family").insertAdjacentHTML("beforeend", fams.map((f) => `<option>${esc(f)}</option>`).join(""));
  function fillGenus() {
    const gs = [...new Set(DATA.filter((s) => !state.family || s.f === state.family).map((s) => s.g))].sort(coll.compare);
    $("genus").innerHTML = `<option value="">alle Gattungen (${gs.length})</option>` + gs.map((g) => `<option>${esc(g)}</option>`).join("");
    if (!gs.includes(state.genus)) state.genus = "";
    $("genus").value = state.genus;
  }
  fillGenus();
  const contCounts = {};
  for (const s of DATA) for (const c of s.cc) contCounts[c] = (contCounts[c] || 0) + 1;
  $("continents").innerHTML = CONT_ORDER.map((c) =>
    `<button type="button" class="chip" data-c="${c}" aria-pressed="false">${CONT[c]} <small>${fmt.format(contCounts[c] || 0)}</small></button>`).join("");
  const ctCount = {};
  for (const sp of DATA) if (!sp.x) for (const c of sp.ct) ctCount[c] = (ctCount[c] || 0) + 1;
  const contOf = (cc) => (CCONT[cc] && CONT[CCONT[cc]] ? CCONT[cc] : "NONE");
  // Länderauswahl als Dialog, sortierbar nach Kontinent, Alphabet oder Artenzahl
  function fillCountries() {
    const codes = Object.keys(ctCount);
    $("country").innerHTML = `<option value="">alle Länder</option>` + codes.map((c) => `<option value="${c}">${esc(cname(c))}</option>`).join("");
    $("country").value = state.country;
    $("country-btn").textContent = state.country ? `${cname(state.country)} (${ctCount[state.country] || 0})` : `alle Länder (${codes.length})`;
    $("country-btn").classList.toggle("set", !!state.country);
  }
  function drawCountryList() {
    const q = $("cd-q").value.trim().toLowerCase();
    const codes = Object.keys(ctCount).filter((c) => !q || cname(c).toLowerCase().includes(q) || c.toLowerCase() === q);
    const byName = (a, b) => coll.compare(cname(a), cname(b));
    const item = (c) => `<button type="button" data-cc="${c}" class="${c === state.country ? "on" : ""}"><span>${esc(cname(c))}</span><small>${fmt.format(ctCount[c])}</small></button>`;
    let html = q ? "" : `<button type="button" data-cc="" class="all ${state.country ? "" : "on"}"><span>alle Länder</span><small>${fmt.format(Object.keys(ctCount).length)}</small></button>`;
    if (state.corder === "alpha") {
      let last = "";
      for (const c of codes.sort(byName)) {
        const l = cname(c)[0].toUpperCase();
        if (l !== last) { html += `<h3>${esc(l)}</h3>`; last = l; }
        html += item(c);
      }
    } else if (state.corder === "count") {
      html += codes.sort((a, b) => ctCount[b] - ctCount[a] || byName(a, b)).map(item).join("");
    } else {
      for (const k of CONT_ORDER) {
        const cs = codes.filter((c) => contOf(c) === k).sort(byName);
        if (cs.length) html += `<h3>${esc(k === "NONE" ? "ohne Kontinentzuordnung" : CONT[k])} <small>${cs.length}</small></h3>` + cs.map(item).join("");
      }
    }
    $("cd-list").innerHTML = html || `<p class="muted">Kein Land gefunden.</p>`;
    $("cd-order").querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.o === state.corder)));
  }
  $("country-btn").addEventListener("click", () => {
    $("cd-q").value = ""; drawCountryList();
    const d = $("country-dlg"); if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    const on = $("cd-list").querySelector(".on:not(.all)"); if (on) on.scrollIntoView({ block: "center" });
  });
  $("cd-close").addEventListener("click", () => $("country-dlg").close());
  $("country-dlg").addEventListener("click", (e) => { if (e.target === $("country-dlg")) $("country-dlg").close(); });
  $("cd-order").addEventListener("click", (e) => { const b = e.target.closest("button[data-o]"); if (!b) return; state.corder = b.dataset.o; drawCountryList(); $("cd-list").scrollTop = 0; });
  $("cd-q").addEventListener("input", drawCountryList);
  $("cd-list").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-cc]"); if (!b) return;
    state.country = b.dataset.cc; fillCountries(); $("country-dlg").close(); render();
  });
  fillCountries();
  if (!NEW.size) $("status").querySelector('[value="neu"]').disabled = true;
  else $("status").querySelector('[value="neu"]').textContent = `neu seit letzter Suche (${fmt.format(NEW.size)})`;
  $("sort").value = state.sort;
  $("group").value = state.group;

  // ---------- Filtern, Sortieren, Gruppieren
  const isCommercial = (p) => p && !p.l.includes("nc");
  function filtered() {
    const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    return DATA.filter((s) =>
      (!state.hideFossil || !s.x) &&
      (!state.onlyPhoto || s.p) &&
      (!state.family || s.f === state.family) &&
      (!state.genus || s.g === state.genus) &&
      (!state.license || isCommercial(s.p)) &&
      (!state.status || (state.status === "sicher" ? !s.u : state.status === "unsicher" ? s.u : NEW.has(s.n))) &&
      (!state.conts.size || s.cc.some((c) => state.conts.has(c))) &&
      (!state.country || s.ct.includes(state.country)) &&
      terms.every((t) => s.hay.includes(t)));
  }
  const byName = (a, b) => coll.compare(a.n, b.n);
  const SORTS = {
    "name": byName,
    "name-desc": (a, b) => coll.compare(b.n, a.n),
    "genus": (a, b) => coll.compare(a.g, b.g) || byName(a, b),
    "family": (a, b) => coll.compare(a.f, b.f) || coll.compare(a.g, b.g) || byName(a, b),
    "obs": (a, b) => b.o - a.o || byName(a, b),
    "inat": (a, b) => (b.io || 0) - (a.io || 0) || byName(a, b),
    "author": (a, b) => (a.y || 9999) - (b.y || 9999) || byName(a, b),
    "author-desc": (a, b) => (b.y || 0) - (a.y || 0) || byName(a, b),
  };
  function grouped(list) {
    const g = state.group;
    if (!g) return [[null, list]];
    const m = new Map();
    const add = (k, s) => { if (!m.has(k)) m.set(k, []); m.get(k).push(s); };
    for (const s of list) {
      if (g === "family") add(s.f, s);
      else if (g === "subfamily") add(`${s.f} › ${s.sf}`, s);
      else if (g === "genus") add(s.g, s);
      else if (g === "letter") add(s.n[0].toUpperCase(), s);
      else if (g === "decade") add(s.y ? `${Math.floor(s.y / 10) * 10}er` : "Jahr unbekannt", s);
      else if (g === "continent") { for (const c of s.cc) if (!state.conts.size || state.conts.has(c)) add(c, s); }
      else if (g === "country-cont" || g === "country-alpha") {
        const cs = s.ct.filter((c) => (!state.country || c === state.country) && (!state.conts.size || state.conts.has(contOf(c))));
        if (!cs.length) add("~", s); else for (const c of cs) add(c, s);
      }
    }
    if (g === "country-cont" || g === "country-alpha") {
      const label = (c) => c === "~" ? "ohne Länderangabe" : (g === "country-cont" ? `${CONT[contOf(c)] === CONT.NONE ? "?" : CONT[contOf(c)]} › ${cname(c)}` : cname(c));
      const keys = [...m.keys()].sort((a, b) => (a === "~") - (b === "~") ||
        (g === "country-cont" ? CONT_ORDER.indexOf(contOf(a)) - CONT_ORDER.indexOf(contOf(b)) : 0) || coll.compare(cname(a), cname(b)));
      return keys.map((k) => [label(k), m.get(k)]);
    }
    let keys = [...m.keys()];
    if (g === "continent") keys.sort((a, b) => CONT_ORDER.indexOf(a) - CONT_ORDER.indexOf(b));
    else keys.sort(coll.compare);
    return keys.map((k) => [g === "continent" ? CONT[k] : k, m.get(k)]);
  }

  // ---------- Darstellung
  const contBadges = (s) => s.cc.map((c) => `<span class="badge c-${c}">${CONT[c]}</span>`).join("");
  const names = (s) => [s.de, s.en].filter(Boolean).map(esc).join(" · ");
  const flags = (s) => (s.x ? ' <span class="fossil" title="fossil / ausgestorben">†</span>' : "") +
    (s.u ? ' <span class="tag warn" title="Nicht im Catalogue of Life: neu beschrieben, noch nicht erfasst oder veralteter Name">unsicher</span>' : "") +
    (NEW.has(s.n) ? ' <span class="tag new">neu</span>' : "");

  function card(s) {
    return `<article class="card" tabindex="0" data-k="${esc(s.k)}">
      <div class="img">${s.p ? imgTag(s, s.n) : PLACEHOLDER}</div>
      ${s.p ? `<p class="credit">${credit(s.p, true)}</p>` : ""}
      <div class="body">
        <h3><i>${esc(s.n)}</i>${flags(s)}</h3>
        <p class="auth">${esc(s.a)}</p>
        ${names(s) ? `<p class="common">${names(s)}</p>` : ""}
        <p class="tax"><span>${esc(s.f)}</span> › <i>${esc(s.g)}</i></p>
        <div class="badges">${contBadges(s)}</div>
      </div>
    </article>`;
  }
  function row(s) {
    return `<tr data-k="${esc(s.k)}" tabindex="0">
      <td class="thumb">${s.p ? imgTag(s, "") : ""}</td>
      <td><i>${esc(s.n)}</i>${flags(s)}<div class="auth">${esc(s.a)}</div></td>
      <td>${names(s)}</td>
      <td><i>${esc(s.g)}</i></td>
      <td>${esc(s.f)}</td>
      <td>${s.cc.map((c) => CONT[c]).join(", ")}</td>
      <td class="num">${fmt.format(s.o)}</td>
    </tr>`;
  }

  const fdlg = $("filter-more");
  const closeFilters = () => { if (fdlg.open) fdlg.close(); else fdlg.removeAttribute("open"); };
  $("filter-toggle").addEventListener("click", () => { if (fdlg.showModal) fdlg.showModal(); else fdlg.setAttribute("open", ""); });
  $("filter-close").addEventListener("click", closeFilters);
  $("fd-x").addEventListener("click", closeFilters);
  fdlg.addEventListener("click", (e) => { if (e.target === fdlg) closeFilters(); });
  fdlg.addEventListener("close", () => $("count").scrollIntoView({ block: "nearest" }));

  // Aktive Auswahl als entfernbare Chips über der Artenliste
  const optText = (id) => { const o = $(id).selectedOptions[0]; return o ? o.textContent.replace(/\s*\(\d[\d.]*\)\s*$/, "") : ""; };
  function activeChips() {
    const c = [];
    if (state.sort !== "name") c.push(["sort", "Sortierung", optText("sort")]);
    if (state.group) c.push(["group", "Gruppiert", optText("group")]);
    if (state.family) c.push(["family", "Familie", state.family]);
    if (state.genus) c.push(["genus", "Gattung", state.genus]);
    if (state.country) c.push(["country", "Land", cname(state.country)]);
    for (const k of state.conts) c.push(["cont:" + k, "Kontinent", CONT[k]]);
    if (state.status) c.push(["status", "Status", optText("status")]);
    if (state.license) c.push(["license", "Bildlizenz", "nur kommerziell nutzbar"]);
    if (!state.hideFossil) c.push(["hideFossil", "", "mit fossilen Arten"]);
    if (state.view === "table") c.push(["view", "Ansicht", "Tabelle"]);
    return c;
  }
  function drawActive() {
    const c = activeChips(), box = $("active-filters");
    box.hidden = !c.length;
    box.innerHTML = c.map(([k, l, v]) => `<button type="button" class="af" data-af="${esc(k)}" title="Entfernen">${l ? esc(l) + ": " : ""}<b>${esc(v)}</b><i class="x" aria-hidden="true">✕</i><span class="sr"> entfernen</span></button>`).join("") +
      (c.length > 1 ? `<button type="button" class="af-reset" id="af-reset">alle entfernen</button>` : "");
  }
  function clearOne(k) {
    if (k.startsWith("cont:")) { state.conts.delete(k.slice(5)); document.querySelectorAll(`#continents .chip[data-c="${k.slice(5)}"]`).forEach((b) => b.setAttribute("aria-pressed", "false")); }
    else if (k === "sort") { state.sort = "name"; $("sort").value = "name"; save(); }
    else if (k === "group") { state.group = ""; $("group").value = ""; save(); }
    else if (k === "family") { state.family = ""; state.genus = ""; $("family").value = ""; fillGenus(); }
    else if (k === "genus") { state.genus = ""; $("genus").value = ""; }
    else if (k === "country") { state.country = ""; fillCountries(); }
    else if (k === "status") { state.status = ""; $("status").value = ""; }
    else if (k === "license") { state.license = ""; $("license").value = ""; }
    else if (k === "onlyPhoto") { state.onlyPhoto = false; $("onlyPhoto").checked = false; }
    else if (k === "hideFossil") { state.hideFossil = true; $("hideFossil").checked = true; }
    else if (k === "view") { state.view = "grid"; save(); }
    render();
  }
  $("active-filters").addEventListener("click", (e) => {
    if (e.target.closest("#af-reset")) { $("reset").click(); state.sort = "name"; state.group = ""; $("sort").value = "name"; $("group").value = ""; save(); render(); return; }
    const b = e.target.closest("[data-af]"); if (b) clearOne(b.dataset.af);
  });
  function activeFilters() {
    return [state.family, state.genus, state.license, state.status, state.country, !state.hideFossil].filter(Boolean).length + state.conts.size;
  }
  let current = [];
  function render(resetShown = true) {
    const nf = activeFilters();
    $("filter-badge").textContent = nf ? String(nf) : "";
    drawActive();
    if (resetShown) state.shown = PAGE;
    current = filtered().sort(SORTS[state.sort]);
    const groups = grouped(current);
    const total = groups.reduce((n, [, l]) => n + l.length, 0);
    $("count-text").textContent = `${fmt.format(current.length)} ${current.length === 1 ? "Art" : "Arten"} gefunden` +
      (state.group ? ` in ${fmt.format(groups.length)} ${groups.length === 1 ? "Gruppe" : "Gruppen"}` : "");
    let budget = state.shown, html = "";
    for (const [title, list] of groups) {
      if (budget <= 0) break;
      const part = list.slice(0, budget);
      budget -= part.length;
      if (title != null) html += `<h2 class="group">${esc(title)} <small>${fmt.format(list.length)}</small></h2>`;
      if (state.view === "grid") html += `<div class="cards">${part.map(card).join("")}</div>`;
      else html += `<div class="tablewrap"><table><thead><tr><th></th><th>Art</th><th>Trivialname</th><th>Gattung</th><th>Familie</th><th>Kontinente</th><th class="num">Funde</th></tr></thead><tbody>${part.map(row).join("")}</tbody></table></div>`;
    }
    if (!current.length) html = `<p class="empty">Keine Art passt zu diesen Filtern.</p>`;
    if (io) io.disconnect();
    $("list").innerHTML = html;
    lazy($("list"));
    $("fd-count").textContent = `${fmt.format(current.length)} ${current.length === 1 ? "Art" : "Arten"} anzeigen`;
    $("more").hidden = state.shown >= total;
    $("more").textContent = `Weitere Arten anzeigen (${fmt.format(Math.max(0, total - state.shown))} übrig)`;
    $("photo-switch").querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.ph === "1") === state.onlyPhoto)));
    document.querySelectorAll(".view button").forEach((b) => b.classList.toggle("on", b.dataset.view === state.view));
  }

  // ---------- Detailansicht
  function openDialog(html) {
    $("d-body").innerHTML = html;
    $("d-body").querySelectorAll("img[data-ik]").forEach(fill);
    const dlg = $("detail");
    if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute("open", "");
  }
  // Zusatzdaten (Galerie, Literatur) werden erst beim Öffnen einer Art geladen
  const scripts = {};
  const loadScript = (src) => scripts[src] || (scripts[src] = new Promise((res, rej) => {
    const sc = document.createElement("script"); sc.src = vq(src); sc.onload = res;
    sc.onerror = () => { delete scripts[src]; rej(); }; document.head.appendChild(sc);
  }));
  const gals = {};
  window.__mantodeaGal = (n, data) => { gals[n] = data; };
  const LICS = LIC;
  const bhlName = (n) => `https://www.biodiversitylibrary.org/name/${encodeURIComponent(n.replace(/ /g, "_"))}`;
  const scholar = (q) => `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`;
  const bhlSearch = (q) => `https://www.biodiversitylibrary.org/search?searchTerm=${encodeURIComponent(q)}`;
  function citeHtml(c, s, page) {
    return `<li><span>${esc(c)}${page ? `, S. ${esc(page)}` : ""}</span>
      <span class="cl"><a href="${bhlSearch(c.replace(/[().,]/g, " "))}" target="_blank" rel="noopener">BHL ↗</a>
      <a href="${scholar(c + " " + s.n)}" target="_blank" rel="noopener">Scholar ↗</a></span></li>`;
  }
  async function fillLiterature(s) {
    const box = $("d-lit");
    if (!box) return;
    try { await loadScript("data/literatur.js"); } catch (e) { box.innerHTML = `<p class="muted">Literatur konnte nicht geladen werden.</p>`; return; }
    const L = (window.MANTODEA_LIT || {})[s.k] || {};
    let h = "";
    h += `<h4>Originalbeschreibung</h4>`;
    h += L.o ? `<ul class="lit">${citeHtml(L.o, s, L.op)}</ul>` :
      `<p class="muted">Im Catalogue of Life ist keine Originalbeschreibung verzeichnet. Autor und Jahr: ${esc(s.a || "unbekannt")}.</p>`;
    if (L.r && L.r.length) h += `<h4>Weitere Fachliteratur zu dieser Art <small>(Mantodea Species File)</small></h4><ul class="lit">${L.r.map((c) => citeHtml(c, s)).join("")}</ul>`;
    if (L.p && L.p.length) h += `<h4>Fachartikel, in denen die Art vorkommt <small>(GBIF-Literaturindex)</small></h4><ul class="lit">${L.p.map((p) =>
      `<li><a href="${esc(p.u)}" target="_blank" rel="noopener">${esc(p.t)}</a> <span class="muted">${esc([p.s, p.y].filter(Boolean).join(", "))}</span></li>`).join("")}</ul>`;
    try {
      await loadScript("data/openalex.js");
      const OA = window.MANTODEA_OA || {}, w = (OA.w || {})[s.k];
      const oaLink = `https://openalex.org/works?filter=title_and_abstract.search:%22${encodeURIComponent(s.n)}%22`;
      if (w && w.p.length) h += `<h4>Fachartikel, in denen die Art vorkommt <small>(OpenAlex, ${fmt.format(w.n)} Treffer, meistzitierte zuerst)</small></h4><ul class="lit">${w.p.map((p) =>
        `<li><a href="${esc(p.u)}" target="_blank" rel="noopener">${esc(p.t)}</a> <span class="muted">${esc([p.s, p.y].filter(Boolean).join(", "))}</span></li>`).join("")}</ul>
        ${w.n > w.p.length ? `<p class="small"><a href="${oaLink}" target="_blank" rel="noopener">Alle ${fmt.format(w.n)} Treffer bei OpenAlex ansehen ↗</a></p>` : ""}`;
      else if (!w && OA.abgedeckt < OA.arten) h += `<p class="muted small">Die Fachartikel-Suche bei OpenAlex läuft schrittweise jede Nacht. Für diese Art ist sie noch nicht erfolgt (${fmt.format(OA.abgedeckt)} von ${fmt.format(OA.arten)} Arten erledigt). <a href="${oaLink}" target="_blank" rel="noopener">Jetzt direkt bei OpenAlex suchen ↗</a></p>`;
    } catch (e) { /* OpenAlex-Daten noch nicht vorhanden */ }
    // Eigene Literatursammlung in Dropbox (PDFs bleiben dort; Zuordnung über data/dropbox.js)
    try {
      await loadScript("data/dropbox.js");
      const D = window.MANTODEA_DBX;
      if (D && D.ordner) {
        const ids = [...new Set([...(D.arten[s.n] || []), ...(D.gattungen[s.g] || []), ...(D.familien[s.f] || [])])];
        const link = (f) => f.u || (D.ordner + "&preview=" + encodeURIComponent(f.n));
        const level = (i) => (D.arten[s.n] || []).includes(i) ? "zur Art" : (D.gattungen[s.g] || []).includes(i) ? `zur Gattung ${esc(s.g)}` : `zur Familie ${esc(s.f)}`;
        h += `<h4>📚 Literatursammlung (Dropbox)${ids.length ? ` <small>${ids.length}</small>` : ""}</h4>`;
        if (ids.length) h += `<ul class="lit dbx">${ids.map((i) => { const f = D.dateien[i]; return `<li><a href="${esc(link(f))}" target="_blank" rel="noopener">📄 ${esc(f.t || f.n)}</a>${f.j ? ` <span class="muted">(${esc(f.j)})</span>` : ""} <span class="muted small">· ${level(i)}</span></li>`; }).join("")}</ul>`;
        else h += `<p class="muted small">Für diese Art sind noch keine PDFs aus der Sammlung zugeordnet.</p>`;
        h += `<p class="links"><a href="${esc(D.ordner)}" target="_blank" rel="noopener">Gesamte Literatursammlung in Dropbox öffnen ↗</a></p>`;
      }
    } catch (e) { /* ohne Sammlung */ }
    h += `<h4>Alle Erwähnungen suchen</h4><p class="links">
      <a href="${bhlName(s.n)}" target="_blank" rel="noopener">Biodiversity Heritage Library: alle Seiten mit <i>${esc(s.n)}</i> ↗</a>
      <a href="${scholar('"' + s.n + '"')}" target="_blank" rel="noopener">Google Scholar ↗</a></p>
      <p class="muted small">BHL und Scholar sind Suchlinks. Die BHL hat ältere Fachliteratur (bis ca. 1930) vollständig digitalisiert. Die Liste oben stammt aus den Datenbanken.</p>`;
    box.innerHTML = h;
  }
  // Fachartikel mit Bestimmungsschlüssel (Plazi-Artikel aus ChecklistBank)
  const doiUrl = (d) => d ? (d.startsWith("http") ? d : "https://doi.org/" + d) : "";
  function paperHtml(p, why) {
    const links = [p.d && `<a href="${esc(doiUrl(p.d))}" target="_blank" rel="noopener">Artikel (DOI) ↗</a>`,
      p.pz && `<a href="https://tb.plazi.org/GgServer/summary/${esc(p.pz)}" target="_blank" rel="noopener">Plazi ↗</a>`,
      `<a href="https://www.checklistbank.org/dataset/${esc(p.cb)}/about" target="_blank" rel="noopener">ChecklistBank ↗</a>`].filter(Boolean).join(" ");
    return `<li class="kp"><b>${esc(p.t)}</b>${p.k === 2 ? ' <span class="tag key">mit Schlüssel</span>' : p.k === 1 ? ' <span class="tag rev">Revision</span>' : ""}
      ${p.c ? `<div class="muted small">${esc(p.c)}</div>` : ""}
      ${p.ks ? `<div class="small ks">„${esc(p.ks)}“</div>` : ""}
      ${why ? `<div class="small muted">${why}</div>` : ""}
      <div class="cl">${links}</div></li>`;
  }
  async function fillKeyLit(s) {
    const box = $("d-key");
    if (!box) return;
    try { await loadScript("data/schluessel.js"); } catch (e) { box.innerHTML = `<p class="muted">Bestimmungsliteratur konnte nicht geladen werden.</p>`; return; }
    const K = window.MANTODEA_KEYLIT || { papers: [], g: {}, s: {} };
    const sp = new Set(K.s[s.n] || []), gp = new Set(K.g[s.g] || []);
    const all = [...new Set([...sp, ...gp])].map((i) => [i, K.papers[i]]);
    const rank = ([i, p]) => p.k * 10 + (sp.has(i) ? 2 : 0) - (p.ng > 15 ? 5 : 0);
    all.sort((a, b) => rank(b) - rank(a) || (b[1].y || 0) - (a[1].y || 0));
    const keys = all.filter(([, p]) => p.k > 0), other = all.filter(([, p]) => p.k === 0);
    const why = (i) => sp.has(i) ? `behandelt <i>${esc(s.n)}</i>` : `behandelt die Gattung <i>${esc(s.g)}</i>`;
    let h = "";
    if (keys.length) h += `<p class="small">Fachartikel mit Bestimmungsschlüssel (<b>mit Schlüssel</b> = laut Zusammenfassung enthalten) oder Gattungsrevision (<b>Revision</b> = enthält meist einen Schlüssel):</p>
      <ul class="lit keylit">${keys.map(([i, p]) => paperHtml(p, why(i))).join("")}</ul>`;
    else h += `<p class="muted">Für <i>${esc(s.g)}</i> ist in den digitalisierten Fachartikeln (Plazi) noch kein Bestimmungsschlüssel verzeichnet. Ältere Schlüssel stehen oft in Werken, die nur gedruckt oder als Scan vorliegen. Die Suchlinks unten helfen weiter.</p>`;
    if (other.length) h += `<details><summary>Weitere Fachartikel zu <i>${esc(s.g)}</i> (${other.length})</summary><ul class="lit keylit">${other.map(([i, p]) => paperHtml(p, why(i))).join("")}</ul></details>`;
    h += `<h4>Schlüssel suchen</h4><p class="links">
      <a href="${scholar('"' + s.g + '" key Mantodea')}" target="_blank" rel="noopener">Google Scholar: „${esc(s.g)}“ + key ↗</a>
      <a href="${scholar('"' + s.g + '" revision')}" target="_blank" rel="noopener">Google Scholar: Revision ↗</a>
      <a href="https://zenodo.org/search?q=${encodeURIComponent('"' + s.g + '" key')}" target="_blank" rel="noopener">Zenodo ↗</a>
      <a href="${bhlSearch(s.g + " Mantidae")}" target="_blank" rel="noopener">BHL (alte Literatur) ↗</a></p>
      <p class="muted small">Klassischer Gesamtschlüssel für alle damals bekannten Gattungen und Arten: Giglio-Tos, E. (1927): Orthoptera Mantidae. <i>Das Tierreich</i> 50. <a href="${bhlSearch("Giglio-Tos 1927 Mantidae Das Tierreich")}" target="_blank" rel="noopener">In der BHL suchen ↗</a></p>`;
    box.innerHTML = h;
  }
  // ---------- Namensgeschichte: gültiger Name und Synonyme mit Zeitleiste (Catalogue of Life)
  async function fillSyn(s) {
    const box = $("d-syn"); if (!box) return;
    try { await loadScript("data/synonyme.js"); } catch (e) { return; }
    const D = (window.MANTODEA_SYN || {})[s.k];
    const card = $("d-syn-card");
    if (!D || !D.s.length) { box.innerHTML = ""; if (card) card.hidden = true; return; }
    if (card) card.hidden = false;
    const Y0 = 1750, Y1 = new Date().getFullYear(), pos = (y) => ((Math.max(Y0, Math.min(Y1, y)) - Y0) / (Y1 - Y0)) * 100;
    const yv = (s.a.match(/(1[789]\d\d|20\d\d)/) || [])[1];
    const moved = /^\(/.test((D.a || s.a || "").trim());
    const row = (name, auth, y, cls, note) => `<li class="syn-row ${cls}">
        <div class="syn-name"><i>${esc(name)}</i> <span class="muted">${esc(auth)}</span>${note ? `<div class="small muted">${note}</div>` : ""}</div>
        <div class="syn-bar" title="${y ? "Name seit " + y : "Jahr unbekannt"}">${y ? `<span style="left:${pos(y)}%;width:${100 - pos(y)}%"></span><b style="left:${pos(y)}%">${y}</b>` : ""}</div></li>`;
    const typ = (t) => t === "homotypisch" ? "frühere Gattungs-Kombination derselben Beschreibung" : "eigene Beschreibung, später als dieselbe Art erkannt";
    box.innerHTML = `<h3 class="d-h">Namensgeschichte <small>${D.s.length} ${D.s.length === 1 ? "Synonym" : "Synonyme"}</small></h3>
      <ul class="syn">${row(s.n, s.a, yv ? +yv : null, "valid", "heute gültiger Name" + (moved ? " · ursprünglich in einer anderen Gattung beschrieben (Autor in Klammern)" : ""))}
      ${D.s.map((r) => row(r[0], r[1], r[2], "old", `${typ(r[3])}${r[4] ? ` · erschienen in: ${esc(r[4])}${r[5] ? ", S. " + esc(r[5]) : ""}` : ""}`)).join("")}</ul>
      <div class="syn-axis"><span>${Y0}</span><span>1850</span><span>1950</span><span>${Y1}</span></div>
      <p class="muted small">Die Balken zeigen, seit wann ein Name existiert. Synonyme sind heute ungültig. Wann sie eingezogen wurden, ist in den Daten des Catalogue of Life (Mantodea Species File) nicht angegeben. Nach der Prioritätsregel gilt in der Regel der älteste verfügbare Name.</p>`;
  }

  // ---------- Galerie, nach Geschlecht/Stadium gruppiert, und zoombare Großansicht
  let galItems = [];
  // Große Fassungen (>= 600 px) je Art, erst beim Öffnen des Steckbriefs geladen
  const HD = {};
  window.__mantodeaHD = (k, d) => { HD[k] = d; };
  async function loadHD(k) {
    if (SA) { if (RM[k]) return { f: RM[k].f, g: (RM[k].g || []).map((g) => g[0]) }; if (RM.u[k]) return { f: RM.u[k] }; return null; }
    if (HD[k]) return HD[k];
    try { await loadScript("data/hd/index.js"); } catch (e) { return null; }
    const ix = window.MANTODEA_HD || {};
    const file = ix[k] ? k : (ix.u && ix.u[k]);
    if (!file) return null;
    try { await loadScript(`data/hd/${file}.js`); } catch (e) { return null; }
    return HD[file] && HD[file][k] && !HD[k] ? (HD[k] = HD[file][k]) : HD[k] || null;
  }
  const hdSrc = (b) => (!b ? null : /^https?:/.test(b) ? b : "data:image/jpeg;base64," + b);
  const GROUPS = [["♀", "Weibchen"], ["♂", "Männchen"], ["adult", "Erwachsene, Geschlecht unbestimmt"], ["nymph|juvenil|larv", "Nymphen"], ["ootheke|ootheca", "Ootheken"], ["beleg", "Museumsbelege"], ["", "Weitere Fotos"]];
  const groupOf = (a) => { a = (a || "").toLowerCase(); for (const [re, name] of GROUPS) if (re && new RegExp(re).test(a)) return name; return "Weitere Fotos"; };
  async function fillGallery(s) {
    const box = $("d-gal");
    galItems = [];
    if (!box || !(s.gb || s.fb)) return;
    const bundles = [s.gb, s.fb].filter(Boolean);
    let items;
    if (SA) items = ((RM[s.k] || {}).g || []).map((g) => ({ u: g[0], by: g[1], l: g[2], src: g[3], ref: g[4], a: g[5] }));
    else {
      try { await Promise.all(bundles.map((b) => loadScript(`data/img/${b}.js`))); } catch (e) { box.innerHTML = `<p class="muted">Galerie konnte nicht geladen werden.</p>`; return; }
      items = bundles.flatMap((b) => (gals[b] || {})[s.k] || []);
    }
    const hd = await loadHD(s.k);
    galItems = items.map((g, i) => ({ src: hdSrc(hd && hd.g && hd.g[i]) || (g.d ? "data:image/jpeg;base64," + g.d : g.u), thumb: SA ? smallUrl(g.u) : null, g }));
    const groups = new Map();
    items.forEach((g, i) => { const n = groupOf(g.a); if (!groups.has(n)) groups.set(n, []); groups.get(n).push(i); });
    const order = GROUPS.map((x) => x[1]).filter((n) => groups.has(n));
    const multi = order.length > 1;
    box.innerHTML = order.map((n) => `${multi ? `<h4 class="g-group">${esc(n)} <small>${groups.get(n).length}</small></h4>` : ""}<div class="gallery">${groups.get(n).map((i) => { const g = items[i];
      return `<button type="button" class="gthumb" data-gi="${i}" title="${esc((g.a ? g.a + " · " : "") + "Foto: " + g.by)}"><img src="${galItems[i].thumb || galItems[i].src}" alt="${esc(s.n)} Foto ${i + 1}" loading="lazy">${g.a && !multi ? `<span>${esc(g.a)}</span>` : ""}</button>`; }).join("")}</div>`).join("");
    box.onclick = (e) => { const b = e.target.closest(".gthumb"); if (b) openZoom(s, +b.dataset.gi + 1); };
    applyTitle(s);
  }
  // ---------- Hauptbild wählen (gespeichert in der Datenbank "titelbilder"; nächtlicher Lauf übernimmt es fest)
  let titleDb = null, titleWritable = false;
  (async () => {
    const use = (n) => (window.claude && window.claude.use ? window.claude.use(n).catch(() => null) : Promise.resolve(null));
    const [db, user] = await Promise.all([use("db"), use("user")]);
    if (!db) return;
    titleDb = db;
    try { titleWritable = user && user.can ? (await user.can("data.write")) !== false : true; } catch (e) { titleWritable = false; }
    db.collection("titelbilder").orderBy("zeit", "asc").limit(5000).onSnapshot((snap) => {
      const changed = [];
      snap.docs.forEach((d) => { const v = d.data(); if (v.art_key && liveTitle[v.art_key] !== v.ref) { liveTitle[v.art_key] = v.ref; changed.push(v.art_key); } });
      changed.forEach(refreshCards);
      const k = $("d-body") && $("d-body").dataset.k; const s = k && BYKEY.get(k); if (s && $("detail").open) applyTitle(s);
    }, () => {});
  })();
  function applyTitle(s) {
    const ref = titleRef(s.k); if (!ref || !galItems.length) return;
    const i = galItems.findIndex((it) => it.g.ref === ref); if (i < 0) return;
    const it = galItems[i], im = document.querySelector(".d-hero .d-img img");
    if (im) { im.removeAttribute("data-ik"); im.src = it.src; }
    const cr = document.querySelector(".d-hero .credit"); if (cr) cr.innerHTML = credit({ l: it.g.l, by: it.g.by, src: it.g.src, ref: it.g.ref }, false);
    const tag = document.querySelector(".d-hero .front-tag"); if (tag) tag.textContent = it.g.a || "gewähltes Hauptbild";
    document.querySelectorAll("#d-gal .gthumb").forEach((b) => b.classList.toggle("is-title", +b.dataset.gi === i));
    s._title = it;
  }
  // Kacheln einer Art neu befüllen (gewähltes Hauptbild)
  function refreshCards(k) {
    const s = BYKEY.get(String(k)); if (!s) return;
    document.querySelectorAll(`[data-k="${CSS.escape(String(k))}"] .img img`).forEach((im) => { im.dataset.ik = s.k; RECS.set(String(s.k), s); fill(im); });
  }
  async function titleSrcFor(rec) {
    const ref = titleRef(rec.k); if (!ref || SA) return null;
    const bundles = [rec.gb, rec.fb].filter(Boolean);
    try { await Promise.all(bundles.map((b) => loadScript(`data/img/${b}.js`))); } catch (e) { return null; }
    const g = bundles.flatMap((b) => (gals[b] || {})[rec.k] || []).find((x) => x.ref === ref);
    return g ? "data:image/jpeg;base64," + g.d : null;
  }
  async function setTitle(s, i) {
    const it = galItems[i]; if (!it || !titleDb) return;
    liveTitle[s.k] = it.g.ref; applyTitle(s); refreshCards(s.k);
    try { await titleDb.collection("titelbilder").add({ art_key: String(s.k), art: s.n, ref: it.g.ref, zeit: new Date().toISOString() }); }
    catch (e) { return false; }
    return true;
  }
  async function openZoom(s, start) {
    // Liste: Titelbild (falls vorhanden) + Galerie
    const list = [];
    const hdf = (await loadHD(s.k) || {}).f;
    if (s._title && s._title.g.ref === titleRef(s.k)) list.push({ src: s._title.src, cap: credit({ l: s._title.g.l, by: s._title.g.by, src: s._title.g.src, ref: s._title.g.ref }, false), ref: s._title.g.ref, a: s._title.g.a });
    else if (s.p) { try { list.push({ src: hdSrc(hdf) || await imgData(s), cap: credit(s.p, false), ref: s.p.ref, a: s.p.front ? "♀ adultes Weibchen" : "" }); } catch (e) { /* ohne Titelbild */ } }
    else start = Math.max(0, start - 1);
    for (const [gi, it] of galItems.entries()) { const g = it.g, [lab, lurl] = LICS[g.l] || [g.l, "#"];
      list.push({ gi, src: it.src, a: g.a, ref: g.ref, cap: `Foto: ${esc(g.by || "siehe Quelle")} · <a href="${lurl}" target="_blank" rel="noopener license">${esc(lab)}</a> · ${esc(g.src)}` }); }
    if (!list.length) return;
    let idx = Math.min(start, list.length - 1);
    const lb = $("lightbox");
    lb.innerHTML = `<button type="button" class="close" aria-label="Schließen">×</button>
      <div class="zstage"><a class="zlink" target="_blank" rel="noopener"><img alt="${esc(s.n)}" draggable="false"></a></div>
      ${list.length > 1 ? `<button type="button" class="znav prev" aria-label="Vorheriges Foto">‹</button><button type="button" class="znav next" aria-label="Nächstes Foto">›</button>` : ""}
      <div class="ztools"><button type="button" data-zz="out" aria-label="Verkleinern">－</button><button type="button" data-zz="reset" aria-label="Zurücksetzen">1:1</button><button type="button" data-zz="in" aria-label="Vergrößern">＋</button><span class="zcount"></span>${titleWritable ? `<button type="button" class="zset" hidden>🖼️ Als Hauptbild verwenden</button>` : ""}</div>
      <p class="zhint">Foto antippen: Original in voller Auflösung öffnen · zwei Finger oder ＋/－: zoomen</p>
      <p class="zcap"></p>`;
    lb.hidden = false;
    const stage = lb.querySelector(".zstage"), img = stage.querySelector("img");
    const z = { k: 1, x: 0, y: 0 };
    const apply = () => { img.style.transform = `translate(${z.x}px, ${z.y}px) scale(${z.k})`; stage.classList.toggle("zoomed", z.k > 1.01); };
    const clampZ = () => {
      z.k = Math.max(1, Math.min(6, z.k));
      const r = stage.getBoundingClientRect(), w = img.offsetWidth * z.k, h = img.offsetHeight * z.k;
      const mx = Math.max(0, (w - r.width) / 2), my = Math.max(0, (h - r.height) / 2);
      z.x = Math.max(-mx, Math.min(mx, z.x)); z.y = Math.max(-my, Math.min(my, z.y));
    };
    const zoomAt = (cx, cy, f) => {
      const r = stage.getBoundingClientRect(), px = cx - r.left - r.width / 2, py = cy - r.top - r.height / 2;
      const k0 = z.k; z.k = Math.max(1, Math.min(6, z.k * f)); const q = z.k / k0;
      z.x = px - (px - z.x) * q; z.y = py - (py - z.y) * q; clampZ(); apply();
    };
    const show = (i) => {
      idx = (i + list.length) % list.length; const it = list[idx];
      z.k = 1; z.x = 0; z.y = 0; apply();
      img.src = it.src;
      const zl = lb.querySelector(".zlink"); if (it.ref) zl.href = it.ref; else zl.removeAttribute("href");
      lb.querySelector(".zcap").innerHTML = `${it.a ? `<b>${esc(it.a)}</b> · ` : ""}${it.cap}${it.ref ? ` · <a href="${esc(it.ref)}" target="_blank" rel="noopener">Original in voller Größe ↗</a>` : ""}`;
      const c = lb.querySelector(".zcount"); if (c) c.textContent = list.length > 1 ? `${idx + 1} / ${list.length}` : "";
      const zs = lb.querySelector(".zset");
      if (zs) { const isT = it.ref && it.ref === (titleRef(s.k) || (s.p && s.p.ref)); zs.hidden = it.gi === undefined; zs.disabled = isT; zs.textContent = isT ? "✓ Ist das Hauptbild" : "🖼️ Als Hauptbild verwenden"; }
    };
    show(idx);
    stage.onwheel = (e) => { e.preventDefault(); zoomAt(e.clientX, e.clientY, Math.exp(-Math.max(-100, Math.min(100, e.deltaY)) * 0.004)); };
    const ptr = new Map(); let pinch = null, moved = false, lastTap = 0, sx = 0;
    stage.onpointerdown = (e) => { ptr.set(e.pointerId, [e.clientX, e.clientY]); moved = false; sx = e.clientX; if (z.k > 1.01 || ptr.size > 1) { try { stage.setPointerCapture(e.pointerId); } catch (err) { /* egal */ } } };
    stage.onpointermove = (e) => {
      if (!ptr.has(e.pointerId)) return;
      const p0 = ptr.get(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptr.size === 2) {
        const [a, b] = [...ptr.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (pinch) zoomAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, d / pinch);
        pinch = d; moved = true;
      } else if (z.k > 1.01) { z.x += e.clientX - p0[0]; z.y += e.clientY - p0[1]; clampZ(); apply(); moved = true; }
      else if (Math.abs(e.clientX - sx) > 8) moved = true;
    };
    stage.onpointerup = (e) => {
      ptr.delete(e.pointerId); if (ptr.size < 2) pinch = null;
      if (ptr.size) return;
      if (z.k <= 1.01 && Math.abs(e.clientX - sx) > 60) { show(idx + (e.clientX < sx ? 1 : -1)); return; }   // wischen
      if (moved) return;
      // einfacher Tipp ohne Zoom: der Link um das Bild öffnet das Original (normaler Link, von claude.ai erlaubt)
    };
    stage.onpointercancel = (e) => { ptr.delete(e.pointerId); pinch = null; };
    lb.querySelector(".zlink").addEventListener("click", (e) => { if (moved || z.k > 1.01) e.preventDefault(); });
    lb.onclick = (e) => {
      if (e.target.closest(".close")) { lb.hidden = true; return; }
      if (e.target.closest(".prev")) return show(idx - 1);
      const zs = e.target.closest(".zset");
      if (zs && list[idx].gi !== undefined) { zs.disabled = true; setTitle(s, list[idx].gi).then((ok) => { zs.textContent = ok ? "✓ Ist jetzt das Hauptbild" : "Speichern nicht erlaubt"; }); return; }
      if (e.target.closest(".next")) return show(idx + 1);
      const t = e.target.closest("[data-zz]");
      if (t) { const r = stage.getBoundingClientRect(); if (t.dataset.zz === "reset") { z.k = 1; z.x = z.y = 0; apply(); } else zoomAt(r.left + r.width / 2, r.top + r.height / 2, t.dataset.zz === "in" ? 1.6 : 1 / 1.6); }
    };
    lb.onkeydown = null;
  }
  document.addEventListener("keydown", (e) => {
    const lb = $("lightbox"); if (!lb || lb.hidden) return;
    if (e.key === "ArrowRight") lb.querySelector(".next")?.click();
    if (e.key === "ArrowLeft") lb.querySelector(".prev")?.click();
    if (e.key === "Escape") { e.preventDefault(); lb.hidden = true; }
  });

  // Verbreitung nach Ländern mit Belegen
  function countrySection(s) {
    const cn = s.cn || {};
    const ev = (cc) => {
      const [n, m, l] = cn[cc] || [0, 0, 0], parts = [];
      if (l) parts.push("📖 Literatur");
      if (m) parts.push(`🏛️ ${fmt.format(m)} Museum`);
      const obs = n - m; if (obs > 0) parts.push(`👁️ ${fmt.format(obs)}`);
      return parts.join(" · ");
    };
    const few = (cc) => { const [n, m, l] = cn[cc] || [0, 0, 0]; return !l && n < 5; };
    const item = (cc) => `<li${few(cc) ? ' class="few"' : ""}><a href="#" data-country="${esc(cc)}">${esc(cname(cc))}</a> <span class="ev">${ev(cc)}</span></li>`;
    if (!s.ct.length && !(s.cq || []).length) return `<h4 class="d-sub" id="d-ct-h">Länder</h4><p class="muted">Keine Länderangaben aus Freiland- oder Museumsnachweisen bekannt.</p>`;
    let h = `<h4 class="d-sub" id="d-ct-h">Länder <small>${s.ct.length} belegt</small></h4>`;
    for (const k of CONT_ORDER) {
      const cs = s.ct.filter((c) => contOf(c) === k).sort((a, b) => coll.compare(cname(a), cname(b)));
      if (cs.length) h += `<h4 class="ct-h">${esc(k === "NONE" ? "ohne Kontinentzuordnung" : CONT[k])} <small>${cs.length}</small></h4><ul class="ctlist">${cs.map(item).join("")}</ul>`;
    }
    if ((s.cq || []).length) h += `<details class="ctq"><summary>Fragliche Einzelmeldungen (${s.cq.length})</summary><p class="muted small">Einzelne Meldungen weit außerhalb des übrigen Verbreitungsgebiets. Möglich sind Fehlbestimmung, entflogene Haustiere oder Einschleppung. Sie zählen nicht für die Ländersuche.</p><ul class="ctlist">${s.cq.map(item).join("")}</ul></details>`;
    h += `<p class="muted small">👁️ Beobachtungen (z. B. iNaturalist, nur Forschungsqualität und frei lebend), 🏛️ Museumsbelege, 📖 regionale Artenliste in der Fachliteratur. Laborproben und Tiere aus Haltung zählen nicht. Kursiv: weniger als 5 Nachweise, eventuell eingeschleppt oder unbeständig. Quelle: <a href="https://www.gbif.org/occurrence/search?taxon_key=${esc(s.gk || "")}" target="_blank" rel="noopener">GBIF</a>, Plazi.</p>`;
    return h;
  }
  function detail(k) {
    const s = BYKEY.get(String(k));
    if (!s) return;
    const srcs = (s.src || []).map((q) => {
      const u = SRC_LINK[q] && SRC_LINK[q](s);
      return u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${SRC_NAME[q]} ↗</a>` : `<span>${SRC_NAME[q] || esc(q)}</span>`;
    });
    if (s.w) srcs.push(`<a href="${esc(s.w)}" target="_blank" rel="noopener">Wikipedia ↗</a>`);
    const fact = (label, val) => val ? `<div class="fact"><span>${label}</span><b>${val}</b></div>` : "";
    openDialog(`
      <div class="d-hero"${s.p ? ' data-zoom="front" title="Antippen zum Vergrößern"' : ""}>
        <div class="d-img">${s.p ? imgTag(s, s.n) : PLACEHOLDER}${s.p && s.p.front ? `<span class="front-tag">♀ adultes Weibchen</span>` : ""}${s.p ? `<span class="zoom-tag">🔍</span>` : ""}</div>
        ${s.p ? `<p class="credit full">${credit(s.p, false)}</p>` : ""}
      </div>
      <section class="d-card d-head">
        <h2 id="d-title"><i>${esc(s.n)}</i>${flags(s)}</h2>
        <p class="d-auth">${esc(s.a)}${s.de || s.en ? ` · <span class="d-common">${esc([s.de, s.en].filter(Boolean).join(" · "))}</span>` : ""}</p>
        ${s.u ? `<p class="note small">Diese Art steht nicht im Catalogue of Life. Sie kann neu beschrieben und dort noch nicht erfasst sein, oder der Name ist veraltet bzw. ein Synonym. Gefunden in: ${(s.src || []).map((q) => SRC_NAME[q]).join(", ")}.</p>` : ""}
        <p class="d-tax">Mantodea › <a href="#" data-fam="${esc(s.f)}">${esc(s.f)}</a>${s.sf && !s.sf.startsWith("(") ? ` › ${esc(s.sf)}` : ""} › <a href="#" data-gen="${esc(s.g)}" data-genfam="${esc(s.f)}"><i>${esc(s.g)}</i></a></p>
      </section>
      <section class="d-card">
        ${s.gb || s.fb ? `<h3 class="d-h">Fotos <small>${(s.gn || 0) + (s.fn || 0)} Fotos${s.fn ? ` (davon ${s.fn} von Flickr)` : ""} · antippen zum Vergrößern</small></h3><div id="d-gal"><p class="muted">Lade Fotos …</p></div>` :
          `<h3 class="d-h">Fotos</h3><p class="muted">Keine weiteren frei lizenzierten Fotos gefunden.</p>`}
      </section>
      <section class="d-card">
        <h3 class="d-h">Fundorte</h3><div id="d-map" class="d-map"><p class="muted">Lade Karte …</p></div>
        ${countrySection(s)}
        <div id="d-assigned"></div>
      </section>
      <section class="d-card" id="d-syn-card"><div id="d-syn"></div></section>
      <section class="d-card"><h3 class="d-h" id="d-key-h">Bestimmung</h3>
        <p class="d-actions"><button type="button" class="primary" data-key="${esc(s.k)}">🖼️ Ähnliche Arten vergleichen</button></p>
        <h4 class="d-sub">📖 Bestimmungsschlüssel in der Fachliteratur</h4><div id="d-key"><p class="muted">Lade Bestimmungsliteratur …</p></div></section>
      <section class="d-card"><h3 class="d-h">Literatur</h3><div id="d-lit"><p class="muted">Lade Literatur …</p></div></section>
      <p class="links d-sources"><span class="muted">Datenquellen:</span> ${srcs.join("")}</p>
      <div id="lightbox" class="lightbox zoomer" hidden></div>`);
    $("d-body").scrollTop = 0;
    $("d-body").dataset.k = s.k; s._title = null;
    prefetchSpecies(s.k);
    loadHD(s.k).then((hd) => { const im = document.querySelector(".d-hero .d-img img"); if (hd && hd.f && im && $("d-body").dataset.k == s.k) { im.removeAttribute("data-ik"); im.src = hdSrc(hd.f); } });
    fillGallery(s);
    fillLiterature(s);
    fillKeyLit(s);
    fillSyn(s);
    document.dispatchEvent(new CustomEvent("mantodea:detail", { detail: String(s.k) }));
  }
  $("d-body").addEventListener("click", (e) => {
    const lb = e.target.closest(".lightbox");
    if (lb) { if (e.target.classList.contains("close") || e.target === lb) lb.hidden = true; return; }
    const gk = e.target.closest("a[data-goto-k]");
    if (gk) { e.preventDefault(); const t = $("d-key-h"); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const gc = e.target.closest("a[data-goto-c]");
    if (gc) { e.preventDefault(); const t = $("d-map"); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const ca = e.target.closest("a[data-country]");
    if (ca) {
      e.preventDefault(); state.country = ca.dataset.country; fillCountries(); $("detail").close();
      if (location.hash && location.hash !== "#arten") location.hash = "arten";
      render(); $("count").scrollIntoView({ behavior: "smooth" }); return;
    }
    const zf = e.target.closest("[data-zoom]");
    if (zf) { const s = BYKEY.get(String($("d-body").dataset.k)); if (s) openZoom(s, 0); return; }
    const gt = e.target.closest("button[data-goto]");
    if (gt) { const t = $(gt.dataset.goto + "-h"); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const kb = e.target.closest("button[data-key]");
    if (kb) { $("detail").close(); if (window.MANTODEA_KEY) window.MANTODEA_KEY.fromSpecies(kb.dataset.key); return; }
    const a = e.target.closest("a[data-fam], a[data-gen]");
    if (!a) return;
    e.preventDefault();
    state.family = a.dataset.fam || a.dataset.genfam;
    $("family").value = state.family;
    fillGenus();
    state.genus = a.dataset.gen || "";
    $("genus").value = state.genus;
    $("detail").close();
    if (location.hash && location.hash !== "#arten") location.hash = "arten";
    render();
    $("count").scrollIntoView({ behavior: "smooth" });
  });
  $("detail").addEventListener("click", (e) => { if (e.target === $("detail")) $("detail").close(); });
  const openFrom = (e) => {
    const el = e.target.closest("[data-k]");
    if (el && !e.target.closest("a")) detail(el.dataset.k);
  };
  $("list").addEventListener("click", openFrom);
  // Vorausladen: beim Berühren/Überfahren einer Karte die großen Fotos dieser Art schon holen
  if (SA) ["pointerenter", "touchstart", "focusin"].forEach((ev) => $("list").addEventListener(ev, (e) => { const c = e.target.closest && e.target.closest("[data-k]"); if (c) prefetchSpecies(c.dataset.k); }, { passive: true, capture: true }));
  $("list").addEventListener("keydown", (e) => { if (e.key === "Enter") openFrom(e); });

  // ---------- Ereignisse
  let t;
  $("q").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; render(); }, 150); });
  $("sort").addEventListener("change", (e) => { state.sort = e.target.value; save(); render(); });
  $("group").addEventListener("change", (e) => { state.group = e.target.value; save(); render(); });
  $("family").addEventListener("change", (e) => { state.family = e.target.value; fillGenus(); render(); });
  $("genus").addEventListener("change", (e) => { state.genus = e.target.value; render(); });
  $("license").addEventListener("change", (e) => { state.license = e.target.value; render(); });
  $("country").addEventListener("change", (e) => { state.country = e.target.value; render(); });
  $("status").addEventListener("change", (e) => { state.status = e.target.value; render(); });
  $("onlyPhoto").addEventListener("change", (e) => { state.onlyPhoto = e.target.checked; render(); });
  $("photo-switch").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-ph]"); if (!b) return;
    state.onlyPhoto = b.dataset.ph === "1"; $("onlyPhoto").checked = state.onlyPhoto; render();
  });
  $("hideFossil").addEventListener("change", (e) => { state.hideFossil = e.target.checked; render(); });
  $("continents").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    const c = b.dataset.c;
    state.conts.has(c) ? state.conts.delete(c) : state.conts.add(c);
    b.setAttribute("aria-pressed", state.conts.has(c));
    render();
  });
  document.querySelector(".view").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) { state.view = b.dataset.view; save(); render(false); }
  });
  $("reset").addEventListener("click", () => {
    Object.assign(state, { q: "", family: "", genus: "", license: "", status: "", country: "", onlyPhoto: false, hideFossil: true });
    state.conts.clear();
    for (const id of ["q", "family", "license", "status", "country"]) $(id).value = "";
    $("onlyPhoto").checked = false; $("hideFossil").checked = true;
    fillCountries();
    document.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", "false"));
    fillGenus();
    render();
  });
  const more = () => { state.shown += PAGE; render(false); };
  $("more").addEventListener("click", more);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => { if (es[0].isIntersecting && !$("more").hidden && !$("v-arten").hidden) more(); }, { rootMargin: "600px" }).observe($("sentinel"));
  }

  // ---------- Unbestimmte Beobachtungen (iNaturalist)
  const RANK = { order: "Ordnung", suborder: "Unterordnung", infraorder: "Infraordnung", parvorder: "Parvordnung", nanorder: "Nanordnung", epifamily: "Epifamilie", superfamily: "Überfamilie", family: "Familie", subfamily: "Unterfamilie", tribe: "Tribus", subtribe: "Subtribus", genus: "Gattung" };
  let unknownLoaded = false, uShown = 48;
  function renderUnknown() {
    const U = window.MANTODEA_UNBESTIMMT || [];
    $("u-count").textContent = U.length ? `(${fmt.format(U.length)})` : "";
    $("unknown").innerHTML = U.slice(0, uShown).map((o) => `
      <article class="card">
        <div class="img">${imgTag(o, o.t)}</div>
        <p class="credit">${credit(o.p, true)}</p>
        <div class="body">
          <h3>${o.r === "order" ? "Mantodea" : `<i>${esc(o.t)}</i>`} <span class="tag">${esc(RANK[o.r] || o.r)}</span></h3>
          ${o.tn ? `<p class="common">${esc(o.tn)}</p>` : ""}
          <p class="tax">${esc(o.pl || "Ort unbekannt")}${o.d ? " · " + esc(fmtDate(o.d)) : ""}</p>
          <p><a href="${esc(o.p.ref)}" target="_blank" rel="noopener">Auf iNaturalist ansehen ↗</a></p>
          <div class="as-box" data-src="inat" data-id="${esc(o.id)}"></div>
        </div>
      </article>`).join("") || `<p class="empty">Keine Daten.</p>`;
    lazy($("unknown"));
    $("u-more").hidden = uShown >= U.length;
  }
  $("u-more").addEventListener("click", () => { uShown += 48; renderUnknown(); });
  $("unknown").addEventListener("click", async (e) => {
    const im = e.target.closest(".card .img"); if (!im) return;
    const card = im.closest(".card"), box = card.querySelector(".as-box"); if (!box) return;
    const o = (window.MANTODEA_UNBESTIMMT || []).find((x) => String(x.id) === box.dataset.id); if (!o) return;
    const hd = await loadHD(o.k);
    const src = hdSrc(hd && hd.f) || (await imgData(o));
    const ov = document.createElement("div"); ov.className = "map-overlay";
    ov.innerHTML = `<div class="map-ov-head"><b>${esc(o.t || "Mantodea")}</b><button type="button" class="close" aria-label="Schließen">×</button></div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center;min-height:0"><a href="${esc(o.p.ref)}" target="_blank" rel="noopener" style="display:contents"><img src="${src}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;cursor:pointer" title="Original öffnen"></a></div>
      <p style="color:#ddd;font-size:.8rem;text-align:center;margin:8px 0 0">${credit(o.p, false)} · Foto antippen: Original öffnen</p>`;
    ov.addEventListener("click", (ev) => { if (ev.target.tagName === "IMG") return; else if (ev.target.closest(".close") || ev.target === ov) ov.remove(); });
    document.body.appendChild(ov);
  });
  function loadUnknown() {
    if (unknownLoaded) return;
    unknownLoaded = true;
    const sc = document.createElement("script");
    sc.src = "data/unbestimmt.js";
    sc.onload = renderUnknown;
    sc.onerror = () => { $("unknown").innerHTML = `<p class="empty">Daten konnten nicht geladen werden.</p>`; };
    document.head.appendChild(sc);
  }

  // ---------- Status der automatischen Suche
  function renderStatus() {
    const q = STATUS.quellen || {};
    $("run-status").innerHTML = `
      <h3>Letzte Suche: ${STATUS.datum ? esc(fmtDate(STATUS.datum)) : "–"}</h3>
      <div class="stats light">
        <div><b>${fmt.format(STATUS.arten || DATA.length)}</b><span>Arten insgesamt</span></div>
        <div><b>${fmt.format(q.COL || 0)}</b><span>bestätigt (Catalogue of Life)</span></div>
        <div><b>${fmt.format(STATUS.nur_eine_quelle_ausser_col || 0)}</b><span>unsicher (nur andere Quellen)</span></div>
        <div><b>${fmt.format(STATUS.mit_foto || 0)}</b><span>mit Foto</span></div>
        <div><b>${fmt.format(NEW.size)}</b><span>neu seit voriger Suche</span></div>
      </div>
      <p class="muted">Treffer je Quelle: ${Object.entries(q).map(([k, v]) => `${SRC_NAME[k] || k}: ${fmt.format(v)}`).join(" · ")}${STATUS.hinweis ? "<br>" + esc(STATUS.hinweis) : ""}</p>
      ${NEW.size ? `<details><summary>Neu gefundene Namen anzeigen (${fmt.format(NEW.size)})</summary><p class="newlist">${[...NEW].map((n) => `<i>${esc(n)}</i>`).join(", ")}</p></details>` : ""}`;
  }

  // ---------- Bereiche (Tabs)
  const TABS = ["arten", "bestimmen", "mitmachen"];
  let lastTab = "arten";
  function route() {
    const h = location.hash.replace("#", "");
    if (h === "stammbaum") {
      document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === "stammbaum"));
      if (window.MANTODEA_TREE) window.MANTODEA_TREE.open();
      return;
    }
    const tab = h === "unbestimmt" ? "bestimmen" : TABS.includes(h) ? h : "arten";
    lastTab = tab;
    for (const tb of TABS) $("v-" + tb).hidden = tb !== tab;
    $("v-unbestimmt").hidden = tab !== "bestimmen";       // Unbestimmte Mantiden stehen jetzt unter "Bestimmen"
    document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
    if (tab === "bestimmen") loadUnknown();
    if (h === "unbestimmt") setTimeout(() => $("v-unbestimmt").scrollIntoView({ behavior: "smooth" }), 60);
    if (tab === "mitmachen") renderStatus();
    document.dispatchEvent(new CustomEvent("mantodea:tab", { detail: tab }));
  }
  window.addEventListener("hashchange", route);

  // Für community.js
  document.addEventListener("mantodea:tree-closed", () => {
    if (location.hash === "#stammbaum") history.replaceState(null, "", "#" + lastTab);
    document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === lastTab));
  });
  window.MANTODEA_UI = { bigSrc: async (r) => (SA && bigOf(r)) || imgData(r), cname, loadScript, paperHtml, vq, imgData, esc, fmtDate, fmt, DATA, BYKEY, CONT, CONT_ORDER, imgTag, lazy, fill, detail, PLACEHOLDER, credit };

  if (!DATA.length) $("list").innerHTML = `<p class="empty">Die Artendaten (data/species.js) konnten nicht geladen werden.</p>`;
  else render();
  route();
})();
