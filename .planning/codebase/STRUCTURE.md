# Codebase Structure

**Analysis Date:** 2026-09-08

**Note:** The Astro project root is `themes/lumio/`, not the git repo root. All paths below are relative to `themes/lumio/` unless prefixed otherwise.

## Directory Layout

```
lumio2/                              # git repo root
├── headshots/                       # standalone image assets (not used by Astro build directly)
├── Images/                          # standalone image assets
├── Resume - Ryc Brownrigg Master.md # personal resume, not part of the site build
├── changelog.html, documentation.html  # static stub files from theme template
├── .github/workflows/ci.yml         # GitHub Actions: astro check + tests on push/PR (v1.1; unused legacy deploy configs removed, TECHDEBT-07)
└── themes/lumio/                    # ACTUAL Astro project root
    ├── astro.config.mjs             # Astro integrations, i18n, markdown pipeline
    ├── package.json                 # scripts, dependencies
    ├── tsconfig.json                # strict TS config, path aliases
    ├── scripts/                     # Node build-time scripts (toml-watcher, favicon gen, sitemap cleanup)
    ├── src/
    │   ├── config/config.toml       # single source of truth for site settings
    │   ├── content.config.ts        # collection schemas + loaders (astro:content)
    │   ├── sections.schema.ts       # shared Zod schema for landing-page section blocks
    │   ├── content/                 # Markdown/MDX content, organized <type>/<language>/
    │   │   ├── blog/english|french/
    │   │   ├── case-studies/english|french/
    │   │   ├── services/english|french/
    │   │   ├── pages/, about/, contact/, faq/, pricing/, team/, testimonial/,
    │   │   │   author/, features/, homepage/, sections/, widgets/
    │   ├── pages/                   # file-based routing
    │   │   ├── [...lang]/           # locale-aware catch-all routes
    │   │   ├── 404.astro
    │   │   └── robots.txt.ts
    │   ├── layouts/
    │   │   ├── Base.astro           # root HTML shell
    │   │   ├── components/          # sections, cards, widgets, seo, social, global, utilities
    │   │   ├── shortcodes/          # Markdown/MDX auto-imported components
    │   │   └── helpers/             # Icons, SocialIcon
    │   ├── lib/utils/               # i18n, form handling, font generation, remark plugin
    │   ├── i18n/                    # en.json, fr.json translation strings
    │   ├── assets/images/           # Astro-optimized (imported) images, organized by feature area
    │   ├── styles/                  # global CSS / Tailwind entry
    │   ├── types/                   # shared TS types
    │   ├── plugins/odometer/        # third-party plugin vendored in-repo
    │   └── __tests__/               # Jest tests (currently one file)
    └── public/                      # unprocessed static assets served as-is (favicons, videos, umami.is.js, .htaccess)
```

## Directory Purposes

**`src/content/<type>/<language>/`:**
- Purpose: All authored site content (blog posts, case studies, service pages, static pages, team bios, etc.)
- Contains: `.md` and `.mdx` files with frontmatter validated against schemas in `src/content.config.ts`
- Key files: each collection has an `-index.md` (or similar) controlling the listing page's own metadata

**`src/pages/[...lang]/`:**
- Purpose: Locale-aware file-based routes; the `[...lang]` segment is Astro's catch-all for resolving the active locale
- Contains: static route files (`about.astro`, `contact.astro`, `pricing.astro`, `faq.astro`, `team.astro`) and dynamic route files (`[page].astro`, `blog/[single].astro`, `case-studies/[single].astro`, `services/[single].astro`, pagination routes `page/[slug].astro`)

**`src/layouts/components/`:**
- Purpose: All reusable UI building blocks, subdivided by role
- `sections/`: large landing-page blocks (hero banners, testimonial sections, feature grids)
- `cards/`: list-item renderers (`BlogCard.astro`, case-study cards)
- `widgets/`: interactive/standalone features (`ContactForm.astro`, `CommentForm.astro`, `Search.astro`, `GlobalScripts.astro`)
- `seo/`: metadata/head tag components
- `social/`: social sharing/icon components (`Social.astro`)
- `global/header/`: navigation, `MegaMenu.astro`
- `utilities/`: small shared helper components

**`src/layouts/shortcodes/`:**
- Purpose: Components registered via `AutoImport` in `astro.config.mjs`, usable directly inside Markdown/MDX bodies without explicit import statements
- Contains: `Accordion.astro`, `Tabs.astro`/`Tab.astro`, `Card.astro`, `CardGrid.astro`, `Notice.astro`, `Testimonial.astro`, `VideoInline.astro`, `ImageList.astro`/`ImageItem.astro`, `InfoBlockList.astro`/`InfoBlockItem.astro`

**`src/lib/utils/`:**
- Purpose: Cross-cutting non-component logic
- Key files: `i18nUtils.ts` (locale resolution, tested via `src/__tests__/getLocalUrlCTM.test.ts`), `FormHandle.ts` (form validation/reset, marked `@ts-nocheck`), `AstroFont.ts` / `downloadSelfHostedFonts.ts` (font self-hosting pipeline), `remarkParseContent.ts` (custom remark plugin)

**`scripts/`:**
- Purpose: Node.js build-time automation, run outside the Vite/Astro pipeline via npm scripts
- Key files: `toml-watcher.mjs` (compiles `config.toml` → `.astro/config.generated.json`; watches for changes in dev), `remove-draft-from-sitemap.mjs` (post-build sitemap cleanup), `generate-favicons.mjs`, `remove-multilingual.mjs`, `generate-multilingual-content.mjs`

**`public/`:**
- Purpose: Static files served verbatim, not processed by Astro's asset pipeline
- Contains: `images/favicons/`, `plyr/` (video player library), `videos/`, `umami.is.js` (self-hosted analytics script), `.htaccess`

**`.astro/` (gitignored):**
- Purpose: Astro's generated cache/types directory
- Generated: Yes (includes `config.generated.json`, the compiled TOML config, and image cache)
- Committed: No

## Key File Locations

**Entry Points:**
- `src/pages/[...lang]/index.astro`: homepage
- `astro.config.mjs`: build/integration configuration
- `package.json`: npm scripts (`dev`, `build`, `preview`)

**Configuration:**
- `src/config/config.toml`: site title, SEO, contact info, feature toggles, i18n settings
- `tsconfig.json`: path aliases (`@/components/*`, `@/shortcodes/*`, `@/helpers/*`, `@/*`)

**Core Logic:**
- `src/content.config.ts`: collection definitions and Zod schemas
- `src/sections.schema.ts`: landing-page section block schema (largest file in the codebase, 893 lines)
- `src/lib/utils/i18nUtils.ts`: locale/URL resolution logic

**Testing:**
- `src/__tests__/getLocalUrlCTM.test.ts`: only existing test, covers i18n URL resolution

## Naming Conventions

**Files:**
- Astro components: PascalCase (`BlogCard.astro`, `ContactForm.astro`, `GlobalScripts.astro`)
- Utility/lib files: camelCase (`i18nUtils.ts`, `remarkParseContent.ts`)
- Content files: kebab-case with numeric suffixes for series content (`post-10.md`, `case-study-3.mdx`)
- Listing/index content files: `-index.md` (leading dash, excluded from collection item iteration by the glob pattern `**/[^_]*.{md,mdx}` — note the pattern excludes underscore-prefixed files, not dash-prefixed; `-index.md` files are still included as regular entries and rely on being filtered elsewhere or treated as the collection's list-page metadata)

**Directories:**
- Content collections: lowercase, singular-or-plural matching Astro collection name (`blog`, `services`, `case-studies`, `team`, `testimonial`)
- Locale subdirectories: full language name, not ISO code (`english/`, `french/` — contrast with `src/i18n/en.json`, `src/i18n/fr.json` which do use ISO codes)

## Where to Add New Code

**New Blog Post:**
- Add a `.md` file (NOT `.mdx`) under `src/content/blog/english/`, following the `postN.md` naming pattern and the frontmatter shape of `post-12.md` (the most recent working example)

**New Case Study:**
- Add under `src/content/case-studies/english/case-study-N.mdx` — note existing case studies use `.mdx`; consider migrating to `.md` per the known MDX-breakage issue rather than perpetuating it in new content

**New Service Page:**
- Add under `src/content/services/english/service-N.mdx` (same `.mdx` caveat applies)

**New Section Component:**
- Implementation: `src/layouts/components/sections/`
- Register any new frontmatter fields it needs in `src/sections.schema.ts`

**New Shortcode (for use inside Markdown/MDX):**
- Implementation: `src/layouts/shortcodes/`
- Registration: add the import path to the `AutoImport` integration's `imports` array in `astro.config.mjs`

**New Utility:**
- Shared helpers: `src/lib/utils/`

**New Route:**
- Static route: add `<name>.astro` under `src/pages/[...lang]/`
- Dynamic/collection-backed route: follow the `[single].astro` + `getStaticPaths()` pattern used by `blog/`, `case-studies/`, `services/`

## Special Directories

**`.astro/`:**
- Purpose: Astro-generated types and compiled config JSON
- Generated: Yes
- Committed: No

**`dist/`:**
- Purpose: Static build output, deployed via rsync to the production VPS
- Generated: Yes
- Committed: No

**`node_modules/.astro/`:**
- Purpose: Astro's image transformation cache
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-09-08*
