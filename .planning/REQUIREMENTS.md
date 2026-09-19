# Requirements: Ryc Brownrigg Consulting Site

**Defined:** 2026-09-18
**Core Value:** The site must credibly present Ryc as a hireable consulting authority and reliably capture contact-form leads.

## v1.2 Requirements

Requirements for this milestone (unit-test coverage for the 13 pure, testable `src/lib/utils/` modules deliberately deferred out of v1.1 Phase 5's named scope). Each maps to roadmap phases.

### Content & Text Utilities

- [x] **TECHDEBT-08**: Automated unit tests cover `generateTypeScale.ts`
- [x] **TECHDEBT-14**: Automated unit tests cover `readingTime.ts`
- [x] **TECHDEBT-15**: Automated unit tests cover `buildToc.ts`
- [x] **TECHDEBT-20**: Automated unit tests cover `JsonLdGenerator.ts`

### Data/Object Utilities

- [x] **TECHDEBT-11**: Automated unit tests cover `overrideObjects.ts`
- [x] **TECHDEBT-13**: Automated unit tests cover `removeEmptyKeys.ts`
- [x] **TECHDEBT-09**: Automated unit tests cover `filteredEnabled.ts`
- [x] **TECHDEBT-12**: Automated unit tests cover `uniqueIdGenerator.ts`

### Navigation & Routing Utilities

- [x] **TECHDEBT-10**: Automated unit tests cover `handleDraftPage.ts`
- [x] **TECHDEBT-16**: Automated unit tests cover `navigationActive.ts`
- [x] **TECHDEBT-17**: Automated unit tests cover `getRelatedContent.ts`
- [x] **TECHDEBT-18**: Automated unit tests cover `preline.ts`
- [x] **TECHDEBT-19**: Automated unit tests cover `absoluteUrl.ts`

## v2 Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Content

- **CONTENT-01**: Fill case-study-5 with a real project (still an empty stub as of 2026-09-17 — no content exists to migrate; revisit if/when a 5th project is identified)
- **CONTENT-02**: Fill case-study-6 with a real project (same — empty stub, no content available)
- **CONTENT-03**: Replace the 5 placeholder testimonials with real ones (still no real testimonials available as of 2026-09-17)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Domain canonicalization across onemoregreatidea.com/askryc.com/.mt/.net | onemoregreatidea.com stays its own dedicated Astro site permanently; askryc.com/.net/.mt are being converted to a separate WordPress project (`/Users/ryc/projects/askryc`) — no domain consolidation happens in this project |
| Full redesign / new theme | Lumio theme is settled; this milestone is test-coverage cleanup, not a re-theme |
| Case-study-5/6 real content and real testimonials | Still no real material available as of 2026-09-17 — tracked as v2 CONTENT-01/02/03 |
| Testing the 8 Astro/DOM/filesystem-coupled modules (`bgOptimizedImage.ts`, `removeUnusedFonts.ts`, `remarkParseContent.ts`, `AstroFont.ts`, `localizedRouteResolver.ts`, `downloadSelfHostedFonts.ts`, `FormHandle.ts`, `i18nUtils.ts`) | Already classified in v1.1 Phase 5 as needing a fundamentally different test harness (Astro runtime, filesystem I/O, or DOM); `i18nUtils.ts` already has coverage via the pre-existing `getLocalUrlCTM.test.ts` — see `.planning/milestones/v1.1-phases/05-utility-test-coverage/05-01-SUMMARY.md` for the full accounting |
| New CI changes | v1.1's CI pipeline (`astro check` + `npm run test:ci` on push/PR) already runs these new test files automatically — no pipeline changes needed |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TECHDEBT-08 | Phase 6 | Complete |
| TECHDEBT-09 | Phase 6 | Complete |
| TECHDEBT-10 | Phase 6 | Complete |
| TECHDEBT-11 | Phase 6 | Complete |
| TECHDEBT-12 | Phase 6 | Complete |
| TECHDEBT-13 | Phase 6 | Complete |
| TECHDEBT-14 | Phase 6 | Complete |
| TECHDEBT-15 | Phase 6 | Complete |
| TECHDEBT-16 | Phase 6 | Complete |
| TECHDEBT-17 | Phase 6 | Complete |
| TECHDEBT-18 | Phase 6 | Complete |
| TECHDEBT-19 | Phase 6 | Complete |
| TECHDEBT-20 | Phase 6 | Complete |

**Coverage:**

- v1.2 requirements: 13 total
- Mapped to phases: 13/13 ✓
- Unmapped: 0

---
*Requirements defined: 2026-09-18*
*Last updated: 2026-09-18 (roadmap created — all 13 requirements mapped to Phase 6)*
