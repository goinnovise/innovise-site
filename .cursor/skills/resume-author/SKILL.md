---
name: resume-author
description: Convert a third-party resume (plain text or Markdown) into a conforming Innovise resume YAML at src/content/resumes/{slug}.yaml. Aligns voice with transferable marketing-copy principles without inventing facts. Activates on "convert resume", "import resume", "transpose resume to Innovise format", "import Jekyll resume", or when the user pastes resume text or drops a Markdown resume file.
metadata:
  version: "1.0.0"
  tags: resume, content-collection, voice-alignment, marketing-copy, yaml-authoring
---

# Resume Author

## Purpose

Convert a third-party resume into a conforming `src/content/resumes/{slug}.yaml` that the Astro resume system renders at `/resumes/{slug}/`. The skill applies *transferable* voice principles from `.cursor/rules/marketing-copy.mdc` to prose fields, while preserving every fact in the source verbatim.

## When This Activates

- The user pastes resume text or drops a `.md` resume file
- The user invokes the skill explicitly ("convert resume", "import resume")
- The user points the skill at the legacy Jekyll `_data/data.yml` (Innovise's prior resume system)

## Core Guarantees

1. **Never invent facts.** Dates, titles, companies, technologies, metrics, and outcomes never appear in the output unless they appear in the source.
2. **Voice alignment is bounded.** The skill rewrites for tone (anti-jargon, sentence case, specificity, directness) but does not invent claims or import firm-positioning language about Innovise.
3. **Citations.** The output YAML carries a top-of-file comment listing which transferable rules were applied and to which fields.
4. **Interactive triage.** The skill asks at most ~5 clarifying questions per resume. Vague inputs are flagged up front rather than papered over.

## Workflow Overview

1. Detect input format
2. Determine the slug
3. Map fields to the schema
4. Apply transferable voice rules
5. Triage clarifying questions (≤ 5)
6. Confirm interpretation with the user
7. Write `src/content/resumes/{slug}.yaml`
8. Tell the user where to drop the headshot
9. Verify build

## Reference Files

- `references/transferable-marketing-copy-rules.md` — which `marketing-copy.mdc` principles transfer to resume voice (and which don't), with rationale
- `references/jekyll-data-yml-mapping.md` — field-by-field mapping for the legacy Jekyll fast-path
- `references/schema-summary.md` — required vs optional fields, types, and constraints from `src/content.config.ts`

## Phase 1 — Detect input format

| Signal | Format |
|---|---|
| `sidebar:` / `career-profile:` / `experiences:` keys at top level | Jekyll YAML (legacy fast-path) |
| Markdown headings (`#`), bullet lists (`-`/`*`), fenced blocks | Markdown |
| Plain prose with line breaks, no syntactic structure | Plain text |

For Jekyll YAML, jump to the fast-path described in `references/jekyll-data-yml-mapping.md`. For Markdown and plain text, continue.

## Phase 2 — Determine the slug

Slug rules (matches the schema's `profile.avatar` regex `^[a-z0-9-]+$`):

1. Lowercase the candidate's full name.
2. Transliterate diacritics to ASCII (`José` → `jose`).
3. Replace spaces, punctuation, and underscores with single hyphens. Collapse repeats.
4. Strip leading and trailing hyphens.
5. Single-word names use just the name.
6. Non-Latin-script names: ask the candidate for a romanized form. Do not guess.
7. If `src/content/resumes/{slug}.yaml` already exists: overwrite, disambiguate, or abort. Default suggestion: disambiguate.

## Phase 3 — Map fields

For free-text inputs, parse:

| Source pattern | Target field |
|---|---|
| Name (top of resume) | `profile.name` |
| Tagline / headline | `profile.tagline` |
| City, state | `profile.location` |
| Email | `contact.email` |
| Phone | `contact.phone` |
| Personal website | `contact.website` |
| LinkedIn (full URL or handle) | `contact.linkedin` (handle only — strip `linkedin.com/in/`) |
| GitHub | `contact.github` (handle only) |
| Stack Overflow | `contact.stackOverflow` (`{userId}/{slug}` form) |
| Summary / Objective | `careerProfile.summary` |
| Each role | `experiences[].role` / `company` / `time` / `location` |
| Prose paragraph(s) under a role | `experiences[].summary` |
| Bullet points under a role | `experiences[].bullets` |
| Skills section (grouped) | `skills[]` (`title` + `value`) |
| Education entries | `education[]` |

**Strip inline Markdown emphasis** (`*foo*`, `**foo**`, `_foo_`) at conversion time. The renderer does not parse Markdown inside YAML strings; emphasis markers would render as literal characters. Rephrase rather than rely on formatting.

**The Jekyll `examples` field is dropped.** It was a UX-portfolio gallery and is not part of the new schema.

## Phase 4 — Apply transferable voice rules

Run each prose field — `profile.tagline`, `careerProfile.summary`, every `experiences[].summary`, every `experiences[].bullets[]` — through the rules in `references/transferable-marketing-copy-rules.md`.

Track which rule fired on which field. The output YAML's top-of-file comment lists these for user review.

**The fact-binding rule is absolute.** A rewrite may compress, restructure, or strip filler — it never adds a metric, technology, timeline, or outcome that does not appear verbatim in the source sentence or in clearly adjacent source sentences. If a source bullet is too vague to be specific without invention, ask the user.

## Phase 5 — Triage clarifying questions

| Tier | When to use | Examples |
|---|---|---|
| **Must ask** | Anything the skill would have to invent to write | Missing dates, ambiguous role boundaries, unattributed metrics, romanization of non-Latin names |
| **Should ask** | Strong claims the user may want to revise | Candidate-authored "increased revenue 200%" with no context |
| **Skip** | Anything mechanical | Slug derivation, sentence-case normalization, stripping listed jargon |

Default question budget: ≤ 5 questions per resume. Ask one at a time. If the input is so sparse that >5 questions would be needed, flag this up front: "This input has substantial gaps. I can either ask you ~10 questions, or you can come back with a more complete source."

## Phase 6 — Confirm interpretation

Before writing, summarize the parse:

> Loren Anderson, Principal Consultant. 6 experiences, 1 education entry, 6 skill groups. No projects, publications, languages, or interests detected. Slug: `loren-anderson`.

Ask for confirmation or edits.

## Phase 7 — Write the file

1. Validate against the schema (see `references/schema-summary.md`) before writing. Required fields must be present; required regexes must match.
2. Write `src/content/resumes/{slug}.yaml` with a top-of-file comment block listing:
   - Source: input format and date
   - Assumptions made (e.g., "Inferred role start month as January when only year was given")
   - Voice rules applied per field (which rule fired where)
   - Anything that might warrant follow-up review

## Phase 8 — Tell the user about the headshot

Drop the candidate's headshot at `public/images/resumes/{slug}.webp` and `public/images/resumes/{slug}.jpg` (both formats — convert via squoosh or `cwebp -q 78`). Target ~600×600 px, ≤ 60 KB total. The schema's `profile.avatar` is set to `{slug}` (no extension) — the layout resolves both formats.

## Phase 9 — Verify build

Run `npm run build` to confirm the schema validates and the page renders. If validation fails, the Zod error names the offending field.

## What This Skill Does NOT Do

- Generate or fabricate work history, accomplishments, or metrics
- Translate resumes from non-Latin scripts
- Convert PDF, .docx, or LinkedIn-export files (plain text or Markdown only)
- Produce per-candidate Open Graph images
- Write firm-positioning copy onto candidate resumes (e.g., "Senior-led practice — Loren leads every engagement" is firm copy, not a candidate's claim)

## Output Quality Bar

A typical pasted resume produces a conforming YAML in 3-7 minutes of skill interaction. The skill's transparent assumption-comments at the top of the output let the user review and accept/edit individual decisions in 1-2 minutes. Structured fields (dates, titles, companies, technologies) match the source verbatim.
