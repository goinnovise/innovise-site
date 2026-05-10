---
date: 2026-05-08
topic: offshore-to-onshore-service-page
---

# Offshore-to-onshore service page

## Summary

A new dedicated service page targeting the CTO or VP Eng who has a failing offshore engagement and is researching a way out. The existing `internal-team-development` page stays intact for the broader hiring buyer; the two pages cross-link. A new card on the services grid surfaces the differentiator.

---

## Problem Frame

Innovise has a real, repeated capability that is currently invisible above the fold anywhere on the site: helping companies move their software engineering off offshore arrangements and onto an onshore team. The ed-tech transition (Story 3 in `marketing-copy.mdc`) — offshore across multiple teams to 25 onshore engineers, with Innovise providing interim coverage during the transition — is the strongest single proof point Innovise has for this kind of work. Today it lives in the second half of the `internal-team-development` page, sharing space with the broader hiring/team-building story.

The April 2026 site-positioning brainstorm (`docs/brainstorms/2026-04-20-site-positioning-requirements.md`) flagged "Offshore Repatriation" as a deferred service-tier opportunity worth revisiting. This is that revisit.

The 2026 software-services SERP for offshore-to-onshore terms is uneven in a way that favors Innovise:

- The exact term "offshore to onshore" is searched, but the SERP is dominated by offshore vendors selling Build-Operate-Transfer (the return path *to* offshore) and by generic comparison-guide content. Almost no US-domestic senior-led firms position explicitly around the transition. The commercial-intent gap is real.
- The dominant 2026 narrative is *nearshore*, not onshore. Nearly half of US companies now nearshore to LATAM. Innovise's "all on-shore" stance is genuinely contrarian and SEO-defensible inside that landscape.
- Buyer-intent search terms cluster around the failure state: "offshore development failed," "offshore project quality issues," "stuck with offshore developers." Roughly 25% of outsourcing projects fail within two years (Accelerance research). That's a non-trivial pool of SMBs in active pain.

The buyer is consistently a CTO or VP Eng who already has an offshore engagement going sideways and needs a way out — not a founder building a first engineering team. That buyer has different urgency, different language, and different proof-point needs than the buyer of the existing `internal-team-development` page. Forcing both audiences through a single page underserves both.

---

## Requirements

**Page architecture**

- R1. A new service page exists under `/services/` dedicated to the offshore-to-onshore transition, separate from the existing `internal-team-development` page.
- R2. The existing `internal-team-development` page is preserved as the broader hiring and team-building service page. Beyond a brief mention of the new page and a cross-link, its scope and structure do not change.
- R3. The new page and the `internal-team-development` page cross-link to each other so that a buyer who lands on the wrong page for their actual situation can route to the right one.
- R4. The new page follows the established Innovise service-page structural pattern used by the other `services/*` pages: hero with breadcrumb and eyebrow, "who this is for," "how it works," "in practice" (case study), "what's different," FAQ, related services, CTA.

**SEO and search-intent capture**

- R5. The page title, H1, slug, and meta description all reinforce the offshore-to-onshore transition as the page's primary intent. The page title leads with the problem or service niche, not the company name (per `marketing-copy.mdc` SEO copy decisions).
- R6. The page body uses failure-state language explicitly — naming what offshore engagements look like when they're going sideways (thin context, slow feedback loops, accumulating technical debt, communication overhead, quality and rework problems) — so the page also captures buyers searching their pain rather than the named service.
- R7. The "all on-shore" positioning is named directly as a contrast to the dominant 2026 nearshore narrative. The page's "what's different" section makes the contrarian stance visible rather than implicit.
- R8. The page includes JSON-LD structured data: a `Service` entry describing the offshore-to-onshore transition specifically, and a `FAQPage` entry covering the page's FAQ. Pattern matches the existing service pages (e.g., `internal-team-development.astro`).
- R9. The page's FAQ targets offshore-failure search intent. At least three of the FAQ entries name questions a CTO with a failing offshore engagement would actually type into a search bar (rather than questions about the service itself).

**Case study and proof points**

- R10. The ed-tech offshore-to-onshore transition is featured prominently on the new page, with more detail than its current placement on the `internal-team-development` page. The expanded version names the failure modes that triggered the transition and the structural moves that made the transition stick.
- R11. The SRE continuity story (Story 8 in `marketing-copy.mdc`) is referenced as a secondary proof point for *interim coverage during transitions*, since offshore-to-onshore transitions also involve coverage gaps when offshore engagements are wound down.

**Differentiator framing**

- R12. The page names what Innovise actually does during a transition that most onshore software firms cannot do: provide interim engineering coverage during the multi-month transition while the permanent onshore team is hired, rather than just selling a new offshore-shaped onshore team.
- R13. The page does not over-claim the team model. Per `marketing-copy.mdc`, copy stays accurate: a senior engineer leads every engagement; supporting engineers are brought in when capacity requires it; clients always know who is on the project and at what level.
- R14. The page does not denigrate offshore engineers themselves. Failure modes are framed as structural (thin context, governance gaps, feedback-loop length, ownership ambiguity), not as a quality-of-people claim. This matches the research evidence and stays in voice with the rest of the site.

**Services grid integration**

- R15. The services grid component (`src/components/Services.astro`) gets a new card linking to the offshore-to-onshore page. The card's eyebrow uses niche-recognition language for the failure-state buyer (per `marketing-copy.mdc` — "Service card eyebrows can carry niche recognition").
- R16. Adding the offshore-to-onshore card does not require a top-nav change or a wholesale reordering of the services grid. The card slots into the existing grid layout.
- R17. The `internal-team-development` card on the services grid retains its current copy and position. The two cards must read as distinct offerings to a buyer scanning the grid — not as duplicates.

**CTA and lead capture**

- R18. The page's CTAs route to the homepage contact form using the same query-param pattern as the other service pages, with a service identifier specific to offshore-to-onshore so inbound submissions can be attributed to this page.

**Voice and copy alignment**

- R19. All copy on the new page complies with the voice and tone rules in `.cursor/rules/marketing-copy.mdc`: directness, specificity over adjectives, no jargon, sentence-case headings, accurate description of how Innovise actually works.
- R20. The page reflects the conviction that comes with this being rewarding work for Innovise to deliver — without overclaiming, without hype, and without sliding into testimonial-style language.

---

## Success Criteria

- A CTO or VP Eng searching "offshore to onshore software development" or related transition terms can find an Innovise page on a search-engine results page within roughly 3-6 months of launch, ranked on page 1 for at least one variant of the term.
- A buyer searching failure-state language ("offshore development not working," "offshore code quality problems," "stuck with offshore developers") who lands on the page recognizes themselves in the first paragraph of "who this is for."
- The page produces inbound contact-form submissions from buyers who explicitly cite offshore failure, an offshore-to-onshore transition, or an offshore engagement going sideways as the trigger for reaching out.
- A buyer who actually wants the broader hiring/team-building help (not the offshore transition) lands on `internal-team-development`, not the new page — or lands on the new page and is cleanly routed via the cross-link.
- Downstream planning has enough specificity that it does not need to invent the page's structure, the buyer's failure-state language, or the SEO targeting strategy.
- The marketing-copy voice rules pass on review without requiring a second editing pass.

---

## Scope Boundaries

- Homepage hero, services-section heading, and any other top-level brand-tier copy are unchanged. This is a service-tier move, not a brand repositioning.
- No editorial blog post, long-form essay, or content-marketing piece is produced as part of this work. An offshore-failure editorial piece (Approach A3 from the brainstorm dialogue) is a possible future follow-on, deliberately separated from this scope.
- No new blog infrastructure is added.
- The `internal-team-development` page is not shrunk, restructured, or repositioned beyond a brief mention and cross-link to the new page.
- No "offshore vs nearshore vs onshore" comparison-guide content is produced. That format is off-voice for the brand.
- Top-nav structure is unchanged. Services-grid ordering is unchanged beyond inserting the new card.
- No outbound campaigns, paid search, paid social, link-building outreach, or off-site SEO work is in scope.
- No general SEO audit, sitemap restructure, or other site-wide SEO work is in scope.
- Schema markup beyond `Service` and `FAQPage` (e.g., `BreadcrumbList`, `Organization`) is out of scope unless it is already standard on existing service pages, in which case the new page matches the existing pattern.

---

## Key Decisions

- **Approach A2 over A1 or A3.** A new dedicated page rather than a tune-up of `internal-team-development`, because the offshore-to-onshore buyer (CTO/VP Eng with a failing engagement) is a distinct buyer with different urgency from the broader hiring buyer. A3 (editorial piece) is a separate decision left for later.
- **Service-tier move, not brand-tier.** The user explicitly does not want this as a primary identity claim. Homepage hero, top-nav, and brand framing stay as established in the April 2026 positioning work.
- **Dual SEO frame.** The page targets both the named-service term ("offshore to onshore software development") at the URL/title/H1 level and the failure-state language in the body. The named-service frame catches buyers who already know what they want; the failure-state frame catches buyers describing their pain.
- **The ed-tech transition is the centerpiece.** The strongest proof Innovise has for this work is the offshore → 25 onshore engineers ed-tech outcome. The new page expands that story; the existing `internal-team-development` page retains a brief reference.
- **Don't denigrate offshore.** Failure modes are named as structural, not as judgments of offshore engineers. This is more accurate, harder to dispute, and stays in brand voice.
- **The contrarian on-shore stance is named directly.** Most 2026 software-services positioning is nearshore-first. Innovise's all-on-shore stance against that tide is a real differentiator and the page makes it visible.

---

## Dependencies / Assumptions

- The existing `services/*` page pattern (hero, who-this-is-for, how-it-works, in-practice, what's-different, FAQ, other-services, CTA) is the template the new page follows. Confirmed by reading `internal-team-development.astro` during brainstorming.
- The contact form on the homepage already accepts a `service` query-param routing pattern and surfaces it on submission. Confirmed by the existing `href="/?service=internal-team#contact"` pattern in `internal-team-development.astro`. The new page uses an analogous service identifier.
- The `Service` and `FAQPage` JSON-LD schema patterns used on `internal-team-development.astro` are the patterns the new page follows.
- The marketing-copy voice rules in `.cursor/rules/marketing-copy.mdc` are the authoritative voice spec for all new copy on the page.
- The April 2026 site-positioning decisions (embedded partner, senior-led, no-dependency-creation, four buying triggers) remain in force; this page reinforces those decisions rather than competing with them.

---

## Outstanding Questions

### Resolve Before Planning

*(none — all blocking questions resolved during the brainstorm.)*

### Deferred to Planning

- [Affects R1, R5][User decision] What is the exact slug for the new page? Candidates include `/services/offshore-to-onshore/`, `/services/offshore-to-onshore-transition/`, and `/services/onshore-software-development/`. The first is the most direct SEO match for the high-intent term; the third is shorter and reads as a service name; the second is the most descriptive but the longest. Pick during planning based on a final SEO check on the candidate slugs.
- [Affects R15, R16][User decision] What is the exact eyebrow text for the new services-grid card? Should name failure-state recognition language without overclaiming. Candidates: `offshore failures · reshoring · all on-shore`, `offshore-to-onshore · reshoring`, or a tighter variant.
- [Affects R10, R11][Needs research] How much detail can the expanded ed-tech case study include without identifying the client? The current `internal-team-development` page treats the ed-tech client anonymously; the expanded version on the new page should stay anonymous unless explicit permission to name the client is obtained.
- [Affects R9][Technical] Final FAQ list — needs drafting during planning. Should include at least three offshore-failure search-intent entries plus baseline service questions.
- [Affects R6, R12][Technical] Final body-copy drafting — needs to pass `copy-validator` and `writing-humanizer` review before merge.
- [Affects R8][Technical] Final `Service` schema `description` and `serviceType` values — should be specific enough to differentiate from the `internal-team-development` page's existing schema entry.
