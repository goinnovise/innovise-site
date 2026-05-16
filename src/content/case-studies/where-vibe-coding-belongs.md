---
title: "Vibe coding has a bad reputation. Here's where it actually works."
summary: "How an ed-tech team replaced Figma handoffs with a vibe-coded React playground built on their real design system. Where AI prototyping actually belongs in a product team."
outcome: "Feature discovery dropped from three planning sessions to one."
publishDate: 2026-05-10
primaryService: embedded-development-team
heroImage: /images/case-studies/where-vibe-coding-belongs.webp
heroImageAlt: "Dashboard built in the design-system playground, showing the same fonts and components used in the live product."
---

<!--
Body-image conventions (case-study scaffold):

- Full-width block image (default):
    <figure>
      <img src="/images/case-studies/foo.webp" alt="..." loading="lazy" />
      <figcaption>Optional inline caption shown in the article body.</figcaption>
    </figure>

- Half-width image floated to the right (text wraps left on desktop, full-width block on mobile):
    <figure class="align-right">...</figure>

- Same, floated left:
    <figure class="align-left">...</figure>

- Opt out of the click-to-zoom lightbox (e.g., for inline icons):
    Add class="no-zoom" to the <img>.

- Force content past a floated figure (rarely needed; clear:both):
    <div class="clear-both"></div>

Click-to-zoom: every body <img> (except .no-zoom) opens a lightbox on click.
The lightbox caption prefers <figcaption> text, falling back to alt. Authors
should write alt text that works both as a screen-reader description AND as
a visible caption when no figcaption is present.

heroImage path convention: /images/case-studies/<slug>.webp
WebP is preferred over PNG/JPG for hero and inline images.
-->

A designer hands off a Figma mockup, developers build it, and the result drifts from what anyone had in mind. Not because anyone did bad work, but because a static design file and a running application aren't the same thing. Figma doesn't know about your component library. It doesn't render your fonts the way a browser does. Translating one into the other has always required manual interpretation, and that interpretation introduces inconsistency at every step. At Innovise, we've been working with an ed-tech client on a different approach: one that sidesteps the translation problem by replacing the mockup entirely.

The team wasn't short on design talent or product thinking. The problem was structural. Their Figma setup was legacy, tokens didn't map cleanly to the web, and there was no reliable way to export design decisions into code without someone filling in the gaps by hand. When product managers and developers got into a room to figure out what a new dashboard should look like, they were working from mockups that didn't reflect how the real product behaved. Feature discovery took three planning sessions where one should have been enough.

## A playground built on the real design system

<a href="https://www.linkedin.com/in/sam-zamor/" target="_blank" rel="noopener noreferrer">Sam</a>, a designer on the Innovise team who uses AI coding tools heavily, built what the team now calls the playground: a React application, vibe-coded in Cursor, that lives inside the client's monorepo and imports their actual design system. The same branded fonts. The same component library. The same buttons, dialogs, form inputs, and navigation patterns that exist in the production application. When Sam builds a prototype in the playground, it looks and behaves like the real product, because it is built from the same foundation. Navigation works. Modals open. Interactions respond with mock data.

<figure class="align-right">
  <img
    src="/images/case-studies/where-vibe-coding-belongs-2.webp"
    alt="The playground rendering a dashboard prototype with the client's real design system: same fonts, same components, same navigation patterns as production."
    loading="lazy"
  />
  <figcaption>The playground in a planning session: live UI, real components, mock data.</figcaption>
</figure>

The practical effect shows up immediately in planning sessions. Instead of walking through static screenshots, Sam opens the playground and adjusts the UI while the team watches. A product manager asks what a different layout would look like. Sam changes it in real time. Someone wants to see how the design system responds if the primary font changes across the entire product. Sam updates the token and every component updates with it. The PM described it plainly: it's something else to see ideas come to life in real time. What used to require multiple rounds of revision and re-presentation now happens in a single session. Sam is also training the client's own designers on the workflow, so it doesn't depend on Sam being in the room. The playground has also grown into a lightweight internal tool: the team uses it to document development teams, their rosters, goals, and KPIs.

## Where vibe coding belongs

The risk people warn about with AI-assisted development is real: the person generating the code often doesn't fully understand what they've built, which is dangerous when that code reaches production. The playground is explicitly not production code. It's a thinking tool. When the team reaches a decision on a feature, the output goes to the client's developers, who treat it as a working reference and implement it properly in the main application. The design-to-code handoff is cleaner than anything that came out of Figma, because the prototype is already written in the same components as the production app. The handoff process is still being refined, but the direction is clear.

The playground works because it lives inside a responsible product development workflow, not outside one. Discovery moves faster. Accountability for what ships still sits with the developers who write the production code. That's the entire move. Vibe coding is not inherently reckless. It depends on where you put it and what happens between the prototype and the deploy. The teams getting the most from AI prototyping have figured out where these tools belong. They hold the line everywhere else. If your team is trying to work out how to use AI without handing it the keys to production, that's a problem worth solving.
