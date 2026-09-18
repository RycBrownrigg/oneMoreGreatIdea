import { createDefaultEsmPreset, type JestConfigWithTsJest } from "ts-jest";

const preset = createDefaultEsmPreset({
  // A separate TypeScript configuration file for Jest.
  tsconfig: "./tsconfig.jest.json",
});

const jestConfig: JestConfigWithTsJest = {
  ...preset,
  // Real ESM mode (NODE_OPTIONS=--experimental-vm-modules, set in
  // package.json's test/test:ci scripts) lets Jest resolve `marked`'s
  // native ESM build directly, so no `^marked$` -> UMD-build mapping is
  // needed anymore (keeping it alongside real ESM mode breaks
  // textConverter.test.ts with "does not provide an export named
  // 'marked'"). Two mappings remain, both required for modules that
  // import `@/*` aliases or the bare `.astro/config.generated.json`
  // specifier (handleDraftPage.ts, buildToc.ts, navigationActive.ts,
  // JsonLdGenerator.ts):
  // - `@/*` mirrors tsconfig.jest.json's `paths` entry for *runtime*
  //   resolution — ts-jest only uses tsconfig `paths` for type-checking.
  // - `.astro/config.generated.json` resolves the exact bare,
  //   non-relative specifier some modules import verbatim (mirroring
  //   how astro.config.mjs imports it); Node's resolver can't resolve a
  //   bare specifier starting with a literal dot on its own.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^\\.astro/config\\.generated\\.json$":
      "<rootDir>/.astro/config.generated.json",
  },
};

export default jestConfig;
