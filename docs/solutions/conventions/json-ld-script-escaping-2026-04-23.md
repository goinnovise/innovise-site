---
title: "Escape < in JSON-LD blocks emitted via raw HTML injection"
date: 2026-04-23
category: docs/solutions/conventions/
module: SEO metadata
problem_type: convention
component: tooling
severity: medium
applies_when:
  - Emitting a JSON object into a `<script>` tag via raw HTML injection (Astro `set:html`, React `dangerouslySetInnerHTML`, Next.js `<Script dangerouslySetInnerHTML>`)
  - Adding JSON-LD structured data to a layout or page
  - Any dynamic or user-adjacent content flows into the JSON-LD payload (page description, user-submitted text, CMS content)
tags:
  - json-ld
  - structured-data
  - astro
  - xss
  - set-html
  - seo
  - script-injection
---

# Escape `<` in JSON-LD blocks emitted via raw HTML injection

## Context

`JSON.stringify()` is the obvious way to serialize a schema.org object for a `<script type="application/ld+json">` block. It produces valid JSON — but JSON is not a safe HTML payload. The string `</script>`, when it appears inside the serialized JSON, is treated by the HTML parser as the closing tag of the surrounding `<script>` element, terminating the block prematurely. Anything after it is parsed as HTML.

The same applies to `<!--` and `-->` (HTML comment delimiters), which can begin a comment-like state inside script content and corrupt parsing depending on the browser.

When this site added `ProfessionalService` and `WebSite` JSON-LD in `src/layouts/Layout.astro`, the schema's `description` field pulled directly from the `description` prop — a value that flows through to every page and is editable. A description containing `</script>` (innocently in a code example, or maliciously injected via a future CMS integration) would escape the `<script>` block and execute whatever followed as HTML. That is a latent XSS vector even if no current value triggers it.

## Guidance

Always route JSON-LD payloads through a small helper that escapes `<` to its unicode form before injection:

```astro
---
const safeJsonLd = (schema: object) =>
  JSON.stringify(schema).replace(/</g, "\\u003c");

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  // ...
};
---

<script
  type="application/ld+json"
  set:html={safeJsonLd(professionalServiceSchema)}
/>
```

The replacement targets only `<`. That covers every HTML-significant sequence that could terminate or corrupt the script block (`</script>`, `<!--`, `<![CDATA[`, any future variant) without needing to enumerate them. `\u003c` is a standard unicode escape — the resulting string is still valid JSON and still parseable by search engine crawlers.

## Why This Matters

- **Security.** The hazard is latent, not hypothetical. The moment any JSON-LD field (`description`, `name`, nested `author.name`, `review.reviewBody`, etc.) pulls from untrusted or editor-controlled input, an unescaped emission is an XSS primitive.
- **Static codebases are not exempt.** A static site today can become a CMS-backed site later. Bake the escape in at the layout layer so future integrations inherit the safety without a second audit.
- **Google and other crawlers parse the unicode escape correctly.** There is no SEO cost to the escaping. JSON-LD validators accept it.
- **`JSON.stringify` alone is a trap.** It is visibly "the right function" for the job, and the gap is invisible until exploited. Documenting it as a convention prevents the next engineer from repeating the default.

## When to Apply

- Any `<script type="application/ld+json">` block on this site (Astro layouts, per-page JSON-LD, breadcrumbs, product schema, FAQ schema).
- Any framework that uses raw HTML injection for script content: React (`dangerouslySetInnerHTML={{ __html: ... }}`), Vue (`v-html`), Svelte (`{@html ...}`), Nuxt/Next equivalents.
- Any inline script block where JSON-serialized data is interpolated into HTML.

Does **not** apply when the script's content is emitted by a dedicated `<script>` element with source-mapped content (a bundled JS file) — that path does not pass through HTML tokenization.

## Examples

**Wrong** — `JSON.stringify` alone:

```astro
<script
  type="application/ld+json"
  set:html={JSON.stringify(schema)}
/>
```

If `schema.description === "We build ${'</script><img src=x onerror=alert(1)>'} custom software"`, the rendered HTML contains an image tag that executes JavaScript on parse.

**Right** — escape `<` before injection:

```astro
---
const safeJsonLd = (schema: object) =>
  JSON.stringify(schema).replace(/</g, "\\u003c");
---

<script
  type="application/ld+json"
  set:html={safeJsonLd(schema)}
/>
```

The same payload now serializes as `"...We build \u003c/script\u003e\u003cimg src=x onerror=alert(1)\u003e custom software..."` — a harmless JSON string, still valid JSON-LD, still readable by crawlers.

## Related

- `src/layouts/Layout.astro` — implementation site for this convention in the Innovise codebase.
- [OWASP — JSON-LD injection hardening guidance](https://owasp.org/www-community/attacks/Script_Injection_attack)
- [Google Search Central — Structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) (confirms unicode escapes in JSON-LD are accepted).
