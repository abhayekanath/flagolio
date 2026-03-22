import { FLAG_CODES } from "@flag-list/flags";

export type FlagAssetMaps = {
  map43: Record<string, string>;
  map11: Record<string, string>;
  mapRound: Record<string, string>;
};

/** Parse import.meta.glob on the @flags SVG tree into per-ratio URL maps. */
export function buildFlagAssetMaps(
  globResult: Record<string, string>,
): FlagAssetMaps {
  const map43: Record<string, string> = {};
  const map11: Record<string, string> = {};
  const mapRound: Record<string, string> = {};

  for (const [p, url] of Object.entries(globResult)) {
    const m = p.match(/\/([^/]+)\.svg$/);
    if (!m) continue;
    if (p.includes("/4x3/")) map43[m[1]] = url;
    if (p.includes("/1x1/")) map11[m[1]] = url;
    if (p.includes("/round/")) mapRound[m[1]] = url;
  }

  return { map43, map11, mapRound };
}

export type FlagGridItem = {
  code: string;
  name: string;
  href43: string;
  href11: string;
  hrefRound: string;
};

export function buildFlagGridItems(
  maps: FlagAssetMaps,
  getLabel: (code: string) => string,
): FlagGridItem[] {
  return FLAG_CODES.filter(
    (c) => maps.map43[c] && maps.map11[c] && maps.mapRound[c],
  ).map((code) => ({
    code,
    name: getLabel(code),
    href43: maps.map43[code],
    href11: maps.map11[code],
    hrefRound: maps.mapRound[code],
  }));
}
