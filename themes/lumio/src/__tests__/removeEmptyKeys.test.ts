import removeEmptyKeys from "../lib/utils/removeEmptyKeys";

describe("removeEmptyKeys", () => {
  test("deletes empty-string/empty-array/empty-object keys, preserves null and non-empty values, recurses into nested objects", () => {
    const input = {
      a: "",
      b: [],
      c: {},
      d: null,
      e: "keep",
      f: { g: "" },
    };

    const result = removeEmptyKeys(input);

    expect(result).toEqual({ d: null, e: "keep" });
  });

  test("returns an object with no empty values unchanged", () => {
    const input = { a: "keep", b: [1, 2], c: { d: "nested" } };

    const result = removeEmptyKeys(input);

    expect(result).toEqual({ a: "keep", b: [1, 2], c: { d: "nested" } });
  });

  test("handles an already-empty object without throwing", () => {
    expect(() => removeEmptyKeys({})).not.toThrow();
    expect(removeEmptyKeys({})).toEqual({});
  });
});
