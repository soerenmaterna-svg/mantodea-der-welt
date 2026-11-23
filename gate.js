/* Passwort-Abfrage für "Mantodea der Welt" – Urwald-Eingangsseite.
   Wird als erstes Script im <head> jeder Seite geladen.
   Hinweis: Das ist eine Zugangssperre im Browser, keine echte Verschlüsselung. */
(function () {
  var HASH = "fdd8e42d29b86dc391c61f57c41e97f365e9bb8ad3636ffce8bd43dad1d3babf";
  var KEY = "mdw-zugang";
  var doc = document, root = doc.documentElement;

  function gespeichert() {
    try { return localStorage.getItem(KEY) === HASH; } catch (e) {}
    try { return sessionStorage.getItem(KEY) === HASH; } catch (e2) {}
    return false;
  }
  function merken() {
    try { localStorage.setItem(KEY, HASH); } catch (e) {}
    try { sessionStorage.setItem(KEY, HASH); } catch (e2) {}
  }
  if (gespeichert()) return;

  /* ---------- SHA-256 (ohne Abhängigkeiten, läuft auch auf alten TV-Browsern) ---------- */
  function sha256(str) {
    function rr(n, x) { return (x >>> n) | (x << (32 - n)); }
    var K = [], H = [], p = 0, c = 2, i, j;
    function frac(x) { return ((x - Math.floor(x)) * 4294967296) | 0; }
    while (p < 64) {
      var prim = true;
      for (i = 2; i * i <= c; i++) if (c % i === 0) { prim = false; break; }
      if (prim) { if (p < 8) H[p] = frac(Math.pow(c, 1 / 2)); K[p] = frac(Math.pow(c, 1 / 3)); p++; }
      c++;
    }
    var utf = unescape(encodeURIComponent(str)), bytes = [];
    for (i = 0; i < utf.length; i++) bytes.push(utf.charCodeAt(i));
    var bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (i = 7; i >= 0; i--) bytes.push(i > 3 ? 0 : (bitLen >>> (i * 8)) & 255);
    var w = [];
    for (j = 0; j < bytes.length; j += 64) {
      for (i = 0; i < 16; i++) w[i] = (bytes[j + i * 4] << 24) | (bytes[j + i * 4 + 1] << 16) | (bytes[j + i * 4 + 2] << 8) | bytes[j + i * 4 + 3];
      for (i = 16; i < 64; i++) {
        var s0 = rr(7, w[i - 15]) ^ rr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
        var s1 = rr(17, w[i - 2]) ^ rr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], cc = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var t1 = (h + (rr(6, e) ^ rr(11, e) ^ rr(25, e)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        var t2 = ((rr(2, a) ^ rr(13, a) ^ rr(22, a)) + ((a & b) ^ (a & cc) ^ (b & cc))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + cc) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = "";
    for (i = 0; i < 8; i++) out += ("00000000" + (H[i] >>> 0).toString(16)).slice(-8);
    return out;
  }

  /* ---------- Seite verstecken, bis entsperrt ---------- */
  var css = doc.createElement("style");
  css.id = "mdw-gate-css";
  css.textContent =
    "#mdw-gate{position:fixed;inset:0;top:0;left:0;right:0;bottom:0;z-index:2147483647;overflow:hidden;" +
    "font-family:Georgia,'Iowan Old Style','Palatino Linotype',serif;color:#eef5e4;" +
    "background:radial-gradient(ellipse at 50% 42%,#2f6b35 0%,#17401d 38%,#0a2410 70%,#04140a 100%);}" +
    "#mdw-gate .licht{position:absolute;top:-20%;width:18%;height:140%;" +
    "background:linear-gradient(180deg,rgba(235,255,200,.16),rgba(235,255,200,0) 75%);transform:rotate(18deg);" +
    "filter:blur(6px);animation:mdwLicht 9s ease-in-out infinite alternate}" +
    "#mdw-gate .nebel{position:absolute;left:-10%;right:-10%;bottom:-8%;height:45%;" +
    "background:radial-gradient(ellipse at 50% 100%,rgba(190,230,180,.18),rgba(190,230,180,0) 70%)}" +
    "#mdw-gate .blatt{position:absolute;transform-origin:0 50%;will-change:transform;" +
    "animation:mdwWiegen ease-in-out infinite alternate}" +
    "#mdw-gate .blatt svg{display:block;width:100%;height:100%;overflow:visible;" +
    "filter:drop-shadow(0 10px 14px rgba(0,0,0,.45))}" +
    "#mdw-gate .karte{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);" +
    "width:min(380px,86vw);box-sizing:border-box;padding:34px 30px 28px;text-align:center;border-radius:22px;" +
    "background:rgba(10,34,16,.58);-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);" +
    "border:1px solid rgba(214,240,180,.22);box-shadow:0 30px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.08)}" +
    "#mdw-gate .karte.wackeln{animation:mdwWackeln .45s}" +
    "#mdw-gate .icon{width:74px;height:74px;margin:0 auto 10px;display:block}" +
    "#mdw-gate h1{margin:0 0 4px;font-size:1.7rem;font-weight:normal;letter-spacing:.02em;color:#f4fbe8}" +
    "#mdw-gate .unter{margin:0 0 22px;font-size:.95rem;font-style:italic;color:#b9d6a2}" +
    "#mdw-gate input{width:100%;box-sizing:border-box;padding:13px 16px;font-size:1.05rem;font-family:inherit;" +
    "color:#f4fbe8;background:rgba(0,0,0,.32);border:1px solid rgba(214,240,180,.3);border-radius:12px;outline:none;" +
    "text-align:center;letter-spacing:.08em;transition:border-color .2s,box-shadow .2s}" +
    "#mdw-gate input::placeholder{color:rgba(214,240,180,.5);letter-spacing:.02em}" +
    "#mdw-gate input:focus{border-color:#a9d97a;box-shadow:0 0 0 3px rgba(169,217,122,.25)}" +
    "#mdw-gate button{margin-top:12px;width:100%;padding:13px;font-size:1.05rem;font-family:inherit;cursor:pointer;" +
    "color:#0f2a13;background:linear-gradient(180deg,#c6ec8f,#8fc75a);border:0;border-radius:12px;font-weight:bold;" +
    "letter-spacing:.03em;box-shadow:0 6px 18px rgba(120,190,70,.35);transition:transform .1s,filter .2s}" +
    "#mdw-gate button:hover{filter:brightness(1.07)}#mdw-gate button:active{transform:scale(.98)}" +
    "#mdw-gate .fehler{min-height:1.3em;margin:12px 0 0;font-size:.9rem;color:#ffc9a8}" +
    "#mdw-gate.offen{animation:mdwAuf .7s ease forwards}" +
    "@keyframes mdwWiegen{from{transform:rotate(var(--r)) }to{transform:rotate(calc(var(--r) + var(--s)))}}" +
    "@keyframes mdwLicht{from{opacity:.5}to{opacity:1}}" +
    "@keyframes mdwWackeln{0%,100%{transform:translate(-50%,-50%)}20%,60%{transform:translate(calc(-50% - 9px),-50%)}40%,80%{transform:translate(calc(-50% + 9px),-50%)}}" +
    "@keyframes mdwAuf{to{opacity:0;transform:scale(1.08)}}" +
    "@media (prefers-reduced-motion:reduce){#mdw-gate .blatt,#mdw-gate .licht{animation:none}}";
  (doc.head || root).appendChild(css);

  /* ---------- Blätter ---------- */
  var NS = "http://www.w3.org/2000/svg", uid = 0;
  var GRUEN = [["#2f7a2c", "#1b4d1c"], ["#3f8f35", "#215a22"], ["#5aa83f", "#2c6a26"], ["#24622a", "#0f3815"], ["#6cb648", "#356f28"], ["#1f5a33", "#0c2f1b"]];

  function breitesBlatt(f, loecher) {
    var id = "g" + (++uid), s = '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + f[0] + '"/><stop offset="1" stop-color="' + f[1] + '"/></linearGradient>';
    var maske = "";
    if (loecher) {
      var m = "m" + uid;
      s += '<mask id="' + m + '"><rect x="-10" y="-10" width="320" height="140" fill="#fff"/>';
      for (var i = 0; i < 6; i++) {
        var x = 70 + i * 34, tiefe = 30 - i * 2;
        s += '<path d="M' + x + ',0 Q' + (x + 6) + ',' + (60 - tiefe) + ' ' + (x - 8) + ',' + (60 - tiefe + 6) + '" stroke="#000" stroke-width="7" stroke-linecap="round" fill="none"/>';
        s += '<path d="M' + x + ',120 Q' + (x + 6) + ',' + (60 + tiefe) + ' ' + (x - 8) + ',' + (60 + tiefe - 6) + '" stroke="#000" stroke-width="7" stroke-linecap="round" fill="none"/>';
        if (i % 2 === 0) s += '<ellipse cx="' + (x + 14) + '" cy="' + (i % 4 ? 42 : 79) + '" rx="7" ry="4" fill="#000"/>';
      }
      s += "</mask>";
      maske = ' mask="url(#' + m + ')"';
    }
    s += "</defs><g" + maske + '><path d="M0,60 C55,-4 205,-10 300,60 C205,130 55,124 0,60Z" fill="url(#' + id + ')"/>';
    s += '<path d="M0,60 Q150,56 298,60" stroke="rgba(220,250,180,.45)" stroke-width="2.4" fill="none"/>';
    for (var v = 1; v < 9; v++) {
      var vx = v * 32;
      s += '<path d="M' + vx + ',59 Q' + (vx + 26) + ',36 ' + (vx + 40) + ',' + (16 + v * 2) + '" stroke="rgba(220,250,180,.2)" stroke-width="1.2" fill="none"/>';
      s += '<path d="M' + vx + ',61 Q' + (vx + 26) + ',84 ' + (vx + 40) + ',' + (104 - v * 2) + '" stroke="rgba(220,250,180,.2)" stroke-width="1.2" fill="none"/>';
    }
    return s + "</g>";
  }

  function farn(f) {
    var s = '<path d="M0,60 Q150,40 300,62" stroke="' + f[1] + '" stroke-width="3" fill="none"/>';
    for (var i = 0; i < 22; i++) {
      var t = i / 22, x = 10 + t * 280, y = 60 - Math.sin(t * Math.PI) * 14 * (1 - t * 0.3);
      var l = 46 * (1 - t * 0.8);
      s += '<ellipse cx="' + (x + 4) + '" cy="' + (y - l / 2) + '" rx="5.5" ry="' + (l / 2) + '" fill="' + f[i % 2] + '" transform="rotate(32 ' + x + ' ' + y + ')"/>';
      s += '<ellipse cx="' + (x + 4) + '" cy="' + (y + l / 2) + '" rx="5.5" ry="' + (l / 2) + '" fill="' + f[(i + 1) % 2] + '" transform="rotate(-32 ' + x + ' ' + y + ')"/>';
    }
    return s;
  }

  function palme(f) {
    var s = '<path d="M0,60 Q160,48 300,70" stroke="' + f[1] + '" stroke-width="4" fill="none"/>';
    for (var i = 0; i < 16; i++) {
      var t = i / 16, x = 20 + t * 270, y = 60 - t * 6 + t * t * 14, l = 78 * (1 - t * 0.6);
      s += '<path d="M' + x + ',' + y + ' Q' + (x + l * 0.5) + ',' + (y - l * 0.9) + ' ' + (x + l * 0.95) + ',' + (y - l * 0.55) + ' Q' + (x + l * 0.4) + ',' + (y - l * 0.6) + ' ' + x + ',' + y + 'Z" fill="' + f[0] + '"/>';
      s += '<path d="M' + x + ',' + y + ' Q' + (x + l * 0.5) + ',' + (y + l * 0.9) + ' ' + (x + l * 0.95) + ',' + (y + l * 0.55) + ' Q' + (x + l * 0.4) + ',' + (y + l * 0.6) + ' ' + x + ',' + y + 'Z" fill="' + f[1] + '"/>';
    }
    return s;
  }

  /* Position: x,y in % der Fläche (Blattansatz), Länge in vmax, Winkel, Typ, Farbe */
  var BLAETTER = [
    [-4, 8, 46, 18, "m", 3], [-6, 32, 40, -8, "p", 0], [-3, 70, 44, -22, "b", 1], [-5, 95, 50, -38, "f", 5],
    [104, 6, 46, 160, "f", 3], [106, 30, 42, 190, "m", 1], [104, 66, 46, 202, "p", 4], [105, 96, 52, 218, "b", 0],
    [20, -6, 34, 72, "f", 2], [48, -8, 30, 96, "b", 3], [78, -6, 34, 112, "p", 1],
    [18, 106, 36, -70, "b", 5], [50, 108, 32, -92, "m", 2], [82, 106, 36, -112, "f", 0],
    [-2, 50, 28, 6, "f", 4], [102, 48, 30, 176, "b", 2]
  ];

  function baueGate() {
    if (doc.getElementById("mdw-gate")) return;
    var g = doc.createElement("div");
    g.id = "mdw-gate";
    g.setAttribute("role", "dialog");
    g.setAttribute("aria-label", "Passwort-Abfrage");
    var html = '<div class="licht" style="left:18%"></div><div class="licht" style="left:52%;animation-delay:-4s;width:12%"></div><div class="nebel"></div>';
    for (var i = 0; i < BLAETTER.length; i++) {
      var b = BLAETTER[i], f = GRUEN[b[5]], inhalt;
      if (b[4] === "f") inhalt = farn(f);
      else if (b[4] === "p") inhalt = palme(f);
      else inhalt = breitesBlatt(f, b[4] === "m");
      var dauer = 5 + (i * 1.7) % 4, schwung = (i % 2 ? 3 : -3) + "deg";
      html += '<div class="blatt" style="left:' + b[0] + '%;top:' + b[1] + '%;width:' + b[2] + 'vmax;height:' + (b[2] * 0.4) + 'vmax;' +
        'margin-top:-' + (b[2] * 0.2) + 'vmax;--r:' + b[3] + 'deg;--s:' + schwung + ';transform:rotate(' + b[3] + 'deg);' +
        'animation-duration:' + dauer + 's;animation-delay:-' + (i % 5) + 's">' +
        '<svg xmlns="' + NS + '" viewBox="0 0 300 120" preserveAspectRatio="none">' + inhalt + "</svg></div>";
    }
    html += '<form class="karte" autocomplete="off">' +
      '<svg class="icon" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="38" fill="rgba(198,236,143,.12)" stroke="rgba(198,236,143,.45)"/>' +
      '<g stroke="#c6ec8f" stroke-width="2.4" stroke-linecap="round" fill="none">' +
      '<path d="M30,58 Q38,44 44,30"/><path d="M44,30 l6,-6"/><path d="M50,24 l-3,-6 M50,24 l5,-4"/>' +
      '<path d="M44,32 q8,2 10,10 l-6,-2"/><path d="M42,36 q-8,0 -10,8 l5,-1"/>' +
      '<path d="M34,52 l-8,12 M36,50 l2,14 M32,55 l-10,4"/></g>' +
      '<circle cx="51" cy="22" r="2.6" fill="#c6ec8f"/></svg>' +
      "<h1>Mantodea der Welt</h1><p class=\"unter\">Der Weg durch den Urwald ist geschützt</p>" +
      '<input type="password" placeholder="Passwort" aria-label="Passwort" autocapitalize="off" autocorrect="off" spellcheck="false">' +
      '<button type="submit">Eintreten</button><p class="fehler" aria-live="polite"></p></form>';
    g.innerHTML = html;
    root.appendChild(g);

    var form = g.querySelector("form"), feld = g.querySelector("input"), fehler = g.querySelector(".fehler");
    setTimeout(function () { try { feld.focus(); } catch (e) {} }, 60);
    form.onsubmit = function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      if (sha256(feld.value) === HASH) {
        merken();
        window.MANTODEA_GAST = null;
        root.className = root.className.replace(/\s*mdw-gast\b/g, "");
        if (hide.parentNode) hide.parentNode.removeChild(hide);
        fehler.textContent = "";
        g.className = "offen";
        var s = doc.getElementById("mdw-gate-css");
        setTimeout(function () {
          if (g.parentNode) g.parentNode.removeChild(g);
          if (s) s.textContent = "";
          try { window.dispatchEvent(new Event("resize")); } catch (e) {}
        }, 650);
      } else {
        fehler.textContent = "Falsches Passwort – versuch es noch einmal.";
        form.className = "karte";
        void form.offsetWidth;
        form.className = "karte wackeln";
        feld.select();
      }
      return false;
    };
  }

  var GATE_CSS = css.textContent;
  var hide = doc.createElement("style");
  hide.id = "mdw-gate-hide";
  hide.textContent = "body{display:none!important}";
  function zeigen() {
    if (!hide.parentNode) (doc.head || root).appendChild(hide);
    var s = doc.getElementById("mdw-gate-css"); if (s && !s.textContent) s.textContent = GATE_CSS;
    baueGate();
  }
  // Gastansicht: geteilter Link auf eine Art (#art=...) – ohne Passwort nur diese Art; alles andere führt zur Passwort-Abfrage
  var m = /^#art=([^&]+)/.exec(location.hash || "");
  window.MANTODEA_GATE = { zeigen: zeigen };
  if (m) {
    window.MANTODEA_GAST = decodeURIComponent(m[1]);
    root.className += " mdw-gast";
  } else {
    (doc.head || root).appendChild(hide);
    baueGate();
  }
})();
