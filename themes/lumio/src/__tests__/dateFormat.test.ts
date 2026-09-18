import dateFormat from "../lib/utils/dateFormat";

// Fixed test date, deliberately at noon UTC (not midnight): midnight-UTC
// timestamps shift to the previous calendar day when Intl.DateTimeFormat
// renders in a negative-offset local timezone (e.g. America/Denver,
// UTC-7), while GitHub Actions runners default to UTC — using noon UTC
// keeps the rendered calendar date identical across any realistic
// timezone this test could run in, locally or in CI.
const FIXED_DATE_STRING = "2026-01-07T12:00:00Z";
const FIXED_DATE = new Date(FIXED_DATE_STRING);

describe("dateFormat", () => {
  test("formats with the default pattern (dd MMM, yyyy)", () => {
    expect(dateFormat(FIXED_DATE)).toBe("Jan 07, 2026");
  });

  test("formats with the dd MMMM, yyyy pattern (uppercase month)", () => {
    expect(dateFormat(FIXED_DATE, "dd MMMM, yyyy")).toBe("07 JANUARY, 2026");
  });

  test("accepts a string date input identically to a Date object, for both patterns", () => {
    expect(dateFormat(FIXED_DATE_STRING)).toBe(dateFormat(FIXED_DATE));
    expect(dateFormat(FIXED_DATE_STRING, "dd MMMM, yyyy")).toBe(
      dateFormat(FIXED_DATE, "dd MMMM, yyyy"),
    );
  });

  test("throws on an unsupported pattern", () => {
    expect(() => dateFormat(FIXED_DATE, "yyyy/mm/dd")).toThrow(
      "Unsupported pattern: yyyy/mm/dd",
    );
  });
});
