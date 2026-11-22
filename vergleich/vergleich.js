// Artenvergleich: Überblick-Tabelle, Vergleich je Merkmal (gleiches Körperteil nebeneinander), Steckbrief je Art.
// Ansichten über den Hash: #ueberblick, #m-huefte, #art-tristis  (Browser-Zurück funktioniert).
(() => {
  "use strict";
  const D = window.VERGLEICH;
  const $ = (id) => document.getElementById(id);
  const main = $("v-main");
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const ART = Object.fromEntries(D.arten.map((a) => [a.id, a]));
  const MM = Object.fromEntries(D.merkmale.map((m) => [m.id, m]));
  const datei = (n) => `vergleich/bilder/${D.id}/${n}.${/^(h|w|t)_/.test(n) ? "jpg" : "png"}`;
  const kurzName = (a) => a.name.replace(/^\w+ /, D.name[0] + ". ");
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  $("v-gat").textContent = D.name;

  // ---------- Auswahl der Arten (Schalter)
  let aktiv = new Set(D.arten.map((a) => a.id));
  try { const g = JSON.parse(ls.get("v-aktiv-" + D.id) || "null"); if (Array.isArray(g) && g.length >= 2) aktiv = new Set(g.filter((x) => ART[x])); } catch (e) {}
  const gewaehlt = () => D.arten.filter((a) => aktiv.has(a.id));

  // ---------- Pfeile: SVG-Linien in echten Bildproportionen, Schilder als HTML (bleiben lesbar)
  function pfeile(src, pf, breitePx) {
    if (!pf || !pf.length) return "";
    const [w, h] = D.groessen[src] || [1000, 1000];
    const W = 1000, H = Math.round(1000 * h / w);
    const svg = [], lab = [];
    for (const p of pf) {
      const est = Math.min(90, ((p.t.length * 7.4 + 22) / breitePx) * 100);
      const lx = Math.min(p.lx, 98 - est);
      const sx = (lx + est / 2) * W / 100, sy = p.ly * H / 100, x2 = p.x * W / 100, y2 = p.y * H / 100;
      const a = Math.atan2(y2 - sy, x2 - sx), L = 34;
      const p1 = [x2 - L * Math.cos(a - 0.42), y2 - L * Math.sin(a - 0.42)], p2 = [x2 - L * Math.cos(a + 0.42), y2 - L * Math.sin(a + 0.42)];
      const ex = x2 - 22 * Math.cos(a), ey = y2 - 22 * Math.sin(a);
      svg.push(`<path d="M${sx} ${sy} L${ex} ${ey}" stroke="#fff" stroke-width="17" stroke-linecap="round"/>
        <path d="M${x2} ${y2} L${p1} L${p2} Z" fill="#fff" stroke="#fff" stroke-width="9" stroke-linejoin="round"/>
        <path d="M${sx} ${sy} L${ex} ${ey}" stroke="#d62828" stroke-width="9" stroke-linecap="round"/>
        <path d="M${x2} ${y2} L${p1} L${p2} Z" fill="#d62828"/>
        <circle cx="${x2}" cy="${y2}" r="30" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="9 7"/>`);
      lab.push(`<span class="v-pfl" style="left:${lx}%;top:${p.ly}%">${esc(p.t)}</span>`);
    }
    return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${svg.join("")}</svg>${lab.join("")}`;
  }
  const css = document.createElement("style");
  css.textContent = `.v-pfl{position:absolute;transform:translateY(-50%);background:#d62828;color:#fff;font:700 12.5px/1.2 system-ui,sans-serif;border:2px solid #fff;border-radius:999px;padding:3px 9px;white-space:nowrap;pointer-events:none;box-shadow:0 1px 4px rgba(0,0,0,.35)}
  @media (max-width:560px){.v-pfl{font-size:10.5px;padding:2px 6px}}`;
  document.head.appendChild(css);

  function credit(n) {
    const c = D.credits[n]; if (!c) return "";
    return `<div class="v-cred">Foto: ${esc(c.user)} · <a href="https://www.inaturalist.org/observations/${c.obs}" target="_blank" rel="noopener">iNaturalist</a> · ${esc(c.lic)}</div>`;
  }
  function zeichQ(src) { const k = src.split("_")[0]; return D.zeichQuelle[k] ? "Originalzeichnung: " + D.zeichQuelle[k] : "Originalzeichnung"; }
  function bildBox(src, pf, fig, breite, titel) {
    return `<div class="v-bild${fig ? " fig" : ""}" data-src="${src}" data-titel="${esc(titel || "")}"><img src="${datei(src)}" alt="" loading="lazy">${pfeile(src, pf, breite)}<span class="tag">${fig ? "Zeichnung" : "Foto"}</span></div>`;
  }

  // ---------- Australien-Karte (vereinfachte Umrisse, Verbreitung schematisch)
  const P = (lon, lat) => [((lon - 112) * 2.3).toFixed(1), ((-lat - 9) * 2.3).toFixed(1)];
  const poly = (pts) => "M" + pts.map(([a, b]) => P(a, b).join(" ")).join(" L") + " Z";
  const FESTLAND = [[113.5, -22], [114, -26], [115, -34], [117.5, -35], [123, -34], [129, -31.5], [131, -31.5], [134, -32.5], [136, -35], [138, -34.5], [138.5, -35.5], [140, -37.8], [143, -38.8], [146.4, -39.1], [148, -37.8], [150, -37.4], [151, -34], [152.9, -31], [153.6, -28], [153, -25], [150.8, -22.5], [149, -20.6], [146.3, -19], [145.4, -16], [145.3, -14.8], [143.5, -14], [142.5, -10.7], [141.5, -13], [141.6, -16], [140.8, -17.5], [139.3, -17.3], [137.7, -16], [135.5, -15], [136.9, -12.3], [135.9, -11.9], [132.6, -11.5], [131, -12.2], [130, -13], [129.5, -15], [128, -14.9], [126.5, -14], [125, -15.5], [123.5, -16.5], [122.2, -18], [121, -19.6], [118.8, -20.3], [116.7, -20.6], [114.6, -21.8]];
  const TAS = [[144.6, -40.7], [148.3, -40.9], [148.3, -42.2], [147, -43.5], [145.3, -42.4]];
  const GEBIET = {
    tristis: { flaeche: [FESTLAND] },
    quinquedens: { flaeche: [[[142.3, -10.8], [143.6, -13.6], [145.4, -15.2], [146.4, -18.6], [147.6, -19.8], [146.4, -20.6], [144.4, -19.8], [142.6, -16.5], [141.6, -13.5]]], punkte: [[125.8, -14.6]] },
    viridis: { flaeche: [[[116, -24], [122, -20.5], [128, -19.5], [133, -18.5], [140, -20], [145.5, -24], [146.5, -30], [145.5, -36.3], [141, -35.3], [137.5, -32.5], [132, -29.5], [124, -29], [117.5, -27.5]]] },
    lepida: { punkte: [[131, -25.3], [131.7, -26.2]] },
  };
  function karte(ids, gross) {
    const g = [`<path d="${poly(FESTLAND)}" fill="#fbfaf5" stroke="#9aa39d" stroke-width=".6"/><path d="${poly(TAS)}" fill="#fbfaf5" stroke="#9aa39d" stroke-width=".6"/>`];
    for (const id of ids) {
      const a = ART[id], G = GEBIET[id] || {}, mehr = ids.length > 1;
      for (const f of G.flaeche || []) g.push(`<path d="${poly(f)}" fill="${a.farbe}" fill-opacity="${mehr ? (id === "tristis" ? 0.16 : 0.45) : 0.55}" stroke="${a.farbe}" stroke-width=".7"/>`);
      for (const [lo, la] of G.punkte || []) { const [x, y] = P(lo, la); g.push(`<circle cx="${x}" cy="${y}" r="${gross ? 1.8 : 2.2}" fill="${a.farbe}" stroke="#fff" stroke-width=".8"/>`); }
    }
    return `<div class="v-karte"><svg viewBox="0 0 98 84" role="img" aria-label="Karte Australien">${g.join("")}</svg></div>`;
  }

  // ---------- Kopfleiste
  function reiter(akt) {
    const t = [`<a href="#ueberblick" class="${akt === "ueberblick" ? "an" : ""}">📋 Auf einen Blick</a>`];
    for (const m of D.merkmale) t.push(`<a href="#m-${m.id}" class="${akt === "m-" + m.id ? "an" : ""}">${m.icon} ${esc(m.titel)}</a>`);
    $("v-tabs").innerHTML = t.join("");
    const an = $("v-tabs").querySelector(".an"); if (an) an.scrollIntoView({ block: "nearest", inline: "center" });
  }
  function chips(zeigen) {
    if (!zeigen) { $("v-chips").innerHTML = ""; return; }
    $("v-chips").innerHTML = `<span class="l">Vergleichen:</span>` + D.arten.map((a) => `<button type="button" class="v-chip${aktiv.has(a.id) ? " an" : ""}" style="--c:${a.farbe}" data-a="${a.id}" aria-pressed="${aktiv.has(a.id)}">${aktiv.has(a.id) ? "✓ " : ""}${esc(kurzName(a))}</button>`).join("")
      + `<button type="button" class="v-chip" style="--c:#6b7470" data-a="*">alle</button>`;
    $("v-chips").querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => {
      const id = b.dataset.a;
      if (id === "*") aktiv = new Set(D.arten.map((a) => a.id));
      else if (aktiv.has(id)) { if (aktiv.size > 1) aktiv.delete(id); } else aktiv.add(id);
      ls.set("v-aktiv-" + D.id, JSON.stringify([...aktiv]));
      zeige(true);
    }));
  }

  // ---------- Überblick
  function ueberblick() {
    const arten = gewaehlt();
    const zeilen = D.merkmale.map((m) => `<tr><th><a href="#m-${m.id}">${m.icon} ${esc(m.titel)}</a></th>${arten.map((a) => { const z = m.zellen[a.id] || {}; return `<td class="${z.einzig ? "einzig" : ""}">${esc(z.t || "–")}</td>`; }).join("")}</tr>`).join("");
    main.innerHTML = `
      <h1><i>${esc(D.name)}</i> – ${D.arten.length} Arten im Vergleich</h1>
      <p class="v-intro">${esc(D.gattung)} Verbreitung: ${esc(D.gebiet)}.</p>
      <div class="v-karten">${D.arten.map((a) => `
        <button type="button" class="v-art" style="--c:${a.farbe}" data-art="${a.id}">
          <div class="bild">${a.bild ? `<img src="${datei(a.bild)}" alt="">` : `<img class="fig" src="${datei("oben_" + a.id)}" alt="">`}</div>
          <div class="txt"><b>${esc(a.name)}</b><small>${esc(a.autor)}</small><div class="kenn">${esc(a.kurz)}</div></div>
        </button>`).join("")}
      </div>
      <div class="v-tipp">👉 <b>So vergleichst du:</b> Tippe oben auf ein Merkmal (⭐ Vorderhüfte ist das wichtigste) – dann siehst du dasselbe Körperteil bei allen Arten nebeneinander. Mit den farbigen Schaltern blendest du Arten aus, um z. B. nur zwei direkt zu vergleichen. Tippe auf eine Art für ihren Steckbrief.</div>
      <h2>Auf einen Blick</h2>
      <p class="v-intro">★ gelb = Merkmal, das <b>nur</b> diese Art hat.</p>
      <div class="v-tabelle-box"><table class="v-tabelle">
        <thead><tr><th></th>${arten.map((a) => `<th style="--c:${a.farbe}"><a href="#art-${a.id}" style="color:${a.farbe}">${esc(a.name)}</a></th>`).join("")}</tr></thead>
        <tbody>${zeilen}</tbody></table></div>`;
    main.querySelectorAll("[data-art]").forEach((b) => (b.onclick = () => (location.hash = "art-" + b.dataset.art)));
  }

  // ---------- Ein Merkmal bei allen Arten
  function merkmal(m) {
    const arten = gewaehlt();
    const breite = Math.max(150, Math.min(1280, window.innerWidth) / (window.innerWidth < 900 ? Math.min(arten.length, 2) : arten.length) - 40);
    const zellen = arten.map((a) => {
      const z = m.zellen[a.id] || {};
      const foto = z.foto ? bildBox(z.foto.src, z.foto.pf, false, breite, `${a.name}: ${m.titel}`) + credit(z.foto.src) : "";
      const zeich = z.zeich ? bildBox(z.zeich.src, z.zeich.pf, true, breite, `${a.name}: ${m.titel} – ${zeichQ(z.zeich.src)}`) : "";
      const leer = !z.foto && !m.karte ? `<div class="v-leer">Kein Foto lebender Tiere vorhanden – siehe Originalzeichnung.</div>` : "";
      return `<article class="v-zelle${z.einzig ? " einzig" : ""}" style="--c:${a.farbe}">
        <h3><a href="#art-${a.id}">${esc(kurzName(a))}</a></h3>
        ${z.einzig ? `<span class="v-badge">★ nur bei dieser Art</span>` : ""}
        ${m.karte ? karte([a.id]) : foto || leer}
        ${zeich}
        <div class="v-txt">${esc(z.t || "")}</div>
      </article>`;
    }).join("");
    const i = D.merkmale.indexOf(m), vor = D.merkmale[i - 1], nach = D.merkmale[i + 1];
    main.innerHTML = `
      <h2>${m.icon} ${esc(m.titel)}${m.haupt ? ` <span class="v-badge">wichtigstes Merkmal</span>` : ""}</h2>
      <div class="v-wo"><b>👁 Wo schauen?</b><span>${esc(m.wo)}</span></div>
      ${m.karte ? `<div style="max-width:520px;margin:0 auto 14px">${karte(arten.map((a) => a.id), true)}<p class="v-cred" style="text-align:center">${arten.map((a) => `<span style="color:${a.farbe}">■</span> ${esc(kurzName(a))}`).join(" &nbsp; ")} · vereinfacht nach Milledge 2005, Fig. 42–43</p></div>` : ""}
      <div class="v-raster" style="--n:${arten.length}">${zellen}</div>
      <div class="v-fazit"><b>Fazit:</b> ${esc(m.fazit)}</div>
      <div class="v-weiter">
        ${vor ? `<a class="v-btn v-leise" href="#m-${vor.id}">← ${vor.icon} ${esc(vor.titel)}</a>` : `<a class="v-btn v-leise" href="#ueberblick">← 📋 Auf einen Blick</a>`}
        ${nach ? `<a class="v-btn" href="#m-${nach.id}">${nach.icon} ${esc(nach.titel)} →</a>` : `<a class="v-btn" href="#ueberblick">📋 Auf einen Blick →</a>`}
      </div>
      <p class="v-cred">Tipp: Tippe auf ein Bild für die Großansicht. Mit den Pfeiltasten ← → wechselst du das Merkmal.</p>`;
  }

  // ---------- Steckbrief einer Art
  function art(a) {
    const einzig = D.merkmale.filter((m) => m.zellen[a.id] && m.zellen[a.id].einzig);
    const nurHtml = einzig.map((m) => {
      const z = m.zellen[a.id];
      return `<div class="v-nur"><h3>★ Nur ${esc(kurzName(a))} hat: ${esc(m.titel)}</h3><div>${esc(z.t)}</div>
        <div class="paar">${z.foto ? bildBox(z.foto.src, z.foto.pf, false, 300, a.name) : ""}${z.zeich ? bildBox(z.zeich.src, z.zeich.pf, true, 300, a.name + " – " + zeichQ(z.zeich.src)) : ""}</div>
        <p style="margin:6px 0 0"><a href="#m-${m.id}">→ mit den anderen Arten vergleichen</a></p></div>`;
    }).join("") || `<div class="v-nur"><h3>Erkennungsmerkmal</h3>${esc(a.kurz)}</div>`;
    const gegen = D.arten.filter((b) => b.id !== a.id).map((b) => {
      const unt = D.merkmale.filter((m) => !m.karte && m.zellen[a.id] && m.zellen[b.id] && m.zellen[a.id].t !== m.zellen[b.id].t && (m.zellen[a.id].einzig || m.zellen[b.id].einzig || m.haupt))[0];
      const txt = unt ? `<b>${esc(unt.titel)}:</b> hier „${esc(unt.zellen[a.id].t)}“ – bei <i>${esc(kurzName(b))}</i> dagegen „${esc(unt.zellen[b.id].t)}“` : esc(b.kurz);
      return `<li style="--c:${b.farbe}">≠ <a href="#art-${b.id}" style="--c:${b.farbe}">${esc(b.name)}</a><br>${txt}</li>`;
    }).join("");
    const alle = D.merkmale.filter((m) => !m.karte).map((m) => `<li style="--c:${a.farbe}"><a href="#m-${m.id}" style="--c:${a.farbe}">${m.icon} ${esc(m.titel)}</a>${m.zellen[a.id] && m.zellen[a.id].einzig ? " ★" : ""}<br>${esc((m.zellen[a.id] || {}).t || "")}</li>`).join("");
    main.innerHTML = `
      <div class="v-steck" style="--c:${a.farbe}">
        <div>
          <h1 class="name">${esc(a.name)}</h1>
          <p style="color:var(--grau);margin:2px 0 10px">${esc(a.autor)} · Familie ${esc(D.familie)}</p>
          <p>${esc(a.text)}</p>
          ${nurHtml}
          <h2>So unterscheidest du sie von den anderen</h2>
          <ul class="v-gegen">${gegen}</ul>
        </div>
        <div>
          <figure>${a.bild ? `<img src="${datei(a.bild)}" alt="${esc(a.name)}">${credit(a.bild)}` : `<img src="${datei("oben_" + a.id)}" alt="${esc(a.name)}" style="max-height:520px;object-fit:contain"><div class="v-cred">${esc(zeichQ("oben_x"))} · kein Foto lebender Tiere bekannt</div>`}</figure>
          <h2>Verbreitung</h2>
          ${karte([a.id])}
          <p>${esc(a.gebiet)}</p>
          <h2>Alle Merkmale</h2>
          <ul class="v-gegen">${alle}</ul>
        </div>
      </div>
      <div class="v-weiter">${D.arten.map((b) => b.id === a.id ? "" : `<a class="v-btn v-leise" style="border-color:${b.farbe};color:${b.farbe}" href="#art-${b.id}"><i>${esc(kurzName(b))}</i> →</a>`).join("")}</div>`;
  }

  // ---------- Lupe
  function lupe(src, titel) {
    const box = main.querySelector(`.v-bild[data-src="${src}"]`);
    const svg = box ? box.innerHTML.replace(/<span class="tag">.*?<\/span>/, "") : `<img src="${datei(src)}">`;
    $("v-lupe").querySelector(".v-lupe-in").innerHTML = `<div class="rahmen">${svg}</div><p>${titel}</p>`;
    $("v-lupe").hidden = false;
  }
  $("v-lupe").onclick = (e) => { if (e.target === $("v-lupe") || e.target.classList.contains("v-lupe-zu")) $("v-lupe").hidden = true; };
  main.addEventListener("click", (e) => { const b = e.target.closest(".v-bild"); if (b) lupe(b.dataset.src, b.dataset.titel); });

  // ---------- Navigation
  const verlauf = [];
  function zeige(bleiben) {
    const h = decodeURIComponent(location.hash.slice(1)) || "ueberblick";
    if (!bleiben && verlauf[verlauf.length - 1] !== h) verlauf.push(h);
    $("v-lupe").hidden = true;
    let akt = "ueberblick";
    if (h.startsWith("m-") && MM[h.slice(2)]) { akt = h; merkmal(MM[h.slice(2)]); chips(true); }
    else if (h.startsWith("art-") && ART[h.slice(4)]) { akt = ""; art(ART[h.slice(4)]); chips(false); }
    else { ueberblick(); chips(true); }
    reiter(akt);
    $("v-zurueck").disabled = verlauf.length < 2 && akt === "ueberblick";
    if (!bleiben) window.scrollTo(0, 0);
    document.title = (h.startsWith("art-") && ART[h.slice(4)] ? ART[h.slice(4)].name : D.name) + " – Artenvergleich";
  }
  $("v-zurueck").onclick = () => { if (verlauf.length > 1) { verlauf.pop(); history.back(); } else location.hash = "ueberblick"; };
  window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (verlauf.length > 1 && verlauf[verlauf.length - 2] === h) verlauf.pop(); zeige(); });
  window.addEventListener("resize", () => { if (location.hash.startsWith("#m-")) zeige(true); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { $("v-lupe").hidden = true; return; }
    if (!$("v-lupe").hidden || /input|textarea/i.test(e.target.tagName)) return;
    const ids = ["ueberblick", ...D.merkmale.map((m) => "m-" + m.id)];
    const i = ids.indexOf(location.hash.slice(1) || "ueberblick");
    if (i < 0) return;
    if (e.key === "ArrowRight" && i < ids.length - 1) location.hash = ids[i + 1];
    if (e.key === "ArrowLeft" && i > 0) location.hash = ids[i - 1];
  });
  $("v-fuss").innerHTML = `<p>Quelle der Merkmale: ${esc(D.quelle)} Zeichnungen: Originalabbildungen daraus. Fotos: iNaturalist-Beobachter (Lizenz am Bild).</p>${window.VERGLEICH_EXTERN ? "" : `<p><a href="sicher.html">→ Sicher bis zur Art (geführte Bestimmung)</a> · <a href="schluessel.html">→ Großer Bestimmungsschlüssel</a></p>`}`;
  zeige();
})();
