// Baut data/gbestimmung.js aus gb_quelle.js + Bildgrößen (data/gbilder/*/*).
// Aufruf: node bestimmung-quellen/gb_build.js
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const R = path.join(__dirname, "..");
const Q = require("./gb_quelle.js");
const groessen = JSON.parse(execFileSync("python3", ["-I", "-c", `
import json,glob,os
from PIL import Image
o={}
for f in glob.glob(${JSON.stringify(R)}+"/data/gbilder/*/*"):
    o[os.path.basename(os.path.dirname(f))+"/"+os.path.basename(f)]=Image.open(f).size
print(json.dumps(o))`]).toString());
const CR = JSON.parse(fs.readFileSync(path.join(__dirname, "gb_credits.json"), "utf8"));
const fehler = [];
for (const [name, g] of Object.entries(Q)) {
  g.name = name; g.ordner = name.toLowerCase(); g.groessen = {}; g.credits = g.credits || {};
  for (const [k, v] of Object.entries(CR)) if (k.startsWith(g.ordner + "/")) g.credits[k.split("/")[1]] = v;
  for (const M of g.merkmale) for (const s of M.spalten) {
    for (const b of s.bilder || []) {
      const gr = groessen[g.ordner + "/" + b.src];
      if (!gr) fehler.push(name + ": Bild fehlt " + b.src); else g.groessen[b.src] = gr;
      if (b.foto && !g.credits[b.src]) fehler.push(name + ": Bildnachweis fehlt " + b.src);
    }
    for (const a of s.art ? [s.art] : s.arten || []) if (!g.arten[a]) fehler.push(name + ": Art nicht in arten: " + a);
    if (s.weiter && !g.merkmale[s.weiter - 1]) fehler.push(name + ": Merkmal fehlt " + s.weiter);
  }
  // jede Art muss genau einmal als Ergebnis erreichbar sein
  const erg = g.merkmale.flatMap((M) => M.spalten.filter((s) => s.art).map((s) => s.art));
  for (const f of g.fehlt || []) if (g.arten[f.art] || !f.t) fehler.push(name + ": fehlt-Eintrag falsch: " + f.art);
  for (const a of Object.keys(g.arten)) if (erg.filter((x) => x === a).length !== 1) fehler.push(name + ": Art " + a + " wird " + erg.filter((x) => x === a).length + "-mal erreicht");
}
if (fehler.length) { console.error(fehler.join("\n")); process.exit(1); }
fs.writeFileSync(path.join(R, "data", "gbestimmung.js"), "// erzeugt von bestimmung-quellen/gb_build.js – nicht von Hand ändern\nwindow.MANTODEA_GB=" + JSON.stringify(Q) + ";\n");
console.log("Gattungen:", Object.keys(Q).length, Object.keys(Q).join(", "));
