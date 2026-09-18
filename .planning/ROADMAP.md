# Roadmap: Ryc Brownrigg Consulting Site

## Milestones

- ✅ **v1.0 — Launch-Quality Punch List** (shipped 2026-09-16): Draft placeholder cleanup, social sharing OG image, and legacy `.mdx`/French-locale/FormHandle tech debt. See `.planning/milestones/v1.0-ROADMAP.md`.
- ✅ **v1.1 — CI & Test Hardening** (shipped 2026-09-18): GitHub Actions CI pipeline (astro check + tests on every push/PR), real regression tests for 6 pure utility modules, and removal of unused Netlify/Cloudflare deploy configs. See `.planning/milestones/v1.1-ROADMAP.md`.
- 🚧 **v1.2 — Utility Test Coverage Completion** (started 2026-09-18): Phase 6. Unit tests for the 13 remaining pure, testable `src/lib/utils/` modules deferred out of v1.1 Phase 5's named scope.

## Current Milestone: v1.2 — Utility Test Coverage Completion

**Goal:** Extend unit-test coverage to the 13 remaining pure, testable utility modules in `src/lib/utils/` deferred from v1.1's Phase 5 test-coverage push, so the utility layer's regression safety net is complete rather than partial.

This is pure test-writing debt cleanup on already-existing, already-shipped code — no new features, no research, no CI changes (v1.1's pipeline already runs any new test file automatically). The 13 modules are uniform in shape (small, pure, already classified as testable) and low risk, matching the precedent set by v1.1 Phase 5 (one phase, one plan, straightforward Jest test files for 6 sibling modules).

## Phases

- [ ] **Phase 6: Utility Test Coverage Completion** - The remaining 13 pure `src/lib/utils/` modules gain real unit tests, closing out the utility-layer coverage gap left by v1.1 Phase 5

## Phase Details

### Phase 6: Utility Test Coverage Completion

**Goal**: The site's full complement of pure, testable utility modules has real regression tests — not just the 6 covered in v1.1 Phase 5 — so a refactor that breaks type-scale generation, config filtering, draft-page handling, object overriding, ID generation, key stripping, reading-time estimation, TOC building, nav-active state, related-content selection, Preline select config, absolute-URL building, or JSON-LD generation fails in CI instead of in production
**Depends on**: Phase 5 (v1.1) — established the non-watch `test:ci` command, the Jest/`tsconfig.jest.json` harness, and the CI pipeline that runs it automatically
**Requirements**: TECHDEBT-08, TECHDEBT-09, TECHDEBT-10, TECHDEBT-11, TECHDEBT-12, TECHDEBT-13, TECHDEBT-14, TECHDEBT-15, TECHDEBT-16, TECHDEBT-17, TECHDEBT-18, TECHDEBT-19, TECHDEBT-20
**Success Criteria** (what must be TRUE):

1. `npm run test:ci` passes locally and in the next CI run with 13 new test files added under `src/__tests__/` — one per module: `generateTypeScale`, `filteredEnabled`, `handleDraftPage`, `overrideObjects`, `uniqueIdGenerator`, `removeEmptyKeys`, `readingTime`, `buildToc`, `navigationActive`, `getRelatedContent`, `preline`, `absoluteUrl`, `JsonLdGenerator` — with zero regressions to the existing 7 suites / 86 tests
2. Each new test file exercises real behavior (normal-case input plus at least one edge case: empty, missing/undefined, or malformed input) rather than a single happy-path smoke assertion — deliberately breaking any one covered module's logic makes at least one new test fail
3. Every module in `src/lib/utils/` is now accounted for: all 19 previously-identified pure-testable modules (6 from v1.1 Phase 5 + these 13) have dedicated Jest coverage, and the 8 Astro/DOM/filesystem-coupled modules remain explicitly out of scope, unchanged
4. The existing v1.1 GitHub Actions workflow (`.github/workflows/ci.yml`) picks up all 13 new suites on the next push with no workflow-file edits required

**Plans**: 4 plans

Plans:
**Wave 1**

- [ ] 06-01-PLAN.md — Fix the Jest harness (`@/*` alias, bare `.astro/config.generated.json` import, `import.meta` under real ESM) and cover handleDraftPage, buildToc, navigationActive, JsonLdGenerator, absoluteUrl (tracer + expansion, Wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 06-02-PLAN.md — Cover generateTypeScale, readingTime, filteredEnabled (Wave 2)
- [ ] 06-03-PLAN.md — Cover overrideObjects, removeEmptyKeys, uniqueIdGenerator (Wave 2)
- [ ] 06-04-PLAN.md — Cover getRelatedContent, preline (Wave 2, phase completion)

**Cross-cutting constraints:**

- Running `npm --prefix themes/lumio run test:ci` after this plan still passes every suite from Plan 01 plus these 3 new suites, with zero regressions.
- Deliberately breaking any one of these 3 modules' logic causes at least one new test in this plan to fail.

**Notes:**

- Full per-module accounting (which modules were covered, deferred, or excluded, and why) lives in `.planning/milestones/v1.1-phases/05-utility-test-coverage/05-01-SUMMARY.md`
- Existing Jest setup: `jest.config.ts` + `tsconfig.jest.json`, driven through `cross-env TS_NODE_PROJECT` — new tests should fit that harness rather than introduce a second runner
- `jest.config.ts` already maps the ESM-only `marked` package to a CJS-compatible build for `textConverter.ts`; none of these 13 modules are expected to need that mapping, but confirm during execution if any import surfaces it
- `preline.ts` returns plain config objects/strings (no DOM/`window` access) despite the name — confirmed pure and testable like the others
- A single phase (rather than splitting by the three REQUIREMENTS.md categories — Content & Text, Data/Object, Navigation & Routing) matches project scale: 13 small, uniform, low-risk test-writing tasks with no dependencies between them, mirroring the v1.1 Phase 5 precedent

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 6. Utility Test Coverage Completion | 0/4 | Planned | - |

## Backlog

See `.planning/REQUIREMENTS.md` v2 section for deferred items: case-study-5/6 real content and the 5 placeholder testimonials (CONTENT-01/02/03) — all blocked on real material existing, re-confirmed deferred 2026-09-17.

---

*Milestone v1.2 roadmap created 2026-09-18. Phase numbering continues from v1.1 (which ended at Phase 5).*
