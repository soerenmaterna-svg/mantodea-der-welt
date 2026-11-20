// Mitmach-Funktionen: Suchaufträge, Quellenvorschläge, eigene Funde (gespeichert über claude.ai)
(async () => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const { esc, fmtDate } = window.MANTODEA_UI || { esc: (s) => String(s), fmtDate: (d) => d };
  const safeUrl = (u) => { try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : null; } catch (e) { return null; } };
  const when = (iso) => { try { return new Date(iso).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return iso; } };
  const STATUS_TXT = { offen: "offen", laeuft: "läuft gerade", erledigt: "erledigt", eingebunden: "eingebunden", abgelehnt: "nicht möglich", geprueft: "geprüft", bestimmt: "bestimmt", unbestimmt: "unbestimmt" };
  const badge = (s) => `<span class="tag st-${esc(s || "offen")}">${esc(STATUS_TXT[s] || s || "offen")}</span>`;

  const OFFLINE = `<p class="note small">Zum Mitmachen die Seite auf claude.ai öffnen und anmelden. Speichern können die Besitzerin oder der Besitzer der Seite und eingeladene Personen mit Bearbeitungsrecht.</p>`;
  const use = (n) => (window.claude && window.claude.use ? window.claude.use(n).catch(() => null) : Promise.resolve(null));
  const [db, user, assets] = await Promise.all([use("db"), use("user"), use("assets")]);

  let canWrite = null;
  try { if (user && user.can) canWrite = await user.can("data.write"); } catch (e) { canWrite = null; }
  const readOnly = () => canWrite === false;

  // Sofort per Hand starten: Anleitung und Satz zum Kopieren (funktioniert überall, auch auf der GitHub-Seite)
  $("search-now").addEventListener("click", () => { const h = $("search-hand"); h.hidden = !h.hidden; $("search-now").setAttribute("aria-expanded", String(!h.hidden)); });
  $("search-copy").addEventListener("click", async () => {
    const t = $("search-cmd").textContent;
    try { await navigator.clipboard.writeText(t); $("search-copy").textContent = "✓ Kopiert"; }
    catch (e) { const r = document.createRange(); r.selectNodeContents($("search-cmd")); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); $("search-copy").textContent = "markiert – jetzt kopieren"; }
    setTimeout(() => ($("search-copy").textContent = "📋 Kopieren"), 2500);
  });
  if (!db) {
    $("search-msg").innerHTML = window.MANTODEA_STANDALONE
      ? `<p class="note small">Suchaufträge für die Nacht lassen sich nur auf der <a href="https://claude.ai/artifact/RKGNiBi8KevB2sjg3HsSF6#mitmachen" target="_blank" rel="noopener">Seite bei claude.ai</a> speichern. Sofort starten geht über „Sofort per Hand starten“.</p>`
      : OFFLINE;
    $("search-btn").disabled = true;
    $("src-form").insertAdjacentHTML("beforebegin", OFFLINE);
    $("src-form").querySelector("button").disabled = true;
    $("funde-form-wrap").innerHTML = OFFLINE;
    return;
  }
  const failMsg = (e) => e && e.code === "invalid_argument" ? "Keine Berechtigung zum Speichern (nur Lesen)." :
    e && e.code === "quota_exceeded" ? "Speicher voll. Bitte alte Einträge löschen." : "Speichern fehlgeschlagen, bitte später erneut versuchen.";
  const loading = (el, unsub) => setTimeout(() => { if (!el.dataset.loaded) el.innerHTML = `<li class="muted">Daten noch nicht erreichbar …</li>`; }, 10000);

  // ---------------- Suchaufträge
  let openJob = false;
  const sl = $("search-list");
  const t1 = loading(sl);
  db.collection("suchauftraege").orderBy("zeit", "desc").limit(10).onSnapshot((snap) => {
    clearTimeout(t1); sl.dataset.loaded = 1;
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    openJob = docs.some((d) => d.status === "offen" || d.status === "laeuft");
    $("search-btn").disabled = openJob || readOnly();
    if (openJob) $("search-msg").textContent = "Ein Suchauftrag liegt vor und wird heute Nacht um 2:47 Uhr ausgeführt. Sofort geht es über „Sofort per Hand starten“.";
    sl.innerHTML = docs.map((d) => `<li>${badge(d.status)} Auftrag vom ${esc(when(d.zeit))}${d.ergebnis ? ` – ${esc(d.ergebnis)}` : ""}</li>`).join("") ||
      `<li class="muted">Noch keine Aufträge.</li>`;
  }, () => { clearTimeout(t1); sl.innerHTML = `<li class="muted">Aufträge konnten nicht geladen werden.</li>`; });
  if (readOnly()) { $("search-btn").disabled = true; $("search-msg").textContent = "Nur Lesen: Suchaufträge können die Besitzerin oder der Besitzer der Seite und eingeladene Editoren starten."; }
  $("search-btn").addEventListener("click", async () => {
    if (openJob) return;
    $("search-btn").disabled = true;
    try {
      await db.collection("suchauftraege").add({ zeit: new Date().toISOString(), status: "offen" });
      $("search-msg").textContent = "Suchauftrag gespeichert. Er wird heute Nacht um 2:47 Uhr ausgeführt. Sofort geht es über „Sofort per Hand starten“.";
    } catch (e) { $("search-msg").textContent = failMsg(e); $("search-btn").disabled = false; }
  });

  // ---------------- Quellen
  const ql = $("src-list");
  const t2 = loading(ql);
  db.collection("quellen").orderBy("zeit", "desc").limit(200).onSnapshot((snap) => {
    clearTimeout(t2); ql.dataset.loaded = 1;
    ql.innerHTML = snap.docs.map((d) => {
      const q = d.data(), u = safeUrl(q.url);
      return `<li>${badge(q.status)} ${u ? `<a href="${esc(u)}" target="_blank" rel="noopener nofollow">${esc(u.length > 70 ? u.slice(0, 68) + "…" : u)}</a>` : esc(q.url)}
        ${q.text ? `<div class="muted">${esc(q.text)}</div>` : ""}${q.antwort ? `<div class="answer">Claude: ${esc(q.antwort)}</div>` : ""}</li>`;
    }).join("") || `<li class="muted">Noch keine Vorschläge.</li>`;
  }, () => { clearTimeout(t2); ql.innerHTML = `<li class="muted">Vorschläge konnten nicht geladen werden.</li>`; });
  if (readOnly()) $("src-form").querySelector("button").disabled = true;
  $("src-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, u = safeUrl(f.url.value.trim());
    if (!u) { $("src-msg").textContent = "Bitte einen gültigen Link mit http:// oder https:// angeben."; return; }
    f.querySelector("button").disabled = true;
    try {
      await db.collection("quellen").add({ url: u, text: f.text.value.trim().slice(0, 1000), zeit: new Date().toISOString(), status: "offen" });
      f.reset(); $("src-msg").textContent = "Danke! Die Quelle wird beim nächsten Suchlauf geprüft.";
    } catch (err) { $("src-msg").textContent = failMsg(err); }
    f.querySelector("button").disabled = false;
  });

  // ---------------- Eigene Funde
  $("funde-form-wrap").innerHTML = readOnly() ? `<p class="muted">Nur Lesen: Funde eintragen können die Besitzerin oder der Besitzer der Seite und eingeladene Editoren.</p>` : `
    <details class="panel"><summary><strong>+ Fund oder Hinweis eintragen</strong></summary>
    <form id="fund-form" class="form">
      ${assets ? `<label>Foto (optional, nur eigene Fotos)<input name="bild" type="file" accept="image/*"></label>` : `<p class="muted small">Foto-Upload steht nur Editoren zur Verfügung. Du kannst aber einen Link angeben.</p>`}
      <label>Link zum Beitrag (optional, z. B. Facebook, Instagram, TikTok, Forum)<input name="link" type="url" placeholder="https://…"></label>
      <div class="grid2">
        <label>Fundort<input name="ort" placeholder="Land, Region"></label>
        <label>Datum<input name="datum" type="date"></label>
      </div>
      <label>Vermutung / Beschreibung<textarea name="text" rows="2" placeholder="z. B. „vermutlich Hymenopodidae, 4 cm, grün“"></textarea></label>
      ${assets ? `<label class="check"><input name="rechte" type="checkbox"> Das Foto ist von mir oder ich habe die Erlaubnis. Es darf hier mit Namensnennung gezeigt werden.</label>
      <label>Name für die Namensnennung<input name="urheber" placeholder="dein Name oder Kürzel"></label>` : ""}
      <button type="submit" class="primary">Eintragen</button>
      <p class="msg" id="fund-msg" aria-live="polite"></p>
    </form></details>`;
  const ff = $("fund-form");
  if (ff) ff.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $("fund-msg"), file = ff.bild && ff.bild.files[0], link = ff.link.value.trim();
    if (!file && !link) { msg.textContent = "Bitte ein Foto oder einen Link angeben."; return; }
    if (link && !safeUrl(link)) { msg.textContent = "Der Link ist ungültig."; return; }
    if (file && !ff.rechte.checked) { msg.textContent = "Bitte bestätige, dass du die Rechte am Foto hast. Für fremde Fotos bitte nur den Link angeben."; return; }
    ff.querySelector("button").disabled = true; msg.textContent = "Speichere …";
    try {
      let bild = null;
      if (file) {
        if (file.size > 15 * 1024 * 1024) throw { code: "zu_gross" };
        bild = (await assets.upload(file)).id;
      }
      await db.collection("funde").add({
        zeit: new Date().toISOString(), bild, link: link ? safeUrl(link) : null,
        ort: ff.ort.value.trim().slice(0, 200), datum: ff.datum.value || null, text: ff.text.value.trim().slice(0, 1000),
        urheber: ff.urheber ? ff.urheber.value.trim().slice(0, 100) : "", status: "unbestimmt", bestimmung: "",
      });
      ff.reset(); msg.textContent = "Eingetragen, danke!";
    } catch (err) { msg.textContent = err && err.code === "zu_gross" ? "Das Foto ist zu groß (max. 15 MB)." : failMsg(err); }
    ff.querySelector("button").disabled = false;
  });

  const fl = $("funde");
  db.collection("funde").orderBy("zeit", "desc").limit(300).onSnapshot((snap) => {
    fl.innerHTML = snap.docs.map((d) => {
      const f = d.data(), link = safeUrl(f.link || "");
      let host = ""; try { host = link ? new URL(link).hostname.replace(/^www\./, "") : ""; } catch (e) { /* egal */ }
      return `<article class="card fund">
        <div class="img">${f.bild ? `<img src="/_blob/${encodeURIComponent(f.bild)}" alt="Fund" loading="lazy">` :
          `<div class="ph"><span>Kein Foto hier gespeichert</span>${link ? `<a href="${esc(link)}" target="_blank" rel="noopener nofollow">Beitrag ansehen auf ${esc(host)} ↗</a>` : ""}</div>`}</div>
        ${f.bild && f.urheber ? `<p class="credit">Foto: ${esc(f.urheber)} (hochgeladen mit Erlaubnis)</p>` : ""}
        <div class="body">
          <h3>${f.bestimmung ? `<i>${esc(f.bestimmung)}</i>` : "Unbestimmt"} ${badge(f.status)}</h3>
          <p class="tax">${esc(f.ort || "Ort unbekannt")}${f.datum ? " · " + esc(fmtDate(f.datum)) : ""}</p>
          ${f.text ? `<p class="common">${esc(f.text)}</p>` : ""}
          ${link && f.bild ? `<p><a href="${esc(link)}" target="_blank" rel="noopener nofollow">Quelle: ${esc(host)} ↗</a></p>` : ""}
          <div class="as-box" data-src="fund" data-id="${esc(d.id)}"></div>
          ${!readOnly() ? `<form class="bestimm" data-id="${esc(d.id)}"><input name="b" placeholder="oder frei eintragen (z. B. unbeschriebene Art)" value="${esc(f.bestimmung || "")}"><button>OK</button></form>` : ""}
        </div></article>`;
    }).join("") || `<p class="muted">Noch keine eigenen Funde eingetragen.</p>`;
  }, () => { fl.innerHTML = `<p class="muted">Funde konnten nicht geladen werden.</p>`; });
  fl.addEventListener("submit", async (e) => {
    const f = e.target.closest("form.bestimm");
    if (!f) return;
    e.preventDefault();
    const b = f.b.value.trim().slice(0, 120);
    try { await db.collection("funde").doc(f.dataset.id).update({ bestimmung: b, status: b ? "bestimmt" : "unbestimmt" }); }
    catch (err) { f.insertAdjacentHTML("afterend", `<p class="msg">${esc(failMsg(err))}</p>`); }
  });
})();
