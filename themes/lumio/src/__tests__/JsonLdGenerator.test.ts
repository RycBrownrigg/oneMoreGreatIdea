import JsonLdGenerator from "../lib/utils/JsonLdGenerator";

// JsonLdGenerator needs a `config` object (normally the compiled
// config.generated.json) inside its `content` argument, plus a minimal
// fake `Astro` object. This exercises the real cross-module calls to
// absoluteUrl and trailingSlashChecker (neither is mocked) — the latter
// reads this project's live .astro/config.generated.json, which has
// site.trailingSlash: true.
const fakeConfig = {
  settings: {
    multilingual: {
      defaultLanguage: "en",
    },
  },
  site: {
    title: "Test Site",
    tagline: "Test Tagline",
    taglineSeparator: " - ",
    description: "Test description",
    logo: "/logo.png",
  },
  seo: {
    author: "Test Author",
  },
};

const fakeAstro = {
  url: new URL("https://example.com/about"),
  currentLocale: "en",
};

describe("JsonLdGenerator", () => {
  test("generates a WebPage JSON-LD object with real absoluteUrl/trailingSlashChecker wiring", () => {
    const result = JsonLdGenerator(
      { canonical: "/about", title: "About", config: fakeConfig },
      fakeAstro,
    );

    expect(result["@type"]).toBe("WebPage");
    expect(result.isPartOf.url).toBe("https://example.com/");
    expect(result.publisher.logo.url).toBe("https://example.com/logo.png");
  });

  test("falls back to config.settings.multilingual.defaultLanguage when lang is omitted", () => {
    const result = JsonLdGenerator(
      { canonical: "/about", title: "About", config: fakeConfig },
      fakeAstro,
    );

    expect(result.inLanguage).toBe(
      fakeConfig.settings.multilingual.defaultLanguage,
    );
  });
});
