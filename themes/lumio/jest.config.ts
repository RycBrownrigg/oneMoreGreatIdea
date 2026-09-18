import { createDefaultEsmPreset, type JestConfigWithTsJest } from "ts-jest";

const preset = createDefaultEsmPreset({
  // A separate TypeScript configuration file for Jest.
  tsconfig: "./tsconfig.jest.json",
});

const jestConfig: JestConfigWithTsJest = {
  ...preset,
  // `marked` ships ESM-only (package.json "type": "module"); Jest's
  // CJS-based module runtime can't parse its `export{...}` syntax
  // directly. Its UMD build is CJS-compatible and functionally
  // identical, so map the package to that build for tests only.
  moduleNameMapper: {
    "^marked$": "<rootDir>/node_modules/marked/lib/marked.umd.js",
  },
};

export default jestConfig;
