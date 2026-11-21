// Bestimmung im Steckbrief: deutsche Bestimmungsschlüssel aus der Fachliteratur (data/bestimmung.js)
// - im Steckbrief: Merkmale der Art laut Schlüssel (Weg durch den Schlüssel) und Abgrenzung zu den nächsten Arten
// - eigener Dialog mit dem ganzen Schlüssel; Artnamen sind verlinkt, Endpunkte mit Foto
// Alle Texte stammen aus den Schlüsseln der genannten Arbeiten (übersetzt, Original einblendbar) – nichts wird hinzugefügt.
(() => {
  "use strict";
  const UI = window.MANTODEA_UI;
  if (!UI) return;
  const { loadScript, esc, BYKEY, imgTag, fill, detail } = UI;
  const SPR = { en: "Englisch", fr: "Französisch", de: "Deutsch", pt: "Portugiesisch", es: "Spanisch", it: "Italienisch" };
  let B = null;
  const laden = async () => {
    if (B) return B;
    try { await loadScript("data/bestimmung.js"); } catch (e) { return null; }
    return (B = window.MANTODEA_BEST || null);
  };
  const name = (k) => (BYKEY.get(String(k)) || {}).n || "?";
  const artLink = (k) => `<a href="#" class="bk-art" data-art="${esc(k)}"><i>${esc(name(k))}</i></a>`;
  const bild = (k, cls) => { const s = BYKEY.get(String(k)); return s && s.p ? `<span class="${cls}">${imgTag(s, s.n)}</span>` : ""; };
  const bildName = (k) => { const s = BYKEY.get(String(k)); return s && s.p ? `<figure class="bk-th"><a href="#" data-art="${esc(k)}">${imgTag(s, s.n)}</a><figcaption><i>${esc(s.n)}</i></figcaption></figure>` : ""; };
  const gName = (K) => K.g ? `zur Gattung <i>${esc(K.g)}</i>` : `zu mehreren Gattungen (${K.gs.map((g) => `<i>${esc(g)}</i>`).join(", ")})`;

  // Weg durch den Schlüssel: für jedes Paar, von welchem Gegensatz es erreicht wird
  function wege(K) {
    const nr = new Map(K.p.map((p, i) => [p.n, i])), eltern = new Map();
    K.p.forEach((p, i) => ["a", "b"].forEach((s) => { if (typeof p[s].z === "number" && nr.has(p[s].z)) eltern.set(nr.get(p[s].z), [i, s]); }));
    const weg = (i, s) => { const out = [[i, s]]; let c = i, n = 0; while (eltern.has(c) && n++ < 40) { const e = eltern.get(c); out.unshift(e); c = e[0]; } return out; };
    // alle Arten unterhalb eines Gegensatzes
    const unter = (z, tiefe = 0) => typeof z === "object" ? [z.k] : nr.has(z) && tiefe < 40 ? ["a", "b"].flatMap((s) => unter(K.p[nr.get(z)][s].z, tiefe + 1)) : [];
    return { nr, weg, unter };
  }

  // Abschnitt im Steckbrief
  async function abschnitt(s) {
    const box = document.getElementById("d-best");
    if (!box) return;
    const D = await laden();
    if (!box.isConnected || String(document.getElementById("d-body").dataset.k) !== String(s.k)) return;
    const ks = D ? [...new Set([...(D.s[s.k] || []), ...(D.g[s.g] || [])])] : [];
    if (!ks.length) {
      box.innerHTML = `<p class="muted small">Für die Gattung <i>${esc(s.g)}</i> wurde in der Literatursammlung noch kein gegliederter Bestimmungsschlüssel gefunden. Arbeiten mit Schlüsseln stehen unten.</p>`;
      return;
    }
    let h = `<p class="d-actions"><button type="button" class="primary" data-best="${esc(s.k)}">🔑 Bestimmungsschlüssel öffnen (Deutsch)</button></p>`;
    const eigene = (D.s[s.k] || []);
    for (const i of eigene) {
      const K = D.k[i], W = wege(K);
      const end = K.p.flatMap((p, j) => ["a", "b"].filter((x) => typeof p[x].z === "object" && p[x].z.k === s.k).map((x) => [j, x]));
      if (!end.length) continue;
      const [j, x] = end[0], pfad = W.weg(j, x);
      const gegen = x === "a" ? "b" : "a", andere = [...new Set(W.unter(K.p[j][gegen].z))];
      h += `<div class="bk-kurz"><h4 class="d-sub">Merkmale laut Schlüssel <small>${esc(K.q)}</small></h4>
        <ol class="bk-weg">${pfad.map(([pi, ps]) => `<li>${esc(K.p[pi][ps].t)}</li>`).join("")}</ol>
        ${andere.length ? `<p class="bk-ab"><b>Unterschied zu</b> ${andere.map(artLink).join(", ")}: dort <span>„${esc(K.p[j][gegen].t)}“</span></p>
          <div class="bk-vergl">${bildName(s.k)}${andere.slice(0, 5).map(bildName).join("")}</div>` : ""}</div>`;
    }
    if (!eigene.length) h += `<p class="muted small">Die Art selbst kommt in den gefundenen Schlüsseln nicht vor, aber es gibt Schlüssel zu Arten der Gattung <i>${esc(s.g)}</i>.</p>`;
    box.innerHTML = h;
    box.querySelectorAll("img[data-ik]").forEach(fill);
  }

  // Dialog mit dem ganzen Schlüssel
  let dlg = null;
  function dialog() {
    if (dlg) return dlg;
    dlg = document.createElement("dialog");
    dlg.className = "cdlg bk-dlg";
    dlg.innerHTML = `<div class="cdlg-head"><h2>🔑 Bestimmungsschlüssel</h2><button type="button" class="close" aria-label="Schließen">×</button></div><div class="bk-body"></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest(".close")) { dlg.close(); return; }
      const a = e.target.closest("[data-art]");
      if (a) { e.preventDefault(); dlg.close(); detail(a.dataset.art); return; }
      const g = e.target.closest("[data-geh]");
      if (g) { e.preventDefault(); const t = dlg.querySelector(`#bk-p-${g.dataset.geh}`); if (t) { t.scrollIntoView({ behavior: "smooth", block: "center" }); t.classList.add("blink"); setTimeout(() => t.classList.remove("blink"), 1200); } return; }
      const t = e.target.closest("[data-tab]");
      if (t) { zeige(+t.dataset.tab); return; }
      if (e.target.closest(".bk-orig-sw")) dlg.classList.toggle("orig");
    });
    return dlg;
  }
  let akt = { ks: [], art: null };
  function zeige(ti) {
    const D = B, K = D.k[akt.ks[ti]], W = wege(K);
    const meinWeg = new Set();
    if (akt.art) K.p.forEach((p, j) => ["a", "b"].forEach((x) => { if (typeof p[x].z === "object" && p[x].z.k === akt.art) W.weg(j, x).forEach(([a, b]) => meinWeg.add(a + b)); }));
    const ziel = (z) => typeof z === "number"
      ? (W.nr.has(z) ? `<a href="#" class="bk-geh" data-geh="${z}">→ ${z}</a>` : `<span class="bk-fehlt" title="Dieses Paar konnte aus dem PDF nicht sauber gelesen werden">→ ${z} <small>(siehe PDF)</small></span>`)
      : `<span class="bk-end">${bild(z.k, "bk-mini")}${artLink(z.k)}</span>`;
    const seite = (p, x) => `<div class="bk-l${meinWeg.has(p.__i + x) ? " mein" : ""}"><span class="bk-x">${x === "a" ? "a" : "b"}</span>
        <div class="bk-t">${esc(p[x].t)}${p[x].o ? `<span class="bk-o">${esc(p[x].o)}</span>` : ""}</div>${ziel(p[x].z)}</div>`;
    const body = dlg.querySelector(".bk-body");
    body.innerHTML = `${akt.ks.length > 1 ? `<div class="bk-tabs">${akt.ks.map((ki, i) => `<button type="button" data-tab="${i}" aria-pressed="${i === ti}">${D.k[ki].g ? `<i>${esc(D.k[ki].g)}</i>` : "mehrere Gattungen"} · ${esc(D.k[ki].q)}</button>`).join("")}</div>` : ""}
      <div class="bk-kopf"><b>Schlüssel ${gName(K)}</b>
        <span class="muted small">nach ${esc(K.q)}${K.qt ? ` – ${esc(K.qt.slice(0, 110))}` : ""}</span>
        <span class="bk-qu"><a class="erst-mini" href="${esc(K.u.replace(/([?&])dl=0/, "$1raw=1"))}" target="_blank" rel="noopener">📄 Originalarbeit (PDF)</a>
        ${K.l !== "de" ? `<button type="button" class="bk-orig-sw">Original (${SPR[K.l] || K.l}) ein/aus</button>` : ""}</span>
        <p class="muted small">${K.l !== "de" ? `Aus dem ${SPR[K.l] || K.l}en übersetzt, eng am Wortlaut. ` : ""}Nur Paare, die sich sauber aus dem PDF lesen ließen. Abbildungsverweise (Abb.) beziehen sich auf die Originalarbeit.${akt.art ? ` <span class="bk-mein-hint">Grün markiert: Weg zu <i>${esc(name(akt.art))}</i>.</span>` : ""}</p></div>
      ${K.p.map((p, i) => { p.__i = i; return `<div class="bk-p" id="bk-p-${p.n}"><div class="bk-n">${p.n}</div><div class="bk-ls">${seite(p, "a")}${seite(p, "b")}</div></div>`; }).join("")}`;
    body.querySelectorAll("img[data-ik]").forEach(fill);
    body.scrollTop = 0;
    const m = body.querySelector(".bk-l.mein");
    if (m) setTimeout(() => m.scrollIntoView({ block: "center" }), 50);
  }
  async function oeffnen(k) {
    const D = await laden(); if (!D) return;
    const s = BYKEY.get(String(k)); if (!s) return;
    akt = { ks: [...new Set([...(D.s[s.k] || []), ...(D.g[s.g] || [])])], art: s.k };
    if (!akt.ks.length) return;
    dialog(); dlg.classList.remove("orig");
    zeige(0);
    dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-best]");
    if (b) { e.preventDefault(); oeffnen(b.dataset.best); return; }
    const a = e.target.closest("#d-best [data-art]");
    if (a) { e.preventDefault(); detail(a.dataset.art); }
  });
  document.addEventListener("mantodea:detail", (e) => { const s = BYKEY.get(String(e.detail)); if (s) abschnitt(s); });
})();
