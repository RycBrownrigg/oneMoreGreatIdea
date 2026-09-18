# Requirements: Ryc Brownrigg Consulting Site

**Defined:** 2026-09-17
**Core Value:** The site must credibly present Ryc as a hireable consulting authority and reliably capture contact-form leads.

## v1.1 Requirements

Requirements for this milestone (CI pipeline, broader test coverage, and unused deploy-config cleanup on the already-live site). Each maps to roadmap phases.

### CI/CD

- [x] **TECHDEBT-05**: A CI workflow (GitHub Actions) runs on every push and pull request, executing `astro check` and a non-interactive test run, failing the workflow if either fails

### Testing

- [ ] **TECHDEBT-06**: Automated unit tests cover the site's pure utility functions beyond `FormHandle.ts` and `i18nUtils.ts` (e.g. `dateFormat.ts`, `textConverter.ts`, `sortFunctions.ts`, `objectFunctions.ts`, `splitProtectedText.ts`, `trailingSlashChecker.ts`)

### Tech Debt

- [x] **TECHDEBT-07**: Unused `netlify.toml`, `wrangler.toml`, and the `deploy:cf` npm script are removed from the repository (or, if a real reason to keep one is found, it's documented instead of removed)

## v2 Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Content

- **CONTENT-01**: Fill case-study-5 with a real project (still an empty stub as of 2026-09-17 — no content exists to migrate; revisit if/when a 5th project is identified)
- **CONTENT-02**: Fill case-study-6 with a real project (same — empty stub, no content available)
- **CONTENT-03**: Replace the 5 placeholder testimonials with real ones (still no real testimonials available as of 2026-09-17)

### Testing

- **TECHDEBT-08**: Extend unit-test coverage to the remaining pure, testable utility modules in `src/lib/utils/` not covered by Phase 5 (`generateTypeScale.ts`, `filteredEnabled.ts`, `handleDraftPage.ts`, `overrideObjects.ts`, `uniqueIdGenerator.ts`, `removeEmptyKeys.ts`, `readingTime.ts`, `buildToc.ts`, `navigationActive.ts`, `getRelatedContent.ts`, `preline.ts`, `absoluteUrl.ts`, `JsonLdGenerator.ts`) — deliberately deferred out of Phase 5's scope (2026-09-18), which focused on the modules named in the original ROADMAP goal and TECHDEBT-06 examples. Ryc confirmed these can be revisited later; full per-module classification recorded in `.planning/phases/05-utility-test-coverage/05-01-SUMMARY.md`.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Domain canonicalization across onemoregreatidea.com/askryc.com/.mt/.net | onemoregreatidea.com stays its own dedicated Astro site permanently; askryc.com/.net/.mt are being converted to a separate WordPress project (`/Users/ryc/projects/askryc`) — no domain consolidation happens in this project |
| Full redesign / new theme | Lumio theme is settled; this milestone is CI/testing/config cleanup, not a re-theme |
| Case-study-5/6 real content and real testimonials | Still no real material available as of 2026-09-17 — tracked as v2 CONTENT-01/02/03 |
| Automating deploy via CI | CI in this milestone is verification-only (astro check + tests); deploy stays manual rsync via `deploy.sh` |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TECHDEBT-05 | Phase 4 | Complete |
| TECHDEBT-06 | Phase 5 | Pending |
| TECHDEBT-07 | Phase 4 | Complete |

**Coverage:**

- v1.1 requirements: 3 total
- Mapped to phases: 3 ✓
- Unmapped: 0

---
*Requirements defined: 2026-09-17*
*Last updated: 2026-09-18 (Phase 4 complete: TECHDEBT-05/07 verified via real GitHub Actions runs)*
