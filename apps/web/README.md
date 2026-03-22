# Web app (`apps-web`)

Astro static site for browsing flags and showing `@flag-list/flags` documentation.

## Source layout

| Path | Role |
|------|------|
| **`src/pages/`** | Routes only. `index.astro` loads assets once, builds grid items + flag-icon CSS, composes layout. |
| **`src/components/layout/`** | Shell: `BaseLayout.astro` (HTML document, meta, theme init script, global + Lenis CSS, injected flag-icon CSS). |
| **`src/components/home/`** | Landing hero (`HomeHero.astro`). |
| **`src/components/flag-grid/`** | Browse UI: `FlagGrid.astro` orchestrates `FlagGridHeader`, `FlagGridToolbar`, `ThemeSwitch`, `FlagCard`. |
| **`src/components/docs/`** | `DocsModal.astro` + `PackageDocs.astro` (npm / API copy for the modal). |
| **`src/styles/`** | Global theme + feature CSS (`global.css`, `flag-grid.css`, `home-hero.css`, `package-docs.css`, `docs-modal.css`). |
| **`src/lib/`** | Shared logic: `flagAssetMaps.ts` (glob → URL maps + grid items), `flagIconCss.ts`, `flagContinent.ts`, `flagLabel.ts`. |
| **`src/scripts/`** | Client bundles: `entry.client.ts` imports `docsModal` + `flagGridClient` (tabs, filter, Lenis, theme). |

## Commands

```bash
npm run dev -w apps-web    # dev server
npm run build -w apps-web  # static output in dist/
```
