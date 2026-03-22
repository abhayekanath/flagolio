# flagolio

Single Astro app with flag SVG assets and TypeScript helpers in **`flags/`** (build output: `flags/dist/`, consumed as `@flagolio/flags` via Vite alias).

| Area | Contents |
| ---- | -------- |
| **`src/`** | Astro pages, [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (React islands), client scripts |
| **`flags/`** | SVG trees (`svg/4x3`, `1x1`, `round`), TS source, generate scripts — see **[flags/README.md](flags/README.md)** for API notes |

## Site URL (SEO)

Set **`PUBLIC_SITE_URL`** to your public origin (e.g. `https://flags.example.com`) before `npm run build` so canonical URLs, Open Graph, `sitemap-index.xml`, and `robots.txt` point at the real domain. The default in config is a placeholder.

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
