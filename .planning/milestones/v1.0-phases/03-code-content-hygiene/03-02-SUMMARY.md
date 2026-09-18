---
phase: 03-code-content-hygiene
plan: 02
subsystem: content-hygiene
tags: [content-format, astro, tech-debt, mdx-migration]
dependency-graph:
  requires:
    - "single-locale content tree (03-01)"
  provides:
    - "zero .mdx files under src/content/blog/ or src/content/case-studies/"
    - "all 9 legacy blog posts and 6 case studies renamed to .md (TECHDEBT-01, TECHDEBT-02)"
  affects:
    - themes/lumio/src/content/blog/english/post-1.md .. post-9.md
    - themes/lumio/src/content/case-studies/english/case-study-1.md .. case-study-6.md
tech-stack:
  added: []
  patterns:
    - "Byte-for-byte source-body diff plus rendered-HTML diff against a pre-migration baseline as the acceptance gate for a parser-changing rename"
    - "Documented, scoped byte-parity exception (analogous to the pre-existing blog/category/** Preline-accordion-ID carve-out) for cases where two valid serializers produce non-identical-but-semantically-equal HTML"
key-files:
  created: []
  modified:
    - themes/lumio/src/content/blog/english/post-1.mdx -> post-1.md
    - themes/lumio/src/content/blog/english/post-2.mdx -> post-2.md
    - themes/lumio/src/content/blog/english/post-3.mdx -> post-3.md
    - themes/lumio/src/content/blog/english/post-4.mdx -> post-4.md
    - themes/lumio/src/content/blog/english/post-5.mdx -> post-5.md
    - themes/lumio/src/content/blog/english/post-6.mdx -> post-6.md
    - themes/lumio/src/content/blog/english/post-7.mdx -> post-7.md
    - themes/lumio/src/content/blog/english/post-8.mdx -> post-8.md
    - themes/lumio/src/content/blog/english/post-9.mdx -> post-9.md
    - themes/lumio/src/content/case-studies/english/case-study-1.mdx -> case-study-1.md
    - themes/lumio/src/content/case-studies/english/case-study-2.mdx -> case-study-2.md
    - themes/lumio/src/content/case-studies/english/case-study-3.mdx -> case-study-3.md
    - themes/lumio/src/content/case-studies/english/case-study-4.mdx -> case-study-4.md
    - themes/lumio/src/content/case-studies/english/case-study-5.mdx -> case-study-5.md
    - themes/lumio/src/content/case-studies/english/case-study-6.mdx -> case-study-6.md
    - .planning/phases/03-code-content-hygiene/03-02-PLAN.md
    - .planning/REQUIREMENTS.md
  deleted: []
decisions:
  - "Accepted a documented, zero-impact byte-parity exception for 4 of 45 rendered pages (case-studies/ccrms, blog/modern-ott-streaming-architecture, blog/ott-architecture-high-concurrency, blog/technical-due-diligence-web3) rather than rewriting content or changing astro.config.mjs's markdown pipeline sitewide — see 'Deviations from Plan' below for full root-cause analysis. Approved explicitly by the coordinator (Option A of four presented options) during execution."
  - "Cleared themes/lumio/.astro/ and themes/lumio/node_modules/.astro/ and node_modules/.vite/ (all gitignored build caches) before each rebuild after a content rename, because Astro's content-layer cache does not self-invalidate on a git-recorded file rename and produced a Rollup resolution error referencing the old .mdx path otherwise. No source or config file was touched to work around this — purely a local build-cache clear."
metrics:
  duration: "~93 min (including a mid-execution halt-and-report for coordinator decision on the byte-parity exception)"
  completed: 2026-09-08
status: complete
actuals:
  tokens: 42000
  tasks: 3
  commits: 3
---

# Phase 3 Plan 2: Migrate Legacy .mdx Content to .md Summary

Renamed all 9 legacy blog posts and 6 case studies from `.mdx` to `.md` via git-recorded renames with zero byte changes to file bodies, proving rendered-output parity against a pre-migration baseline for 41 of 45 pages exactly and documenting a zero-impact serializer-escaping exception for the remaining 4.

## What Was Built

**Task 1 (tracer):** Audited all 15 legacy `.mdx` files for genuine MDX-only syntax before touching anything — one grep each for ESM import/export statements, JSX brace expressions, and JSX component tags across all 15 files. Result: 0 imports/exports, 0 brace expressions, 1 apparent JSX-tag hit. That hit (`case-studies/english/case-study-2.mdx` line 31) was confirmed to be `` `Content<T>` `` — a Rust/FRAME generic type parameter wrapped in inline-code backticks, not a JSX element — matching the plan's predicted false positive exactly. Migrated `case-study-1.mdx` to `case-study-1.md` as a single-file vertical slice through the whole pipeline (content loader, markdown/rehype pipeline, route generation, sitemap), captured a pre-migration `dist/` baseline (45 routes) and flat source-body snapshots of all 15 `.mdx` files, then proved the migrated file's body was byte-identical to its snapshot and its rendered page (`/case-studies/inktix/`) was byte-identical to the baseline.

**Task 2:** Renamed the remaining 14 files (`post-1.mdx`–`post-9.mdx`, `case-study-2.mdx`–`case-study-6.mdx`, including the two `draft: true` frontmatter-only stubs `case-study-5`/`case-study-6`) via `git mv`, confirmed all 15 renames across both tasks show `git status --porcelain` status `R` with no other content-file modifications, confirmed every migrated `.md` file diffs clean against its pre-migration `.mdx` snapshot, and rebuilt successfully.

**Task 3 (gate):** Ran the full-corpus verification suite: zero `.mdx` files remain under `src/content/blog/` or `src/content/case-studies/` (down from 15), exactly 20 `.md` files exist across both collections, `find dist -name '*.html' | wc -l` still prints 45 with an identical route inventory, both `sitemap-0.xml` and `sitemap-index.xml` are byte-identical to baseline, `npm run astro-check` reports `0 errors, 0 warnings, 0 hints`, and `astro.config.mjs` still registers exactly one `mdx()` integration (preserving support for the 5 out-of-scope `.mdx` files under `pages/`/`services/`). The recursive rendered-HTML parity diff found exactly 4 of 45 pages non-byte-identical — investigated, root-caused, and resolved as a documented exception (see Deviations below). Marked TECHDEBT-01 and TECHDEBT-02 complete in `REQUIREMENTS.md`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking issue] Stale Astro content-layer cache broke the build after every content rename**
- **Found during:** Task 1, rebuild step immediately after `git mv case-study-1.mdx case-study-1.md`
- **Issue:** `npm run build` failed with `[vite]: Rollup failed to resolve import "astro:content-layer-deferred-module?...fileName=...case-study-1.mdx..."`. Astro's content-layer cache does not self-invalidate on a git-recorded rename — `themes/lumio/.astro/content-modules.mjs` kept a stale reference to the old `.mdx` path even after a fresh `[content] Syncing content` log line, and a *second*, separate stale copy in `themes/lumio/node_modules/.astro/data-store.json` also had to be cleared before the reference fully cleared.
- **Fix:** `rm -rf themes/lumio/.astro themes/lumio/node_modules/.astro themes/lumio/node_modules/.vite` before each rebuild. Both directories are gitignored build caches, not source — no tracked file was touched.
- **Files affected:** None (cache-only; not committed)
- **Note for future work:** Anyone renaming or moving a content file locally will hit this same build failure on the first rebuild after the rename. It is not fixed structurally by this plan (out of scope), but worth a line in onboarding docs or a `predev`/`prebuild` cache-clear step if it recurs often.

### Documented Exceptions (approved by coordinator, not a code defect)

**2. Byte-parity exception for 4 of 45 rendered pages — MDX-vs-Markdown serializer escaping difference**
- **Found during:** Task 3's full-corpus rendered-HTML parity check
- **Issue:** `diff -rq` against the pre-migration baseline found exactly 4 pages with a single-line HTML diff each, all inside inline-code or void-element output:
  - `dist/case-studies/ccrms/index.html` (source `case-study-2.md`): `<code>Content&lt;T&gt;</code>` (baseline, MDX) vs `<code>Content&#x3C;T></code>` (migrated, Markdown)
  - `dist/blog/modern-ott-streaming-architecture/index.html` (source `post-4.md`), `dist/blog/ott-architecture-high-concurrency/index.html` (source `post-1.md`), `dist/blog/technical-due-diligence-web3/index.html` (source `post-3.md`): `<hr/>` (baseline, MDX) vs `<hr>` (migrated, Markdown)
- **Root cause:** `@astrojs/mdx`'s JSX-codegen-based compiler serializes HTML in an XHTML-leaning style (symmetric `&lt;`/`&gt;` escaping inside inline code; self-closing void elements). Astro's native Markdown pipeline (`rehype-stringify`, now processing these `.md` files) serializes to strict HTML5 (only escapes `<` where ambiguous, leaves `>` literal, omits the trailing slash on void elements). Both outputs are valid HTML5 and render visually and semantically identical in every browser — confirmed by inspection, not just assumed. Zero content loss, zero shortcode impact, zero heading-class impact.
- **Why not auto-fixed:** Both possible fixes are explicitly forbidden by this plan's own operating rules — rewriting the 4 source files' inline-code/`<hr>`-producing markdown (forbidden by the `git mv`-only, byte-preservation rule) or tuning `rehype-stringify`/markdown options in `astro.config.mjs` (forbidden by Task 3's own scope boundary, and would affect every `.md`/`.mdx` file sitewide, not just these 4). This was surfaced to the coordinator as a halt-and-report rather than decided unilaterally, since the plan's must_have offered no explicit tolerance for it.
- **Resolution:** Coordinator approved Option A — accept as a documented, zero-impact exception, the same precedent as the plan's pre-existing `dist/blog/category/**` Preline-accordion-ID carve-out. `03-02-PLAN.md`'s `operating_rules` and Task 3's `must_haves`/`fails_when` verification text were amended in place to record this carve-out for the historical record, alongside this Summary.
- **Files affected:** `.planning/phases/03-code-content-hygiene/03-02-PLAN.md` (documentation amendment only — no source content or `astro.config.mjs` was modified)

No auth gates encountered.

## Known Stubs

None — this plan renames existing files with unchanged bodies; `case-study-5.md` and `case-study-6.md` remain the same 51-byte `draft: true` placeholder stubs they were before migration, with format-only changes. Their content and reachability are out of scope (owned by Phase 1 / TECHDEBT-04).

## Self-Check: PASSED

Verified all claimed changes exist on disk/in git:
- `git ls-files -- themes/lumio/src/content/blog themes/lumio/src/content/case-studies | grep -c '\.mdx$'` → `0` (confirmed)
- `git ls-files -- themes/lumio/src/content/blog themes/lumio/src/content/case-studies | grep -c '\.md$'` → `20` (confirmed)
- `find themes/lumio/dist -name '*.html' | wc -l` → `45`, route inventory identical to baseline (confirmed)
- `diff /tmp/gsd-phase03/baseline-02/sitemap-0.xml themes/lumio/dist/sitemap-0.xml` → clean, exit 0 (confirmed)
- `diff /tmp/gsd-phase03/baseline-02/sitemap-index.xml themes/lumio/dist/sitemap-index.xml` → clean, exit 0 (confirmed)
- `npm run astro-check` → `0 errors, 0 warnings, 0 hints` (confirmed)
- `grep -c 'mdx()' themes/lumio/astro.config.mjs` → `1` (confirmed)
- Rendered-HTML parity diff → exactly the 4 documented exceptions, no other diffs (confirmed)
- Commit `3c4d480` exists in `git log --oneline --all` (confirmed)
- Commit `3d2402e` exists in `git log --oneline --all` (confirmed)
- `.planning/REQUIREMENTS.md` shows `[x] TECHDEBT-01` and `[x] TECHDEBT-02`, both `Complete` in the traceability table (confirmed)

No missing items.
