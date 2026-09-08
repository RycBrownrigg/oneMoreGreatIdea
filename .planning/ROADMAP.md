# Roadmap: Ryc Brownrigg Consulting Site

## Overview

This milestone closes out the remaining pre-launch/launch-quality punch list on Ryc's already-live consulting site (onemoregreatidea.com), which will remain its own dedicated Astro site permanently — the askryc.com/.net/.mt domains are being converted to a separate WordPress project and are out of scope here. The work is three independent buckets of maintenance: stop two empty placeholder pages from being publicly reachable, add a proper social-sharing image, and retire two known pieces of tech debt (legacy `.mdx` content and an untyped form utility) that currently work "by accident."

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Draft Placeholder Cleanup** - Stop the empty case-study-5/6 placeholder stubs from being reachable by direct URL
- [ ] **Phase 2: Social Sharing** - Add a proper OG image so shared links render correctly on social platforms
- [x] **Phase 3: Code & Content Hygiene** - Migrate legacy `.mdx` content to `.md`, remove dead French locale content, and fix the untyped FormHandle utility

## Phase Details

### Phase 1: Draft Placeholder Cleanup

**Goal**: The two empty, unfinished case-study placeholder pages cannot be reached by a visitor who guesses or is given their URL
**Depends on**: Nothing (first phase)
**Requirements**: TECHDEBT-04
**Success Criteria** (what must be TRUE):

  1. Requesting `/case-studies/case-study-5` (or its resolved slug) directly returns a 404, or the route is excluded from the build entirely
  2. Requesting `/case-studies/case-study-6` (or its resolved slug) directly returns the same
  3. Neither page appears in the sitemap or any case-study listing (already true today — must remain true)

**Plans**: None needed — verified already satisfied by existing code (see `01-VERIFICATION.md`)

**Outcome:** `getCollectionCTM()` in `themes/lumio/src/lib/contentParser.astro` already filters out `draft: true` entries in production builds, so `case-study-5`/`case-study-6` never get a static route generated at all. Confirmed empirically: `dist/case-studies/` contains only `vongo`, `ccrms`, `horizongo`, `inktix` after a production build. No code changes were needed. This corrects an earlier, inaccurate concern in `.planning/codebase/CONCERNS.md` that was based on reading `remove-draft-from-sitemap.mjs` in isolation.

### Phase 2: Social Sharing

**Goal**: Sharing a link to the site on social platforms produces a correct, on-brand preview instead of a missing or default image
**Depends on**: Nothing (independent of Phase 1)
**Requirements**: CONTENT-04
**Success Criteria** (what must be TRUE):

  1. Sharing any site URL on social platforms (e.g. Twitter/X, LinkedIn, Facebook) renders a custom, on-brand preview image

**Plans**: TBD

### Phase 3: Code & Content Hygiene

**Goal**: The codebase's content-format and type-safety debt is eliminated, and dead locale content is removed
**Depends on**: Nothing (independent cleanup work)
**Requirements**: CONTENT-05, TECHDEBT-01, TECHDEBT-02, TECHDEBT-03
**Success Criteria** (what must be TRUE):

  1. No `.mdx` files remain in `src/content/blog/` or `src/content/case-studies/`; every migrated post and case study is `.md` and renders identically to its pre-migration output (same body content, same shortcode functionality, no content loss)
  2. `src/lib/utils/FormHandle.ts` has `@ts-nocheck` removed, passes `astro check`/TypeScript strict mode with zero errors, and the contact form still submits and resets correctly
  3. French locale content directories and any disabled-locale-only scripts/assets are removed from the repository
  4. `npm run build` completes with zero content-collection or type-checking errors/warnings

**Plans**: 3/3 plans executed

Plans:

- [x] 03-01-PLAN.md — Remove disabled French locale content, i18n/menu data, and locale-only tooling scripts (CONTENT-05)
- [x] 03-02-PLAN.md — Migrate 9 blog posts and 6 case studies from `.mdx` to `.md` with byte-identical rendered output (TECHDEBT-01, TECHDEBT-02)
- [x] 03-03-PLAN.md — Type `window.HSSelect` via an ambient declaration and remove the check suppression from FormHandle.ts (TECHDEBT-03)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Draft Placeholder Cleanup | 0/0 (verified, no plans needed) | Complete | 2026-09-08 |
| 2. Social Sharing | 0/TBD | Not started | - |
| 3. Code & Content Hygiene | 3/3 | Complete | 2026-09-08 |
