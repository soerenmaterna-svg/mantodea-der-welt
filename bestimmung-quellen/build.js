// Baut den eigenen Bestimmungsschlüssel (data/bestimmung.js) aus:
//  - selbst geschriebenen oberen Ebenen (oben.js)
//  - Giglio-Tos 1927 (geparst, deutsch übertragen: gt_de.json, Strukturkorrekturen: gt_fix.json)
//  - modernen Schlüsseln aus Revisionen (alt_schluessel.js, bereits deutsch)
//  - Verbreitung je Art (geo.json) für Fundort-Fragen
// Aufruf: node build.js <scratch>
"use strict";
const fs = require("fs"), path = require("path");
const S = process.argv[2], R = path.join(__dirname, "..");
global.window = {};
for (const f of ["species", "synonyme", "gattungen", "stammbaum"]) require(path.join(R, "data", f + ".js"));
require("./alt_schluessel.js");
const { R: REG, OF, ERDTEIL, ERD_OF } = require("./regionen.js");
const GEO = JSON.parse(fs.readFileSync(path.join(S, "geo.json"), "utf8"));
const GT = JSON.parse(fs.readFileSync(path.join(S, "gt.json"), "utf8"));
const rd = (f, d) => (fs.existsSync(path.join(__dirname, f)) ? JSON.parse(fs.readFileSync(path.join(__dirname, f), "utf8")) : d);
const GTDE = require("./gt_de.js");
const { FIX: GTFIX_SRC, ALIAS: GTALIAS } = require("./gt_fix.js");
const GTFIX = {};
const zEnd = (z) => {
  if (typeof z === "number") return ["p", z];
  if (z.includes("|")) return ["t", { kind: "MULTI", name: z }];
  const [kd, nm] = z.split(":"); return ["t", { kind: { SF: "sousfam.", GRP: "Groupe", G: "Gen.", A: "X.", SYN: "SYN" }[kd], name: nm }];
};
for (const [line, f] of Object.entries(GTFIX_SRC)) {
  GTFIX[line] = { couplets: f.c.map((pair) => pair.map(([t, z]) => ({ t, end: zEnd(z) }))), de: 1, ctx: f.gen ? { gen: f.gen } : undefined };
}
const OBEN = require("./oben.js");
const { M: MODERN, Z: ZUSATZ } = require("./modern.js");

// ---------------- Taxa
const SP = window.MANTODEA.species.filter((x) => !x.x);
const FOS = window.MANTODEA.species.filter((x) => x.x);
const BYK = {}, BYN = {}; SP.forEach((x) => { BYK[x.k] = x; BYN[x.n] = x; });
const GEN = {}; SP.forEach((x) => (GEN[x.g] = GEN[x.g] || []).push(x.k));
const FAM = {}; SP.forEach((x) => { const f = x.f || "(Familie unklar)"; FAM[f] = FAM[f] || new Set(); FAM[f].add(x.g); });
const famOfGen = {}; SP.forEach((x) => (famOfGen[x.g] = x.f || "(Familie unklar)"));
// Synonyme -> gültige Art
const SYN = {};
for (const [k, v] of Object.entries(window.MANTODEA_SYN)) for (const s of v.s || []) SYN[s[0]] = k;
const EPI = {}; SP.forEach((x) => { const e = x.n.split(" ")[1]; (EPI[e] = EPI[e] || []).push(x.k); });
const genusSyn = {}; // alte Gattungsnamen -> heutige (über Artnamen gelernt)
const learnG = (old, cur) => { if (old && cur && old !== cur && !GEN[old]) (genusSyn[old] = genusSyn[old] || new Set()).add(cur); };
for (const [k, v] of Object.entries(window.MANTODEA_SYN)) for (const s of v.s || []) if (BYK[k]) learnG(s[0].split(" ")[0], BYK[k].g);
SP.forEach((x) => (x.syn || []).forEach((s) => learnG(s.split(" ")[0], x.g)));
for (const o of ["Stauromantis", "Auromantis", "Oromantis", "Uromantis"]) learnG(o, "Stagmomantis");
learnG("Leptomantis", "Leptomantella");
function speciesKey(name) {
  name = name.replace(/\s+/g, " ").trim();
  if (BYN[name]) return BYN[name].k;
  if (SYN[name]) return SYN[name];
  const [g, e] = name.split(" ");
  const cand = (EPI[e] || []).filter((k) => BYK[k].g === g || (genusSyn[g] || new Set()).has(BYK[k].g));
  if (cand.length === 1) return cand[0];
  const all = EPI[e] || [];
  if (all.length === 1) return all[0];
  return null;
}
function geoOf(k) { return (GEO[k] && GEO[k].c) || []; }
function genGeo(g) { const s = new Set(); for (const k of GEN[g] || []) geoOf(k).forEach((x) => s.add(x)); return { c: [...s], unk: s.size === 0 }; }

// ---------------- Baum-Format
// Knoten: { l: [ {t, b, w, q, n: Knoten | Blatt} ] }   Blatt: { taxa: [ids], note }
const leaf = (taxa, note) => ({ taxa: [...new Set(taxa)], note });
const isLeaf = (n) => !!n.taxa;
function leaves(n, out = new Set()) { if (isLeaf(n)) n.taxa.forEach((t) => out.add(t)); else n.l.forEach((l) => leaves(l.n, out)); return out; }
// Beschneiden auf erlaubte Taxa; map: Blatt-ID -> erlaubte ID (oder null)
function prune(n, allowed, map) {
  if (isLeaf(n)) {
    const t = n.taxa.map((x) => (map ? map(x) : x)).filter((x) => x && allowed.has(x));
    return t.length ? leaf(t, n.note) : null;
  }
  const ls = [];
  for (const l of n.l) { const c = prune(l.n, allowed, map); if (c) ls.push({ ...l, n: c }); }
  if (!ls.length) return null;
  if (ls.length === 1) return ls[0].n; // Merkmal trennt nichts mehr
  // Blätter mit gleichem Inhalt zusammenlegen (Familienebene)
  const allLeaf = ls.every((l) => isLeaf(l.n));
  if (allLeaf) { const u = new Set(ls.flatMap((l) => l.n.taxa)); if (u.size === 1) return leaf([...u]); }
  return { ...n, l: ls };
}
function collapse(n) { // Teilbaum mit nur einem Taxon -> Blatt
  if (isLeaf(n)) return n;
  const L = leaves(n); if (L.size === 1) return leaf([...L]);
  return { ...n, l: n.l.map((l) => ({ ...l, n: collapse(l.n) })) };
}

// ---------------- Quellen: moderne Schlüssel (deutsch)
const ALT = window.MANTODEA_BEST;
const QUELLEN = {};
function altTree(i) {
  const k = ALT.k[i];
  const C = {}; k.p.forEach((c) => (C[c.n] = c));
  const q = "alt" + i; QUELLEN[q] = { z: k.q + (k.qt ? " – " + k.qt : ""), u: k.u || "", t: k.t };
  const seen = new Set();
  const node = (n) => {
    const c = C[n]; if (!c || seen.has(n)) return null; seen.add(n);
    const ls = [];
    for (const l of c.l) {
      let ch = null; const z = l.z;
      if (typeof z === "number") ch = node(z);
      else if (z && z.k) ch = leaf([z.k]);
      else if (z && z.g && !z.x) ch = leaf(["G:" + z.g]);
      else if (z && z.f) ch = leaf(["T:" + z.f]);
      if (ch) ls.push({ t: l.t, w: flags(l.t), q, n: ch });
    }
    return ls.length ? { l: ls } : null;
  };
  const first = Math.min(...k.p.map((c) => c.n));
  return node(first);
}
function flags(t) {
  const w = [];
  if (/(größer|kleiner|länger als|kürzer als|breiter als|schmaler als|schmäler als|höher als|niedriger als|dunkler|heller|plus grand|plus petit|weniger|mehr als|stärker|schwächer|<|>)/i.test(t)) w.push("v");
  if (/(Genital|Phallo|Apophys|Subgenital|Titillator|Hypophall|Epiphall|Ovipositor|Legeröhre|Phallomer)/i.test(t)) w.push("m");
  if (/\bmm\b|Verhältnis|Index|mal so lang|Messung/i.test(t)) w.push("mass");
  return w.join(",");
}

// ---------------- Quelle: Giglio-Tos 1927
QUELLEN.gt = { z: "Giglio-Tos, E. (1927): Das Tierreich 50. Orthoptera – Mantidae. Berlin & Leipzig: de Gruyter.", t: "Giglio-Tos 1927" };
const H = GT.heads;
const SYNS = GT.syn.map((s) => (GTFIX[s.line] ? { ...s, ...GTFIX[s.line], ctx: GTFIX[s.line].ctx || s.ctx, err: null } : s));
const synAt = (a, b, pred) => SYNS.find((s) => s.line > a && s.line < b && !s.err && pred(s));
const despace = (s) => (s || "").replace(/[\s\-]/g, "");
const OCR = { Anaxareha: "Anaxarcha", Cbrysomantis: "Chrysomantis", Epitelioderà: "Epitenodera", Epiteliodera: "Epitenodera", Diacanthornantis: "Diacanthomantis", Oxyfulciaia: "Oxyfulcinia", Compsornantis: "Compsomantis", Liturgnsa: "Liturgusa", Orthodorella: "Orthoderella", Fuleiniola: "Fulciniola", Pulcinia: "Fulcinia", Diafuleinia: "Diafulcinia", ISTeomantis: "Neomantis", Hoploeoryphella: "Hoplocoryphella", Iiigariona: "Ligariona", Epsomaritis: "Epsomantis", iNemotha: "Nemotha", Cathestiasula: "Catestiasula", Galiris: "Caliris", Decimia: "Decimiana", Idolum: "Idolomantis", Hagiomantis: "Hagiomantis" };
const clean = (n) => { let s = despace(n).replace(/[^A-Za-zäöüéèêëàâïîôûüç]/g, ""); s = s.replace(/(nomnov|nom)$/, ""); s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); return OCR[s] || s; };
function headIdx(type, name, from = 0) { const nm = clean(name).toLowerCase(); for (let i = from; i < H.length; i++) if (H[i][0] === type && clean(H[i][1]).toLowerCase() === nm) return i; return -1; }
function rangeEnd(i, types) { for (let j = i + 1; j < H.length; j++) if (types.includes(H[j][0])) return H[j][2]; return 1e9; }
function gtKey(s, ctxGen, depth, mode) {
  if (depth > 12) return null;
  const nodes = {};
  const de = (i) => (s.de ? s.leads[i].t : GTDE[s.line + ":" + i]);
  const C = s.couplets || Array.from({ length: s.leads.length / 2 }, (_, c) => [s.leads[2 * c], s.leads[2 * c + 1]].map((L, j) => ({ ...L, i: 2 * c + j })));
  const mk = (c) => {
    if (nodes[c]) return nodes[c];
    const ls = [];
    for (const L of C[c - 1] || []) {
      let ch;
      if (L.end[0] === "p") ch = mk(L.end[1]);
      else ch = gtTerm(L.end[1], s, ctxGen, depth, mode);
      const t = s.couplets ? L.t : GTDE[s.line + ":" + L.i];
      if (!t && process.env.FRDUMP) FRD.set(s.line + ":" + L.i, L.t);
      ls.push({ t: t || L.t, w: (t ? flags(t) : "fr," + flags(L.t)).replace(/^,|,$/g, ""), q: "gt", n: ch || leaf([], "Taxon in heutiger Systematik nicht zugeordnet") });
    }
    return (nodes[c] = { l: ls });
  };
  return mk(1);
}
function gtTerm(term, s, ctxGen, depth, mode) {
  const kind = term.kind || "";
  if (kind === "MULTI" && term.name.startsWith("A:")) { const g = ctxGen || (s.ctx && s.ctx.gen); return leaf(term.name.split("|").map((x) => "N:" + g + " " + x.slice(2)), "In der Quelle nicht weiter aufgeschlüsselt"); }
  if (kind === "MULTI") return resolveRef(term.name, depth, mode, "In der Quelle nicht weiter aufgeschlüsselt");
  if (kind === "SYN") return resolveRef("SYN:" + term.name, depth, mode);
  const name = clean(term.name);
  if (/sousfam/.test(kind)) return expandSF(name, depth + 1, mode);
  if (kind === "Groupe" || kind === "Grp") return GTALIAS[name] ? resolveRef(GTALIAS[name], depth + 1, mode) : expandGrp(name, s.line, depth + 1, mode);
  if (/Gen/.test(kind)) return expandGen(name, s.line, depth + 1, mode);
  const g = ctxGen || (s.ctx && s.ctx.gen);
  return leaf(["N:" + g + " " + name.toLowerCase()]);
}
function resolveRef(ref, depth, mode, note) {
  const parts = ref.split("|");
  if (parts.length === 1 && ref.startsWith("SYN:")) { const s = SYNS.find((x) => String(x.line) === ref.slice(4)); return s && !s.err ? gtKey(s, s.ctx && s.ctx.gen, depth + 1, mode) : null; }
  if (parts.length === 1 && ref.startsWith("G:")) return expandGen(ref.slice(2), 0, depth + 1, mode);
  const subs = parts.map((r) => (r.startsWith("G:") ? expandGen(r.slice(2), 0, depth + 1, mode) : null)).filter(Boolean);
  const all = new Set(); subs.forEach((t) => leaves(t).forEach((x) => all.add(x)));
  return leaf([...all], note);
}
function childrenList(a, b, type) { return H.filter((h) => h[2] > a && h[2] < b && h[0] === type).map((h) => h[1]); }
function expandSF(name, depth, mode) {
  const i = headIdx("sf", name); if (i < 0) return null;
  const a = H[i][2], b = rangeEnd(i, ["sf"]);
  const g = synAt(a, b, (s) => s.kind === "groupes");
  if (g) return gtKey(g, null, depth, mode);
  const gg = synAt(a, b, (s) => s.kind === "genres");
  if (gg) return gtKey(gg, null, depth, mode);
  const gens = childrenList(a, b, "gen");
  if (gens.length === 1) return expandGen(gens[0], a, depth, mode);
  const grps = childrenList(a, b, "grp");
  if (grps.length) return leaf(grps.map((x) => "GRP:" + x), "Gruppen in der Quelle nicht aufgeschlüsselt");
  return leaf(gens.map((x) => "G:" + clean(x)), "Gattungen in der Quelle nicht aufgeschlüsselt");
}
function expandGrp(name, from, depth, mode) {
  let i = -1; for (let j = 0; j < H.length; j++) if (H[j][0] === "grp" && clean(H[j][1]).toLowerCase() === clean(name).toLowerCase() && H[j][2] > from - 1) { i = j; break; }
  if (i < 0) { i = headIdx("grp", name); if (i < 0) { const gi = headIdx("gen", name, 0); return gi >= 0 ? expandGen(name, 0, depth, mode) : null; } }
  const a = H[i][2], b = rangeEnd(i, ["grp", "sf"]);
  const gg = synAt(a, b, (s) => s.kind === "genres");
  if (gg) return gtKey(gg, null, depth, mode);
  const gens = childrenList(a, b, "gen");
  if (gens.length === 1) return expandGen(gens[0], a, depth, mode);
  return leaf(gens.map((x) => "G:" + clean(x)), "Gattungen in der Quelle nicht aufgeschlüsselt");
}
function expandGen(name, from, depth, mode) {
  const nm = clean(name);
  if (mode === "gattung") return leaf(["G:" + nm]);
  let i = -1; for (let j = 0; j < H.length; j++) if (H[j][0] === "gen" && clean(H[j][1]) === nm && H[j][2] >= from) { i = j; break; }
  if (i < 0) i = headIdx("gen", nm); if (i < 0) return leaf(["G:" + nm]);
  const a = H[i][2], b = rangeEnd(i, ["gen", "grp", "sf"]);
  const sp = synAt(a, b, (s) => /esp/.test(s.kind));
  if (sp) return gtKey(sp, nm, depth, mode);
  const sps = childrenList(a, b, "sp");
  return leaf(sps.map((e) => "N:" + nm + " " + clean(e).toLowerCase()), sps.length > 1 ? "Arten in der Quelle nicht aufgeschlüsselt" : undefined);
}
const FRD = new Map();
const ROOT = SYNS.find((s) => s.kind === "sous-familles");
const gtGenusTree = ROOT && !ROOT.err ? gtKey(ROOT, null, 0, "gattung") : null;
// Gattungsbäume (Arten) für jede GT-Gattung
const gtSpeciesTree = {};
for (const h of H) if (h[0] === "gen") { const nm = clean(h[1]); if (!gtSpeciesTree[nm]) gtSpeciesTree[nm] = expandGen(nm, h[2], 0, "art"); }
// alte Gattungsnamen lernen: GT-Art -> heutige Gattung
for (const [g, t] of Object.entries(gtSpeciesTree)) for (const id of leaves(t)) { const nm = id.slice(2); const k = BYN[nm] ? BYN[nm].k : SYN[nm]; if (k && BYK[k].g !== g) (genusSyn[g] = genusSyn[g] || new Set()).add(BYK[k].g); }
const gtGenusMap = (id) => {
  if (!id.startsWith("G:")) return null;
  const g = id.slice(2); if (GEN[g]) return g;
  if (genusSyn[g] && genusSyn[g].size === 1) return [...genusSyn[g]][0];
  if (genusSyn[g] && genusSyn[g].size > 1) { // mehrere Ziele: das häufigste
    return [...genusSyn[g]][0];
  }
  return null;
};

// ---------------- Fundort-Fragen
function geoSplit(items, cOf, level) {
  // level 0: Erdteil, 1: Großregion, 2: Länder
  const unit = (c) => (level === 0 ? ERD_OF[OF[c]] : level === 1 ? OF[c] : c);
  const groups = new Map(), unknown = [];
  for (const it of items) {
    const cs = cOf(it); if (!cs.length) { unknown.push(it); continue; }
    for (const u of new Set(cs.map(unit).filter(Boolean))) { if (!groups.has(u)) groups.set(u, new Set()); groups.get(u).add(it); }
  }
  if (groups.size < 2) return null;
  for (const g of groups.values()) unknown.forEach((u) => g.add(u));
  // Einheiten mit gleicher Artenmenge zusammenfassen
  const bySet = new Map();
  for (const [u, set] of groups) { const key = [...set].sort().join("|"); if (!bySet.has(key)) bySet.set(key, { units: [], set }); bySet.get(key).units.push(u); }
  if (bySet.size < 2) return null;
  const useful = [...bySet.values()].some((v) => v.set.size < items.length);
  if (!useful) return null;
  return { parts: [...bySet.values()], unknown };
}
const DN = new Intl.DisplayNames(["de"], { type: "region" });
const unitName = (u, level) => (level === 0 ? ERDTEIL[u].t : level === 1 ? REG[u].t : DN.of(u));
const unitCountries = (u, level) => (level === 0 ? ERDTEIL[u].r.flatMap((r) => REG[r].c) : level === 1 ? REG[u].c : [u]);
const unitBild = (u, level) => "karte:" + (level === 0 ? ERDTEIL[u].b : level === 1 ? { NAM: "NA", MAM: "MA", SAM: "SA", EUR: "EU", NAF: "AF", AFR: "AF", MAD: "MG", WAS: "WA", SAS: "AS", OAS: "AS", SOA: "SO", AUS: "OZ" }[u] : u);

// Zusammenbau: Literaturschlüssel + Fundorte
function pickBest(items, cands) {
  if (!cands) return null;
  if (!Array.isArray(cands)) return cands;
  const set = new Set(items); let best = null, bv = -1;
  for (const c of cands) { if (!c || !c.t) continue; const L = leaves(c.t); let n = 0; for (const x of items) if (L.has(x)) n++; const v = n + (c.mod ? 0.25 * c.mod : 0); if (n > 0 && v > bv) { bv = v; best = c.t; } }
  return best;
}
function compose(items, cOf, cands, opts, level = 0, inside = null) {
  items = [...new Set(items)];
  if (items.length === 1) return leaf(items);
  const best = pickBest(items, cands);
  const L = best ? leaves(best) : new Set();
  const cov = items.filter((x) => L.has(x)), unc = items.filter((x) => !L.has(x));
  if (!unc.length) return refine(prune(best, new Set(items)), cOf, opts);
  if (level <= 2) {
    const cIn = inside ? (x) => cOf(x).filter((c) => inside.has(c)) : cOf;
    const sp = geoSplit(items, cIn, level);
    if (sp) {
      const ls = sp.parts.map((p) => {
        const cs = [...new Set(p.units.flatMap((u) => unitCountries(u, level)))].filter((c) => !inside || inside.has(c));
        const names = p.units.map((u) => unitName(u, level)).sort((a, b) => a.localeCompare(b, "de"));
        return { t: "Fundort: " + (level === 2 && names.length > 6 ? names.slice(0, 6).join(", ") + " u. a." : names.join(", ")), alle: names, b: unitBild(p.units[0], level), g: cs, geo: 1, n: compose([...p.set], cOf, cands, opts, level + 1, new Set(cs)) };
      });
      return { l: ls, geo: level, u: sp.unknown.length ? 1 : 0 };
    }
    return compose(items, cOf, cands, opts, level + 1, inside);
  }
  if (cov.length) {
    const t = refine(prune(best, new Set(cov)), cOf, opts);
    return addNote(t, unc);
  }
  return leaf(items, opts.keinSchluessel);
}
// Mehrere Arten am Ende eines Merkmalswegs: zusätzlich über den Fundort trennen
function refine(t, cOf, opts) {
  if (!t) return t;
  if (isLeaf(t)) {
    if (t.taxa.length < 2 || !t.taxa.every((x) => BYK[x])) return t;
    const r = compose(t.taxa, cOf, null, { keinSchluessel: t.note || "Mit den Merkmalen der Literatur nicht weiter trennbar." });
    if (isLeaf(r)) return t;
    return r;
  }
  return { ...t, l: t.l.map((l) => ({ ...l, n: refine(l.n, cOf, opts) })) };
}
function addNote(t, unc) {
  if (!unc.length) return t;
  if (isLeaf(t)) return { ...t, auch: [...new Set([...(t.auch || []), ...unc])] };
  return { ...t, l: t.l.map((l) => ({ ...l, n: addNote(l.n, unc) })) };
}

// ---------------- Schlüssel je Gattung (Arten)
const GT_FOR = {};
for (const [og, t] of Object.entries(gtSpeciesTree)) for (const id of leaves(t)) { if (!id.startsWith("N:")) continue; const k = speciesKey(id.slice(2)); if (k) { const g = BYK[k].g; (GT_FOR[g] = GT_FOR[g] || new Set()).add(og); } }
const altTrees = ALT.k.map((k, i) => { try { return altTree(i); } catch (e) { return null; } });
const altFor = {}; // Gattung -> [{i, tree}]
altTrees.forEach((t, i) => { if (!t) return; const gs = new Set([...leaves(t)].filter((x) => BYK[x]).map((x) => BYK[x].g)); gs.forEach((g) => (altFor[g] = altFor[g] || []).push(i)); });
function epiKey(g, e) {
  const ks = GEN[g] || [];
  const ex = ks.find((k) => BYK[k].n.split(" ")[1] === e); if (ex) return ex;
  const pre = ks.filter((k) => BYK[k].n.split(" ")[1].startsWith(e)); if (pre.length === 1) return pre[0];
  const sk = speciesKey(g + " " + e); return sk;
}
const modTrees = {};
MODERN.forEach((m, mi) => {
  const q = "mod" + mi; QUELLEN[q] = { z: m.q, t: m.t };
  const node = (c, seen = new Set()) => { if (seen.has(c)) return null; seen.add(c); const ls = []; for (const [t, z] of m.c[c - 1]) { let ch; if (typeof z === "number") ch = node(z, new Set(seen)); else { const ks = z.split("|").map((x) => epiKey(m.gen, x.slice(2))).filter(Boolean); if (!ks.length) console.log("Modern: Art nicht gefunden", m.gen, z); ch = leaf(ks); } if (ch) ls.push({ t, w: flags(t), q, n: ch }); } return ls.length ? { l: ls } : null; };
  (modTrees[m.gen] = modTrees[m.gen] || []).push({ t: node(1), q });
});
const KEYS = {};
const STAT = { gattungen: 0, mitLit: 0, nurOrt: 0, arten: 0, artenLit: 0, artenEinzeln: 0 };
function speciesKeyFor(g) {
  const S = GEN[g]; const set = new Set(S);
  let best = null, bestCov = 0, bestQ = null;
  const cands = [];
  for (const i of altFor[g] || []) { const t = prune(altTrees[i], set); if (t) cands.push({ t, q: "alt" + i, mod: 1 }); }
  if (gtSpeciesTree[g]) { const t = prune(gtSpeciesTree[g], set, (id) => (id.startsWith("N:") ? speciesKey(id.slice(2)) : null)); if (t) cands.push({ t, q: "gt", mod: 0 }); }
  for (const gg of genusSyn[g] ? [] : []) void gg;
  // auch GT-Bäume anderer (alter) Gattungen, deren Arten heute hier stehen
  for (const og of GT_FOR[g] || []) if (og !== g) { const t = prune(gtSpeciesTree[og], set, (id) => (id.startsWith("N:") ? speciesKey(id.slice(2)) : null)); if (t) cands.push({ t, q: "gt", mod: 0 }); }
  for (const mt of modTrees[g] || []) { const t = prune(mt.t, set); if (t) cands.push({ t, q: mt.q, mod: 2 }); }
  for (const c of cands) { const cv = leaves(c.t).size + (c.mod ? 0.5 * c.mod : 0); if (cv > bestCov) { bestCov = cv; best = c.t; bestQ = c.q; } }
  const allCands = cands;
  let tree = S.length === 1 ? leaf(S) : compose(S, (k) => geoOf(k), allCands.length ? allCands : null, { keinSchluessel: "Die Literatur enthält keinen Schlüssel für diese Arten." });
  for (const z of ZUSATZ.filter((x) => x.gen === g)) {
    const a = z.alt === "*" ? "*" : epiKey(g, z.alt), nk = epiKey(g, z.neu); if (!a || !nk) { console.log("Zusatz: Art fehlt", g, z.alt, z.neu); continue; }
    QUELLEN["zus:" + z.q] = { t: z.q, z: z.q + " (Differentialdiagnose in der Erstbeschreibung; als Schlüsselpaar eigene Ableitung)" };
    let used = 0;
    const rep = (n) => {
      if (isLeaf(n)) {
        if (a === "*" ? !(n.auch || []).includes(nk) : !n.taxa.includes(a)) return n;
        used++;
        const rest = n.taxa.filter((x) => x !== nk);
        return { l: [ { t: z.tNeu, w: flags(z.tNeu), q: "zus:" + z.q, n: leaf([nk]) }, { t: z.tAlt, w: flags(z.tAlt), q: "zus:" + z.q, n: { ...n, taxa: rest, auch: (n.auch || []).filter((x) => x !== nk) } } ] };
      }
      return { ...n, l: n.l.map((l) => ({ ...l, n: rep(l.n) })) };
    };
    tree = rep(tree); if (!used) console.log("Zusatz nicht eingebaut (Art nicht im Baum):", g, z.alt);
  }
  STAT.gattungen++; if (best) STAT.mitLit++; STAT.arten += S.length; if (best) STAT.artenLit += leaves(best).size;
  return { tree, q: bestQ };
}

// ---------------- Schlüssel je Familie (Gattungen) und Familienschlüssel je Erdteil
function genusTreeFor(gens) {
  if (!gtGenusTree) return null;
  return prune(gtGenusTree, new Set(gens.map((g) => "G:" + g)), (id) => { const g = gtGenusMap(id); return g ? "G:" + g : null; });
}
function familyGenusKey(f) {
  const gens = [...FAM[f]];
  const best = genusTreeFor(gens);
  const items = gens.map((g) => "G:" + g);
  const tree = gens.length === 1 ? leaf(items) : compose(items, (id) => genGeo(id.slice(2)).c, best, { keinSchluessel: "Für diese Gattungen gibt es in der ausgewerteten Literatur keinen gemeinsamen Schlüssel." });
  return tree;
}
function familyKeyForErdteil(e) {
  const fams = new Set();
  for (const [g, ks] of Object.entries(GEN)) { const gg = genGeo(g); const es = new Set(gg.c.map((c) => ERD_OF[OF[c]])); if (es.has(e) || gg.unk) fams.add(famOfGen[g]); }
  const famSet = new Set([...fams].map((f) => "F:" + f));
  let best = null;
  if (gtGenusTree) {
    // nur Gattungen, die in diesem Erdteil vorkommen
    const gensHere = new Set(Object.keys(GEN).filter((g) => { const gg = genGeo(g); return gg.unk || gg.c.some((c) => ERD_OF[OF[c]] === e); }).map((g) => "G:" + g));
    const t = prune(gtGenusTree, gensHere, (id) => { const g = gtGenusMap(id); return g ? "G:" + g : null; });
    if (t) best = collapse(mapLeaves(t, (id) => "F:" + famOfGen[id.slice(2)]));
  }
  const tree = compose([...famSet], () => [], best, { keinSchluessel: "Diese Familien lassen sich mit der ausgewerteten Literatur hier nicht trennen." }, 3);
  return tree;
}
function mapLeaves(n, f) { if (isLeaf(n)) return leaf(n.taxa.map(f), n.note); return { ...n, l: n.l.map((l) => ({ ...l, n: mapLeaves(l.n, f) })) }; }

// ---------------- Baum -> nummerierte Paare
function emit(id, title, tree, meta = {}) {
  const C = [];
  const target = (n) => {
    if (isLeaf(n)) return leafTarget(n);
    const idx = C.length; C.push(null);
    C[idx] = n.l.map((l) => ({ t: l.t, b: l.b, w: l.w || undefined, q: l.q, g: l.g, u: n.u ? 1 : undefined, alle: l.alle && l.alle.length > 6 ? l.alle : undefined, z: target(l.n) }));
    return idx + 1;
  };
  if (isLeaf(tree)) { KEYS[id] = { t: title, ...meta, c: [], end: leafTarget(tree) }; return; }
  target(tree);
  KEYS[id] = { t: title, ...meta, c: C };
}
function leafTarget(n) {
  const out = { s: [], g: [], f: [] };
  for (const t of n.taxa) {
    if (t.startsWith("G:")) out.g.push(t.slice(2));
    else if (t.startsWith("F:")) out.f.push(t.slice(2));
    else if (t.startsWith("T:") || t.startsWith("GRP:") || t.startsWith("N:")) continue;
    else if (BYK[t]) out.s.push(t);
  }
  const z = {};
  if (out.s.length) z.s = out.s; if (out.g.length) z.g = out.g; if (out.f.length) z.f = out.f;
  if (n.note) z.n = n.note; if (n.auch && n.auch.length) z.a = n.auch;
  return z;
}

// ---------------- Ausgabe
for (const g of Object.keys(GEN)) { const r = speciesKeyFor(g); emit("G:" + g, "Arten der Gattung " + g, r.tree, { r: "gattung", taxon: g, fam: famOfGen[g] }); }
for (const f of Object.keys(FAM)) emit("F:" + f, "Gattungen der Familie " + f, familyGenusKey(f), { r: "familie", taxon: f });
for (const e of Object.keys(ERDTEIL)) emit("E:" + e, "Familien – " + ERDTEIL[e].t, familyKeyForErdteil(e), { r: "erdteil", taxon: ERDTEIL[e].t });
const BYN_ALL = {}; window.MANTODEA.species.forEach((x) => (BYN_ALL[x.n] = x.k));
for (const [id, k] of Object.entries(OBEN.keys)) {
  for (const C of k.c) for (const l of C) if (l.z && l.z.sn) { l.z.s = l.z.sn.map((n) => BYN_ALL[n]).filter(Boolean); const miss = l.z.sn.filter((n) => !BYN_ALL[n]); if (miss.length) console.log("Fossil fehlt:", miss); delete l.z.sn; }
  KEYS[id] = k;
}

// Artdaten kompakt: k -> [Name, Autor, Familie, Länder]
const ART = {}; SP.forEach((x) => (ART[x.k] = [x.n, x.a || "", x.f || "", geoOf(x.k).join(" "), (GEO[x.k] && GEO[x.k].q) || ""]));
FOS.forEach((x) => (ART[x.k] = [x.n, x.a || "", x.f || "fossil", "", "fossil"]));
const FOSSIL = FOS.map((x) => [x.k, x.n, x.a || "", x.f || ""]);
Object.assign(QUELLEN, OBEN.quellen || {});
const outObj = { stand: new Date().toISOString().slice(0, 10), keys: KEYS, quellen: QUELLEN, art: ART, fossil: FOSSIL, erdteile: Object.fromEntries(Object.entries(ERDTEIL).map(([k, v]) => [k, { t: v.t, b: v.b, c: v.r.flatMap((r) => REG[r].c) }])), statistik: STAT };
fs.writeFileSync(path.join(R, "data", "bestimmung.js"), "window.MANTODEA_BK=" + JSON.stringify(outObj) + ";\n");
const size = fs.statSync(path.join(R, "data", "bestimmung.js")).size;
console.log("Schlüssel:", Object.keys(KEYS).length, "Größe", (size / 1024).toFixed(0), "KB", STAT, "GT-Gattungsbaum:", gtGenusTree ? leaves(gtGenusTree).size + " Blätter" : "FEHLT");
if (process.env.DIAG) {
  for (const h of H.filter((x) => x[0] === "sf")) { const t = expandSF(h[1], 0, "gattung"); console.log(h[1], t ? (isLeaf(t) ? "BLATT " + t.taxa.slice(0, 6).join(",") + (t.note || "") : leaves(t).size + " Blätter") : "NULL"); }
}
if (process.env.DIAG2) {
  const L = leaves(gtGenusTree); const cur = new Set(); const unm = [];
  for (const id of L) { const g = gtGenusMap(id); if (g) cur.add(g); else unm.push(id); }
  console.log("heutige Gattungen im GT-Baum:", cur.size, "von", Object.keys(GEN).length, "| nicht zuordenbar:", unm.length, unm.slice(0, 40).join(" "));
  let fr = 0, de = 0; const frSyn = new Set();
  (function walk(n) { if (isLeaf(n)) return; n.l.forEach((l) => { if ((l.w || "").includes("fr")) fr++; else de++; walk(l.n); }); })(gtGenusTree);
  console.log("Gattungsbaum: deutsch", de, "französisch", fr);
}

if (process.env.FRDUMP) fs.writeFileSync(process.env.FRDUMP, [...FRD.entries()].map(([k, v]) => k + "\t" + v).join("\n"));

if (process.env.DIAG3) {
  const t = expandSF("Perlamantinae", 0, "gattung"); console.log(JSON.stringify([...leaves(t)]));
  console.log("map", gtGenusMap("G:Amorphoscelis"), gtGenusMap("G:Perlamantis"), genGeo("Amorphoscelis").c.slice(0,5));
}
if (process.env.DIAG4) { const g = process.env.DIAG4; const t = gtSpeciesTree[g]; const L = t ? [...leaves(t)] : []; console.log(g, "GT-Blätter", L.length, "zugeordnet", L.filter((id) => id.startsWith("N:") && speciesKey(id.slice(2))).length, L.filter((id) => !(id.startsWith("N:") && speciesKey(id.slice(2)))).slice(0, 15)); }
// ---------- Ehrliche Statistik: wie wird jede Art erreicht?
{
  const st = { merkmal: 0, nurOrt: 0, untrennbar: 0, einzig: 0, auch: 0 };
  for (const [g, ks] of Object.entries(GEN)) {
    const K = KEYS["G:" + g];
    if (ks.length === 1) { st.einzig++; continue; }
    const res = {}; // k -> {m: über Merkmal, alone: einzeln am Ende}
    const walk = (c, morph, seen) => {
      if (seen.has(c)) return; seen.add(c);
      for (const l of K.c[c - 1]) {
        const m = morph || !l.geo;
        if (typeof l.z === "number") walk(l.z, m, new Set(seen));
        else {
          const s = l.z.s || [];
          for (const k of s) { const r = (res[k] = res[k] || { m: false, alone: false }); if (s.length === 1) { r.alone = true; if (m) r.m = true; } }
          for (const k of l.z.a || []) res[k] = res[k] || { m: false, alone: false, auch: true };
        }
      }
    };
    if (K.c.length) walk(1, false, new Set()); else for (const k of (K.end.s || [])) res[k] = { m: false, alone: (K.end.s || []).length === 1 };
    for (const k of ks) { const r = res[k] || {}; if (r.alone && r.m) st.merkmal++; else if (r.alone) st.nurOrt++; else if (r.auch) st.auch++; else st.untrennbar++; }
  }
  STAT.wege = st;
  const o = JSON.parse(fs.readFileSync(path.join(R, "data", "bestimmung.js"), "utf8").replace(/^window\.MANTODEA_BK=/, "").replace(/;\s*$/, ""));
  o.statistik = STAT;
  fs.writeFileSync(path.join(R, "data", "bestimmung.js"), "window.MANTODEA_BK=" + JSON.stringify(o) + ";\n");
  console.log("Wege zur Art:", st);
}
if (process.env.DIAG5) { const g = process.env.DIAG5; const set = new Set(GEN[g]); for (const mt of modTrees[g] || []) { const t = prune(mt.t, set); console.log("mod", mt.q, t ? leaves(t).size : 0); } for (const i of altFor[g] || []) { const t = prune(altTrees[i], set); console.log("alt", i, ALT.k[i].t, t ? leaves(t).size : 0); } if (gtSpeciesTree[g]) { const t = prune(gtSpeciesTree[g], set, (id) => (id.startsWith("N:") ? speciesKey(id.slice(2)) : null)); console.log("gt", t ? leaves(t).size : 0); } }
