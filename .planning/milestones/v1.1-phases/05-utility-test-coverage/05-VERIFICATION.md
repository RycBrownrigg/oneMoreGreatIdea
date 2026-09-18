---
phase: 05-utility-test-coverage
verified: 2026-09-18T00:00:00Z
status: passed
score: 5/5 must-haves verified
behavior_unverified: 0
overrides_applied: 0
---

# Phase 5 Verification: Utility Test Coverage

## Method

Verified directly against live state, not via subagent — consistent with Phase 4 (see 05-01-SUMMARY.md's Deviations section: repeated multi-hour subagent stalls earlier this milestone led the orchestrating session to execute and verify both phases directly). Every claim below was checked against the actual filesystem, a real local `npm run test:ci` re-run, and two real GitHub Actions runs — not inferred from plan or SUMMARY text.

## Must-Haves (from 05-01-PLAN.md)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `npm run test:ci` passes a suite covering all 6 named modules beyond the pre-existing `getLocalUrlCTM.test.ts` | ✓ | Re-ran locally: 7 test suites, 86 tests, all passing |
| 2 | Each of the 6 covered modules has ≥1 normal-behavior test and ≥1 edge-case test | ✓ | Confirmed by reading each new test file directly — falsy/empty input, equal-dates, null/undefined weight, primitive/array clone, URL-protected split, fragment-preserving trailing slash all present |
| 3 | Every module in `src/lib/utils/` (27 total) is accounted for with a one-line exclusion reason in SUMMARY.md | ✓ | `ls src/lib/utils/` re-counted: 27 files, matching SUMMARY.md's 6+8+13 accounting exactly, no module omitted |
| 4 | Deliberately breaking one covered utility makes a new test fail, then is cleanly reverted | ✓ | Reproduced independently: inverted `sortFunctions.ts`'s `?? Infinity` to `?? -Infinity`, the "sorts last" test failed with `Expected: "low"`/`Received: "unweighted"`; reverted; `git diff --stat -- themes/lumio/src/lib/utils/` returned `0` |
| 5 | The existing `.github/workflows/ci.yml` picks up the new tests with zero workflow-file edits | ✓ | `git log --oneline -- .github/workflows/ci.yml` shows only its Phase 4 creation commit (`4cb3e8e`) — no edits since; real Actions run `35378157988` ran all 7 suites using that same unmodified workflow |

## Requirements Coverage

| Requirement | Claimed by | Evidence | Status |
|-------------|-----------|----------|--------|
| TECHDEBT-06 | 05-01-PLAN.md, 05-01-SUMMARY.md | Two independent real Actions runs (`35376233202` Task 1, `35378157988` Task 2), both `conclusion: success`; local 86/86 passing; mutation check reproduced independently | Satisfied |

No orphaned requirements — Phase 5's one REQ-ID (per ROADMAP.md) is claimed by the one plan and independently confirmed above.

## Roadmap Success Criteria (Phase 5)

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | `npm run test:ci` passes a suite covering the 6 named utilities beyond `getLocalUrlCTM.test.ts` | ✓ | Same as must-have 1 |
| 2 | Each covered utility tested for normal behavior + ≥1 edge case | ✓ | Same as must-have 2 |
| 3 | Every module in `src/lib/utils/` accounted for (covered, or excluded with reason) | ✓ | Same as must-have 3 |
| 4 | Deliberate breakage makes a new test fail | ✓ | Same as must-have 4 |
| 5 | Phase 4 workflow picks up expanded suite with no workflow-file edits | ✓ | Same as must-have 5 |

All 5 ROADMAP.md Phase 5 success criteria map 1:1 onto the plan's 5 must-haves and are satisfied by the same evidence.

## Cross-Phase / Regression Check

- Re-ran `npm run astro-check`: 0 errors, 0 warnings, 0 hints, 204 files.
- Re-ran `npm run test:ci`: 7 suites / 86 tests, all passing (up from 43 tests / 1 suite at Phase 4 close).
- Confirmed the Phase 4 CI workflow (`.github/workflows/ci.yml`) required zero edits — both this phase's real Actions runs used the exact same `npm ci` → `toml:watch` → `astro-check` → `test:ci` pipeline Phase 4 established.
- Confirmed the mutation-check probe left `sortFunctions.ts` byte-identical to its pre-probe state (`git diff --stat` empty) before the real commit was made.

## Findings Beyond the Plan's Own Scope

The plan's own `key_links` assumed `marked` (a `textConverter.ts` dependency) "resolve[s] cleanly under the existing Jest/ts-jest setup" — untrue in practice, since no prior test had ever imported `textConverter.ts`. `marked` v17 ships ESM-only, and Jest's CJS-based module runtime cannot parse its `export{...}` syntax. This surfaced as a hard `SyntaxError` the moment `textConverter.test.ts` was added. Fixed with a test-only `moduleNameMapper` entry in `jest.config.ts` pointing `marked` at its own pre-built, CJS-compatible UMD bundle — no production code, build config, or new dependency involved. Documented fully in 05-01-SUMMARY.md's Deviations #1. This is a genuine environment gap this phase's test-writing work surfaced, analogous to Phase 4 surfacing the `tsconfig.jest.json`/stale-assertion defects in the pre-existing suite.

## Outcome

Phase 5 goal achieved: the site's pure utility layer (date formatting, text conversion, sorting, object cloning, protected-text splitting, and trailing-slash handling) now has real, edge-case-inclusive regression tests, enforced by the Phase 4 CI pipeline with zero workflow-file edits. A deliberate breakage was proven to fail a real test, not just "the code still runs." Every one of the 27 modules in `src/lib/utils/` is accounted for with a recorded, defensible reason — nothing silently skipped. TECHDEBT-06 satisfied with direct evidence, not inference.

This closes the last open requirement in the v1.1 milestone (TECHDEBT-05, -06, -07 all now satisfied across Phases 4–5).
