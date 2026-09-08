<!-- GSD:project-start source:PROJECT.md -->

## Project

**Ryc Brownrigg Consulting Site**

Ryc Brownrigg's personal consulting website, built on the Lumio Astro theme, presenting him as a "Principal OTT, Web3 and AI Architect" available for consulting engagements. It's live at onemoregreatidea.com and showcases services, real project case studies (InkTix, CCRMS, HorizonGo, Vongo), and a blog. This GSD project covers finishing the remaining pre-launch/launch-quality work rather than building the site from scratch — the core site is already live.

**Core Value:** The site must credibly present Ryc as a hireable consulting authority and reliably capture contact-form leads — if a prospective client can't find the right domain, doesn't trust the content (placeholder testimonials, broken case studies), or the contact form fails, nothing else about the site matters.

### Constraints

- **Content format**: New blog posts must be `.md`, never `.mdx` — `.mdx` triggers `UnknownContentCollectionError` in this Astro 6 deferred-render setup (this is also *why* legacy `.mdx` content is being migrated, not just newly avoided)
- **Tech stack**: Astro 6, Tailwind CSS v4, Preline UI, Node >=22.12.0 — no framework changes in scope
- **Deployment**: Static build only, deployed via manual rsync to the VPS at 135.148.61.99 — no server runtime, no Netlify/Cloudflare Pages despite their config files existing in the repo
- **Domain**: `baseUrl` in `config.toml` can only hold one canonical value at a time, but the same static build is meant to serve onemoregreatidea.com, askryc.com, askryc.mt, and askryc.net — the domain decision blocks any final baseUrl/cert work

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Repo Layout Note

## Languages

- TypeScript 5.9 (strict mode via `astro/tsconfigs/strict`) - config, utils, schemas (`src/lib/`, `src/content.config.ts`, `src/sections.schema.ts`)
- Astro component syntax (`.astro`) - all UI/layout components (`src/layouts/`, `src/pages/`)
- Markdown / MDX - content collections (`src/content/**/*.md`, `*.mdx`)
- TOML - central site configuration (`src/config/config.toml`)

## Runtime

- Node.js >=22.12.0 (`package.json` `engines`)
- npm (scripts assume `npm run ...`); `pnpm.overrides` block also present in `package.json`, suggesting pnpm may be used interchangeably
- Lockfile: not confirmed present at time of scan (check `themes/lumio/package-lock.json` or `pnpm-lock.yaml` before assuming which manager is canonical)

## Frameworks

- Astro 6.1 (`astro`) - static site generator, content collections, i18n routing
- Tailwind CSS 4.2 (`tailwindcss`, `@tailwindcss/vite`) - utility-first styling, Vite-native integration (no separate `tailwind.config.js`)
- Preline UI 4.1 (`preline`, `@preline/*` accordion/dropdown/overlay/select/tabs) - interactive UI primitives layered on Tailwind
- Jest 30 (`jest`, `ts-jest`, `cross-env TS_NODE_PROJECT=./tsconfig.jest.json`) - only one test file exists: `src/__tests__/getLocalUrlCTM.test.ts`
- `@astrojs/check` - `astro check` type/diagnostics command
- `@astrojs/mdx` - enables `.mdx` content authoring (see CONCERNS.md re: known breakage)
- `@astrojs/sitemap` - sitemap generation, gated by `seo.sitemap.enable` in `config.toml`
- `sharp` - image optimization used by Astro's image pipeline
- Custom Node scripts in `scripts/` (see below)

## Key Dependencies

- `astro-auto-import` - auto-imports shortcodes/components (`Button`, `Accordion`, `Notice`, `Tabs`, `Card`, etc.) declared in `astro.config.mjs`, avoiding manual imports in Markdown/MDX
- `gray-matter` - frontmatter parsing (used by scripts, not the Astro content pipeline itself)
- `marked` - Markdown-to-HTML rendering outside the Astro content collection pipeline (e.g. dynamic content)
- `motion` (Framer Motion successor) - animation
- `aos` - scroll-triggered animations
- `swiper` - carousels/sliders
- `smoothscroll-for-websites` - smooth scroll polyfill
- `lucide` - icon set
- `toml` - parses `src/config/config.toml` into JSON at build/dev time via `scripts/toml-watcher.mjs`
- `slugify` - slug generation for routes
- `xml2js` - used by sitemap post-processing (`scripts/remove-draft-from-sitemap.mjs`)
- `rehype-external-links`, `remark-toc`, `unist-util-visit` - Markdown/MDX pipeline plugins configured in `astro.config.mjs`

## Configuration

- `.env` / `.env.production` are gitignored (`.gitignore` lines `themes/lumio/.env`, `themes/lumio/.env.production`) but were not present in the working tree at scan time — no runtime secrets currently required for a static build
- Central config: `themes/lumio/src/config/config.toml` (site title, SEO, contact info, feature toggles, multilingual settings) — see below
- A custom pre-build/pre-dev step (`npm run toml:watch`, backed by `themes/lumio/scripts/toml-watcher.mjs`) compiles `config.toml` → `themes/lumio/.astro/config.generated.json`, which `astro.config.mjs` and `src/content.config.ts` both import directly. This generated JSON file must exist before `astro dev`/`astro build` run correctly (the `dev`/`build`/`preview` npm scripts all invoke `toml:watch` first for this reason).
- `themes/lumio/astro.config.mjs` - Astro integrations (sitemap, MDX, AutoImport), i18n locales, markdown plugin pipeline, fonts
- `themes/lumio/tsconfig.json` - strict TS, path aliases (`@/components/*` → `src/layouts/components/*`, `@/shortcodes/*` → `src/layouts/shortcodes/*`, `@/helpers/*` → `src/layouts/helpers/*`, `@/*` → `src/*`)
- `themes/lumio/.prettierrc` - Prettier with `prettier-plugin-astro`, `prettier-plugin-toml`, `prettier-plugin-tailwindcss`; Astro files use `bracketSameLine: true`, `htmlWhitespaceSensitivity: ignore`
- `themes/lumio/netlify.toml`, `themes/lumio/wrangler.toml` - present but deployment is actually via rsync to a VPS (135.148.61.99), not Netlify/Cloudflare Pages — these config files appear to be unused legacy/optional deploy targets from the Lumio theme template

## Platform Requirements

- Node >=22.12.0
- Run from `themes/lumio/` directory (not repo root): `npm run dev`
- Dev server auto-selects a free port starting at 4321
- Static output only: `npm run build` (from `themes/lumio/`) produces `themes/lumio/dist/`
- No server runtime required — output is deployed via rsync to a VPS and served as static files (not using the `netlify.toml`/`wrangler.toml` targets present in the repo)
- `npm run build` also runs `remove-draft-from-sitemap` script to strip draft-flagged content from `sitemap.xml` post-build

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Astro components: PascalCase, e.g. `BlogCard.astro`, `ContactForm.astro`, `HomeBannerThree.astro`
- Utility/lib modules: camelCase, e.g. `i18nUtils.ts`, `remarkParseContent.ts`, `downloadSelfHostedFonts.ts`
- Content files: kebab-case with numeric suffix for series, e.g. `post-10.md`, `case-study-3.mdx`, `service-2.mdx`
- camelCase, verb-led, e.g. `formReset`, `getLocaleUrlCTM`, `generateAstroFontsConfig`
- camelCase; destructured config access is common, e.g. `let { seo: { sitemap: sitemapConfig }, settings: {...} } = config;` in `astro.config.mjs`
- Zod schema objects use camelCase names ending in no fixed suffix (`basePage`, `page`, `marqueeConfig`), not `Schema`-suffixed — check `src/content.config.ts` for the pattern before introducing new schemas

## Code Style

- Prettier 3.8 (`themes/lumio/.prettierrc`), invoked via `npm run format` (runs `prettier -w ./src`)
- Plugins: `prettier-plugin-astro`, `prettier-plugin-toml`, `prettier-plugin-tailwindcss` (auto-sorts Tailwind class order)
- Astro-file overrides: `bracketSameLine: true`, `htmlWhitespaceSensitivity: "ignore"`, `trailingComma: "all"`
- TOML-file overrides: aligned entries, no aligned comments, 4 allowed blank lines
- No ESLint config found in the project — type-checking via `astro check` (`npm run astro-check`) is the primary static analysis tool
- TypeScript strict mode is enabled (`tsconfig.json` extends `astro/tsconfigs/strict`)

## Import Organization

- `@/components/*` → `src/layouts/components/*`
- `@/shortcodes/*` → `src/layouts/shortcodes/*`
- `@/helpers/*` → `src/layouts/helpers/*`
- `@/*` → `src/*`
- Prefer these aliases over relative paths (`../../../`) when adding new imports in `.astro`/`.ts` files under `src/`
- No enforced import-sorting plugin observed; existing files generally group third-party imports first, then local (`@/...` or relative) imports, e.g. `astro.config.mjs` imports Astro integrations first, then local `src/lib/utils/*` modules, then JSON config files last

## Error Handling

- Content validation errors surface at build time via Zod schema mismatches in `src/content.config.ts` — there is no runtime try/catch pattern for content loading, since Astro's Content Layer API handles this
- Client-side utility code (`src/lib/utils/FormHandle.ts`) uses optional chaining (`form?.reset()`, `select?.setValue()`) defensively rather than explicit null checks or thrown errors
- `FormHandle.ts` is marked `// @ts-nocheck` at the top of the file, opting the whole file out of TypeScript's strict checking — this is an exception to the otherwise-strict codebase (see CONCERNS.md)

## Logging

- No `console.log` conventions enforced; build scripts (`scripts/toml-watcher.mjs`, `scripts/remove-draft-from-sitemap.mjs`) use plain `console.log`/`console.error` for their own status output

## Comments

- JSDoc-style block comments precede exported utility functions explaining intent, e.g. `src/lib/utils/FormHandle.ts`'s `formReset` has a multi-line doc comment describing behavior
- Inline comments are sparse in `.astro` component files; most explanatory context lives in doc comments on utility functions
- Used selectively on utility functions in `src/lib/utils/*`, not enforced project-wide

## Function Design

## Module Design

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

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

- Fully static output (`astro build` → `dist/`), no SSR adapter configured
- Single source of truth for site-wide settings is `src/config/config.toml`, compiled to JSON and imported by both `astro.config.mjs` and `src/content.config.ts`
- Content is organized by type-then-locale: `src/content/<type>/<language>/*.md(x)` (e.g. `src/content/blog/english/post-10.md`, `src/content/blog/french/...`)
- Collection folder names are configurable via `config.toml` (`servicesFolder`, `blogFolder`, `caseStudiesFolder`) and both the configured name and hardcoded canonical name (`blog`, `services`, `case-studies`/`portfolio`) are registered in `collections` export for compatibility
- Shared `page` (and `basePage`) Zod schema is extended per collection type, giving consistent SEO/metadata fields (`metaTitle`, `robots`, `canonical`, `excludeFromSitemap`, etc.) across all content types

## Layers

- Purpose: Centralize site settings, SEO defaults, feature toggles, contact info
- Location: `src/config/config.toml`, generated `.astro/config.generated.json`
- Depends on: nothing
- Used by: `astro.config.mjs`, `src/content.config.ts`, most layout components (via generated JSON import)
- Purpose: Author-facing Markdown/MDX content with typed frontmatter
- Location: `src/content/**`
- Contains: blog posts, case studies, services, pages, team bios, testimonials, FAQ, pricing, homepage sections
- Depends on: schemas defined in `src/content.config.ts` and `src/sections.schema.ts`
- Used by: routing pages via `getCollection()`/`getEntry()` (Astro Content Layer API)
- Purpose: Map URLs (including locale prefixes) to rendered pages
- Location: `src/pages/[...lang]/**`, `src/pages/404.astro`, `src/pages/robots.txt.ts`
- Depends on: content collections, `src/lib/utils/i18nUtils.ts`
- Used by: Astro's build-time static path generation (`getStaticPaths`)
- Purpose: Reusable UI building blocks
- Location: `src/layouts/**`
- Contains: layouts, section components, cards, widgets, shortcodes, helpers
- Depends on: content entry data, `src/lib/utils/*`, Tailwind classes
- Used by: routing pages
- Purpose: Cross-cutting logic not tied to a specific component
- Location: `src/lib/utils/*`
- Contains: i18n URL resolution, font generation, form handling, remark plugin for content parsing
- Used by: `astro.config.mjs`, layouts, tests

## Data Flow

### Primary Request Path (static build)

### i18n Resolution Flow

- No client-side app state management framework is used; state is limited to DOM-level interactivity (Preline UI components, AOS scroll animations, Swiper carousels) initialized via `src/layouts/components/widgets/GlobalScripts.astro`

## Key Abstractions

- Purpose: Common frontmatter contract (title, SEO fields, draft flag, sections) shared by pages, services, blog, case-studies
- Examples: `src/content.config.ts` (`basePage`, `page`)
- Pattern: Zod `.extend()` composition — each collection extends `page` with type-specific fields (e.g. blog adds `readTime`, `featured`, `options.layout`; case-studies add `images`, `projectDetails`, `information`)
- Purpose: Reusable schema for homepage/landing-page "blocks" (banner, features, testimonials, CTA)
- Examples: `src/sections.schema.ts` (893 lines — the largest schema file in the project)
- Pattern: Composed into `page` schema via `sectionsSchema.shape`
- Purpose: Give Markdown/MDX authors access to rich components (`Accordion`, `Tabs`, `Card`, `CardGrid`, `Testimonial`, `Notice`, `VideoInline`, `ImageList`) without manual imports
- Examples: `src/layouts/shortcodes/*.astro`
- Pattern: Registered globally via `AutoImport` integration in `astro.config.mjs`

## Entry Points

- Location: `package.json` `scripts` (`dev`, `build`, `preview`)
- Triggers: `npm run dev` / `npm run build` from `themes/lumio/`
- Responsibilities: run `toml:watch` to regenerate config JSON, then invoke `astro dev`/`astro build`, then (for build/preview) `remove-draft-from-sitemap`
- Location: `src/pages/[...lang]/index.astro` (plus alternate homepage variants `home-two.astro`, `home-three.astro`)
- Triggers: request to `/` (or `/en/`, `/fr/` if enabled)
- Location: `src/pages/robots.txt.ts`, `@astrojs/sitemap` integration + `scripts/remove-draft-from-sitemap.mjs`
- Responsibilities: generate `robots.txt` and post-process `sitemap.xml` to exclude draft-flagged content after build

## Architectural Constraints

- **Threading:** Single-threaded Node build process; no worker threads used. `toml-watcher.mjs` runs concurrently with `astro dev` via `&` in the `dev` npm script (not a true worker — just parallel shell processes).
- **Global state:** `.astro/config.generated.json` acts as a build-time global singleton config, imported directly (not via a context/provider) by `astro.config.mjs`, `src/content.config.ts`, and likely several layout components. Any consumer must ensure `toml:watch` has run at least once, or the import fails.
- **Circular imports:** None detected during exploration.
- **Content loader trusts .mdx uniformly:** The generic `contentLoader()` glob pattern (`**/[^_]*.{md,mdx}`) in `src/content.config.ts` applies identically to every collection, including `blog` and `case-studies`. Per known project history, `.mdx` files can trigger `UnknownContentCollectionError` under this Astro 6 setup with deferred rendering — yet case-study content (`case-study-1.mdx` through `case-study-6.mdx`) and several legacy blog posts (`post-1.mdx` through `post-9.mdx`) are still `.mdx`. See CONCERNS.md.

## Anti-Patterns

### Duplicate Collection Registration

### Mixed .md/.mdx Content Within the Same Collection

## Error Handling

- Optional fields default to `undefined` and are conditionally rendered in templates (heavy use of `.optional()` in `src/content.config.ts` and `src/sections.schema.ts`)
- `draft: true` frontmatter flag is used to hide content from the sitemap post-build (`scripts/remove-draft-from-sitemap.mjs`) rather than excluding it from routing entirely — draft pages are still built and reachable by direct URL (see CONCERNS.md)

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
