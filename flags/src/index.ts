import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { FLAG_CODES, type FlagCode } from "./codes.js";

export { FLAG_CODES, type FlagCode } from "./codes.js";

export type FlagRatio = "default" | "square" | "round";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Absolute filesystem path to an SVG (Node.js). */
export function getFlagPath(
  code: string,
  ratio: FlagRatio = "default",
): string {
  return join(__dirname, "..", "svg", ratio, `${code}.svg`);
}

/**
 * `file:` URL to an SVG, relative to this module (works in bundlers that preserve `import.meta.url`).
 */
export function flagAssetUrl(
  code: string,
  ratio: FlagRatio = "default",
): string {
  return new URL(`../svg/${ratio}/${code}.svg`, import.meta.url).href;
}

/** True if `code` is a known flag id (from `FLAG_CODES`). */
export function isFlagCode(code: string): code is FlagCode {
  return (FLAG_CODES as readonly string[]).includes(code);
}
