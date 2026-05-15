---
title: "From Cursor prototype to production: what it actually takes"
description: "You shipped fast with Cursor, Bolt, or Replit. Now it breaks every time you add a feature. Here's what stabilizing an AI-built MVP for production actually involves."
publishDate: 2026-05-15
primaryService: mvp-to-production
targetKeyword: "cursor prototype to production"
secondaryKeywords:
  - "stabilize AI generated code"
  - "bolt mvp production ready"
  - "replit app production"
  - "vibe coded app to production"
  - "fix AI generated codebase"
  - "mvp to production checklist"
relatedServices:
  - ai-engineering
  - technology-audit
  - internal-team-development
featured: true
---

You shipped fast with Cursor, Bolt, or Replit. It worked. Maybe you have paying users. And now every feature you add seems to break something else, the app falls over at the worst times, and you have a knot in your stomach about logging in to look at it.

You are not in a unique situation. This is the predictable middle of the AI-built MVP. The tools are good at getting from zero to something. They are bad at telling you when the something is load-bearing.

## What "production-ready" actually means

Production-ready is not a feature. It is a property of how the code was made. A prototype answers one question: does anyone want this? A production app has to answer a different question every day, without you in the room: can it hold up under real use, fail safely, and be changed without breaking?

The first question with a vibe-coded MVP is not whether to rewrite it. It is what's actually load-bearing. Usually less of it is than the founder thinks. Used in the right place, vibe coding is a real tool — we wrote about [where vibe coding actually belongs](/case-studies/where-vibe-coding-belongs/). The trouble starts when the playground gets pushed to prod.

## The five things we find every time

Auditing one of these codebases is repetitive enough that you can almost script it. The same gaps show up:

1. **Authentication is held together with hope.** Tokens in localStorage, no refresh logic, role checks done in the client. This is the [OWASP Top 10](https://owasp.org/Top10/) item that ships first and gets noticed last.
2. **Secrets are in the bundle.** API keys, database URLs, sometimes a Stripe secret key sitting in a client-side environment file because the AI scaffolded it that way and nobody re-read it.
3. **The database has no migration story.** Schema lives in whatever shape it landed in. Adding a column means manually editing prod.
4. **There are no tests, and no way to add them.** Logic is tangled into components, side effects fire from render, and the test you'd write would require mocking half the universe.
5. **Nothing is watching.** No logs you can search. No alerts when the app is down. You find out from users.

These aren't AI's fault. They are the cost of moving fast without anyone reading the output. [Stanford research](https://arxiv.org/abs/2211.03622) found developers using AI assistants wrote less secure code while being more likely to believe their code was secure. That gap is where the work lives.

## Rewrite, refactor, or hire

For the rescue itself, there is a real decision tree:

- **Strangler-fig refactor** when the domain model is roughly right and the prototype reflects how the business actually works. Replace pieces behind a stable interface, one at a time. [Martin Fowler's pattern](https://martinfowler.com/bliki/StranglerFigApplication.html) is the canonical playbook. This is the path most of the time.
- **Surgical rebuild** when one slice (auth, payments, the data layer) is unsalvageable but the rest is fine. Rebuild that slice cleanly; leave the rest alone.
- **Full rewrite** when the prototype taught you the product is something different from what the code expresses. Rare. The prototype was still worth building.

Either way the cost is real engineering time, and it is best spent before the next round of features goes in, or before you hire your first internal engineer and ask them to inherit it. If the AI inside your app (chat, RAG, agents) is also part of the problem, the same discipline applies to [AI features that need to survive production](/services/ai-engineering/).

## When not to do this

Some prototypes should not become production apps. If the thing you shipped answered the "does anyone want this" question with a clear no, kill it cleanly. If it answered yes but the product you actually want to build is structurally different, do not pour money into the prototype to make it carry a product it was never shaped to hold. Take the lesson, archive the code, and start cleanly with what you now know.

If you want a structured read on what you have before committing, a [technology audit](/services/technology-audit/) is the lighter starting point.
