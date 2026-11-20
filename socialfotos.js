// Fotos aus sozialen Medien – nur mit Erlaubnis: Anfragetext erzeugen, Anfragen verwalten,
// zugesagte Fotos hochladen und im Steckbrief zeigen. Dazu ein Einladungstext für iNaturalist.
(async () => {
  "use strict";
  const UI = window.MANTODEA_UI;
  if (!UI) return;
  const { esc, DATA, BYKEY, detail } = UI;
  const $ = (id) => document.getElementById(id);
  const safeUrl = (u) => { try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : null; } catch (e) { return null; } };
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
  const PAGE = "https://claude.ai/artifact/RKGNiBi8KevB2sjg3HsSF6";

  const sec = $("v-mitmachen");
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.id = "sm-panel";
  panel.innerHTML = `
    <h3>📸 Fotos aus Facebook, Instagram &amp; Co.</h3>
    <p class="muted">Fotos aus sozialen Netzwerken sind urheberrechtlich geschützt. Sie dürfen hier nur mit Erlaubnis der Fotografin oder des Fotografen erscheinen. So geht es: 1. Anfragetext erzeugen und per Nachricht oder als Kommentar schicken. 2. Bei Zusage das Foto hier hochladen. Es erscheint dann mit Namensnennung im Steckbrief der Art.</p>
    <form id="sm-form" class="form">
      <label>Link zum Beitrag<input name="link" type="url" placeholder="https://www.facebook.com/groups/…" required></label>
      <div class="grid2">
        <label>Art (falls bekannt)<input name="art" list="sm-arten" placeholder="z. B. Hymenopus coronatus" autocomplete="off"></label>
        <label>Name der Fotografin / des Fotografen<input name="wer" placeholder="Name oder Profilname"></label>
      </div>
      <datalist id="sm-arten"></datalist>
      <div class="sm-btns">
        <button type="button" class="primary" data-lang="de">Anfrage auf Deutsch kopieren</button>
        <button type="button" data-lang="en">… auf Englisch kopieren</button>
        <button type="submit">Anfrage merken</button>
      </div>
      <textarea id="sm-text" rows="7" readonly hidden></textarea>
      <p class="msg" id="sm-msg" aria-live="polite"></p>
    </form>
    <h4>Gemerkte Anfragen</h4>
    <ul id="sm-list" class="plain"></ul>
    <details class="sm-invite"><summary><strong>Einladungstext für Gruppen: Fotos auf iNaturalist teilen</strong></summary>
      <p class="muted small">Wer seine Fotos auf iNaturalist hochlädt und eine freie Lizenz wählt, landet beim nächsten Suchlauf automatisch auf dieser Seite, mit Namensnennung. Diesen Text kannst du in Mantis-Gruppen posten.</p>
      <textarea id="sm-invite-text" rows="9" readonly></textarea>
      <div class="sm-btns"><button type="button" class="primary" id="sm-invite-de">Deutsch kopieren</button><button type="button" id="sm-invite-en">Englisch kopieren</button></div>
    </details>`;
  const anchor = sec.querySelectorAll(".panel")[2];
  anchor ? sec.insertBefore(panel, anchor) : sec.appendChild(panel);
  $("sm-arten").innerHTML = DATA.filter((s) => !s.x).map((s) => `<option value="${esc(s.n)}">`).join("");

  const TXT = {
    de: (f) => `Hallo${f.wer ? " " + f.wer : ""},\n\ndein Foto${f.art ? ` von ${f.art}` : " der Gottesanbeterin"} ist wunderschön! Ich betreibe die nicht-kommerzielle Übersichtsseite „Mantodea der Welt“ mit allen Gottesanbeterinnen-Arten der Welt: ${PAGE}\n\nDürfte ich dein Foto dort im Steckbrief der Art zeigen? Es erscheint natürlich mit deinem Namen und einem Link zu deinem Beitrag. Du kannst die Erlaubnis jederzeit zurückziehen, dann nehme ich es sofort herunter.\n\nVielen Dank und viele Grüße`,
    en: (f) => `Hi${f.wer ? " " + f.wer : ""},\n\nyour photo${f.art ? ` of ${f.art}` : " of the praying mantis"} is beautiful! I run the non-commercial website "Mantodea der Welt" (Mantodea of the World), listing all praying mantis species: ${PAGE}\n\nWould you allow me to show your photo on the species page? It will of course be credited with your name and a link to your post. You can withdraw permission at any time and I will remove it immediately.\n\nThank you very much and best regards`,
  };
  const INV = {
    de: `📸 Eure Mantis-Fotos für die Wissenschaft und für „Mantodea der Welt“\n\nIhr habt tolle Fotos von Gottesanbeterinnen? Ladet sie auf iNaturalist hoch (www.inaturalist.org, kostenlos). Dort helfen Fachleute bei der Bestimmung, und eure Funde fließen in die Forschung ein.\n\nTipp: Wählt in den Einstellungen unter „Lizenzen“ für Fotos „CC BY-NC“. Dann erscheinen eure Fotos automatisch mit eurem Namen auf ${PAGE}, einer Übersicht aller Mantis-Arten der Welt. Bitte nur Fotos von Tieren in freier Natur oder als „in Gefangenschaft“ markieren.`,
    en: `📸 Share your mantis photos with science and with "Mantodea der Welt"\n\nGot great praying mantis photos? Upload them to iNaturalist (www.inaturalist.org, free). Experts help identify them and your records contribute to research.\n\nTip: in your account settings under "Licensing", choose "CC BY-NC" for photos. Your photos will then automatically appear, credited with your name, on ${PAGE}, an overview of all mantis species of the world. Please mark animals kept in captivity as "captive".`,
  };
  $("sm-invite-text").value = INV.de;
  async function copy(text, msgEl) {
    try { await navigator.clipboard.writeText(text); msgEl.textContent = "Text kopiert. Jetzt in die Nachricht einfügen."; }
    catch (e) { msgEl.textContent = "Kopieren nicht möglich. Text unten markieren und kopieren."; }
  }
  const formVals = () => { const f = $("sm-form"); return { link: f.link.value.trim(), art: f.art.value.trim(), wer: f.wer.value.trim() }; };
  $("sm-form").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-lang]"); if (!b) return;
    const t = TXT[b.dataset.lang](formVals());
    $("sm-text").hidden = false; $("sm-text").value = t; copy(t, $("sm-msg"));
  });
  $("sm-invite-de").addEventListener("click", () => { $("sm-invite-text").value = INV.de; copy(INV.de, $("sm-msg")); });
  $("sm-invite-en").addEventListener("click", () => { $("sm-invite-text").value = INV.en; copy(INV.en, $("sm-msg")); });

  // ---------- Speicher (claude.ai)
  const use = (n) => (window.claude && window.claude.use ? window.claude.use(n).catch(() => null) : Promise.resolve(null));
  const [db, user, assets] = await Promise.all([use("db"), use("user"), use("assets")]);
  let canWrite = null;
  try { if (user && user.can) canWrite = await user.can("data.write"); } catch (e) { canWrite = null; }
  const writable = db && canWrite !== false;
  if (!writable) {
    $("sm-form").querySelector('button[type="submit"]').disabled = true;
    $("sm-list").innerHTML = `<li class="muted">${db ? "Anfragen speichern und Fotos hochladen können Besitzer und eingeladene Editoren." : "Zum Speichern die Seite auf claude.ai öffnen."} Die Anfragetexte kannst du trotzdem kopieren.</li>`;
  }
  const fail = (e) => e && e.code === "invalid_argument" ? "Keine Berechtigung zum Speichern." : "Speichern fehlgeschlagen, bitte später erneut versuchen.";
  const STAT = { angefragt: "angefragt", zugesagt: "zugesagt", abgelehnt: "abgelehnt", eingebunden: "Foto eingebunden" };

  $("sm-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!writable) return;
    const v = formVals(), u = safeUrl(v.link);
    if (!u) { $("sm-msg").textContent = "Bitte einen gültigen Link angeben."; return; }
    const sp = DATA.find((s) => s.n.toLowerCase() === v.art.toLowerCase());
    try {
      await db.collection("fotoanfragen").add({ link: u, art: sp ? sp.n : v.art.slice(0, 120), art_key: sp ? String(sp.k) : "", wer: v.wer.slice(0, 100), status: "angefragt", zeit: new Date().toISOString() });
      $("sm-form").reset(); $("sm-text").hidden = true; $("sm-msg").textContent = "Anfrage gemerkt.";
    } catch (err) { $("sm-msg").textContent = fail(err); }
  });

  let FOTOS = [];
  if (db) {
    db.collection("fotoanfragen").orderBy("zeit", "desc").limit(300).onSnapshot((snap) => {
      if (!writable) return;
      $("sm-list").innerHTML = snap.docs.map((d) => {
        const a = d.data(), u = safeUrl(a.link);
        return `<li class="sm-item" data-id="${esc(d.id)}">
          <span class="tag st-${esc(a.status)}">${esc(STAT[a.status] || a.status)}</span>
          ${a.art ? `<i>${esc(a.art)}</i> · ` : ""}${esc(a.wer || "unbekannt")} · ${u ? `<a href="${esc(u)}" target="_blank" rel="noopener nofollow">${esc(host(u))} ↗</a>` : ""}
          ${a.status === "angefragt" ? `<div class="sm-act"><button type="button" data-st="zugesagt">✓ Zusage erhalten</button><button type="button" data-st="abgelehnt">✗ Absage</button></div>` : ""}
          ${a.status === "zugesagt" ? (assets ? `<form class="sm-up form"><label>Foto (vom Fotografen erhalten)<input name="bild" type="file" accept="image/*" required></label>
              <label>Art<input name="art" list="sm-arten" value="${esc(a.art || "")}" required></label>
              <label>Namensnennung<input name="wer" value="${esc(a.wer || "")}" required></label>
              <label class="check"><input name="ok" type="checkbox" required> Die Fotografin / der Fotograf hat der Veröffentlichung hier zugestimmt.</label>
              <button class="primary">Foto einbinden</button><p class="msg"></p></form>` : `<p class="muted small">Foto-Upload steht nur Editoren zur Verfügung.</p>`) : ""}
        </li>`;
      }).join("") || `<li class="muted">Noch keine Anfragen gemerkt.</li>`;
    }, () => {});
    db.collection("fotos").orderBy("zeit", "desc").limit(1000).onSnapshot((snap) => {
      FOTOS = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (cur) showInDetail(cur);
    }, () => {});
  }
  $("sm-list").addEventListener("click", async (e) => {
    const b = e.target.closest("button[data-st]"); if (!b) return;
    const id = b.closest("[data-id]").dataset.id;
    try { await db.collection("fotoanfragen").doc(id).update({ status: b.dataset.st }); } catch (err) { b.insertAdjacentHTML("afterend", `<span class="msg">${esc(fail(err))}</span>`); }
  });
  $("sm-list").addEventListener("submit", async (e) => {
    const f = e.target.closest("form.sm-up"); if (!f) return;
    e.preventDefault();
    const id = f.closest("[data-id]").dataset.id, msg = f.querySelector(".msg");
    const sp = DATA.find((s) => s.n.toLowerCase() === f.art.value.trim().toLowerCase());
    if (!sp) { msg.textContent = "Bitte eine Art aus der Liste wählen."; return; }
    const file = f.bild.files[0];
    if (file.size > 15 * 1024 * 1024) { msg.textContent = "Das Foto ist zu groß (max. 15 MB)."; return; }
    f.querySelector("button").disabled = true; msg.textContent = "Lade hoch …";
    try {
      const up = await assets.upload(file);
      const li = f.closest("[data-id]"), link = li.querySelector("a") ? li.querySelector("a").href : "";
      await db.collection("fotos").add({ art_key: String(sp.k), art: sp.n, bild: up.id, urheber: f.wer.value.trim().slice(0, 100), link, erlaubnis: true, zeit: new Date().toISOString() });
      await db.collection("fotoanfragen").doc(id).update({ status: "eingebunden", art: sp.n, art_key: String(sp.k) });
    } catch (err) { msg.textContent = fail(err); f.querySelector("button").disabled = false; }
  });

  // ---------- Im Steckbrief: Fotos mit Erlaubnis
  let cur = null;
  function showInDetail(k) {
    const anchor = $("d-gal") || document.querySelector("#d-body h3.d-h");
    if (!anchor) return;
    let box = $("d-perm");
    const list = FOTOS.filter((f) => f.art_key === String(k));
    if (!list.length) { if (box) box.remove(); return; }
    if (!box) { box = document.createElement("div"); box.id = "d-perm"; anchor.after(box); }
    box.innerHTML = `<h4 class="perm-h">Fotos mit Erlaubnis der Fotografen <small>${list.length}</small></h4><div class="gallery perm">${list.map((f) =>
      `<a class="gthumb" href="/_blob/${encodeURIComponent(f.bild)}" target="_blank" rel="noopener" title="Foto: ${esc(f.urheber)}"><img src="/_blob/${encodeURIComponent(f.bild)}" alt="${esc(f.art)}" loading="lazy"><span>© ${esc(f.urheber)}</span></a>`).join("")}</div>
      <p class="muted small">Alle Rechte bei den Fotografen. Veröffentlicht mit deren Erlaubnis. ${list.filter((f) => safeUrl(f.link)).slice(0, 3).map((f) => `<a href="${esc(safeUrl(f.link))}" target="_blank" rel="noopener nofollow">Originalbeitrag von ${esc(f.urheber)} ↗</a>`).join(" ")}</p>`;
  }
  document.addEventListener("mantodea:detail", (e) => { cur = e.detail; setTimeout(() => showInDetail(cur), 50); });
})();
