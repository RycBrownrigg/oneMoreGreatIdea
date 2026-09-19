import handleDraftPage from "../lib/utils/handleDraftPage";

// The optional second `isProd` parameter lets a test supply the production
// flag directly, so the 404 branch is exercised for real here rather than
// merely asserted to throw. When the parameter is omitted, the function
// falls back to the build-time `import.meta.env.PROD` read, which is
// absent under Jest and therefore resolves falsy — the case pinned down
// by the omitted-argument test below, which mirrors the 5 production call
// sites that all call this function with a single argument.
describe("handleDraftPage", () => {
  test("returns undefined when draft is false (short-circuits before import.meta.env)", () => {
    expect(handleDraftPage({ draft: false })).toBeUndefined();
  });

  test("returns a 404 Response when draft is true and isProd is explicitly true", () => {
    const result = handleDraftPage({ draft: true }, true);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(404);
    expect(result?.statusText).toBe("Not Found");
  });

  test("returns undefined when draft is false even if isProd is explicitly true", () => {
    expect(handleDraftPage({ draft: false }, true)).toBeUndefined();
  });

  test("returns undefined when draft is true but isProd is explicitly false (dev passthrough)", () => {
    expect(handleDraftPage({ draft: true }, false)).toBeUndefined();
  });

  test("returns undefined when draft is true and isProd is omitted (Jest has no build-time env)", () => {
    expect(handleDraftPage({ draft: true })).toBeUndefined();
  });
});
