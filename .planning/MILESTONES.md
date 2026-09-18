# Milestones: Ryc Brownrigg Consulting Site

## v1.1 — CI & Test Hardening

**Shipped:** 2026-09-18
**Phases:** 4-5 (2 plans total)
**Requirements:** 3/3 satisfied
**Audit:** `.planning/milestones/v1.1-MILESTONE-AUDIT.md` — passed, 5/5 integration checks, no gaps
**Full record:** `.planning/milestones/v1.1-ROADMAP.md`, `.planning/milestones/v1.1-REQUIREMENTS.md`

Replaced "Ryc remembers to run the checks before rsyncing" with a real automated safety net: a GitHub Actions CI pipeline (the project's first, on a newly established public remote) that runs `astro check` and the Jest suite on every push/PR and genuinely gates (proven with real green *and* red runs), and 6 new pure-utility test files (86 tests total, up from 43) covering date formatting, text conversion, sorting, object cloning, protected-text splitting, and trailing-slash handling — plus a proven mutation-check showing the tests assert real behavior, not just that the code runs. Also removed the dead `netlify.toml`/`wrangler.toml`/`deploy:cf` deploy-config cruft. Along the way, surfaced and fixed two real pre-existing test-infrastructure bugs (a missing `tsconfig.jest.json` include and stale locale assertions) and one real Jest/ESM compatibility gap with the `marked` dependency — none of which had ever been caught before because the test suite had never actually been run to completion.

Known verification overrides: 0 newly acknowledged, 0 carried forward.

---

## v1.0 — Launch-Quality Punch List

**Shipped:** 2026-09-16
**Phases:** 1-3 (3 plans total; Phases 1-2 needed no plans)
**Requirements:** 6/6 satisfied
**Audit:** `.planning/v1.0-MILESTONE-AUDIT.md` — passed, no gaps
**Full record:** `.planning/milestones/v1.0-ROADMAP.md`, `.planning/milestones/v1.0-REQUIREMENTS.md`

Closed out the remaining pre-launch/launch-quality punch list on the already-live consulting site: confirmed draft case-study placeholders are unreachable by direct URL, shipped a proper OG image for social sharing, removed dead French-locale content, migrated all legacy `.mdx` content to `.md`, and removed `@ts-nocheck` from the contact-form utility. Human verification also caught and fixed a real production bug (contact form falsely reporting failure on every successful submission).

Known verification overrides: 0 newly acknowledged, 0 carried forward.
