# flag-list

Monorepo:

| Package / app        | Description |
| -------------------- | ----------- |
| **`@flag-list/flags`** | Publishable npm package: SVG flags (4:3, 1:1, round) + TypeScript API. |
| **`apps/web`**       | Astro demo site (not published as a library). See **[apps/web/README.md](apps/web/README.md)** for folder layout (`components/`, `styles/`, `lib/`, `scripts/`). |

## Development

```bash
npm install
npm run build
npm run dev
```

## Using the flags package

See **[packages/flags/README.md](packages/flags/README.md)** for install commands, API (`FLAG_CODES`, `flagAssetUrl`, `getFlagPath`, `isFlagCode`), and **how to publish** `@flag-list/flags` to npm.
