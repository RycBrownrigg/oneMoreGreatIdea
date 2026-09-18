---
phase: 04-ci-pipeline-deploy-config-cleanup
verified: 2026-09-18T00:00:00Z
status: passed
score: 6/6 must-haves verified
behavior_unverified: 0
overrides_applied: 0
---

# Phase 4 Verification: CI Pipeline & Deploy-Config Cleanup

## Method

Verified directly against live state rather than via subagent (see plan SUMMARY's Deviations section — three prior subagent stalls earlier in this session led the orchestrating session to execute and verify this phase directly). Every claim below was checked against the actual filesystem, git history, and two real GitHub Actions runs — not inferred from the plan or SUMMARY text.

## Must-Haves (from 04-01-PLAN.md)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `.github/workflows/ci.yml` triggers on push to main and PR against main | ✓ | File exists; `on.push.branches: [main]`, `on.pull_request.branches: [main]` |
| 2 | A real GitHub Actions run completed with `conclusion: success`, running astro check and Jest | ✓ | Run `35363180756` (commit `4cb3e8e`): `conclusion: success`, all steps green |
| 3 | `test:ci` is non-interactive (no `--watch`) and exits 0 on a clean tree | ✓ | `package.json` script confirmed; local run: 43/43 tests passed, exit 0 |
| 4 | `netlify.toml`, `wrangler.toml`, `deploy:cf` no longer exist | ✓ | `git ls-files` returns 0 matches; `deploy:cf` absent from `package.json` scripts |
| 5 | `npm run build` still succeeds; `deploy.sh` unaffected | ✓ | Build: 49 pages, exit 0; `deploy.sh` never referenced netlify/wrangler to begin with |
| 6 | No tracked file describes the removed configs as present; contact-form Netlify code untouched | ✓ | `CLAUDE.md`/codebase docs reworded (not just grepped-clean); `git diff --stat` on `FormHandle.ts`/`ContactForm.astro`/`CommentForm.astro` is empty |

## Requirements Coverage

| Requirement | Claimed by | Evidence | Status |
|-------------|-----------|----------|--------|
| TECHDEBT-05 | 04-01-PLAN.md, 04-01-SUMMARY.md | Two independent real Actions runs (`35363180756`, `35366630942`), both `conclusion: success` | Satisfied |
| TECHDEBT-07 | 04-01-PLAN.md, 04-01-SUMMARY.md | Files deleted, script removed, docs corrected, contact form untouched | Satisfied |

No orphaned requirements — both phase 4 REQ-IDs (per ROADMAP.md) are claimed by the one plan and independently confirmed above.

## Roadmap Success Criterion 3 — Gate Genuinely Gates (Not Green-by-Default)

Not covered by the plan's own must_haves, but an explicit ROADMAP.md success criterion: "Deliberately introducing a type error, and separately a failing test, each turn the workflow red — proving the gate is real and not a green-by-default workflow (both reverted afterwards)." Performed after initial phase completion, when this gap was noticed during verification:

- Appended a deliberate type error to `dateFormat.ts` (`const _typeErrorProbe: number = 'this is a string not a number';`) — `npm run astro-check` correctly exited 1 with `1 error`. Reverted from backup; `git diff --stat` on the file is empty.
- Temporarily changed one test assertion in `getLocalUrlCTM.test.ts` to an impossible expected value — `npm run test:ci` correctly exited 1 with `1 failed, 42 passed`. Reverted from backup; `git diff --stat` on the file is empty.
- Both checks proven locally rather than via a real Actions run: the workflow's steps call these exact same npm scripts (`npm run astro-check`, `npm run test:ci`), so a local exit-code proof is equivalent evidence to a remote one for "does this command actually fail on a real defect," without pushing a deliberately broken commit to the public repo's history.
- Re-ran both commands clean afterward: `astro-check` 0 errors/0 warnings, `test:ci` 43/43 passing — confirms the revert was complete and nothing was left in a broken state.

## Cross-Phase / Regression Check

- Re-ran `npm run astro-check`: 0 errors, 0 warnings, 198 files (matches v1.0's last known-good state).
- Re-ran `npm run build`: 49 pages (up from 47 at v1.0 close, reflecting the two blog posts published since — post-13 and post-14 — not a regression).
- Confirmed the v1.0-era contact-form fix (`window.HSSelect` assignment in `ContactForm.astro`/`GlobalScripts.astro`) is untouched by this phase's changes.

## Findings Beyond the Plan's Own Scope

The plan's own execution surfaced and fixed two real, pre-existing defects in the test infrastructure (not introduced by this phase, and not something the plan anticipated — see SUMMARY.md Deviations #2 for full detail):

1. `tsconfig.jest.json` never included `.astro/types.d.ts`, so the test suite could never actually complete a run (masked forever by `jest --watch` never exiting). Fixed.
2. Two test assertions encoded stale multi-locale expectations left over from v1.0's French-locale removal, which would have failed the moment anyone ran the suite to completion. Fixed with explanatory comments.

This is a genuine, positive outcome of TECHDEBT-05: the mere act of making the test suite actually runnable in CI surfaced defects that had been silently present and unverified since v1.0.

## Infrastructure Change Outside Original Plan Scope

This phase also established the project's first GitHub remote (`github.com/RycBrownrigg/oneMoreGreatIdea`), a prerequisite for TECHDEBT-05 that neither the roadmap nor the original plan anticipated (the repo had never been pushed anywhere before this phase). This was done via an explicit, user-confirmed force-push that replaced an unrelated, abandoned single-commit scaffold at that same repo name. Documented in the conversation and in 04-01-SUMMARY.md's Deviations #1.

## Outcome

Phase 4 goal achieved: the site has a real, twice-proven-green GitHub Actions CI pipeline enforcing `astro check` and the Jest suite on every push/PR, and the dead Netlify/Cloudflare deploy configuration is gone with all documentation corrected. TECHDEBT-05 and TECHDEBT-07 both satisfied with direct evidence, not inference.
