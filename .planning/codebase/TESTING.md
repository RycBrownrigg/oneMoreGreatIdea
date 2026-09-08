# Testing Patterns

**Analysis Date:** 2026-09-08

All paths are relative to `themes/lumio/`.

## Test Framework

**Runner:**
- Jest 30 (`jest`)
- Config: `tsconfig.jest.json` referenced via env var in the npm script; no separate `jest.config.*` file was found during exploration — check for `jest` config embedded in `package.json` or a `jest.config` file if one exists, as it wasn't located at scan time

**Assertion Library:**
- Jest's built-in `expect` (no Chai/Sinon)

**Run Commands:**
```bash
cd themes/lumio
npm run test              # cross-env TS_NODE_PROJECT="./tsconfig.jest.json" jest --watch
```
Note: the `test` script runs in watch mode by default (`jest --watch`) — there is no separate one-shot CI-style test command defined in `package.json`.

## Test File Organization

**Location:**
- Centralized in `src/__tests__/` (not co-located with source files)

**Naming:**
- `<subjectFunctionName>.test.ts`, e.g. `getLocalUrlCTM.test.ts` tests `getLocaleUrlCTM` from `src/lib/utils/i18nUtils.ts`

**Structure:**
```
src/__tests__/
└── getLocalUrlCTM.test.ts   # only test file present at time of scan
```

## Test Structure

**Suite Organization:**
```typescript
describe("getLocaleUrlCTM", () => {
  const prependValue = "case-studies";

  test.each(paths)("Handles URL: %s", (path) => {
    const resultWithDefaultLang = getLocaleUrlCTM(path, "en", prependValue);
    const resultWithOtherLang = getLocaleUrlCTM(path, "fr", prependValue);
    // ...assertions on URL segment structure
  });
});
```

**Patterns:**
- `test.each()` with a large array of representative input URLs (with/without protocol, with/without trailing slash, with/without existing locale prefix) drives a single parameterized test — this is the idiomatic pattern to follow for testing other URL/string-transform utilities in this codebase
- Test reads live config directly: `import config from "../../.astro/config.generated.json"` then destructures `multilingual.defaultLanguage`, `multilingual.showDefaultLangInUrl`, `site.trailingSlash` to make assertions conditional on actual site configuration — this means the test's expected behavior shifts if `config.toml` settings change, and the generated JSON config must exist (via `npm run toml:watch` at least once) before running tests

## Mocking

**Framework:** None — no mocking library (`jest.mock`, `ts-mockito`) usage found in the sole existing test file

**Patterns:**
- Not established; the existing test operates on pure functions with real config data rather than mocks

**What to Mock:**
- Not yet established as a project convention — no guidance to give beyond "the existing test avoids mocking entirely by using real config output"

**What NOT to Mock:**
- Not established

## Fixtures and Factories

**Test Data:**
- Inline arrays defined directly in the test file (the `paths` array of ~30 sample URL strings in `getLocalUrlCTM.test.ts`)

**Location:**
- No separate fixtures directory; test data lives inline in the test file itself

## Coverage

**Requirements:** None enforced — no coverage threshold config found

**View Coverage:**
```bash
cd themes/lumio
npx jest --coverage
```
(Not wired into an npm script; would need to be run directly.)

## Test Types

**Unit Tests:**
- The only test type present — pure-function testing of `src/lib/utils/i18nUtils.ts`

**Integration Tests:**
- None found

**E2E Tests:**
- Not used — no Playwright/Cypress config or dependency present

## Common Patterns

**Async Testing:**
- Not demonstrated in the existing test suite (the tested function is synchronous)

**Error Testing:**
- Not demonstrated — no `expect(() => ...).toThrow()` patterns found; the codebase currently has no negative-path test coverage

---

*Testing analysis: 2026-09-08*
