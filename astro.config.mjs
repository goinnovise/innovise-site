// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://goinnovise.com",
  integrations: [
    // Generates `sitemap-index.xml` + `sitemap-0.xml`. `lastmod` is stamped
    // at build time so the value refreshes on every deploy rather than
    // drifting from a hand-edited date. To exclude future `noindex` pages,
    // add `filter: (page) => !noindexedUrls.includes(page)` here.
    sitemap({ lastmod: new Date() }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
