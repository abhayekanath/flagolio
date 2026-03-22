# flagolio

Single Astro app with flag SVG assets and TypeScript helpers in **`flags/`** (build output: `flags/dist/`, consumed as `@flagolio/flags` via Vite alias).

| Area | Contents |
| ---- | -------- |
| **`src/`** | Astro pages, components, styles, client scripts |
| **`flags/`** | SVG trees (`svg/4x3`, `1x1`, `round`), TS source, generate scripts — see **[flags/README.md](flags/README.md)** for API notes |

## Development

```bash
npm install
npm run dev
```

`dev` runs code/SVG generation and the TypeScript build for `flags/`, then starts Astro.

```bash
npm run build
npm run preview
```

## Library API

See **[flags/README.md](flags/README.md)** for `FLAG_CODES`, `flagAssetUrl`, `getFlagPath`, `isFlagCode`, and publishing notes if you split the library to npm again.
