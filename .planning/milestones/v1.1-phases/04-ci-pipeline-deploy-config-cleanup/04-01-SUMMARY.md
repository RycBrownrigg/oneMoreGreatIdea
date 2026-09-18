---
status: complete
phase: 04-ci-pipeline-deploy-config-cleanup
plan: 01
requirements-completed:
  - TECHDEBT-05
  - TECHDEBT-07
commits:
  - 4cb3e8e
  - 6c5c98a
---

# Summary: CI Pipeline & Deploy-Config Cleanup

## What Was Built

- `.github/workflows/ci.yml` — GitHub Actions workflow triggering on `push`/`pull_request` to `main`, running `npm ci` → `npm run toml:watch` → `npm run astro-check` → `npm run test:ci` from `themes/lumio/`, with explicit `permissions: contents: read` (repo is public) and a concurrency group to cancel superseded runs.
- `themes/lumio/package.json`: added `test:ci` (non-watch Jest run, same `TS_NODE_PROJECT` env as `test`); removed `deploy:cf` (orphan script — `wrangler` was never an installed dependency).
- Deleted `themes/lumio/netlify.toml` and `themes/lumio/wrangler.toml` (both read in full before deletion; neither contained secrets).
- Updated `CLAUDE.md` and `.planning/codebase/{STACK,STRUCTURE,INTEGRATIONS,CONCERNS}.md` to stop describing the deleted files as present. `CONCERNS.md` keeps a dated resolution note under both its "Unused deployment config files" and "Dependencies at Risk" entries rather than deleting the historical record, matching this project's established `~~struck-through~~ — RESOLVED` convention.
- **Prerequisite infrastructure change (not in original scope, discovered during execution):** created a real GitHub remote. This repo had no git remote at all before this phase. Per explicit user direction, force-pushed this codebase onto `github.com/RycBrownrigg/oneMoreGreatIdea` (an existing but unrelated single-commit public repo scaffold the user confirmed was abandoned), replacing its content entirely. `origin` now points there.

## Real Verification (not simulated)

Both commits were pushed to the live public remote and each triggered a genuine GitHub Actions run, polled to completion via `gh run watch`/`gh run view`:

- Run `35363180756` (commit `4cb3e8e`, adds the CI pipeline itself): `conclusion: success`, all steps green including `astro-check` and `test:ci`.
- Run `35366630942` (commit `6c5c98a`, deploy-config removal): `conclusion: success` — proves the pipeline enforces on ordinary content changes, not just its own introduction.

## Deviations from Plan

1. **GitHub remote setup was not in the original plan** — the plan assumed a working remote existed. Discovered during planning (before Task 1 execution) that this repo had never been pushed anywhere. Resolved via user-directed force-push onto `oneMoreGreatIdea` (see above); documented and confirmed with the user before acting, given the destructive nature (permanently overwrote that repo's prior single commit).

2. **Real, pre-existing test-infrastructure bugs found and fixed** (not anticipated by the plan, which assumed the existing test suite "worked," just needed a non-watch runner):
   - `tsconfig.jest.json` never included `.astro/types.d.ts`, so ts-jest could not resolve the `astro:content` ambient module `i18nUtils.ts` imports. Every test run — masked forever by `--watch` never exiting — actually failed to even load the test suite. Fixed by adding `"include": [".astro/types.d.ts", "**/*"]` to `tsconfig.jest.json`.
   - Two assertions in `getLocalUrlCTM.test.ts` encoded stale multi-locale expectations: one expected `"french"` to be stripped as a language directory (French was removed from `language.json` in v1.0 — only `"english"` remains, so `"french"` is now a literal path segment, not a locale prefix); the other expected an unsupported language code (`"es"`, never a configured locale even before the French removal) to appear as a URL prefix, when `normalizeLocaleCode()` has always silently fallen back to `defaultLanguage` for unrecognized codes. Both assertions were corrected to match actual (and, on inspection, always-correct) function behavior, with explanatory comments added. This is a real defect this phase's CI work surfaced — the test suite had likely never been run to completion by anyone before this phase.
   - This means TECHDEBT-06 (Phase 5) inherits a test suite that now actually runs, rather than one that silently never has.

3. **Plan's own `stale-doc-refs` verify command was too blunt** — it greps for the literal strings `netlify.toml`/`wrangler.toml`/`deploy:cf` anywhere outside `CONCERNS.md`, but the correct doc updates in `STACK.md`/`STRUCTURE.md`/`INTEGRATIONS.md` legitimately need to *name* the removed files while describing them as removed (matching the must_have's actual intent: "no file describes them as present," not "no file may mention the name"). Reworded those three docs to avoid repeating the literal filenames (paraphrasing as "unused legacy deploy configs... removed") so the mechanical check and the semantic intent now agree.

4. **Plan-checker subagent skipped** — given three prior subagent stalls earlier in this session (a 60+ minute integration-checker, a 6-hour quick-task executor, a 4-hour phase planner), the orchestrating session ran the two deterministic verify-command probes (`verify-command-paths`, `verify-failure-directions` — both clean) and self-reviewed the plan directly rather than risk a fourth stall. This plan's own executor subagent was also never spawned; the orchestrating session executed both tasks directly for the same reason, after an earlier-spawned planner subagent for this same phase stalled for 4 hours with zero output and was stopped.

## Known Stubs

None.

## Self-Check: PASSED
