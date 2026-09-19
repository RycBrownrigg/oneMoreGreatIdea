import { getPrelineSelectConfig } from "../lib/utils/preline";

describe("getPrelineSelectConfig", () => {
  test("defaults hasSearch to false and forces searchPlaceholder to empty string regardless of input", () => {
    const config = getPrelineSelectConfig({ placeholder: "Choose" });

    expect(config.hasSearch).toBe(false);
    expect(config.searchPlaceholder).toBe("");
    expect(config.placeholder).toBe("Choose");
  });

  test("falls back to the default search placeholder text when hasSearch is true and none is supplied", () => {
    const config = getPrelineSelectConfig({
      placeholder: "Choose",
      hasSearch: true,
    });

    expect(config.hasSearch).toBe(true);
    expect(config.searchPlaceholder).toBe("Search...");
  });
});
