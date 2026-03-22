import {
  continents,
  countries,
  type TContinentCode,
} from "countries-list";

/** Subdivisions, orgs, and codes not in ISO lookup */
const COMPOUND: Record<string, TContinentCode | "OTHER"> = {
  "es-ct": "EU",
  "es-ga": "EU",
  "es-pv": "EU",
  "gb-eng": "EU",
  "gb-nir": "EU",
  "gb-sct": "EU",
  "gb-wls": "EU",
  "sh-ac": "AF",
  "sh-hl": "AF",
  "sh-ta": "AF",
  arab: "AS",
  asean: "AS",
  cefta: "EU",
  eac: "AF",
  eu: "EU",
  un: "OTHER",
  cp: "NA",
  pc: "OC",
  dg: "AS",
  ta: "AF",
  xx: "OTHER",
};

const CONTINENT_ORDER: TContinentCode[] = [
  "AF",
  "AN",
  "AS",
  "EU",
  "NA",
  "OC",
  "SA",
];

export type ContinentFilterValue = TContinentCode | "OTHER" | "ALL";

export const CONTINENT_OPTIONS: { value: ContinentFilterValue; label: string }[] =
  [
    { value: "ALL", label: "All continents" },
    ...CONTINENT_ORDER.map((id) => ({
      value: id,
      label: continents[id],
    })),
    { value: "OTHER", label: "Other" },
  ];

export function getFlagContinent(code: string): TContinentCode | "OTHER" {
  const k = code.toLowerCase();
  const mapped = COMPOUND[k];
  if (mapped !== undefined) return mapped;

  const u = k.toUpperCase();
  if (u in countries) {
    return countries[u as keyof typeof countries].continent;
  }

  return "OTHER";
}
