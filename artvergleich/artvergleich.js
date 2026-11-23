// Arten vergleichen: Merkmale mehrerer Arten nebeneinander, Unterschiede hervorgehoben, nach Gemeinsamkeiten/Unterschieden sortierbar.
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const SP = (window.MANTODEA || {}).species || [];
  const MM = window.MANTODEA_MM || { zeilen: [], art: {}, gattung: {}, familie: {}, regionen: [], quellen: {}, masse: {} };
  const TY = (window.MANTODEA_TYPEN || {}).t || {};
  const NETZ = (window.MANTODEA_NETZ || {}).fotos || {};
  const BYK = new Map(SP.map((s) => [s.k, s]));
  const MAX = 8;
  const FARBEN = ["#d8ecd3", "#d6e4f5", "#f8e1c4", "#ecd9f2", "#f6d5d5", "#d9f0ee", "#f2efc6", "#e3e3e3"];

  // ---------- Zustand (in der Adresse, damit man Vergleiche teilen kann)
  const st = { arten: [], zeig: "alle", sort: "region", leer: false, aehnl: false };
  function lesen() {
    const p = new URLSearchParams(location.hash.slice(1));
    st.arten = (p.get("a") || "").split(",").filter((k) => BYK.has(k)).slice(0, MAX);
    st.zeig = p.get("zeig") || "alle"; st.sort = p.get("sort") || "region";
    st.leer = p.get("leer") === "1"; st.aehnl = p.get("aehnl") === "1";
  }
  function schreiben() {
    const p = new URLSearchParams();
    if (st.arten.length) p.set("a", st.arten.join(","));
    if (st.zeig !== "alle") p.set("zeig", st.zeig);
    if (st.sort !== "region") p.set("sort", st.sort);
    if (st.leer) p.set("leer", "1");
    if (st.aehnl) p.set("aehnl", "1");
    history.replaceState(null, "", "#" + p.toString());
  }

  // ---------- Merkmalsprofil einer Art: Familie < Gattung < Art (das Genauere gilt)
  function profil(s) {
    const p = {};
    for (const [D, key, lvl] of [[MM.familie, s.f, "Familie"], [MM.gattung, s.g, "Gattung"], [MM.art, s.k, "Art"]]) {
      const d = D[key]; if (!d) continue;
      for (const r in d) p[r] = { v: d[r], lvl };
    }
    return p;
  }
  const sicher = (v) => v.filter((i) => i >= 0);
  const unsicher = (v) => v.filter((i) => i < 0).map((i) => ~i);

  // ---------- Allgemeine Zeilen
  const ERD = { NORTH_AMERICA: "Nordamerika", SOUTH_AMERICA: "Südamerika", EUROPE: "Europa", AFRICA: "Afrika", ASIA: "Asien", OCEANIA: "Australien/Ozeanien", ANTARCTICA: "Antarktis" };
  let landName = (c) => c;
  try { const dn = new Intl.DisplayNames(["de"], { type: "region" }); landName = (c) => dn.of(c) || c; } catch (e) { /* alter Browser */ }
  const typKurz = (k) => { const t = TY[k]; if (!t) return ""; return [...new Set(t.map((r) => (r.n > 1 && !/en$/.test(r.s) ? r.s.replace(/us$/, "en") : r.s) + " " + (r.c || (r.m || "").split(",")[0])))].slice(0, 3).join(" · "); };
  const ALLG = [
    ["Familie", (s) => s.f],
    ["Unterfamilie", (s) => (s.sf && !s.sf.startsWith("(") ? s.sf : "")],
    ["Gattung", (s) => s.g],
    ["Beschrieben von", (s) => s.a || ""],
    ["Jahr der Beschreibung", (s) => ((s.a || "").match(/\d{4}/) || [""])[0]],
    ["Erdteile", (s) => (s.c || []).map((c) => ERD[c] || c).join(", ")],
    ["Länder", (s) => (s.ct || []).length ? (s.ct.length > 6 ? s.ct.length + " Länder" : s.ct.map(landName).join(", ")) : ""],
    ["Typusexemplare", (s) => typKurz(s.k)],
  ];
  const MASSE = [["koerper", "Körperlänge"], ["kopfbreite", "Kopfbreite"], ["pronotum_l", "Pronotumlänge (Halsschild)"], ["pronotum_b", "Pronotumbreite"], ["prozona", "Prozona (vorderer Halsschild)"], ["metazona", "Metazona (hinterer Halsschild)"],
    ["vfl", "Vorderflügellänge (Tegmen)"], ["hfl", "Hinterflügellänge"], ["procoxa", "Vorderhüftlänge (Procoxa)"], ["profemur", "Vorderschenkellänge (Profemur)"], ["protibia", "Vorderschienenlänge (Protibia)"],
    ["metafemur", "Hinterschenkellänge"], ["abdomen", "Hinterleibslänge"], ["fuehler", "Fühlerlänge"], ["cerci", "Cerci-Länge"]];
  const bereich = (t) => { const z = String(t).split("-").map(parseFloat).filter((x) => !isNaN(x)); return z.length ? [Math.min(...z), Math.max(...z)] : null; };

  // ---------- Vergleich: alle Zeilen mit Werten je Art und Status
  function vergleich(arten) {
    const P = arten.map(profil), zeilen = [];
    // Überblick
    for (const [lab, f] of ALLG) {
      const w = arten.map((s) => f(s) || null);
      zeilen.push(bewerte({ reg: "allg", regName: "Überblick", lab, zellen: w.map((x) => (x ? { t: x, key: x } : null)) }));
    }
    // Körpermaße
    for (const [feld, lab] of MASSE) {
      const zellen = arten.map((s) => {
        const m = MM.masse[s.k]; const w = m && m.w[feld]; if (!w) return null;
        const t = [w.m && "♂ " + w.m, w.w && "♀ " + w.w, w["?"] && w["?"]].filter(Boolean).join(" · ") + " mm";
        return { t, key: t, q: m.q, u: m.u, mass: w };
      });
      zeilen.push(bewerte({ reg: "masse", regName: "Körpermaße", lab, zellen, mass: true, immer: ["koerper", "pronotum_l", "vfl", "profemur"].includes(feld) }));
    }
    // Merkmale aus den Schlüsseln
    const ids = new Set(); P.forEach((p) => Object.keys(p).forEach((r) => ids.add(r)));
    const regName = Object.fromEntries(MM.regionen);
    for (const r of ids) {
      const z = MM.zeilen[+r]; if (!z) continue;
      const [reg, lab, opts, q] = z;
      const zellen = P.map((p) => {
        const e = p[r]; if (!e) return null;
        const s = sicher(e.v), u = unsicher(e.v);
        const nimm = s.length ? s : u;
        return { t: nimm.map((i) => opts[i]).join(" / oder: "), key: nimm.slice().sort().join(","), set: nimm, var: nimm.length > 1, vm: !s.length, lvl: e.lvl };
      });
      zeilen.push(bewerte({ reg, regName: regName[reg] || "Weitere Merkmale", lab: lab || "", opts, q: MM.quellen[q] || "", zellen }));
    }
    return zeilen;
  }
  function bewerte(z) {
    const da = z.zellen.filter(Boolean);
    z.n = da.length;
    if (da.length < 2) { z.status = "einzeln"; return z; }
    if (z.mass) {
      // Maße: unterschiedlich, wenn sich die Spannen (gleiches Geschlecht) nicht überschneiden
      let ver = false, vgl = false;
      for (const sx of ["m", "w", "?"]) {
        const b = z.zellen.map((c) => (c && c.mass[sx] ? bereich(c.mass[sx]) : null)).filter(Boolean);
        for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) { vgl = true; if (b[i][1] < b[j][0] * 0.97 || b[j][1] < b[i][0] * 0.97) ver = true; }
      }
      z.status = !vgl ? "teilweise" : ver ? "verschieden" : "gleich";
    } else if (z.opts) {
      let ver = false, alleGleich = true;
      for (let i = 0; i < da.length; i++) for (let j = i + 1; j < da.length; j++) {
        const a = da[i].set, b = da[j].set;
        if (!a.some((x) => b.includes(x))) ver = true;
        if (da[i].key !== da[j].key) alleGleich = false;
      }
      z.status = ver ? "verschieden" : alleGleich && !da.some((c) => c.var) ? "gleich" : "teilweise";
    } else {
      const keys = new Set(da.map((c) => c.key));
      z.status = keys.size === 1 ? "gleich" : "verschieden";
    }
    // Farbgruppen: gleiche Ausprägung = gleiche Farbe
    const gr = new Map();
    z.zellen.forEach((c) => { if (c && !gr.has(c.key)) gr.set(c.key, gr.size); });
    z.zellen.forEach((c) => { if (c) c.farbe = z.status === "gleich" ? 0 : gr.get(c.key); });
    return z;
  }
  // Ähnlichkeit jeder Art zur ersten (Anteil gleicher unter den gemeinsam dokumentierten Merkmalen)
  function aehnlichkeit(zeilen, n) {
    const out = Array(n).fill(null);
    for (let j = 1; j < n; j++) {
      let gl = 0, vg = 0;
      for (const z of zeilen) {
        if (z.reg === "allg") continue;
        const a = z.zellen[0], b = z.zellen[j]; if (!a || !b) continue;
        vg++;
        if (z.opts ? a.set.some((x) => b.set.includes(x)) : a.key === b.key) gl++;
      }
      out[j] = vg ? { p: Math.round((gl / vg) * 100), vg } : null;
    }
    return out;
  }

  // ---------- Fotos (iNaturalist-Taxonfoto, sonst erstes frei lizenziertes Netzbild)
  const fotoCache = {};
  function foto(s, img) {
    const setz = (u, t) => { if (u) { img.src = u; img.title = t || ""; img.hidden = false; } };
    if (fotoCache[s.k]) return setz(...fotoCache[s.k]);
    const netz = (NETZ[s.k] || []).find((x) => x.frei);
    if (s.i) {
      fetch(`https://api.inaturalist.org/v1/taxa/${s.i}`).then((r) => r.json()).then((d) => {
        const p = d.results && d.results[0] && d.results[0].default_photo;
        fotoCache[s.k] = p ? [p.medium_url || p.square_url, p.attribution] : netz ? [netz.u, netz.by + " · " + netz.l] : [null];
        setz(...fotoCache[s.k]);
      }).catch(() => { if (netz) setz(netz.u, netz.by); });
    } else if (netz) setz(netz.u, netz.by + " · " + netz.l);
  }

  // ---------- Anzeige
  const STATUS = { verschieden: ["Unterschiedlich", "≠"], teilweise: ["Teilweise", "≈"], gleich: ["Gleich", "="], einzeln: ["Nur eine Art dokumentiert", "·"] };
  const RANG = { unterschiede: { verschieden: 0, teilweise: 1, gleich: 2, einzeln: 3 }, gemeinsam: { gleich: 0, teilweise: 1, verschieden: 2, einzeln: 3 } };
  function zeichnen() {
    schreiben(); chips(); schnell();
    const box = $("av-tabelle");
    $("av-steuer").hidden = st.arten.length < 2;
    document.querySelectorAll("[data-zeig]").forEach((b) => b.classList.toggle("an", b.dataset.zeig === st.zeig));
    document.querySelectorAll("[data-sort]").forEach((b) => b.classList.toggle("an", b.dataset.sort === st.sort));
    $("av-leer").checked = st.leer; $("av-aehnl").checked = st.aehnl;
    if (!st.arten.length) { box.innerHTML = `<p class="av-leerhinweis">Wähle oben zwei oder mehr Arten aus. Die Merkmale erscheinen dann nebeneinander; Unterschiede werden farbig hervorgehoben.</p>`; $("av-bilanz").textContent = ""; return; }
    let arten = st.arten.map((k) => BYK.get(k));
    let zeilen = vergleich(arten);
    if (st.aehnl && arten.length > 2) {
      const ae = aehnlichkeit(zeilen, arten.length);
      const ord = [0, ...arten.map((_, i) => i).slice(1).sort((a, b) => ((ae[b] || { p: -1 }).p - (ae[a] || { p: -1 }).p))];
      arten = ord.map((i) => arten[i]); zeilen = vergleich(arten);
    }
    const ae = aehnlichkeit(zeilen, arten.length);
    const zaehl = { verschieden: 0, teilweise: 0, gleich: 0, einzeln: 0 };
    zeilen.forEach((z) => zaehl[z.status]++);
    $("av-bilanz").innerHTML = arten.length < 2 ? "" : `${zeilen.filter((z) => z.status !== "einzeln").length} Merkmale bei mindestens zwei Arten dokumentiert: <b class="st-verschieden">${zaehl.verschieden} unterschiedlich</b> · <b class="st-teilweise">${zaehl.teilweise} teilweise</b> · <b class="st-gleich">${zaehl.gleich} gleich</b> <span class="av-grau">(${zaehl.einzeln} nur bei einer Art)</span>`;
    // Filtern
    let sicht = zeilen.filter((z) => {
      if (z.reg === "allg") return true;
      if (z.immer && st.zeig === "alle") return true;
      if (z.status === "einzeln" && !(st.leer || arten.length === 1)) return false;
      if (st.zeig === "unterschiede") return z.status === "verschieden" || z.status === "teilweise";
      if (st.zeig === "gemeinsam") return z.status === "gleich";
      return true;
    });
    if (arten.length === 1) sicht = zeilen.filter((z) => z.n);
    // Sortieren
    const regOrd = ["allg", "masse", ...MM.regionen.map((r) => r[0])];
    const ro = (z) => regOrd.indexOf(z.reg);
    if (st.sort === "region") sicht.sort((a, b) => ro(a) - ro(b) || (a.lab || "").localeCompare(b.lab || "", "de"));
    else { const R = RANG[st.sort]; sicht.sort((a, b) => (a.reg === "allg") - (b.reg === "allg") || R[a.status] - R[b.status] || ro(a) - ro(b)); }
    // Kopf
    const kopf = `<tr><th class="av-ecke">Merkmal</th>${arten.map((s, i) => `<th class="av-art"><div class="av-artkopf">
        <img alt="" loading="lazy" hidden data-fk="${esc(s.k)}">
        <a href="index.html#art=${encodeURIComponent(s.k)}" class="av-name"><i>${esc(s.n)}</i></a><small>${esc(s.a || "")}</small>
        ${i > 0 && ae[i] ? `<span class="av-aehn" title="Anteil gleicher Ausprägungen unter ${ae[i].vg} Merkmalen, die bei beiden Arten dokumentiert sind">${ae[i].p} % wie ${esc(arten[0].n.split(" ")[0][0])}. ${esc(arten[0].n.split(" ")[1])}</span>` : i === 0 && arten.length > 1 ? `<span class="av-aehn ref">Bezugsart</span>` : ""}
        <button type="button" class="av-weg" data-weg="${esc(s.k)}" title="Aus dem Vergleich entfernen">✕</button></div></th>`).join("")}</tr>`;
    let körper = "", letzteReg = null;
    for (const z of sicht) {
      if (st.sort === "region" && z.reg !== letzteReg) {
        letzteReg = z.reg;
        const c = zeilen.filter((y) => y.reg === z.reg && y.status !== "einzeln");
        const v = c.filter((y) => y.status === "verschieden").length;
        körper += `<tr class="av-reg"><th colspan="${arten.length + 1}">${esc(z.regName)}${z.reg !== "allg" ? ` <small>${c.length} verglichen${v ? ` · ${v} unterschiedlich` : ""}</small>` : ""}</th></tr>`;
      }
      const [stName, stZ] = STATUS[z.status];
      const lab = z.lab || (z.opts ? z.opts[0].split(/[:,(]| mit | ohne /)[0] : "");
      körper += `<tr class="av-z st-${z.status}"><th class="av-lab" title="${esc(z.q ? "Quelle: " + z.q : "")}"><span class="av-st" title="${stName}">${stZ}</span> ${esc(lab)}${st.sort !== "region" ? ` <small class="av-reg-tag">${esc(z.regName)}</small>` : ""}${z.opts ? `<small class="av-opts" title="${esc("Mögliche Ausprägungen: " + z.opts.join(" | "))}">${z.opts.length} Ausprägungen</small>` : ""}</th>${z.zellen.map((c) => c
        ? `<td class="${z.status === "verschieden" || z.status === "teilweise" ? "f" + (c.farbe % FARBEN.length) : z.status === "gleich" ? "gl" : ""}${c.vm ? " vm" : ""}"${c.q ? ` title="${esc(c.q)}"` : c.lvl && c.lvl !== "Art" ? ` title="gilt laut Schlüssel für die ganze ${c.lvl}"` : ""}>${esc(c.t)}${c.var ? ' <span class="av-tag">variabel</span>' : ""}${c.vm ? ' <span class="av-tag">vermutlich</span>' : ""}${c.lvl && c.lvl !== "Art" ? ` <span class="av-lvl">${c.lvl}</span>` : ""}${c.u ? ` <a href="${esc(c.u)}" target="_blank" rel="noopener" class="av-q">Quelle ↗</a>` : ""}</td>`
        : `<td class="nd">nicht dokumentiert</td>`).join("")}</tr>`;
    }
    box.innerHTML = `<div class="av-scroll"><table class="av-t" style="--n:${arten.length}"><thead>${kopf}</thead><tbody>${körper}</tbody></table></div>`;
    box.querySelectorAll("img[data-fk]").forEach((im) => foto(BYK.get(im.dataset.fk), im));
  }

  // ---------- Auswahl
  function chips() {
    $("av-chips").innerHTML = st.arten.map((k) => { const s = BYK.get(k); return `<span class="av-chip"><i>${esc(s.n)}</i><button type="button" data-weg="${esc(k)}" aria-label="entfernen">✕</button></span>`; }).join("")
      + (st.arten.length ? `<button type="button" class="av-chip leeren" id="av-alle-weg">Auswahl leeren</button>` : "");
  }
  function schnell() {
    const s = st.arten.length ? BYK.get(st.arten[0]) : null;
    if (!s) { $("av-schnell").innerHTML = `<span class="av-grau">Beispiele:</span> ${[["Mantis religiosa", "Sphodromantis viridis", "Hierodula membranacea"], ["Sphodropoda tristis", "Sphodropoda viridis", "Sphodropoda quinquedens", "Sphodropoda lepida"], ["Empusa pennata", "Empusa fasciata", "Idolomantis diabolica"]]
      .map((b) => b.filter((n) => SP.some((x) => x.n === n))).filter((b) => b.length > 1).map((b) => `<button type="button" class="av-bsp" data-bsp="${esc(b.join("|"))}">${b.map((n) => `<i>${esc(n)}</i>`).join(" · ")}</button>`).join("")}`; return; }
    const gat = SP.filter((x) => x.g === s.g && !st.arten.includes(x.k));
    $("av-schnell").innerHTML = gat.length ? `<button type="button" class="av-bsp" data-gat="${esc(s.g)}">+ weitere Arten der Gattung <i>${esc(s.g)}</i> (${gat.length})</button>` : "";
  }
  function dazu(k) { if (!st.arten.includes(k) && st.arten.length < MAX) st.arten.push(k); zeichnen(); }

  const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const index = SP.map((s) => [norm(s.n + " " + (s.de || "") + " " + (s.en || "")), s]);
  let treffer = [], aktiv = -1;
  function suchen() {
    const q = norm($("av-suche").value.trim()); const ul = $("av-vorschlag");
    if (q.length < 2) { ul.hidden = true; return; }
    const teile = q.split(/\s+/);
    treffer = index.filter(([t]) => teile.every((x) => t.includes(x))).map((x) => x[1])
      .sort((a, b) => (norm(a.n).startsWith(q) ? 0 : 1) - (norm(b.n).startsWith(q) ? 0 : 1) || a.n.localeCompare(b.n)).slice(0, 12);
    aktiv = -1;
    ul.innerHTML = treffer.length ? treffer.map((s, i) => `<li data-i="${i}" class="${st.arten.includes(s.k) ? "drin" : ""}"><i>${esc(s.n)}</i> <small>${esc(s.a || "")} · ${esc(s.f)}${s.de ? " · " + esc(s.de) : ""}</small></li>`).join("") : `<li class="nix">Keine Art gefunden</li>`;
    ul.hidden = false;
  }
  function waehle(i) { const s = treffer[i]; if (!s) return; $("av-suche").value = ""; $("av-vorschlag").hidden = true; dazu(s.k); $("av-suche").focus(); }

  $("av-suche").addEventListener("input", suchen);
  $("av-suche").addEventListener("keydown", (e) => {
    const li = [...$("av-vorschlag").querySelectorAll("li[data-i]")];
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); aktiv = (aktiv + (e.key === "ArrowDown" ? 1 : -1) + li.length) % li.length; li.forEach((x, i) => x.classList.toggle("akt", i === aktiv)); }
    else if (e.key === "Enter") { e.preventDefault(); waehle(aktiv >= 0 ? aktiv : 0); }
    else if (e.key === "Escape") $("av-vorschlag").hidden = true;
  });
  $("av-vorschlag").addEventListener("mousedown", (e) => { const li = e.target.closest("li[data-i]"); if (li) { e.preventDefault(); waehle(+li.dataset.i); } });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".av-suchfeld")) $("av-vorschlag").hidden = true;
    const w = e.target.closest("[data-weg]"); if (w) { st.arten = st.arten.filter((k) => k !== w.dataset.weg); zeichnen(); return; }
    if (e.target.id === "av-alle-weg") { st.arten = []; zeichnen(); return; }
    const b = e.target.closest("[data-bsp]"); if (b) { st.arten = b.dataset.bsp.split("|").map((n) => SP.find((x) => x.n === n)).filter(Boolean).map((s) => s.k); zeichnen(); return; }
    const g = e.target.closest("[data-gat]"); if (g) { SP.filter((x) => x.g === g.dataset.gat).forEach((x) => { if (!st.arten.includes(x.k) && st.arten.length < MAX) st.arten.push(x.k); }); zeichnen(); return; }
    const z = e.target.closest("[data-zeig]"); if (z) { st.zeig = z.dataset.zeig; zeichnen(); return; }
    const so = e.target.closest("[data-sort]"); if (so) { st.sort = so.dataset.sort; zeichnen(); }
  });
  $("av-leer").addEventListener("change", (e) => { st.leer = e.target.checked; zeichnen(); });
  $("av-aehnl").addEventListener("change", (e) => { st.aehnl = e.target.checked; zeichnen(); });
  $("av-zurueck").onclick = () => { if (history.length > 1 && document.referrer && new URL(document.referrer).origin === location.origin) history.back(); else location.href = "index.html"; };

  lesen(); zeichnen();
  window.__avTest = { vergleich, profil, BYK, st, zeichnen };
})();
