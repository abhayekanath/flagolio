import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "../svg/1x1");
const outDir = path.join(__dirname, "../svg/round");

/**
 * Inner markup of the root <svg> (everything between the first <svg> and final </svg>).
 */
function stripSvgInner(svg) {
  const m = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>\s*$/im);
  return m ? m[1].trim() : "";
}

function parseViewBox(svg) {
  const m = svg.match(/viewBox="([^"]+)"/);
  if (!m) return { viewBox: "0 0 512 512", minX: 0, minY: 0, w: 512, h: 512 };
  const parts = m[1].trim().split(/[\s,]+/).map(Number);
  const [minX, minY, w, h] =
    parts.length === 4 ? parts : [0, 0, 512, 512];
  return { viewBox: m[1].trim(), minX, minY, w, h };
}

/** Root <svg> may declare xlink for <use xlink:href>. */
function needsXlinkNamespace(svg) {
  return (
    /xmlns:xlink\s*=/.test(svg) ||
    /xlink:href\s*=/.test(svg) ||
    /xlink:show\s*=/.test(svg)
  );
}

const RE_DEFS = /<defs\b[^>]*>[\s\S]*?<\/defs>/gi;
const RE_MARKER = /<marker\b[^>]*>[\s\S]*?<\/marker>/gi;
const RE_STYLE = /<style\b[^>]*>[\s\S]*?<\/style>/gi;

/** Clone regex so `g` does not leak `lastIndex` between files (breaks later `<defs>` matches). */
function extractMatches(re, s) {
  return s.match(new RegExp(re.source, re.flags)) ?? [];
}

function removeAll(blocks, s) {
  let t = s;
  for (const b of blocks) t = t.split(b).join("");
  return t;
}

function defsInnerContent(defsBlock) {
  const m = defsBlock.match(/<defs[^>]*>([\s\S]*)<\/defs>/i);
  return m ? m[1].trim() : "";
}

/**
 * Circular clip in user space + original content.
 * Defs / markers / styles are kept at the root (not inside the clipped group) so
 * id references and markers keep working across engines.
 */
function makeRoundSvg(raw, inner, viewBoxStr, minX, minY, w, h, code) {
  const cx = minX + w / 2;
  const cy = minY + h / 2;
  const r = Math.min(w, h) / 2;
  const clipId = `clip-round-${code.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

  const defsBlocks = extractMatches(RE_DEFS, inner);
  let body = removeAll(defsBlocks, inner);

  const markers = extractMatches(RE_MARKER, body);
  body = removeAll(markers, body);

  const styles = extractMatches(RE_STYLE, body);
  body = removeAll(styles, body);

  const mergedDefsParts = defsBlocks.map(defsInnerContent).filter(Boolean);
  const markersStr = markers.map((m) => m.trim()).filter(Boolean);
  const stylesStr = styles.map((s) => s.trim()).filter(Boolean);

  const xlink = needsXlinkNamespace(raw)
    ? ' xmlns:xlink="http://www.w3.org/1999/xlink"'
    : "";

  const indent = (block) =>
    block
      .split("\n")
      .map((line) => `    ${line}`)
      .join("\n");

  const mergedDefsInner = mergedDefsParts.join("\n\n");
  const markersJoined = markersStr.join("\n");

  const defsChildren = [
    indent(
      `<clipPath id="${clipId}" clipPathUnits="userSpaceOnUse">\n` +
        `  <circle cx="${cx}" cy="${cy}" r="${r}"/>\n` +
        `</clipPath>`,
    ),
    mergedDefsInner ? indent(mergedDefsInner) : "",
    markersJoined ? indent(markersJoined) : "",
  ]
    .filter(Boolean)
    .join("\n");

  const styleBlock =
    stylesStr.length > 0
      ? `${stylesStr.map((s) => `  ${s.split("\n").join("\n  ")}`).join("\n")}\n`
      : "";

  const paint = body
    .trim()
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg"${xlink} viewBox="${viewBoxStr}" preserveAspectRatio="xMidYMid meet">
  <defs>
${defsChildren}
  </defs>
${styleBlock}  <g clip-path="url(#${clipId})">
${paint}
  </g>
</svg>
`;
}

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".svg"));
let n = 0;
for (const file of files) {
  const code = file.replace(/\.svg$/, "");
  const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
  const inner = stripSvgInner(raw);
  if (!inner) {
    console.warn(`skip (no inner SVG): ${file}`);
    continue;
  }
  const { viewBox, minX, minY, w, h } = parseViewBox(raw);
  const out = makeRoundSvg(raw, inner, viewBox, minX, minY, w, h, code);
  fs.writeFileSync(path.join(outDir, file), out, "utf8");
  n++;
}
console.log(`Wrote ${n} round SVGs to svg/round/`);
