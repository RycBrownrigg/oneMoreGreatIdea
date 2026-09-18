import {
  isActiveUrl,
  isActiveMenu,
} from "../lib/utils/navigationActive";
import type { ChildNavigationLink } from "@/types";

// navigationActive resolves URLs against the live site.baseUrl in
// .astro/config.generated.json (currently "https://onemoregreatidea.com").
// Assertions below rely on that value only insofar as an absolute
// external URL never matches it, which holds for any real baseUrl.
describe("isActiveUrl", () => {
  test("returns false for an absolute external URL, regardless of currentPath", () => {
    expect(isActiveUrl("https://external.com/foo", "/foo", "en")).toBe(
      false,
    );
  });

  test("returns false without throwing when url is undefined", () => {
    expect(() => isActiveUrl(undefined, "/anything", "en")).not.toThrow();
    expect(isActiveUrl(undefined, "/anything", "en")).toBe(false);
  });
});

describe("isActiveMenu", () => {
  const baseChild = (
    overrides: Partial<ChildNavigationLink>,
  ): ChildNavigationLink => ({
    enable: true,
    name: "Item",
    description: "",
    icon: "",
    ...overrides,
  });

  test("returns false when the item is disabled, even if its url exactly matches currentPath", () => {
    const menu = baseChild({ enable: false, url: "/services" });

    expect(isActiveMenu(menu, "/services", "en")).toBe(false);
  });

  test("recurses into children: a matching child url makes the non-matching parent active, and no match anywhere returns false", () => {
    const menu = baseChild({
      url: "/parent",
      children: [baseChild({ url: "/child" })],
    });

    expect(isActiveMenu(menu, "/child", "en")).toBe(true);
    expect(isActiveMenu(menu, "/unrelated", "en")).toBe(false);
  });
});
