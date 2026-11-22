// Kurz-Bestimmung je Gattung (Quelle für data/gbestimmung.js, Bau: node bestimmung-quellen/gb_build.js)
// Nur Gattungen, in denen die Literatur JEDE gültige Art über äußere Merkmale trennt.
// Merkmale: so wenige wie möglich; Bilder: src in data/gbilder/<gattung>/, foto:true = iNaturalist-Foto (credits),
// pf = Pfeile {x,y Ziel in %, lx,ly Schild in %, t Text}.
const DBX = "https://www.dropbox.com/scl/fo/bvj7k39fqvoaj7yqlc07p/";
const RK = "?rlkey=kj65w4xi1e5f5bj3jfyarkrw0&dl=0";
const GT = DBX + "AA8g565FK1ZCR8GTIXwBODc/Giglio-Tos%201927%20-%20Das%20Tierreich.%2050.%20Lieferung.%20Orthoptera%20-%20Mantidae.pdf" + RK;
module.exports = {
  Sphodropoda: {
    kurzquelle: "Milledge 2005",
    quellen: [{ t: "Milledge, G. A. (2005): Revision of the genera Sphodropoda, Trachymantis and Zopheromantis (Mantodea: Mantidae: Mantinae). Records of the Australian Museum 57: 191–210", u: DBX + "ABQ56XWCazNUYbKxAxaB1-c/Milledge%202005%20-%20Revision%20of%20the%20Genera%20Sphodropoda%2C%20Trachymantis%20and%20Zopheromantis%20%28Mantodea%2C%20Mantidae%2C%20Mantinae%29.pdf" + RK }],
    arten: { "Sphodropoda tristis": { farbe: "#8a5a2b" }, "Sphodropoda quinquedens": { farbe: "#c0392b" }, "Sphodropoda viridis": { farbe: "#3f8f3a" }, "Sphodropoda lepida": { farbe: "#7d3c98" } },
    merkmale: [
      { titel: "Innenseite der Vorderhüfte", wo: "Fangbein von vorn ansehen: die Hüfte ist das lange Glied direkt unter dem Kopf.",
        spalten: [
          { t: "Weiße Querbänder", art: "Sphodropoda quinquedens", bilder: [
            { src: "h_quinquedens.jpg", foto: true, pf: [{ x: 57, y: 64, lx: 46, ly: 93, t: "Querbänder" }] },
            { src: "bein_quinquedens.png", pf: [{ x: 46, y: 45, lx: 2, ly: 90, t: "Querbänder" }] }] },
          { t: "Dunkelgrau, weiße Höcker nur am Rand", art: "Sphodropoda tristis", bilder: [
            { src: "h_tristis.jpg", foto: true, pf: [{ x: 36, y: 55, lx: 44, ly: 93, t: "Höcker am Rand" }] },
            { src: "bein_tristis.png", pf: [{ x: 26, y: 40, lx: 2, ly: 92, t: "Höcker am Rand" }] }] },
          { t: "Ganz grün, ohne Zeichnung", weiter: 2, arten: ["Sphodropoda viridis", "Sphodropoda lepida"], bilder: [
            { src: "h_viridis.jpg", foto: true, pf: [{ x: 71, y: 55, lx: 40, ly: 8, t: "ganz grün" }] },
            { src: "bein_viridis.png", pf: [{ x: 10, y: 45, lx: 30, ly: 92, t: "ohne Zeichnung" }] }] },
        ] },
      { titel: "Adern der Deckflügel", nurWenn: "Nur nötig, wenn die Hüfte ganz grün ist.", wo: "Auf die großen Längsadern in der Mitte des Deckflügels schauen.",
        spalten: [
          { t: "Adern grün", art: "Sphodropoda viridis", bilder: [
            { src: "w_viridis.jpg", foto: true, pf: [{ x: 52, y: 42, lx: 40, ly: 92, t: "Adern grün" }] },
            { src: "flf_viridis.png", cap: "Zeichnung: Milledge 2005, nach Beschreibung eingefärbt", pf: [{ x: 31, y: 72, lx: 40, ly: 90, t: "Adern grün" }] }] },
          { t: "Adern purpurbraun gesäumt – Flügel wirkt gebändert", art: "Sphodropoda lepida", bilder: [
            { src: "flf_lepida.png", cap: "Zeichnung: Milledge 2005, nach Beschreibung eingefärbt (kein Foto lebender Tiere bekannt)", pf: [{ x: 43, y: 75, lx: 30, ly: 90, t: "Adern purpurbraun" }] }] },
        ] },
    ],
    hinweis: "Die Körperfarbe allein hilft nicht: S. tristis und S. quinquedens kommen braun und grün vor.",
    credits: { "h_tristis.jpg": { obs: 226652768, user: "jayn" }, "h_quinquedens.jpg": { obs: 123031889, user: "Alec Karcz" }, "h_viridis.jpg": { obs: 253295567, user: "simono" }, "w_viridis.jpg": { obs: 201532079, user: "hammo1970" } },
  },

  Metallyticus: {
    kurzquelle: "Wieland 2008",
    quellen: [{ t: "Wieland, F. (2008): The genus Metallyticus reviewed (Insecta: Mantodea). Species, Phylogeny and Evolution 1(3): 147–170 (mit englischer Übersetzung des Schlüssels von Giglio-Tos 1927)", u: DBX + "AMvXxtwcLvTJpN8xiVPQXbk/Wieland%202008c%20-%20The%20genus%20Metallyticus%20reviewed%20%28Insecta%2C%20Mantodea%29.pdf" + RK }],
    arten: { "Metallyticus splendidus": { farbe: "#1b9a6a" }, "Metallyticus semiaeneus": { farbe: "#3f7fbf" }, "Metallyticus pallipes": { farbe: "#b07d2a" }, "Metallyticus violaceus": { farbe: "#6a3fa0" }, "Metallyticus fallax": { farbe: "#2b2b3a" } },
    merkmale: [
      { titel: "Farbe der Fangbeine (Hüfte und Schenkel)", wo: "Von oben auf den Vorderkörper schauen: die Fangbeine liegen links und rechts neben dem kurzen Halsschild.",
        spalten: [
          { t: "Metallisch grün", weiter: 2, arten: ["Metallyticus splendidus", "Metallyticus semiaeneus"], bilder: [
            { src: "k1a.jpg", foto: true, pf: [{ x: 18, y: 62, lx: 4, ly: 92, t: "grün glänzend" }] }] },
          { t: "Gelbbraun", art: "Metallyticus pallipes", bilder: [
            { src: "k3b.jpg", foto: true, pf: [{ x: 36, y: 42, lx: 4, ly: 92, t: "gelbbraun" }] }] },
          { t: "Schwarz mit gelbem Saum + 2 gelbe Flecken am Halsschild", art: "Metallyticus violaceus", bilder: [
            { src: "k4a.jpg", foto: true, pf: [{ x: 21, y: 42, lx: 4, ly: 10, t: "gelber Saum" }, { x: 32, y: 66, lx: 44, ly: 92, t: "2 Flecken" }, { x: 60, y: 71, lx: 44, ly: 92, t: "2 Flecken" }] }] },
          { t: "Ganz schwarz, Halsschild ohne Flecken", art: "Metallyticus fallax", bilder: [
            { src: "k3a.jpg", foto: true, pf: [{ x: 20, y: 55, lx: 4, ly: 92, t: "ganz schwarz" }] }] },
        ] },
      { titel: "Hinterflügel", nurWenn: "Nur nötig, wenn die Fangbeine grün sind.", wo: "Hinterflügel beim Abflug ansehen oder bei einem toten Tier den Deckflügel anheben.",
        spalten: [
          { t: "Rauchig getrübt", art: "Metallyticus splendidus", bilder: [
            { src: "wieland_fig15.png", filter: "rauch", cap: "Zeichnung: Wieland 2008, Fig. 15 (Tönung ergänzt)", pf: [{ x: 55, y: 45, lx: 30, ly: 90, t: "rauchig" }] }] },
          { t: "Glasklar", art: "Metallyticus semiaeneus", bilder: [
            { src: "wieland_fig15.png", cap: "Zeichnung: Wieland 2008, Fig. 15", pf: [{ x: 55, y: 45, lx: 30, ly: 90, t: "glasklar" }] }] },
        ] },
    ],
    hinweis: "Das Foto für „schwarz mit gelbem Saum“ zeigt eine Larve von M. violaceus; die Zeichnung ist dort schon gut zu sehen. Von M. semiaeneus gibt es kein Foto eines lebenden Tieres.",
    credits: { "k1a.jpg": { obs: 89163064, user: "Albert Kang" }, "k3b.jpg": { obs: 203650158, user: "willbrooks" }, "k4a.jpg": { obs: 89163904, user: "Albert Kang" }, "k3a.jpg": { obs: 90490348, user: "Albert Kang" } },
  },

  Brancsikia: {
    kurzquelle: "Roy & Schütte 2016",
    quellen: [{ t: "Roy, R. & Schütte, K. (2016): Mises au point sur le genre Brancsikia Saussure & Zehntner (Mantodea, Epaphroditidae). Bulletin de la Société entomologique de France 121(3): 269–282", u: DBX + "AEHPzekR6OTO_7f2q598XYo/Roy%20%26%20Sch%C3%BCtte%202016%20-%20Mises%20au%20point%20sur%20le%20genre%20Brancsikia%20Saussure%20%26%20Zehntner%20%28Mantodea%2C%20Epaphroditidae%29.pdf" + RK }],
    arten: { "Brancsikia freyi": { farbe: "#a0522d" }, "Brancsikia aeroplana": { farbe: "#5b6b2f" } },
    merkmale: [
      { titel: "Form des Halsschilds (Umriss von oben)", wo: "Von oben auf das blattartig verbreiterte Halsschild schauen. Männchen und Weibchen sehen verschieden aus – beide sind gezeigt (alle Zeichnungen im gleichen Maßstab).",
        spalten: [
          { t: "♂ schmal, fast ohne Seitenlappen · ♀ hinten am breitesten, Vorderränder gerade und schräg", art: "Brancsikia freyi", bilder: [
            { src: "f_freyi.jpg", foto: true, pf: [{ x: 90, y: 73, lx: 30, ly: 94, t: "♀ hinten am breitesten" }] },
            { src: "hals_freyi_m.png", cap: "♂ – Zeichnung: Roy & Schütte 2016, Fig. 12", pf: [{ x: 67, y: 50, lx: 52, ly: 85, t: "♂ schmal" }] },
            { src: "hals_freyi_w.png", cap: "♀ – Zeichnung: Roy & Schütte 2016, Fig. 18", pf: [{ x: 86, y: 62, lx: 50, ly: 12, t: "♀ hinten breit" }] }] },
          { t: "♂ großer dreieckiger Schild, vorn am breitesten · ♀ großer rundlicher Schild mit gebogenen Seiten", art: "Brancsikia aeroplana", bilder: [
            { src: "f_aeroplana.jpg", foto: true, pf: [{ x: 82, y: 35, lx: 30, ly: 94, t: "♂ vorn am breitesten" }] },
            { src: "hals_aeroplana_m.png", cap: "♂ – Zeichnung: Roy & Schütte 2016, Fig. 30", pf: [{ x: 94, y: 33, lx: 40, ly: 90, t: "♂ großer Lappen" }] },
            { src: "hals_aeroplana_w.png", cap: "♀ – Zeichnung: Roy & Schütte 2016, Fig. 34", pf: [{ x: 89, y: 55, lx: 40, ly: 12, t: "♀ Seiten gerundet" }] }] },
        ] },
    ],
    hinweis: "Zur Kontrolle mit der Lupe: B. aeroplana hat 5, B. freyi 4 Dornen an der Außenkante des Vorderschenkels.",
    credits: {},
  },

  Idolomorpha: {
    kurzquelle: "Giglio-Tos 1927",
    quellen: [{ t: "Giglio-Tos, E. (1927): Das Tierreich 50. Orthoptera Mantidae. Berlin & Leipzig: de Gruyter (Schlüssel der Arten von Idolomorpha)", u: GT }],
    arten: { "Idolomorpha lateralis": { farbe: "#8e44ad" }, "Idolomorpha dentifrons": { farbe: "#8a6d3b" }, "Idolomorpha madagascariensis": { farbe: "#d35d8a" }, "Idolomorpha sagitta": { farbe: "#5d6d7e" } },
    merkmale: [
      { titel: "Zeichnung der Deckflügel", wo: "Die Deckflügel von oben ansehen, besonders das Flügelmal (heller Fleck etwa in der Mitte des Vorderrands) und das Mittelfeld.",
        spalten: [
          { t: "Breite violette Längsbinde mitten im Mittelfeld (ohne Binde: nur bräunliche Punkte an beiden Enden des Flügelmals, nicht rosa)", art: "Idolomorpha lateralis", bilder: [
            { src: "f_lateralis.jpg", foto: true, pf: [{ x: 75, y: 42, lx: 30, ly: 88, t: "violette Längsbinde" }] }] },
          { t: "Unregelmäßige rauchige Flecken am Hinterrand des Flügelmals", art: "Idolomorpha dentifrons", bilder: [
            { src: "f_dentifrons.jpg", foto: true, pf: [{ x: 48, y: 30, lx: 30, ly: 88, t: "rauchige Flecken" }] }] },
          { t: "Mittelfeld von der Basis bis über das Flügelmal rosa getönt", art: "Idolomorpha madagascariensis" },
          { t: "Ohne bräunliche Flecken am Flügelmal", art: "Idolomorpha sagitta" },
        ] },
    ],
    hinweis: "Alle Merkmale stammen aus dem alten Schlüssel von Giglio-Tos (1927); eine moderne Revision fehlt. Die Färbung kann je nach Alter und Erhaltung schwanken. Für I. madagascariensis und I. sagitta gibt es keine sicher bestimmten Fotos.",
  },

  Pliacanthopus: {
    kurzquelle: "Wu & Liu 2022",
    quellen: [{ t: "Wu, C. & Liu, C.-X. (2022): New and little-known species of genus Pliacanthopus Giglio-Tos (Dictyoptera, Mantodea, Nanomantidae). Journal of Natural History 56. doi:10.1080/00222933.2022.2117106", u: DBX + "ACQvuAzwNGx4ubB75qWf5Ec/Wu%20%26%20Liu%202022b%20%E2%80%93%20New%20and%20little-known%20species%20of%20genus%20Pliacanthopus%20Giglio-Tos%20%28Dictyoptera%2C%20Mantodea%2C%20Nanomantidae%29.pdf" + RK }],
    arten: { "Pliacanthopus mantispoides": { farbe: "#7f8c8d" }, "Pliacanthopus tricolor": { farbe: "#2c3e50" }, "Pliacanthopus bimaculatus": { farbe: "#c0392b" }, "Pliacanthopus malayanus": { farbe: "#27ae60" }, "Pliacanthopus flavus": { farbe: "#d4a017" }, "Pliacanthopus visayanus": { farbe: "#2980b9" } },
    merkmale: [
      { titel: "Dornen an der Vorderschiene (Unterseite hinten) zählen", wo: "Lupe nötig: die Dornenreihe an der hinteren Unterkante der Vorderschiene zählen.",
        spalten: [
          { t: "Etwa 25 Dornen", art: "Pliacanthopus mantispoides" },
          { t: "Etwa 7–13 Dornen", weiter: 2, arten: ["Pliacanthopus tricolor", "Pliacanthopus bimaculatus", "Pliacanthopus malayanus", "Pliacanthopus flavus", "Pliacanthopus visayanus"] },
        ] },
      { titel: "Höcker neben den Augen", nurWenn: "Nur bei 7–13 Dornen.", wo: "Kopf von oben: direkt hinter jedem Auge sitzt ein kleiner Höcker.",
        spalten: [
          { t: "Mit schwarzem Fleck", weiter: 3, arten: ["Pliacanthopus tricolor", "Pliacanthopus bimaculatus"], bilder: [
            { src: "kopf_bimaculatus.jpg", cap: "P. bimaculatus – Foto aus Wu & Liu 2022, Fig. 2a", pf: [{ x: 62, y: 32, lx: 20, ly: 8, t: "schwarzer Fleck" }, { x: 61, y: 77, lx: 20, ly: 8, t: "schwarzer Fleck" }] }] },
          { t: "Ohne schwarzen Fleck", weiter: 4, arten: ["Pliacanthopus malayanus", "Pliacanthopus flavus", "Pliacanthopus visayanus"] },
        ] },
      { titel: "Adern am Vorderrand der Vorderflügel", nurWenn: "Nur bei schwarzem Fleck neben den Augen.", wo: "Vorderflügel: die Längs- und Queradern direkt neben dem Vorderrandfeld.",
        spalten: [
          { t: "Schwarz", art: "Pliacanthopus tricolor", bilder: [{ src: "fl_tricolor.jpg", cap: "Wu & Liu 2022, Fig. 6d", pf: [{ x: 45, y: 32, lx: 10, ly: 85, t: "Adern schwarz" }] }] },
          { t: "Blassgrün", art: "Pliacanthopus bimaculatus", bilder: [{ src: "fl_bimaculatus.jpg", cap: "Wu & Liu 2022, Fig. 6b", pf: [{ x: 55, y: 40, lx: 10, ly: 85, t: "Adern blassgrün" }] }] },
        ] },
      { titel: "Dornen an der Vorderschiene (wie bei 1)", nurWenn: "Nur ohne schwarzen Fleck neben den Augen.", wo: "Lupe nötig.",
        spalten: [
          { t: "Etwa 10 Dornen", art: "Pliacanthopus malayanus" },
          { t: "12–13 Dornen", weiter: 5, arten: ["Pliacanthopus flavus", "Pliacanthopus visayanus"] },
        ] },
      { titel: "Letztes Glied der Hinterleibsanhänge (Cerci)", nurWenn: "Nur bei 12–13 Dornen.", wo: "Lupe nötig: die zwei Fäden am Hinterleibsende, ihr letztes Glied.",
        spalten: [
          { t: "Spitze gerundet", art: "Pliacanthopus flavus" },
          { t: "Spitze fast spitz", art: "Pliacanthopus visayanus" },
        ] },
    ],
    hinweis: "Kleine Tiere (2–2,5 cm) – für Dornen und Cerci ist eine Lupe nötig. P. mantispoides, P. malayanus und P. visayanus kennt man fast nur von Museumsstücken.",
  },

  Elmantis: {
    kurzquelle: "Vyjayandi & Rajeesh 2006",
    quellen: [{ t: "Vyjayandi, M. C. & Rajeesh, K. S. (2006): A new species Elmantis domestica from Kerala, India (Insecta: Mantodea). Entomon 31 (Schlüssel der Arten)", u: DBX + "AGeGeRPNje7rV7MH6HusIuU/Vyjayandi%20%26%20Rajeesh%202006%20-%20A%20new%20species%20Elmantis%20domestica%20from%20Kerala%2C%20India%20%28Insecta%2C%20Mantodea%29.pdf" + RK }],
    arten: { "Elmantis nira": { farbe: "#16a085" }, "Elmantis trincomaliae": { farbe: "#2c3e50" }, "Elmantis lata": { farbe: "#a0522d" } },
    merkmale: [
      { titel: "Dornen an der Außenkante der Vorderschiene zählen", wo: "Lupe nötig.",
        spalten: [
          { t: "11 Dornen", art: "Elmantis nira" },
          { t: "10 Dornen", weiter: 2, arten: ["Elmantis trincomaliae", "Elmantis lata"] },
        ] },
      { titel: "Form der Vorderflügel (Männchen)", nurWenn: "Nur bei 10 Dornen.",
        spalten: [
          { t: "Schmal, Ränder parallel, zum Ende nicht breiter", art: "Elmantis trincomaliae" },
          { t: "Zum Ende hin verbreitert", art: "Elmantis lata" },
        ] },
    ],
    hinweis: "Für keine der drei Arten gibt es geeignete Bilder. Merkmal 2 gilt nur für Männchen.",
  },

  Majanga: {
    kurzquelle: "Paulian 1957",
    quellen: [{ t: "Paulian, R. (1957): Faune de Madagascar V. Insectes Mantodea. Tananarive & Paris (Tableau des espèces de Majanga)", u: DBX + "AFcmGflmpuKbxL8V3-PUf2A/Paulian%201957%20-%20Faune%20de%20Madagascar.%20V%20-%20Insectes%20Mantodea.pdf" + RK }],
    arten: { "Majanga tricolor": { farbe: "#555" }, "Majanga basilaris": { farbe: "#2c2c2c" }, "Majanga spinosa": { farbe: "#b8860b" } },
    merkmale: [
      { titel: "Analfeld der Hinterflügel (der große, fächerförmige hintere Teil)",
        spalten: [
          { t: "Bis zur Basis rauchig", art: "Majanga tricolor" },
          { t: "In fast der ganzen vorderen Hälfte gelb", weiter: 2, arten: ["Majanga basilaris", "Majanga spinosa"] },
        ] },
      { titel: "Deckflügel", nurWenn: "Nur bei gelbem Analfeld.",
        spalten: [
          { t: "Vordere Hälfte schwärzlich, Vorderrand geschwungen", art: "Majanga basilaris" },
          { t: "Gelblich mit schwarzer Marmorierung, Vorderrand gerade", art: "Majanga spinosa", bilder: [
            { src: "habitus_spinosa.png", cap: "M. spinosa ♂ – Paulian 1957, Fig. 28", pf: [{ x: 50, y: 72, lx: 2, ly: 95, t: "marmoriert" }] }] },
        ] },
    ],
    hinweis: "Achtung: Schon Paulian (1957) bezweifelt, dass die drei Arten wirklich verschieden sind. Fotos lebender Tiere gibt es praktisch keine.",
  },

  Tricondylomimus: {
    kurzquelle: "Stiewe & Shcherbakov 2017",
    quellen: [{ t: "Stiewe, M. B. D. & Shcherbakov, E. (2017): Revision of the genera Nemotha Wood-Mason, 1884 and Tricondylomimus Chopard, 1930 stat. rev., with description of a new species. Annales de la Société entomologique de France 53(3): 175–196. doi:10.1080/00379271.2017.1327330", u: DBX + "AOf9T0Uv4YKFpx85O_KaZN8/Stiewe%20%26%20Shcherbakov%202017%20-%20Revision%20of%20the%20genera%20Nemotha%20Wood-Mason%2C%201884%20and%20Tricondylomimus%20Chopard%2C%201930%20stat.%20rev.%2C%20with%20description%20of%20a%20new%20species.pdf" + RK }],
    arten: { "Tricondylomimus coomani": { farbe: "#1f1f2e" }, "Tricondylomimus intermedius": { farbe: "#8b5a2b" }, "Tricondylomimus mirabilis": { farbe: "#556b2f" } },
    merkmale: [
      { titel: "Halsschild von der Seite", wo: "Tier von der Seite: den hinteren Teil des Halsschilds (hinter der Verbreiterung über den Vorderhüften) ansehen.",
        spalten: [
          { t: "Stark gewölbt, kurz vor dem Hinterrand scharf nach oben geknickt; glänzend", art: "Tricondylomimus coomani", bilder: [
            { src: "f_coomani.jpg", foto: true, pf: [{ x: 57, y: 44, lx: 30, ly: 90, t: "Buckel" }] }] },
          { t: "Flach oder nur leicht S-förmig", weiter: 2, arten: ["Tricondylomimus intermedius", "Tricondylomimus mirabilis"] },
        ] },
      { titel: "Färbung", nurWenn: "Nur bei flachem Halsschild.",
        spalten: [
          { t: "Olivbraun, Mittel- und Hinterschenkel einfarbig rötlich, Vorderflügel ohne helle Flecken", art: "Tricondylomimus intermedius" },
          { t: "Olivgrün mit hellgrünen Flecken auf Körper und Vorderflügeln", art: "Tricondylomimus mirabilis", bilder: [
            { src: "f_mirabilis.jpg", foto: true, pf: [{ x: 50, y: 42, lx: 10, ly: 92, t: "hellgrüne Flecken" }] }] },
        ] },
    ],
    hinweis: "Zusätzlich unterscheiden sich intermedius und mirabilis in der Aderung der Vorderflügel (siehe Originalarbeit).",
  },

  Betamantis: {
    kurzquelle: "Giglio-Tos 1927",
    quellen: [{ t: "Giglio-Tos, E. (1927): Das Tierreich 50. Orthoptera Mantidae (Schlüssel der Arten von Betamantis)", u: GT }],
    arten: { "Betamantis marginella": { farbe: "#6d4c41" }, "Betamantis aliena": { farbe: "#455a64" } },
    merkmale: [
      { titel: "Dornen an der Außenkante der Vorderschiene zählen", wo: "Lupe nötig.",
        spalten: [
          { t: "9 Dornen", art: "Betamantis marginella" },
          { t: "10 Dornen", art: "Betamantis aliena" },
        ] },
    ],
    hinweis: "Nur aus dem alten Schlüssel von Giglio-Tos (1927); keine Fotos und keine Abbildungen vorhanden.",
  },

  Enicophlebia: {
    kurzquelle: "Paulian 1957",
    quellen: [{ t: "Paulian, R. (1957): Faune de Madagascar V. Insectes Mantodea (Tableau des espèces d’Enicophlebia)", u: DBX + "AFcmGflmpuKbxL8V3-PUf2A/Paulian%201957%20-%20Faune%20de%20Madagascar.%20V%20-%20Insectes%20Mantodea.pdf" + RK }],
    arten: { "Enicophlebia pallida": { farbe: "#7cb342" }, "Enicophlebia hilara": { farbe: "#8e2b6b" } },
    merkmale: [
      { titel: "Zeichnung der Deckflügel", wo: "Von oben auf die Deckflügel schauen.",
        spalten: [
          { t: "Fast ohne dunkle Flecken; gelbes Band von der Flügelbasis am Innenrand zur Mitte, dann schräg nach außen", art: "Enicophlebia pallida", bilder: [
            { src: "f_pallida.jpg", foto: true, pf: [{ x: 34, y: 48, lx: 40, ly: 90, t: "gelbes Band" }] }] },
          { t: "Viele dunkle Flecken, kein gelbes Band", art: "Enicophlebia hilara", bilder: [
            { src: "f_hilara.jpg", foto: true, pf: [{ x: 60, y: 30, lx: 40, ly: 90, t: "viele dunkle Flecken" }] }] },
        ] },
    ],
  },

  Nesoxypilus: {
    kurzquelle: "Milledge 1990",
    quellen: [{ t: "Milledge, G. A. (1990): Revision of the genus Nesoxypilus Beier (Mantodea: Amorphoscelidae: Paraoxypilinae). Memoirs of the Museum of Victoria 50(2): 347–355", u: DBX + "AJvqkT7MkV7SCRvrhyfHj2E/Milledge%201990%20-%20Revision%20of%20the%20genus%20Nesoxypilus%20Beier%20%28Mantodea%2C%20Amorphoscelidae%2C%20Paraoxypilinae%29%202.%20Version.pdf" + RK }],
    arten: { "Nesoxypilus albomaculatus": { farbe: "#922b21" }, "Nesoxypilus pseudomyrmex": { farbe: "#1b2631" } },
    merkmale: [
      { titel: "Hinterrand des 3. Hinterleibsrings (von der Seite)", wo: "Lupe nötig: Hinterleib von der Seite, auf der Mittellinie oben am Hinterrand des 3. Rings.",
        spalten: [
          { t: "Mittellappen gut ausgebildet", art: "Nesoxypilus albomaculatus", bilder: [
            { src: "terga_albomaculatus.png", cap: "♂ Halsschild und Hinterleibsringe 1–4 – Milledge 1990, Fig. 8", pf: [{ x: 76, y: 42, lx: 30, ly: 88, t: "Lappen deutlich" }] }] },
          { t: "Mittellappen schwach, fast fehlend", art: "Nesoxypilus pseudomyrmex", bilder: [
            { src: "terga_pseudomyrmex.png", cap: "♂ Halsschild und Hinterleibsringe 1–4 – Milledge 1990, Fig. 9", pf: [{ x: 76, y: 42, lx: 30, ly: 88, t: "kaum ein Lappen" }] }] },
        ] },
    ],
    hinweis: "Beide Arten ahmen Ameisen nach und sehen sich sehr ähnlich. Laut Milledge hat N. pseudomyrmex außerdem schwarze Flügel mit weißem Fleck am Vorderrand.",
  },

  Parananomantis: {
    kurzquelle: "Sureshan et al. 2023",
    quellen: [{ t: "Sureshan, P. M. et al. (2023): Description of a new species of praying mantis (Insecta, Mantodea) from Agasthyamalai Biosphere Reserve, India. Oriental Insects. doi:10.1080/00305316.2023.2192530", u: DBX + "AJiYFBttXOyl92zYQxLnlrk/Sureshan%20et%20al.%202023%20%E2%80%93%20Description%20of%20a%20new%20species%20of%20praying%20mantis%20%28Insecta%2C%20Mantodea%29%20from%20Agasthyamalai%20Biosphere%20Reserve%2C%20India.pdf" + RK }],
    arten: { "Parananomantis fascifemorata": { farbe: "#a04000" }, "Parananomantis brevis": { farbe: "#7d6608" } },
    merkmale: [
      { titel: "Oberseite des Vorderschenkels", wo: "Fangbein von oben: der breite, bedornte Schenkel.",
        spalten: [
          { t: "Mit vier unregelmäßigen braunen Bändern", art: "Parananomantis fascifemorata", bilder: [
            { src: "bein_fascifemorata.jpg", cap: "Holotypus – Sureshan et al. 2023, Fig. 2C", pf: [{ x: 61, y: 40, lx: 2, ly: 92, t: "braune Bänder" }] }] },
          { t: "Ohne Bänder", art: "Parananomantis brevis", bilder: [
            { src: "bein_brevis.jpg", cap: "Holotypus – Sureshan et al. 2023, Fig. 5B", pf: [{ x: 47, y: 30, lx: 2, ly: 92, t: "ohne Bänder" }] }] },
        ] },
    ],
    hinweis: "Zur Kontrolle: Bei P. fascifemorata stehen die Queradern im Vorderrandfeld der Vorderflügel nicht parallel, bei P. brevis parallel.",
  },

  Stenotoxodera: {
    kurzquelle: "Roy 2009",
    quellen: [{ t: "Roy, R. (2009): Révision des Toxoderini sensu novo (Mantodea, Toxoderinae). Bulletin de la Société entomologique de France", u: DBX + "AAAmaYnSwDlmz3TTUMJKmf0/Roy%202009c%20-%20R%C3%A9vision%20des%20Toxoderini%20sensu%20novo%20%28Mantodea%2C%20Toxoderinae%29.pdf" + RK }],
    arten: { "Stenotoxodera pluto": { farbe: "#b9770e" }, "Stenotoxodera porioni": { farbe: "#4a235a" } },
    merkmale: [
      { titel: "Blattartige Lappen an Mittel- und Hinterschenkeln", wo: "Die blattförmigen Verbreiterungen an den Schenkeln der Lauf-Beine ansehen.",
        spalten: [
          { t: "Hell, nicht eingeschnürt (im ersten Drittel am breitesten)", art: "Stenotoxodera pluto", bilder: [
            { src: "f_pluto.jpg", foto: true, pf: [{ x: 42, y: 27, lx: 40, ly: 90, t: "hell, nicht eingeschnürt" }] }] },
          { t: "Dunkel, in der Mitte deutlich eingeschnürt (am Ende am breitesten)", art: "Stenotoxodera porioni", bilder: [
            { src: "f_porioni.jpg", foto: true, pf: [{ x: 49, y: 38, lx: 30, ly: 90, t: "dunkel, eingeschnürt" }] }] },
        ] },
    ],
    hinweis: "Zur Kontrolle: S. pluto hat sehr lange, dicke, gebogene Kniedornen, S. porioni dünne, gerade.",
  },

  Choeradodis: {
    kurzquelle: "Roy 2004",
    quellen: [{ t: "Roy, R. (2004): Révision et phylogénie des Choeradodini Kirby, 1904 (Dictyoptera, Mantidae). Bulletin de la Société entomologique de France 109(2): 113–128", u: DBX + "AJDWU2N9guK9yKwJU876xDo/Roy%202004b%20-%20R%C3%A9vision%20et%20phylog%C3%A9nie%20des%20Choeradodini%20Kirby%2C%201904%20%28Dictyoptera%2C%20Mantidae%29.pdf" + RK }],
    arten: { "Choeradodis rhombicollis": { farbe: "#2e7d32" }, "Choeradodis strumaria": { farbe: "#9e9d24" }, "Choeradodis columbica": { farbe: "#00838f" }, "Choeradodis rhomboidea": { farbe: "#6a1b9a" }, "Choeradodis stalii": { farbe: "#ad1457" } },
    merkmale: [
      { titel: "Vorderrand der Vorderhüfte", wo: "Lupe: Die Vorderhüfte ist das lange Grundglied des Fangbeins. An ihrer vorderen Kante sitzen Dornen.",
        spalten: [
          { t: "Nur fein und unregelmäßig gezähnelt", art: "Choeradodis rhombicollis" },
          { t: "Mit 6–12 kräftigen Dornen (meist 8–9)", weiter: 2, arten: ["Choeradodis strumaria", "Choeradodis columbica", "Choeradodis rhomboidea", "Choeradodis stalii"] },
        ] },
      { titel: "Innenseite des Vorderschenkels", nurWenn: "Nur bei kräftigen Hüftdornen.", wo: "Fangbein von vorn: der breite, bedornte Schenkel. In Drohhaltung ist die Innenseite gut zu sehen.",
        spalten: [
          { t: "Ohne schwarze Zeichnung", art: "Choeradodis strumaria" },
          { t: "Nur kleine schwarze Punkte an der Basis der großen Dornen", art: "Choeradodis columbica" },
          { t: "Großer schwarzer Fleck", weiter: 3, arten: ["Choeradodis rhomboidea", "Choeradodis stalii"], bilder: [
            { src: "schenkel_rhombicollis.jpg", cap: "Roy 2004, Fig. 20–21 (Schenkel innen, hier C. rhombicollis)", pf: [{ x: 40, y: 50, lx: 2, ly: 92, t: "schwarzer Fleck" }] }] },
        ] },
      { titel: "Breiteste Stelle des Halsschilds (von oben)", nurWenn: "Nur bei großem Schenkelfleck.", wo: "Von oben auf das blattartig verbreiterte Halsschild schauen (Männchen gezeigt, gleicher Maßstab).",
        spalten: [
          { t: "Etwa in der Mitte (fast quadratische Raute)", art: "Choeradodis rhomboidea", bilder: [
            { src: "hals_rhomboidea.png", cap: "♂ – Roy 2004, Fig. 23", pf: [{ x: 50, y: 50, lx: 20, ly: 92, t: "breit in der Mitte" }] }] },
          { t: "Deutlich vor der Mitte (Dreieck mit breiter Vorderseite)", art: "Choeradodis stalii", bilder: [
            { src: "hals_stalii.png", cap: "♂ – Roy 2004, Fig. 25", pf: [{ x: 50, y: 30, lx: 20, ly: 92, t: "breit vorn" }] }] },
        ] },
    ],
    hinweis: "Der Schlüssel stammt aus der Revision von Roy (2004) und ersetzt den alten von Giglio-Tos (1927), der C. columbica noch nicht kannte. Widerspruch: Giglio-Tos nennt für C. strumaria einen Schenkelfleck in der oberen Hälfte, Roy dagegen „Fémurs antérieurs non tachés“; im Zweifel zusätzlich die Dornen zählen (strumaria: 5 außen, 25–28 innen; die anderen: 4 außen, 15–18 innen). Zur Kontrolle rhomboidea/stalii: erstes Fußglied der Vorderbeine bei rhomboidea an der Basis hell, bei stalii innen dunkel.",
  },

  Majangella: {
    kurzquelle: "Svenson & Vollmer 2014",
    quellen: [{ t: "Svenson, G. J. & Vollmer, A. (2014): A case of the higher-level classification of praying mantises (Mantodea) obscuring the synonymy of Majangella Giglio-Tos, 1915 and Ephippiomantis Werner, 1922. Zootaxa 3797(1): 105–121", u: DBX + "ACzSNxpuUgaDYNrIiTer8sg/Svenson%20%26%20Vollmer%202014%20-%20A%20case%20of%20the%20higher-level%20classification%20of%20praying%20mantises%20%28Mantodea%29%20obscuring%20the%20synonymy%20of%20Majangella%20Giglio-Tos%2C%201915%20and%20Ephippiomantis%20Werner%2C%201922.pdf" + RK }],
    arten: { "Majangella carli": { farbe: "#8d6e63" }, "Majangella moultoni": { farbe: "#558b2f" }, "Majangella ophirensis": { farbe: "#5d4037" } },
    merkmale: [
      { titel: "Fortsatz auf dem Scheitel (Kopf von vorn)", wo: "Kopf von vorn: zwischen den großen Augen ragt oben ein Fortsatz nach oben.",
        spalten: [
          { t: "Ein einziger Zapfen mit stumpf gerundeter Spitze", art: "Majangella carli", bilder: [
            { src: "kopf_carli.jpg", cap: "Svenson & Vollmer 2014, Fig. 2C", pf: [{ x: 50, y: 18, lx: 30, ly: 92, t: "eine Spitze" }] }] },
          { t: "Hoch, tief eingeschnitten, beide Spitzen fast parallel nach oben", art: "Majangella moultoni", bilder: [
            { src: "kopf_moultoni.jpg", cap: "Svenson & Vollmer 2014, Fig. 2B", pf: [{ x: 50, y: 15, lx: 30, ly: 92, t: "zwei parallele Spitzen" }] }] },
          { t: "Niedriger, weniger eingeschnitten, Spitzen im Winkel (~30°) auseinander", art: "Majangella ophirensis", bilder: [
            { src: "kopf_ophirensis.jpg", cap: "Svenson & Vollmer 2014, Fig. 2D", pf: [{ x: 50, y: 15, lx: 30, ly: 92, t: "Spitzen gespreizt" }] }] },
        ] },
    ],
    hinweis: "Der Schlüssel der Originalarbeit gilt für Männchen. Zur Kontrolle: Bei M. moultoni ist die schwarze Zeichnung innen am Vorderschenkel durch ein helles Querband unterbrochen, bei M. ophirensis nicht.",
  },

  Trachymantis: {
    kurzquelle: "Milledge 2005",
    quellen: [{ t: "Milledge, G. A. (2005): Revision of the genera Sphodropoda, Trachymantis and Zopheromantis (Mantodea: Mantidae: Mantinae). Records of the Australian Museum 57: 191–210", u: DBX + "ABQ56XWCazNUYbKxAxaB1-c/Milledge%202005%20-%20Revision%20of%20the%20Genera%20Sphodropoda%2C%20Trachymantis%20and%20Zopheromantis%20%28Mantodea%2C%20Mantidae%2C%20Mantinae%29.pdf" + RK }],
    arten: { "Trachymantis obesa": { farbe: "#1565c0" }, "Trachymantis dentifrons": { farbe: "#2e7d32" } },
    merkmale: [
      { titel: "Innenseite des Fangbeins (Hüfte und Schenkel)", wo: "Fangbein von innen bzw. von vorn ansehen.",
        spalten: [
          { t: "Hüfte am Vorderrand mit 5 schwarzen Flecken; Schenkel mit großem schwarzem Fleck und 3 schmalen schwarzen Querbändern", art: "Trachymantis obesa", bilder: [
            { src: "bein_obesa.png", cap: "Milledge 2005, Fig. 29", pf: [{ x: 87, y: 45, lx: 2, ly: 92, t: "5 Flecken an der Hüfte" }] },
            { src: "kopf_obesa.png", cap: "Kopf von vorn – Milledge 2005, Fig. 28", pf: [{ x: 50, y: 70, lx: 2, ly: 92, t: "Stirnschild höher als breit" }] }] },
          { t: "Hüfte ohne Zeichnung; Schenkel höchstens mit einem dunklen Fleck vor der Klauenfurche und 3 kleinen Punkten", art: "Trachymantis dentifrons", bilder: [
            { src: "bein_dentifrons.png", cap: "Milledge 2005, Fig. 32", pf: [{ x: 25, y: 45, lx: 2, ly: 92, t: "Hüfte ohne Flecken" }] },
            { src: "kopf_dentifrons.png", cap: "Kopf von vorn – Milledge 2005, Fig. 31", pf: [{ x: 50, y: 70, lx: 2, ly: 92, t: "Stirnschild so hoch wie breit" }] }] },
        ] },
    ],
    hinweis: "Eigene Ableitung: Der Schlüssel von Milledge trennt die Arten über die Form des Stirnschilds (höher als breit bzw. etwa so hoch wie breit, unten zur Kontrolle gezeigt). Die Zeichnung der Fangbeine stammt aus den Artbeschreibungen derselben Arbeit und ist leichter zu sehen.",
  },

  Phasmomantella: {
    kurzquelle: "Vermeersch 2018",
    quellen: [{ t: "Vermeersch, X. H. C. (2018): Phasmomantella gen. nov., a spectacular new genus of praying mantis from southern Central Vietnam (Mantodea, Mantidae, Deroplatyinae, Euchomenellini). European Journal of Taxonomy 442: 1–17", u: DBX + "AKuPA_QiE_vcFX3cscpcE9M/Vermeersch%202018b%20%E2%80%93%20Phasmomantella%20gen.%20nov.%2C%20a%20spectacular%20new%20genus%20of%20praying%20mantis%20from%20southern%20Central%20Vietnam%20%28Mantodea%2C%20Mantidae%2C%20Deroplatyinae%2C%20Euchomenellini%29.pdf" + RK }],
    arten: { "Phasmomantella nuichuana": { farbe: "#8d6e00" }, "Phasmomantella pallida": { farbe: "#37474f" } },
    merkmale: [
      { titel: "Fleck an der Vorderseite des Vorderschenkels", wo: "Fangbein von vorn: zwischen dem 1. und 5. Dorn der unteren Vorderkante.",
        spalten: [
          { t: "Unregelmäßig umrandeter, fast quadratischer Fleck (bei Sammlungsstücken rotbraun); Dornen gelbgrün mit dunkler Spitze", art: "Phasmomantella nuichuana", bilder: [
            { src: "bein_nuichuana.jpg", cap: "Holotypus ♀ – Vermeersch 2018, Fig. 3D", pf: [{ x: 33, y: 22, lx: 30, ly: 95, t: "rotbrauner Fleck" }] }] },
          { t: "Rechteckiger schwarzer Fleck; mehrere Dornen ganz dunkel", art: "Phasmomantella pallida", bilder: [
            { src: "bein_pallida.jpg", cap: "Holotypus ♂ (Sammlungsstück) – Vermeersch 2018, Fig. 5", pf: [{ x: 45, y: 40, lx: 10, ly: 90, t: "schwarzer Fleck" }] }] },
        ] },
    ],
    hinweis: "Beide Arten sind nur von wenigen Tieren aus Süd-Vietnam bekannt.",
  },
};
