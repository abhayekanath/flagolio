import countries from "i18n-iso-countries";

/** Regions / orgs / subdivisions not covered by ISO alpha-2 alone */
const COMPOUND: Record<string, string> = {
  "es-ct": "Catalonia",
  "es-ga": "Galicia",
  "es-pv": "Basque Country",
  "gb-eng": "England",
  "gb-nir": "Northern Ireland",
  "gb-sct": "Scotland",
  "gb-wls": "Wales",
  "sh-ac": "Ascension Island",
  "sh-hl": "Saint Helena",
  "sh-ta": "Tristan da Cunha",
};

/** Non-standard two-letter or special codes used by flag-icons */
const EXTRA: Record<string, string> = {
  arab: "Arab League",
  asean: "ASEAN",
  cefta: "CEFTA",
  cp: "Clipperton Island",
  dg: "Diego Garcia",
  eac: "East African Community",
  eu: "European Union",
  hm: "Heard Island and McDonald Islands",
  ic: "Canary Islands",
  pc: "Pacific Community",
  un: "United Nations",
  xk: "Kosovo",
  xx: "Unknown",
};

function humanize(code: string): string {
  return code
    .split("-")
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(" ");
}

/** English display name for a flag id (e.g. `fr`, `gb-sct`, `un`). */
export function getFlagLabel(code: string): string {
  const key = code.toLowerCase();
  if (COMPOUND[key]) return COMPOUND[key];
  if (EXTRA[key]) return EXTRA[key];
  if (key.length === 2) {
    const n = countries.getName(key.toUpperCase(), "en");
    if (n) return n;
  }
  return humanize(key);
}
