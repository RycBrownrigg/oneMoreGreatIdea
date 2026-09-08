# Requirements: Ryc Brownrigg Consulting Site

**Defined:** 2026-09-08
**Core Value:** The site must credibly present Ryc as a hireable consulting authority and reliably capture contact-form leads.

## v1 Requirements

Requirements for this milestone (finishing pre-launch/launch-quality work on the already-live site). Each maps to roadmap phases.

### Content

- [ ] **CONTENT-04**: The site has a proper OG image so social shares render correctly
- [x] **CONTENT-05**: Disabled French locale content is removed from the codebase

### Tech Debt

- [x] **TECHDEBT-01**: Legacy blog posts `post-1.mdx`–`post-9.mdx` are migrated to `.md` with no loss of content or shortcode functionality
- [x] **TECHDEBT-02**: All six case studies (`case-study-1.mdx`–`case-study-6.mdx`) are migrated to `.md` with no loss of content or shortcode functionality
- [x] **TECHDEBT-03**: `src/lib/utils/FormHandle.ts` has `@ts-nocheck` removed and passes `astro check`/TypeScript strict mode
- [x] **TECHDEBT-04**: The empty `case-study-5`/`case-study-6` placeholder stubs are not reachable by direct URL while still `draft: true` — verified already satisfied by existing `draft`-filtering code, no change needed (see Phase 1 VERIFICATION.md)

## v2 Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Content

- **CONTENT-01**: Fill case-study-5 with a real project (currently an empty stub — no content exists to migrate; revisit if/when a 5th project is identified)
- **CONTENT-02**: Fill case-study-6 with a real project (same — empty stub, no content available)
- **CONTENT-03**: Replace the 5 placeholder testimonials with real ones (deferred — no real testimonials available yet)

### Tech Debt

- **TECHDEBT-05**: Set up a CI pipeline (`astro check`, `npm run test`) on push/PR
- **TECHDEBT-06**: Expand automated test coverage beyond `FormHandle.ts` typing and the existing i18n URL utility test
- **TECHDEBT-07**: Remove or document unused `netlify.toml`/`wrangler.toml`/`deploy:cf` deploy targets

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Domain canonicalization across onemoregreatidea.com/askryc.com/.mt/.net | onemoregreatidea.com stays its own dedicated Astro site permanently; askryc.com/.net/.mt are being converted to a separate WordPress project (`/Users/ryc/projects/askryc`) — no domain consolidation happens in this project |
| Full redesign / new theme | Lumio theme is settled; this milestone is content/config/cleanup, not a re-theme |
| CI/CD pipeline | Manual rsync deploy works today; not launch-blocking (tracked as TECHDEBT-05 v2) |
| Broad automated test coverage | Build-time failures are an acceptable safety net for now (tracked as TECHDEBT-06 v2) |
| Removing unused deploy configs | Low-impact cleanup, not launch-blocking (tracked as TECHDEBT-07 v2) |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TECHDEBT-04 | Phase 1 | Complete (already satisfied, no change) |
| CONTENT-04 | Phase 2 | Pending |
| CONTENT-05 | Phase 3 | Complete |
| TECHDEBT-01 | Phase 3 | Complete |
| TECHDEBT-02 | Phase 3 | Complete |
| TECHDEBT-03 | Phase 3 | Complete |

**Coverage:**

- v1 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-08*
*Last updated: 2026-09-08 after scope correction (domain decision resolved; case-study-5/6 content and testimonials deferred to v2 — no content available)*
