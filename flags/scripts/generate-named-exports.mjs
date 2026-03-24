import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Words that cannot be used as binding names in JS `import { x }`. */
const RESERVED = new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "let",
  "static",
  "await",
  "as",
  "async",
  "get",
  "set",
  "from",
  "of",
  "package",
  "private",
  "protected",
  "public",
  "implements",
  "interface",
  "yield",
]);

/**
 * Turn a flag id into a valid JS identifier for a named export.
 * Hyphens → underscores (e.g. es-ct → es_ct). Reserved words get a leading _ (e.g. as → _as).
 */
function exportNameForCode(code) {
  let id = code.replace(/-/g, "_");
  id = id.replace(/[^a-zA-Z0-9_$]/g, "_");
  if (/^[0-9]/.test(id)) id = `_${id}`;
  if (RESERVED.has(id)) id = `_${id}`;
  return id;
}

const codesPath = path.join(__dirname, "../src/codes.ts");
const src = fs.readFileSync(codesPath, "utf8");
const m = src.match(/export const FLAG_CODES = (\[[\s\S]*?\])\s+as const/);
if (!m) throw new Error("Could not parse FLAG_CODES from codes.ts");
const codes = JSON.parse(m[1]);

const seen = new Map();
for (const code of codes) {
  const id = exportNameForCode(code);
  if (seen.has(id)) {
    throw new Error(
      `Duplicate export name "${id}" for codes "${seen.get(id)}" and "${code}"`,
    );
  }
  seen.set(id, code);
}

const outPath = path.join(__dirname, "../src/named.ts");
let file = `/** Auto-generated — do not edit */
/** Default (wide) SVG asset URL for each flag id. Use valid JS names; reserved words and edge cases use a leading underscore (e.g. \`_as\` for American Samoa, \`do\` → \`_do\`). */
const g = (c: string) => new URL(\`../svg/default/\${c}.svg\`, import.meta.url).href;
`;

for (const code of codes) {
  const id = exportNameForCode(code);
  file += `export const ${id} = g(${JSON.stringify(code)});\n`;
}

fs.writeFileSync(outPath, file);
console.log(`Wrote ${codes.length} named default-ratio exports to src/named.ts`);
