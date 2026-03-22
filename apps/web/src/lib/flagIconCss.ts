import type { FlagCode } from "@flag-list/flags";

/**
 * Class-based flags:
 * - `<i class="flag us">` — 4:3 (default)
 * - `<i class="flag square us">` — 1:1
 * - `<i class="flag round us">` — round 1:1 asset
 */
export function buildFlagIconCss(
  codes: readonly FlagCode[],
  map43: Record<string, string>,
  map11: Record<string, string>,
  mapRound: Record<string, string>,
): string {
  const bgRules: string[] = [];
  for (const code of codes) {
    const uR = mapRound[code];
    const u4 = map43[code];
    const u1 = map11[code];
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
