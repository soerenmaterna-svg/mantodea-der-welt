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
  const gName = (K) => K.g ? `zur Gattung <i>${esc(K.g)}</i>` : K.gs.length <= 4 ? `zu mehreren Gattungen (${K.gs.map((g) => `<i>${esc(g)}</i>`).join(", ")})` : `zu ${K.gs.length} Gattungen`;
  const istArt = (z) => z && typeof z === "object";

  // Weg durch den Schlüssel: [Paar-Index, Gegensatz-Index] von der Wurzel bis zum Ziel
  function wege(K) {
    const nr = new Map(K.p.map((p, i) => [p.n, i])), eltern = new Map();
    K.p.forEach((p, i) => p.l.forEach((x, j) => { if (typeof x.z === "number" && nr.has(x.z)) eltern.set(nr.get(x.z), [i, j]); }));
    const weg = (i, j) => { const out = [[i, j]]; let c = i, n = 0; while (eltern.has(c) && n++ < 60) { const e = eltern.get(c); out.unshift(e); c = e[0]; } return out; };
    const unter = (z, tiefe = 0) => istArt(z) ? [z.k || null].filter(Boolean) : nr.has(z) && tiefe < 60 ? K.p[nr.get(z)].l.flatMap((x) => unter(x.z, tiefe + 1)) : [];
    const suche = (f) => K.p.flatMap((p, i) => p.l.map((x, j) => (istArt(x.z) && f(x.z) ? [i, j] : null)).filter(Boolean));
    // Endpunkt der Art; gibt es keinen, dann der Endpunkt ihrer Gattung (Gattungsschlüssel)
    const endpunkte = (k) => { const e = suche((z) => z.k === k); if (e.length) return e; const g = (BYKEY.get(String(k)) || {}).g; if (!g) return []; const d = suche((z) => z.g === g && !z.b); return d.length ? d : suche((z) => z.g === g); };
    const unterG = (z, tiefe = 0) => istArt(z) ? (z.g ? [z.b ? `<i>${esc(z.g)}</i> (im Original <i>${esc(z.b)}</i>)` : `<i>${esc(z.g)}</i>`] : []) : nr.has(z) && tiefe < 60 ? K.p[nr.get(z)].l.flatMap((x) => unterG(x.z, tiefe + 1)) : [];
    return { nr, weg, unter, unterG, endpunkte };
  }

  // Schlüssel einer Art: Artenschlüssel ihrer Gattung bzw. Gattungsschlüssel, je nach Modus
  const ordne = (D, s, ks) => [...new Set(ks)].sort((a, b) =>
    ((D.s[s.k] || []).includes(b) - (D.s[s.k] || []).includes(a)) || (D.k[b].m - D.k[a].m) || (D.k[b].a.length - D.k[a].a.length));
  const artKs = (D, s) => ordne(D, s, D.ga[s.g] || []);   // nur vollständige Schlüssel (alle Arten, keine fremden Gattungen)
  const gattKs = (D, s) => ordne(D, s, D.gg[s.g] || []);
  const quelle = (D, K) => K.aus != null ? `Ausschnitt aus „${D.k[K.aus].t}“ (${D.k[K.aus].q}), ab Paar ${K.ab}` : `${K.q}${K.t ? " · " + K.t : ""}`;

  // Abschnitt im Steckbrief
  async function abschnitt(s) {
    const box = document.getElementById("d-best");
    if (!box) return;
    const D = await laden();
    if (!box.isConnected || String(document.getElementById("d-body").dataset.k) !== String(s.k)) return;
    if (!D) { box.innerHTML = ""; return; }
    const aK = artKs(D, s), gK = gattKs(D, s);
    const nArten = [...BYKEY.values()].filter((x) => x.g === s.g && !x.x).length;
    let h = `<h4 class="d-sub bk-gruppe">🔎 Arten der Gattung <i>${esc(s.g)}</i> bestimmen</h4>`;
    if (aK.length) {
      h += `<p class="d-actions"><button type="button" class="primary" data-best="${esc(s.k)}" data-modus="art">🔑 Artenschlüssel öffnen${aK.length > 1 ? ` (${aK.length})` : ""}</button></p>`;
      let boxen = 0;
      for (const i of aK) {
        const K = D.k[i], W = wege(K);
        if (boxen >= 2) continue;
        const end = W.endpunkte(s.k); if (!end.length) continue;
        boxen++;
        const [pi, li] = end[0], pfad = W.weg(pi, li);
        const gegen = K.p[pi].l.map((x, j) => j).filter((j) => j !== li);
        const andere = [...new Set(gegen.flatMap((j) => W.unter(K.p[pi].l[j].z)))];
        h += `<div class="bk-kurz"><h4 class="d-sub">Merkmale laut Artenschlüssel <small>${esc(quelle(D, K))}</small></h4>
          ${K.h ? `<p class="muted small">${esc(K.h)}</p>` : ""}
          <ol class="bk-weg">${pfad.map(([a, b]) => `<li>${esc(K.p[a].l[b].t)}</li>`).join("")}</ol>
          ${andere.length ? `<p class="bk-ab"><b>Unterschied zu</b> ${andere.map(artLink).join(", ")}: dort ${gegen.map((j) => `<span>„${esc(K.p[pi].l[j].t)}“</span>`).join(" bzw. ")}</p>
            <div class="bk-vergl">${bildName(s.k)}${andere.slice(0, 5).map(bildName).join("")}</div>` : ""}</div>`;
      }
      for (const i of aK) { const d = (D.k[i].d || []).find((x) => x[0] === s.k);
        if (d) h += `<p class="small">ℹ️ Laut ${esc(D.k[i].q)} ist <i>${esc(s.n)}</i> ein Synonym von <i>${esc(d[1])}</i> – im Schlüssel unter diesem Namen.</p>`; }
      h += `<p class="muted small">✔ ${aK.length > 1 ? "Diese Schlüssel enthalten" : "Dieser Schlüssel enthält"} alle ${nArten} heute gültigen Arten der Gattung <i>${esc(s.g)}</i>.</p>`;
    } else {
      const teil = (D.gt[s.g] || []).length;
      h += `<p class="muted small">${nArten <= 1 ? `Die Gattung <i>${esc(s.g)}</i> enthält nur diese eine Art – innerhalb der Gattung ist keine Bestimmung nötig.` : `Für die ${nArten} Arten der Gattung <i>${esc(s.g)}</i> gibt es in der Literatursammlung noch keinen Schlüssel, der alle Arten enthält.${teil ? ` Vorhandene ältere oder regionale Teilschlüssel (${teil}) decken nur einen Teil der Arten ab und werden deshalb hier nicht gezeigt; sie sind über die Literatur unten erreichbar.` : ""}`}</p>`;
    }
    h += `<h4 class="d-sub bk-gruppe">🧭 Gattung <i>${esc(s.g)}</i> bestimmen</h4>`;
    if (gK.length) {
      h += `<p class="d-actions"><button type="button" class="ghost" data-best="${esc(s.k)}" data-modus="gatt">🔑 Gattungsschlüssel öffnen${gK.length > 1 ? ` (${gK.length})` : ""}</button></p>`;
      let boxen = 0;
      for (const i of gK) {
        const K = D.k[i]; if (boxen >= 1) break;
        const W = wege(K), end = W.endpunkte(s.k); if (!end.length) continue;
        boxen++;
        const [pi, li] = end[0], pfad = W.weg(pi, li);
        const gegen = K.p[pi].l.map((x, j) => j).filter((j) => j !== li);
        const andere = [...new Set(gegen.flatMap((j) => W.unterG(K.p[pi].l[j].z)))].filter((g) => g !== `<i>${esc(s.g)}</i>`);
        const alt = (K.p[pi].l[li].z || {}).b;
        h += `<div class="bk-kurz"><h4 class="d-sub">Merkmale der Gattung laut Schlüssel <small>${esc(quelle(D, K))}</small></h4>
          ${alt ? `<p class="muted small">Im Original unter dem Namen <i>${esc(alt)}</i>.</p>` : ""}
          <ol class="bk-weg">${pfad.map(([a, b]) => `<li>${esc(K.p[a].l[b].t)}</li>`).join("")}</ol>
          ${andere.length ? `<p class="bk-ab"><b>Unterschied zu</b> ${andere.slice(0, 8).join(", ")}${andere.length > 8 ? " u. a." : ""}: dort ${gegen.map((j) => `<span>„${esc(K.p[pi].l[j].t)}“</span>`).join(" bzw. ")}</p>` : ""}</div>`;
      }
    } else h += `<p class="muted small">Noch kein Schlüssel gefunden, der zur Gattung <i>${esc(s.g)}</i> führt.</p>`;
    box.innerHTML = h;
    box.querySelectorAll("img[data-ik]").forEach(fill);
  }

  // Dialog mit dem ganzen Schlüssel
  let dlg = null;
  function dialog() {
    if (dlg) return dlg;
    dlg = document.createElement("dialog");
    dlg.className = "cdlg bk-dlg";
    dlg.innerHTML = `<div class="cdlg-head"><h2>🔑 Bestimmungsschlüssel</h2><button type="button" class="bk-zurueck" hidden></button><button type="button" class="close" aria-label="Schließen">×</button></div><div class="bk-body"></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener("close", () => document.documentElement.classList.remove("bk-offen"));
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest(".close")) { dlg.close(); return; }
      const a = e.target.closest("[data-art]");
      if (a) { e.preventDefault(); dlg.close(); detail(a.dataset.art); return; }
      const g = e.target.closest("[data-geh]");
      if (g) { e.preventDefault(); const von = g.closest(".bk-p"); springe(+g.dataset.geh, von ? +von.id.replace("bk-p-", "") : null); return; }
      if (e.target.closest(".bk-zurueck")) { e.preventDefault(); const n = verlauf.pop(); springe(n); return; }
      const ky = e.target.closest("[data-key]");
      if (ky) { e.preventDefault(); const k = +ky.dataset.key; if (!akt.ks.includes(k)) akt.ks.push(k); zeige(akt.ks.indexOf(k)); return; }
      const t = e.target.closest("[data-tab]");
      if (t) { zeige(+t.dataset.tab); return; }
      if (e.target.closest(".bk-orig-sw")) dlg.classList.toggle("orig");
      const w = e.target.closest("[data-wechsel]");
      if (w) { const D = B, s = BYKEY.get(String(akt.art)), ks = w.dataset.wechsel === "art" ? artKs(D, s) : gattKs(D, s);
        if (!ks.length) { w.textContent = w.dataset.wechsel === "art" ? "Für diese Gattung gibt es noch keinen Artenschlüssel" : "Kein Gattungsschlüssel vorhanden"; w.disabled = true; return; }
        oeffnen(akt.art, w.dataset.wechsel); }
    });
    return dlg;
  }
  let akt = { ks: [], art: null };
  let verlauf = [];                       // Sprünge im Schlüssel, für "zurück"
  const artenSchluessel = (g) => (B.ga[g] || []).slice().sort((a, b) => (B.k[b].m - B.k[a].m) || (B.k[b].a.length - B.k[a].a.length))[0] ?? -1;
  function springe(nr, merken) {
    const body = dlg.querySelector(".bk-body"), t = dlg.querySelector(`#bk-p-${nr}`); if (!t) return;
    if (merken != null) verlauf.push(merken);
    body.scrollTo({ top: body.scrollTop + t.getBoundingClientRect().top - body.getBoundingClientRect().top - 6, behavior: "smooth" });
    t.classList.remove("blink"); void t.offsetWidth; t.classList.add("blink");
    const zb = dlg.querySelector(".bk-zurueck");
    zb.hidden = !verlauf.length; if (verlauf.length) zb.textContent = `↩ zurück zu ${verlauf[verlauf.length - 1]}`;
  }
  function zeige(ti) {
    const D = B, K = D.k[akt.ks[ti]], W = wege(K);
    const meinWeg = new Set();
    if (akt.art) W.endpunkte(akt.art).forEach(([i, j]) => W.weg(i, j).forEach(([a, b]) => meinWeg.add(a + ":" + b)));
    const ziel = (z) => typeof z === "number"
      ? (W.nr.has(z) ? `<a href="#" class="bk-geh" data-geh="${z}">→ ${z}</a>` : `<span class="bk-fehlt" title="Dieses Paar konnte aus dem PDF nicht sauber gelesen werden">→ ${z} <small>(siehe PDF)</small></span>`)
      : istArt(z) && z.f ? `<span class="bk-end"><span class="muted small">${z.r || "Familie"}</span> <b>${esc(z.f)}</b>${((t) => t >= 0 && t !== akt.ks[ti] ? ` <a href="#" class="bk-geh" data-key="${t}">→ Gattungsschlüssel</a>` : "")(B.k.findIndex((x) => x.t && x.t.includes("der " + z.f)))}</span>`
      : istArt(z) && z.g ? `<span class="bk-end"><span class="muted small">Gattung</span> <i><b>${esc(z.g)}</b></i>${z.b ? ` <small class="muted" title="Name in der Originaltabelle; heute laut Mantodea Species File ein Synonym">(im Original: <i>${esc(z.b)}</i>)</small>` : ""}${z.x ? ` <small class="muted" title="Diese Gattung ist in der heutigen Artenliste nicht enthalten (vermutlich Synonym)">(heute nicht in der Liste)</small>` : ""}${((t) => t >= 0 && t !== akt.ks[ti] ? ` <a href="#" class="bk-geh" data-key="${t}" title="Schlüssel zu den Arten dieser Gattung öffnen">→ Artenschlüssel</a>` : "")(artenSchluessel(z.g))}</span>`
      : istArt(z) ? (z.k ? `<span class="bk-end">${bild(z.k, "bk-mini")}${artLink(z.k)}</span>` : `<span class="bk-end"><i>${esc(z.n)}</i> <small class="muted" title="Nicht in der Artenliste (z. B. heute Synonym oder Unterart)">(nicht in der Liste)</small></span>`)
      : `<span class="bk-fehlt">(siehe PDF)</span>`;
    const zeile = (p, i, x, j) => `<div class="bk-l${meinWeg.has(i + ":" + j) ? " mein" : ""}"><span class="bk-x">${BUCH[j]}</span>
        <div class="bk-t">${esc(x.t)}${x.o ? `<span class="bk-o">${esc(x.o)}</span>` : ""}</div>${ziel(x.z)}</div>`;
    const body = dlg.querySelector(".bk-body");
    body.innerHTML = `${akt.ks.length > 1 ? `<div class="bk-tabs">${akt.ks.map((ki, i) => { const X = D.k[ki]; const art = X.typ === "art";
        return `<button type="button" data-tab="${i}" aria-pressed="${i === ti}">${art ? (X.g && X.g !== akt.g ? `<i>${esc(X.g)}</i> · ` : "") : X.g ? `<i>${esc(X.g)}</i> · ` : ""}${esc(X.aus != null ? D.k[X.aus].q : X.q)}${X.aus != null ? " · Auszug: " + esc(D.k[X.aus].t.split("(")[0].trim()) : X.t && X.m ? " · " + esc(X.t.split("–").pop().trim()) : ""}</button>`; }).join("")}</div>` : ""}
      <div class="bk-kopf"><b>${K.typ === "art" ? (K.g ? `Artenschlüssel der Gattung <i>${esc(K.g)}</i>` : `Artenschlüssel für die Gattungen ${K.gs.map((g) => `<i>${esc(g)}</i>`).join(", ")}`) : `Schlüssel ${gName(K)}`}</b>${K.aus != null ? `<span class="small">Ausschnitt aus „${esc(D.k[K.aus].t)}“, ab Paar ${K.ab} – die Nummern entsprechen dem Original.${K.fremd && K.fremd.length ? ` Enthält auch: ${K.fremd.map((g) => `<i>${esc(g)}</i>`).join(", ")}.` : ""}</span>` : K.m && K.t ? `<span class="small">${esc(K.t)}</span>` : ""}
        <span class="muted small">nach ${esc(K.q)}${K.qt ? ` – ${esc(K.qt.slice(0, 110))}` : ""}</span>
        <span class="bk-qu"><a class="erst-mini" href="${esc(K.u.replace(/([?&])dl=0/, "$1raw=1"))}" target="_blank" rel="noopener">📄 Originalarbeit (PDF)</a>
        ${K.l !== "de" ? `<button type="button" class="bk-orig-sw">Original (${SPR[K.l] || K.l}) ein/aus</button>` : ""}</span>
        ${K.h ? `<p class="small"><b>Hinweis:</b> ${esc(K.h)}</p>` : ""}
        ${akt.art ? `<button type="button" class="bk-wechsel" data-wechsel="${akt.modus === "art" ? "gatt" : "art"}">${akt.modus === "art" ? "🧭 Zu den Gattungsschlüsseln" : "🔎 Zu den Artenschlüsseln der Gattung"}</button>` : ""}
        <p class="muted small">${K.l !== "de" ? `Aus dem ${SPR[K.l] || K.l}en übersetzt, eng am Wortlaut${K.m ? ", von Hand geprüft" : ""}. ` : K.m ? "Von Hand geprüft. " : ""}${K.m ? "" : "Nur Paare, die sich sauber aus dem PDF lesen ließen. "}Abbildungsverweise (Abb.) beziehen sich auf die Originalarbeit.${akt.art && meinWeg.size ? ` <span class="bk-mein-hint">Grün markiert: Weg zu <i>${esc(name(akt.art))}</i>.</span>` : ""}</p></div>
      ${K.p.map((p, i) => `<div class="bk-p" id="bk-p-${p.n}"><div class="bk-n">${p.n}</div><div class="bk-ls">${p.l.map((x, j) => zeile(p, i, x, j)).join("")}</div></div>`).join("")}`;
    body.querySelectorAll("img[data-ik]").forEach(fill);
    body.scrollTop = 0;
    verlauf = []; dlg.querySelector(".bk-zurueck").hidden = true;
    const m = body.querySelector(".bk-l.mein");
    if (m) setTimeout(() => body.scrollTo({ top: Math.max(0, body.scrollTop + m.closest(".bk-p").getBoundingClientRect().top - body.getBoundingClientRect().top - 6) }), 50);
  }
  async function oeffnen(k, modus) {
    const D = await laden(); if (!D) return;
    const s = BYKEY.get(String(k)); if (!s) return;
    if (!modus) modus = artKs(D, s).length ? "art" : "gatt";
    akt = { ks: modus === "art" ? artKs(D, s) : gattKs(D, s), art: s.k, modus, g: s.g };
    if (!akt.ks.length) return;
    dialog(); dlg.classList.remove("orig");
    dlg.querySelector(".cdlg-head h2").innerHTML = modus === "art" ? `🔑 Arten der Gattung <i>${esc(s.g)}</i>` : `🔑 Gattung bestimmen`;
    zeige(0);
    if (!dlg.open) dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
    document.documentElement.classList.add("bk-offen");
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-best]");
    if (b) { e.preventDefault(); oeffnen(b.dataset.best, b.dataset.modus); return; }
    const a = e.target.closest("#d-best [data-art]");
    if (a) { e.preventDefault(); detail(a.dataset.art); }
  });
  document.addEventListener("mantodea:detail", (e) => { const s = BYKEY.get(String(e.detail)); if (s) abschnitt(s); });
})();
