// Vereinfachter Bestimmungsschlüssel: Fundort -> Körperform -> Bildvergleich passender Arten
(() => {
  "use strict";
  const UI = window.MANTODEA_UI;
  if (!UI) return;
  const { loadScript, paperHtml, esc, fmt, DATA, BYKEY, CONT, CONT_ORDER, imgTag, lazy, detail, PLACEHOLDER } = UI;
  const $ = (id) => document.getElementById(id);

  // ---------- Merkmale zum Anklicken (Zuordnung über Familien und Gattungen, vereinfacht)
  // Antippen: 1× = trifft zu (grün), 2× = trifft nicht zu (rot, schließt aus), 3× = egal.
  // In Gruppen mit "oder" genügt eines der grünen Merkmale (z. B. Rinde ODER Flechte).
  const G = (f, g) => ({ f: f || [], g: g || [] });
  const CRIT = [
    { grp: "Wo sitzt sie?", or: true, items: [
      { id: "blatt", icon: "🌿", t: "Blätter, Büsche", ...G(["Mantidae", "Miomantidae", "Galinthiadidae", "Nanomantidae", "Photinaidae", "Hymenopodidae", "Dactylopterygidae", "Iridopterygidae"]) },
      { id: "gras", icon: "🌾", t: "Gras, Halme", ...G(["Hoplocoryphidae", "Toxoderidae", "Thespidae", "Angelidae", "Coptopterygidae"], ["Pyrgomantis", "Tenodera", "Schizocephala", "Oxyothespis", "Heterochaeta", "Brunneria", "Thesprotia"]) },
      { id: "rinde", icon: "🌳", t: "Rinde, Stamm", ...G(["Liturgusidae", "Gonypetidae", "Amorphoscelidae", "Haaniidae", "Epaphroditidae", "Majangidae", "Chaeteessidae"], ["Tarachodes", "Popa", "Danuria", "Paraoxypilus", "Ciulfina", "Humbertiella", "Theopompa"]) },
      { id: "flechte", icon: "🪨", t: "Flechten, Moos", ...G(["Liturgusidae", "Haaniidae", "Epaphroditidae", "Majangidae"], ["Gonatista", "Liturgusa", "Haania", "Astape", "Ciulfina", "Corticomantis", "Pogonogaster", "Tarachodes"]) },
      { id: "bluete", icon: "🌸", t: "Blüten", ...G(["Hymenopodidae", "Galinthiadidae"], ["Pseudocreobotra", "Creobroter", "Hymenopus", "Chlidonoptera", "Theopropus", "Harpagomantis", "Pseudoharpax"]) },
      { id: "laub", icon: "🍂", t: "trockenes Laub", ...G(["Acanthopidae", "Deroplatyidae", "Mantoididae"], ["Phyllocrania", "Brancsikia", "Deroplatys", "Zoolea", "Choeradodis", "Parablepharis"]) },
      { id: "boden", icon: "🏜️", t: "Boden, Sand, Steine", ...G(["Eremiaphilidae", "Rivetinidae", "Amelidae", "Chroicopteridae"], ["Eremiaphila", "Ameles", "Geomantis", "Apteromantis", "Bolivaria", "Rivetina", "Ligaria"]) },
    ] },
    { grp: "Körperform", or: true, items: [
      { id: "normal", icon: "🦗", t: "typisch, schlank bis kräftig", ...G(["Empusidae", "Hymenopodidae", "Mantidae", "Miomantidae", "Hoplocoryphidae", "Galinthiadidae", "Dactylopterygidae", "Chroicopteridae", "Amelidae", "Rivetinidae", "Gonypetidae", "Nanomantidae", "Thespidae", "Photinaidae", "Coptopterygidae", "Epaphroditidae", "Leptomantellidae", "Majangidae", "Iridopterygidae", "Chaeteessidae", "Mantoididae"]) },
      { id: "stab", icon: "🥢", t: "extrem dünn wie ein Zweig", ...G(["Toxoderidae", "Angelidae"], ["Euchomenella", "Heterochaeta", "Schizocephala", "Brunneria", "Popa", "Danuria", "Kongobatha", "Ischnomantis", "Thesprotia", "Pyrgomantis", "Toxodera", "Paratoxodera", "Stenotoxodera"]) },
      { id: "blattform", icon: "🍃", t: "wie ein Blatt", ...G([], ["Acanthops", "Pseudacanthops", "Metilia", "Deroplatys", "Brancsikia", "Phyllocrania", "Zoolea", "Choeradodis", "Parablepharis", "Asiadodis", "Rhombodera"]) },
      { id: "flach", icon: "🟫", t: "flach, an Rinde angepasst", ...G(["Liturgusidae", "Gonypetidae", "Amorphoscelidae", "Haaniidae", "Epaphroditidae", "Majangidae"], ["Tarachodes", "Humbertiella", "Theopompa", "Gonatista", "Liturgusa", "Ciulfina", "Corticomantis"]) },
      { id: "plump", icon: "🪲", t: "gedrungen, Bodenläufer", ...G(["Eremiaphilidae", "Rivetinidae"], ["Eremiaphila", "Ameles", "Geomantis", "Apteromantis", "Pseudoyersinia", "Bolivaria", "Rivetina"]) },
    ] },
    { grp: "Kopf", items: [
      { id: "horn", icon: "🦄", t: "Horn oder Fortsatz auf dem Kopf", ...G(["Empusidae"], ["Phyllocrania", "Phyllothelys", "Ceratocrania", "Ceratomantis", "Pseudempusa"]) },
      { id: "augen", icon: "👁️", t: "Augen spitz ausgezogen", ...G(["Toxoderidae"], ["Ceratomantis", "Oxyophthalma", "Euchomenella", "Heterochaeta", "Schizocephala", "Oxyothespis"]) },
      { id: "fuehler", icon: "🪶", t: "Fühler gekämmt (Männchen)", ...G(["Empusidae"], ["Phyllocrania", "Hymenopus"]) },
    ] },
    { grp: "Körper und Beine", items: [
      { id: "hals", icon: "🛡️", t: "Halsschild blattartig verbreitert", ...G([], ["Deroplatys", "Brancsikia", "Asiadodis", "Choeradodis", "Rhombodera", "Zoolea", "Parablepharis", "Phyllocrania", "Pseudempusa", "Gongylus", "Idolomantis", "Sibylla"]) },
      { id: "lappen", icon: "🦵", t: "Lappen an Beinen oder Hinterleib", ...G(["Empusidae"], ["Hymenopus", "Phyllocrania", "Parablepharis", "Brancsikia", "Toxodera", "Paratoxodera", "Stenotoxodera", "Phyllothelys", "Ceratocrania", "Pseudempusa", "Sibylla", "Deroplatys"]) },
      { id: "kurzfl", icon: "✂️", t: "Weibchen mit kurzen oder ohne Flügel", ...G(["Eremiaphilidae", "Amelidae", "Rivetinidae", "Thespidae", "Leptomantellidae"], ["Ameles", "Geomantis", "Apteromantis", "Pseudoyersinia", "Bolivaria", "Ligaria", "Eremiaphila"]) },
    ] },
    { grp: "Farbe und Zeichnung", items: [
      { id: "augfleck", icon: "🎯", t: "Augenflecken (Flügel oder Vorderhüften)", ...G([], ["Pseudocreobotra", "Creobroter", "Theopropus", "Chlidonoptera", "Harpagomantis", "Pseudoharpax", "Stagmatoptera", "Mantis", "Galinthias", "Hestiasula"]) },
      { id: "bunt", icon: "🌺", t: "weiß, rosa oder bunt", ...G([], ["Hymenopus", "Pseudocreobotra", "Creobroter", "Chlidonoptera", "Theopropus", "Harpagomantis", "Pseudoharpax", "Odontomantis", "Galinthias"]) },
      { id: "metall", icon: "💎", t: "metallisch glänzend", ...G(["Metallyticidae"]) },
    ] },
    { grp: "Größe", or: true, items: [
      { id: "klein", icon: "🔍", t: "sehr klein (unter ca. 2 cm)", ...G(["Mantoididae", "Amorphoscelidae", "Haaniidae", "Leptomantellidae", "Nanomantidae"], ["Bolbe", "Acontista", "Ciulfina"]) },
      { id: "gross", icon: "📏", t: "groß (über ca. 8 cm)", ...G([], ["Archimantis", "Plistospilota", "Toxodera", "Paratoxodera", "Ischnomantis", "Heterochaeta", "Idolomantis", "Tenodera", "Hierodula", "Sphodromantis", "Stagmatoptera", "Polyspilota", "Macromantis", "Euchomenella", "Phasmomantis", "Rhombodera", "Deroplatys", "Prohierodula"]) },
    ] },
  ];
  const ITEMS = CRIT.flatMap((g) => g.items.map((it) => ({ ...it, grp: g, fs: new Set(it.f), gs: new Set(it.g) })));
  const hit = (it, s) => it.fs.has(s.f) || it.gs.has(s.g);

  const st = { conts: new Set(), land: "", sel: {}, fam: "", gen: "", shown: 48, focus: null };
  const root = $("v-bestimmen");
  root.innerHTML = `
    <div class="intro">
      <h2>Bestimmen</h2>
      <p>Klicke alles an, was du an deiner Mantis siehst: <b>1× = trifft zu</b> (grün), <b>2× = trifft nicht zu</b> (rot), <b>3× = egal</b>. Jedes Merkmal grenzt die Liste unten weiter ein; die Zahl am Merkmal zeigt, wie viele Arten dann übrig blieben. Das ist eine <strong>vereinfachte Hilfe</strong>: Die Merkmale sind Familien und Gattungen zugeordnet, einzelne Arten können abweichen. Sicher bestimmen lassen sich viele Arten nur mit Fachliteratur. Lade dein Foto zusätzlich auf <a href="https://www.inaturalist.org/observations/upload" target="_blank" rel="noopener">iNaturalist</a> hoch.</p>
    </div>
    <div class="panel kc">
      <div class="kc-grp"><h3>🌍 Wo wurde sie gefunden? <small>oder</small></h3>
        <div class="kc-items" id="k-cont"></div>
        <label class="kc-land">Land <select id="k-land"></select></label></div>
      ${CRIT.map((g, gi) => `<div class="kc-grp"><h3>${esc(g.grp)}${g.or ? " <small>oder</small>" : ""}</h3><div class="kc-items" data-g="${gi}">${g.items.map((it) => `<button type="button" class="kc" data-id="${it.id}" data-v="0"><span class="ico">${it.icon}</span><span class="t">${esc(it.t)}</span><span class="n"></span></button>`).join("")}</div></div>`).join("")}
    </div>
    <div class="kc-bar" id="k-bar"><span id="k-left"></span><button type="button" id="k-reset" class="link">alles zurücksetzen</button><button type="button" id="k-go" class="primary">ansehen ↓</button></div>
    <div class="panel step" id="k-res-wrap"><h3>Übrig gebliebene Arten</h3>
      <p class="muted" id="k-info"></p>
      <div class="row grid k-filters">
        <label>Familie<select id="k-fam"></select></label>
        <label>Gattung<select id="k-gen"></select></label>
      </div>
      <div class="cards" id="k-res"></div>
      <p class="more-wrap"><button type="button" id="k-more" hidden>Weitere anzeigen</button></p>
      <p class="muted">Nichts Passendes gefunden? Trag den Fund unter <a href="#unbestimmt">Unbestimmte Mantiden</a> ein oder lade ihn auf iNaturalist hoch.</p>
    </div>
    <div class="panel k-av"><h3>⚖️ Arten vergleichen</h3><p>Mehrere Arten nebeneinander: Körpermaße und Merkmale aus den Bestimmungsschlüsseln der Fachliteratur, Unterschiede farbig hervorgehoben, nach Unterschieden oder Gemeinsamkeiten sortierbar.</p><p><a class="primary k-av-go" href="artvergleich.html">Vergleich öffnen →</a></p></div>
    <div class="panel" id="k-lit"><h3>📖 Fachliteratur mit Bestimmungsschlüssel</h3><p class="muted">Lade …</p></div>`;

  const coll = new Intl.Collator("de");
  const LIVE = DATA.filter((s) => !s.x);
  // Filter ohne ein bestimmtes Merkmal (für die Zahlen an den Knöpfen)
  function pass(s, skip) {
    if (skip !== "cont" && st.conts.size && !s.c.some((c) => st.conts.has(c))) return false;
    if (skip !== "land" && st.land && !(s.ct || []).includes(st.land)) return false;
    for (const g of CRIT) {
      const its = ITEMS.filter((it) => it.grp === g && st.sel[it.id] && it.id !== skip);
      const yes = its.filter((it) => st.sel[it.id] === 1), no = its.filter((it) => st.sel[it.id] === 2);
      if (no.some((it) => hit(it, s))) return false;
      if (yes.length && (g.or ? !yes.some((it) => hit(it, s)) : !yes.every((it) => hit(it, s)))) return false;
    }
    return true;
  }
  function candidates() {
    return LIVE.filter((s) => pass(s) && (!st.fam || s.f === st.fam) && (!st.gen || s.g === st.gen));
  }
  function score(s) {
    let v = (s.p ? 1e7 : 0) + (s.io || 0) + (s.o || 0) / 10;
    if (st.focus) { if (s.k === st.focus.k) v += 1e10; else if (s.g === st.focus.g) v += 1e9; }
    return v;
  }
  const nSel = () => Object.values(st.sel).filter(Boolean).length + st.conts.size + (st.land ? 1 : 0);
  function render() {
    // Kontinente und Länder
    const baseC = LIVE.filter((s) => pass(s, "cont"));
    $("k-cont").innerHTML = CONT_ORDER.filter((c) => c !== "NONE").map((c) => { const n = baseC.filter((s) => s.c.includes(c)).length;
      return `<button type="button" class="kc" data-c="${c}" data-v="${st.conts.has(c) ? 1 : 0}"${n || st.conts.has(c) ? "" : " disabled"}><span class="t">${esc(CONT[c])}</span><span class="n">${fmt.format(n)}</span></button>`; }).join("");
    const baseL = LIVE.filter((s) => pass(s, "land")), lc = {};
    baseL.forEach((s) => (s.ct || []).forEach((c) => (lc[c] = (lc[c] || 0) + 1)));
    $("k-land").innerHTML = `<option value="">alle Länder</option>` + Object.keys(lc).sort((a, b) => coll.compare(UI.cname(a), UI.cname(b))).map((c) => `<option value="${c}">${esc(UI.cname(c))} (${lc[c]})</option>`).join("");
    $("k-land").value = st.land;
    // Merkmale: Zustand und Zahl der Arten, die bei "trifft zu" übrig blieben
    root.querySelectorAll(".kc[data-id]").forEach((b) => {
      const it = ITEMS.find((x) => x.id === b.dataset.id), v = st.sel[it.id] || 0;
      b.dataset.v = v;
      const base = LIVE.filter((s) => pass(s, it.id));
      const n = base.filter((s) => (v === 2 ? !hit(it, s) : hit(it, s))).length;
      b.querySelector(".n").textContent = v === 2 ? `ohne · ${fmt.format(n)}` : fmt.format(n);
      b.disabled = !n && !v;
      b.title = v === 1 ? "trifft zu – nochmal tippen: trifft nicht zu" : v === 2 ? "trifft nicht zu – nochmal tippen: egal" : "antippen: trifft zu";
    });
    // Familie/Gattung
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
    const ready = nSel() > 0 || st.focus;
    $("k-left").innerHTML = ready ? `<b>${fmt.format(list.length)}</b> ${list.length === 1 ? "Art passt" : "Arten passen"} <small>(${nSel()} ${nSel() === 1 ? "Merkmal" : "Merkmale"} gewählt)</small>` : `Noch nichts gewählt · ${fmt.format(LIVE.length)} Arten`;
    $("k-reset").hidden = !ready;
    $("k-info").innerHTML = !ready ? "Wähle oben Merkmale aus, dann bleiben hier die passenden Arten übrig." :
      (st.focus ? `Ähnliche Arten wie <i>${esc(st.focus.n)}</i>: gleiche Familie (${esc(st.focus.f)}). Arten derselben Gattung stehen vorn. ` : "") +
      `${fmt.format(list.length)} mögliche Arten, Arten mit Foto und häufig beobachtete zuerst. Antippen öffnet den Steckbrief mit Fotogalerie.`;
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
  const changed = () => { st.shown = 48; st.fam = ""; st.gen = ""; st.focus = null; render(); };
  root.addEventListener("click", (e) => {
    const b = e.target.closest(".kc"); if (!b || b.disabled && b.dataset.v === "0") return;
    if (b.dataset.c) { st.conts.has(b.dataset.c) ? st.conts.delete(b.dataset.c) : st.conts.add(b.dataset.c); changed(); return; }
    if (b.dataset.id) { st.sel[b.dataset.id] = ((st.sel[b.dataset.id] || 0) + 1) % 3; changed(); }
  });
  $("k-land").addEventListener("change", (e) => { st.land = e.target.value; changed(); });
  $("k-reset").addEventListener("click", () => { st.conts.clear(); st.land = ""; st.sel = {}; changed(); });
  $("k-go").addEventListener("click", () => $("k-res-wrap").scrollIntoView({ behavior: "smooth", block: "start" }));
  $("k-fam").addEventListener("change", (e) => { st.fam = e.target.value; st.gen = ""; st.shown = 48; render(); });
  $("k-gen").addEventListener("change", (e) => { st.gen = e.target.value; st.shown = 48; render(); });
  $("k-more").addEventListener("click", () => { st.shown += 48; render(); });
  $("k-res").addEventListener("click", (e) => { const c = e.target.closest("[data-k]"); if (c) detail(c.dataset.k); });
  $("k-res").addEventListener("keydown", (e) => { const c = e.target.closest("[data-k]"); if (c && e.key === "Enter") detail(c.dataset.k); });

  window.MANTODEA_KEY = {
    fromSpecies(k) {
      const s = BYKEY.get(String(k)); if (!s) return;
      st.focus = s; st.conts = new Set(s.c.slice(0, 1)); st.land = ""; st.sel = {}; st.fam = s.f; st.gen = ""; st.shown = 48;
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
