// Artenvergleich, so kurz wie möglich: die wenigsten Merkmale, die ALLE Arten der Gattung sicher trennen.
// Sphodropoda: kein einzelnes Merkmal trennt alle 4 Arten (S. viridis und S. lepida haben dieselbe Hüfte),
// daher 2 Merkmale. Quelle: Milledge 2005 (Bestimmungsschlüssel und Diagnosen), eigene Auswertung.
// Pfeile: x/y = Ziel in % des Bildes, lx/ly = Lage des Schilds in %.
window.VERGLEICH = {
  id: "sphodropoda",
  name: "Sphodropoda",
  familie: "Mantidae",
  gebiet: "Australien",
  quelle: "Milledge, G. A. (2005): Revision of the genera Sphodropoda, Trachymantis and Zopheromantis. Records of the Australian Museum 57: 191–210.",
  arten: {
    tristis: { name: "Sphodropoda tristis", farbe: "#8a5a2b", bild: "t_tristis", ort: "fast ganz Australien" },
    quinquedens: { name: "Sphodropoda quinquedens", farbe: "#c0392b", bild: "t_quinquedens", ort: "Nordost-Queensland" },
    viridis: { name: "Sphodropoda viridis", farbe: "#3f8f3a", bild: "t_viridis", ort: "trockenes Inland" },
    lepida: { name: "Sphodropoda lepida", farbe: "#7d3c98", bild: "oben_lepida", ort: "nur Zentralaustralien", zeichnung: true },
  },
  merkmale: [
    { nr: 1, titel: "Innenseite der Vorderhüfte",
      wo: "Fangbein von vorn ansehen: die Hüfte ist das lange Glied direkt unter dem Kopf.",
      spalten: [
        { t: "Weiße Querbänder", art: "quinquedens",
          foto: { src: "h_quinquedens", pf: [{ x: 57, y: 64, lx: 46, ly: 93, t: "Querbänder" }] },
          zeich: { src: "bein_quinquedens", pf: [{ x: 46, y: 45, lx: 2, ly: 90, t: "Querbänder" }] } },
        { t: "Dunkelgrau, weiße Höcker nur am Rand", art: "tristis",
          foto: { src: "h_tristis", pf: [{ x: 36, y: 55, lx: 44, ly: 93, t: "Höcker am Rand" }] },
          zeich: { src: "bein_tristis", pf: [{ x: 26, y: 40, lx: 2, ly: 92, t: "Höcker am Rand" }] } },
        { t: "Ganz grün, ohne Zeichnung", weiter: 2, arten: ["viridis", "lepida"],
          foto: { src: "h_viridis", pf: [{ x: 71, y: 55, lx: 40, ly: 8, t: "ganz grün" }] },
          zeich: { src: "bein_viridis", pf: [{ x: 10, y: 45, lx: 30, ly: 92, t: "ohne Zeichnung" }] } },
      ] },
    { nr: 2, titel: "Adern der Deckflügel", nurWenn: "Nur nötig, wenn die Hüfte ganz grün ist.",
      wo: "Auf die großen Längsadern in der Mitte des Deckflügels schauen.",
      spalten: [
        { t: "Adern grün", art: "viridis",
          foto: { src: "w_viridis", pf: [{ x: 52, y: 42, lx: 40, ly: 92, t: "Adern grün" }] },
          zeich: { src: "flf_viridis", pf: [{ x: 31, y: 72, lx: 40, ly: 90, t: "Adern grün" }], gefaerbt: true } },
        { t: "Adern purpurbraun gesäumt – Flügel wirkt gebändert", art: "lepida",
          zeich: { src: "flf_lepida", pf: [{ x: 43, y: 75, lx: 30, ly: 90, t: "Adern purpurbraun" }], gefaerbt: true } },
      ] },
  ],
  credits: {
    h_tristis: { obs: 226652768, user: "jayn" }, h_quinquedens: { obs: 123031889, user: "Alec Karcz" }, h_viridis: { obs: 253295567, user: "simono" },
    w_viridis: { obs: 201532079, user: "hammo1970" },
    t_tristis: { obs: 152373557, user: "ppolito" }, t_quinquedens: { obs: 164345707, user: "Gunter Maywald" }, t_viridis: { obs: 255887772, user: "Nick Volpe" },
  },
  groessen: { bein_lepida: [665, 570], bein_quinquedens: [700, 461], bein_tristis: [660, 460], bein_viridis: [595, 540], h_quinquedens: [720, 720], h_tristis: [720, 720], h_viridis: [720, 720], w_viridis: [720, 720], flf_viridis: [384, 324], flf_lepida: [400, 324], oben_lepida: [357, 900], t_quinquedens: [900, 796], t_tristis: [675, 900], t_viridis: [900, 640] },
};
