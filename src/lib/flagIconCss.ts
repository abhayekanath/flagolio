import type { FlagCode } from "@flagolio/flags";

/**
 * Class-based flags:
 * - `<i class="flag us">` — default (wide) ratio
 * - `<i class="flag square us">` — square ratio
 * - `<i class="flag round us">` — round asset
 */
export function buildFlagIconCss(
  codes: readonly FlagCode[],
  mapDefault: Record<string, string>,
  mapSquare: Record<string, string>,
  mapRound: Record<string, string>,
): string {
  const bgRules: string[] = [];
  for (const code of codes) {
    const uR = mapRound[code];
    const u4 = mapDefault[code];
    const u1 = mapSquare[code];
    if (u4) {
      bgRules.push(
        `.flag.${code}{background-image:url(${JSON.stringify(u4)})}`,
      );
    }
    if (u1) {
      bgRules.push(
        `.flag.square.${code}{background-image:url(${JSON.stringify(u1)})}`,
      );
    }
    if (uR) {
      bgRules.push(
        `.flag.round.${code}{background-image:url(${JSON.stringify(uR)})}`,
      );
    }
  }

  return `
.flag {
  display: inline-block;
  vertical-align: -0.15em;
  font-style: normal;
  line-height: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  flex-shrink: 0;
}
.flag:not(.square):not(.round) {
  width: auto;
  height: 1em;
  aspect-ratio: 4 / 3;
}
.flag.square {
  width: 1em;
  aspect-ratio: 1;
  height: auto;
}
.flag.round {
  width: 1em;
  height: 1em;
  aspect-ratio: 1;
}
${bgRules.join("\n")}
`.trim();
}
