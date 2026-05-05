# Transferable marketing-copy rules for resume voice

This document defines which principles from `.cursor/rules/marketing-copy.mdc` apply to candidate resumes, which do not, and how to apply them without inventing facts.

## Why this distinction matters

`marketing-copy.mdc` is firm-positioning material — it instructs how Innovise should describe Innovise. Most of it (e.g., "Bellevue, WA · serving clients nationwide", "senior engineers, no handoffs") is firm-specific and would be a fabrication if applied to a candidate's resume.

A subset of the rules is about *voice* — the way prose is written — and those rules transfer cleanly because they're stylistic, not factual.

## Transferable rules (apply these)

### 1. Sentence case for headings

Resume section headings (Career profile, Experience, Skills, Education) are sentence case, not Title Case. Do not write "Career Profile" or "EXPERIENCE".

The Astro template applies CSS `uppercase` to section headings — but the underlying string in YAML is sentence case so that future template changes don't surface awkward casing.

### 2. Specificity over adjectives

Replace empty intensifiers with the specific thing they're gesturing at — but only when the source supplies the specific.

| Original (vague) | Better (when source supports it) | Source-mandatory rewrite (when source does not) |
|---|---|---|
| "world-class engineer" | "10 years of full-stack development" — only if the source states a number | Strip "world-class"; leave "engineer". Don't invent the 10. |
| "best-in-class results" | "reduced query latency 40%" — only if the source states the metric | Strip "best-in-class"; leave "results". Don't invent the 40%. |
| "proven track record" | (delete; show the record via the bullets that follow) | Delete the phrase. |

### 3. Forbidden phrases and filler

Strip these whenever they appear, in any field:

- "end-to-end solutions"
- "best-in-class"
- "world-class"
- "leverage" (verb) — replace with "use" or rewrite
- "utilize" — replace with "use"
- "synergy" / "synergies"
- "modern methodologies"
- "industry best practices"
- "proven path" / "proven track record"
- "passionate about" — strip; passion is not a fact
- "results-driven" / "results-oriented" — strip; the bullets either show results or don't
- "team player" — strip; collaboration shows in role descriptions

### 4. Active voice, lead with the action

Rewrite passive constructions to active. The candidate is the subject of their own resume.

| Passive | Active |
|---|---|
| "Was responsible for the architecture of the API" | "Architected the API" |
| "The migration was led by Loren" | "Led the migration" |
| "Bugs were fixed in production" | "Fixed bugs in production" |

The Jekyll `_data/data.yml` for Loren has many "Loren was responsible for…" constructions. Rewrite to first-person-implicit active voice ("Architected the …", "Led the …").

### 5. Lead with outcomes when the source supplies them

Reorder a bullet so the result comes first when the source explicitly states the result. Do not invent results.

| Source bullet | Voice-aligned bullet |
|---|---|
| "Worked on improving site performance, which reduced database calls per page from 120 to 2." | "Reduced database calls per page from 120 to 2 by restructuring the query layer." |
| "Built and led a team of 6 software engineers." | "Built and led a team of 6 engineers." (already outcome-led; no rewrite) |
| "Worked on the API." | "Worked on the API." (no source-stated outcome — leave as-is or ask) |

### 6. Two-three sentences max for prose summaries

Career profiles and role summaries that exceed three sentences are usually padded. Compress to the strongest specifics. If the source had four sentences and one was filler, drop it.

A career profile longer than ~80 words on the page reads as a wall of text in print and rarely earns the space. Aim for 60-80 words.

## Non-transferable (do NOT apply these)

These principles from `marketing-copy.mdc` are firm-specific and do not transfer to resumes:

- **Innovise positioning language** — "senior-led practice", "no handoffs after go-live", "all on-shore", "Bellevue, WA · serving clients nationwide", "first call goes both directions, no pitch until we've talked"
- **Service descriptions** — "Embedded development team", "From MVP to production", "Internal team development", "Technical retainer", "Technology and security audit"
- **Loren's case studies** — sports technology audit, real estate startup, ed-tech offshore-to-onshore, mobile app vs. web refactor, etc. These are firm proof points; they belong on the firm site, not on candidate resumes (unless the candidate did the work and the source says so).
- **Bellevue, WA / Seattle metro** geographic frame — only set `profile.location` from what the source provides.
- **Hero eyebrow / service card eyebrow** — these are page-chrome decisions, not resume content.

## Conflict resolution

When a source line is in conflict with a transferable rule (e.g., the candidate wrote "leveraging best-in-class methodologies"), the rule wins — strip the filler. If stripping leaves the line empty of content, ask the user whether to delete the line or rewrite around what's actually there. Never paper over emptiness with invented specifics.

## Worked example

**Source bullet (from a hypothetical candidate's pasted resume):**

> Was a results-driven team player who leveraged best-in-class methodologies to deliver world-class outcomes for stakeholders.

**After voice alignment:**

> (Bullet has no factual content. Ask the user: "This bullet is filler — it doesn't describe what was done. What did you actually do in this role? E.g., a system you built, a metric you moved, a team you led.")

**Source bullet (with content):**

> Loren was responsible for working with the team to redesign the checkout flow, which improved conversion by 8%.

**After voice alignment:**

> Redesigned the checkout flow with the team. Conversion improved 8%.

The 8% comes from the source. The rewrite removes "was responsible for" (passive) and "working with" (filler), and splits compounding clauses for readability.
