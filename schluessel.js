// Bestimmungsschlüssel (Bildtafeln). Daten: data/bestimmung.js (window.MANTODEA_BK), Zeichnungen: schluessel-bilder.js (window.MBILD).
(() => {
  "use strict";
  const BK = window.MANTODEA_BK, MB = window.MBILD;
  const $ = (id) => document.getElementById(id);
  const main = $("bk-main");
  if (!BK) { main.innerHTML = "<p>Die Schlüsseldaten konnten nicht geladen werden.</p>"; return; }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const DN = new Intl.DisplayNames(["de"], { type: "region" });
  const land = (c) => { try { return DN.of(c); } catch (e) { return c; } };
  const coll = new Intl.Collator("de");
  const LET = "abcdefgh";

  // ---------- Zustand: Pfad = Liste von {key, c (Paar-Index 1-basiert), wahl (Index), auto}
  const st = { key: "start", c: 1, path: [], land: localStorage.getItem("bk-land") || "" };

  // ---------- Einstiege
  const fams = Object.keys(BK.keys).filter((k) => k.startsWith("F:")).map((k) => k.slice(2)).sort(coll.compare);
  $("e-fam").innerHTML += fams.map((f) => `<option value="${esc(f)}">${esc(f)}</option>`).join("");
  const gens = Object.keys(BK.keys).filter((k) => k.startsWith("G:")).map((k) => k.slice(2)).sort(coll.compare);
  $("e-gen-list").innerHTML = gens.map((g) => `<option value="${esc(g)}">`).join("");
  const allC = new Set(); Object.values(BK.erdteile).forEach((e) => e.c.forEach((c) => allC.add(c)));
  $("e-land").innerHTML += [...allC].map((c) => [c, land(c)]).sort((a, b) => coll.compare(a[1], b[1])).map(([c, n]) => `<option value="${c}">${esc(n)}</option>`).join("");
  $("e-land").value = st.land;
  $("e-start").onclick = () => go("start");
  $("e-fam").onchange = (e) => { if (e.target.value) go("F:" + e.target.value); e.target.value = ""; };
  const genGo = () => { const v = $("e-gen").value.trim(); const g = gens.find((x) => x.toLowerCase() === v.toLowerCase()); if (g) { go("G:" + g); $("e-gen").value = ""; } };
  $("e-gen").addEventListener("change", genGo);
  $("e-gen").addEventListener("keydown", (e) => { if (e.key === "Enter") genGo(); });
  $("e-land").onchange = (e) => { st.land = e.target.value; localStorage.setItem("bk-land", st.land); render(); };

  function go(key, keepPath) {
    if (!BK.keys[key]) return;
    if (!keepPath) st.path = [];
    st.key = key; st.c = 1;
    pushHash(); render();
    main.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function pushHash() { history.replaceState(null, "", "#" + encodeURIComponent(st.key) + (st.c > 1 ? ":" + st.c : "")); }

  // ---------- Darstellung
  function flagsHtml(w) {
    if (!w) return "";
    const F = { v: ["⚖", "Vergleichsmerkmal: verlangt Abschätzen von Längen oder Breiten am Tier selbst"], m: ["🔬", "Nur mit Mikroskop bzw. präparierten Genitalien prüfbar – für Laien nicht geeignet"], mass: ["📏", "Messung nötig"], fr: ["FR", "Noch nicht übersetzt (Originaltext Giglio-Tos 1927, französisch)"] };
    return w.split(",").filter((x) => F[x]).map((x) => `<span class="flag" title="${esc(F[x][1])}">${F[x][0]}</span>`).join("");
  }
  function quelle(q) { const Q = BK.quellen[q]; if (!Q) return ""; return `<span class="src" title="${esc(Q.z)}">Quelle: ${esc(Q.t || Q.z)}</span>`; }
  function zielText(z) {
    if (typeof z === "number") return `→ ${z}`;
    if (z.k) return `→ ${esc((BK.keys[z.k] || {}).t || z.k)}`;
    const names = [];
    (z.f || []).forEach((f) => names.push("Familie " + f));
    (z.g || []).forEach((g) => names.push("Gattung " + g));
    (z.s || []).forEach((k) => names.push(BK.art[k] ? BK.art[k][0] : k));
    if (!names.length && z.n) return "→ Ende";
    return "→ " + esc(names.slice(0, 3).join(", ") + (names.length > 3 ? " …" : ""));
  }
  function bildFor(l) { return MB.svg(l.b || MB.auto(l.t)); }

  function render() {
    const K = BK.keys[st.key];
    if (!K) { main.innerHTML = "<p>Unbekannter Schlüssel.</p>"; return; }
    let h = crumbs();
    h += `<section class="bk-key"><header class="bk-key-head"><h2>${esc(K.t)}</h2>${K.fam ? `<p class="muted">Familie ${esc(K.fam)}</p>` : ""}${K.info ? `<p>${esc(K.info)}</p>` : ""}
      <p class="bk-tools"><button type="button" class="link" id="b-tafel">📄 ganze Tafel anzeigen / drucken</button>${st.path.length ? ` <button type="button" class="link" id="b-zur">↩ einen Schritt zurück</button>` : ""}</p></header>`;
    if (!K.c.length) { h += result(K.end, K); main.innerHTML = h + "</section>"; wire(); return; }
    const C = K.c[st.c - 1];
    // automatische Fundortwahl
    if (st.land && C.every((l) => l.geo || l.g)) {
      const hit = C.map((l, i) => [l, i]).filter(([l]) => (l.g || []).includes(st.land));
      if (hit.length === 1 && !C.every((l) => (l.g || []).includes(st.land))) {
        h += `<p class="bk-auto">📍 Fundort ${esc(land(st.land))}: automatisch gewählt – <b>${esc(hit[0][0].t)}</b>. <button type="button" class="link" data-auto="${hit[0][1]}">weiter</button></p>`;
      }
    }
    if (C.some((l) => l.u)) h += `<p class="muted small">Hinweis: Arten ohne bekannten Fundort sind vorsichtshalber in allen Fundort-Zweigen enthalten.</p>`;
    h += `<div class="bk-couplet" data-n="${C.length}"><div class="bk-num">${st.c}</div>`;
    C.forEach((l, i) => {
      const geoHint = st.land && l.g ? ((l.g || []).includes(st.land) ? " passt" : " passt-nicht") : "";
      h += `<button type="button" class="bk-lead${geoHint}" data-i="${i}">
        <span class="bk-lab">${st.c}${LET[i]}</span>
        <span class="bk-img">${bildFor(l)}</span>
        <span class="bk-txt">${esc(l.t)}${l.alle ? `<small class="muted"> (${esc(l.alle.join(", "))})</small>` : ""}</span>
        <span class="bk-meta">${flagsHtml(l.w)}${quelle(l.q)}</span>
        <span class="bk-ziel">${zielText(l.z)}</span>
      </button>`;
    });
    h += `</div></section>`;
    main.innerHTML = h; wire();
  }
  function crumbs() {
    if (!st.path.length) return "";
    return `<ol class="bk-crumbs">${st.path.map((p, i) => { const K = BK.keys[p.key]; const l = K.c[p.c - 1][p.wahl]; return `<li><button type="button" class="link" data-back="${i}" title="${esc(K.t)}">${p.c}${LET[p.wahl]}</button> ${esc(short(l.t))}</li>`; }).join("")}</ol>`;
  }
  const short = (t) => (t.length > 70 ? t.slice(0, 68) + " …" : t);

  function choose(i, auto) {
    const K = BK.keys[st.key], l = K.c[st.c - 1][i];
    st.path.push({ key: st.key, c: st.c, wahl: i, auto });
    const z = l.z;
    if (typeof z === "number") { st.c = z; pushHash(); render(); return; }
    if (z.k) { st.key = z.k; st.c = 1; pushHash(); render(); return; }
    // Ergebnis
    main.innerHTML = crumbs() + `<section class="bk-key"><header class="bk-key-head"><h2>Ergebnis</h2><p class="bk-tools"><button type="button" class="link" id="b-zur">↩ einen Schritt zurück</button></p></header>${result(z, K)}</section>`;
    wire(); main.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function result(z, K) {
    let h = `<div class="bk-result">`;
    if (z.n) h += `<p class="bk-note">${esc(z.n)}</p>`;
    for (const f of z.f || []) h += `<div class="res"><h3>Familie ${esc(f)}</h3>${BK.keys["F:" + f] ? `<button type="button" class="bk-btn primary" data-go="F:${esc(f)}">weiter: Gattungen der Familie ${esc(f)} →</button>` : ""}</div>`;
    for (const g of z.g || []) h += `<div class="res"><h3>Gattung <i>${esc(g)}</i></h3>${BK.keys["G:" + g] ? `<button type="button" class="bk-btn primary" data-go="G:${esc(g)}">weiter: Arten der Gattung ${esc(g)} →</button>` : ""}</div>`;
    const arts = z.s || [];
    if (arts.length > 1) h += `<p class="bk-note">Mit den vorhandenen Merkmalen nicht weiter trennbar. In Frage kommen ${arts.length} Arten:</p>`;
    for (const k of arts) h += artCard(k);
    if (z.a && z.a.length) {
      const taxa = z.a.filter((x) => /^[GF]:/.test(x)), arten = z.a.filter((x) => !/^[GF]:/.test(x));
      if (taxa.length) {
        h += `<div class="bk-auch"><p><b>Achtung:</b> ${taxa.length > 1 ? "Diese Gruppen sind" : "Diese Gruppe ist"} in keinem der ausgewerteten Schlüssel enthalten (meist erst später beschrieben), ${taxa.length > 1 ? "kommen" : "kommt"} nach dem Fundort aber ebenfalls in Frage:</p>`;
        for (const t of taxa) { const g = t.slice(2), isG = t[0] === "G"; h += `<div class="res klein"><h3>${isG ? "Gattung <i>" + esc(g) + "</i>" : "Familie " + esc(g)}</h3>${BK.keys[t] ? `<button type="button" class="bk-btn" data-go="${esc(t)}">weiter: ${isG ? "Arten" : "Gattungen"} von ${esc(g)} →</button>` : ""}</div>`; }
        h += `</div>`;
      }
      if (arten.length) h += `<div class="bk-auch"><p><b>Achtung:</b> ${arten.length > 1 ? "Folgende Arten sind" : "Folgende Art ist"} in keinem der ausgewerteten Bestimmungsschlüssel enthalten (meist später beschrieben oder nur unzureichend bekannt), ${arten.length > 1 ? "kommen" : "kommt"} nach dem Fundort aber ebenfalls in Frage. Zur sicheren Unterscheidung die Erstbeschreibung vergleichen:</p>${arten.map((k) => artCard(k, true)).join("")}</div>`;
    }
    return h + `</div>`;
  }
  function artCard(k, klein) {
    const A = BK.art[k]; if (!A) return "";
    const [n, au, f, lc, q] = A;
    const cs = lc ? lc.split(" ") : [];
    return `<div class="res art${klein ? " klein" : ""}"><h3><i>${esc(n)}</i> <small>${esc(au)}</small></h3>
      <p class="muted">Familie ${esc(f || "unklar")}</p>
      <p>${cs.length ? landListe(cs) + (q && q !== "daten" ? ` <small class="muted">(nach ${esc(q)})</small>` : "") : (q === "fossil" ? "Fossil" : "Fundorte: nicht bekannt")}</p>
      ${st.land && cs.length && !cs.includes(st.land) ? `<p class="warn">⚠ Für ${esc(land(st.land))} ist diese Art bisher nicht gemeldet.</p>` : ""}
      <p><a href="index.html#art=${encodeURIComponent(k)}">Steckbrief mit Fotos öffnen →</a></p></div>`;
  }

  function landListe(cs) {
    const n = cs.map(land).sort(coll.compare);
    if (n.length <= 12) return "Fundorte: " + esc(n.join(", "));
    return `<details><summary>Fundorte: ${n.length} Länder (anzeigen)</summary>${esc(n.join(", "))}</details>`;
  }
  function wire() {
    main.querySelectorAll(".bk-lead").forEach((b) => (b.onclick = () => choose(+b.dataset.i)));
    main.querySelectorAll("[data-auto]").forEach((b) => (b.onclick = () => choose(+b.dataset.auto, true)));
    main.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { st.key = b.dataset.go; st.c = 1; pushHash(); render(); main.scrollIntoView({ behavior: "smooth", block: "start" }); }));
    main.querySelectorAll("[data-back]").forEach((b) => (b.onclick = () => { const i = +b.dataset.back; const p = st.path[i]; st.path = st.path.slice(0, i); st.key = p.key; st.c = p.c; pushHash(); render(); }));
    const z = $("b-zur"); if (z) z.onclick = () => { const p = st.path.pop(); if (p) { st.key = p.key; st.c = p.c; pushHash(); render(); } };
    const t = $("b-tafel"); if (t) t.onclick = tafel;
  }

  // ---------- Tafelansicht (ganzer Schlüssel, druckbar)
  function tafel() {
    const K = BK.keys[st.key];
    let h = `<section class="bk-key bk-tafel"><header class="bk-key-head"><h2>${esc(K.t)} – Tafel</h2><p class="bk-tools"><button type="button" class="link" id="b-druck">🖨 drucken</button> <button type="button" class="link" id="b-zuruck2">↩ zurück zum Schritt ${st.c}</button></p></header>`;
    if (!K.c.length) h += result(K.end, K);
    K.c.forEach((C, ci) => {
      h += `<div class="tf-paar"><div class="tf-num">${ci + 1}</div><div class="tf-leads">`;
      C.forEach((l, i) => {
        const z = l.z; const zt = typeof z === "number" ? `<a href="#" data-jump="${z}">→ ${z}</a>` : zielText(z);
        h += `<div class="tf-lead"><div class="tf-img">${bildFor(l)}</div><div><b>${ci + 1}${LET[i]}</b> ${esc(l.t)} ${flagsHtml(l.w)} <span class="tf-z">${zt}</span></div></div>`;
      });
      h += `</div></div>`;
    });
    main.innerHTML = h + "</section>";
    $("b-druck").onclick = () => window.print();
    $("b-zuruck2").onclick = render;
    main.querySelectorAll("[data-jump]").forEach((a) => (a.onclick = (e) => { e.preventDefault(); const el = main.querySelectorAll(".tf-paar")[+a.dataset.jump - 1]; if (el) el.scrollIntoView({ behavior: "smooth" }); }));
  }

  // ---------- Über den Schlüssel
  const S = BK.statistik || {};
  $("bk-about").innerHTML = `
    <p>Der Schlüssel wurde aus der Literatursammlung des Projekts zusammengestellt (Stand ${esc(BK.stand)}). Grundlage der Gattungs- und vieler Artschlüssel ist das Gesamtwerk von Giglio-Tos (1927, <i>Das Tierreich</i> 50), dessen Bestimmungstabellen hier vollständig ausgewertet, ins Deutsche übertragen, auf die heute gültigen Namen umgestellt und miteinander verknüpft sind. Dazu kommen Bestimmungstabellen aus neueren Revisionen einzelner Gattungen. Fundortangaben stammen aus Belegdaten, Literaturfundorten, den Fundortzeilen bei Giglio-Tos und den Typusangaben der Erstbeschreibungen.</p>
    <p><b>Grenzen:</b> Von ${S.arten || "?"} heute gültigen Arten sind ${S.artenLit || "?"} in einem Literaturschlüssel enthalten. Für die übrigen trennt der Schlüssel nur über den Fundort; wo auch das nicht reicht, nennt er alle in Frage kommenden Arten. Viele Arten wurden nach 1927 beschrieben und fehlen in den alten Tabellen – sie werden an den passenden Stellen als „ebenfalls möglich“ angezeigt. Die heutigen Familien (Schwarz & Roy 2019) beruhen zum großen Teil auf Genitalmerkmalen und Erbgutvergleichen; äußerlich sind sie oft nicht scharf zu trennen. Der Weg zur Familie folgt deshalb den äußeren Merkmalen der alten Unterfamilien und führt die heutigen Familien als Ergebnis auf.</p>
    <p><b>Zeichen:</b> ⚖ = Merkmal verlangt einen Längen- oder Breitenvergleich am Tier selbst · 🔬 = nur mit Mikroskop/Genitalpräparat · 📏 = Messung · FR = noch nicht übersetzt.</p>`;

  // ---------- Start (auch über #Schlüssel:Paar)
  const hs = decodeURIComponent(location.hash.slice(1));
  if (hs) { const [k, c] = hs.split(/:(?=\d+$)/); if (BK.keys[k]) { st.key = k; st.c = +c || 1; } }
  render();
})();
