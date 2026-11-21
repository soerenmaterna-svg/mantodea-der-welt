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
  const BUCH = "abcdefgh";
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
  const istArt = (z) => z && typeof z === "object";

  // Weg durch den Schlüssel: [Paar-Index, Gegensatz-Index] von der Wurzel bis zum Ziel
  function wege(K) {
    const nr = new Map(K.p.map((p, i) => [p.n, i])), eltern = new Map();
    K.p.forEach((p, i) => p.l.forEach((x, j) => { if (typeof x.z === "number" && nr.has(x.z)) eltern.set(nr.get(x.z), [i, j]); }));
    const weg = (i, j) => { const out = [[i, j]]; let c = i, n = 0; while (eltern.has(c) && n++ < 60) { const e = eltern.get(c); out.unshift(e); c = e[0]; } return out; };
    const unter = (z, tiefe = 0) => istArt(z) ? [z.k || null].filter(Boolean) : nr.has(z) && tiefe < 60 ? K.p[nr.get(z)].l.flatMap((x) => unter(x.z, tiefe + 1)) : [];
    const endpunkte = (k) => K.p.flatMap((p, i) => p.l.map((x, j) => (istArt(x.z) && x.z.k === k ? [i, j] : null)).filter(Boolean));
    return { nr, weg, unter, endpunkte };
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
      const end = W.endpunkte(s.k);
      if (!end.length) continue;
      const [pi, li] = end[0], pfad = W.weg(pi, li);
      const gegen = K.p[pi].l.map((x, j) => j).filter((j) => j !== li);
      const andere = [...new Set(gegen.flatMap((j) => W.unter(K.p[pi].l[j].z)))];
      h += `<div class="bk-kurz"><h4 class="d-sub">Merkmale laut Schlüssel <small>${esc(K.q)}${K.t ? " · " + esc(K.t) : ""}</small></h4>
        ${K.h ? `<p class="muted small">${esc(K.h)}</p>` : ""}
        <ol class="bk-weg">${pfad.map(([a, b]) => `<li>${esc(K.p[a].l[b].t)}</li>`).join("")}</ol>
        ${andere.length ? `<p class="bk-ab"><b>Unterschied zu</b> ${andere.map(artLink).join(", ")}: dort ${gegen.map((j) => `<span>„${esc(K.p[pi].l[j].t)}“</span>`).join(" bzw. ")}</p>
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
    if (akt.art) W.endpunkte(akt.art).forEach(([i, j]) => W.weg(i, j).forEach(([a, b]) => meinWeg.add(a + ":" + b)));
    const ziel = (z) => typeof z === "number"
      ? (W.nr.has(z) ? `<a href="#" class="bk-geh" data-geh="${z}">→ ${z}</a>` : `<span class="bk-fehlt" title="Dieses Paar konnte aus dem PDF nicht sauber gelesen werden">→ ${z} <small>(siehe PDF)</small></span>`)
      : istArt(z) ? (z.k ? `<span class="bk-end">${bild(z.k, "bk-mini")}${artLink(z.k)}</span>` : `<span class="bk-end"><i>${esc(z.n)}</i> <small class="muted" title="Nicht in der Artenliste (z. B. heute Synonym oder Unterart)">(nicht in der Liste)</small></span>`)
      : `<span class="bk-fehlt">(siehe PDF)</span>`;
    const zeile = (p, i, x, j) => `<div class="bk-l${meinWeg.has(i + ":" + j) ? " mein" : ""}"><span class="bk-x">${BUCH[j]}</span>
        <div class="bk-t">${esc(x.t)}${x.o ? `<span class="bk-o">${esc(x.o)}</span>` : ""}</div>${ziel(x.z)}</div>`;
    const body = dlg.querySelector(".bk-body");
    body.innerHTML = `${akt.ks.length > 1 ? `<div class="bk-tabs">${akt.ks.map((ki, i) => `<button type="button" data-tab="${i}" aria-pressed="${i === ti}">${D.k[ki].g ? `<i>${esc(D.k[ki].g)}</i>` : "mehrere Gattungen"} · ${esc(D.k[ki].q)}${D.k[ki].t && D.k[ki].m ? " · " + esc(D.k[ki].t.split("–").pop().trim()) : ""}</button>`).join("")}</div>` : ""}
      <div class="bk-kopf"><b>Schlüssel ${gName(K)}</b>${K.m && K.t ? `<span class="small">${esc(K.t)}</span>` : ""}
        <span class="muted small">nach ${esc(K.q)}${K.qt ? ` – ${esc(K.qt.slice(0, 110))}` : ""}</span>
        <span class="bk-qu"><a class="erst-mini" href="${esc(K.u.replace(/([?&])dl=0/, "$1raw=1"))}" target="_blank" rel="noopener">📄 Originalarbeit (PDF)</a>
        ${K.l !== "de" ? `<button type="button" class="bk-orig-sw">Original (${SPR[K.l] || K.l}) ein/aus</button>` : ""}</span>
        ${K.h ? `<p class="small"><b>Hinweis:</b> ${esc(K.h)}</p>` : ""}
        <p class="muted small">${K.l !== "de" ? `Aus dem ${SPR[K.l] || K.l}en übersetzt, eng am Wortlaut${K.m ? ", von Hand geprüft" : ""}. ` : K.m ? "Von Hand geprüft. " : ""}${K.m ? "" : "Nur Paare, die sich sauber aus dem PDF lesen ließen. "}Abbildungsverweise (Abb.) beziehen sich auf die Originalarbeit.${akt.art ? ` <span class="bk-mein-hint">Grün markiert: Weg zu <i>${esc(name(akt.art))}</i>.</span>` : ""}</p></div>
      ${K.p.map((p, i) => `<div class="bk-p" id="bk-p-${p.n}"><div class="bk-n">${p.n}</div><div class="bk-ls">${p.l.map((x, j) => zeile(p, i, x, j)).join("")}</div></div>`).join("")}`;
    body.querySelectorAll("img[data-ik]").forEach(fill);
    body.scrollTop = 0;
    const m = body.querySelector(".bk-l.mein");
    if (m) setTimeout(() => m.scrollIntoView({ block: "center" }), 50);
  }
  async function oeffnen(k) {
    const D = await laden(); if (!D) return;
    const s = BYKEY.get(String(k)); if (!s) return;
    // eigene Schlüssel (Art kommt vor) zuerst, handgeprüfte vor automatisch gelesenen
    const eigen = D.s[s.k] || [], gatt = D.g[s.g] || [];
    akt = { ks: [...new Set([...eigen, ...gatt])].sort((a, b) => (eigen.includes(b) - eigen.includes(a)) || (D.k[b].m - D.k[a].m)), art: s.k };
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
