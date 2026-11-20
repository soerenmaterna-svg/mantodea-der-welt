// Schwebender Zurück-Knopf (Smartphone): schließt zuerst offene Fenster, sonst zurück zum vorigen Reiter,
// sonst nach oben bzw. zur Artenliste.
(() => {
  "use strict";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "back-fab";
  btn.setAttribute("aria-label", "Zurück");
  btn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(btn);

  // eigener Verlauf der Reiter (nicht der Browser-Verlauf, damit claude.ai nicht verlassen wird)
  const stack = [];
  let cur = location.hash || "#arten", skip = false;
  window.addEventListener("hashchange", () => {
    const h = location.hash || "#arten";
    if (!skip && h !== cur) stack.push(cur);
    skip = false; cur = h; place();
  });

  const openDialogs = () => [...document.querySelectorAll("dialog[open]")];
  function topLayer() {
    const ds = openDialogs();
    return ds.length ? ds[ds.length - 1] : null;
  }
  // Modale Fenster liegen über allem: Knopf in das oberste offene Fenster verschieben
  function place() {
    const t = topLayer() || document.body;
    if (btn.parentElement !== t) t.appendChild(btn);
  }
  const mo = new MutationObserver(place);
  const watch = () => document.querySelectorAll("dialog").forEach((d) => { if (!d.__bw) { d.__bw = 1; mo.observe(d, { attributes: true, attributeFilter: ["open"] }); d.addEventListener("close", () => setTimeout(place, 0)); } });
  watch();
  new MutationObserver(watch).observe(document.body, { childList: true });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    // 1. Einblendungen innerhalb eines Fensters
    const ov = document.querySelector(".map-overlay");
    if (ov) { ov.remove(); return; }
    const lb = document.querySelector("#lightbox:not([hidden])");
    if (lb) { lb.hidden = true; return; }
    const ss = document.getElementById("ss");
    if (ss && !ss.hidden) { ss.click(); return; }
    // 2. oberstes Fenster schließen
    const d = topLayer();
    if (d) { d.close(); place(); return; }
    // 3. Stammbaum im Vollbild verlassen
    const tf = document.querySelector(".tree-panel.tree-full");
    if (tf) { tf.querySelector('[data-z="full"]').click(); return; }
    // 4. voriger Reiter
    if (stack.length) { skip = true; location.hash = stack.pop(); window.scrollTo({ top: 0 }); return; }
    // 5. nach oben bzw. zur Artenliste
    if (window.scrollY > 200) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if ((location.hash || "#arten") !== "#arten") { skip = true; location.hash = "arten"; }
  });
})();
