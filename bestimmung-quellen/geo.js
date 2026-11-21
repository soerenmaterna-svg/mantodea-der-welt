// Länder je Art: Projektdaten (Belege, Literaturorte) + Giglio-Tos 1927 (Fundortzeile) + Erstbeschreibung (Umfeld des Holotypus).
// Aufruf: node geo.js <scratch>   -> <scratch>/geo.json
"use strict";
const fs = require("fs"), path = require("path");
const S = process.argv[2], R = path.join(__dirname, "..");
global.window = {};
for (const f of ["species", "literaturorte", "erstbeschreibung", "dropbox"]) require(path.join(R, "data", f + ".js"));
const { find } = require("./laender.js");
const SP = window.MANTODEA.species.filter((x) => !x.x);
const L = window.MANTODEA_LITORTE, E = window.MANTODEA_ERST, D = window.MANTODEA_DBX.dateien;
const U = {}; D.forEach((d, i) => (U[d.u] = i));
const out = {};
for (const x of SP) {
  const l = L[x.k];
  const c = new Set([...(x.ct || []), ...((l && l.c) || []), ...Object.values((l && l.h) || {}).flat()]);
  out[x.k] = { c: [...c], q: c.size ? "daten" : "" };
}
// Giglio-Tos 1927: Artkapitel "N. G. epitheton Autor" ... Fundortzeile am Ende
const GT = fs.readFileSync(path.join(S, "txt/443L.txt"), "utf8").split("\n");
const despace = (s) => s.replace(/\s+/g, "");
let gen = null; const gtLoc = {};
const nextYear = (k) => { for (let t = k + 1; t < Math.min(k + 4, GT.length); t++) if (GT[t].trim()) return /^\s*1[789]\d\d\s/.test(GT[t]); return false; };
let cur = null, buf = [];
const flush = () => { if (cur) { const lines = buf.map((s) => s.trim()).filter(Boolean); const last = lines.slice(-3).join(" "); gtLoc[cur] = last; } cur = null; buf = []; };
for (let k = 0; k < GT.length; k++) {
  const l = GT[k];
  let m = l.match(/^\s*\d{1,3}\.\s*Gen\s?\.\s*((?:[A-Z]\s?)(?:[a-zäöüéèêëàâïîôûüç]\s?)+)/);
  if (m && nextYear(k)) { flush(); gen = despace(m[1]); continue; }
  m = l.match(/^\s{0,30}[\dlI]{1,3}\s?[.,]\s*[A-Z]\s?[.\-]\s*((?:[a-zäöüéèêëàâïîôûüç]\s?){3,})/);
  if (m && gen && (nextYear(k) || /\s1[789]\d\d\s/.test(l))) { flush(); cur = gen + " " + despace(m[1]); continue; }
  if (/Synopsis des/.test(l)) { flush(); continue; }
  if (cur) buf.push(l);
}
flush();
let gtHit = 0;
const byName = {}; SP.forEach((x) => (byName[x.n] = x));
for (const [n, loc] of Object.entries(gtLoc)) {
  const x = byName[n]; if (!x) continue;
  const c = find(loc);
  if (!c.length) continue;
  const o = out[x.k];
  o.gt = c;
  if (!o.c.length) { o.c = c; o.q = "Giglio-Tos 1927"; gtHit++; }
}
// Welt-Checklisten Patel et al. 2016 (Länder in eckigen Klammern je Art)
let patHit = 0;
for (const i of [1056, 1057, 1059, 1060, 1061, 1062]) {
  const f = path.join(S, "txt", i + ".txt"); if (!fs.existsSync(f)) continue;
  const t = fs.readFileSync(f, "utf8").replace(/-\n/g, "").replace(/\n(?!\d+\.\s)/g, " ");
  const re = /(?:^|\s)\d{1,4}\.\s+([A-Z][a-z]+) ([a-z]+)(?: [a-z]+)? \(?[A-Z][^\[\]\d]{0,60}\d{4}\)?\s*\[([^\]]{2,400})\]/g;
  let m;
  while ((m = re.exec(t))) {
    const x = byName[m[1] + " " + m[2]]; if (!x) continue;
    const c = find(m[3]); if (!c.length) continue;
    const o = out[x.k]; o.pat = c;
    if (!o.c.length) { o.c = c; o.q = "Patel et al. 2016"; patHit++; }
  }
}
console.log("neu aus Patel et al. 2016:", patHit);
// Erstbeschreibung: Umfeld von Holotypus/Typus nahe dem Artnamen
let ebHit = 0;
for (const x of SP) {
  const o = out[x.k]; if (o.c.length) continue;
  const e = E[x.n]; if (!e || U[e.u] == null) continue;
  const f = path.join(S, "txt", U[e.u] + ".txt"); if (!fs.existsSync(f)) continue;
  const t = fs.readFileSync(f, "utf8");
  const ep = x.n.split(" ")[1];
  const re = new RegExp("(holotyp|holótipo|holotipo|type locality|localité type|locus typicus|typus|types?\\s*:|material examined|matériel examiné|material examinado)", "ig");
  const found = new Map();
  let m;
  while ((m = re.exec(t))) {
    const back = t.slice(Math.max(0, m.index - 3000), m.index);
    if (!back.includes(ep)) continue;
    for (const c of find(t.slice(m.index, m.index + 400))) found.set(c, (found.get(c) || 0) + 1);
  }
  if (found.size) {
    const best = [...found.entries()].sort((a, b) => b[1] - a[1]);
    let cs = best.filter(([, v]) => v >= best[0][1] / 2).map(([c]) => c);
    // Museumsländer (Sammlungen in Paris, Berlin, London …) nicht als Fundort werten, wenn andere Länder genannt sind
    const MUS = new Set(["FR", "DE", "GB", "AT", "BE", "NL", "CH", "SE", "DK", "CZ", "HU", "RU", "US", "IT", "ES", "PL"]);
    if (cs.some((c) => !MUS.has(c))) cs = cs.filter((c) => !MUS.has(c));
    o.c = cs.slice(0, 4); o.q = "Erstbeschreibung"; ebHit++;
  }
}
fs.writeFileSync(path.join(S, "geo.json"), JSON.stringify(out));
const none = Object.values(out).filter((o) => !o.c.length).length;
console.log("GT-Fundorte gelesen", Object.keys(gtLoc).length, "neu aus GT", gtHit, "neu aus Erstbeschreibung", ebHit, "weiter ohne Land", none);
// ---- Gattungen ganz ohne Fundort: Gebiet aus Gattungsbeschreibungen (Giglio-Tos 1927, Patel 2016)
const GENLAND = { Paradiabantia: ["BR"], Achlaenella: ["CD"], Astollia: ["BR"], Rhachimantis: ["KE", "TZ"], Congomantis: ["CD"], Alluandella: ["IN"], Pararivetina: ["IN"], Geothespis: ["NA"], Neocilnia: ["ZA"], Oligocanthopus: ["CN"] };
for (const x of SP) { const o = out[x.k]; if (!o.c.length && GENLAND[x.g] && SP.filter((y) => y.g === x.g).every((y) => !out[y.k].c.length)) { o.c = GENLAND[x.g]; o.q = "Gattungsangabe"; } }
// ---- Ausreißer bereinigen: einzelnes Land in einem anderen Erdteil, wenn die Art sonst ≥2 Länder hat (Terrarientiere, Fehlbestimmungen)
const { OF, ERD_OF } = require("./regionen.js");
const AUSREISSER = { Acromantis: ["US"], Hoplocorypha: ["MX"], Thespis: ["IN"], Bantiella: ["ES"], Deiphobe: ["AU", "FJ"], Hierodula: [], Bantiella: ["ES"] };
const EINGESCHLEPPT = { "Mantis religiosa": ["US", "CA"], "Tenodera sinensis": ["US", "CA"], "Tenodera angustipennis": ["US"], "Iris oratoria": ["US", "MX"], "Hierodula patellifera": ["IT", "FR", "US"], "Hierodula tenuidentata": ["IT", "FR", "ES", "HR", "SI", "BG", "GR", "RO", "HU", "AT", "CH"], "Hierodula transcaucasica": ["BG", "UA", "RU", "IT", "GR", "RO"], "Miomantis caffra": ["NZ", "PT", "ES"], "Miomantis paykullii": ["PT", "ES"], "Brunneria borealis": ["ES"], "Liturgusa maya": ["US"], "Acontista cordillerae": ["US"], "Sphodromantis viridis": ["ES", "PT"], "Statilia maculata": ["US"] };
let entf = 0;
for (const x of SP) {
  const o = out[x.k];
  if (AUSREISSER[x.g]) o.c = o.c.filter((c) => !AUSREISSER[x.g].includes(c));
  if (!o.c.length) continue;
  const by = {}; for (const c of o.c) { const e = ERD_OF[OF[c]] || "?"; (by[e] = by[e] || []).push(c); }
  const total = o.c.length, keep = new Set(EINGESCHLEPPT[x.n] || []);
  const neu = [];
  for (const [e, cs] of Object.entries(by)) {
    if (cs.length === 1 && total - 1 >= 2 && !keep.has(cs[0]) && Object.keys(by).length > 1) { (o.weg = o.weg || []).push(cs[0]); entf++; continue; }
    neu.push(...cs);
  }
  o.c = neu;
}
fs.writeFileSync(path.join(S, "geo.json"), JSON.stringify(out));
console.log("Ausreißer entfernt:", entf);
