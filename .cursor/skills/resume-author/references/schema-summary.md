# Schema summary — `src/content.config.ts`

The authoritative schema lives in `src/content.config.ts`. This document is a reference for skill authoring. Update both files together when the schema changes.

The schema is `strict()` — unknown keys produce build-time Zod errors. Optional fields can be omitted; required fields cannot.

## Top-level structure

```
profile          (required, strict)
contact          (required, strict)
careerProfile    (required, strict)
experiences      (required, array)
skills           (required, array)
education        (optional, array)
projects         (optional, strict)
publications     (optional, strict)
languages        (optional, array)
interests        (optional, array)
display          (optional, defaults to { educationInSidebar: true })
```

## Field reference

### `profile` (required)

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | |
| `tagline` | string | yes | One-line headline shown in the sidebar |
| `avatar` | string | yes | **Slug only** — matches `^[a-z0-9-]+$`. No path, no extension. The layout resolves both `.webp` and `.jpg` from `/images/resumes/{avatar}.{webp,jpg}`. |
| `avatarAlt` | string | no | Defaults to `name` when absent. Use to provide a more descriptive alt for accessibility. |
| `location` | string | no | Free-form, e.g. `Bellevue, WA` |

### `contact` (required, strict)

All fields below are optional individually, but the object itself is required (it can be `{}` if a candidate has no public contact channels — but the layout will simply render no contact list in that case).

| Field | Type | Notes |
|---|---|---|
| `email` | string (email) | |
| `phone` | string | |
| `website` | string | Bare host or full URL — the layout normalizes via `https://` prefix if missing |
| `linkedin` | string | Handle only — strip `linkedin.com/in/` |
| `github` | string | Handle only — strip `github.com/` |
| `stackOverflow` | string | `{userId}/{slug}` form — the layout builds `stackoverflow.com/users/{value}` |

### `careerProfile` (required, strict)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Typically "Career profile" — sentence case |
| `summary` | string | yes | 60-80 words preferred; longer is allowed but reads as a wall of text in print |

### `experiences` (required, array)

Each item is a `strict` object:

| Field | Type | Required | Notes |
|---|---|---|---|
| `role` | string | yes | |
| `time` | string | yes | Free-form date range, e.g. "Oct 2018 - Oct 2019" or "November 2019 - Present" |
| `company` | string | yes | |
| `location` | string | no | |
| `summary` | string | no | Prose paragraph(s) describing the role |
| `bullets` | string[] | no | Discrete accomplishments. Strip leading bullet markers (`*`, `-`) when transferring |

At least one of `summary` or `bullets` is recommended for each experience, though the schema doesn't enforce this — an experience entry with only `role` / `time` / `company` is valid.

### `skills` (required, array)

Each item is a `strict` object:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Group label, e.g. "Languages" |
| `value` | string | yes | Comma-separated list, e.g. "C#, Java, TypeScript, JavaScript" |

### `education` (optional, array)

Each item is a `strict` object:

| Field | Type | Required | Notes |
|---|---|---|---|
| `degree` | string | no | E.g. "B.S. Computer Science" |
| `university` | string | yes | |
| `time` | string | no | Free-form, e.g. "2008 - 2012" |
| `details` | string | no | Honors, GPA, thesis, etc. |

Omit the entire `education:` key for candidates without formal education.

### `projects` (optional, strict)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | E.g. "Selected projects" |
| `intro` | string | no | |
| `assignments` | array of strict objects | yes | Each has `title` (string, required), `link` (URL, optional), `tagline` (string, optional) |

### `publications` (optional, strict)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | E.g. "Publications" |
| `intro` | string | no | |
| `papers` | array of strict objects | yes | Each has `title`, `authors`, `conference` — all required strings |

### `languages` (optional, array)

Each item: `{ idiom: string, level: string }` — both required.

### `interests` (optional, array)

Each item: `{ item: string, link?: URL }`. Use sparingly — the resume is professional content; hobby noise dilutes it.

### `display` (optional, with defaults)

| Field | Type | Default | Notes |
|---|---|---|---|
| `educationInSidebar` | boolean | `true` | When `true`, education renders in the right rail. When `false`, it renders in the main column with the other sections. |

## Common Zod errors

| Error | Cause | Fix |
|---|---|---|
| `Invalid string: must match pattern /^[a-z0-9-]+$/` on `profile.avatar` | Avatar contains a path, extension, or uppercase | Strip to slug only |
| `Required` on `profile.name` | YAML key was misspelled or absent | Add the field |
| `Unrecognized key(s) in object` | A key not in the schema was added | Either remove the key or extend the schema |
| `Invalid url` on `interests[].link` or `projects.assignments[].link` | Bare host without `https://` | Add the protocol |

When build fails on a Zod error, the message names the offending path (e.g., `profile.avatar`). Fix the YAML and re-run.
