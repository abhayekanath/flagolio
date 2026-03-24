# @flagolio/flags

SVG country and region flags in **default (wide)**, **square**, and **round** aspect ratios, plus TypeScript helpers (`FLAG_CODES`, path/URL resolvers, type guard).

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

const srcDefault = flagAssetUrl("us", "default");
const srcSquare = flagAssetUrl("us", "square");
const srcRound = flagAssetUrl("us", "round");
```

Use `srcDefault` in `<img src={...} />` or CSS `url(...)`.

### Absolute path on disk (Node scripts, servers)

```ts
import { readFile } from "node:fs/promises";
import { getFlagPath } from "@flagolio/flags";

const svg = await readFile(getFlagPath("de", "default"), "utf8");
```

### Import SVG files directly

Subpath exports map to files under `svg/`:

```ts
import usFlag from "@flagolio/flags/svg/default/us.svg";
```

With bundlers that support asset imports, add the query your toolchain expects, e.g. Vite:

```ts
import usUrl from "@flagolio/flags/svg/default/us.svg?url";
```

You can confirm resolution with:

```ts
import.meta.resolve("@flagolio/flags/svg/default/us.svg");
```

### Ratios

| `FlagRatio`   | Folder          | Use case              |
| ------------- | --------------- | --------------------- |
| `"default"`   | `svg/default/`  | Default wide flag     |
| `"square"`    | `svg/square/`   | Square                |
| `"round"`     | `svg/round/`    | Circular mask in SVG  |

## `npm link` (try the package in another project)

Order matters. **`npm link @flagolio/flags`** is only run in the *consumer* app, after the library is registered globally.

1. **Build** and **register** the package (from repo root or from `flags/`):

   ```bash
   npm run build:flags
   cd flags
   npm link
   ```

   That last command has **no package name**. It reads `flags/package.json` and creates a global link to this folder.

2. In **another project** (the one that will `import "@flagolio/flags"`):

   ```bash
   npm link @flagolio/flags
   ```

If you run step 2 **before** step 1, or from inside `flags/` expecting it to “install itself”, npm falls back to the registry → **404** (package is not published).

To remove the link in the consumer: `npm unlink @flagolio/flags` then `npm install`.

## Publishing as an npm package (maintainers)

`package.json` lives under **`flags/`**. From that folder:

1. **Build** the library output (from repo root):

   ```bash
   npm run build:flags
   ```

2. **Authenticate** to npm (pick one):

   - **`npm login`** (simplest), or  
   - a **granular access token** from [npm → Access Tokens](https://www.npmjs.com/settings/~/tokens), stored only in your **user** config file `~/.npmrc` (Windows: `C:\Users\<you>\.npmrc`), e.g.  
     `//registry.npmjs.org/:_authToken=YOUR_TOKEN`  
     Never commit tokens; project `.npmrc` is gitignored here.

   **Do not** run `npm install` with a string starting with `npm_` — that is a **token**, not a package name; npm will return **404** / invalid name.

3. **Bump the version** in `flags/package.json`.

4. **Publish** from `flags/`: `npm publish` — `publishConfig.access` is set to **`public`** in `package.json`, so scoped `@flagolio/flags` is published as a **public** package (no paid npm plan required). You still need npm login + 2FA/token as required by your account.

5. **Dry run:** `cd flags && npm pack --dry-run`

Update `repository.url` and the copyright year in `LICENSE` before publishing if they differ from the placeholders.

## License

MIT — see [LICENSE](./LICENSE).
