---
title: "Use @astrojs/sitemap with explicit lastmod over hand-maintained sitemap.xml"
date: 2026-04-23
category: docs/solutions/tooling-decisions/
module: Build configuration
problem_type: tooling_decision
component: tooling
severity: low
applies_when:
  - Astro site with more than one page, or anticipated growth beyond a single route
  - You want sitemap entries to reflect actual build/deploy time rather than hand-edited dates that drift
  - Search engines should be able to discover new routes without a manual file edit per route
tags:
  - astro
  - sitemap
  - seo
  - build-tooling
  - integration
---

# Use `@astrojs/sitemap` with explicit `lastmod` over hand-maintained `sitemap.xml`

## Context

A static `public/sitemap.xml` is the obvious starting point for a small Astro site — drop the file in, reference it from `robots.txt`, done. It works until the first of these happens:

- A new route is added and the sitemap is not updated (happens consistently).
- `<lastmod>` dates drift from reality. The hand-edited value reflects when the file was last touched, not when the content changed. Search engines downgrade sitemaps with stale `lastmod` values over time.
- Multiple pages exist and the sitemap must list them all, turning maintenance into per-route busywork.

The correct default for any Astro site beyond a single-page stub is the first-party `@astrojs/sitemap` integration. The only subtle trap: by default it omits `<lastmod>` from entries entirely. Without the explicit option, you trade one problem (stale dates) for another (no dates at all, which some crawlers treat as equivalent to unknown freshness).

This decision was made during the April 2026 SEO metadata overhaul of the Innovise site.

## Guidance

Install the integration:

```bash
npm install @astrojs/sitemap
```

Configure it in `astro.config.mjs` with `lastmod` set to the current build time:

```javascript
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    sitemap({ lastmod: new Date() }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

`new Date()` is evaluated at build time, so every deploy stamps the sitemap with the current timestamp. That is a conservative default: it slightly over-reports freshness (every page gets the same `lastmod` regardless of when it individually changed), but this is strictly better than either omitting `lastmod` or letting a hand-edited date go stale. More precise per-page timestamps are possible via the `serialize` hook but are not worth the complexity for small sites.

Update `public/robots.txt` to reference the generated index:

```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap-index.xml
```

Delete the old hand-maintained `public/sitemap.xml`. The integration generates `sitemap-index.xml` and `sitemap-0.xml` at build time. Keeping the old file around creates a conflict where the static file shadows the generated one, or vice versa, depending on Astro's resolution order.

To exclude routes from the sitemap (future `noindex` pages, staging routes, drafts), pass a `filter` function:

```javascript
sitemap({
  lastmod: new Date(),
  filter: (page) => !page.includes("/drafts/") && !page.includes("/internal/"),
}),
```

## Why This Matters

- **Routes get indexed without manual work.** New pages appear in the sitemap automatically on the next build. The failure mode of "added a page, forgot the sitemap, search engines never find it" disappears.
- **`lastmod` reflects deploys, not human memory.** Hand-edited dates drift. Generated dates do not.
- **First-party integration — no maintenance risk.** `@astrojs/sitemap` is maintained by the Astro team, tracks Astro's routing semantics, and updates alongside the framework. Third-party alternatives (or hand-rolled generators) fall behind.
- **The explicit `lastmod` option is the non-obvious part.** Reading only the integration's default example gets you a sitemap without dates. Flagging the need for `{ lastmod: new Date() }` prevents the "it works but doesn't actually help SEO" failure mode.

## When to Apply

- Any Astro site beyond a literal single-page stub.
- Any static site generator with an equivalent sitemap integration (the pattern — first-party integration with explicit build-time `lastmod`, remove hand-maintained static file, update `robots.txt` — generalizes).

Do **not** apply when:

- The site genuinely has one route and will stay that way (no integration overhead is worth it).
- The project needs per-page `lastmod` values sourced from actual content modification times (in that case, use the `serialize` hook and source from git or CMS metadata).

## Examples

**Before** — hand-maintained `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-11-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

Problems: `<lastmod>` drifts; new routes require manual edits; `<changefreq>` and `<priority>` are mostly ignored by modern crawlers but still hand-maintained.

**After** — integration in `astro.config.mjs`:

```javascript
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [sitemap({ lastmod: new Date() })],
});
```

Build output produces `dist/sitemap-index.xml` and `dist/sitemap-0.xml` with all routes and current-build `lastmod` values.

`public/robots.txt` updated to reference the index:

```
Sitemap: https://example.com/sitemap-index.xml
```

## Related

- `astro.config.mjs` — integration configured here.
- `public/robots.txt` — sitemap reference updated here.
- [`@astrojs/sitemap` documentation](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — canonical reference for options including `filter`, `serialize`, and `i18n`.
