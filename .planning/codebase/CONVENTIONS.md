# Coding Conventions

**Analysis Date:** 2026-09-08

All paths are relative to `themes/lumio/`.

## Naming Patterns

**Files:**
- Astro components: PascalCase, e.g. `BlogCard.astro`, `ContactForm.astro`, `HomeBannerThree.astro`
- Utility/lib modules: camelCase, e.g. `i18nUtils.ts`, `remarkParseContent.ts`, `downloadSelfHostedFonts.ts`
- Content files: kebab-case with numeric suffix for series, e.g. `post-10.md`, `case-study-3.mdx`, `service-2.mdx`

**Functions:**
- camelCase, verb-led, e.g. `formReset`, `getLocaleUrlCTM`, `generateAstroFontsConfig`

**Variables:**
- camelCase; destructured config access is common, e.g. `let { seo: { sitemap: sitemapConfig }, settings: {...} } = config;` in `astro.config.mjs`

**Types:**
- Zod schema objects use camelCase names ending in no fixed suffix (`basePage`, `page`, `marqueeConfig`), not `Schema`-suffixed — check `src/content.config.ts` for the pattern before introducing new schemas

## Code Style

**Formatting:**
- Prettier 3.8 (`themes/lumio/.prettierrc`), invoked via `npm run format` (runs `prettier -w ./src`)
- Plugins: `prettier-plugin-astro`, `prettier-plugin-toml`, `prettier-plugin-tailwindcss` (auto-sorts Tailwind class order)
- Astro-file overrides: `bracketSameLine: true`, `htmlWhitespaceSensitivity: "ignore"`, `trailingComma: "all"`
- TOML-file overrides: aligned entries, no aligned comments, 4 allowed blank lines

**Linting:**
- No ESLint config found in the project — type-checking via `astro check` (`npm run astro-check`) is the primary static analysis tool
- TypeScript strict mode is enabled (`tsconfig.json` extends `astro/tsconfigs/strict`)

## Import Organization

**Path Aliases (defined in `tsconfig.json`):**
- `@/components/*` → `src/layouts/components/*`
- `@/shortcodes/*` → `src/layouts/shortcodes/*`
- `@/helpers/*` → `src/layouts/helpers/*`
- `@/*` → `src/*`
- Prefer these aliases over relative paths (`../../../`) when adding new imports in `.astro`/`.ts` files under `src/`

**Order:**
- No enforced import-sorting plugin observed; existing files generally group third-party imports first, then local (`@/...` or relative) imports, e.g. `astro.config.mjs` imports Astro integrations first, then local `src/lib/utils/*` modules, then JSON config files last

## Error Handling

**Patterns:**
- Content validation errors surface at build time via Zod schema mismatches in `src/content.config.ts` — there is no runtime try/catch pattern for content loading, since Astro's Content Layer API handles this
- Client-side utility code (`src/lib/utils/FormHandle.ts`) uses optional chaining (`form?.reset()`, `select?.setValue()`) defensively rather than explicit null checks or thrown errors
- `FormHandle.ts` is marked `// @ts-nocheck` at the top of the file, opting the whole file out of TypeScript's strict checking — this is an exception to the otherwise-strict codebase (see CONCERNS.md)

## Logging

**Framework:** None — no logging library is used; relies on Astro/Vite's default dev/build console output

**Patterns:**
- No `console.log` conventions enforced; build scripts (`scripts/toml-watcher.mjs`, `scripts/remove-draft-from-sitemap.mjs`) use plain `console.log`/`console.error` for their own status output

## Comments

**When to Comment:**
- JSDoc-style block comments precede exported utility functions explaining intent, e.g. `src/lib/utils/FormHandle.ts`'s `formReset` has a multi-line doc comment describing behavior
- Inline comments are sparse in `.astro` component files; most explanatory context lives in doc comments on utility functions

**JSDoc/TSDoc:**
- Used selectively on utility functions in `src/lib/utils/*`, not enforced project-wide

## Function Design

**Size:** No enforced limit; utility functions in `src/lib/utils/` are typically short and single-purpose (e.g. `formReset`), while some `.astro` components (`ContactForm.astro` at 681 lines, `GlobalScripts.astro` at 411 lines) mix markup, script, and logic in one file — standard for Astro's single-file component model

**Parameters:** Utility functions take typed DOM elements or plain config objects directly rather than options bags with many optional flags

**Return Values:** Content-schema-driven functions typically return `void` (DOM mutation helpers) or plain computed strings (URL resolution helpers like `getLocaleUrlCTM`)

## Module Design

**Exports:** Named exports are the norm in `src/lib/utils/*` and `src/content.config.ts` (e.g. `export const page`, `export function formReset`); default exports are used for Astro component files implicitly (Astro's convention) and for the Astro config in `astro.config.mjs` (`export default defineConfig({...})`)

**Barrel Files:** Not used — no `index.ts` re-export aggregators found; each module is imported by its direct path (often via the `@/` alias)

---

*Convention analysis: 2026-09-08*
