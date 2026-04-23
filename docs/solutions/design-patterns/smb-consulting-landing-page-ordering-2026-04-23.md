---
title: Landing page section order for senior-only SMB consulting sites
date: 2026-04-23
category: docs/solutions/design-patterns/
module: Landing page structure
problem_type: design_pattern
component: tooling
severity: low
applies_when:
  - Building a single-page marketing site for a boutique or senior-only consulting firm
  - Social proof logos are unrecognized SMB clients rather than household names
  - The site lists engagement models or pricing tiers
  - The team (or founder) is a primary differentiator and the site includes a substantial team/about section
tags:
  - landing-page
  - conversion-optimization
  - information-architecture
  - social-proof
  - funnel-design
  - smb-consulting
---

# Landing page section order for senior-only SMB consulting sites

## Context

The instinct on a services landing page is to place a logo strip of past clients directly below the hero — "trusted by teams who ship" — because social proof is known to lift conversion. That instinct is correct when the logos are instantly recognizable (a few FAANG names; brands the target visitor already trusts). It is the wrong default when the logos are unrecognized SMBs. Visitors cannot grant trust to names they have no prior relationship with, so early placement of unknown logos creates an interruption: a trust-asking section before the visitor knows what is being sold.

A related mistake is ordering the "what you get" sequence as **Services → How We Work → Packages → Team**. This puts pricing between the differentiation claim ("senior-only, no handoffs, direct access to the engineer") and the evidence for it (the founder bio, the team block). Visitors are asked to evaluate rates before they have met the people whose seniority justifies those rates. For a firm whose entire value proposition is "the people are the product," this inverts the evaluation order.

This pattern was applied during the April 2026 page reorder of the Innovise site and is captured here as a reusable default for similar sites.

## Guidance

Order sections on a senior-only SMB consulting landing page as:

```
Hero
  → Services          (what we build)
  → How we work       (the claim: senior-only, no handoffs)
  → Team / About      (the evidence: the people behind the claim)
  → Packages          (how to hire us — priced after value is established)
  → Trusted by        (late-funnel reinforcement right before the ask)
  → CTA
  → Contact
  → Footer
```

Three mechanics make this work:

1. **Claim before evidence, evidence before price.** "How we work" makes a specific promise ("you work directly with the engineer, no handoffs"). The Team section is the physical evidence — the actual senior engineer, with a 15-year bio, whose face appears on the page. Placing Team immediately after How We Work validates the claim while it is still in working memory. Packages then reads as "here is what that senior engineer costs," which is a very different framing from "here is a price list."

2. **Unrecognized logos work better as late-funnel reinforcement than hero-adjacent trust.** Near the CTA, the logo strip answers a question the visitor has now earned the context to ask: *have other companies similar to mine already made this decision?* Logos at that position reinforce a tentative yes. Logos at position 2 ask the visitor to grant trust before they know what the trust is for.

3. **Hero → Services is an uninterrupted answer to "what is this?"** Removing the logo detour between Hero and Services means the visitor gets the category (what we build) immediately, with no trust-demand interstitial. This tightens the first 10 seconds of the page.

Keep the nav link order matching the DOM order. Mismatched nav and scroll orderings introduce a subtle UX wrinkle: the nav implies one mental map of the page while scrolling produces another.

## Why This Matters

- **Wrong ordering costs the exact visitors most likely to convert.** SMB buyers evaluating a senior-only firm care disproportionately about *who* they will be working with. Burying the Team section at position 6 (directly before the CTA) means most visitors scroll past it without engaging. Moving it into the claim-evidence pair puts it in the reading path of every visitor who made it past "how we work."
- **Pricing shown before value is perceived as expensive; pricing shown after is perceived as justified.** This is a fundamental sequencing effect in B2B services copy. It's cheap to get right and cheap to get wrong; the difference is the ordering.
- **Late-funnel social proof is doing a specific job.** The logos at position 6 are not asking "trust us"; they are answering "am I the kind of company that works with this firm?" That's a different and more useful question at that point in the page.

## When to Apply

- A single-page marketing site for a consulting firm, agency, or independent practice.
- Team / founder / about is the primary differentiator (senior-only, founder-led, experienced practitioners).
- Past clients are SMBs or mid-market — logos not instantly recognizable.
- The site has explicit engagement models or pricing tiers.

Do **not** apply when:

- Logos are household-name brands (FAANG, Fortune 100, well-known consumer products). Early placement works there because the trust is pre-granted.
- The site is a product landing page, not a services page. Product pages follow a different funnel (problem → product demo → pricing → social proof → CTA).
- The site is single-founder without a meaningful Team section. The claim→evidence pair collapses if there is no evidence section.

## Examples

**Before** — original Innovise site order:

```
Hero → TrustedBy → Services → HowWeWork → Packages → Team → CTA → Contact
```

Problems: logos at position 2 ask for trust before context; Team at position 6 is mostly unread; pricing (Packages at 5) lands before the people (Team at 6) who justify the pricing.

**After** — applied pattern:

```
Hero → Services → HowWeWork → Team → Packages → TrustedBy → CTA → Contact
```

Effect: Hero → Services answers "what is this?" without interruption. HowWeWork → Team pairs the senior-only claim with the senior engineer as evidence. Packages lands after value is established. TrustedBy at position 6 reinforces the decision right before the ask.

Nav links were reordered to match, swapping the positions of "About" (Team) and "Packages":

```astro
const links = [
  { href: "#services", label: "Services" },
  { href: "#how-we-work", label: "How we work" },
  { href: "#team", label: "About" },
  { href: "#packages", label: "Packages" },
  { href: "#contact", label: "Contact" },
];
```

A secondary effect worth noting: the Hero's "See our services" button (anchored to `#services`) now scrolls directly to the next section instead of past the old TrustedBy position. This is a minor but free UX improvement from the reorder.

## Related

- `src/pages/index.astro` — implementation site for this ordering.
- `src/components/Navbar.astro` — nav link order kept in sync with DOM order.
- `.cursor/rules/marketing-copy.mdc` — Innovise's voice and positioning rules; the ordering reinforces the "senior engineers, direct access, no handoffs" positioning expressed in copy.
