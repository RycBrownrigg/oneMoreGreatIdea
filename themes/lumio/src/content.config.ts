import config from ".astro/config.generated.json";
import { defineCollection } from "astro:content";
import { button, sectionsSchema } from "./sections.schema";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const caseStudiesFolder = config.settings.caseStudiesFolder || "case-studies";
const blogFolder = config.settings.blogFolder || "blog";
const servicesFolder = config.settings.servicesFolder || "services";

const contentLoader = (base: string) =>
  glob({ pattern: "**/[^_]*.{md,mdx}", base });

// ------------------------
// Base Page Schema
// ------------------------
const basePage = z.object({
  title: z.string(),
  breadcrumbTitle: z.string().optional(),
  author: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  date: z.date().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  weight: z.number().optional(),
  draft: z.boolean().optional(),
  button: button.optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  robots: z.string().optional(),
  excludeFromSitemap: z.boolean().optional(),
  excludeFromCollection: z.boolean().optional(),
  customSlug: z.string().optional(),
  canonical: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  disableTagline: z.boolean().optional(),
});

export const page = basePage.extend(sectionsSchema.shape);

// ------------------------
// Marquee Schema
// ------------------------
export const marqueeConfig = z.object({
  elementWidth: z.string(),
  elementWidthAuto: z.boolean(),
  elementWidthInSmallDevices: z.string(),
  pauseOnHover: z.boolean(),
  reverse: z.enum(["reverse", ""]).optional(),
  duration: z.string(),
});

// ------------------------
// Collections
// ------------------------

// Pages
const pagesCollection = defineCollection({
  loader: contentLoader("./src/content/pages"),
  schema: page,
});

// Services
const serviceCollection = defineCollection({
  loader: contentLoader(`./src/content/${servicesFolder}`),
  schema: page.extend({
    icon: z.string().optional(),
    imagePosition: z.string().optional(),
    image3: z.string().optional(),
  }),
});

// Blog
const blogCollection = defineCollection({
  loader: contentLoader(`./src/content/${blogFolder}`),
  schema: page.extend({
    readTime: z.string().optional(),
    comments: z.number().optional(),
    featured: z.boolean().optional(),
    excerpt: z.string().optional(),
    settings: z
      .object({
        card: z
          .object({
            layout: z
              .enum(["horizontal", "card", "rounded", "compact"])
              .optional(),
            theme: z.enum(["light", "dark"]).optional(),
          })
          .optional(),
      })
      .optional(),
    single: z
      .object({
        video: z
          .object({
            enable: z.boolean().optional(),
            src: z.string().optional(),
          })
          .optional(),
        downloads: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),
    options: z
      .object({
        layout: z
          .enum(["grid", "creative", "horizontal", "overlay"])
          .optional(),
        appearance: z.enum(["dark", "light"]).optional(),
        columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
        limit: z.union([z.number().int(), z.literal(false)]).optional(),
      })
      .optional(),
  }),
});

// Portfolio
const portfolioCollection = defineCollection({
  loader: contentLoader(`./src/content/${caseStudiesFolder}`),
  schema: page.extend({
    images: z.array(z.string()).min(1).optional(),
    imageBanner: z.string().optional(),
    projectDetails: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
    options: z
      .object({
        layout: z.enum(["masonry", "grid", "full-width", "slider"]),
        appearance: z.enum(["dark", "light"]).optional(),
        limit: z.union([z.number().int(), z.literal(false)]).optional(),
      })
      .optional(),
    information: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  }),
});

// Team
export const teamCollection = defineCollection({
  loader: contentLoader("./src/content/team"),
  schema: page.extend({
    image: z.string().optional(),
    profession: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    social: z
      .array(
        z.object({
          enable: z.boolean(),
          label: z.string(),
          icon: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
    list: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          image: z.string(),
          status: z.string(),
          social: z.object({
            enable: z.boolean(),
            list: z.array(
              z.object({
                enable: z.boolean(),
                label: z.string(),
                icon: z.string(),
                url: z.string(),
              }),
            ),
          }),
        }),
      )
      .optional(),
  }),
});

// Testimonials
const testimonialItem = z.object({
  enable: z.boolean(),
  content: z.string(),
  customer: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
  }),
});

const testimonialCollection = defineCollection({
  loader: contentLoader("./src/content/testimonial"),
  schema: page.extend({
    list: z.array(testimonialItem).optional(),
    listHome2: z.array(testimonialItem).optional(),
    listHome3: z.array(testimonialItem).optional(),
  }),
});

// ------------------------
// Export Collections
// ------------------------
export const collections = {
  [blogFolder]: blogCollection,
  blog: blogCollection,

  [servicesFolder]: serviceCollection,
  services: serviceCollection,

  [caseStudiesFolder]: portfolioCollection,
  "case-studies": portfolioCollection,
  portfolio: portfolioCollection,

  pages: pagesCollection,
  team: teamCollection,

  sections: defineCollection({
    loader: contentLoader("./src/content/sections"),
  }),

  homepage: defineCollection({
    loader: contentLoader("./src/content/homepage"),
  }),

  about: defineCollection({
    loader: contentLoader("./src/content/about"),
  }),

  contact: defineCollection({
    loader: contentLoader("./src/content/contact"),
  }),

  faq: defineCollection({
    loader: contentLoader("./src/content/faq"),
  }),

  pricing: defineCollection({
    loader: contentLoader("./src/content/pricing"),
  }),

  author: defineCollection({
    loader: contentLoader("./src/content/author"),
  }),

  testimonial: testimonialCollection,

  features: defineCollection({
    loader: contentLoader("./src/content/features"),
  }),

  widgets: defineCollection({
    loader: contentLoader("./src/content/widgets"),
  }),
};
