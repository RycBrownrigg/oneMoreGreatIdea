import { recursiveCloneObject } from "../lib/utils/objectFunctions";

describe("recursiveCloneObject", () => {
  test("deep-clones a nested object/array, independent of the original", () => {
    const original = { a: 1, b: { c: 2 } };

    const clone = recursiveCloneObject(original);
    clone.b.c = 99;

    expect(original.b.c).toBe(2);
    expect(clone.b.c).toBe(99);
  });

  test("returns primitive input as-is, not wrapped", () => {
    expect(recursiveCloneObject(42)).toBe(42);
    expect(recursiveCloneObject("hello")).toBe("hello");
    expect(recursiveCloneObject(null)).toBeNull();
  });

  test("preserves array-ness and nested-object-ness in the clone", () => {
    const original = [{ id: 1, tags: ["a", "b"] }, { id: 2 }];

    const clone = recursiveCloneObject(original);

    expect(Array.isArray(clone)).toBe(true);
    expect(clone).toEqual(original);
    expect(clone[0]).not.toBe(original[0]);
    expect(clone[0].tags).not.toBe(original[0].tags);
  });
});
