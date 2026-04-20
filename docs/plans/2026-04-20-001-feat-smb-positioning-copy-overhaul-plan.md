---

## title: "feat: SMB positioning copy overhaul and team section rebuild"
type: feat
status: active
date: 2026-04-20
origin: docs/brainstorms/2026-04-20-site-positioning-requirements.md

# feat: SMB Positioning Copy Overhaul and Team Section Rebuild

## Overview

Rewrite the site's messaging to speak directly to SMB buyers across four specific buying triggers, replace the generic "startups to Fortune 50" positioning with an embedded-partner framing, and restructure the team section from a 4-person card grid to a founder-focused layout with a collective team prose block. All changes are in `src/components/`. No new pages, no routing changes, no backend work.

## Problem Frame

The Innovise site currently positions the company as a generic custom software consultancy. The messaging does not speak to the actual target buyer (SMBs without internal engineering teams), does not surface Innovise's most distinctive differentiators (senior-only embedded model, willingness to help clients build their own team), and the team section contains three lorem ipsum placeholder bios that actively undermine the boutique quality signal.

See origin: `docs/brainstorms/2026-04-20-site-positioning-requirements.md`
Ideation context: `docs/ideation/2026-04-20-service-catalog-ideation.md`

## Requirements Trace

**Hero (Unit 1)**

- R1. Hero headline speaks to SMBs in one of four buying trigger situations
- R2. Hero subheadline establishes the embedded partner positioning
- R3. "Startups to Fortune 50" framing removed entirely from hero
- R4. CTA labels reviewed for alignment with revised positioning
- R9. Boutique quality signal conveyed through specificity, not claims
- R10. Brand descriptor ("Custom Software Consulting") replaced to hint at embedded/partner model
- R11. All four buying triggers addressed somewhere in the page flow *(hero is the primary location; services and packages contribute supporting coverage — R11 is not fully satisfied until all five units are complete)*

**Services (Unit 2)**

- R5. At least one section beyond the hero reinforces the embedded team dynamic
- R16. Services copy counters bait-and-switch concern through specificity
- R17. "Technical leadership & scaling" reframed to include fractional/embedded leadership angle

**How We Work (Unit 3)**

- R6. How We Work descriptions surface direct communication, visibility, and lack of handoffs

**Packages (Unit 4)**

- R15. "Custom website builds" package reframed; not led as a generic commodity offer
- R18. "Monthly maintenance" package reframed from reactive support to strategic partnership
- R19. Packages section hints at the entry audit as a low-commitment starting point
- R20. "Development teams" package explicitly names the team-building exit ramp

**Team (Unit 5)**

- R7. "Help you build your own team" message placed in founder bio as closing statement
- R8. Message framed as a differentiator — Innovise does not create dependency
- R12. Team section restructured: founder block (Loren only) + collective team prose block
- R13. Sam Zamor, Jim Reynolds, Austin Reynolds removed from team section
- R14. Founder bio contains no specific client names, user counts, or named engagements

## Scope Boundaries

- Copy and messaging changes to `src/components/` files only
- Layout changes are in scope for `src/components/Team.astro` only (founder block + collective team layout)
- All other section layout, design, and component structure: out of scope
- Analytics & dashboards service card (commented out in `Services.astro`): delete the comment block entirely
- No new pages, no routing changes, no backend

### Deferred to Separate Tasks

- Service catalog expansion (Fractional Embedded Partner, Rescue Retainer, AI Workflow Automation Audit, Offshore Repatriation, Guild Model): future planning pass per `docs/ideation/2026-04-20-service-catalog-ideation.md`
- Case studies, testimonials, blog sections: future content pass
- Entrance animation re-enablement: separate flag toggle (`src/config/entrance-animations.ts`)

## Context & Research

### Relevant Code and Patterns

- **Section shell pattern** — every section uses: `<section id="[anchor]" class="bg-[token] py-24 lg:py-32">` with a max-width container inside. All anchor IDs must be preserved.
- **Section header pattern** — eyebrow `<p>` (`.text-brand-400 .animate-on-scroll .text-sm .font-semibold .tracking-widest .uppercase`) + H2 (`.font-heading .text-text-primary .animate-on-scroll .text-3xl...`) + subheadline `<p>` (`.text-text-secondary .animate-on-scroll .mx-auto .max-w-xl .text-lg`). Copy this pattern exactly in all modified sections.
- **Data array pattern** — all content arrays live in the Astro frontmatter (`---` block). `.map()` renders them in the template. No external data files.
- **Icon format (Services, Packages)** — the `set:html={icon}` pattern wraps icon content inside a parent `<svg>` element. New icons and any corrected icons must use bare `<path>` strings, not full `<svg>` element strings. Services 2, 3, 4 currently have nested SVGs (pre-existing bug).
- `**stagger-children` class** — applied to the grid container element, not individual cards. Supports up to 6 children with staggered fade-up delays.
- `**animate-on-scroll` class** — applied to individual elements. Animations are globally off (`ENABLE_ENTRANCE_ANIMATIONS = false`) but classes should still be applied — they're future-proof.
- **Tailwind v4** — no `tailwind.config.js`. All design tokens are in the `@theme {}` block in `src/styles/global.css`. Do not create a config file.
- **Hero eyebrow color** — uses `text-brand-100` (not `text-brand-400`) because it sits on the coral hero background.
- **Team photos** — always `rounded-full` with `border-surface-inset` border per design system spec.
- **Design system constraints** — sentence case for all headings and button labels. No forbidden phrases: "end-to-end solutions", "best-in-class", "leverage", "utilize", "synergy". Paragraphs: 2–3 sentences max, active voice, lead with outcomes.

### Key Asset Locations

- Team photos: `public/images/team/loren-anderson.jpg`, `public/images/team/gary-rubens.png` (exists but not currently in component — see decision below)
- Placeholder SVGs to remove: `public/images/team/placeholder-jim-reynolds.svg`, `public/images/team/placeholder-austin-reynolds.svg`

### Navbar Anchor Inventory (must preserve all)


| Section ID     | Component       | Navbar Label |
| -------------- | --------------- | ------------ |
| `#home`        | Hero.astro      | (logo)       |
| `#services`    | Services.astro  | Services     |
| `#how-we-work` | HowWeWork.astro | How we work  |
| `#packages`    | Packages.astro  | Packages     |
| `#team`        | Team.astro      | About        |
| `#contact`     | Contact.astro   | Contact      |


### Institutional Learnings

- No `docs/solutions/` directory exists yet. No prior institutional learnings to surface.

## Key Technical Decisions

- **Hero eyebrow (R10):** Replace "Custom Software Consulting" with **"Engineering Partner"** — concise, hints at the embedded model without being literal, and avoids the generic consulting category label. (Alternatives considered: "Your Engineering Team" — too informal for a hero eyebrow; "Embedded Software Partner" — too long.) Implementer may override with user confirmation.
- **Services grid with 5 cards:** After removing the Analytics & dashboards comment block, 5 active service cards remain. The existing `grid gap-6 md:grid-cols-2 lg:grid-cols-3` grid handles 5 cards as a 3+2 layout at desktop. This is acceptable — no grid class change needed.
- **Services icon fix scope:** Pre-existing nested SVG bug in services 2, 3, 4 (full `<svg>` strings stored in icon field instead of bare `<path>` strings). Fix these during the copy pass since the frontmatter array is being edited anyway. Low risk, clean change.
- **Team founder block layout:** Two-column layout using `md:grid-cols-2 gap-12 lg:gap-16`. Left column: circular founder photo (`h-48 w-48` or similar, `rounded-full`, centered). Right column: eyebrow label (role), name heading, bio paragraphs, LinkedIn link. Below the two-column block: full-width collective team prose section with its own eyebrow and heading.
- **Gary Rubens (implementation-time decision):** `gary-rubens.png` exists in `public/images/team/` but does not appear in the current component and was not mentioned in the requirements. The requirements specify Loren-only in the founder block. Implementer should confirm with the user whether Gary Rubens should appear in the founder block before shipping. If yes, use the two-column grid (one founder per column). If no, center Loren's block or use a single asymmetric layout.
- **Packages — "Custom website builds":** Retain as a package but reframe around outcomes: modern web presence, performance, conversion — not generic "e-commerce upgrades and cloud migrations." This keeps the package count at 4 and avoids a sparse-looking packages grid.
- **Packages — "Monthly maintenance":** Reframe title and description toward strategic partnership model: proactive risk flagging, architecture advisory, and direct access to a senior engineer — not reactive support on demand.
- `**id="team"` preservation:** The Navbar references `#team` with label "About." This ID must remain on the `<section>` element regardless of interior restructuring.

## Open Questions

### Resolved During Planning

- **Hero eyebrow replacement (was deferred):** "Engineering Partner" — see Key Technical Decisions.
- **Analytics & dashboards card:** Confirmed for deletion by user. Remove the entire `/* ... */` comment block from the services array in `Services.astro`.
- **HowWeWork layout constraints:** Three-column grid with connecting lines is fine for extended descriptions. The grid class stays; only description text changes. No fourth step needed.
- **Team layout:** Two-column founder block + full-width collective prose block — see Key Technical Decisions.

### Deferred to Implementation

- **Gary Rubens founder block inclusion:** Photo asset exists. Whether he appears as a second founder is an implementer/user decision before shipping. See Key Technical Decisions. DELETE GARY RUBENS
- **Hero CTA copy (R4):** "Let's build together" and "See our services" are reasonable; whether they need rewording depends on how the new headline and subheadline read together. Assess at implementation time.
- **Packages entry audit hint wording (R19):** The exact phrasing for introducing the audit concept in the packages section depends on how much emphasis the user wants. Implementer should match the surrounding tone.

## Implementation Units

---

- **Unit 1: Hero copy rewrite**

**Goal:** Replace the hero headline, subheadline, and eyebrow text to speak directly to SMB buyers, remove "startups to Fortune 50," and update the brand descriptor to "Engineering Partner."

**Requirements:** R1, R2, R3, R4, R9, R10, R11

**Dependencies:** None

**Files:**

- Modify: `src/components/Hero.astro`

**Approach:**

- Replace eyebrow `<p>` text from "Custom Software Consulting" to "Engineering Partner"
- Replace the H1 with a headline that speaks to one or more of the four SMB buying triggers. The approved positioning direction is "embedded partner" — the headline should provoke recognition in an SMB founder who is stuck without engineering capacity, not in a Fortune 50 CTO. Example direction: "Your engineering team — without the overhead of building one." (Implementer should write to fit; this is directional, not final copy.)
- Replace the subheadline to establish the embedded-partner model and remove "From startups to Fortune 50." The new subheadline should surface the four buying triggers or use inclusive framing that speaks to all of them. Lead with outcomes, 2–3 sentences max.
- Review CTA labels. "Let's build together" remains suitable. "See our services" remains suitable. Adjust only if the new headline changes their meaning.
- All existing animation classes (`animate-on-scroll`), layout classes, and gradient/parallax markup are unchanged.

**Patterns to follow:**

- `src/components/Hero.astro` — existing eyebrow/H1/subheadline structure
- Design system: sentence case, active voice, lead with outcomes, no forbidden phrases

**Test scenarios:**

- Happy path: Page loads; hero section displays new headline, new subheadline, "Engineering Partner" eyebrow
- Content check: "startups to Fortune 50" phrase does not appear anywhere in the rendered hero
- Content check: "Custom Software Consulting" eyebrow text is gone
- Link integrity: "Let's build together" still navigates to `#contact`; "See our services" still navigates to `#services`
- Regression: All other hero markup (parallax background, gradient overlay, dot pattern, scroll observer) unchanged

**Verification:**

- Hero renders with new copy, no lorem ipsum, no "Fortune 50" phrase
- Both CTA links resolve to correct anchors
- No visual regressions in parallax or gradient behavior

---

- **Unit 2: Services section copy update**

**Goal:** Remove the commented-out Analytics & dashboards card, reframe "Technical leadership & scaling" to hint at fractional/embedded leadership, tighten all service descriptions to counter the bait-and-switch concern, and fix the nested SVG icon bug in services 2–4.

**Requirements:** R5, R16, R17 (and implicitly R11 — service descriptions contribute to four-trigger coverage)

**Dependencies:** None

**Files:**

- Modify: `src/components/Services.astro`

**Approach:**

- Delete the Analytics & dashboards comment block. The `*/` closing delimiter shares a line with the opening `{` of the DevOps entry (line 33 reads `*/ {`). The safe operation is: delete lines 27–32 entirely, then strip the leading `*/` from what was line 33, leaving only `{` as the start of the DevOps entry. Confirm the array is syntactically valid with a build check after this step.
- Reframe "Technical leadership & scaling" title and description to explicitly include fractional and embedded leadership — the market now has a named Fractional CTO category; Innovise's positioning maps directly to it. Description should name what clients get: strategic direction, architecture decisions, and hiring guidance — not just "build and structure engineering teams."
- Tighten remaining service descriptions to lead with outcomes and include specificity that signals senior-only execution (e.g., "we handle" → "senior engineers handle"). 2–3 sentences per card. No forbidden phrases.
- Fix nested SVG bug in the "Technical leadership & scaling," "System integrations," and "Systems design & architecture" entries (currently the 2nd, 3rd, and 4th entries in the array, but reference by title not index after deletion): the `icon` field for these three entries stores full `<svg>` element strings. Replace with bare `<path>` strings (the inner path content only) to match the correct pattern used by "Custom software development," "DevOps & cloud infrastructure," and "UX & interface design." The wrapping `<svg>` in the template already provides the outer element.
- Section heading and eyebrow text ("Engineering solutions across your entire stack" / "What we do") may be kept or adjusted — they are not required changes but can be updated if they no longer fit the revised framing.

**Patterns to follow:**

- "Custom software development," "DevOps & cloud infrastructure," "UX & interface design" — correct bare `<path>` icon format to follow
- `src/components/Services.astro` — existing array structure, `set:html` render pattern

**Test scenarios:**

- Happy path: Services grid renders 5 cards (not 6); no Analytics card present
- Content check: "Technical leadership & scaling" description mentions fractional or embedded leadership
- Regression: No nested `<svg>` elements in rendered service card icons — inspect DOM for services 2, 3, 4
- Layout: 5-card grid renders without layout breaks at all breakpoints (3+2 on desktop is expected)
- Content: No forbidden phrases in any service description

**Verification:**

- Services section shows 5 cards, all with valid copy and correct icon rendering
- No commented-out code remains in the services array

---

- **Unit 3: How We Work copy update**

**Goal:** Rewrite the three step descriptions to surface what makes the Innovise process feel like an internal team: direct access, proactive communication, and continuity post-launch.

**Requirements:** R6

**Dependencies:** None

**Files:**

- Modify: `src/components/HowWeWork.astro`

**Approach:**

- Keep the three-step structure (Discover, Build, Deliver & support) and step numbers. Only the `description` strings change.
- **Discover:** Rewrite to signal that Loren asks "why" before "what" — the first conversation is about the business problem, not the stack. Should counter the "agency that codes what you asked for, not what you needed" concern.
- **Build:** Rewrite to emphasize direct access to the engineer doing the work, early working software, and transparent progress — not milestone gate reviews. Counter: "seniors in sales, juniors in delivery."
- **Deliver & support:** Rewrite to counter the post-launch abandonment fear — Innovise doesn't disappear after go-live. Should reference ongoing access and the graduated client path (helping clients hire their own team when ready).
- Step titles (Discover, Build, Deliver & support) may be updated if better titles emerge, but this is not a requirement.
- Section heading ("Built the agile way") and eyebrow ("Our approach") should be reviewed — "built the agile way" is a commoditized phrase. Consider updating to something more specific to the embedded partner model.
- Layout, grid classes, connecting line markup, and step number circles are unchanged.

**Patterns to follow:**

- `src/components/HowWeWork.astro` — existing step array structure and render pattern
- Design system: sentence case, 2–3 sentences max per description, active voice, lead with outcomes

**Test scenarios:**

- Happy path: How We Work section renders 3 steps with new descriptions
- Content check: Step descriptions do not contain generic agency-speak ("modern methodologies," "industry best practices," "proven path")
- Content check: At least one step description directly addresses the fear of post-launch abandonment
- Regression: Connecting lines between steps still render at desktop breakpoints
- Layout: Three-column grid unchanged

**Verification:**

- All three steps render with non-placeholder, non-generic copy
- Section heading does not contain "agile" if updated (or is clearly intentional if retained)

---

- **Unit 4: Packages section copy update**

**Goal:** Reframe "Monthly maintenance" from reactive support to strategic partnership, update "Development teams" to name the team-building exit ramp, introduce a hint toward the entry audit as the lowest-commitment starting point, and reframe "Custom website builds" to lead with outcomes over commodity framing.

**Requirements:** R15, R18, R19, R20

**Dependencies:** None

**Files:**

- Modify: `src/components/Packages.astro`

**Approach:**

- **Development teams** (featured/hero package): Update description to explicitly reference the team-building exit ramp — Innovise can serve as the team until the client is ready to hire permanently. This is the featured card (coral background); the copy should be the strongest on the page. Add one sentence referencing Innovise's ability to transition the client to internal ownership.
- **Custom website builds**: Reframe toward outcomes and strategic positioning (modern performance, conversion-optimized, maintainable by an internal team) rather than the current generic "ground-up builds to e-commerce upgrades and cloud migrations" framing. Keep as a distinct package.
- **Monthly maintenance** (title may change): Reframe from reactive "software support on demand" to proactive strategic partnership. New description should name what the client gets: a senior engineer watching their system, proactive risk flagging, architecture questions answered, no overhead. Consider renaming to "Strategic Retainer" or "Technical Partnership."
- **Technology & security audits**: Update subtitle/description to signal this is the lowest-commitment way to start — a clear next step for prospects who aren't ready for a full engagement. This addresses R19 (entry audit as a starting point) without requiring a new card.
- Section heading ("Work with us your way") and eyebrow ("Flexible engagement models") are appropriate — retain or adjust to fit.

**Patterns to follow:**

- `src/components/Packages.astro` — existing array structure, `featured` flag pattern, `class:list` conditional pattern

**Test scenarios:**

- Happy path: Packages grid renders 4 cards, all with updated copy
- Content check: "Development teams" description mentions transitioning to an internal team or building the client's own team
- Content check: "Monthly maintenance" (or renamed) description does not say "on demand" or "no commitment" — reframe toward strategic value
- Content check: "Technology & security audits" description positions the audit as an entry point
- Content check: "Custom website builds" description leads with outcomes (performance, maintainability) not process
- Regression: Featured card (Development teams) still renders with coral background and white text
- Regression: All four "Learn more" links still point to `#contact`

**Verification:**

- 4 packages render with updated copy; no commoditized "software support on demand" language
- Featured card styling unchanged
- All `href="#contact"` links intact

---

- **Unit 5: Team section structural rebuild**

**Goal:** Replace the 4-person card grid with a two-block layout: (1) a founder profile block featuring Loren Anderson with the approved bio copy, and (2) a full-width collective team prose block. Remove Sam Zamor, Jim Reynolds, and Austin Reynolds. Preserve `id="team"` and `bg-surface-inset` background.

**Requirements:** R7, R8, R12, R13, R14, R9 (boutique quality signal lives here)

**Dependencies:** Gary Rubens inclusion decision (see Key Technical Decisions) must be confirmed before starting this unit — the answer determines whether the founder block is one-column or two-column, which affects all markup in Block 1. Tone review of Units 1–4 is recommended before finalizing bio copy.

**Files:**

- Modify: `src/components/Team.astro`

**Approach:**

Replace the current `const team = [...]` array and its rendered grid with two distinct layout blocks:

**Block 1 — Founder profile:**

- Section header: eyebrow "Who you're working with", heading "A senior partner, not a staffing agency."
- Two-column layout (`md:grid-cols-2`, `gap-12 lg:gap-16`): left column has Loren's photo, right column has bio text and LinkedIn link
- Photo: `src="/images/team/loren-anderson.jpg"`, large circular treatment (`h-48 w-48` or column-width appropriate, `rounded-full`, `border-4 border-surface-inset`, centered in column), `alt="Loren Anderson"`
- Bio text: the approved copy from the requirements doc (see origin: `docs/brainstorms/2026-04-20-site-positioning-requirements.md § Approved Copy`). Three paragraphs. Apply `text-text-secondary leading-relaxed` text styling.
- LinkedIn link: Loren's existing LinkedIn URL (`https://www.linkedin.com/in/loren-anderson-85953a13/`), same SVG icon + "LinkedIn" text pattern as existing cards
- **Gary Rubens decision:** Before implementation, confirm with user whether Gary Rubens (`public/images/team/gary-rubens.png`) should be included as a second founder in this block. If yes: use full `md:grid-cols-2` grid with one founder per column (photo + bio each). If no: center Loren's block using `max-w-3xl mx-auto` or similar. RUBENS DELETED

**Block 2 — Collective team:**

- Follows Block 1 with `mt-16` or `mt-24` vertical spacing
- Section header: eyebrow "The team behind your project", heading "Senior talent, assembled for your work."
- Full-width prose paragraph: the approved collective team copy from the requirements doc
- No photos, no cards, no individual names — prose only
- Apply `text-text-secondary leading-relaxed mx-auto max-w-3xl text-lg` to the paragraph

**Structural notes:**

- `id="team"` stays on the outer `<section>` element — do not move or rename it
- `bg-surface-inset` on `<section>` — preserve for visual rhythm alternation
- Remove the `stagger-children` class from the new layout (no longer a uniform card grid)
- Apply `animate-on-scroll` to heading, subheading, and prose elements individually
- The old `const team = [...]` array and its card grid markup should be completely replaced — no dead code

**Patterns to follow:**

- Section shell pattern: `<section id="team" class="bg-surface-inset py-24 lg:py-32">`
- Section header pattern: eyebrow `<p>` + H2 + optional subheadline (see Context & Research)
- Team photo treatment: `rounded-full border-4 border-surface-inset object-cover`
- LinkedIn icon: existing SVG path from current `Team.astro`

**Test scenarios:**

- Happy path: Team section renders with Loren's founder block and collective team prose block
- Content check: Lorem ipsum text from Sam Zamor, Jim Reynolds, Austin Reynolds does not appear anywhere in the rendered output
- Content check: Founder bio contains the approved copy; does not reference specific client names, user counts, or named platforms
- Content check: Closing line "And if your goal is eventually to build your own internal team? He'll help you do that too." is present in the founder bio
- Content check: Collective team block does not include individual names or photos
- Anchor check: `#team` anchor still works (referenced by Navbar as "About")
- Regression: Section background is `bg-surface-inset` (warm off-white, consistent with HowWeWork section above)
- Layout: Founder photo displays as a circle with border at all breakpoints; layout does not break at mobile (columns should stack)

**Verification:**

- No lorem ipsum or placeholder content in the section
- `id="team"` present on the section element
- Navbar "About" link navigates to the team section correctly
- Founder bio matches approved copy; collective team prose matches approved copy

---

## System-Wide Impact

- **Navbar links:** All section anchors (`#home`, `#services`, `#how-we-work`, `#packages`, `#team`, `#contact`) must remain intact. No anchor IDs are changing — only interior content.
- **Animation system:** Entrance animations are globally disabled (`ENABLE_ENTRANCE_ANIMATIONS = false`). All new markup should include `animate-on-scroll` on individual elements — harmless now, future-proof for when the flag is re-enabled. Apply `stagger-children` to grid containers **only when the container holds a uniform set of cards** (e.g., Services, Packages). The new Team layout is not a card grid; Unit 5 explicitly removes `stagger-children` from the Team section. Do not add it to the collective team prose block.
- **Unchanged invariants:** Layout.astro, Navbar.astro, Contact.astro, Footer.astro, CTA.astro, TrustedBy.astro — none are touched by this plan.
- **CSS tokens:** All changes use existing design tokens from `global.css @theme`. No new tokens needed.

## Risks & Dependencies

| Risk                                                                                           | Mitigation                                                                                                                    |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Gary Rubens founder block: shipping with or without him may require copy adjustments           | Confirm with user before Unit 5 implementation; photo asset is ready either way                                               |
| Hero headline tone — new copy may feel generic if not grounded in the SMB pain                 | Draft 2–3 headline options and confirm with user before committing                                                            |
| Services 5-card grid looks unbalanced (3+2 at desktop)                                         | Acceptable layout; if visually weak, consider adding a sixth service or changing to `md:grid-cols-2 lg:grid-cols-2`           |
| Packages rename ("Monthly maintenance" → new title) may break any external links or references | Confirm no external links point to this package by name; it's currently anchor-linked only via `#contact`, not its own anchor |

## Documentation / Operational Notes

- The `innovise-design-system.md` is the authoritative style constraint for all copy. Review it before finalizing any headline or button copy.
- Approved copy for the founder bio and collective team block lives in `docs/brainstorms/2026-04-20-site-positioning-requirements.md § Approved Copy`. Use it verbatim.
- After implementation, run `npm run format` to apply Prettier formatting (required for Astro + Tailwind class ordering).

## Sources & References

- **Origin document:** `[docs/brainstorms/2026-04-20-site-positioning-requirements.md](docs/brainstorms/2026-04-20-site-positioning-requirements.md)`
- **Ideation context:** `[docs/ideation/2026-04-20-service-catalog-ideation.md](docs/ideation/2026-04-20-service-catalog-ideation.md)`
- Design system: `[innovise-design-system.md](innovise-design-system.md)`
- Components: `src/components/Hero.astro`, `src/components/Services.astro`, `src/components/HowWeWork.astro`, `src/components/Packages.astro`, `src/components/Team.astro`
- Team photo assets: `public/images/team/`
