import getRelatedContent from "../lib/utils/getRelatedContent";

describe("getRelatedContent", () => {
  const currentContent = {
    data: {
      title: "Current",
      categories: ["astro"],
      description: "building websites fast",
    },
  };

  test("matches on shared category and word overlap, excluding both the unrelated item and the current content itself", () => {
    const relatedItem = {
      data: {
        title: "Related",
        categories: ["astro"], // shares category "astro" with currentContent
        description: "building modern software", // shares word "building" (>4 chars) with currentContent
      },
    };

    const unrelatedItem = {
      data: {
        title: "Unrelated",
        categories: ["other"], // no shared category
        description: "totally different content", // no shared words
      },
    };

    const currentContentDuplicate = {
      data: {
        title: "Current", // same title as currentContent -> must be self-excluded
        categories: ["something"],
        description: "does not matter",
      },
    };

    const contentList = [unrelatedItem, relatedItem, currentContentDuplicate];

    const result = getRelatedContent(contentList, currentContent);

    expect(result).toEqual([relatedItem]);
    expect(result).not.toContainEqual(unrelatedItem);
    expect(result).not.toContainEqual(currentContentDuplicate);
  });

  test("returns an empty array for an empty contentList without throwing", () => {
    expect(() => getRelatedContent([], currentContent)).not.toThrow();
    expect(getRelatedContent([], currentContent)).toEqual([]);
  });

  test("caps the result at the default limit of 3 even when more items match", () => {
    const makeItem = (n: number) => ({
      data: {
        title: `Item${n}`,
        categories: ["astro"],
        description: "building something",
      },
    });

    const contentList = [
      makeItem(1),
      makeItem(2),
      makeItem(3),
      makeItem(4),
      makeItem(5),
    ];

    const result = getRelatedContent(contentList, currentContent);

    expect(result).toHaveLength(3);
  });
});
