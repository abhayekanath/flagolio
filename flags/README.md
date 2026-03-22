# @flagolio/flags

SVG country and region flags in **4:3**, **1:1**, and **round 1:1** aspect ratios, plus TypeScript helpers (`FLAG_CODES`, path/URL resolvers, type guard).

## Install

**npm**

```bash
npm install @flagolio/flags
```

**Yarn**

```bash
yarn add @flagolio/flags
```

**pnpm**

```bash
pnpm add @flagolio/flags
```

Requires **Node.js ≥ 18** (ESM).

## Quick start

### List all flag ids

```ts
import { FLAG_CODES, type FlagCode } from "@flagolio/flags";

// readonly tuple of ids (e.g. "us", "gb", "es-ct", "un", …)
console.log(FLAG_CODES.length);
```

### Check if a string is a known id

```ts
import { isFlagCode } from "@flagolio/flags";

if (isFlagCode(code)) {
  // code is FlagCode
}
```

### Resolve a file URL (bundlers: Vite, Astro, Webpack 5, etc.)

Uses `import.meta.url` so the SVG resolves next to the published package:

```ts
import { flagAssetUrl } from "@flagolio/flags";

const src43 = flagAssetUrl("us", "4x3");
const src11 = flagAssetUrl("us", "1x1");
const srcRound = flagAssetUrl("us", "round");
```

Use `src43` in `<img src={...} />` or CSS `url(...)`.

### Absolute path on disk (Node scripts, servers)

```ts
import { readFile } from "node:fs/promises";
import { getFlagPath } from "@flagolio/flags";

const svg = await readFile(getFlagPath("de", "4x3"), "utf8");
```

### Import SVG files directly

Subpath exports map to files under `svg/`:

```ts
import usFlag from "@flagolio/flags/svg/4x3/us.svg";
```

With bundlers that support asset imports, add the query your toolchain expects, e.g. Vite:

```ts
import usUrl from "@flagolio/flags/svg/4x3/us.svg?url";
```

You can confirm resolution with:

```ts
import.meta.resolve("@flagolio/flags/svg/4x3/us.svg");
```

### Ratios

| `FlagRatio` | Folder        | Use case              |
| ----------- | ------------- | --------------------- |
| `"4x3"`     | `svg/4x3/`    | Default wide flag     |
| `"1x1"`     | `svg/1x1/`    | Square                |
| `"round"`   | `svg/round/`  | Circular mask in SVG |

## Publishing as an npm package (maintainers)

This repo is a single app; to publish **`@flagolio/flags`** again you would add a `package.json` under `flags/` (or use npm `files` from root) and point `main`/`types` at `flags/dist`. Until then:

1. **Build** the library output:

   ```bash
   npm run build:flags
   ```

2. **Log in** to npm (one-time per machine): `npm login`

3. **Bump the version** in the package manifest you publish from.

4. **Publish** the scoped package (first publish must allow public scope), e.g. `npm publish --access public` from the package root you configure.

5. **Dry run:** `npm pack --dry-run`

Update `repository.url` and the copyright year in `LICENSE` before publishing if they differ from the placeholders.

## License

MIT — see [LICENSE](./LICENSE).
