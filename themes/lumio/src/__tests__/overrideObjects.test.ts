import overrideObjects from "../lib/utils/overrideObjects";

describe("overrideObjects", () => {
  test("recursively merges nested objects, preserving untouched keys", () => {
    const target = { a: 1, nested: { x: 1, y: 2 } };
    const source = { nested: { y: 99 } };

    const result = overrideObjects(target, source);

    expect(result).toEqual({ a: 1, nested: { x: 1, y: 99 } });
  });

  test("wholesale-replaces target arrays rather than merging/concatenating", () => {
    const target = { list: [1, 2, 3] };
    const source = { list: [9] };

    const result = overrideObjects(target, source);

    expect(result).toEqual({ list: [9] });
  });

  test("does not mutate the original target object", () => {
    const target = { a: 1, nested: { x: 1, y: 2 } };
    const source = { nested: { y: 99 } };

    overrideObjects(target, source);

    expect(target).toEqual({ a: 1, nested: { x: 1, y: 2 } });
  });
});
