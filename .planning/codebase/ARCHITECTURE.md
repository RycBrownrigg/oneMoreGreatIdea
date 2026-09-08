<!-- refreshed: 2026-09-08 -->
# Architecture

**Analysis Date:** 2026-09-08

All paths are relative to `themes/lumio/` (the actual Astro project root), not the git repo root.

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Config Generation                         │
│  src/config/config.toml → scripts/toml-watcher.mjs →         │
│  .astro/config.generated.json                                 │
└──────────────────────────┬────────────────────────────────────┘
                            │ imported by
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Astro Config & Content Layer                    │
│  astro.config.mjs   `src/content.config.ts`                  │
│  (i18n locales, integrations, markdown plugins,               │
│   content collection schemas/loaders)                         │
└──────────────────────────┬────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐  ┌───────────────────────────────┐
│   Content Collections      │  │   Pages (file-based routing)  │
│  `src/content/*/english`   │  │  `src/pages/[...lang]/*.astro`│
│  `src/content/*/french`    │  │  `src/pages/404.astro`        │
│  (md/mdx frontmatter)      │  │  `src/pages/robots.txt.ts`    │
└──────────────┬──────────────┘  └───────────────┬────────────────┘
               │  queried via astro:content        │ renders via
               ▼                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  Layouts & Components                        │
│  `src/layouts/Base.astro` (shell)                             │
│  `src/layouts/components/*` (sections, cards, widgets, seo,   │
│   social, global, utilities)                                  │
│  `src/layouts/shortcodes/*` (auto-imported MD/MDX shortcodes) │
│  `src/layouts/helpers/*` (Icons, SocialIcon)                  │
└──────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           Shared Utilities & Assets                          │
│  `src/lib/utils/*` (i18nUtils, FormHandle, fonts, remark)     │
│  `src/assets/images/*` (Astro-optimized image imports)        │
│  `public/*` (unprocessed static assets served as-is)          │
└──────────────────────────┬────────────────────────────────────┘
                            │ astro build
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Static Output: `dist/` → rsync → VPS (135.148.61.99)         │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Config generation | Compiles TOML site config into JSON consumed at build time | `scripts/toml-watcher.mjs` |
| Content collections | Defines Zod schemas + glob loaders for every content type (blog, services, case-studies, pages, team, testimonial, etc.) | `src/content.config.ts` |
| Sections schema | Shared Zod schema for homepage/landing "sections" blocks (hero, features, CTA, etc.) reused by `page` schema | `src/sections.schema.ts` |
| i18n routing | Resolves locale-aware URLs, determines enabled languages, strips/adds locale prefixes | `src/lib/utils/i18nUtils.ts` |
| Base layout | Root HTML shell — head, header, footer, global scripts | `src/layouts/Base.astro` |
| Section components | Homepage/landing page building blocks (hero banners, testimonials, features) | `src/layouts/components/sections/*` |
| Card components | List-item renderers for collections (blog cards, case-study cards) | `src/layouts/components/cards/*` |
| Widget components | Interactive/standalone features: contact form, comment form, search, global scripts | `src/layouts/components/widgets/*` |
| Shortcodes | Auto-imported components usable directly inside Markdown/MDX bodies | `src/layouts/shortcodes/*` |
| Dynamic routing pages | `[...lang]` catch-all segment resolves locale; `[single]`, `[page]`, `[slug]`, `[category]` resolve collection entries and pagination | `src/pages/[...lang]/**` |
| Form handling | Client-side form submission logic (contact/comment forms → formsubmit.co) | `src/lib/utils/FormHandle.ts` |

## Pattern Overview

**Overall:** Astro content-collection-driven static site generator with file-based, locale-prefixed dynamic routing. No client-side framework (React/Vue/Svelte) is used — interactivity comes from vanilla JS/TS utilities and Preline UI's Web Components-style JS behaviors layered onto server-rendered HTML.

**Key Characteristics:**
- Fully static output (`astro build` → `dist/`), no SSR adapter configured
- Single source of truth for site-wide settings is `src/config/config.toml`, compiled to JSON and imported by both `astro.config.mjs` and `src/content.config.ts`
- Content is organized by type-then-locale: `src/content/<type>/<language>/*.md(x)` (e.g. `src/content/blog/english/post-10.md`, `src/content/blog/french/...`)
- Collection folder names are configurable via `config.toml` (`servicesFolder`, `blogFolder`, `caseStudiesFolder`) and both the configured name and hardcoded canonical name (`blog`, `services`, `case-studies`/`portfolio`) are registered in `collections` export for compatibility
- Shared `page` (and `basePage`) Zod schema is extended per collection type, giving consistent SEO/metadata fields (`metaTitle`, `robots`, `canonical`, `excludeFromSitemap`, etc.) across all content types

## Layers

**Configuration Layer:**
- Purpose: Centralize site settings, SEO defaults, feature toggles, contact info
- Location: `src/config/config.toml`, generated `.astro/config.generated.json`
- Depends on: nothing
- Used by: `astro.config.mjs`, `src/content.config.ts`, most layout components (via generated JSON import)

**Content Layer:**
- Purpose: Author-facing Markdown/MDX content with typed frontmatter
- Location: `src/content/**`
- Contains: blog posts, case studies, services, pages, team bios, testimonials, FAQ, pricing, homepage sections
- Depends on: schemas defined in `src/content.config.ts` and `src/sections.schema.ts`
- Used by: routing pages via `getCollection()`/`getEntry()` (Astro Content Layer API)

**Routing Layer:**
- Purpose: Map URLs (including locale prefixes) to rendered pages
- Location: `src/pages/[...lang]/**`, `src/pages/404.astro`, `src/pages/robots.txt.ts`
- Depends on: content collections, `src/lib/utils/i18nUtils.ts`
- Used by: Astro's build-time static path generation (`getStaticPaths`)

**Presentation Layer:**
- Purpose: Reusable UI building blocks
- Location: `src/layouts/**`
- Contains: layouts, section components, cards, widgets, shortcodes, helpers
- Depends on: content entry data, `src/lib/utils/*`, Tailwind classes
- Used by: routing pages

**Utility Layer:**
- Purpose: Cross-cutting logic not tied to a specific component
- Location: `src/lib/utils/*`
- Contains: i18n URL resolution, font generation, form handling, remark plugin for content parsing
- Used by: `astro.config.mjs`, layouts, tests

## Data Flow

### Primary Request Path (static build)

1. `astro.config.mjs` imports `.astro/config.generated.json` (produced from `src/config/config.toml`) to configure i18n locales, sitemap, integrations
2. `src/content.config.ts` defines collections with `glob()` loaders pointing at `src/content/<folder>` for each content type, validated by Zod schemas
3. A routing page such as `src/pages/[...lang]/blog/[single].astro` calls `getStaticPaths()`, iterating the `blog` collection to generate one static route per post per enabled locale
4. The page renders `src/layouts/components/BlogSinglePageLayout.astro` (or similar), which composes `src/layouts/Base.astro` plus various section/card/widget components
5. Content body (Markdown/MDX) is rendered through Astro's content renderer, passing through `remarkParseContent` and `remarkToc` (remark) and `rehypeExternalLinks` (rehype) as configured in `astro.config.mjs`

### i18n Resolution Flow

1. Enabled languages are computed in `src/lib/utils/i18nUtils.ts` (`enabledLanguages`) from `config.toml`'s `settings.multilingual` block (`disableLanguages`, `defaultLanguage`, `showDefaultLangInUrl`)
2. `astro.config.mjs` passes `enabledLanguages` and `defaultLanguage` into Astro's built-in `i18n` config, with `routing.prefixDefaultLocale` controlled by `showDefaultLangInUrl`
3. At request/build time, `[...lang]` catch-all segments in `src/pages` resolve the active locale; `getLocaleUrlCTM` (tested in `src/__tests__/getLocalUrlCTM.test.ts`) computes locale-correct URLs for links/canonical tags
4. Currently `disableLanguages = ["fr"]` in `src/config/config.toml`, so French content exists in the repo (`src/content/*/french/*`, `src/i18n/fr.json`) but is not routed/rendered — see CONCERNS.md

**State Management:**
- No client-side app state management framework is used; state is limited to DOM-level interactivity (Preline UI components, AOS scroll animations, Swiper carousels) initialized via `src/layouts/components/widgets/GlobalScripts.astro`

## Key Abstractions

**Content Collection Schema (`page`):**
- Purpose: Common frontmatter contract (title, SEO fields, draft flag, sections) shared by pages, services, blog, case-studies
- Examples: `src/content.config.ts` (`basePage`, `page`)
- Pattern: Zod `.extend()` composition — each collection extends `page` with type-specific fields (e.g. blog adds `readTime`, `featured`, `options.layout`; case-studies add `images`, `projectDetails`, `information`)

**Sections Schema:**
- Purpose: Reusable schema for homepage/landing-page "blocks" (banner, features, testimonials, CTA)
- Examples: `src/sections.schema.ts` (893 lines — the largest schema file in the project)
- Pattern: Composed into `page` schema via `sectionsSchema.shape`

**Shortcodes:**
- Purpose: Give Markdown/MDX authors access to rich components (`Accordion`, `Tabs`, `Card`, `CardGrid`, `Testimonial`, `Notice`, `VideoInline`, `ImageList`) without manual imports
- Examples: `src/layouts/shortcodes/*.astro`
- Pattern: Registered globally via `AutoImport` integration in `astro.config.mjs`

## Entry Points

**Dev/Build Scripts:**
- Location: `package.json` `scripts` (`dev`, `build`, `preview`)
- Triggers: `npm run dev` / `npm run build` from `themes/lumio/`
- Responsibilities: run `toml:watch` to regenerate config JSON, then invoke `astro dev`/`astro build`, then (for build/preview) `remove-draft-from-sitemap`

**Home Page:**
- Location: `src/pages/[...lang]/index.astro` (plus alternate homepage variants `home-two.astro`, `home-three.astro`)
- Triggers: request to `/` (or `/en/`, `/fr/` if enabled)

**Sitemap/Robots:**
- Location: `src/pages/robots.txt.ts`, `@astrojs/sitemap` integration + `scripts/remove-draft-from-sitemap.mjs`
- Responsibilities: generate `robots.txt` and post-process `sitemap.xml` to exclude draft-flagged content after build

## Architectural Constraints

- **Threading:** Single-threaded Node build process; no worker threads used. `toml-watcher.mjs` runs concurrently with `astro dev` via `&` in the `dev` npm script (not a true worker — just parallel shell processes).
- **Global state:** `.astro/config.generated.json` acts as a build-time global singleton config, imported directly (not via a context/provider) by `astro.config.mjs`, `src/content.config.ts`, and likely several layout components. Any consumer must ensure `toml:watch` has run at least once, or the import fails.
- **Circular imports:** None detected during exploration.
- **Content loader trusts .mdx uniformly:** The generic `contentLoader()` glob pattern (`**/[^_]*.{md,mdx}`) in `src/content.config.ts` applies identically to every collection, including `blog` and `case-studies`. Per known project history, `.mdx` files can trigger `UnknownContentCollectionError` under this Astro 6 setup with deferred rendering — yet case-study content (`case-study-1.mdx` through `case-study-6.mdx`) and several legacy blog posts (`post-1.mdx` through `post-9.mdx`) are still `.mdx`. See CONCERNS.md.

## Anti-Patterns

### Duplicate Collection Registration

**What happens:** `src/content.config.ts` registers each configurable collection under both its `config.toml`-driven folder name and a hardcoded canonical alias (e.g. `[blogFolder]: blogCollection, blog: blogCollection`; case-studies registered three ways as `[caseStudiesFolder]`, `"case-studies"`, and `portfolio`).
**Why it's wrong:** If `blogFolder`/`caseStudiesFolder`/`servicesFolder` in `config.toml` were ever changed from their defaults, this would silently create two live collections backed by the same files, and any code calling `getCollection("blog")` vs `getCollection(blogFolder)` could diverge if the folder name changes but call sites aren't updated everywhere.
**Do this instead:** Since this project always uses the default folder names (`blog`, `services`, `case-studies`), treat the folder-name settings in `config.toml` as effectively fixed; do not rename them without auditing every `getCollection()` call site.

### Mixed .md/.mdx Content Within the Same Collection

**What happens:** Blog collection mixes `.md` (post-10, post-11, post-12, and the `-index.md` listing page) with `.mdx` (post-1 through post-9); case-studies collection is entirely `.mdx`.
**Why it's wrong:** Per established project knowledge (see memory: "New blog posts must be .md; .mdx causes UnknownContentCollectionError in Astro 6 deferred-render"), `.mdx` is a known source of build/runtime errors in this setup, yet 9 legacy blog posts and all 6 case studies remain `.mdx`.
**Do this instead:** New content should always be authored as `.md`. Existing `.mdx` files should be migrated to `.md` (dropping any JSX/component usage that required MDX) opportunistically, prioritizing the case-studies collection since it is 100% `.mdx` today.

## Error Handling

**Strategy:** Primarily build-time validation via Zod schemas in content collections — malformed frontmatter fails the Astro build rather than being caught at runtime.

**Patterns:**
- Optional fields default to `undefined` and are conditionally rendered in templates (heavy use of `.optional()` in `src/content.config.ts` and `src/sections.schema.ts`)
- `draft: true` frontmatter flag is used to hide content from the sitemap post-build (`scripts/remove-draft-from-sitemap.mjs`) rather than excluding it from routing entirely — draft pages are still built and reachable by direct URL (see CONCERNS.md)

## Cross-Cutting Concerns

**Logging:** No structured logging framework; relies on Astro/Vite's built-in dev/build console output.
**Validation:** Zod schemas in `src/content.config.ts` and `src/sections.schema.ts` validate all content frontmatter at build time.
**SEO:** Centralized per-page metadata fields on the shared `page` schema (`metaTitle`, `metaDescription`, `robots`, `canonical`, `excludeFromSitemap`, `keywords`), rendered by components under `src/layouts/components/seo/`.
**Forms:** Contact and comment forms POST to `formsubmit.co` (configured via `contactFormAction` in `config.toml`), handled client-side by `src/lib/utils/FormHandle.ts`.

---

*Architecture analysis: 2026-09-08*
