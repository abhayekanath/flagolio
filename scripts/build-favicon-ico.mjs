/**
 * Rasterize public/favicon.svg and emit public/favicon.ico (legacy tab icons).
 * Passes an array to png-to-ico so it does not embed 256×256 variants.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pngToIco from "png-to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = join(root, "public", "favicon.svg");
const png32 = join(root, "public", ".favicon-32.png");
const png16 = join(root, "public", ".favicon-16.png");
const ico = join(root, "public", "favicon.ico");

function run(cmd) {
  execSync(cmd, { stdio: "inherit", cwd: root, shell: true });
}

for (const [size, out] of [
  ["32", png32],
  ["16", png16],
]) {
  run(`npx --yes sharp-cli resize ${size} ${size} -i "${svg}" -o "${out}" -f png`);
}

const buf = await pngToIco([readFileSync(png32), readFileSync(png16)]);
writeFileSync(ico, buf);
unlinkSync(png32);
unlinkSync(png16);
console.log(`Wrote ${ico} (${buf.length} bytes)`);
