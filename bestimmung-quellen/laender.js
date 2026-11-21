// Ländernamen (mehrsprachig, auch historische Bezeichnungen der Altliteratur) -> ISO-3166-Codes.
"use strict";
const ISO = "AD AE AF AG AI AL AM AO AR AS AT AU AW AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FM FR GA GB GD GE GF GH GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MK ML MM MN MO MQ MR MT MU MV MW MX MY MZ NA NC NE NG NI NL NO NP NR NZ OM PA PE PF PG PH PK PL PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TW TZ UA UG US UY UZ VC VE VG VI VN VU WS YE YT ZA ZM ZW".split(" ");
const names = new Map();
const add = (n, c) => { n = n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); if (n.length >= 4 && !names.has(n)) names.set(n, c); };
for (const lang of ["en", "fr", "de", "es", "pt", "it"]) {
  const dn = new Intl.DisplayNames([lang], { type: "region" });
  for (const c of ISO) { try { add(dn.of(c), c); } catch (e) { /* */ } }
}
const EXTRA = {
  "abyssinie": "ET", "abyssinia": "ET", "abessinien": "ET", "congo belge": "CD", "belgian congo": "CD", "belgisch-kongo": "CD", "kongo": "CD", "zaire": "CD",
  "kamerun": "CM", "cameroun": "CM", "ceylan": "LK", "ceylon": "LK", "birmanie": "MM", "burma": "MM", "siam": "TH", "tonkin": "VN", "annam": "VN", "cochinchine": "VN", "cochinchina": "VN",
  "formose": "TW", "formosa": "TW", "celebes": "ID", "sulawesi": "ID", "sumatra": "ID", "java": "ID", "borneo": "MY", "sarawak": "MY", "sabah": "MY", "kalimantan": "ID", "moluques": "ID", "moluccas": "ID", "lombok": "ID", "flores": "ID", "timor": "ID",
  "nouvelle guinee": "PG", "new guinea": "PG", "neuguinea": "PG", "papua": "PG", "bismarck": "PG", "nouvelle bretagne": "PG", "new britain": "PG", "salomon": "SB", "solomon": "SB",
  "zanzibar": "TZ", "afrique orientale allemande": "TZ", "deutsch-ostafrika": "TZ", "deutsch ostafrika": "TZ", "tanganyika": "TZ", "usambara": "TZ", "kilimandjaro": "TZ", "kilimanjaro": "TZ",
  "natal": "ZA", "transvaal": "ZA", "cap de bonne": "ZA", "cape colony": "ZA", "kapland": "ZA", "zululand": "ZA", "capland": "ZA",
  "rhodesie": "ZW", "rhodesia": "ZW", "nyassa": "MW", "nyasaland": "MW", "nyassaland": "MW", "guinee espagnole": "GQ", "fernando po": "GQ", "gold coast": "GH", "cote d'or": "GH", "goldkuste": "GH", "togo": "TG", "dahomey": "BJ",
  "senegal": "SN", "soudan": "SD", "sudan": "SD", "somalie": "SO", "somaliland": "SO", "erythree": "ER", "eritrea": "ER", "mesopotamie": "IQ", "mesopotamia": "IQ", "perse": "IR", "persia": "IR", "persien": "IR",
  "turkestan": "UZ", "transcaspie": "TM", "transkaspien": "TM", "caucase": "GE", "caucasus": "GE", "kaukasus": "GE",
  "assam": "IN", "bengale": "IN", "bengal": "IN", "bombay": "IN", "madras": "IN", "himalaya": "IN", "sikkim": "IN", "kerala": "IN", "goa": "IN", "karnataka": "IN", "maharashtra": "IN", "tamil nadu": "IN", "darjeeling": "IN", "malabar": "IN",
  "malacca": "MY", "perak": "MY", "penang": "MY", "selangor": "MY", "pahang": "MY", "luzon": "PH", "mindanao": "PH", "palawan": "PH", "hainan": "CN", "yunnan": "CN", "sichuan": "CN", "guangxi": "CN", "guangdong": "CN", "fujian": "CN", "tibet": "CN", "xizang": "CN",
  "queensland": "AU", "new south wales": "AU", "northern territory": "AU", "western australia": "AU", "tasmania": "AU",
  "guyane": "GF", "cayenne": "GF", "french guiana": "GF", "surinam": "SR", "suriname": "SR", "guyane anglaise": "GY", "british guiana": "GY", "guyana": "GY",
  "amazonas": "BR", "amazonie": "BR", "para": "BR", "bahia": "BR", "rio de janeiro": "BR", "sao paulo": "BR", "s. paulo": "BR", "matto grosso": "BR", "mato grosso": "BR", "minas gerais": "BR", "santa catarina": "BR", "espirito santo": "BR", "rondonia": "BR", "parana": "BR", "goias": "BR", "pernambuco": "BR", "ceara": "BR",
  "haiti": "HT", "saint-domingue": "DO", "santo domingo": "DO", "hispaniola": "DO", "jamaique": "JM", "porto rico": "PR", "puerto rico": "PR", "trinidad": "TT",
  "mexique": "MX", "mexico": "MX", "colombie": "CO", "equateur": "EC", "perou": "PE", "bolivie": "BO", "argentine": "AR", "chili": "CL",
  "etats-unis": "US", "texas": "US", "floride": "US", "florida": "US", "arizona": "US", "california": "US", "californie": "US", "new mexico": "US", "louisiana": "US", "georgia (usa)": "US",
  "sokotra": "YE", "socotra": "YE", "arabie": "SA", "arabia": "SA", "arabien": "SA", "palestine": "IL", "palastina": "IL", "syrie": "SY", "syria": "SY", "anatolie": "TR", "asie mineure": "TR", "kleinasien": "TR",
  "sicile": "IT", "sicily": "IT", "sizilien": "IT", "sardaigne": "IT", "sardinia": "IT", "corse": "FR", "corsica": "FR", "canaries": "ES", "canary": "ES", "kanaren": "ES", "tenerife": "ES", "gran canaria": "ES", "baleares": "ES", "algerie": "DZ", "tunisie": "TN", "maroc": "MA", "egypte": "EG", "libye": "LY", "tripolitaine": "LY", "cyrenaique": "LY",
  "comores": "KM", "comoros": "KM", "mayotte": "YT", "reunion": "RE", "maurice": "MU", "mauritius": "MU", "seychelles": "SC", "nossi-be": "MG", "nosy be": "MG",
  "angola": "AO", "mozambique": "MZ", "mocambique": "MZ", "ouganda": "UG", "uganda": "UG", "kenya": "KE", "ruanda": "RW", "urundi": "BI", "gabon": "GA", "ogooue": "GA", "fouta djallon": "GN", "sierra leone": "SL", "liberia": "LR", "nigeria": "NG", "niger": "NE", "tchad": "TD", "oubangui": "CF", "chari": "TD",
};
for (const [k, v] of Object.entries(EXTRA)) names.set(k.normalize("NFD").replace(/[̀-ͯ]/g, ""), v);
// zu kurze/mehrdeutige Namen entfernen
for (const bad of ["niger", "georgia", "guinea", "chad", "jordan", "victoria", "para", "goa", "java", "togo", "oman", "mali", "peru", "cuba", "iran", "iraq", "laos", "fiji"]) if (["niger", "georgia", "victoria", "para", "goa", "guinea"].includes(bad)) names.delete(bad);
const sorted = [...names.keys()].sort((a, b) => b.length - a.length);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const RE = new RegExp("(?<![a-z])(" + sorted.map(esc).join("|") + ")(?![a-z])", "g");
function find(text) {
  const t = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const out = new Set();
  let m; RE.lastIndex = 0;
  while ((m = RE.exec(t))) out.add(names.get(m[1]));
  return [...out];
}
module.exports = { find, ISO };
