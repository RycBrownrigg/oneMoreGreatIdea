# Technology Stack

**Analysis Date:** 2026-09-08

## Repo Layout Note

This repository's root (`/Users/ryc/projects/lumio2`) is NOT the Astro project root. All source code, configuration, and build tooling live under `themes/lumio/`. The repo root only holds ancillary assets: `headshots/`, `Images/`, `Resume - Ryc Brownrigg Master.md`, and two static stub HTML files (`changelog.html`, `documentation.html`). All paths below are relative to `themes/lumio/` unless stated otherwise.

## Languages

**Primary:**
- TypeScript 5.9 (strict mode via `astro/tsconfigs/strict`) - config, utils, schemas (`src/lib/`, `src/content.config.ts`, `src/sections.schema.ts`)
- Astro component syntax (`.astro`) - all UI/layout components (`src/layouts/`, `src/pages/`)

**Secondary:**
- Markdown / MDX - content collections (`src/content/**/*.md`, `*.mdx`)
- TOML - central site configuration (`src/config/config.toml`)

## Runtime

**Environment:**
- Node.js >=22.12.0 (`package.json` `engines`)

**Package Manager:**
- npm (scripts assume `npm run ...`); `pnpm.overrides` block also present in `package.json`, suggesting pnpm may be used interchangeably
- Lockfile: not confirmed present at time of scan (check `themes/lumio/package-lock.json` or `pnpm-lock.yaml` before assuming which manager is canonical)

## Frameworks

**Core:**
- Astro 6.1 (`astro`) - static site generator, content collections, i18n routing
- Tailwind CSS 4.2 (`tailwindcss`, `@tailwindcss/vite`) - utility-first styling, Vite-native integration (no separate `tailwind.config.js`)
- Preline UI 4.1 (`preline`, `@preline/*` accordion/dropdown/overlay/select/tabs) - interactive UI primitives layered on Tailwind

**Testing:**
- Jest 30 (`jest`, `ts-jest`, `cross-env TS_NODE_PROJECT=./tsconfig.jest.json`) - only one test file exists: `src/__tests__/getLocalUrlCTM.test.ts`

**Build/Dev:**
- `@astrojs/check` - `astro check` type/diagnostics command
- `@astrojs/mdx` - enables `.mdx` content authoring (see CONCERNS.md re: known breakage)
- `@astrojs/sitemap` - sitemap generation, gated by `seo.sitemap.enable` in `config.toml`
- `sharp` - image optimization used by Astro's image pipeline
- Custom Node scripts in `scripts/` (see below)

## Key Dependencies

**Critical:**
- `astro-auto-import` - auto-imports shortcodes/components (`Button`, `Accordion`, `Notice`, `Tabs`, `Card`, etc.) declared in `astro.config.mjs`, avoiding manual imports in Markdown/MDX
- `gray-matter` - frontmatter parsing (used by scripts, not the Astro content pipeline itself)
- `marked` - Markdown-to-HTML rendering outside the Astro content collection pipeline (e.g. dynamic content)
- `motion` (Framer Motion successor) - animation
- `aos` - scroll-triggered animations
- `swiper` - carousels/sliders
- `smoothscroll-for-websites` - smooth scroll polyfill
- `lucide` - icon set

**Infrastructure:**
- `toml` - parses `src/config/config.toml` into JSON at build/dev time via `scripts/toml-watcher.mjs`
- `slugify` - slug generation for routes
- `xml2js` - used by sitemap post-processing (`scripts/remove-draft-from-sitemap.mjs`)
- `rehype-external-links`, `remark-toc`, `unist-util-visit` - Markdown/MDX pipeline plugins configured in `astro.config.mjs`

## Configuration

**Environment:**
- `.env` / `.env.production` are gitignored (`.gitignore` lines `themes/lumio/.env`, `themes/lumio/.env.production`) but were not present in the working tree at scan time — no runtime secrets currently required for a static build
- Central config: `themes/lumio/src/config/config.toml` (site title, SEO, contact info, feature toggles, multilingual settings) — see below
- A custom pre-build/pre-dev step (`npm run toml:watch`, backed by `themes/lumio/scripts/toml-watcher.mjs`) compiles `config.toml` → `themes/lumio/.astro/config.generated.json`, which `astro.config.mjs` and `src/content.config.ts` both import directly. This generated JSON file must exist before `astro dev`/`astro build` run correctly (the `dev`/`build`/`preview` npm scripts all invoke `toml:watch` first for this reason).

**Build:**
- `themes/lumio/astro.config.mjs` - Astro integrations (sitemap, MDX, AutoImport), i18n locales, markdown plugin pipeline, fonts
- `themes/lumio/tsconfig.json` - strict TS, path aliases (`@/components/*` → `src/layouts/components/*`, `@/shortcodes/*` → `src/layouts/shortcodes/*`, `@/helpers/*` → `src/layouts/helpers/*`, `@/*` → `src/*`)
- `themes/lumio/.prettierrc` - Prettier with `prettier-plugin-astro`, `prettier-plugin-toml`, `prettier-plugin-tailwindcss`; Astro files use `bracketSameLine: true`, `htmlWhitespaceSensitivity: ignore`
- `themes/lumio/netlify.toml`, `themes/lumio/wrangler.toml` - present but deployment is actually via rsync to a VPS (135.148.61.99), not Netlify/Cloudflare Pages — these config files appear to be unused legacy/optional deploy targets from the Lumio theme template

## Platform Requirements

**Development:**
- Node >=22.12.0
- Run from `themes/lumio/` directory (not repo root): `npm run dev`
- Dev server auto-selects a free port starting at 4321

**Production:**
- Static output only: `npm run build` (from `themes/lumio/`) produces `themes/lumio/dist/`
- No server runtime required — output is deployed via rsync to a VPS and served as static files (not using the `netlify.toml`/`wrangler.toml` targets present in the repo)
- `npm run build` also runs `remove-draft-from-sitemap` script to strip draft-flagged content from `sitemap.xml` post-build

---

*Stack analysis: 2026-09-08*
