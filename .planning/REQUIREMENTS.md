# Requirements: Ryc Brownrigg Consulting Site

**Defined:** 2026-09-17
**Core Value:** The site must credibly present Ryc as a hireable consulting authority and reliably capture contact-form leads.

## v1.1 Requirements

Requirements for this milestone (CI pipeline, broader test coverage, and unused deploy-config cleanup on the already-live site). Each maps to roadmap phases.

### CI/CD

- [ ] **TECHDEBT-05**: A CI workflow (GitHub Actions) runs on every push and pull request, executing `astro check` and a non-interactive test run, failing the workflow if either fails

### Testing

- [ ] **TECHDEBT-06**: Automated unit tests cover the site's pure utility functions beyond `FormHandle.ts` and `i18nUtils.ts` (e.g. `dateFormat.ts`, `textConverter.ts`, `sortFunctions.ts`, `objectFunctions.ts`, `splitProtectedText.ts`, `trailingSlashChecker.ts`)

### Tech Debt

- [ ] **TECHDEBT-07**: Unused `netlify.toml`, `wrangler.toml`, and the `deploy:cf` npm script are removed from the repository (or, if a real reason to keep one is found, it's documented instead of removed)

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
| Full redesign / new theme | Lumio theme is settled; this milestone is CI/testing/config cleanup, not a re-theme |
| Case-study-5/6 real content and real testimonials | Still no real material available as of 2026-09-17 — tracked as v2 CONTENT-01/02/03 |
| Automating deploy via CI | CI in this milestone is verification-only (astro check + tests); deploy stays manual rsync via `deploy.sh` |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TECHDEBT-05 | TBD | Pending |
| TECHDEBT-06 | TBD | Pending |
| TECHDEBT-07 | TBD | Pending |

**Coverage:**

- v1.1 requirements: 3 total
- Mapped to phases: 0
- Unmapped: 3 ⚠️ (roadmap not yet created)

---
*Requirements defined: 2026-09-17*
*Last updated: 2026-09-17*
