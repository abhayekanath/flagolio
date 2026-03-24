// @ts-check
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Public site URL (canonical, OG, sitemap). Set PUBLIC_SITE_URL in production, e.g. https://flags.example.com */
const site = process.env.PUBLIC_SITE_URL ?? "https://example.com";

// https://astro.build/config
export default defineConfig({
  site,

  /** Used by `astro dev` and `astro preview`. */
  server: {
    port: 3030,
  },

  vite: {
    /** Fail if 3030 is taken (Astro server config no longer exposes strictPort). */
    server: {
      strictPort: true,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@flags": resolve(__dirname, "flags/svg"),
        "@flagolio/flags": resolve(__dirname, "flags/dist/index.js"),
      },
    },

    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.85,
      lastmod: new Date(),
    }),
  ],
});