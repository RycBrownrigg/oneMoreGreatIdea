import {
  slugifyyy,
  markdownify,
  humanize,
  titleify,
  plainify,
  toUpperCase,
  toLowerCase,
  toSentenceCase,
  removeWhitespace,
} from "../lib/utils/textConverter";

describe("slugifyyy", () => {
  test("slugifies normal content to a lowercase, hyphenated slug", () => {
    expect(slugifyyy("Hello World Example")).toBe("hello-world-example");
  });

  test("returns an empty string for falsy input", () => {
    expect(slugifyyy("")).toBe("");
  });
});

describe("markdownify", () => {
  test("container=true parses as a block, wrapping output in a <p> tag", () => {
    expect(markdownify("hello world", true)).toContain("<p>hello world</p>");
  });

  test("container=false (or omitted) parses inline, with no wrapping <p> tag", () => {
    const result = markdownify("hello world", false);
    expect(result).not.toContain("<p>");
    expect(result).toContain("hello world");
  });

  test("a link containing getastrothemes gets target=_blank rel=noopener", () => {
    const result = markdownify(
      "[link](https://getastrothemes.com/theme)",
    ) as string;
    expect(result).toContain('target="_blank" rel="noopener"');
    expect(result).not.toContain("nofollow");
  });

  test("a plain external link gets the full noopener noreferrer nofollow rel", () => {
    const result = markdownify("[link](https://example.com)") as string;
    expect(result).toContain(
      'target="_blank" rel="noopener noreferrer nofollow"',
    );
  });

  test("returns an empty string for falsy input", () => {
    expect(markdownify("")).toBe("");
  });
});

describe("humanize", () => {
  test("replaces underscores/hyphens with spaces and capitalizes the first letter", () => {
    expect(humanize("hello_world-example")).toBe("Hello world example");
  });

  test("trims leading/trailing whitespace and underscores", () => {
    expect(humanize("  _hello_world_  ")).toBe("Hello world");
  });

  test("returns undefined for falsy input", () => {
    expect(humanize("")).toBeUndefined();
  });
});

describe("titleify", () => {
  test("capitalizes each word", () => {
    expect(titleify("hello_world example")).toBe("Hello World Example");
  });

  test("returns an empty string for falsy input", () => {
    expect(titleify("")).toBe("");
  });
});

describe("plainify", () => {
  test("strips HTML tags produced by marked.parse and decodes entities", () => {
    const result = plainify("Fish & Chips are <b>great</b>");
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
    expect(result).toContain("Fish & Chips are great");
  });

  test("returns an empty string for empty input", () => {
    expect(plainify("")).toBe("");
  });
});

describe("toUpperCase", () => {
  test("uppercases normal content", () => {
    expect(toUpperCase("hello")).toBe("HELLO");
  });

  test("returns an empty string for falsy input", () => {
    expect(toUpperCase("")).toBe("");
  });
});

describe("toLowerCase", () => {
  test("lowercases normal content", () => {
    expect(toLowerCase("HELLO")).toBe("hello");
  });

  test("returns an empty string for falsy input", () => {
    expect(toLowerCase("")).toBe("");
  });
});

describe("toSentenceCase", () => {
  test("capitalizes only the first letter, lowercasing the rest", () => {
    expect(toSentenceCase("HELLO WORLD")).toBe("Hello world");
  });

  test("returns an empty string for falsy input", () => {
    expect(toSentenceCase("")).toBe("");
  });
});

describe("removeWhitespace", () => {
  test("collapses internal whitespace runs to a single space and trims ends", () => {
    expect(removeWhitespace("  hello   world  \n foo  ")).toBe(
      "hello world foo",
    );
  });

  test("returns an empty string for empty input", () => {
    expect(removeWhitespace("")).toBe("");
  });
});
