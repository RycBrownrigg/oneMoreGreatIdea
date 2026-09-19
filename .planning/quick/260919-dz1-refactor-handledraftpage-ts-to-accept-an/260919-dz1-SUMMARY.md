---
phase: 260919-dz1-refactor-handledraftpage-ts-to-accept-an
plan: 01
subsystem: testing
tags: [testing, tech-debt, handleDraftPage, jest]
dependency-graph:
  requires: []
  provides:
    - "handleDraftPage optional isProd parameter"
    - "real 404 Response assertion for draft-in-production branch"
  affects:
    - themes/lumio/src/lib/utils/handleDraftPage.ts
    - themes/lumio/src/__tests__/handleDraftPage.test.ts
tech-stack:
  added: []
  patterns:
    - "nullish-coalescing fallback to a truthiness-guarded import.meta.env read, resolved as the first statement in the function body (not as a default parameter value) so Jest's undefined import.meta.env never throws"
key-files:
  created: []
  modified:
    - themes/lumio/src/lib/utils/handleDraftPage.ts
    - themes/lumio/src/__tests__/handleDraftPage.test.ts
    - .planning/PROJECT.md
    - .planning/todos/completed/2026-09-19-refactor-handledraftpage-to-accept-injectable-isprod-param.md
decisions:
  - "Resolved the effective isProd flag via `isProd ?? Boolean(import.meta.env && import.meta.env.PROD)` as the function's first statement, guarding on import.meta.env's own truthiness before reading .PROD off it — a default-parameter form was rejected per the plan's key_links because it would evaluate (and throw) on every omitted-argument call under Jest"
  - "Deleted the pre-existing test asserting a TypeError throw on draft:true, since the refactor makes that assertion false; replaced its coverage with real Response assertions plus the omitted-argument fallback test"
metrics:
  duration: ~15 minutes
  completed: 2026-09-19
actuals:
  tokens: 1896
  tasks: 3
  commits: 3
status: complete
---

# Phase 260919-dz1 Plan 01: Refactor handleDraftPage.ts to accept an injectable isProd param Summary

**One-liner:** Added an optional, backward-compatible `isProd` parameter to `handleDraftPage` so its 404-`Response` production branch is asserted directly against a real `Response` object under Jest, instead of only being provable to throw.

## What Was Built

`handleDraftPage(pageData, isProd?)` now takes an optional second parameter. When supplied, it overrides the production flag directly (used by tests). When omitted — which is how all 5 production `.astro` call sites use it — it falls back to a guarded read of `import.meta.env.PROD`, preserving the exact build-time token sequence Vite/Astro statically replaces.

The test file (`handleDraftPage.test.ts`) grew from 2 tests to 5:
1. `draft: false` → undefined (retained, unchanged — proves the omitted-argument path still short-circuits)
2. `draft: true, isProd: true` → real `Response` with `status: 404` / `statusText: "Not Found"` (new — the core gap this plan closes)
3. `draft: false, isProd: true` → undefined (new — draft check gates the production check)
4. `draft: true, isProd: false` → undefined (new — dev-mode passthrough)
5. `draft: true`, argument omitted → undefined under Jest (new — pins the fallback path the 5 production call sites actually exercise)

The obsolete test asserting a `TypeError` on `draft: true` was deleted, and the file's stale 10-line header comment (explaining why the branch could only be proven to throw) was replaced with a 6-line comment describing the current injectable-parameter design.

`.planning/PROJECT.md`'s TECHDEBT-10 bullet and the corresponding Key Decisions outcome column no longer claim the 404-branch is structurally unreachable under Jest; both now state the branch is covered and cite this quick task. The todo file `2026-09-19-refactor-handledraftpage-to-accept-injectable-isprod-param.md` was moved from `.planning/todos/pending/` to `.planning/todos/completed/` via `git mv`, body untouched.

## Task Commits

| Task | Commit | Summary |
|------|--------|---------|
| 1 | f894ce5 | `feat(260919-dz1)`: injectable `isProd` param + first 404-Response test (RED confirmed via TS2554, then GREEN) |
| 2 | 80233a8 | `test(260919-dz1)`: 3 remaining behavior-matrix tests + stale comment rewrite |
| 3 | 980100c | `docs(260919-dz1)`: PROJECT.md reconciliation + todo file move (rename-detected by git) |

## Verification (full plan gate, run after all 3 tasks)

1. `npm --prefix themes/lumio run test:ci` → `Test Suites: 20 passed, 20 total`, `Tests: 124 passed, 124 total`. PASS.
2. `npm --prefix themes/lumio run astro-check` → `Result (217 files): 0 errors, 0 warnings, 0 hints`. PASS.
3. `git diff --name-only 36334be..HEAD -M` → exactly the 4 `files_modified` paths (todo move shown at its new path under rename detection), no `.astro` file touched. PASS.
4. Regression sanity: flipped `status: 404` → `403` in `handleDraftPage.ts`, re-ran targeted test — failed as expected (`Tests: 1 failed, 4 passed, 5 total`, with the exact `Expected: 404 / Received: 403` diagnostic). Reverted via the `.bak` copy `sed -i` had made; `git status --short` on the file showed no diff afterward, and the 5-test suite passed clean again. PASS — the new test genuinely catches the regression it exists to catch.

All 4 verification steps pass. Success criteria from the plan are met: optional second parameter, all 5 call sites byte-unchanged, real `Response` assertions in place, dev passthrough and non-draft short-circuit both covered, obsolete TypeError test and stale comment gone, full suite at 20/124, PROJECT.md and todo file reconciled.

## Deviations from Plan

None — plan executed exactly as written, including the RED-then-GREEN discipline on Task 1's tracer gate and the break-and-revert regression check specified in the plan's own `<verification>` block.

## Known Stubs

None.

## Threat Flags

None — this plan's threat model was fully addressed in-scope (T-DZ1-01 and T-DZ1-02 mitigated by the new tests per the plan; T-DZ1-03 accepted as documented in the plan's threat register).

## Self-Check: PASSED

- FOUND: themes/lumio/src/lib/utils/handleDraftPage.ts
- FOUND: themes/lumio/src/__tests__/handleDraftPage.test.ts
- FOUND: .planning/todos/completed/2026-09-19-refactor-handledraftpage-to-accept-injectable-isprod-param.md
- MISSING (expected, moved away): .planning/todos/pending/2026-09-19-refactor-handledraftpage-to-accept-injectable-isprod-param.md
- FOUND commit f894ce5 in `git log --oneline`
- FOUND commit 80233a8 in `git log --oneline`
- FOUND commit 980100c in `git log --oneline`
