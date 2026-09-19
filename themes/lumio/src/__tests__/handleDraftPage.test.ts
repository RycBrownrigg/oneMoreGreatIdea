import handleDraftPage from "../lib/utils/handleDraftPage";

// In a real Astro build, `import.meta.env.PROD` is injected by Vite/Astro
// at build time, and handleDraftPage returns a 404 Response for draft
// pages in production. Under Jest, `import.meta.env` is `undefined` —
// Vite/Astro's build-time env injection never runs here — so accessing
// `.PROD` on it throws a TypeError instead. This is real, observed
// harness behavior (not the production 404-Response behavior), confirmed
// by direct experimentation while writing this test, and documented here
// so it isn't mistaken for a bug later.
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
});
