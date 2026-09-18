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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | — | 3 | Initial launch-quality punch list; git initialized for the project |
| v1.1 | 2 | 2 | First real CI pipeline + public GitHub remote; subagent stalls led to direct-execution-and-verify becoming the working pattern |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|--------------------|
| v1.0 | 43 (1 suite) | `FormHandle.ts` typing + i18n URL util only | — |
| v1.1 | 86 (7 suites) | + 6 pure utility modules (date, text, sort, object, protected-text-split, trailing-slash) | 0 (marked/slugify already present; UMD-build mapping is test-config only) |

### Top Lessons (Verified Across Milestones)

1. Treat "should already work" planning assumptions about test-harness compatibility as unverified until a real test exercises that exact code path — v1.1 hit this twice (jest.config.ts's `.astro/types.d.ts` gap in Phase 4, `marked`'s ESM-only packaging in Phase 5).
2. Real, reproduced verification (live CI runs, mutation checks re-run independently) catches things a plan's own claims and a SUMMARY's prose cannot — worth the extra step every time before calling a phase done.
