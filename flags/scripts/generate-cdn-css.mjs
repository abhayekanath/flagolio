/**
 * Emits dist/flagolio.cdn.css with absolute jsDelivr URLs so consumers can
 * <link> the stylesheet like Boxicons, without a bundler.
 * Run after `tsc` (imports ../dist/codes.js).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"),
);
const version = pkg.version;
const base = `https://cdn.jsdelivr.net/npm/@flagolio/flags@${version}`;

const { FLAG_CODES } = await import("../dist/codes.js");

const bgRules = [];
for (const code of FLAG_CODES) {
  bgRules.push(
    `.flag.${code}{background-image:url("${base}/svg/default/${code}.svg")}`,
  );
  bgRules.push(
    `.flag.square.${code}{background-image:url("${base}/svg/square/${code}.svg")}`,
  );
  bgRules.push(
    `.flag.round.${code}{background-image:url("${base}/svg/round/${code}.svg")}`,
  );
}

const css = `
/* @flagolio/flags v${version} — class-based flag icons (CDN SVG backgrounds) */
/* Base URL: ${base}/ */
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

const out = path.join(__dirname, "../dist/flagolio.cdn.css");
fs.writeFileSync(out, `${css}\n`);
console.log(`Wrote ${out} (${bgRules.length} background rules + base).`);
