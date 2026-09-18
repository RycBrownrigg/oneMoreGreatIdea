import buildToc from "../lib/utils/buildToc";

// buildToc reads settings.markup.tableOfContents from the live
// .astro/config.generated.json at import time. At the time this test was
// written, that value is { startLevel: 1, endLevel: 5, ordered: false }.
// If config.toml's [settings.markup.tableOfContents] block ever changes,
// these assertions (especially the depth-6/endLevel-5 boundary and the
// insertion-order-not-alphabetical assertion) must be revisited.
describe("buildToc", () => {
  test("nests a depth-3 heading under the preceding depth-2 heading, preserving insertion order for siblings", () => {
    const headings = [
      { depth: 2, slug: "b-heading", text: "B Heading" },
      { depth: 3, slug: "sub-heading", text: "Sub Heading" },
      { depth: 2, slug: "a-heading", text: "A Heading" },
    ];

    const toc = buildToc(headings);

    expect(toc).toHaveLength(2);
    expect(toc[0].slug).toBe("b-heading");
    expect(toc[0].subheadings).toHaveLength(1);
    expect(toc[0].subheadings?.[0].slug).toBe("sub-heading");
    expect(toc[1].slug).toBe("a-heading");
    // ordered: false -> insertion order preserved, NOT alphabetical
    // ("A Heading" would sort before "B Heading" if it were sorted).
    expect(toc.map((h) => h.slug)).toEqual(["b-heading", "a-heading"]);
  });

  test("excludes a heading whose depth falls outside [startLevel, endLevel]", () => {
    const headings = [{ depth: 6, slug: "too-deep", text: "Too Deep" }];

    const toc = buildToc(headings);

    expect(toc).toEqual([]);
  });

  test("returns an empty array for an empty headings input, without throwing", () => {
    expect(() => buildToc([])).not.toThrow();
    expect(buildToc([])).toEqual([]);
  });
});
