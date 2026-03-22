# @flag-list/flags

SVG country and region flags in **4:3**, **1:1**, and **round 1:1** aspect ratios, plus TypeScript helpers (`FLAG_CODES`, path/URL resolvers, type guard).

## Install

**npm**

```bash
npm install @flag-list/flags
```

**Yarn**

```bash
yarn add @flag-list/flags
```

**pnpm**

```bash
pnpm add @flag-list/flags
```

Requires **Node.js ≥ 18** (ESM).

## Quick start

### List all flag ids

```ts
import { FLAG_CODES, type FlagCode } from "@flag-list/flags";

// readonly tuple of ids (e.g. "us", "gb", "es-ct", "un", …)
console.log(FLAG_CODES.length);
```

### Check if a string is a known id

```ts
import { isFlagCode } from "@flag-list/flags";

if (isFlagCode(code)) {
  // code is FlagCode
}
```

### Resolve a file URL (bundlers: Vite, Astro, Webpack 5, etc.)

Uses `import.meta.url` so the SVG resolves next to the published package:

```ts
import { flagAssetUrl } from "@flag-list/flags";

const src43 = flagAssetUrl("us", "4x3");
const src11 = flagAssetUrl("us", "1x1");
const srcRound = flagAssetUrl("us", "round");
```

Use `src43` in `<img src={...} />` or CSS `url(...)`.

### Absolute path on disk (Node scripts, servers)

```ts
import { readFile } from "node:fs/promises";
import { getFlagPath } from "@flag-list/flags";

const svg = await readFile(getFlagPath("de", "4x3"), "utf8");
```

### Import SVG files directly

Subpath exports map to files under `svg/`:

```ts
import usFlag from "@flag-list/flags/svg/4x3/us.svg";
```

With bundlers that support asset imports, add the query your toolchain expects, e.g. Vite:

```ts
import usUrl from "@flag-list/flags/svg/4x3/us.svg?url";
```

You can confirm resolution with:

```ts
import.meta.resolve("@flag-list/flags/svg/4x3/us.svg");
```

### Ratios

| `FlagRatio` | Folder        | Use case              |
| ----------- | ------------- | --------------------- |
| `"4x3"`     | `svg/4x3/`    | Default wide flag     |
| `"1x1"`     | `svg/1x1/`    | Square                |
| `"round"`   | `svg/round/`  | Circular mask in SVG |

## Publishing this package (maintainers)

From the **monorepo root** (this repo):

1. **Build** (runs automatically on publish via `prepublishOnly`):

   ```bash
   npm run build -w @flag-list/flags
   ```

2. **Log in** to npm (one-time per machine):

   ```bash
   npm login
   ```

3. **Bump the version** in `packages/flags/package.json` (`npm version patch|minor|major` inside that package, or edit by hand).

4. **Publish** the scoped package (first publish must allow public scope):

   ```bash
   npm publish -w @flag-list/flags --access public
   ```

   **Yarn (Berry / modern):**

   ```bash
   yarn workspace @flag-list/flags npm publish --access public
   ```

5. **Dry run** (inspect tarball without uploading):

   ```bash
   npm pack -w @flag-list/flags --dry-run
   ```

Update `repository.url` and the copyright year in `LICENSE` before publishing if they differ from the placeholders.

## License

MIT — see [LICENSE](./LICENSE).
