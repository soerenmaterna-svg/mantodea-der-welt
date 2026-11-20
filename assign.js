// Unbestimmte Mantiden einer Art zuordnen (Vorschläge werden über claude.ai gespeichert)
(async () => {
  "use strict";
  const UI = window.MANTODEA_UI;
  if (!UI) return;
  const { esc, fmt, DATA, BYKEY, imgTag, lazy, detail, PLACEHOLDER } = UI;
  const $ = (id) => document.getElementById(id);
  const coll = new Intl.Collator("de");
  const SICHER = { sicher: "sicher", wahrscheinlich: "wahrscheinlich", unsicher: "unsicher" };
  const W = { sicher: 3, wahrscheinlich: 2, unsicher: 1 };

  // Dialog einfügen
  document.body.insertAdjacentHTML("beforeend", `
  <dialog id="as-dlg" class="cdlg asdlg" aria-labelledby="as-title">
    <div class="cdlg-head"><h2 id="as-title">Art zuordnen</h2><button type="button" class="close" id="as-close" aria-label="Schließen">×</button></div>
    <div class="cdlg-tools">
      <div id="as-obj" class="as-obj"></div>
      <input type="search" id="as-q" placeholder="Art oder Gattung suchen, z. B. Ameles decolor …" autocomplete="off">
      <p class="muted small" id="as-hint"></p>
    </div>
    <div id="as-list" class="cdlg-list as-list"></div>
    <form id="as-form" class="as-form" hidden>
      <div id="as-sel" class="as-sel"></div>
      <div class="seg" id="as-sicher" role="group" aria-label="Sicherheit">
        <button type="button" data-s="sicher">sicher</button><button type="button" data-s="wahrscheinlich" aria-pressed="true">wahrscheinlich</button><button type="button" data-s="unsicher">unsicher</button></div>
      <input name="kommentar" placeholder="Begründung (optional), z. B. „Augenfleck an der Vorderhüfte“" maxlength="300">
      <div class="as-actions"><button type="button" id="as-back">Andere Art</button><button type="submit" class="primary">Zuordnung speichern</button></div>
      <p class="msg" id="as-msg" aria-live="polite"></p>
    </form>
  </dialog>`);

  const use = (n) => (window.claude && window.claude.use ? window.claude.use(n).catch(() => null) : Promise.resolve(null));
  const [db, user] = await Promise.all([use("db"), use("user")]);
  let canWrite = null;
  try { if (user && user.can) canWrite = await user.can("data.write"); } catch (e) { canWrite = null; }
  const writable = () => db && canWrite !== false;

  // Zuordnungen laden und gruppieren: "quelle:id" -> [{...}]
  let BY = new Map(), ALL = [];
  const keyOf = (src, id) => `${src}:${id}`;
  function summary(list) {
    const m = new Map();
    for (const z of list) {
      const e = m.get(z.art_key) || { art_key: z.art_key, art: z.art, n: 0, w: 0, kom: [] };
      e.n++; e.w += W[z.sicherheit] || 1; if (z.kommentar) e.kom.push(z.kommentar);
      m.set(z.art_key, e);
    }
    return [...m.values()].sort((a, b) => b.w - a.w || b.n - a.n);
  }
  function boxHtml(src, id) {
    const list = BY.get(keyOf(src, id)) || [];
    const sm = summary(list);
    let h = "";
    if (sm.length) {
      const top = sm[0], agreed = sm.length === 1 || top.w >= 2 * (sm[1] ? sm[1].w : 0);
      h += `<p class="as-res">${agreed ? "🏷️ Zugeordnet" : "🏷️ Vorschläge"}: ${sm.slice(0, 3).map((e) =>
        `<a href="#" data-open="${esc(e.art_key)}"><i>${esc(e.art)}</i></a> <small>(${e.n}×)</small>`).join(", ")}</p>`;
      const k = sm[0].kom.slice(-1)[0]; if (k) h += `<p class="muted small">„${esc(k)}“</p>`;
    }
    h += writable() ? `<button type="button" class="as-btn" data-as-src="${esc(src)}" data-as-id="${esc(id)}">${sm.length ? "➕ Andere Art vorschlagen" : "🏷️ Art zuordnen"}</button>` :
      (!sm.length ? `<p class="muted small">${db ? "Zuordnen können Besitzer und eingeladene Editoren." : "Zum Zuordnen die Seite auf claude.ai öffnen."}</p>` : "");
    return h;
  }
  function decorate(root = document) {
    root.querySelectorAll(".as-box").forEach((b) => { b.innerHTML = boxHtml(b.dataset.src, b.dataset.id); });
    applyFilter();
  }
  if (db) {
    db.collection("zuordnungen").orderBy("zeit", "desc").limit(3000).onSnapshot((snap) => {
      ALL = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      BY = new Map();
      for (const z of ALL) { const k = keyOf(z.quelle, z.objekt_id); if (!BY.has(k)) BY.set(k, []); BY.get(k).push(z); }
      decorate();
      if (currentDetail) fillDetail(currentDetail);
    }, () => {});
  }
  // Karten werden von app.js / community.js neu gezeichnet: dann erneut ausfüllen
  const mo = new MutationObserver((ms) => { if (ms.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1 && (n.matches(".as-box") || n.querySelector(".as-box"))))) decorate(); });
  ["unknown", "funde"].forEach((id) => $(id) && mo.observe($(id), { childList: true, subtree: true }));

  // Filter "alle / ohne Zuordnung / zugeordnet" für die iNaturalist-Liste
  let filt = "alle";
  const sw = document.createElement("div");
  sw.className = "count";
  sw.innerHTML = `<span class="seg" id="as-filter" role="group" aria-label="Zuordnung"><button type="button" data-f="alle" aria-pressed="true">alle</button><button type="button" data-f="offen">ohne Zuordnung</button><button type="button" data-f="ja">zugeordnet</button></span>`;
  $("unknown").before(sw);
  function applyFilter() {
    document.querySelectorAll("#unknown .card").forEach((c) => {
      const b = c.querySelector(".as-box"); if (!b) return;
      const has = BY.has(keyOf(b.dataset.src, b.dataset.id));
      c.style.display = (filt === "offen" ? has : filt === "ja" ? !has : false) ? "none" : "";
    });
  }
  $("as-filter").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-f]"); if (!b) return;
    filt = b.dataset.f;
    $("as-filter").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    applyFilter();
  });

  // ---------- Dialog
  let obj = null, sel = null, sicher = "wahrscheinlich";
  const U = () => window.MANTODEA_UNBESTIMMT || [];
  function candidates(q) {
    q = q.trim().toLowerCase();
    let list = DATA.filter((s) => !s.x);
    if (q) list = list.filter((s) => s.hay.includes(q));
    else if (obj && obj.r && obj.t) {
      const t = obj.t;
      const f = { genus: (s) => s.g === t, family: (s) => s.f === t, subfamily: (s) => s.sf === t }[obj.r];
      if (f) list = list.filter(f);
    }
    return list.sort((a, b) => (b.p ? 1 : 0) - (a.p ? 1 : 0) || (b.io || 0) - (a.io || 0) || coll.compare(a.n, b.n)).slice(0, 60);
  }
  function drawList() {
    const q = $("as-q").value, list = candidates(q);
    $("as-hint").textContent = q ? `${list.length >= 60 ? "Die ersten 60" : list.length} Treffer` :
      (obj && obj.t && obj.r && obj.r !== "order" ? `Vorschläge aus ${obj.t} – oder oben suchen` : "Häufige Arten – oder oben suchen");
    $("as-list").innerHTML = list.map((s) => `<div class="as-item">
        <div class="as-th">${s.p ? imgTag(s, s.n) : PLACEHOLDER}</div>
        <div class="as-tx"><b><i>${esc(s.n)}</i></b><span class="muted small">${esc([s.de || s.en, s.f].filter(Boolean).join(" · "))}</span>
          <span class="as-ib"><button type="button" class="primary small" data-pick="${esc(s.k)}">Auswählen</button><button type="button" class="small" data-info="${esc(s.k)}">Steckbrief</button></span></div>
      </div>`).join("") || `<p class="muted">Keine Art gefunden.</p>`;
    lazy($("as-list"));
  }
  function open(src, id) {
    obj = src === "inat" ? (U().find((o) => String(o.id) === String(id)) || { id }) : { id, t: "", r: "" };
    obj.src = src; sel = null;
    let img = "";
    const card = document.querySelector(`.as-box[data-src="${CSS.escape(src)}"][data-id="${CSS.escape(String(id))}"]`);
    const ci = card && card.closest(".card") && card.closest(".card").querySelector(".img img");
    if (ci && ci.src) img = `<img src="${ci.src}" alt="">`;
    const desc = src === "inat" ? `iNaturalist-Beobachtung · bisher: ${esc(obj.t || "Mantodea")}${obj.pl ? " · " + esc(obj.pl) : ""}` : "Eigener Fund";
    $("as-obj").innerHTML = `${img}<div><b>Welche Art ist das?</b><br><span class="muted small">${desc}</span>
      ${src === "inat" && obj.p ? `<br><a class="small" href="${esc(obj.p.ref)}" target="_blank" rel="noopener">Beobachtung ansehen ↗</a>` : ""}</div>`;
    $("as-q").value = ""; $("as-form").hidden = true; $("as-list").hidden = false; $("as-msg").textContent = "";
    drawList();
    const d = $("as-dlg"); if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }
  function pick(k) {
    sel = BYKEY.get(String(k)); if (!sel) return;
    $("as-sel").innerHTML = `Zuordnung: <b><i>${esc(sel.n)}</i></b> <span class="muted small">${esc(sel.f)}</span>`;
    $("as-list").hidden = true; $("as-form").hidden = false; $("as-msg").textContent = "";
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".as-btn"); if (b) { open(b.dataset.asSrc, b.dataset.asId); return; }
    const o = e.target.closest("a[data-open]"); if (o && !o.closest("#d-body")) { e.preventDefault(); detail(o.dataset.open); }
  });
  $("as-close").addEventListener("click", () => $("as-dlg").close());
  $("as-dlg").addEventListener("click", (e) => { if (e.target === $("as-dlg")) $("as-dlg").close(); });
  $("as-q").addEventListener("input", drawList);
  $("as-list").addEventListener("click", (e) => {
    const p = e.target.closest("[data-pick]"); if (p) return pick(p.dataset.pick);
    const i = e.target.closest("[data-info]"); if (i) detail(i.dataset.info);
  });
  $("as-back").addEventListener("click", () => { $("as-form").hidden = true; $("as-list").hidden = false; });
  $("as-sicher").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-s]"); if (!b) return;
    sicher = b.dataset.s; $("as-sicher").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  });
  $("as-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!sel || !obj || !db) return;
    const btn = $("as-form").querySelector("button[type=submit]"); btn.disabled = true; $("as-msg").textContent = "Speichere …";
    try {
      await db.collection("zuordnungen").add({
        quelle: obj.src, objekt_id: String(obj.id), art_key: String(sel.k), art: sel.n, sicherheit: sicher,
        kommentar: $("as-form").kommentar.value.trim().slice(0, 300), zeit: new Date().toISOString(),
        vorher: obj.t || "", ort: obj.pl || "", link: obj.p ? obj.p.ref : "",
      });
      if (obj.src === "fund") { try { await db.collection("funde").doc(String(obj.id)).update({ bestimmung: sel.n, status: "bestimmt" }); } catch (err) { /* nur Vorschlag */ } }
      $("as-form").reset();
      $("as-msg").innerHTML = obj.src === "inat" ? `Gespeichert. Tipp: Trag die Bestimmung auch auf <a href="${esc(obj.p ? obj.p.ref : "#")}" target="_blank" rel="noopener">iNaturalist</a> ein, dann zählt sie dort für die Forschung.` : "Gespeichert.";
      setTimeout(() => { if (obj.src !== "inat") $("as-dlg").close(); }, 900);
    } catch (err) {
      $("as-msg").textContent = err && err.code === "invalid_argument" ? "Keine Berechtigung zum Speichern (nur Lesen)." : "Speichern fehlgeschlagen, bitte später erneut versuchen.";
    }
    btn.disabled = false;
  });

  // ---------- Im Steckbrief: zugeordnete Funde dieser Art
  let currentDetail = null;
  function fillDetail(k) {
    const box = $("d-assigned"); if (!box) return;
    const list = ALL.filter((z) => z.art_key === String(k));
    if (!list.length) { box.innerHTML = ""; return; }
    const seen = new Set();
    box.innerHTML = `<h3 class="d-h">Zugeordnete unbestimmte Funde <small>${list.length}</small></h3><ul class="lit">${list.filter((z) => !seen.has(z.quelle + z.objekt_id) && seen.add(z.quelle + z.objekt_id)).map((z) =>
      `<li>${z.quelle === "inat" ? "iNaturalist-Beobachtung" : "Eigener Fund"}${z.ort ? " · " + esc(z.ort) : ""} · ${esc(SICHER[z.sicherheit] || "")}
        ${z.link ? ` · <a href="${esc(z.link)}" target="_blank" rel="noopener">ansehen ↗</a>` : ""}${z.kommentar ? `<div class="muted small">„${esc(z.kommentar)}“</div>` : ""}</li>`).join("")}</ul>`;
  }
  document.addEventListener("mantodea:detail", (e) => { currentDetail = e.detail; fillDetail(e.detail); });

  decorate();
  window.MANTODEA_ASSIGN = { decorate };
})();
