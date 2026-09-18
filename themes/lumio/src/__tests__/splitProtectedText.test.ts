import { splitProtectedText } from "../lib/utils/splitProtectedText";

describe("splitProtectedText", () => {
  test("a URL with slashes survives intact as one segment", () => {
    const result = splitProtectedText(
      "Visit https://example.com/path/to/page for info",
    );

    expect(result).toEqual([
      "Visit https://example.com/path/to/page for info",
    ]);
  });

  test("real slash-separated text splits into segments", () => {
    const result = splitProtectedText("Home / About / Contact");

    expect(result).toEqual(["Home", "About", "Contact"]);
  });

  test("replaces the default {{ year }} placeholder with the current year", () => {
    const currentYear = new Date().getFullYear().toString();

    const result = splitProtectedText("Copyright {{ year }}");

    expect(result).toEqual([`Copyright ${currentYear}`]);
  });

  test("honors a custom yearPlaceholder option", () => {
    const currentYear = new Date().getFullYear().toString();

    const result = splitProtectedText("Copyright {{ YR }}", {
      yearPlaceholder: "{{ YR }}",
    });

    expect(result).toEqual([`Copyright ${currentYear}`]);
  });
});
