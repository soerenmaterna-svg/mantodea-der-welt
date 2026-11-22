// „Sicher bis zur Art“: geführte Bestimmung für Gattungen, in denen jede Art über sichtbare Merkmale erreichbar ist.
// Ansichten über den Hash (#start, #metallyticus, #metallyticus-2, #metallyticus-fallax) – so funktioniert auch die Zurück-Taste des Browsers.
(() => {
  "use strict";
  const D = window.SICHER, Z = window.SZEICH;
  const EXT = !!window.SICHER_EXTERN;
  const $ = (id) => document.getElementById(id);
  const main = $("s-main");
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const BUCHST = "ABCDEFGH";
  const GAT = Object.fromEntries(D.gattungen.map((g) => [g.id, g]));
  const bild = (g, n) => `sicher/bilder/${g.id}/${n}.jpg`;
  const orig = (g, f) => `sicher/bilder/${g.id}/${f}`;
  if (EXT && $("s-link-gross")) $("s-link-gross").remove();

  // ---------- Baum-Hilfen
  function eltern(g) {
    if (g._el) return g._el;
    const el = {};
    for (const [n, s] of Object.entries(g.schritte)) s.opt.forEach((o, i) => { const z = o.weiter ? "s" + o.weiter : "a" + o.art; el[z] = { s: +n, i }; });
    return (g._el = el);
  }
  function pfad(g, ziel) { // Liste [{s, i}] vom Schritt 1 bis zum Ziel
    const el = eltern(g), p = [];
    let z = ziel;
    while (el[z]) { p.unshift(el[z]); z = "s" + el[z].s; }
    return p;
  }
  function artenUnter(g, n) {
    const out = [];
    const geh = (s) => g.schritte[s].opt.forEach((o) => (o.weiter ? geh(o.weiter) : out.push(o.art)));
    geh(n);
    return out;
  }
  const artName = (g, a) => g.artInfo[a].name;

  // ---------- Navigation
  function geheZu(h) { if (location.hash.slice(1) === h) zeige(); else location.hash = h; }
  function aktuell() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h || h === "start") return { v: "start" };
    const [gid, rest] = h.split(/-(.+)/);
    const g = GAT[gid];
    if (!g) return { v: "start" };
    if (!rest) return { v: "check", g };
    if (/^\d+$/.test(rest) && g.schritte[rest]) return { v: "schritt", g, n: +rest };
    if (g.artInfo[rest]) return { v: "art", g, a: rest };
    return { v: "check", g };
  }
  function elternAnsicht(a) {
    if (a.v === "check") return "start";
    if (a.v === "schritt") { const p = pfad(a.g, "s" + a.n); return p.length ? a.g.id + "-" + p[p.length - 1].s : a.g.id; }
    if (a.v === "art") { const p = pfad(a.g, "a" + a.a); return a.g.id + "-" + p[p.length - 1].s; }
    return null;
  }
  $("s-zurueck").onclick = () => { const z = elternAnsicht(aktuell()); if (z) geheZu(z); };
  $("s-neu").onclick = () => { const a = aktuell(); geheZu(a.g ? a.g.id + "-1" : "start"); };
  window.addEventListener("hashchange", zeige);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (!$("s-lupe").hidden) lupeZu(); return; }
    if (e.key === "Backspace" && !/input|textarea/i.test(e.target.tagName) && $("s-lupe").hidden) { e.preventDefault(); $("s-zurueck").click(); }
  });

  // ---------- Pfeile auf Fotos (Koordinaten in % der Bildfläche, Bild 4:3)
  function fotoPfeile(pf) {
    const W = 400, H = 300;
    const t = pf.map((p) => {
      const x2 = p.x * W / 100, y2 = p.y * H / 100, lx = p.lx * W / 100, ly = p.ly * H / 100;
      // ohne Text: zweiter Pfeil vom selben Schild (gleiche lx/ly wie der Pfeil davor)
      const tw = p.t ? p.t.length * 9.2 + 18 : 0, th = 28;
      const vor = !p.t && pf.find((q) => q.t && q.lx === p.lx && q.ly === p.ly);
      const tw2 = vor ? vor.t.length * 9.2 + 18 : tw;
      const bx = Math.min(Math.max(lx, 4), W - tw2 - 4), by = Math.min(Math.max(ly - th / 2, 4), H - th - 4);
      const sx = bx + tw2 / 2, sy = by + th / 2;
      const a = Math.atan2(y2 - sy, x2 - sx);
      const L = 15, p1 = [x2 - L * Math.cos(a - 0.42), y2 - L * Math.sin(a - 0.42)], p2 = [x2 - L * Math.cos(a + 0.42), y2 - L * Math.sin(a + 0.42)];
      const ex = x2 - 10 * Math.cos(a), ey = y2 - 10 * Math.sin(a);
      return `<path d="M${sx} ${sy} L${ex} ${ey}" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
        <path d="M${x2} ${y2} L${p1} L${p2} Z" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
        <path d="M${sx} ${sy} L${ex} ${ey}" stroke="#d62828" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M${x2} ${y2} L${p1} L${p2} Z" fill="#d62828"/>
        <circle cx="${x2}" cy="${y2}" r="15" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 3" opacity=".9"/>
        ${p.t ? `<rect x="${bx}" y="${by}" width="${tw}" height="${th}" rx="14" fill="#d62828" stroke="#fff" stroke-width="2"/>
        <text x="${sx}" y="${sy + 6}" text-anchor="middle" font-size="17" font-weight="700" fill="#fff" font-family="system-ui,sans-serif">${esc(p.t)}</text>` : ""}`;
    });
    // Schilder zuletzt zeichnen, damit kein Pfeil darüber liegt
    t.sort((a, b) => (a.includes("<rect") ? 1 : 0) - (b.includes("<rect") ? 1 : 0));
    return `<svg class="s-overlay" viewBox="0 0 ${W} ${H}" aria-hidden="true">${t.join("")}</svg>`;
  }
  function credit(n) {
    const c = D.credits[n]; if (!c) return "";
    return `<div class="s-cred">Foto: ${esc(c.user)} · <a href="https://www.inaturalist.org/observations/${c.obs}" target="_blank" rel="noopener">iNaturalist</a> · ${esc(c.lic)} · ${esc(c.art)}</div>`;
  }
  function origMark(m) {
    if (!m) return "";
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="${m.x}" cy="${m.y}" rx="17" ry="11" fill="rgba(214,40,40,.18)" stroke="#d62828" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>`;
  }

  // ---------- Lupe
  function lupe(html) { $("s-lupe").querySelector(".s-lupe-in").innerHTML = html; $("s-lupe").hidden = false; }
  function lupeZu() { $("s-lupe").hidden = true; }
  $("s-lupe").onclick = (e) => { if (e.target === $("s-lupe") || e.target.classList.contains("s-lupe-zu")) lupeZu(); };

  // ---------- Pfadleiste
  function pfadLeiste(a) {
    const t = [`<a href="#start">Übersicht</a>`];
    if (a.g) {
      t.push(`<span class="s-sep">›</span>`, a.v === "check" ? `<span class="s-jetzt"><i>${esc(a.g.name)}</i>?</span>` : `<a href="#${a.g.id}"><i>${esc(a.g.name)}</i></a>`);
      const p = a.v === "schritt" ? pfad(a.g, "s" + a.n) : a.v === "art" ? pfad(a.g, "a" + a.a) : [];
      for (const { s, i } of p) t.push(`<span class="s-sep">›</span><a href="#${a.g.id}-${s}" title="Schritt ${s} ändern">${s}: ${esc(a.g.schritte[s].opt[i].kurz)}</a>`);
      if (a.v === "schritt") t.push(`<span class="s-sep">›</span><span class="s-jetzt">Schritt ${a.n}</span>`);
      if (a.v === "art") t.push(`<span class="s-sep">›</span><span class="s-jetzt">✔ <i>${esc(artName(a.g, a.a))}</i></span>`);
    }
    $("s-pfad").innerHTML = a.v === "start" ? "" : t.join(" ");
  }

  // ---------- Ansichten
  function start() {
    main.innerHTML = `
      <h1>Sicher bis zur Art</h1>
      <p class="s-intro">Hier stehen nur Gattungen, bei denen die Fachliteratur <b>jede</b> heute bekannte Art allein über Merkmale trennt, die man mit bloßem Auge oder einer Lupe sieht – ohne Fundort, ohne Messen und ohne Präparat. Bei jeder Frage siehst du zwei Fotos vom <b>gleichen Körperteil</b>, eine eingefärbte Zeichnung und, wo es hilft, die Originalabbildung aus der Literatur.</p>
      <div class="s-gat-liste">${D.gattungen.map((g) => `
        <button class="s-gat" type="button" data-g="${g.id}">
          <img src="${bild(g, g.bild)}" alt="${esc(g.name)}" loading="lazy">
          <div><b>${esc(g.name)}</b> <small>${esc(g.deutsch)} · Familie ${esc(g.familie)}</small>
          <small>${g.arten} Arten · ${esc(g.gebiet)}</small><span class="s-los">Bestimmen →</span></div>
        </button>`).join("")}
      </div>
      <div class="s-info">So geht's: Wähle die Gattung, prüfe kurz, ob dein Tier dazugehört, und beantworte dann Frage für Frage. Mit <b>← Zurück</b> oben links gehst du jederzeit einen Schritt zurück; über die grünen Felder in der Leiste springst du direkt zu einer früheren Frage.</div>
      <p class="s-hinweis">Weitere Gattungen, in denen eine sichere Bestimmung bis zur Art möglich ist, werden ergänzt.</p>`;
    main.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => geheZu(b.dataset.g)));
  }

  function check(g) {
    const sym = { koerper: "✨", hals: "📐" };
    main.innerHTML = `
      <h1>Ist es eine <i>${esc(g.name)}</i>?</h1>
      <p class="s-intro">${esc(g.deutsch)} · Familie ${esc(g.familie)} · ${g.arten} Arten · ${esc(g.gebiet)}</p>
      <div class="s-check">
        <div>
          <ul>${g.check.map((c) => `<li><span>${sym[c.teil] || "✔"}</span><div>${esc(c.t)}</div></li>`).join("")}</ul>
          <div class="s-zeich-zeile">
            <div class="s-zeich">${Z.metallyticus({ teil: "koerper" })}<small>Ganzer Körper metallisch</small></div>
            <div class="s-zeich">${Z.metallyticus({ teil: "hals" })}<small>Halsschild kurz und breit</small></div>
          </div>
        </div>
        <figure><img src="${bild(g, g.bild)}" alt="${esc(g.name)}">${credit(g.bild)}</figure>
      </div>
      <div class="s-ja-nein">
        <button class="s-btn" type="button" id="s-ja">Ja, alles passt → Bestimmung starten</button>
        <button class="s-btn s-btn-leise" type="button" id="s-nein">Nein / unsicher</button>
      </div>
      <div id="s-nein-txt"></div>`;
    $("s-ja").onclick = () => geheZu(g.id + "-1");
    $("s-nein").onclick = () => { $("s-nein-txt").innerHTML = `<div class="s-info">Dann gehört das Tier wahrscheinlich zu einer anderen Gattung. ${EXT ? "Nutze den großen Bestimmungsschlüssel, der bei der Ordnung beginnt." : `Nutze den <a href="schluessel.html">großen Bestimmungsschlüssel</a>, der bei der Ordnung beginnt.`}</div>`; };
  }

  function optKarte(g, o, i, n) {
    const og = o.orig && g.originale[o.orig];
    // Ohne Foto rückt die Originalabbildung groß an die Stelle des Fotos
    const origGross = !o.foto && og;
    const fotoHtml = o.foto
      ? `<div class="s-bildbox" data-lupe="foto"><img src="${bild(g, o.foto.src)}" alt="Foto: ${esc(o.kurz)}">${fotoPfeile(o.foto.pf)}<button class="s-zoom" type="button" tabindex="-1">🔍 groß</button></div>${credit(o.foto.src)}`
      : origGross
        ? `<div class="s-bildbox s-bildbox-orig${og.rauch ? " rauch" : ""}" data-lupe="orig"><img src="${orig(g, og.src)}" alt="Originalabbildung">${origMark(og.mark)}<button class="s-zoom" type="button" tabindex="-1">🔍 groß</button></div><div class="s-cred">Originalabbildung: ${esc(og.q)} · kein Foto lebender Tiere vorhanden</div>`
        : `<div class="s-kein-foto">Für dieses Merkmal gibt es kein brauchbares Foto lebender Tiere.<br>Achte auf die Zeichnung.</div>`;
    const origHtml = og && !origGross ? `<div class="s-orig${og.rauch ? " rauch" : ""}" data-lupe="orig"><div class="s-orig-bild"><img src="${orig(g, og.src)}" alt="Originalabbildung">${origMark(og.mark)}</div><small>Original: ${esc(og.q)}</small></div>` : "";
    return `<article class="s-opt" data-i="${i}" tabindex="0" aria-label="Möglichkeit ${BUCHST[i]}: ${esc(o.t)}">
      <div class="s-opt-kopf"><span class="s-buchst">${n}${"ab"[i] || i}</span><span class="s-kurz">${esc(o.kurz)}</span></div>
      ${fotoHtml}
      <div class="s-zeich-zeile"${origHtml ? "" : ' style="grid-template-columns:1fr"'}>
        <div class="s-zeich">${Z.metallyticus(o.zeich)}<small>Zeichnung: Merkmal eingefärbt</small></div>
        ${origHtml}
      </div>
      <div class="s-text">${esc(o.t)}</div>
      <button class="s-btn s-waehlen" type="button">${o.art ? "Das passt → Ergebnis" : "Das passt → weiter"}</button>
    </article>`;
  }

  function schritt(g, n) {
    const s = g.schritte[n];
    const rest = artenUnter(g, n);
    main.innerHTML = `
      <div class="s-schritt-kopf"><span class="s-nr">Frage ${n}</span> <span class="s-hinweis">noch möglich: ${rest.map((a) => `<i>${esc(artName(g, a).replace(/^\w+ /, g.name[0] + ". "))}</i>`).join(", ")}</span></div>
      <h2>${esc(s.frage)}</h2>
      <div class="s-wo"><b>👁 Wo schauen?</b><span>${esc(s.wo)}</span></div>
      <div class="s-paar">${s.opt.map((o, i) => optKarte(g, o, i, n)).join("")}</div>
      ${s.hinweis ? `<p class="s-hinweis">ℹ️ ${esc(s.hinweis)}</p>` : ""}
      <p class="s-hinweis">Tipp: Tippe auf ein Foto oder eine Originalabbildung, um sie groß zu sehen.</p>`;
    main.querySelectorAll(".s-opt").forEach((el) => {
      const i = +el.dataset.i, o = s.opt[i];
      const waehle = () => geheZu(g.id + "-" + (o.weiter || o.art));
      el.querySelector(".s-waehlen").onclick = (e) => { e.stopPropagation(); waehle(); };
      el.onkeydown = (e) => { if (e.key === "Enter") waehle(); };
      const fb = el.querySelector('[data-lupe="foto"]');
      if (fb) fb.onclick = (e) => { e.stopPropagation(); lupe(`<div style="position:relative"><img src="${bild(g, o.foto.src)}" alt="">${fotoPfeile(o.foto.pf)}</div><p>${esc(o.t)}</p>`); };
      const ob = el.querySelector('[data-lupe="orig"]');
      if (ob) ob.onclick = (e) => { e.stopPropagation(); const og = g.originale[o.orig]; lupe(`<div style="position:relative"><img src="${orig(g, og.src)}" alt="" style="${og.rauch ? "filter:sepia(.6) brightness(.55) contrast(1.2)" : ""}">${origMark(og.mark)}</div><p>${esc(og.t)} (${esc(og.q)})</p>`); };
      el.onclick = waehle;
    });
  }

  function art(g, a) {
    const A = g.artInfo[a];
    const p = pfad(g, "a" + a);
    const weg = p.map(({ s, i }) => {
      const o = g.schritte[s].opt[i];
      const mini = o.foto ? `<img src="${bild(g, o.foto.src)}" alt="">` : `<span class="z-mini">${Z.metallyticus(o.zeich)}</span>`;
      return `<li>${mini}<div><b>Frage ${s}:</b> ${esc(o.t)}</div><a href="#${g.id}-${s}">ändern</a></li>`;
    }).join("");
    main.innerHTML = `
      <div class="s-erg">
        <div>
          <span class="s-sicher">✔ Bestimmt</span>
          <h1 class="s-erg-name">${esc(A.name)}</h1>
          <p class="s-erg-autor">${esc(A.autor)} · Familie ${esc(g.familie)}</p>
          <p>${esc(A.text)}</p>
          <p><b>Bekannt aus:</b> ${esc(A.land)}</p>
          <h3>Dein Weg</h3>
          <ul class="s-weg">${weg}</ul>
          <div class="s-knoepfe">
            <button class="s-btn" type="button" id="s-e-neu">⟲ Noch ein Tier bestimmen</button>
            <button class="s-btn s-btn-leise" type="button" id="s-e-start">Andere Gattung</button>
            <a class="s-btn s-btn-leise" style="text-decoration:none" href="https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(A.name)}" target="_blank" rel="noopener">Fotos auf iNaturalist ↗</a>
          </div>
          <p class="s-hinweis">Quelle des Schlüssels: ${esc(g.quelle)}</p>
        </div>
        <figure>${A.bild ? `<img src="${bild(g, A.bild)}" alt="${esc(A.name)}">${credit(A.bild)}` : `<div class="s-kein-foto">Kein Foto eines lebenden Tieres bekannt.</div><div class="s-zeich" style="margin-top:10px">${Z.metallyticus({ teil: "koerper" })}<small>Schema (Färbung wie M. splendidus, Hinterflügel glasklar)</small></div>`}</figure>
      </div>`;
    $("s-e-neu").onclick = () => geheZu(g.id + "-1");
    $("s-e-start").onclick = () => geheZu("start");
  }

  function zeige() {
    const a = aktuell();
    pfadLeiste(a);
    $("s-zurueck").disabled = a.v === "start";
    lupeZu();
    if (a.v === "start") start();
    else if (a.v === "check") check(a.g);
    else if (a.v === "schritt") schritt(a.g, a.n);
    else art(a.g, a.a);
    window.scrollTo(0, 0);
    document.title = (a.g ? a.g.name + " – " : "") + "Sicher bis zur Art";
  }
  zeige();
})();
