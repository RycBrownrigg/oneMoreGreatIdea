---
created: 2026-09-19T15:16:53.987Z
title: Refactor handleDraftPage to accept injectable isProd param
area: testing
severity: minor
files:

  - themes/lumio/src/lib/utils/handleDraftPage.ts
  - themes/lumio/src/__tests__/handleDraftPage.test.ts

audit_acknowledged:
  milestone: v1.2
  at: 2026-09-19
---

## Problem

`handleDraftPage.ts`'s actual documented behavior — return a 404 `Response` (status 404,
statusText "Not Found") when a page is `draft: true` in production — has zero automated test
coverage. Jest never sets `import.meta.env.PROD`, so the existing
`handleDraftPage.test.ts` can only assert the `draft: false` short-circuit and a Jest-harness
artifact (`import.meta.env` being `undefined` throws a `TypeError`) — it never reaches the
module's real 404-branch logic.

This was surfaced during Phase 6 (utility-test-coverage-completion) verification:

- `06-REVIEW.md` IN-01 (informational, non-blocking)
- `06-VERIFICATION.md` human_verification item 1 — explicitly flagged as a known, disclosed,
  non-blocking gap (low risk: static site, no server runtime), not a hidden defect.

A refactor that accidentally changes the 404 status/logic, or a stale draft page reaching
production, would not currently be caught by `npm run test:ci`.

## Solution

Refactor `handleDraftPage` to accept an injectable `isProd` parameter (defaulting to
`import.meta.env.PROD` in production code) so Jest can call it directly with
`isProd: true` / `isProd: false` and assert on the real `Response` object (status, statusText)
without needing `import.meta.env` to be defined under the test harness. Add a test case
exercising the `draft: true` + `isProd: true` → 404 Response path once the injectable
parameter exists.
