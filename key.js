// Vereinfachter Bestimmungsschlüssel: Fundort -> Körperform -> Bildvergleich passender Arten
(() => {
  "use strict";
  const UI = window.MANTODEA_UI;
  if (!UI) return;
  const { loadScript, paperHtml, esc, fmt, DATA, BYKEY, CONT, CONT_ORDER, imgTag, lazy, detail, PLACEHOLDER } = UI;
  const $ = (id) => document.getElementById(id);

  // Körperformen (Habitus) und die Familien, in denen sie typischerweise vorkommen.
  // Vereinfachung: Einzelne Arten können abweichen, Familien kommen teils in mehreren Formen vor.
  const HABITUS = [
    { id: "typisch", icon: `<img class="mantis-ico" src="data:image/png;base64,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" alt="">`, t: "Typische Gottesanbeterin", d: "Grün oder braun, schlank bis kräftig, Flügel normal, ohne auffällige Lappen oder Fortsätze.",
      f: ["Mantidae", "Miomantidae", "Hoplocoryphidae", "Galinthiadidae", "Dactylopterygidae", "Chroicopteridae", "Amelidae", "Rivetinidae", "Gonypetidae", "Nanomantidae", "Thespidae", "Photinaidae", "Coptopterygidae", "Epaphroditidae", "Leptomantellidae", "Majangidae", "Iridopterygidae", "Chaeteessidae", "Mantoididae"] },
    { id: "kegel", icon: "👑", t: "Kegel oder Fortsatz auf dem Kopf", d: "Kopf mit hohem, spitzem Fortsatz („Krone“), oft Lappen an den Beinen. Männchen mit gekämmten Fühlern (z. B. Haubenfangschrecke).",
      f: ["Empusidae"] },
    { id: "bluete", icon: "🌸", t: "Blüten-Mantis", d: "Oft bunt (weiß, rosa, gelb), Beine mit blattartigen Lappen, Flügel teils mit Augenflecken. Sitzt gern auf Blüten.",
      f: ["Hymenopodidae"] },
    { id: "blatt", icon: "🍂", t: "Blatt- oder Laubmantis", d: "Halsschild oder Körper blattartig verbreitert, wirkt wie ein (welkes) Blatt.",
      f: ["Deroplatyidae", "Acanthopidae", "Mantidae"] },
    { id: "stab", icon: "🌾", t: "Stab- oder Grasmantis", d: "Extrem lang und dünn, wie ein Zweig oder Grashalm. Augen oft spitz ausgezogen.",
      f: ["Toxoderidae", "Thespidae", "Angelidae", "Hoplocoryphidae"] },
    { id: "rinde", icon: "🌳", t: "Rinden- oder Flechtenmantis", d: "Flach, grau-grün gefleckt, sitzt eng an Baumstämmen und läuft schnell.",
      f: ["Liturgusidae", "Gonypetidae", "Amorphoscelidae", "Haaniidae"] },
    { id: "boden", icon: "🏜️", t: "Boden- oder Wüstenmantis", d: "Plump oder gedrungen, kurze oder fehlende Flügel, läuft am Boden in Wüste, Steppe oder Trockenrasen.",
      f: ["Eremiaphilidae", "Rivetinidae", "Amelidae"] },
    { id: "metall", icon: "💎", t: "Metallisch glänzend", d: "Blau oder grün schillernd, Südostasien.",
      f: ["Metallyticidae"] },
    { id: "klein", icon: "🔍", t: "Sehr klein (unter ca. 2 cm)", d: "Winzige Arten, oft in Laubstreu, Moos oder auf Rinde.",
      f: ["Mantoididae", "Nanomantidae", "Amorphoscelidae", "Haaniidae", "Leptomantellidae", "Chaeteessidae"] },
    { id: "egal", icon: "❓", t: "Weiß nicht / passt nichts", d: "Alle Familien anzeigen.", f: null },
  ];

  const st = { cont: null, hab: null, fam: "", gen: "", shown: 48, focus: null };

  const root = $("v-bestimmen");
  root.innerHTML = `
    <div class="intro">
      <h2>Bestimmungsschlüssel</h2>
      <p>Die Bestimmung läuft in drei Schritten: Fundort, Körperform, dann Bildvergleich mit den passenden Arten. Das ist eine <strong>vereinfachte Bestimmungshilfe</strong>. Viele Gattungen und Arten lassen sich nur mit Fachliteratur und manchmal nur anhand der Genitalien sicher unterscheiden. Für eine verlässliche Bestimmung lade dein Foto zusätzlich auf <a href="https://www.inaturalist.org/observations/upload" target="_blank" rel="noopener">iNaturalist</a> hoch.</p>
    </div>
    <div class="panel" id="k-lit"><h3>📖 Fachliteratur mit Bestimmungsschlüssel</h3><p class="muted">Lade …</p></div>
    <div class="panel step"><h3><span class="num">1</span> Wo wurde die Mantis gefunden?</h3><div class="chips" id="k-cont"></div></div>
    <div class="panel step"><h3><span class="num">2</span> Wie sieht sie aus?</h3><div class="habitus" id="k-hab"></div></div>
    <div class="panel step" id="k-res-wrap"><h3><span class="num">3</span> Vergleiche mit diesen Arten</h3>
      <p class="muted" id="k-info"></p>
      <div class="row grid k-filters">
        <label>Familie<select id="k-fam"></select></label>
        <label>Gattung<select id="k-gen"></select></label>
      </div>
      <div class="cards" id="k-res"></div>
      <p class="more-wrap"><button type="button" id="k-more" hidden>Weitere anzeigen</button></p>
      <p class="muted">Nichts Passendes gefunden? Trag den Fund unter <a href="#unbestimmt">Unbestimmte Mantiden</a> ein oder lade ihn auf iNaturalist hoch.</p>
    </div>`;

  $("k-cont").innerHTML = CONT_ORDER.filter((c) => c !== "NONE").map((c) => `<button type="button" class="chip" data-c="${c}" aria-pressed="false">${CONT[c]}</button>`).join("") +
    `<button type="button" class="chip" data-c="" aria-pressed="false">weiß nicht</button>`;
  $("k-hab").innerHTML = HABITUS.map((h) => `<button type="button" class="hab" data-h="${h.id}" aria-pressed="false"><span class="ico">${h.icon}</span><b>${esc(h.t)}</b><span>${esc(h.d)}</span></button>`).join("");

  const coll = new Intl.Collator("de");
  function candidates() {
    const h = HABITUS.find((x) => x.id === st.hab);
    const fams = h && h.f ? new Set(h.f) : null;
    return DATA.filter((s) => !s.x &&
      (!st.cont || s.c.includes(st.cont)) &&
      (!fams || fams.has(s.f)) &&
      (!st.fam || s.f === st.fam) &&
      (!st.gen || s.g === st.gen));
  }
  function score(s) {
    let v = (s.p ? 1e7 : 0) + (s.io || 0) + (s.o || 0) / 10;
    if (st.focus) { if (s.k === st.focus.k) v += 1e10; else if (s.g === st.focus.g) v += 1e9; }
    return v;
  }
  function render() {
    root.querySelectorAll("#k-cont .chip").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.c === st.cont)));
    root.querySelectorAll(".hab").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.h === st.hab)));
    // Auswahllisten aus der Menge ohne eigenen Filter
    const keepFam = st.fam, keepGen = st.gen;
    st.fam = ""; st.gen = "";
    const all = candidates(); st.fam = keepFam;
    const famCount = {}; all.forEach((s) => famCount[s.f] = (famCount[s.f] || 0) + 1);
    $("k-fam").innerHTML = `<option value="">alle (${fmt.format(all.length)})</option>` + Object.keys(famCount).sort(coll.compare).map((f) => `<option value="${esc(f)}">${esc(f)} (${famCount[f]})</option>`).join("");
    $("k-fam").value = st.fam;
    const gens = {}; candidates().forEach((s) => gens[s.g] = (gens[s.g] || 0) + 1);
    st.gen = keepGen;
    $("k-gen").innerHTML = `<option value="">alle Gattungen (${Object.keys(gens).length})</option>` + Object.keys(gens).sort(coll.compare).map((g) => `<option value="${esc(g)}">${esc(g)} (${gens[g]})</option>`).join("");
    $("k-gen").value = st.gen;

    const list = candidates().sort((a, b) => score(b) - score(a));
    const ready = st.cont !== null || st.hab;
    $("k-info").innerHTML = !ready ? "Wähle oben Fundort und/oder Körperform." :
      (st.focus ? `Ähnliche Arten wie <i>${esc(st.focus.n)}</i>: gleiche Familie (${esc(st.focus.f)})${st.cont ? `, gefunden in ${esc(CONT[st.cont])}` : ""}. Arten derselben Gattung stehen vorn. ` : "") +
      `${fmt.format(list.length)} mögliche Arten, sortiert nach Häufigkeit (Arten mit Foto zuerst). Antippen öffnet den Steckbrief mit Fotogalerie.`;
    $("k-res").innerHTML = !ready ? "" : list.slice(0, st.shown).map((s) => `
      <article class="card${st.focus && s.k === st.focus.k ? " focus" : ""}" tabindex="0" data-k="${esc(s.k)}">
        <div class="img">${s.p ? imgTag(s, s.n) : PLACEHOLDER}</div>
        <div class="body"><h3><i>${esc(s.n)}</i></h3>
          ${s.de || s.en ? `<p class="common">${esc(s.de || s.en)}</p>` : ""}
          <p class="tax">${esc(s.f)}${s.gn ? ` · ${s.gn} Fotos` : ""}</p></div>
      </article>`).join("");
    lazy($("k-res"));
    $("k-more").hidden = !ready || st.shown >= list.length;
  }
  $("k-cont").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    st.cont = b.dataset.c; st.shown = 48; st.fam = ""; st.gen = ""; render();
  });
  $("k-hab").addEventListener("click", (e) => {
    const b = e.target.closest(".hab"); if (!b) return;
    st.hab = b.dataset.h; st.shown = 48; st.fam = ""; st.gen = ""; st.focus = null; render();
    $("k-res-wrap").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("k-fam").addEventListener("change", (e) => { st.fam = e.target.value; st.gen = ""; st.shown = 48; render(); });
  $("k-gen").addEventListener("change", (e) => { st.gen = e.target.value; st.shown = 48; render(); });
  $("k-more").addEventListener("click", () => { st.shown += 48; render(); });
  $("k-res").addEventListener("click", (e) => { const c = e.target.closest("[data-k]"); if (c) detail(c.dataset.k); });
  $("k-res").addEventListener("keydown", (e) => { const c = e.target.closest("[data-k]"); if (c && e.key === "Enter") detail(c.dataset.k); });

  window.MANTODEA_KEY = {
    fromSpecies(k) {
      const s = BYKEY.get(String(k)); if (!s) return;
      st.focus = s; st.cont = s.c[0] || ""; st.hab = "egal"; st.fam = s.f; st.gen = ""; st.shown = 48;
      if (location.hash !== "#bestimmen") location.hash = "bestimmen";
      render();
      setTimeout(() => $("k-res-wrap").scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    },
  };
  render();

  // Liste aller Fachartikel mit Bestimmungsschlüssel (aus Plazi/ChecklistBank)
  loadScript("data/schluessel.js").then(() => {
    const K = window.MANTODEA_KEYLIT || { papers: [], g: {} };
    const gOf = {}; Object.entries(K.g).forEach(([g, ix]) => ix.forEach((i) => (gOf[i] = gOf[i] || []).push(g)));
    const list = K.papers.map((p, i) => [i, p]).filter(([, p]) => p.k > 0).sort((a, b) => b[1].k - a[1].k || (b[1].y || 0) - (a[1].y || 0));
    const nKey = list.filter(([, p]) => p.k === 2).length;
    const item = ([i, p]) => paperHtml(p, (gOf[i] || []).length ? `Gattungen: ${(gOf[i] || []).slice(0, 12).map((g) => `<i>${esc(g)}</i>`).join(", ")}${(gOf[i] || []).length > 12 ? " …" : ""}` : "");
    $("k-lit").innerHTML = `<h3>📖 Fachliteratur mit Bestimmungsschlüssel</h3>
      <p class="muted">Jeder Steckbrief zeigt unter „Bestimmungsschlüssel“ die passenden Artikel zur Gattung. Hier stehen alle ${fmt.format(list.length)} Artikel: ${fmt.format(nKey)} mit ausdrücklich genanntem Schlüssel, dazu Revisionen, die meist einen Schlüssel enthalten. Quelle: von Plazi digitalisierte Fachartikel in ChecklistBank (Stand ${esc(K.stand || "")}). Ältere, nur gedruckte Werke fehlen hier.</p>
      <input type="search" id="k-lit-q" placeholder="Gattung oder Stichwort filtern …" autocomplete="off">
      <ul class="lit keylit" id="k-lit-list">${list.slice(0, 8).map(item).join("")}</ul>
      ${list.length > 8 ? `<p class="more-wrap"><button type="button" id="k-lit-more">Alle ${fmt.format(list.length)} anzeigen</button></p>` : ""}`;
    const draw = (q, all) => {
      q = q.toLowerCase();
      const f = list.filter(([i, p]) => !q || (p.t + " " + p.c + " " + (gOf[i] || []).join(" ")).toLowerCase().includes(q));
      $("k-lit-list").innerHTML = (all || q ? f : f.slice(0, 8)).map(item).join("") || `<li class="muted">Kein Artikel passt.</li>`;
    };
    $("k-lit-q").addEventListener("input", (e) => draw(e.target.value, true));
    const mb = $("k-lit-more"); if (mb) mb.addEventListener("click", () => { draw($("k-lit-q").value, true); mb.remove(); });
  }).catch(() => { $("k-lit").innerHTML = `<p class="muted">Bestimmungsliteratur konnte nicht geladen werden.</p>`; });
})();
