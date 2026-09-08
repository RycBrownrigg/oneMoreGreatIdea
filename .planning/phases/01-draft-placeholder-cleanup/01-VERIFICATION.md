# Phase 1 Verification: Draft Placeholder Cleanup

**Date:** 2026-09-08
**Requirement:** TECHDEBT-04
**Verdict:** Already satisfied by existing code — no changes made.

## Finding

The phase goal ("the empty case-study-5/6 placeholder stubs are not reachable by direct URL while still `draft: true`") is already true in production, and was true before this phase started.

`themes/lumio/src/lib/contentParser.astro`'s `getCollectionCTM()` helper filters out any collection entry with `draft: true` when `import.meta.env.PROD` is set:

```js
let cleaned = import.meta.env.PROD
  ? pages.filter((page) => !page.data.draft)
  : pages;
```

`themes/lumio/src/pages/[...lang]/case-studies/[single].astro`'s `getStaticPaths()` builds its route list exclusively from `getCollectionCTM()`'s output, so a `draft: true` entry never gets a static route generated for it in a production build.

## Verification performed

Ran `npm run build` (from `themes/lumio/`) and inspected the actual output:

```
$ find dist/case-studies -maxdepth 1 -type d
dist/case-studies
dist/case-studies/page
dist/case-studies/vongo
dist/case-studies/ccrms
dist/case-studies/horizongo
dist/case-studies/inktix
```

Only the 4 real, non-draft case studies produced a route. `case-study-5` and `case-study-6` (both `draft: true`, empty placeholder stubs) produced no route at all — not even an unlisted one. Since this is a fully static site deployed via rsync with no server-side fallback routing, a direct request to their URL on the live server has no matching file to serve and 404s.

## Correction to prior record

`.planning/codebase/CONCERNS.md`'s "Draft content is built but not fully hidden" entry (written during initial codebase mapping, before this verification) was based on reading `scripts/remove-draft-from-sitemap.mjs` in isolation and did not account for the `getCollectionCTM()` production draft-filter. That concern is superseded by this finding — draft case-study pages are correctly excluded from the build entirely, not merely hidden from the sitemap.

## Outcome

TECHDEBT-04 marked complete. No code changes were required or made. Phase 1 requires no plan/execution.
