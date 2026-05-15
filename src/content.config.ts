import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;

export const serviceSlugs = [
  "ai-engineering",
  "custom-software-development",
  "embedded-development-team",
  "fractional-cto",
  "internal-team-development",
  "mvp-to-production",
  "technology-audit",
] as const;

const resumes = defineCollection({
  loader: glob({
    pattern: "*.{yaml,yml}",
    base: "./src/content/resumes",
  }),
  schema: z
    .object({
      profile: z
        .object({
          name: z.string(),
          tagline: z.string(),
          avatar: z
            .string()
            .regex(
              slugRegex,
              'Avatar must be a slug (lowercase, hyphenated, no path or extension), e.g. "loren-anderson"',
            ),
          avatarAlt: z.string().optional(),
          location: z.string().optional(),
        })
        .strict(),

      contact: z
        .object({
          email: z.string().email().optional(),
          phone: z.string().optional(),
          website: z.string().optional(),
          linkedin: z.string().optional(),
          github: z.string().optional(),
          stackOverflow: z.string().optional(),
        })
        .strict(),

      careerProfile: z
        .object({
          title: z.string(),
          summary: z.string(),
        })
        .strict(),

      experiences: z.array(
        z
          .object({
            role: z.string(),
            time: z.string(),
            company: z.string(),
            location: z.string().optional(),
            summary: z.string().optional(),
            bullets: z.array(z.string()).optional(),
          })
          .strict(),
      ),

      skills: z.array(
        z
          .object({
            title: z.string(),
            value: z.string(),
          })
          .strict(),
      ),

      education: z
        .array(
          z
            .object({
              degree: z.string().optional(),
              university: z.string(),
              time: z.string().optional(),
              details: z.string().optional(),
            })
            .strict(),
        )
        .optional(),

      projects: z
        .object({
          title: z.string(),
          intro: z.string().optional(),
          assignments: z.array(
            z
              .object({
                title: z.string(),
                link: z.string().url().optional(),
                tagline: z.string().optional(),
              })
              .strict(),
          ),
        })
        .strict()
        .optional(),

      publications: z
        .object({
          title: z.string(),
          intro: z.string().optional(),
          papers: z.array(
            z
              .object({
                title: z.string(),
                authors: z.string(),
                conference: z.string(),
              })
              .strict(),
          ),
        })
        .strict()
        .optional(),

      languages: z
        .array(
          z
            .object({
              idiom: z.string(),
              level: z.string(),
            })
            .strict(),
        )
        .optional(),

      interests: z
        .array(
          z
            .object({
              item: z.string(),
              link: z.string().url().optional(),
            })
            .strict(),
        )
        .optional(),

      display: z
        .object({
          educationInSidebar: z.boolean().default(true),
        })
        .strict()
        .default({ educationInSidebar: true }),
    })
    .strict(),
});

const caseStudies = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/case-studies",
  }),
  schema: z
    .object({
      // Display title on the post page; also used for breadcrumbs and the
      // SEO <title> (which leads with the topic per marketing-copy SEO rules).
      title: z.string(),

      // Short prose, 1-2 sentences. Sourced into <meta name="description">,
      // OG description, BlogPosting JSON-LD description, and the card excerpt.
      summary: z.string(),

      // The concrete client outcome (e.g., "Azure spend dropped 80%").
      // Templated to lead each landing-page card and to surface as the
      // hero subhead on the post page itself.
      outcome: z.string(),

      // Optional path to a hero image asset (e.g., "/images/case-studies/foo.webp").
      // Paired with heroImageAlt below.
      heroImage: z.string().optional(),
      heroImageAlt: z.string().optional(),

      // `coerce` so the schema accepts both unquoted YAML dates (2026-05-14)
      // and quoted strings. `z.date()` alone rejects strings.
      publishDate: z.coerce.date(),

      // Anchors the case study to one of the seven existing service pages.
      // Drives the back-link on the post page and the related-rail surfacing
      // on the service page.
      primaryService: z.enum(serviceSlugs),

      // Light inline attribution. Defaults to Loren when omitted; when an
      // engineer co-authored or solely delivered the work, they go into the
      // same string (e.g., "Loren Anderson with Jane Doe"). Origin spec is
      // "light inline attribution" — no separate contributor field.
      author: z.string().default("Loren Anderson, Founder"),
      authorLink: z
        .string()
        .url()
        .refine((v) => /^https?:\/\//i.test(v), {
          message: "authorLink must use http(s) protocol",
        })
        .optional(),
    })
    .strict()
    .refine(
      (data) => data.heroImage === undefined || data.heroImageAlt !== undefined,
      {
        message:
          "heroImageAlt is required when heroImage is set (accessibility + SEO).",
        path: ["heroImageAlt"],
      },
    ),
});

// Long-form editorial / SEO articles. Lives alongside `caseStudies` but with
// different semantics: case studies document real client outcomes (high-trust
// proof), articles are opinion / how-to / decision frameworks / checklists
// (top-of-funnel SEO + linkedin-shareable). Cards in /articles/ surface the
// description and category; the post page uses the same prose styling as
// case-studies for readability, but with article-specific metadata (target
// keyword, related services, updated date, draft flag).
const articles = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/articles",
  }),
  schema: z
    .object({
      // SEO <title> leads with the article title; rendered as <h1> on the post.
      title: z.string(),

      // 1-2 sentences. Sourced into <meta name="description">, OG description,
      // BlogPosting JSON-LD description, and the listing card excerpt.
      description: z.string(),

      // Article publish date (coerce so unquoted YAML dates work).
      publishDate: z.coerce.date(),

      // Optional "last updated" date for refreshes. When present, surfaces on
      // the post page and feeds BlogPosting `dateModified` for fresher SERP
      // signal on revisited posts.
      updated: z.coerce.date().optional(),

      // Anchors the article to one service for breadcrumb context + the
      // primary CTA at the bottom of the post. Mirrors the case-study field
      // so the post-page logic can share the serviceMeta lookup.
      primaryService: z.enum(serviceSlugs),

      // The primary keyword the article is built to rank for. Not rendered
      // on-page; used by automation (cron, audits) to detect duplicates and
      // measure GSC performance after deploy.
      targetKeyword: z.string(),

      // Supporting keywords / semantic variants. Optional but recommended.
      secondaryKeywords: z.array(z.string()).default([]),

      // Cross-service tagging. Drives "related services" rail at the bottom
      // of the post in addition to `primaryService`. Distinct from
      // primaryService — an article can be primarily about MVP-to-production
      // but secondarily relevant to AI engineering.
      relatedServices: z.array(z.enum(serviceSlugs)).default([]),

      // Same convention as case-studies: heroImage path under /public/images/.
      // Prefer .webp at /images/articles/<slug>.webp.
      heroImage: z.string().optional(),
      heroImageAlt: z.string().optional(),

      // Override OG image (defaults to heroImage, then to /images/og-image.png).
      ogImage: z.string().optional(),

      // Inline attribution (defaults to Loren as founder + editor of record).
      author: z.string().default("Loren Anderson, Founder"),
      authorLink: z
        .string()
        .url()
        .refine((v) => /^https?:\/\//i.test(v), {
          message: "authorLink must use http(s) protocol",
        })
        .optional(),

      // Surface this article on the /articles/ landing page as featured.
      featured: z.boolean().default(false),

      // Draft toggle. When true, the post page still builds (so previews work)
      // but the article is excluded from the /articles/ index and from
      // related-rails on service pages. NOT excluded from sitemap by default
      // — set sitemap exclusion separately in astro.config.mjs if needed.
      draft: z.boolean().default(false),
    })
    .strict()
    .refine(
      (data) => data.heroImage === undefined || data.heroImageAlt !== undefined,
      {
        message:
          "heroImageAlt is required when heroImage is set (accessibility + SEO).",
        path: ["heroImageAlt"],
      },
    ),
});

export const collections = { resumes, caseStudies, articles };
