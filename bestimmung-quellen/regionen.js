// Großregionen für die Fundort-Fragen im Schlüssel (ISO-Ländercodes).
"use strict";
const R = {
  NAM: { t: "Nordamerika (USA, Kanada, nördliches Mexiko)", c: "US CA" },
  MAM: { t: "Mexiko, Mittelamerika und Karibik", c: "MX GT BZ HN SV NI CR PA CU JM HT DO PR BS TT GP MQ DM LC VC GD BB AG KN KY VG VI AW" },
  SAM: { t: "Südamerika", c: "CO VE GY SR GF EC PE BO BR PY UY AR CL" },
  EUR: { t: "Europa", c: "PT ES FR IT MT GR CY AL MK BG RO RS ME BA HR SI HU AT CH DE CZ SK PL UA MD RU BE NL LU DK GB IE SE NO FI EE LV LT BY LI MC SM AD" },
  NAF: { t: "Nordafrika und Sahara", c: "MA DZ TN LY EG EH MR" },
  AFR: { t: "Afrika südlich der Sahara", c: "SN GM GW GN SL LR CI GH TG BJ NG NE ML BF TD SD SS ER ET DJ SO KE UG RW BI TZ CD CG GA GQ CM CF AO ZM MW MZ ZW BW NA ZA LS SZ ST CV" },
  MAD: { t: "Madagaskar und Inseln im Indischen Ozean", c: "MG KM YT RE MU SC" },
  WAS: { t: "Vorder- und Mittelasien (Türkei bis Afghanistan, Arabien)", c: "TR SY LB IL PS JO IQ IR SA YE OM AE QA KW BH GE AM AZ KZ UZ TM TJ KG AF" },
  SAS: { t: "Südasien (Pakistan, Indien, Sri Lanka, Nepal, Bangladesch)", c: "PK IN LK NP BT BD MV" },
  OAS: { t: "Ostasien (China, Taiwan, Korea, Japan, Mongolei)", c: "CN TW KR KP JP MN HK MO" },
  SOA: { t: "Südostasien (Myanmar bis Philippinen und Indonesien)", c: "MM TH LA KH VN MY SG BN ID PH TL" },
  AUS: { t: "Australien, Neuguinea und Pazifik", c: "AU PG NZ SB VU NC FJ WS TO PF FM GU PW NR" },
};
const OF = {};
for (const [k, v] of Object.entries(R)) { v.c = v.c.split(" "); v.c.forEach((c) => (OF[c] = k)); }
// Grobe Erdteile für die erste Frage
const ERDTEIL = {
  AME: { t: "Amerika", r: ["NAM", "MAM", "SAM"], b: "AM" },
  EUM: { t: "Europa, Nordafrika, Vorder- und Mittelasien", r: ["EUR", "NAF", "WAS"], b: "EU,WA" },
  AFR: { t: "Afrika südlich der Sahara", r: ["AFR"], b: "AF" },
  MAD: { t: "Madagaskar und Inseln im Indischen Ozean", r: ["MAD"], b: "MG" },
  ASI: { t: "Süd-, Südost- und Ostasien", r: ["SAS", "OAS", "SOA"], b: "AS" },
  AUS: { t: "Australien, Neuguinea und Pazifik", r: ["AUS"], b: "OZ" },
};
const ERD_OF = {}; for (const [k, v] of Object.entries(ERDTEIL)) v.r.forEach((r) => (ERD_OF[r] = k));
module.exports = { R, OF, ERDTEIL, ERD_OF };
