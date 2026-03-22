// @ts-check
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@flags": resolve(__dirname, "flags/svg"),
        "@flagolio/flags": resolve(__dirname, "flags/dist/index.js"),
      },
    },
  },
});
