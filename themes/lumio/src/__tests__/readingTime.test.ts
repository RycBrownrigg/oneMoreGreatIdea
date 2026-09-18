import readingTime from "../lib/utils/readingTime";

describe("readingTime", () => {
  test("a short plain-text string rounds up to '01 Min read' (singular branch)", () => {
    expect(readingTime("hello world this is a test")).toBe("01 Min read");
  });

  test("an empty string produces '00 Min read' (zero words, singular branch)", () => {
    expect(readingTime("")).toBe("00 Min read");
  });

  test("a long repeated-word string produces 'N Mins read' with no leading zero (minutes >= 10)", () => {
    expect(readingTime("word ".repeat(3000))).toBe("11 Mins read");
  });
});
