# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.1 — CI & Test Hardening

**Shipped:** 2026-09-18
**Phases:** 2 (Phase 4, Phase 5) | **Plans:** 2 | **Sessions:** 2 (planning/Task-1 session, resume/Task-2/close-out session)

### What Was Built
- GitHub Actions CI pipeline (`astro check` + `npm run test:ci` on every push/PR), on the project's first public GitHub remote
- 6 new Jest test files (86 tests total, up from 43/1 suite) covering `dateFormat`, `textConverter`, `sortFunctions`, `objectFunctions`, `splitProtectedText`, `trailingSlashChecker`
- Removal of unused `netlify.toml`/`wrangler.toml`/`deploy:cf`

### What Worked
- Proving the CI gate is real (not green-by-default) by deliberately breaking a type and a test, confirming red, then reverting — done for both the pipeline itself (Phase 4) and the new test suite's mutation-check (Phase 5)
- Direct execution + direct verification by the orchestrating session, after three prior subagent stalls this milestone (60min–6hr, zero output) — every task this milestone that used direct execution completed and verified cleanly against live state (real CI runs, not simulated)
- Resuming mid-plan via a structured checkpoint (`HANDOFF.json` + `.continue-here.md`, both written before a context-budget pause) restored full task-level context with zero re-derivation needed

### What Was Inefficient
- The plan's own `key_links` assumed `marked` "resolves cleanly under the existing Jest/ts-jest setup" without that ever actually being exercised (no prior test imported `textConverter.ts`) — cost real debugging time to discover `marked` is ESM-only and breaks Jest's CJS runtime, then find and apply the UMD-build `moduleNameMapper` fix
- A stale, already-consumed `HANDOFF.json` was left deleted-but-uncommitted in the working tree across a session boundary — minor, but shows the "delete HANDOFF.json after resumption" step should itself be committed immediately, not left pending

### Patterns Established
- When a plan claims a third-party dependency "resolves cleanly" under the test harness, treat that as unverified until a test actually imports the module exercising it — package.json's `"type": "module"` field is a reliable early warning sign for ESM-only packages that need a `moduleNameMapper` shim under Jest's default CJS runtime
- Both phases embedded their own lightweight threat model directly in PLAN.md rather than invoking a separate `secure-phase` skill step — worked fine for test-only/config-only changes with no new runtime surface

### Key Lessons
1. "No new dependency install needed" and "resolves cleanly" are planning-time assumptions, not verified facts — the first test that actually imports a previously-untested code path is where hidden environment gaps (ESM/CJS, missing tsconfig includes, stale test assertions) surface. Both v1.1 phases found real, previously-invisible defects this way.
2. Repeated multi-hour subagent stalls (planner and executor, 3 times this milestone) are worth stopping early (`TaskStop`) and falling back to direct execution rather than waiting indefinitely — direct execution with real, reproduced verification (not trusting summaries) delivered equally solid results both times.
3. A structured mid-plan checkpoint (HANDOFF.json + .continue-here.md) that fully restates completed work, remaining work, blocking constraints, and next action is what makes a context-budget pause genuinely free — the resuming session needed zero re-derivation and picked up exactly where the prior one stopped.

### Cost Observations
- Model mix: ~95% Sonnet (direct execution and verification by the orchestrating session, both phases), ~5% Haiku (one `gsd-integration-checker` subagent during `/gsd-audit-milestone`)
- Sessions: 2 (one paused mid-Phase-5 at context budget, one resumed and completed close-out)
- Notable: three subagent spawn attempts (planner, executor) this milestone stalled for 60min-6hr with zero output before being manually stopped — none contributed usable work; every actually-completed task was done by direct execution

---

## Milestone: v1.2 — Utility Test Coverage Completion

**Shipped:** 2026-09-19
**Phases:** 1 (Phase 6) | **Plans:** 4 | **Sessions:** 1

### What Was Built
- 13 new Jest test files (one per previously-untested pure `src/lib/utils/` module: `handleDraftPage`, `buildToc`, `navigationActive`, `JsonLdGenerator`, `absoluteUrl`, `generateTypeScale`, `readingTime`, `filteredEnabled`, `overrideObjects`, `removeEmptyKeys`, `uniqueIdGenerator`, `getRelatedContent`, `preline`), growing the suite from 7/86 to 20 suites / 121 tests with zero regressions
- A real-ESM Jest harness fix (`@/*` alias resolution, bare `.astro/config.generated.json` import, `import.meta` support via `NODE_OPTIONS=--experimental-vm-modules`) landed once in Plan 06-01 and reused cleanly by all three later plans with zero conflicts
- Closed out the utility-layer regression safety net started in v1.1 Phase 5 — all 19 pure-testable `src/lib/utils/` modules now have dedicated coverage

### What Worked
- Sequencing the harness fix as a single foundational Wave-1 plan (06-01) before the three parallel Wave-2 plans (06-02/03/04) — every later plan needed zero harness changes, confirmed by an independent integration-checker re-run showing `git diff` empty on `jest.config.ts`/`tsconfig.jest.json`/`package.json` after 06-01's commit
- Deliberate break-and-restore checks (on `buildToc.ts` and `overrideObjects.ts`) performed independently by both the plan executor and the phase verifier, proving the new tests exercise real behavior rather than being tautological
- Honest disclosure of a real, structural test-harness limitation (`handleDraftPage.ts`'s 404-Response branch is unreachable under Jest because `import.meta.env.PROD` is always undefined) instead of quietly marking the requirement done — surfaced in the test file's own comment, in code review, in phase verification, and filed as a standalone follow-up todo rather than blocking the milestone

### What Was Inefficient
- Nothing notable — this was a low-risk, uniform, single-phase milestone (13 small pure-function test files) that matched its v1.1 Phase 5 precedent closely and executed without rework

### Patterns Established
- A single foundational "fix the harness once" plan ahead of parallel content-writing plans avoids the harness-conflict risk entirely, rather than letting each plan patch config independently
- Cross-plan integration checks for test-infrastructure-only milestones should verify: harness changes don't conflict, the full suite passes live (not just per-SUMMARY claims), CI auto-discovery still needs zero workflow edits, and no test file creates fragile cross-plan coupling

### Key Lessons
1. When a Jest/`import.meta.env`-style harness limitation makes a requirement's *letter* satisfiable but not its *spirit*, disclose it explicitly (test comment + review + verification + a tracked follow-up) rather than either silently passing it or blocking the whole milestone over a low-risk, well-understood gap.
2. Splitting harness-fix work into its own tracer plan before fanning out parallel content plans is a reusable pattern beyond this milestone — it turns a potential N-way config conflict into a single point of truth.

### Cost Observations
- Model mix: predominantly Sonnet (direct plan execution and phase verification), Haiku for both subagents used this milestone (`gsd-integration-checker` at audit time, resolved via `resolve-model`)
- Sessions: 1 (execution and close-out completed in a single continuous session)
- Notable: zero subagent stalls this milestone (contrast with v1.1's three stalls) — the harness-first sequencing pattern and small, uniform task shape may have contributed to reliable direct + subagent execution alike

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | — | 3 | Initial launch-quality punch list; git initialized for the project |
| v1.1 | 2 | 2 | First real CI pipeline + public GitHub remote; subagent stalls led to direct-execution-and-verify becoming the working pattern |
| v1.2 | 1 | 1 | Harness-first tracer plan pattern (fix Jest once, fan out content plans after) — zero subagent stalls, zero cross-plan harness conflicts |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|--------------------|
| v1.0 | 43 (1 suite) | `FormHandle.ts` typing + i18n URL util only | — |
| v1.1 | 86 (7 suites) | + 6 pure utility modules (date, text, sort, object, protected-text-split, trailing-slash) | 0 (marked/slugify already present; UMD-build mapping is test-config only) |
| v1.2 | 121 (20 suites) | + 13 pure utility modules — all 19 pure-testable `src/lib/utils/` modules now covered | 0 (harness config only: real-ESM `moduleNameMapper`/`NODE_OPTIONS` changes, no new packages) |

### Top Lessons (Verified Across Milestones)

1. Treat "should already work" planning assumptions about test-harness compatibility as unverified until a real test exercises that exact code path — v1.1 hit this twice (jest.config.ts's `.astro/types.d.ts` gap in Phase 4, `marked`'s ESM-only packaging in Phase 5); v1.2 hit a related but distinct case — `import.meta.env` is structurally unavailable under Jest regardless of config, which is a harness *ceiling*, not a fixable gap, and was handled by disclosure rather than a doomed fix attempt.
2. Real, reproduced verification (live CI runs, mutation checks re-run independently) catches things a plan's own claims and a SUMMARY's prose cannot — worth the extra step every time before calling a phase done. v1.2's integration checker re-ran the full suite live rather than trusting VERIFICATION.md's numbers, consistent with this pattern.
3. Sequencing a single "fix the shared harness once" plan ahead of parallel content-writing plans (established in v1.2) eliminates a whole class of cross-plan config conflicts — worth defaulting to whenever multiple plans in a wave depend on the same test/build harness.
