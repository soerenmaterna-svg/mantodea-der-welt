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
  // Land → Kontinent. Fehlt die Zuordnung in species.js, wird sie aus den Arten selbst abgeleitet
  // (Arten mit genau einem Kontinent: in welchem Kontinent kommt das Land am häufigsten vor?)
  const CCONT = (() => {
    if (M.countries && Object.keys(M.countries).length) return M.countries;
    const z = {};
    for (const s of DATA) if (s.c && s.c.length === 1) for (const cc of s.ct || []) { const t = z[cc] || (z[cc] = {}); t[s.c[0]] = (t[s.c[0]] || 0) + 1; }
    const r = {};
    for (const [cc, t] of Object.entries(z)) r[cc] = Object.entries(t).sort((a, b) => b[1] - a[1])[0][0];
    return r;
  })();
  // Länder aus der Fachliteratur (genannte Länder und Fundorte mit Koordinaten) zählen als belegte Länder
  const LITLAND = window.MANTODEA_LITLAND || {};
  for (const s of DATA) {
    const ll = LITLAND[s.k]; if (!ll) continue;
    s.ct = s.ct || []; s.cn = s.cn || {}; s.c = s.c || [];
    for (const cc of ll) {
      if (!s.ct.includes(cc)) s.ct.push(cc);
      const v = s.cn[cc] || (s.cn[cc] = [0, 0, 0]); v[2] = 1;
      const k = CCONT[cc]; if (k && !s.c.includes(k)) s.c.push(k);
    }
  }
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
    q: "", abc: "", sort: "name", group: "", family: "", genus: "", license: "", status: "", country: "", corder: "alpha", cletter: "",
    conts: new Set(), onlyPhoto: true, hideFossil: true, view: "grid", shown: PAGE,
  };
  try {
    const saved = JSON.parse(localStorage.getItem("mantodea-state") || "{}");
    for (const k of ["sort", "group", "view"]) if (saved[k] != null) state[k] = saved[k];
  } catch (e) { /* egal */ }
  const save = () => { try { localStorage.setItem("mantodea-state", JSON.stringify({ sort: state.sort, group: state.group, view: state.view })); } catch (e) { /* egal */ } };

  // kurzer Platzhalter im schmalen Suchfeld auf dem Handy
  if (matchMedia("(max-width: 600px)").matches) $("q").placeholder = "Suchen …";
  // ---------- Kopfzeile
  const fams = [...new Set(DATA.map((s) => s.f))].sort(coll.compare);
  // Kopfzeilen-Kacheln: werden bei jeder Änderung neu berechnet (auch wenn geschützte Fotos ein-/ausgeblendet werden)
  function drawStats() {
    const live = DATA.filter((s) => !s.x);
    $("stats").innerHTML = [
      [live.length, "rezente Arten"],
      [new Set(DATA.map((s) => s.g)).size, "Gattungen"],
      [fams.filter((f) => !f.startsWith("(")).length, "Familien"],
      [live.filter((s) => s.p || ufOf(s)).length, "Arten mit Foto"],
      // alle eingetragenen Fotos: Galerie (iNaturalist, GBIF, Museen, alte Bücher), Flickr, Titelbilder ohne Galerie, ggf. geschützte
      [DATA.reduce((n, s) => n + (s.gn || 0) + (s.fn || 0) + (s.p && !s.gn && !s.fn ? 1 : 0) + ((ufOf(s) || []).length), 0), "Fotos"],
    ].map(([n, l]) => `<div><b>${fmt.format(n)}</b><span>${l}</span></div>`).join("");
  }
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
  // Nicht frei lizenzierte Fotos (nur GitHub-Fassung): werden direkt von iNaturalist eingebettet, nie kopiert, mit ©-Hinweis
  const UF = (SA && window.MANTODEA_UNFREI) || {};
  // nicht frei lizenzierte Fotos (©) nur in der GitHub-Fassung; ein-/ausblendbar über den Filter "Bildlizenz"
  let ufStart = true; try { ufStart = localStorage.getItem("mantodea-unfrei") !== "0"; } catch (e) { /* egal */ }
  // Fotos aus dem Netz (data/netzfotos.js): frei lizenzierte immer, nicht frei lizenzierte (©) wie oben nur auf Wunsch
  const NF = {};
  if (SA && window.MANTODEA_NETZ) for (const [k, arr] of Object.entries(window.MANTODEA_NETZ.fotos || {})) for (const x of arr) {
    if (x.frei) (NF[k] = NF[k] || []).push(x); else (UF[k] = UF[k] || []).push(x);
  }
  const ufOf = (s) => { if (!SA) return null; const a = [...(NF[s.k] || []), ...(!state.license && UF[s.k] ? UF[s.k] : [])]; return a.length ? a : null; };
  // Literatur mit Abbildungen je Art (Zeitschriften, Bücher) aus data/netzfotos.js
  const netzLit = (s) => { const L = SA && window.MANTODEA_NETZ && (window.MANTODEA_NETZ.lit || {})[s.k]; return L && L.length ? L : null; };
  const litListe = (L) => `<ul class="lit netz-lit">${L.map((x) => `<li>${licChip(x.l, "Lizenz: " + (x.l || "unbekannt"))} <a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.t)}</a>
    <span class="muted">${esc([x.au, x.y].filter(Boolean).join(" "))}${x.j ? " · " + esc(x.j) : ""}${x.sn ? " · " + esc(x.sn) : ""}</span>${x.abb ? ` · <b class="abb">${x.abb} ${x.abb === 1 ? "Abbildung" : "Abbildungen"} der Art</b>` : x.ta ? ` · <span class="abb">Artbeschreibung</span>` : ""}${x.pdf ? ` · <a href="${esc(x.pdf)}" target="_blank" rel="noopener">PDF ↗</a>` : ""}</li>`).join("")}</ul>`;
  const ufImg = (x, alt) => `<img src="${esc(x.u)}" alt="${esc(alt || "")}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
  const ufBadge = (x, big) => (x.frei ? "" : `<span class="cbadge${big ? " big" : ""}" title="nicht frei lizenziert">©</span>`);
  // Lizenz-Schild: kurz und farbig (grün = frei, orange = frei, aber nicht kommerziell, rot = © / unbekannt)
  const licKurz = (l) => {
    l = String(l || "");
    if (/cc0|cc-zero|publicdomain\/zero/i.test(l)) return ["CC0", "frei"];
    if (/gemeinfrei|public domain|pdm/i.test(l)) return ["gemeinfrei", "frei"];
    const m = l.match(/(?:cc[\s-]*)?\b(by(?:[\s-]*(?:nc|sa|nd))*)\b/i);
    if (m && (/creativecommons|cc[\s-]/i.test(l) || /^by\b/i.test(l))) { const k = "CC " + m[1].toUpperCase().replace(/[\s-]+/g, "-"); return [k, /NC|ND/.test(k) ? "nc" : "frei"]; }
    if (/^©|alle rechte|all rights|rechte beim/i.test(l)) return ["©", "zu"];
    if (/open access/i.test(l)) return ["frei lesbar", "nc"];
    return ["?", "zu"];
  };
  const licChip = (l, title) => { const [k, c] = licKurz(l); return `<span class="lic lic-${c}" title="${esc(title || l || "Lizenz unbekannt")}">${esc(k)}</span>`; };
  const ufCredit = (x) => x.frei
    ? `${x.art ? esc(x.art) + " · " : ""}Foto: ${esc(x.by || "unbekannt")} · ${esc(x.l)} · <a href="${esc(x.ref)}" target="_blank" rel="noopener">${esc(x.src || "Quelle")} ↗</a>`
    : `${x.art ? esc(x.art) + " · " : ""}© ${esc(x.by || "Fotograf")} · ${esc(x.l && x.l !== "©" ? x.l : "alle Rechte vorbehalten")} · <a href="${esc(x.ref)}" target="_blank" rel="noopener">${esc(x.src || "iNaturalist")} ↗</a>`;
  const RM = window.MANTODEA_REMOTE || { u: {} };
  const smallUrl = (u) => !u ? u : u.replace("/large.", "/medium.").replace(/\/1024px-/, "/500px-").replace(/_b\.(jpg|png)$/, "_z.$1");
  const TITEL = window.MANTODEA_TITEL || {};
  // Fundorte der Fotos (data/fotoorte.js) und Vorkommen je Art
  let ORTE = null;
  const loadOrte = () => (ORTE ? Promise.resolve(ORTE) : loadScript("data/fotoorte.js").then(() => (ORTE = window.MANTODEA_ORTE || {})).catch(() => (ORTE = {})));
  let enNames = null;
  try { enNames = new Intl.DisplayNames(["en"], { type: "region" }); } catch (e) { /* alter Browser */ }
  function ortOf(ref) {
    const v = ORTE && ref && ORTE[ref]; if (!v) return "";
    const [pl, cc] = v; const land = cc ? cname(cc) : "";
    const en = cc && enNames ? (enNames.of(cc) || "").toLowerCase() : "";
    // Hausnummern, Postleitzahlen und das (englische) Land entfernen, höchstens zwei Ortsteile behalten
    let parts = (pl || "").split(/\s*,\s*/).map((x) => x.trim()).filter((x) => x && !/\d/.test(x))
      .filter((x) => { const l = x.toLowerCase(); return x.toUpperCase() !== cc && !["méxico", "brasil", "españa", "italia", "deutschland", "france", "中国", "日本"].includes(l) && l !== en && l !== (land || "").toLowerCase() && !["usa", "us", "uk"].includes(l); });
    parts = parts.slice(-2);
    return [...parts, land].filter(Boolean).join(", ");
  }
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
    const wort = p.src === "Fachliteratur" ? "Abbildung" : "Foto";
    if (short) return `${wort}: ${esc(p.by || "unbekannt")} · ${esc(lab)} · ${esc(src.length > 40 ? src.slice(0, 38) + "…" : src)}`;
    return `${wort}: <a href="${esc(ref)}" target="_blank" rel="noopener">${esc(p.by || "Urheber siehe Quelle")}</a>` +
      ` · Lizenz: <a href="${url}" target="_blank" rel="noopener license">${esc(lab)}</a>` +
      ` · Quelle: <a href="${esc(ref)}" target="_blank" rel="noopener">${esc(src)}</a>`;
  }
  const PLACEHOLDER = `<div class="ph"><svg class="mt" viewBox="10 15 120 85" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 70 C30 66 46 64 60 63" stroke-width="7"/><path d="M60 63 L92 50" stroke-width="4.5"/><path d="M92 50 L101 43 L104 49 Z" fill="currentColor" stroke-width="2"/><path d="M101 44 Q112 30 118 24 M101 44 Q114 36 122 33" stroke-width="1.2"/><path d="M86 52 L80 66 L94 61" stroke-width="3"/><path d="M94 61 L101 56" stroke-width="2"/><path d="M80 54 L74 68 L87 66" stroke-width="2.6"/><path d="M58 64 L52 80 L48 92 M56 64 L66 80 L72 92 M44 66 L36 82 L30 94 M42 66 L50 84 L56 94" stroke-width="1.8"/><path d="M22 66 C34 56 50 55 62 60" stroke-width="1.5" opacity=".6"/></g></svg><span>Noch kein Foto</span></div>`;

  // ---------- Bedienelemente
  $("family").insertAdjacentHTML("beforeend", fams.map((f) => `<option>${esc(f)}</option>`).join(""));
  function fillGenus() {
    const gs = [...new Set(DATA.filter((s) => !state.family || s.f === state.family).map((s) => s.g))].sort(coll.compare);
    const stern = (g) => (window.MANTODEA_GBK && window.MANTODEA_GBK.has(g) ? " *" : "");
    $("genus").innerHTML = `<option value="">alle Gattungen (${gs.length}) · * = mit Bestimmungsschlüssel</option>` + gs.map((g) => `<option value="${esc(g)}">${esc(g)}${stern(g)}</option>`).join("");
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
    if (state.corder === "alpha" && !q) {
      // erst die Buchstaben, nach Antippen die Länder mit diesem Anfangsbuchstaben
      const letters = {};
      const L0 = (c) => cname(c).normalize("NFD")[0].toUpperCase();
      for (const c of codes) { const l = L0(c); letters[l] = (letters[l] || 0) + 1; }
      if (!state.cletter && state.country) state.cletter = L0(state.country);
      if (!state.cletter) {
        html += `<div class="cd-abc">${Object.keys(letters).sort(coll.compare).map((l) => `<button type="button" data-l="${esc(l)}"><b>${esc(l)}</b><small>${letters[l]} ${letters[l] === 1 ? "Land" : "Länder"}</small></button>`).join("")}</div>`;
      } else {
        html += `<button type="button" class="cd-back" data-l=""><span>‹ alle Buchstaben</span><small>${esc(state.cletter)}</small></button><h3>${esc(state.cletter)}</h3>`;
        html += codes.filter((c) => L0(c) === state.cletter).sort(byName).map(item).join("");
      }
    } else if (state.corder === "alpha") {
      html += codes.sort(byName).map(item).join("");
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
    $("cd-q").value = ""; state.cletter = ""; drawCountryList();
    const d = $("country-dlg"); if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    const on = $("cd-list").querySelector(".on:not(.all)"); if (on) on.scrollIntoView({ block: "center" });
  });
  $("cd-close").addEventListener("click", () => $("country-dlg").close());
  $("country-dlg").addEventListener("click", (e) => { if (e.target === $("country-dlg")) $("country-dlg").close(); });
  $("cd-order").addEventListener("click", (e) => { const b = e.target.closest("button[data-o]"); if (!b) return; state.corder = b.dataset.o; drawCountryList(); $("cd-list").scrollTop = 0; });
  $("cd-q").addEventListener("input", drawCountryList);
  $("cd-list").addEventListener("click", (e) => {
    const lb = e.target.closest("button[data-l]");
    if (lb) { state.cletter = lb.dataset.l; drawCountryList(); $("cd-list").scrollTop = 0; return; }
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
      (!state.onlyPhoto || s.p || ufOf(s)) &&
      (!state.family || s.f === state.family) &&
      (!state.genus || s.g === state.genus) &&
      (!state.abc || s.n[0].toUpperCase() === state.abc) &&
      (state.license !== "commercial" || isCommercial(s.p)) &&
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
      <div class="img">${s.p ? imgTag(s, s.n) : ufOf(s) ? ufImg(ufOf(s)[0], s.n) + ufBadge(ufOf(s)[0]) : PLACEHOLDER}</div>
      ${s.p ? `<p class="credit">${credit(s.p, true)}</p>` : ufOf(s) ? `<p class="credit uf">${ufCredit(ufOf(s)[0])}</p>` : ""}
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
      <td><i>${esc(s.g)}</i></td>
      <td>${esc(s.f)}</td>
      <td>${s.cc.map((c) => CONT[c]).join(", ")}</td>
      <td class="tnum">${fmt.format(s.o)}</td>
    </tr>`;
  }

  const fdlg = $("filter-more");
  const closeFilters = () => { if (fdlg.open) fdlg.close(); else fdlg.removeAttribute("open"); };
  $("filter-toggle").addEventListener("click", () => { if (fdlg.showModal) fdlg.showModal(); else fdlg.setAttribute("open", ""); });
  $("filter-close").addEventListener("click", closeFilters);
  $("fd-x").addEventListener("click", closeFilters);
  fdlg.addEventListener("click", (e) => { if (e.target === fdlg) closeFilters(); });
  fdlg.addEventListener("close", () => $("count").scrollIntoView({ block: "nearest" }));

  // ---------- Schnellfilter: A–Z, Länder, Gattungen direkt; "mehr" öffnet die übrigen Filter
  let pickMode = "";
  function basePick(skip) { const keep = state[skip]; state[skip] = ""; const r = filtered(); state[skip] = keep; return r; }
  function drawPick() {
    const q = $("pk-q").value.trim().toLowerCase(), L = $("pk-list");
    if (pickMode === "abc") {
      const cnt = {}; basePick("abc").forEach((s) => { const l = s.n[0].toUpperCase(); cnt[l] = (cnt[l] || 0) + 1; });
      L.innerHTML = `<div class="pk-abc"><button type="button" data-v="" class="all ${state.abc ? "" : "on"}">alle</button>` +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => `<button type="button" data-v="${l}" class="${l === state.abc ? "on" : ""}"${cnt[l] ? "" : " disabled"}><b>${l}</b><small>${fmt.format(cnt[l] || 0)}</small></button>`).join("") + `</div>`;
    } else {
      const cnt = {}; basePick("genus").forEach((s) => { cnt[s.g] = (cnt[s.g] || 0) + 1; });
      const gs = Object.keys(cnt).filter((g) => !q || g.toLowerCase().includes(q)).sort(coll.compare);
      let html = q ? "" : `<p class="muted small gb-stern-info"><b class="gb-stern">*</b> = mit Bestimmungsschlüssel für die Arten</p><button type="button" data-v="" class="all ${state.genus ? "" : "on"}"><span>alle Gattungen</span><small>${fmt.format(Object.keys(cnt).length)}</small></button>`, last = "";
      for (const g of gs) { if (!q && g[0] !== last) { html += `<h3>${esc(g[0])}</h3>`; last = g[0]; }
        html += `<button type="button" data-v="${esc(g)}" class="${g === state.genus ? "on" : ""}"><span><i>${esc(g)}</i>${window.MANTODEA_GBK && window.MANTODEA_GBK.has(g) ? ` <b class="gb-stern" title="Mit Bestimmungsschlüssel">*</b>` : ""}</span><small>${fmt.format(cnt[g])}</small></button>`; }
      L.innerHTML = html || `<p class="muted">Keine Gattung gefunden.</p>`;
    }
  }
  function openPick(mode) {
    pickMode = mode; $("pk-title").textContent = mode === "abc" ? "Anfangsbuchstabe der Art" : "Gattung wählen";
    $("pk-q").value = ""; $("pk-q").parentElement.hidden = mode === "abc"; drawPick();
    const d = $("pick-dlg"); if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    const on = $("pk-list").querySelector(".on:not(.all)"); if (on) on.scrollIntoView({ block: "center" });
  }
  function drawQuick() {
    $("qf-abc").textContent = state.abc ? `A–Z: ${state.abc}` : "A–Z";
    $("qf-land").textContent = state.country ? cname(state.country) : "Länder";
    $("qf-gen").innerHTML = state.genus ? `<i>${esc(state.genus)}</i>` : "Gattungen";
    document.querySelectorAll(".qf-b[data-qf]").forEach((b) => b.classList.toggle("set", !!{ abc: state.abc, land: state.country, gen: state.genus }[b.dataset.qf]));
  }
  document.querySelector(".qf").addEventListener("click", (e) => {
    const b = e.target.closest("[data-qf]"); if (!b) return;
    if (b.dataset.qf === "land") $("country-btn").click(); else openPick(b.dataset.qf);
  });
  $("pk-q").addEventListener("input", drawPick);
  $("pk-close").addEventListener("click", () => $("pick-dlg").close());
  $("pick-dlg").addEventListener("click", (e) => { if (e.target === $("pick-dlg")) $("pick-dlg").close(); });
  $("pk-list").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-v]"); if (!b) return;
    if (pickMode === "abc") state.abc = b.dataset.v;
    else { state.genus = b.dataset.v; $("genus").value = state.genus; }
    $("pick-dlg").close(); render();
  });

  // Aktive Auswahl als entfernbare Chips über der Artenliste
  const optText = (id) => { const o = $(id).selectedOptions[0]; return o ? o.textContent.replace(/\s*\(\d[\d.]*\)\s*$/, "") : ""; };
  function activeChips() {
    const c = [];
    if (state.sort !== "name") c.push(["sort", "Sortierung", optText("sort")]);
    if (state.group) c.push(["group", "Gruppiert", optText("group")]);
    if (state.family) c.push(["family", "Familie", state.family]);
    if (state.abc) c.push(["abc", "Anfangsbuchstabe", state.abc]);
    if (state.genus) c.push(["genus", "Gattung", state.genus]);
    if (state.country) c.push(["country", "Land", cname(state.country)]);
    for (const k of state.conts) c.push(["cont:" + k, "Kontinent", CONT[k]]);
    if (state.status) c.push(["status", "Status", optText("status")]);
    if (state.license) c.push(["license", "Bildlizenz", state.license === "frei" ? "ohne nicht freie Fotos (©)" : "nur kommerziell nutzbar"]);
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
    else if (k === "abc") { state.abc = ""; }
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
    return [state.abc, state.family, state.genus, state.license, state.status, state.country, !state.hideFossil].filter(Boolean).length + state.conts.size;
  }
  let current = [];
  function render(resetShown = true) {
    const nf = activeFilters();
    $("filter-badge").textContent = nf ? String(nf) : "";
    drawActive(); drawQuick(); drawStats();
    if (resetShown) state.shown = PAGE;
    current = filtered().sort(SORTS[state.sort]);
    const groups = grouped(current);
    const total = groups.reduce((n, [, l]) => n + l.length, 0);
    // Anzahl klar als Ergebnis der gewählten Filter beschreiben
    const nArt = `<b>${fmt.format(current.length)} ${current.length === 1 ? "Art" : "Arten"}</b>`;
    const by = [state.q.trim() ? "Suche" : "", nf ? (nf === 1 ? "Filter" : `${nf} Filter`) : ""].filter(Boolean).join(" und ");
    // Die Trefferzahl erscheint erst, wenn gesucht oder gefiltert wird
    $("count-text").hidden = !by;
    const nWith = current.filter((x) => x.p || ufOf(x)).length, nAll = (() => { const w = state.onlyPhoto; state.onlyPhoto = false; const r = filtered().length; state.onlyPhoto = w; return r; })();
    $("count-text").innerHTML = (by ? `Ergebnis für Ihre Filter: <b>${fmt.format(nWith)} ${nWith === 1 ? "Art" : "Arten"}</b> mit Foto / <b>${fmt.format(nAll)} ${nAll === 1 ? "Art" : "Arten"}</b> gesamt`
      : `${state.onlyPhoto ? `${nArt} mit Foto` : `Alle ${nArt}`} · kein Filter gesetzt`) +
      (state.group ? ` in ${fmt.format(groups.length)} ${groups.length === 1 ? "Gruppe" : "Gruppen"}` : "");
    let budget = state.shown, html = "";
    for (const [title, list] of groups) {
      if (budget <= 0) break;
      const part = list.slice(0, budget);
      budget -= part.length;
      if (title != null) html += `<h2 class="group">${esc(title)} <small>${fmt.format(list.length)}</small></h2>`;
      if (state.view === "grid") html += `<div class="cards">${part.map(card).join("")}</div>`;
      else html += `<div class="tablewrap"><table><thead><tr><th></th><th>Art</th><th>Gattung</th><th>Familie</th><th>Kontinente</th><th class="tnum">Funde</th></tr></thead><tbody>${part.map(row).join("")}</tbody></table></div>`;
    }
    if (!current.length) html = `<p class="empty">Keine Art passt zu diesen Filtern.</p>`;
    // Kurz-Bestimmung der Arten, wenn eine Gattung gewählt ist (gbestimmung.js)
    const GBK = window.MANTODEA_GBK;
    if (state.genus && GBK && GBK.has(state.genus)) html = GBK.html(state.genus) + html;
    if (io) io.disconnect();
    $("list").innerHTML = html;
    if (GBK) GBK.einpassen($("list"));
    lazy($("list"));
    $("fd-count").textContent = `${fmt.format(current.length)} ${current.length === 1 ? "Art" : "Arten"} anzeigen`;
    $("more").hidden = state.shown >= total;
    $("more").textContent = `Weitere Arten anzeigen (${fmt.format(Math.max(0, total - state.shown))} übrig)`;
    { const was = state.onlyPhoto; state.onlyPhoto = false; const base = filtered(); state.onlyPhoto = was;
      $("ph-all").textContent = fmt.format(base.length); $("ph-with").textContent = fmt.format(base.filter((s) => s.p || ufOf(s)).length); }
    const sw = $("photo-switch"); sw.classList.toggle("on", state.onlyPhoto);
    sw.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.ph === "1") === state.onlyPhoto)));
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
  // PDFs aus der Sammlung (nur GitHub-Fassung): eigene Seite pdf/ zeigt "PDF wird geladen" mit Fortschrittsbalken und öffnet
  // das PDF danach sofort. Dropbox erlaubt das Laden von dl.dropboxusercontent.com (CORS). Im claude.ai-Artifact sind fremde
  // Abrufe gesperrt – dort öffnet der Link wie bisher direkt.
  document.addEventListener("click", (ev) => {
    // Literaturliste: schrittweise je 25 weitere aufklappen, am Ende wieder zuklappen (kein eigener Scrollbereich)
    const b = ev.target.closest("button.dbx-alle"); if (!b) return;
    const zu = [...b.previousElementSibling.querySelectorAll("li.dbx-mehr")];
    const versteckt = zu.filter((x) => x.hidden);
    if (!versteckt.length) {
      zu.forEach((x) => { x.hidden = true; });
      b.closest("details").scrollIntoView({ block: "nearest" });
    } else versteckt.slice(0, 25).forEach((x) => { x.hidden = false; });
    const rest = zu.filter((x) => x.hidden).length;
    b.textContent = rest ? `▾ ${Math.min(25, rest)} weitere anzeigen (noch ${rest})` : "▴ Weniger anzeigen";
  });
  document.addEventListener("click", async (ev) => {
    const a = ev.target.closest("a.erst, ul.dbx a, a.lit-q, a.gb-pdf");
    if (!a || !SA || ev.ctrlKey || ev.metaKey || ev.shiftKey || !/dropbox\.com/.test(a.href)) return;
    ev.preventDefault();
    const titel = (a.getAttribute("title") || a.textContent || "PDF").trim().replace(/\s+/g, " ");
    // eigene Anzeige-Seite: Ladebalken, danach sofort das PDF (auch auf Handys ohne eingebaute PDF-Anzeige)
    const ziel = "pdf/#" + new URLSearchParams({ u: a.href, t: titel, ...(a.dataset.seite ? { s: a.dataset.seite } : {}) }).toString();
    if (!window.open(ziel, "_blank")) location.href = ziel;
  });

  // Originalbeschreibung der Art aus der Literatursammlung (Dropbox), als PDF-Knopf unter dem Namen
  async function fillErst(s) {
    const box = $("d-erst"); if (!box) return;
    try { await Promise.all([loadScript("data/erstbeschreibung.js"), loadScript("data/erst_netz.js").catch(() => null), loadScript("data/literatur.js").catch(() => null)]); } catch (e) { return; }
    const E = (window.MANTODEA_ERST || {})[s.n], N = (window.MANTODEA_ERSTNETZ || {})[s.n], LO = ((window.MANTODEA_LIT || {})[s.k] || {});
    if (!box.isConnected || $("d-body").dataset.k != s.k) return;
    const kurzT = (x) => x.length > 60 ? x.slice(0, 57).replace(/\s+\S*$/, "") + " …" : x;
    const teile = [];
    const dbx = () => {
      // raw=1: der Browser zeigt die PDF direkt an, ohne Dropbox-Vorschau oder Rückfrage
      const pdfUrl = E.u.replace(/([?&])dl=0/, "$1raw=1");
      return `<a class="erst" href="${esc(pdfUrl)}" target="_blank" rel="noopener" title="${esc(E.j + " – " + E.t)}">
      <span class="pdf">PDF</span><span class="et"><b>Erstbeschreibung${E.sicher ? "" : " (vermutlich)"}</b><span>${esc(E.j)} · ${esc(kurzT(E.t))}</span></span><span class="go">↗</span></a>`;
    };
    // Online-Fundstelle (Biodiversity Heritage Library: Seite im Original geprüft; DOI: Artikel)
    const netz = () => {
      const sym = N.q === "bhl" ? "BHL" : "DOI";
      const was = N.q === "bhl" ? "Originalseite in der Biodiversity Heritage Library" : "Artikel online (DOI)";
      return `<a class="erst netz" href="${esc(N.pdf || N.u)}" target="_blank" rel="noopener" title="${esc(was + ": " + (N.c || "") + (N.s ? ", S. " + N.s : ""))}">
      <span class="pdf">${sym}</span><span class="et"><b>Erstbeschreibung online</b><span>${esc(N.c || N.t || "")}${N.s ? ", S. " + esc(N.s) : ""}</span></span><span class="go">↗</span></a>`;
    };
    if (E && E.sicher) teile.push(dbx());
    else {
      if (N && N.u) teile.push(netz());
      if (E) teile.push(dbx());
    }
    if (!teile.length) {
      // keine Datei gefunden: zumindest die Literaturangabe mit Suche in BHL und Google Scholar
      const c = (N && N.c) || LO.o || "", pg = (N && N.s) || LO.op || "";
      teile.push(`<span class="erst nur"><span class="pdf">?</span><span class="et"><b>Erstbeschreibung</b><span>${c ? esc(c) + (pg ? ", S. " + esc(pg) : "") : esc(s.n + " " + (s.a || ""))}</span>
        <span class="such">noch keine frei zugängliche Fassung gefunden · <a href="${bhlSearch((c || s.n).replace(/[().,]/g, " "))}" target="_blank" rel="noopener">in BHL suchen ↗</a> · <a href="${scholar((c ? c + " " : "") + s.n)}" target="_blank" rel="noopener">Google Scholar ↗</a></span></span></span>`);
    }
    box.innerHTML = teile.join("");
  }
  // Verbleib der Typusexemplare (data/typen.js): Museum, Status, Katalognummer, Quelle
  async function fillTypen(s) {
    const box = $("d-typ"); if (!box) return;
    try { await loadScript("data/typen.js"); } catch (e) { return; }
    if (!box.isConnected || $("d-body").dataset.k != s.k) return;
    const T = ((window.MANTODEA_TYPEN || {}).t || {})[s.k];
    const gbifSuche = `https://www.gbif.org/occurrence/search?q=${encodeURIComponent(s.n)}&type_status=HOLOTYPE&type_status=LECTOTYPE&type_status=SYNTYPE&type_status=TYPE&type_status=NEOTYPE`;
    if (!T) { box.innerHTML = `<details class="d-zeile d-typ leer"><summary>🏛️ <span class="dz-t">Typus:</span> <span class="muted">Verbleib nicht verzeichnet</span></summary><p class="muted small">In GBIF, Plazi und im Species File ist kein Verbleib der Typusexemplare verzeichnet. Angaben stehen meist in der Erstbeschreibung. <a href="${gbifSuche}" target="_blank" rel="noopener">Bei GBIF suchen ↗</a> · <a href="https://mantodea.speciesfile.org/" target="_blank" rel="noopener">Species File ↗</a></p></details>`; return; }
    const ort = (r) => r.m ? `${esc(r.m)}${r.c ? ` <span class="muted">(${esc(r.c)})</span>` : ""}` : esc(r.c);
    const li = (r) => `<li><b>${esc(r.n > 1 && !/en$/.test(r.s) ? r.s.replace(/us$/, "en") : r.s)}</b>${r.n > 1 ? ` <span class="muted">${r.sx || r.n + " Exemplare"}</span>` : r.sx ? " " + esc(r.sx) : ""} – ${ort(r)}${r.nr && r.nr.length ? ` <span class="muted small">· Nr. ${esc(r.nr.join(", "))}</span>` : ""}${r.als ? ` <span class="muted small">· beschrieben als <i>${esc(r.als)}</i></span>` : ""}${r.fo ? ` <span class="muted small">· Fundort: ${esc(r.fo)}</span>` : ""} <a class="small" href="${esc(r.u)}" target="_blank" rel="noopener"${r.x ? ` title="${esc(r.x)}"` : ""}>${esc(r.q)} ↗</a></li>`;
    const kurz = (r) => r.c || (r.m || "").split(",")[0];
    const stw = (r) => (r.n > 1 && !/en$/.test(r.s) ? r.s.replace(/us$/, "en") : r.s);
    const zus = [...new Map(T.map((r) => [stw(r) + "|" + kurz(r), r])).values()];
    const zeile = zus.slice(0, 3).map((r) => `${esc(stw(r))}${r.sx && r.n === 1 ? " " + esc(r.sx) : ""} <b>${esc(kurz(r))}</b>`).join(" · ") + (zus.length > 3 ? ` · +${zus.length - 3}` : "");
    box.innerHTML = `<details class="d-zeile d-typ"><summary>🏛️ <span class="dz-t">Typus:</span> ${zeile}</summary><ul>${T.map(li).join("")}</ul>
      <p class="muted small">Automatisch zusammengestellt aus den Sammlungsdaten der Museen (GBIF), aus dem Mantodea Species File, aus Fachartikeln (Plazi) und MantID; nicht vollständig. Holo-, Lekto-, Neo- und Syntypen sind die namenstragenden Typen. <a href="${gbifSuche}" target="_blank" rel="noopener">Bei GBIF suchen ↗</a></p></details>`;
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
      const oaLink = `https://openalex.org/works?filter=fulltext.search:%22${encodeURIComponent(s.n)}%22`;
      if (w && w.p.length) h += `<h4>Zeitschriften, Bücher und Artikel, in denen die Art vorkommt <small>(OpenAlex-Volltextsuche, ${fmt.format(w.n)} Treffer)</small></h4><ul class="lit">${w.p.map((p) =>
        `<li>${p.l !== undefined ? licChip(p.l || (p.oa ? "Open Access, Lizenz nicht angegeben" : "©"), p.l ? "Lizenz: " + p.l : p.oa ? "frei lesbar (Open Access), Lizenz nicht angegeben" : "Rechte beim Verlag") + " " : ""}<a href="${esc(p.u)}" target="_blank" rel="noopener">${esc(p.t)}</a> <span class="muted">${esc([p.au, p.s, p.y].filter(Boolean).join(", "))}</span>${p.oa && p.pdf ? ` · <a href="${esc(p.pdf)}" target="_blank" rel="noopener">frei lesbar ↗</a>` : p.oa ? ` <span class="muted small">(frei lesbar)</span>` : ""}</li>`).join("")}</ul>
        ${w.n > w.p.length ? `<p class="small"><a href="${oaLink}" target="_blank" rel="noopener">Alle ${fmt.format(w.n)} Treffer bei OpenAlex ansehen ↗</a></p>` : ""}`;
      else if (!w && OA.abgedeckt < OA.arten) h += `<p class="muted small">Die Fachartikel-Suche bei OpenAlex läuft schrittweise jede Nacht. Für diese Art ist sie noch nicht erfolgt (${fmt.format(OA.abgedeckt)} von ${fmt.format(OA.arten)} Arten erledigt). <a href="${oaLink}" target="_blank" rel="noopener">Jetzt direkt bei OpenAlex suchen ↗</a></p>`;
    } catch (e) { /* OpenAlex-Daten noch nicht vorhanden */ }
    // Eigene Literatursammlung in Dropbox (PDFs bleiben dort; Zuordnung über data/dropbox.js)
    try {
      await loadScript("data/dropbox.js");
      const D = window.MANTODEA_DBX;
      if (D && D.ordner) {
        const link = (f) => (f.u ? f.u.replace(/([?&])dl=0/, "$1raw=1") : D.ordner + "&preview=" + encodeURIComponent(f.n));
        const A = D.arten[s.n] || [], G = (D.gattungen[s.g] || []).filter((i) => !A.includes(i)), Fm = (D.familien[s.f] || []).filter((i) => !A.includes(i) && !G.includes(i));
        const sortJ = (ids) => ids.map((i) => D.dateien[i]).sort((a, b) => (parseInt((b.j.match(/\d{4}/) || [0])[0]) - parseInt((a.j.match(/\d{4}/) || [0])[0])));
        const li = (f) => `<li><a href="${esc(link(f))}" target="_blank" rel="noopener">📄 ${esc(f.t || f.n)}</a>${f.j ? ` <span class="muted">(${esc(f.j)})</span>` : ""}</li>`;
        // ohne eigenen Scrollbereich: die neuesten 8 sichtbar, der Rest schrittweise ausklappbar
        const ZEIG = 8;
        const block = (ids, title, open) => {
          if (!ids.length) return "";
          const fs = sortJ(ids), rest = fs.length - ZEIG;
          return `<details class="dbx-g"${open ? " open" : ""}><summary>${title} <small>${ids.length}</small></summary><ul class="lit dbx">${fs.map((f, i) => i < ZEIG ? li(f) : li(f).replace("<li>", '<li class="dbx-mehr" hidden>')).join("")}</ul>${rest > 0
            ? `<button type="button" class="dbx-alle">▾ ${Math.min(25, rest)} weitere anzeigen (noch ${rest})</button>` : ""}</details>`;
        };
        const total = A.length + G.length + Fm.length;
        h += `<h4>📚 Literatursammlung (Dropbox)${total ? ` <small>${total}</small>` : ""}</h4>`;
        if (total) h += block(A, `zur Art <i>${esc(s.n)}</i>`, A.length && A.length <= 40) + block(G, `zur Gattung <i>${esc(s.g)}</i>`, !A.length && G.length <= 25) + block(Fm, `zur Familie ${esc(s.f)}`, false)
          + `<p class="muted small">Zugeordnet über den Namen im Dateititel, neueste Arbeiten zuerst. Die PDFs liegen in der Dropbox-Sammlung (${fmt.format(D.anzahl || 0)} Dateien).</p>`;
        else h += `<p class="muted small">Im Titel keiner PDF der Sammlung kommt diese Art, ihre Gattung oder Familie vor.</p>`;
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
    try { await Promise.all([loadScript("data/synonyme.js"), loadScript("data/gattungen.js").catch(() => null)]); } catch (e) { return; }
    const D = (window.MANTODEA_SYN || {})[s.k];
    const card = $("d-syn-card");
    if (card) card.hidden = false;
    if (!D || !D.s.length) {
      // keine Synonyme: ausdrücklich sagen, dass nur dieser Name gilt
      const j = (String(s.a || "").match(/(1[789]\d\d|20\d\d)/) || [])[1];
      const kl = /^\(/.test(String(s.a || "").trim());
      box.innerHTML = `<h3 class="d-h">Namensgeschichte <small>keine Synonyme</small></h3>
        <p class="nz-einzig">✓ <i>${esc(s.n)}</i> <span class="muted">${esc(s.a || "")}</span> – ${kl
          ? `einziger bekannter Name dieser Art in der heutigen Gattung. Ursprünglich wurde sie${j ? " " + j : ""} in einer anderen Gattung beschrieben (Autor in Klammern); die frühere Kombination ist in den Daten nicht aufgeführt.`
          : `einziger gültiger Name seit der Erstbeschreibung${j ? " " + j : ""}. Es sind keine anderen Namen (Synonyme) bekannt.`}</p>
        <p class="muted small">Quelle: Catalogue of Life (Mantodea Species File).</p>`;
      return;
    }
    const Y1 = new Date().getFullYear();
    const GJ = Object.assign({ Gryllus: [1758, "Linnaeus"], Mantis: [1758, "Linnaeus"] }, D_g(), ((window.MANTODEA_TAXA || {}).g) || {});
    const jahr = (a) => { const m = String(a || "").match(/(1[789]\d\d|20\d\d)/); return m ? +m[1] : null; };
    const gj = (name) => (GJ[name.split(" ")[0]] || [])[0] || null;
    const beschr = jahr(s.a) || jahr(D.a);
    // 1) Namenslinie derselben Beschreibung (Originalname + spätere Gattungswechsel). Eine Kombination kann frühestens
    //    gelten, seit es ihre Gattung gibt – daraus ergibt sich die ungefähre Reihenfolge.
    const homo = D.s.filter((r) => r[3] === "homotypisch").map((r) => ({ n: r[0], a: r[1], orig: !/^\(/.test((r[1] || "").trim()) }));
    const gueltig = { n: s.n, a: D.a || s.a, orig: !/^\(/.test((D.a || s.a || "").trim()), jetzt: true };
    const linie = [...homo, gueltig].map((x) => {
      const g = gj(x.n);
      x.ab = x.orig ? beschr : (beschr && g ? Math.max(beschr, g) : g || null);
      x.ca = !x.orig;                       // Jahr nur abgeleitet (Gattung), nicht belegt
      return x;
    });
    const alt = linie.filter((x) => !x.jetzt).sort((a, b) => (b.orig - a.orig) || ((a.ab || 9999) - (b.ab || 9999)));
    const reihe = [...alt, gueltig];
    if (!gueltig.orig && !alt.some((x) => x.orig) && beschr) reihe.unshift({ n: "Originalname", a: "", orig: true, ab: beschr, ca: false, unbekannt: true });
    reihe.forEach((x, i) => {
      const nx = reihe.slice(i + 1).find((y) => y.ab);
      x.bis = x.jetzt ? null : nx && x.ab && nx.ab > x.ab ? nx.ab : null;
    });
    const fa = ["#8d6e63", "#c08b3e", "#7b8f3a", "#5f8fa8", "#9b6bb3", "#b5654a"];
    reihe.forEach((x, i) => { x.farbe = x.jetzt ? "#3f7d3a" : fa[i % fa.length]; });
    const Y0 = Math.max(1750, Math.min(...[beschr, ...D.s.map((r) => r[2])].filter(Boolean), Y1) - 15);
    const pos = (y) => ((Math.max(Y0, Math.min(Y1, y)) - Y0) / (Y1 - Y0)) * 100;
    const zr = (x) => x.jetzt ? (x.ab ? `${x.ca ? "seit ca. " : "seit "}${x.ab}` : "heute")
      : x.ab && x.bis ? `${x.ca ? "ca. " : ""}${x.ab} – ca. ${x.bis}` : x.ab ? `ab ${x.ca ? "ca. " : ""}${x.ab}, zeitweise` : "Zeitraum unbekannt";
    const was = (x) => x.jetzt ? "heute gültiger Name" : x.unbekannt ? "Originalname (in den Daten nicht genannt)" : x.orig ? "Originalname der Erstbeschreibung" : "frühere Gattungs-Zuordnung";
    // Zeitstrahl: farbige Abschnitte nacheinander
    let strahl = "";
    reihe.forEach((x) => {
      if (!x.ab) return;
      const bis = x.jetzt ? Y1 : (x.bis || Math.min(Y1, x.ab + 10));
      strahl += `<span class="nz-seg${x.bis || x.jetzt ? "" : " offen"}" style="left:${pos(x.ab)}%;width:${Math.max(.8, pos(bis) - pos(x.ab))}%;background:${x.farbe}" title="${esc(x.n)}: ${zr(x)}"></span>`;
    });
    const achse = [Y0, ...[1800, 1850, 1900, 1950, 2000].filter((y) => y > Y0 + 12 && y < Y1 - 12), Y1]
      .map((y) => `<span style="left:${pos(y)}%">${y}</span>`).join("");
    const zeile = (x) => `<li class="nz-row${x.jetzt ? " jetzt" : ""}"><span class="nz-dot" style="background:${x.farbe}"></span>
        <span class="nz-zeit">${zr(x)}</span>
        <span class="nz-name">${x.unbekannt ? `<span class="muted">${was(x)}</span>` : `<i>${esc(x.n)}</i> <span class="muted">${esc(x.a)}</span>`}
        ${x.unbekannt ? "" : `<small class="nz-was">${x.jetzt ? "✓ " : ""}${was(x)}</small>`}</span></li>`;
    // 2) Eigenständige Beschreibungen, die sich als dieselbe Art herausgestellt haben
    const hetero = D.s.filter((r) => r[3] !== "homotypisch" && !(r[0] === s.n && !r[1]));
    const status = (r) => !r[2] ? "Jahr unbekannt" : beschr && r[2] > beschr ? `${r[2]} als eigene Art beschrieben – später als dieselbe Art erkannt (jüngerer Name, daher ungültig)`
      : beschr && r[2] < beschr ? `${r[2]} beschrieben – älter als der gültige Name, aber nicht verwendbar (z. B. unkenntlich oder vergeben)` : `${r[2]} beschrieben – gleich alt, gültiger Name wurde bevorzugt`;
    const hz = (r) => `<li class="nh-row"><div class="nh-name"><i>${esc(r[0])}</i> <span class="muted">${esc(r[1])}</span>
        <small>${status(r)}${r[4] ? ` · <span class="muted">${esc(r[4])}${r[5] ? ", S. " + esc(r[5]) : ""}</span>` : ""}</small></div>
        <div class="nh-bar">${r[2] ? `<span style="left:${pos(r[2])}%;width:${100 - pos(r[2])}%"></span><b style="left:${pos(r[2])}%">${r[2]}</b><em>heute ungültig</em>` : ""}</div></li>`;
    box.innerHTML = `<h3 class="d-h">Namensgeschichte <small>${reihe.length - 1 + hetero.length} ${reihe.length - 1 + hetero.length === 1 ? "weiterer Name" : "weitere Namen"}</small></h3>
      ${reihe.length > 1 ? `<h4 class="nz-h">Welcher Name galt wann?</h4>
      <div class="nz-strahl">${strahl}</div><div class="nz-achse">${achse}</div>
      <ol class="nz">${reihe.map(zeile).join("")}</ol>` : `<p class="nz-einzig">✓ <i>${esc(s.n)}</i> <span class="muted">${esc(gueltig.a)}</span> gilt seit der Erstbeschreibung${beschr ? " " + beschr : ""} unverändert.</p>`}
      ${hetero.length ? `<h4 class="nz-h">Andere Beschreibungen derselben Art <small>${hetero.length}</small></h4>
      <p class="muted small nz-erk">Diese Namen wurden als eigene Arten beschrieben und gelten heute als Synonyme. Der Balken zeigt, seit wann es den Namen gibt; wann er eingezogen wurde, ist in den Daten nicht angegeben.</p>
      <ul class="nh">${hetero.map(hz).join("")}</ul>` : ""}
      <p class="muted small">„ca.“: abgeleitet aus dem Jahr, in dem die jeweilige Gattung beschrieben wurde – früher kann die Kombination nicht gegolten haben. Quelle: Catalogue of Life (Mantodea Species File). Nach der Prioritätsregel gilt der älteste verfügbare Name.</p>`;
  }
  const D_g = () => (window.MANTODEA_SYN || {})._g || {};

  // ---------- Ungereimtheiten (automatische Prüfung der Literatur- und Namensdaten)
  // Bei der Art nur ein aufklappbarer Hinweis; die vollständige Liste mit Erklärungen steht unten bei den Quellen.
  async function fillUng(s) {
    const box = $("d-ung"); if (!box) return;
    try { await loadScript("data/ungereimtheiten.js"); } catch (e) { return; }
    const U = window.MANTODEA_UNG, hits = U && U.a[s.n];
    if (!hits || !hits.length || !box.isConnected || $("d-body").dataset.k != s.k) return;
    const zeilen = hits.map(([pi, fi]) => { const p = U.p[pi];
      return `<li><b>${esc(p.t)}:</b> ${esc(p.f[fi])} <a href="#ung-${p.id}" data-ung="${p.id}">Erklärung (${p.id}) →</a></li>`; }).join("");
    box.innerHTML = `<details class="d-zeile ung-art"><summary>📚 <span class="dz-t">Literatur:</span> abweichende Angaben <small>${hits.length}</small></summary>
      <ul>${zeilen}</ul>
      <p class="muted small">In der Literatur und den Datenbanken weichen Angaben zu dieser Art voneinander ab (automatischer Abgleich, Stand ${esc(U.stand)}) – zum Nachprüfen, keine bestätigte Korrektur. <a href="#ungereimtheiten" data-ung="">Alle Abweichungen mit Erklärung →</a></p></details>`;
  }
  async function renderUng() {
    const body = $("ung-body"); if (!body || body.dataset.done) return;
    try { await loadScript("data/ungereimtheiten.js"); } catch (e) { body.innerHTML = `<p class="muted">Liste konnte nicht geladen werden.</p>`; return; }
    const U = window.MANTODEA_UNG; body.dataset.done = 1;
    body.innerHTML = `<p>Die Beschreibungen der Gottesanbeterinnen stammen aus über 250 Jahren. Frühere Bearbeiter kannten die Arbeiten der anderen oft nicht: Arten wurden doppelt beschrieben, Namen mehrfach vergeben oder falsch zugeordnet, und heutige Datenbanken übernehmen solche Widersprüche. Eine automatische Prüfung aller ${fmt.format(DATA.length)} Arten (Artenliste, Originalbeschreibungen, Fachliteratur, Synonyme, Erstbeschreibungs-PDFs, Gattungsjahre) hat die folgenden Abweichungen gefunden. Jeder Punkt ist ein Hinweis zum Prüfen, keine fertige Korrektur – manche Abweichungen sind fachlich begründet (z. B. Druck- gegenüber Erscheinungsjahr oder geschützte Namen). Bei den betroffenen Arten steht eine aufklappbare Zeile „Literatur: abweichende Angaben“.</p>
      <p class="muted small">Stand der Prüfung: ${esc(U.stand)} · ${fmt.format(Object.keys(U.a).length)} Arten mit mindestens einem Hinweis</p>
      ${U.p.map((p) => `<details class="ung-p" id="ung-${p.id}"><summary><b>${p.id}</b> ${esc(p.t)}${p.f.length ? ` <small>${fmt.format(p.f.length)}</small>` : ""}</summary>
        <p>${esc(p.e)}</p>${p.f.length ? `<ul>${p.f.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</details>`).join("")}`;
  }
  let ungSprung = false;   // während des Sprungs zur Liste keine weiteren Arten nachladen
  async function showUng(id) {
    const d = $("ungereimtheiten"); if (!d) return;
    ungSprung = true; setTimeout(() => { ungSprung = false; }, 4000);
    d.open = true; await renderUng();
    const t = (id && $("ung-" + id)) || d;
    if (t !== d) t.open = true;
    t.classList.add("ung-hl"); setTimeout(() => t.classList.remove("ung-hl"), 2500);
    // die Artenliste lädt beim Scrollen weiter nach: so lange nachfassen, bis die Stelle ruhig oben steht
    let n = 0;
    const hin = () => { t.scrollIntoView({ block: "start" }); const y = t.getBoundingClientRect().top;
      if (++n < 15 && (y > 90 || y < 0)) setTimeout(hin, 200); };
    setTimeout(hin, 60);
  }
  { const d = $("ungereimtheiten"); if (d) d.addEventListener("toggle", () => { if (d.open) renderUng(); }); }
  $("d-body").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-ung]"); if (!a) return;
    e.preventDefault(); $("detail").close(); showUng(a.dataset.ung);
  });

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
  // Drei feste Felder; Zuordnung automatisch aus den iNaturalist-Angaben, von Hand per Drag & Drop korrigierbar
  const GRP = { w: "Weibchen", m: "Männchen", x: "Weitere Fotos" };
  const GRUPPE = window.MANTODEA_GRUPPEN || {};     // fest übernommene Korrekturen (aus dem nächtlichen Lauf)
  const liveGroup = {};                              // Korrekturen aus der Datenbank
  const autoGroup = (a) => { a = a || ""; return a.includes("♀") ? "w" : a.includes("♂") ? "m" : "x"; };
  const groupOfItem = (g) => liveGroup[g.ref] || GRUPPE[g.ref] || autoGroup(g.a);
  async function fillGallery(s) {
    const box = $("d-gal");
    galItems = [];
    if (!box) return;
    const ufHtml = () => {
      const all = ufOf(s) || [], fr = all.filter((x) => x.frei), u = all.filter((x) => !x.frei);
      const th = (x) => `<a class="gthumb uf" href="${esc(x.ref)}" target="_blank" rel="noopener" title="${esc((x.art ? x.art + " – " : "") + (x.frei ? x.by + " · " + x.l : "© " + x.by + " – " + (x.l && x.l !== "©" ? x.l : "alle Rechte vorbehalten")))}">${ufImg(x, s.n)}${ufBadge(x)}${licChip(x.l, "Lizenz: " + (x.l || "unbekannt"))}</a>`;
      return (fr.length ? `<h4 class="g-group">Fotos aus dem Netz – frei lizenziert <small>${fr.length}</small></h4>
      <p class="muted small">Museumsbelege (NHM London, Tervuren, Lund, US-Sammlungen u. a.) und Abbildungen aus Fachartikeln und Büchern mit freier Lizenz oder gemeinfrei. Antippen öffnet die Quelle mit Lizenz und Urheber.</p>
      <div class="gallery ufgal">${fr.map(th).join("")}</div>` : "") +
      (u.length ? `<h4 class="g-group uf">Weitere Fotos – nicht frei lizenziert <small>${u.length}</small></h4>
      <p class="muted small">Diese Fotos werden direkt von der Quelle angezeigt; die Rechte liegen bei den Urhebern. Antippen öffnet die Quelle. In den Filtern lassen sie sich ausblenden.</p>
      <div class="gallery ufgal">${u.map(th).join("")}</div>` : "") + belegHtml() + litHtml();
    };
    const belegHtml = () => {
      const b = SA && window.MANTODEA_NETZ && (window.MANTODEA_NETZ.belege || {})[s.k];
      return b && b.length ? `<h4 class="g-group uf">Weitere Bilder im Netz – nur als Verweis <small>${b.length}</small></h4>
      <p class="muted small">Bilder bei anderen Anbietern, deren Lizenz unbekannt ist oder die nicht frei lizenziert sind. Sie werden hier nicht angezeigt – der Link führt zur Quelle.</p>
      <ul class="netz-belege">${b.map((x) => `<li><a href="${esc(x.ref)}" target="_blank" rel="noopener"${x.s ? ` class="lit-q" data-seite="${x.s}" title="${esc(x.src)}"` : ""}>${esc(x.src)} ↗</a> – ${esc(x.t)}${x.l ? ` <span class="muted">(${esc(x.l)})</span>` : ""}</li>`).join("")}</ul>` : "";
    };
    // Fachartikel und Bücher mit Abbildungen dieser Art (data/netzfotos.js, Feld lit), mit Lizenz-Schild
    const litHtml = () => { const L = netzLit(s); return L ? `<h4 class="g-group">Literatur mit Abbildungen dieser Art <small>${L.length}</small></h4>
      <p class="muted small">Zeitschriftenartikel und Bücher, in denen die Art beschrieben oder abgebildet ist. Das Schild zeigt die Lizenz des Artikels: <span class="lic lic-frei">CC BY</span> frei, <span class="lic lic-nc">CC BY-NC</span> frei, aber nicht kommerziell, <span class="lic lic-nc">frei lesbar</span> online frei lesbar, Lizenz nicht angegeben, <span class="lic lic-zu">©</span> Rechte beim Verlag bzw. unbekannt. „Artbeschreibung“: Die Art wird dort taxonomisch bearbeitet (nach Plazi).</p>
      ${litListe(L)}` : ""; };

    if (!(s.gb || s.fb)) { box.innerHTML = ufHtml(); return; }
    const bundles = [s.gb, s.fb].filter(Boolean);
    let items;
    if (SA) items = ((RM[s.k] || {}).g || []).map((g) => ({ u: g[0], by: g[1], l: g[2], src: g[3], ref: g[4], a: g[5] }));
    else {
      try { await Promise.all(bundles.map((b) => loadScript(`data/img/${b}.js`))); } catch (e) { box.innerHTML = `<p class="muted">Galerie konnte nicht geladen werden.</p>`; return; }
      items = bundles.flatMap((b) => (gals[b] || {})[s.k] || []);
    }
    const hd = await loadHD(s.k);
    await loadOrte();
    galItems = items.map((g, i) => ({ src: hdSrc(hd && hd.g && hd.g[i]) || (g.d ? "data:image/jpeg;base64," + g.d : g.u), thumb: SA ? smallUrl(g.u) : null, g }));
    const groups = { w: [], m: [], x: [] };
    items.forEach((g, i) => groups[groupOfItem(g)].push(i));
    const can = titleWritable;
    box.innerHTML = Object.keys(GRP).filter((k) => groups[k].length || can).map((k) => `<h4 class="g-group">${GRP[k]} <small>${groups[k].length}</small></h4>
      <div class="gallery gdrop" data-grp="${k}">${groups[k].map((i) => { const g = items[i];
      return `<button type="button" class="gthumb" data-gi="${i}" title="${esc((g.a ? g.a + " · " : "") + (g.src === "Fachliteratur" ? "Abbildung: " : "Foto: ") + g.by + (ortOf(g.ref) ? " · " + ortOf(g.ref) : ""))}"><img src="${galItems[i].thumb || galItems[i].src}" alt="${esc(s.n)} Foto ${i + 1}" loading="lazy" draggable="false"></button>`; }).join("")}${can && !groups[k].length ? `<p class="gempty">Fotos hierher ziehen</p>` : ""}</div>`).join("")
      + (can ? `<p class="muted small ghint">Falsch einsortiert? Foto ${matchMedia("(pointer: coarse)").matches ? "kurz gedrückt halten und" : "mit der Maus"} in das richtige Feld ziehen.</p>` : "") + ufHtml();
    if (can) enableDrag(box, s, items);
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
    { const k = $("d-body") && $("d-body").dataset.k; const s = k && BYKEY.get(k); if (titleWritable && s && $("detail").open) fillGallery(s); }
    db.collection("fotogruppen").orderBy("zeit", "asc").limit(20000).onSnapshot((snap) => {
      let ch = false;
      snap.docs.forEach((d) => { const v = d.data(); if (v.ref && liveGroup[v.ref] !== v.gruppe) { liveGroup[v.ref] = v.gruppe; ch = true; } });
      const k = $("d-body") && $("d-body").dataset.k; const s = k && BYKEY.get(k); if (ch && s && $("detail").open && !document.querySelector(".gghost")) fillGallery(s);
    }, () => {});
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
    const cr = document.querySelector(".d-hero .credit"); if (cr) { const o = ortOf(it.g.ref); cr.innerHTML = credit({ l: it.g.l, by: it.g.by, src: it.g.src, ref: it.g.ref }, false) + (o ? ` · <span class="fo">📍 ${esc(o)}</span>` : ""); }
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
  // ---------- Drag & Drop zwischen Weibchen / Männchen / Weitere Fotos (Maus und Touch)
  function enableDrag(box, s, items) {
    let drag = null, holdT = null;
    const start = (e, btn) => {
      const r = btn.getBoundingClientRect();
      const ghost = btn.cloneNode(true); ghost.className = "gthumb gghost";
      Object.assign(ghost.style, { width: r.width + "px", height: r.height + "px", left: r.left + "px", top: r.top + "px" });
      document.body.appendChild(ghost);
      drag = { btn, ghost, dx: e.clientX - r.left, dy: e.clientY - r.top, from: btn.closest(".gdrop").dataset.grp };
      btn.classList.add("gdragging"); box.classList.add("dragging");
      if (navigator.vibrate) try { navigator.vibrate(15); } catch (err) { /* egal */ }
    };
    const target = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.closest && el.closest(".gdrop"); };
    box.addEventListener("pointerdown", (e) => {
      const btn = e.target.closest(".gthumb"); if (!btn || e.button > 0) return;
      const sx = e.clientX, sy = e.clientY, touch = e.pointerType !== "mouse";
      let moved = false;
      const mv = (ev) => {
        if (!drag) {
          const d = Math.hypot(ev.clientX - sx, ev.clientY - sy);
          if (touch) { if (d > 10) { clearTimeout(holdT); cleanup(); } return; }   // am Handy: erst lange drücken
          if (d < 6) return;
          start(ev, btn);
        }
        ev.preventDefault(); moved = true;
        drag.ghost.style.left = ev.clientX - drag.dx + "px"; drag.ghost.style.top = ev.clientY - drag.dy + "px";
        box.querySelectorAll(".gdrop").forEach((z) => z.classList.toggle("over", z === target(ev.clientX, ev.clientY)));
      };
      const up = async (ev) => {
        clearTimeout(holdT); cleanup();
        if (!drag) return;
        const z = target(ev.clientX, ev.clientY), d = drag; drag = null;
        d.ghost.remove(); d.btn.classList.remove("gdragging"); box.classList.remove("dragging");
        box.querySelectorAll(".gdrop").forEach((x) => x.classList.remove("over"));
        const blockClick = (ce) => { ce.stopPropagation(); ce.preventDefault(); };
        box.addEventListener("click", blockClick, { capture: true, once: true }); setTimeout(() => box.removeEventListener("click", blockClick, true), 50);
        if (!z || z.dataset.grp === d.from) return;
        const g = items[+d.btn.dataset.gi]; const grp = z.dataset.grp;
        liveGroup[g.ref] = grp; fillGallery(s);
        try { await titleDb.collection("fotogruppen").add({ art_key: String(s.k), ref: g.ref, gruppe: grp, zeit: new Date().toISOString() }); }
        catch (err) { delete liveGroup[g.ref]; fillGallery(s); alertBox("Speichern nicht erlaubt."); }
      };
      const cleanup = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); };
      addEventListener("pointermove", mv, { passive: false }); addEventListener("pointerup", up); addEventListener("pointercancel", up);
      if (touch) holdT = setTimeout(() => { start(e, btn); }, 380);
    });
    box.addEventListener("contextmenu", (e) => { if (e.target.closest(".gthumb")) e.preventDefault(); });
  }
  const alertBox = (t) => { const d = $("d-gal"); if (d) d.insertAdjacentHTML("afterbegin", `<p class="note small">${esc(t)}</p>`); };
  async function openZoom(s, start) {
    await loadOrte();
    // Liste: Titelbild (falls vorhanden) + Galerie
    const list = [];
    const hdf = (await loadHD(s.k) || {}).f;
    if (s._title && s._title.g.ref === titleRef(s.k)) list.push({ src: s._title.src, cap: credit({ l: s._title.g.l, by: s._title.g.by, src: s._title.g.src, ref: s._title.g.ref }, false), ref: s._title.g.ref, a: s._title.g.a });
    else if (s.p) { try { list.push({ src: hdSrc(hdf) || await imgData(s), cap: credit(s.p, false), ref: s.p.ref, a: s.p.front ? "♀ adultes Weibchen" : "" }); } catch (e) { /* ohne Titelbild */ } }
    else start = Math.max(0, start - 1);
    for (const [gi, it] of galItems.entries()) { const g = it.g, [lab, lurl] = LICS[g.l] || [g.l, "#"];
      list.push({ gi, src: it.src, a: g.a, ref: g.ref, cap: `${g.src === "Fachliteratur" ? "Abbildung" : "Foto"}: ${esc(g.by || "siehe Quelle")} · <a href="${lurl}" target="_blank" rel="noopener license">${esc(lab)}</a> · ${esc(g.src)}` }); }
    if (!list.length) return;
    let idx = Math.min(start, list.length - 1);
    const lb = $("lightbox");
    lb.innerHTML = `<button type="button" class="close" aria-label="Schließen">×</button>
      <div class="ztitle"><i>${esc(s.n)}</i>${s.de ? `<span>${esc(s.de)}</span>` : ""}</div>
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
      const fo = ortOf(it.ref);
      lb.querySelector(".zcap").innerHTML = `${fo ? `<b class="zfo">📍 ${esc(fo)}</b><br>` : ""}${it.a ? `<b>${esc(it.a)}</b> · ` : ""}${it.cap}${it.ref ? ` · <a href="${esc(it.ref)}" target="_blank" rel="noopener">Original in voller Größe ↗</a>` : ""}`;
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
    h += `<p class="muted small">👁️ Beobachtungen (z. B. iNaturalist, nur Forschungsqualität und frei lebend), 🏛️ Museumsbelege, 📖 Fachliteratur (regionale Artenliste, Verbreitungsangabe oder Fundort mit Koordinaten). Laborproben und Tiere aus Haltung zählen nicht. Kursiv: weniger als 5 Nachweise, eventuell eingeschleppt oder unbeständig. Quelle: <a href="https://www.gbif.org/occurrence/search?taxon_key=${esc(s.gk || "")}" target="_blank" rel="noopener">GBIF</a>, Plazi.</p>`;
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
        <div class="d-img">${s.p ? imgTag(s, s.n) : ufOf(s) ? `<a href="${esc(ufOf(s)[0].ref)}" target="_blank" rel="noopener">${ufImg({ u: ufOf(s)[0].big }, s.n)}</a>${ufBadge(ufOf(s)[0], true)}` : PLACEHOLDER}${s.p && s.p.front ? `<span class="front-tag">♀ adultes Weibchen</span>` : ""}${s.p ? `<span class="zoom-tag">🔍</span>` : ""}</div>
        ${s.p ? `<p class="credit full">${credit(s.p, false)}</p>` : ufOf(s) ? `<p class="credit full uf">${ufCredit(ufOf(s)[0])}</p>` : ""}
      </div>
      <section class="d-card d-head">
        <h2 id="d-title"><i>${esc(s.n)}</i>${flags(s)}</h2>
        <p class="d-auth">${esc(s.a)}${s.de || s.en ? ` · <span class="d-common">${esc([s.de, s.en].filter(Boolean).join(" · "))}</span>` : ""}</p>
        <div id="d-erst"></div>
        <div id="d-typ"></div>
        <div id="d-ung"></div>
        ${s.u ? `<p class="note small">Diese Art steht nicht im Catalogue of Life. Sie kann neu beschrieben und dort noch nicht erfasst sein, oder der Name ist veraltet bzw. ein Synonym. Gefunden in: ${(s.src || []).map((q) => SRC_NAME[q]).join(", ")}.</p>` : ""}
        ${s.ct && s.ct.length ? `<p class="d-occ">📍 <b>Vorkommen:</b> ${s.ct.slice(0, 8).map(cname).map(esc).join(", ")}${s.ct.length > 8 ? ` und ${s.ct.length - 8} weitere · <a href="#" data-goto-c="1">alle auf der Karte</a>` : ""}</p>` : `<p class="d-occ muted">📍 Vorkommen: keine Länderangaben bekannt</p>`}
        <p class="d-tax">Mantodea › <a href="#" data-fam="${esc(s.f)}">${esc(s.f)}</a>${s.sf && !s.sf.startsWith("(") ? ` › ${esc(s.sf)}` : ""} › <a href="#" data-gen="${esc(s.g)}" data-genfam="${esc(s.f)}"><i>${esc(s.g)}</i></a></p>
      </section>
      <section class="d-card">
        ${s.gb || s.fb ? `<h3 class="d-h">Fotos <small>${(s.gn || 0) + (s.fn || 0)} Fotos${s.fn ? ` (davon ${s.fn} von Flickr)` : ""} · antippen zum Vergrößern</small></h3><div id="d-gal"><p class="muted">Lade Fotos …</p></div>` :
          (ufOf(s) || netzLit(s) || (SA && window.MANTODEA_NETZ && (window.MANTODEA_NETZ.belege || {})[s.k]) ? `<h3 class="d-h">Fotos</h3><div id="d-gal"></div>` : `<h3 class="d-h">Fotos</h3><p class="muted">Keine weiteren frei lizenzierten Fotos gefunden.</p>`)}
      </section>
      <section class="d-card">
        <h3 class="d-h">Fundorte</h3><div id="d-map" class="d-map"><p class="muted">Lade Karte …</p></div>
        ${countrySection(s)}
        <div id="d-assigned"></div>
      </section>
      <section class="d-card" id="d-syn-card"><div id="d-syn"></div></section>
      ${window.MANTODEA_GBK && window.MANTODEA_GBK.has(s.g) ? `<section class="d-card"><button type="button" class="gb-auf" data-gbk="${esc(s.g)}" data-gbart="${esc(s.n)}" aria-expanded="false"><span class="gb-auf-t"><b>Bestimmungsschlüssel</b><small>Arten der Gattung <i>${esc(s.g)}</i> unterscheiden</small></span><span class="gb-pfeil" aria-hidden="true">▾</span></button><div class="gb-platz" hidden></div></section>` : ""}
      <section class="d-card"><h3 class="d-h" id="d-key-h">Bestimmung</h3>
        <p class="d-actions"><button type="button" class="ghost" data-key="${esc(s.k)}">🖼️ Ähnliche Arten nach Fotos vergleichen</button></p>
        <h4 class="d-sub">📖 Bestimmungsschlüssel in der Fachliteratur</h4><div id="d-key"><p class="muted">Lade Bestimmungsliteratur …</p></div></section>
      <section class="d-card"><h3 class="d-h">Literatur</h3><div id="d-lit"><p class="muted">Lade Literatur …</p></div></section>
      <p class="links d-sources"><span class="muted">Datenquellen:</span> ${srcs.join("")}</p>
      <div id="lightbox" class="lightbox zoomer" hidden></div>`);
    $("d-body").scrollTop = 0;
    $("d-body").dataset.k = s.k; s._title = null;
    prefetchSpecies(s.k);
    loadOrte().then(() => { const o = s.p && ortOf(s.p.ref); const cr = document.querySelector(".d-hero .credit"); if (o && cr && $("d-body").dataset.k == s.k && !cr.querySelector(".fo")) cr.insertAdjacentHTML("beforeend", ` · <span class="fo">📍 ${esc(o)}</span>`); });
    loadHD(s.k).then((hd) => { const im = document.querySelector(".d-hero .d-img img"); if (hd && hd.f && im && $("d-body").dataset.k == s.k) { im.removeAttribute("data-ik"); im.src = hdSrc(hd.f); } });
    fillGallery(s);
    fillErst(s);
    fillTypen(s);
    fillLiterature(s);
    fillKeyLit(s);
    fillSyn(s);
    fillUng(s);
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
  // Bestimmungsschlüssel im Steckbrief erst auf Knopfdruck aufklappen
  $("d-body").addEventListener("click", (e) => {
    const b = e.target.closest("button.gb-auf");
    if (!b) return;
    const platz = b.nextElementSibling, auf = b.getAttribute("aria-expanded") !== "true";
    if (auf && !platz.innerHTML) platz.innerHTML = window.MANTODEA_GBK.html(b.dataset.gbk, { art: b.dataset.gbart });
    platz.hidden = !auf; b.setAttribute("aria-expanded", String(auf));
    if (auf) { window.MANTODEA_GBK.einpassen(platz); b.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
  // Ergebnis-Knopf der Kurz-Bestimmung: Art direkt öffnen
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a.gb-erg[data-k]");
    if (!a) return;
    e.preventDefault(); e.stopPropagation();
    if (BYKEY.get(String(a.dataset.k))) detail(a.dataset.k);
  }, true);
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
  // Lupe oder Eingabetaste: sofort suchen, Tastatur schließen, zu den Ergebnissen
  function goSearch() { clearTimeout(t); state.q = $("q").value; render(); $("q").blur(); if (document.activeElement) document.activeElement.blur(); $("count").scrollIntoView({ behavior: "smooth", block: "start" }); }
  $("q-go").addEventListener("click", (e) => { e.preventDefault(); goSearch(); });
  $("q").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); goSearch(); } });
  $("sort").addEventListener("change", (e) => { state.sort = e.target.value; save(); render(); });
  $("group").addEventListener("change", (e) => { state.group = e.target.value; save(); render(); });
  $("family").addEventListener("change", (e) => { state.family = e.target.value; fillGenus(); render(); });
  $("genus").addEventListener("change", (e) => { state.genus = e.target.value; render(); });
  $("license").addEventListener("change", (e) => {
    state.license = e.target.value;
    if (SA) try { localStorage.setItem("mantodea-unfrei", state.license ? "0" : "1"); } catch (err) { /* egal */ }
    render();
  });
  $("country").addEventListener("change", (e) => { state.country = e.target.value; render(); });
  $("status").addEventListener("change", (e) => { state.status = e.target.value; render(); });
  $("onlyPhoto").addEventListener("change", (e) => { state.onlyPhoto = e.target.checked; render(); });
  $("photo-switch").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-ph]"); if (!b) return;
    state.onlyPhoto = b.dataset.ph === "1"; $("onlyPhoto").checked = state.onlyPhoto; render();
  });
  $("hideFossil").addEventListener("change", (e) => { state.hideFossil = e.target.checked; render(); });
  if (SA && Object.keys(UF).length) {
    $("lic-alle").textContent = "alle Fotos, auch nicht frei lizenzierte (©)";
    $("lic-frei").hidden = false;
    if (!ufStart) { state.license = "frei"; $("license").value = "frei"; }
  }
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
    Object.assign(state, { q: "", abc: "", family: "", genus: "", license: "", status: "", country: "", onlyPhoto: true, hideFossil: true });
    state.conts.clear();
    for (const id of ["q", "family", "license", "status", "country"]) $(id).value = "";
    $("onlyPhoto").checked = true; $("hideFossil").checked = true;
    fillCountries();
    document.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", "false"));
    fillGenus();
    render();
  });
  const more = () => { state.shown += PAGE; render(false); };
  $("more").addEventListener("click", more);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => { if (es[0].isIntersecting && !$("more").hidden && !$("v-arten").hidden && !ungSprung) more(); }, { rootMargin: "600px" }).observe($("sentinel"));
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
    if (h.startsWith("art=")) { // Sprung aus dem Bestimmungsschlüssel
      const k = decodeURIComponent(h.slice(4));
      history.replaceState(null, "", "#arten");
      if (BYKEY.get(String(k))) setTimeout(() => detail(k), 0);
      return route();
    }
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
  window.MANTODEA_UI = { loadOrte, ortOf, bigSrc: async (r) => (SA && bigOf(r)) || imgData(r), cname, loadScript, paperHtml, vq, imgData, esc, fmtDate, fmt, DATA, BYKEY, CONT, CONT_ORDER, imgTag, lazy, fill, detail, PLACEHOLDER, credit };

  if (!DATA.length) $("list").innerHTML = `<p class="empty">Die Artendaten (data/species.js) konnten nicht geladen werden.</p>`;
  else render();
  route();
})();
