---
title: "Innovise site: Astro icon format and component patterns for future agents"
date: 2026-04-20
category: docs/solutions/best-practices/
module: Innovise site frontend
problem_type: best_practice
component: development_workflow
severity: medium
applies_when:
  - Adding or editing entries in Services.astro services array
  - Adding or editing entries in Packages.astro packages array
  - Adding new Astro section components to the site
  - Modifying Tailwind classes or design tokens
tags:
  - astro, tailwind-v4, icon-format, svg, set:html, nested-svg, component-patterns, design-system
---

# Innovise site: Astro icon format and component patterns for future agents

## Context

During the SMB positioning copy overhaul (April 2026), a pre-existing nested SVG bug was discovered in `Services.astro`. The icon field values for three service entries stored full `<svg>` element strings, causing them to be injected inside the template's outer `<svg>` wrapper via `set:html` — producing nested `<svg>` elements that broke icon rendering. The same pattern applies to `Packages.astro`.

Separately, the Tailwind v4 configuration model and the site's section/animation class conventions are non-obvious to agents coming in cold and have no other documentation outside `innovise-design-system.md`.

## Guidance

### Icon format: bare `<path>` strings only

The `services` array in `Services.astro` and the `packages` array in `Packages.astro` each have an `icon` field rendered via `set:html` into a parent `<svg>` element:

```astro
<svg
  class="text-brand-500 h-6 w-6 ..."
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
  set:html={service.icon}
/>
```

**The `icon` field must contain only the inner shape elements** — bare `<path>`, `<circle>`, `<rect>`, `<line>` etc. strings. Never store a full `<svg>` element string in the icon field; it creates a nested SVG that renders incorrectly.

**Correct** (bare path string):

```js
icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 6.75L22.5 12..." />`;
```

**Wrong** (full SVG element):

```js
icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ...><path d="..." /></svg>`;
```

When sourcing icons from Lucide or similar libraries, copy only the inner `<path>` content from the SVG source, not the outer wrapper. Add explicit `stroke-linecap="round"`, `stroke-linejoin="round"`, and `stroke-width="1.5"` attributes to each path element, since the outer SVG wrapper only sets `fill="none"` and `stroke="currentColor"` — the path-level stroke attributes must be explicit.

Icons with multiple shapes (circles, rects, multiple paths) can be concatenated as a single string:

```js
icon: `<circle cx="5" cy="6" r="3" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6h5..."/>`;
```

### Tailwind v4 — no `tailwind.config.js`

This project uses Tailwind CSS v4 (Oxide model). There is **no `tailwind.config.js` file**. All custom design tokens are defined in the `@theme {}` block inside `src/styles/global.css`. Do not create a config file. To use or inspect a token, read `src/styles/global.css`.

Key token namespaces used in the codebase:

- `bg-surface-page`, `bg-surface-inset`, `bg-surface-card` — section background tiers
- `text-text-primary`, `text-text-secondary`, `text-text-tertiary` — text colors
- `text-brand-400`, `text-brand-500`, `bg-brand-50`, `bg-brand-500` — brand coral tones
- `border-surface-inset`, `border-surface-card` — border colors
- `font-heading` — heading font family (applied to `<h1>`–`<h3>` and eyebrow labels)

### Section structure pattern

Every section follows this shell:

```astro
<section id="[anchor]" class="bg-[surface-token] py-24 lg:py-32">
  <div class="mx-auto max-w-[1200px] px-6 lg:px-16">
    <!-- content -->
  </div>
</section>
```

Section headers use:

```astro
<p
  class="text-brand-400 animate-on-scroll mb-4 text-sm font-semibold tracking-widest uppercase"
>
  Eyebrow text
</p>
<h2
  class="font-heading text-text-primary animate-on-scroll mb-5 text-3xl font-semibold sm:text-4xl lg:text-[41px]"
>
  Section heading
</h2>
<p class="text-text-secondary animate-on-scroll mx-auto max-w-xl text-lg">
  Subheadline
</p>
```

**Exception:** The Hero eyebrow uses `text-brand-100` (not `text-brand-400`) because it sits on the coral hero background.

### Animation classes

Entrance animations are globally disabled via `src/config/entrance-animations.ts` (`ENABLE_ENTRANCE_ANIMATIONS = false`). The classes are still applied to all elements for future-proofing:

- `animate-on-scroll` — on individual elements (headings, paragraphs, cards)
- `stagger-children` — on uniform card grid containers only (supports up to 6 children). **Do not apply to prose sections or non-card layouts** (e.g., Team section was restructured to prose blocks and explicitly does not use `stagger-children`).

### Navbar anchor IDs — must preserve

These `id` attributes are referenced by `Navbar.astro` and must exist on the outer `<section>` element of each component:

| ID             | Component       | Navbar label |
| -------------- | --------------- | ------------ |
| `#home`        | Hero.astro      | (logo)       |
| `#services`    | Services.astro  | Services     |
| `#how-we-work` | HowWeWork.astro | How we work  |
| `#packages`    | Packages.astro  | Packages     |
| `#team`        | Team.astro      | About        |
| `#contact`     | Contact.astro   | Contact      |

### Data array pattern

Content-heavy components declare data arrays in the Astro frontmatter (`---` block) and use `.map()` in the template. No external data files. To edit content, edit the array in the frontmatter.

### Copy conventions (from `innovise-design-system.md`)

- **Sentence case** for all headings and button labels
- **Forbidden phrases:** "end-to-end solutions", "best-in-class", "leverage", "utilize", "synergy", "modern methodologies", "industry best practices", "proven path"
- **Paragraph length:** 2–3 sentences max per card description, active voice, lead with outcomes

## Why This Matters

The icon format issue is silent — the SVG renders without error but the icon appears visually broken (nested SVG dimensions collapse to zero or the icon becomes invisible). It is easy to introduce when copying icon strings from Lucide's website, which provides full `<svg>` element markup. Future additions to either array will hit this silently if the convention is not followed.

The Tailwind v4 config model breaks all agents that look for `tailwind.config.js` — a common first step when modifying design tokens. Without this note, agents typically try to create a config file, which either does nothing or conflicts with the `@theme {}` block.

## When to Apply

- Any time an entry is added to the `services` or `packages` arrays
- Any time a new section component is created in `src/components/`
- Any time a design token or style is needed — read `src/styles/global.css @theme` first
- Before searching for or creating `tailwind.config.js`

## Examples

**Adding a new service entry (correct):**

```js
{
  title: "New service",
  description: "Outcomes-first description. Senior engineers handle it. 2–3 sentences.",
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 ..." />`,
}
```

**Sourcing a Lucide icon correctly:**

1. Find the icon at lucide.dev
2. Copy the SVG source
3. Extract only the inner `<path>` / `<circle>` / `<rect>` elements
4. Add `stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"` to each element
5. Store the resulting string (without outer `<svg>`) in the `icon` field

## Related

- `innovise-design-system.md` — authoritative style constraints for copy and visual elements
- `src/styles/global.css` — `@theme {}` block for all Tailwind v4 design tokens
- `src/config/entrance-animations.ts` — global animation toggle
- `docs/brainstorms/2026-04-20-site-positioning-requirements.md` — approved copy for Team section
- `docs/plans/2026-04-20-001-feat-smb-positioning-copy-overhaul-plan.md` — full implementation plan for the April 2026 positioning overhaul
