import generateTypeScale from "../lib/utils/generateTypeScale";

describe("generateTypeScale", () => {
  test("a typical ratio (1.25) produces the expected 6-step descending scale", () => {
    expect(generateTypeScale(1.25)).toEqual([
      "3.05",
      "2.44",
      "1.95",
      "1.56",
      "1.25",
      "1.00",
    ]);
  });

  test("ratio of 1 produces all '1.00' entries (every power of 1 is 1)", () => {
    expect(generateTypeScale(1)).toEqual([
      "1.00",
      "1.00",
      "1.00",
      "1.00",
      "1.00",
      "1.00",
    ]);
  });

  test("ratio of 0: all entries are '0.00' except the last, which is '1.00' (0^0 === 1 in JS)", () => {
    expect(generateTypeScale(0)).toEqual([
      "0.00",
      "0.00",
      "0.00",
      "0.00",
      "0.00",
      "1.00",
    ]);
  });
});
