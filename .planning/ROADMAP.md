# Roadmap: Ryc Brownrigg Consulting Site

## Milestones

- ✅ **v1.0 — Launch-Quality Punch List** (shipped 2026-09-16): Draft placeholder cleanup, social sharing OG image, and legacy `.mdx`/French-locale/FormHandle tech debt. See `.planning/milestones/v1.0-ROADMAP.md`.
- ✅ **v1.1 — CI & Test Hardening** (shipped 2026-09-18): GitHub Actions CI pipeline (astro check + tests on every push/PR), real regression tests for 6 pure utility modules, and removal of unused Netlify/Cloudflare deploy configs. See `.planning/milestones/v1.1-ROADMAP.md`.
- ✅ **v1.2 — Utility Test Coverage Completion** (shipped 2026-09-19): Real regression tests for the 13 remaining pure `src/lib/utils/` modules, completing the utility-layer safety net started in v1.1 Phase 5 (20 Jest suites / 121 tests, zero regressions). See `.planning/milestones/v1.2-ROADMAP.md`.

## Backlog

See `.planning/milestones/v1.2-REQUIREMENTS.md` v2 section for deferred items: case-study-5/6 real content and the 5 placeholder testimonials (CONTENT-01/02/03, still blocked on real material existing). Also open: a follow-up todo to refactor `handleDraftPage.ts` with an injectable `isProd` param so its 404-Response branch can be exercised under Jest — `.planning/todos/pending/2026-09-19-refactor-handledraftpage-to-accept-injectable-isprod-param.md`.
