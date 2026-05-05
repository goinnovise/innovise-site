# Jekyll `_data/data.yml` → Astro resume YAML mapping

Use this mapping when the input is the legacy Jekyll `_data/data.yml` (the format Innovise used before this Astro system existed). All other input formats (plain text, Markdown) go through Phases 1-9 of the main workflow.

## Top-level keys

| Jekyll key | Astro key | Notes |
|---|---|---|
| `sidebar.position` | (dropped) | Layout decision is now in `display.educationInSidebar`. Default `true`. |
| `sidebar.about.name` | `profile.name` | |
| `sidebar.about.tagline` | `profile.tagline` | |
| `sidebar.about.avatar` | `profile.avatar` | **Strip extension and any path prefix.** Jekyll stored `images/loren-anderson.jpg` or `loren-anderson.jpg`; Astro stores just the slug `loren-anderson`. Validate against `^[a-z0-9-]+$`. |
| `sidebar.about.email` | `contact.email` | |
| `sidebar.about.phone` | `contact.phone` | |
| `sidebar.about.timezone` | (dropped) | Not part of the new schema. If the candidate wants location signal, set `profile.location` instead. |
| `sidebar.about.citizenship` | (dropped) | Not part of the new schema. |
| `sidebar.about.website` | `contact.website` | |
| `sidebar.about.linkedin` | `contact.linkedin` | |
| `sidebar.about.gitlab` | (dropped) | Not in current schema. If a candidate uses GitLab, propose adding it as a schema enhancement; do not silently store it elsewhere. |
| `sidebar.about.github` | `contact.github` | |
| `sidebar.about.stack-overflow` | `contact.stackOverflow` | Note camelCase. |
| `sidebar.about.bitbucket` | (dropped) | Same as GitLab — propose schema addition if needed. |
| `sidebar.about.twitter` | (dropped) | Same. |
| `career-profile.title` | `careerProfile.title` | |
| `career-profile.summary` | `careerProfile.summary` | **Strip Markdown emphasis.** The Jekyll template ran summaries through Markdown; the Astro template does not. |
| `experiences[]` | `experiences[]` | See "Experiences" below. |
| `skills[].title` | `skills[].title` | |
| `skills[].value` | `skills[].value` | |
| `education[].degree` | `education[].degree` | Optional. |
| `education[].university` | `education[].university` | Required. |
| `education[].time` | `education[].time` | Optional. |
| `education[].details` | `education[].details` | Optional. |
| `projects.title` | `projects.title` | |
| `projects.intro` | `projects.intro` | |
| `projects.assignments[].title` | `projects.assignments[].title` | |
| `projects.assignments[].link` | `projects.assignments[].link` | Optional, must be a URL. |
| `projects.assignments[].tagline` | `projects.assignments[].tagline` | Strip Markdown emphasis. |
| `publications.title` | `publications.title` | |
| `publications.intro` | `publications.intro` | |
| `publications.papers[]` | `publications.papers[]` | All three subfields required (`title`, `authors`, `conference`). |
| `languages[].idiom` | `languages[].idiom` | |
| `languages[].level` | `languages[].level` | |
| `interests[].item` | `interests[].item` | |
| `interests[].link` | `interests[].link` | Optional, must be a URL. |

## Experiences — splitting `info` into `summary` + `bullets`

The Jekyll template stored a single `info` field per experience. That string mixed prose paragraphs with bullet lists, separated by blank lines or by `*`/`-` markers.

The Astro schema splits this into:
- `summary` — the prose paragraph(s)
- `bullets` — discrete accomplishments (a list of strings)

Splitting rule: prose paragraph(s) at the top become `summary`; bullet items (lines beginning with `*` or `-`, or items in an explicit YAML sublist) become `bullets`. Strip the bullet markers when transferring.

If a Jekyll `info` field had only prose, set `summary` and omit `bullets`. If it had only bullets, set `bullets` and omit `summary`. If both, set both.

## Markdown emphasis stripping

Strip `**bold**`, `*italic*`, `_underline_`, and `__bold__` from all transferred prose at conversion time. The Astro renderer does not parse Markdown inside YAML strings; emphasis would render as literal characters.

If the original used emphasis to convey meaning (e.g., emphasizing a metric), preserve that meaning by rephrasing in plain prose. Do not preserve the markers.

## Fields that move sections

The Jekyll layout placed education in the right rail. The Astro layout supports either rail or main column via `display.educationInSidebar` (default `true`). When converting from Jekyll, default to `true` to preserve the original placement.

## Fields the new schema dropped

| Jekyll path | Why it's gone |
|---|---|
| `examples` | Was a UX-portfolio gallery section (image grid). The Astro system renders structured data only — galleries belong on a separate portfolio page if needed, not on the resume. |
| `sidebar.about.timezone` | Adds noise to the sidebar and is rarely useful; location covers the same buyer concern. |
| `sidebar.about.citizenship` | Sensitive PII that doesn't belong on a public-but-noindexed page. Recipients who need it should ask. |
| `sidebar.about.gitlab` / `bitbucket` / `twitter` | Not added to the schema yet. Propose a schema extension if a candidate genuinely uses one of these as a primary identity. |

## Don'ts

- **Do not** copy `sidebar.about.avatar` verbatim if it contains a file extension or a path. The new schema enforces slug-only — failures here surface at build time as Zod errors.
- **Do not** re-translate Jekyll's `time: 'Oct 2019 - May 2019'` (an inverted range that's almost certainly a typo). Preserve verbatim and add a YAML comment flagging it for review.
