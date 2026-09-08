# Codebase Concerns

**Analysis Date:** 2026-09-08

All paths are relative to `themes/lumio/` unless noted.

## Tech Debt

**Mixed .md/.mdx content in the blog collection:**
- Issue: Legacy blog posts `post-1.mdx` through `post-9.mdx` remain `.mdx`, while `post-10.md`, `post-11.md`, `post-12.md` (and the `-index.md` listing page) are `.md`. Per established project knowledge, `.mdx` causes `UnknownContentCollectionError` in this Astro 6 setup with deferred rendering.
- Files: `src/content/blog/english/post-1.mdx` through `post-9.mdx`
- Impact: These 9 posts are latent risk — any change to the Astro/MDX integration version, or to `content.config.ts`'s loader, could break their build without warning since they currently "work" only incidentally.
- Fix approach: Migrate each `.mdx` file to `.md`, stripping any JSX/component syntax that required MDX (shortcodes registered via `AutoImport` in `astro.config.mjs` are already usable in plain Markdown, so most content likely doesn't need true MDX features).

**Case-studies collection is 100% .mdx:**
- Issue: All six case studies (`case-study-1.mdx` through `case-study-6.mdx`) are `.mdx`, the same known-risky format.
- Files: `src/content/case-studies/english/*.mdx`
- Impact: Higher blast radius than the blog issue — the entire case-studies section, not just a subset, depends on MDX continuing to work.
- Fix approach: Same as above — migrate to `.md` if the MDX-specific features (JSX components/expressions) aren't actually used in these files; audit each file first for genuine MDX syntax.

**`@ts-nocheck` in a form-handling utility:**
- Issue: `src/lib/utils/FormHandle.ts` opts out of TypeScript checking entirely at the top of the file, despite the rest of the codebase using `astro/tsconfigs/strict`.
- Files: `src/lib/utils/FormHandle.ts`
- Impact: Type errors in form validation/reset logic (a user-facing, business-critical path — the contact form) won't be caught at compile time.
- Fix approach: Remove `@ts-nocheck` and add proper types for `window.HSSelect` (the likely reason it was disabled — a global from the Preline select plugin) via a `.d.ts` ambient declaration.

**Draft content is built but not fully hidden:**
- Issue: `draft: true` frontmatter (used on `case-study-5.mdx`, `case-study-6.mdx`) only removes pages from the sitemap post-build (`scripts/remove-draft-from-sitemap.mjs`); it does not appear to prevent the pages from being generated in `dist/` and reachable via direct URL.
- Files: `src/content/case-studies/english/case-study-5.mdx`, `case-study-6.mdx`, `scripts/remove-draft-from-sitemap.mjs`
- Impact: Placeholder/incomplete case studies are publicly accessible if the URL is known or guessed, even though they're excluded from the sitemap and presumably from listing pages.
- Fix approach: If listing pages already filter on `draft`, this may be acceptable (security-through-obscurity for unfinished content); if stronger guarantees are wanted, add `noindex` robots meta to draft pages and/or exclude them from `getStaticPaths()` entirely until ready.

**Unused deployment config files:**
- Issue: `netlify.toml` and `wrangler.toml` exist at the project root but the actual deployment is a manual rsync of `dist/` to a VPS (135.148.61.99), not Netlify or Cloudflare Pages.
- Files: `netlify.toml`, `wrangler.toml`
- Impact: Low — mostly a source of confusion for future maintainers who might assume one of these is the live deploy path. `package.json` even retains a `deploy:cf` script (`wrangler pages deploy`) that isn't the real deploy mechanism.
- Fix approach: Remove these files (and the `deploy:cf` script) if truly unused, or add a comment/README clarifying they are inactive.

## Known Bugs

None identified through static exploration; no bug-tracking comments (TODO/FIXME/HACK) were found anywhere in `src/`.

## Security Considerations

**Contact form destination hardcoded in version control:**
- Risk: The contact form's destination email (`ryc@askryc.mt`) is committed in plaintext in `src/config/config.toml` (`contactFormAction`, `contact.email`). This is low-severity since it's already public contact info, but changing it requires a code commit rather than an environment variable.
- Files: `src/config/config.toml`
- Current mitigation: None needed — this is public-facing contact information, not a secret.
- Recommendations: No action required; noting for completeness only.

**No CSRF/spam protection beyond formsubmit.co's built-in handling:**
- Risk: The contact/comment forms rely entirely on the third-party formsubmit.co service for spam filtering; there's no additional CAPTCHA or rate-limiting visible in `src/layouts/components/widgets/ContactForm.astro` or `CommentForm.astro`.
- Files: `src/layouts/components/widgets/ContactForm.astro`, `CommentForm.astro`
- Current mitigation: formsubmit.co's own anti-spam features (if enabled)
- Recommendations: Verify formsubmit.co's honeypot/CAPTCHA settings are enabled on their dashboard; not an in-codebase fix.

## Performance Bottlenecks

None identified — this is a fully static site with no runtime server, so traditional request-time performance concerns don't apply. Build-time performance was not measured.

## Fragile Areas

**`.astro/config.generated.json` as an implicit build dependency:**
- Files: `astro.config.mjs`, `src/content.config.ts`, `src/__tests__/getLocalUrlCTM.test.ts`
- Why fragile: All three files directly `import` this generated JSON file, which only exists after `npm run toml:watch` has run at least once. A fresh clone that runs `astro dev`/`astro build` via the standard npm scripts is fine (they invoke `toml:watch` first), but running `astro dev` or `jest` directly (bypassing the npm script) will fail with a missing-module error.
- Safe modification: Always use the `npm run dev`/`npm run build`/`npm run test` scripts rather than invoking `astro`/`jest` directly, or ensure `.astro/config.generated.json` exists first.
- Test coverage: The one existing test (`getLocalUrlCTM.test.ts`) itself depends on this generated file being present, compounding the fragility.

**Duplicate collection registration keyed by configurable folder names:**
- Files: `src/content.config.ts` (`collections` export)
- Why fragile: Each configurable collection (blog, services, case-studies) is registered under both its `config.toml`-driven folder name and a hardcoded canonical alias. If `config.toml`'s `blogFolder`/`servicesFolder`/`caseStudiesFolder` settings were ever changed, `getCollection()` call sites using the old hardcoded name would silently start reading a different (likely empty) collection.
- Safe modification: Do not change these folder-name settings in `config.toml` without auditing every `getCollection("blog")`/`getCollection("services")`/`getCollection("case-studies")`/`getCollection("portfolio")` call site across `src/pages` and `src/layouts/components`.
- Test coverage: None.

## Scaling Limits

Not applicable — static site, no meaningful scaling concerns at current content volume (single-digit blog posts and case studies).

## Dependencies at Risk

**`netlify.toml` / `wrangler.toml` / `deploy:cf` script drift:**
- Risk: These configs are not exercised by the actual deploy process (rsync to VPS) and could silently go stale or reference outdated build settings.
- Impact: Low — only relevant if someone attempts to use them, which would produce confusing results.
- Migration plan: Remove if confirmed permanently unused, or document their inactive status.

## Missing Critical Features

**No CI pipeline:**
- Problem: No CI configuration (GitHub Actions, etc.) was found in the repository.
- Blocks: Automated `astro check` / `npm run test` on every push or PR; regressions (e.g. the `.mdx` breakage risk noted above) could reach production without being caught.

## Test Coverage Gaps

**Content schema validation has no dedicated tests:**
- What's not tested: The Zod schemas in `src/content.config.ts` and `src/sections.schema.ts` are only validated implicitly when `astro build`/`astro dev` runs against real content; there's no unit test asserting schema shape or catching schema regressions early.
- Files: `src/content.config.ts`, `src/sections.schema.ts`
- Risk: A schema change that breaks existing content frontmatter would only surface as a build failure, not a fast unit-test failure.
- Priority: Low (build-time failure is still a functional safety net, just slower feedback).

**No test coverage for form handling:**
- What's not tested: `src/lib/utils/FormHandle.ts` (contact form reset/validation logic) has zero test coverage, compounded by its `@ts-nocheck` status.
- Files: `src/lib/utils/FormHandle.ts`
- Risk: Regressions in contact-form behavior (a business-critical conversion path for a consulting site) would only be caught manually.
- Priority: Medium — this is the site's primary lead-generation mechanism.

**No test coverage for i18n routing beyond the URL-string utility:**
- What's not tested: `getLocaleUrlCTM` has good unit coverage, but the actual `[...lang]` route resolution behavior (in `src/pages/[...lang]/**`) and the `enabledLanguages` computation in `src/lib/utils/i18nUtils.ts` (which determines that French is disabled) have no direct tests.
- Files: `src/pages/[...lang]/**`, `src/lib/utils/i18nUtils.ts`
- Risk: Low, since French is currently disabled and the site is effectively single-locale in practice; risk would increase if French were re-enabled.
- Priority: Low, unless/until French locale is reactivated.

---

*Concerns audit: 2026-09-08*
