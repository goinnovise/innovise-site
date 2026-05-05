---
title: "feat: Astro resume system + author skill (port from Jekyll)"
type: feat
status: active
date: 2026-05-04
origin: docs/brainstorms/2026-05-04-resume-system-port-requirements.md
---

# feat: Astro resume system + author skill (port from Jekyll)

## Overview

Retire the standalone Jekyll resume project (`Innovise/Resumes/loren/`) and replace it with a data-driven resume system inside the Astro site. Resumes become an Astro Content Collection authored as YAML, rendered through a shared two-column layout that visually belongs on goinnovise.com, served at `/resumes/{slug}/`, and excluded from indexing. A companion Cursor skill converts third-party resumes (pasted text or Markdown) into the Innovise YAML format with voice aligned to `marketing-copy.mdc`.

This is greenfield for content collections in this repo — there is no existing collection to follow. The plan establishes both the collection plumbing and the rendering surface in coordinated units, then adds the print, sitemap-exclusion, and skill pieces around it.

---

## Problem Frame

Innovise currently maintains a separate Jekyll project for each team member's resume — a dead-end stack visually inconsistent with goinnovise.com, requiring per-person setup work, and with thin print CSS predating the firm's positioning work (see origin: `docs/brainstorms/2026-05-04-resume-system-port-requirements.md`). The opportunity is to unify resume publishing under the Astro site so adding a future hire is "one YAML file plus one image, no template edits," and the printed/PDF output is professional in both Letter and A4 sizes.

A second deliverable — a Cursor skill that converts third-party resumes into the Innovise YAML format — compounds the value of the system: every new hire's existing resume becomes a starting point, with voice/tone normalized to the firm's marketing-copy principles without inventing facts.

---

## Requirements Trace

- R1. Resumes render at `/resumes/{slug}/`, generated at build time from a content collection.
- R2. Two-column layout retained from the Jekyll template, restyled in the Innovise design system (brand fonts, brand palette, sentence case headings, no Font Awesome, `<picture>` image pattern).
- R3. Trimmed page chrome — logo-link header (no menu) and one-line footer; both hidden in print.
- R4. Per-page `<title>`, description, canonical, Open Graph, Twitter Card metadata derived from the resume data.
- R5. Resumes are an Astro Content Collection at `src/content/resumes/`, YAML files (`{slug}.yaml`).
- R6. Zod schema validates required vs optional fields at build time; missing optional sections render nothing.
- R7. Schema covers profile, contact, career profile, experiences, optional education/skills/projects/publications/languages/interests; matches the field set in the existing `_data/data.yml`.
- R8. Adding a new resume requires no edits to existing components, layouts, or routes — just a single YAML file plus a headshot image (delivered as both `.webp` and `.jpg` per the site's existing dual-format pattern). See Documentation / Operational Notes for the actual per-resume onboarding steps.
- R9. Each resume page emits `<meta name="robots" content="noindex, nofollow">`.
- R10. Resume URLs excluded from `sitemap-index.xml` via the `filter` option on `@astrojs/sitemap`.
- R11. No `/resumes/` index page, no nav/footer linkage.
- R12. `public/robots.txt` unchanged.
- R13. On-screen "Print / Save as PDF" button on each resume; hidden in print.
- R14. Print CSS supports US Letter (default) and verifies cleanly at A4.
- R15. Print output hides chrome and animation hooks; sidebar prints as monochrome accent (saves ink, looks document-like).
- R16. `page-break-inside: avoid` on experience blocks; `page-break-after: avoid` on section headings.
- R17. Cursor skill `.cursor/skills/resume-author/` accepts plain text and Markdown only.
- R18. Skill writes to `src/content/resumes/{slug}.yaml` and tells the user where to drop the headshot.
- R19. Skill applies *transferable* `marketing-copy.mdc` principles only; never injects firm-positioning claims.
- R20. Skill never invents facts; asks when unclear.
- R21. Skill is interactive, asking one focused question at a time when ambiguous.
- R22. Skill cites which transferable principles it applied during the rewrite.

---

## Scope Boundaries

- No `/resumes/` index page, no nav/footer linkage. Resume URLs are direct-share only (origin R11, scope confirmed).
- No build-time PDF artifact (no Puppeteer/headless Chrome). Browser print-to-PDF is the PDF story for v1.
- No PDF / .docx / LinkedIn-export ingestion in the Cursor skill v1. Plain text and Markdown only.
- No automated test harness for the Astro site. Verification is build-output assertions plus external print-preview / Lighthouse / share-card checks (consistent with the prior SEO plan's posture).
- The Jekyll project is retired by archiving the repo separately, not by code change in the Astro repo. The Astro repo only stops referencing it — there is no migration script.
- No team directory features (filtering, sorting, search). One file in, one URL out.
- The marketing copy in `Team.astro` is independent from resume data and not consolidated as part of this work.
- No copy revision of Loren's tagline. The tagline-fractional-CTO contradiction (see origin: Outstanding Questions / Post-port review) is a separate decision after this system ships.

---

## Context & Research

### Relevant Code and Patterns

- `src/layouts/Layout.astro` — already accepts `noindex: boolean` and emits `<meta name="robots" content="noindex, nofollow">` (R9 wires in for free). Already emits OG/Twitter/canonical metadata via the props API (`title`, `description`, `image`, `imageAlt`); resume page reuses this without adding new layout machinery for R4.
- `astro.config.mjs` — already has a comment anticipating exactly the filter pattern for noindex pages: *"To exclude future `noindex` pages, add `filter: (page) => !noindexedUrls.includes(page)` here."* R10 is a one-liner extension of this exact pattern.
- `src/components/Hero.astro`, `src/components/Team.astro`, every service page — established `<picture><source srcset="...webp" type="image/webp"><img src="...jpg" /></picture>` pattern. Resume sidebar avatar follows the same pattern.
- `src/styles/global.css @theme {}` — Tailwind v4 token source of truth (per `docs/solutions/best-practices/innovise-site-astro-icon-and-component-patterns-2026-04-20.md`). Resume components use `--font-heading` (IBM Plex Sans), `--font-body` (Source Sans 3), `--color-brand-*`, `--color-surface-*`, `--color-text-*` tokens directly. No new tokens required.
- `src/components/Footer.astro` — established `Innovise Technologies` LinkedIn URL and copyright pattern. Resume page's minimal footer mirrors this in trimmed form.
- `src/pages/services/embedded-development-team.astro` — established per-page JSON-LD pattern (compute schema in frontmatter, `safeJson()` with `<` escaping, `<script type="application/ld+json" set:html slot="head" />`). Available if a resume-page JSON-LD is added later (deferred — see Open Questions).
- `public/images/team/loren-anderson.{webp,jpg}` — already exists. The resume system will reuse this asset for Loren's headshot rather than creating a new one. New hires drop their headshot under `public/images/resumes/{slug}.{webp,jpg}` to avoid blurring "team marketing" and "individual resume" assets.

### Institutional Learnings

- `docs/solutions/best-practices/innovise-site-astro-icon-and-component-patterns-2026-04-20.md` — Tailwind v4 has no `tailwind.config.js`; tokens live in `@theme {}`. `set:html` is the safe-HTML escape hatch. Bare `<path>`-only icon strings, never full `<svg>` wrappers. These conventions apply to any new resume-section icons (e.g., a small briefcase glyph next to the "Experience" heading) so the system stays consistent with the rest of the site.
- `docs/plans/2026-04-23-001-feat-seo-metadata-and-structured-data-plan.md` — established the Layout props contract (`title`, `description`, `image`, `imageAlt`, `noindex`). The resume page consumes the existing API; no Layout changes required.

### External References

- Astro Content Collections (Astro 5+ API, current in Astro 6.1.4): [https://docs.astro.build/en/guides/content-collections/](https://docs.astro.build/en/guides/content-collections/) — uses `defineCollection({ loader, schema })` with the `glob()` loader from `astro/loaders`. Configuration file is `src/content.config.ts` (top-level `src/`, not inside `src/content/`). Astro auto-parses YAML based on file extension.
- `@astrojs/sitemap` v3.7.2 (already installed): [https://docs.astro.build/en/guides/integrations-guide/sitemap/](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — `filter: (page: string) => boolean` operates on absolute URLs (e.g., `https://goinnovise.com/resumes/loren-anderson/`); returning `false` excludes the page.
- CSS Paged Media (`@page`): [https://developer.mozilla.org/en-US/docs/Web/CSS/@page](https://developer.mozilla.org/en-US/docs/Web/CSS/@page) — `size: letter` sets the print preview default; user can override via the print dialog. Browsers rescale automatically when the user picks A4 in the dialog. Distinct named-page rules per paper size are not required for "Letter + A4 support."
- `-webkit-print-color-adjust: exact` (and the standardized `print-color-adjust: exact`): preserves brand color on printed pages even when the user's browser is set to "background graphics off." Already used (lightly) in the Jekyll `_print.scss`.

---

## Key Technical Decisions

- **Astro Content Collection with the new loader API.** Use `defineCollection({ loader: glob({ pattern: '*.yaml', base: './src/content/resumes' }), schema })` in `src/content.config.ts`. The loader-based API is the supported path in Astro 5+ (current in Astro 6); the legacy `type: 'data'` API is deprecated. Chosen over manual YAML loading because Zod validation surfaces missing required fields at build time, before the broken page can ever ship.
- **Schema split: `summary: string` + `bullets: string[]`, not a single Markdown blob.** The Jekyll `experience.details` field bundled prose and a bulleted list inside one Markdown string rendered via `markdownify`. The new schema separates them. The bullet field is named `bullets`, not `accomplishments`, because real-world bullets are heterogeneous (accomplishments, responsibilities, descriptions, team-role notes) and forcing every bullet into an "accomplishment" frame would either misrepresent the candidate's content or constrain what bullets can be included. Rationale: cleaner data, easier for the Cursor skill to populate consistently, removes the need for Astro Markdown rendering on a YAML-only collection. Cost: the conversion of Loren's existing data is mechanical but takes one editing pass.
- **Inline Markdown emphasis in bullets is stripped at conversion time, not preserved.** A YAML bullet like `"reduced **infrastructure cost** by 40%"` would render as the four literal asterisks in HTML (broken) without a Markdown inline parser, and adding one re-introduces the Markdown dependency the schema rationale rejects. The Cursor skill (U6) and the manual Loren conversion (U1) both strip `**bold**` / `*italic*` markers when populating `bullets[]`. If the candidate's emphasis carries semantic weight, rephrase rather than relying on inline formatting.
- **Slug convention: `{first-name}-{last-name}`, ASCII-transliterated, lowercased.** Loren's URL becomes `/resumes/loren-anderson/`. Future hires named "Jane Doe" become `/resumes/jane-doe/`. Chosen over single-name slugs for clarity at scale and to avoid future name collisions. Normalization: lowercase, transliterate diacritics (`josé` → `jose`), space and punctuation → single hyphen, strip leading/trailing hyphens. Single-word names use just the name (`/resumes/madonna/`). Non-Latin-script names: the Cursor skill asks the candidate for a romanized form rather than guessing. Collisions append `-2`, `-3`. Slugs must match `/^[a-z0-9-]+$/` and the schema enforces this on `profile.avatar` so deviations break the build.
- **Sidebar position: right (no strong evidence either way; reversible).** Both left-sidebar and right-sidebar resume layouts read correctly. Right is the chosen default to avoid an extra design decision now; the Jekyll precedent is acknowledged but not load-bearing because the URL is changing anyway. Modern resume conventions favor left. Worth revisiting if visual review of the first rendered page suggests left would read better in the Innovise design system.
- **Reuse `Layout.astro` rather than build a parallel layout.** Resume pages wrap a new `ResumeLayout.astro` *inside* the existing `Layout.astro` so canonical / OG / Twitter / `noindex` plumbing is inherited free. `ResumeLayout.astro` adds only resume-specific chrome (trimmed header, minimal footer) and styles — it does not duplicate the `<head>` block. Alternatives considered: (a) a separate `ResumeLayout.astro` that owns its own `<head>` block — rejected because it would duplicate ~150 lines of metadata logic and create two places to update when site-wide metadata changes; (b) extending `Layout.astro` itself with a `variant="resume"` switch — rejected as premature coupling; the resume-page chrome is concretely different from the marketing-page chrome and shouldn't be a flag inside the shared layout; (c) hosting resumes on a `resumes.goinnovise.com` subdomain — rejected because maintaining a second build pipeline doubles operational surface for marginal isolation benefit; the per-page noindex plus sitemap exclusion already delivers the indexing-isolation outcome, and co-locating with the main site keeps the design system shared.
- **`@page { size: letter; margin: 0.5in; }` as the CSS default.** Verify the layout doesn't break at A4 print preview (A4 is only ~6mm narrower than Letter). Browser print dialog handles size override automatically. No separate `@page :first` / named-page rules — those are rarely worth the complexity for a non-paginated document.
- **Print sidebar uses `--color-text-primary` (near-black), not `--color-brand-500` (coral).** This is a preference, not a fact: brand-color print sidebars are valid for design-forward firms and many use them deliberately. The chosen rationale is (a) reduce ink usage on a printed document and (b) avoid a heavy saturated coral block competing for attention with the resume content. Reversible by switching one CSS variable. Revisit if visual review suggests the printed PDF reads as generic-template rather than Innovise-branded.
- **Print preserves link visibility.** External links keep their underline (or color contrast) so a recipient holding the printed PDF can see which words are clickable. The plan does not append URLs after link text via `::after { content: " (" attr(href) ")" }` because sidebar contact entries already contain the visible URL, and inline experience-prose links are rare. If a future resume relies heavily on inline links, revisit.
- **Keep avatar/headshot assets at `public/images/resumes/{slug}.{webp,jpg}`, NOT `public/images/team/`.** `team/` is for marketing usage on the home page (`Team.astro`); `resumes/` is the resume-page asset path. For Loren specifically, copy the existing `public/images/team/loren-anderson.webp` and `public/images/team/loren-anderson-opt.jpg` files to `public/images/resumes/loren-anderson.webp` and `public/images/resumes/loren-anderson.jpg` respectively (drop the `-opt` suffix from the JPG to keep both formats on the same canonical name). Symlinks are an acceptable alternative if the deploy pipeline supports them. Rationale: keeps "marketing photography" and "individual resume photography" as separate concerns conceptually, even when the bytes are the same today.
- **Sitemap filter via URL prefix match.** Filter callback returns `!page.startsWith('https://goinnovise.com/resumes/')`. Matches the comment pattern already in `astro.config.mjs`. Robust to future resumes without additional config.
- **No JSON-LD `Person` schema for resume pages in v1.** Reasoning: the page is `noindex, nofollow` — search engines don't crawl it, so structured data adds no SEO value. Direct-link share previews are served by OG/Twitter Cards (already inherited via Layout). If a future change makes resume pages indexable, revisit. Decision is reversible at no cost.
- **Cursor skill is the primary path for new resumes; manual YAML editing is the fallback.** The skill is not a one-shot author — it's the maintained way to produce conforming YAML. Loren's resume is the skill's first output (via the import-from-Jekyll fast-path), proving the pipeline.

---

## Open Questions

### Resolved During Planning

- **Slug convention** — `{first-name}-{last-name}` lowercased. See Key Technical Decisions.
- **`experience.details` schema** — Split into `summary` + `bullets[]` (renamed from `accomplishments` because real-world bullets cover responsibilities, descriptions, and team-role notes — not only accomplishments). See Key Technical Decisions.
- **Sidebar position** — Right (Jekyll parity). See Key Technical Decisions.
- **JSON-LD `Person` schema for resume pages** — Deferred (no SEO value on noindex pages). See Key Technical Decisions.
- **Headshot asset path** — `public/images/resumes/{slug}.{webp,jpg}`, separate from `public/images/team/`. See Key Technical Decisions.
- **Loren-Jekyll-import fast-path in the skill** — Include in v1. The Jekyll `_data/data.yml` is structured and the conversion is mechanical; this lets Loren's resume be the skill's first proof point. See U6.
- **Marketing-copy transferable enumeration** — Produced as a `references/` file inside the skill, not a generic site-wide rule edit. See U6.
- **Print paper size CSS** — `@page { size: letter; margin: 0.5in; }`. Verify A4 visually rather than ship dual @page rules. See Key Technical Decisions.
- **Plain-text vs Markdown skill input** — Both supported; skill detects format heuristically. See U6.

### Deferred to Implementation

- **Loren tagline copy revision** — The Jekyll tagline ("Principal Consultant | Fractional CTO & Software Engineering Leader") top-promotes Fractional CTO, contrary to `marketing-copy.mdc`. The system ships with the tagline verbatim; copy revision is a separate decision after the resume page is live and viewable. Surface in the PR description.
- **Loren's optional social handles on the public page** — `data.yml` lists GitHub username and Stack Overflow ID. Email and LinkedIn are confirmed visible. The remaining handles are individual judgment per resume; review when the PR has a live preview to look at. Not blocking.
- **Symlink vs copy for Loren's headshot** — `public/images/team/loren-anderson.{webp,jpg}` already exists. Either reuse via copy or via a build-time symlink. Pick during implementation based on whichever is simpler in the deploy pipeline. No functional difference.
- **Whether to add a small "Innovise" wordmark next to the resume header logo** — Brand redundancy vs cleaner mark-only header. Decide after the first visual pass. Not a blocker.
- **Heuristic for skill format detection (text vs Markdown)** — Detected by presence of Markdown syntax (`#`, `-`, `*`, fenced blocks). Final detection rules tuned during skill build, not pre-decided here.

---

## Implementation Units

- [ ] **U1. Set up resume content collection: schema + Loren's converted YAML**

**Goal:** Create the Astro Content Collection plumbing and validate it end-to-end by landing Loren's resume data in the new schema.

**Requirements:** R5, R6, R7

**Dependencies:** None

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/resumes/loren-anderson.yaml`
- Create: `public/images/resumes/loren-anderson.webp` (copy of `public/images/team/loren-anderson.webp`)
- Create: `public/images/resumes/loren-anderson.jpg` (copy of `public/images/team/loren-anderson-opt.jpg`, dropping the `-opt` suffix to keep both formats on the canonical slug-based filename)
- Modify: nothing

**Approach:**
- In `src/content.config.ts`, import `defineCollection`, `z` from `astro:content` and `glob` from `astro/loaders`. Define a `resumes` collection with `loader: glob({ pattern: '*.{yaml,yml}', base: './src/content/resumes' })` so both `.yaml` and `.yml` extensions are picked up (Astro's data-entry-type registers both, but the glob pattern is literal). Restrict to top-level files only with `*.{yaml,yml}` (no leading `**/`).
- Define the Zod schema with these fields. All schema keys in `camelCase` to match TS conventions even though Jekyll YAML used `kebab-case`. Use `.strict()` on the top-level resume object so unknown keys (including a stray `slug:` from a third-party export) fail loud at build time — the glob loader otherwise consults a top-level `slug` field as the URL slug, silently overriding the filename and breaking the slug convention:
  - `profile: { name: z.string(), tagline: z.string(), avatar: z.string().regex(/^[a-z0-9-]+$/, 'Avatar must be a slug (lowercase, hyphenated, no path), e.g., "loren-anderson"'), avatarAlt: z.string().optional(), location: z.string().optional() }`
  - `contact: { email: z.string().email(), phone: z.string().optional(), website: z.string().optional(), linkedin: z.string().optional(), github: z.string().optional(), gitlab: z.string().optional(), bitbucket: z.string().optional(), twitter: z.string().optional(), stackOverflow: z.string().optional(), codewars: z.string().optional(), goodreads: z.string().optional() }`
  - `careerProfile: { title: z.string(), summary: z.string() }`
  - `experiences: z.array(z.object({ role: z.string(), time: z.string(), company: z.string(), location: z.string().optional(), summary: z.string().optional(), bullets: z.array(z.string()).optional() }))` — `summary` and `bullets` are both optional (a role can have either, both, or in rare cases neither). The U2 renderer handles all three states.
  - `education: z.array(z.object({ degree: z.string().optional(), university: z.string(), time: z.string().optional(), details: z.string().optional() })).optional()`
  - `skills: z.array(z.object({ title: z.string(), value: z.string() }))`
  - `projects: z.object({ title: z.string(), intro: z.string().optional(), assignments: z.array(z.object({ title: z.string(), link: z.string().url().optional(), tagline: z.string().optional() })) }).optional()`
  - `publications: z.object({ title: z.string(), intro: z.string().optional(), papers: z.array(z.object({ title: z.string(), authors: z.string(), conference: z.string() })) }).optional()`
  - `languages: z.array(z.object({ idiom: z.string(), level: z.string() })).optional()`
  - `interests: z.array(z.object({ item: z.string(), link: z.string().url().optional() })).optional()`
  - Display flags: `display: z.object({ educationInSidebar: z.boolean().default(true) }).default({})` — preserves the Jekyll toggle that places education in the sidebar vs. main column.
- Export `export const collections = { resumes };`.
- Convert `Innovise/Resumes/loren/_data/data.yml` to `src/content/resumes/loren-anderson.yaml` with these mechanical transformations:
  - `sidebar.name`/`tagline`/`avatar` → `profile.name`/`tagline`/`avatar`. Set `profile.avatar: 'loren-anderson'` (slug-only — `ProfileBlock.astro` in U2 resolves to `/images/resumes/{avatar}.{webp,jpg}`).
  - Set `profile.avatarAlt` to `"Loren Anderson"` (default convention: candidate's full name; U2 falls back to this when the field is omitted).
  - `sidebar.email`/`phone`/etc. → `contact.email`/`phone`/etc.
  - `sidebar.education` (boolean) → `display.educationInSidebar`.
  - `sidebar.about` (theme credit) → drop entirely (Jekyll-template-promotion artifact).
  - `career-profile` → `careerProfile`.
  - For each experience, split the multi-paragraph `details` Markdown into:
    - `summary`: the prose paragraph(s) before `_Accomplishments_`. Strip the italic markers around `_Accomplishments_` and the trailing colon — that header was a Liquid-template convention, not part of the candidate's prose.
    - `bullets`: array of strings extracted from the bullet list. Strip leading `- `, strip inline `**bold**` / `*italic*` markers (per the Markdown-emphasis policy in Key Technical Decisions), preserve plain prose verbatim.
  - `education` array, `skills` → preserved as-is shape with key renames.
  - `examples` → dropped (the Jekyll source has `showExamples: false` and the field is a UX-portfolio gallery that doesn't apply to engineering resumes). The new schema does not include an examples field; if needed later, add it as an optional collection field.
  - Preserve all factual content verbatim. No tagline rewrite (see Deferred to Implementation).
- Confirm the Loren YAML compiles by running `npm run build` and observing the build does not error on schema validation.

**Patterns to follow:**
- `astro.config.mjs` already imports plugins via the standard Astro module pattern; the new `src/content.config.ts` follows the same module style. No `defineConfig`-style wrapper is needed for content config.
- Schema-key style matches TS conventions (`camelCase`) even though the Jekyll source used `kebab-case`. Inside YAML this is purely cosmetic — no quoting tricks needed.

**Test scenarios:**
- Happy path: `npm run build` completes without errors when only `loren-anderson.yaml` exists in the collection.
- Happy path: temporarily remove a required field (e.g., `profile.name`) from `loren-anderson.yaml` and confirm `npm run build` fails with a Zod error message naming the missing field. Restore before commit.
- Happy path: temporarily add a malformed `contact.email` value (e.g., `"not-an-email"`) and confirm the build fails with a Zod email-format error. Restore before commit.
- Edge case: a hypothetical second resume with no `education`, no `projects`, no `publications`, no `languages`, no `interests`, and no `phone` validates and parses successfully. Use a clearly non-resume slug for the throwaway file (e.g., `__schema-test.yaml` — the glob loader will still pick it up and emit a real `/resumes/__schema-test/` page, so delete the file *and* verify `dist/resumes/__schema-test/` does not exist before commit).
- Edge case: a top-level `slug: 'something-else'` key in a resume YAML causes the build to fail with a Zod strict-mode unknown-key error (this confirms the glob-loader slug-override footgun is closed).
- Edge case: a `profile.avatar: '/images/team/loren'` (path-shaped, not slug-shaped) causes the build to fail with the avatar regex error.
- Edge case: a `profile.avatar: 'Loren-Anderson'` (capitals) causes the build to fail (regex requires lowercase).
- Edge case: an experience entry with no `bullets` validates (only `role`, `time`, `company`, `summary` present).
- Edge case: an experience entry with no `summary` and only `bullets` validates.
- Edge case: a `.yml`-extension test file is also picked up by the loader (proves the glob pattern handles both extensions).

**Verification:**
- `npm run build` exits 0.
- `loren-anderson.yaml` parses to a structurally valid object containing all of Loren's experiences from the Jekyll source, with each experience's `bullets` extracted as a string array.
- `public/images/resumes/loren-anderson.{webp,jpg}` exist and are non-empty.

---

- [ ] **U2. Build resume presentational components**

**Goal:** Pure presentational Astro components for each resume section. All conditional-render based on data presence so omitted sections produce no markup.

**Requirements:** R2, R7 (renders schema fields), R8 (no edits to existing site components — purely additive)

**Dependencies:** U1 (schema is the data contract these components consume)

**Files:**
- Create: `src/components/resume/ProfileBlock.astro` — avatar, name, tagline (sidebar)
- Create: `src/components/resume/ContactList.astro` — email, phone, website, social links (sidebar)
- Create: `src/components/resume/EducationList.astro` — renders in either sidebar or main, based on `display.educationInSidebar`
- Create: `src/components/resume/LanguagesList.astro` — sidebar (optional)
- Create: `src/components/resume/InterestsList.astro` — sidebar (optional)
- Create: `src/components/resume/CareerProfile.astro` — main column
- Create: `src/components/resume/ExperienceList.astro` — main column; renders optional `summary` paragraph + optional `bullets` list per experience
- Create: `src/components/resume/SkillsList.astro` — main column; `<dt>title</dt><dd>value</dd>` pairs
- Create: `src/components/resume/ProjectsList.astro` — main column (optional)
- Create: `src/components/resume/PublicationsList.astro` — main column (optional)

**Approach:**
- Each component takes a typed prop matching the relevant Zod-derived type. Use `import type { CollectionEntry } from 'astro:content';` and `type ResumeData = CollectionEntry<'resumes'>['data'];` then narrow per component.
- Each optional-section component returns `null` (renders nothing) when its input is `undefined`. Astro's `{section && (<>...</>)}` pattern is sufficient.
- `ProfileBlock.astro`: uses `<picture><source srcset>...<img>` for the avatar. The `<img>`'s `alt` attribute resolves to `profile.avatarAlt` if present, otherwise falls back to `profile.name` (e.g., `"Loren Anderson"`). Empty `alt=""` is never used — the headshot is meaningful, not decorative.
- Replace Font Awesome icons from the Jekyll templates with bare-`<path>` inline SVGs using the established pattern from `docs/solutions/best-practices/innovise-site-astro-icon-and-component-patterns-2026-04-20.md`. The icon set is sourced from [Heroicons](https://heroicons.com) (outline 24×24 set, MIT-licensed, copy the inner `<path>` only — no `<svg>` wrapper). Required icons: `envelope` (email), `phone` (phone), `globe-americas` (website), `academic-cap` (education), `briefcase` (experience), `wrench-screwdriver` (skills). For brand glyphs (LinkedIn, GitHub, Twitter, Stack Overflow), use the [Simple Icons](https://simpleicons.org) set with the same bare-`<path>` extraction. Reuse the LinkedIn path already in `Footer.astro` verbatim.
- Use the design-system tokens directly: `font-heading`, `font-body`, `text-text-primary`/`secondary`/`tertiary`, `bg-brand-500` (sidebar), `text-brand-500` (section titles), `bg-surface-card` (main column white background). Sentence-case all section titles ("Career profile", "Experience", "Skills", "Education"). Note: this is a deliberate departure from the resume convention of Title Case — accepted because consistency with the rest of `goinnovise.com` outweighs convention adherence. If visual review feels off-brand, revisit.
- Sidebar uses `bg-brand-500` solid coral with `text-white` content (matching the Jekyll feel). Use `--color-brand-500` (`#c24a36`), not `brand-400` (logo coral, lighter), so white text meets WCAG AA.
- Contact list: each item is `<icon> <a href={...}>{value}</a>`. Email: `mailto:`. Phone: `tel:`. Website: `https://{value}`. Social handles: build full URLs from handle (`linkedin.com/in/{handle}`, `github.com/{handle}`, etc.) — same as the Jekyll `contact.liquid`.
- ExperienceList: for each experience, render role + time on the upper row (time floats right), company + location below, then optional `summary` paragraph and optional `bullets` `<ul>`. If neither `summary` nor `bullets` is provided, render only the role/time/company/location header row (acceptable for sparse roles). Apply `class="resume-experience"` to the container so print CSS in U4 can target it for `page-break-inside: avoid`.
- Each top-level resume section gets a stable class name (`resume-section`, `resume-sidebar`, `resume-main`, `resume-header`, `resume-footer`) so U4's print CSS has a clean targeting surface.
- These components do **not** wrap themselves in a `<section>` with side margins — that's the layout's job. They render content only.

**Patterns to follow:**
- `<picture><source srcset type="image/webp"><img src="...jpg"></picture>` for the avatar (`ProfileBlock.astro`). See `Team.astro` for the canonical example.
- LinkedIn SVG glyph: copy from `Footer.astro` (already in repo).
- Tailwind v4 token use: see `Hero.astro`, `Services.astro` for reference. No `tailwind.config.js` (per institutional learning).
- Bare `<path>` icon strings only — never full `<svg>` wrappers (per institutional learning).

**Test scenarios:**
- Happy path: temporarily mount `<ProfileBlock data={loren.profile} />` in a throwaway test page; confirm it renders avatar, name, tagline.
- Edge case (every component): pass `undefined` (or omit the corresponding field on a test resume) → component renders nothing in `dist/<page>/index.html` (no leftover empty `<section>` or `<ul>` shell).
- Edge case: an experience with no `bullets` renders only the summary paragraph; no empty `<ul>` is emitted.
- Edge case: an experience with no `summary` renders only the bullets list (and the role/time/company header).
- Edge case: an experience with neither `summary` nor `bullets` renders only the role/time/company/location header row.
- Edge case: a contact list with only `email` and `linkedin` populated emits two `<li>` items, no others.
- Edge case: avatar `alt` resolves to `profile.avatarAlt` when provided; falls back to `profile.name` when omitted; never empty.
- Edge case: `display.educationInSidebar: true` places `<EducationList>` inside the sidebar markup tree; `false` places it inside the main markup tree. (Verify in U3 page wiring; this unit just provides the component.)
- Visual: at default desktop breakpoint, sidebar is right-side ~320px wide, main column fills remainder. (Visual confirmation in browser; not asserted via build output.)

**Verification:**
- All ten components compile without TypeScript errors.
- Each conditional-render component returns no markup when its input is undefined (verified in U3 once a route renders them with sparse data).
- No `<svg>` element wraps another `<svg>` element in resume markup.

---

- [ ] **U3. Build ResumeLayout + dynamic route at `/resumes/[slug]/`**

**Goal:** Wire the components into a complete page rendered by Astro's static path generation, with trimmed page chrome and the existing Layout's metadata machinery.

**Requirements:** R1, R2, R3, R4, R8, R9 (via `noindex={true}` on Layout), R11 (no /resumes/ index — only the slug route exists)

**Dependencies:** U1, U2

**Files:**
- Create: `src/layouts/ResumeLayout.astro` — trimmed header, two-column shell, minimal footer; takes the resume data as a prop
- Create: `src/pages/resumes/[slug].astro` — dynamic route via `getStaticPaths()` from the `resumes` collection
- Modify: nothing

**Approach:**
- `ResumeLayout.astro`:
  - Frontmatter takes `Props { resume: CollectionEntry<'resumes'>['data'] }`.
  - Wraps a slot-less template: trimmed header → two-column main (`<aside class="resume-sidebar">` + `<section class="resume-main">`) → minimal footer.
  - **Trimmed header:** logo (`<picture>` for `/images/logo/innovise-main-logo.{webp,png}`, link wraps it pointing to `/`). No nav menu. Class `resume-header`. Print CSS (U4) sets this `display: none`.
  - **Sidebar:** `<ProfileBlock>`, `<ContactList>`, `<EducationList>` (when `display.educationInSidebar` is true), then optional `<LanguagesList>` and `<InterestsList>`. Skills go in the main column per the Jekyll pattern (a long list of comma-separated technologies reads better in a wider column).
  - **Main column:** `<CareerProfile>` → `<ExperienceList>` → `<EducationList>` (when not sidebar) → `<SkillsList>` → `<ProjectsList>` → `<PublicationsList>`.
  - **Avatar path resolution:** `ProfileBlock.astro` (in U2) is the single resolver. It builds `srcset=/images/resumes/{avatar}.webp` and `src=/images/resumes/{avatar}.jpg` from `profile.avatar`. ResumeLayout does not touch the avatar path.
  - **On-screen Print button:** floats top-right of the main column (above the career profile), labeled "Print / Save as PDF". Triggers `window.print()`. Class `resume-print-button`. Hidden in print via `@media print` (U4). Has a focusable `<button>` element with `aria-label="Print or save resume as PDF"` for screen-reader users.
  - **Minimal footer:** one line — `© 2026 Innovise, LLC. All rights reserved.` + LinkedIn link. Matches the copyright line emitted by `Footer.astro` exactly (the legal entity is "Innovise, LLC"; "Innovise Technologies" is the brand wordmark used in the logo and as the firm name elsewhere — both forms coexist by design across the site). Class `resume-footer`. Hidden in print via `@media print` (U4).
  - **Print-only versioning footer:** `<small class="resume-print-footer">Generated {YYYY-MM-DD} · current version at goinnovise.com/resumes/{slug}/</small>` rendered after the main resume content. Hidden on screen via `@media screen` (U4); visible only in print. Build date computed at render time as `new Date().toISOString().slice(0, 10)`. Slug comes from `Astro.params.slug`. Recipients of an emailed PDF can compare the footer date to today and recognize a stale document, with the canonical URL in hand to fetch the current version. (See U4 for the corresponding CSS.)
- `src/pages/resumes/[slug].astro`:
  - `export async function getStaticPaths()` returns `(await getCollection('resumes')).map(r => ({ params: { slug: r.id }, props: { resume: r.data } }))`. With the glob loader, `r.id` is the slugified filename (`loren-anderson.yaml` → `loren-anderson`).
  - The page wraps `<ResumeLayout resume={resume} />` inside `<Layout title={...} description={...} noindex={true}>`:
    - `title`: `${resume.profile.name} — ${resume.profile.tagline} | Innovise`
    - `description`: first ~150 chars of `resume.careerProfile.summary` (truncate at the nearest sentence boundary; never inside a word).
    - `image` and `imageAlt`: pass the existing site OG default. Per-resume OG images are out of scope for v1.
    - `noindex={true}` → emits `<meta name="robots" content="noindex, nofollow">` automatically (existing Layout behavior).
- The avatar path resolution lives in `ProfileBlock.astro`: it builds `src=/images/resumes/{avatar}.jpg` and `srcset=/images/resumes/{avatar}.webp`.

**Patterns to follow:**
- `getStaticPaths` Astro pattern — there are no existing examples in this repo, so follow Astro's official content-collections docs (cited in External References).
- Layout-wrap-Layout pattern: ResumeLayout sits *inside* Layout, not as a replacement. Same pattern any per-page component layering would use.
- Service pages (`src/pages/services/embedded-development-team.astro`) demonstrate the per-page Layout-prop-override pattern (custom title, description). Reuse the same wiring.

**Test scenarios:**
- Happy path: `npm run build` produces `dist/resumes/loren-anderson/index.html`.
- Happy path: built HTML contains `<meta name="robots" content="noindex, nofollow">`.
- Happy path: built HTML contains a canonical link of `https://goinnovise.com/resumes/loren-anderson/` (inherited from Layout).
- Happy path: built HTML contains OG/Twitter metadata with the resume name in the title.
- Happy path: built HTML contains the `loren-anderson.webp` reference in a `<source srcset>` and the `.jpg` in an `<img src>`.
- Happy path: avatar `<img>` has a non-empty `alt` attribute (resolves from `profile.avatarAlt` or falls back to `profile.name`).
- Edge case: a hypothetical second resume YAML (`__schema-test.yaml`) builds to a second slug-routed page without any code change. Delete the test file *and* the resulting `dist/resumes/__schema-test/` before commit.
- Edge case: trimmed header logo is wrapped in `<a href="/">`; clicking it navigates to home.
- **Regression guard:** add a build-output assertion (a small Node script invoked from `package.json` `postbuild` or the deploy CI, not committed yet) that scans every `dist/resumes/**/index.html` and fails if any resume HTML lacks `<meta name="robots" content="noindex, nofollow">`. This is the regression prevention for the noindex meta — without it, a Layout regression that drops the meta tag would silently expose resume URLs to indexing. Implementation note: the script is one-page Node, ~20 lines; defer the implementation specifics to U3 execution but the test scenario establishes the requirement.
- Visual: page renders the two-column layout, sidebar on the right, at desktop and tablet widths. (Manual browser check.)
- Visual: clicking the on-screen "Print / Save as PDF" button opens the browser's print dialog.

**Verification:**
- `dist/resumes/loren-anderson/index.html` exists, is valid HTML, contains all expected sections.
- `npm run dev` serves the page, the layout renders, the print button works.
- Lighthouse desktop accessibility ≥ 95 on the page (no regressions vs. main-site pages).

---

- [ ] **U4. Print CSS and on-screen "Print / Save as PDF" button styling**

**Goal:** Print output that looks like a polished one-or-two-page resume in both Letter and A4 print preview, with no site chrome and no animation hooks.

**Requirements:** R3 (chrome hidden in print), R13 (on-screen button hidden in print), R14 (Letter default, A4 verified), R15 (chrome + animation hooks hidden, sidebar prints monochrome), R16 (page-break controls)

**Dependencies:** U2, U3 (provides the class hooks the print rules target)

**Files:**
- Create: `src/styles/resume-print.css`
- Modify: `src/layouts/ResumeLayout.astro` (import the print stylesheet)
- Modify: `src/styles/global.css` — possibly nothing; if any print rules are universal (e.g., entrance-animation cancellation already exists for `prefers-reduced-motion` — extend the same handling for `@media print`), add them here

**Approach:**
- `resume-print.css` contents (sketch — directional, not implementation specification):
  ```css
  @media print {
    @page { size: letter; margin: 0.5in; }

    body { background: white; }

    /* Site chrome and on-screen UI only — these are NOT rendered in print */
    .resume-header,
    .resume-footer,
    .resume-print-button { display: none !important; }

    /* Defensive neutralization for any future entrance-animation classes
       that might land on resume pages. Resume pages don't use these today. */
    .animate-on-scroll,
    .stagger-children > * {
      opacity: 1 !important;
      transform: none !important;
      animation: none !important;
    }

    .resume-sidebar {
      background: var(--color-text-primary);
      color: white;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
      width: 35%;
    }

    .resume-section,
    .resume-experience { page-break-inside: avoid; }

    .resume-section h2 { page-break-after: avoid; }

    /* Preserve link visibility — recipients of a printed resume need to
       see which words are clickable and to type URLs they can't click. */
    a { color: var(--color-text-primary); text-decoration: underline; }
    .resume-sidebar a { color: white; }

    /* Show the canonical resume URL in the print footer so recipients of a
       saved PDF can find the current version. The build date helps surface
       whether the PDF in their inbox is stale. */
    .resume-print-footer {
      display: block;
      font-size: 9pt;
      color: var(--color-text-tertiary);
      margin-top: 0.5in;
      page-break-before: avoid;
    }
  }

  /* Hidden on screen — only visible in print */
  @media screen {
    .resume-print-footer { display: none; }
  }
  ```
- The print rules separate site-chrome hiding (`display: none` for header/footer/button) from animation neutralization (set explicit visible state with `!important` so any future page that happens to include `.animate-on-scroll` doesn't render invisibly when printed). The two intents are now separately reachable.
- The sidebar's print color is `--color-text-primary` (near-black). This is a preference, not a fact. Brand-color print sidebars are valid (and used by many design-forward firms); the chosen rationale is reduced ink usage and avoiding a heavy saturated block competing with the document content. Reversible by switching one CSS variable. Revisit after first visual review.
- Print link styling preserves link visibility (underline + color contrast) because recipients of a printed resume need to see which words are clickable — particularly the email and LinkedIn URL in the sidebar. The `a[href]::after { content: " (" attr(href) ")" }` URL-appending pattern is *not* used because sidebar contact entries already display the full email/URL; using it would duplicate the visible URL after each link.
- A `<small class="resume-print-footer">` element renders inside `ResumeLayout.astro` after the main resume content, hidden on screen via `@media screen` and visible in print. Content: `Generated {build-date} · current version at goinnovise.com/resumes/{slug}/`. The build date is computed at render time via `new Date().toISOString().slice(0,10)`. Anyone holding an old saved PDF can immediately compare the date to today and recognize a stale document, with the canonical URL in hand for recovery.
- Verify the layout at A4 by setting Chrome's print preview paper size to A4. A4 is ~6mm narrower than Letter; the two-column ratio is maintained because columns use percentages, not fixed widths. The 0.5in margins translate to ~12.7mm — well-supported on A4.
- The on-screen Print button uses the design system: `bg-brand-500 text-white px-4 py-2 rounded-lg font-semibold` plus `hover:bg-brand-600`. Place it absolutely positioned top-right of the main column at `top: 1.5rem; right: 1.5rem` so it doesn't displace content. It's `display: none` in print.
- Import `resume-print.css` directly inside `ResumeLayout.astro` via `<style is:global>` (Astro's escape hatch from component-scoped style hashing). `@media print` rules target class names that need to match unaltered, so global is correct.

**Patterns to follow:**
- The existing global animation cancellation block in `src/styles/global.css` (`@media (prefers-reduced-motion: reduce)`) is the model for adding print-specific universal rules.
- Tailwind v4 token usage in raw CSS files: reference custom-property values as `var(--color-brand-500)` etc. (Tailwind v4 generates these on the `:root`).

**Test scenarios:**
- Happy path: open `/resumes/loren-anderson/` in Chrome, hit Cmd+P. Print preview shows: no header, no footer, no Print button, sidebar in dark monochrome with white text, main column in standard typography. Page count is 1-2 for Loren's resume.
- Happy path: same page, print dialog set to A4. Layout still renders correctly — no horizontal overflow, no clipped content, sidebar still sized proportionally.
- Happy path: same page, save as PDF (Chrome's "Save as PDF" destination). Output PDF is a clean, printable document with no chrome.
- Edge case: an experience block that would otherwise fall across a page boundary shifts entirely to the next page (page-break-inside: avoid).
- Edge case: a section heading that would otherwise be the last line on a page shifts down with its first item (page-break-after: avoid on `h2`).
- Edge case: print preview with browser "Background graphics" toggle off: sidebar still prints with its dark background due to `print-color-adjust: exact` (this is what allows the resume to look correct when the user hasn't opted into background printing).
- Edge case: clicking external links in the printed PDF preserves clickability but does NOT append the URL after the text (Chrome's default `a[href]:after { content: " (" attr(href) ")" }` is overridden — link text remains tidy, sidebar already shows the full URL adjacent).
- Edge case: in print preview, link text in the main column is underlined and visually distinct from body copy (link visibility preserved); sidebar email + LinkedIn link contrast against the dark sidebar background.
- Edge case: print preview shows a closing footer line `Generated YYYY-MM-DD · current version at goinnovise.com/resumes/loren-anderson/` after the main resume content. The same line is *not* visible in the on-screen rendering of the page.
- Visual (Firefox): print preview renders comparably. Differences in `print-color-adjust` support are acceptable since Firefox honors the standardized property.

**Verification:**
- Chrome print preview at Letter and A4 both produce a clean resume.
- Saved PDF (Chrome and Firefox) is a clean, single-resume document with no site chrome.
- Page-break behavior is correct: no experience block split across pages, no orphaned headings.

---

- [ ] **U5. Sitemap exclusion for `/resumes/*`**

**Goal:** Exclude resume URLs from `sitemap-index.xml` per origin R10. One-line config change matching the comment already in `astro.config.mjs`.

**Requirements:** R10

**Dependencies:** U3 (resume URLs must exist before exclusion is testable)

**Files:**
- Modify: `astro.config.mjs`

**Approach:**
- Replace `sitemap({ lastmod: new Date() })` with:
  ```js
  sitemap({
    lastmod: new Date(),
    filter: (page) => !page.startsWith('https://goinnovise.com/resumes/'),
  })
  ```
- Update or remove the existing comment block above the integration so it reflects the new state ("Resumes are excluded — the URLs are noindex direct-share artifacts.").

**Patterns to follow:**
- The exact extension point already documented in the `astro.config.mjs` comment.

**Test scenarios:**
- Happy path: `npm run build`, then `grep -c '/resumes/' dist/sitemap-0.xml` returns `0`.
- Happy path: `dist/sitemap-0.xml` still contains the home page, services pages, and other indexable pages — only the resumes are excluded.
- Edge case: a hypothetical second resume at `/resumes/jane-doe/` is also excluded (filter is prefix-based, not single-URL).
- Edge case: a hypothetical future page at `/resumes-tips/` (different prefix, hypothetical) is NOT excluded, because the filter checks for the trailing slash on `/resumes/`. Confirm the prefix has the trailing slash — `/resumes/` not `/resumes` — to avoid this false positive.

**Verification:**
- `dist/sitemap-0.xml` contains zero `<loc>` entries pointing under `/resumes/`.
- `dist/sitemap-0.xml` still contains all other site URLs.

---

- [ ] **U6. Cursor skill: `resume-author` + transferable-rules reference**

**Goal:** A Cursor skill that converts a third-party resume (plain text or Markdown) into a conforming `src/content/resumes/{slug}.yaml` with voice aligned to the transferable principles from `marketing-copy.mdc`. Includes a Jekyll-fast-path so Loren's existing `_data/data.yml` can be processed by the same skill.

**Requirements:** R17, R18, R19, R20, R21, R22

**Dependencies:** U1 (the schema is the skill's output contract)

**Files:**
- Create: `.cursor/skills/resume-author/SKILL.md`
- Create: `.cursor/skills/resume-author/references/transferable-marketing-copy-rules.md`
- Create: `.cursor/skills/resume-author/references/jekyll-data-yml-mapping.md`
- Create: `.cursor/skills/resume-author/references/schema-summary.md`

**Approach:**

The skill follows the same SKILL.md frontmatter pattern as the existing skills under `.cursor/skills/` (e.g., `copy-validator/SKILL.md`).

**SKILL.md structure:**
- Frontmatter: `name: resume-author`, description for activation triggers (e.g., "convert resume", "import resume", "transpose resume to Innovise format", "import Jekyll resume").
- **Activation triggers:** the user pastes resume text, drops a `.md` resume file, or invokes the skill explicitly. Also activates when given a path to the Jekyll `_data/data.yml`.
- **Workflow phases:**
  1. **Detect input format.** Markdown (presence of `#`/`-`/fenced blocks), plain text, or Jekyll YAML (`sidebar:`/`career-profile:`/`experiences:` keys).
  2. **Determine slug.** From candidate's name (e.g., "Jane Doe" → `jane-doe`). If a YAML file already exists at that path, ask the user whether to overwrite, choose a different slug (e.g., disambiguate `jane-doe` to `jane-l-doe`), or abort.
  3. **Map fields.** Use `references/jekyll-data-yml-mapping.md` for the Jekyll fast-path. For free-text inputs, parse: name → `profile.name`; tagline/headline → `profile.tagline`; contact info → `contact.*`; summary/objective → `careerProfile.summary`; each role's title/company/dates → `experiences[].role`/`company`/`time`; bullet points under each role → `experiences[].bullets`; non-bullet narrative under each role → `experiences[].summary`; skills section → `skills[]`; education → `education[]`. Strip inline Markdown emphasis (`*foo*`, `**foo**`, `_foo_`) at conversion time so the YAML carries plain prose.
  4. **Apply transferable voice rules.** Run each prose field (`profile.tagline`, `careerProfile.summary`, every `experiences[].summary`, every `experiences[].bullets[]`) through the rules in `references/transferable-marketing-copy-rules.md`. Track which rules fired on which field for the citation step.
  5. **Ask clarifying questions, triaged by importance.** Use this policy so the user is not interrogated:
     - **Must ask** — anything that would cause the skill to invent a verifiable fact (missing dates, ambiguous role boundaries, unattributed metrics, name romanization for non-Latin scripts). These cannot be resolved by the skill.
     - **Should ask** — strong-claim wording the user may want to revise (e.g., a candidate-authored "increased revenue 200%" with no context).
     - **Skip** — anything the skill can do mechanically (slug derivation, sentence-case normalization, removing jargon listed in `marketing-copy.mdc`'s anti-jargon set).
     Default question budget: ≤ 5 questions per resume. If the input is so sparse that >5 questions would be needed, surface this to the user up front: "This input has substantial gaps; I can either ask you ~10 questions or you can come back with a more complete source." Asked questions are one at a time, never batched.
  6. **Confirm interpretation.** Before writing, show the user a brief field-by-field summary: "Loren Anderson, Principal Consultant, 6 experiences, 1 education entry, 6 skill groups. No projects, publications, languages, or interests detected." Ask for confirmation or edits.
  7. **Write file.** Generate `src/content/resumes/{slug}.yaml` conforming to the schema. Include a top-of-file YAML comment listing assumptions made (e.g., "Inferred role start month as January when only year was given") and citing which transferable rules were applied to which prose fields.
  8. **Tell the user about the headshot.** "Drop the candidate's headshot at `public/images/resumes/{slug}.{webp,jpg}` (both formats — convert via squoosh or `cwebp` if needed). The schema's `profile.avatar` field is set to `{slug}` (no extension) — the layout resolves both extensions."
  9. **Verify build.** Suggest: "Run `npm run build` to confirm the schema validates and the page renders."

**`references/transferable-marketing-copy-rules.md` content (sketch — produced as part of this unit, not pre-decided here):**

| `marketing-copy.mdc` principle | Transferable to resume voice? | Why |
|---|---|---|
| No jargon ("synergy", "leverage", "best-in-class", "end-to-end solutions") | Yes | Universal anti-fluff principle |
| Sentence case for headings | Yes | Universal style consistency |
| Specificity over adjectives | Yes | Universal — "Reduced Azure spend 80%" beats "Significantly improved cloud cost efficiency" |
| Directness; no hedging or filler | Yes | Universal |
| No inflated symbolism | Yes | Universal |
| "Senior engineers, start to finish" / "no hand-me-down capacity" | No | Firm-positioning claim — applies to the firm, not the candidate |
| First-call process language ("about 30 minutes, goes both directions") | No | Firm sales-process voice |
| "Bellevue, WA · serving clients nationwide" | No | Firm location — candidate's resume has its own location field |
| "Senior-led practice -- Loren leads every engagement" | No | Firm structure claim |
| Service-card eyebrow patterns | No | Firm content structure, not resume |

The reference file is the **single enumeration**, the source of truth the skill cites. Updating which rules transfer is a one-file edit, not a skill-prompt rewrite.

**`references/jekyll-data-yml-mapping.md`** documents the field-by-field mapping from Jekyll YAML to Innovise YAML (sidebar.name → profile.name; sidebar.education boolean → display.educationInSidebar; experience.details Markdown blob → split into `summary` + `bullets` with inline emphasis stripped; the Jekyll `examples` field is dropped — not migrated). Used by the fast-path. Same content used as the conversion script for U1 — keep them aligned manually.

**`references/schema-summary.md`** is a human-readable view of the Zod schema from U1 — required vs optional fields, expected types, format constraints. The skill consults this when validating before writing.

**Patterns to follow:**
- `.cursor/skills/copy-validator/SKILL.md` — SKILL.md frontmatter + section style. Same activation-trigger phrasing pattern.
- `.cursor/skills/tech-blog/SKILL.md` (if present) — for an example of a skill with `references/` files.
- The `marketing-copy.mdc` rules file itself, for the source-of-truth voice principles.

**Test scenarios:**
- Happy path (Jekyll fast-path): point the skill at `Innovise/Resumes/loren/_data/data.yml`. Skill produces `src/content/resumes/loren-anderson.yaml` content-equivalent to the file produced manually in U1. Diff between U1's manual conversion and the skill's output should be ≤5% (allow for minor wording cleanup from voice rules; should NOT change facts).
- Happy path (Markdown input): paste a generic mid-career engineer's resume (e.g., a 4-page Markdown export). Skill asks ~3-5 focused questions, produces a valid YAML file, cites which rules were applied to which fields.
- Happy path (plain text input): paste an unformatted resume from a `.txt` export. Skill detects format heuristically, asks for clarification on ambiguous structure (e.g., "Is the line 'Director of Engineering, 2018-Present' a single role or were there multiple promotions inside it?"), produces valid YAML.
- Edge case: source resume contains "Spearheaded synergistic transformation initiatives leveraging best-in-class methodologies for our 8-month cloud migration to AWS." Skill rewrites to "Led the 8-month cloud migration to AWS" — every fact in the rewrite (8 months, AWS, cloud migration) appears verbatim in the source — and cites the anti-jargon and specificity rules. **The rewrite never introduces a metric, technology, timeline, or outcome that does not already appear in the source sentence or in clearly adjacent source sentences.** If no surrounding context supports a factual rewrite, the skill asks the user rather than invent.
- Edge case: source resume omits dates on one role. Skill asks: "When did the [Acme Inc.] role start and end?" — does NOT guess.
- Edge case: source resume claims "increased revenue by 200%" without context. Skill asks: "Is this a verifiable, attributable metric you'd like on the public Innovise resume? Or should I rephrase / drop it?" — does not blindly transcribe potentially weak claims.
- Edge case: candidate's name produces a slug that already exists at `src/content/resumes/{slug}.yaml`. Skill asks: overwrite, disambiguate, or abort. Default suggestion: disambiguate.
- Edge case: source resume has a `Senior-led practice` style claim copy-pasted from somewhere. Skill detects this matches a firm-positioning rule and asks the user whether the candidate actually means this about themselves or whether to drop.
- Integration: after skill produces a YAML file, `npm run build` succeeds — no schema errors. (The skill validates against the schema before writing, but build is the final gate.)

**Verification:**
- A typical pasted resume produces a conforming YAML file in 3-7 minutes of skill interaction.
- The skill never modifies dates, titles, companies, or technologies. (Verifiable by running the skill on a resume the user has in clean form, then diffing the structured fields between input and output.)
- The skill's transparent assumption-comments at the top of the output YAML let the user review and accept/edit individual decisions in 1-2 minutes.

---

## System-Wide Impact

- **Interaction graph:** Adds a new dynamic route handler at `/resumes/[slug]/`. No existing route is modified. `astro.config.mjs` integration registration gains a `filter` callback. No runtime JavaScript changes to existing pages.
- **Error propagation:** Schema validation errors surface at `npm run build` time, before deploy. Build fails loud and clearly. No runtime error surface.
- **State lifecycle risks:** None — fully static generation.
- **API surface parity:** `Layout.astro` is consumed unchanged. All resume-specific UI is additive: new components under `src/components/resume/`, new layout `ResumeLayout.astro`, new content config `src/content.config.ts`, new content directory `src/content/resumes/`. Existing pages are untouched.
- **Integration coverage:** Build-output assertions cover schema validation, sitemap exclusion, page emission, and metadata. Print-preview / PDF-save covers print CSS. Lighthouse covers accessibility. No external sharing validators are required for v1 since pages are noindex (LinkedIn / X card validators are nice-to-have, not required, since the canonical use case is direct URL share to a known recipient).
- **Unchanged invariants:** `Navbar.astro`, `Footer.astro`, `Hero.astro`, all service pages, and the homepage are not modified by this plan. The site's existing entrance-animation system is unchanged on non-resume pages — resume pages opt out via the print CSS rules and via the resume layout not adding `.animate-on-scroll` classes on its content.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Astro 5+ content collections API misunderstanding (legacy `type: 'data'` API still works in some places, deprecated in others) | U1 uses the documented loader-based API explicitly. Cite the official docs URL in the PR description so a reviewer can verify against current Astro 6 docs. |
| Print CSS looks correct in Chrome but broken in Firefox/Safari | U4 includes Firefox print-preview verification in test scenarios. `print-color-adjust: exact` is a standardized property; `-webkit-print-color-adjust: exact` covers older WebKit. Both shipped. |
| Cursor skill rewrites too aggressively and changes facts | R20 is the hardest rule. Skill never writes a fact that doesn't appear in the source. When in doubt, asks. The transferable-rules reference file is narrow on purpose — voice principles only. Reviewer of the skill's output diffs structured fields between input and output to confirm no fact drift. |
| Cursor skill is too conservative and produces low-quality output | The Jekyll fast-path on Loren's existing data is the first proof point. If that output reads as good as the Jekyll original, the skill's voice baseline is acceptable. If not, refine the transferable-rules reference. |
| Schema breaking changes when a future hire's resume has an unanticipated structure | All non-essential fields are `optional()`. Required: profile (name, tagline, avatar), contact.email, careerProfile, experiences (with role, time, company), skills. All else can be omitted. Reviewer should resist adding required fields without a strong case. |
| Browser print-to-PDF output varies enough across browsers that PDFs don't look uniform | A real risk. Mitigation: ship Letter as the CSS default; mark Chrome's Save-as-PDF as the recommended client path in skill output and onboarding docs. Don't promise pixel-perfect parity across browsers. |
| Sidebar at print becomes too dark and floods the printed page with ink | U4 sidebar background is `--color-text-primary` (near-black, ~5% lighter than pure black). Width is 35% of the page. Visual inspection in U4 confirms it's an accent strip, not a flood. If it still looks heavy, switch to `var(--color-surface-inset)` (light gray) with dark text — keep the toggle reversible. |
| Loren's tagline contradicts marketing-copy.mdc (top-promotes Fractional CTO) | Deferred per scope boundaries. The system ships verbatim; copy revision is a separate decision. PR description flags it. |
| Resume URL gets shared more widely than intended after publishing | Pages are `noindex, nofollow` and excluded from sitemap, but URL is still public. This is a known accepted trade-off (origin R9-R12). For especially sensitive cases (e.g., not-yet-public hires), the resume YAML can be added later, post-announcement. |

---

## Documentation / Operational Notes

- **Post-merge runbook:**
  - Verify `dist/resumes/loren-anderson/index.html` exists and contains the `noindex` meta.
  - Verify `dist/sitemap-0.xml` does NOT contain any `/resumes/` URLs.
  - Open the live URL in Chrome, hit Cmd+P, save as PDF, eyeball the output.
  - Open the same URL in Firefox; print-preview should be comparable.
  - Run Lighthouse on the page; accessibility ≥ 95, performance comparable to other site pages.
- **Per-resume onboarding actuals (the real "one YAML + one image" cost):** R8 frames new-hire onboarding as adding one YAML file and one image, but the headshot has cost-of-quality the requirement understates. Concrete checklist for the next hire:
  1. Source a square or near-square portrait photo (1:1 ratio target; cropped down from a larger image is fine).
  2. Optimize the image: target ≤ 60 KB at the served resolution. Recommended pipeline: take a high-res JPG, run through [Squoosh](https://squoosh.app) or `cwebp -q 78` to produce both a `.webp` (~30 KB) and a `.jpg` (~50 KB) at ~600×600 px.
  3. Drop both files at `public/images/resumes/{slug}.webp` and `public/images/resumes/{slug}.jpg`.
  4. Set `profile.avatar: '{slug}'` in the YAML — slug only, no path prefix, no extension. The schema regex (U1) will fail the build if you put a path or capitals.
  5. Set `profile.avatarAlt: '{Full Name}'` (defaults to `profile.name` if omitted).
  6. Run `npm run build` locally. If it fails, the Zod error names the offending field — fix and retry.
  7. Open the page in dev mode (`npm run dev` then `/resumes/{slug}/`). Check at desktop, tablet, and mobile widths.
  8. Print-preview check: Cmd+P at Letter and at A4. Page count should be 1-2 for a typical resume; 3+ pages suggests overlong bullet lists.
  Realistic time budget: 15-30 minutes from raw photo to deployed page when using the Cursor skill (U6) for YAML drafting; longer if writing YAML by hand. The image-quality and print-preview steps are the parts most often skipped — guard against this with a checklist in the PR template, not just a runbook here.
- **Resume retirement (when a team member leaves):**
  - Delete the resume YAML at `src/content/resumes/{slug}.yaml`. Build the site; the `/resumes/{slug}/` URL no longer emits a page.
  - Delete (or move to a private archive) the headshot at `public/images/resumes/{slug}.{webp,jpg}`.
  - **Cached/shared copies:** anyone holding a downloaded PDF or a shared URL still has the old document. The print-only versioning footer (U3, U4) — `Generated YYYY-MM-DD · current version at goinnovise.com/resumes/{slug}/` — gives the recipient a way to recognize the PDF is stale and a URL to check for the current version. After deletion the URL 404s, which is the correct signal that the document is no longer live.
  - Optional: add a 410 Gone or a redirect to the team page if the resume URL had been heavily shared. Not required for v1.
- **Jekyll project retirement (legacy stack):**
  - After Loren's resume is live and verified, archive the `Innovise/Resumes/loren` Jekyll project (move to a `Resumes/_archived/` folder or delete from active worktrees). This is not a code change in the Astro repo — it's a separate housekeeping task.
  - Update any external references to the old Jekyll-served URL (LinkedIn profile URL, email signature, business card) to the new `goinnovise.com/resumes/loren-anderson/` URL.
- **Future considerations (not in scope, but worth recording):**
  - When a second team member is added, validate the schema's optional-fields contract by intentionally omitting sections (e.g., a hire with no formal education, no projects).
  - If resume volume grows past ~5, reconsider whether a `/resumes/` index page (still noindex, but with internal-team-directory utility) becomes worthwhile.
  - If Loren's tagline is revised post-launch, update the YAML directly — no template changes required.
- **Institutional learning candidate (post-merge):**
  - Capture a `docs/solutions/best-practices/innovise-site-content-collections-pattern-2026-05-XX.md` documenting the loader-based content collection setup, the layout-wraps-layout pattern, and the resume-print CSS approach. Future agents adding new content-driven page types (case studies? blog posts?) will want this reference.

---

## Sources & References

- **Origin document:** `docs/brainstorms/2026-05-04-resume-system-port-requirements.md`
- Related code:
  - `src/layouts/Layout.astro` — provides `noindex`, OG/Twitter, canonical machinery (consumed unchanged)
  - `astro.config.mjs` — sitemap filter extension point already documented in comment
  - `src/components/Team.astro`, `src/components/Hero.astro`, `src/components/Footer.astro` — picture-element and design-token reference patterns
  - `src/styles/global.css` — Tailwind v4 `@theme {}` token source of truth
  - `docs/plans/2026-04-23-001-feat-seo-metadata-and-structured-data-plan.md` — established Layout props contract
  - `docs/solutions/best-practices/innovise-site-astro-icon-and-component-patterns-2026-04-20.md` — icon and Tailwind v4 conventions
  - `Innovise/Resumes/loren/_data/data.yml` (separate repo) — Jekyll source for Loren's resume content
  - `.cursor/rules/marketing-copy.mdc` — voice rules reference (transferable subset enumerated in U6)
- External docs:
  - [Astro Content Collections (current API)](https://docs.astro.build/en/guides/content-collections/)
  - [Astro `glob` loader](https://docs.astro.build/en/reference/content-loader-reference/)
  - [`@astrojs/sitemap` `filter` option](https://docs.astro.build/en/guides/integrations-guide/sitemap/#filter)
  - [CSS `@page`](https://developer.mozilla.org/en-US/docs/Web/CSS/@page)
  - [`print-color-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust)
