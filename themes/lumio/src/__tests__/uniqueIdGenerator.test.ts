import uniqueIdGenerator from "../lib/utils/uniqueIdGenerator";

describe("uniqueIdGenerator", () => {
  test("returns the identical cached id for the same input across repeated calls", () => {
    const first = uniqueIdGenerator("Hello World Test Input");
    const second = uniqueIdGenerator("Hello World Test Input");

    expect(second).toBe(first);
  });

  test("does not throw on an empty string and returns a defined string value", () => {
    let result: string | undefined;

    expect(() => {
      result = uniqueIdGenerator("");
    }).not.toThrow();

    expect(typeof result).toBe("string");
  });
});
