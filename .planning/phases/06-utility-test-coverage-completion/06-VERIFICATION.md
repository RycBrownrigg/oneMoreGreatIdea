---
phase: 06-utility-test-coverage-completion
verified: 2026-09-19T09:15:00Z
status: passed
score: 4/4 must-haves verified (with 1 partially behavior-unverified sub-item)
behavior_unverified: 1
overrides_applied: 0
behavior_unverified_items:

  - truth: "handleDraftPage.ts's documented production behavior (return a 404 Response when draft is true) is exercised by a real-behavior regression test"
    test: "In a real Astro/Vite build (import.meta.env.PROD === true), call handleDraftPage({ draft: true }) and inspect the returned value"
    expected: "A Response object with status 404 and statusText 'Not Found'"
    why_human: "Jest never injects import.meta.env, so handleDraftPage.test.ts can only assert that accessing .PROD throws a TypeError under Jest — a harness artifact, not the module's documented 404-response behavior. No test in the repo exercises the actual 404 Response construction. This is a genuine, unclosed gap in TECHDEBT-10 coverage, honestly documented in the test file's own comment and flagged as IN-01 (informational) in 06-REVIEW.md, not a hidden defect."
coincidental_reliance_items: []
---

# Phase 6: Utility Test Coverage Completion Verification Report

**Phase Goal:** The site's full complement of pure, testable utility modules has real regression tests — not just the 6 covered in v1.1 Phase 5 — so a refactor that breaks type-scale generation, config filtering, draft-page handling, object overriding, ID generation, key stripping, reading-time estimation, TOC building, nav-active state, related-content selection, Preline select config, absolute-URL building, or JSON-LD generation fails in CI instead of in production.
**Verified:** 2026-09-19
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `npm run test:ci` passes locally/CI with 13 new test files, zero regressions to the existing 7 suites/86 tests | ✓ VERIFIED | Ran `npm --prefix themes/lumio run test:ci` myself: **20 suites, 121 tests, all passing** (7 pre-existing + 13 new = 20; 86 pre-existing + 35 new = 121). No skips, no failures. |
| 2 | Each new test file exercises real behavior (normal + edge case), not a smoke assertion — deliberately breaking a covered module's logic fails a test | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED (12 of 13 modules fully verified; handleDraftPage's core documented behavior is not exercised) | I independently broke `buildToc.ts`'s nesting logic (duplicated a `toc.push`) and re-ran the suite — the new test failed exactly as expected, then restored the file cleanly (`git diff` empty afterward). 06-REVIEW.md independently performed and documented the same style of check across all 13 files and found all assertions factually correct against real implementation behavior. However, `handleDraftPage.test.ts` (read directly) only exercises the `draft:false` short-circuit and a Jest-harness `TypeError` artifact — the module's actual purpose, "returns a 404 Response when draft is true in production" (per its own JSDoc), is never exercised because `import.meta.env.PROD` is `undefined` under Jest. This is a real, honestly-documented gap, not a fabricated claim — see `behavior_unverified_items` above. |
| 3 | Every module in `src/lib/utils/` is accounted for: 19 pure-testable modules (6 from v1.1 Phase 5 + 13 from this phase) have dedicated Jest coverage; the 8 Astro/DOM/filesystem-coupled modules remain explicitly out of scope and unchanged | ✓ VERIFIED | `src/lib/utils/` has 27 files. 19 have a matching `src/__tests__/*.test.ts` file (6 pre-existing + the 13 listed in ROADMAP SC1, confirmed present). The 8 without tests — `AstroFont.ts`, `bgOptimizedImage.ts`, `downloadSelfHostedFonts.ts`, `FormHandle.ts`, `i18nUtils.ts`, `localizedRouteResolver.ts`, `remarkParseContent.ts`, `removeUnusedFonts.ts` — are Astro/DOM/filesystem-coupled and were explicitly out of scope per the phase's own accounting; `git diff --stat` confirms none of them (or any other `src/lib/utils/` file) was modified by this phase's commits. |
| 4 | `.github/workflows/ci.yml` picks up all 13 new suites on the next push with zero workflow-file edits | ✓ VERIFIED | `git log --oneline -- .github/workflows/ci.yml` shows only the original `4cb3e8e` commit (pre-dating this phase) — zero edits from Phase 6. The workflow's existing `run: npm run test:ci` step (after `npm run toml:watch`) picks up new suites automatically since Jest auto-discovers `src/__tests__/*.test.ts`. |

**Score:** 3/4 truths fully VERIFIED, 1/4 PRESENT_BEHAVIOR_UNVERIFIED (partial — 12/13 modules within that truth are solid)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `themes/lumio/src/__tests__/generateTypeScale.test.ts` | Real-behavior tests | ✓ VERIFIED | 36 lines, imports real module, no mocks. |
| `themes/lumio/src/__tests__/filteredEnabled.test.ts` | Real-behavior tests | ✓ VERIFIED | 24 lines, real import, no mocks. |
| `themes/lumio/src/__tests__/handleDraftPage.test.ts` | Real-behavior tests | ⚠️ Present, wired, but core 404-branch untested (see truth #2) | 21 lines, real import; see behavior_unverified_items. |
| `themes/lumio/src/__tests__/overrideObjects.test.ts` | Real-behavior tests | ✓ VERIFIED | 30 lines; independently confirms deep-merge, wholesale-array-replace, non-mutation. |
| `themes/lumio/src/__tests__/uniqueIdGenerator.test.ts` | Real-behavior tests | ✓ VERIFIED | 20 lines, real import. |
| `themes/lumio/src/__tests__/removeEmptyKeys.test.ts` | Real-behavior tests | ✓ VERIFIED | 31 lines, real import. |
| `themes/lumio/src/__tests__/readingTime.test.ts` | Real-behavior tests | ✓ VERIFIED | 15 lines, real import. |
| `themes/lumio/src/__tests__/buildToc.test.ts` | Real-behavior tests | ✓ VERIFIED (behaviorally confirmed by my own break-and-restore test) | 41 lines, real import. |
| `themes/lumio/src/__tests__/navigationActive.test.ts` | Real-behavior tests | ✓ VERIFIED | 50 lines, real import, exercises recursion into `children`. |
| `themes/lumio/src/__tests__/getRelatedContent.test.ts` | Real-behavior tests | ✓ VERIFIED | 72 lines, real import. |
| `themes/lumio/src/__tests__/preline.test.ts` | Real-behavior tests | ✓ VERIFIED | 21 lines, real import. |
| `themes/lumio/src/__tests__/absoluteUrl.test.ts` | Real-behavior tests | ✓ VERIFIED | 22 lines, real import. |
| `themes/lumio/src/__tests__/JsonLdGenerator.test.ts` | Real-behavior tests | ✓ VERIFIED | 54 lines, real import, exercises real (unmocked) `trailingSlashChecker`/`absoluteUrl` cross-module calls. |
| `themes/lumio/tsconfig.jest.json` | Harness fix for `@/*`/ESM | ✓ VERIFIED | `module: esnext`, `baseUrl`, `paths` present; confirmed working via full suite run. |
| `themes/lumio/jest.config.ts` | `moduleNameMapper` for `@/*` and bare `.astro/config.generated.json` | ✓ VERIFIED | Both mappings present; old `^marked$` UMD mapping correctly removed. |
| `themes/lumio/package.json` | `NODE_OPTIONS=--experimental-vm-modules` on `test`/`test:ci` | ✓ VERIFIED | Present on both scripts. |

All 13 target production modules have exactly one dedicated, non-mocking test file each; all 20 test files run to completion with zero errors.

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `jest.config.ts` moduleNameMapper `^@/(.*)$` / `^\.astro/config\.generated\.json$` | `buildToc.ts`, `navigationActive.ts`, `JsonLdGenerator.ts` (transitively) | Runtime module resolution | ✓ WIRED | All 3 suites compile and pass; confirmed by running the full suite. |
| `.github/workflows/ci.yml`'s `npm run toml:watch` step | Jest suites that import `.astro/config.generated.json` | Pre-test config generation | ✓ WIRED (in the documented CI path) | Confirmed `ci.yml` runs `toml:watch` before `test:ci`. |
| Each new test file | Its production module under test | Direct, unmocked `import` | ✓ WIRED | Confirmed via grep — no `jest.mock`/`jest.spyOn` calls in any of the 13 new test files. |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full suite passes with correct suite/test counts | `npm --prefix themes/lumio run test:ci` | 20 suites, 121 tests, all passing | ✓ PASS |
| `astro check` remains clean after harness changes | `npm --prefix themes/lumio run astro-check` | 217 files, 0 errors, 0 warnings, 0 hints | ✓ PASS |
| A deliberately broken module fails its new test (`buildToc.ts`) | Duplicated a `toc.push(newHeading)` call, re-ran `test:ci -- buildToc`, then restored | Test failed with a clear length-mismatch diff; restored file produces clean `git diff` and all 121 tests pass again | ✓ PASS |
| No production `src/lib/utils/*` file was modified by this phase | `git diff --stat -- themes/lumio/src/lib/utils/` (8ac5d29..HEAD) | Empty output | ✓ PASS |
| `.github/workflows/ci.yml` untouched | `git log --oneline -- .github/workflows/ci.yml` | Only the pre-existing `4cb3e8e` commit | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| TECHDEBT-08 | 06-02 | Tests cover `generateTypeScale.ts` | ✓ SATISFIED | `generateTypeScale.test.ts` present, passing, real assertions. |
| TECHDEBT-09 | 06-02 | Tests cover `filteredEnabled.ts` | ✓ SATISFIED | `filteredEnabled.test.ts` present, passing. |
| TECHDEBT-10 | 06-01 | Tests cover `handleDraftPage.ts` | ✓ SATISFIED (coarse) / ⚠️ documented gap on core 404 behavior | File exists, exercises real short-circuit path; 404-Response path unexercised under Jest — see behavior_unverified_items. |
| TECHDEBT-11 | 06-03 | Tests cover `overrideObjects.ts` | ✓ SATISFIED | `overrideObjects.test.ts` present, passing. |
| TECHDEBT-12 | 06-03 | Tests cover `uniqueIdGenerator.ts` | ✓ SATISFIED | `uniqueIdGenerator.test.ts` present, passing. |
| TECHDEBT-13 | 06-03 | Tests cover `removeEmptyKeys.ts` | ✓ SATISFIED | `removeEmptyKeys.test.ts` present, passing. |
| TECHDEBT-14 | 06-02 | Tests cover `readingTime.ts` | ✓ SATISFIED | `readingTime.test.ts` present, passing. |
| TECHDEBT-15 | 06-01 | Tests cover `buildToc.ts` | ✓ SATISFIED | `buildToc.test.ts` present, passing, behaviorally re-confirmed by verifier. |
| TECHDEBT-16 | 06-01 | Tests cover `navigationActive.ts` | ✓ SATISFIED | `navigationActive.test.ts` present, passing. |
| TECHDEBT-17 | 06-04 | Tests cover `getRelatedContent.ts` | ✓ SATISFIED | `getRelatedContent.test.ts` present, passing. |
| TECHDEBT-18 | 06-04 | Tests cover `preline.ts` | ✓ SATISFIED | `preline.test.ts` present, passing. |
| TECHDEBT-19 | 06-01 | Tests cover `absoluteUrl.ts` | ✓ SATISFIED | `absoluteUrl.test.ts` present, passing. |
| TECHDEBT-20 | 06-01 | Tests cover `JsonLdGenerator.ts` | ✓ SATISFIED | `JsonLdGenerator.test.ts` present, passing. |

All 13 requirement IDs from REQUIREMENTS.md (TECHDEBT-08 through TECHDEBT-20) are claimed across the 4 plans (5+3+3+2=13) with no gaps and no orphans. Cross-referenced against `.planning/REQUIREMENTS.md` lines 12-30 and 60-72 — all marked `[x]`/`Complete`, consistent with the evidence above.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `themes/lumio/package.json` | 17-18 (`test`/`test:ci` scripts) | Missing `pretest`/`pretest:ci` hook — `npm test`/`npm run test:ci` run directly on a fresh clone (without a prior `npm run dev`/`build`/`toml:watch`) fail 5 suites (3 from this phase) with a confusing `TS2307` error rather than a clear "run toml:watch first" message | ⚠️ Warning (already identified as WR-01 in 06-REVIEW.md; does not affect the documented CI path, which does run `toml:watch` first) | Reduces onboarding/contributor reliability of the new test infrastructure; does not block current CI or the phase goal as stated. |
| `themes/lumio/jest.config.ts` | 17 | Comment misattributes the `@/*`/`.astro/config.generated.json` moduleNameMapper entries as needed by `handleDraftPage.ts`, which has zero imports | ℹ️ Info (WR-02 in 06-REVIEW.md) | Could mislead a future contributor editing this mapping; harmless today. |
| `themes/lumio/src/__tests__/handleDraftPage.test.ts` | 3-20 | Test file's own comment documents that it cannot exercise the module's actual documented 404-Response behavior under Jest | ℹ️ Info (IN-01 in 06-REVIEW.md); elevated to a `PRESENT_BEHAVIOR_UNVERIFIED` human-verification item in this report per the verifier's behavior-dependent-truth rule | See truth #2 and `behavior_unverified_items` above. |
| `themes/lumio/tsconfig.jest.json` | 4 | `moduleResolution: "node10"` left unmodernized alongside new `module: "esnext"`/`paths` additions — breaks standalone `tsc -p tsconfig.jest.json --noEmit` (not ts-jest's actual runs, which pass) | ℹ️ Info (IN-02 in 06-REVIEW.md) | Pre-existing risk, not introduced by this phase; doesn't affect `test:ci`. |

No debt markers (`TBD`/`FIXME`/`XXX`/`TODO`/`HACK`/`PLACEHOLDER`) found in any file touched by this phase. No `jest.mock`/`jest.spyOn` calls found in any of the 13 new test files — all exercise real, unmocked production code.

### Human Verification Required

### 1. Confirm handleDraftPage.ts's actual 404-Response behavior in a real build

**Test:** In a real Astro/Vite build context (`import.meta.env.PROD === true`), call `handleDraftPage({ draft: true })` and inspect the return value — either via a manual `astro build` on a page with `draft: true` frontmatter and checking it's excluded from `dist/`, or by refactoring `handleDraftPage` to accept an injectable `isProd` parameter so Jest can exercise the branch directly (as 06-REVIEW.md's IN-01 fix suggestion proposes).
**Expected:** A `Response` object with `status: 404`, `statusText: "Not Found"` is returned, and the corresponding page is excluded from the built `dist/` output / sitemap.
**Why human:** Jest's `import.meta.env` is always `undefined` under the current harness, so no automated test in this repository can currently reach or assert on this branch. This is TECHDEBT-10's actual documented purpose (per the module's own JSDoc) and it remains genuinely unverified by CI. A prospective client hitting a stale draft page in production, or a refactor accidentally changing the 404 status/logic, would not be caught by `npm run test:ci` today.

### Gaps Summary

No BLOCKER-level gaps. The phase's stated goal — 13 new real-behavior regression test files covering the 13 named utility modules, with zero regressions and automatic CI pickup — is substantively achieved and independently re-verified: I ran `npm run test:ci` and `npm run astro-check` myself (not relying on SUMMARY.md claims), confirmed 20/20 suites and 121/121 tests pass, confirmed zero production-file diffs across the phase's commit range, and independently re-performed a deliberate-break-and-restore check on `buildToc.ts` to confirm the tests exercise real logic rather than being tautological.

One WARNING-level item surfaces for human decision: `handleDraftPage.test.ts` — while satisfying the letter of TECHDEBT-10 ("automated unit tests cover handleDraftPage.ts", a file-level requirement literally met) — does not exercise the module's actual documented production behavior (the 404 Response), only a Jest-harness artifact (a TypeError from `import.meta.env` being undefined). This was already caught and honestly disclosed by both the plan's own test-file comment and 06-REVIEW.md (IN-01, informational, non-blocking). Per this verifier's behavior-dependent-truth rules, symbol presence and file existence are not sufficient for a fully VERIFIED status on this sub-item, so it is routed to human verification rather than silently passed. This does not block the phase from proceeding — it's a known, disclosed, and reasonable limitation of testing `import.meta.env`-gated code under Jest — but a human should decide whether to accept it as-is (recommended, given the disclosed reasoning and low risk on a static site with no server runtime) or file a follow-up to inject `isProd` for full coverage.

Two additional advisory (non-blocking) items carried forward from 06-REVIEW.md are noted in the Anti-Patterns table above (WR-01: missing `pretest` hook; WR-02: stale code comment) — both are test/config robustness items, not correctness defects, and do not affect the current CI path or the phase goal.

---

_Verified: 2026-09-19_
_Verifier: Claude (gsd-verifier)_
