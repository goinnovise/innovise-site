---
date: 2026-05-13
topic: case-studies-scaffold
---

# Case studies section scaffold

## Summary

Scaffold a `case-studies` surface on the Innovise site — landing page, individual case-study page template, header and footer navigation, and bidirectional cross-linking with the existing `services/*` pages — designed to host a curated, finite library of 4–8 case studies as an SEO and inbound credibility asset. No case-study content is written in this engagement; the user authors and adds the first case study in a follow-up using copy that is already drafted.

---

## Problem Frame

The Innovise site today does not surface long-form proof of past client work. Service pages reference case studies obliquely — the Story 1–11 summaries in `.cursor/rules/marketing-copy.mdc` appear in narrative form on the relevant `services/*` pages — but there is no dedicated surface where a prospect in buyer-evaluation mode can read a full account of how an engagement actually played out.

Two pressures motivate adding that surface now:

1. **SEO and inbound.** Buyer-evaluation searches consistently include case-study modifiers ("engineering consultancy case study," "offshore-to-onshore engineering transition," "Azure cost optimization case study," "[firm] case study"). The current site cannot rank for these terms because the content does not exist in the form a search engine recognizes. The site's existing SEO architecture — sitemap generation in `astro.config.mjs`, `Service` and `FAQPage` JSON-LD on the service pages — is well-positioned to absorb a new long-form content type.
2. **Credibility for prospects already evaluating.** Buyers who reach a service page on Innovise often need confirmation that the firm has done this kind of work successfully before they book a call. Story summaries embedded in service pages give a taste; long-form case studies, each anchored to a real outcome and the engineer who delivered it, close the trust gap that prevents the booking.

The deliberate constraint shaping this work: Innovise plans to publish roughly 4–8 case studies during a finite marketing push, at roughly a biweekly cadence. That volume and cadence rule out generic blog framing — a "Blog" link in the header pointing to a sparse, intermittently updated archive is one of the most common credibility leaks on consultancy sites, and the `marketing-copy.mdc` "earned trust" principle pushes directly against that failure mode. A surface framed honestly as a curated finite library of case studies reads as proof rather than as a stale blog after the push ends.

This document scopes the scaffold only. The first case study is added by the user in a follow-up.

---

## Actors

- A1. **Case-study author.** Typically Loren; the person turning a client engagement into a published case study. Authors content files following the established Astro content-collection pattern; does not modify scaffold code to add a new case study.
- A2. **Site visitor.** A buyer in the evaluation phase, often arriving from a search-engine result for a buyer-evaluation term or from the "related case studies" block on a service page.

---

## Key Flows

- F1. **Author publishes a new case study.**
  - **Trigger:** Author has case-study copy ready and wants to publish it.
  - **Actors:** A1.
  - **Steps:** Author creates a new content file capturing the case study's structured data and Markdown body, places it alongside other published case studies, builds the site, and verifies that the case study appears on the landing page and on the related service page's "related case studies" block.
  - **Outcome:** The case study is published, listed on the landing page, surfaced on the relevant service page, and indexable by search engines.
  - **Covered by:** R5, R6, R9, R11, R17, R18.

---

## Requirements

**Surface architecture**

- R1. A `case-studies` content surface exists, accessible at a stable URL path under the site root and listed in the site's sitemap.
- R2. Each case study lives at its own URL under the case-studies path and renders as a long-form page with full structured-data treatment for SEO.
- R3. The case-studies landing page lists published case studies in a card grid. Each card is templated to lead with the concrete client outcome (e.g., "Azure spend dropped 80%", "Built up to 25 onshore engineers"), not a generic title.
- R4. The landing page does not foreground recency. No "Latest" badge, no "Posted N days ago" prominence, no sort-by-newest as the dominant affordance. Dates appear on individual case-study pages for transparency only.

**Authoring path**

- R5. Adding a new case study is a single-file content operation following the same Astro content-collection pattern the site already uses for resumes (see `src/content.config.ts` and `src/content/resumes/`). No engineering work is required to add, edit, or publish a case study after the scaffold ships.
- R6. The case-study content file's frontmatter captures the structured data the page needs: title, slug, summary, hero image, publication date, primary service line, and author attribution.
- R7. The body is freeform Markdown. The post template offers a conventional but unenforced shape — client situation, what was tried, what shipped, what changed — so an author can adapt existing copy without fighting a rigid template.
- R8. Author attribution on each post is light and inline (name and role, optionally linked). The structure supports primary authorship by Loren with optional named attribution to the engineer who did the work; no standalone author bio pages are created.

**Service-page integration**

- R9. Each case study identifies a primary service line via its frontmatter, drawn from the existing set of `services/*` pages.
- R10. Each individual case-study page surfaces a back-link to the primary service page it falls under, so a reader who finished the case study can navigate directly to the relevant service.
- R11. Each `services/*` page surfaces a "related case studies" block that lists 1–2 case studies whose primary service line matches the page.
- R12. The "related case studies" block on a service page is fully omitted from the rendered page when no case studies match. No heading, no empty state, no "case studies coming soon" copy.

**Navigation**

- R13. The site header navigation (`src/components/Navbar.astro`) links to the case-studies landing page.
- R14. The site footer navigation (`src/components/Footer.astro`) links to the case-studies landing page.
- R15. The header and footer links are wired against the same path. The user controls public visibility by publishing the first case study before the scaffold goes live to production. Gating logic is not enforced in code; coordination of timing is left to the user.

**Empty-state behavior**

- R16. The case-studies landing page renders without errors when zero case studies are published. The page does not require a minimum number of case studies to display.

**SEO and structured data**

- R17. Each individual case-study page emits article-shaped JSON-LD structured data including `headline`, `datePublished`, `author`, and a `description` sourced from the post's summary frontmatter.
- R18. Both the case-studies landing page and individual case-study pages are indexable and participate in the site's existing sitemap generation in `astro.config.mjs`.
- R19. Each case-study page's `<title>` leads with the case-study topic or named outcome, not the company name. Company name goes last, per `.cursor/rules/marketing-copy.mdc` SEO copy decisions.
- R20. Each case-study page's `<meta name="description">` is sourced from the post's summary frontmatter, not auto-generated from the body.

**Voice and copy alignment**

- R21. All scaffold copy authored as part of this work (page titles, section headings, CTAs, empty-state copy, card labels, navigation labels) complies with the voice rules in `.cursor/rules/marketing-copy.mdc`: directness, specificity over adjectives, no jargon, sentence-case headings.

---

## Acceptance Examples

- AE1. **Covers R12.** Given a service page has no published case studies with a matching primary service line, when the page is rendered, the related case studies block is omitted from the page entirely — no heading, no empty-state placeholder, no "coming soon" copy.
- AE2. **Covers R16.** Given zero case studies are published, when the case-studies landing page is requested, the page renders without errors and produces valid HTML.
- AE3. **Covers R3.** Given a published case study with frontmatter `outcome: "Azure spend dropped 80%"` and title `"Sports-tech infrastructure audit"`, when the landing page is rendered, the case-study card surfaces the outcome as the dominant text element, not the title.

---

## Success Criteria

- A new case study can be added by editing or adding content files only — no `*.astro`, `*.ts`, or layout file changes. Verified by the user adding the first case study in the follow-up without engineering assistance.
- A site visitor on any `services/*` page sees a "related case studies" block when matching content exists, and sees no empty-state placeholder when matching content does not exist.
- A site visitor on the case-studies landing page sees cards that lead with concrete outcomes, not generic titles. The page does not foreground recency.
- A site visitor on an individual case-study page can navigate back to the primary service page in a single click.
- The case-studies landing page and each individual case-study page validate against the marketing-copy voice rules without requiring a second editing pass on scaffold copy.
- Search-engine crawlers index both the landing page and individual case-study pages, with article-shaped structured data verifiable via Google's Rich Results Test on a sample case study.
- Downstream planning has enough specificity that it does not need to invent the URL structure, the content shape, the authoring path, or the cross-linking pattern.

---

## Scope Boundaries

- **Writing any case-study copy.** Content authoring is the user's follow-up; no case studies are authored as part of this work.
- Generic blog functionality — opinion essays, framework pieces, announcements. If those are wanted later, they are a separate decision.
- Newsletter, email subscription, or any lead-capture mechanism beyond what already exists on the homepage contact form.
- Comments, social reactions, or any user-generated content on case-study pages.
- A second "notes" or "writing" surface alongside case studies.
- Standalone author bio pages. Light inline attribution only.
- RSS or Atom feed. Low-cost to add later if asked; out of scope for v1.
- Tags or taxonomies beyond service-line clustering. No industry tags, technology tags, or topic tags in v1.
- Off-site marketing tactics: paid amplification, link-building outreach, automated social distribution. These are not site functionality.
- Internationalization or multi-language support.
- Homepage hero, services-section heading, or other top-level brand-tier copy. This is a feature add, not a brand repositioning.
- The existing `services/*` pages' core content. The only change to those pages is the addition of the "related case studies" block; their hero, who-this-is-for, how-it-works, in-practice, what's-different, FAQ, related-services, and CTA sections are not restructured.

---

## Key Decisions

- **Approach B over A or C.** A surface named "case studies" — what the content actually is — rather than a generic "blog" archive (Approach A) or a case-studies-plus-notes hybrid (Approach C). Specificity over generality is a `marketing-copy.mdc` voice principle, and a finite curated case-studies library survives the "blog last updated 11 months ago" credibility leak that a generic blog at this cadence would invite.
- **Bind case studies tightly to the existing service pages, not as a parallel content track.** Each case study identifies a primary service line and is surfaced on that service page; each individual case-study page links back to the service. This turns the case-studies library into a credibility multiplier on the highest-converting pages of the site, rather than a destination people may or may not navigate to. The user explicitly accepted this refinement during the brainstorm.
- **Header AND footer navigation, both pointing to the same path.** The user's original intent was nav placement in both. With Approach B (case studies, not blog), a header link to a curated library of 4–8 entries reads as proof, not as a stale blog. Footer link mirrors header per existing site conventions.
- **Recency is not foregrounded.** Case studies are evergreen by nature; surfacing recency creates the same stagnation risk that drove the rejection of generic-blog framing. Dates are present on individual case-study pages for transparency, not as a sort key or design accent.
- **Authoring is content-file only.** No CMS, no admin UI, no engineering assistance required to publish. The pattern mirrors `src/content/resumes/` and re-uses the existing `glob` loader convention already proven on the site.
- **Empty-state on service pages hides the block entirely.** Showing a "case studies coming soon" placeholder on a service page is worse than no block at all — it manufactures a promise the page can't keep yet. Hiding is the brand-aligned choice.
- **Scaffold ships with zero case studies acceptable.** The user controls when the case-studies link goes "live" in user-facing terms by publishing the first case study; the code does not enforce gating. This avoids building a deployment-flag system for what is essentially a content-coordination decision.

---

## Dependencies / Assumptions

- The Astro content-collection pattern in `src/content.config.ts` (currently scoped to `resumes`) is the pattern the new case-studies collection follows. A new collection is added to that file alongside `resumes`.
- The site already generates a sitemap via `@astrojs/sitemap` in `astro.config.mjs`. The case-studies landing page and individual case-study pages are absorbed by the existing sitemap configuration without bespoke per-page logic. The existing `filter` callback in `astro.config.mjs` excludes `/resumes/`; case studies are not excluded.
- The existing `services/*` pages share a structural pattern (hero, who-this-is-for, how-it-works, in-practice, what's-different, FAQ, related-services, CTA) confirmed by reading `src/pages/services/internal-team-development.astro` and other service pages during the brainstorm. The "related case studies" block is added as a new section in that pattern, placed where it makes structural sense (likely near or replacing the "in-practice" reference, to be decided in planning).
- The existing `Layout.astro` SEO mechanisms (page `<title>`, `<meta name="description">`, OG tags) handle per-page metadata via props. Case-study pages emit metadata via the same mechanism. JSON-LD is emitted inline per the existing pattern on service pages.
- The marketing-copy voice rules in `.cursor/rules/marketing-copy.mdc` are the authoritative voice spec for all new scaffold copy.
- The user has copy drafted for the first case study and can adapt it to the frontmatter and Markdown shape defined by the scaffold.

---

## Outstanding Questions

### Resolve Before Planning

*(none — all blocking product decisions resolved during the brainstorm.)*

### Deferred to Planning

- [Affects R1, R2][User decision] Exact URL path for the surface. Candidates: `/case-studies/`, `/work/`, `/client-work/`. `/case-studies/` is the strongest direct SEO match for buyer-evaluation queries; `/work/` is shorter but less explicit. Pick during planning based on a final SEO check on the candidate slugs.
- [Affects R6][User decision] Final frontmatter field list and types. Whether to support secondary service lines, multiple authors, or future-optional fields (industry, technology) in the schema even when v1 does not render them — decided during planning.
- [Affects R7][User decision] Whether to include any opinionated post-template helpers (e.g., styled callouts for "Outcome" or "What changed", a templated outcome-stat strip at the top of each post) or keep the post body pure Markdown with no helpers. Stylistic decision deferred to design pass.
- [Affects R3][User decision] Card design specifics on the landing page: image vs. no image, outcome formatting, hover behavior, single-column or multi-column grid at each breakpoint. Deferred to planning and design.
- [Affects R8][User decision] Default author when a case study's frontmatter omits the author field. Loren is the assumed default; planning confirms.
- [Affects R11][Technical] The exact rule for which 1–2 case studies surface on each service page when more than two match — most recent, curated order, or a frontmatter-driven priority field. Decided in planning.
- [Affects R17][Needs research] Whether `Article`, `BlogPosting`, or another schema.org type is the strongest SEO signal for case-study content in 2026. Both are valid; planning picks based on current SEO research.
- [Affects R10, R11][Technical] Exact placement of the "back to service" link on individual case-study pages and the "related case studies" block on service pages — design decision during planning.
- [Affects R15][User decision] Whether to ship the header/footer links with the scaffold (live but pointing to an empty landing) or hold the link wiring until the first case study is ready. Coordination question only; both are technically supported.
