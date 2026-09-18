---
status: complete
phase: 05-utility-test-coverage
plan: 01
requirements-completed:
  - TECHDEBT-06
commits:
  - c8929ac
  - 8ac5d29
---

# Summary: Utility Test Coverage

## What Was Built

- `themes/lumio/src/__tests__/dateFormat.test.ts` (Task 1) — default/alternate pattern, string-vs-Date input equivalence, unsupported-pattern throw. Noon-UTC fixed timestamp to stay timezone-safe between local (`America/Denver`) and CI (UTC).
- `themes/lumio/src/__tests__/textConverter.test.ts` — one normal + one empty/falsy test for all 9 exports (`slugifyyy`, `markdownify`, `humanize`, `titleify`, `plainify`, `toUpperCase`, `toLowerCase`, `toSentenceCase`, `removeWhitespace`). Covers `markdownify`'s `container` true/false branching (block `<p>` vs inline) and its custom link renderer's two `rel`/`target` variants (`getastrothemes`-containing href vs a plain external URL). `plainify` exercised against real `marked.parse` HTML output, asserting tag stripping and entity decoding.
- `themes/lumio/src/__tests__/sortFunctions.test.ts` — `sortByDate` descending order plus an equal-dates case (asserts no crash, correct membership); `sortByWeight` ascending order, `null`/`undefined` weight sorting last via the `Infinity` fallback, recursion into `.children`, and non-mutation of the input array.
- `themes/lumio/src/__tests__/objectFunctions.test.ts` — `recursiveCloneObject`: nested object/array independence from the original (mutating the clone doesn't affect the source — the function's actual reason for existing), a primitive passed straight through, and an array-of-objects preserving both array-ness and nested-object independence.
- `themes/lumio/src/__tests__/splitProtectedText.test.ts` — a URL with internal slashes survives as one segment; real `/`-separated text splits correctly; default `{{ year }}` placeholder replaced with `new Date().getFullYear()` computed at test time; a custom `yearPlaceholder` option honored.
- `themes/lumio/src/__tests__/trailingSlashChecker.test.ts` — read the actual `config.site.trailingSlash` value (currently `true`) before writing assertions: a slash-less URL gains one, an already-slashed one is unchanged, and a `#fragment` is preserved and correctly reattached in both cases.
- `themes/lumio/jest.config.ts` — added a `moduleNameMapper` entry for `marked` → its UMD build (see Deviations below).

## Real Verification (not simulated)

- Local: `npm run test:ci` from `themes/lumio/` — 7 suites, 86 tests, all passing (1 pre-existing `getLocalUrlCTM` + 6 new).
- `npm run astro-check` — 204 files, 0 errors/warnings/hints.
- Mutation check (must_have #4): temporarily changed `sortFunctions.ts`'s `a.weight ?? Infinity` / `b.weight ?? Infinity` to `?? -Infinity`. Re-ran `npm run test:ci` — the new "treats a null/undefined weight as Infinity, sorting it last" test failed exactly as expected (`Expected: "low"`, `Received: "unweighted"`), all other tests still passed. Reverted the change; `git diff --stat -- themes/lumio/src/lib/utils/` returned `0` (no lines, confirming a clean revert); re-ran `npm run test:ci` — green again (86/86). The probe was never committed.
- Real GitHub Actions runs, both `conclusion: success`:
  - `35376233202` (commit `c8929ac`, Task 1 — `dateFormat.test.ts`)
  - `35378157988` (commit `8ac5d29`, Task 2 — remaining 5 test files + jest config fix), full job log confirms `npm run astro-check` and `npm run test:ci` both green in the real runner.

## Per-Module Accounting — `src/lib/utils/` (27 total)

### (a) Covered this phase (6)

| Module | Test file |
|---|---|
| `dateFormat.ts` | `dateFormat.test.ts` |
| `textConverter.ts` | `textConverter.test.ts` |
| `sortFunctions.ts` | `sortFunctions.test.ts` |
| `objectFunctions.ts` | `objectFunctions.test.ts` |
| `splitProtectedText.ts` | `splitProtectedText.test.ts` |
| `trailingSlashChecker.ts` | `trailingSlashChecker.test.ts` |

### (b) Astro/DOM/filesystem-coupled — cannot be unit-tested without a fundamentally different harness (8)

| Module | Reason |
|---|---|
| `bgOptimizedImage.ts` | Imports `astro:assets` |
| `removeUnusedFonts.ts` | Filesystem I/O |
| `remarkParseContent.ts` | Operates on mdast AST via `unist-util-visit`, needs realistic remark tree fixtures |
| `AstroFont.ts` | Imports `astro/config`'s `fontProviders` |
| `localizedRouteResolver.ts` | Imports `.astro` component files and `astro:content` |
| `downloadSelfHostedFonts.ts` | Filesystem I/O, already `@ts-nocheck` |
| `FormHandle.ts` | DOM/browser APIs; already typed under strict mode in v1.0 (TECHDEBT-03), no unit-test harness for browser DOM here |
| `i18nUtils.ts` | Already covered — `getLocalUrlCTM.test.ts` (pre-existing, fixed in Phase 4) |

### (c) Pure and testable but deliberately deferred — outside this phase's named scope (13)

Logged as **TECHDEBT-08** in `.planning/REQUIREMENTS.md`'s v2 backlog — pure, testable, but not named in ROADMAP.md's Phase 5 goal or REQUIREMENTS.md's TECHDEBT-06 examples:

`generateTypeScale.ts`, `filteredEnabled.ts`, `handleDraftPage.ts`, `overrideObjects.ts`, `uniqueIdGenerator.ts`, `removeEmptyKeys.ts`, `readingTime.ts`, `buildToc.ts`, `navigationActive.ts`, `getRelatedContent.ts`, `preline.ts`, `absoluteUrl.ts`, `JsonLdGenerator.ts`

6 + 8 + 13 = 27. No module omitted.

## Deviations from Plan

1. **`marked` is ESM-only and broke Jest's default CJS module runtime — not anticipated by the plan.** The plan's `key_links` asserted `marked` "resolve[s] cleanly under the existing Jest/ts-jest setup," but that was never actually exercised — no prior test imported `textConverter.ts` (the only module depending on `marked`). `marked` v17's `package.json` declares `"type": "module"` with only an ESM entry point (`node_modules/marked/lib/marked.esm.js`, using `export{...}` syntax); Jest's `jest-runtime` compiles node_modules files as CommonJS via `vm.Script` regardless of that field (ts-jest's `extensionsToTreatAsEsm` only covers `.ts`/`.tsx`/`.mts`, not node_modules `.js`), so requiring it threw `SyntaxError: Unexpected token 'export'`. Fixed by adding a `moduleNameMapper` entry in `themes/lumio/jest.config.ts` mapping `^marked$` to `marked`'s own CJS-compatible UMD build (`themes/lumio/node_modules/marked/lib/marked.umd.js`, already shipped in the package) — test-only, no production code or build config touched, no new dependency installed.
2. **Subagents (planner/executor) skipped again**, consistent with Phase 4 and Task 1 of this same plan — the orchestrating session wrote and ran Task 2 directly, per the standing decision logged in Phase 4/5's decision history (repeated multi-hour stalls earlier this milestone).
3. **Stale, already-consumed `HANDOFF.json` cleaned up** in this task's commit — it was a one-shot resume artifact from the session that paused after Task 1, already fully superseded by `.continue-here.md`'s equivalent content; its deletion had been made on disk but never committed.

## Known Stubs

None.

## Self-Check: PASSED
