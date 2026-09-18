import trailingSlashChecker from "../lib/utils/trailingSlashChecker";

// config.site.trailingSlash is currently `true` in this project's
// .astro/config.generated.json — assertions below are written relative
// to that value, not assumed. If the config value ever changes, these
// assertions must be flipped accordingly.
describe("trailingSlashChecker", () => {
  test("adds a trailing slash to a URL that lacks one (trailingSlash: true)", () => {
    expect(trailingSlashChecker("/about")).toBe("/about/");
  });

  test("leaves a URL that already has a trailing slash unchanged", () => {
    expect(trailingSlashChecker("/about/")).toBe("/about/");
  });

  test("preserves a #fragment, reattaching it after the slash adjustment", () => {
    expect(trailingSlashChecker("/about#team")).toBe("/about/#team");
  });

  test("does not duplicate the fragment when the path already has a trailing slash", () => {
    expect(trailingSlashChecker("/about/#team")).toBe("/about/#team");
  });
});
