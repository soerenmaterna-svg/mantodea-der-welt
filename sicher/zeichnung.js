// Draufsicht einer Metallyticus-Gottesanbeterin (Kopf oben) als SVG.
// Das gefragte Körperteil wird eingefärbt, rot umrandet und mit Pfeil + Beschriftung markiert;
// alles andere bleibt grau, damit der Blick dorthin geht.
(() => {
  "use strict";
  const GRAU = "#cdd2d7", LINIE = "#3b4148";
  const DEF = `<defs>
    <linearGradient id="z-gruen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d5c45"/><stop offset=".45" stop-color="#3fcf8c"/><stop offset=".7" stop-color="#1b9a8a"/><stop offset="1" stop-color="#0a3f55"/></linearGradient>
    <linearGradient id="z-schwarz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1222"/><stop offset=".5" stop-color="#2d4c7c"/><stop offset="1" stop-color="#0a0f1c"/></linearGradient>
    <linearGradient id="z-gelb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86d22"/><stop offset=".5" stop-color="#e6b867"/><stop offset="1" stop-color="#9a6320"/></linearGradient>
    <linearGradient id="z-blau" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a2f6b"/><stop offset=".5" stop-color="#4a6fc0"/><stop offset="1" stop-color="#14204a"/></linearGradient>
    <filter id="z-glow"><feGaussianBlur stdDeviation="1.6"/></filter>
  </defs>`;
  const FILL = { gruen: "url(#z-gruen)", schwarz: "url(#z-schwarz)", gelb: "url(#z-gelb)", blau: "url(#z-blau)", rauch: "rgba(78,62,46,.72)", klar: "rgba(225,238,248,.35)" };
  const ROT = "#d62828";

  // Teile der linken Körperhälfte (rechte wird gespiegelt)
  const P = {
    mittelSchenkel: "M99 110 C84 104 62 96 46 92",
    mittelSchiene: "M46 92 C38 82 28 72 20 62 L12 50",
    hinterSchenkel: "M101 142 C86 154 62 168 44 178",
    hinterSchiene: "M44 178 C38 198 30 220 22 238 L15 262",
    hinterfluegel: "M100 112 C66 116 30 150 18 196 C16 214 28 230 48 232 C70 234 92 214 104 196 Z",
    huefte: "M84 55 C77 70 78 91 86 103 C94 107 99 98 99 87 C99 71 95 59 90 53 Z",
    schenkel: "M80 40 C64 48 55 72 58 98 C61 111 74 113 79 104 C86 90 89 62 80 40 Z",
    saum: "M79 42 C66 50 58 72 60 96",
    schiene: "M80 40 C78 30 74 22 70 14",
    fuss: "M70 14 C66 9 60 5 53 3",
    fuehler: "M111 22 C100 10 82 4 56 1",
  };
  const DORNEN = [[78, 50], [80, 58], [81, 66], [81, 74], [80, 82]].map(([x, y]) => `<path d="M${x} ${y} l7 -2 l-6 5" fill="${LINIE}"/>`).join("")
    + [[76, 34], [74, 28], [72, 22]].map(([x, y]) => `<path d="M${x} ${y} l6 1 l-5 3" fill="${LINIE}"/>`).join("");

  function pfeil(x1, y1, x2, y2, t, lx, ly, anker) {
    const a = Math.atan2(y2 - y1, x2 - x1), L = 9;
    const p1 = [x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)], p2 = [x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45)];
    const linie = `M${x1} ${y1} L${(x2 - 6 * Math.cos(a)).toFixed(1)} ${(y2 - 6 * Math.sin(a)).toFixed(1)}`;
    const kopf = `M${x2} ${y2} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z`;
    return `<g class="z-pfeil"><path d="${linie}" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="${kopf}" fill="#fff" stroke="#fff" stroke-width="3"/>
      <path d="${linie}" stroke="${ROT}" stroke-width="3" stroke-linecap="round"/><path d="${kopf}" fill="${ROT}"/>
      ${t ? `<text x="${lx}" y="${ly}" text-anchor="${anker || "middle"}" class="z-txt" stroke="#fff" stroke-width="5" paint-order="stroke">${t}</text>` : ""}</g>`;
  }

  // o: { teil, farbe }   teil: fangbein | huefte | schenkel | hinterfluegel | zeichnung | koerper | hals
  function metallyticus(o = {}) {
    const teil = o.teil || "", f = o.farbe || "";
    const ganz = teil === "koerper";
    const kF = ganz ? FILL.gruen : GRAU; // Körpergrundfarbe
    const beinF = (t) => {
      if (ganz) return t === "fang" ? FILL.gruen : "#b83a2a";
      if (teil === "zeichnung" && t === "fang") return FILL.schwarz;
      if ((teil === "fangbein" || teil === "schenkel") && t === "fang") return FILL[f] || GRAU;
      return GRAU;
    };
    const hueftF = ganz ? FILL.gruen : teil === "fangbein" ? (f === "gruen" ? FILL.gruen : FILL.gelb) : GRAU;
    const halsF = ganz ? FILL.gruen : teil === "hals" ? FILL.gruen : teil === "zeichnung" ? FILL.schwarz : GRAU;
    const hl = (on) => (on ? ` stroke="${ROT}" stroke-width="2.6"` : ` stroke="${LINIE}" stroke-width="1.1"`);
    const S = `stroke="${LINIE}" stroke-width="1.1" stroke-linejoin="round"`;
    const halbe = (rechts) => {
      const g = [];
      g.push(`<path d="${P.fuehler}" fill="none" ${S}/>`);
      // Mittel- und Hinterbein
      g.push(`<path d="${P.mittelSchenkel}" stroke="${LINIE}" stroke-width="8.5" stroke-linecap="round" fill="none"/><path d="${P.mittelSchenkel}" stroke="${beinF("mitte")}" stroke-width="6.5" stroke-linecap="round" fill="none"/>`);
      g.push(`<path d="${P.mittelSchiene}" stroke="${LINIE}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`);
      g.push(`<path d="${P.hinterSchenkel}" stroke="${LINIE}" stroke-width="9.5" stroke-linecap="round" fill="none"/><path d="${P.hinterSchenkel}" stroke="${beinF("hinten")}" stroke-width="7.5" stroke-linecap="round" fill="none"/>`);
      g.push(`<path d="${P.hinterSchiene}" stroke="${LINIE}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`);
      // ausgebreiteter Hinterflügel (nur links, nur wenn gefragt)
      if (teil === "hinterfluegel" && !rechts) {
        g.push(`<path d="${P.hinterfluegel}" fill="${FILL[f] || FILL.klar}"${hl(true)}/>`);
        for (let i = 0; i < 9; i++) { const t = i / 8; const ex = 20 + t * 82, ey = 200 + Math.sin(t * Math.PI) * 30 - t * 8; g.push(`<path d="M100 114 Q${(60 + t * 30).toFixed(0)} ${(150 + t * 30).toFixed(0)} ${ex.toFixed(0)} ${ey.toFixed(0)}" fill="none" stroke="${f === "rauch" ? "#2c2219" : "#7d8a96"}" stroke-width=".7"/>`); }
      }
      // Fangbein: Hüfte, Schenkel, Schiene mit Dornen
      g.push(`<path d="${P.schiene}" stroke="${LINIE}" stroke-width="4" stroke-linecap="round" fill="none"/><path d="${P.fuss}" stroke="${LINIE}" stroke-width="2" stroke-linecap="round" fill="none"/>`);
      g.push(`<path d="${P.schenkel}" fill="${beinF("fang")}"${hl(teil === "schenkel" || (teil === "zeichnung" && !rechts) || teil === "fangbein")}/>`);
      if (teil === "zeichnung" && f === "gelb") g.push(`<path d="${P.saum}" stroke="#f0c15a" stroke-width="3.2" fill="none" stroke-linecap="round"/>`);
      g.push(DORNEN);
      g.push(`<path d="${P.huefte}" fill="${hueftF}"${hl(teil === "fangbein")}/>`);
      return g.join("");
    };
    const k = [];
    k.push(DEF);
    k.push(`<g>${halbe(false)}</g><g transform="translate(240 0) scale(-1 1)">${halbe(true)}</g>`);
    // Hinterleibsspitze, Cerci
    k.push(`<path d="M106 250 C108 276 132 276 134 250" fill="${kF}" ${S}/><path d="M114 272 l-7 16 M126 272 l7 16" stroke="${LINIE}" stroke-width="1.6" stroke-linecap="round"/>`);
    // Deckflügel
    const deckF = ganz ? FILL.blau : GRAU;
    k.push(`<path d="M97 98 C88 150 92 226 120 266 C148 226 152 150 143 98 C134 104 106 104 97 98 Z" fill="${deckF}" ${S}/><path d="M120 103 L120 264" stroke="${LINIE}" stroke-width=".9"/>`);
    for (let i = 0; i < 6; i++) k.push(`<path d="M${104 - i} ${118 + i * 22} q8 6 14 4 M${136 + i} ${118 + i * 22} q-8 6 -14 4" stroke="${LINIE}" stroke-width=".45" fill="none" opacity=".6"/>`);
    // Halsschild: kurz und breit
    k.push(`<path d="M100 50 C108 46 132 46 140 50 C146 62 148 80 146 96 C136 102 104 102 94 96 C92 80 94 62 100 50 Z" fill="${halsF}"${hl(teil === "hals")}/><path d="M120 51 L120 99" stroke="${LINIE}" stroke-width=".8"/>`);
    if (teil === "zeichnung" && f === "gelb") k.push(`<ellipse cx="109" cy="95" rx="7" ry="3.2" fill="#f0c15a" stroke="${ROT}" stroke-width="1.4"/><ellipse cx="131" cy="95" rx="7" ry="3.2" fill="#f0c15a" stroke="${ROT}" stroke-width="1.4"/>`);
    if (teil === "zeichnung" && f !== "gelb") k.push(`<path d="M98 95 C108 101 132 101 142 95" stroke="${ROT}" stroke-width="2" fill="none" stroke-dasharray="3 2"/>`);
    // Kopf mit großen Augen
    k.push(`<path d="M104 22 C112 15 128 15 136 22 L139 40 C132 50 108 50 101 40 Z" fill="${ganz ? FILL.gruen : GRAU}" ${S}/>`);
    k.push(`<circle cx="97" cy="31" r="12" fill="#2a2522" stroke="${LINIE}"/><circle cx="143" cy="31" r="12" fill="#2a2522" stroke="${LINIE}"/><circle cx="93" cy="27" r="3" fill="#fff" opacity=".7"/><circle cx="139" cy="27" r="3" fill="#fff" opacity=".7"/>`);
    // Pfeile
    const A = {
      fangbein: () => pfeil(30, 130, 89, 88, "Hüfte", 8, 146, "start"),
      schenkel: () => pfeil(28, 128, 64, 88, "Schenkel", 6, 144, "start"),
      hinterfluegel: () => pfeil(30, 280, 50, 222, "Hinterflügel", 34, 296),
      zeichnung: () => pfeil(30, 128, 60, 84, f === "gelb" ? "gelber Saum" : "kein Saum", 6, 144, "start") + pfeil(196, 128, 136, 97, f === "gelb" ? "2 Flecken" : "keine Flecken", 234, 144, "end"),
      hals: () => pfeil(200, 130, 146, 80, "Halsschild", 204, 146),
      koerper: () => "",
    };
    if (A[teil]) k.push(A[teil]());
    return `<svg viewBox="0 0 240 300" class="z-svg" role="img" aria-label="Zeichnung: Gottesanbeterin von oben">${k.join("")}</svg>`;
  }
  window.SZEICH = { metallyticus };
})();
