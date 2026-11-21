// Selbst geschriebene obere Ebenen des Schlüssels.
// Ziele (z): Zahl = nächstes Paar im selben Schlüssel; {k:"ID"} = weiter in anderem Schlüssel; {n:"Text"} = Ende mit Hinweis.
"use strict";
const { R, ERDTEIL } = require("./regionen.js");
const L = (t, b, z, extra) => ({ t, b, z, ...(extra || {}) });

const keys = {};

keys.start = {
  t: "Ist es eine Gottesanbeterin?", r: "ordnung", taxon: "Mantodea",
  info: "Beginne hier, wenn du nicht sicher bist, ob dein Tier überhaupt eine Gottesanbeterin (Fangschrecke, Mantodea) ist. Schau dir das Tier von der Seite an; eine Lupe (10-fach) hilft bei Dornen und Flecken.",
  c: [
    [L("Vorderbeine sind Fangbeine: Sie werden vor dem Kopf erhoben getragen. Schenkel und Schiene tragen an der Innenseite Reihen spitzer Dornen; die Schiene klappt wie die Klinge eines Taschenmessers gegen den Schenkel.", "fang:ja", 2),
     L("Vorderbeine sind gewöhnliche Laufbeine, ohne Dornenreihen und ohne Klappmechanismus.", "verwechsler:stab", { n: "Keine Gottesanbeterin. Tiere mit sehr dünnem, zweigartigem Körper und Laufbeinen sind meist Stabschrecken (Phasmatodea)." })],
    [L("Am Kopf sitzt ein langer, gegliederter Saugrüssel, der in Ruhe unter den Körper zurückgeklappt ist. Keine Kiefer.", "verwechsler:wanze", { n: "Keine Gottesanbeterin, sondern eine Raubwanze (Reduviidae, z. B. Fangwanzen der Gattung Phymata). Auch sie haben Fangbeine." }),
     L("Kopf mit kauenden Mundwerkzeugen (zwei seitlich arbeitende Kiefer und Taster), kein Rüssel.", "auge:rund", 3)],
    [L("Vier gleich große, glasklare Flügel mit dichtem Adernetz, in Ruhe dachartig über dem Hinterleib getragen; die Hinterflügel sind nicht fächerartig gefaltet. Fühler kurz.", "verwechsler:fanghaft", { n: "Keine Gottesanbeterin, sondern ein Fanghaft (Mantispidae, Netzflügler). In Mitteleuropa z. B. Mantispa styriaca." }),
     L("Flügel anders: Vorderflügel (Deckflügel) schmal und meist derb wie Pergament, darunter die fächerartig gefalteten Hinterflügel; oder Flügel verkürzt bzw. fehlend. Fühler lang und dünn.", "habitus", 4)],
    [L("Erstes Glied des Fangbeins (die Hüfte) kurz und versteckt. Tier immer flügellos, Halsschild kurz. Nur im südlichen und östlichen Afrika.", "verwechsler:gladiator", { n: "Keine Gottesanbeterin, sondern eine Gladiatorschrecke (Mantophasmatodea)." }),
     L("Erstes Glied des Fangbeins (die Hüfte) lang und frei beweglich, fast so lang wie der Schenkel. Kopf dreieckig, nach allen Seiten drehbar, mit großen Komplexaugen.", "ort:huefte", 5)],
    [L("Das Tier ist in Bernstein oder in Gestein eingeschlossen (Fossil).", "fossil:bernstein", { k: "fossil" }),
     L("Lebendes oder gesammeltes heutiges Tier.", "habitus", { k: "erdteil" })],
  ],
};

keys.erdteil = {
  t: "Wo wurde das Tier gefunden?", r: "erdteil-wahl",
  info: "Fangschrecken sind nicht weltweit gleich verbreitet. Viele Familien und Gattungen kommen nur in einem Erdteil vor. Wähle das Fundgebiet; bei Tieren aus Zucht oder Zoohandel ist die Herkunft oft unbekannt – dann nimm den Erdteil, aus dem die Art laut Verkäufer stammt, oder beginne direkt bei der Familie.",
  c: [Object.entries(ERDTEIL).map(([k, v]) => L(v.t, "karte:" + v.b, { k: "E:" + k }, { g: v.r.flatMap((r) => R[r].c), geo: 1 }))],
};

const quellen = {
  eigen: { t: "Eigene Zusammenstellung", z: "Eigene Zusammenstellung aus der ausgewerteten Literatur (Mantodea der Welt)." },
};
module.exports = { keys, quellen };
