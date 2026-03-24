import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../svg/square");
const codes = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".svg"))
  .map((f) => f.replace(/\.svg$/, ""))
  .sort();

const out = path.join(__dirname, "../src/codes.ts");
const content = `/** Auto-generated — do not edit */
export const FLAG_CODES = ${JSON.stringify(codes)} as const;
export type FlagCode = (typeof FLAG_CODES)[number];
`;
fs.writeFileSync(out, content);
console.log(`Generated ${codes.length} flag codes.`);
