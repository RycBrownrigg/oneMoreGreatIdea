---
status: complete
phase: 06-utility-test-coverage-completion
plan: 01
subsystem: test-harness
tags: [jest, testing, techdebt, harness]
dependency-graph:
  requires: []
  provides:
    - "Working @/* / .astro/config.generated.json / import.meta-capable Jest harness (tsconfig.jest.json, jest.config.ts, package.json)"
    - "handleDraftPage.test.ts, buildToc.test.ts, navigationActive.test.ts, JsonLdGenerator.test.ts, absoluteUrl.test.ts"
  affects:
    - "06-02, 06-03, 06-04 (Wave 2) — build directly on this plan's proven harness, no re-derivation needed"
tech-stack:
  added: []
  patterns:
    - "Real ESM mode for ts-jest (NODE_OPTIONS=--experimental-vm-modules + module: esnext in tsconfig.jest.json) instead of CJS-only, unlocking import.meta parsing"
    - "moduleNameMapper entries for @/* alias and bare .astro/config.generated.json specifier, mirroring tsconfig paths but required separately for runtime resolution"
key-files:
  created:
    - themes/lumio/src/__tests__/handleDraftPage.test.ts
    - themes/lumio/src/__tests__/buildToc.test.ts
    - themes/lumio/src/__tests__/navigationActive.test.ts
    - themes/lumio/src/__tests__/JsonLdGenerator.test.ts
    - themes/lumio/src/__tests__/absoluteUrl.test.ts
  modified:
    - themes/lumio/tsconfig.jest.json
    - themes/lumio/jest.config.ts
    - themes/lumio/package.json
decisions:
  - "Removed the old ^marked$ -> UMD-build moduleNameMapper entry rather than keeping it alongside the new @/*/config.generated.json mappings — real ESM mode lets Jest resolve marked's native ESM build directly, and keeping both broke textConverter.test.ts with \"does not provide an export named 'marked'\" (empirically confirmed during planning, reconfirmed here)."
metrics:
  duration: "~20 minutes"
  completed: 2026-09-18
actuals:
  tokens: 2851
  tasks: 3
  commits: 3
requirements-completed:
  - TECHDEBT-10
  - TECHDEBT-15
  - TECHDEBT-16
  - TECHDEBT-19
  - TECHDEBT-20
commits:
  - 7fd7ef3
  - 8fc0322
  - 14dc893
---

# Phase 6 Plan 1: Jest Harness Fix + 5 Utility Test Files Summary

Fixed three pre-existing gaps in the Jest test harness (`@/*` path aliases, the bare `.astro/config.generated.json` specifier, and `import.meta` syntax) via real ESM mode, then wrote real-behavior regression tests for the 5 hardest-to-test utility modules (handleDraftPage, buildToc, navigationActive, JsonLdGenerator, absoluteUrl), proving the fix before Wave 2's remaining 9 modules build on it.

## What Was Built

- **Task 1 (tracer) — Harness fix + `handleDraftPage.test.ts`:**
  - `themes/lumio/tsconfig.jest.json` — added `module: "esnext"`, `baseUrl: "."`, `paths: { "@/*": ["./src/*"] }`. This tsconfig does not `extend` the project's root `tsconfig.json`, so it had none of the `@/*` alias mapping (causing ts-jest's per-file type-check to throw TS2307 even on type-only imports) and no explicit `module` (an unset `module` defaults to CommonJS internally in ts-jest's `fixupCompilerOptionsForModuleKind`, silently overriding any attempt at ESM mode and breaking `import.meta` parsing with TS1343).
  - `themes/lumio/jest.config.ts` — `moduleNameMapper` now maps `^@/(.*)$` to `<rootDir>/src/$1` (runtime resolution — ts-jest only uses tsconfig `paths` for type-checking, not module resolution) and `^\.astro/config\.generated\.json$` to the real generated file (a bare, non-relative specifier some modules import verbatim that Node's own resolver can't handle). The old `^marked$` → UMD-build mapping was removed since real ESM mode resolves `marked`'s native ESM build directly.
  - `themes/lumio/package.json` — prepended `NODE_OPTIONS=--experimental-vm-modules` to both `test` and `test:ci` scripts, the piece that actually makes `import.meta` legal at runtime (without it, ts-jest silently compiles everything as CommonJS regardless of tsconfig).
  - `handleDraftPage.test.ts` — 2 tests: `draft: false` returns `undefined` (short-circuits before touching `import.meta.env`); `draft: true` throws `TypeError: Cannot read properties of undefined (reading 'PROD')` — real, harness-observed behavior under Jest (where `import.meta.env` is never injected by Vite/Astro), documented as distinct from the production 404-Response behavior inside a real Astro build.
  - Tracer feedback gate: re-ran `npm run test:ci` end-to-end after this task — 8 suites / 88 tests passing, zero regressions — before proceeding to Tasks 2-3.

- **Task 2 — `buildToc.test.ts` and `navigationActive.test.ts`:**
  - `buildToc.test.ts` — 3 tests against the live `settings.markup.tableOfContents` config (`startLevel: 1, endLevel: 5, ordered: false`): depth-3 heading nests under the preceding depth-2 heading with insertion order preserved (not alphabetical, since `ordered: false`); a depth-6 heading (outside `[1,5]`) is excluded entirely; an empty `headings` array returns `[]` without throwing.
  - `navigationActive.test.ts` — 4 tests (`isActiveUrl` + `isActiveMenu`): an absolute external URL never matches any `currentPath`; `undefined` as `url` returns `false` without throwing; a disabled (`enable: false`) menu item returns `false` even when its `url` exactly matches `currentPath` (the enabled-check short-circuits first); recursion into `children` — a matching child makes a non-matching parent return `true`, and no match anywhere (parent or children) returns `false`.

- **Task 3 — `JsonLdGenerator.test.ts` and `absoluteUrl.test.ts`:**
  - `absoluteUrl.test.ts` — 2 tests: a root-relative path resolves against the fake `Astro.url`'s origin (root-relative, not relative to a trailing path segment); an already-absolute URL passes through unchanged (per the `URL` constructor's own spec — an absolute `url` argument ignores `base` entirely).
  - `JsonLdGenerator.test.ts` — 2 tests using a fake `Astro` object and a minimal fake `config`: the generated object has `"@type": "WebPage"`, `isPartOf.url` equal to the trailing-slash-normalized `Astro.url.origin` (via the real, unmocked `trailingSlashChecker`, which reads the live `.astro/config.generated.json`), and `publisher.logo.url` equal to `config.site.logo` resolved to an absolute URL (via the real, unmocked `absoluteUrl`); omitting `lang` from the input falls back to `config.settings.multilingual.defaultLanguage`.

## Real Verification (not simulated)

- Baseline confirmed before any change: `npm --prefix themes/lumio run test:ci` — 7 suites, 86 tests, all passing.
- After Task 1: 8 suites, 88 tests, all passing (2 new handleDraftPage tests, zero regressions).
- After Task 2: 10 suites, 95 tests, all passing (+7: 3 buildToc + 4 navigationActive, zero regressions).
- After Task 3: 12 suites, 99 tests, all passing (+4: 2 absoluteUrl + 2 JsonLdGenerator, zero regressions) — exceeds the plan's minimum of 92.
- `npm --prefix themes/lumio run astro-check` re-run after every task: consistently `0 errors, 0 warnings, 0 hints` (204→207→209 files as new test files were added), confirming `tsconfig.jest.json`'s change stayed isolated to the Jest-only config and never touched the main `tsconfig.json`-driven Astro type-check.
- `git diff --stat -- themes/lumio/src/lib/utils/` (from repo root) returned no output after every task — no production module file was touched.

## Deviations from Plan

None — plan executed exactly as written. All three empirically-pre-verified harness gaps (`@/*`, `.astro/config.generated.json`, `import.meta`) were exactly as described in the plan's `<action>` reasoning, and the fix worked on the first attempt for every task.

## Known Stubs

None.

## Self-Check: PASSED

- `themes/lumio/tsconfig.jest.json` — FOUND, modified as described.
- `themes/lumio/jest.config.ts` — FOUND, modified as described.
- `themes/lumio/package.json` — FOUND, modified as described.
- `themes/lumio/src/__tests__/handleDraftPage.test.ts` — FOUND.
- `themes/lumio/src/__tests__/buildToc.test.ts` — FOUND.
- `themes/lumio/src/__tests__/navigationActive.test.ts` — FOUND.
- `themes/lumio/src/__tests__/JsonLdGenerator.test.ts` — FOUND.
- `themes/lumio/src/__tests__/absoluteUrl.test.ts` — FOUND.
- Commit `7fd7ef3` — FOUND in `git log --oneline --all`.
- Commit `8fc0322` — FOUND in `git log --oneline --all`.
- Commit `14dc893` — FOUND in `git log --oneline --all`.
