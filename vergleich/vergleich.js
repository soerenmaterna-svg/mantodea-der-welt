// Artenvergleich – kurz: so wenige Merkmale wie möglich, je Merkmal dasselbe Körperteil nebeneinander,
// unter jedem Bild sofort das Ergebnis (Art) oder der Hinweis auf das nächste Merkmal.
(() => {
  "use strict";
  const D = window.VERGLEICH;
  const $ = (id) => document.getElementById(id);
  const main = $("v-main");
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const datei = (n) => `vergleich/bilder/${D.id}/${n}.${/^(h|w|t)_/.test(n) ? "jpg" : "png"}`;
  const kurz = (id) => D.arten[id].name.replace(/^\w+ /, D.name[0] + ". ");
  $("v-gat").textContent = D.name;

  // Pfeil (SVG in echten Bildproportionen) + Schild (HTML, bleibt lesbar)
  function pfeile(src, pf) {
    if (!pf || !pf.length) return "";
    const [w, h] = D.groessen[src] || [1000, 1000];
    const W = 1000, H = Math.round(1000 * h / w), svg = [], lab = [];
    for (const p of pf) {
      const est = Math.min(80, p.t.length * 2.6 + 8);
      const lx = Math.min(p.lx, 98 - est);
      const sx = (lx + est / 2) * W / 100, sy = p.ly * H / 100, x2 = p.x * W / 100, y2 = p.y * H / 100;
      const a = Math.atan2(y2 - sy, x2 - sx), L = 40;
      const p1 = [x2 - L * Math.cos(a - 0.42), y2 - L * Math.sin(a - 0.42)], p2 = [x2 - L * Math.cos(a + 0.42), y2 - L * Math.sin(a + 0.42)];
      const ex = x2 - 26 * Math.cos(a), ey = y2 - 26 * Math.sin(a);
      svg.push(`<path d="M${sx} ${sy} L${ex} ${ey}" stroke="#fff" stroke-width="20" stroke-linecap="round"/>
        <path d="M${x2} ${y2} L${p1} L${p2} Z" fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>
        <path d="M${sx} ${sy} L${ex} ${ey}" stroke="#d62828" stroke-width="11" stroke-linecap="round"/>
        <path d="M${x2} ${y2} L${p1} L${p2} Z" fill="#d62828"/>
        <circle cx="${x2}" cy="${y2}" r="34" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="10 8"/>`);
      lab.push(`<span class="v-pfl" style="left:${lx}%;top:${p.ly}%">${esc(p.t)}</span>`);
    }
    return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${svg.join("")}</svg>${lab.join("")}`;
  }
  function bild(b, art, zeich) {
    if (!b) return `<div class="v-leer">Kein Foto vorhanden</div>`;
    const c = D.credits[b.src];
    return `<figure class="v-fig"><div class="v-bild${zeich ? " fig" : ""}" data-src="${b.src}"><img src="${datei(b.src)}" alt="">${pfeile(b.src, b.pf)}</div>
      <figcaption>${zeich ? (b.gefaerbt ? "Zeichnung (Milledge 2005), nach Beschreibung eingefärbt" : "Zeichnung: Milledge 2005") : `Foto: ${esc(c ? c.user : "")} · <a href="https://www.inaturalist.org/observations/${c ? c.obs : ""}" target="_blank" rel="noopener">iNaturalist</a> · CC BY-NC`}</figcaption></figure>`;
  }
  function artKnopf(id) {
    const a = D.arten[id];
    return `<button type="button" class="v-ergebnis" style="--c:${a.farbe}" data-art="${id}">
      <img src="${datei(a.bild)}" alt="" class="${a.zeichnung ? "fig" : ""}"><span>= <i>${esc(kurz(id))}</i></span></button>`;
  }

  function seite() {
    const viele = D.merkmale.length;
    main.innerHTML = `
      <h1><i>${esc(D.name)}</i>: ${Object.keys(D.arten).length} Arten – ${viele === 1 ? "1 Merkmal genügt" : `${viele} Merkmale genügen`}</h1>
      ${D.merkmale.map((m) => `
      <section class="v-merkmal" id="merkmal-${m.nr}">
        <h2><span class="v-nr">${m.nr}</span> ${esc(m.titel)}</h2>
        ${m.nurWenn ? `<p class="v-nurwenn">↳ ${esc(m.nurWenn)}</p>` : ""}
        <p class="v-wo">👁 ${esc(m.wo)}</p>
        <div class="v-reihe" style="--n:${m.spalten.length}">
          ${m.spalten.map((s) => `
          <article class="v-spalte" style="--c:${s.art ? D.arten[s.art].farbe : "#6b7470"}">
            <h3>${esc(s.t)}</h3>
            ${bild(s.foto, s.art)}
            ${bild(s.zeich, s.art, true)}
            ${s.art ? artKnopf(s.art) : `<a class="v-weiter-knopf" href="#merkmal-${s.weiter}">↓ weiter zu Merkmal ${s.weiter}<small>(${s.arten.map((x) => `<i>${esc(kurz(x))}</i>`).join(" oder ")})</small></a>`}
          </article>`).join("")}
        </div>
      </section>`).join("")}
      <section class="v-merkmal">
        <h2>Die ${Object.keys(D.arten).length} Arten</h2>
        <div class="v-arten">${Object.keys(D.arten).map((id) => {
          const a = D.arten[id];
          return `<button type="button" class="v-art" style="--c:${a.farbe}" data-art="${id}"><img src="${datei(a.bild)}" alt="" class="${a.zeichnung ? "fig" : ""}"><b><i>${esc(kurz(id))}</i></b><small>${esc(a.ort)}</small></button>`;
        }).join("")}</div>
      </section>`;
  }

  // Großansicht (Bild oder Art) – über den Hash, damit Zurück sie schließt
  function lupeHtml(h) {
    if (h.startsWith("art-") && D.arten[h.slice(4)]) {
      const id = h.slice(4), a = D.arten[id];
      const weg = [];
      for (const m of D.merkmale) for (const s of m.spalten) if (s.art === id || (s.arten || []).includes(id)) weg.push(`<li><b>${m.nr}. ${esc(m.titel)}:</b> ${esc(s.t)}</li>`);
      const c = D.credits[a.bild];
      return `<div class="v-artbox" style="--c:${a.farbe}"><img src="${datei(a.bild)}" alt="" class="${a.zeichnung ? "fig" : ""}">
        <div><h2><i>${esc(a.name)}</i></h2><ul>${weg.join("")}</ul><p>📍 ${esc(a.ort)}</p>
        <p class="v-klein">${a.zeichnung ? "Zeichnung: Milledge 2005 – kein Foto lebender Tiere bekannt" : c ? `Foto: ${esc(c.user)} · iNaturalist · CC BY-NC` : ""}</p></div></div>`;
    }
    if (h.startsWith("bild-")) {
      const el = main.querySelector(`.v-bild[data-src="${h.slice(5)}"]`);
      return el ? `<div class="rahmen${el.classList.contains("fig") ? " fig" : ""}">${el.innerHTML}</div>` : "";
    }
    return "";
  }
  function zeige() {
    const h = decodeURIComponent(location.hash.slice(1));
    const inhalt = h ? lupeHtml(h) : "";
    $("v-lupe").hidden = !inhalt;
    if (inhalt) { $("v-lupe").querySelector(".v-lupe-in").innerHTML = inhalt; requestAnimationFrame(schilderEinpassen); }
    if (h.startsWith("merkmal-")) { const el = $(h); if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); el.classList.add("blink"); setTimeout(() => el.classList.remove("blink"), 1400); } }
  }
  main.addEventListener("click", (e) => {
    const b = e.target.closest(".v-bild"); if (b) { location.hash = "bild-" + b.dataset.src; return; }
    const a = e.target.closest("[data-art]"); if (a) location.hash = "art-" + a.dataset.art;
  });
  const schliessen = () => { if (/^#(art|bild)-/.test(location.hash)) history.back(); };
  $("v-lupe").onclick = (e) => { if (e.target === $("v-lupe") || e.target.classList.contains("v-lupe-zu")) schliessen(); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") schliessen(); });
  $("v-zurueck").onclick = () => { if (/^#(art|bild|merkmal)-/.test(location.hash)) history.back(); else if (history.length > 1) history.back(); else window.scrollTo({ top: 0, behavior: "smooth" }); };
  window.addEventListener("hashchange", zeige);
  $("v-fuss").innerHTML = `<p>Merkmale nach ${esc(D.quelle)}</p>${window.VERGLEICH_EXTERN ? "" : `<p><a href="index.html">← Mantodea der Welt</a> · <a href="sicher.html">Sicher bis zur Art</a> · <a href="schluessel.html">Großer Bestimmungsschlüssel</a></p>`}`;
  // Schilder, die über den Bildrand ragen, nach innen schieben (schmale Handy-Spalten)
  function schilderEinpassen() {
    document.querySelectorAll(".v-pfl").forEach((l) => {
      l.style.marginLeft = "0px";
      const box = l.parentElement.clientWidth, r = l.offsetLeft + l.offsetWidth;
      if (r > box - 2) l.style.marginLeft = -(r - box + 3) + "px";
    });
  }
  window.addEventListener("resize", schilderEinpassen);
  window.addEventListener("load", schilderEinpassen);
  seite();
  zeige();
  schilderEinpassen();
})();
