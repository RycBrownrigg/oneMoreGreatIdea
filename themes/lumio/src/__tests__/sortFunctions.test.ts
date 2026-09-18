import { sortByDate, sortByWeight } from "../lib/utils/sortFunctions";

describe("sortByDate", () => {
  test("sorts items by data.date in descending order", () => {
    const items = [
      { id: "a", data: { date: "2026-01-01" } },
      { id: "b", data: { date: "2026-03-01" } },
      { id: "c", data: { date: "2026-02-01" } },
    ];

    const sorted = sortByDate(items);

    expect(sorted.map((item) => item.id)).toEqual(["b", "c", "a"]);
  });

  test("handles equal dates without crashing and preserves set membership", () => {
    const items = [
      { id: "a", data: { date: "2026-01-01" } },
      { id: "b", data: { date: "2026-01-01" } },
    ];

    const sorted = sortByDate(items);

    expect(sorted).toHaveLength(2);
    expect(sorted.map((item) => item.id).sort()).toEqual(["a", "b"]);
  });
});

describe("sortByWeight", () => {
  test("sorts items by weight in ascending order", () => {
    const items = [
      { id: "c", weight: 30 },
      { id: "a", weight: 10 },
      { id: "b", weight: 20 },
    ];

    const sorted = sortByWeight(items);

    expect(sorted.map((item) => item.id)).toEqual(["a", "b", "c"]);
  });

  test("treats a null/undefined weight as Infinity, sorting it last", () => {
    const items = [
      { id: "unweighted", weight: undefined },
      { id: "low", weight: 1 },
      { id: "nullWeight", weight: null },
    ];

    const sorted = sortByWeight(items);

    expect(sorted[0].id).toBe("low");
    expect(sorted.map((item) => item.id).slice(1).sort()).toEqual(
      ["nullWeight", "unweighted"].sort(),
    );
  });

  test("recurses into children, sorting them by weight too", () => {
    const items = [
      {
        id: "parent",
        weight: 1,
        children: [
          { id: "child-b", weight: 2 },
          { id: "child-a", weight: 1 },
        ],
      },
    ];

    const sorted = sortByWeight(items);

    expect(sorted[0].children?.map((c) => c.id)).toEqual([
      "child-a",
      "child-b",
    ]);
  });

  test("does not mutate the original array", () => {
    const items = [
      { id: "b", weight: 2 },
      { id: "a", weight: 1 },
    ];
    const originalOrder = items.map((item) => item.id);

    sortByWeight(items);

    expect(items.map((item) => item.id)).toEqual(originalOrder);
  });
});
