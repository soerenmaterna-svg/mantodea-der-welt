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
    if (window.top !== window) window.parent.postMessage({ mantodeaVgl: "auswahl", a: st.arten.slice() }, location.origin);
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
  const typKurz = (k) => { const t = TY[k]; if (!t) return ""; return [...new Set(t.map((r) => (r.n > 1 && !/en$/.test(r.s) ? r.s.replace(/us$/, "en") : r.s) + ": " + ((r.m || "").split(",")[0] || r.c)))].slice(0, 3).join(" · "); };
  const ALLG = [
    ["Familie", (s) => s.f],
    ["Unterfamilie", (s) => (s.sf && !s.sf.startsWith("(") ? s.sf : "")],
    ["Gattung", (s) => s.g],
    ["Beschrieben von (Autor, Jahr)", (s) => (s.a || "").replace(/^\((.*)\)$/, "$1"), 1],
    ["Erdteile", (s) => (s.c || []).map((c) => ERD[c] || c).join(", ")],
    ["Länder", (s) => (s.ct || []).length ? (s.ct.length > 6 ? s.ct.length + " Länder" : s.ct.map(landName).join(", ")) : "", 1],
    ["Typusexemplare", (s) => typKurz(s.k), 1],
  ];
  const MASSE = [["koerper", "Körperlänge"], ["kopfbreite", "Kopfbreite"], ["pronotum_l", "Pronotumlänge (Halsschild)"], ["pronotum_b", "Pronotumbreite"], ["prozona", "Prozona (vorderer Halsschild)"], ["metazona", "Metazona (hinterer Halsschild)"],
    ["vfl", "Vorderflügellänge (Tegmen)"], ["hfl", "Hinterflügellänge"], ["procoxa", "Vorderhüftlänge (Procoxa)"], ["profemur", "Vorderschenkellänge (Profemur)"], ["protibia", "Vorderschienenlänge (Protibia)"],
    ["metafemur", "Hinterschenkellänge"], ["abdomen", "Hinterleibslänge"], ["fuehler", "Fühlerlänge"], ["cerci", "Cerci-Länge"]];
  const bereich = (t) => { const z = String(t).split("-").map(parseFloat).filter((x) => !isNaN(x)); return z.length ? [Math.min(...z), Math.max(...z)] : null; };

  // ---------- Vergleich: alle Zeilen mit Werten je Art und Status
  function vergleich(arten) {
    const P = arten.map(profil), zeilen = [];
    // Überblick
    for (const [lab, f, info] of ALLG) {
      const w = arten.map((s) => f(s) || null);
      const z = bewerte({ reg: "allg", regName: "Überblick", lab, zellen: w.map((x) => (x ? { t: x, key: x } : null)) });
      if (info) z.status = "info";
      zeilen.push(z);
    }
    // Körpermaße
    for (const [feld, lab] of MASSE) {
      const zellen = arten.map((s) => {
        const m = MM.masse[s.k]; const w = m && m.w[feld]; if (!w) return null;
        const de = (x) => x.replace(/\./g, ",").replace(/-/g, "–");
        const t = [w.m && "Männchen " + de(w.m), w.w && "Weibchen " + de(w.w), w["?"] && de(w["?"])].filter(Boolean).join(" · ") + " mm";
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
      z.status = ver ? "verschieden" : alleGleich ? "gleich" : "teilweise";
    } else {
      const keys = new Set(da.map((c) => c.key));
      z.status = keys.size === 1 ? "gleich" : "verschieden";
    }
    // Bedeutung für die Bestimmung: 2 = trennt die gewählten Arten, 1 = Merkmal aus einem Artenschlüssel (Literatur bestimmt damit Arten)
    if (z.reg !== "allg") z.wichtig = z.status === "verschieden" ? 2 : z.opts && da.some((c) => c.lvl === "Art") ? 1 : 0;
    // Farbgruppen: gleiche Ausprägung = gleiche Farbe
    const gr = new Map();
    z.zellen.forEach((c) => { if (c && !gr.has(c.key)) gr.set(c.key, gr.size); });
    z.zellen.forEach((c) => { if (c) c.farbe = z.status === "gleich" ? 0 : gr.get(c.key); });
    return z;
  }
  // Zahl der Merkmale, in denen sich jede Art von der ersten unterscheidet
  function unterschiede(zeilen, n) {
    const out = Array(n).fill(0);
    for (const z of zeilen) {
      if (z.reg === "allg" || z.status === "einzeln") continue;
      const a = z.zellen[0]; if (!a) continue;
      for (let j = 1; j < n; j++) {
        const b = z.zellen[j]; if (!b) continue;
        if (z.opts ? !a.set.some((x) => b.set.includes(x)) : z.mass ? z.status === "verschieden" && a.key !== b.key : a.key !== b.key) out[j]++;
      }
    }
    return out;
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
    { const tb = document.getElementById("av-teilen"); if (tb) tb.hidden = st.arten.length < 2; }
    schreiben(); chips(); schnell();
    const box = $("av-tabelle");
    $("av-steuer").hidden = st.arten.length < 2; $("av-mehr").hidden = !st.arten.length;
    $("av-zeig").value = st.zeig; $("av-sort").value = st.sort;
    $("av-leer").checked = st.leer; $("av-aehnl").checked = st.aehnl;
    if (!st.arten.length) { box.innerHTML = `<p class="av-leerhinweis">Wähle oben über das Suchfeld zwei oder mehr Arten aus. Die Merkmale erscheinen dann nebeneinander; Unterschiede werden farbig hervorgehoben.<br><br>${box.dataset.bsp || ""}</p>`; $("av-bilanz").textContent = ""; return; }
    let arten = st.arten.map((k) => BYK.get(k));
    let zeilen = vergleich(arten);
    if (st.aehnl && arten.length > 2) {
      const ae = aehnlichkeit(zeilen, arten.length);
      const un = unterschiede(zeilen, arten.length);
      const ord = [0, ...arten.map((_, i) => i).slice(1).sort((a, b) => un[a] - un[b] || ((ae[b] || { p: -1 }).p - (ae[a] || { p: -1 }).p))];
      arten = ord.map((i) => arten[i]); zeilen = vergleich(arten);
    }
    const un = unterschiede(zeilen, arten.length);
    const zaehl = { verschieden: 0, teilweise: 0, gleich: 0, einzeln: 0, info: 0 };
    zeilen.forEach((z) => { if (z.reg !== "allg") zaehl[z.status]++; });
    $("av-bilanz").innerHTML = arten.length < 2 ? "" : `<b class="st-verschieden">${zaehl.verschieden} unterschiedlich</b> · <b class="st-teilweise">${zaehl.teilweise} teilweise</b> · <b class="st-gleich">${zaehl.gleich} gleich</b> <span class="av-grau">von ${zeilen.filter((z) => z.reg !== "allg" && z.status !== "einzeln").length} vergleichbaren Körpermerkmalen</span>`;
    // Filtern
    let sicht = zeilen.filter((z) => {
      if (z.reg === "allg") return true;
      if (z.immer && st.zeig === "alle") return true;
      if (z.status === "einzeln" && !(st.leer || arten.length === 1)) return false;
      if (st.zeig === "unterschiede") return z.status === "verschieden" || z.status === "teilweise";
      if (st.zeig === "gemeinsam") return z.status === "gleich";
      if (st.zeig === "bestimmung") return z.wichtig > 0;
      return true;
    });
    if (arten.length === 1) sicht = zeilen.filter((z) => z.n);
    const ohneMasse = !zeilen.some((z) => z.reg === "masse" && z.n);
    if (ohneMasse) sicht = sicht.filter((z) => z.reg !== "masse");
    // Übereinstimmende Merkmale je Körperregion eingeklappt (Ansicht "Alles", nach Körperregion)
    const klapp = st.sort === "region" && st.zeig === "alle" && arten.length > 1;
    const glZahl = {};
    if (klapp) sicht = sicht.filter((z) => { if (z.reg !== "allg" && z.status === "gleich" && !offen.has(z.reg)) { glZahl[z.reg] = (glZahl[z.reg] || 0) + 1; return false; } return true; });
    // Sortieren
    const regOrd = ["allg", "masse", ...MM.regionen.map((r) => r[0])];
    const ro = (z) => regOrd.indexOf(z.reg);
    if (st.sort === "region") sicht.sort((a, b) => ro(a) - ro(b) || (a.lab || "").localeCompare(b.lab || "", "de"));
    else { const R = RANG[st.sort]; sicht.sort((a, b) => (a.reg === "allg") - (b.reg === "allg") || R[a.status] - R[b.status] || ro(a) - ro(b)); }
    // Kopf
    const MOB = !!(window.matchMedia && window.matchMedia("(max-width: 700px)").matches), SP_ = arten.length + (MOB ? 0 : 1);
    const kopf = `<tr>${MOB ? "" : '<th class="av-ecke">Merkmal</th>'}${arten.map((s, i) => `<th class="av-art" style="--ac:${ARTFARBE[i % ARTFARBE.length]}"><div class="av-artkopf">
        <img alt="" loading="lazy" hidden data-fk="${esc(s.k)}">
        <div class="av-ak-t"><a href="index.html#art=${encodeURIComponent(s.k)}" class="av-name"><i>${esc(s.n)}</i></a><small>${esc(s.a || "")}</small>
        ${i > 0 ? `<span class="av-aehn${un[i] ? " un" : ""}" title="Merkmale, in denen sich diese Art von ${esc(arten[0].n)} (erste Spalte) unterscheidet">${un[i] ? un[i] + (un[i] === 1 ? " Unterschied" : " Unterschiede") : "kein Unterschied"}<span class="av-l2"> zur ersten Art</span></span>` : arten.length > 1 ? `<span class="av-aehn ref">erste Art<span class="av-l2"> (Bezug)</span></span>` : ""}
        </div><button type="button" class="av-weg" data-weg="${esc(s.k)}" title="Aus dem Vergleich entfernen">✕</button></div></th>`).join("")}</tr>`;
    let körper = "", letzteReg = null, masseHinweis = false;
    const regKopf = (reg, name) => {
      const c = zeilen.filter((y) => y.reg === reg && y.status !== "einzeln" && y.status !== "info");
      const v = c.filter((y) => y.status === "verschieden").length, g = c.filter((y) => y.status === "gleich").length;
      return `<tr class="av-reg"><th colspan="${SP_}">${esc(name)}${reg !== "allg" ? ` <small>${v ? `<b class="st-verschieden">${v} unterschiedlich</b> · ` : ""}${c.length} verglichen</small>` : ""}</th></tr>`
        + (glZahl[reg] ? `<tr class="av-klapp"><td colspan="${SP_}"><button type="button" data-auf="${reg}">▸ ${glZahl[reg]} ${glZahl[reg] === 1 ? "Merkmal stimmt" : "Merkmale stimmen"} bei allen Arten überein – anzeigen</button></td></tr>`
          : offen.has(reg) && g ? `<tr class="av-klapp"><td colspan="${SP_}"><button type="button" data-zu="${reg}">▾ übereinstimmende Merkmale wieder einklappen</button></td></tr>` : "");
    };
    const regNamen = Object.fromEntries([["allg", "Überblick"], ["masse", "Körpermaße"], ...MM.regionen]);
    if (klapp) for (const reg of Object.keys(glZahl)) if (!sicht.some((z) => z.reg === reg)) sicht.push({ nurKopf: true, reg, regName: regNamen[reg] || reg });
    if (st.sort === "region") sicht.sort((a, b) => ro(a) - ro(b) || (a.nurKopf ? -1 : b.nurKopf ? 1 : 0) || (b.wichtig || 0) - (a.wichtig || 0) || (a.lab || "").localeCompare(b.lab || "", "de"));
    for (const z of sicht) {
      if (st.sort === "region" && z.reg !== letzteReg) {
        letzteReg = z.reg;
        if (z.reg !== "allg" && !masseHinweis && ohneMasse) { masseHinweis = true; körper += `<tr class="av-reg"><th colspan="${SP_}">Körpermaße <small>für diese Arten sind in den ausgewerteten Quellen keine Maße dokumentiert</small></th></tr>`; }
        körper += regKopf(z.reg, z.regName);
      }
      if (z.nurKopf) continue;
      const [stName, stZ] = STATUS[z.status] || ["Angabe", "i"];
      const B = z.opts ? beschrift(z) : null;
      const lab = B ? B.lab : z.lab;
      const kurz = (t) => B.wert(t, " – oder – ");
      const labHtml = `<span class="av-st" title="${stName}">${stZ}</span> ${esc(lab)}${z.wichtig === 2 ? ` <span class="av-key k2" title="Wichtig für die Artbestimmung: In diesem Merkmal unterscheiden sich die gewählten Arten">🔑 trennt diese Arten</span>` : z.wichtig === 1 ? ` <span class="av-key k1" title="Die Fachliteratur nutzt dieses Merkmal, um Arten zu bestimmen (aus einem Artenschlüssel)">🔑 Bestimmungsmerkmal</span>` : ""}${z.opts ? `<small class="av-opts" title="${esc("Mögliche Ausprägungen: " + z.opts.join(" | "))}">${esc(z.regName)}</small>` : ""}`;
      const zk = `st-${z.status}${z.wichtig ? " w" + z.wichtig : ""}`, qt = esc(z.q ? "Quelle: " + z.q : "");
      körper += (MOB ? `<tr class="av-lrow ${zk}"><th colspan="${SP_}" class="av-lab-m" title="${qt}"><span class="av-lab-in">${labHtml}</span></th></tr><tr class="av-z ${zk}">`
        : `<tr class="av-z ${zk}"><th class="av-lab" title="${qt}">${labHtml}</th>`) + `${z.zellen.map((c, ci) => c
        ? `<td style="--ac:${ARTFARBE[ci % ARTFARBE.length]}" class="sp${ci % 2} ${z.status === "info" ? "" : z.status === "verschieden" || z.status === "teilweise" ? "f" + (c.farbe % FARBEN.length) : z.status === "gleich" ? "gl" : ""}${c.vm ? " vm" : ""}"${c.q ? ` title="${esc(c.q)}"` : c.lvl && c.lvl !== "Art" ? ` title="gilt laut Schlüssel für die ganze ${c.lvl}"` : ""}>${esc(c.opts === undefined && z.opts ? kurz(c.t) : c.t)}${c.var ? ' <span class="av-tag">variabel</span>' : ""}${c.vm ? ' <span class="av-tag" title="laut Bestimmungsschlüssel nur möglicherweise">vermutlich</span>' : ""}${c.lvl && c.lvl !== "Art" ? ` <span class="av-lvl">für die ganze ${c.lvl}</span>` : ""}${c.u ? ` <a href="${esc(c.u)}" target="_blank" rel="noopener" class="av-q">Quelle ↗</a>` : ""}</td>`
        : `<td style="--ac:${ARTFARBE[ci % ARTFARBE.length]}" class="sp${ci % 2} nd">nicht dokumentiert</td>`).join("")}</tr>`;
    }
    const kurzfassung = arten.length > 1 ? kurzHtml(zeilen, arten) : "";
    box.innerHTML = `<div class="av-scroll">${kurzfassung}<table class="av-t" style="--n:${arten.length}"><thead>${kopf}</thead><tbody>${körper}</tbody></table></div>`;
    box.querySelectorAll("img[data-fk]").forEach((im) => foto(BYK.get(im.dataset.fk), im));
  }

  // Beschriftung eines Merkmals: gemeinsamer Anfang der Ausprägungen, aber nur wenn er auf ein Hauptwort endet
  function beschrift(z) {
    let pre = z.lab && z.lab.endsWith(" …") ? z.lab.slice(0, -2).trim() : "";
    if (pre && !/[A-ZÄÖÜ][\wäöüß\-]*$/.test(pre)) pre = "";
    const nomen = () => { const w = []; for (const t of z.opts || []) for (const m of t.match(/\b[A-ZÄÖÜ][a-zäöüß\-]{3,}/g) || []) if (!w.includes(m) && !/^(Männchen|Weibchen|Beim|Die|Der|Das|Zwischen|Innen|Außen|Ohne|Mit|Nicht|Kein|Keine|Sehr|Über|Unter|Hinter|Oben|Unten|Etwa|Fast|Ganz|Deutlich|Stark|Schwach)$/.test(m)) w.push(m); return w.slice(0, 3).join(", "); };
    const lab = pre || (z.lab && !z.lab.endsWith(" …") ? z.lab : "") || nomen() || z.regName;
    const gross = (x) => x.charAt(0).toUpperCase() + x.slice(1);
    const wert = (t, trenn) => t.split(" / oder: ").map((x) => (pre && x.startsWith(pre) ? gross(x.slice(pre.length).replace(/^[\s:,;]+/, "")) : x)).join(trenn);
    return { lab, wert };
  }

  // ---------- Kurzfassung: die wichtigsten Unterschiede in Worten (artgenaue Merkmale zuerst)
  const offen = new Set();
  let kurzOffen = false;
  function kurzHtml(zeilen, arten) {
    const lvlRang = (z) => Math.min(...z.zellen.filter(Boolean).map((c) => (c.lvl === "Art" || !c.lvl ? 0 : c.lvl === "Gattung" ? 1 : 2)));
    const regOrd = ["masse", ...MM.regionen.map((r) => r[0])];
    const ds = zeilen.filter((z) => z.reg !== "allg" && z.status === "verschieden")
      .sort((a, b) => lvlRang(a) - lvlRang(b) || regOrd.indexOf(a.reg) - regOrd.indexOf(b.reg));
    const name = (i) => `<span class="av-artpunkt" style="--ac:${ARTFARBE[i % ARTFARBE.length]}"></span><i>${esc(arten[i].n)}</i>`;
    const fam = new Set(arten.map((s) => s.f)), gat = new Set(arten.map((s) => s.g));
    const kopf = `<p class="av-kz-satz">${arten.length} Arten aus ${gat.size === 1 ? `derselben Gattung <i>${esc([...gat][0])}</i>` : fam.size === 1 ? `${gat.size} Gattungen derselben Familie ${esc([...fam][0])}` : `${fam.size} Familien`}. ${ds.length ? `Sie unterscheiden sich in <b>${ds.length}</b> dokumentierten ${ds.length === 1 ? "Merkmal" : "Merkmalen"}${ds.length > 6 ? "; die wichtigsten:" : ":"}` : "In den ausgewerteten Quellen sind keine eindeutigen Unterschiede zwischen diesen Arten dokumentiert."}</p>`;
    const li = ds.slice(0, 6).map((z) => {
      const B = z.opts ? beschrift(z) : { lab: z.lab, wert: (t) => t };
      const lab = B.lab;
      const gr = new Map();
      z.zellen.forEach((c, i) => { if (c) { if (!gr.has(c.key)) gr.set(c.key, { c, a: [] }); gr.get(c.key).a.push(i); } });
      const wert = (c) => B.wert(c.t, " oder ");
      return `<li><b>${esc(lab)}</b> <small class="av-grau">(${esc(z.regName)})</small><ul>${[...gr.values()].map((g) => `<li><span class="av-farbe f${g.c.farbe % FARBEN.length}"></span>${esc(wert(g.c))}: ${g.a.map(name).join(", ")}</li>`).join("")}</ul></li>`;
    }).join("");
    return `<details class="av-kurz"${kurzOffen ? " open" : ""}><summary>🔑 Woran unterscheiden sich die Arten? <small class="av-grau">Die wichtigsten Bestimmungsmerkmale</small></summary>${kopf}${li ? `<ol class="av-kz">${li}</ol>` : ""}${ds.length > 6 ? `<p class="av-grau av-kz-mehr">Alle ${ds.length} Unterschiede stehen in der Tabelle darunter (rot markiert); mit „Zeigen: Nur Unterschiede“ siehst du nur diese.</p>` : ""}</details>`;
  }

  // ---------- Auswahl
  const ARTFARBE = ["#2f6b3a", "#2b5fa8", "#c27a12", "#8e44ad", "#c0392b", "#16857c", "#8a7a10", "#555b57"];
  function chips() { return;
    $("av-chips").innerHTML = st.arten.map((k, i) => { const s = BYK.get(k); return `<span class="av-chip" style="--ac:${ARTFARBE[i % ARTFARBE.length]}"><i>${esc(s.n)}</i><button type="button" data-weg="${esc(k)}" aria-label="entfernen">✕</button></span>`; }).join("")
      + (st.arten.length ? `<button type="button" class="av-chip leeren" id="av-alle-weg">Auswahl leeren</button>` : "");
  }
  function schnell() {
    const s = st.arten.length ? BYK.get(st.arten[0]) : null;
    if (!s) { $("av-schnell").innerHTML = ""; $("av-tabelle").dataset.bsp = `<span class="av-grau">Beispiele:</span> ${[["Mantis religiosa", "Sphodromantis viridis", "Hierodula membranacea"], ["Sphodropoda tristis", "Sphodropoda viridis", "Sphodropoda quinquedens", "Sphodropoda lepida"], ["Empusa pennata", "Empusa fasciata", "Idolomantis diabolica"]]
      .map((b) => b.filter((n) => SP.some((x) => x.n === n))).filter((b) => b.length > 1).map((b) => `<button type="button" class="av-bsp" data-bsp="${esc(b.join("|"))}">${b.map((n) => `<i>${esc(n)}</i>`).join(" · ")}</button>`).join("")}`; return; }
    const gat = SP.filter((x) => x.g === s.g && !st.arten.includes(x.k));
    $("av-schnell").innerHTML = gat.length && st.arten.length < MAX ? `<button type="button" class="av-link" data-gat="${esc(s.g)}">+ weitere Arten der Gattung <i>${esc(s.g)}</i> (${gat.length})</button>` : "";
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
    if (e.target.id === "av-info-k") $("av-info").hidden = !$("av-info").hidden;
    if (e.target.closest("#av-mehr-k")) { const o = !document.body.classList.contains("mehr-offen"); document.body.classList.toggle("mehr-offen", o); $("av-mehr-k").setAttribute("aria-expanded", o); $("av-mehr-k").textContent = o ? "⚙️ Weniger" : "⚙️ Mehr"; }
    const auf = e.target.closest("[data-auf]"); if (auf) { offen.add(auf.dataset.auf); zeichnen(); return; }
    const zu = e.target.closest("[data-zu]"); if (zu) { offen.delete(zu.dataset.zu); zeichnen(); return; }
  });
  $("av-zeig").addEventListener("change", (e) => { st.zeig = e.target.value; zeichnen(); });
  $("av-sort").addEventListener("change", (e) => { st.sort = e.target.value; zeichnen(); });
  document.addEventListener("toggle", (e) => { if (e.target.classList && e.target.classList.contains("av-kurz")) kurzOffen = e.target.open; }, true);
  $("av-leer").addEventListener("change", (e) => { st.leer = e.target.checked; zeichnen(); });
  $("av-aehnl").addEventListener("change", (e) => { st.aehnl = e.target.checked; zeichnen(); });
  $("av-zurueck").onclick = () => { if (history.length > 1 && document.referrer && new URL(document.referrer).origin === location.origin) history.back(); else location.href = "index.html"; };

  // eingebettet im Reiter "Bestimmen": ohne eigene Kopfzeile, Links öffnen die Hauptseite
  const EIN = new URLSearchParams(location.search).get("eingebettet") === "1" && window.top !== window;
  if (EIN) {
    document.documentElement.classList.add("eingebettet");
    const an = (m) => window.parent.postMessage(Object.assign({ mantodeaVgl: m.t }, m), location.origin);
    $("av-zurueck").innerHTML = "✕<span class='av-l2'> Schließen</span>"; $("av-zurueck").title = "Vergleich schließen";
    $("av-zurueck").onclick = () => an({ t: "zu" });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("av-vorschlag").hidden) an({ t: "zu" }); });
    document.addEventListener("click", (e) => { const a = e.target.closest("a.av-name"); if (a) { e.preventDefault(); an({ t: "art", k: decodeURIComponent(a.href.split("#art=")[1]) }); } }, true);
  }
  // Vergleich teilen: Link auf die Hauptseite (#vergleich=…); ohne Zugang sieht man dort nur diesen Vergleich
  const GAST = !!window.MANTODEA_GAST;
  if (GAST) document.documentElement.classList.add("av-gast");
  function hinweis(html) {
    let t = $("av-toast");
    if (!t) { t = document.createElement("div"); t.id = "av-toast"; t.className = "av-toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = html; t.classList.add("an");
    clearTimeout(hinweis.t); hinweis.t = setTimeout(() => t.classList.remove("an"), 6000);
  }
  $("av-teilen").addEventListener("click", async () => {
    if (!st.arten.length) return;
    const url = new URL("index.html", location.href).href.split("#")[0].split("?")[0] + "#vergleich=" + st.arten.map(encodeURIComponent).join(",");
    const namen = st.arten.map((k) => BYK.get(k).n);
    const titel = "Artenvergleich: " + namen.join(" · ");
    const text = `${titel} – „Mantodea der Welt“`;
    if (navigator.share) {
      try { await navigator.share({ title: titel, text, url }); return; } catch (err) { if (err && err.name === "AbortError") return; }
    }
    let kopiert = false;
    try { await navigator.clipboard.writeText(url); kopiert = true; } catch (err) { /* nicht erlaubt */ }
    const wa = "https://wa.me/?text=" + encodeURIComponent(text + " " + url);
    const mail = "mailto:?subject=" + encodeURIComponent(titel) + "&body=" + encodeURIComponent(text + "\n" + url);
    hinweis(`${kopiert ? "Link kopiert." : `Link: <span class="av-url">${esc(url)}</span>`} Teilen über <a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp ↗</a> · <a href="${esc(mail)}">E-Mail ↗</a>`);
  });
  // beim Wechsel zwischen Handy- und Breitansicht neu aufbauen
  const mq = window.matchMedia ? window.matchMedia("(max-width: 700px)") : null;
  if (mq && mq.addEventListener) mq.addEventListener("change", () => zeichnen()); else if (mq && mq.addListener) mq.addListener(() => zeichnen());
  lesen(); zeichnen();
  window.__avTest = { vergleich, profil, BYK, st, zeichnen };
})();
