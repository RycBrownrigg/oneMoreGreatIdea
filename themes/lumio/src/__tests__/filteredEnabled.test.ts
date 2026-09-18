import { filteredEnabled } from "../lib/utils/filteredEnabled";

describe("filteredEnabled", () => {
  test("filters an array down to items whose enable is truthy, leaving them unchanged", () => {
    const menu = [
      { id: 1, enable: true },
      { id: 2, enable: false },
    ];

    expect(filteredEnabled(menu)).toEqual([{ id: 1, enable: true }]);
  });

  test("a nested plain-object property with no enable key of its own becomes {} after recursion", () => {
    const menu = [{ name: "Parent", enable: true, sub: { name: "Child" } }];

    expect(filteredEnabled(menu)).toEqual([
      { name: "Parent", enable: true, sub: {} },
    ]);
  });

  test("an empty input array returns [] without throwing", () => {
    expect(filteredEnabled([])).toEqual([]);
  });
});
