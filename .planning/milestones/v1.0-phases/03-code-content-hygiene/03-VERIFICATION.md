---
phase: 03-code-content-hygiene
verified: 2026-09-08T17:30:00Z
status: passed
score: 5/5 must-haves verified
behavior_unverified: 0
overrides_applied: 0
addendum: "2026-09-08T19:05:00Z — human verification completed; found and fixed a pre-existing window.HSSelect bug (commit 441ecab); status updated from human_needed to passed"
behavior_unverified_items:
  - truth: "The contact form still submits and resets correctly (Phase 3 success criterion 2, second clause)"
    test: "Serve themes/lumio/dist (e.g. npx --no-install http-server dist -p 4399), open /contact/, fill all required fields including the Preline select dropdown, submit, and observe the result"
    expected: "Submission reaches formsubmit.co and shows a success message; afterward all text fields/textarea are empty AND the Preline select has visibly returned to its placeholder option (not just DOM state — the visible rendered dropdown)"
    why_human: "This is a runtime DOM/network behavior (Preline's HSSelect.autoInit() wiring, an actual network POST, and visible select-reset) that cannot be exercised by grep/static build inspection. Plan 03-03's own executor could not drive a browser and explicitly left this step undone; static evidence (JS chunk contains getInstance/selectedIndex/setValue, HTML markup present) proves the code is wired but not that it behaves correctly at runtime."
human_verification:
  - test: "Serve themes/lumio/dist (http-server dist -p 4399, NOT npm run dev/preview) and open http://localhost:4399/contact/"
    expected: "Form renders with Preline select; dropdown opens and is selectable; filling required fields enables submit; submitting reaches formsubmit.co and shows success; after success, text fields/textarea are empty and the select visibly resets to its placeholder option"
    why_human: "Real browser DOM interaction, third-party network call, and visual confirmation of select-reset — none of these are observable via static file/grep inspection"
---

# Phase 3: Code & Content Hygiene Verification Report

**Phase Goal:** The codebase's content-format and type-safety debt is eliminated, and dead locale content is removed.
**Verified:** 2026-09-08T17:30:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | No `.mdx` files remain in `src/content/blog/` or `src/content/case-studies/`; every migrated post/case study is `.md` and renders identically to pre-migration output | ✓ VERIFIED | Independently re-ran `git ls-files -- themes/lumio/src/content/blog themes/lumio/src/content/case-studies \| grep '\.mdx$'` → 0 hits. `git ls-files ... \| grep '\.md$'` → 20 files (13 blog incl. `-index.md`, 7 case-studies incl. `-index.md`). Re-ran full-corpus byte diff against the plan's own preserved `/tmp/gsd-phase03/baseline-02/` snapshot: found exactly 4 documented exceptions (see below) plus one incidental, unrelated, and expected script-chunk-hash change (`CJ7VOIix`→`BPpiatDw`, the `ContactForm` script chunk whose hash legitimately changed in Plan 03-03 when `FormHandle.ts` was edited — present on every page that includes global scripts, not a content regression). No other diffs anywhere in `case-studies/` or `blog/` (excl. `category/`). Sitemaps (`sitemap-0.xml`, `sitemap-index.xml`) byte-identical to baseline. |
| 2 | `FormHandle.ts` has `@ts-nocheck` removed and passes `astro check`/TypeScript strict mode with zero errors | ✓ VERIFIED | `head -1 themes/lumio/src/lib/utils/FormHandle.ts` → `import { markdownify } from "./textConverter";`. `grep -c ts-nocheck` → 0. Independently ran `npm run astro-check` from `themes/lumio/` → `Result (198 files): 0 errors, 0 warnings, 0 hints`, no mention of `FormHandle.ts`. `themes/lumio/src/types/preline.d.ts` exists, is git-tracked, contains `import type HSSelect from "@preline/select"`, a `declare global { interface Window { HSSelect: typeof HSSelect } }` block, and `export {};` — no runtime code. |
| 3 | The contact form still submits and resets correctly | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Static evidence only: `dist/_astro/FormHandle.DnaLgRiU.js` contains `getInstance`, `selectedIndex`, `setValue` (each count 1, independently re-confirmed); `dist/contact/index.html` exists. No behavioral/browser test was run — 03-03-SUMMARY.md explicitly and accurately states this human check was not performed ("there was no interactive browser available to this agent"). This verifier also has no browser access. Routed to human verification below. |
| 4 | French locale content directories and any disabled-locale-only scripts/assets are removed from the repository | ✓ VERIFIED | Independently ran `git ls-files -- themes/lumio \| grep -Eic 'french\|fr\.json\|menu\.fr'` → 0. `themes/lumio/scripts/` contains no French-only tooling (`remove-multilingual.mjs`, `generate-multilingual-content.mjs` confirmed absent from git). `config.toml`'s `disableLanguages` is `[]` (confirmed no `"fr"` locale literal remains outside comments). |
| 5 | `npm run build` completes with zero content-collection or type-checking errors/warnings | ✓ VERIFIED | Independently ran `npm run build` from `themes/lumio/` → exit 0, `grep -ic error` over the log → 0, log contains `✅ Sitemaps processed successfully.`, `find dist -name '*.html' \| wc -l` → 45. No `warn` lines beyond the two pre-existing Node `DEP0205` deprecation lines (confirmed absent of any other warning). |

**Score:** 4/5 truths verified (1 present + wired, behavior-unverified)

### Byte-Parity Exception Spot-Check (Known Caveat #1)

Plan 03-02 documented a 4-page byte-parity exception (MDX's XHTML-leaning serializer vs. Astro's native Markdown HTML5 serializer). Independently re-derived and spot-checked, using the plan's own preserved `/tmp/gsd-phase03/baseline-02/` snapshot (still present on disk):

| Page | Documented diff | Independently observed | Verdict |
|------|------------------|------------------------|---------|
| `case-studies/ccrms/index.html` | `Content&lt;T&gt;` → `Content&#x3C;T>` | Confirmed: rendered HTML contains `<code>Content&#x3C;T></code>` | Both are valid HTML5 entity/literal forms for `<`/`>`; parse to identical DOM text. Not a content or visual difference. |
| `blog/modern-ott-streaming-architecture/index.html` | `<hr/>` → `<hr>` | Confirmed: `<hr>` present, no self-closing slash | Both are valid HTML5 void-element syntax (browsers treat `<hr/>` and `<hr>` identically — the `/` is ignored). Not a rendering regression. |
| `blog/ott-architecture-high-concurrency/index.html` | same | Confirmed: `<hr>` present | Same as above |
| `blog/technical-due-diligence-web3/index.html` | same | Confirmed: `<hr>` present | Same as above |

A full-corpus diff against the baseline turned up **no additional undocumented content differences** — the only other diffs across all 45 routes were a single shared script-chunk hash (`CJ7VOIix`→`BPpiatDw`) that changed for an unrelated, legitimate reason (Plan 03-03's `FormHandle.ts` edit changed the content hash of the `ContactForm` script bundle referenced sitewide). This exception is properly documented in `03-02-PLAN.md`'s operating-rules amendment and `03-02-SUMMARY.md`'s Deviations section, and the underlying "visually/semantically identical, valid HTML5" claim holds up under independent inspection.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `themes/lumio/src/config/language.json` | single `en` entry only | ✓ VERIFIED | Confirmed single-element array with `languageCode: "en"` |
| `themes/lumio/src/config/config.toml` | `disableLanguages = []`, no dead locale disablement | ✓ VERIFIED | Confirmed |
| `themes/lumio/package.json` | no multilingual scaffolding scripts | ✓ VERIFIED | `remove-multilingual`/`generate-multilingual-content` entries absent |
| `themes/lumio/src/content/blog/english/post-1.md` .. `post-9.md` | migrated from `.mdx` | ✓ VERIFIED | All present, `.mdx` counterparts absent |
| `themes/lumio/src/content/case-studies/english/case-study-1.md` .. `case-study-6.md` | migrated from `.mdx` | ✓ VERIFIED | All present, `.mdx` counterparts absent |
| `themes/lumio/src/types/preline.d.ts` | ambient `Window.HSSelect` declaration | ✓ VERIFIED | Exists, git-tracked, declaration-only |
| `themes/lumio/src/lib/utils/FormHandle.ts` | no `@ts-nocheck`, fully typed | ✓ VERIFIED | Confirmed |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `themes/lumio/src/config/language.json` | `themes/lumio/src/lib/utils/i18nUtils.ts` | `getEnabledLocales()` maps over `language.json` | ✓ WIRED | Single `en` entry resolves correctly; `npm run build` produces 45 routes (unchanged), confirming `astro.config.mjs`'s `i18n.locales` consumed the right value |
| `themes/lumio/src/types/preline.d.ts` | `themes/lumio/src/lib/utils/FormHandle.ts` | `window.HSSelect.getInstance(selectElement)` typed against the real `@preline/select` class | ✓ WIRED | `astro-check` passes with 0 errors and never names `FormHandle.ts`; the ambient declaration is picked up automatically via `tsconfig.json`'s `include: ["**/*"]` |
| `themes/lumio/src/layouts/components/widgets/ContactForm.astro` | `themes/lumio/src/lib/utils/FormHandle.ts` (built chunk) | dynamic import of the compiled `FormHandle.*.js` chunk | ✓ WIRED (static) | `dist/contact/index.html`'s script tag dynamically imports `FormHandle.DnaLgRiU.js` by exact name; that chunk contains `getInstance`, `selectedIndex`, `setValue` — proven present and connected, but the actual runtime submit/reset behavior is unverified (see Human Verification) |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|--------------|--------|----------|
| CONTENT-05 | 03-01 | Disabled French locale content removed | ✓ SATISFIED | Independently confirmed 0 French artifacts tracked |
| TECHDEBT-01 | 03-02 | `post-1`–`post-9` migrated to `.md`, no content/shortcode loss | ✓ SATISFIED | Confirmed migration + parity (with documented, spot-checked exception) |
| TECHDEBT-02 | 03-02 | 6 case studies migrated to `.md`, no content/shortcode loss | ✓ SATISFIED | Confirmed migration + parity (with documented, spot-checked exception) |
| TECHDEBT-03 | 03-03 | `FormHandle.ts` `@ts-nocheck` removed, passes strict mode | ✓ SATISFIED | Confirmed via independent `astro-check` run |
| TECHDEBT-04 | (Phase 1, not this phase) | Draft placeholder stubs unreachable | Not in scope | Correctly excluded from Phase 3; ROADMAP maps it to Phase 1, which is not yet started |

No orphaned requirements found for Phase 3 — REQUIREMENTS.md maps exactly CONTENT-05, TECHDEBT-01/02/03 to Phase 3 and all four appear in the three plans' `requirements` frontmatter fields.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `themes/lumio/src/lib/utils/FormHandle.ts` | 264 | `as any` cast in `netlifySubmit` (`new FormData(form) as any`) | ℹ️ Info | Pre-existing since the repo's initial commit (`f63eea6`, independently confirmed via `git log -S`), predates all three Phase 3 plans, unrelated to the `window.HSSelect` fix, and out of scope per Plan 03-03's own "this is a typing fix, not a refactor" operating rule. Correctly identified and left untouched by the executor; not a missed cleanup item for this phase. |

No `TBD`/`FIXME`/`XXX`/`TODO`/`HACK`/`PLACEHOLDER` markers found in any file modified by this phase (`FormHandle.ts`, `preline.d.ts`, `config.toml`, `package.json`, `language.json` all clean).

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| No `.mdx` remains in blog/case-studies | `git ls-files ... \| grep -c '\.mdx$'` | `0` | ✓ PASS |
| French artifacts fully removed | `git ls-files -- themes/lumio \| grep -Eic 'french\|fr\.json\|menu\.fr'` | `0` | ✓ PASS |
| `astro-check` clean | `npm run astro-check` | `0 errors, 0 warnings, 0 hints` | ✓ PASS |
| Build clean, 45 routes | `npm run build` | exit 0, 0 errors, 45 HTML files, no non-pre-existing warnings | ✓ PASS |
| Case-study/blog rendered parity | `diff -rq` vs. preserved baseline | Only the 4 documented exceptions + 1 unrelated/expected script-hash diff | ✓ PASS |
| Contact form submit + visual reset in browser | — | Not run (no browser available) | ? SKIP → routed to human verification |

### Deviations Correctly Scoped (from known caveats)

1. **03-02's 4-page byte-parity exception** — independently spot-checked and confirmed to be a benign MDX-vs-Markdown HTML5 serialization difference (see table above). Properly documented in the plan's operating-rules amendment and SUMMARY. Not a gap.
2. **03-03's pre-existing, untouched `as any` cast in `netlifySubmit`** — independently confirmed via `git log -S` to predate this phase entirely (present in the initial commit). Correctly scoped as out-of-bounds per the plan's "typing fix, not a refactor" rule. Not a missed cleanup item.
3. **03-03's outstanding human browser check** — accurately reported as NOT completed in `03-03-SUMMARY.md` ("Human Check Required" section, not silently marked done). This verifier also cannot drive a browser, so the item is correctly carried forward as the phase's one outstanding human-verification requirement.
4. **03-01's verify-block off-by-one (`script-count=9` vs. actual/correct `10`)** — reviewed; the plan's own `<action>` text and acceptance criteria list 10 scripts to preserve, and the implementation matches that intent exactly. This is a documented plan-authoring typo, not an implementation defect, and does not affect any Phase 3 success criterion.

### Human Verification Required

### 1. Contact form end-to-end submit and reset

**Test:** From `themes/lumio/`, run `npx --no-install http-server dist -p 4399` (not `npm run dev` or `npm run preview`), open `http://localhost:4399/contact/`, open the Preline select dropdown and choose an option, fill all required fields, submit, and observe the result.
**Expected:** Submit button enables once required fields are filled; submission reaches `formsubmit.co` and a success message renders; after success, all text fields/textarea are empty AND the select dropdown has visibly returned to its placeholder option (not just internal DOM state).
**Why human:** Requires real browser DOM interaction (Preline's `HSSelect.autoInit()` runtime wiring), an actual third-party network round-trip, and visual confirmation of the select's rendered state — none of which static file/build inspection can observe. This is the one item Plan 03-03's own executor explicitly could not complete and flagged as outstanding; independent verification here has the same constraint (no browser access).

### Gaps Summary

No gaps found. All four ROADMAP success criteria for Phase 3 are supported by independently-reproduced evidence: zero `.mdx` files remain in the target collections with rendered-output parity (including a spot-checked, benign 4-page serialization exception); French locale content and its dedicated tooling are fully removed; `FormHandle.ts` type-checks cleanly under strict mode with the suppression genuinely removed (not relocated); and `npm run build` is clean end-to-end with the expected 45 routes. The single remaining item — a live-browser confirmation that the contact form submits and visually resets — is a real, not-yet-closed human verification requirement, accurately reported as such by the phase's own SUMMARY rather than glossed over. This is why the phase status is `human_needed` rather than `passed`: the code is present, wired, and statically proven, but the one behavior-dependent truth about actual form-reset UX has not been exercised.

---

## Addendum: Human Verification Completed 2026-09-08 — real bug found and fixed

The outstanding human verification item above was completed live with Ryc after this report was written. It did not simply confirm behavior — it **found a genuine pre-existing bug**:

`window.HSSelect` was never assigned anywhere in the codebase (only ever imported as a local binding in `ContactForm.astro`/`GlobalScripts.astro`). Every successful contact-form submission threw `TypeError: Cannot read properties of undefined (reading 'getInstance')` inside `formReset()`, which `formSubmit()`'s `.catch()` silently swallowed and converted into a false "Oops! There was a problem submitting your form." message — overwriting the correct success message. Confirmed via direct `curl` calls to formsubmit.co's AJAX endpoint that submissions were genuinely being accepted the entire time; this was purely a UI false-negative, not a delivery failure.

**Fix (commit `441ecab`):** added `window.HSSelect = HSSelect;` right after the dynamic import resolves, in both `ContactForm.astro` and `GlobalScripts.astro`. Rebuilt (`astro-check`: 0/0/0, `npm run build`: exit 0, 45 routes), and confirmed live: dropdown now visibly resets to its placeholder after a successful submit, and the correct success message displays.

**Updated Truth #3:** ✓ VERIFIED (was ⚠️ PRESENT_BEHAVIOR_UNVERIFIED). **Updated Score: 5/5 truths verified.** **Updated Status: PASSED** (was `human_needed`).

Full diagnostic narrative recorded in `03-03-SUMMARY.md`'s "Human Check — COMPLETED" section.

---

_Verified: 2026-09-08T17:30:00Z_
_Verifier: Claude (gsd-verifier)_
_Addendum: 2026-09-08T19:05:00Z — human verification completed, bug found and fixed, status updated to PASSED_
