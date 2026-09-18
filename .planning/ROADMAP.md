# Roadmap: Ryc Brownrigg Consulting Site

## Milestones

- ✅ **v1.0 — Launch-Quality Punch List** (shipped 2026-09-16): Draft placeholder cleanup, social sharing OG image, and legacy `.mdx`/French-locale/FormHandle tech debt. See `.planning/milestones/v1.0-ROADMAP.md`.
- 🚧 **v1.1 — CI & Test Hardening** (started 2026-09-17): Phases 4-5. Automated verification on every push, broader unit-test coverage of pure utilities, and removal of unused deploy configs.

## Current Milestone: v1.1 — CI & Test Hardening

**Goal:** Replace "Ryc remembers to run the checks before rsyncing" with an automated safety net — a CI pipeline that fails loudly on type or test regressions, a test suite that actually covers the site's pure utility layer, and a repo that no longer advertises deploy paths nobody uses.

This milestone is engineering hygiene on an already-live site. Nothing here changes what a visitor sees; the payoff is that future content and code changes can't silently break the build or the contact form. CI comes first so that the tests added afterwards are enforced from the moment they land.

## Phases

- [x] **Phase 4: CI Pipeline & Deploy-Config Cleanup** - GitHub Actions runs `astro check` + a non-watch test run on every push/PR; dead Netlify/Cloudflare deploy configs removed (completed 2026-09-18)
- [ ] **Phase 5: Utility Test Coverage** - Pure utilities in `src/lib/utils/` gain real unit tests, enforced by the Phase 4 pipeline

## Phase Details

### Phase 4: CI Pipeline & Deploy-Config Cleanup

**Goal**: Every push and pull request is automatically type-checked and tested without anyone remembering to do it, and the repo only describes the one deploy path that is actually used
**Depends on**: Nothing (first phase of v1.1)
**Requirements**: TECHDEBT-05, TECHDEBT-07
**Success Criteria** (what must be TRUE):

1. Pushing a commit to `main` (or opening a PR) starts a GitHub Actions run that finishes on its own and reports a pass/fail status on that commit — it never hangs waiting for input
2. A non-interactive test command (e.g. `npm run test:ci`) exists and can be run locally and in CI: it exits 0 on a clean tree and non-zero when any test fails, with `npm run test` left available for interactive watch use
3. Deliberately introducing a type error, and separately a failing test, each turn the workflow red — proving the gate is real and not a green-by-default workflow (both reverted afterwards)
4. `themes/lumio/netlify.toml`, `themes/lumio/wrangler.toml`, and the `deploy:cf` npm script no longer exist, and `npm run build` plus `./deploy.sh` still complete successfully afterwards
5. No remaining file in the repo (scripts, docs, `package.json`, CLAUDE.md, codebase map) points at the removed Netlify/Cloudflare deploy paths; the unrelated Netlify *form-provider* code in `FormHandle.ts`/`ContactForm.astro`/`CommentForm.astro` is explicitly left alone and the distinction is recorded

**Plans**: TBD

**Notes:**

- No `.github/workflows/` directory exists yet — this starts from zero
- `npm run test` currently runs `jest --watch`, which would hang a CI runner forever; adding the non-watch script is part of this phase, not an afterthought
- The build depends on `.astro/config.generated.json` produced by `toml:watch`, so CI must invoke the npm scripts (not bare `astro`/`jest`) or otherwise generate that file first
- CI is verification-only this milestone — it must not deploy; deploy stays manual rsync via `deploy.sh`
- `wrangler` does not appear in `devDependencies`; confirm during execution before assuming a dependency needs removing

### Phase 5: Utility Test Coverage

**Goal**: The site's pure utility layer has real regression tests, so a refactor that breaks date formatting, slug/text conversion, sorting, or URL trailing-slash handling fails in CI instead of in production
**Depends on**: Phase 4 (needs the non-watch test command and the pipeline that runs it)
**Requirements**: TECHDEBT-06
**Success Criteria** (what must be TRUE):

1. `npm run test:ci` runs and passes a suite covering the pure utilities selected in this phase, beyond the single pre-existing `getLocalUrlCTM.test.ts` — candidates from `src/lib/utils/`: `dateFormat.ts`, `textConverter.ts`, `sortFunctions.ts`, `objectFunctions.ts`, `splitProtectedText.ts`, `trailingSlashChecker.ts`
2. Each covered utility is tested for its normal behavior plus at least one edge case (empty string, missing/undefined input, or malformed value) — not just a single happy-path smoke test
3. Every module in `src/lib/utils/` is accounted for: either covered by a test, or listed with a one-line reason for exclusion (Astro/DOM-coupled, filesystem/network, or build-only), so coverage scope is a recorded decision rather than an accident
4. Deliberately breaking one covered utility's implementation makes at least one new test fail — the tests assert behavior, not merely execute the code
5. The Phase 4 workflow picks up the expanded suite on the next push with no workflow-file edits required

**Plans**: TBD

**Notes:**

- The illustrative candidate list comes from REQUIREMENTS.md; deciding the actual scope (and defending the exclusions) is this phase's job
- Existing Jest setup: `jest.config.ts` + `tsconfig.jest.json`, driven through `cross-env TS_NODE_PROJECT` — new tests should fit that harness rather than introduce a second runner

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. CI Pipeline & Deploy-Config Cleanup | 1/1 | Complete    | 2026-09-18 |
| 5. Utility Test Coverage | 0/? | Not started | - |

## Backlog

See `.planning/REQUIREMENTS.md` v2 section for deferred items: case-study-5/6 real content and the 5 placeholder testimonials (CONTENT-01/02/03) — all blocked on real material existing, re-confirmed deferred 2026-09-17. The former backlog items CI pipeline, broader test coverage, and unused deploy configs (TECHDEBT-05/06/07) were promoted into the active v1.1 milestone above.

---

*Milestone v1.1 roadmap created 2026-09-17. Phase numbering continues from v1.0 (which ended at Phase 3).*
