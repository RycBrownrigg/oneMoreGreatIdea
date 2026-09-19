---
phase: "06"
slug: "utility-test-coverage-completion"
status: validated
nyquist_compliant: false
wave_0_complete: true
created: "2026-09-19"
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 30.x (ts-jest, ESM mode) |
| **Config file** | `themes/lumio/jest.config.ts`, `themes/lumio/tsconfig.jest.json` |
| **Quick run command** | `cd themes/lumio && npx jest <file>.test.ts` |
| **Full suite command** | `cd themes/lumio && npm run test:ci` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd themes/lumio && npm run test:ci`
- **After every plan wave:** Run `cd themes/lumio && npm run test:ci`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-02 | 01 | 1 | TECHDEBT-10 | unit | `npx jest handleDraftPage.test.ts` | ✅ | ⚠️ PARTIAL |
| 06-01-03 | 01 | 1 | TECHDEBT-15 | unit | `npx jest buildToc.test.ts` | ✅ | ✅ green |
| 06-01-03 | 01 | 1 | TECHDEBT-16 | unit | `npx jest navigationActive.test.ts` | ✅ | ✅ green |
| 06-01-04 | 01 | 1 | TECHDEBT-20 | unit | `npx jest JsonLdGenerator.test.ts` | ✅ | ✅ green |
| 06-01-04 | 01 | 1 | TECHDEBT-19 | unit | `npx jest absoluteUrl.test.ts` | ✅ | ✅ green |
| 06-02-01 | 02 | 2 | TECHDEBT-08 | unit | `npx jest generateTypeScale.test.ts` | ✅ | ✅ green |
| 06-02-02 | 02 | 2 | TECHDEBT-14 | unit | `npx jest readingTime.test.ts` | ✅ | ✅ green |
| 06-02-03 | 02 | 2 | TECHDEBT-09 | unit | `npx jest filteredEnabled.test.ts` | ✅ | ✅ green |
| 06-03-01 | 03 | 2 | TECHDEBT-11 | unit | `npx jest overrideObjects.test.ts` | ✅ | ✅ green |
| 06-03-02 | 03 | 2 | TECHDEBT-13 | unit | `npx jest removeEmptyKeys.test.ts` | ✅ | ✅ green |
| 06-03-03 | 03 | 2 | TECHDEBT-12 | unit | `npx jest uniqueIdGenerator.test.ts` | ✅ | ✅ green |
| 06-04-01 | 04 | 2 | TECHDEBT-17 | unit | `npx jest getRelatedContent.test.ts` | ✅ | ✅ green |
| 06-04-02 | 04 | 2 | TECHDEBT-18 | unit | `npx jest preline.test.ts` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky/partial*

All 13 files exist and the full suite (`npm run test:ci`) runs 20 suites / 121 tests green. TECHDEBT-10's test file exists and passes but only exercises the `draft:false` short-circuit and a Jest-harness artifact (`import.meta.env` undefined) — the module's actual documented 404-Response behavior (production, `draft:true`) is not reachable under Jest, per `06-VERIFICATION.md` and `06-REVIEW.md` (IN-01). Marked PARTIAL, escalated to Manual-Only below.

---

## Wave 0 Requirements

Existing infrastructure (fixed in Plan 06-01: `tsconfig.jest.json`, `jest.config.ts`, `package.json`) covers all phase requirements. No further Wave 0 work needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|--------------------|
| `handleDraftPage` returns a 404 `Response` (status 404, statusText "Not Found") for `draft:true` pages when `import.meta.env.PROD === true` | TECHDEBT-10 | Jest never sets `import.meta.env.PROD`, so the harness structurally cannot reach this branch. Deferred as a follow-up todo (`.planning/todos/pending/2026-09-19-refactor-handledraftpage-to-accept-injectable-isprod-param.md`) rather than fixed now — low risk on a static site with no server runtime. | Run a real `astro build` on a page with `draft: true` frontmatter and confirm it's excluded from `dist/`, or implement the todo's injectable `isProd` parameter and re-run this audit. |

---

## Validation Sign-Off

- [x] All tasks have automated verify or a documented Manual-Only entry
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none were missing)
- [x] No watch-mode flags (`test:ci` uses `--ci`/non-watch Jest invocation)
- [x] Feedback latency < 5s (full suite runs in ~3s)
- [ ] `nyquist_compliant: true` set in frontmatter — **not set**: one requirement (TECHDEBT-10) is escalated to Manual-Only rather than fully automated

**Approval:** approved 2026-09-19 (partial — one requirement manual-only by disclosed, accepted decision)
