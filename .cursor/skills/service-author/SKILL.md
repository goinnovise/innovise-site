---
name: service-author
description: Author or refine an Innovise service page end-to-end by orchestrating deep-researcher, copy-validator, image-fetcher, seo-optimizer, and writing-humanizer against the marketing-copy voice rules. Use when the user says "new service", "add a service", "update the [X] service page", "build a service page", or describes a service offering they want represented on the site (e.g., "I want a new service that talks about AI features", "update the CTO-as-a-service page with X").
---

# Service Author

Coordinated workflow for adding a new service page or refining an existing one in `src/pages/services/`. Wraps five other skills and enforces the Innovise voice rules in `.cursor/rules/marketing-copy.mdc`.

## Inputs to extract from the user's prompt

Before doing anything else, classify the request:

- **NEW service** → user describes a service that does not yet exist (e.g., "AI features we can build")
- **UPDATE** → user names an existing service (e.g., "update the CTO-as-a-service page with…")

Then list `src/pages/services/` to confirm. Existing slugs as of authoring:
`custom-software-development`, `embedded-development-team`, `fractional-cto`, `internal-team-development`, `mvp-to-production`, `technology-audit`.

If the user's wording maps ambiguously to an existing slug (e.g., "CTO-as-a-service" → `fractional-cto`), confirm the match before proceeding.

## Workflow

Copy this checklist into your reply at the start of the run and tick items as you go:

```
Service Author Progress:
- [ ] 1. Classify (new vs. update) and confirm slug
- [ ] 2. Research + clarifying questions (deep-researcher)  ← STOP for sign-off
- [ ] 3. Draft + validate copy (copy-validator + marketing-copy rule)
- [ ] 4. Apply changes to .astro files (and registrations if new)
- [ ] 5. Images (image-fetcher) — new services only, or if user requests
- [ ] 6. SEO touch-ups (seo-optimizer)
- [ ] 7. Humanizer sweep (writing-humanizer)  ← STOP for sign-off before commit
```

Two hard checkpoints: **after step 2** (research findings + clarifying answers) and **after step 7** (final humanized output). All other phases run straight through.

---

### Step 1 — Classify and confirm

- Read `src/pages/services/` to enumerate existing slugs.
- If UPDATE: read the existing `.astro` page in full and the `marketing-copy.mdc` rule. Note current title, H1, eyebrow, meta description, schema, FAQ, and cross-links.
- If NEW: choose a slug. Lead with the problem or service niche, not the company name. Use lowercase hyphenated form. Validate the slug doesn't collide with an existing one.

### Step 2 — Research + clarifying questions (HARD STOP)

Read and follow `.cursor/skills/deep-researcher/SKILL.md`. Apply it to the service idea, not the codebase. Produce a tight findings brief covering:

- Who is searching for this and what they type into Google (high-intent search phrases — these will drive the meta title and eyebrow)
- What competing firms call this and what they promise
- What the buyer is afraid of (the thing that would make them not click)
- Honest scope: what Innovise can credibly deliver vs. what would be overclaim
- Proof points from `marketing-copy.mdc` "Various case studies" that fit (cite story numbers)

Then ask the user the clarifying questions deep-researcher surfaces (target buyer, scope boundaries, must-include specifics, any pushback story). Use `AskQuestion` if the tool is available; otherwise inline. **Wait for answers before proceeding.**

### Step 3 — Draft + validate copy

Constraints (from `.cursor/rules/marketing-copy.mdc` — read it in full if not already in context):

- Sentence case for all headings.
- Lead with how the work is done, not what it saves.
- Bellevue, WA is the canonical location. "Seattle" only as metro context. Never "Seattle, Washington."
- Hero eyebrow: "Bellevue, WA · serving clients nationwide" unless a service-specific niche eyebrow is more discriminating (e.g., MVP page uses "AI-generated code · vibe-coded MVPs").
- Page title format: `[Problem or service niche] | Innovise` — never "Innovise | [Service]".
- Meta description: name specific buyer situations and tools; no generic "we help businesses with software."
- No: "end-to-end," "best-in-class," "leverage," "synergy," "modern methodologies," "industry best practices."
- Don't overclaim the team model. Loren leads every engagement; blended teams (mid + junior) are real and acceptable to mention.
- Match the section structure of `src/pages/services/mvp-to-production.astro` (hero → who this is for → how it works → what's covered → in practice / proof → what's different → FAQ → other services → CTA). Deviate only with reason.

Draft the full set of copy blocks (eyebrow, H1, hero subhead, section headings + bodies, FAQ Q&A, schema description, meta title, meta description). Then read and follow `.cursor/skills/copy-validator/SKILL.md` and score the draft against the Hook-Story-Offer scorecard. Rewrite any dimension below 7. Report the final score in the run summary.

### Step 4 — Apply changes to files

**For UPDATE**: edit the existing `.astro` page in `src/pages/services/`. Preserve the layout, schema shape, and `safeJson` pattern. Update only the text and metadata that changed.

**For NEW service**: create the page using the `mvp-to-production.astro` structure as the template. Then update every cross-reference (the codebase has no central service registry — these are the touchpoints):

- `src/pages/services/{slug}.astro` — new page
- `src/pages/services.astro` — services index page (add card)
- `src/components/Services.astro` — homepage services section
- `src/components/Footer.astro` — footer service links
- 2–3 sibling service pages — add the new service to their "Other services" cross-link block, and rotate one out if it's now crowded

Also include the JSON-LD `Service` and `FAQPage` schema blocks following the existing pattern. Use `safeJson` for serialization.

### Step 5 — Images (new services only)

Skip for UPDATE unless the user asked for new imagery.

For NEW: read and follow `.cursor/skills/image-fetcher/SKILL.md`. First check `public/images/content/` for an existing asset that fits — reuse rather than fetch. Existing assets as of authoring: `advisor-laptop-meeting`, `clean-code-workspace`, `code-review-dark`, `developer-desk-wide`, `engineer-coding-station`, `planning-discussion`, `seattle-skyline`, `server-infrastructure`, `strategy-whiteboard`, `team-flipchart`, `team-meeting-bright`, `team-whiteboard`, `ux-wireframe-planning` (each available as `.jpg` and `.webp`).

If a new image is needed, fetch one for the hero and optionally one for the "in practice" section. Save to `public/images/content/` with a descriptive slug. Provide both `.jpg` and `.webp` if the existing pages use a `<picture>` with both sources (they do).

### Step 6 — SEO touch-ups

Read and follow `.cursor/skills/seo-optimizer/SKILL.md` against the rendered page. Specifically verify:

- Primary keyword in `<title>`, H1, and first 100 words of the hero subhead.
- Meta description 150–160 chars, contains the primary keyword and at least one buyer-situation phrase.
- H1 → H2 → H3 hierarchy is intact (Astro template enforces this; check after edits).
- Internal links to 2–3 related services exist.
- Schema markup (`Service` + `FAQPage`) is present and valid.
- Image `alt` text is descriptive, not keyword-stuffed.

Apply fixes directly. Do not produce a separate report unless the user asks for one.

### Step 7 — Humanizer sweep (HARD STOP)

This step has been failed before by skipping it under cover of a quick scan ("I read it through and it looks clean"). Do **not** do that. The audit is the deliverable, not the absence of changes.

Read `.cursor/skills/writing-humanizer/SKILL.md` in full. Then audit every text block on the page against every applicable pattern from that skill. The 24 patterns (with shorthand triggers):

1. Significance/legacy puffery (stands as, testament, pivotal, vital, evolving landscape)
2. Notability/media name-dropping
3. Superficial -ing tacked-on phrases (highlighting, ensuring, reflecting, contributing to)
4. Promotional language (boasts, vibrant, profound, exemplifies, breathtaking, premium, robust)
5. Vague attributions (Industry reports, Observers, Experts argue)
6. Outline-like "Challenges and Future Prospects" sections
7. AI vocabulary (Additionally, leverage, crucial, delve, enhance, fostering, key, landscape, pivotal, showcase, testament, underscore, valuable, vibrant)
8. Copula avoidance (serves as, stands as, marks, represents, boasts)
9. Negative parallelisms ("Not only X but Y", "It's not just X, it's Y")
10. Rule of three padding
11. Synonym cycling
12. False ranges ("from X to Y" where the scale is meaningless)
13. Em-dash overuse
14. Boldface emphasis
15. Inline-header vertical lists ("- **Header:** description")
16. Title case in headings
17. Emojis
18. Curly quotation marks
19. Collaborative communication artifacts ("I hope this helps", "Of course!")
20. Knowledge-cutoff disclaimers
21. Sycophantic tone
22. Filler phrases ("In order to", "Due to the fact that", "the ability to")
23. Excessive hedging
24. Generic positive conclusions ("the future looks bright")

Plus a brand-specific pattern not in the writing-humanizer skill but worth catching here: **filler intensifiers** like "real", "truly", "actually", "genuinely" used more than the page can justify.

**Required text-block coverage** (every one of these gets read and audited, not just the headlines):

- Page `<title>` and meta description
- Service schema `description` field
- Hero eyebrow, H1, subhead, CTA button label
- Each section H2 and intro paragraph (Who this is for, How it works, What's covered, In practice, What's different, FAQ, Other services, CTA)
- Each "Who this is for" buyer card (eyebrow + H3 + body)
- Each "How it works" step card (title + body)
- Each "What's covered" cell (title + body)
- Each "In practice" story (eyebrow + body)
- Each FAQ Q + A
- Each "Other services" cross-link description
- CTA H2 + body + button label

**Required output, in this order:**

1. **Pattern audit table.** For each of the 24 patterns plus filler-intensifiers, write either "no instances found" or list the specific text snippets that need rewriting (quoted, with the block they're in). Do this **before** making any edits.
2. **Edits.** Apply rewrites to the flagged snippets, preserving the marketing-copy voice rules from step 3.
3. **Diff summary.** List every block that changed, with before/after text shown briefly enough to verify.
4. **Final Hook-Story-Offer score** from copy-validator.

Then **stop** and wait for the user's go-ahead.

A turn that says "I scanned the page and it looks clean" or that lists three em-dash trims and stops there does **not** satisfy this step. The user will (correctly) call you on it. The audit table is the deliverable.

---

## Run summary template

End the run with:

```
Service: [slug]  ([new | updated])
Files touched: [list]
Hook-Story-Offer score: [X/100, rating]
Images: [reused | fetched: filename]
Open questions for the user: [any unresolved decisions]
```

## What this skill will not do

- Commit or push. The user runs `git` themselves.
- Build or deploy. Verify visually instead.
- Invent case studies. Proof points come from `marketing-copy.mdc` only. If a story doesn't exist, say so and ask.
- Add a service that overlaps with an existing one without flagging the overlap and asking whether to merge or keep separate.
