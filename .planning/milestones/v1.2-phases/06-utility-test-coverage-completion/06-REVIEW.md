---
phase: 06-utility-test-coverage-completion
reviewed: 2026-09-19T00:00:00Z
depth: standard
files_reviewed: 16
files_reviewed_list:
  - themes/lumio/jest.config.ts
  - themes/lumio/package.json
  - themes/lumio/src/__tests__/absoluteUrl.test.ts
  - themes/lumio/src/__tests__/buildToc.test.ts
  - themes/lumio/src/__tests__/filteredEnabled.test.ts
  - themes/lumio/src/__tests__/generateTypeScale.test.ts
  - themes/lumio/src/__tests__/getRelatedContent.test.ts
  - themes/lumio/src/__tests__/handleDraftPage.test.ts
  - themes/lumio/src/__tests__/JsonLdGenerator.test.ts
  - themes/lumio/src/__tests__/navigationActive.test.ts
  - themes/lumio/src/__tests__/overrideObjects.test.ts
  - themes/lumio/src/__tests__/preline.test.ts
  - themes/lumio/src/__tests__/readingTime.test.ts
  - themes/lumio/src/__tests__/removeEmptyKeys.test.ts
  - themes/lumio/src/__tests__/uniqueIdGenerator.test.ts
  - themes/lumio/tsconfig.jest.json
findings:
  critical: 0
  warning: 2
  info: 2
  total: 4
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-09-19
**Depth:** standard
**Files Reviewed:** 16
**Status:** issues_found

## Summary

This phase adds/extends 14 Jest unit test files for `src/lib/utils/*` helpers, switches Jest to real ESM mode (`NODE_OPTIONS=--experimental-vm-modules`), and adds `@/*` / bare `.astro/config.generated.json` entries to `jest.config.ts`'s `moduleNameMapper`, plus matching `paths`/`baseUrl`/`module` additions in `tsconfig.jest.json`.

I read every assertion against the actual implementation it exercises (`buildToc`, `filteredEnabled`, `generateTypeScale`, `getRelatedContent`, `handleDraftPage`, `JsonLdGenerator`, `navigationActive`, `overrideObjects`, `preline`, `readingTime`, `removeEmptyKeys`, `uniqueIdGenerator`, `absoluteUrl`, `trailingSlashChecker`, `objectFunctions.recursiveCloneObject`) and ran the full suite (`npm run test:ci`, 20 suites / 121 tests, all green with `.astro/config.generated.json` present). All assertions are factually correct against current implementation behavior — I did not find any test that asserts the wrong outcome.

The issues found are about **test/config robustness**, not incorrect assertions: three of the new test files have an unguarded runtime dependency on a gitignored, generated artifact (verified by deleting it and re-running the suite — 3 of the new suites and 2 pre-existing ones fail immediately with confusing TS "cannot find module" errors), and one in-scope comment in `jest.config.ts` misattributes a dependency that doesn't exist in the source it names. Neither is exploitable/production-facing (this is a static site with no server runtime), but both degrade the reliability and trustworthiness of the new test infrastructure for future contributors and any CI path that isn't `.github/workflows/ci.yml`'s exact step order.

## Warnings

### WR-01: New tests depend on a gitignored generated file with no `pretest` safeguard

**File:** `themes/lumio/package.json:17-18` (also affects `themes/lumio/src/__tests__/buildToc.test.ts`, `themes/lumio/src/__tests__/navigationActive.test.ts`, `themes/lumio/src/__tests__/JsonLdGenerator.test.ts`)

**Issue:** `buildToc.ts`, `navigationActive.ts`, and (transitively, via `trailingSlashChecker.ts`) `JsonLdGenerator.ts` all import `.astro/config.generated.json` at module load time. That file is gitignored (`themes/lumio/.gitignore:28`) and only produced by `npm run toml:watch`. The `test` and `test:ci` npm scripts do **not** run `toml:watch` first, and there is no `pretest`/`pretest:ci` script.

I verified this is a real, reproducible failure mode: with the generated file present, `npm run test:ci` passes (20/20 suites, 121/121 tests). After deleting `themes/lumio/.astro/config.generated.json` and re-running the identical command, five suites fail to even load, including two of this phase's new files:
```
FAIL src/__tests__/buildToc.test.ts
FAIL src/__tests__/JsonLdGenerator.test.ts
FAIL src/__tests__/navigationActive.test.ts
FAIL src/__tests__/trailingSlashChecker.test.ts
FAIL src/__tests__/getLocalUrlCTM.test.ts
```
each with a `TS2307: Cannot find module '...astro/config.generated.json'` error rather than any message pointing at the real cause (missing `toml:watch` step).

`.github/workflows/ci.yml` happens to call `npm run toml:watch` before `npm run test:ci`, so the documented CI path is unaffected. But any contributor who runs `npm test` / `npm run test:ci` directly on a fresh clone (before ever running `npm run dev`/`npm run build`, which are the only scripts that currently trigger `toml:watch`) will hit this, and any future CI reordering silently reintroduces it. This phase added two more test files onto this already-fragile pattern without closing the gap.

**Fix:** Add a `pretest`/`pretest:ci` script (npm auto-runs `pre*` hooks) so `npm test`/`npm run test:ci` are self-sufficient:
```json
"pretest": "npm run toml:watch",
"pretest:ci": "npm run toml:watch",
"test": "cross-env TS_NODE_PROJECT=\"./tsconfig.jest.json\" NODE_OPTIONS=--experimental-vm-modules jest --watch",
"test:ci": "cross-env TS_NODE_PROJECT=\"./tsconfig.jest.json\" NODE_OPTIONS=--experimental-vm-modules jest"
```

### WR-02: `jest.config.ts` comment misattributes a dependency `handleDraftPage.ts` doesn't have

**File:** `themes/lumio/jest.config.ts:17`
**Issue:** The comment introduced by this phase says the `@/*` and `.astro/config.generated.json` `moduleNameMapper` entries are both "required for modules that import `@/*` aliases or the bare `.astro/config.generated.json` specifier (**handleDraftPage.ts**, buildToc.ts, navigationActive.ts, JsonLdGenerator.ts)". I checked `themes/lumio/src/lib/utils/handleDraftPage.ts` in full: it has zero `import` statements (only an unrelated `import.meta.env.PROD` runtime access) and needs neither mapping. This is a real but harmless-today misattribution that will mislead the next person who edits this mapping and tries to remove/simplify it based on this comment's stated dependents.

**Fix:** Correct the attribution, e.g.:
```ts
// - `@/*` mirrors tsconfig.jest.json's `paths` entry for *runtime*
//   resolution — ts-jest only uses tsconfig `paths` for type-checking.
//   Needed by: navigationActive.test.ts (imports `@/types`).
// - `.astro/config.generated.json` resolves the exact bare,
//   non-relative specifier some modules import verbatim (mirroring
//   how astro.config.mjs imports it); Node's resolver can't resolve a
//   bare specifier starting with a literal dot on its own.
//   Needed by: buildToc.ts (direct bare import) and, transitively via
//   trailingSlashChecker.ts, JsonLdGenerator.ts. navigationActive.ts
//   uses a relative import instead and doesn't need this entry.
```

## Info

### IN-01: `handleDraftPage.test.ts` never exercises the real production behavior it documents

**File:** `themes/lumio/src/__tests__/handleDraftPage.test.ts:12-20`
**Issue:** The file's own comment (lines 3-10) correctly explains that under Jest, `import.meta.env` is `undefined`, so the `draft: true` case can only be asserted to *throw* a `TypeError`, not to return the documented 404 `Response`. That's an honest and well-documented limitation, but the practical effect is that the one behavior `handleDraftPage`'s JSDoc describes as its purpose — "returns a 404 Response if draft is true" in production — has no test coverage at all in this suite. Only the "not draft" short-circuit and a Jest-harness artifact are verified.
**Fix:** If real coverage of the 404 branch is wanted, stub `import.meta.env.PROD` before the call, e.g. via `jest.replaceProperty(import.meta.env, "PROD", true)` (Jest 29.4+) or by refactoring `handleDraftPage` to accept an injectable `isProd` parameter defaulting to `import.meta.env.PROD`, then assert `status === 404` on the returned `Response`. Otherwise, consider renaming the second test to make the coverage gap explicit (e.g. "documents current inability to test the 404 branch under Jest") so a future reader doesn't assume the 404 path is covered.

### IN-02: `tsconfig.jest.json`'s `moduleResolution: "node10"` breaks standalone type-checking of this config

**File:** `themes/lumio/tsconfig.jest.json:4,8-11`
**Issue:** This phase adds `"module": "esnext"`, `"baseUrl": "."`, and a `paths` block to `tsconfig.jest.json`, but leaves the pre-existing `"moduleResolution": "node10"` (TypeScript's deprecated classic resolver) untouched. I confirmed `ts-jest`'s actual test runs are unaffected (all 121 tests pass, since ts-jest only requests diagnostics for the files it transforms). However, running `npx tsc -p tsconfig.jest.json --noEmit` directly — a reasonable sanity check for anyone touching this file — fails with dozens of cascading errors against `astro`'s and other dependencies' `exports`-field type declarations (e.g. `Cannot find module 'astro/zod'... Consider updating to 'node16', 'nodenext', or 'bundler'`), because `node10` resolution can't follow modern `exports` maps. This is pre-existing risk that the new `paths` addition sits on top of; not introduced by this diff, but worth fixing while the file is being touched.
**Fix:** Update `moduleResolution` to `"bundler"` (matches `"module": "esnext"` and is what the compiler itself suggests) and re-run `npm run test:ci` to confirm ts-jest still passes with the corrected setting.

---

_Reviewed: 2026-09-19_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
