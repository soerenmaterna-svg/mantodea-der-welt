// Strichzeichnungen für den Bestimmungsschlüssel (Bildtafel-Stil: schwarz-weiß, roter Pfeil auf das Merkmal).
// MBILD.svg(code) liefert ein SVG. Codes: "teil:zustand", z. B. "auge:kegel", "hals:blatt", "karte:AF".
// MBILD.auto(text) wählt aus dem Text eines Schlüsselpunkts eine passende Zeichnung.
(() => {
  "use strict";
  const W = 240, H = 150;
  const S = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
  const F = 'fill="var(--tafel-fill,#fff)" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"';
  const HL = 'fill="none" stroke="#d62d20" stroke-width="5" stroke-opacity=".28" stroke-linecap="round" stroke-linejoin="round"';
  const RED = "#d62d20";
  const wrap = (inner, vb) => `<svg viewBox="${vb || `0 0 ${W} ${H}`}" xmlns="http://www.w3.org/2000/svg" class="tafel-svg" role="img">${inner}</svg>`;
  // Pfeil von (x1,y1) nach (x2,y2)
  const arrow = (x1, y1, x2, y2) => {
    const a = Math.atan2(y2 - y1, x2 - x1), l = 8;
    const p1 = [x2 - l * Math.cos(a - 0.45), y2 - l * Math.sin(a - 0.45)], p2 = [x2 - l * Math.cos(a + 0.45), y2 - l * Math.sin(a + 0.45)];
    return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${RED}" stroke-width="2.2" fill="none"/><path d="M${x2} ${y2}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}Z" fill="${RED}"/>`;
  };
  const txt = (x, y, t, size, anchor) => `<text x="${x}" y="${y}" font-size="${size || 11}" text-anchor="${anchor || "middle"}" fill="currentColor" font-family="system-ui,sans-serif">${t}</text>`;
  const spines = (x1, y1, x2, y2, n, len, side, color) => {
    let s = "";
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1), x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
      const a = Math.atan2(y2 - y1, x2 - x1) + (side || 1) * Math.PI / 2;
      s += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}l${(Math.cos(a) * len).toFixed(1)} ${(Math.sin(a) * len).toFixed(1)}" stroke="${color || "currentColor"}" stroke-width="1.4"/>`;
    }
    return s;
  };

  // Kleine Dornen (Dreiecke) entlang einer Strecke
  const thorns = (x1, y1, x2, y2, n, len, side, opt = {}) => {
    let s = "";
    const a = Math.atan2(y2 - y1, x2 - x1), nx = Math.cos(a + side * Math.PI / 2), ny = Math.sin(a + side * Math.PI / 2);
    const tx = Math.cos(a), ty = Math.sin(a);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
      const L = len * (opt.alt && i % 2 ? 0.55 : 1), w = 1.3 * (L / len + 0.4);
      const tipx = x + nx * L + tx * L * 0.35, tipy = y + ny * L + ty * L * 0.35;
      s += `<path d="M${(x - tx * w).toFixed(1)} ${(y - ty * w).toFixed(1)}L${tipx.toFixed(1)} ${tipy.toFixed(1)}L${(x + tx * w).toFixed(1)} ${(y + ty * w).toFixed(1)}Z" fill="${opt.dark ? "currentColor" : "var(--tafel-fill,#fff)"}" stroke="currentColor" stroke-width="0.9" stroke-linejoin="round"/>`;
    }
    return s;
  };
  // gegliederter Fuß (Tarsus) von (x,y) in Richtung (dx,dy), 5 Glieder + Klauen
  const tarsus = (x, y, dx, dy, len) => {
    const l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l; let s = "", cx = x, cy = y;
    const parts = [0.34, 0.16, 0.13, 0.11, 0.26];
    parts.forEach((f) => { const nx = cx + ux * len * f, ny = cy + uy * len * f; s += `<path d="M${cx.toFixed(1)} ${cy.toFixed(1)}L${nx.toFixed(1)} ${ny.toFixed(1)}" ${S} stroke-width="2.2"/><circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="1" fill="currentColor"/>`; cx = nx; cy = ny; });
    s += `<path d="M${cx.toFixed(1)} ${cy.toFixed(1)}q${(ux * 4 - uy * 3).toFixed(1)} ${(uy * 4 + ux * 3).toFixed(1)} ${(ux * 2 - uy * 5).toFixed(1)} ${(uy * 2 + ux * 5).toFixed(1)}" ${S} stroke-width="1"/>`;
    return s;
  };
  // Laufbein: Hüfte (x0,y0) -> Knie (x1,y1) -> Schienenende (x2,y2), Fuß-Richtung (fx,fy)
  const leg = (x0, y0, x1, y1, x2, y2, fx, fy, o = {}) => {
    let s = "";
    const fw = o.w || 3.4;
    const seg = (ax, ay, bx, by, w1, w2) => {
      const a = Math.atan2(by - ay, bx - ax), nx = -Math.sin(a), ny = Math.cos(a);
      return `<path d="M${(ax + nx * w1).toFixed(1)} ${(ay + ny * w1).toFixed(1)} C${(ax + (bx - ax) * .4 + nx * w1 * 1.15).toFixed(1)} ${(ay + (by - ay) * .4 + ny * w1 * 1.15).toFixed(1)} ${(ax + (bx - ax) * .8 + nx * w2).toFixed(1)} ${(ay + (by - ay) * .8 + ny * w2).toFixed(1)} ${(bx + nx * w2).toFixed(1)} ${(by + ny * w2).toFixed(1)} L${(bx - nx * w2).toFixed(1)} ${(by - ny * w2).toFixed(1)} C${(ax + (bx - ax) * .8 - nx * w2).toFixed(1)} ${(ay + (by - ay) * .8 - ny * w2).toFixed(1)} ${(ax + (bx - ax) * .4 - nx * w1 * 1.15).toFixed(1)} ${(ay + (by - ay) * .4 - ny * w1 * 1.15).toFixed(1)} ${(ax - nx * w1).toFixed(1)} ${(ay - ny * w1).toFixed(1)} Z" ${F} stroke-width="1.2"/>`;
    };
    s += seg(x0, y0, x1, y1, fw, fw * 0.7);
    if (o.lappen) { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2; s += `<path d="M${mx - 7} ${my - 2} C${mx - 6} ${my + 12} ${mx + 8} ${my + 12} ${mx + 7} ${my + 1}" ${F} stroke-width="1.1"/>`; }
    if (o.ring) { for (let t = 0.25; t < 0.9; t += 0.25) { const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(fw * 0.9).toFixed(1)}" fill="currentColor" fill-opacity=".75"/>`; } }
    s += seg(x1, y1, x2, y2, fw * 0.6, fw * 0.45);
    s += `<circle cx="${x1}" cy="${y1}" r="${(fw * 0.6).toFixed(1)}" ${F} stroke-width="1"/>`;
    s += tarsus(x2, y2, fx, fy, o.tl || 16);
    return s;
  };

  // ---------- Ganzes Tier, Seitenansicht (Kopf links), nach dem Bauplan von Mantis religiosa
  function habitus(o = {}) {
    const p = [];
    const hl = o.hl || "";
    // Hinterbeine (hinter dem Körper)
    p.push(leg(166, 82, 196, 112, 226, 146, 14, 4, { lappen: o.beinlappen, ring: o.beinring }));
    p.push(leg(146, 80, 128, 112, 108, 144, -10, 6, { lappen: o.beinlappen, ring: o.beinring }));
    // Hinterleib (unter den Flügeln) mit Segmenten
    const abd = o.leibbreit
      ? "M138 70 C170 62 230 66 262 74 C272 78 272 88 262 92 C228 100 170 96 140 86 Z"
      : "M138 70 C170 66 232 70 262 76 C270 79 270 85 262 87 C230 92 170 90 140 82 Z";
    p.push(`<path d="${abd}" ${F}/>`);
    for (let x = 156; x < 262; x += 15) p.push(`<path d="M${x} ${70 + (x - 138) * 0.04} C${x + 2} ${76 + (x - 138) * 0.03} ${x + 2} ${82} ${x} ${86 + (x - 138) * 0.02}" ${S} stroke-width=".8"/>`);
    if (o.leiblappen) for (let x = 160; x < 255; x += 15) p.push(`<path d="M${x} ${87} C${x + 2} ${96} ${x + 12} ${96} ${x + 12} ${88}" ${F} stroke-width="1"/>`);
    // Cerci, gegliedert
    if (o.cerciblatt) p.push(`<path d="M264 80 C276 74 292 78 294 86 C286 90 272 88 264 84 Z" ${F}/>`);
    else { p.push(`<path d="M264 81 C272 82 282 84 292 88" ${S} stroke-width="1.6"/>`); for (let i = 1; i < 6; i++) p.push(`<circle cx="${264 + i * 4.6}" cy="${81 + i * 1.25}" r=".9" fill="currentColor"/>`); }
    // Flügel
    if (o.fluegel === "fehlt") {
      // nichts: Rücken der Brust sichtbar
    } else if (o.fluegel === "kurz") {
      p.push(`<path d="M132 64 C150 56 176 56 190 64 C186 72 160 76 136 72 Z" ${F}/><path d="M138 66 C156 62 172 62 186 65" ${S} stroke-width=".8"/>`);
    } else {
      p.push(`<path d="M130 62 C160 50 214 50 252 58 C268 62 276 68 270 74 C250 80 200 80 160 76 C146 74 134 70 130 62 Z" ${F}/>`);
      // Adern: Costa, Radius, Media, Cubitus, Analader
      p.push(`<path d="M134 62 C170 54 220 54 262 62 M140 66 C176 62 224 64 266 70 M150 72 C190 72 230 74 262 75 M140 68 C150 74 162 76 176 77" ${S} stroke-width=".7"/>`);
      for (let x = 176; x < 260; x += 9) p.push(`<path d="M${x} ${57 + (x - 176) * 0.02} L${x + 3} ${63 + (x - 176) * 0.03}" ${S} stroke-width=".5"/>`);
      p.push(`<path d="M198 56 C204 55 210 56 214 57" stroke="currentColor" stroke-width="2.4" fill="none" opacity=".7"/>`); // Stigma
      if (o.augenfleck) p.push(`<ellipse cx="218" cy="66" rx="7" ry="5" ${F}/><ellipse cx="218" cy="66" rx="3.2" ry="2.4" fill="currentColor"/>`);
      if (o.flfleck) p.push(`<circle cx="204" cy="62" r="2.2" fill="currentColor"/><circle cx="232" cy="66" r="1.8" fill="currentColor"/>`);
    }
    // Brust (Meso-/Metathorax) und Ansatz der Beine
    p.push(`<path d="M124 60 C134 58 146 62 150 70 C152 78 146 84 136 84 C128 82 122 74 122 66 Z" ${F}/>`);
    // Halsschild (Pronotum) mit Verbreiterung über den Hüften
    if (o.hals === "blatt") p.push(`<path d="M64 50 C70 30 98 28 116 44 C126 52 130 58 128 64 C112 74 84 74 70 64 C64 60 62 56 64 50 Z" ${F}/><path d="M66 56 C90 54 112 58 128 63" ${S} stroke-width=".8"/>`);
    else if (o.hals === "kurz") p.push(`<path d="M66 48 C74 44 88 46 100 52 C112 56 122 58 126 60 L126 68 C110 68 92 66 78 62 C70 60 64 56 66 48 Z" ${F}/>`);
    else p.push(`<path d="M64 46 C70 43 78 43 84 46 C98 52 114 56 128 59 L128 67 C112 66 96 63 82 59 C74 58 66 56 63 52 C62 50 62 48 64 46 Z" ${F}/><path d="M82 46 C80 52 80 56 82 59" ${S} stroke-width=".8"/>`);
    if (o.halsdornen) for (let x = 88; x < 126; x += 6) p.push(`<path d="M${x} ${48 + (x - 84) * 0.27} l2 -3.5 l2 3.2" ${S} stroke-width=".9"/>`);
    // Kopf (Seitenansicht): Komplexauge, Fühler, Mundwerkzeuge
    p.push(`<path d="M44 34 C48 24 62 22 68 30 C72 36 72 46 66 56 C62 62 56 66 50 64 C44 62 40 54 40 46 C40 40 41 37 44 34 Z" ${F}/>`);
    if (o.auge === "kegel") p.push(`<path d="M44 36 C46 28 52 22 52 14 C58 20 62 28 60 38 C58 46 50 48 46 44 C44 42 43 39 44 36 Z" ${F}/><path d="M47 38 C50 34 54 30 55 24" ${S} stroke-width=".6"/>`);
    else p.push(`<path d="M44 38 C44 30 50 26 56 27 C62 28 64 36 62 43 C60 50 52 52 48 49 C45 47 44 42 44 38 Z" ${F}/><path d="M48 34 C52 32 56 33 58 36 M47 40 C51 38 56 39 59 42" ${S} stroke-width=".5"/>`);
    if (o.horn) p.push(`<path d="M58 28 C60 18 66 8 74 2 C74 10 70 20 64 30 Z" ${F}/>`);
    p.push(`<path d="M54 62 C54 68 58 72 60 70 M58 60 C62 66 66 66 66 62" ${S} stroke-width="1"/>`); // Taster
    // Fühler
    p.push(`<path d="M58 30 C50 20 36 12 14 6" ${S} stroke-width="1.1"/>`);
    if (o.fuehler === "kamm") for (let i = 0; i < 8; i++) { const t = i / 8, x = 56 - t * 40, y = 28 - t * 20; p.push(`<path d="M${x.toFixed(1)} ${y.toFixed(1)}l-3 5" ${S} stroke-width=".8"/>`); }
    // Vorderbein
    if (o.laufbein) {
      p.push(leg(74, 60, 60, 96, 44, 126, -8, 6));
    } else {
      // Hüfte (Coxa), lang
      p.push(`<path d="M72 54 C78 54 82 58 80 64 L72 96 C70 101 63 101 63 96 L67 60 C68 56 70 54 72 54 Z" ${F}/>`);
      if (o.huefteLappen) p.push(`<path d="M74 92 C82 90 86 98 78 102 C74 103 72 100 72 98" ${F}/>`);
      if (o.huefteFleck) p.push(`<ellipse cx="73" cy="74" rx="2.4" ry="3.4" fill="currentColor"/>`);
      // Schenkel (Femur): kräftig, nach vorn oben gerichtet, Dornen an der Unterkante
      p.push(`<path d="M66 98 C58 96 46 86 36 74 C32 68 32 62 36 60 C40 58 44 62 48 68 C56 78 64 88 70 94 C70 97 68 98 66 98 Z" ${F}/>`);
      if (o.schenkelLappen) p.push(`<path d="M42 64 C34 56 32 46 40 44 C44 46 46 56 46 64" ${F}/>`);
      if (o.schenkelFleck) p.push(`<ellipse cx="54" cy="82" rx="3" ry="2" fill="currentColor"/>`);
      if (!o.ohneDornen) p.push(thorns(66, 96, 37, 68, 7, 4, 1, { alt: true }));
      // Schiene (Tibia) zurückgeklappt mit Endklaue, Fuß
      p.push(`<path d="M36 64 C40 72 48 82 56 88 C58 90 58 92 56 92 C48 88 40 80 34 70 C33 67 34 64 36 64 Z" ${F}/>`);
      if (!o.ohneDornen) p.push(thorns(36, 70, 55, 90, 6, 2.6, -1));
      p.push(`<path d="M56 91 C58 96 56 100 52 102" ${S} stroke-width="1.6"/>`);
      p.push(tarsus(55, 92, 2, 12, 15));
    }
    // Hervorhebung
    const H = {
      kopf: `<ellipse cx="56" cy="44" rx="18" ry="22" ${HL}/>`, auge: `<ellipse cx="53" cy="38" rx="12" ry="13" ${HL}/>`,
      fuehler: `<path d="M58 30 C50 20 36 12 14 6" ${HL}/>`, hals: `<path d="M64 50 C90 54 110 60 128 63" ${HL} stroke-width="16"/>`,
      huefte: `<path d="M74 58 L67 96" ${HL} stroke-width="13"/>`, schenkel: `<path d="M66 95 C56 88 44 76 36 64" ${HL} stroke-width="14"/>`,
      schiene: `<path d="M36 66 C42 76 50 84 57 90" ${HL} stroke-width="11"/>`, fangbein: `<path d="M74 58 L67 96 C56 88 44 76 36 64 C42 76 50 84 57 90" ${HL} stroke-width="15"/>`,
      fluegel: `<path d="M132 62 C170 52 220 54 266 66" ${HL} stroke-width="16"/>`, leib: `<path d="M142 78 C180 82 230 82 262 82" ${HL} stroke-width="14"/>`,
      cerci: `<path d="M264 81 L292 88" ${HL} stroke-width="10"/>`, beine: `<path d="M146 80 L128 112 L108 144 M166 82 L196 112 L226 146" ${HL} stroke-width="10"/>`,
      unterseite: `<path d="M68 60 C90 64 112 68 128 70" ${HL} stroke-width="10"/>`, fuss: `<path d="M98 150 L108 144 M226 146 L240 150" ${HL} stroke-width="10"/>`,
      scheitel: `<ellipse cx="60" cy="28" rx="10" ry="7" ${HL}/>`,
    };
    const AR = { kopf: [92, 14, 70, 34], auge: [86, 10, 62, 30], fuehler: [44, 2, 28, 10], hals: [104, 30, 98, 50], huefte: [104, 104, 80, 84], schenkel: [16, 104, 40, 82], schiene: [16, 54, 36, 70], fangbein: [14, 112, 38, 88], fluegel: [214, 26, 210, 50], leib: [214, 122, 210, 92], cerci: [292, 112, 286, 92], beine: [160, 140, 160, 112], unterseite: [96, 96, 100, 70], fuss: [80, 160, 100, 148], scheitel: [92, 8, 66, 24] };
    if (hl && H[hl]) { p.unshift(H[hl]); const a = AR[hl]; p.push(arrow(a[0], a[1], a[2], a[3])); }
    return wrap(p.join(""), "0 0 300 168");
  }

  // ---------- Kopf von vorn: dreieckig, große Komplexaugen, 3 Punktaugen, Stirnschild, Mundwerkzeuge
  const kopfFront = (o = {}) => {
    const p = [];
    p.push(`<path d="M52 52 C56 34 80 28 120 30 C160 28 184 34 188 52 C186 72 160 100 136 118 C130 124 124 128 120 128 C116 128 110 124 104 118 C80 100 54 72 52 52 Z" ${F}/>`);
    const eye = (cx, s) => {
      if (o.auge === "kegel") return `<path d="M${cx - 16 * s} 64 C${cx - 20 * s} 48 ${cx - 6 * s} 34 ${cx + 6 * s} 12 C${cx + 16 * s} 32 ${cx + 20 * s} 50 ${cx + 12 * s} 66 C${cx + 4 * s} 76 ${cx - 10 * s} 76 ${cx - 16 * s} 64 Z" ${F}/>`;
      const ry = o.auge === "gross" ? 24 : 19, cy = o.auge === "gross" ? 46 : 52;
      let e = `<path d="M${cx - 17 * s} ${cy} C${cx - 18 * s} ${cy - ry} ${cx + 16 * s} ${cy - ry - 4} ${cx + 18 * s} ${cy - 2} C${cx + 19 * s} ${cy + ry - 4} ${cx - 14 * s} ${cy + ry + 2} ${cx - 17 * s} ${cy} Z" ${F}/>`;
      e += `<path d="M${cx - 10 * s} ${cy - 6} C${cx - 2 * s} ${cy - 10} ${cx + 8 * s} ${cy - 9} ${cx + 12 * s} ${cy - 5} M${cx - 11 * s} ${cy + 4} C${cx - 2 * s} ${cy} ${cx + 8 * s} ${cy + 1} ${cx + 12 * s} ${cy + 5}" ${S} stroke-width=".5"/>`;
      if (o.auge === "dorn") e += `<path d="M${cx - 2 * s} ${cy - ry + 1} C${cx} ${cy - ry - 8} ${cx + 2 * s} ${cy - ry - 14} ${cx + 4 * s} ${cy - ry - 18} C${cx + 6 * s} ${cy - ry - 10} ${cx + 7 * s} ${cy - ry - 4} ${cx + 7 * s} ${cy - ry + 2}" ${F}/>`;
      return e;
    };
    p.push(eye(70, -1), eye(170, 1));
    // Punktaugen
    p.push(`<ellipse cx="111" cy="56" rx="3.2" ry="2.4" ${F}/><ellipse cx="129" cy="56" rx="3.2" ry="2.4" ${F}/><ellipse cx="120" cy="48" rx="3.2" ry="2.4" ${F}/>`);
    // Fühleransätze
    p.push(`<circle cx="104" cy="70" r="4" ${F}/><circle cx="136" cy="70" r="4" ${F}/>`);
    // Stirnschild (Frons) unter den Fühlern
    const st = o.stirn === "hoch" ? "M108 76 C116 74 124 74 132 76 L130 98 C124 100 116 100 110 98 Z" : "M100 78 C112 74 128 74 140 78 C138 86 134 90 120 91 C106 90 102 86 100 78 Z";
    p.push(`<path d="${st}" ${o.stirnFleck ? 'fill="currentColor" stroke="currentColor"' : F}/>`);
    // Kopfschild, Oberlippe, Oberkiefer, Taster
    p.push(`<path d="M108 94 C114 92 126 92 132 94 L130 104 C124 106 116 106 110 104 Z" ${F}/>`);
    p.push(`<path d="M112 106 C114 114 126 114 128 106" ${F}/>`);
    p.push(`<path d="M106 112 C100 120 98 128 102 134 M134 112 C140 120 142 128 138 134" ${S} stroke-width="1.2"/>`);
    // Scheitel / Fortsätze
    if (o.horn === "zwei") p.push(`<path d="M110 34 C106 22 104 12 106 2 C112 10 116 22 116 32 M130 34 C134 22 136 12 134 2 C128 10 124 22 124 32" ${F}/>`);
    else if (o.horn === "blatt") p.push(`<path d="M104 34 C92 20 98 4 120 2 C142 4 148 20 136 34 C128 30 112 30 104 34 Z" ${F}/><path d="M120 6 L120 32" ${S} stroke-width=".7"/>`);
    else if (o.horn) p.push(`<path d="M110 33 C112 22 116 10 120 0 C124 10 128 22 130 33 C124 31 116 31 110 33 Z" ${F}/>`);
    else if (o.hoecker) p.push(`<path d="M86 34 C88 26 96 26 98 33 M142 33 C144 26 152 26 154 34" ${F}/>`);
    if (o.scheitelBand) p.push(`<path d="M84 38 C104 32 136 32 156 38" stroke="currentColor" stroke-width="5" fill="none"/>`);
    // Fühler
    p.push(`<path d="M104 66 C92 44 70 24 36 6 M136 66 C148 44 170 24 204 6" ${S} stroke-width="1.2"/>`);
    if (o.fuehler === "kamm") for (let i = 1; i < 9; i++) { const t = i / 9; const x1 = 104 - 68 * t, y1 = 66 - 60 * t + 10 * t * t; const x2 = 136 + 68 * t; p.push(`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}c-3 4 -7 5 -10 5 M${x2.toFixed(1)} ${y1.toFixed(1)}c3 4 7 5 10 5" ${S} stroke-width=".9"/>`); }
    const ar = o.ar || "auge";
    const A = { auge: [24, 120, 58, 70], horn: [196, 30, 132, 18], stirn: [200, 112, 140, 86], fuehler: [214, 52, 176, 24], scheitel: [200, 18, 150, 34], ocellen: [200, 70, 134, 56] };
    p.push(arrow(...A[ar]));
    return wrap(p.join(""), "0 0 240 140");
  };

  // ---------- Halsschild (Pronotum) von oben: Vorderteil (Prozona), Querfurche, Hinterteil (Metazona)
  const halsOben = (o = {}) => {
    const p = [];
    const f = o.form || "schmal";
    const shapes = {
      schmal: "M114 8 C118 6 122 6 126 8 C130 14 133 24 134 34 C134 40 129 44 128 52 C127 80 128 110 131 136 C126 140 114 140 109 136 C112 110 113 80 112 52 C111 44 106 40 106 34 C107 24 110 14 114 8 Z",
      blatt: "M120 6 C138 6 160 18 172 36 C184 56 180 84 164 104 C152 120 138 132 130 140 L110 140 C102 132 88 120 76 104 C60 84 56 56 68 36 C80 18 102 6 120 6 Z",
      raute: "M120 6 C128 8 160 36 172 50 C168 60 140 112 130 140 L110 140 C100 112 72 60 68 50 C80 36 112 8 120 6 Z",
      kurz: "M90 28 C100 24 140 24 150 28 C158 40 158 50 154 58 C156 76 156 96 152 112 C140 116 100 116 88 112 C84 96 84 76 86 58 C82 50 82 40 90 28 Z",
      herz: "M120 18 C134 4 172 10 172 40 C172 64 146 92 132 140 L108 140 C94 92 68 64 68 40 C68 10 106 4 120 18 Z",
      breitvorn: "M84 10 C100 6 140 6 156 10 C158 30 142 48 130 56 C128 84 129 112 131 140 L109 140 C111 112 112 84 110 56 C98 48 82 30 84 10 Z",
    };
    p.push(`<path d="${shapes[f] || shapes.schmal}" ${F}/>`);
    // Querfurche und Mittelkiel
    const fy = f === "kurz" ? 56 : f === "blatt" || f === "raute" || f === "herz" ? 48 : 50;
    p.push(`<path d="M${f === "kurz" ? 88 : 108} ${fy} C112 ${fy + 3} 128 ${fy + 3} ${f === "kurz" ? 152 : 132} ${fy}" ${S} stroke-width="1"/>`);
    p.push(`<path d="M120 ${fy + 4} L120 ${f === "kurz" ? 110 : 136}" ${S} stroke-width=".8"/>`);
    if (o.dornen) { for (let y = fy + 8; y < (f === "kurz" ? 108 : 134); y += 9) { const xr = f === "schmal" ? 129.5 + (y - 60) * 0.02 : 120 + (f === "kurz" ? 34 : 20); p.push(`<path d="M${xr} ${y} l4 -2 l-4 4 M${240 - xr} ${y} l-4 -2 l4 4" ${S} stroke-width="1"/>`); } }
    if (o.hoecker) p.push(`<ellipse cx="114" cy="${fy + 20}" rx="4" ry="5" ${F}/><ellipse cx="126" cy="${fy + 20}" rx="4" ry="5" ${F}/>`);
    if (o.flecken) p.push(`<circle cx="114" cy="${fy + 30}" r="3" fill="currentColor"/><circle cx="126" cy="${fy + 30}" r="3" fill="currentColor"/>`);
    if (o.laengsband) p.push(`<path d="M116 ${fy + 6} L116 134 M124 ${fy + 6} L124 134" stroke="currentColor" stroke-width="3"/>`);
    p.push(arrow(26, 110, f === "schmal" ? 108 : f === "kurz" ? 86 : 74, f === "schmal" ? 70 : 70));
    p.push(txt(16, 20, "↑ Kopf", 10, "start"));
    return wrap(p.join(""), "0 0 240 146");
  };

  // ---------- Fangbein von innen: Hüfte mit Endlappen, Schenkel mit Dornenreihen und Klauenfurche, Schiene mit Endklaue
  const fangbeinInnen = (o = {}) => {
    const p = [];
    // Hüfte
    p.push(`<path d="M22 22 C28 16 40 16 44 22 C48 54 52 90 54 118 C50 126 38 128 32 122 C28 90 24 54 22 22 Z" ${F}/>`);
    if (o.huefteLappen) p.push(`<path d="M50 112 C58 108 64 116 58 124 C56 126 52 126 50 124" ${F}/><path d="M36 122 C30 128 30 134 38 134" ${F}/>`);
    else p.push(`<path d="M50 116 C54 118 54 122 52 124" ${S} stroke-width="1"/>`);
    if (o.huefteFleck) p.push(`<ellipse cx="38" cy="${o.huefteFleck === "basis" ? 34 : 70}" rx="5" ry="7" fill="currentColor"/>`);
    if (o.huefteBand) p.push(`<path d="M27 44 C33 42 41 42 46 44 M30 76 C36 74 44 74 49 76 M32 104 C38 102 46 102 51 104" stroke="currentColor" stroke-width="5" fill="none"/>`);
    if (o.huefteDornen) p.push(thorns(23, 26, 32, 118, 8, 4.5, 1));
    // Schenkelring + Schenkel
    p.push(`<path d="M50 120 C56 116 64 116 66 122 C64 128 56 130 50 126 Z" ${F}/>`);
    p.push(`<path d="M62 118 C90 98 140 72 186 56 C196 53 204 54 206 60 C206 66 200 70 192 74 C152 92 104 118 70 132 C64 134 60 128 62 118 Z" ${F}/>`);
    if (o.schenkelLappen) p.push(`<path d="M100 104 C104 82 132 70 150 72 C140 82 120 96 100 104 Z" ${F}/>`);
    if (o.schenkelFleck) p.push(`<ellipse cx="116" cy="102" rx="8" ry="4.5" fill="currentColor" transform="rotate(-24 116 102)"/>`);
    // Innenreihe: abwechselnd große und kleine Dornen; Scheibendornen nahe der Basis
    p.push(thorns(72, 130, 196, 72, 13, 9, 1, { alt: true, dark: o.dornenSchwarz }));
    p.push(thorns(76, 120, 98, 108, 4, 6, -1, { dark: o.dornenSchwarz }));
    // Klauenfurche
    p.push(`<path d="M128 100 c2 4 2 6 0 8" ${S} stroke-width="1"/>`);
    // Schiene mit Dornenreihe und Endklaue
    p.push(`<path d="M196 60 C206 70 216 82 224 94 C226 98 224 100 220 98 C212 88 202 76 192 68 Z" ${F}/>`);
    if (!o.schieneOhne) p.push(thorns(196, 70, 220, 98, 7, 4, 1));
    p.push(`<path d="M222 96 C228 104 228 110 222 116" ${S} stroke-width="2"/>`);
    p.push(tarsus(224, 98, 4, 14, 22));
    const A = { huefte: [6, 82, 26, 72], schenkel: [116, 142, 120, 112], schiene: [236, 64, 214, 82], dornen: [160, 138, 156, 104] };
    p.push(arrow(...A[o.ar || "huefte"]));
    p.push(txt(38, 146, "Hüfte", 10), txt(140, 58, "Schenkel", 10), txt(214, 132, "Schiene", 10));
    return wrap(p.join(""), "0 0 240 152");
  };

  // ---------- Mittel-/Hinterbein von der Seite
  const beinLaufen = (o = {}) => {
    const p = [];
    p.push(leg(24, 34, 128, 66, 206, 120, 18, 6, { w: 6, lappen: false, ring: o.ring, tl: 30 }));
    if (o.lappen) p.push(`<path d="M60 52 C62 76 96 82 106 66 M150 84 C142 104 164 116 176 104" ${F}/>`);
    if (o.dorn) p.push(`<path d="M124 60 l10 -8 l-2 10 Z" ${F}/>`);
    p.push(arrow(94, 126, 86, o.lappen ? 74 : 60));
    p.push(txt(64, 18, "Schenkel", 10), txt(178, 92, "Schiene", 10), txt(214, 136, "Fuß", 10));
    return wrap(p.join(""), "0 0 240 142");
  };

  // ---------- Flügel: Deckflügel (Tegmen) und ausgebreiteter Hinterflügel mit Fächeradern
  const fluegelBild = (o = {}) => {
    const p = [];
    p.push(`<path d="M10 28 C60 14 170 12 226 22 C234 24 234 32 226 34 C170 40 70 42 14 38 C8 36 8 30 10 28 Z" ${F}/>`);
    p.push(`<path d="M14 30 C70 22 170 20 228 27 M30 35 C90 31 170 29 222 31" ${S} stroke-width=".7"/>`);
    p.push(`<path d="M96 20 C104 19 112 19 118 20" stroke="currentColor" stroke-width="2.4" opacity=".7"/>`);
    if (o.decke === "fleck") p.push(`<ellipse cx="96" cy="28" rx="4" ry="3" fill="currentColor"/>`);
    // Hinterflügel
    p.push(`<path d="M12 64 C60 54 170 50 226 60 C228 92 200 126 150 142 C110 150 60 146 30 128 C16 116 10 90 12 64 Z" ${F}/>`);
    for (let i = 0; i < 10; i++) { const a = -0.05 + i * 0.16; p.push(`<path d="M16 68 C${60 + Math.cos(a) * 60} ${66 + Math.sin(a) * 30} ${90 + Math.cos(a) * 100} ${70 + Math.sin(a) * 70} ${20 + Math.cos(a) * 200} ${66 + Math.sin(a) * 80}" ${S} stroke-width=".55"/>`); }
    for (let i = 0; i < 9; i++) p.push(`<path d="M${40 + i * 20} ${60 - i * 0.6} C${46 + i * 20} ${80 + i * 4} ${50 + i * 18} ${100 + i * 3} ${50 + i * 16} ${130 - i * 2}" ${S} stroke-width=".35"/>`);
    if (o.augenfleck) p.push(`<ellipse cx="156" cy="96" rx="16" ry="13" ${F}/><ellipse cx="156" cy="96" rx="8" ry="6.5" fill="currentColor"/><ellipse cx="153" cy="93" rx="2" ry="1.6" fill="var(--tafel-fill,#fff)"/>`);
    if (o.dunkel) p.push(`<path d="M12 64 C60 54 170 50 226 60 C228 92 200 126 150 142 C110 150 60 146 30 128 C16 116 10 90 12 64 Z" fill="currentColor" fill-opacity=".3"/>`);
    if (o.binden) for (let i = 0; i < 3; i++) p.push(`<path d="M${84 + i * 42} 58 C${90 + i * 42} 86 ${92 + i * 38} 116 ${88 + i * 32} ${142 - i * 4}" stroke="currentColor" stroke-width="8" stroke-opacity=".45" fill="none"/>`);
    if (o.rand) p.push(`<path d="M12 64 C60 54 170 50 226 60" stroke="currentColor" stroke-width="7" stroke-opacity=".5" fill="none"/>`);
    p.push(txt(120, 10, "Deckflügel", 10), txt(70, 108, "Hinterflügel", 10));
    p.push(arrow(...(o.ar === "decke" ? [204, 4, 186, 22] : [230, 140, o.augenfleck ? 168 : 196, o.augenfleck ? 104 : 96])));
    return wrap(p.join(""), "0 0 240 152");
  };

  // ---------- Hinterleib von oben mit Cerci
  const leibOben = (o = {}) => {
    const p = [];
    const n = 9;
    for (let i = 0; i < n; i++) {
      const y = 8 + i * 14, w0 = (o.breit ? 46 : 30) * Math.sin(Math.PI * (0.35 + 0.65 * (1 - i / n))) + 6, w1 = (o.breit ? 46 : 30) * Math.sin(Math.PI * (0.35 + 0.65 * (1 - (i + 1) / n))) + 6;
      p.push(`<path d="M${120 - w0} ${y} C${120 - w0 - 2} ${y + 6} ${120 - w1 - 2} ${y + 10} ${120 - w1} ${y + 14} L${120 + w1} ${y + 14} C${120 + w1 + 2} ${y + 10} ${120 + w0 + 2} ${y + 6} ${120 + w0} ${y} Z" ${F}/>`);
      if (o.lappen && i < n - 1) p.push(`<path d="M${120 + w0 + 1} ${y + 3} C${132 + w0} ${y + 2} ${134 + w1} ${y + 13} ${120 + w1 + 1} ${y + 12} M${120 - w0 - 1} ${y + 3} C${108 - w0} ${y + 2} ${106 - w1} ${y + 13} ${120 - w1 - 1} ${y + 12}" ${F}/>`);
    }
    const yb = 8 + n * 14;
    if (o.cerciblatt) p.push(`<path d="M114 ${yb} C104 ${yb + 6} 96 ${yb + 16} 100 ${yb + 20} C108 ${yb + 18} 114 ${yb + 10} 116 ${yb} M126 ${yb} C136 ${yb + 6} 144 ${yb + 16} 140 ${yb + 20} C132 ${yb + 18} 126 ${yb + 10} 124 ${yb}" ${F}/>`);
    else { p.push(`<path d="M114 ${yb} C108 ${yb + 8} 100 ${yb + 14} 92 ${yb + 18} M126 ${yb} C132 ${yb + 8} 140 ${yb + 14} 148 ${yb + 18}" ${S} stroke-width="1.6"/>`); for (let i = 1; i < 5; i++) p.push(`<circle cx="${114 - i * 5.4}" cy="${yb + i * 4.4}" r=".9" fill="currentColor"/><circle cx="${126 + i * 5.4}" cy="${yb + i * 4.4}" r=".9" fill="currentColor"/>`); }
    p.push(arrow(...(o.ar === "cerci" ? [196, 146, 146, yb + 14] : [206, 60, o.breit ? 172 : 160, 60])));
    p.push(txt(26, 16, "↑ Brust", 10, "start"));
    return wrap(p.join(""), "0 0 240 152");
  };

  // ---------- Weltkarte mit hervorgehobener Region (grobe Umrisse)
  const REG = {
    // grobe Umrisse der Großräume, 240x130
    NA: "M20 20 L80 12 L100 30 L86 56 L70 62 L58 74 L40 60 L24 44 Z",
    MA: "M58 74 L70 62 L78 70 L74 80 L68 84 Z",
    SA: "M70 84 L90 82 L102 96 L96 116 L84 128 L76 122 L72 100 Z",
    EU: "M112 18 L146 14 L150 34 L130 40 L112 36 Z",
    AF: "M112 46 L150 44 L160 62 L152 92 L138 110 L128 106 L120 80 L110 62 Z",
    MG: "M160 88 L166 86 L166 100 L160 104 Z",
    WA: "M150 34 L178 36 L176 54 L160 62 L150 44 Z",
    AS: "M146 14 L222 12 L230 34 L212 52 L196 62 L178 54 L178 36 L150 34 Z",
    SA2: "M176 54 L196 62 L190 74 L180 66 Z",
    OZ: "M196 92 L226 90 L230 110 L204 114 Z",
    SO: "M190 74 L206 70 L220 80 L200 86 Z",
  };
  const karte = (regs) => {
    const on = new Set(regs);
    const groups = { NA: ["NA"], MA: ["MA"], SA: ["SA"], AM: ["NA", "MA", "SA"], EU: ["EU"], AF: ["AF"], MG: ["MG"], WA: ["WA"], AS: ["AS", "SA2"], SO: ["SO", "SA2"], OZ: ["OZ"], AU: ["OZ"] };
    const hit = new Set(); for (const r of on) (groups[r] || [r]).forEach((x) => hit.add(x));
    const p = Object.entries(REG).map(([k, d]) => `<path d="${d}" ${hit.has(k) ? `fill="#d62d20" fill-opacity=".55"` : `fill="var(--tafel-fill,#fff)"`} stroke="currentColor" stroke-width="1.2"/>`);
    return wrap(p.join(""), "0 0 240 132");
  };

  // ---------- Ordnungsebene: Verwechslungsarten
  const verwechsler = (art) => {
    const p = [];
    if (art === "fanghaft") { // Mantispidae: 4 gleiche Netzflügel
      p.push(`<path d="M60 70 L200 70" ${S} stroke-width="4"/>`);
      p.push(`<path d="M90 66 C120 20 190 20 220 40 C200 56 140 64 92 68 Z" ${F}/><path d="M90 74 C120 120 190 120 220 100 C200 84 140 76 92 72 Z" ${F}/>`);
      for (let i = 0; i < 6; i++) p.push(`<path d="M${110 + i * 16} 60 L${116 + i * 16} 34 M${110 + i * 16} 80 L${116 + i * 16} 106" ${S} stroke-width=".8"/>`);
      p.push(`<path d="M30 60 C36 50 50 50 54 62 C52 72 36 74 30 66 Z" ${F}/><path d="M50 66 L36 96 L22 88" ${S} stroke-width="3"/>`);
      p.push(arrow(150, 8, 150, 30), txt(150, 140, "4 gleich gebaute, glasklare Netzflügel", 10));
    } else if (art === "wanze") {
      p.push(`<path d="M70 50 C120 30 190 40 214 70 C190 100 120 110 70 90 Z" ${F}/><path d="M40 62 C46 54 66 54 70 66 C66 76 46 78 40 70 Z" ${F}/>`);
      p.push(`<path d="M42 70 C30 80 26 92 30 104" ${S} stroke-width="2.5"/>`);
      p.push(arrow(10, 120, 28, 100), txt(140, 140, "Saugrüssel unter dem Kopf", 10));
    } else if (art === "stab") {
      p.push(`<path d="M20 70 L220 76" ${S} stroke-width="5"/><path d="M60 72 L40 110 M80 72 L100 112 M140 74 L120 112 M160 74 L180 114 M30 70 L10 40" ${S}/>`);
      p.push(arrow(30, 20, 18, 46), txt(120, 140, "Vorderbeine einfache Laufbeine", 10));
    } else if (art === "gladiator") {
      p.push(`<path d="M70 60 C120 50 190 56 214 70 C190 86 120 90 70 82 Z" ${F}/><path d="M40 64 C46 56 66 56 70 68 C66 78 46 80 40 72 Z" ${F}/>`);
      p.push(`<path d="M60 76 L50 100 L30 96 M90 82 L84 112 M140 84 L150 116 M180 80 L196 112" ${S}/>`);
      p.push(arrow(20, 120, 40, 100), txt(130, 140, "flügellos, Fangbeine ohne Klappmesser", 10));
    } else if (art === "schabe") {
      p.push(`<ellipse cx="130" cy="74" rx="90" ry="40" ${F}/><path d="M60 56 C80 40 110 40 120 60" ${S}/>`);
      p.push(arrow(20, 30, 50, 56), txt(130, 140, "Kopf unter Halsschild versteckt", 10));
    }
    return wrap(p.join(""), "0 0 240 150");
  };

  const fossil = (art) => {
    const p = [];
    if (art === "bernstein") p.push(`<path d="M40 30 C90 4 180 10 210 50 C230 90 190 136 120 140 C60 142 20 110 24 70 C26 50 30 38 40 30 Z" fill="#e8a33a" fill-opacity=".55" stroke="currentColor" stroke-width="1.6"/><g transform="translate(40 30) scale(.65)">${habitus({}).replace(/<svg[^>]*>|<\/svg>/g, "")}</g>`);
    else p.push(`<rect x="14" y="14" width="212" height="122" rx="8" fill="#bdb8ad" fill-opacity=".6" stroke="currentColor" stroke-width="1.6"/><g transform="translate(30 30) scale(.7)" opacity=".75">${habitus({ laufbein: false }).replace(/<svg[^>]*>|<\/svg>/g, "")}</g>`);
    return wrap(p.join(""), "0 0 240 150");
  };

  const lupe = (t) => wrap(`<circle cx="100" cy="66" r="44" ${F}/><path d="M132 98 L176 136" ${S} stroke-width="8"/>${txt(100, 72, t || "", 13)}`, "0 0 240 150");

  // ---------- Codes
  function svg(code) {
    if (!code) return "";
    const [teil, zu = "", z2 = ""] = code.split(":");
    switch (teil) {
      case "habitus": return habitus(parseOpts(zu));
      case "ort": return habitus({ hl: zu });
      case "auge": return kopfFront({ auge: zu || "rund", ar: "auge" });
      case "horn": return kopfFront({ horn: zu === "nein" ? false : zu || true, ar: "horn" });
      case "scheitel": return kopfFront({ hoecker: zu === "hoecker", scheitelBand: zu === "band", ar: "scheitel" });
      case "stirn": return kopfFront({ stirn: zu, stirnFleck: z2 === "fleck", ar: "stirn" });
      case "fuehler": return kopfFront({ fuehler: zu, ar: "fuehler" });
      case "ocellen": return kopfFront({ ocellen: true, ar: "ocellen" });
      case "hals": return halsOben({ form: zu || "schmal", dornen: z2 === "dornen", hoecker: z2 === "hoecker", flecken: z2 === "flecken", laengsband: z2 === "band" });
      case "huefte": return fangbeinInnen({ ar: "huefte", huefteLappen: zu === "lappen", huefteFleck: zu === "fleck" ? (z2 || "mitte") : null, huefteBand: zu === "band", huefteDornen: zu === "dornen" });
      case "schenkel": return fangbeinInnen({ ar: zu === "dornen" || zu === "schwarzdornen" ? "dornen" : "schenkel", schenkelLappen: zu === "lappen", schenkelFleck: zu === "fleck", dornenSchwarz: zu === "schwarzdornen" });
      case "schiene": return fangbeinInnen({ ar: "schiene", schieneOhne: zu === "ohne" });
      case "bein": return beinLaufen({ lappen: zu === "lappen", ring: zu === "ring", dorn: zu === "dorn" });
      case "fluegel": return zu === "kurz" || zu === "fehlt" || zu === "lang" ? habitus({ fluegel: zu === "lang" ? "" : zu, hl: "fluegel" }) : fluegelBild({ augenfleck: zu === "augenfleck", dunkel: zu === "dunkel", binden: zu === "binden", rand: zu === "rand", decke: z2 || (zu === "decke" ? "" : ""), ar: zu === "decke" ? "decke" : "" });
      case "leib": return leibOben({ lappen: zu === "lappen", breit: zu === "breit", cerciblatt: zu === "cerciblatt", ar: zu === "cerciblatt" || zu === "cerci" ? "cerci" : "" });
      case "fang": return habitus({ laufbein: zu === "nein", hl: "fangbein" });
      case "karte": return karte(zu.split(","));
      case "verwechsler": return verwechsler(zu);
      case "fossil": return fossil(zu);
      case "lupe": return lupe(decodeURIComponent(zu || ""));
      default: return habitus({});
    }
  }
  function parseOpts(s) {
    const o = {};
    (s || "").split(",").filter(Boolean).forEach((kv) => { const [k, v] = kv.split("="); o[k] = v === undefined ? true : v; });
    return o;
  }

  // ---------- Automatische Bildwahl aus dem Text eines Schlüsselpunkts
  const NEG = /\b(ohne|nicht|kein|keine|keinen|fehlt|fehlen|unbedornt|glatt|einfarbig|ungefleckt)\b/i;
  const RULES = [
    [/Augen?[^.;]*(kegel|spitz|zugespitzt|konisch)/i, () => "auge:kegel", () => "auge:rund"],
    [/Augen?[^.;]*(Dorn|Stachel|Spitzchen|Höcker)/i, () => "auge:dorn", () => "auge:rund"],
    [/Augen?[^.;]*(groß|vorquellend|vorstehend|kugelig)/i, () => "auge:gross", () => "auge:rund"],
    [/Augen?/i, () => "auge:rund", () => "auge:rund"],
    [/(Scheitelfortsatz|Kopffortsatz|Horn|Stirnfortsatz)/i, () => "horn", () => "horn:nein"],
    [/(Scheitel|Hinterhaupt)[^.;]*(Band|Binde)/i, () => "scheitel:band", () => "scheitel"],
    [/(Scheitel|Hinterhaupt)/i, () => "scheitel:hoecker", () => "scheitel"],
    [/(Stirnschild|Stirnplatte|Gesichtsschild)[^.;]*(schwarz|dunkel|Fleck)/i, () => "stirn:quer:fleck", () => "stirn:quer"],
    [/(Stirnschild|Stirnplatte|Gesichtsschild)/i, () => "stirn:quer", () => "stirn:quer"],
    [/Fühler[^.;]*(gekämmt|gefiedert|Kamm|doppelt)/i, () => "fuehler:kamm", () => "fuehler:faden"],
    [/Fühler/i, () => "fuehler:faden", () => "fuehler:faden"],
    [/Ocellen|Punktaugen|Nebenaugen/i, () => "ocellen", () => "ocellen"],
    [/(Halsschild|Pronotum)[^.;]*(blatt|schild|stark verbreitert|lappig)/i, () => "hals:blatt", () => "hals:schmal"],
    [/(Halsschild|Pronotum)[^.;]*(raute|rhomb)/i, () => "hals:raute", () => "hals:schmal"],
    [/(Halsschild|Pronotum)[^.;]*(kurz|quadrat|gedrungen)/i, () => "hals:kurz", () => "hals:schmal"],
    [/(Halsschild|Pronotum)[^.;]*(Dorn|Zähn|gezähnt|bedornt|gesägt)/i, () => "hals:schmal:dornen", () => "hals:schmal"],
    [/(Halsschild|Pronotum)[^.;]*(Höcker|Buckel|Knoten|Tuberkel)/i, () => "hals:schmal:hoecker", () => "hals:schmal"],
    [/(Halsschild|Pronotum)[^.;]*(Fleck|Punkt)/i, () => "hals:schmal:flecken", () => "hals:schmal"],
    [/(Halsschild|Pronotum)[^.;]*(Band|Binde|Streif|Linie)/i, () => "hals:schmal:band", () => "hals:schmal"],
    [/(Halsschild|Pronotum)/i, () => "hals:schmal", () => "hals:schmal"],
    [/Vorderhüfte[^.;]*(Lappen|lappig)/i, () => "huefte:lappen", () => "huefte"],
    [/Vorderhüfte[^.;]*(Band|Binde|Streif)/i, () => "huefte:band", () => "huefte"],
    [/Vorderhüfte[^.;]*(Fleck|Punkt|schwarz|dunkel|Schwiele)/i, () => "huefte:fleck", () => "huefte"],
    [/Vorderhüfte[^.;]*(Dorn|Zähn|gezähnt)/i, () => "huefte:dornen", () => "huefte"],
    [/Vorderhüfte/i, () => "huefte", () => "huefte"],
    [/Vorderschenkel[^.;]*(Lappen|lappig|verbreitert)/i, () => "schenkel:lappen", () => "schenkel"],
    [/(Vorderschenkel|Schenkel)[^.;]*Dornen[^.;]*schwarz|schwarz[^.;]*Dornen/i, () => "schenkel:schwarzdornen", () => "schenkel:dornen"],
    [/Vorderschenkel[^.;]*(Fleck|Punkt|schwarz|dunkel)/i, () => "schenkel:fleck", () => "schenkel"],
    [/Vorderschenkel[^.;]*Dorn/i, () => "schenkel:dornen", () => "schenkel:dornen"],
    [/Vorderschenkel/i, () => "schenkel", () => "schenkel"],
    [/(Vorderschiene|Vordertibi)/i, () => "schiene", () => "schiene:ohne"],
    [/(Mittel|Hinter|Lauf)(bein|schenkel|schiene)[^.;]*(Lappen|lappig|blattartig)/i, () => "bein:lappen", () => "bein"],
    [/(Mittel|Hinter|Lauf)(bein|schenkel|schiene)[^.;]*(geringelt|Ring|gebändert)/i, () => "bein:ring", () => "bein"],
    [/(Mittel|Hinter|Lauf)(bein|schenkel|schiene)[^.;]*(Dorn)/i, () => "bein:dorn", () => "bein"],
    [/(Mittel|Hinter|Lauf)(bein|schenkel|schiene)|Fuß|Tarsen/i, () => "bein", () => "bein"],
    [/(Hinterflügel|Flügel)[^.;]*(Augenfleck|Auge)/i, () => "fluegel:augenfleck", () => "fluegel"],
    [/(flügellos|ungeflügelt|Flügel fehlen|ohne Flügel)/i, () => "fluegel:fehlt", () => "fluegel:lang"],
    [/(Flügel|Deckflügel)[^.;]*(verkürzt|kurz|Stummel|reichen nicht)/i, () => "fluegel:kurz", () => "fluegel:lang"],
    [/Hinterflügel[^.;]*(Binde|Band|gebändert)/i, () => "fluegel:binden", () => "fluegel"],
    [/Hinterflügel[^.;]*(Rand|Saum)/i, () => "fluegel:rand", () => "fluegel"],
    [/Hinterflügel[^.;]*(dunkel|rauch|braun|schwarz|gefärbt|rot|gelb|rosa|violett|blau|orange)/i, () => "fluegel:dunkel", () => "fluegel"],
    [/Deckflügel[^.;]*(Fleck|Punkt)/i, () => "fluegel:decke:fleck", () => "fluegel:decke"],
    [/(Deckflügel|Flügel)/i, () => "fluegel:decke", () => "fluegel:decke"],
    [/(Hinterleib|Abdomen)[^.;]*(Lappen|lappig|Anhänge)/i, () => "leib:lappen", () => "leib"],
    [/(Hinterleib|Abdomen)[^.;]*(breit|verbreitert)/i, () => "leib:breit", () => "leib"],
    [/(Cerci|Raife|Hinterleibsanhänge)[^.;]*(blatt|verbreitert|lappig|flach)/i, () => "leib:cerciblatt", () => "leib:cerci"],
    [/(Cerci|Raife)/i, () => "leib:cerci", () => "leib:cerci"],
    [/(Brust|Unterseite|Vorderbrust|Prosternum)/i, () => "ort:unterseite", () => "ort:unterseite"],
    [/(Genital|Phallus|Hinterleibsspitze|Subgenital|Legeröhre|Ovipositor)/i, () => "lupe:%F0%9F%94%AC%20Mikroskop", () => "lupe:%F0%9F%94%AC%20Mikroskop"],
  ];
  function auto(text) {
    const t = text || "";
    for (const [re, pos, neg] of RULES) {
      const m = t.match(re);
      if (m) {
        // Verneinung im selben Satzteil
        const seg = t.slice(Math.max(0, m.index - 40), m.index + m[0].length + 30);
        return NEG.test(seg) ? neg() : pos();
      }
    }
    return "habitus";
  }

  window.MBILD = { svg, auto };
})();
