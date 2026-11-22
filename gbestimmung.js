// Kurz-Bestimmung innerhalb einer Gattung: so wenige Merkmale wie möglich, je Merkmal dasselbe Körperteil
// nebeneinander (Foto / Originalabbildung), rote Pfeile auf das Merkmal, darunter sofort Ergebnis oder „weiter“.
// Daten: data/gbestimmung.js (window.MANTODEA_GB). Nutzung: MANTODEA_GBK.html(gattung, {art: "Gattung art"})
(() => {
  "use strict";
  const GB = window.MANTODEA_GB || {};
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const BASIS = window.MANTODEA_GB_BASIS || "data/gbilder/";
  const key = (n) => { const SP = (window.MANTODEA && window.MANTODEA.species) || []; const s = SP.find((x) => x.n === n); return s ? s.k : null; };

  function pfeile(g, b) {
    if (!b.pf || !b.pf.length) return "";
    const [w, h] = (g.groessen && g.groessen[b.src]) || [1000, 1000];
    const W = 1000, H = Math.round(1000 * h / w), svg = [], lab = [];
    for (const p of b.pf) {
      const est = Math.min(80, p.t.length * 2.6 + 8), lx = Math.min(p.lx, 98 - est);
      const sx = (lx + est / 2) * W / 100, sy = p.ly * H / 100, x2 = p.x * W / 100, y2 = p.y * H / 100;
      const a = Math.atan2(y2 - sy, x2 - sx), L = 40;
      const p1 = [x2 - L * Math.cos(a - 0.42), y2 - L * Math.sin(a - 0.42)], p2 = [x2 - L * Math.cos(a + 0.42), y2 - L * Math.sin(a + 0.42)];
      const ex = x2 - 26 * Math.cos(a), ey = y2 - 26 * Math.sin(a);
      svg.push(`<path d="M${sx} ${sy}L${ex} ${ey}" stroke="#fff" stroke-width="20" stroke-linecap="round"/><path d="M${x2} ${y2}L${p1}L${p2}Z" fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>
        <path d="M${sx} ${sy}L${ex} ${ey}" stroke="#d62828" stroke-width="11" stroke-linecap="round"/><path d="M${x2} ${y2}L${p1}L${p2}Z" fill="#d62828"/>
        <circle cx="${x2}" cy="${y2}" r="34" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="10 8"/>`);
      lab.push(`<span class="gb-pfl" style="left:${lx}%;top:${p.ly}%">${esc(p.t)}</span>`);
    }
    return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${svg.join("")}</svg>${lab.join("")}`;
  }
  function bild(g, b) {
    const c = b.foto && g.credits && g.credits[b.src];
    const cap = b.foto ? (c ? `Foto: ${esc(c.user)} · <a href="https://www.inaturalist.org/observations/${c.obs}" target="_blank" rel="noopener">iNaturalist</a> · ${esc(c.lic || "CC BY-NC")}` : "Foto")
      : esc(b.cap || ("Abbildung: " + g.kurzquelle));
    const gr = (g.groessen && g.groessen[b.src]) || [1, 1];
    return `<figure class="gb-fig"><div class="gb-bild${b.foto ? "" : " fig"}${gr[0] / gr[1] > 1.6 ? " breit" : ""}${b.filter ? " f-" + b.filter : ""}" data-gross="1"><img src="${BASIS}${g.ordner}/${b.src}" alt="" loading="lazy">${pfeile(g, b)}</div><figcaption>${cap}</figcaption></figure>`;
  }
  const kurz = (g, n) => n.replace(/^\w+ /, g.name[0] + ". ");

  function html(gattung, opt = {}) {
    const g = GB[gattung]; if (!g) return "";
    const hier = opt.art || "";
    const uid = "gb" + Math.random().toString(36).slice(2, 8);
    const n = Object.keys(g.arten).length, m = g.merkmale.length;
    const merkmale = g.merkmale.map((M, i) => `
      <section class="gb-m" id="${uid}-${i + 1}">
        <h4><span class="gb-nr">${i + 1}</span> ${esc(M.titel)}</h4>
        ${M.nurWenn ? `<p class="gb-nurwenn">↳ ${esc(M.nurWenn)}</p>` : ""}
        ${M.wo ? `<p class="gb-wo">👁 ${esc(M.wo)}</p>` : ""}
        <div class="gb-reihe" style="--n:${M.spalten.length}">${M.spalten.map((s) => {
          const ziel = s.art ? [s.art] : s.arten || [];
          const treffer = hier && ziel.includes(hier);
          const farbe = s.art ? (g.arten[s.art] || {}).farbe || "#555" : "#6b7470";
          return `<article class="gb-s${treffer ? " hier" : ""}" style="--c:${farbe}">
            <h5>${esc(s.t)}</h5>
            ${(s.bilder || []).map((b) => bild(g, b)).join("")}
            ${s.art ? `<a class="gb-erg" style="--c:${farbe}" ${key(s.art) ? `href="#art=${key(s.art)}" data-k="${key(s.art)}"` : ""}>= <i>${esc(kurz(g, s.art))}</i>${treffer ? " ✓ diese Art" : ""}</a>`
              : `<a class="gb-weiter" href="#${uid}-${s.weiter}" data-sprung="${uid}-${s.weiter}">↓ weiter zu Merkmal ${s.weiter}<small>${ziel.map((x) => `<i>${esc(kurz(g, x))}</i>`).join(" oder ")}</small></a>`}
          </article>`;
        }).join("")}</div>
      </section>`).join("");
    return `<div class="gb" id="${uid}">
      <div class="gb-kopf"><b>🔎 Arten unterscheiden: <i>${esc(g.name)}</i></b> · ${n} Arten · ${m === 1 ? "1 Merkmal genügt" : m + " Merkmale genügen"}${hier ? ` · <span class="gb-hier-hinweis">✓ markiert: <i>${esc(kurz(g, hier))}</i></span>` : ""}</div>
      <p class="gb-ki">⚠️ <b>Mit KI erstellt.</b> Diese Kurzbestimmung wurde von einer KI aus der Fachliteratur abgeleitet und kann Fehler enthalten. Für eine verbindliche Bestimmung bitte immer die Originalarbeit verwenden (Link unten).</p>
      ${merkmale}
      ${g.hinweis ? `<p class="gb-hinweis">ℹ️ ${esc(g.hinweis)}</p>` : ""}
      <p class="gb-quelle">📄 <b>Originalarbeit:</b> ${g.quellen.map((q) => q.u ? `<a href="${esc(q.u)}" target="_blank" rel="noopener">${esc(q.t)} ↗</a>` : esc(q.t)).join(" · ")}</p>
    </div>`;
  }

  // Großansicht und Sprünge
  document.addEventListener("click", (e) => {
    const sp = e.target.closest("[data-sprung]");
    if (sp) { e.preventDefault(); const el = document.getElementById(sp.dataset.sprung); if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); el.classList.add("blink"); setTimeout(() => el.classList.remove("blink"), 1400); } return; }
    const b = e.target.closest(".gb-bild[data-gross]");
    if (b) {
      let d = document.getElementById("gb-lupe");
      if (!d) { d = document.createElement("div"); d.id = "gb-lupe"; d.className = "gb-lupe"; document.body.appendChild(d); d.addEventListener("click", () => (d.hidden = true)); }
      d.innerHTML = `<button type="button" class="gb-lupe-zu">← Zurück</button><div class="gb-lupe-in ${b.className}">${b.innerHTML}</div>`;
      d.hidden = false; e.preventDefault(); e.stopPropagation(); return;
    }
  }, true);
  document.addEventListener("keydown", (e) => { const d = document.getElementById("gb-lupe"); if (e.key === "Escape" && d) d.hidden = true; });
  function einpassen(root) {
    (root || document).querySelectorAll(".gb-pfl").forEach((l) => {
      l.style.marginLeft = "0px";
      const box = l.parentElement.clientWidth, r = l.offsetLeft + l.offsetWidth;
      if (box && r > box - 2) l.style.marginLeft = -(r - box + 3) + "px";
    });
  }
  window.addEventListener("resize", () => einpassen());
  window.MANTODEA_GBK = { html, has: (g) => !!GB[g], einpassen, liste: () => Object.keys(GB).sort() };
})();
