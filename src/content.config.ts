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

export const collections = { resumes, caseStudies };
