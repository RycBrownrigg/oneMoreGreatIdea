import type HSSelect from "@preline/select";

declare global {
  interface Window {
    HSSelect: typeof HSSelect;
  }
}

export {};
