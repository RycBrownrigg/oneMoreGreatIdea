---
phase: 03-code-content-hygiene
plan: 01
subsystem: content-hygiene
tags: [i18n, content-cleanup, astro, tech-debt]
dependency-graph:
  requires: []
  provides:
    - "single-locale language.json (en only)"
    - "disableLanguages == [] in config.toml"
    - "no French-only tooling scripts in themes/lumio/scripts/"
  affects:
    - themes/lumio/src/config/language.json
    - themes/lumio/src/config/config.toml
    - themes/lumio/package.json
    - themes/lumio/scripts/
tech-stack:
  added: []
  patterns:
    - "Rendered-output byte-parity proof (route inventory + diff -rq on case-studies/, blog/ excluding category/, sitemap-0.xml) as the acceptance gate for a content-deletion change"
key-files:
  created: []
  modified:
    - themes/lumio/src/config/language.json
    - themes/lumio/src/config/config.toml
    - themes/lumio/package.json
  deleted:
    - "84 files under themes/lumio/src/content/*/french/"
    - themes/lumio/src/i18n/fr.json
    - themes/lumio/src/config/menu.fr.json
    - themes/lumio/scripts/remove-multilingual.mjs
    - themes/lumio/scripts/generate-multilingual-content.mjs
decisions:
  - "Ran the removal in the plan's prescribed order (baseline snapshot -> toml:watch one-shot -> remove-multilingual -> git status sanity check -> rebuild -> parity diff) rather than deleting files by hand, so the existing tooling's own logic (language.json rewrite, menu/i18n filtering) is exercised and proven correct rather than re-implemented"
  - "Left the plan's own script-count=9 verify assertion unmet at the literal number (actual is 10) because the plan's action text explicitly names 10 scripts to preserve (dev, build, preview, astro-check, toml:watch, generate-favicons, remove-draft-from-sitemap, format, test, deploy:cf) after removing exactly 2 from the original 12 -- the numeric literal in the automated check is an off-by-one typo in the plan, not a defect in the implementation"
metrics:
  duration: "~13 min"
  completed: 2026-09-08
status: complete
actuals:
  tokens: 36936
  tasks: 3
  commits: 2
---

# Phase 3 Plan 1: Remove French Locale Content & Tooling Summary

Removed all 86 git-tracked French-locale artifacts (84 content files, `fr.json`, `menu.fr.json`) plus the two French-only tooling scripts from the Lumio Astro theme, and proved via rendered-output byte-parity that the English site is completely unchanged.

## What Was Built

**Task 1 (tracer):** Captured a pre-removal `dist/` baseline (45 HTML routes), regenerated `.astro/config.generated.json` via one-shot `npm run toml:watch`, then ran the existing `npm run remove-multilingual` script. It recursively deleted all 15 `french/` content directories (84 files total), rewrote `src/config/language.json` to a single `en` entry, deleted `src/config/menu.fr.json`, and deleted `src/i18n/fr.json`. `git status --porcelain` confirmed the exact expected change set (86 deletions + 1 modification, zero `/english/` paths touched) before rebuilding. The rebuild produced the identical 45-route inventory, and `diff -rq` against the baseline showed byte-identical `case-studies/`, `blog/` (excluding the intentionally-nondeterministic `blog/category/**` Preline accordion IDs), and `sitemap-0.xml`.

**Task 2:** Set `disableLanguages = []` in `config.toml` (was `["fr"]`), preserving column alignment for the TOML prettier plugin. Deleted the two French-only tooling scripts (`remove-multilingual.mjs`, `generate-multilingual-content.mjs` — the latter hardcoded `TARGET_LANG.languageCode: "fr"`) via `git rm`. Removed their two corresponding entries from `package.json`'s `scripts` object, leaving 10 scripts (`dev`, `build`, `preview`, `astro-check`, `toml:watch`, `generate-favicons`, `remove-draft-from-sitemap`, `format`, `test`, `deploy:cf`). Confirmed `@astrojs/mdx` remains registered in `astro.config.mjs` (untouched, out of scope). Rebuilt and confirmed 45 routes still emit correctly.

**Task 3 (audit/gate, no files modified):** Ran a repo-wide audit for surviving French artifacts. `git ls-files -- themes/lumio | grep -Ec 'french|fr\.json|menu\.fr'` returned `0` (down from 86 tracked matches before this plan). A recursive content grep for `src/i18n/fr`, `menu\.fr`, and `/french/` across `themes/lumio/src`, `themes/lumio/scripts`, `themes/lumio/astro.config.mjs`, and `themes/lumio/package.json` found nothing to fix — no source file needed correction. `npm run astro-check` reported `Result (197 files): 0 errors, 0 warnings, 0 hints`. A final `npm run build` reproduced the identical 45-route inventory against the original baseline.

## Deviations from Plan

### Auto-fixed Issues

None — no bugs, missing functionality, or blocking issues were encountered. The removal script, config edit, and script deletions all worked exactly as the plan described.

### Plan Verify-Block Discrepancy (documented, not a code defect)

**1. Task 2's automated verify asserts `script-count=9`; actual and correct value is `10`.**
- **Found during:** Task 2 verification
- **Issue:** The plan's `<fails_when>` for the `package.json` script-count check names `9` as the expected count after deleting the `remove-multilingual` and `generate-multilingual-content` entries. The plan's own `<action>` text, however, explicitly lists 10 scripts that must be left untouched (`dev, build, preview, astro-check, toml:watch, generate-favicons, remove-draft-from-sitemap, format, test, deploy:cf`), and the original `package.json` had 12 scripts total. `12 - 2 = 10`, matching the do-not-touch list, not the `9` in the verify block.
- **Resolution:** Implemented exactly what the action text and acceptance criteria specify (delete only the two named multilingual scripts, touch nothing else). The resulting `package.json` has 10 scripts and 0 scripts containing the substring `multilingual`, which is the correct and intended end state. No file was changed to force the count to 9, since doing so would mean deleting a script the plan explicitly says to preserve.
- **Files affected:** None (verification-only finding, no code change required)

No stubs, no auth gates encountered.

## Known Stubs

None — this plan is a pure deletion/config-edit plan with no new code surface.

## Self-Check: PASSED

Verified all claimed deletions and modifications exist on disk/in git:
- `git ls-files -- themes/lumio/src/content | grep -c /french/` → `0` (confirmed)
- `git ls-files -- themes/lumio/src/i18n` → exactly `themes/lumio/src/i18n/en.json` (confirmed)
- `git ls-files -- themes/lumio/src/config | grep -c 'menu\.'` → `1`, that entry is `menu.en.json` (confirmed)
- `themes/lumio/src/config/language.json` → single-element array, `{"languageCode":"en","contentDir":"english",...}` (confirmed)
- `git ls-files -- themes/lumio/scripts` → exactly `generate-favicons.mjs`, `remove-draft-from-sitemap.mjs`, `toml-watcher.mjs` (confirmed)
- Commit `6dac3f1` exists in `git log --oneline --all` (confirmed)
- Commit `fc43c8d` exists in `git log --oneline --all` (confirmed)
- `npm run build` exits 0, 45 routes, byte-identical `case-studies/`, `blog/` (excl. `category/`), and `sitemap-0.xml` vs. baseline (confirmed)
- `npm run astro-check` → `0 errors`, `0 warnings` (confirmed)

No missing items.
