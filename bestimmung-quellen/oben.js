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

// ---------- Fossilien: für Laien am sichersten über Einschlussart und Fundschicht
const F = (names, n) => ({ sn: names, n });
keys.fossil = {
  t: "Fossile Gottesanbeterinnen", r: "fossil",
  info: "Fossilien werden fast nur nach Fundschicht und Flügeladerung bestimmt. Der Schlüssel trennt deshalb nach Einschluss (Bernstein oder Gestein) und Fundort. Wo mehrere Arten aus derselben Schicht stammen, ist eine Bestimmung nur mit den Originalbeschreibungen möglich.",
  c: [
    [L("Im Bernstein eingeschlossen (durchsichtiges, gelbes bis rotbraunes fossiles Harz, das Tier ist dreidimensional erhalten)", "fossil:bernstein", 2),
     L("Als Abdruck im Gestein (Schiefer, Kalk, Mergel); meist nur Flügel oder flachgedrückter Körper", "fossil:stein", 3)],
    [L("Bernstein aus Myanmar (Burma-Bernstein, Kreidezeit, etwa 99 Mio. Jahre)", "karte:SO", { sn: ["Burmantis asiatica", "Burmantis hexispinea", "Jersimantis burmiticus"], n: "Drei Arten aus Burma-Bernstein; Trennung nur nach den Originalbeschreibungen (Grimaldi 2003; Li & Huang 2018)." }),
     L("Bernstein aus dem Libanon (Kreidezeit)", "karte:WA", { sn: ["Burmantis lebanensis"] }),
     L("Bernstein aus Spanien (Kreidezeit)", "karte:EU", { sn: ["Aragonimantis aenigma", "Burmantis zherikhini"], n: "Zwei Arten aus spanischem Bernstein (Delclòs et al. 2016)." }),
     L("Bernstein aus New Jersey, USA (Kreidezeit)", "karte:NA", { sn: ["Ambermantis wozniaki", "Jersimantis luzzii"], n: "Zwei Arten aus New-Jersey-Bernstein (Grimaldi 1997, 2003)." }),
     L("Bernstein von der Taimyr-Halbinsel, Sibirien (Oberkreide)", "karte:AS", { sn: ["Chaeteessites minutissimus", "Electromantis sukatshevae", "Archimantis zherikhini"], n: "Drei Arten aus Taimyr-Bernstein (Gratshev & Zherikhin 1993; Vršanský 2002 – die fossile „Archimantis“ heißt heute Jantarimantis)." }),
     L("Bernstein aus der Oise, Frankreich (Eozän)", "karte:EU", { sn: ["Pseudomantoida extendidera"] }),
     L("Baltischer Bernstein (Ostseeraum, Eozän) oder Fundschicht unbekannt", "karte:EU", { sn: ["Chaeteessa burmeisteri", "Chaeteessa brevialata", "Mantoida matthiasglinki"], n: "Die Fundschicht dieser Arten ließ sich in der ausgewerteten Literatur nicht sicher belegen (Giebel 1862 beschrieb vor allem Einschlüsse aus baltischem Bernstein). Bitte Originalbeschreibung prüfen." })],
    [L("Kreidezeitliche Schichten Transbaikaliens, Russland (z. B. Baissa am Witim, Selenga)", "karte:AS", { sn: ["Baissomantis maculata", "Baissomantis picta", "Cretomantis larvalis", "Amorphoscelites sharovi", "Cretophotina selenginensis", "Cretophotina serotina", "Cretophotina tristriata", "Vitimiphotina corrugata", "Vitimophotina corrugata"], n: "Mehrere Arten aus denselben Schichten (Gratshev & Zherikhin 1993/1994; Vršanský 2002). Trennung nur über Flügeladerung nach den Originalbeschreibungen." }),
     L("Mongolei (Kreidezeit)", "karte:AS", { sn: ["Cretophotina mongolica"] }),
     L("Kasachstan (Karatau, Jura, oder jüngere Schichten)", "karte:WA", { sn: ["Juramantis initialis", "Kazakhophotina corrupta"], n: "Juramantis initialis stammt aus dem Jura von Karatau und ist eine der ältesten bekannten Fangschrecken." }),
     L("Russischer Ferner Osten (Sichote-Alin, Oligozän)", "karte:AS", { sn: ["Megaphotina sichotensis"] }),
     L("Brasilien (Crato-Formation, Unterkreide)", "karte:SA", { sn: ["Santanmantis axelrodi", "Cretophotina santanensis"], n: "Zwei Arten aus der Crato-Formation." }),
     L("Labrador, Kanada (Kreidezeit)", "karte:NA", { sn: ["Labradormantis guilbaulti"] }),
     L("Menat, Frankreich (Paläozän)", "karte:EU", { sn: ["Arvernineura insignis", "Archaeophlebia enigmatica", "Prochaeradodis enigmaticus"], n: "Achtung: Prochaeradodis enigmaticus ist nach Cui et al. (2018) keine Gottesanbeterin, sondern eine Schabe (Blattodea)." }),
     L("USA, Colorado (Eozän)", "karte:NA", { sn: ["Eobruneria tessellata", "Lithophotina floccosa"], n: "Zwei Arten aus dem Eozän Nordamerikas (Cockerell; Sharov 1962)." }),
     L("England, Isle of Wight (Eozän)", "karte:EU", { sn: ["Protohierodula crabbi"], n: "Nach Schubnel & Nel (2019) keiner heutigen Familie sicher zuzuordnen." }),
     L("Deutschland (Miozän, z. B. Öhningen am Bodensee, Böttingen)", "karte:EU", { sn: ["Mantis protogaea", "Mantis boettingensis"], n: "Zwei Arten aus dem Miozän Süddeutschlands." }),
     L("Erdaltertum: Karbon oder Perm (Russland, Saarland)", "fossil:stein", { sn: ["Palaeomantis aestiva", "Palaeomantis apicalis", "Palaeomantis laeta", "Palaeomantis schmidti", "Palaeomantis sylvaensis", "Palaeomantis tshekardensis", "Stefanomioptera hangardi", "Stefanomioptera ostertali"], n: "Diese Tiere aus dem Erdaltertum werden zwar unter Mantodea geführt, gehören aber nach heutiger Auffassung zu einer ausgestorbenen Insektengruppe (Miomoptera) und sind keine Gottesanbeterinnen." })],
  ],
};

const quellen = {
  eigen: { t: "Eigene Zusammenstellung", z: "Eigene Zusammenstellung aus der ausgewerteten Literatur (Mantodea der Welt)." },
};
module.exports = { keys, quellen };
