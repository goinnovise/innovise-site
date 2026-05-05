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
    // drifting from a hand-edited date. Resume pages are excluded — they're
    // noindex direct-share artifacts, not crawlable content.
    sitemap({
      lastmod: new Date(),
      filter: (page) => !page.startsWith("https://goinnovise.com/resumes/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
