# Requirements: Ryc Brownrigg Consulting Site

**Defined:** 2026-09-08
**Core Value:** The site must credibly present Ryc as a hireable consulting authority and reliably capture contact-form leads.

## v1 Requirements

Requirements for this milestone (finishing pre-launch/launch-quality work on the already-live site). Each maps to roadmap phases.

### Domain

- [ ] **DOMAIN-01**: A single canonical primary domain is decided among onemoregreatidea.com, askryc.com, askryc.mt, and askryc.net
- [ ] **DOMAIN-02**: The remaining domains resolve (DNS + valid cert) to the site, and `config.toml`'s `baseUrl` is updated to the canonical domain

### Content

- [ ] **CONTENT-01**: Vongo case-study-5 shows real project screenshots/architecture diagrams instead of the current `draft: true` placeholder
- [ ] **CONTENT-02**: Vongo case-study-6 shows real project screenshots/architecture diagrams instead of the current `draft: true` placeholder
- [ ] **CONTENT-03**: The 5 placeholder testimonials are replaced with real client/colleague testimonials
- [ ] **CONTENT-04**: The site has a proper OG image so social shares render correctly
- [ ] **CONTENT-05**: Disabled French locale content is removed from the codebase

### Tech Debt

- [ ] **TECHDEBT-01**: Legacy blog posts `post-1.mdx`–`post-9.mdx` are migrated to `.md` with no loss of content or shortcode functionality
- [ ] **TECHDEBT-02**: All six case studies (`case-study-1.mdx`–`case-study-6.mdx`) are migrated to `.md` with no loss of content or shortcode functionality
- [ ] **TECHDEBT-03**: `src/lib/utils/FormHandle.ts` has `@ts-nocheck` removed and passes `astro check`/TypeScript strict mode
- [ ] **TECHDEBT-04**: Draft case-study pages (case-study-5, case-study-6) are not reachable by direct URL while still `draft: true`

## v2 Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Tech Debt

- **TECHDEBT-05**: Set up a CI pipeline (`astro check`, `npm run test`) on push/PR
- **TECHDEBT-06**: Expand automated test coverage beyond `FormHandle.ts` typing and the existing i18n URL utility test
- **TECHDEBT-07**: Remove or document unused `netlify.toml`/`wrangler.toml`/`deploy:cf` deploy targets

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Full redesign / new theme | Lumio theme is settled; this milestone is content/config/cleanup, not a re-theme |
| CI/CD pipeline | Manual rsync deploy works today; not launch-blocking (tracked as TECHDEBT-05 v2) |
| Broad automated test coverage | Build-time failures are an acceptable safety net for now (tracked as TECHDEBT-06 v2) |
| Removing unused deploy configs | Low-impact cleanup, not launch-blocking (tracked as TECHDEBT-07 v2) |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DOMAIN-01 | Phase 1 | Pending |
| DOMAIN-02 | Phase 1 | Pending |
| CONTENT-01 | Phase 2 | Pending |
| CONTENT-02 | Phase 2 | Pending |
| CONTENT-03 | Phase 3 | Pending |
| CONTENT-04 | Phase 3 | Pending |
| CONTENT-05 | Phase 4 | Pending |
| TECHDEBT-01 | Phase 4 | Pending |
| TECHDEBT-02 | Phase 4 | Pending |
| TECHDEBT-03 | Phase 4 | Pending |
| TECHDEBT-04 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-08*
*Last updated: 2026-09-08 after roadmap creation*
