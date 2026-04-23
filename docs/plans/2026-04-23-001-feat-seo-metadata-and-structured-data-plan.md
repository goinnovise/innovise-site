---

## title: "feat: Add SEO metadata, social tags, and structured data"
type: feat
status: active
date: 2026-04-23
origin: docs/brainstorms/2026-04-23-seo-meta-overhaul-requirements.md

# feat: Add SEO metadata, social tags, and structured data

## Overview

The Innovise marketing site ships with minimal search and social metadata: no Open Graph or Twitter Card tags, no canonical URL, a hand-maintained sitemap with a hardcoded `lastmod`, and no structured data. This plan brings the site to an industry-standard metadata baseline by extending `src/layouts/Layout.astro`, replacing the static `public/sitemap.xml` with the `@astrojs/sitemap` integration, and rolling in a latent relative-path bug fix for the favicon/webmanifest markup.

Scope is tight on purpose: no new pages, no image-optimization work on `hero-bg.png`, no font self-hosting. Those are deliberately deferred (see Scope Boundaries).

---

## Problem Frame

Links to `goinnovise.com` currently render as bare URLs in LinkedIn, Slack, iMessage, and X — actively undercutting the brand's "boutique, senior-engineer" positioning. Google's knowledge graph has no structured-data signal to associate the site's LinkedIn profile, founder, or business type. The sitemap's `lastmod` is stale by design (hand-edited string) and will drift further each build.

A separate latent bug exists in `src/layouts/Layout.astro`: favicon, apple-touch-icon, and webmanifest `href` values are relative (`href="images/logo/..."`) rather than root-absolute (`/images/logo/...`). These resolve correctly on the root path but will 404 from any non-root URL. Since this code touches the same `<head>` block, the fix rolls in here.

---

## Requirements Trace

- R1. Every page renders full Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:image:alt`, `og:image:width`, `og:image:height`, `og:site_name`, `og:locale`.
- R2. Every page renders Twitter Card tags: `twitter:card` = `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`. `twitter:site` is omitted by design.
- R3. `og:title` / `og:description` default to the page's `<title>` and `<meta name="description">` but can be overridden per page via Layout props.
- R4. A share image exists at `public/images/og-image.png` at 1200×630, referenced by both `og:image` and `twitter:image`. Asset supplied by the client.
- R5. Every page renders `<link rel="canonical">` using the page's absolute URL derived from `Astro.site` and `Astro.url.pathname`.
- R6. `<meta name="theme-color">` is set using `#f47c64` (brand-400, the logo coral) so mobile browser chrome matches the hero section.
- R7. JSON-LD `ProfessionalService` block is rendered in `<head>` with `name`, `url`, `logo`, `description`, `address` (Bellevue, WA, US as `PostalAddress`), `sameAs: ["https://www.linkedin.com/company/innovise-technology"]`, and `founder` as a `Person` named Loren Anderson.
- R8. JSON-LD `WebSite` block is rendered in `<head>` with `name`, `url`, and `publisher` referencing the same organization.
- R9. Both JSON-LD blocks validate against Google's Rich Results Test with zero errors.
- R10. `public/sitemap.xml` is deleted; the `@astrojs/sitemap` integration generates it at build time.
- R11. `public/robots.txt` references the generated sitemap URL (which will be `sitemap-index.xml`, not `sitemap.xml`).
- R12. All `href` values in `Layout.astro` under `<head>` for favicons, apple-touch-icon, and webmanifest use root-absolute paths.
- R13. `Layout.astro` accepts optional `title`, `description`, `image`, `imageAlt`, and `noindex` props. When `noindex` is true, `<meta name="robots" content="noindex, nofollow">` is emitted.

---

## Scope Boundaries

- **Hero/LCP image optimization** — converting `hero-bg.png` to WebP/AVIF and preloading is a real CWV win but a separate workstream.
- **Self-hosting Google Fonts** — deferred.
- **Adding indexable content pages** (blog, case studies, per-service pages) — product decision, not in this plan.
- **Search Console / Bing Webmaster verification** — recommended via DNS, no code change needed.
- `**security.txt` / `humans.txt`** — not SEO; omit unless separately requested.
- **Keywords meta tag** — deprecated, not added.
- `**twitter:site` handle** — deliberately omitted; add when an X presence exists.
- **Breadcrumb / FAQ / Article schema** — inapplicable to a single-page site.
- **Anchor-fragment URLs in sitemap** (`#services`, `#team`) — Google ignores fragments for indexing.
- **Cookie banner / GA4 consent mode** — privacy/compliance decision for a separate brainstorm.
- **Automated test harness for the Astro site** — this site currently has no test runner. Verification uses build-output inspection, not a new test framework.

---

## Context & Research

### Relevant Code and Patterns

- `src/layouts/Layout.astro` — current `<head>` block with title/description/favicons/gtag; the central file for U2, U3, U4. Accepts `title` and `description` props via a typed `Props` interface.
- `src/pages/index.astro` — only page; passes no props to Layout, so Layout defaults carry.
- `src/components/Footer.astro` — already links `https://www.linkedin.com/company/innovise-technology` (source of truth for the `sameAs` URL).
- `astro.config.mjs` — `site: "https://goinnovise.com"` already set, so `Astro.site` is usable for canonical and sitemap generation.
- `public/robots.txt` — already references `https://goinnovise.com/sitemap.xml` and must be updated to `sitemap-index.xml` in U1.
- `public/sitemap.xml` — static, hand-maintained; deleted in U1.

### Institutional Learnings

- `docs/solutions/best-practices/innovise-site-astro-icon-and-component-patterns-2026-04-20.md` — Tailwind v4 token model lives in `src/styles/global.css @theme {}`; no `tailwind.config.js`. Brand colors confirmed: `#f47c64` = brand-400 (logo coral), `#c24a36` = brand-500 (darker solid fill). `#f47c64` is the correct choice for `theme-color` since it matches the hero's top-of-fold impression on mobile.

### External References

- `@astrojs/sitemap` (v3.7.2 current, confirmed Astro 6 compatible): default output is `sitemap-index.xml` + shards like `sitemap-0.xml`. `filter: (page) => boolean` is available if a future `noindex` page needs to be excluded. Docs: [https://docs.astro.build/en/guides/integrations-guide/sitemap/](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- schema.org `ProfessionalService`: [https://schema.org/ProfessionalService](https://schema.org/ProfessionalService) — extends `LocalBusiness` but does not require the address to be a physical storefront; acceptable for a remote-first firm that lists a city.
- Open Graph protocol: [https://ogp.me/](https://ogp.me/) — `og:image:width` / `og:image:height` are optional but improve LinkedIn and Slack rendering reliability.
- Twitter Card reference: [https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards](https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards) — `summary_large_image` is correct for a 1200×630 asset.

---

## Key Technical Decisions

- **Schema.org type: `ProfessionalService`.** Closest fit for a consulting firm; accepts but does not require `PostalAddress` to imply a storefront. Chosen over `Organization` (less specific) and `LocalBusiness` (implies walk-in).
- **Single `image` string prop, not an object.** Layout accepts a path like `/images/og-image.png`; width/height/alt stay in the Layout's metadata block since the committed asset spec is fixed at 1200×630. Keeps the prop API flat. Upgrading to an object shape later is a non-breaking addition if distinct per-page images at different dimensions are ever needed.
- **JSON-LD inline in `Layout.astro`.** For a single-page site, extracting a `StructuredData.astro` component is premature abstraction. Extraction becomes trivial once there are 2+ pages that need different structured-data shapes.
- **Default `@astrojs/sitemap` config, no custom `filter`.** No page uses `noindex` today, so no filter is needed in v1. The hook-up point is documented in U1 for when the first `noindex` page appears.
- `**theme-color` = `#f47c64` (brand-400).** Matches the hero background for continuity on mobile browser chrome.
- **Canonical URL via `new URL(Astro.url.pathname, Astro.site).href`.** Avoids divergence between deployed URL and declared canonical, and Astro guarantees `Astro.site` is defined because it's set in `astro.config.mjs`.
- **Keep the gtag snippet unchanged.** Out of scope here; modifying analytics is a separate privacy/compliance conversation.

---

## Open Questions

### Resolved During Planning

- **Prop API shape** — flat string props (`image`, `imageAlt`) rather than a nested object. See Key Technical Decisions.
- **JSON-LD component boundary** — inline in Layout for now. See Key Technical Decisions.
- **Sitemap filter for `noindex`** — defer until the first `noindex` page exists; document the extension point in U1.

### Deferred to Implementation

- **OG image asset delivery timing** — the client commits to supplying `public/images/og-image.png` before the change is deployed to production. Implementation can land the tag wiring without the asset; final "done" is gated on the file existing. Call this out in the PR description.
- **Whether to preload** `/images/og-image.png` — almost certainly not worth it (it's a crawler asset, not an LCP element). Implementer can confirm by checking the Network tab in DevTools after build if a concern surfaces.  NOTE: added to `public/images/logo/og-image.png`

---

## Implementation Units

- U1. **Replace static sitemap with `@astrojs/sitemap` integration**

**Goal:** Generate a correct, always-fresh sitemap at build time and update `robots.txt` to reference it.

**Requirements:** R10, R11

**Dependencies:** None

**Files:**

- Modify: `package.json` (add `@astrojs/sitemap` dependency)
- Modify: `astro.config.mjs` (register the integration)
- Delete: `public/sitemap.xml`
- Modify: `public/robots.txt` (update Sitemap directive to `https://goinnovise.com/sitemap-index.xml`)

**Approach:**

- Install the integration (`npm install @astrojs/sitemap`), pinned to the current major.
- Register it in `astro.config.mjs` via `integrations: [sitemap()]`. No custom options needed: defaults produce `sitemap-index.xml` + `sitemap-0.xml` using `Astro.site` as the base URL and source-file mtimes for `lastmod`.
- Delete the hand-maintained `public/sitemap.xml` so it cannot shadow the generated output.
- Update `public/robots.txt` to point at `sitemap-index.xml`.
- In the `astro.config.mjs` comment, note the `filter: (page) => boolean` extension point so a future `noindex` page can be excluded without a dedicated plan.

**Patterns to follow:**

- Existing `defineConfig({ site, vite: { plugins: [...] } })` structure in `astro.config.mjs`. Add `integrations: [sitemap()]` alongside, not inside `vite.plugins`.

**Test scenarios:**

- Happy path: `npm run build` completes without errors and produces `dist/sitemap-index.xml` and at least one `dist/sitemap-N.xml`.
- Happy path: the generated sitemap contains `<loc>https://goinnovise.com/</loc>` and a `<lastmod>` value in ISO-8601 format.
- Happy path: `dist/robots.txt` contains `Sitemap: https://goinnovise.com/sitemap-index.xml` (served verbatim from `public/`).
- Edge case: running `npm run build` twice in succession produces the same sitemap contents (idempotent build).

**Verification:**

- `public/sitemap.xml` no longer exists on disk.
- `dist/sitemap-index.xml` exists after a clean build and references at least one shard.
- `public/robots.txt` Sitemap directive matches the generated filename.

---

- U2. **Expand `Layout.astro` props API, emit canonical / theme-color / robots, and fix relative icon paths**

**Goal:** Create the structural foundation the social-sharing and structured-data units will build on, and close the latent relative-path bug in the same `<head>` edit.

**Requirements:** R5, R6, R12, R13

**Dependencies:** None (parallel-safe with U1)

**Files:**

- Modify: `src/layouts/Layout.astro`

**Approach:**

- Extend the `Props` interface to add optional `image?: string`, `imageAlt?: string`, `noindex?: boolean`. Keep the existing `title` and `description` props and their defaults.
- Compute `const canonicalURL = new URL(Astro.url.pathname, Astro.site).href;` in the frontmatter. Emit `<link rel="canonical" href={canonicalURL}>`.
- Emit `<meta name="theme-color" content="#f47c64">`.
- When `noindex` is true, emit `<meta name="robots" content="noindex, nofollow">`. Do not emit the inverse tag when false; absence is the correct default.
- Change the five `<head>` `href` values that begin with `images/logo/…` to `/images/logo/…` (favicon 96x96 PNG, SVG favicon, shortcut ICO, apple-touch-icon, webmanifest).
- Keep the `image` and `imageAlt` props in the `Props` interface even though they are consumed only by U3; this avoids an interface churn in the next unit.
- Default `image` to `/images/og-image.png` and `imageAlt` to a descriptive sentence about Innovise, e.g., `"Innovise Technologies — custom software, built by senior engineers."` (Marketing-copy-rule compliant: specific, not adjective-heavy.)

**Patterns to follow:**

- Existing `Props` interface and destructured `const { ... } = Astro.props;` pattern in the current Layout.
- Tailwind token source of truth is `src/styles/global.css @theme {}`, but `theme-color` is a raw hex in the meta tag — do not try to reference a CSS variable here.

**Test scenarios:**

- Happy path: `dist/index.html` contains exactly one `<link rel="canonical" href="https://goinnovise.com/">`.
- Happy path: `dist/index.html` contains `<meta name="theme-color" content="#f47c64">`.
- Happy path: all five icon-related `<link>` `href` attributes begin with `/` (not `images/`).
- Edge case: `noindex` prop default (not supplied) produces no robots meta tag in `dist/index.html`.
- Edge case: setting `noindex: true` on a hypothetical future page produces exactly one `<meta name="robots" content="noindex, nofollow">` tag in that page's built output.

**Verification:**

- Browser DevTools shows the correct canonical and theme-color.
- Favicon renders correctly from a deeper (future) path like `/thank-you/` — not a blocker today, but this is what the fix unlocks.

---

- U3. **Add Open Graph and Twitter Card meta tags**

**Goal:** Deliver formatted link previews in LinkedIn, Slack, iMessage, and X.

**Requirements:** R1, R2, R3, R4

**Dependencies:** U2 (relies on `image`, `imageAlt`, canonical URL, and title/description defaults)

**Files:**

- Modify: `src/layouts/Layout.astro`
- Asset (not authored in this unit — client-supplied): `public/images/og-image.png` (1200×630)

**Approach:**

- In the Layout frontmatter, compute `const ogImageURL = new URL(image, Astro.site).href;` so `og:image` and `twitter:image` are absolute URLs (both protocols require absolute URLs — relative paths cause silent rendering failures on LinkedIn).
- Emit the following in `<head>` after the existing `<meta name="description">`:
  - `<meta property="og:title" content={title}>`
  - `<meta property="og:description" content={description}>`
  - `<meta property="og:type" content="website">`
  - `<meta property="og:url" content={canonicalURL}>`
  - `<meta property="og:image" content={ogImageURL}>`
  - `<meta property="og:image:alt" content={imageAlt}>`
  - `<meta property="og:image:width" content="1200">`
  - `<meta property="og:image:height" content="630">`
  - `<meta property="og:site_name" content="Innovise Technologies">`
  - `<meta property="og:locale" content="en_US">`
- Emit Twitter Card tags immediately after:
  - `<meta name="twitter:card" content="summary_large_image">`
  - `<meta name="twitter:title" content={title}>`
  - `<meta name="twitter:description" content={description}>`
  - `<meta name="twitter:image" content={ogImageURL}>`
  - `<meta name="twitter:image:alt" content={imageAlt}>`
- Do not emit `twitter:site` — there's no handle. Adding it empty breaks validation.

**Patterns to follow:**

- Matches the existing `<meta>` style in the file (simple attribute order, no self-closing slash). Keep Prettier-clean.

**Test scenarios:**

- Happy path: all 10 OG tags listed above are present in `dist/index.html` with non-empty `content` values.
- Happy path: all 5 Twitter Card tags listed above are present in `dist/index.html`.
- Happy path: `og:image` and `twitter:image` values start with `https://goinnovise.com/images/og-image.png` (absolute, not relative).
- Happy path: `og:url` matches the canonical URL exactly.
- Edge case: when `title` and `description` are not passed, OG tags fall back to the Layout defaults (same as `<title>` and `<meta name="description">`).
- Edge case: per-page overrides via `<Layout title="..." description="..." image="/images/alt-og.png" imageAlt="...">` propagate to all corresponding OG and Twitter tags (verifiable by adding one throwaway test page during implementation and discarding it before commit, or by sanity-checking via a temporary `const` override).
- Integration (post-deploy): pasting `https://goinnovise.com/` into LinkedIn's Post Inspector returns a card with the designed image, title, and description and zero "recommended" warnings. Same check via Slack's unfurling and X's Card Validator.

**Verification:**

- `curl -sSL https://goinnovise.com/ | grep -E '(og:|twitter:)'` after deploy returns all 15 expected tags.
- LinkedIn Post Inspector, Slack unfurl preview, and X Card Validator all render the intended card.

---

- U4. **Add JSON-LD structured data (`ProfessionalService` + `WebSite`)**

**Goal:** Expose Innovise to Google's knowledge graph with correct entity typing and `sameAs` links.

**Requirements:** R7, R8, R9

**Dependencies:** U2 (reuses the canonical URL computation)

**Files:**

- Modify: `src/layouts/Layout.astro`

**Approach:**

- In the Layout frontmatter, define two JavaScript objects — `professionalServiceSchema` and `websiteSchema` — following schema.org's `ProfessionalService` and `WebSite` contracts.
- Emit each as a `<script type="application/ld+json" set:html={JSON.stringify(schema)}></script>` block at the end of `<head>` (after the Twitter tags, before the gtag scripts). `set:html` is Astro's safe-HTML escape hatch; it writes the stringified JSON verbatim without Astro transforming it.
- `ProfessionalService` fields:
  - `@context: "https://schema.org"`, `@type: "ProfessionalService"`
  - `name: "Innovise Technologies"`
  - `url: Astro.site.href`
  - `logo: new URL("/images/logo/innovise-main-logo.png", Astro.site).href`
  - `description`: the default Layout description
  - `address`: `{ "@type": "PostalAddress", "addressLocality": "Bellevue", "addressRegion": "WA", "addressCountry": "US" }`
  - `sameAs: ["https://www.linkedin.com/company/innovise-technology"]`
  - `founder`: `{ "@type": "Person", "name": "Loren Anderson" }`
- `WebSite` fields:
  - `@context: "https://schema.org"`, `@type: "WebSite"`
  - `name: "Innovise Technologies"`
  - `url: Astro.site.href`
  - `publisher`: a reference object pointing to the `ProfessionalService` by `@id`. Assign `"@id": "https://goinnovise.com/#organization"` to the ProfessionalService block and `publisher: { "@id": "https://goinnovise.com/#organization" }` on the WebSite block so Google sees them as linked entities, not two independent orgs.

**Patterns to follow:**

- Astro's `set:html` directive is already used in this codebase (per `docs/solutions/best-practices/innovise-site-astro-icon-and-component-patterns-2026-04-20.md` — used for icon strings). Same mechanic applies here for JSON-LD.
- No external dependency needed; `JSON.stringify` is sufficient. Avoid pulling in `schema-dts` or similar — over-engineering for two static blocks.

**Test scenarios:**

- Happy path: `dist/index.html` contains exactly two `<script type="application/ld+json">` blocks.
- Happy path: parsing each block with `JSON.parse` yields valid JSON with the expected `@type` values (`ProfessionalService`, `WebSite`).
- Happy path: `ProfessionalService.sameAs[0]` equals `https://www.linkedin.com/company/innovise-technology`.
- Happy path: `ProfessionalService["@id"]` and `WebSite.publisher["@id"]` match exactly.
- Edge case: the `description` used in the JSON-LD must not contain un-escaped quotes that would break the script block. `JSON.stringify` handles this, but a spot-check grep for unescaped `"` inside the script is cheap insurance.
- Integration (post-deploy): Google's Rich Results Test (`https://search.google.com/test/rich-results`) returns zero errors for `https://goinnovise.com/` and identifies both `ProfessionalService` and `WebSite` entities.
- Integration (post-deploy): Schema Markup Validator (`https://validator.schema.org/`) reports zero errors on both blocks.

**Verification:**

- Both JSON-LD blocks are present, parseable, and linked via `@id` / `publisher`.
- Zero errors in Rich Results Test and Schema Markup Validator.

---

## System-Wide Impact

- **Interaction graph:** Changes are scoped to `<head>` markup and build-time config. No runtime JavaScript changes, no component interaction changes.
- **Error propagation:** Not applicable — meta tags are static emission.
- **State lifecycle risks:** None. Static generation.
- **API surface parity:** `Layout.astro` props gain `image`, `imageAlt`, `noindex` as optional fields. Existing callers (`src/pages/index.astro`) pass no props and remain valid because all additions are optional. Any future page can override per-page.
- **Integration coverage:** Build-output assertions cover emission. Post-deploy external validators (Rich Results, LinkedIn Post Inspector, X Card Validator, Schema Markup Validator) cover rendering.
- **Unchanged invariants:** The gtag analytics snippet, the `IntersectionObserver` script, the navbar scroll handler, and all existing component imports are untouched.

---

## Risks & Dependencies


| Risk                                                                                                                                                                    | Mitigation                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client does not supply `og-image.png` before deploy                                                                                                                     | PR description gates merge on asset delivery; or land tag wiring and ship the asset in a follow-up commit before promoting to production. Either path is safe since `og:image` will simply 404 until the asset arrives. |
| `@astrojs/sitemap` default filename (`sitemap-index.xml`) diverges from external references to `/sitemap.xml` that may exist off-site                                   | U1 updates `robots.txt`. Any off-site backlinks to `/sitemap.xml` are a non-issue for SEO (sitemaps are discovered via `robots.txt`, not direct linking).                                                               |
| Astro 6 version churn introduces a breaking change in `@astrojs/sitemap`                                                                                                | Pin to the exact major installed at implementation time. The integration is first-party and tracks Astro 6 per the April 2026 release notes.                                                                            |
| JSON-LD validation subtlety (e.g., `logo` must be a URL, not a `{url: ...}` object, for some consumers)                                                                 | U4 uses plain string URLs. Rich Results Test run post-deploy will catch any remaining issue; treat it as a merge gate rather than guessing now.                                                                         |
| `image` prop passed with an already-absolute URL breaks `new URL(image, Astro.site)` semantics (the base is ignored, which is actually correct behavior but surprising) | Document in the Layout comment that `image` accepts either a root-relative path or an absolute URL; `new URL` handles both.                                                                                             |


---

## Documentation / Operational Notes

- **Post-merge validation runbook:** After the first deploy, run (a) Google Rich Results Test on `https://goinnovise.com/`, (b) LinkedIn Post Inspector, (c) X Card Validator, (d) Slack unfurl check. Capture screenshots in the PR for visual evidence.
- **Search Console (optional, out of scope):** If Innovise later verifies the site via DNS in Google Search Console, the submitted sitemap URL is `https://goinnovise.com/sitemap-index.xml`.
- **Institutional learning candidate:** Once this ships and Rich Results validates, capture a short best-practices note under `docs/solutions/best-practices/` covering the Layout props API, the JSON-LD inline pattern, and the `theme-color` + brand-token relationship — so the next agent adding a page knows the conventions.

---

## Sources & References

- **Origin document:** `docs/brainstorms/2026-04-23-seo-meta-overhaul-requirements.md`
- Related code:
  - `src/layouts/Layout.astro` — central target
  - `src/components/Footer.astro` — confirms LinkedIn URL
  - `astro.config.mjs` — `Astro.site` source of truth
  - `public/robots.txt`, `public/sitemap.xml` — sitemap swap
  - `docs/solutions/best-practices/innovise-site-astro-icon-and-component-patterns-2026-04-20.md` — Tailwind v4 and `set:html` conventions
- External docs:
  - [https://docs.astro.build/en/guides/integrations-guide/sitemap/](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
  - [https://ogp.me/](https://ogp.me/)
  - [https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards](https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards)
  - [https://schema.org/ProfessionalService](https://schema.org/ProfessionalService)
  - [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
  - [https://validator.schema.org/](https://validator.schema.org/)

