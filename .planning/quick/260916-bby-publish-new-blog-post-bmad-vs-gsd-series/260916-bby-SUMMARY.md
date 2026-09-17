---
status: complete
quick_id: 260916-bby
requirements-completed:
  - QUICK-260916-BBY
commit: f9f0b46
---

# Summary: Publish BMad vs GSD Series 4 blog post

## What Was Built

- `themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg` — byte-identical copy of the source header image (already matched the series visual language, no restyling needed)
- `themes/lumio/src/content/blog/english/post-14.md` — "The Enterprise Tradeoffs, and When to Use Which" (Series 4), following post-13's exact frontmatter shape and structural conventions:
  - Five body headings converted from standalone bold lines to `## Heading [.text-h4]`
  - Opening "last post" reference linked to `/blog/bmad-vs-gsd-where-each-wins-and-breaks/` (Part 3), matching post-12's precedent of linking its own "last post" reference
  - `readTime: "5 min read"` (calibrated against sibling word counts: post-12 848w→5min, post-13 916w→5min; this post is 834w)
  - `customSlug: "bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which"`, `date: 2026-09-16T12:00:00Z`, `draft: false`
- Single commit `f9f0b46` containing exactly these two files, mirroring the Series 3 commit's scope

## Verification Results

Re-ran all Task 3 verification criteria directly (the spawned executor had completed the actual work and commit but stalled before writing this summary, so verification was re-confirmed rather than assumed):

- `npm run build` from `themes/lumio/` exits 0 — 49 pages built (up from 47 pre-post), no content-collection or Zod errors
- `dist/blog/bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which/index.html` exists
- Page references the hashed Series 4 SVG (`_astro/bmad-gsd-series-4.*.svg`) in both the hero image and its responsive srcset variants, with correct `alt` text
- Slug appears in both `dist/blog/index.html` and `dist/sitemap-0.xml`
- All 5 section headings render as `<h2 class="text-h4">` with correct auto-generated anchor ids
- `git show --stat f9f0b46` confirms exactly 2 files changed, 117 insertions, 0 deletions

**Human-check substitute:** Could not open a real browser. Grepped the built HTML directly instead — image `<img>` tag renders with correct `srcset`/`sizes`/`alt`, all 5 headings carry the `text-h4` class matching post-11/12/13's visual rhythm. Visual confirmation in an actual browser (e.g. `npx http-server dist`) is still recommended before considering this fully done, per the plan's original human-check note.

## Deviations from Plan

None — plan executed as written. (The originally-spawned executor subagent completed all three tasks and the commit correctly but stalled for several hours before producing this SUMMARY.md; the orchestrating session stopped it and independently re-verified and wrote this summary rather than re-running the already-successful build/commit steps.)

## Known Stubs

None.

## Follow-up (deferred, not part of this task)

`post-11.md`'s "The Series" index still renders Parts 3, 4, and 5 as plain bold text rather than links, even though Parts 3 and 4 are now both published. This is a real, pre-existing consistency gap (confirmed the Series 3 commit also didn't touch it) — worth a separate quick task to link Parts 3 and 4 in that index.

## Self-Check: PASSED
