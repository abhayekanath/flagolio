import { FLAG_CODES } from "@flagolio/flags";

export type FlagAssetMaps = {
  mapDefault: Record<string, string>;
  mapSquare: Record<string, string>;
  mapRound: Record<string, string>;
};

/** Parse import.meta.glob on the @flags SVG tree into per-ratio URL maps. */
export function buildFlagAssetMaps(
  globResult: Record<string, string>,
): FlagAssetMaps {
  const mapDefault: Record<string, string> = {};
  const mapSquare: Record<string, string> = {};
  const mapRound: Record<string, string> = {};

  for (const [p, url] of Object.entries(globResult)) {
    const m = p.match(/\/([^/]+)\.svg$/);
    if (!m) continue;
    if (p.includes("/default/")) mapDefault[m[1]] = url;
    if (p.includes("/square/")) mapSquare[m[1]] = url;
    if (p.includes("/round/")) mapRound[m[1]] = url;
  }

  return { mapDefault, mapSquare, mapRound };
}

export type FlagGridItem = {
  code: string;
  name: string;
  hrefDefault: string;
  hrefSquare: string;
  hrefRound: string;
};

export function buildFlagGridItems(
  maps: FlagAssetMaps,
  getLabel: (code: string) => string,
): FlagGridItem[] {
  return FLAG_CODES.filter(
    (c) => maps.mapDefault[c] && maps.mapSquare[c] && maps.mapRound[c],
  ).map((code) => ({
    code,
    name: getLabel(code),
    hrefDefault: maps.mapDefault[code],
    hrefSquare: maps.mapSquare[code],
    hrefRound: maps.mapRound[code],
  }));
}
