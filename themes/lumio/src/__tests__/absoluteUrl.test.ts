import { absoluteUrl } from "../lib/utils/absoluteUrl";

// absoluteUrl(url, Astro) reads Astro.url.href and resolves `url` against
// it via the URL constructor. A plain object literal with a real URL is
// sufficient — no actual Astro global is needed.
describe("absoluteUrl", () => {
  test("resolves a root-relative path against Astro.url's origin (root-relative, not relative to the path segment)", () => {
    const fakeAstro = { url: new URL("https://example.com/base/") };

    expect(absoluteUrl("/logo.png", fakeAstro)).toBe(
      "https://example.com/logo.png",
    );
  });

  test("passes an already-absolute URL through unchanged", () => {
    const fakeAstro = { url: new URL("https://example.com/base/") };

    expect(absoluteUrl("https://other.com/x", fakeAstro)).toBe(
      "https://other.com/x",
    );
  });
});
