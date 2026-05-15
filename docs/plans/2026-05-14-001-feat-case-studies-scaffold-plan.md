---
title: "feat: Case studies section scaffold"
type: feat
status: active
date: 2026-05-14
origin: docs/brainstorms/2026-05-13-case-studies-scaffold-requirements.md
---

# feat: Case studies section scaffold

## Summary

Scaffolds the case-studies content surface in five units: a Markdown content collection with frontmatter-enforced metadata, a `/case-studies/[slug]/` route with `BlogPosting` JSON-LD, a `/case-studies/` landing page that handles zero items cleanly, header and footer nav entries, and a reusable `RelatedCaseStudies` component embedded in all seven service pages that surfaces matching case studies or omits itself entirely when none exist.

---

## Problem Frame

The site has no surface for long-form proof-of-work and cannot rank for buyer-evaluation case-study searches today. Innovise plans to publish 4–8 case studies during a finite marketing push, and a generic "Blog" framing at that cadence would invite the stagnation credibility leak that the brand voice explicitly works against. Full motivation, voice constraints, and product decisions are in the origin document (see Sources & References).

---

## Requirements

All requirements trace to `docs/brainstorms/2026-05-13-case-studies-scaffold-requirements.md`. R-IDs and AE-IDs preserved verbatim.

**Surface architecture**

- R1. A `case-studies` content surface exists at a stable URL and is listed in the site's sitemap.
- R2. Each case study lives at its own URL under the case-studies path and renders with full structured-data treatment.
- R3. The landing page lists case studies as cards leading with the concrete client outcome, not a generic title.
- R4. The landing page does not foreground recency.

**Authoring path**

- R5. Adding a new case study is a single-file content operation following the existing Astro content-collection pattern. No engineering work required after scaffold ships.
- R6. Frontmatter captures: title, slug, summary, hero image, publication date, primary service line, author attribution. (Note: the slug is derived from the content file's filename per Astro convention — the Zod schema does not declare a `slug` field; `entry.id` from the glob loader serves the role. See U1 Approach. The plan also adds an `outcome` field beyond origin R6's listing, to drive R3's "card leads with outcome" affordance.)
- R7. Body is freeform Markdown. The template offers a conventional but unenforced shape.
- R8. Author attribution is light inline; no standalone bio pages.

**Service-page integration**

- R9. Each case study identifies a primary service line via frontmatter, drawn from the existing service slug set.
- R10. Each individual case-study page surfaces a back-link to its primary service page.
- R11. Each `services/*` page surfaces a "related case studies" block listing 1–2 case studies whose primary service line matches.
- R12. The related-block is fully omitted from the rendered service page when no case studies match.

**Navigation**

- R13. The header nav links to the case-studies landing page.
- R14. The footer nav links to the case-studies landing page.
- R15. Header and footer links point to the same path. User controls public visibility by timing the first case-study publication; gating is not enforced in code.

**Empty-state behavior**

- R16. The landing page renders without errors at zero published case studies.

**SEO and structured data**

- R17. Each individual case-study page emits article-shaped JSON-LD with `headline`, `datePublished`, `author`, and `description`.
- R18. Both landing and individual pages are indexable and participate in existing sitemap generation.
- R19. Each case-study page's `<title>` leads with the topic, not the company name. Company name last.
- R20. Each case-study page's `<meta name="description">` is sourced from the post's summary frontmatter.

**Voice and copy alignment**

- R21. All scaffold copy complies with `.cursor/rules/marketing-copy.mdc`: directness, specificity, no jargon, sentence-case headings.

**Origin actors:** A1 (case-study author), A2 (site visitor).
**Origin flows:** F1 (author publishes a new case study).
**Origin acceptance examples:** AE1 (covers R12), AE2 (covers R16), AE3 (covers R3).

---

## Scope Boundaries

- Writing any case-study content. The user authors and adds the first case study in a follow-up.
- Generic blog functionality: opinion essays, framework pieces, announcements.
- Newsletter, RSS, comments, social reactions.
- A separate "notes" / "writing" surface alongside case studies.
- Standalone author bio pages.
- Tags or taxonomies beyond service-line clustering.
- Off-site marketing tactics (paid amplification, link-building outreach, social distribution automation).
- i18n / multi-language.
- Changes to the homepage hero, services-section heading, or other top-level brand-tier copy.
- Restructuring of the existing service pages beyond inserting the new related-block section.

### Deferred to Follow-Up Work

- Curated ordering for the related-case-studies block via a frontmatter priority field. v1 uses most-recent-2-by-publish-date; a frontmatter `featured` or `priority` field can be added later if the user wants control over which 2 surface per service.
- Extracting the list of service slugs to a central `src/data/services.ts` module so the content-collection enum stops being a hardcoded literal duplicated from the filesystem. Out of scope for this scaffold (deliberate — extracting now also requires touching all seven service pages to import the central list, doubling the diff).
- Inline mini-card image variants for the related-block (image vs. text-only card). v1 uses outcome-led text cards; image variant can be added once a hero-image convention is established by the first few published case studies.
- A `draft` frontmatter field with filter logic in U2/U3/U5. v1 omits it: git branches handle work-in-progress without compounding filter complexity across three query sites. Reintroducible later as a one-line schema addition plus three filter clauses if the authoring workflow needs publish gating without git rebasing.
- A "more case studies" rail on individual case-study pages (cross-discovery for readers who finished one case study and want another). Not in origin requirements; deferred until the library reaches enough volume (4+) that the rail materially helps discovery. The back-link to the primary service page (R10) is the only cross-link a v1 case-study page surfaces.

---

## Context & Research

### Relevant Code and Patterns

- **Content collection pattern** — `src/content.config.ts` defines the existing `resumes` collection using `glob({ pattern: "*.{yaml,yml}", base: "./src/content/resumes" })` and a Zod schema. The new `caseStudies` collection follows the same wiring with a Markdown glob pattern.
- **Collection-driven route** — `src/pages/resumes/[slug].astro` uses `getStaticPaths` over `getCollection("resumes")` and renders via a layout. The new `src/pages/case-studies/[slug].astro` mirrors the wiring but renders Markdown body via Astro's content `render()` API rather than a structured YAML-driven layout.
- **Service page section shell** — `src/pages/services/internal-team-development.astro` is the canonical service-page structure: hero with breadcrumb and eyebrow, who-this-is-for, how-it-works, in-practice (inline mini case studies), what's-different, FAQ, other-services, CTA. Inline JSON-LD for `Service` and `FAQPage` via `safeJson` helper. The new `RelatedCaseStudies` component slots in between "In practice" and "What's different" on each of these pages.
- **Layout SEO mechanism** — `src/layouts/Layout.astro` accepts `title`, `description`, `image`, `imageAlt`, `noindex`, and renders canonical URL, OG/Twitter tags, and base `ProfessionalService` + `WebSite` JSON-LD. Per-page JSON-LD is emitted via the `head` slot. The case-study pages use this slot for `BlogPosting` schema.
- **JSON-LD escape helper** — `safeJsonLd` in `Layout.astro` (and the local `safeJson` in service pages) wraps `JSON.stringify` with a `<` → `\u003c` replace. Required for any new JSON-LD payload — see institutional learnings below.
- **Sitemap integration** — `astro.config.mjs` configures `@astrojs/sitemap` with `lastmod: new Date()` and a `filter` callback that excludes only `/resumes/`. Case studies are not excluded, so the landing page and individual case-study URLs are absorbed automatically — no config change needed.
- **Animation conventions** — variable-count grids use per-card `.animate-on-scroll` (observed via the IntersectionObserver in `Layout.astro`); fixed ≤6-card grids use `.stagger-children`. The case-studies landing grid and the related-block are variable-count, so they use per-card `.animate-on-scroll`.
- **Mobile nav rendering** — `src/components/Navbar.astro` renders the same `links` array to both the desktop nav and the mobile hamburger menu. Adding "Case studies" to the array surfaces it in both. Footer nav (`src/components/Footer.astro`) has a separate `navLinks` array that also needs the link.

### Institutional Learnings

- `docs/solutions/conventions/json-ld-script-escaping-2026-04-23.md` — `<script type="application/ld+json">` payloads must be wrapped with the existing `safeJsonLd` (or local `safeJson`) helper. `JSON.stringify` does not escape `</script>`, `<!--`, or `-->`. Reuse the helper; do not re-implement.
- `docs/solutions/tooling-decisions/astro-sitemap-integration-2026-04-23.md` — Do not reintroduce a static `public/sitemap.xml`. `@astrojs/sitemap` is the source of truth, with explicit `lastmod` stamped at build time. New routes are picked up automatically.
- `docs/solutions/best-practices/innovise-site-astro-icon-and-component-patterns-2026-04-20.md` — Tailwind v4 with `@theme` tokens in `src/styles/global.css` (no `tailwind.config.js`); section shell with eyebrow + h2 + subhead; sentence case headings; per-card `.animate-on-scroll` for variable grids, `.stagger-children` for fixed ≤6-card grids only.

### External References

- Schema.org guidance (2026 SEO consensus): `BlogPosting` is the recommended specific subtype of `Article` for B2B consulting case studies. Specific subtypes provide better disambiguation for search algorithms and rich-result eligibility. Critical properties: `headline`, `datePublished`, `dateModified` (when present), `author`, `image`, `publisher`, `description`. No dedicated `CaseStudy` schema.org type exists; `BlogPosting` is the established fit. (Source: schema-vs-blog comparison guides cross-referenced during planning.)

---

## Key Technical Decisions

- **URL path `/case-studies/`** — Strongest direct SEO match for buyer-evaluation queries ("[firm] case study", "engineering consultancy case study"). Rejected `/work/` (less explicit) and `/client-work/` (longer, no SEO advantage). Mirrors the existing `/services/` and `/resumes/` namespace pattern.
- **Markdown content collection, not YAML** — Case studies have a long-form body that needs to render as Markdown prose. The `resumes` YAML pattern fits structured CV data; it does not fit narrative content. The Astro Markdown loader gives the author Markdown + frontmatter + Astro's `render()` for the body, which is the right shape.
- **`BlogPosting` JSON-LD over `Article`** — Specific subtype recommended by 2026 SEO consensus. Emitted via the Layout's `head` slot using a local `safeJson` helper redefined at the top of `case-studies/[slug].astro` (matching the service-page pattern — `safeJsonLd` in `Layout.astro` is a private const, not exported).
- **Related-block position: between "In practice" and "What's different"** — Keeps the existing inline mini-case-studies in "In practice" intact (they're not replaced) and surfaces full case-study cards immediately after the buyer is primed for proof. Placing it later (after FAQ or "Other services") moves it past the buyer's commitment threshold, weakening its credibility-multiplier effect.
- **Selection rule when >2 case studies match a service: 2 most recent by publish date** — Simplest deterministic rule. No frontmatter priority field in v1; curated ordering is deferred to follow-up work if the user wants it.
- **Hardcoded service-slug enum in the collection schema** — Astro/Zod schema needs the enum at load time. Extracting service slugs to a central data module is a separate cleanup (deferred to follow-up). For now, the enum is a literal list of the seven service slugs with a code comment naming the duplication and pointing at follow-up work.
- **Verification approach: build-time + visual, no automated test framework** — The codebase has no vitest, jest, or playwright. Adding a test framework purely for this scaffold is out of proportion. Verification leans on: (1) Astro's collection schema typechecker (catches missing or invalid frontmatter on any case study), (2) clean `npm run build` (catches dead links, broken route generation, JSON-LD payload errors), (3) Google Rich Results Test on a representative case-study URL, and (4) visual review on the dev server.
- **Empty state on the landing page renders a sentence-case "no case studies yet" affordance** — When zero case studies are published, the page still returns valid HTML with a minimal sentence-case message that complies with marketing-copy voice. This is distinct from R12's silent omission on service pages: on the landing page, the URL is the destination, so total blankness would be more confusing than a brief message.

---

## Open Questions

### Resolved During Planning

- **URL path** — `/case-studies/`. (See Key Technical Decisions.)
- **JSON-LD type** — `BlogPosting`. (External research, see References.)
- **Frontmatter field set** — Captured in U1's Approach: `title`, `summary`, `outcome`, `heroImage` (optional), `heroImageAlt` (optional), `publishDate`, `primaryService` (enum), `author` (defaults to "Loren Anderson, Founder"), `authorLink` (optional). No `draft` field — git branches handle WIP, and a `draft` field threads filter logic through U2/U3/U5 for marginal value.
- **Related-block selection rule** — 2 most recent by publish date. Frontmatter priority field deferred.
- **Related-block position on service pages** — Between "In practice" and "What's different."
- **Default author when frontmatter omits the field** — "Loren Anderson, Founder."

### Deferred to Implementation

- [Affects U2] Exact hero-image dimensions, aspect ratio, and `loading` strategy for case-study hero images. The decision depends on the user's first-case-study image asset. Default to the same `aspect-[16/9]` and `loading="lazy"` pattern the service pages use unless the first case study reveals a different shape works better.
- [Affects U3] Exact empty-state copy on the landing page ("No case studies yet." vs. "Case studies are on the way." vs. another marketing-copy-aligned phrasing). Drafted during implementation; passes `marketing-copy` voice check before merge.
- [Affects U2] Exact wording of the back-link from a case-study page to its primary service ("More on [service name]" vs. "Back to [service name]" vs. another phrasing). Decided during implementation; passes voice check.
- [Affects U5] Exact wording of the related-block section heading ("Related case studies" vs. "More from this work" vs. "Where you can see this in practice"). Drafted during implementation; passes voice check.
- [Affects U4] Exact label text in nav: "Case studies" (proposed) or "Work" or "Stories." Decided during implementation; defaults to "Case studies" unless visual review shows a sharper option.

---

## Output Structure

The scaffold adds two new directories and three new files; the rest are modifications:

    src/
      content.config.ts                    [modify: add caseStudies collection]
      content/
        case-studies/                      [create empty dir, .gitkeep]
      pages/
        case-studies/                      [create]
          index.astro                      [create: landing page]
          [slug].astro                     [create: per-case-study page]
      components/
        Navbar.astro                       [modify: add nav link]
        Footer.astro                       [modify: add nav link]
        RelatedCaseStudies.astro           [create: reusable rail component]
      pages/services/
        ai-engineering.astro               [modify: insert RelatedCaseStudies]
        custom-software-development.astro  [modify: insert RelatedCaseStudies]
        embedded-development-team.astro    [modify: insert RelatedCaseStudies]
        fractional-cto.astro               [modify: insert RelatedCaseStudies]
        internal-team-development.astro    [modify: insert RelatedCaseStudies]
        mvp-to-production.astro            [modify: insert RelatedCaseStudies]
        technology-audit.astro             [modify: insert RelatedCaseStudies]

---

## Implementation Units

- U1. **Define the `caseStudies` content collection**

  **Goal:** Establish the schema, loader, and content directory that the rest of the scaffold reads from. Foundation for U2, U3, and U5.

  **Requirements:** R5, R6, R7, R9.

  **Dependencies:** None.

  **Files:**
  - Modify: `src/content.config.ts`
  - Create: `src/content/case-studies/` directory with a `.gitkeep` (so the empty directory persists in git)

  **Approach:**
  - Add a new `caseStudies` collection alongside the existing `resumes` collection, using `glob({ pattern: "*.md", base: "./src/content/case-studies" })`. Markdown-shaped, not YAML.
  - Zod schema enforces:
    - `title: z.string()` — case-study display title.
    - `summary: z.string()` — used for `<meta name="description">` and OG description (R20).
    - `outcome: z.string()` — the concrete client outcome surfaced on the card and as the hero subhead. This is the "leads with outcome" data field (R3).
    - `heroImage: z.string().optional()` — repo-relative path like `/images/case-studies/foo.webp`.
    - `heroImageAlt: z.string().optional()` — required when `heroImage` is set; a refinement enforces the pair.
    - `publishDate: z.coerce.date()` — drives the most-recent-2 selection rule for the related-block. `coerce` lets the schema accept both unquoted YAML dates (`2026-05-14`) and quoted strings; `z.date()` alone rejects strings.
    - `primaryService: z.enum([...])` — literal enum of the seven service slugs. Add a code comment naming the duplication with `src/pages/services/*.astro` and pointing at the deferred-to-follow-up extraction.
    - `author: z.string().default("Loren Anderson, Founder")` — light author attribution (R8). When the engineer who did the work co-authors or is named (per origin R8's "optional named attribution"), they go into this same string (e.g., `"Loren Anderson with Jane Doe"`). No separate contributor field — origin specifies "light inline attribution," not a structured author/contributor pair.
    - `authorLink: z.string().url().optional()` — optional link from the author name.
  - Strict mode on the object (mirroring the `resumes` schema's `.strict()` usage).
  - Slug derivation: Astro's glob loader uses the filename (sans extension) as `entry.id`. No `slug` frontmatter field needed; the filename is the slug.

  **Patterns to follow:**
  - `src/content.config.ts` — the existing `resumes` collection's loader + Zod schema pattern.

  **Test scenarios:**
  - Happy path: A test case-study file at `src/content/case-studies/sample.md` with all required frontmatter fields loads via `getCollection("caseStudies")` without errors at build.
  - Error path: A file missing `primaryService` causes the Astro build to fail with a Zod validation error naming the missing field.
  - Edge case: A file with `primaryService` set to a value not in the enum (e.g., `primaryService: "unknown-service"`) fails build with an enum-validation error.
  - Edge case: A file with `heroImage` set but no `heroImageAlt` fails build with the paired-field refinement error.

  **Verification:**
  - `npm run build` succeeds with a sample valid case-study file present and fails predictably with a sample invalid file.

---

- U2. **Individual case-study page route**

  **Goal:** Render a single case study at `/case-studies/<slug>/` with hero, outcome, body, attribution, back-link to primary service, and `BlogPosting` JSON-LD.

  **Requirements:** R2, R7, R8, R10, R17, R18, R19, R20, R21.

  **Dependencies:** U1.

  **Files:**
  - Create: `src/pages/case-studies/[slug].astro`

  **Approach:**
  - `getStaticPaths` over `getCollection("caseStudies")`. The full set is rendered.
  - Frontmatter destructured into `title`, `summary`, `outcome`, `heroImage`, `heroImageAlt`, `publishDate`, `primaryService`, `author`, `authorLink`.
  - Import `render` from `astro:content` and call `render(entry)` to compile the Markdown body into a `Content` component; render inside a max-width prose container styled with existing Tailwind typography tokens. (Astro 6's Content Layer API uses the top-level `render` import; the legacy `entry.render()` method does not exist on Content Layer entries.)
  - Page structure:
    1. `Navbar` (existing).
    2. Hero section: breadcrumb (Home › Case studies › [Title]), eyebrow (uppercase `<primaryService> · case study`), H1 (case-study title), outcome subhead (R3 — outcome is hero-prominent on the post page too), author + publish date inline. Optional hero image background.
    3. Body section: Markdown body rendered via `<Content />`.
    4. Back-link section: "More on [primary service]" linking to `/services/<primaryService>/` (R10).
    5. CTA section (matches service-page CTA pattern).
    6. `Footer` (existing).
  - SEO metadata via `<Layout>` props: `title="<topic> | Innovise"` (R19), `description={summary}` (R20), `image={heroImage}` (when set, falls back to default OG image).
  - `BlogPosting` JSON-LD emitted via Layout's `head` slot, payload built inline using a local `safeJson` helper redefined at the top of the page (matching the service-page pattern — `safeJsonLd` in `Layout.astro` is a private const, not exported):
    - `@type: "BlogPosting"`, `headline: title`, `description: summary`, `datePublished: publishDate.toISOString()`, `author: { "@type": "Person", name: author, url: authorLink }`, `publisher: { "@type": "Organization", name: "Innovise Technologies" }`, `image: heroImage` resolved via `new URL(heroImage, Astro.site).href` **with a fallback to the site OG image at `/images/og-image.png` when `heroImage` is absent** — Google's rich-results validator requires `image` even when the content has no custom hero, so the field is always populated. `mainEntityOfPage: canonicalURL`.
  - Sentence-case headings throughout; voice rules per `.cursor/rules/marketing-copy.mdc`.

  **Patterns to follow:**
  - `src/pages/resumes/[slug].astro` — collection-driven `getStaticPaths` shape.
  - `src/pages/services/internal-team-development.astro` — section shell, breadcrumb, eyebrow + h1 + subhead pattern, JSON-LD via Layout `head` slot using the local `safeJson` helper.

  **Test scenarios:**
  - Happy path: Visiting `/case-studies/<slug>/` for a published case study renders title, outcome subhead, body (from Markdown), author, publish date, and back-link to the primary service page.
  - Happy path: The `BlogPosting` JSON-LD is present in the page `<head>` and contains `headline`, `description`, `datePublished`, `author`, `publisher`, and `image` (always — never omitted; falls back to `/images/og-image.png` when `heroImage` is absent).
  - Happy path (analogous to AE3, applied at the post-page hero rather than the landing-page card): The outcome string from frontmatter renders as a visible hero-tier element on the post page, not merely as metadata.
  - Edge case: `heroImage` omitted — the page renders without a hero background image, falling back to the brand color block used by service-page heros, AND the `BlogPosting` JSON-LD `image` field still populates with the site default `/images/og-image.png`.
  - Edge case: `authorLink` omitted — the author name renders as plain text; the JSON-LD `author.url` property is omitted (not set to undefined).
  - Integration: The `BlogPosting` payload passes Google's Rich Results Test on a sample case study after deploy.

  **Verification:**
  - `npm run build` succeeds with a sample case study and the rendered HTML at `/dist/case-studies/<slug>/index.html` contains the expected `<title>`, `<meta name="description">`, and `<script type="application/ld+json">` BlogPosting payload.
  - The back-link href matches `/services/<primaryService>/`.

---

- U3. **Case-studies landing page**

  **Goal:** List published case studies as cards leading with outcome, render cleanly at zero published items, and be indexable.

  **Requirements:** R1, R3, R4, R16, R18, R21.

  **Dependencies:** U1, U2.

  **Files:**
  - Create: `src/pages/case-studies/index.astro`

  **Approach:**
  - Query `getCollection("caseStudies")`, then sort by `publishDate` descending so cards appear in a predictable order. This is a sort for stability, not a recency-foregrounding affordance — R4 prohibits the latter, not the former. The cards themselves do not surface the publish date as a card-level element.
  - Page structure:
    1. `Navbar`.
    2. Hero section: breadcrumb (Home › Case studies), eyebrow (uppercase `Case studies · client outcomes`), H1ish heading ("Real engagements, real outcomes" — final wording set during implementation), subhead summarizing the page intent in one sentence.
    3. Card grid: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`, per-card `.animate-on-scroll`. Each card leads with the `outcome` string in display-prominent type; title and short summary appear below the outcome. No "posted on" timestamp surfaced on the card (R4 — recency not foregrounded). Whole card is a link to the case-study URL.
    4. Empty-state branch: when `caseStudies` is empty, render a single short sentence-case message in place of the grid. Phrasing stays present-state (e.g., "No case studies published yet."), not forward-looking promise language — the marketing-copy rule's earned-trust principle pushes against "coming soon" framing. Exact wording drafted during implementation and passed through `marketing-copy` voice check.
    5. CTA section.
    6. `Footer`.
  - `<Layout>` title: `"Case studies — engineering work, real outcomes | Innovise"` (final phrasing during implementation per R19). Description from a static string aligned with marketing-copy voice.
  - No `BlogPosting` JSON-LD on the index (it's a listing page, not an article); inherits the base `ProfessionalService` + `WebSite` JSON-LD from `Layout`.

  **Patterns to follow:**
  - Card grid pattern: variable-count grid with per-card `.animate-on-scroll` (per icon-and-component-patterns learning).
  - Section shell + eyebrow + h2 + subhead pattern (per icon-and-component-patterns learning).
  - Hero section structure: mirror the service-page hero with breadcrumb, eyebrow, h1, subhead, and a single CTA.

  **Test scenarios:**
  - Happy path: With 3 published case studies, the landing page renders 3 cards in descending publish-date order, each leading with the outcome string in a display-prominent type slot.
  - Covers AE3. With a published case study where `outcome = "Azure spend dropped 80%"` and `title = "Sports-tech infrastructure audit"`, the card surfaces the outcome as the dominant text element, not the title.
  - Covers AE2. With zero published case studies, the landing page builds without errors and produces valid HTML; the rendered page shows a sentence-case fallback message rather than a broken grid.
  - Edge case: The page is included in `sitemap-0.xml` (verified by inspecting the build output).

  **Verification:**
  - `npm run build` succeeds at both zero and N>0 case studies. The built HTML at `/dist/case-studies/index.html` contains the cards or the fallback message respectively.

---

- U4. **Header and footer navigation integration**

  **Goal:** Add the "Case studies" entry to both the header and footer nav arrays.

  **Requirements:** R13, R14, R15, R21.

  **Dependencies:** U3 (the link target must exist before the link is added, though the build does not enforce this).

  **Files:**
  - Modify: `src/components/Navbar.astro`
  - Modify: `src/components/Footer.astro`

  **Approach:**
  - In `Navbar.astro`, append `{ href: "/case-studies/", label: "Case studies" }` to the `links` array. The desktop and mobile menu both render this array, so a single change covers both surfaces.
  - In `Footer.astro`, append the same link object to the `navLinks` array under the Navigation column.
  - Position: insert after `Services` and before `How we work` in the header; in the footer, insert after `Services` in the Navigation list. This places "Case studies" adjacent to "Services" — the buyer-evaluation pairing — rather than next to `Contact` or `About`.
  - Final label text defaults to "Case studies." Confirmed during implementation via visual review.

  **Patterns to follow:**
  - Existing `links` / `navLinks` array shape in both components.

  **Test scenarios:**
  - Happy path: The "Case studies" link appears in the desktop header nav, the mobile hamburger menu, and the footer Navigation column.
  - Happy path: Clicking the link in any of those locations navigates to `/case-studies/`.
  - Edge case: Hovering the header link surfaces the same hover state used by adjacent nav links (visual consistency — no new style branch is needed since the link renders through the existing array iteration).
  - Edge case: When the landing page is empty (zero published case studies), the link still navigates to the page and the empty-state message renders cleanly (covered by U3 verification).

  **Verification:**
  - Visual review on the dev server at desktop and mobile breakpoints confirms the link is present and styled consistently with neighbors.

---

- U5. **`RelatedCaseStudies` component + service-page integration**

  **Goal:** Build a reusable component that surfaces 1–2 case studies matching a given service slug, hides itself entirely when no matches exist, and embed it in all seven service pages.

  **Requirements:** R11, R12, R21.

  **Dependencies:** U1, U2.

  **Files:**
  - Create: `src/components/RelatedCaseStudies.astro`
  - Modify: `src/pages/services/ai-engineering.astro`
  - Modify: `src/pages/services/custom-software-development.astro`
  - Modify: `src/pages/services/embedded-development-team.astro`
  - Modify: `src/pages/services/fractional-cto.astro`
  - Modify: `src/pages/services/internal-team-development.astro`
  - Modify: `src/pages/services/mvp-to-production.astro`
  - Modify: `src/pages/services/technology-audit.astro`

  **Approach:**
  - Component props: `serviceSlug: string` (the primary service identifier for the page invoking the component).
  - Component frontmatter logic:
    1. Query `getCollection("caseStudies", ({ data }) => data.primaryService === serviceSlug)`.
    2. Sort descending by `publishDate`.
    3. Slice to the first 2 entries.
  - Empty-state rendering: Astro components do not "return null" — omission happens in the template body. Wrap the entire section markup in `{matches.length > 0 && (...)}` so the rendered output contains no heading, no container, and no whitespace gap when there are zero matches. (This is the AE1 silent-omission behavior.)
  - When 1+ matches exist, render a full section with the established section-shell pattern:
    - Background: `bg-surface-inset` or `bg-surface-page` (final pick during implementation to balance vertical rhythm against the neighboring sections).
    - Eyebrow ("Related case studies" — final wording during implementation).
    - H2 (sentence-case heading naming the credibility relationship).
    - Card grid: 1 or 2 cards. Each card surfaces the case-study `outcome` in display-prominent type, `title` below, short summary excerpt below that, with a hover affordance and a chevron icon matching the existing "Other services" card pattern. Whole card links to `/case-studies/<slug>/`.
    - Per-card `.animate-on-scroll`.
  - Service-page integration: in each of the seven service-page `.astro` files, import the component and insert `<RelatedCaseStudies serviceSlug="..." />` between the existing "In practice" section and the "What's different" section. The component handles its own visibility — service-page authors do not conditionally render it.
  - The serviceSlug literal for each page matches the page's URL slug (e.g., `internal-team-development.astro` passes `"internal-team-development"`).

  **Patterns to follow:**
  - `src/pages/services/internal-team-development.astro` — section shell, eyebrow + h2 pattern, "Other services" card grid shape (use this as the card visual template).
  - `RelatedCaseStudies.astro` mirrors the "Other services" card shape rather than the landing-page card shape — service-page rails are denser and lighter than full landing-page cards.

  **Test scenarios:**
  - Happy path: With one case study published whose `primaryService === "internal-team-development"`, visiting `/services/internal-team-development/` shows the related-block with one card leading with the case study's outcome and linking to `/case-studies/<slug>/`.
  - Happy path: With three case studies matching the same service, the related-block surfaces the two most recent by `publishDate`; the third does not appear.
  - Covers AE1. With zero case studies matching a service's slug, the entire related-block section is omitted from the rendered HTML — no `<section>`, no heading, no "case studies coming soon" placeholder.
  - Edge case: A case study whose `primaryService` matches a service slug exactly is included; a near-miss (e.g., trailing whitespace, different casing) is rejected by the schema enum at build time, so this case cannot reach runtime.
  - Integration: After publishing a new case study with `primaryService: "ai-engineering"` and running `npm run build`, the rendered `/services/ai-engineering/index.html` now contains the related-block; the other six service pages do not change.

  **Verification:**
  - `npm run build` succeeds with all seven service pages rendering. At zero case studies, none of the seven pages show the related-block; at N>0, only the matched service pages do.
  - Visual review on the dev server confirms placement consistency across all seven service pages.

---

## System-Wide Impact

- **Interaction graph:** New routes under `/case-studies/*` are absorbed by `@astrojs/sitemap` automatically. `Layout.astro`'s existing JSON-LD (`ProfessionalService`, `WebSite`) renders on every page including the new ones; the new `BlogPosting` payload is additive via the `head` slot. The `IntersectionObserver` in `Layout.astro` already targets `.animate-on-scroll` globally, so the new cards animate without configuration.
- **Error propagation:** Frontmatter validation errors at build time fail loud and name the offending file. Missing image assets surface as broken image references in the build (Astro does not pre-validate image paths). The author sees both during local `npm run build` before merging.
- **State lifecycle risks:** None — static-site generation. No runtime state, no cache invalidation concerns.
- **API surface parity:** None — no APIs are exposed by this work.
- **Integration coverage:** The seven service-page modifications all touch the same surface (insert one component) but each is an independent edit. The risk of inconsistency is mitigated by inserting the component in the same structural position on each page.
- **Unchanged invariants:** The `Layout` SEO machinery, sitemap configuration, and existing service-page sections (hero, who-this-is-for, how-it-works, in-practice, what's-different, FAQ, other-services, CTA) are unchanged. The only addition to service pages is the new `<RelatedCaseStudies />` insertion between "In practice" and "What's different."

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| The hardcoded service-slug enum in `content.config.ts` drifts from the actual `services/*.astro` set when a new service is added. | Code comment in the schema names the duplication and points at the deferred follow-up extraction. Build fails immediately if a case study references a service slug not in the enum, surfacing the drift the first time it matters. |
| The first published case study has a hero image that doesn't match the assumed `aspect-[16/9]` proportions, breaking the layout. | Image asset decisions are explicitly deferred to implementation. The post-page hero handles missing/optional images via the same fallback the service-page hero uses (brand-color block). Image cropping is settled when the user supplies the first asset, not pre-decided. |
| The `BlogPosting` JSON-LD turns out to be sub-optimal for Innovise's specific case-study content and Google ranks it lower than expected. | Easy reversion: the JSON-LD payload is inline in `[slug].astro` and can be changed to `Article` or a different schema type in one place. Initial choice is research-backed; reversibility is the safety net. |
| A case-study post and its primary service slug temporarily diverge (e.g., a service is renamed but a case study still references the old slug). | The Zod enum makes this a build-time error rather than a silent runtime broken link. The author is forced to either rename the service slug everywhere or update the case-study frontmatter. |
| Empty-state on service pages omits the block silently — a reviewer might miss whether the block is supposed to exist at all. | AE1 explicitly defines this behavior and U5's test scenarios verify it. Adding observability for the absent state is deliberately not in scope (silent omission is the design intent). |

---

## Documentation / Operational Notes

- After this scaffold ships, the user adds the first case-study content file at `src/content/case-studies/<slug>.md` with the required frontmatter. No engineering involvement needed; the schema is the authoring contract.
- A short authoring how-to in `README.md` or `docs/` is not in scope but would be valuable as a follow-up if the user wants to enable guest engineers to contribute case studies without reading the schema directly.
- Nav-link visibility: the header and footer links go live the moment this scaffold deploys. The user controls public visibility by timing the deployment of this scaffold against the first case-study publication. If the user wants the link to point at the empty-state landing page for a period before the first case study ships, that is acceptable — the landing page renders cleanly at zero items.
- Google Rich Results Test on a sample case-study URL after the first deploy verifies the `BlogPosting` payload is valid.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-13-case-studies-scaffold-requirements.md](../brainstorms/2026-05-13-case-studies-scaffold-requirements.md)
- **Content collection pattern:** `src/content.config.ts`, `src/pages/resumes/[slug].astro`
- **Service-page template:** `src/pages/services/internal-team-development.astro` (canonical structural reference)
- **SEO and JSON-LD infrastructure:** `src/layouts/Layout.astro`
- **Sitemap config:** `astro.config.mjs`
- **Voice rules:** `.cursor/rules/marketing-copy.mdc`
- **Institutional learnings:**
  - `docs/solutions/conventions/json-ld-script-escaping-2026-04-23.md`
  - `docs/solutions/tooling-decisions/astro-sitemap-integration-2026-04-23.md`
  - `docs/solutions/best-practices/innovise-site-astro-icon-and-component-patterns-2026-04-20.md`
- **External:** 2026 SEO consensus on `BlogPosting` schema for B2B consulting case studies (planning-time web research; sources cross-referenced).
