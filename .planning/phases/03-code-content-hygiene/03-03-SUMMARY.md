---
phase: 03-code-content-hygiene
plan: 03
subsystem: code-hygiene
tags: [typescript, type-safety, forms, astro, tech-debt]
dependency-graph:
  requires:
    - "single-locale content tree (03-01)"
    - "zero .mdx files in blog/case-studies (03-02)"
  provides:
    - "FormHandle.ts fully type-checked under astro/tsconfigs/strict, no suppression (TECHDEBT-03)"
    - "ambient Window.HSSelect declaration sourced from @preline/select's real class type"
  affects:
    - themes/lumio/src/lib/utils/FormHandle.ts
    - themes/lumio/src/types/preline.d.ts
tech-stack:
  added: []
  patterns:
    - "Ambient .d.ts declaring a runtime-installed third-party global on `Window`, importing the real class type (`import type X from \"pkg\"`) rather than typing the global as `any` — narrows rather than widens the compiler surface"
key-files:
  created:
    - themes/lumio/src/types/preline.d.ts
  modified:
    - themes/lumio/src/lib/utils/FormHandle.ts
decisions:
  - "Left one pre-existing `as any` cast in netlifySubmit (line 266, `new URLSearchParams(new FormData(form) as any)`) untouched — it predates this plan (present in the file since before 03-01), is unrelated to the window.HSSelect fix this plan targets, and the plan's own operating_rules forbid touching any function besides formReset. The plan's acceptance-criteria grep for `as any` is written broadly enough to also flag this pre-existing, out-of-scope cast; see Deviations below."
metrics:
  duration: "~20 min"
  completed: 2026-09-08
status: complete
actuals:
  tokens: 9500
  tasks: 2
  commits: 1
---

# Phase 3 Plan 3: Type window.HSSelect and Remove FormHandle.ts Suppression Summary

Removed the file-wide `@ts-nocheck` from `FormHandle.ts` by declaring the Preline-installed `window.HSSelect` global against its real class type in a new ambient `.d.ts`, fixing the one resulting type error at its actual source (parameterizing a `querySelectorAll` call instead of casting at the call site), and confirmed the whole phase's accumulated changes build clean.

## What Was Built

**Task 1 (tracer):** Created `themes/lumio/src/types/preline.d.ts` — a type-only-import ambient declaration file containing exactly `import type HSSelect from "@preline/select";`, a `declare global { interface Window { HSSelect: typeof HSSelect; } }` block, and a trailing `export {};`. Removed line 1 (`// @ts-nocheck`) from `FormHandle.ts`. Fixed the single resulting type error in `formReset`: parameterized the select-tags query as `form?.querySelectorAll<HTMLSelectElement>(...)` and renamed the `forEach` callback parameter from `tag` to `selectElement`, deleting the now-redundant `const selectElement = tag as HTMLSelectElement;` line. This is compile-time-equivalent to the original code — the same cast the original code performed manually on the next line is now expressed as the query's type parameter instead. No other function in the file was touched. `npm run astro-check` reports `0 errors, 0 warnings` (198 files) with no mention of `FormHandle.ts` anywhere in the output.

**Task 2 (gate, no files modified):** Ran the phase-wide build gate: `npm run build` exits 0, the log contains zero case-insensitive occurrences of `error`, produces exactly 45 HTML files, and emits `✅ Sitemaps processed successfully.`. The only `warn` lines in the log are the two pre-existing Node `DEP0205 module.register()` deprecation lines, unrelated to this phase. Confirmed the built client chunk `dist/_astro/FormHandle.DnaLgRiU.js` still contains the exact select-reset sequence: `window.HSSelect.getInstance(n);n.selectedIndex=0,t&&t.setValue("")`. Confirmed `dist/contact/index.html` exists, renders the contact form with its Preline-driven `select[data-hs-select]` element and all required fields intact, and that its own script tag (`ContactForm.astro_astro_type_script_index_0_lang.BPpiatDw.js`) dynamically imports the exact `FormHandle.DnaLgRiU.js` chunk that was verified to contain the reset logic — proving the typing change did not break the wiring between the form component and its handler module.

## Deviations from Plan

### Documented Discrepancy (not a code defect)

**1. Plan's `as any` grep acceptance criterion also flags a pre-existing, out-of-scope cast**

- **Found during:** Task 1 verification
- **Issue:** The plan's acceptance criteria state `grep -c 'ts-expect-error\|ts-ignore\|as any' themes/lumio/src/lib/utils/FormHandle.ts` should print `0`, intended to catch a *newly relocated* suppression at the `window.HSSelect` call site. The actual count is `1`, but the single match is `new URLSearchParams(new FormData(form) as any).toString();` inside `netlifySubmit` (line 266 after this plan's edits) — a cast that predates this plan entirely (confirmed present in `git show HEAD:themes/lumio/src/lib/utils/FormHandle.ts` before any change in this session) and is unrelated to `formReset`/`window.HSSelect`.
- **Resolution:** Left untouched, per the plan's own `<operating_rules>` ("Do not touch any other function in the file") and `<action>` text, which explicitly names `netlifySubmit` as one of the functions confirmed during planning to "already type-check cleanly ... once the global is declared" (i.e. the plan's own author knew `netlifySubmit` type-checks fine with this cast in place and did not intend it to be touched). Fixing it would be an unrequested, out-of-scope refactor of a different function under a "this is a typing fix, not a refactor" plan. No new suppression was added or relocated anywhere in the file — `grep -c 'ts-nocheck'` is `0` and no `@ts-expect-error`/`@ts-ignore` exist anywhere in the file, which is the actual defect this check exists to catch.
- **Files affected:** None — no code change, verification-only finding.
- **Precedent:** Same category of finding as 03-01-SUMMARY.md's documented off-by-one in a `<fails_when>` script-count check — a plan verification text imprecision, not an implementation gap.

No auth gates, no bugs, no missing functionality encountered. `npm run astro-check` genuinely reports `0 errors, 0 warnings` with the file fully checked, satisfying the plan's actual intent.

## Known Stubs

None — this plan is a pure type-safety fix with no new UI surface, no new data source, and no placeholder values.

## Human Check Required (not completed in this session)

The plan's Task 2 `<human-check>` block requires driving a real browser against the built site to confirm the contact form's end-to-end submit-and-reset cycle. **This was not performed in this execution session** — there was no interactive browser available to this agent, consistent with the orchestrator's explicit instruction that it could not drive a browser either. Everything programmatically verifiable was checked (see "What Was Built" and the verification table below); the following four items still require a human, in a real browser, before this plan should be considered fully trusted:

1. Serve `themes/lumio/dist/` (e.g. `npx --no-install http-server dist -p 4399` from `themes/lumio/`, or any other static server — **not** `npm run dev` or `npm run preview`) and open `http://localhost:4399/contact/`.
2. Confirm the Preline select dropdown actually opens in the browser and lets you choose an "Engagement Type" option (the built HTML and JS chunk both contain the right markup and logic per static inspection, but Preline's `HSSelect.autoInit()` runtime behavior was not exercised in a DOM).
3. Fill all required fields, confirm the submit button enables, submit a real test message, and confirm it reaches `https://formsubmit.co/ryc@askryc.mt` and the success message renders in the form's message area.
4. **Most important** (this is the specific behavior the Task 1 type change touched): after a successful submit, confirm the form visibly resets — text inputs and textarea empty, and the select dropdown visibly returns to its "Choose" placeholder rather than staying on the previously chosen value.
5. Stop the static server when finished.

### What was verified without a browser (static/build-artifact evidence only)

- `dist/contact/index.html` renders the form markup with `data-hs-select`, all five input fields (`Full Name`, `Email Address`, `Company`, `Engagement Type`, `Message`) each carrying `required` where the plan expects, and pending/success/error message blocks.
- `dist/contact/index.html`'s inline `<script type="module" src="/_astro/ContactForm.astro_astro_type_script_index_0_lang.BPpiatDw.js">` dynamically imports `FormHandle.DnaLgRiU.js` by exact filename (`grep -o 'FormHandle[^"\x27]*\.js'` on the ContactForm chunk returned `FormHandle.DnaLgRiU.js`, matching the actual built chunk name).
- That `FormHandle.DnaLgRiU.js` chunk's minified source contains the literal sequence `window.HSSelect.getInstance(n);n.selectedIndex=0,t&&t.setValue("")` — i.e. the exact three-identifier reset path (`getInstance`, `selectedIndex`, `setValue`) survived minification and bundling unchanged in shape.
- `ContactForm.astro`'s source (read, not built) shows `HSSelect.autoInit()` is called immediately after the dynamic `import("@preline/select")` resolves, which is what installs `window.HSSelect` before `formReset` can ever call it — confirming the ambient declaration models a real, always-present-by-call-time runtime object, not a race condition introduced by this plan.
- None of this proves the dropdown visually opens, the network request actually reaches formsubmit.co, or the reset is visually correct — only that the compiled code and markup are structurally intact and wired together correctly. Static inspection cannot substitute for the human-check above.

## Verification Results

1. `head -1 src/lib/utils/FormHandle.ts` → `import { markdownify } from "./textConverter";` — confirmed
2. `grep -c 'ts-nocheck' src/lib/utils/FormHandle.ts` → `0` — confirmed
3. `grep -c 'ts-expect-error\|ts-ignore\|as any'` → `1` (pre-existing, out-of-scope; see Deviations) — documented exception, not `0` as literally written
4. `src/types/preline.d.ts` exists, contains `import type`, `declare global`/`interface Window`, `export {};` — confirmed
5. `npm run astro-check` → `Result (198 files): 0 errors, 0 warnings, 0 hints`, no `FormHandle.ts:` line anywhere — confirmed
6. `npm run build` → exit 0, `grep -ic error` → `0`, only `warn` matches are the two Node `DEP0205` lines — confirmed
7. `find dist -name '*.html' | wc -l` → `45` — confirmed
8. `dist/_astro/FormHandle.DnaLgRiU.js` exists, contains `getInstance`, `selectedIndex`, `setValue` (each count `1`) — confirmed
9. `dist/contact/index.html` exists — confirmed
10. Human check: **not performed this session** — see "Human Check Required" above

## Self-Check: PASSED

Verified all claimed files and commits exist on disk/in git:
- `themes/lumio/src/types/preline.d.ts` → FOUND, tracked (`git ls-files` shows it added in commit `c46c7a2`)
- `themes/lumio/src/lib/utils/FormHandle.ts` → FOUND, modified as described
- Commit `c46c7a2` → FOUND in `git log --oneline --all`
- `themes/lumio/dist/_astro/FormHandle.DnaLgRiU.js` → FOUND (gitignored build output, verified present on disk post-build)
- `themes/lumio/dist/contact/index.html` → FOUND

No missing items. TECHDEBT-03 is code-complete and gated by automated checks; the human browser confirmation remains outstanding and is called out explicitly above rather than claimed as done.
