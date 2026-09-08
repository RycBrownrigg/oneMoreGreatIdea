# Roadmap: Ryc Brownrigg Consulting Site

## Overview

This milestone closes out the remaining pre-launch/launch-quality punch list on Ryc's already-live consulting site. The work is not sequential feature-building but four independent buckets of maintenance: settle the canonical domain and point all four domain names at the site, finish the last incomplete/placeholder content (case studies, testimonials, OG image, dead locale content), and retire two known pieces of tech debt (legacy `.mdx` content and an untyped form utility) that currently work "by accident." Domain work lands first since it's foundational infrastructure and the one place a later phase's output (OG image URLs) embeds the decision; the remaining three phases have no real ordering dependency between them.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Domain Canonicalization** - Decide the canonical domain and get all four domain names resolving to the live site with valid certs
- [ ] **Phase 2: Case Studies Completion** - Finish Vongo's remaining case studies and stop draft placeholders from being publicly reachable
- [ ] **Phase 3: Trust & Social Presentation** - Replace placeholder testimonials with real ones and add a proper OG image for social sharing
- [ ] **Phase 4: Code & Content Hygiene** - Migrate legacy `.mdx` content to `.md`, remove dead French locale content, and fix the untyped FormHandle utility

## Phase Details

### Phase 1: Domain Canonicalization
**Goal**: Users reliably reach the site under one decided canonical domain, with all four domain names resolving safely to it
**Depends on**: Nothing (first phase)
**Requirements**: DOMAIN-01, DOMAIN-02
**Success Criteria** (what must be TRUE):
  1. A canonical primary domain has been decided among onemoregreatidea.com, askryc.com, askryc.mt, and askryc.net, and recorded as a Key Decision in PROJECT.md
  2. Visiting any of the four domains resolves via DNS to the live site
  3. Each domain serves the site over HTTPS with a valid, non-expired certificate (no browser security warnings)
  4. `config.toml`'s `baseUrl` is set to the canonical domain, and the built site's canonical link tags and sitemap URLs reflect it
**Plans**: TBD

### Phase 2: Case Studies Completion
**Goal**: Vongo's case study series is complete, and no unfinished case study content is publicly reachable by URL
**Depends on**: Nothing (independent of Phase 1)
**Requirements**: CONTENT-01, CONTENT-02, TECHDEBT-04
**Success Criteria** (what must be TRUE):
  1. case-study-5 shows real Vongo project screenshots and architecture diagrams in place of the current placeholder content
  2. case-study-6 shows real Vongo project screenshots and architecture diagrams in place of the current placeholder content
  3. Any case study still flagged `draft: true` returns a 404 (or is excluded from the build entirely) when its URL is requested directly, not merely hidden from the sitemap or content listings
**Plans**: TBD

### Phase 3: Trust & Social Presentation
**Goal**: The site presents credible social proof and produces a correct preview when a page is shared on social platforms
**Depends on**: Phase 1 (the OG image's absolute URL embeds the canonical domain, so finalizing the domain first avoids redoing this)
**Requirements**: CONTENT-03, CONTENT-04
**Success Criteria** (what must be TRUE):
  1. All 5 testimonials display real client/colleague names, roles, and quotes — no placeholder text remains
  2. Sharing any site URL on social platforms (e.g. Twitter/X, LinkedIn, Facebook) renders a custom, on-brand preview image rather than a missing or default one
**Plans**: TBD

### Phase 4: Code & Content Hygiene
**Goal**: The codebase's content-format and type-safety debt is eliminated, and dead locale content is removed
**Depends on**: Nothing (independent cleanup work)
**Requirements**: CONTENT-05, TECHDEBT-01, TECHDEBT-02, TECHDEBT-03
**Success Criteria** (what must be TRUE):
  1. No `.mdx` files remain in `src/content/blog/` or `src/content/case-studies/`; every migrated post and case study is `.md` and renders identically to its pre-migration output (same body content, same shortcode functionality, no content loss)
  2. `src/lib/utils/FormHandle.ts` has `@ts-nocheck` removed, passes `astro check`/TypeScript strict mode with zero errors, and the contact form still submits and resets correctly
  3. French locale content directories and any disabled-locale-only scripts/assets are removed from the repository
  4. `npm run build` completes with zero content-collection or type-checking errors/warnings
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Domain Canonicalization | 0/TBD | Not started | - |
| 2. Case Studies Completion | 0/TBD | Not started | - |
| 3. Trust & Social Presentation | 0/TBD | Not started | - |
| 4. Code & Content Hygiene | 0/TBD | Not started | - |
