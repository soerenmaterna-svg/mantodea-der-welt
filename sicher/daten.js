// Gattungen, in denen die Literatur JEDE heute gültige Art allein über sichtbare Merkmale trennt
// (kein Fundort, kein Messen, kein Genitalpräparat). Auswahl: bestimmung-quellen/build.js (DIAG6).
// Fotos: Ausschnitt jeweils desselben Körperbereichs; Pfeile in Prozent der Bildbreite/-höhe.
window.SICHER = {
  stand: "2026-11-22",
  gattungen: [
    {
      id: "metallyticus",
      name: "Metallyticus",
      autor: "Westwood, 1835",
      familie: "Metallyticidae",
      deutsch: "Juwel-Fangschrecken",
      arten: 5,
      gebiet: "Südostasien: Indien (Assam), Myanmar, Thailand, Laos, Malaysia, Indonesien, Brunei, Philippinen",
      bild: "art_splendidus",
      quelle: "Giglio-Tos (1927: 39), ins Englische übertragen und überprüft von Wieland (2008): The genus Metallyticus reviewed (Insecta, Mantodea). Species, Phylogeny and Evolution 1(3): 147–170.",
      // Ist es überhaupt Metallyticus?
      check: [
        { t: "Ganzer Körper metallisch blau-grün schillernd – das gibt es bei keiner anderen Gottesanbeterin.", teil: "koerper" },
        { t: "Halsschild sehr kurz, kaum länger als breit (bei den meisten Gottesanbeterinnen ist er lang und schmal).", teil: "hals" },
        { t: "Körper flach gedrückt; die Tiere laufen schnell wie Schaben über Baumrinde.", teil: "" },
        { t: "Fundort Süd- oder Südostasien.", teil: "" },
      ],
      schritte: {
        1: {
          frage: "Welche Farbe haben die Fangbeine?",
          wo: "Schau von oben auf den Vorderkörper. Die Fangbeine liegen links und rechts neben dem kurzen Halsschild. Achte auf das Grundglied (die Hüfte) und den breiten Schenkel.",
          opt: [
            { kurz: "grün metallisch", t: "Hüften der Fangbeine metallisch grün glänzend (auch der Schenkel schillert grün)",
              foto: { src: "k1a", pf: [{ x: 18, y: 62, lx: 4, ly: 92, t: "grün glänzend" }] },
              zeich: { teil: "fangbein", farbe: "gruen" }, orig: "fig9",
              weiter: 2 },
            { kurz: "nicht grün", t: "Hüften der Fangbeine gelbbraun, nicht metallisch; die Schenkel sind schwarzblau oder gelbbraun, aber nie grün",
              foto: { src: "k1b", pf: [{ x: 20, y: 50, lx: 4, ly: 92, t: "nicht grün" }] },
              zeich: { teil: "fangbein", farbe: "schwarz" }, orig: "fig9",
              weiter: 3 },
          ],
        },
        2: {
          frage: "Wie sehen die Hinterflügel aus?",
          wo: "Die Hinterflügel liegen gefaltet unter den Deckflügeln. Man sieht sie beim Abflug oder wenn man bei einem toten Tier den Deckflügel vorsichtig anhebt.",
          opt: [
            { kurz: "rauchig", t: "Hinterflügel rauchig getrübt (bräunlich-grau, man sieht kaum hindurch)",
              zeich: { teil: "hinterfluegel", farbe: "rauch" }, orig: "fig15rauch",
              art: "splendidus" },
            { kurz: "glasklar", t: "Hinterflügel glasklar durchsichtig",
              zeich: { teil: "hinterfluegel", farbe: "klar" }, orig: "fig15",
              art: "semiaeneus" },
          ],
          hinweis: "Von M. semiaeneus gibt es kein einziges Foto eines lebenden Tieres; die Art ist nur von wenigen Museumsstücken aus Malaysia bekannt.",
        },
        3: {
          frage: "Welche Farbe haben die Schenkel der Fangbeine?",
          wo: "Der Schenkel ist das breite, bedornte Glied des Fangbeins. Von oben sieht man ihn neben dem Halsschild.",
          opt: [
            { kurz: "schwarz", t: "Schenkel der Fangbeine fast ganz schwarz (blauschwarz)",
              foto: { src: "k3a", pf: [{ x: 20, y: 55, lx: 4, ly: 92, t: "fast ganz schwarz" }] },
              zeich: { teil: "schenkel", farbe: "schwarz" },
              weiter: 4 },
            { kurz: "gelbbraun", t: "Schenkel der Fangbeine fast ganz gelbbraun",
              foto: { src: "k3b", pf: [{ x: 36, y: 42, lx: 4, ly: 92, t: "gelbbraun" }] },
              zeich: { teil: "schenkel", farbe: "gelb" },
              art: "pallipes" },
          ],
        },
        4: {
          frage: "Gibt es gelbe Zeichnung an Fangbein und Halsschild?",
          wo: "Zwei Stellen ansehen: den oberen Rand des Fangbein-Schenkels und den Hinterrand des Halsschilds (dort, wo die Flügel beginnen).",
          opt: [
            { kurz: "gelbe Zeichnung", t: "Schenkel am Oberrand gelbbraun gesäumt UND Halsschild am Hinterrand mit zwei gelbbraunen Flecken",
              foto: { src: "k4a", pf: [{ x: 21, y: 42, lx: 4, ly: 10, t: "gelber Saum" }, { x: 32, y: 66, lx: 44, ly: 92, t: "2 gelbe Flecken" }, { x: 60, y: 71, lx: 44, ly: 92, t: "" }] },
              zeich: { teil: "zeichnung", farbe: "gelb" },
              art: "violaceus" },
            { kurz: "ganz schwarz", t: "Schenkel ganz schwarz; Halsschild ganz schwarz, ohne Flecken",
              foto: { src: "k4b", pf: [{ x: 17, y: 55, lx: 4, ly: 12, t: "ohne Saum" }, { x: 50, y: 84, lx: 62, ly: 66, t: "ohne Flecken" }] },
              zeich: { teil: "zeichnung", farbe: "schwarz" },
              art: "fallax" },
          ],
        },
      },
      artInfo: {
        splendidus: { name: "Metallyticus splendidus", autor: "Westwood, 1835", bild: "art_splendidus", land: "Malaysia, Indonesien (Sumatra, Borneo), Thailand, Indien", farbe: "gruen",
          text: "Die bekannteste Art: Kopf, Halsschild und Fangbeine grün-golden schillernd, Mittel- und Hinterschenkel rot, Hinterflügel rauchig." },
        semiaeneus: { name: "Metallyticus semiaeneus", autor: "Westwood, 1889", bild: "", land: "Malaysia", farbe: "gruen",
          text: "Wie M. splendidus mit grünen Fangbeinen, aber mit glasklaren Hinterflügeln. Nur von Museumsstücken bekannt, kein Foto lebender Tiere." },
        pallipes: { name: "Metallyticus pallipes", autor: "Giglio-Tos, 1917", bild: "art_pallipes", land: "Malaysia, Indonesien, Brunei (Borneo)", farbe: "gelb",
          text: "Körper und Deckflügel dunkel blauschwarz, Fangbeine fast ganz gelbbraun. Sehr selten beobachtet." },
        violaceus: { name: "Metallyticus violaceus", autor: "Burmeister, 1838", bild: "art_violaceus", land: "Malaysia, Indonesien, Philippinen, Laos, Thailand, Indien, Myanmar, Brunei", farbe: "schwarz",
          text: "Blauviolett schillernd, Fangbein-Schenkel schwarz mit gelbem Saum, zwei gelbe Flecken am Halsschild-Hinterrand; Mittel- und Hinterschenkel leuchtend orange. Die am häufigsten fotografierte Art." },
        fallax: { name: "Metallyticus fallax", autor: "Giglio-Tos, 1916", bild: "art_fallax", land: "Laos, Malaysia, Indonesien, Brunei", farbe: "schwarz",
          text: "Ganz dunkel blauschwarz schillernd, ohne gelbe Zeichnung an Fangbeinen und Halsschild." },
      },
      originale: {
        fig9: { src: "wieland_fig9.png", t: "Originalzeichnung: rechtes Fangbein von M. splendidus. cx = Hüfte (Coxa), fe = Schenkel (Femur), ti = Schiene (Tibia).", q: "Wieland 2008, Fig. 9", mark: { x: 62, y: 84, t: "Hüfte (cx)" } },
        fig15: { src: "wieland_fig15.png", t: "Originalzeichnung: Hinterflügel von Metallyticus, ausgebreitet.", q: "Wieland 2008, Fig. 15" },
        fig15rauch: { src: "wieland_fig15.png", rauch: true, t: "Originalzeichnung des Hinterflügels, zur Veranschaulichung rauchig getönt.", q: "Wieland 2008, Fig. 15 (Tönung ergänzt)" },
      },
    },
  ],
  // Bildnachweise (iNaturalist)
  credits: {
    k1a: { obs: 89163064, user: "Albert Kang", lic: "CC BY-NC", art: "M. splendidus" },
    k1b: { obs: 89163904, user: "Albert Kang", lic: "CC BY-NC", art: "M. violaceus (Larve)" },
    k3a: { obs: 90490348, user: "Albert Kang", lic: "CC BY-NC", art: "M. fallax" },
    k3b: { obs: 203650158, user: "willbrooks", lic: "CC BY-NC", art: "M. pallipes" },
    k4a: { obs: 89163904, user: "Albert Kang", lic: "CC BY-NC", art: "M. violaceus (Larve)" },
    k4b: { obs: 90490348, user: "Albert Kang", lic: "CC BY-NC", art: "M. fallax" },
    art_splendidus: { obs: 229880373, user: "Melvyn Yeo", lic: "CC BY-NC", art: "M. splendidus" },
    art_violaceus: { obs: 106411778, user: "Albert Kang", lic: "CC BY-NC", art: "M. violaceus" },
    art_fallax: { obs: 90490348, user: "Albert Kang", lic: "CC BY-NC", art: "M. fallax" },
    art_pallipes: { obs: 203650158, user: "willbrooks", lic: "CC BY-NC", art: "M. pallipes" },
  },
};
