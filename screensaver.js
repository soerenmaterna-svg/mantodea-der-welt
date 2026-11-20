// Bildschirmschoner: ausgewählte, hochauflösende Fotos (Commons-Auszeichnungen und beliebteste iNaturalist-Fotos)
// als Vollbild-Diashow. Das Foto steht vollständig in der Mitte, dahinter eine weichgezeichnete Fassung als Hintergrund.
(() => {
  "use strict";
  const UI = window.MANTODEA_UI;
  const box = document.getElementById("ss"), btn = document.getElementById("ss-btn");
  if (!UI || !box || !btn) return;
  const layers = [...box.querySelectorAll(".ss-layer")];
  layers.forEach((L) => { L.innerHTML = `<div class="ss-bg"></div><img class="ss-img" alt="">`; });
  let regionNames = null;
  try { regionNames = new Intl.DisplayNames(["de"], { type: "region" }); } catch (e) { /* alter Browser */ }
  const land = (cc) => { try { return cc ? (regionNames ? regionNames.of(cc) : cc) : ""; } catch (e) { return cc; } };
  const LIC = { "cc0": "CC0", "pd": "Public Domain", "cc-by": "CC BY", "cc-by-sa": "CC BY-SA", "cc-by-nd": "CC BY-ND", "cc-by-nc": "CC BY-NC", "cc-by-nc-sa": "CC BY-NC-SA", "cc-by-nc-nd": "CC BY-NC-ND" };
  const got = {}, wait = {};
  window.__mantodeaSS = (n, src) => { got[n] = src; (wait[n] || []).forEach((f) => f(src)); delete wait[n]; };
  function loadSS(n) {
    if (got[n]) return Promise.resolve(got[n]);
    return new Promise((res, rej) => {
      const first = !wait[n]; (wait[n] = wait[n] || []).push(res);
      if (first) { const sc = document.createElement("script"); sc.src = UI.vq(`data/ss/s${n}.js`); sc.onerror = rej; document.head.appendChild(sc); }
    });
  }
  let order = [], pos = 0, timer = null, cur = 0, running = false, curated = false, paused = false, forceSmall = false;
  // Pause-Knopf (und Leertaste): Bild bleibt stehen, bis "Weiter" gedrückt wird
  const pb = document.createElement("button");
  pb.type = "button"; pb.className = "ss-pause"; pb.setAttribute("aria-label", "Pause");
  box.appendChild(pb);
  const showPause = () => { pb.innerHTML = paused ? "▶ Weiter" : "⏸ Pause"; pb.setAttribute("aria-pressed", String(paused)); box.classList.toggle("paused", paused); };
  function togglePause() {
    if (!running) return;
    paused = !paused; showPause();
    if (paused) clearTimeout(timer); else timer = setTimeout(next, 1500);
  }
  pb.addEventListener("click", (e) => { e.stopPropagation(); togglePause(); });
  // Version mit live geladenen Originalfotos als Datei (läuft außerhalb von claude.ai, speichert keine Fotos)
  const db2 = document.createElement("button");
  db2.type = "button"; db2.className = "ss-dl"; db2.textContent = "⬇ Version mit Originalfotos";
  db2.title = "Lädt eine HTML-Datei herunter, die Originalfotos in voller Auflösung live von iNaturalist zeigt";
  box.appendChild(db2);
  db2.addEventListener("click", async (e) => {
    e.stopPropagation();
    const dl = window.claude && window.claude.use ? await window.claude.use("downloads").catch(() => null) : null;
    try { await UI.loadScript("data/schoner-datei.js"); } catch (err) { db2.textContent = "Datei nicht verfügbar"; return; }
    const data = window.MANTODEA_SS_FILE;
    try {
      if (dl) { try { await dl.save({ filename: "Mantodea-Bildschirmschoner.html", data }); } catch (err) { await dl.save({ filename: "Mantodea-Bildschirmschoner.html", data: new Blob([data], { type: "text/html" }) }); } }
      else { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([data], { type: "text/html" })); a.download = "Mantodea-Bildschirmschoner.html"; a.click(); }
      db2.textContent = "✓ Datei gespeichert – im Browser öffnen";
    } catch (err) { db2.textContent = "Download abgebrochen"; }
  });
  // Ersatz, falls die Auswahl fehlt: Titelbilder der Arten
  const pool = UI.DATA.filter((s) => s.p && s.p.b != null && !s.x && s.p.front);
  async function source(i) {
    if (curated) {
      const m = window.MANTODEA_SS[order[i % order.length]];
      const sp = UI.DATA.find((s) => s.n === m.t);
      return { src: await loadSS(order[i % order.length]), meta: m,
        name: sp ? `<i>${UI.esc(sp.n)}</i>${sp.de || sp.en ? " · " + UI.esc(sp.de || sp.en) : ""}` : m.t && /^[A-Z][a-z]+ [a-z]/.test(m.t) ? `<i>${UI.esc(m.t)}</i>${m.de ? " · " + UI.esc(m.de) : ""}` : UI.esc(m.de || m.t || "Gottesanbeterin"),
        place: land(m.cc), credit: `Foto: ${m.by} · ${m.l} · ${m.src}` };
    }
    const s = pool[order[i % order.length]];
    return { src: await UI.imgData(s), place: "", name: `<i>${UI.esc(s.n)}</i>${s.de || s.en ? " · " + UI.esc(s.de || s.en) : ""}`, credit: `Foto: ${s.p.by || "siehe Quelle"} · ${LIC[s.p.l] || s.p.l} · ${s.p.src || "iNaturalist"}` };
  }
  const shuffle = (n) => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let pending = null;
  // Foto so setzen, dass der scharfe Motivbereich (die Mantis) vollständig und mittig zu sehen ist
  function place(L, img, item) {
    const el = L.querySelector(".ss-img"), W = box.clientWidth || innerWidth, H = box.clientHeight || innerHeight;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const b = (item.meta && item.meta.box) || [0.15, 0.15, 0.7, 0.7];
    const bx = b[0] * iw, by = b[1] * ih, bw = Math.max(1, b[2] * iw), bh = Math.max(1, b[3] * ih);
    const capH = 96, usableH = H - capH;                       // unten steht die Bildunterschrift
    const cover = Math.max(W / iw, H / ih);
    const fitBox = Math.min((W * 0.92) / bw, (usableH * 0.9) / bh);   // größter Maßstab, bei dem das Tier ganz drauf ist
    let s = cover;
    if (fitBox < cover) s = fitBox;                            // Tier wäre angeschnitten: herauszoomen
    else if (bw * cover < W * 0.5 && bh * cover < usableH * 0.5) s = Math.min(fitBox * 0.8, cover * 1.8);   // Tier klein: hineinzoomen
    s = Math.max(s, Math.min(W / iw, H / ih));                 // nie kleiner als ganz sichtbar
    const cx = bx + bw / 2, cy = by + bh / 2;
    let left = W / 2 - cx * s, top = usableH / 2 - cy * s;
    const dw = iw * s, dh = ih * s;
    // wenn das Foto den Bildschirm füllt: keine Ränder zeigen
    if (dw >= W) left = Math.min(0, Math.max(W - dw, left)); else left = (W - dw) / 2 + Math.max(-(W - dw) / 2, Math.min((W - dw) / 2, left - (W - dw) / 2)) * 0;
    if (dh >= H) top = Math.min(0, Math.max(H - dh, top)); else top = Math.max(0, Math.min(H - dh, top));
    if (dw < W) left = Math.max(0, Math.min(W - dw, W / 2 - cx * s));
    Object.assign(el.style, { width: dw + "px", height: dh + "px", left: left + "px", top: top + "px",
      transformOrigin: `${cx * s}px ${cy * s}px` });
    el.src = item.src;
  }
  async function next() {
    if (!running) return;
    let item;
    try { item = await (pending || source(pos)); } catch (e) { pos++; pending = null; timer = setTimeout(next, 300); return; }
    pos++; pending = source(pos).catch(() => null);            // nächstes Bild schon vorladen
    if (!running) return;
    const img = new Image();
    img.onload = () => {
      if (!running) return;
      cur = 1 - cur;
      const L = layers[cur];
      L.querySelector(".ss-bg").style.backgroundImage = `url("${item.src}")`;
      place(L, img, item);
      L.classList.remove("zoom"); void L.offsetWidth; L.classList.add("zoom");
      L.classList.add("on"); layers[1 - cur].classList.remove("on");
      document.getElementById("ss-name").innerHTML = item.name + (item.place ? `<span class="ss-land">📍 ${UI.esc(item.place)}</span>` : "");
      document.getElementById("ss-credit").textContent = item.credit;
      if (!paused) timer = setTimeout(next, 8000);
    };
    img.src = item.src;
  }
  async function start() {
    running = true; paused = false; showPause(); box.hidden = false; document.body.style.overflow = "hidden";
    keepAwake(); clearTimeout(endTimer); endTimer = setTimeout(stop, MAX_MS);
    try { const r = box.requestFullscreen && box.requestFullscreen(); if (r && r.catch) r.catch(() => {}); } catch (e) { /* Overlay reicht */ }
    try { await UI.loadScript("data/ss/index.js"); } catch (e) { /* noch keine Auswahl */ }
    curated = !!(window.MANTODEA_SS && window.MANTODEA_SS.length);
    if (!curated && !forceSmall) {
      // innerhalb von claude.ai dürfen keine Fotos von fremden Servern geladen werden -> Auswahl anbieten
      let ch = box.querySelector(".ss-choice");
      if (!ch) {
        ch = document.createElement("div"); ch.className = "ss-choice";
        ch.innerHTML = `<h3>🖼️ Bildschirmschoner</h3>
          <p>Originalfotos in voller Auflösung können innerhalb von claude.ai nicht live geladen werden. Die herunterladbare Version lädt sie live von iNaturalist, ohne sie zu speichern, und zeigt Art und Herkunftsland. Einfach die Datei im Browser öffnen, auch am Handy.</p>
          <button type="button" class="primary" data-ch="dl">⬇ Version mit Originalfotos herunterladen</button>
          <button type="button" data-ch="small">Hier mit kleineren Fotos starten</button>
          <button type="button" data-ch="close" class="link">Schließen</button>`;
        box.appendChild(ch);
        ch.addEventListener("click", (e) => {
          e.stopPropagation();
          const b = e.target.closest("[data-ch]"); if (!b) return;
          if (b.dataset.ch === "dl") db2.click();
          if (b.dataset.ch === "small") { ch.hidden = true; forceSmall = true; start(true); }
          if (b.dataset.ch === "close") stop();
        });
      }
      ch.hidden = false; db2.hidden = true; pb.hidden = true;
      document.getElementById("ss-name").textContent = ""; document.getElementById("ss-credit").textContent = "";
      return;
    }
    pb.hidden = false; db2.hidden = false;
    const ch0 = box.querySelector(".ss-choice"); if (ch0) ch0.hidden = true;
    order = shuffle(curated ? window.MANTODEA_SS.length : pool.length); pos = 0; pending = null;
    if (curated) {
      // Fotos, deren Format zum Bildschirm passt (füllen ihn ohne viel Beschnitt), kommen zuerst
      const sar = innerWidth / innerHeight;
      const fit = (i) => { const m = window.MANTODEA_SS[i], ar = (m.w || 4) / (m.h || 3); return Math.max(ar / sar, sar / ar); };
      order = order.filter((i) => fit(i) <= 1.6).concat(order.filter((i) => fit(i) > 1.6));
    }
    if (!order.length) return stop();
    next();
  }
  // Bildschirm wach halten (Wake-Lock), nach einer Stunde automatisch beenden
  const MAX_MS = 60 * 60 * 1000;
  let lock = null, endTimer = null, keepVideo = null;
  async function keepAwake() {
    try { if (navigator.wakeLock) { lock = await navigator.wakeLock.request("screen"); return; } } catch (e) { /* nicht erlaubt: Ersatz unten */ }
    // Ersatz für Browser ohne Wake-Lock: ein unsichtbares, stummes Mini-Video läuft mit
    try {
      if (!keepVideo) {
        const c = document.createElement("canvas"); c.width = c.height = 2;
        const g = c.getContext("2d"); let t = 0; setInterval(() => { if (running) { g.fillStyle = t++ % 2 ? "#000" : "#010101"; g.fillRect(0, 0, 2, 2); } }, 1000);
        keepVideo = Object.assign(document.createElement("video"), { muted: true, playsInline: true, loop: true });
        keepVideo.setAttribute("playsinline", ""); keepVideo.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none";
        keepVideo.srcObject = c.captureStream ? c.captureStream(1) : null;
        box.appendChild(keepVideo);
      }
      await keepVideo.play();
    } catch (e) { /* dann entscheidet das Gerät */ }
  }
  function releaseAwake() {
    try { if (lock) lock.release(); } catch (e) { /* egal */ }
    lock = null;
    try { if (keepVideo) keepVideo.pause(); } catch (e) { /* egal */ }
  }
  document.addEventListener("visibilitychange", () => { if (running && document.visibilityState === "visible") keepAwake(); });
  function stop() {
    if (!running) return;
    clearTimeout(endTimer); releaseAwake(); forceSmall = false;
    running = false; clearTimeout(timer); box.hidden = true; document.body.style.overflow = "";
    layers.forEach((l) => { l.classList.remove("on", "zoom"); l.querySelectorAll("div").forEach((d) => (d.style.backgroundImage = "")); const im = l.querySelector("img"); if (im) im.removeAttribute("src"); });
    try { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch (e) { /* egal */ }
  }
  btn.addEventListener("click", start);
  box.addEventListener("click", stop);
  document.addEventListener("keydown", (e) => { if (!running) return; e.preventDefault(); if (e.key === " " || e.key === "p" || e.key === "k") togglePause(); else stop(); });
  document.addEventListener("fullscreenchange", () => { if (running && !document.fullscreenElement) stop(); });
})();
